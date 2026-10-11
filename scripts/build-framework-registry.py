#!/usr/bin/env python3
"""Build the deterministic Simai Framework Contract Registry v1."""

from __future__ import annotations

import argparse
import copy
import hashlib
import json
import os
import re
import sys
from pathlib import Path
from typing import Any


PROFILE = "plain-assets-v1"
KINDS = ("utility", "component", "smart-component", "recipe")
HEX40 = re.compile(r"^[0-9a-f]{40}$")
HEX64 = re.compile(r"^[0-9a-f]{64}$")
# A v1 release names two repositories, so its id names two commits. A v2
# release is one `ui` build commit, so its id names one; the v1-shaped id
# survives as the lock's `pair` while `ui-smart` is kept as a mirror.
COMPATIBILITY_ID = re.compile(r"^ui-[0-9a-f]{12}-smart-[0-9a-f]{12}$")
PAIR_ID = COMPATIBILITY_ID
COMPATIBILITY_ID_V2 = re.compile(r"^ui-[0-9a-f]{12}$")
LOCK_VERSIONS = (1, 2)
UI_OWNER = "simai/ui"
MIRROR_OWNER = "simai/ui-smart"
SMART_MANIFEST_PATH = "contracts/owners/smart-component.manifest.json"
ENTRY_KEYS = {
    "id",
    "kind",
    "name",
    "title",
    "owner",
    "lifecycle",
    "readiness",
    "provenance",
    "documentation_refs",
    "example_refs",
    "runtime",
    "requires",
    "curated_for",
}
PUBLIC_ID = re.compile(
    r"^(utility|component|smart|recipe)\.[a-z][a-z0-9]*(?:-[a-z0-9]+)*"
    r"(?:\.[a-z][a-z0-9]*(?:-[a-z0-9]+)*)*$"
)
VERSION_SEGMENT = re.compile(r"^v[0-9]+$")
LEGACY_VERSION_TOKEN = "".join(("s", "f", "5"))
FORBIDDEN_REF_PARTS = tuple(
    "/" + segment + "/" for segment in ("Users", "home", "private")
) + ("file:" + "//", "../")


class ContractError(ValueError):
    """Raised when a source contract fails closed."""


def load_json(path: Path) -> dict[str, Any]:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as error:
        raise ContractError(f"json_unreadable:{path}") from error
    if not isinstance(value, dict):
        raise ContractError(f"json_object_required:{path}")
    return value


def canonical_json(value: Any) -> bytes:
    return json.dumps(
        value,
        ensure_ascii=False,
        sort_keys=True,
        separators=(",", ":"),
    ).encode("utf-8")


def canonical_manifest_hash(manifest: dict[str, Any]) -> str:
    normalized = copy.deepcopy(manifest)
    entries = normalized.get("entries")
    if isinstance(entries, list):
        normalized["entries"] = sorted(entries, key=lambda entry: entry.get("id", ""))
    return hashlib.sha256(canonical_json(normalized)).hexdigest()


def pretty_json(value: Any) -> str:
    return json.dumps(value, ensure_ascii=False, sort_keys=True, indent=2) + "\n"


def css_custom_property(css: str, name: str) -> str:
    pattern = re.compile(rf"{re.escape(name)}\s*:\s*([^;{{}}]+);")
    match = pattern.search(css)
    if match is None:
        raise ContractError(f"documentation_token_missing:{name}")
    return match.group(1).strip()


def component_public_surface(ui_root: Path, runtime: dict[str, Any]) -> dict[str, Any]:
    asset_root = runtime.get("asset_root")
    if not isinstance(asset_root, str):
        return {}
    root = ui_root / asset_root
    if not root.is_dir() or root.is_symlink():
        return {}
    classes: set[str] = set()
    custom_properties: set[str] = set()
    for path in sorted(root.rglob("*.css")):
        if path.name.endswith(".min.css") or path.is_symlink():
            continue
        css = path.read_text(encoding="utf-8")
        css_without_comments = re.sub(r"/\*.*?\*/", "", css, flags=re.DOTALL)
        for selector in re.findall(r"([^{}]+)\{", css_without_comments):
            if selector.lstrip().startswith("@"):
                continue
            classes.update(
                value.replace("\\", "")
                for value in re.findall(r"\.([A-Za-z_][A-Za-z0-9_-]*)", selector)
            )
        custom_properties.update(re.findall(r"--sf-[A-Za-z0-9_\\/-]+", css))
    surface: dict[str, Any] = {}
    if classes:
        surface["classes"] = sorted(classes)
    if custom_properties:
        surface["custom_properties"] = sorted(custom_properties)
    return surface


def title_for(name: str) -> str:
    return name.replace("-", " ").replace(".", " ").title()


def public_slug(name: str) -> str:
    kebab = re.sub(r"([a-z0-9])([A-Z])", r"\1-\2", name).replace("_", "-").lower()
    return re.sub(r"-+", "-", kebab).strip("-")


def validate_public_id(public_id: str, expected_kind: str | None = None) -> None:
    if not PUBLIC_ID.fullmatch(public_id):
        raise ContractError(f"public_id_invalid:{public_id}")
    if "_" in public_id:
        raise ContractError(f"public_id_underscore_forbidden:{public_id}")
    if LEGACY_VERSION_TOKEN in public_id.lower():
        raise ContractError(f"public_id_version_marker_forbidden:{public_id}")
    if any(VERSION_SEGMENT.fullmatch(segment) for segment in public_id.split(".")):
        raise ContractError(f"public_id_version_segment_forbidden:{public_id}")
    prefix = "smart" if expected_kind == "smart-component" else expected_kind
    if prefix is not None and public_id.split(".", 1)[0] != prefix:
        raise ContractError(f"public_id_kind_mismatch:{public_id}:{expected_kind}")


def validate_refs(refs: Any, label: str) -> list[str]:
    if not isinstance(refs, list) or any(not isinstance(ref, str) for ref in refs):
        raise ContractError(f"reference_list_invalid:{label}")
    for ref in refs:
        if any(part in ref for part in FORBIDDEN_REF_PARTS):
            raise ContractError(f"reference_not_portable:{label}:{ref}")
    return sorted(set(refs))


def validate_readiness(value: Any, public_id: str) -> dict[str, Any]:
    if not isinstance(value, dict):
        raise ContractError(f"readiness_invalid:{public_id}")
    expected = {"status", "safe_to_suggest", "profiles", "blockers"}
    if set(value) != expected:
        raise ContractError(f"readiness_keys_invalid:{public_id}")
    status = value["status"]
    safe = value["safe_to_suggest"]
    if status not in {"ready", "discoverable", "blocked"} or not isinstance(safe, bool):
        raise ContractError(f"readiness_value_invalid:{public_id}")
    if status != "ready" and safe:
        raise ContractError(f"readiness_fail_open:{public_id}")
    if value["profiles"] != [PROFILE]:
        raise ContractError(f"readiness_profile_mismatch:{public_id}")
    blockers = value["blockers"]
    if not isinstance(blockers, list) or any(not isinstance(item, str) for item in blockers):
        raise ContractError(f"readiness_blockers_invalid:{public_id}")
    if status == "blocked" and blockers == []:
        raise ContractError(f"readiness_blocker_missing:{public_id}")
    return {
        "status": status,
        "safe_to_suggest": safe,
        "profiles": [PROFILE],
        "blockers": sorted(set(blockers)),
    }


def validate_manifest_envelope(manifest: dict[str, Any], kind: str) -> None:
    if manifest.get("schema_id") != "simai.framework.owner-manifest":
        raise ContractError(f"manifest_schema_invalid:{kind}")
    if manifest.get("schema_version") != 1 or manifest.get("kind") != kind:
        raise ContractError(f"manifest_kind_invalid:{kind}")
    owner = manifest.get("owner")
    if not isinstance(owner, dict) or set(owner) != {"id", "repository", "manifest_path"}:
        raise ContractError(f"manifest_owner_invalid:{kind}")
    release = manifest.get("release")
    if not isinstance(release, dict) or not re.fullmatch(r"[0-9a-f]{40}", str(release.get("commit", ""))):
        raise ContractError(f"manifest_release_invalid:{kind}")
    defaults = manifest.get("defaults")
    if not isinstance(defaults, dict) or defaults.get("lifecycle") not in {
        "released",
        "experimental",
        "deprecated",
        "retired",
    }:
        raise ContractError(f"manifest_defaults_invalid:{kind}")
    validate_readiness(defaults.get("readiness"), f"{kind}.defaults")
    entries = manifest.get("entries")
    if not isinstance(entries, list):
        raise ContractError(f"manifest_entries_invalid:{kind}")
    ids: list[str] = []
    for entry in entries:
        if not isinstance(entry, dict) or not isinstance(entry.get("id"), str):
            raise ContractError(f"manifest_entry_invalid:{kind}")
        validate_public_id(entry["id"], kind)
        ids.append(entry["id"])
    if len(ids) != len(set(ids)):
        raise ContractError(f"manifest_entry_duplicate:{kind}")


def source_prefix(manifest: dict[str, Any]) -> str:
    return f"{manifest['owner']['id']}@{manifest['release']['commit']}:"


def plain_asset_refs(root: Path, manifest: dict[str, Any], relative: Path) -> list[str]:
    directory = root / relative
    if not directory.is_dir():
        raise ContractError(f"runtime_directory_missing:{relative.as_posix()}")
    return [
        source_prefix(manifest) + path.relative_to(root).as_posix()
        for path in sorted(directory.rglob("*"))
        if path.is_file() and not path.name.endswith(".gz")
    ]


def optional_plain_asset_refs(
    root: Path, manifest: dict[str, Any], relative: Path
) -> list[str] | None:
    if not (root / relative).is_dir():
        return None
    return plain_asset_refs(root, manifest, relative)


def base_entry(
    manifest: dict[str, Any],
    public_id: str,
    name: str,
    runtime: dict[str, Any],
    source_refs: list[str],
    requires: list[str] | None = None,
) -> dict[str, Any]:
    defaults = manifest["defaults"]
    release = manifest["release"]
    return {
        "id": public_id,
        "kind": manifest["kind"],
        "name": name,
        "title": title_for(name),
        "owner": manifest["owner"]["id"],
        "lifecycle": defaults["lifecycle"],
        "readiness": copy.deepcopy(defaults["readiness"]),
        "provenance": {
            "repository": manifest["owner"]["repository"],
            "tag": release.get("tag"),
            "commit": release["commit"],
            "source_refs": sorted(source_refs),
        },
        "documentation_refs": list(defaults.get("documentation_refs", [])),
        "example_refs": list(defaults.get("example_refs", [])),
        "runtime": runtime,
        "requires": sorted(set(requires or [])),
        "curated_for": [],
    }


def apply_overrides(
    entries: dict[str, dict[str, Any]], manifest: dict[str, Any]
) -> None:
    for override in manifest["entries"]:
        public_id = override["id"]
        if public_id not in entries:
            raise ContractError(f"manifest_override_unknown:{public_id}")
        for key, value in override.items():
            if key != "id":
                entries[public_id][key] = copy.deepcopy(value)


def relation_id(name: str, rule_kinds: dict[str, str]) -> str:
    if name.startswith("cl-"):
        return f"smart.{name[3:]}"
    if rule_kinds.get(name) in {"component", "attribute"}:
        return f"component.{public_slug(name)}"
    if rule_kinds.get(name) == "utility":
        return f"utility.{name.split('/', 1)[0]}"
    raise ContractError(f"relation_target_unknown:{name}")


def derive_utility_entries(
    ui_root: Path,
    manifest: dict[str, Any],
    rules: list[dict[str, Any]],
) -> dict[str, dict[str, Any]]:
    utility_rules = [rule for rule in rules if "type" not in rule]
    expected = manifest["inventory"]["expected"]
    if len(utility_rules) != expected["rules"]:
        raise ContractError(f"utility_rule_count_mismatch:{len(utility_rules)}")
    grouped: dict[str, list[dict[str, Any]]] = {}
    for rule in utility_rules:
        family = rule["name"].split("/", 1)[0]
        grouped.setdefault(family, []).append(rule)
    if len(grouped) != expected["entries"]:
        raise ContractError(f"utility_family_count_mismatch:{len(grouped)}")
    entries: dict[str, dict[str, Any]] = {}
    for family, family_rules in grouped.items():
        public_id = f"utility.{family}"
        validate_public_id(public_id, "utility")
        rule_names = sorted(rule["name"] for rule in family_rules)
        relative = Path("distr/utility") / family
        assets = optional_plain_asset_refs(ui_root, manifest, relative)
        source_refs = [
            source_prefix(manifest) + f"distr/rule/rule.json#family={family}"
        ]
        if assets is not None:
            source_refs.append(source_prefix(manifest) + relative.as_posix())
        entry = base_entry(
            manifest,
            public_id,
            family,
            {
                "rule_names": rule_names,
                "asset_root": relative.as_posix(),
                "plain_asset_count": len(assets or []),
                "rule_count": len(family_rules),
            },
            source_refs,
        )
        if assets is None:
            entry["readiness"] = {
                "status": "blocked",
                "safe_to_suggest": False,
                "profiles": [PROFILE],
                "blockers": [f"runtime_directory_missing:{relative.as_posix()}"],
            }
        entries[public_id] = entry
    apply_overrides(entries, manifest)
    return entries


def derive_component_entries(
    ui_root: Path,
    manifest: dict[str, Any],
    rules: list[dict[str, Any]],
    rule_kinds: dict[str, str],
) -> dict[str, dict[str, Any]]:
    component_rules = [rule for rule in rules if rule.get("type") == "component"]
    expected = manifest["inventory"]["expected"]
    if len(component_rules) != expected["rules"]:
        raise ContractError(f"component_count_mismatch:{len(component_rules)}")
    entries: dict[str, dict[str, Any]] = {}
    for rule in component_rules:
        name = rule["name"]
        public_id = f"component.{public_slug(name)}"
        validate_public_id(public_id, "component")
        entries[public_id] = base_entry(
            manifest,
            public_id,
            name,
            {
                "rule_name": name,
                "asset_root": f"distr/component/{name}",
                "plain_asset_count": len(
                    plain_asset_refs(
                        ui_root, manifest, Path("distr/component") / name
                    )
                ),
                "declared": {
                    "js": bool(rule.get("js", False)),
                    "css": bool(rule.get("css", False)),
                },
            },
            [source_prefix(manifest) + f"distr/rule/rule.json#name={name}"],
            [relation_id(item["name"], rule_kinds) for item in rule.get("relation", [])],
        )
    apply_overrides(entries, manifest)
    return entries


def explicit_entries(manifest: dict[str, Any]) -> dict[str, dict[str, Any]]:
    entries: dict[str, dict[str, Any]] = {}
    for item in manifest["entries"]:
        if set(item) != ENTRY_KEYS:
            raise ContractError(f"explicit_entry_keys_invalid:{item.get('id', 'unknown')}")
        entries[item["id"]] = copy.deepcopy(item)
    return entries


def validate_normalized_entry(entry: dict[str, Any]) -> None:
    public_id = entry.get("id")
    if not isinstance(public_id, str) or set(entry) != ENTRY_KEYS:
        raise ContractError(f"entry_shape_invalid:{public_id}")
    validate_public_id(public_id, entry["kind"])
    if entry["lifecycle"] not in {"released", "experimental", "deprecated", "retired"}:
        raise ContractError(f"entry_lifecycle_invalid:{public_id}")
    entry["readiness"] = validate_readiness(entry["readiness"], public_id)
    if not isinstance(entry["provenance"], dict):
        raise ContractError(f"entry_provenance_invalid:{public_id}")
    source_refs = entry["provenance"].get("source_refs")
    entry["provenance"]["source_refs"] = validate_refs(source_refs, public_id)
    entry["documentation_refs"] = validate_refs(entry["documentation_refs"], public_id)
    entry["example_refs"] = validate_refs(entry["example_refs"], public_id)
    if not isinstance(entry["runtime"], dict):
        raise ContractError(f"entry_runtime_invalid:{public_id}")
    if not isinstance(entry["requires"], list) or not isinstance(entry["curated_for"], list):
        raise ContractError(f"entry_relations_invalid:{public_id}")
    for relation in entry["requires"] + entry["curated_for"]:
        validate_public_id(relation)
    entry["requires"] = sorted(set(entry["requires"]))
    entry["curated_for"] = sorted(set(entry["curated_for"]))


def validate_lock(lock: dict[str, Any]) -> None:
    """Validate a release lock by its own version.

    The 192 v1 locks stay valid as they were written; a v2 lock is the shape
    every release after the move of Smart into `ui` is written in.
    """
    if lock.get("schema_id") != "simai.framework.release-lock" or lock.get("schema_version") not in LOCK_VERSIONS:
        raise ContractError("release_lock_schema_invalid")
    if lock["schema_version"] == 2:
        validate_lock_v2(lock)
    else:
        validate_lock_v1(lock)


def validate_runtime_source(source: Any, key: str, owner: str, runtime_path: str) -> None:
    if not isinstance(source, dict):
        raise ContractError(f"release_lock_source_invalid:{key}")
    if source.get("owner") != owner or source.get("runtime_path") != runtime_path:
        raise ContractError(f"release_lock_source_identity_invalid:{key}")
    if source.get("tag") is not None or source.get("tag_object") is not None:
        raise ContractError(f"release_lock_candidate_must_be_untagged:{key}")
    if any(not HEX40.fullmatch(str(source.get(field, ""))) for field in ("commit", "tree", "runtime_tree")):
        raise ContractError(f"release_lock_source_revision_invalid:{key}")
    if not HEX64.fullmatch(str(source.get("archive_sha256", ""))):
        raise ContractError(f"release_lock_source_hash_invalid:{key}")


V2_SOURCE_KEYS = {
    "owner",
    "tag",
    "tag_object",
    "revision",
    "commit",
    "tree",
    "runtime_path",
    "runtime_tree",
    "archive_sha256",
}
V2_MIRROR_KEYS = {
    "owner",
    "tag",
    "tag_object",
    "commit",
    "tree",
    "runtime_path",
    "runtime_tree",
    "archive_sha256",
    "mirrors",
}
V2_TOP_KEYS = {
    "schema_id",
    "schema_version",
    "compatibility_id",
    "status",
    "profile",
    "runtime_sources",
    "build_inputs",
    "inventory",
    "exclusions",
    "claims",
}


def validate_lock_v2(lock: dict[str, Any]) -> None:
    """One `ui` build commit is the release.

    `revision` is that commit, the same for both trees. `commit` is the build
    commit that last wrote the tree as of the release, which is what a consumer
    resolves a release by (it reads `git log -1 -- <runtime_path>`): for Core it
    is always the release itself, for Smart it is the release or an earlier
    build commit whose Smart bytes this release did not change. The tree and the
    archive are taken at `commit`, so each entry is self-consistent as in v1.
    """
    if set(lock) - {"mirror", "pair"} != V2_TOP_KEYS:
        raise ContractError("release_lock_keys_invalid")
    compatibility_id = lock.get("compatibility_id")
    if not isinstance(compatibility_id, str) or not COMPATIBILITY_ID_V2.fullmatch(compatibility_id):
        raise ContractError("release_lock_pair_invalid")
    if lock.get("status") != "bounded" or lock.get("profile") != PROFILE:
        raise ContractError("release_lock_profile_invalid")
    sources = lock.get("runtime_sources")
    if not isinstance(sources, dict) or set(sources) != {"core", "smart"}:
        raise ContractError("release_lock_sources_invalid")
    for key, runtime_path in (("core", "distr"), ("smart", "distr/smart")):
        validate_runtime_source(sources[key], key, UI_OWNER, runtime_path)
        if set(sources[key]) != V2_SOURCE_KEYS:
            raise ContractError(f"release_lock_source_keys_invalid:{key}")
        if not HEX40.fullmatch(str(sources[key].get("revision", ""))):
            raise ContractError(f"release_lock_source_revision_invalid:{key}")
    revision = sources["core"]["revision"]
    if sources["smart"]["revision"] != revision:
        raise ContractError("release_lock_revision_split")
    # Core's tree contains Smart's, so the release commit is always the commit
    # that last wrote `distr`.
    if sources["core"]["commit"] != revision:
        raise ContractError("release_lock_core_not_release")
    if compatibility_id != f"ui-{revision[:12]}":
        raise ContractError("release_lock_pair_invalid")
    validate_build_inputs(lock.get("build_inputs"))
    mirror = lock.get("mirror")
    pair = lock.get("pair")
    if mirror is None:
        if pair is not None:
            raise ContractError("release_lock_pair_without_mirror")
    else:
        validate_runtime_source(mirror, "mirror", MIRROR_OWNER, "smart")
        if set(mirror) != V2_MIRROR_KEYS or mirror.get("mirrors") != "smart":
            raise ContractError("release_lock_mirror_invalid")
        # The two copies are one set of bytes: git gives byte-identical trees
        # one object id.
        if mirror["runtime_tree"] != sources["smart"]["runtime_tree"]:
            raise ContractError("release_lock_mirror_tree_mismatch")
        if pair != f"ui-{revision[:12]}-smart-{mirror['commit'][:12]}":
            raise ContractError("release_lock_mirror_pair_invalid")
    validate_lock_tail(lock)


def validate_lock_v1(lock: dict[str, Any]) -> None:
    compatibility_id = lock.get("compatibility_id")
    if not isinstance(compatibility_id, str) or not COMPATIBILITY_ID.fullmatch(compatibility_id):
        raise ContractError("release_lock_pair_invalid")
    if lock.get("status") != "bounded" or lock.get("profile") != PROFILE:
        raise ContractError("release_lock_profile_invalid")
    sources = lock.get("runtime_sources")
    if not isinstance(sources, dict) or set(sources) != {"ui", "ui-smart"}:
        raise ContractError("release_lock_sources_invalid")
    for key, owner, runtime_path in (
        ("ui", UI_OWNER, "distr"),
        ("ui-smart", MIRROR_OWNER, "smart"),
    ):
        validate_runtime_source(sources[key], key, owner, runtime_path)
    validate_build_inputs(lock.get("build_inputs"))
    expected_id = (
        f"ui-{sources['ui']['commit'][:12]}-smart-"
        f"{sources['ui-smart']['commit'][:12]}"
    )
    if compatibility_id != expected_id:
        raise ContractError("release_lock_pair_invalid")
    validate_lock_tail(lock)


def validate_lock_tail(lock: dict[str, Any]) -> None:
    exclusions = lock.get("exclusions")
    if not isinstance(exclusions, list):
        raise ContractError("release_lock_exclusions_invalid")
    if any(not isinstance(item, dict) for item in exclusions):
        raise ContractError("release_lock_exclusion_invalid")
    if lock.get("claims") != {
        "full_compatible": False,
        "production_ready": False,
        "all_items_ready": False,
    }:
        raise ContractError("release_lock_claims_invalid")


def validate_build_inputs(build_inputs: Any) -> None:
    if not isinstance(build_inputs, dict) or set(build_inputs) != {
        "source",
        "builder",
        "legacy_compatibility",
    }:
        raise ContractError("release_lock_build_inputs_invalid")
    for key, owner in (("source", "simai/ui-source"), ("builder", "simai/ui-builder")):
        build_input = build_inputs.get(key)
        if not isinstance(build_input, dict) or set(build_input) != {
            "owner",
            "commit",
            "tree",
            "archive_sha256",
        }:
            raise ContractError(f"release_lock_build_input_invalid:{key}")
        if build_input.get("owner") != owner:
            raise ContractError(f"release_lock_build_input_owner_invalid:{key}")
        if any(not HEX40.fullmatch(str(build_input.get(field, ""))) for field in ("commit", "tree")):
            raise ContractError(f"release_lock_build_input_revision_invalid:{key}")
        if not HEX64.fullmatch(str(build_input.get("archive_sha256", ""))):
            raise ContractError(f"release_lock_build_input_hash_invalid:{key}")
    legacy = build_inputs.get("legacy_compatibility")
    if legacy == {"required": False}:
        pass
    else:
        if not isinstance(legacy, dict) or set(legacy) != {
            "required",
            "source",
            "lineage_manifest",
            "invocation",
        } or legacy.get("required") is not True:
            raise ContractError("release_lock_legacy_compatibility_invalid")
        legacy_source = legacy.get("source")
        if not isinstance(legacy_source, dict) or set(legacy_source) != {
            "owner",
            "commit",
            "tree",
            "runtime_path",
            "runtime_tree",
            "archive_sha256",
        }:
            raise ContractError("release_lock_legacy_source_invalid")
        if legacy_source.get("owner") != "simai/ui" or legacy_source.get("runtime_path") != "distr":
            raise ContractError("release_lock_legacy_source_identity_invalid")
        if any(not HEX40.fullmatch(str(legacy_source.get(field, ""))) for field in ("commit", "tree", "runtime_tree")):
            raise ContractError("release_lock_legacy_source_revision_invalid")
        if not HEX64.fullmatch(str(legacy_source.get("archive_sha256", ""))):
            raise ContractError("release_lock_legacy_source_hash_invalid")
        lineage = legacy.get("lineage_manifest")
        if not isinstance(lineage, dict) or set(lineage) != {
            "owner",
            "commit",
            "tree",
            "path",
            "blob",
            "sha256",
            "records_count",
        }:
            raise ContractError("release_lock_legacy_lineage_invalid")
        if lineage.get("owner") not in {"simai/ui-control", "simai/ui"} or not isinstance(lineage.get("path"), str) or not lineage["path"]:
            raise ContractError("release_lock_legacy_lineage_identity_invalid")
        if any(not HEX40.fullmatch(str(lineage.get(field, ""))) for field in ("commit", "tree", "blob")):
            raise ContractError("release_lock_legacy_lineage_revision_invalid")
        if not HEX64.fullmatch(str(lineage.get("sha256", ""))) or not isinstance(lineage.get("records_count"), int) or lineage["records_count"] < 1:
            raise ContractError("release_lock_legacy_lineage_content_invalid")
        invocation = legacy.get("invocation")
        legacy_environment = invocation.get("environment_bindings") if isinstance(invocation, dict) else None
        supported_revision_bindings = {
            "legacy_compatibility.source.commit",
            "legacy_compatibility.lineage_manifest.generated_repository.revision",
        }
        if not isinstance(invocation, dict) or set(invocation) != {
            "command",
            "arguments",
            "environment_bindings",
        }:
            raise ContractError("release_lock_legacy_invocation_invalid")
        if invocation.get("command") != "node scripts/verify-product-reproducibility.cjs":
            raise ContractError("release_lock_legacy_invocation_command_invalid")
        if invocation.get("arguments") != [
            "<ui-loader-root>",
            "<workspace-root>",
            "--require-legacy-compatibility",
        ] or not isinstance(legacy_environment, dict) or legacy_environment != {
            "SF_LEGACY_COMPATIBILITY_ROOT": "legacy_compatibility.source.runtime_path",
            "SF_LEGACY_COMPATIBILITY_REVISION": legacy_environment.get("SF_LEGACY_COMPATIBILITY_REVISION"),
            "SF_LEGACY_COMPATIBILITY_MANIFEST": "legacy_compatibility.lineage_manifest",
        } or legacy_environment.get("SF_LEGACY_COMPATIBILITY_REVISION") not in supported_revision_bindings:
            raise ContractError("release_lock_legacy_invocation_binding_invalid")


def lock_runtime(lock: dict[str, Any], side: str) -> dict[str, Any]:
    """The runtime source of `core` or `smart`, whatever the lock version calls it."""
    key = {"core": "ui", "smart": "ui-smart"}[side] if lock["schema_version"] == 1 else side
    return lock["runtime_sources"][key]


def validate_smart_reference(
    reference: dict[str, Any],
    smart_manifest: dict[str, Any],
    lock: dict[str, Any],
    file_sha256: str,
) -> None:
    if "entries" in reference:
        raise ContractError("smart_reference_must_not_copy_entries")
    if reference.get("schema_id") != "simai.framework.owner-manifest-reference":
        raise ContractError("smart_reference_schema_invalid")
    if reference.get("schema_version") != 1 or reference.get("owner") != "simai/ui-smart":
        raise ContractError("smart_reference_owner_invalid")
    manifest = reference.get("manifest")
    if not isinstance(manifest, dict):
        raise ContractError("smart_reference_manifest_invalid")
    if manifest.get("path") != smart_manifest["owner"]["manifest_path"]:
        raise ContractError("smart_reference_path_invalid")
    if manifest.get("hash_mode") != "canonical-json-v1":
        raise ContractError("smart_reference_hash_mode_invalid")
    if manifest.get("sha256") != canonical_manifest_hash(smart_manifest):
        raise ContractError("smart_reference_hash_invalid")
    if manifest.get("file_sha256") != file_sha256:
        raise ContractError("smart_reference_file_hash_invalid")
    runtime = reference.get("runtime")
    locked = lock_runtime(lock, "smart")
    if not isinstance(runtime, dict):
        raise ContractError("smart_reference_runtime_invalid")
    expected_runtime = {
        "tag": locked["tag"],
        "commit": locked["commit"],
        "tree": locked["tree"],
        "subtree": locked["runtime_tree"],
        "archive_sha256": locked["archive_sha256"],
    }
    if runtime != expected_runtime:
        raise ContractError("smart_reference_runtime_mismatch")
    contract_revision = reference.get("contract_revision")
    if not isinstance(contract_revision, str) or not re.fullmatch(
        r"[0-9a-f]{40}", contract_revision
    ):
        raise ContractError("smart_reference_contract_revision_invalid")
    if reference.get("status") != "committed":
        raise ContractError("smart_reference_status_invalid")


def recipe_walk(
    recipe_id: str,
    entries: dict[str, dict[str, Any]],
    external: dict[str, dict[str, Any]] | None = None,
) -> tuple[list[str], dict[str, list[str]]]:
    """What a recipe needs, transitively: free entries, and package entries by package.

    A package entry (`external`: id -> {package, requires}) is not a free
    entry, but what it needs from the Framework is part of the recipe's plan,
    so the walk goes on through the requirements its package reference names.
    """
    external = external or {}
    if recipe_id not in entries or entries[recipe_id]["kind"] != "recipe":
        raise ContractError(f"recipe_unknown:{recipe_id}")
    visited: set[str] = set()
    reached: set[str] = set()
    pending = list(entries[recipe_id]["requires"])
    while pending:
        current = pending.pop()
        if current in visited or current in reached:
            continue
        if current in external:
            reached.add(current)
            pending.extend(external[current]["requires"])
            continue
        if current not in entries:
            raise ContractError(f"relation_unknown:{recipe_id}:{current}")
        visited.add(current)
        pending.extend(entries[current]["requires"])
    packages: dict[str, list[str]] = {}
    for public_id in sorted(reached):
        packages.setdefault(external[public_id]["package"], []).append(public_id)
    return sorted(visited), packages


def recipe_closure(
    recipe_id: str,
    entries: dict[str, dict[str, Any]],
    external: dict[str, dict[str, Any]] | None = None,
) -> list[str]:
    """The free entries a recipe needs, transitively (see recipe_walk)."""
    return recipe_walk(recipe_id, entries, external)[0]


PACKAGE_REFERENCE_KEYS = {
    "schema_id", "schema_version", "package", "title", "summary", "distribution", "provides",
}


def load_package_references(ui_root: Path) -> list[dict[str, Any]]:
    """The component packages the free Framework names (distr/core/contracts/packages).

    A package (larena is the first) ships its Smart components and
    their rules from its own distribution. Its reference here holds no bytes:
    it lets a free entry, such as a recipe, say that it needs a package entry,
    and lets this registry check that none of the package's components, rules
    or folders is in the free release.
    """
    references: list[dict[str, Any]] = []
    # The reference ships in the runtime, beside the ports, so a consumer that
    # has only the distribution can learn which elements need a package. Its
    # source is ui-source src/core/contracts/packages; nothing here is authored.
    directory = ui_root / "distr/core/contracts/packages"
    for path in sorted(directory.glob("*.package.json")) if directory.is_dir() else []:
        reference = load_json(path)
        if set(reference) != PACKAGE_REFERENCE_KEYS or reference["schema_id"] != "simai.framework.package-reference" or reference["schema_version"] != 1:
            raise ContractError(f"package_reference_invalid:{path.name}")
        if path.name != f"{reference['package']}.package.json" or not re.fullmatch(r"[a-z][a-z0-9-]*", reference["package"]):
            raise ContractError(f"package_reference_name_invalid:{path.name}")
        for item in reference["provides"]:
            if set(item) != {"id", "element", "rule_name", "folder", "requires"}:
                raise ContractError(f"package_reference_entry_invalid:{reference['package']}")
            validate_public_id(item["id"], "smart-component")
            if not isinstance(item["requires"], list) or item["requires"] != sorted(set(item["requires"])):
                raise ContractError(f"package_reference_requires_invalid:{item['id']}")
            for relation in item["requires"]:
                validate_public_id(relation)
        references.append(reference)
    return references


def smart_manifest_is_ui_owned(smart_manifest: dict[str, Any]) -> bool:
    return smart_manifest.get("owner", {}).get("id") == UI_OWNER


def default_smart_manifest(ui_root: Path) -> Path | None:
    """Where the Smart owner manifest is when nobody says.

    The manifest `ui` owns once Smart is published into `distr/smart`; until
    then, the one `ui-smart` keeps beside `ui`.
    """
    for candidate in (ui_root / SMART_MANIFEST_PATH, ui_root.parent / "ui-smart" / SMART_MANIFEST_PATH):
        if candidate.is_file():
            return candidate
    return None


def current_pair_inputs(
    ui_root: Path,
    component_manifest: dict[str, Any],
    smart_manifest: dict[str, Any],
    smart_manifest_path: Path,
) -> tuple[Path, Path | None]:
    """Find the lock (and, for v1, the Smart reference) of the release on disk.

    Both used to be named here literally, and both had to be retyped at every
    publication; a forgotten edit built the registry from the previous pair and
    the mismatch only surfaced later. The manifests already say which runtimes
    this release is, so the files are looked up instead, and anything other
    than exactly one match is an error rather than a guess.

    A Smart manifest owned by `ui` means the release is v2: one `ui` build
    commit, named by the Core manifest, is the release and its lock is
    `ui-<12>.lock.json`. Its Smart manifest lives in the same tree as the lock,
    so there is no cross-repository reference to look up.
    """
    core_commit = component_manifest["release"]["commit"]
    if smart_manifest_is_ui_owned(smart_manifest):
        release = f"ui-{core_commit[:12]}"
        lock_path = ui_root / f"contracts/releases/{release}.lock.json"
        if not lock_path.is_file():
            raise ContractError(f"release_lock_missing:{release}")
        return lock_path, None
    smart_commit = smart_manifest["release"]["commit"]
    pair = f"ui-{core_commit[:12]}-smart-{smart_commit[:12]}"
    lock_path = ui_root / f"contracts/releases/{pair}.lock.json"
    if not lock_path.is_file():
        raise ContractError(f"release_lock_missing:{pair}")

    file_sha256 = hashlib.sha256(smart_manifest_path.read_bytes()).hexdigest()
    candidates = sorted(
        path
        for path in (ui_root / "contracts/registry-inputs").glob("ui-smart-*.ref.json")
        if (
            (reference := load_json(path)).get("runtime", {}).get("commit") == smart_commit
            and reference.get("manifest", {}).get("file_sha256") == file_sha256
        )
    )
    if len(candidates) != 1:
        raise ContractError(f"smart_reference_not_unique:{len(candidates)}")
    return lock_path, candidates[0]


def build_registry(
    ui_root: Path,
    smart_manifest_path: Path,
    utility_manifest_path: Path | None = None,
    component_manifest_path: Path | None = None,
    recipe_manifest_path: Path | None = None,
    release_lock_path: Path | None = None,
    smart_reference_path: Path | None = None,
) -> dict[str, Any]:
    utility_path = utility_manifest_path or ui_root / "contracts/owners/utility.manifest.json"
    component_path = component_manifest_path or ui_root / "contracts/owners/component.manifest.json"
    recipe_path = recipe_manifest_path or ui_root / "contracts/owners/recipe.manifest.json"
    manifests = {
        "utility": load_json(utility_path),
        "component": load_json(component_path),
        "smart-component": load_json(smart_manifest_path),
        "recipe": load_json(recipe_path),
    }
    for kind, manifest in manifests.items():
        validate_manifest_envelope(manifest, kind)

    if release_lock_path is None or smart_reference_path is None:
        found_lock, found_reference = current_pair_inputs(
            ui_root,
            manifests["component"],
            manifests["smart-component"],
            smart_manifest_path,
        )
    lock_path = release_lock_path or found_lock
    reference_path = smart_reference_path or found_reference

    lock = load_json(lock_path)
    validate_lock(lock)
    smart_file_sha256 = hashlib.sha256(smart_manifest_path.read_bytes()).hexdigest()
    ui_owned = smart_manifest_is_ui_owned(manifests["smart-component"])
    if (lock["schema_version"] == 2) != ui_owned:
        # A v2 release publishes Smart from `ui`; its manifest must be the one
        # `ui` owns, and a v1 pair's must be the one `ui-smart` owns.
        raise ContractError("smart_manifest_owner_lock_mismatch")
    smart_reference = None
    if ui_owned:
        if manifests["smart-component"]["owner"]["manifest_path"] != SMART_MANIFEST_PATH:
            raise ContractError("smart_manifest_path_invalid")
    else:
        smart_reference = load_json(reference_path)
        validate_smart_reference(
            smart_reference,
            manifests["smart-component"],
            lock,
            smart_file_sha256,
        )
    for kind, side in (
        ("utility", "core"),
        ("component", "core"),
        ("smart-component", "smart"),
    ):
        release = manifests[kind]["release"]
        source = lock_runtime(lock, side)
        expected = {
            "tag": source["tag"],
            "commit": source["commit"],
            "tree": source["tree"],
            "runtime_subtree": source["runtime_tree"],
            "archive_sha256": source["archive_sha256"],
        }
        if release != expected:
            raise ContractError(f"{kind}_runtime_pair_mismatch")

    rules_path = ui_root / "distr/rule/rule.json"
    rules_value = json.loads(rules_path.read_text(encoding="utf-8"))
    if not isinstance(rules_value, list):
        raise ContractError("loader_rule_inventory_invalid")
    rules: list[dict[str, Any]] = rules_value
    rule_kinds = {rule["name"]: rule.get("type", "utility") for rule in rules}

    entries: dict[str, dict[str, Any]] = {}
    for source_entries in (
        derive_utility_entries(ui_root, manifests["utility"], rules),
        derive_component_entries(ui_root, manifests["component"], rules, rule_kinds),
        explicit_entries(manifests["smart-component"]),
        explicit_entries(manifests["recipe"]),
    ):
        collisions = set(entries).intersection(source_entries)
        if collisions:
            raise ContractError(f"entry_collision:{sorted(collisions)[0]}")
        entries.update(source_entries)

    packages = load_package_references(ui_root)
    external: dict[str, dict[str, Any]] = {}
    for reference in packages:
        for item in reference["provides"]:
            if item["id"] in external or item["id"] in entries:
                raise ContractError(f"package_entry_collision:{item['id']}")
            external[item["id"]] = {"package": reference["package"], "requires": item["requires"]}
            # A package component is not in the free release: neither its rule
            # nor its runtime folder.
            if any(rule.get("name") == item["rule_name"] for rule in rules):
                raise ContractError(f"package_rule_in_free_release:{item['rule_name']}")
            if (ui_root / "distr/smart" / item["folder"]).exists():
                raise ContractError(f"package_folder_in_free_release:{item['folder']}")
    # What a package needs from the Framework must be in it: a free release
    # that dropped one of these would break the package.
    for public_id, item in external.items():
        for dependency in item["requires"]:
            if dependency not in entries and dependency not in external:
                raise ContractError(f"package_requires_unknown:{public_id}:{dependency}")

    for entry in entries.values():
        validate_normalized_entry(entry)
    for entry in entries.values():
        for dependency in entry["requires"]:
            if dependency not in entries and dependency not in external:
                raise ContractError(f"relation_unknown:{entry['id']}:{dependency}")
            if dependency in external and entry["kind"] != "recipe":
                # A free component never depends on a package; a recipe may
                # place one, and says so through recipe_packages.
                raise ContractError(f"free_entry_requires_package:{entry['id']}:{dependency}")

    expected_counts = {
        "utility": manifests["utility"]["inventory"]["expected"]["entries"],
        "component": manifests["component"]["inventory"]["expected"]["entries"],
        "smart-component": manifests["smart-component"]["inventory"]["expected"],
        "recipe": manifests["recipe"]["inventory"]["expected"]["entries"],
    }
    counts = {
        kind: sum(entry["kind"] == kind for entry in entries.values())
        for kind in KINDS
    }
    if counts != expected_counts:
        raise ContractError(f"aggregate_count_mismatch:{counts}")
    counts["total"] = len(entries)

    closure, closure_packages = recipe_walk("recipe.admin.collection", entries, external)
    closure_kinds = {entries[public_id]["kind"] for public_id in closure}
    if closure_kinds != {"utility", "component", "smart-component"}:
        raise ContractError(f"recipe_closure_kind_mismatch:{sorted(closure_kinds)}")
    # `safe_to_suggest` answers whether a component should be offered to an
    # author. A recipe may only place components that are, so that is asserted
    # for what it names itself. It is not asserted over the whole closure,
    # because the rest of the closure is what those components are built out of:
    # the dropdown renders list items, and the list item is deliberately not
    # offered on its own. Requiring the closure to be suggestable conflated a
    # runtime dependency with a suggestion, and the only reason it ever held was
    # that the dependency went undeclared.
    unsafe = [
        public_id
        for public_id in entries["recipe.admin.collection"]["requires"]
        if public_id not in external and not entries[public_id]["readiness"]["safe_to_suggest"]
    ]
    if unsafe:
        raise ContractError(f"recipe_placement_not_safe:{unsafe[0]}")

    smart_rules = {rule["name"]: rule for rule in rules if rule.get("type") == "smart"}
    # A Smart composite is loaded by tag like any other Smart element, so it has a
    # rule of type "smart" -- but this registry has four kinds and composite is not
    # one of them, so a composite is not an entry here and its rule answers to no
    # entry. The count held only while no composite had a rule, which was true
    # until sf-property-view needed one and sf-data-view turned out to need the
    # same. These two are named rather than inferred, and each must exist, so the
    # allowance cannot quietly grow or rot.
    #
    # Whether a composite should be an entry in its own right is the registry
    # owner's question, not this check's: it would give a consumer a way to find
    # sf-property-view and sf-data-view without reading our source, which today it
    # has not.
    #
    # Both composites live in package larena now (distr/core/contracts/packages/
    # larena.package.json), so the free release carries neither rule and the
    # allowance is empty. It stays named, so a composite that comes back has to
    # be listed here rather than slip past the count.
    COMPOSITE_RULES: tuple[str, ...] = ()
    missing_composites = [name for name in COMPOSITE_RULES if name not in smart_rules]
    if missing_composites:
        raise ContractError(f"composite_rule_missing:{missing_composites[0]}")
    if len(smart_rules) - len(COMPOSITE_RULES) != expected_counts["smart-component"]:
        raise ContractError("smart_rule_count_mismatch")
    for entry in (item for item in entries.values() if item["kind"] == "smart-component"):
        rule_name = entry["runtime"].get("rule_name")
        if rule_name in COMPOSITE_RULES:
            raise ContractError(f"composite_rule_claimed_by_entry:{entry['id']}")
        rule = smart_rules.get(rule_name)
        if rule is None:
            raise ContractError(f"smart_rule_missing:{entry['id']}")
        expected_requires = sorted(
            relation_id(item["name"], rule_kinds) for item in rule.get("relation", [])
        )
        if entry["requires"] != expected_requires:
            raise ContractError(f"smart_rule_relations_mismatch:{entry['id']}")
        declared = entry["runtime"].get("declared")
        expected_declared = {
            "js": bool(rule.get("js", False)),
            "css": bool(rule.get("css", False)),
        }
        if declared != expected_declared:
            raise ContractError(f"smart_rule_assets_mismatch:{entry['id']}")
    source_manifest_records = [
            {
                "kind": kind,
                "owner": manifest["owner"]["id"],
                "path": manifest["owner"]["manifest_path"],
                "hash_mode": "canonical-json-v1",
                "sha256": canonical_manifest_hash(manifest),
            }
            for kind, manifest in manifests.items()
        ]
    smart_source = next(
        item for item in source_manifest_records if item["kind"] == "smart-component"
    )
    if smart_reference is not None:
        smart_source["contract_revision"] = smart_reference["contract_revision"]
    smart_source["file_sha256"] = smart_file_sha256
    source_manifests = sorted(
        source_manifest_records,
        key=lambda item: item["kind"],
    )
    sorted_entries = [entries[public_id] for public_id in sorted(entries)]
    by_kind = {
        kind: [entry["id"] for entry in sorted_entries if entry["kind"] == kind]
        for kind in KINDS
    }
    compatibility = {
        "id": lock["compatibility_id"],
        "status": "bounded",
        "profile": PROFILE,
        "runtime_sources": [
            lock["runtime_sources"][key] for key in sorted(lock["runtime_sources"])
        ],
        "build_inputs": lock["build_inputs"],
        "exclusions": lock["exclusions"],
        "claims": lock["claims"],
    }
    if lock["schema_version"] == 2:
        # Said once so a reader can tell the shapes apart without counting
        # owners; the mirror and its v1-shaped id ride along while they exist.
        compatibility["release_lock_version"] = 2
        for key in ("mirror", "pair"):
            if key in lock:
                compatibility[key] = lock[key]
    return {
        "schema_id": "simai.framework.contract-registry",
        "schema_version": 1,
        "compatibility": compatibility,
        "source_manifests": source_manifests,
        "counts": counts,
        "entries": sorted_entries,
        "indexes": {
            "by_kind": by_kind,
            "safe_to_suggest": [
                entry["id"]
                for entry in sorted_entries
                if entry["readiness"]["safe_to_suggest"]
            ],
            "blocked": [
                entry["id"]
                for entry in sorted_entries
                if entry["readiness"]["status"] == "blocked"
            ],
            "recipe_closure": {"recipe.admin.collection": closure},
            "recipe_packages": {"recipe.admin.collection": closure_packages},
            "packages": {
                reference["package"]: {
                    "owner": reference["distribution"]["owner"],
                    "provides": sorted(item["id"] for item in reference["provides"]),
                }
                for reference in packages
            },
        },
        "nonclaims": {
            "production_ready": False,
            "full_compatibility": False,
            "all_items_ready": False,
        },
    }


def build_documentation_source(
    ui_root: Path,
    registry: dict[str, Any],
) -> dict[str, Any]:
    """Project the owner registry into Docara's neutral documentation contract."""
    entities: list[dict[str, Any]] = []
    for entry in registry["entries"]:
        kind = "smart_component" if entry["kind"] == "smart-component" else entry["kind"]
        public_contract = {
            "lifecycle": entry["lifecycle"],
            "runtime": entry["runtime"],
            "requires": entry["requires"],
        }
        public_contract.update(component_public_surface(ui_root, entry["runtime"]))
        entities.append(
            {
                "key": entry["id"],
                "kind": kind,
                "title": entry["title"],
                "public_contract": public_contract,
                "example_cases": ["default"],
                "provenance": entry["provenance"]["source_refs"],
            }
        )

    core_path = ui_root / "distr/core/css/core.css"
    core_css = core_path.read_text(encoding="utf-8")
    entities.append(
        {
            "key": "core.design-tokens",
            "kind": "core",
            "title": "Design tokens",
            "public_contract": {
                "semantic_radius": {
                    "--sf-radius--ui": {
                        "value": css_custom_property(core_css, "--sf-radius--ui"),
                        "scope": "compact_controls",
                    },
                    "--sf-radius-default": {
                        "value": css_custom_property(core_css, "--sf-radius-default"),
                        "scope": "large_surfaces",
                    },
                    "square": {"role": "explicit_override"},
                    "rounded": {"role": "explicit_override"},
                }
            },
            "example_cases": [],
            "provenance": ["simai/ui@distr/core/css/core.css"],
        }
    )
    entities.sort(key=lambda entity: entity["key"])
    return {
        "schema": "docara.documentation_source.v1",
        "id": "simai-framework",
        "provider": "simai_framework",
        "revision": registry["compatibility"]["id"],
        "entities": entities,
    }


def parse_args(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--ui-root", type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument(
        "--smart-manifest",
        type=Path,
        default=os.environ.get("SIMAI_UI_SMART_MANIFEST") or None,
    )
    parser.add_argument("--utility-manifest", type=Path)
    parser.add_argument("--component-manifest", type=Path)
    parser.add_argument("--recipe-manifest", type=Path)
    parser.add_argument("--release-lock", type=Path)
    parser.add_argument("--smart-reference", type=Path)
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("contracts/generated/framework-contract-registry.json"),
    )
    parser.add_argument(
        "--documentation-output",
        type=Path,
        default=Path("contracts/generated/documentation-source.json"),
    )
    parser.add_argument("--stdout", action="store_true")
    parser.add_argument("--check", action="store_true")
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv or sys.argv[1:])
    ui_root = args.ui_root.resolve()
    if args.smart_manifest is None:
        args.smart_manifest = default_smart_manifest(ui_root)
    if args.smart_manifest is None:
        raise ContractError("smart_manifest_path_required")
    registry = build_registry(
        ui_root,
        args.smart_manifest.resolve(),
        args.utility_manifest.resolve() if args.utility_manifest else None,
        args.component_manifest.resolve() if args.component_manifest else None,
        args.recipe_manifest.resolve() if args.recipe_manifest else None,
        args.release_lock.resolve() if args.release_lock else None,
        args.smart_reference.resolve() if args.smart_reference else None,
    )
    rendered = pretty_json(registry)
    output = args.output if args.output.is_absolute() else ui_root / args.output
    documentation = pretty_json(build_documentation_source(ui_root, registry))
    documentation_output = (
        args.documentation_output
        if args.documentation_output.is_absolute()
        else ui_root / args.documentation_output
    )
    if args.check:
        if not output.is_file() or output.read_text(encoding="utf-8") != rendered:
            raise ContractError(f"generated_registry_stale:{output}")
        if (
            not documentation_output.is_file()
            or documentation_output.read_text(encoding="utf-8") != documentation
        ):
            raise ContractError(f"generated_documentation_source_stale:{documentation_output}")
    elif args.stdout:
        sys.stdout.write(rendered)
    else:
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_text(rendered, encoding="utf-8")
        documentation_output.parent.mkdir(parents=True, exist_ok=True)
        documentation_output.write_text(documentation, encoding="utf-8")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except ContractError as error:
        print(str(error), file=sys.stderr)
        raise SystemExit(1)
