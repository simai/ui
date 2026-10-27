/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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

/***/ "e4b691e01e6b"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("fbe0570fcc69");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("c22590307c6c");
/* harmony import */ var _component_field_size__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("e6d86f2cd058");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _js_templates_default__WEBPACK_IMPORTED_MODULE_1__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _js_templates_default__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);


 // A row a person reaches by keyboard (interactive, or an item of an sf-sortable
// list) is one stop of its list: the list is a single Tab stop and the arrows,
// Home and End move between its rows (simai/ui-source#29, ui-mail P-14: twenty
// blocks were forty Tab stops). The list is the nearest sf-sortable, listbox,
// list or [data-sf-list] around the row, else the row's parent.

const ROVING = '[data-sf-list-roving]';
const LIST = 'sf-sortable, [role="listbox"], [role="list"], [data-sf-list]';
const INTERACTIVE = 'a[href], button, input, select, textarea, summary, [contenteditable]:not([contenteditable="false"]), [tabindex]:not([data-sf-list-roving])';
const pendingLists = new Set();

function listOf(row) {
  const host = row.closest('sf-list-item') || row;
  return host.parentElement?.closest(LIST) || host.parentElement;
}

function rowsOf(list) {
  return [...list.querySelectorAll(ROVING)].filter(row => listOf(row) === list);
} // A keyboard reorder in progress owns the arrows: the shared session of every
// sf-sortable bundle lives on this global.


function reordering() {
  return Boolean(globalThis.__sfSortableSharedV1?.session);
} // The one row of a list that takes Tab: the one that last had the focus, else
// the selected one, else the first that is not disabled.


function syncRoving(list) {
  if (!list?.isConnected) return;
  const rows = rowsOf(list);
  const usable = rows.filter(row => !row.classList.contains('disabled'));
  const current = usable.find(row => row.dataset.sfListCurrent === 'true') || usable.find(row => row.classList.contains('selected')) || usable[0];

  for (const row of rows) {
    row.tabIndex = row === current ? 0 : -1;
    if (row !== current) delete row.dataset.sfListCurrent;
  }
}

function scheduleRoving(list) {
  if (!list || pendingLists.has(list)) return;
  pendingLists.add(list);
  queueMicrotask(() => {
    pendingLists.delete(list);
    syncRoving(list);
  });
}

function moveTo(row) {
  const list = listOf(row);

  for (const other of rowsOf(list)) delete other.dataset.sfListCurrent;

  row.dataset.sfListCurrent = 'true';
  syncRoving(list);
  row.focus();
}

function normalizeSizeGroup(value) {
  const size = value;

  if (size === '1/3' || size === '1/2') {
    return {
      item: size,
      checkbox: (0,_component_field_size__WEBPACK_IMPORTED_MODULE_2__.nearestFieldSize)(size),
      avatarGroup: '1/2',
      colorTag: '1/2'
    };
  }

  return {
    item: size,
    checkbox: (0,_component_field_size__WEBPACK_IMPORTED_MODULE_2__.nearestFieldSize)(size),
    avatarGroup: size,
    colorTag: '1'
  };
}

class SfListItem extends (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()) {
  static get props() {
    return {
      templateName: {
        attribute: 'template',
        default: 'default'
      },
      itemValue: {
        attribute: 'value',
        default: ''
      },
      // The axis is called kind, because that is the question it answers.
      // `type` keeps working: see contracts/public-api-axes.json.
      kind: {
        default: 'text',
        values: ['text', 'icon', 'checkbox', 'avatar', 'color'],
        aliases: ['type']
      },
      size: {
        default: '1',
        values: ['1/3', '1/2', '1', '2', '3']
      },
      text: {
        default: ''
      },
      icon: {
        default: 'person'
      },
      checked: {
        type: Boolean,
        default: false
      },
      selected: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      colorClass: {
        default: 'bg-tertiary'
      },
      avatarImageUrl: {
        default: ''
      },
      avatarTitle: {
        default: ''
      },
      ariaLabel: {
        default: ''
      },
      // The general row (simai/ui-source#18): a supporting line under the
      // title, a row a person acts on, a row of an sf-sortable list (its item
      // id), and a pinned row of such a list that has no handle and does not move.
      supporting: {
        default: ''
      },
      interactive: {
        type: Boolean,
        default: false
      },
      sortableItem: {
        attribute: 'sortable-item',
        default: ''
      },
      pinned: {
        type: Boolean,
        default: false
      }
    };
  }

  connectedCallback() {
    super.connectedCallback();
    if (this._rowBound) return;
    this._rowBound = true;
    this.addEventListener('sf-after-render', () => {
      const row = this.querySelector(':scope > .sf-list-item');
      if (row?.matches(ROVING)) scheduleRoving(listOf(row));
    });
    this.addEventListener('keydown', event => this.onRowKeyDown(event));
    this.addEventListener('click', event => this.onRowClick(event));
    this.addEventListener('focusin', event => {
      const row = this.querySelector(':scope > .sf-list-item');

      if (row?.matches(ROVING) && event.target === row && row.tabIndex !== 0) {
        for (const other of rowsOf(listOf(row))) delete other.dataset.sfListCurrent;

        row.dataset.sfListCurrent = 'true';
        syncRoving(listOf(row));
      }
    });
  }

  disconnectedCallback() {
    const row = this.querySelector(':scope > .sf-list-item');
    const list = row?.matches(ROVING) ? listOf(row) : null;
    super.disconnectedCallback?.();
    if (list) scheduleRoving(list);
  } // The row takes focus on the host's behalf: the host is boxless.


  focusDelegate() {
    const row = this.querySelector(':scope > .sf-list-item');
    return row?.matches(ROVING) ? row : null;
  }

  onRowKeyDown(event) {
    const row = this.querySelector(':scope > .sf-list-item');
    if (!row?.matches(ROVING) || event.target !== row || event.defaultPrevented || reordering()) return;
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const rows = rowsOf(listOf(row)).filter(entry => !entry.classList.contains('disabled'));
    const at = rows.indexOf(row);
    const target = {
      ArrowDown: rows[at + 1],
      ArrowUp: rows[at - 1],
      Home: rows[0],
      End: rows.at(-1)
    }[event.key];

    if (target !== undefined) {
      event.preventDefault();
      if (target && target !== row) moveTo(target);
      return;
    } // Enter acts on a row, unless the row is an item of an sf-sortable list:
    // there Space and Enter pick it up, as the list's instructions say.


    if (event.key === 'Enter' && this.interactive && !row.hasAttribute('data-sf-sortable-item')) {
      event.preventDefault();
      this.activate(event);
    }
  }

  onRowClick(event) {
    const row = this.querySelector(':scope > .sf-list-item');
    if (!this.interactive || !row || !row.contains(event.target)) return; // A control inside the row (a trailing action) acts for itself.

    const control = event.target.closest(INTERACTIVE);
    if (control && control !== row && row.contains(control)) return;

    if (row.matches(ROVING) && listOf(row)) {
      for (const other of rowsOf(listOf(row))) delete other.dataset.sfListCurrent;

      row.dataset.sfListCurrent = 'true';
      syncRoving(listOf(row));
    }

    this.activate(event);
  }

  activate(event) {
    if (this.disabled) return;
    this.dispatchEvent(new CustomEvent('sf-list-item-activate', {
      bubbles: true,
      composed: true,
      detail: {
        value: this.itemValue,
        item: this,
        trigger: event?.type === 'keydown' ? 'keyboard' : 'pointer'
      }
    }));
  }

  get supporting() {
    return this.getAttribute('supporting') || '';
  }

  get interactive() {
    return this.getBooleanAttr('interactive', false);
  }

  get sortableItem() {
    return this.getAttribute('sortable-item') || '';
  }

  get pinned() {
    return this.getBooleanAttr('pinned', false);
  }

  get componentName() {
    return 'list-item';
  }

  get templateName() {
    return this.getAttribute('template') || 'default';
  }

  get kind() {
    return this.getProp('kind');
  } // The legacy name, kept so a consumer reading el.type still gets an answer.


  get type() {
    return this.kind;
  }

  get itemValue() {
    return this.getAttribute('value') || '';
  }

  get size() {
    return this.getEnumAttr('size', ['1/3', '1/2', '1', '2', '3'], '1');
  }

  get sizeGroup() {
    return normalizeSizeGroup(this.size);
  }

  get text() {
    return this.getAttribute('text') || '';
  }

  get icon() {
    return this.getAttribute('icon') || 'person';
  }

  get checked() {
    return this.getBooleanAttr('checked', false);
  }

  get selected() {
    return this.getBooleanAttr('selected', false);
  }

  get disabled() {
    return this.getBooleanAttr('disabled', false);
  }

  get colorClass() {
    return this.getAttribute('color-class') || 'bg-tertiary';
  }

  get avatarImageUrl() {
    return this.getAttribute('avatar-image-url') || '';
  }

  get avatarTitle() {
    return this.getAttribute('avatar-title') || this.text;
  }

  get ariaLabel() {
    return this.getAttribute('aria-label') || '';
  }

  templateContext() {
    const props = this.getPropsContext();
    return this.createTemplateContext({ ...props,
      component: this,
      sizeGroup: this.sizeGroup,
      avatarTitle: this.avatarTitle,
      supporting: this.supporting,
      interactive: this.interactive,
      sortableItem: this.sortableItem,
      pinned: this.pinned,
      // Resolved names the template reads (contracts/template-context.json).
      type: this.type,
      value: this.itemValue,
      option: false
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_1__.renderListItemTemplate)(this.templateContext());
  }

  resolveUpdateMode(changedAttributes = []) {
    if (changedAttributes.length > 0 && !this.supporting && !this.interactive && !this.sortableItem && changedAttributes.every(attr => ['text', 'aria-label', 'disabled', 'selected', 'checked'].includes(attr))) {
      return 'dom';
    }

    return 'lit';
  }

  updateDom(changedAttributes = []) {
    const root = this.querySelector('.sf-list-item');
    const textNode = this.querySelector('.sf-list-item-container, .sf-avatar-label-group-title, .sf-tag-container');
    const checkbox = this.querySelector('.sf-checkbox input');
    if (!root) return false;

    if (changedAttributes.includes('text') && textNode) {
      textNode.textContent = this.text;
    }

    if (changedAttributes.includes('disabled')) {
      root.classList.toggle('disabled', this.disabled);

      if (checkbox) {
        checkbox.disabled = this.disabled;
      }
    }

    if (changedAttributes.includes('selected')) {
      root.classList.toggle('selected', this.selected);
    }

    if (checkbox && (changedAttributes.includes('checked') || changedAttributes.includes('selected'))) {
      checkbox.checked = this.checked || this.selected;
    }

    return true;
  }

  get value() {
    return {
      template: this.templateName,
      value: this.itemValue,
      type: this.type,
      size: this.size,
      text: this.text,
      icon: this.icon,
      checked: this.checked,
      selected: this.selected,
      disabled: this.disabled,
      colorClass: this.colorClass,
      avatarImageUrl: this.avatarImageUrl,
      avatarTitle: this.avatarTitle,
      ariaLabel: this.ariaLabel,
      supporting: this.supporting,
      interactive: this.interactive,
      sortableItem: this.sortableItem,
      pinned: this.pinned
    };
  }

  set value(nextValue) {
    if (!nextValue || typeof nextValue !== 'object') return;
    const {
      value: itemValue,
      ...attributes
    } = nextValue;

    if (Object.prototype.hasOwnProperty.call(nextValue, 'value')) {
      this.setAttributeValue('value', itemValue);
    }

    this.setValueAttributes(attributes);
  }

}

SfListItem.define('sf-list-item');
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "c22590307c6c"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   optionSizeGroup: () => (/* binding */ optionSizeGroup),
/* harmony export */   renderListItemHeading: () => (/* binding */ renderListItemHeading),
/* harmony export */   renderListItemOption: () => (/* binding */ renderListItemOption),
/* harmony export */   renderListItemTemplate: () => (/* binding */ renderListItemTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ddf1cdb42ecc");
/* harmony import */ var _component_field_size__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("e6d86f2cd058");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);

 // The mark in a row's box is bound as a property, not as an attribute. A press
// anywhere in the row reaches the label that holds this input and flips its live
// `checked`, after which the attribute controls nothing: a row unticked by its
// owner went on showing a tick, with the row's own highlight gone from under it.

function renderListItemTemplate(context) {
  const isOption = context.option === true;
  const textContent = context.component?.hasSlotContent?.("text") ? context.component.getSlotContent("text") : context.text;
  const leadingContent = context.component?.hasSlotContent?.("leading") ? context.component.getSlotContent("leading") : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const trailingContent = context.component?.hasSlotContent?.("trailing") ? context.component.getSlotContent("trailing") : lit__WEBPACK_IMPORTED_MODULE_0__.nothing; // A general list row (simai/ui-source#18): a second, supporting line under
  // the title; a row a person acts on (interactive); a row of an sf-sortable
  // list, which carries the list's item id and a drag handle, or is pinned and
  // carries neither. None of these exist for an option, which Dropdown owns.

  const supportingContent = !isOption && context.component?.hasSlotContent?.("supporting") ? context.component.getSlotContent("supporting") : !isOption && context.supporting || lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const twoLine = supportingContent !== lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const sortableItem = !isOption && !context.pinned ? context.sortableItem || "" : "";
  const handleSlot = !isOption && Boolean(context.sortableItem || context.pinned);
  const roving = !isOption && Boolean(context.interactive || sortableItem);
  const classes = ["sf-list-item", "flex", "items-cross-center", `sf-list-item--${context.kind ?? context.type}`, `sf-list-item--size-${context.size}`, isOption ? "cursor-pointer" : "", context.selected ? "selected" : "", context.disabled ? "disabled" : "", twoLine ? "sf-list-item--two-line" : "", !isOption && context.interactive ? "sf-list-item--interactive" : "", handleSlot ? "sf-list-item--sortable" : "", !isOption && context.pinned ? "sf-list-item--pinned" : "", context.rootClass].filter(Boolean);
  const wrapClasses = ["sf-list-item-wrap", "flex", "flex-1"];
  const isDecoratedType = ["icon", "checkbox", "avatar", "color"].includes(context.type);

  if (isDecoratedType) {
    wrapClasses.push("flex", "flex-row", "flex-nowrap", "items-center", "gap-2");
  }

  if (context.type === "avatar" || context.type === "color") {
    wrapClasses.splice(wrapClasses.indexOf("gap-2"), 1);
    wrapClasses.push("justify-between", "gap-2");
  }

  const renderLeading = () => {
    if (leadingContent !== lit__WEBPACK_IMPORTED_MODULE_0__.nothing) return leadingContent;

    if (context.type === "icon") {
      return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class="sf-icon" aria-hidden="true">${context.icon}</i>`;
    }

    if (context.type === "checkbox") {
      return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <label
          class="sf-checkbox sf-checkbox--size-${context.sizeGroup.checkbox} flex"
          aria-hidden="true"
        >
          <span class="sf-checkbox-box flex">
            <input
              .checked=${Boolean(context.checked || context.selected)}
              ?disabled=${context.disabled}
              tabindex="-1"
              type="checkbox"
            />
            <span class="sf-icon" aria-hidden="true"></span>
          </span>
        </label>
      `;
    }

    if (context.type === "avatar") {
      const avatarClasses = ["sf-avatar", `sf-avatar--size-${context.sizeGroup.item === "1/3" || context.sizeGroup.item === "1/2" ? "1/3" : context.sizeGroup.item === "1" ? "1/2" : context.sizeGroup.item === "2" ? "1" : "2"}`, "bg-cover", context.disabled ? "disabled" : ""].filter(Boolean);
      return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div
          class="sf-avatar-label-group sf-avatar-label-group--size-${context.sizeGroup.avatarGroup} flex items-cross-center"
        >
          <span
            class=${avatarClasses.join(" ")}
            aria-hidden="true"
            style=${context.avatarImageUrl ? `background-image: url(${context.avatarImageUrl});` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          ></span>
          <div class="sf-avatar-label-group-container flex flex-col">
            <div class="sf-avatar-label-group-title">
              ${context.avatarTitle}
            </div>
          </div>
        </div>
      `;
    }

    if (context.type === "color") {
      const tagClasses = ["sf-tag", "sf-tag--color", `sf-tag--size-${context.sizeGroup.colorTag}`, "flex", "flex-row", "flex-nowrap", "items-center", "flex-1", context.disabled ? "disabled" : ""].filter(Boolean);
      return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class=${tagClasses.join(" ")}>
          <span class="sf-tag-color-icon ${context.colorClass}" aria-hidden="true"></span>
          <span class="sf-tag-container">${textContent}</span>
        </div>
      `;
    }

    return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  };

  const renderText = () => {
    if (context.type === "color") return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
    if (context.type === "avatar") return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;

    if (twoLine) {
      return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-list-item-container"><span class="sf-list-item-title">${textContent}</span><span class="sf-list-item-supporting">${supportingContent}</span></div>`;
    }

    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-list-item-container">${textContent}</div>`;
  }; // The handle stands in a slot of its own before everything else; a pinned
  // row keeps the slot empty, so its text starts where its neighbours' does.


  const renderHandle = () => {
    if (!handleSlot) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-list-item-handle" ?data-sf-sortable-handle=${Boolean(sortableItem)} aria-hidden="true">${sortableItem ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class="sf-icon">drag_indicator</i>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}</span>`;
  };

  const renderTrailing = () => {
    if (trailingContent !== lit__WEBPACK_IMPORTED_MODULE_0__.nothing) return trailingContent;

    if (context.type === "avatar" || context.type === "color") {
      return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <label
          class="sf-checkbox sf-checkbox--size-${context.sizeGroup.checkbox} flex"
          aria-hidden="true"
        >
          <span class="sf-checkbox-box flex">
            <input
              .checked=${Boolean(context.checked || context.selected)}
              ?disabled=${context.disabled}
              tabindex="-1"
              type="checkbox"
            />
            <span class="sf-icon" aria-hidden="true"></span>
          </span>
        </label>
      `;
    }

    return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  };

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div
      class=${classes.join(" ")}
      style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      role=${isOption ? "option" : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      tabindex=${isOption ? "-1" : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      data-value=${isOption ? context.value || lit__WEBPACK_IMPORTED_MODULE_0__.nothing : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      aria-label=${isOption || roving ? context.ariaLabel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      title=${isOption ? context.ariaLabel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      aria-disabled=${(isOption || roving) && context.disabled ? "true" : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      aria-selected=${isOption ? context.selected ? "true" : "false" : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      data-sf-sortable-item=${sortableItem || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      ?data-sf-list-roving=${roving}
      aria-current=${roving && context.selected ? "true" : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    >
      ${renderHandle()}
      <div class=${wrapClasses.join(" ")}>
        ${renderLeading()} ${renderText()} ${renderTrailing()}
      </div>
    </div>
  `;
} // A row in a listbox, which is what an option is: the same row, told that it
// takes a place in a list, so it carries the listbox roles and answers a
// pointer. The dropdown built this inline and nothing else could, which is why
// a multi-select list outside a dropdown had to be hand-made out of checkboxes.

function renderListItemOption(option = {}) {
  const size = String(option.size || "1");
  return renderListItemTemplate({
    component: {
      hasSlotContent: () => false,
      getSlotContent: () => lit__WEBPACK_IMPORTED_MODULE_0__.nothing
    },
    templateName: "default",
    type: option.type || "text",
    kind: option.kind || option.type || "text",
    size,
    sizeGroup: optionSizeGroup(size),
    text: option.text,
    icon: option.icon,
    checked: option.checked || option.selected,
    selected: option.selected,
    disabled: option.disabled,
    value: option.value,
    colorClass: option.colorClass,
    avatarImageUrl: option.avatarImageUrl,
    avatarTitle: option.avatarTitle,
    ariaLabel: option.ariaLabel,
    option: true
  });
} // What a list says about itself between its rows. A long list of names needs to
// say where each stretch of it comes from; written into every row instead, the
// origin was repeated on every line and the name it mattered for was pushed off
// the end.

function renderListItemHeading(text, size = "1") {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div class="sf-list-heading sf-list-heading--size-${size}" role="presentation">
      <span class="sf-list-heading-container">${text}</span>
    </div>
  `;
} // The sizes a row's own parts take beside it. A checkbox and an avatar do not
// have the row's whole ladder, so each lands on the nearest step it has.

function optionSizeGroup(value) {
  const size = String(value || "1");

  if (size === "1/3" || size === "1/2") {
    return {
      item: size,
      checkbox: (0,_component_field_size__WEBPACK_IMPORTED_MODULE_1__.nearestFieldSize)(size),
      avatarGroup: "1/2",
      colorTag: "1/2"
    };
  }

  return {
    item: size,
    checkbox: (0,_component_field_size__WEBPACK_IMPORTED_MODULE_1__.nearestFieldSize)(size),
    avatarGroup: size,
    colorTag: "1"
  };
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "ddf1cdb42ecc"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit") : new Promise((resolve) => globalThis.addEventListener("sf-runtime-ready", () => resolve(globalThis.SF.runtimeModule("lit")), { once: true })));

/***/ },

/***/ "fbe0570fcc69"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("smart-base") : new Promise((resolve) => globalThis.addEventListener("sf-runtime-ready", () => resolve(globalThis.SF.runtimeModule("smart-base")), { once: true })));

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
/******/ 	let __webpack_exports__ = __webpack_require__("e4b691e01e6b");
/******/
/******/ })()
;