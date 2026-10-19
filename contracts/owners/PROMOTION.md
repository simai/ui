# Readiness promotion

`safe_to_suggest` tells an authoring tool (the VS Code extension, a recipe
editor) that it may offer an entry to an author. The owner manifests in this
folder hold that decision; the registry builder never changes it.

An entry is suggested when either holds:

1. it is in the curated plan of `recipe.admin.collection`; or
2. it is promoted by this rule and listed in `promotion.json`.

## The rule (owner, 2026-10-19)

An entry is promoted to `status: ready`, `safe_to_suggest: true`, no blockers,
when all of these hold at the revisions recorded in `promotion.json`:

- **Documented.** A public page in simai/ui-doc documents it and uses it in an
  example: the tag for a Smart component, the rule's own detection pattern for
  a component, a class of the family for a utility.
- **Exercised.** A contract test or browser probe in simai/ui-source, or the
  ui-admin polygon, uses it.
- **No open defect.** No open simai/ui-source issue names it.
- **Stable.** It is not deprecated, and a Smart component declares its inputs
  in its source `smart.manifest.json`.

Promotion changes readiness only; lifecycle stays as the source declares it.
An entry that fails a condition stays `discoverable`; `promotion.json` names
the held ones and why. To demote, remove the entry from `promotion.json` and set
its readiness back to the manifest default in the same commit.
