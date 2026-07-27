#!/usr/bin/env python3
"""Detect Framework Contract Registry drift across every declared consumer."""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import subprocess
import sys
from pathlib import Path
from typing import Any


SCHEMA_ID = "simai.framework.contract-registry"
POINTER_SCHEMA_ID = "simai.framework.contract-registry.consumer-pointer"
PROFILE = "plain-assets-v1"
REGISTRY_OWNER = "simai/ui"
REGISTRY_PATH = "contracts/generated/framework-contract-registry.json"
REGISTRY_TREE = "contracts/generated"
LARENA_REGISTRY_RELATIVE_PATH = "contract/" + REGISTRY_PATH
LARENA_LOCK_PROFILES = {
    "larena.ui.frontend_runtime_lock.v2": None,
    "larena.ui.frontend_runtime_lock.v3": "exact-git-tree-v2",
}
COMPATIBILITY_ID = re.compile(r"^ui-[0-9a-f]{12}-smart-[0-9a-f]{12}$")
EXPECTED_RECIPE_UTILITIES = [
    "utility.display",
    "utility.flex-direction",
    "utility.gap",
    "utility.overflow",
    "utility.width",
]
DOC_PATHS = {
    "utility.display": "utilities/layout/display.md",
    "utility.flex-direction": "utilities/flex/flex-direction.md",
    "utility.gap": "utilities/grid-and-flexbox-utilities/gap.md",
    "utility.overflow": "utilities/layout/overflow.md",
    "utility.width": "utilities/sizes/width.md",
}
EXPECTED_CONSUMERS = {
    "ui-play": ("simai/ui-play", "runnable-examples"),
    "ui-doc": ("simai/ui-doc", "documentation"),
    "ai-skill": ("simai/framework-ai-skill", "ai-guidance"),
}
PUBLIC_ID = re.compile(
    r"^(utility|component|smart|recipe)\.[a-z][a-z0-9]*(?:-[a-z0-9]+)*"
    r"(?:\.[a-z][a-z0-9]*(?:-[a-z0-9]+)*)*$"
)
CONSUMER_ID = re.compile(r"^[a-z0-9][a-z0-9.-]*(?:/[a-z0-9][a-z0-9.-]*)?$")
HEX40 = re.compile(r"^[a-f0-9]{40}$")
HEX64 = re.compile(r"^[a-f0-9]{64}$")
FORBIDDEN_POINTER_KEYS = {"entries", "source_manifests", "metadata", "upstream_metadata"}
LEGACY_VERSION_TOKEN = "".join(("s", "f", "5"))


class DriftError(ValueError):
    """Raised when a contract identity or safety invariant cannot be trusted."""


def sha256_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def sha256_file(path: Path) -> str:
    try:
        return sha256_bytes(path.read_bytes())
    except OSError as error:
        raise DriftError(f"file_unreadable:{path.name}") from error


def load_json(path: Path) -> dict[str, Any]:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as error:
        raise DriftError(f"json_unreadable:{path.name}") from error
    if not isinstance(value, dict):
        raise DriftError(f"json_object_required:{path.name}")
    return value


def git(root: Path, *args: str, binary: bool = False) -> str | bytes:
    try:
        return subprocess.check_output(
            ["git", "-C", str(root), *args],
            text=not binary,
            stderr=subprocess.DEVNULL,
        )
    except (OSError, subprocess.CalledProcessError) as error:
        raise DriftError("registry_git_source_unavailable") from error


def find_forbidden_pointer_key(value: Any, path: str = "pointer") -> str | None:
    if isinstance(value, dict):
        for key, child in value.items():
            if key.lower().replace("-", "_") in FORBIDDEN_POINTER_KEYS:
                return f"{path}.{key}"
            found = find_forbidden_pointer_key(child, f"{path}.{key}")
            if found:
                return found
    elif isinstance(value, list):
        for index, child in enumerate(value):
            found = find_forbidden_pointer_key(child, f"{path}[{index}]")
            if found:
                return found
    return None


def validate_public_id(public_id: Any, kind: Any) -> None:
    if not isinstance(public_id, str) or not PUBLIC_ID.fullmatch(public_id):
        raise DriftError(f"registry_public_id_invalid:{public_id}")
    if "_" in public_id or LEGACY_VERSION_TOKEN in public_id.lower():
        raise DriftError(f"registry_public_id_forbidden:{public_id}")
    if any(re.fullmatch(r"v[0-9]+", segment) for segment in public_id.split(".")):
        raise DriftError(f"registry_public_id_versioned:{public_id}")
    prefix = "smart" if kind == "smart-component" else kind
    if prefix not in {"utility", "component", "smart", "recipe"} or not public_id.startswith(prefix + "."):
        raise DriftError(f"registry_public_id_kind_mismatch:{public_id}")


def validate_aggregate(path: Path) -> tuple[dict[str, Any], dict[str, Any]]:
    registry = load_json(path)
    if registry.get("schema_id") != SCHEMA_ID or registry.get("schema_version") != 1:
        raise DriftError("registry_schema_invalid")
    compatibility = registry.get("compatibility")
    if not isinstance(compatibility, dict):
        raise DriftError("registry_compatibility_missing")
    compatibility_id = compatibility.get("id")
    if (
        not isinstance(compatibility_id, str)
        or not COMPATIBILITY_ID.fullmatch(compatibility_id)
        or compatibility.get("status") != "bounded"
        or compatibility.get("profile") != PROFILE
        or compatibility.get("claims")
        != {"all_items_ready": False, "full_compatible": False, "production_ready": False}
    ):
        raise DriftError("registry_compatibility_invalid")
    counts = registry.get("counts")
    if (
        not isinstance(counts, dict)
        or set(counts) != {"utility", "component", "smart-component", "recipe", "total"}
        or any(not isinstance(value, int) or value < 1 for value in counts.values())
        or counts["total"] != sum(counts[kind] for kind in ("utility", "component", "smart-component", "recipe"))
    ):
        raise DriftError("registry_counts_mismatch")
    if registry.get("nonclaims") != {
        "all_items_ready": False,
        "full_compatibility": False,
        "production_ready": False,
    }:
        raise DriftError("registry_nonclaims_invalid")

    entries = registry.get("entries")
    if not isinstance(entries, list) or len(entries) != counts["total"]:
        raise DriftError("registry_entries_invalid")
    ids: list[str] = []
    by_kind = {kind: [] for kind in ("utility", "component", "smart-component", "recipe")}
    for entry in entries:
        if not isinstance(entry, dict):
            raise DriftError("registry_entry_invalid")
        validate_public_id(entry.get("id"), entry.get("kind"))
        ids.append(entry["id"])
        by_kind[entry["kind"]].append(entry["id"])
    if ids != sorted(ids) or len(ids) != len(set(ids)):
        raise DriftError("registry_entry_order_or_collision")
    indexes = registry.get("indexes")
    if not isinstance(indexes, dict) or indexes.get("by_kind") != by_kind:
        raise DriftError("registry_kind_index_mismatch")
    closure = indexes.get("recipe_closure", {}).get("recipe.admin.collection")
    if not isinstance(closure, list) or not all(item in closure for item in EXPECTED_RECIPE_UTILITIES):
        raise DriftError("registry_recipe_utility_closure_incomplete")

    runtime_sources = compatibility.get("runtime_sources")
    if not isinstance(runtime_sources, list):
        raise DriftError("registry_runtime_sources_invalid")
    by_owner = {item.get("owner"): item for item in runtime_sources if isinstance(item, dict)}
    runtime_contracts: dict[str, dict[str, Any]] = {}
    for owner, runtime_path, mount in (
        ("simai/ui", "distr", "ui"),
        ("simai/ui-smart", "smart", "smart"),
    ):
        source = by_owner.get(owner)
        if not isinstance(source, dict):
            raise DriftError(f"registry_runtime_source_missing:{owner}")
        if (
            source.get("runtime_path") != runtime_path
            or not HEX40.fullmatch(str(source.get("commit", "")))
            or not HEX64.fullmatch(str(source.get("archive_sha256", "")))
        ):
            raise DriftError(f"registry_runtime_source_mismatch:{owner}")
        runtime_contracts[owner] = {
            "tag": source.get("tag"),
            "commit": source["commit"],
            "tree": runtime_path,
            "mount": mount,
            "sha256": source["archive_sha256"],
        }

    return registry, {
        "compatibility_id": compatibility_id,
        "profile": PROFILE,
        "entry_count": len(entries),
        "counts": counts,
        "ui_runtime": runtime_contracts["simai/ui"],
        "smart_runtime": runtime_contracts["simai/ui-smart"],
        "file_sha256": sha256_file(path),
        "public_ids": ids,
        "recipe_closure": closure,
    }


def validate_pointer(
    path: Path,
    expected_id: str,
    expected_role: str,
    aggregate_sha: str,
    compatibility_id: str,
) -> dict[str, str]:
    pointer = load_json(path)
    forbidden = find_forbidden_pointer_key(pointer)
    if forbidden:
        raise DriftError(f"pointer_upstream_copy_forbidden:{forbidden}")
    if set(pointer) != {"schema_id", "schema_version", "consumer", "compatibility_id", "registry", "policy"}:
        raise DriftError("pointer_keys_invalid")
    if pointer["schema_id"] != POINTER_SCHEMA_ID or pointer["schema_version"] != 1:
        raise DriftError("pointer_schema_invalid")
    consumer = pointer.get("consumer")
    if not isinstance(consumer, dict) or set(consumer) != {"id", "role"}:
        raise DriftError("pointer_consumer_invalid")
    consumer_id = consumer.get("id")
    if not isinstance(consumer_id, str) or not CONSUMER_ID.fullmatch(consumer_id) or consumer_id != expected_id:
        raise DriftError("pointer_consumer_identity_mismatch")
    if consumer.get("role") != expected_role:
        raise DriftError("pointer_consumer_role_invalid")
    registry = pointer.get("registry")
    if not isinstance(registry, dict):
        raise DriftError("pointer_registry_invalid")
    commit = registry.get("commit")
    if (
        pointer.get("compatibility_id") != compatibility_id
        or registry.get("owner") != REGISTRY_OWNER
        or registry.get("path") != REGISTRY_PATH
        or registry.get("file_sha256") != aggregate_sha
        or not isinstance(commit, str)
        or not HEX40.fullmatch(commit)
    ):
        raise DriftError("pointer_registry_identity_mismatch")
    if pointer.get("policy") != {
        "imports_upstream_metadata": False,
        "generated_views_must_validate": True,
        "production_ready": False,
    }:
        raise DriftError("pointer_policy_invalid")
    return {"id": expected_id, "role": expected_role, "registry_commit": commit}


def validate_registry_git_source(ui_root: Path, commit: str, aggregate_sha: str) -> dict[str, str]:
    root = ui_root.resolve()
    if not root.is_dir():
        raise DriftError("registry_git_root_invalid")
    artifact = git(root, "show", f"{commit}:{REGISTRY_PATH}", binary=True)
    assert isinstance(artifact, bytes)
    if sha256_bytes(artifact) != aggregate_sha:
        raise DriftError("registry_git_artifact_sha256_mismatch")
    tree_oid = str(git(root, "rev-parse", f"{commit}:{REGISTRY_TREE}")).strip()
    if not HEX40.fullmatch(tree_oid):
        raise DriftError("registry_git_tree_oid_invalid")
    archive = git(root, "archive", "--format=tar", commit, REGISTRY_TREE, binary=True)
    assert isinstance(archive, bytes)
    return {"commit": commit, "tree_oid": tree_oid, "archive_sha256": sha256_bytes(archive)}


def validate_larena_lock(
    path: Path,
    registry: dict[str, str],
    aggregate_sha: str,
    compatibility_id: str,
    ui_runtime: dict[str, Any],
    smart_runtime: dict[str, Any],
) -> dict[str, Any]:
    lock = load_json(path)
    schema = lock.get("schema")
    if schema not in LARENA_LOCK_PROFILES:
        raise DriftError("larena_lock_schema_unsupported")
    required_profile = LARENA_LOCK_PROFILES[schema]
    base_bundle_id = f"{compatibility_id}-registry-{aggregate_sha[:8]}"
    if required_profile is None:
        if "publication_profile" in lock:
            raise DriftError("larena_lock_publication_profile_unexpected")
        publication_profile = "legacy-registry-v2"
        bundle_id = base_bundle_id
    else:
        if lock.get("publication_profile") != required_profile:
            raise DriftError("larena_lock_publication_profile_mismatch")
        publication_profile = required_profile
        bundle_id = f"{base_bundle_id}-{publication_profile}"
    if (
        lock.get("runtime") != "simai-framework"
        or lock.get("tag") != ui_runtime["tag"]
        or lock.get("pair_id") != compatibility_id
        or lock.get("bundle_id") != bundle_id
    ):
        raise DriftError("larena_lock_identity_mismatch")
    for key, expected in (("ui", ui_runtime), ("ui_smart", smart_runtime)):
        source = lock.get(key)
        if not isinstance(source, dict) or any(source.get(field) != value for field, value in expected.items()):
            raise DriftError(f"larena_lock_runtime_mismatch:{key}")
        if not isinstance(source.get("files"), int) or source["files"] < 1:
            raise DriftError(f"larena_lock_files_invalid:{key}")
    expected_registry = {
        "schema_id": SCHEMA_ID,
        "compatibility_id": compatibility_id,
        "profile": PROFILE,
        "relative_path": LARENA_REGISTRY_RELATIVE_PATH,
        "file_sha256": aggregate_sha,
        "source": {
            "commit": registry["commit"],
            "tree": REGISTRY_TREE,
            "tree_oid": registry["tree_oid"],
            "mount": "contract",
            "sha256": registry["archive_sha256"],
            "files": 1,
        },
    }
    if lock.get("framework_registry") != expected_registry:
        raise DriftError("larena_registry_lock_identity_mismatch")
    return {
        "status": "aligned",
        "accepted": True,
        "schema": schema,
        "publication_profile": publication_profile,
        "bundle_id": bundle_id,
        "drift": [],
    }


def validate_ui_play(
    path: Path,
    ui_runtime: dict[str, Any],
    smart_runtime: dict[str, Any],
) -> dict[str, Any]:
    lock = load_json(path)
    expected_compatibility = f"ui-{ui_runtime['commit'][:12]}-smart-{smart_runtime['commit'][:12]}"
    drift: list[str] = []
    if lock.get("compatibilityId") != expected_compatibility:
        drift.append("compatibility_id_mismatch")
    if lock.get("core", {}).get("commit") != ui_runtime["commit"]:
        drift.append("core_commit_mismatch")
    if lock.get("smart", {}).get("commit") != smart_runtime["commit"]:
        drift.append("smart_commit_mismatch")
    status = "aligned" if not drift else "drifted"
    return {"status": status, "accepted": status == "aligned", "drift": drift}


def markdown_files(root: Path) -> list[Path]:
    if (root / "source/docs").is_dir():
        root = root / "source/docs"
    if not root.is_dir():
        raise DriftError("ui_doc_root_invalid")
    return sorted(path for path in root.rglob("*.md") if path.is_file())


def validate_ui_doc(root: Path, public_ids: list[str]) -> dict[str, Any]:
    files = markdown_files(root)
    docs_root = root / "source/docs" if (root / "source/docs").is_dir() else root
    combined = "\n".join(path.read_text(encoding="utf-8", errors="replace") for path in files)
    mentioned = sorted(public_id for public_id in public_ids if public_id in combined)
    selected_missing: list[str] = []
    for public_id, relative in DOC_PATHS.items():
        for locale in ("en", "ru"):
            if not (docs_root / locale / relative).is_file():
                selected_missing.append(f"{public_id}:{locale}")
    drift: list[str] = []
    if selected_missing:
        drift.append("selected_recipe_docs_missing")
    if len(mentioned) != len(public_ids):
        drift.append("registry_id_coverage_incomplete")
    status = "aligned" if not drift else ("partial" if not selected_missing else "drifted")
    return {
        "status": status,
        "accepted": status == "aligned",
        "drift": drift,
        "markdown_files": len(files),
        "registry_ids_mentioned": len(mentioned),
        "registry_ids_total": len(public_ids),
        "selected_recipe_docs_missing": selected_missing,
    }


def validate_ai_skill_inventory(
    path: Path,
    ui_runtime: dict[str, Any],
    smart_runtime: dict[str, Any],
    counts: dict[str, int],
) -> dict[str, Any]:
    try:
        text = path.read_text(encoding="utf-8")
    except OSError as error:
        raise DriftError("ai_skill_inventory_unreadable") from error
    expected = {
        "ui_revision": ui_runtime["commit"],
        "smart_revision": smart_runtime["commit"],
        "component_count": counts["component"],
        "smart_count": counts["smart-component"],
    }
    actual: dict[str, Any] = {}
    patterns = {
        "ui_revision": r"^- `ui`: .* @ `([a-f0-9]{40})`$",
        "smart_revision": r"^- `ui-smart`: .* @ `([a-f0-9]{40})`$",
        "component_count": r"^- Shipped components in `ui`: `([0-9]+)`$",
        "smart_count": r"^- Shipped smart-components in `ui-smart`: `([0-9]+)`$",
    }
    for key, pattern in patterns.items():
        match = re.search(pattern, text, re.MULTILINE)
        if match:
            actual[key] = int(match.group(1)) if key.endswith("count") else match.group(1)
    drift = [f"{key}_mismatch" for key, value in expected.items() if actual.get(key) != value]
    status = "aligned" if not drift else "drifted"
    return {"status": status, "accepted": status == "aligned", "drift": drift, "expected": expected, "actual": actual}


def validate_consumers(
    aggregate_path: Path,
    ui_root: Path,
    ui_play_pointer: Path,
    ui_play_asset_lock: Path,
    ui_doc_pointer: Path,
    ui_doc_root: Path,
    ai_skill_pointer: Path,
    ai_skill_inventory: Path,
    larena_runtime_lock: Path,
) -> dict[str, Any]:
    _registry, aggregate = validate_aggregate(aggregate_path)
    pointers = []
    for key, path in (("ui-play", ui_play_pointer), ("ui-doc", ui_doc_pointer), ("ai-skill", ai_skill_pointer)):
        expected_id, expected_role = EXPECTED_CONSUMERS[key]
        pointers.append(
            validate_pointer(
                path,
                expected_id,
                expected_role,
                aggregate["file_sha256"],
                aggregate["compatibility_id"],
            )
        )
    commits = {pointer["registry_commit"] for pointer in pointers}
    if len(commits) != 1:
        raise DriftError("pointer_registry_commit_disagreement")
    source = validate_registry_git_source(ui_root, commits.pop(), aggregate["file_sha256"])
    consumers = {
        "ui-play": validate_ui_play(
            ui_play_asset_lock,
            aggregate["ui_runtime"],
            aggregate["smart_runtime"],
        ),
        "ui-doc": validate_ui_doc(ui_doc_root, aggregate["public_ids"]),
        "ai-skill": validate_ai_skill_inventory(
            ai_skill_inventory,
            aggregate["ui_runtime"],
            aggregate["smart_runtime"],
            aggregate["counts"],
        ),
        "larena": validate_larena_lock(
            larena_runtime_lock,
            source,
            aggregate["file_sha256"],
            aggregate["compatibility_id"],
            aggregate["ui_runtime"],
            aggregate["smart_runtime"],
        ),
    }
    stale = sorted(name for name, value in consumers.items() if not value["accepted"])
    return {
        "status": "passed",
        "scope": "registry-runtime-playground-docs-skill-larena-drift",
        "contract_identity": "passed",
        "registry": {
            "commit": source["commit"],
            "tree_oid": source["tree_oid"],
            "archive_sha256": source["archive_sha256"],
            "file_sha256": aggregate["file_sha256"],
            "compatibility_id": aggregate["compatibility_id"],
            "profile": aggregate["profile"],
            "entry_count": aggregate["entry_count"],
        },
        "pointers": sorted(pointers, key=lambda item: item["id"]),
        "consumers": consumers,
        "stale_consumers": stale,
        "screen_acceptance": {
            "consumer": "larena",
            "accepted": consumers["larena"]["accepted"],
            "does_not_depend_on_stale_consumers": True,
        },
        "nonclaims": {"production_ready": False, "full_compatibility": False, "all_consumers_aligned": not stale},
    }


def add_path(parser: argparse.ArgumentParser, flag: str, environment: str) -> None:
    parser.add_argument(flag, type=Path, default=os.environ.get(environment))


def parse_args(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    for flag, environment in (
        ("--aggregate", "SIMAI_FRAMEWORK_REGISTRY"),
        ("--ui-root", "SIMAI_UI_ROOT"),
        ("--ui-play-pointer", "SIMAI_UI_PLAY_REGISTRY_POINTER"),
        ("--ui-play-asset-lock", "SIMAI_UI_PLAY_ASSET_LOCK"),
        ("--ui-doc-pointer", "SIMAI_UI_DOC_REGISTRY_POINTER"),
        ("--ui-doc-root", "SIMAI_UI_DOC_ROOT"),
        ("--ai-skill-pointer", "SIMAI_AI_SKILL_REGISTRY_POINTER"),
        ("--ai-skill-inventory", "SIMAI_AI_SKILL_INVENTORY"),
        ("--larena-runtime-lock", "SIMAI_LARENA_RUNTIME_LOCK"),
    ):
        add_path(parser, flag, environment)
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args(argv)
    for name, value in vars(args).items():
        if name == "json":
            continue
        if value is None:
            parser.error(f"--{name.replace('_', '-')} or its environment variable is required")
        setattr(args, name, value.resolve())
    return args


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv or sys.argv[1:])
    result = validate_consumers(
        args.aggregate,
        args.ui_root,
        args.ui_play_pointer,
        args.ui_play_asset_lock,
        args.ui_doc_pointer,
        args.ui_doc_root,
        args.ai_skill_pointer,
        args.ai_skill_inventory,
        args.larena_runtime_lock,
    )
    if args.json:
        print(json.dumps(result, ensure_ascii=False, sort_keys=True))
    else:
        print(
            f"Framework consumer drift checked: {result['registry']['entry_count']} entries; "
            f"stale={','.join(result['stale_consumers']) or 'none'}; "
            f"Larena accepted={str(result['screen_acceptance']['accepted']).lower()}"
        )
    return 0


if __name__ == "__main__":
    json_requested = "--json" in sys.argv[1:]
    try:
        raise SystemExit(main())
    except DriftError as error:
        if json_requested:
            print(json.dumps({"status": "failed", "error": str(error)}, sort_keys=True))
        else:
            print(str(error), file=sys.stderr)
        raise SystemExit(1)
