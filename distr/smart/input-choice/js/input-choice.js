/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "a2a9d3c2841e"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BADGE_MAIN_TONAL: () => (/* binding */ BADGE_MAIN_TONAL),
/* harmony export */   BADGE_SCHEMES: () => (/* binding */ BADGE_SCHEMES),
/* harmony export */   BADGE_SCHEME_ALIASES: () => (/* binding */ BADGE_SCHEME_ALIASES),
/* harmony export */   BADGE_SIZES: () => (/* binding */ BADGE_SIZES),
/* harmony export */   BADGE_TYPES: () => (/* binding */ BADGE_TYPES),
/* harmony export */   BADGE_VARIANTS: () => (/* binding */ BADGE_VARIANTS),
/* harmony export */   canonicalBadgeScheme: () => (/* binding */ canonicalBadgeScheme),
/* harmony export */   isRetiredMain: () => (/* binding */ isRetiredMain),
/* harmony export */   normalizeBadgeContract: () => (/* binding */ normalizeBadgeContract)
/* harmony export */ });
const BADGE_TYPES = Object.freeze(['main', 'tonal', 'outline']);
const BADGE_SCHEMES = Object.freeze(['neutral', 'primary', 'secondary', 'tertiary', 'info', 'success', 'warning', 'error', 'on-surface']); // Former scheme names that still draw: `danger` was this component's word for
// the error status before the shared vocabulary (contracts/public-api-axes.json,
// journal class-status-aliases, until 2026-12-01). It is read as `error`, so the
// Native constructor emits the canonical class, as sf-badge does; the
// stylesheet matches `.sf-badge--danger` beside it for markup written by hand.

const BADGE_SCHEME_ALIASES = Object.freeze({
  danger: 'error'
});
const BADGE_SIZES = Object.freeze(['1/3', '1/2', '1']); // The default look is tonal (owner decision C140 (1), badges study BG-1): a
// badge without an appearance is the calm grey mark. It was main, the dark
// grey fill nobody chose.

const DEFAULT_BADGE_TYPE = 'tonal';
const DEFAULT_BADGE_SCHEME = 'neutral';
const DEFAULT_BADGE_SIZE = '1/3';

const normalizeEnum = (value, allowed, fallback) => {
  const normalized = String(value ?? fallback).trim().toLowerCase();
  return allowed.includes(normalized) ? normalized : fallback;
}; // The canonical scheme for a name, a former one included; '' when the name is
// not a badge scheme.


function canonicalBadgeScheme(value) {
  const name = String(value ?? '').trim().toLowerCase();
  const canonical = BADGE_SCHEME_ALIASES[name] ?? name;
  return BADGE_SCHEMES.includes(canonical) ? canonical : '';
} // The looks that are drawn: tonal and outline in every colour, main only with
// the error status (C140 (4)).

const BADGE_VARIANTS = Object.freeze(BADGE_SCHEMES.flatMap(scheme => BADGE_TYPES.filter(type => type !== 'main' || scheme === 'error').flatMap(type => BADGE_SIZES.map(size => Object.freeze({
  type,
  scheme,
  size
}))))); // The filled look is the attention count's alone (owner decision C140 (4)):
// main with the error status. main with any other colour draws tonal; the
// spelling keeps working until this date and each use is noted in
// SF.deprecations (journal value-badge-appearance-main-to-tonal).

const BADGE_MAIN_TONAL = Object.freeze({
  since: '2026-11-14',
  remove_after: '2027-01-01'
}); // True when an appearance asked for is the filled one on a colour that draws
// it tonal: the caller notes the old spelling.

function isRetiredMain({
  type,
  scheme
} = {}) {
  const requested = String(type ?? '').trim().toLowerCase();
  return requested === 'main' && (canonicalBadgeScheme(scheme ?? DEFAULT_BADGE_SCHEME) || DEFAULT_BADGE_SCHEME) !== 'error';
}
function normalizeBadgeContract({
  type,
  scheme,
  size
} = {}) {
  let normalizedType = normalizeEnum(type, BADGE_TYPES, DEFAULT_BADGE_TYPE);
  const normalizedScheme = canonicalBadgeScheme(scheme ?? DEFAULT_BADGE_SCHEME) || DEFAULT_BADGE_SCHEME;
  const normalizedSize = normalizeEnum(size, BADGE_SIZES, DEFAULT_BADGE_SIZE); // main is the attention count's: with any other colour it is tonal. The
  // tonal on-surface badge is the grey tonal one (the stylesheet draws
  // sf-badge--on-surface tonal as neutral); it was drawn main, filled.

  if (normalizedType === 'main' && normalizedScheme !== 'error') {
    normalizedType = 'tonal';
  }

  return {
    type: normalizedType,
    scheme: normalizedScheme,
    size: normalizedSize
  };
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

/***/ "b30ec5bc0edb"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   OPTION_BADGE_HUES: () => (/* binding */ OPTION_BADGE_HUES),
/* harmony export */   OPTION_BADGE_PALETTE: () => (/* binding */ OPTION_BADGE_PALETTE),
/* harmony export */   nearestPaletteHue: () => (/* binding */ nearestPaletteHue),
/* harmony export */   optionBadgeProps: () => (/* binding */ optionBadgeProps),
/* harmony export */   optionDotColor: () => (/* binding */ optionDotColor)
/* harmony export */ });
/* harmony import */ var _component_badges_js_contract_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("a2a9d3c2841e");

const HEX_COLOR = /^#(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i; // The hues of the static palette (owner decision C17), each with the OKLCH hue
// angle of its tone 50 (src/core/scss/_sf_static_palette.scss, rounded to the
// degree; tests/option-badge-palette.contract.test.mjs holds the two equal).
// Brown and gray are not reached from a hex: brown sits between orange and
// amber and differs from them by chroma alone, which a light or a dark hex
// does not keep; a colour with less chroma than GREY_CHROMA is gray. Both are
// reached by name.

const OPTION_BADGE_HUES = Object.freeze({
  red: 28,
  orange: 47,
  amber: 60,
  yellow: 89,
  lime: 119,
  green: 144,
  teal: 173,
  cyan: 203,
  sky: 232,
  blue: 259,
  indigo: 279,
  violet: 299,
  purple: 320,
  pink: 347
});
const OPTION_BADGE_PALETTE = Object.freeze([...Object.keys(OPTION_BADGE_HUES), "brown", "gray"]);
const GREY_CHROMA = 0.03;

const linear = channel => {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}; // {chroma, hue} in OKLCH of a #rgb[a] / #rrggbb[aa]; the alpha is not read.


function oklchOf(hex) {
  let digits = hex.slice(1);
  if (digits.length < 6) digits = [...digits].map(digit => digit + digit).join("");
  const [r, g, b] = [0, 2, 4].map(at => linear(parseInt(digits.slice(at, at + 2), 16)));
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return {
    chroma: Math.hypot(a, bb),
    hue: (Math.atan2(bb, a) * 180 / Math.PI + 360) % 360
  };
}
/** The static palette hue nearest a hex colour: gray when it has no hue to speak of. */


function nearestPaletteHue(hex) {
  const {
    chroma,
    hue
  } = oklchOf(hex);
  if (chroma < GREY_CHROMA) return "gray";
  let best = "gray";
  let distance = Infinity;

  for (const [name, angle] of Object.entries(OPTION_BADGE_HUES)) {
    const apart = Math.abs((hue - angle + 540) % 360 - 180);

    if (apart < distance) {
      best = name;
      distance = apart;
    }
  }

  return best;
} // The fill of a hue: tone 50 at the fill step 24 (C43: no new tones or steps;
// the alpha scale's fill family), over the place in both themes, as the 24 %
// mix of the data's hex was. The text stays on the surface colour, so the
// label reads the same in both themes. Written to the badge's public
// variables, --sf-badge-background-color and --sf-badge-color (owner decision
// C140 (2), BG-7): a colour from data reaches the badge only through them and
// only as a palette step, never the author's hex.

const paletteStyle = hue => `--sf-badge-background-color: var(--sf-${hue}-50--alfa-24); --sf-badge-color: var(--sf-on-surface)`;
/**
 * Badge look for a filter option with optionRenderer 'badge'. option.color is
 * a Framework badge scheme (success, error, info...), a hue of the static
 * palette (red, teal, gray...; C17) or a hex colour. A hue tints the badge with
 * its own palette step; a hex is drawn in the palette hue nearest it, never as
 * the raw colour (C18, C43; badges study BG-7), so the label stays readable in
 * both themes. Anything else is neutral.
 */
// The data view port names the badge look `scheme` on a column's options; a
// filter option has always said `color`. Both are read: reading only `color`
// left every port column's scheme unread and its badges neutral.


function optionBadgeProps(option = {}) {
  const raw = option?.scheme ?? option?.color;
  const color = typeof raw === "string" ? raw.trim() : ""; // A former name (danger) reads as its canonical scheme (error).

  const scheme = (0,_component_badges_js_contract_js__WEBPACK_IMPORTED_MODULE_0__.canonicalBadgeScheme)(color);
  if (scheme) return {
    scheme,
    rootStyle: ""
  };
  const name = color.toLowerCase();
  if (OPTION_BADGE_PALETTE.includes(name)) return {
    scheme: "neutral",
    rootStyle: paletteStyle(name)
  };
  if (HEX_COLOR.test(color)) return {
    scheme: "neutral",
    rootStyle: paletteStyle(nearestPaletteHue(color))
  };
  return {
    scheme: "neutral",
    rootStyle: ""
  };
} // The colour of an option drawn as a circle (FO4-1, FO4-2: option-look dot):
// a scheme its role colour, a hue of the static palette its tone 50, a hex or
// a CSS colour itself (the circle is a sample of the colour, not text on it);
// neutral the outline colour. '' when nothing is given.

const SCHEME_INK = Object.freeze({
  neutral: "--sf-outline",
  "on-surface": "--sf-on-surface-variant"
});
function optionDotColor(option = {}) {
  const raw = option?.color ?? option?.scheme ?? option?.swatch;
  const color = typeof raw === "string" ? raw.trim() : "";
  if (!color) return "";
  const scheme = (0,_component_badges_js_contract_js__WEBPACK_IMPORTED_MODULE_0__.canonicalBadgeScheme)(color);
  if (scheme) return `var(${SCHEME_INK[scheme] ?? `--sf-${scheme}`})`;
  const name = color.toLowerCase();
  if (OPTION_BADGE_PALETTE.includes(name)) return `var(--sf-${name}-50)`;
  return color;
}

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
/* harmony import */ var _helpers_field_help__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("f39dc444b059");
/* harmony import */ var _core_js_deprecations__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("d3818183b14c");
/* harmony import */ var _js_choice_model_mjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("a5350ee6efc2");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("0c1826bbbeb3");
/* harmony import */ var _lang_index_mjs__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("d74311df0d54");
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("0517be6f999f");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_instance_path__WEBPACK_IMPORTED_MODULE_2__, _js_templates_default__WEBPACK_IMPORTED_MODULE_4__, _helpers_field_help__WEBPACK_IMPORTED_MODULE_5__, _core_js_deprecations__WEBPACK_IMPORTED_MODULE_6__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_instance_path__WEBPACK_IMPORTED_MODULE_2__, _js_templates_default__WEBPACK_IMPORTED_MODULE_4__, _helpers_field_help__WEBPACK_IMPORTED_MODULE_5__, _core_js_deprecations__WEBPACK_IMPORTED_MODULE_6__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_instance_path__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_core_js_instance_path__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _core_js_deprecations__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_core_js_deprecations__WEBPACK_IMPORTED_MODULE_6__);









 // Only the words on screen ship in the bundle, English only (owner decision
// C282): Russian and every other language come from a language file. The
// title, settings and events stay in the language files for the Studio and the
// docs (localization study LC-2).

 // sf-input-choice: a form field that picks one option, or several, from
// cards -- a site's kind, a page type, a template, a backup target, a plan,
// delivery or payment -- each with a title, a description, a badge, a price
// and term, an icon or an image, in one of three layouts (list, tile,
// picture; owner decision C28). Larena's request msg-993e1e39 item 3 (choice
// cards).
//
// appearance="list" (owner decision C165 (1), (3)) draws the same field as a
// ready group of checks or radios: a heading with its «?», the hint, the
// options as rows of the class checkbox or radio, the error under the last
// row; flow auto, row or column arranges the rows.
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

const ChoiceElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_8__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: _lang_index_mjs__WEBPACK_IMPORTED_MODULE_9__.files,
  source: 'en'
}); // An option named by text (sf-dropdown's first spelling) rather than label:
// read until the date, noted once in SF.deprecations (Larena LF-2).

const noteOptionAlias = (from, to) => (0,_core_js_deprecations__WEBPACK_IMPORTED_MODULE_6__.noteDeprecated)({
  component: 'sf-input-choice',
  tag: 'sf-input-choice',
  kind: 'property',
  attribute: 'items',
  from,
  to,
  since: '2026-11-18',
  remove_after: '2027-01-01'
}); // The id the inner inputs' form attribute names: no element carries it.


const NO_FORM = 'sf-input-choice-no-form'; // A provider's page (FO-4): the options asked for at once, and the wait after
// the last key of a search before the provider is asked.

const PAGE_LIMIT = 50;
const SEARCH_DEBOUNCE = 200;

class SfInputChoice extends (0,_helpers_form_field__WEBPACK_IMPORTED_MODULE_3__.ShownValidity)((0,_helpers_form_field__WEBPACK_IMPORTED_MODULE_3__.FormField)(ChoiceElement)) {
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
  } // ---------------------------------------------------------- the host's pages (FO-4)
  // searchable: a search field over the rows; without a provider it searches
  // the options in hand. provider: the options come from the host, a page at
  // a time -- async (query, {cursor, limit, signal}) answering {items,
  // nextCursor?}, as sf-input-lookup's provider; a thrown error or a rejected
  // promise is the error line with «Try again». The previous call is aborted
  // through signal and an answer for an older call is dropped. The options in
  // hand (items) stay first -- a chosen option the pages have not reached
  // keeps its row.


  get _pages() {
    if (!this.__pages) this.__pages = {
      provider: null,
      items: [],
      status: 'idle',
      nextCursor: null,
      retryCursor: null,
      sequence: 0,
      abort: null,
      timer: 0,
      query: ''
    };
    return this.__pages;
  }

  searchFor(query) {
    const pages = this._pages;
    pages.query = String(query ?? '');
    clearTimeout(pages.timer);

    if (typeof this.provider === 'function') {
      pages.timer = setTimeout(() => this.loadPage(null), SEARCH_DEBOUNCE);
      return;
    }

    this.requestComponentUpdate('search');
  }

  async loadPage(cursor = null) {
    const provider = this.provider;
    const pages = this._pages;
    if (typeof provider !== 'function' || !this.isConnected) return false;
    pages.abort?.abort();
    const controller = typeof AbortController === 'function' ? new AbortController() : null;
    pages.abort = controller;
    const sequence = ++pages.sequence;
    pages.status = 'loading';
    pages.retryCursor = cursor;
    this.requestComponentUpdate('page');

    try {
      const answer = await provider(pages.query, {
        cursor,
        limit: PAGE_LIMIT,
        signal: controller?.signal
      });
      if (sequence !== pages.sequence || !this.isConnected) return false;
      const items = (0,_js_choice_model_mjs__WEBPACK_IMPORTED_MODULE_7__.normaliseItems)(Array.isArray(answer?.items) ? answer.items : []);
      pages.items = cursor ? (0,_js_choice_model_mjs__WEBPACK_IMPORTED_MODULE_7__.mergeItems)(pages.items, items) : items;
      pages.nextCursor = answer?.nextCursor ?? answer?.next_cursor ?? null;
      pages.status = pages.items.length ? 'ready' : 'empty';
      this.requestComponentUpdate('page');
      return true;
    } catch (error) {
      if (sequence !== pages.sequence || error?.name === 'AbortError') return false;
      pages.status = 'error';
      this.requestComponentUpdate('page');
      return false;
    }
  } // A provider given (or replaced) is asked for its first page.


  _followProvider() {
    const pages = this._pages;
    const provider = typeof this.provider === 'function' ? this.provider : null;
    if (provider === pages.provider) return;
    pages.abort?.abort();
    Object.assign(pages, {
      provider,
      items: [],
      status: 'idle',
      nextCursor: null,
      retryCursor: null
    });
    if (provider) queueMicrotask(() => this.loadPage(null));
  }

  onDisconnected() {
    super.onDisconnected?.();
    this._opened = null;
    this._moreWatch?.disconnect();
    this._moreWatch = null;
    this._moreWatched = null;
    const pages = this._pages;
    clearTimeout(pages.timer);
    pages.abort?.abort(); // Back on the page, the provider is asked again.

    pages.provider = null;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // The value attribute written again is the value again.
    if (name === 'value' && oldValue !== newValue) {
      this._value = undefined;
      this._opened = null;
      this.requestComponentUpdate?.('value');
      this.sfSyncFormState?.();
    } // A list setting is a property (or the JSON island); the attribute holds
    // the same list as JSON, as sf-menu's items. A change after the element
    // first connected is the property's list now (sfReadListAttributes below
    // takes the first one).


    if (name === 'items' && oldValue !== newValue) {
      if (this.__sfListAttributesRead) this.adoptItemsAttribute(newValue);
      this.requestComponentUpdate?.('items');
    }

    super.attributeChangedCallback(name, oldValue, newValue);
  } // The property says what the attribute gave (Larena LF-1, 2026-11-18:
  // items read [] while the cards drew the attribute's options). The base
  // reads a list attribute only for a setting no component observes; this
  // one is observed, so the first reading is here, after the island and on
  // the same terms: a property or the island that gave the list first wins.


  sfReadListAttributes() {
    const first = !this.__sfListAttributesRead;
    super.sfReadListAttributes();
    if (!first || !this.hasAttribute('items')) return;
    const given = this.items;
    const store = this.__sfManifestData ?? {};
    if (Array.isArray(given) && given.length || Object.prototype.hasOwnProperty.call(store, 'items')) return;
    this.adoptItemsAttribute(this.getAttribute('items'));
  } // The attribute's JSON as the items property; not JSON or not a list:
  // the property keeps its value (the cards still read the attribute).


  adoptItemsAttribute(raw) {
    let list;

    try {
      list = raw === null ? [] : JSON.parse(raw);
    } catch {
      return;
    }

    if (Array.isArray(list)) this.items = list;
  } // ---------------------------------------------------------- settings
  // The options: the property or the island, else the attribute's JSON.


  get options() {
    const given = this.items;
    const own = Array.isArray(given) && given.length ? (0,_js_choice_model_mjs__WEBPACK_IMPORTED_MODULE_7__.normaliseItems)(given, {
      onAlias: noteOptionAlias
    }) : (0,_js_choice_model_mjs__WEBPACK_IMPORTED_MODULE_7__.normaliseItems)(this.getAttribute('items'), {
      onAlias: noteOptionAlias
    });
    if (typeof this.provider === 'function') return (0,_js_choice_model_mjs__WEBPACK_IMPORTED_MODULE_7__.mergeItems)(own, this._pages.items);
    return own;
  } // The rows drawn: the options, searched in place when the field is
  // searchable and has no provider (a provider searches itself).


  get shownOptions() {
    const options = this.options;
    const paged = typeof this.provider === 'function';
    if (!this.searchable && !paged) return options; // FO4-5: with a search or a host's pages, what was chosen when the list
    // opened stands first; the order does not move while it is open.

    this._opened ??= new Set(this.selected);
    const shown = paged ? options : (0,_js_choice_model_mjs__WEBPACK_IMPORTED_MODULE_7__.searchItems)(options, this._pages.query);
    return (0,_js_choice_model_mjs__WEBPACK_IMPORTED_MODULE_7__.chosenFirst)(shown, this._opened);
  } // The index of the last row that stands first because it was chosen when
  // the list opened, while other rows follow it; -1 when nothing stands first.


  chosenLastIndex() {
    const opened = this._opened;
    if (!opened?.size) return -1;
    const shown = this.shownOptions;
    let last = -1;

    while (last + 1 < shown.length && opened.has(shown[last + 1].value)) last += 1;

    return last >= 0 && last < shown.length - 1 ? last : -1;
  } // panel (owner decisions C313 (3), C312 (1)): the list as a dropping
  // panel's content. While a search is typed in a multiple list, the rows
  // found and not chosen can be chosen at once («Select found (N)»).


  get panelValue() {
    return this.hasAttribute('panel') && this.getAttribute('panel') !== 'false';
  }

  foundToSelect() {
    if (!this.multiple || !this.panelValue || !this._pages.query.trim()) return [];
    const chosen = new Set(this.selected);
    return this.shownOptions.filter(one => !one.disabled && !chosen.has(one.value)).map(one => one.value);
  }

  selectFound() {
    const found = this.foundToSelect();
    if (!found.length || this.effectiveDisabled) return;
    const next = [...this.selected, ...found];
    this._value = (0,_js_choice_model_mjs__WEBPACK_IMPORTED_MODULE_7__.formatValue)(next);
    this.requestComponentUpdate('value');
    this.sfSyncFormState();
    const detail = {
      value: this.value,
      values: [...next],
      item: null,
      checked: true
    };
    this.sfEmit('input', detail);
    this.sfEmit('change', detail);
  } // Where a row's box stands (C308 FO-5): start, or end of the row.


  get controlPositionValue() {
    return this.getAttribute('control-position') === 'end' ? 'end' : 'start';
  }

  get optionLookValue() {
    const look = this.getAttribute('option-look');
    return _js_choice_model_mjs__WEBPACK_IMPORTED_MODULE_7__.OPTION_LOOKS.includes(look) ? look : '';
  }

  get effectiveDisabled() {
    return Boolean(this.disabled || this.sfFormDisabled);
  }

  get columnsValue() {
    const columns = String(this.columns ?? 'auto');
    return _js_choice_model_mjs__WEBPACK_IMPORTED_MODULE_7__.CHOICE_COLUMNS.includes(columns) ? columns : 'auto';
  }

  get appearanceValue() {
    const appearance = String(this.appearance ?? 'cards');
    return _js_choice_model_mjs__WEBPACK_IMPORTED_MODULE_7__.CHOICE_APPEARANCES.includes(appearance) ? appearance : 'cards';
  }

  get layoutValue() {
    const layout = String(this.layout ?? 'tile');
    return _js_choice_model_mjs__WEBPACK_IMPORTED_MODULE_7__.CHOICE_LAYOUTS.includes(layout) ? layout : 'tile';
  } // Appearance list (C165 (3)): row or column as asked; auto is a row for up
  // to three short options and a column for the rest.


  get flowValue() {
    return (0,_js_choice_model_mjs__WEBPACK_IMPORTED_MODULE_7__.listFlow)(String(this.flow ?? 'auto'), this.options);
  }
  /** The chosen values, in the order of the options: one, or several when multiple. */


  get selected() {
    const raw = this._value !== undefined ? this._value : this.getAttribute('value');
    return (0,_js_choice_model_mjs__WEBPACK_IMPORTED_MODULE_7__.orderValues)((0,_js_choice_model_mjs__WEBPACK_IMPORTED_MODULE_7__.parseValue)(raw ?? '', Boolean(this.multiple)), this.options);
  }
  /** One value, or the values joined by commas when multiple; '' when nothing is chosen. */


  get value() {
    return (0,_js_choice_model_mjs__WEBPACK_IMPORTED_MODULE_7__.formatValue)(this.selected);
  } // Set from code it is not a change: no event, as for a native field.


  set value(next) {
    this._value = next === undefined || next === null ? undefined : (0,_js_choice_model_mjs__WEBPACK_IMPORTED_MODULE_7__.formatValue)((0,_js_choice_model_mjs__WEBPACK_IMPORTED_MODULE_7__.parseValue)(next, Boolean(this.multiple))); // A value the host sets is what was chosen when the list opened (FO4-5);
    // a person's own choice (onChange) does not move the order.

    this._opened = null;
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
    const next = (0,_js_choice_model_mjs__WEBPACK_IMPORTED_MODULE_7__.applyChoice)(this.selected, this.options, item.value, input.checked, multiple);
    this._value = (0,_js_choice_model_mjs__WEBPACK_IMPORTED_MODULE_7__.formatValue)(next);
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
    this._value = (0,_js_choice_model_mjs__WEBPACK_IMPORTED_MODULE_7__.formatValue)((0,_js_choice_model_mjs__WEBPACK_IMPORTED_MODULE_7__.parseValue)(values, Boolean(this.multiple)));
    this.requestComponentUpdate('restore');
  } // ---------------------------------------------------------- drawing


  pagingContext() {
    this._followProvider();

    const pages = this._pages;
    const paged = typeof this.provider === 'function';
    const searchable = Boolean(this.searchable);
    const status = paged ? pages.status : searchable && pages.query.trim() && !this.shownOptions.length ? 'empty' : 'ready';
    return {
      shown: paged || searchable,
      searchable,
      query: pages.query,
      status,
      nextCursor: paged ? pages.nextCursor : null,
      retryCursor: pages.retryCursor,
      words: {
        search: this.sfWord('search-label'),
        loading: this.sfWord('loading-options'),
        error: this.sfWord('options-error'),
        empty: this.sfWord('nothing-found'),
        retry: this.sfWord('retry'),
        more: this.sfWord('show-more'),
        found: this.sfWord('select-found')
      },
      found: this.foundToSelect().length
    };
  }

  templateContext() {
    const props = this.getPropsContext();
    const internals = Boolean(this.sfInternals);
    const id = (0,_core_js_instance_path__WEBPACK_IMPORTED_MODULE_2__.partId)((0,_core_js_instance_path__WEBPACK_IMPORTED_MODULE_2__.instancePath)(this, {
      kind: 'sf-input-choice'
    }));
    return this.createTemplateContext({ ...props,
      component: this,
      id,
      items: this.shownOptions,
      chosenLast: this.chosenLastIndex(),
      chosen: new Set(this.selected),
      paging: this.pagingContext(),
      multiple: Boolean(this.multiple),
      columns: this.columnsValue,
      appearance: this.appearanceValue,
      layout: this.layoutValue,
      flow: this.flowValue,
      optionLook: this.optionLookValue,
      controlPosition: this.controlPositionValue,
      panel: this.panelValue,
      label: this.label || '',
      // C165 (1), C153 (8): the «?» after the heading, named by its subject.
      help: this.help || '',
      helpLabel: (0,_helpers_field_help__WEBPACK_IMPORTED_MODULE_5__.fieldHelpLabel)(this, this.label || ''),
      ariaLabel: this.getAttribute('aria-label') || '',
      hint: this.hint || '',
      // C153 (3): the page's error, or the one the field shows itself (ShownValidity).
      errorMessage: this.sfShownMessage(this.invalid, this.errorMessage || ''),
      invalid: this.sfShownInvalid(this.invalid),
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
    this.watchMore();
    this.watchTrack();
    return undefined;
  } // The list's scrollbar: while the rows scroll the list marks itself
  // (data-sf-choice-track). In a panel the rows give the track's room from
  // their end padding, so nothing shifts (popup head round 3, the owner's
  // variant B); outside one the search's icon moves in by the track with the
  // checks (round 2, PH-6), so the two keep one column.


  watchTrack() {
    const scroll = this.querySelector('.sf-choice-scroll');
    const root = scroll?.closest('.sf-choice') ?? null;

    if (scroll !== this._trackWatched) {
      this._trackWatch?.disconnect();
      this._trackWatched = scroll;
      const Observer = this.ownerDocument?.defaultView?.ResizeObserver ?? globalThis.ResizeObserver;

      if (scroll && typeof Observer === 'function') {
        this._trackWatch ??= new Observer(() => this.markTrack());

        this._trackWatch.observe(scroll);

        if (scroll.firstElementChild) this._trackWatch.observe(scroll.firstElementChild);
      }
    }

    if (root) this.markTrack();
  }

  markTrack() {
    const scroll = this._trackWatched;
    const root = scroll?.closest('.sf-choice');
    if (!root) return;
    root.toggleAttribute('data-sf-choice-track', scroll.offsetWidth - scroll.clientWidth > 0);
  }

  disconnectedCallback() {
    super.disconnectedCallback?.();
    this._trackWatch?.disconnect();
    this._trackWatch = null;
    this._trackWatched = null;
  } // FO4-4: the host's next page loads when the list is scrolled to its end
  // (the mark after «Показать ещё» comes into view, in the window or the
  // box that scrolls the list); the button stays the last row, for the keyboard and for a
  // browser without IntersectionObserver.


  watchMore() {
    const more = this.querySelector(':scope .sf-choice-end[data-sf-more]');
    if (more === this._moreWatched) return;
    this._moreWatch?.disconnect();
    this._moreWatched = more;
    const Observer = this.ownerDocument?.defaultView?.IntersectionObserver ?? globalThis.IntersectionObserver;
    if (!more || typeof Observer !== 'function') return;
    this._moreWatch ??= new Observer(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      const pages = this._pages;
      if (pages.nextCursor && pages.status !== 'loading') this.loadPage(pages.nextCursor);
    });

    this._moreWatch.observe(more);
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
/* harmony import */ var _helpers_option_badge_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("b30ec5bc0edb");
/* harmony import */ var _choice_model_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("a5350ee6efc2");
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
// The «?» after the heading or the label (help; C153 (8), C165 (1)): a step
// below the line it stands on, 1/3, as beside the checkable rows' text of
// size 1 (helpers/checkable-row.js CHECKABLE_HELP_SIZE); each sheet holds it
// to that line, so the line keeps its height.

function renderHelp(context) {
  if (!context.help) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-help-mark class="sf-choice-help" size="1/3" text=${context.help} label=${context.helpLabel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                            @click=${event => event.stopPropagation()}></sf-help-mark>`;
}

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
        <span class="sf-choice-title">${item.icon && !item.avatar ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-icon sf-choice-icon" aria-hidden="true">${item.icon}</span>` : renderVisual(context, item, {
    icon: false
  })}${renderName(context, item, disabled, ids.title)}${item.badge ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-badge class="sf-choice-badge" id=${ids.badge} text=${item.badge} appearance="tonal" scheme="primary" line="1/2"
                           root-class=${disabled ? 'sf-badge--disabled' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}></sf-badge>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}</span>
        ${item.caption ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-choice-caption" id=${ids.caption}>${item.caption}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      </span>
      ${list ? renderPrice(item, ids.price, 'sf-choice-meta') : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    </span>
    ${foot ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-choice-rule" aria-hidden="true"></span>${renderPrice(item, ids.price, 'sf-choice-price')}` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
  </label>`;
} // ---------------------------------------------------------------- list
//
// appearance="list" (owner decision C165 (1), (3); research ui-control
// control/research/2026-11-14-checks.md, prototype checks-study.html#q-group
// and #q-inline): the ready group of checks or radios.
//
//   div.sf-choice[data-appearance=list][data-flow=row|column]
//     div.sf-choice-heading           the heading (text 1, medium), «*», «?»
//     span.sf-choice-hint             the hint under the heading
//     div.sf-choice-options           role radiogroup (single) or group (multiple)
//       label.sf-radio-button | label.sf-checkbox   one row per option: the
//                                     class markup sf-radio and sf-checkbox
//                                     draw (size 1), the native input in its
//                                     box, the name and the description; a row
//                                     of the step, as the C63 rows
//     span.sf-choice-message          the error under the last row, its icon first
//
// The group is named by the heading and described by the hint and the error.
// While invalid every row's control takes the error colour, as an invalid
// sf-radio or sf-checkbox.
// An option's visual (FO-4; in every appearance since FO4-1): a picture
// (sf-avatar on the row's line), else its icon (FO4-3), else its colour as a
// circle when the look is dot (the menu's colour row, C85); with the look
// badge the name itself is a tonal badge (sf-badge tight, its scheme, palette
// hue or hex through helpers/option-badge.js, as a table cell's choice). The
// picture, the icon and the circle are not read: the name is.


function renderVisual(context, item, {
  icon = true
} = {}) {
  if (item.avatar) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-avatar class="sf-choice-avatar" size="1" line="1" aria-hidden="true"
                           image-url=${item.avatar.image || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                           text=${item.avatar.text || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} heading=${item.label}></sf-avatar>`;
  }

  if (icon && item.icon) return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-icon sf-choice-icon" aria-hidden="true">${item.icon}</span>`;

  if (item.color && (0,_choice_model_mjs__WEBPACK_IMPORTED_MODULE_3__.optionLook)(item, context.optionLook) === 'dot') {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-choice-swatch" style=${`--sf-choice--swatch: ${(0,_helpers_option_badge_js__WEBPACK_IMPORTED_MODULE_2__.optionDotColor)(item)}`} aria-hidden="true"></span>`;
  }

  return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
}

function renderName(context, item, disabled, id = '') {
  if (!item.color || (0,_choice_model_mjs__WEBPACK_IMPORTED_MODULE_3__.optionLook)(item, context.optionLook) !== 'badge') return id ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-choice-title-text" id=${id}>${item.label}</span>` : item.label;
  const badge = (0,_helpers_option_badge_js__WEBPACK_IMPORTED_MODULE_2__.optionBadgeProps)({
    color: item.color
  });
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-badge class="sf-choice-name-badge" id=${id || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} appearance="tonal" tight line="1" scheme=${badge.scheme}
                        root-style=${badge.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} root-class=${disabled ? 'sf-badge--disabled' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                        text=${item.label}></sf-badge>`;
}

function renderRow(context, item, index) {
  const checked = context.chosen.has(item.value);
  const disabled = context.fieldDisabled || item.disabled;
  const n = index + 1;
  const titleId = `${context.id}--title-${n}`;
  const captionId = `${context.id}--caption-${n}`;
  const input = (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<input class="sf-choice-input" type=${context.multiple ? 'checkbox' : 'radio'}
           name=${context.controlName || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} form=${context.innerForm || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
           value=${item.value} .checked=${checked} ?disabled=${disabled}
           aria-labelledby=${titleId} aria-describedby=${item.caption ? captionId : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
           aria-invalid=${context.invalid ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>`;
  const error = context.invalid ? 'error' : ''; // The last of what was chosen when the list opened, which stands first
  // (FO4-5): a hairline under it parts it from the rest (filter field study).

  const last = index === context.chosenLast ? 'sf-choice-row--chosen-last' : '';

  if (context.multiple) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<label class=${joinClasses('sf-checkbox', 'sf-checkbox--size-1', 'flex', 'sf-choice-row', last, disabled ? '' : 'cursor-pointer', error)}>
      <span class="sf-checkbox-box flex">${input}${checked ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-icon" aria-hidden="true">check</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}</span>
      <span class="sf-checkbox-container flex flex-col"><span class="sf-checkbox-top flex">${renderVisual(context, item)}<span class="sf-checkbox-label" id=${titleId}>${renderName(context, item, disabled)}</span></span>${item.caption ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-checkbox-description" id=${captionId}>${item.caption}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}</span>
    </label>`;
  }

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<label class=${joinClasses('sf-radio-button', 'sf-radio-button--size-1', 'flex', 'sf-choice-row', last, disabled ? '' : 'cursor-pointer', error)}>
    <span class="sf-radio-button-box flex items-cross-center content-main-center">${input}<span class="sf-radio-button-mark" aria-hidden="true"></span></span>
    <span class="sf-radio-button-container flex flex-col"><span class="sf-radio-button-top flex">${renderVisual(context, item)}<span class="sf-radio-button-text" id=${titleId}>${renderName(context, item, disabled)}</span></span>${item.caption ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-radio-button-description" id=${captionId}>${item.caption}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}</span>
  </label>`;
} // The search over the rows and what the host's pages say under them (FO-4):
// searchable puts the dropping panel's search header over the options (C06,
// FF-7: one search look with sf-dropdown's and sf-settings' -- no frame, no
// fill, a hairline under it, its text over the rows' text and its icon at
// the end; it was a filled sf-input, a second look); a provider's answer is said in one polite status line --
// loading, nothing found, the error with «Try again» -- and «Show more» asks
// for its next page.


function renderSearch(context) {
  const {
    paging
  } = context;
  if (!paging.searchable) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<label class="sf-choice-search">
    <span class="sf-choice-search-icon" aria-hidden="true"><i class="sf-icon">search</i></span>
    <input type="search" class="sf-choice-search-input" autocomplete="off" spellcheck="false"
           placeholder=${paging.words.search} aria-label=${paging.words.search}
           .value=${paging.query} ?disabled=${context.fieldDisabled}
           @input=${event => {
    // The search box's own input and change stop here:
    // typing is not a change of the field's value.
    event.stopPropagation();
    context.component.searchFor(event.target?.value ?? '');
  }}
           @change=${event => event.stopPropagation()}>
  </label>`;
} // «Select found (N)» (owner decision C312 (1)): in a panel, while a search
// is typed in a multiple list, the first row chooses the rows found and not
// chosen; it is gone with the search, or when nothing found is left to choose.


function renderSelectFound(context) {
  const {
    paging
  } = context;
  if (!context.panel || !context.multiple || !paging.found) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<button type="button" class="sf-choice-found" data-sf-select-found ?disabled=${context.fieldDisabled}
                      @click=${() => context.component.selectFound()}>
    <span class="sf-icon sf-choice-found-icon" aria-hidden="true">done_all</span><span class="sf-choice-found-text">${paging.words.found} (${paging.found})</span>
  </button>`;
}

function renderPaging(context) {
  const {
    paging
  } = context;
  const line = paging.status === 'loading' ? paging.words.loading : paging.status === 'error' ? paging.words.error : paging.status === 'empty' ? paging.words.empty : '';
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-choice-status" role="status" aria-live="polite" ?hidden=${!line}>${line}</span>${paging.status === 'error' ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button class="sf-choice-more" size="1/2" appearance="ghost" scheme="on-surface" text=${paging.words.retry}
                      @click=${() => context.component.loadPage(paging.retryCursor)}></sf-button>` : paging.nextCursor && paging.status !== 'loading' ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button class="sf-choice-more" size="1/2" appearance="ghost" scheme="on-surface" icon="expand_more" text=${paging.words.more}
                        @click=${() => context.component.loadPage(paging.nextCursor)}></sf-button><span class="sf-choice-end" data-sf-more aria-hidden="true"></span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}`;
} // In a panel (C313 (3)) the rows and their paging scroll under the search,
// in one box: the band and the search stay and reach both edges, and the
// mark after «Show more» comes into view only at the list's end (FO4-4).


function renderScroll(context, content) {
  return context.panel ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-choice-scroll">${content}</div>` : content;
}

function renderListTemplate(context) {
  const labelId = `${context.id}--label`;
  const hintId = `${context.id}--hint`;
  const messageId = `${context.id}--message`;
  const error = context.invalid && context.errorMessage ? context.errorMessage : '';
  const described = [context.hint ? hintId : '', error ? messageId : ''].filter(Boolean).join(' ');
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class=${joinClasses('sf-choice', 'sf-choice--list', context.multiple ? 'sf-choice--multiple' : '', context.invalid ? 'sf-choice--invalid' : '', context.fieldDisabled ? 'sf-choice--disabled' : '', context.rootClass)}
                   style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} data-appearance="list" data-flow=${context.flow}
                   data-control-position=${context.controlPosition} ?data-panel=${context.panel}>
    ${context.label ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-choice-heading"><span class="sf-choice-heading-text" id=${labelId}>${context.label}${context.required ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-choice-required" aria-hidden="true">*</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}</span>${renderHelp(context)}</div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    ${context.hint ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-choice-hint" id=${hintId}>${context.hint}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    ${renderSearch(context)}
    ${renderSelectFound(context)}
    ${renderScroll(context, (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-choice-options" role=${context.multiple ? 'group' : 'radiogroup'}
         aria-labelledby=${context.label ? labelId : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
         aria-label=${!context.label && context.ariaLabel ? context.ariaLabel : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
         aria-describedby=${described || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
         aria-required=${context.required && !context.multiple ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
         aria-invalid=${context.invalid && !context.multiple ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
         aria-disabled=${context.fieldDisabled ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
      ${(0,lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__.repeat)(context.items, item => item.value, (item, index) => renderRow(context, item, index))}
    </div>
    ${context.paging.shown ? renderPaging(context) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}`)}
    ${error ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-choice-message" id=${messageId} data-field-message="error"><span class="sf-icon sf-choice-message-icon" aria-hidden="true">error</span><span class="sf-choice-message-text">${error}</span></span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
  </div>`;
} // The cards' label row: the label, then with help its «?» beside it in one
// row (the mark is the label's sibling, so the group's name is the label alone).


function renderLabel(context, labelId) {
  const label = (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-choice-label" id=${labelId}>${context.label}${context.required ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-choice-required" aria-hidden="true">*</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}</span>`;
  if (!context.help) return label;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-choice-label-row">${label}${renderHelp(context)}</div>`;
}

function renderChoiceTemplate(context) {
  if (context.appearance === 'list') return renderListTemplate(context);
  const labelId = `${context.id}--label`;
  const messageId = `${context.id}--message`;
  const message = context.invalid && context.errorMessage ? context.errorMessage : context.hint;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class=${joinClasses('sf-choice', context.multiple ? 'sf-choice--multiple' : '', context.invalid ? 'sf-choice--invalid' : '', context.fieldDisabled ? 'sf-choice--disabled' : '', context.rootClass)}
                   style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} data-layout=${context.layout} data-columns=${context.columns}>
    ${context.label ? renderLabel(context, labelId) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
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

/***/ "a5350ee6efc2"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CHOICE_APPEARANCES: () => (/* binding */ CHOICE_APPEARANCES),
/* harmony export */   CHOICE_COLUMNS: () => (/* binding */ CHOICE_COLUMNS),
/* harmony export */   CHOICE_FLOWS: () => (/* binding */ CHOICE_FLOWS),
/* harmony export */   CHOICE_LAYOUTS: () => (/* binding */ CHOICE_LAYOUTS),
/* harmony export */   DEFAULT_OPTION_LOOK: () => (/* binding */ DEFAULT_OPTION_LOOK),
/* harmony export */   OPTION_LOOKS: () => (/* binding */ OPTION_LOOKS),
/* harmony export */   ROW_MOST: () => (/* binding */ ROW_MOST),
/* harmony export */   SHORT_OPTION_LENGTH: () => (/* binding */ SHORT_OPTION_LENGTH),
/* harmony export */   applyChoice: () => (/* binding */ applyChoice),
/* harmony export */   chosenFirst: () => (/* binding */ chosenFirst),
/* harmony export */   formatValue: () => (/* binding */ formatValue),
/* harmony export */   listFlow: () => (/* binding */ listFlow),
/* harmony export */   mergeItems: () => (/* binding */ mergeItems),
/* harmony export */   normaliseItems: () => (/* binding */ normaliseItems),
/* harmony export */   optionLook: () => (/* binding */ optionLook),
/* harmony export */   orderValues: () => (/* binding */ orderValues),
/* harmony export */   parseValue: () => (/* binding */ parseValue),
/* harmony export */   searchItems: () => (/* binding */ searchItems)
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

// The appearance (owner decision C165 (1), dispatcher's names 2026-11-14):
// cards -- the cards of C28 above; list -- the ready group of checks or
// radios: a heading with its «?», the hint under it, the options as rows of
// the class checkbox or radio (the rows sf-checkbox and sf-radio draw, C63)
// and the error under the last row.
const CHOICE_APPEARANCES = Object.freeze(['cards', 'list']);

// How the rows of appearance list stand: the flow setting (C165 (3); name by
// the dispatcher 2026-11-15, read only under appearance list; layout stays
// the cards' tile, list and picture). row -- side by side, 16 apart (C105 H6),
// a column again in a narrow field (a phone); column -- one under another;
// auto -- a row for up to three short options, else a column.
const CHOICE_FLOWS = Object.freeze(['auto', 'row', 'column']);

// «Short» for auto (C165 (3), prototype checks-study.html#q-inline: «Да /
// Нет», «Физлицо / Организация»): an option of one name line, no
// description, a name of at most this many characters.
const SHORT_OPTION_LENGTH = 20;
const ROW_MOST = 3;

// The flow a list draws: row or column as asked; auto (or anything else) a row
// for up to three short options (no description, a short name), else a column.
function listFlow(asked, items) {
  if (asked === 'row' || asked === 'column') return asked;
  const list = Array.isArray(items) ? items : [];
  const short = list.length > 0 && list.length <= ROW_MOST
    && list.every((item) => !item.caption && String(item.label ?? '').length <= SHORT_OPTION_LENGTH);
  return short ? 'row' : 'column';
}

const text = (value) => (value === null || value === undefined ? '' : String(value));

// A colour an option stands for (FO-4; a colour row of a menu, C85): a CSS
// colour -- a code, var() of a token, light-dark() of two; anything that
// could close the declaration is not drawn.
const SWATCH = /^[#\w\s(),.%/-]+$/u;

// An option's picture (FO-4): an address, or {image | src, text | initials};
// the initials are sf-avatar's when there is no picture. null without either.
function avatarOf(given) {
  if (!given) return null;
  if (typeof given === 'string') return given.trim() ? {image: given.trim(), text: ''} : null;
  if (typeof given !== 'object' || Array.isArray(given)) return null;
  const image = text(given.image ?? given.src ?? given['image-url'] ?? given.imageUrl).trim();
  const initials = text(given.text ?? given.initials).trim();
  return image || initials ? {image, text: initials} : null;
}

// How an option's colour is drawn (FO4-2; C302: the look is a template
// parameter, the colour is the option's data): badge -- the name itself as a
// tonal badge in that colour, as a table cell draws it; dot -- a colour circle
// before the name (the menu's colour row, C85).
const OPTION_LOOKS = Object.freeze(['badge', 'dot']);
// The look of an option's colour when nobody says (option-look unset, no
// former key): the option's name in a tonal label, the same in every
// template and place -- dropdown, buttons, checklist, view, cell (owner
// decision C308 FO-4); the circle (dot) is a template's parameter (C302).
const DEFAULT_OPTION_LOOK = 'badge';

// One option: {value, label, caption?, icon?, badge?, price?, term?, image?,
// avatar?, color?, disabled?} -- the shape of sf-input-lookup's options, with
// an icon, a badge, a price with its term and an image. Three visuals draw in
// every appearance (FO-4, FO4-1, FO4-3): avatar a picture before the name,
// icon an icon before it, color the option's colour (a scheme, a hue of the
// static palette or a hex), drawn by the look (option-look, OPTION_LOOKS).
// FO4-2: one data word, color; the former swatch (a circle) and scheme (a
// badge) are read as color with their look until 2027-01-01 (change journal
// input-choice-option-colour-one-key). `title` is read as the label; a
// missing label is the value. An option without a value, or repeating an
// earlier one, is left out: one value names one card.
// An option's name is label (title too); text, the name sf-dropdown's options
// used first, is read as well until 2027-01-01 (Larena LF-2, 2026-11-18: one
// option shape, {value, label}); onAlias is told when an option used it.
function normaliseItems(items, {onAlias} = {}) {
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
      label: text(source.label ?? source.title ?? aliasText(source, onAlias)) || value,
      caption: text(source.caption),
      icon: text(source.icon).trim(),
      badge: text(source.badge).trim(),
      price: text(source.price).trim(),
      term: text(source.term).trim(),
      image: text(source.image).trim(),
      avatar: avatarOf(source.avatar),
      ...colourOf(source),
      disabled: Boolean(source.disabled),
    });
  }
  return result;
}

// An option's colour and the look its former key said (FO4-2): color, else
// scheme (a badge) or swatch (a circle) until 2027-01-01. A colour that could
// close a declaration is not drawn.
function colourOf(source) {
  const given = [['color', ''], ['scheme', 'badge'], ['swatch', 'dot']]
    .map(([key, look]) => [text(source[key]).trim(), look])
    .find(([value]) => value);
  if (!given || !SWATCH.test(given[0])) return {color: '', look: ''};
  return {color: given[0], look: given[1]};
}

/** The look an option's colour is drawn with: the field's option-look, else its former key's, else the default. */
function optionLook(item, asked) {
  if (OPTION_LOOKS.includes(asked)) return asked;
  if (OPTION_LOOKS.includes(item?.look)) return item.look;
  return DEFAULT_OPTION_LOOK;
}

// Chosen first (FO4-5): with a search or a host's pages, the options chosen
// when the list opened stand first, in their order, then the rest; what the
// person chooses while it is open moves nothing.
function chosenFirst(items, opened) {
  if (!opened?.size) return items;
  return [...items.filter((item) => opened.has(item.value)), ...items.filter((item) => !opened.has(item.value))];
}

function aliasText(source, onAlias) {
  if (source.text === undefined || source.text === null) return undefined;
  onAlias?.('text', 'label');
  return source.text;
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

// The options a typed query keeps, searched in place (searchable without a
// provider): the name or the description holds the query, case and accents
// folded, as sf-input-lookup searches its inline options.
const fold = (value) => text(value).normalize('NFD').replace(/\p{M}/gu, '').toLocaleLowerCase();
function searchItems(items, query) {
  const wanted = fold(query).trim();
  if (!wanted) return items;
  return items.filter((item) => fold(item.label).includes(wanted) || fold(item.caption).includes(wanted));
}

// The options a provider's pages give, after the options given in hand: one
// value names one option, the first one given keeps its place, a later page
// may fill it in.
function mergeItems(given, paged) {
  const seen = new Map();
  for (const item of [...given, ...paged]) {
    if (!seen.has(item.value)) seen.set(item.value, item);
  }
  return [...seen.values()];
}


/***/ },

/***/ "d74311df0d54"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   files: () => (/* binding */ files)
/* harmony export */ });
/* harmony import */ var _en_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("68b61d1e5ff4");
// Written by scripts/build-language-packs.mjs from src/core/lang/built-in.json
// (owner decision C282); do not edit. The words this bundle carries: the
// built-in languages' (en); every other language comes from
// a language file (core/lang/<code>.js or its parts).


const files = { en: { runtime: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime } };

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ en: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime });


/***/ },

/***/ "0c1826bbbeb3"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.input-choice","tag":"sf-input-choice","version":"1.11.2","kind":"leaf","settings":{"items":{"type":"list","default":[],"of":{"value":"string","label":"string","caption":{"type":"string","optional":true},"icon":{"type":"icon","optional":true},"badge":{"type":"string","optional":true},"price":{"type":"string","optional":true},"term":{"type":"string","optional":true},"image":{"type":"string","optional":true},"disabled":{"type":"boolean","optional":true},"avatar":{"type":"object","optional":true},"swatch":{"type":"string","optional":true},"scheme":{"type":"string","optional":true}}},"searchable":{"type":"boolean","default":false},"provider":{"type":"object","default":null},"option-look":{"type":"enum","values":["badge","dot"]},"control-position":{"type":"enum","values":["start","end"],"default":"start"},"panel":{"type":"boolean","default":false},"multiple":{"type":"boolean","default":false},"appearance":{"type":"enum","values":["cards","list"],"default":"cards"},"layout":{"type":"enum","values":["tile","list","picture"],"default":"tile"},"flow":{"type":"enum","values":["auto","row","column"],"default":"auto"},"columns":{"type":"enum","values":["auto","1","2","3","4"],"default":"auto"},"label":{"type":"string","default":""},"hint":{"type":"string","default":""},"help":{"type":"string","default":""},"name":{"type":"string","default":""},"required":{"type":"boolean","default":false},"disabled":{"type":"boolean","default":false},"invalid":{"type":"boolean","default":false},"error-message":{"type":"string","default":""}},"values":{"value":{"type":"string","default":""}},"events":{"input":{"carries":"native"},"change":{"carries":"native"}},"actions":{},"form":{"value":"value","name":"name","default":"value","submits":"value","reset":"default","required":"required","disabled":"disabled","validity":["value-missing","custom-error"]},"css-variables":{"--sf-choice-gap":{"type":"length","state":"default"},"--sf-choice-min-inline-size":{"type":"length","state":"default"},"--sf-choice-padding":{"type":"length","state":"default"},"--sf-choice-radius":{"type":"length","state":"default"},"--sf-choice-background-color":{"type":"color","state":"default"},"--sf-choice-border-color":{"type":"color","state":"default"},"--sf-choice-selected-background-color":{"type":"color","state":"selected"},"--sf-choice-selected-border-color":{"type":"color","state":"selected"}}}');

/***/ },

/***/ "68b61d1e5ff4"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Choice","runtime":{"value-missing":"Choose an option.","help":"More about: {label}","search-label":"Find in the list","loading-options":"Loading the options","options-error":"The options could not be loaded","nothing-found":"Nothing found","retry":"Retry","show-more":"Show more","select-found":"Select found"}}');

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