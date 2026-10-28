/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "3b4e9ff2f1d2"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bindProgressBar: () => (/* binding */ bindProgressBar),
/* harmony export */   getProgressBarState: () => (/* binding */ getProgressBarState),
/* harmony export */   initExistingProgressBars: () => (/* binding */ initExistingProgressBars),
/* harmony export */   setProgressBarState: () => (/* binding */ setProgressBarState),
/* harmony export */   unbindProgressBar: () => (/* binding */ unbindProgressBar)
/* harmony export */ });
/* harmony import */ var _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d7f974466839");
/* harmony import */ var _register_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("58661bec99a6");


const PROGRESS_BAR_SELECTOR = '.sf-progress-bar';
const PROGRESS_BAR_BOUND_FLAG = 'sfProgressBarBound';

function normalizeSize(value) {
  const normalized = String(value || '').toLowerCase();
  const supported = ['1/3', '1/2', '1', '2', '3'];
  return supported.includes(normalized) ? normalized : '1';
}

function normalizeValue(value) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return 0;
  }

  return Math.max(0, Math.min(100, parsed));
}

function normalizeTextPosition(value, fallback = 'none') {
  const normalized = String(value || fallback).toLowerCase();
  return ['none', 'right', 'inline-end', 'bottom'].includes(normalized) ? normalized : fallback;
} // The shared status words. `primary` was the old word for no status: it has no
// colour of its own and draws the default, as before; `info` was turned into it.


const TONES = ['info', 'success', 'warning', 'error'];

function normalizeTone(value) {
  const normalized = String(value || '').toLowerCase();
  return TONES.includes(normalized) ? normalized : '';
}

function getProgressNode(root) {
  return root?.querySelector?.('.sf-progress-bar-progress') || null;
}

function getTextNode(root) {
  return root?.querySelector?.('.sf-progress-bar-text') || null;
}

function getMainNode(root) {
  return root?.querySelector?.('.sf-progress-bar-main') || null;
}

function detectTextPosition(root) {
  if (!getTextNode(root)) {
    return 'none';
  }

  if (root.classList.contains('flex-col')) {
    return 'bottom';
  }

  return 'right';
}

function ensureTextNode(root) {
  let textNode = getTextNode(root);
  if (textNode) return textNode;
  textNode = document.createElement('div');
  textNode.className = 'sf-progress-bar-text';
  root.append(textNode);
  return textNode;
}

function syncRootLayout(root, textPosition = 'none') {
  root.classList.add('sf-progress-bar', 'flex');
  root.classList.remove('flex-col', 'flex-row', 'items-cross-end', 'items-cross-center');

  if (textPosition === 'bottom') {
    root.classList.add('flex-col', 'items-cross-end');
    return;
  }

  if (textPosition === 'right' || textPosition === 'inline-end') {
    root.classList.add('flex-row', 'items-cross-center');
  }
}

function syncProgressAccessibility(root, value) {
  root.setAttribute('role', 'progressbar');
  root.setAttribute('aria-valuemin', '0');
  root.setAttribute('aria-valuemax', '100');
  root.setAttribute('aria-valuenow', String(value));
  const label = root.dataset.label;

  if (label) {
    root.setAttribute('aria-label', label);
  }

  const valueText = root.dataset.valueText;

  if (valueText) {
    root.setAttribute('aria-valuetext', valueText);
  } else {
    root.removeAttribute('aria-valuetext');
  }
}

function syncTone(root, tone) {
  ['primary', ...TONES].forEach(name => {
    root.classList.toggle(`sf-progress-bar--${name}`, name === tone);
  });
  if (tone) root.dataset.tone = tone;else delete root.dataset.tone;
}

function renderProgressBar(root) {
  if (!root) return false;
  const progress = getProgressNode(root);
  const main = getMainNode(root);
  if (!progress || !main) return false;
  const value = normalizeValue(root.dataset.value ?? root.getAttribute('data-value') ?? 0);
  const textPosition = normalizeTextPosition(root.dataset.position ?? root.dataset.textPosition ?? root.getAttribute('data-text-position'), detectTextPosition(root));
  const tone = normalizeTone(root.dataset.tone);
  syncRootLayout(root, textPosition);
  syncTone(root, tone);
  syncProgressAccessibility(root, value);
  progress.style.width = `${value}%`;
  root.dataset.value = String(value);
  root.dataset.position = textPosition;

  if (textPosition === 'none') {
    const textNode = getTextNode(root);

    if (textNode) {
      textNode.remove();
    }

    return true;
  }

  const textNode = ensureTextNode(root);
  textNode.textContent = `${value}%`;

  if (textPosition === 'bottom' && textNode.parentElement !== root) {
    root.append(textNode);
  }

  return true;
}

function bindProgressBar(root) {
  if (!root || root.dataset[PROGRESS_BAR_BOUND_FLAG] === '1') return;
  renderProgressBar(root);
  root.dataset[PROGRESS_BAR_BOUND_FLAG] = '1';
}

function unbindProgressBar(root) {
  if (!root || root.dataset[PROGRESS_BAR_BOUND_FLAG] !== '1') return;
  delete root.dataset[PROGRESS_BAR_BOUND_FLAG];
}

function initExistingProgressBars(target = document) {
  target.querySelectorAll(PROGRESS_BAR_SELECTOR).forEach(bindProgressBar);
}

function setProgressBarState(target, state = {}) {
  const root = target instanceof HTMLElement ? target.closest(PROGRESS_BAR_SELECTOR) || target : null;
  if (!root) return false;

  if (Object.prototype.hasOwnProperty.call(state, 'value')) {
    root.dataset.value = String(normalizeValue(state.value));
  }

  if (Object.prototype.hasOwnProperty.call(state, 'textPosition')) {
    root.dataset.position = normalizeTextPosition(state.textPosition);
  } // A progress indicator's colour role is its status (journal record
  // attribute-tone-to-status); tone is still read until that record leaves.


  if (Object.prototype.hasOwnProperty.call(state, 'status') || Object.prototype.hasOwnProperty.call(state, 'tone')) {
    root.dataset.tone = normalizeTone(state.status ?? state.tone);
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

  if (Object.prototype.hasOwnProperty.call(state, 'size')) {
    const currentSizeClass = Array.from(root.classList).find(cls => cls.startsWith('sf-progress-bar--size-'));

    if (currentSizeClass) {
      root.classList.remove(currentSizeClass);
    }

    root.classList.add(`sf-progress-bar--size-${normalizeSize(state.size)}`);
  }

  return renderProgressBar(root);
}

function getProgressBarState(target) {
  const root = target instanceof HTMLElement ? target.closest(PROGRESS_BAR_SELECTOR) || target : null;
  if (!root) return null;
  return {
    value: normalizeValue(root.dataset.value ?? 0),
    textPosition: normalizeTextPosition(root.dataset.position ?? root.dataset.textPosition, detectTextPosition(root)),
    status: normalizeTone(root.dataset.tone),
    tone: normalizeTone(root.dataset.tone),
    label: root.getAttribute('aria-label') || '',
    valueText: root.getAttribute('aria-valuetext') || ''
  };
}

class ProgressBar extends _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__.ComponentObserver {
  static componentName = 'ProgressBar';
  html = null;

  constructor(props) {
    super(props);
    const {
      size = '1',
      value = 0,
      textPosition = 'none',
      status,
      tone = 'primary',
      label = '',
      valueText = ''
    } = this.params || {};
    const className = this.attrs.class || this.attrs.className;
    const root = document.createElement('div');

    if (this.id) {
      root.id = this.id;
    }

    root.classList.add('sf-progress-bar', `sf-progress-bar--size-${normalizeSize(size)}`, 'flex');

    if (className) {
      root.classList.add(...String(className).split(' ').filter(Boolean));
    }

    root.dataset.value = String(normalizeValue(value));
    root.dataset.position = normalizeTextPosition(textPosition);
    root.dataset.tone = normalizeTone(status ?? tone);
    if (String(label).trim()) root.dataset.label = String(label).trim();
    if (String(valueText).trim()) root.dataset.valueText = String(valueText).trim();
    const main = document.createElement('div');
    main.className = 'sf-progress-bar-main';
    const progress = document.createElement('div');
    progress.className = 'sf-progress-bar-progress transition';
    main.append(progress);
    root.append(main);
    this.template = root;
  }

  init() {
    bindProgressBar(this.template);
  }

  destroyInternal() {
    unbindProgressBar(this.template);
  }

}

(0,_register_helper__WEBPACK_IMPORTED_MODULE_1__["default"])('ProgressBar', ProgressBar);

if (typeof window !== 'undefined') {
  window.SF = window.SF || {};
  window.SF.ProgressBar = window.SF.ProgressBar || {};
  window.SF.ProgressBar.getState = getProgressBarState;
  window.SF.ProgressBar.setState = setProgressBarState;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initExistingProgressBars(), {
    once: true
  });
} else {
  initExistingProgressBars();
}

const progressBarObserver = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (!(node instanceof Element)) return;

      if (node.matches?.(PROGRESS_BAR_SELECTOR)) {
        bindProgressBar(node);
      }

      initExistingProgressBars(node);
    });
  });
});
progressBarObserver.observe(document.documentElement, {
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

/***/ "7bd8e00a777a"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   showChunk: () => (/* binding */ showChunk)
/* harmony export */ });
/* harmony import */ var _component_progress_bar_js_progressbar__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("3b4e9ff2f1d2");
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _core_js_deprecations__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("d3818183b14c");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("9c29247e4834");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("e023bc52f90d");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("361e38151042");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("8c9a03a2745a");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("2cbf36776b51");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_1__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2__, _core_js_deprecations__WEBPACK_IMPORTED_MODULE_3__, _js_templates_default__WEBPACK_IMPORTED_MODULE_4__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_1__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2__, _core_js_deprecations__WEBPACK_IMPORTED_MODULE_3__, _js_templates_default__WEBPACK_IMPORTED_MODULE_4__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _core_js_deprecations__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_core_js_deprecations__WEBPACK_IMPORTED_MODULE_3__);








 // sf-progress-bar from its component.json (standard simai.smart-component
// 1.3.8 §3, §4, §4.4): its settings are attributes and properties made by
// core/js/element-manifest.js; a job's part arrives as the stream fact chunk
// {done, total} (vocabulary 1.1.5 §5.2), which a rule hands to the action
// chunk; tone and setProgress are dated aliases (aliases.json).

const ProgressBarElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_5__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_1___default()),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_7__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_8__
  },
  source: 'ru',
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_6__,
  actions: {
    chunk({
      done,
      total
    } = {}) {
      return showChunk(this, done, total);
    }

  }
}); // A part of a job as a percentage of the bar: done of total (100 when the
// rule gives none), clamped to 0..100 (vocabulary §5.2).

function showChunk(element, done, total) {
  const whole = total === undefined || total === null || total === '' ? 100 : Number(total);
  const part = Number(done);

  if (!Number.isFinite(part) || !Number.isFinite(whole) || whole <= 0) {
    return {
      outcome: 'refused',
      reason: 'invalid'
    };
  }

  const percent = Math.max(0, Math.min(100, part / whole * 100));
  element.value = Math.round(percent * 100) / 100;
  return {
    outcome: 'applied'
  };
} // What retires without a new name (aliases.json rows with `to: null`): kept
// until the date, and each call is noted with it.

function noteRetired(from) {
  (0,_core_js_deprecations__WEBPACK_IMPORTED_MODULE_3__.noteDeprecated)({
    component: 'sf-progress-bar',
    tag: 'sf-progress-bar',
    kind: 'action',
    from,
    to: null,
    since: _aliases_json__WEBPACK_IMPORTED_MODULE_6__.since,
    remove_after: _aliases_json__WEBPACK_IMPORTED_MODULE_6__.remove_after
  });
}

class SfProgressBar extends ProgressBarElement {
  static get props() {
    return { ...super.props,
      // The axis is called status, and speaks the shared vocabulary. `tone`
      // and its value `primary` keep working: see contracts/public-api-axes.json.
      status: {
        default: 'neutral',
        values: ['neutral', 'info', 'success', 'warning', 'error'],
        aliases: ['tone'],
        valueAliases: {
          neutral: ['primary']
        }
      }
    };
  }

  constructor() {
    super();
    this._boundRoot = null;
  }

  get status() {
    return this.getProp('status');
  } // The accessible name: label, else the host's aria-label (§3.1, §4.8).


  get accessibleLabel() {
    return this.label || this.getAttribute('aria-label') || '';
  }

  templateContext() {
    const props = this.getPropsContext();
    return this.createTemplateContext({ ...props,
      label: this.accessibleLabel,
      component: this
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_4__.renderProgressBarTemplate)(this.templateContext());
  }

  get state() {
    return {
      size: this.size,
      value: this.value,
      textPosition: this.textPosition,
      status: this.status,
      label: this.label,
      valueText: this.valueText
    };
  } // §4.4: a reader retires; read value.


  getProgress() {
    noteRetired('getProgress');
    return Number(this.value || 0);
  } // §4.4: text-position is a writable setting.


  setTextPosition(nextValue) {
    noteRetired('setTextPosition');
    this.textPosition = nextValue === null || nextValue === undefined || nextValue === '' ? null : nextValue;
    return this;
  }

  resolveUpdateMode(changedAttributes = []) {
    const directPatchAttributes = ['value', 'text-position', 'status', 'tone', 'label', 'value-text', 'aria-label'];

    if (changedAttributes.length > 0 && changedAttributes.every(attr => directPatchAttributes.includes(attr))) {
      return 'dom';
    }

    return 'lit';
  }

  updateDom() {
    const root = this.querySelector('.sf-progress-bar');
    if (!root) return false;
    return (0,_component_progress_bar_js_progressbar__WEBPACK_IMPORTED_MODULE_0__.setProgressBarState)(root, {
      value: this.value,
      textPosition: this.textPosition,
      tone: this.status,
      label: this.accessibleLabel,
      valueText: this.valueText
    });
  }

  afterRender() {
    if (this._boundRoot) {
      (0,_component_progress_bar_js_progressbar__WEBPACK_IMPORTED_MODULE_0__.unbindProgressBar)(this._boundRoot);
      this._boundRoot = null;
    }

    this._boundRoot = this.querySelector('.sf-progress-bar');

    if (this._boundRoot) {
      (0,_component_progress_bar_js_progressbar__WEBPACK_IMPORTED_MODULE_0__.bindProgressBar)(this._boundRoot);
    }
  }

  onDisconnected() {
    if (this._boundRoot) {
      (0,_component_progress_bar_js_progressbar__WEBPACK_IMPORTED_MODULE_0__.unbindProgressBar)(this._boundRoot);
      this._boundRoot = null;
    }
  }

}

SfProgressBar.define('sf-progress-bar');
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "9c29247e4834"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderProgressBarTemplate: () => (/* binding */ renderProgressBarTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);


function normalizeValue(value) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return 0;
  }

  return Math.max(0, Math.min(100, parsed));
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

function renderProgressBarTemplate(context) {
  const {
    value,
    textPosition
  } = context;
  const size = normalizeSize(context.size);
  const tone = normalizeStatus(context.status ?? context.tone);
  const normalizedValue = normalizeValue(value);
  const normalizedPosition = ['none', 'right', 'inline-end', 'bottom'].includes(textPosition) ? textPosition : 'none';
  const rootClasses = ['sf-progress-bar', `sf-progress-bar--size-${size}`, `sf-progress-bar--${tone}`, 'flex', context.rootClass].filter(Boolean);

  if (normalizedPosition === 'right' || normalizedPosition === 'inline-end') {
    rootClasses.push('flex-row', 'items-cross-center');
  } else if (normalizedPosition === 'bottom') {
    rootClasses.push('flex-col', 'items-cross-end');
  }

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div
      class=${rootClasses.join(' ')}
      style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      data-value=${String(normalizedValue)}
      data-position=${normalizedPosition}
      data-tone=${tone}
      data-label=${context.label || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      data-value-text=${context.valueText || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      role="progressbar"
      aria-label=${context.label || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow=${String(normalizedValue)}
      aria-valuetext=${context.valueText || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    >
      <div class="sf-progress-bar-main">
        <div class="sf-progress-bar-progress transition"></div>
      </div>
      ${normalizedPosition !== 'none' ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-progress-bar-text">${normalizedValue}%</div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
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

/***/ "deb1a4d61565"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("smart-base", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("smart-base", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "361e38151042"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-progress-bar for the shim (core/js/aliases.js, standard §16 item 20). mode: same-detail (the shim sends the new and the old name), detail-adds (the new detail holds the old fields), attribute-and-property, host-attribute (no shim), manifest-only (the DOM name does not change), retired (no new name; kept and noted by the component until the date).","component":"sf-progress-bar","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"tone","to":"status","kind":"setting","component":"sf-progress-bar","since":"2026-10-27","remove_after":"2026-12-01","section":"the axis\'s old name (contracts/public-api-axes.json)"},{"from":"setProgress","to":"chunk","kind":"action","component":"sf-progress-bar","since":"2026-10-27","remove_after":"2026-12-01","section":"§4.4, vocabulary §5.2","note":"setProgress(n) calls chunk(n): n of 100"},{"from":"getProgress","to":null,"kind":"action","component":"sf-progress-bar","since":"2026-10-27","remove_after":"2026-12-01","mode":"retired","section":"§4.4","note":"a reader retires: read value; the method stays until the date and notes each call"},{"from":"setTextPosition","to":null,"kind":"action","component":"sf-progress-bar","since":"2026-10-27","remove_after":"2026-12-01","mode":"retired","section":"§4.4","note":"text-position is a writable setting; the method stays until the date and notes each call"}]}');

/***/ },

/***/ "e023bc52f90d"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.progress-bar","tag":"sf-progress-bar","version":"1.1.2","kind":"leaf","settings":{"size":{"type":"enum","values":["1/3","1/2","1","2","3"],"default":"1"},"value":{"type":"number","default":0,"min":0,"max":100},"text-position":{"type":"enum","values":["none","inline-end","bottom","right"],"default":"none"},"status":{"type":"enum","values":["neutral","info","success","warning","error"],"default":"neutral"},"label":{"type":"string","default":""},"value-text":{"type":"string","default":""}},"values":{},"events":{},"actions":{"chunk":{"with":{"done":"number","total":"number"}}},"css-variables":{"--sf-progress-bar-fill-color":{"type":"color","state":"default"},"--sf-progress-bar-track-color":{"type":"color","state":"default"},"--sf-progress-bar-height":{"type":"length","state":"default"},"--sf-progress-bar-radius":{"type":"length","state":"default"},"--sf-progress-bar-color":{"type":"color","state":"default"},"--sf-progress-bar-gap":{"type":"length","state":"default"}}}');

/***/ },

/***/ "8c9a03a2745a"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Progress Bar"}');

/***/ },

/***/ "2cbf36776b51"
(module) {

module.exports = {"title":"Прогресс"};

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
/******/ 	let __webpack_exports__ = __webpack_require__("7bd8e00a777a");
/******/
/******/ })()
;