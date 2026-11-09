/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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

/***/ "99f89ebdf0fb"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SfInputChoice: () => (/* binding */ SfInputChoice)
/* harmony export */ });
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _core_js_instance_path__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("e92fd2d1a38c");
/* harmony import */ var _helpers_form_field__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("38ea8d53f301");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("0bbe2ffd494c");
/* harmony import */ var _js_choice_model_mjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("a5350ee6efc2");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("0c1826bbbeb3");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("68b61d1e5ff4");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("eb10921c1c1e");
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("0517be6f999f");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_instance_path__WEBPACK_IMPORTED_MODULE_2__, _js_templates_default__WEBPACK_IMPORTED_MODULE_4__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_instance_path__WEBPACK_IMPORTED_MODULE_2__, _js_templates_default__WEBPACK_IMPORTED_MODULE_4__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_instance_path__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_core_js_instance_path__WEBPACK_IMPORTED_MODULE_2__);









 // sf-input-choice: a form field that picks one option, or several, from
// cards -- a site's kind, a page type, a template, a backup target, a plan,
// delivery or payment -- each with a title, a description, a badge, a price
// and term, an icon or an image, in one of three layouts (list, tile,
// picture; owner decision C28). Larena's request msg-993e1e39 item 3 (choice
// cards).
//
// From its component.json (standard simai.smart-component 1.3.14 §3, §4, §8,
// §17): the settings are made by core/js/element-manifest.js; the host is the
// form control through ElementInternals and sends the chosen values. The
// cards are native radios (single) or checkboxes (multiple), so the keyboard
// is the browser's -- the arrow keys move and choose in a radio group, Space
// toggles a checkbox -- and a person's press says input and change once; a
// value set from code, a form reset and a restore say nothing.
//
// While the host submits, the inner inputs are taken out of the page's form by
// a `form` attribute that names no form (§17.1 item 6), and their name is the
// host's path id, so the radios of one element are one group and two elements
// never share one.

const ChoiceElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_6__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_7__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_8__
  },
  source: 'en'
}); // The id the inner inputs' form attribute names: no element carries it.

const NO_FORM = 'sf-input-choice-no-form';

class SfInputChoice extends (0,_helpers_form_field__WEBPACK_IMPORTED_MODULE_3__.FormField)(ChoiceElement) {
  static get props() {
    return { ...super.props,
      rootClass: {
        attribute: 'root-class',
        default: ''
      }
    };
  } // value is a property, but a page prints it as an attribute too: one value,
  // or the values separated by commas.


  static get observedAttributes() {
    return [...new Set([...super.observedAttributes, 'value', 'items'])];
  }

  constructor() {
    super(); // undefined: follow the value attribute (the default a reset returns to).

    this._value = undefined; // A value set as a property before the element was defined is an own
    // property that would hide the accessor; it is taken through it.

    if (Object.prototype.hasOwnProperty.call(this, 'value')) {
      const early = this.value;
      delete this.value;
      this._value = early;
    } // The inner inputs' own input and change stay inside: the host says its
    // own, once, with the choice in the detail.


    this.addEventListener('input', this.onInnerEvent, true);
    this.addEventListener('change', this.onInnerEvent, true);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // The value attribute written again is the value again.
    if (name === 'value' && oldValue !== newValue) {
      this._value = undefined;
      this.requestComponentUpdate?.('value');
      this.sfSyncFormState?.();
    } // A list setting is a property (or the JSON island); the attribute holds
    // the same list as JSON, as sf-menu's items.


    if (name === 'items' && oldValue !== newValue) this.requestComponentUpdate?.('items');
    super.attributeChangedCallback(name, oldValue, newValue);
  } // ---------------------------------------------------------- settings
  // The options: the property or the island, else the attribute's JSON.


  get options() {
    const given = this.items;
    if (Array.isArray(given) && given.length) return (0,_js_choice_model_mjs__WEBPACK_IMPORTED_MODULE_5__.normaliseItems)(given);
    return (0,_js_choice_model_mjs__WEBPACK_IMPORTED_MODULE_5__.normaliseItems)(this.getAttribute('items'));
  }

  get effectiveDisabled() {
    return Boolean(this.disabled || this.sfFormDisabled);
  }

  get columnsValue() {
    const columns = String(this.columns ?? 'auto');
    return _js_choice_model_mjs__WEBPACK_IMPORTED_MODULE_5__.CHOICE_COLUMNS.includes(columns) ? columns : 'auto';
  }

  get layoutValue() {
    const layout = String(this.layout ?? 'tile');
    return _js_choice_model_mjs__WEBPACK_IMPORTED_MODULE_5__.CHOICE_LAYOUTS.includes(layout) ? layout : 'tile';
  }
  /** The chosen values, in the order of the options: one, or several when multiple. */


  get selected() {
    const raw = this._value !== undefined ? this._value : this.getAttribute('value');
    return (0,_js_choice_model_mjs__WEBPACK_IMPORTED_MODULE_5__.orderValues)((0,_js_choice_model_mjs__WEBPACK_IMPORTED_MODULE_5__.parseValue)(raw ?? '', Boolean(this.multiple)), this.options);
  }
  /** One value, or the values joined by commas when multiple; '' when nothing is chosen. */


  get value() {
    return (0,_js_choice_model_mjs__WEBPACK_IMPORTED_MODULE_5__.formatValue)(this.selected);
  } // Set from code it is not a change: no event, as for a native field.


  set value(next) {
    this._value = next === undefined || next === null ? undefined : (0,_js_choice_model_mjs__WEBPACK_IMPORTED_MODULE_5__.formatValue)((0,_js_choice_model_mjs__WEBPACK_IMPORTED_MODULE_5__.parseValue)(next, Boolean(this.multiple)));
    this.requestComponentUpdate?.('value');
    this.sfSyncFormState?.();
  }
  /** The cards' inputs, in order. */


  get inputs() {
    return [...this.querySelectorAll('.sf-choice-input')].filter(input => input.closest('sf-input-choice') === this);
  }

  getInputElement() {
    return null;
  } // The first card that takes the focus: the chosen one, else the first
  // enabled one -- where Tab lands in a radio group.


  focusDelegate() {
    const inputs = this.inputs.filter(input => !input.disabled);
    return inputs.find(input => input.checked) || inputs[0] || null;
  } // ---------------------------------------------------------- the person


  onInnerEvent = event => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement) || !input.classList.contains('sf-choice-input') || input.closest('sf-input-choice') !== this) return;
    event.stopPropagation();
    if (event.type !== 'change') return;
    const item = this.options.find(one => one.value === input.value);
    if (!item) return;
    const multiple = Boolean(this.multiple);
    const next = (0,_js_choice_model_mjs__WEBPACK_IMPORTED_MODULE_5__.applyChoice)(this.selected, this.options, item.value, input.checked, multiple);
    this._value = (0,_js_choice_model_mjs__WEBPACK_IMPORTED_MODULE_5__.formatValue)(next);
    this.requestComponentUpdate('value');
    this.sfSyncFormState();
    const detail = {
      value: this.value,
      values: [...next],
      item: { ...item
      },
      checked: input.checked
    };
    this.sfEmit('input', detail);
    this.sfEmit('change', detail);
  }; // ---------------------------------------------------------- form
  // The values alone: one entry, or one entry per chosen value under the
  // name (§17.1); nothing while disabled or empty.

  sfFormValue() {
    if (this.effectiveDisabled) return null;
    const entries = this.selected;
    if (!entries.length) return null;
    if (!this.multiple) return entries[0];
    const name = this.name || '';
    if (!name || typeof FormData !== 'function') return entries.join(',');
    const data = new FormData();

    for (const entry of entries) data.append(name, entry);

    return data;
  }

  fieldValidity() {
    const missing = Boolean(this.required) && !this.effectiveDisabled && this.selected.length === 0;
    return {
      valueMissing: missing,
      message: missing ? this.sfWord('value-missing') : '',
      anchor: this.focusDelegate()
    };
  } // form.reset(): the value attribute back, without events.


  fieldReset() {
    this._value = undefined;
    this.requestComponentUpdate('reset');
  }

  fieldRestore(state) {
    let values = state;
    if (typeof FormData === 'function' && state instanceof FormData) values = state.getAll(this.name || '').map(String);
    if (values === null || values === undefined) return;
    this._value = (0,_js_choice_model_mjs__WEBPACK_IMPORTED_MODULE_5__.formatValue)((0,_js_choice_model_mjs__WEBPACK_IMPORTED_MODULE_5__.parseValue)(values, Boolean(this.multiple)));
    this.requestComponentUpdate('restore');
  } // ---------------------------------------------------------- drawing


  templateContext() {
    const props = this.getPropsContext();
    const internals = Boolean(this.sfInternals);
    const id = (0,_core_js_instance_path__WEBPACK_IMPORTED_MODULE_2__.partId)((0,_core_js_instance_path__WEBPACK_IMPORTED_MODULE_2__.instancePath)(this, {
      kind: 'sf-input-choice'
    }));
    return this.createTemplateContext({ ...props,
      component: this,
      id,
      items: this.options,
      chosen: new Set(this.selected),
      multiple: Boolean(this.multiple),
      columns: this.columnsValue,
      layout: this.layoutValue,
      label: this.label || '',
      ariaLabel: this.getAttribute('aria-label') || '',
      hint: this.hint || '',
      errorMessage: this.errorMessage || '',
      invalid: Boolean(this.invalid),
      required: Boolean(this.required),
      // The field's own disabled or a disabled fieldset's (formDisabledCallback),
      // under a name of its own: the disabled getter is the setting alone.
      fieldDisabled: this.effectiveDisabled,
      // Without ElementInternals the named inner inputs submit, as before.
      controlName: internals ? `${id}--choice` : this.name || `${id}--choice`,
      innerForm: internals ? NO_FORM : '',
      rootClass: this.getRootClass()
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_4__.renderChoiceTemplate)(this.templateContext());
  }

  afterRender(callback) {
    if (typeof callback === 'function') return super.afterRender(callback);
    this.sfSyncFormState();
    return undefined;
  }

}

SfInputChoice.define('sf-input-choice');

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "0bbe2ffd494c"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderChoiceTemplate: () => (/* binding */ renderChoiceTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("efa66f8927d1");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__);

 // sf-input-choice's markup: the label row, the cards and the hint or error
// line under them (owner decision C28, prototype input-choice-world.html).
//
//   div.sf-choice[data-layout=list|tile|picture]
//     span.sf-choice-label            names the group (aria-labelledby)
//     div.sf-choice-grid              role radiogroup (single) or group (multiple)
//       label.sf-choice-card          one per option; the whole card is the target
//         span.sf-choice-media        picture: the image, to the card's edges
//         span.sf-choice-head         the name line and what hangs from it
//           span.sf-radio-button | span.sf-checkbox
//                                     the class radio or checkbox sf-radio and
//                                     sf-checkbox draw, size 1: its box is the
//                                     name line; the native input is in it
//           span.sf-choice-body       the name (icon, title, sf-badge) and the description
//           span.sf-choice-meta       list: price and term, a column at the line's end
//         span.sf-choice-rule         tile and picture with a price: the divider
//         span.sf-choice-price        tile and picture: price and term at the foot
//     span.sf-choice-message          the hint, or the error while invalid
//
// The native inputs are the control: the arrow keys move and choose in a
// radio group, Space toggles a checkbox, and each is named by its title (and
// badge; never the icon's ligature) and
// described by its description, price and term. While the host is the form
// control they stay out of the page's form (§17.1 item 6).

const joinClasses = (...tokens) => tokens.flat().filter(Boolean).join(' '); // The control on the name line: the markup of the class radio or checkbox,
// with the card's own native input in its box and the same utility classes
// sf-radio and sf-checkbox write (the class sheets leave display to them). Invalid marks the control of a
// card not chosen (C13: error).


function renderControl(context, item, state) {
  const {
    checked,
    disabled,
    ids
  } = state;
  const described = [item.caption ? ids.caption : '', item.price || item.term ? ids.price : ''].filter(Boolean).join(' ');
  const input = (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<input class="sf-choice-input" type=${context.multiple ? 'checkbox' : 'radio'}
           name=${context.controlName || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} form=${context.innerForm || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
           value=${item.value} .checked=${checked} ?disabled=${disabled}
           aria-labelledby=${item.badge ? `${ids.title} ${ids.badge}` : ids.title} aria-describedby=${described || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
           aria-invalid=${context.invalid ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>`;
  const error = context.invalid && !checked ? 'error' : ''; // sf-choice-mark: the 1.0 ring's class, a legacy alias of sf-choice-control
  // until 2027-01-01 (change journal class-input-choice-mark-to-control).

  const control = ['sf-choice-control', 'sf-choice-mark'];

  if (context.multiple) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class=${joinClasses('sf-checkbox', 'sf-checkbox--size-1', 'flex', control, error)}><span class="sf-checkbox-box transition flex items-cross-center content-main-center">${input}${checked ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-icon" aria-hidden="true">check</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}</span></span>`;
  }

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class=${joinClasses('sf-radio-button', 'sf-radio-button--size-1', 'flex', control, error)}><span class="sf-radio-button-box transition flex items-cross-center content-main-center">${input}<span class="sf-radio-button-mark" aria-hidden="true"></span></span></span>`;
}

function renderPrice(item, id, kind) {
  if (!item.price && !item.term) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class=${kind} id=${id}>${item.price ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-choice-price-value">${item.price}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}${item.term ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-choice-term">${item.term}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}</span>`;
}

function renderCard(context, item, index) {
  const checked = context.chosen.has(item.value);
  const disabled = context.fieldDisabled || item.disabled;
  const n = index + 1;
  const ids = {
    title: `${context.id}--title-${n}`,
    badge: `${context.id}--badge-${n}`,
    caption: `${context.id}--caption-${n}`,
    price: `${context.id}--price-${n}`
  };
  const list = context.layout === 'list';
  const picture = context.layout === 'picture';
  const foot = !list && (item.price || item.term);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<label class=${joinClasses('sf-choice-card', checked ? 'sf-choice-card--checked' : '', disabled ? 'sf-choice-card--disabled' : '')}>
    ${picture && item.image ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-choice-media" aria-hidden="true"><img src=${item.image} alt="" loading="lazy" decoding="async"></span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    <span class="sf-choice-head">
      ${renderControl(context, item, {
    checked,
    disabled,
    ids
  })}
      <span class="sf-choice-body">
        <span class="sf-choice-title">${item.icon ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-icon sf-choice-icon" aria-hidden="true">${item.icon}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}<span class="sf-choice-title-text" id=${ids.title}>${item.label}</span>${item.badge ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-badge class="sf-choice-badge" id=${ids.badge} text=${item.badge} appearance="tonal" scheme="primary" line="1/2"
                           root-class=${disabled ? 'sf-badge--disabled' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}></sf-badge>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}</span>
        ${item.caption ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-choice-caption" id=${ids.caption}>${item.caption}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      </span>
      ${list ? renderPrice(item, ids.price, 'sf-choice-meta') : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    </span>
    ${foot ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-choice-rule" aria-hidden="true"></span>${renderPrice(item, ids.price, 'sf-choice-price')}` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
  </label>`;
}

function renderChoiceTemplate(context) {
  const labelId = `${context.id}--label`;
  const messageId = `${context.id}--message`;
  const message = context.invalid && context.errorMessage ? context.errorMessage : context.hint;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class=${joinClasses('sf-choice', context.multiple ? 'sf-choice--multiple' : '', context.invalid ? 'sf-choice--invalid' : '', context.fieldDisabled ? 'sf-choice--disabled' : '', context.rootClass)}
                   style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} data-layout=${context.layout} data-columns=${context.columns}>
    ${context.label ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-choice-label" id=${labelId}>${context.label}${context.required ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-choice-required" aria-hidden="true">*</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    <div class="sf-choice-grid" role=${context.multiple ? 'group' : 'radiogroup'}
         aria-labelledby=${context.label ? labelId : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
         aria-label=${!context.label && context.ariaLabel ? context.ariaLabel : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
         aria-describedby=${message ? messageId : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
         aria-required=${context.required && !context.multiple ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
         aria-invalid=${context.invalid && !context.multiple ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
         aria-disabled=${context.fieldDisabled ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
      ${(0,lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__.repeat)(context.items, item => item.value, (item, index) => renderCard(context, item, index))}
    </div>
    ${message ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-choice-message" id=${messageId} data-field-message=${context.invalid && context.errorMessage ? 'error' : 'hint'}>${message}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
  </div>`;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "0517be6f999f"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


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

/***/ "a5350ee6efc2"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CHOICE_COLUMNS: () => (/* binding */ CHOICE_COLUMNS),
/* harmony export */   CHOICE_LAYOUTS: () => (/* binding */ CHOICE_LAYOUTS),
/* harmony export */   applyChoice: () => (/* binding */ applyChoice),
/* harmony export */   formatValue: () => (/* binding */ formatValue),
/* harmony export */   normaliseItems: () => (/* binding */ normaliseItems),
/* harmony export */   orderValues: () => (/* binding */ orderValues),
/* harmony export */   parseValue: () => (/* binding */ parseValue)
/* harmony export */ });
// The parts of sf-input-choice that are about data, not the page: the shape an
// option takes, the value read from an attribute or a property, and a choice
// applied to it. Kept apart from the element so the contract tests run them
// in Node.

// The grid: auto fills the width with cards of a minimum width; a number is
// the most columns, fewer where they do not fit.
const CHOICE_COLUMNS = Object.freeze(['auto', '1', '2', '3', '4']);

// The arrangement of the cards (owner decision C28): list -- one frame of
// rows divided by lines, the control at the start, price and term a column at
// the end of the name line; tile -- cards in the grid, the control at the end
// of the name line, the price at the foot; picture -- tiles whose image runs
// to the edges, the caption under it (rows on a phone).
const CHOICE_LAYOUTS = Object.freeze(['tile', 'list', 'picture']);

const text = (value) => (value === null || value === undefined ? '' : String(value));

// One option: {value, label, caption?, icon?, badge?, price?, term?, image?,
// disabled?} -- the shape of sf-input-lookup's options, with an icon, a badge,
// a price with its term and an image. `title` is read as the label; a missing
// label is the value. An option without a value, or repeating an earlier one, is left
// out: one value names one card.
function normaliseItems(items) {
  let list = items;
  if (typeof list === 'string') {
    const raw = list.trim();
    if (!raw) return [];
    try {
      list = JSON.parse(raw);
    } catch {
      return [];
    }
  }
  if (!Array.isArray(list)) return [];
  const seen = new Set();
  const result = [];
  for (const item of list) {
    const source = typeof item === 'string' ? {value: item} : item;
    if (!source || typeof source !== 'object' || Array.isArray(source)) continue;
    const value = text(source.value).trim();
    if (!value || seen.has(value)) continue;
    seen.add(value);
    result.push({
      value,
      label: text(source.label ?? source.title) || value,
      caption: text(source.caption),
      icon: text(source.icon).trim(),
      badge: text(source.badge).trim(),
      price: text(source.price).trim(),
      term: text(source.term).trim(),
      image: text(source.image).trim(),
      disabled: Boolean(source.disabled),
    });
  }
  return result;
}

// The chosen values from what a host gave: a string -- one value, or values
// separated by commas when multiple -- or a list. Single keeps the first.
function parseValue(value, multiple = false) {
  let list;
  if (Array.isArray(value)) list = value.map(text);
  else if (multiple) list = text(value).split(',');
  else list = [text(value)];
  const seen = new Set();
  const result = [];
  for (const one of list.map((entry) => entry.trim())) {
    if (!one || seen.has(one)) continue;
    seen.add(one);
    result.push(one);
  }
  return multiple ? result : result.slice(0, 1);
}

// The value as the attribute and the property say it: one value, or the
// values joined by commas.
function formatValue(values) {
  return values.join(',');
}

// The values in the order of the options; a value no option has keeps its
// place after them (the options may arrive after the value).
function orderValues(values, items) {
  const chosen = new Set(values);
  const known = items.map((item) => item.value).filter((one) => chosen.has(one));
  const unknown = values.filter((one) => !items.some((item) => item.value === one));
  return [...known, ...unknown];
}

// A press on an option: single takes it; multiple adds or removes it, the
// values kept in the order of the options.
function applyChoice(values, items, value, checked, multiple = false) {
  if (!multiple) return checked ? [value] : values.filter((one) => one !== value);
  const next = new Set(values);
  if (checked) next.add(value);
  else next.delete(value);
  return orderValues(values.concat(checked ? [value] : []).filter((one, at, all) => next.has(one) && all.indexOf(one) === at), items);
}


/***/ },

/***/ "0c1826bbbeb3"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.input-choice","tag":"sf-input-choice","version":"1.1.0","kind":"leaf","settings":{"items":{"type":"list","default":[],"of":{"value":"string","label":"string","caption":{"type":"string","optional":true},"icon":{"type":"icon","optional":true},"badge":{"type":"string","optional":true},"price":{"type":"string","optional":true},"term":{"type":"string","optional":true},"image":{"type":"string","optional":true},"disabled":{"type":"boolean","optional":true}}},"multiple":{"type":"boolean","default":false},"layout":{"type":"enum","values":["tile","list","picture"],"default":"tile"},"columns":{"type":"enum","values":["auto","1","2","3","4"],"default":"auto"},"label":{"type":"string","default":""},"hint":{"type":"string","default":""},"name":{"type":"string","default":""},"required":{"type":"boolean","default":false},"disabled":{"type":"boolean","default":false},"invalid":{"type":"boolean","default":false},"error-message":{"type":"string","default":""}},"values":{"value":{"type":"string","default":""}},"events":{"input":{"carries":"native"},"change":{"carries":"native"}},"actions":{},"form":{"value":"value","name":"name","default":"value","submits":"value","reset":"default","required":"required","disabled":"disabled","validity":["value-missing","custom-error"]},"css-variables":{"--sf-choice-gap":{"type":"length","state":"default"},"--sf-choice-min-inline-size":{"type":"length","state":"default"},"--sf-choice-padding":{"type":"length","state":"default"},"--sf-choice-radius":{"type":"length","state":"default"},"--sf-choice-background-color":{"type":"color","state":"default"},"--sf-choice-border-color":{"type":"color","state":"default"},"--sf-choice-selected-background-color":{"type":"color","state":"selected"},"--sf-choice-selected-border-color":{"type":"color","state":"selected"}}}');

/***/ },

/***/ "68b61d1e5ff4"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Choice","runtime":{"value-missing":"Choose an option."}}');

/***/ },

/***/ "eb10921c1c1e"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Выбор","runtime":{"value-missing":"Выберите вариант."}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("99f89ebdf0fb");
/******/
/******/ })()
;