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

/***/ "9b9874fb7905"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SfQuantity: () => (/* binding */ SfQuantity)
/* harmony export */ });
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("fbe0570fcc69");
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("0d662e4d7d63");
/* harmony import */ var _component_field_contract__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("e138a730fd7c");
/* harmony import */ var _component_field_size__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("e6d86f2cd058");
/* harmony import */ var _component_form_reset_helper__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("67eed2647f47");
/* harmony import */ var _helpers_inherited_value__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("778671c79fa6");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("da109711b1a3");
/* harmony import */ var _value_mjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("26872bd9a5e9");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_1__, _helpers_inherited_value__WEBPACK_IMPORTED_MODULE_5__, _js_templates_default__WEBPACK_IMPORTED_MODULE_6__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_1__, _helpers_inherited_value__WEBPACK_IMPORTED_MODULE_5__, _js_templates_default__WEBPACK_IMPORTED_MODULE_6__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__);
// sf-quantity: a number field with «−» and «+» (owner, 2026-10-25). The class
// component `quantity` draws the stepper and a page could already write its
// markup by hand, but a form built from Smart elements -- the property view
// and the data view among them -- had no field for an integer that steps: an
// sf-input with inputmode="numeric" takes text and leaves the bounds, the
// steps and the keys to the host.
//
// It is a form field like sf-input and sf-textarea: label, hint, error,
// required, disabled, read-only, the three field sizes and the inherited value
// (helpers/inherited-value.js) are the ones every field has. It draws the class
// component's markup, so the quantity sheet is what it looks like; the
// behaviour is its own, and the class binder leaves a root inside sf-quantity
// alone, as the country code's binder leaves its Smart owner's.
//
// The control is the WAI-ARIA spinbutton: a text box with role="spinbutton"
// carrying aria-valuenow, -valuemin, -valuemax and -valuetext. Not a native
// number input, which takes neither the page's decimal comma nor grouped
// thousands and draws spinners of its own. The keys are the pattern's:
// ArrowUp/ArrowDown a step, PageUp/PageDown ten, Home/End the bounds. The two
// steppers are real buttons named «Уменьшить значение» / «Увеличить значение»,
// out of the tab order as the pattern has them -- the keys already do what they
// do -- disabled at the bounds, and a held stepper repeats.
//
// Typing is strict: a character that cannot be part of a number is refused as
// it is typed or pasted. The decimal mark is the page's language's (a comma in
// Russian; the other of «.» and «,» is taken as one too unless the language
// groups with it). The value is committed on Enter and when the field loses
// focus: then it is rounded to the field's digits, clamped to the bounds and
// written back in the page's format.







 // Every word this component says. A product adds any other language through
// SF.language.register('sf-quantity', code, words).

const QUANTITY_TEXT = {
  en: {
    decrement: 'Decrease value',
    increment: 'Increase value'
  },
  ru: {
    decrement: 'Уменьшить значение',
    increment: 'Увеличить значение'
  }
}; // A held stepper waits, then repeats: long enough that a click is one step,
// fast enough that a hundred steps take a few seconds.

const REPEAT_DELAY = 400;
const REPEAT_INTERVAL = 60; // PageUp and PageDown move this many steps unless the field names its own.

const PAGE_STEPS = 10;

class SfQuantity extends (0,_helpers_inherited_value__WEBPACK_IMPORTED_MODULE_5__.InheritedValueField)((_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default())) {
  static get props() {
    return {
      templateName: {
        attribute: 'template',
        default: 'default'
      },
      value: {
        default: ''
      },
      name: {
        default: ''
      },
      label: {
        default: ''
      },
      hint: {
        default: ''
      },
      placeholder: {
        default: ''
      },
      min: {
        default: ''
      },
      max: {
        default: ''
      },
      step: {
        default: '1'
      },
      pageStep: {
        attribute: 'page-step',
        default: ''
      },
      precision: {
        default: ''
      },
      grouping: {
        type: Boolean,
        default: true
      },
      locale: {
        default: ''
      },
      size: {
        default: '1',
        values: _component_field_size__WEBPACK_IMPORTED_MODULE_3__.FIELD_SIZES
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
      decrementLabel: {
        attribute: 'decrement-label',
        default: ''
      },
      incrementLabel: {
        attribute: 'increment-label',
        default: ''
      },
      // The control's name when no label is drawn: a field renderer's panel
      // prints the label beside the field (tests/field-control-accessible-name).
      ariaLabel: {
        attribute: 'aria-label',
        default: ''
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
      },
      rootClass: {
        default: ''
      }
    };
  }

  constructor() {
    super(); // undefined: follow the attribute. Set by the property, a step, a commit or
    // a reset; an attribute written later takes over again.

    this._value = undefined; // A value set as a property before the element was defined (a lit `.value`
    // binding on a tag the loader had not upgraded yet) is an own property that
    // would hide the accessor; it is taken through it, as sf-image-field does.

    if (Object.prototype.hasOwnProperty.call(this, 'value')) {
      const early = this.value;
      delete this.value;
      this._value = this.readValue(early);
    } // The text being typed, until it is committed; null while nobody types.


    this._draft = null; // The last value `input` and `change` reported, so each fires once per
    // change: a commit that only reformats the text fires neither.

    this._reported = undefined;
    this._committed = undefined;
    this._hold = null;
    this._releaseReset = null;
    this._resetControl = null;

    this.__sfStopHold = () => this.stopHold();
  }

  attributeChangedCallback(name, previous, next) {
    if (name === 'value' && previous !== next) {
      this._value = undefined;
      this._draft = null;
      this._reported = undefined;
      this._committed = undefined;
    }

    super.attributeChangedCallback(name, previous, next);
  }

  get size() {
    return (0,_component_field_size__WEBPACK_IMPORTED_MODULE_3__.fieldSize)(this.getAttribute('size') || '1', 'sf-quantity');
  }

  get name() {
    return this.getAttribute('name') || '';
  }

  get label() {
    return this.getAttribute('label') || '';
  }

  get hint() {
    return this.getAttribute('hint') || '';
  }

  get placeholder() {
    return this.getAttribute('placeholder') || '';
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

  get ariaLabel() {
    return this.getProp('ariaLabel') || '';
  }

  get grouping() {
    return this.getBooleanAttr('grouping', true);
  }

  get locale() {
    return this.getAttribute('locale') || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageLocale)(this);
  } // The bounds: a number, or null when the field has none on that side.


  get min() {
    return (0,_value_mjs__WEBPACK_IMPORTED_MODULE_7__.readNumber)(this.getAttribute('min'));
  }

  get max() {
    return (0,_value_mjs__WEBPACK_IMPORTED_MODULE_7__.readNumber)(this.getAttribute('max'));
  } // A step is positive; anything else is the default, one.


  get step() {
    const step = (0,_value_mjs__WEBPACK_IMPORTED_MODULE_7__.readNumber)(this.getAttribute('step'));
    return step !== null && step > 0 ? step : 1;
  }

  get pageStep() {
    const page = (0,_value_mjs__WEBPACK_IMPORTED_MODULE_7__.readNumber)(this.getAttribute('page-step'));
    return page !== null && page > 0 ? page : this.step * PAGE_STEPS;
  } // Digits after the decimal mark: the attribute, else what the step implies
  // (0.25 shows two). An integer field has none and refuses a decimal mark.


  get precision() {
    const own = (0,_value_mjs__WEBPACK_IMPORTED_MODULE_7__.readNumber)(this.getAttribute('precision'));
    if (own !== null && own >= 0) return Math.min(20, Math.floor(own));
    return (0,_value_mjs__WEBPACK_IMPORTED_MODULE_7__.inferPrecision)(this.getAttribute('step') || '1');
  }

  get decrementLabel() {
    return this.getAttribute('decrement-label') || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(QUANTITY_TEXT, 'decrement', this, 'sf-quantity');
  }

  get incrementLabel() {
    return this.getAttribute('increment-label') || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(QUANTITY_TEXT, 'increment', this, 'sf-quantity');
  }

  get interactive() {
    return !this.disabled && !this.readonly;
  } // A negative number may be typed when the field allows one: no lower bound,
  // or one below zero.


  get allowNegative() {
    const {
      min
    } = this;
    return min === null || min < 0;
  }

  get numberOptions() {
    return {
      locale: this.locale,
      allowDecimal: this.precision > 0,
      allowNegative: this.allowNegative,
      precision: this.precision,
      grouping: this.grouping
    };
  } // A value from code or an attribute: a number, numeric text written with a
  // point, or nothing. Anything else is nothing, as an unparseable value of a
  // native number field is.


  readValue(raw) {
    const number = (0,_value_mjs__WEBPACK_IMPORTED_MODULE_7__.readNumber)(raw);
    return number === null ? null : (0,_value_mjs__WEBPACK_IMPORTED_MODULE_7__.roundTo)(number, this.precision);
  } // The number the field holds, or null when it is empty.


  get value() {
    if (this._value !== undefined) return this._value;
    return this.readValue(this.getAttribute('value'));
  } // Set from code, the value is not a change: no event, as for a native field.


  set value(next) {
    this.setValue(next);
  } // The value as the form submits it: a point, no grouping, the field's digits.


  get formValue() {
    return (0,_value_mjs__WEBPACK_IMPORTED_MODULE_7__.formValue)(this.value, this.precision);
  } // The value as the field writes it: the page's language and digits.


  get text() {
    return (0,_value_mjs__WEBPACK_IMPORTED_MODULE_7__.formatNumber)(this.value, this.numberOptions);
  }

  setValue(next) {
    this._value = this.readValue(next);
    this._draft = null;
    this._reported = this._value;
    this._committed = this._value;
    this.requestComponentUpdate('value');
    return this;
  }

  clear() {
    return this.setValue(null);
  } // Steps from code, like a native field's stepUp(): no event.


  stepUp(count = 1) {
    return this.setValue((0,_value_mjs__WEBPACK_IMPORTED_MODULE_7__.stepFrom)(this.currentValue(), Number(count) || 1, this.stepOptions()));
  }

  stepDown(count = 1) {
    return this.setValue((0,_value_mjs__WEBPACK_IMPORTED_MODULE_7__.stepFrom)(this.currentValue(), -(Number(count) || 1), this.stepOptions()));
  } // The error message shown in place of the hint, or none, as sf-image-field's.


  setError(message = '') {
    const text = String(message ?? '');

    if (text) {
      this.setAttribute('error-message', text);
      this.setAttribute('invalid', '');
    } else {
      this.removeAttribute('error-message');
      this.removeAttribute('invalid');
    }

    return this;
  }

  stepOptions() {
    return {
      step: this.step,
      min: this.min,
      max: this.max,
      precision: this.precision
    };
  }

  getInputElement() {
    return this.querySelector(':scope .sf-quantity-wrap input');
  }

  focusDelegate() {
    return this.getInputElement();
  }

  get state() {
    const input = this.getInputElement();
    return {
      value: this.value,
      text: input?.value ?? this.text,
      disabled: this.disabled,
      readonly: this.readonly,
      invalid: input?.getAttribute('aria-invalid') === 'true'
    };
  } // The value the field stands on now: a draft that reads as a number counts,
  // so a step taken while typing steps from what was typed.


  currentValue() {
    if (this._draft !== null) {
      const typed = (0,_value_mjs__WEBPACK_IMPORTED_MODULE_7__.parseNumber)(this._draft, this.numberOptions);
      if (typed === null) return null;
      if (Number.isFinite(typed)) return (0,_value_mjs__WEBPACK_IMPORTED_MODULE_7__.clamp)((0,_value_mjs__WEBPACK_IMPORTED_MODULE_7__.roundTo)(typed, this.precision), this.min, this.max);
    }

    return this.value;
  }

  atMin(value = this.value) {
    return value !== null && this.min !== null && value <= this.min;
  }

  atMax(value = this.value) {
    return value !== null && this.max !== null && value >= this.max;
  } // ---- The inherited-value seam -------------------------------------------


  inheritedOwnValue() {
    return this.value === null ? '' : String(this.value);
  }

  inheritedDisplayValue() {
    const number = (0,_value_mjs__WEBPACK_IMPORTED_MODULE_7__.readNumber)(this.inheritedValue);
    return number === null ? this.inheritedValue : (0,_value_mjs__WEBPACK_IMPORTED_MODULE_7__.formatNumber)(number, this.numberOptions);
  }

  inheritedFocusTarget() {
    return this.getInputElement();
  } // A reset is a change the person made: input, then change.


  clearOwnValue() {
    this.writeValue(null, 'reset', {
      change: true
    });
  } // ---- Changes the person makes ---------------------------------------------
  // Writes a value the person chose and says so: `input` when it differs from
  // the last one reported, `change` (when asked) when it differs from the last
  // one committed. Returns whether the value moved.


  writeValue(next, source, {
    change = true
  } = {}) {
    const previous = this.value;
    this._value = next;
    this._draft = null; // The box, the numbers and the form value now, not at the next frame: Enter
    // commits and submits the form in one press, and the form must read the
    // committed number.

    this.syncInputText(true);
    this.syncControlState();
    this.requestComponentUpdate('value');

    if (next !== this._reportedValue()) {
      this._reported = next;

      this._emit('input', source);
    }

    if (change) this.commitChange(source);
    return next !== previous;
  }

  commitChange(source) {
    const value = this.value;
    if (value === this._committedValue()) return false;
    this._committed = value;

    this._emit('change', source);

    return true;
  }

  _reportedValue() {
    return this._reported === undefined ? this.readValue(this.getAttribute('value')) : this._reported;
  }

  _committedValue() {
    return this._committed === undefined ? this.readValue(this.getAttribute('value')) : this._committed;
  } // `input` and `change` on the host, as sf-image-field sends them: detail
  // carries the number (null when empty), the text the field shows, the form
  // name and what made the change -- typing, commit, button, keyboard or reset.


  _emit(type, source) {
    this.dispatchEvent(new CustomEvent(type, {
      bubbles: true,
      composed: true,
      detail: {
        value: this.value,
        text: this.text,
        name: this.name,
        source
      }
    }));
  } // A step by the steppers or the keys: from what is typed, if anything is.


  stepBy(count, source, {
    change = true
  } = {}) {
    if (!this.interactive) return false;
    const next = (0,_value_mjs__WEBPACK_IMPORTED_MODULE_7__.stepFrom)(this.currentValue(), count, this.stepOptions());

    if (next === this.value && this._draft === null) {
      if (change) this.commitChange(source);
      return false;
    }

    return this.writeValue(next, source, {
      change
    });
  } // The typed text, made the value: rounded, clamped, written back.


  commitDraft(source = 'commit') {
    if (this._draft === null) return false;
    const typed = (0,_value_mjs__WEBPACK_IMPORTED_MODULE_7__.parseNumber)(this._draft, this.numberOptions);
    const next = typed === null || !Number.isFinite(typed) ? typed === null ? null : this.value : (0,_value_mjs__WEBPACK_IMPORTED_MODULE_7__.clamp)((0,_value_mjs__WEBPACK_IMPORTED_MODULE_7__.roundTo)(typed, this.precision), this.min, this.max);
    this.writeValue(next, source);
    return true;
  } // ---- Native events of the text box ---------------------------------------
  // The text box's own input and change bubble out as plain Events with no
  // detail -- a second event for each one this sends -- so they stop here, as
  // sf-image-field's and sf-color's do.


  onNativeInput(event) {
    event.stopPropagation();
    const input = event.target;
    this._draft = input.value;
    const typed = (0,_value_mjs__WEBPACK_IMPORTED_MODULE_7__.parseNumber)(this._draft, this.numberOptions);
    const value = typed === null ? null : Number.isFinite(typed) ? (0,_value_mjs__WEBPACK_IMPORTED_MODULE_7__.roundTo)(typed, this.precision) : undefined; // Text that is not a number yet («-», «1,») keeps the last value.

    if (value === undefined) return;
    this._value = value;
    this.syncControlState();

    if (value !== this._reportedValue()) {
      this._reported = value;

      this._emit('input', 'typing');
    }

    this.syncInheritedState();
  }

  onNativeChange(event) {
    event.stopPropagation();
    this.commitDraft('commit');
  } // Strict typing: what would leave the box holding text that can never be a
  // number is refused before it lands. A paste is taken whole or not at all.


  onBeforeInput(event) {
    if (!this.interactive) return;
    if (!event.inputType?.startsWith('insert')) return;
    const data = event.data ?? event.dataTransfer?.getData?.('text') ?? '';
    if (!data) return;
    const input = event.target;
    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? input.value.length;
    const next = input.value.slice(0, start) + data + input.value.slice(end);
    if (!(0,_value_mjs__WEBPACK_IMPORTED_MODULE_7__.isEditableText)(next, this.numberOptions)) event.preventDefault();
  }

  onPaste(event) {
    if (!this.interactive) return;
    const text = (event.clipboardData?.getData('text') ?? '').trim();
    const input = event.target;
    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? input.value.length;
    const next = input.value.slice(0, start) + text + input.value.slice(end);
    if (!text || !(0,_value_mjs__WEBPACK_IMPORTED_MODULE_7__.isEditableText)(next, this.numberOptions)) event.preventDefault();
  } // The spinbutton's keys (WAI-ARIA APG): a step, a page, the bounds. Enter
  // commits what is typed; Escape takes the typing back.


  onKeyDown(event) {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const keys = {
      ArrowUp: 1,
      ArrowDown: -1
    };

    if (event.key in keys) {
      event.preventDefault();
      this.stepBy(keys[event.key], 'keyboard');
      return;
    }

    if (event.key === 'PageUp' || event.key === 'PageDown') {
      event.preventDefault();
      const pages = this.pageStep / this.step;
      this.stepBy(event.key === 'PageUp' ? pages : -pages, 'keyboard');
      return;
    } // Home and End go to the bounds only when there is one; otherwise they
    // stay the caret's keys.


    if (event.key === 'Home' && this.min !== null) {
      event.preventDefault();
      if (this.interactive) this.writeValue(this.min, 'keyboard');
      return;
    }

    if (event.key === 'End' && this.max !== null) {
      event.preventDefault();
      if (this.interactive) this.writeValue(this.max, 'keyboard');
      return;
    }

    if (event.key === 'Enter') {
      this.commitDraft('commit');
      return;
    }

    if (event.key === 'Escape' && this._draft !== null) {
      event.preventDefault();
      event.stopPropagation();
      this._draft = null;
      this._value = this._committedValue();
      this._reported = this._value;
      this.syncInputText(true);
      this.syncControlState();
    }
  } // ---- The steppers ---------------------------------------------------------
  // A pointer press steps at once and repeats while held; the click that
  // follows it is the same press and is left alone. A click with no pointer
  // behind it (Enter or Space on the button, a screen reader's activation,
  // button.click()) steps once.


  onStepPointerDown(event, direction) {
    if (event.button !== 0 || !this.interactive) return;
    if (event.currentTarget.disabled) return;
    this.stopHold();
    this.commitDraft('commit');
    this._hold = {
      direction,
      moved: false,
      timer: 0,
      interval: 0
    };
    this._hold.moved = this.stepBy(direction, 'button', {
      change: false
    });

    if (this.atBound(direction)) {
      this.stopHold();
      return;
    }

    this._hold.timer = setTimeout(() => {
      if (!this._hold) return;
      this._hold.interval = setInterval(() => {
        if (!this._hold) return;
        if (this.stepBy(direction, 'button', {
          change: false
        })) this._hold.moved = true;
        if (this.atBound(direction) || !this.interactive) this.stopHold();
      }, REPEAT_INTERVAL);
    }, REPEAT_DELAY);

    for (const type of ['pointerup', 'pointercancel', 'blur']) {
      globalThis.addEventListener?.(type, this.__sfStopHold, {
        once: true
      });
    }
  } // The button takes no focus from a pointer: the person keeps typing in the
  // box, and a button disabled at a bound has no focus to drop.


  onStepMouseDown(event) {
    event.preventDefault();
  }

  onStepClick(event, direction) {
    event.preventDefault();
    if (event.detail > 0) return;
    this.commitDraft('commit');
    this.stepBy(direction, 'button');
  }

  atBound(direction) {
    return direction > 0 ? this.atMax() : this.atMin();
  } // The end of a hold: one change for the whole run of steps.


  stopHold() {
    const hold = this._hold;
    if (!hold) return;
    this._hold = null;
    clearTimeout(hold.timer);
    clearInterval(hold.interval);

    for (const type of ['pointerup', 'pointercancel', 'blur']) {
      globalThis.removeEventListener?.(type, this.__sfStopHold);
    }

    this.commitChange('button');
  } // ---- Focus look -------------------------------------------------------------
  // The class sheet draws the field's ring for the keyboard and none for a
  // pointer, by the root's sf-quantity--pointer-focus, as its own binder sets it.


  onPointerFocus() {
    this.querySelector(':scope .sf-quantity')?.classList.add('sf-quantity--pointer-focus');
  }

  onKeyboardFocus() {
    this.querySelector(':scope .sf-quantity')?.classList.remove('sf-quantity--pointer-focus');
  }

  onFocusOut(event) {
    if (event.relatedTarget && this.contains(event.relatedTarget)) return;
    this.querySelector(':scope .sf-quantity')?.classList.remove('sf-quantity--pointer-focus');
  } // ---- Drawing ----------------------------------------------------------------
  // The text box shows the draft while someone types, the value written in the
  // page's format otherwise. Written here, not bound in the template, so a
  // redraw while typing never moves the caret.


  syncInputText(force = false) {
    const input = this.getInputElement();
    if (!input) return;
    if (this._draft !== null && !force) return;
    const text = this._draft ?? this.text;
    if (input.value !== text) input.value = text;
  } // The spinbutton's numbers and the steppers' bounds, without a redraw.


  syncControlState() {
    const input = this.getInputElement();
    const value = this.value;

    if (input) {
      if (value === null) {
        input.removeAttribute('aria-valuenow');
        input.removeAttribute('aria-valuetext');
      } else {
        input.setAttribute('aria-valuenow', String(value));
        input.setAttribute('aria-valuetext', this.text);
      }
    }

    const [minus, plus] = this.querySelectorAll(':scope .sf-quantity-count');
    if (minus) minus.disabled = !this.interactive || this.atMin(value);
    if (plus) plus.disabled = !this.interactive || this.atMax(value);
    const hidden = this.querySelector(':scope .sf-quantity-value');
    if (hidden) hidden.value = this.formValue;
  }

  afterRender(callback) {
    if (typeof callback === 'function') return super.afterRender(callback);
    this.syncInputText();
    this.syncControlState();
    const input = this.getInputElement();

    if (input !== this._resetControl) {
      this._releaseReset?.();
      this._resetControl = input; // A form reset puts the attribute's value back, without events.

      this._releaseReset = input ? (0,_component_form_reset_helper__WEBPACK_IMPORTED_MODULE_4__.bindFormReset)(input, () => {
        this._value = undefined;
        this._draft = null;
        this._reported = undefined;
        this._committed = undefined;
        this.requestComponentUpdate('reset');
      }) : null;
    }

    this.syncInheritedState();
    return undefined;
  }

  onDisconnected() {
    this.stopHold();
    this._releaseReset?.();
    this._releaseReset = null;
    this._resetControl = null;
    super.onDisconnected();
  }

  templateContext() {
    const props = this.getPropsContext();
    const field = (0,_component_field_contract__WEBPACK_IMPORTED_MODULE_2__.createFieldContract)(this, {
      prefix: 'sf-quantity',
      required: this.required,
      invalid: this.invalid || this.error,
      hint: this.hint,
      errorMessage: this.errorMessage
    });
    const errorContent = this.hasSlotContent?.('error') ? this.getSlotContent('error') : this.errorMessage;
    const hintContent = this.hasSlotContent?.('hint') ? this.getSlotContent('hint') : this.hint;
    const value = this.value;
    return this.createTemplateContext({ ...props,
      component: this,
      id: field.base,
      field,
      value,
      text: this.text,
      formValue: this.formValue,
      size: this.size,
      name: this.name,
      label: this.label,
      hint: this.hint,
      placeholder: this.placeholder,
      min: this.min,
      max: this.max,
      step: this.step,
      pageStep: this.pageStep,
      precision: this.precision,
      grouping: this.grouping,
      locale: this.locale,
      required: this.required,
      disabled: this.disabled,
      readonly: this.readonly,
      error: this.error,
      invalid: this.invalid,
      errorMessage: this.errorMessage,
      ariaLabel: this.ariaLabel,
      decrementLabel: this.decrementLabel,
      incrementLabel: this.incrementLabel,
      inheritedValue: this.inheritedValue,
      inheritedText: this.inheritedText,
      resetLabel: this.resetLabel,
      interactive: this.interactive,
      atMin: this.atMin(value),
      atMax: this.atMax(value),
      shownPlaceholder: this.hasInheritedValue ? this.inheritedDisplayValue() : this.placeholder,
      message: field.invalid && errorContent ? errorContent : hintContent,
      messageKind: field.invalid && errorContent ? 'error' : 'hint',
      rootClass: this.getRootClass()
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_6__.renderQuantityTemplate)(this.templateContext());
  }

}

SfQuantity.define('sf-quantity');

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "da109711b1a3"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderQuantityTemplate: () => (/* binding */ renderQuantityTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ddf1cdb42ecc");
/* harmony import */ var _helpers_inherited_value__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("778671c79fa6");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, _helpers_inherited_value__WEBPACK_IMPORTED_MODULE_1__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, _helpers_inherited_value__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);

 // The class component's markup (component/quantity), so its sheet draws the
// field: the root, the label row, the wrap with «−», the box and «+». The
// layout utilities are the ones the class constructor puts on each part from
// quantity.utility.json. The steppers stay size 1/3 icon buttons at every
// field size, as the class draws them; the sheet sizes their glyph to the field.

const LAYOUT = {
  root: 'flex flex-col flex-nowrap justify-start',
  label: 'flex flex-row flex-nowrap justify-start items-start',
  wrap: 'flex flex-row flex-nowrap justify-center items-center',
  count: 'flex flex-row flex-nowrap justify-start items-center',
  input: 'flex'
};
const STEPPER = 'sf-quantity-count sf-icon-button sf-icon-button--secondary sf-icon-button--tonal sf-icon-button--size-1/3';

function renderStepper(context, direction) {
  const {
    component,
    field
  } = context;
  const down = direction < 0;
  const reached = down ? context.atMin : context.atMax; // Out of the tab order, as the APG spinbutton has its buttons: the arrow
  // keys already do what they do, and two more stops per field would make a
  // form of numbers three times as long to cross. Still real buttons, named,
  // reachable by a pointer and a screen reader.

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <button type="button"
            class="${STEPPER} ${LAYOUT.count}"
            tabindex="-1"
            aria-label=${down ? context.decrementLabel : context.incrementLabel}
            aria-controls=${field.controlId}
            ?disabled=${!context.interactive || reached}
            @pointerdown=${event => component.onStepPointerDown(event, direction)}
            @mousedown=${event => component.onStepMouseDown(event)}
            @click=${event => component.onStepClick(event, direction)}
    ><i class="sf-icon" aria-hidden="true">${down ? 'remove' : 'add'}</i></button>
  `;
}

function renderQuantityTemplate(context) {
  const {
    component,
    field
  } = context;
  const labelId = `${context.id}--label`;
  const rootClasses = ['sf-quantity', `sf-quantity--size-${context.size}`, field.invalid ? 'error' : '', context.rootClass, LAYOUT.root].filter(Boolean);
  const labelContent = component?.hasSlotContent?.('label') ? component.getSlotContent('label') : context.label ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-quantity-text" id=${labelId}>${context.label}</span>${field.required ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-quantity-required" aria-hidden="true">*</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}` // No label, no label row: the panel that prints the label beside the
  // field names the control through aria-label instead.
  : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const hasLabel = labelContent !== lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const named = Boolean(context.label) && !component?.hasSlotContent?.('label');
  const inheritedSlot = (0,_helpers_inherited_value__WEBPACK_IMPORTED_MODULE_1__.renderInheritedSlot)(component, {
    size: context.size,
    disabled: !context.interactive
  });
  const value = context.value;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div class=${rootClasses.join(' ')}
         style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
         @pointerdown=${() => component.onPointerFocus()}
         @keydown=${() => component.onKeyboardFocus()}
         @focusout=${event => component.onFocusOut(event)}>
      ${hasLabel ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<label class="sf-quantity-label ${LAYOUT.label}" for=${field.controlId}>${labelContent}</label>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}

      <span class="sf-quantity-wrap ${LAYOUT.wrap}">
        ${renderStepper(context, -1)}
        <input type="text"
               class=${`${LAYOUT.input}${field.invalid ? ' error' : ''}`}
               id=${field.controlId}
               role="spinbutton"
               inputmode=${context.precision > 0 ? 'decimal' : 'numeric'}
               autocomplete="off"
               spellcheck="false"
               placeholder=${context.shownPlaceholder || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
               aria-labelledby=${named ? labelId : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
               aria-label=${!hasLabel && context.ariaLabel ? context.ariaLabel : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
               aria-valuemin=${context.min === null ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : String(context.min)}
               aria-valuemax=${context.max === null ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : String(context.max)}
               aria-valuenow=${value === null ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : String(value)}
               aria-valuetext=${value === null ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : context.text}
               aria-invalid=${field.invalid ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
               aria-describedby=${context.message ? field.messageId : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
               aria-errormessage=${field.invalid && context.message && context.messageKind === 'error' ? field.messageId : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
               ?required=${field.required}
               ?disabled=${context.disabled}
               ?readonly=${context.readonly}
               @beforeinput=${event => component.onBeforeInput(event)}
               @paste=${event => component.onPaste(event)}
               @input=${event => component.onNativeInput(event)}
               @change=${event => component.onNativeChange(event)}
               @keydown=${event => component.onKeyDown(event)}
               @blur=${() => component.commitDraft('commit')}>
        ${inheritedSlot}
        ${renderStepper(context, 1)}
      </span>

      ${context.name // The form gets the number with a point and no grouping, whatever the
  // box shows; the box itself has no name.
  ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<input type="hidden" class="sf-quantity-value" name=${context.name} value=${context.formValue} ?disabled=${context.disabled}>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}

      ${context.message ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span id=${field.messageId} class="sf-quantity-hint-text-wrap"
                     data-field-message=${context.messageKind}>${context.message}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    </div>
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

/***/ "26872bd9a5e9"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   clamp: () => (/* binding */ clamp),
/* harmony export */   formValue: () => (/* binding */ formValue),
/* harmony export */   formatNumber: () => (/* binding */ formatNumber),
/* harmony export */   inferPrecision: () => (/* binding */ inferPrecision),
/* harmony export */   isEditableText: () => (/* binding */ isEditableText),
/* harmony export */   numberSymbols: () => (/* binding */ numberSymbols),
/* harmony export */   parseNumber: () => (/* binding */ parseNumber),
/* harmony export */   readNumber: () => (/* binding */ readNumber),
/* harmony export */   roundTo: () => (/* binding */ roundTo),
/* harmony export */   stepFrom: () => (/* binding */ stepFrom)
/* harmony export */ });
// The parts of sf-quantity that are about numbers, not the page: how typed text
// reads in the page's language, how a value is written back, where a step
// lands and where the bounds hold it. Kept apart from the element so the
// contract tests run them in Node, as sf-image-field's value.mjs is.
//
// The class component (component/quantity) has its own parser, written for
// markup that may carry a mask and a soft typing mode. This one is strict: a
// character that cannot be part of a number is refused as it is typed, and the
// value is a number or nothing -- never the text that happened to be in the box.

const symbolCache = new Map();

// The decimal and group marks of a locale, from the platform's own formatter.
// An unknown locale falls back to en-US rather than throwing.
function numberSymbols(locale) {
  const key = String(locale || '');
  if (symbolCache.has(key)) return symbolCache.get(key);
  let formatter;
  try {
    formatter = new Intl.NumberFormat(key || undefined);
  } catch {
    formatter = new Intl.NumberFormat('en-US');
  }
  const parts = formatter.formatToParts(-12345.6);
  const symbols = {
    group: parts.find((part) => part.type === 'group')?.value || ',',
    decimal: parts.find((part) => part.type === 'decimal')?.value || '.',
    minus: parts.find((part) => part.type === 'minusSign')?.value || '-',
  };
  if (symbolCache.size >= 32) symbolCache.delete(symbolCache.keys().next().value);
  symbolCache.set(key, symbols);
  return symbols;
}

// Digits after the point a step implies: 0.25 has two, 1e-3 three, 5 none.
function inferPrecision(step) {
  const text = String(step ?? '').trim().toLowerCase();
  const number = Number(text);
  if (!text || !Number.isFinite(number) || number <= 0) return 0;
  const [coefficient, exponent = '0'] = text.split('e');
  const fraction = coefficient.split('.')[1]?.length || 0;
  return Math.max(0, fraction - Number(exponent));
}

// A bound or a step from an attribute: a finite number, or null when it is
// empty or not a number. Written the programmer's way, with a point.
function readNumber(raw) {
  if (raw === null || raw === undefined) return null;
  if (typeof raw === 'number') return Number.isFinite(raw) ? raw : null;
  const text = String(raw).trim();
  if (!text) return null;
  const number = Number(text);
  return Number.isFinite(number) ? number : null;
}

function clamp(value, min, max) {
  let next = value;
  if (min !== null && Number.isFinite(min)) next = Math.max(next, min);
  if (max !== null && Number.isFinite(max)) next = Math.min(next, max);
  return next;
}

// Rounded to the digits the field shows, so 0.1 + 0.2 is 0.3 and a value never
// carries more than it can draw.
function roundTo(value, precision) {
  const digits = Math.min(20, Math.max(0, Number(precision) || 0));
  const scale = 10 ** digits;
  const scaled = Math.round(value * scale) / scale;
  return Object.is(scaled, -0) ? 0 : scaled;
}

// Typed text, normalised: the locale's own minus, its group marks and the
// spaces people type between thousands go; the locale's decimal mark, and the
// other of «.» and «,» when the locale does not group with it, become a point.
function normalise(text, locale) {
  const {group, decimal, minus} = numberSymbols(locale);
  let value = String(text ?? '').replace(/[\u061c\u200e\u200f]/gu, '');
  value = value.split(minus).join('-').replace(/[\s\u00a0\u202f]/gu, '');
  const groupMark = group.replace(/[\s\u00a0\u202f]/gu, '');
  if (groupMark && groupMark !== decimal) value = value.split(groupMark).join('');
  value = value.split(decimal).join('.');
  // The other mark of the two is a decimal too, unless the locale groups with it
  // (then it is gone already): a point typed on a Russian page is a comma.
  if (decimal !== ',' && groupMark !== ',') value = value.split(',').join('.');
  return value;
}

function pattern({allowDecimal, allowNegative}) {
  const sign = allowNegative ? '-?' : '';
  return allowDecimal ? new RegExp(`^${sign}\\d*(?:\\.\\d*)?$`, 'u') : new RegExp(`^${sign}\\d*$`, 'u');
}

// Whether text can still become a number as the person goes on typing: «-»,
// «1,» and an empty box can, «1,2,3» and «12a» cannot. The strict typing rule.
function isEditableText(text, {locale, allowDecimal = false, allowNegative = false} = {}) {
  return pattern({allowDecimal, allowNegative}).test(normalise(text, locale));
}

// The number typed text says: null for an empty box, NaN for text that is not
// a whole number yet («-», «.») or not a number at all.
function parseNumber(text, {locale, allowDecimal = false, allowNegative = false} = {}) {
  const value = normalise(text, locale);
  if (value === '') return null;
  if (!pattern({allowDecimal, allowNegative}).test(value) || !/\d/u.test(value)) return Number.NaN;
  const number = Number(value);
  return Number.isFinite(number) ? number : Number.NaN;
}

// A value as the page's language writes it, with the field's digits.
function formatNumber(value, {locale, precision = 0, grouping = true} = {}) {
  if (value === null || value === undefined || !Number.isFinite(value)) return '';
  const digits = Math.min(20, Math.max(0, Number(precision) || 0));
  try {
    return new Intl.NumberFormat(locale || undefined, {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
      useGrouping: grouping,
    }).format(value);
  } catch {
    return value.toFixed(digits);
  }
}

// The value as a form submits it: a point, no grouping, the field's digits.
function formValue(value, precision = 0) {
  if (value === null || value === undefined || !Number.isFinite(value)) return '';
  return roundTo(value, precision).toFixed(Math.min(20, Math.max(0, Number(precision) || 0)));
}

// Where `count` steps from the current value land (negative counts go down).
// An empty field counts from zero; when zero is outside the bounds, the first
// step lands on the nearer bound instead: «+» on an empty field with min 1
// gives 1, not 2.
function stepFrom(current, count, {step = 1, min = null, max = null, precision = 0} = {}) {
  const size = Number.isFinite(step) && step > 0 ? step : 1;
  if (current === null || current === undefined || !Number.isFinite(current)) {
    const start = clamp(0, min, max);
    return roundTo(start === 0 ? clamp(size * count, min, max) : start, precision);
  }
  return roundTo(clamp(current + size * count, min, max), precision);
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
/******/ 	let __webpack_exports__ = __webpack_require__("9b9874fb7905");
/******/
/******/ })()
;