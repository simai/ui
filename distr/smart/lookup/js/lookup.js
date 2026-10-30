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

/***/ "6fb05187bfff"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _core_js_position_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("116963e5e31b");
/* harmony import */ var _core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("bf0cea966575");
/* harmony import */ var _core_js_page_language_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("43090d1c8307");
/* harmony import */ var _component_field_size__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("e6d86f2cd058");
/* harmony import */ var _helpers_form_field__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("38ea8d53f301");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("c0d84431f6fd");
/* harmony import */ var _js_lookup_model_mjs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("5979036f5921");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("7acc12578fb6");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("b58273e4f031");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("12d14f068981");
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__("33819c046314");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_position_js__WEBPACK_IMPORTED_MODULE_2__, _core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_3__, _core_js_page_language_js__WEBPACK_IMPORTED_MODULE_4__, _component_field_size__WEBPACK_IMPORTED_MODULE_5__, _js_templates_default__WEBPACK_IMPORTED_MODULE_7__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_position_js__WEBPACK_IMPORTED_MODULE_2__, _core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_3__, _core_js_page_language_js__WEBPACK_IMPORTED_MODULE_4__, _component_field_size__WEBPACK_IMPORTED_MODULE_5__, _js_templates_default__WEBPACK_IMPORTED_MODULE_7__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_position_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_core_js_position_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _core_js_page_language_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_core_js_page_language_js__WEBPACK_IMPORTED_MODULE_4__);












 // sf-lookup: the people and object picker. A form field whose value is the
// field renderer's lookup value -- {value, label}, or a list of them when
// multiple -- chosen from a search the host answers through `provider`, or
// from a short list given whole (`options`).
//
// From its component.json (standard simai.smart-component 1.3.14 §3, §4, §8,
// §17): the settings are made by core/js/element-manifest.js; the field is the
// form control through ElementInternals and sends the values alone. A choice
// and a removed chip say input and change; a value set from code, a form reset
// and a restore say nothing.
//
// The search (js/lookup-model.mjs holds its pure parts): below min-length the
// list shows the hint and nothing is asked; after `debounce` the provider is
// called with {cursor, limit, signal}; a new call aborts the previous one and
// an answer for an older call is dropped; {status: 'unavailable'} is the
// neutral line, an error the line with Retry; nextCursor is Show more.

const LookupElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_9__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_10__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_11__
  },
  source: 'en'
}); // Core publishes the helper; a bundle loaded without core.js positions with
// its own copy (as sf-dropdown's portal does).

const position = () => globalThis.SF?.Position || (_core_js_position_js__WEBPACK_IMPORTED_MODULE_2___default());

class SfLookup extends (0,_helpers_form_field__WEBPACK_IMPORTED_MODULE_6__.FormField)(LookupElement) {
  static get props() {
    return { ...super.props,
      rootClass: {
        attribute: 'root-class',
        default: ''
      }
    };
  } // value is a property (an object or a list), but a page prints it as an
  // attribute too (JSON, or a bare value read against the options).


  static get observedAttributes() {
    return [...new Set([...super.observedAttributes, 'value'])];
  }

  constructor() {
    super();
    this._value = undefined;
    this._query = '';
    this._dirty = false;
    this._open = false;
    this._state = 'closed';
    this._items = [];
    this._nextCursor = null;
    this._active = -1;
    this._refusal = '';
    this._loadingMore = false;
    this._seq = 0;
    this._controller = null;
    this._timer = 0;
    this._last = null;
    this._anchor = null;
    this._anchorPanel = null;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // The value attribute is the default a form reset returns to; written
    // again, it is the value again.
    if (name === 'value' && oldValue !== newValue) {
      this._value = undefined;
      this._dirty = false;
      this._query = '';
      this.sfSyncFormState?.();
    }

    if (name === 'disabled' || name === 'readonly') this._close();
    super.attributeChangedCallback(name, oldValue, newValue);
  } // ---------------------------------------------------------- settings


  get size() {
    return (0,_component_field_size__WEBPACK_IMPORTED_MODULE_5__.fieldSize)(this.getAttribute('size') || '1', 'sf-lookup');
  }

  get effectiveDisabled() {
    return Boolean(this.disabled || this.sfFormDisabled);
  }

  get editable() {
    return !this.effectiveDisabled && !this.readonly;
  }

  get input() {
    return this.querySelector('.sf-lookup-input');
  }

  _minLength() {
    return (0,_js_lookup_model_mjs__WEBPACK_IMPORTED_MODULE_8__.wholeNumber)(this.minLength, _js_lookup_model_mjs__WEBPACK_IMPORTED_MODULE_8__.DEFAULTS.minLength);
  }

  _maxResults() {
    return (0,_js_lookup_model_mjs__WEBPACK_IMPORTED_MODULE_8__.wholeNumber)(this.maxResults, _js_lookup_model_mjs__WEBPACK_IMPORTED_MODULE_8__.DEFAULTS.maxResults, {
      min: 1
    });
  }

  _debounce() {
    return (0,_js_lookup_model_mjs__WEBPACK_IMPORTED_MODULE_8__.wholeNumber)(this.debounce, _js_lookup_model_mjs__WEBPACK_IMPORTED_MODULE_8__.DEFAULTS.debounce);
  }

  _maxItems() {
    return this.multiple ? (0,_js_lookup_model_mjs__WEBPACK_IMPORTED_MODULE_8__.wholeNumber)(this.maxItems, 0) : 0;
  }

  _options() {
    return (0,_js_lookup_model_mjs__WEBPACK_IMPORTED_MODULE_8__.normaliseItems)(this.options);
  }

  _exclude() {
    return (0,_js_lookup_model_mjs__WEBPACK_IMPORTED_MODULE_8__.excludedKeys)(this.exclude);
  }

  _provider() {
    return typeof this.provider === 'function' ? this.provider : null;
  }
  /**
   * The value: single {value, label, caption?, avatar?} or null; multiple a
   * list in the order chosen ([] when nothing is).
   */


  get value() {
    const options = this.options;
    if (this._value !== undefined) return (0,_js_lookup_model_mjs__WEBPACK_IMPORTED_MODULE_8__.normaliseValue)(this._value, {
      multiple: Boolean(this.multiple),
      options
    });
    return (0,_js_lookup_model_mjs__WEBPACK_IMPORTED_MODULE_8__.normaliseValue)(this.getAttribute('value'), {
      multiple: Boolean(this.multiple),
      options
    });
  } // Set from code it is not a change: no event, as for a native field.


  set value(next) {
    this._value = next === undefined ? undefined : (0,_js_lookup_model_mjs__WEBPACK_IMPORTED_MODULE_8__.normaliseValue)(next, {
      multiple: Boolean(this.multiple),
      options: this.options
    });
    this._dirty = false;
    this._query = '';
    this.requestComponentUpdate('value');
    this.sfSyncFormState();
  }

  isItemChosen(item) {
    return (0,_js_lookup_model_mjs__WEBPACK_IMPORTED_MODULE_8__.isChosen)(this.value, item);
  }

  focusDelegate() {
    return this.input;
  } // ---------------------------------------------------------- form
  // The values alone: one entry, or one entry per chosen value under the
  // name (§17.1); nothing while disabled or empty.


  sfFormValue() {
    if (this.effectiveDisabled) return null;
    const entries = (0,_js_lookup_model_mjs__WEBPACK_IMPORTED_MODULE_8__.formEntries)(this.value);
    if (!entries.length) return null;
    if (!this.multiple) return entries[0];
    const name = this.name || '';
    if (!name || typeof FormData !== 'function') return entries.join(',');
    const data = new FormData();

    for (const entry of entries) data.append(name, entry);

    return data;
  }

  fieldValidity() {
    const missing = Boolean(this.required) && !this.effectiveDisabled && (0,_js_lookup_model_mjs__WEBPACK_IMPORTED_MODULE_8__.formEntries)(this.value).length === 0;
    return {
      valueMissing: missing,
      message: missing ? this.sfWord('value-missing') : '',
      anchor: this.input
    };
  } // form.reset(): the value attribute back, without events.


  fieldReset() {
    this._value = undefined;
    this._dirty = false;
    this._query = '';
    this._refusal = '';

    this._close();

    this.requestComponentUpdate('reset');
  } // The form's saved entries: the values; their labels are what the options
  // know, else the values themselves.


  fieldRestore(state) {
    let values = state;
    if (typeof FormData === 'function' && state instanceof FormData) values = state.getAll(this.name || '').map(String);
    if (values === null || values === undefined) return;
    this._value = (0,_js_lookup_model_mjs__WEBPACK_IMPORTED_MODULE_8__.normaliseValue)(Array.isArray(values) ? values : [values].filter(one => one !== ''), {
      multiple: Boolean(this.multiple),
      options: this.options
    });
    this.requestComponentUpdate('restore');
  } // ---------------------------------------------------------- drawing


  templateContext() {
    const props = this.getPropsContext();
    const chosen = (0,_js_lookup_model_mjs__WEBPACK_IMPORTED_MODULE_8__.chosenList)(this.value);
    const multiple = Boolean(this.multiple);
    return this.createTemplateContext({ ...props,
      size: this.size,
      appearance: this.appearance,
      label: this.label || '',
      hint: this.hint || '',
      placeholder: this.placeholder || '',
      errorMessage: this.errorMessage || '',
      name: this.name || '',
      multiple,
      required: Boolean(this.required),
      readonly: Boolean(this.readonly),
      invalid: Boolean(this.invalid),
      // The form's disabled fieldset counts too, so the drawn state is not the
      // `disabled` getter's: it travels under its own name.
      fieldDisabled: this.effectiveDisabled,
      editable: this.editable,
      // The resolved value, as the getter answers it (a list when multiple).
      value: this.value,
      chosen,
      // A single field shows its chosen label while the person is not searching.
      queryText: !multiple && !this._dirty && chosen[0] ? String(chosen[0].label) : this._query,
      queryMaxLength: (0,_js_lookup_model_mjs__WEBPACK_IMPORTED_MODULE_8__.wholeNumber)(this.maxlength, 0),
      minChars: this._minLength(),
      listOpen: this._open,
      listState: this._state,
      items: this._items,
      activeIndex: this._active,
      nextCursor: this._nextCursor,
      loadingMore: this._loadingMore,
      refusal: this._refusal,
      ariaLabel: this.getAttribute('aria-label') || '',
      component: this
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_7__.renderLookupTemplate)(this.templateContext());
  }

  afterRender() {
    this._syncPanel();

    this._scrollActiveIntoView();

    this.sfSyncFormState();
  }

  onDisconnected() {
    this._close({
      render: false
    });

    this._syncPanel({
      force: false
    });

    super.onDisconnected?.();
  } // The panel is a manual popover in the top layer, anchored under the frame
  // at its width; it flips above when there is no room (SF.Position).


  _syncPanel({
    force
  } = {}) {
    const panel = this.querySelector('.sf-lookup-panel');
    const frame = this.querySelector('.sf-lookup-frame');
    const open = (force ?? this._open) && Boolean(panel && frame) && this.isConnected;

    if (open) {
      try {
        if (typeof panel.showPopover === 'function' && !panel.matches(':popover-open')) panel.showPopover();
      } catch {// No popover in this browser: the sheet shows the panel in place.
      }

      if (!this._anchor || this._anchorPanel !== panel) {
        this._anchor?.stop();
        this._anchor = position().anchor(frame, panel, {
          side: 'block-end',
          align: 'start',
          matchWidth: true,
          fitHeight: true,
          autoUpdate: true
        });
        this._anchorPanel = panel;
      } else {
        this._anchor.update();
      }
    } else {
      this._anchor?.stop();
      this._anchor = null;
      this._anchorPanel = null;

      try {
        if (panel?.matches?.(':popover-open')) panel.hidePopover();
      } catch {// Nothing to hide.
      }
    }

    (0,_core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_3__.holdOpenSurfaceMark)(this, open);
  }

  _scrollActiveIntoView() {
    if (!this._open || this._active < 0) return;
    const rows = this.querySelectorAll('.sf-lookup-option');
    rows[this._active]?.scrollIntoView?.({
      block: 'nearest'
    });
  } // ---------------------------------------------------------- the search


  _abort() {
    clearTimeout(this._timer);
    this._timer = 0;

    if (this._controller) {
      this._controller.abort();

      this._controller = null;
    } // Whatever was asked before is older than what comes next.


    this._seq += 1;
    this._loadingMore = false;
  }

  _openList() {
    if (!this.editable) return false;

    if (!this._open) {
      this._open = true;

      this._plan(this._dirty || this.multiple ? this._query : '', {
        immediate: true
      });
    }

    return true;
  }

  _close({
    render = true
  } = {}) {
    if (!this._open && this._state === 'closed' && !this._controller && !this._timer) return;

    this._abort();

    this._open = false;
    this._state = 'closed';
    this._items = [];
    this._nextCursor = null;
    this._active = -1;
    this._refusal = '';
    if (render) this.requestComponentUpdate('close');
  } // What a query shows: the inline options filtered in place, the hint, or a
  // call to the provider after the debounce (at once when `immediate`).


  _plan(query, {
    immediate = false
  } = {}) {
    this._abort();

    this._refusal = '';

    const options = this._options();

    const plan = (0,_js_lookup_model_mjs__WEBPACK_IMPORTED_MODULE_8__.searchPlan)(query, {
      minLength: this._minLength(),
      hasOptions: options.length > 0,
      hasProvider: Boolean(this._provider())
    });
    this._nextCursor = null;
    this._active = -1;

    if (plan === 'local') {
      this._items = (0,_js_lookup_model_mjs__WEBPACK_IMPORTED_MODULE_8__.filterOptions)(options, query, {
        exclude: this._exclude(),
        locale: (0,_core_js_page_language_js__WEBPACK_IMPORTED_MODULE_4__.pageLocale)(this)
      });
      this._state = this._items.length ? 'results' : 'empty';
    } else if (plan === 'hint') {
      this._items = [];
      this._state = 'hint';
    } else if (plan === 'none') {
      this._items = [];
      this._state = 'unavailable';
    } else {
      const delay = immediate ? 0 : this._debounce();
      if (delay > 0) this._timer = setTimeout(() => this._call(query, null), delay);else this._call(query, null);
    }

    this.requestComponentUpdate('search');
  }

  async _call(query, cursor) {
    this._timer = 0;

    const provider = this._provider();

    if (!provider || !this.isConnected) return;
    if (this._controller) this._controller.abort();
    const controller = new AbortController();
    this._controller = controller;
    this._seq += 1;
    const seq = this._seq;
    this._last = {
      query,
      cursor
    };

    const limit = this._maxResults();

    if (cursor === null) {
      this._state = 'searching';
      this._items = [];
      this._nextCursor = null;
      this._active = -1;
    } else {
      this._loadingMore = true;
    }

    this.requestComponentUpdate('searching');
    let answer;
    let failed = false;

    try {
      answer = await Promise.resolve().then(() => provider.call(null, query, {
        cursor,
        limit,
        signal: controller.signal
      }));
    } catch (error) {
      failed = true;
      answer = error;
    } // A late answer -- of a call aborted or overtaken -- is dropped.


    if (seq !== this._seq || controller.signal.aborted || !this._open) return;
    this._controller = null;
    this._loadingMore = false;
    const read = failed ? {
      state: 'error',
      items: [],
      nextCursor: null
    } : (0,_js_lookup_model_mjs__WEBPACK_IMPORTED_MODULE_8__.readAnswer)(answer, {
      exclude: this._exclude(),
      limit
    });

    if (cursor === null) {
      this._items = read.items;
      this._state = read.state;
    } else if (read.state === 'error' || read.state === 'unavailable') {
      this._state = read.state;
    } else {
      this._items = (0,_js_lookup_model_mjs__WEBPACK_IMPORTED_MODULE_8__.appendItems)(this._items, read.items);
      this._state = this._items.length ? 'results' : 'empty';
    } // Retry repeats the call that failed; a good page moves on.


    this._nextCursor = read.state === 'error' ? cursor : read.nextCursor;
    if (this._active >= this._items.length) this._active = this._items.length - 1;
    this.requestComponentUpdate('answer');
  }
  /** Searches a query at once, as typing does, opening the list. */


  search(query) {
    if (!this.editable) return false;
    this._query = String(query ?? '');
    this._dirty = true;
    this._open = true;

    this._plan(this._query, {
      immediate: true
    });

    return true;
  }
  /** Repeats the last call to the provider, with its query and cursor. */


  retry() {
    if (!this._last || !this._provider() || !this.editable) return false;
    this._open = true;

    this._abort();

    this._call(this._last.query, this._last.cursor);

    return true;
  }
  /** Asks the provider for the next page (Show more). */


  showMore() {
    if (this._nextCursor === null || this._state !== 'results' || !this._last) return false;

    this._abort();

    this._call(this._last.query, this._nextCursor);

    return true;
  }
  /** Closes the list and drops a search still running; the query stays. */


  close() {
    const was = this._open;

    this._close();

    return was;
  } // ---------------------------------------------------------- choosing


  _say(detail) {
    this.sfEmit('input', detail);
    this.sfEmit('change', detail);
  }

  _write(next) {
    this._value = next;
    this.sfSyncFormState();
  }

  chooseIndex(index) {
    const item = this._items[index];
    if (!item || !this.editable) return false;
    const multiple = Boolean(this.multiple);
    const result = (0,_js_lookup_model_mjs__WEBPACK_IMPORTED_MODULE_8__.choose)(this.value, item, {
      multiple,
      maxItems: this._maxItems()
    });

    if (result.outcome === 'refused') {
      this._refusal = this.sfWord('max-items', {
        count: this._maxItems()
      });
      this._active = index;
      this.requestComponentUpdate('refused');
      return false;
    }

    this._refusal = '';

    if (result.outcome !== 'unchanged') {
      this._write(result.value);

      this._say({
        value: this.value,
        item: { ...item
        },
        action: result.outcome
      });
    }

    if (!multiple) {
      // A single choice commits and closes the list; the box shows its label.
      this._dirty = false;
      this._query = '';

      this._close({
        render: false
      });
    } else {
      this._active = index;
    }

    this.requestComponentUpdate('choose');
    return true;
  }

  _removeItem(item) {
    if (!this.editable) return false;
    const next = (0,_js_lookup_model_mjs__WEBPACK_IMPORTED_MODULE_8__.removeChosen)(this.value, item.value, {
      multiple: Boolean(this.multiple)
    });
    this._refusal = '';

    this._write(next);

    this._say({
      value: this.value,
      item: { ...item
      },
      action: 'removed'
    });

    this.requestComponentUpdate('remove');
    return true;
  } // ---------------------------------------------------------- the search box


  onQueryInput(event) {
    // The box's own input is not the field's: typing is not a change of value.
    event.stopPropagation();
    if (!this.editable) return;
    this._query = String(event.target?.value ?? '');
    this._dirty = true;
    this._open = true;

    this._plan(this._query);
  }

  onQueryFocus() {
    // A single field's label is selected, so typing replaces it.
    const input = this.input;
    if (input && !this.multiple && !this._dirty && input.value) input.select?.();
  }

  onQueryKeydown(event) {
    if (event.isComposing || !this.editable) return;
    const key = event.key;

    if (key === 'ArrowDown' || key === 'ArrowUp') {
      event.preventDefault();

      if (!this._open) {
        this._openList();

        return;
      }

      this._moveTo((0,_js_lookup_model_mjs__WEBPACK_IMPORTED_MODULE_8__.moveActive)(this._active, this._items.length, key));

      return;
    }

    if ((key === 'Home' || key === 'End') && this._open && this._items.length) {
      event.preventDefault();

      this._moveTo((0,_js_lookup_model_mjs__WEBPACK_IMPORTED_MODULE_8__.moveActive)(this._active, this._items.length, key));

      return;
    }

    if (key === 'Enter') {
      if (this._open && this._active >= 0) {
        event.preventDefault();
        this.chooseIndex(this._active);
      } else if (this._open) {
        // The list is open: Enter belongs to it, not to the form.
        event.preventDefault();
      }

      return;
    }

    if (key === 'Escape') {
      if (this._open) {
        event.preventDefault();
        event.stopPropagation();

        this._close();

        return;
      }

      if (this._query || this._dirty) {
        event.preventDefault();
        event.stopPropagation();
        this._query = '';
        this._dirty = false;
        this.requestComponentUpdate('clear-query');
      }

      return;
    }

    if (key === 'Backspace' && this.multiple && !event.target?.value) {
      const chosen = (0,_js_lookup_model_mjs__WEBPACK_IMPORTED_MODULE_8__.chosenList)(this.value);

      if (chosen.length) {
        event.preventDefault();

        this._removeItem(chosen[chosen.length - 1]);
      }
    }
  }

  _moveTo(index) {
    if (index === this._active) return;
    this._active = index;
    this.requestComponentUpdate('active');
  } // ---------------------------------------------------------- pointer


  onFrameClick(event) {
    if (event.target?.closest?.('sf-tag, button')) return;
    if (!this.effectiveDisabled) this.input?.focus();
  } // A press anywhere in the list keeps the focus in the search box; Retry and
  // Show more still hear the click.


  onPanelMouseDown(event) {
    event.preventDefault();
  } // Retry and Show more go away while the call runs: the focus goes back to
  // the search box first, so a keyboard press on them does not leave the field.


  onRetryClick() {
    this.input?.focus({
      preventScroll: true
    });
    this.retry();
  }

  onShowMoreClick() {
    this.input?.focus({
      preventScroll: true
    });
    this.showMore();
  }

  onPanelClick(event) {
    const option = event.target?.closest?.('.sf-lookup-option');
    if (!option) return;
    event.preventDefault();
    this.chooseIndex(Number(option.dataset.sfIndex));
  }

  onChipClose(event, item) {
    event.stopPropagation();

    this._removeItem(item); // The chip goes with its button: the focus goes back to the search box.


    this.input?.focus({
      preventScroll: true
    });
  }

  onClearClick(event) {
    event.preventDefault();
    const chosen = (0,_js_lookup_model_mjs__WEBPACK_IMPORTED_MODULE_8__.chosenList)(this.value);
    if (!chosen.length || !this.editable) return;

    this._removeItem(chosen[0]);

    this._dirty = false;
    this._query = '';
    this.input?.focus({
      preventScroll: true
    });
  }

  onRootPointerDown(event) {
    if (event.target?.closest?.('.sf-lookup-frame')) this.querySelector('.sf-lookup')?.classList.add('sf-lookup--pointer-focus');
  } // Leaving the field closes the list; a single field shows its label again.


  onRootFocusOut(event) {
    const next = event.relatedTarget;
    if (next && this.contains(next)) return;
    this.querySelector('.sf-lookup')?.classList.remove('sf-lookup--pointer-focus');

    if (!this.multiple && this._dirty) {
      this._dirty = false;
      this._query = '';
    }

    this._close({
      render: false
    });

    this.requestComponentUpdate('leave');
  }

}

SfLookup.define('sf-lookup');
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SfLookup);
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "c0d84431f6fd"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderLookupTemplate: () => (/* binding */ renderLookupTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var lit_directives_live_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("2d6390ae26b0");
/* harmony import */ var _component_field_contract__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("e138a730fd7c");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, _component_field_contract__WEBPACK_IMPORTED_MODULE_2__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, _component_field_contract__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);


 // The field: a label row, one frame holding the chips and the search box, the
// hint or error line under it, and the list panel -- a popover the component
// anchors under the frame. sf-input's parts, in its places.
//
// The search box is the combobox; the focus never leaves it while the arrows
// move the active row (aria-activedescendant). Rows are drawn here, not as
// elements: the class markup of an avatar (a photo or initials) beside the
// label and the caption, and a check on a chosen row.
// A row's picture a rung below the field; the chips stand on the field's line.

const AVATAR_SIZE = {
  '1/2': '1/3',
  '1': '1/2',
  '2': '1'
};
const CLEAR_SIZE = {
  '1/2': '1/4',
  '1': '1/3',
  '2': '1/2'
};
const BUTTON_SIZE = {
  '1/2': '1/3',
  '1': '1/2',
  '2': '1'
};

function avatar(item, size, extraClass = '') {
  if (!item.avatar) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const classes = `sf-avatar sf-avatar--size-${size} inline-flex flex-none items-cross-center content-main-center overflow-hidden ${extraClass}`;

  if (item.avatar.src) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class=${classes} aria-hidden="true"><img class="sf-avatar-image" src=${item.avatar.src} alt="" loading="lazy" decoding="async"></span>`;
  }

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="${classes} sf-avatar--text" aria-hidden="true">${item.avatar.initials}</span>`;
}

function chip(context, item) {
  const {
    component,
    size,
    editable,
    fieldDisabled
  } = context;
  const label = String(item.label);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-tag
      class="sf-lookup-chip"
      kind=${item.avatar ? 'avatar' : 'default'}
      line=${size}
      text=${label}
      title=${item.caption ? `${label} — ${item.caption}` : label}
      avatar-image-url=${item.avatar?.src || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      avatar-text=${item.avatar?.initials || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      closable=${editable ? '' : 'false'}
      close-label=${component.sfWord('remove', {
    vars: {
      label
    }
  })}
      ?disabled=${fieldDisabled}
      data-sf-value=${String(item.value)}
      @sf-tag-close=${event => component.onChipClose(event, item)}
      @close=${event => event.stopPropagation()}
    ></sf-tag>`;
}

function row(context, item, index) {
  const {
    component,
    ids,
    activeIndex,
    size
  } = context;
  const chosen = component.isItemChosen(item);
  const active = index === activeIndex;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div
      class=${['sf-lookup-option', 'flex', 'items-cross-center', chosen ? 'sf-lookup-option--chosen' : '', active ? 'sf-lookup-option--active' : ''].filter(Boolean).join(' ')}
      id=${`${ids.option}-${index}`}
      role="option"
      aria-selected=${chosen ? 'true' : 'false'}
      data-sf-index=${String(index)}
    >${avatar(item, AVATAR_SIZE[size] || '1/2', 'sf-lookup-option-avatar')}<span class="sf-lookup-option-text flex flex-col">
        <span class="sf-lookup-option-label">${item.label}</span>
        ${item.caption ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-lookup-option-caption">${item.caption}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      </span><i class="sf-icon sf-lookup-option-check" aria-hidden="true">${chosen ? 'check' : ''}</i></div>`;
}

const SPINNER_SIZE = {
  '1/2': '1/3',
  '1': '1/3',
  '2': '1/2'
};

function spinner(context) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-spinner class="sf-lookup-spinner flex-none" size=${SPINNER_SIZE[context.size] || '1/3'} aria-hidden="true"></sf-spinner>`;
}

function stateLine(context) {
  const {
    component,
    listState,
    minChars,
    refusal,
    items,
    loadingMore
  } = context;
  if (refusal) return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-lookup-state-text">${refusal}</span>`;

  switch (listState) {
    case 'hint':
      return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-lookup-state-text">${component.sfWord('hint-min-length', {
        count: minChars
      })}</span>`;

    case 'searching':
      return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-lookup-state-text">${component.sfWord('searching')}</span>`;

    case 'empty':
      return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-lookup-state-text">${component.sfWord('nothing-found')}</span>`;

    case 'unavailable':
      return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-lookup-state-text">${component.sfWord('unavailable')}</span>`;

    case 'error':
      return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-lookup-state-text">${component.sfWord('error')}</span>`;

    case 'results':
      return loadingMore ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-lookup-state-text">${component.sfWord('searching')}</span>` // Said, not shown: the rows are what a sighted person reads.
      : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-lookup-visually-hidden">${component.sfWord('results', {
        count: items.length
      })}</span>`;

    default:
      return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  }
}

function renderLookupTemplate(context) {
  const {
    component,
    size,
    appearance,
    label,
    required,
    hint,
    errorMessage,
    invalid,
    fieldDisabled,
    readonly,
    multiple,
    placeholder,
    chosen,
    queryText,
    queryMaxLength,
    listOpen,
    listState,
    items,
    activeIndex,
    nextCursor,
    loadingMore,
    editable,
    ariaLabel,
    refusal
  } = context;
  const field = (0,_component_field_contract__WEBPACK_IMPORTED_MODULE_2__.createFieldContract)(component, {
    prefix: 'sf-lookup',
    required,
    invalid,
    hint,
    errorMessage
  });
  const ids = {
    label: `${field.base}--label`,
    panel: `${field.base}--panel`,
    list: `${field.base}--list`,
    status: `${field.base}--status`,
    option: `${field.base}--option`
  };
  const message = field.invalid && errorMessage ? errorMessage : hint;
  const rowContext = { ...context,
    ids
  };
  const showList = listOpen && items.length > 0;
  const rootClasses = ['sf-lookup', `sf-lookup--size-${size}`, `sf-lookup--${appearance}`, multiple ? 'sf-lookup--multiple' : 'sf-lookup--single', listOpen ? 'sf-lookup--open' : '', field.invalid ? 'error' : '', fieldDisabled ? 'sf-lookup--disabled' : '', readonly ? 'sf-lookup--readonly' : '', 'flex', 'flex-col', context.rootClass].filter(Boolean);
  const single = !multiple && chosen[0];
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div class=${rootClasses.join(' ')} style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      @pointerdown=${event => component.onRootPointerDown(event)}
      @focusout=${event => component.onRootFocusOut(event)}>
      ${label ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-lookup-label flex" id=${ids.label} @click=${() => component.focus()}>
            <span class="sf-lookup-text">${label}</span>
            ${required ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-lookup-required" aria-hidden="true">*</span>` : ''}
          </span>` : ''}
      <div class="sf-lookup-frame flex flex-wrap items-cross-center" @click=${event => component.onFrameClick(event)}>
        ${multiple ? chosen.map(item => chip(context, item)) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        <input
          class="sf-lookup-input flex-1"
          id=${field.controlId}
          type="text"
          role="combobox"
          autocomplete="off"
          autocapitalize="off"
          spellcheck="false"
          aria-autocomplete="list"
          aria-haspopup="listbox"
          aria-expanded=${listOpen ? 'true' : 'false'}
          aria-controls=${ids.list}
          aria-activedescendant=${listOpen && activeIndex >= 0 && activeIndex < items.length ? `${ids.option}-${activeIndex}` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          aria-labelledby=${label ? ids.label : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          aria-label=${!label && ariaLabel ? ariaLabel : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          aria-describedby=${message ? field.messageId : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          aria-errormessage=${field.invalid && errorMessage ? field.messageId : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          aria-invalid=${field.invalid ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          aria-required=${field.required ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          aria-readonly=${readonly ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          placeholder=${multiple && chosen.length || single ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : placeholder || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          maxlength=${queryMaxLength > 0 ? String(queryMaxLength) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          ?disabled=${fieldDisabled}
          ?readonly=${readonly}
          .value=${(0,lit_directives_live_js__WEBPACK_IMPORTED_MODULE_1__.live)(queryText)}
          @input=${event => component.onQueryInput(event)}
          @change=${event => event.stopPropagation()}
          @keydown=${event => component.onQueryKeydown(event)}
          @focus=${event => component.onQueryFocus(event)}
        >
        ${single && editable ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<button type="button"
              class="sf-lookup-clear sf-icon-button sf-icon-button--icon sf-icon-button--link sf-icon-button--on-surface sf-icon-button--size-${CLEAR_SIZE[size] || '1/3'} flex items-cross-center flex-none"
              aria-label=${component.sfWord('clear')}
              title=${component.sfWord('clear')}
              @click=${event => component.onClearClick(event)}
            ><i class="sf-icon" aria-hidden="true">close</i></button>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      </div>
      ${message ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span id=${field.messageId} class="sf-lookup-hint-text-wrap"
            data-field-message=${field.invalid && errorMessage ? 'error' : 'hint'}>${message}</span>` : ''}
      <div class="sf-lookup-panel" id=${ids.panel} popover="manual"
        @mousedown=${event => component.onPanelMouseDown(event)}
        @click=${event => component.onPanelClick(event)}>
        <div class="sf-lookup-list" id=${ids.list} role="listbox"
          aria-labelledby=${label ? ids.label : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          aria-label=${!label && ariaLabel ? ariaLabel : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          aria-multiselectable=${multiple ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          ?hidden=${!showList}>${showList ? items.map((item, index) => row(rowContext, item, index)) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}</div>
        <div class=${['sf-lookup-state', 'flex', 'items-cross-center', refusal ? 'sf-lookup-state--refusal' : '', listState === 'error' && !refusal ? 'sf-lookup-state--error' : ''].filter(Boolean).join(' ')}>
          ${listOpen && !refusal && (listState === 'searching' || listState === 'results' && loadingMore) ? spinner(rowContext) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          <span class="sf-lookup-status" id=${ids.status} role="status" aria-live="polite">${listOpen ? stateLine(rowContext) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}</span>
        </div>
        ${listOpen && listState === 'error' ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-lookup-actions flex"><sf-button class="sf-lookup-retry" size=${BUTTON_SIZE[size] || '1/2'} appearance="outline"
              @click=${() => component.onRetryClick()}>${component.sfWord('retry')}</sf-button></div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        ${listOpen && listState === 'results' && nextCursor !== null && !loadingMore ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-lookup-actions flex"><sf-button class="sf-lookup-more" size=${BUTTON_SIZE[size] || '1/2'} appearance="outline"
              @click=${() => component.onShowMoreClick()}>${component.sfWord('show-more')}</sf-button></div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      </div>
    </div>
  `;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "33819c046314"
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

/***/ "bf0cea966575"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("open-surface-mark", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("open-surface-mark", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "43090d1c8307"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("page-language", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("page-language", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "116963e5e31b"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("position", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("position", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "deb1a4d61565"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("smart-base", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("smart-base", 1).then(resolve, reject), { once: true })));

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

/***/ "5979036f5921"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DEFAULTS: () => (/* binding */ DEFAULTS),
/* harmony export */   STATES: () => (/* binding */ STATES),
/* harmony export */   appendItems: () => (/* binding */ appendItems),
/* harmony export */   choose: () => (/* binding */ choose),
/* harmony export */   chosenList: () => (/* binding */ chosenList),
/* harmony export */   excludedKeys: () => (/* binding */ excludedKeys),
/* harmony export */   filterOptions: () => (/* binding */ filterOptions),
/* harmony export */   foldText: () => (/* binding */ foldText),
/* harmony export */   formEntries: () => (/* binding */ formEntries),
/* harmony export */   isChosen: () => (/* binding */ isChosen),
/* harmony export */   keyOf: () => (/* binding */ keyOf),
/* harmony export */   moveActive: () => (/* binding */ moveActive),
/* harmony export */   normaliseAvatar: () => (/* binding */ normaliseAvatar),
/* harmony export */   normaliseItem: () => (/* binding */ normaliseItem),
/* harmony export */   normaliseItems: () => (/* binding */ normaliseItems),
/* harmony export */   normaliseValue: () => (/* binding */ normaliseValue),
/* harmony export */   readAnswer: () => (/* binding */ readAnswer),
/* harmony export */   removeChosen: () => (/* binding */ removeChosen),
/* harmony export */   safeImageSource: () => (/* binding */ safeImageSource),
/* harmony export */   sameValue: () => (/* binding */ sameValue),
/* harmony export */   searchPlan: () => (/* binding */ searchPlan),
/* harmony export */   wholeNumber: () => (/* binding */ wholeNumber),
/* harmony export */   withoutExcluded: () => (/* binding */ withoutExcluded)
/* harmony export */ });
// sf-lookup's model, without a document: the value, the items an answer
// brings, the list a query shows, a choice and the search's states. The
// element (../index.js) keeps the instance's state and draws it; everything
// here is a plain function of its arguments, so tests/lookup.contract.test.mjs
// runs it in Node and a server can read a submitted value the same way.
//
// The value is the field renderer's lookup value (src/smart/field-renderers,
// lookupItems): {value, label}, or a list of them when multiple. An item may
// carry caption and avatar ({src} or {initials}); they travel with the chosen
// item, so a chip and a row never need a second read.

const DEFAULTS = Object.freeze({minLength: 2, maxResults: 20, debounce: 120});

// The states of the list area, one line each (the design draft's table).
const STATES = Object.freeze(['closed', 'hint', 'searching', 'results', 'empty', 'unavailable', 'error']);

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const present = (value) => value !== null && value !== undefined && value !== '';

/** The key a value is compared by: its string, as a form sends it. */
const keyOf = (value) => String(value);

/** A whole number setting read leniently: a non-number or a negative is the fallback. */
function wholeNumber(value, fallback, {min = 0} = {}) {
  const number = Math.trunc(Number(value));
  return Number.isFinite(number) && number >= min ? number : fallback;
}

/**
 * An image address the avatar may show: http(s), a path on the site, a data
 * image or a blob. Nothing that leaves a CSS url() or an attribute (quotes,
 * brackets, back slashes, white space, control characters), so the address
 * reads the same wherever the picture is drawn.
 */
function safeImageSource(src) {
  const text = String(src ?? '').trim();
  if (!text || /[\s"'()\\<>]/u.test(text) || [...text].some((char) => char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127)) return '';
  if (/^https?:\/\//iu.test(text)) return text;
  if (/^data:image\/(png|jpeg|gif|webp|avif);/iu.test(text)) return text;
  if (/^blob:/iu.test(text)) return text;
  if (text.startsWith('/') && !text.startsWith('//')) return text;
  return '';
}

/** An avatar as the model keeps it: {src}, {initials}, or null. */
function normaliseAvatar(avatar) {
  if (!isObject(avatar)) return null;
  const src = safeImageSource(avatar.src);
  if (src) return {src};
  const initials = String(avatar.initials ?? '').trim().slice(0, 3);
  return initials ? {initials} : null;
}

/**
 * One item of an answer, of the inline options or of the value:
 * {value, label, caption?, avatar?}, or null when it has no value. A label
 * missing is the value's text (a host that sends the value alone is still
 * shown something); `text` is read as the label too, as sf-dropdown's
 * options and the field renderer read it.
 */
function normaliseItem(raw) {
  if (!isObject(raw) || !present(raw.value)) return null;
  const value = typeof raw.value === 'number' || typeof raw.value === 'string' ? raw.value : keyOf(raw.value);
  const item = {value, label: String(raw.label ?? raw.text ?? value)};
  const caption = raw.caption === null || raw.caption === undefined ? '' : String(raw.caption);
  if (caption) item.caption = caption;
  const avatar = normaliseAvatar(raw.avatar);
  if (avatar) item.avatar = avatar;
  return item;
}

/** A list of items: each normalised, the ones without a value and the repeats dropped. */
function normaliseItems(list) {
  const seen = new Set();
  const items = [];
  for (const raw of Array.isArray(list) ? list : []) {
    const item = normaliseItem(raw);
    if (!item || seen.has(keyOf(item.value))) continue;
    seen.add(keyOf(item.value));
    items.push(item);
  }
  return items;
}

function parseMaybeJson(raw) {
  if (typeof raw !== 'string') return raw;
  const text = raw.trim();
  if (!text) return null;
  if (!/^[[{"]/u.test(text)) return text;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

/**
 * The value as the element holds it: single {value, label, ...} or null;
 * multiple a list in the order chosen, [] when nothing is. Read from a
 * property or from the value attribute (JSON). A bare value (a string or a
 * number) is read against the inline options for its label, as the field
 * renderer reads it; a list given to a single field keeps its first item,
 * one item given to a multiple field is a list of one.
 */
function normaliseValue(raw, {multiple = false, options = []} = {}) {
  const parsed = parseMaybeJson(raw);
  const list = Array.isArray(parsed) ? parsed : present(parsed) ? [parsed] : [];
  const known = normaliseItems(options);
  const items = normaliseItems(list.map((one) => {
    if (isObject(one)) return one;
    if (!present(one)) return null;
    const option = known.find((candidate) => keyOf(candidate.value) === keyOf(one));
    return option ?? {value: one, label: String(one)};
  }));
  if (multiple) return items;
  return items[0] ?? null;
}

/** The chosen items as a list, whatever the mode. */
const chosenList = (value) => (Array.isArray(value) ? value : value ? [value] : []);

/** The values alone, as the form sends them: one entry per chosen item. */
function formEntries(value) {
  return chosenList(value).map((item) => keyOf(item.value));
}

/** Two values are the same when they hold the same values in the same order. */
function sameValue(a, b) {
  const left = formEntries(a);
  const right = formEntries(b);
  return left.length === right.length && left.every((one, index) => one === right[index]);
}

/** The keys of `exclude`: a list of values, or of items carrying them. */
function excludedKeys(exclude) {
  const parsed = parseMaybeJson(exclude);
  const list = Array.isArray(parsed) ? parsed : present(parsed) ? [parsed] : [];
  return new Set(list.map((one) => (isObject(one) ? one.value : one)).filter(present).map(keyOf));
}

/** The items left once the excluded values are taken out (every answer goes through it). */
function withoutExcluded(items, exclude) {
  const keys = exclude instanceof Set ? exclude : excludedKeys(exclude);
  if (!keys.size) return items;
  return items.filter((item) => !keys.has(keyOf(item.value)));
}

/**
 * The inline options a query shows: the label or the caption holds the query,
 * case and accents of the page's language aside. An empty query shows them
 * all: the list in hand is the whole set.
 */
function filterOptions(options, query, {exclude, locale} = {}) {
  const items = withoutExcluded(normaliseItems(options), exclude);
  const needle = foldText(query, locale);
  if (!needle) return items;
  return items.filter((item) => foldText(item.label, locale).includes(needle) || foldText(item.caption ?? '', locale).includes(needle));
}

/** Text compared without case and accents (ё is е, as a Russian reader types it). */
function foldText(text, locale) {
  let lower;
  try {
    lower = String(text ?? '').toLocaleLowerCase(locale || undefined);
  } catch {
    lower = String(text ?? '').toLowerCase();
  }
  return lower.normalize('NFD').replace(/[̀-ͯ]/gu, '').replace(/ё/gu, 'е').trim();
}

/**
 * What a query asks for: 'local' with inline options (searched in place,
 * any length), 'hint' below min-length (nothing is asked), 'search' when the
 * provider is asked, 'none' with neither options nor a provider.
 */
function searchPlan(query, {minLength = DEFAULTS.minLength, hasOptions = false, hasProvider = false} = {}) {
  if (hasOptions) return 'local';
  if (!hasProvider) return 'none';
  return String(query ?? '').trim().length < minLength ? 'hint' : 'search';
}

/**
 * A provider's answer read into the list's state:
 * {status: 'unavailable'} -> unavailable; {items, nextCursor} -> results or
 * empty, the excluded values taken out and at most `limit` items; anything
 * else (no object, items not a list) -> error. `nextCursor` is kept only when
 * it is given: without it there is no "Show more", however many items came.
 */
function readAnswer(answer, {exclude, limit = DEFAULTS.maxResults} = {}) {
  if (!isObject(answer)) return {state: 'error', items: [], nextCursor: null};
  if (answer.status === 'unavailable') return {state: 'unavailable', items: [], nextCursor: null};
  if (!Array.isArray(answer.items)) return {state: 'error', items: [], nextCursor: null};
  const items = withoutExcluded(normaliseItems(answer.items).slice(0, Math.max(0, limit)), exclude);
  const nextCursor = present(answer.nextCursor) ? answer.nextCursor : null;
  return {state: items.length || nextCursor !== null ? 'results' : 'empty', items, nextCursor};
}

/** A page of more results joined to what is shown: in order, no item twice. */
function appendItems(shown, more) {
  const seen = new Set(shown.map((item) => keyOf(item.value)));
  return [...shown, ...more.filter((item) => !seen.has(keyOf(item.value)))];
}

/**
 * A choice: the value it makes and what happened.
 *   single:   the item is the value ('replaced'), or 'unchanged' when it was it;
 *   multiple: a chosen item leaves ('removed'); a new one joins at the end
 *             ('added'), or is 'refused' when max-items are chosen already.
 * `maxItems` 0 is no cap.
 */
function choose(value, raw, {multiple = false, maxItems = 0} = {}) {
  const item = normaliseItem(raw);
  if (!item) return {value, outcome: 'unchanged'};
  if (!multiple) {
    if (value && keyOf(value.value) === keyOf(item.value)) return {value, outcome: 'unchanged'};
    return {value: item, outcome: 'replaced'};
  }
  const list = chosenList(value);
  if (list.some((one) => keyOf(one.value) === keyOf(item.value))) {
    return {value: list.filter((one) => keyOf(one.value) !== keyOf(item.value)), outcome: 'removed'};
  }
  if (maxItems > 0 && list.length >= maxItems) return {value: list, outcome: 'refused'};
  return {value: [...list, item], outcome: 'added'};
}

/** The value without one chosen item (a chip's remove button, Backspace). */
function removeChosen(value, key, {multiple = false} = {}) {
  if (!multiple) return value && keyOf(value.value) === keyOf(key) ? null : value;
  return chosenList(value).filter((one) => keyOf(one.value) !== keyOf(key));
}

/** Whether an item is among the chosen. */
function isChosen(value, item) {
  return chosenList(value).some((one) => keyOf(one.value) === keyOf(item.value));
}

/**
 * The next active row for a key, or -1 for none: ArrowDown and ArrowUp step
 * and stop at the ends, Home and End go to them. From no row, ArrowDown is
 * the first and ArrowUp the last.
 */
function moveActive(index, count, key) {
  if (count <= 0) return -1;
  switch (key) {
    case 'ArrowDown': return index < 0 ? 0 : Math.min(count - 1, index + 1);
    case 'ArrowUp': return index < 0 ? count - 1 : Math.max(0, index - 1);
    case 'Home': return 0;
    case 'End': return count - 1;
    default: return index;
  }
}


/***/ },

/***/ "7acc12578fb6"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.lookup","tag":"sf-lookup","version":"1.0.0","kind":"leaf","settings":{"size":{"type":"enum","values":["1/2","1","2"],"default":"1"},"appearance":{"type":"enum","values":["bordered","filled"],"default":"bordered"},"label":{"type":"string","default":""},"placeholder":{"type":"string","default":""},"hint":{"type":"string","default":""},"name":{"type":"string","default":""},"multiple":{"type":"boolean","default":false},"max-items":{"type":"number","default":0},"min-length":{"type":"number","default":2},"max-results":{"type":"number","default":20},"debounce":{"type":"number","default":120},"maxlength":{"type":"number","default":0},"options":{"type":"list","default":[]},"exclude":{"type":"list","default":[]},"provider":{"type":"object","default":null},"required":{"type":"boolean","default":false},"disabled":{"type":"boolean","default":false},"readonly":{"type":"boolean","default":false},"invalid":{"type":"boolean","default":false},"error-message":{"type":"string","default":""}},"values":{"value":{"type":"object","nullable":true,"default":null}},"events":{"input":{"carries":"native"},"change":{"carries":"native"}},"actions":{},"form":{"value":"value","name":"name","default":"value","submits":"value","reset":"default","required":"required","disabled":"disabled","readonly":"readonly","validity":["value-missing","custom-error"]},"css-variables":{"--sf-lookup-background-color":{"type":"color","state":"default"},"--sf-lookup-border-color":{"type":"color","state":"default"},"--sf-lookup-color":{"type":"color","state":"default"},"--sf-lookup-radius":{"type":"length","state":"default"},"--sf-lookup-padding-inline":{"type":"length","state":"default"},"--sf-lookup-padding-block":{"type":"length","state":"default"},"--sf-lookup-invalid-border-color":{"type":"color","state":"invalid"},"--sf-lookup-list-background-color":{"type":"color","state":"open"}}}');

/***/ },

/***/ "b58273e4f031"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Lookup","runtime":{"hint-min-length":{"one":"Type at least {n} character","other":"Type at least {n} characters"},"searching":"Searching…","nothing-found":"Nothing found","unavailable":"Search is unavailable","error":"Search failed","retry":"Retry","show-more":"Show more","max-items":"No more than {n}","remove":"Remove {label}","clear":"Clear","results":{"one":"{n} result","other":"{n} results"},"value-missing":"Choose a value."}}');

/***/ },

/***/ "12d14f068981"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Поиск и выбор","runtime":{"hint-min-length":{"one":"Введите хотя бы {n} символ","few":"Введите хотя бы {n} символа","many":"Введите хотя бы {n} символов","other":"Введите хотя бы {n} символа"},"searching":"Поиск…","nothing-found":"Ничего не найдено","unavailable":"Поиск недоступен","error":"Не удалось выполнить поиск","retry":"Повторить","show-more":"Показать ещё","max-items":"Не больше {n}","remove":"Удалить {label}","clear":"Очистить","results":{"one":"{n} результат","few":"{n} результата","many":"{n} результатов","other":"{n} результата"},"value-missing":"Выберите значение."}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("6fb05187bfff");
/******/
/******/ })()
;