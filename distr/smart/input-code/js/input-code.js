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

/***/ "38ea8d53f301"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FormField: () => (/* binding */ FormField),
/* harmony export */   ShownRequired: () => (/* binding */ ShownRequired),
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

};
/**
 * The required error a text field shows after a failed form check (owner
 * decision C55, sf-dropdown 1.9.0's look; C55 acceptance F1): once the
 * browser's check finds the field required and empty -- a submit attempt,
 * checkValidity(), reportValidity(), all of which fire `invalid` on the host
 * -- the field draws its error border and the component's value-missing word
 * under it, until the person's input fills it or the form is reset. The
 * browser's own bubble and its focus on the first invalid field are left as
 * they are. The page's invalid / error-message win over it.
 *
 * Usage, over FormField: `class SfThing extends ShownRequired(FormField(Element))`;
 * the template reads `sfShownInvalid(invalid)` and
 * `sfShownMessage(invalid, errorMessage)` instead of the bare settings.
 */

const ShownRequired = Base => class extends Base {
  constructor() {
    super();
    this.__sfMissingShown = false;
    this.addEventListener('invalid', () => {
      if (!this.validity?.valueMissing || this.__sfMissingShown) return;
      this.__sfMissingShown = true;
      this.requestComponentUpdate?.('invalid');
    });
  } // The shown required error goes once the value is no longer missing,
  // whatever filled it: the person's input or change, a value set from
  // script, a value attribute (C55 acceptance F1 R2, D1; sf-dropdown 1.9.0's
  // shownMissing reads the value the same way). Every one of them ends in
  // this sync, so the check is here and not on the events.


  sfSyncFormState() {
    super.sfSyncFormState?.();
    if (!this.__sfMissingShown || this.validity?.valueMissing) return;
    this.__sfMissingShown = false;
    this.requestComponentUpdate?.('value');
  }
  /** The required error is shown now. */


  get sfMissingShown() {
    return this.__sfMissingShown;
  }
  /** The invalid state the field draws: the page's, or the required one shown. */


  sfShownInvalid(invalid) {
    return Boolean(invalid) || this.__sfMissingShown;
  }
  /** The message under the field: the page's while it says invalid, else the required word. */


  sfShownMessage(invalid, errorMessage) {
    if (invalid) return errorMessage || '';
    return this.__sfMissingShown ? this.sfWord?.('value-missing') || '' : '';
  }

  formResetCallback() {
    const shown = this.__sfMissingShown;
    this.__sfMissingShown = false;
    super.formResetCallback?.();
    if (shown) this.requestComponentUpdate?.('reset');
  }

};

/***/ },

/***/ "6878c9003c89"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SfCodeInput: () => (/* binding */ SfCodeInput)
/* harmony export */ });
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _component_field_size__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("e6d86f2cd058");
/* harmony import */ var _component_field_contract__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("e138a730fd7c");
/* harmony import */ var _helpers_form_field__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("38ea8d53f301");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("e5f10aa473e6");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("a4a487df7872");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("363b524435da");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("e01f2016b34a");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("8498c2b6b41c");
/* harmony import */ var _code_mjs__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("fbc54cfd7755");
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("ac664264d5c0");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _component_field_size__WEBPACK_IMPORTED_MODULE_2__, _component_field_contract__WEBPACK_IMPORTED_MODULE_3__, _js_templates_default__WEBPACK_IMPORTED_MODULE_5__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _component_field_size__WEBPACK_IMPORTED_MODULE_2__, _component_field_contract__WEBPACK_IMPORTED_MODULE_3__, _js_templates_default__WEBPACK_IMPORTED_MODULE_5__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
// sf-input-code: a one-time code -- from a message, an authenticator, an email
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
//
// Since standard simai.smart-component 1.3.8 it is built from its
// component.json (§3, §4, §17): the settings are made by
// core/js/element-manifest.js, the words are lang/<locale>.json, the whole
// code is the fact `completed` (sf-input-code-completed; the old
// sf-code-input-completed and sf-code-input:complete follow it through
// aliases.json, as `error` follows
// `invalid`, §17.2), the ids come from the field's instance path and never a
// counter (§7.1.1, simai/ui-source#41), and the host is the form control
// through ElementInternals: it submits the code and reports the input's
// validity, and the input carries no name (§17.1).












const CodeInputElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_6__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_8__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_9__
  },
  source: 'ru',
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_7__
});

class SfCodeInput extends (0,_helpers_form_field__WEBPACK_IMPORTED_MODULE_4__.FormField)(CodeInputElement) {
  static get props() {
    return { ...super.props,
      templateName: {
        attribute: 'template',
        default: 'default'
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
    super(); // The value the last complete event was sent for: one event per code.

    this._completed = ''; // Where the selection stood before an edit (beforeinput), so typing over
    // a selection replaces it and typing into a cell takes the cell's place.

    this._selection = null; // What the field held when it took focus, and whether the native change
    // spoke for it: an edit the element rewrote may leave the browser with
    // nothing to report, and a commit is said once either way.

    this._focusValue = null;
    this._changeSent = false;
    this._form = null; // The cell a mouse drag started on, or -1, and whether the click that
    // ends a mouse press is already handled (K2).

    this._dragFrom = -1;
    this._mousePressed = false; // The cell the mouse is over, or -1 (K4).

    this._hover = -1;
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
    this.addEventListener('pointerdown', this.onPointerDown);
    this.addEventListener('pointermove', this.onPointerMove);
    this.addEventListener('pointerup', this.onPointerUp);
    this.addEventListener('pointercancel', this.onPointerUp);
    this.addEventListener('pointerleave', this.onPointerLeave);
    this.addEventListener('dblclick', this.onDoubleClick);
    this.addEventListener('copy', this.onCopy);
  }

  get length() {
    return (0,_code_mjs__WEBPACK_IMPORTED_MODULE_10__.codeLength)(this.getAttribute('length'));
  }

  get mode() {
    return (0,_code_mjs__WEBPACK_IMPORTED_MODULE_10__.codeMode)(this.getAttribute('mode'));
  } // An own alphabet (C82): only these characters are kept; set, it takes the
  // place of the mode.


  get charset() {
    return (0,_code_mjs__WEBPACK_IMPORTED_MODULE_10__.codeCharset)(this.getAttribute('charset'));
  } // Cells per group, a separator between the groups (C82: 3 + 3, 4 + 4), or 0.


  get groups() {
    return (0,_code_mjs__WEBPACK_IMPORTED_MODULE_10__.codeGroups)(this.getAttribute('groups'), this.length);
  } // What the code is made of: the mode, the alphabet and whether letters
  // become capitals (C82), as code.mjs reads it.
  // (The setting is copied in by member, not as an object key: the loader
  // reads a bare word of this file as a utility class, and the bare
  // `uppercase` asked for utility.font-transform.)


  get kind() {
    const settings = {
      mode: this.mode,
      charset: this.charset
    };
    settings.uppercase = this.uppercase;
    return (0,_code_mjs__WEBPACK_IMPORTED_MODULE_10__.codeKind)(settings);
  }

  get numeric() {
    return (0,_code_mjs__WEBPACK_IMPORTED_MODULE_10__.codeInputMode)(this.kind) === 'numeric';
  }

  get size() {
    return (0,_component_field_size__WEBPACK_IMPORTED_MODULE_2__.ladderSize)(this.getAttribute('size'));
  }

  get ariaLabel() {
    return this.getProp('ariaLabel') || '';
  } // The code: the native input's, kept to the mode and the length.


  get value() {
    const input = this.getInputElement();
    return (0,_code_mjs__WEBPACK_IMPORTED_MODULE_10__.normaliseCode)(input ? input.value : this.getAttribute('value') ?? this.defaultValue, this.kind, this.length);
  } // Setting the value writes the field and its cells, as the native input's
  // own value does: no input, change or complete event, which are the
  // person's.


  set value(next) {
    const value = next === null || next === undefined ? '' : (0,_code_mjs__WEBPACK_IMPORTED_MODULE_10__.normaliseCode)(next, this.kind, this.length);
    if (next === null || next === undefined) this.removeAttribute('value');else this.setAttribute('value', value);
    const input = this.getInputElement();
    if (input && input.value !== value) input.value = value;
    this._lastValue = value;
    this._completed = value.length === this.length ? value : '';
    this.syncCells();
    this.sfSyncFormState?.();
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
    return this.sfWord(key);
  } // «цифра 3 из 6» -- the cell the caret is in, in the page's language.


  positionText(cell) {
    return (0,_code_mjs__WEBPACK_IMPORTED_MODULE_10__.positionWords)(this.text(this.numeric ? 'digit' : 'character'), cell, this.length);
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

    if (event.inputType === 'insertText' && typeof event.data === 'string' && event.data.length > 0 && (0,_code_mjs__WEBPACK_IMPORTED_MODULE_10__.normaliseCode)(event.data, this.kind, this.length) === '') {
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
    } = (0,_code_mjs__WEBPACK_IMPORTED_MODULE_10__.applyEdit)({
      previous,
      raw: input.value,
      caret: input.selectionStart ?? input.value.length,
      data: event.data ?? null,
      inputType: event.inputType || '',
      selection: this._selection,
      mode: this.kind,
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
    const next = (0,_code_mjs__WEBPACK_IMPORTED_MODULE_10__.applyPaste)({
      previous: input.value,
      text,
      start: input.selectionStart ?? 0,
      end: input.selectionEnd ?? 0,
      mode: this.kind,
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

    this.markCell();
    this.syncCells();

    if (value.length === this.length) {
      if (this._completed !== value) {
        this._completed = value; // After the input event has reached every listener, so a host reads
        // the whole code in both. sf-input-code-completed, then the old
        // sf-code-input-completed and sf-code-input:complete with the same
        // detail (aliases.json).

        setTimeout(() => this.sfEmit('completed', {
          value
        }), 0);
      }
    } else {
      this._completed = '';
    }
  } // The keys are the field's own: Backspace clears the marked cell, or the
  // one before a bare caret, and steps back; Delete clears the marked cell;
  // the arrows move a cell at a time (a native arrow only collapses the
  // one-cell mark, and the mark would come back on the same cell), Shift
  // with them grows the selection by a cell. Home and End go to the first
  // cell and past the last character on every platform: a Mac field leaves
  // them to the page, and scrolls. The caret's cell is read once the key has
  // done its work.


  onKeydown = event => {
    const input = this.ownInput(event.target);
    if (!input) return;
    const plain = !event.altKey && !event.ctrlKey && !event.metaKey;
    const start = input.selectionStart ?? 0;
    const end = input.selectionEnd ?? start;
    const length = input.value.length;

    if ((event.key === 'Home' || event.key === 'End') && plain) {
      event.preventDefault();
      const at = event.key === 'Home' ? 0 : length;
      if (event.shiftKey) input.setSelectionRange(Math.min(at, start), Math.max(at, end), at < start ? 'backward' : 'forward');else input.setSelectionRange(at, at);
    } else if ((event.key === 'ArrowLeft' || event.key === 'ArrowRight') && plain) {
      event.preventDefault();
      const back = event.key === 'ArrowLeft';

      if (event.shiftKey) {
        if (back) input.setSelectionRange(Math.max(0, start - 1), end, 'backward');else input.setSelectionRange(start, Math.min(length, end + 1), 'forward');
      } else {
        const at = back ? Math.max(0, start - 1) : Math.min(length, start + 1);
        input.setSelectionRange(at, at);
      }

      this.onCaret();
    }

    setTimeout(this.onCaret, 0);
  }; // The cell under a point: the input lies transparent over the cells and its
  // own caret position knows nothing of them.

  cellAt(x) {
    const cells = this.cells();
    const index = cells.findIndex(cell => x < cell.getBoundingClientRect().right);
    return index === -1 ? cells.length - 1 : Math.max(index, 0);
  } // A tap or a click lands in the cell under the pointer. A mouse press has
  // placed the caret already (onPointerDown), and its click must not collapse
  // what a drag or a double click selected (K2: the click reset a drag of
  // cells 2-5 to a caret at 4); a selection of more than one cell is kept.


  onClick = event => {
    const input = this.ownInput(event.target);
    if (!input || input.disabled) return;

    if (this._mousePressed) {
      this._mousePressed = false;
      return;
    }

    if ((input.selectionEnd ?? 0) - (input.selectionStart ?? 0) > 1) return;
    const at = Math.min(this.cellAt(event.clientX), input.value.length);
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
    input.closest('.sf-verification')?.classList.remove('sf-verification--pointer-focus');
    this.syncCells(); // While focusout runs the input may still be the active element.

    setTimeout(this.onCaret, 0);
  }; // A press on the field: its focus is the pointer's, so the sheet draws no
  // ring on the active cell, only its primary border, until the focus leaves
  // (K1, as sf-input's .sf-input--pointer-focus).
  // A mouse selects by cells (K2): a press puts the caret in the cell under
  // it, a drag selects the cells it crosses, a double click the whole code.
  // The browser's own selection would follow the transparent input's text,
  // not the cells. A touch is left to the browser (its caret, long-press menu
  // and paste), then the click puts the caret in the cell.

  onPointerDown = event => {
    const input = this.ownInput(event.target);
    if (!input) return;
    input.closest('.sf-verification')?.classList.add('sf-verification--pointer-focus');
    this._mousePressed = false;
    if (event.pointerType !== 'mouse' || event.button !== 0 || input.disabled) return;
    event.preventDefault();
    this._mousePressed = true;
    if (input.ownerDocument?.activeElement !== input) input.focus({
      preventScroll: true
    });
    const at = Math.min(this.cellAt(event.clientX), input.value.length);
    this._dragFrom = -1;
    input.setSelectionRange(at, at);
    this.markCell();
    this._dragFrom = at;

    try {
      input.setPointerCapture(event.pointerId);
    } catch {
      /* a synthetic press */
    }

    this.syncCells();
  }; // A double click selects the whole code, as a word in a field.

  onDoubleClick = event => {
    const input = this.ownInput(event.target);
    if (!input || input.disabled) return;
    this._dragFrom = -1;
    input.setSelectionRange(0, input.value.length, 'forward');
    this.syncCells();
  }; // The pointer marks the one cell it is over (K4: the whole group lit up on
  // hover, and hid the current cell's mark); a drag selects.

  onPointerMove = event => {
    const input = this.ownInput(event.target);
    if (!input) return;
    const at = this.cellAt(event.clientX);

    if (event.pointerType === 'mouse') {
      const hover = input.disabled ? -1 : at;

      if (hover !== this._hover) {
        this._hover = hover;
        this.syncCells();
      }
    }

    if (this._dragFrom < 0 || !(event.buttons & 1)) return;
    const from = Math.min(this._dragFrom, at);
    const to = Math.min(Math.max(this._dragFrom, at) + 1, input.value.length);

    if (to > from && (input.selectionStart !== from || input.selectionEnd !== to)) {
      input.setSelectionRange(from, to, at < this._dragFrom ? 'backward' : 'forward');
      this.syncCells();
    }
  };
  onPointerLeave = () => {
    if (this._hover === -1) return;
    this._hover = -1;
    this.syncCells();
  };
  onPointerUp = () => {
    if (this._dragFrom < 0) return;
    this._dragFrom = -1;
    this.onCaret();
  }; // Copy gives the code that is selected, never a masked one (K2).

  onCopy = event => {
    const input = this.ownInput(event.target);
    if (!input) return;

    if (this.mask) {
      event.preventDefault();
      return;
    }

    const start = input.selectionStart ?? 0;
    const end = input.selectionEnd ?? start;
    if (end <= start || !event.clipboardData) return;
    event.preventDefault();
    event.clipboardData.setData('text/plain', input.value.slice(start, end));
  };
  onCaret = () => {
    this.markCell();
    this.syncCells();
  }; // A bare caret inside the code becomes a one-cell selection (input-otp's
  // rule): what is marked is what typing replaces and Backspace or Delete
  // clears (K3). A caret after the last character stays bare: the next
  // character goes there.

  markCell() {
    const input = this.getInputElement();
    if (!input || input.ownerDocument?.activeElement !== input || this._dragFrom >= 0) return;
    const start = input.selectionStart;
    if (start === null || start !== input.selectionEnd || start >= input.value.length) return;
    input.setSelectionRange(start, start + 1, 'forward');
  }

  cells() {
    return Array.from(this.querySelectorAll(':scope .sf-verification-cell'));
  } // The cell the caret is in: the caret's while the field has focus, else the
  // one the next character goes to, as the class runtime draws it.


  caretCell(input) {
    const focused = input && input.ownerDocument?.activeElement === input;
    const at = focused ? input.selectionStart ?? input.value.length : input?.value.length ?? 0;
    return (0,_code_mjs__WEBPACK_IMPORTED_MODULE_10__.currentCell)(at, this.length);
  } // The cells show the code (or a dot for each character when masked), the
  // filled ones `active`, the caret's `current` -- only while the field has
  // the focus: a field at rest marked the next cell and looked focused (K6);
  // the sheet gates it on focus too. A bare caret is drawn in its cell
  // (`caret`; `caret-end` after the last character of a whole code, K3): the
  // input itself is transparent. A selection of more than one cell paints
  // its cells `selected` (K2). The position line says the caret's cell,
  // spoken once each time it moves.


  syncCells() {
    const input = this.getInputElement();
    if (!input) return;
    const value = input.value;
    const focused = input.ownerDocument?.activeElement === input;
    const start = input.selectionStart ?? value.length;
    const end = input.selectionEnd ?? start;
    const one = end - start <= 1;
    const current = this.caretCell(input);
    const bare = focused && start === end && !this.readonly;
    this.cells().forEach((cell, index) => {
      const character = value[index] || '';
      const shown = character && this.mask ? _code_mjs__WEBPACK_IMPORTED_MODULE_10__.MASK_GLYPH : character;
      if (cell.textContent !== shown) cell.textContent = shown;
      cell.classList.toggle('active', index < value.length);
      cell.classList.toggle('current', focused && one && index === current);
      const selected = focused && !one && index >= start && index < end;
      cell.classList.toggle('selected', selected); // Hover marks one cell, never over the current cell's mark or a
      // selection (K4).

      cell.classList.toggle('hover', index === this._hover && !selected && !(focused && one && index === current));
      cell.classList.toggle('caret', bare && index === current);
      cell.classList.toggle('caret-end', bare && index === current && start >= this.length);
    }); // A live line: a screen reader says it each time the caret changes cell,
    // and reads it with the field when the field takes focus.

    const position = this.querySelector(':scope .sf-code-input-position');
    const words = this.positionText(current);
    if (position && position.textContent !== words) position.textContent = words;
  } // A code that is not whole is too short. The inner input carries no
  // pattern: its mismatch was the browser's English tooltip over the cells
  // («Please match the requested format.», K5), and the characters are already
  // kept to the mode. The host says it through ElementInternals, in the page's
  // words; a custom error and an empty required field come first, as before.


  sfSyncValidity() {
    const input = this.getInputElement();
    const value = input?.value ?? '';
    const short = Boolean(input) && !input.disabled && value.length > 0 && value.length < this.length;
    (0,_helpers_form_field__WEBPACK_IMPORTED_MODULE_4__.syncFieldValidity)(this, input, short ? {
      tooShort: this.text('too-short')
    } : {});
  }

  onFormReset = () => {
    // The browser writes the default back after the reset event.
    requestAnimationFrame(() => {
      this._lastValue = this.getInputElement()?.value ?? '';
      this._completed = '';
      this.syncCells();
      this.sfSyncFormState();
    });
  }; // The browser's restore of a form (back, reload) gives the code back.

  formStateRestoreCallback(state) {
    if (typeof state === 'string') this.value = state;
  }

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
    const invalid = this.invalid;
    const field = (0,_component_field_contract__WEBPACK_IMPORTED_MODULE_3__.createFieldContract)(this, {
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

    const defaultCode = (0,_code_mjs__WEBPACK_IMPORTED_MODULE_10__.normaliseCode)(this.defaultValue, this.kind, this.length);
    const value = hasControlledValue ? (0,_code_mjs__WEBPACK_IMPORTED_MODULE_10__.normaliseCode)(this.getAttribute('value'), this.kind, this.length) : input ? (0,_code_mjs__WEBPACK_IMPORTED_MODULE_10__.normaliseCode)(input.value, this.kind, this.length) : defaultCode;
    return this.createTemplateContext({ ...props,
      component,
      // The field's ids come from its instance path (§7.1.1, #41).
      id: field.base,
      field,
      size: this.size,
      filled: this.appearance === 'filled',
      label: this.label,
      hasLabel,
      labelContent,
      required: this.required,
      disabled: this.disabled,
      readonly: this.readonly,
      // The host is the form control where the browser has ElementInternals,
      // so the input carries no name (§17.1 item 6).
      controlName: (0,_helpers_form_field__WEBPACK_IMPORTED_MODULE_4__.innerControlName)(this, this.name),
      value,
      defaultValue: this.defaultValue,
      defaultCode,
      mode: this.mode,
      length: this.length,
      mask: this.mask,
      inputMode: (0,_code_mjs__WEBPACK_IMPORTED_MODULE_10__.codeInputMode)(this.kind),
      // Letters become capitals: the keyboard offers them (C82). Not named
      // after the setting: the loader reads template words as utility classes.
      capitals: this.kind.uppercase,
      groups: this.groups,
      // The cells a group separator follows (C82).
      separators: Array.from({
        length: this.length
      }, (_, index) => index).filter(index => (0,_code_mjs__WEBPACK_IMPORTED_MODULE_10__.separatorAfter)(index, this.groups, this.length)),
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
    this.sfSyncFormState();
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_5__.renderCodeInputTemplate)(this.templateContext());
  }

}

SfCodeInput.define('sf-input-code');

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "e5f10aa473e6"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderCodeInputTemplate: () => (/* binding */ renderCodeInputTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var lit_directives_live_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("2d6390ae26b0");
/* harmony import */ var lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("efa66f8927d1");
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
    controlName,
    value,
    defaultCode,
    mode,
    length,
    mask,
    inputMode,
    capitals,
    groups,
    separators = [],
    ariaLabel,
    groupLabel,
    messageContent,
    messageIsError
  } = context;
  const labelId = `${id}--label`;
  const positionId = `${id}--position`;
  const describedBy = [positionId, messageContent ? field.messageId : ''].filter(Boolean).join(' '); // The cells, with a separator after each group (C82: 3 + 3, 4 + 4): a
  // picture only, aria-hidden with the cells, never in the value or a copy.

  const parts = [];

  for (let index = 0; index < length; index += 1) {
    parts.push({
      key: `cell-${index}`,
      separator: false
    });
    if (separators.includes(index)) parts.push({
      key: `separator-${index}`,
      separator: true
    });
  }

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div
      class=${joinClasses('sf-verification-form', `sf-verification-form--size-${size}`, filled ? 'sf-verification-form--filled' : '', field.invalid ? 'error' : '', 'sf-code-input', context.rootClass)}
      style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      role="group"
      aria-labelledby=${hasLabel ? labelId : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      aria-label=${hasLabel ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : groupLabel}
      data-length=${String(length)}
      data-mode=${mode}
      data-groups=${groups ? String(groups) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
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
          autocapitalize=${capitals ? 'characters' : 'off'}
          autocorrect="off"
          spellcheck="false"
          dir="ltr"
          name=${controlName || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
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
        <span class="sf-verification-cells" aria-hidden="true">${(0,lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_2__.repeat)(parts, part => part.key, part => part.separator ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-verification-separator"></span>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-verification-cell"></span>`)}</span>
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

/***/ "ac664264d5c0"
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

/***/ "efa66f8927d1"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit/directives/repeat.js", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("lit/directives/repeat.js", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "2a080a730149"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("lit", 1).then(resolve, reject), { once: true })));

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

/***/ "fbc54cfd7755"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CODE_GROUPS_MAX: () => (/* binding */ CODE_GROUPS_MAX),
/* harmony export */   CODE_INPUT_TEXT: () => (/* binding */ CODE_INPUT_TEXT),
/* harmony export */   CODE_LENGTH_DEFAULT: () => (/* binding */ CODE_LENGTH_DEFAULT),
/* harmony export */   CODE_LENGTH_MAX: () => (/* binding */ CODE_LENGTH_MAX),
/* harmony export */   CODE_MODES: () => (/* binding */ CODE_MODES),
/* harmony export */   MASK_GLYPH: () => (/* binding */ MASK_GLYPH),
/* harmony export */   applyEdit: () => (/* binding */ applyEdit),
/* harmony export */   applyPaste: () => (/* binding */ applyPaste),
/* harmony export */   codeCharset: () => (/* binding */ codeCharset),
/* harmony export */   codeGroups: () => (/* binding */ codeGroups),
/* harmony export */   codeInputMode: () => (/* binding */ codeInputMode),
/* harmony export */   codeKind: () => (/* binding */ codeKind),
/* harmony export */   codeLength: () => (/* binding */ codeLength),
/* harmony export */   codeMode: () => (/* binding */ codeMode),
/* harmony export */   currentCell: () => (/* binding */ currentCell),
/* harmony export */   keepCharacters: () => (/* binding */ keepCharacters),
/* harmony export */   normaliseCode: () => (/* binding */ normaliseCode),
/* harmony export */   positionWords: () => (/* binding */ positionWords),
/* harmony export */   separatorAfter: () => (/* binding */ separatorAfter)
/* harmony export */ });
// The parts of sf-input-code that are about the code, not the page: which
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
// The cells per group a separator is drawn between (C82: 3 + 3, 4 + 4).
const CODE_GROUPS_MAX = 6;

function codeMode(value) {
  const raw = value && typeof value === 'object' ? value.mode : value;
  const mode = String(raw ?? '').trim().toLowerCase();
  return CODE_MODES.includes(mode) ? mode : 'numeric';
}

// An own alphabet (owner C82, for example Steam Guard's
// 23456789BCDFGHJKMNPQRTVWXY, without 0 O 1 I): each character once, no
// spaces, as written. Empty when there is none.
function codeCharset(value) {
  return [...new Set([...String(value ?? '')].filter((character) => !/\s/u.test(character)))].join('');
}

// What a code is made of, from the settings: {mode, charset, uppercase}. A
// mode string alone is a kind without an alphabet or capitals. The charset,
// when there is one, takes the place of the mode; uppercase turns letters
// into capitals before the characters are kept.
function codeKind(value = 'numeric') {
  if (value && typeof value === 'object') {
    return {mode: codeMode(value.mode), charset: codeCharset(value.charset), uppercase: Boolean(value.uppercase)};
  }
  return {mode: codeMode(value), charset: '', uppercase: false};
}

// Only the characters the kind keeps, in order.
function keepCharacters(text, kind = 'numeric') {
  const {mode, charset, uppercase} = codeKind(kind);
  const source = uppercase ? String(text ?? '').toUpperCase() : String(text ?? '');
  if (charset) return [...source].filter((character) => charset.includes(character)).join('');
  return source.replace(MODE_FILTER[mode], '');
}

// Cells per group, or 0 for none: a group is two cells or more and shorter
// than the code, so a separator always has cells on both sides.
function codeGroups(value, length = CODE_LENGTH_DEFAULT) {
  const groups = Number.parseInt(String(value ?? ''), 10);
  if (!Number.isFinite(groups) || groups < 2 || groups > CODE_GROUPS_MAX) return 0;
  return groups < codeLength(length) ? groups : 0;
}

// Whether a separator follows the cell: the end of a group, not the code.
function separatorAfter(index, groups, length) {
  return groups > 0 && index + 1 < codeLength(length) && (index + 1) % groups === 0;
}

function codeLength(value) {
  const length = Number.parseInt(String(value ?? ''), 10);
  if (!Number.isFinite(length) || length < 1) return CODE_LENGTH_DEFAULT;
  return Math.min(length, CODE_LENGTH_MAX);
}

// Only the characters the mode keeps, no longer than the code: what typing,
// pasting and autofill leave in the field.
function normaliseCode(value, mode = 'numeric', length = CODE_LENGTH_DEFAULT) {
  return keepCharacters(value, mode).slice(0, codeLength(length));
}

// What the keyboard offers: digits for a numeric code or an alphabet of
// digits only, letters otherwise.
function codeInputMode(mode) {
  const {mode: base, charset} = codeKind(mode);
  if (charset) return /^[0-9]+$/u.test(charset) ? 'numeric' : 'text';
  return base === 'numeric' ? 'numeric' : 'text';
}

// The cell the next character goes to: the caret's, never past the last cell.
function currentCell(caret, length) {
  const at = Number.isFinite(caret) ? caret : 0;
  return Math.max(0, Math.min(at, codeLength(length) - 1));
}

// `mode` below is a mode string or a kind ({mode, charset, uppercase}).
//
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
  const inserted = typed === null ? '' : keepCharacters(typed, mode);

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
  const pasted = keepCharacters(text, mode);
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
    'too-short': 'Enter the whole code',
  },
  ru: {
    digit: 'цифра {n} из {m}',
    character: 'символ {n} из {m}',
    group: 'Код',
    'too-short': 'Введите код целиком',
  },
};

function positionWords(template, cell, length) {
  return String(template).replace('{n}', String(cell + 1)).replace('{m}', String(codeLength(length)));
}


/***/ },

/***/ "363b524435da"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-input-code for the shim (stands/18-aliases-ci/alias.mjs, standard §16 item 20). mode: same-detail (the shim sends the new and the old name), split / detail-adds (a detail adapter, refused by the shim), attribute-and-property, method, property, manifest-only (the DOM name does not change), host-attribute (no shim), retired.","component":"sf-input-code","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"aria-label","to":null,"kind":"attribute","component":"sf-input-code","since":"2026-10-27","remove_after":"2026-12-01","mode":"host-attribute","section":"§3.1","note":"stays a host attribute, read by the base (§3.1, §4.8); no shim"},{"from":"sf-code-input:complete","to":"sf-code-input-completed","kind":"event","component":"sf-input-code","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","cancelable":false,"manifest":{"from":"sf-code-input-complete","to":"completed"},"alias-table":{"to":"sf-code-input-complete","status":"planned","alias_mode":"same-detail"}},{"from":"error","to":"invalid","kind":"setting","component":"sf-input-code","since":"2026-10-27","remove_after":"2026-12-01","section":"§17.2","note":"error is a dated alias of invalid; the shim maps the attribute and the property"},{"from":"sf-code-input","to":"sf-input-code","kind":"tag","component":"sf-input-code","since":"2026-11-03","remove_after":"2027-01-01","section":"rename plan R0 (ui-control RENAME-PLAN-2026-11-03), naming decision 2026-11-02","note":"the element is sf-input-code; sf-code-input is a subclass defined beside it until the date"},{"from":"sf-code-input-completed","to":"sf-input-code-completed","kind":"event","component":"sf-input-code","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"}]}');

/***/ },

/***/ "a4a487df7872"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.input-code","tag":"sf-input-code","version":"1.4.0","kind":"leaf","settings":{"length":{"type":"number","default":6},"default-value":{"type":"string","default":""},"name":{"type":"string","default":""},"mode":{"type":"enum","values":["numeric","alphanumeric"],"default":"numeric"},"charset":{"type":"string","default":""},"uppercase":{"type":"boolean","default":false},"groups":{"type":"number","default":0},"size":{"type":"enum","values":["1/3","1/2","1","2","3"],"default":"1"},"appearance":{"type":"enum","values":["bordered","filled"],"default":"bordered"},"label":{"type":"string","default":""},"hint":{"type":"string","default":""},"required":{"type":"boolean","default":false},"disabled":{"type":"boolean","default":false},"readonly":{"type":"boolean","default":false},"invalid":{"type":"boolean","default":false},"error-message":{"type":"string","default":""},"mask":{"type":"boolean","default":false}},"values":{"value":{"type":"string","default":""}},"events":{"input":{"carries":"native"},"change":{"carries":"native"},"completed":{"carries":{"value":{"type":"string"}}}},"actions":{},"form":{"value":"value","name":"name","default":"value","submits":"value","reset":"default","required":"required","disabled":"disabled","readonly":"readonly","validity":["value-missing","too-short","custom-error"]},"css-variables":{"--sf-verification-background-color":{"type":"color","state":"default"},"--sf-verification-border-color":{"type":"color","state":"default"},"--sf-verification-border-width":{"type":"length","state":"default"},"--sf-verification-radius":{"type":"length","state":"default"},"--sf-verification-color":{"type":"color","state":"default"},"--sf-verification-cell-size":{"type":"length","state":"default"},"--sf-verification-gap":{"type":"length","state":"default"},"--sf-verification-invalid-border-color":{"type":"color","state":"invalid"}}}');

/***/ },

/***/ "e01f2016b34a"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Code input","runtime":{"character":"character {n} of {m}","digit":"digit {n} of {m}","group":"Code","too-short":"Enter the whole code"}}');

/***/ },

/***/ "8498c2b6b41c"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Код подтверждения","runtime":{"character":"символ {n} из {m}","digit":"цифра {n} из {m}","group":"Код","too-short":"Введите код целиком"}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("6878c9003c89");
/******/
/******/ })()
;