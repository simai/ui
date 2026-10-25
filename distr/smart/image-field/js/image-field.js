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

/***/ "3ee997e7a076"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SfImageField: () => (/* binding */ SfImageField)
/* harmony export */ });
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("fbe0570fcc69");
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("0d662e4d7d63");
/* harmony import */ var _component_field_contract__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("e138a730fd7c");
/* harmony import */ var _component_field_size__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("e6d86f2cd058");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("4a9754c1c12d");
/* harmony import */ var _value_mjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("c22743d41d10");
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("83b84a25c0f9");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_4__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_4__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__);
// sf-image-field: a form field that holds one image (simai/ui-source#27). It
// shows the image as a thumbnail with its file name and size, offers
// «Заменить…» and «Убрать», and takes a file dropped anywhere on it -- the image
// well a page editor, a brand logo or an admin media field needs. ui-mail's
// polish audit (2026-10-22, B1) found the only part the Framework had for it was
// sf-file-upload, which is a drop zone with a list of transfers: after a choice
// it kept its whole zone, showed no image and had no way to replace one.
//
// It does what sf-file-upload does with a file and no more: it raises the File
// the person chose, in the events, and transfers no bytes. The host uploads it
// and writes back the stored value, with the address the image now has. Until
// then the thumbnail shows the chosen file from an object URL, so the person
// sees what they picked at once rather than after a round trip.
//
// The field half -- label, help text, error, required, disabled, read-only --
// is the one every Framework field has (component/field-contract.js), so the
// field reads, sizes and announces itself as sf-input and sf-textarea do.






 // Every word this component says. A product adds any other language through
// SF.language.register('sf-image-field', code, words). `quoted` wraps a file
// name the way the language quotes: «…» in Russian, “…” in English.

const IMAGE_FIELD_TEXT = {
  en: {
    group: 'Image',
    choose: 'Choose…',
    chooseName: 'Choose an image',
    replace: 'Replace…',
    replaceName: 'Replace the image',
    remove: 'Remove',
    removeName: 'Remove the image',
    empty: 'No image chosen',
    emptyHint: 'Drop a file here or choose one',
    drop: 'Drop the file to use it',
    chosen: 'Image chosen',
    removed: 'Image removed',
    rejected: 'This file is not accepted',
    quoted: '“%s”',
    bytes: 'B',
    kilobytes: 'KB',
    megabytes: 'MB',
    gigabytes: 'GB'
  },
  ru: {
    group: 'Изображение',
    choose: 'Выбрать…',
    chooseName: 'Выбрать изображение',
    replace: 'Заменить…',
    replaceName: 'Заменить изображение',
    remove: 'Убрать',
    removeName: 'Убрать изображение',
    empty: 'Изображение не выбрано',
    emptyHint: 'Перетащите файл сюда или выберите его',
    drop: 'Отпустите файл, чтобы поставить его',
    chosen: 'Выбрано изображение',
    removed: 'Изображение убрано',
    rejected: 'Этот файл не подходит',
    quoted: '«%s»',
    bytes: 'Б',
    kilobytes: 'КБ',
    megabytes: 'МБ',
    gigabytes: 'ГБ'
  }
};
const DEFAULT_ACCEPT = 'image/*';
let sequence = 0;

class SfImageField extends (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()) {
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
      accept: {
        default: DEFAULT_ACCEPT
      },
      size: {
        default: '1',
        values: _component_field_size__WEBPACK_IMPORTED_MODULE_3__.FIELD_SIZES
      },
      meta: {
        default: ''
      },
      emptyText: {
        attribute: 'empty-text',
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
      // The group's name when no label is drawn: a field renderer's panel
      // prints the label beside the field, and a second, visible one inside it
      // would say it twice (the rule tests/field-control-accessible-name holds
      // for sf-input, sf-switch and the rest).
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
    this._id = `sf-image-field-${++sequence}`; // undefined: follow the attribute. Set by the property, a chosen file or a
    // removal; an attribute written later takes over again.

    this._value = undefined; // A value set as a property before the element was defined -- a lit
    // `.value` binding on a tag the loader had not upgraded yet, which is how
    // the field renderers draw it -- is an own property that would hide the
    // accessor for good and skip the normalising. It is taken through it.

    if (Object.prototype.hasOwnProperty.call(this, 'value')) {
      const early = this.value;
      delete this.value;
      this._value = (0,_value_mjs__WEBPACK_IMPORTED_MODULE_5__.normaliseImageValue)(early);
    }

    this._objectUrl = '';
    this._dimensions = new Map();
    this._failed = new Set();
    this.dragging = false;
    this.announcement = '';
    this._focusAfterRender = '';
  }

  attributeChangedCallback(name, previous, next) {
    if (name === 'value' && previous !== next && !this._writingValue) {
      this._value = undefined;

      this._releaseObjectUrl();
    }

    super.attributeChangedCallback(name, previous, next);
  }

  get size() {
    return (0,_component_field_size__WEBPACK_IMPORTED_MODULE_3__.fieldSize)(this.getAttribute('size') || '1', 'sf-image-field');
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

  get accept() {
    return this.hasAttribute('accept') ? this.getAttribute('accept') || '' : DEFAULT_ACCEPT;
  }

  get meta() {
    return this.getAttribute('meta') || '';
  }

  get emptyText() {
    return this.getAttribute('empty-text') || '';
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
  } // The image the field holds, in the file shape, or null when it is empty.


  get value() {
    if (this._value !== undefined) return this._value;
    return (0,_value_mjs__WEBPACK_IMPORTED_MODULE_5__.normaliseImageValue)(this.getAttribute('value'));
  } // Set from code, the value is not a change: no event, as for a native field.


  set value(next) {
    this.setValue(next);
  }

  setValue(next) {
    const value = (0,_value_mjs__WEBPACK_IMPORTED_MODULE_5__.normaliseImageValue)(next);
    if (value?.href !== this._objectUrl) this._releaseObjectUrl();
    this._value = value;
    this.requestComponentUpdate('value');
    return this;
  }

  clear() {
    return this.setValue(null);
  } // The audit's setError: an error message the field shows in place of its
  // hint, or none. It is the error-message and invalid attributes, which is what a
  // host writing them by hand gets too.


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

  get interactive() {
    return !this.disabled && !this.readonly;
  }

  text(key) {
    return (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(IMAGE_FIELD_TEXT, key, this, 'sf-image-field');
  }

  quote(name) {
    return this.text('quoted').replace('%s', name);
  } // A size as people read it, in the page's language: «2 КБ», «1,4 МБ». Text
  // the host already formatted is shown as it came.


  formatSize(size) {
    const units = ['bytes', 'kilobytes', 'megabytes', 'gigabytes'].map(key => this.text(key));
    return (0,_value_mjs__WEBPACK_IMPORTED_MODULE_5__.formatFileSize)(size, units, (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageLocale)(this));
  } // «450×300 · 2 КБ»: the image's own dimensions once it has loaded, then its
  // size. The host's `meta` replaces the line when it knows better.


  metaText(value) {
    if (this.meta) return this.meta;
    if (!value) return '';
    const dimensions = value.href ? this._dimensions.get(value.href) : null;
    return [dimensions ? `${dimensions.width}×${dimensions.height}` : '', this.formatSize(value.size)].filter(Boolean).join(' · ');
  }

  input() {
    return this.querySelector(':scope .sf-image-field-input');
  }

  focusDelegate() {
    return this.querySelector(':scope .sf-image-field-actions button:not([disabled])');
  } // Opens the platform's file dialog, as «Заменить…» and «Выбрать…» do.


  choose() {
    if (!this.interactive) return false;
    const input = this.input();
    if (!input) return false;
    input.click();
    return true;
  } // The person chose a file: from the dialog (source input) or by dropping it
  // (source drop). The thumbnail shows it at once from an object URL; the host
  // hears of it in input, change and sf-image-field:select, each carrying the
  // File, and uploads it.


  takeFile(file, source = 'input') {
    if (!file || !this.interactive) return false;

    if (!(0,_value_mjs__WEBPACK_IMPORTED_MODULE_5__.acceptsFile)(this.accept, file)) {
      this.reject([file], source);
      return false;
    }

    this._releaseObjectUrl();

    let href = '';

    try {
      href = URL.createObjectURL(file);
      this._objectUrl = href;
    } catch {
      href = '';
    }

    const value = {
      value: '',
      label: file.name,
      mime: file.type || '',
      size: file.size,
      href,
      file
    };
    this._value = value;
    this.announce(`${this.text('chosen')} ${this.quote(file.name)}`);
    this.requestComponentUpdate('value');

    this._emitValue({
      value,
      file,
      source
    });

    this.dispatchEvent(new CustomEvent('sf-image-field:select', {
      bubbles: true,
      composed: true,
      detail: {
        file,
        source,
        value,
        name: this.name
      }
    }));
    return true;
  } // The person removed the image. Focus goes to «Выбрать…», which is where the
  // removed button stood, so the keyboard does not fall back to the page. Not
  // called remove(): that is the element's own removal from the document.


  removeImage() {
    const previous = this.value;
    if (!previous || !this.interactive) return false;

    this._releaseObjectUrl();

    this._value = null;
    const input = this.input();
    if (input) input.value = '';
    this._focusAfterRender = 'choose';
    this.announce(this.text('removed'));
    this.requestComponentUpdate('value');

    this._emitValue({
      value: null,
      file: null,
      source: 'remove'
    });

    this.dispatchEvent(new CustomEvent('sf-image-field:remove', {
      bubbles: true,
      composed: true,
      detail: {
        value: previous,
        name: this.name
      }
    }));
    return true;
  }

  reject(files, source) {
    const names = files.map(file => this.quote(file.name)).join(', ');
    this.announce(`${this.text('rejected')}: ${names}`);
    this.dispatchEvent(new CustomEvent('sf-image-field:reject', {
      bubbles: true,
      composed: true,
      detail: {
        files,
        accept: this.accept,
        source
      }
    }));
  } // Said in the polite status, as sf-help-mark and sf-copy-button say theirs.
  // Cleared first, so the same words twice are heard twice.


  announce(message) {
    this.announcement = '';
    this.requestComponentUpdate('announce-clear');
    clearTimeout(this._announceTimer);
    this._announceTimer = setTimeout(() => {
      this.announcement = message;
      this.requestComponentUpdate('announce');
    }, 50);
  } // `input` and `change` once each per choice or removal, as a native file
  // input sends them, on the host with the value, the File and the form name.


  _emitValue({
    value,
    file,
    source
  }) {
    for (const type of ['input', 'change']) {
      this.dispatchEvent(new CustomEvent(type, {
        bubbles: true,
        composed: true,
        detail: {
          value,
          file,
          source,
          name: this.name
        }
      }));
    }
  }

  _releaseObjectUrl() {
    if (!this._objectUrl) return;

    try {
      URL.revokeObjectURL(this._objectUrl);
    } catch {// Nothing to release.
    }

    this._dimensions.delete(this._objectUrl);

    this._objectUrl = '';
  } // The dialog's own change. It also bubbles out of the host as a plain Event
  // with no detail -- a second change for the one this dispatches -- so it
  // stops here, as sf-color's does.


  onInputChange(event) {
    event.stopPropagation();
    const file = event.target?.files?.[0];
    if (file) this.takeFile(file, 'input');
  }

  onInputEvent(event) {
    event.stopPropagation();
  } // A file held over the field: the whole field is the target, and says so --
  // the border and fill of a selection and the words «Отпустите файл…». Only a
  // drag that carries files is taken, so text dragged across a form is not.


  onDragOver(event) {
    if (!Array.from(event.dataTransfer?.types || []).includes('Files')) return;
    event.preventDefault();

    if (!this.interactive) {
      event.dataTransfer.dropEffect = 'none';
      return;
    }

    event.dataTransfer.dropEffect = 'copy';

    if (!this.dragging) {
      this.dragging = true;
      this.requestComponentUpdate('drag');
    }
  }

  onDragLeave(event) {
    const well = event.currentTarget;
    if (event.relatedTarget && well.contains(event.relatedTarget)) return;
    if (!this.dragging) return;
    this.dragging = false;
    this.requestComponentUpdate('drag');
  }

  onDrop(event) {
    const types = Array.from(event.dataTransfer?.types || []);
    const files = Array.from(event.dataTransfer?.files || []);
    if (!files.length && !types.includes('Files')) return;
    event.preventDefault();

    if (this.dragging) {
      this.dragging = false;
      this.requestComponentUpdate('drag');
    }

    if (!this.interactive || !files.length) return; // One image: the first file the field accepts. The rest are reported, as
    // sf-file-upload reports a drop the accept list leaves out.

    const accepted = files.find(file => (0,_value_mjs__WEBPACK_IMPORTED_MODULE_5__.acceptsFile)(this.accept, file));
    const rejected = files.filter(file => !(0,_value_mjs__WEBPACK_IMPORTED_MODULE_5__.acceptsFile)(this.accept, file));
    if (rejected.length) this.reject(rejected, 'drop');
    if (!accepted) return; // The native input holds the dropped file too, so a form that submits
    // this field sends it under `name` as it sends a picked one.

    const input = this.input();

    if (input && typeof DataTransfer === 'function') {
      try {
        const transfer = new DataTransfer();
        transfer.items.add(accepted);
        input.files = transfer.files;
      } catch {// A browser without a settable FileList still raises the File.
      }
    }

    this.takeFile(accepted, 'drop');
  }

  onImageLoad(event, href) {
    const image = event.target;
    if (!href || !image?.naturalWidth) return;

    const known = this._dimensions.get(href);

    if (known && known.width === image.naturalWidth && known.height === image.naturalHeight) return;

    this._dimensions.set(href, {
      width: image.naturalWidth,
      height: image.naturalHeight
    });

    this.requestComponentUpdate('dimensions');
  }

  onImageError(href) {
    if (!href || this._failed.has(href)) return;

    this._failed.add(href);

    this.requestComponentUpdate('image-error');
  }

  afterRender(callback) {
    if (typeof callback === 'function') return super.afterRender(callback);

    if (this._focusAfterRender) {
      this._focusAfterRender = ''; // The sf-button host, not its inner button: a button drawn in this
      // render has not drawn its own yet, and the host's focus() waits for it.

      this.querySelector(':scope .sf-image-field-actions sf-button:not([disabled])')?.focus({
        preventScroll: true
      });
    }

    return undefined;
  }

  onDisconnected() {
    clearTimeout(this._announceTimer);
  }

  templateContext() {
    const props = this.getPropsContext();
    const value = this.value;
    const field = (0,_component_field_contract__WEBPACK_IMPORTED_MODULE_2__.createFieldContract)(this, {
      prefix: 'sf-image-field',
      required: this.required,
      invalid: this.invalid || this.error,
      hint: this.hint,
      errorMessage: this.errorMessage
    });
    const errorContent = this.hasSlotContent?.('error') ? this.getSlotContent('error') : this.errorMessage;
    const hintContent = this.hasSlotContent?.('hint') ? this.getSlotContent('hint') : this.hint;
    const fileName = value?.label || '';
    const words = Object.fromEntries(Object.keys(IMAGE_FIELD_TEXT.en).map(key => [key, this.text(key)]));
    return this.createTemplateContext({ ...props,
      component: this,
      id: this._id,
      field,
      value,
      size: this.size,
      accept: this.accept,
      fileName,
      metaText: this.metaText(value),
      broken: Boolean(value?.href && this._failed.has(value.href)),
      dragging: this.dragging && this.interactive,
      interactive: this.interactive,
      announcement: this.announcement,
      message: field.invalid && errorContent ? errorContent : hintContent,
      messageKind: field.invalid && errorContent ? 'error' : 'hint',
      words,
      names: {
        group: this.label || this.ariaLabel || words.group,
        choose: words.chooseName,
        replace: fileName ? `${words.replaceName} ${this.quote(fileName)}` : words.replaceName,
        remove: fileName ? `${words.removeName} ${this.quote(fileName)}` : words.removeName
      },
      rootClass: this.getRootClass()
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_4__.renderImageFieldTemplate)(this.templateContext());
  }

}

SfImageField.define('sf-image-field');

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "4a9754c1c12d"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderImageFieldTemplate: () => (/* binding */ renderImageFieldTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ddf1cdb42ecc");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
 // The buttons are one rung below the field, as a field's own trailing controls
// are: a size 1 field (a 40px control row) carries size 1/2 buttons.

const BUTTON_SIZE = {
  '1/2': '1/3',
  '1': '1/2',
  '2': '1'
}; // What stands in the thumbnail when there is no picture to show: an invitation
// while the field is empty, a broken image when the address did not load, and
// a plain image glyph for a value the host gave without an address.

function thumbIcon(context) {
  if (!context.value) return 'add_photo_alternate';
  if (context.broken) return 'broken_image';
  return 'image';
}

function renderThumb(context) {
  const {
    value,
    component
  } = context;
  const href = value?.href || '';

  if (href && !context.broken) {
    // The image is fitted, never stretched or cropped: a logo 900×300 stays a
    // logo. alt is the file's name, the one thing the field knows about it.
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<img class="sf-image-field-image" src=${href} alt=${context.fileName}
                     @load=${event => component.onImageLoad(event, href)}
                     @error=${() => component.onImageError(href)}>`;
  }

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class="sf-icon" aria-hidden="true">${thumbIcon(context)}</i>`;
}

function renderActions(context) {
  const {
    component,
    value,
    words,
    names,
    field
  } = context;
  if (context.readonly) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const size = BUTTON_SIZE[context.size] ?? '1/2';
  const describedBy = context.message ? field.messageId : lit__WEBPACK_IMPORTED_MODULE_0__.nothing; // Real buttons with names that say what they act on: «Заменить изображение
  // «logo.png»», each beginning with its visible words so a voice command
  // naming what is seen still reaches it.

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <span class="sf-image-field-actions">
      ${value ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
          <sf-button class="sf-image-field-replace" size=${size} appearance="outline" scheme="on-surface"
                     text=${words.replace} aria-label=${names.replace} aria-describedby=${describedBy}
                     ?disabled=${context.disabled}
                     @click=${() => component.choose()}></sf-button>
          <sf-button class="sf-image-field-remove" size=${size} appearance="link" scheme="on-surface"
                     text=${words.remove} aria-label=${names.remove}
                     ?disabled=${context.disabled}
                     @click=${() => component.removeImage()}></sf-button>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
          <sf-button class="sf-image-field-choose" size=${size} appearance="outline" scheme="on-surface"
                     text=${words.choose} aria-label=${names.choose} aria-describedby=${describedBy}
                     ?disabled=${context.disabled}
                     @click=${() => component.choose()}></sf-button>`}
    </span>
  `;
}

function renderImageFieldTemplate(context) {
  const {
    component,
    field,
    value,
    words
  } = context;
  const labelId = `${context.id}-label`;
  const rootClasses = ['sf-image-field', `sf-image-field--size-${context.size}`, value ? 'sf-image-field--filled' : 'sf-image-field--empty', field.invalid ? 'error' : '', context.dragging ? 'dragover' : '', context.disabled ? 'disabled' : '', context.readonly ? 'readonly' : '', context.rootClass].filter(Boolean);
  const title = context.dragging ? words.drop : value ? context.fileName || words.group : context.emptyText || words.empty;
  const meta = context.dragging ? '' : value ? context.metaText : context.interactive ? words.emptyHint : '';
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div class=${rootClasses.join(' ')} style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
      ${context.label ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
          <span class="sf-image-field-label" id=${labelId}>
            <span class="sf-image-field-label-text">${context.label}</span>
            ${field.required ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-image-field-required">*</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          </span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}

      <div class="sf-image-field-well"
           role="group"
           aria-labelledby=${context.label ? labelId : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
           aria-label=${context.label ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : context.names.group}
           aria-describedby=${context.message ? field.messageId : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
           aria-invalid=${field.invalid ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
           @dragenter=${event => component.onDragOver(event)}
           @dragover=${event => component.onDragOver(event)}
           @dragleave=${event => component.onDragLeave(event)}
           @drop=${event => component.onDrop(event)}>
        <span class="sf-image-field-thumb">${renderThumb(context)}</span>
        <span class="sf-image-field-body">
          <span class="sf-image-field-name">${title}</span>
          ${meta ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-image-field-meta">${meta}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        </span>
        ${renderActions(context)}
      </div>

      <input type="file"
             class="sf-image-field-input"
             id=${field.controlId}
             name=${context.name || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
             accept=${context.accept || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
             tabindex="-1"
             aria-hidden="true"
             ?required=${field.required && !value}
             ?disabled=${context.disabled || context.readonly}
             @change=${event => component.onInputChange(event)}
             @input=${event => component.onInputEvent(event)}>

      ${context.message ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span id=${field.messageId} class="sf-image-field-message"
                     data-field-message=${context.messageKind}>${context.message}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}

      <span class="sf-image-field-live" role="status" aria-live="polite" aria-atomic="true">${context.announcement}</span>
    </div>
  `;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "83b84a25c0f9"
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

/***/ "c22743d41d10"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   acceptsFile: () => (/* binding */ acceptsFile),
/* harmony export */   formatFileSize: () => (/* binding */ formatFileSize),
/* harmony export */   normaliseImageValue: () => (/* binding */ normaliseImageValue)
/* harmony export */ });
// The parts of sf-image-field that are about data, not the page: which files
// the field accepts, the shape its value takes and how a size reads. Kept
// apart from the element so the contract tests can run them in Node, as
// sf-resizer's engine.mjs is.

// Whether a file is one the accept list names: `.ext`, `type/*` or `type/sub`,
// as the platform dialog reads it. The dialog filters what a person may pick;
// a drop goes past it and would take any file at all. It is the rule
// sf-file-upload applies to a drop, written again here rather than imported:
// that module binds every .sf-file-upload on the page as it loads, which a
// page with only an image field has no use for.
function acceptsFile(accept, file) {
  const tokens = String(accept || '').split(',').map((token) => token.trim().toLowerCase()).filter(Boolean);
  if (!tokens.length) return true;
  const name = String(file?.name || '').toLowerCase();
  const type = String(file?.type || '').toLowerCase();
  return tokens.some((token) => {
    if (token.startsWith('.')) return name.endsWith(token);
    if (token.endsWith('/*')) return type.startsWith(token.slice(0, -1));
    return type === token;
  });
}

function nameFromAddress(href) {
  const tail = String(href).split(/[?#]/u)[0].split('/').pop() || '';
  try {
    return decodeURIComponent(tail);
  } catch {
    return tail;
  }
}

// The value is the file shape the Framework already uses for a stored file --
// the property-view `file` type and the field renderers' file cell:
// {value, label, mime, size, href}. `value` is the host's id for the file,
// `label` its name, `size` bytes (a number) or text the host already
// formatted, `href` the address the image is shown from. A string is taken as
// the address alone, which is what a page with nothing but a URL has; JSON in
// the attribute is the whole shape. Anything else is no image: null.
function normaliseImageValue(input) {
  if (input === null || input === undefined || input === '') return null;
  let source = input;
  if (typeof source === 'string') {
    const text = source.trim();
    if (!text) return null;
    if (text.startsWith('{')) {
      try {
        source = JSON.parse(text);
      } catch {
        return null;
      }
    } else {
      source = {href: text};
    }
  }
  if (typeof source !== 'object' || Array.isArray(source)) return null;
  const href = source.href ? String(source.href) : '';
  const label = String(source.label ?? source.name ?? (href ? nameFromAddress(href) : ''));
  const id = source.value === undefined || source.value === null ? '' : String(source.value);
  if (!href && !label && !id) return null;
  const value = {
    value: id,
    label,
    mime: String(source.mime ?? source.mimeType ?? ''),
    size: typeof source.size === 'number' ? source.size : String(source.size ?? ''),
    href,
  };
  // A file chosen in this page and not stored yet carries the File itself.
  if (source.file) value.file = source.file;
  return value;
}

// A size as people read it: «2 КБ», «1,4 МБ». `units` are the four words in
// the page's language, `locale` its formatting. Text the host already
// formatted is returned as it came; anything that is not a size is ''.
function formatFileSize(size, units = ['B', 'KB', 'MB', 'GB'], locale = 'en') {
  if (typeof size === 'string') return size;
  const bytes = Number(size);
  if (size === null || size === undefined || !Number.isFinite(bytes) || bytes < 0) return '';
  let amount = bytes;
  let index = 0;
  while (amount >= 1024 && index < units.length - 1) {
    amount /= 1024;
    index += 1;
  }
  const digits = index === 0 || amount >= 10 ? 0 : 1;
  let number;
  try {
    number = new Intl.NumberFormat(locale, {maximumFractionDigits: digits}).format(amount);
  } catch {
    number = amount.toFixed(digits);
  }
  return `${number} ${units[index]}`;
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
/******/ 	let __webpack_exports__ = __webpack_require__("3ee997e7a076");
/******/
/******/ })()
;