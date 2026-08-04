import gzip
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]


class UiRadiusContractTest(unittest.TestCase):
    def read(self, relative: str) -> str:
        return (ROOT / relative).read_text(encoding="utf-8")

    def test_core_publishes_one_shared_ui_radius(self) -> None:
        core = self.read("distr/core/css/core.css")
        self.assertEqual(core.count("--sf-radius-1\\/3: var(--sf-a2);"), 2)
        self.assertIn("--sf-radius--ui: var(--sf-radius-1\\/3);", core)
        self.assertEqual(core.count("--sf-ui-radius-default: var(--sf-radius--ui)"), 2)

    def test_small_controls_inherit_native_component_aliases(self) -> None:
        expected = {
            "distr/component/buttons/css/buttons.css": "--sf-button--radius: var(--sf-radius--ui);",
            "distr/component/icon-buttons/css/icon-buttons.css": "--sf-icon-button--radius: var(--sf-radius--ui);",
            "distr/component/inputs/css/inputs.css": "--sf-input--radius: var(--sf-radius--ui);",
            "distr/component/dropdown/css/dropdown.css": "--sf-dropdown--radius: var(--sf-radius--ui);",
        }
        for relative, declaration in expected.items():
            with self.subTest(relative=relative):
                self.assertIn(declaration, self.read(relative))

    def test_gzip_companions_match_plain_css(self) -> None:
        for relative in (
            "distr/core/css/core.css",
            "distr/component/buttons/css/buttons.css",
            "distr/component/icon-buttons/css/icon-buttons.css",
            "distr/component/inputs/css/inputs.css",
            "distr/component/dropdown/css/dropdown.css",
        ):
            path = ROOT / relative
            with self.subTest(relative=relative):
                self.assertEqual(gzip.decompress(path.with_suffix(".css.gz").read_bytes()), path.read_bytes())


if __name__ == "__main__":
    unittest.main()
