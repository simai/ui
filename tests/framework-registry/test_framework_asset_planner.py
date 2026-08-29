from __future__ import annotations

import importlib.util
import json
import os
import tempfile
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]


def load_planner():
    path = ROOT / "scripts/plan-framework-assets.py"
    spec = importlib.util.spec_from_file_location("framework_asset_planner", path)
    if spec is None or spec.loader is None:
        raise RuntimeError("framework_asset_planner_unavailable")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


PLANNER = load_planner()


class FrameworkAssetPlannerTest(unittest.TestCase):
    def fixture(self, directory: Path) -> tuple[Path, Path]:
        ui = directory / "ui"
        smart = directory / "ui-smart"
        rules = [
            {"name": "display/default", "regex": "/class=[\"'][^\"']*\\bflex\\b/i"},
            {"name": "buttons", "type": "component", "css": True, "js": True, "regex": "/sf-button/"},
            {"name": "cl-buttons", "type": "smart", "mode": "smart", "js": True, "tags": ["sf-button"], "relation": [{"name": "buttons"}]},
        ]
        (ui / "distr/rule").mkdir(parents=True)
        (ui / "distr/rule/rule.json").write_text(json.dumps(rules), encoding="utf-8")
        files = {
            ui / "distr/utility/display/default/css/default.css": ".flex{display:flex}",
            ui / "distr/component/buttons/css/buttons.css": ".sf-button{display:inline-flex}",
            ui / "distr/component/buttons/js/buttons.js": "window.SFButton=true;",
            smart / "smart/buttons/js/buttons.js": "customElements.define('sf-button',class extends HTMLElement{});",
        }
        for path, content in files.items():
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(content, encoding="utf-8")
        return ui, smart

    def test_exact_plan_uses_loader_rules_and_dependency_order(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            ui, smart = self.fixture(Path(temporary))
            html = '<main class="flex"><sf-button>Save</sf-button></main>'
            first = PLANNER.build_plan(html, ui, smart)
            second = PLANNER.build_plan(html, ui, smart)
        self.assertEqual(first, second)
        self.assertEqual(first["schema"], "simai.framework.asset_plan.v1")
        self.assertEqual(first["modules"], ["display/default", "buttons", "cl-buttons"])
        self.assertEqual(
            [(asset["module"], asset["kind"]) for asset in first["assets"]],
            [
                ("display/default", "css"),
                ("buttons", "css"),
                ("buttons", "javascript"),
                ("cl-buttons", "smart_javascript"),
            ],
        )

    def test_data_sf_require_covers_undetectable_first_frame_resource(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            ui, smart = self.fixture(Path(temporary))
            plan = PLANNER.build_plan('<div data-sf-require="smart.buttons"></div>', ui, smart)
        self.assertEqual(plan["modules"], ["buttons", "cl-buttons"])

    def test_no_build_contract_is_unchanged_when_nothing_matches(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            ui, smart = self.fixture(Path(temporary))
            plan = PLANNER.build_plan("<p>Plain HTML</p>", ui, smart)
        self.assertEqual(plan["modules"], [])
        self.assertEqual(plan["assets"], [])

    def test_head_resources_and_code_samples_do_not_change_the_body_plan(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            ui, smart = self.fixture(Path(temporary))
            plain = PLANNER.build_plan(
                "<!doctype html><html><head></head><body><p>Plain HTML</p></body></html>",
                ui,
                smart,
            )
            decorated = PLANNER.build_plan(
                "<!doctype html><html><head><script>const sample='sf-button flex';</script></head>"
                "<body><p>Plain HTML</p><pre><code class='flex'><sf-button></sf-button></code></pre></body></html>",
                ui,
                smart,
            )
        self.assertEqual(plain["modules"], [])
        self.assertEqual(decorated["modules"], [])
        self.assertEqual(plain["html_sha256"], decorated["html_sha256"])

    def test_body_classes_are_part_of_the_first_frame_plan(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            ui, smart = self.fixture(Path(temporary))
            plan = PLANNER.build_plan(
                '<!doctype html><html><head></head><body class="flex"><p>Content</p></body></html>',
                ui,
                smart,
            )
        self.assertEqual(plan["modules"], ["display/default"])

    def test_registry_declares_smart_template_dependencies_without_visibility_false_positive(self) -> None:
        rules = PLANNER.load_rules(ROOT / "distr/rule/rule.json")
        by_name = {rule["name"]: rule for rule in rules}
        button_relations = {item["name"] for item in by_name["cl-buttons"]["relation"]}
        icon_button_relations = {item["name"] for item in by_name["cl-icon-buttons"]["relation"]}
        clipboard_relations = {item["name"] for item in by_name["clipboard"]["relation"]}
        self.assertTrue({"buttons", "pointer-events/default", "text-align/default"} <= button_relations)
        self.assertTrue({"icon-buttons", "cl-icons", "pointer-events/default"} <= icon_button_relations)
        self.assertEqual(clipboard_relations, {"icon-buttons", "icons", "doc", "highlight"})
        visibility = PLANNER.compile_loader_regex(
            by_name["visibility/default"]["regex"], "visibility/default"
        )
        self.assertIsNotNone(visibility)
        self.assertIsNone(visibility.search('<div class="overflow-visible"></div>'))
        self.assertIsNotNone(visibility.search('<div class="visible"></div>'))

    def test_invalid_regex_dependency_and_files_fail_closed(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            ui, smart = self.fixture(Path(temporary))
            rule_path = ui / "distr/rule/rule.json"
            rules = json.loads(rule_path.read_text())
            rules[0]["regex"] = "/[/"
            rule_path.write_text(json.dumps(rules), encoding="utf-8")
            with self.assertRaisesRegex(PLANNER.AssetPlanError, "rule_regex_invalid"):
                PLANNER.build_plan('<div class="flex"></div>', ui, smart)

        with tempfile.TemporaryDirectory() as temporary:
            ui, smart = self.fixture(Path(temporary))
            rules = json.loads((ui / "distr/rule/rule.json").read_text())
            rules[2]["relation"] = [{"name": "missing"}]
            (ui / "distr/rule/rule.json").write_text(json.dumps(rules), encoding="utf-8")
            with self.assertRaisesRegex(PLANNER.AssetPlanError, "dependency_unknown"):
                PLANNER.build_plan('<sf-button></sf-button>', ui, smart)

        with tempfile.TemporaryDirectory() as temporary:
            ui, smart = self.fixture(Path(temporary))
            target = ui / "distr/component/buttons/css/buttons.css"
            target.unlink()
            target.symlink_to(ui / "distr/utility/display/default/css/default.css")
            with self.assertRaisesRegex(PLANNER.AssetPlanError, "asset_symlink_forbidden"):
                PLANNER.build_plan('<sf-button></sf-button>', ui, smart)

    def test_hardlink_and_unknown_explicit_requirement_fail_closed(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            ui, smart = self.fixture(Path(temporary))
            target = ui / "distr/component/buttons/css/buttons.css"
            os.link(target, target.with_name("copy.css"))
            with self.assertRaisesRegex(PLANNER.AssetPlanError, "asset_hardlink_forbidden"):
                PLANNER.build_plan('<sf-button></sf-button>', ui, smart)
        with tempfile.TemporaryDirectory() as temporary:
            ui, smart = self.fixture(Path(temporary))
            with self.assertRaisesRegex(PLANNER.AssetPlanError, "explicit_requirement_unknown"):
                PLANNER.build_plan('<div data-sf-require="smart.unknown"></div>', ui, smart)


if __name__ == "__main__":
    unittest.main()
