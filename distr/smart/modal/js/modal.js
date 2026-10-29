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


__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

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
/* harmony import */ var _core_js_layer_stack__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__("18003344cff0");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, lit_directives_unsafe_html_js__WEBPACK_IMPORTED_MODULE_1__, _core_js_smart_base__WEBPACK_IMPORTED_MODULE_2__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_3__, _core_js_deprecations__WEBPACK_IMPORTED_MODULE_4__, _core_js_instance_path__WEBPACK_IMPORTED_MODULE_5__, _js_templates_default__WEBPACK_IMPORTED_MODULE_6__, _component_modal_js_stack__WEBPACK_IMPORTED_MODULE_16__, _core_js_layer_stack__WEBPACK_IMPORTED_MODULE_17__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, lit_directives_unsafe_html_js__WEBPACK_IMPORTED_MODULE_1__, _core_js_smart_base__WEBPACK_IMPORTED_MODULE_2__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_3__, _core_js_deprecations__WEBPACK_IMPORTED_MODULE_4__, _core_js_instance_path__WEBPACK_IMPORTED_MODULE_5__, _js_templates_default__WEBPACK_IMPORTED_MODULE_6__, _component_modal_js_stack__WEBPACK_IMPORTED_MODULE_16__, _core_js_layer_stack__WEBPACK_IMPORTED_MODULE_17__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lit_directives_unsafe_html_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lit_directives_unsafe_html_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _core_js_deprecations__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_core_js_deprecations__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _core_js_instance_path__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_core_js_instance_path__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _core_js_layer_stack__WEBPACK_IMPORTED_MODULE_17___default = /*#__PURE__*/__webpack_require__.n(_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_17__);















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

/***/ "85cdf307b188"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-modal for the shim (core/js/aliases.js, standard §16 item 20). mode: same-detail (the shim sends the new and the old name), split (the old detail from the element\'s adapter), attribute-and-property, host-attribute (no shim), inverted (read by the component), retired (no new name; kept and noted by the component until the date).","component":"sf-modal","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"title","to":"heading","kind":"setting","component":"sf-modal","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","section":"§3.1, §16 item 26"},{"from":"blur","to":"backdrop-blur","kind":"setting","component":"sf-modal","since":"2026-10-27","remove_after":"2026-12-01","section":"§3.1, §4.1, §16 item 26","note":"blur is a method of HTMLElement and the base action; the attribute is mapped, the property stays the browser\'s"},{"from":"hide","to":"minimizable","kind":"attribute","component":"sf-modal","since":"2026-10-27","remove_after":"2026-12-01","section":"§3.1","note":"the attribute only: the property name hide is the old method, an action alias of minimize"},{"from":"unclose","to":"dismissible","kind":"attribute","component":"sf-modal","since":"2026-10-27","remove_after":"2026-12-01","mode":"inverted","section":"§19.3","note":"inverted: unclose present means dismissible false; the shim maps values one to one, so it refuses this row (mode-on-non-event) and sf-modal reads the attribute itself, noting it with these dates"},{"from":"aria-label","to":null,"kind":"attribute","component":"sf-modal","since":"2026-10-27","remove_after":"2026-12-01","mode":"host-attribute","section":"§3.1","note":"stays a host attribute, read by the base (§3.1, §4.8); no shim"},{"from":"modal:before-open","to":"sf-modal-open","kind":"event","component":"sf-modal","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":true,"section":"§8, vocabulary §5, §9","note":"the old detail adds component, modal and root (page elements, which §8 takes out of the new detail): the element\'s detail adapter makes it"},{"from":"modal:after-open","to":"sf-modal-opened","kind":"event","component":"sf-modal","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":false,"section":"§8, vocabulary §5, §9","note":"the old detail adds component, modal and root (page elements, which §8 takes out of the new detail): the element\'s detail adapter makes it"},{"from":"modal:before-close","to":"sf-modal-close","kind":"event","component":"sf-modal","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":true,"section":"§8, vocabulary §5, §9","note":"the old detail adds component, modal and root (page elements, which §8 takes out of the new detail): the element\'s detail adapter makes it"},{"from":"modal:after-close","to":"sf-modal-closed","kind":"event","component":"sf-modal","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":false,"section":"§8, vocabulary §5, §9","note":"the old detail adds component, modal and root (page elements, which §8 takes out of the new detail): the element\'s detail adapter makes it"},{"from":"modal:before-hide","to":"sf-modal-minimize","kind":"event","component":"sf-modal","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":true,"section":"§8, vocabulary §5, §9","note":"the old detail adds component, modal and root (page elements, which §8 takes out of the new detail): the element\'s detail adapter makes it"},{"from":"modal:after-hide","to":"sf-modal-minimized","kind":"event","component":"sf-modal","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":false,"section":"§8, vocabulary §5, §9","note":"the old detail adds component, modal and root (page elements, which §8 takes out of the new detail): the element\'s detail adapter makes it"},{"from":"modal:before-show","to":"sf-modal-expand","kind":"event","component":"sf-modal","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":true,"section":"§8, vocabulary §5, §9","note":"the old detail adds component, modal and root (page elements, which §8 takes out of the new detail): the element\'s detail adapter makes it"},{"from":"modal:after-show","to":"sf-modal-expanded","kind":"event","component":"sf-modal","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":false,"section":"§8, vocabulary §5, §9","note":"the old detail adds component, modal and root (page elements, which §8 takes out of the new detail): the element\'s detail adapter makes it"},{"from":"modal:before-content-upload","to":"sf-modal-content-upload","kind":"event","component":"sf-modal","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":false,"section":"§8, vocabulary §5, §9","note":"the old detail adds component, modal and root (page elements, which §8 takes out of the new detail): the element\'s detail adapter makes it"},{"from":"modal:after-content-upload","to":"sf-modal-content-uploaded","kind":"event","component":"sf-modal","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":false,"section":"§8, vocabulary §5, §9","note":"the old detail adds component, modal and root (page elements, which §8 takes out of the new detail): the element\'s detail adapter makes it"},{"from":"hide","to":"minimize","kind":"action","component":"sf-modal","since":"2026-10-27","remove_after":"2026-12-01","section":"vocabulary §5 minimize"},{"from":"show","to":"expand","kind":"action","component":"sf-modal","since":"2026-10-27","remove_after":"2026-12-01","section":"vocabulary §5 expand"},{"from":"getModalRoot","to":null,"kind":"action","component":"sf-modal","since":"2026-10-27","remove_after":"2026-12-01","mode":"retired","section":"§4.4, §16.13","note":"a reader retires; the method stays until the date and notes each call"},{"from":"getSlotHtml","to":null,"kind":"action","component":"sf-modal","since":"2026-10-27","remove_after":"2026-12-01","mode":"retired","section":"§4.4, §4.5, §16.13","note":"a reader retires; slots are placed, never copied; the method stays until the date and notes each call"},{"from":"modal:ready","to":null,"kind":"event","component":"sf-modal","since":"2026-10-27","remove_after":"2026-12-01","mode":"retired","section":"§4.1, §16.13","note":"a lifecycle copy; sf-after-render is the base\'s; still sent until the date, noted when a listener reads it"},{"from":"modal:update","to":null,"kind":"event","component":"sf-modal","since":"2026-10-27","remove_after":"2026-12-01","mode":"retired","section":"§4.1, §16.13","note":"a lifecycle copy; sf-after-render is the base\'s; still sent until the date, noted when a listener reads it"}]}');

/***/ },

/***/ "afc57055d2cc"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.modal","tag":"sf-modal","version":"1.4.3","kind":"leaf","settings":{"modal-id":{"type":"id","default":""},"heading":{"type":"string","default-from":"runtime.title"},"text":{"type":"string","default":""},"autoload":{"type":"boolean","default":false},"minimizable":{"type":"boolean","default":false},"hide-modifier":{"type":"string","default":""},"overlay":{"type":"boolean","default":true},"show-header":{"type":"boolean","default":true},"show-close":{"type":"boolean","default":true},"show-footer":{"type":"boolean","default":true},"close-on-esc":{"type":"boolean","default":true},"close-on-overlay":{"type":"boolean","default":true},"preserve-scroll-gap":{"type":"boolean","default":true},"position":{"type":"enum","values":["center","left","right","inline-start","inline-end","top","bottom"],"default":"center"},"mode":{"type":"enum","values":["inline","ajax","iframe"],"default":"inline"},"display":{"type":"enum","values":["modal","inline"],"default":"modal"},"src":{"type":"string","default":""},"preload":{"type":"boolean","default":true},"fullscreen":{"type":"boolean","default":false},"width":{"type":"string","default":""},"height":{"type":"string","default":""},"backdrop-blur":{"type":"string","default":""},"blur-type":{"type":"enum","values":["none","small","medium","large"],"default":"medium"},"overlay-preset":{"type":"enum","values":["default","focus"],"default":"default"},"overlay-class":{"type":"string","default":""},"close-class":{"type":"string","default":""},"surface-class":{"type":"string","default":""},"surface-padding":{"type":"string","default":""},"panel-class":{"type":"string","default":""},"header-class":{"type":"string","default":""},"body-class":{"type":"string","default":""},"content-class":{"type":"string","default":""},"footer-class":{"type":"string","default":""},"unsaved":{"type":"boolean","default":false},"dismissible":{"type":"boolean","default":true}},"values":{"open":{"type":"boolean","default":false,"reflect":true},"minimized":{"type":"boolean","default":false,"reflect":true}},"events":{"open":{"carries":{"modal-id":"string","phase":"string"},"cancelable":true},"opened":{"carries":{"modal-id":"string","phase":"string"}},"close":{"carries":{"modal-id":"string","phase":"string","reason":{"type":"enum","values":["close","escape","outside","cancelled","api"]},"unsaved":"boolean"},"cancelable":true},"closed":{"carries":{"modal-id":"string","phase":"string","reason":{"type":"enum","values":["close","escape","outside","cancelled","api"]},"accepted":"boolean"}},"minimize":{"carries":{"modal-id":"string","phase":"string"},"cancelable":true},"minimized":{"carries":{"modal-id":"string","phase":"string"}},"expand":{"carries":{"modal-id":"string","phase":"string"},"cancelable":true},"expanded":{"carries":{"modal-id":"string","phase":"string"}},"content-upload":{"carries":{"modal-id":"string","src":"string","remote":"object"},"own-verb":true},"content-uploaded":{"carries":{"modal-id":"string","src":"string","remote":"object"},"own-verb":true}},"actions":{"open":{"with":{"animate":{"type":"boolean","optional":true}},"emits":"open","x-answer":"asked by an assembly (ask, §19.4) it answers when the window closes, with value {accepted, reason, value}"},"close":{"with":{"reason":{"type":"enum","values":["close","escape","outside","cancelled","api"]}},"emits":"close"},"minimize":{"emits":"minimize"},"expand":{"emits":"expand"},"toggle":{},"reload-content":{},"confirm":{"with":{"value":{"type":"object","optional":true}}}},"layer":{"kind":"modal","locks-page":true,"traps-focus":true},"css-variables":{"--sf-modal-background-color":{"type":"color","state":"default"},"--sf-modal-border-color":{"type":"color","state":"default"},"--sf-modal-border-width":{"type":"length","state":"default"},"--sf-modal-radius":{"type":"length","state":"default"},"--sf-modal-padding-inline":{"type":"length","state":"default"},"--sf-modal-padding-block":{"type":"length","state":"default"},"--sf-modal-gap":{"type":"length","state":"default"},"--sf-modal-footer-gap":{"type":"length","state":"default"}}}');

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