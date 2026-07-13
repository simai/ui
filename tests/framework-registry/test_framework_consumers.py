from __future__ import annotations

import copy
import importlib.util
import json
import os
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
AGGREGATE = ROOT / "contracts/generated/framework-contract-registry.json"
VALIDATOR_PATH = ROOT / "scripts/validate-framework-consumers.py"


def load_validator():
    spec = importlib.util.spec_from_file_location("framework_consumer_validator", VALIDATOR_PATH)
    if spec is None or spec.loader is None:
        raise RuntimeError("framework_consumer_validator_unavailable")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


VALIDATOR = load_validator()


def run(*args: str, cwd: Path) -> str:
    return subprocess.check_output([*args], cwd=cwd, text=True).strip()


class Fixtures:
    def __init__(self, root: Path):
        self.root = root
        self.registry_value = json.loads(AGGREGATE.read_text(encoding="utf-8"))
        self.ui_root = root / "ui"
        (self.ui_root / "contracts/generated").mkdir(parents=True)
        self.aggregate = self.ui_root / VALIDATOR.REGISTRY_PATH
        self.write_path(self.aggregate, self.registry_value)
        run("git", "init", "-q", cwd=self.ui_root)
        run("git", "config", "user.name", "Registry Test", cwd=self.ui_root)
        run("git", "config", "user.email", "registry@example.test", cwd=self.ui_root)
        run("git", "add", VALIDATOR.REGISTRY_PATH, cwd=self.ui_root)
        run("git", "commit", "-qm", "fixture registry", cwd=self.ui_root)
        self.commit = run("git", "rev-parse", "HEAD", cwd=self.ui_root)
        self.aggregate_sha = VALIDATOR.sha256_file(self.aggregate)
        self.source = VALIDATOR.validate_registry_git_source(self.ui_root, self.commit, self.aggregate_sha)

        self.ui_play_pointer = self.write("ui-play.pointer.json", self.pointer("simai/ui-play", "runnable-examples"))
        self.ui_doc_pointer = self.write("ui-doc.pointer.json", self.pointer("simai/ui-doc", "documentation"))
        self.ai_skill_pointer = self.write("ai-skill.pointer.json", self.pointer("simai/framework-ai-skill", "ai-guidance"))
        self.ui_play_lock = self.write("simai-assets.lock.json", self.aligned_ui_play_lock())
        self.ui_doc_root = root / "ui-doc"
        self.write_docs(full_coverage=True)
        self.ai_inventory = root / "source-inventory.md"
        self.write_inventory(aligned=True)
        self.larena_lock = self.write("larena-runtime-lock.json", self.aligned_larena_lock())

    @staticmethod
    def write_path(path: Path, value: dict) -> Path:
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        return path

    def write(self, name: str, value: dict, *, sort_keys: bool = False) -> Path:
        path = self.root / name
        path.write_text(
            json.dumps(value, ensure_ascii=False, indent=2, sort_keys=sort_keys) + "\n",
            encoding="utf-8",
        )
        return path

    def pointer(self, consumer_id: str, role: str) -> dict:
        return {
            "schema_id": VALIDATOR.POINTER_SCHEMA_ID,
            "schema_version": 1,
            "consumer": {"id": consumer_id, "role": role},
            "compatibility_id": VALIDATOR.COMPATIBILITY_ID,
            "registry": {
                "owner": VALIDATOR.REGISTRY_OWNER,
                "commit": self.commit,
                "path": VALIDATOR.REGISTRY_PATH,
                "file_sha256": self.aggregate_sha,
            },
            "policy": {
                "imports_upstream_metadata": False,
                "generated_views_must_validate": True,
                "production_ready": False,
            },
        }

    @staticmethod
    def aligned_ui_play_lock() -> dict:
        return {
            "schemaVersion": 1,
            "compatibilityId": f"ui-{VALIDATOR.UI_RUNTIME['commit'][:12]}-smart-{VALIDATOR.SMART_RUNTIME['commit'][:12]}",
            "core": {"commit": VALIDATOR.UI_RUNTIME["commit"]},
            "smart": {"commit": VALIDATOR.SMART_RUNTIME["commit"]},
        }

    def write_docs(self, *, full_coverage: bool) -> None:
        docs_root = self.ui_doc_root / "source/docs"
        for public_id, relative in VALIDATOR.DOC_PATHS.items():
            for locale in ("en", "ru"):
                path = docs_root / locale / relative
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_text(f"# {public_id}\n", encoding="utf-8")
        catalog = docs_root / "en/reference/registry-catalog.md"
        catalog.parent.mkdir(parents=True, exist_ok=True)
        values = [entry["id"] for entry in self.registry_value["entries"]] if full_coverage else []
        catalog.write_text("# Registry\n\n" + "\n".join(values) + "\n", encoding="utf-8")

    def write_inventory(self, *, aligned: bool) -> None:
        ui = VALIDATOR.UI_RUNTIME["commit"] if aligned else "1" * 40
        smart = VALIDATOR.SMART_RUNTIME["commit"] if aligned else "2" * 40
        components = VALIDATOR.EXPECTED_COUNTS["component"] if aligned else 72
        smart_count = VALIDATOR.EXPECTED_COUNTS["smart-component"] if aligned else 34
        self.ai_inventory.write_text(
            "# Source Inventory\n\n"
            f"- `ui`: `main` @ `{ui}`\n"
            f"- `ui-smart`: `main` @ `{smart}`\n\n"
            f"- Shipped components in `ui`: `{components}`\n"
            f"- Shipped smart-components in `ui-smart`: `{smart_count}`\n",
            encoding="utf-8",
        )

    def aligned_larena_lock(self) -> dict:
        return {
            "schema": "larena.ui.frontend_runtime_lock.v2",
            "runtime": "simai-framework",
            "tag": VALIDATOR.UI_RUNTIME["tag"],
            "pair_id": VALIDATOR.COMPATIBILITY_ID,
            "bundle_id": f"{VALIDATOR.COMPATIBILITY_ID}-registry-{self.aggregate_sha[:8]}",
            "ui": {**VALIDATOR.UI_RUNTIME, "files": 2596},
            "ui_smart": {**VALIDATOR.SMART_RUNTIME, "files": 112},
            "framework_registry": {
                "schema_id": VALIDATOR.SCHEMA_ID,
                "compatibility_id": VALIDATOR.COMPATIBILITY_ID,
                "profile": VALIDATOR.PROFILE,
                "relative_path": VALIDATOR.LARENA_REGISTRY_RELATIVE_PATH,
                "file_sha256": self.aggregate_sha,
                "source": {
                    "commit": self.source["commit"],
                    "tree": VALIDATOR.REGISTRY_TREE,
                    "tree_oid": self.source["tree_oid"],
                    "mount": "contract",
                    "sha256": self.source["archive_sha256"],
                    "files": 1,
                },
            },
        }

    def arguments(self) -> list[str]:
        return [
            "--aggregate", str(self.aggregate),
            "--ui-root", str(self.ui_root),
            "--ui-play-pointer", str(self.ui_play_pointer),
            "--ui-play-asset-lock", str(self.ui_play_lock),
            "--ui-doc-pointer", str(self.ui_doc_pointer),
            "--ui-doc-root", str(self.ui_doc_root),
            "--ai-skill-pointer", str(self.ai_skill_pointer),
            "--ai-skill-inventory", str(self.ai_inventory),
            "--larena-runtime-lock", str(self.larena_lock),
        ]

    def validate(self):
        return VALIDATOR.validate_consumers(
            self.aggregate,
            self.ui_root,
            self.ui_play_pointer,
            self.ui_play_lock,
            self.ui_doc_pointer,
            self.ui_doc_root,
            self.ai_skill_pointer,
            self.ai_inventory,
            self.larena_lock,
        )


class FrameworkConsumerDriftValidatorTest(unittest.TestCase):
    def test_positive_all_consumers_and_git_source_are_aligned(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            result = Fixtures(Path(temporary)).validate()
        self.assertEqual(result["status"], "passed")
        self.assertEqual(result["contract_identity"], "passed")
        self.assertEqual(result["stale_consumers"], [])
        self.assertEqual(result["registry"]["entry_count"], 331)
        self.assertTrue(all(value["accepted"] for value in result["consumers"].values()))
        self.assertTrue(result["screen_acceptance"]["accepted"])

    def test_real_consumer_drift_is_detected_without_hiding_larena_acceptance(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            fixtures = Fixtures(Path(temporary))
            lock = fixtures.aligned_ui_play_lock()
            lock["smart"]["commit"] = "e" * 40
            fixtures.ui_play_lock = fixtures.write("simai-assets.lock.json", lock)
            fixtures.write_docs(full_coverage=False)
            fixtures.write_inventory(aligned=False)
            result = fixtures.validate()
        self.assertEqual(result["status"], "passed")
        self.assertEqual(result["stale_consumers"], ["ai-skill", "ui-doc", "ui-play"])
        self.assertEqual(result["consumers"]["ui-play"]["status"], "drifted")
        self.assertEqual(result["consumers"]["ui-doc"]["status"], "partial")
        self.assertEqual(result["consumers"]["ai-skill"]["status"], "drifted")
        self.assertFalse(result["consumers"]["ui-play"]["accepted"])
        self.assertTrue(result["consumers"]["larena"]["accepted"])
        self.assertTrue(result["screen_acceptance"]["does_not_depend_on_stale_consumers"])

    def test_pointer_identity_policy_and_no_copy_fail_closed(self) -> None:
        cases = {
            "wrong-id": lambda value: value["consumer"].update({"id": "simai/wrong"}),
            "wrong-role": lambda value: value["consumer"].update({"role": "documentation"}),
            "wrong-hash": lambda value: value["registry"].update({"file_sha256": "0" * 64}),
            "unsafe-policy": lambda value: value["policy"].update({"imports_upstream_metadata": True}),
            "copied-entries": lambda value: value.update({"entries": []}),
        }
        for name, mutate in cases.items():
            with self.subTest(case=name), tempfile.TemporaryDirectory() as temporary:
                fixtures = Fixtures(Path(temporary))
                value = fixtures.pointer("simai/ui-play", "runnable-examples")
                mutate(value)
                fixtures.ui_play_pointer = fixtures.write(f"{name}.json", value)
                with self.assertRaises(VALIDATOR.DriftError):
                    fixtures.validate()

    def test_larena_lock_and_registry_git_artifact_fail_closed(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            fixtures = Fixtures(Path(temporary))
            lock = fixtures.aligned_larena_lock()
            lock["framework_registry"]["source"]["tree_oid"] = "0" * 40
            fixtures.larena_lock = fixtures.write("wrong-lock.json", lock)
            with self.assertRaisesRegex(VALIDATOR.DriftError, "larena_registry_lock_identity_mismatch"):
                fixtures.validate()

        with tempfile.TemporaryDirectory() as temporary:
            fixtures = Fixtures(Path(temporary))
            changed = copy.deepcopy(fixtures.registry_value)
            changed["contract_note"] = "metamorphic-change"
            fixtures.aggregate = fixtures.write("changed-aggregate.json", changed)
            fixtures.aggregate_sha = VALIDATOR.sha256_file(fixtures.aggregate)
            for key, consumer_id, role in (
                ("ui_play_pointer", "simai/ui-play", "runnable-examples"),
                ("ui_doc_pointer", "simai/ui-doc", "documentation"),
                ("ai_skill_pointer", "simai/framework-ai-skill", "ai-guidance"),
            ):
                setattr(fixtures, key, fixtures.write(f"{key}.json", fixtures.pointer(consumer_id, role)))
            with self.assertRaisesRegex(VALIDATOR.DriftError, "registry_git_artifact_sha256_mismatch"):
                fixtures.validate()

    def test_public_ids_and_recipe_utility_closure_fail_closed(self) -> None:
        registry = json.loads(AGGREGATE.read_text(encoding="utf-8"))
        registry["entries"][0]["id"] = "component.bad_name"
        with tempfile.TemporaryDirectory() as temporary:
            path = Fixtures.write_path(Path(temporary) / "bad-id.json", registry)
            with self.assertRaises(VALIDATOR.DriftError):
                VALIDATOR.validate_aggregate(path)

        registry = json.loads(AGGREGATE.read_text(encoding="utf-8"))
        registry["indexes"]["recipe_closure"]["recipe.admin.collection"].remove("utility.gap")
        with tempfile.TemporaryDirectory() as temporary:
            path = Fixtures.write_path(Path(temporary) / "bad-closure.json", registry)
            with self.assertRaisesRegex(VALIDATOR.DriftError, "recipe_utility_closure_incomplete"):
                VALIDATOR.validate_aggregate(path)

    def test_pointer_order_and_whitespace_are_metamorphic(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            fixtures = Fixtures(Path(temporary))
            expected = fixtures.validate()
            value = fixtures.pointer("simai/ui-play", "runnable-examples")
            reordered = {key: value[key] for key in reversed(list(value))}
            fixtures.ui_play_pointer = fixtures.write("reordered.json", reordered, sort_keys=True)
            actual = fixtures.validate()
        self.assertEqual(actual, expected)

    def test_cli_is_stable_and_json_errors_are_machine_readable(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            fixtures = Fixtures(Path(temporary))
            command = [sys.executable, str(VALIDATOR_PATH), *fixtures.arguments(), "--json"]
            environment = {**os.environ, "PYTHONDONTWRITEBYTECODE": "1"}
            first = subprocess.check_output(command, text=True, env=environment)
            second = subprocess.check_output(command, text=True, env=environment)
            self.assertEqual(first, second)
            self.assertEqual(json.loads(first)["status"], "passed")

            broken = fixtures.pointer("simai/ui-play", "runnable-examples")
            broken["registry"]["file_sha256"] = "0" * 64
            fixtures.ui_play_pointer = fixtures.write("broken.json", broken)
            result = subprocess.run(
                [sys.executable, str(VALIDATOR_PATH), *fixtures.arguments(), "--json"],
                text=True,
                capture_output=True,
                env=environment,
            )
            self.assertEqual(result.returncode, 1)
            self.assertEqual(json.loads(result.stdout)["status"], "failed")
            self.assertIn("pointer_registry_identity_mismatch", result.stdout)


if __name__ == "__main__":
    unittest.main()
