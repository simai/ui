/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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

/***/ "e4b691e01e6b"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("c22590307c6c");
/* harmony import */ var _component_field_size__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("e6d86f2cd058");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("f4c129a27dd4");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("06e7f30e3c4d");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("f073ddf72256");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("ef521380d975");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_2__, _component_field_size__WEBPACK_IMPORTED_MODULE_3__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_2__, _component_field_size__WEBPACK_IMPORTED_MODULE_3__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
// A row: an option sf-dropdown captures, or the general list row.
//
// From its component.json (standard simai.smart-component 1.3.8 §3, §4, §8):
// the settings are made by core/js/element-manifest.js; a press or Enter on an
// interactive row sends sf-list-item-open {id, trigger} (vocabulary 1.1.5 §5
// open), the old sf-list-item-activate its dated alias; type is kind's dated
// alias (aliases.json).







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
      checkbox: (0,_component_field_size__WEBPACK_IMPORTED_MODULE_3__.nearestFieldSize)(size),
      avatarGroup: '1/2',
      colorTag: '1/2'
    };
  }

  return {
    item: size,
    checkbox: (0,_component_field_size__WEBPACK_IMPORTED_MODULE_3__.nearestFieldSize)(size),
    avatarGroup: size,
    colorTag: '1'
  };
}

const ListItemElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_4__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_6__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_7__
  },
  source: 'ru',
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_5__
});

class SfListItem extends ListItemElement {
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
    } // Enter opens a row, unless the row is an item of an sf-sortable list:
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
  } // A press or Enter on the row: the request open {id} (vocabulary §5).


  activate(event) {
    if (this.disabled) return;
    this._openTrigger = event?.type === 'keydown' ? 'keyboard' : 'pointer';
    this.sfEmit('open', {
      id: this.value,
      trigger: this._openTrigger
    });
  } // The old sf-list-item-activate carried the element and named the id value.


  sfAliasAdapters() {
    return {
      'sf-list-item-activate': detail => ({
        value: detail.id,
        item: this,
        trigger: detail.trigger
      })
    };
  }

  get componentName() {
    return 'list-item';
  }

  get templateName() {
    return this.getAttribute('template') || 'default';
  } // The legacy name, kept so a consumer reading el.type still gets an answer
  // (the shim maps the attribute; aliases.json).


  get type() {
    return this.kind;
  } // Kept for the code that read the id under this name.


  get itemValue() {
    return this.value;
  }

  get sizeGroup() {
    return normalizeSizeGroup(this.size);
  }

  get avatarTitle() {
    return this.getAttribute('avatar-title') || this.text;
  }

  set avatarTitle(next) {
    super.avatarTitle = next;
  } // The value is the row's id (§4). Writing an object writes its attributes,
  // as the old snapshot form did.


  get value() {
    return super.value;
  }

  set value(next) {
    if (next && typeof next === 'object') {
      const {
        value: itemValue,
        ...attributes
      } = next;
      if (Object.prototype.hasOwnProperty.call(next, 'value')) this.setAttributeValue('value', itemValue);
      this.setValueAttributes(attributes);
      return;
    }

    super.value = next;
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
      ariaLabel: this.getAttribute('aria-label') || '',
      // Resolved names the template reads (contracts/template-context.json).
      kind: this.kind,
      type: this.kind,
      size: this.size,
      text: this.text,
      icon: this.icon,
      checked: this.checked,
      selected: this.selected,
      disabled: this.disabled,
      colorClass: this.colorClass,
      avatarImageUrl: this.avatarImageUrl,
      value: this.value,
      option: false
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_2__.renderListItemTemplate)(this.templateContext());
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
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var _component_field_size__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("e6d86f2cd058");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, _component_field_size__WEBPACK_IMPORTED_MODULE_1__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, _component_field_size__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
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

/***/ "d3818183b14c"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("deprecations", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("deprecations", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "5b7d7695b41b"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("element-manifest", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("element-manifest", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "2a080a730149"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("lit", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "deb1a4d61565"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("smart-base", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("smart-base", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "06e7f30e3c4d"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-list-item for the shim (stands/18-aliases-ci/alias.mjs, standard §16 item 20). mode: same-detail (the shim sends the new and the old name), split / detail-adds (a detail adapter, refused by the shim), attribute-and-property, method, property, manifest-only (the DOM name does not change), host-attribute (no shim), retired.","component":"sf-list-item","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"aria-label","to":null,"kind":"attribute","component":"sf-list-item","since":"2026-10-27","remove_after":"2026-12-01","mode":"host-attribute","section":"§3.1","note":"stays a host attribute, read by the base (§3.1, §4.8); no shim"},{"from":"type","to":"kind","kind":"setting","component":"sf-list-item","since":"2026-10-27","remove_after":"2026-12-01","section":"§16 item 20, contracts/public-api-axes.json","note":"the legacy axis name; the shim maps the attribute and the property"},{"from":"sf-list-item-activate","to":"sf-list-item-open","kind":"event","component":"sf-list-item","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":false,"manifest":{"from":"sf-list-item-activate","to":"open"},"section":"§8, vocabulary 1.1.5 §5 open","note":"the old detail {value, item, trigger} is made by the element\'s adapter (sfAliasAdapters)"}]}');

/***/ },

/***/ "f4c129a27dd4"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.list-item","tag":"sf-list-item","version":"1.2.2","kind":"leaf","settings":{"value":{"type":"string","default":"","summary":"The row\'s id: the machine value a parent sf-dropdown reads, and the id its open request carries"},"kind":{"type":"enum","values":["text","icon","checkbox","avatar","color"],"default":"text"},"size":{"type":"enum","values":["1/3","1/2","1","2","3"],"default":"1"},"text":{"type":"string","default":""},"icon":{"type":"icon","default":"person"},"disabled":{"type":"boolean","default":false},"color-class":{"type":"string","default":"bg-tertiary"},"avatar-image-url":{"type":"string","default":""},"avatar-title":{"type":"string","default":"","summary":"The avatar row\'s title; empty takes text"},"supporting":{"type":"string","default":"","summary":"A second line under the title"},"interactive":{"type":"boolean","default":false,"summary":"A row a person acts on: one Tab stop of its list, open on a press or Enter"},"sortable-item":{"type":"string","default":"","summary":"The row\'s item id in the surrounding sf-sortable list; draws a drag handle"},"pinned":{"type":"boolean","default":false,"summary":"A row of an sf-sortable list that does not move: no handle, its slot kept"}},"values":{"checked":{"type":"boolean","default":false},"selected":{"type":"boolean","default":false}},"events":{"open":{"carries":{"id":"string","trigger":{"type":"enum","values":["pointer","keyboard"]}},"summary":"A person pressed an interactive row, or Enter on it: open {id} of vocabulary 1.1.5 §5, id being value"}},"actions":{},"css-variables":{"--sf-list-item-background-color":{"type":"color","state":"default"},"--sf-list-item-border-color":{"type":"color","state":"default"},"--sf-list-item-color":{"type":"color","state":"default"},"--sf-list-item-supporting-color":{"type":"color","state":"default"},"--sf-list-item-handle-color":{"type":"color","state":"default"}}}');

/***/ },

/***/ "f073ddf72256"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"List item","runtime":{}}');

/***/ },

/***/ "ef521380d975"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Пункт списка","runtime":{}}');

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