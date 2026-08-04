#!/usr/bin/env python3
"""Apply the source-owned SF5 UI-radius delta to the Docara runtime baseline."""

from __future__ import annotations

import argparse
import gzip
from pathlib import Path


def replace_exact(source: str, old: str, new: str, expected: int, path: str) -> str:
    if source.count(new) == expected:
        return source
    count = source.count(old)
    if count != expected:
        raise RuntimeError(f"radius_contract_source_mismatch:{path}:{old}:{count}")
    return source.replace(old, new)


def patch_core(source: str, path: str) -> str:
    source = replace_exact(
        source,
        "--sf-radius-1\\/2: 0.25rem;",
        "--sf-radius-1\\/3: 0.125rem;--sf-radius-1\\/2: 0.25rem;",
        2,
        path,
    )
    source = replace_exact(
        source,
        "--sf-radius-1\\/2: var(--sf-a4);",
        "--sf-radius-1\\/3: var(--sf-a2);--sf-radius-1\\/2: var(--sf-a4);",
        2,
        path,
    )
    return replace_exact(
        source,
        "--sf-ui-radius-default: var(--sf-a4)",
        "--sf-ui-radius-default: var(--sf-radius--ui)",
        2,
        path,
    )


def patch_component(source: str, path: str, component: str, anchor: str) -> str:
    own = f"--sf-{component}--radius"
    source = replace_exact(
        source,
        anchor,
        anchor.replace("{", "{" + own + ": var(--sf-radius--ui);", 1),
        1,
        path,
    )
    for corner in (
        "border-bottom-right-radius",
        "border-bottom-left-radius",
        "border-top-right-radius",
        "border-top-left-radius",
    ):
        source = source.replace(
            f"var(--sf-{component}--{corner}, var(--sf-radius-default))",
            f"var(--sf-{component}--{corner}, var({own}))",
        )
    if f"border-radius: var({own});" in source or f"border-radius:var({own})" in source:
        return source
    if "border-radius: var(--sf-radius-default);" in source:
        source = replace_exact(
            source,
            "border-radius: var(--sf-radius-default);",
            f"border-radius: var({own});",
            1,
            path,
        )
    else:
        source = replace_exact(
            source,
            "border-radius:var(--sf-radius-default)",
            f"border-radius:var({own})",
            1,
            path,
        )
    return source


def patch_input(source: str, path: str, anchor: str) -> str:
    source = replace_exact(
        source,
        anchor,
        anchor.replace("{", "{--sf-input--radius: var(--sf-radius--ui);", 1),
        1,
        path,
    )
    for corner in ("end-end", "end-start", "start-end", "start-start"):
        separator = ": " if f"--sf-input-field--border-{corner}-radius: " in source else ":"
        source = replace_exact(
            source,
            f"--sf-input-field--border-{corner}-radius{separator}var(--sf-ui-radius-default)",
            f"--sf-input-field--border-{corner}-radius{separator}var(--sf-input--radius)",
            1,
            path,
        )
    return source


def patch_dropdown(source: str, path: str, anchor: str) -> str:
    source = replace_exact(
        source,
        anchor,
        anchor.replace("{", "{--sf-dropdown--radius: var(--sf-radius--ui);", 1),
        1,
        path,
    )
    for corner in ("end-end", "end-start", "start-end", "start-start"):
        separator = ": " if f"--sf-dropdown-field--border-{corner}-radius: " in source else ":"
        source = replace_exact(
            source,
            f"--sf-dropdown-field--border-{corner}-radius{separator}var(--sf-radius-1\\/2)",
            f"--sf-dropdown-field--border-{corner}-radius{separator}var(--sf-dropdown--radius)",
            1,
            path,
        )
    return source


def apply(root: Path) -> None:
    variants = {
        "distr/core/css/core.css": lambda value, path: patch_core(value, path),
        "distr/core/css/core.min.css": lambda value, path: patch_core(value, path),
        "distr/component/buttons/css/buttons.css": lambda value, path: patch_component(
            value, path, "button", "  .sf-button {\n    border-end-end-radius"
        ),
        "distr/component/buttons/css/buttons.min.css": lambda value, path: patch_component(
            value, path, "button", ".sf-button{border-end-end-radius"
        ),
        "distr/component/icon-buttons/css/icon-buttons.css": lambda value, path: patch_component(
            value, path, "icon-button", "  .sf-icon-button {\n    border-end-end-radius"
        ),
        "distr/component/icon-buttons/css/icon-buttons.min.css": lambda value, path: patch_component(
            value, path, "icon-button", ".sf-icon-button{border-end-end-radius"
        ),
        "distr/component/inputs/css/inputs.css": lambda value, path: patch_input(
            value, path, "  .sf-input {\n    background-color"
        ),
        "distr/component/inputs/css/inputs.min.css": lambda value, path: patch_input(
            value, path, ".sf-input{background-color"
        ),
        "distr/component/dropdown/css/dropdown.css": lambda value, path: patch_dropdown(
            value, path, "  .sf-dropdown {\n    background-color"
        ),
        "distr/component/dropdown/css/dropdown.min.css": lambda value, path: patch_dropdown(
            value, path, ".sf-dropdown{background-color"
        ),
    }
    for relative, transformer in variants.items():
        path = root / relative
        source = path.read_text(encoding="utf-8-sig")
        data = transformer(source, relative).encode("utf-8")
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
