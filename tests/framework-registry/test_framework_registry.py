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


def load_builder():
    path = ROOT / "scripts/build-framework-registry.py"
    spec = importlib.util.spec_from_file_location("framework_registry_builder", path)
    if spec is None or spec.loader is None:
        raise RuntimeError("framework_registry_builder_unavailable")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


BUILDER = load_builder()

# The ui-owned Smart manifest once Smart is published into distr/smart (lock
# v2); until then the one ui-smart keeps, named by SIMAI_UI_SMART_MANIFEST.
SMART_MANIFEST_INPUT = os.environ.get("SIMAI_UI_SMART_MANIFEST") or BUILDER.default_smart_manifest(ROOT)
if not SMART_MANIFEST_INPUT:
    raise RuntimeError("SIMAI_UI_SMART_MANIFEST is required for cross-repository tests")
SMART_MANIFEST = Path(SMART_MANIFEST_INPUT).resolve()
GENERATED = ROOT / "contracts/generated/framework-contract-registry.json"
DOCUMENTATION_SOURCE = ROOT / "contracts/generated/documentation-source.json"
# The release and the Smart contract revision move with every publication, so
# they are read from the generated aggregate instead of being retyped here. The
# assertions below then tie them back to the runtimes they name, which is the
# part that has to hold; a pin in this file only ever went stale.
GENERATED_REGISTRY = json.loads(GENERATED.read_text())
PAIR_ID = GENERATED_REGISTRY["compatibility"]["id"]
LOCK = ROOT / f"contracts/releases/{PAIR_ID}.lock.json"
LOCK_VERSION = json.loads(LOCK.read_text())["schema_version"]
# A v1 pair's Smart manifest lives in ui-smart and is referenced from here; a v2
# release's lives in this tree and needs no reference.
SMART_CONTRACT_REVISION = next(
    (
        item.get("contract_revision")
        for item in GENERATED_REGISTRY["source_manifests"]
        if item["kind"] == "smart-component"
    ),
    None,
)
SMART_REFERENCE = (
    ROOT / f"contracts/registry-inputs/ui-smart-{SMART_CONTRACT_REVISION[:12]}.ref.json"
    if SMART_CONTRACT_REVISION
    else None
)


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
        smart_runtime_path = "distr/smart" if LOCK_VERSION == 2 else "smart"
        for root, manifest_path, runtime_path in (
            (ROOT, ROOT / "contracts/owners/utility.manifest.json", "distr"),
            (smart_root, SMART_MANIFEST, smart_runtime_path),
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
                "utility": 229,
                "component": 64,
                # 49 until the four components now in package larena left
                # the free release (two of them, sf-data-view and
                # sf-property-view, were never entries here); 48 with
                # sf-page-header; 60 with sf-progress-ring; 61 with sf-site-header.
                "smart-component": 62,
                "recipe": 1,
                "total": 356,
            },
        )
        # The id names the runtimes it was built from; that is the claim, not
        # the literal string.
        sources = {
            item["runtime_path"]: item
            for item in self.registry["compatibility"]["runtime_sources"]
        }
        if LOCK_VERSION == 2:
            # One ui build commit is the release, for both trees.
            self.assertEqual(set(sources), {"distr", "distr/smart"})
            self.assertEqual({item["owner"] for item in sources.values()}, {"simai/ui"})
            revision = sources["distr"]["revision"]
            self.assertEqual(sources["distr/smart"]["revision"], revision)
            self.assertEqual(sources["distr"]["commit"], revision)
            self.assertEqual(self.registry["compatibility"]["id"], f"ui-{revision[:12]}")
            self.assertRegex(self.registry["compatibility"]["id"], r"^ui-[0-9a-f]{12}$")
            self.assertEqual(self.registry["compatibility"]["release_lock_version"], 2)
            mirror = self.registry["compatibility"].get("mirror")
            if mirror is not None:
                self.assertEqual(mirror["runtime_tree"], sources["distr/smart"]["runtime_tree"])
                self.assertEqual(
                    self.registry["compatibility"]["pair"],
                    f"ui-{revision[:12]}-smart-{mirror['commit'][:12]}",
                )
        else:
            self.assertEqual(
                self.registry["compatibility"]["id"],
                "ui-{}-smart-{}".format(
                    sources["distr"]["commit"][:12],
                    sources["smart"]["commit"][:12],
                ),
            )
            self.assertRegex(self.registry["compatibility"]["id"], r"^ui-[0-9a-f]{12}-smart-[0-9a-f]{12}$")
        self.assertEqual(self.registry["compatibility"]["status"], "bounded")
        self.assertEqual(self.registry["compatibility"]["profile"], "plain-assets-v1")
        lock = json.loads(LOCK.read_text())
        self.assertEqual(
            self.registry["compatibility"]["build_inputs"],
            lock["build_inputs"],
        )
        legacy = lock["build_inputs"]["legacy_compatibility"]
        self.assertEqual(legacy, {"required": False})
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
        self.assertGreaterEqual(len(closure), 22)
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
        # The table the recipe places is Larena's (package larena): it is not a free
        # entry, so it is named, by package, in recipe_packages, and the walk
        # goes on through what its package reference says it needs.
        self.assertNotIn("smart.data-view", closure)
        self.assertIn("smart.list-item", closure, "a dependency is in the closure even when it is not offered")
        self.assertIn("smart.tag", closure, "reached through the package table's requirements")
        self.assertEqual(
            self.registry["indexes"]["recipe_packages"]["recipe.admin.collection"],
            {"larena": ["smart.data-view"]},
        )
        self.assertEqual(
            self.registry["indexes"]["packages"],
            {
                "larena": {
                    "owner": "simai/larena-ui",
                    "provides": [
                        "smart.admin-menu",
                        "smart.change-confirm",
                        "smart.chat-composer",
                        "smart.chat-interlocutor",
                        "smart.chat-message",
                        "smart.chat-window",
                        "smart.data-view",
                        "smart.data-view-composite",
                        "smart.message-log",
                        "smart.property-view",
                        "smart.thread-list",
                    ],
                }
            },
        )
        for public_id in self.registry["indexes"]["packages"]["larena"]["provides"]:
            self.assertNotIn(public_id, self.by_id)
        for component_id in ("component.file-preview", "component.link"):
            self.assertIn(component_id, self.by_id)
            self.assertTrue(
                (ROOT / self.by_id[component_id]["runtime"]["asset_root"]).is_dir()
            )
        # Suggestability is asserted for what the recipe places, not for the
        # whole closure: see test_inventory_is_fail_closed_outside_curated_plan.
        self.assertTrue(
            all(
                self.by_id[public_id]["readiness"]["safe_to_suggest"]
                for public_id in self.by_id["recipe.admin.collection"]["requires"]
                if public_id in self.by_id
            )
        )
        self.assertEqual(
            self.by_id["recipe.admin.collection"]["requires"],
            [
                "smart.button",
                "smart.data-view",
                "smart.pagination",
                "utility.display",
                "utility.flex-direction",
                "utility.gap",
                "utility.overflow",
                "utility.width",
            ],
        )
        # What the table itself fetches is the package's to state (its own
        # manifests in larena-ui); this registry no longer holds it.

    def test_inventory_is_fail_closed_outside_curated_plan(self) -> None:
        safe = set(self.registry["indexes"]["safe_to_suggest"])
        closure = set(
            self.registry["indexes"]["recipe_closure"]["recipe.admin.collection"]
        )
        # The recipe's curated plan is suggestable. Outside it, an entry is
        # suggested only when it was promoted by the rule in
        # contracts/owners/PROMOTION.md (owner, 2026-10-19, after the
        # ui-vscode audit): ready, unblocked, and named in the promotion record.
        promoted = set(
            json.loads((ROOT / "contracts/owners/promotion.json").read_text())[
                "promoted"
            ]
        )
        self.assertLessEqual(safe, closure | {"recipe.admin.collection"} | promoted)
        # A reviewed and held entry carries its reason, so a consumer can tell
        # it from one nobody has reviewed.
        held = json.loads((ROOT / "contracts/owners/promotion.json").read_text())["held"]
        for public_id in held:
            self.assertNotIn(public_id, safe, public_id)
            self.assertNotEqual(self.by_id[public_id]["readiness"]["blockers"], [], public_id)
        for public_id in promoted:
            self.assertIn(public_id, safe, public_id)
            self.assertEqual(self.by_id[public_id]["readiness"]["status"], "ready")
            self.assertEqual(self.by_id[public_id]["readiness"]["blockers"], [])
        self.assertTrue(
            all(
                self.by_id[public_id]["readiness"]["safe_to_suggest"]
                for public_id in self.by_id["recipe.admin.collection"]["requires"]
                if public_id in self.by_id
            ),
            "a recipe may only place components that are safe to suggest",
        )
        self.assertEqual(self.registry["indexes"]["blocked"], [])
        self.assertNotIn("utility.filer-hue-rotate", self.by_id)
        self.assertIn("utility.filter-hue-rotate", self.by_id)
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
        self.assertIn("smart.pagination", entities)
        self.assertNotIn("smart.data-view", entities, "a Pro component is not documented as a free entity")
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

            core_key = "core" if LOCK_VERSION == 2 else "ui"
            wrong_hash = copy.deepcopy(lock)
            wrong_hash["runtime_sources"][core_key]["archive_sha256"] = "invalid"
            wrong_hash_path = self.write_json(directory, "wrong-hash.json", wrong_hash)
            with self.assertRaisesRegex(
                BUILDER.ContractError, f"release_lock_source_hash_invalid:{core_key}"
            ):
                BUILDER.build_registry(ROOT, SMART_MANIFEST, release_lock_path=wrong_hash_path)

            missing_legacy = copy.deepcopy(lock)
            del missing_legacy["build_inputs"]["legacy_compatibility"]
            missing_legacy_path = self.write_json(directory, "missing-legacy.json", missing_legacy)
            with self.assertRaisesRegex(BUILDER.ContractError, "release_lock_build_inputs_invalid"):
                BUILDER.build_registry(ROOT, SMART_MANIFEST, release_lock_path=missing_legacy_path)

            invalid_disabled_legacy = copy.deepcopy(lock)
            invalid_disabled_legacy["build_inputs"]["legacy_compatibility"]["source"] = {}
            invalid_disabled_path = self.write_json(
                directory, "invalid-disabled-legacy.json", invalid_disabled_legacy
            )
            with self.assertRaisesRegex(
                BUILDER.ContractError, "release_lock_legacy_compatibility_invalid"
            ):
                BUILDER.build_registry(
                    ROOT, SMART_MANIFEST, release_lock_path=invalid_disabled_path
                )

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

    def test_ui_owned_smart_manifest_names_ui_only(self) -> None:
        if LOCK_VERSION != 2:
            self.skipTest("the current release is a v1 pair; its Smart manifest is ui-smart's")
        smart_manifest = json.loads(SMART_MANIFEST.read_text())
        self.assertEqual(SMART_MANIFEST, (ROOT / BUILDER.SMART_MANIFEST_PATH).resolve())
        self.assertEqual(smart_manifest["owner"]["id"], "simai/ui")
        release = smart_manifest["release"]["commit"]
        for entry in smart_manifest["entries"]:
            self.assertEqual(entry["owner"], "simai/ui")
            self.assertEqual(entry["provenance"]["commit"], release)
            for ref in entry["runtime"]["asset_paths"]:
                self.assertTrue(
                    ref.startswith(f"simai/ui@{release}:distr/smart/"),
                    f"{entry['id']} asset outside the published Smart tree: {ref}",
                )
        self.assertNotIn("simai/ui-smart", json.dumps(smart_manifest))
        smart_source = next(
            item
            for item in self.registry["source_manifests"]
            if item["kind"] == "smart-component"
        )
        self.assertEqual(
            set(smart_source),
            {"kind", "owner", "path", "hash_mode", "sha256", "file_sha256"},
        )

    def test_no_copy_smart_pointer_and_wrong_reference_hash(self) -> None:
        if SMART_REFERENCE is None:
            self.skipTest("a v2 release has no cross-repository Smart reference")
        reference = json.loads(SMART_REFERENCE.read_text())
        smart_manifest = json.loads(SMART_MANIFEST.read_text())
        self.assertNotIn("entries", reference)
        self.assertEqual(
            reference["manifest"]["sha256"],
            BUILDER.canonical_manifest_hash(smart_manifest),
        )
        # The reference must name a commit that ui-smart actually has, and that
        # commit must be the one holding this manifest.
        self.assertRegex(reference["contract_revision"], r"^[0-9a-f]{40}$")
        self.assertEqual(reference["contract_revision"], SMART_CONTRACT_REVISION)
        smart_root = SMART_MANIFEST.parents[2]
        committed = subprocess.run(
            ["git", "-C", str(smart_root), "cat-file", "-p",
             reference["contract_revision"] + ":" + reference["manifest"]["path"]],
            check=True,
            capture_output=True,
        ).stdout
        self.assertEqual(
            hashlib.sha256(committed).hexdigest(),
            reference["manifest"]["file_sha256"],
            "the reference names a commit whose manifest is the one it hashes",
        )
        self.assertEqual(reference["status"], "committed")
        self.assertEqual(
            reference["manifest"]["file_sha256"],
            hashlib.sha256(SMART_MANIFEST.read_bytes()).hexdigest(),
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
