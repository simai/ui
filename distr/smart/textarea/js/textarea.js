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
/* harmony import */ var _core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("695f21e50358");
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

/***/ },

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

/***/ "d1a6a5f99125"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bindTextarea: () => (/* binding */ bindTextarea),
/* harmony export */   setTextareaState: () => (/* binding */ setTextareaState),
/* harmony export */   unbindTextarea: () => (/* binding */ unbindTextarea)
/* harmony export */ });
/* harmony import */ var _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d7f974466839");
/* harmony import */ var _register_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("58661bec99a6");
/* harmony import */ var _json_textarea_utility_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("9fe5ba254a5b");
/* harmony import */ var _field_contract__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("e138a730fd7c");
/* harmony import */ var _field_size__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("e6d86f2cd058");
/* harmony import */ var _form_reset_helper__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("67eed2647f47");
/* harmony import */ var _mask_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("0ab12d47912a");







const TEXTAREA_SELECTOR = 'label.sf-textarea';
const TEXTAREA_BOUND_FLAG = 'sfTextareaBound';
const TEXTAREA_VARIANTS = new Set(['bordered', 'filled', 'flush']);
const TEXTAREA_INPUT_MODES = new Set(['', 'none', 'text', 'tel', 'url', 'email', 'numeric', 'decimal', 'search']);
const TEXTAREA_WRAP_VALUES = new Set(['soft', 'hard']);

function boundedValue(value, allowed, fallback) {
  const normalized = String(value || fallback);
  return allowed.has(normalized) ? normalized : fallback;
}

function normalizeInputMode(value) {
  const normalized = String(value || '').toLowerCase();
  return TEXTAREA_INPUT_MODES.has(normalized) ? normalized : '';
}

function normalizeLength(value) {
  if (value === '' || value === null || typeof value === 'undefined') return null;
  const normalized = Number(value);
  return Number.isInteger(normalized) && normalized >= 0 ? normalized : null;
}

function normalizeWrap(value) {
  const normalized = String(value || 'soft').toLowerCase();
  return TEXTAREA_WRAP_VALUES.has(normalized) ? normalized : 'soft';
}

function toBoolean(value, fallback = false) {
  if (value === undefined || value === null || value === '') return fallback;
  if (typeof value === 'boolean') return value;
  return ['1', 'true', 'yes', 'on'].includes(String(value).toLowerCase());
}

function getTextareaNode(root) {
  return root?.querySelector?.('textarea') || null;
}

function getMessageNode(root) {
  return root?.querySelector?.('.sf-textarea-hint-text-wrap') || null;
}

function ensureMessageNode(root) {
  const existing = getMessageNode(root);
  if (existing) return existing;
  const messageNode = document.createElement('span');
  messageNode.classList.add('sf-textarea-hint-text-wrap');
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

function resolveMaskConfig(root, textarea) {
  const enabled = toBoolean(textarea.dataset.mask ?? root.dataset.mask, false);
  if (!enabled) return null;
  const fromTextarea = parseMaskOptions(textarea.dataset.maskOptions);
  const fromRoot = parseMaskOptions(root.dataset.maskOptions);
  if (fromTextarea) return fromTextarea;
  if (fromRoot) return fromRoot;
  const pattern = textarea.dataset.maskPattern ?? root.dataset.maskPattern;
  if (pattern) return {
    mask: String(pattern)
  };
  return null;
} // Auto-grow (simai/ui-source#17). The field follows its text between min-rows
// and max-rows and scrolls inside only past max-rows. CSS does it where the
// browser has `field-sizing: content`; the stylesheet also holds the limits, on
// the size ladder (one row is the height of an input of the same size, each
// further row adds the text line height of that size). Elsewhere the script
// below sets the height from scrollHeight on input, on a value set from code,
// on form reset and when the width changes -- never in the middle of an IME
// composition, which is measured once it ends.


const AUTO_GROW_CLASS = 'sf-textarea--auto-grow';

function supportsFieldSizing() {
  return typeof CSS !== 'undefined' && CSS.supports?.('field-sizing', 'content') === true;
}

function rowCount(value) {
  if (value === '' || value === null || typeof value === 'undefined') return null;
  const normalized = Math.trunc(Number(value));
  return Number.isFinite(normalized) && normalized > 0 ? normalized : null;
} // A bare data-auto-grow (or the root class written in markup) turns it on;
// data-auto-grow="false" turns it off.


function autoGrowFlag(value, fallback) {
  if (value === undefined || value === null) return fallback;
  if (value === '') return true;
  return toBoolean(value, fallback);
}

function resolveAutoGrow(root, textarea) {
  const enabled = autoGrowFlag(textarea.dataset.autoGrow ?? root.dataset.autoGrow, root.classList.contains(AUTO_GROW_CLASS));
  if (!enabled) return null;
  const minRows = rowCount(textarea.dataset.minRows ?? root.dataset.minRows) ?? 1;
  const maxRows = rowCount(textarea.dataset.maxRows ?? root.dataset.maxRows);
  return {
    minRows,
    maxRows: maxRows === null ? null : Math.max(maxRows, minRows)
  };
} // The height the text needs, written as the block size; min-block-size and
// max-block-size in the stylesheet keep it between the two limits. The root
// holds its height while the field is measured, so the page below does not
// move and the window does not scroll; the field keeps its own scroll.


function growTextarea(root, textarea) {
  if (!textarea.isConnected || textarea.clientWidth === 0) return;
  const heldMinBlockSize = root.style.minBlockSize;
  root.style.minBlockSize = `${root.getBoundingClientRect().height}px`;
  const {
    scrollTop
  } = textarea;
  textarea.style.blockSize = 'auto';
  const style = getComputedStyle(textarea);
  const border = (parseFloat(style.borderTopWidth) || 0) + (parseFloat(style.borderBottomWidth) || 0);
  textarea.style.blockSize = `${textarea.scrollHeight + border}px`; // Only a scroll the measuring lost is put back: writing scrollTop cancels the
  // browser's own pending move of the caret into view after a paste.

  if (textarea.scrollTop !== scrollTop) textarea.scrollTop = scrollTop;
  root.style.minBlockSize = heldMinBlockSize;
}

function bindAutoGrow(root, textarea) {
  const config = resolveAutoGrow(root, textarea);
  if (!config) return;
  const addedClass = !root.classList.contains(AUTO_GROW_CLASS);
  root.classList.add(AUTO_GROW_CLASS);
  textarea.rows = config.minRows;
  textarea.style.setProperty('--sf-textarea--min-rows', String(config.minRows));
  if (config.maxRows === null) textarea.style.removeProperty('--sf-textarea--max-rows');else textarea.style.setProperty('--sf-textarea--max-rows', String(config.maxRows));
  const state = {
    addedClass,
    fallback: null
  };
  root.__sfTextareaAutoGrow = state;
  if (supportsFieldSizing()) return;
  let composing = false;
  let width = -1;

  const grow = () => {
    if (!composing) growTextarea(root, textarea);
  };

  const onInput = event => {
    if (event.isComposing) return;
    grow();
  };

  const onCompositionStart = () => {
    composing = true;
  };

  const onCompositionEnd = () => {
    composing = false;
    grow();
  };

  textarea.addEventListener('input', onInput);
  textarea.addEventListener('compositionstart', onCompositionStart);
  textarea.addEventListener('compositionend', onCompositionEnd); // A value set from code fires no input event: the field's own value setter
  // measures after it, so el.value = '...' grows and shrinks the field too.

  const native = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value');
  Object.defineProperty(textarea, 'value', {
    configurable: true,
    enumerable: true,

    get() {
      return native.get.call(this);
    },

    set(next) {
      native.set.call(this, next);
      grow();
    }

  }); // Text wraps differently at another width; the height follows it. The block
  // size the script writes changes nothing here, so this cannot loop.

  const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(entries => {
    const next = Math.round(entries[entries.length - 1].contentRect.width);
    if (next === width) return;
    width = next;
    grow();
  });
  observer?.observe(textarea);
  grow();
  state.fallback = {
    grow,
    onInput,
    onCompositionStart,
    onCompositionEnd,
    observer
  };
}

function unbindAutoGrow(root, textarea) {
  const state = root.__sfTextareaAutoGrow;
  if (!state) return;
  delete root.__sfTextareaAutoGrow;
  if (state.addedClass) root.classList.remove(AUTO_GROW_CLASS);
  if (!textarea) return;
  textarea.style.removeProperty('--sf-textarea--min-rows');
  textarea.style.removeProperty('--sf-textarea--max-rows');
  const {
    fallback
  } = state;
  if (!fallback) return;
  textarea.removeEventListener('input', fallback.onInput);
  textarea.removeEventListener('compositionstart', fallback.onCompositionStart);
  textarea.removeEventListener('compositionend', fallback.onCompositionEnd);
  fallback.observer?.disconnect();
  delete textarea.value;
  textarea.style.removeProperty('block-size');
}

async function bindMask(root, textarea) {
  const config = resolveMaskConfig(root, textarea);
  if (!config) return;
  const request = {};
  root.__sfTextareaMaskRequest = request;

  try {
    const service = await (0,_mask_service__WEBPACK_IMPORTED_MODULE_6__.maskService)();
    if (root.__sfTextareaMaskRequest !== request) return;
    const instance = await service.create(textarea, config);
    if (!instance) return;

    if (root.dataset[TEXTAREA_BOUND_FLAG] !== '1' || root.__sfTextareaMaskRequest !== request || getTextareaNode(root) !== textarea) {
      service.destroy(instance);
      return;
    }

    root.__sfTextareaMask = instance;
  } catch (error) {
    console.warn('SF.Textarea mask init failed', error);
  }
}

function bindTextarea(root) {
  (0,_field_size__WEBPACK_IMPORTED_MODULE_4__.retireFieldSizeClass)(root, 'sf-textarea');
  if (!root || root.dataset[TEXTAREA_BOUND_FLAG] === '1') return;
  const textarea = getTextareaNode(root);
  if (!textarea) return;

  const noopHandler = () => {};

  const pointerFocusHandler = () => root.classList.add('sf-textarea--pointer-focus');

  const blurHandler = () => root.classList.remove('sf-textarea--pointer-focus');

  textarea.addEventListener('input', noopHandler);
  textarea.addEventListener('pointerdown', pointerFocusHandler);
  textarea.addEventListener('blur', blurHandler);
  root.__sfTextareaNoopHandler = noopHandler;
  root.__sfTextareaPointerFocusHandler = pointerFocusHandler;
  root.__sfTextareaBlurHandler = blurHandler;
  root.dataset[TEXTAREA_BOUND_FLAG] = '1';
  const message = messageState(root);
  (0,_field_contract__WEBPACK_IMPORTED_MODULE_3__.syncFieldContract)(root, textarea, {
    prefix: 'sf-textarea',
    labelNode: root.querySelector('.sf-textarea-text'),
    required: textarea.required || Boolean(root.querySelector('.sf-textarea-required')),
    invalid: root.classList.contains('error') || textarea.classList.contains('error'),
    ...message
  });
  root.__sfTextareaReleaseReset = (0,_form_reset_helper__WEBPACK_IMPORTED_MODULE_5__.bindFormReset)(textarea, () => {
    if (root.__sfTextareaMask) root.__sfTextareaMask.value = textarea.value;
    root.__sfTextareaAutoGrow?.fallback?.grow();
  });
  bindAutoGrow(root, textarea);
  bindMask(root, textarea);
}

function unbindTextarea(root) {
  if (!root || root.dataset[TEXTAREA_BOUND_FLAG] !== '1') return;
  delete root.__sfTextareaMaskRequest;
  const textarea = getTextareaNode(root);

  if (textarea && root.__sfTextareaNoopHandler) {
    textarea.removeEventListener('input', root.__sfTextareaNoopHandler);
  }

  if (textarea && root.__sfTextareaPointerFocusHandler) {
    textarea.removeEventListener('pointerdown', root.__sfTextareaPointerFocusHandler);
  }

  if (textarea && root.__sfTextareaBlurHandler) {
    textarea.removeEventListener('blur', root.__sfTextareaBlurHandler);
  }

  unbindAutoGrow(root, textarea);

  if (root.__sfTextareaMask) {
    window.SF?.Mask?.destroy?.(root.__sfTextareaMask);
  }

  root.__sfTextareaReleaseReset?.();
  delete root.__sfTextareaReleaseReset;
  delete root.__sfTextareaMask;
  delete root.__sfTextareaNoopHandler;
  delete root.__sfTextareaPointerFocusHandler;
  delete root.__sfTextareaBlurHandler;
  root.classList.remove('sf-textarea--pointer-focus');
  delete root.dataset[TEXTAREA_BOUND_FLAG];
}

function initExistingTextareas(target = document) {
  target.querySelectorAll(TEXTAREA_SELECTOR).forEach(bindTextarea);
}

function setTextareaState(target, state = {}) {
  const root = target instanceof HTMLElement ? target.closest(TEXTAREA_SELECTOR) || target : null;
  if (!root) return false;
  const textarea = getTextareaNode(root);
  if (!textarea) return false;

  if (Object.prototype.hasOwnProperty.call(state, 'disabled')) {
    textarea.disabled = toBoolean(state.disabled);
  }

  if (Object.prototype.hasOwnProperty.call(state, 'error')) {
    const invalid = toBoolean(state.error);
    root.classList.toggle('error', invalid);
    textarea.classList.toggle('error', invalid);
  }

  if (Object.prototype.hasOwnProperty.call(state, 'invalid')) {
    const invalid = toBoolean(state.invalid);
    root.classList.toggle('error', invalid);
    textarea.classList.toggle('error', invalid);
  }

  if (Object.prototype.hasOwnProperty.call(state, 'errorMessage')) {
    const value = String(state.errorMessage ?? '');
    const messageNode = value ? ensureMessageNode(root) : getMessageNode(root);

    if (messageNode) {
      messageNode.textContent = value; // The text is an error only on a field left invalid. Restoring a hint
      // with {invalid: false, errorMessage: hint} marked it an error, and a
      // later error with no text of its own pointed aria-errormessage at it.

      const invalid = root.classList.contains('error') || textarea.classList.contains('error');
      messageNode.dataset.fieldMessage = value && invalid ? 'error' : 'hint';
    }
  }

  if (Object.prototype.hasOwnProperty.call(state, 'value')) {
    textarea.value = String(state.value ?? '');
    textarea.dispatchEvent(new Event('input', {
      bubbles: true
    }));
  }

  (0,_field_contract__WEBPACK_IMPORTED_MODULE_3__.syncFieldContract)(root, textarea, {
    prefix: 'sf-textarea',
    labelNode: root.querySelector('.sf-textarea-text'),
    required: textarea.required || Boolean(root.querySelector('.sf-textarea-required')),
    invalid: root.classList.contains('error') || textarea.classList.contains('error'),
    ...messageState(root)
  });
  return true;
}

class Textarea extends _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__.ComponentObserver {
  static componentName = 'Textarea';
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
      autocomplete = '',
      inputMode = '',
      minLength = '',
      maxLength = '',
      spellcheck = true,
      wrap = 'soft',
      hint = '',
      value = '',
      name = '',
      rows = 3,
      disabled = false,
      readonly = false,
      error = false,
      invalid = false,
      errorMessage = '',
      mask = false,
      maskOptions,
      maskPattern,
      autoGrow = false,
      minRows,
      maxRows
    } = this.params || {};
    const className = this.attrs.class || this.attrs.className;
    const normalizedSize = (0,_field_size__WEBPACK_IMPORTED_MODULE_4__.fieldSize)(size, 'sf-textarea');
    const normalizedVariant = boundedValue(type, TEXTAREA_VARIANTS, 'bordered');
    this.template = document.createElement('label');
    if (this.id) this.template.id = this.id;
    this.template.classList.add('sf-textarea', `sf-textarea--size-${normalizedSize}`, `sf-textarea--${normalizedVariant}`);
    this.template.classList.toggle('error', toBoolean(invalid || error, false));

    if (className) {
      this.template.classList.add(...`${className}`.split(' ').filter(Boolean));
    }

    const labelWrap = document.createElement('span');
    labelWrap.classList.add('sf-textarea-label');
    const labelText = document.createElement('span');
    labelText.classList.add('sf-textarea-text');
    labelText.textContent = String(label);
    labelWrap.append(labelText);

    if (toBoolean(required, true)) {
      const requiredMark = document.createElement('span');
      requiredMark.classList.add('sf-textarea-required');
      requiredMark.textContent = '*';
      labelWrap.append(requiredMark);
    }

    const textarea = document.createElement('textarea');
    textarea.placeholder = String(placeholder ?? '');
    if (autocomplete) textarea.autocomplete = String(autocomplete);
    textarea.inputMode = normalizeInputMode(inputMode);
    const normalizedMinLength = normalizeLength(minLength);
    const normalizedMaxLength = normalizeLength(maxLength);
    if (normalizedMinLength !== null) textarea.minLength = normalizedMinLength;
    if (normalizedMaxLength !== null) textarea.maxLength = normalizedMaxLength;
    textarea.spellcheck = toBoolean(spellcheck, true);
    textarea.wrap = normalizeWrap(wrap);
    textarea.value = String(value ?? '');
    textarea.defaultValue = String(value ?? '');
    textarea.rows = Number(rows) > 0 ? Number(rows) : 3;
    if (name) textarea.name = String(name);
    textarea.disabled = toBoolean(disabled, false);
    textarea.readOnly = toBoolean(readonly, false);
    textarea.required = toBoolean(required, true);
    textarea.classList.toggle('error', toBoolean(invalid || error, false));
    textarea.dataset.mask = String(Boolean(mask));
    if (maskPattern) textarea.dataset.maskPattern = String(maskPattern);

    if (maskOptions && typeof maskOptions === 'object') {
      textarea.dataset.maskOptions = JSON.stringify(maskOptions);
    }

    if (toBoolean(autoGrow, false)) {
      textarea.dataset.autoGrow = 'true';
      const normalizedMinRows = rowCount(minRows);
      const normalizedMaxRows = rowCount(maxRows);
      if (normalizedMinRows !== null) textarea.dataset.minRows = String(normalizedMinRows);
      if (normalizedMaxRows !== null) textarea.dataset.maxRows = String(normalizedMaxRows);
    }

    this.template.append(labelWrap, textarea);
    const message = toBoolean(invalid || error, false) && errorMessage ? errorMessage : hint;

    if (message) {
      const hintWrap = document.createElement('span');
      hintWrap.classList.add('sf-textarea-hint-text-wrap');
      hintWrap.textContent = String(message);
      hintWrap.dataset.fieldMessage = toBoolean(invalid || error, false) && errorMessage ? 'error' : 'hint';
      this.template.append(hintWrap);
    }

    this.applyLayoutUtilities(this.template, '.sf-textarea');
    this.applyLayoutUtilities(labelWrap, '.sf-textarea .sf-textarea-label');
    this.applyLayoutUtilities(textarea, '.sf-textarea textarea');
  }

  init() {
    bindTextarea(this.template);
  }

  destroyInternal() {
    unbindTextarea(this.template);
  }

}

Textarea.utilityMap = _json_textarea_utility_json__WEBPACK_IMPORTED_MODULE_2__;
(0,_register_helper__WEBPACK_IMPORTED_MODULE_1__["default"])('Textarea', Textarea);

if (typeof window !== 'undefined') {
  window.SF = window.SF || {};
  window.SF.Textarea = window.SF.Textarea || {};
  window.SF.Textarea.setState = setTextareaState;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initExistingTextareas());
} else {
  initExistingTextareas();
}

const textareaObserver = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (!(node instanceof Element)) return;

      if (node.matches?.(TEXTAREA_SELECTOR)) {
        bindTextarea(node);
      }

      initExistingTextareas(node);
    });
  });
});
textareaObserver.observe(document.documentElement, {
  childList: true,
  subtree: true
});


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

/***/ "695f21e50358"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   instancePath: () => (/* binding */ instancePath),
/* harmony export */   partId: () => (/* binding */ partId),
/* harmony export */   pathIsSettled: () => (/* binding */ pathIsSettled)
/* harmony export */ });
// An instance's id is its role path (standard simai.smart-component 1.3.8
// §7.1.1; simai/ui-source#41).
//
//   - at the top of the page: `page/<host id or data-sf-role>`;
//   - a part with `data-sf-role` inside another instance:
//     `<parent path>/<role>`;
//   - neither: `<kind>[<n>]`, n counted in document order among the
//     instances of the same kind that have neither.
//
// Ids that templates write (`for`, `aria-controls`, `aria-labelledby`) are
// `<path with every non-word run as ->--<local name>`. A counter is never an
// id: the field ids used to come from a module-scope counter, and every
// bundle that carries the field code (eight of them) had its own, so a class
// sf-quantity and an <sf-quantity> on one page both took
// `sf-quantity-1-control` and a label pointed at the other field. Ids that
// follow creation order also swap when two instances swap, and server markup
// (§5.4) cannot repeat them. A path is read from the page, so every bundle
// gives the same answer.
//
// `kind` is the element's tag for a Smart element; class markup passes its
// root class and is told apart as `class.<root class>`.
const isElement = node => node && node.nodeType === 1 && typeof node.getAttribute === 'function';

const isCustom = node => isElement(node) && String(node.localName || '').includes('-');

function parentInstance(node) {
  for (let current = node.parentNode || node.host || null; current; current = current.parentNode || current.host || null) {
    if (isCustom(current)) return current;
  }

  return null;
}

function kindOf(owner, kind) {
  const tag = String(owner?.localName || '').toLowerCase();
  if (tag && tag.includes('-')) return tag;
  return `class.${kind || tag || 'element'}`;
}

function documentIndex(owner, kind) {
  const doc = owner?.ownerDocument;
  if (!owner?.isConnected || typeof doc?.querySelectorAll !== 'function') return 0;
  const selector = kind.startsWith('class.') ? `.${kind.slice('class.'.length)}` : kind;
  let index = 0;

  for (const one of doc.querySelectorAll(selector)) {
    if (kind.startsWith('class.') && isCustom(one)) continue;
    if (one.id || one.getAttribute('data-sf-role')) continue;
    index += 1;
    if (one === owner) return index;
  }

  return 0;
}
/** The role path of an instance (§7.1.1). */


function instancePath(owner, {
  kind = ''
} = {}) {
  const id = isElement(owner) ? String(owner.id || '').trim() : String(owner?.id || '').trim();
  if (id) return `page/${id}`;
  const role = isElement(owner) ? String(owner.getAttribute('data-sf-role') || '').trim() : '';

  if (role) {
    const parent = parentInstance(owner);
    return parent ? `${instancePath(parent, {
      kind: parent.localName
    })}/${role}` : `page/${role}`;
  }

  const resolved = kindOf(owner, kind);
  return `${resolved}[${documentIndex(owner, resolved)}]`;
}
/** An id a template writes for one of its parts: `<path as a word>--<local name>`. */

function partId(path, local) {
  const base = String(path).replace(/\W+/gu, '-').replace(/^-+|-+$/gu, '');
  return local ? `${base}--${local}` : base;
}
/** Whether the path is final: an instance in the page, or one with an id. */

function pathIsSettled(owner) {
  return Boolean(owner?.isConnected || String(owner?.id || '').trim());
}

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
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ddf1cdb42ecc");
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("0d662e4d7d63");
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

const INHERITED_RESET_EVENT = 'sf-field:reset'; // The marker and the reset, in the page's language. A product names its own
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
   * Back to the inherited value. Fires `sf-field:reset` first, cancellable:
   * a host that must confirm or refuse calls preventDefault and nothing
   * changes. Returns whether the field was reset.
   */


  resetToInherited() {
    if (!this.hasInheritedValue || this.inheritedOwnValue() === '') return false;
    if (this.hasAttribute('disabled') || this.hasAttribute('readonly')) return false;
    const event = new CustomEvent(INHERITED_RESET_EVENT, {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: {
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

/***/ "c6ddd1585553"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _component_textarea_js_textarea__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d1a6a5f99125");
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("fbe0570fcc69");
/* harmony import */ var _component_field_size__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("e6d86f2cd058");
/* harmony import */ var _helpers_inherited_value__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("778671c79fa6");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("943b9fa4bc95");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_1__, _helpers_inherited_value__WEBPACK_IMPORTED_MODULE_3__, _js_templates_default__WEBPACK_IMPORTED_MODULE_4__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_1__, _helpers_inherited_value__WEBPACK_IMPORTED_MODULE_3__, _js_templates_default__WEBPACK_IMPORTED_MODULE_4__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_1__);





const TEXTAREA_VARIANTS = new Set(['bordered', 'filled', 'flush']);
const TEXTAREA_INPUT_MODES = new Set(['', 'none', 'text', 'tel', 'url', 'email', 'numeric', 'decimal', 'search']);
const TEXTAREA_WRAP_VALUES = new Set(['soft', 'hard']);

function boundedValue(value, allowed, fallback) {
  const normalized = String(value || fallback);
  return allowed.has(normalized) ? normalized : fallback;
}

class SfTextarea extends (0,_helpers_inherited_value__WEBPACK_IMPORTED_MODULE_3__.InheritedValueField)((_core_js_smart_base__WEBPACK_IMPORTED_MODULE_1___default())) {
  static get props() {
    return {
      size: {
        default: '1'
      },
      // The axis is called appearance, because that is the question it answers.
      // `type` keeps working: see contracts/public-api-axes.json.
      // flush: inside a composite control that draws the box and the focus.
      appearance: {
        default: 'bordered',
        values: ['bordered', 'filled', 'flush'],
        aliases: ['type']
      },
      label: {
        default: ''
      },
      required: {
        type: Boolean,
        default: false
      },
      placeholder: {
        default: ''
      },
      autocomplete: {
        default: ''
      },
      inputmode: {
        default: ''
      },
      minlength: {
        type: Number,
        default: null
      },
      maxlength: {
        type: Number,
        default: null
      },
      spellcheck: {
        type: Boolean,
        default: true
      },
      wrap: {
        default: 'soft'
      },
      hint: {
        default: ''
      },
      value: {
        default: ''
      },
      name: {
        default: ''
      },
      rows: {
        type: Number,
        default: 3
      },
      disabled: {
        type: Boolean,
        default: false
      },
      readonly: {
        type: Boolean,
        default: false
      },
      error: {
        type: Boolean,
        default: false
      },
      invalid: {
        type: Boolean,
        default: false
      },
      errorMessage: {
        default: ''
      },
      mask: {
        type: Boolean,
        default: false
      },
      maskPattern: {
        default: ''
      },
      maskOptions: {
        default: ''
      },
      // Auto-grow (simai/ui-source#17): the field follows its text between
      // min-rows and max-rows, then scrolls inside.
      autoGrow: {
        type: Boolean,
        default: false
      },
      minRows: {
        type: Number,
        default: 1
      },
      maxRows: {
        type: Number,
        default: null
      },
      // What the field falls back to while it holds nothing (simai/ui-source#28).
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
    return (0,_component_field_size__WEBPACK_IMPORTED_MODULE_2__.fieldSize)(this.getAttribute('size') || '1', 'sf-textarea');
  }

  get appearance() {
    return this.getProp('appearance');
  } // The legacy name, kept so a consumer reading el.type still gets an answer.


  get type() {
    return this.appearance;
  }

  get label() {
    return this.getAttribute('label') || '';
  }

  get required() {
    return this.getBooleanAttr('required', false);
  }

  get placeholder() {
    return this.getAttribute('placeholder') || '';
  }

  get autocomplete() {
    return this.getAttribute('autocomplete') || '';
  }

  get inputmode() {
    return boundedValue(this.getAttribute('inputmode'), TEXTAREA_INPUT_MODES, '');
  }

  get minlength() {
    const value = this.getNumberAttr('minlength', null);
    return Number.isInteger(value) && value >= 0 ? value : null;
  }

  get maxlength() {
    const value = this.getNumberAttr('maxlength', null);
    return Number.isInteger(value) && value >= 0 ? value : null;
  }

  get spellcheck() {
    return this.getBooleanAttr('spellcheck', true);
  }

  get wrap() {
    return boundedValue(this.getAttribute('wrap'), TEXTAREA_WRAP_VALUES, 'soft');
  }

  get hint() {
    return this.getAttribute('hint') || '';
  }

  get value() {
    const textarea = this.querySelector('.sf-textarea textarea');
    return textarea ? textarea.value : this.getAttribute('value') || '';
  }

  set value(nextValue) {
    const normalizedValue = String(nextValue ?? '');

    if (nextValue === null || nextValue === undefined) {
      this.removeAttribute('value');
    } else {
      this.setAttribute('value', normalizedValue);
    }

    const root = this.querySelector('.sf-textarea');
    const textarea = root?.querySelector('textarea');
    if (root?.__sfTextareaMask) root.__sfTextareaMask.value = normalizedValue;else if (textarea) textarea.value = normalizedValue;
  }

  get name() {
    return this.getAttribute('name') || '';
  }

  get rows() {
    const value = Math.trunc(this.getNumberAttr('rows', 3));
    return value > 0 ? value : 3;
  }

  get autoGrow() {
    return this.getBooleanAttr('auto-grow', false);
  }

  get minRows() {
    const value = Math.trunc(this.getNumberAttr('minRows', 1));
    return value > 0 ? value : 1;
  } // No cap unless one is given; a cap below min-rows is min-rows.


  get maxRows() {
    const value = Math.trunc(this.getNumberAttr('maxRows', null));
    return value > 0 ? Math.max(value, this.minRows) : null;
  }

  get disabled() {
    return this.getBooleanAttr('disabled', false);
  }

  get readonly() {
    return this.getBooleanAttr('readonly', false);
  }

  get error() {
    return this.getBooleanAttr('error', false);
  }

  get invalid() {
    return this.getBooleanAttr('invalid', false);
  }

  get errorMessage() {
    return this.getAttribute('error-message') || '';
  }

  get mask() {
    return this.getBooleanAttr('mask', false);
  }

  get maskPattern() {
    return this.getAttribute('mask-pattern') || '';
  }

  get maskOptions() {
    return this.getAttribute('mask-options') || '';
  } // The inherited-value seam: the native textarea is the value, the focus and
  // what carries the description.


  inheritedFocusTarget() {
    return this.querySelector('.sf-textarea textarea');
  } // A reset is said the way typing is: input, then change, from the textarea.


  clearOwnValue() {
    this.value = '';
    const textarea = this.inheritedFocusTarget();
    textarea?.dispatchEvent(new Event('input', {
      bubbles: true
    }));
    textarea?.dispatchEvent(new Event('change', {
      bubbles: true
    }));
  }

  templateContext() {
    const props = this.getPropsContext();
    const textarea = this.querySelector('textarea');
    return this.createTemplateContext({ ...props,
      value: this.hasAttribute('value') || !textarea ? props.value : textarea.value,
      // Resolved names the template reads (contracts/template-context.json).
      type: this.type,
      minlength: this.minlength,
      maxlength: this.maxlength,
      autoGrow: this.autoGrow,
      minRows: this.minRows,
      maxRows: this.maxRows,
      inheritedValue: this.inheritedValue,
      inheritedText: this.inheritedText,
      resetLabel: this.resetLabel,
      component: this
    });
  }

  onDisconnected() {
    if (this._boundRoot) {
      (0,_component_textarea_js_textarea__WEBPACK_IMPORTED_MODULE_0__.unbindTextarea)(this._boundRoot);
      this._boundRoot = null;
    }
  }

  afterRender() {
    if (this._boundRoot) {
      (0,_component_textarea_js_textarea__WEBPACK_IMPORTED_MODULE_0__.unbindTextarea)(this._boundRoot);
      this._boundRoot = null;
    }

    this._boundRoot = this.querySelector('.sf-textarea');

    if (this._boundRoot) {
      (0,_component_textarea_js_textarea__WEBPACK_IMPORTED_MODULE_0__.bindTextarea)(this._boundRoot);
    }

    this.syncInheritedState();
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_4__.renderTextareaTemplate)(this.templateContext());
  }

  get state() {
    const root = this.querySelector('.sf-textarea');
    const textarea = root?.querySelector?.('textarea') || null;
    return {
      value: textarea?.value || '',
      disabled: !!textarea?.disabled,
      invalid: textarea?.getAttribute('aria-invalid') === 'true',
      error: root?.classList?.contains('error') || textarea?.classList?.contains('error') || false
    };
  }

  setState(nextState = {}) {
    const root = this.querySelector('.sf-textarea');
    return (0,_component_textarea_js_textarea__WEBPACK_IMPORTED_MODULE_0__.setTextareaState)(root, nextState);
  }

}

SfTextarea.define('sf-textarea');
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "943b9fa4bc95"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderTextareaTemplate: () => (/* binding */ renderTextareaTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ddf1cdb42ecc");
/* harmony import */ var _component_field_contract__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("e138a730fd7c");
/* harmony import */ var _helpers_inherited_value__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("778671c79fa6");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, _helpers_inherited_value__WEBPACK_IMPORTED_MODULE_2__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, _helpers_inherited_value__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);



function renderTextareaTemplate(context) {
  const {
    size,
    appearance,
    type,
    label,
    required,
    placeholder,
    autocomplete,
    inputmode,
    minlength,
    maxlength,
    spellcheck,
    wrap,
    hint,
    value,
    name,
    rows,
    disabled,
    readonly,
    error,
    invalid,
    errorMessage,
    mask,
    maskPattern,
    maskOptions,
    autoGrow,
    minRows,
    maxRows
  } = context;
  const field = (0,_component_field_contract__WEBPACK_IMPORTED_MODULE_1__.createFieldContract)(context.component, {
    prefix: 'sf-textarea',
    required,
    invalid: invalid || error,
    hint,
    errorMessage
  });
  const errorContent = context.component?.hasSlotContent?.('error') ? context.component.getSlotContent('error') : errorMessage;
  const hintContent = context.component?.hasSlotContent?.('hint') ? context.component.getSlotContent('hint') : hint;
  const messageContent = field.invalid && errorContent ? errorContent : hintContent;
  const rootClasses = ['sf-textarea', `sf-textarea--size-${size}`, `sf-textarea--${appearance ?? type}`, field.invalid ? 'error' : '', autoGrow ? 'sf-textarea--auto-grow' : '', 'flex', 'flex-col', context.rootClass].filter(Boolean);
  const labelContent = label ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <span class="sf-textarea-text">${label}</span>
        ${required ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-textarea-required">*</span>` : ''}
      ` // A label row with nothing but a star names nothing: see sf-input.
  : '';
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <label
      class=${rootClasses.join(' ')}
      style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      data-mask=${String(mask)}
      data-mask-pattern=${maskPattern || ''}
      data-mask-options=${maskOptions || ''}
    >
      ${labelContent ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
            <span class="sf-textarea-label flex">
              ${labelContent}
            </span>
          ` : ''}

      <textarea
        id=${field.controlId}
        class=${`transition${field.invalid ? ' error' : ''}`}
        placeholder=${context.inheritedValue || placeholder}
        autocomplete=${autocomplete || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        inputmode=${inputmode || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        minlength=${minlength ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        maxlength=${maxlength ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        .spellcheck=${spellcheck}
        wrap=${wrap}
        .value=${value}
        .defaultValue=${value}
        name=${name || ''}
        rows=${autoGrow ? minRows : rows}
        ?disabled=${disabled}
        ?readonly=${readonly}
        ?required=${field.required}
        aria-invalid=${field.invalid ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        aria-describedby=${messageContent ? field.messageId : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        aria-errormessage=${field.invalid && errorContent ? field.messageId : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        data-mask=${String(mask)}
        data-mask-pattern=${maskPattern || ''}
        data-mask-options=${maskOptions || ''}
        data-auto-grow=${autoGrow ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        data-min-rows=${autoGrow ? minRows : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        data-max-rows=${autoGrow && maxRows ? maxRows : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      ></textarea>

      ${(0,_helpers_inherited_value__WEBPACK_IMPORTED_MODULE_2__.renderInheritedSlot)(context.component, {
    size,
    disabled: disabled || readonly,
    className: 'sf-textarea-inherited'
  })}

      ${messageContent ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span
            id=${field.messageId}
            class="sf-textarea-hint-text-wrap"
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

/***/ "ddf1cdb42ecc"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit") : new Promise((resolve) => globalThis.addEventListener("sf-runtime-ready", () => resolve(globalThis.SF.runtimeModule("lit")), { once: true })));

/***/ },

/***/ "0d662e4d7d63"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("page-language") : new Promise((resolve) => globalThis.addEventListener("sf-runtime-ready", () => resolve(globalThis.SF.runtimeModule("page-language")), { once: true })));

/***/ },

/***/ "fbe0570fcc69"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("smart-base") : new Promise((resolve) => globalThis.addEventListener("sf-runtime-ready", () => resolve(globalThis.SF.runtimeModule("smart-base")), { once: true })));

/***/ },

/***/ "9fe5ba254a5b"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{".sf-textarea":["display/flex (.flex)","flex-direction/column (.flex-col)","flex-wrap/nowrap (.flex-nowrap)","gap/var(--sf-space-1\\\\/4)","justify-content/flex-start (.justify-start)"],".sf-textarea .sf-textarea-label":["display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","gap/var(--sf-space-1\\\\/4)","justify-content/flex-start (.justify-start)","align-items/flex-start (.items-start)"],".sf-textarea textarea":[],".sf-textarea .sf-textarea-hint-text-wrap":["flex/1 (.flex-1)","display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","gap/var(--sf-b0)","justify-content/flex-start (.justify-start)","align-items/center (.items-center)"]}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("c6ddd1585553");
/******/
/******/ })()
;