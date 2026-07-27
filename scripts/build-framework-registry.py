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
COMPATIBILITY_ID = re.compile(r"^ui-[0-9a-f]{12}-smart-[0-9a-f]{12}$")
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
    if lock.get("schema_id") != "simai.framework.release-lock" or lock.get("schema_version") != 1:
        raise ContractError("release_lock_schema_invalid")
    compatibility_id = lock.get("compatibility_id")
    if not isinstance(compatibility_id, str) or not COMPATIBILITY_ID.fullmatch(compatibility_id):
        raise ContractError("release_lock_pair_invalid")
    if lock.get("status") != "bounded" or lock.get("profile") != PROFILE:
        raise ContractError("release_lock_profile_invalid")
    sources = lock.get("runtime_sources")
    if not isinstance(sources, dict) or set(sources) != {"ui", "ui-smart"}:
        raise ContractError("release_lock_sources_invalid")
    for key, owner, runtime_path in (
        ("ui", "simai/ui", "distr"),
        ("ui-smart", "simai/ui-smart", "smart"),
    ):
        source = sources[key]
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
    build_inputs = lock.get("build_inputs")
    if not isinstance(build_inputs, dict) or set(build_inputs) != {
        "source",
        "builder",
        "legacy_compatibility",
    }:
        raise ContractError("release_lock_build_inputs_invalid")
    for key, owner in (("source", "simai/ui-loader"), ("builder", "simai/ui-builder")):
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
    if lineage.get("owner") != "simai/ui-control" or not isinstance(lineage.get("path"), str) or not lineage["path"]:
        raise ContractError("release_lock_legacy_lineage_identity_invalid")
    if any(not HEX40.fullmatch(str(lineage.get(field, ""))) for field in ("commit", "tree", "blob")):
        raise ContractError("release_lock_legacy_lineage_revision_invalid")
    if not HEX64.fullmatch(str(lineage.get("sha256", ""))) or not isinstance(lineage.get("records_count"), int) or lineage["records_count"] < 1:
        raise ContractError("release_lock_legacy_lineage_content_invalid")
    invocation = legacy.get("invocation")
    required_environment = {
        "SF_LEGACY_COMPATIBILITY_ROOT": "legacy_compatibility.source.runtime_path",
        "SF_LEGACY_COMPATIBILITY_REVISION": "legacy_compatibility.source.commit",
        "SF_LEGACY_COMPATIBILITY_MANIFEST": "legacy_compatibility.lineage_manifest",
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
    ] or invocation.get("environment_bindings") != required_environment:
        raise ContractError("release_lock_legacy_invocation_binding_invalid")
    expected_id = (
        f"ui-{sources['ui']['commit'][:12]}-smart-"
        f"{sources['ui-smart']['commit'][:12]}"
    )
    if compatibility_id != expected_id:
        raise ContractError("release_lock_pair_invalid")
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
    locked = lock["runtime_sources"]["ui-smart"]
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


def recipe_closure(recipe_id: str, entries: dict[str, dict[str, Any]]) -> list[str]:
    if recipe_id not in entries or entries[recipe_id]["kind"] != "recipe":
        raise ContractError(f"recipe_unknown:{recipe_id}")
    visited: set[str] = set()
    pending = list(entries[recipe_id]["requires"])
    while pending:
        current = pending.pop()
        if current in visited:
            continue
        if current not in entries:
            raise ContractError(f"relation_unknown:{recipe_id}:{current}")
        visited.add(current)
        pending.extend(entries[current]["requires"])
    return sorted(visited)


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
    lock_path = release_lock_path or ui_root / "contracts/releases/ui-873666dee394-smart-655406493ce9.lock.json"
    reference_path = smart_reference_path or ui_root / "contracts/registry-inputs/ui-smart-655406493ce9.ref.json"
    manifests = {
        "utility": load_json(utility_path),
        "component": load_json(component_path),
        "smart-component": load_json(smart_manifest_path),
        "recipe": load_json(recipe_path),
    }
    for kind, manifest in manifests.items():
        validate_manifest_envelope(manifest, kind)

    lock = load_json(lock_path)
    validate_lock(lock)
    smart_file_sha256 = hashlib.sha256(smart_manifest_path.read_bytes()).hexdigest()
    smart_reference = load_json(reference_path)
    validate_smart_reference(
        smart_reference,
        manifests["smart-component"],
        lock,
        smart_file_sha256,
    )
    for kind, source_key in (
        ("utility", "ui"),
        ("component", "ui"),
        ("smart-component", "ui-smart"),
    ):
        release = manifests[kind]["release"]
        source = lock["runtime_sources"][source_key]
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

    for entry in entries.values():
        validate_normalized_entry(entry)
    for entry in entries.values():
        for dependency in entry["requires"]:
            if dependency not in entries:
                raise ContractError(f"relation_unknown:{entry['id']}:{dependency}")

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

    closure = recipe_closure("recipe.admin.collection", entries)
    closure_kinds = {entries[public_id]["kind"] for public_id in closure}
    if closure_kinds != {"utility", "component", "smart-component"}:
        raise ContractError(f"recipe_closure_kind_mismatch:{sorted(closure_kinds)}")
    unsafe = [public_id for public_id in closure if not entries[public_id]["readiness"]["safe_to_suggest"]]
    if unsafe:
        raise ContractError(f"recipe_closure_not_safe:{unsafe[0]}")

    smart_rules = {rule["name"]: rule for rule in rules if rule.get("type") == "smart"}
    if len(smart_rules) != expected_counts["smart-component"]:
        raise ContractError("smart_rule_count_mismatch")
    for entry in (item for item in entries.values() if item["kind"] == "smart-component"):
        rule_name = entry["runtime"].get("rule_name")
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
    return {
        "schema_id": "simai.framework.contract-registry",
        "schema_version": 1,
        "compatibility": {
            "id": lock["compatibility_id"],
            "status": "bounded",
            "profile": PROFILE,
            "runtime_sources": [
                lock["runtime_sources"][key] for key in sorted(lock["runtime_sources"])
            ],
            "build_inputs": lock["build_inputs"],
            "exclusions": lock["exclusions"],
            "claims": lock["claims"],
        },
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
        },
        "nonclaims": {
            "production_ready": False,
            "full_compatibility": False,
            "all_items_ready": False,
        },
    }


def parse_args(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--ui-root", type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument(
        "--smart-manifest",
        type=Path,
        default=os.environ.get("SIMAI_UI_SMART_MANIFEST"),
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
    parser.add_argument("--stdout", action="store_true")
    parser.add_argument("--check", action="store_true")
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv or sys.argv[1:])
    if args.smart_manifest is None:
        raise ContractError("smart_manifest_path_required")
    ui_root = args.ui_root.resolve()
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
    if args.check:
        if not output.is_file() or output.read_text(encoding="utf-8") != rendered:
            raise ContractError(f"generated_registry_stale:{output}")
    elif args.stdout:
        sys.stdout.write(rendered)
    else:
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_text(rendered, encoding="utf-8")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except ContractError as error:
        print(str(error), file=sys.stderr)
        raise SystemExit(1)
