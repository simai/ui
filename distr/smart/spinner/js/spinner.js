/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "58661bec99a6"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   registerComponent: () => (/* binding */ registerComponent)
/* harmony export */ });
// Simple helper to register a component in one call.
// Usage inside component bundle:
//   import register from './register-helper';
//   register('Buttons', Buttons);
function registerComponent(name, cls) {
  if (!name || !cls) return;

  if (typeof window !== 'undefined' && typeof window.registerSfComponent === 'function') {
    window.registerSfComponent(name, cls);
    return;
  }

  if (typeof window !== 'undefined' && window.SF?.Loader?.registerComponent) {
    window.SF.Loader.registerComponent(name, cls);
    return;
  }

  if (typeof window !== 'undefined') {
    const pending = window.SF_PENDING_COMPONENTS = window.SF_PENDING_COMPONENTS || [];
    pending.push([name, cls]);
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (registerComponent);

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

/***/ "eecc41af23fd"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bindSpinner: () => (/* binding */ bindSpinner),
/* harmony export */   createSpinnerArcSvg: () => (/* binding */ createSpinnerArcSvg),
/* harmony export */   createSpinnerDotsSvg: () => (/* binding */ createSpinnerDotsSvg),
/* harmony export */   renderSpinner: () => (/* binding */ renderSpinner),
/* harmony export */   unbindSpinner: () => (/* binding */ unbindSpinner)
/* harmony export */ });
/* harmony import */ var _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d7f974466839");
/* harmony import */ var _register_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("58661bec99a6");
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("43090d1c8307");
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("d3818183b14c");
/* harmony import */ var _spinner_draw__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("50d2a204ba4c");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_page_language__WEBPACK_IMPORTED_MODULE_2__, _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_3__]);
([_core_js_page_language__WEBPACK_IMPORTED_MODULE_2__, _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_3__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_core_js_page_language__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_3__);





const SPINNER_TEXT = {
  en: {
    label: 'Loading…'
  },
  ru: {
    label: 'Загрузка…'
  }
};
const SPINNER_SELECTOR = '.sf-loader-container';
const SPINNER_BOUND_FLAG = 'sfSpinnerBound';

function toNumber(value, fallback) {
  const parsed = Number.parseFloat(String(value ?? ''));
  return Number.isFinite(parsed) ? parsed : fallback;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function normalizeChoice(value, allowed, fallback) {
  const normalized = String(value || '').trim().toLowerCase();
  return allowed.includes(normalized) ? normalized : fallback;
} // The size ladder decides a spinner's diameter and stroke (simai/ui-source#10).
// The pixel attributes that let a page draw its own spinner -- data-width (and
// its short data-w), data-height (data-h), data-stroke-width and
// data-dot-radius, and the sf-spinner attributes that write them -- are still
// read until the sweep of journal attribute-spinner-pixel-geometry, and noted
// in SF.deprecations whenever a spinner is drawn with them.


const PIXEL_ATTRIBUTES = [['width', 'data-width', 'width'], ['w', 'data-w', 'width'], ['height', 'data-height', 'height'], ['h', 'data-h', 'height'], ['strokeWidth', 'data-stroke-width', 'stroke-width'], ['dotRadius', 'data-dot-radius', 'dot-radius']];

function notePixelAttributes(root) {
  const smart = root.closest?.('sf-spinner');
  const written = PIXEL_ATTRIBUTES.filter(([key]) => {
    const value = root.dataset[key];
    return value !== undefined && value !== '';
  });
  written.forEach(([, attribute, smartAttribute]) => {
    (0,_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_3__.noteDeprecated)({
      component: smart ? 'sf-spinner' : 'spinner',
      kind: 'attribute',
      from: smart ? smartAttribute : attribute,
      // sf-spinner takes size; the ordinary spinner a sf-loader--size-* class.
      to: smart ? 'size' : null
    });
  });
  return written.length > 0;
} // Without pixel options the spinner is drawn on the icon grid, its size and
// stroke set by the ladder; with any of them it is drawn as before, in pixels.
// Either way the drawing holds every look (simai/ui-source#11), and the sheet
// shows the page's.


function createSpinnerArcSvg(options = {}) {
  const pixel = ['width', 'height', 'strokeWidth'].some(key => {
    const value = options?.[key];
    return value !== undefined && value !== null && value !== '';
  });
  return pixel ? createPixelSpinnerSvg(options) : (0,_spinner_draw__WEBPACK_IMPORTED_MODULE_4__.createLadderSpinnerSvg)(options);
}

function createPixelSpinnerSvg({
  width = 58,
  height = 58,
  strokeWidth = 4,
  dots = _spinner_draw__WEBPACK_IMPORTED_MODULE_4__.SPINNER_DOTS,
  filled = _spinner_draw__WEBPACK_IMPORTED_MODULE_4__.SPINNER_DOTS_FILLED,
  dotRadius = null,
  direction = 'clockwise'
} = {}) {
  const safeWidth = clamp(toNumber(width, 58), 16, 256);
  const safeHeight = clamp(toNumber(height, safeWidth), 16, 256);
  const safeStroke = clamp(toNumber(strokeWidth, 4), 1, Math.min(safeWidth, safeHeight) / 2);
  return (0,_spinner_draw__WEBPACK_IMPORTED_MODULE_4__.createSpinnerSvg)({
    width: safeWidth,
    height: safeHeight,
    stroke: safeStroke,
    dots,
    filled,
    dotRadius,
    direction,
    pixel: true
  });
}

function createSpinnerDotsSvg({
  width = 58,
  height = 58,
  dots = 16,
  filled = 6,
  dotRadius = null,
  direction = 'clockwise'
} = {}) {
  const safeWidth = clamp(toNumber(width, 58), 16, 256);
  const safeHeight = clamp(toNumber(height, safeWidth), 16, 256);
  const count = clamp(Math.floor(toNumber(dots, 16)), 3, 32);
  const activeDots = clamp(Math.floor(toNumber(filled, 6)), 1, count);
  const resolvedDotRadius = dotRadius === null ? Math.max(1.5, Math.min(safeWidth, safeHeight) * 0.06) : clamp(toNumber(dotRadius, 1), 1, Math.min(safeWidth, safeHeight) / 4);
  const orbitRadius = Math.max(resolvedDotRadius, Math.min(safeWidth, safeHeight) / 2 - resolvedDotRadius - 1);
  const cx = safeWidth / 2;
  const cy = safeHeight / 2;
  const svg = (0,_spinner_draw__WEBPACK_IMPORTED_MODULE_4__.createSvgNode)('svg', {
    class: 'sf-loader-svg',
    viewBox: `0 0 ${safeWidth} ${safeHeight}`,
    width: safeWidth,
    height: safeHeight,
    'aria-hidden': 'true',
    style: `--sf-loader-dot-count:${count}; --sf-loader-dot-filled:${activeDots};`
  });

  for (let index = 0; index < count; index += 1) {
    const angle = Math.PI * 2 / count * index - Math.PI / 2;
    const dotCx = cx + orbitRadius * Math.cos(angle);
    const dotCy = cy + orbitRadius * Math.sin(angle);
    const animationIndex = direction === 'counterclockwise' ? index : (count - index) % count;
    const dot = (0,_spinner_draw__WEBPACK_IMPORTED_MODULE_4__.createSvgNode)('circle', {
      class: `sf-loader-dot${index < activeDots ? ' sf-loader-dot--active' : ''}`,
      cx: dotCx,
      cy: dotCy,
      r: resolvedDotRadius,
      style: `--sf-loader-dot-index:${index}; --sf-loader-dot-step:${animationIndex};`
    });
    svg.append(dot);
  }

  return svg;
}

function getSpinnerConfig(root) {
  const indicator = root.querySelector('.sf-loader--loading-indicator');
  const circles = root.querySelector('.sf-loader--circles');
  const labelNode = root.querySelector('.sf-loader--text');
  const hasExplicitWidth = Object.prototype.hasOwnProperty.call(root.dataset, 'width') || Object.prototype.hasOwnProperty.call(root.dataset, 'w');
  const hasExplicitHeight = Object.prototype.hasOwnProperty.call(root.dataset, 'height') || Object.prototype.hasOwnProperty.call(root.dataset, 'h');
  const pixel = notePixelAttributes(root);
  const width = clamp(toNumber(root.dataset.width, toNumber(root.dataset.w, 58)), 16, 256);
  const height = clamp(toNumber(root.dataset.height, toNumber(root.dataset.h, width)), 16, 256);
  const strokeWidth = root.dataset.strokeWidth ? clamp(toNumber(root.dataset.strokeWidth, 4), 1, Math.min(width, height) / 2) : null; // The dots look on the ladder (simai/ui-source#11): eight dots, three of them
  // lit, as big as the ring allows; data-dots and data-filled still choose.

  const dots = clamp(Math.floor(toNumber(root.dataset.dots, _spinner_draw__WEBPACK_IMPORTED_MODULE_4__.SPINNER_DOTS)), 3, 32);
  const filled = clamp(Math.floor(toNumber(root.dataset.filled, _spinner_draw__WEBPACK_IMPORTED_MODULE_4__.SPINNER_DOTS_FILLED)), 1, dots);
  const dotRadius = root.dataset.dotRadius ? clamp(toNumber(root.dataset.dotRadius, 1), 1, Math.min(width, height) / 4) : null;
  const direction = normalizeChoice(root.dataset.direction, ['clockwise', 'counterclockwise'], 'clockwise'); // The look is the page's (data-sf-spinner on an ancestor) unless the spinner
  // names its own in data-variant; the sheet resolves both. Markup that brought
  // its own .sf-loader--circles part and no variant was a dots spinner, and
  // says so now that every look is drawn in the one indicator.

  const variant = root.dataset.variant ? normalizeChoice(root.dataset.variant, _spinner_draw__WEBPACK_IMPORTED_MODULE_4__.SPINNER_LOOKS, 'arc') : circles ? 'dots' : '';
  return {
    pixel,
    width,
    height,
    strokeWidth,
    dots,
    filled,
    dotRadius,
    direction,
    variant,
    hasExplicitWidth,
    hasExplicitHeight,
    infinite: root.dataset.infinite === 'true',
    announce: root.dataset.announce === 'true',
    label: root.dataset.label !== undefined ? root.dataset.label : labelNode?.textContent?.trim?.() || '',
    indicator,
    circles,
    labelNode
  };
}

function syncSpinnerAccessibility(root, config) {
  const hasLabel = Boolean(config.label);
  root.toggleAttribute('aria-hidden', !hasLabel);

  if (config.announce && hasLabel) {
    root.setAttribute('role', 'status');
    root.setAttribute('aria-live', 'polite');
    root.setAttribute('aria-atomic', 'true');
    root.dataset.sfSpinnerSemantics = 'status';
    return;
  }

  if (root.dataset.sfSpinnerSemantics === 'status') {
    root.removeAttribute('role');
    root.removeAttribute('aria-live');
    root.removeAttribute('aria-atomic');
    delete root.dataset.sfSpinnerSemantics;
  }
}

function ensureSpinnerPart(root, selector, className) {
  let node = root.querySelector(selector);

  if (node) {
    node.innerHTML = '';
    return node;
  }

  node = document.createElement('div');
  node.className = className;
  node.dataset.sfSpinnerPart = className;
  root.append(node);
  return node;
}

function renderSpinner(root) {
  if (!(root instanceof HTMLElement)) return root;
  const config = getSpinnerConfig(root);
  root.classList.add('sf-loader-container');

  if (config.infinite) {
    root.classList.add('sf-loader--infinite');
  } else {
    root.classList.remove('sf-loader--infinite');
  }

  if (config.pixel && config.hasExplicitWidth) {
    root.style.setProperty('--sf-loader-svg-width', `${config.width}px`);
  } else {
    root.style.removeProperty('--sf-loader-svg-width');
  }

  if (config.pixel && (config.hasExplicitHeight || config.hasExplicitWidth)) {
    root.style.setProperty('--sf-loader-svg-height', `${config.height}px`);
  } else {
    root.style.removeProperty('--sf-loader-svg-height');
  }

  if (config.strokeWidth !== null) {
    root.style.setProperty('--sf-loader-stroke-width', `${config.strokeWidth}px`);
  } else {
    root.style.removeProperty('--sf-loader-stroke-width');
  } // A spinner drawn in pixels keeps the pixel strokes it had; one on the ladder
  // strokes on the icon grid.


  root.classList.toggle('sf-loader--pixel-geometry', config.pixel);

  if (config.variant && root.dataset.variant !== config.variant) {
    root.dataset.variant = config.variant;
  } // A .sf-loader--circles part written into the markup gives its place to the
  // indicator, which draws every look.


  const circles = root.querySelector('.sf-loader--circles');

  if (circles && !root.querySelector('.sf-loader--loading-indicator')) {
    const indicator = document.createElement('div');
    indicator.className = 'sf-loader--loading-indicator';
    indicator.dataset.sfSpinnerPart = 'sf-loader--loading-indicator';
    circles.replaceWith(indicator);
  }

  const visual = ensureSpinnerPart(root, '.sf-loader--loading-indicator', 'sf-loader--loading-indicator');
  const label = config.label || config.labelNode ? ensureSpinnerPart(root, '.sf-loader--text', 'sf-loader--text') : null;
  const svg = config.pixel ? createPixelSpinnerSvg({ ...config,
    strokeWidth: config.strokeWidth ?? 4
  }) : (0,_spinner_draw__WEBPACK_IMPORTED_MODULE_4__.createLadderSpinnerSvg)(config);
  visual.append(svg);

  if (label) {
    label.textContent = config.label || '';
  }

  syncSpinnerAccessibility(root, config);
  return root;
}

function bindSpinner(root) {
  if (!(root instanceof HTMLElement) || root.dataset[SPINNER_BOUND_FLAG] === '1') {
    return root;
  }

  renderSpinner(root);
  root.dataset[SPINNER_BOUND_FLAG] = '1';
  return root;
}

function unbindSpinner(root) {
  if (!(root instanceof HTMLElement)) return;
  delete root.dataset[SPINNER_BOUND_FLAG];
}

function initSpinnerTree(target) {
  if (!(target instanceof Element) && target !== document) return;

  if (target instanceof Element && target.matches?.(SPINNER_SELECTOR)) {
    bindSpinner(target);
  }

  target.querySelectorAll?.(SPINNER_SELECTOR).forEach(bindSpinner);
}

class Spinner extends _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__.ComponentObserver {
  static componentName = 'Spinner';

  constructor(props) {
    super(props);
    const {
      // No size unless one is asked for: a written 58 counted as explicit and
      // overrode every size class.
      width,
      height,
      label = (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_2__.pageText)(SPINNER_TEXT, 'label', props?.root ?? document.documentElement),
      // No look unless one is asked for: the page's (data-sf-spinner) applies.
      variant,
      dots = _spinner_draw__WEBPACK_IMPORTED_MODULE_4__.SPINNER_DOTS,
      filled = _spinner_draw__WEBPACK_IMPORTED_MODULE_4__.SPINNER_DOTS_FILLED,
      strokeWidth = null,
      dotRadius = null,
      infinite = false,
      announce = false,
      direction = 'clockwise'
    } = this.params || {};
    const className = this.attrs.class || this.attrs.className;
    this.template = document.createElement('div');

    if (this.id) {
      this.template.id = this.id;
    }

    this.template.classList.add('sf-loader-container');

    if (className) {
      this.template.classList.add(...`${className}`.split(' ').filter(Boolean));
    }

    Object.entries(this.attrs).filter(([attr]) => !['class', 'className'].includes(attr)).forEach(([attr, value]) => {
      if (value === undefined || value === null) return;
      this.template.setAttribute(attr, value);
    });
    if (width !== undefined && width !== null && width !== '') this.template.dataset.width = String(width);
    if (height !== undefined && height !== null && height !== '') this.template.dataset.height = String(height);
    this.template.dataset.label = String(label ?? '');

    if (variant !== undefined && variant !== null && variant !== '') {
      this.template.dataset.variant = String(variant);
    }

    this.template.dataset.dots = String(dots);
    this.template.dataset.filled = String(filled);

    if (strokeWidth !== null && strokeWidth !== undefined && strokeWidth !== '') {
      this.template.dataset.strokeWidth = String(strokeWidth);
    }

    this.template.dataset.infinite = String(infinite);
    this.template.dataset.announce = String(announce);
    this.template.dataset.direction = String(direction);

    if (dotRadius !== null && dotRadius !== undefined) {
      this.template.dataset.dotRadius = String(dotRadius);
    }
  }

  init() {
    bindSpinner(this.template);
  }

  destroyInternal() {
    unbindSpinner(this.template);
  }

}

(0,_register_helper__WEBPACK_IMPORTED_MODULE_1__["default"])('Spinner', Spinner);

if (typeof window !== 'undefined') {
  window.SF = window.SF || {};
  window.SF.Spinner = window.SF.Spinner || {};
  window.SF.Spinner.bind = bindSpinner;
  window.SF.Spinner.render = renderSpinner;
  window.SF.Spinner.unbind = unbindSpinner;
  window.SF.Spinner.createArcSvg = createSpinnerArcSvg;
  window.SF.Spinner.createDotsSvg = createSpinnerDotsSvg;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initSpinnerTree(document));
} else {
  initSpinnerTree(document);
}

const spinnerObserver = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (!(node instanceof Element)) return;
      initSpinnerTree(node);
    });
  });
});
spinnerObserver.observe(document.documentElement, {
  childList: true,
  subtree: true
});

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "d7f974466839"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ComponentObserver: () => (/* binding */ ComponentObserver)
/* harmony export */ });
class ComponentObserver {
  // Components name themselves with a static field (static componentName =
  // 'Modal'), and the Loader writes the name on the prototype only when it
  // registers the class; the lifecycle events read the instance, so an
  // instance made before that announced itself as `undefined:render`. Not a
  // getter: the Loader assigns the prototype property, and an accessor
  // without a setter made that assignment throw.
  lifecycleName() {
    return this.componentName ?? this.constructor.componentName;
  }

  constructor(props) {
    this.props = props;
    this.id = props?.id;
    this.params = props?.param;
    this.attrs = props?.attrs || {};
    this.template = null;
    window.dispatchEvent(new CustomEvent(`${this.lifecycleName()}:beforeRender`, {
      detail: this
    }));
  }

  getUtilityMap() {
    return this.constructor.utilityMap || null;
  }

  extractUtilityClasses(values) {
    if (!Array.isArray(values)) {
      return [];
    }

    const classes = new Set();
    values.forEach(value => {
      if (typeof value !== 'string') {
        return;
      }

      const matches = value.match(/\(([^)]+)\)/g);

      if (!matches) {
        return;
      }

      matches.forEach(match => {
        const raw = match.slice(1, -1);
        raw.split(/\s+/).filter(Boolean).forEach(cls => {
          // Only explicit (.class) annotations are classes; the
          // parentheses in var(--token) are CSS values, not markup.
          if (cls.startsWith('.') && cls.length > 1) classes.add(cls.slice(1));
        });
      });
    });
    return Array.from(classes);
  }

  applyLayoutUtilities(target, selector) {
    if (!target || !selector) {
      return;
    }

    const map = this.getUtilityMap();

    if (!map || !map[selector]) {
      return;
    }

    const classes = this.extractUtilityClasses(map[selector]);
    classes.forEach(cls => target.classList.add(cls));
  }

  render() {
    this.html = this.template;

    if (typeof this.init === 'function') {
      this.init();
    }

    if (this.html) {
      window.dispatchEvent(new CustomEvent(`${this.lifecycleName()}:render`, {
        detail: this
      }));
    }

    return this.html;
  }

  destroy() {
    this.destroyInternal?.();
    this.props = null;
    this.id = null;
    this.params = null;
    this.template = null;

    if (this.html) {
      this.html.remove();
      this.html = null;
    }

    window.dispatchEvent(new CustomEvent(`${this.lifecycleName()}:destroy`, {
      detail: this
    }));
  }

  destroyInternal() {}

}

/***/ },

/***/ "100381bfa317"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _core_js_deprecations__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("d3818183b14c");
/* harmony import */ var _component_spinner_js_spinner__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("eecc41af23fd");
/* harmony import */ var _component_spinner_js_spinner_draw__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("50d2a204ba4c");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("f4cc1d3fd22e");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("4f18051b2e24");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("446b69079a47");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("e0d992e70cd1");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("1de2b9d83763");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_deprecations__WEBPACK_IMPORTED_MODULE_2__, _component_spinner_js_spinner__WEBPACK_IMPORTED_MODULE_3__, _js_templates_default__WEBPACK_IMPORTED_MODULE_5__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_deprecations__WEBPACK_IMPORTED_MODULE_2__, _component_spinner_js_spinner__WEBPACK_IMPORTED_MODULE_3__, _js_templates_default__WEBPACK_IMPORTED_MODULE_5__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_deprecations__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_core_js_deprecations__WEBPACK_IMPORTED_MODULE_2__);









 // sf-spinner from its component.json (standard simai.smart-component 1.3.8
// §3, §4, §4.8): its settings are attributes and properties made by
// core/js/element-manifest.js, its one word («Загрузка…») is lang/<locale>.json
// (a product adds a language through SF.language.register("sf-spinner", code,
// words)), and variant, the pixel geometry and getSpinnerRoot are dated rows
// of aliases.json.

const SpinnerElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_6__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_8__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_9__
  },
  source: 'ru',
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_7__,
  actions: {
    'refresh-spinner'() {
      if (this._boundRoot) (0,_component_spinner_js_spinner__WEBPACK_IMPORTED_MODULE_3__.renderSpinner)(this._boundRoot);
      return {
        outcome: 'applied'
      };
    }

  }
}); // The pixel geometry deprecated since 1.1.0 (journal
// attribute-spinner-pixel-geometry): no longer settings, still drawn by the
// shared spinner, which notes each use, until the sweep.

const PIXEL_GEOMETRY = ['width', 'height', 'stroke-width', 'dot-radius'];

class SfSpinner extends SpinnerElement {
  static get props() {
    return { ...super.props,
      // The axis is called kind, because that is the question it answers.
      // `variant` keeps working: see contracts/public-api-axes.json. Unset, the
      // spinner takes the page's look (data-sf-spinner on html, body or any
      // block; simai/ui-source#11), the arc when the page names none.
      kind: {
        default: '',
        values: ['', ..._component_spinner_js_spinner_draw__WEBPACK_IMPORTED_MODULE_4__.SPINNER_LOOKS],
        aliases: ['variant']
      },
      rootClass: {
        default: ''
      }
    };
  }

  static get observedAttributes() {
    return [...new Set([...super.observedAttributes, ...PIXEL_GEOMETRY])];
  }

  constructor() {
    super();
    this._boundRoot = null;
  }

  get kind() {
    return this.getProp('kind');
  }

  set kind(value) {
    if (value === null || value === undefined || value === '') this.removeAttribute('kind');else this.setAttribute('kind', String(value));
  }

  templateContext() {
    const props = this.getPropsContext();
    return this.createTemplateContext({ ...props,
      // label="" is a spinner with no words -- the table's, which names its
      // busy state elsewhere; only an absent label takes the language file's.
      label: this.label,
      width: this.getAttribute('width') || '',
      height: this.getAttribute('height') || '',
      strokeWidth: this.getAttribute('stroke-width') || '',
      dotRadius: this.getAttribute('dot-radius') || '',
      component: this,
      rootClass: this.getRootClass()
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_5__.renderSpinnerTemplate)(this.templateContext());
  }

  afterRender() {
    if (this._boundRoot) {
      (0,_component_spinner_js_spinner__WEBPACK_IMPORTED_MODULE_3__.unbindSpinner)(this._boundRoot);
      this._boundRoot = null;
    }

    this._boundRoot = this.querySelector('.sf-loader-container');

    if (this._boundRoot) {
      (0,_component_spinner_js_spinner__WEBPACK_IMPORTED_MODULE_3__.bindSpinner)(this._boundRoot);
    }
  }

  afterUpdate() {
    if (this._boundRoot) {
      (0,_component_spinner_js_spinner__WEBPACK_IMPORTED_MODULE_3__.renderSpinner)(this._boundRoot);
    }
  }

  onDisconnected() {
    if (this._boundRoot) {
      (0,_component_spinner_js_spinner__WEBPACK_IMPORTED_MODULE_3__.unbindSpinner)(this._boundRoot);
      this._boundRoot = null;
    }
  } // §4.4: a reader retires; kept until the date and noted on each call.


  getSpinnerRoot() {
    (0,_core_js_deprecations__WEBPACK_IMPORTED_MODULE_2__.noteDeprecated)({
      component: 'sf-spinner',
      tag: 'sf-spinner',
      kind: 'action',
      from: 'getSpinnerRoot',
      to: null,
      since: _aliases_json__WEBPACK_IMPORTED_MODULE_7__.since,
      remove_after: _aliases_json__WEBPACK_IMPORTED_MODULE_7__.remove_after
    });
    return this.querySelector('.sf-loader-container');
  }

}

SfSpinner.define('sf-spinner');
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "f4cc1d3fd22e"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderSpinnerTemplate: () => (/* binding */ renderSpinnerTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);


function joinClasses(...tokens) {
  return tokens.flat().filter(Boolean).join(' ');
}

function valueOrNothing(value) {
  return value === '' || value === null || value === undefined ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : String(value);
}

function normalizeChoice(value, allowed, fallback) {
  const normalized = String(value || '').trim().toLowerCase();
  return allowed.includes(normalized) ? normalized : fallback;
}

function renderSpinnerTemplate(context) {
  const rootClasses = joinClasses('sf-loader-container', `sf-loader--size-${normalizeChoice(context.size, ['1/3', '1/2', '1', '2', '3'], '1')}`, context.rootClass); // width, height, stroke-width and dot-radius are the deprecated pixel geometry
  // (journal attribute-spinner-pixel-geometry): still written through to the
  // spinner, which reads and notes them until the sweep.

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div
      class=${rootClasses}
      style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      data-variant=${valueOrNothing(context.kind ?? context.variant)}
      data-width=${valueOrNothing(context.width)}
      data-height=${valueOrNothing(context.height)}
      data-label=${context.label ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      data-dots=${valueOrNothing(context.dots)}
      data-filled=${valueOrNothing(context.filled)}
      data-stroke-width=${valueOrNothing(context.strokeWidth)}
      data-dot-radius=${valueOrNothing(context.dotRadius)}
      data-infinite=${String(!!context.infinite)}
      data-announce=${String(!!context.announce)}
      data-direction=${normalizeChoice(context.direction, ['clockwise', 'counterclockwise'], 'clockwise')}
    ></div>
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

/***/ "2a080a730149"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("lit", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "43090d1c8307"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("page-language", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("page-language", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "deb1a4d61565"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("smart-base", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("smart-base", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "446b69079a47"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-spinner for the shim (core/js/aliases.js, standard §16 item 20). mode: same-detail (the shim sends the new and the old name), detail-adds (the new detail holds the old fields), attribute-and-property, host-attribute (no shim), manifest-only (the DOM name does not change), retired (no new name; kept and noted by the component until the date).","component":"sf-spinner","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"variant","to":"kind","kind":"setting","component":"sf-spinner","since":"2026-10-27","remove_after":"2026-12-01","section":"the axis\'s old name (contracts/public-api-axes.json)"},{"from":"width","to":null,"kind":"attribute","component":"sf-spinner","since":"2026-10-27","remove_after":"2026-12-01","mode":"retired","section":"§16 item 20 (compatibility.deprecations, since 1.1.0)","note":"the pixel geometry: replaced by size; still drawn by the shared spinner and noted there until the date"},{"from":"height","to":null,"kind":"attribute","component":"sf-spinner","since":"2026-10-27","remove_after":"2026-12-01","mode":"retired","section":"§16 item 20 (compatibility.deprecations, since 1.1.0)","note":"the pixel geometry: replaced by size; still drawn by the shared spinner and noted there until the date"},{"from":"stroke-width","to":null,"kind":"attribute","component":"sf-spinner","since":"2026-10-27","remove_after":"2026-12-01","mode":"retired","section":"§16 item 20 (compatibility.deprecations, since 1.1.0)","note":"the pixel geometry: replaced by size; still drawn by the shared spinner and noted there until the date"},{"from":"dot-radius","to":null,"kind":"attribute","component":"sf-spinner","since":"2026-10-27","remove_after":"2026-12-01","mode":"retired","section":"§16 item 20 (compatibility.deprecations, since 1.1.0)","note":"the pixel geometry: replaced by size; still drawn by the shared spinner and noted there until the date"},{"from":"getSpinnerRoot","to":null,"kind":"action","component":"sf-spinner","since":"2026-10-27","remove_after":"2026-12-01","mode":"retired","section":"§4.4","note":"a reader retires; the method stays until the date and notes each call"}]}');

/***/ },

/***/ "4f18051b2e24"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.spinner","tag":"sf-spinner","version":"1.2.1","kind":"leaf","settings":{"size":{"type":"enum","values":["1/3","1/2","1","2","3"],"default":"1"},"label":{"type":"string","default-from":"runtime.label"},"kind":{"type":"enum","values":["","arc","breathing","comet","dots"],"default":""},"dots":{"type":"number","default":8,"integer":true,"min":1},"filled":{"type":"number","default":3,"integer":true,"min":0},"infinite":{"type":"boolean","default":false},"announce":{"type":"boolean","default":false},"direction":{"type":"enum","values":["clockwise","counterclockwise"],"default":"clockwise"}},"values":{},"events":{},"actions":{"refresh-spinner":{"x-outcomes":["applied"],"x-summary":"Draws the spinner again from its settings (after the page changed data-sf-spinner around it)"}},"css-variables":{"--sf-spinner-color":{"type":"color","state":"default"},"--sf-spinner-track-color":{"type":"color","state":"default"},"--sf-spinner-size":{"type":"length","state":"default"},"--sf-spinner-stroke-width":{"type":"number","state":"default"},"--sf-spinner-gap":{"type":"length","state":"default"},"--sf-spinner-text-color":{"type":"color","state":"default"}}}');

/***/ },

/***/ "e0d992e70cd1"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Spinner","runtime":{"label":"Loading…"}}');

/***/ },

/***/ "1de2b9d83763"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Спиннер","runtime":{"label":"Загрузка…"}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("100381bfa317");
/******/
/******/ })()
;