#!/usr/bin/env python3
"""Plan exact first-paint SIMAI Framework assets from final HTML.

The planner consumes the same ``distr/rule/rule.json`` registry as the dynamic
Loader. Its JSON output is a build receipt, not another registry. Projects
without a build step continue to use the Loader unchanged.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import stat
import sys
from pathlib import Path
from typing import Any


SCHEMA = "simai.framework.asset_plan.v1"
RULE_NAME = re.compile(r"^[A-Za-z][A-Za-z0-9-]*(?:/[A-Za-z0-9-]+)?$")
REQUIRE_TOKEN = re.compile(r"^[a-z][a-z0-9-]*(?:\.[a-z][a-z0-9-]*)?$")
SF_TAG = re.compile(r"<\s*(sf-[a-z][a-z0-9-]*)\b", re.IGNORECASE)
EXPLICIT_REQUIRE = re.compile(
    r"\bdata-sf-require\s*=\s*(?:\"([^\"]*)\"|'([^']*)')", re.IGNORECASE
)
MAX_TEXT_ASSET_BYTES = 4 * 1024 * 1024


class AssetPlanError(ValueError):
    """Raised when the Loader registry or selected runtime is unsafe."""


def canonical_json(value: Any) -> str:
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


def load_rules(path: Path) -> list[dict[str, Any]]:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, UnicodeError, json.JSONDecodeError) as error:
        raise AssetPlanError(f"rule_registry_unreadable:{path}") from error
    if not isinstance(value, list):
        raise AssetPlanError("rule_registry_list_required")
    names: set[str] = set()
    normalized: list[dict[str, Any]] = []
    for order, rule in enumerate(value):
        if not isinstance(rule, dict) or not isinstance(rule.get("name"), str):
            raise AssetPlanError(f"rule_invalid:{order}")
        name = rule["name"]
        if not RULE_NAME.fullmatch(name) or name in names:
            raise AssetPlanError(f"rule_name_invalid:{name}")
        names.add(name)
        item = dict(rule)
        item["_order"] = order
        normalized.append(item)
    return normalized


def compile_loader_regex(value: Any, name: str) -> re.Pattern[str] | None:
    if value is None:
        return None
    if not isinstance(value, str) or len(value) < 2 or value[0] != "/":
        raise AssetPlanError(f"rule_regex_invalid:{name}")
    end = value.rfind("/")
    if end <= 0:
        raise AssetPlanError(f"rule_regex_invalid:{name}")
    pattern, flags_text = value[1:end], value[end + 1 :]
    if any(flag not in "im" for flag in flags_text):
        raise AssetPlanError(f"rule_regex_flags_unsupported:{name}:{flags_text}")
    flags = (re.IGNORECASE if "i" in flags_text else 0) | (
        re.MULTILINE if "m" in flags_text else 0
    )
    try:
        return re.compile(pattern, flags)
    except re.error as error:
        raise AssetPlanError(f"rule_regex_invalid:{name}") from error


def scannable_html(html: str) -> str:
    body = re.search(r"<body\b[^>]*>.*</body\s*>", html, flags=re.IGNORECASE | re.DOTALL)
    scan_html = body.group(0) if body is not None else html
    scan_html = re.sub(
        r"<(pre|code|script|style)\b[^>]*>.*?</\1\s*>", "", scan_html, flags=re.IGNORECASE | re.DOTALL
    )
    return re.sub(
        r"\bsrcdoc\s*=\s*(?:\"[^\"]*\"|'[^']*')", "", scan_html, flags=re.IGNORECASE | re.DOTALL
    )


def selected_rule_names(html: str, rules: list[dict[str, Any]]) -> set[str]:
    scan_html = scannable_html(html)
    tags = {match.lower() for match in SF_TAG.findall(scan_html)}
    selected: set[str] = set()
    by_name = {rule["name"]: rule for rule in rules}
    by_tag: dict[str, str] = {}
    for rule in rules:
        for tag in rule.get("tags", []):
            if not isinstance(tag, str) or not SF_TAG.fullmatch("<" + tag):
                raise AssetPlanError(f"rule_tag_invalid:{rule['name']}")
            if tag in by_tag and by_tag[tag] != rule["name"]:
                raise AssetPlanError(f"rule_tag_conflict:{tag}")
            by_tag[tag] = rule["name"]
        matcher = compile_loader_regex(rule.get("regex"), rule["name"])
        if matcher is not None and matcher.search(scan_html):
            selected.add(rule["name"])
    for tag in tags:
        if tag in by_tag:
            selected.add(by_tag[tag])
    for match in EXPLICIT_REQUIRE.finditer(scan_html):
        raw = match.group(1) if match.group(1) is not None else match.group(2)
        for token in re.split(r"[\s,]+", raw.strip()):
            if not token:
                continue
            if not REQUIRE_TOKEN.fullmatch(token):
                raise AssetPlanError(f"explicit_requirement_invalid:{token}")
            candidate = token
            if token.startswith("smart."):
                candidate = "cl-" + token.removeprefix("smart.")
            elif token.startswith("component."):
                candidate = token.removeprefix("component.")
            elif token.startswith("utility."):
                family = token.removeprefix("utility.")
                matches = [name for name in by_name if name.startswith(family + "/")]
                if not matches:
                    raise AssetPlanError(f"explicit_requirement_unknown:{token}")
                selected.update(matches)
                continue
            if candidate not in by_name:
                raise AssetPlanError(f"explicit_requirement_unknown:{token}")
            selected.add(candidate)
    return selected


def dependency_order(selected: set[str], rules: list[dict[str, Any]]) -> list[str]:
    by_name = {rule["name"]: rule for rule in rules}
    ordered: list[str] = []
    visiting: set[str] = set()
    visited: set[str] = set()

    def visit(name: str) -> None:
        if name in visited:
            return
        if name in visiting:
            raise AssetPlanError(f"dependency_cycle:{name}")
        rule = by_name.get(name)
        if rule is None:
            raise AssetPlanError(f"dependency_unknown:{name}")
        visiting.add(name)
        relations = rule.get("relation", [])
        if not isinstance(relations, list):
            raise AssetPlanError(f"dependency_list_invalid:{name}")
        for relation in relations:
            dependency = relation.get("name") if isinstance(relation, dict) else None
            if not isinstance(dependency, str):
                raise AssetPlanError(f"dependency_invalid:{name}")
            visit(dependency)
        visiting.remove(name)
        visited.add(name)
        ordered.append(name)

    for name in sorted(selected, key=lambda item: by_name[item]["_order"]):
        visit(name)
    return ordered


def with_relation_rules(rules: list[dict[str, Any]]) -> list[dict[str, Any]]:
    expanded = [dict(rule) for rule in rules]
    names = {rule["name"] for rule in expanded}
    for owner in list(expanded):
        for relation in owner.get("relation", []):
            name = relation.get("name") if isinstance(relation, dict) else None
            if not isinstance(name, str) or name in names:
                continue
            mode = relation.get("mode")
            css = relation.get("css", False)
            javascript = relation.get("js", False)
            if mode not in {"utility", "component"} or not isinstance(css, bool) or not isinstance(javascript, bool) or not (css or javascript):
                raise AssetPlanError(f"dependency_unknown:{name}")
            expanded.append(
                {
                    "name": name,
                    "type": mode,
                    "css": css,
                    "js": javascript,
                    "relation": [],
                    "_synthetic_relation": True,
                }
            )
            names.add(name)
    return expanded


def safe_text_asset(root: Path, relative: Path) -> dict[str, Any]:
    if relative.is_absolute() or ".." in relative.parts or any(not part for part in relative.parts):
        raise AssetPlanError(f"asset_path_invalid:{relative.as_posix()}")
    root = root.resolve()
    path = root / relative
    try:
        info = path.lstat()
    except OSError as error:
        raise AssetPlanError(f"asset_missing:{relative.as_posix()}") from error
    if stat.S_ISLNK(info.st_mode):
        raise AssetPlanError(f"asset_symlink_forbidden:{relative.as_posix()}")
    if not stat.S_ISREG(info.st_mode):
        raise AssetPlanError(f"asset_file_required:{relative.as_posix()}")
    if info.st_nlink != 1:
        raise AssetPlanError(f"asset_hardlink_forbidden:{relative.as_posix()}")
    resolved = path.resolve()
    try:
        resolved.relative_to(root)
    except ValueError as error:
        raise AssetPlanError(f"asset_traversal:{relative.as_posix()}") from error
    if info.st_size > MAX_TEXT_ASSET_BYTES:
        raise AssetPlanError(f"asset_too_large:{relative.as_posix()}")
    data = path.read_bytes()
    try:
        data.decode("utf-8")
    except UnicodeError as error:
        raise AssetPlanError(f"asset_utf8_required:{relative.as_posix()}") from error
    return {
        "path": relative.as_posix(),
        "sha256": hashlib.sha256(data).hexdigest(),
        "bytes": len(data),
    }


def conventional_asset_paths(rule: dict[str, Any]) -> list[tuple[str, Path]]:
    name = rule["name"]
    kind = rule.get("type", "utility")
    if kind == "utility":
        leaf = name.rsplit("/", 1)[-1]
        return [("css", Path("distr/utility") / name / "css" / f"{leaf}.css")]
    if kind in {"component", "attribute"}:
        assets: list[tuple[str, Path]] = []
        if rule.get("css") is True:
            assets.append(("css", Path("distr/component") / name / "css" / f"{name}.css"))
        if rule.get("js") is True:
            assets.append(("javascript", Path("distr/component") / name / "js" / f"{name}.js"))
        return assets
    if kind == "smart":
        slug = name.removeprefix("cl-")
        assets = []
        if rule.get("css") is True:
            assets.append(("css", Path("smart") / slug / "css" / f"{slug}.css"))
        if rule.get("js") is True:
            assets.append(("smart_javascript", Path("smart") / slug / "js" / f"{slug}.js"))
        return assets
    raise AssetPlanError(f"rule_type_unsupported:{name}:{kind}")


def build_plan(html: str, ui_root: Path, smart_root: Path | None = None) -> dict[str, Any]:
    rules_path = ui_root / "distr/rule/rule.json"
    rules = with_relation_rules(load_rules(rules_path))
    scan_html = scannable_html(html)
    selected = selected_rule_names(scan_html, rules)
    ordered = dependency_order(selected, rules)
    by_name = {rule["name"]: rule for rule in rules}
    assets: list[dict[str, Any]] = []
    diagnostics: list[dict[str, str]] = []
    dynamic_fallback: set[str] = set()
    lower_paths: dict[str, str] = {}
    for name in ordered:
        for kind, relative in conventional_asset_paths(by_name[name]):
            root = smart_root if relative.parts[0] == "smart" else ui_root
            if root is None:
                raise AssetPlanError(f"smart_root_required:{name}")
            try:
                record = safe_text_asset(root, relative)
            except FileNotFoundError:
                if by_name[name].get("_synthetic_relation") is not True:
                    raise
                dynamic_fallback.add(name)
                diagnostics.append(
                    {
                        "code": "relation_dynamic_fallback",
                        "module": name,
                        "detail": relative.as_posix(),
                    }
                )
                continue
            lowered = record["path"].lower()
            previous = lower_paths.get(lowered)
            if previous is not None and previous != record["path"]:
                raise AssetPlanError(f"asset_case_conflict:{previous}:{record['path']}")
            lower_paths[lowered] = record["path"]
            assets.append({"module": name, "kind": kind, "root": "smart" if root == smart_root else "ui", **record})
    ready_modules: list[str] = []
    for name in ordered:
        dependencies = [
            relation["name"]
            for relation in by_name[name].get("relation", [])
            if isinstance(relation, dict) and isinstance(relation.get("name"), str)
        ]
        if name in dynamic_fallback or any(dependency not in ready_modules for dependency in dependencies):
            dynamic_fallback.add(name)
            continue
        ready_modules.append(name)
    result = {
        "schema": SCHEMA,
        "mode": "production_exact",
        "rule_registry": {
            "path": "distr/rule/rule.json",
            "sha256": hashlib.sha256(rules_path.read_bytes()).hexdigest(),
        },
        "html_sha256": hashlib.sha256(scan_html.encode("utf-8")).hexdigest(),
        "modules": ready_modules,
        "assets": assets,
        "diagnostics": diagnostics,
        "loader_handoff": {
            "modules": ready_modules,
            "loadedPlugins": {
                name: {
                    "css": any(asset["module"] == name and asset["kind"] == "css" for asset in assets),
                    "js": any(asset["module"] == name and asset["kind"] in {"javascript", "smart_javascript"} for asset in assets),
                    "ready": True,
                }
                for name in ready_modules
            },
        },
    }
    result["plan_sha256"] = hashlib.sha256(canonical_json(result).encode("utf-8")).hexdigest()
    return result


def parse_args(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--html", type=Path, required=True)
    parser.add_argument("--ui-root", type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument("--smart-root", type=Path)
    parser.add_argument("--output", type=Path)
    parser.add_argument("--stdout", action="store_true")
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv or sys.argv[1:])
    try:
        html = args.html.read_text(encoding="utf-8")
    except (OSError, UnicodeError) as error:
        raise AssetPlanError(f"html_unreadable:{args.html}") from error
    plan = build_plan(html, args.ui_root, args.smart_root)
    rendered = json.dumps(plan, ensure_ascii=False, sort_keys=True, indent=2) + "\n"
    if args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(rendered, encoding="utf-8")
    if args.stdout or not args.output:
        sys.stdout.write(rendered)
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except AssetPlanError as error:
        print(str(error), file=sys.stderr)
        raise SystemExit(1)
