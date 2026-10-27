/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "e6d86f2cd058"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FIELD_SIZES: () => (/* binding */ FIELD_SIZES),
/* harmony export */   RETIRED_FIELD_SIZES: () => (/* binding */ RETIRED_FIELD_SIZES),
/* harmony export */   fieldSize: () => (/* binding */ fieldSize),
/* harmony export */   nearestFieldSize: () => (/* binding */ nearestFieldSize),
/* harmony export */   retireFieldSizeClass: () => (/* binding */ retireFieldSizeClass)
/* harmony export */ });
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("06e8cd089f28");
// Form fields come in three sizes. 1/3 and 3 were retired: no consumer used
// them, and they could not hold a field's own pictures, tags and targets. A
// page written for a retired size keeps rendering at the nearest kept size, and
// says so once in the console so the markup can be updated.

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

/***/ },

/***/ "736e917526e6"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bindProgressScale: () => (/* binding */ bindProgressScale),
/* harmony export */   getProgressScaleState: () => (/* binding */ getProgressScaleState),
/* harmony export */   initExistingProgressScales: () => (/* binding */ initExistingProgressScales),
/* harmony export */   normalizeProgressScaleStep: () => (/* binding */ normalizeProgressScaleStep),
/* harmony export */   normalizeProgressScaleValue: () => (/* binding */ normalizeProgressScaleValue),
/* harmony export */   setProgressScaleState: () => (/* binding */ setProgressScaleState),
/* harmony export */   unbindProgressScale: () => (/* binding */ unbindProgressScale)
/* harmony export */ });
/* harmony import */ var _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d7f974466839");
/* harmony import */ var _register_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("58661bec99a6");


const PROGRESS_SCALE_SELECTOR = '.sf-progress-scale';
const BOUND_FLAG = 'sfProgressScaleBound';
const SIZE_VALUES = ['1/3', '1/2', '1', '2', '3']; // The shared status words. `primary` was the old word for no status: it has no
// colour of its own and draws the default, as before; `info` was turned into it.

const TONE_VALUES = ['info', 'success', 'warning', 'error'];

function normalizeProgressScaleValue(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 0;
  return Math.max(0, Math.min(100, parsed));
}

function normalizeProgressScaleStep(value) {
  return Math.ceil(normalizeProgressScaleValue(value) / 10) * 10;
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

function ensureScaleStructure(root) {
  let container = root.querySelector('.sf-progress-scale-container');

  if (!container) {
    container = document.createElement('div');
    container.className = 'sf-progress-scale-container grid grid-col-10 overflow-hidden';
    root.prepend(container);
  }

  container.setAttribute('aria-hidden', 'true');
  const blocks = [...container.querySelectorAll('.sf-progress-scale-block')];

  for (let index = blocks.length; index < 10; index += 1) {
    const block = document.createElement('div');
    block.className = 'sf-progress-scale-block';
    container.append(block);
  }

  blocks.slice(10).forEach(block => block.remove());
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
  if (!root) return false;
  ensureScaleStructure(root);
  const value = normalizeProgressScaleValue(root.dataset.value);
  const step = normalizeProgressScaleStep(value);
  const size = normalizeProgressScaleSize(root.dataset.size);
  const tone = normalizeProgressScaleTone(root.dataset.tone);
  const showText = normalizeBoolean(root.dataset.showText, true); // A scale on a text line lays its track and value out in a row; any other
  // scale stands its value under the track.

  const onLine = /(^|\s)sf-progress-scale--line-/.test(root.className);
  root.classList.add('sf-progress-scale', 'flex', onLine ? 'flex-row' : 'flex-col');
  if (onLine) root.classList.remove('flex-col');
  syncScaleClasses(root, step, size, tone);
  root.dataset.value = String(value);
  root.dataset.size = size;
  root.dataset.tone = tone;
  root.dataset.showText = String(showText);
  root.setAttribute('role', 'progressbar');
  root.setAttribute('aria-valuemin', '0');
  root.setAttribute('aria-valuemax', '100');
  root.setAttribute('aria-valuenow', String(value));
  if (root.dataset.label) root.setAttribute('aria-label', root.dataset.label);
  if (root.dataset.valueText) root.setAttribute('aria-valuetext', root.dataset.valueText);else root.removeAttribute('aria-valuetext');
  const text = ensureScaleText(root);
  text.textContent = `${value}%`;
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
  }

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
    showText: normalizeBoolean(root.dataset.showText, true),
    label: root.getAttribute('aria-label') || '',
    valueText: root.getAttribute('aria-valuetext') || ''
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
      tone = 'primary',
      showText = true,
      label = '',
      valueText = ''
    } = this.params || {};
    const root = document.createElement('div');
    root.className = 'sf-progress-scale flex flex-col';
    root.dataset.size = normalizeProgressScaleSize(size);
    root.dataset.value = String(normalizeProgressScaleValue(value));
    root.dataset.tone = normalizeProgressScaleTone(status ?? tone);
    root.dataset.showText = String(normalizeBoolean(showText, true));
    if (String(label).trim()) root.dataset.label = String(label).trim();
    if (String(valueText).trim()) root.dataset.valueText = String(valueText).trim();
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

/***/ "b9c4b63fce15"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("fbe0570fcc69");
/* harmony import */ var _component_field_size__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("e6d86f2cd058");
/* harmony import */ var _component_progress_scale_js_progress_scale__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("736e917526e6");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("f65a1c6fa30a");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _js_templates_default__WEBPACK_IMPORTED_MODULE_3__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _js_templates_default__WEBPACK_IMPORTED_MODULE_3__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);





function normalizeProgressValue(value) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return 0;
  }

  return Math.max(0, Math.min(100, parsed));
}

class SfProgressScale extends (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()) {
  static get props() {
    return {
      templateName: {
        attribute: 'template',
        default: 'default'
      },
      size: {
        default: '1'
      },
      line: {
        default: ''
      },
      value: {
        default: '0'
      },
      showText: {
        type: Boolean,
        default: true
      },
      // The axis is called status, and speaks the shared vocabulary. `tone`
      // and its value `primary` keep working: see contracts/public-api-axes.json.
      status: {
        default: 'neutral',
        values: ['neutral', 'info', 'success', 'warning', 'error'],
        aliases: ['tone'],
        valueAliases: {
          neutral: ['primary']
        }
      },
      label: {
        default: ''
      },
      valueText: {
        default: ''
      }
    };
  }

  get templateName() {
    return this.getAttribute('template') || 'default';
  }

  get value() {
    return this.getAttribute('value') || '0';
  }

  set value(nextValue) {
    if (nextValue === null || nextValue === undefined) {
      this.removeAttribute('value');
      return;
    }

    this.setAttribute('value', String(nextValue));
  }

  get size() {
    return this.getAttribute('size') || '1';
  } // In a row or a table cell the element takes the text line of a form size,
  // so the row keeps its control height.


  get line() {
    const line = this.getAttribute('line') || '';
    return line ? (0,_component_field_size__WEBPACK_IMPORTED_MODULE_1__.fieldSize)(line, 'sf-progress-scale line') : '';
  }

  get showText() {
    return this.getBooleanAttr('show-text', true);
  }

  get status() {
    return this.getProp('status');
  } // The legacy name, kept so a consumer reading el.tone still gets an answer.


  get tone() {
    return this.status;
  }

  get label() {
    return this.getAttribute('label') || '';
  }

  get valueText() {
    return this.getAttribute('value-text') || '';
  }

  set showText(nextValue) {
    if (nextValue === null || nextValue === undefined || nextValue === '') {
      this.removeAttribute('show-text');
      return;
    }

    if (nextValue === true) {
      this.setAttribute('show-text', '');
      return;
    }

    this.setAttribute('show-text', String(nextValue));
  }

  templateContext() {
    const props = this.getPropsContext();
    return this.createTemplateContext({ ...props,
      component: this,
      value: normalizeProgressValue(props.value)
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_3__.renderProgressScaleTemplate)(this.templateContext());
  }

  get state() {
    return {
      size: this.size,
      line: this.line,
      value: normalizeProgressValue(this.value),
      showText: this.showText,
      status: this.status,
      tone: this.tone,
      label: this.label,
      valueText: this.valueText
    };
  }

  getProgress() {
    return normalizeProgressValue(this.value);
  }

  setProgress(nextValue) {
    this.value = nextValue;
    return this;
  }

  resolveUpdateMode(changedAttributes = []) {
    const directPatchAttributes = ['value', 'show-text', 'tone', 'label', 'value-text'];

    if (changedAttributes.length > 0 && changedAttributes.every(attr => directPatchAttributes.includes(attr))) {
      return 'dom';
    }

    return 'lit';
  }

  updateDom() {
    const root = this.querySelector('.sf-progress-scale');
    if (!root) return false;
    return (0,_component_progress_scale_js_progress_scale__WEBPACK_IMPORTED_MODULE_2__.setProgressScaleState)(root, {
      value: this.value,
      showText: this.showText,
      tone: this.tone,
      label: this.label,
      valueText: this.valueText
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
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ddf1cdb42ecc");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);


function normalizeProgressValue(value) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return 0;
  }

  return Math.max(0, Math.min(100, parsed));
}

function normalizeScaleStep(value) {
  const normalized = normalizeProgressValue(value);
  return Math.ceil(normalized / 10) * 10;
}

function normalizeSize(value) {
  const normalized = String(value || '').toLowerCase();
  return ['1/3', '1/2', '1', '2', '3'].includes(normalized) ? normalized : '1';
} // The component normalises the legacy words, so the template sees the shared
// vocabulary. `neutral` carries no class of its own, exactly as `primary` did.


function normalizeStatus(value) {
  const normalized = String(value || '').toLowerCase();
  return ['neutral', 'info', 'success', 'warning', 'error'].includes(normalized) ? normalized : 'neutral';
}

function renderProgressScaleTemplate(context) {
  const size = normalizeSize(context.size);
  const value = normalizeProgressValue(context.value);
  const step = normalizeScaleStep(value);
  const tone = normalizeStatus(context.status ?? context.tone);
  const rootClasses = ['sf-progress-scale', `sf-progress-scale--size-${size}`, `sf-progress-scale--${tone}`, // On a text line the track and the value share the line; otherwise the
  // value stands under the track.
  ...(context.line ? [`sf-progress-scale--line-${context.line}`, 'flex', 'flex-row', 'items-cross-center'] : ['flex', 'flex-col']), context.rootClass].filter(Boolean);

  if (step > 0) {
    rootClasses.push(`sf-progress-scale--${step}`);
  }

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div
      class=${rootClasses.join(' ')}
      style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      data-value=${String(value)}
      data-size=${size}
      data-tone=${tone}
      data-show-text=${String(Boolean(context.showText))}
      data-label=${context.label || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      data-value-text=${context.valueText || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      role="progressbar"
      aria-label=${context.label || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow=${String(value)}
      aria-valuetext=${context.valueText || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    >
      <div class="sf-progress-scale-container grid grid-col-10 overflow-hidden">
        ${Array.from({
    length: 10
  }, () => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-progress-scale-block"></div>`)}
      </div>
      ${context.showText ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-progress-scale-text">${value}%</div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    </div>
  `;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "ddf1cdb42ecc"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit") : new Promise((resolve) => globalThis.addEventListener("sf-runtime-ready", () => resolve(globalThis.SF.runtimeModule("lit")), { once: true })));

/***/ },

/***/ "fbe0570fcc69"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("smart-base") : new Promise((resolve) => globalThis.addEventListener("sf-runtime-ready", () => resolve(globalThis.SF.runtimeModule("smart-base")), { once: true })));

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