"""Release lock v2: one `ui` build commit, Smart in distr/smart, ui-smart mirrored.

The lock is built here from real git repositories in a temporary directory, the
same way the release route builds it, so the checks run against what git says
rather than against values typed into the test.
"""

from __future__ import annotations

import copy
import hashlib
import importlib.util
import json
import subprocess
import tempfile
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]


def load(name: str, path: Path):
    spec = importlib.util.spec_from_file_location(name, path)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"{name}_unavailable")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


BUILDER = load("framework_registry_builder_v2", ROOT / "scripts/build-framework-registry.py")
CHECKER = load("framework_release_lock_checker", ROOT / "scripts/check-release-locks.py")


def git(root: Path, *args: str) -> str:
    return subprocess.check_output(["git", "-C", str(root), *args], text=True).strip()


def write(root: Path, relative: str, content: str) -> None:
    path = root / relative
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")


def commit(root: Path, message: str) -> str:
    git(root, "add", "-A")
    git(root, "commit", "-qm", message)
    return git(root, "rev-parse", "HEAD")


def repository(root: Path) -> None:
    root.mkdir(parents=True)
    git(root, "init", "-q")
    git(root, "config", "user.email", "fixture@example.test")
    git(root, "config", "user.name", "Fixture")


def source(root: Path, owner: str, revision: str, path: str, with_revision: str | None) -> dict:
    writer = git(root, "log", "-1", "--format=%H", revision, "--", path)
    archive = subprocess.check_output(["git", "-C", str(root), "archive", "--format=tar", writer, path])
    value = {
        "owner": owner,
        "tag": None,
        "tag_object": None,
        "commit": writer,
        "tree": git(root, "rev-parse", f"{writer}^{{tree}}"),
        "runtime_path": path,
        "runtime_tree": git(root, "rev-parse", f"{writer}:{path}"),
        "archive_sha256": hashlib.sha256(archive).hexdigest(),
    }
    if with_revision is not None:
        value = {**value, "revision": with_revision}
    return value


BUILD_INPUTS = {
    "source": {"owner": "simai/ui-source", "commit": "1" * 40, "tree": "2" * 40, "archive_sha256": "3" * 64},
    "builder": {"owner": "simai/ui-builder", "commit": "4" * 40, "tree": "5" * 40, "archive_sha256": "6" * 64},
    "legacy_compatibility": {"required": False},
}
TAIL = {
    "inventory": {"smart_components": 1},
    "exclusions": [],
    "claims": {"full_compatible": False, "production_ready": False, "all_items_ready": False},
}


class Release:
    """A ui checkout and a ui-smart mirror with one v2 release published."""

    def __init__(self, directory: Path, smart_bytes: str = "smart-1\n"):
        self.ui = directory / "ui"
        self.mirror = directory / "ui-smart"
        repository(self.ui)
        repository(self.mirror)
        write(self.ui, "README.md", "ui\n")
        commit(self.ui, "start")
        write(self.mirror, "README.md", "ui-smart\n")
        commit(self.mirror, "start")
        self.publish("core-1\n", smart_bytes)

    def publish(self, core_bytes: str, smart_bytes: str) -> dict:
        write(self.ui, "distr/core/core.js", core_bytes)
        write(self.ui, "distr/smart/thing/js/thing.js", smart_bytes)
        self.release = commit(self.ui, "Build")
        write(self.mirror, "smart/thing/js/thing.js", smart_bytes)
        if git(self.mirror, "status", "--porcelain"):
            commit(self.mirror, "Build")
        self.mirror_commit = git(self.mirror, "log", "-1", "--format=%H", "--", "smart")
        self.lock = self.make_lock()
        self.write_locks()
        commit(self.ui, "Bind")
        return self.lock

    def make_lock(self) -> dict:
        release = self.release
        mirror = source(self.mirror, "simai/ui-smart", self.mirror_commit, "smart", None)
        return {
            "schema_id": "simai.framework.release-lock",
            "schema_version": 2,
            "compatibility_id": f"ui-{release[:12]}",
            "status": "bounded",
            "profile": "plain-assets-v1",
            "runtime_sources": {
                "core": source(self.ui, "simai/ui", release, "distr", release),
                "smart": source(self.ui, "simai/ui", release, "distr/smart", release),
            },
            "mirror": {**mirror, "mirrors": "smart"},
            "pair": f"ui-{release[:12]}-smart-{self.mirror_commit[:12]}",
            "build_inputs": copy.deepcopy(BUILD_INPUTS),
            **copy.deepcopy(TAIL),
        }

    def alias(self, lock: dict) -> dict:
        strip = lambda value, key: {k: v for k, v in value.items() if k != key}
        return {
            "schema_id": "simai.framework.release-lock",
            "schema_version": 1,
            "compatibility_id": lock["pair"],
            "status": lock["status"],
            "profile": lock["profile"],
            "runtime_sources": {
                "ui": strip(lock["runtime_sources"]["core"], "revision"),
                "ui-smart": strip(lock["mirror"], "mirrors"),
            },
            "build_inputs": lock["build_inputs"],
            "inventory": lock["inventory"],
            "exclusions": lock["exclusions"],
            "claims": lock["claims"],
        }

    def write_locks(self, lock: dict | None = None, alias: bool = True) -> None:
        lock = lock or self.lock
        releases = self.ui / "contracts/releases"
        releases.mkdir(parents=True, exist_ok=True)
        (releases / f"{lock['compatibility_id']}.lock.json").write_text(json.dumps(lock, indent=2) + "\n")
        if alias and "pair" in lock:
            (releases / f"{lock['pair']}.lock.json").write_text(json.dumps(self.alias(lock), indent=2) + "\n")

    def check(self) -> dict:
        return CHECKER.check_locks(self.ui, self.mirror)


class ReleaseLockV2ValidationTest(unittest.TestCase):
    def setUp(self) -> None:
        self.temporary = tempfile.TemporaryDirectory()
        self.release = Release(Path(self.temporary.name))
        self.lock = self.release.lock

    def tearDown(self) -> None:
        self.temporary.cleanup()

    def assert_invalid(self, mutate, code: str) -> None:
        lock = copy.deepcopy(self.lock)
        mutate(lock)
        with self.assertRaisesRegex(BUILDER.ContractError, code):
            BUILDER.validate_lock(lock)

    def test_a_v2_lock_and_its_v1_alias_both_validate_by_version(self) -> None:
        BUILDER.validate_lock(self.lock)
        BUILDER.validate_lock(self.release.alias(self.lock))
        self.assertEqual(BUILDER.lock_runtime(self.lock, "smart")["runtime_path"], "distr/smart")
        self.assertEqual(BUILDER.lock_runtime(self.release.alias(self.lock), "smart")["runtime_path"], "smart")

    def test_the_mirror_is_optional_but_comes_with_its_pair(self) -> None:
        lock = copy.deepcopy(self.lock)
        del lock["mirror"], lock["pair"]
        BUILDER.validate_lock(lock)
        self.assert_invalid(lambda value: value.pop("mirror"), "release_lock_pair_without_mirror")
        self.assert_invalid(lambda value: value.pop("pair"), "release_lock_mirror_pair_invalid")

    def test_identity_and_shape_fail_closed(self) -> None:
        cases = {
            "release_lock_pair_invalid": lambda value: value.update({"compatibility_id": self.lock["pair"]}),
            "release_lock_schema_invalid": lambda value: value.update({"schema_version": 3}),
            "release_lock_sources_invalid": lambda value: value["runtime_sources"].update({"ui-smart": {}}),
            "release_lock_source_identity_invalid:smart": lambda value: value["runtime_sources"]["smart"].update({"runtime_path": "smart"}),
            "release_lock_source_identity_invalid:core": lambda value: value["runtime_sources"]["core"].update({"owner": "simai/ui-smart"}),
            "release_lock_revision_split": lambda value: value["runtime_sources"]["smart"].update({"revision": "0" * 40}),
            "release_lock_core_not_release": lambda value: value["runtime_sources"]["core"].update({"commit": "0" * 40}),
            "release_lock_mirror_tree_mismatch": lambda value: value["mirror"].update({"runtime_tree": "0" * 40}),
            "release_lock_mirror_pair_invalid": lambda value: value.update({"pair": "ui-" + "0" * 12 + "-smart-" + "0" * 12}),
            "release_lock_mirror_invalid": lambda value: value["mirror"].pop("mirrors"),
            "release_lock_keys_invalid": lambda value: value.update({"ui_smart": {}}),
            "release_lock_source_keys_invalid:smart": lambda value: value["runtime_sources"]["smart"].update({"requiredFiles": []}),
        }
        for code, mutate in cases.items():
            with self.subTest(code=code):
                self.assert_invalid(mutate, code)

    def test_schema_files_name_what_the_validators_require(self) -> None:
        v1 = json.loads((ROOT / "contracts/schema/framework-release-lock.schema.json").read_text())
        v2 = json.loads((ROOT / "contracts/schema/framework-release-lock.v2.schema.json").read_text())
        self.assertEqual(v1["properties"]["schema_version"], {"const": 1})
        self.assertEqual(v2["properties"]["schema_version"], {"const": 2})
        self.assertEqual(set(v2["required"]), BUILDER.V2_TOP_KEYS)
        self.assertEqual(set(v2["properties"]) - {"mirror", "pair"}, BUILDER.V2_TOP_KEYS)
        for side in ("core", "smart"):
            self.assertEqual(set(v2["properties"]["runtime_sources"]["properties"][side]["required"]), BUILDER.V2_SOURCE_KEYS)
        self.assertEqual(set(v2["properties"]["mirror"]["required"]), BUILDER.V2_MIRROR_KEYS)


class ReleaseLockGitCheckTest(unittest.TestCase):
    def setUp(self) -> None:
        self.temporary = tempfile.TemporaryDirectory()
        self.release = Release(Path(self.temporary.name))

    def tearDown(self) -> None:
        self.temporary.cleanup()

    def test_a_published_release_passes(self) -> None:
        result = self.release.check()
        self.assertEqual(result["v2"], [self.release.lock["compatibility_id"]])
        self.assertEqual(result["current"], self.release.lock["compatibility_id"])
        self.assertTrue(result["mirror_checked"])

    def test_unchanged_smart_is_named_by_the_build_commit_that_wrote_it(self) -> None:
        first = self.release.lock
        second = self.release.publish("core-2\n", "smart-1\n")
        self.assertNotEqual(second["runtime_sources"]["core"]["commit"], first["runtime_sources"]["core"]["commit"])
        # Smart did not move: the release is new, its Smart writer is the old one.
        self.assertEqual(second["runtime_sources"]["smart"]["revision"], second["runtime_sources"]["core"]["commit"])
        self.assertEqual(second["runtime_sources"]["smart"]["commit"], first["runtime_sources"]["smart"]["commit"])
        self.assertEqual(second["mirror"]["commit"], first["mirror"]["commit"])
        result = self.release.check()
        self.assertEqual(len(result["v2"]), 2)

    def test_a_lock_naming_a_commit_that_did_not_write_the_tree_fails(self) -> None:
        lock = copy.deepcopy(self.release.lock)
        # Claim the bind commit, which wrote no runtime byte, as Smart's writer.
        bookkeeping = git(self.release.ui, "rev-parse", "HEAD")
        lock["runtime_sources"]["smart"]["commit"] = bookkeeping
        self.release.write_locks(lock)
        with self.assertRaisesRegex(CHECKER.LockError, "runtime_writer_mismatch:smart"):
            self.release.check()

    def test_a_mirror_that_is_not_byte_identical_fails(self) -> None:
        write(self.release.mirror, "smart/thing/js/thing.js", "drifted\n")
        drifted = commit(self.release.mirror, "Hand edit")
        lock = copy.deepcopy(self.release.lock)
        mirror = source(self.release.mirror, "simai/ui-smart", drifted, "smart", None)
        lock["mirror"] = {**mirror, "mirrors": "smart"}
        lock["pair"] = f"ui-{self.release.release[:12]}-smart-{drifted[:12]}"
        self.release.write_locks(lock)
        with self.assertRaisesRegex(CHECKER.LockError, "release_lock_mirror_tree_mismatch"):
            self.release.check()

    def test_a_mirror_whose_checkout_disagrees_with_the_lock_fails(self) -> None:
        lock = copy.deepcopy(self.release.lock)
        lock["mirror"]["archive_sha256"] = "0" * 64
        self.release.write_locks(lock)
        with self.assertRaisesRegex(CHECKER.LockError, "runtime_archive_mismatch:mirror"):
            self.release.check()

    def test_the_current_release_needs_the_mirror_checkout(self) -> None:
        with self.assertRaisesRegex(CHECKER.LockError, "mirror_checkout_required"):
            CHECKER.check_locks(self.release.ui, Path(self.temporary.name) / "absent")

    def test_the_alias_v1_readers_resolve_must_exist_and_agree(self) -> None:
        releases = self.release.ui / "contracts/releases"
        alias_path = releases / f"{self.release.lock['pair']}.lock.json"
        alias = json.loads(alias_path.read_text())
        alias["runtime_sources"]["ui-smart"]["archive_sha256"] = "0" * 64
        alias_path.write_text(json.dumps(alias))
        with self.assertRaisesRegex(CHECKER.LockError, "alias_lock_sources_mismatch"):
            self.release.check()
        alias_path.unlink()
        with self.assertRaisesRegex(CHECKER.LockError, "alias_lock_missing"):
            self.release.check()

    def test_uncommitted_runtime_bytes_fail(self) -> None:
        write(self.release.ui, "distr/smart/thing/js/thing.js", "uncommitted\n")
        with self.assertRaisesRegex(CHECKER.LockError, "runtime_dirty"):
            self.release.check()


if __name__ == "__main__":
    unittest.main()
