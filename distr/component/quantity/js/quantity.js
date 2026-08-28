/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "a1ebeb48a6ab"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d7f974466839");
/* harmony import */ var _register_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("58661bec99a6");
/* harmony import */ var _json_quantity_utility_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("bc8e5eea8946");



const QUANTITY_SELECTOR = '.sf-quantity';
const BOUND_FLAG = 'sfQuantityBound';

function toNumber(value, fallback = 0) {
  const normalized = String(value ?? '').trim().replace(/\s+/g, '').replace(',', '.');

  if (normalized === '') {
    return fallback;
  }

  const n = Number(normalized);
  return Number.isFinite(n) ? n : fallback;
}

function clamp(value, min, max) {
  if (Number.isFinite(min)) value = Math.max(value, min);
  if (Number.isFinite(max)) value = Math.min(value, max);
  return value;
}

function toBoolean(value, fallback = true) {
  if (value === undefined || value === null || value === '') return fallback;
  if (typeof value === 'boolean') return value;
  const normalized = String(value).toLowerCase();
  if (['0', 'false', 'no', 'off'].includes(normalized)) return false;
  if (['1', 'true', 'yes', 'on'].includes(normalized)) return true;
  return fallback;
}

function inferPrecisionFromStep(stepValue) {
  const step = String(stepValue ?? '');
  if (!step || step === 'any') return 0;
  const dot = step.indexOf('.');
  if (dot < 0) return 0;
  return Math.max(0, step.length - dot - 1);
}

function getQuantityOptions(root, input) {
  const precisionRaw = input.dataset.precision ?? root.dataset.precision ?? String(inferPrecisionFromStep(input.step));
  const precision = Math.max(0, parseInt(precisionRaw, 10) || 0);
  const grouping = toBoolean(input.dataset.grouping ?? root.dataset.grouping, true);
  const locale = input.dataset.locale ?? root.dataset.locale ?? (typeof navigator !== 'undefined' ? navigator.language : 'ru-RU') ?? 'ru-RU';
  return {
    precision,
    grouping,
    locale
  };
}

function getInputBehaviorOptions(root, input, quantityOptions) {
  const inputMode = (input.dataset.inputMode ?? root.dataset.inputMode ?? 'soft').toString().toLowerCase() === 'strict' ? 'strict' : 'soft';
  const allowNegative = toBoolean(input.dataset.allowNegative ?? root.dataset.allowNegative, false);
  const allowDecimal = toBoolean(input.dataset.allowDecimal ?? root.dataset.allowDecimal, quantityOptions.precision > 0);
  return {
    inputMode,
    allowNegative,
    allowDecimal
  };
}

function normalizeUserTypedValue(rawValue, behaviorOptions) {
  const {
    allowNegative,
    allowDecimal
  } = behaviorOptions;
  let value = String(rawValue ?? '').replace(/\s+/g, '').replace(/,/g, '.'); // remove everything except digits, dot, minus

  value = value.replace(/[^0-9.\-]/g, ''); // minus only at start, only once

  const hasMinus = allowNegative && value.includes('-');
  value = value.replace(/-/g, '');

  if (hasMinus) {
    value = `-${value}`;
  } // dot only once if decimals allowed


  if (allowDecimal) {
    const firstDot = value.indexOf('.');

    if (firstDot >= 0) {
      value = value.slice(0, firstDot + 1) + value.slice(firstDot + 1).replace(/\./g, '');
    }
  } else {
    value = value.replace(/\./g, '');
  }

  return value;
}

function isPotentiallyEditableNumeric(value, behaviorOptions) {
  const {
    allowNegative,
    allowDecimal
  } = behaviorOptions;
  const pattern = allowDecimal ? allowNegative ? /^-?\d*([.,]\d*)?$/ : /^\d*([.,]\d*)?$/ : allowNegative ? /^-?\d*$/ : /^\d*$/;
  return pattern.test(value);
}

function normalizeRaw(value, precision) {
  const scale = 10 ** precision;
  return Math.round(value * scale) / scale;
}

function formatValue(value, options) {
  const {
    precision,
    grouping,
    locale
  } = options;

  try {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: precision,
      maximumFractionDigits: precision,
      useGrouping: grouping
    }).format(value);
  } catch {
    return value.toFixed(precision);
  }
}

function parseCurrentValue(input, fallback = Number.NaN) {
  const rawFromDataset = toNumber(input.dataset.rawValue, Number.NaN);
  if (Number.isFinite(rawFromDataset)) return rawFromDataset;
  return toNumber(input.value, fallback);
}

function isMaskEnabled(root, input) {
  return toBoolean(input.dataset.mask ?? root.dataset.mask, false);
}

function resolveLocaleNumberDelimiters(locale) {
  try {
    const parts = new Intl.NumberFormat(locale).formatToParts(12345.6);
    const group = parts.find(p => p.type === 'group')?.value || ' ';
    const decimal = parts.find(p => p.type === 'decimal')?.value || '.';
    return {
      group,
      decimal
    };
  } catch {
    return {
      group: ' ',
      decimal: '.'
    };
  }
}

function getCurrentRawValue(root, input, fallback = Number.NaN) {
  const mask = root.__sfQuantityMask;

  if (mask && typeof mask.typedValue === 'number' && Number.isFinite(mask.typedValue)) {
    return mask.typedValue;
  }

  return parseCurrentValue(input, fallback);
}

async function bindMask(root, input) {
  if (!isMaskEnabled(root, input)) return;
  if (!window.SF?.Mask?.create) return;
  const quantityOptions = getQuantityOptions(root, input);
  const behaviorOptions = getInputBehaviorOptions(root, input, quantityOptions);
  const min = input.min === '' ? Number.NaN : toNumber(input.min, Number.NaN);
  const max = input.max === '' ? Number.NaN : toNumber(input.max, Number.NaN);
  const {
    group,
    decimal
  } = resolveLocaleNumberDelimiters(quantityOptions.locale);
  const mapToRadix = ['.', ','].filter(item => item !== decimal);
  const maskOptions = {
    mask: Number,
    scale: quantityOptions.precision,
    signed: behaviorOptions.allowNegative,
    normalizeZeros: true,
    padFractionalZeros: quantityOptions.precision > 0,
    thousandsSeparator: group,
    radix: decimal,
    mapToRadix
  };
  if (Number.isFinite(min)) maskOptions.min = min;
  if (Number.isFinite(max)) maskOptions.max = max;

  try {
    const instance = await window.SF.Mask.create(input, maskOptions);
    if (!instance) return;

    if (root.dataset[BOUND_FLAG] !== '1') {
      window.SF.Mask.destroy(instance);
      return;
    }

    root.__sfQuantityMask = instance;
    const initial = getCurrentRawValue(root, input, Number.isFinite(min) ? min : 0);

    if (Number.isFinite(initial)) {
      const normalizedInitial = normalizeRaw(initial, quantityOptions.precision);
      instance.typedValue = normalizedInitial;
      input.dataset.rawValue = String(normalizedInitial);
    }

    syncDisabledState(root);
  } catch (error) {
    console.warn('SF.Quantity mask init failed', error);
  }
}

function syncFormattedValue(root) {
  const input = root.querySelector('.sf-quantity-wrap input');
  if (!input) return;
  const options = getQuantityOptions(root, input);
  const parsed = getCurrentRawValue(root, input, Number.NaN);
  if (!Number.isFinite(parsed)) return;
  const raw = normalizeRaw(parsed, options.precision);
  input.dataset.rawValue = String(raw);

  if (root.__sfQuantityMask) {
    root.__sfQuantityMask.typedValue = raw;
    return;
  }

  input.value = formatValue(raw, options);
}

function getButtons(root) {
  const controls = Array.from(root.querySelectorAll('.sf-quantity-count'));
  return {
    minusButton: controls[0] || null,
    plusButton: controls[1] || null
  };
}

function syncDisabledState(root) {
  const input = root.querySelector('.sf-quantity-wrap input');
  if (!input) return;
  const {
    minusButton,
    plusButton
  } = getButtons(root);
  const isDisabled = Boolean(input.disabled);
  [minusButton, plusButton].forEach(btn => {
    if (!btn || !(btn instanceof HTMLButtonElement)) return;
    btn.disabled = isDisabled;
  });
}

function adjustValue(root, deltaSign) {
  const input = root.querySelector('.sf-quantity-wrap input');
  if (!input || input.disabled) return;
  const options = getQuantityOptions(root, input);
  const step = toNumber(input.step, 1) || 1;
  const min = input.min === '' ? Number.NaN : toNumber(input.min, Number.NaN);
  const max = input.max === '' ? Number.NaN : toNumber(input.max, Number.NaN);
  const current = getCurrentRawValue(root, input, Number.isFinite(min) ? min : 0);
  const next = normalizeRaw(clamp(current + step * deltaSign, min, max), options.precision);
  input.dataset.rawValue = String(next);

  if (root.__sfQuantityMask) {
    root.__sfQuantityMask.typedValue = next;
  } else {
    input.value = formatValue(next, options);
  }

  syncDisabledState(root);
  input.dispatchEvent(new Event('change', {
    bubbles: true
  }));
}

function bindQuantity(root) {
  if (!root || root.dataset[BOUND_FLAG] === '1') return;
  const input = root.querySelector('.sf-quantity-wrap input');
  if (!input) return;
  const {
    minusButton,
    plusButton
  } = getButtons(root);

  const minusHandler = event => {
    event.preventDefault();
    adjustValue(root, -1);
  };

  const plusHandler = event => {
    event.preventDefault();
    adjustValue(root, 1);
  };

  const syncHandler = event => {
    const options = getQuantityOptions(root, input);

    if (root.__sfQuantityMask) {
      const min = input.min === '' ? Number.NaN : toNumber(input.min, Number.NaN);
      const fallback = Number.isFinite(min) ? min : 0;
      const rawFromMask = typeof root.__sfQuantityMask.typedValue === 'number' ? root.__sfQuantityMask.typedValue : Number.NaN;
      const raw = normalizeRaw(Number.isFinite(rawFromMask) ? rawFromMask : toNumber(input.value, getCurrentRawValue(root, input, fallback)), options.precision);
      input.dataset.rawValue = String(raw);
      syncDisabledState(root);
      return;
    }

    const behaviorOptions = getInputBehaviorOptions(root, input, options);
    const normalizedInputValue = normalizeUserTypedValue(input.value, behaviorOptions);
    const shouldMutateInputValue = event?.type !== 'change';

    if (shouldMutateInputValue && normalizedInputValue !== input.value) {
      input.value = normalizedInputValue;
    }

    if (normalizedInputValue === '' || normalizedInputValue === '-' || normalizedInputValue === '.' || normalizedInputValue === '-.') {
      syncDisabledState(root);
      return;
    }

    const min = input.min === '' ? Number.NaN : toNumber(input.min, Number.NaN);
    const fallback = Number.isFinite(min) ? min : 0;
    const raw = normalizeRaw(toNumber(normalizedInputValue, parseCurrentValue(input, fallback)), options.precision);
    input.dataset.rawValue = String(raw);
    syncDisabledState(root);
  };

  const blurHandler = () => {
    syncFormattedValue(root);
    syncDisabledState(root);
  };

  const beforeInputHandler = event => {
    const options = getQuantityOptions(root, input);
    const behaviorOptions = getInputBehaviorOptions(root, input, options);
    if (behaviorOptions.inputMode !== 'strict') return;

    if (event.inputType === 'insertText' && typeof event.data === 'string') {
      const start = input.selectionStart ?? input.value.length;
      const end = input.selectionEnd ?? input.value.length;
      const nextValue = input.value.slice(0, start) + event.data + input.value.slice(end);

      if (!isPotentiallyEditableNumeric(nextValue, behaviorOptions)) {
        event.preventDefault();
      }
    }
  };

  const pasteHandler = event => {
    const options = getQuantityOptions(root, input);
    const behaviorOptions = getInputBehaviorOptions(root, input, options);
    if (behaviorOptions.inputMode !== 'strict') return;
    const text = event.clipboardData?.getData('text') ?? '';
    const normalized = normalizeUserTypedValue(text, behaviorOptions);

    if (!normalized || !isPotentiallyEditableNumeric(normalized, behaviorOptions)) {
      event.preventDefault();
      return;
    }

    event.preventDefault();
    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? input.value.length;
    input.value = input.value.slice(0, start) + normalized + input.value.slice(end);
    input.dispatchEvent(new Event('input', {
      bubbles: true
    }));
  };

  if (minusButton) {
    minusButton.addEventListener('click', minusHandler);
  }

  if (plusButton) {
    plusButton.addEventListener('click', plusHandler);
  }

  input.addEventListener('input', syncHandler);
  input.addEventListener('change', syncHandler);
  input.addEventListener('blur', blurHandler);
  input.addEventListener('beforeinput', beforeInputHandler);
  input.addEventListener('paste', pasteHandler);
  root.__sfQuantityMinusHandler = minusHandler;
  root.__sfQuantityPlusHandler = plusHandler;
  root.__sfQuantitySyncHandler = syncHandler;
  root.__sfQuantityBlurHandler = blurHandler;
  root.__sfQuantityBeforeInputHandler = beforeInputHandler;
  root.__sfQuantityPasteHandler = pasteHandler;
  root.dataset[BOUND_FLAG] = '1';
  syncFormattedValue(root);
  syncDisabledState(root);
  bindMask(root, input);
}

function unbindQuantity(root) {
  if (!root || root.dataset[BOUND_FLAG] !== '1') return;
  const input = root.querySelector('.sf-quantity-wrap input');
  const {
    minusButton,
    plusButton
  } = getButtons(root);

  if (minusButton && root.__sfQuantityMinusHandler) {
    minusButton.removeEventListener('click', root.__sfQuantityMinusHandler);
  }

  if (plusButton && root.__sfQuantityPlusHandler) {
    plusButton.removeEventListener('click', root.__sfQuantityPlusHandler);
  }

  if (input && root.__sfQuantitySyncHandler) {
    input.removeEventListener('input', root.__sfQuantitySyncHandler);
    input.removeEventListener('change', root.__sfQuantitySyncHandler);
  }

  if (input && root.__sfQuantityBlurHandler) {
    input.removeEventListener('blur', root.__sfQuantityBlurHandler);
  }

  if (input && root.__sfQuantityBeforeInputHandler) {
    input.removeEventListener('beforeinput', root.__sfQuantityBeforeInputHandler);
  }

  if (input && root.__sfQuantityPasteHandler) {
    input.removeEventListener('paste', root.__sfQuantityPasteHandler);
  }

  delete root.__sfQuantityMinusHandler;
  delete root.__sfQuantityPlusHandler;
  delete root.__sfQuantitySyncHandler;
  delete root.__sfQuantityBlurHandler;
  delete root.__sfQuantityBeforeInputHandler;
  delete root.__sfQuantityPasteHandler;

  if (root.__sfQuantityMask) {
    window.SF?.Mask?.destroy?.(root.__sfQuantityMask);
    delete root.__sfQuantityMask;
  }

  delete root.dataset[BOUND_FLAG];
}

function initExistingQuantities(target = document) {
  target.querySelectorAll(QUANTITY_SELECTOR).forEach(bindQuantity);
}

class Quantity extends _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__.ComponentObserver {
  static componentName = 'Quantity';
  html = null;

  constructor(props) {
    super(props);
    const {
      size = '1',
      label = 'Label',
      required = true,
      value,
      min,
      max,
      step = '1',
      precision,
      grouping = true,
      locale,
      inputMode = 'soft',
      allowNegative = false,
      allowDecimal,
      mask = false,
      name,
      disabled = false,
      decrementIcon = 'remove',
      incrementIcon = 'add'
    } = this.params || {};
    const className = this.attrs.class || this.attrs.className;
    this.template = document.createElement('label');

    if (this.id) {
      this.template.id = this.id;
    }

    this.template.classList.add('sf-quantity', `sf-quantity--size-${size}`);

    if (className) {
      this.template.classList.add(...`${className}`.split(' ').filter(Boolean));
    }

    const labelWrap = document.createElement('span');
    labelWrap.classList.add('sf-quantity-label');
    const labelText = document.createElement('span');
    labelText.classList.add('sf-quantity-text');
    labelText.textContent = label;
    labelWrap.append(labelText);

    if (required) {
      const requiredMark = document.createElement('span');
      requiredMark.classList.add('sf-quantity-required');
      requiredMark.textContent = '*';
      labelWrap.append(requiredMark);
    }

    const wrap = document.createElement('span');
    wrap.classList.add('sf-quantity-wrap');
    const minus = document.createElement('button');
    minus.type = 'button';
    minus.classList.add('sf-quantity-count', 'sf-icon-button', 'sf-icon-button--secondary', 'sf-icon-button--tonal', 'sf-icon-button--size-1/3');
    minus.setAttribute('aria-label', 'Decrease value');
    minus.innerHTML = `<i class="sf-icon">${decrementIcon}</i>`;
    const input = document.createElement('input');
    input.type = 'text';
    input.inputMode = 'numeric';
    const attrValue = this.attrs.value;
    const initialValue = value ?? attrValue ?? '';
    input.value = String(initialValue);
    if (name) input.name = name;
    if (min !== undefined && min !== null && min !== '') input.min = String(min);
    if (max !== undefined && max !== null && max !== '') input.max = String(max);
    if (step !== undefined && step !== null && step !== '') input.step = String(step);
    input.disabled = Boolean(disabled);

    if (precision !== undefined && precision !== null && precision !== '') {
      input.dataset.precision = String(precision);
    }

    input.dataset.grouping = String(Boolean(grouping));

    if (locale) {
      input.dataset.locale = String(locale);
    }

    input.dataset.inputMode = String(inputMode);
    input.dataset.allowNegative = String(Boolean(allowNegative));
    input.dataset.mask = String(Boolean(mask));

    if (allowDecimal !== undefined && allowDecimal !== null && allowDecimal !== '') {
      input.dataset.allowDecimal = String(Boolean(allowDecimal));
    }

    const plus = document.createElement('button');
    plus.type = 'button';
    plus.classList.add('sf-quantity-count', 'sf-icon-button', 'sf-icon-button--secondary', 'sf-icon-button--tonal', 'sf-icon-button--size-1/3');
    plus.setAttribute('aria-label', 'Increase value');
    plus.innerHTML = `<i class="sf-icon">${incrementIcon}</i>`;
    wrap.append(minus, input, plus);
    this.template.append(labelWrap, wrap);
    this.applyLayoutUtilities(this.template, '.sf-quantity');
    this.applyLayoutUtilities(labelWrap, '.sf-quantity .sf-quantity-label');
    this.applyLayoutUtilities(wrap, '.sf-quantity .sf-quantity-wrap');
    this.applyLayoutUtilities(minus, '.sf-quantity .sf-quantity-count');
    this.applyLayoutUtilities(plus, '.sf-quantity .sf-quantity-count');
    this.applyLayoutUtilities(input, '.sf-quantity .sf-quantity-wrap input');
  }

  init() {
    bindQuantity(this.template);
  }

  destroyInternal() {
    unbindQuantity(this.template);
  }

}

Quantity.utilityMap = _json_quantity_utility_json__WEBPACK_IMPORTED_MODULE_2__;
(0,_register_helper__WEBPACK_IMPORTED_MODULE_1__["default"])('Quantity', Quantity);

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initExistingQuantities());
} else {
  initExistingQuantities();
}

const quantityObserver = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (!(node instanceof Element)) return;

      if (node.matches?.(QUANTITY_SELECTOR)) {
        bindQuantity(node);
      }

      initExistingQuantities(node);
    });
  });
});
quantityObserver.observe(document.documentElement, {
  childList: true,
  subtree: true
});

/***/ },

/***/ "8650988db10b"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _quantity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("a1ebeb48a6ab");
/*
* Main JS file for including JS for component.
*
* Imports:
* - Base function component (_component_name.js)
*/


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
  constructor(props) {
    this.props = props;
    this.id = props?.id;
    this.params = props?.param;
    this.attrs = props?.attrs || {};
    this.template = null;
    window.dispatchEvent(new CustomEvent(`${this.componentName}:beforeRender`, {
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
          classes.add(cls.replace(/^\./, ''));
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
      window.dispatchEvent(new CustomEvent(`${this.componentName}:render`, {
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

    window.dispatchEvent(new CustomEvent(`${this.componentName}:destroy`, {
      detail: this
    }));
  }

  destroyInternal() {}

}

/***/ },

/***/ "5d57d470aefc"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "bc8e5eea8946"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{".sf-quantity":["display/flex (.flex)","flex-direction/column (.flex-col)","flex-wrap/nowrap (.flex-nowrap)","gap/var(--sf-space-1\\\\/4)","justify-content/flex-start (.justify-start)","align-items/flex-start (.items-start)"],".sf-quantity .sf-quantity-label":["flex/1 (.flex-1)","display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","gap/var(--sf-space-1\\\\/4)","justify-content/flex-start (.justify-start)","align-items/flex-start (.items-start)"],".sf-quantity .sf-quantity-wrap":["flex/1 (.flex-1)","display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","gap/var(--sf-space-2)","justify-content/center (.justify-center)","align-items/center (.items-center)"],".sf-quantity .sf-quantity-count":["display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","justify-content/flex-start (.justify-start)","align-items/center (.items-center)"],".sf-quantity .sf-quantity-wrap input":["display/flex (.flex)"]}');

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
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("5d57d470aefc");
/* harmony import */ var _js_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("8650988db10b");
/**
* SIMAI Framework
* Copyright 2008-2026 SIMAI Ltd
* http://simai.studio
* Read the license: http://framework.simai.studio/license/
* Documentation: http://framework.simai.studio/
* Support: http://simai.studio/support/
*
* INPUTS
*
* Entry point for importing components from this directory.
* Simplifies the import process in other parts of the project.
* Instead of importing individual files, all component can be imported through this file.
*/


})();

/******/ })()
;