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
/* harmony export */   getModalTabStops: () => (/* binding */ getModalTabStops),
/* harmony export */   syncModalFocusGuards: () => (/* binding */ syncModalFocusGuards),
/* harmony export */   trapModalFocus: () => (/* binding */ trapModalFocus)
/* harmony export */ });
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

function scheduleModalClose(getRoot, finalize, view = window) {
  let timer = null,
      cancelled = false;
  const cancelFrame = scheduleModalFrame(() => {
    if (cancelled) return;
    const root = getRoot();
    const nodes = root?.querySelectorAll('[data-sf-modal-panel], [data-sf-modal-overlay]') || [];
    const duration = Math.max(0, ...Array.from(nodes, node => {
      const style = view.getComputedStyle(node);
      return style.display === 'none' ? 0 : modalTransitionDuration(style);
    }));
    timer = view.setTimeout(() => {
      if (!cancelled) finalize();
    }, duration);
  }, view);
  return () => {
    cancelled = true;
    cancelFrame();
    if (timer !== null) view.clearTimeout(timer);
  };
}

/***/ },

/***/ "ed3ae3576d0a"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   lockModalScroll: () => (/* binding */ lockModalScroll),
/* harmony export */   unlockModalScroll: () => (/* binding */ unlockModalScroll)
/* harmony export */ });
// One lease is held by the first visible layer in the shared Modal stack.
// Restore only changes that this lease owns, not pre-existing page styling.
function lockModalScroll(preserveScrollGap = true) {
  const docEl = document.documentElement;
  const body = document.body;
  if (!docEl || !body) return null;
  const gap = Math.max(0, window.innerWidth - docEl.clientWidth);
  const padding = parseFloat(window.getComputedStyle(body).paddingInlineEnd) || 0;
  const saved = {
    docEl,
    body,
    htmlLocked: docEl.classList.contains('overflow-hidden'),
    bodyLocked: body.classList.contains('overflow-hidden'),
    bodyPaddingInlineEnd: body.style.getPropertyValue('padding-inline-end'),
    paddingPriority: body.style.getPropertyPriority('padding-inline-end'),
    appliedPadding: null
  };
  docEl.classList.add('overflow-hidden');
  body.classList.add('overflow-hidden');

  if (preserveScrollGap && gap > 0) {
    body.style.setProperty('padding-inline-end', `${padding + gap}px`, saved.paddingPriority);
    saved.appliedPadding = body.style.getPropertyValue('padding-inline-end');
  }

  return saved;
}

function unlockModalScroll(saved) {
  if (!saved) return;
  const {
    docEl,
    body
  } = saved;
  if (!saved.htmlLocked) docEl.classList.remove('overflow-hidden');
  if (!saved.bodyLocked) body.classList.remove('overflow-hidden');

  if (saved.appliedPadding !== null && body.style.getPropertyValue('padding-inline-end') === saved.appliedPadding && body.style.getPropertyPriority('padding-inline-end') === saved.paddingPriority) {
    if (saved.bodyPaddingInlineEnd) {
      body.style.setProperty('padding-inline-end', saved.bodyPaddingInlineEnd, saved.paddingPriority);
    } else {
      body.style.removeProperty('padding-inline-end');
    }
  }
}



/***/ },

/***/ "93025a68d8ab"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

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
/* harmony import */ var _core_js_layer_stack__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("78628e837a32");
// Ordinary and Smart Modal are separate bundles. They share the one document
// layer stack of the core (layer-stack.js, standard 1.3.8 §19), with every
// other layer -- a drawer, a popover, a list -- not a list of their own: a
// modal opened from a drawer is above it, takes Escape and Tab while it is,
// and gives focus back into the drawer when it closes (simai/ui-source#36,
// #37). Registries, public instance APIs and rendering stay separate.

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


const locksPage = modal => !modal.inContainer;

function addModalLayer(modal, owner) {
  if ((0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_1__.hasLayer)(modal)) return;
  (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_1__.openLayer)(modal, {
    kind: 'modal',
    locksPage: locksPage(modal),
    trapsFocus: true,
    lockPage: () => {
      owner.lockPage(modal.preserveScrollGap);
      return () => owner.unlockPage();
    },
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



/***/ },

/***/ "50d2a204ba4c"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SPINNER_DEFAULT_LOOK: () => (/* binding */ SPINNER_DEFAULT_LOOK),
/* harmony export */   SPINNER_DOTS: () => (/* binding */ SPINNER_DOTS),
/* harmony export */   SPINNER_DOTS_FILLED: () => (/* binding */ SPINNER_DOTS_FILLED),
/* harmony export */   SPINNER_GRID: () => (/* binding */ SPINNER_GRID),
/* harmony export */   SPINNER_LOOKS: () => (/* binding */ SPINNER_LOOKS),
/* harmony export */   SPINNER_STROKE: () => (/* binding */ SPINNER_STROKE),
/* harmony export */   createInlineSpinner: () => (/* binding */ createInlineSpinner),
/* harmony export */   createLadderSpinnerSvg: () => (/* binding */ createLadderSpinnerSvg),
/* harmony export */   createSpinnerSvg: () => (/* binding */ createSpinnerSvg),
/* harmony export */   createSvgNode: () => (/* binding */ createSvgNode),
/* harmony export */   normalizeSpinnerLook: () => (/* binding */ normalizeSpinnerLook)
/* harmony export */ });
// The spinner's drawing, without the component's side effects (no registry, no
// observer), so a control that shows work in place of its icon -- a button, an
// icon button, a group's segment, a modal waiting for its content -- draws the
// one spinner of the Framework without loading or binding the spinner
// component (simai/ui-source#10).
//
// The ladder: a spinner is drawn on the icon grid. Material Symbols are drawn on
// 24 units and, at the regular weight the Framework's controls use, stroke 2 of
// them; a spinner on the same grid, scaled to the icon box of a step, strokes as
// the icons of that step do, and needs no stroke of its own per step.
//
// The looks (simai/ui-source#11): every spinner carries the four looks on the
// same ring -- the arc and the breathing arc (one circle, two motions), the
// comet and the dots -- and the spinner sheet shows the one the page asks for:
// data-sf-spinner on html, body or any block (the nearest wins), data-variant on
// the spinner itself above both. The choice is CSS alone, so a page that
// changes the attribute changes every spinner at once, drawn or not yet drawn.
// Without the spinner sheet only the arc is shown, still.
const SVG_NS = 'http://www.w3.org/2000/svg';
const SPINNER_GRID = 24;
const SPINNER_STROKE = 2;
const SPINNER_LOOKS = ['arc', 'breathing', 'comet', 'dots'];
const SPINNER_DEFAULT_LOOK = 'arc'; // The dots look on the grid: a ring of dots as big as the stroke allows, so at
// every step the dots are the step's and no attribute sizes them.

const SPINNER_DOTS = 8;
const SPINNER_DOTS_FILLED = 3; // The comet: a head and a tail a little under half the ring, in segments whose
// opacity falls towards the end of the tail. Segments rather than a gradient,
// because an SVG gradient cannot follow a circle and a CSS one would leave the
// ring and its stroke; each segment strokes in the current ink.

const COMET_SEGMENTS = 10;
const COMET_LENGTH = 40;
function normalizeSpinnerLook(value, fallback = SPINNER_DEFAULT_LOOK) {
  const look = String(value ?? '').trim().toLowerCase();
  return SPINNER_LOOKS.includes(look) ? look : fallback;
}
function createSvgNode(tagName, attributes = {}) {
  const node = document.createElementNS(SVG_NS, tagName);
  Object.entries(attributes).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return;
    }

    node.setAttribute(key, String(value));
  });
  return node;
}

const round = value => Math.round(value * 1000) / 1000; // The four looks in one drawing. On the ladder it is the 24-unit grid with
// stroke 2; a spinner still drawn in pixels (the deprecated attributes) passes
// its own width, height and stroke. The circles carry presentation attributes
// as well as their classes: the spinner sheet styles them (track colour, the
// motion of each look, the still frame under reduced motion), and until that
// sheet has arrived they draw a faint ring and the arc in the current ink
// rather than a filled black disc; the comet and the dots wait hidden. The arc
// is a fixed 30% of the ring (simai/ui-source#13): the sheet turns the drawing,
// the arc itself never changes length.


function createSpinnerSvg({
  width = SPINNER_GRID,
  height = SPINNER_GRID,
  stroke = SPINNER_STROKE,
  dots = SPINNER_DOTS,
  filled = SPINNER_DOTS_FILLED,
  dotRadius = null,
  direction = 'clockwise',
  pixel = false
} = {}) {
  const cx = width / 2;
  const cy = height / 2;
  const half = Math.min(width, height) / 2;
  const radius = Math.max(1, half - stroke / 2);
  const svg = createSvgNode('svg', {
    class: 'sf-loader-svg',
    viewBox: `0 0 ${width} ${height}`,
    width: pixel ? width : null,
    height: pixel ? height : null,
    'aria-hidden': 'true',
    focusable: 'false'
  });
  const ring = {
    cx,
    cy,
    r: round(radius),
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': stroke
  };
  const track = createSvgNode('circle', {
    class: 'sf-loader-ring-filled',
    ...ring,
    opacity: '0.3'
  });
  const accent = createSvgNode('circle', {
    class: 'sf-loader-ring-accent',
    ...ring,
    'stroke-linecap': 'round',
    pathLength: 100,
    'stroke-dasharray': '30 70',
    transform: `rotate(90 ${cx} ${cy})`
  }); // The comet starts at the top and runs clockwise: segment 0 is the end of the
  // tail, the last one the head, drawn last and with a round cap.

  const comet = createSvgNode('g', {
    class: 'sf-loader-comet',
    display: 'none',
    transform: `rotate(-90 ${cx} ${cy})`
  });
  const segment = COMET_LENGTH / COMET_SEGMENTS;

  for (let index = 0; index < COMET_SEGMENTS; index += 1) {
    const head = index === COMET_SEGMENTS - 1;
    comet.append(createSvgNode('circle', {
      class: `sf-loader-comet-segment${head ? ' sf-loader-comet-head' : ''}`,
      ...ring,
      'stroke-linecap': head ? 'round' : 'butt',
      pathLength: 100,
      'stroke-dasharray': `${round(segment)} ${round(100 - segment)}`,
      'stroke-dashoffset': round(-segment * index),
      opacity: round(((index + 1) / COMET_SEGMENTS) ** 1.6)
    }));
  } // The dots sit on the same ring: a dot as wide as the stroke allows without
  // touching its neighbours, so fewer dots are bigger ones.


  const count = Math.max(3, Math.min(32, Math.floor(Number(dots) || SPINNER_DOTS)));
  const active = Math.max(1, Math.min(count, Math.floor(Number(filled) || SPINNER_DOTS_FILLED)));
  const fitted = Math.min(stroke, 0.7 * Math.PI * (half - stroke) / count);
  const dotR = dotRadius === null || dotRadius === undefined || dotRadius === '' ? fitted : Math.max(1, Math.min(Number(dotRadius) || fitted, half / 4));
  const orbit = Math.max(dotR, half - dotR);
  const dotsGroup = createSvgNode('g', {
    class: 'sf-loader-dots',
    display: 'none',
    style: `--sf-loader-dot-count:${count}; --sf-loader-dot-filled:${active};`
  });

  for (let index = 0; index < count; index += 1) {
    const angle = Math.PI * 2 / count * index - Math.PI / 2;
    const step = direction === 'counterclockwise' ? index : (count - index) % count;
    dotsGroup.append(createSvgNode('circle', {
      class: `sf-loader-dot${index < active ? ' sf-loader-dot--active' : ''}`,
      cx: round(cx + orbit * Math.cos(angle)),
      cy: round(cy + orbit * Math.sin(angle)),
      r: round(dotR),
      fill: 'currentColor',
      style: `--sf-loader-dot-index:${index}; --sf-loader-dot-step:${step};`
    }));
  }

  svg.append(track, accent, comet, dotsGroup);
  return svg;
} // The drawing on the icon grid, the one every spinner on the ladder uses.

function createLadderSpinnerSvg(options = {}) {
  return createSpinnerSvg({ ...options,
    width: SPINNER_GRID,
    height: SPINNER_GRID,
    stroke: SPINNER_STROKE,
    dotRadius: null,
    pixel: false
  });
} // A spinner that stands in a control: endless, decorative (the control keeps
// its label and says aria-busy), and marked bound so the spinner component,
// when it is on the page, leaves it as drawn. `className` names the control's
// slot for it; `overlay` lays it over the control's hidden label instead of in
// the place of an icon. Its look is the page's, as every spinner's.

function createInlineSpinner({
  className = '',
  overlay = false
} = {}) {
  const root = document.createElement('span');
  root.className = ['sf-loader-container', 'sf-loader--infinite', className, className && overlay ? `${className}--overlay` : ''].filter(Boolean).join(' ');
  root.dataset.sfSpinnerBound = '1';
  root.dataset.infinite = 'true';
  root.setAttribute('aria-hidden', 'true');
  const indicator = document.createElement('span');
  indicator.className = 'sf-loader--loading-indicator';
  indicator.append(createLadderSpinnerSvg());
  root.append(indicator);
  return root;
}

/***/ },

/***/ "f49a716b86bd"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ALIAS_KINDS: () => (/* binding */ ALIAS_KINDS),
/* harmony export */   ALIAS_MODES: () => (/* binding */ ALIAS_MODES),
/* harmony export */   aliasExpired: () => (/* binding */ aliasExpired),
/* harmony export */   propertyOf: () => (/* binding */ propertyOf),
/* harmony export */   readAliasTable: () => (/* binding */ readAliasTable)
/* harmony export */ });
// The dated alias table of one component (standard simai.smart-component
// 1.3.8 §16.20, vocabulary 1.1.5 §9): what the migration converter writes as
// <component>/aliases.json, read and checked here before core/js/aliases.js
// installs it on an element. Pure data, no DOM, so a build, a lint and the
// runtime share one reading of it.
//
// A table is a list of rows, or {tag, aliases: [rows]}. A row:
//
//   {from, to, kind, since, remove_after, mode?, when?, setting?, tag?}
//
//   kind      event | setting | attribute | action | value
//   since     the first day the new name exists, YYYY-MM-DD
//   remove_after
//             the last day the old name is promised, YYYY-MM-DD
//   mode      events only: same-detail (default) | detail-adds | split
//   when      events only, optional: {<detail field>: <value>}; the old name
//             is sent only for a new event whose detail matches (two old
//             names folded into one new name, as modal:after-hide and
//             modal:after-show into change)
//   setting   values only: the attribute the value belongs to
//
// A row that does not hold is refused with a reason, never thrown: the rest of
// the table still installs, and the refusals are reported.
const ALIAS_KINDS = Object.freeze(['event', 'setting', 'attribute', 'action', 'value']);
const ALIAS_MODES = Object.freeze(['same-detail', 'detail-adds', 'split']);
const DAY = 86400000;
const DATE = /^\d{4}-\d{2}-\d{2}$/u;
const ATTRIBUTE = /^[a-z][a-z0-9-]*$/u;
const MEMBER = /^[A-Za-z_$][\w$]*$/u;

function dateOf(text) {
  if (typeof text !== 'string' || !DATE.test(text)) return NaN;
  const time = Date.parse(`${text}T00:00:00Z`); // 2026-02-30 parses in some engines; it must print back as itself.

  return Number.isNaN(time) || new Date(time).toISOString().slice(0, 10) !== text ? NaN : time;
} // `remove_after` is the last promised day, whole, in UTC: the old name is
// open until the end of it and expired from the next midnight.


function aliasExpired(row, now = Date.now()) {
  const last = dateOf(row?.remove_after);
  return Number.isFinite(last) && now >= last + DAY;
} // kebab-case attribute -> camelCase property: backdrop-blur -> backdropBlur.

function propertyOf(attribute) {
  return String(attribute).replace(/-([a-z0-9])/gu, (_, letter) => letter.toUpperCase());
}

function primitive(value) {
  return value === null || ['string', 'number', 'boolean'].includes(typeof value);
}

function checkRow(row) {
  if (!row || typeof row !== 'object' || Array.isArray(row)) return 'not-an-object';
  const {
    from,
    to,
    kind,
    since,
    mode = 'same-detail',
    when,
    setting
  } = row;
  if (!ALIAS_KINDS.includes(kind)) return 'unknown-kind';
  if (typeof from !== 'string' || !from) return 'no-from';
  if (to === null || to === undefined || to === '') return 'no-new-name';
  if (typeof to !== 'string') return 'no-to';
  if (from === to) return 'same-name';
  const start = dateOf(since);
  const end = dateOf(row.remove_after);
  if (Number.isNaN(start)) return 'bad-since';
  if (Number.isNaN(end)) return 'bad-remove-after';
  if (end < start) return 'remove-after-before-since';
  if (!ALIAS_MODES.includes(mode)) return 'unknown-mode';
  if (kind !== 'event' && mode !== 'same-detail') return 'mode-on-non-event';

  if (when !== undefined) {
    if (kind !== 'event') return 'when-on-non-event';
    if (!when || typeof when !== 'object' || Array.isArray(when) || !Object.values(when).every(primitive)) return 'bad-when';
  }

  if (kind === 'setting' || kind === 'attribute') {
    if (!ATTRIBUTE.test(from) || !ATTRIBUTE.test(to)) return 'bad-attribute-name';
  }

  if (kind === 'action' && (!MEMBER.test(from) || !MEMBER.test(to))) return 'bad-member-name';

  if (kind === 'value') {
    if (typeof setting !== 'string' || !ATTRIBUTE.test(setting)) return 'value-needs-setting';
  } else if (setting !== undefined) {
    return 'setting-on-non-value';
  }

  return null;
}

function normal(row, tag) {
  const out = {
    kind: row.kind,
    from: row.from,
    to: row.to,
    since: row.since,
    remove_after: row.remove_after,
    tag: typeof row.tag === 'string' && row.tag ? row.tag : tag
  };

  if (row.kind === 'event') {
    out.mode = row.mode || 'same-detail';
    if (row.when) out.when = { ...row.when
    };
  }

  if (row.kind === 'value') out.setting = row.setting;
  return Object.freeze(out);
} // -> {tag, rows: [frozen rows], refused: [{index, from, to, kind, reason}]}


function readAliasTable(table, {
  tag = ''
} = {}) {
  const list = Array.isArray(table) ? table : table?.aliases;
  const owner = !Array.isArray(table) && typeof table?.tag === 'string' && table.tag || tag || '';
  const rows = [];
  const refused = [];

  if (!Array.isArray(list)) {
    refused.push({
      index: -1,
      from: null,
      to: null,
      kind: null,
      reason: 'not-a-table'
    });
    return {
      tag: owner,
      rows,
      refused
    };
  }

  const refuse = (index, row, reason) => refused.push({
    index,
    from: row?.from ?? null,
    to: row?.to ?? null,
    kind: row?.kind ?? null,
    reason
  });

  const seen = new Map();
  list.forEach((row, index) => {
    const reason = checkRow(row);
    if (reason) return refuse(index, row, reason);
    const one = normal(row, owner); // An attribute, a property or a method has one new name; an event's old
    // name may be sent beside several new ones (split, folded names).

    const identity = one.kind === 'event' ? `event|${one.from}|${one.to}|${JSON.stringify(one.when ?? null)}` : one.kind === 'value' ? `value|${one.setting}|${one.from}` : `${one.kind === 'action' ? 'action' : 'name'}|${one.from}`;
    const before = seen.get(identity);
    if (before) return refuse(index, row, before.to === one.to ? 'duplicate' : 'conflict');
    seen.set(identity, one);
    rows.push({
      index,
      row: one
    });
  }); // Two old names folded into one new name by their detail: without `when`
  // each would be sent on every new event, the wrong one among them.

  const folded = new Map();

  for (const entry of rows) {
    const {
      row
    } = entry;
    if (row.kind !== 'event' || row.mode === 'same-detail' || row.when) continue;
    folded.set(row.to, [...(folded.get(row.to) ?? []), entry]);
  }

  const ambiguous = new Set();

  for (const group of folded.values()) if (group.length > 1) for (const entry of group) ambiguous.add(entry);

  const kept = [];

  for (const entry of rows) {
    if (ambiguous.has(entry)) refuse(entry.index, entry.row, 'needs-when');else kept.push(entry.row);
  }

  refused.sort((a, b) => a.index - b.index);
  return {
    tag: owner,
    rows: kept,
    refused
  };
}

/***/ },

/***/ "28b603686dcc"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   aliasExpired: () => (/* reexport safe */ _alias_table_js__WEBPACK_IMPORTED_MODULE_1__.aliasExpired),
/* harmony export */   aliasesOf: () => (/* binding */ aliasesOf),
/* harmony export */   aliasesStrict: () => (/* binding */ aliasesStrict),
/* harmony export */   dispatchAliased: () => (/* binding */ dispatchAliased),
/* harmony export */   installAliases: () => (/* binding */ installAliases),
/* harmony export */   readAliasTable: () => (/* reexport safe */ _alias_table_js__WEBPACK_IMPORTED_MODULE_1__.readAliasTable),
/* harmony export */   setAliasClock: () => (/* binding */ setAliasClock),
/* harmony export */   uninstallAliases: () => (/* binding */ uninstallAliases)
/* harmony export */ });
/* harmony import */ var _deprecations_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("06e8cd089f28");
/* harmony import */ var _alias_table_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("f49a716b86bd");
// Dated aliases on an element (standard simai.smart-component 1.3.8 §16.20,
// §8, §16 items 6, 7, 13, 26, 32, 41; vocabulary 1.1.5 §9). When a component
// renames an event, a setting, an attribute, an action or a value, the old
// name keeps working until its `remove_after` day, and each use of it is
// noted in SF.deprecations with its dates, so a person, a probe or an AI can
// read off a running page which old names it still leans on.
//
//   const handle = SF.aliases.install(element, table, {signal});
//   SF.aliases.dispatch(element, 'sf-menu-navigate', {detail, cancelable: true});
//   handle.uninstall();   // or abort `signal`
//
// The table is a component's aliases.json (core/js/alias-table.js reads it).
// What an installed element does:
//
// Events.
//   - One dispatch sends the new name first, then each open old name, with
//     the same `detail` object and the same bubbles / composed / cancelable.
//   - Cancel is shared: preventDefault() on any of them cancels all at once,
//     so a listener that runs later on the other name already sees
//     defaultPrevented, and the dispatch answers false.
//   - stopPropagation() is not shared: the names have different listeners.
//   - It works for today's components without a change in them: the element's
//     own dispatchEvent is wrapped, so a component that still sends the old
//     name (sf-accordion:toggle) sends the new one first through the shim, and
//     a component that sends the new name has the old ones follow. The event
//     object the component made is the one dispatched under its name, so a
//     component that reads its own event's defaultPrevented sees the shared
//     cancel.
//   - A use is a listener that touches the old event (its detail, target,
//     currentTarget, composedPath, preventDefault or the stop methods). It is
//     noted once per dispatch, into one record per name. An old event that
//     nobody listens to is not a use, so a page that moved is not reported.
//     No global prototype is patched to learn this.
//   - `detail-adds` sends the new, larger detail to the old name too: the old
//     fields are all there. `when` sends an old name only for a matching
//     detail (two old names folded into one new name). `split` needs an
//     adapter that makes the old detail from the new one; without it the row
//     is refused. A component that sends the old name of a `detail-adds` or
//     `split` row is not promoted: its old detail cannot make the new one.
//
// Settings and attributes. Writing the old attribute writes the new one (the
// component hears the new one); writing the new one updates the old one when
// the page still has it, so getAttribute(old) stays true. Equal values are
// never written again, which is what ends a round. A setting also gets its
// property: the old property reads and writes the new one.
//
// Actions. The old method calls the new one with the same arguments.
//
// Values. An attribute set to an old value is written with the new one.
//
// A name that the browser's own element owns (title, blur, spellcheck,
// remove, …) is not shadowed as a property or a method unless the component
// already overrides it: the attribute alias still works.
//
// Expiry (decision, §16.20 "after that date the old name is expired"). After
// `remove_after` an old name is `expired`: it is still delivered in 1.x, its
// record carries `expired: true` and a console warning is printed once
// whatever the page opted into. A date passing in a running page must not
// break it between two deploys, and dropping a name inside a major is the
// sweep's job: the release that deletes the row is the removal, under the
// change journal. A page or a host that wants to rehearse the sweep sets
// strict mode, <html data-sf-aliases="strict"> or SF.aliases.strict = true:
// an expired old name is then not delivered — its events are not sent, its
// attribute is not mapped, its property reads undefined, its method throws.
//
// Every bundle carries its own copy of this module, so all state lives on the
// shared global (SF.__aliases, not enumerable) and the first copy's API stays
// on SF.aliases; nothing else is added to the page. Per element state is in a
// WeakMap, the wrappers are own properties of the element and leave with
// uninstall(), and the only listener is on the caller's AbortSignal, itself
// removed by an AbortController of the install.



const VERSION = 1;
const WRAPPED = ['dispatchEvent', 'setAttribute', 'removeAttribute', 'toggleAttribute'];
const TOUCH_GETTERS = ['detail', 'target', 'currentTarget', 'srcElement'];
const TOUCH_METHODS = ['composedPath', 'preventDefault', 'stopPropagation', 'stopImmediatePropagation'];

function shared() {
  const SF = globalThis.SF = globalThis.SF || {};

  if (!SF.__aliases || typeof SF.__aliases !== 'object') {
    Object.defineProperty(SF, '__aliases', {
      configurable: true,
      enumerable: false,
      writable: false,
      value: {
        elements: new WeakMap(),
        ours: new WeakSet(),
        now: () => Date.now()
      }
    });
  }

  return SF.__aliases;
} // A test or a sweep rehearsal sets the clock; null puts the real one back.


function setAliasClock(clock) {
  shared().now = typeof clock === 'function' ? clock : () => Date.now();
}
function aliasesStrict() {
  return globalThis.document?.documentElement?.dataset?.sfAliases === 'strict' || globalThis.SF?.aliases?.strict === true;
}

function life(row) {
  const expired = (0,_alias_table_js__WEBPACK_IMPORTED_MODULE_1__.aliasExpired)(row, shared().now());
  return {
    expired,
    usable: !expired || !aliasesStrict()
  };
}

function note(row, expired) {
  const attribute = row.kind === 'value' ? row.setting : row.kind === 'setting' || row.kind === 'attribute' ? row.from : '';
  (0,_deprecations_js__WEBPACK_IMPORTED_MODULE_0__.noteDeprecated)({
    component: row.tag,
    tag: row.tag,
    kind: row.kind,
    attribute,
    from: row.from,
    to: row.to,
    since: row.since,
    remove_after: row.remove_after,
    ...(expired ? {
      expired: true
    } : {})
  });
} // --- events ---------------------------------------------------------------


const eventGet = name => Object.getOwnPropertyDescriptor(globalThis.Event.prototype, name)?.get;

const nativePrevent = () => globalThis.Event.prototype.preventDefault;

function flagsOf(event) {
  return {
    bubbles: eventGet('bubbles').call(event),
    cancelable: eventGet('cancelable').call(event),
    composed: eventGet('composed').call(event)
  };
}

function detailOf(event) {
  const get = globalThis.CustomEvent && Object.getOwnPropertyDescriptor(globalThis.CustomEvent.prototype, 'detail')?.get;
  return get && event instanceof globalThis.CustomEvent ? get.call(event) : null;
}

function matches(detail, when) {
  if (!when) return true;
  if (!detail || typeof detail !== 'object') return false;
  return Object.entries(when).every(([field, value]) => detail[field] === value);
}

function makeEvent(element, type, detail, flags) {
  const Custom = element.ownerDocument?.defaultView?.CustomEvent ?? globalThis.CustomEvent;
  return new Custom(type, { ...flags,
    detail
  });
} // The first touch of an old event by a listener is a use of the old name.


function instrument(event, row, expired, detail) {
  let used = false;

  const use = () => {
    if (used) return;
    used = true;
    note(row, expired);
  };

  for (const name of TOUCH_GETTERS) {
    const get = name === 'detail' ? () => detail : eventGet(name);
    if (!get) continue;
    Object.defineProperty(event, name, {
      configurable: true,

      get() {
        use();
        return get.call(this);
      }

    });
  }

  for (const name of TOUCH_METHODS) {
    const method = event[name];
    if (typeof method !== 'function') continue;
    Object.defineProperty(event, name, {
      configurable: true,
      writable: true,

      value(...args) {
        use();
        return method.apply(this, args);
      }

    });
  }
}

function shareCancel(events) {
  const cancel = nativePrevent();

  for (const event of events) {
    Object.defineProperty(event, 'preventDefault', {
      configurable: true,
      writable: true,

      value() {
        for (const one of events) cancel.call(one);
      }

    });
  }
} // The old events that go with one new event: open (or expired outside strict)
// rows whose `when` matches, made from the same detail, or from the adapter's
// detail for a split row. `own` is the component's own event when it sent an
// old name: it is reused under that name.


function oldEventsFor(state, element, newType, detail, flags, own) {
  const out = [];
  const names = new Set();

  for (const row of state.byNew.get(newType) ?? []) {
    if (names.has(row.from) || !matches(detail, row.when)) continue;
    const {
      expired,
      usable
    } = life(row);
    if (!usable) continue;
    let oldDetail = detail;

    if (row.mode === 'split') {
      oldDetail = state.adapters[row.from]?.(detail, newType);
      if (oldDetail === undefined) continue;
    }

    names.add(row.from);
    const event = own && own.type === row.from && oldDetail === detail ? own : makeEvent(element, row.from, oldDetail, flags);
    out.push({
      event,
      row,
      expired,
      detail: oldDetail
    });
  }

  return out;
} // Sends the new event, then the old ones, with one cancel. The cancel is
// shared first and the old events instrumented after, so a listener's
// preventDefault() on an old name both cancels all and counts as a use.


function deliver(state, element, first, olds, alsoCancel = []) {
  const ours = shared().ours;
  const events = [first, ...olds.map(one => one.event)];
  const all = [...events, ...alsoCancel.filter(event => !events.includes(event))];
  if (all.some(event => eventGet('cancelable').call(event))) shareCancel(all);

  for (const one of olds) instrument(one.event, one.row, one.expired, one.detail);

  for (const event of events) {
    ours.add(event);
    state.native.dispatchEvent.call(element, event);
  }

  const prevented = eventGet('defaultPrevented');
  return !all.some(event => prevented.call(event));
}

function wrappedDispatch(state, element, event) {
  const native = state.native.dispatchEvent;
  if (!event || shared().ours.has(event)) return native.call(element, event);
  const type = event.type;

  if (state.byNew.has(type)) {
    const detail = detailOf(event);
    return deliver(state, element, event, oldEventsFor(state, element, type, detail, flagsOf(event), null));
  }

  const rows = state.byOld.get(type);
  if (!rows) return native.call(element, event);
  const detail = detailOf(event);
  const flags = flagsOf(event); // An old name with one plain new name is promoted: the new name first.

  const targets = new Set(rows.filter(row => row.mode === 'same-detail' && !row.when).map(row => row.to));

  if (targets.size === 1 && rows.every(row => row.mode === 'same-detail' && !row.when)) {
    const [to] = targets;
    const fresh = makeEvent(element, to, detail, flags);
    const olds = oldEventsFor(state, element, to, detail, flags, event); // A strict page whose old name expired still has the component's own
    // event in the cancel group, though it is not sent.

    return deliver(state, element, fresh, olds, [event]);
  } // Not promotable (detail-adds, split, folded): delivered as it is, a use
  // noted when touched.


  const {
    expired,
    usable
  } = life(rows[0]);
  if (!usable) return true;
  instrument(event, rows[0], expired, detail);
  shared().ours.add(event);
  return native.call(element, event);
} // --- attributes, values -----------------------------------------------------


function mapValue(state, attribute, value, {
  quiet = false
} = {}) {
  const row = state.values.get(attribute)?.get(String(value));
  if (!row) return value;
  const {
    expired,
    usable
  } = life(row);
  if (!quiet) note(row, expired);
  return usable ? row.to : value;
}

function writeIfDifferent(state, element, name, value) {
  const text = String(value);
  if (state.native.getAttribute.call(element, name) !== text) state.native.setAttribute.call(element, name, text);
}

function removeIfPresent(state, element, name) {
  if (state.native.hasAttribute.call(element, name)) state.native.removeAttribute.call(element, name);
}

function wrappedSet(state, element, name, value) {
  const attribute = String(name).toLowerCase();
  const row = state.attrByOld.get(attribute);

  if (row) {
    const {
      expired,
      usable
    } = life(row);
    note(row, expired);
    state.native.setAttribute.call(element, attribute, value);
    if (usable) writeIfDifferent(state, element, row.to, mapValue(state, row.to, value));
    return;
  }

  const mapped = mapValue(state, attribute, value);
  state.native.setAttribute.call(element, attribute, mapped);

  for (const old of state.attrByNew.get(attribute) ?? []) {
    if (state.native.hasAttribute.call(element, old.from)) writeIfDifferent(state, element, old.from, mapped);
  }
}

function wrappedRemove(state, element, name) {
  const attribute = String(name).toLowerCase();
  const row = state.attrByOld.get(attribute);
  state.native.removeAttribute.call(element, attribute);

  if (row) {
    const {
      expired,
      usable
    } = life(row);
    note(row, expired);
    if (usable) removeIfPresent(state, element, row.to);
    return;
  }

  for (const old of state.attrByNew.get(attribute) ?? []) removeIfPresent(state, element, old.from);
}

function wrappedToggle(state, element, name, force) {
  const attribute = String(name).toLowerCase();
  const has = state.native.hasAttribute.call(element, attribute);
  const want = force === undefined ? !has : Boolean(force);
  if (want && !has) wrappedSet(state, element, attribute, '');
  if (!want && has) wrappedRemove(state, element, attribute);
  return want;
} // Changes that did not come through the element's own methods (the parser,
// an Attr node, a framework that calls the prototype): the later change of
// each name wins, and only differing values are written.


function reconcile(state, element, records) {
  const last = new Map();
  records.forEach((record, order) => last.set(record.attributeName, order));
  const names = [...last.keys()].sort((a, b) => last.get(a) - last.get(b));

  const has = name => state.native.hasAttribute.call(element, name);

  const get = name => state.native.getAttribute.call(element, name);

  for (const name of names) {
    const row = state.attrByOld.get(name);

    if (row) {
      const {
        expired,
        usable
      } = life(row);
      if (!usable) continue;

      if (has(name)) {
        if (get(row.to) !== mapValue(state, row.to, get(name), {
          quiet: true
        })) {
          note(row, expired);
          writeIfDifferent(state, element, row.to, mapValue(state, row.to, get(name)));
        }
      } else {
        removeIfPresent(state, element, row.to);
      }

      continue;
    }

    if (state.values.has(name) && has(name)) {
      const mapped = mapValue(state, name, get(name));
      if (mapped !== get(name)) writeIfDifferent(state, element, name, mapped);
    }

    for (const old of state.attrByNew.get(name) ?? []) {
      // The old name changed after this one: its own turn decides.
      if (!has(old.from) || (last.get(old.from) ?? -1) > last.get(name)) continue;
      if (has(name)) writeIfDifferent(state, element, old.from, get(name));else state.native.removeAttribute.call(element, old.from);
    }
  }
} // What the markup already holds: an old attribute is a use and fills the new
// one when that is absent (a new one the page also wrote wins); an old value
// is rewritten.


function adopt(state, element) {
  const has = name => state.native.hasAttribute.call(element, name);

  const get = name => state.native.getAttribute.call(element, name);

  for (const [name, row] of state.attrByOld) {
    if (!has(name)) continue;
    const {
      expired,
      usable
    } = life(row);
    note(row, expired);
    if (usable && !has(row.to)) writeIfDifferent(state, element, row.to, mapValue(state, row.to, get(name)));
  }

  for (const name of state.values.keys()) {
    if (has(name)) writeIfDifferent(state, element, name, mapValue(state, name, get(name)));
  }
} // --- members -----------------------------------------------------------------


function nativePrototypes() {
  const protos = new Set([Object.prototype]);

  for (let proto = globalThis.HTMLElement?.prototype; proto; proto = Object.getPrototypeOf(proto)) protos.add(proto);

  if (globalThis.EventTarget) protos.add(globalThis.EventTarget.prototype);
  return protos;
} // May `name` be defined on the element? Not when the browser's element owns
// it and the component does not override it.


function ownableMember(element, name) {
  const natives = nativePrototypes();

  for (let proto = Object.getPrototypeOf(element); proto; proto = Object.getPrototypeOf(proto)) {
    if (Object.prototype.hasOwnProperty.call(proto, name)) return !natives.has(proto);
  }

  return true;
}

function defineOwn(state, element, name, descriptor) {
  const before = Object.getOwnPropertyDescriptor(element, name);
  state.restore.push(() => {
    delete element[name];
    if (before) Object.defineProperty(element, name, before);
  });
  Object.defineProperty(element, name, {
    configurable: true,
    enumerable: false,
    ...descriptor
  });
  return before;
}

function writable(element, name) {
  for (let object = element; object; object = Object.getPrototypeOf(object)) {
    const own = Object.getOwnPropertyDescriptor(object, name);
    if (own) return Boolean(own.set) || own.writable === true;
  }

  return true;
} // Today's Smart base exposes a setting as a read-only property over its
// attribute; such a setting is written through the attribute.


function writeSetting(state, element, row, property, value) {
  if (writable(element, property)) {
    element[property] = value;
  } else if (value === null || value === undefined || value === false) {
    removeIfPresent(state, element, row.to);
  } else {
    writeIfDifferent(state, element, row.to, value === true ? '' : typeof value === 'object' ? JSON.stringify(value) : value);
  }
}

function installProperty(state, element, row, refuse) {
  const from = (0,_alias_table_js__WEBPACK_IMPORTED_MODULE_1__.propertyOf)(row.from);
  const to = (0,_alias_table_js__WEBPACK_IMPORTED_MODULE_1__.propertyOf)(row.to);
  if (!ownableMember(element, from)) return refuse(row, 'native-member');
  if (!(to in element)) return refuse(row, 'no-new-property');
  const before = defineOwn(state, element, from, {
    get() {
      const {
        expired,
        usable
      } = life(row);
      note(row, expired);
      return usable ? element[to] : undefined;
    },

    set(value) {
      const {
        expired,
        usable
      } = life(row);
      note(row, expired);
      if (usable) writeSetting(state, element, row, to, value);
    }

  }); // A value the page set before the element was installed moves to the new name.

  if (before && 'value' in before && before.value !== undefined) element[from] = before.value;
  return true;
}

function installAction(state, element, row, refuse) {
  if (!ownableMember(element, row.from)) return refuse(row, 'native-member');
  if (typeof element[row.to] !== 'function') return refuse(row, 'no-new-action');
  defineOwn(state, element, row.from, {
    writable: true,

    value(...args) {
      const {
        expired,
        usable
      } = life(row);
      note(row, expired);
      if (!usable) throw new TypeError(`[SIMAI Framework] ${row.tag || element.localName}: ${row.from}() was removed after ${row.remove_after}; call ${row.to}().`);
      return element[row.to](...args);
    }

  });
  return true;
} // --- install ----------------------------------------------------------------


function uninstallAliases(element) {
  const store = shared();
  const state = element && store.elements.get(element);
  if (!state) return false;
  store.elements.delete(element);
  state.observer?.disconnect();
  state.controller.abort();

  for (const restore of state.restore.reverse()) restore();

  return true;
}
function installAliases(element, table, {
  signal,
  adapters = {},
  tag
} = {}) {
  if (!element || typeof element.dispatchEvent !== 'function') throw new TypeError('[SIMAI Framework] SF.aliases.install needs an element');
  uninstallAliases(element);
  const read = (0,_alias_table_js__WEBPACK_IMPORTED_MODULE_1__.readAliasTable)(table, {
    tag: tag || element.localName || ''
  });
  const refused = [...read.refused];
  const handle = {
    installed: 0,
    refused,
    uninstall: () => uninstallAliases(element)
  };
  if (signal?.aborted) return handle;
  const state = {
    rows: read.rows,
    adapters,
    byNew: new Map(),
    byOld: new Map(),
    attrByOld: new Map(),
    attrByNew: new Map(),
    values: new Map(),
    restore: [],
    controller: new AbortController(),
    observer: null,
    native: {}
  };

  for (const name of [...WRAPPED, 'getAttribute', 'hasAttribute']) state.native[name] = element[name];

  const refuse = (row, reason) => {
    refused.push({
      index: -1,
      from: row.from,
      to: row.to,
      kind: row.kind,
      reason
    });
    return false;
  };

  const push = (map, key, row) => map.set(key, [...(map.get(key) ?? []), row]);

  for (const row of read.rows) {
    if (row.kind === 'event') {
      if (row.mode === 'split' && typeof adapters[row.from] !== 'function') {
        refuse(row, 'needs-adapter');
        continue;
      }

      push(state.byNew, row.to, row);
      push(state.byOld, row.from, row);
      handle.installed += 1;
    } else if (row.kind === 'setting' || row.kind === 'attribute') {
      if (typeof state.native.setAttribute !== 'function') {
        refuse(row, 'no-attributes');
        continue;
      }

      state.attrByOld.set(row.from, row);
      push(state.attrByNew, row.to, row);
      handle.installed += 1;
      if (row.kind === 'setting') installProperty(state, element, row, refuse);
    } else if (row.kind === 'value') {
      if (!state.values.has(row.setting)) state.values.set(row.setting, new Map());
      state.values.get(row.setting).set(row.from, row);
      handle.installed += 1;
    } else if (row.kind === 'action' && installAction(state, element, row, refuse)) {
      handle.installed += 1;
    }
  }

  if (state.byNew.size) {
    defineOwn(state, element, 'dispatchEvent', {
      writable: true,
      value: event => wrappedDispatch(state, element, event)
    });
  }

  const attributes = state.attrByOld.size || state.values.size;

  if (attributes) {
    defineOwn(state, element, 'setAttribute', {
      writable: true,
      value: (name, value) => wrappedSet(state, element, name, value)
    });
    defineOwn(state, element, 'removeAttribute', {
      writable: true,
      value: name => wrappedRemove(state, element, name)
    });

    if (typeof state.native.toggleAttribute === 'function') {
      defineOwn(state, element, 'toggleAttribute', {
        writable: true,
        value: (name, force) => wrappedToggle(state, element, name, force)
      });
    }

    adopt(state, element);
    const Observer = element.ownerDocument?.defaultView?.MutationObserver ?? globalThis.MutationObserver;

    if (typeof Observer === 'function') {
      const filter = [...new Set([...state.attrByOld.keys(), ...state.attrByNew.keys(), ...state.values.keys()])];
      state.observer = new Observer(records => reconcile(state, element, records));
      state.observer.observe(element, {
        attributes: true,
        attributeFilter: filter
      });
    }
  }

  shared().elements.set(element, state);
  signal?.addEventListener?.('abort', () => uninstallAliases(element), {
    once: true,
    signal: state.controller.signal
  });
  return handle;
} // For code that sends an event by name: through the element's aliases when
// it has them, a plain dispatch when it has none. Answers false when cancelled.

function dispatchAliased(element, name, {
  detail = null,
  bubbles = true,
  composed = true,
  cancelable = false
} = {}) {
  return element.dispatchEvent(makeEvent(element, name, detail, {
    bubbles,
    composed,
    cancelable
  }));
}
function aliasesOf(element) {
  return [...(shared().elements.get(element)?.rows ?? [])];
} // The first copy's API stays; every copy shares the state.

if (typeof globalThis !== 'undefined') {
  globalThis.SF = globalThis.SF || {};
  const current = globalThis.SF.aliases;

  if (!current || typeof current.install !== 'function') {
    globalThis.SF.aliases = {
      version: VERSION,
      strict: current?.strict === true,
      install: installAliases,
      uninstall: uninstallAliases,
      dispatch: dispatchAliased,
      of: aliasesOf,
      read: _alias_table_js__WEBPACK_IMPORTED_MODULE_1__.readAliasTable,
      expired: (row, now) => (0,_alias_table_js__WEBPACK_IMPORTED_MODULE_1__.aliasExpired)(row, now ?? shared().now())
    };
  }
}

/***/ },

/***/ "06e8cd089f28"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   clearDeprecations: () => (/* binding */ clearDeprecations),
/* harmony export */   listDeprecations: () => (/* binding */ listDeprecations),
/* harmony export */   noteDeprecated: () => (/* binding */ noteDeprecated)
/* harmony export */ });
// What a page still uses that the Framework keeps only for compatibility. Every
// legacy attribute, value or name a component resolves is noted here once, so a
// person, a probe or an AI upgrading a product can read the list off a running
// page (SF.deprecations.list()) instead of searching the source for it. The
// records behind the names are in contracts/changes/journal.json.
//
// Nothing is printed by default: a page opts in to console warnings with
// <html data-sf-deprecations="warn"> or SF.deprecations.warn = true. A dated
// alias (core/js/aliases.js, standard simai.smart-component §16.20) also
// records `tag`, `since` and `remove_after`; once its date has passed the
// record turns `expired` and that is printed once whatever the page opted
// into, because the name can leave with the next sweep.
//
// Every bundle carries its own copy of this module, so a Map of its own made one
// list per bundle, and SF.deprecations.list() answered with whichever bundle set
// it last -- [] on a page printing seven warnings from others. The notes live on
// one shared global instead, whichever copy writes or reads them.
function sharedNotes() {
  const root = globalThis.SF = globalThis.SF || {};

  if (!(root.__deprecationNotes instanceof Map)) {
    Object.defineProperty(root, '__deprecationNotes', {
      value: new Map(),
      configurable: true
    });
  }

  return root.__deprecationNotes;
}

function warnEnabled() {
  const root = globalThis.document?.documentElement;
  return root?.dataset?.sfDeprecations === 'warn' || globalThis.SF?.deprecations?.warn === true;
}

function noteDeprecated({
  component = '',
  kind = 'attribute',
  attribute = '',
  from,
  to = null,
  tag,
  since,
  remove_after: removeAfter,
  expired
} = {}) {
  if (!from) return;
  const key = [component, kind, attribute, from].join('|');
  const notes = sharedNotes();
  let note = notes.get(key);
  const firstExpiry = expired === true && note?.expired !== true;

  if (note) {
    note.count += 1;
  } else {
    note = {
      component,
      kind,
      attribute,
      from,
      to,
      count: 1
    };
    notes.set(key, note);
  } // The dated fields are kept only when a caller knows them, so the records of
  // the Framework's undated aliases keep their shape.


  if (tag !== undefined) note.tag = tag;
  if (since !== undefined) note.since = since;
  if (removeAfter !== undefined) note.remove_after = removeAfter;
  if (expired === true) note.expired = true;

  if (firstExpiry) {
    globalThis.console?.warn?.(`[SIMAI Framework] ${describe(note)} was due to leave after ${note.remove_after || 'its date'}${to ? `; write ${to}` : ''}. See contracts/changes/journal.json.`);
  } else if (note.count === 1 && warnEnabled()) {
    globalThis.console?.warn?.(`[SIMAI Framework] ${describe(note)} is a legacy name${note.remove_after ? ` until ${note.remove_after}` : ''}${to ? `; write ${to}` : ''}. See contracts/changes/journal.json.`);
  }
}

function describe({
  component,
  kind,
  attribute,
  from
}) {
  const where = component ? `${component}: ` : '';
  const what = kind === 'value' ? `${attribute}="${from}"` : `${kind} ${from}`;
  return `${where}${what}`;
}

function listDeprecations() {
  return [...sharedNotes().values()].map(note => ({ ...note
  }));
}
function clearDeprecations() {
  sharedNotes().clear();
}

if (typeof globalThis !== 'undefined') {
  globalThis.SF = globalThis.SF || {};
  const api = globalThis.SF.deprecations || {};
  api.list = listDeprecations;
  api.clear = clearDeprecations;
  api.note = noteDeprecated;
  globalThis.SF.deprecations = api;
}

/***/ },

/***/ "59da34819c8b"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   camelName: () => (/* binding */ camelName),
/* harmony export */   elementFromManifest: () => (/* binding */ elementFromManifest),
/* harmony export */   eventName: () => (/* binding */ eventName),
/* harmony export */   propsFromManifest: () => (/* binding */ propsFromManifest),
/* harmony export */   readManifest: () => (/* binding */ readManifest),
/* harmony export */   toOutcome: () => (/* binding */ toOutcome)
/* harmony export */ });
/* harmony import */ var _aliases_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("28b603686dcc");
/* harmony import */ var _page_language_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("0d662e4d7d63");
/* harmony import */ var _deprecations_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("06e8cd089f28");
/* harmony import */ var _page_actions_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("51e3a200cf5f");
/* harmony import */ var _host_port_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("f171c5ece4b4");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_page_language_js__WEBPACK_IMPORTED_MODULE_1__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
_page_language_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var _page_language_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_page_language_js__WEBPACK_IMPORTED_MODULE_1__);
// An element from its manifest (standard simai.smart-component 1.3.8 §3, §4,
// §4.1, §4.4, §7.7, §8, §11, §17.1).
//
// A component folder holds component.json, its language files and its
// aliases.json; the element's attribute and property code, the methods of its
// actions and the names of its events are not written by hand but made from
// them here:
//
//   import manifest from './component.json';
//   import en from './lang/en.json';
//   import ru from './lang/ru.json';
//   import aliases from './aliases.json';
//   const Base = elementFromManifest(manifest, {base: SfBaseElement, lang: {en, ru}, aliases, actions: {...}});
//   class SfThing extends Base { ...behaviour only... }
//
// Why at load and not in the build: ui-builder compiles a Smart component's
// index.js with webpack and babel and transforms nothing of its own, so the
// JSON files are bundled as they are (webpack reads JSON imports) and the
// plumbing is made once per class when the bundle runs. A build step can take
// this over later without a change in the components: the input is the same
// manifest.
//
// What the class gets:
//
// - settings (§4): an attribute and a property per setting, typed (`string`,
//   `enum`, `boolean`, `number`, `icon`, `date`, `id`; `list`, `object` and
//   `state` are properties only); a setting with `"default-from":
//   "runtime.<word>"` defaults to that word in the element's language;
// - values (§4, §4.3): a value with a default is also a setting of the same
//   name; the others are read-only properties that a component overrides with
//   its own getter;
// - events (§8): `sfEmit(verb, detail)` sends `<tag>-<verb>`, or the native
//   name for `change`, `input` and `"carries": "native"` (with the detail
//   when one is given), through the dated aliases, so the old names follow;
// - actions (§4.4): one method per action that takes its `with` parameters as
//   one object or in declared order and answers an outcome, `{outcome:
//   'applied'}` or `{outcome: 'refused', reason}`; `"emits"` sends its event
//   once first, and a page that cancels it makes the action refused; a
//   waiting action whose instance is removed answers `cancelled`;
// - the base action `connect-port {port}` (§4.1, §4.9): `connectPort(port)`,
//   `setHostPort` its alias, the port kept on the instance's scope and read
//   as `sfPort`, the component's `onPortConnected(port, {signal})` its hook
//   (core/js/host-port.js; the Smart base has it, another base gets it here);
// - the base values `shown` and `started` (§4.1) and the host state
//   `data-sf-started`; `sfHostState(name, on)` writes the declared
//   `host-states` (§5.3);
// - static `aliases` from aliases.json (§16.20), installed by the base;
// - words (§11, §11.1): `sfWord(key, {count, vars})`, with the element's own
//   word first, then the nearest [lang], the page's choice, <html lang>,
//   English, the source language and the key;
// - a form control (§17.1): `formAssociated` and ElementInternals where the
//   browser has them; `sfFormValue()` is what the form gets.
//
// Members the runtime adds start with `sf`, which no manifest name may
// (§3.1), so a generated setting or action never collides with them.





const RESERVED = new Set(['props', 'api', 'view', 'scope', 'parts', 'receive', 'render', 'connected', 'disconnected', 'updated', 'outside', 'data', 'template', 'root-class', 'root-style', 'focus', 'blur', 'connect-port', 'shown', 'started']);
const PROPERTY_ONLY = new Set(['list', 'object', 'state']); // core/js/smart-base.js toBoolean: what an attribute value means as true.

const TRUE_WORDS = new Set(['1', 'true', 'yes', 'on', 'checked', 'disabled', 'download', 'indeterminate', 'multiple']);
const camelName = name => String(name).replace(/-([a-z0-9])/gu, (_, letter) => letter.toUpperCase());

const isPlainObject = value => value !== null && typeof value === 'object' && !Array.isArray(value) && Object.getPrototypeOf(value) === Object.prototype; // The browser's own members (§3.1): read from the prototype, never from a copy.


function isNativeMember(property) {
  let proto = globalThis.HTMLElement?.prototype;

  while (proto) {
    if (Object.prototype.hasOwnProperty.call(proto, property)) return true;
    proto = Object.getPrototypeOf(proto);
  }

  return false;
} // The browser's own names a field reports under (§8, §17.3): a page listens
// for `change` and `input` on any form control, ours included, so they keep
// those names whatever they carry -- a detail when the component gives one,
// never `<tag>-change`. A component that holds other content and is no value
// control (sf-tabs, sf-steps, sf-pagination) declares `"x-native": false` on
// the event: it sends `<tag>-change`, so a field's change bubbling out of a
// panel is never taken for its own.


const NATIVE_EVENTS = new Set(['change', 'input']);
/** The DOM name of an event the manifest declares by its verb (§8). */

function eventName(manifest, verb) {
  const declared = manifest?.events?.[verb];
  if (declared?.carries === 'native') return verb;
  if (NATIVE_EVENTS.has(verb) && declared?.['x-native'] !== false) return verb;
  return `${manifest.tag}-${verb}`;
}
/** An action's answer as an outcome (§4.4, vocabulary §3.1). */

function toOutcome(result) {
  if (result === undefined || result === null || result === true) return {
    outcome: 'applied'
  };
  if (result === false) return {
    outcome: 'refused',
    reason: 'refused'
  };

  if (typeof result === 'string') {
    return ['applied', 'cancelled', 'conflict', 'unavailable'].includes(result) ? {
      outcome: result
    } : {
      outcome: 'refused',
      reason: result
    };
  }

  if (typeof result === 'object' && typeof result.outcome === 'string') return result;
  return {
    outcome: 'applied',
    value: result
  };
}

function typedDefault(spec) {
  if (Object.prototype.hasOwnProperty.call(spec, 'default')) return spec.default;

  switch (spec.type) {
    case 'boolean':
      return false;

    case 'number':
      return 0;

    case 'list':
      return [];

    case 'object':
    case 'state':
      return {};

    case 'enum':
      return spec.values?.[0] ?? '';

    default:
      return '';
  }
}

function runtimeWordOf(spec) {
  const from = spec?.['default-from'];
  return typeof from === 'string' && from.startsWith('runtime.') ? from.slice('runtime.'.length) : '';
}
/**
 * The members a manifest declares, read once: what the element exposes and
 * how each name is spelled on it.
 */


function readManifest(manifest) {
  if (!manifest || typeof manifest !== 'object' || !manifest.tag) {
    throw new TypeError('elementFromManifest: a manifest with a tag is required');
  }

  const members = [];
  const refused = [];

  const take = (part, name, spec, writable) => {
    const property = camelName(name);

    if (RESERVED.has(name) || name.startsWith('_') || name.startsWith('sf')) {
      refused.push({
        part,
        name,
        reason: 'reserved'
      });
      return;
    }

    members.push({
      part,
      name,
      property,
      type: spec.type || 'string',
      values: Array.isArray(spec.values) ? spec.values : null,
      default: typedDefault(spec),
      optional: spec.optional === true,
      attribute: PROPERTY_ONLY.has(spec.type) ? '' : name,
      writable,
      word: runtimeWordOf(spec),
      native: isNativeMember(property)
    });
  };

  for (const [name, spec] of Object.entries(manifest.settings || {})) take('settings', name, spec || {}, true);

  for (const [name, spec] of Object.entries(manifest.values || {})) {
    // A value a person changes is also writable as a setting (§4); one that
    // only shows (effective-*) is read.
    const writable = Object.prototype.hasOwnProperty.call(spec || {}, 'default') || Boolean(spec?.['default-from']);
    take('values', name, spec || {}, writable && !name.startsWith('effective-'));
  }

  const events = Object.fromEntries(Object.entries(manifest.events || {}).map(([verb, spec]) => [verb, {
    verb,
    name: eventName(manifest, verb),
    cancelable: spec?.cancelable === true,
    native: NATIVE_EVENTS.has(verb) || spec?.carries === 'native'
  }]));
  const actions = Object.entries(manifest.actions || {}).map(([name, spec]) => ({
    name,
    method: camelName(name),
    with: Object.keys(spec?.with || {}),
    emits: spec?.emits || ''
  }));
  return {
    tag: manifest.tag,
    members,
    events,
    actions,
    refused,
    hostStates: { ...(manifest['host-states'] || {})
    },
    form: manifest.form || null
  };
}
/** The base's `props` for the members that live in attributes or properties. */

function propsFromManifest(manifest) {
  const {
    members
  } = readManifest(manifest);
  const props = {};

  for (const member of members) {
    if (!member.writable) continue;
    const config = {
      default: member.default,
      attribute: member.attribute || false
    };
    if (member.type === 'boolean') config.type = Boolean;else if (member.type === 'number') config.type = Number;else if (member.type === 'list') config.type = Array;else if (PROPERTY_ONLY.has(member.type)) config.type = Object;
    if (member.values) config.values = member.values;

    if (PROPERTY_ONLY.has(member.type)) {
      config.parser = function readProperty(raw, fallback, element) {
        const store = element?.__sfManifestData;
        return store && Object.prototype.hasOwnProperty.call(store, member.name) ? store[member.name] : fallback;
      };
    } else if (member.word) {
      config.parser = function readWord(raw, fallback, element) {
        return raw !== undefined && raw !== null ? raw : element.sfWord(member.word);
      };
    }

    props[member.property] = config;
  }

  return props;
}

function readAttribute(element, member) {
  const raw = element.getAttribute(member.attribute);

  if (member.type === 'boolean') {
    if (raw === null) return member.optional && member.default === undefined ? undefined : Boolean(member.default); // The base's reading, so the template and the property agree: present
    // and empty is true, then the words the base takes for true.

    return raw === '' || TRUE_WORDS.has(raw.toLowerCase());
  }

  if (raw === null) return member.word ? element.sfWord(member.word) : member.default;

  if (member.type === 'number') {
    const number = Number(raw);
    return raw.trim() !== '' && Number.isFinite(number) ? number : member.default;
  }

  if (member.values && !member.values.includes(raw)) return member.default;
  return raw;
}

function writeAttribute(element, member, value) {
  if (value === null || value === undefined) {
    element.removeAttribute(member.attribute);
    return;
  }

  if (member.type === 'boolean') {
    // An optional boolean keeps «off» as a value of its own (§4.2), and so
    // does one that is on by default: taking the attribute away would read
    // as the default, on (sf-pagination's count-known, total-exact).
    if (value) element.setAttribute(member.attribute, '');else if (member.optional || member.default === true) element.setAttribute(member.attribute, 'false');else element.removeAttribute(member.attribute);
    return;
  }

  element.setAttribute(member.attribute, String(value));
}

function defineMembers(target, members) {
  for (const member of members) {
    // The browser's own members stay the browser's (§3.1); a component that
    // must answer one writes its own accessor.
    if (member.native) continue;

    if (!member.writable) {
      Object.defineProperty(target, member.property, {
        configurable: true,

        get() {
          return member.default;
        }

      });
      continue;
    }

    if (!member.attribute) {
      Object.defineProperty(target, member.property, {
        configurable: true,

        get() {
          const store = this.__sfManifestData;
          return store && Object.prototype.hasOwnProperty.call(store, member.name) ? store[member.name] : member.default;
        },

        set(value) {
          if (!this.__sfManifestData) this.__sfManifestData = {};
          this.__sfManifestData[member.name] = value;
          this.requestComponentUpdate?.(member.name);
        }

      });
      continue;
    }

    Object.defineProperty(target, member.property, {
      configurable: true,

      get() {
        return readAttribute(this, member);
      },

      set(value) {
        writeAttribute(this, member, value);
      }

    });
  }
}

function parameters(action, args) {
  if (args.length === 1 && isPlainObject(args[0]) && (action.with.length !== 1 || Object.keys(args[0]).every(key => action.with.includes(key)))) {
    return { ...args[0]
    };
  }

  return Object.fromEntries(action.with.map((name, index) => [name, args[index]]));
}

function defineActions(target, actions, implementations, events) {
  for (const action of actions) {
    if (isNativeMember(action.method)) continue;
    const run = implementations?.[action.name];
    Object.defineProperty(target, action.method, {
      configurable: true,
      writable: true,
      value: function generatedAction(...args) {
        const params = parameters(action, args);

        if (action.emits) {
          const event = events[action.emits];
          const allowed = this.sfEmit(action.emits, params, {
            cancelable: event?.cancelable ?? true
          });
          if (!allowed) return {
            outcome: 'refused',
            reason: 'prevented'
          };
        }

        if (typeof run !== 'function') {
          globalThis.console?.warn?.(`[SIMAI Framework] ${this.localName}: action ${action.name} has no code`);
          return {
            outcome: 'refused',
            reason: 'not-implemented'
          };
        }

        let result;

        try {
          result = run.call(this, params, {
            signal: this.sfScope
          });
        } catch (error) {
          this.reportComponentError?.(error, `action ${action.name}`);
          return {
            outcome: 'refused',
            reason: 'error'
          };
        }

        if (result && typeof result.then === 'function') {
          const signal = this.sfScope;
          return Promise.resolve(result).then(value => signal?.aborted ? {
            outcome: 'cancelled'
          } : toOutcome(value), error => {
            if (signal?.aborted || error?.name === 'AbortError') return {
              outcome: 'cancelled'
            };
            this.reportComponentError?.(error, `action ${action.name}`);
            return {
              outcome: 'refused',
              reason: 'error'
            };
          });
        }

        return toOutcome(result);
      }
    });
  }
} // The nearest closed container (§7.2.1): `hidden`, a closed <details> or
// <dialog>. What has no box in an opened container is not shown.


function isShown(element) {
  if (!element.isConnected) return false;

  for (let node = element; node && node.nodeType === 1; node = node.parentElement || node.getRootNode?.()?.host) {
    if (node.hidden) return false;
    const tag = node.localName;
    if (node !== element && (tag === 'details' || tag === 'dialog') && !node.open) return false;
  }

  return true;
}
/**
 * The class a component extends: its manifest's plumbing over `base`.
 *
 * options:
 *   base      the class to extend (the Smart base, or a trait over it);
 *   lang      `{<locale>: <lang file>}`; the `runtime` words are the element's;
 *   source    the language the component was written in (the fallback before
 *             the key; default the first file that `lang` names);
 *   aliases   the component's aliases.json;
 *   actions   `{<action>(params, {signal}) => outcome}`, the actions' code;
 *   formerWords
 *             `{since, remove_after, words: {<key>: <old key>}}`: the keys
 *             a product may still have registered its words under (the
 *             camelCase keys before §11's language files). A word registered
 *             under an old key is said until the day, noted once in
 *             SF.deprecations.
 */


function elementFromManifest(manifest, {
  base,
  lang = {},
  source,
  aliases,
  actions = {},
  formerWords
} = {}) {
  const Base = base || globalThis.SF?.smart?.SfBaseElement;
  if (typeof Base !== 'function') throw new TypeError('elementFromManifest: a base class is required');
  const read = readManifest(manifest);
  const generatedProps = propsFromManifest(manifest); // Settings that arrive after the first paint (§5.4): their skeleton holds
  // the box until they do.

  const late = [].concat(manifest.presentation?.skeleton?.late ?? []).map(name => read.members.find(member => member.name === name)).filter(Boolean);
  const words = Object.fromEntries(Object.entries(lang).map(([locale, file]) => [locale.toLowerCase(), { ...(file?.runtime || {})
  }]));
  const sourceLanguage = source || Object.keys(words)[0] || '';
  const formerKeys = formerWords?.words || {};
  const formAssociated = Boolean(read.form) && typeof globalThis.ElementInternals === 'function' && typeof globalThis.ElementInternals.prototype?.setFormValue === 'function';

  class ManifestElement extends Base {
    static get manifest() {
      return manifest;
    } // What SF.Assembly reads of a part it places (assembly/definition.mjs
    // interfaces.of): the same manifest, so a rule can ask its actions.


    static get sfInterface() {
      return manifest;
    }

    static get sfManifest() {
      return read;
    }

    static get sfWords() {
      return words;
    }

    static get formAssociated() {
      return formAssociated;
    }

    static get props() {
      return { ...super.props,
        ...generatedProps
      };
    }

    constructor() {
      super();
      this.sfInternals = formAssociated && typeof this.attachInternals === 'function' ? this.attachInternals() : null;
    }

    connectedCallback() {
      this.sfReadIsland();
      super.connectedCallback(); // A leaf outside an assembly starts with the page (§7.2.1 `now`).

      this.toggleAttribute('data-sf-started', true);
    }
    /**
     * The first values of the settings an attribute cannot hold, lists and
     * objects, from the JSON island a server prints in the host (§5.4):
     * `<script type="application/json" data-sf-settings>{"items": [...]}</script>`.
     * Read once, before the first render; an attribute or a property the page
     * set first wins. The island is taken out, so a component that reads its
     * children never meets it.
     */


    sfReadIsland() {
      const island = Array.from(this.children ?? []).find(child => child.localName === 'script' && child.hasAttribute('data-sf-settings') && /^application\/json$/iu.test(child.type));
      if (!island) return;
      island.remove();
      let data;

      try {
        data = JSON.parse(island.textContent || '{}');
      } catch (error) {
        globalThis.console?.warn?.(`[SIMAI Framework] ${this.localName}: the data-sf-settings island is not JSON`, error);
        return;
      }

      for (const [name, value] of Object.entries(isPlainObject(data) ? data : {})) {
        const member = read.members.find(one => one.name === name);

        if (!member || !member.writable || member.native) {
          globalThis.console?.warn?.(`[SIMAI Framework] ${this.localName}: the island's "${name}" is not a setting`);
          continue;
        }

        if (member.attribute ? this.hasAttribute(member.attribute) : Object.prototype.hasOwnProperty.call(this.__sfManifestData ?? {}, name)) continue;
        this[member.property] = value;
      }
    }
    /**
     * Whether the element keeps its printed skeleton (§5.4, §7.3 phase 3):
     * the host was printed with data-sf-first-paint="skeleton" and a setting
     * declared late (presentation.skeleton.late) has not arrived. The first
     * render waits for it, so the skeleton turns into content in one frame.
     * A list given explicitly, even empty, has arrived: an empty list is
     * data (the empty state), not data still to come. Only a list nobody set
     * -- its default -- keeps the skeleton waiting.
     * A component whose data comes another way (a port) overrides this.
     */


    sfAwaitingData() {
      if (!late.length || this.getAttribute('data-sf-first-paint') !== 'skeleton') return false;
      return late.some(member => {
        if (member.attribute && this.hasAttribute(member.attribute)) return false;
        const store = this.__sfManifestData;

        if (!member.attribute && store && Object.prototype.hasOwnProperty.call(store, member.name)) {
          const given = store[member.name];
          if (given !== undefined && given !== null) return false;
        } // Read through the property: a component may keep the setting itself.


        const value = this[member.property];
        return value === undefined || value === null || Array.isArray(value) && !value.length;
      });
    }
    /** §4.1: the element has a box in an opened container. */


    get shown() {
      return isShown(this);
    }
    /** §4.1: its assembly has started it (a leaf on a page, once connected). */


    get started() {
      return this.hasAttribute('data-sf-started');
    }
    /** The DOM name of a declared event (§8). */


    sfEventName(verb) {
      return read.events[verb]?.name ?? eventName(manifest, verb);
    }
    /**
     * Sends a declared event by its verb. Answers false when a listener
     * refused a cancelable one.
     */


    sfEmit(verb, detail = {}, {
      cancelable
    } = {}) {
      const event = read.events[verb];
      if (!event) globalThis.console?.warn?.(`[SIMAI Framework] ${this.localName}: event ${verb} is not declared`);
      return (0,_aliases_js__WEBPACK_IMPORTED_MODULE_0__.dispatchAliased)(this, this.sfEventName(verb), {
        detail,
        bubbles: true,
        composed: true,
        cancelable: cancelable ?? event?.cancelable ?? false
      });
    }
    /** A word of the element's own, in its language (§11, §11.1). */


    sfWord(key, {
      count,
      vars
    } = {}) {
      const former = Object.hasOwn(formerKeys, key) ? formerKeys[key] : undefined;
      const onFormer = former === undefined ? undefined : old => (0,_deprecations_js__WEBPACK_IMPORTED_MODULE_2__.noteDeprecated)({
        component: this.localName,
        tag: this.localName,
        kind: 'word',
        from: old,
        to: key,
        since: formerWords.since,
        remove_after: formerWords.remove_after
      });
      return (0,_page_language_js__WEBPACK_IMPORTED_MODULE_1__.pageWord)(words, key, this, {
        component: this.localName,
        source: sourceLanguage,
        count,
        vars,
        former,
        onFormer
      });
    }
    /** Writes a declared host state (§5.3). */


    sfHostState(name, value) {
      const type = read.hostStates[name];

      if (!type) {
        globalThis.console?.warn?.(`[SIMAI Framework] ${this.localName}: host state ${name} is not declared`);
        return;
      }

      if (type === 'boolean') {
        if (value) this.setAttribute(name, 'true');else this.removeAttribute(name);
      } else if (value === null || value === undefined || value === '') {
        this.removeAttribute(name);
      } else {
        this.setAttribute(name, String(value));
      }
    }
    /**
     * What a form gets (§17.1): the value named by `form.submits` while the
     * value named by `form.value` holds, nothing while disabled. A boolean
     * value submits only when true. A component overrides it for a value of
     * its own shape.
     */


    sfFormValue() {
      const form = read.form;
      if (!form) return null;
      if (form.disabled && this[camelName(form.disabled)]) return null;
      const value = this[camelName(form.value)];

      if (form.submits && form.submits !== form.value) {
        if (!value) return null;
        const submitted = this[camelName(form.submits)];
        return submitted === undefined || submitted === null ? null : String(submitted);
      }

      if (value === undefined || value === null || value === false) return null;
      return typeof value === 'object' ? JSON.stringify(value) : String(value);
    }
    /** Tells the form what the element holds now. */


    sfSyncForm() {
      if (!this.sfInternals) return;

      try {
        this.sfInternals.setFormValue(this.sfFormValue());
      } catch (error) {
        this.reportComponentError?.(error, 'form');
      }
    }

    get form() {
      return this.sfInternals?.form ?? null;
    }

    get labels() {
      return this.sfInternals?.labels ?? null;
    }

    get validity() {
      return this.sfInternals?.validity;
    }

    get validationMessage() {
      return this.sfInternals?.validationMessage ?? '';
    }

    get willValidate() {
      return this.sfInternals?.willValidate ?? false;
    }

    checkValidity() {
      return this.sfInternals ? this.sfInternals.checkValidity() : true;
    }

    reportValidity() {
      return this.sfInternals ? this.sfInternals.reportValidity() : true;
    }

    setCustomValidity(message = '') {
      if (!this.sfInternals) return;
      if (message) this.sfInternals.setValidity({
        customError: true
      }, String(message));else this.sfInternals.setValidity({});
    }

    formDisabledCallback(disabled) {
      this.sfFormDisabled = Boolean(disabled);
      this.requestComponentUpdate?.('form-disabled');
    }

  }

  defineMembers(ManifestElement.prototype, read.members); // connect-port is the base's (§4.1): a base without it gets it here.

  (0,_host_port_js__WEBPACK_IMPORTED_MODULE_4__.installPortAction)(ManifestElement.prototype);
  defineActions(ManifestElement.prototype, read.actions, actions, read.events); // data-sf-action="<id>.<action>" runs a declared action (§8 one page trigger).

  if (read.actions.length) (0,_page_actions_js__WEBPACK_IMPORTED_MODULE_3__.bindPageActions)();
  if (aliases) ManifestElement.aliases = aliases;
  return ManifestElement;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "f171c5ece4b4"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   connectPort: () => (/* binding */ connectPort),
/* harmony export */   installPortAction: () => (/* binding */ installPortAction),
/* harmony export */   portFromParams: () => (/* binding */ portFromParams),
/* harmony export */   portIdOf: () => (/* binding */ portIdOf),
/* harmony export */   portOf: () => (/* binding */ portOf)
/* harmony export */ });
// The base action connect-port {port} (standard simai.smart-component 1.3.8
// §4.1, §4.9): every element takes the host port it is handed, from the page
// or from the assembly it is a part of, by one method, `connectPort(port)`;
// `setHostPort(port)` is its alias.
//
// The port is kept on the instance, for its scope (§7.7): it lasts while the
// instance does and is let go when its scope ends, so an element taken out of
// the page holds no host. A component reacts through an optional hook,
// `onPortConnected(port, {signal})`, run after the port is kept; a component
// written before the base action, which overrides `setHostPort(port)` itself,
// has that override run as the hook, so it needs no change to be reached.
//
// Answers an outcome (§4.4): `{outcome: 'applied'}`; `refused` with
// `no-port` when nothing was handed, `other-port` when the port names an id
// other than the one the manifest declares, and `port-unsupported` when the
// hook throws -- the port is then not kept.
// A host adapter names its port by `id` (SF.Assembly, the port contracts) or
// by `port` (`{port, version, capabilities, raise}`, ui-pro's adapters).
function portIdOf(port) {
  if (!port || typeof port !== 'object') return '';
  if (typeof port.id === 'string' && port.id) return port.id;
  if (typeof port.port === 'string' && port.port) return port.port;
  return '';
} // connect-port takes its parameters as one object, `{port}`, or the port
// itself. An adapter whose `port` is its id (a string) is the port.

function portFromParams(params) {
  if (params && typeof params === 'object' && params.port && typeof params.port === 'object') return params.port;
  return params;
} // The port id the element's manifest declares, if any (§4.9).

function declaredPortId(element) {
  const declared = element?.constructor?.manifest?.port ?? element?.constructor?.sfInterface?.port;
  return portIdOf(declared);
}
/** The port an element holds now, or null. */


function portOf(element) {
  return element?.__sfPortEntry?.port ?? null;
}
/** connect-port {port} on `element`, with `alias` the base's own setHostPort. */

function connectPort(element, params, alias) {
  const port = portFromParams(params);
  if (!port || typeof port !== 'object') return {
    outcome: 'refused',
    reason: 'no-port'
  };
  const declared = declaredPortId(element);
  const given = portIdOf(port);
  if (declared && given && declared !== given) return {
    outcome: 'refused',
    reason: 'other-port'
  };
  const previous = element.__sfPortEntry ?? null; // Kept on the element, not in a module map: every bundle carries its own
  // copy of this module, and the element is what they share.

  const signal = element.sfScope;
  const entry = {
    port,
    signal
  };
  element.__sfPortEntry = entry; // The port lives as long as the scope it was handed in (§7.7).

  if (signal && typeof signal.addEventListener === 'function' && !signal.aborted) {
    signal.addEventListener('abort', () => {
      if (element.__sfPortEntry === entry) element.__sfPortEntry = null;
    }, {
      once: true
    });
  } // The hook. A component's own setHostPort (written before the base action)
  // is the hook when there is no onPortConnected; the guard lets such an
  // override call super.setHostPort without running itself again.


  if (element.__sfConnectingPort) return {
    outcome: 'applied'
  };
  element.__sfConnectingPort = true;

  try {
    if (typeof element.onPortConnected === 'function') {
      element.onPortConnected(port, {
        signal
      });
    } else if (typeof element.setHostPort === 'function' && element.setHostPort !== alias) {
      element.setHostPort(port);
    }
  } catch (error) {
    element.__sfPortEntry = previous;
    return {
      outcome: 'refused',
      reason: 'port-unsupported'
    };
  } finally {
    element.__sfConnectingPort = false;
  }

  element.requestComponentUpdate?.('port');
  return {
    outcome: 'applied'
  };
}
/**
 * Gives a class the base action where its base has none: `connectPort`,
 * `setHostPort` and the read-only `sfPort`.
 */

function installPortAction(proto) {
  if (!proto || typeof proto.connectPort === 'function') return;

  function setHostPort(port) {
    return connectPort(this, port, setHostPort);
  }

  Object.defineProperty(proto, 'connectPort', {
    configurable: true,
    writable: true,
    value: function connectPortAction(port) {
      return connectPort(this, port, setHostPort);
    }
  });

  if (typeof proto.setHostPort !== 'function') {
    Object.defineProperty(proto, 'setHostPort', {
      configurable: true,
      writable: true,
      value: setHostPort
    });
  }

  if (!Object.prototype.hasOwnProperty.call(proto, 'sfPort')) {
    Object.defineProperty(proto, 'sfPort', {
      configurable: true,

      get() {
        return portOf(this);
      }

    });
  }
}

/***/ },

/***/ "695f21e50358"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   instancePath: () => (/* binding */ instancePath),
/* harmony export */   partId: () => (/* binding */ partId),
/* harmony export */   pathIsSettled: () => (/* binding */ pathIsSettled)
/* harmony export */ });
// An instance's id is its role path (standard simai.smart-component 1.3.8
// §7.1.1; simai/ui-source#41).
//
//   - at the top of the page: `page/<host id or data-sf-role>`;
//   - a part with `data-sf-role` inside another instance:
//     `<parent path>/<role>`;
//   - neither: `<kind>[<n>]`, n counted in document order among the
//     instances of the same kind that have neither.
//
// Ids that templates write (`for`, `aria-controls`, `aria-labelledby`) are
// `<path with every non-word run as ->--<local name>`. A counter is never an
// id: the field ids used to come from a module-scope counter, and every
// bundle that carries the field code (eight of them) had its own, so a class
// sf-quantity and an <sf-quantity> on one page both took
// `sf-quantity-1-control` and a label pointed at the other field. Ids that
// follow creation order also swap when two instances swap, and server markup
// (§5.4) cannot repeat them. A path is read from the page, so every bundle
// gives the same answer.
//
// `kind` is the element's tag for a Smart element; class markup passes its
// root class and is told apart as `class.<root class>`.
const isElement = node => node && node.nodeType === 1 && typeof node.getAttribute === 'function';

const isCustom = node => isElement(node) && String(node.localName || '').includes('-');

function parentInstance(node) {
  for (let current = node.parentNode || node.host || null; current; current = current.parentNode || current.host || null) {
    if (isCustom(current)) return current;
  }

  return null;
}

function kindOf(owner, kind) {
  const tag = String(owner?.localName || '').toLowerCase();
  if (tag && tag.includes('-')) return tag;
  return `class.${kind || tag || 'element'}`;
}

function documentIndex(owner, kind) {
  const doc = owner?.ownerDocument;
  if (!owner?.isConnected || typeof doc?.querySelectorAll !== 'function') return 0;
  const selector = kind.startsWith('class.') ? `.${kind.slice('class.'.length)}` : kind;
  let index = 0;

  for (const one of doc.querySelectorAll(selector)) {
    if (kind.startsWith('class.') && isCustom(one)) continue;
    if (one.id || one.getAttribute('data-sf-role')) continue;
    index += 1;
    if (one === owner) return index;
  }

  return 0;
}
/** The role path of an instance (§7.1.1). */


function instancePath(owner, {
  kind = ''
} = {}) {
  const id = isElement(owner) ? String(owner.id || '').trim() : String(owner?.id || '').trim();
  if (id) return `page/${id}`;
  const role = isElement(owner) ? String(owner.getAttribute('data-sf-role') || '').trim() : '';

  if (role) {
    const parent = parentInstance(owner);
    return parent ? `${instancePath(parent, {
      kind: parent.localName
    })}/${role}` : `page/${role}`;
  }

  const resolved = kindOf(owner, kind);
  return `${resolved}[${documentIndex(owner, resolved)}]`;
}
/** An id a template writes for one of its parts: `<path as a word>--<local name>`. */

function partId(path, local) {
  const base = String(path).replace(/\W+/gu, '-').replace(/^-+|-+$/gu, '');
  return local ? `${base}--${local}` : base;
}
/** Whether the path is final: an instance in the page, or one with an id. */

function pathIsSettled(owner) {
  return Boolean(owner?.isConnected || String(owner?.id || '').trim());
}

/***/ },

/***/ "78628e837a32"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   carryLayerOrigin: () => (/* binding */ carryLayerOrigin),
/* harmony export */   closeLayer: () => (/* binding */ closeLayer),
/* harmony export */   hasLayer: () => (/* binding */ hasLayer),
/* harmony export */   hasLayerAbove: () => (/* binding */ hasLayerAbove),
/* harmony export */   isOutsideTopLayer: () => (/* binding */ isOutsideTopLayer),
/* harmony export */   isTopLayer: () => (/* binding */ isTopLayer),
/* harmony export */   landmarksAround: () => (/* binding */ landmarksAround),
/* harmony export */   layerIndex: () => (/* binding */ layerIndex),
/* harmony export */   layerZIndex: () => (/* binding */ layerZIndex),
/* harmony export */   layerZIndexAt: () => (/* binding */ layerZIndexAt),
/* harmony export */   openLayer: () => (/* binding */ openLayer),
/* harmony export */   openLayers: () => (/* binding */ openLayers),
/* harmony export */   raiseLayer: () => (/* binding */ raiseLayer),
/* harmony export */   returnLayerFocus: () => (/* binding */ returnLayerFocus),
/* harmony export */   topLayer: () => (/* binding */ topLayer),
/* harmony export */   tryFocus: () => (/* binding */ tryFocus),
/* harmony export */   updateLayer: () => (/* binding */ updateLayer)
/* harmony export */ });
// The one document layer stack (standard simai.smart-component 1.3.8 §19).
//
// Everything that draws above the page -- a modal, a drawer, a popover, a
// dropdown list, a menu, a calendar, the toast area -- registers here when it
// opens and leaves when it closes. The stack answers three questions the
// components used to answer each for itself, from three lists and two z-index
// bases:
//
//   - which layer is on top: the one opened last. Only that layer acts on
//     Escape, an outside press and Tab; a layer below stands back
//     (simai/ui-source#36: Escape over a modal opened from a drawer closed the
//     drawer, because each kept its own stack and the drawer listened first);
//   - how high each layer is drawn: one z-index scale in opening order, read
//     from the tokens --sf-z-index-layer and --sf-z-index-layer-step
//     (simai/ui-source#37: a drawer opened from a modal was drawn under it,
//     at 90 + 2i against the modal's 9000 + 2i);
//   - where focus goes when a layer closes: back to what was active when it
//     opened; if that is gone or outside the new top layer, into the new top
//     layer; else the nearest landmark; else the body. A layer that closes
//     while another stands above it moves no focus.
//
// Kept on a shared global, not in module scope: every Smart bundle carries its
// own copy of this module, and the modal's bundle has to see the drawer the
// drawer's bundle opened. Each document (an iframe too) has its own stack.
//
// A layer is any object: a custom element, or the root element of a component
// without one. One whose `isConnected` is false is passed over, so a layer
// removed without closing cannot hold every key on the page.
const STACK_KEY = Symbol.for('sf.layerStack'); // The scale's defaults, the same as core's tokens: 9000 is where the modal
// stack always started, so nothing a page draws below it changes place.

const LAYER_BASE = 9000;
const LAYER_STEP = 2;
const LANDMARKS = 'main, section, article, [role="main"], [role="region"]';

function stack() {
  const scope = globalThis;

  if (!scope[STACK_KEY]) {
    Object.defineProperty(scope, STACK_KEY, {
      value: {
        layers: [],
        bound: false,
        lease: null,
        pressTop: new WeakMap()
      },
      configurable: true
    });
  }

  return scope[STACK_KEY];
}

const isLive = entry => entry?.owner?.isConnected !== false; // A toast does not take keys or presses: the window under it keeps them.


const takesInput = entry => entry.kind !== 'toast';

function find(owner) {
  return stack().layers.find(entry => entry.owner === owner) || null;
}

function readToken(name, fallback) {
  const root = globalThis.document?.documentElement;
  if (!root || typeof globalThis.getComputedStyle !== 'function') return fallback;
  const value = parseInt(globalThis.getComputedStyle(root).getPropertyValue(name), 10);
  return Number.isFinite(value) ? value : fallback;
}
/** The z-index of the layer at a place in the stack, as a number. */


function layerZIndexAt(index) {
  if (index < 0) return '';
  return readToken('--sf-z-index-layer', LAYER_BASE) + index * readToken('--sf-z-index-layer-step', LAYER_STEP);
} // The page lock is one lease for the whole stack, taken by the first layer
// that locks the page and given back when no such layer is left -- whichever
// kind opened first and whichever closes last. A modal and a drawer held two
// locks before, and closing them out of order unlocked the page under an open
// window.

function syncPageLock() {
  const state = stack();
  const locker = state.layers.find(entry => entry.locksPage && isLive(entry));

  if (locker && !state.lease) {
    const release = locker.lockPage?.();
    state.lease = typeof release === 'function' ? release : () => {};
  } else if (!locker && state.lease) {
    const release = state.lease;
    state.lease = null;
    release();
  }
}

function sync() {
  const state = stack();
  const top = topLayer();
  state.layers.forEach((entry, index) => {
    entry.place?.({
      index,
      zIndex: layerZIndexAt(index),
      top: entry === top
    });
  });
  syncPageLock();
}
/** The layer on top: the last opened that takes keys and presses. */


function topLayer() {
  const {
    layers
  } = stack();

  for (let at = layers.length - 1; at >= 0; at -= 1) {
    if (isLive(layers[at]) && takesInput(layers[at])) return layers[at];
  }

  return null;
}
/** Whether this owner is the top layer. One that is not open is top only when nothing is. */

function isTopLayer(owner) {
  const top = topLayer();
  return top ? top.owner === owner : !find(owner);
}
function hasLayer(owner) {
  return Boolean(find(owner));
}
/** Whether a layer of one of these kinds stands above this owner. */

function hasLayerAbove(owner, kinds = ['modal', 'panel']) {
  const {
    layers
  } = stack();
  const at = layers.findIndex(entry => entry.owner === owner);
  if (at < 0) return false;
  return layers.slice(at + 1).some(entry => isLive(entry) && kinds.includes(entry.kind));
}
/** The place of this owner in the stack, -1 when it is not open. */

function layerIndex(owner) {
  return stack().layers.findIndex(entry => entry.owner === owner);
}
/** This owner's z-index, '' when it is not open. */

function layerZIndex(owner) {
  return layerZIndexAt(layerIndex(owner));
}
/** The open layers, bottom first; of one kind when `kind` is given. */

function openLayers(kind = '') {
  return stack().layers.filter(entry => !kind || entry.kind === kind).map(entry => entry.owner);
}
/**
 * Registers a layer, or raises it to the top when it is already open.
 *
 * options:
 *   kind        'modal' | 'panel' | 'surface' | 'toast'
 *   locksPage   true to hold the page lock while open; lockPage() takes it and
 *               returns the function that gives it back
 *   trapsFocus  true to keep Tab inside and to return focus on close
 *   root()      the element the layer draws, for focus and outside presses
 *   onEscape(event)  closes the layer and answers true when it took the press
 *   onTab(event)     keeps focus inside
 *   focusIn()        moves focus inside
 *   place({index, zIndex, top})  draws the layer at its height
 *   returnTo    what was active at open (default: the active element now)
 */

function openLayer(owner, options = {}) {
  if (!owner) return null;
  const state = stack();
  bindKeys();
  let entry = find(owner);

  if (entry) {
    state.layers.splice(state.layers.indexOf(entry), 1);
    Object.assign(entry, options);
  } else {
    const returnTo = options.returnTo !== undefined ? options.returnTo : globalThis.document?.activeElement ?? null;
    entry = {
      kind: 'surface',
      locksPage: false,
      trapsFocus: false,
      ...options,
      owner,
      returnTo,
      returnAncestors: landmarksAround(returnTo)
    };
  }

  state.layers.push(entry);
  sync();
  return entry;
}
/** Changes what a layer declares without moving it in the stack. */

function updateLayer(owner, options = {}) {
  const entry = find(owner);
  if (!entry) return null;
  Object.assign(entry, options);
  sync();
  return entry;
}
/** Raises an open layer to the top. */

function raiseLayer(owner) {
  const entry = find(owner);
  if (!entry) return;
  const {
    layers
  } = stack();
  layers.splice(layers.indexOf(entry), 1);
  layers.push(entry);
  sync();
}
/**
 * Removes a layer. Answers whether it was the top one. With `restoreFocus`
 * (the default) a top layer that traps focus gives focus back by §19.2.
 */

function closeLayer(owner, {
  restoreFocus = true
} = {}) {
  const entry = find(owner);
  if (!entry) return false;
  const wasTop = topLayer() === entry;
  const {
    layers
  } = stack();
  layers.splice(layers.indexOf(entry), 1);
  sync();

  if (restoreFocus && wasTop && entry.trapsFocus) {
    returnLayerFocus(true, entry.returnTo, entry.returnAncestors);
  }

  return wasTop;
}
/** The landmarks around a node, nearest first: where focus falls back to. */

function landmarksAround(node) {
  const found = [];

  for (let parent = node?.parentElement; parent; parent = parent.parentElement) {
    if (parent.matches?.(LANDMARKS)) found.push(parent);
  }

  return found;
}
/** Focuses a node if a person could reach it; answers whether it took focus. */

function tryFocus(node, temporaryTabIndex = false) {
  if (!node?.isConnected || typeof node.focus !== 'function' || node.matches?.(':disabled') || node.closest?.('[inert], [hidden], [aria-hidden="true"]') || !node.getClientRects?.().length || node.ownerDocument.defaultView.getComputedStyle(node).visibility !== 'visible') {
    return false;
  }

  const addTabIndex = temporaryTabIndex && !node.hasAttribute('tabindex');
  let observer;

  const cleanup = () => {
    observer?.disconnect();
    node.removeEventListener('blur', cleanup); // Keep an author's own change to the temporary attribute.

    if (addTabIndex && node.getAttribute('tabindex') === '-1') node.removeAttribute('tabindex');
  };

  if (addTabIndex) {
    node.setAttribute('tabindex', '-1');
    node.addEventListener('blur', cleanup, {
      once: true
    });
    observer = new node.ownerDocument.defaultView.MutationObserver(() => {
      if (!node.isConnected) cleanup();
    });
    observer.observe(node.ownerDocument.documentElement, {
      childList: true,
      subtree: true
    });
  }

  let focused = false;

  try {
    node.focus({
      preventScroll: true
    });
    focused = node.ownerDocument.activeElement === node;
    return focused;
  } catch {
    return false;
  } finally {
    // Removing tabindex while a non-native target is focused blurs it.
    if (addTabIndex && !focused) cleanup();
  }
} // The layer that owns focus now: the topmost one that traps it. A docked
// panel or an open list under the window does not.

function focusOwner() {
  const {
    layers
  } = stack();

  for (let at = layers.length - 1; at >= 0; at -= 1) {
    if (isLive(layers[at]) && layers[at].trapsFocus) return layers[at];
  }

  return null;
}
/**
 * Gives focus back after a layer closed (§19.2): to `target` when it is still
 * there and inside the layer that now owns focus (or nothing does); else into
 * that layer; else the nearest landmark; else the body. Nothing moves when the
 * closed layer was not the top one.
 */


function returnLayerFocus(wasTop, target, ancestors = []) {
  if (!wasTop) return;
  const owner = focusOwner();
  const root = owner?.root?.();
  if ((!owner || root?.contains(target)) && tryFocus(target)) return;

  if (owner) {
    owner.focusIn?.();
    return;
  }

  const doc = globalThis.document;
  if (!doc) return;
  const candidates = new Set([...ancestors, ...doc.querySelectorAll('main, [role="main"]'), doc.body]);

  for (const candidate of candidates) {
    if (tryFocus(candidate, true)) return;
  }
} // One listener pair for the whole document, whichever bundle binds it first.
// The top layer is read when the press starts (window, capture -- before any
// component's listener) and acted on when it has passed through the page
// (window, bubble): a control inside that handled Escape keeps it, and a
// surface that closed itself on the way down does not hand the same press to
// the layer under it.

function bindKeys() {
  const state = stack();
  if (state.bound || typeof globalThis.addEventListener !== 'function') return;
  state.bound = true;
  globalThis.addEventListener('keydown', event => {
    if (event.key === 'Escape' || event.key === 'Tab') state.pressTop.set(event, topLayer());
  }, true);
  globalThis.addEventListener('keydown', event => {
    if (event.key !== 'Escape' && event.key !== 'Tab' || event.defaultPrevented) return;
    const top = state.pressTop.has(event) ? state.pressTop.get(event) : topLayer();
    if (!top || top !== topLayer()) return;

    if (event.key === 'Escape') {
      if (top.onEscape?.(event)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }

      return;
    }

    top.onTab?.(event);
  });
} // A press outside the top layer, read in capture: what a layer below would
// call outside is ignored there.


function isOutsideTopLayer(event) {
  const top = topLayer();
  const root = top?.root?.();
  if (!root) return false;
  const path = event.composedPath?.() ?? [];
  return !path.includes(root) && !path.includes(top.owner);
}
const THEMES = ['theme-dark', 'theme-light'];
/**
 * A layer drawn outside its host (a portal) keeps where it came from (§19.1):
 * the host's resolved lang and dir, the theme of its nearest themed ancestor,
 * and the computed values of the host's variables that differ from those
 * where the portal stands -- `variables` by name, `prefixes` by the start of
 * the name. It looks and speaks as if it stood where its host stands.
 */

function carryLayerOrigin(portal, host, {
  variables = [],
  prefixes = []
} = {}) {
  if (!portal || !host?.isConnected) return;
  const doc = host.ownerDocument;
  const view = doc.defaultView;
  const lang = host.closest('[lang]')?.getAttribute('lang') ?? doc.documentElement.getAttribute('lang') ?? '';
  if (lang) portal.setAttribute('lang', lang);else portal.removeAttribute('lang');
  const declared = host.closest('[dir]')?.getAttribute('dir');
  const dir = declared && declared !== 'auto' ? declared : view.getComputedStyle(host).direction;
  if (dir) portal.setAttribute('dir', dir); // The theme only when the host's differs from the portal's place: a page
  // that retunes tokens on html.theme-dark keeps them, as the class would
  // otherwise declare the core's values again on the portal.

  const parent = portal.parentElement;

  const theme = node => {
    const area = node?.closest?.(THEMES.map(name => `.${name}`).join(', '));
    return area ? THEMES.find(name => area.classList.contains(name)) : '';
  };

  const carried = portal.dataset.sfLayerTheme || '';
  const wanted = theme(host) !== theme(parent) ? theme(host) : '';
  if (carried && carried !== wanted) portal.classList.remove(carried);
  if (wanted) portal.classList.add(wanted);
  if (wanted) portal.dataset.sfLayerTheme = wanted;else delete portal.dataset.sfLayerTheme;
  if (!variables.length && !prefixes.length) return;
  const own = view.getComputedStyle(host);
  const there = parent ? view.getComputedStyle(parent) : null;
  const names = new Set(variables);

  if (prefixes.length) {
    for (const name of own) {
      if (prefixes.some(prefix => name.startsWith(prefix))) names.add(name);
    }
  }

  const previous = (portal.dataset.sfLayerVariables || '').split(' ').filter(Boolean);
  const kept = [];

  for (const name of names) {
    const value = own.getPropertyValue(name).trim();

    if (value && value !== there?.getPropertyValue(name).trim()) {
      portal.style.setProperty(name, value);
      kept.push(name);
    }
  }

  for (const name of previous) if (!kept.includes(name)) portal.style.removeProperty(name);

  if (kept.length) portal.dataset.sfLayerVariables = kept.join(' ');else delete portal.dataset.sfLayerVariables;
}

/***/ },

/***/ "51e3a200cf5f"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bindPageActions: () => (/* binding */ bindPageActions),
/* harmony export */   readPageAction: () => (/* binding */ readPageAction),
/* harmony export */   runPageAction: () => (/* binding */ runPageAction)
/* harmony export */ });
// One page trigger (standard simai.smart-component 1.3.8 §8, §16.10, §19.4):
// `data-sf-action="<element id>.<action>"` on a page control runs that action
// of the element, the same method a script or a rule calls. It replaces the
// per-component triggers (`data-sf-modal-open`, `data-sf-drawer-close`, …),
// which stay as their aliases.
//
//   <button data-sf-action="confirm-delete.open">Delete</button>
//   <sf-modal id="confirm-delete">… <button data-sf-action="confirm-delete.confirm">Yes</button></sf-modal>
//
// Only an action the element's manifest declares is run: a page trigger can
// not reach the element's other methods. The action gets no parameters; a
// trigger that needs some is a script.
//
// One click listener for the document, on a shared global: every Smart bundle
// carries its own copy of this module, and a second listener would run each
// action twice.
const KEY = Symbol.for('sf.pageActions');

const camel = name => String(name).replace(/-([a-z0-9])/gu, (_, letter) => letter.toUpperCase());
/** `<id>.<action>` -> {id, action}; the action is the part after the last dot. */


function readPageAction(text) {
  const value = String(text || '').trim();
  const at = value.lastIndexOf('.');
  if (at <= 0 || at === value.length - 1) return null;
  return {
    id: value.slice(0, at),
    action: value.slice(at + 1)
  };
}
/** Runs a page trigger; answers the action's outcome, or null when nothing ran. */

function runPageAction(trigger) {
  const read = readPageAction(trigger?.getAttribute?.('data-sf-action'));
  if (!read) return null; // The element's id, or its instance id: a part an assembly placed is named
  // by its role path (§7.1.1, data-sf-instance="page/form/dialog").

  const doc = trigger.ownerDocument;
  const element = doc?.getElementById(read.id) ?? [...(doc?.querySelectorAll('[data-sf-instance]') ?? [])].find(one => one.getAttribute('data-sf-instance') === read.id);
  const declared = element?.constructor?.sfManifest?.actions ?? [];
  if (!declared.some(action => action.name === read.action)) return null;
  const method = element[camel(read.action)];
  return typeof method === 'function' ? method.call(element, {}) : null;
}
function bindPageActions(doc = globalThis.document) {
  if (!doc || typeof doc.addEventListener !== 'function') return;
  const scope = globalThis;
  if (!scope[KEY]) Object.defineProperty(scope, KEY, {
    value: new WeakSet(),
    configurable: true
  });
  if (scope[KEY].has(doc)) return;
  scope[KEY].add(doc);
  doc.addEventListener('click', event => {
    const trigger = event.target?.closest?.('[data-sf-action]');
    if (!trigger || trigger.matches(':disabled, [aria-disabled="true"]')) return;
    runPageAction(trigger);
  });
}

/***/ },

/***/ "f98b7a216869"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ddf1cdb42ecc");
/* harmony import */ var lit_directives_unsafe_html_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("7b69af8ef2e5");
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("fbe0570fcc69");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("59da34819c8b");
/* harmony import */ var _core_js_deprecations__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("06e8cd089f28");
/* harmony import */ var _core_js_instance_path__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("695f21e50358");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("e45eac6c719d");
/* harmony import */ var _component_modal_js_focus__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("c8d66dd2c299");
/* harmony import */ var _component_modal_js_closing__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("3f3a6e2680d5");
/* harmony import */ var _component_modal_js_motion__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("201fd0b17b8b");
/* harmony import */ var _component_modal_js_scroll__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("ed3ae3576d0a");
/* harmony import */ var _component_spinner_js_spinner_draw__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("50d2a204ba4c");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__("afc57055d2cc");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__("85cdf307b188");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__("66be591d2d06");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__("be0bc1a67e65");
/* harmony import */ var _component_modal_js_stack__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__("93025a68d8ab");
/* harmony import */ var _core_js_layer_stack__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__("78628e837a32");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, lit_directives_unsafe_html_js__WEBPACK_IMPORTED_MODULE_1__, _core_js_smart_base__WEBPACK_IMPORTED_MODULE_2__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_3__, _js_templates_default__WEBPACK_IMPORTED_MODULE_6__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, lit_directives_unsafe_html_js__WEBPACK_IMPORTED_MODULE_1__, _core_js_smart_base__WEBPACK_IMPORTED_MODULE_2__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_3__, _js_templates_default__WEBPACK_IMPORTED_MODULE_6__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lit_directives_unsafe_html_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lit_directives_unsafe_html_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_2__);















 // A box that holds its own overlays (sf-modal, sf-drawer); the drawer's own
// name came first and is read until the change journal retires it.

const OVERLAY_CONTAINER = "[data-sf-overlay-container], [data-sf-drawer-container]";

 // sf-modal from its component.json (standard simai.smart-component 1.3.8 §3,
// §4, §8, §19): the settings are attributes and properties made by
// core/js/element-manifest.js, the words are lang/<locale>.json (the header's
// two actions, the untitled window's name and the loading state speak the
// page's language), and the old names -- title, blur, hide, unclose, the
// modal:* events, hide() and show() -- are dated aliases in aliases.json.

const ModalElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_3__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_12__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_2___default()),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_14__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_15__
  },
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

const applied = () => ({
  outcome: "applied"
});

const refused = reason => ({
  outcome: "refused",
  reason
});

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

  static baseZIndex = 9000;
  static defaultTrueAttributes = new Set(["overlay", "show-close", "show-footer", "close-on-esc", "close-on-overlay", "preserve-scroll-gap", "preload", "dismissible"]);

  static getTopModal() {
    return (0,_component_modal_js_stack__WEBPACK_IMPORTED_MODULE_16__.getTopModalLayer)();
  } // Whether this modal is the top layer of the document: a drawer or a list
  // opened from it stands above it and takes the keys while it does.


  static isTopModal(modal) {
    return (0,_component_modal_js_stack__WEBPACK_IMPORTED_MODULE_16__.isTopModalLayer)(modal);
  }

  static getStackIndex(modal) {
    return (0,_component_modal_js_stack__WEBPACK_IMPORTED_MODULE_16__.getModalLayerIndex)(modal);
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
      (0,_component_modal_js_stack__WEBPACK_IMPORTED_MODULE_16__.addModalLayer)(modal, SfModal);
    }
  }

  static removeFromStack(modal) {
    if (!modal || modal.display === "inline") {
      return;
    }

    SfModal.stack = SfModal.stack.filter(item => item !== modal);
    SfModal.openCount = SfModal.stack.length;
    (0,_component_modal_js_stack__WEBPACK_IMPORTED_MODULE_16__.removeModalLayer)(modal);
  }

  static bringToFront(modal) {
    if (!modal || modal.display === "inline" || !SfModal.stack.includes(modal)) {
      return;
    }

    SfModal.stack = SfModal.stack.filter(item => item !== modal);
    SfModal.stack.push(modal);
    (0,_component_modal_js_stack__WEBPACK_IMPORTED_MODULE_16__.raiseModalLayer)(modal);
  }

  static updateStackStyles() {
    (0,_component_modal_js_stack__WEBPACK_IMPORTED_MODULE_16__.updateModalLayers)();
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
    this.handleCloseClick = this.handleCloseClick.bind(this);
    this.handleHideClick = this.handleHideClick.bind(this);
  }

  connectedCallback() {
    if (!this._modalId) {
      // A window without modal-id or id takes its path id (§7.1.1): sf-modal-<n>
      // in document order, not a module counter (simai/ui-source#41).
      this._modalId = this.getAttribute("modal-id") || this.id || (0,_core_js_instance_path__WEBPACK_IMPORTED_MODULE_5__.partId)((0,_core_js_instance_path__WEBPACK_IMPORTED_MODULE_5__.instancePath)(this));
    }

    super.connectedCallback();
    SfModal.registry.set(this.modalId, this);
    SfModal.bindGlobalEvents();
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
    ? node.tagName.toLowerCase() !== "template" && !node.hasAttribute("data-sf-static") : node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== "");
    if (!loose.length) return;
    if (!this._liveSlotNodes.has("content")) this._liveSlotNodes.set("content", []);

    this._liveSlotNodes.get("content").push(...loose);

    loose.forEach(node => node.remove());
  }

  disconnectedCallback() {
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
      position: this.position,
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

    return (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_17__.layerZIndexAt)(this._stackIndex);
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
      // The Framework's one spinner, in the page's look (simai/ui-source#11),
      // kept across renders so its motion does not restart; the modal sheet
      // draws its slot. The words are the page's language's, and the state
      // is a status region named by them, so it is announced, not only seen.
      const loading = this.sfWord("loading");
      return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div
          class="sf-modal-loading flex flex-col gap-2 items-cross-center content-main-center p-4"
          data-sf-modal-state="loading"
          role="status"
          aria-label=${loading}
        >
          ${this._loadingSpinnerNode()}
          <p class="m-0 text-2 color-on-surface-variant">${loading}</p>
        </div>
      `;
    }

    return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  }

  _loadingSpinnerNode() {
    if (!this._loadingSpinner) {
      this._loadingSpinner = (0,_component_spinner_js_spinner_draw__WEBPACK_IMPORTED_MODULE_11__.createInlineSpinner)({
        className: "sf-modal-spinner"
      });
    }

    return this._loadingSpinner;
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
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_6__.renderModalTemplate)(this.templateContext());
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

    (0,lit__WEBPACK_IMPORTED_MODULE_0__.render)(templateResult, this.resolveRenderTarget());
    this.afterRender(changedAttributes);
    this.runExternalHook("afterRender", {
      changedAttributes,
      root: this
    });
    this.emitComponentEvent("after-render", {
      changedAttributes
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
    // on its own panel (--sf-modal-width) into a window opened from it.

    (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_17__.carryLayerOrigin)(this._portalRoot, this, {
      variables: MODAL_VARIABLES
    });
    this._renderTarget = this._portalRoot;
    return this._portalRoot;
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
    root.style.zIndex = String(this.modalZIndex);
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
      return asked ? this.waitForAnswer(signal) : applied();
    }

    if (!this.emitModalEvent("open", {
      cancelable: true,
      phase: "before-open"
    })) {
      return refused("prevented");
    }

    if (!wasClosing) {
      this._lastActive = document.activeElement;
      this._focusReturnAncestors = (0,_component_modal_js_stack__WEBPACK_IMPORTED_MODULE_16__.captureModalFocusAncestors)(this._lastActive);
    }

    if (wasClosing) {
      this.cancelCloseTransition();
      this._releaseClosingContent?.();
      this._releaseClosingContent = null;
    }

    this._isOpen = true;
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
    (0,_component_modal_js_motion__WEBPACK_IMPORTED_MODULE_9__.scheduleModalFrame)(() => {
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
    return asked ? this.waitForAnswer(signal) : applied();
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
      return refused("closed");
    }

    const reason = typeof options?.reason === "string" ? options.reason : "api";

    if (!this.emitModalEvent("close", {
      cancelable: true,
      phase: "before-close",
      reason,
      unsaved: Boolean(this.unsaved)
    })) {
      this._answer = null;
      return refused("prevented");
    }

    this._closeReason = reason;

    if (this.display === "inline") {
      this.finishClose();
      return applied();
    }

    this._modalState = "closing";
    this._isOpen = false;
    this.requestComponentUpdate("close");
    const panel = this._root()?.querySelector("[data-sf-modal-panel]");
    this._releaseClosingContent = (0,_component_modal_js_closing__WEBPACK_IMPORTED_MODULE_8__.freezeModalContent)(panel, SfModal.isTopModal(this));
    this._closeTransitionAbort = (0,_component_modal_js_motion__WEBPACK_IMPORTED_MODULE_9__.scheduleModalClose)(() => this._root(), () => this.finishClose());
    return applied();
  } // The person accepts: the window closes and an assembly's ask answers
  // {accepted: true, reason: "close", value} (§19.4). A page button reaches it
  // with data-sf-action="<id>.confirm".


  confirm(params = {}) {
    if (!this.openState) return refused("closed");
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
      return refused(this.openState ? "minimized" : "closed");
    }

    if (!this.emitModalEvent("minimize", {
      cancelable: true,
      phase: "before-hide"
    })) {
      return refused("prevented");
    }

    this._isHidden = true;
    this.setAttribute("minimized", "");
    this.requestComponentUpdate("hide");
    this.emitModalEvent("minimized", {
      phase: "after-hide"
    });
    return applied();
  } // Brings a minimized window back (its old name is show()).


  expand() {
    if (!this.openState || this.display === "inline" || !this.hiddenState) {
      return refused(this.openState ? "expanded" : "closed");
    }

    if (!this.emitModalEvent("expand", {
      cancelable: true,
      phase: "before-show"
    })) {
      return refused("prevented");
    }

    this._isHidden = false;
    this.removeAttribute("minimized");
    this.requestComponentUpdate("show");
    this.emitModalEvent("expanded", {
      phase: "after-show"
    });
    return applied();
  }

  syncMinimizedLayer() {
    if (!this._isMounted || !this.openState || this.display === "inline" || this._modalState === "closed" || this._modalState === "closing") {
      return;
    }

    const root = this._root();

    if (this.hiddenState) {
      const wasTop = SfModal.isTopModal(this);
      (0,_component_modal_js_stack__WEBPACK_IMPORTED_MODULE_16__.removeModalLayer)(this);
      this.applyStackPosition();
      (0,_component_modal_js_stack__WEBPACK_IMPORTED_MODULE_16__.restoreModalLayerFocus)(wasTop, this._lastActive, this._focusReturnAncestors);

      if (root) {
        root.inert = true;
        root.setAttribute("aria-hidden", "true");
      }
    } else {
      if (root) {
        root.inert = false;
        root.setAttribute("aria-hidden", "false");
      }

      (0,_component_modal_js_stack__WEBPACK_IMPORTED_MODULE_16__.addModalLayer)(this, SfModal);
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
      (0,_component_modal_js_stack__WEBPACK_IMPORTED_MODULE_16__.restoreModalLayerFocus)(wasTop, this._lastActive, this._focusReturnAncestors);
    }

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
    return applied();
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
      this._releaseClosingContent = (0,_component_modal_js_closing__WEBPACK_IMPORTED_MODULE_8__.freezeModalContent)(this._root()?.querySelector("[data-sf-modal-panel]"), SfModal.isTopModal(this));
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
      this._isOpen = true;
      this._modalState = "open";

      if (this.display !== "inline") {
        SfModal.addToStack(this);
      }

      this.focusFirst();
      this.loadRemoteContentIfNeeded();
    }

    this.applyStackPosition(); // Projection can replace the panel while an existing layer remains open.

    (0,_component_modal_js_stack__WEBPACK_IMPORTED_MODULE_16__.updateModalLayers)();

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

    if (isOverlay && this.closeOnOverlay && this.dismissible && SfModal.isTopModal(this)) {
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
    (0,_component_modal_js_focus__WEBPACK_IMPORTED_MODULE_7__.trapModalFocus)(panel, event);
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
    }

    const panel = this._root()?.querySelector("[data-sf-modal-panel]");

    if (panel) {
      panel.focus();
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
    (0,_component_modal_js_stack__WEBPACK_IMPORTED_MODULE_16__.restoreModalLayerFocus)(wasTop, this._lastActive, this._focusReturnAncestors);
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
      // control that closes it is a cancel.

      SfModal.registry.get(id)?.close({
        reason: "cancelled"
      });
    });
    SfModal.globalBound = true;
  }

  static lockPage(preserveScrollGap = true) {
    if (!SfModal.lockState) SfModal.lockState = (0,_component_modal_js_scroll__WEBPACK_IMPORTED_MODULE_10__.lockModalScroll)(preserveScrollGap);
  }

  static unlockPage() {
    (0,_component_modal_js_scroll__WEBPACK_IMPORTED_MODULE_10__.unlockModalScroll)(SfModal.lockState);
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
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ddf1cdb42ecc");
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
  const isInline = context.display === 'inline';
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
  `sf-modal--positon-${context.position}`, isInline ? 'sf-modal--inline inline-block w-full' : 'fixed top-0 inline-start-0 w-full h-full z-9 p-3 items-cross-center content-main-center', context.open ? 'flex' : 'hidden', !isInline && context.animate && 'animate', context.rootClass)}
                style=${modalStyle}
                role=${isInline ? 'region' : 'dialog'}
                aria-modal=${isInline || context.minimized ? 'false' : 'true'}
                aria-hidden=${context.open && !context.minimized ? 'false' : 'true'}
                ?inert=${!context.open || context.minimized}
                aria-label=${accessibleLabel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                aria-labelledby=${accessibleLabel ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : titleId}
                data-sf-modal-id=${context.modalId}
                data-sf-modal-position=${context.position}
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
                        data-sf-modal-surface
                >
                    ${showHeader ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                                <header
                                        class=${joinClasses('sf-modal-header flex items-start min-w-0', context.headerClass)}
                                >
                                    <div class="sf-modal-header-content">${hasHeaderSlot ? context.headerContent : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<h2 id=${titleId} class="title-3 m-0">${context.title}</h2>`}</div>
                                    ${context.hide && !isInline ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                                                <button
                                                        type="button"
                                                        class=${joinClasses('sf-icon-button sf-icon-button--icon sf-modal-header-action sf-modal-hide-button sf-modal-hide-button--inline-end sf-icon-button--link sf-icon-button--on-surface sf-icon-button--size-1/3 m-0', context.hideModifier)}
                                                        aria-label=${context.minimizeText}
                                                        data-sf-modal-hide=${context.modalId}
                                                        @click=${context.onHideClick}
                                                >
                                                    <span class="sf-modal-hide-icon" aria-hidden="true"></span>
                                                </button>
                                            ` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                                    ${context.showClose ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                                                <button
                                                        type="button"
                                                        class=${joinClasses('sf-icon-button sf-modal-header-action sf-modal-close-button sf-modal-close-button--inline-end sf-icon-button--close sf-icon-button--link sf-icon-button--on-surface sf-icon-button--size-1/3 m-0', context.closeClass)}
                                                        aria-label=${context.closeText}
                                                        data-sf-modal-close=${context.modalId}
                                                        @click=${context.onCloseClick}
                                                >
                          <span
                                  class="sf-close sf-close--size-1/3 flex justify-center items-center"
                                  aria-hidden="true"
                          >
                            <span class="sf-close-icon"></span>
                          </span>
                                                </button>
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
                                    class=${joinClasses('sf-modal-body-scroll h-full min-w-0 overflow-y-auto flex flex-col gap-1 p-1/4', context.bodyClass)}
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

/***/ "7b69af8ef2e5"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit/directives/unsafe-html.js") : new Promise((resolve) => globalThis.addEventListener("sf-runtime-ready", () => resolve(globalThis.SF.runtimeModule("lit/directives/unsafe-html.js")), { once: true })));

/***/ },

/***/ "ddf1cdb42ecc"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit") : new Promise((resolve) => globalThis.addEventListener("sf-runtime-ready", () => resolve(globalThis.SF.runtimeModule("lit")), { once: true })));

/***/ },

/***/ "0d662e4d7d63"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("page-language") : new Promise((resolve) => globalThis.addEventListener("sf-runtime-ready", () => resolve(globalThis.SF.runtimeModule("page-language")), { once: true })));

/***/ },

/***/ "fbe0570fcc69"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("smart-base") : new Promise((resolve) => globalThis.addEventListener("sf-runtime-ready", () => resolve(globalThis.SF.runtimeModule("smart-base")), { once: true })));

/***/ },

/***/ "85cdf307b188"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-modal for the shim (core/js/aliases.js, standard §16 item 20). mode: same-detail (the shim sends the new and the old name), split (the old detail from the element\'s adapter), attribute-and-property, host-attribute (no shim), inverted (read by the component), retired (no new name; kept and noted by the component until the date).","component":"sf-modal","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"title","to":"heading","kind":"setting","component":"sf-modal","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","section":"§3.1, §16 item 26"},{"from":"blur","to":"backdrop-blur","kind":"setting","component":"sf-modal","since":"2026-10-27","remove_after":"2026-12-01","section":"§3.1, §4.1, §16 item 26","note":"blur is a method of HTMLElement and the base action; the attribute is mapped, the property stays the browser\'s"},{"from":"hide","to":"minimizable","kind":"attribute","component":"sf-modal","since":"2026-10-27","remove_after":"2026-12-01","section":"§3.1","note":"the attribute only: the property name hide is the old method, an action alias of minimize"},{"from":"unclose","to":"dismissible","kind":"attribute","component":"sf-modal","since":"2026-10-27","remove_after":"2026-12-01","mode":"inverted","section":"§19.3","note":"inverted: unclose present means dismissible false; the shim maps values one to one, so it refuses this row (mode-on-non-event) and sf-modal reads the attribute itself, noting it with these dates"},{"from":"aria-label","to":null,"kind":"attribute","component":"sf-modal","since":"2026-10-27","remove_after":"2026-12-01","mode":"host-attribute","section":"§3.1","note":"stays a host attribute, read by the base (§3.1, §4.8); no shim"},{"from":"modal:before-open","to":"sf-modal-open","kind":"event","component":"sf-modal","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":true,"section":"§8, vocabulary §5, §9","note":"the old detail adds component, modal and root (page elements, which §8 takes out of the new detail): the element\'s detail adapter makes it"},{"from":"modal:after-open","to":"sf-modal-opened","kind":"event","component":"sf-modal","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":false,"section":"§8, vocabulary §5, §9","note":"the old detail adds component, modal and root (page elements, which §8 takes out of the new detail): the element\'s detail adapter makes it"},{"from":"modal:before-close","to":"sf-modal-close","kind":"event","component":"sf-modal","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":true,"section":"§8, vocabulary §5, §9","note":"the old detail adds component, modal and root (page elements, which §8 takes out of the new detail): the element\'s detail adapter makes it"},{"from":"modal:after-close","to":"sf-modal-closed","kind":"event","component":"sf-modal","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":false,"section":"§8, vocabulary §5, §9","note":"the old detail adds component, modal and root (page elements, which §8 takes out of the new detail): the element\'s detail adapter makes it"},{"from":"modal:before-hide","to":"sf-modal-minimize","kind":"event","component":"sf-modal","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":true,"section":"§8, vocabulary §5, §9","note":"the old detail adds component, modal and root (page elements, which §8 takes out of the new detail): the element\'s detail adapter makes it"},{"from":"modal:after-hide","to":"sf-modal-minimized","kind":"event","component":"sf-modal","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":false,"section":"§8, vocabulary §5, §9","note":"the old detail adds component, modal and root (page elements, which §8 takes out of the new detail): the element\'s detail adapter makes it"},{"from":"modal:before-show","to":"sf-modal-expand","kind":"event","component":"sf-modal","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":true,"section":"§8, vocabulary §5, §9","note":"the old detail adds component, modal and root (page elements, which §8 takes out of the new detail): the element\'s detail adapter makes it"},{"from":"modal:after-show","to":"sf-modal-expanded","kind":"event","component":"sf-modal","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":false,"section":"§8, vocabulary §5, §9","note":"the old detail adds component, modal and root (page elements, which §8 takes out of the new detail): the element\'s detail adapter makes it"},{"from":"modal:before-content-upload","to":"sf-modal-content-upload","kind":"event","component":"sf-modal","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":false,"section":"§8, vocabulary §5, §9","note":"the old detail adds component, modal and root (page elements, which §8 takes out of the new detail): the element\'s detail adapter makes it"},{"from":"modal:after-content-upload","to":"sf-modal-content-uploaded","kind":"event","component":"sf-modal","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":false,"section":"§8, vocabulary §5, §9","note":"the old detail adds component, modal and root (page elements, which §8 takes out of the new detail): the element\'s detail adapter makes it"},{"from":"hide","to":"minimize","kind":"action","component":"sf-modal","since":"2026-10-27","remove_after":"2026-12-01","section":"vocabulary §5 minimize"},{"from":"show","to":"expand","kind":"action","component":"sf-modal","since":"2026-10-27","remove_after":"2026-12-01","section":"vocabulary §5 expand"},{"from":"getModalRoot","to":null,"kind":"action","component":"sf-modal","since":"2026-10-27","remove_after":"2026-12-01","mode":"retired","section":"§4.4, §16.13","note":"a reader retires; the method stays until the date and notes each call"},{"from":"getSlotHtml","to":null,"kind":"action","component":"sf-modal","since":"2026-10-27","remove_after":"2026-12-01","mode":"retired","section":"§4.4, §4.5, §16.13","note":"a reader retires; slots are placed, never copied; the method stays until the date and notes each call"},{"from":"modal:ready","to":null,"kind":"event","component":"sf-modal","since":"2026-10-27","remove_after":"2026-12-01","mode":"retired","section":"§4.1, §16.13","note":"a lifecycle copy; sf-after-render is the base\'s; still sent until the date, noted when a listener reads it"},{"from":"modal:update","to":null,"kind":"event","component":"sf-modal","since":"2026-10-27","remove_after":"2026-12-01","mode":"retired","section":"§4.1, §16.13","note":"a lifecycle copy; sf-after-render is the base\'s; still sent until the date, noted when a listener reads it"}]}');

/***/ },

/***/ "afc57055d2cc"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"The source of sf-modal\'s element plumbing (core/js/element-manifest.js). Taken from simai/ui-control control/smart-architecture/migration/out/modal (migration/convert-1.3.8.mjs over simai/ui-source@5100227); standard simai.smart-component 1.3.8, vocabulary 1.1.5. Every x-todo of the conversion is decided: x-decisions says how.","id":"smart.modal","tag":"sf-modal","version":"1.4.0","kind":"leaf","family":"modal","settings":{"modal-id":{"type":"id","default":""},"heading":{"type":"string","default-from":"runtime.title"},"text":{"type":"string","default":""},"autoload":{"type":"boolean","default":false},"minimizable":{"type":"boolean","default":false},"hide-modifier":{"type":"string","default":""},"overlay":{"type":"boolean","default":true},"show-header":{"type":"boolean","default":true},"show-close":{"type":"boolean","default":true},"show-footer":{"type":"boolean","default":true},"close-on-esc":{"type":"boolean","default":true},"close-on-overlay":{"type":"boolean","default":true},"preserve-scroll-gap":{"type":"boolean","default":true},"position":{"type":"enum","values":["center","left","right","inline-start","inline-end","top","bottom"],"default":"center"},"mode":{"type":"enum","values":["inline","ajax","iframe"],"default":"inline"},"display":{"type":"enum","values":["modal","inline"],"default":"modal"},"src":{"type":"string","default":""},"preload":{"type":"boolean","default":true},"fullscreen":{"type":"boolean","default":false},"width":{"type":"string","default":""},"height":{"type":"string","default":""},"backdrop-blur":{"type":"string","default":""},"blur-type":{"type":"enum","values":["none","small","medium","large"],"default":"medium"},"overlay-preset":{"type":"enum","values":["default","focus"],"default":"default"},"overlay-class":{"type":"string","default":""},"close-class":{"type":"string","default":""},"surface-class":{"type":"string","default":""},"surface-padding":{"type":"string","default":""},"panel-class":{"type":"string","default":""},"header-class":{"type":"string","default":""},"body-class":{"type":"string","default":""},"content-class":{"type":"string","default":""},"footer-class":{"type":"string","default":""},"unsaved":{"type":"boolean","default":false},"dismissible":{"type":"boolean","default":true}},"values":{"open":{"type":"boolean","default":false,"reflect":true},"minimized":{"type":"boolean","default":false,"reflect":true}},"events":{"open":{"carries":{"modal-id":"string","phase":"string"},"cancelable":true},"opened":{"carries":{"modal-id":"string","phase":"string"}},"close":{"carries":{"modal-id":"string","phase":"string","reason":{"type":"enum","values":["close","escape","outside","cancelled","api"]},"unsaved":"boolean"},"cancelable":true},"closed":{"carries":{"modal-id":"string","phase":"string","reason":{"type":"enum","values":["close","escape","outside","cancelled","api"]},"accepted":"boolean"}},"minimize":{"carries":{"modal-id":"string","phase":"string"},"cancelable":true},"minimized":{"carries":{"modal-id":"string","phase":"string"}},"expand":{"carries":{"modal-id":"string","phase":"string"},"cancelable":true},"expanded":{"carries":{"modal-id":"string","phase":"string"}},"content-upload":{"carries":{"modal-id":"string","src":"string","remote":"object"},"own-verb":true},"content-uploaded":{"carries":{"modal-id":"string","src":"string","remote":"object"},"own-verb":true}},"actions":{"open":{"with":{"animate":{"type":"boolean","optional":true}},"emits":"open","x-outcomes":["applied","refused"],"x-answer":"asked by an assembly (ask, §19.4) it answers when the window closes, with value {accepted, reason, value}"},"close":{"with":{"reason":{"type":"enum","values":["close","escape","outside","cancelled","api"]}},"emits":"close","x-outcomes":["applied","refused"]},"minimize":{"emits":"minimize","x-outcomes":["applied","refused"]},"expand":{"emits":"expand","x-outcomes":["applied","refused"]},"toggle":{"x-outcomes":["applied","refused"]},"reload-content":{"x-outcomes":["applied","refused"]},"confirm":{"with":{"value":{"type":"object","optional":true}},"x-outcomes":["applied","refused"],"x-summary":"Closes the window as the person\'s acceptance: the answer of ask is {accepted: true, reason: close, value} (§19.4)"}},"slots":{"header":{"replaces":"heading"},"content":{"default":true},"footer":{}},"layer":{"kind":"modal","locks-page":true,"traps-focus":true},"side-effects":["network","locks-page","portal"],"keyboard":{"host":{"Tab":"reach","Shift+Tab":"reach","Escape":"close"}},"templates":{"default":{"file":"js/templates/default.js","$comment":"The Lit template in JavaScript, the migration form of §5.2 (§16): the build does not compile template.html yet, so a second copy of the markup would only drift from the one that draws."}},"examples":"examples.json","docs":"docs/docs.md","lang":"lang/","accessibility":{"role":"dialog","name":{"from":["aria-label","heading"]},"keys":{"Tab":"reach","Shift+Tab":"reach","Escape":{"effect":"close","when":{"dismissible":true,"close-on-esc":true}}}},"css-variables":{"--sf-modal-background-color":{"type":"color","state":"default"},"--sf-modal-border-color":{"type":"color","state":"default"},"--sf-modal-border-width":{"type":"length","state":"default"},"--sf-modal-radius":{"type":"length","state":"default"},"--sf-modal-padding-inline":{"type":"length","state":"default"},"--sf-modal-padding-block":{"type":"length","state":"default"},"--sf-modal-gap":{"type":"length","state":"default"},"--sf-modal-footer-gap":{"type":"length","state":"default"}},"x-summary":"A dialog window over the page in the shared modal stack: centered or at a side, top or bottom edge, with header, content and footer slots, focus trap, scroll lock and focus return. It can also be minimized, load its content by Ajax or into an iframe, or render inline in the page flow.","x-source":{"package":"framework","folder":"modal","manifest":"simai/ui-source@5100227 src/smart/modal/smart.manifest.json","converted":"control/smart-architecture/stands/17-ports-migration/out/modal.component.json"},"x-words":["text"],"x-target":{"added":{"settings":["unsaved","dismissible","minimizable"],"actions":["confirm","minimize","expand"]},"replaced":{"events":["close","closed"],"actions":["open","close"]}},"x-renamed":["settings.title → heading: \\"title\\" is a property of HTMLElement.prototype (§3.1, §16 item 26), alias dated","settings.blur → backdrop-blur: \\"blur\\" is a method of HTMLElement.prototype and the base action (§3.1, §4.1, §16 item 26), alias dated","settings.hide → minimizable: one name meant a setting (show the minimize button) and an action (minimize); the attribute is a dated alias","settings.unclose → dismissible (inverted): §19.3; the attribute is read until 2026-12-01","settings.aria-label: a host attribute, read by the base, never a setting (§3.1)","settings.minimized → values.minimized: a person changes it (the minimize button), §4","actions.hide → minimize, actions.show → expand: vocabulary §5 minimize; dated action aliases","events modal:before-open/after-open/before-close/after-close → sf-modal-open/-opened/-close/-closed (vocabulary §5, §7)","events modal:before-hide/after-hide → sf-modal-minimize/-minimized; modal:before-show/after-show → sf-modal-expand/-expanded","events modal:before-content-upload/after-content-upload → sf-modal-content-upload/-uploaded (own verbs)","events modal:ready, modal:update retire (§4.1, §16.13); readers getModalRoot, getSlotHtml retire (§4.4, §16.13)"],"x-kept":{"security":{"permissions_owner":"none","untrusted_inputs":["props","children"],"network_policy":"deny"},"ownership":{"source":"simai/ui-source","data":"fixture","effects":"component","forbidden_client_responsibilities":["backend access decisions","host route invention"]},"presentation":{"themes":["light","dark"],"locales":["ru","en"],"responsive":["desktop","mobile"]},"ai_guidance":{"use_when":"Use sf-modal for one bounded task that temporarily owns the top interaction layer. It shares stack, focus return and scroll-lock ownership with ordinary Modal. Prefer center or logical inline-start/inline-end/top/bottom positions; left/right are compatibility aliases. The dialog and iframe are large surfaces on --sf-radius--surface, while compact header actions retain --sf-radius--ui. Inline display stays in document flow and does not capture focus. Minimized instances remain open but leave the visible interaction stack.","do_not":["Do not copy generated ui-smart code","Do not use Modal for a long independent workflow that belongs on its own page","Do not replace semantic spacing, motion, color or radius tokens with absolute design values","Do not assume remote or iframe content is trusted; the host owns CSP, permissions, errors and data decisions","Do not move host data or access decisions into the component"],"required_reads":["inputs","methods","events","ownership","provenance"],"minimal_example":"<sf-modal></sf-modal>","owner_commands":["npm run contract:verify","npm test"]}},"x-decisions":["own-verb-words: minimize is a verb of vocabulary §5 (modal `hide`), so minimize/minimized are not own verbs; content-upload and content-uploaded stay own verbs with their words in lang events.<verb>.label (§8, vocabulary §5.1).","alias-conflict: vocabulary 1.1.5 decides. modal:after-hide → sf-modal-minimized and modal:after-show → sf-modal-expanded (the facts of minimize and expand, vocabulary §4; `change` reports a person\'s value change only, §8), modal:before-show → sf-modal-expand (the table\'s sf-modal-minimize is the reverse act), the content events → sf-modal-content-upload(ed) (loading is not a value change). The converter\'s sf-modal-hidden/-shown/-hide/-show never shipped and get no rows.","detail-adapter: §8 takes page elements out of detail, so the new names carry {modalId, phase, …} only; each old modal:* name keeps its old detail (component, modal, root added) through a split row and the element\'s detail adapter (sfAliasAdapters), sent after the new name with one shared cancel.","version: 1.3.0 → 1.4.0, a minor while the renamed members hold dated aliases (§4.10); the major comes with the sweep after 2026-12-01.","existing-aliases: compatibility.migrations lists no alias; its note (events bubble, detail.modal names the emitter) is kept by the old names\' adapters. The undated page triggers data-sf-modal-open/close/show/hide stay as aliases of data-sf-action (§16.10).","template: templates.default names the Lit template js/templates/default.js, the migration form §5.2 allows; no template.html until the build compiles one.","examples: examples.json from studio.fixture.json and studio.scenario.json (the default window, an unclosable one, a minimizable one, a side panel); probe.json drives Tab, Shift+Tab and Escape (gate 16).","css-variables: the eight public variables the sheet already reads (src/core/contracts/public-variables.v1.json); the portal carries their computed values from the host (§19.1).","side-effects: the window draws at the end of body or of its [data-sf-overlay-container] (portal), locks the page (locks-page, one lease of the layer stack) and fetches src in mode ajax (network).","layer: kind modal, locks-page, traps-focus (§19.1, §19.2); Escape, an outside press and Tab reach it only while it is the top layer.","dismissing: the close request carries {reason, unsaved} (§19.3): close (its own button), escape, outside (the overlay), cancelled (a page control, data-sf-modal-close), api (a script); unsaved is the setting unsaved; dismissible=false (alias unclose) removes escape and outside, never an explicit action.","asking a person (§19.4): open asked by an assembly (a call with a signal) answers when the window closes with value {accepted, reason, value}; accepted is true only through the action confirm (data-sf-action=\\"<id>.confirm\\"). A page\'s own call answers at once.","instance ids (§7.1.1, simai/ui-source#41): a window without modal-id or id takes its path id (sf-modal-<n> in document order, not a module counter); the title id is <path>--title.","accessibility.name: aria-label on the host wins, else the heading (aria-labelledby the title, or aria-label when the header is a slot)."]}');

/***/ },

/***/ "66be591d2d06"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Modal","runtime":{"close":"Close","frame-failed":"Failed to load iframe content","load-failed":"Failed to load content","loading":"Loading…","minimize":"Minimize","title":"Dialog"},"events":{"content-upload":{"label":"Load content"},"content-uploaded":{"label":"Content loaded"}}}');

/***/ },

/***/ "be0bc1a67e65"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Модальное окно","runtime":{"close":"Закрыть","frame-failed":"Не удалось загрузить встроенную страницу","load-failed":"Не удалось загрузить содержимое","loading":"Загрузка…","minimize":"Свернуть","title":"Окно"},"events":{"content-upload":{"label":"Загрузить содержимое"},"content-uploaded":{"label":"Содержимое загружено"}}}');

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