/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "e138a730fd7c"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createFieldContract: () => (/* binding */ createFieldContract),
/* harmony export */   syncFieldContract: () => (/* binding */ syncFieldContract)
/* harmony export */ });
/* harmony import */ var _core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("e92fd2d1a38c");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var _core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_0__);
 // A field's ids come from its instance's role path (standard 1.3.8 §7.1.1;
// simai/ui-source#41), never from a counter: core/js/instance-path.js.

const fieldIdentities = new WeakMap();

function nextIdentity(owner, prefix) {
  if (owner && fieldIdentities.has(owner)) return fieldIdentities.get(owner);
  const base = (0,_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_0__.partId)((0,_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_0__.instancePath)(owner, {
    kind: prefix
  }));
  const identity = {
    base,
    controlId: `${base}--control`,
    messageId: `${base}--message`
  }; // An instance not yet in the page has no place in it: its path is settled
  // when it is, so it is not kept before.

  if (owner && (typeof owner === 'object' || typeof owner === 'function') && (0,_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_0__.pathIsSettled)(owner)) {
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
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "e6d86f2cd058"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FIELD_SIZES: () => (/* binding */ FIELD_SIZES),
/* harmony export */   RETIRED_FIELD_SIZES: () => (/* binding */ RETIRED_FIELD_SIZES),
/* harmony export */   fieldSize: () => (/* binding */ fieldSize),
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
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

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

/***/ "73aef1a2bf74"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bindInput: () => (/* binding */ bindInput),
/* harmony export */   setInputState: () => (/* binding */ setInputState),
/* harmony export */   unbindInput: () => (/* binding */ unbindInput)
/* harmony export */ });
/* harmony import */ var _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d7f974466839");
/* harmony import */ var _register_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("58661bec99a6");
/* harmony import */ var _json_input_utility_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("d6935866be49");
/* harmony import */ var _field_contract__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("e138a730fd7c");
/* harmony import */ var _field_size__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("e6d86f2cd058");
/* harmony import */ var _form_reset_helper__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("67eed2647f47");
/* harmony import */ var _mask_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("0ab12d47912a");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_field_contract__WEBPACK_IMPORTED_MODULE_3__, _field_size__WEBPACK_IMPORTED_MODULE_4__]);
([_field_contract__WEBPACK_IMPORTED_MODULE_3__, _field_size__WEBPACK_IMPORTED_MODULE_4__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);







const INPUT_SELECTOR = 'label.sf-input';
const INPUT_BOUND_FLAG = 'sfInputBound';
const INPUT_TYPES = new Set(['text', 'email', 'password', 'search', 'tel', 'url']);
const INPUT_MODES = new Set(['', 'none', 'text', 'tel', 'url', 'email', 'numeric', 'decimal', 'search']);
const INPUT_VARIANTS = new Set(['bordered', 'filled', 'hidden']);

function boundedValue(value, allowed, fallback) {
  const normalized = String(value || fallback);
  return allowed.has(normalized) ? normalized : fallback;
}

function normalizeInputType(value) {
  const normalized = String(value || 'text').toLowerCase();
  return INPUT_TYPES.has(normalized) ? normalized : 'text';
}

function normalizeInputMode(value) {
  const normalized = String(value || '').toLowerCase();
  return INPUT_MODES.has(normalized) ? normalized : '';
}

function normalizeLength(value) {
  if (value === '' || value === null || typeof value === 'undefined') return null;
  const normalized = Number(value);
  return Number.isInteger(normalized) && normalized >= 0 ? normalized : null;
}

function toBoolean(value, fallback = false) {
  if (value === undefined || value === null || value === '') return fallback;
  if (typeof value === 'boolean') return value;
  return ['1', 'true', 'yes', 'on'].includes(String(value).toLowerCase());
}

function getInputNode(root) {
  return root?.querySelector?.('.sf-input-field input, input') || null;
}

function getMessageNode(root) {
  return root?.querySelector?.('.sf-input-hint-text-wrap') || null;
}

function ensureMessageNode(root) {
  const existing = getMessageNode(root);
  if (existing) return existing;
  const messageNode = document.createElement('span');
  messageNode.classList.add('sf-input-hint-text-wrap');
  root.append(messageNode);
  return messageNode;
}

function messageState(root) {
  const messageNode = getMessageNode(root);
  return {
    messageNode,
    errorMessage: messageNode?.dataset.fieldMessage === 'error' ? messageNode.textContent?.trim() || '' : ''
  };
}

function parseMaskOptions(raw) {
  if (!raw || typeof raw !== 'string') return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;

  try {
    const parsed = JSON.parse(trimmed);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
}

function resolveMaskConfig(root, input) {
  const enabled = toBoolean(input.dataset.mask ?? root.dataset.mask, false);
  if (!enabled) return null;
  const fromInput = parseMaskOptions(input.dataset.maskOptions);
  const fromRoot = parseMaskOptions(root.dataset.maskOptions);
  if (fromInput) return applyMaskOptionAttributes(fromInput, root, input);
  if (fromRoot) return applyMaskOptionAttributes(fromRoot, root, input);
  const pattern = input.dataset.maskPattern ?? root.dataset.maskPattern;

  if (pattern) {
    return applyMaskOptionAttributes({
      mask: String(pattern)
    }, root, input);
  }

  return null;
}

function applyMaskOptionAttributes(config, root, input) {
  const nextConfig = { ...config
  };
  const lazy = input.dataset.maskLazy ?? root.dataset.maskLazy;
  const placeholderChar = input.dataset.maskPlaceholderChar ?? root.dataset.maskPlaceholderChar;

  if (typeof lazy !== 'undefined' && lazy !== '') {
    nextConfig.lazy = toBoolean(lazy, true);
  }

  if (typeof placeholderChar !== 'undefined' && placeholderChar !== '') {
    nextConfig.placeholderChar = String(placeholderChar);
  }

  return nextConfig;
}

async function bindMask(root, input) {
  const config = resolveMaskConfig(root, input);
  if (!config) return;
  const request = {};
  root.__sfInputMaskRequest = request;

  try {
    const service = await (0,_mask_service__WEBPACK_IMPORTED_MODULE_6__.maskService)();
    if (root.__sfInputMaskRequest !== request) return;
    const instance = await service.create(input, config);
    if (!instance) return;

    if (root.dataset[INPUT_BOUND_FLAG] !== '1' || root.__sfInputMaskRequest !== request || getInputNode(root) !== input) {
      service.destroy(instance);
      return;
    }

    root.__sfInputMask = instance;
  } catch (error) {
    console.warn('SF.Input mask init failed', error);
  }
}

function bindInput(root) {
  (0,_field_size__WEBPACK_IMPORTED_MODULE_4__.retireFieldSizeClass)(root, 'sf-input');
  if (!root || root.dataset[INPUT_BOUND_FLAG] === '1') return;
  const input = getInputNode(root);
  if (!input) return; // Placeholder for shared behaviors (masking/validation hooks).

  const noopHandler = () => {};

  const pointerFocusHandler = () => root.classList.add('sf-input--pointer-focus');

  const blurHandler = () => root.classList.remove('sf-input--pointer-focus');

  input.addEventListener('input', noopHandler);
  input.addEventListener('pointerdown', pointerFocusHandler);
  input.addEventListener('blur', blurHandler);
  root.__sfInputNoopHandler = noopHandler;
  root.__sfInputPointerFocusHandler = pointerFocusHandler;
  root.__sfInputBlurHandler = blurHandler;
  root.dataset[INPUT_BOUND_FLAG] = '1';
  const message = messageState(root);
  (0,_field_contract__WEBPACK_IMPORTED_MODULE_3__.syncFieldContract)(root, input, {
    prefix: 'sf-input',
    labelNode: root.querySelector('.sf-input-text'),
    required: input.required || Boolean(root.querySelector('.sf-input-required')),
    invalid: root.classList.contains('error') || input.classList.contains('error'),
    ...message
  });
  root.__sfInputReleaseReset = (0,_form_reset_helper__WEBPACK_IMPORTED_MODULE_5__.bindFormReset)(input, () => {
    if (root.__sfInputMask) root.__sfInputMask.value = input.value;
  });
  bindMask(root, input);
}

function unbindInput(root) {
  if (!root || root.dataset[INPUT_BOUND_FLAG] !== '1') return;
  delete root.__sfInputMaskRequest;
  const input = getInputNode(root);

  if (input && root.__sfInputNoopHandler) {
    input.removeEventListener('input', root.__sfInputNoopHandler);
  }

  if (input && root.__sfInputPointerFocusHandler) {
    input.removeEventListener('pointerdown', root.__sfInputPointerFocusHandler);
  }

  if (input && root.__sfInputBlurHandler) {
    input.removeEventListener('blur', root.__sfInputBlurHandler);
  }

  if (root.__sfInputMask) {
    window.SF?.Mask?.destroy?.(root.__sfInputMask);
  }

  root.__sfInputReleaseReset?.();
  delete root.__sfInputReleaseReset;
  delete root.__sfInputMask;
  delete root.__sfInputNoopHandler;
  delete root.__sfInputPointerFocusHandler;
  delete root.__sfInputBlurHandler;
  root.classList.remove('sf-input--pointer-focus');
  delete root.dataset[INPUT_BOUND_FLAG];
}

function initExistingInputs(target = document) {
  target.querySelectorAll(INPUT_SELECTOR).forEach(bindInput);
}

function setInputState(target, state = {}) {
  const root = target instanceof HTMLElement ? target.closest(INPUT_SELECTOR) || target : null;
  if (!root) return false;
  const input = getInputNode(root);
  if (!input) return false;

  if (Object.prototype.hasOwnProperty.call(state, 'disabled')) {
    input.disabled = toBoolean(state.disabled);
  }

  if (Object.prototype.hasOwnProperty.call(state, 'error')) {
    const invalid = toBoolean(state.error);
    root.classList.toggle('error', invalid);
    input.classList.toggle('error', invalid);
  }

  if (Object.prototype.hasOwnProperty.call(state, 'invalid')) {
    const invalid = toBoolean(state.invalid);
    root.classList.toggle('error', invalid);
    input.classList.toggle('error', invalid);
  }

  if (Object.prototype.hasOwnProperty.call(state, 'errorMessage')) {
    const value = String(state.errorMessage ?? '');
    const messageNode = value ? ensureMessageNode(root) : getMessageNode(root);

    if (messageNode) {
      messageNode.textContent = value; // The text is an error only on a field left invalid. Restoring a hint
      // with {invalid: false, errorMessage: hint} marked it an error, and a
      // later error with no text of its own pointed aria-errormessage at it.

      const invalid = root.classList.contains('error') || input.classList.contains('error');
      messageNode.dataset.fieldMessage = value && invalid ? 'error' : 'hint';
    }
  }

  if (Object.prototype.hasOwnProperty.call(state, 'value')) {
    input.value = String(state.value ?? '');
    input.dispatchEvent(new Event('input', {
      bubbles: true
    }));
  }

  (0,_field_contract__WEBPACK_IMPORTED_MODULE_3__.syncFieldContract)(root, input, {
    prefix: 'sf-input',
    labelNode: root.querySelector('.sf-input-text'),
    required: input.required || Boolean(root.querySelector('.sf-input-required')),
    invalid: root.classList.contains('error') || input.classList.contains('error'),
    ...messageState(root)
  });
  return true;
}

class Inputs extends _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__.ComponentObserver {
  static componentName = 'Inputs';
  html = null;

  constructor(props) {
    super(props);
    const {
      size = '1',
      type = 'bordered',
      // No invented defaults: a field built from code had «Label», «placeholder»
      // and required set unless the caller said otherwise.
      label = '',
      required = false,
      placeholder = '',
      inputType = 'text',
      autocomplete = '',
      inputMode = '',
      minLength = '',
      maxLength = '',
      pattern = '',
      hint = '',
      value = '',
      name = '',
      leftIcon = '',
      rightText = '',
      hintIcon = '',
      disabled = false,
      readonly = false,
      error = false,
      invalid = false,
      errorMessage = '',
      mask = false,
      maskPattern = '',
      maskLazy = '',
      maskPlaceholderChar = '',
      maskOptions = ''
    } = this.params || {};
    const className = this.attrs.class || this.attrs.className;
    const normalizedSize = (0,_field_size__WEBPACK_IMPORTED_MODULE_4__.fieldSize)(size, 'sf-input');
    const normalizedVariant = boundedValue(type, INPUT_VARIANTS, 'bordered');
    this.template = document.createElement('label');
    if (this.id) this.template.id = this.id;
    this.template.classList.add('sf-input', `sf-input--size-${normalizedSize}`, `sf-input--${normalizedVariant}`);
    this.template.classList.toggle('error', toBoolean(invalid || error, false));
    this.template.dataset.mask = String(toBoolean(mask, false));
    this.template.dataset.maskPattern = String(maskPattern || '');
    this.template.dataset.maskLazy = String(maskLazy ?? '');
    this.template.dataset.maskPlaceholderChar = String(maskPlaceholderChar || '');
    this.template.dataset.maskOptions = String(maskOptions || '');

    if (className) {
      this.template.classList.add(...`${className}`.split(' ').filter(Boolean));
    }

    const labelWrap = document.createElement('span');
    labelWrap.classList.add('sf-input-label');
    const labelText = document.createElement('span');
    labelText.classList.add('sf-input-text');
    labelText.textContent = label;
    labelWrap.append(labelText);

    if (toBoolean(required, true)) {
      const requiredMark = document.createElement('span');
      requiredMark.classList.add('sf-input-required');
      requiredMark.textContent = '*';
      labelWrap.append(requiredMark);
    }

    const field = document.createElement('span');
    field.classList.add('sf-input-field');

    if (leftIcon) {
      const icon = document.createElement('i');
      icon.classList.add('sf-icon');
      icon.textContent = String(leftIcon);
      field.append(icon);
    }

    const input = document.createElement('input');
    input.type = normalizeInputType(inputType);
    input.placeholder = String(placeholder ?? '');
    if (autocomplete) input.autocomplete = String(autocomplete);
    input.inputMode = normalizeInputMode(inputMode);
    const normalizedMinLength = normalizeLength(minLength);
    const normalizedMaxLength = normalizeLength(maxLength);
    if (normalizedMinLength !== null) input.minLength = normalizedMinLength;
    if (normalizedMaxLength !== null) input.maxLength = normalizedMaxLength;
    if (pattern) input.pattern = String(pattern);
    input.value = String(value ?? '');
    input.defaultValue = String(value ?? '');
    if (name) input.name = String(name);
    input.disabled = toBoolean(disabled, false);
    input.readOnly = toBoolean(readonly, false);
    input.required = toBoolean(required, true);
    input.dataset.mask = String(toBoolean(mask, false));
    input.dataset.maskPattern = String(maskPattern || '');
    input.dataset.maskLazy = String(maskLazy ?? '');
    input.dataset.maskPlaceholderChar = String(maskPlaceholderChar || '');
    input.dataset.maskOptions = String(maskOptions || '');
    input.classList.toggle('error', toBoolean(invalid || error, false));
    field.append(input);

    if (rightText) {
      const right = document.createElement('span');
      right.classList.add('sf-input-right');
      right.textContent = String(rightText);
      field.append(right);
    }

    if (hintIcon) {
      const iconHint = document.createElement('i');
      iconHint.classList.add('sf-icon', 'sf-icon-hint');
      iconHint.textContent = String(hintIcon);
      field.append(iconHint);
    }

    this.template.append(labelWrap, field);
    const message = toBoolean(invalid || error, false) && errorMessage ? errorMessage : hint;

    if (message) {
      const hintWrap = document.createElement('span');
      hintWrap.classList.add('sf-input-hint-text-wrap');
      hintWrap.textContent = String(message);
      hintWrap.dataset.fieldMessage = toBoolean(invalid || error, false) && errorMessage ? 'error' : 'hint';
      this.template.append(hintWrap);
    }

    this.applyLayoutUtilities(this.template, '.sf-input');
    this.applyLayoutUtilities(labelWrap, '.sf-input .sf-input-label');
    this.applyLayoutUtilities(field, '.sf-input .sf-input-field');
    this.applyLayoutUtilities(input, '.sf-input .sf-input-field input');
  }

  init() {
    bindInput(this.template);
  }

  destroyInternal() {
    unbindInput(this.template);
  }

}

Inputs.utilityMap = _json_input_utility_json__WEBPACK_IMPORTED_MODULE_2__;
(0,_register_helper__WEBPACK_IMPORTED_MODULE_1__["default"])('Inputs', Inputs);

if (typeof window !== 'undefined') {
  window.SF = window.SF || {};
  window.SF.Input = window.SF.Input || {};
  window.SF.Input.setState = setInputState;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initExistingInputs());
} else {
  initExistingInputs();
}

const inputObserver = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (!(node instanceof Element)) return;

      if (node.matches?.(INPUT_SELECTOR)) {
        bindInput(node);
      }

      initExistingInputs(node);
    });
  });
});
inputObserver.observe(document.documentElement, {
  childList: true,
  subtree: true
});

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "0ab12d47912a"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   maskService: () => (/* binding */ maskService)
/* harmony export */ });
// SF.Mask belongs to Core. A page may run a field's script before Core --
// SF_PRELOADED allows it, and Docara loads every page and example frame that
// way (smart-base, the component scripts, then core.js) -- and a field that
// found no SF.Mask at bind time gave up on its mask for good: the root was
// bound and the input stayed unmasked. The fields ask for the service here
// instead; it is there at once on an ordinary page, and otherwise arrives
// with Core's sf-mask-ready (or is found at the Loader's ready or the window's
// load, for a Core that predates the event). One promise per bundle.
let pending = null;
function maskService() {
  const current = () => window.SF?.Mask?.create ? window.SF.Mask : null;

  const service = current();
  if (service) return Promise.resolve(service);
  if (pending) return pending;
  pending = new Promise(resolve => {
    const events = [[window, 'sf-mask-ready'], [window, 'sf-loader-ready'], [window, 'load'], [document, 'DOMContentLoaded']];

    const check = () => {
      const found = current();
      if (!found) return;
      events.forEach(([target, type]) => target.removeEventListener(type, check));
      pending = null;
      resolve(found);
    };

    events.forEach(([target, type]) => target.addEventListener(type, check));
  });
  return pending;
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

/***/ "38ea8d53f301"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FormField: () => (/* binding */ FormField),
/* harmony export */   VALIDITY_FLAGS: () => (/* binding */ VALIDITY_FLAGS),
/* harmony export */   innerControlName: () => (/* binding */ innerControlName),
/* harmony export */   syncFieldValidity: () => (/* binding */ syncFieldValidity),
/* harmony export */   syncOwnValidity: () => (/* binding */ syncOwnValidity)
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
 * value-missing and the custom error the page set; `anchor`, when it is a part
 * of the host, is where the browser points.
 */

function syncOwnValidity(component, {
  valueMissing = false,
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

};

/***/ },

/***/ "778671c79fa6"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   INHERITED_RESET_EVENT: () => (/* binding */ INHERITED_RESET_EVENT),
/* harmony export */   INHERITED_TEXT: () => (/* binding */ INHERITED_TEXT),
/* harmony export */   InheritedValueField: () => (/* binding */ InheritedValueField),
/* harmony export */   inheritedStepDown: () => (/* binding */ inheritedStepDown),
/* harmony export */   renderInheritedSlot: () => (/* binding */ renderInheritedSlot)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("43090d1c8307");
/* harmony import */ var _inherited_value_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("c6c9dfe31af4");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_1__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__);


 // An inherited value, for every field of the input family (simai/ui-source#28).
//
// A setting whose empty value means «use what the parent says» -- a letter's
// colour from the brand, a page's font from the theme -- has two states a field
// must tell apart: «not set, so the parent's value applies» and «set, to
// something that may even equal it». Only the first follows the parent when the
// parent changes. A placeholder alone draws the first as if it were a value
// (ui-mail polish audit B2, P-15), and there was no way back to it once a
// person had typed.
//
// So a field that opts in takes `inherited-value`: while it holds no value of
// its own it shows that value in the placeholder ink with a small «inherited»
// marker, and the form gets an empty value. Once it holds a value of its own,
// the marker gives way to a reset button that empties the field again. The
// record views of package larena already draw a field's `inheritedValue` this
// way (property-view port 1.8.0 and later); this is the same state on the
// controls themselves, so a record view can hand it down rather than draw it
// beside them.
//
// Written once here and opted into by each control, which says only what its
// own value is, how to empty it and what takes focus: sf-input, sf-textarea,
// sf-dropdown, sf-color and sf-switch.
// The trait's event, one name for the whole family (§8, §20.2). The field
// sends this name; the dated `sf-field:reset` follows it, with the same detail
// and one cancel, from the alias shim (aliases.json, §16 item 20).

const INHERITED_RESET_EVENT = 'sf-field-reset'; // The marker and the reset, in the page's language. A product names its own
// words with `inherited-text` and `reset-label`, or registers a language.

const INHERITED_TEXT = {
  en: {
    inherited: 'inherited',
    reset: 'Reset to inherited',
    described: 'Inherited: {value}'
  },
  ru: {
    inherited: 'наследуется',
    reset: 'Сбросить к наследуемому',
    described: 'Наследуется: {value}'
  }
}; // Each control declares the three in its own props -- inherited-value,
// inherited-text and reset-label -- written out rather than spread from here, so
// the manifest check that reads a component's props sees them.
// The marker and the reset are one step down the ladder from the field they
// sit in, so they fit inside its box: a size 1 field (40px) holds a size 1/2
// button (32px) with the same inset on every side.

const STEP_DOWN = Object.freeze({
  '1/2': '1/3',
  '1': '1/2',
  '2': '1'
});
const inheritedStepDown = size => STEP_DOWN[String(size)] || '1/2';
/**
 * The mixin a control opts in with. The control supplies:
 *   - `inheritedOwnValue()` -- its own value as a string, '' when it has none;
 *   - `clearOwnValue()` -- empties it, firing the control's own input/change;
 *   - `inheritedFocusTarget()` -- the element that takes focus after a reset;
 * and may override `inheritedDisplayValue()` (what the inherited value reads
 * as -- a dropdown shows the option's label, not its machine value).
 */

const InheritedValueField = Base => class extends Base {
  constructor() {
    super(); // Typing changes the state without a redraw: the native field holds the
    // text, and redrawing on every key would fight it.

    this.__sfInheritedSync = () => this.syncInheritedState();

    this.addEventListener('input', this.__sfInheritedSync);
    this.addEventListener('change', this.__sfInheritedSync);
  }

  get inheritedValue() {
    return this.getAttribute('inherited-value') || '';
  }

  set inheritedValue(next) {
    if (next === null || next === undefined || next === '') this.removeAttribute('inherited-value');else this.setAttribute('inherited-value', String(next));
  }

  get inheritedText() {
    return this.getAttribute('inherited-text') || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(INHERITED_TEXT, 'inherited', this);
  }

  get resetLabel() {
    return this.getAttribute('reset-label') || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(INHERITED_TEXT, 'reset', this);
  }

  get hasInheritedValue() {
    return this.inheritedValue !== '';
  } // True while the field holds nothing of its own and the inherited value
  // applies. False without an inherited value: an empty field is then empty.


  get isInherited() {
    return this.hasInheritedValue && this.inheritedOwnValue() === '';
  }

  inheritedOwnValue() {
    return String(this.value ?? '');
  }

  inheritedDisplayValue() {
    return this.inheritedValue;
  }

  inheritedFocusTarget() {
    return null;
  }

  clearOwnValue() {
    this.value = '';
  } // What a screen reader hears beside the name while the value is inherited.


  inheritedDescription() {
    return (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(INHERITED_TEXT, 'described', this).replace('{value}', this.inheritedDisplayValue());
  }
  /**
   * Back to the inherited value. Fires `sf-field-reset` first, cancellable:
   * a host that must confirm or refuse calls preventDefault and nothing
   * changes. Returns whether the field was reset. The detail names the
   * element (`tag`), as a trait event does (standard 1.3.8 §20, trait
   * field-inherit@1: sf-field-reset {tag, value, inherited-value, name}): the
   * event comes from every field of the family, and a listener on a form
   * tells them apart by it.
   */


  resetToInherited() {
    if (!this.hasInheritedValue || this.inheritedOwnValue() === '') return false;
    if (this.hasAttribute('disabled') || this.hasAttribute('readonly')) return false;
    const event = new CustomEvent(INHERITED_RESET_EVENT, {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: {
        tag: this.localName,
        value: this.inheritedOwnValue(),
        inheritedValue: this.inheritedValue,
        name: this.getAttribute('name') || ''
      }
    });
    if (!this.dispatchEvent(event)) return false;
    this.clearOwnValue();
    this.syncInheritedState(); // The button that was pressed is gone, so focus goes where the person
    // works: the control itself. Left on a hidden button, it would fall to the
    // page and a keyboard user would start over from the top.

    const focus = () => this.inheritedFocusTarget()?.focus?.({
      preventScroll: true
    });

    focus();
    if (!this.contains(document.activeElement)) requestAnimationFrame(focus);
    return true;
  } // The state, drawn without a redraw: the host says it, the marker and the
  // reset swap, and the control carries the description. Each control calls it
  // at the end of its own afterRender, which the controls override without
  // calling up, so the mixin cannot hook it for them.


  syncInheritedState() {
    if (!this.hasInheritedValue && !this.__sfInheritedDescribed) {
      this.removeAttribute('data-inherited');
      return;
    }

    const inherited = this.isInherited;
    const own = this.hasInheritedValue && !inherited;
    if (inherited) this.setAttribute('data-inherited', 'true');else this.removeAttribute('data-inherited');
    this.querySelectorAll(':scope [data-inherited-marker]').forEach(node => {
      node.hidden = !inherited;
    });
    this.querySelectorAll(':scope [data-inherited-reset]').forEach(node => {
      node.hidden = !own;
    });
    const control = this.inheritedFocusTarget();
    if (!control) return;

    if (inherited) {
      control.setAttribute('aria-description', this.inheritedDescription());
      this.__sfInheritedDescribed = control;
    } else if (this.__sfInheritedDescribed === control) {
      control.removeAttribute('aria-description');
      this.__sfInheritedDescribed = null;
    }
  }

};
/**
 * The marker and the reset, for a control's trailing slot. Nothing at all
 * without an inherited value, so a field that does not use it is unchanged.
 */

function renderInheritedSlot(component, {
  size = '1',
  disabled = false,
  className = ''
} = {}) {
  if (!component?.hasInheritedValue) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const step = inheritedStepDown(size);
  const inherited = component.isInherited;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <span class="sf-field-inherited-slot sf-field-inherited-slot--size-${size} flex items-cross-center ${className}">
      <span class="sf-field-inherited sf-field-inherited--size-${step}"
            data-inherited-marker
            aria-hidden="true"
            ?hidden=${!inherited}>${component.inheritedText}</span>
      <button
        type="button"
        class="sf-field-reset sf-icon-button sf-icon-button--icon sf-icon-button--on-surface sf-icon-button--link sf-icon-button--size-${step}"
        data-inherited-reset
        aria-label=${component.resetLabel}
        title=${component.resetLabel}
        ?hidden=${inherited}
        ?disabled=${disabled}
        @click=${event => {
    // Inside a field's <label>, a press would also reach the control the
    // label is for -- a dropdown would open, a switch would flip.
    event.preventDefault();
    event.stopPropagation();
    component.resetToInherited();
  }}
      ><i class="sf-icon" aria-hidden="true">restart_alt</i></button>
    </span>
  `;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "f86697fb615f"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _component_inputs_js_inputs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("73aef1a2bf74");
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _component_field_size__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("e6d86f2cd058");
/* harmony import */ var _helpers_inherited_value__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("778671c79fa6");
/* harmony import */ var _helpers_form_field__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("38ea8d53f301");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("5c571b560382");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("fc92d2bbc3ce");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("b0558b1b8eb0");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("e9f1da81a45b");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("d6f37816062a");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_component_inputs_js_inputs__WEBPACK_IMPORTED_MODULE_0__, _core_js_smart_base__WEBPACK_IMPORTED_MODULE_1__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2__, _component_field_size__WEBPACK_IMPORTED_MODULE_3__, _helpers_inherited_value__WEBPACK_IMPORTED_MODULE_4__, _js_templates_default__WEBPACK_IMPORTED_MODULE_6__]);
([_component_inputs_js_inputs__WEBPACK_IMPORTED_MODULE_0__, _core_js_smart_base__WEBPACK_IMPORTED_MODULE_1__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2__, _component_field_size__WEBPACK_IMPORTED_MODULE_3__, _helpers_inherited_value__WEBPACK_IMPORTED_MODULE_4__, _js_templates_default__WEBPACK_IMPORTED_MODULE_6__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2__);










 // sf-input from its component.json (standard simai.smart-component 1.3.8 §3,
// §4, §17, §20). The settings are made by core/js/element-manifest.js; the
// legacy names `type` (appearance), `error` (invalid, §17.2), `left-icon`
// (icon-start) and `right-text` (text-end) are dated aliases (aliases.json),
// and so is the trait's old event sf-field:reset (sf-field-reset). The host is
// the form control through ElementInternals: it submits the text, reports the
// native input's validity, and the native input carries no name (§17.1).

const InputElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_7__, {
  base: (0,_helpers_inherited_value__WEBPACK_IMPORTED_MODULE_4__.InheritedValueField)((_core_js_smart_base__WEBPACK_IMPORTED_MODULE_1___default())),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_9__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_10__
  },
  source: 'ru',
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_8__
});

class SfInput extends (0,_helpers_form_field__WEBPACK_IMPORTED_MODULE_5__.FormField)(InputElement) {
  static get props() {
    return { ...super.props,
      rootClass: {
        default: ''
      },
      ariaLabel: {
        attribute: 'aria-label',
        default: ''
      },
      // What the field falls back to while it holds nothing (simai/ui-source#28):
      // shown as inherited, with a reset back to it once a value is typed.
      inheritedValue: {
        attribute: 'inherited-value',
        default: ''
      },
      inheritedText: {
        attribute: 'inherited-text',
        default: ''
      },
      resetLabel: {
        attribute: 'reset-label',
        default: ''
      }
    };
  }

  constructor() {
    super();
    this._boundRoot = null;
  }

  get size() {
    return (0,_component_field_size__WEBPACK_IMPORTED_MODULE_3__.fieldSize)(this.getAttribute('size') || '1', 'sf-input');
  } // element.focus() on the host reaches the native input.


  focusDelegate() {
    return this.getInputElement();
  }

  get value() {
    const input = this.getInputElement();
    return input ? input.value : this.getAttribute('value') || '';
  }

  set value(nextValue) {
    const input = this.getInputElement();
    const normalizedValue = String(nextValue ?? '');

    if (nextValue === null || nextValue === undefined) {
      this.removeAttribute('value');
    } else {
      this.setAttribute('value', normalizedValue);
    }

    const mask = this.querySelector('.sf-input')?.__sfInputMask;
    if (mask) mask.value = normalizedValue;else if (input && input.value !== normalizedValue) input.value = normalizedValue;
    this.sfSyncFormState?.();
  }

  get defaultValue() {
    return this.getAttribute('default-value') ?? this.getAttribute('value') ?? '';
  }

  set defaultValue(nextValue) {
    if (nextValue === null || nextValue === undefined) {
      this.removeAttribute('default-value');
      return;
    }

    this.setAttribute('default-value', String(nextValue));
  }

  get iconStart() {
    return this.getAttribute('icon-start') ?? '';
  }

  get textEnd() {
    return this.getAttribute('text-end') ?? '';
  }

  get maskLazy() {
    return this.hasAttribute('mask-lazy') ? this.getBooleanAttr('mask-lazy', true) : '';
  } // A field whose label is drawn outside the control -- a record panel prints
  // it, a toolbar has no room for one -- still owes a name. The host's
  // aria-label reaches the native input, which is what assistive technology
  // reads: on the host it named nothing, because the host is not the control.


  get ariaLabel() {
    return this.getProp('ariaLabel') || '';
  } // The inherited-value seam: the native input is the value, the focus and
  // what carries the description.


  inheritedFocusTarget() {
    return this.getInputElement();
  } // A reset is a change the person made, so it is said the way typing is: input,
  // then change, from the native input -- every listener on the host hears it
  // as it hears an edit.


  clearOwnValue() {
    const input = this.getInputElement(); // A field without a `value` attribute keeps none: writing one would switch
    // the template to its controlled input, a new element, and the focus the
    // reset gives back would land on the one taken away.

    if (this.hasAttribute('value')) {
      this.value = '';
    } else {
      const mask = this.querySelector('.sf-input')?.__sfInputMask;
      if (mask) mask.value = '';else if (input) input.value = '';
    }

    input?.dispatchEvent(new Event('input', {
      bubbles: true
    }));
    input?.dispatchEvent(new Event('change', {
      bubbles: true
    }));
  } // The browser's restore of a form (back, reload) gives the text back.


  formStateRestoreCallback(state) {
    if (typeof state === 'string') this.value = state;
  }

  templateContext() {
    const props = this.getPropsContext();
    const hasControlledValue = this.hasAttribute('value');
    const input = this.getInputElement();
    return this.createTemplateContext({ ...props,
      // The size the field draws: a retired size (1/3) is the one it keeps,
      // as the props' closed list alone would read it as the default.
      size: this.size,
      leftIcon: this.iconStart,
      rightText: this.textEnd,
      // Resolved names the template reads (contracts/template-context.json).
      iconStart: this.iconStart,
      textEnd: this.textEnd,
      type: this.appearance,
      maskLazy: this.maskLazy,
      // The host is the form control where the browser has ElementInternals,
      // so the native input carries no name (§17.1 item 6).
      controlName: (0,_helpers_form_field__WEBPACK_IMPORTED_MODULE_5__.innerControlName)(this, props.name),
      value: hasControlledValue ? props.value : input ? input.value : this.defaultValue,
      defaultValue: this.defaultValue,
      hasControlledValue,
      inheritedValue: this.inheritedValue,
      inheritedText: this.inheritedText,
      resetLabel: this.resetLabel,
      component: this
    });
  }

  onDisconnected() {
    if (this._boundRoot) {
      (0,_component_inputs_js_inputs__WEBPACK_IMPORTED_MODULE_0__.unbindInput)(this._boundRoot);
      this._boundRoot = null;
    }
  }

  afterRender() {
    if (this._boundRoot) {
      (0,_component_inputs_js_inputs__WEBPACK_IMPORTED_MODULE_0__.unbindInput)(this._boundRoot);
      this._boundRoot = null;
    }

    this._boundRoot = this.querySelector('.sf-input');

    if (this._boundRoot) {
      // The host's invalid is the state; the classes follow it. The template
      // draws the root's class, but the native input's `error` class is put
      // there by the binding (syncFieldContract) and no render takes it off --
      // and the binding read it back as "still invalid", so removing `invalid`
      // cleared the message while the red border and aria-invalid="true" came
      // back (Larena acceptance, 2026-10-22: the datetime's time field after
      // «Укажите время» and then 10:30).
      const invalid = this.invalid;

      this._boundRoot.classList.toggle('error', invalid);

      this.getInputElement()?.classList.toggle('error', invalid);
      (0,_component_inputs_js_inputs__WEBPACK_IMPORTED_MODULE_0__.bindInput)(this._boundRoot);
    }

    this.syncInheritedState();
    this.sfSyncFormState();
  }

  getInputElement() {
    return this.querySelector('.sf-input-field input, input');
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_6__.renderInputTemplate)(this.templateContext());
  }

  get state() {
    const root = this.querySelector('.sf-input');
    const input = this.getInputElement();
    return {
      value: input?.value || '',
      disabled: !!input?.disabled,
      invalid: input?.getAttribute('aria-invalid') === 'true',
      error: root?.classList?.contains('error') || input?.classList?.contains('error') || false
    };
  }

  onInput(handler, options) {
    if (typeof handler === 'function') {
      this.addEventListener('input', handler, options);
    }

    return this;
  }

  onChange(handler, options) {
    if (typeof handler === 'function') {
      this.addEventListener('change', handler, options);
    }

    return this;
  }

  onKeyUp(handler, options) {
    if (typeof handler === 'function') {
      this.addEventListener('keyup', handler, options);
    }

    return this;
  }

  onKeyDown(handler, options) {
    if (typeof handler === 'function') {
      this.addEventListener('keydown', handler, options);
    }

    return this;
  }

  onFocus(handler, options) {
    if (typeof handler === 'function') {
      this.addEventListener('focusin', handler, options);
    }

    return this;
  }

  onBlur(handler, options) {
    if (typeof handler === 'function') {
      this.addEventListener('focusout', handler, options);
    }

    return this;
  }

}

SfInput.define('sf-input');
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "5c571b560382"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderInputTemplate: () => (/* binding */ renderInputTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var _component_field_contract__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("e138a730fd7c");
/* harmony import */ var _helpers_inherited_value__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("778671c79fa6");
/* harmony import */ var _default_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("38b38b744888");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, _component_field_contract__WEBPACK_IMPORTED_MODULE_1__, _helpers_inherited_value__WEBPACK_IMPORTED_MODULE_2__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, _component_field_contract__WEBPACK_IMPORTED_MODULE_1__, _helpers_inherited_value__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);




function renderInputTemplate(context) {
  const {
    size,
    appearance,
    type,
    label,
    required,
    placeholder,
    inputType,
    autocomplete,
    inputmode,
    minlength,
    maxlength,
    pattern,
    hint,
    value,
    defaultValue,
    hasControlledValue,
    controlName,
    leftIcon,
    rightText,
    hintIcon,
    disabled,
    error,
    invalid,
    errorMessage,
    mask,
    rootClass,
    rootStyle,
    readonly,
    maskPattern,
    maskLazy,
    maskPlaceholderChar,
    maskOptions,
    ariaLabel
  } = context;
  const maskLazyValue = maskLazy === '' ? '' : String(maskLazy); // While the field holds nothing of its own, the inherited value is what the
  // empty field shows, in the placeholder's ink -- never as its value.

  const shownPlaceholder = context.inheritedValue || placeholder;
  const inheritedSlot = (0,_helpers_inherited_value__WEBPACK_IMPORTED_MODULE_2__.renderInheritedSlot)(context.component, {
    size,
    disabled: disabled || readonly
  });
  const inputValue = hasControlledValue ? value : defaultValue;
  const field = (0,_component_field_contract__WEBPACK_IMPORTED_MODULE_1__.createFieldContract)(context.component, {
    prefix: 'sf-input',
    required,
    invalid: invalid || error,
    hint,
    errorMessage
  });
  const rootClasses = ['sf-input', field.invalid ? 'error' : '', `sf-input--size-${size}`, `sf-input--${appearance ?? type}`, rootClass, 'flex', 'flex-col'];

  if (type === 'hidden') {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<input
              style=${rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
              type="hidden"
              .value=${inputValue}
              name=${controlName || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
              ?disabled=${disabled}
              ?readonly=${readonly}
              data-mask=${String(mask)}
              data-mask-pattern=${maskPattern || ''}
              data-mask-lazy=${maskLazyValue}
              data-mask-placeholder-char=${maskPlaceholderChar || ''}
              data-mask-options=${maskOptions || ''}
      />`;
  }

  const labelContent = context.component?.hasSlotContent?.('label') ? context.component.getSlotContent('label') : label ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
            <span class="sf-input-text">${label}</span>
            ${required ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-input-required">*</span>` : ''}
          ` // No label, no label row. A lone star above a control names nothing --
  // the control's own `required` is what tells a reader and assistive
  // technology that it must be filled in -- and the row it stood in came
  // out as an empty line over every required control in a panel whose
  // labels are drawn beside them.
  : '';
  const leftContent = context.component?.hasSlotContent?.('start') ? context.component.getSlotContent('start') : context.component?.hasSlotContent?.('left') ? context.component.getSlotContent('left') : leftIcon ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-input-left flex"><sf-icon icon="${leftIcon}"></sf-icon></span>` : '';
  const rightContent = context.component?.hasSlotContent?.('end') ? context.component.getSlotContent('end') : context.component?.hasSlotContent?.('right') ? context.component.getSlotContent('right') : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
          ${rightText ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-input-right"><span class="sf-input-text">${rightText}</span></span>` : ''}
          ${hintIcon ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-input-hint flex"><sf-icon icon="${hintIcon}"></sf-icon></span>` : ''}
        `;
  const hintContent = context.component?.hasSlotContent?.('hint') ? context.component.getSlotContent('hint') : hint;
  const errorContent = context.component?.hasSlotContent?.('error') ? context.component.getSlotContent('error') : errorMessage;
  const messageContent = field.invalid && errorContent ? errorContent : hintContent; // The visible label names the control through the wrapping <label>; with no
  // visible label there is nothing to name it, so the host's aria-label lands on
  // the native input. Both at once would make the name say one thing and the
  // page another.

  const accessibleName = !labelContent && ariaLabel ? ariaLabel : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <label
      class=${rootClasses.join(' ')}
      style=${rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      data-mask=${String(mask)}
      data-mask-pattern=${maskPattern || ''}
      data-mask-lazy=${maskLazyValue}
      data-mask-placeholder-char=${maskPlaceholderChar || ''}
      data-mask-options=${maskOptions || ''}
    >
      ${labelContent ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
            <span class="sf-input-label flex">
              ${labelContent}
            </span>
          ` : ''}

      <span class="sf-input-field items-cross-center transition flex">
        ${leftContent}
        ${hasControlledValue ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
              <input
                id=${field.controlId}
                type=${inputType}
                autocomplete=${autocomplete || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                inputmode=${inputmode || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                minlength=${minlength === '' ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : minlength}
                maxlength=${maxlength === '' ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : maxlength}
                pattern=${pattern || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                placeholder=${shownPlaceholder}
                .value=${value}
                .defaultValue=${defaultValue}
                name=${controlName || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ?disabled=${disabled}
                ?readonly=${readonly}
                ?required=${field.required}
                aria-label=${accessibleName}
                aria-invalid=${field.invalid ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                aria-describedby=${messageContent ? field.messageId : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                aria-errormessage=${field.invalid && errorContent ? field.messageId : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                data-mask=${String(mask)}
                data-mask-pattern=${maskPattern || ''}
                data-mask-lazy=${maskLazyValue}
                data-mask-placeholder-char=${maskPlaceholderChar || ''}
                data-mask-options=${maskOptions || ''}
              />
            ` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
              <input
                id=${field.controlId}
                type=${inputType}
                autocomplete=${autocomplete || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                inputmode=${inputmode || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                minlength=${minlength === '' ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : minlength}
                maxlength=${maxlength === '' ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : maxlength}
                pattern=${pattern || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                placeholder=${shownPlaceholder}
                .defaultValue=${inputValue}
                .value=${value}
                name=${controlName || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ?disabled=${disabled}
                ?readonly=${readonly}
                ?required=${field.required}
                aria-label=${accessibleName}
                aria-invalid=${field.invalid ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                aria-describedby=${messageContent ? field.messageId : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                aria-errormessage=${field.invalid && errorContent ? field.messageId : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                data-mask=${String(mask)}
                data-mask-pattern=${maskPattern || ''}
                data-mask-lazy=${maskLazyValue}
                data-mask-placeholder-char=${maskPlaceholderChar || ''}
                data-mask-options=${maskOptions || ''}
              />
            `}
        ${inheritedSlot}
        ${rightContent}
      </span>

      ${messageContent ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span
            id=${field.messageId}
            class="sf-input-hint-text-wrap"
            data-field-message=${field.invalid && errorContent ? 'error' : 'hint'}
          >${messageContent}</span>` : ''}
    </label>
  `;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "c6c9dfe31af4"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "38b38b744888"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


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

/***/ "43090d1c8307"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("page-language", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("page-language", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "deb1a4d61565"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("smart-base", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("smart-base", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "d6935866be49"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{".sf-input":["display/flex (.flex)","flex-direction/column (.flex-col)","flex-wrap/nowrap (.flex-nowrap)","gap/var(--sf-space-1\\\\/4)","justify-content/flex-start (.justify-start)"],".sf-input .sf-input-field":["display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","justify-content/flex-start (.justify-start)","align-items/center (.items-center)"],".sf-input .sf-input-label":["display/flex (.flex)","flex-direction/row (.flex-row)","align-items/flex-start (.items-start)"],".sf-input .sf-input-field input":["flex/1 (.flex-1)"],".sf-input .sf-input-field .sf-icon":["display/flex (.flex)","justify-content/flex-start (.justify-start)","align-items/center (.items-center)"],".sf-input .sf-input-text-container":["flex/1 (.flex-1)","display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","justify-content/flex-start (.justify-start)","align-items/center (.items-center)"],".sf-input .sf-input-group":["display/flex (.flex)","flex-direction/column (.flex-col)","flex-wrap/nowrap (.flex-nowrap)","justify-content/center (.justify-center)","align-items/flex-start (.items-start)"],".sf-input .sf-input-text-container-alt":["display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","justify-content/center (.justify-center)","align-items/center (.items-center)"],".sf-input .sf-icon-alt":["display/flex (.flex)","justify-content/flex-start (.justify-start)","align-items/center (.items-center)"],".sf-input .sf-input-hint-text-wrap":["flex/1 (.flex-1)","display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","gap/var(--sf-b0)","justify-content/flex-start (.justify-start)","align-items/center (.items-center)"]}');

/***/ },

/***/ "b0558b1b8eb0"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-input for the shim (stands/18-aliases-ci/alias.mjs, standard §16 item 20). mode: same-detail (the shim sends the new and the old name), split / detail-adds (a detail adapter, refused by the shim), attribute-and-property, method, property, manifest-only (the DOM name does not change), host-attribute (no shim), retired.","component":"sf-input","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"aria-label","to":null,"kind":"attribute","component":"sf-input","since":"2026-10-27","remove_after":"2026-12-01","mode":"host-attribute","section":"§3.1","note":"stays a host attribute, read by the base (§3.1, §4.8); no shim"},{"from":"error","to":"invalid","kind":"setting","component":"sf-input","since":"2026-10-27","remove_after":"2026-12-01","section":"§17.2","note":"error is a dated alias of invalid; the shim maps the attribute and the property"},{"from":"type","to":"appearance","kind":"setting","component":"sf-input","since":"2026-10-27","remove_after":"2026-12-01","section":"§16 item 20","note":"the legacy axis name (contracts/public-api-axes.json)"},{"from":"left-icon","to":"icon-start","kind":"setting","component":"sf-input","since":"2026-10-27","remove_after":"2026-12-01","section":"§16 item 20","note":"the legacy name of icon-start; icon-start wins when both are given"},{"from":"right-text","to":"text-end","kind":"setting","component":"sf-input","since":"2026-10-27","remove_after":"2026-12-01","section":"§16 item 20","note":"the legacy name of text-end; text-end wins when both are given"},{"from":"sf-field:reset","to":"sf-field-reset","kind":"event","component":"sf-input","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","section":"§8, §20.2","note":"the event of the trait field-inherit@1, declared in component.json as the shared event field-reset; the field sends sf-field-reset and the shim follows it with this dated name, same detail, one cancel"}]}');

/***/ },

/***/ "fc92d2bbc3ce"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.input","tag":"sf-input","version":"1.4.1","kind":"leaf","traits":["field-inherit@1"],"settings":{"size":{"type":"enum","values":["1/2","1","2"],"default":"1"},"appearance":{"type":"enum","values":["bordered","filled","hidden"],"default":"bordered"},"label":{"type":"string","default":""},"required":{"type":"boolean","default":false},"placeholder":{"type":"string","default":""},"input-type":{"type":"enum","values":["text","email","password","search","tel","url"],"default":"text"},"autocomplete":{"type":"string","default":""},"inputmode":{"type":"enum","values":["","none","text","tel","url","email","numeric","decimal","search"],"default":""},"minlength":{"type":"string","default":""},"maxlength":{"type":"string","default":""},"pattern":{"type":"string","default":""},"hint":{"type":"string","default":""},"default-value":{"type":"string","default":""},"name":{"type":"string","default":""},"icon-start":{"type":"icon","optional":true},"text-end":{"type":"string","optional":true},"hint-icon":{"type":"icon","default":""},"disabled":{"type":"boolean","default":false},"readonly":{"type":"boolean","default":false},"invalid":{"type":"boolean","default":false},"error-message":{"type":"string","default":""},"mask":{"type":"boolean","default":false},"mask-pattern":{"type":"string","default":""},"mask-lazy":{"type":"string","default":""},"mask-placeholder-char":{"type":"string","default":""},"mask-options":{"type":"string","default":""}},"values":{"value":{"type":"string","default":""}},"events":{"change":{"carries":"native"},"input":{"carries":"native"},"field-reset":{"shared":"field-inherit@1","cancelable":true,"carries":{"tag":{"type":"string"},"value":{"type":"string"},"inherited-value":{"type":"string"},"name":{"type":"string"}}}},"actions":{},"form":{"value":"value","name":"name","default":"value","submits":"value","reset":"default","required":"required","disabled":"disabled","readonly":"readonly","validity":["value-missing","type-mismatch","pattern-mismatch","too-short","too-long","custom-error"]},"host-states":{"data-inherited":"boolean"},"css-variables":{"--sf-input-background-color":{"type":"color","state":"default"},"--sf-input-border-color":{"type":"color","state":"default"},"--sf-input-color":{"type":"color","state":"default"},"--sf-input-radius":{"type":"length","state":"default"},"--sf-input-padding-inline":{"type":"length","state":"default"},"--sf-input-padding-block":{"type":"length","state":"default"},"--sf-input-invalid-border-color":{"type":"color","state":"invalid"}}}');

/***/ },

/***/ "e9f1da81a45b"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Text fields","x-trait-words":{"trait":"field-inherit@1","words":{"inherited":"inherited","reset":"Reset to inherited","described":"Inherited: {value}"}}}');

/***/ },

/***/ "d6f37816062a"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Текстовые поля","x-trait-words":{"trait":"field-inherit@1","words":{"inherited":"наследуется","reset":"Сбросить к наследуемому","described":"Наследуется: {value}"}}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("f86697fb615f");
/******/
/******/ })()
;