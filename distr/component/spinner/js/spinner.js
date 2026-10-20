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
// rather than a filled black disc; the comet and the dots wait hidden.


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
    'stroke-dasharray': '0 100',
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
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

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
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("8489d1f5bab4");
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("06e8cd089f28");
/* harmony import */ var _spinner_draw__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("50d2a204ba4c");





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


/***/ },

/***/ "11ee8fe694f8"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _spinner__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("eecc41af23fd");
/*
* Main JS file for including JS for component.
*
* Imports:
* - Base function component (_component_name.js)
*/


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
// <html data-sf-deprecations="warn"> or SF.deprecations.warn = true.
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
  to = null
} = {}) {
  if (!from) return;
  const key = [component, kind, attribute, from].join('|');
  const notes = sharedNotes();
  const existing = notes.get(key);

  if (existing) {
    existing.count += 1;
    return;
  }

  notes.set(key, {
    component,
    kind,
    attribute,
    from,
    to,
    count: 1
  });

  if (warnEnabled()) {
    const where = component ? `${component}: ` : '';
    const what = kind === 'value' ? `${attribute}="${from}"` : `${kind} ${from}`;
    globalThis.console?.warn?.(`[SIMAI Framework] ${where}${what} is a legacy name${to ? `; write ${to}` : ''}. See contracts/changes/journal.json.`);
  }
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

/***/ "8489d1f5bab4"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isRussianPage: () => (/* binding */ isRussianPage),
/* harmony export */   language: () => (/* binding */ language),
/* harmony export */   pageLanguage: () => (/* binding */ pageLanguage),
/* harmony export */   pageLocale: () => (/* binding */ pageLocale),
/* harmony export */   pageText: () => (/* binding */ pageText)
/* harmony export */ });
// What language a component speaks, and how a product adds one.
//
// The Framework speaks English by default and whatever the page says otherwise:
// the language is the nearest [lang] above the node, else the document's, else
// English. One rule for every component, so a page never mixes two because two
// components looked in different places.
//
// Until 2026-10-10 that was the whole of it, and every component carried a
// dictionary of exactly two languages written into its source. Adding a third
// meant editing sixteen files, and a product that needed one could not add it
// at all. There will be many more than two (owner, 2026-10-11), so the
// dictionaries a component ships are now a FLOOR rather than the whole set:
// anything can be registered beside them, for any language, including one the
// Framework has never heard of.
//
// Where a word comes from, in order:
//
//   1. the component's own attribute — a consumer who names a word has named
//      it, and no language changes it;
//   2. a word registered for the resolved language;
//   3. the word the component ships for that language;
//   4. the same two again for the language without its region (`pt-BR` → `pt`);
//   5. the same two again for English;
//   6. the key itself, which is a visible defect rather than a blank.
//
// Registering is additive and reversible, and it does not require the
// Framework to know the language exists.
// The state is shared between every copy of this module, which there are
// several of: core, each smart component and each composite are separate
// bundles, and each one carries its own copy of this file. With the registry
// in module scope the page had as many registries as bundles -- `SF.language`
// was published from core's copy, the table read its own, and registering a
// language changed nothing on screen. Only a browser shows that, and it did
// (2026-10-11).
const STORE = (() => {
  const root = typeof globalThis !== 'undefined' ? globalThis : {};
  const key = '__sfPageLanguage';

  if (!root[key]) {
    root[key] = {
      listeners: new Set(),
      registered: new Map(),
      chosen: null
    };
  }

  return root[key];
})();

const LISTENERS = STORE.listeners;
const REGISTERED = STORE.registered;

const normalise = value => String(value ?? '').trim().toLowerCase().replace('_', '-');
/** The languages to try, most specific first, English last. */


const chain = language => {
  const wanted = normalise(language);
  const base = wanted.split('-')[0];
  const order = [];

  for (const candidate of [wanted, base, 'en']) {
    if (candidate && !order.includes(candidate)) order.push(candidate);
  }

  return order;
};
/** Which component a node belongs to, for words registered against one. */


const componentOf = node => {
  const tag = node?.tagName;
  return typeof tag === 'string' ? tag.toLowerCase() : null;
};

const announce = () => {
  for (const listener of [...LISTENERS]) {
    try {
      listener();
    } catch {// A listener that throws is not allowed to stop the others: a page that
      // half-changed language would be worse than one that did not change.
    }
  }
}; // The nearest element that says its language, looking past shadow roots: a
// pagination drawn inside a data view's shadow root found no [lang] there,
// fell back to <html lang> and spoke English inside a Russian admin whose
// language was set on the shell around it.


function langOwner(node) {
  let current = node;

  while (current) {
    const owner = typeof current.closest === 'function' ? current.closest('[lang]') : null;
    if (owner) return owner;
    const root = typeof current.getRootNode === 'function' ? current.getRootNode() : null;
    current = root && root !== current && root.host ? root.host : null;
  }

  return null;
}
/**
 * The page's language for this node: the nearest [lang], else the document's,
 * else English — unless a product has chosen one explicitly.
 */


function pageLanguage(node) {
  // The language without its region, whichever way it was set: a page that
  // chose 'pt-BR' is a Portuguese page, as a page whose markup says
  // lang="pt-BR" is. The chosen value kept its region and answered 'pt-br',
  // which matched no dictionary keyed by language and made isRussianPage false
  // on a page that chose 'ru-RU'. The region stays in pageLocale.
  if (STORE.chosen) return STORE.chosen.split('-')[0];
  const owner = langOwner(node);
  const value = owner?.getAttribute('lang') || globalThis.document?.documentElement?.lang || 'en';
  return normalise(value).split('-')[0] || 'en';
}
/** The page's language with its region kept, which is what formatting wants. */

function pageLocale(node) {
  if (STORE.chosen) return STORE.chosen;
  const owner = langOwner(node);
  return normalise(owner?.getAttribute('lang') || globalThis.document?.documentElement?.lang || 'en');
}
function isRussianPage(node) {
  return pageLanguage(node) === 'ru';
}
/**
 * Text for `key` in the page's language.
 *
 * `dictionary` is what the component ships; `component` names it for the
 * registry and defaults to the node's own tag, so a component calling with
 * `this` identifies itself without saying so twice.
 */

function pageText(dictionary, key, node, component) {
  const owner = component ?? componentOf(node);

  for (const candidate of chain(pageLocale(node))) {
    const added = owner ? REGISTERED.get(owner)?.get(candidate)?.[key] : undefined;
    if (added !== undefined) return added;
    const shipped = dictionary?.[candidate]?.[key];
    if (shipped !== undefined) return shipped;
  }

  return key;
}
const language = {
  /** What the page resolves to for this node, region and all. */
  current(node = globalThis.document?.documentElement ?? null) {
    return pageLocale(node);
  },

  /**
   * Choose a language for the whole page, whatever its markup says. `null`
   * returns to following the document, which is the default and what a
   * server-rendered page wants.
   */
  use(value) {
    const next = value === null || value === undefined ? null : normalise(value);
    if (next === STORE.chosen) return STORE.chosen;
    STORE.chosen = next;
    announce();
    return STORE.chosen;
  },

  /**
   * Add or replace one component's words for one language.
   *
   * The words are merged, so a product can correct a single label without
   * restating the rest, and `null` removes what it added.
   */
  register(component, value, words) {
    const name = String(component ?? '').toLowerCase();
    const code = normalise(value);
    if (!name || !code) throw new TypeError('a component and a language are required');
    if (!REGISTERED.has(name)) REGISTERED.set(name, new Map());
    const byLanguage = REGISTERED.get(name);
    if (words === null) byLanguage.delete(code);else byLanguage.set(code, { ...(byLanguage.get(code) ?? {}),
      ...words
    });
    announce();
    return this;
  },

  /** One language across many components: `{ 'sf-datepicker': {...}, ... }`. */
  registerAll(value, byComponent = {}) {
    for (const [component, words] of Object.entries(byComponent)) {
      this.register(component, value, words);
    }

    return this;
  },

  /** The languages something has registered words for. */
  known(component) {
    const name = String(component ?? '').toLowerCase();
    return [...(REGISTERED.get(name)?.keys() ?? [])];
  },

  /** Every component something has been registered for. */
  components() {
    return [...REGISTERED.keys()];
  },

  /**
   * Called whenever the chosen language or the registered words change, so a
   * component can draw itself again. Returns the way to stop listening.
   */
  onChange(listener) {
    if (typeof listener !== 'function') return () => {};
    LISTENERS.add(listener);
    return () => LISTENERS.delete(listener);
  },

  /** Everything registered is forgotten. For tests, and for a product reset. */
  forget() {
    REGISTERED.clear();
    STORE.chosen = null;
    announce();
    return this;
  }

}; // Reachable by a consumer, which it was not: `sf-admin-menu` had written its
// own reading of the rule because the shared one was an internal module, and
// the two then disagreed about a region that names its own language. A product
// composing its own elements gets the same rule here.

if (typeof window !== 'undefined') {
  window.SF = window.SF || {};
  window.SF.language = language;
  window.SF.pageLanguage = pageLanguage;
  window.SF.pageText = pageText;
}

/***/ },

/***/ "71a47b831017"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


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
let __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("71a47b831017");
/* harmony import */ var _js_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("11ee8fe694f8");
/**
* SIMAI Framework
* Copyright 2008-2026 SIMAI Ltd
* http://simai.studio
* Read the license: http://framework.simai.studio/license/
* Documentation: http://framework.simai.studio/
* Support: http://simai.studio/support/
*
* SPINNER
*
* Entry point for importing components from this directory.
* Simplifies the import process in other parts of the project.
* Instead of importing individual files, all component can be imported through this file.
*/


})();

/******/ })()
;