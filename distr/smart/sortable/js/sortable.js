/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "6064f55a0aa2"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_composition_sortable_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("7c1f9c2b36da");
/* harmony import */ var _core_js_composition_sortable_inserter_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("96c896bdd1c2");
/* harmony import */ var _core_js_composition_manifest_host_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("6b629b4c1b7e");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("34bb89f847b9");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("6faa2d48a2c0");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("fca41e9837f0");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("46c0e03c9179");
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("8185ae1e4765");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_composition_sortable_mjs__WEBPACK_IMPORTED_MODULE_0__, _core_js_composition_sortable_inserter_mjs__WEBPACK_IMPORTED_MODULE_1__, _core_js_composition_manifest_host_mjs__WEBPACK_IMPORTED_MODULE_2__]);
([_core_js_composition_sortable_mjs__WEBPACK_IMPORTED_MODULE_0__, _core_js_composition_sortable_inserter_mjs__WEBPACK_IMPORTED_MODULE_1__, _core_js_composition_manifest_host_mjs__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
// Smart entry for sf-sortable. The loader fetches this bundle only when the
// page has an <sf-sortable> list, so pages without an editor keep core.js small.
//
// From its component.json (standard simai.smart-component 1.3.8 §3, §4, §8):
// the list is defined over the class core/js/composition/manifest-host.mjs
// makes from it -- the settings' properties, the words, the dated aliases --
// and asks sf-sortable-move (vocabulary 1.1.5 §5 move), the old
// sf-sortable-intent following until 2026-12-01.







 // Defined with its insertion point and inserter (inserter-items, opt-in). They
// come with this bundle only: the composition overlay carries the drag module
// too and has no use for them.

(0,_core_js_composition_sortable_mjs__WEBPACK_IMPORTED_MODULE_0__.defineSortable)((0,_core_js_composition_sortable_inserter_mjs__WEBPACK_IMPORTED_MODULE_1__.inserterRegistry)(), {
  base: (0,_core_js_composition_manifest_host_mjs__WEBPACK_IMPORTED_MODULE_2__.manifestHost)(_component_json__WEBPACK_IMPORTED_MODULE_3__, {
    lang: {
      en: _lang_en_json__WEBPACK_IMPORTED_MODULE_5__,
      ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_6__
    },
    source: 'ru',
    aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_4__
  })
});
globalThis.SF = globalThis.SF || {}; // attach: sf-sortable's pointer behaviour on any container (the column mode).

globalThis.SF.Sortable = Object.freeze({
  SORTABLE_INSERT_EVENT: _core_js_composition_sortable_inserter_mjs__WEBPACK_IMPORTED_MODULE_1__.SORTABLE_INSERT_EVENT,
  SORTABLE_INTENT_EVENT: _core_js_composition_sortable_mjs__WEBPACK_IMPORTED_MODULE_0__.SORTABLE_INTENT_EVENT,
  SORTABLE_MOVE_EVENT: _core_js_composition_sortable_mjs__WEBPACK_IMPORTED_MODULE_0__.SORTABLE_MOVE_EVENT,
  SORTABLE_STATE_EVENT: _core_js_composition_sortable_mjs__WEBPACK_IMPORTED_MODULE_0__.SORTABLE_STATE_EVENT,
  activeSortableSession: _core_js_composition_sortable_mjs__WEBPACK_IMPORTED_MODULE_0__.activeSortableSession,
  attach: _core_js_composition_sortable_mjs__WEBPACK_IMPORTED_MODULE_0__.attachSortable,
  attachSortable: _core_js_composition_sortable_mjs__WEBPACK_IMPORTED_MODULE_0__.attachSortable,
  registerSortableDropTarget: _core_js_composition_sortable_mjs__WEBPACK_IMPORTED_MODULE_0__.registerSortableDropTarget,
  sortableIndexAt: _core_js_composition_sortable_mjs__WEBPACK_IMPORTED_MODULE_0__.sortableIndexAt
});
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "8185ae1e4765"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "892a0da25239"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("aliases", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("aliases", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "5b7d7695b41b"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("element-manifest", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("element-manifest", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "43090d1c8307"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("page-language", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("page-language", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "6b629b4c1b7e"
(__webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   manifestHost: () => (/* binding */ manifestHost)
/* harmony export */ });
/* harmony import */ var _element_manifest_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _aliases_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("892a0da25239");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_element_manifest_js__WEBPACK_IMPORTED_MODULE_0__, _aliases_js__WEBPACK_IMPORTED_MODULE_1__]);
([_element_manifest_js__WEBPACK_IMPORTED_MODULE_0__, _aliases_js__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
// The editors' elements from their manifests (standard simai.smart-component
// 1.3.8 §3, §4, §8, §16.20).
//
// sf-sortable, sf-inline-editor and sf-composition-overlay are plain custom
// elements defined by the composition modules (core/js/composition): the
// overlay's bundle carries the drag module too, and a page may define them
// before any Smart base is loaded. They draw nothing through the Smart base
// and keep their own lifecycle. What the manifest gives every component --
// the settings' attributes and properties, sfEmit through the dated aliases,
// sfWord, the declared actions -- they take from elementFromManifest over a
// plain base that answers the two callbacks the generated class calls and
// installs the component's aliases.json once the element is placed.
//
//   const base = manifestHost(manifest, {lang: {en, ru}, source: 'ru', aliases});
//   defineSortable(registry, {base});



function manifestHost(manifest, options = {}) {
  const Html = globalThis.HTMLElement;
  if (typeof Html !== 'function') return null;

  class PlainHost extends Html {
    connectedCallback() {
      // Static markup printed for the first paint (standard 1.3.8 §5.4) goes
      // as the element connects: these elements draw in the same task.
      if (!this.__sfFirstPaintEnded) {
        this.__sfFirstPaintEnded = true;
        for (const child of Array.from(this.children)) {
          if (child.hasAttribute('data-sf-static') && !child.hasAttribute('slot')) child.remove();
          else child.removeAttribute('data-sf-held');
        }
        this.removeAttribute('data-sf-first-paint');
      }
      // Installed once and kept while the element is detached, as the Smart
      // base does: a page that moves the element keeps its old names.
      if (this.constructor.aliases && !this.__sfAliases) {
        this.__sfAliases = (0,_aliases_js__WEBPACK_IMPORTED_MODULE_1__.installAliases)(this, this.constructor.aliases, {
          tag: this.localName,
          adapters: this.sfAliasAdapters?.() ?? {},
        });
      }
    }

    disconnectedCallback() {}

    // The generated actions read the instance's scope (§7.7); a plain host's
    // ends when the page removes it.
    get sfScope() {
      if (!this.__sfScope || (this.__sfScope.signal.aborted && this.isConnected)) this.__sfScope = new AbortController();
      return this.__sfScope.signal;
    }
  }

  return (0,_element_manifest_js__WEBPACK_IMPORTED_MODULE_0__.elementFromManifest)(manifest, { ...options, base: PlainHost });
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ manifestHost });

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "96c896bdd1c2"
(__webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SORTABLE_INSERT_EVENT: () => (/* binding */ SORTABLE_INSERT_EVENT),
/* harmony export */   createSortableInserter: () => (/* binding */ createSortableInserter),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   inserterRegistry: () => (/* binding */ inserterRegistry),
/* harmony export */   insertionGeometry: () => (/* binding */ insertionGeometry),
/* harmony export */   nearestInsertion: () => (/* binding */ nearestInsertion),
/* harmony export */   withSortableInserter: () => (/* binding */ withSortableInserter)
/* harmony export */ });
/* harmony import */ var _page_language_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("43090d1c8307");
/* harmony import */ var _sortable_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("7c1f9c2b36da");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_page_language_js__WEBPACK_IMPORTED_MODULE_0__, _sortable_mjs__WEBPACK_IMPORTED_MODULE_1__]);
([_page_language_js__WEBPACK_IMPORTED_MODULE_0__, _sortable_mjs__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
// The insertion point of sf-sortable and the inserter it opens. A block editor
// asks for a "+" exactly where the next block goes -- between two rows, before
// the first, after the last -- that opens a searchable list of the kinds of
// thing that can go there (simai/ui-source#21; ui-mail redesign F4, 2026-10-22:
// "Добавить" always appended to the end, so every insert needed a later move).
// It is the same need in every editor built on a list -- mail, Docara studio,
// admin forms -- so it belongs to the list, not to each editor.
//
// The component reports the choice and creates nothing: the host hears
// sf-sortable-insert with the place and the kind, builds the item and puts it
// in the list, exactly as it applies sf-sortable-intent. The inserter is the
// Framework's standard menu (sf-context-menu, opened with openFor and its own
// local search), so its rows, its keys, its top layer and its Escape are the
// ones every other menu has; nothing here draws a second popover.
//
// It is opt-in: a list without inserter items gets a controller that draws
// nothing and listens to nothing, so every list written before is the list it
// was, its drag included. The drag module itself (sortable.mjs) is not changed:
// the element is extended here (withSortableInserter).



const SORTABLE_INSERT_EVENT = 'sf-sortable-insert';

const ITEM = '[data-sf-sortable-item]';

const MESSAGES = {
  ru: {
    point: 'Вставить: позиция {index} из {total}',
    menu: 'Вставить',
    search: 'Найти',
    empty: 'Ничего не найдено',
    inserted: 'Вставлено: {item}, позиция {index} в «{list}».',
    hint: 'Плюс — вставить после.',
  },
  en: {
    point: 'Insert: position {index} of {total}',
    menu: 'Insert',
    search: 'Find',
    empty: 'Nothing found',
    inserted: 'Inserted {item} at position {index} in “{list}”.',
    hint: 'Plus to insert after.',
  },
};

const format = (template, values) => template.replace(/\{(\w+)\}/gu, (_, key) => String(values[key] ?? ''));
const text = (key) => (0,_page_language_js__WEBPACK_IMPORTED_MODULE_0__.pageText)(MESSAGES, key, undefined, 'sf-sortable');

function items(list) {
  return [...list.querySelectorAll(ITEM)].filter((item) => item.closest('sf-sortable') === list);
}

function listName(list) {
  return list.getAttribute('label') || list.getAttribute('aria-label') || list.getAttribute('group') || '';
}

// The same test the drag uses: two items side by side on one row make a grid,
// and a grid is read row by row.
function isWrapped(all) {
  for (let position = 1; position < all.length; position += 1) {
    const previous = all[position - 1].getBoundingClientRect();
    const current = all[position].getBoundingClientRect();
    if (current.top < previous.bottom - 1 && current.left >= previous.right - 1) return true;
  }
  return false;
}

/**
 * Where the place `index` is, in viewport coordinates: a line across the list
 * (axis "y", a vertical list), down it (axis "x", a horizontal one), or down the
 * side of one cell of a grid. `at` is the line's position on its axis -- the
 * middle of the gap between two items, so the point sits on the gap and not on
 * either item -- and `start`/`end` its extent across.
 */
function insertionGeometry(list, all, index) {
  const box = list.getBoundingClientRect();
  const inner = {
    left: box.left + list.clientLeft, top: box.top + list.clientTop,
    width: list.clientWidth, height: list.clientHeight,
  };
  const horizontal = list.getAttribute('orientation') === 'horizontal';
  const before = all[index]?.getBoundingClientRect();
  const after = all[index - 1]?.getBoundingClientRect();
  if (!horizontal && isWrapped(all)) {
    const cell = before ?? after;
    if (!cell) return { axis: 'y', at: inner.top + inner.height / 2, start: inner.left, end: inner.left + inner.width };
    const sameRow = before && after && after.top < before.bottom - 1 && before.left >= after.right - 1;
    const at = before ? (sameRow ? (after.right + before.left) / 2 : before.left) : after.right;
    return { axis: 'x', at, start: cell.top, end: cell.bottom };
  }
  if (horizontal) {
    const at = before && after ? (after.right + before.left) / 2 : before ? before.left : after ? after.right : inner.left + inner.width / 2;
    return { axis: 'x', at, start: inner.top, end: inner.top + inner.height };
  }
  const at = before && after ? (after.bottom + before.top) / 2 : before ? before.top : after ? after.bottom : inner.top + inner.height / 2;
  return { axis: 'y', at, start: inner.left, end: inner.left + inner.width };
}

/**
 * The place nearest a pointer, and how far it is: across a vertical list only
 * the height counts, along a horizontal one only the width; a grid's place is
 * a side of a cell and counts only on that cell's row.
 */
function nearestInsertion(list, all, x, y) {
  let best = null;
  for (let index = 0; index <= all.length; index += 1) {
    const place = insertionGeometry(list, all, index);
    const along = place.axis === 'y' ? y : x;
    const across = place.axis === 'y' ? x : y;
    if (across < place.start || across > place.end) continue;
    const distance = Math.abs(along - place.at);
    if (!best || distance < best.distance) best = { index, distance, place };
  }
  return best;
}

function toEntries(list) {
  return list.inserterItems.flatMap((item) => {
    if (!item || typeof item !== 'object') return [];
    if (item.type === 'separator') return [{ type: 'separator' }];
    if (item.type === 'heading') return [{ type: 'heading', text: String(item.label ?? '') }];
    if (item.value === undefined || item.value === null) return [];
    return [{
      id: String(item.value), text: String(item.label ?? item.value),
      icon: item.icon || undefined, caption: item.caption || undefined,
      keywords: item.keywords || undefined, disabled: Boolean(item.disabled),
    }];
  });
}

/**
 * The controller one list owns. connect/disconnect follow the list; refresh
 * follows its inserter items; ensure follows a host redraw of its children.
 */
function createSortableInserter(list) {
  let connected = false;
  let active = false;
  let wiring = null;
  let control = null;
  let button = null;
  let menu = null;
  let menuIndex = 0;
  // The place the point stands at, and why it is shown: a pointer near a gap,
  // a focused row (its place after it), the point's own focus or its menu.
  let point = 0;
  let hover = null;
  let rowFocus = null;

  const document_ = () => globalThis.document;
  const count = () => items(list).length;
  const clamp = (index) => Math.max(0, Math.min(count(), index));

  function build() {
    control = document_().createElement('div');
    control.className = 'sf-sortable-insert';
    control.setAttribute('data-sf-sortable-insert', '');
    // A native icon button of the Framework's smallest rung: its height, its
    // glyph and its padding are the ladder's (1/3), and its look is the quiet
    // surface one a row action has, so it reads the same on any canvas.
    button = document_().createElement('button');
    button.type = 'button';
    button.className = 'sf-icon-button sf-icon-button--icon sf-icon-button--surface sf-icon-button--on-surface sf-icon-button--size-1/3 sf-sortable-insert-button';
    button.setAttribute('aria-haspopup', 'menu');
    button.setAttribute('aria-expanded', 'false');
    const glyph = document_().createElement('i');
    glyph.className = 'sf-icon';
    glyph.setAttribute('aria-hidden', 'true');
    glyph.textContent = 'add';
    button.append(glyph);
    control.append(button);
  }

  // The point after the last item in the document, so it is the list's last tab
  // stop: Tab from the last row reaches it and Tab from it leaves the list, and
  // nothing is trapped. A host that appends its redrawn items after the
  // component's own nodes would otherwise put the point in front of them.
  function ensure() {
    if (!active || !control) return;
    const last = items(list).at(-1);
    const misplaced = control.parentNode !== list
      || Boolean(last && (control.compareDocumentPosition(last) & globalThis.Node.DOCUMENT_POSITION_FOLLOWING));
    if (misplaced) {
      const focused = document_().activeElement === button;
      list.append(control);
      // Moving a focused node drops its focus; the person keeps their place.
      if (focused) button.focus({ preventScroll: true });
    }
    // The rows moved under it: the place is measured again.
    place();
  }

  function shownReason() {
    if ((0,_sortable_mjs__WEBPACK_IMPORTED_MODULE_1__.activeSortableSession)()) return null;
    if (menu?.isOpen) return 'menu';
    if (document_().activeElement === button) return 'focus';
    if (hover !== null) return 'hover';
    if (rowFocus !== null) return 'row';
    return null;
  }

  function place() {
    if (!active || !control) return;
    const reason = shownReason();
    if (reason === 'hover') point = hover;
    else if (reason === 'row') point = rowFocus;
    point = clamp(point);
    const all = items(list);
    const geometry = insertionGeometry(list, all, point);
    const box = list.getBoundingClientRect();
    const originX = box.left + list.clientLeft - list.scrollLeft;
    const originY = box.top + list.clientTop - list.scrollTop;
    control.dataset.axis = geometry.axis;
    if (geometry.axis === 'y') {
      Object.assign(control.style, { left: `${geometry.start - originX}px`, top: `${geometry.at - originY}px`, width: `${geometry.end - geometry.start}px`, height: '0px' });
    } else {
      Object.assign(control.style, { left: `${geometry.at - originX}px`, top: `${geometry.start - originY}px`, width: '0px', height: `${geometry.end - geometry.start}px` });
    }
    control.toggleAttribute('data-shown', Boolean(reason));
    control.dataset.index = String(point);
    button.setAttribute('aria-label', format(text('point'), { index: point + 1, total: all.length + 1 }));
  }

  // Pointer: the point comes to the gap the pointer is near, within half the
  // point's own height of it -- near enough to mean the gap, not the row.
  function onPointerMove(event) {
    if (event.buttons || (0,_sortable_mjs__WEBPACK_IMPORTED_MODULE_1__.activeSortableSession)() || menu?.isOpen) return;
    if (control.contains(event.target)) return;
    const zone = Math.max(button.offsetHeight, button.offsetWidth) / 2;
    const nearest = nearestInsertion(list, items(list), event.clientX, event.clientY);
    const next = nearest && nearest.distance <= zone ? nearest.index : null;
    if (next === hover) return;
    hover = next;
    place();
  }

  function onPointerLeave() {
    if (hover === null) return;
    hover = null;
    place();
  }

  // A focused row shows the place after it: the place its "+" key opens, and
  // the one a tap on a touch screen, which has no hover, can reach.
  function onFocusIn(event) {
    const item = event.target.closest?.(ITEM);
    if (event.target === button) {
      place();
      return;
    }
    rowFocus = item && item.closest('sf-sortable') === list ? items(list).indexOf(item) + 1 : null;
    place();
  }

  function onFocusOut() {
    globalThis.setTimeout(() => {
      if (!connected) return;
      if (!list.contains(document_().activeElement)) rowFocus = null;
      place();
    }, 0);
  }

  // The point's own keys: the arrows of the list's direction walk the places,
  // Home and End go to the first and the last, and each step is said. Enter
  // and Space are the button's own.
  function onButtonKeyDown(event) {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const horizontal = list.getAttribute('orientation') === 'horizontal';
    const rtl = globalThis.getComputedStyle(list).direction === 'rtl';
    const steps = horizontal
      ? { ArrowLeft: rtl ? 1 : -1, ArrowRight: rtl ? -1 : 1, ArrowUp: -1, ArrowDown: 1 }
      : { ArrowUp: -1, ArrowDown: 1, ArrowLeft: -1, ArrowRight: 1 };
    let next = null;
    if (event.key in steps) next = point + steps[event.key];
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = count();
    if (next === null) return;
    event.preventDefault();
    hover = null;
    rowFocus = null;
    point = clamp(next);
    place();
    list.announce?.(format(text('point'), { index: point + 1, total: count() + 1 }));
  }

  function onButtonClick(event) {
    event.preventDefault();
    if (menu?.isOpen) {
      menu.close();
      return;
    }
    open(point);
  }

  async function standardMenu() {
    if (menu?.isConnected) return menu;
    const registry = globalThis.customElements;
    if (!registry.get('sf-context-menu')) {
      globalThis.SF?.Loader?.ensurePlugin?.('cl-context-menu');
      await Promise.race([registry.whenDefined('sf-context-menu'), new Promise((done) => { globalThis.setTimeout(done, 3000); })]);
    }
    if (!registry.get('sf-context-menu')) return null;
    menu = document_().createElement('sf-context-menu');
    menu.setAttribute('popup', '');
    menu.addEventListener('sf-context-menu-select', onSelect);
    menu.addEventListener('sf-context-menu-closed', () => { button?.setAttribute('aria-expanded', 'false'); place(); });
    // Enter in the search takes the first row it left: whoever typed the name
    // of what they want has chosen it. The menu's own Enter is a row's.
    menu.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' || event.defaultPrevented || event.target !== menu.searchField?.()) return;
      event.preventDefault();
      menu.syncMenuItems?.();
      menu.availableMenuItems?.()[0]?.click();
    });
    (list.closest('dialog[open]') || document_().body).append(menu);
    return menu;
  }

  /** Opens the inserter for the place `index` (0 before the first item). */
  async function open(index) {
    if (!active || (0,_sortable_mjs__WEBPACK_IMPORTED_MODULE_1__.activeSortableSession)()) return false;
    point = clamp(index);
    hover = null;
    place();
    const surface = await standardMenu();
    if (!surface || !active) return false;
    menuIndex = point;
    surface.setAttribute('aria-label', listName(list) ? `${text('menu')}: ${listName(list)}` : text('menu'));
    surface.search = { placeholder: text('search'), empty: text('empty') };
    surface.entries = toEntries(list);
    const opened = await surface.openFor(button, { side: 'block-end', align: 'start', focus: 'first' });
    place();
    return opened;
  }

  // A choice is the host's to apply: it hears the place and the kind, and a
  // refusal (preventDefault) leaves the inserter open for another choice. The
  // menu is closed here rather than by itself, so a host that moved focus to
  // the item it just inserted keeps it there.
  function onSelect(event) {
    event.preventDefault();
    const entry = event.detail?.entry;
    if (!entry || entry.id === undefined || entry.id === null) return;
    const index = menuIndex;
    const accepted = list.dispatchEvent(new globalThis.CustomEvent(SORTABLE_INSERT_EVENT, {
      bubbles: true, composed: true, cancelable: true,
      detail: Object.freeze({ index, item: entry.id, to: list.getAttribute('id') || list.getAttribute('group') || '' }),
    }));
    if (!accepted) return;
    list.announce?.(format(text('inserted'), { item: entry.text ?? entry.id, index: index + 1, list: listName(list) }));
    // The next insert goes after this one, so a run of choices builds in order.
    point = index + 1;
    const focusMoved = !menu.contains(document_().activeElement);
    menu.close({ restoreFocus: !focusMoved });
  }

  function onItemKeyDown(event, item) {
    if (!active || event.key !== '+' || event.altKey || event.ctrlKey || event.metaKey) return false;
    event.preventDefault();
    open(items(list).indexOf(item) + 1);
    return true;
  }

  function onSortableState() {
    hover = null;
    place();
  }

  function mount() {
    if (!control) build();
    wiring = new globalThis.AbortController();
    const options = { signal: wiring.signal };
    list.setAttribute('data-sf-sortable-inserter', '');
    list.addEventListener('pointermove', onPointerMove, options);
    list.addEventListener('pointerleave', onPointerLeave, options);
    list.addEventListener('focusin', onFocusIn, options);
    list.addEventListener('focusout', onFocusOut, options);
    list.addEventListener('sf-sortable-state', onSortableState, options);
    button.addEventListener('keydown', onButtonKeyDown, options);
    button.addEventListener('click', onButtonClick, options);
    // The icon button's look and the glyph's font are component stylesheets:
    // asked for here, and named as relations of the rule, so a page without
    // them still gets them.
    globalThis.SF?.Loader?.ensurePlugin?.('icon-buttons');
    globalThis.SF?.Loader?.ensurePlugin?.('icons');
    active = true;
    ensure();
    place();
  }

  function unmount() {
    active = false;
    wiring?.abort();
    wiring = null;
    menu?.close?.({ restoreFocus: false });
    control?.remove();
    list.removeAttribute('data-sf-sortable-inserter');
    hover = null;
    rowFocus = null;
  }

  function refresh() {
    const wanted = connected && list.inserterItems.length > 0;
    if (wanted && !active) mount();
    else if (!wanted && active) unmount();
    else if (wanted && menu?.isOpen) menu.entries = toEntries(list);
    list.updateInstructions?.();
  }

  return {
    connect() { connected = true; refresh(); },
    disconnect() {
      connected = false;
      if (active) unmount();
      menu?.remove();
      menu = null;
    },
    refresh,
    ensure,
    open,
    onItemKeyDown,
    instructions: () => (active ? text('hint') : ''),
    get active() { return active; },
    get index() { return point; },
  };
}

/**
 * sf-sortable with an inserter: the drag element of sortable.mjs, extended.
 * It is an extension rather than an edit of that module because the
 * composition overlay's bundle carries sortable.mjs too (for the shared drag
 * session) and has no use for an inserter; extending it here keeps the
 * inserter in the sf-sortable bundle alone and the drag module as it was.
 */
function withSortableInserter(Base) {
  return class SfSortable extends Base {
    static get observedAttributes() {
      return [...(super.observedAttributes ?? []), 'inserter-items'];
    }

    constructor() {
      super();
      this.inserterController = null;
      this._inserterHint = '';
      // Set before the element was defined, the value sat on the instance and
      // would hide the accessor; it is taken over here, as sf-context-menu
      // takes over its entries.
      if (Object.prototype.hasOwnProperty.call(this, 'inserterItems')) {
        const early = this.inserterItems;
        delete this.inserterItems;
        this._inserterItems = Array.isArray(early) ? early : null;
      }
    }

    // What the inserter offers: [{value, label, icon?, caption?, keywords?,
    // disabled?}], as a property or as JSON in the inserter-items attribute.
    // An empty list is no inserter, and the list is the list it was before.
    get inserterItems() {
      if (Array.isArray(this._inserterItems)) return this._inserterItems;
      const raw = this.getAttribute('inserter-items');
      if (!raw) return [];
      try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }

    set inserterItems(value) {
      this._inserterItems = Array.isArray(value) ? value : null;
      this.inserterController?.refresh();
    }

    attributeChangedCallback(name, previous, next) {
      super.attributeChangedCallback?.(name, previous, next);
      if (name === 'inserter-items' && previous !== next) this.inserterController?.refresh();
    }

    connectedCallback() {
      super.connectedCallback();
      if (!this.inserterController) this.inserterController = createSortableInserter(this);
      this.inserterController.connect();
    }

    disconnectedCallback() {
      this.inserterController?.disconnect();
      super.disconnectedCallback();
    }

    // The instructions every item points at say the inserter's key while the
    // list has one. The drag module writes its own sentence; the hint follows it.
    updateInstructions() {
      if (!this.instructions) return;
      const current = this.instructions.textContent;
      const own = this._inserterHint && current.endsWith(` ${this._inserterHint}`)
        ? current.slice(0, -(this._inserterHint.length + 1))
        : current;
      const hint = this.inserterController?.instructions() || '';
      const next = hint ? `${own} ${hint}` : own;
      this._inserterHint = hint;
      // Written only when it changes: the list observes its own subtree, and a
      // write would wake the observer that called this.
      if (next !== current) this.instructions.textContent = next;
    }

    // A host redraw takes the component's nodes out with its own, or leaves the
    // insertion point in front of the items it appends: both come back.
    ensureAccessibilityNodes() {
      super.ensureAccessibilityNodes();
      this.updateInstructions();
      this.inserterController?.ensure();
    }

    // The inserter's key on a row ("+": insert after it) comes before the
    // drag's keys; anything else is the drag's.
    onKeyDown(event) {
      const item = event.target.closest?.(ITEM);
      if (!(0,_sortable_mjs__WEBPACK_IMPORTED_MODULE_1__.activeSortableSession)() && item && item.closest('sf-sortable') === this && event.target === item
          && this.inserterController?.onItemKeyDown(event, item)) return;
      super.onKeyDown(event);
    }
  };
}

// The registry sf-sortable is defined in, through which it is defined with its
// inserter: defineSortable takes the registry it defines into.
function inserterRegistry(registry = globalThis.customElements) {
  return {
    get: (name) => registry.get(name),
    define: (name, Base, options) => registry.define(name, withSortableInserter(Base), options),
  };
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ SORTABLE_INSERT_EVENT, createSortableInserter, inserterRegistry, insertionGeometry, nearestInsertion, withSortableInserter });

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "7c1f9c2b36da"
(__webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SORTABLE_INTENT_EVENT: () => (/* binding */ SORTABLE_INTENT_EVENT),
/* harmony export */   SORTABLE_MOVE_EVENT: () => (/* binding */ SORTABLE_MOVE_EVENT),
/* harmony export */   SORTABLE_STATE_EVENT: () => (/* binding */ SORTABLE_STATE_EVENT),
/* harmony export */   activeSortableSession: () => (/* binding */ activeSortableSession),
/* harmony export */   attachSortable: () => (/* binding */ attachSortable),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   defineSortable: () => (/* binding */ defineSortable),
/* harmony export */   registerSortableDropTarget: () => (/* binding */ registerSortableDropTarget),
/* harmony export */   sortableIndexAt: () => (/* binding */ sortableIndexAt)
/* harmony export */ });
/* harmony import */ var _page_language_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("43090d1c8307");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_page_language_js__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
_page_language_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
// Sortable drag-and-drop primitive. <sf-sortable> lists and registered
// external drop targets share one drag session. Pointer (mouse, pen, touch via
// handles), keyboard and screen-reader paths all end in the same intent event;
// the component never moves host DOM or data. The host applies the change.


// The request to move an item (simai.smart-vocabulary 1.1.5 §5 move): the
// name sf-sortable's component.json declares. The former sf-sortable-intent
// follows it with the same detail until 2026-12-01.
const SORTABLE_MOVE_EVENT = 'sf-sortable-move';
const SORTABLE_INTENT_EVENT = 'sf-sortable-intent';
const SORTABLE_STATE_EVENT = 'sf-sortable-state';

const ITEM = '[data-sf-sortable-item]';
const HANDLE = '[data-sf-sortable-handle]';
const INTERACTIVE = 'a[href],button,input,select,textarea,summary,[contenteditable]:not([contenteditable="false"])';
const NAME = /^[a-z][a-z0-9-]{0,31}$/u;
const DRAG_THRESHOLD = 4;
const EDGE = 32;

const MESSAGES = {
  ru: {
    instructions: 'Пробел или Enter — взять, стрелки — переместить, Пробел или Enter — положить, Escape — отменить.',
    picked: 'Взято: {item}. Позиция {index} из {total} в «{list}».',
    moved: 'Позиция {index} из {total} в «{list}».',
    dropped: 'Положено: {item}, позиция {index} в «{list}».',
    cancelled: 'Перемещение отменено.',
    target: 'Цель: {target}.',
  },
  en: {
    instructions: 'Space or Enter to pick up, arrows to move, Space or Enter to drop, Escape to cancel.',
    picked: 'Picked up {item}. Position {index} of {total} in “{list}”.',
    moved: 'Position {index} of {total} in “{list}”.',
    dropped: 'Dropped {item} at position {index} in “{list}”.',
    cancelled: 'Move cancelled.',
    target: 'Target: {target}.',
  },
};

const format = (template, values) => template.replace(/\{(\w+)\}/gu, (_, key) => String(values[key] ?? ''));
// In the page's language through pageText, as every component's words are;
// <html lang> alone left SF.language.use() unheard (documentation trial).
const messages = () => Object.fromEntries(Object.keys(MESSAGES.en).map((key) => [key, (0,_page_language_js__WEBPACK_IMPORTED_MODULE_0__.pageText)(MESSAGES, key, undefined, 'sf-sortable')]));
// Separate Smart bundles (sf-sortable, sf-composition-overlay) each carry a copy
// of this module; the drag session and external targets live on one global
// record so a library drag can land on the overlay. The key carries the record
// version, so bundles with another record shape never share it.
const shared = globalThis.__sfSortableSharedV1 || (globalThis.__sfSortableSharedV1 = { targets: new Set(), session: null });
const externalTargets = shared.targets;

/** The active drag session (read-only view), or null. */
function activeSortableSession() {
  return shared.session ? Object.freeze({ item: shared.session.item, from: shared.session.from, group: shared.session.group, mode: shared.session.mode, input: shared.session.input }) : null;
}

/**
 * Registers a non-list drop target such as the editor overlay.
 * resolve(x, y, session) returns {descriptor, rect, label} or null;
 * drop(session, descriptor) performs the intent emission.
 */
function registerSortableDropTarget(target) {
  if (!target || typeof target.resolve !== 'function' || typeof target.drop !== 'function') throw new TypeError('Drop target needs resolve and drop');
  externalTargets.add(target);
  return () => externalTargets.delete(target);
}

// Visible text of an item without decorative (aria-hidden) parts.
function itemLabel(item) {
  if (item.getAttribute('aria-label')) return item.getAttribute('aria-label');
  const clone = item.cloneNode(true);
  for (const hidden of clone.querySelectorAll('[aria-hidden="true"]')) hidden.remove();
  return clone.textContent.replace(/\s+/gu, ' ').trim();
}

function listName(list) {
  return list.getAttribute('label') || list.getAttribute('aria-label') || list.getAttribute('group') || '';
}

function items(list) {
  return [...list.querySelectorAll(ITEM)].filter((item) => item.closest('sf-sortable') === list);
}

function accepts(list, group) {
  if (!list || list.getAttribute('mode') === 'copy') return false;
  const own = list.getAttribute('group');
  const extra = (list.getAttribute('accepts') || '').split(/\s+/u).filter(Boolean);
  return group === own || extra.includes(group);
}

function scrollContainer(element) {
  for (let node = element?.parentElement; node; node = node.parentElement) {
    const style = globalThis.getComputedStyle(node);
    if (/(auto|scroll)/u.test(style.overflowY) && node.scrollHeight > node.clientHeight) return node;
  }
  return globalThis.document.scrollingElement;
}

function indicator() {
  let line = globalThis.document.querySelector('.sf-sortable-indicator');
  if (!line) {
    line = globalThis.document.createElement('div');
    line.className = 'sf-sortable-indicator';
    line.setAttribute('aria-hidden', 'true');
    globalThis.document.body.append(line);
  }
  return line;
}

function showIndicator(rect) {
  const line = indicator();
  if (!rect) {
    line.hidden = true;
    return;
  }
  line.hidden = false;
  Object.assign(line.style, { left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px` });
}

// The silhouette: while a pointer drags, the place the item would take opens in
// the list as an empty outline of its size, and the list moves to make room --
// a line two pixels thick said where, but not how the list would look, and the
// owner could not tell where a row would land before letting go (2026-10-13).
// The item itself leaves the flow while it is dragged; its copy follows the
// pointer. A list that wraps into a grid opens the place among its cells, in
// reading order (owner, 2026-10-14: the fields of a record view arranged in two
// columns moved with a line nobody could follow). Keyboard moves, external
// targets and a list written preview="line" keep the line.
function silhouetteFor(list) {
  return list.getAttribute('preview') !== 'line';
}

function placeholder(session) {
  if (session.placeholder) return session.placeholder;
  const box = session.sourceBox;
  const element = globalThis.document.createElement('div');
  element.className = 'sf-sortable-placeholder';
  element.setAttribute('aria-hidden', 'true');
  Object.assign(element.style, { inlineSize: `${box.width}px`, blockSize: `${box.height}px` });
  session.placeholder = element;
  return element;
}

// Where the outline goes, and the final index it stands for: counted among the
// items still in the flow -- not the dragged one -- so it is the index the item
// will have once it is moved.
function placeSilhouette(session, list, x, y) {
  const horizontal = list.getAttribute('orientation') === 'horizontal';
  const visible = items(list).filter((item) => item !== session.source);
  // A grid is read row by row; the outline is one of its cells. Whether the
  // list wraps is asked of the items left in the flow, the dragged one being
  // out of it, or remembered from when the drag began.
  const wrapped = !horizontal && (isWrapped(visible) || session.wrappedLists?.has(list));
  let index;
  if (wrapped) {
    index = wrappedIndexAt(visible, x, y);
  } else {
    const boxes = visible.map((item) => {
      const box = item.getBoundingClientRect();
      return horizontal ? { start: box.left, end: box.right } : { start: box.top, end: box.bottom };
    });
    index = sortableIndexAt(boxes, horizontal ? x : y);
  }
  const element = placeholder(session);
  const before = visible[index];
  if (before) {
    if (element.nextElementSibling !== before) before.before(element);
  } else if (visible.length) {
    const last = visible[visible.length - 1];
    if (last.nextElementSibling !== element) last.after(element);
  } else if (element.parentElement !== list) {
    list.append(element);
  }
  return index;
}

/** Index where an item would land in a list for a pointer position. */
function sortableIndexAt(boxes, coordinate, exclude = -1) {
  let index = 0;
  for (let position = 0; position < boxes.length; position += 1) {
    if (position === exclude) continue;
    const box = boxes[position];
    if (coordinate > box.start + (box.end - box.start) / 2) index = position + 1;
  }
  return index;
}

/**
 * Whether the list flows in both axes -- two items standing side by side on one
 * row. A list like that is neither vertical nor horizontal, and asking only the
 * vertical axis cannot tell the left half of a row from the right half.
 */
function isWrapped(all) {
  for (let position = 1; position < all.length; position += 1) {
    const previous = all[position - 1].getBoundingClientRect();
    const current = all[position].getBoundingClientRect();
    if (current.top < previous.bottom - 1 && current.left >= previous.right - 1) return true;
  }
  return false;
}

/** Index where an item would land in a list that wraps, in reading order. */
function wrappedIndexAt(all, x, y) {
  let index = 0;
  for (let position = 0; position < all.length; position += 1) {
    const box = all[position].getBoundingClientRect();
    const past = y > box.bottom ? true : y < box.top ? false : x > box.left + box.width / 2;
    if (past) index = position + 1;
  }
  return index;
}

function listTarget(list, x, y) {
  const all = items(list);
  const horizontal = list.getAttribute('orientation') === 'horizontal';
  if (!horizontal && isWrapped(all)) {
    const index = wrappedIndexAt(all, x, y);
    return { list, index, rect: wrappedIndicatorRect(list, all, index) };
  }
  const boxes = all.map((item) => {
    const box = item.getBoundingClientRect();
    return horizontal ? { start: box.left, end: box.right } : { start: box.top, end: box.bottom };
  });
  const index = sortableIndexAt(boxes, horizontal ? x : y);
  return { list, index, rect: listIndicatorRect(list, all, index, horizontal) };
}

/**
 * A line down the side of the place the item would take, not across the whole
 * row: in a two-column list a full-width line cannot say which of the two halves
 * the item is about to land in.
 */
function wrappedIndicatorRect(list, all, index) {
  const box = list.getBoundingClientRect();
  const before = all[index];
  const after = all[index - 1];
  if (before) {
    const target = before.getBoundingClientRect();
    return { left: target.left - 1, top: target.top, width: 2, height: target.height };
  }
  if (after) {
    const target = after.getBoundingClientRect();
    return { left: target.right - 1, top: target.top, width: 2, height: target.height };
  }
  return { left: box.left, top: box.top, width: 2, height: box.height };
}

function listIndicatorRect(list, all, index, horizontal) {
  const box = list.getBoundingClientRect();
  const before = all[index];
  const after = all[index - 1];
  if (horizontal) {
    const x = before ? before.getBoundingClientRect().left : after ? after.getBoundingClientRect().right : box.left;
    return { left: x - 1, top: box.top, width: 2, height: box.height };
  }
  const y = before ? before.getBoundingClientRect().top : after ? after.getBoundingClientRect().bottom : box.top;
  return { left: box.left, top: y - 1, width: box.width, height: 2 };
}

// An sf-sortable list sends the new name and its aliases.json sends the old
// one after it; a container the column mode attached to, or a list defined
// without its manifest, sends both here.
function emitIntent(target, detail) {
  const frozen = Object.freeze(detail);
  target.dispatchEvent(new globalThis.CustomEvent(SORTABLE_MOVE_EVENT, { bubbles: true, composed: true, detail: frozen }));
  if (!target.__sfAliases) target.dispatchEvent(new globalThis.CustomEvent(SORTABLE_INTENT_EVENT, { bubbles: true, composed: true, detail: frozen }));
}

// A keyboard move ends with the person's focus on the item they moved. The
// host applies the intent by redrawing its list, and a redraw that replaces
// the dragged element drops focus to the body: the keyboard user lost their
// place in the page and had to tab back from the top (consumer case
// ui-mail.sortable-editor-recipe, 2026-10-21). Two frames after the drop --
// the host has redrawn by then -- the item with the same id takes focus back,
// in whichever list it landed. A host that restores focus itself keeps it:
// focus is only moved when it fell to the body or out of the document.
function restoreFocusAfterDrop(ended) {
  const document_ = globalThis.document;
  const id = ended.item;
  if (!id || !document_) return;
  const place = () => {
    const active = document_.activeElement;
    if (active && active !== document_.body && document_.contains(active)) return;
    const scope = ended.list && document_.contains(ended.list) ? ended.list : document_;
    const item = scope.querySelector(`[data-sf-sortable-item="${globalThis.CSS?.escape ? globalThis.CSS.escape(id) : id}"]`);
    item?.focus?.({ preventScroll: false });
  };
  if (typeof globalThis.requestAnimationFrame !== 'function') { place(); return; }
  globalThis.requestAnimationFrame(() => globalThis.requestAnimationFrame(place));
}

function finish(list, reason) {
  if (!shared.session) return;
  const ended = shared.session;
  shared.session = null;
  ended.cleanup?.abort();
  if (ended.scrollFrame) globalThis.cancelAnimationFrame(ended.scrollFrame);
  ended.source?.removeAttribute('data-sf-sortable-dragging');
  ended.source?.removeAttribute('data-sf-sortable-lifted');
  ended.placeholder?.remove();
  ended.ghost?.remove();
  showIndicator(null);
  for (const target of externalTargets) target.leave?.();
  globalThis.document.documentElement.removeAttribute('data-sf-sortable-active');
  list.dispatchEvent(new globalThis.CustomEvent(SORTABLE_STATE_EVENT, { bubbles: true, composed: true, detail: Object.freeze({ state: reason, item: ended.item }) }));
  if (reason === 'dropped' && ended.input === 'keyboard') restoreFocusAfterDrop(ended);
}

// base: the class made from sf-sortable's component.json (manifest-host.mjs);
// without it the list is a plain element, as the overlay's bundle defines it.
function defineSortable(registry = globalThis.customElements, { base = null } = {}) {
  if (!registry || typeof globalThis.HTMLElement !== 'function') return null;
  const existing = registry.get('sf-sortable');
  if (existing) return existing;

  class SfSortable extends (base || globalThis.HTMLElement) {
    constructor() {
      super();
      this.connection = null;
      this.live = null;
      this.instructions = null;
    }

    connectedCallback() {
      super.connectedCallback?.();
      if (this.connection) return;
      this.connection = new AbortController();
      const options = { signal: this.connection.signal };
      if (!this.live) {
        this.live = globalThis.document.createElement('div');
        this.live.className = 'sf-sortable-live';
        // Pick-up, move and drop are routine steps the person caused; polite
        // waits for the reader instead of cutting across what it was saying.
        this.live.setAttribute('aria-live', 'polite');
        this.instructions = globalThis.document.createElement('div');
        this.instructions.className = 'sf-sortable-live';
        this.instructions.id = `sf-sortable-help-${Math.random().toString(36).slice(2, 10)}`;
      }
      this.instructions.textContent = messages().instructions;
      this.append(this.live, this.instructions);
      this.addEventListener('pointerdown', (event) => this.onPointerDown(event), options);
      this.addEventListener('keydown', (event) => this.onKeyDown(event), options);
      this.addEventListener('focusin', (event) => this.prepareItem(event.target.closest?.(ITEM)), options);
      for (const item of items(this)) this.prepareItem(item);
      // Items the host adds later become focusable and draggable as well.
      this.observer = new globalThis.MutationObserver(() => { this.ensureAccessibilityNodes(); for (const item of items(this)) this.prepareItem(item); });
      this.observer.observe(this, { childList: true, subtree: true });
      this.setAttribute('data-sf-sortable', 'connected');
    }

    disconnectedCallback() {
      super.disconnectedCallback?.();
      this.observer?.disconnect();
      this.observer = null;
      this.connection?.abort();
      this.connection = null;
      if (shared.session?.fromList === this || shared.session?.list === this) finish(this, 'cancelled');
      this.setAttribute('data-sf-sortable', 'disposed');
    }

    prepareItem(item) {
      if (!item || item.closest('sf-sortable') !== this) return;
      if (!item.hasAttribute('tabindex') && !item.matches(INTERACTIVE)) item.tabIndex = 0;
      const described = (item.getAttribute('aria-describedby') || '').split(/\s+/u);
      if (this.instructions && !described.includes(this.instructions.id)) item.setAttribute('aria-describedby', [...described.filter(Boolean), this.instructions.id].join(' '));
      if (!item.querySelector(HANDLE)) item.style.touchAction = 'none';
    }

    // The list keeps its live region and its instructions among its own
    // children, so a host that redraws the list with replaceChildren() takes
    // them out: announcements then went to a detached node, and items said
    // nothing (consumer case ui-mail.sortable-editor-recipe, 2026-10-21). The
    // component owns these two nodes and puts them back, with the same
    // instructions id the items point at through aria-describedby.
    ensureAccessibilityNodes() {
      if (!this.live || !this.instructions) return;
      if (this.live.parentNode === this && this.instructions.parentNode === this) return;
      this.instructions.textContent = messages().instructions;
      this.append(this.live, this.instructions);
    }

    announce(text) {
      this.ensureAccessibilityNodes();
      if (this.live) this.live.textContent = text;
    }

    get group() {
      const value = this.getAttribute('group') || '';
      return NAME.test(value) ? value : '';
    }

    get mode() {
      return this.getAttribute('mode') === 'copy' ? 'copy' : 'move';
    }

    begin(item, input) {
      const id = item.getAttribute('data-sf-sortable-item');
      if (!id || !this.group || shared.session) return false;
      const all = items(this);
      const sourceBox = item.getBoundingClientRect();
      shared.session = {
        sourceBox,
        item: id, from: this.getAttribute('id') || this.group, group: this.group, mode: this.mode, input,
        source: item, fromList: this, sourceIndex: all.indexOf(item), list: this.mode === 'copy' ? null : this,
        index: all.indexOf(item), external: null, cleanup: new AbortController(),
      };
      item.setAttribute('data-sf-sortable-dragging', '');
      globalThis.document.documentElement.setAttribute('data-sf-sortable-active', '');
      this.dispatchEvent(new globalThis.CustomEvent(SORTABLE_STATE_EVENT, { bubbles: true, composed: true, detail: Object.freeze({ state: 'picked', item: id }) }));
      return true;
    }

    // Pointer path ---------------------------------------------------------
    onPointerDown(event) {
      if (event.button !== 0 || shared.session) return;
      const item = event.target.closest?.(ITEM);
      if (!item || item.closest('sf-sortable') !== this) return;
      const handle = item.querySelector(HANDLE);
      if (handle && !handle.contains(event.target)) return;
      if (!handle && event.target.closest(INTERACTIVE) && event.target.closest(INTERACTIVE) !== item) return;
      const start = { x: event.clientX, y: event.clientY };
      const pointer = event.pointerId;
      let started = false;
      const pending = new AbortController();
      const move = (moveEvent) => {
        if (moveEvent.pointerId !== pointer) return;
        if (!started) {
          if (Math.hypot(moveEvent.clientX - start.x, moveEvent.clientY - start.y) < DRAG_THRESHOLD) return;
          if (!this.begin(item, moveEvent.pointerType || 'mouse')) { pending.abort(); return; }
          started = true;
          item.setPointerCapture?.(pointer);
          shared.session.ghost = this.ghost(item, moveEvent);
          // The item leaves the flow only once its copy is on screen; a copy
          // library (mode copy) keeps its item where it is.
          if (silhouetteFor(this) && this.mode !== 'copy') {
            shared.session.silhouette = true;
            // Asked before the item leaves the flow: with it gone, a grid of
            // two cells is one cell and does not look like a grid.
            shared.session.wrappedLists = new Set(isWrapped(items(this)) ? [this] : []);
            item.setAttribute('data-sf-sortable-lifted', '');
            this.retarget(moveEvent.clientX, moveEvent.clientY);
          }
        }
        moveEvent.preventDefault();
        this.track(moveEvent.clientX, moveEvent.clientY);
      };
      const up = (upEvent) => {
        if (upEvent.pointerId !== pointer) return;
        pending.abort();
        if (started) this.drop();
      };
      const cancel = () => {
        pending.abort();
        if (started) finish(this, 'cancelled');
      };
      globalThis.addEventListener('pointermove', move, { signal: pending.signal, passive: false });
      globalThis.addEventListener('pointerup', up, { signal: pending.signal });
      globalThis.addEventListener('pointercancel', cancel, { signal: pending.signal });
      // Capture phase: cancel the drag before page-level Escape handlers run.
      globalThis.addEventListener('keydown', (keyEvent) => { if (keyEvent.key === 'Escape' && started) { keyEvent.preventDefault(); keyEvent.stopPropagation(); cancel(); } }, { signal: pending.signal, capture: true });
    }

    ghost(item, event) {
      const box = item.getBoundingClientRect();
      const ghost = item.cloneNode(true);
      ghost.removeAttribute('id');
      for (const element of ghost.querySelectorAll('[id]')) element.removeAttribute('id');
      ghost.classList.add('sf-sortable-ghost');
      ghost.setAttribute('aria-hidden', 'true');
      ghost.inert = true;
      Object.assign(ghost.style, { width: `${box.width}px`, left: `${box.left}px`, top: `${box.top}px` });
      shared.session.offset = { x: event.clientX - box.left, y: event.clientY - box.top };
      globalThis.document.body.append(ghost);
      return ghost;
    }

    track(x, y) {
      if (!shared.session) return;
      shared.session.pointer = { x, y };
      if (shared.session.ghost) Object.assign(shared.session.ghost.style, { left: `${x - shared.session.offset.x}px`, top: `${y - shared.session.offset.y}px` });
      this.retarget(x, y);
      this.startAutoScroll();
    }

    retarget(x, y) {
      const under = globalThis.document.elementFromPoint(x, y);
      const list = under?.closest?.('sf-sortable');
      for (const target of externalTargets) {
        const resolved = target.resolve(x, y, activeSortableSession());
        if (resolved) {
          shared.session.list = null;
          shared.session.external = { target, ...resolved };
          showIndicator(resolved.rect);
          return;
        }
      }
      shared.session.external = null;
      if (list && accepts(list, shared.session.group)
          && shared.session.silhouette && silhouetteFor(list)) {
        shared.session.list = list;
        shared.session.index = placeSilhouette(shared.session, list, x, y);
        showIndicator(null);
        return;
      }
      shared.session.placeholder?.remove();
      if (list && accepts(list, shared.session.group)) {
        const resolved = listTarget(list, x, y);
        shared.session.list = list;
        // Store the final index: positions after the source shift by one.
        shared.session.index = list === shared.session.fromList && shared.session.mode === 'move' && resolved.index > shared.session.sourceIndex ? resolved.index - 1 : resolved.index;
        showIndicator(resolved.rect);
      } else {
        shared.session.list = null;
        showIndicator(null);
      }
    }

    // Scrolls the nearest scroll container every frame while the pointer
    // stays in its edge zone, including when the pointer is held still.
    startAutoScroll() {
      if (!shared.session || shared.session.scrollFrame) return;
      const step = () => {
        if (!shared.session?.pointer) return;
        shared.session.scrollFrame = 0;
        const { x, y } = shared.session.pointer;
        const container = scrollContainer(globalThis.document.elementFromPoint(x, y));
        if (!container) return;
        const box = container === globalThis.document.scrollingElement
          ? { top: 0, bottom: globalThis.innerHeight }
          : container.getBoundingClientRect();
        const max = container.scrollHeight - container.clientHeight;
        let delta = 0;
        if (y < box.top + EDGE && container.scrollTop > 0) delta = -Math.ceil((box.top + EDGE - y) / 4);
        else if (y > box.bottom - EDGE && container.scrollTop < max) delta = Math.ceil((y - box.bottom + EDGE) / 4);
        if (delta) {
          // Instant even under scroll-behavior: smooth, so every frame advances.
          container.scrollBy({ top: delta, behavior: 'instant' });
          this.retarget(x, y);
          shared.session.scrollFrame = globalThis.requestAnimationFrame(step);
        }
      };
      shared.session.scrollFrame = globalThis.requestAnimationFrame(step);
    }

    drop() {
      if (!shared.session) return;
      const current = shared.session;
      if (current.external) {
        current.external.target.drop(activeSortableSession(), current.external.descriptor);
        finish(this, 'dropped');
        return;
      }
      if (current.list) {
        const index = current.index;
        const unchanged = current.list === current.fromList && index === current.sourceIndex;
        if (!unchanged) {
          emitIntent(current.list, {
            item: current.item, from: current.from, to: current.list.getAttribute('id') || current.list.group,
            index, mode: current.mode,
          });
          current.list.announce?.(format(messages().dropped, { item: itemLabel(current.source), index: index + 1, list: listName(current.list) }));
          finish(this, 'dropped');
          return;
        }
      }
      finish(this, 'cancelled');
    }

    // Keyboard path --------------------------------------------------------
    keyboardTargets() {
      return [...globalThis.document.querySelectorAll('sf-sortable')].filter((list) => list === shared.session?.fromList ? shared.session.mode === 'move' : accepts(list, shared.session?.group));
    }

    describeKeyboard(announce = true) {
      if (!shared.session) return;
      if (shared.session.external) {
        showIndicator(shared.session.external.rect);
        if (announce) this.announce(format(messages().target, { target: shared.session.external.label || '' }));
        return;
      }
      const list = shared.session.list;
      const full = items(list);
      const sameList = list === shared.session.fromList && shared.session.mode === 'move';
      const positions = full.length + (sameList ? 0 : 1);
      const physical = sameList && shared.session.index > shared.session.sourceIndex ? shared.session.index + 1 : shared.session.index;
      showIndicator(listIndicatorRect(list, full, Math.min(physical, full.length), list.getAttribute('orientation') === 'horizontal'));
      if (announce) this.announce(format(messages().moved, { index: shared.session.index + 1, total: positions, list: listName(list) }));
    }

    onKeyDown(event) {
      const item = event.target.closest?.(ITEM);
      if (!shared.session) {
        if (!item || item.closest('sf-sortable') !== this || event.target !== item) return;
        if (event.key !== ' ' && event.key !== 'Enter') return;
        event.preventDefault();
        if (!this.begin(item, 'keyboard')) return;
        // An abandoned keyboard move is cancelled when focus or a click leaves the list.
        const abandon = () => { if (shared.session?.fromList === this) { this.announce(messages().cancelled); finish(this, 'cancelled'); } };
        const cleanup = { signal: shared.session.cleanup.signal };
        this.addEventListener('focusout', (focusEvent) => {
          if (focusEvent.relatedTarget && this.contains(focusEvent.relatedTarget)) return;
          globalThis.setTimeout(() => { if (!this.contains(globalThis.document.activeElement)) abandon(); }, 0);
        }, cleanup);
        globalThis.document.addEventListener('pointerdown', (pointerEvent) => { if (!this.contains(pointerEvent.target)) abandon(); }, { ...cleanup, capture: true });
        if (shared.session.mode === 'copy') {
          const [first] = this.keyboardTargets();
          const external = [...externalTargets].flatMap((target) => (target.keyboardTargets?.(activeSortableSession()) || []).map((entry) => ({ target, ...entry })));
          if (first) {
            shared.session.list = first;
            shared.session.index = items(first).length;
          } else if (external.length) {
            shared.session.external = external[0];
          } else {
            finish(this, 'cancelled');
            return;
          }
        }
        if (shared.session.external) {
          this.describeKeyboard(false);
          this.announce(`${format(messages().picked, { item: itemLabel(item), index: 1, total: 1, list: '' }).split('.')[0]}. ${format(messages().target, { target: shared.session.external.label || '' })}`);
          return;
        }
        const all = items(shared.session.list);
        this.describeKeyboard(false);
        this.announce(format(messages().picked, { item: itemLabel(item), index: shared.session.index + 1, total: all.length, list: listName(shared.session.list) }));
        return;
      }
      if (shared.session.input !== 'keyboard' || shared.session.fromList !== this) return;
      const lists = this.keyboardTargets();
      const external = [...externalTargets].flatMap((target) => (target.keyboardTargets?.(activeSortableSession()) || []).map((entry) => ({ target, ...entry })));
      if (event.key === 'Escape' || event.key === 'Tab') {
        if (event.key === 'Escape') event.preventDefault();
        this.announce(messages().cancelled);
        finish(this, 'cancelled');
        return;
      }
      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();
        this.drop();
        return;
      }
      const vertical = { ArrowUp: -1, ArrowDown: 1 }[event.key];
      const across = { ArrowLeft: -1, ArrowRight: 1 }[event.key];
      if (vertical === undefined && across === undefined) return;
      event.preventDefault();
      if (shared.session.external) {
        const position = external.findIndex((entry) => entry.target === shared.session.external.target && JSON.stringify(entry.descriptor) === JSON.stringify(shared.session.external.descriptor));
        const next = external[position + (vertical ?? across)];
        if (next) shared.session.external = next;
        else if ((vertical ?? across) < 0 && lists.length) {
          shared.session.external = null;
          shared.session.list = lists.at(-1);
          shared.session.index = items(shared.session.list).length - (shared.session.list === shared.session.fromList && shared.session.mode === 'move' ? 1 : 0);
        }
        this.describeKeyboard();
        return;
      }
      const list = shared.session.list;
      const count = items(list).length - (list === shared.session.fromList && shared.session.mode === 'move' ? 1 : 0);
      if (vertical !== undefined) {
        const next = shared.session.index + vertical;
        if (next >= 0 && next <= count) shared.session.index = next;
        else if (next > count && across === undefined && external.length && lists.indexOf(list) === lists.length - 1) shared.session.external = external[0];
      } else {
        const next = lists[lists.indexOf(list) + across];
        if (next) {
          shared.session.list = next;
          shared.session.index = Math.min(shared.session.index, items(next).length - (next === shared.session.fromList && shared.session.mode === 'move' ? 1 : 0));
        } else if (across > 0 && external.length) {
          shared.session.external = external[0];
        }
      }
      this.describeKeyboard();
    }
  }

  registry.define('sf-sortable', SfSortable);
  return SfSortable;
}

/**
 * sf-sortable's pointer behaviour on any container, without the element: a
 * table's head row cannot hold a custom element around its cells, and its
 * columns move with every cell under them (owner, 2026-10-13). The container
 * keeps its markup; the controller listens on it.
 *
 * options:
 *   items        selector of the movable children (required)
 *   canStart     (event, item) => boolean -- a press that may begin a drag
 *   groupOf      (item) => string -- an item moves among items of its group
 *   preview      'column' (default) | 'line'
 *   extent       the element a column spans (a table); default the container
 *   cellsOf      (item) => elements to mark as the moving column (its cells)
 *   label        the list's name for the announcement
 *   onIntent     ({item, from, index, group}) -- index among the group's items
 *                without the dragged one, the place it is to take
 * Returns detach().
 *
 * Keyboard reordering stays where a list is: a table's column settings are an
 * sf-sortable list with every key path. A click that ends a drag is swallowed,
 * so a heading that sorts on click does not sort on a drop.
 */
function attachSortable(container, options = {}) {
  if (!(container instanceof globalThis.Element) || typeof options.items !== 'string') {
    throw new TypeError('attachSortable needs a container and an items selector');
  }
  const doc = globalThis.document;
  const preview = options.preview === 'line' ? 'line' : 'column';
  const groupOf = typeof options.groupOf === 'function' ? options.groupOf : () => '';
  const canStart = typeof options.canStart === 'function' ? options.canStart : () => true;
  const cellsOf = typeof options.cellsOf === 'function' ? options.cellsOf : (item) => [item];
  const extentOf = () => options.extent?.isConnected ? options.extent : container;
  const live = doc.createElement('div');
  live.className = 'sf-sortable-live';
  live.setAttribute('aria-live', 'polite');
  doc.body.append(live);
  const abort = new AbortController();
  let session = null;

  const members = (group) => [...container.querySelectorAll(options.items)].filter((item) => groupOf(item) === group);
  const outline = () => {
    if (session.outline) return session.outline;
    const box = doc.createElement('div');
    box.className = preview === 'column' ? 'sf-sortable-column-outline' : 'sf-sortable-indicator';
    box.setAttribute('aria-hidden', 'true');
    doc.body.append(box);
    session.outline = box;
    return box;
  };

  const place = (x) => {
    const peers = members(session.group).filter((item) => item !== session.item);
    const boxes = peers.map((item) => item.getBoundingClientRect());
    let index = boxes.length;
    for (let at = 0; at < boxes.length; at += 1) {
      if (x < boxes[at].left + boxes[at].width / 2) { index = at; break; }
    }
    session.index = index;
    const extent = extentOf().getBoundingClientRect();
    const width = session.width;
    const before = boxes[index];
    const after = boxes[index - 1];
    let left;
    if (preview === 'column') {
      // The outline stands where the column will be. Moving towards the start
      // it takes the place of the column it goes before (that one moves on);
      // moving towards the end it ends where the column it goes after ends.
      if (index > session.originalIndex && after) left = after.right - width;
      else left = before ? before.left : (after ? after.right - width : extent.left);
    } else {
      left = (before ? before.left : after ? after.right : extent.left) - 1;
    }
    Object.assign(outline().style, {
      left: `${left}px`, top: `${extent.top}px`,
      width: preview === 'column' ? `${width}px` : '2px', height: `${extent.height}px`,
    });
  };

  const autoScroll = (x) => {
    for (let node = container.parentElement; node; node = node.parentElement) {
      const style = globalThis.getComputedStyle(node);
      if (!/(auto|scroll)/u.test(style.overflowX) || node.scrollWidth <= node.clientWidth) continue;
      const box = node.getBoundingClientRect();
      if (x < box.left + EDGE) node.scrollBy({left: -Math.ceil((box.left + EDGE - x) / 4), behavior: 'instant'});
      else if (x > box.right - EDGE) node.scrollBy({left: Math.ceil((x - box.right + EDGE) / 4), behavior: 'instant'});
      return;
    }
  };

  const end = (dropped) => {
    const ended = session;
    session = null;
    if (!ended) return;
    ended.pending.abort();
    ended.ghost?.remove();
    ended.outline?.remove();
    for (const cell of ended.cells) cell.removeAttribute('data-sf-sortable-column-source');
    doc.documentElement.removeAttribute('data-sf-sortable-active');
    if (!ended.started) return;
    // The click a drop ends with is not a click on the heading. It comes in the
    // same task as the pointerup, so the guard is gone by the next one and a
    // later click is a click again.
    const swallow = (event) => { event.preventDefault(); event.stopImmediatePropagation(); };
    container.addEventListener('click', swallow, {capture: true, once: true});
    globalThis.setTimeout(() => container.removeEventListener('click', swallow, {capture: true}), 0);
    if (!dropped) {
      live.textContent = messages().cancelled;
      return;
    }
    if (ended.index === undefined || ended.index === ended.originalIndex) return;
    const id = ended.item.getAttribute('data-sf-sortable-item') || ended.item.dataset.key || '';
    live.textContent = format(messages().dropped, {item: itemLabel(ended.item), index: ended.index + 1, list: options.label || ''});
    options.onIntent?.({item: id, from: ended.group, index: ended.index, group: ended.group});
  };

  container.addEventListener('pointerdown', (event) => {
    if (event.button !== 0 || session || shared.session) return;
    const item = event.target.closest?.(options.items);
    if (!item || !container.contains(item) || !canStart(event, item)) return;
    const group = groupOf(item);
    const peers = members(group);
    if (peers.length < 2) return;
    const start = {x: event.clientX, y: event.clientY};
    const pending = new AbortController();
    const box = item.getBoundingClientRect();
    session = {item, group, pending, started: false, cells: [], width: box.width, originalIndex: peers.indexOf(item)};
    const move = (moveEvent) => {
      if (moveEvent.pointerId !== event.pointerId || !session) return;
      if (!session.started) {
        if (Math.hypot(moveEvent.clientX - start.x, moveEvent.clientY - start.y) < DRAG_THRESHOLD) return;
        session.started = true;
        doc.documentElement.setAttribute('data-sf-sortable-active', '');
        const ghost = item.cloneNode(true);
        ghost.removeAttribute('id');
        for (const element of ghost.querySelectorAll('[id]')) element.removeAttribute('id');
        ghost.classList.add('sf-sortable-ghost');
        ghost.setAttribute('aria-hidden', 'true');
        ghost.inert = true;
        Object.assign(ghost.style, {width: `${box.width}px`, height: `${box.height}px`, left: `${box.left}px`, top: `${box.top}px`});
        doc.body.append(ghost);
        session.ghost = ghost;
        session.offset = {x: start.x - box.left, y: start.y - box.top};
        session.cells = cellsOf(item).filter(Boolean);
        for (const cell of session.cells) cell.setAttribute('data-sf-sortable-column-source', '');
      }
      moveEvent.preventDefault();
      Object.assign(session.ghost.style, {left: `${moveEvent.clientX - session.offset.x}px`, top: `${moveEvent.clientY - session.offset.y}px`});
      autoScroll(moveEvent.clientX);
      place(moveEvent.clientX);
    };
    globalThis.addEventListener('pointermove', move, {signal: pending.signal, passive: false});
    globalThis.addEventListener('pointerup', (upEvent) => { if (upEvent.pointerId === event.pointerId) end(true); }, {signal: pending.signal});
    globalThis.addEventListener('pointercancel', () => end(false), {signal: pending.signal});
    globalThis.addEventListener('keydown', (keyEvent) => {
      if (keyEvent.key === 'Escape' && session?.started) { keyEvent.preventDefault(); keyEvent.stopPropagation(); end(false); }
    }, {signal: pending.signal, capture: true});
  }, {signal: abort.signal});

  return () => {
    end(false);
    abort.abort();
    live.remove();
  };
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ SORTABLE_MOVE_EVENT, activeSortableSession, attachSortable, defineSortable, registerSortableDropTarget, sortableIndexAt });

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "6faa2d48a2c0"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-sortable for the shim (stands/18-aliases-ci/alias.mjs, standard §16 item 20). mode: same-detail (the shim sends the new and the old name), split / detail-adds (a detail adapter, refused by the shim), attribute-and-property, method, property, manifest-only (the DOM name does not change), host-attribute (no shim), retired.","component":"sf-sortable","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"sf-sortable-intent","to":"sf-sortable-move","kind":"event","component":"sf-sortable","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","cancelable":false,"manifest":{"from":"sf-sortable-intent","to":"move"},"section":"§8, vocabulary 1.1.5 §5.1","note":"the alias table planned sf-sortable; the vocabulary\'s sf-sortable-move decides"},{"from":"sf-sortable-state","to":"state","kind":"event","component":"sf-sortable","since":"2026-10-27","remove_after":"2026-12-01","mode":"manifest-only","note":"the manifest declares the verb; the DOM name sf-sortable-state is unchanged, so the shim has nothing to send"},{"from":"sf-sortable-insert","to":"insert","kind":"event","component":"sf-sortable","since":"2026-10-27","remove_after":"2026-12-01","mode":"manifest-only","note":"the manifest declares the verb; the DOM name sf-sortable-insert is unchanged, so the shim has nothing to send"}]}');

/***/ },

/***/ "34bb89f847b9"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.sortable","tag":"sf-sortable","version":"1.1.3","kind":"leaf","settings":{"group":{"type":"string","default":"","summary":"The list\'s group: an item moves between lists of one group; required for a list whose items move"},"accepts":{"type":"string","default":"","summary":"Other groups whose items this list takes, separated by spaces"},"mode":{"type":"enum","values":["move","copy"],"default":"move","summary":"copy: a library list; its items are copied out and stay"},"orientation":{"type":"enum","values":["vertical","horizontal"],"default":"vertical"},"label":{"type":"string","default":"","summary":"The list\'s name in what is announced"},"preview":{"type":"enum","values":["silhouette","line"],"default":"silhouette","summary":"silhouette opens a gap the size of the item; line draws a line"},"inserter-items":{"type":"string","default":"","summary":"The items an insertion point offers, as JSON [{item, label, icon?, description?}]; empty: no insertion point"}},"values":{},"events":{"move":{"carries":{"item":"string","from":"string","to":"string","index":"number","mode":{"type":"enum","values":["move","copy"]}},"summary":"The request to move (or copy) an item to a place: one manual move of vocabulary 1.1.5 §5 move, {id, parent, position} named item, to and index; the host applies it"},"state":{"carries":{"state":{"type":"enum","values":["picked","dropped","cancelled"]},"item":"string"},"own-verb":true,"summary":"A drag\'s step: picked up, dropped or cancelled"},"insert":{"carries":{"index":{"type":"number","integer":true,"schema":{"minimum":0}},"item":"string","to":"string"},"cancelable":true,"own-verb":true,"summary":"The inserter\'s request to put a new item of the palette at a place; cancelable"}},"actions":{},"css-variables":{"--sf-sortable-dragging-opacity":{"type":"number","state":"dragging"},"--sf-sortable-ghost-opacity":{"type":"number","state":"dragging"},"--sf-sortable-ghost-z-index":{"type":"number","state":"dragging"},"--sf-sortable-indicator-color":{"type":"color","state":"dragging"},"--sf-sortable-placeholder-border-color":{"type":"color","state":"dragging"}}}');

/***/ },

/***/ "fca41e9837f0"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Drag and drop","runtime":{"cancelled":"Move cancelled.","dropped":"Dropped {item} at position {index} in “{list}”.","empty":"Nothing found","hint":"Plus to insert after.","inserted":"Inserted {item} at position {index} in “{list}”.","instructions":"Space or Enter to pick up, arrows to move, Space or Enter to drop, Escape to cancel.","menu":"Insert","moved":"Position {index} of {total} in “{list}”.","picked":"Picked up {item}. Position {index} of {total} in “{list}”.","point":"Insert: position {index} of {total}","search":"Find","target":"Target: {target}."},"events":{"state":{"label":"Drag step"},"insert":{"label":"Insert"}}}');

/***/ },

/***/ "46c0e03c9179"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Перетаскивание","runtime":{"cancelled":"Перемещение отменено.","dropped":"Положено: {item}, позиция {index} в «{list}».","empty":"Ничего не найдено","hint":"Плюс — вставить после.","inserted":"Вставлено: {item}, позиция {index} в «{list}».","instructions":"Пробел или Enter — взять, стрелки — переместить, Пробел или Enter — положить, Escape — отменить.","menu":"Вставить","moved":"Позиция {index} из {total} в «{list}».","picked":"Взято: {item}. Позиция {index} из {total} в «{list}».","point":"Вставить: позиция {index} из {total}","search":"Найти","target":"Цель: {target}."},"events":{"state":{"label":"Шаг перетаскивания"},"insert":{"label":"Вставить"}}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("6064f55a0aa2");
/******/
/******/ })()
;