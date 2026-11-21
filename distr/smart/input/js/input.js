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
  } // A root that is not a label carries its label text as a <label> of its
  // own (div.sf-input, 1.13.0): it points at the control too.


  if (labelNode?.tagName === 'LABEL' && !labelNode.hasAttribute('for')) {
    labelNode.setAttribute('for', control.id);
  } // Name the field by its visible label, not every hint or adjacent button.
  // Author-provided accessible names remain authoritative.


  if (labelNode?.textContent?.trim() && !control.hasAttribute('aria-label') && !control.hasAttribute('aria-labelledby')) {
    // An id of its own: «<control>-label» may already name another element
    // (a page that gave the field's root that id), and aria-labelledby would
    // then read that element's whole text, the hint with it (DF-3).
    if (!labelNode.id) {
      const doc = labelNode.ownerDocument;
      let id = `${control.id}-label`;

      for (let n = 2; doc?.getElementById?.(id); n += 1) id = `${control.id}-label-${n}`;

      labelNode.id = id;
    }

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
/* harmony export */   FIELD_LADDER: () => (/* binding */ FIELD_LADDER),
/* harmony export */   FIELD_SIZES: () => (/* binding */ FIELD_SIZES),
/* harmony export */   FIELD_WIDTHS: () => (/* binding */ FIELD_WIDTHS),
/* harmony export */   INPUT_SIZES: () => (/* binding */ INPUT_SIZES),
/* harmony export */   RETIRED_FIELD_SIZES: () => (/* binding */ RETIRED_FIELD_SIZES),
/* harmony export */   fieldSize: () => (/* binding */ fieldSize),
/* harmony export */   fieldWidth: () => (/* binding */ fieldWidth),
/* harmony export */   fieldWidthClass: () => (/* binding */ fieldWidthClass),
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
// (component/inputs/scss/_field-ladder.scss). The textarea and the rich text
// followed (2026-11-14), then the dropdown, the file upload area and the image
// field (queue #70, 2026-11-16): every field of the family stands on the
// ladder. FIELD_SIZES, fieldSize and retireFieldSizeClass stay for the lines
// of tags, badges and avatars and for a file's row, which keep three sizes.

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
} // How wide a field is (owner decision C396, WM-4): the value it is made for,
// in characters of the width ladder, read from the field's width setting --
// short (20: a date, a number, a code), medium (28: a name, a phone) and long
// (44: a path, an e-mail, an address); the roles --sf-field--width-short,
// -medium and -long stand on the steps --sf-measure-20, -28 and -44 (core
// figma_measure.scss) and follow the text size, the density and the phone.
// It is the field's widest: in a narrower container the field is the
// container's width, as without it. Empty or any other value: the whole
// width, as every field drew before. The class is core's
// (core/scss/_sf_css__field_width.scss), so a field whose own sheet has not
// come yet already stands at its width.

const FIELD_WIDTHS = Object.freeze(['short', 'medium', 'long']);
/** A field width: short, medium or long, else '' (the whole width). */

function fieldWidth(value) {
  const width = String(value ?? '').trim().toLowerCase();
  return FIELD_WIDTHS.includes(width) ? width : '';
}
/** The root class of a field width, or '' for the whole width. */

function fieldWidthClass(value) {
  const width = fieldWidth(value);
  return width ? `sf-field--width-${width}` : '';
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






 // Two roots (1.13.0, DF-3). The wrapping label.sf-input names the input by
// everything inside it, the hint and a help mark too, until this script points
// aria-labelledby at the label text. div.sf-input keeps the hint out of the
// name in the markup itself: the label text is a <label for> of its own
// (label.sf-input-text), the hint a sibling the input points at with
// aria-describedby.

const INPUT_SELECTOR = '.sf-input:is(label, div)'; // What a press on the box hands to the input in a div root, where no wrapping
// label does it: anything but a control of its own (an action, a link).

const BOX_CONTROLS = 'input, button, a, select, textarea, label, [tabindex], sf-help-mark, sf-button, sf-button-icon';
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
  // sf-input keeps 1/3 and 3 (field-size.js inputSize): no class to move.
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
  root.__sfInputBlurHandler = blurHandler; // A div root: a press on the box (its padding, an icon, the text before or
  // after the value) focuses the input, as the wrapping label does.

  if (root.tagName !== 'LABEL') {
    const boxHandler = event => {
      if (event.button !== 0 || input.disabled) return;
      const target = event.target;
      if (!(target instanceof Element) || !target.closest('.sf-input-field')) return;
      if (target.closest(BOX_CONTROLS)) return;
      event.preventDefault();
      input.focus();
    };

    root.addEventListener('pointerdown', boxHandler);
    root.__sfInputBoxHandler = boxHandler;
  }

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

  if (root.__sfInputBoxHandler) root.removeEventListener('pointerdown', root.__sfInputBoxHandler);
  delete root.__sfInputBoxHandler;

  if (root.__sfInputMask) {
    window.SF?.Mask?.destroy?.(root.__sfInputMask);
  }

  root.__sfInputReleaseReset?.();
  delete root.__sfInputReleaseReset;
  delete root.__sfInputMask;
  delete root.__sfInputNoopHandler;
  delete root.__sfInputPointerFocusHandler;
  delete root.__sfInputBlurHandler; // A field moved in the page (a wizard taking its steps, a window its
  // content) is unbound and bound again: its markup stays as it was, so the
  // class list is not rewritten for a token it does not hold and the flag
  // keeps its place (the first paint printed before and after a move is the
  // same markup).

  if (root.classList.contains('sf-input--pointer-focus')) root.classList.remove('sf-input--pointer-focus');
  root.dataset[INPUT_BOUND_FLAG] = '0';
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
    const normalizedSize = (0,_field_size__WEBPACK_IMPORTED_MODULE_4__.inputSize)(size);
    const normalizedVariant = boundedValue(type, INPUT_VARIANTS, 'bordered'); // The div root (1.13.0, DF-3): the label text is the <label>, so the
    // hint under the field is a description, never part of the name.

    this.template = document.createElement('div');
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
    const labelText = document.createElement('label');
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
} // A field taken out of the page is let go: what it bound (its form reset
// subscription among them) goes with it, so a removed field leaves nothing
// (gate 36). One moved within the page is connected again by the time this
// runs and stays bound.


function releaseRemovedInputs(node) {
  if (!(node instanceof Element) || node.isConnected) return;
  if (node.matches?.(INPUT_SELECTOR)) unbindInput(node);
  node.querySelectorAll?.(INPUT_SELECTOR).forEach(root => unbindInput(root));
}

const inputObserver = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    mutation.removedNodes.forEach(releaseRemovedInputs);
    mutation.addedNodes.forEach(node => {
      // Added and taken out again before this ran (a window's portal moving
      // its content, an instance removed at once): nothing to bind. Bound
      // detached, no removal would ever let it go (gate 36, 2026-11-12).
      if (!(node instanceof Element) || !node.isConnected) return;

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

/***/ "151a293c8c90"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ariaKeyShortcuts: () => (/* binding */ ariaKeyShortcuts),
/* harmony export */   isApplePlatform: () => (/* binding */ isApplePlatform),
/* harmony export */   isCommandShortcut: () => (/* binding */ isCommandShortcut),
/* harmony export */   isEditableTarget: () => (/* binding */ isEditableTarget),
/* harmony export */   matchesShortcut: () => (/* binding */ matchesShortcut),
/* harmony export */   parseShortcut: () => (/* binding */ parseShortcut),
/* harmony export */   shortcutCaps: () => (/* binding */ shortcutCaps),
/* harmony export */   shortcutView: () => (/* binding */ shortcutView)
/* harmony export */ });
// A key combination as a `shortcut` setting writes it (sf-button, an entry
// of sf-menu-context, a row of sf-search): words joined by +, the modifiers
// first and the key last -- mod+k, shift+/, /, escape. `mod` is the
// platform's command modifier: Cmd on Apple platforms, Ctrl elsewhere. Read
// once per render; nothing here holds state.
//
// The kbd component owns how a combination reads (owner decision 2026-11-07,
// docs review R030, rule C04): on an Apple platform the modifiers are glyphs
// in the platform's order, side by side (⇧⌘P); elsewhere they are words in
// Ctrl+Shift+P order, and shortcutView() says to join them with + -- the kbd
// sheet shows the joins where keys are plain glyphs (a menu row, a tooltip)
// and hides them between caps, which stand apart. A host renders the view
// and never styles the keys.
const MODIFIERS = ['mod', 'ctrl', 'alt', 'shift', 'meta']; // What a person reads on a key cap, per platform.

const MAC_CAPS = {
  mod: '⌘',
  meta: '⌘',
  ctrl: '⌃',
  alt: '⌥',
  shift: '⇧'
};
const OTHER_CAPS = {
  mod: 'Ctrl',
  meta: 'Win',
  ctrl: 'Ctrl',
  alt: 'Alt',
  shift: 'Shift'
}; // A cap of one character -- a letter, ⌘, ⇧, ↵ -- is a square key; a cap of
// several letters (Esc, Ctrl, Shift) hugs its word (sheet:
// .sf-button-shortcut-key--square). A modifier's cap is the platform's own
// word, so a page printed on a Mac and drawn on Windows widens by the
// difference: the keys are true to their caps, not to the widest platform
// (docs review R010, 2026-11-06).

const KEY_CAPS = {
  enter: '↵',
  return: '↵',
  escape: 'Esc',
  esc: 'Esc',
  tab: 'Tab',
  space: 'Space',
  backspace: '⌫',
  delete: 'Del',
  up: '↑',
  down: '↓',
  left: '←',
  right: '→',
  arrowup: '↑',
  arrowdown: '↓',
  arrowleft: '←',
  arrowright: '→',
  home: 'Home',
  end: 'End',
  pageup: 'PgUp',
  pagedown: 'PgDn'
}; // An Apple keyboard's own signs where they differ (component.kbd 1.3.3, CM-9
// of ui-control research 2026-11-14-context-menu): forward delete is ⌦, as
// macOS menus print it; Del is a Windows word.

const MAC_KEY_CAPS = {
  delete: '⌦'
}; // The names of KeyboardEvent.key for the words above.

const KEY_NAMES = {
  enter: 'Enter',
  return: 'Enter',
  escape: 'Escape',
  esc: 'Escape',
  tab: 'Tab',
  space: ' ',
  backspace: 'Backspace',
  delete: 'Delete',
  up: 'ArrowUp',
  down: 'ArrowDown',
  left: 'ArrowLeft',
  right: 'ArrowRight',
  arrowup: 'ArrowUp',
  arrowdown: 'ArrowDown',
  arrowleft: 'ArrowLeft',
  arrowright: 'ArrowRight',
  home: 'Home',
  end: 'End',
  pageup: 'PageUp',
  pagedown: 'PageDown'
}; // KeyboardEvent.code of the punctuation a shortcut is usually written with,
// so the combination is heard on any keyboard layout.

const PUNCTUATION_CODES = {
  '/': 'Slash',
  '.': 'Period',
  ',': 'Comma',
  ';': 'Semicolon',
  "'": 'Quote',
  '[': 'BracketLeft',
  ']': 'BracketRight',
  '-': 'Minus',
  '=': 'Equal',
  '`': 'Backquote',
  '\\': 'Backslash'
};
function isApplePlatform() {
  const platform = globalThis.navigator?.userAgentData?.platform || globalThis.navigator?.platform || '';
  return /mac|iphone|ipad|ipod/iu.test(platform);
}
/**
 * The combination as parts: `{modifiers: Set, key}`, or null when there is
 * none. `+` as the key itself is written `mod+plus`.
 */

function parseShortcut(value) {
  const text = String(value ?? '').trim().toLowerCase();
  if (!text) return null;
  const words = text === '+' ? ['+'] : text.split('+').map(word => word.trim()).filter(Boolean);
  if (!words.length) return null;
  const key = words.at(-1) === 'plus' ? '+' : words.at(-1);
  const modifiers = new Set(words.slice(0, -1).filter(word => MODIFIERS.includes(word)));
  return {
    modifiers,
    key
  };
}
/**
 * What the keys read, one cap per key in the platform's words: {text, square},
 * square when the cap is one character.
 */

function shortcutCaps(parsed, apple = isApplePlatform()) {
  if (!parsed) return [];
  const caps = apple ? MAC_CAPS : OTHER_CAPS;
  const order = apple ? ['ctrl', 'alt', 'shift', 'mod', 'meta'] : ['mod', 'ctrl', 'meta', 'alt', 'shift'];
  const modifiers = [];

  for (const name of order.filter(one => parsed.modifiers.has(one))) {
    // On a Mac mod and meta are one key.
    if (modifiers.includes(caps[name])) continue;
    modifiers.push(caps[name]);
  }

  const key = (apple ? MAC_KEY_CAPS[parsed.key] : undefined) ?? KEY_CAPS[parsed.key] ?? (parsed.key.length === 1 ? parsed.key.toUpperCase() : parsed.key.charAt(0).toUpperCase() + parsed.key.slice(1));
  return [...modifiers, key].map(text => ({
    text,
    square: [...text].length === 1
  }));
} // A function key (F1-F24) reads as its name.

const FUNCTION_KEY = /^f(?:[1-9]|1[0-9]|2[0-4])$/u; // Whether a written value is the notation above rather than text a page
// already wrote for people (⇧⌘L, «Ctrl K»): every word but the last a
// modifier, the last one character, a named key or a function key.

function isNotation(value) {
  const text = String(value ?? '').trim().toLowerCase();
  if (!text || /\s/u.test(text.replace(/\s*\+\s*/gu, '+'))) return false;
  if (text === '+') return true;
  const words = text.split('+').map(word => word.trim());
  if (words.some(word => !word)) return false;
  const key = words.at(-1) === 'plus' ? '+' : words.at(-1);
  return words.slice(0, -1).every(word => MODIFIERS.includes(word)) && ([...key].length === 1 || key in KEY_CAPS || FUNCTION_KEY.test(key));
}
/**
 * What a host draws for a `shortcut` value: {keys: [{text, square}], join},
 * the keys in this platform's words and whether they are joined with + (not
 * on an Apple platform, and only between keys). A value that is not the
 * notation -- text a page wrote for people, such as ⇧⌘L -- is one key of
 * that text. Empty: no keys.
 */


function shortcutView(value, apple = isApplePlatform()) {
  const text = String(value ?? '').trim();
  if (!text) return {
    keys: [],
    join: false
  };
  if (!isNotation(text)) return {
    keys: [{
      text,
      square: [...text].length === 1
    }],
    join: false
  };
  const keys = shortcutCaps(parseShortcut(text), apple);
  return {
    keys,
    join: !apple && keys.length > 1
  };
}
/** The value of aria-keyshortcuts (WAI-ARIA 1.2): Meta+K, Control+K, /. */

function ariaKeyShortcuts(parsed, apple = isApplePlatform()) {
  if (!parsed) return '';
  const names = [];
  if (parsed.modifiers.has('ctrl') || parsed.modifiers.has('mod') && !apple) names.push('Control');
  if (parsed.modifiers.has('alt')) names.push('Alt');
  if (parsed.modifiers.has('shift')) names.push('Shift');
  if (parsed.modifiers.has('meta') || parsed.modifiers.has('mod') && apple) names.push('Meta');
  const key = KEY_NAMES[parsed.key] ?? (parsed.key === ' ' ? 'Space' : parsed.key.length === 1 ? parsed.key.toUpperCase() : parsed.key);
  return [...names, key === ' ' ? 'Space' : key].join('+');
} // Whether the event's key is the combination's key: by the character it
// typed, or by the physical key for a letter, a digit or the punctuation
// above, so mod+k is heard on a Russian layout too.

function sameKey(event, key) {
  const name = KEY_NAMES[key];
  if (name) return event.key === name;
  if (String(event.key).toLowerCase() === key) return true;
  if (/^[a-z]$/u.test(key)) return event.code === `Key${key.toUpperCase()}`;
  if (/^[0-9]$/u.test(key)) return event.code === `Digit${key}`;
  return PUNCTUATION_CODES[key] !== undefined && event.code === PUNCTUATION_CODES[key];
}
/** Whether a keydown is the combination. */


function matchesShortcut(event, parsed, apple = isApplePlatform()) {
  if (!parsed || !event) return false;
  const wants = {
    ctrl: parsed.modifiers.has('ctrl') || parsed.modifiers.has('mod') && !apple,
    meta: parsed.modifiers.has('meta') || parsed.modifiers.has('mod') && apple,
    alt: parsed.modifiers.has('alt'),
    shift: parsed.modifiers.has('shift')
  };
  if (Boolean(event.ctrlKey) !== wants.ctrl || Boolean(event.metaKey) !== wants.meta || Boolean(event.altKey) !== wants.alt) return false; // Shift is part of typing a punctuation mark on many layouts (? is shift+/):
  // a combination that does not name it does not mind it for punctuation, and
  // minds it for a letter, a digit or a named key.

  const punctuation = parsed.key.length === 1 && !/^[a-z0-9]$/u.test(parsed.key);
  if (!punctuation && Boolean(event.shiftKey) !== wants.shift) return false;
  if (punctuation && wants.shift && !event.shiftKey) return false;
  return sameKey(event, parsed.key);
}
/** A combination with mod, ctrl, alt or meta is a command even in a field. */

function isCommandShortcut(parsed) {
  return Boolean(parsed) && ['mod', 'ctrl', 'alt', 'meta'].some(name => parsed.modifiers.has(name));
}
/** Whether focus is where a person types: a field, a select or editable text. */

function isEditableTarget(target) {
  const element = target instanceof Element ? target : null;
  if (!element) return false;
  if (element.isContentEditable) return true;
  const tag = element.localName;
  if (tag === 'textarea' || tag === 'select') return true;
  if (tag !== 'input') return false;
  const type = (element.getAttribute('type') || 'text').toLowerCase();
  return !['button', 'submit', 'reset', 'checkbox', 'radio', 'range', 'color', 'file', 'image', 'hidden'].includes(type);
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

/***/ "76b2d9a8d7c6"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   COUNT_FROM: () => (/* binding */ COUNT_FROM),
/* harmony export */   charCount: () => (/* binding */ charCount),
/* harmony export */   countAnnouncement: () => (/* binding */ countAnnouncement),
/* harmony export */   countLimit: () => (/* binding */ countLimit)
/* harmony export */ });
// The character count of a text field with a limit (owner decision C141 (1),
// the rule sf-chat-composer keeps in ui-pro): one rule for every field that
// counts, so the message box, the multi-line field and the formatted text
// say the same thing at the same moment.
//
// - The count shows from 80 % of the limit (0.8 x limit characters and
//   more: at 80 of 100), or always when the field asks for it (`counter`).
// - Past the limit the count and the field's frame are the error colour and
//   the field is invalid (too-long), so its form is not sent; the text is
//   never cut: the person decides what to take out.
// - A polite line speaks only when a threshold is crossed (near, over, back
//   under), never on every key.
//
// The field draws the count at the end of its message line (the hint's or
// the error's), in the message's text and colour with digits of one width.

/** The share of the limit from which the count shows. */
const COUNT_FROM = 0.8;
/** A limit as a positive whole number, or null when there is none. */

function countLimit(value) {
  const number = Math.trunc(Number(value));
  return Number.isFinite(number) && number > 0 ? number : null;
}
/**
 * Where a text of `length` characters stands against `limit`:
 * {limit, length, near, over, shown, level}. `level` is '', 'near' or
 * 'over'; `shown` says whether the count is drawn (near, over, or `always`).
 * Without a limit nothing is counted.
 */

function charCount(length, limit, {
  always = false
} = {}) {
  const max = countLimit(limit);
  const count = Math.max(0, Number(length) || 0);
  if (max === null) return {
    limit: null,
    length: count,
    near: false,
    over: false,
    shown: false,
    level: ''
  };
  const near = count >= max * COUNT_FROM;
  const over = count > max;
  return {
    limit: max,
    length: count,
    near,
    over,
    shown: Boolean(always) || near,
    level: over ? 'over' : near ? 'near' : ''
  };
}
/**
 * What the polite line says now: the count's words when its level changed
 * since `lastLevel`, else `lastSaid` as it was. Returns {level, said}; the
 * component keeps both for the next call.
 */

function countAnnouncement(state, lastLevel, lastSaid, words) {
  if (state.level === (lastLevel || '')) return {
    level: state.level,
    said: lastSaid || ''
  };
  return {
    level: state.level,
    said: state.level ? words(state) : ''
  };
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

/***/ "f39dc444b059"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fieldHelpLabel: () => (/* binding */ fieldHelpLabel),
/* harmony export */   fieldHelpSize: () => (/* binding */ fieldHelpSize),
/* harmony export */   renderFieldHelp: () => (/* binding */ renderFieldHelp)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
 // The «?» after a field's label (owner decision C153 (8), C133's look): the
// `help` setting of every member of the field family draws sf-help-mark after
// the label text and its required mark. The mark stands a step below the
// value, as the label does -- 1/3 under the small steps, 1/2 from size 1 up --
// and each sheet holds it to the label's line, so the label row keeps its
// height. Its button is named by its subject (the component's word `help`,
// «Подробнее: {label}»). A press on it opens the explanation and never reaches
// the label row, whose own press focuses the field.

const HELP_SIZE = Object.freeze({
  '1/3': '1/3',
  '1/2': '1/3',
  1: '1/2',
  2: '1/2',
  3: '1/2'
});
/** The help mark's step for a field of `size`. */

function fieldHelpSize(size) {
  return HELP_SIZE[size] || '1/2';
}
/** The mark's name: the component's `help` word with the label, or the mark's own default. */

function fieldHelpLabel(component, label) {
  if (!label || typeof component?.sfWord !== 'function') return '';
  return component.sfWord('help', {
    vars: {
      label
    }
  });
}
/** sf-help-mark for `help`, or nothing without one. */

function renderFieldHelp({
  help,
  label = '',
  size = '1',
  className = '',
  component = null
} = {}) {
  if (!help) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-help-mark
    class=${className || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    size=${fieldHelpSize(size)}
    text=${help}
    label=${fieldHelpLabel(component, label) || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    @click=${event => event.stopPropagation()}
  ></sf-help-mark>`;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

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
/* harmony import */ var _core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("e92fd2d1a38c");
/* harmony import */ var _inherited_value_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("c6c9dfe31af4");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_1__, _core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_2__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_1__, _core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_2__);



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
  }
}; // Each control declares the three in its own props -- inherited-value,
// inherited-text and reset-label -- written out rather than spread from here, so
// the manifest check that reads a component's props sees them.
// The marker is one step down the ladder from the field it sits in, so it
// reads as a note about the value. (The reset was a button of that step too,
// a 32px button in a 40px field; since C123 it is the field's own action at
// the field's glyph size, see renderInheritedSlot.)
// sf-input's outer steps: a 3 field's marker is a 2; 1/3 is the ladder's
// foot, so its marker stays at 1/3.

const STEP_DOWN = Object.freeze({
  '1/3': '1/3',
  '1/2': '1/3',
  '1': '1/2',
  '2': '1',
  '3': '2'
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

    this.syncInheritedNote(control, inherited);
  } // A browser reads aria-describedby instead of aria-description, so a field
  // that also has a hint, an error or a description (aria-describedby) would
  // say those and drop the inherited sentence. While the inherited state
  // applies and something else describes the control, the sentence is also a
  // hidden note in the host that aria-describedby names after the ids already
  // there. Written once here for the whole family (sf-input, sf-textarea,
  // sf-quantity, sf-dropdown, sf-color, sf-switch); the id comes from the
  // instance path, never a counter.


  syncInheritedNote(control, inherited) {
    let note = this.querySelector(':scope > [data-sf-inherited-note]');
    const others = String(control.getAttribute('aria-describedby') || '').split(/\s+/u).filter(id => id && id !== note?.id);

    if (inherited && others.length && this.isConnected) {
      if (!note) {
        note = document.createElement('span');
        note.hidden = true;
        note.setAttribute('data-sf-inherited-note', '');
        this.append(note);
      }

      if (!note.id) note.id = (0,_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_2__.partId)((0,_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_2__.instancePath)(this, {
        kind: this.localName
      }), 'inherited');
      note.textContent = this.inheritedDescription();
      const ids = [...others, note.id].join(' ');
      if (control.getAttribute('aria-describedby') !== ids) control.setAttribute('aria-describedby', ids);
    } else if (note) {
      note.remove();
      if (others.length) control.setAttribute('aria-describedby', others.join(' '));else control.removeAttribute('aria-describedby');
    }
  }

};
/**
 * The marker and the reset, for a control's trailing slot. Nothing at all
 * without an inherited value, so a field that does not use it is unchanged.
 *
 * The reset is an action of the field (owner decision C123, variant A): the
 * field layer's .sf-field-action (component.inputs), the glyph sf-input's
 * clear and reveal draw -- no plate in any state, the quiet ink at rest and the
 * text's ink under the pointer and on a press, the keyboard ring round the
 * glyph, an invisible hit area. Its glyph is the field's leading-icon size
 * (the field's text line), not a step down; the marker keeps the step down.
 * Each field says its step through --sf-field-action--glyph, --height and
 * --inset (inherited-value.css). It was a link icon button of the step below.
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
        class="sf-field-action sf-field-reset"
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
/* harmony import */ var _helpers_char_count__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("76b2d9a8d7c6");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("5c571b560382");
/* harmony import */ var _helpers_cycle__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("64feefebb417");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("fc92d2bbc3ce");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("b0558b1b8eb0");
/* harmony import */ var _lang_index_mjs__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("b183c9b75681");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_component_inputs_js_inputs__WEBPACK_IMPORTED_MODULE_0__, _core_js_smart_base__WEBPACK_IMPORTED_MODULE_1__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2__, _component_field_size__WEBPACK_IMPORTED_MODULE_3__, _helpers_inherited_value__WEBPACK_IMPORTED_MODULE_4__, _js_templates_default__WEBPACK_IMPORTED_MODULE_7__]);
([_component_inputs_js_inputs__WEBPACK_IMPORTED_MODULE_0__, _core_js_smart_base__WEBPACK_IMPORTED_MODULE_1__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2__, _component_field_size__WEBPACK_IMPORTED_MODULE_3__, _helpers_inherited_value__WEBPACK_IMPORTED_MODULE_4__, _js_templates_default__WEBPACK_IMPORTED_MODULE_7__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2__);











 // Only the words on screen ship in the bundle, English only (owner decision
// C282): Russian and every other language come from a language file. The
// title, settings and events stay in the language files for the Studio and the
// docs (localization study LC-2).
// sf-input from its component.json (standard simai.smart-component 1.3.8 §3,
// §4, §17, §20). The settings are made by core/js/element-manifest.js; the
// legacy names `type` (appearance), `error` (invalid, §17.2), `left-icon`
// (icon-start) and `right-text` (text-end) are dated aliases (aliases.json),
// and so is the trait's old event sf-field:reset (sf-field-reset). The host is
// the form control through ElementInternals: it submits the text, reports the
// native input's validity, and the native input carries no name (§17.1).

const InputElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_9__, {
  base: (0,_helpers_inherited_value__WEBPACK_IMPORTED_MODULE_4__.InheritedValueField)((_core_js_smart_base__WEBPACK_IMPORTED_MODULE_1___default())),
  lang: _lang_index_mjs__WEBPACK_IMPORTED_MODULE_11__.files,
  source: 'ru',
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_10__
});

class SfInput extends (0,_helpers_form_field__WEBPACK_IMPORTED_MODULE_5__.ShownValidity)((0,_helpers_form_field__WEBPACK_IMPORTED_MODULE_5__.FormField)(InputElement)) {
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
    this._boundRoot = null; // The password reveal (C123 (5)): the field's own state, not a setting.

    this._revealed = false; // The clear shows while the field holds a value: typing, a paste or the
    // page's own input event say so (C123 (6)).

    this.addEventListener('input', () => {
      this.syncClearAction(); // The count follows the text (C153 (10), C141 (1)): every edit of a
      // field with a limit redraws the count and, at a threshold, the frame.

      if (this.countLimit !== null) this.requestComponentUpdate?.('count');
    }); // Escape empties a field that can be cleared -- clearable, or a search
    // field -- when it holds a value (C153 (6)): the clear glyph is no Tab
    // stop, so the key is the keyboard's way to it. An empty field lets the
    // key go on (a window closes, a list folds).

    this.addEventListener('keydown', event => this.clearFromKey(event));
    this._countLevel = '';
    this._countSaid = ''; // The Caps Lock hint of a password field (C191 (3)): every key, on its way
    // down and up, and a click in the field say whether Caps Lock is on
    // (getModifierState); leaving the field takes the hint away.

    this._capsLock = false;

    const capsFrom = event => this.syncCapsLock(event);

    this.addEventListener('keydown', capsFrom);
    this.addEventListener('keyup', capsFrom);
    this.addEventListener('click', capsFrom);
    this.addEventListener('focusout', event => {
      if (event.target === this.getInputElement()) this.setCapsLock(false);
    }); // A revealed password hides again when its form is sent (C191 (1)),
    // whether the page lets the browser send it or sends it itself.

    this._hideOnSubmit = event => this.hideRevealOnSubmit(event);
  }

  clearFromKey(event) {
    if (event.key !== 'Escape' || event.defaultPrevented || event.isComposing) return;
    if (event.target !== this.getInputElement()) return;
    if (this.disabled || this.readonly) return;
    if (!(this.clearable || this.inputType === 'search')) return;
    if (!(this.getInputElement()?.value || '')) return;
    event.preventDefault();
    event.stopPropagation();
    this.clearOwnValue();
    this.syncClearAction();
  } // The limit the field counts against (C153 (10)): maxlength, counted and
  // never cut, as sf-input-textarea's (C141 (1)). A masked field keeps the
  // native limit: the mask decides its length.


  get countLimit() {
    if (this.mask) return null;
    const value = Math.trunc(Number(this.getAttribute('maxlength')));
    return Number.isFinite(value) && value > 0 ? value : null;
  }

  sfCount() {
    return (0,_helpers_char_count__WEBPACK_IMPORTED_MODULE_6__.charCount)((this.getInputElement()?.value ?? this.getAttribute('value') ?? '').length, this.countLimit, {
      always: Boolean(this.counter)
    });
  } // What the template draws of the count, and the polite line, which changes
  // only when a threshold is crossed.


  sfCountView() {
    const count = this.sfCount();

    const words = state => this.sfWord('count-text', {
      vars: {
        count: state.length,
        max: state.limit
      }
    });

    const said = (0,_helpers_char_count__WEBPACK_IMPORTED_MODULE_6__.countAnnouncement)(count, this._countLevel, this._countSaid, state => state.over ? this.sfTooLongMessage(state) : words(state));
    this._countLevel = said.level;
    this._countSaid = said.said;
    return {
      over: count.over,
      text: count.shown ? words(count) : '',
      said: said.said
    };
  }

  sfTooLongMessage(count) {
    return this.sfWord('too-long', {
      vars: {
        max: count.limit
      }
    });
  }

  get maxlength() {
    return this.countLimit;
  } // The native input's validity, and too-long past the counted limit: the
  // native maxlength would cut the text, so the field counts itself.


  sfSyncValidity() {
    const anchor = this.sfValidityAnchor();
    const count = this.sfCount();
    const message = count.over ? this.sfTooLongMessage(count) : '';
    if (!this.sfInternals && anchor?.setCustomValidity) anchor.setCustomValidity(message);
    (0,_helpers_form_field__WEBPACK_IMPORTED_MODULE_5__.syncFieldValidity)(this, anchor, count.over ? {
      tooLong: message
    } : {});
  }

  onConnected() {
    super.onConnected?.(); // Captured on the document: the form owner may be named by the form
    // attribute, and the page's own submit handler may stop the event.

    document.addEventListener('submit', this._hideOnSubmit, true);
  } // The clear (C123 (6)): empties the field the way a reset does -- input,
  // then change, from the native input -- and gives the focus back to it, as
  // the button that had it is gone.


  clearFromButton(event) {
    event?.preventDefault?.();
    event?.stopPropagation?.();
    if (this.disabled || this.readonly) return;
    this.clearOwnValue();
    this.syncClearAction();
    this.getInputElement()?.focus?.();
  } // The password reveal (C123 (4), (5)): a button named by what it does next
  // («Показать пароль» / «Скрыть пароль», no aria-pressed: C12 (3)), the eye
  // crossed out while the password shows. The native input's type follows;
  // the focus stays on the button.


  toggleReveal(event) {
    event?.preventDefault?.();
    event?.stopPropagation?.();
    if (this.disabled) return;
    this._revealed = !this._revealed;
    this.requestComponentUpdate('revealed');
  } // C191 (1): the form this field belongs to is being sent -- the password
  // goes back to dots before the browser takes the page (and a password
  // manager reads the field), so the type changes at once, not at the next
  // drawing.


  hideRevealOnSubmit(event) {
    if (!this._revealed) return;
    const form = this.sfInternals?.form || this.closest('form');
    if (!form || event.target !== form) return;
    this._revealed = false;
    const input = this.getInputElement();
    if (input && input.type !== 'password') input.type = 'password';
    this.requestComponentUpdate('revealed');
  } // C191 (3): Caps Lock while a password is typed. Only the native input's
  // own events count, so the hint is there only while the field has the focus.


  syncCapsLock(event) {
    const input = this.getInputElement();
    if (!input || event.target !== input || typeof event.getModifierState !== 'function') return;
    this.setCapsLock(event.getModifierState('CapsLock'));
  }

  setCapsLock(on) {
    const next = Boolean(on) && this.inputType === 'password' && !this.disabled;
    if (next === this._capsLock) return;
    this._capsLock = next;
    this.requestComponentUpdate('capsLock');
  }

  syncClearAction() {
    const clear = this.querySelector(':scope .sf-input-clear');
    if (!clear) return;
    const empty = !(this.getInputElement()?.value || '');
    if (clear.hidden !== empty) clear.hidden = empty;
  } // sf-input keeps the ladder's outer steps (1/3 and 3) that the other
  // fields retired (field-size.js inputSize).


  get size() {
    return (0,_component_field_size__WEBPACK_IMPORTED_MODULE_3__.inputSize)(this.getAttribute('size') || '1');
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
    this.syncClearAction?.();
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

  get textStart() {
    return this.getAttribute('text-start') ?? '';
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
  } // A form reset puts the default text back without an input event, a task
  // later for a masked field: the clear follows it, and a revealed password
  // is hidden again.


  formResetCallback() {
    super.formResetCallback?.();

    if (this._revealed) {
      this._revealed = false;
      this.requestComponentUpdate('revealed');
    }

    Promise.resolve().then(() => this.syncClearAction());
    setTimeout(() => this.syncClearAction(), 0);
  } // The browser's restore of a form (back, reload) gives the text back.


  formStateRestoreCallback(state) {
    if (typeof state === 'string') this.value = state;
  }

  templateContext() {
    const props = this.getPropsContext();
    const hasControlledValue = this.hasAttribute('value');
    const input = this.getInputElement();
    const count = this.sfCountView();
    return this.createTemplateContext({ ...props,
      // The size the field draws: a retired size is the one it keeps, as
      // the props' closed list alone would read it as the default.
      size: this.size,
      leftIcon: this.iconStart,
      rightText: this.textEnd,
      // Resolved names the template reads (contracts/template-context.json).
      iconStart: this.iconStart,
      textEnd: this.textEnd,
      type: this.appearance,
      maskLazy: this.maskLazy,
      // The page's error, or the required one a failed form check shows
      // (ShownRequired, C55 acceptance F1: as sf-dropdown 1.9.0).
      invalid: this.sfShownInvalid(props.invalid || props.error) || count.over,
      error: false,
      errorMessage: this.sfShownMessage(props.invalid || props.error, props.errorMessage),
      // The host is the form control where the browser has ElementInternals,
      // so the native input carries no name (§17.1 item 6).
      controlName: (0,_helpers_form_field__WEBPACK_IMPORTED_MODULE_5__.innerControlName)(this, props.name),
      value: hasControlledValue ? props.value : input ? input.value : this.defaultValue,
      defaultValue: this.defaultValue,
      hasControlledValue,
      inheritedValue: this.inheritedValue,
      inheritedText: this.inheritedText,
      resetLabel: this.resetLabel,
      revealed: this._revealed && props.inputType === 'password',
      // The «?» after the label (C153 (8), helpers/field-help.js).
      help: props.help || '',
      textStart: this.textStart || '',
      // The count (C153 (10)): its words when shown, over the limit (the
      // error frame), the polite line.
      countable: this.countLimit !== null,
      count: count.text,
      countOver: count.over,
      countSaid: count.said,
      capsLock: this._capsLock && props.inputType === 'password' && !props.disabled,
      component: this
    });
  }

  onDisconnected() {
    document.removeEventListener('submit', this._hideOnSubmit, true);
    this._capsLock = false;

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
      const invalid = this.sfShownInvalid(this.invalid) || this.sfCount().over;

      this._boundRoot.classList.toggle('error', invalid);

      this.getInputElement()?.classList.toggle('error', invalid);
      (0,_component_inputs_js_inputs__WEBPACK_IMPORTED_MODULE_0__.bindInput)(this._boundRoot);
    } // The reveal's other glyph is asked for with the first drawing, so the
    // crossed eye is there on the first press (as sf-button-copy's check).


    if (this.querySelector(':scope .sf-input-reveal')) (0,_helpers_cycle__WEBPACK_IMPORTED_MODULE_8__.preloadControlIcons)(this, ['visibility', 'visibility_off']);
    this.syncInheritedState();
    this.syncClearAction();
    this.sfSyncFormState();
  }

  getInputElement() {
    return this.querySelector('.sf-input-field input, input');
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_7__.renderInputTemplate)(this.templateContext());
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
/* harmony import */ var _helpers_field_help__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("f39dc444b059");
/* harmony import */ var _component_field_contract__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("e138a730fd7c");
/* harmony import */ var _component_field_size__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("e6d86f2cd058");
/* harmony import */ var _helpers_inherited_value__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("778671c79fa6");
/* harmony import */ var _component_kbd_js_shortcut__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("151a293c8c90");
/* harmony import */ var _default_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("38b38b744888");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, _helpers_field_help__WEBPACK_IMPORTED_MODULE_1__, _component_field_contract__WEBPACK_IMPORTED_MODULE_2__, _component_field_size__WEBPACK_IMPORTED_MODULE_3__, _helpers_inherited_value__WEBPACK_IMPORTED_MODULE_4__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, _helpers_field_help__WEBPACK_IMPORTED_MODULE_1__, _component_field_contract__WEBPACK_IMPORTED_MODULE_2__, _component_field_size__WEBPACK_IMPORTED_MODULE_3__, _helpers_inherited_value__WEBPACK_IMPORTED_MODULE_4__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);






 // A label written into the label slot keeps the label's look (text inputs
// study 2026-11-14, TI-24): its words stand in .sf-input-text, as the label
// setting's do, so they take the label's step, line and ink rather than the
// page's (16 on 24 in the text ink, the row 4 taller at size 1). A help mark
// written beside them stays a child of the label row, where the C33 / C133
// rules place it after the last word.

function isHelpMark(node) {
  return node?.nodeType === 1 && (node.localName === 'sf-help-mark' || node.classList?.contains('sf-help-mark'));
}

function slottedLabel(content) {
  const nodes = (Array.isArray(content) ? content : [content]).filter(node => node != null && node !== lit__WEBPACK_IMPORTED_MODULE_0__.nothing);
  const text = nodes.filter(node => !isHelpMark(node));
  const marks = nodes.filter(isHelpMark);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${text.length ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-input-text">${text}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}${marks}`;
}

function renderInputTemplate(context) {
  const {
    size,
    radius,
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
    min,
    max,
    step,
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
    ariaLabel,
    shortcut,
    clearable,
    revealed,
    help,
    textStart,
    count = '',
    countOver = false,
    countSaid = '',
    countable = false,
    capsLock
  } = context; // The shortcut's keys (C04, C38): the kbd component's, read in this
  // platform's words; the field draws them at its end and never styles them.
  // The native input says the combination in aria-keyshortcuts.

  const {
    keys: shortcutKeys,
    join: shortcutJoin
  } = (0,_component_kbd_js_shortcut__WEBPACK_IMPORTED_MODULE_5__.shortcutView)(shortcut);
  const keyShortcuts = (0,_component_kbd_js_shortcut__WEBPACK_IMPORTED_MODULE_5__.ariaKeyShortcuts)((0,_component_kbd_js_shortcut__WEBPACK_IMPORTED_MODULE_5__.parseShortcut)(shortcut));
  const maskLazyValue = maskLazy === '' ? '' : String(maskLazy); // A number field (1.5.0) takes the native range and step; other types do
  // not carry them.

  const isNumber = inputType === 'number';
  const numberMin = isNumber && min !== '' && min != null ? min : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const numberMax = isNumber && max !== '' && max != null ? max : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const numberStep = isNumber && step !== '' && step != null ? step : lit__WEBPACK_IMPORTED_MODULE_0__.nothing; // While the field holds nothing of its own, the inherited value is what the
  // empty field shows, in the placeholder's ink -- never as its value.

  const shownPlaceholder = context.inheritedValue || placeholder;
  const inheritedSlot = (0,_helpers_inherited_value__WEBPACK_IMPORTED_MODULE_4__.renderInheritedSlot)(context.component, {
    size,
    disabled: disabled || readonly
  });
  const inputValue = hasControlledValue ? value : defaultValue; // The actions inside the field (owner decision C123): glyphs without a plate,
  // the field layer's .sf-field-action, from the text to the edge: clear, then
  // the password reveal. A search field's clear is the Framework's in place of
  // the browser's own; any other field has it with clearable. Neither is drawn
  // where the person cannot change the value.

  const editable = !disabled && !readonly;
  const isPassword = inputType === 'password';
  const showClear = editable && (clearable || inputType === 'search');
  const nativeType = isPassword && revealed ? 'text' : inputType;
  const clearWord = context.component?.sfWord?.('clear') || 'Clear'; // The reveal's name says what a press does next (C12 (3), C123 (4)): «Показать
  // пароль» while the password is hidden, «Скрыть пароль» while it shows. A
  // name that changes carries no aria-pressed -- the field-renderers' password
  // eye said it so, and since TI-7 it is this one.

  const revealWord = revealed ? context.component?.sfWord?.('conceal') || 'Hide password' : context.component?.sfWord?.('reveal') || 'Show password'; // C191 (3): while the focused password field types with Caps Lock on, a line
  // in the hint's place and type says so; a polite live region after the
  // label says it to assistive technology (the line itself is not read twice).

  const capsWord = isPassword && !disabled ? context.component?.sfWord?.('caps-lock') || 'Caps Lock is on' : '';
  const capsLine = capsLock && capsWord ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-input-hint-text-wrap sf-input-caps" data-field-message="caps" aria-hidden="true">${capsWord}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const capsSaid = capsWord ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-input-caps-said" role="status" aria-live="polite" aria-atomic="true">${capsLock ? capsWord : ''}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const actionsContent = (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    ${showClear ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<button
          type="button"
          class="sf-field-action sf-input-clear"
          data-action="clear"
          aria-label=${clearWord}
          tabindex="-1"
          ?hidden=${!String(value ?? '')}
          @click=${event => context.component?.clearFromButton?.(event)}
        ><sf-icon icon="close" aria-hidden="true"></sf-icon></button>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    ${isPassword && !disabled ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<button
          type="button"
          class="sf-field-action sf-input-reveal"
          data-action="reveal"
          aria-label=${revealWord}
          @click=${event => context.component?.toggleReveal?.(event)}
        ><sf-icon icon=${revealed ? 'visibility_off' : 'visibility'} aria-hidden="true"></sf-icon></button>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
  `;
  const field = (0,_component_field_contract__WEBPACK_IMPORTED_MODULE_2__.createFieldContract)(context.component, {
    prefix: 'sf-input',
    required,
    invalid: invalid || error,
    hint,
    errorMessage
  });
  const rootClasses = ['sf-input', field.invalid ? 'error' : '', `sf-input--size-${size}`, // plain (C313 (4)) is drawn on the bordered look, which gives it its
  // type and states; its own class takes the frame away.
  `sf-input--${appearance === 'plain' ? 'bordered sf-input--plain' : appearance ?? type}`, countOver ? 'sf-input--over' : '', radius && radius !== 'default' ? `sf-input--radius-${radius}` : '', rootClass, 'flex', 'flex-col', // The field's width (C396, WM-4): its class only when it has one, so a
  // field without the setting draws the same markup as before.
  ...[(0,_component_field_size__WEBPACK_IMPORTED_MODULE_3__.fieldWidthClass)(context.width)].filter(Boolean)];

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
  } // The «?» after the label (C153 (8), C133's look, helpers/field-help.js):
  // the help setting's text behind sf-help-mark, a step below the value as the
  // label is; the label row keeps its height.


  const helpMark = (0,_helpers_field_help__WEBPACK_IMPORTED_MODULE_1__.renderFieldHelp)({
    help,
    label,
    size,
    className: 'sf-input-help',
    component: context.component
  });
  const labelContent = context.component?.hasSlotContent?.('label') ? slottedLabel(context.component.getSlotContent('label')) : label ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
            <span class="sf-input-text">${label}</span>
            ${required ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-input-required" aria-hidden="true">*</span>` : ''}
            ${helpMark}
          ` // No label, no label row. A lone star above a control names nothing --
  // the control's own `required` is what tells a reader and assistive
  // technology that it must be filled in -- and the row it stood in came
  // out as an empty line over every required control in a panel whose
  // labels are drawn beside them.
  : '';
  const leftContent = context.component?.hasSlotContent?.('start') ? context.component.getSlotContent('start') : context.component?.hasSlotContent?.('left') ? context.component.getSlotContent('left') : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${leftIcon ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-input-left flex"><sf-icon icon="${leftIcon}"></sf-icon></span>` : ''}${textStart ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-input-start" aria-hidden="true">${textStart}</span>` : ''}`;
  const rightContent = context.component?.hasSlotContent?.('end') ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${actionsContent}${context.component.getSlotContent('end')}` : context.component?.hasSlotContent?.('right') ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${actionsContent}${context.component.getSlotContent('right')}` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
          ${rightText ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-input-right"><span class="sf-input-text">${rightText}</span></span>` : ''}
          ${actionsContent}
          ${shortcutKeys.length ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-input-right sf-input-shortcut" aria-hidden="true"><kbd class="sf-kbd--group">${shortcutKeys.map((key, at) => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${at && shortcutJoin ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-kbd-join">+</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}<kbd class=${key.square ? 'sf-kbd--square' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>${key.text}</kbd>`)}</kbd></span>` : ''}
          ${hintIcon ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-input-hint flex"><sf-icon icon="${hintIcon}"></sf-icon></span>` : ''}
        `;
  const hintContent = context.component?.hasSlotContent?.('hint') ? context.component.getSlotContent('hint') : hint;
  const errorContent = context.component?.hasSlotContent?.('error') ? context.component.getSlotContent('error') : errorMessage;
  const messageContent = field.invalid && errorContent ? errorContent : hintContent; // The visible label names the control through the wrapping <label>; with no
  // visible label there is nothing to name it, so the host's aria-label lands on
  // the native input. Both at once would make the name say one thing and the
  // page another.

  const accessibleName = !labelContent && ariaLabel ? ariaLabel : lit__WEBPACK_IMPORTED_MODULE_0__.nothing; // The count stands at the end of the message line (C153 (10), C141 (1)), so
  // the line is drawn for it alone too; the input is described by both. The
  // start text is said with the value's description, not read as typed text.

  const countId = `${field.messageId}-count`;
  const startId = `${field.messageId}-start`;
  const describedBy = [textStart && !context.component?.hasSlotContent?.('start') && !context.component?.hasSlotContent?.('left') ? startId : '', messageContent ? field.messageId : '', count ? countId : ''].filter(Boolean).join(' ');
  const messageNode = messageContent ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span
        id=${field.messageId}
        class="sf-input-hint-text-wrap"
        data-field-message=${field.invalid && errorContent ? 'error' : 'hint'}
      >${messageContent}</span>` : '';
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
                type=${nativeType}
                autocomplete=${autocomplete || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                inputmode=${inputmode || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                minlength=${minlength === '' ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : minlength}
                maxlength=${maxlength === '' || countable ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : maxlength}
                pattern=${pattern || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                min=${numberMin}
                max=${numberMax}
                step=${numberStep}
                placeholder=${shownPlaceholder}
                .value=${value}
                .defaultValue=${defaultValue}
                name=${controlName || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ?disabled=${disabled}
                ?readonly=${readonly}
                ?required=${field.required}
                aria-label=${accessibleName}
                aria-keyshortcuts=${keyShortcuts || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                aria-invalid=${field.invalid ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                aria-describedby=${describedBy || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
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
                type=${nativeType}
                autocomplete=${autocomplete || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                inputmode=${inputmode || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                minlength=${minlength === '' ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : minlength}
                maxlength=${maxlength === '' || countable ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : maxlength}
                pattern=${pattern || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                min=${numberMin}
                max=${numberMax}
                step=${numberStep}
                placeholder=${shownPlaceholder}
                .defaultValue=${inputValue}
                .value=${value}
                name=${controlName || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ?disabled=${disabled}
                ?readonly=${readonly}
                ?required=${field.required}
                aria-label=${accessibleName}
                aria-keyshortcuts=${keyShortcuts || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                aria-invalid=${field.invalid ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                aria-describedby=${describedBy || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
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

      ${count ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-input-message flex">${messageNode}<span id=${countId} class="sf-input-count">${count}</span></span>` : messageNode}${capsLine}
      ${textStart ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span id=${startId} class="sf-input-said" hidden>${textStart}</span>` : ''}
    </label>${countable ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-input-count-said" aria-live="polite">${countSaid}</span>` : ''}${capsSaid}
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

/***/ "b183c9b75681"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   files: () => (/* binding */ files)
/* harmony export */ });
/* harmony import */ var _en_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("e9f1da81a45b");
// Written by scripts/build-language-packs.mjs from src/core/lang/built-in.json
// (owner decision C282); do not edit. The words this bundle carries: the
// built-in languages' (en); every other language comes from
// a language file (core/lang/<code>.js or its parts).


const files = { en: { runtime: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime } };

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ en: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime });


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

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.input","tag":"sf-input","version":"1.17.0","kind":"leaf","traits":["field-inherit@1"],"settings":{"size":{"type":"enum","values":["1/3","1/2","1","2","3"],"default":"1"},"width":{"type":"enum","values":["","short","medium","long"],"default":""},"radius":{"type":"enum","values":["","default","square","rounded"],"default":""},"appearance":{"type":"enum","values":["bordered","filled","hidden","plain"],"default":"bordered"},"label":{"type":"string","default":""},"required":{"type":"boolean","default":false},"placeholder":{"type":"string","default":""},"input-type":{"type":"enum","values":["text","email","password","search","tel","url","number"],"default":"text"},"autocomplete":{"type":"string","default":""},"inputmode":{"type":"enum","values":["","none","text","tel","url","email","numeric","decimal","search"],"default":""},"minlength":{"type":"string","default":""},"maxlength":{"type":"string","default":""},"counter":{"type":"boolean","default":false},"pattern":{"type":"string","default":""},"min":{"type":"string","default":""},"max":{"type":"string","default":""},"step":{"type":"string","default":""},"hint":{"type":"string","default":""},"help":{"type":"string","default":""},"default-value":{"type":"string","default":""},"name":{"type":"string","default":""},"icon-start":{"type":"icon","optional":true},"text-start":{"type":"string","optional":true},"text-end":{"type":"string","optional":true},"shortcut":{"type":"string","default":""},"hint-icon":{"type":"icon","default":""},"disabled":{"type":"boolean","default":false},"readonly":{"type":"boolean","default":false},"clearable":{"type":"boolean","default":false},"invalid":{"type":"boolean","default":false},"error-message":{"type":"string","default":""},"mask":{"type":"boolean","default":false},"mask-pattern":{"type":"string","default":""},"mask-lazy":{"type":"string","default":""},"mask-placeholder-char":{"type":"string","default":""},"mask-options":{"type":"string","default":""}},"values":{"value":{"type":"string","default":""}},"events":{"change":{"carries":"native"},"input":{"carries":"native"},"field-reset":{"shared":"field-inherit@1","cancelable":true,"carries":{"tag":{"type":"string"},"value":{"type":"string"},"inherited-value":{"type":"string"},"name":{"type":"string"}}}},"actions":{},"form":{"value":"value","name":"name","default":"value","submits":"value","reset":"default","required":"required","disabled":"disabled","readonly":"readonly","validity":["value-missing","type-mismatch","pattern-mismatch","too-short","too-long","custom-error"]},"host-states":{"data-inherited":"boolean"},"css-variables":{"--sf-input-background-color":{"type":"color","state":"default"},"--sf-input-border-color":{"type":"color","state":"default"},"--sf-input-color":{"type":"color","state":"default"},"--sf-input-radius":{"type":"length","state":"default"},"--sf-input-padding-inline":{"type":"length","state":"default"},"--sf-input-padding-block":{"type":"length","state":"default"},"--sf-input-invalid-border-color":{"type":"color","state":"invalid"}}}');

/***/ },

/***/ "e9f1da81a45b"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Text fields","runtime":{"value-missing":"Fill in this field","clear":"Clear","reveal":"Show password","type-mismatch":"Check the value","type-mismatch-email":"Enter the whole address, for example ivan@clinic.ru","type-mismatch-url":"Enter the whole address, for example https://clinic.ru","pattern-mismatch":"Check the format","too-short":"At least {min} characters","too-long":"At most {max} characters","range-underflow":"At least {min}","range-overflow":"At most {max}","step-mismatch":"Use steps of {step}","bad-input":"Enter a number","count-text":"{count} / {max}","help":"More about: {label}","caps-lock":"Caps Lock is on","conceal":"Hide password"},"x-trait-words":{"trait":"field-inherit@1","words":{"inherited":"inherited","reset":"Reset to inherited","described":"Inherited: {value}"}}}');

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