/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "e138a730fd7c"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createFieldContract: () => (/* binding */ createFieldContract),
/* harmony export */   syncFieldContract: () => (/* binding */ syncFieldContract)
/* harmony export */ });
let fieldSequence = 0;
const fieldIdentities = new WeakMap();

function nextIdentity(owner, prefix) {
  if (owner && fieldIdentities.has(owner)) return fieldIdentities.get(owner);
  const explicit = owner?.id ? String(owner.id).trim() : '';
  const base = explicit || `${prefix}-${++fieldSequence}`;
  const identity = {
    controlId: `${base}-control`,
    messageId: `${base}-message`
  };

  if (owner && (typeof owner === 'object' || typeof owner === 'function')) {
    fieldIdentities.set(owner, identity);
  }

  return identity;
}

function mergeIdRefs(existing, additions) {
  return [...new Set([...String(existing || '').split(/\s+/).filter(Boolean), ...additions.filter(Boolean)])].join(' ');
}

function createFieldContract(owner, {
  prefix = 'sf-field',
  required = false,
  invalid = false,
  hint = '',
  errorMessage = ''
} = {}) {
  const identity = nextIdentity(owner, prefix);
  const normalizedInvalid = Boolean(invalid);
  const message = normalizedInvalid && errorMessage ? errorMessage : hint;
  return { ...identity,
    required: Boolean(required),
    invalid: normalizedInvalid,
    message,
    describedBy: message ? identity.messageId : '',
    errorMessageId: normalizedInvalid && errorMessage ? identity.messageId : ''
  };
}
function syncFieldContract(root, control, {
  prefix = 'sf-field',
  required = false,
  invalid = false,
  messageNode = null,
  labelNode = null,
  errorMessage = ''
} = {}) {
  if (!root || !control) return null;
  const hint = messageNode?.textContent?.trim() || '';
  const contract = createFieldContract(root, {
    prefix,
    required,
    invalid,
    hint,
    errorMessage
  });
  if (!control.id) control.id = contract.controlId;

  if (root.tagName === 'LABEL' && !root.hasAttribute('for')) {
    root.setAttribute('for', control.id);
  } // Name the field by its visible label, not every hint or adjacent button.
  // Author-provided accessible names remain authoritative.


  if (labelNode?.textContent?.trim() && !control.hasAttribute('aria-label') && !control.hasAttribute('aria-labelledby')) {
    if (!labelNode.id) labelNode.id = `${control.id}-label`;
    control.setAttribute('aria-labelledby', labelNode.id);
  }

  control.required = contract.required;
  root.classList.toggle('error', contract.invalid);
  control.classList.toggle('error', contract.invalid);
  if (contract.invalid) control.setAttribute('aria-invalid', 'true');else control.removeAttribute('aria-invalid');

  if (messageNode) {
    if (!messageNode.id) messageNode.id = contract.messageId;
    control.setAttribute('aria-describedby', mergeIdRefs(control.getAttribute('aria-describedby'), [messageNode.id]));
  }

  if (contract.errorMessageId && messageNode) {
    control.setAttribute('aria-errormessage', messageNode.id);
  } else {
    control.removeAttribute('aria-errormessage');
  }

  return contract;
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
const subscriptions = new WeakMap();
const listeningDocuments = new WeakSet();
function bindFormReset(input, synchronize) {
  const doc = input.ownerDocument;

  if (!listeningDocuments.has(doc)) {
    doc.addEventListener('reset', event => {
      const form = event.target;
      if (form?.tagName !== 'FORM') return;
      const controls = Array.from(form.elements);
      setTimeout(() => {
        if (event.defaultPrevented) return;

        for (const control of controls) {
          if (!control.isConnected || control.form !== form) continue;

          for (const callback of subscriptions.get(control) || []) callback();
        }
      }, 0);
    }, true);
    listeningDocuments.add(doc);
  }

  let callbacks = subscriptions.get(input);
  if (!callbacks) subscriptions.set(input, callbacks = new Set());
  callbacks.add(synchronize);
  return () => callbacks.delete(synchronize);
}

/***/ },

/***/ "a1ebeb48a6ab"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d7f974466839");
/* harmony import */ var _register_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("58661bec99a6");
/* harmony import */ var _json_quantity_utility_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("bc8e5eea8946");
/* harmony import */ var _field_contract__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("e138a730fd7c");
/* harmony import */ var _form_reset_helper__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("67eed2647f47");





const QUANTITY_SELECTOR = '.sf-quantity';
const BOUND_FLAG = 'sfQuantityBound';
const formattedChanges = new WeakSet();
const numberSymbols = new Map();

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
  const step = String(stepValue ?? '').trim().toLowerCase();
  if (!Number.isFinite(Number(step)) || Number(step) <= 0) return 0;
  const [coefficient, exponent = '0'] = step.split('e');
  const fraction = coefficient.split('.')[1]?.length || 0;
  return Math.max(0, fraction - Number(exponent));
}

function getQuantityOptions(root, input) {
  const precisionRaw = input.dataset.precision ?? root.dataset.precision ?? String(inferPrecisionFromStep(input.step)); // Number.toFixed is the fallback on engines with a narrower Intl range.

  const precision = Math.min(100, Math.max(0, parseInt(precisionRaw, 10) || 0));
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

function normalizeLocalizedInput(rawValue, options) {
  const symbols = resolveLocaleNumberDelimiters(options?.locale);
  let value = String(rawValue ?? '').replace(/[\u061c\u200e\u200f]/g, '');

  for (const [digit, ascii] of symbols.digits) value = value.split(digit).join(ascii);

  value = value.split(symbols.minus).join('-').replace(/\s+/g, '');
  const group = symbols.group.replace(/\s+/g, '');

  if (group && group !== symbols.decimal && value.includes(group)) {
    const parts = value.split(symbols.decimal);
    const integer = parts[0].replace(/^-/, '');
    const groups = integer.split(group); // Recognize only complete locale grouping. A lone alternative decimal such
    // as 1,5 in en-US or 1.5 in de-DE retains the existing decimal-input support.

    const validGrouping = parts.length <= 2 && groups.length > 1 && groups.every(part => /^\d+$/.test(part)) && groups[0].length <= symbols.secondary && groups.at(-1).length === symbols.primary && groups.slice(1, -1).every(part => part.length === symbols.secondary);
    if (validGrouping) value = value.split(group).join('');
  }

  return value.split(symbols.decimal).join('.');
}

function normalizeUserTypedValue(rawValue, behaviorOptions, options) {
  const {
    allowNegative,
    allowDecimal
  } = behaviorOptions;
  let value = normalizeLocalizedInput(rawValue, options).replace(/,/g, '.'); // remove everything except digits, dot, minus

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

function isPotentiallyEditableNumeric(value, behaviorOptions, options) {
  value = normalizeLocalizedInput(value, options).replace(/,/g, '.');
  const {
    allowNegative,
    allowDecimal
  } = behaviorOptions;
  const pattern = allowDecimal ? allowNegative ? /^-?\d*([.,]\d*)?$/ : /^\d*([.,]\d*)?$/ : allowNegative ? /^-?\d*$/ : /^\d*$/;
  return pattern.test(value);
}

function normalizeRaw(value, precision) {
  const scale = 10 ** precision;
  const scaled = value * scale;
  return Number.isFinite(scaled) ? Math.round(scaled) / scale : value;
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
  if (!String(input.value).trim()) return fallback;
  const rawFromDataset = toNumber(input.dataset.rawValue, Number.NaN);
  if (Number.isFinite(rawFromDataset)) return rawFromDataset;
  return toNumber(input.value, fallback);
}

function isMaskEnabled(root, input) {
  return toBoolean(input.dataset.mask ?? root.dataset.mask, false);
}

function resolveLocaleNumberDelimiters(locale) {
  if (numberSymbols.has(locale)) return numberSymbols.get(locale);
  let formatter;

  try {
    formatter = new Intl.NumberFormat(locale);
  } catch {
    formatter = new Intl.NumberFormat('en-US');
  }

  const parts = formatter.formatToParts(-123456789.6);
  const integers = parts.filter(p => p.type === 'integer').map(p => p.value);
  const symbols = {
    group: parts.find(p => p.type === 'group')?.value || ' ',
    decimal: parts.find(p => p.type === 'decimal')?.value || '.',
    minus: parts.find(p => p.type === 'minusSign')?.value || '-',
    primary: Array.from(integers.at(-1) || '').length || 3,
    secondary: Array.from(integers.at(-2) || '').length || 3,
    digits: Array.from({
      length: 10
    }, (_, digit) => [formatter.format(digit), String(digit)])
  };
  if (numberSymbols.size >= 32) numberSymbols.delete(numberSymbols.keys().next().value);
  numberSymbols.set(locale, symbols);
  return symbols;
}

function getCurrentRawValue(root, input, fallback = Number.NaN) {
  if (!String(input.value).trim()) return fallback;
  const mask = root.__sfQuantityMask;

  if (mask && typeof mask.typedValue === 'number' && Number.isFinite(mask.typedValue)) {
    return mask.typedValue;
  }

  return parseCurrentValue(input, fallback);
}

async function bindMask(root, input) {
  if (!isMaskEnabled(root, input)) return;
  if (!window.SF?.Mask?.create) return;
  const service = window.SF.Mask;
  const request = {};
  root.__sfQuantityMaskRequest = request;
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
    const instance = await service.create(input, maskOptions);
    if (!instance) return;

    if (root.dataset[BOUND_FLAG] !== '1' || root.__sfQuantityMaskRequest !== request || root.querySelector('.sf-quantity-wrap input') !== input) {
      service.destroy(instance);
      return;
    }

    root.__sfQuantityMask = instance;

    if (!input.value.trim()) {
      instance.value = '';
      delete input.dataset.rawValue;
      syncDisabledState(root);
      return;
    }

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
  const min = input.min === '' ? Number.NaN : toNumber(input.min, Number.NaN);
  const max = input.max === '' ? Number.NaN : toNumber(input.max, Number.NaN);
  const raw = normalizeRaw(clamp(parsed, min, max), options.precision);
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
  const isDisabled = Boolean(input.disabled || input.readOnly);
  const value = getCurrentRawValue(root, input, Number.NaN);
  const min = input.min === '' ? Number.NaN : toNumber(input.min, Number.NaN);
  const max = input.max === '' ? Number.NaN : toNumber(input.max, Number.NaN);

  if (minusButton instanceof HTMLButtonElement) {
    minusButton.disabled = isDisabled || Number.isFinite(value) && Number.isFinite(min) && value <= min;
  }

  if (plusButton instanceof HTMLButtonElement) {
    plusButton.disabled = isDisabled || Number.isFinite(value) && Number.isFinite(max) && value >= max;
  }
}

function adjustValue(root, deltaSign) {
  const input = root.querySelector('.sf-quantity-wrap input');
  if (!input || input.disabled || input.readOnly) return;
  const options = getQuantityOptions(root, input);
  const configuredStep = toNumber(input.step, 1);
  const step = configuredStep > 0 ? configuredStep : 1;
  const min = input.min === '' ? Number.NaN : toNumber(input.min, Number.NaN);
  const max = input.max === '' ? Number.NaN : toNumber(input.max, Number.NaN);
  const current = getCurrentRawValue(root, input, Number.isFinite(min) ? min : 0);
  const next = normalizeRaw(clamp(current + step * deltaSign, min, max), options.precision);

  if (next === current) {
    syncDisabledState(root);
    return;
  }

  input.dataset.rawValue = String(next);

  if (root.__sfQuantityMask) {
    root.__sfQuantityMask.typedValue = next;
  } else {
    input.value = formatValue(next, options);
  }

  syncDisabledState(root); // This display string was just formatted from `next`; do not parse it again
  // as unformatted user input when our own change listener runs.

  const change = new Event('change', {
    bubbles: true
  });
  formattedChanges.add(change);

  try {
    input.dispatchEvent(change);
  } finally {
    formattedChanges.delete(change);
  }
}

function bindQuantity(root) {
  if (!root || root.dataset[BOUND_FLAG] === '1') return;
  const input = root.querySelector('.sf-quantity-wrap input');
  if (!input) return;
  (0,_field_contract__WEBPACK_IMPORTED_MODULE_3__.syncFieldContract)(root, input, {
    prefix: 'sf-quantity',
    labelNode: root.querySelector('.sf-quantity-text'),
    required: input.required || Boolean(root.querySelector('.sf-quantity-required')),
    invalid: root.classList.contains('error') || input.classList.contains('error')
  });
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
    if (formattedChanges.has(event)) return;

    if (!input.value.trim()) {
      delete input.dataset.rawValue;
      syncDisabledState(root);
      return;
    }

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
    const normalizedInputValue = normalizeUserTypedValue(input.value, behaviorOptions, options);
    const shouldMutateInputValue = event?.type !== 'change'; // Keep the locale decimal in editable text. Otherwise a normalized 1.234
    // could be mistaken for grouped 1234 by a subsequent German change event.

    const editableValue = normalizedInputValue.replace('.', resolveLocaleNumberDelimiters(options.locale).decimal);

    if (shouldMutateInputValue && editableValue !== input.value) {
      input.value = editableValue;
    }

    if (normalizedInputValue === '' || normalizedInputValue === '-' || normalizedInputValue === '.' || normalizedInputValue === '-.') {
      delete input.dataset.rawValue;
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
    if (input.disabled || input.readOnly) return;
    const options = getQuantityOptions(root, input);
    const behaviorOptions = getInputBehaviorOptions(root, input, options);
    if (behaviorOptions.inputMode !== 'strict') return;

    if (event.inputType === 'insertText' && typeof event.data === 'string') {
      const start = input.selectionStart ?? input.value.length;
      const end = input.selectionEnd ?? input.value.length;
      const nextValue = input.value.slice(0, start) + event.data + input.value.slice(end);

      if (!isPotentiallyEditableNumeric(nextValue, behaviorOptions, options)) {
        event.preventDefault();
      }
    }
  };

  const pasteHandler = event => {
    if (input.disabled || input.readOnly) return;
    const options = getQuantityOptions(root, input);
    const behaviorOptions = getInputBehaviorOptions(root, input, options);
    if (behaviorOptions.inputMode !== 'strict') return;
    const text = event.clipboardData?.getData('text') ?? '';
    const normalized = text.trim();

    if (!normalized || !isPotentiallyEditableNumeric(normalized, behaviorOptions, options)) {
      event.preventDefault();
      return;
    }

    event.preventDefault();
    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? input.value.length;
    const nextValue = input.value.slice(0, start) + normalized + input.value.slice(end);
    if (!isPotentiallyEditableNumeric(nextValue, behaviorOptions, options)) return;
    input.value = nextValue;
    input.dispatchEvent(new Event('input', {
      bubbles: true
    }));
  };

  const pointerFocusHandler = () => {
    root.classList.add('sf-quantity--pointer-focus');
  };

  const keyboardFocusHandler = () => {
    root.classList.remove('sf-quantity--pointer-focus');
  };

  const focusOutHandler = event => {
    if (event.relatedTarget) {
      if (!root.contains(event.relatedTarget)) {
        root.classList.remove('sf-quantity--pointer-focus');
      }

      return;
    }

    window.setTimeout(() => {
      if (!root.contains(document.activeElement)) {
        root.classList.remove('sf-quantity--pointer-focus');
      }
    }, 0);
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
  root.addEventListener('pointerdown', pointerFocusHandler, true);
  root.addEventListener('keydown', keyboardFocusHandler, true);
  root.addEventListener('focusout', focusOutHandler);
  root.__sfQuantityMinusHandler = minusHandler;
  root.__sfQuantityPlusHandler = plusHandler;
  root.__sfQuantitySyncHandler = syncHandler;
  root.__sfQuantityBlurHandler = blurHandler;
  root.__sfQuantityBeforeInputHandler = beforeInputHandler;
  root.__sfQuantityPasteHandler = pasteHandler;
  root.__sfQuantityPointerFocusHandler = pointerFocusHandler;
  root.__sfQuantityKeyboardFocusHandler = keyboardFocusHandler;
  root.__sfQuantityFocusOutHandler = focusOutHandler;
  root.__sfQuantityReleaseReset = (0,_form_reset_helper__WEBPACK_IMPORTED_MODULE_4__.bindFormReset)(input, () => {
    // Native reset has already restored defaultValue. The previous numeric or
    // masked cache must never override that restored value.
    delete input.dataset.rawValue;
    if (root.__sfQuantityMask) root.__sfQuantityMask.value = input.value;
    syncFormattedValue(root);
    syncDisabledState(root);
  });
  root.__sfQuantityControlObserver = new MutationObserver(() => syncDisabledState(root));

  root.__sfQuantityControlObserver.observe(input, {
    attributes: true,
    attributeFilter: ['disabled', 'readonly']
  });

  root.dataset[BOUND_FLAG] = '1';
  syncFormattedValue(root);
  syncDisabledState(root);
  bindMask(root, input);
}

function unbindQuantity(root) {
  if (!root || root.dataset[BOUND_FLAG] !== '1') return;
  delete root.__sfQuantityMaskRequest;
  root.__sfQuantityReleaseReset?.();
  delete root.__sfQuantityReleaseReset;
  root.__sfQuantityControlObserver?.disconnect();
  delete root.__sfQuantityControlObserver;
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

  if (root.__sfQuantityPointerFocusHandler) {
    root.removeEventListener('pointerdown', root.__sfQuantityPointerFocusHandler, true);
  }

  if (root.__sfQuantityKeyboardFocusHandler) {
    root.removeEventListener('keydown', root.__sfQuantityKeyboardFocusHandler, true);
  }

  if (root.__sfQuantityFocusOutHandler) {
    root.removeEventListener('focusout', root.__sfQuantityFocusOutHandler);
  }

  delete root.__sfQuantityMinusHandler;
  delete root.__sfQuantityPlusHandler;
  delete root.__sfQuantitySyncHandler;
  delete root.__sfQuantityBlurHandler;
  delete root.__sfQuantityBeforeInputHandler;
  delete root.__sfQuantityPasteHandler;
  delete root.__sfQuantityPointerFocusHandler;
  delete root.__sfQuantityKeyboardFocusHandler;
  delete root.__sfQuantityFocusOutHandler;
  root.classList.remove('sf-quantity--pointer-focus');

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
      readonly = false,
      placeholder = '',
      decrementLabel = 'Decrease value',
      incrementLabel = 'Increase value',
      decrementIcon = 'remove',
      incrementIcon = 'add'
    } = this.params || {};
    const allowedSizes = new Set(['1/3', '1/2', '1', '2', '3']);
    const normalizedSize = allowedSizes.has(String(size)) ? String(size) : '1';
    const className = this.attrs.class || this.attrs.className;
    this.template = document.createElement('label');

    if (this.id) {
      this.template.id = this.id;
    }

    this.template.classList.add('sf-quantity', `sf-quantity--size-${normalizedSize}`);

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
    minus.setAttribute('aria-label', String(decrementLabel));
    minus.innerHTML = `<i class="sf-icon">${decrementIcon}</i>`;
    const input = document.createElement('input');
    input.type = 'text';
    const inferredPrecision = precision ?? inferPrecisionFromStep(step);
    input.inputMode = allowDecimal ?? Number(inferredPrecision) > 0 ? 'decimal' : 'numeric';
    const attrValue = this.attrs.value;
    const initialValue = value ?? attrValue ?? '';
    input.value = String(initialValue);
    input.defaultValue = String(initialValue);
    if (name) input.name = name;
    if (min !== undefined && min !== null && min !== '') input.min = String(min);
    if (max !== undefined && max !== null && max !== '') input.max = String(max);
    if (step !== undefined && step !== null && step !== '') input.step = String(step);
    input.disabled = Boolean(disabled);
    input.readOnly = Boolean(readonly);
    input.placeholder = String(placeholder);

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
    plus.setAttribute('aria-label', String(incrementLabel));
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

module.exports = /*#__PURE__*/JSON.parse('{".sf-quantity":["display/flex (.flex)","flex-direction/column (.flex-col)","flex-wrap/nowrap (.flex-nowrap)","gap/var(--sf-space-1\\\\/4)","justify-content/flex-start (.justify-start)"],".sf-quantity .sf-quantity-label":["display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","gap/var(--sf-space-1\\\\/4)","justify-content/flex-start (.justify-start)","align-items/flex-start (.items-start)"],".sf-quantity .sf-quantity-wrap":["display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","gap/var(--sf-space-2)","justify-content/center (.justify-center)","align-items/center (.items-center)"],".sf-quantity .sf-quantity-count":["display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","justify-content/flex-start (.justify-start)","align-items/center (.items-center)"],".sf-quantity .sf-quantity-wrap input":["display/flex (.flex)"]}');

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