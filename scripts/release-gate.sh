#!/usr/bin/env bash
# Usage: bash scripts/release-gate.sh
#
# Everything this repository checks before a release is published, in one command
# that exits non-zero when anything is wrong.
#
# It exists because the registry suite was not in the route at all. The route
# lived in whoever was releasing: build the registry, --check it, validate it,
# push. `tests/framework-registry` was never run, so it was red for the whole
# of pair 7cf08381 and eight pairs went out past it — the expectations said 47
# Smart components and 337 entries while the registry held 49 and 339, because
# sf-color and sf-popover had entered and nothing compared the two. A peer
# session found it by reading the suite, not by running the route (2026-10-11).
#
# The other half of the same lesson: every step here prints its own exit code
# and the script stops on the first failure. A step read through `| tail` is a
# step whose failure is invisible, which is how a registry that exited 1 was
# once reported as «check and validation clean».
set -uo pipefail

cd "$(dirname "$0")/.."

# The Smart owner manifest: the one ui owns once Smart is published into
# distr/smart (lock v2), else the one ui-smart keeps beside this checkout.
if [ -z "${SIMAI_UI_SMART_MANIFEST:-}" ]; then
    if [ -f contracts/owners/smart-component.manifest.json ]; then
        SIMAI_UI_SMART_MANIFEST=contracts/owners/smart-component.manifest.json
    else
        SIMAI_UI_SMART_MANIFEST=../ui-smart/contracts/owners/smart-component.manifest.json
    fi
fi
export SIMAI_UI_SMART_MANIFEST
# The ui-smart checkout, for the mirror check while ui-smart is mirrored.
: "${SIMAI_UI_SMART_ROOT:=../ui-smart}"
export SIMAI_UI_SMART_ROOT

if [ ! -f "$SIMAI_UI_SMART_MANIFEST" ]; then
    printf 'the Smart owner manifest is not at %s\n' "$SIMAI_UI_SMART_MANIFEST" >&2
    printf 'set SIMAI_UI_SMART_MANIFEST to where it is kept\n' >&2
    exit 2
fi

failed=0

step() {
    local name="$1"; shift
    printf '%-34s ' "$name"
    if output="$("$@" 2>&1)"; then
        printf 'ok\n'
    else
        printf 'FAILED\n'
        printf '%s\n' "$output" | tail -20
        failed=1
    fi
}

step 'registry builds'            python3 scripts/build-framework-registry.py
step 'registry is the committed one' python3 scripts/build-framework-registry.py --check
step 'registry validates'         python3 scripts/validate-framework-registry.py
step 'registry suite'             python3 -m unittest discover -s tests/framework-registry
# Every lock validates by its version; from v2 on each names the build commit
# that wrote each tree, and the ui-smart mirror carries the same bytes.
step 'release locks'              python3 scripts/check-release-locks.py
# `validate-framework-consumers.py` is deliberately not here. It answers a
# different question -- whether ui-play, ui-doc, the AI skill and Larena have
# caught up with a pair -- and it needs an aggregate of their pointers that a
# publish does not have. A step that cannot run is a step that gets commented
# out, and then the ones beside it stop being read.

if [ "$failed" -ne 0 ]; then
    printf '\nRELEASE_GATE_FAILED — do not publish\n' >&2
    exit 1
fi

printf '\nrelease gate clean\n'
