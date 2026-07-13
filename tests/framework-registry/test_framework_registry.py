from __future__ import annotations

import copy
import importlib.util
import json
import os
import re
import tempfile
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
SMART_MANIFEST_INPUT = os.environ.get("SIMAI_UI_SMART_MANIFEST")
if not SMART_MANIFEST_INPUT:
    raise RuntimeError("SIMAI_UI_SMART_MANIFEST is required for cross-repository tests")
SMART_MANIFEST = Path(SMART_MANIFEST_INPUT).resolve()
GENERATED = ROOT / "contracts/generated/framework-contract-registry.json"
LOCK = ROOT / "contracts/releases/sf-v5.3.2-7e836d8a-dd786bba.lock.json"
SMART_REFERENCE = ROOT / "contracts/registry-inputs/ui-smart-v5.3.1.ref.json"


def load_builder():
    path = ROOT / "scripts/build-framework-registry.py"
    spec = importlib.util.spec_from_file_location("framework_registry_builder", path)
    if spec is None or spec.loader is None:
        raise RuntimeError("framework_registry_builder_unavailable")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


BUILDER = load_builder()


class FrameworkContractRegistryTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.registry = BUILDER.build_registry(ROOT, SMART_MANIFEST)
        cls.by_id = {entry["id"]: entry for entry in cls.registry["entries"]}

    def write_json(self, directory: Path, name: str, value: dict) -> Path:
        path = directory / name
        path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n")
        return path

    def test_positive_inventory_pair_and_recipe_closure(self) -> None:
        self.assertEqual(
            self.registry["counts"],
            {
                "utility": 225,
                "component": 60,
                "smart-component": 45,
                "recipe": 1,
                "total": 331,
            },
        )
        self.assertEqual(
            self.registry["compatibility"]["id"],
            "sf-v5.3.2-7e836d8a-dd786bba",
        )
        self.assertEqual(self.registry["compatibility"]["status"], "bounded")
        self.assertEqual(self.registry["compatibility"]["profile"], "plain-assets-v1")
        self.assertEqual(
            self.registry["compatibility"]["claims"],
            {
                "full_compatible": False,
                "production_ready": False,
                "all_items_ready": False,
            },
        )

        ids = [entry["id"] for entry in self.registry["entries"]]
        self.assertEqual(ids, sorted(ids))
        self.assertEqual(len(ids), len(set(ids)))
        for public_id in ids:
            self.assertRegex(public_id, BUILDER.PUBLIC_ID)
            self.assertNotIn("_", public_id)
            self.assertFalse(
                any(re.fullmatch(r"v[0-9]+", segment) for segment in public_id.split("."))
            )

        closure = self.registry["indexes"]["recipe_closure"]["recipe.admin.collection"]
        self.assertEqual(
            {self.by_id[public_id]["kind"] for public_id in closure}
            | {self.by_id["recipe.admin.collection"]["kind"]},
            {"utility", "component", "smart-component", "recipe"},
        )
        self.assertEqual(len(closure), 24)
        for utility_id in (
            "utility.display",
            "utility.flex-direction",
            "utility.gap",
            "utility.overflow",
            "utility.width",
        ):
            self.assertIn(utility_id, closure)
        self.assertIn("component.buttons", closure)
        self.assertIn("smart.table", closure)
        self.assertTrue(
            all(self.by_id[public_id]["readiness"]["safe_to_suggest"] for public_id in closure)
        )
        self.assertEqual(
            self.by_id["recipe.admin.collection"]["requires"],
            [
                "smart.buttons",
                "smart.pagination",
                "smart.table",
                "utility.display",
                "utility.flex-direction",
                "utility.gap",
                "utility.overflow",
                "utility.width",
            ],
        )
        self.assertEqual(
            self.by_id["smart.table"]["requires"],
            [
                "component.buttons",
                "component.checkbox",
                "component.icon-buttons",
                "component.icons",
                "component.inputs",
                "component.pagination",
                "component.tags",
                "smart.datepicker",
                "smart.list",
            ],
        )

    def test_inventory_is_fail_closed_outside_curated_plan(self) -> None:
        safe = set(self.registry["indexes"]["safe_to_suggest"])
        closure = set(
            self.registry["indexes"]["recipe_closure"]["recipe.admin.collection"]
        )
        self.assertEqual(safe, closure | {"recipe.admin.collection"})
        self.assertEqual(
            self.registry["indexes"]["blocked"],
            ["smart.file-upload", "utility.filer-hue-rotate"],
        )
        file_upload = self.by_id["smart.file-upload"]
        self.assertEqual(file_upload["readiness"]["status"], "blocked")
        self.assertFalse(file_upload["readiness"]["safe_to_suggest"])
        typo_gap = self.by_id["utility.filer-hue-rotate"]
        self.assertEqual(typo_gap["readiness"]["status"], "blocked")
        self.assertEqual(
            typo_gap["readiness"]["blockers"],
            ["runtime_directory_missing:distr/utility/filer-hue-rotate"],
        )
        for entry in self.registry["entries"]:
            if entry["id"] not in safe and entry["readiness"]["status"] != "blocked":
                self.assertEqual(entry["readiness"]["status"], "discoverable")
                self.assertFalse(entry["readiness"]["safe_to_suggest"])

    def test_checked_in_aggregate_is_a_byte_identical_rebuild(self) -> None:
        first = BUILDER.pretty_json(BUILDER.build_registry(ROOT, SMART_MANIFEST))
        second = BUILDER.pretty_json(BUILDER.build_registry(ROOT, SMART_MANIFEST))
        self.assertEqual(first, second)
        self.assertEqual(first, GENERATED.read_text())
        self.assertNotIn("generated_at", first)
        self.assertNotIn("/" + "Users/", first)
        self.assertNotIn("file:" + "//", first)
        self.assertNotIn("pending-commit", first)

    def test_source_manifest_hashes_are_canonical_and_order_independent(self) -> None:
        component_path = ROOT / "contracts/owners/component.manifest.json"
        component = json.loads(component_path.read_text())
        expected_hash = BUILDER.canonical_manifest_hash(component)
        source = next(
            item
            for item in self.registry["source_manifests"]
            if item["kind"] == "component"
        )
        self.assertEqual(source["hash_mode"], "canonical-json-v1")
        self.assertEqual(source["sha256"], expected_hash)

        reordered = copy.deepcopy(component)
        reordered["entries"].reverse()
        self.assertEqual(BUILDER.canonical_manifest_hash(reordered), expected_hash)
        with tempfile.TemporaryDirectory() as temporary:
            path = self.write_json(Path(temporary), "component-reordered.json", reordered)
            rebuilt = BUILDER.build_registry(
                ROOT,
                SMART_MANIFEST,
                component_manifest_path=path,
            )
        self.assertEqual(BUILDER.pretty_json(rebuilt), BUILDER.pretty_json(self.registry))

    def test_semantic_owner_change_changes_manifest_hash_and_aggregate(self) -> None:
        component = json.loads(
            (ROOT / "contracts/owners/component.manifest.json").read_text()
        )
        changed = copy.deepcopy(component)
        changed["entries"][0]["title"] = "Curated avatar presentation"
        self.assertNotEqual(
            BUILDER.canonical_manifest_hash(changed),
            BUILDER.canonical_manifest_hash(component),
        )
        with tempfile.TemporaryDirectory() as temporary:
            path = self.write_json(Path(temporary), "component-semantic.json", changed)
            rebuilt = BUILDER.build_registry(
                ROOT,
                SMART_MANIFEST,
                component_manifest_path=path,
            )
        self.assertNotEqual(BUILDER.pretty_json(rebuilt), BUILDER.pretty_json(self.registry))

    def test_negative_wrong_pair_hash_id_and_relation_fail_closed(self) -> None:
        lock = json.loads(LOCK.read_text())
        utility = json.loads(
            (ROOT / "contracts/owners/utility.manifest.json").read_text()
        )
        recipe = json.loads(
            (ROOT / "contracts/owners/recipe.manifest.json").read_text()
        )
        with tempfile.TemporaryDirectory() as temporary:
            directory = Path(temporary)

            wrong_pair = copy.deepcopy(lock)
            wrong_pair["compatibility_id"] = "sf-unapproved-pair"
            wrong_pair_path = self.write_json(directory, "wrong-pair.json", wrong_pair)
            with self.assertRaisesRegex(BUILDER.ContractError, "release_lock_pair_invalid"):
                BUILDER.build_registry(ROOT, SMART_MANIFEST, release_lock_path=wrong_pair_path)

            wrong_hash = copy.deepcopy(lock)
            wrong_hash["runtime_sources"]["ui"]["archive_sha256"] = "0" * 64
            wrong_hash_path = self.write_json(directory, "wrong-hash.json", wrong_hash)
            with self.assertRaisesRegex(
                BUILDER.ContractError, "release_lock_source_hash_invalid:ui"
            ):
                BUILDER.build_registry(ROOT, SMART_MANIFEST, release_lock_path=wrong_hash_path)

            wrong_id = copy.deepcopy(utility)
            wrong_id["entries"][0]["id"] = "utility.bad_name"
            wrong_id_path = self.write_json(directory, "wrong-id.json", wrong_id)
            with self.assertRaisesRegex(BUILDER.ContractError, "public_id_invalid"):
                BUILDER.build_registry(
                    ROOT, SMART_MANIFEST, utility_manifest_path=wrong_id_path
                )

            versioned_id = copy.deepcopy(utility)
            legacy_version_token = "".join(("s", "f", "5"))
            versioned_id["entries"][0]["id"] = f"utility.{legacy_version_token}-layout"
            versioned_id_path = self.write_json(directory, "versioned-id.json", versioned_id)
            with self.assertRaisesRegex(BUILDER.ContractError, "public_id_version_marker_forbidden"):
                BUILDER.build_registry(
                    ROOT, SMART_MANIFEST, utility_manifest_path=versioned_id_path
                )

            version_segment = copy.deepcopy(utility)
            version_segment["entries"][0]["id"] = "utility.v5"
            version_segment_path = self.write_json(directory, "version-segment.json", version_segment)
            with self.assertRaisesRegex(BUILDER.ContractError, "public_id_version_segment_forbidden"):
                BUILDER.build_registry(
                    ROOT, SMART_MANIFEST, utility_manifest_path=version_segment_path
                )

            wrong_relation = copy.deepcopy(recipe)
            wrong_relation["entries"][0]["requires"].append("component.unknown")
            wrong_relation_path = self.write_json(
                directory, "wrong-relation.json", wrong_relation
            )
            with self.assertRaisesRegex(BUILDER.ContractError, "relation_unknown"):
                BUILDER.build_registry(
                    ROOT, SMART_MANIFEST, recipe_manifest_path=wrong_relation_path
                )

    def test_no_copy_smart_pointer_and_wrong_reference_hash(self) -> None:
        reference = json.loads(SMART_REFERENCE.read_text())
        smart_manifest = json.loads(SMART_MANIFEST.read_text())
        self.assertNotIn("entries", reference)
        self.assertEqual(
            reference["manifest"]["sha256"],
            BUILDER.canonical_manifest_hash(smart_manifest),
        )
        self.assertEqual(
            reference["contract_revision"],
            "16dcd1e804dd38d89965fe4fee433c315d788862",
        )
        self.assertEqual(reference["status"], "committed")
        self.assertEqual(
            reference["manifest"]["file_sha256"],
            "5939c09751850a4ec5e0cb6cf1531b8671807e7725a87011363072f6ba3491d2",
        )
        smart_source = next(
            item
            for item in self.registry["source_manifests"]
            if item["kind"] == "smart-component"
        )
        self.assertEqual(
            set(smart_source),
            {
                "kind",
                "owner",
                "path",
                "hash_mode",
                "sha256",
                "file_sha256",
                "contract_revision",
            },
        )

        wrong = copy.deepcopy(reference)
        wrong["manifest"]["sha256"] = "0" * 64
        with tempfile.TemporaryDirectory() as temporary:
            path = self.write_json(Path(temporary), "wrong-reference.json", wrong)
            with self.assertRaisesRegex(
                BUILDER.ContractError, "smart_reference_hash_invalid"
            ):
                BUILDER.build_registry(
                    ROOT,
                    SMART_MANIFEST,
                    smart_reference_path=path,
                )


if __name__ == "__main__":
    unittest.main()
