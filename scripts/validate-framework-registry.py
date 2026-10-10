#!/usr/bin/env python3
"""Validate that the checked-in aggregate is current and fail-closed."""

from __future__ import annotations

import importlib.util
import os
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
BUILDER = ROOT / "scripts/build-framework-registry.py"


def load_builder():
    spec = importlib.util.spec_from_file_location("framework_registry_builder", BUILDER)
    if spec is None or spec.loader is None:
        raise RuntimeError("framework_registry_builder_unavailable")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def main() -> int:
    builder = load_builder()
    # The ui-owned manifest when there is one, else the one ui-smart keeps.
    smart_manifest = os.environ.get("SIMAI_UI_SMART_MANIFEST") or builder.default_smart_manifest(ROOT)
    if not smart_manifest:
        print("SIMAI_UI_SMART_MANIFEST is required: no Smart owner manifest found", file=sys.stderr)
        return 1
    return builder.main(
        [
            "--ui-root",
            str(ROOT),
            "--smart-manifest",
            str(smart_manifest),
            "--check",
        ]
    )


if __name__ == "__main__":
    raise SystemExit(main())
