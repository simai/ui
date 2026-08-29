#!/usr/bin/env python3
"""Apply the source-owned SF5 UI radius delta to the accepted distribution."""

from __future__ import annotations

import argparse
import gzip
from pathlib import Path


REPLACEMENTS = {
    "distr/core/css/core.css": [
        (
            ":root{--sf-radius-1\\/2: var(--sf-a4);",
            ":root{--sf-radius-1\\/3: var(--sf-a2);--sf-radius-1\\/2: var(--sf-a4);",
            2,
        ),
        (
            "--sf-ui-radius-default: var(--sf-a4)",
            "--sf-ui-radius-default: var(--sf-radius--ui)",
            2,
        ),
    ],
    "distr/component/buttons/css/buttons.css": [
        (
            ".sf-button{border-bottom-right-radius:",
            ".sf-button{--sf-button--radius: var(--sf-radius--ui);border-bottom-right-radius:",
            1,
        ),
        ("var(--sf-button--border-bottom-right-radius, var(--sf-radius-default))", "var(--sf-button--border-bottom-right-radius, var(--sf-button--radius))", 1),
        ("var(--sf-button--border-bottom-left-radius, var(--sf-radius-default))", "var(--sf-button--border-bottom-left-radius, var(--sf-button--radius))", 1),
        ("var(--sf-button--border-top-right-radius, var(--sf-radius-default))", "var(--sf-button--border-top-right-radius, var(--sf-button--radius))", 1),
        ("var(--sf-button--border-top-left-radius, var(--sf-radius-default))", "var(--sf-button--border-top-left-radius, var(--sf-button--radius))", 1),
    ],
    "distr/component/icon-buttons/css/icon-buttons.css": [
        (
            ".sf-icon-button{border-bottom-right-radius:",
            ".sf-icon-button{--sf-icon-button--radius: var(--sf-radius--ui);border-bottom-right-radius:",
            1,
        ),
        ("var(--sf-icon-button--border-bottom-right-radius, var(--sf-radius-default))", "var(--sf-icon-button--border-bottom-right-radius, var(--sf-icon-button--radius))", 1),
        ("var(--sf-icon-button--border-bottom-left-radius, var(--sf-radius-default))", "var(--sf-icon-button--border-bottom-left-radius, var(--sf-icon-button--radius))", 1),
        ("var(--sf-icon-button--border-top-right-radius, var(--sf-radius-default))", "var(--sf-icon-button--border-top-right-radius, var(--sf-icon-button--radius))", 1),
        ("var(--sf-icon-button--border-top-left-radius, var(--sf-radius-default))", "var(--sf-icon-button--border-top-left-radius, var(--sf-icon-button--radius))", 1),
    ],
    "distr/component/inputs/css/inputs.css": [
        (
            ".sf-input{background-color:",
            ".sf-input{--sf-input--radius: var(--sf-radius--ui);background-color:",
            1,
        ),
        ("var(--sf-ui-radius-default)", "var(--sf-input--radius)", 4),
    ],
    "distr/component/dropdown/css/dropdown.css": [
        (
            ".sf-dropdown{background-color:",
            ".sf-dropdown{--sf-dropdown--radius: var(--sf-radius--ui);background-color:",
            1,
        ),
        ("var(--sf-radius-1\\/2)", "var(--sf-dropdown--radius)", 4),
    ],
}


def apply(root: Path) -> None:
    for relative, replacements in REPLACEMENTS.items():
        path = root / relative
        source = path.read_text(encoding="utf-8-sig")
        for old, new, expected in replacements:
            count = source.count(old)
            if count != expected:
                if source.count(new) == expected:
                    continue
                raise RuntimeError(f"radius_contract_source_mismatch:{relative}:{old}:{count}")
            source = source.replace(old, new)
        data = source.encode("utf-8")
        path.write_bytes(data)
        path.with_suffix(path.suffix + ".gz").write_bytes(gzip.compress(data, mtime=0))


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1])
    args = parser.parse_args()
    apply(args.root.resolve())
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
