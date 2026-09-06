from __future__ import annotations

import gzip
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[2]
CSS_DIR = ROOT / "distr/component/alerts/css"


class AlertsSuccessIconTest(unittest.TestCase):
    def test_success_icon_uses_success_role(self) -> None:
        css = (CSS_DIR / "alerts.css").read_text(encoding="utf-8")

        self.assertIn(
            ".sf-alert.sf-alert--success .sf-icon {\n"
            "  --sf-icon--color: var(--sf-success);\n"
            "}",
            css,
        )

    def test_gzip_artifacts_match_css(self) -> None:
        for name in ("alerts.css", "alerts.min.css"):
            self.assertEqual(
                (CSS_DIR / name).read_bytes(),
                gzip.decompress((CSS_DIR / f"{name}.gz").read_bytes()),
            )


if __name__ == "__main__":
    unittest.main()
