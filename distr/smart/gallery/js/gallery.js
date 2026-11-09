/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "4130d35a368a"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   normalizeSlideContent: () => (/* binding */ normalizeSlideContent)
/* harmony export */ });
// Ignore source formatting, not authored slide boundaries. Non-Node values are
// retained for the existing Slider template context (including Lit results).
function normalizeSlideContent(content) {
  const items = Array.isArray(content) ? content : [content];
  return items.filter(item => {
    if (!(item instanceof Node)) return true;
    if (item.nodeType === Node.COMMENT_NODE) return false;
    return item.nodeType !== Node.TEXT_NODE || item.textContent.trim() !== '';
  });
}

/***/ },

/***/ "f28a9d913ce0"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// Generated from the `tag` rows of src/smart/*/aliases.json and the element_aliases of
// src/core/contracts/packages/*.package.json by scripts/tag-alias-table.mjs; do not edit.
// The dated tag aliases of the Framework and of its component packages, read by core/js/tag-aliases.js.
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Object.freeze([Object.freeze({
  from: 'sf-avatars',
  to: 'sf-avatar-group',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-button-group',
  to: 'sf-segmented',
  since: '2026-11-08',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-change-confirm',
  to: 'sf-confirm-change',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-close',
  to: 'sf-button-close',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-code-input',
  to: 'sf-input-code',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-color',
  to: 'sf-input-color',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-composition-overlay',
  to: 'sf-editor-overlay',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-content-editor',
  to: 'sf-editor-content',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-context-menu',
  to: 'sf-menu-context',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-copy-button',
  to: 'sf-button-copy',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-country-code',
  to: 'sf-input-country',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-data-view',
  to: 'sf-view',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-datepicker',
  to: 'sf-input-date',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-download-file',
  to: 'sf-file-download',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-icon-button',
  to: 'sf-button-icon',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-image-field',
  to: 'sf-input-image',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-inline-editor',
  to: 'sf-editor-inline',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-lookup',
  to: 'sf-input-lookup',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-page-header',
  to: 'sf-header-page',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-property-view',
  to: 'sf-view-properties',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-quantity',
  to: 'sf-input-quantity',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-range-slider',
  to: 'sf-slider-range',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-rich-text',
  to: 'sf-input-rich',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-site-header',
  to: 'sf-header-site',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-table',
  to: 'sf-view-table',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-textarea',
  to: 'sf-input-textarea',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-thread-list',
  to: 'sf-chat-threads',
  since: '2026-11-03',
  remove_after: '2027-01-01'
})]));

/***/ },

/***/ "4a85acfb05c1"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   canonicalTag: () => (/* binding */ canonicalTag),
/* harmony export */   defineTagAliases: () => (/* binding */ defineTagAliases),
/* harmony export */   isTag: () => (/* binding */ isTag),
/* harmony export */   listTagAliases: () => (/* binding */ listTagAliases),
/* harmony export */   noteTagAlias: () => (/* binding */ noteTagAlias),
/* harmony export */   registerTagAliasRows: () => (/* binding */ registerTagAliasRows),
/* harmony export */   registerTagAliases: () => (/* binding */ registerTagAliases),
/* harmony export */   tagNames: () => (/* binding */ tagNames),
/* harmony export */   tagSelector: () => (/* binding */ tagSelector)
/* harmony export */ });
/* harmony import */ var _deprecations_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d3818183b14c");
/* harmony import */ var _alias_table_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5dcef5de40cf");
/* harmony import */ var _tag_aliases_generated_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("f28a9d913ce0");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_deprecations_js__WEBPACK_IMPORTED_MODULE_0__, _alias_table_js__WEBPACK_IMPORTED_MODULE_1__]);
([_deprecations_js__WEBPACK_IMPORTED_MODULE_0__, _alias_table_js__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _deprecations_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_deprecations_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _alias_table_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_alias_table_js__WEBPACK_IMPORTED_MODULE_1__);
// Dated tag aliases (rename plan R0, ui-control RENAME-PLAN-2026-11-03; change
// lifecycle: contracts/changes/journal.json, kind "tag"). When a Smart
// component takes a new tag, the old tag keeps working until its
// `remove_after` day:
//
// - Definition. defineTagAliases(Class, tag) defines each old tag as a trivial
//   subclass of the class that defines the new one (the Smart base calls it
//   from define()). The Loader's rule lists the old tag beside the new one, so
//   markup with the old tag alone loads the bundle.
// - Note. The first old-tag element a page connects is noted in
//   SF.deprecations (kind "tag") and named once on the console with the new tag
//   and the date, whatever the page opted into: an element name is the most
//   visible thing a page writes, and the old one is going.
// - Script. Code that finds a renamed element by name asks for both names
//   through one helper instead of a literal:
//
//     import {tagSelector, isTag} from '../../core/js/smart-base';
//     host.querySelector(`.sf-tag > ${tagSelector('sf-button-close')}`);
//     if (isTag(node, 'sf-button-close')) ...
//
// - Sheets. A selector that names the new tag names the old one beside it in
//   source, `:is(sf-button-close, sf-close)`, for as long as the alias lives
//   (scripts/rename-smart-tag.mjs writes it, --sweep takes it out; the
//   contract test tests/tag-aliases.contract.test.mjs holds both).
//
// The aliases are a static table (tag-aliases.generated.js, written by
// scripts/tag-alias-table.mjs from every component's aliases.json and from the
// element_aliases of the component package references,
// contracts/packages/*.package.json), so a lookup finds an old tag before the
// renamed component's bundle has run, a package's (sf-table, rename plan R2)
// as well as the Framework's. A package's component adds its rows again when it
// is defined, which matters only for a package the pair does not reference. Every copy of this
// module shares one state on the page (a global symbol); the Smart bundles
// reach it through the shared runtime (smart-base re-exports it).



const STATE = Symbol.for('simai.sf.tag-aliases');

function state() {
  if (!globalThis[STATE]) {
    const shared = {
      byOld: new Map(),
      byNew: new Map(),
      noted: new Set()
    };
    Object.defineProperty(globalThis, STATE, {
      value: shared,
      configurable: true
    });

    for (const row of _tag_aliases_generated_js__WEBPACK_IMPORTED_MODULE_2__["default"]) addRow(shared, row);
  }

  return globalThis[STATE];
}

function addRow(shared, row) {
  if (shared.byOld.has(row.from)) return;
  shared.byOld.set(row.from, row);
  shared.byNew.set(row.to, [...(shared.byNew.get(row.to) ?? []), row.from]);
} // Rows from a component's aliases.json (its `tag` rows); the Framework's are
// already known, a package's are added here.


function registerTagAliases(table, tag) {
  const {
    rows
  } = (0,_alias_table_js__WEBPACK_IMPORTED_MODULE_1__.readTagAliases)(table, {
    tag
  });
  const shared = state();

  for (const row of rows) addRow(shared, row);

  return rows;
} // Rows a component set gives at runtime (SF.RuleLoader.registerPackage(name,
// {aliases})): {from, to, since, remove_after}, the set's own former tags, so
// SIMAI Framework needs no table row for a set it does not know. Answers the
// rows taken; a row whose old tag is already known keeps the first.

function registerTagAliasRows(rows) {
  const shared = state();
  const taken = [];

  for (const row of Array.isArray(rows) ? rows : []) {
    if (!row || typeof row.from !== 'string' || typeof row.to !== 'string') continue;
    if (shared.byOld.has(row.from)) continue;
    const clean = Object.freeze({
      from: row.from,
      to: row.to,
      since: String(row.since ?? ''),
      remove_after: String(row.remove_after ?? '')
    });
    addRow(shared, clean);
    taken.push(clean);
  }

  return taken;
} // The open old names of a tag, its own first: ['sf-button-close', 'sf-close'].

function tagNames(tag) {
  const name = String(tag || '').toLowerCase();
  return [name, ...(state().byNew.get(name) ?? [])];
} // A selector for the tag that matches its old names too:
// ':is(sf-button-close, sf-close)', or the tag itself when it has none.

function tagSelector(tag) {
  const names = tagNames(tag);
  return names.length > 1 ? `:is(${names.join(', ')})` : names[0];
} // Whether an element is the tag, under its own or an old name.

function isTag(element, tag) {
  const name = element?.localName;
  return Boolean(name) && tagNames(tag).includes(name);
} // The current name of a tag: 'sf-button-close' for 'sf-close'. An old tag the
// page still has as an element of its own stays itself: a component package
// built before its rename (rules naming sf-table alone) beside a pair whose
// table already knows the new name, where the new tag would never upgrade.

function canonicalTag(tag) {
  const name = String(tag || '').toLowerCase();
  const row = state().byOld.get(name);
  if (!row) return name;
  const own = globalThis.customElements?.get?.(name);
  if (own && !own.sfTagAliasOf) return name;
  let rules = null;

  try {
    rules = globalThis.SF?.Loader?.getCustomElementRules?.() ?? null;
  } catch {
    rules = null;
  }

  if (rules && rules[name] && !rules[row.to]) return name;
  return row.to;
} // Every open row: [{from, to, since, remove_after}].

function listTagAliases() {
  return [...state().byOld.values()].map(row => ({ ...row
  }));
} // The page met an element under an old name: once per old tag.

function noteTagAlias(row) {
  const shared = state();
  const expired = (0,_alias_table_js__WEBPACK_IMPORTED_MODULE_1__.aliasExpired)(row);
  (0,_deprecations_js__WEBPACK_IMPORTED_MODULE_0__.noteDeprecated)({
    component: row.to,
    kind: 'tag',
    from: row.from,
    to: row.to,
    tag: row.to,
    since: row.since,
    remove_after: row.remove_after,
    expired
  });
  if (shared.noted.has(row.from)) return;
  shared.noted.add(row.from); // deprecations.js prints an expired name itself, and every name when the
  // page opted in; the note here is for the rest.

  const optedIn = globalThis.document?.documentElement?.dataset?.sfDeprecations === 'warn' || globalThis.SF?.deprecations?.warn === true;
  if (expired || optedIn) return;
  globalThis.console?.warn?.(`[SIMAI Framework] <${row.from}> is now <${row.to}>; the old tag works until ${row.remove_after}. Write <${row.to}>. See contracts/changes/journal.json.`);
} // Defines each old tag of `tag` as a subclass of `Base` (the class that
// defines `tag`), through `define(name, Class)`: the Smart base passes its
// definition queue, so both names are defined in the same batch. Returns the
// rows defined.

function defineTagAliases(Base, tag, {
  table = Base?.aliases,
  define
} = {}) {
  if (table) registerTagAliases(table, tag);
  const rows = (state().byNew.get(tag) ?? []).map(from => state().byOld.get(from));
  const registry = globalThis.customElements;
  const defined = [];

  for (const row of rows) {
    if (!registry || registry.get(row.from)) continue;

    class TagAlias extends Base {
      connectedCallback() {
        noteTagAlias(row);
        super.connectedCallback?.();
      }

    }

    Object.defineProperty(TagAlias, 'sfTagAliasOf', {
      value: row.to
    });
    (define ?? ((name, Class) => registry.define(name, Class)))(row.from, TagAlias);
    defined.push(row);
  }

  return defined;
}

if (typeof globalThis !== 'undefined') {
  globalThis.SF = globalThis.SF || {}; // For scripts that are not Smart bundles (class components, a page):
  // SF.tags.selector('sf-button-close').

  if (!globalThis.SF.tags) {
    globalThis.SF.tags = Object.freeze({
      names: tagNames,
      selector: tagSelector,
      is: isTag,
      canonical: canonicalTag,
      list: listTagAliases
    });
  }
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "d0c0e64421b6"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _core_js_deprecations__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("d3818183b14c");
/* harmony import */ var _core_js_tag_aliases_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("4a85acfb05c1");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("56ae6cc9a5ec");
/* harmony import */ var _component_slider_js_slide_content__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("4130d35a368a");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("a2bebed909d0");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("755770a8ce5c");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("281c6761571f");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("74650ab742c0");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_deprecations__WEBPACK_IMPORTED_MODULE_2__, _core_js_tag_aliases_js__WEBPACK_IMPORTED_MODULE_3__, _js_templates_default__WEBPACK_IMPORTED_MODULE_4__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_deprecations__WEBPACK_IMPORTED_MODULE_2__, _core_js_tag_aliases_js__WEBPACK_IMPORTED_MODULE_3__, _js_templates_default__WEBPACK_IMPORTED_MODULE_4__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_deprecations__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_core_js_deprecations__WEBPACK_IMPORTED_MODULE_2__);









 // sf-gallery from its component.json (standard simai.smart-component 1.3.8
// §3, §4, §8): its settings, values and actions are made by
// core/js/element-manifest.js, and the old names -- title, blur, sf-change,
// sf-open, sf-close and the readers getModal(), getInlineSlider(),
// getLightboxSlider() -- are dated rows of aliases.json.

const GalleryElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_6__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_8__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_9__
  },
  source: 'ru',
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_7__
}); // What retires without a new name (aliases.json rows with `to: null`): kept
// until the date, and each call is noted with it.

function noteRetired(from) {
  (0,_core_js_deprecations__WEBPACK_IMPORTED_MODULE_2__.noteDeprecated)({
    component: 'sf-gallery',
    tag: 'sf-gallery',
    kind: 'action',
    from,
    to: null,
    since: _aliases_json__WEBPACK_IMPORTED_MODULE_7__.since,
    remove_after: _aliases_json__WEBPACK_IMPORTED_MODULE_7__.remove_after
  });
}

function normalizeSlotNodes(content) {
  if (!content || content === null || typeof content === 'undefined') {
    return [];
  }

  return (0,_component_slider_js_slide_content__WEBPACK_IMPORTED_MODULE_5__.normalizeSlideContent)(content).filter(node => node instanceof Node);
}

const GALLERY_TRIGGER_SELECTOR = '[data-sf-gallery]';
let delegatedGallery = null;
const DELEGATED_MODAL_DEFAULTS = {
  width: 'calc(100vw - var(--sf-space-3) * 2)',
  height: 'calc(100dvh - var(--sf-space-6) * 2)',
  overlay: 'true',
  'show-header': 'false',
  'show-close': 'true',
  'body-class': 'sf-gallery-lightbox-body h-full',
  'content-class': 'sf-gallery-lightbox-modal-content h-full min-h-0',
  'surface-class': 'p-0 border-0 radius-square bg-transparent shadow-flat',
  'surface-padding': '0'
};
const DELEGATED_MODAL_ATTRIBUTES = ['heading', 'text', 'overlay', 'show-header', 'show-close', 'close-on-esc', 'close-on-overlay', 'preserve-scroll-gap', 'position', 'fullscreen', 'width', 'height', 'backdrop-blur', 'blur-type', 'overlay-class', 'close-class', 'surface-class', 'surface-padding', 'panel-class', 'header-class', 'body-class', 'content-class', 'footer-class'];
const DELEGATED_SLIDER_DEFAULTS = {
  arrows: 'true',
  dots: 'false',
  'lightbox-class': 'sf-gallery-lightbox-slider h-full'
};
const DELEGATED_SLIDER_ATTRIBUTES = ['arrows', 'dots', 'thumbs', 'loop', 'space-between', 'speed', 'button-type', 'button-size', 'dots-type', 'dots-size', 'thumbs-class', 'thumb-class', 'slide-class', 'lightbox-class']; // A trigger's data-sf-modal-title and data-sf-modal-blur still configure the
// lightbox: heading and backdrop-blur are their names since standard 1.3.8.

const DELEGATED_MODAL_ATTRIBUTE_ALIASES = {
  title: 'heading',
  blur: 'backdrop-blur'
};
const DELEGATED_SLIDER_ATTRIBUTE_ALIASES = {
  class: 'lightbox-class',
  'root-class': 'lightbox-class'
};
const LIGHTBOX_BACKGROUND_CLOSE_IGNORE_SELECTOR = ['a', 'button', 'input', 'select', 'textarea', 'label', 'summary', 'video', 'audio', 'iframe', 'img', 'picture', 'svg', '[role="button"]', '[data-sf-gallery-open]', '[data-sf-modal-close]', 'sf-button', (0,_core_js_tag_aliases_js__WEBPACK_IMPORTED_MODULE_3__.tagSelector)('sf-button-icon'), '.sf-slider-controls', '.sf-slider-arrows', '.sf-slider-dots', '.sf-slider-pagination', '.sf-slider-thumbnails', '.sf-gallery-external-caption'].join(',');

function getDelegatedAttribute(trigger, items, attrNames) {
  for (const attrName of attrNames) {
    const directValue = trigger?.getAttribute?.(attrName);

    if (directValue !== null && typeof directValue !== 'undefined') {
      return directValue;
    }
  }

  for (const item of items) {
    for (const attrName of attrNames) {
      if (item.hasAttribute?.(attrName)) {
        return item.getAttribute(attrName);
      }
    }
  }

  return undefined;
}

function applyDelegatedAttribute(gallery, attrName, value, fallback) {
  const nextValue = typeof value !== 'undefined' ? value : fallback;

  if (typeof nextValue === 'undefined' || nextValue === null) {
    gallery.removeAttribute(attrName);
    return;
  }

  gallery.setAttribute(attrName, String(nextValue));
}

function applyDelegatedNamespaceOptions({
  gallery,
  trigger,
  items,
  namespace,
  attributes,
  defaults = {},
  aliases = {}
}) {
  attributes.forEach(attrName => {
    const sourceNames = [attrName, ...Object.entries(aliases).filter(([, targetName]) => targetName === attrName).map(([sourceName]) => sourceName)];
    const value = getDelegatedAttribute(trigger, items, sourceNames.flatMap(sourceName => [`data-sf-${namespace}-${sourceName}`, `data-sf-gallery-${sourceName}`]));
    applyDelegatedAttribute(gallery, attrName, value, defaults[attrName]);
  });
}

function getGalleryGroupValue(element) {
  return String(element?.getAttribute?.('data-sf-gallery') || '').trim();
}

function isUsableGalleryHref(value) {
  const normalized = String(value || '').trim();
  return normalized && normalized !== '#';
}

function getGalleryItemSource(element) {
  const image = element.matches?.('img') ? element : element.querySelector?.('img');
  const dataSource = element.getAttribute?.('data-sf-src') || element.getAttribute?.('data-src') || element.getAttribute?.('href') || element.getAttribute?.('src');

  if (isUsableGalleryHref(dataSource)) {
    return dataSource;
  }

  return image?.currentSrc || image?.src || '';
}

function getGalleryItemCaption(element) {
  const image = element.matches?.('img') ? element : element.querySelector?.('img');
  const figure = element.closest?.('figure');
  const figcaption = figure?.querySelector?.('figcaption');
  return element.getAttribute?.('data-caption') || element.getAttribute?.('title') || image?.getAttribute?.('alt') || figcaption?.textContent?.trim?.() || '';
}

function createDelegatedGallerySlide(element) {
  const source = getGalleryItemSource(element);

  if (!source) {
    return null;
  }

  const caption = getGalleryItemCaption(element);
  const figure = document.createElement('figure');
  const image = document.createElement('img');
  figure.className = 'sf-gallery-external-slide flex flex-col gap-1 m-0';
  image.src = source;
  image.alt = caption;
  image.loading = 'lazy';
  image.decoding = 'async';
  image.className = 'sf-gallery-external-image';
  figure.append(image);

  if (caption) {
    const figcaption = document.createElement('figcaption');
    figcaption.className = 'sf-gallery-external-caption color-white';
    figcaption.textContent = caption;
    figure.append(figcaption);
  }

  return figure;
}

function getDelegatedGalleryItems(trigger) {
  const group = getGalleryGroupValue(trigger);

  if (!group) {
    return [trigger];
  }

  return Array.from(document.querySelectorAll(GALLERY_TRIGGER_SELECTOR)).filter(item => getGalleryGroupValue(item) === group);
}

function getDelegatedGallery() {
  if (delegatedGallery?.isConnected) {
    return delegatedGallery;
  }

  delegatedGallery = document.createElement('sf-gallery');
  delegatedGallery.setAttribute('data-sf-gallery-delegated', '');
  delegatedGallery.setAttribute('inline', 'false');
  delegatedGallery.setAttribute('lightbox', 'true');
  document.body.append(delegatedGallery);
  return delegatedGallery;
}

function configureDelegatedGallery(gallery, trigger, items) {
  applyDelegatedNamespaceOptions({
    gallery,
    trigger,
    items,
    namespace: 'modal',
    attributes: DELEGATED_MODAL_ATTRIBUTES,
    defaults: DELEGATED_MODAL_DEFAULTS,
    aliases: DELEGATED_MODAL_ATTRIBUTE_ALIASES
  });
  applyDelegatedNamespaceOptions({
    gallery,
    trigger,
    items,
    namespace: 'slider',
    attributes: DELEGATED_SLIDER_ATTRIBUTES,
    defaults: DELEGATED_SLIDER_DEFAULTS,
    aliases: DELEGATED_SLIDER_ATTRIBUTE_ALIASES
  });
}

let galleryUid = 0;

class SfGallery extends GalleryElement {
  static globalDelegationBound = false;

  static get props() {
    return { ...super.props,
      templateName: {
        attribute: 'template',
        default: 'default'
      },
      rootClass: {
        default: ''
      }
    };
  }

  static bindGlobalDelegation() {
    if (SfGallery.globalDelegationBound) {
      return;
    }

    SfGallery.globalDelegationBound = true;
    document.addEventListener('click', SfGallery.handleDelegatedGalleryClick);
  }

  static handleDelegatedGalleryClick(event) {
    const trigger = event.target.closest?.(GALLERY_TRIGGER_SELECTOR);

    if (!trigger || trigger.closest('sf-gallery')) {
      return;
    }

    const items = getDelegatedGalleryItems(trigger);
    const slides = items.map(createDelegatedGallerySlide).filter(Boolean);

    if (!slides.length) {
      return;
    }

    const index = Math.max(items.indexOf(trigger), 0) + 1;
    event.preventDefault();
    const gallery = getDelegatedGallery();
    configureDelegatedGallery(gallery, trigger, items);
    gallery.setSlot('slide', ...slides);
    gallery.setAttribute('current', String(index));
    requestAnimationFrame(() => gallery.open(index));
  }

  constructor() {
    super();
    this._modalId = '';
    this._inlineSlider = null;
    this._lightboxSlider = null;
    this._modal = null;
    this._current = null;
    this._syncingCurrent = false;
    this._lightboxBackgroundPointerActive = false;
    this._pendingLightboxBackgroundClose = false;
    this._currentRenderMode = '';
    this._nestedDefinitionSyncQueued = false;
    this._handleGalleryClick = this._handleGalleryClick.bind(this);
    this._handleGalleryKeyDown = this._handleGalleryKeyDown.bind(this);
    this._handleInlineSlideChange = this._handleInlineSlideChange.bind(this);
    this._handleLightboxSlideChange = this._handleLightboxSlideChange.bind(this);
    this._handleLightboxBackgroundPointerDown = this._handleLightboxBackgroundPointerDown.bind(this);
    this._handleLightboxBackgroundPointerUp = this._handleLightboxBackgroundPointerUp.bind(this);
    this._handleLightboxBackgroundClick = this._handleLightboxBackgroundClick.bind(this);
    this._handleModalAfterOpen = this._handleModalAfterOpen.bind(this);
    this._handleModalAfterClose = this._handleModalAfterClose.bind(this);
    this._handleModalAfterRender = this._handleModalAfterRender.bind(this);
  }

  connectedCallback() {
    if (!this._modalId) {
      this._modalId = this.getAttribute('modal-id') || this.id || `sf-gallery-${++galleryUid}`;
    }

    super.connectedCallback();
    this.addEventListener('click', this._handleGalleryClick);
    this.addEventListener('keydown', this._handleGalleryKeyDown);
  }

  disconnectedCallback() {
    this.removeEventListener('click', this._handleGalleryClick);
    this.removeEventListener('keydown', this._handleGalleryKeyDown);

    this._detachNestedListeners();

    super.disconnectedCallback();
  }

  get modalId() {
    return this.getAttribute('modal-id') || this._modalId || '';
  }

  get openState() {
    return this.getProp('open');
  }

  get slidesTotal() {
    const sliderTotal = this._getActiveSliderTotal();

    if (sliderTotal !== null) {
      return sliderTotal;
    }

    const slides = normalizeSlotNodes(this.getSlotContent('slide'));
    return slides.length || 0;
  }

  get current() {
    if (this._current !== null) {
      return this._normalizeCurrent(this._current);
    }

    const sliderIndex = this._getActiveSliderIndex();

    if (sliderIndex !== null) {
      return this._normalizeCurrent(sliderIndex + 1);
    }

    return this._getConfiguredCurrent();
  } // current is a value a page may also write (§4.3): the slide to show.


  set current(value) {
    if (value === null || value === undefined || value === '') this.removeAttribute('current');else this.setAttribute('current', String(value));
  }

  _getConfiguredCurrent() {
    return this._normalizeCurrent(this.getProp('current') || 1);
  }

  _normalizeCurrent(value) {
    const total = this.slidesTotal;
    const parsed = Number.parseInt(String(value || 1), 10);
    const safe = Number.isFinite(parsed) ? parsed : 1;

    if (!total) {
      return Math.max(safe, 1);
    }

    return Math.min(Math.max(safe, 1), total);
  }

  _setCurrent(index, source = 'api', options = {}) {
    const {
      emit = true,
      syncAttribute = false
    } = options;

    const next = this._normalizeCurrent(index); // The slide shown before this change: the gallery's own position, else the
    // configured one. Reading the slider here would read the new position on a
    // person's first swipe, which then sent no change at all.


    const previous = this._current !== null ? this._normalizeCurrent(this._current) : this._getConfiguredCurrent();

    if (next === previous && this._current === next) {
      return this;
    }

    this._current = next; // Keep the starting position for a pending nested Slider render, including
    // the Slider that originated this change (it must not be driven back).

    this._rememberSliderIndex(this._inlineSlider, next - 1);

    this._rememberSliderIndex(this._lightboxSlider, next - 1);

    if (syncAttribute) {
      this._syncingCurrent = true;
      this.setAttribute('current', String(next));
      this._syncingCurrent = false;
    }

    if (source !== 'inline') {
      this._syncSliderToIndex(this._inlineSlider, next - 1);
    }

    if (source !== 'lightbox') {
      this._syncSliderToIndex(this._lightboxSlider, next - 1);
    }

    if (emit && next !== previous) {
      // §8: data only; sf-change follows with the same detail until the date.
      this.sfEmit('change', {
        previous,
        current: next,
        total: this.slidesTotal,
        from: source
      });
    }

    return this;
  }

  _getActiveSliderElement() {
    if (this.openState && this._lightboxSlider) {
      return this._lightboxSlider;
    }

    return this._inlineSlider || this._lightboxSlider || null;
  }

  _getSliderIndex(sliderElement) {
    const slider = sliderElement?._boundSlider || null;

    if (!slider) {
      return null;
    }

    const index = typeof slider.realIndex === 'number' ? slider.realIndex : slider.activeIndex;
    return Number.isFinite(index) ? index : null;
  }

  _getActiveSliderIndex() {
    return this._getSliderIndex(this._getActiveSliderElement());
  }

  _getSliderTotal(sliderElement) {
    const slider = sliderElement?._boundSlider || null;

    if (!slider) {
      return null;
    }

    const indexedSlides = new Set();
    slider.slides?.forEach?.(slide => {
      const index = slide?.getAttribute?.('data-swiper-slide-index');

      if (index !== null && typeof index !== 'undefined') {
        indexedSlides.add(index);
      }
    });

    if (indexedSlides.size) {
      return indexedSlides.size;
    }

    const total = slider.slides?.length ?? sliderElement?.querySelectorAll?.('.swiper-slide')?.length ?? 0;
    return total > 0 ? total : null;
  }

  _getActiveSliderTotal() {
    return this._getSliderTotal(this._getActiveSliderElement());
  }

  get state() {
    const props = this.getPropsContext();
    return { ...props,
      modalId: this.modalId,
      open: this.openState,
      current: this.current,
      rootClass: this.getRootClass(),
      slidesTotal: this.slidesTotal
    };
  }

  templateContext() {
    return this.createTemplateContext({ ...this.state
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_4__.renderGalleryTemplate)(this.templateContext());
  }

  afterRender() {
    this._detachNestedListeners();

    this._bindNestedComponents();

    this._syncSliderSlots();

    this._attachNestedListeners();

    this._syncSlidersToCurrent();

    this._queueNestedDefinitionSync();
  }

  resolveUpdateMode(changedAttributes = []) {
    if (changedAttributes.length > 0 && changedAttributes.every(name => name === 'current' || name === 'open')) {
      return 'dom';
    }

    return 'lit';
  }

  updateDom(changedAttributes = []) {
    if (this.resolveUpdateMode(changedAttributes) !== 'dom') {
      return false;
    }

    const openChanged = changedAttributes.includes('open');
    const modalAction = this.openState ? 'open' : 'close';

    if (openChanged && typeof this._modal?.[modalAction] !== 'function') {
      return false;
    }

    if (changedAttributes.includes('current') && !this._syncingCurrent) {
      this._setCurrent(this.getProp('current'), 'api', {
        emit: false
      });
    } // Modal owns its transition. Re-rendering Gallery here would replace the
    // unchanged inline Slider during its pointer/keyboard event lifecycle.


    if (openChanged) {
      this._modal[modalAction]();
    }

    return true;
  }

  _bindNestedComponents() {
    this._inlineSlider = this.querySelector('[data-sf-gallery-slider="inline"]');
    this._modal = this.querySelector('[data-sf-gallery-modal]');
    this._lightboxSlider = this.querySelector('[data-sf-gallery-slider="lightbox"]') || this._modal?.modalRoot?.querySelector?.('[data-sf-gallery-slider="lightbox"]');
  }

  _attachNestedListeners() {
    this._modal?.addEventListener?.('sf-after-render', this._handleModalAfterRender);
    this._inlineSlider?.addEventListener?.('change', this._handleInlineSlideChange);
    this._lightboxSlider?.addEventListener?.('change', this._handleLightboxSlideChange);
    this._lightboxSlider?.addEventListener?.('pointerdown', this._handleLightboxBackgroundPointerDown, true);
    this._lightboxSlider?.addEventListener?.('pointerup', this._handleLightboxBackgroundPointerUp, true);
    this._lightboxSlider?.addEventListener?.('click', this._handleLightboxBackgroundClick, true);
    this._modal?.addEventListener?.('sf-modal-opened', this._handleModalAfterOpen);
    this._modal?.addEventListener?.('sf-modal-closed', this._handleModalAfterClose);
  }

  _detachNestedListeners() {
    this._modal?.removeEventListener?.('sf-after-render', this._handleModalAfterRender);
    this._inlineSlider?.removeEventListener?.('change', this._handleInlineSlideChange);
    this._lightboxSlider?.removeEventListener?.('change', this._handleLightboxSlideChange);
    this._lightboxSlider?.removeEventListener?.('pointerdown', this._handleLightboxBackgroundPointerDown, true);
    this._lightboxSlider?.removeEventListener?.('pointerup', this._handleLightboxBackgroundPointerUp, true);
    this._lightboxSlider?.removeEventListener?.('click', this._handleLightboxBackgroundClick, true);
    this._modal?.removeEventListener?.('sf-modal-opened', this._handleModalAfterOpen);
    this._modal?.removeEventListener?.('sf-modal-closed', this._handleModalAfterClose);
  }

  _syncSliderSlots() {
    this._syncSliderSlot(this._inlineSlider, 'inline');

    this._syncSliderSlot(this._lightboxSlider, 'lightbox');
  }

  _syncSliderSlot(sliderElement, mode) {
    if (!sliderElement?.setSlot) {
      return;
    }

    const slides = this._buildSliderSlideNodes(mode);

    if (!slides.length) {
      return;
    }

    this._rememberSliderIndex(sliderElement, this.current - 1);

    sliderElement.setSlot('slide', ...slides);
  }

  _queueNestedDefinitionSync() {
    if (this._nestedDefinitionSyncQueued) {
      return;
    }

    const needsSliderUpgrade = this._inlineSlider && !this._inlineSlider.setSlot || this._lightboxSlider && !this._lightboxSlider.setSlot;
    const needsLightboxRender = this.getProp('lightbox') && !this._lightboxSlider;
    const needsModalUpgrade = this._modal && !this._modal.open;

    if (!needsSliderUpgrade && !needsModalUpgrade && !needsLightboxRender) {
      return;
    }

    this._nestedDefinitionSyncQueued = true;
    const tags = [];
    if (needsSliderUpgrade) tags.push('sf-slider');
    if (needsModalUpgrade) tags.push('sf-modal'); // The slider and the window are asked for, not only waited for
    // (SF.Loader.ensure, core.runtime 1.19.0; duplication audit A-18): a
    // gallery drawn into a page after the Loader's scan no longer waits on a
    // definition nobody fetches. It waits as long as before (no timeout).

    const loader = globalThis.SF?.Loader;
    const wait = typeof loader?.ensure === 'function' ? loader.ensure(tags, {
      timeout: Infinity
    }) : Promise.allSettled(tags.map(tag => window.customElements?.whenDefined?.(tag)));
    Promise.resolve(wait).then(() => {
      requestAnimationFrame(() => {
        this._nestedDefinitionSyncQueued = false;

        if (!this.isConnected) {
          return;
        }

        this._detachNestedListeners();

        this._bindNestedComponents();

        this._syncSliderSlots();

        this._attachNestedListeners();

        this._syncSlidersToCurrent();

        if (this.openState) {
          this._modal?.open?.();
        }
      });
    });
  }

  _buildSliderSlideNodes(mode = 'inline') {
    const slides = normalizeSlotNodes(this.getSlotContent('slide'));
    return slides.map((slide, index) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'sf-gallery-slide flex content-main-center items-cross-center w-full min-w-0';
      wrapper.setAttribute('data-sf-gallery-index', String(index + 1));

      if (mode === 'inline' && this.getProp('lightbox')) {
        wrapper.setAttribute('data-sf-gallery-open', String(index + 1));
        wrapper.setAttribute('role', 'button');
        wrapper.setAttribute('tabindex', '0');
      }

      const content = slide.cloneNode(true);
      this.copyRuntimeData(slide, content);
      wrapper.append(content);
      return wrapper;
    });
  }

  _syncSlidersToCurrent() {
    const index = Math.max(this.current - 1, 0);

    this._syncSliderToIndex(this._inlineSlider, index);

    this._syncSliderToIndex(this._lightboxSlider, index);
  }

  _refreshLightboxSlider() {
    if (!this._lightboxSlider) {
      this._bindNestedComponents();
    }

    this._lightboxSlider?.refresh?.();
    const root = this._lightboxSlider?.querySelector?.('.sf-slider');

    if (root) {
      window.SF?.Slider?.refresh?.(root);
    }
  }

  _rememberSliderIndex(sliderElement, index) {
    if (!sliderElement?.setAttribute) {
      return;
    }

    const value = String(index);

    if (sliderElement.getAttribute('data-swiper-initial-slide') !== value) {
      sliderElement.setAttribute('data-swiper-initial-slide', value);
    }
  }

  _syncSliderToIndex(sliderElement, index) {
    this._rememberSliderIndex(sliderElement, index);

    const slider = sliderElement?._boundSlider || null;

    if (!slider || typeof index !== 'number' || index < 0) {
      return;
    }

    const currentIndex = typeof slider.realIndex === 'number' ? slider.realIndex : slider.activeIndex;

    if (currentIndex === index) {
      return;
    }

    if (slider.params?.loop && typeof slider.slideToLoop === 'function') {
      slider.slideToLoop(index, 0);
      return;
    }

    if (typeof slider.slideTo === 'function') {
      slider.slideTo(index, 0);
    }
  }

  _handleGalleryClick(event) {
    const trigger = event.target.closest?.('[data-sf-gallery-open]');

    if (!trigger || !this.getProp('lightbox')) {
      return;
    }

    const index = Number.parseInt(trigger.getAttribute('data-sf-gallery-open') || '1', 10);
    this.open(index);
  }

  _handleGalleryKeyDown(event) {
    const trigger = event.target.closest?.('[data-sf-gallery-open]');

    if (!trigger || !this.getProp('lightbox')) {
      return;
    }

    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    const index = Number.parseInt(trigger.getAttribute('data-sf-gallery-open') || '1', 10);
    this.open(index);
  } // A nested slider's change is the gallery's business: it becomes the
  // gallery's own change and stops here (§7.4: a part's events stop at the
  // component that holds it).


  _handleInlineSlideChange(event) {
    if (event.target !== this._inlineSlider) return;
    event.stopPropagation();

    this._syncCurrentFromEvent(event, false);
  }

  _handleLightboxSlideChange(event) {
    if (event.target !== this._lightboxSlider) return;
    event.stopPropagation();

    this._syncCurrentFromEvent(event, true);
  }

  _isLightboxBackgroundTarget(target) {
    if (!this.openState || !this.getProp('closeOnOverlay')) {
      return false;
    }

    if (!(target instanceof Element)) {
      return false;
    }

    if (target.closest(LIGHTBOX_BACKGROUND_CLOSE_IGNORE_SELECTOR)) {
      return false;
    }

    const activeSlide = target.closest('.swiper-slide-active');
    const gallerySlide = target.closest('.sf-gallery-slide');
    return Boolean(activeSlide || gallerySlide);
  }

  _stopLightboxBackgroundEvent(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  _requestLightboxBackgroundClose() {
    if (this._pendingLightboxBackgroundClose) {
      return;
    }

    this._pendingLightboxBackgroundClose = true;
    requestAnimationFrame(() => {
      this._pendingLightboxBackgroundClose = false;
      this._lightboxBackgroundPointerActive = false;

      if (!this.openState) {
        return;
      }

      this.close();
    });
  }

  _handleLightboxBackgroundPointerDown(event) {
    if (!this._isLightboxBackgroundTarget(event.target)) {
      this._lightboxBackgroundPointerActive = false;
      return;
    }

    this._lightboxBackgroundPointerActive = true;

    this._stopLightboxBackgroundEvent(event);
  }

  _handleLightboxBackgroundPointerUp(event) {
    if (!this._lightboxBackgroundPointerActive && !this._isLightboxBackgroundTarget(event.target)) {
      return;
    }

    this._stopLightboxBackgroundEvent(event);

    this._requestLightboxBackgroundClose();
  }

  _handleLightboxBackgroundClick(event) {
    if (!this._isLightboxBackgroundTarget(event.target)) {
      return;
    }

    this._stopLightboxBackgroundEvent(event);

    this._requestLightboxBackgroundClose();
  }

  _handleModalAfterRender(event) {
    if (event.target !== this._modal) {
      return;
    }

    const slider = this._modal?.modalRoot?.querySelector?.('[data-sf-gallery-slider="lightbox"]');

    if (!slider || slider === this._lightboxSlider) {
      return;
    }

    this._detachNestedListeners();

    this._lightboxSlider = slider;

    this._attachNestedListeners();

    this._syncSliderSlot(slider, 'lightbox');

    this._syncSliderToIndex(slider, Math.max(this.current - 1, 0));

    this._queueNestedDefinitionSync();
  }

  _handleModalAfterOpen(event) {
    // Modal events bubble; ignore those of a modal nested in the lightbox.
    if (event?.target && event.target !== this._modal) return;
    const targetIndex = Math.max(this.current - 1, 0);

    if (!this.hasAttribute('open')) {
      this.setAttribute('open', '');
    }

    this._refreshLightboxSlider();

    this._syncSliderToIndex(this._lightboxSlider, targetIndex);

    requestAnimationFrame(() => {
      if (!this.openState) {
        return;
      }

      this._refreshLightboxSlider();

      this._syncSliderToIndex(this._lightboxSlider, targetIndex);
    });
    this.sfEmit('opened', {
      current: this.current,
      total: this.slidesTotal
    });
  }

  _handleModalAfterClose(event) {
    if (event?.target && event.target !== this._modal) return;

    if (this.hasAttribute('open')) {
      this.removeAttribute('open');
    }

    this.sfEmit('closed', {
      current: this.current,
      total: this.slidesTotal
    });
  }

  _syncCurrentFromEvent(event, fromLightbox = false) {
    const next = Number(event.detail?.realIndex ?? event.detail?.activeIndex ?? 0) + 1;

    if (!Number.isFinite(next) || this._syncingCurrent) {
      return;
    }

    this._syncingCurrent = true;

    this._setCurrent(next, fromLightbox ? 'lightbox' : 'inline');

    this._syncingCurrent = false;
  } // §4.4: readers retire; kept until the date and noted on each call.


  getModal() {
    noteRetired('getModal');
    return this._modal || null;
  }

  getInlineSlider() {
    noteRetired('getInlineSlider');
    return this._inlineSlider || null;
  }

  getLightboxSlider() {
    noteRetired('getLightboxSlider');
    return this._lightboxSlider || null;
  } // The actions (§4.4) answer outcomes. `index` comes as a number or as
  // {index}, the manifest's parameter object.


  open(index = null) {
    const at = index && typeof index === 'object' ? index.index : index;
    if (!this.getProp('lightbox')) return {
      outcome: 'refused',
      reason: 'no-lightbox'
    };

    if (at !== null && typeof at !== 'undefined') {
      this.goTo(at);
    }

    this.setAttribute('open', '');
    this._modal?.open?.();
    return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.applied)();
  }

  close() {
    if (!this.openState) return {
      outcome: 'refused',
      reason: 'closed'
    };
    this.removeAttribute('open');
    this._modal?.close?.();
    return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.applied)();
  }

  toggle(index = null) {
    if (this.openState) {
      return this.close();
    }

    return this.open(index);
  }

  goTo(index) {
    const at = index && typeof index === 'object' ? index.index : index;
    if (!Number.isFinite(Number.parseInt(String(at), 10))) return {
      outcome: 'refused',
      reason: 'invalid'
    };

    this._setCurrent(at, 'api', {
      syncAttribute: true
    });

    return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.applied)();
  }

  next() {
    return this.goTo(this.current + 1);
  }

  prev() {
    return this.goTo(this.current - 1);
  }

}

SfGallery.define('sf-gallery');
SfGallery.bindGlobalDelegation();
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "56ae6cc9a5ec"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderGalleryTemplate: () => (/* binding */ renderGalleryTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var _default_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("a4ffdf799148");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);



function joinClasses(...tokens) {
  return tokens.flat().filter(Boolean).join(' ').trim();
}

function renderSliderNode(context, type = 'inline') {
  const isInline = type === 'inline';
  const sliderClass = isInline ? context.inlineClass : context.lightboxClass;
  const authoredSpaceBetween = context.component?.hasAttribute('space-between');
  const authoredSpeed = context.component?.hasAttribute('speed');
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <sf-slider
      data-sf-gallery-slider=${type}
      class=${sliderClass}
      button-type=${context.buttonType}
      button-size=${context.buttonSize}
      dots=${String(context.dots)}
      dots-type=${context.dotsType}
      dots-size=${context.dotsSize}
      thumbs=${String(context.thumbs)}
      thumbs-class=${context.thumbsClass}
      thumb-class=${context.thumbClass}
      arrows=${String(context.arrows)}
      loop=${String(context.loop)}
      space-between=${authoredSpaceBetween ? String(context.spaceBetween) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      speed=${authoredSpeed ? String(context.speed) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      slide-class=${context.slideClass}
    ></sf-slider>
  `;
}

function renderGalleryTemplate(context) {
  const showInline = context.inline || !context.lightbox;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div class=${joinClasses('sf-gallery flex flex-col gap-1', context.rootClass)}>
      ${showInline ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
            <div class="sf-gallery-inline" data-sf-gallery-inline>
              ${renderSliderNode(context, 'inline')}
            </div>
          ` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      ${context.lightbox ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
            <sf-modal
              data-sf-gallery-modal
              modal-id=${context.modalId}
              heading=${context.heading}
              text=${context.text}
              ?open=${context.open}
              overlay=${String(context.overlay)}
              show-header=${String(context.showHeader)}
              show-close=${String(context.showClose)}
              show-footer="false"
              close-on-esc=${String(context.closeOnEsc)}
              close-on-overlay=${String(context.closeOnOverlay)}
              preserve-scroll-gap=${String(context.preserveScrollGap)}
              position=${context.position}
              fullscreen=${String(context.fullscreen)}
              width=${context.width}
              height=${context.height}
              backdrop-blur=${String(context.backdropBlur)}
              blur-type=${context.blurType}
              overlay-class=${context.overlayClass}
              close-class=${context.closeClass}
              surface-class=${context.surfaceClass}
              surface-padding=${context.surfacePadding}
              panel-class=${joinClasses('sf-gallery-lightbox-panel min-w-0 max-w-full', context.panelClass)}
              header-class=${context.headerClass}
              body-class=${context.bodyClass}
              content-class=${context.contentClass}
              footer-class=${context.footerClass}
            >
              <div
                slot="content"
                class="sf-gallery-lightbox-content flex flex-col gap-1 h-full"
              >
                ${renderSliderNode(context, 'lightbox')}
              </div>
            </sf-modal>
          ` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    </div>
  `;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "a4ffdf799148"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "5dcef5de40cf"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("alias-table", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("alias-table", 1).then(resolve, reject), { once: true })));

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

/***/ "755770a8ce5c"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-gallery for the shim (core/js/aliases.js, standard §16 item 20). mode: same-detail (the shim sends the new and the old name), detail-adds (the new detail holds the old fields), attribute-and-property, host-attribute (no shim), manifest-only (the DOM name does not change), retired (no new name; kept and noted by the component until the date).","component":"sf-gallery","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"title","to":"heading","kind":"setting","component":"sf-gallery","since":"2026-10-27","remove_after":"2026-12-01","section":"§3.1, §16 item 26"},{"from":"blur","to":"backdrop-blur","kind":"setting","component":"sf-gallery","since":"2026-10-27","remove_after":"2026-12-01","section":"§3.1, §16 item 26: blur is the base action blur"},{"from":"sf-change","to":"change","kind":"event","component":"sf-gallery","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","section":"§8","note":"the detail is data only now: component, tagName and template leave it"},{"from":"sf-open","to":"sf-gallery-opened","kind":"event","component":"sf-gallery","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","section":"§8, vocabulary §4 (a fact)","note":"the detail is data only now"},{"from":"sf-close","to":"sf-gallery-closed","kind":"event","component":"sf-gallery","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","section":"§8, vocabulary §4 (a fact)","note":"the detail is data only now"},{"from":"getModal","to":null,"kind":"action","component":"sf-gallery","since":"2026-10-27","remove_after":"2026-12-01","mode":"retired","section":"§4.4","note":"a reader retires; the method stays until the date and notes each call"},{"from":"getInlineSlider","to":null,"kind":"action","component":"sf-gallery","since":"2026-10-27","remove_after":"2026-12-01","mode":"retired","section":"§4.4","note":"a reader retires; the method stays until the date and notes each call"},{"from":"getLightboxSlider","to":null,"kind":"action","component":"sf-gallery","since":"2026-10-27","remove_after":"2026-12-01","mode":"retired","section":"§4.4","note":"a reader retires; the method stays until the date and notes each call"}]}');

/***/ },

/***/ "a2bebed909d0"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.gallery","tag":"sf-gallery","version":"1.1.11","kind":"leaf","settings":{"modal-id":{"type":"id","default":""},"heading":{"type":"string","default-from":"runtime.heading"},"text":{"type":"string","default":""},"inline":{"type":"boolean","default":true},"lightbox":{"type":"boolean","default":true},"arrows":{"type":"boolean","default":true},"dots":{"type":"boolean","default":false},"thumbs":{"type":"boolean","default":true},"loop":{"type":"boolean","default":false},"space-between":{"type":"number","default":12},"speed":{"type":"number","default":450},"button-type":{"type":"string","default":"primary"},"button-size":{"type":"string","default":"1"},"dots-type":{"type":"string","default":"primary-dark"},"dots-size":{"type":"string","default":"2"},"thumbs-class":{"type":"string","default":""},"thumb-class":{"type":"string","default":""},"slide-class":{"type":"string","default":""},"inline-class":{"type":"string","default":""},"lightbox-class":{"type":"string","default":""},"overlay":{"type":"boolean","default":true},"show-header":{"type":"boolean","default":true},"show-close":{"type":"boolean","default":true},"close-on-esc":{"type":"boolean","default":true},"close-on-overlay":{"type":"boolean","default":true},"preserve-scroll-gap":{"type":"boolean","default":true},"position":{"type":"enum","values":["center","left","right","top","bottom"],"default":"center"},"fullscreen":{"type":"boolean","default":false},"width":{"type":"string","default":""},"height":{"type":"string","default":""},"backdrop-blur":{"type":"boolean","default":false},"blur-type":{"type":"enum","values":["none","small","medium","large"],"default":"medium"},"overlay-class":{"type":"string","default":""},"close-class":{"type":"string","default":""},"surface-class":{"type":"string","default":""},"surface-padding":{"type":"string","default":""},"panel-class":{"type":"string","default":""},"header-class":{"type":"string","default":""},"body-class":{"type":"string","default":""},"content-class":{"type":"string","default":""},"footer-class":{"type":"string","default":""}},"values":{"open":{"type":"boolean","default":false,"reflect":true},"current":{"type":"number","default":1,"integer":true,"min":1}},"events":{"change":{"carries":{"previous":"number","current":"number","total":"number","from":{"type":"enum","values":["api","inline","lightbox"]}}},"opened":{"carries":{"current":"number","total":"number"}},"closed":{"carries":{"current":"number","total":"number"}}},"actions":{"open":{"with":{"index":{"type":"number","optional":true}}},"close":{},"toggle":{"with":{"index":{"type":"number","optional":true}}},"go-to":{"with":{"index":"number"}},"next":{},"prev":{}},"css-variables":{"--sf-gallery-min-inline-size":{"type":"length","state":"default"},"--sf-gallery-media-max-height":{"type":"length","state":"default"},"--sf-gallery-object-fit":{"type":"keyword","state":"default"},"--sf-gallery-slide-min-height":{"type":"length","state":"default"},"--sf-gallery-caption-color":{"type":"color","state":"default"}}}');

/***/ },

/***/ "281c6761571f"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Gallery","runtime":{"heading":"Gallery"}}');

/***/ },

/***/ "74650ab742c0"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Галерея","runtime":{"heading":"Галерея"}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("d0c0e64421b6");
/******/
/******/ })()
;