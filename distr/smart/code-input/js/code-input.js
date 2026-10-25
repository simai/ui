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

/***/ "caa87f9aa447"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SfCodeInput: () => (/* binding */ SfCodeInput)
/* harmony export */ });
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("fbe0570fcc69");
/* harmony import */ var _component_field_size__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("e6d86f2cd058");
/* harmony import */ var _component_field_contract__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("e138a730fd7c");
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("0d662e4d7d63");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("1904fef6f329");
/* harmony import */ var _code_mjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("aabcd8dc7842");
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("c2e138cb62ca");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_3__, _js_templates_default__WEBPACK_IMPORTED_MODULE_4__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_3__, _js_templates_default__WEBPACK_IMPORTED_MODULE_4__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__);
// sf-code-input: a one-time code -- from a message, an authenticator, an email
// -- as a form field with its own value, paste and errors, drawn as the class
// verification (src/component/verification) so its styles apply and nothing
// of them is forked (owner, 2026-10-25).
//
// One native input holds the whole code, as the class's canonical contract
// does: it is the form value, the focus, what autofill from a message
// (autocomplete="one-time-code"), WebOTP and a paste write to, and the one
// thing a screen reader edits. The cells are a picture of it. A field per
// character would split paste, autofill and the editing target (the class
// docs retired that markup for new pages), so the element gives the one field
// what cells have: a character typed into a filled cell takes its place,
// Backspace clears the cell before the caret and steps back (the code has no
// gaps: what follows moves up), the arrows, Home and End move between the cells, a click puts the caret in the cell clicked,
// and a polite line the input is described by says which cell the caret is in
// («цифра 3 из 6», in the page's language).
//
// The class runtime is loaded with the sheet; the drawn field carries
// data-sf-verification-owner, so it binds nothing to it and the code has one
// owner.







let sequence = 0;

class SfCodeInput extends (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()) {
  static get props() {
    return {
      templateName: {
        attribute: 'template',
        default: 'default'
      },
      length: {
        default: String(_code_mjs__WEBPACK_IMPORTED_MODULE_5__.CODE_LENGTH_DEFAULT)
      },
      value: {
        default: ''
      },
      defaultValue: {
        attribute: 'default-value',
        default: ''
      },
      name: {
        default: ''
      },
      mode: {
        default: 'numeric',
        values: [..._code_mjs__WEBPACK_IMPORTED_MODULE_5__.CODE_MODES]
      },
      size: {
        default: '1'
      },
      appearance: {
        default: 'bordered',
        values: ['bordered', 'filled']
      },
      label: {
        default: ''
      },
      hint: {
        default: ''
      },
      required: {
        type: Boolean,
        default: false
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
        attribute: 'error-message',
        default: ''
      },
      mask: {
        type: Boolean,
        default: false
      },
      ariaLabel: {
        attribute: 'aria-label',
        default: ''
      },
      rootClass: {
        default: ''
      }
    };
  }

  constructor() {
    super();
    this._id = `sf-code-input-${++sequence}`; // The value the last complete event was sent for: one event per code.

    this._completed = ''; // Where the selection stood before an edit (beforeinput), so typing over
    // a selection replaces it and typing into a cell takes the cell's place.

    this._selection = null; // What the field held when it took focus, and whether the native change
    // spoke for it: an edit the element rewrote may leave the browser with
    // nothing to report, and a commit is said once either way.

    this._focusValue = null;
    this._changeSent = false;
    this._form = null;
    this.addEventListener('beforeinput', this.onBeforeInput);
    this.addEventListener('input', this.onInput, true);
    this.addEventListener('paste', this.onPaste);
    this.addEventListener('keydown', this.onKeydown);
    this.addEventListener('click', this.onClick);
    this.addEventListener('focusin', this.onFocusIn);
    this.addEventListener('focusout', this.onFocusOut);
    this.addEventListener('change', this.onNativeChange, true);
    this.addEventListener('select', this.onCaret);
    this.addEventListener('selectionchange', this.onCaret);
    this.addEventListener('keyup', this.onCaret);
  }

  get length() {
    return (0,_code_mjs__WEBPACK_IMPORTED_MODULE_5__.codeLength)(this.getAttribute('length'));
  }

  get mode() {
    return (0,_code_mjs__WEBPACK_IMPORTED_MODULE_5__.codeMode)(this.getAttribute('mode'));
  }

  get size() {
    return (0,_component_field_size__WEBPACK_IMPORTED_MODULE_1__.fieldSize)(this.getAttribute('size') || '1', 'sf-code-input');
  }

  get appearance() {
    return this.getProp('appearance');
  }

  get label() {
    return this.getAttribute('label') || '';
  }

  get hint() {
    return this.getAttribute('hint') || '';
  }

  get name() {
    return this.getAttribute('name') || '';
  }

  get required() {
    return this.getBooleanAttr('required', false);
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

  get ariaLabel() {
    return this.getProp('ariaLabel') || '';
  } // The code: the native input's, kept to the mode and the length.


  get value() {
    const input = this.getInputElement();
    return (0,_code_mjs__WEBPACK_IMPORTED_MODULE_5__.normaliseCode)(input ? input.value : this.getAttribute('value') ?? this.defaultValue, this.mode, this.length);
  } // Setting the value writes the field and its cells, as the native input's
  // own value does: no input, change or complete event, which are the
  // person's.


  set value(next) {
    const value = next === null || next === undefined ? '' : (0,_code_mjs__WEBPACK_IMPORTED_MODULE_5__.normaliseCode)(next, this.mode, this.length);
    if (next === null || next === undefined) this.removeAttribute('value');else this.setAttribute('value', value);
    const input = this.getInputElement();
    if (input && input.value !== value) input.value = value;
    this._lastValue = value;
    this._completed = value.length === this.length ? value : '';
    this.syncCells();
  }

  get defaultValue() {
    return this.getAttribute('default-value') ?? this.getAttribute('value') ?? '';
  }

  set defaultValue(next) {
    if (next === null || next === undefined) this.removeAttribute('default-value');else this.setAttribute('default-value', String(next));
  } // Whether every cell holds a character.


  get complete() {
    return this.value.length === this.length;
  }

  getInputElement() {
    return this.querySelector(':scope .sf-verification-input');
  }

  focusDelegate() {
    return this.getInputElement();
  }

  text(key) {
    return (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageText)(_code_mjs__WEBPACK_IMPORTED_MODULE_5__.CODE_INPUT_TEXT, key, this, 'sf-code-input');
  } // «цифра 3 из 6» -- the cell the caret is in, in the page's language.


  positionText(cell) {
    return (0,_code_mjs__WEBPACK_IMPORTED_MODULE_5__.positionWords)(this.text(this.mode === 'numeric' ? 'digit' : 'character'), cell, this.length);
  }

  ownInput(target) {
    const input = this.getInputElement();
    return input && target === input ? input : null;
  }

  editable(input) {
    return input && !input.disabled && !input.readOnly;
  }

  onBeforeInput = event => {
    const input = this.ownInput(event.target);
    if (!input) return;
    this._selection = {
      start: input.selectionStart ?? 0,
      end: input.selectionEnd ?? 0
    }; // A typed character the mode does not keep is not written at all.

    if (event.inputType === 'insertText' && typeof event.data === 'string' && event.data.length > 0 && (0,_code_mjs__WEBPACK_IMPORTED_MODULE_5__.normaliseCode)(event.data, this.mode, this.length) === '') {
      event.preventDefault();
    }
  }; // Every edit, read after the browser applied it and set right: the value
  // kept to the mode and length, a typed character in its cell. The native
  // input event goes on to the host's listeners with the value already right.

  onInput = event => {
    const input = this.ownInput(event.target);
    if (!input) return;
    const previous = this._lastValue ?? '';
    const {
      value,
      caret
    } = (0,_code_mjs__WEBPACK_IMPORTED_MODULE_5__.applyEdit)({
      previous,
      raw: input.value,
      caret: input.selectionStart ?? input.value.length,
      data: event.data ?? null,
      inputType: event.inputType || '',
      selection: this._selection,
      mode: this.mode,
      length: this.length
    });
    this._selection = null;

    if (input.value !== value) {
      input.value = value;
      if (document.activeElement === input) input.setSelectionRange(caret, caret);
    }

    this.afterEdit(input);
  }; // A paste writes the code, kept to the mode: a whole code fills every cell
  // wherever the caret was, a part goes in at the caret.

  onPaste = event => {
    const input = this.ownInput(event.target);
    if (!this.editable(input)) return;
    const text = event.clipboardData?.getData('text') ?? '';
    event.preventDefault();
    const next = (0,_code_mjs__WEBPACK_IMPORTED_MODULE_5__.applyPaste)({
      previous: input.value,
      text,
      start: input.selectionStart ?? 0,
      end: input.selectionEnd ?? 0,
      mode: this.mode,
      length: this.length
    });
    if (!next || next.value === input.value) return;
    input.value = next.value;
    input.setSelectionRange(next.caret, next.caret);
    input.dispatchEvent(new InputEvent('input', {
      bubbles: true,
      inputType: 'insertFromPaste'
    }));
  };

  afterEdit(input) {
    const value = input.value;
    this._lastValue = value;

    if (this.hasAttribute('value')) {
      // A controlled field follows the person; the attribute says what they typed.
      this._writingValue = true;
      this.setAttribute('value', value);
      this._writingValue = false;
    }

    this.syncCells();

    if (value.length === this.length) {
      if (this._completed !== value) {
        this._completed = value; // After the input event has reached every listener, so a host reads
        // the whole code in both.

        setTimeout(() => this.dispatchEvent(new CustomEvent('sf-code-input:complete', {
          bubbles: true,
          composed: true,
          detail: {
            value
          }
        })), 0);
      }
    } else {
      this._completed = '';
    }
  } // The keys are the field's own: Backspace clears the cell before the caret
  // and steps back, Delete clears the one after it, the arrows move between
  // the cells. Home and End go to the first cell and past the last character
  // on every platform: a Mac field leaves them to the page, and scrolls. The
  // caret's cell is read once the key has done its work.


  onKeydown = event => {
    const input = this.ownInput(event.target);
    if (!input) return;

    if ((event.key === 'Home' || event.key === 'End') && !event.altKey && !event.ctrlKey && !event.metaKey) {
      event.preventDefault();
      const at = event.key === 'Home' ? 0 : input.value.length;
      if (event.shiftKey) input.setSelectionRange(Math.min(at, input.selectionStart ?? 0), Math.max(at, input.selectionEnd ?? 0));else input.setSelectionRange(at, at);
    }

    setTimeout(this.onCaret, 0);
  }; // A click lands in the cell under the pointer: the input lies transparent
  // over the cells and its own caret position knows nothing of them.

  onClick = event => {
    const input = this.ownInput(event.target);
    if (!input || input.disabled) return;
    const cells = this.cells();
    const x = event.clientX;
    let index = cells.findIndex(cell => {
      const box = cell.getBoundingClientRect();
      return x < box.right;
    });
    if (index === -1) index = cells.length - 1;
    const at = Math.min(Math.max(index, 0), input.value.length);
    input.setSelectionRange(at, at);
    this.onCaret();
  };
  onFocusIn = event => {
    const input = this.ownInput(event.target);
    if (!input) return;
    this._focusValue = input.value;
    this._changeSent = false;
    setTimeout(this.onCaret, 0);
  };
  onNativeChange = event => {
    if (this.ownInput(event.target)) this._changeSent = true;
  }; // A commit is said once: the browser's change, or the element's when the
  // browser had nothing to report for an edit the element rewrote.

  onFocusOut = event => {
    const input = this.ownInput(event.target);
    if (!input) return;
    const changed = this._focusValue !== null && input.value !== this._focusValue;
    if (changed && !this._changeSent) input.dispatchEvent(new Event('change', {
      bubbles: true
    }));
    this._focusValue = null;
    this._changeSent = false;
    this.syncCells();
  };
  onCaret = () => {
    this.syncCells();
  };

  cells() {
    return Array.from(this.querySelectorAll(':scope .sf-verification-cell'));
  } // The cell the caret is in: the caret's while the field has focus, else the
  // one the next character goes to, as the class runtime draws it.


  caretCell(input) {
    const focused = input && input.ownerDocument?.activeElement === input;
    const at = focused ? input.selectionStart ?? input.value.length : input?.value.length ?? 0;
    return (0,_code_mjs__WEBPACK_IMPORTED_MODULE_5__.currentCell)(at, this.length);
  } // The cells show the code (or a dot for each character when masked), the
  // filled ones `active`, the caret's `current`; the position line says the
  // caret's cell, spoken once each time it moves.


  syncCells() {
    const input = this.getInputElement();
    if (!input) return;
    const value = input.value;
    const current = this.caretCell(input);
    this.cells().forEach((cell, index) => {
      const character = value[index] || '';
      const shown = character && this.mask ? _code_mjs__WEBPACK_IMPORTED_MODULE_5__.MASK_GLYPH : character;
      if (cell.textContent !== shown) cell.textContent = shown;
      cell.classList.toggle('active', index < value.length);
      cell.classList.toggle('current', index === current);
    }); // A live line: a screen reader says it each time the caret changes cell,
    // and reads it with the field when the field takes focus.

    const position = this.querySelector(':scope .sf-code-input-position');
    const words = this.positionText(current);
    if (position && position.textContent !== words) position.textContent = words;
  }

  onFormReset = () => {
    // The browser writes the default back after the reset event.
    requestAnimationFrame(() => {
      this._lastValue = this.getInputElement()?.value ?? '';
      this._completed = '';
      this.syncCells();
    });
  };

  attributeChangedCallback(name, previous, next) {
    if (name === 'value' && this._writingValue) return;
    super.attributeChangedCallback(name, previous, next);
  }

  onDisconnected() {
    this._form?.removeEventListener('reset', this.onFormReset);
    this._form = null;
  }

  templateContext() {
    const props = this.getPropsContext();
    const component = this;
    const input = this.getInputElement();
    const invalid = this.invalid || this.error;
    const field = (0,_component_field_contract__WEBPACK_IMPORTED_MODULE_2__.createFieldContract)(this, {
      prefix: 'sf-code-input',
      required: this.required,
      invalid,
      hint: this.hint,
      errorMessage: this.errorMessage
    });
    const hasLabel = Boolean(this.hasSlotContent?.('label') || this.label);
    const labelContent = this.hasSlotContent?.('label') ? this.getSlotContent('label') : this.label;
    const hint = this.hasSlotContent?.('hint') ? this.getSlotContent('hint') : this.hint;
    const errorContent = this.hasSlotContent?.('error') ? this.getSlotContent('error') : this.errorMessage;
    const messageIsError = Boolean(field.invalid && errorContent);
    const hasControlledValue = this.hasAttribute('value'); // The template's defaultValue is the component's, as written; what the
    // native input starts from is that code cleaned to the mode and length,
    // under its own name, so a template never reads a resolved prop changed.

    const defaultCode = (0,_code_mjs__WEBPACK_IMPORTED_MODULE_5__.normaliseCode)(this.defaultValue, this.mode, this.length);
    const value = hasControlledValue ? (0,_code_mjs__WEBPACK_IMPORTED_MODULE_5__.normaliseCode)(this.getAttribute('value'), this.mode, this.length) : input ? (0,_code_mjs__WEBPACK_IMPORTED_MODULE_5__.normaliseCode)(input.value, this.mode, this.length) : defaultCode;
    return this.createTemplateContext({ ...props,
      component,
      id: this._id,
      field,
      size: this.size,
      filled: this.appearance === 'filled',
      label: this.label,
      hasLabel,
      labelContent,
      required: this.required,
      disabled: this.disabled,
      readonly: this.readonly,
      name: this.name,
      value,
      defaultValue: this.defaultValue,
      defaultCode,
      mode: this.mode,
      length: this.length,
      mask: this.mask,
      inputMode: (0,_code_mjs__WEBPACK_IMPORTED_MODULE_5__.codeInputMode)(this.mode),
      pattern: (0,_code_mjs__WEBPACK_IMPORTED_MODULE_5__.codePattern)(this.mode, this.length),
      ariaLabel: this.ariaLabel,
      groupLabel: this.ariaLabel || this.text('group'),
      messageContent: messageIsError ? errorContent : hint,
      messageIsError,
      rootClass: this.getRootClass()
    });
  }

  afterRender() {
    const input = this.getInputElement();
    this._lastValue = input?.value ?? '';
    if (input && input.value.length === this.length && !this._completed) this._completed = input.value;
    const form = input?.form ?? null;

    if (form !== this._form) {
      this._form?.removeEventListener('reset', this.onFormReset);
      form?.addEventListener('reset', this.onFormReset);
      this._form = form;
    }

    this.syncCells();
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_4__.renderCodeInputTemplate)(this.templateContext());
  }

}

SfCodeInput.define('sf-code-input');

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "1904fef6f329"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderCodeInputTemplate: () => (/* binding */ renderCodeInputTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ddf1cdb42ecc");
/* harmony import */ var lit_directives_live_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("2d6390ae26b0");
/* harmony import */ var lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("0d9131aa10ba");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_2__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_2__);




function joinClasses(...tokens) {
  return tokens.flat().filter(Boolean).join(' ');
} // The class verification's canonical markup (src/component/verification):
// the field container, its label, the frame of cells with the one native input
// over them, and the hint -- so the class sheet draws it and nothing of it is
// forked. The container is a group named by the label; the native input is
// the field, the form value, the focus and what autofill and paste write to.
// The cells are drawn empty and aria-hidden: the element writes the code into
// them as it changes, without a render, and says which cell the caret is in
// through the polite position line the input is described by.
//
// data-sf-verification-owner="smart" keeps the class runtime off it: the
// element owns the input, the cells and the events.


function renderCodeInputTemplate(context) {
  const {
    id,
    field,
    size,
    filled,
    label,
    hasLabel,
    labelContent,
    required,
    disabled,
    readonly,
    name,
    value,
    defaultCode,
    mode,
    length,
    mask,
    inputMode,
    pattern,
    ariaLabel,
    groupLabel,
    messageContent,
    messageIsError
  } = context;
  const labelId = `${id}-label`;
  const positionId = `${id}-position`;
  const describedBy = [positionId, messageContent ? field.messageId : ''].filter(Boolean).join(' ');
  const cells = Array.from({
    length
  }, (_, index) => index);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div
      class=${joinClasses('sf-verification-form', `sf-verification-form--size-${size}`, filled ? 'sf-verification-form--filled' : '', field.invalid ? 'error' : '', 'sf-code-input', context.rootClass)}
      style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      role="group"
      aria-labelledby=${hasLabel ? labelId : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      aria-label=${hasLabel ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : groupLabel}
      data-length=${String(length)}
      data-mode=${mode}
      data-sf-verification-owner="smart"
    >
      ${hasLabel ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<label class="sf-verification-form-label" id=${labelId} for=${field.controlId}>${labelContent}${required ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-code-input-required" aria-hidden="true">*</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}</label>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      <div class=${joinClasses('sf-verification', `sf-verification--size-${size}`, filled ? 'sf-verification--filled' : '', field.invalid ? 'error' : '')}>
        <input
          class="sf-verification-input"
          id=${field.controlId}
          type=${mask ? 'password' : 'text'}
          inputmode=${inputMode}
          autocomplete="one-time-code"
          autocapitalize="off"
          autocorrect="off"
          spellcheck="false"
          dir="ltr"
          pattern=${pattern}
          name=${name || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          .defaultValue=${defaultCode}
          .value=${(0,lit_directives_live_js__WEBPACK_IMPORTED_MODULE_1__.live)(value)}
          ?disabled=${disabled}
          ?readonly=${readonly}
          ?required=${field.required}
          aria-label=${hasLabel ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : ariaLabel || label || groupLabel}
          aria-invalid=${field.invalid ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          aria-describedby=${describedBy}
          aria-errormessage=${messageIsError ? field.messageId : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        />
        <span class="sf-verification-cells" aria-hidden="true">${(0,lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_2__.repeat)(cells, index => index, () => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-verification-cell"></span>`)}</span>
      </div>
      ${messageContent ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-verification-form-hint" id=${field.messageId}
                     data-field-message=${messageIsError ? 'error' : 'hint'}>${messageContent}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      <span class="sr-only sf-code-input-position" id=${positionId} aria-live="polite"></span>
    </div>
  `;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "c2e138cb62ca"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "0d9131aa10ba"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit/directives/repeat.js") : new Promise((resolve) => globalThis.addEventListener("sf-runtime-ready", () => resolve(globalThis.SF.runtimeModule("lit/directives/repeat.js")), { once: true })));

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

/***/ "a5a956c9f619"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TemplateResultType: () => (/* binding */ e),
/* harmony export */   clearPart: () => (/* binding */ j),
/* harmony export */   getCommittedValue: () => (/* binding */ M),
/* harmony export */   getDirectiveClass: () => (/* binding */ f),
/* harmony export */   insertPart: () => (/* binding */ v),
/* harmony export */   isCompiledTemplateResult: () => (/* binding */ d),
/* harmony export */   isDirectiveResult: () => (/* binding */ c),
/* harmony export */   isPrimitive: () => (/* binding */ n),
/* harmony export */   isSingleExpression: () => (/* binding */ r),
/* harmony export */   isTemplateResult: () => (/* binding */ l),
/* harmony export */   removePart: () => (/* binding */ h),
/* harmony export */   setChildPartValue: () => (/* binding */ u),
/* harmony export */   setCommittedValue: () => (/* binding */ p)
/* harmony export */ });
/* harmony import */ var _lit_html_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("f550d360fd36");

/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{I:t}=_lit_html_js__WEBPACK_IMPORTED_MODULE_0__._$LH,i=o=>o,n=o=>null===o||"object"!=typeof o&&"function"!=typeof o,e={HTML:1,SVG:2,MATHML:3},l=(o,t)=>void 0===t?void 0!==o?._$litType$:o?._$litType$===t,d=o=>null!=o?._$litType$?.h,c=o=>void 0!==o?._$litDirective$,f=o=>o?._$litDirective$,r=o=>void 0===o.strings,s=()=>document.createComment(""),v=(o,n,e)=>{const l=o._$AA.parentNode,d=void 0===n?o._$AB:n._$AA;if(void 0===e){const i=l.insertBefore(s(),d),n=l.insertBefore(s(),d);e=new t(i,n,o,o.options)}else{const t=e._$AB.nextSibling,n=e._$AM,c=n!==o;if(c){let t;e._$AQ?.(o),e._$AM=o,void 0!==e._$AP&&(t=o._$AU)!==n._$AU&&e._$AP(t)}if(t!==d||c){let o=e._$AA;for(;o!==t;){const t=i(o).nextSibling;i(l).insertBefore(o,d),o=t}}}return e},u=(o,t,i=o)=>(o._$AI(t,i),o),m={},p=(o,t=m)=>o._$AH=t,M=o=>o._$AH,h=o=>{o._$AR(),o._$AA.remove()},j=o=>{o._$AR()};
//# sourceMappingURL=directive-helpers.js.map


/***/ },

/***/ "0e2a9b296d0b"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Directive: () => (/* binding */ i),
/* harmony export */   PartType: () => (/* binding */ t),
/* harmony export */   directive: () => (/* binding */ e)
/* harmony export */ });
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},e=t=>(...e)=>({_$litDirective$:t,values:e});class i{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}
//# sourceMappingURL=directive.js.map


/***/ },

/***/ "42b0b8d71f19"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   live: () => (/* binding */ l)
/* harmony export */ });
/* harmony import */ var _lit_html_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("f550d360fd36");
/* harmony import */ var _directive_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("0e2a9b296d0b");
/* harmony import */ var _directive_helpers_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("a5a956c9f619");

/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const l=(0,_directive_js__WEBPACK_IMPORTED_MODULE_1__.directive)(class extends _directive_js__WEBPACK_IMPORTED_MODULE_1__.Directive{constructor(r){if(super(r),r.type!==_directive_js__WEBPACK_IMPORTED_MODULE_1__.PartType.PROPERTY&&r.type!==_directive_js__WEBPACK_IMPORTED_MODULE_1__.PartType.ATTRIBUTE&&r.type!==_directive_js__WEBPACK_IMPORTED_MODULE_1__.PartType.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!(0,_directive_helpers_js__WEBPACK_IMPORTED_MODULE_2__.isSingleExpression)(r))throw Error("`live` bindings can only contain a single expression")}render(r){return r}update(i,[t]){if(t===_lit_html_js__WEBPACK_IMPORTED_MODULE_0__.noChange||t===_lit_html_js__WEBPACK_IMPORTED_MODULE_0__.nothing)return t;const o=i.element,l=i.name;if(i.type===_directive_js__WEBPACK_IMPORTED_MODULE_1__.PartType.PROPERTY){if(t===o[l])return _lit_html_js__WEBPACK_IMPORTED_MODULE_0__.noChange}else if(i.type===_directive_js__WEBPACK_IMPORTED_MODULE_1__.PartType.BOOLEAN_ATTRIBUTE){if(!!t===o.hasAttribute(l))return _lit_html_js__WEBPACK_IMPORTED_MODULE_0__.noChange}else if(i.type===_directive_js__WEBPACK_IMPORTED_MODULE_1__.PartType.ATTRIBUTE&&o.getAttribute(l)===t+"")return _lit_html_js__WEBPACK_IMPORTED_MODULE_0__.noChange;return (0,_directive_helpers_js__WEBPACK_IMPORTED_MODULE_2__.setCommittedValue)(i),t}});
//# sourceMappingURL=live.js.map


/***/ },

/***/ "f550d360fd36"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   _$LH: () => (/* binding */ j),
/* harmony export */   html: () => (/* binding */ b),
/* harmony export */   mathml: () => (/* binding */ T),
/* harmony export */   noChange: () => (/* binding */ E),
/* harmony export */   nothing: () => (/* binding */ A),
/* harmony export */   render: () => (/* binding */ D),
/* harmony export */   svg: () => (/* binding */ w)
/* harmony export */ });
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,i=t=>t,s=t.trustedTypes,e=s?s.createPolicy("lit-html",{createHTML:t=>t}):void 0,h="$lit$",o=`lit$${Math.random().toFixed(9).slice(2)}$`,n="?"+o,r=`<${n}>`,l=document,c=()=>l.createComment(""),a=t=>null===t||"object"!=typeof t&&"function"!=typeof t,u=Array.isArray,d=t=>u(t)||"function"==typeof t?.[Symbol.iterator],f="[ \t\n\f\r]",v=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_=/-->/g,m=/>/g,p=RegExp(`>|${f}(?:([^\\s"'>=/]+)(${f}*=${f}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),g=/'/g,$=/"/g,y=/^(?:script|style|textarea|title)$/i,x=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),b=x(1),w=x(2),T=x(3),E=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),C=new WeakMap,P=l.createTreeWalker(l,129);function V(t,i){if(!u(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==e?e.createHTML(i):i}const N=(t,i)=>{const s=t.length-1,e=[];let n,l=2===i?"<svg>":3===i?"<math>":"",c=v;for(let i=0;i<s;i++){const s=t[i];let a,u,d=-1,f=0;for(;f<s.length&&(c.lastIndex=f,u=c.exec(s),null!==u);)f=c.lastIndex,c===v?"!--"===u[1]?c=_:void 0!==u[1]?c=m:void 0!==u[2]?(y.test(u[2])&&(n=RegExp("</"+u[2],"g")),c=p):void 0!==u[3]&&(c=p):c===p?">"===u[0]?(c=n??v,d=-1):void 0===u[1]?d=-2:(d=c.lastIndex-u[2].length,a=u[1],c=void 0===u[3]?p:'"'===u[3]?$:g):c===$||c===g?c=p:c===_||c===m?c=v:(c=p,n=void 0);const x=c===p&&t[i+1].startsWith("/>")?" ":"";l+=c===v?s+r:d>=0?(e.push(a),s.slice(0,d)+h+s.slice(d)+o+x):s+o+(-2===d?i:x)}return[V(t,l+(t[s]||"<?>")+(2===i?"</svg>":3===i?"</math>":"")),e]};class S{constructor({strings:t,_$litType$:i},e){let r;this.parts=[];let l=0,a=0;const u=t.length-1,d=this.parts,[f,v]=N(t,i);if(this.el=S.createElement(f,e),P.currentNode=this.el.content,2===i||3===i){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(r=P.nextNode())&&d.length<u;){if(1===r.nodeType){if(r.hasAttributes())for(const t of r.getAttributeNames())if(t.endsWith(h)){const i=v[a++],s=r.getAttribute(t).split(o),e=/([.?@])?(.*)/.exec(i);d.push({type:1,index:l,name:e[2],strings:s,ctor:"."===e[1]?I:"?"===e[1]?L:"@"===e[1]?z:H}),r.removeAttribute(t)}else t.startsWith(o)&&(d.push({type:6,index:l}),r.removeAttribute(t));if(y.test(r.tagName)){const t=r.textContent.split(o),i=t.length-1;if(i>0){r.textContent=s?s.emptyScript:"";for(let s=0;s<i;s++)r.append(t[s],c()),P.nextNode(),d.push({type:2,index:++l});r.append(t[i],c())}}}else if(8===r.nodeType)if(r.data===n)d.push({type:2,index:l});else{let t=-1;for(;-1!==(t=r.data.indexOf(o,t+1));)d.push({type:7,index:l}),t+=o.length-1}l++}}static createElement(t,i){const s=l.createElement("template");return s.innerHTML=t,s}}function M(t,i,s=t,e){if(i===E)return i;let h=void 0!==e?s._$Co?.[e]:s._$Cl;const o=a(i)?void 0:i._$litDirective$;return h?.constructor!==o&&(h?._$AO?.(!1),void 0===o?h=void 0:(h=new o(t),h._$AT(t,s,e)),void 0!==e?(s._$Co??=[])[e]=h:s._$Cl=h),void 0!==h&&(i=M(t,h._$AS(t,i.values),h,e)),i}class R{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:i},parts:s}=this._$AD,e=(t?.creationScope??l).importNode(i,!0);P.currentNode=e;let h=P.nextNode(),o=0,n=0,r=s[0];for(;void 0!==r;){if(o===r.index){let i;2===r.type?i=new k(h,h.nextSibling,this,t):1===r.type?i=new r.ctor(h,r.name,r.strings,this,t):6===r.type&&(i=new Z(h,this,t)),this._$AV.push(i),r=s[++n]}o!==r?.index&&(h=P.nextNode(),o++)}return P.currentNode=l,e}p(t){let i=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++}}class k{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,i,s,e){this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cv=e?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t?.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=M(this,t,i),a(t)?t===A||null==t||""===t?(this._$AH!==A&&this._$AR(),this._$AH=A):t!==this._$AH&&t!==E&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):d(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==A&&a(this._$AH)?this._$AA.nextSibling.data=t:this.T(l.createTextNode(t)),this._$AH=t}$(t){const{values:i,_$litType$:s}=t,e="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=S.createElement(V(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===e)this._$AH.p(i);else{const t=new R(e,this),s=t.u(this.options);t.p(i),this.T(s),this._$AH=t}}_$AC(t){let i=C.get(t.strings);return void 0===i&&C.set(t.strings,i=new S(t)),i}k(t){u(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const h of t)e===i.length?i.push(s=new k(this.O(c()),this.O(c()),this,this.options)):s=i[e],s._$AI(h),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e)}_$AR(t=this._$AA.nextSibling,s){for(this._$AP?.(!1,!0,s);t!==this._$AB;){const s=i(t).nextSibling;i(t).remove(),t=s}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class H{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,i,s,e,h){this.type=1,this._$AH=A,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=h,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=A}_$AI(t,i=this,s,e){const h=this.strings;let o=!1;if(void 0===h)t=M(this,t,i,0),o=!a(t)||t!==this._$AH&&t!==E,o&&(this._$AH=t);else{const e=t;let n,r;for(t=h[0],n=0;n<h.length-1;n++)r=M(this,e[s+n],i,n),r===E&&(r=this._$AH[n]),o||=!a(r)||r!==this._$AH[n],r===A?t=A:t!==A&&(t+=(r??"")+h[n+1]),this._$AH[n]=r}o&&!e&&this.j(t)}j(t){t===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class I extends H{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===A?void 0:t}}class L extends H{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==A)}}class z extends H{constructor(t,i,s,e,h){super(t,i,s,e,h),this.type=5}_$AI(t,i=this){if((t=M(this,t,i,0)??A)===E)return;const s=this._$AH,e=t===A&&s!==A||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,h=t!==A&&(s===A||e);e&&this.element.removeEventListener(this.name,this,s),h&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class Z{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){M(this,t)}}const j={M:h,P:o,A:n,C:1,L:N,R,D:d,V:M,I:k,H,N:L,U:z,B:I,F:Z},B=t.litHtmlPolyfillSupport;B?.(S,k),(t.litHtmlVersions??=[]).push("3.3.3");const D=(t,i,s)=>{const e=s?.renderBefore??i;let h=e._$litPart$;if(void 0===h){const t=s?.renderBefore??null;e._$litPart$=h=new k(i.insertBefore(c(),t),t,void 0,s??{})}return h._$AI(t),h};
//# sourceMappingURL=lit-html.js.map


/***/ },

/***/ "2d6390ae26b0"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   live: () => (/* reexport safe */ lit_html_directives_live_js__WEBPACK_IMPORTED_MODULE_0__.live)
/* harmony export */ });
/* harmony import */ var lit_html_directives_live_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("42b0b8d71f19");

//# sourceMappingURL=live.js.map


/***/ },

/***/ "aabcd8dc7842"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CODE_INPUT_TEXT: () => (/* binding */ CODE_INPUT_TEXT),
/* harmony export */   CODE_LENGTH_DEFAULT: () => (/* binding */ CODE_LENGTH_DEFAULT),
/* harmony export */   CODE_LENGTH_MAX: () => (/* binding */ CODE_LENGTH_MAX),
/* harmony export */   CODE_MODES: () => (/* binding */ CODE_MODES),
/* harmony export */   MASK_GLYPH: () => (/* binding */ MASK_GLYPH),
/* harmony export */   applyEdit: () => (/* binding */ applyEdit),
/* harmony export */   applyPaste: () => (/* binding */ applyPaste),
/* harmony export */   codeInputMode: () => (/* binding */ codeInputMode),
/* harmony export */   codeLength: () => (/* binding */ codeLength),
/* harmony export */   codeMode: () => (/* binding */ codeMode),
/* harmony export */   codePattern: () => (/* binding */ codePattern),
/* harmony export */   currentCell: () => (/* binding */ currentCell),
/* harmony export */   normaliseCode: () => (/* binding */ normaliseCode),
/* harmony export */   positionWords: () => (/* binding */ positionWords)
/* harmony export */ });
// The parts of sf-code-input that are about the code, not the page: which
// characters a mode keeps, how long a code is, what an edit makes of the value
// and how a cell is spoken. Kept apart from the element so the contract tests
// run them in Node, as sf-accordion's sections.mjs is.

// The class verification's own bounds: one to twelve cells, six by default.
const CODE_LENGTH_DEFAULT = 6;
const CODE_LENGTH_MAX = 12;
// What a code is made of: digits, or Latin letters and digits. The class also
// knows `text` (anything but spaces); a one-time code is never that.
const CODE_MODES = Object.freeze(['numeric', 'alphanumeric']);
// What a masked cell shows in place of its character.
const MASK_GLYPH = '•';

const MODE_FILTER = {
  numeric: /[^0-9]/gu,
  alphanumeric: /[^A-Za-z0-9]/gu,
};

const MODE_PATTERN = {
  numeric: '[0-9]',
  alphanumeric: '[A-Za-z0-9]',
};

function codeMode(value) {
  const mode = String(value ?? '').trim().toLowerCase();
  return CODE_MODES.includes(mode) ? mode : 'numeric';
}

function codeLength(value) {
  const length = Number.parseInt(String(value ?? ''), 10);
  if (!Number.isFinite(length) || length < 1) return CODE_LENGTH_DEFAULT;
  return Math.min(length, CODE_LENGTH_MAX);
}

// Only the characters the mode keeps, no longer than the code: what typing,
// pasting and autofill leave in the field.
function normaliseCode(value, mode = 'numeric', length = CODE_LENGTH_DEFAULT) {
  return String(value ?? '').replace(MODE_FILTER[codeMode(mode)], '').slice(0, codeLength(length));
}

// The native constraint the field carries: exactly `length` characters of the
// mode, so a required code that is not whole is invalid as the form sees it.
function codePattern(mode, length) {
  return `${MODE_PATTERN[codeMode(mode)]}{${codeLength(length)}}`;
}

// What the keyboard offers: digits for a numeric code, letters otherwise.
function codeInputMode(mode) {
  return codeMode(mode) === 'numeric' ? 'numeric' : 'text';
}

// The cell the next character goes to: the caret's, never past the last cell.
function currentCell(caret, length) {
  const at = Number.isFinite(caret) ? caret : 0;
  return Math.max(0, Math.min(at, codeLength(length) - 1));
}

// One edit the person made, as the field sees it after the browser applied it:
// `previous` is the code before, `raw` the field's text now, `caret` where the
// browser left the caret and `data` what was inserted (InputEvent.data).
//
// - A whole code -- autofill from a message, a paste, WebOTP writing it in --
//   replaces the value, whatever was there and wherever the caret was.
// - A character typed into a filled cell takes that cell's place, as a cell
//   would: the code is not pushed along and nothing falls off its end. Typed
//   at the end of a whole code, it takes the last cell. Typed over a
//   selection, it replaces the selection, as in any field.
// - Anything else (deleting, cutting, a part of a code pasted at the caret)
//   is the browser's own edit, with the characters the mode does not keep
//   taken out.
//
// `selection` is where the selection stood before the edit ({start, end},
// from beforeinput); without it the edit is read from the caret after it.
// Returns {value, caret}.
function applyEdit({previous = '', raw = '', caret = 0, data = null, inputType = '', selection = null, mode = 'numeric', length = CODE_LENGTH_DEFAULT}) {
  const size = codeLength(length);
  const kept = normaliseCode(previous, mode, size);
  const typed = data === null || data === undefined ? null : String(data);
  const inserted = typed === null ? '' : typed.replace(MODE_FILTER[codeMode(mode)], '');

  if (inserted.length >= size) {
    const value = inserted.slice(0, size);
    return {value, caret: value.length};
  }

  if (inputType === 'insertText' && typed !== null) {
    const from = selection ? Math.max(0, Math.min(selection.start, kept.length)) : Math.max(0, Math.min(caret - typed.length, kept.length));
    const to = selection ? Math.max(from, Math.min(selection.end, kept.length)) : from;
    if (!inserted) {
      // Nothing the mode keeps: the field goes back to what it was.
      return {value: kept, caret: from};
    }
    if (to > from) {
      const value = (kept.slice(0, from) + inserted + kept.slice(to)).slice(0, size);
      return {value, caret: Math.min(from + inserted.length, value.length)};
    }
    const start = from >= size ? size - inserted.length : from;
    const value = (kept.slice(0, start) + inserted + kept.slice(start + inserted.length)).slice(0, size);
    return {value, caret: Math.min(start + inserted.length, value.length)};
  }

  const before = String(raw ?? '').slice(0, Math.max(0, caret));
  const value = normaliseCode(raw, mode, size);
  return {value, caret: Math.min(normaliseCode(before, mode, size).length, value.length)};
}

// What a pasted text makes of the code: a whole code replaces it; a part goes
// in at the caret, over what the selection held. Returns {value, caret}, or
// null when the text holds nothing the mode keeps.
function applyPaste({previous = '', text = '', start = 0, end = start, mode = 'numeric', length = CODE_LENGTH_DEFAULT}) {
  const size = codeLength(length);
  const pasted = String(text ?? '').replace(MODE_FILTER[codeMode(mode)], '');
  if (!pasted) return null;
  if (pasted.length >= size) {
    const value = pasted.slice(0, size);
    return {value, caret: value.length};
  }
  const kept = normaliseCode(previous, mode, size);
  const from = Math.max(0, Math.min(start, kept.length));
  const to = Math.max(from, Math.min(end, kept.length));
  const value = (kept.slice(0, from) + pasted + kept.slice(to)).slice(0, size);
  return {value, caret: Math.min(from + pasted.length, value.length)};
}

// The words the element speaks, in the languages it ships; a product adds more
// through SF.language (src/core/js/page-language.js). `{n}` is the cell, `{m}`
// the length.
const CODE_INPUT_TEXT = {
  en: {
    digit: 'digit {n} of {m}',
    character: 'character {n} of {m}',
    group: 'Code',
  },
  ru: {
    digit: 'цифра {n} из {m}',
    character: 'символ {n} из {m}',
    group: 'Код',
  },
};

function positionWords(template, cell, length) {
  return String(template).replace('{n}', String(cell + 1)).replace('{m}', String(codeLength(length)));
}


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
/******/ 	let __webpack_exports__ = __webpack_require__("caa87f9aa447");
/******/
/******/ })()
;