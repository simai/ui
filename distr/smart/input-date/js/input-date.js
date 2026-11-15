/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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

/***/ "1373e294ec38"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BREAKPOINTS: () => (/* binding */ BREAKPOINTS),
/* harmony export */   breakpointMedia: () => (/* binding */ breakpointMedia),
/* harmony export */   breakpointQuery: () => (/* binding */ breakpointQuery),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   matchesBreakpoint: () => (/* binding */ matchesBreakpoint)
/* harmony export */ });
// The Framework's breakpoints for scripts (reuse audit 2026-11-02, finding 6).
// The sheets switch at the steps of core/scss/vars/_sf_var__breakpoint.scss;
// a component that also decides in script (sf-contents, sf-site-header,
// sf-search) had copied the steps by hand, word for word, and nine such
// constants (48rem, 60rem, 1023px, 1024) had drifted apart elsewhere, so one
// admin screen switched at two points. The same values here, and
// tests/breakpoint-ladder.contract.test.mjs holds the two files equal.

/** The ladder: each name is the width it starts at, in rem as the sheets write it. */
const BREAKPOINTS = Object.freeze({
  xs: '0rem',
  sm: '32rem',
  // g6, 512px
  md: '44rem',
  // h1, 704px
  lg: '60rem',
  // h5, 960px
  xl: '72rem',
  // h8, 1152px
  xxl: '80rem' // i0, 1280px

}); // The step under a threshold, as the sheets' media-breakpoint-down writes it:
// one pixel less, in rem (_mix__breakpoint.scss breakpoint-max).

const PIXEL_REM = 1 / 16;
/**
 * The media query of a breakpoint: from its width up, or with `below: true`
 * the widths under it -- the two sides the sheets switch on. An unknown name
 * is null, so a typo is not a query that always matches.
 *
 *   breakpointQuery('md')                  (min-width: 44rem)
 *   breakpointQuery('md', {below: true})   (max-width: 43.9375rem)
 */

function breakpointQuery(name, {
  below = false
} = {}) {
  if (!Object.hasOwn(BREAKPOINTS, name)) return null;
  const rem = Number.parseFloat(BREAKPOINTS[name]);
  if (below) return rem > 0 ? `(max-width: ${rem - PIXEL_REM}rem)` : 'not all';
  return `(min-width: ${rem}rem)`;
}
/** The page's MediaQueryList for a breakpoint, to read and to follow; null without matchMedia or for an unknown name. */

function breakpointMedia(name, {
  below = false,
  view = globalThis
} = {}) {
  const query = breakpointQuery(name, {
    below
  });
  return query && typeof view?.matchMedia === 'function' ? view.matchMedia(query) : null;
}
/** Whether the page is at least as wide as the breakpoint now (or under it, with `below`). */

function matchesBreakpoint(name, options = {}) {
  return breakpointMedia(name, options)?.matches === true;
}
const Breakpoints = Object.freeze({
  ladder: BREAKPOINTS,
  query: breakpointQuery,
  media: breakpointMedia,
  matches: matchesBreakpoint
}); // Core publishes the helper; component bundles that carry their own copy reuse
// an already published one instead of replacing it.

if (typeof globalThis !== 'undefined') {
  globalThis.SF = globalThis.SF || {};
  if (!globalThis.SF.breakpoints) globalThis.SF.breakpoints = Breakpoints;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Breakpoints);

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

/***/ "34f37be62b39"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _core_js_instance_path__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("e92fd2d1a38c");
/* harmony import */ var _component_field_size__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("e6d86f2cd058");
/* harmony import */ var _helpers_form_field__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("38ea8d53f301");
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("2a080a730149");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("292f5fe79a22");
/* harmony import */ var _js_templates_ribbon_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("d8c852b40b52");
/* harmony import */ var _js_locale_calendar_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("c4779e51fee1");
/* harmony import */ var _core_js_position_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("116963e5e31b");
/* harmony import */ var _core_js_breakpoints_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("1373e294ec38");
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("43090d1c8307");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__("d7180f8fbd98");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__("881c6d727a36");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__("2fe06cbdeec6");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__("8752f4d5d78e");
/* harmony import */ var _core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__("bf0cea966575");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_instance_path__WEBPACK_IMPORTED_MODULE_2__, _component_field_size__WEBPACK_IMPORTED_MODULE_3__, lit__WEBPACK_IMPORTED_MODULE_5__, _js_templates_default__WEBPACK_IMPORTED_MODULE_6__, _js_templates_ribbon_js__WEBPACK_IMPORTED_MODULE_7__, _core_js_position_js__WEBPACK_IMPORTED_MODULE_9__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_11__, _core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_16__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_instance_path__WEBPACK_IMPORTED_MODULE_2__, _component_field_size__WEBPACK_IMPORTED_MODULE_3__, lit__WEBPACK_IMPORTED_MODULE_5__, _js_templates_default__WEBPACK_IMPORTED_MODULE_6__, _js_templates_ribbon_js__WEBPACK_IMPORTED_MODULE_7__, _core_js_position_js__WEBPACK_IMPORTED_MODULE_9__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_11__, _core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_16__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_instance_path__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_core_js_instance_path__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _core_js_position_js__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_core_js_position_js__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(_core_js_page_language__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var _core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_16___default = /*#__PURE__*/__webpack_require__.n(_core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_16__);

















const ISO_DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/; // Between the two dates of a range in its one field: an en dash with a space
// on each side, «01.09.2026 – 07.09.2026» (owner decision C62).

const RANGE_SEPARATOR = ' \u2013 '; // The ribbon of months on a phone: how many months it shows before and after
// the one it opens on, and how many it adds as it nears an end.

const RIBBON_BEFORE = 3;
const RIBBON_AFTER = 12;
const RIBBON_STEP = 6;
const YEARS_PAGE_SIZE = 18;

function padDatePart(value) {
  return String(value).padStart(2, '0');
}

function formatIsoDate(date) {
  return `${date.getFullYear()}-${padDatePart(date.getMonth() + 1)}-${padDatePart(date.getDate())}`;
} // A date, a time of day, or both, in the declared format. `minutes` is the
// time of day as minutes after midnight (0-1439), null for none; HH and mm are
// the hours (00-23) and the minutes (00-59).


function formatDateValue(date, format = 'YYYY.MM.DD', minutes = null) {
  if (!date && minutes === null) {
    return '';
  }

  const tokens = {};

  if (date) {
    Object.assign(tokens, {
      YYYY: String(date.getFullYear()),
      YY: String(date.getFullYear()).slice(-2),
      MM: padDatePart(date.getMonth() + 1),
      DD: padDatePart(date.getDate())
    });
  }

  if (minutes !== null) {
    Object.assign(tokens, {
      HH: padDatePart(Math.floor(minutes / 60)),
      mm: padDatePart(minutes % 60)
    });
  }

  return String(format || 'YYYY.MM.DD').replace(/YYYY|YY|MM|DD|HH|mm/g, token => tokens[token] || token);
} // The time of day (mode datetime and time). The value is the wall clock as the
// host wrote it: hh:mm for a time, yyyy-mm-ddThh:mm for a date and a time.
// Seconds, a fraction and a zone are read past (the host owns the time zone)
// and a change writes the minute.


const MODES = ['date', 'datetime', 'time'];
const LAST_MINUTE = 24 * 60 - 1;
const ISO_TIME_RE = /^(\d{1,2}):(\d{2})(?::\d{2}(?:\.\d+)?)?$/;
const ISO_DATE_TIME_RE = /^(\d{4}-\d{2}-\d{2})(?:[T ](\d{2}):(\d{2})(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:?\d{2})?)?$/;

function minutesOf(hours, minutes) {
  if (!Number.isInteger(hours) || hours < 0 || hours > 23) return null;
  if (!Number.isInteger(minutes) || minutes < 0 || minutes > 59) return null;
  return hours * 60 + minutes;
}

function parseIsoTime(value) {
  const match = String(value ?? '').trim().match(ISO_TIME_RE);
  return match ? minutesOf(Number(match[1]), Number(match[2])) : null;
}

function formatIsoTime(minutes) {
  return `${padDatePart(Math.floor(minutes / 60))}:${padDatePart(minutes % 60)}`;
} // {day, minutes} of an ISO date or date and time; minutes null for a day alone.


function parseIsoDateTime(value) {
  const match = String(value ?? '').trim().match(ISO_DATE_TIME_RE);
  if (!match) return null;
  const day = parseDate(match[1]);
  if (!day) return null;
  if (match[2] === undefined) return {
    day,
    minutes: null
  };
  const minutes = minutesOf(Number(match[2]), Number(match[3]));
  return minutes === null ? null : {
    day,
    minutes
  };
}

function isValidDate(date) {
  return date instanceof Date && !Number.isNaN(date.getTime());
} // A year has four digits: 1000 to 9999. Without the bound a glued paste such
// as «20.11.202630.10.2026» read as year 202630 and was stored as a date
// nobody meant.


const MIN_YEAR = 1000;
const MAX_YEAR = 9999;

function calendarDate(year, month, day) {
  if (!Number.isInteger(year) || year < MIN_YEAR || year > MAX_YEAR) {
    return null;
  }

  const date = new Date(year, month - 1, day); // new Date reads years below 100 as 19xx; the bound above keeps them out.

  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }

  return date;
}

function parseDate(value) {
  if (!value) {
    return null;
  }

  const match = String(value).match(ISO_DATE_RE);

  if (!match) {
    return null;
  }

  const [, year, month, day] = match;
  return calendarDate(Number(year), Number(month), Number(day));
} // The declared format as an anchored pattern: YYYY is four digits, YY two,
// DD and MM one or two, and whatever stands between them in the format is a
// separator -- any of . / - , or a space, so «20/11/2026» lands in a
// DD.MM.YYYY field. The whole text has to be one date: it read every run of
// digits it found and took the first three, so two dates glued together, a
// date with something after it or a five-digit year all made a date.
// A format with a time (HH and mm, hours and minutes) also takes a colon
// between its parts, so «05.11.2026 10:30» lands in DD.MM.YYYY HH:mm. Which
// parts a format must hold depends on the mode: the date's three in date mode,
// those and the time's two in datetime mode, the time's two alone in time mode.


const FORMAT_TOKEN_RE = /YYYY|YY|MM|DD|HH|mm/g;
const TIME_TOKENS = ['HH', 'mm'];
const formatPatterns = new Map();

function formatPattern(format, mode = 'date') {
  const written = String(format || (mode === 'time' ? 'HH:mm' : 'DD.MM.YYYY'));
  const key = `${mode}|${written}`;
  if (formatPatterns.has(key)) return formatPatterns.get(key);
  const tokens = written.match(FORMAT_TOKEN_RE) || [];
  const dateTokens = tokens.filter(token => !TIME_TOKENS.includes(token));
  const timeTokens = tokens.filter(token => TIME_TOKENS.includes(token));
  const digits = {
    YYYY: '(\\d{4})',
    YY: '(\\d{2})',
    MM: '(\\d{1,2})',
    DD: '(\\d{1,2})',
    HH: '(\\d{1,2})',
    mm: '(\\d{2})'
  };
  const separator = timeTokens.length ? '[\\s./,:-]+' : '[\\s./,-]+';
  const source = written.split(FORMAT_TOKEN_RE).map(literal => literal ? separator : '').reduce((pattern, literal, index) => pattern + literal + (index < tokens.length ? digits[tokens[index]] : ''), '');
  const hasDate = dateTokens.length === 3 && dateTokens.includes('MM') && dateTokens.includes('DD') && (dateTokens.includes('YYYY') || dateTokens.includes('YY'));
  const hasTime = timeTokens.length === 2 && timeTokens.includes('HH') && timeTokens.includes('mm');
  const usable = mode === 'time' ? hasTime && !dateTokens.length : mode === 'datetime' ? hasDate && hasTime : hasDate && !timeTokens.length;
  const pattern = usable ? {
    re: new RegExp(`^${source}$`),
    tokens
  } : null;
  formatPatterns.set(key, pattern);
  return pattern;
}

function parseDateValue(value, format = 'DD.MM.YYYY') {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return isValidDate(value) ? new Date(value.getFullYear(), value.getMonth(), value.getDate()) : null;
  }

  const text = String(value).trim();

  if (ISO_DATE_RE.test(text)) {
    return parseDate(text);
  }

  const pattern = formatPattern(format);
  const match = pattern ? text.match(pattern.re) : null;

  if (!match) {
    return null;
  }

  const values = {};
  pattern.tokens.forEach((token, index) => {
    values[token] = Number(match[index + 1]);
  });
  const year = values.YYYY ?? values.YY + 2000;
  return calendarDate(year, values.MM, values.DD);
} // A value of any mode as {day, minutes}, or null when it is not one: the ISO
// form first, then the declared format, the whole text one value. `typed`
// asks for the whole of it -- a datetime typed without its time is not read
// as midnight; a stored day alone is (the host wrote no time).


function parseModeValue(value, format, mode = 'date', {
  typed = false
} = {}) {
  if (mode === 'date') {
    const day = parseDateValue(value, format);
    return day ? {
      day,
      minutes: null
    } : null;
  }

  const text = String(value ?? '').trim();
  if (!text) return null;

  if (mode === 'time') {
    const iso = parseIsoTime(text);
    if (iso !== null) return {
      day: null,
      minutes: iso
    };
  } else {
    const iso = parseIsoDateTime(text);
    if (iso && !(typed && iso.minutes === null)) return iso;
    if (iso) return null;
  }

  const pattern = formatPattern(format, mode);
  const match = pattern ? text.match(pattern.re) : null;
  if (!match) return null;
  const values = {};
  pattern.tokens.forEach((token, index) => {
    values[token] = Number(match[index + 1]);
  });
  const minutes = minutesOf(values.HH, values.mm);
  if (minutes === null) return null;
  if (mode === 'time') return {
    day: null,
    minutes
  };
  const day = calendarDate(values.YYYY ?? values.YY + 2000, values.MM, values.DD);
  return day ? {
    day,
    minutes
  } : null;
}

function normalizeMonth(value, fallback = 0) {
  const month = (0,_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__.toNumber)(value, fallback);

  if (!Number.isFinite(month)) {
    return fallback;
  }

  return Math.max(0, Math.min(11, month));
}

function sameDay(first, second) {
  return first && second && first.getFullYear() === second.getFullYear() && first.getMonth() === second.getMonth() && first.getDate() === second.getDate();
}

function compareDates(first, second) {
  if (!first || !second) {
    return 0;
  }

  const firstTime = new Date(first.getFullYear(), first.getMonth(), first.getDate()).getTime();
  const secondTime = new Date(second.getFullYear(), second.getMonth(), second.getDate()).getTime();
  return firstTime - secondTime;
}

function shiftDateByMonth(date, direction) {
  const targetMonth = new Date(date.getFullYear(), date.getMonth() + direction, 1);
  const lastDay = new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 0).getDate();
  targetMonth.setDate(Math.min(date.getDate(), lastDay));
  return targetMonth;
}

function isBetweenDates(date, startDate, endDate) {
  if (!date || !startDate || !endDate) {
    return false;
  }

  return compareDates(date, startDate) > 0 && compareDates(date, endDate) < 0;
}

function normalizeLocale(value = '', node = null) {
  const locale = String(value || '').trim();

  if (locale) {
    return locale;
  } // The nearest [lang] first, then the document's: the rule every component
  // follows, rather than this one's own reading of it. A date picker inside a
  // region marked `lang="en"` on a Russian page used to name its months in
  // Russian, because only the document was ever consulted.
  //
  // The region is kept -- `pageLocale`, not `pageLanguage` -- because this
  // value also goes to Intl, and `ru-RU` and `en-GB` name months and start
  // weeks differently from `ru` and `en`. Below this there used to be a fall
  // back to the browser's own language and then to `ru-RU`: unreachable
  // wherever a document exists, and a Russian default everywhere else, which
  // is the opposite of the rule (peer session, 2026-10-11).


  return (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_11__.pageLocale)(node ?? globalThis.document?.documentElement ?? null);
}

function capitalizeFirstLetter(value = '') {
  const text = String(value || '');

  if (!text) {
    return '';
  }

  return `${text.charAt(0).toLocaleUpperCase()}${text.slice(1)}`;
} // One formatter per locale and options: a render names 42 days, 12 months,
// 7 weekdays and the month, and made 63 new Intl.DateTimeFormat for it every
// time (datepicker audit 2026-11-11, §4). A locale Intl refuses throws here as
// it threw before, and the callers keep their fall-backs.


const dateFormats = new Map();

function dateFormat(locale, options) {
  const key = `${locale}|${JSON.stringify(options)}`;
  let format = dateFormats.get(key);

  if (!format) {
    format = new Intl.DateTimeFormat(locale, options);
    dateFormats.set(key, format);
  }

  return format;
}

function getMonthLabel(month, locale) {
  try {
    return capitalizeFirstLetter(dateFormat(locale, {
      month: 'long'
    }).format(new Date(2026, month, 1)));
  } catch {
    return String(month + 1);
  }
}

function getDateLabel(date, locale) {
  try {
    return dateFormat(locale, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  } catch {
    return formatIsoDate(date);
  }
}

function getWeekdays(locale, weekStart = 1, weekday = 'short') {
  const sunday = new Date(2026, 0, 4);
  return Array.from({
    length: 7
  }, (_, index) => {
    const day = new Date(sunday);
    day.setDate(sunday.getDate() + (weekStart + index) % 7);

    try {
      return dateFormat(locale, {
        weekday
      }).format(day);
    } catch {
      return String((weekStart + index) % 7);
    }
  });
} // Quick ranges (owner, 2026-10-15). A relative one is resolved against today
// in the person's own time zone, every time it is drawn, so a host that stores
// «last 7 days» gets the last seven days tomorrow too. Weeks start where the
// grid starts them.


const RELATIVE_PRESETS = ['today', 'yesterday', 'last-7-days', 'last-30-days', 'this-week', 'this-month', 'last-month'];

function addDays(date, days) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

function resolveRelativePreset(id, today, weekStart = 1) {
  const day = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  switch (id) {
    case 'today':
      return [day, day];

    case 'yesterday':
      return [addDays(day, -1), addDays(day, -1)];

    case 'last-7-days':
      return [addDays(day, -6), day];

    case 'last-30-days':
      return [addDays(day, -29), day];

    case 'this-week':
      return [addDays(day, -((day.getDay() - weekStart + 7) % 7)), day];

    case 'this-month':
      return [new Date(day.getFullYear(), day.getMonth(), 1), day];

    case 'last-month':
      return [new Date(day.getFullYear(), day.getMonth() - 1, 1), new Date(day.getFullYear(), day.getMonth(), 0)];

    default:
      return null;
  }
}

function presetTextKey(id) {
  return `preset_${String(id).replace(/-([a-z0-9])/g, (_, letter) => letter.toUpperCase())}`;
} // Every word this picker says, in the languages it ships with. A product adds
// any other through SF.language.register('sf-input-date', code, words) -- which
// an if/else on «ru» did not allow at all.
// Every word is lang/<locale>.json runtime (standard 1.3.8 §11); the code's
// camelCase keys read as the files' kebab-case ones.


const wordKey = key => String(key).replace(/_/gu, '-').replace(/[A-Z]/gu, letter => `-${letter.toLowerCase()}`);

function getLabels(node) {
  const keys = ['previousMonth', 'nextMonth', 'previousYears', 'nextYears', 'chooseMonth', 'chooseYear', 'presets', 'customRange', 'time', 'hours', 'minutes', 'earlierHour', 'laterHour', 'earlierMinute', 'laterMinute', 'timeNotSet', 'period', 'done', 'chooseStart', 'chooseEnd', 'goToToday', 'close'];
  return Object.fromEntries(keys.map(key => [key, node.sfWord(wordKey(key))]));
} // sf-input-date from its component.json (standard simai.smart-component 1.3.8
// §3, §4, §4.4, §7.1.1, §8, §11, §16.20, §17.1). It stays a leaf: the one
// interactive part it places is its own text box. The settings are attributes
// and properties made by core/js/element-manifest.js, the panel actions answer
// an outcome, change leaves once (the shim sends sf-datepicker-change and
// sf-change after it), and the host is the form control through
// ElementInternals.


const DatepickerElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_12__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_14__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_15__
  },
  source: 'ru',
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_13__,
  actions: {
    'open-panel'({
      options
    } = {}) {
      if (this.disabled) return 'disabled';
      if (this.valueLocked) return 'readonly';

      this._openPanel(options || {});

      return 'applied';
    },

    'close-panel'({
      options
    } = {}) {
      if (!this.open && !this._sheetOpen) return 'unchanged';

      this._closePanel(options || {});

      return 'applied';
    },

    'toggle-panel'() {
      const open = this.open || this._sheetOpen;
      if (!open && this.disabled) return 'disabled';
      if (!open && this.valueLocked) return 'readonly';

      this._togglePanel();

      return 'applied';
    },

    'choose-preset'({
      item
    } = {}) {
      if (this.disabled) return 'disabled';
      if (this.valueLocked) return 'readonly';
      if (!item || item.disabled || !this.range) return 'unavailable-preset';

      this._choosePreset(item);

      return 'applied';
    },

    'choose-custom-range'() {
      if (this.disabled) return 'disabled';
      if (this.valueLocked) return 'readonly';
      if (!this.range) return 'not-a-range';

      this._chooseCustomRange();

      return 'applied';
    }

  }
});

class SfDatepicker extends (0,_helpers_form_field__WEBPACK_IMPORTED_MODULE_4__.FormField)(DatepickerElement) {
  constructor() {
    super();
    this._input = null;
    this._documentClickHandler = this.handleDocumentClick.bind(this);
    this._documentKeydownHandler = this.handleDocumentKeydown.bind(this);
    this._focusoutHandler = this.handleFocusout.bind(this);
    this.addEventListener('focusout', this._focusoutHandler);
    this._viewportHandler = this.positionPanel.bind(this);
    this._focusCalendarOnOpen = false;
    this._focusDateAfterRender = false;
    this.state = {
      openAbove: false,
      yearPageStart: null,
      activeDate: ''
    };
    this.refs = {
      input: this.createRef(),
      datePickerRoot: this.createRef(),
      datePickerPanel: this.createRef()
    };
  }

  static get props() {
    // The manifest's settings, read as the component always read them:
    // its own entries win where they keep an attribute's old reading.
    return { ...super.props,
      templateName: {
        attribute: 'template',
        default: 'default'
      },
      value: {
        default: ''
      },
      date: {
        default: ''
      },
      startValue: {
        attribute: 'start-value',
        default: ''
      },
      endValue: {
        attribute: 'end-value',
        default: ''
      },
      maxDate: {
        default: ''
      },
      minDate: {
        default: ''
      },
      // What is chosen: a date (the default), a date and a time, or a
      // time of day alone; the window of the day and the minute step.
      mode: {
        default: 'date'
      },
      minTime: {
        attribute: 'min-time',
        default: ''
      },
      maxTime: {
        attribute: 'max-time',
        default: ''
      },
      minuteStep: {
        type: Number,
        attribute: 'minute-step',
        default: 1
      },
      range: {
        type: Boolean,
        default: false
      },
      month: {
        type: Number,
        default: null
      },
      year: {
        type: Number,
        default: null
      },
      context: {
        default: ''
      },
      // No default: the page's language says it (see get weekStart).
      weekStart: {
        type: Number,
        default: null
      },
      // The days off, drawn red: the locale's when empty, "none", or a
      // list of days 0-7 (see get weekendDays).
      weekend: {
        default: ''
      },
      locale: {
        default: ''
      },
      // No default: the locale's order and signs (see get format).
      format: {
        default: ''
      },
      rootClass: {
        default: ''
      },
      closeOnSelect: {
        type: Boolean,
        default: true
      },
      input: {
        type: Boolean,
        default: true
      },
      open: {
        type: Boolean,
        default: false
      },
      portal: {
        type: Boolean,
        default: true
      },
      inputType: {
        attribute: 'input-type',
        default: 'bordered'
      },
      size: {
        default: '1'
      },
      inputSize: {
        attribute: 'input-size',
        default: '1'
      },
      inputName: {
        attribute: 'input-name',
        default: ''
      },
      // Read by inputName after input-name; declared so the manifest names it.
      name: {
        attribute: 'name',
        default: ''
      },
      placeholder: {
        default: ''
      },
      label: {
        default: ''
      },
      ariaLabel: {
        attribute: 'aria-label',
        default: ''
      },
      // A date can be typed; a host that wants the grid alone says so.
      readonly: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      required: {
        type: Boolean,
        default: false
      },
      // Said by the host and drawn by the field: the red border and
      // aria-invalid on the native input, and the message under it.
      // Removing it puts both back (Larena acceptance, 2026-10-22).
      invalid: {
        type: Boolean,
        default: false
      },
      errorMessage: {
        attribute: 'error-message',
        default: ''
      },
      iconStart: {
        type: String,
        attribute: 'icon-start',
        default: null
      },
      leftIcon: {
        attribute: 'left-icon',
        default: 'calendar_today'
      },
      inputRootClass: {
        attribute: 'input-root-class',
        default: ''
      },
      mask: {
        type: Boolean,
        default: false
      },
      maskPattern: {
        attribute: 'mask-pattern',
        default: ''
      },
      maskLazy: {
        attribute: 'mask-lazy',
        default: false
      },
      maskPlaceholderChar: {
        attribute: 'mask-placeholder-char',
        default: '_'
      },
      maskOptions: {
        attribute: 'mask-options',
        default: ''
      },
      // Quick ranges, range mode only: built-in ids, comma separated, or
      // the property as [{id, label, relative} | {id, label, range: [from, to]}].
      presets: {
        default: ''
      },
      // The chosen quick range. Set by a host, it wins over start-value and
      // end-value: a stored «last-7-days» is resolved when drawn.
      preset: {
        default: ''
      }
    };
  } // The panel's id comes from the instance path (§7.1.1), never from a counter.


  get _panelId() {
    return (0,_core_js_instance_path__WEBPACK_IMPORTED_MODULE_2__.partId)((0,_core_js_instance_path__WEBPACK_IMPORTED_MODULE_2__.instancePath)(this, {
      kind: 'sf-input-date'
    }), 'panel');
  }

  connectedCallback() {
    // What a form reset returns to (§17.1 item 4): the value as written.
    if (!this._written) {
      this._written = Object.fromEntries(['date', 'start-value', 'end-value', 'preset'].map(name => [name, this.getAttribute(name)]));
    }

    this.upgradeProperty('value');
    this.upgradeProperty('presets');
    super.connectedCallback();
  }

  upgradeProperty(name) {
    if (!Object.prototype.hasOwnProperty.call(this, name)) {
      return;
    }

    const value = this[name];
    delete this[name];
    this[name] = value;
  }

  get componentName() {
    return 'datepicker';
  }

  get templateName() {
    return this.getAttribute('template') || 'default';
  } // date (the default), datetime or time. A range is a range of dates: it is
  // read in date mode only.


  get mode() {
    return this.getEnumAttr('mode', MODES, 'date');
  }

  get hasTime() {
    return this.mode !== 'date';
  } // The stored value read in its mode, {day, minutes}, or null.


  get selectedValue() {
    return parseModeValue(this.date, this.format, this.mode);
  }

  get selectedDate() {
    if (this.mode === 'date') return parseDateValue(this.date, this.format);
    return this.selectedValue?.day ?? null;
  } // The chosen time of day in minutes after midnight, or null. A stored day
  // without a time, in datetime mode, reads as midnight.


  get selectedMinutes() {
    if (!this.hasTime) return null;
    const value = this.selectedValue;
    if (!value) return null;
    return value.minutes ?? (value.day ? 0 : null);
  } // The time the panel shows: the value's, or one set on the panel before a
  // day was chosen (datetime mode), or none.


  get currentMinutes() {
    return this.selectedMinutes ?? this._draftMinutes ?? null;
  } // The value as the component writes it: yyyy-mm-dd, yyyy-mm-ddThh:mm or hh:mm.


  isoOf(value) {
    if (!value) return '';
    if (this.mode === 'time') return value.minutes === null ? '' : formatIsoTime(value.minutes);
    if (!value.day) return '';
    if (this.mode === 'date') return formatIsoDate(value.day);
    return `${formatIsoDate(value.day)}T${formatIsoTime(value.minutes ?? 0)}`;
  }

  get minuteStep() {
    const step = this.getNumberAttr('minute-step', 1);
    return Number.isInteger(step) && step >= 1 && step <= 60 ? step : 1;
  }

  get minTime() {
    return this.getAttribute('min-time') || '';
  }

  get maxTime() {
    return this.getAttribute('max-time') || '';
  } // A bound (min-date, max-date) as {day, minutes}: in datetime mode it may
  // carry a time, which holds on its own day.


  readBound(text) {
    if (!text || this.mode === 'time') return null;

    if (this.mode === 'date') {
      const day = parseDateValue(text, this.format);
      return day ? {
        day,
        minutes: null
      } : null;
    }

    return parseIsoDateTime(text) ?? parseModeValue(text, this.format, 'datetime');
  } // The times a day allows, in minutes: min-time to max-time, narrowed on the
  // day of a bound that carries a time.


  timeWindow(day = null) {
    let lo = parseIsoTime(this.minTime) ?? 0;
    let hi = parseIsoTime(this.maxTime) ?? LAST_MINUTE;

    if (this.mode === 'datetime' && day) {
      const min = this.readBound(this.minDate);
      const max = this.readBound(this.maxDate);
      if (min?.minutes != null && sameDay(day, min.day)) lo = Math.max(lo, min.minutes);
      if (max?.minutes != null && sameDay(day, max.day)) hi = Math.min(hi, max.minutes);
    }

    return {
      lo,
      hi
    };
  } // The allowed time nearest to `minutes` in the direction given: inside the
  // day's window and on the minute step (counted from the hour). Null when
  // the day allows none.


  fitMinutes(minutes, day = null, direction = 1) {
    const {
      lo,
      hi
    } = this.timeWindow(day);
    const step = this.minuteStep;

    const onStep = value => value % 60 % step === 0;

    const seek = (from, by) => {
      for (let value = from; value >= lo && value <= hi; value += by) if (onStep(value)) return value;

      return null;
    };

    if (minutes < lo) return seek(lo, 1);
    if (minutes > hi) return seek(hi, -1);
    const by = direction < 0 ? -1 : 1;
    return seek(minutes, by) ?? seek(minutes, -by);
  }

  timeAllowed(minutes, day = null) {
    const {
      lo,
      hi
    } = this.timeWindow(day);
    return minutes >= lo && minutes <= hi && minutes % 60 % this.minuteStep === 0;
  }

  get primaryDate() {
    const preset = this.activePreset;
    if (preset) return preset.to;
    return this.selectedDate || this.startDate;
  }

  get presets() {
    return this._presetList ?? (this.getAttribute('presets') || '');
  }

  set presets(next) {
    if (Array.isArray(next)) {
      this._presetList = next;
      this.requestComponentUpdate('presets');
      return;
    }

    this._presetList = null;
    this.setState({
      presets: next ? String(next) : ''
    });
  }

  get preset() {
    return this.getAttribute('preset') || '';
  }

  set preset(next) {
    this.setState({
      preset: next ? String(next) : ''
    });
  } // Each quick range resolved for today: its dates, clamped to min and max,
  // and disabled when nothing of it is left.


  get presetItems() {
    if (!this.range) return [];
    const raw = Array.isArray(this.presets) ? this.presets : String(this.presets).split(/[\s,]+/).filter(Boolean);
    const today = new Date();
    const min = this.setMinDate();
    const max = this.setMaxDate();
    return raw.map(entry => {
      const item = typeof entry === 'string' ? {
        id: entry,
        relative: entry
      } : { ...entry
      };
      if (!item?.id) return null;
      let dates = null;
      if (item.relative) dates = resolveRelativePreset(item.relative, today, this.weekStart);else if (Array.isArray(item.range)) {
        const from = parseDateValue(item.range[0], this.format);
        const to = parseDateValue(item.range[1], this.format);
        if (from && to) dates = compareDates(from, to) <= 0 ? [from, to] : [to, from];
      }
      if (!dates) return null;
      let [from, to] = dates;
      if (min && compareDates(from, min) < 0) from = min;
      if (max && compareDates(to, max) > 0) to = max;
      const disabled = compareDates(from, to) > 0;
      const label = item.label || (RELATIVE_PRESETS.includes(item.id) ? this.sfWord(wordKey(presetTextKey(item.id))) : item.id);
      return {
        id: String(item.id),
        label,
        relative: item.relative || null,
        from,
        to,
        disabled,
        pressed: this.preset === String(item.id)
      };
    }).filter(Boolean);
  }

  get activePreset() {
    const id = this.preset;
    if (!id || !this.range) return null;
    const item = this.presetItems.find(one => one.id === id);
    return item && !item.disabled ? item : null;
  }

  get startDate() {
    return parseDateValue(this.startValue, this.format);
  }

  get endDate() {
    return parseDateValue(this.endValue, this.format);
  } // `value` is the initial value; `date` is the component's own. The getter
  // read `date || value`, so once a date set by the `value` attribute was
  // cleared -- the person emptied the field, or code set '' -- the attribute
  // came back and the old date with it: the value could not be cleared, and
  // the change said the old date (field renderers' date editor, ui-admin's
  // datetime). A present `date`, even empty, is the value now.


  get date() {
    if (this.hasAttribute('date')) return this.getAttribute('date') || '';
    return this.getAttribute('value') || '';
  } // An empty date removes the `date` attribute, which let `value` back in; a
  // cleared value over an initial one is kept as date="".


  setState(nextState = {}, callback = null) {
    super.setState(nextState, callback);

    const has = key => nextState && typeof nextState === 'object' && Object.prototype.hasOwnProperty.call(nextState, key);

    const clears = has('date') && !nextState.date;
    if (clears && this.hasAttribute('value')) this.setAttribute('date', ''); // The grid's month written by the component itself (a date chosen, an
    // arrow, the month list), not by a host: the next opening may move it.

    if (has('year') || has('month')) this._gridMoved = true;
    return this;
  } // The month a value is in, as the state that shows it; nothing for a value
  // that is not a date, so an emptied value leaves the grid where it was.


  monthOf(value) {
    const date = this.mode === 'date' ? parseDateValue(value, this.format) : parseModeValue(value, this.format, this.mode)?.day;
    return date ? {
      year: date.getFullYear(),
      month: date.getMonth()
    } : {};
  } // The day the grid opens on: the value's, or today's when there is none --
  // inside min-date and max-date either way.


  get anchorDate() {
    const candidate = this.primaryDate || new Date();
    const minDate = this.setMinDate();
    const maxDate = this.setMaxDate();
    if (minDate && compareDates(candidate, minDate) < 0) return minDate;
    if (maxDate && compareDates(candidate, maxDate) > 0) return maxDate;
    return candidate;
  } // The calendar opens on the month of the value it holds (Larena acceptance,
  // 2026-10-22: 15.11.2026 typed, the grid opened on August -- the month it
  // was left on). The grid kept the year and month it was last moved to, and
  // a value set by a property, by the attribute or by typing did not move it
  // unless the change came through the component's own selection path. So on
  // opening: text typed but not yet committed is committed first; then the
  // grid goes to the value's month, or -- with no value -- back to today's
  // when the component had moved it (a month a host set stays). Inside
  // min-date/max-date either way. The focused day follows.


  showValueMonth() {
    this.commitTypedText();
    const primaryDate = this.primaryDate;

    if (primaryDate) {
      const anchor = this.anchorDate;
      this.setState({
        year: anchor.getFullYear(),
        month: anchor.getMonth(),
        context: ''
      });
    } else if (this._gridMoved) {
      this.setState({
        year: '',
        month: '',
        context: ''
      });
    }

    this._gridMoved = false;
    this.set({
      activeDate: formatIsoDate(this.anchorDate)
    });
    return this;
  } // What stands in the field, read as a date if it is one. Opening the
  // calendar without leaving the field (a click on it, ArrowDown) fires no
  // change, so the typed date was not the value yet. Text that is not a date
  // is left as it is: the change on leaving the field decides about it.


  commitTypedText() {
    if (!this.typed || !this._input) return this;
    const text = String(this._input.value ?? '').trim();
    if (!text || text === this.displayValue || !parseModeValue(text, this.format, this.mode, {
      typed: true
    })) return this;
    this.handleInputChange({
      target: this._input
    });
    return this;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue); // A host that changes the value attribute moves the grid to it: an
    // inline calendar is never opened, so opening cannot do it there.

    if (name === 'value' && oldValue !== null && oldValue !== newValue && this.primaryDate) {
      const date = this.primaryDate;
      this.setState({
        year: date.getFullYear(),
        month: date.getMonth()
      });
    }
  }

  get value() {
    return this.range ? [this.startValue, this.endValue] : this.date;
  } // The value property takes what its getter gives back (component.json
  // x-registry.inputs.value): an ISO date string, or [start, end] for a range.
  // The object {start|startValue|date, end|endValue} older callers pass is
  // still read as that pair, but it is outside the contract. Anything else is
  // read as text (a number, a boolean) or, for any other object, cleared, and
  // a console warning names the shape once per element.


  set value(nextValue) {
    if (Array.isArray(nextValue)) {
      const [startValue = '', endValue = ''] = nextValue;
      this.setState({
        date: startValue || '',
        startValue: startValue || '',
        endValue: endValue || '',
        ...this.monthOf(startValue || endValue)
      });
      return;
    }

    if (nextValue && typeof nextValue === 'object') {
      const startValue = nextValue.start || nextValue.startValue || nextValue.date || '';
      const endValue = nextValue.end || nextValue.endValue || '';
      if (!startValue && !endValue) this.warnValueShape(nextValue);
      this.setState({
        date: nextValue.date || startValue || '',
        startValue,
        endValue,
        ...this.monthOf(nextValue.date || startValue || endValue)
      });
      return;
    }

    if (nextValue != null && typeof nextValue !== 'string') this.warnValueShape(nextValue);
    this.setState({
      date: nextValue ? String(nextValue) : '',
      startValue: '',
      endValue: '',
      ...this.monthOf(nextValue)
    });
  }

  warnValueShape(nextValue) {
    if (this._valueShapeWarned) return;
    this._valueShapeWarned = true;
    const shape = nextValue instanceof Date ? 'Date' : typeof nextValue;
    globalThis.console?.warn?.(`[SIMAI Framework] sf-input-date: value takes an ISO date string or [start, end]; a ${shape} was read as ${shape === 'object' || shape === 'Date' ? 'empty' : 'text'}.`);
  }

  setMaxDate() {
    return this.readBound(this.maxDate)?.day ?? null;
  }

  setMinDate() {
    return this.readBound(this.minDate)?.day ?? null;
  }

  get maxDate() {
    return this.getAttribute('max-date') || '';
  }

  get minDate() {
    return this.getAttribute('min-date') || '';
  }

  set date(nextValue) {
    this.setState({
      date: nextValue ? String(nextValue) : '',
      ...this.monthOf(nextValue)
    });
  }

  get startValue() {
    const preset = this.activePreset;
    if (preset) return formatIsoDate(preset.from);
    return this.getAttribute('start-value') || '';
  }

  set startValue(nextValue) {
    this.setState({
      startValue: nextValue ? String(nextValue) : '',
      ...this.monthOf(nextValue)
    });
  }

  get endValue() {
    const preset = this.activePreset;
    if (preset) return formatIsoDate(preset.to);
    return this.getAttribute('end-value') || '';
  }

  set endValue(nextValue) {
    this.setState({
      endValue: nextValue ? String(nextValue) : ''
    });
  }

  get range() {
    return this.mode === 'date' && this.getBooleanAttr('range', false);
  }

  get input() {
    return this.getBooleanAttr('input', true);
  } // A read-only field is never open, even when a host writes `open`: its
  // calendar would offer a choice the field does not take (C62).


  get open() {
    return this.getBooleanAttr('open', false) && !(this.input && this.valueLocked);
  }

  get portal() {
    return this.getBooleanAttr('portal', true);
  }

  get inputType() {
    return this.getAttribute('input-type') || 'bordered';
  } // `size` is the canonical name, as on every field; `input-size` is its
  // legacy name and still honoured. The canonical name wins when both are set.


  get size() {
    return (0,_component_field_size__WEBPACK_IMPORTED_MODULE_3__.ladderSize)(this.getAttribute('size') || this.getAttribute('input-size'));
  }

  get inputSize() {
    return this.size;
  }

  get inputName() {
    return this.getAttribute('input-name') || this.getAttribute('name') || '';
  } // The hint in an empty field: the host's, or -- where a date is typed --
  // the format in the letters of the locale (ДД.ММ.ГГГГ, MM/DD/YYYY,
  // TT.MM.JJJJ), so the person sees the order the field reads (owner
  // decision C62). A range or a read-only field is not typed: no hint.


  get placeholder() {
    const written = this.getAttribute('placeholder') || '';
    if (written || !this.typed) return written;
    return (0,_js_locale_calendar_js__WEBPACK_IMPORTED_MODULE_8__.formatPlaceholder)(this.format, this.locale);
  } // What the form gets (§17.1): the ISO date, never the display text; a
  // range as start/end (an ISO 8601 interval); nothing while disabled.


  sfFormValue() {
    if (this.disabled) return null;
    if (!this.range) return this.date || '';
    const {
      startValue,
      endValue
    } = this;
    if (startValue && endValue) return `${startValue}/${endValue}`;
    return startValue || '';
  }

  fieldValidity() {
    const empty = this.range ? !this.startValue : !this.date;
    return {
      valueMissing: this.required && !this.disabled && empty,
      message: this.sfWord(this.hasTime ? `value-missing-${this.mode}` : 'value-missing'),
      anchor: this._input || null
    };
  } // form.reset(): the value as written, without events (§17.1 item 4).


  fieldReset() {
    for (const [name, value] of Object.entries(this._written || {})) {
      if (value === null) this.removeAttribute(name);else this.setAttribute(name, value);
    }

    this.requestComponentUpdate('reset');
  }

  get label() {
    return this.getAttribute('label') || '';
  }

  get disabled() {
    return this.getBooleanAttr('disabled', false);
  }

  get required() {
    return this.getBooleanAttr('required', false);
  }

  get invalid() {
    return this.getBooleanAttr('invalid', false);
  }

  get errorMessage() {
    return this.getAttribute('error-message') || '';
  }

  get closeOnSelect() {
    return this.getBooleanAttr('close-on-select', true);
  }

  get leftIcon() {
    if (this.hasAttribute('icon-start')) return this.getAttribute('icon-start');
    return this.getAttribute('left-icon') || (this.mode === 'time' ? 'schedule' : 'calendar_today');
  }

  get iconStart() {
    return this.leftIcon;
  }

  get inputRootClass() {
    return this.getAttribute('input-root-class') || '';
  }

  get mask() {
    return this.getBooleanAttr('mask', false);
  }

  get maskPattern() {
    return this.getAttribute('mask-pattern') || this.formatToMask(this.format);
  }

  get maskLazy() {
    return this.hasAttribute('mask-lazy') ? this.getBooleanAttr('mask-lazy', false) : false;
  }

  get maskPlaceholderChar() {
    return this.getAttribute('mask-placeholder-char') || '_';
  }

  get maskOptions() {
    return this.getAttribute('mask-options') || '';
  }

  get year() {
    const fallback = this.anchorDate.getFullYear();
    return this.hasAttribute('year') ? this.getNumberAttr('year', fallback) : fallback;
  }

  set year(nextValue) {
    this.setState({
      year: nextValue === null || typeof nextValue === 'undefined' || nextValue === '' ? '' : String((0,_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__.toNumber)(nextValue, new Date().getFullYear()))
    });
    this._gridMoved = false;
  }

  get month() {
    const fallback = this.anchorDate.getMonth();
    return this.hasAttribute('month') ? normalizeMonth(this.getAttribute('month'), fallback) : fallback;
  }

  set month(nextValue) {
    this.setState({
      month: nextValue === null || typeof nextValue === 'undefined' || nextValue === '' ? '' : String(normalizeMonth(nextValue, new Date().getMonth()))
    });
    this._gridMoved = false;
  }

  get contextMode() {
    return this.getEnumAttr('context', ['month', 'year', ''], '');
  } // The week starts where the page's language starts it when the attribute
  // does not say: Monday for ru, Sunday for en-US (docs trial 4: a
  // Sunday-first locale needed a manual attribute).
  // Any day may open the week, 0 Sunday to 6 Saturday: the grid counts from
  // it modulo seven. Only Sunday and Monday were kept, so a Saturday-first
  // locale (ar-EG, fa-IR) got Monday (documentation trial 6, 2026-10-18).


  get weekStart() {
    if (this.hasAttribute('week-start')) {
      const day = this.getNumberAttr('week-start', 1);
      return Number.isInteger(day) && day >= 0 && day <= 7 ? day % 7 : 1;
    }

    return (0,_js_locale_calendar_js__WEBPACK_IMPORTED_MODULE_8__.localeWeekStart)(this.locale);
  }

  get locale() {
    return normalizeLocale(this.getAttribute('locale'), this);
  }

  get weekend() {
    return this.getAttribute('weekend') || '';
  } // The days drawn as days off (owner decision C62): the locale's
  // (Intl.Locale#getWeekInfo, Saturday and Sunday where it does not say),
  // none for weekend="none" -- a product whose weekends are working days --
  // or the days the attribute lists, 0 or 7 Sunday to 6 Saturday. They
  // were Saturday and Sunday for every locale and every product.


  get weekendDays() {
    return (0,_js_locale_calendar_js__WEBPACK_IMPORTED_MODULE_8__.weekendDays)(this.weekend, this.locale);
  } // The display format of the mode. A written format the mode cannot use is
  // completed: datetime adds « HH:mm» to a date format, time takes HH:mm.
  // Without one the date's format is the locale's (owner decision C62): the
  // order of the parts and the signs between them from Intl formatToParts --
  // DD.MM.YYYY in ru and de, MM/DD/YYYY in en-US, YYYY-MM-DD in sv-SE. It was
  // DD.MM.YYYY for every language, so an en-US page showed 03.09.2026 for
  // September 3 and read 09/03/2026 as March 9.


  get format() {
    const written = this.getAttribute('format') || '';
    const mode = this.mode;
    if (mode === 'date') return written || (0,_js_locale_calendar_js__WEBPACK_IMPORTED_MODULE_8__.localeDateFormat)(this.locale);
    if (mode === 'time') return written && formatPattern(written, 'time') ? written : 'HH:mm';
    if (written && formatPattern(written, 'datetime')) return written;
    return `${written && formatPattern(written, 'date') ? written : (0,_js_locale_calendar_js__WEBPACK_IMPORTED_MODULE_8__.localeDateFormat)(this.locale)} HH:mm`;
  } // The name for a field whose label is drawn outside it -- a record panel
  // prints the label itself, and passing it to the control printed it twice.


  get ariaLabel() {
    return this.getProp('ariaLabel') || '';
  } // Read-only as the field draws it, not just the attribute: a range is always
  // chosen on the grid (one field holding two dates has no single format to
  // read back), so `range` alone makes the field read-only. The template reads
  // this same value -- it once read `!this.typed`, which also counted
  // `disabled`, so a range or disabled field drew read-only while the
  // component said it was not.


  get readonly() {
    return this.range || this.getBooleanAttr('readonly', false);
  } // The host's `readonly`: the value is shown and submitted, never changed
  // here (owner decision C62: a read-only field does not open the calendar).
  // The field opens no panel, and an inline calendar takes no choice -- its
  // days, quick ranges and time stay readable and can be walked through.
  // `readonly` above also counts a range, which is only "not typed": a range
  // still opens its calendar. It opened for the host's `readonly` too, so a
  // value the page said could not be changed could be changed on the grid.


  get valueLocked() {
    return this.getBooleanAttr('readonly', false);
  } // A date can be typed. The field was hard-readonly, so a host that edits a
  // date could only pick one on the grid -- and the mask properties beside it
  // reached a field nobody could type in (Larena storage QA, 2026-10-22).
  // A range is still chosen on the grid -- `readonly` already says so.


  get typed() {
    return !this.readonly && !this.disabled;
  }

  get formattedValue() {
    if (!this.hasTime) return formatDateValue(this.selectedDate, this.format);
    const minutes = this.selectedMinutes;
    if (minutes === null || this.mode === 'datetime' && !this.selectedDate) return '';
    return formatDateValue(this.mode === 'time' ? null : this.selectedDate, this.format, minutes);
  }

  get formattedStartValue() {
    return formatDateValue(this.startDate, this.format);
  }

  get formattedEndValue() {
    return formatDateValue(this.endDate, this.format);
  }

  get displayValue() {
    if (!this.range) {
      return this.formattedValue;
    } // One field, «с – по»: the two dates with an en dash between spaces
    // (owner decision C62). It was a hyphen, the sign of a compound word.


    if (this.formattedStartValue && this.formattedEndValue) {
      return `${this.formattedStartValue}${RANGE_SEPARATOR}${this.formattedEndValue}`;
    }

    return this.formattedStartValue || this.formattedEndValue || '';
  }

  get displayDate() {
    return new Date(this.year, this.month, 1);
  }

  get isRtl() {
    return (this.closest('[dir]')?.getAttribute('dir') || document.documentElement?.dir) === 'rtl';
  }

  get labels() {
    return getLabels(this);
  }

  get weekdays() {
    return getWeekdays(this.locale, this.weekStart);
  } // Which weekday columns are days off, in the order of the weekday row
  // (owner decision C62 «выходные красным», prototypes/datepicker.html: the
  // headers сб and вс take the days' red too). The same days as the grid's.


  get weekdaysOff() {
    const daysOff = this.weekendDays;
    return Array.from({
      length: 7
    }, (_, index) => daysOff.has((this.weekStart + index) % 7));
  }

  get calendarLabel() {
    try {
      return dateFormat(this.locale, {
        month: 'long',
        year: 'numeric'
      }).format(this.displayDate);
    } catch {
      return `${this.month + 1}.${this.year}`;
    }
  }

  get activeDate() {
    const candidate = parseDate(this.state.activeDate) || this.primaryDate || this.displayDate;
    const minDate = this.setMinDate();
    const maxDate = this.setMaxDate();
    if (minDate && compareDates(candidate, minDate) < 0) return minDate;
    if (maxDate && compareDates(candidate, maxDate) > 0) return maxDate;
    return candidate;
  }

  get normalizedRange() {
    const startDate = this.startDate;
    const endDate = this.endDate;

    if (!startDate || !endDate) {
      return {
        startDate,
        endDate
      };
    }

    if (compareDates(startDate, endDate) <= 0) {
      return {
        startDate,
        endDate
      };
    }

    return {
      startDate: endDate,
      endDate: startDate
    };
  }

  get days() {
    const firstDay = new Date(this.year, this.month, 1);
    const firstWeekDay = firstDay.getDay();
    const offset = (firstWeekDay - this.weekStart + 7) % 7;
    const gridStartDate = new Date(this.year, this.month, 1 - offset);
    const {
      startDate,
      endDate
    } = this.normalizedRange;
    const hasRangeEnd = Boolean(this.startValue && this.endValue);
    const minDate = this.setMinDate();
    const maxDate = this.setMaxDate();
    const activeDate = this.activeDate;
    const today = new Date();
    const daysOff = this.weekendDays;
    return Array.from({
      length: 42
    }).map((_, index) => {
      const date = new Date(gridStartDate.getFullYear(), gridStartDate.getMonth(), gridStartDate.getDate() + index);
      const time = date.getTime(); // A disabled field disables every day: a panel a host holds open,
      // or the inline one, takes no choice (see panelDisabled).

      const disabled = Boolean(this.disabled || minDate && time < minDate.getTime() || maxDate && time > maxDate.getTime());
      const weekend = daysOff.has(date.getDay());
      return {
        date,
        value: formatIsoDate(date),
        formattedValue: formatDateValue(date, this.format),
        // A day off says so in its name (DP-02): the ink is not the
        // only cue. The ink is the calendar's day-off role
        // (--sf-datepicker-day-off, C67 H2), not the error red.
        label: weekend ? `${getDateLabel(date, this.locale)}, ${this.sfWord('day-off')}` : getDateLabel(date, this.locale),
        day: date.getDate(),
        today: sameDay(date, today),
        currentMonth: date.getMonth() === this.month,
        weekend,
        disabled: disabled,
        selected: this.range ? sameDay(date, startDate) || sameDay(date, endDate) : sameDay(date, this.selectedDate),
        rangeStart: this.range && hasRangeEnd && sameDay(date, startDate),
        rangeEnd: this.range && hasRangeEnd && sameDay(date, endDate),
        rangeSelected: this.range && hasRangeEnd && isBetweenDates(date, startDate, endDate),
        tabIndex: !disabled && sameDay(date, activeDate) ? 0 : -1
      };
    });
  }

  get months() {
    const minDate = this.setMinDate();
    const maxDate = this.setMaxDate();
    const minMonth = minDate ? new Date(minDate.getFullYear(), minDate.getMonth(), 1) : null;
    const maxMonth = maxDate ? new Date(maxDate.getFullYear(), maxDate.getMonth(), 1) : null;
    return Array.from({
      length: 12
    }).map((_, index) => {
      const date = new Date(this.year, index, 1);
      const time = date.getTime();
      const disabled = Boolean(this.disabled || minMonth && time < minMonth.getTime() || maxMonth && time > maxMonth.getTime());
      return {
        index,
        label: getMonthLabel(index, this.locale),
        selected: index === this.month,
        disabled
      };
    });
  }

  get years() {
    const minDate = this.setMinDate();
    const maxDate = this.setMaxDate();
    const start = this.yearPageStart;
    return Array.from({
      length: YEARS_PAGE_SIZE
    }).map((_, index) => {
      const year = start + index;
      const disabled = Boolean(this.disabled || minDate && year < minDate.getFullYear() || maxDate && year > maxDate.getFullYear());
      return {
        year,
        disabled: disabled,
        selected: year === this.year
      };
    });
  }

  get yearPageStart() {
    return this.state.yearPageStart ?? this.getYearPageStart(this.year);
  }

  get yearPageEnd() {
    return this.yearPageStart + YEARS_PAGE_SIZE - 1;
  }

  getYearPageStart(year = this.year) {
    const normalizedYear = (0,_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__.toNumber)(year, new Date().getFullYear());
    return normalizedYear - normalizedYear % YEARS_PAGE_SIZE;
  }

  formatToMask = format => {
    let mask = String(format).replace(/[A-Za-z]/g, '0');

    if (this.range) {
      mask += `${RANGE_SEPARATOR}${mask}`;
    }

    return mask;
  };

  setContext(nextContext = '') {
    this.setState({
      context: nextContext || ''
    });
    return this;
  }

  toggleContext(nextContext) {
    if (this.disabled) return this;
    const nextMode = this.contextMode === nextContext ? '' : nextContext;
    const nextState = {
      context: nextMode
    };

    if (nextMode === 'year') {
      nextState.yearPageStart = this.getYearPageStart(this.year);
    } // The list that opens takes the focus on its chosen month or year; the
    // one that closes gives it back to its toggle (audit S11b: the lists
    // could not be reached by keyboard, and the focus fell to the page).


    if (nextMode) this._focusContextAfterRender = true;else this._focusToggleAfterRender = nextContext;
    this.setState(nextState);
    return this;
  } // The month or year list is one tab stop (the chosen item, or the first
  // that can be chosen); the arrows move in its three columns, Home and End
  // go to its ends, Enter and Space choose (they are buttons).


  focusContextItem() {
    this._focusContextAfterRender = false;
    const items = [...this.querySelectorAll('.sf-datepicker-context .sf-datepicker-text')];
    (items.find(item => item.tabIndex === 0) || items.find(item => !item.disabled))?.focus?.();
  }

  handleContextKeydown(event) {
    const items = [...this.querySelectorAll('.sf-datepicker-context .sf-datepicker-text')];
    const index = items.indexOf(event.target.closest?.('.sf-datepicker-text'));
    if (index < 0) return;
    const horizontal = this.isRtl ? -1 : 1;
    const steps = {
      ArrowLeft: -horizontal,
      ArrowRight: horizontal,
      ArrowUp: -3,
      ArrowDown: 3
    };
    let next = -1;

    if (event.key in steps) {
      const step = steps[event.key];

      for (let at = index + step; at >= 0 && at < items.length; at += step) {
        if (!items[at].disabled) {
          next = at;
          break;
        }
      }
    } else if (event.key === 'Home') {
      next = items.findIndex(item => !item.disabled);
    } else if (event.key === 'End') {
      next = items.findLastIndex(item => !item.disabled);
    } else {
      return;
    }

    event.preventDefault();
    if (next < 0 || next === index) return;
    items[index].tabIndex = -1;
    items[next].tabIndex = 0;
    items[next].focus();
  }

  shiftYearPage(direction = 1) {
    if (this.disabled) return this;
    this.set({
      yearPageStart: this.yearPageStart + YEARS_PAGE_SIZE * direction
    });
    return this;
  }

  shiftMonth(direction = 1) {
    if (this.disabled) return this;
    const next = new Date(this.year, this.month + direction, 1);
    const minDate = this.setMinDate();
    const maxDate = this.setMaxDate();
    if (minDate && next < new Date(minDate.getFullYear(), minDate.getMonth(), 1)) return this;
    if (maxDate && next > new Date(maxDate.getFullYear(), maxDate.getMonth(), 1)) return this;
    this.setState({
      year: next.getFullYear(),
      month: next.getMonth(),
      context: ''
    });
    this.set({
      activeDate: formatIsoDate(next)
    });
    return this;
  }

  setActiveDate(value) {
    const date = parseDate(value);
    if (!date || this.state.activeDate === value) return this;
    this.set({
      activeDate: formatIsoDate(date)
    });
    return this;
  }

  moveActiveDate(days) {
    const next = new Date(this.activeDate);
    next.setDate(next.getDate() + days);
    const minDate = this.setMinDate();
    const maxDate = this.setMaxDate();
    if (minDate && compareDates(next, minDate) < 0) return this;
    if (maxDate && compareDates(next, maxDate) > 0) return this;
    this._focusDateAfterRender = true;
    this.setState({
      year: next.getFullYear(),
      month: next.getMonth(),
      context: ''
    });
    this.set({
      activeDate: formatIsoDate(next)
    });
    return this;
  }

  _openPanel({
    focusCalendar = false
  } = {}) {
    if (this.disabled || this.valueLocked) return this;

    if (this._sheetOpen || this.usesRibbon) {
      this._openRibbon();

      return this;
    }

    this._focusCalendarOnOpen = focusCalendar;
    if (!this.open) this.showValueMonth();else if (!this.state.activeDate) {
      this.set({
        activeDate: formatIsoDate(this.activeDate)
      });
    }

    if (this.open) {
      this.positionPanel();
      return this;
    }

    this.setState({
      open: true
    });
    return this;
  }

  _closePanel({
    restoreFocus = false
  } = {}) {
    if (this._sheetOpen) {
      // The sheet gives the focus back to the field itself.
      this._sheet?.close?.({
        reason: 'api'
      });
      return this;
    }

    if (!this.open) {
      return this;
    }

    this.setState({
      open: false,
      context: ''
    });
    if (restoreFocus) requestAnimationFrame(() => this._input?.focus?.());
    return this;
  }

  _togglePanel() {
    return this.open || this._sheetOpen ? this._closePanel() : this._openPanel();
  } // The period on a phone (owner decision C62, agreed 2026-11-11; ui-control
  // prototypes/datepicker.html#lenta): below the phone step (60rem, the
  // breakpoint lg) a range opens a ribbon of months in the Framework's bottom
  // sheet instead of one month with arrows -- the weekday row pinned, the
  // months one under another, the period and «Готово» at the bottom. A
  // period across months is two taps and one scroll, where the arrows needed
  // a tap per month and never showed the start beside the end. The choice is
  // a draft until «Готово»; closing the sheet any other way (the close
  // button, the scrim, Escape, a swipe down) keeps the value it had.


  get usesRibbon() {
    if (!this.range || !this.input || this._ribbonUnavailable) return false;
    return (0,_core_js_breakpoints_js__WEBPACK_IMPORTED_MODULE_10__.matchesBreakpoint)('lg', {
      below: true
    });
  }

  async _openRibbon() {
    if (this._sheetOpen || this._sheetOpening) return;
    this._sheetOpening = true;

    try {
      // The sheet is a lazy relation: asked for when a phone opens a period.
      if (!globalThis.customElements?.get('sf-drawer')) await globalThis.SF?.Loader?.ensure?.(['sf-drawer']);
    } catch {// The popup below.
    }

    this._sheetOpening = false;
    if (!this.isConnected || this.disabled || this.valueLocked) return;

    if (!globalThis.customElements?.get('sf-drawer')) {
      // No bottom sheet on this page: the popup, as on a wide screen.
      this._ribbonUnavailable = true;

      this._openPanel();

      return;
    }

    const {
      startDate,
      endDate
    } = this.normalizedRange;
    const minDate = this.setMinDate();
    const maxDate = this.setMaxDate();
    let anchor = startDate || new Date();
    if (minDate && compareDates(anchor, minDate) < 0) anchor = minDate;
    if (maxDate && compareDates(anchor, maxDate) > 0) anchor = maxDate;
    const first = new Date(anchor.getFullYear(), anchor.getMonth() - RIBBON_BEFORE, 1);
    this._ribbon = {
      start: startDate ? formatIsoDate(startDate) : '',
      end: startDate && endDate ? formatIsoDate(endDate) : '',
      focus: formatIsoDate(anchor),
      anchor: `${anchor.getFullYear()}-${padDatePart(anchor.getMonth() + 1)}`,
      from: this.clampRibbonMonth(first),
      count: 0
    };
    this._ribbon.count = this.ribbonMonthsUntil(new Date(anchor.getFullYear(), anchor.getMonth() + RIBBON_AFTER, 1));
    const sheet = this.ribbonSheet(); // The sheet's head is the ribbon's own (the title, «К сегодня», the
    // close button, as in #lenta): the drawer's head has no place for a
    // second action. The drawer keeps the name of its dialog.

    this._ribbon.title = this.label || this.ariaLabel || this.sfWord('period');
    sheet.setAttribute('label', this._ribbon.title);
    sheet.setAttribute('panel-style', this.ribbonSheetStyle());
    this._sheetOpen = true;
    this.renderRibbon();
    this.watchRibbonPanelFocus();
    sheet.open();
    this.requestComponentUpdate('sheet');
  } // The bottom sheet, made once and kept in the host, so it carries the
  // field's language, direction, theme and variables to its portal.


  ribbonSheet() {
    if (this._sheet?.isConnected && this._sheet.parentNode === this) return this._sheet;
    const sheet = document.createElement('sf-drawer');
    sheet.id = (0,_core_js_instance_path__WEBPACK_IMPORTED_MODULE_2__.partId)((0,_core_js_instance_path__WEBPACK_IMPORTED_MODULE_2__.instancePath)(this, {
      kind: 'sf-input-date'
    }), 'sheet');
    sheet.setAttribute('placement', 'bottom');
    sheet.setAttribute('show-close', 'false');
    const body = document.createElement('div');
    body.className = 'sf-datepicker sf-datepicker--sheet';
    sheet.append(body);
    sheet.addEventListener('sf-drawer-opened', () => this.showRibbonAnchor());
    sheet.addEventListener('sf-drawer-closed', () => this.ribbonClosed());
    this.append(sheet);
    this._sheet = sheet;
    this._sheetBody = body;
    return sheet;
  } // How tall the sheet is (#lenta): it stops a step 1 under the field it
  // fills, so the field and its label stay readable through the scrim; it
  // took the whole screen (snap full, intent acceptance 2026-11-12 D3). A
  // field low on the screen still gets half of it. The sheet rests at its
  // content's height (snap auto), held to this.


  ribbonSheetStyle() {
    const box = (this.querySelector('.sf-datepicker-wrap') || this).getBoundingClientRect();
    const top = Math.max(0, Math.round(box.bottom));
    return `max-block-size: max(50%, calc(100% - ${top}px - var(--sf-space-1)));`;
  } // «К сегодня» in the sheet's head: the ribbon brings today's month to its
  // top (smoothly, unless the person asked for less motion) and today
  // becomes the ribbon's tab stop; the draft period stays as it is. Today
  // outside min-date and max-date goes to the nearest allowed day.


  ribbonToToday() {
    const ribbon = this._ribbon;
    if (!ribbon) return;
    let today = new Date();
    today = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const minDate = this.setMinDate();
    const maxDate = this.setMaxDate();
    if (minDate && compareDates(today, minDate) < 0) today = minDate;
    if (maxDate && compareDates(today, maxDate) > 0) today = maxDate;
    const month = new Date(today.getFullYear(), today.getMonth(), 1);
    const last = new Date(ribbon.from.getFullYear(), ribbon.from.getMonth() + ribbon.count - 1, 1); // Outside the window: the window starts over around today, as it
    // does around the start when the sheet opens.

    const outside = month < ribbon.from || month > last;

    if (outside) {
      ribbon.from = this.clampRibbonMonth(new Date(month.getFullYear(), month.getMonth() - RIBBON_BEFORE, 1));
      ribbon.count = this.ribbonMonthsUntil(new Date(month.getFullYear(), month.getMonth() + RIBBON_AFTER, 1));
    }

    ribbon.focus = formatIsoDate(today);
    this.renderRibbon();
    const scroller = this.ribbonScroller;
    const target = scroller?.querySelector(`[data-month="${today.getFullYear()}-${padDatePart(today.getMonth() + 1)}"]`);
    if (!scroller || !target) return;
    const smooth = !outside && !globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (!smooth) {
      scroller.scrollTo({
        top: target.offsetTop,
        behavior: 'instant'
      });
      return;
    } // The window does not grow while the ribbon glides there: a month put
    // above would move the place it is gliding to.


    ribbon.shown = false;

    const settle = () => {
      if (this._ribbon !== ribbon || ribbon.shown) return;
      ribbon.shown = true;
      this.handleRibbonScroll();
    };

    scroller.addEventListener('scrollend', settle, {
      once: true
    });
    setTimeout(settle, 1000);
    scroller.scrollTo({
      top: target.offsetTop,
      behavior: 'smooth'
    });
  } // The close button of the sheet's head: as the drawer's own, it keeps the
  // value the field had.


  closeRibbon() {
    this._sheet?.close?.({
      reason: 'close'
    });
  }

  ribbonClosed() {
    this.stopRibbonSizeWatch();
    this.stopRibbonPanelFocus();
    this._sheetOpen = false;
    this._ribbon = null;
    this.requestComponentUpdate('sheet');
  } // The first month the ribbon may show: min-date's, or any.


  clampRibbonMonth(date) {
    const min = this.setMinDate();
    const floor = min ? new Date(min.getFullYear(), min.getMonth(), 1) : null;
    return floor && date < floor ? floor : date;
  } // How many months from the ribbon's first one up to `last` (held to
  // max-date's month).


  ribbonMonthsUntil(last) {
    const max = this.setMaxDate();
    const ceiling = max ? new Date(max.getFullYear(), max.getMonth(), 1) : null;
    const end = ceiling && last > ceiling ? ceiling : last;
    const {
      from
    } = this._ribbon;
    return Math.max(1, (end.getFullYear() - from.getFullYear()) * 12 + end.getMonth() - from.getMonth() + 1);
  }

  get ribbonScroller() {
    return this._sheetBody?.querySelector('.sf-datepicker-ribbon') || null;
  } // The month the ribbon opens on stands at its top, at once (no animation),
  // and its focused day takes the focus. The sheet has its size only once it
  // is open and laid out -- and on the first open, only once the drawer's
  // own sheet has come: the drawer holds its panel out of view until then,
  // and gives the panel the focus when it shows. Thirty frames of waiting
  // ran out before that on every first open (intent acceptance 2026-11-12,
  // D2: 36 of 36 phone views), so the day was never focused and the panel
  // kept the focus. The ribbon waits for its own size instead, however long
  // the sheet takes, and takes the focus after the drawer has given it.


  showRibbonAnchor() {
    const scroller = this.ribbonScroller;
    if (!this._ribbon || !scroller) return;

    if (!scroller.clientHeight) {
      this.waitForRibbonSize(scroller);
      return;
    }

    const month = scroller.querySelector(`[data-month="${this._ribbon.anchor}"]`);
    if (month) scroller.scrollTo({
      top: month.offsetTop,
      behavior: 'instant'
    });
    this.focusRibbonDay(); // The window grows only from here: before, the ribbon stood at its top
    // and would have asked for months it does not show.

    this._ribbon.shown = true;
  } // The drawer gives the focus to its panel when it opens, and on the first
  // open again when it shows the panel it held out of view until its sheet
  // came -- after the ribbon had tried to focus its day on a panel that could
  // not take a focus yet (intent acceptance 2026-11-12, D2). The panel
  // taking the focus while the ribbon is open hands it on to the ribbon's
  // day, so the sheet always opens on the start, focused.


  watchRibbonPanelFocus() {
    if (this._ribbonPanelFocus) return;

    this._ribbonPanelFocus = event => {
      const panel = this._sheetBody?.closest('[data-sf-drawer-panel]');
      if (!this._sheetOpen || !this._ribbon || !panel || event.target !== panel) return;
      if (!this.ribbonScroller?.clientHeight) return;
      this.focusRibbonDay();
    };

    document.addEventListener('focusin', this._ribbonPanelFocus, true);
  }

  stopRibbonPanelFocus() {
    if (!this._ribbonPanelFocus) return;
    document.removeEventListener('focusin', this._ribbonPanelFocus, true);
    this._ribbonPanelFocus = null;
  }

  waitForRibbonSize(scroller) {
    if (this._ribbonSizeWatch || typeof ResizeObserver !== 'function') return;
    const ribbon = this._ribbon;
    const watch = new ResizeObserver(() => {
      if (this._ribbon !== ribbon || !this._sheetOpen) {
        this.stopRibbonSizeWatch();
        return;
      }

      if (!scroller.clientHeight) return;
      this.stopRibbonSizeWatch();
      this.showRibbonAnchor();
    });
    this._ribbonSizeWatch = watch;
    watch.observe(scroller);
  }

  stopRibbonSizeWatch() {
    this._ribbonSizeWatch?.disconnect();
    this._ribbonSizeWatch = null;
  }

  focusRibbonDay() {
    const scroller = this.ribbonScroller;
    const day = scroller?.querySelector(`.sf-datepicker-day[data-date="${this._ribbon?.focus}"]`);
    if (!day) return;
    day.focus({
      preventScroll: true
    }); // Only the ribbon scrolls, never the page, and the month's title held
    // over the top does not cover the focused row.

    const title = scroller.querySelector('.sf-datepicker-ribbon-title')?.offsetHeight || 0;
    const box = scroller.getBoundingClientRect();
    const cell = day.getBoundingClientRect();
    if (cell.top - box.top < title) scroller.scrollBy({
      top: cell.top - box.top - title,
      behavior: 'instant'
    });else if (cell.bottom > box.bottom) scroller.scrollBy({
      top: cell.bottom - box.bottom,
      behavior: 'instant'
    });
  } // More months as the ribbon nears an end: a window of them, not every
  // month there is. Months put before keep the ones in view where they were.


  handleRibbonScroll() {
    const scroller = this.ribbonScroller;
    const ribbon = this._ribbon;
    if (!scroller || !ribbon || !ribbon.shown || this._ribbonGrowing) return;
    const room = scroller.clientHeight;

    if (scroller.scrollTop < room) {
      const from = this.clampRibbonMonth(new Date(ribbon.from.getFullYear(), ribbon.from.getMonth() - RIBBON_STEP, 1));
      const added = (ribbon.from.getFullYear() - from.getFullYear()) * 12 + ribbon.from.getMonth() - from.getMonth();

      if (added > 0) {
        const height = scroller.scrollHeight;
        ribbon.from = from;
        ribbon.count += added;
        this._ribbonGrowing = true;
        this.renderRibbon();
        scroller.scrollTo({
          top: scroller.scrollTop + scroller.scrollHeight - height,
          behavior: 'instant'
        });
        this._ribbonGrowing = false;
      }
    }

    if (scroller.scrollHeight - scroller.scrollTop - room < room) {
      const last = new Date(ribbon.from.getFullYear(), ribbon.from.getMonth() + ribbon.count - 1 + RIBBON_STEP, 1);
      const count = this.ribbonMonthsUntil(last);

      if (count > ribbon.count) {
        ribbon.count = count;
        this.renderRibbon();
      }
    }
  } // A tap: the first is the start, the second the end; a day before the
  // start, or a tap after both, starts again.


  pickRibbonDay(value) {
    const ribbon = this._ribbon;
    if (!ribbon || this.disabled || this.valueLocked) return;

    if (!ribbon.start || ribbon.end || value < ribbon.start) {
      ribbon.start = value;
      ribbon.end = '';
    } else {
      ribbon.end = value;
    }

    ribbon.focus = value;
    this.renderRibbon();
  } // «Готово»: the period chosen is the value, said once, and the sheet closes.


  commitRibbon() {
    const ribbon = this._ribbon;
    if (!ribbon?.start || !ribbon.end) return;
    const end = parseDate(ribbon.end);
    this.setState({
      startValue: ribbon.start,
      endValue: ribbon.end,
      date: ribbon.start,
      preset: '',
      year: end.getFullYear(),
      month: end.getMonth(),
      context: ''
    });
    this.set({
      activeDate: ribbon.end
    });
    this.emitChange();
    this._sheet?.close?.({
      reason: 'close'
    });
  } // The ribbon's keys are the grid's (APG date picker): the arrows a day and
  // a week across the months' borders, Home and End the week's ends,
  // PageUp and PageDown a month, with Shift a year, all held to min-date and
  // max-date; Enter and Space are the day's own button. The ribbon scrolls
  // to the day.


  handleRibbonKeydown(event, value) {
    const ribbon = this._ribbon;
    const date = parseDate(value);
    if (!ribbon || !date) return;
    const horizontal = this.isRtl ? -1 : 1;
    const steps = {
      ArrowLeft: -horizontal,
      ArrowRight: horizontal,
      ArrowUp: -7,
      ArrowDown: 7
    };
    let next = null;
    if (event.key in steps) next = addDays(date, steps[event.key]);else if (event.key === 'Home' || event.key === 'End') {
      const offset = (date.getDay() - this.weekStart + 7) % 7;
      next = addDays(date, event.key === 'Home' ? -offset : 6 - offset);
    } else if (event.key === 'PageUp' || event.key === 'PageDown') {
      next = shiftDateByMonth(date, (event.key === 'PageUp' ? -1 : 1) * (event.shiftKey ? 12 : 1));
    } else {
      return;
    }
    event.preventDefault();
    const minDate = this.setMinDate();
    const maxDate = this.setMaxDate();
    if (minDate && compareDates(next, minDate) < 0) next = minDate;
    if (maxDate && compareDates(next, maxDate) > 0) next = maxDate;
    const month = new Date(next.getFullYear(), next.getMonth(), 1);

    if (month < ribbon.from) {
      const added = (ribbon.from.getFullYear() - month.getFullYear()) * 12 + ribbon.from.getMonth() - month.getMonth();
      ribbon.from = month;
      ribbon.count += added;
    }

    const last = new Date(ribbon.from.getFullYear(), ribbon.from.getMonth() + ribbon.count - 1, 1);
    if (month > last) ribbon.count = this.ribbonMonthsUntil(month);
    ribbon.focus = formatIsoDate(next);
    this.renderRibbon();
    this.focusRibbonDay();
  } // What the ribbon draws: the months of its window, each a list of weeks
  // (null for the days of the weeks outside the month), the draft period,
  // and the line under it.


  ribbonContext() {
    const ribbon = this._ribbon;
    const locale = this.locale;
    const weekStart = this.weekStart;
    const daysOff = this.weekendDays;
    const minDate = this.setMinDate();
    const maxDate = this.setMaxDate();
    const start = parseDate(ribbon.start);
    const end = parseDate(ribbon.end);
    const today = new Date();
    const months = Array.from({
      length: ribbon.count
    }, (_, index) => {
      const first = new Date(ribbon.from.getFullYear(), ribbon.from.getMonth() + index, 1);
      const lead = (first.getDay() - weekStart + 7) % 7;
      const length = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
      const cells = Array.from({
        length: Math.ceil((lead + length) / 7) * 7
      }, (_, at) => {
        const day = at - lead + 1;
        if (day < 1 || day > length) return null;
        const date = new Date(first.getFullYear(), first.getMonth(), day);
        const value = formatIsoDate(date);
        const weekend = daysOff.has(date.getDay());
        const disabled = Boolean(minDate && compareDates(date, minDate) < 0 || maxDate && compareDates(date, maxDate) > 0);
        const both = Boolean(start && end);
        return {
          value,
          day,
          weekend,
          disabled,
          today: sameDay(date, today),
          label: weekend ? `${getDateLabel(date, locale)}, ${this.sfWord('day-off')}` : getDateLabel(date, locale),
          selected: sameDay(date, start) || sameDay(date, end),
          rangeStart: both && sameDay(date, start),
          rangeEnd: both && sameDay(date, end),
          rangeSelected: both && isBetweenDates(date, start, end),
          tabIndex: value === ribbon.focus ? 0 : -1
        };
      });
      const weeks = [];

      for (let at = 0; at < cells.length; at += 7) weeks.push(cells.slice(at, at + 7));

      let label;

      try {
        label = capitalizeFirstLetter(dateFormat(locale, {
          month: 'long',
          year: 'numeric'
        }).format(first));
      } catch {
        label = `${first.getMonth() + 1}.${first.getFullYear()}`;
      }

      return {
        key: `${first.getFullYear()}-${padDatePart(first.getMonth() + 1)}`,
        label,
        weeks
      };
    });
    return {
      component: this,
      months,
      weekdays: this.weekdays,
      weekdaysOff: this.weekdaysOff,
      weekdayNames: getWeekdays(locale, weekStart, 'long'),
      labels: this.labels,
      title: ribbon.title,
      complete: Boolean(start && end),
      periodSummary: this.ribbonSummary(start, end)
    };
  } // The line over «Готово»: what to do next, or the period and its length,
  // in the page's language (Intl formatRange and a unit of days).


  ribbonSummary(start, end) {
    const locale = this.locale;
    const long = {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    };
    if (!start) return {
      strong: '',
      note: this.sfWord('choose-start')
    };

    if (!end) {
      let text;

      try {
        text = dateFormat(locale, long).format(start);
      } catch {
        text = formatIsoDate(start);
      }

      return {
        strong: `${text} \u2013`,
        note: this.sfWord('choose-end')
      };
    }

    let text;
    let length;
    const days = Math.round((end - start) / 86400000) + 1;

    try {
      text = dateFormat(locale, long).formatRange(start, end);
    } catch {
      text = `${formatIsoDate(start)}${RANGE_SEPARATOR}${formatIsoDate(end)}`;
    }

    try {
      length = new Intl.NumberFormat(locale, {
        style: 'unit',
        unit: 'day',
        unitDisplay: 'long'
      }).format(days);
    } catch {
      length = String(days);
    }

    return {
      strong: text,
      note: length
    };
  }

  renderRibbon() {
    if (!this._sheetBody || !this._ribbon) return;
    (0,lit__WEBPACK_IMPORTED_MODULE_5__.render)((0,_js_templates_ribbon_js__WEBPACK_IMPORTED_MODULE_7__.renderDatepickerRibbon)(this.ribbonContext()), this._sheetBody);
  } // What is typed is read through the declared format, so «14.10.2026» and
  // «2026-10-14» both land. Text that is not a date, or a date outside the
  // allowed range, puts the field back to the value it held: a half-typed date
  // must not clear a stored one. An emptied field clears the value, because
  // deleting the text is how a person says there is no date.


  handleInputChange(event) {
    if (!this.typed) return; // The field's own change belongs to the component, not to the page: it
    // carries the display text, and a host reading `event.target.value` on
    // it would store «14.10.2026» where it expects the ISO value. The
    // component says the change itself, once, through emitChange.

    if (event?.type === 'change') event.stopPropagation();
    const field = event?.target;
    const text = String(field?.value ?? '').trim();

    const restore = () => {
      const input = field?.querySelector?.('input') || field;
      if (input && 'value' in input) input.value = this.displayValue;
    };

    if (!text) {
      if (!this.date) return;
      this._draftMinutes = null;
      this.setState({
        date: '',
        context: ''
      });
      this.emitChange();
      return;
    }

    if (this.hasTime) {
      this.commitTypedTime(text, restore);
      return;
    }

    const date = parseDateValue(text, this.format);
    const minDate = this.setMinDate();
    const maxDate = this.setMaxDate();
    const outOfRange = Boolean(date) && (minDate && compareDates(date, minDate) < 0 || maxDate && compareDates(date, maxDate) > 0);

    if (!date || outOfRange) {
      restore();
      return;
    }

    const value = formatIsoDate(date);

    if (value === this.date) {
      restore();
      return;
    }

    this.setState({
      year: date.getFullYear(),
      month: date.getMonth(),
      date: value,
      context: ''
    });
    this.set({
      activeDate: value
    });
    this.emitChange();
  } // A date and a time, or a time, typed: the whole text in the format (or the
  // ISO form), inside the bounds, the time inside min-time/max-time and on
  // the minute step. Anything else puts the field back, as for a date.


  commitTypedTime(text, restore) {
    const read = parseModeValue(text, this.format, this.mode, {
      typed: true
    });
    const minDate = this.setMinDate();
    const maxDate = this.setMaxDate();
    const dayOut = Boolean(read?.day) && (minDate && compareDates(read.day, minDate) < 0 || maxDate && compareDates(read.day, maxDate) > 0);

    if (!read || dayOut || !this.timeAllowed(read.minutes, read.day)) {
      restore();
      return;
    }

    const value = this.isoOf(read);

    if (value === this.isoOf(this.selectedValue)) {
      restore();
      return;
    }

    this._draftMinutes = null;
    this.setState({ ...(read.day ? {
        year: read.day.getFullYear(),
        month: read.day.getMonth()
      } : {}),
      date: value,
      context: ''
    });
    if (read.day) this.set({
      activeDate: formatIsoDate(read.day)
    });
    this.emitChange();
  } // Typing is not a change: the value is read when the field says it changed,
  // so the keystrokes stay inside the component too.


  handleInputInput(event) {
    if (this.typed) event?.stopPropagation?.();
  }

  handleInputClick(event) {
    event?.preventDefault?.();
    event?.stopPropagation?.();

    this._openPanel();
  }

  handleInputKeydown(event) {
    // In a field that can be typed in, Enter commits the text and the space
    // bar belongs to the text; ArrowDown still opens the grid.
    if (this.typed) {
      if (event.key !== 'ArrowDown' && event.key !== 'Enter') return;
      event.preventDefault();

      if (event.key === 'Enter') {
        this.handleInputChange(event);
        return;
      }

      this._openPanel({
        focusCalendar: true
      });

      return;
    }

    if (!['ArrowDown', 'Enter', ' '].includes(event.key)) return;
    event.preventDefault();

    this._openPanel({
      focusCalendar: true
    });
  }

  handleDayKeydown(event, day) {
    if (this.disabled) return;
    const horizontal = this.isRtl ? -1 : 1;
    const keySteps = {
      ArrowLeft: -horizontal,
      ArrowRight: horizontal,
      ArrowUp: -7,
      ArrowDown: 7
    };

    if (Object.prototype.hasOwnProperty.call(keySteps, event.key)) {
      event.preventDefault();
      this.moveActiveDate(keySteps[event.key]);
      return;
    } // Home and End take the first and last day of the week, held to the
    // bounds: a week that starts before min-date stops at min-date instead
    // of doing nothing (datepicker audit S05e).


    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      const date = day?.date || this.activeDate;
      const offset = (date.getDay() - this.weekStart + 7) % 7;
      const next = new Date(date);
      next.setDate(next.getDate() + (event.key === 'Home' ? -offset : 6 - offset));
      const minDate = this.setMinDate();
      const maxDate = this.setMaxDate();
      if (minDate && compareDates(next, minDate) < 0) next.setTime(minDate.getTime());
      if (maxDate && compareDates(next, maxDate) > 0) next.setTime(maxDate.getTime());
      this.moveActiveDate(Math.round((new Date(next.getFullYear(), next.getMonth(), next.getDate()) - new Date(date.getFullYear(), date.getMonth(), date.getDate())) / 86400000));
      return;
    } // PageUp and PageDown turn a month, with Shift a year (APG date picker
    // dialog; audit S05d).


    if (event.key === 'PageUp' || event.key === 'PageDown') {
      event.preventDefault();
      const direction = (event.key === 'PageUp' ? -1 : 1) * (event.shiftKey ? 12 : 1);
      let next = shiftDateByMonth(this.activeDate, direction);
      const minDate = this.setMinDate();
      const maxDate = this.setMaxDate();
      if (minDate && compareDates(next, minDate) < 0) next = minDate;
      if (maxDate && compareDates(next, maxDate) > 0) next = maxDate;
      this._focusDateAfterRender = true;
      this.setState({
        year: next.getFullYear(),
        month: next.getMonth()
      });
      this.set({
        activeDate: formatIsoDate(next)
      });
    }
  } // The calendar is a non-modal dialog under its field: Tab moves through the
  // field and the panel, and the focus going anywhere else closes the panel,
  // as a click outside does. It stayed open behind the next field (audit
  // S08). The focus is not taken back: the person went where Tab took them.
  // A focus that goes nowhere (a removed button, the window losing focus)
  // keeps the panel.


  handleFocusout(event) {
    if (!this.open || !this.input) return;
    const next = event.relatedTarget;
    if (!next || this.contains(next) || this.refs.datePickerPanel.value?.contains?.(next)) return;

    this._closePanel();
  }

  handlePanelClick(event) {
    event?.stopPropagation?.();
  }

  handleDocumentClick(event) {
    if (!this.open) {
      return;
    }

    const target = event.target;

    if (this.contains(target) || this.refs.datePickerPanel.value?.contains?.(target)) {
      return;
    }

    this._closePanel();
  } // An open calendar owns Escape: the press closes the calendar, the focus goes
  // back to the field, and nothing behind it -- a drawer, a modal, a record
  // panel -- sees the press. It listened in the bubble phase and raised no
  // mark, so a drawer listening before it and a record panel listening in
  // capture both closed first, and the date typed into the field went with
  // the panel (Larena admin acceptance, 2026-10-22). Now it listens in capture
  // like every other surface that owns Escape, holds the shared open-surface
  // mark while open, and acts only as the innermost open layer, so a calendar
  // inside a popover closes before the popover does.


  handleDocumentKeydown(event) {
    if (!this.open || event.key !== 'Escape' || event.defaultPrevented) {
      return;
    }

    if (!(0,_core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_16__.isTopOpenSurface)(this)) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    if (this.contextMode) {
      this._focusToggleAfterRender = this.contextMode;
      this.setContext('');
      return;
    }

    this._closePanel({
      restoreFocus: true
    });
  }

  syncOverlayListeners() {
    const open = Boolean(this.input && this.open);
    (0,_core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_16__.holdOpenSurfaceMark)(this, open);

    if (open) {
      document.addEventListener('click', this._documentClickHandler);
      document.addEventListener('keydown', this._documentKeydownHandler, true);
      return;
    }

    this.removeOverlayListeners();
  }

  removeOverlayListeners() {
    (0,_core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_16__.holdOpenSurfaceMark)(this, false);
    document.removeEventListener('click', this._documentClickHandler);
    document.removeEventListener('keydown', this._documentKeydownHandler, true);
    this.stopPanelPosition();
    window.removeEventListener('resize', this._viewportHandler);
    document.removeEventListener('scroll', this._viewportHandler, true);
    window.visualViewport?.removeEventListener('resize', this._viewportHandler);
    window.visualViewport?.removeEventListener('scroll', this._viewportHandler);
  }

  positionPanel() {
    const panel = this.refs.datePickerPanel.value; // Anchor to the visible field frame, not the bare text input inside it.

    const trigger = this._input?.closest('.sf-input-field') || this._input || this.querySelector('sf-input'); // A deferred call after disconnect must not start tracking detached nodes.

    if (!this.isConnected || !this.input || !this.portal || !this.open || !panel?.isConnected || !trigger) {
      this.stopPanelPosition();
      return;
    } // Shared Framework geometry (SF.Position on Floating UI): below the
    // field, flipped above when it does not fit, shifted and height-limited
    // inside the viewport, following scroll and resize on its own.


    if (!this._panelAnchor || this._panelAnchorPanel !== panel || this._panelAnchorTrigger !== trigger) {
      this.stopPanelPosition();
      Object.assign(panel.style, {
        overflowY: 'auto',
        zIndex: 'var(--sf-layer--popover)'
      });
      this._panelAnchorPanel = panel;
      this._panelAnchorTrigger = trigger;
      this._panelAnchor = (globalThis.SF?.Position || (_core_js_position_js__WEBPACK_IMPORTED_MODULE_9___default())).anchor(trigger, panel, {
        side: 'block-end',
        align: 'start',
        onPosition: ({
          side
        }) => {
          const openAbove = side === 'block-start';
          if (Boolean(this.state.openAbove) !== openAbove) this.set({
            openAbove
          });
        }
      });
      return;
    }

    this._panelAnchor.update();
  }

  stopPanelPosition() {
    this._panelAnchor?.stop();
    this._panelAnchor = null;
    this._panelAnchorPanel = null;
    this._panelAnchorTrigger = null;
  }

  selectDate(day) {
    if (this.disabled || this.valueLocked || !day?.date || day.disabled) {
      return this;
    }

    if (this.range) {
      this.selectRangeDate(day);
      return this;
    } // A date and a time: the day keeps the time shown (or takes the first
    // the day allows) and the panel stays open on the time, which the
    // focus moves to; Enter there closes it.


    if (this.mode === 'datetime') {
      const minutes = this.fitMinutes(this.currentMinutes ?? this.timeWindow(day.date).lo, day.date, 1);
      if (minutes === null) return this;
      this._draftMinutes = null;
      this._focusTimeAfterRender = 'hours';
      this.setState({
        year: day.date.getFullYear(),
        month: day.date.getMonth(),
        date: `${day.value}T${formatIsoTime(minutes)}`,
        context: ''
      });
      this.set({
        activeDate: day.value
      });
      this.emitChange();
      return this;
    }

    this.setState({
      year: day.date.getFullYear(),
      month: day.date.getMonth(),
      date: day.value,
      context: ''
    });
    this.set({
      activeDate: day.value
    });
    this.emitChange();
    if (this.closeOnSelect) this._closePanel({
      restoreFocus: true
    });
    return this;
  }

  selectRangeDate(day) {
    if (!this.startValue || this.startValue && this.endValue) {
      this.setState({
        year: day.date.getFullYear(),
        month: day.date.getMonth(),
        startValue: day.value,
        endValue: '',
        date: day.value,
        context: '',
        preset: ''
      });
      this.set({
        activeDate: day.value
      });
      this.emitChange();
      return this;
    }

    const startDate = this.startDate;
    const nextState = {
      year: day.date.getFullYear(),
      month: day.date.getMonth(),
      context: '',
      preset: ''
    };

    if (startDate && compareDates(day.date, startDate) < 0) {
      nextState.startValue = day.value;
      nextState.endValue = this.startValue;
      nextState.date = day.value;
    } else {
      nextState.endValue = day.value;
      nextState.date = this.startValue;
    }

    this.setState(nextState);
    this.set({
      activeDate: day.value
    });
    this.emitChange();
    if (this.closeOnSelect) this._closePanel({
      restoreFocus: true
    });
    return this;
  } // A quick range: its dates, the grid on the month it ends in, and the change
  // said once, by the person's choice -- never by a render.


  _choosePreset(item) {
    if (this.disabled || this.valueLocked || !item || item.disabled) return this;
    const from = formatIsoDate(item.from);
    const to = formatIsoDate(item.to);
    this.setState({
      preset: item.id,
      startValue: from,
      endValue: to,
      date: from,
      year: item.to.getFullYear(),
      month: item.to.getMonth(),
      context: ''
    });
    this.set({
      activeDate: to
    });
    this.emitChange();
    if (this.closeOnSelect) this._closePanel({
      restoreFocus: true
    });
    return this;
  } // «Свой период»: the quick range lets go and the person picks on the grid.


  _chooseCustomRange() {
    if (this.disabled || this.valueLocked) return this;
    if (this.preset) this.setState({
      preset: '',
      startValue: '',
      endValue: '',
      date: ''
    });
    this._focusDateAfterRender = true;
    this.requestComponentUpdate('custom-range');
    return this;
  } // The list is one tab stop: arrows move along it, Tab goes on to the grid.


  handlePresetKeydown(event) {
    const keys = {
      ArrowDown: 1,
      ArrowRight: 1,
      ArrowUp: -1,
      ArrowLeft: -1
    };
    if (!(event.key in keys) && event.key !== 'Home' && event.key !== 'End') return;
    const buttons = [...event.currentTarget.querySelectorAll('button:not(:disabled)')];
    if (!buttons.length) return;
    event.preventDefault();
    const index = buttons.indexOf(event.target);
    let next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : index + keys[event.key];
    if (this.isRtl && (event.key === 'ArrowRight' || event.key === 'ArrowLeft')) next = index - keys[event.key];
    next = (next + buttons.length) % buttons.length;
    buttons.forEach((button, at) => button.setAttribute('tabindex', at === next ? '0' : '-1'));
    buttons[next].focus();
  }

  selectMonth(month) {
    if (this.disabled || !month || month.disabled) {
      return this;
    }

    this._focusToggleAfterRender = 'month';
    this.setState({
      month: month.index,
      context: ''
    });
    this.set({
      activeDate: formatIsoDate(new Date(this.year, month.index, 1))
    });
    return this;
  }

  selectYear(year) {
    if (this.disabled || !year || year.disabled) {
      return this;
    }

    const nextState = {
      year: year.year,
      context: ''
    };
    const nextMonth = this.getClosestEnabledMonth(year.year, this.month);

    if (nextMonth !== this.month) {
      nextState.month = nextMonth;
    }

    this._focusToggleAfterRender = 'year';
    this.setState(nextState);
    this.set({
      activeDate: formatIsoDate(new Date(year.year, nextMonth, 1))
    });
    return this;
  }

  getClosestEnabledMonth(year, month) {
    const minDate = this.setMinDate();
    const maxDate = this.setMaxDate();

    if (minDate && year === minDate.getFullYear() && month < minDate.getMonth()) {
      return minDate.getMonth();
    }

    if (maxDate && year === maxDate.getFullYear() && month > maxDate.getMonth()) {
      return maxDate.getMonth();
    }

    return month;
  } // The time set on the panel: the value in time mode; in datetime mode the
  // value once a day is chosen, kept for the day until then.


  setTime(minutes) {
    if (this.disabled || this.valueLocked) return this;

    if (this.mode === 'time') {
      this.setState({
        date: formatIsoTime(minutes)
      });
      this.emitChange();
      return this;
    }

    const day = this.selectedDate;

    if (!day) {
      this._draftMinutes = minutes;
      this.requestComponentUpdate('time');
      return this;
    }

    this.setState({
      date: `${formatIsoDate(day)}T${formatIsoTime(minutes)}`
    });
    this.emitChange();
    return this;
  } // The hours or the minutes one step up or down: an hour, or the minute
  // step. Each wraps inside its own part (23 to 00, 55 to 00) as a native
  // time field does, then lands on the nearest time the day allows. Without
  // a time the first step takes the day's first allowed time (up) or its
  // last (down).


  stepTime(part, direction = 1) {
    if (this.disabled || this.valueLocked) return this;
    const day = this.mode === 'datetime' ? this.selectedDate : null;
    const current = this.currentMinutes;
    const {
      lo,
      hi
    } = this.timeWindow(day);
    let next;

    if (current === null) {
      next = direction > 0 ? lo : hi;
    } else if (part === 'hours') {
      next = (Math.floor(current / 60) + direction + 24) % 24 * 60 + current % 60;
    } else {
      const step = this.minuteStep;
      const minute = current % 60;
      let moved;

      if (direction > 0) {
        moved = (Math.floor(minute / step) + 1) * step;
        if (moved > 59) moved = 0;
      } else {
        moved = minute % step ? Math.floor(minute / step) * step : minute - step;
        if (moved < 0) moved = Math.floor(59 / step) * step;
      }

      next = Math.floor(current / 60) * 60 + moved;
    }

    const fitted = this.fitMinutes(next, day, direction);
    if (fitted === null || fitted === current) return this;
    return this.setTime(fitted);
  } // Keys on a time part (an APG spinbutton): ArrowUp and ArrowDown step it,
  // Home and End take its first and last allowed value, digits type it (two
  // for the hours move on to the minutes), ArrowLeft and ArrowRight move
  // between the parts (the row reads hh:mm left to right), Enter closes the panel.


  handleTimeKeydown(event, part) {
    if (this.disabled) return;
    const key = event.key;
    const day = this.mode === 'datetime' ? this.selectedDate : null;

    if (key === 'ArrowUp' || key === 'ArrowDown') {
      event.preventDefault();
      this._typedTime = null;
      const before = this.currentMinutes;
      this._focusTimeAfterRender = part;
      this.stepTime(part, key === 'ArrowUp' ? 1 : -1);
      if (this.currentMinutes === before) this._focusTimeAfterRender = null;
      return;
    }

    if (key === 'Home' || key === 'End') {
      event.preventDefault();
      this._typedTime = null;
      const {
        lo,
        hi
      } = this.timeWindow(day);
      const current = this.currentMinutes ?? lo;
      const hour = Math.floor(current / 60) * 60;
      const target = part === 'hours' ? (key === 'Home' ? Math.floor(lo / 60) * 60 : Math.floor(hi / 60) * 60) + current % 60 : key === 'Home' ? hour : hour + 59;
      const fitted = this.fitMinutes(target, day, key === 'Home' ? 1 : -1);

      if (fitted !== null && fitted !== this.currentMinutes) {
        this._focusTimeAfterRender = part;
        this.setTime(fitted);
      }

      return;
    }

    if (key === 'ArrowLeft' || key === 'ArrowRight') {
      event.preventDefault(); // The row is hh:mm left to right in every direction, as a clock reads.

      this.focusTimePart(key === 'ArrowRight' ? 'minutes' : 'hours');
      return;
    }

    if (key === 'Enter') {
      event.preventDefault();
      this._typedTime = null;
      if (this.input) this._closePanel({
        restoreFocus: true
      });
      return;
    }

    if (/^\d$/u.test(key)) {
      event.preventDefault();
      const now = Date.now();
      const before = this._typedTime;
      const text = `${before && before.part === part && now - before.at < 1000 ? before.text : ''}${key}`.slice(-2);
      const limit = part === 'hours' ? 23 : 59;
      const typed = Number(text) <= limit ? Number(text) : Number(key);
      const complete = text.length === 2 || Number(text) * 10 > limit;
      this._typedTime = complete ? null : {
        part,
        text,
        at: now
      };
      const current = this.currentMinutes ?? this.timeWindow(day).lo;
      const target = part === 'hours' ? typed * 60 + current % 60 : Math.floor(current / 60) * 60 + typed;
      const fitted = this.fitMinutes(target, day, 1);
      const focus = complete && part === 'hours' ? 'minutes' : part;

      if (fitted !== null && fitted !== this.currentMinutes) {
        this._focusTimeAfterRender = focus;
        this.setTime(fitted);
      } else if (focus !== part) {
        this.focusTimePart(focus);
      }
    }
  }

  focusTimePart(part) {
    this._focusTimeAfterRender = null;
    this.querySelector(`.sf-datepicker-time-value[data-time-part="${part}"]`)?.focus?.();
  } // What the time row shows: each part's number (null for none), the bounds
  // a spinbutton says, and whether a step is possible.


  get timeParts() {
    if (!this.hasTime) return null;
    const minutes = this.currentMinutes;
    const day = this.mode === 'datetime' ? this.selectedDate : null;
    const {
      lo,
      hi
    } = this.timeWindow(day);
    return {
      set: minutes !== null,
      hours: minutes === null ? null : Math.floor(minutes / 60),
      minutes: minutes === null ? null : minutes % 60,
      hoursMin: Math.floor(lo / 60),
      hoursMax: Math.floor(hi / 60),
      minutesMax: Math.floor(59 / this.minuteStep) * this.minuteStep,
      empty: lo > hi
    };
  }

  emitChange() {
    // date and isoValue mean one thing in both modes: the ISO value. For a
    // range that is the ISO 8601 interval start/end (the start alone while
    // the end is not chosen); they were the formatted range and the start
    // (docs trial 4).
    const interval = this.startValue && this.endValue ? `${this.startValue}/${this.endValue}` : this.startValue || '';
    const detail = this.range ? {
      value: [this.startValue, this.endValue],
      date: interval,
      startValue: this.startValue,
      endValue: this.endValue,
      formattedValue: this.displayValue,
      formattedStartValue: this.formattedStartValue,
      formattedEndValue: this.formattedEndValue,
      isoValue: interval,
      startIsoValue: this.startValue,
      endIsoValue: this.endValue,
      range: true,
      format: this.format,
      // The quick range chosen, so a host can store «last 7 days»
      // rather than the dates it meant today.
      preset: this.activePreset ? this.activePreset.relative ? {
        id: this.activePreset.id,
        relative: this.activePreset.relative
      } : {
        id: this.activePreset.id
      } : null
    } : {
      value: this.date,
      date: this.date,
      formattedValue: this.formattedValue,
      isoValue: this.date,
      range: false,
      format: this.format,
      mode: this.mode,
      // datetime and time: the time of day alone, hh:mm ('' for none).
      ...(this.hasTime ? {
        time: this.selectedMinutes === null ? '' : formatIsoTime(this.selectedMinutes)
      } : {})
    }; // Once, under its native name, without the element in its detail (§8);
    // the shim sends sf-datepicker-change and sf-change after it with the
    // same detail (aliases.json).

    this.sfSyncFormState();
    this.sfEmit('change', detail);
  }

  templateContext() {
    const props = this.getPropsContext();
    return this.createTemplateContext({ ...props,
      component: this,
      date: this.date,
      formattedValue: this.formattedValue,
      displayValue: this.displayValue,
      startValue: this.startValue,
      formattedStartValue: this.formattedStartValue,
      endValue: this.endValue,
      formattedEndValue: this.formattedEndValue,
      range: this.range,
      format: this.format,
      selectedDate: this.selectedDate,
      startDate: this.startDate,
      endDate: this.endDate,
      year: this.year,
      month: this.month,
      monthLabel: getMonthLabel(this.month, this.locale),
      calendarLabel: this.calendarLabel,
      labels: this.labels,
      weekdays: this.weekdays,
      weekdaysOff: this.weekdaysOff,
      // The column headers a screen reader reads: the full names.
      weekdayNames: getWeekdays(this.locale, this.weekStart, 'long'),
      panelId: this._panelId,
      previousIcon: this.isRtl ? 'chevron_right' : 'chevron_left',
      nextIcon: this.isRtl ? 'chevron_left' : 'chevron_right',
      context: this.contextMode,
      locale: this.locale,
      // time mode draws no grid: the time row is the panel.
      days: this.mode === 'time' ? [] : this.days,
      mode: this.mode,
      timeParts: this.timeParts,
      presetItems: this.presetItems,
      months: this.months,
      years: this.years,
      yearPageStart: this.yearPageStart,
      yearPageEnd: this.yearPageEnd,
      rootClass: this.getRootClass(),
      rootStyle: this.getRootStyle(),
      openAbove: Boolean(this.state.openAbove),
      input: this.input,
      open: this.open,
      portal: this.portal,
      inputType: this.inputType,
      inputSize: this.inputSize,
      // The host is the form control where the browser has
      // ElementInternals, so the inner text box carries no name (§17.1
      // item 6); without them it is named, as before.
      inputName: this.inputName,
      boxName: this.sfInternals ? '' : this.inputName,
      placeholder: this.placeholder,
      label: this.label,
      ariaLabel: this.ariaLabel,
      readonly: this.readonly,
      valueLocked: this.valueLocked,
      disabled: this.disabled,
      required: this.required,
      invalid: this.invalid,
      errorMessage: this.errorMessage,
      // The field's own words and marker, as on sf-input: the helper text
      // under the control (which the field reads to it as its
      // description) and the marker at the field's end. The settings
      // themselves come from component.json, so `hint` and `hintIcon`
      // are the manifest's own accessors.
      hint: this.hint,
      leftIcon: this.leftIcon,
      iconStart: this.leftIcon,
      hintIcon: this.hintIcon,
      inputRootClass: this.inputRootClass,
      mask: this.mask,
      maskPattern: this.maskPattern,
      maskLazy: this.maskLazy,
      maskPlaceholderChar: this.maskPlaceholderChar,
      maskOptions: this.maskOptions
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_6__.renderDatepickerTemplate)(this.templateContext());
  }

  afterRender() {
    this._input = this.refs.input?.value?.querySelector('input') || null; // A read-only field opens nothing, so it names no popup either.

    if (this._input && this.valueLocked) {
      for (const name of ['aria-haspopup', 'aria-expanded', 'aria-controls']) this._input.removeAttribute(name);
    } else if (this._input) {
      this._input.setAttribute('aria-haspopup', 'dialog');

      this._input.setAttribute('aria-expanded', this.open || this._sheetOpen ? 'true' : 'false');

      this._input.setAttribute('aria-controls', this._sheetOpen && this._sheet ? this._sheet.id : this._panelId);
    }

    const monthToggle = this.querySelector('.sf-datepicker-month-toggle button');
    const yearToggle = this.querySelector('.sf-datepicker-year-toggle button');
    monthToggle?.setAttribute('aria-expanded', this.contextMode === 'month' ? 'true' : 'false');
    yearToggle?.setAttribute('aria-expanded', this.contextMode === 'year' ? 'true' : 'false');
    this.syncOverlayListeners();
    this.sfSyncFormState(); // The panel is placed when it opens, not after every render: SF.Position
    // follows scroll, resize and the panel's own size from then on (Floating
    // UI autoUpdate, its element resize included). A full update after each
    // arrow key, month or render cost 50-180 ms (datepicker audit
    // 2026-11-11, P1).

    const placed = this._panelAnchor && this._panelAnchorPanel === this.refs.datePickerPanel.value;
    requestAnimationFrame(() => {
      if (!placed || !this.open) this.positionPanel();

      if (this._focusContextAfterRender) {
        this.focusContextItem();
      } else if (this._focusToggleAfterRender) {
        this.querySelector(`.sf-datepicker-${this._focusToggleAfterRender}-toggle button`)?.focus?.();
        this._focusToggleAfterRender = '';
      }

      if (this._focusTimeAfterRender || this._focusCalendarOnOpen && this.mode === 'time') {
        this.focusTimePart(this._focusTimeAfterRender || 'hours');
        this._focusCalendarOnOpen = false;
        this._focusDateAfterRender = false;
      } else if (this._focusCalendarOnOpen || this._focusDateAfterRender) {
        const active = this.querySelector(`.sf-datepicker-day[data-date="${formatIsoDate(this.activeDate)}"]`);
        active?.focus?.();
        this._focusCalendarOnOpen = false;
        this._focusDateAfterRender = false;
      }
    });
  }

  onDisconnected() {
    this.removeOverlayListeners();
    this.stopRibbonSizeWatch();
    this.stopRibbonPanelFocus();
    super.onDisconnected();
  }

  get data() {
    return {
      value: this.value,
      date: this.date,
      formattedValue: this.formattedValue,
      displayValue: this.displayValue,
      startValue: this.startValue,
      formattedStartValue: this.formattedStartValue,
      endValue: this.endValue,
      formattedEndValue: this.formattedEndValue,
      range: this.range,
      format: this.format,
      year: this.year,
      month: this.month,
      context: this.contextMode,
      maxDate: this.maxDate,
      minDate: this.minDate,
      mode: this.mode,
      minTime: this.minTime,
      maxTime: this.maxTime,
      minuteStep: this.minuteStep,
      locale: this.locale,
      weekend: this.weekend,
      input: this.input,
      open: this.open,
      portal: this.portal,
      mask: this.mask,
      maskPattern: this.maskPattern,
      maskOptions: this.maskOptions,
      presets: this.presetItems.map(({
        id,
        label,
        relative,
        disabled
      }) => ({
        id,
        label,
        relative,
        disabled
      })),
      preset: this.preset
    };
  }

}

SfDatepicker.define('sf-input-date');
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "c4779e51fee1"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   formatPlaceholder: () => (/* binding */ formatPlaceholder),
/* harmony export */   localeDateFormat: () => (/* binding */ localeDateFormat),
/* harmony export */   localeWeekStart: () => (/* binding */ localeWeekStart),
/* harmony export */   localeWeekend: () => (/* binding */ localeWeekend),
/* harmony export */   weekendDays: () => (/* binding */ weekendDays)
/* harmony export */ });
// What a locale says about its calendar, read from Intl once per locale: the
// first day of the week and the days off (Intl.Locale#getWeekInfo, the older
// weekInfo getter where a browser still has that). No DOM, so the rules are
// unit-tested as they are (tests/datepicker-c62.contract.test.mjs).
//
// Days are numbered as Date#getDay numbers them, 0 Sunday to 6 Saturday; Intl
// numbers them 1 Monday to 7 Sunday, so 7 is read as Sunday too.
const weekInfos = new Map();

function weekInfo(code) {
  if (weekInfos.has(code)) return weekInfos.get(code);
  let info = null;

  try {
    const locale = new Intl.Locale(code);
    info = (typeof locale.getWeekInfo === 'function' ? locale.getWeekInfo() : locale.weekInfo) || null;
  } catch {// An unknown locale keeps the defaults below.
  }

  weekInfos.set(code, info);
  return info;
} // The first day of the locale's week, read once per locale: the grid asks it
// several times a render. Monday where the locale does not say.


function localeWeekStart(code) {
  const first = weekInfo(code)?.firstDay;
  return Number.isInteger(first) ? first % 7 : 1;
}
const SATURDAY_SUNDAY = Object.freeze([6, 0]); // The locale's days off: Saturday and Sunday in ru, de and en-US, Friday and
// Saturday in ar-EG and he-IL. Saturday and Sunday where the locale does not say.

function localeWeekend(code) {
  const days = weekInfo(code)?.weekend;
  if (!Array.isArray(days) || !days.length) return SATURDAY_SUNDAY;
  return Object.freeze(days.map(day => day % 7));
} // The `weekend` setting (owner decision C62: days off are red, and a product
// whose weekends are working days says so). Empty: the locale's days off.
// "none": no day is a day off. Otherwise the days, comma or space separated,
// 0 or 7 Sunday, 1 Monday to 6 Saturday ("6,7" as Intl writes Saturday and
// Sunday, "5,6" for Friday and Saturday). Anything else in the list is left
// out; a list with nothing left falls back to the locale.

function weekendDays(setting, code) {
  const text = String(setting ?? '').trim().toLowerCase();
  if (!text) return new Set(localeWeekend(code));
  if (text === 'none') return new Set();
  const days = text.split(/[\s,]+/u).filter(part => /^[0-7]$/u.test(part)).map(part => Number(part) % 7);
  return new Set(days.length ? days : localeWeekend(code));
} // The date format of a locale, in the component's tokens (owner decision C62:
// typing follows the language and the country, not a fixed «ДД.ММ.ГГГГ»). The
// parts' order and the signs between them come from Intl alone:
// formatToParts of a two-digit day and month and a numeric year gives
// DD.MM.YYYY for ru and de, MM/DD/YYYY for en-US, DD/MM/YYYY for en-GB and fr,
// YYYY-MM-DD for sv-SE and en-CA. A sign before the first part or after the
// last («12.11.2026 г.» in bg, the closing dot of hu and ko) is left out: it is
// not between two numbers, and a person does not type it. Right-to-left marks
// are left out of the signs too. A locale Intl refuses, or a sign that is not
// one a date is typed with (. / - , or a space), keeps DD.MM.YYYY.

const DEFAULT_DATE_FORMAT = 'DD.MM.YYYY';
const PART_TOKENS = {
  day: 'DD',
  month: 'MM',
  year: 'YYYY'
};
const dateFormats = new Map();
function localeDateFormat(code) {
  if (dateFormats.has(code)) return dateFormats.get(code);
  let format = DEFAULT_DATE_FORMAT;

  try {
    const parts = new Intl.DateTimeFormat(code, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).formatToParts(new Date(2026, 10, 12));
    const tokens = [];
    const signs = [];
    let sign = '';

    for (const part of parts) {
      if (part.type === 'literal') {
        sign += part.value.replace(/[\u200e\u200f\u061c]/gu, '');
      } else if (PART_TOKENS[part.type]) {
        if (tokens.length) signs.push(sign);
        tokens.push(PART_TOKENS[part.type]);
        sign = '';
      }
    }

    const whole = tokens.length === 3 && new Set(tokens).size === 3 && signs.every(one => /^[\s./,-]+$/u.test(one));
    if (whole) format = tokens.reduce((text, token, index) => text + (index ? signs[index - 1] : '') + token, '');
  } catch {// An unknown locale keeps the default.
  }

  dateFormats.set(code, format);
  return format;
} // The hint in an empty field: the format written with the letters of the
// locale's own names for the parts (Intl.DisplayNames, type dateTimeField):
// ДД.ММ.ГГГГ in ru, MM/DD/YYYY in en-US, TT.MM.JJJJ in de, JJ/MM/AAAA in fr.
// A name in a script without letter case or initials (日, 年) gives the Latin
// D, M, Y, H instead.

const LATIN_LETTERS = {
  DD: 'D',
  MM: 'M',
  YYYY: 'Y',
  YY: 'Y',
  HH: 'H',
  mm: 'M'
};
const FIELD_NAMES = {
  DD: 'day',
  MM: 'month',
  YYYY: 'year',
  YY: 'year',
  HH: 'hour',
  mm: 'minute'
};
const INITIAL_RE = /^[\p{Script=Latin}\p{Script=Cyrillic}\p{Script=Greek}]/u;
const placeholders = new Map();

function letterOf(token, code) {
  try {
    const name = new Intl.DisplayNames(code, {
      type: 'dateTimeField'
    }).of(FIELD_NAMES[token]) || '';
    const first = name.trim().charAt(0);
    if (INITIAL_RE.test(first)) return first.toLocaleUpperCase(code);
  } catch {// No names for this locale: the Latin letter below.
  }

  return LATIN_LETTERS[token];
}

function formatPlaceholder(format, code) {
  const key = `${code}|${format}`;
  if (placeholders.has(key)) return placeholders.get(key);
  const text = String(format || '').replace(/YYYY|YY|MM|DD|HH|mm/gu, token => letterOf(token, code).repeat(token.length));
  placeholders.set(key, text);
  return text;
}

/***/ },

/***/ "292f5fe79a22"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderDatepickerTemplate: () => (/* binding */ renderDatepickerTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var lit_directives_ref_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("8137feb490e0");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, lit_directives_ref_js__WEBPACK_IMPORTED_MODULE_1__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, lit_directives_ref_js__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lit_directives_ref_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lit_directives_ref_js__WEBPACK_IMPORTED_MODULE_1__);



function joinClasses(...tokens) {
  return tokens.flat().filter(Boolean).join(' ');
}

function renderYearTop(context) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-datepicker-top flex content-main-between items-cross-center">
            <sf-button-icon appearance="ghost" scheme="on-surface" size="1/2" ?disabled=${context.disabled}
                icon=${context.previousIcon} aria-label=${context.labels.previousYears}
                @click=${() => context.component.shiftYearPage(-1)}></sf-button-icon>
            <div class="sf-datepicker-range-title" aria-live="polite">
                ${context.yearPageStart}–${context.yearPageEnd}
            </div>
            <sf-button-icon appearance="ghost" scheme="on-surface" size="1/2" ?disabled=${context.disabled}
                icon=${context.nextIcon} aria-label=${context.labels.nextYears}
                @click=${() => context.component.shiftYearPage(1)}></sf-button-icon>
        </div>`;
}

function renderTop(context) {
  if (context.context === 'year') return renderYearTop(context);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-datepicker-top grid items-cross-center">
            <sf-button-icon appearance="ghost" scheme="on-surface" size="1/2" ?disabled=${context.disabled}
                icon=${context.previousIcon} aria-label=${context.labels.previousMonth}
                @click=${() => context.component.shiftMonth(-1)}></sf-button-icon>
            <div class="sf-datepicker-period flex content-main-center items-cross-center gap-1/4">
                <!-- The toggles are size 1/2, as tall as the compact size 1 they were:
                     density no longer changes a button's height (C01). The arrows
                     beside them are the same size: one band of buttons, one height
                     (audit G4: 40 and 32 in one row). -->
                <sf-button class="sf-datepicker-month-toggle" size="1/2" appearance="ghost" scheme="on-surface"
                    ?disabled=${context.disabled}
                    text=${context.monthLabel}
                    aria-expanded=${context.context === 'month' ? 'true' : 'false'}
                    @click=${() => context.component.toggleContext('month')}></sf-button>
                <sf-button class="sf-datepicker-year-toggle" size="1/2" appearance="ghost" scheme="on-surface"
                    ?disabled=${context.disabled}
                    text=${String(context.year)}
                    aria-expanded="false"
                    @click=${() => context.component.toggleContext('year')}></sf-button>
            </div>
            <sf-button-icon appearance="ghost" scheme="on-surface" size="1/2" ?disabled=${context.disabled}
                icon=${context.nextIcon} aria-label=${context.labels.nextMonth}
                @click=${() => context.component.shiftMonth(1)}></sf-button-icon>
        </div>`;
} // The month or year list is one tab stop: the chosen item, or the first one
// that can be chosen; the arrows move in it (handleContextKeydown).


function focusItem(items) {
  return items.find(item => item.selected && !item.disabled) ?? items.find(item => !item.disabled);
}

function renderMonthContext(context) {
  const focusable = focusItem(context.months);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-datepicker-context absolute top-0 bottom-0 inline-start-0 inline-end-0 grid grid-col-3 overflow-auto gap-1/4"
             role="group" aria-label=${context.labels.chooseMonth}
             @keydown=${event => context.component.handleContextKeydown(event)}>
            ${context.months.map(month => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                <button class=${joinClasses('sf-datepicker-text flex content-main-center items-cross-center', month.selected ? 'active' : '', month.disabled ? 'disabled' : '')}
                    ?disabled=${month.disabled} aria-pressed=${month.selected ? 'true' : 'false'}
                    tabindex=${month === focusable ? '0' : '-1'}
                    type="button" @click=${() => context.component.selectMonth(month)}>
                    <span class="sf-datepicker-text-date">${month.label}</span>
                </button>`)}
        </div>`;
}

function renderYearContext(context) {
  const focusable = focusItem(context.years);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-datepicker-context absolute top-0 bottom-0 inline-start-0 inline-end-0 grid grid-col-3 overflow-auto gap-1/4"
             role="group" aria-label=${context.labels.chooseYear}
             @keydown=${event => context.component.handleContextKeydown(event)}>
            ${context.years.map(year => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                <button class=${joinClasses('sf-datepicker-text flex content-main-center items-cross-center', year.selected ? 'active' : '', year.disabled ? 'disabled' : '')}
                    type="button" ?disabled=${year.disabled} aria-pressed=${year.selected ? 'true' : 'false'}
                    tabindex=${year === focusable ? '0' : '-1'}
                    @click=${() => context.component.selectYear(year)}>
                    <span class="sf-datepicker-text-date">${year.year}</span>
                </button>`)}
        </div>`;
}

function renderContext(context) {
  if (context.context === 'month') return renderMonthContext(context);
  if (context.context === 'year') return renderYearContext(context);
  return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
}

function renderDatepickerInput(context) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-input class="sf-datepicker-input" ${(0,lit_directives_ref_js__WEBPACK_IMPORTED_MODULE_1__.ref)(context.component.refs.input)}
            appearance=${context.inputType} size=${context.inputSize}
            label=${context.label || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} name=${context.boxName || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            aria-label=${context.label ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : context.ariaLabel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            placeholder=${context.placeholder || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} icon-start=${context.iconStart || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            root-class=${context.inputRootClass || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} value=${context.displayValue || ''}
            ?disabled=${context.disabled} ?required=${context.required} ?invalid=${context.invalid}
            error-message=${context.errorMessage || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            hint=${context.hint || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} hint-icon=${context.hintIcon || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ?mask=${context.mask}
            mask-pattern=${context.maskPattern || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} mask-lazy=${String(context.maskLazy)}
            mask-placeholder-char=${context.maskPlaceholderChar || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            mask-options=${context.maskOptions || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} ?readonly=${context.readonly}
            @click=${event => context.component.handleInputClick(event)}
            @change=${event => context.component.handleInputChange(event)}
            @input=${event => context.component.handleInputInput(event)}
            @keydown=${event => context.component.handleInputKeydown(event)}></sf-input>`;
}

function renderDay(day, context) {
  const classes = joinClasses('sf-datepicker-day', day.weekend ? 'sf-datepicker-day-off' : '', day.selected ? 'active' : '', day.rangeStart ? 'sf-datepicker-day-start' : '', day.rangeSelected ? 'sf-datepicker-day-selected' : '', day.rangeEnd ? 'sf-datepicker-day-end' : '', day.currentMonth ? '' : 'sf-datepicker-another-month', day.disabled ? 'disabled' : '');
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <button class=${classes} type="button" role="gridcell" ?disabled=${day.disabled}
            data-date=${day.value} aria-label=${day.label}
            aria-current=${day.today ? 'date' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            aria-selected=${day.selected || day.rangeSelected ? 'true' : 'false'} tabindex=${day.tabIndex}
            @click=${() => context.component.selectDate(day)}
            @focus=${() => context.component.setActiveDate(day.value)}
            @keydown=${event => context.component.handleDayKeydown(event, day)}>
            <span class="sf-datepicker-day-date">${day.day}</span>
        </button>`;
} // The days are an ARIA grid (APG date picker dialog; audit S18a): a row of
// column headers with the weekdays' full names for a screen reader (the
// drawn short names above stay out of the accessibility tree), then a row per
// week. The rows are display: contents, so the days stay the CSS grid's own
// cells; the headers are visually hidden, out of the flow.


function renderGrid(context) {
  const weeks = [];

  for (let at = 0; at < context.days.length; at += 7) weeks.push(context.days.slice(at, at + 7));

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-datepicker-grid grid grid-col-7" role="grid" aria-label=${context.calendarLabel}
            aria-readonly=${context.valueLocked ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
            <div class="sf-datepicker-week" role="row">
                ${context.weekdayNames.map(name => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sr-only" role="columnheader">${name}</span>`)}
            </div>
            ${weeks.map(week => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-datepicker-week" role="row">${week.map(day => renderDay(day, context))}</div>`)}
        </div>`;
}

function renderPresets(context) {
  const items = context.presetItems;
  if (!items.length) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing; // One tab stop: the pressed range, or the first one that can be chosen.
  // A disabled field disables every quick range and «Свой период» with them.

  const focusable = context.disabled ? null : items.find(item => item.pressed && !item.disabled) ?? items.find(item => !item.disabled); // «Свой период» is pressed for a range picked on the grid, not for no range.

  const custom = !items.some(item => item.pressed) && Boolean(context.startValue);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-datepicker-presets flex flex-col gap-1/4" role="group" aria-label=${context.labels.presets}
            @keydown=${event => context.component.handlePresetKeydown(event)}>
            ${items.map(item => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                <button class=${joinClasses('sf-datepicker-text sf-datepicker-preset flex items-cross-center', item.pressed ? 'active' : '')}
                    type="button" ?disabled=${item.disabled || context.disabled} aria-pressed=${item.pressed ? 'true' : 'false'}
                    tabindex=${item === focusable ? '0' : '-1'} data-preset=${item.id}
                    @click=${() => context.component.choosePreset(item)}>${item.label}</button>`)}
            <button class=${joinClasses('sf-datepicker-text sf-datepicker-preset flex items-cross-center', custom ? 'active' : '')}
                type="button" ?disabled=${context.disabled} aria-pressed=${custom ? 'true' : 'false'} tabindex=${focusable || context.disabled ? '-1' : '0'} data-preset=""
                @click=${() => context.component.chooseCustomRange()}>${context.labels.customRange}</button>
        </div>`;
} // A stepper beside a time part: the class markup of an icon button at the
// field's size 1, out of the tab order as the APG spinbutton has its buttons --
// the arrow keys already do what it does. Still a real, named button.


const TIME_STEPPER = 'sf-datepicker-time-step sf-icon-button sf-icon-button--size-1 sf-icon-button--icon sf-icon-button--link sf-icon-button--on-surface flex items-cross-center content-main-center';

function renderTimeStepper(context, part, direction) {
  const labels = context.labels;
  const label = part === 'hours' ? direction < 0 ? labels.earlierHour : labels.laterHour : direction < 0 ? labels.earlierMinute : labels.laterMinute;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <button type="button" class=${TIME_STEPPER} tabindex="-1" aria-label=${label}
            ?disabled=${context.disabled || context.timeParts.empty}
            @click=${() => context.component.stepTime(part, direction)}
        ><i class="sf-icon" aria-hidden="true">${direction < 0 ? 'remove' : 'add'}</i></button>`;
}

function renderTimePart(context, part) {
  const parts = context.timeParts;
  const value = parts[part];
  const shown = value === null ? '--' : String(value).padStart(2, '0');
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-datepicker-time-part flex items-cross-center">
            ${renderTimeStepper(context, part, -1)}
            <span class="sf-datepicker-text sf-datepicker-time-value flex content-main-center items-cross-center"
                role="spinbutton" data-time-part=${part}
                tabindex=${context.disabled ? '-1' : '0'}
                aria-label=${part === 'hours' ? context.labels.hours : context.labels.minutes}
                aria-valuemin=${part === 'hours' ? parts.hoursMin : 0}
                aria-valuemax=${part === 'hours' ? parts.hoursMax : parts.minutesMax}
                aria-valuenow=${value === null ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : value}
                aria-valuetext=${value === null ? context.labels.timeNotSet : shown}
                aria-disabled=${context.disabled ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                @keydown=${event => context.component.handleTimeKeydown(event, part)}>${shown}</span>
            ${renderTimeStepper(context, part, 1)}
        </div>`;
} // The time of day: hours and minutes, each a spinbutton between its two
// steppers, on one row at the control height of size 1 -- under the grid in
// datetime mode, the whole panel in time mode.


function renderTime(context) {
  if (!context.timeParts) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-datepicker-time flex content-main-center items-cross-center gap-1/4" role="group"
            aria-label=${context.labels.time} dir="ltr">
            ${renderTimePart(context, 'hours')}
            <span class="sf-datepicker-time-separator" aria-hidden="true">:</span>
            ${renderTimePart(context, 'minutes')}
        </div>`;
} // The weekday row lies in the main box with the days, so a month or year
// choice covers both: above the box it labelled columns that were not there,
// and the choice had a row less of height than the panel gives it.


function renderDatepickerPanel(context) {
  const rootClasses = joinClasses('sf-datepicker inline-flex', context.input ? '' : 'sf-datepicker--inline', context.presetItems.length ? 'sf-datepicker--presets' : '', context.mode !== 'date' ? `sf-datepicker--${context.mode}` : '', context.rootClass);

  if (context.mode === 'time') {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
            <div ${(0,lit_directives_ref_js__WEBPACK_IMPORTED_MODULE_1__.ref)(context.component.refs.datePickerPanel)} id=${context.panelId}
                class=${rootClasses} style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                role=${context.input ? 'dialog' : 'group'} aria-label=${context.labels.time}
                aria-disabled=${context.disabled ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                @click=${event => context.component.handlePanelClick(event)}>
                ${renderTime(context)}
            </div>`;
  }

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div ${(0,lit_directives_ref_js__WEBPACK_IMPORTED_MODULE_1__.ref)(context.component.refs.datePickerPanel)} id=${context.panelId}
            class=${rootClasses} style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            role=${context.input ? 'dialog' : 'group'} aria-label=${context.calendarLabel}
            aria-disabled=${context.disabled ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            @click=${event => context.component.handlePanelClick(event)}>
            ${renderPresets(context)}
            <div class="sf-datepicker-container flex flex-col">
                <!-- The shown month, said when it changes (audit S18c); the year
                     page says its own range in its title. -->
                <div class="sr-only" aria-live="polite" aria-atomic="true">${context.context === 'year' ? '' : context.calendarLabel}</div>
                ${renderTop(context)}
                <div class="sf-datepicker-main relative">
                    ${renderContext(context)}
                    <div class="sf-datepicker-weekdays grid grid-col-7" aria-hidden="true">
                        ${context.weekdays.map((weekday, at) => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class=${context.weekdaysOff?.[at] ? 'sf-datepicker-weekday sf-datepicker-weekday-off' : 'sf-datepicker-weekday'}>${weekday}</span>`)}
                    </div>
                    ${renderGrid(context)}
                </div>
                ${renderTime(context)}
            </div>
        </div>`;
}

function renderDatepickerTemplate(context) {
  if (!context.input) return renderDatepickerPanel(context);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class=${joinClasses('sf-datepicker-wrap inline-flex flex-col relative', context.open ? 'is-open' : '', context.openAbove ? 'sf-datepicker-wrap--drop-up' : 'sf-datepicker-wrap--drop-down')}
            ${(0,lit_directives_ref_js__WEBPACK_IMPORTED_MODULE_1__.ref)(context.component.refs.datePickerRoot)} data-portal=${context.portal ? 'true' : 'false'}>
            ${renderDatepickerInput(context)}
            ${context.open ? renderDatepickerPanel(context) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        </div>`;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "d8c852b40b52"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderDatepickerRibbon: () => (/* binding */ renderDatepickerRibbon)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("efa66f8927d1");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__);



function joinClasses(...tokens) {
  return tokens.flat().filter(Boolean).join(' ');
} // One day of the ribbon: the same cell, classes and names as the popup grid's
// (templates/default.js renderDay), so a day looks and reads the same in both.


function renderRibbonDay(day, context) {
  const classes = joinClasses('sf-datepicker-day', day.weekend ? 'sf-datepicker-day-off' : '', day.selected ? 'active' : '', day.rangeStart ? 'sf-datepicker-day-start' : '', day.rangeSelected ? 'sf-datepicker-day-selected' : '', day.rangeEnd ? 'sf-datepicker-day-end' : '', day.disabled ? 'disabled' : '');
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <button class=${classes} type="button" role="gridcell" ?disabled=${day.disabled}
            data-date=${day.value} aria-label=${day.label}
            aria-current=${day.today ? 'date' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            aria-selected=${day.selected || day.rangeSelected ? 'true' : 'false'} tabindex=${day.tabIndex}
            @click=${() => context.component.pickRibbonDay(day.value)}
            @keydown=${event => context.component.handleRibbonKeydown(event, day.value)}>
            <span class="sf-datepicker-day-date">${day.day}</span>
        </button>`;
} // A month of the ribbon: its title, held over it while it is in view, then its
// weeks. The days before the first and after the last are empty cells, so the
// columns stay the weekdays'.


function renderRibbonMonth(month, context) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <section class="sf-datepicker-ribbon-month" data-month=${month.key}>
            <div class="sf-datepicker-ribbon-title" aria-hidden="true">${month.label}</div>
            <div class="sf-datepicker-grid grid grid-col-7" role="grid" aria-label=${month.label}>
                <div class="sf-datepicker-week" role="row">
                    ${context.weekdayNames.map(name => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sr-only" role="columnheader">${name}</span>`)}
                </div>
                ${month.weeks.map(week => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-datepicker-week" role="row">${week.map(day => day ? renderRibbonDay(day, context) : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-datepicker-day-empty" role="gridcell"></span>`)}</div>`)}
            </div>
        </section>`;
} // The period on a phone (owner decision C62, ui-control prototypes/
// datepicker.html#lenta): a ribbon of months in a bottom sheet. The weekday
// row is pinned above the ribbon, the months stand one under another and
// scroll with a finger, and the period chosen and «Готово» are pinned under
// it. The sheet is the Framework's (sf-drawer placement="bottom"); this is
// its content. Its head is the ribbon's own, as in #lenta: the title,
// «К сегодня» (today's month to the top) and the close button, which keeps
// the value the field had, as any close but «Готово» does.


function renderDatepickerRibbon(context) {
  // The period line under the ribbon (index.js ribbonSummary).
  const summary = context.periodSummary;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-datepicker-sheet-head">
            <span class="sf-datepicker-sheet-title">${context.title}</span>
            <sf-button class="sf-datepicker-sheet-today" size="1/2" appearance="ghost" scheme="primary"
                text=${context.labels.goToToday}
                @click=${() => context.component.ribbonToToday()}></sf-button>
            <sf-button-icon class="sf-datepicker-sheet-close" size="1" appearance="ghost" scheme="on-surface"
                icon="close" aria-label=${context.labels.close}
                @click=${() => context.component.closeRibbon()}></sf-button-icon>
        </div>
        <div class="sf-datepicker-sheet-weekdays" aria-hidden="true">
            ${context.weekdays.map((weekday, at) => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class=${joinClasses('sf-datepicker-weekday', context.weekdaysOff[at] && 'sf-datepicker-weekday-off')}>${weekday}</span>`)}
        </div>
        <div class="sf-datepicker-ribbon" @scroll=${() => context.component.handleRibbonScroll()}>
            ${(0,lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__.repeat)(context.months, month => month.key, month => renderRibbonMonth(month, context))}
        </div>
        <div class="sf-datepicker-sheet-foot">
            <div class="sf-datepicker-sheet-summary" aria-live="polite">
                ${summary.strong ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<b>${summary.strong}</b>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ${summary.note ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span>${summary.note}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            </div>
            <sf-button class="sf-datepicker-sheet-done" size="1" appearance="default" scheme="primary" full-width
                text=${context.labels.done} ?disabled=${!context.complete}
                @click=${() => context.component.commitRibbon()}></sf-button>
        </div>`;
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

/***/ "e92fd2d1a38c"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("instance-path", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("instance-path", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "8137feb490e0"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit/directives/ref.js", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("lit/directives/ref.js", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "efa66f8927d1"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit/directives/repeat.js", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("lit/directives/repeat.js", 1).then(resolve, reject), { once: true })));

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

/***/ "881c6d727a36"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases for the shim (core/js/aliases.js, standard simai.smart-component 1.3.8 §16.20). Event rows send the new name first, then the old one, with one detail; setting rows map the old attribute and property to the new; host-attribute rows (no \\"to\\") stay host attributes read by the browser or the base and are listed, refused by the shim on purpose; documentary rows (\\"shim\\": \\"none\\") record a rename the shim cannot serve.","component":"sf-input-date","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"aria-label","to":null,"kind":"attribute","component":"sf-input-date","since":"2026-10-27","remove_after":"2026-12-01","mode":"host-attribute","section":"§3.1","note":"stays a host attribute, read by the base (§3.1, §4.8); no shim"},{"from":"sf-datepicker-change","to":"change","kind":"event","component":"sf-input-date","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","cancelable":false,"note":"sent by the shim after change, with the same detail; the detail no longer carries the element (§8)"},{"from":"sf-change","to":"change","kind":"event","component":"sf-input-date","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","cancelable":false,"note":"sent by the shim after change, with the same detail; the detail no longer carries the element (§8)"},{"from":"sf-datepicker","to":"sf-input-date","kind":"tag","component":"sf-input-date","since":"2026-11-03","remove_after":"2027-01-01","section":"rename plan R0 (ui-control RENAME-PLAN-2026-11-03), naming decision 2026-11-02","note":"the element is sf-input-date; sf-datepicker is a subclass defined beside it until the date"}]}');

/***/ },

/***/ "d7180f8fbd98"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.input-date","tag":"sf-input-date","version":"1.8.2","kind":"leaf","settings":{"date":{"type":"string","default":""},"start-value":{"type":"string","default":""},"end-value":{"type":"string","default":""},"max-date":{"type":"string","default":""},"min-date":{"type":"string","default":""},"mode":{"type":"enum","values":["date","datetime","time"],"default":"date"},"min-time":{"type":"string","default":""},"max-time":{"type":"string","default":""},"minute-step":{"type":"number","default":1,"integer":true,"min":1,"max":60},"range":{"type":"boolean","default":false},"month":{"type":"number","optional":true,"integer":true,"min":0,"max":11},"year":{"type":"number","optional":true,"integer":true},"context":{"type":"enum","values":["","month","year"],"default":""},"week-start":{"type":"number","optional":true,"integer":true,"min":0,"max":6},"weekend":{"type":"string","default":""},"locale":{"type":"string","default":""},"format":{"type":"string","default":""},"close-on-select":{"type":"boolean","default":true},"input":{"type":"boolean","default":true},"portal":{"type":"boolean","default":true},"input-type":{"type":"string","default":"bordered"},"size":{"type":"enum","values":["1/3","1/2","1","2","3"],"default":"1"},"input-size":{"type":"enum","values":["1/3","1/2","1","2","3"],"default":"1"},"input-name":{"type":"string","default":""},"placeholder":{"type":"string","default":""},"label":{"type":"string","default":""},"disabled":{"type":"boolean","default":false},"required":{"type":"boolean","default":false},"invalid":{"type":"boolean","default":false},"error-message":{"type":"string","default":""},"hint":{"type":"string","default":""},"icon-start":{"type":"icon","default":"calendar_today"},"left-icon":{"type":"icon","default":"calendar_today"},"hint-icon":{"type":"icon","default":""},"input-root-class":{"type":"string","default":""},"mask":{"type":"boolean","default":false},"mask-pattern":{"type":"string","default":""},"mask-lazy":{"type":"boolean","default":false},"mask-placeholder-char":{"type":"string","default":"_"},"mask-options":{"type":"string","default":""},"name":{"type":"string","default":""},"preset":{"type":"string","default":""},"readonly":{"type":"boolean","default":false},"presets":{"type":"list","default":[],"of":{"id":"id","label":{"type":"string","optional":true},"relative":{"type":"enum","values":["today","yesterday","last-7-days","last-30-days","this-week","this-month","last-month"],"optional":true},"range":{"type":"list","optional":true}}}},"values":{"value":{"type":"string","default":""},"open":{"type":"boolean","default":false}},"events":{"change":{"carries":{"value":"object","date":"string","start-value":"string","end-value":"string","formatted-value":"string","iso-value":"string","range":"boolean","format":"string","preset":"object","mode":"string","time":"string"}}},"actions":{"open-panel":{"with":{"options":"object"}},"close-panel":{"with":{"options":"object"}},"toggle-panel":{},"choose-preset":{"with":{"item":"object"}},"choose-custom-range":{}},"form":{"value":"value","name":"name","default":"value","submits":"value","reset":"default","required":"required","disabled":"disabled","readonly":"readonly","validity":["value-missing","custom-error"]},"layer":{"kind":"surface","traps-focus":false},"css-variables":{"--sf-datepicker-background-color":{"type":"color","state":"open"},"--sf-datepicker-day-color":{"type":"color","state":"rest"},"--sf-datepicker-selected-background-color":{"type":"color","state":"selected"},"--sf-datepicker-selected-color":{"type":"color","state":"selected"},"--sf-datepicker-range-background-color":{"type":"color","state":"in-range"},"--sf-datepicker-weekday-color":{"type":"color","state":"rest"},"--sf-datepicker-day-off":{"type":"color","state":"rest"}}}');

/***/ },

/***/ "2fe06cbdeec6"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Datepicker","runtime":{"choose-end":"choose the end","choose-month":"Choose a month","choose-start":"Choose the start of the period","choose-year":"Choose a year","close":"Close","custom-range":"Custom range","day-off":"day off","done":"Done","earlier-hour":"Previous hour","earlier-minute":"Previous minutes","go-to-today":"Today","hours":"Hours","later-hour":"Next hour","later-minute":"Next minutes","minutes":"Minutes","next-month":"Next month","next-years":"Next years","period":"Period","preset-last-month":"Last month","preset-last30-days":"Last 30 days","preset-last7-days":"Last 7 days","preset-this-month":"This month","preset-this-week":"This week","preset-today":"Today","preset-yesterday":"Yesterday","presets":"Quick ranges","previous-month":"Previous month","previous-years":"Previous years","time":"Time","time-not-set":"Not set","value-missing":"Choose a date.","value-missing-datetime":"Choose a date and a time.","value-missing-time":"Choose a time."}}');

/***/ },

/***/ "8752f4d5d78e"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Календарь","runtime":{"choose-end":"выберите конец","choose-month":"Выберите месяц","choose-start":"Выберите начало периода","choose-year":"Выберите год","close":"Закрыть","custom-range":"Свой период","day-off":"выходной","done":"Готово","earlier-hour":"Предыдущий час","earlier-minute":"Предыдущие минуты","go-to-today":"К сегодня","hours":"Часы","later-hour":"Следующий час","later-minute":"Следующие минуты","minutes":"Минуты","next-month":"Следующий месяц","next-years":"Следующие годы","period":"Период","preset-last-month":"Прошлый месяц","preset-last30-days":"Последние 30 дней","preset-last7-days":"Последние 7 дней","preset-this-month":"Этот месяц","preset-this-week":"Эта неделя","preset-today":"Сегодня","preset-yesterday":"Вчера","presets":"Быстрый выбор","previous-month":"Предыдущий месяц","previous-years":"Предыдущие годы","time":"Время","time-not-set":"Не задано","value-missing":"Выберите дату.","value-missing-datetime":"Выберите дату и время.","value-missing-time":"Выберите время."}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("34f37be62b39");
/******/
/******/ })()
;