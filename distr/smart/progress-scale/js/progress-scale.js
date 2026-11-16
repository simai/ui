/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "e6d86f2cd058"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FIELD_LADDER: () => (/* binding */ FIELD_LADDER),
/* harmony export */   FIELD_SIZES: () => (/* binding */ FIELD_SIZES),
/* harmony export */   INPUT_SIZES: () => (/* binding */ INPUT_SIZES),
/* harmony export */   RETIRED_FIELD_SIZES: () => (/* binding */ RETIRED_FIELD_SIZES),
/* harmony export */   fieldSize: () => (/* binding */ fieldSize),
/* harmony export */   inputSize: () => (/* binding */ inputSize),
/* harmony export */   ladderSize: () => (/* binding */ ladderSize),
/* harmony export */   nearestFieldSize: () => (/* binding */ nearestFieldSize),
/* harmony export */   retireFieldSizeClass: () => (/* binding */ retireFieldSizeClass)
/* harmony export */ });
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d3818183b14c");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_0__);
// Form fields come in three sizes. 1/3 and 3 were retired: no consumer used
// them, and they could not hold a field's own pictures, tags and targets. A
// page written for a retired size keeps rendering at the nearest kept size, and
// says so once in the console so the markup can be updated.
//
// The fields of the field ladder below are the exception: they stand on all
// five steps, as sf-input does.

const FIELD_SIZES = Object.freeze(['1/2', '1', '2']);
const RETIRED_FIELD_SIZES = Object.freeze({
  '1/3': '1/2',
  '3': '2'
});
const warned = new Set(); // A control placed inside something with the whole scale (a list item, say)
// takes the nearest form size, quietly: the list is not wrong to be 1/3.

function nearestFieldSize(value) {
  const size = String(value ?? '').trim().toLowerCase();
  if (FIELD_SIZES.includes(size)) return size;
  return Object.hasOwn(RETIRED_FIELD_SIZES, size) ? RETIRED_FIELD_SIZES[size] : '1';
}
function fieldSize(value, component = 'field', fallback = '1') {
  const size = String(value ?? '').trim().toLowerCase();
  if (FIELD_SIZES.includes(size)) return size;

  if (Object.hasOwn(RETIRED_FIELD_SIZES, size)) {
    const kept = RETIRED_FIELD_SIZES[size];
    (0,_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_0__.noteDeprecated)({
      component,
      kind: 'value',
      attribute: 'size',
      from: size,
      to: kept
    });
    const key = `${component}:${size}`;

    if (!warned.has(key) && typeof console !== 'undefined') {
      warned.add(key);
      console.warn(`[SIMAI Framework] ${component}: size ${size} is retired for form fields; rendering size ${kept}.`);
    }

    return kept;
  }

  return fallback;
} // The field ladder (fields ladder, 2026-11-14): one height per step for every
// field that stands on it, the control ladder sf-button and sf-button-icon
// stand on (--sf-ui-<size>--control-height: 28 / 32 / 40 / 48 / 56 on a
// desktop). A text field kept the outer steps first (actions block item 4,
// 2026-11-08: a toolbar search or a hero search stands beside buttons of 1/3
// and 3); sf-input-lookup, -quantity, -date, -code, -color and -country drew
// 32 / 48 or 40 at 1/3 and 3 beside it, so they take the same five steps and
// the stylesheets size their parts from the same steps
// (component/inputs/scss/_field-ladder.scss). The other fields (textarea,
// dropdown, file upload, image, rich text) keep the three sizes for now.

const FIELD_LADDER = Object.freeze(['1/3', ...FIELD_SIZES, '3']);
const INPUT_SIZES = FIELD_LADDER;
/** A size on the field ladder: one of the five steps, else the fallback. */

function ladderSize(value, fallback = '1') {
  const size = String(value ?? '').trim().toLowerCase();
  return FIELD_LADDER.includes(size) ? size : fallback;
}
function inputSize(value, fallback = '1') {
  return ladderSize(value, fallback);
} // Markup written by hand carries its size as a class, so the binder moves a
// retired size class to the kept one before anything measures the field.

function retireFieldSizeClass(root, block) {
  if (!root?.classList) return;

  for (const [retired, kept] of Object.entries(RETIRED_FIELD_SIZES)) {
    const name = `${block}--size-${retired}`;
    if (!root.classList.contains(name)) continue;
    root.classList.replace(name, `${block}--size-${fieldSize(retired, block)}`);
  }
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "736e917526e6"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bindProgressScale: () => (/* binding */ bindProgressScale),
/* harmony export */   getProgressScaleState: () => (/* binding */ getProgressScaleState),
/* harmony export */   initExistingProgressScales: () => (/* binding */ initExistingProgressScales),
/* harmony export */   normalizeProgressScaleStep: () => (/* binding */ normalizeProgressScaleStep),
/* harmony export */   normalizeProgressScaleSteps: () => (/* binding */ normalizeProgressScaleSteps),
/* harmony export */   normalizeProgressScaleValue: () => (/* binding */ normalizeProgressScaleValue),
/* harmony export */   progressScaleLit: () => (/* binding */ progressScaleLit),
/* harmony export */   setProgressScaleState: () => (/* binding */ setProgressScaleState),
/* harmony export */   unbindProgressScale: () => (/* binding */ unbindProgressScale)
/* harmony export */ });
/* harmony import */ var _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d7f974466839");
/* harmony import */ var _register_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("58661bec99a6");
/* harmony import */ var _core_js_format_number_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("c9ce0852ac73");
/* harmony import */ var _progress_threshold__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("a9f36a72486a");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_format_number_js__WEBPACK_IMPORTED_MODULE_2__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
_core_js_format_number_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_async_dependencies_result__[0];




const PROGRESS_SCALE_SELECTOR = '.sf-progress-scale';
const BOUND_FLAG = 'sfProgressScaleBound';
const SIZE_VALUES = ['1/3', '1/2', '1', '2', '3']; // The shared status words (owner decision C131 (1)): no status draws the
// theme's primary and carries no class; neutral is grey, as in sf-dot and
// sf-badge. `primary` is the former word for no status.

const TONE_VALUES = ['neutral', 'info', 'success', 'warning', 'error'];

function normalizeProgressScaleValue(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 0;
  return Math.max(0, Math.min(100, parsed));
} // The blocks never show more than is done (PG-12): 61 % lights 6 of 10, not 7;
// a block lights only once its tenth is reached. The epsilon keeps a value
// that is a whole tenth in decimal (70) from falling a block short in binary.


function normalizeProgressScaleStep(value) {
  return Math.floor(normalizeProgressScaleValue(value) / 10 + 1e-9) * 10;
} // A level of N (owner decision C185 (5)): the scale draws 2 to 10 steps, 10
// when none is given. A scale given its steps is a level -- «4 из 5», a
// password's strength -- and says so at the end of its row.


const STEPS_DEFAULT = 10;

function normalizeProgressScaleSteps(value) {
  const parsed = Math.trunc(Number(value));
  if (!Number.isFinite(parsed)) return STEPS_DEFAULT;
  return Math.max(2, Math.min(10, parsed));
} // The steps a value lights, rounded down as the tenths are (PG-12): 79 % of
// 5 steps lights 3, not 4.


function progressScaleLit(value, steps) {
  return Math.floor(normalizeProgressScaleValue(value) / 100 * steps + 1e-9);
} // «4 из 5» in the page's language: the scale's own words, as the Smart
// element's (lang/*.json «of-steps»).


function levelWords(lit, steps) {
  const lang = String(globalThis.document?.documentElement?.lang || '').toLowerCase();
  return lang.startsWith('ru') ? `${lit} из ${steps}` : `${lit} of ${steps}`;
}

function normalizeProgressScaleSize(value) {
  const normalized = String(value || '').toLowerCase();
  return SIZE_VALUES.includes(normalized) ? normalized : '1';
}

function normalizeProgressScaleTone(value) {
  const normalized = String(value || '').toLowerCase();
  return TONE_VALUES.includes(normalized) ? normalized : '';
}

function normalizeBoolean(value, fallback = true) {
  if (value === undefined || value === null || value === '') return fallback;
  if (typeof value === 'boolean') return value;
  return !['false', '0', 'no', 'off'].includes(String(value).toLowerCase());
}

function ensureScaleStructure(root, steps = STEPS_DEFAULT) {
  let container = root.querySelector('.sf-progress-scale-container');

  if (!container) {
    container = document.createElement('div');
    container.className = 'sf-progress-scale-container grid overflow-hidden';
    root.prepend(container);
  }

  container.setAttribute('aria-hidden', 'true'); // Ten steps keep the grid utility they always had; any other count lays
  // its blocks out by the component's own columns (one per block).

  container.classList.toggle('grid-col-10', steps === STEPS_DEFAULT);
  const blocks = [...container.querySelectorAll('.sf-progress-scale-block')];

  for (let index = blocks.length; index < steps; index += 1) {
    const block = document.createElement('div');
    block.className = 'sf-progress-scale-block';
    container.append(block);
  }

  blocks.slice(steps).forEach(block => block.remove());
}

function ensureScaleText(root) {
  let text = root.querySelector('.sf-progress-scale-text, .sf-scale-text');

  if (!text) {
    text = document.createElement('div');
    root.append(text);
  }

  text.classList.add('sf-progress-scale-text');
  return text;
}

function syncScaleClasses(root, step, size, tone) {
  for (let current = 0; current <= 100; current += 10) {
    root.classList.toggle(`sf-progress-scale--${current}`, current === step);
  }

  SIZE_VALUES.forEach(current => {
    root.classList.toggle(`sf-progress-scale--size-${current}`, current === size);
  });
  TONE_VALUES.forEach(current => {
    root.classList.toggle(`sf-progress-scale--${current}`, current === tone);
  });
}

function renderProgressScale(root) {
  if (!root) return false; // A level scale is one given its steps (C185 (5)).

  const level = root.dataset.steps !== undefined && root.dataset.steps !== '';
  const steps = level ? normalizeProgressScaleSteps(root.dataset.steps) : STEPS_DEFAULT;
  ensureScaleStructure(root, steps);
  const value = normalizeProgressScaleValue(root.dataset.value);
  const lit = progressScaleLit(value, steps); // The class lights the first n blocks (sf-progress-scale--<n*10>).

  const step = lit * 10;
  const size = normalizeProgressScaleSize(root.dataset.size);
  const tone = normalizeProgressScaleTone(root.dataset.tone); // The thresholds (C131 (7)), as sf-progress-scale's warning-at and
  // error-at: from data-warning-at on the scale is a warning by itself, from
  // data-error-at an error; the more serious of that and data-tone is drawn.
  // The page's tone stays in data-tone, so a value that falls back below the
  // threshold draws it again.

  const drawn = normalizeProgressScaleTone((0,_progress_threshold__WEBPACK_IMPORTED_MODULE_3__.effectiveStatus)(tone, value, (0,_progress_threshold__WEBPACK_IMPORTED_MODULE_3__.readThreshold)(root.dataset.warningAt), (0,_progress_threshold__WEBPACK_IMPORTED_MODULE_3__.readThreshold)(root.dataset.errorAt)));
  const showText = normalizeBoolean(root.dataset.showText, true); // A scale on a text line, and a level scale, lay their track and value out
  // in a row, the value at the row's end (C185 (5)); any other scale stands
  // its value under the track.

  const onRow = level || /(^|\s)sf-progress-scale--line-/.test(root.className);
  root.classList.add('sf-progress-scale', 'flex', onRow ? 'flex-row' : 'flex-col');
  root.classList.remove(onRow ? 'flex-col' : 'flex-row');
  root.classList.toggle('sf-progress-scale--level', level);
  syncScaleClasses(root, step, size, drawn);
  root.dataset.value = String(value);
  root.dataset.size = size;
  root.dataset.tone = tone;
  root.dataset.showText = String(showText); // Meter (C131 (7)): an amount within a known range, not a task's progress.

  root.setAttribute('role', root.dataset.meter === 'true' ? 'meter' : 'progressbar'); // A level is read in its steps: «4 из 5», or the page's level word.

  const words = level ? levelWords(lit, steps) : '';
  root.setAttribute('aria-valuemin', '0');
  root.setAttribute('aria-valuemax', level ? String(steps) : '100');
  root.setAttribute('aria-valuenow', level ? String(lit) : String(value));
  if (root.dataset.label) root.setAttribute('aria-label', root.dataset.label);
  if (root.dataset.valueText || words) root.setAttribute('aria-valuetext', root.dataset.valueText || words);else root.removeAttribute('aria-valuetext');
  const text = ensureScaleText(root); // «72 %»: one spelling of a per cent (owner decision C203 (3)); a level keeps its words (C185 (5)).

  text.textContent = level ? root.dataset.valueText || words : (0,_core_js_format_number_js__WEBPACK_IMPORTED_MODULE_2__.percentText)(value, root);
  text.hidden = !showText;
  return true;
}

function bindProgressScale(root) {
  if (!root || root.dataset[BOUND_FLAG] === '1') return;
  renderProgressScale(root);
  root.dataset[BOUND_FLAG] = '1';
}

function unbindProgressScale(root) {
  if (!root || root.dataset[BOUND_FLAG] !== '1') return;
  delete root.dataset[BOUND_FLAG];
}

function initExistingProgressScales(target = document) {
  target.querySelectorAll(PROGRESS_SCALE_SELECTOR).forEach(bindProgressScale);
}

function setProgressScaleState(target, state = {}) {
  const root = target instanceof HTMLElement ? target.closest(PROGRESS_SCALE_SELECTOR) || target : null;
  if (!root) return false;

  if (Object.prototype.hasOwnProperty.call(state, 'value')) {
    root.dataset.value = String(normalizeProgressScaleValue(state.value));
  }

  if (Object.prototype.hasOwnProperty.call(state, 'size')) {
    root.dataset.size = normalizeProgressScaleSize(state.size);
  } // A progress indicator's colour role is its status (journal record
  // attribute-tone-to-status); tone is still read until that record leaves.


  if (Object.prototype.hasOwnProperty.call(state, 'status') || Object.prototype.hasOwnProperty.call(state, 'tone')) {
    root.dataset.tone = normalizeProgressScaleTone(state.status ?? state.tone);
  }

  if (Object.prototype.hasOwnProperty.call(state, 'showText')) {
    root.dataset.showText = String(normalizeBoolean(state.showText, true));
  } // The thresholds in per cent; null or an empty value takes one away.


  [['warningAt', 'warningAt'], ['errorAt', 'errorAt']].forEach(([key, data]) => {
    if (!Object.prototype.hasOwnProperty.call(state, key)) return;
    const threshold = (0,_progress_threshold__WEBPACK_IMPORTED_MODULE_3__.readThreshold)(state[key]);
    if (threshold === null) delete root.dataset[data];else root.dataset[data] = String(threshold);
  });

  if (Object.prototype.hasOwnProperty.call(state, 'label')) {
    const label = String(state.label || '').trim();

    if (label) {
      root.dataset.label = label;
      root.setAttribute('aria-label', label);
    } else {
      delete root.dataset.label;
      root.removeAttribute('aria-label');
    }
  }

  if (Object.prototype.hasOwnProperty.call(state, 'valueText')) {
    const valueText = String(state.valueText || '').trim();
    if (valueText) root.dataset.valueText = valueText;else delete root.dataset.valueText;
  }

  if (Object.prototype.hasOwnProperty.call(state, 'meter')) {
    if (state.meter) root.dataset.meter = 'true';else delete root.dataset.meter;
  }

  if (Object.prototype.hasOwnProperty.call(state, 'steps')) {
    if (state.steps === null || state.steps === undefined || state.steps === '') delete root.dataset.steps;else root.dataset.steps = String(normalizeProgressScaleSteps(state.steps));
  }

  return renderProgressScale(root);
}

function getProgressScaleState(target) {
  const root = target instanceof HTMLElement ? target.closest(PROGRESS_SCALE_SELECTOR) || target : null;
  if (!root) return null;
  return {
    value: normalizeProgressScaleValue(root.dataset.value),
    size: normalizeProgressScaleSize(root.dataset.size),
    status: normalizeProgressScaleTone(root.dataset.tone),
    tone: normalizeProgressScaleTone(root.dataset.tone),
    // The status drawn: the tone, or the threshold the value reached.
    drawnStatus: normalizeProgressScaleTone((0,_progress_threshold__WEBPACK_IMPORTED_MODULE_3__.effectiveStatus)(normalizeProgressScaleTone(root.dataset.tone), normalizeProgressScaleValue(root.dataset.value), (0,_progress_threshold__WEBPACK_IMPORTED_MODULE_3__.readThreshold)(root.dataset.warningAt), (0,_progress_threshold__WEBPACK_IMPORTED_MODULE_3__.readThreshold)(root.dataset.errorAt))),
    warningAt: (0,_progress_threshold__WEBPACK_IMPORTED_MODULE_3__.readThreshold)(root.dataset.warningAt),
    errorAt: (0,_progress_threshold__WEBPACK_IMPORTED_MODULE_3__.readThreshold)(root.dataset.errorAt),
    showText: normalizeBoolean(root.dataset.showText, true),
    label: root.getAttribute('aria-label') || '',
    valueText: root.getAttribute('aria-valuetext') || '',
    meter: root.dataset.meter === 'true',
    steps: root.dataset.steps ? normalizeProgressScaleSteps(root.dataset.steps) : null
  };
}

class ProgressScale extends _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__.ComponentObserver {
  static componentName = 'ProgressScale';
  html = null;

  constructor(props) {
    super(props);
    const {
      size = '1',
      value = 0,
      status,
      tone = '',
      showText = true,
      label = '',
      valueText = '',
      meter = false,
      steps = null,
      warningAt = null,
      errorAt = null
    } = this.params || {};
    const root = document.createElement('div');
    root.className = 'sf-progress-scale flex flex-col';
    root.dataset.size = normalizeProgressScaleSize(size);
    root.dataset.value = String(normalizeProgressScaleValue(value));
    root.dataset.tone = normalizeProgressScaleTone(status ?? tone);
    root.dataset.showText = String(normalizeBoolean(showText, true));
    if (String(label).trim()) root.dataset.label = String(label).trim();
    if (String(valueText).trim()) root.dataset.valueText = String(valueText).trim();
    if (meter) root.dataset.meter = 'true';
    if (steps !== null && steps !== undefined && steps !== '') root.dataset.steps = String(normalizeProgressScaleSteps(steps));
    if ((0,_progress_threshold__WEBPACK_IMPORTED_MODULE_3__.readThreshold)(warningAt) !== null) root.dataset.warningAt = String((0,_progress_threshold__WEBPACK_IMPORTED_MODULE_3__.readThreshold)(warningAt));
    if ((0,_progress_threshold__WEBPACK_IMPORTED_MODULE_3__.readThreshold)(errorAt) !== null) root.dataset.errorAt = String((0,_progress_threshold__WEBPACK_IMPORTED_MODULE_3__.readThreshold)(errorAt));
    this.template = root;
  }

  init() {
    bindProgressScale(this.template);
  }

  destroyInternal() {
    unbindProgressScale(this.template);
  }

}

(0,_register_helper__WEBPACK_IMPORTED_MODULE_1__["default"])('ProgressScale', ProgressScale);

if (typeof window !== 'undefined') {
  window.SF = window.SF || {};
  window.SF.ProgressScale = window.SF.ProgressScale || {};
  window.SF.ProgressScale.getState = getProgressScaleState;
  window.SF.ProgressScale.setState = setProgressScaleState;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initExistingProgressScales(), {
    once: true
  });
} else {
  initExistingProgressScales();
}

const progressScaleObserver = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (!(node instanceof Element)) return;
      if (node.matches?.(PROGRESS_SCALE_SELECTOR)) bindProgressScale(node);
      initExistingProgressScales(node);
    });
  });
});
progressScaleObserver.observe(document.documentElement, {
  childList: true,
  subtree: true
});

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "a9f36a72486a"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   STATUS_RANK: () => (/* binding */ STATUS_RANK),
/* harmony export */   effectiveStatus: () => (/* binding */ effectiveStatus),
/* harmony export */   readThreshold: () => (/* binding */ readThreshold),
/* harmony export */   thresholdStatus: () => (/* binding */ thresholdStatus)
/* harmony export */ });
// The status a progress indicator draws (owner decision C131 (7)): the more
// serious of the page's status and the threshold its value reached. The
// thresholds are the page's, in per cent like the value; unset (null, an
// empty attribute, a word) is no threshold. neutral, info and success rank
// below warning, warning below error. One source for sf-progress-bar,
// sf-progress-scale and the class scale (div.sf-progress-scale with
// data-warning-at / data-error-at), so a scale and a bar with the same
// numbers draw the same colour.
const STATUS_RANK = {
  warning: 1,
  error: 2
};
function thresholdStatus(value, warningAt, errorAt) {
  const number = Number(value);
  if (!Number.isFinite(number)) return '';
  if (Number.isFinite(errorAt) && number >= errorAt) return 'error';
  if (Number.isFinite(warningAt) && number >= warningAt) return 'warning';
  return '';
}
function effectiveStatus(status, value, warningAt, errorAt) {
  const reached = thresholdStatus(value, warningAt, errorAt);
  return (STATUS_RANK[reached] ?? 0) > (STATUS_RANK[status] ?? 0) ? reached : status;
} // A threshold as an attribute holds it: a number, else none. An empty or
// missing attribute is none, never 0 (Number('') is 0).

function readThreshold(raw) {
  if (raw === null || raw === undefined || String(raw).trim() === '') return null;
  const number = Number(raw);
  return Number.isFinite(number) ? number : null;
}

/***/ },

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

/***/ "15b4e93ff6ed"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   formatLocale: () => (/* binding */ formatLocale),
/* harmony export */   intlFormatter: () => (/* binding */ intlFormatter),
/* harmony export */   toDate: () => (/* binding */ toDate)
/* harmony export */ });
/* harmony import */ var _page_language_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("43090d1c8307");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_page_language_js__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
_page_language_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var _page_language_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_page_language_js__WEBPACK_IMPORTED_MODULE_0__);
// The part every format module shares (core/js/format.js says what the
// helpers are): the locale a call formats in, a Date from what a host gives,
// and the Intl formatters, kept on a global every copy of these modules shares
// (bundles each carry their own module copy; page-language.js says why).
//
// No top-level side effects, here or in format-number.js, format-date.js,
// format-relative.js and format-file-size.js (ui-chart, 2026-11-05): a bundle
// that imports one function carries that function and what it calls, nothing
// else. The global is made on the first format, not on load, and SF.format is
// published by core's entry (index.js, publishFormat in format.js).

/** The locale a call formats in: the one it names, else its node's page language. */

function formatLocale({
  locale,
  node
} = {}) {
  return String(locale || '').trim() || (0,_page_language_js__WEBPACK_IMPORTED_MODULE_0__.pageLocale)(node);
}
/** A Date from a Date, a time in milliseconds or a date string; null when it is none. */

function toDate(value) {
  if (value === null || value === undefined || value === '') return null;
  const date = value instanceof Date ? new Date(value.getTime()) : new Date(typeof value === 'string' && /^\d+$/u.test(value) ? Number(value) : value);
  return Number.isNaN(date.getTime()) ? null : date;
} // The formatters every copy shares, made on the first call.

function formatterCache() {
  const root = typeof globalThis !== 'undefined' ? globalThis : {};
  if (!root.__sfFormat) root.__sfFormat = {
    formatters: new Map()
  };
  return root.__sfFormat.formatters;
} // One formatter per kind, locale and options. An unknown locale falls back to
// the browser's, and options the platform refuses (an unknown unit or
// currency) to a plain number, so a typo in a page never throws at a reader.


function intlFormatter(kind, locale, options) {
  const key = `${kind}|${locale}|${JSON.stringify(options)}`;
  const cache = formatterCache();
  if (cache.has(key)) return cache.get(key);
  const Make = Intl[kind];
  let made;

  try {
    made = new Make(locale || undefined, options);
  } catch {
    try {
      made = new Make(undefined, options);
    } catch {
      made = new Make(locale || undefined, kind === 'NumberFormat' ? {
        maximumFractionDigits: 2
      } : {});
    }
  } // A page that formats in many locales does not grow the cache for ever.


  if (cache.size >= 256) cache.delete(cache.keys().next().value);
  cache.set(key, made);
  return made;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "c9ce0852ac73"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   formatNumber: () => (/* binding */ formatNumber),
/* harmony export */   numberOptions: () => (/* binding */ numberOptions),
/* harmony export */   percentSign: () => (/* binding */ percentSign),
/* harmony export */   percentText: () => (/* binding */ percentText)
/* harmony export */ });
/* harmony import */ var _format_intl_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("15b4e93ff6ed");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_format_intl_js__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
_format_intl_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
// Numbers in the page's language by a format word: formatNumber and
// numberOptions alone, with no top-level side effects (format-intl.js). The
// same functions as core/js/format.js and SF.format.number; a bundle that
// formats numbers only imports them from here.

/**
 * The Intl options of a number format word (ui-chart's words, kept so a page
 * writes a format as an attribute):
 *
 *   number (default)  1 234,5   as many digits as `step` needs, at most 6; 2 without one
 *   integer           1 235
 *   decimal-<n>       n digits after the point, always (0 to 20)
 *   percent           a share 0..1 as 12 %
 *   compact           1,2 тыс.  /  1.2K
 *   currency-<CODE>   1 234,50 ₽ (an ISO 4217 code)
 *   unit-<unit>       45,3 ГБ (an Intl unit: gigabyte, megabit-per-second)
 *
 * Anything else reads as number. Words join with a space: a kind (currency-,
 * unit-, percent) and a precision (integer, decimal-<n>, compact), so
 * «currency-RUB integer» is 1 235 ₽, «currency-RUB decimal-2» 1 234,50 ₽ and
 * «currency-RUB compact» 1,1 млн ₽. The precision wins whatever the order.
 */

function numberOptions(format = 'number', step = 0) {
  const words = String(format || 'number').trim().split(/\s+/u).filter(Boolean);

  if (words.length > 1) {
    const PRECISION = /^(?:integer|compact|decimal-\d{1,2})$/u;
    const kinds = words.filter(one => !PRECISION.test(one));
    const precision = words.filter(one => PRECISION.test(one));
    return [...kinds, ...precision].reduce((options, one) => ({ ...options,
      ...numberOptions(one, step)
    }), {});
  }

  const word = words[0] ?? 'number';
  if (word === 'integer') return {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  };
  if (word === 'percent') return {
    style: 'percent',
    maximumFractionDigits: 1
  };
  if (word === 'compact') return {
    notation: 'compact',
    maximumFractionDigits: 1
  };
  const decimal = /^decimal-(\d{1,2})$/u.exec(word);

  if (decimal) {
    const digits = Math.min(20, Number(decimal[1]));
    return {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits
    };
  }

  const unit = /^unit-([a-z]+(?:-per-[a-z]+)?)$/u.exec(word);
  if (unit) return {
    style: 'unit',
    unit: unit[1],
    unitDisplay: 'short',
    maximumFractionDigits: 1
  };
  const currency = /^currency-([A-Z]{3})$/u.exec(word);
  if (currency) return {
    style: 'currency',
    currency: currency[1]
  };
  const digits = step > 0 && step < 1 ? Math.min(6, Math.ceil(-Math.log10(step) - 1e-9)) : 2;
  return {
    maximumFractionDigits: digits
  };
}
/**
 * A number in the locale by a format word (numberOptions). `grouping: false`
 * writes it without thousands marks («2026»), `step` sets the digits of
 * `number`, and a value that is not a finite number is `gap`, '' by default
 * (a chart passes '—').
 */

function formatNumber(value, format = 'number', {
  step = 0,
  gap = '',
  grouping = true,
  ...where
} = {}) {
  const number = typeof value === 'string' && value.trim() !== '' ? Number(value) : value;
  if (typeof number !== 'number' || !Number.isFinite(number)) return gap;
  const options = numberOptions(format, step);
  if (grouping === false) options.useGrouping = false;
  const text = (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.intlFormatter)('NumberFormat', (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.formatLocale)(where), options).format(number);
  return options.style === 'percent' || options.unit === 'percent' ? percentSign(text) : text;
}
/**
 * One spelling of a per cent in every language (owner decision C203 (3), DEV
 * msg-913fd9e4, 2026-11-15): the number, a no-break space (U+00A0) and «%» --
 * «72 %», «12,5 %», and «72 %» in English too, where Intl writes «72%». A
 * language that writes the sign first («%72») keeps its order.
 */

function percentSign(text) {
  return String(text).replace(/[\s\u00a0\u202f]*%$/u, '\u00a0%');
}
/**
 * A value that already is a per cent (0..100, «72», «72.5») as the progress
 * family shows and says it (owner decision C203 (3), IM-3): the number in the
 * language of the node's part of the page, as many digits as it has (up to
 * 2), a no-break space and «%» -- «72 %», «72,5 %».
 */

function percentText(value, node) {
  const number = Number(value);
  return percentSign(`${formatNumber(Number.isFinite(number) ? number : 0, 'number', {
    node,
    grouping: false
  })}%`);
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "b9c4b63fce15"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _core_js_deprecations__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("d3818183b14c");
/* harmony import */ var _component_field_size__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("e6d86f2cd058");
/* harmony import */ var _component_progress_scale_js_progress_scale__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("736e917526e6");
/* harmony import */ var _component_progress_threshold__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("a9f36a72486a");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("f65a1c6fa30a");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("14aa46a01a05");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("7b37c5fdb1e6");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("726336abdcb3");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("7f722ca0ec9d");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_deprecations__WEBPACK_IMPORTED_MODULE_2__, _component_field_size__WEBPACK_IMPORTED_MODULE_3__, _component_progress_scale_js_progress_scale__WEBPACK_IMPORTED_MODULE_4__, _js_templates_default__WEBPACK_IMPORTED_MODULE_6__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_deprecations__WEBPACK_IMPORTED_MODULE_2__, _component_field_size__WEBPACK_IMPORTED_MODULE_3__, _component_progress_scale_js_progress_scale__WEBPACK_IMPORTED_MODULE_4__, _js_templates_default__WEBPACK_IMPORTED_MODULE_6__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_deprecations__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_core_js_deprecations__WEBPACK_IMPORTED_MODULE_2__);










 // Only the words on screen ship in the bundle; the title, settings and events
// stay in the language files for the Studio and the docs (localization study LC-2).

const en = {
  runtime: _lang_en_json__WEBPACK_IMPORTED_MODULE_9__.runtime
};
const ru = {
  runtime: _lang_ru_json__WEBPACK_IMPORTED_MODULE_10__.runtime
};

function normalizeProgressValue(value) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return 0;
  }

  return Math.max(0, Math.min(100, parsed));
} // sf-progress-scale from its component.json (standard simai.smart-component
// 1.3.8 §3, §4, §4.4): its settings are attributes and properties made by
// core/js/element-manifest.js; a job's part arrives as the stream fact chunk
// {done, total} (vocabulary 1.1.5 §5.2), which a rule hands to the action
// chunk; tone and setProgress are dated aliases (aliases.json).


const ProgressScaleElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_7__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: {
    en,
    ru
  },
  source: 'ru',
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_8__,
  actions: {
    chunk({
      done,
      total
    } = {}) {
      const whole = total === undefined || total === null || total === '' ? 100 : Number(total);
      const part = Number(done);

      if (!Number.isFinite(part) || !Number.isFinite(whole) || whole <= 0) {
        return {
          outcome: 'refused',
          reason: 'invalid'
        };
      }

      this.value = Math.round(normalizeProgressValue(part / whole * 100) * 100) / 100;
      return {
        outcome: 'applied'
      };
    }

  }
});

class SfProgressScale extends ProgressScaleElement {
  static get props() {
    return { ...super.props,
      // The axis is called status, and speaks the shared vocabulary. `tone`
      // and its value `primary` keep working: see contracts/public-api-axes.json.
      // No status (empty) is the theme's primary; neutral is grey (C131 (1)).
      status: {
        default: '',
        values: ['', 'neutral', 'info', 'success', 'warning', 'error'],
        aliases: ['tone'],
        valueAliases: {
          '': ['primary']
        }
      }
    };
  } // In a row or a table cell the element takes the text line of a form size,
  // so the row keeps its control height.


  get line() {
    const line = this.getAttribute('line') || '';
    return line ? (0,_component_field_size__WEBPACK_IMPORTED_MODULE_3__.fieldSize)(line, 'sf-progress-scale line') : '';
  }

  set line(value) {
    if (value === null || value === undefined || value === '') this.removeAttribute('line');else this.setAttribute('line', String(value));
  } // The value as the scale shows it: a number clamped to 0..100 (the
  // template and the reader agree, contracts/template-context.json).


  get value() {
    return normalizeProgressValue(this.getAttribute('value') ?? 0);
  }

  set value(next) {
    if (next === null || next === undefined) this.removeAttribute('value');else this.setAttribute('value', String(next));
  }

  get status() {
    return this.getProp('status');
  } // A level of N (C185 (5)): the steps the page gave, 2..10, or none (a
  // percent scale of ten).


  get levelSteps() {
    if (!this.hasAttribute('steps')) return null;
    const parsed = Math.trunc(Number(this.getAttribute('steps')));
    return Number.isFinite(parsed) ? Math.max(2, Math.min(10, parsed)) : 10;
  } // «4 из 5» in the element's language.


  levelWords(lit, steps) {
    return this.sfWord('of-steps', {
      vars: {
        value: lit,
        total: steps
      }
    });
  } // A threshold holds only where the page set it.


  threshold(attribute) {
    return (0,_component_progress_threshold__WEBPACK_IMPORTED_MODULE_5__.readThreshold)(this.getAttribute(attribute));
  } // The status drawn (C131 (7), as sf-progress-bar): the more serious of the
  // page's status and the threshold the value reached.


  get drawnStatus() {
    return (0,_component_progress_threshold__WEBPACK_IMPORTED_MODULE_5__.effectiveStatus)(this.status, this.value, this.threshold('warning-at'), this.threshold('error-at'));
  } // The accessible name: label, else the host's aria-label (§3.1, §4.8).


  get accessibleLabel() {
    return this.label || this.getAttribute('aria-label') || '';
  }

  templateContext() {
    const props = this.getPropsContext();
    const status = this.drawnStatus;
    this.sfHostState('data-status', status);
    return this.createTemplateContext({ ...props,
      drawnStatus: status,
      meter: Boolean(this.meter),
      component: this,
      line: this.line,
      label: this.accessibleLabel,
      value: normalizeProgressValue(props.value),
      steps: this.levelSteps,
      levelWords: (lit, steps) => this.levelWords(lit, steps)
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_6__.renderProgressScaleTemplate)(this.templateContext());
  }

  get state() {
    return {
      size: this.size,
      line: this.line,
      value: normalizeProgressValue(this.value),
      showText: this.showText,
      status: this.status,
      drawnStatus: this.drawnStatus,
      meter: Boolean(this.meter),
      steps: this.levelSteps,
      label: this.label,
      valueText: this.valueText
    };
  } // §4.4: a reader retires; read value.


  getProgress() {
    (0,_core_js_deprecations__WEBPACK_IMPORTED_MODULE_2__.noteDeprecated)({
      component: 'sf-progress-scale',
      tag: 'sf-progress-scale',
      kind: 'action',
      from: 'getProgress',
      to: null,
      since: _aliases_json__WEBPACK_IMPORTED_MODULE_8__.since,
      remove_after: _aliases_json__WEBPACK_IMPORTED_MODULE_8__.remove_after
    });
    return normalizeProgressValue(this.value);
  }

  resolveUpdateMode(changedAttributes = []) {
    const directPatchAttributes = ['value', 'show-text', 'status', 'tone', 'warning-at', 'error-at', 'meter', 'label', 'value-text', 'aria-label'];

    if (changedAttributes.length > 0 && changedAttributes.every(attr => directPatchAttributes.includes(attr))) {
      return 'dom';
    }

    return 'lit';
  }

  updateDom() {
    const root = this.querySelector('.sf-progress-scale');
    if (!root) return false;
    this.sfHostState('data-status', this.drawnStatus); // A level reads in the element's own words, not the page's (C185 (5)).

    const steps = this.levelSteps;
    const lit = steps ? Math.floor(this.value / 100 * steps + 1e-9) : 0;
    return (0,_component_progress_scale_js_progress_scale__WEBPACK_IMPORTED_MODULE_4__.setProgressScaleState)(root, {
      value: this.value,
      showText: this.showText,
      tone: this.drawnStatus,
      meter: Boolean(this.meter),
      label: this.accessibleLabel,
      valueText: this.valueText || (steps ? this.levelWords(lit, steps) : ''),
      steps
    });
  }

}

SfProgressScale.define('sf-progress-scale');
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "f65a1c6fa30a"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderProgressScaleTemplate: () => (/* binding */ renderProgressScaleTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var _core_js_format_number_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("c9ce0852ac73");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, _core_js_format_number_js__WEBPACK_IMPORTED_MODULE_1__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, _core_js_format_number_js__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);



function normalizeProgressValue(value) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return 0;
  }

  return Math.max(0, Math.min(100, parsed));
} // The blocks never show more than is done (PG-12): 61 % lights 6 of 10, not 7;
// a block lights only once its tenth is reached. The epsilon keeps a value
// that is a whole tenth in decimal (70) from falling a block short in binary.


function normalizeScaleStep(value) {
  const normalized = normalizeProgressValue(value);
  return Math.floor(normalized / 10 + 1e-9) * 10;
}

function normalizeSize(value) {
  const normalized = String(value || '').toLowerCase();
  return ['1/3', '1/2', '1', '2', '3'].includes(normalized) ? normalized : '1';
} // The component normalises the legacy words, so the template sees the shared
// vocabulary (owner decision C131 (1)): no status (empty) draws the theme's
// primary and carries no class; neutral is grey, as in sf-dot and sf-badge.


function normalizeStatus(value) {
  const normalized = String(value || '').toLowerCase();
  return ['neutral', 'info', 'success', 'warning', 'error'].includes(normalized) ? normalized : '';
}

const on = value => value === true || value === '' || value === 'true'; // A level of N (owner decision C185 (5)): 2..10 steps, or none (ten, a
// percent scale). The value lights the steps it reaches, rounded down.


function normalizeSteps(value) {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Math.trunc(Number(value));
  return Number.isFinite(parsed) ? Math.max(2, Math.min(10, parsed)) : 10;
}

function renderProgressScaleTemplate(context) {
  const size = normalizeSize(context.size);
  const value = normalizeProgressValue(context.value);
  const levelSteps = normalizeSteps(context.steps);
  const steps = levelSteps ?? 10; // The class lights the first n blocks (sf-progress-scale--<n*10>).

  const step = levelSteps ? Math.floor(value / 100 * steps + 1e-9) * 10 : normalizeScaleStep(value);
  const lit = step / 10;
  const words = levelSteps ? typeof context.levelWords === 'function' ? context.levelWords(lit, steps) : `${lit} / ${steps}` : '';
  const valueText = context.valueText || words;
  const tone = normalizeStatus(context.drawnStatus ?? context.status ?? context.tone);
  const meter = on(context.meter);
  const rootClasses = ['sf-progress-scale', `sf-progress-scale--size-${size}`, tone ? `sf-progress-scale--${tone}` : '', // On a text line the track and the value share the line, and a level's
  // value stands at the row's end; otherwise the value stands under the
  // track.
  levelSteps ? 'sf-progress-scale--level' : '', ...(context.line ? [`sf-progress-scale--line-${context.line}`, 'flex', 'flex-row', 'items-cross-center'] : levelSteps ? ['flex', 'flex-row'] : ['flex', 'flex-col']), context.rootClass].filter(Boolean);

  if (step > 0) {
    rootClasses.push(`sf-progress-scale--${step}`);
  }

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div
      class=${rootClasses.join(' ')}
      style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      data-value=${String(value)}
      data-size=${size}
      data-tone=${tone || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      data-meter=${meter ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      data-steps=${levelSteps ? String(levelSteps) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      data-show-text=${String(Boolean(context.showText))}
      data-label=${context.label || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      data-value-text=${context.valueText || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      role=${meter ? 'meter' : 'progressbar'}
      aria-label=${context.label || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      aria-valuemin="0"
      aria-valuemax=${levelSteps ? String(steps) : '100'}
      aria-valuenow=${levelSteps ? String(lit) : String(value)}
      aria-valuetext=${valueText || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    >
      <div class=${steps === 10 ? 'sf-progress-scale-container grid grid-col-10 overflow-hidden' : 'sf-progress-scale-container grid overflow-hidden'}>
        ${Array.from({
    length: steps
  }, () => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-progress-scale-block"></div>`)}
      </div>
      ${context.showText ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-progress-scale-text">${levelSteps ? valueText : (0,_core_js_format_number_js__WEBPACK_IMPORTED_MODULE_1__.percentText)(value, context.component ?? null)}</div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
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

/***/ "7b37c5fdb1e6"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-progress-scale for the shim (core/js/aliases.js, standard §16 item 20). mode: same-detail (the shim sends the new and the old name), detail-adds (the new detail holds the old fields), attribute-and-property, host-attribute (no shim), manifest-only (the DOM name does not change), retired (no new name; kept and noted by the component until the date).","component":"sf-progress-scale","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"tone","to":"status","kind":"setting","component":"sf-progress-scale","since":"2026-10-27","remove_after":"2026-12-01","section":"the axis\'s old name (contracts/public-api-axes.json)"},{"from":"setProgress","to":"chunk","kind":"action","component":"sf-progress-scale","since":"2026-10-27","remove_after":"2026-12-01","section":"§4.4, vocabulary §5.2","note":"setProgress(n) calls chunk(n): n of 100"},{"from":"getProgress","to":null,"kind":"action","component":"sf-progress-scale","since":"2026-10-27","remove_after":"2026-12-01","mode":"retired","section":"§4.4","note":"a reader retires: read value; the method stays until the date and notes each call"}]}');

/***/ },

/***/ "14aa46a01a05"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.progress-scale","tag":"sf-progress-scale","version":"1.3.2","kind":"leaf","settings":{"size":{"type":"enum","values":["1/3","1/2","1","2","3"],"default":"1"},"line":{"type":"enum","values":["","1/2","1","2"],"default":""},"value":{"type":"number","default":0,"min":0,"max":100},"steps":{"type":"number","optional":true,"min":2,"max":10},"show-text":{"type":"boolean","default":true},"status":{"type":"enum","values":["","neutral","info","success","warning","error"],"default":""},"warning-at":{"type":"number","optional":true,"min":0,"max":100},"error-at":{"type":"number","optional":true,"min":0,"max":100},"meter":{"type":"boolean","default":false},"label":{"type":"string","default":""},"value-text":{"type":"string","default":""}},"values":{},"events":{},"actions":{"chunk":{"with":{"done":"number","total":"number"}}},"css-variables":{"--sf-progress-scale-fill-color":{"type":"color","state":"default"},"--sf-progress-scale-track-color":{"type":"color","state":"default"},"--sf-progress-scale-segment-gap":{"type":"length","state":"default"},"--sf-progress-scale-radius":{"type":"length","state":"default"},"--sf-progress-scale-color":{"type":"color","state":"default"},"--sf-progress-scale-gap":{"type":"length","state":"default"}},"host-states":{"data-status":"string"}}');

/***/ },

/***/ "726336abdcb3"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Progress Scale","runtime":{"of-steps":"{value} of {total}"}}');

/***/ },

/***/ "7f722ca0ec9d"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Шкала прогресса","runtime":{"of-steps":"{value} из {total}"}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("b9c4b63fce15");
/******/
/******/ })()
;