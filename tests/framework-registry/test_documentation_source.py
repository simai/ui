from __future__ import annotations

import importlib.util
import json
import re
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]


def load_builder():
    path = ROOT / "scripts/build-framework-registry.py"
    spec = importlib.util.spec_from_file_location("framework_registry_builder_docs", path)
    if spec is None or spec.loader is None:
        raise RuntimeError("framework_registry_builder_unavailable")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


class DocumentationSourceTest(unittest.TestCase):
    def test_checked_contract_is_deterministic_and_contains_public_surfaces(self) -> None:
        builder = load_builder()
        registry = json.loads(
            (ROOT / "contracts/generated/framework-contract-registry.json").read_text()
        )
        expected = builder.pretty_json(builder.build_documentation_source(ROOT, registry))
        actual = (ROOT / "contracts/generated/documentation-source.json").read_text()
        self.assertEqual(expected, actual)
        source = json.loads(actual)
        entities = {entity["key"]: entity for entity in source["entities"]}
        self.assertEqual(len(source["entities"]), len(entities))
        self.assertTrue(all(re.fullmatch(r"[a-z][a-z0-9_-]*(?:\.[a-z][a-z0-9_-]*)+", key) for key in entities))
        self.assertIn("recipe.admin.collection", entities)
        buttons = entities["component.buttons"]["public_contract"]
        self.assertIn("sf-button", buttons["classes"])
        self.assertIn("sf-button--primary", buttons["classes"])
        self.assertIn("--sf-button--radius", buttons["custom_properties"])
        radius = entities["core.design-tokens"]["public_contract"]["semantic_radius"]
        self.assertEqual("compact_controls", radius["--sf-radius--ui"]["scope"])
        self.assertEqual("large_surfaces", radius["--sf-radius-default"]["scope"])
        self.assertNotIn("documentation_refs", actual)
        self.assertNotIn("readiness", actual)


if __name__ == "__main__":
    unittest.main()
