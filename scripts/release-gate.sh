#!/usr/bin/env bash
# Usage: bash scripts/release-gate.sh
#
# Everything this repository checks before a pair is published, in one command
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

: "${SIMAI_UI_SMART_MANIFEST:=../ui-smart/contracts/owners/smart-component.manifest.json}"
export SIMAI_UI_SMART_MANIFEST

if [ ! -f "$SIMAI_UI_SMART_MANIFEST" ]; then
    printf 'the Smart owner manifest is not at %s\n' "$SIMAI_UI_SMART_MANIFEST" >&2
    printf 'set SIMAI_UI_SMART_MANIFEST to where ui-smart keeps it\n' >&2
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
