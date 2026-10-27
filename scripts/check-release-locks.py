#!/usr/bin/env python3
"""Check every release lock against the repositories it names.

Every lock, v1 or v2, must validate by its own version and be named by its
own id; the 15 v1 locks written before today's v1 rules are reported as
`v1_legacy` rather than rewritten. From v2 on, two more things are checked against git, because they are
what consumers act on:

* A lock names, for each runtime tree, the build commit that last wrote that
  tree. Consumers resolve a release by that commit (`git log -1 --
  <sourceDir>`); ui-admin's pin refuses with ADMIN_PIN_UNRELEASED when no
  contract claims it. 57 of the 192 v1 locks name a bookkeeping commit
  instead, so the rule starts with v2 rather than rewriting history.
* While `ui-smart` is kept as a mirror, `ui/distr/smart` at the release and
  `ui-smart/smart` at the mirror revision are byte-identical (one git tree
  object), and the v1-named alias lock that v1 readers resolve exists and
  agrees with the v2 lock.

The mirror checkout is SIMAI_UI_SMART_ROOT, else `../ui-smart`. It is required
when the current release has a mirror, and used when present for older ones.
"""

from __future__ import annotations

import argparse
import hashlib
import importlib.util
import json
import os
import subprocess
import sys
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]


def load_builder():
    path = ROOT / "scripts/build-framework-registry.py"
    spec = importlib.util.spec_from_file_location("framework_registry_builder_locks", path)
    if spec is None or spec.loader is None:
        raise RuntimeError("framework_registry_builder_unavailable")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


BUILDER = load_builder()


class LockError(ValueError):
    """A release lock disagrees with itself or with git."""


def git(root: Path, *args: str) -> str:
    try:
        return subprocess.check_output(
            ["git", "-C", str(root), *args], text=True, stderr=subprocess.DEVNULL
        ).strip()
    except (OSError, subprocess.CalledProcessError) as error:
        raise LockError(f"git_failed:{root.name}:{' '.join(args)}") from error


def archive_sha256(root: Path, commit: str, path: str) -> str:
    data = subprocess.check_output(["git", "-C", str(root), "archive", "--format=tar", commit, path])
    return hashlib.sha256(data).hexdigest()


def last_writer(root: Path, revision: str, path: str) -> str:
    return git(root, "log", "-1", "--format=%H", revision, "--", path)


def check_source(root: Path, name: str, source: dict[str, Any], revision: str) -> None:
    """The entry names the commit that wrote its tree, and describes that commit."""
    path = source["runtime_path"]
    writer = last_writer(root, revision, path)
    if writer != source["commit"]:
        raise LockError(f"runtime_writer_mismatch:{name}:{path}:names {source['commit'][:12]}, written by {writer[:12]}")
    if git(root, "rev-parse", f"{source['commit']}^{{tree}}") != source["tree"]:
        raise LockError(f"runtime_tree_mismatch:{name}")
    if git(root, "rev-parse", f"{source['commit']}:{path}") != source["runtime_tree"]:
        raise LockError(f"runtime_subtree_mismatch:{name}")
    if archive_sha256(root, source["commit"], path) != source["archive_sha256"]:
        raise LockError(f"runtime_archive_mismatch:{name}")


def check_alias(releases: Path, lock: dict[str, Any]) -> None:
    """The v1-named lock v1 readers resolve while the mirror exists."""
    path = releases / f"{lock['pair']}.lock.json"
    if not path.is_file():
        raise LockError(f"alias_lock_missing:{lock['pair']}")
    alias = BUILDER.load_json(path)
    BUILDER.validate_lock(alias)
    if alias["schema_version"] != 1:
        raise LockError(f"alias_lock_version_invalid:{lock['pair']}")
    core = lock["runtime_sources"]["core"]
    mirror = lock["mirror"]
    expected = {
        "ui": {key: core[key] for key in ("owner", "tag", "tag_object", "commit", "tree", "runtime_path", "runtime_tree", "archive_sha256")},
        "ui-smart": {key: mirror[key] for key in ("owner", "tag", "tag_object", "commit", "tree", "runtime_path", "runtime_tree", "archive_sha256")},
    }
    if alias["runtime_sources"] != expected:
        raise LockError(f"alias_lock_sources_mismatch:{lock['pair']}")
    for key in ("build_inputs", "inventory", "exclusions", "claims", "status", "profile"):
        if alias[key] != lock[key]:
            raise LockError(f"alias_lock_field_mismatch:{lock['pair']}:{key}")


def check_unit_inventory(releases: Path, ui_root: Path, lock: dict[str, Any]) -> None:
    """simai.linkage: the inventory and change report the lock points at are the bytes beside it."""
    pointer = lock["unit_inventory"]
    release_id = lock["compatibility_id"]
    entries = [("inventory", pointer)] + ([("change_report", pointer["change_report"])] if pointer["change_report"] else [])
    for name, entry in entries:
        path = ui_root / entry["path"]
        if not path.is_file():
            raise LockError(f"unit_{name}_missing:{release_id}")
        if hashlib.sha256(path.read_bytes()).hexdigest() != entry["sha256"]:
            raise LockError(f"unit_{name}_sha256_mismatch:{release_id}")
    inventory = BUILDER.load_json(ui_root / pointer["path"])
    if inventory.get("release") != release_id or len(inventory.get("units", [])) != pointer["units"]:
        raise LockError(f"unit_inventory_release_mismatch:{release_id}")
    if lock["build_inputs"]["source"]["commit"] != inventory.get("revision"):
        raise LockError(f"unit_inventory_source_mismatch:{release_id}")


def current_release(ui_root: Path) -> str | None:
    """The release the checkout carries: the last commit that wrote `distr`."""
    try:
        writer = git(ui_root, "log", "-1", "--format=%H", "--", "distr")
    except LockError:
        return None
    return f"ui-{writer[:12]}" if writer else None


def check_locks(ui_root: Path, mirror_root: Path | None) -> dict[str, Any]:
    releases = ui_root / "contracts/releases"
    locks: dict[str, dict[str, Any]] = {}
    legacy: dict[str, str] = {}
    for path in sorted(releases.glob("*.lock.json")):
        lock = BUILDER.load_json(path)
        try:
            BUILDER.validate_lock(lock)
        except BUILDER.ContractError as error:
            if lock.get("schema_version") == 1:
                # Written before the v1 rules they now fail (the `sf-v5.3.2`
                # id, the `simai/ui-loader` source owner before the rename).
                # They are history: reported, not rewritten.
                legacy[path.name] = str(error)
                continue
            raise LockError(f"{path.name}:{error}") from error
        if path.name != f"{lock['compatibility_id']}.lock.json":
            raise LockError(f"lock_file_name_mismatch:{path.name}")
        locks[lock["compatibility_id"]] = lock

    current = current_release(ui_root)
    mirror_available = mirror_root is not None and (mirror_root / ".git").exists()
    checked: list[str] = []
    for release_id, lock in locks.items():
        if lock["schema_version"] != 2:
            continue
        revision = lock["runtime_sources"]["core"]["revision"]
        for side in ("core", "smart"):
            check_source(ui_root, side, lock["runtime_sources"][side], revision)
        if "mirror" in lock:
            if mirror_available:
                assert mirror_root is not None
                # The mirror revision is the commit that last wrote ui-smart's
                # tree, and that tree is the one ui carries in distr/smart.
                check_source(mirror_root, "mirror", lock["mirror"], lock["mirror"]["commit"])
            elif release_id == current:
                raise LockError(f"mirror_checkout_required:{release_id}:set SIMAI_UI_SMART_ROOT")
            check_alias(releases, lock)
        if "unit_inventory" in lock:
            check_unit_inventory(releases, ui_root, lock)
        checked.append(release_id)

    if current in locks and locks[current]["schema_version"] == 2:
        dirty = git(ui_root, "status", "--porcelain", "--", "distr")
        if dirty:
            raise LockError("runtime_dirty:distr is not what the current lock describes")
    return {
        "locks": len(locks) + len(legacy),
        "v1": sum(lock["schema_version"] == 1 for lock in locks.values()),
        "v1_legacy": len(legacy),
        "v2": sorted(checked),
        "current": current if current in locks else None,
        "mirror_checked": mirror_available,
    }


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--ui-root", type=Path, default=ROOT)
    parser.add_argument("--mirror-root", type=Path, default=os.environ.get("SIMAI_UI_SMART_ROOT") or None)
    args = parser.parse_args(argv)
    ui_root = args.ui_root.resolve()
    mirror_root = (args.mirror_root or ui_root.parent / "ui-smart").resolve()
    result = check_locks(ui_root, mirror_root)
    print(json.dumps(result, sort_keys=True))
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except LockError as error:
        print(str(error), file=sys.stderr)
        raise SystemExit(1)
