/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "3f3a6e2680d5"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   freezeModalContent: () => (/* binding */ freezeModalContent)
/* harmony export */ });
// Keep the closing dialog itself meaningful while its visible content becomes
// non-interactive. Restore only temporary inert attributes owned by this lease.
function freezeModalContent(panel, focusPanel = false) {
  if (!panel) return () => {};
  const owned = new Set();

  const freeze = () => {
    for (const child of panel.children) {
      if (!child.hasAttribute('inert')) {
        child.setAttribute('inert', '');
        owned.add(child);
      }
    }
  };

  if (focusPanel) panel.focus({
    preventScroll: true
  });
  freeze();
  const observer = new panel.ownerDocument.defaultView.MutationObserver(freeze);
  observer.observe(panel, {
    childList: true
  });
  return () => {
    observer.disconnect();

    for (const child of owned) {
      if (child.getAttribute('inert') === '') child.removeAttribute('inert');
    }

    owned.clear();
  };
}



/***/ },

/***/ "c8d66dd2c299"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   INITIAL_FOCUS: () => (/* binding */ INITIAL_FOCUS),
/* harmony export */   focusModalInitial: () => (/* binding */ focusModalInitial),
/* harmony export */   getModalTabStops: () => (/* binding */ getModalTabStops),
/* harmony export */   holdFieldsReadOnly: () => (/* binding */ holdFieldsReadOnly),
/* harmony export */   isFieldElement: () => (/* binding */ isFieldElement),
/* harmony export */   isOneLineField: () => (/* binding */ isOneLineField),
/* harmony export */   syncModalFocusGuards: () => (/* binding */ syncModalFocusGuards),
/* harmony export */   trapModalFocus: () => (/* binding */ trapModalFocus),
/* harmony export */   windowFields: () => (/* binding */ windowFields)
/* harmony export */ });
// The fields of a window (owner decision C159, 2026-11-14): a window that
// holds fields is one form -- a press on its scrim never closes it (6), it
// asks before its changes go (6), its main answer submits it and Enter in a
// one-line field presses that answer (9), its first field takes the focus
// (9), and on a phone a form of more than three fields takes the whole
// screen (2). Shared by sf-modal and the class modal, and by sf-drawer. They live here,
// beside the first focus that reads them, so the focus module stays one file
// with no imports (the unit tests load it as one module).
//
// A field is a native control a person types or picks in, or a Framework
// field element (sf-input*, sf-dropdown, sf-checkbox, sf-switch, sf-radio)
// whether it has drawn its control yet or not; a field element counts once,
// whatever it draws inside.
const NATIVE_FIELD = ['input:not([type="hidden"], [type="button"], [type="submit"], [type="reset"], [type="image"])', 'select', 'textarea', '[contenteditable=""]', '[contenteditable="true"]'].join(', ');
const FIELD_ELEMENTS = new Set(['sf-dropdown', 'sf-checkbox', 'sf-switch', 'sf-radio', 'sf-segmented']);

const isFieldElement = node => node.localName?.startsWith('sf-input') || FIELD_ELEMENTS.has(node.localName); // One-line fields: Enter in them presses the main answer (9).


const ONE_LINE = new Set(['', 'text', 'search', 'email', 'tel', 'url', 'password', 'number', 'date', 'datetime-local', 'month', 'time', 'week']); // The outermost field element a node stands in, under `root`.

function fieldElementOf(node, root) {
  let host = null;

  for (let at = node; at && at !== root; at = at.parentElement) {
    if (isFieldElement(at)) host = at;
  }

  return host;
} // The window's fields in document order, each once.


function windowFields(root) {
  if (!root?.querySelectorAll) return [];
  const units = [];
  const seen = new Set();

  for (const node of root.querySelectorAll('*')) {
    if (!isFieldElement(node) && !node.matches(NATIVE_FIELD)) continue;
    if (node.closest('[hidden]')) continue;
    const unit = fieldElementOf(node, root) || node;
    if (seen.has(unit)) continue;
    seen.add(unit);
    units.push(unit);
  }

  return units;
}

function isOneLineField(node) {
  return node?.localName === 'input' && ONE_LINE.has((node.getAttribute('type') || '').toLowerCase());
} // Makes the fields read-only while the window saves (9) and answers the undo:
// only what it changed goes back.


function holdFieldsReadOnly(fields) {
  const changed = [];

  for (const unit of fields) {
    if (unit.localName?.startsWith('sf-')) {
      if (!unit.hasAttribute('readonly')) {
        unit.setAttribute('readonly', '');
        changed.push(() => unit.removeAttribute('readonly'));
      }

      continue;
    }

    if ('readOnly' in unit && !unit.readOnly && unit.localName !== 'select') {
      unit.readOnly = true;
      changed.push(() => {
        unit.readOnly = false;
      });
    } else if (unit.localName === 'select' && !unit.hasAttribute('aria-readonly')) {
      unit.setAttribute('aria-readonly', 'true');
      unit.inert = true;
      changed.push(() => {
        unit.removeAttribute('aria-readonly');
        unit.inert = false;
      });
    }
  }

  return () => changed.forEach(undo => undo());
}

const FOCUSABLE_SELECTOR = ['a[href]', 'area[href]', 'button', 'input', 'select', 'textarea', 'iframe', 'summary', 'audio[controls]', 'video[controls]', '[contenteditable]', '[tabindex]'].join(',');
const GUARDS_KEY = Symbol.for('simai.modal.focus-guards');

function syncModalFocusGuards(modal) {
  const root = (modal && 'modalRoot' in modal ? modal.modalRoot : modal?.getModalRoot?.()) || modal?.template;
  const panel = root?.querySelector?.('[data-sf-modal-panel]');
  const previous = document[GUARDS_KEY];
  if (previous && previous.panel === panel && previous.before.isConnected && previous.after.isConnected) return;
  previous?.before.remove();
  previous?.after.remove();
  delete document[GUARDS_KEY];
  if (!panel?.parentNode) return;
  const guards = {
    panel,
    relaying: false
  };

  for (const edge of ['before', 'after']) {
    const guard = panel.ownerDocument.createElement('span');
    guard.tabIndex = 0;
    guard.className = 'sf-modal-focus-guard';
    guard.setAttribute('aria-hidden', 'true');
    guard.addEventListener('focus', () => {
      if (guards.relaying || !panel.isConnected || root.inert || root.getAttribute('aria-hidden') === 'true') return;
      const backward = edge === 'before';
      const stops = getModalTabStops(panel, backward);
      const destination = backward ? stops.at(-1) : stops[0]; // A frame's child document owns the outgoing key event. If both edges are
      // frames, return to the meaningful dialog boundary; the next native Tab
      // enters the requested end of the document without inspecting its origin.

      if (!destination || destination.tagName === 'IFRAME') panel.focus({
        preventScroll: true
      });else destination.focus({
        preventScroll: true
      });
    });
    guards[edge] = guard;
  }

  panel.before(guards.before);
  panel.after(guards.after);
  document[GUARDS_KEY] = guards;
}

function sameRadioGroup(a, b) {
  return a?.tagName === 'INPUT' && b?.tagName === 'INPUT' && a.type === 'radio' && b.type === 'radio' && !!a.name && a.name === b.name && a.form === b.form && a.getRootNode() === b.getRootNode();
} // Shared by ordinary and Smart Modal. Read the current DOM on each Tab so
// hidden, inert or disabled controls never become stale focus boundaries.


function getModalTabStops(panel, backward = false) {
  const view = panel.ownerDocument.defaultView;
  const candidates = Array.from(panel.querySelectorAll(FOCUSABLE_SELECTOR)).filter(node => node.tabIndex >= 0 && !node.matches(':disabled') && !node.closest('[inert]') && node.getClientRects().length > 0 && view.getComputedStyle(node).visibility === 'visible').sort((a, b) => (a.tabIndex || Infinity) - (b.tabIndex || Infinity)); // Native radio groups contribute one sequential stop, not every input.
  // Do not rewrite checked/tabindex or intercept their native arrow-key handling.

  return candidates.filter(node => {
    if (!sameRadioGroup(node, node)) return true;
    const group = candidates.filter(candidate => sameRadioGroup(node, candidate));
    const selected = group.find(candidate => candidate.checked);
    return node === (selected || group.at(backward ? -1 : 0));
  });
}

function trapModalFocus(panel, event) {
  if (!panel) return;
  const nodes = getModalTabStops(panel, event.shiftKey);
  const active = panel.ownerDocument.activeElement;

  if (!nodes.length) {
    event.preventDefault();
    panel.focus();
    return;
  }

  const first = nodes[0];
  const last = nodes[nodes.length - 1];
  const boundary = event.shiftKey ? first : last;

  if (!panel.contains(active) || active === panel || active === boundary || sameRadioGroup(active, boundary)) {
    const destination = event.shiftKey ? last : first;
    const guards = panel.ownerDocument[GUARDS_KEY];

    if (destination.tagName === 'IFRAME' && guards?.panel === panel) {
      // Let the trusted browser Tab action traverse the iframe itself. Calling
      // iframe.focus() cannot choose its last child in an opaque document.
      guards.relaying = true;

      try {
        (event.shiftKey ? guards.after : guards.before).focus({
          preventScroll: true
        });
      } finally {
        guards.relaying = false;
      }

      return;
    }

    event.preventDefault();
    destination.focus();
  }
} // The first focus of an opened window (decisions C25, C39), by name
// (sf-modal initial-focus):
//
// - auto (the default): the element the page marked with the standard
//   `autofocus` attribute, as a native <dialog> does; else, in a question
//   window -- one whose answers hold a dangerous one (an sf-button with
//   status="danger", its drawn .sf-button--danger, or an sf-confirm) -- its
//   safe answer, «Отмена»; else, in a window with fields, its first field
//   (owner decision C159 (9), 2026-11-14, as WAI-ARIA's dialog pattern
//   advises); else the panel, as before. Only answers count: a red
//   sf-badge or an error message in the body does not make a window a question;
// - safe: the safe answer whenever there is one;
// - first: the first control of the window's content (the header's buttons,
//   the × among them, excluded);
// - panel: the panel itself.
//
// The safe answer is the declining answer of an sf-confirm in the window
// ([data-action="decline"]) or the page's own answer that closes the window
// ([data-sf-modal-close], the header's × excluded): a stray Enter or Space then
// only closes the question. An element that is not focusable itself
// (sf-button, whose host is display: contents) hands the focus to its first
// tab stop. Content drawn after the window opened -- an sf-button draws its
// <button> on its own schedule, an sf-confirm its answers, either perhaps
// while its script is still loading -- is waited for, frame by frame for up
// to two seconds, while the focus is still on the panel; anything the person
// does in between wins. Answers the element that took the focus.


const INITIAL_FOCUS = ['auto', 'safe', 'first', 'panel']; // status="error" on an sf-button is danger's dated alias (C13).

const DANGER_SELECTOR = 'sf-button[status="danger"], sf-button[status="error"], .sf-button--danger, sf-confirm'; // The header's × is excluded: its button (.sf-modal-close-button) and, since
// sf-modal draws it as sf-button-close (C14), that element (.sf-modal-close).

const SAFE_SELECTOR = '[data-action="decline"], [data-sf-modal-close]:not(.sf-modal-close-button):not(.sf-modal-close)';

function takesFocus(node) {
  if (!node || node.closest('[inert]') || node.closest('[hidden]')) return null;
  if (node.matches(FOCUSABLE_SELECTOR) && node.tabIndex >= 0 && !node.matches(':disabled')) return node;
  return getModalTabStops(node)[0] || null;
}

function isDanger(node) {
  return node.matches('sf-button[status="danger"], sf-button[status="error"], .sf-button--danger') || Boolean(node.querySelector('.sf-button--danger'));
} // The element that takes the safe answer's focus, or null while there is none
// (or it is not drawn yet).


function safeAnswer(panel) {
  for (const host of panel.querySelectorAll(SAFE_SELECTOR)) {
    if (host.closest('[inert], [hidden]') || isDanger(host)) continue;
    const target = takesFocus(host);
    if (target) return target;
  }

  return null;
}

function firstFocus(panel, mode) {
  if (mode === 'panel') return panel;
  if (mode === 'first') return getModalTabStops(panel).find(node => !node.closest('.sf-modal-header-action')) || panel;

  if (mode === 'auto') {
    const marked = panel.querySelector('[autofocus]');
    if (marked && !marked.closest('[inert], [hidden]')) return takesFocus(marked) || panel;

    if (!panel.querySelector(DANGER_SELECTOR)) {
      const body = panel.querySelector('[data-sf-modal-body-scroll]') || panel;
      const field = windowFields(body)[0];
      return field && takesFocus(field) || panel;
    }
  }

  return safeAnswer(panel) || panel;
}

const WAIT_FOR_CONTENT_MS = 2000;

function focusModalInitial(panel, mode = 'auto') {
  if (!panel) return null;
  const name = INITIAL_FOCUS.includes(mode) ? mode : 'auto';
  const target = firstFocus(panel, name);
  target.focus({
    preventScroll: true
  });
  const doc = panel.ownerDocument;
  if (doc.activeElement !== target && target !== panel) panel.focus({
    preventScroll: true
  });

  if (target === panel && name !== 'panel') {
    const view = doc.defaultView;
    const until = (view?.performance?.now() ?? 0) + WAIT_FOR_CONTENT_MS;

    const retry = () => {
      if (doc.activeElement !== panel || !panel.isConnected) return;
      const late = firstFocus(panel, name);
      if (late !== panel) late.focus({
        preventScroll: true
      });else if (view.performance.now() < until) view.requestAnimationFrame(retry);
    };

    view?.requestAnimationFrame(retry);
  }

  return doc.activeElement === target ? target : panel;
}



/***/ },

/***/ "201fd0b17b8b"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   modalTransitionDuration: () => (/* binding */ modalTransitionDuration),
/* harmony export */   scheduleModalClose: () => (/* binding */ scheduleModalClose),
/* harmony export */   scheduleModalFrame: () => (/* binding */ scheduleModalFrame)
/* harmony export */ });
const timeInMs = value => {
  const number = Number.parseFloat(value);
  return Number.isFinite(number) ? number * (value.trim().endsWith('ms') ? 1 : 1000) : 0;
}; // Hidden/offscreen documents may throttle requestAnimationFrame indefinitely.
// Modal state changes must still complete, so the first scheduled channel wins.


function scheduleModalFrame(callback, view = window) {
  let complete = false;
  let frame = null;
  let timer = null;

  const run = () => {
    if (complete) return;
    complete = true;

    if (frame !== null) {
      view.cancelAnimationFrame(frame);
      frame = null;
    }

    if (timer !== null) {
      view.clearTimeout(timer);
      timer = null;
    }

    callback();
  };

  frame = view.requestAnimationFrame(run);
  timer = view.setTimeout(run, 50);
  if (typeof view.queueMicrotask === 'function') view.queueMicrotask(run);
  return () => {
    complete = true;
    if (frame !== null) view.cancelAnimationFrame(frame);
    if (timer !== null) view.clearTimeout(timer);
  };
} // CSS lists repeat to match transition-property, not the longest input list.

function modalTransitionDuration(style) {
  const properties = style.transitionProperty.split(',').map(value => value.trim());
  const durations = style.transitionDuration.split(',').map(timeInMs);
  const delays = style.transitionDelay.split(',').map(timeInMs);
  return Math.max(0, ...properties.map((property, index) => {
    if (!['all', 'opacity', 'transform', '-webkit-transform'].includes(property)) return 0;
    return Math.max(0, durations[index % durations.length]) + delays[index % delays.length];
  }));
} // Measure after the Smart projection has applied the closing state. A bounded
// timer also completes when no transitionend fires (unchanged or hidden panel).
// Never finish on the first property/descendant transitionend.
// The closing state's own transition is the one to wait for (a window closes
// faster than it opens, decision C159 (8)): while the drawn root does not show
// the closing state yet -- the Smart window projects it a little later -- the
// measure waits a frame, a few at most.

const STATE_FRAMES = 4;
function scheduleModalClose(getRoot, finalize, view = window) {
  let timer = null,
      cancelled = false,
      frames = 0,
      cancelFrame = () => {};

  const measure = () => {
    if (cancelled) return;
    const root = getRoot();
    const state = root?.getAttribute?.('data-sf-modal-state');

    if (state && state !== 'closing' && frames++ < STATE_FRAMES) {
      // A frame or 50 ms, whichever comes first -- not a microtask, which runs
      // before the projection does.
      let done = false;

      const next = () => {
        if (done) return;
        done = true;
        view.cancelAnimationFrame(frame);
        view.clearTimeout(fallback);
        measure();
      };

      const frame = view.requestAnimationFrame(next);
      const fallback = view.setTimeout(next, 50);

      cancelFrame = () => {
        done = true;
        view.cancelAnimationFrame(frame);
        view.clearTimeout(fallback);
      };

      return;
    }

    const nodes = root?.querySelectorAll('[data-sf-modal-panel], [data-sf-modal-overlay]') || [];
    const duration = Math.max(0, ...Array.from(nodes, node => {
      const style = view.getComputedStyle(node);
      return style.display === 'none' ? 0 : modalTransitionDuration(style);
    }));
    timer = view.setTimeout(() => {
      if (!cancelled) finalize();
    }, duration);
  };

  cancelFrame = scheduleModalFrame(measure, view);
  return () => {
    cancelled = true;
    cancelFrame();
    if (timer !== null) view.clearTimeout(timer);
  };
}

/***/ },

/***/ "93025a68d8ab"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addModalLayer: () => (/* binding */ addModalLayer),
/* harmony export */   captureModalFocusAncestors: () => (/* binding */ captureModalFocusAncestors),
/* harmony export */   getModalLayerIndex: () => (/* binding */ getModalLayerIndex),
/* harmony export */   getTopModalLayer: () => (/* binding */ getTopModalLayer),
/* harmony export */   isTopModalLayer: () => (/* binding */ isTopModalLayer),
/* harmony export */   raiseModalLayer: () => (/* binding */ raiseModalLayer),
/* harmony export */   removeModalLayer: () => (/* binding */ removeModalLayer),
/* harmony export */   restoreModalLayerFocus: () => (/* binding */ restoreModalLayerFocus),
/* harmony export */   updateModalLayers: () => (/* binding */ updateModalLayers)
/* harmony export */ });
/* harmony import */ var _focus__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("c8d66dd2c299");
/* harmony import */ var _core_js_layer_stack__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("18003344cff0");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_1__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_1__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var _core_js_layer_stack__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_1__);
// Ordinary and Smart Modal are separate bundles. They share the one document
// layer stack of the core (layer-stack.js, standard 1.3.8 §19), with every
// other layer -- a drawer, a popover, a list -- not a list of their own: a
// modal opened from a drawer is above it, takes Escape and Tab while it is,
// and gives focus back into the drawer when it closes (simai/ui-source#36,
// #37). Registries, public instance APIs and rendering stay separate.
//
// The bundle carries the whole of core/js/layer-stack.js, so its bytes move
// with that module even where this one does not: component.modal 1.3.1 is the
// C79 change of densityOf there (an explicit size follows its region). The
// class modal does not call carryLayerOrigin, so nothing it draws or does
// changes; sf-modal's portal is the one that takes the region's density.

 // sf-modal's window is its modalRoot (its reader getModalRoot retires, standard
// 1.3.8 §16.13); the class Modal holds its markup in `template`.

const modalRoot = modal => (modal && 'modalRoot' in modal ? modal.modalRoot : modal?.getModalRoot?.()) || modal?.template || null; // The highest modal open: what Modal.getTopModal() names. A drawer or a list
// may stand above it; isTopLayer answers whether it is the top of everything.


function getTopModalLayer() {
  return (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_1__.openLayers)('modal').at(-1) || null;
}

function getModalLayerIndex(modal) {
  return (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_1__.layerIndex)(modal);
} // Focus guards stand around the panel of a modal only while it is the top
// layer; under a drawer or a list they would be tab stops of a layer below.


function syncGuards() {
  const top = (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_1__.topLayer)();
  (0,_focus__WEBPACK_IMPORTED_MODULE_0__.syncModalFocusGuards)(top?.kind === 'modal' ? top.owner : null);
}

function updateModalLayers() {
  for (const owner of (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_1__.openLayers)('modal')) owner.applyStackPosition((0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_1__.layerIndex)(owner));

  syncGuards();
} // A modal inside an overlay container covers that box, not the page, so the
// page stays scrollable while it is open.


const locksPage = modal => !modal.inContainer; // The page lock is the stack's default one (lockPageScroll), which is the
// lock this file's _scroll.js held before: the class, the page's own padding
// plus the gap, and only what it set given back.


function addModalLayer(modal) {
  if ((0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_1__.hasLayer)(modal)) return;
  (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_1__.openLayer)(modal, {
    kind: 'modal',
    locksPage: locksPage(modal),
    preserveScrollGap: modal.preserveScrollGap !== false,
    trapsFocus: true,
    returnTo: modal._lastActive ?? modal.lastActive ?? null,
    root: () => modalRoot(modal),
    focusIn: () => modal.focusFirst?.(),
    onEscape: event => Boolean(modal.onKeyDown?.(event)),
    onTab: event => modal.onKeyDown?.(event),
    // Called on every change of the stack, a drawer's or a list's too.
    place: ({
      index
    }) => {
      modal.applyStackPosition(index);
      syncGuards();
    }
  });
  syncGuards();
}

function removeModalLayer(modal) {
  if (!(0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_1__.hasLayer)(modal)) return; // The modal gives focus back itself, after its closing transition.

  (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_1__.closeLayer)(modal, {
    restoreFocus: false
  });
  modal.applyStackPosition?.(-1);
  syncGuards();
}

function raiseModalLayer(modal) {
  (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_1__.raiseLayer)(modal);
  syncGuards();
}

function captureModalFocusAncestors(node) {
  return (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_1__.landmarksAround)(node);
}

function restoreModalLayerFocus(wasTop, lastActive, ancestors = []) {
  (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_1__.returnLayerFocus)(wasTop, lastActive, ancestors);
}

function isTopModalLayer(modal) {
  return (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_1__.isTopLayer)(modal);
}


__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "1373e294ec38"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BREAKPOINTS: () => (/* binding */ BREAKPOINTS),
/* harmony export */   breakpointMedia: () => (/* binding */ breakpointMedia),
/* harmony export */   breakpointQuery: () => (/* binding */ breakpointQuery),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   matchesBreakpoint: () => (/* binding */ matchesBreakpoint)
/* harmony export */ });
// The Framework's breakpoints for scripts (reuse audit 2026-11-02, finding 6).
// The sheets switch at the steps of core/scss/vars/_sf_var__breakpoint.scss;
// a component that also decides in script (sf-contents, sf-site-header,
// sf-search) had copied the steps by hand, word for word, and nine such
// constants (48rem, 60rem, 1023px, 1024) had drifted apart elsewhere, so one
// admin screen switched at two points. The same values here, and
// tests/breakpoint-ladder.contract.test.mjs holds the two files equal.

/** The ladder: each name is the width it starts at, in rem as the sheets write it. */
const BREAKPOINTS = Object.freeze({
  xs: '0rem',
  sm: '32rem',
  // g6, 512px
  md: '44rem',
  // h1, 704px
  lg: '60rem',
  // h5, 960px
  xl: '72rem',
  // h8, 1152px
  xxl: '80rem' // i0, 1280px

}); // The step under a threshold, as the sheets' media-breakpoint-down writes it:
// one pixel less, in rem (_mix__breakpoint.scss breakpoint-max).

const PIXEL_REM = 1 / 16;
/**
 * The media query of a breakpoint: from its width up, or with `below: true`
 * the widths under it -- the two sides the sheets switch on. An unknown name
 * is null, so a typo is not a query that always matches.
 *
 *   breakpointQuery('md')                  (min-width: 44rem)
 *   breakpointQuery('md', {below: true})   (max-width: 43.9375rem)
 */

function breakpointQuery(name, {
  below = false
} = {}) {
  if (!Object.hasOwn(BREAKPOINTS, name)) return null;
  const rem = Number.parseFloat(BREAKPOINTS[name]);
  if (below) return rem > 0 ? `(max-width: ${rem - PIXEL_REM}rem)` : 'not all';
  return `(min-width: ${rem}rem)`;
}
/** The page's MediaQueryList for a breakpoint, to read and to follow; null without matchMedia or for an unknown name. */

function breakpointMedia(name, {
  below = false,
  view = globalThis
} = {}) {
  const query = breakpointQuery(name, {
    below
  });
  return query && typeof view?.matchMedia === 'function' ? view.matchMedia(query) : null;
}
/** Whether the page is at least as wide as the breakpoint now (or under it, with `below`). */

function matchesBreakpoint(name, options = {}) {
  return breakpointMedia(name, options)?.matches === true;
}
const Breakpoints = Object.freeze({
  ladder: BREAKPOINTS,
  query: breakpointQuery,
  media: breakpointMedia,
  matches: matchesBreakpoint
}); // Core publishes the helper; component bundles that carry their own copy reuse
// an already published one instead of replacing it.

if (typeof globalThis !== 'undefined') {
  globalThis.SF = globalThis.SF || {};
  if (!globalThis.SF.breakpoints) globalThis.SF.breakpoints = Breakpoints;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Breakpoints);

/***/ },

/***/ "1412c5875b4d"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RELATIVE: () => (/* binding */ RELATIVE),
/* harmony export */   densityOf: () => (/* binding */ densityOf),
/* harmony export */   drawing: () => (/* binding */ drawing),
/* harmony export */   followDensity: () => (/* binding */ followDensity),
/* harmony export */   markRelativeSizes: () => (/* binding */ markRelativeSizes),
/* harmony export */   noteAuthored: () => (/* binding */ noteAuthored),
/* harmony export */   sizeOf: () => (/* binding */ sizeOf),
/* harmony export */   sizeStep: () => (/* binding */ sizeStep),
/* harmony export */   sizedBefore: () => (/* binding */ sizedBefore)
/* harmony export */ });
// Density (owner decision C22, 2026-11-09). data-sf-density="compact" on the
// root or on a container moves every component one ladder step down; the CSS
// does it (core/scss/_sf_css__density.scss): each step variable holds the step
// below. An explicit size is a step on the region's ladder (owner decision
// C79, 2026-11-12, changing C22): it comes down with the region, and only
// data-sf-density="normal" takes the normal ladder back.
//
// A size a component's template gives an element it draws (sf-input's clear
// button, a pager's buttons, a submenu) is relative to the component's own
// size; those are still marked data-sf-size-relative once the component has
// drawn. Since C79 the density CSS treats both alike; the mark stays a
// published runtime mark (host-runtime-marks) for hosts that read it.
//
// What a component holds of the page's own (captured slot content, children
// left in place) keeps its size explicit. The store is on the shared global:
// every bundle carries its own copy of this module.
const store = () => {
  const SF = globalThis.SF = globalThis.SF || {};
  const internal = SF.__internal || (SF.__internal = {});
  return internal.density ||= {
    authored: new WeakSet(),
    depth: 0
  };
};

const RELATIVE = 'data-sf-size-relative'; // Page content a component captured to place in its own drawing. Content a
// template hands to a child while it draws is the template's, not the page's.

function noteAuthored(nodes) {
  const state = store();
  if (state.depth > 0) return;

  for (const node of nodes) if (node && typeof node === 'object') state.authored.add(node);
}
function drawing(callback) {
  const state = store();
  state.depth += 1;

  try {
    return callback();
  } finally {
    state.depth -= 1;
  }
} // The sized elements present before a host first draws are the page's.
// A printed first-paint picture is the drawing's, not the page's.

function sizedBefore(host) {
  return new Set(Array.from(host.querySelectorAll?.('[size]') ?? []).filter(element => {
    const picture = element.closest('[data-sf-static]');
    return !picture || !host.contains(picture);
  }));
} // After a host drew: every sized element its drawing holds that is not the
// page's is relative to the host.

function markRelativeSizes(host, before = null) {
  const {
    authored
  } = store();

  for (const element of host.querySelectorAll?.('[size]') ?? []) {
    if (element.hasAttribute(RELATIVE) || before?.has(element)) continue;
    let node = element;
    let page = false;

    while (node && node !== host) {
      if (authored.has(node)) {
        page = true;
        break;
      }

      node = node.parentNode;
    }

    if (!page) element.setAttribute(RELATIVE, '');
  }
} // A popup a component builds itself and places outside its own box (a menu on
// <body>, in an open dialog): sized from the component, so relative, and in
// the component's density, not the density of where it was placed.

function followDensity(element, from) {
  if (!element?.setAttribute) return element;
  if (element.hasAttribute('size')) element.setAttribute(RELATIVE, '');
  const density = densityOf(from);
  if (density) element.setAttribute('data-sf-density', density);else element.removeAttribute('data-sf-density');
  return element;
} // The density an element stands in: the nearest region's (an explicit size
// follows its region since C79); null outside any.

function densityOf(from) {
  for (let node = from; node?.nodeType === 1; node = node.parentElement) {
    if (node.hasAttribute('data-sf-density')) return node.getAttribute('data-sf-density');
  }

  return null;
} // The size step of the control a popup opens from (owner remark 2026-11-15:
// the row menu of a table of size 1 opened at 1/2). A popup a component
// builds outside itself -- a menu on <body> or in the open dialog -- stood on
// the default step whatever opened it. The step is the first size written
// from the opener up: the opener's own (a row's «⋯», the native button an
// sf-button draws), else its component's, else the Smart component that
// holds it (sf-view-table size="1"). A size a template gave a part it draws
// (data-sf-size-relative) follows its host, so the walk goes on past it. It
// ends on the default step (null) at the second custom element without a
// size: the opener's own component may stand on its default, the host
// holding it decides.

function sizeOf(from) {
  let own = true;

  for (let node = from; node?.nodeType === 1; node = node.parentElement) {
    if (node.hasAttribute('size')) {
      if (!node.hasAttribute(RELATIVE)) return node.getAttribute('size');
      continue;
    }

    if (!node.localName.includes('-')) continue;
    if (!own) return null;
    own = false;
  }

  return null;
} // A size step as a number of the ladder ("1/2" is 0.5, "2" is 2); NaN for
// anything else.

function sizeStep(size) {
  const [top, bottom = '1'] = String(size ?? '').trim().split('/');
  const step = Number(top) / Number(bottom);
  return top !== '' && Number.isFinite(step) && step > 0 ? step : Number.NaN;
}

/***/ },

/***/ "42f1649d1a1b"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SWIPE_SHARE: () => (/* binding */ SWIPE_SHARE),
/* harmony export */   SWIPE_SPEED: () => (/* binding */ SWIPE_SPEED),
/* harmony export */   handleRowHeight: () => (/* binding */ handleRowHeight),
/* harmony export */   inHandleRow: () => (/* binding */ inHandleRow),
/* harmony export */   scrollsAlong: () => (/* binding */ scrollsAlong),
/* harmony export */   startsOnControl: () => (/* binding */ startsOnControl),
/* harmony export */   swipeToClose: () => (/* binding */ swipeToClose),
/* harmony export */   trackSwipe: () => (/* binding */ trackSwipe)
/* harmony export */ });
// A finger closing a panel by pushing it toward its edge (owner decision C157
// (4) and (5), 2026-11-14): the bottom sheet -- sf-drawer placement="bottom"
// and every phone sheet drawn from core/scss/mix/_mix__sheet.scss -- follows
// a drag down and closes past a quarter of its height or on a quick flick; a
// side panel on a phone does the same toward its own edge. The panel follows
// the finger through a length in a custom property the owner's rule reads
// (translate), and settles back when the drag stops short.
//
//   const stop = trackSwipe(pointerdownEvent, {
//     surface,                      the box that moves
//     direction: 'down' | 'left' | 'right' | 'up',
//     variable: '--sf-sheet--drag', the property set on the surface
//     onEnd: ({dismiss, back}) => ...,
//   });
//
// dismiss: the drag passed the share or the speed toward the edge; back: it
// did so the other way (a sheet at rest may open further). A drag along the
// other axis is let go at once (a list scrolling inside a side panel), and a
// drag shorter than the slop is a press, not a swipe.
const SWIPE_SHARE = 0.25;
const SWIPE_SPEED = 0.5;
const SLOP = 4;
const AXES = {
  down: {
    axis: 'y',
    sign: 1
  },
  up: {
    axis: 'y',
    sign: -1
  },
  right: {
    axis: 'x',
    sign: 1
  },
  left: {
    axis: 'x',
    sign: -1
  }
}; // What a swipe must not start on: a control keeps its own presses, a field
// its text selection, a box that scrolls along the swipe's axis its scroll.

const KEEPS_PRESS = 'button, a[href], input, select, textarea, [contenteditable="true"], [role="slider"], [role="scrollbar"], [draggable="true"], sf-resizer';
function startsOnControl(target) {
  return Boolean(target instanceof Element && target.closest(KEEPS_PRESS));
} // Whether something between the target and the surface scrolls along this
// axis toward the swipe (a wide table in a side panel, a carousel).

function scrollsAlong(target, surface, axis) {
  for (let node = target instanceof Element ? target : null; node && node !== surface; node = node.parentElement) {
    const style = getComputedStyle(node);
    const overflow = axis === 'x' ? style.overflowX : style.overflowY;
    if (!/(auto|scroll)/u.test(overflow)) continue;
    if (axis === 'x' ? node.scrollWidth > node.clientWidth + 1 : node.scrollHeight > node.clientHeight + 1) return true;
  }

  return false;
}
function trackSwipe(event, {
  surface,
  direction = 'down',
  variable = '--sf-sheet--drag',
  onEnd,
  onMove
} = {}) {
  const spec = AXES[direction] || AXES.down;
  if (!surface || !event) return () => {};
  const grip = event.currentTarget instanceof Element ? event.currentTarget : surface;
  const start = {
    x: event.clientX,
    y: event.clientY,
    t: event.timeStamp
  };
  const rect = surface.getBoundingClientRect();
  const size = (spec.axis === 'y' ? rect.height : rect.width) || 1; // The owner names the physical edge: a length along x is left-to-right
  // whatever the page's direction.

  const physical = spec.sign;
  let moved = false;
  let given = false;
  let delta = 0;

  const along = e => spec.axis === 'y' ? e.clientY - start.y : e.clientX - start.x;

  const across = e => spec.axis === 'y' ? e.clientX - start.x : e.clientY - start.y; // The moves are heard on the document, not the grip: a pointer that leaves
  // the grip before it is captured (a quick drag off a handle row) still
  // reports to it.


  const doc = grip.ownerDocument || document;

  const clear = () => {
    doc.removeEventListener('pointermove', move, true);
    doc.removeEventListener('pointerup', end, true);
    doc.removeEventListener('pointercancel', end, true);
    surface.classList.remove('is-dragging');
    surface.style.removeProperty(variable);
  };

  const move = e => {
    if (given || e.pointerId !== event.pointerId) return;
    const a = along(e);

    if (!moved) {
      if (Math.abs(a) < SLOP && Math.abs(across(e)) < SLOP) return; // Across the axis first: a scroll or a selection, not this swipe.

      if (Math.abs(across(e)) > Math.abs(a)) {
        given = true;
        clear();
        return;
      }

      moved = true;
      surface.classList.add('is-dragging'); // Captured only once it is a swipe: captured at the press, the click
      // of a tap went to the grip instead of what was tapped.

      try {
        grip.setPointerCapture?.(event.pointerId);
      } catch {
        /* a synthetic event has no pointer */
      }
    }

    delta = a; // The panel follows toward its edge only; the other way it holds.

    const toward = Math.max(0, delta * physical);
    surface.style.setProperty(variable, `${toward * physical}px`);
    onMove?.(toward);
  };

  function end(e) {
    if (e.pointerId !== event.pointerId) return;
    clear();
    if (given || !moved || e.type === 'pointercancel') return; // A drag that ends on the grip is not also a press of it.
    // The click, if any, comes in the same task as the release; one that
    // never comes must not eat a later press.

    const swallow = click => click.stopImmediatePropagation();

    grip.addEventListener('click', swallow, {
      capture: true,
      once: true
    });
    setTimeout(() => grip.removeEventListener('click', swallow, {
      capture: true
    }));
    const toward = delta * physical;
    const speed = toward / Math.max(1, e.timeStamp - start.t);
    const dismiss = toward > size * SWIPE_SHARE || speed > SWIPE_SPEED;
    const back = !dismiss && (-toward > size * SWIPE_SHARE || speed < -SWIPE_SPEED);
    onEnd?.({
      dismiss,
      back,
      distance: toward
    });
  }

  doc.addEventListener('pointermove', move, true);
  doc.addEventListener('pointerup', end, true);
  doc.addEventListener('pointercancel', end, true);
  return clear;
} // The handle row of a sheet drawn by the mixin's ::before: a press within it
// -- from the sheet's top, the 1/2 control's height (the row the bar is
// centred in) -- starts the swipe.

function handleRowHeight(surface) {
  const value = getComputedStyle(surface).getPropertyValue('--sf-ui-1/2--control-height').trim();
  const match = /^(-?\d*\.?\d+)(px|rem|em)?$/u.exec(value);
  if (!match) return 32;
  const unit = match[2] || 'px';
  const base = unit === 'px' ? 1 : parseFloat(getComputedStyle(unit === 'rem' ? document.documentElement : surface).fontSize) || 16;
  return Number(match[1]) * base;
}
function inHandleRow(event, surface) {
  const top = surface.getBoundingClientRect().top;
  return event.clientY >= top && event.clientY - top <= handleRowHeight(surface);
} // A sheet that a swipe down from its handle row closes: binds the press on
// the surface and answers the unbinding. `when` says whether the surface is
// a sheet now (a form anchored on a wide screen is not); a press on a
// control keeps the control's own press.
//
//   const unbind = swipeToClose(surface, {when: () => owned.sheet, onDismiss: () => close()});

function swipeToClose(surface, {
  when = () => true,
  onDismiss
} = {}) {
  if (!surface) return () => {};

  const onPress = event => {
    if (event.button !== 0 || !when()) return;
    if (startsOnControl(event.target) || !inHandleRow(event, surface)) return;
    trackSwipe(event, {
      surface,
      direction: 'down',
      onEnd: ({
        dismiss
      }) => {
        if (dismiss) onDismiss?.();
      }
    });
  };

  surface.addEventListener('pointerdown', onPress);
  return () => surface.removeEventListener('pointerdown', onPress);
}

/***/ },

/***/ "769e1a2f7462"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isLateContent: () => (/* binding */ isLateContent),
/* harmony export */   watchLateChildren: () => (/* binding */ watchLateChildren)
/* harmony export */ });
// Children a page writes into a panel's host after the panel connected
// (Larena LF-3, 2026-11-18): sf-modal and sf-drawer took their content once,
// when they connected, so a body fetched and written while the panel was
// open stayed in the host -- out of the panel, and on the page itself, as the
// host draws no box of its own. The panel watches its host instead: what the
// page writes there later is handed to `take`, in the order written, once per
// batch of changes (one task's writes arrive together).
//
// Not content: static markup (a picture of the element, §5.4), a settings
// island, a comment and white space.
function isLateContent(node) {
  if (node.nodeType === 3) return node.textContent.trim() !== '';
  if (node.nodeType !== 1) return false;
  if (node.hasAttribute('data-sf-static')) return false;
  return !(node.localName === 'script' && node.hasAttribute('data-sf-settings'));
}
function watchLateChildren(host, take) {
  const observer = new MutationObserver(records => {
    const added = [];

    for (const record of records) {
      for (const node of record.addedNodes) {
        if (node.parentNode === host && !added.includes(node) && isLateContent(node)) added.push(node);
      }
    }

    if (added.length) take(added);
  });
  observer.observe(host, {
    childList: true
  });
  return observer;
}

/***/ },

/***/ "f98b7a216869"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var lit_directives_unsafe_html_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("073f05ff1a81");
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _core_js_deprecations__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("d3818183b14c");
/* harmony import */ var _core_js_instance_path__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("e92fd2d1a38c");
/* harmony import */ var _core_js_density_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("1412c5875b4d");
/* harmony import */ var _helpers_late_children_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("769e1a2f7462");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("e45eac6c719d");
/* harmony import */ var _component_modal_js_focus__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("c8d66dd2c299");
/* harmony import */ var _component_modal_js_closing__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("3f3a6e2680d5");
/* harmony import */ var _component_modal_js_motion__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("201fd0b17b8b");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__("afc57055d2cc");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__("85cdf307b188");
/* harmony import */ var _lang_index_mjs__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__("95d01a7df79b");
/* harmony import */ var _component_modal_js_stack__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__("93025a68d8ab");
/* harmony import */ var _core_js_layer_stack__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__("18003344cff0");
/* harmony import */ var _core_js_sheet_swipe__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__("42f1649d1a1b");
/* harmony import */ var _core_js_breakpoints_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__("1373e294ec38");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, lit_directives_unsafe_html_js__WEBPACK_IMPORTED_MODULE_1__, _core_js_smart_base__WEBPACK_IMPORTED_MODULE_2__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_3__, _core_js_deprecations__WEBPACK_IMPORTED_MODULE_4__, _core_js_instance_path__WEBPACK_IMPORTED_MODULE_5__, _js_templates_default__WEBPACK_IMPORTED_MODULE_8__, _component_modal_js_stack__WEBPACK_IMPORTED_MODULE_15__, _core_js_layer_stack__WEBPACK_IMPORTED_MODULE_16__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, lit_directives_unsafe_html_js__WEBPACK_IMPORTED_MODULE_1__, _core_js_smart_base__WEBPACK_IMPORTED_MODULE_2__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_3__, _core_js_deprecations__WEBPACK_IMPORTED_MODULE_4__, _core_js_instance_path__WEBPACK_IMPORTED_MODULE_5__, _js_templates_default__WEBPACK_IMPORTED_MODULE_8__, _component_modal_js_stack__WEBPACK_IMPORTED_MODULE_15__, _core_js_layer_stack__WEBPACK_IMPORTED_MODULE_16__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lit_directives_unsafe_html_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lit_directives_unsafe_html_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _core_js_deprecations__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_core_js_deprecations__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _core_js_instance_path__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_core_js_instance_path__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _core_js_layer_stack__WEBPACK_IMPORTED_MODULE_16___default = /*#__PURE__*/__webpack_require__.n(_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_16__);














 // Only the words on screen ship in the bundle, English only (owner decision
// C282): Russian and every other language come from a language file. The
// title, settings and events stay in the language files for the Studio and the
// docs (localization study LC-2).
// A box that holds its own overlays (sf-modal, sf-drawer); the drawer's own
// name came first and is read until the change journal retires it.

const OVERLAY_CONTAINER = "[data-sf-overlay-container], [data-sf-drawer-container]"; // Below the Framework's sm breakpoint (32rem) a question window is a bottom
// sheet (decision C39): the answers stand under the thumb and the keyboard
// does not cover them.
// The step itself comes from core/js/breakpoints.js, the ladder the sheet
// switches at.
// The questions a window holds that a reopening puts again (sf-confirm's
// answeredNo: it declined, or its decline is on its way and no outcome came).

const QUESTIONS = "sf-confirm, sf-confirm-change"; // The window sizes by name (decision C159 (1)); anything else, `auto` among
// them, is the default, a form.

const SIZES = ["question", "form", "wide", "full"]; // The ways a person closes a window; with unsaved changes in its fields they
// ask first (C159 (6)). A script's close (api) and an accepted answer do not.

const PERSON_CLOSES = ["escape", "close", "cancelled", "outside"]; // At most two windows, the second only a question (C159 (7)).

const STACK_LIMIT = 2;


 // A side window or a sheet is sf-drawer's (owner decision C157 (1),
// 2026-11-14): sf-modal position="inline-start|inline-end|left|right|bottom"
// is its old name until this date, noted once per value.

const EDGE_POSITIONS = ["inline-start", "inline-end", "left", "right", "bottom"];
const EDGE_POSITIONS_UNTIL = "2027-01-01";
 // sf-modal from its component.json (standard simai.smart-component 1.3.8 §3,
// §4, §8, §19): the settings are attributes and properties made by
// core/js/element-manifest.js, the words are lang/<locale>.json (the header's
// two actions, the untitled window's name and the loading state speak the
// page's language), and the old names -- title, blur, hide, unclose, the
// modal:* events, hide() and show() -- are dated aliases in aliases.json.

const ModalElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_3__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_12__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_2___default()),
  lang: _lang_index_mjs__WEBPACK_IMPORTED_MODULE_14__.files,
  source: "ru",
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_13__
}); // The public variables the manifest declares; a window drawn at the end of the
// body carries their values from where its host stands (§19.1).

const MODAL_VARIABLES = Object.keys(_component_json__WEBPACK_IMPORTED_MODULE_12__["css-variables"] || {}); // What retires without a new name (aliases.json rows with `to: null`): kept
// until the date, and each use is noted with it.

function noteRetired(kind, from) {
  (0,_core_js_deprecations__WEBPACK_IMPORTED_MODULE_4__.noteDeprecated)({
    component: "sf-modal",
    tag: "sf-modal",
    kind,
    from,
    to: null,
    since: _aliases_json__WEBPACK_IMPORTED_MODULE_13__.since,
    remove_after: _aliases_json__WEBPACK_IMPORTED_MODULE_13__.remove_after
  });
} // A lifecycle copy (modal:ready, modal:update) is still sent until its date; a
// listener that reads it is a use (§4.1, §16.13).


function retiredEvent(type, detail) {
  const event = new CustomEvent(type, {
    bubbles: true,
    composed: true,
    detail
  });
  let used = false;
  Object.defineProperty(event, "detail", {
    configurable: true,

    get() {
      if (!used) {
        used = true;
        noteRetired("event", type);
      }

      return detail;
    }

  });
  return event;
}

const OLD_EVENT_NAMES = {
  "modal:before-open": "open",
  "modal:after-open": "opened",
  "modal:before-close": "close",
  "modal:after-close": "closed",
  "modal:before-hide": "minimize",
  "modal:after-hide": "minimized",
  "modal:before-show": "expand",
  "modal:after-show": "expanded",
  "modal:before-content-upload": "content-upload",
  "modal:after-content-upload": "content-uploaded"
};

function isBlurTypeValue(value) {
  return ["none", "small", "medium", "large"].includes(String(value || "").trim().toLowerCase());
}

class SfModal extends ModalElement {
  static registry = new Map();
  static globalBound = false;
  static stack = [];
  static openCount = 0;
  static lockState = null; // Kept for code that reads it: the z-index comes from the one layer scale of
  // the core now (--sf-z-index-layer, whose default is this same 9000).

  static baseZIndex = 9000; // The page's children -- slotted and loose -- stay where the page wrote them
  // until the window draws, and the drawing takes them out and places them in
  // the same task (smart-base holdSlotNode, as sf-header-site): they were out
  // of the document from the window's connection to its first drawing, and a
  // page that found its sf-menu by id once sf-modal was defined got null on
  // 20 of 20 loads (ui-control evidence 2026-11-11-modal-followups, item 3).

  static holdsSlotNodesUntilDrawn = true;
  static defaultTrueAttributes = new Set(["overlay", "show-close", "show-footer", "close-on-esc", "close-on-overlay", "preserve-scroll-gap", "preload", "dismissible"]);

  static getTopModal() {
    return (0,_component_modal_js_stack__WEBPACK_IMPORTED_MODULE_15__.getTopModalLayer)();
  } // Whether this modal is the top layer of the document: a drawer or a list
  // opened from it stands above it and takes the keys while it does.


  static isTopModal(modal) {
    return (0,_component_modal_js_stack__WEBPACK_IMPORTED_MODULE_15__.isTopModalLayer)(modal);
  }

  static getStackIndex(modal) {
    return (0,_component_modal_js_stack__WEBPACK_IMPORTED_MODULE_15__.getModalLayerIndex)(modal);
  }

  static addToStack(modal) {
    if (!modal || modal.display === "inline") {
      return;
    }

    SfModal.stack = SfModal.stack.filter(item => item !== modal);
    SfModal.stack.push(modal);
    SfModal.openCount = SfModal.stack.length; // Keep the open-instance registry, but only visible dialogs own page focus
    // and the document scroll lock.

    if (!modal.hiddenState) {
      (0,_component_modal_js_stack__WEBPACK_IMPORTED_MODULE_15__.addModalLayer)(modal);
    }
  }

  static removeFromStack(modal) {
    if (!modal || modal.display === "inline") {
      return;
    }

    SfModal.stack = SfModal.stack.filter(item => item !== modal);
    SfModal.openCount = SfModal.stack.length;
    (0,_component_modal_js_stack__WEBPACK_IMPORTED_MODULE_15__.removeModalLayer)(modal);
  }

  static bringToFront(modal) {
    if (!modal || modal.display === "inline" || !SfModal.stack.includes(modal)) {
      return;
    }

    SfModal.stack = SfModal.stack.filter(item => item !== modal);
    SfModal.stack.push(modal);
    (0,_component_modal_js_stack__WEBPACK_IMPORTED_MODULE_15__.raiseModalLayer)(modal);
  }

  static updateStackStyles() {
    (0,_component_modal_js_stack__WEBPACK_IMPORTED_MODULE_15__.updateModalLayers)();
  } // The manifest's settings, and the base's own template name.


  static get props() {
    return { ...super.props,
      templateName: {
        attribute: "template",
        default: "default"
      },
      rootClass: {
        default: ""
      }
    };
  }

  constructor() {
    super();
    this._modalId = "";
    this._syncingOpenAttribute = false;
    this._portalRoot = null;
    this._renderTarget = null;
    this._hostClearedForPortal = false;
    this._slotEventHandlers = new Map();
    this._slotEventId = 0;
    this._readyDetail = null;
    this._hasEmittedReady = false;
    this._hasAutoloaded = false;
    this._isOpen = false;
    this._isHidden = false;
    this._modalState = "closed";
    this._animatePanel = false;
    this._stackIndex = -1;
    this._closeTimer = null;
    this._closeTransitionAbort = null;
    this._lastActive = null;
    this._fetchController = null;
    this._remoteHtml = "";
    this._remoteError = "";
    this._isLoadingRemote = false;
    this._remoteLoaded = false;
    this._asks = [];
    this._answer = null;
    this.onKeyDown = this.onKeyDown.bind(this);
    this.handleOverlayClick = this.handleOverlayClick.bind(this);
    this.handleSheetPointerDown = this.handleSheetPointerDown.bind(this);
    this.handleCloseClick = this.handleCloseClick.bind(this);
    this.handleHideClick = this.handleHideClick.bind(this);
  }

  connectedCallback() {
    if (!this._modalId) {
      // A window without modal-id or id takes its path id (§7.1.1): sf-modal-<n>
      // in document order, not a module counter (simai/ui-source#41).
      this._modalId = this.getAttribute("modal-id") || this.id || (0,_core_js_instance_path__WEBPACK_IMPORTED_MODULE_5__.partId)((0,_core_js_instance_path__WEBPACK_IMPORTED_MODULE_5__.instancePath)(this));
    }

    this.watchPhone();
    super.connectedCallback();
    SfModal.registry.set(this.modalId, this);
    SfModal.bindGlobalEvents(); // What the page writes into the host from now on is the window's (Larena
    // LF-3): the slots were taken once, when it connected.

    if (this.isConnected && !this._lateChildren) {
      this._lateChildren = (0,_helpers_late_children_js__WEBPACK_IMPORTED_MODULE_7__.watchLateChildren)(this, nodes => this.takeLateChildren(nodes));
    }
  } // Children the page wrote into the host after the window connected -- a
  // body fetched while the window is open, a footer that appears with an
  // answer (Larena LF-3, 2026-11-18). They are what their slot shows now: a
  // child named for a slot replaces that slot's content, a loose one replaces
  // the content, as at the start (a plain <div slot> gives its children, a
  // <template slot> its copy). To add to what the window shows, the page adds
  // into a node it already placed (a holder: <div slot="content" id="...">).


  takeLateChildren(nodes) {
    const bySlot = new Map();

    for (const node of nodes) {
      // An inline window draws in the host itself: its own drawing is not news.
      if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains("sf-modal")) continue;
      const slot = node.nodeType === Node.ELEMENT_NODE && node.getAttribute("slot") || "content";
      if (!bySlot.has(slot)) bySlot.set(slot, []);
      bySlot.get(slot).push(node);
    }

    if (!bySlot.size) return;

    for (const [slot, written] of bySlot) {
      const given = [];

      for (const node of written) {
        if (node.nodeType === Node.ELEMENT_NODE && node.localName === "template") {
          given.push(...Array.from(node.content?.childNodes || []).map(one => one.cloneNode(true)));
          node.remove();
          continue;
        }

        given.push(...(node.nodeType === Node.ELEMENT_NODE && node.hasAttribute("slot") ? this.slotNodesOf(node) : [node])); // Left where the page wrote it until the drawing places it, as at the start.

        this.holdSlotNode(node);
      }

      (0,_core_js_density_js__WEBPACK_IMPORTED_MODULE_6__.noteAuthored)(given);

      this._liveSlotNodes.set(slot, given);

      this._slotTemplates.delete(slot);
    }

    this.requestComponentUpdate("content");
  } // A question window follows the screen: a centred window on a wide one, a
  // bottom sheet below sm. One listener per window, while it is in the page.


  watchPhone() {
    const query = (0,_core_js_breakpoints_js__WEBPACK_IMPORTED_MODULE_18__.breakpointMedia)("sm", {
      below: true
    });
    if (!query || this._phoneQuery) return;
    this._phoneQuery = query;

    this._onPhoneChange = () => {
      if (this.display !== "inline") this.requestComponentUpdate("phone");
    };

    query.addEventListener?.("change", this._onPhoneChange);
  } // The window's size by name (C159 (1)): question, form, wide or full; no
  // size, or `auto`, is a form.


  get windowSize() {
    const size = String(this.size || "").trim().toLowerCase();
    return SIZES.includes(size) ? size : "form";
  } // On a phone (below sm) a window left at the centre (decision C159 (2)):
  // a question and a form stand as a sheet at the bottom, full width, the
  // answers sharing the row; a wide or full window and a form of more than
  // three fields take the whole screen. A question was the only sheet (C39).


  get onPhone() {
    return this.display !== "inline" && Boolean(this._phoneQuery?.matches);
  }

  get phoneFullScreen() {
    if (!this.onPhone || this.position !== "center") return false;
    const size = this.windowSize;
    return size === "wide" || size === "full" || size === "form" && this.contentFields().length > 3;
  } // The position the window stands in: the page's, except that a window left
  // at the centre opens as a bottom sheet on a phone (above).


  get shownPosition() {
    const position = this.position;

    if (position === "center" && this.onPhone && !this.phoneFullScreen) {
      return "bottom";
    }

    return position;
  }

  get shownFullscreen() {
    return Boolean(this.fullscreen) || this.windowSize === "full" || this.phoneFullScreen;
  } // The window's content fields (component/modal/js/_focus.js): drawn, or
  // still the page's nodes before the first drawing.


  contentFields() {
    const body = this._root()?.querySelector("[data-sf-modal-body-scroll]");
    if (body) return (0,_component_modal_js_focus__WEBPACK_IMPORTED_MODULE_9__.windowFields)(body); // Before the first drawing: the page's content nodes, each under a
    // detached holder of its own so the node itself counts too.

    const fields = [];

    for (const node of this._liveSlotNodes?.get("content") || []) {
      if (node.nodeType !== Node.ELEMENT_NODE) continue;
      const holder = {
        querySelectorAll: () => [node, ...node.querySelectorAll("*")]
      };
      fields.push(...(0,_component_modal_js_focus__WEBPACK_IMPORTED_MODULE_9__.windowFields)(holder));
    }

    return fields;
  } // A question -- size="question", or a window holding sf-confirm -- is not
  // a form: its typed name confirms, and it closes as a question does.


  get isQuestionWindow() {
    return this.windowSize === "question" || Boolean(this._renderTarget?.querySelector?.(QUESTIONS));
  } // A window with fields is one form (C159 (6), (9)).


  get hasFields() {
    return !this.isQuestionWindow && this.contentFields().length > 0;
  } // The footer's main answer (C159 (4), (9)): its first answer that is not
  // quiet (ghost or link: «Отмена») and not the record's own apart action.


  mainAnswer() {
    const footer = this._root()?.querySelector(".sf-modal-footer");
    if (!footer) return null;

    for (const node of footer.querySelectorAll("sf-button, button, a[href], input[type=\"submit\"]")) {
      if (node.localName !== "sf-button" && node.closest("sf-button")) continue; // sf-button hands its data-* attributes and its look to its button.

      const drawn = node.localName === "sf-button" ? node.querySelector(":scope > button, :scope > a") : node;
      if (node.closest("[data-apart]") || drawn?.matches?.("[data-apart]")) continue;
      if (["ghost", "link"].includes(node.getAttribute("appearance")) || drawn?.matches?.(".sf-button--ghost, .sf-button--link")) continue;
      return node;
    }

    return null;
  } // A reopened window puts its question again: an sf-confirm in it that took
  // the decline (Escape, «Отмена») with no outcome from the host would show
  // its answers greyed (recipes gaps D4 follow-up, DEV 2026-11-10).
  // A question still put starts afresh too: no name typed, nothing said
  // (C39 acceptance D1).


  reopenQuestions() {
    const target = this._renderTarget;
    if (!target?.querySelectorAll) return;

    for (const question of target.querySelectorAll(QUESTIONS)) {
      if (question.answeredNo) question.open?.();else question.clearRequire?.();
    }
  } // The window closes by its ×, the backdrop, Escape on the window or the
  // host's close() while its own question (sf-confirm appearance="window")
  // is still put: that is the decline, reported as «Отмена» is, so a host
  // sees one outcome for every way out; and the typed name goes, so the next
  // opening does not delete on one press (C39 acceptance D1, R069).


  declineQuestions() {
    const target = this._renderTarget;
    if (!target?.querySelectorAll) return;

    for (const question of target.querySelectorAll('sf-confirm[appearance="window"]')) {
      // disabled holds the acceptance only: a way out is the decline (LF-5).
      if (question.shownState === "open") question.cancel?.();
      question.clearRequire?.();
    }
  } // The old modal:* names keep their old detail (§16.20 split rows): the new
  // names carry data only (§8), the old ones also the element and its window.


  sfAliasAdapters() {
    const add = detail => ({ ...detail,
      component: this,
      modal: this,
      root: this._root()
    });

    return Object.fromEntries(Object.keys(OLD_EVENT_NAMES).map(name => [name, add]));
  } // What the author writes inside <sf-modal> without a slot is the window's
  // content, after anything slotted as content -- as sf-drawer takes it. It
  // used to be dropped without a word: an unslotted paragraph gave an empty
  // window (owner, 2026-10-18).


  captureSlotTemplates() {
    const first = !this._slotTemplatesCaptured;
    super.captureSlotTemplates();
    if (!first) return;
    const loose = Array.from(this.childNodes).filter(node => node.nodeType === Node.ELEMENT_NODE // Static markup is a picture of the window, not its content (§5.4).
    // A slotted child is the base's: while it is held (holdSlotNode) it
    // is still here and is not loose content a second time.
    ? node.tagName.toLowerCase() !== "template" && !node.hasAttribute("data-sf-static") && !node.hasAttribute("slot") : node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== "");
    if (!loose.length) return;
    if (!this._liveSlotNodes.has("content")) this._liveSlotNodes.set("content", []);

    this._liveSlotNodes.get("content").push(...loose); // Through the base's hold, as the slotted children go (smart-base.js
    // holdSlotNode): left where the page wrote them until the first drawing
    // (static holdsSlotNodesUntilDrawn).


    loose.forEach(node => this.holdSlotNode(node));
  }

  disconnectedCallback() {
    // The page's nodes go back into the host now (returnSlotNodes): not news.
    this._lateChildren?.disconnect();
    this._lateChildren = null;
    this._phoneQuery?.removeEventListener?.("change", this._onPhoneChange);
    this._phoneQuery = null;
    this.teardownModal();
    SfModal.registry.delete(this.modalId);
    super.disconnectedCallback();
  }

  get templateName() {
    return this.getAttribute("template") || "default";
  }

  get modalId() {
    return this.getAttribute("modal-id") || this._modalId || this.id || "";
  } // An inline window stands in the page's flow, so it is shown without
  // `open` until close() puts it away; it needed the attribute to show at all,
  // while the script Modal opens an inline one by itself (owner, 2026-10-18).


  get openState() {
    return this._isOpen || this.hasAttribute("open") || this.display === "inline" && !this._inlineClosed;
  } // dismissible=false turns off Escape and the overlay (§19.3); `unclose` is
  // its old, inverted name, read until its date.


  get dismissible() {
    if (this.hasAttribute("unclose") && this.getAttribute("unclose") !== "false") {
      (0,_core_js_deprecations__WEBPACK_IMPORTED_MODULE_4__.noteDeprecated)({
        component: "sf-modal",
        tag: "sf-modal",
        kind: "attribute",
        attribute: "unclose",
        from: "unclose",
        to: "dismissible",
        since: _aliases_json__WEBPACK_IMPORTED_MODULE_13__.since,
        remove_after: _aliases_json__WEBPACK_IMPORTED_MODULE_13__.remove_after
      });
      return false;
    }

    return this.getBooleanAttr("dismissible", true);
  }

  set dismissible(value) {
    if (value === false) this.setAttribute("dismissible", "false");else this.removeAttribute("dismissible");
  }

  get unclose() {
    return !this.dismissible;
  }

  get hiddenState() {
    return this.display !== "inline" && (this._isHidden || this.hasAttribute("minimized"));
  } // The value minimized (§4): the window is open but out of the visible stack.
  // The attribute's presence says so, whatever it holds, as the template reads.


  get minimized() {
    return this.hiddenState;
  }

  set minimized(value) {
    this.toggleAttribute("minimized", Boolean(value));
  }

  get showClose() {
    const showClose = this.getBooleanAttr("show-close", true);
    return showClose && this.dismissible;
  } // backdrop-blur="small" turns the blur on and names its type;
  // backdrop-blur="false" turns it off. Its old name is `blur`, a method of
  // every element (§3.1), mapped by the alias table.


  get hasBackdropBlur() {
    const value = this.getAttribute("backdrop-blur");
    return isBlurTypeValue(value) || this.getBooleanAttr("backdrop-blur", false);
  }

  get blurType() {
    const blurValue = this.getAttribute("backdrop-blur");
    const value = this.getAttribute("blur-type") || (isBlurTypeValue(blurValue) ? blurValue : "medium");
    return this.normalizeEnum(value, ["none", "small", "medium", "large"], "medium");
  }

  get hasCustomBlurType() {
    return this.hasAttribute("blur-type") || isBlurTypeValue(this.getAttribute("backdrop-blur"));
  } // The rendered window: the component's own, not a reader of the interface.


  _root() {
    return this._renderTarget?.querySelector?.(".sf-modal") || null;
  }

  get modalRoot() {
    return this._root();
  }

  get state() {
    return {
      modalId: this.modalId,
      heading: this.heading,
      ariaLabel: this.getAttribute("aria-label") || "",
      text: this.text,
      open: this.openState,
      autoload: this.autoload,
      dismissible: this.dismissible,
      unsaved: this.unsaved,
      minimizable: this.minimizable,
      hideModifier: this.hideModifier,
      minimized: this.hiddenState,
      overlay: this.overlay,
      showHeader: this.showHeader,
      showClose: this.showClose,
      showFooter: this.showFooter,
      closeOnEsc: this.closeOnEsc,
      closeOnOverlay: this.closeOnOverlay,
      preserveScrollGap: this.preserveScrollGap,
      position: this.shownPosition,
      size: this.size,
      mode: this.mode,
      display: this.display,
      src: this.src,
      preload: this.preload,
      fullscreen: this.fullscreen,
      width: this.width,
      height: this.height,
      backdropBlur: this.hasBackdropBlur,
      blurType: this.blurType,
      overlayPreset: this.overlayPreset,
      overlayClass: this.overlayClass,
      closeClass: this.closeClass,
      surfaceClass: this.surfaceClass,
      surfacePadding: this.surfacePadding,
      panelClass: this.panelClass,
      headerClass: this.headerClass,
      bodyClass: this.bodyClass,
      contentClass: this.contentClass,
      footerClass: this.footerClass,
      lifecycle: this.renderModalState,
      remote: {
        error: this._remoteError,
        status: this._isLoadingRemote ? "loading" : this._remoteError ? "error" : this._remoteLoaded ? "success" : "idle"
      },
      stackIndex: this._stackIndex
    };
  }

  get renderOpenState() {
    return this.openState || this._modalState === "closing";
  }

  get renderModalState() {
    if (this.display === "inline") {
      return this.openState ? "open" : "closed";
    }

    if (this.renderOpenState && this._modalState === "closed") {
      return "open";
    }

    return this._modalState;
  }

  get modalZIndex() {
    if (this.display === "inline" || this._stackIndex < 0) {
      return "";
    }

    return (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_16__.layerZIndexAt)(this._stackIndex);
  }

  get remoteContent() {
    if (this.mode === "iframe" && this.src) {
      return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <iframe
          class="sf-modal-iframe w-full border-0 radius-surface"
          src=${this.src}
          data-sf-modal-iframe
          allowfullscreen
          style="min-height:var(--sf-modal-iframe-min-height);height:100%;"
          @load=${this.handleIframeLoad}
          @error=${this.handleIframeError}
        ></iframe>
      `;
    }

    if (this._remoteError) {
      return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div
          class="sf-modal-error flex flex-col gap-2 items-cross-center content-main-center p-4"
          data-sf-modal-state="error"
        >
          <div class="sf-modal-error-icon text-4 color-error">!</div>
          <p class="sf-modal-error-text m-0 text-2 color-error">
            ${this._remoteError}
          </p>
        </div>
      `;
    }

    if (this._remoteHtml) {
      return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-modal-content flex flex-col gap-2">
        ${(0,lit_directives_unsafe_html_js__WEBPACK_IMPORTED_MODULE_1__.unsafeHTML)(this._remoteHtml)}
      </div>`;
    }

    if (this._isLoadingRemote) {
      // A skeleton of text lines in the window's own width (decision C159
      // (9)): the window keeps its size while the content comes, where a
      // spinner in a box of its own made it jump (209 x 240, then 194 x 132).
      // The words are the page's language's, and the state is a status
      // region named by them, so it is announced, not only seen.
      const loading = this.sfWord("loading");
      return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div
          class="sf-modal-loading sf-modal-skeleton"
          data-sf-modal-state="loading"
          role="status"
          aria-label=${loading}
          aria-busy="true"
        >
          <span class="sf-modal-skeleton-line" aria-hidden="true"></span>
          <span class="sf-modal-skeleton-line" aria-hidden="true"></span>
          <span class="sf-modal-skeleton-line" aria-hidden="true"></span>
        </div>
      `;
    }

    return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  }

  templateContext() {
    this._slotEventHandlers.clear();

    this._slotEventId = 0;
    const props = this.getPropsContext();
    return this.createTemplateContext({ ...props,
      component: this,
      closeText: this.sfWord("close"),
      minimizeText: this.sfWord("minimize"),
      // The heading, or the page language's word for an untitled window.
      title: this.heading,
      ariaLabel: this.getAttribute("aria-label") || "",
      modalId: this.modalId,
      // The ids the template writes are the path's (§7.1.1), not the modal id's.
      titleId: (0,_core_js_instance_path__WEBPACK_IMPORTED_MODULE_5__.partId)((0,_core_js_instance_path__WEBPACK_IMPORTED_MODULE_5__.instancePath)(this), "title"),
      // The window's root takes the modal id only when the element does not
      // already hold it: <sf-modal id="x"> gave the page two elements with id x
      // (simai/ui-source#42).
      rootId: this.id === this.modalId ? "" : this.modalId,
      open: this.renderOpenState,
      modalState: this.renderModalState,
      // A window at the centre opens as a bottom sheet or full screen on a
      // phone (C39, C159 (2)); its size is one of the named four (C159 (1)).
      position: this.shownPosition,
      size: this.windowSize,
      fullscreen: this.shownFullscreen,
      animate: this._animatePanel && this.display !== "inline",
      modalZIndex: this.modalZIndex,
      hide: this.minimizable,
      minimized: this.hiddenState,
      showClose: this.showClose,
      blur: this.hasBackdropBlur,
      blurType: this.blurType,
      hasCustomBlurType: this.hasCustomBlurType,
      hasHeaderContent: this.hasSlotContent("header"),
      hasContentContent: this.hasSlotContent("content"),
      hasFooterContent: this.hasSlotContent("footer"),
      // The page's own nodes, placed and not copied (standard 1.3.8 §4.5): a
      // listener, a property and the node itself survive opening and closing
      // (simai/ui-source#42). They used to be serialised through outerHTML.
      headerContent: this.slotNodes("header"),
      contentContent: this.slotNodes("content"),
      footerContent: this.slotNodes("footer"),
      remoteContent: this.remoteContent,
      onCloseClick: this.handleCloseClick,
      onHideClick: this.handleHideClick
    });
  } // What a slot shows: the page's live nodes, then the content of a
  // <template slot> stamped once and kept, so a redraw does not replace it.


  slotNodes(name) {
    const live = this._liveSlotNodes.get(name) || [];
    const templates = this._slotTemplates.get(name) || [];
    if (!templates.length) return live;
    this._stampedSlots ??= new WeakMap();

    if (!this._stampedSlots.has(templates)) {
      this._stampedSlots.set(templates, templates.map(node => node.cloneNode(true)));
    }

    return [...live, ...this._stampedSlots.get(templates)];
  } // The page's nodes go back into the element when it leaves the page, so
  // they travel with it and are placed again when it returns.


  returnSlotNodes() {
    for (const nodes of this._liveSlotNodes.values()) {
      for (const node of nodes) {
        if (node.parentNode !== this) this.append(node);
      }
    }
  } // The HTML of a slot's content, for reading. Drawing does not use it: the
  // window places the nodes themselves. A reader retires (§4.4, §16.13): kept
  // until its date, each call noted.


  getSlotHtml(name) {
    noteRetired("action", "getSlotHtml");
    const slotContent = [...(this._liveSlotNodes.get(name) || []), ...(this._slotTemplates.get(name) || [])];
    return slotContent.map(node => {
      if (node instanceof HTMLElement) {
        const clone = node.cloneNode(true);
        this.copyRuntimeData(node, clone);
        this.assignSlotEventIds(clone);
        this.cleanNestedSmartComponentRender(clone);
        return clone.outerHTML;
      }

      return node.textContent || "";
    }).join("");
  }

  assignSlotEventIds(root) {
    const nodes = [root, ...Array.from(root.querySelectorAll?.("*") || [])];
    nodes.forEach(node => {
      if (!node.__sfCreateEventHandlers?.length) {
        return;
      }

      const id = `sf-modal-slot-event-${++this._slotEventId}`;
      node.setAttribute("data-sf-runtime-event-id", id);

      this._slotEventHandlers.set(id, node.__sfCreateEventHandlers.slice());
    });
  }

  cleanNestedSmartComponentRender(root) {
    const nodes = [root, ...Array.from(root.querySelectorAll?.("*") || [])];
    nodes.forEach(node => {
      const tagName = node.tagName?.toLowerCase?.() || "";

      if (!tagName.startsWith("sf-")) {
        return;
      }

      Array.from(node.childNodes).forEach(child => {
        if (child instanceof HTMLElement && (child.hasAttribute("slot") || child.tagName.toLowerCase() === "slot" || child.tagName.toLowerCase().startsWith("sf-"))) {
          return;
        }

        child.remove();
      });
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_8__.renderModalTemplate)(this.templateContext());
  }

  async renderComponent(changedAttributes = []) {
    const renderToken = ++this._renderToken;

    if (!this._isMounted) {
      return;
    }

    this.beforeRender(changedAttributes);
    this.emitComponentEvent("before-render", {
      changedAttributes
    });
    this.runExternalHook("beforeRender", {
      changedAttributes,
      root: this
    });
    const templateResult = await this.resolveTemplateResult(changedAttributes);

    if (!this._isMounted || renderToken !== this._renderToken) {
      return;
    } // Static markup printed for the first paint goes as the window draws
    // (standard 1.3.8 §5.4): the base's first render does it, and this
    // render is the window's own.


    if (!this.__sfFirstPaintEnded) {
      this.__sfFirstPaintEnded = true;
      this.prepareRenderContainer(changedAttributes);
    }

    const target = this.resolveRenderTarget();
    this.holdWindowUntilStyled(target); // The held children leave the host and are placed by the drawing in the
    // same task, as the base's render does (releaseHeldSlotNodes).

    this.releaseHeldSlotNodes();
    this.drawInto(templateResult, target);
    this.afterRender(changedAttributes);
    this.runExternalHook("afterRender", {
      changedAttributes,
      root: this
    });
    this.emitComponentEvent("after-render", {
      changedAttributes
    });
  } // The window drawn in its portal stays out of view until the sheets it
  // draws with are applied (the base's holdPortalUntilStyled): under
  // held-back sheets an open window painted for a moment as a card in the
  // page flow, without its layer, scrim or x (DEV's acceptance 2026-11-11,
  // N2). Once it shows, a window that opened in the meantime takes its first
  // focus, which a hidden panel could not. An inline window draws in its
  // host, where the page put it, and keeps what the base does for it.


  holdWindowUntilStyled(target) {
    if (this.display === "inline") return;
    this.holdPortalUntilStyled(target, () => {
      const root = this._root();

      if (this._isOpen && this._modalState === "open" && root && !root.contains(document.activeElement)) {
        this.focusFirst();
      }
    });
  }

  resolveRenderTarget() {
    if (this.display === "inline") {
      this.clearPortal();
      this._hostClearedForPortal = false;
      this._renderTarget = this;
      return this;
    }

    if (!this._hostClearedForPortal) {
      (0,lit__WEBPACK_IMPORTED_MODULE_0__.render)(lit__WEBPACK_IMPORTED_MODULE_0__.nothing, this);
      this._hostClearedForPortal = true;
    }

    if (!this._portalRoot) {
      this._portalRoot = this.resolvePortalRoot();
    }

    this.dedupePortalRoots(); // The portal stands at the end of the body; it speaks and looks as the
    // element does where it stands (standard 1.3.8 §19.1): lang, dir and the
    // theme of its area, and the values of the public variables its manifest
    // declares, by name: a prefix would also carry what an outer window sets
    // on its own panel (--sf-modal-width) into a window opened from it. And
    // the variables of the area it stands in (simai/ui-source#46 item 1): a
    // block's retuned roles and its parts' public variables reach the window
    // and its content, but none of the window's own --sf-modal-* names.

    (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_16__.carryLayerOrigin)(this._portalRoot, this, {
      variables: MODAL_VARIABLES,
      area: true,
      except: ["--sf-modal-"]
    });
    this._renderTarget = this._portalRoot;
    this.listenForAnswers(this._portalRoot);
    this.listenForFields(this._portalRoot);
    return this._portalRoot;
  } // «Отмена» of the window's own question (sf-confirm appearance="window",
  // decision C39) closes the window, as the window's × does: the question is
  // the window. Read once the answer has gone through the page, so a host
  // that refused it (cancelled the event) keeps the window and the question.


  listenForAnswers(target) {
    if (!target || this._answersTarget === target) return;
    this._answersTarget?.removeEventListener("sf-confirm-answer", this._onAnswer);

    this._onAnswer ??= event => {
      const question = event.target;
      if (event.detail?.accepted !== false || question?.getAttribute?.("appearance") !== "window") return;
      queueMicrotask(() => {
        if (!event.defaultPrevented && this._isOpen && this._modalState !== "closing") this.close({
          reason: "cancelled"
        });
      });
    };

    target.addEventListener("sf-confirm-answer", this._onAnswer);
    this._answersTarget = target;
  } // The window as a form (decision C159 (6), (9)), read where it draws:
  // - a change in a field marks the window edited, so closing it asks first;
  // - Enter in a one-line field presses the main answer, and the main answer
  //   submits the <form> of the content, if there is one;
  // - while the main answer shows loading (sf-button loading, set by the
  //   page as it saves) the window saves: its fields are read-only and only
  //   a script closes it.


  listenForFields(target) {
    if (!target || this._fieldsTarget === target) return;

    if (this._fieldsTarget) {
      for (const [type, listener] of this._fieldListeners) this._fieldsTarget.removeEventListener(type, listener);

      this._savingObserver?.disconnect();
    }

    const inBody = node => Boolean(node?.closest?.("[data-sf-modal-body-scroll]"));

    const edited = event => {
      if (this._isOpen && !this._saving && inBody(event.target) && !this.isQuestionWindow) this._edited = true;
    };

    const keydown = event => {
      if (event.key !== "Enter" || event.defaultPrevented || event.isComposing || event.shiftKey || event.ctrlKey || event.altKey || event.metaKey || !this._isOpen) return;
      const field = event.composedPath?.()[0] || event.target;
      if (!(0,_component_modal_js_focus__WEBPACK_IMPORTED_MODULE_9__.isOneLineField)(field) || !inBody(field) || field.getAttribute("aria-expanded") === "true") return;
      if (!this.hasFields) return;
      const main = this.mainAnswer();
      if (!main) return;
      event.preventDefault();
      if (this._saving) return;
      const control = main.localName === "sf-button" ? main.querySelector("button, a") : main;
      control?.click();
    };

    const click = event => {
      const main = this.mainAnswer();
      if (!main || !this._isOpen || !main.contains(event.target) || !this.hasFields) return;
      const control = event.target.closest("button, a, input");
      if (control?.type === "submit" && control.form) return;
      const form = this._root()?.querySelector("[data-sf-modal-body-scroll] form");
      if (form && !event.defaultPrevented) form.requestSubmit();
    };

    this._fieldListeners = [["input", edited], ["change", edited], ["keydown", keydown], ["click", click]];

    for (const [type, listener] of this._fieldListeners) target.addEventListener(type, listener);

    this._savingObserver = new MutationObserver(() => this.syncSaving());

    this._savingObserver.observe(target, {
      subtree: true,
      attributes: true,
      attributeFilter: ["loading"]
    });

    this._fieldsTarget = target;
  } // The window saves while its main answer shows loading (C159 (9); the
  // button keeps its colour, C36).


  syncSaving() {
    const saving = Boolean(this._isOpen && this.hasFields && this.mainAnswer()?.hasAttribute("loading"));
    if (saving === Boolean(this._saving)) return;
    this._saving = saving;

    const root = this._root();

    if (saving) {
      this._releaseSaving = (0,_component_modal_js_focus__WEBPACK_IMPORTED_MODULE_9__.holdFieldsReadOnly)(this.contentFields());
      root?.setAttribute("aria-busy", "true");
    } else {
      this._releaseSaving?.();
      this._releaseSaving = null;
      root?.removeAttribute("aria-busy");
    }
  } // the discard question, lang discard-heading (decision C159 (6), with C25 and C39): a
  // question window over this one -- «Не сохранять», red, first; «Продолжить
  // правку», quiet, with the focus. Not saving closes this window for the
  // reason it was asked; continuing gives the focus back to the field.


  askDiscard(reason) {
    let question = this._discardQuestion;

    if (!question?.isConnected) {
      question = document.createElement("sf-modal");
      question.setAttribute("size", "question");
      question.setAttribute("initial-focus", "safe");
      question.setAttribute("data-sf-modal-discard", "");
      question.setAttribute("heading", this.sfWord("discard-heading"));
      const footer = document.createElement("div");
      footer.setAttribute("slot", "footer");
      const discard = document.createElement("sf-button");
      discard.setAttribute("status", "danger");
      discard.setAttribute("text", this.sfWord("discard"));
      discard.setAttribute("data-sf-modal-discard-answer", "");
      const keep = document.createElement("sf-button");
      keep.setAttribute("appearance", "ghost");
      keep.setAttribute("scheme", "on-surface");
      keep.setAttribute("text", this.sfWord("keep-editing"));
      keep.setAttribute("data-sf-modal-close", "");
      footer.append(discard, keep);
      question.append(footer);
      discard.addEventListener("click", () => {
        const asked = this._discardReason || "cancelled";
        question.addEventListener("sf-modal-closed", () => {
          this._discardAgreed = true;
          this.close({
            reason: asked
          });
        }, {
          once: true
        });
        question.close({
          reason: "api"
        });
      });
      question.setAttribute("open", "");
      this._discardReason = reason;
      this._discardQuestion = question;
      this.overlayHome.append(question);
      return;
    }

    this._discardReason = reason;
    question.open();
  } // The body's edges (decision C159 (3)): a hairline over the body while text
  // is above what shows, under it while text is below.


  watchBodyEdges() {
    const root = this._root();

    const body = root?.querySelector("[data-sf-modal-body-scroll]");
    if (!body) return;

    const update = () => {
      const top = body.scrollTop > 0;
      const end = body.scrollTop + body.clientHeight < body.scrollHeight - 1;
      root.toggleAttribute("data-sf-modal-more-start", top);
      root.toggleAttribute("data-sf-modal-more-end", end);
    };

    if (this._edgesBody !== body) {
      this._edgesObserver?.disconnect();
      this._edgesBody?.removeEventListener("scroll", this._onEdgesScroll);
      this._onEdgesScroll = update;
      body.addEventListener("scroll", update, {
        passive: true
      });
      this._edgesObserver = typeof ResizeObserver === "function" ? new ResizeObserver(update) : null;
      this._edgesObserver?.observe(body);

      for (const child of body.children) this._edgesObserver?.observe(child);

      this._edgesBody = body;
    }

    update();
  } // The box the modal is rendered into: the end of the body, above the page --
  // or, when the modal stands inside a [data-sf-overlay-container], the end of
  // that box, which then frames its backdrop and surface (contain: layout makes
  // it their containing block) and whose page is not locked: a documentation
  // example or an editor pane holds its own modal (DEV, 2026-10-18).


  get overlayHome() {
    return this.closest(OVERLAY_CONTAINER) || document.body;
  }

  get inContainer() {
    return this.overlayHome !== document.body;
  }

  resolvePortalRoot() {
    const home = this.overlayHome;
    const existingPortal = home.querySelector(`[data-sf-modal-portal="${this.modalId}"]`);

    if (existingPortal) {
      return existingPortal;
    }

    const portal = document.createElement("div");
    portal.setAttribute("data-sf-modal-portal", this.modalId);
    home.append(portal);
    return portal;
  }

  dedupePortalRoots() {
    const portals = Array.from(document.querySelectorAll(`[data-sf-modal-portal="${this.modalId}"]`));
    portals.forEach(portal => {
      if (portal === this._portalRoot) {
        return;
      }

      (0,lit__WEBPACK_IMPORTED_MODULE_0__.render)(lit__WEBPACK_IMPORTED_MODULE_0__.nothing, portal);
      portal.remove();
    });

    if (!this._portalRoot.isConnected) {
      this._portalRoot.setAttribute("data-sf-modal-portal", this.modalId);

      this.overlayHome.append(this._portalRoot);
    }
  }

  applyStackPosition(index = SfModal.getStackIndex(this)) {
    this._stackIndex = index;

    const root = this._root();

    if (!root || this.display === "inline") {
      return this;
    }

    if (index < 0) {
      root.style.removeProperty("z-index");
      root.style.removeProperty("--sf-modal-stack-index");
      return this;
    }

    root.style.setProperty("--sf-modal-stack-index", String(index));
    root.style.zIndex = String(this.modalZIndex); // One scrim (decision C159 (7)): a window over another open window lays
    // none of its own.

    const at = SfModal.stack.indexOf(this);
    root.toggleAttribute("data-sf-modal-stacked", SfModal.stack.slice(0, Math.max(0, at)).some(modal => modal.openState && !modal.hiddenState));
    return this;
  } // Opens the window, or raises an open one to the top. Answers an outcome
  // (§4.4): refused when a listener prevents sf-modal-open. Asked by an
  // assembly -- a call that hands a signal -- it answers when the window
  // closes, with the person's answer {accepted, reason, value} (§19.4).


  open(options = {}, {
    signal
  } = {}) {
    const {
      animate = true
    } = typeof options === "boolean" ? {
      animate: options
    } : options || {};
    const wasClosing = this._modalState === "closing";
    const asked = Boolean(signal);

    if ((this._isOpen || this.display === "inline" && this.openState) && !wasClosing) {
      this.cancelCloseTransition();
      SfModal.bringToFront(this);
      return asked ? this.waitForAnswer(signal) : (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_3__.applied)();
    } // At most two windows, and the second only a question (decision C159
    // (7)): a third window, or a second that is not a question, is refused.


    if (!wasClosing && this.display !== "inline") {
      const below = SfModal.stack.filter(modal => modal !== this && modal.openState && !modal.hiddenState && modal._modalState !== "closing");

      if (below.length >= STACK_LIMIT || below.length && this.windowSize !== "question") {
        console.warn(`sf-modal "${this.modalId}": not opened -- at most two windows, the second only a question (size="question"), SIMAI Framework decision C159 (7).`);
        return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_3__.refused)("stacked");
      }
    }

    if (!this.emitModalEvent("open", {
      cancelable: true,
      phase: "before-open"
    })) {
      return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_3__.refused)("prevented");
    }

    if (!wasClosing) {
      this._lastActive = document.activeElement;
      this._focusReturnAncestors = (0,_component_modal_js_stack__WEBPACK_IMPORTED_MODULE_15__.captureModalFocusAncestors)(this._lastActive);
    }

    if (wasClosing) {
      this.cancelCloseTransition();
      this._releaseClosingContent?.();
      this._releaseClosingContent = null;
    }

    this._isOpen = true;
    this._edited = false;
    this._discardAgreed = false;
    this.reopenQuestions();
    this._closeReason = "";
    this._answer = null;
    this._inlineClosed = false;
    this._animatePanel = Boolean(animate);
    this._modalState = animate && this.display !== "inline" ? "opening" : "open";
    this.syncOpenAttribute(true);

    if (this.display !== "inline" && !wasClosing) {
      SfModal.addToStack(this);
    } else if (this.display !== "inline") {
      SfModal.bringToFront(this);
    }

    this.requestComponentUpdate("open");
    (0,_component_modal_js_motion__WEBPACK_IMPORTED_MODULE_11__.scheduleModalFrame)(() => {
      if (!this._isOpen || this._modalState === "closing") {
        return;
      }

      this._modalState = "open";
      const projected = new Promise(resolve => {
        const onUpdated = event => {
          if (!event.detail?.changedAttributes?.includes("open-state")) {
            return;
          }

          this.removeEventListener("sf-updated", onUpdated);
          resolve();
        };

        this.addEventListener("sf-updated", onUpdated);
      });
      this.requestComponentUpdate("open-state");
      void projected.then(() => {
        if (!this._isOpen || this._modalState !== "open") {
          return;
        }

        this.focusFirst();
        this.emitModalEvent("opened", {
          phase: "after-open"
        });
        this.loadRemoteContentIfNeeded();
      });
    });
    return asked ? this.waitForAnswer(signal) : (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_3__.applied)();
  } // The person's answer to an assembly's ask (§19.4), when the window closes:
  // {accepted, reason, value}. A scope that ends first answers cancelled.


  waitForAnswer(signal) {
    return new Promise(resolve => {
      const ask = {
        resolve
      };

      this._asks.push(ask);

      signal?.addEventListener?.("abort", () => {
        this._asks = this._asks.filter(one => one !== ask);
        resolve({
          outcome: "cancelled"
        });
      }, {
        once: true
      });
    });
  }

  settleAsks(reason) {
    const value = {
      accepted: Boolean(this._answer?.accepted),
      reason,
      value: this._answer?.value ?? null
    };
    const asks = this._asks;
    this._asks = [];

    for (const ask of asks) ask.resolve({
      outcome: "applied",
      value
    });
  } // options.reason says why (standard 1.3.8 §19.3): close (its own close
  // control), escape, outside (the overlay), cancelled (a page control that
  // closes it) or api, the default. A listener that prevents sf-modal-close
  // keeps it open, and the action answers refused (§8).


  close(options = {}) {
    if (!this.openState || this._modalState === "closing") {
      return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_3__.refused)("closed");
    }

    const reason = typeof options?.reason === "string" ? options.reason : "api"; // While the window saves (its main answer shows loading), only a script
    // closes it: Escape, x and «Отмена» wait (decision C159 (9)).

    if (this._saving && reason !== "api") {
      return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_3__.refused)("busy");
    }

    const unsaved = Boolean(this.unsaved) || Boolean(this._edited);

    if (!this.emitModalEvent("close", {
      cancelable: true,
      phase: "before-close",
      reason,
      unsaved
    })) {
      this._answer = null;
      return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_3__.refused)("prevented");
    } // Changes in a window with fields are not lost on Escape, x, «Отмена»
    // or a press outside: the Framework's discard question (lang discard-heading)
    // comes first (decision C159 (6)), unless the page took the request
    // above. The main answer, an accepted answer and a script close as asked.


    const pressedMain = this._mainPressed;
    this._mainPressed = false;

    if (unsaved && PERSON_CLOSES.includes(reason) && !pressedMain && !this._answer?.accepted && !this._discardAgreed && this.hasFields) {
      this.askDiscard(reason);
      return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_3__.refused)("unsaved");
    }

    this._closeReason = reason;

    if (this.display === "inline") {
      this.finishClose();
      return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_3__.applied)();
    }

    this._modalState = "closing";
    this._isOpen = false; // After the state: a host that closes the window from the answer's
    // handler finds it closing already.

    this.declineQuestions();
    this.requestComponentUpdate("close");
    const panel = this._root()?.querySelector("[data-sf-modal-panel]");
    this._releaseClosingContent = (0,_component_modal_js_closing__WEBPACK_IMPORTED_MODULE_10__.freezeModalContent)(panel, SfModal.isTopModal(this));
    this._closeTransitionAbort = (0,_component_modal_js_motion__WEBPACK_IMPORTED_MODULE_11__.scheduleModalClose)(() => this._root(), () => this.finishClose());
    return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_3__.applied)();
  } // The person accepts: the window closes and an assembly's ask answers
  // {accepted: true, reason: "close", value} (§19.4). A page button reaches it
  // with data-sf-action="<id>.confirm".


  confirm(params = {}) {
    if (!this.openState) return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_3__.refused)("closed");
    this._answer = {
      accepted: true,
      value: params?.value ?? null
    };
    return this.close({
      reason: "close"
    });
  } // Minimizes an open window (vocabulary §5 minimize; its old name is hide()).


  minimize() {
    if (!this.openState || this.display === "inline" || this.hiddenState) {
      return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_3__.refused)(this.openState ? "minimized" : "closed");
    }

    if (!this.emitModalEvent("minimize", {
      cancelable: true,
      phase: "before-hide"
    })) {
      return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_3__.refused)("prevented");
    }

    this._isHidden = true;
    this.setAttribute("minimized", "");
    this.requestComponentUpdate("hide");
    this.emitModalEvent("minimized", {
      phase: "after-hide"
    });
    return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_3__.applied)();
  } // Brings a minimized window back (its old name is show()).


  expand() {
    if (!this.openState || this.display === "inline" || !this.hiddenState) {
      return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_3__.refused)(this.openState ? "expanded" : "closed");
    }

    if (!this.emitModalEvent("expand", {
      cancelable: true,
      phase: "before-show"
    })) {
      return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_3__.refused)("prevented");
    }

    this._isHidden = false;
    this.removeAttribute("minimized");
    this.requestComponentUpdate("show");
    this.emitModalEvent("expanded", {
      phase: "after-show"
    });
    return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_3__.applied)();
  }

  syncMinimizedLayer() {
    if (!this._isMounted || !this.openState || this.display === "inline" || this._modalState === "closed" || this._modalState === "closing") {
      return;
    }

    const root = this._root();

    if (this.hiddenState) {
      const wasTop = SfModal.isTopModal(this);
      (0,_component_modal_js_stack__WEBPACK_IMPORTED_MODULE_15__.removeModalLayer)(this);
      this.applyStackPosition();
      (0,_component_modal_js_stack__WEBPACK_IMPORTED_MODULE_15__.restoreModalLayerFocus)(wasTop, this._lastActive, this._focusReturnAncestors);

      if (root) {
        root.inert = true;
        root.setAttribute("aria-hidden", "true");
      }
    } else {
      if (root) {
        root.inert = false;
        root.setAttribute("aria-hidden", "false");
      }

      (0,_component_modal_js_stack__WEBPACK_IMPORTED_MODULE_15__.addModalLayer)(this);
      SfModal.bringToFront(this);
      requestAnimationFrame(() => this.focusFirst());
    }
  }

  toggle() {
    return this.openState ? this.close() : this.open();
  }

  finishClose() {
    if (this.display !== "inline" && this._modalState !== "closing") {
      return this;
    }

    const wasTop = SfModal.isTopModal(this);
    this.cancelCloseTransition();
    this._isOpen = false;
    if (this.display === "inline") this._inlineClosed = true;
    this._isHidden = false;
    this._modalState = "closed";
    this.removeAttribute("minimized");
    this.syncOpenAttribute(false);

    const root = this._root();

    if (root) {
      root.inert = true;
      root.setAttribute("aria-hidden", "true");
    }

    this._releaseClosingContent?.();
    this._releaseClosingContent = null;

    if (this.display !== "inline") {
      SfModal.removeFromStack(this);
    }

    if (this.display !== "inline") {
      (0,_component_modal_js_stack__WEBPACK_IMPORTED_MODULE_15__.restoreModalLayerFocus)(wasTop, this._lastActive, this._focusReturnAncestors);
    }

    this._edited = false;
    this._discardAgreed = false;
    this._releaseSaving?.();
    this._releaseSaving = null;
    this._saving = false;
    this.requestComponentUpdate("after-close");
    const reason = this._closeReason || "api";
    this.emitModalEvent("closed", {
      phase: "after-close",
      reason,
      accepted: Boolean(this._answer?.accepted)
    });
    this.settleAsks(reason);
    this._answer = null;
    return this;
  }

  cancelCloseTransition() {
    if (this._closeTimer) {
      clearTimeout(this._closeTimer);
      this._closeTimer = null;
    }

    if (this._closeTransitionAbort) {
      this._closeTransitionAbort();

      this._closeTransitionAbort = null;
    }
  }

  setSrc(newSrc) {
    this.setAttribute("src", newSrc || "");
    this.resetRemoteContent();
    this.loadRemoteContentIfNeeded();
    return this;
  }

  reloadContent() {
    this.resetRemoteContent();
    this.loadRemoteContentIfNeeded(true);
    return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_3__.applied)();
  } // A reader retires (§4.4, §16.13): kept until its date, each call noted.


  getModalRoot() {
    noteRetired("action", "getModalRoot");
    return this._root();
  }

  afterRender() {
    this.bindRenderedEvents();
    this.bindSlotEventHandlers();

    if (this._modalState === "closing") {
      this._releaseClosingContent?.();
      this._releaseClosingContent = (0,_component_modal_js_closing__WEBPACK_IMPORTED_MODULE_10__.freezeModalContent)(this._root()?.querySelector("[data-sf-modal-panel]"), SfModal.isTopModal(this));
    }

    this._readyDetail = {
      component: this,
      modal: this,
      modalId: this.modalId,
      root: this._root()
    }; // Lifecycle copies retire (§4.1, §16.13): sf-after-render is the base's.
    // They are still sent until their date, and a listener that reads one is
    // noted.

    if (!this._hasEmittedReady) {
      this._hasEmittedReady = true;
      this.dispatchEvent(retiredEvent("modal:ready", this._readyDetail));
    } else {
      this.dispatchEvent(retiredEvent("modal:update", this._readyDetail));
    }

    if (this.hasAttribute("open") && !this._isOpen && this._modalState !== "closing") {
      // A window put into the page already open remembers what had focus --
      // the button that inserted it -- as open() does, so closing gives focus
      // back there and not to the nearest landmark. A window open in the
      // page's own markup has no opener.
      const active = document.activeElement;
      this._lastActive = active instanceof HTMLElement && active !== document.body && active !== document.documentElement && !this.contains(active) && !this._root()?.contains(active) ? active : null;
      this._focusReturnAncestors = (0,_component_modal_js_stack__WEBPACK_IMPORTED_MODULE_15__.captureModalFocusAncestors)(this._lastActive);
      this._isOpen = true;
      this._modalState = "open";

      if (this.display !== "inline") {
        SfModal.addToStack(this);
      }

      this.focusFirst();
      this.loadRemoteContentIfNeeded();
    }

    this.applyStackPosition();
    if (this.display !== "inline") this.watchBodyEdges(); // Projection can replace the panel while an existing layer remains open.

    (0,_component_modal_js_stack__WEBPACK_IMPORTED_MODULE_15__.updateModalLayers)(); // A closed window's content starts after the page's first paint, unseen:
    // the Loader leaves it until the window opens (its root is inert), and a
    // page that waited for a tag in it before opening the window waited for
    // ever (layer-stack.js startClosedLayerContent).

    if (this.display !== "inline" && !this.openState && !this._closedContentStarted) {
      this._closedContentStarted = true;
      (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_16__.startClosedLayerContent)(() => this._root());
    }

    if (this.autoload && !this.openState && !this._hasAutoloaded) {
      this._hasAutoloaded = true;
      requestAnimationFrame(() => this.open({
        animate: false
      }));
    }
  } // Escape and Tab reach the window through the document layer stack, and
  // only while it is the top layer (layer-stack.js).


  bindRenderedEvents() {
    const root = this._root();

    if (!root) {
      return;
    }

    root.removeEventListener("click", this.handleOverlayClick);
    root.addEventListener("click", this.handleOverlayClick);
    root.removeEventListener("pointerdown", this.handleSheetPointerDown);
    root.addEventListener("pointerdown", this.handleSheetPointerDown);
    this.noteEdgePosition();
  } // The old name of a side panel or a sheet (C157 (1)): written by the page,
  // not the phone's own sheet of a centred window (shownPosition).


  noteEdgePosition() {
    const position = this.getAttribute("position") || "";
    if (!EDGE_POSITIONS.includes(position)) return;
    (0,_core_js_deprecations__WEBPACK_IMPORTED_MODULE_4__.noteDeprecated)({
      component: "sf-modal",
      tag: "sf-modal",
      kind: "value",
      attribute: "position",
      from: position,
      to: position === "bottom" ? "sf-drawer placement=\"bottom\"" : "sf-drawer",
      since: "2026-11-14",
      remove_after: EDGE_POSITIONS_UNTIL
    });
  } // A window at the bottom is the one sheet (owner decision C157 (5)): a
  // swipe down from its handle row closes it as the x does -- a window with
  // changed fields asks first (C159 (6)), a saving one waits.


  handleSheetPointerDown(event) {
    if (event.button !== 0 || !this._isOpen || this.shownPosition !== "bottom" || this.shownFullscreen) return;

    const root = this._root();

    const surface = root?.querySelector("[data-sf-modal-surface]");
    const panel = root?.querySelector("[data-sf-modal-panel]");
    if (!surface || !panel || !surface.contains(event.target) || (0,_core_js_sheet_swipe__WEBPACK_IMPORTED_MODULE_17__.startsOnControl)(event.target)) return;
    if (!(0,_core_js_sheet_swipe__WEBPACK_IMPORTED_MODULE_17__.inHandleRow)(event, surface)) return;
    (0,_core_js_sheet_swipe__WEBPACK_IMPORTED_MODULE_17__.trackSwipe)(event, {
      surface: panel,
      direction: "down",
      variable: "--sf-sheet--drag",
      onEnd: ({
        dismiss
      }) => {
        if (dismiss && this.dismissible) this.close({
          reason: "close"
        });
      }
    });
  }

  bindSlotEventHandlers() {
    const root = this._root();

    if (!root || !this._slotEventHandlers.size) {
      return;
    }

    this._slotEventHandlers.forEach((handlers, id) => {
      const node = root.querySelector(`[data-sf-runtime-event-id="${id}"]`);

      if (!node) {
        return;
      }

      handlers.forEach(({
        eventName,
        handler
      }) => {
        node.addEventListener(eventName, handler);
      });
    });
  }

  handleOverlayClick(event) {
    const isOverlay = event.target === this._root()?.querySelector("[data-sf-modal-overlay]"); // A press outside is the top layer's only.
    // A window with fields never closes on its scrim (C159 (6)).

    if (isOverlay && this.closeOnOverlay && this.dismissible && !this.hasFields && SfModal.isTopModal(this)) {
      this.close({
        reason: "outside"
      });
    }
  }

  handleCloseClick(event) {
    event.preventDefault();

    if (this.dismissible) {
      this.close({
        reason: "close"
      });
    }
  }

  handleHideClick(event) {
    event.preventDefault();
    this.minimize();
  } // The layer stack hands the window Escape and Tab while it is the top layer
  // -- above a drawer it was opened from, below a list or a drawer opened from
  // it. Answers true when it took Escape; the stack then stops the press.


  onKeyDown(event) {
    if (!this.openState && this._modalState !== "closing" || this.display === "inline") {
      return false;
    }

    if (!SfModal.isTopModal(this)) {
      return false;
    }

    if (this.hiddenState) {
      return false;
    }

    if (event.key === "Escape" && this.closeOnEsc && this.dismissible && this._modalState !== "closing" && !event.defaultPrevented) {
      this.close({
        reason: "escape"
      });
      return true;
    }

    if (event.key === "Tab") {
      this.trapFocus(event);
    }

    return false;
  }

  trapFocus(event) {
    if (!SfModal.isTopModal(this)) {
      return;
    }

    if (this.hiddenState) {
      return;
    }

    const panel = this._root()?.querySelector("[data-sf-modal-panel]");
    (0,_component_modal_js_focus__WEBPACK_IMPORTED_MODULE_9__.trapModalFocus)(panel, event);
  }

  focusFirst() {
    if (this.display === "inline") {
      return;
    }

    if (this.display !== "inline" && !SfModal.isTopModal(this)) {
      return;
    }

    if (this.hiddenState) {
      return;
    } // By initial-focus (decisions C25, C39): the page's [autofocus], else in
    // a question window its safe answer («Отмена»), else the panel; or the
    // safe answer, the first control or the panel when the page names one.


    const panel = this._root()?.querySelector("[data-sf-modal-panel]");

    if (panel) {
      (0,_component_modal_js_focus__WEBPACK_IMPORTED_MODULE_9__.focusModalInitial)(panel, this.initialFocus);
    }
  }

  resetRemoteContent() {
    this._remoteHtml = "";
    this._remoteError = "";
    this._remoteLoaded = false;
    this._isLoadingRemote = false;
    this.abortRemoteContent();
  }

  abortRemoteContent() {
    if (this._fetchController) {
      this._fetchController.abort();

      this._fetchController = null;
    }
  }

  loadRemoteContentIfNeeded(force = false) {
    if (!this.src || this.mode !== "ajax" && this.mode !== "iframe") {
      return;
    }

    if (!this.preload && !this.openState && !force) {
      return;
    }

    if (this.mode === "iframe") {
      this._remoteLoaded = true;
      this.requestComponentUpdate("remote-content");
      return;
    }

    if (this._remoteLoaded && !force) {
      return;
    }

    void this.loadAjaxContent();
  }

  async loadAjaxContent() {
    this.abortRemoteContent();
    this._isLoadingRemote = true;
    this._remoteError = "";
    let aborted = false;
    this.requestComponentUpdate("remote-loading");
    this.emitContentEvent("content-upload");
    const controller = new AbortController();
    this._fetchController = controller;

    try {
      if (this.src.startsWith("#")) {
        const source = document.querySelector(this.src);

        if (!source) {
          throw new Error(`Element not found: ${this.src}`);
        }

        this._remoteHtml = source.innerHTML;
      } else {
        const response = await fetch(this.src, {
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        this._remoteHtml = await response.text();
      }

      this._remoteLoaded = true;
    } catch (error) {
      if (error.name === "AbortError") {
        aborted = true;
      } else {
        this._remoteError = error.message || this.sfWord("load-failed");
      }
    } finally {
      // A load aborted by a newer one leaves the state to it: clearing it here
      // took the loading state down while the newer load was still waiting.
      const superseded = aborted && this._fetchController && this._fetchController !== controller;

      if (!superseded) {
        this._fetchController = null;
        this._isLoadingRemote = false;
        this.requestComponentUpdate("remote-content");

        if (!aborted) {
          this.emitContentEvent("content-uploaded");
        }
      }
    }
  }

  handleIframeLoad = () => {
    this._remoteLoaded = true;
    this.emitContentEvent("content-uploaded");
  };
  handleIframeError = () => {
    this._remoteError = this.sfWord("frame-failed");
    this.requestComponentUpdate("remote-content");
  }; // The content events are the component's own verbs (lang events.*.label).

  emitContentEvent(verb) {
    this.sfEmit(verb, {
      modalId: this.modalId,
      src: this.src,
      remote: this.state.remote
    });
  } // Sends one of the window's events by its verb (§8): the new name
  // (sf-modal-<verb>) first, then its old modal:* name with the old detail
  // through the alias table. Data only in detail; answers false when a
  // listener refused a cancelable one.


  emitModalEvent(verb, {
    cancelable = false,
    ...detail
  } = {}) {
    return this.sfEmit(verb, {
      modalId: this.modalId,
      ...detail
    }, {
      cancelable
    });
  }

  syncOpenAttribute(isOpen) {
    this._syncingOpenAttribute = true;

    if (isOpen) {
      this.setAttribute("open", "");
    } else {
      this.removeAttribute("open");
    }

    this._syncingOpenAttribute = false;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (this._syncingOpenAttribute && name === "open") {
      return;
    }

    if (name === "open" && oldValue !== newValue) {
      if (!this._isMounted) {
        super.attributeChangedCallback(name, oldValue, newValue);
        return;
      }

      if (newValue === null) {
        this.close(); // close() may be a no-op before an asynchronous render is committed.
        // Removing the attribute still invalidates the pending open snapshot.

        this.requestComponentUpdate("open-attribute");
      } else {
        this.open();
      }

      return;
    }

    if (["src", "mode", "preload"].includes(name) && oldValue !== newValue) {
      this.resetRemoteContent();
    }

    if (name === "minimized" && oldValue !== newValue) {
      this._isHidden = newValue !== null;
      this.syncMinimizedLayer();
    }

    super.attributeChangedCallback(name, oldValue, newValue);
  }

  teardownModal() {
    const wasTop = SfModal.isTopModal(this);
    this._discardQuestion?.remove();
    this._discardQuestion = null;
    this._edgesObserver?.disconnect();
    this._savingObserver?.disconnect();
    this._fieldsTarget = null;
    this._edgesBody = null;
    this.abortRemoteContent();
    this.cancelCloseTransition();

    if (this.display !== "inline") {
      SfModal.removeFromStack(this);
    }

    this._isOpen = false;
    this._modalState = "closed";
    this.clearPortal(); // An inline window draws in the element itself; its nodes are there.

    if (this.display !== "inline") this.returnSlotNodes();
    this._releaseClosingContent?.();
    this._releaseClosingContent = null;
    (0,_component_modal_js_stack__WEBPACK_IMPORTED_MODULE_15__.restoreModalLayerFocus)(wasTop, this._lastActive, this._focusReturnAncestors);
  }

  clearPortal() {
    if (!this._portalRoot) {
      return;
    }

    (0,lit__WEBPACK_IMPORTED_MODULE_0__.render)(lit__WEBPACK_IMPORTED_MODULE_0__.nothing, this._portalRoot);

    this._portalRoot.remove();

    this._portalRoot = null;
  } // Modal events bubble like the base modal component and sf-drawer; the on*
  // helpers keep their meaning and receive only this modal's own events, by
  // their new names (§8).


  ownModalHandler(handler) {
    return event => {
      if (event.target === this) handler.call(this, event);
    };
  }

  onModalEvent(verb, handler, options) {
    if (typeof handler === "function") {
      this.addEventListener(this.sfEventName(verb), this.ownModalHandler(handler), options);
    }

    return this;
  }

  onBeforeOpen(handler, options) {
    return this.onModalEvent("open", handler, options);
  }

  onAfterOpen(handler, options) {
    return this.onModalEvent("opened", handler, options);
  }

  onBeforeClose(handler, options) {
    return this.onModalEvent("close", handler, options);
  }

  onAfterClose(handler, options) {
    return this.onModalEvent("closed", handler, options);
  }

  onBeforeHide(handler, options) {
    return this.onModalEvent("minimize", handler, options);
  }

  onAfterHide(handler, options) {
    return this.onModalEvent("minimized", handler, options);
  }

  onBeforeShow(handler, options) {
    return this.onModalEvent("expand", handler, options);
  }

  onAfterShow(handler, options) {
    return this.onModalEvent("expanded", handler, options);
  }

  onModalReady(handler, options) {
    if (typeof handler !== "function") {
      return this;
    }

    if (this._readyDetail) {
      handler(retiredEvent("modal:ready", this._readyDetail));
      return this;
    }

    this.addEventListener("modal:ready", this.ownModalHandler(handler), options);
    return this;
  }

  onModalUpdate(handler, options) {
    if (typeof handler === "function") {
      this.addEventListener("modal:update", this.ownModalHandler(handler), options);
    }

    return this;
  }

  static bindGlobalEvents() {
    if (SfModal.globalBound || typeof document === "undefined") {
      return;
    } // The window's own page triggers, aliases of data-sf-action (§8, §16.10):
    // data-sf-modal-open="<modal id>" is data-sf-action="<id>.open", and so on.


    document.addEventListener("click", event => {
      const openEl = event.target.closest("[data-sf-modal-open]");

      if (openEl) {
        SfModal.registry.get(openEl.getAttribute("data-sf-modal-open"))?.open();
        return;
      }

      const showEl = event.target.closest("[data-sf-modal-show]");

      if (showEl) {
        SfModal.registry.get(showEl.getAttribute("data-sf-modal-show"))?.expand();
        return;
      }

      const hideEl = event.target.closest("[data-sf-modal-hide]");

      if (hideEl) {
        SfModal.registry.get(hideEl.getAttribute("data-sf-modal-hide"))?.minimize();
        return;
      }

      const closeEl = event.target.closest("[data-sf-modal-close]");

      if (!closeEl) {
        return;
      }

      const id = closeEl.getAttribute("data-sf-modal-close") || closeEl.closest(".sf-modal")?.getAttribute("data-sf-modal-id"); // The window's own close button closed it already, as `close`; a page
      // control that closes it is a cancel -- unless it is the window's main
      // answer, which does not ask about unsaved changes (C159 (6)).

      const modal = SfModal.registry.get(id);
      const main = modal?.mainAnswer?.();
      if (modal && main && (main === closeEl || main.contains(closeEl) || closeEl.contains(main))) modal._mainPressed = true;
      modal?.close({
        reason: "cancelled"
      });
    });
    SfModal.globalBound = true;
  } // Kept for code that calls them: the layer stack takes the page lock itself
  // now, with its default lockPageScroll, while any layer that locks is open.


  static lockPage(preserveScrollGap = true) {
    if (!SfModal.lockState) SfModal.lockState = (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_16__.lockPageScroll)({
      preserveScrollGap
    });
  }

  static unlockPage() {
    SfModal.lockState?.();
    SfModal.lockState = null;
  }

}

SfModal.define("sf-modal");
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "e45eac6c719d"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderModalTemplate: () => (/* binding */ renderModalTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);


function joinClasses(...parts) {
  return parts.filter(Boolean).join(' ').trim();
}

function overlayClasses(context) {
  const blurClass = context.blur ? `backdrop-blur-${context.blurType}` : context.overlayPreset === 'focus' ? 'backdrop-blur-small' : '';
  return joinClasses(`sf-modal-overlay--${context.overlayPreset}`, blurClass);
}

function renderModalTemplate(context) {
  const isInline = context.display === 'inline'; // The window's size by name (decision C159 (1)): question (its own frame
  // and title too, C39), form -- the default -- wide, full; see
  // component/modal/scss/_css__modal_custom.scss.

  const size = ['question', 'form', 'wide', 'full'].includes(context.size) ? context.size : 'form';
  const isQuestion = size === 'question';
  const hasRemoteContent = Boolean(context.src) && (context.mode === 'ajax' || context.mode === 'iframe');
  const showHeader = context.showHeader !== false;
  const hasHeaderSlot = context.hasHeaderContent; // A path id (standard 1.3.8 §7.1.1), not the modal id: two windows with
  // one modal-id, or a page id equal to it, gave two elements one id (#41).

  const titleId = context.titleId || `${context.modalId}-title`;
  const accessibleLabel = context.ariaLabel || (hasHeaderSlot || !showHeader ? context.title : '');
  const hasContentSlot = context.hasContentContent;
  const hasFooterSlot = context.hasFooterContent && context.showFooter;
  const panelStyle = [context.width ? `--sf-modal-width:${context.width}` : '', context.height ? `--sf-modal-height:${context.height}` : ''].filter(Boolean).join(';');
  const surfaceStyle = [context.surfacePadding ? `--sf-modal-surface-padding:${context.surfacePadding}` : ''].filter(Boolean).join(';');
  const modalStyle = [context.modalZIndex ? `z-index:${context.modalZIndex}` : ''].filter(Boolean).join(';');
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div
                id=${context.rootId || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                class=${joinClasses('sf-modal', `sf-modal--position-${context.position}`, // Legacy alias: the misspelt class the modal wrote before;
  // kept until contracts/changes/journal.json removes it.
  `sf-modal--positon-${context.position}`, `sf-modal--size-${size}`, isInline ? 'sf-modal--inline inline-block w-full' : 'fixed top-0 inline-start-0 w-full h-full z-9 p-3 items-cross-center content-main-center', context.open ? 'flex' : 'hidden', !isInline && context.animate && 'animate', context.rootClass)}
                style=${modalStyle}
                role=${isInline ? 'region' : 'dialog'}
                aria-modal=${isInline || context.minimized ? 'false' : 'true'}
                aria-hidden=${context.open && !context.minimized ? 'false' : 'true'}
                ?inert=${!context.open || context.minimized}
                aria-label=${accessibleLabel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                aria-labelledby=${accessibleLabel ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : titleId}
                data-sf-modal-id=${context.modalId}
                data-sf-modal-position=${context.position}
                data-sf-modal-size=${size}
                data-sf-modal-fullscreen=${String(context.fullscreen)}
                data-sf-modal-display=${context.display}
                data-sf-modal-state=${isInline ? 'inline' : context.modalState}
                data-sf-modal-hidden=${String(context.minimized)}
                data-sf-modal-overlay-preset=${context.overlayPreset}
        >
            <div
                    class=${joinClasses('absolute top-0 inline-start-0 w-full h-full', overlayClasses(context), context.overlayClass, (!context.overlay || isInline) && 'hidden')}
                    data-sf-modal-overlay
                    data-sf-modal-overlay-preset=${context.overlayPreset}
            ></div>

            <section
                    class=${joinClasses('relative overflow-visible', context.panelClass)}
                    style=${panelStyle}
                    data-sf-modal-panel
                    ?data-sf-modal-has-width=${Boolean(context.width)}
                    ?data-sf-modal-has-height=${Boolean(context.height)}
                    tabindex="-1"
            >
                <div
                        class=${joinClasses('sf-modal-surface flex flex-col', !isInline && 'sf-modal-surface--elevated', context.surfaceClass)}
                        style=${surfaceStyle}
                        ?data-sf-modal-own-padding=${Boolean(context.surfacePadding)}
                        data-sf-modal-surface
                >
                    ${showHeader ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                                <header
                                        class=${joinClasses('sf-modal-header flex items-start min-w-0', context.headerClass)}
                                >
                                    <div class="sf-modal-header-content">${hasHeaderSlot ? context.headerContent : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<h2 id=${titleId} class="sf-modal-title m-0">${context.title}</h2>`}</div>
                                    ${context.hide && !isInline ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                                                <button
                                                        type="button"
                                                        class=${joinClasses('sf-icon-button sf-icon-button--icon sf-modal-header-action sf-modal-hide-button sf-modal-hide-button--inline-end sf-icon-button--ghost sf-icon-button--on-surface sf-icon-button--size-1/3 m-0', context.hideModifier)}
                                                        aria-label=${context.minimizeText}
                                                        data-sf-modal-hide=${context.modalId}
                                                        @click=${context.onHideClick}
                                                >
                                                    <span class="sf-modal-hide-icon" aria-hidden="true"></span>
                                                </button>
                                            ` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                                    ${context.showClose ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                                                <sf-button-close
                                                        size="1/3"
                                                        class="sf-modal-close"
                                                        root-class=${joinClasses('sf-modal-header-action sf-modal-close-button sf-modal-close-button--inline-end m-0', context.closeClass)}
                                                        aria-label=${context.closeText}
                                                        data-sf-modal-close=${context.modalId}
                                                        @click=${context.onCloseClick}
                                                ></sf-button-close>
                                            ` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                                </header>
                            ` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}

                    <div
                            class="sf-modal-body flex flex-col gap-1 min-w-0 overflow-visible"
                            data-sf-modal-body
                    >
                        <div
                                class="sf-modal-body-viewport min-w-0 overflow-visible"
                                data-sf-modal-body-viewport
                        >
                            <div
                                    class=${joinClasses('sf-modal-body-scroll h-full min-w-0 overflow-y-auto flex flex-col gap-1', context.bodyClass)}
                                    data-sf-modal-body-scroll
                            >
                                ${hasRemoteContent ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                                            <div
                                                    class="sf-modal-content-placeholder flex flex-col gap-2 min-h-8 items-cross-center content-main-center"
                                                    data-sf-modal-content-placeholder
                                            >
                                                ${context.remoteContent}
                                            </div>
                                        ` : hasContentSlot ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                                                    <div
                                                            class=${joinClasses('sf-modal-content flex flex-col gap-2', context.contentClass)}
                                                    >
                                                        ${context.contentContent}
                                                    </div>
                                                ` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<p class="m-0 text-2">${context.text}</p>`}
                            </div>
                        </div>

                        ${hasFooterSlot ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                                    <div
                                            class=${joinClasses('sf-modal-footer flex flex-wrap', context.footerClass)}
                                    >
                                        ${context.footerContent}
                                    </div>
                                ` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    </div>
                </div>
            </section>
        </div>
    `;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "d3818183b14c"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("deprecations", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("deprecations", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "5b7d7695b41b"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("element-manifest", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("element-manifest", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "e92fd2d1a38c"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("instance-path", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("instance-path", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "18003344cff0"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("layer-stack", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("layer-stack", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "073f05ff1a81"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit/directives/unsafe-html.js", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("lit/directives/unsafe-html.js", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "2a080a730149"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("lit", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "deb1a4d61565"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("smart-base", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("smart-base", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "95d01a7df79b"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   files: () => (/* binding */ files)
/* harmony export */ });
/* harmony import */ var _en_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("66be591d2d06");
// Written by scripts/build-language-packs.mjs from src/core/lang/built-in.json
// (owner decision C282); do not edit. The words this bundle carries: the
// built-in languages' (en); every other language comes from
// a language file (core/lang/<code>.js or its parts).


const files = { en: { runtime: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime } };

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ en: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime });


/***/ },

/***/ "85cdf307b188"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-modal for the shim (core/js/aliases.js, standard §16 item 20). mode: same-detail (the shim sends the new and the old name), split (the old detail from the element\'s adapter), attribute-and-property, host-attribute (no shim), inverted (read by the component), retired (no new name; kept and noted by the component until the date).","component":"sf-modal","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"title","to":"heading","kind":"setting","component":"sf-modal","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","section":"§3.1, §16 item 26"},{"from":"blur","to":"backdrop-blur","kind":"setting","component":"sf-modal","since":"2026-10-27","remove_after":"2026-12-01","section":"§3.1, §4.1, §16 item 26","note":"blur is a method of HTMLElement and the base action; the attribute is mapped, the property stays the browser\'s"},{"from":"hide","to":"minimizable","kind":"attribute","component":"sf-modal","since":"2026-10-27","remove_after":"2026-12-01","section":"§3.1","note":"the attribute only: the property name hide is the old method, an action alias of minimize"},{"from":"unclose","to":"dismissible","kind":"attribute","component":"sf-modal","since":"2026-10-27","remove_after":"2026-12-01","mode":"inverted","section":"§19.3","note":"inverted: unclose present means dismissible false; the shim maps values one to one, so it refuses this row (mode-on-non-event) and sf-modal reads the attribute itself, noting it with these dates"},{"from":"aria-label","to":null,"kind":"attribute","component":"sf-modal","since":"2026-10-27","remove_after":"2026-12-01","mode":"host-attribute","section":"§3.1","note":"stays a host attribute, read by the base (§3.1, §4.8); no shim"},{"from":"modal:before-open","to":"sf-modal-open","kind":"event","component":"sf-modal","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":true,"section":"§8, vocabulary §5, §9","note":"the old detail adds component, modal and root (page elements, which §8 takes out of the new detail): the element\'s detail adapter makes it"},{"from":"modal:after-open","to":"sf-modal-opened","kind":"event","component":"sf-modal","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":false,"section":"§8, vocabulary §5, §9","note":"the old detail adds component, modal and root (page elements, which §8 takes out of the new detail): the element\'s detail adapter makes it"},{"from":"modal:before-close","to":"sf-modal-close","kind":"event","component":"sf-modal","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":true,"section":"§8, vocabulary §5, §9","note":"the old detail adds component, modal and root (page elements, which §8 takes out of the new detail): the element\'s detail adapter makes it"},{"from":"modal:after-close","to":"sf-modal-closed","kind":"event","component":"sf-modal","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":false,"section":"§8, vocabulary §5, §9","note":"the old detail adds component, modal and root (page elements, which §8 takes out of the new detail): the element\'s detail adapter makes it"},{"from":"modal:before-hide","to":"sf-modal-minimize","kind":"event","component":"sf-modal","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":true,"section":"§8, vocabulary §5, §9","note":"the old detail adds component, modal and root (page elements, which §8 takes out of the new detail): the element\'s detail adapter makes it"},{"from":"modal:after-hide","to":"sf-modal-minimized","kind":"event","component":"sf-modal","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":false,"section":"§8, vocabulary §5, §9","note":"the old detail adds component, modal and root (page elements, which §8 takes out of the new detail): the element\'s detail adapter makes it"},{"from":"modal:before-show","to":"sf-modal-expand","kind":"event","component":"sf-modal","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":true,"section":"§8, vocabulary §5, §9","note":"the old detail adds component, modal and root (page elements, which §8 takes out of the new detail): the element\'s detail adapter makes it"},{"from":"modal:after-show","to":"sf-modal-expanded","kind":"event","component":"sf-modal","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":false,"section":"§8, vocabulary §5, §9","note":"the old detail adds component, modal and root (page elements, which §8 takes out of the new detail): the element\'s detail adapter makes it"},{"from":"modal:before-content-upload","to":"sf-modal-content-upload","kind":"event","component":"sf-modal","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":false,"section":"§8, vocabulary §5, §9","note":"the old detail adds component, modal and root (page elements, which §8 takes out of the new detail): the element\'s detail adapter makes it"},{"from":"modal:after-content-upload","to":"sf-modal-content-uploaded","kind":"event","component":"sf-modal","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":false,"section":"§8, vocabulary §5, §9","note":"the old detail adds component, modal and root (page elements, which §8 takes out of the new detail): the element\'s detail adapter makes it"},{"from":"hide","to":"minimize","kind":"action","component":"sf-modal","since":"2026-10-27","remove_after":"2026-12-01","section":"vocabulary §5 minimize"},{"from":"show","to":"expand","kind":"action","component":"sf-modal","since":"2026-10-27","remove_after":"2026-12-01","section":"vocabulary §5 expand"},{"from":"getModalRoot","to":null,"kind":"action","component":"sf-modal","since":"2026-10-27","remove_after":"2026-12-01","mode":"retired","section":"§4.4, §16.13","note":"a reader retires; the method stays until the date and notes each call"},{"from":"getSlotHtml","to":null,"kind":"action","component":"sf-modal","since":"2026-10-27","remove_after":"2026-12-01","mode":"retired","section":"§4.4, §4.5, §16.13","note":"a reader retires; slots are placed, never copied; the method stays until the date and notes each call"},{"from":"modal:ready","to":null,"kind":"event","component":"sf-modal","since":"2026-10-27","remove_after":"2026-12-01","mode":"retired","section":"§4.1, §16.13","note":"a lifecycle copy; sf-after-render is the base\'s; still sent until the date, noted when a listener reads it"},{"from":"modal:update","to":null,"kind":"event","component":"sf-modal","since":"2026-10-27","remove_after":"2026-12-01","mode":"retired","section":"§4.1, §16.13","note":"a lifecycle copy; sf-after-render is the base\'s; still sent until the date, noted when a listener reads it"}]}');

/***/ },

/***/ "afc57055d2cc"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.modal","tag":"sf-modal","version":"1.11.1","kind":"leaf","settings":{"modal-id":{"type":"id","default":""},"heading":{"type":"string","default-from":"runtime.title"},"text":{"type":"string","default":""},"autoload":{"type":"boolean","default":false},"minimizable":{"type":"boolean","default":false},"hide-modifier":{"type":"string","default":""},"overlay":{"type":"boolean","default":true},"show-header":{"type":"boolean","default":true},"show-close":{"type":"boolean","default":true},"show-footer":{"type":"boolean","default":true},"close-on-esc":{"type":"boolean","default":true},"close-on-overlay":{"type":"boolean","default":true},"initial-focus":{"type":"enum","values":["auto","safe","first","panel"],"default":"auto"},"preserve-scroll-gap":{"type":"boolean","default":true},"position":{"type":"enum","values":["center","left","right","inline-start","inline-end","top","bottom"],"default":"center"},"size":{"type":"enum","values":["form","question","wide","full","auto"],"default":"form","x-scale":"width"},"mode":{"type":"enum","values":["inline","ajax","iframe"],"default":"inline"},"display":{"type":"enum","values":["modal","inline"],"default":"modal"},"src":{"type":"string","default":""},"preload":{"type":"boolean","default":true},"fullscreen":{"type":"boolean","default":false},"width":{"type":"string","default":""},"height":{"type":"string","default":""},"backdrop-blur":{"type":"string","default":""},"blur-type":{"type":"enum","values":["none","small","medium","large"],"default":"medium"},"overlay-preset":{"type":"enum","values":["default","focus"],"default":"default"},"overlay-class":{"type":"string","default":""},"close-class":{"type":"string","default":""},"surface-class":{"type":"string","default":""},"surface-padding":{"type":"string","default":""},"panel-class":{"type":"string","default":""},"header-class":{"type":"string","default":""},"body-class":{"type":"string","default":""},"content-class":{"type":"string","default":""},"footer-class":{"type":"string","default":""},"unsaved":{"type":"boolean","default":false},"dismissible":{"type":"boolean","default":true}},"values":{"open":{"type":"boolean","default":false,"reflect":true},"minimized":{"type":"boolean","default":false,"reflect":true}},"events":{"open":{"carries":{"modal-id":"string","phase":"string"},"cancelable":true},"opened":{"carries":{"modal-id":"string","phase":"string"}},"close":{"carries":{"modal-id":"string","phase":"string","reason":{"type":"enum","values":["close","escape","outside","cancelled","api"]},"unsaved":"boolean"},"cancelable":true},"closed":{"carries":{"modal-id":"string","phase":"string","reason":{"type":"enum","values":["close","escape","outside","cancelled","api"]},"accepted":"boolean"}},"minimize":{"carries":{"modal-id":"string","phase":"string"},"cancelable":true},"minimized":{"carries":{"modal-id":"string","phase":"string"}},"expand":{"carries":{"modal-id":"string","phase":"string"},"cancelable":true},"expanded":{"carries":{"modal-id":"string","phase":"string"}},"content-upload":{"carries":{"modal-id":"string","src":"string","remote":"object"},"own-verb":true},"content-uploaded":{"carries":{"modal-id":"string","src":"string","remote":"object"},"own-verb":true}},"actions":{"open":{"with":{"animate":{"type":"boolean","optional":true}},"emits":"open","x-answer":"asked by an assembly (ask, §19.4) it answers when the window closes, with value {accepted, reason, value}"},"close":{"with":{"reason":{"type":"enum","values":["close","escape","outside","cancelled","api"],"optional":true}},"emits":"close"},"minimize":{"emits":"minimize"},"expand":{"emits":"expand"},"toggle":{},"reload-content":{},"confirm":{"with":{"value":{"type":"object","optional":true}}}},"layer":{"kind":"modal","locks-page":true,"traps-focus":true},"css-variables":{"--sf-modal-background-color":{"type":"color","state":"default"},"--sf-modal-border-color":{"type":"color","state":"default"},"--sf-modal-border-width":{"type":"length","state":"default"},"--sf-modal-radius":{"type":"length","state":"default"},"--sf-modal-padding-inline":{"type":"length","state":"default"},"--sf-modal-padding-block":{"type":"length","state":"default"},"--sf-modal-gap":{"type":"length","state":"default"},"--sf-modal-footer-gap":{"type":"length","state":"default"},"--sf-modal-question-width":{"type":"length","state":"default"}}}');

/***/ },

/***/ "66be591d2d06"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Modal","runtime":{"close":"Close","discard":"Don\'t save","discard-heading":"Close without saving?","frame-failed":"Failed to load iframe content","keep-editing":"Keep editing","load-failed":"Failed to load content","loading":"Loading…","minimize":"Minimize","title":"Dialog"},"events":{"content-upload":{"label":"Load content"},"content-uploaded":{"label":"Content loaded"}}}');

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	const __webpack_module_cache__ = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		const cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		const module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			const e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/************************************************************************/
/******/ 	/* webpack/runtime/async module */
/******/ 	(() => {
/******/ 		const hasSymbol = typeof Symbol === "function";
/******/ 		const webpackQueues = hasSymbol ? Symbol("webpack queues") : "__webpack_queues__";
/******/ 		const webpackExports = hasSymbol ? Symbol("webpack exports") : "__webpack_exports__";
/******/ 		const webpackError = hasSymbol ? Symbol("webpack error") : "__webpack_error__";
/******/
/******/ 		const resolveQueue = (queue) => {
/******/ 			if(queue?.d < 1) {
/******/ 				queue.d = 1;
/******/ 				queue.forEach((fn) => (fn.r--));
/******/ 				queue.forEach((fn) => (fn.r-- ? fn.r++ : fn()));
/******/ 			}
/******/ 		}
/******/ 		const wrapDeps = (deps) => (deps.map((dep) => {
/******/ 			if(dep !== null && typeof dep === "object") {
/******/
/******/ 				if(dep[webpackQueues]) return dep;
/******/ 				if(dep.then) {
/******/ 					const queue = [];
/******/ 					queue.d = 0;
/******/ 					dep.then((r) => {
/******/ 						obj[webpackExports] = r;
/******/ 						resolveQueue(queue);
/******/ 					}, (e) => {
/******/ 						obj[webpackError] = e;
/******/ 						resolveQueue(queue);
/******/ 					});
/******/ 					const obj = {};
/******/
/******/ 					obj[webpackQueues] = (fn) => (fn(queue));
/******/ 					return obj;
/******/ 				}
/******/ 			}
/******/ 			const ret = {};
/******/ 			ret[webpackQueues] = x => {};
/******/ 			ret[webpackExports] = dep;
/******/ 			return ret;
/******/ 		}));
/******/ 		__webpack_require__.a = (module, body, hasAwait) => {
/******/ 			let queue;
/******/ 			hasAwait && ((queue = []).d = -1);
/******/ 			const depQueues = new Set();
/******/ 			const exports = module.exports;
/******/ 			let currentDeps;
/******/ 			let outerResolve;
/******/ 			let reject;
/******/ 			const promise = new Promise((resolve, rej) => {
/******/ 				reject = rej;
/******/ 				outerResolve = resolve;
/******/ 			});
/******/ 			promise[webpackExports] = exports;
/******/ 			promise[webpackQueues] = (fn) => (queue && fn(queue), depQueues.forEach(fn), promise["catch"](x => {}));
/******/ 			module.exports = promise;
/******/ 			const handle = (deps) => {
/******/ 				currentDeps = wrapDeps(deps);
/******/ 				let fn;
/******/ 				const getResult = () => (currentDeps.map((d) => {
/******/
/******/ 					if(d[webpackError]) throw d[webpackError];
/******/ 					return d[webpackExports];
/******/ 				}))
/******/ 				const promise = new Promise((resolve) => {
/******/ 					fn = () => (resolve(getResult));
/******/ 					fn.r = 0;
/******/ 					const fnQueue = (q) => (q !== queue && !depQueues.has(q) && (depQueues.add(q), q && !q.d && (fn.r++, q.push(fn))));
/******/ 					currentDeps.map((dep) => (dep[webpackQueues](fnQueue)));
/******/ 				});
/******/ 				return fn.r ? promise : getResult();
/******/ 			}
/******/ 			const done = (err) => ((err ? reject(promise[webpackError] = err) : outerResolve(exports)), resolveQueue(queue))
/******/ 			body(handle, done);
/******/ 			queue?.d < 0 && (queue.d = 0);
/******/ 		};
/******/ 	})();
/******/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			const getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter/value functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			if(Array.isArray(definition)) {
/******/ 				var i = 0;
/******/ 				while(i < definition.length) {
/******/ 					var key = definition[i++];
/******/ 					var binding = definition[i++];
/******/ 					if(!__webpack_require__.o(exports, key)) {
/******/ 						if(binding === 0) {
/******/ 							Object.defineProperty(exports, key, { enumerable: true, value: definition[i++] });
/******/ 						} else {
/******/ 							Object.defineProperty(exports, key, { enumerable: true, get: binding });
/******/ 						}
/******/ 					} else if(binding === 0) { i++; }
/******/ 				}
/******/ 			} else {
/******/ 				for(var key in definition) {
/******/ 					if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 						Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/
/************************************************************************/
/******/
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module used 'module' so it can't be inlined
/******/ 	let __webpack_exports__ = __webpack_require__("f98b7a216869");
/******/
/******/ })()
;