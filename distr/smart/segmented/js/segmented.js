/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "a2a9d3c2841e"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BADGE_MAIN_TONAL: () => (/* binding */ BADGE_MAIN_TONAL),
/* harmony export */   BADGE_SCHEMES: () => (/* binding */ BADGE_SCHEMES),
/* harmony export */   BADGE_SCHEME_ALIASES: () => (/* binding */ BADGE_SCHEME_ALIASES),
/* harmony export */   BADGE_SIZES: () => (/* binding */ BADGE_SIZES),
/* harmony export */   BADGE_TYPES: () => (/* binding */ BADGE_TYPES),
/* harmony export */   BADGE_VARIANTS: () => (/* binding */ BADGE_VARIANTS),
/* harmony export */   canonicalBadgeScheme: () => (/* binding */ canonicalBadgeScheme),
/* harmony export */   isRetiredMain: () => (/* binding */ isRetiredMain),
/* harmony export */   normalizeBadgeContract: () => (/* binding */ normalizeBadgeContract)
/* harmony export */ });
const BADGE_TYPES = Object.freeze(['main', 'tonal', 'outline']);
const BADGE_SCHEMES = Object.freeze(['neutral', 'primary', 'secondary', 'tertiary', 'info', 'success', 'warning', 'error', 'on-surface']); // Former scheme names that still draw: `danger` was this component's word for
// the error status before the shared vocabulary (contracts/public-api-axes.json,
// journal class-status-aliases, until 2026-12-01). It is read as `error`, so the
// Native constructor emits the canonical class, as sf-badge does; the
// stylesheet matches `.sf-badge--danger` beside it for markup written by hand.

const BADGE_SCHEME_ALIASES = Object.freeze({
  danger: 'error'
});
const BADGE_SIZES = Object.freeze(['1/3', '1/2', '1']); // The default look is tonal (owner decision C140 (1), badges study BG-1): a
// badge without an appearance is the calm grey mark. It was main, the dark
// grey fill nobody chose.

const DEFAULT_BADGE_TYPE = 'tonal';
const DEFAULT_BADGE_SCHEME = 'neutral';
const DEFAULT_BADGE_SIZE = '1/3';

const normalizeEnum = (value, allowed, fallback) => {
  const normalized = String(value ?? fallback).trim().toLowerCase();
  return allowed.includes(normalized) ? normalized : fallback;
}; // The canonical scheme for a name, a former one included; '' when the name is
// not a badge scheme.


function canonicalBadgeScheme(value) {
  const name = String(value ?? '').trim().toLowerCase();
  const canonical = BADGE_SCHEME_ALIASES[name] ?? name;
  return BADGE_SCHEMES.includes(canonical) ? canonical : '';
} // The looks that are drawn: tonal and outline in every colour, main only with
// the error status (C140 (4)).

const BADGE_VARIANTS = Object.freeze(BADGE_SCHEMES.flatMap(scheme => BADGE_TYPES.filter(type => type !== 'main' || scheme === 'error').flatMap(type => BADGE_SIZES.map(size => Object.freeze({
  type,
  scheme,
  size
}))))); // The filled look is the attention count's alone (owner decision C140 (4)):
// main with the error status. main with any other colour draws tonal; the
// spelling keeps working until this date and each use is noted in
// SF.deprecations (journal value-badge-appearance-main-to-tonal).

const BADGE_MAIN_TONAL = Object.freeze({
  since: '2026-11-14',
  remove_after: '2027-01-01'
}); // True when an appearance asked for is the filled one on a colour that draws
// it tonal: the caller notes the old spelling.

function isRetiredMain({
  type,
  scheme
} = {}) {
  const requested = String(type ?? '').trim().toLowerCase();
  return requested === 'main' && (canonicalBadgeScheme(scheme ?? DEFAULT_BADGE_SCHEME) || DEFAULT_BADGE_SCHEME) !== 'error';
}
function normalizeBadgeContract({
  type,
  scheme,
  size
} = {}) {
  let normalizedType = normalizeEnum(type, BADGE_TYPES, DEFAULT_BADGE_TYPE);
  const normalizedScheme = canonicalBadgeScheme(scheme ?? DEFAULT_BADGE_SCHEME) || DEFAULT_BADGE_SCHEME;
  const normalizedSize = normalizeEnum(size, BADGE_SIZES, DEFAULT_BADGE_SIZE); // main is the attention count's: with any other colour it is tonal. The
  // tonal on-surface badge is the grey tonal one (the stylesheet draws
  // sf-badge--on-surface tonal as neutral); it was drawn main, filled.

  if (normalizedType === 'main' && normalizedScheme !== 'error') {
    normalizedType = 'tonal';
  }

  return {
    type: normalizedType,
    scheme: normalizedScheme,
    size: normalizedSize
  };
}

/***/ },

/***/ "67eed2647f47"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bindFormReset: () => (/* binding */ bindFormReset)
/* harmony export */ });
// Reset fires before the browser restores default values. Synchronize afterwards
// without synthesizing input/change events or retaining detached controls.
//
// One capture listener per document, while a control is bound to it: the first
// binding adds it and the last release takes it away, so a removed instance
// leaves nothing on the document. It used to stay for the page's life, added
// by whichever instance bound first; when that was an instance placed after
// the page settled (a closed layer's field starting late), the instance scope
// gate read it as that instance's leak (gate 36, 2026-11-11). Every bundle
// carries its own copy of this module, so the listener and the subscriptions
// live on the document, shared by the copies: one listener, not one per bundle.
const REGISTRY = Symbol.for('sf.formReset');

function registryOf(doc) {
  let registry = doc[REGISTRY];

  if (!registry) {
    registry = {
      subscriptions: new WeakMap(),
      bound: 0,
      listener: null
    };
    Object.defineProperty(doc, REGISTRY, {
      value: registry,
      configurable: true
    });
  }

  return registry;
}

function listen(doc, registry) {
  registry.listener = event => {
    const form = event.target;
    if (form?.tagName !== 'FORM') return;
    const controls = Array.from(form.elements);
    setTimeout(() => {
      if (event.defaultPrevented) return;

      for (const control of controls) {
        if (!control.isConnected || control.form !== form) continue;

        for (const callback of registry.subscriptions.get(control) || []) callback();
      }
    }, 0);
  };

  doc.addEventListener('reset', registry.listener, true);
}

function bindFormReset(input, synchronize) {
  const doc = input.ownerDocument;
  const registry = registryOf(doc);
  if (!registry.listener) listen(doc, registry);
  let callbacks = registry.subscriptions.get(input);
  if (!callbacks) registry.subscriptions.set(input, callbacks = new Set());
  callbacks.add(synchronize);
  registry.bound += 1;
  let released = false;
  return () => {
    if (released) return false;
    released = true;
    callbacks.delete(synchronize);
    registry.bound -= 1;

    if (registry.bound <= 0 && registry.listener) {
      doc.removeEventListener('reset', registry.listener, true);
      registry.listener = null;
      registry.bound = 0;
    }

    return true;
  };
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
/* harmony export */   SPINNER_LIVE_AREA: () => (/* binding */ SPINNER_LIVE_AREA),
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
// The ring is drawn inside the icon's live area, not across its box (docs
// review R027, owner decision C11, 2026-11-07): Material Symbols draw in 20 of
// their 24 units and leave 2 of air on every side, so a ring that filled the
// box stood larger than the icon beside it. On the grid the ring's outer edge
// is the live area -- radius 9 at stroke 2, 20 units across -- and the box
// stays the icon's box, so a control that swaps its icon for the spinner moves
// nothing. The proportion is the grid's, the same at every step.
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
const SPINNER_LIVE_AREA = 20;
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
// stroke 2, every look on the ring of the live area (`inset` 2 units from the
// edge of the box); a spinner still drawn in pixels (the deprecated attributes) passes
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
  pixel = false,
  inset = 0
} = {}) {
  const cx = width / 2;
  const cy = height / 2; // The outer edge of every look: the track, the arc, the comet and the dots.

  const half = Math.max(stroke, Math.min(width, height) / 2 - inset);
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
} // The drawing on the icon grid, the one every spinner on the ladder uses: the
// ring in the icon's live area, 20 of the 24 units.

function createLadderSpinnerSvg(options = {}) {
  return createSpinnerSvg({ ...options,
    width: SPINNER_GRID,
    height: SPINNER_GRID,
    stroke: SPINNER_STROKE,
    dotRadius: null,
    pixel: false,
    inset: (SPINNER_GRID - SPINNER_LIVE_AREA) / 2
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

/***/ "2db3a835ac11"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   actionEntry: () => (/* binding */ actionEntry),
/* harmony export */   chooseBeside: () => (/* binding */ chooseBeside),
/* harmony export */   controlOf: () => (/* binding */ controlOf),
/* harmony export */   drawnBox: () => (/* binding */ drawnBox),
/* harmony export */   fitBesideMore: () => (/* binding */ fitBesideMore),
/* harmony export */   fitByPriority: () => (/* binding */ fitByPriority),
/* harmony export */   fitInOrder: () => (/* binding */ fitInOrder),
/* harmony export */   isMainAction: () => (/* binding */ isMainAction),
/* harmony export */   isPressed: () => (/* binding */ isPressed),
/* harmony export */   layoutActionRow: () => (/* binding */ layoutActionRow),
/* harmony export */   layoutHeight: () => (/* binding */ layoutHeight),
/* harmony export */   layoutRowRoom: () => (/* binding */ layoutRowRoom),
/* harmony export */   layoutWidth: () => (/* binding */ layoutWidth),
/* harmony export */   measureShown: () => (/* binding */ measureShown),
/* harmony export */   openRowMenu: () => (/* binding */ openRowMenu),
/* harmony export */   readPriority: () => (/* binding */ readPriority),
/* harmony export */   rowRoom: () => (/* binding */ rowRoom),
/* harmony export */   spanOf: () => (/* binding */ spanOf),
/* harmony export */   spanOfUnits: () => (/* binding */ spanOfUnits),
/* harmony export */   standardMenu: () => (/* binding */ standardMenu),
/* harmony export */   textWidth: () => (/* binding */ textWidth),
/* harmony export */   triggerExtra: () => (/* binding */ triggerExtra)
/* harmony export */ });
/* harmony import */ var _density_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("1412c5875b4d");
// One row of items that do not all fit, and a trailing «Ещё (n)» that holds
// the rest (owner decision C54): the items in their order up to the first
// that does not fit, each whole in the row or in «Ещё»; the items that must
// stay (the current one, the pinned ones) stay, the last kept others giving
// way to them; the room is taken with the width «Ещё (n)» will have with its
// own count. Only the arithmetic and the measuring are here -- the element
// keeps its markup, its classes and its menu entries.
//
// Taken out of sf-tabs (fix/tabs-overflow-more, C54 and its returns D1, D2)
// so a second row (sf-contents layout="bar", CT-05) lays out by the same
// rules instead of a copy of them. Every number is a width in CSS pixels,
// fractional; half a pixel is the tolerance, as the tabs measured it.

const TOLERANCE = 0.5; // The items in their order up to the first that does not fit in available:
// their indices, or null when every item fits.

function fitInOrder(widths, gap, available) {
  const kept = [];
  let used = 0;

  for (let at = 0; at < widths.length; at += 1) {
    const next = used + (kept.length ? gap : 0) + widths[at];
    if (next > available + TOLERANCE) break;
    kept.push(at);
    used = next;
  }

  return kept.length === widths.length ? null : kept;
} // The width of some items laid side by side.

function spanOf(widths, gap, indices) {
  return indices.reduce((sum, at, n) => sum + widths[at] + (n ? gap : 0), 0);
} // The row beside «Ещё», in available: the items in order, then the items that
// must stay put back in -- the last kept items that need not stay give way to
// them, and when the must-stay items alone do not fit, they give way too, the
// last first, but never the current one.

function chooseBeside({
  widths,
  gap = 0,
  available,
  must = [],
  current = -1
}) {
  let chosen = fitInOrder(widths, gap, available) ?? widths.map((_, at) => at);
  const missing = must.filter(at => !chosen.includes(at));
  if (!missing.length) return chosen;
  const next = [...chosen, ...missing];

  while (spanOf(widths, gap, next) > available + TOLERANCE) {
    const dropAt = next.slice().reverse().find(at => !must.includes(at)) ?? next.slice().reverse().find(at => at !== current);
    if (dropAt === undefined) break;
    next.splice(next.indexOf(dropAt), 1);
  }

  chosen = next.sort((a, b) => a - b);
  return chosen;
} // The row beside «Ещё (n)»: room is the row's room with the trigger standing
// as it is drawn now; extra(count) is how much wider (or narrower) the
// trigger will be with count in it. Of the rows that fit beside their own
// count, the one with the most items; when no count agrees with its row, the
// row that fits beside the widest. squeezed is the current item when it alone
// is left and still wider than the room (it alone may be shortened), else -1.

function fitBesideMore({
  widths,
  gap = 0,
  room,
  must = [],
  current = -1,
  extra = null
}) {
  let kept = null;

  if (typeof extra === 'function') {
    const besides = [];

    for (let count = 1; count < widths.length && !kept; count += 1) {
      const more = extra(count);
      besides.push(more);
      const chosen = chooseBeside({
        widths,
        gap,
        available: room - more,
        must,
        current
      });
      if (widths.length - chosen.length === count) kept = chosen;
    }

    if (!kept && besides.length) kept = chooseBeside({
      widths,
      gap,
      available: room - Math.max(...besides),
      must,
      current
    });
  }

  kept ??= chooseBeside({
    widths,
    gap,
    available: room,
    must,
    current
  });
  const squeezed = kept.length === 1 && kept[0] === current && spanOf(widths, gap, kept) > room + TOLERANCE ? current : -1;
  return {
    kept,
    squeezed
  };
} // The content box of a row that clips and has no scrollbar, in fractional
// pixels: clientWidth is a whole pixel, and a row 383.6 px wide read as 383 or
// 384 laid out differently (C54 return).

function rowRoom(list) {
  const style = getComputedStyle(list);
  const edges = ['borderInlineStartWidth', 'borderInlineEndWidth', 'paddingInlineStart', 'paddingInlineEnd'];
  return list.getBoundingClientRect().width - edges.reduce((sum, edge) => sum + (parseFloat(style[edge]) || 0), 0);
} // The width an element is laid out at, in fractional CSS pixels, before any
// transform of it or of an ancestor (its border box). getBoundingClientRect is
// a screen box: inside scale(.7) a 90 px tab reads 63, inside rotate() it reads
// the width of its rotated bounding box, and a row that compares such widths
// with its padding, a text measured in canvas or a ResizeObserver size mixes
// screen and layout pixels (docs hero study 2026-11-19, section 9). The used
// width of the computed style is the layout's own, with its fractions; a box
// without one (an inline box, an element not drawn) gives offsetWidth.

function layoutWidth(element) {
  if (!element) return 0;
  const style = getComputedStyle(element);
  const width = parseFloat(style.width);
  if (!Number.isFinite(width)) return element.offsetWidth || 0;
  if (style.boxSizing === 'border-box') return width;
  return ['paddingLeft', 'paddingRight', 'borderLeftWidth', 'borderRightWidth'].reduce((sum, edge) => sum + (parseFloat(style[edge]) || 0), width);
} // The block size of the same box (layoutWidth's other axis).

function layoutHeight(element) {
  if (!element) return 0;
  const style = getComputedStyle(element);
  const height = parseFloat(style.height);
  if (!Number.isFinite(height)) return element.offsetHeight || 0;
  if (style.boxSizing === 'border-box') return height;
  return ['paddingTop', 'paddingBottom', 'borderTopWidth', 'borderBottomWidth'].reduce((sum, edge) => sum + (parseFloat(style[edge]) || 0), height);
} // rowRoom in layout pixels: the row's content box before any transform, for a
// row whose items are measured with layoutWidth.

function layoutRowRoom(list) {
  const style = getComputedStyle(list);
  const edges = ['borderInlineStartWidth', 'borderInlineEndWidth', 'paddingInlineStart', 'paddingInlineEnd'];
  return layoutWidth(list) - edges.reduce((sum, edge) => sum + (parseFloat(style[edge]) || 0), 0);
} // A text measurer in an element's own face, or null without a canvas: the
// width «Ещё (7)» will have before its button draws it.

let measureCanvas = null;
function textWidth(element) {
  const style = getComputedStyle(element);
  measureCanvas ??= globalThis.document?.createElement('canvas') ?? null;
  const context = measureCanvas?.getContext?.('2d');
  if (!context) return null;
  context.font = style.font;
  if ('letterSpacing' in context) context.letterSpacing = style.letterSpacing === 'normal' ? '0px' : style.letterSpacing;
  return text => context.measureText(text).width;
} // extra(count) for a trigger whose text box shows label(count) now.

function triggerExtra(textBox, label) {
  const measure = textBox ? textWidth(textBox) : null;
  if (!measure) return null;
  const drawn = measure(textBox.textContent.trim());
  return count => measure(label(count)) - drawn;
} // The standard menu «Ещё» opens: sf-menu-context, a relation fetched when
// first used (SF.Loader.ensure: asked for, waited for up to 3 s, never
// thrown), one per owner and field, on the body or in the open dialog. The
// one copy in core (defect TL-8): the sortable inserter and the handle's move
// menu place theirs through it too. null when no sf-menu-context came (no
// Loader, or the relation failed): an element that never upgrades opens
// nothing. setup(menu) runs once on a new menu, for the listeners an owner
// adds beside select.

async function standardMenu(owner, field, select, {
  setup
} = {}) {
  await globalThis.SF?.Loader?.ensure?.(['sf-menu-context']);
  if (owner[field]?.isConnected) return owner[field];
  if (!globalThis.customElements?.get('sf-menu-context')) return null;
  const doc = owner.ownerDocument || globalThis.document;
  const menu = doc.createElement('sf-menu-context');
  menu.setAttribute('popup', '');
  if (select) menu.addEventListener('sf-menu-context-select', event => select(event.detail?.id, event));
  setup?.(menu);
  (owner.closest('dialog[open]') || doc.body).append(menu);
  owner[field] = menu;
  return menu;
} // ─── Rows of actions and tools (owner decision C155, 2026-11-14) ─────────────
// The one row engine of the Framework: the navigation rows above (sf-tabs,
// sf-contents, sf-menu) and the action and tool rows below (sf-header-page's
// actions, sf-input-rich's toolbar, .sf-button-group) share the measuring and
// the rule. What does not fit leaves for «Ещё»: from the end by default, by
// an author's priority where one is given (priority="1" is the most important,
// a bigger number leaves sooner, an item without one before every numbered
// item); the main action, a pressed or current item and priority="pin" never
// leave (C155 (3)). A toolbar's units are its groups: a group leaves whole and
// takes its separator with it (C155 (4)).
// An author's priority as the engine reads it: a whole number from 1, pin, or
// nothing (leaves first, the last first).

function readPriority(value) {
  if (value === null || value === undefined) return {
    rank: Infinity,
    pin: false
  };
  const text = String(value).trim().toLowerCase();
  if (text === 'pin') return {
    rank: 0,
    pin: true
  };
  const number = Number(text);
  return Number.isFinite(number) && text !== '' ? {
    rank: number,
    pin: false
  } : {
    rank: Infinity,
    pin: false
  };
} // The span of some units laid side by side: their widths, the row's gap
// between neighbours and, where two neighbours belong to different groups, a
// separator with the gap on each of its sides.

function spanOfUnits(units, gap, separator, indices) {
  let span = 0;
  indices.forEach((at, n) => {
    if (n) {
      span += gap;
      if (separator && units[indices[n - 1]].group !== units[at].group) span += separator + gap;
    }

    span += units[at].width;
  });
  return span;
} // Which units stay in a row that is room wide. units: [{width, rank, pin,
// group}] in the row's order; more: the width «Ещё» adds when it shows (its
// own width, the gap before it and, in a toolbar, its separator). Answers the
// indices that stay, in order, and the ones that left; every unit stays when
// all fit. The units that leave go by rank, the biggest first, and among equal
// ranks the last first; a pinned unit never leaves, even when the pinned ones
// alone do not fit (the row then clips, as a current tab is squeezed).

function fitByPriority({
  units,
  gap = 0,
  separator = 0,
  room,
  more = 0
}) {
  const all = units.map((_, at) => at);
  const whole = spanOfUnits(units, gap, separator, all);
  if (whole <= room + TOLERANCE) return {
    kept: all,
    out: [],
    span: whole,
    fits: true
  };
  const order = all.filter(at => !units[at].pin).sort((a, b) => units[b].rank - units[a].rank || b - a);
  const kept = all.slice();
  const out = [];

  const used = () => spanOfUnits(units, gap, separator, kept) + (kept.length ? more : more - gap);

  while (order.length && used() > room + TOLERANCE) {
    const at = order.shift();
    kept.splice(kept.indexOf(at), 1);
    out.push(at);
  }

  const span = used();
  return {
    kept,
    out: out.sort((a, b) => a - b),
    span,
    fits: span <= room + TOLERANCE
  };
} // The box an element draws: a Framework host with display: contents (sf-button,
// sf-button-icon) has none of its own, so its first drawn child's.

function drawnBox(element) {
  let box = element;

  while (box && getComputedStyle(box).display === 'contents') box = box.firstElementChild;

  return box ? box.getBoundingClientRect() : {
    width: 0,
    height: 0,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  };
} // Every element's drawn width with all of them shown, in one task: the class
// that takes an element out of the row is lifted for the measure and put back
// before anything is painted (the row never draws all its items at once).

function measureShown(elements, outClass) {
  const was = elements.map(element => element.classList.contains(outClass));

  for (const element of elements) element.classList.remove(outClass);

  const widths = elements.map(element => drawnBox(element).width);
  elements.forEach((element, at) => element.classList.toggle(outClass, was[at]));
  return widths;
} // A row of actions or tools laid out by the rule above, in one task.
// row: the flex row; units: [{element, rank, pin, group}]; more: the «Ещё»
// element (inside the row, last); moreSeparator: a separator before it (a
// toolbar's), separators: [{element, after: group}] -- a separator standing
// after a group, shown only between two groups that keep something; outClass:
// the row's own class that takes an element out (display: none); room: the
// room the row has, when it is not the row's own content box (a row sized by
// its content). Answers {out: the indices that left, fits: whether what
// stays fits the room}.

function layoutActionRow({
  row,
  units,
  more,
  moreSeparator = null,
  separators = [],
  outClass,
  room = null
}) {
  const style = getComputedStyle(row);
  const gap = parseFloat(style.columnGap) || 0;
  const elements = units.map(unit => unit.element);
  const extra = [more, moreSeparator, ...separators.map(one => one.element)].filter(Boolean);
  const widths = measureShown([...elements, ...extra], outClass);
  const moreWidth = widths[elements.length];
  const separatorWidth = separators.length || moreSeparator ? Math.max(0, ...widths.slice(elements.length + 1)) : 0;
  const measured = units.map((unit, at) => ({ ...unit,
    width: widths[at]
  }));
  const {
    out,
    fits
  } = fitByPriority({
    units: measured,
    gap,
    separator: separatorWidth,
    room: room ?? rowRoom(row),
    more: moreWidth + gap + (moreSeparator ? separatorWidth + gap : 0)
  });
  const gone = new Set(out);
  elements.forEach((element, at) => element.classList.toggle(outClass, gone.has(at))); // A separator stands after its group only while that group and a group
  // after it both keep something: an emptied group leaves with its separator,
  // and none stands first or last.

  const keeps = group => units.some((unit, at) => unit.group === group && !gone.has(at));

  const groups = [...new Set(units.map(unit => unit.group))];

  for (const {
    element,
    after
  } of separators) {
    const later = groups.slice(groups.indexOf(after) + 1);
    element.classList.toggle(outClass, !(keeps(after) && later.some(keeps)));
  }

  more?.classList.toggle(outClass, !out.length);
  moreSeparator?.classList.toggle(outClass, !out.length || gone.size === units.length);
  return {
    out,
    fits
  };
} // ─── «Ещё» of an action or tool row ──────────────────────────────────────────
// Whether an action is the row's main one: a filled sf-button (no appearance,
// or default) -- one per row (C116, C161 (3)).

function isMainAction(element) {
  if (!element?.matches?.('sf-button, .sf-button')) return false;
  const look = element.getAttribute('appearance') ?? element.getAttribute('variant');
  return look === null || look === '' || look === 'default' || look === 'filled';
} // Whether a toggle in a row is on: a pressed sf-button or icon button, or a
// button saying aria-pressed="true".

function isPressed(element) {
  if (!element) return false;
  const value = element.getAttribute('pressed');
  if (value !== null && value !== 'false') return true;
  return element.getAttribute('aria-pressed') === 'true' || element.querySelector?.(':scope > button[aria-pressed="true"]') != null;
} // The control a row item is pressed through: its own button or link.

function controlOf(element) {
  if (!element) return null;
  if (element.matches('button, a[href]')) return element;
  return element.querySelector(':scope > button, :scope > a[href], button, a[href]') || element;
} // The menu row an action of a row becomes in «Ещё»: its words, its icon, and
// a check when it is a pressed toggle (C155 (6), (7)).

function actionEntry(element, id) {
  const control = controlOf(element);
  const text = (element.getAttribute('text') || element.getAttribute('aria-label') || element.getAttribute('title') || control?.getAttribute('aria-label') || element.textContent || '').trim();
  const icon = element.getAttribute('icon-start') || element.getAttribute('icon') || element.getAttribute('icon-end') || control?.querySelector?.('.sf-icon')?.textContent.trim() || undefined;
  const entry = {
    id: String(id),
    text,
    icon: icon || undefined
  };
  const toggle = element.hasAttribute('pressed') || control?.hasAttribute?.('aria-pressed');

  if (toggle) {
    entry.kind = 'check';
    entry.checked = isPressed(element);
  }

  if (element.hasAttribute('disabled') || control?.disabled || control?.getAttribute?.('aria-disabled') === 'true') entry.disabled = true;
  return entry;
} // The «Ещё» menu of a row: the standard sf-menu-context (standardMenu), named
// «Ещё», on the row's size and density, listing entries; toggled from anchor.

async function openRowMenu(owner, {
  anchor,
  entries,
  select,
  label,
  size = '1'
}) {
  if (!entries.length) return null;
  const menu = await standardMenu(owner, '_sfRowMoreMenu', (id, event) => owner._sfRowMoreSelect?.(id, event));
  if (!menu) return null;
  owner._sfRowMoreSelect = select;
  if (label) menu.setAttribute('aria-label', label);
  menu.setAttribute('size', size);
  (0,_density_js__WEBPACK_IMPORTED_MODULE_0__.followDensity)(menu, owner);
  menu.entries = entries;
  menu.toggleFor(anchor);
  return menu;
}

/***/ },

/***/ "64feefebb417"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   THEME_ICONS: () => (/* binding */ THEME_ICONS),
/* harmony export */   cycleItems: () => (/* binding */ cycleItems),
/* harmony export */   cycleState: () => (/* binding */ cycleState),
/* harmony export */   hasCycle: () => (/* binding */ hasCycle),
/* harmony export */   loaderOwnsTheme: () => (/* binding */ loaderOwnsTheme),
/* harmony export */   nextTheme: () => (/* binding */ nextTheme),
/* harmony export */   parseCycle: () => (/* binding */ parseCycle),
/* harmony export */   preloadControlIcons: () => (/* binding */ preloadControlIcons),
/* harmony export */   preloadSwitchIcons: () => (/* binding */ preloadSwitchIcons),
/* harmony export */   pressCycle: () => (/* binding */ pressCycle),
/* harmony export */   switchIconEntries: () => (/* binding */ switchIconEntries),
/* harmony export */   themeCycleFollow: () => (/* binding */ themeCycleFollow),
/* harmony export */   themeCycleValues: () => (/* binding */ themeCycleValues),
/* harmony export */   themePreference: () => (/* binding */ themePreference),
/* harmony export */   visibleTheme: () => (/* binding */ visibleTheme),
/* harmony export */   warnCycleToggle: () => (/* binding */ warnCycleToggle),
/* harmony export */   warnThemeNotOwned: () => (/* binding */ warnThemeNotOwned)
/* harmony export */ });
// One button, several values (docs review R039, owner decision D11d;
// research ui-control control/research/2026-11-08-cycle-button.md).
//
// sf-button and sf-button-icon share this: the `cycle` setting is a list of
// items shaped like sf-segmented's items ({value, label, icon} and an
// optional `pressed`, which draws the item with the pressed look), `value`
// is the current item, and a press moves to the next item and wraps. The
// `theme-cycle` setting draws a ready theme switch over SF.Loader's theme
// (the same contract as sf-segmented's theme-switch: themePreference,
// setTheme, sf-theme-change).
//
// The name and the icon say the current value («Тема: тёмная»), the tooltip
// says the current and the next («Тема: тёмная. Нажмите — как в системе»),
// and a polite live region says the new value after a press. A cycle is a
// plain button: it carries no aria-pressed, so pressed, label-pressed and
// text-pressed are ignored beside it (with one console warning).
const THEME_VALUES = ['system', 'light', 'dark']; // «Как в системе» in a cycle is the half-dark, half-light circle (D11d): a
// monitor alone does not say a theme.

const THEME_ICONS = Object.freeze({
  system: 'contrast',
  light: 'light_mode',
  dark: 'dark_mode'
});

function parseList(source) {
  if (Array.isArray(source)) return source;
  const text = String(source ?? '').trim();
  if (!text) return [];

  if (text.startsWith('[')) {
    try {
      const parsed = JSON.parse(text);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  } // value::label::flags|… as sf-segmented's items take it; a flag icon=<name>
  // names the icon, pressed draws the pressed look.


  return text.split('|').map(entry => {
    const [value, label = value, flags = ''] = entry.split('::');
    const list = flags.split(',').map(flag => flag.trim()).filter(Boolean);
    const icon = list.find(flag => flag.startsWith('icon='));
    return {
      value: value.trim(),
      label: label.trim(),
      icon: icon ? icon.slice(5) : '',
      pressed: list.includes('pressed')
    };
  });
}
/** The cycle's items, normalised: a value each, once, in the given order. */

/** Reads the attribute's JSON or value::label::flags form; a list stays a list. */


function parseCycle(value) {
  return parseList(value);
}
function cycleItems(source) {
  const seen = new Set();
  return parseList(source).map((item, index) => {
    const one = typeof item === 'string' ? {
      value: item,
      label: item
    } : item;
    if (!one || typeof one !== 'object') return null;
    const value = String(one.value ?? one.id ?? index).trim();
    if (!value || seen.has(value)) return null;
    seen.add(value);
    return {
      value,
      label: String(one.label ?? one.text ?? value),
      icon: String(one.icon || ''),
      lang: String(one.lang || '').trim(),
      pressed: Boolean(one.pressed)
    };
  }).filter(Boolean);
}
/** The themes a theme-cycle offers: all three, or the two it names. */

function themeCycleValues(attribute) {
  const named = String(attribute ?? '').trim().toLowerCase().split(/[\s,]+/u).map(word => word === 'auto' ? 'system' : word).filter(word => THEME_VALUES.includes(word));
  const unique = [...new Set(named)]; // Two themes without «as the system» flip the visible theme; anything else
  // (empty, one word, all three) is the full cycle.

  if (unique.length === 2 && !unique.includes('system')) return ['light', 'dark'];
  return THEME_VALUES;
}

const opposite = theme => theme === 'dark' ? 'light' : 'dark';

function loader() {
  return globalThis.SF?.Loader;
}
/**
 * False when the page's host draws the theme itself and started the Loader
 * with `theme: false` (SF_BOOT_CONFIG.theme): the Loader then neither reads
 * nor sets a theme, and its `theme` stays at the value it began with.
 */


function loaderOwnsTheme() {
  return loader()?.themeEnabled !== false;
}
/**
 * The theme drawn now (light or dark), whatever the preference. The Loader's
 * own value counts only while the Loader owns the theme; under a host that
 * owns it (R076: a Docara example frame) the document says what is drawn.
 */

function visibleTheme() {
  const theme = loaderOwnsTheme() ? loader()?.theme : undefined;
  if (theme === 'dark' || theme === 'light') return theme;
  const root = globalThis.document?.documentElement;
  if (root?.classList?.contains('theme-dark')) return 'dark';
  if (root?.classList?.contains('theme-light')) return 'light';
  return globalThis.matchMedia?.('(prefers-color-scheme: dark)')?.matches ? 'dark' : 'light';
}
/** What the person chose: system, light or dark. */

function themePreference() {
  const preference = loader()?.themePreference;
  return THEME_VALUES.includes(preference) ? preference : 'system';
}
/**
 * The owner's order (D11d): first the theme opposite to the visible one,
 * then the other, then «as the system». It needs the value before the
 * current one: from an explicit theme reached from the other explicit theme
 * the next is system; from system, or from a theme the page loaded with, the
 * opposite theme. Two themes: always the opposite of the visible theme.
 */

function nextTheme({
  values,
  current,
  previous
}) {
  if (!values.includes('system')) return opposite(visibleTheme());
  if (current === 'system') return opposite(visibleTheme());
  if (previous && previous !== 'system' && previous === opposite(current)) return 'system';
  return opposite(current);
}
/**
 * The cycle state the template reads: {items, item, next, index, name,
 * tooltip}. `words(key, vars)` gives the element's words; `base` is the
 * button's own name (aria-label, or the text of an sf-button).
 */

function hasCycle(host) {
  if (host.hasAttribute('theme-cycle')) return true;
  const own = host.getProp?.('cycle');
  return Boolean(host.hasAttribute('cycle') || Array.isArray(own) && own.length);
}
function cycleState(host, {
  base = '',
  words
}) {
  if (host.hasAttribute('theme-cycle')) {
    const values = themeCycleValues(host.getAttribute('theme-cycle'));
    const two = !values.includes('system');
    const current = two ? visibleTheme() : themePreference();

    const label = value => words(`theme-${value}`);

    const items = values.map(value => ({
      value,
      label: label(value),
      icon: THEME_ICONS[value],
      lang: '',
      pressed: false
    }));
    const item = items.find(one => one.value === current) ?? items[0];
    const nextValue = nextTheme({
      values,
      current: item.value,
      previous: host.__sfCyclePrevious
    });
    const next = items.find(one => one.value === nextValue) ?? items[0];
    const title = base || words('theme');
    const now = item.value === 'system' ? words('theme-system-now', {
      vars: {
        theme: label(visibleTheme())
      }
    }) : item.label;
    const name = `${title}: ${now}`;
    return {
      theme: true,
      items,
      item,
      next,
      name,
      tooltip: words('cycle-next', {
        vars: {
          name,
          next: next.label
        }
      })
    };
  }

  const items = cycleItems(host.getProp?.('cycle') ?? host.getAttribute('cycle'));
  if (!items.length) return null;
  const at = Math.max(0, items.findIndex(one => one.value === (host.getAttribute('value') ?? '')));
  const item = items[at];
  const next = items[(at + 1) % items.length];
  const name = base ? `${base}: ${item.label}` : item.label;
  return {
    theme: false,
    items,
    item,
    next,
    name,
    tooltip: words('cycle-next', {
      vars: {
        name,
        next: next.label
      }
    })
  };
}
/** A cycle beside a toggle's settings: the toggle's are ignored, said once. */

function warnCycleToggle(host, names) {
  const given = names.filter(name => host.hasAttribute(name));
  if (!given.length || host.__sfCycleWarned) return;
  host.__sfCycleWarned = true;
  globalThis.console?.warn?.(`[SIMAI Framework] ${host.localName}: cycle and theme-cycle are not toggles; ${given.join(', ')} ignored.`);
}
/**
 * A theme cycle whose press cannot move the theme says why, once per
 * element (R076): a host that owns the theme (the Loader started with
 * `theme: false`), or no Loader at all. The button stays where it is and
 * sends no change.
 */

function warnThemeNotOwned(host) {
  if (host.__sfThemeWarned) return;
  host.__sfThemeWarned = true;
  const reason = loader() ? 'the page\'s theme belongs to its host (the Loader runs with theme: false); a host that hands the theme to the Loader makes it work (a Docara example: theme_switch=true)' : 'SF.Loader is absent';
  globalThis.console?.warn?.(`[SIMAI Framework] ${host.localName} theme-cycle: the press changes nothing: ${reason}.`);
}
/**
 * A person's press of a cycle: the next value, the change event and the
 * announcement. Answers true when it moved.
 */

function pressCycle(host, state) {
  if (!state) return false;
  const previous = state.item.value;
  const value = state.next.value; // Said after the drawing that follows: the flag first, as the drawing may
  // come at once.

  const before = host.__sfCyclePrevious;
  host.__sfCycleAnnounce = true;
  host.__sfCyclePrevious = previous;

  if (state.theme) {
    // The Loader moves the page first, so a listener of change finds the
    // page in the theme it chose; a Loader that cannot (absent, or the
    // theme switched off) leaves the cycle where it is.
    host.__sfCycleExpect = value;

    if (loader()?.setTheme?.(value) !== true) {
      warnThemeNotOwned(host);
      host.__sfCycleAnnounce = false;
      host.__sfCyclePrevious = before;
      host.__sfCycleExpect = undefined;
      return false;
    }
  } else {
    host.setAttribute('value', value);
  }

  host.requestComponentUpdate?.('value');
  const item = state.items.find(one => one.value === value) ?? null;
  host.sfEmit('change', {
    previous,
    value,
    item: item ? { ...item
    } : null
  });
  return true;
}
/**
 * sf-theme-change for a theme cycle: a theme set elsewhere (another switch,
 * SF.Loader.setTheme) starts the order afresh from what is shown.
 */

function themeCycleFollow(host) {
  if (!host.hasAttribute('theme-cycle')) return;
  const values = themeCycleValues(host.getAttribute('theme-cycle'));
  const now = values.includes('system') ? themePreference() : visibleTheme();
  if (host.__sfCycleExpect !== now) host.__sfCyclePrevious = undefined;
  host.__sfCycleExpect = undefined;
  host.requestComponentUpdate?.('theme-cycle');
} // The icons a control can switch to, asked for before it switches (R074).
// Only the icon on screen was tracked, so the first press that showed another
// one asked the subset service for a grown font on the click, and the new
// icon stayed blank while the service built it (up to ~30 s when it was busy).
// Asked for when the control is drawn, the names join the page's first icon
// request (held until the Loader is ready); a control added later costs one
// grown font off the click.

/**
 * The icon entries ({icon, filled}) a cycle, a theme cycle or a toggle can
 * show. `icons` are a toggle's own icon names: with `pressed` present they
 * are drawn filled while on, so both forms are asked for. `filled` is the
 * control's own filled setting (every form filled).
 */

function switchIconEntries(host, {
  icons = [],
  filled = false
} = {}) {
  const entries = [];

  const add = (icon, fill) => {
    const name = String(icon || '').trim();
    if (name) entries.push({
      icon: name,
      filled: Boolean(fill || filled)
    });
  };

  if (host.hasAttribute('theme-cycle')) {
    themeCycleValues(host.getAttribute('theme-cycle')).forEach(value => add(THEME_ICONS[value], false));
  } else if (hasCycle(host)) {
    cycleItems(host.getProp?.('cycle') ?? host.getAttribute('cycle')).forEach(item => add(item.icon, item.pressed));
  } else if (host.hasAttribute('pressed')) {
    icons.forEach(icon => {
      add(icon, false);
      add(icon, true);
    });
  }

  const seen = new Set();
  return entries.filter(entry => {
    const key = `${entry.icon}|${entry.filled}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
/**
 * Asks the Loader for these icon entries once per distinct list (a render
 * that draws the same items asks nothing). Answers the number of new names.
 */

function preloadControlIcons(host, entries) {
  if (!Array.isArray(entries) || !entries.length) return 0;
  const key = JSON.stringify(entries);
  if (host.__sfPreloadedIcons === key) return 0;
  const preload = loader()?.preloadIcons;
  if (typeof preload !== 'function') return 0;
  host.__sfPreloadedIcons = key;
  return preload.call(loader(), entries) || 0;
}
/** switchIconEntries, asked for. */

function preloadSwitchIcons(host, options = {}) {
  return preloadControlIcons(host, switchIconEntries(host, options));
}

/***/ },

/***/ "38ea8d53f301"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FormField: () => (/* binding */ FormField),
/* harmony export */   ShownRequired: () => (/* binding */ ShownRequired),
/* harmony export */   ShownValidity: () => (/* binding */ ShownValidity),
/* harmony export */   VALIDITY_FLAGS: () => (/* binding */ VALIDITY_FLAGS),
/* harmony export */   VALIDITY_WORDS: () => (/* binding */ VALIDITY_WORDS),
/* harmony export */   claimFirstInvalid: () => (/* binding */ claimFirstInvalid),
/* harmony export */   forgetFormTried: () => (/* binding */ forgetFormTried),
/* harmony export */   formTried: () => (/* binding */ formTried),
/* harmony export */   hasFieldWord: () => (/* binding */ hasFieldWord),
/* harmony export */   innerControlName: () => (/* binding */ innerControlName),
/* harmony export */   ownInvalid: () => (/* binding */ ownInvalid),
/* harmony export */   syncFieldValidity: () => (/* binding */ syncFieldValidity),
/* harmony export */   syncOwnValidity: () => (/* binding */ syncOwnValidity),
/* harmony export */   validityWords: () => (/* binding */ validityWords)
/* harmony export */ });
// The form-control half of a field built from its component.json (standard
// simai.smart-component 1.3.8 §17.1, §17.2), shared by the field family.
//
// core/js/element-manifest.js makes the host form-associated and gives it
// ElementInternals, sfFormValue() and sfSyncForm(). What a field adds is the
// same in every member, so it is written once here:
//
// - validity (§17.2): the host reports what its inner native control knows
//   (value-missing, too-short, pattern-mismatch, ...) with the control as the
//   anchor, so reportValidity() points at the box the person types in; a
//   custom error set with setCustomValidity() or the action set-error wins
//   until it is cleared;
// - the inner controls stay out of the page's form (§17.1 item 6): they carry
//   no name while the host is the form control;
// - a field with no inner native control to read (a list of buttons, a
//   picker, a file area) says what it knows itself with `fieldValidity()`:
//   value-missing while `required` and the form value is empty by default,
//   and where the browser points;
// - form reset and fieldset[disabled] (§17.1 items 3, 4): `form.reset()`
//   calls the component's `fieldReset()` when it has one (its default back,
//   without events), and the host syncs its form value and validity after the
//   browser has reset its parts;
// - restore: `formStateRestoreCallback` hands the saved form value to
//   `fieldRestore(state)` when the component has one.
//
// Usage, over the element core/js/element-manifest.js gives:
//
//   const Element = elementFromManifest(manifest, {base: SfBaseElement, ...});
//   class SfThing extends FormField(Element) { ... }
//
// Without ElementInternals nothing here runs, and the named inner control
// submits as it always did (§16 item 11).
// ValidityState's own flags, in the order of §17.2's list.
const VALIDITY_FLAGS = Object.freeze(['valueMissing', 'typeMismatch', 'patternMismatch', 'tooShort', 'tooLong', 'rangeUnderflow', 'rangeOverflow', 'stepMismatch', 'badInput']);
/** The name an inner native control carries: none while the host submits (§17.1 item 6). */

function innerControlName(component, name) {
  return component?.sfInternals ? '' : String(name || '');
}
/**
 * The host's validity from its inner control: the control's failed flags and
 * message, or the custom error the page set, or valid. `own` adds flags the
 * component reads itself, {flag: message} (a number field's range and step,
 * which its text box cannot know).
 */

function syncFieldValidity(component, control, own = {}) {
  const internals = component?.sfInternals;
  if (!internals) return;

  try {
    const custom = component.sfCustomError || '';

    if (custom) {
      internals.setValidity({
        customError: true
      }, custom, control || undefined);
      return;
    }

    const validity = control?.validity;
    const flags = {};
    let message = '';

    if (validity && !validity.valid && control.willValidate !== false) {
      for (const flag of VALIDITY_FLAGS) if (validity[flag]) flags[flag] = true;

      message = control.validationMessage;
    }

    for (const [flag, text] of Object.entries(own || {})) {
      flags[flag] = true;
      message ||= String(text || '');
    }

    if (Object.keys(flags).length) internals.setValidity(flags, message || ' ', control || undefined);else internals.setValidity({});
  } catch (error) {
    component.reportComponentError?.(error, 'validity');
  }
}
/**
 * The host's validity from what the component says itself (fieldValidity()):
 * value-missing, too-long (a counted field past its limit, helpers/char-count.js)
 * and the custom error the page set; `anchor`, when it is a part of the host,
 * is where the browser points.
 */

function syncOwnValidity(component, {
  valueMissing = false,
  tooLong = false,
  message = '',
  anchor = null
} = {}) {
  const internals = component?.sfInternals;
  if (!internals) return;
  const custom = component.sfCustomError || '';
  const flags = {};
  let text = '';

  if (custom) {
    flags.customError = true;
    text = custom;
  }

  if (valueMissing) {
    flags.valueMissing = true;
    text ||= message || 'value-missing';
  }

  if (tooLong) {
    flags.tooLong = true;
    text ||= message || 'too-long';
  }

  try {
    if (Object.keys(flags).length) {
      const target = anchor && component.contains?.(anchor) ? anchor : undefined;
      internals.setValidity(flags, text, target);
    } else {
      internals.setValidity({});
    }
  } catch (error) {
    component.reportComponentError?.(error, 'validity');
  }
}
/**
 * The field family's form plumbing over a manifest element. A component
 * names the control its validity comes from with `sfValidityAnchor()`
 * (default: getInputElement()).
 */

const FormField = Base => class extends Base {
  constructor() {
    super(); // A person's edit reaches the host as input/change; the form value and
    // validity follow it without a redraw.

    this.__sfFormSync = () => this.sfSyncFormState();

    this.addEventListener('input', this.__sfFormSync);
    this.addEventListener('change', this.__sfFormSync);
  }

  sfValidityAnchor() {
    return this.getInputElement?.() || null;
  }
  /**
   * What the component knows of its validity itself, {valueMissing, message,
   * anchor}, or null when an inner native control's ValidityState is the
   * answer (sfValidityAnchor()). With no such control: value-missing while
   * `required` and the form value is empty. A component overrides it.
   */


  fieldValidity() {
    if (this.sfValidityAnchor()) return null;
    const required = this.hasAttribute('required') && this.getAttribute('required') !== 'false';
    const value = this.sfFormValue?.();
    const valueMissing = required && !this.disabled && (value === null || value === undefined || value === ''); // The word only when it is said: asked on every sync, a component without
    // it warned «no word value-missing» on each optional field (simai.main,
    // sf-button-group in property-view's choice field, 2026-10-28).

    return {
      valueMissing,
      message: valueMissing ? this.sfWord?.('value-missing') || 'value-missing' : '',
      anchor: null
    };
  }
  /** The validity, now: the component's own account, or its inner control's. */


  sfSyncValidity() {
    const own = this.fieldValidity();
    if (own) syncOwnValidity(this, own);else syncFieldValidity(this, this.sfValidityAnchor());
  }
  /** The form value and the validity, now. */


  sfSyncFormState() {
    this.sfSyncForm?.();
    this.sfSyncValidity();
  }
  /** §17.2: a custom error keeps the form from submitting until it is cleared. */


  setCustomValidity(message = '') {
    this.sfCustomError = String(message ?? '');
    this.sfSyncValidity();
  } // fieldReset() puts the component's default back, without events. The
  // browser resets the parts after it calls this: the sync waits for them,
  // and once more for the parts that put their own default back a task later
  // (component/form-reset-helper.js: masks, the checkables' attributes).


  formResetCallback() {
    if (typeof this.fieldReset === 'function') {
      try {
        this.fieldReset();
      } catch (error) {
        this.reportComponentError?.(error, 'form reset');
      }
    }

    this.sfSyncFormState();
    Promise.resolve().then(() => this.sfSyncFormState());
    setTimeout(() => this.sfSyncFormState(), 0);
  }

  formStateRestoreCallback(state) {
    if (typeof this.fieldRestore === 'function') this.fieldRestore(state);
    this.sfSyncFormState();
  }

}; // The word key a failed validity flag is said with (owner decision C153 (3)):
// each component carries these words in its lang/<locale>.json runtime
// words, in the page's language (LC-9), never the browser's.

const VALIDITY_WORDS = Object.freeze({
  valueMissing: 'value-missing',
  typeMismatch: 'type-mismatch',
  patternMismatch: 'pattern-mismatch',
  tooShort: 'too-short',
  tooLong: 'too-long',
  rangeUnderflow: 'range-underflow',
  rangeOverflow: 'range-overflow',
  stepMismatch: 'step-mismatch',
  badInput: 'bad-input'
}); // One check pass across every field of a page (C153 (3)): a submit attempt,
// reportValidity() or checkValidity() fires `invalid` on every wrong field
// in tree order, synchronously. The first wrong field of a pass the person
// started (a press or Enter in this task) takes the focus; the rest show
// their errors and keep still. The fields are separate bundles, each with its
// own copy of this module, so the pass lives on a shared global.

const CHECK_KEY = Symbol.for('simai.framework.field-check');

function fieldCheck() {
  const shared = globalThis[CHECK_KEY] || (globalThis[CHECK_KEY] = {
    activated: false,
    focused: false,
    tried: new WeakSet()
  });

  if (!shared.listening && typeof document !== 'undefined') {
    shared.listening = true;

    const mark = event => {
      if (event.type === 'keydown' && event.key !== 'Enter') return;
      shared.activated = true;
      setTimeout(() => {
        shared.activated = false;
      }, 0);
    };

    document.addEventListener('click', mark, true);
    document.addEventListener('keydown', mark, true);
  }

  return shared;
}
/**
 * Says that `element` failed a check now. Returns true when it is the first
 * wrong field of a pass the person started, the one that takes the focus.
 * Every member of the field family calls it from its `invalid` listener.
 */


function claimFirstInvalid(element) {
  const check = fieldCheck();
  const form = element?.form || element?.closest?.('form') || null;
  if (form) check.tried.add(form);
  if (!check.activated || check.focused) return false;
  check.focused = true;
  setTimeout(() => {
    check.focused = false;
  }, 0);
  return true;
}
/**
 * For a member that draws its own errors on `invalid` (C153 (3)): the
 * browser's bubble is cancelled on the host and on every native control
 * inside it, `show` runs for the host's own event, and the first wrong field
 * of a submit the person made takes the focus. Returns the listener, to
 * remove with removeEventListener('invalid', listener, true).
 */

function ownInvalid(component, show) {
  fieldCheck();

  const listener = event => {
    event.preventDefault();
    if (event.target !== component) return;
    const first = claimFirstInvalid(component);
    show?.(event);

    if (first) {
      const target = component.focusDelegate?.() || component.sfValidityAnchor?.() || component;

      try {
        target.focus?.();
      } catch {
        /* a field taken out of the page while the check ran */
      }
    }
  };

  component.addEventListener('invalid', listener, true);
  return listener;
}
/** A submit attempt has failed on this field's form since its last reset. */

function formTried(element) {
  const form = element?.form || element?.closest?.('form') || null;
  return Boolean(form && fieldCheck().tried.has(form));
}
/** Forgets the failed attempt of a form (form.reset()). */

function forgetFormTried(element) {
  const form = element?.form || element?.closest?.('form') || null;
  if (form) fieldCheck().tried.delete(form);
}
/** Whether the component's dictionaries hold a word, in any language. */

function hasFieldWord(component, key) {
  const words = component?.constructor?.sfWords || {};
  return Object.values(words).some(dictionary => dictionary && dictionary[key] !== undefined && dictionary[key] !== null);
}
/**
 * The words a field says for its validity now (C153 (3)): the page's custom
 * error as written; else the first failed flag in the component's own words,
 * with the limit it broke ({min}, {max}, {step}); a type mismatch of an
 * e-mail or a web address has its own word (type-mismatch-email,
 * type-mismatch-url). A flag the component has no word for says what the
 * component itself set (its own count, range or file words), never the
 * browser's. '' while valid.
 */

function validityWords(component, control = component?.sfValidityAnchor?.()) {
  const validity = component?.validity;
  if (!validity || validity.valid) return '';
  if (validity.customError) return component.validationMessage || '';

  const read = name => control?.getAttribute?.(name) ?? component.getAttribute?.(name) ?? '';

  for (const flag of VALIDITY_FLAGS) {
    if (!validity[flag]) continue;
    let key = VALIDITY_WORDS[flag];

    if (flag === 'typeMismatch') {
      const type = String(control?.type || '').toLowerCase();
      if ((type === 'email' || type === 'url') && hasFieldWord(component, `${key}-${type}`)) key = `${key}-${type}`;
    }

    if (hasFieldWord(component, key)) {
      return component.sfWord(key, {
        vars: {
          min: read(flag === 'tooShort' ? 'minlength' : 'min'),
          max: flag === 'tooLong' ? component.maxlength ?? read('maxlength') : read('max'),
          step: read('step')
        }
      });
    }

    return component.validationMessage || '';
  }

  return component.validationMessage || '';
}
/**
 * The errors a field shows itself (owner decision C153 (3), for the whole
 * field family as C55): never the browser's bubble, always the component's
 * words in the page's language.
 *
 * - A failed check of the form -- a submit attempt, reportValidity(),
 *   checkValidity() -- shows the error on every wrong field at once, and the
 *   first wrong field of a submit the person made takes the focus
 *   (claimFirstInvalid). The browser's bubble, on the host and on the native
 *   control inside it, is cancelled.
 * - After that, or once the person has changed the value, leaving the field
 *   checks it: a wrong value shows its error, a right one clears it.
 * - While the person types, a shown error goes the moment the value is right;
 *   a still-wrong value keeps it, in the words of what is wrong now. Nothing
 *   is shown while typing into a field that showed no error.
 * - form.reset() takes every shown error away.
 *
 * The page's invalid / error-message win over it. Usage, over FormField:
 * `class SfThing extends ShownValidity(FormField(Element))`; the template
 * reads `sfShownInvalid(invalid)` and `sfShownMessage(invalid, errorMessage)`
 * instead of the bare settings. ShownRequired, its name before C153, stays
 * the same mixin.
 */

const ShownValidity = Base => class extends Base {
  constructor() {
    super();
    this.__sfErrorShown = false;
    this.__sfTouched = false; // The page-wide pass listens from the first field on, so the press that
    // submits is seen before the check it starts.

    fieldCheck(); // Capture: the host's own `invalid` and its native control's, which
    // would draw a second bubble; neither bubbles, so only capture sees both.

    this.addEventListener('invalid', event => {
      event.preventDefault();
      if (event.target !== this) return;
      const first = claimFirstInvalid(this);

      if (!this.__sfErrorShown) {
        this.__sfErrorShown = true;
        this.requestComponentUpdate?.('invalid');
      } else {
        this.requestComponentUpdate?.('validity');
      }

      if (first) this.sfFocusFirstInvalid();
    }, true);
    this.addEventListener('input', () => {
      this.__sfTouched = true;
    });
    this.addEventListener('change', () => {
      this.__sfTouched = true;
    });
    this.addEventListener('focusout', event => {
      if (event.relatedTarget && this.contains(event.relatedTarget)) return; // A layer of the field (a list, a picker) holds the focus for it.

      if (this.matches?.(':focus-within')) return;
      if (!this.__sfTouched && !formTried(this)) return;
      this.sfSyncValidity?.();
      const wrong = this.validity ? !this.validity.valid : false;

      if (wrong !== this.__sfErrorShown) {
        this.__sfErrorShown = wrong;
        this.requestComponentUpdate?.('validity');
      } else if (wrong) {
        this.requestComponentUpdate?.('validity');
      }
    });
  }
  /** The first wrong field of a submit takes the focus, as the browser's check did. */


  sfFocusFirstInvalid() {
    const target = this.focusDelegate?.() || this.sfValidityAnchor?.() || this;

    try {
      target.focus?.();
    } catch {
      /* a field taken out of the page while the check ran */
    }
  } // A shown error goes the moment the value is right, whatever made it right:
  // the person's input or change, a value set from script, a value attribute
  // (C55 acceptance F1 R2, D1). A still-wrong value redraws its words.


  sfSyncFormState() {
    super.sfSyncFormState?.();
    if (!this.__sfErrorShown) return;

    if (this.validity && !this.validity.valid) {
      const words = validityWords(this);

      if (words !== this.__sfShownWords) {
        this.__sfShownWords = words;
        this.requestComponentUpdate?.('validity');
      }

      return;
    }

    this.__sfErrorShown = false;
    this.__sfShownWords = '';
    this.requestComponentUpdate?.('value');
  }
  /** An error is shown now (the page's own invalid aside). */


  get sfErrorShown() {
    return this.__sfErrorShown;
  }
  /** The name before C153, kept for the components that read it. */


  get sfMissingShown() {
    return this.__sfErrorShown;
  }
  /** The invalid state the field draws: the page's, or the one it shows itself. */


  sfShownInvalid(invalid) {
    return Boolean(invalid) || this.__sfErrorShown;
  }
  /** The message under the field: the page's while it says invalid, else the shown error's words. */


  sfShownMessage(invalid, errorMessage) {
    if (invalid) return errorMessage || '';
    if (!this.__sfErrorShown) return '';
    const words = validityWords(this);
    this.__sfShownWords = words;
    return words;
  }

  formResetCallback() {
    const shown = this.__sfErrorShown;
    this.__sfErrorShown = false;
    this.__sfTouched = false;
    this.__sfShownWords = '';
    forgetFormTried(this);
    super.formResetCallback?.();
    if (shown) this.requestComponentUpdate?.('reset');
  }

};
/** The mixin's name before owner decision C153 (C55 acceptance F1). */

const ShownRequired = ShownValidity;

/***/ },

/***/ "b30ec5bc0edb"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   OPTION_BADGE_HUES: () => (/* binding */ OPTION_BADGE_HUES),
/* harmony export */   OPTION_BADGE_PALETTE: () => (/* binding */ OPTION_BADGE_PALETTE),
/* harmony export */   nearestPaletteHue: () => (/* binding */ nearestPaletteHue),
/* harmony export */   optionBadgeProps: () => (/* binding */ optionBadgeProps),
/* harmony export */   optionDotColor: () => (/* binding */ optionDotColor)
/* harmony export */ });
/* harmony import */ var _component_badges_js_contract_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("a2a9d3c2841e");

const HEX_COLOR = /^#(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i; // The hues of the static palette (owner decision C17), each with the OKLCH hue
// angle of its tone 50 (src/core/scss/_sf_static_palette.scss, rounded to the
// degree; tests/option-badge-palette.contract.test.mjs holds the two equal).
// Brown and gray are not reached from a hex: brown sits between orange and
// amber and differs from them by chroma alone, which a light or a dark hex
// does not keep; a colour with less chroma than GREY_CHROMA is gray. Both are
// reached by name.

const OPTION_BADGE_HUES = Object.freeze({
  red: 28,
  orange: 47,
  amber: 60,
  yellow: 89,
  lime: 119,
  green: 144,
  teal: 173,
  cyan: 203,
  sky: 232,
  blue: 259,
  indigo: 279,
  violet: 299,
  purple: 320,
  pink: 347
});
const OPTION_BADGE_PALETTE = Object.freeze([...Object.keys(OPTION_BADGE_HUES), "brown", "gray"]);
const GREY_CHROMA = 0.03;

const linear = channel => {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}; // {chroma, hue} in OKLCH of a #rgb[a] / #rrggbb[aa]; the alpha is not read.


function oklchOf(hex) {
  let digits = hex.slice(1);
  if (digits.length < 6) digits = [...digits].map(digit => digit + digit).join("");
  const [r, g, b] = [0, 2, 4].map(at => linear(parseInt(digits.slice(at, at + 2), 16)));
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return {
    chroma: Math.hypot(a, bb),
    hue: (Math.atan2(bb, a) * 180 / Math.PI + 360) % 360
  };
}
/** The static palette hue nearest a hex colour: gray when it has no hue to speak of. */


function nearestPaletteHue(hex) {
  const {
    chroma,
    hue
  } = oklchOf(hex);
  if (chroma < GREY_CHROMA) return "gray";
  let best = "gray";
  let distance = Infinity;

  for (const [name, angle] of Object.entries(OPTION_BADGE_HUES)) {
    const apart = Math.abs((hue - angle + 540) % 360 - 180);

    if (apart < distance) {
      best = name;
      distance = apart;
    }
  }

  return best;
} // The fill of a hue: tone 50 at the fill step 24 (C43: no new tones or steps;
// the alpha scale's fill family), over the place in both themes, as the 24 %
// mix of the data's hex was. The text stays on the surface colour, so the
// label reads the same in both themes. Written to the badge's public
// variables, --sf-badge-background-color and --sf-badge-color (owner decision
// C140 (2), BG-7): a colour from data reaches the badge only through them and
// only as a palette step, never the author's hex.

const paletteStyle = hue => `--sf-badge-background-color: var(--sf-${hue}-50--alfa-24); --sf-badge-color: var(--sf-on-surface)`;
/**
 * Badge look for a filter option with optionRenderer 'badge'. option.color is
 * a Framework badge scheme (success, error, info...), a hue of the static
 * palette (red, teal, gray...; C17) or a hex colour. A hue tints the badge with
 * its own palette step; a hex is drawn in the palette hue nearest it, never as
 * the raw colour (C18, C43; badges study BG-7), so the label stays readable in
 * both themes. Anything else is neutral.
 */
// The data view port names the badge look `scheme` on a column's options; a
// filter option has always said `color`. Both are read: reading only `color`
// left every port column's scheme unread and its badges neutral.


function optionBadgeProps(option = {}) {
  const raw = option?.scheme ?? option?.color;
  const color = typeof raw === "string" ? raw.trim() : ""; // A former name (danger) reads as its canonical scheme (error).

  const scheme = (0,_component_badges_js_contract_js__WEBPACK_IMPORTED_MODULE_0__.canonicalBadgeScheme)(color);
  if (scheme) return {
    scheme,
    rootStyle: ""
  };
  const name = color.toLowerCase();
  if (OPTION_BADGE_PALETTE.includes(name)) return {
    scheme: "neutral",
    rootStyle: paletteStyle(name)
  };
  if (HEX_COLOR.test(color)) return {
    scheme: "neutral",
    rootStyle: paletteStyle(nearestPaletteHue(color))
  };
  return {
    scheme: "neutral",
    rootStyle: ""
  };
} // The colour of an option drawn as a circle (FO4-1, FO4-2: option-look dot):
// a scheme its role colour, a hue of the static palette its tone 50, a hex or
// a CSS colour itself (the circle is a sample of the colour, not text on it);
// neutral the outline colour. '' when nothing is given.

const SCHEME_INK = Object.freeze({
  neutral: "--sf-outline",
  "on-surface": "--sf-on-surface-variant"
});
function optionDotColor(option = {}) {
  const raw = option?.color ?? option?.scheme ?? option?.swatch;
  const color = typeof raw === "string" ? raw.trim() : "";
  if (!color) return "";
  const scheme = (0,_component_badges_js_contract_js__WEBPACK_IMPORTED_MODULE_0__.canonicalBadgeScheme)(color);
  if (scheme) return `var(${SCHEME_INK[scheme] ?? `--sf-${scheme}`})`;
  const name = color.toLowerCase();
  if (OPTION_BADGE_PALETTE.includes(name)) return `var(--sf-${name}-50)`;
  return color;
}

/***/ },

/***/ "6cafe904bdec"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   normalizeItems: () => (/* binding */ normalizeItems),
/* harmony export */   parseItems: () => (/* binding */ parseItems)
/* harmony export */ });
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("cd371843857e");
/* harmony import */ var _core_js_control_spacing__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("9abcb852f1cf");
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("d3818183b14c");
/* harmony import */ var _component_form_reset_helper__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("67eed2647f47");
/* harmony import */ var _helpers_form_field__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("38ea8d53f301");
/* harmony import */ var _core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("e92fd2d1a38c");
/* harmony import */ var _helpers_cycle__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("64feefebb417");
/* harmony import */ var _core_js_overflow_row_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("2db3a835ac11");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("9e8a0d4d39c8");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("58fa7b09c477");
/* harmony import */ var _lang_index_mjs__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__("dc257f02dfa6");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_2__, _core_js_control_spacing__WEBPACK_IMPORTED_MODULE_3__, _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_4__, _core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_7__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_2__, _core_js_control_spacing__WEBPACK_IMPORTED_MODULE_3__, _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_4__, _core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_7__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_control_spacing__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_core_js_control_spacing__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_7__);












 // Only the words on screen ship in the bundle, English only (owner decision
// C282): Russian and every other language come from a language file. The
// title, settings and events stay in the language files for the Studio and the
// docs (localization study LC-2).
// The theme switch's own words -- the three Loader preferences, and the
// group's name when the page gives none -- are lang/<locale>.json runtime.

const THEME_PREFERENCES = ['system', 'light', 'dark']; // The system item is a monitor, desktop_windows (owner decision D11c, docs
// review R037): brightness_auto is automatic screen brightness on Android.

const THEME_ICONS = {
  system: 'desktop_windows',
  light: 'light_mode',
  dark: 'dark_mode'
}; // A theme switch whose choice cannot move the theme says why, once per
// element (R076, as sf-button's theme-cycle): a host that draws the theme
// itself (the Loader started with theme: false, as a Docara page and its
// examples are), or no Loader. Nothing is selected and no change is sent.

function warnThemeNotOwned(host) {
  if (host.__sfThemeWarned) return;
  host.__sfThemeWarned = true;
  const reason = globalThis.SF?.Loader ? 'the page\'s theme belongs to its host (the Loader runs with theme: false); a host that hands the theme to the Loader makes it work (a Docara example: theme_switch=true)' : 'SF.Loader is absent';
  globalThis.console?.warn?.(`[SIMAI Framework] ${host.localName} theme-switch: the choice changes nothing: ${reason}.`);
} // The Loader's theme preference: what the person chose, not the theme drawn,
// so system stays selected while the system is dark.


function themePreference() {
  const preference = globalThis.SF?.Loader?.themePreference;
  return THEME_PREFERENCES.includes(preference) ? preference : 'system';
} // height (1.5.0, decision C27): the size's tightness steps, as on sf-button.
// A value outside the list reads as default and is said once per group.


const HEIGHTS = new Set(['low', 'default', 'high', 'highest']);

function groupHeight(host) {
  const raw = host.getAttribute('height');
  if (raw === null || raw === '') return 'default';
  const value = raw.trim().toLowerCase();
  if (HEIGHTS.has(value)) return value;

  if (!host.__sfHeightWarned) {
    host.__sfHeightWarned = true;
    globalThis.console?.warn?.(`[SIMAI Framework] sf-segmented: height="${raw}" is not a height; write low, default, high or highest (the size's steps). Read as default.`);
  }

  return 'default';
} // spacing is deprecated (1.5.0, decision C27; journal
// attribute-segmented-spacing-to-height), as on sf-button: it keeps drawing
// the side padding until 2027-01-01 and is not turned into a height. Noted in
// SF.deprecations and said once per page in the console.


function noteSpacing(host) {
  if (!host.hasAttribute('spacing')) return;
  (0,_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_4__.noteDeprecated)({
    component: 'sf-segmented',
    kind: 'attribute',
    from: 'spacing',
    to: 'height',
    since: '2026-11-10',
    remove_after: '2027-01-01'
  });
  const root = globalThis.SF = globalThis.SF || {};
  if (root.__sfSegmentedSpacingWarned) return;
  Object.defineProperty(root, '__sfSegmentedSpacingWarned', {
    value: true,
    configurable: true
  });
  globalThis.console?.warn?.('[SIMAI Framework] sf-segmented: spacing is deprecated until 2027-01-01 and draws the side padding only; write height="low|default|high|highest" for the control height. See contracts/changes/journal.json (attribute-segmented-spacing-to-height).');
} // The sizes sf-dropdown has: a track of another size keeps scrolling inside
// itself when its labels do not fit (C47 C folds only where the field can be
// as tall as the track).


const FOLD_SIZES = new Set(['1/2', '1', '2']);

function parseItems(value = []) {
  if (Array.isArray(value)) return value;
  const source = String(value || '').trim();
  if (!source) return [];

  if (source.startsWith('[')) {
    try {
      const parsed = JSON.parse(source);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  return source.split('|').map(entry => {
    const [valuePart, labelPart, flagsPart = ''] = entry.split('::');
    const flags = flagsPart.split(',').map(flag => flag.trim()).filter(Boolean);
    const iconFlag = flags.find(flag => flag.startsWith('icon='));
    return {
      value: valuePart.trim(),
      label: (labelPart || valuePart).trim(),
      disabled: flags.includes('disabled'),
      loading: flags.includes('loading'),
      icon: iconFlag ? iconFlag.slice('icon='.length) : ''
    };
  });
}

function normalizeItems(items = []) {
  const seen = new Set();
  return parseItems(items).map((item, index) => {
    const source = typeof item === 'string' ? {
      value: item,
      label: item
    } : item;
    if (!source || typeof source !== 'object') return null;
    const value = String(source.value ?? source.id ?? index).trim();
    if (!value || seen.has(value)) return null;
    seen.add(value);
    return {
      id: String(source.id || value),
      value,
      label: String(source.label ?? source.text ?? value),
      icon: String(source.icon || ''),
      ariaLabel: String(source.ariaLabel || source['aria-label'] || ''),
      // The language the label is written in (a language picker names each
      // language in itself): the segment carries it as lang.
      lang: String(source.lang || '').trim(),
      // A number shown after the label in the segmented appearance; 0 is a
      // count, an absent or empty one is not.
      count: source.count === null || typeof source.count === 'undefined' ? '' : String(source.count).trim(),
      // Only an icon can stand alone; the label stays as the accessible name.
      iconOnly: Boolean((source.iconOnly ?? source['icon-only']) && source.icon),
      // An option's colour (owner decision C308 FO-4): the label is drawn
      // as a tonal badge in it, as everywhere an option's colour is shown.
      color: String(source.color || '').trim(),
      // A loading item shows the spinner and is disabled while it works, as
      // a loading button is (simai/ui-source#10).
      loading: Boolean(source.loading),
      disabled: Boolean(source.disabled || source.loading)
    };
  }).filter(Boolean);
} // sf-segmented from its component.json (standard simai.smart-component
// 1.3.8 §3, §4, §4.4, §8, §16.20, §17.1): the settings are attributes and
// properties made by core/js/element-manifest.js, select and clear are its
// actions and answer an outcome, change is sent once through sfEmit (the shim
// sends sf-button-group-change after it), and the host is the form control
// through ElementInternals.


const ButtonGroupElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_10__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: _lang_index_mjs__WEBPACK_IMPORTED_MODULE_12__.files,
  source: 'ru',
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_11__,
  actions: {
    select({
      value: nextValue
    } = {}) {
      const value = String(nextValue ?? '');
      const item = this.normalizedItems.find(candidate => candidate.value === value);
      if (!item) return 'unknown';
      if (item.disabled || this.disabled) return 'disabled';
      if (value === this.value) return 'unchanged';
      const previous = this.value; // A theme switch sets the Loader's preference first, so a listener of
      // change already finds the page in the theme it chose; a Loader that
      // cannot change the theme (absent, or SF_BOOT_CONFIG.theme false)
      // selects nothing.

      if (this.themeSwitch && globalThis.SF?.Loader?.setTheme?.(value) !== true) {
        warnThemeNotOwned(this);
        return 'theme';
      }

      this.value = value;
      this.emitValueChange({
        previous,
        value,
        item
      });
      return 'applied';
    },

    clear() {
      // A theme preference is never empty.
      if (this.themeSwitch) return 'theme';
      if (this.disabled) return 'disabled';
      if (!this.value) return 'unchanged';
      const previous = this.value;
      this.value = '';
      this.emitValueChange({
        previous,
        value: '',
        item: null
      });
      return 'applied';
    }

  }
}); // The offset box of an element from a positioned ancestor's padding edge,
// walking offsetParent: layout pixels, before any transform. null as the stop
// walks to the page's origin.

function offsetWithin(element, stop) {
  let x = 0;
  let y = 0;
  let node = element;

  while (node && node !== stop) {
    x += node.offsetLeft;
    y += node.offsetTop;
    const parent = node.offsetParent;

    if (parent && parent !== stop) {
      x += parent.clientLeft;
      y += parent.clientTop;
    }

    node = parent;
  }

  if (node === stop) return {
    x,
    y
  }; // The stop is not on the element's offsetParent chain (a track that is not
  // positioned): both from the page's origin.

  const element0 = offsetWithin(element, null);
  const stop0 = offsetWithin(stop, null);
  return {
    x: element0.x - stop0.x - stop.clientLeft,
    y: element0.y - stop0.y - stop.clientTop
  };
} // Where the plate goes (1.8.1): the selected segment's box in the track's own
// layout coordinates, from its padding edge at the inline start (a
// right-to-left track starts at its right edge), the scroll included -- the
// plate is laid out inside the track and scrolls with the segments.
// getBoundingClientRect gives screen boxes, and under a scale, rotate or
// perspective ancestor their difference is not a layout distance: inside
// rotate(-14deg) the plate stood 21 px below its segment, inside scale(.7) at
// 70 % of its size (docs hero study 2026-11-19, section 9). The offset box is
// the layout's own, in whole pixels for its place; the screen boxes keep their
// fractions where they agree with it within a pixel -- nothing transformed
// between the track and the screen, the common case, where the plate stands
// exactly where 1.8.0 put it.


function segmentPlace(root, active) {
  const width = (0,_core_js_overflow_row_js__WEBPACK_IMPORTED_MODULE_9__.layoutWidth)(active);
  const height = (0,_core_js_overflow_row_js__WEBPACK_IMPORTED_MODULE_9__.layoutHeight)(active);
  if (!width || !height) return null;
  const style = getComputedStyle(root);
  const rtl = style.direction === 'rtl';
  const borderStart = parseFloat(style.borderLeftWidth) || 0;
  const borderEnd = parseFloat(style.borderRightWidth) || 0;
  const offset = offsetWithin(active, root);
  const layout = {
    x: rtl ? offset.x + width - ((0,_core_js_overflow_row_js__WEBPACK_IMPORTED_MODULE_9__.layoutWidth)(root) - borderStart - borderEnd) : offset.x,
    y: offset.y,
    width,
    height
  };
  const box = root.getBoundingClientRect();
  const rect = active.getBoundingClientRect();
  const screen = {
    x: rtl ? rect.right - (box.right - borderEnd) + root.scrollLeft : rect.left - box.left - root.clientLeft + root.scrollLeft,
    y: rect.top - box.top - root.clientTop + root.scrollTop,
    width: rect.width,
    height: rect.height
  };
  const agree = ['x', 'y', 'width', 'height'].every(key => Math.abs(screen[key] - layout[key]) <= 1);
  return agree ? screen : layout;
}

class SfButtonGroup extends (0,_helpers_form_field__WEBPACK_IMPORTED_MODULE_6__.FormField)(ButtonGroupElement) {
  static get props() {
    return { ...super.props,
      templateName: {
        attribute: 'template',
        default: 'default'
      },
      // The attribute takes JSON or value::label::flags|...; the property a list.
      items: {
        type: Array,
        default: [],
        parser: parseItems
      },
      // No default: control-spacing reads the attribute and tightness.
      spacing: {
        type: String,
        default: null
      },
      ariaLabel: {
        attribute: 'aria-label',
        default: ''
      },
      rootClass: {
        attribute: 'root-class',
        default: ''
      }
    };
  } // spacing and tightness, the two former names of the side padding, read
  // each other (core/js/control-spacing.js) as the template draws them, so
  // the properties say what is drawn (template-context probe). The base puts
  // its setters back beside them.


  get spacing() {
    return (0,_core_js_control_spacing__WEBPACK_IMPORTED_MODULE_3__.resolveControlSpacing)({
      spacing: this.getAttribute('spacing'),
      tightness: this.getAttribute('tightness')
    }).spacing;
  }

  get tightness() {
    return (0,_core_js_control_spacing__WEBPACK_IMPORTED_MODULE_3__.resolveControlSpacing)({
      spacing: this.getAttribute('spacing'),
      tightness: this.getAttribute('tightness')
    }).tightness;
  }

  constructor() {
    super();
    this.addEventListener('click', this.handleClick);
    this.addEventListener('keydown', this.handleKeyDown);
    this.addEventListener('sf-after-render', event => {
      // A nested Smart button may finish after its parent or render again later.
      if (event.target !== this && event.target.parentElement === this.querySelector('.sf-button-group')) {
        this.syncButtonSemantics();
      }
    });
  }

  get themeItems() {
    return THEME_PREFERENCES.map(value => ({
      value,
      label: this.sfWord(value),
      icon: THEME_ICONS[value],
      iconOnly: true
    }));
  } // items is a list setting (§4.2) whose attribute keeps its JSON and
  // value::label::flags forms: read through the prop's parser, and a list set
  // as a property stays the instance's own, as it was before the manifest.


  get items() {
    return this.getProp('items');
  }

  set items(value) {
    Object.defineProperty(this, 'items', {
      configurable: true,
      enumerable: true,
      writable: true,
      value
    });
    this.requestComponentUpdate?.('items');
  }

  get normalizedItems() {
    const items = normalizeItems(this.themeSwitch ? this.themeItems : this.getProp('items'));
    const firstEnabledIndex = items.findIndex(item => !item.disabled);
    return items.map((item, index) => ({ ...item,
      firstEnabled: index === firstEnabledIndex
    }));
  }

  get value() {
    return this.getAttribute('value') || '';
  }

  set value(nextValue) {
    if (nextValue === null || typeof nextValue === 'undefined' || nextValue === '') {
      this.removeAttribute('value');
    } else {
      this.setAttribute('value', String(nextValue));
    }

    this.sfSyncFormState();
  } // What the form gets (§17.1): the selected value, nothing while disabled.


  sfFormValue() {
    if (this.disabled) return null;
    return this.value;
  } // form.reset(): the value the group was written with, without events; a
  // theme switch keeps the preference (§17.1 item 4).


  fieldReset() {
    if (this.themeSwitch) return;
    this.value = this._resetValue;
  }

  connectedCallback() {
    // A printed JSON island first (standard 1.3.8 §5.4): what is read below may be in it.
    this.sfReadIsland(); // The value a form reset returns to: the one the group was written with.

    if (!Object.prototype.hasOwnProperty.call(this, '_resetValue')) this._resetValue = this.value;
    super.connectedCallback();
  }

  onConnected() {
    window.addEventListener('sf-theme-change', this.handleThemeChange);
    this.syncThemePreference();
  }

  onDisconnected() {
    window.removeEventListener('sf-theme-change', this.handleThemeChange);
    this._plateObserver?.disconnect();
    this._plateObserver = null;
    this._fitObserver?.disconnect();
    this._fitObserver = null;
    this._plateFor = null;
    clearTimeout(this._plateTimer);
    cancelAnimationFrame(this._plateShow);
    this._plateShow = 0;
    this._releaseReset?.();
    this._releaseReset = null;
    this._resetInput = null;
    super.onDisconnected();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === 'theme-switch' && oldValue !== newValue && this._isMounted) this.syncThemePreference();
  } // A theme switch shows the preference wherever it was set: here, another
  // switch, a Theme component button or SF.Loader.setTheme itself.


  syncThemePreference() {
    if (!this.themeSwitch) return;
    const preference = themePreference();
    if (this.value !== preference) this.value = preference;
  }

  handleThemeChange = () => this.syncThemePreference();

  templateContext() {
    return this.createTemplateContext({ ...this.getPropsContext(),
      ariaLabel: this.getAttribute('aria-label') || (this.themeSwitch ? this.sfWord('group') : ''),
      ...(0,_core_js_control_spacing__WEBPACK_IMPORTED_MODULE_3__.resolveControlSpacing)({
        spacing: this.getAttribute('spacing'),
        tightness: this.getAttribute('tightness')
      }),
      height: groupHeight(this),
      component: this,
      // The entries drawn: normalised, numbered and flagged; items stays the
      // setting as given (the template-context probe compares the two).
      entries: this.normalizedItems,
      value: this.value,
      disabled: this.disabled,
      // The host is the form control where the browser has ElementInternals;
      // the hidden input is drawn only without them (§17.1 item 6).
      hiddenName: this.sfInternals ? '' : this.name,
      folded: this.folded,
      foldedSize: this.size,
      foldedOptions: this.folded ? this.foldedOptions() : []
    });
  } // C47 (owner decision 2026-11-10): the track is as wide as its labels (A),
  // and when they do not fit on one line in the place it has, the element
  // draws an sf-dropdown of the same size that shows the chosen value (C).
  // It measures itself -- no breakpoint for the author to pick: the track's
  // one-line width against the width it is given, again whenever either
  // changes (ResizeObserver), so a wider screen or a shorter label brings the
  // track back.


  get folded() {
    return Boolean(this._folded) && this.foldable;
  }

  get foldable() {
    return this.appearance !== 'buttons' && this.orientation !== 'vertical' && FOLD_SIZES.has(String(this.size));
  }

  foldedOptions() {
    return this.normalizedItems.map(item => ({
      type: 'text',
      size: this.size,
      text: item.count !== '' ? `${item.label} · ${item.count}` : item.label,
      value: item.value,
      disabled: item.disabled,
      selected: item.value === this.value
    }));
  } // What the labels need on one line and what the element is given: a shown
  // track is measured at its one-line width for a moment (data-sf-measure, in
  // the same task, never painted); a folded one is laid out at that width all
  // along, and the dropdown's place is what a track would get.


  measureFit() {
    const root = this.querySelector(':scope > .sf-button-group');
    if (!root) return null;

    if (this.folded) {
      const narrow = this.querySelector(':scope > .sf-button-group-narrow');
      return {
        need: (0,_core_js_overflow_row_js__WEBPACK_IMPORTED_MODULE_9__.layoutWidth)(root),
        room: narrow ? (0,_core_js_overflow_row_js__WEBPACK_IMPORTED_MODULE_9__.layoutWidth)(narrow) : 0
      };
    } // Layout widths (1.8.1): inside rotate() a screen box is the rotated
    // bounding box, and need and room grew by different amounts.


    const room = (0,_core_js_overflow_row_js__WEBPACK_IMPORTED_MODULE_9__.layoutWidth)(root);
    root.setAttribute('data-sf-measure', '');
    const need = (0,_core_js_overflow_row_js__WEBPACK_IMPORTED_MODULE_9__.layoutWidth)(root);
    root.removeAttribute('data-sf-measure');
    return {
      need,
      room
    };
  } // A track its author lets wrap (root-class flex-wrap, as the field
  // renderers' choice buttons do) takes more lines instead of folding: it
  // was asked to show every option, and a dropdown in its place is another
  // control (C302: the template is the administrator's choice; FW-2).


  wrapsLines() {
    const root = this.querySelector(':scope > .sf-button-group');
    return Boolean(root) && globalThis.getComputedStyle?.(root)?.flexWrap === 'wrap';
  }

  checkFit() {
    if (!this.isConnected) return;

    if (!this.foldable || this.wrapsLines()) {
      if (this._folded) {
        this._folded = false;
        this.toggleAttribute('data-sf-folded', false);
        this.requestComponentUpdate?.('fit');
      }

      return;
    }

    const fit = this.measureFit();
    if (!fit || !fit.need || !fit.room) return; // A pixel of slack: a track that fits exactly is a track.

    const fold = fit.need > fit.room + 1;
    if (fold === Boolean(this._folded)) return;
    this._folded = fold;
    this.toggleAttribute('data-sf-folded', fold);
    this.requestComponentUpdate?.('fit');
  }

  observeFit() {
    if (typeof ResizeObserver === 'undefined') return;

    if (!this._fitObserver) {
      this._fitObserver = new ResizeObserver(() => this.checkFit());
      globalThis.document?.fonts?.ready?.then?.(() => this.checkFit());
    }

    this._fitObserver.disconnect();

    const root = this.querySelector(':scope > .sf-button-group');
    const narrow = this.querySelector(':scope > .sf-button-group-narrow');
    if (root) this._fitObserver.observe(root);
    if (narrow) this._fitObserver.observe(narrow);
  } // The dropdown's change is the host's: the dropdown's own event stops here
  // and the host sends change once, as a segment press does.


  handleFoldedChange(event) {
    event.stopPropagation();
    const next = event.detail?.value ?? event.target?.value;
    if (next === undefined || next === null) return;
    this.select(String(next));
  }

  template() {
    noteSpacing(this);
    const context = this.templateContext(); // Every item's icon, asked for when the group is drawn, as a cycle's are
    // (R074): a segment drawn later (out of loading, items set afresh) finds
    // its glyph in the page's font instead of asking for a grown one.

    (0,_helpers_cycle__WEBPACK_IMPORTED_MODULE_8__.preloadControlIcons)(this, context.entries.filter(item => item.icon).map(item => ({
      icon: item.icon,
      filled: false
    }))); // The error line's id (error-message, FO-1).

    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_2__.renderButtonGroupTemplate)({ ...context,
      messageId: (0,_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_7__.partId)((0,_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_7__.instancePath)(this, {
        kind: 'sf-segmented'
      }), 'error')
    });
  } // Every form value control reports a committed change as `change` on its
  // host, once, under its native name and without the element in its detail
  // (§8, §17.3); the shim sends the legacy sf-button-group-change after it with
  // the same detail (aliases.json).


  emitValueChange(detail) {
    this.sfEmit('change', detail);
  }

  afterRender() {
    this.syncButtonSemantics();
    this.bindReset();
    this.sfSyncFormState();
    this.placePlate();
    this.observeFit();
    this.checkFit();
  } // The plate of the track (1.4.0, owner decision D11c): one element under
  // the selected option, measured after each render and moved there. A new
  // choice slides it in 0.2 s (data-plate="moving" turns the transition on;
  // the sheet takes it off under prefers-reduced-motion); a resize, a font
  // that arrives or the first placement move it at once. Without a selected,
  // enabled option the option paints itself (data-plate is removed), as it
  // does in the printed first paint.
  // 1.6.1: the plate's first placement (no data-plate yet: the first render,
  // the printed first paint taken over) is measured at once and shown a frame
  // later, at its place: shown in the frame it was first moved, the browser
  // counted it as a layout shift (0.0009 at 1440, 0.0035 at 390 on every
  // hydration). Until then the option paints the plate itself, the same fill.


  placePlate() {
    const root = this.querySelector(':scope > .sf-button-group');
    const plate = root?.querySelector(':scope > .sf-button-group-plate');

    if (!root || !plate) {
      this._plateObserver?.disconnect();
      this._plateObserver = null;
      this._plateFor = null;
      return;
    }

    const active = root.querySelector(':scope > .sf-button-group-segment.active');

    if (!active || active.disabled) {
      cancelAnimationFrame(this._plateShow);
      this._plateShow = 0;
      root.removeAttribute('data-plate');
      this._plateFor = null;
      return;
    }

    const moving = Boolean(this._plateFor && this._plateFor !== active && this._plateRoot === root && root.hasAttribute('data-plate'));
    this.measurePlate(root, plate, active, moving);
    this._plateFor = active;
    this._plateRoot = root;
    if (typeof ResizeObserver === 'undefined') return;

    if (!this._plateObserver) {
      this._plateObserver = new ResizeObserver(() => {
        const current = this._plateFor;

        if (current?.isConnected && this._plateRoot?.isConnected) {
          this.measurePlate(this._plateRoot, this._plateRoot.querySelector(':scope > .sf-button-group-plate'), current, false);
        }
      });
    }

    this._plateObserver.disconnect();

    this._plateObserver.observe(root);

    this._plateObserver.observe(active);
  }

  measurePlate(root, plate, active, moving) {
    if (!plate) return;
    const place = segmentPlace(root, active);
    if (!place) return;
    const {
      x,
      y,
      width,
      height
    } = place; // A render that follows the choice (the value echoed back, a form sync)
    // measures again while the plate slides: it keeps the slide and its timer.

    const sliding = !moving && root.getAttribute('data-plate') === 'moving';
    const first = !root.hasAttribute('data-plate');

    if (!sliding && !first) {
      clearTimeout(this._plateTimer);
      root.setAttribute('data-plate', moving ? 'moving' : 'placed');
    }

    plate.style.setProperty('--sf-button-group--plate-x', `${x}px`);
    plate.style.setProperty('--sf-button-group--plate-y', `${y}px`);
    plate.style.setProperty('--sf-button-group--plate-inline-size', `${width}px`);
    plate.style.setProperty('--sf-button-group--plate-block-size', `${height}px`);

    if (first) {
      cancelAnimationFrame(this._plateShow);
      this._plateShow = requestAnimationFrame(() => {
        this._plateShow = 0;
        if (root.isConnected && !root.hasAttribute('data-plate') && root.querySelector(':scope > .sf-button-group-segment.active')) root.setAttribute('data-plate', 'placed');
      });
    }

    if (moving) {
      this._plateTimer = setTimeout(() => {
        if (root.getAttribute('data-plate') === 'moving') root.setAttribute('data-plate', 'placed');
      }, 260);
    }
  } // Without ElementInternals the hidden input carries the name and value (and
  // is disabled with the group), and a form reset brings back the value the
  // group was written with.


  bindReset() {
    const input = this.querySelector(':scope > .sf-button-group-input');
    if (this._resetInput === input) return;
    this._releaseReset?.();
    this._resetInput = input;
    this._releaseReset = input ? (0,_component_form_reset_helper__WEBPACK_IMPORTED_MODULE_5__.bindFormReset)(input, () => {
      if (this.themeSwitch) return;
      this.value = this._resetValue;
    }) : null;
  }

  syncButtonSemantics() {
    const root = this.querySelector('.sf-button-group');
    if (!root) return;
    const items = this.normalizedItems;
    const available = this.disabled ? [] : items.filter(item => !item.disabled);
    const tabStop = available.find(item => item.value === this.value) || available[0]; // A segmented group draws native buttons; the default one draws Smart buttons.

    root.querySelectorAll(':scope > sf-button, :scope > button').forEach((host, index) => {
      const button = host.matches('button') ? host : host.querySelector('button'),
            item = items[index];
      if (!button || !item) return;
      const selected = item.value === this.value;
      button.setAttribute('role', 'radio');
      button.setAttribute('aria-checked', selected ? 'true' : 'false');
      button.tabIndex = item === tabStop ? 0 : -1;
    });
  }

  focus(options) {
    if (this.folded) {
      // sf-dropdown's host draws no box (display: contents); its trigger
      // is the focus stop that owns the dropdown keyboard.
      const trigger = this.querySelector(':scope > .sf-button-group-narrow [aria-haspopup="listbox"]');
      trigger?.focus?.(options);
      return this;
    }

    const button = this.querySelector('button[role="radio"][tabindex="0"]:not(:disabled)');
    button?.focus?.(options);
    return this;
  }

  handleClick = event => {
    if (event.target?.closest?.('.sf-button-group-narrow')) return;
    const target = event.target?.closest?.('[data-sf-button-group-value]');
    if (!target || !this.contains(target)) return;
    this.select(target.getAttribute('data-sf-button-group-value'));
  };
  handleKeyDown = event => {
    // The dropdown keeps its own keys (sf-dropdown standard).
    if (event.target?.closest?.('.sf-button-group-narrow')) return;
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
    const enabled = this.normalizedItems.filter(item => !item.disabled);
    if (!enabled.length || this.disabled) return;
    const currentIndex = Math.max(0, enabled.findIndex(item => item.value === this.value));
    const nextIndex = event.key === 'Home' ? 0 : event.key === 'End' ? enabled.length - 1 : ['ArrowLeft', 'ArrowUp'].includes(event.key) ? (currentIndex - 1 + enabled.length) % enabled.length : (currentIndex + 1) % enabled.length;
    event.preventDefault();
    const previous = this.value;
    this.select(enabled[nextIndex].value);

    if (this.value !== previous) {
      this.addEventListener('sf-after-render', () => this.focus(), {
        once: true
      });
    }
  };
}

SfButtonGroup.define('sf-segmented');

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "cd371843857e"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderButtonGroupTemplate: () => (/* binding */ renderButtonGroupTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var _component_spinner_js_spinner_draw__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("50d2a204ba4c");
/* harmony import */ var _helpers_option_badge_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("b30ec5bc0edb");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);


 // An option's colour (owner decision C308 FO-4): its name is a tonal badge in
// that colour (sf-badge tight, line 1), as in a cell, a view, a checklist and
// a dropdown; the label stays the segment's name.

function renderLabel(item) {
  if (!item.color) return item.label;
  const badge = (0,_helpers_option_badge_js__WEBPACK_IMPORTED_MODULE_2__.optionBadgeProps)({
    color: item.color
  });
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-badge class="sf-button-group-badge" appearance="tonal" tight line="1" scheme=${badge.scheme}
                        root-style=${badge.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} text=${item.label}></sf-badge>`;
}

function segmentFor(index, total) {
  if (total <= 1) return '';
  if (index === 0) return 'start';
  if (index === total - 1) return 'end';
  return 'middle';
} // The buttons look hands its scheme to sf-button, whose current names are
// primary and on-surface (C116): secondary is sf-button's former name there and
// draws as on-surface with a console warning, so it is told on-surface. The
// track keeps secondary, a segment colour in core.


const BUTTON_SCHEME = {
  secondary: 'on-surface'
};

function renderItem(item, index, context) {
  const selected = item.value === context.value;
  const disabled = context.disabled || item.disabled;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <sf-button
      text=${item.label}
      icon=${item.icon || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      size=${context.size}
      height=${context.height && context.height !== 'default' ? context.height : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      root-class=${context.spacing && context.spacing !== 'normal' ? `spacing-${context.spacing}` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      appearance=${selected ? 'default' : 'outline'}
      scheme=${selected ? BUTTON_SCHEME[context.scheme] ?? context.scheme : 'on-surface'}
      segment=${segmentFor(index, context.entries.length)}
      data-sf-button-group-value=${item.value}
      aria-label=${item.ariaLabel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      lang=${item.lang || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      class=${selected ? 'active' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      ?disabled=${disabled}
      ?loading=${item.loading}
    ></sf-button>
  `;
} // The segmented appearance draws each segment as a native button with the
// button's own size, spacing and text classes, so a segment is exactly as tall
// as a button of the same size. All segments carry the same appearance class:
// the plate under the selected one is a fill, never a change of type or weight,
// so selecting a segment never changes its width. The group sheet paints them.


function renderSegment(item, context) {
  const selected = item.value === context.value;
  const disabled = context.disabled || item.disabled;
  const classes = ['sf-button', `sf-button--size-${context.size}`, // ghost (C15); sf-button--link, its former name, beside it until 2027-01-01.
  'sf-button--ghost', 'sf-button--link', 'sf-button--on-surface', 'flex', 'items-cross-center', 'sf-button-group-segment', item.iconOnly ? 'sf-button-group-icon-only' : '', context.spacing && context.spacing !== 'normal' ? `spacing-${context.spacing}` : '', // height (decision C27): the button sheet's height class sets the block
  // padding; the track takes its own padding off it, as at the default.
  context.height && context.height !== 'default' ? `sf-button--height-${context.height}` : '', selected ? 'active' : '', item.loading ? 'loading sf-button-state-loading' : ''].filter(Boolean).join(' '); // The count stands next to the label with no space between the two nodes, so
  // the name is composed here: the label (or the item's aria-label), then the
  // count, as it is read on screen.

  const ariaLabel = item.count !== '' || item.ariaLabel ? [item.ariaLabel || item.label, item.count].filter(part => part !== '').join(' ') : ''; // A loading segment shows the spinner as a loading button does
  // (simai/ui-source#10): in place of its icon, or over its label, which keeps
  // its place and its name.

  const spinner = item.loading ? (0,_component_spinner_js_spinner_draw__WEBPACK_IMPORTED_MODULE_1__.createInlineSpinner)({
    className: 'sf-button-spinner',
    overlay: !item.icon
  }) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const icon = item.loading && item.icon ? spinner : item.icon ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-icon icon=${item.icon} root-class="pointer-events-none" weight="400" aria-hidden="true"></sf-icon>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const count = item.count !== '' ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-button-group-count">${item.count}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <button
      type="button"
      class=${classes}
      data-sf-button-group-value=${item.value}
      aria-label=${ariaLabel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      lang=${item.lang || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      aria-busy=${item.loading ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      ?disabled=${disabled}
    >
      ${item.loading && !item.icon ? spinner : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      ${icon}
      ${item.iconOnly ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-button-group-label--hidden">${item.label}</span>${count}` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-button-text-container text-center pointer-events-none">${renderLabel(item)}${count}</span>`}
    </button>
  `;
} // The labels do not fit on one line (owner decision C47 C): the same choice as
// an sf-dropdown of the same size, which shows the chosen value. Its keys are
// the dropdown's (ArrowDown opens, Enter chooses); its change is taken by the
// host, which sends its own change once, as a segment press does.


function renderFolded(context) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div class="sf-button-group-narrow">
      <sf-dropdown
        size=${context.foldedSize}
        appearance="bordered"
        mode="select"
        .search=${false}
        value=${context.value || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        aria-label=${context.ariaLabel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        ?disabled=${context.disabled}
        ?invalid=${context.invalid}
        .options=${context.foldedOptions}
        @change=${event => context.component.handleFoldedChange(event)}
        @input=${event => event.stopPropagation()}
      ></sf-dropdown>
    </div>
  `;
} // The track (appearance track, the default since 1.4.0) draws native buttons
// on a translucent track and one plate element under the selected option: the
// element measures the option after each render and the plate slides to it
// (index.js placePlate). Until it is measured -- the printed first paint, a
// page without script -- the selected option paints the plate itself, so the
// choice is visible from the first frame. The buttons look (appearance
// buttons, the old default) joins Smart buttons. backdrop says what the track
// stands on: a surface (the default), a coloured place or a photo.


function renderButtonGroupTemplate(context) {
  const segmented = context.appearance !== 'buttons';
  const backdrop = segmented && context.backdrop && context.backdrop !== 'surface' ? context.backdrop : '';
  const classes = ['sf-button-group', segmented ? 'sf-button-group--segmented' : '', segmented ? `sf-button-group--size-${context.size}` : '', segmented && context.plate !== 'scheme' ? 'sf-button-group--plate-raised' : '', segmented ? `sf-button-group--${context.scheme}` : '', backdrop ? `sf-button-group--backdrop-${backdrop}` : '', segmented && context.fullWidth ? 'sf-button-group--full-width' : '', segmented && context.folded ? 'sf-button-group--folded' : '', context.radius ? `sf-button-group--radius-${context.radius}` : '', context.invalid ? 'sf-button-group--invalid' : '', context.rootClass].filter(Boolean).join(' '); // The error line while invalid (error-message, FO-1): under the group, in the
  // error role, and the radio group is described by it.

  const message = context.invalid && context.errorMessage ? context.errorMessage : '';
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div
      class=${classes}
      style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      role="radiogroup"
      ?inert=${Boolean(segmented && context.folded)}
      aria-hidden=${segmented && context.folded ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      aria-label=${context.ariaLabel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      aria-orientation=${context.orientation}
      aria-invalid=${context.invalid ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      aria-describedby=${message ? context.messageId : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      data-value=${context.value || ''}
    >
      ${segmented ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-button-group-plate" aria-hidden="true"></span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      ${context.entries.map((item, index) => segmented ? renderSegment(item, context) : renderItem(item, index, context))}
    </div>
    ${segmented && context.folded ? renderFolded(context) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    ${message ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class=${`sf-button-group-message sf-button-group-message--size-${context.size}`} id=${context.messageId} data-field-message="error">${message}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    ${context.hiddenName ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<input class="sf-button-group-input" type="hidden" name=${context.hiddenName} value=${context.value || ''} ?disabled=${context.disabled}>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
  `;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "9abcb852f1cf"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("control-spacing", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("control-spacing", 1).then(resolve, reject), { once: true })));

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

/***/ "2a080a730149"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("lit", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "deb1a4d61565"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("smart-base", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("smart-base", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "dc257f02dfa6"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   files: () => (/* binding */ files)
/* harmony export */ });
/* harmony import */ var _en_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("dd70e430dd3b");
// Written by scripts/build-language-packs.mjs from src/core/lang/built-in.json
// (owner decision C282); do not edit. The words this bundle carries: the
// built-in languages' (en); every other language comes from
// a language file (core/lang/<code>.js or its parts).


const files = { en: { runtime: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime } };

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ en: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime });


/***/ },

/***/ "58fa7b09c477"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases for the shim (core/js/aliases.js, standard simai.smart-component 1.3.8 §16.20). Event rows send the new name first, then the old one, with one detail; setting rows map the old attribute and property to the new; host-attribute rows (no \\"to\\") stay host attributes read by the browser or the base and are listed, refused by the shim on purpose; documentary rows (\\"shim\\": \\"none\\") record a rename the shim cannot serve.","component":"sf-segmented","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"aria-label","to":null,"kind":"attribute","component":"sf-segmented","since":"2026-10-27","remove_after":"2026-12-01","mode":"host-attribute","section":"§3.1","note":"stays a host attribute, read by the base (§3.1, §4.8); no shim"},{"from":"sf-button-group-change","to":"change","kind":"event","component":"sf-segmented","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","cancelable":false,"note":"sent by the shim after change, with the same detail; the detail no longer carries the element (§8)"},{"from":"sf-button-group","to":"sf-segmented","kind":"tag","component":"sf-segmented","since":"2026-11-08","remove_after":"2027-01-01","section":"rename plan R0 (ui-control RENAME-PLAN-2026-11-03), naming decision 2026-11-02","note":"the element is sf-segmented; sf-button-group is a subclass defined beside it until the date"},{"from":"segmented","to":"track","kind":"value","setting":"appearance","component":"sf-segmented","since":"2026-11-08","remove_after":"2027-01-01","section":"§16 item 20","note":"owner decision D11b/D11c (docs review R035, R037): the two looks are named track and buttons; track is the default"},{"from":"default","to":"buttons","kind":"value","setting":"appearance","component":"sf-segmented","since":"2026-11-08","remove_after":"2027-01-01","section":"§16 item 20","note":"owner decision D11b/D11c (docs review R035, R037): the two looks are named track and buttons; track is the default"}]}');

/***/ },

/***/ "9e8a0d4d39c8"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.segmented","tag":"sf-segmented","version":"1.8.2","kind":"leaf","settings":{"items":{"type":"list","default":[],"of":{"id":"id","value":"string","label":"string","lang":{"type":"string","optional":true},"icon":{"type":"icon","optional":true},"count":{"type":"string","optional":true},"icon-only":{"type":"boolean","optional":true},"loading":{"type":"boolean","optional":true},"disabled":{"type":"boolean","optional":true}}},"name":{"type":"string","default":""},"theme-switch":{"type":"boolean","default":false},"size":{"type":"enum","values":["1/3","1/2","1","2","3"],"default":"1"},"height":{"type":"enum","values":["low","default","high","highest"],"default":"default"},"spacing":{"type":"enum","values":["compact","normal","comfortable","spacious"],"default":"normal"},"tightness":{"type":"enum","values":["","low","high","highest"],"default":""},"scheme":{"type":"enum","values":["primary","secondary","on-surface"],"default":"primary"},"appearance":{"type":"enum","values":["track","buttons"],"default":"track"},"plate":{"type":"enum","values":["raised","scheme"],"default":"raised"},"backdrop":{"type":"enum","values":["surface","color","media"],"default":"surface"},"full-width":{"type":"boolean","default":false},"radius":{"type":"enum","values":["","default","square","rounded"],"default":""},"orientation":{"type":"enum","values":["horizontal","vertical"],"default":"horizontal"},"disabled":{"type":"boolean","default":false},"invalid":{"type":"boolean","default":false},"error-message":{"type":"string","default":""}},"values":{"value":{"type":"string","default":""}},"events":{"change":{"carries":{"previous":"string","value":{"type":"string"},"item":{"type":"object","nullable":true}}}},"actions":{"select":{"with":{"value":"string"}},"clear":{}},"form":{"value":"value","name":"name","default":"value","submits":"value","reset":"default","disabled":"disabled","validity":["custom-error"]},"css-variables":{"--sf-button-group-background-color":{"type":"color","state":"rest"},"--sf-button-group-padding":{"type":"length"},"--sf-button-group-radius":{"type":"length"},"--sf-button-group-color":{"type":"color","state":"rest"},"--sf-button-group-plate-background-color":{"type":"color","state":"selected"},"--sf-button-group-plate-color":{"type":"color","state":"selected"},"--sf-button-group-count-color":{"type":"color","state":"rest"}}}');

/***/ },

/***/ "dd70e430dd3b"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Segmented control","runtime":{"dark":"Dark","group":"Theme","light":"Light","system":"System","value-missing":"Choose an option."}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("6cafe904bdec");
/******/
/******/ })()
;