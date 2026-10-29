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

/***/ "246c8ff58bbf"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _component_field_size__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("e6d86f2cd058");
/* harmony import */ var _helpers_form_field__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("38ea8d53f301");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("6c93a598699b");
/* harmony import */ var _js_rich_text_html_mjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("9965a2e69ea0");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("6a761c819b95");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("70900b6444b0");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("1a7ff5377834");
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("b59592d16c56");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _component_field_size__WEBPACK_IMPORTED_MODULE_2__, _js_templates_default__WEBPACK_IMPORTED_MODULE_4__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _component_field_size__WEBPACK_IMPORTED_MODULE_2__, _js_templates_default__WEBPACK_IMPORTED_MODULE_4__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);









 // sf-rich-text: a form field whose value is HTML of a small subset -- p, h2,
// h3, h4, strong, em, a[href], ul, ol, li, blockquote, br -- the text type
// html@1 of Larena's properties (js/rich-text-html.mjs is the subset's rule).
//
// From its component.json (standard simai.smart-component 1.3.11 §3, §4, §8,
// §17): the settings are made by core/js/element-manifest.js; the field is
// the form control through ElementInternals, as sf-textarea is, and says
// input while the text changes and change when the person leaves it with a
// changed value. A value set from code, a form reset and a restore say
// nothing.
//
// The value is never trusted: what the page gives, what is pasted or dropped,
// and the editing surface after every keystroke and command go through the
// one cleaner. A command may use document.execCommand where the browser has
// it, but its result is cleaned the same way, and undo and redo are the
// component's own history of cleaned states, so neither depends on it.

const RichTextElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_6__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_7__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_8__
  },
  source: 'en'
});
const BLOCK_TAGS = {
  paragraph: 'p',
  'heading-2': 'h2',
  'heading-3': 'h3',
  'heading-4': 'h4'
};
const LEAF_BLOCKS = 'p, h2, h3, h4, li, div';
const HISTORY_LIMIT = 100;
const TYPING_GROUP_MS = 1000; // The toolbar, in its order. `pressed` names the state that presses it;
// `unavailable` greys it out (aria-disabled, still reachable by the arrows).
//
// The four block levels are drawn as text, not glyphs: the Framework's icon
// font is Material Icons, which has no paragraph or heading-level icon
// (format_paragraph and format_h2..h6 are Material Symbols only), and a
// missing ligature prints its own name on the button. P, H2, H3 and H4 are
// read in both page languages; the button's name is the word, as everywhere.

const TOOLS = Object.freeze([{
  id: 'paragraph',
  word: 'paragraph',
  text: 'P',
  pressed: 'p',
  unavailable: state => state.inList
}, {
  id: 'heading-2',
  word: 'heading-2',
  text: 'H2',
  pressed: 'h2',
  unavailable: state => state.inList
}, {
  id: 'heading-3',
  word: 'heading-3',
  text: 'H3',
  pressed: 'h3',
  unavailable: state => state.inList
}, {
  id: 'heading-4',
  word: 'heading-4',
  text: 'H4',
  pressed: 'h4',
  unavailable: state => state.inList
}, {
  id: 'bold',
  word: 'bold',
  icon: 'format_bold',
  pressed: 'strong',
  key: 'B',
  shortcut: 'Control+B Meta+B'
}, {
  id: 'italic',
  word: 'italic',
  icon: 'format_italic',
  pressed: 'em',
  key: 'I',
  shortcut: 'Control+I Meta+I'
}, {
  id: 'link',
  word: 'link',
  icon: 'link',
  pressed: 'link',
  key: 'K',
  shortcut: 'Control+K Meta+K',
  popup: 'dialog'
}, {
  id: 'bulleted-list',
  word: 'bulleted-list',
  icon: 'format_list_bulleted',
  pressed: 'ul'
}, {
  id: 'numbered-list',
  word: 'numbered-list',
  icon: 'format_list_numbered',
  pressed: 'ol'
}, {
  id: 'quote',
  word: 'quote',
  icon: 'format_quote',
  pressed: 'blockquote'
}, {
  id: 'undo',
  word: 'undo',
  icon: 'undo',
  key: 'Z',
  shortcut: 'Control+Z Meta+Z',
  unavailable: state => !state.canUndo
}, {
  id: 'redo',
  word: 'redo',
  icon: 'redo',
  key: 'Shift+Z',
  shortcut: 'Control+Shift+Z Meta+Shift+Z Control+Y',
  unavailable: state => !state.canRedo
}]); // ------------------------------------------------------------ the caret
//
// A place in the editor as a count of units -- characters, line breaks and
// block starts (each leaf block after the first) -- so it survives the
// cleaner rewriting the surface: cleaning never changes the text, the
// breaks or the blocks a person sees.

function units(root, visit) {
  let first = true;

  const walk = node => {
    for (const child of node.childNodes) {
      if (child.nodeType === 3) {
        if (visit({
          kind: 'text',
          node: child,
          length: child.data.length
        }) === false) return false;
      } else if (child.nodeType === 1) {
        if (child.matches(LEAF_BLOCKS)) {
          if (!first && visit({
            kind: 'block',
            node: child
          }) === false) return false;
          first = false;
        }

        if (child.localName === 'br') {
          if (visit({
            kind: 'br',
            node: child
          }) === false) return false;
        } else if (walk(child) === false) return false;
      }
    }

    return true;
  };

  walk(root);
}

function offsetOf(root, container, offset) {
  if (!root.contains(container)) return null;
  const doc = root.ownerDocument;
  const point = doc.createRange();
  point.setStart(container, offset);
  point.collapse(true);
  let count = 0;
  units(root, unit => {
    if (unit.kind === 'text') {
      if (unit.node === container) {
        count += offset;
        return false;
      }

      if (point.comparePoint(unit.node, unit.length) <= 0) count += unit.length;else return false;
    } else if (unit.kind === 'br') {
      const parent = unit.node.parentNode;
      const index = Array.prototype.indexOf.call(parent.childNodes, unit.node);
      if (point.comparePoint(parent, index + 1) <= 0) count += 1;else return false;
    } else if (point.comparePoint(unit.node, 0) <= 0) {
      count += 1;
    } else {
      return false;
    }

    return true;
  });
  return count;
}

function pointAt(root, target) {
  let count = 0;
  let found = null;
  let last = null;
  units(root, unit => {
    if (unit.kind === 'text') {
      if (target <= count + unit.length) {
        found = [unit.node, target - count];
        return false;
      }

      count += unit.length;
      last = [unit.node, unit.length];
    } else if (unit.kind === 'br') {
      const parent = unit.node.parentNode;
      const index = Array.prototype.indexOf.call(parent.childNodes, unit.node);

      if (target === count) {
        found = [parent, index];
        return false;
      }

      count += 1;
      last = [parent, index + 1];
    } else {
      count += 1;
      last = [unit.node, 0];
    }

    return true;
  });
  return found || last || [root, 0];
} // ------------------------------------------------------------ the element


class SfRichText extends (0,_helpers_form_field__WEBPACK_IMPORTED_MODULE_3__.FormField)(RichTextElement) {
  static get props() {
    return { ...super.props,
      rootClass: {
        attribute: 'root-class',
        default: ''
      }
    };
  }

  constructor() {
    super();
    this._loaded = false;
    this._loadedAttribute = null;
    this._history = [];
    this._historyIndex = -1;
    this._lastTyping = 0;
    this._muted = false;
    this._dispatching = false;
    this._roving = 'paragraph';
    this._state = {
      canUndo: false,
      canRedo: false
    };
    this._lastSelection = null;
    this._committed = '';
    this._link = {
      value: '',
      error: '',
      existing: false,
      selection: null,
      pending: null,
      placement: 'bottom-start'
    };
    this._dragFromSelf = false;
  } // ---------------------------------------------------------- settings


  get size() {
    return (0,_component_field_size__WEBPACK_IMPORTED_MODULE_2__.fieldSize)(this.getAttribute('size') || '1', 'sf-rich-text');
  }

  get effectiveDisabled() {
    return Boolean(this.disabled || this.sfFormDisabled);
  }

  get editor() {
    return this.querySelector('.sf-rich-text-editor');
  }
  /** The value: the subset's HTML, "" when there is no text. */


  get value() {
    const editor = this.editor;
    if (editor && this._loaded) return (0,_js_rich_text_html_mjs__WEBPACK_IMPORTED_MODULE_5__.sanitizeRichText)(editor, {
      mode: 'value'
    });
    return (0,_js_rich_text_html_mjs__WEBPACK_IMPORTED_MODULE_5__.sanitizeRichText)(this.getAttribute('value') || '', {
      mode: 'value'
    });
  }

  set value(next) {
    const clean = (0,_js_rich_text_html_mjs__WEBPACK_IMPORTED_MODULE_5__.sanitizeRichText)(next === null || next === undefined ? '' : String(next), {
      mode: 'value'
    });
    if (next === null || next === undefined) this.removeAttribute('value');else this.setAttribute('value', clean);

    this._load(clean);

    this.sfSyncFormState();
  }

  focusDelegate() {
    return this.editor;
  } // ---------------------------------------------------------- form


  fieldValidity() {
    const missing = Boolean(this.required) && !this.effectiveDisabled && this.value === '';
    return {
      valueMissing: missing,
      message: missing ? this.sfWord('value-missing') : '',
      anchor: this.editor
    };
  } // form.reset(): the default back, without events.


  fieldReset() {
    this._load(this.getAttribute('value') || '');
  }

  fieldRestore(state) {
    if (typeof state === 'string') this.value = state;
  } // ---------------------------------------------------------- drawing


  templateContext() {
    const props = this.getPropsContext();
    return this.createTemplateContext({ ...props,
      size: this.size,
      appearance: this.appearance,
      // The form's disabled fieldset counts too, so the drawn state is not the
      // `disabled` getter's: it travels under its own name.
      fieldDisabled: this.effectiveDisabled,
      value: this.value,
      readonly: Boolean(this.readonly),
      required: Boolean(this.required),
      invalid: Boolean(this.invalid),
      rows: this.rows,
      maxRows: this.maxRows,
      tools: this.toolList(),
      state: this._state,
      roving: this._roving,
      linkValue: this._link.value,
      linkError: this._link.error,
      linkExisting: this._link.existing,
      linkPlacement: this._link.placement,
      ariaLabel: this.getAttribute('aria-label') || '',
      component: this
    });
  }

  get rows() {
    const value = Math.trunc(this.getNumberAttr('rows', 6));
    return value > 0 ? value : 6;
  }

  get maxRows() {
    const value = Math.trunc(this.getNumberAttr('maxRows', 0));
    return value > 0 ? Math.max(value, this.rows) : null;
  } // The shortcut in the tooltip names both keyboards, so the markup is the
  // same on every platform (and in the first-paint snapshot).


  toolList() {
    return TOOLS.map(tool => ({ ...tool,
      keys: tool.key ? `Ctrl+${tool.key} / \u2318${tool.key}` : ''
    }));
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_4__.renderRichTextTemplate)(this.templateContext());
  }

  onConnected() {
    const signal = this.sfScope;
    this.ownerDocument.addEventListener('selectionchange', () => this._onSelectionChange(), {
      signal
    });
    this.addEventListener('sf-popover-open', event => this._onLinkOpen(event), {
      signal
    });
    this.addEventListener('sf-popover-opened', () => this._onLinkOpened(), {
      signal
    });
    this.addEventListener('sf-popover-closed', event => this._onLinkClosed(event), {
      signal
    });
  }

  afterRender() {
    const editor = this.editor;
    if (!editor) return;
    if (editor.__sfRichText !== this) this._bindEditor(editor);
    const attribute = this.getAttribute('value') ?? '';
    if (!this._loaded || attribute !== this._loadedAttribute) this._load(attribute);

    this._syncEmpty();

    this.sfSyncFormState();
  }

  _bindEditor(editor) {
    editor.__sfRichText = this;
    const signal = this.sfScope;

    const on = (type, handler) => editor.addEventListener(type, handler, {
      signal
    });

    on('beforeinput', event => this._onBeforeInput(event));
    on('input', event => this._onInput(event));
    on('compositionend', () => this._afterTyping('insertCompositionText'));
    on('keydown', event => this._onKeydown(event));
    on('paste', event => this._onPaste(event));
    on('dragstart', () => {
      this._dragFromSelf = true;
    });
    on('dragend', () => {
      this._dragFromSelf = false;
    });
    on('drop', event => this._onDrop(event));
    on('focus', () => {
      try {
        this.ownerDocument.execCommand('defaultParagraphSeparator', false, 'p');
      } catch {// A browser without the command keeps its own; the cleaner wraps it.
      }
    });
  } // ---------------------------------------------------------- loading
  // Puts a value on the surface, cleaned, and starts the history there. Says
  // nothing: a value set from code, a reset and a restore are not edits.


  _load(html) {
    const editor = this.editor;
    if (!editor) return;
    editor.innerHTML = (0,_js_rich_text_html_mjs__WEBPACK_IMPORTED_MODULE_5__.sanitizeRichText)(String(html ?? ''), {
      mode: 'editor'
    });
    this._loaded = true;
    this._loadedAttribute = this.getAttribute('value') ?? '';
    this._history = [{
      html: editor.innerHTML,
      selection: null
    }];
    this._historyIndex = 0;
    this._lastTyping = 0;
    this._committed = this.value;

    this._syncEmpty();

    this._updateState();
  }

  _syncEmpty() {
    const editor = this.editor;
    if (!editor) return;
    const empty = editor.textContent === '' && editor.children.length <= 1 && !editor.querySelector('li, blockquote, h2, h3, h4');
    editor.toggleAttribute('data-empty', empty);
  } // ---------------------------------------------------------- selection


  _range() {
    const selection = this.ownerDocument.getSelection();
    const editor = this.editor;
    if (!selection?.rangeCount || !editor) return null;
    const range = selection.getRangeAt(0);
    return editor.contains(range.startContainer) && editor.contains(range.endContainer) ? range : null;
  }

  _saveSelection() {
    const range = this._range();

    const editor = this.editor;
    if (!range || !editor) return null;
    return {
      start: offsetOf(editor, range.startContainer, range.startOffset),
      end: offsetOf(editor, range.endContainer, range.endOffset)
    };
  }

  _restoreSelection(saved) {
    const editor = this.editor;
    if (!saved || !editor) return;
    const doc = this.ownerDocument;
    const range = doc.createRange();
    const [startNode, startOffset] = pointAt(editor, saved.start);
    const [endNode, endOffset] = pointAt(editor, saved.end ?? saved.start);
    range.setStart(startNode, startOffset);
    range.setEnd(endNode, endOffset);
    const selection = doc.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }

  _onSelectionChange() {
    if (!this._range()) return;
    this._lastSelection = this._saveSelection();

    this._updateState();
  }

  _within(node, selector) {
    const editor = this.editor;
    const element = node?.nodeType === 1 ? node : node?.parentElement;
    const found = element?.closest?.(selector);
    return found && found !== editor && editor?.contains(found) ? found : null;
  } // The node the selection's format is read from: where a caret stands, or
  // the first text a selection covers (a selection that starts at the end of
  // one text node is about the next).


  _startNode(range) {
    if (!range) return null;
    const container = range.startContainer;

    if (!range.collapsed) {
      const walker = this.ownerDocument.createTreeWalker(range.commonAncestorContainer, 4);
      let node = range.commonAncestorContainer.nodeType === 3 ? range.commonAncestorContainer : walker.nextNode();

      for (; node; node = walker.nextNode()) {
        if (!range.intersectsNode(node)) continue;
        if (node === range.startContainer && range.startOffset >= node.data.length) continue;
        if (node === range.endContainer && range.endOffset === 0) continue;
        if (node.data.length) return node;
      }
    }

    if (container.nodeType === 1) return container.childNodes[range.startOffset] || container;
    return container;
  }

  _updateState() {
    const range = this._range();

    const node = this._startNode(range);

    const command = name => {
      try {
        return Boolean(range?.collapsed && this.ownerDocument.queryCommandState?.(name));
      } catch {
        return false;
      }
    };

    const block = node ? this._within(node, 'p, h2, h3, h4, li') : null;
    const item = node ? this._within(node, 'li') : null;
    const next = {
      p: block?.localName === 'p',
      h2: block?.localName === 'h2',
      h3: block?.localName === 'h3',
      h4: block?.localName === 'h4',
      strong: Boolean(node && this._within(node, 'strong, b')) || command('bold'),
      em: Boolean(node && this._within(node, 'em, i')) || command('italic'),
      link: Boolean(node && this._within(node, 'a')),
      ul: item?.parentElement?.localName === 'ul',
      ol: item?.parentElement?.localName === 'ol',
      blockquote: Boolean(node && this._within(node, 'blockquote')),
      inList: Boolean(item),
      canUndo: this._historyIndex > 0,
      canRedo: this._historyIndex < this._history.length - 1
    };
    const changed = Object.keys(next).some(key => next[key] !== this._state[key]);
    this._state = next;
    if (changed) this.requestComponentUpdate('selection');
  } // ---------------------------------------------------------- cleaning
  // The surface through the cleaner; rewritten only when cleaning changed
  // it, with the caret kept in its place.


  _clean(selection = this._saveSelection()) {
    const editor = this.editor;
    if (!editor) return;
    const clean = (0,_js_rich_text_html_mjs__WEBPACK_IMPORTED_MODULE_5__.sanitizeRichText)(editor, {
      mode: 'editor'
    });

    if (clean !== editor.innerHTML) {
      editor.innerHTML = clean;
      if (selection) this._restoreSelection(selection);
    }

    this._syncEmpty();
  }

  _record({
    typing = false
  } = {}) {
    const editor = this.editor;
    if (!editor) return;
    const html = editor.innerHTML;

    const selection = this._saveSelection();

    const now = Date.now();
    const top = this._history[this._historyIndex];

    if (top && top.html === html) {
      top.selection = selection;
      return;
    }

    const grouped = typing && this._lastTyping && now - this._lastTyping < TYPING_GROUP_MS && this._historyIndex > 0 && this._historyIndex === this._history.length - 1;

    if (grouped) {
      this._history[this._historyIndex] = {
        html,
        selection
      };
    } else {
      this._history.splice(this._historyIndex + 1);

      this._history.push({
        html,
        selection
      });

      if (this._history.length > HISTORY_LIMIT) this._history.shift();
      this._historyIndex = this._history.length - 1;
    }

    this._lastTyping = typing ? now : 0;
  }

  _say(inputType) {
    const editor = this.editor;
    if (!editor) return;
    this._dispatching = true;

    try {
      const InputEventClass = globalThis.InputEvent || globalThis.Event;
      editor.dispatchEvent(new InputEventClass('input', {
        bubbles: true,
        composed: true,
        inputType
      }));
    } finally {
      this._dispatching = false;
    }
  } // An edit the component makes: run it on the person's selection, clean the
  // result, keep the caret, record it and say input once.


  _edit(change, inputType, {
    selection = 'before'
  } = {}) {
    const editor = this.editor;
    if (!editor || this.effectiveDisabled || this.readonly) return false;
    const doc = this.ownerDocument;
    const returnTo = doc.activeElement && doc.activeElement !== editor && this.contains(doc.activeElement) ? doc.activeElement : null; // From the toolbar by the keyboard: the text takes focus for the command
    // and the selection the person left in it comes back.

    if (doc.activeElement !== editor) {
      editor.focus({
        preventScroll: true
      });
      if (this._lastSelection) this._restoreSelection(this._lastSelection);
    }

    if (!this._range()) this._restoreSelection(this._lastSelection ?? {
      start: 0,
      end: 0
    });
    const before = editor.innerHTML;
    const saved = selection === 'before' ? this._saveSelection() : null;
    this._muted = true;

    try {
      change();
    } catch (error) {
      this.reportComponentError(error, `edit ${inputType}`);
    } finally {
      this._muted = false;
    }

    this._clean(selection === 'before' ? saved : this._saveSelection());

    if (selection === 'before' && saved) this._restoreSelection(saved);
    this._lastSelection = this._saveSelection();

    if (editor.innerHTML !== before) {
      this._record();

      this._say(inputType);
    }

    this._updateState();

    returnTo?.focus?.({
      preventScroll: true
    });
    return true;
  } // ---------------------------------------------------------- typing


  _onBeforeInput(event) {
    if (this._muted) return;

    switch (event.inputType) {
      case 'historyUndo':
        event.preventDefault();
        this.undo();
        return;

      case 'historyRedo':
        event.preventDefault();
        this.redo();
        return;

      case 'formatBold':
        event.preventDefault();
        this.runCommand('bold');
        return;

      case 'formatItalic':
        event.preventDefault();
        this.runCommand('italic');
        return;

      default:
        // No other format is in the subset: underline, strike, colours,
        // alignment and indent are refused rather than cleaned away later.
        if (String(event.inputType).startsWith('format')) event.preventDefault();
    }
  }

  _onInput(event) {
    // The browser's own input while a command runs: the command says input
    // once, after cleaning.
    if (this._muted) {
      event.stopImmediatePropagation();
      return;
    }

    if (this._dispatching) return;
    if (event.isComposing) return;

    this._afterTyping(event.inputType);
  }

  _afterTyping(inputType = '') {
    this._clean();

    this._record({
      typing: /^(insertText|insertCompositionText|deleteContentBackward|deleteContentForward)$/u.test(inputType)
    });

    this._lastSelection = this._saveSelection();

    this._updateState();
  }

  _onKeydown(event) {
    if (!(event.ctrlKey || event.metaKey) || event.altKey) return;
    const key = String(event.key || '').toLowerCase();

    const run = command => {
      event.preventDefault();
      this.runCommand(command);
    };

    if (key === 'b' && !event.shiftKey) run('bold');else if (key === 'i' && !event.shiftKey) run('italic');else if (key === 'k' && !event.shiftKey) run('link');else if (key === 'z' && event.shiftKey) run('redo');else if (key === 'z') run('undo');else if (key === 'y') run('redo');
  } // ---------------------------------------------------------- paste and drop


  _cleanTransfer(data) {
    const html = data?.getData?.('text/html') || '';
    if (html) return (0,_js_rich_text_html_mjs__WEBPACK_IMPORTED_MODULE_5__.sanitizeRichText)(html, {
      mode: 'value'
    });
    return (0,_js_rich_text_html_mjs__WEBPACK_IMPORTED_MODULE_5__.richTextFromPlainText)(data?.getData?.('text/plain') || '', {
      mode: 'value'
    });
  } // Cleaned HTML in place of the selection: the first paragraph joins the
  // text at the caret, what follows stands as blocks (the cleaner splits the
  // paragraph around them, so the text after the caret follows the last).


  _insertClean(clean, inputType) {
    if (!clean) return;

    this._edit(() => {
      const range = this._range();

      if (!range) return;
      const doc = this.ownerDocument;
      range.deleteContents(); // An empty line's <br> is the caret's place holder, not content.

      const block = this._within(range.startContainer, 'p, h2, h3, h4, li');

      if (block && block.textContent === '' && !block.querySelector('ul, ol')) {
        block.replaceChildren();
        range.setStart(block, 0);
        range.collapse(true);
      }

      const template = doc.createElement('template'); // The string is the subset's own output: nothing in it runs or loads.

      template.innerHTML = clean;
      const nodes = [...template.content.childNodes];
      const fragment = doc.createDocumentFragment();
      nodes.forEach((node, index) => {
        if (index === 0 && node.localName === 'p') fragment.append(...node.childNodes);else fragment.append(node);
      });
      const last = fragment.lastChild;
      if (!last) return;
      range.insertNode(fragment);
      const after = doc.createRange();
      after.setStartAfter(last);
      after.collapse(true);
      const selection = doc.getSelection();
      selection.removeAllRanges();
      selection.addRange(after);
    }, inputType, {
      selection: 'after'
    });
  }

  _onPaste(event) {
    event.preventDefault();
    if (this.effectiveDisabled || this.readonly) return;

    this._insertClean(this._cleanTransfer(event.clipboardData), 'insertFromPaste');
  }

  _onDrop(event) {
    // A move inside the editor is the browser's; its result is cleaned as
    // typing is.
    if (this._dragFromSelf) return;
    event.preventDefault();
    if (this.effectiveDisabled || this.readonly) return;
    const doc = this.ownerDocument;
    const editor = this.editor;
    let range = null;
    if (doc.caretRangeFromPoint) range = doc.caretRangeFromPoint(event.clientX, event.clientY);else if (doc.caretPositionFromPoint) {
      const position = doc.caretPositionFromPoint(event.clientX, event.clientY);

      if (position) {
        range = doc.createRange();
        range.setStart(position.offsetNode, position.offset);
        range.collapse(true);
      }
    }
    editor.focus({
      preventScroll: true
    });

    if (range && editor.contains(range.startContainer)) {
      const selection = doc.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }

    this._insertClean(this._cleanTransfer(event.dataTransfer), 'insertFromDrop');
  } // ---------------------------------------------------------- commands

  /**
   * Runs a toolbar command on the current selection: paragraph, heading-2,
   * heading-3, heading-4, bold, italic, link, bulleted-list, numbered-list,
   * quote, undo, redo. Answers whether it ran.
   */


  runCommand(id) {
    if (this.effectiveDisabled || this.readonly) return false;
    if (BLOCK_TAGS[id]) return this._edit(() => this._setBlock(BLOCK_TAGS[id]), 'formatBlock');
    if (id === 'bold') return this._edit(() => this._toggleMark('bold', 'strong'), 'formatBold');
    if (id === 'italic') return this._edit(() => this._toggleMark('italic', 'em'), 'formatItalic');
    if (id === 'bulleted-list') return this._edit(() => this._toggleList('ul'), 'insertUnorderedList');
    if (id === 'numbered-list') return this._edit(() => this._toggleList('ol'), 'insertOrderedList');
    if (id === 'quote') return this._edit(() => this._toggleQuote(), 'formatBlock');
    if (id === 'undo') return this.undo();
    if (id === 'redo') return this.redo();
    if (id === 'link') return this.openLink();
    return false;
  }

  undo() {
    if (this._historyIndex <= 0) return false;
    this._historyIndex -= 1;

    this._applyHistory('historyUndo');

    return true;
  }

  redo() {
    if (this._historyIndex >= this._history.length - 1) return false;
    this._historyIndex += 1;

    this._applyHistory('historyRedo');

    return true;
  }

  _applyHistory(inputType) {
    const editor = this.editor;
    const entry = this._history[this._historyIndex];
    if (!editor || !entry) return;
    editor.innerHTML = entry.html;
    if (this.ownerDocument.activeElement !== editor && !this.contains(this.ownerDocument.activeElement)) editor.focus({
      preventScroll: true
    });
    if (entry.selection) this._restoreSelection(entry.selection);
    this._lastTyping = 0;
    this._lastSelection = entry.selection;

    this._syncEmpty();

    this._say(inputType);

    this._updateState();
  }

  _selectedBlocks() {
    const editor = this.editor;

    const range = this._range();

    if (!editor || !range) return [];
    const all = [...editor.querySelectorAll('p, h2, h3, h4, li')].filter(block => range.intersectsNode(block));
    return all.filter(block => !all.some(other => other !== block && block.contains(other)));
  }

  _setBlock(tag) {
    const blocks = this._selectedBlocks().filter(block => block.localName !== 'li');

    const target = tag !== 'p' && blocks.length && blocks.every(block => block.localName === tag) ? 'p' : tag;

    for (const block of blocks) {
      if (block.localName === target) continue;
      const next = this.ownerDocument.createElement(target);
      next.append(...block.childNodes);
      block.replaceWith(next);
    }
  }

  _toggleMark(command, tag) {
    const doc = this.ownerDocument;
    let done = false;

    try {
      done = doc.execCommand(command, false);
    } catch {
      done = false;
    }

    if (done) return; // Without the command: wrap the selection, or unwrap the mark it is in.

    const range = this._range();

    if (!range || range.collapsed) return;

    const startMark = this._within(range.startContainer, `${tag}, ${tag === 'strong' ? 'b' : 'i'}`);

    const endMark = this._within(range.endContainer, `${tag}, ${tag === 'strong' ? 'b' : 'i'}`);

    if (startMark && startMark === endMark) {
      startMark.replaceWith(...startMark.childNodes);
      return;
    }

    const fragment = range.extractContents();
    fragment.querySelectorAll(`${tag}, ${tag === 'strong' ? 'b' : 'i'}`).forEach(mark => mark.replaceWith(...mark.childNodes));
    const mark = doc.createElement(tag);
    mark.append(fragment);
    range.insertNode(mark);
  }

  _toggleList(type) {
    const doc = this.ownerDocument;

    const blocks = this._selectedBlocks();

    if (!blocks.length) return;
    const items = blocks.filter(block => block.localName === 'li');

    if (items.length === blocks.length && items.every(item => item.parentElement?.localName === type)) {
      // Off: the items become paragraphs, the list split around them.
      for (const item of items) {
        const list = item.parentElement;
        const after = [];

        for (let next = item.nextSibling; next; next = next.nextSibling) after.push(next);

        if (after.length) {
          const tail = doc.createElement(list.localName);
          tail.append(...after);
          list.after(tail);
        }

        const paragraph = doc.createElement('p');
        const nested = [...item.children].filter(child => child.localName === 'ul' || child.localName === 'ol');
        nested.forEach(child => child.remove());
        paragraph.append(...item.childNodes);
        list.after(paragraph, ...nested);
        item.remove();
        if (!list.children.length) list.remove();
      }

      return;
    }

    if (items.length === blocks.length) {
      // The other kind of list: the lists change kind.
      for (const list of new Set(items.map(item => item.parentElement))) {
        if (list.localName === type) continue;
        const next = doc.createElement(type);
        next.append(...list.childNodes);
        list.replaceWith(next);
      }

      return;
    }

    for (const block of blocks) {
      if (block.localName === 'li') continue;
      const item = doc.createElement('li');
      item.append(...block.childNodes);
      const previous = block.previousElementSibling;

      if (previous?.localName === type) {
        previous.append(item);
      } else {
        const list = doc.createElement(type);
        list.append(item);
        block.before(list);
      }

      block.remove();
    }
  }

  _toggleQuote() {
    const editor = this.editor;

    const blocks = this._selectedBlocks();

    if (!blocks.length) return;
    const quotes = blocks.map(block => this._within(block, 'blockquote'));

    if (quotes.every(Boolean)) {
      for (const quote of new Set(quotes)) quote.replaceWith(...quote.childNodes);

      return;
    }

    const top = node => {
      let current = node;

      while (current.parentElement && current.parentElement !== editor) current = current.parentElement;

      return current;
    };

    const first = top(blocks[0]);
    const last = top(blocks[blocks.length - 1]);
    const quote = this.ownerDocument.createElement('blockquote');
    first.before(quote);

    for (let node = first; node;) {
      const next = node.nextSibling;
      quote.append(node);
      if (node === last) break;
      node = next;
    }
  } // ---------------------------------------------------------- links


  _popover() {
    return this.querySelector('.sf-rich-text-link');
  }
  /** Opens the link editor on the selection (Mod+K, the link button). */


  openLink() {
    if (this.effectiveDisabled || this.readonly) return false;

    const popover = this._popover();

    if (!popover?.show) return false;
    popover.show();
    return true;
  }

  _onLinkOpen(event) {
    if (event.target !== this._popover()) return;

    if (this.effectiveDisabled || this.readonly) {
      event.preventDefault();
      return;
    }

    if (!this._range() && this._lastSelection) {
      this.editor?.focus({
        preventScroll: true
      });

      this._restoreSelection(this._lastSelection);
    }

    const range = this._range();

    const anchor = range ? this._within(range.startContainer, 'a') : null; // The editor hangs from the side of the button with room for it: the
    // popover places, it does not move a surface back into the window.

    const popover = this._popover();

    const button = popover?.querySelector('[data-sf-tool="link"]');
    const box = button?.getBoundingClientRect();
    const width = this.ownerDocument.documentElement.clientWidth;
    const room = parseFloat(globalThis.getComputedStyle?.(this.ownerDocument.documentElement).fontSize || '16') * 20;
    const placement = box && box.left + room > width && box.right - room >= 0 ? 'bottom-end' : 'bottom-start';
    popover?.setAttribute('placement', placement);
    this._link = {
      value: anchor?.getAttribute('href') || '',
      error: '',
      existing: Boolean(anchor),
      selection: this._saveSelection() ?? this._lastSelection,
      pending: null,
      placement
    };
    this.requestComponentUpdate('link');
  }

  _onLinkOpened() {
    // After the popover shows its content and this element drew the field.
    requestAnimationFrame(() => {
      const input = this.querySelector('.sf-rich-text-link-input');
      const control = input?.querySelector('input') || input;
      control?.focus?.();
      control?.select?.();
    });
  }

  _linkInputValue() {
    const input = this.querySelector('.sf-rich-text-link-input');
    const control = input?.querySelector('input');
    return String(control?.value ?? input?.value ?? '');
  }

  applyLinkFromPanel() {
    const raw = this._linkInputValue().trim();

    const href = (0,_js_rich_text_html_mjs__WEBPACK_IMPORTED_MODULE_5__.richTextHref)(raw);

    if (!href) {
      this._link = { ...this._link,
        value: raw,
        error: this.sfWord('link-invalid')
      };
      this.requestComponentUpdate('link');
      return false;
    }

    this._link = { ...this._link,
      value: href,
      error: '',
      pending: {
        href
      }
    };
    this._popover()?.close?.({
      reason: 'api'
    });
    return true;
  }

  removeLinkFromPanel() {
    this._link = { ...this._link,
      error: '',
      pending: {
        remove: true
      }
    };
    this._popover()?.close?.({
      reason: 'api'
    });
    return true;
  }

  onLinkPanelEvent(event) {
    // The address field's own input and change are not the field's.
    event.stopPropagation();

    if (event.type === 'input' && this._link.error) {
      this._link = { ...this._link,
        error: ''
      };
      this.requestComponentUpdate('link');
    }
  }

  onLinkPanelKeydown(event) {
    event.stopPropagation();

    if (event.key === 'Enter' && !event.isComposing) {
      event.preventDefault();
      this.applyLinkFromPanel();
    }
  }

  _onLinkClosed(event) {
    if (event.target !== this._popover()) return;
    const reason = event.detail?.reason;
    const {
      pending,
      selection
    } = this._link;
    this._link = {
      value: '',
      error: '',
      existing: false,
      selection: null,
      pending: null,
      placement: this._link.placement
    };
    this.requestComponentUpdate('link'); // A press outside belongs to wherever it landed.

    if (reason === 'outside') return; // The popover gives focus back to its trigger as it closes; the person
    // goes on typing, so the caret goes back to the text after that.

    setTimeout(() => {
      const editor = this.editor;
      if (!editor) return;
      editor.focus({
        preventScroll: true
      });
      if (selection) this._restoreSelection(selection);
      if (pending?.href) this._edit(() => this._setLink(pending.href), 'insertLink', {
        selection: 'after'
      });else if (pending?.remove) this._edit(() => this._removeLink(), 'insertLink');
    }, 0);
  }

  _setLink(href) {
    const doc = this.ownerDocument;

    const range = this._range();

    if (!range) return;

    const anchor = this._within(range.startContainer, 'a');

    if (anchor) {
      anchor.setAttribute('href', href);
      const after = doc.createRange();
      after.selectNodeContents(anchor);
      after.collapse(false);
      doc.getSelection().removeAllRanges();
      doc.getSelection().addRange(after);
      return;
    }

    const link = doc.createElement('a');
    link.setAttribute('href', href);

    if (range.collapsed) {
      link.textContent = href.replace(/^(mailto|tel):/u, '');
    } else {
      const fragment = range.extractContents();
      fragment.querySelectorAll('a').forEach(inner => inner.replaceWith(...inner.childNodes));
      link.append(fragment);
    }

    range.insertNode(link);
    const after = doc.createRange();
    after.setStartAfter(link);
    after.collapse(true);
    doc.getSelection().removeAllRanges();
    doc.getSelection().addRange(after);
  }

  _removeLink() {
    const range = this._range();

    const anchor = range ? this._within(range.startContainer, 'a') : null;
    if (anchor) anchor.replaceWith(...anchor.childNodes);
  } // ---------------------------------------------------------- toolbar


  _tools() {
    return [...this.querySelectorAll('.sf-rich-text-toolbar button.sf-rich-text-tool:not([disabled])')];
  }

  _setRoving(button) {
    if (!button) return;
    this._roving = button.dataset.sfTool;

    for (const other of this.querySelectorAll('.sf-rich-text-toolbar button.sf-rich-text-tool')) {
      other.setAttribute('tabindex', other === button ? '0' : '-1');
    }
  }

  onToolbarKeydown(event) {
    const button = event.target?.closest?.('button.sf-rich-text-tool');
    if (!button) return;

    const tools = this._tools();

    const index = tools.indexOf(button);
    if (index < 0) return;
    let next = null;
    if (event.key === 'ArrowRight') next = tools[(index + 1) % tools.length];else if (event.key === 'ArrowLeft') next = tools[(index - 1 + tools.length) % tools.length];else if (event.key === 'Home') next = tools[0];else if (event.key === 'End') next = tools[tools.length - 1];
    if (!next) return;
    event.preventDefault();

    this._setRoving(next);

    next.focus();
  }

  onToolbarFocusIn(event) {
    const button = event.target?.closest?.('button.sf-rich-text-tool');
    if (button) this._setRoving(button);
  } // A press on a tool keeps the caret and the selection in the text.


  onToolbarMouseDown(event) {
    if (event.target?.closest?.('button.sf-rich-text-tool')) event.preventDefault();
  }

  onToolbarClick(event) {
    const button = event.target?.closest?.('button.sf-rich-text-tool');
    if (!button || button.disabled) return;
    const id = button.dataset.sfTool;

    this._setRoving(button); // The link button is the popover's trigger: the popover opens itself.


    if (id === 'link') return;
    if (button.getAttribute('aria-disabled') === 'true') return;
    this.runCommand(id);
  } // ---------------------------------------------------------- focus and change


  onRootPointerDown(event) {
    if (event.target?.closest?.('.sf-rich-text-editor')) this.querySelector('.sf-rich-text')?.classList.add('sf-rich-text--pointer-focus');
  } // Leaving the field with a changed value is change, once, as a textarea
  // says it; moving between the toolbar, the link editor and the text is not.


  onRootFocusOut(event) {
    const next = event.relatedTarget;
    if (next && this.contains(next)) return;
    this.querySelector('.sf-rich-text')?.classList.remove('sf-rich-text--pointer-focus');
    const value = this.value;
    if (value === this._committed) return;
    this._committed = value;
    this.editor?.dispatchEvent(new Event('change', {
      bubbles: true,
      composed: true
    }));
  }

}

SfRichText.define('sf-rich-text');
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SfRichText);
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "6c93a598699b"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderRichTextTemplate: () => (/* binding */ renderRichTextTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var _component_field_contract__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("e138a730fd7c");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, _component_field_contract__WEBPACK_IMPORTED_MODULE_1__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, _component_field_contract__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);

 // The field: a label row, one frame holding the toolbar over the editing
// surface, and the hint or error line -- sf-textarea's parts, in its places.
//
// The toolbar is the class markup of icon buttons (.sf-icon-button, the
// sheet sf-dropdown and the inherited-value reset draw with), so the
// component owns their tabindex, aria-pressed and disabled outright: a roving
// toolbar has to, and an sf-icon-button host copies its attributes onto its
// own button on its own schedule. A tool with no glyph in the icon font --
// the four block levels -- holds its short text instead, in the same square.
// The link editor is an sf-popover whose
// trigger is the link button and whose content holds an sf-input and two
// sf-button.
//
// The editing surface carries no binding inside: lit draws the element and
// never its children, which are the person's text and are written only by
// the component, always through the subset's cleaner.
// Icon button size one step below the field's, so the toolbar sits inside the
// frame on the same ladder.

const BUTTON_SIZE = {
  '1/2': '1/3',
  '1': '1/2',
  '2': '1'
};

function toolButton(context, tool) {
  const {
    component,
    buttonSize,
    fieldDisabled: disabled,
    readonly,
    state,
    roving
  } = context;
  const pressed = tool.pressed === undefined ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : String(Boolean(state[tool.pressed])); // Unavailable (undo with nothing to undo, a heading in a list): said and
  // greyed, still reached by the arrows; the whole toolbar is disabled with
  // the field.

  const unavailable = Boolean(tool.unavailable?.(state));
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<button
      type="button"
      class="sf-rich-text-tool sf-icon-button sf-icon-button--icon sf-icon-button--link sf-icon-button--on-surface sf-icon-button--size-${buttonSize} flex items-cross-center"
      data-sf-tool=${tool.id}
      tabindex=${roving === tool.id ? '0' : '-1'}
      aria-label=${component.sfWord(tool.word)}
      title=${tool.keys ? `${component.sfWord(tool.word)} (${tool.keys})` : component.sfWord(tool.word)}
      aria-pressed=${pressed}
      aria-keyshortcuts=${tool.shortcut || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      aria-haspopup=${tool.popup || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      aria-disabled=${unavailable ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      ?disabled=${disabled || readonly}
    >${tool.icon ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class="sf-icon" aria-hidden="true">${tool.icon}</i>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-rich-text-tool-text" aria-hidden="true">${tool.text}</span>`}</button>`;
}

function renderRichTextTemplate(context) {
  const {
    component,
    size,
    appearance,
    label,
    required,
    hint,
    errorMessage,
    invalid,
    fieldDisabled: disabled,
    readonly,
    placeholder,
    tools,
    linkValue,
    linkError,
    linkExisting,
    rows,
    maxRows,
    ariaLabel
  } = context;
  const field = (0,_component_field_contract__WEBPACK_IMPORTED_MODULE_1__.createFieldContract)(component, {
    prefix: 'sf-rich-text',
    required,
    invalid,
    hint,
    errorMessage
  });
  const labelId = `${field.base}--label`;
  const toolbarId = `${field.base}--toolbar`;
  const linkId = `${field.base}--link`;
  const message = field.invalid && errorMessage ? errorMessage : hint;
  const buttonSize = BUTTON_SIZE[size] || '1/2';
  const rootClasses = ['sf-rich-text', `sf-rich-text--size-${size}`, `sf-rich-text--${appearance}`, field.invalid ? 'error' : '', disabled ? 'sf-rich-text--disabled' : '', readonly ? 'sf-rich-text--readonly' : '', 'flex', 'flex-col', context.rootClass].filter(Boolean);
  const toolContext = { ...context,
    buttonSize
  };

  const group = ids => tools.filter(tool => ids.includes(tool.id)).map(tool => {
    if (tool.id !== 'link') return toolButton(toolContext, tool); // The link button opens the link editor: the popover's trigger.

    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-popover class="sf-rich-text-link" placement=${context.linkPlacement || 'bottom-start'} width="20rem" label=${component.sfWord('link-dialog')}>
        <span slot="trigger" class="sf-rich-text-link-trigger">${toolButton(toolContext, tool)}</span>
        <div slot="content" class="sf-rich-text-link-panel flex flex-col" id=${linkId}
          @input=${event => component.onLinkPanelEvent(event)}
          @change=${event => component.onLinkPanelEvent(event)}
          @keydown=${event => component.onLinkPanelKeydown(event)}>
          <sf-input class="sf-rich-text-link-input" size=${size === '2' ? '1' : size} label=${component.sfWord('link-address')}
            hint=${component.sfWord('link-hint')} .value=${linkValue} ?invalid=${Boolean(linkError)}
            error-message=${linkError || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} autocomplete="url" inputmode="url"></sf-input>
          <div class="sf-rich-text-link-actions flex flex-wrap items-cross-center">
            <sf-button class="sf-rich-text-link-apply" size=${buttonSize} @click=${() => component.applyLinkFromPanel()}>${component.sfWord('link-apply')}</sf-button>
            ${linkExisting ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button class="sf-rich-text-link-remove" size=${buttonSize} appearance="outline" @click=${() => component.removeLinkFromPanel()}>${component.sfWord('link-remove')}</sf-button>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          </div>
        </div>
      </sf-popover>`;
  });

  const separator = (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-rich-text-separator" aria-hidden="true"></span>`;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div class=${rootClasses.join(' ')} style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      @pointerdown=${event => component.onRootPointerDown(event)}
      @focusout=${event => component.onRootFocusOut(event)}>
      ${label ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-rich-text-label flex" id=${labelId} @click=${() => component.focus()}>
            <span class="sf-rich-text-text">${label}</span>
            ${required ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-rich-text-required" aria-hidden="true">*</span>` : ''}
          </span>` : ''}
      <div class="sf-rich-text-frame flex flex-col"
        style=${`--sf-rich-text--rows: ${rows};${maxRows ? ` --sf-rich-text--max-rows: ${maxRows};` : ''}`}>
        <div class="sf-rich-text-toolbar flex flex-wrap items-cross-center" role="toolbar" id=${toolbarId}
          aria-label=${component.sfWord('toolbar')} aria-controls=${field.controlId}
          aria-disabled=${disabled || readonly ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          @keydown=${event => component.onToolbarKeydown(event)}
          @mousedown=${event => component.onToolbarMouseDown(event)}
          @click=${event => component.onToolbarClick(event)}
          @focusin=${event => component.onToolbarFocusIn(event)}>
          <div class="sf-rich-text-group flex items-cross-center" role="group">${group(['paragraph', 'heading-2', 'heading-3', 'heading-4'])}</div>
          ${separator}
          <div class="sf-rich-text-group flex items-cross-center" role="group">${group(['bold', 'italic', 'link'])}</div>
          ${separator}
          <div class="sf-rich-text-group flex items-cross-center" role="group">${group(['bulleted-list', 'numbered-list', 'quote'])}</div>
          ${separator}
          <div class="sf-rich-text-group flex items-cross-center" role="group">${group(['undo', 'redo'])}</div>
        </div>
        <div
          class="sf-rich-text-editor"
          id=${field.controlId}
          role="textbox"
          aria-multiline="true"
          contenteditable=${disabled || readonly ? 'false' : 'true'}
          tabindex=${disabled ? '-1' : '0'}
          spellcheck="true"
          translate="no"
          aria-labelledby=${label ? labelId : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          aria-label=${!label && ariaLabel ? ariaLabel : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          aria-placeholder=${placeholder || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          data-placeholder=${placeholder || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          aria-required=${field.required ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          aria-readonly=${readonly ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          aria-disabled=${disabled ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          aria-invalid=${field.invalid ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          aria-describedby=${message ? field.messageId : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          aria-errormessage=${field.invalid && errorMessage ? field.messageId : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        ></div>
      </div>
      ${message ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span id=${field.messageId} class="sf-rich-text-hint-text-wrap"
            data-field-message=${field.invalid && errorMessage ? 'error' : 'hint'}>${message}</span>` : ''}
    </div>
  `;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "b59592d16c56"
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

/***/ "deb1a4d61565"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("smart-base", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("smart-base", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "9965a2e69ea0"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RICH_TEXT_BLOCKS: () => (/* binding */ RICH_TEXT_BLOCKS),
/* harmony export */   RICH_TEXT_ELEMENTS: () => (/* binding */ RICH_TEXT_ELEMENTS),
/* harmony export */   RICH_TEXT_SCHEMES: () => (/* binding */ RICH_TEXT_SCHEMES),
/* harmony export */   cleanTree: () => (/* binding */ cleanTree),
/* harmony export */   decodeEntities: () => (/* binding */ decodeEntities),
/* harmony export */   parseHtml: () => (/* binding */ parseHtml),
/* harmony export */   plainText: () => (/* binding */ plainText),
/* harmony export */   richTextFromPlainText: () => (/* binding */ richTextFromPlainText),
/* harmony export */   richTextHref: () => (/* binding */ richTextHref),
/* harmony export */   sanitizeRichText: () => (/* binding */ sanitizeRichText),
/* harmony export */   serialize: () => (/* binding */ serialize),
/* harmony export */   treeFromDom: () => (/* binding */ treeFromDom)
/* harmony export */ });
// The HTML subset of sf-rich-text: what the value may hold, and how anything
// else is brought into it. Larena stores page text as a property of type
// html@1, and this module is that type's rule in the browser: the editor
// cleans the value it is given, every paste and drop, and its own DOM after
// every edit and command, through the one function here.
//
// The subset:
//
//   p  h2  h3  h4  strong  em  a[href]  ul  ol  li  blockquote  br
//
// - no attribute is kept but href on <a>;
// - href is kept for https:, mailto: and tel: URLs and for a site path
//   ("/docs/a"), judged after removing control characters and white space, so
//   "java\tscript:" does not pass; "//host" and "/\host" leave the site and
//   are not kept; a link whose href is not kept becomes its text;
// - script, style and the other containers whose content is not text for a
//   reader (DROPPED) go with their content; any other element is unwrapped,
//   and its text stays; one that stands as a block (div, section, table, a
//   cell, h1, pre) still separates its text from its neighbours';
// - b and i are strong and em, and a span whose style is bold or italic is
//   too (a word processor's paste); a b whose style says normal is not;
// - text outside a block is wrapped in p, a block inside a paragraph splits
//   it, a block inside a list item becomes a line of it (br), a list holds
//   only items, adjacent lists of one kind are one list;
// - the value has no empty block, no line break at a block's edge and no
//   white space between blocks; an editor with no text is "".
//
// Two readers feed one cleaner: `treeFromDom` reads a DOM (the editor, or a
// paste parsed by the browser in an inert <template>), `parseHtml` reads a
// string without a DOM (a server, a test). Neither ever assigns the input to
// a live element. What comes out is written by `serialize` from the cleaned
// model, every text escaped, so it holds nothing the subset does not allow
// whatever the reader understood.
//
// No imports and no state: the element and the contract tests use the same
// functions.

const RICH_TEXT_ELEMENTS = Object.freeze(['p', 'h2', 'h3', 'h4', 'strong', 'em', 'a', 'ul', 'ol', 'li', 'blockquote', 'br']);
const RICH_TEXT_BLOCKS = Object.freeze(['p', 'h2', 'h3', 'h4']);
const RICH_TEXT_SCHEMES = Object.freeze(['https:', 'mailto:', 'tel:']);

// Dropped with everything inside: their content is code, a document's head,
// a drawing, or a control's own data, not text for a reader.
const DROPPED = new Set([
  'script', 'style', 'template', 'head', 'title', 'meta', 'link', 'base', 'noscript',
  'iframe', 'frame', 'frameset', 'noembed', 'noframes', 'object', 'embed', 'applet',
  'svg', 'math', 'canvas', 'video', 'audio', 'img', 'picture', 'source', 'track',
  'input', 'select', 'textarea', 'xmp', 'plaintext',
]);

// Elements off the subset that stand as blocks: unwrapped, but their text is
// not run together with the text around them.
const BREAKING = new Set([
  'address', 'article', 'aside', 'body', 'caption', 'center', 'dd', 'details', 'dialog', 'dir', 'div',
  'dl', 'dt', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h5', 'h6', 'header',
  'hgroup', 'hr', 'html', 'legend', 'listing', 'main', 'menu', 'nav', 'optgroup', 'option', 'pre',
  'section', 'summary', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr',
]);

const LISTS = new Set(['ul', 'ol']);
const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
// Raw text: what follows the start tag up to its end tag is not markup.
const RAW = new Set(['script', 'style', 'textarea', 'title', 'xmp', 'iframe', 'noembed', 'noframes', 'noscript']);
// Where an implied </p> stops looking for the paragraph (the parser's button scope).
const P_SCOPE = new Set(['td', 'th', 'table', 'caption', 'button']);

// C0 controls, DEL and C1 controls: a browser ignores them inside a scheme.
// eslint-disable-next-line no-control-regex -- matching control characters is the point
const CONTROLS = /[\u0000-\u001f\u007f-\u009f]/gu;
// ...and white space, which a browser also skips around and inside a scheme.
// eslint-disable-next-line no-control-regex -- matching control characters is the point
const CONTROLS_AND_SPACE = /[\u0000- \u007f-\u009f\u00a0\u1680\u2000-\u200b\u2028\u2029\u202f\u205f\u3000\ufeff]/gu;
const HREF_MAX = 2048;

/**
 * The href sf-rich-text keeps, or null: https:, mailto: and tel: URLs and a
 * path on the site ("/docs/a", "/docs?q=1#a"). "//host", "/\host", http:,
 * javascript:, data: and anything else are not kept.
 * @param {unknown} value
 * @returns {string|null}
 */
function richTextHref(value) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > HREF_MAX) return null;
  const compact = trimmed.replace(CONTROLS_AND_SPACE, '');
  if (!compact) return null;
  if (compact.startsWith('/')) {
    // A site path, but not "//host" or "/\host", which leave the site.
    if (/^\/[/\\]/u.test(compact)) return null;
    const path = trimmed.replace(CONTROLS, '');
    return /^\/[/\\]/u.test(path) ? null : path;
  }
  const scheme = /^([a-z][a-z0-9+.-]*):/iu.exec(compact)?.[1]?.toLowerCase();
  if (!scheme || !RICH_TEXT_SCHEMES.includes(`${scheme}:`)) return null;
  let url;
  try {
    url = new globalThis.URL(trimmed.replace(CONTROLS, ''));
  } catch {
    return null;
  }
  if (url.protocol !== `${scheme}:`) return null;
  if (url.protocol === 'https:' && !url.hostname) return null;
  if (url.protocol !== 'https:' && url.href.length <= url.protocol.length) return null;
  return url.href;
}

// ---------------------------------------------------------------- entities

const NAMED = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: '\u00a0', shy: '\u00ad',
  hellip: '\u2026', mdash: '\u2014', ndash: '\u2013', minus: '\u2212', laquo: '\u00ab', raquo: '\u00bb',
  lsquo: '\u2018', rsquo: '\u2019', sbquo: '\u201a', ldquo: '\u201c', rdquo: '\u201d', bdquo: '\u201e',
  bull: '\u2022', middot: '\u00b7', copy: '\u00a9', reg: '\u00ae', trade: '\u2122', deg: '\u00b0',
  times: '\u00d7', divide: '\u00f7', plusmn: '\u00b1', euro: '\u20ac', pound: '\u00a3', yen: '\u00a5',
  cent: '\u00a2', sect: '\u00a7', para: '\u00b6', thinsp: '\u2009', ensp: '\u2002', emsp: '\u2003',
  zwj: '\u200d', zwnj: '\u200c', larr: '\u2190', rarr: '\u2192', uarr: '\u2191', darr: '\u2193',
  numero: '\u2116', prime: '\u2032', Prime: '\u2033',
};

function decodeEntities(text) {
  return String(text).replace(/&(#x[0-9a-f]+|#[0-9]+|[a-z][a-z0-9]*);?/giu, (whole, body) => {
    if (body[0] === '#') {
      const code = body[1] === 'x' || body[1] === 'X' ? Number.parseInt(body.slice(2), 16) : Number.parseInt(body.slice(1), 10);
      if (!Number.isFinite(code) || code <= 0 || code > 0x10ffff || (code >= 0xd800 && code <= 0xdfff)) return '\ufffd';
      return String.fromCodePoint(code);
    }
    return Object.hasOwn(NAMED, body) && whole.endsWith(';') ? NAMED[body] : whole;
  });
}

// ---------------------------------------------------------------- readers

// The raw tree both readers give: {type: 'element', name, attrs, children}
// and {type: 'text', value}. Only href and style are read from attributes.

/**
 * Reads an HTML string into the raw tree, without a DOM. Tolerant the way a
 * browser is for what matters here: implied ends of p and li, void elements,
 * raw-text elements, comments, entities in text and attributes.
 * @param {string} html
 */
function parseHtml(html) {
  const source = typeof html === 'string' ? html : '';
  const root = {type: 'element', name: '#root', attrs: {}, children: []};
  const stack = [root];
  const top = () => stack[stack.length - 1];
  const append = (node) => top().children.push(node);
  const appendText = (value) => {
    if (!value) return;
    const last = top().children.at(-1);
    if (last?.type === 'text') last.value += value;
    else append({type: 'text', value});
  };
  const closeTo = (name, stopAt = null) => {
    for (let index = stack.length - 1; index > 0; index -= 1) {
      const open = stack[index].name;
      if (stopAt && stopAt.has(open)) return false;
      if (open === name) {
        stack.length = index;
        return true;
      }
    }
    return false;
  };
  let at = 0;
  const length = source.length;
  while (at < length) {
    const lt = source.indexOf('<', at);
    if (lt < 0) {
      appendText(decodeEntities(source.slice(at)));
      break;
    }
    if (lt > at) appendText(decodeEntities(source.slice(at, lt)));
    at = lt;
    if (source.startsWith('<!--', at)) {
      const end = source.indexOf('-->', at + 4);
      at = end < 0 ? length : end + 3;
      continue;
    }
    const next = source[at + 1] ?? '';
    if (next === '!' || next === '?') {
      const end = source.indexOf('>', at + 2);
      at = end < 0 ? length : end + 1;
      continue;
    }
    if (next === '/') {
      const match = /^<\/([a-z][a-z0-9-]*)[^>]*>?/iu.exec(source.slice(at));
      if (!match) {
        // "</" not followed by a name is a bogus comment.
        const end = source.indexOf('>', at + 2);
        at = end < 0 ? length : end + 1;
        continue;
      }
      at += match[0].length;
      const name = match[1].toLowerCase();
      if (name === 'br') append({type: 'element', name: 'br', attrs: {}, children: []});
      else if (name === 'p' && !closeTo('p', P_SCOPE)) {
        // A </p> without a <p> is an empty paragraph, as a browser reads it.
        append({type: 'element', name: 'p', attrs: {}, children: []});
      } else closeTo(name);
      continue;
    }
    const tag = /^<([a-z][a-z0-9-]*)/iu.exec(source.slice(at));
    if (!tag) {
      appendText('<');
      at += 1;
      continue;
    }
    at += tag[0].length;
    const name = tag[1].toLowerCase();
    const attrs = {};
    let selfClosing = false;
    // Attributes, up to the closing ">".
    while (at < length) {
      const space = /^[\s/]+/u.exec(source.slice(at));
      if (space) {
        if (space[0].includes('/') && source[at + space[0].length] === '>') selfClosing = true;
        at += space[0].length;
        continue;
      }
      if (source[at] === '>') {
        at += 1;
        break;
      }
      const attr = /^([^\s/>"'=][^\s/>"'=]*)(?:\s*=\s*(?:"([^"]*)"?|'([^']*)'?|([^\s>]*)))?/u.exec(source.slice(at));
      if (!attr) {
        at += 1;
        continue;
      }
      at += attr[0].length;
      const key = attr[1].toLowerCase();
      if (!Object.hasOwn(attrs, key)) attrs[key] = decodeEntities(attr[2] ?? attr[3] ?? attr[4] ?? '');
    }
    const element = {type: 'element', name, attrs, children: []};
    if (name === 'li') closeTo('li', LISTS);
    // A block start ends an open paragraph (the browser's implied </p>).
    if (RICH_TEXT_BLOCKS.includes(name) || LISTS.has(name) || name === 'blockquote' || BREAKING.has(name)) closeTo('p', P_SCOPE);
    append(element);
    if (name === 'plaintext') {
      at = length;
      break;
    }
    if (RAW.has(name)) {
      const close = new RegExp(`</${name}[\\s/>]`, 'iu').exec(source.slice(at));
      const end = close ? at + close.index : length;
      if (name === 'textarea' || name === 'title') element.children.push({type: 'text', value: decodeEntities(source.slice(at, end))});
      else element.children.push({type: 'text', value: source.slice(at, end)});
      const gt = close ? source.indexOf('>', end) : -1;
      at = gt < 0 ? length : gt + 1;
      continue;
    }
    if (!VOID.has(name) && !selfClosing) stack.push(element);
  }
  return root;
}

const HTML_NS = 'http://www.w3.org/1999/xhtml';

/**
 * Reads a DOM subtree (an element, a fragment, a template's content) into the
 * raw tree. Elements outside the HTML namespace are dropped.
 * @param {Node} node
 */
function treeFromDom(node) {
  const read = (current) => {
    if (current.nodeType === 3) return {type: 'text', value: current.data};
    if (current.nodeType === 11) return {type: 'element', name: '#root', attrs: {}, children: [...current.childNodes].map(read).filter(Boolean)};
    if (current.nodeType !== 1) return null;
    if (current.namespaceURI && current.namespaceURI !== HTML_NS) return null;
    const name = current.localName;
    if (DROPPED.has(name)) return null;
    const attrs = {};
    const href = current.getAttribute('href');
    if (href !== null) attrs.href = href;
    const style = current.getAttribute('style');
    if (style !== null) attrs.style = style;
    const children = name === 'template' ? [] : [...current.childNodes].map(read).filter(Boolean);
    return {type: 'element', name, attrs, children};
  };
  const tree = read(node);
  if (!tree || tree.type !== 'element') return {type: 'element', name: '#root', attrs: {}, children: tree ? [tree] : []};
  return {...tree, name: '#root'};
}

// ---------------------------------------------------------------- the cleaner

// What a style says of the marks: {strong: true|false|undefined, em: ...}.
function styleMarks(style) {
  const out = {};
  if (!style) return out;
  const weight = /(?:^|;)\s*font-weight\s*:\s*([^;!]+)/iu.exec(style)?.[1]?.trim().toLowerCase();
  if (weight) {
    if (weight === 'bold' || weight === 'bolder' || Number(weight) >= 600) out.strong = true;
    else if (weight === 'normal' || weight === 'lighter' || Number(weight) < 600) out.strong = false;
  }
  const fontStyle = /(?:^|;)\s*font-style\s*:\s*([^;!]+)/iu.exec(style)?.[1]?.trim().toLowerCase();
  if (fontStyle) {
    if (fontStyle === 'italic' || fontStyle.startsWith('oblique')) out.em = true;
    else if (fontStyle === 'normal') out.em = false;
  }
  return out;
}

function marksOf(element, marks) {
  const next = {...marks};
  if (element.name === 'strong' || element.name === 'b') next.strong = true;
  if (element.name === 'em' || element.name === 'i') next.em = true;
  const styled = styleMarks(element.attrs?.style);
  if (styled.strong !== undefined) next.strong = styled.strong;
  if (styled.em !== undefined) next.em = styled.em;
  return next;
}

// A leaf of inline content: {kind: 'text', value, strong, em, href} or
// {kind: 'br', strong, em, href}.
const leaf = (kind, value, context) => ({kind, value, strong: Boolean(context.marks.strong), em: Boolean(context.marks.em), href: context.href || null});

// A flow (the root, a quote) collects blocks; a list item collects its own
// content. Text comes in as leaves into the current run; a block ends the
// run.
class Flow {
  constructor(kind) {
    this.kind = kind;
    this.blocks = [];
    this.run = [];
    this.types = ['p'];
    this.starts = [0];
    this.needBreak = false;
  }

  inline(item) {
    if (this.kind === 'item' && this.needBreak && this.run.length > 0) {
      if (!(item.kind === 'text' && !item.value.trim())) {
        this.run.push({kind: 'br', strong: false, em: false, href: null});
        this.needBreak = false;
      }
    }
    this.run.push(item);
  }

  flush() {
    if (!this.run.length) return;
    if (this.kind === 'item') {
      this.blocks.push({type: 'inline', leaves: this.run});
    } else {
      this.blocks.push({type: this.types[this.types.length - 1], leaves: this.run});
    }
    this.run = [];
  }

  // A paragraph or heading starts (or a block off the subset): the text so
  // far is one block, and what follows belongs to the new one.
  open(type) {
    if (this.kind === 'item') {
      this.needBreak = true;
      return;
    }
    this.flush();
    this.types.push(type);
    this.starts.push(this.blocks.length);
  }

  // keepEmpty: a paragraph or heading of the subset that held nothing is
  // still a block (the editing surface keeps it; the value drops it).
  close(keepEmpty = false) {
    if (this.kind === 'item') {
      this.needBreak = true;
      return;
    }
    const start = this.starts[this.starts.length - 1];
    if (keepEmpty && !this.run.length && this.blocks.length === start) this.blocks.push({type: this.types[this.types.length - 1], leaves: []});
    this.flush();
    if (this.types.length > 1) {
      this.types.pop();
      this.starts.pop();
    }
  }

  block(block) {
    this.flush();
    this.blocks.push(block);
    this.needBreak = false;
  }
}

function walkText(value, flow, context) {
  if (context.pre) {
    const lines = value.replace(/\r\n?/gu, '\n').split('\n');
    lines.forEach((line, index) => {
      if (index > 0) flow.inline(leaf('br', '', context));
      if (line) flow.inline(leaf('text', line.replace(/[\t\f]/gu, ' '), context));
    });
    return;
  }
  const text = value.replace(/[\t\n\r\f ]+/gu, ' ');
  if (!text) return;
  // White space between blocks is formatting of the source, not text.
  if (text === ' ' && !flow.run.length) return;
  flow.inline(leaf('text', text, context));
}

function walkChildren(children, flow, context) {
  for (const child of children) walk(child, flow, context);
}

function walk(node, flow, context) {
  if (node.type === 'text') {
    walkText(node.value, flow, context);
    return;
  }
  const name = node.name;
  if (DROPPED.has(name)) return;
  if (name === 'br') {
    flow.inline(leaf('br', '', context));
    return;
  }
  const inner = {...context, marks: marksOf(node, context.marks)};
  if (name === 'a') {
    const href = richTextHref(node.attrs?.href);
    walkChildren(node.children, flow, href && !context.href ? {...inner, href} : inner);
    return;
  }
  if (RICH_TEXT_BLOCKS.includes(name)) {
    flow.open(name);
    walkChildren(node.children, flow, inner);
    flow.close(true);
    return;
  }
  if (LISTS.has(name)) {
    const list = readList(node, inner, name);
    if (list.items.length) flow.block(list);
    return;
  }
  if (name === 'blockquote') {
    if (flow.kind === 'item') {
      flow.open('p');
      walkChildren(node.children, flow, inner);
      flow.close();
      return;
    }
    const quote = new Flow('flow');
    walkChildren(node.children, quote, inner);
    quote.flush();
    flow.block({type: 'blockquote', blocks: quote.blocks});
    return;
  }
  if (name === 'li') {
    // An item outside a list is a paragraph of its own.
    flow.open('p');
    walkChildren(node.children, flow, inner);
    flow.close();
    return;
  }
  if (BREAKING.has(name)) {
    flow.open('p');
    walkChildren(node.children, flow, name === 'pre' || name === 'listing' ? {...inner, pre: true} : inner);
    flow.close();
    return;
  }
  // Any other element: its text, in place.
  walkChildren(node.children, flow, inner);
}

function readItem(node, context) {
  const flow = new Flow('item');
  walkChildren(node.children, flow, context);
  flow.flush();
  return {children: flow.blocks};
}

function readList(node, context, type) {
  const list = {type, items: []};
  let loose = null;
  const endLoose = () => {
    if (loose) {
      loose.flush();
      list.items.push({children: loose.blocks});
      loose = null;
    }
  };
  for (const child of node.children) {
    if (child.type === 'element' && child.name === 'li') {
      endLoose();
      list.items.push(readItem(child, context));
      continue;
    }
    if (child.type === 'element' && LISTS.has(child.name)) {
      endLoose();
      // A list right inside a list (what an indent command leaves) belongs to
      // the item before it.
      const nested = readList(child, {...context, marks: marksOf(child, context.marks)}, child.name);
      if (!nested.items.length) continue;
      const previous = list.items.at(-1);
      if (previous) previous.children.push(nested);
      else list.items.push({children: [nested]});
      continue;
    }
    if (child.type === 'text' && !child.value.trim()) continue;
    if (child.type === 'element' && DROPPED.has(child.name)) continue;
    // Loose content in a list is an item.
    loose ??= new Flow('item');
    walk(child, loose, context);
  }
  endLoose();
  return list;
}

// ---------------------------------------------------------------- tidying

const SPACE = ' ';
const sameFormat = (a, b) => a.strong === b.strong && a.em === b.em && a.href === b.href;

// Inline leaves made canonical: adjacent text of one format joined, runs of
// spaces made one, spaces at the edges and around a line break removed, a link
// with nothing but spaces made text.
function tidyLeaves(leaves, mode) {
  const out = [];
  for (const item of leaves) {
    if (item.kind === 'text' && !item.value) continue;
    const last = out.at(-1);
    if (item.kind === 'text' && last?.kind === 'text' && sameFormat(last, item)) {
      last.value += item.value;
    } else {
      out.push({...item});
    }
  }
  // One space between words, whatever the leaves.
  for (let index = 0; index < out.length; index += 1) {
    const item = out[index];
    if (item.kind !== 'text') continue;
    item.value = item.value.replace(/ {2,}/gu, SPACE);
    const previous = out[index - 1];
    if (item.value.startsWith(SPACE) && (!previous || previous.kind === 'br' || (previous.kind === 'text' && previous.value.endsWith(SPACE)))) {
      item.value = item.value.slice(1);
    }
    const next = out[index + 1];
    if (item.value.endsWith(SPACE) && (!next || next.kind === 'br')) item.value = item.value.slice(0, -1);
  }
  let kept = out.filter((item) => item.kind === 'br' || item.value);
  if (mode === 'value') {
    while (kept[0]?.kind === 'br') kept.shift();
    while (kept.at(-1)?.kind === 'br') kept.pop();
    if (kept[0]?.kind === 'text') kept[0].value = kept[0].value.replace(/^[\s\u00a0]+/u, '');
    const end = kept.at(-1);
    if (end?.kind === 'text') end.value = end.value.replace(/[\s\u00a0]+$/u, '');
    kept = kept.filter((item) => item.kind === 'br' || item.value);
  }
  // A link of nothing but spaces is not a link.
  const groups = new Map();
  for (const item of kept) {
    if (!item.href) continue;
    groups.set(item.href, (groups.get(item.href) || '') + (item.kind === 'text' ? item.value : 'x'));
  }
  for (const item of kept) if (item.href && !groups.get(item.href).trim()) item.href = null;
  // Join again: dropping spaces and links may have made neighbours alike.
  const joined = [];
  for (const item of kept) {
    const last = joined.at(-1);
    if (item.kind === 'text' && last?.kind === 'text' && sameFormat(last, item)) last.value += item.value;
    else joined.push(item);
  }
  return joined;
}

const hasText = (leaves) => leaves.some((item) => item.kind === 'text' && item.value.replace(/[\s\u00a0]+/gu, '') !== '');

function tidyItem(item, mode) {
  const children = [];
  for (const part of item.children) {
    if (part.type === 'inline') {
      const leaves = tidyLeaves(part.leaves, mode);
      if (!leaves.length) continue;
      const last = children.at(-1);
      if (last?.type === 'inline') last.leaves = tidyLeaves([...last.leaves, {kind: 'br', strong: false, em: false, href: null}, ...leaves], mode);
      else children.push({type: 'inline', leaves});
    } else {
      const list = tidyList(part, mode);
      if (!list) continue;
      const last = children.at(-1);
      if (last && last.type === list.type) last.items.push(...list.items);
      else children.push(list);
    }
  }
  if (mode === 'value') {
    const filtered = children.filter((part) => part.type !== 'inline' || hasText(part.leaves));
    return filtered.length ? {children: filtered} : null;
  }
  if (!children.length || children[0].type !== 'inline') children.unshift({type: 'inline', leaves: [{kind: 'br', strong: false, em: false, href: null}]});
  return {children};
}

function tidyList(list, mode) {
  const items = list.items.map((item) => tidyItem(item, mode)).filter(Boolean);
  return items.length ? {type: list.type, items} : null;
}

function tidyBlocks(blocks, mode) {
  const out = [];
  for (const block of blocks) {
    let tidy = null;
    if (block.type === 'blockquote') {
      const inner = tidyBlocks(block.blocks, mode);
      if (inner.length) tidy = {type: 'blockquote', blocks: inner};
      else if (mode === 'editor') tidy = {type: 'blockquote', blocks: [{type: 'p', leaves: [{kind: 'br', strong: false, em: false, href: null}]}]};
    } else if (LISTS.has(block.type)) {
      tidy = tidyList(block, mode);
    } else {
      const leaves = tidyLeaves(block.leaves, mode);
      if (mode === 'value') {
        if (hasText(leaves)) tidy = {type: block.type, leaves};
      } else {
        tidy = {type: block.type, leaves: leaves.length ? leaves : [{kind: 'br', strong: false, em: false, href: null}]};
      }
    }
    if (!tidy) continue;
    const last = out.at(-1);
    // Adjacent lists of one kind are one list.
    if (last && LISTS.has(tidy.type) && last.type === tidy.type) last.items.push(...tidy.items);
    else out.push(tidy);
  }
  return out;
}

/**
 * The raw tree cleaned into blocks.
 * mode "value": the stored form -- no empty block, no break at an edge.
 * mode "editor": what the editing surface holds -- an empty block keeps a
 *   <br> so the caret has a line, breaks the person typed stay.
 */
function cleanTree(tree, {mode = 'value'} = {}) {
  const flow = new Flow('flow');
  walkChildren(tree.children ?? [], flow, {marks: {}, href: null, pre: false});
  flow.flush();
  const blocks = tidyBlocks(flow.blocks, mode);
  if (mode === 'editor' && !blocks.length) return [{type: 'p', leaves: [{kind: 'br', strong: false, em: false, href: null}]}];
  return blocks;
}

// ---------------------------------------------------------------- writing

const escapeText = (text) => text.replace(/&/gu, '&amp;').replace(/</gu, '&lt;').replace(/>/gu, '&gt;').replace(/\u00a0/gu, '&nbsp;');
const escapeAttribute = (text) => text.replace(/&/gu, '&amp;').replace(/"/gu, '&quot;').replace(/</gu, '&lt;').replace(/>/gu, '&gt;').replace(/\u00a0/gu, '&nbsp;');

// Leaves to markup, nested a > strong > em, each run of one format once.
function writeLeaves(leaves) {
  const writeGroup = (items, level) => {
    let out = '';
    let at = 0;
    const key = ['href', 'strong', 'em'][level];
    while (at < items.length) {
      const value = key ? items[at][key] : null;
      let end = at + 1;
      while (end < items.length && key && items[end][key] === value) end += 1;
      const group = items.slice(at, end);
      if (!key) {
        out += group.map((item) => (item.kind === 'br' ? '<br>' : escapeText(item.value))).join('');
      } else if (key === 'href' && value) {
        out += `<a href="${escapeAttribute(value)}">${writeGroup(group, level + 1)}</a>`;
      } else if (key !== 'href' && value) {
        out += `<${key}>${writeGroup(group, level + 1)}</${key}>`;
      } else {
        out += writeGroup(group, level + 1);
      }
      at = end;
    }
    return out;
  };
  return writeGroup(leaves, 0);
}

function writeList(list) {
  return `<${list.type}>${list.items.map((item) => `<li>${item.children.map((part) => (part.type === 'inline' ? writeLeaves(part.leaves) : writeList(part))).join('')}</li>`).join('')}</${list.type}>`;
}

/** Cleaned blocks to the HTML string. */
function serialize(blocks) {
  return blocks.map((block) => {
    if (block.type === 'blockquote') return `<blockquote>${serialize(block.blocks)}</blockquote>`;
    if (LISTS.has(block.type)) return writeList(block);
    return `<${block.type}>${writeLeaves(block.leaves)}</${block.type}>`;
  }).join('');
}

/** The text of cleaned blocks, for counting and emptiness. */
function plainText(html) {
  const blocks = cleanTree(parseHtml(html), {mode: 'value'});
  const text = (leaves) => leaves.map((item) => (item.kind === 'br' ? '\n' : item.value)).join('');
  const list = (block) => block.items.map((item) => item.children.map((part) => (part.type === 'inline' ? text(part.leaves) : list(part))).join('\n')).join('\n');
  const all = (items) => items.map((block) => (block.type === 'blockquote' ? all(block.blocks) : LISTS.has(block.type) ? list(block) : text(block.leaves))).join('\n\n');
  return all(blocks);
}

/**
 * Untrusted HTML into the subset. With a document (the browser) the string
 * is parsed by the browser in an inert <template>; without one, by
 * parseHtml. A DOM node may be given instead of a string.
 * @param {string|Node|null|undefined} input
 * @param {{mode?: 'value'|'editor', document?: Document|null}} [options]
 * @returns {string}
 */
function sanitizeRichText(input, {mode = 'value', document: documentRef} = {}) {
  let tree;
  if (input && typeof input === 'object' && typeof input.nodeType === 'number') {
    tree = treeFromDom(input);
  } else {
    const html = typeof input === 'string' ? input : '';
    const doc = documentRef === undefined ? globalThis.document : documentRef;
    if (html && doc?.createElement) {
      const template = doc.createElement('template');
      template.innerHTML = html;
      tree = treeFromDom(template.content);
    } else {
      tree = parseHtml(html);
    }
  }
  return serialize(cleanTree(tree, {mode}));
}

/**
 * Plain text into the subset: paragraphs split on blank lines, a single line
 * break a <br>.
 * @param {string} text
 * @param {{mode?: 'value'|'editor'}} [options]
 */
function richTextFromPlainText(text, {mode = 'value'} = {}) {
  const source = String(text ?? '').replace(/\r\n?/gu, '\n');
  const blocks = source.split(/\n[ \t\f\v\u00a0]*\n+/u).map((paragraph) => {
    const leaves = [];
    paragraph.split('\n').forEach((line, index) => {
      if (index > 0) leaves.push({kind: 'br', strong: false, em: false, href: null});
      const value = line.replace(/[\t\f\v ]+/gu, ' ');
      if (value) leaves.push({kind: 'text', value, strong: false, em: false, href: null});
    });
    return {type: 'p', leaves};
  });
  return serialize(tidyBlocks(blocks, mode));
}


/***/ },

/***/ "6a761c819b95"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.rich-text","tag":"sf-rich-text","version":"1.0.0","kind":"leaf","settings":{"size":{"type":"enum","values":["1/2","1","2"],"default":"1"},"appearance":{"type":"enum","values":["bordered","filled"],"default":"bordered"},"label":{"type":"string","default":""},"required":{"type":"boolean","default":false},"placeholder":{"type":"string","default":""},"hint":{"type":"string","default":""},"name":{"type":"string","default":""},"rows":{"type":"number","default":6},"max-rows":{"type":"number","optional":true},"disabled":{"type":"boolean","default":false},"readonly":{"type":"boolean","default":false},"invalid":{"type":"boolean","default":false},"error-message":{"type":"string","default":""}},"values":{"value":{"type":"string","default":""}},"events":{"input":{"carries":"native"},"change":{"carries":"native"}},"actions":{},"form":{"value":"value","name":"name","default":"value","submits":"value","reset":"default","required":"required","disabled":"disabled","readonly":"readonly","validity":["value-missing","custom-error"]},"css-variables":{"--sf-rich-text-background-color":{"type":"color","state":"default"},"--sf-rich-text-border-color":{"type":"color","state":"default"},"--sf-rich-text-color":{"type":"color","state":"default"},"--sf-rich-text-radius":{"type":"length","state":"default"},"--sf-rich-text-padding-inline":{"type":"length","state":"default"},"--sf-rich-text-padding-block":{"type":"length","state":"default"},"--sf-rich-text-invalid-border-color":{"type":"color","state":"invalid"}}}');

/***/ },

/***/ "70900b6444b0"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Rich text","runtime":{"toolbar":"Formatting","paragraph":"Paragraph","heading-2":"Heading 2","heading-3":"Heading 3","heading-4":"Heading 4","bold":"Bold","italic":"Italic","link":"Link","bulleted-list":"Bulleted list","numbered-list":"Numbered list","quote":"Quote","undo":"Undo","redo":"Redo","link-dialog":"Link","link-address":"Link address","link-hint":"https://…, mailto:, tel: or a path on this site such as /about","link-invalid":"Use an https:, mailto: or tel: address, or a path on this site that starts with /.","link-apply":"Apply","link-remove":"Remove link","value-missing":"Enter some text."}}');

/***/ },

/***/ "1a7ff5377834"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Форматированный текст","runtime":{"toolbar":"Форматирование","paragraph":"Абзац","heading-2":"Заголовок 2","heading-3":"Заголовок 3","heading-4":"Заголовок 4","bold":"Полужирный","italic":"Курсив","link":"Ссылка","bulleted-list":"Маркированный список","numbered-list":"Нумерованный список","quote":"Цитата","undo":"Отменить","redo":"Повторить","link-dialog":"Ссылка","link-address":"Адрес ссылки","link-hint":"https://…, mailto:, tel: или путь на этом сайте, например /about","link-invalid":"Укажите адрес https:, mailto: или tel: либо путь на этом сайте, начинающийся с /.","link-apply":"Применить","link-remove":"Убрать ссылку","value-missing":"Введите текст."}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("246c8ff58bbf");
/******/
/******/ })()
;