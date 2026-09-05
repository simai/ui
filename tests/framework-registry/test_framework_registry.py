from __future__ import annotations

import copy
import gzip
import hashlib
import importlib.util
import json
import os
import re
import subprocess
import tempfile
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
SMART_MANIFEST_INPUT = os.environ.get("SIMAI_UI_SMART_MANIFEST")
if not SMART_MANIFEST_INPUT:
    raise RuntimeError("SIMAI_UI_SMART_MANIFEST is required for cross-repository tests")
SMART_MANIFEST = Path(SMART_MANIFEST_INPUT).resolve()
GENERATED = ROOT / "contracts/generated/framework-contract-registry.json"
DOCUMENTATION_SOURCE = ROOT / "contracts/generated/documentation-source.json"
LOCK = ROOT / "contracts/releases/ui-6360a94727a8-smart-3f86eabc5152.lock.json"
SMART_REFERENCE = ROOT / "contracts/registry-inputs/ui-smart-3f86eabc5152.ref.json"


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

    def test_exact_runtime_archives_and_precompressed_assets_are_reproducible(self) -> None:
        smart_root = SMART_MANIFEST.parents[2]
        for root, manifest_path, runtime_path in (
            (ROOT, ROOT / "contracts/owners/utility.manifest.json", "distr"),
            (smart_root, SMART_MANIFEST, "smart"),
        ):
            manifest = json.loads(manifest_path.read_text())
            release = manifest["release"]
            commit = release["commit"]
            self.assertEqual(
                subprocess.check_output(["git", "-C", str(root), "rev-parse", f"{commit}^{{tree}}"], text=True).strip(),
                release["tree"],
            )
            self.assertEqual(
                subprocess.check_output(["git", "-C", str(root), "rev-parse", f"{commit}:{runtime_path}"], text=True).strip(),
                release["runtime_subtree"],
            )
            archive = subprocess.check_output(
                ["git", "-C", str(root), "archive", "--format=tar", commit, runtime_path]
            )
            self.assertEqual(hashlib.sha256(archive).hexdigest(), release["archive_sha256"])
            for compressed in (root / runtime_path).rglob("*.gz"):
                plain = Path(str(compressed)[:-3])
                if plain.is_file():
                    self.assertEqual(gzip.decompress(compressed.read_bytes()), plain.read_bytes())

    def test_positive_inventory_pair_and_recipe_closure(self) -> None:
        self.assertEqual(
            self.registry["counts"],
            {
                "utility": 226,
                "component": 63,
                "smart-component": 43,
                "recipe": 1,
                "total": 333,
            },
        )
        self.assertEqual(
            self.registry["compatibility"]["id"],
            "ui-6360a94727a8-smart-3f86eabc5152",
        )
        self.assertEqual(self.registry["compatibility"]["status"], "bounded")
        self.assertEqual(self.registry["compatibility"]["profile"], "plain-assets-v1")
        lock = json.loads(LOCK.read_text())
        self.assertEqual(
            self.registry["compatibility"]["build_inputs"],
            lock["build_inputs"],
        )
        legacy = lock["build_inputs"]["legacy_compatibility"]
        self.assertTrue(legacy["required"])
        self.assertEqual(
            legacy["invocation"]["arguments"][-1],
            "--require-legacy-compatibility",
        )
        self.assertEqual(legacy["lineage_manifest"]["records_count"], 472)
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
        self.assertEqual(len(closure), 22)
        for utility_id in (
            "utility.display",
            "utility.flex-direction",
            "utility.gap",
            "utility.overflow",
            "utility.pointer-events",
            "utility.text-align",
            "utility.width",
        ):
            self.assertIn(utility_id, closure)
        self.assertIn("component.buttons", closure)
        self.assertIn("smart.table", closure)
        for component_id in ("component.file-preview", "component.link"):
            self.assertIn(component_id, self.by_id)
            self.assertTrue(
                (ROOT / self.by_id[component_id]["runtime"]["asset_root"]).is_dir()
            )
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
            ["utility.filer-hue-rotate"],
        )
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

    def test_documentation_source_is_deterministic_and_public_only(self) -> None:
        first = BUILDER.pretty_json(
            BUILDER.build_documentation_source(ROOT, self.registry)
        )
        second = BUILDER.pretty_json(
            BUILDER.build_documentation_source(ROOT, self.registry)
        )
        self.assertEqual(first, second)
        self.assertEqual(first, DOCUMENTATION_SOURCE.read_text())
        source = json.loads(first)
        self.assertEqual(source["schema"], "docara.documentation_source.v1")
        self.assertEqual(source["id"], "simai-framework")
        self.assertEqual(len(source["entities"]), self.registry["counts"]["total"] + 1)
        entities = {entity["key"]: entity for entity in source["entities"]}
        self.assertIn("component.buttons", entities)
        self.assertIn("utility.display", entities)
        self.assertIn("smart.table", entities)
        self.assertIn("sf-button", entities["component.buttons"]["public_contract"]["classes"])
        self.assertIn("sf-button--primary", entities["component.buttons"]["public_contract"]["classes"])
        self.assertIn("--sf-button--radius", entities["component.buttons"]["public_contract"]["custom_properties"])
        radius = entities["core.design-tokens"]["public_contract"]["semantic_radius"]
        self.assertEqual(radius["--sf-radius--ui"]["scope"], "compact_controls")
        self.assertEqual(radius["--sf-radius-default"]["scope"], "large_surfaces")
        self.assertNotIn("documentation_refs", first)
        self.assertNotIn("example_refs", first)
        self.assertNotIn("readiness", first)

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
            wrong_hash["runtime_sources"]["ui"]["archive_sha256"] = "invalid"
            wrong_hash_path = self.write_json(directory, "wrong-hash.json", wrong_hash)
            with self.assertRaisesRegex(
                BUILDER.ContractError, "release_lock_source_hash_invalid:ui"
            ):
                BUILDER.build_registry(ROOT, SMART_MANIFEST, release_lock_path=wrong_hash_path)

            missing_legacy = copy.deepcopy(lock)
            del missing_legacy["build_inputs"]["legacy_compatibility"]
            missing_legacy_path = self.write_json(directory, "missing-legacy.json", missing_legacy)
            with self.assertRaisesRegex(BUILDER.ContractError, "release_lock_build_inputs_invalid"):
                BUILDER.build_registry(ROOT, SMART_MANIFEST, release_lock_path=missing_legacy_path)

            wrong_lineage_hash = copy.deepcopy(lock)
            wrong_lineage_hash["build_inputs"]["legacy_compatibility"]["lineage_manifest"]["sha256"] = "invalid"
            wrong_lineage_hash_path = self.write_json(directory, "wrong-lineage-hash.json", wrong_lineage_hash)
            with self.assertRaisesRegex(BUILDER.ContractError, "release_lock_legacy_lineage_content_invalid"):
                BUILDER.build_registry(ROOT, SMART_MANIFEST, release_lock_path=wrong_lineage_hash_path)

            missing_required_flag = copy.deepcopy(lock)
            missing_required_flag["build_inputs"]["legacy_compatibility"]["invocation"]["arguments"].pop()
            missing_required_flag_path = self.write_json(directory, "missing-required-flag.json", missing_required_flag)
            with self.assertRaisesRegex(BUILDER.ContractError, "release_lock_legacy_invocation_binding_invalid"):
                BUILDER.build_registry(ROOT, SMART_MANIFEST, release_lock_path=missing_required_flag_path)

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
            "b07ee0178a1dbc6cb9b1fd49d106f2c12d3ec778",
        )
        self.assertEqual(reference["status"], "committed")
        self.assertEqual(
            reference["manifest"]["file_sha256"],
            "4ff2444f130e52e9565ea9db855488dcce4ba23ed7e698ae668951d5c2b1205e",
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
