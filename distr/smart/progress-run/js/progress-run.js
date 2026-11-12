/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "15b4e93ff6ed"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   formatLocale: () => (/* binding */ formatLocale),
/* harmony export */   intlFormatter: () => (/* binding */ intlFormatter),
/* harmony export */   toDate: () => (/* binding */ toDate)
/* harmony export */ });
/* harmony import */ var _page_language_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("43090d1c8307");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_page_language_js__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
_page_language_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var _page_language_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_page_language_js__WEBPACK_IMPORTED_MODULE_0__);
// The part every format module shares (core/js/format.js says what the
// helpers are): the locale a call formats in, a Date from what a host gives,
// and the Intl formatters, kept on a global every copy of these modules shares
// (bundles each carry their own module copy; page-language.js says why).
//
// No top-level side effects, here or in format-number.js, format-date.js,
// format-relative.js and format-file-size.js (ui-chart, 2026-11-05): a bundle
// that imports one function carries that function and what it calls, nothing
// else. The global is made on the first format, not on load, and SF.format is
// published by core's entry (index.js, publishFormat in format.js).

/** The locale a call formats in: the one it names, else its node's page language. */

function formatLocale({
  locale,
  node
} = {}) {
  return String(locale || '').trim() || (0,_page_language_js__WEBPACK_IMPORTED_MODULE_0__.pageLocale)(node);
}
/** A Date from a Date, a time in milliseconds or a date string; null when it is none. */

function toDate(value) {
  if (value === null || value === undefined || value === '') return null;
  const date = value instanceof Date ? new Date(value.getTime()) : new Date(typeof value === 'string' && /^\d+$/u.test(value) ? Number(value) : value);
  return Number.isNaN(date.getTime()) ? null : date;
} // The formatters every copy shares, made on the first call.

function formatterCache() {
  const root = typeof globalThis !== 'undefined' ? globalThis : {};
  if (!root.__sfFormat) root.__sfFormat = {
    formatters: new Map()
  };
  return root.__sfFormat.formatters;
} // One formatter per kind, locale and options. An unknown locale falls back to
// the browser's, and options the platform refuses (an unknown unit or
// currency) to a plain number, so a typo in a page never throws at a reader.


function intlFormatter(kind, locale, options) {
  const key = `${kind}|${locale}|${JSON.stringify(options)}`;
  const cache = formatterCache();
  if (cache.has(key)) return cache.get(key);
  const Make = Intl[kind];
  let made;

  try {
    made = new Make(locale || undefined, options);
  } catch {
    try {
      made = new Make(undefined, options);
    } catch {
      made = new Make(locale || undefined, kind === 'NumberFormat' ? {
        maximumFractionDigits: 2
      } : {});
    }
  } // A page that formats in many locales does not grow the cache for ever.


  if (cache.size >= 256) cache.delete(cache.keys().next().value);
  cache.set(key, made);
  return made;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "6978f1cc153b"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EDGE_MARGIN: () => (/* binding */ EDGE_MARGIN),
/* harmony export */   NEAR_END: () => (/* binding */ NEAR_END),
/* harmony export */   NEAR_START: () => (/* binding */ NEAR_START),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   readingPosition: () => (/* binding */ readingPosition),
/* harmony export */   scrollerOf: () => (/* binding */ scrollerOf),
/* harmony export */   watchEdge: () => (/* binding */ watchEdge)
/* harmony export */ });
// The reading position of a scrolling column (duplication audit 2026-11-03,
// A-6): what a feed, a log, a conversation or a long list does to keep a
// person's place while its content changes under them. It was written in
// ui-pro's sf-message-log (keep the place while history is added above,
// follow the end only when the reader is there, «to the latest», ask once
// when the top is reached), and the end-of-list loading again in
// sf-chat-threads and the ui-chat pilot. One rule now, for every column:
//
//   const position = readingPosition(scroller, {onStart: () => askEarlier()});
//   position.keep(() => column.prepend(fragment));  // the place does not move
//   const follow = position.atEnd();                  // before an append
//   column.append(node);
//   if (follow) position.toEnd();
//   scroller.addEventListener('scroll', () => position.check());
//
//   const stop = watchEdge(sentinel, () => askMore()); // the end came into reach
//
// It owns no content and fetches nothing: it measures one element and says
// when an edge is reached. The element is the scroller -- the box with
// overflow that a person scrolls.
//
// Nothing here keeps state at module scope: each column gets its own
// controller, so the copies of this module that every bundle carries cannot
// disagree (bundles each carry their own module copy).
// Within this distance of the end counts as being there. 96px is about two
// lines of text and an entry's action row: closer than that, a person reading
// the end of a column is reading the end.
const NEAR_END = 96; // The start is "reached" a little before it is reached, so an earlier page is
// usually there by the time the person scrolls into it.

const NEAR_START = 240; // The end of a list asks for its next page this far before it is in view.

const EDGE_MARGIN = '200px';

const reducedMotion = () => globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

const frame = callback => typeof globalThis.requestAnimationFrame === 'function' ? globalThis.requestAnimationFrame(callback) : setTimeout(callback, 16);
/**
 * A controller of one scroller's reading position.
 *
 * options:
 *   nearEnd    px from the end that count as being at it (NEAR_END);
 *   nearStart  px from the start that count as reaching it (NEAR_START);
 *   onStart    () => void, called from check() when the start is reached and
 *              the position is not settling (an earlier page is wanted).
 */


function readingPosition(scroller, {
  nearEnd = NEAR_END,
  nearStart = NEAR_START,
  onStart = null
} = {}) {
  let settling = false;
  let element = scroller ?? null;
  const controller = {
    /** The scroller this controller measures; set it again when the box is drawn anew. */
    get element() {
      return element;
    },

    set element(next) {
      element = next ?? null;
    },

    /** Is the end of the column in view (within nearEnd)? A column not drawn yet is at its end. */
    atEnd() {
      if (!element) return true;
      return element.scrollHeight - element.scrollTop - element.clientHeight < nearEnd;
    },

    /** Is the start within reach (within nearStart)? */
    atStart() {
      if (!element) return false;
      return element.scrollTop < nearStart;
    },

    /**
     * Change the content above what is read without moving it: the distance
     * from the end is measured before `mutate` and restored after. What was
     * under the reader's eyes is the same distance from the end before and
     * after the history above it grew.
     */
    keep(mutate) {
      if (!element) return mutate?.();
      const fromEnd = element.scrollHeight - element.scrollTop;
      const result = mutate?.();
      element.scrollTop = element.scrollHeight - fromEnd;
      return result;
    },

    /**
     * Go to the end in the next frame: smoothly, unless `instant` or the
     * reader asked for reduced motion. `then` runs after the jump. With
     * `settle`, reaching the start is not reported until the frame after:
     * a column that opens at its start for one frame does not ask for a page
     * nobody wanted.
     */
    toEnd({
      instant = false,
      settle = false,
      then = null
    } = {}) {
      if (settle) settling = true;
      frame(() => {
        if (element) element.scrollTo({
          top: element.scrollHeight,
          behavior: instant || reducedMotion() ? 'instant' : 'smooth'
        });
        then?.();
        if (settle) frame(() => {
          settling = false;
        });
      });
    },

    /** Hold reports of the start (while a column is replaced). */
    hold() {
      settling = true;
    },

    release() {
      settling = false;
    },

    get settling() {
      return settling;
    },

    /** Call on scroll: reports onStart once the start is in reach and the position is not settling. */
    check() {
      if (settling || !onStart || !controller.atStart()) return false;
      onStart();
      return true;
    }

  };
  return controller;
}
/**
 * Report when `sentinel` comes within `margin` of the scroller it sits in --
 * the end of a list in reach, the start of a feed. Never from a scroll handler
 * that fires sixty times a second. `root` is the scroller; null (the default)
 * is the viewport, which still sees the clipping of every scroller around the
 * sentinel. Answers the way to stop watching. A watch that starts on an edge
 * already in reach reports it at once.
 */

function watchEdge(sentinel, callback, {
  root = null,
  margin = EDGE_MARGIN
} = {}) {
  if (!sentinel || typeof callback !== 'function' || typeof globalThis.IntersectionObserver !== 'function') return () => {};
  const observer = new globalThis.IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) callback();
  }, {
    root,
    rootMargin: margin
  });
  observer.observe(sentinel);
  return () => observer.disconnect();
}
/**
 * The box that scrolls `node`: the nearest ancestor whose block overflow is
 * auto or scroll, or null for the page. watchEdge takes it as `root`, so its
 * margin reaches ahead inside that box; measured against the viewport, the
 * margin would stop at the box's clipped edge.
 */

function scrollerOf(node) {
  const view = node?.ownerDocument?.defaultView;

  for (let at = node?.parentElement; at && view; at = at.parentElement) {
    if (at === node.ownerDocument.documentElement || at === node.ownerDocument.body) return null;
    if (/^(auto|scroll|overlay)$/u.test(view.getComputedStyle(at).overflowY)) return at;
  }

  return null;
}
const ReadingPosition = Object.freeze({
  create: readingPosition,
  watchEdge,
  scrollerOf,
  NEAR_END,
  NEAR_START,
  EDGE_MARGIN
}); // Core publishes the helper; component bundles that carry their own copy reuse
// an already published one instead of replacing it.

if (typeof globalThis !== 'undefined') {
  globalThis.SF = globalThis.SF || {};
  if (!globalThis.SF.readingPosition) globalThis.SF.readingPosition = ReadingPosition;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ReadingPosition);

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

/***/ "d8d23d4adc43"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ENDED: () => (/* binding */ ENDED),
/* harmony export */   ERRORS_SHOWN: () => (/* binding */ ERRORS_SHOWN),
/* harmony export */   FOCUS_FALLBACK: () => (/* binding */ FOCUS_FALLBACK),
/* harmony export */   FOCUS_NEXT: () => (/* binding */ FOCUS_NEXT),
/* harmony export */   ICONS: () => (/* binding */ ICONS),
/* harmony export */   OUTPUT_LIMIT: () => (/* binding */ OUTPUT_LIMIT),
/* harmony export */   RATE_SETTLE_MS: () => (/* binding */ RATE_SETTLE_MS),
/* harmony export */   RATE_WINDOW_MS: () => (/* binding */ RATE_WINDOW_MS),
/* harmony export */   RUN_STATES: () => (/* binding */ RUN_STATES),
/* harmony export */   STATE_LOOK: () => (/* binding */ STATE_LOOK),
/* harmony export */   STEP_STATES: () => (/* binding */ STEP_STATES),
/* harmony export */   SfProgressRun: () => (/* binding */ SfProgressRun),
/* harmony export */   VIEWS: () => (/* binding */ VIEWS),
/* harmony export */   appendOutput: () => (/* binding */ appendOutput),
/* harmony export */   counterWords: () => (/* binding */ counterWords),
/* harmony export */   estimateRemaining: () => (/* binding */ estimateRemaining),
/* harmony export */   formatNumber: () => (/* binding */ formatNumber),
/* harmony export */   formatTime: () => (/* binding */ formatTime),
/* harmony export */   normalizeErrors: () => (/* binding */ normalizeErrors),
/* harmony export */   normalizeSteps: () => (/* binding */ normalizeSteps),
/* harmony export */   percentOf: () => (/* binding */ percentOf),
/* harmony export */   pluralForm: () => (/* binding */ pluralForm),
/* harmony export */   remainingWords: () => (/* binding */ remainingWords),
/* harmony export */   runState: () => (/* binding */ runState),
/* harmony export */   shownCounters: () => (/* binding */ shownCounters),
/* harmony export */   stepState: () => (/* binding */ stepState),
/* harmony export */   stepTime: () => (/* binding */ stepTime)
/* harmony export */ });
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _core_js_format_intl_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("15b4e93ff6ed");
/* harmony import */ var _core_js_page_language_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("43090d1c8307");
/* harmony import */ var _core_js_reading_position__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("6978f1cc153b");
/* harmony import */ var _core_js_tag_aliases_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("4a85acfb05c1");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("3bb2b1c9d41d");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("d092c5059e25");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("bb540c15b990");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("7e1b23a85a40");
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("533b90592c77");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_format_intl_js__WEBPACK_IMPORTED_MODULE_2__, _core_js_page_language_js__WEBPACK_IMPORTED_MODULE_3__, _core_js_tag_aliases_js__WEBPACK_IMPORTED_MODULE_5__, _js_templates_default__WEBPACK_IMPORTED_MODULE_6__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_format_intl_js__WEBPACK_IMPORTED_MODULE_2__, _core_js_page_language_js__WEBPACK_IMPORTED_MODULE_3__, _core_js_tag_aliases_js__WEBPACK_IMPORTED_MODULE_5__, _js_templates_default__WEBPACK_IMPORTED_MODULE_6__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_page_language_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_core_js_page_language_js__WEBPACK_IMPORTED_MODULE_3__);
// sf-progress-run: a long job as a person sees it -- creating a site, an
// update, a backup or a restore, an import, a package install:
//
//   <sf-progress-run label="Импорт товаров" total="12000" value="4812"
//       unit="товар|товара|товаров" pausable cancelable minimizable>
//     <script type="application/json" data-sf-settings>
//       {"steps": [{"id": "read", "title": "Чтение файла", "state": "done", "duration": 4000},
//                  {"id": "rows", "title": "Товары", "state": "running", "value": 4812, "total": 12000}],
//        "counters": [{"id": "added", "label": "Добавлено", "value": 3700},
//                     {"id": "errors", "label": "{n} ошибка|{n} ошибки|{n} ошибок", "value": 0, "status": "error"}]}
//     </script>
//   </sf-progress-run>
//
//   run.value = 5120;                                  // the bar, the figures, the time left
//   run.step({id: 'rows', value: 5120});
//   run.chunk({text: 'Row 218: price is not a number\n', step: 'rows'});
//
// One element, three looks (owner decision C34): look full (the card, and
// once ended its summary), compact (a table row) and notice (a corner
// panel's row). The steps with their states and times, a log per step and a
// collapsible output pane that follows the newest line only while the reader
// is at its end (core's reading position), copy and download, the overall
// bar with «N из M · %» and the time left, the counts as one line, the first
// errors, and Pause/Continue, Cancel, Minimize, Retry and Hide as requests to
// the host. The host drives it: it sets the numbers and the steps (or changes
// one with step) and appends the output (chunk); the component polls nothing
// and does none of the actions itself.
//
// From its component.json (standard simai.smart-component 1.3.14 §3, §4,
// §8): the settings, values and actions are made by
// core/js/element-manifest.js, the words are the language files'.










 // The ids of a run's parts, one set per run on the page (the same on every
// render, so a first-paint snapshot is stable).

let sequence = 0;
const STEP_STATES = ['waiting', 'running', 'done', 'failed', 'skipped'];
const RUN_STATES = ['waiting', 'running', 'paused', 'done', 'partial', 'failed', 'cancelled'];
const ENDED = ['done', 'partial', 'failed', 'cancelled'];
const VIEWS = ['full', 'compact', 'notice']; // sf-steps' state glyphs (sf-steps 1.2.0, sf-wizard); waiting is an empty ring.

const ICONS = {
  waiting: 'radio_button_unchecked',
  running: 'progress_activity',
  done: 'check_circle',
  failed: 'error',
  skipped: 'do_not_disturb_on',
  cancelled: 'cancel',
  partial: 'warning',
  paused: 'pause_circle'
}; // The output a run keeps: the oldest lines leave past this many characters.

const OUTPUT_LIMIT = 500000; // The errors the summary shows in the card (C34: the first five, then a report).

const ERRORS_SHOWN = 5; // The time left is shown once the rate has been seen this long, from a window
// of this length (NN/g, Apple HIG: no estimate before it means something).

const RATE_SETTLE_MS = 5000;
const RATE_WINDOW_MS = 30000; // One state, one look in every look (C34, R073): the badge of sf-badge 1.4.0
// and the status of the overall bar (sf-progress-bar 1.3.0).

const STATE_LOOK = {
  waiting: {
    activity: 'queued',
    bar: 'neutral'
  },
  running: {
    activity: 'running',
    bar: 'neutral'
  },
  paused: {
    activity: 'paused',
    bar: 'warning'
  },
  done: {
    activity: 'done',
    bar: 'success'
  },
  partial: {
    status: 'warning',
    icon: 'warning',
    bar: 'warning'
  },
  failed: {
    activity: 'failed',
    bar: 'error'
  },
  cancelled: {
    activity: 'stopped',
    bar: 'neutral'
  }
}; // Where focus goes when the run's own button that had it is replaced: its
// counterpart first, then the buttons a run in the new state shows.

const FOCUS_NEXT = {
  pause: ['resume'],
  resume: ['pause'],
  minimize: ['expand'],
  expand: ['minimize'],
  cancel: ['retry', 'hide'],
  retry: ['pause', 'cancel'],
  hide: ['retry'],
  more: ['retry', 'hide']
}; // The run's button hosts, under their names and the names they replaced
// (asked when needed: the alias table is filled as the bundles load).

const buttonHosts = () => ['sf-button', 'sf-button-icon', 'sf-button-copy'].map(tag => (0,_core_js_tag_aliases_js__WEBPACK_IMPORTED_MODULE_5__.tagSelector)(tag)).join(', ');

const FOCUS_FALLBACK = ['pause', 'resume', 'cancel', 'retry', 'expand', 'minimize', 'hide'];

const text = value => value === undefined || value === null ? '' : String(value).trim();

const number = value => {
  if (value === undefined || value === null || value === '') return null;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : null;
};
/** A step's state: the five words; anything else is waiting. */


function stepState(value) {
  const word = text(value).toLowerCase();
  return STEP_STATES.includes(word) ? word : 'waiting';
}
/** The steps as given, made safe: an id and a title each, an id once. */

function normalizeSteps(value) {
  const list = Array.isArray(value) ? value : [];
  const seen = new Set();
  const steps = [];

  for (const step of list) {
    if (!step || typeof step !== 'object') continue;
    const id = text(step.id);
    const title = text(step.title);
    if (!id || !title || seen.has(id)) continue;
    seen.add(id);
    const duration = Number(step.duration);
    steps.push({
      id,
      title,
      state: stepState(step.state),
      text: text(step.text),
      value: number(step.value),
      total: number(step.total),
      unit: text(step.unit),
      log: typeof step.log === 'string' ? step.log : '',
      started: text(step.started),
      finished: text(step.finished),
      duration: step.duration !== undefined && step.duration !== null && step.duration !== '' && Number.isFinite(duration) && duration >= 0 ? duration : null
    });
  }

  return steps;
}
/** The job's state from its steps: failed, running, done, else waiting. */

function runState(steps) {
  if (steps.some(step => step.state === 'failed')) return 'failed';
  if (steps.some(step => step.state === 'running')) return 'running';
  if (steps.length && steps.every(step => step.state === 'done' || step.state === 'skipped')) return 'done';
  return 'waiting';
}
/** A step's time in milliseconds: its duration, else finished − started; a running step counts to `now`. */

function stepTime(step, now = Date.now()) {
  if (step.duration !== null && step.duration !== undefined) return step.duration;
  const start = (0,_core_js_format_intl_js__WEBPACK_IMPORTED_MODULE_2__.toDate)(step.started);
  if (!start) return null;
  const end = (0,_core_js_format_intl_js__WEBPACK_IMPORTED_MODULE_2__.toDate)(step.finished);
  if (end) return Math.max(0, end.getTime() - start.getTime());
  return step.state === 'running' ? Math.max(0, now - start.getTime()) : null;
}
/** Milliseconds as m:ss, or h:mm:ss over an hour. */

function formatTime(ms) {
  if (ms === null || ms === undefined || !Number.isFinite(ms)) return '';
  const total = Math.floor(ms / 1000);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor(total % 3600 / 60);
  const seconds = String(total % 60).padStart(2, '0');
  return hours ? `${hours}:${String(minutes).padStart(2, '0')}:${seconds}` : `${minutes}:${seconds}`;
}
/** The output with `more` appended, the oldest whole lines dropped past `limit`. */

function appendOutput(output, more, limit = OUTPUT_LIMIT) {
  let next = `${output}${more}`;
  if (next.length <= limit) return next;
  next = next.slice(next.length - limit);
  const line = next.indexOf('\n');
  return line >= 0 && line < next.length - 1 ? next.slice(line + 1) : next;
} // The plural categories in their canonical order (CLDR).

const CATEGORIES = ['zero', 'one', 'two', 'few', 'many', 'other'];
/**
 * A word of the host's in its plural form for `count`: the forms separated by
 * | in the order of the locale's plural categories (ru one|few|many|other, en
 * one|other); a category past the forms given takes the last one.
 */

function pluralForm(forms, count, locale = 'en') {
  const list = String(forms ?? '').split('|').map(one => one.trim());
  if (list.length <= 1) return list[0] ?? '';
  let rules;

  try {
    rules = new Intl.PluralRules(locale);
  } catch {
    rules = new Intl.PluralRules('en');
  }

  const order = CATEGORIES.filter(one => rules.resolvedOptions().pluralCategories.includes(one));
  const index = order.indexOf(rules.select(Number(count) || 0));
  return list[Math.min(index < 0 ? list.length - 1 : index, list.length - 1)];
}
/** A number in the page's figures (9 227 in Russian, 9,227 in English). */

function formatNumber(value, locale = 'en') {
  try {
    return new Intl.NumberFormat(locale, {
      maximumFractionDigits: 0
    }).format(value);
  } catch {
    return String(Math.round(value));
  }
}
/** The percentage of done: floored, so it says 100 only when everything is done. */

function percentOf(value, total) {
  if (!(total > 0) || value === null) return null;
  return Math.max(0, Math.min(100, Math.floor(value / total * 100)));
}
/**
 * The time left from the samples seen, in ms, or null while the rate has not
 * settled: (total − value) / rate over the window, once the samples span
 * RATE_SETTLE_MS and the value moved.
 */

function estimateRemaining(samples, total, now = Date.now()) {
  if (!(total > 0) || !Array.isArray(samples) || samples.length < 2) return null;
  const recent = samples.filter(one => now - one.t <= RATE_WINDOW_MS);
  const window = recent.length >= 2 ? recent : samples.slice(-2);
  const first = window[0];
  const last = window[window.length - 1];
  const span = last.t - first.t;
  const done = last.v - first.v;
  if (span < RATE_SETTLE_MS || done <= 0) return null;
  const rate = done / span;
  return Math.max(0, (total - last.v) / rate);
}
/** Time left in words, always rounded up: «меньше минуты», «≈ 6 мин», «≈ 1 ч 5 мин». */

function remainingWords(ms, word, {
  short = false
} = {}) {
  if (ms === null || ms === undefined || !Number.isFinite(ms)) return '';
  if (ms < 60000) return word(short ? 'remaining-less-short' : 'remaining-less');
  const minutes = Math.ceil(ms / 60000);
  const time = minutes < 60 ? word('minutes', {
    count: minutes
  }) : word('hours', {
    vars: {
      h: Math.floor(minutes / 60),
      m: minutes % 60
    }
  });
  return word(short ? 'remaining-short' : 'remaining', {
    vars: {
      time
    }
  });
}
/** The counters as the line draws them: zero ones left out, an error one at zero only once ended (its zero words). */

function shownCounters(counters, {
  ended = false
} = {}) {
  const list = Array.isArray(counters) ? counters : [];
  const shown = [];

  for (const counter of list) {
    if (!counter || typeof counter !== 'object') continue;
    const label = text(counter.label);
    if (!label) continue;
    const value = number(counter.value) ?? 0;
    const error = text(counter.status) === 'error';
    if (value === 0 && !(error && ended)) continue;
    shown.push({
      id: text(counter.id),
      label,
      value,
      error,
      zero: value === 0,
      zeroText: text(counter.zero)
    });
  }

  return shown;
}
/** A counter in words: «Добавлено 9 227», «18 ошибок» (the label's {n}), the zero words for a zero error counter. */

function counterWords(counter, locale, word) {
  if (counter.zero) return counter.zeroText || word('no-errors');
  const label = pluralForm(counter.label, counter.value, locale);
  const figure = formatNumber(counter.value, locale);
  return label.includes('{n}') ? label.replaceAll('{n}', figure) : `${label} ${figure}`;
}
/** The errors made safe, at most `limit` of them. */

function normalizeErrors(value, limit = ERRORS_SHOWN) {
  const list = Array.isArray(value) ? value : [];
  return list.filter(one => one && typeof one === 'object' && text(one.text)).slice(0, limit).map(one => ({
    where: text(one.where),
    key: text(one.key),
    text: text(one.text)
  }));
}
const ProgressRunElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_7__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_8__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_9__
  },
  source: 'ru',
  actions: {
    chunk(args = {}) {
      const more = typeof args === 'string' ? args : args?.text;
      if (more === undefined || more === null || String(more) === '') return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.refused)('invalid');
      const step = typeof args === 'string' ? '' : text(args?.step);

      if (step) {
        if (!this.list.some(one => one.id === step)) return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.refused)('missing');
        this.appendStepText(step, String(more));
        return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.applied)();
      }

      this.appendText(String(more));
      return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.applied)();
    },

    clear() {
      this._output = '';

      this._logs.clear();

      this.requestComponentUpdate('output');
      return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.applied)();
    },

    step(args = {}) {
      const id = text(args?.id);
      if (!this.steps.some(step => text(step?.id) === id)) return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.refused)('missing'); // The changes belong to the host's current list: one the run has not
      // read yet starts them afresh now, not at the next read (which dropped a
      // change made before the first render).

      this.syncStepsSource();
      const change = {};

      for (const key of ['state', 'text', 'value', 'total', 'started', 'finished', 'duration']) {
        if (Object.prototype.hasOwnProperty.call(args, key)) change[key] = args[key];
      }

      this._changes.set(id, { ...(this._changes.get(id) ?? {}),
        ...change
      });

      this.requestComponentUpdate('step');
      return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.applied)();
    }

  }
});

class SfProgressRun extends ProgressRunElement {
  constructor() {
    super();
    const n = ++sequence;
    this._ids = {
      heading: `sf-progress-run-heading-${n}`,
      output: `sf-progress-run-output-${n}`,
      errors: `sf-progress-run-errors-${n}`,
      log: `sf-progress-run-log-${n}`
    }; // Changes made with the action step, over the host's list until it sets
    // a new one.

    this._changes = new Map();
    this._stepsSource = undefined;
    this._output = '';
    this._outputSource = undefined;
    this._follow = true;
    this._reading = (0,_core_js_reading_position__WEBPACK_IMPORTED_MODULE_4__.readingPosition)(null);
    this._timer = 0; // A log per step (chunk {step}) and which step logs a person opened.

    this._logs = new Map();
    this._logOpen = new Map(); // The rate of value while it runs, and the moments the run saw.

    this._samples = [];
    this._seenStart = 0;
    this._seenEnd = 0;
    this._lastState = '';
    this._resumed = false;
  }

  onConnected() {
    super.onConnected?.();
    this.syncTimer();
  }

  onDisconnected() {
    super.onDisconnected?.();
    this.stopTimer();
  } // A new list from the host clears the changes made over the old one.


  syncStepsSource() {
    if (this.steps === this._stepsSource) return;
    this._stepsSource = this.steps;

    this._changes.clear();
  } // The steps the run shows: the host's list with the step changes on it.


  get list() {
    this.syncStepsSource();
    const changed = (Array.isArray(this.steps) ? this.steps : []).map(step => {
      const change = step && typeof step === 'object' ? this._changes.get(text(step.id)) : null;
      return change ? { ...step,
        ...change
      } : step;
    });
    return normalizeSteps(changed);
  }

  get locale() {
    return (0,_core_js_page_language_js__WEBPACK_IMPORTED_MODULE_3__.pageLocale)(this);
  } // The numbers of the run, null when not given.


  get done() {
    return number(this.value);
  }

  get whole() {
    const total = number(this.total);
    return total && total > 0 ? total : null;
  }

  get errorsCount() {
    // A number setting reads 0 when absent, so 0 means «not said»: the error counter speaks.
    const total = number(this.errorsTotal);
    if (total) return total;
    const counter = (Array.isArray(this.counters) ? this.counters : []).find(one => one && text(one.status) === 'error');
    return counter ? number(counter.value) ?? 0 : 0;
  } // The job's state: the host's run-state, else worked out from the steps
  // (finished with errors is partial).


  get drawnState() {
    const given = this.runState;
    if (given && given !== 'auto' && RUN_STATES.includes(given)) return given;
    const worked = runState(this.list);
    if (worked === 'done' && this.errorsCount > 0) return 'partial';
    if (worked === 'waiting' && !this.list.length && this.whole !== null) return 'running';
    return worked;
  }

  get drawnView() {
    return VIEWS.includes(this.look) ? this.look : 'full';
  } // The output: the host's setting, then what chunk appended. A new setting
  // starts it afresh.


  get outputText() {
    const source = this.output ?? '';

    if (source !== this._outputSource) {
      this._outputSource = source;
      this._output = String(source);
    }

    return this._output;
  }

  appendText(more) {
    // Follow the newest line only while the reader is at the end.
    this._follow = !this.outputOpen || this._reading.atEnd();
    this._output = appendOutput(this.outputText, more);
    this.requestComponentUpdate('output');
  }

  appendStepText(step, more) {
    this._logs.set(step, appendOutput(this._logs.get(step) ?? '', more));

    this.requestComponentUpdate('output');
  }

  toggleOutput(force) {
    const open = force === undefined ? !this.outputOpen : Boolean(force);
    if (open === Boolean(this.outputOpen)) return;
    this._follow = true;
    this.outputOpen = open;
    this.sfEmit('toggle', {
      open
    });
  } // A step's log is open when a person opened it, else when the step failed.


  stepLogOpen(step) {
    return this._logOpen.has(step.id) ? this._logOpen.get(step.id) : step.state === 'failed';
  }

  toggleStepLog(id) {
    const step = this.list.find(one => one.id === id);
    if (!step) return;

    this._logOpen.set(id, !this.stepLogOpen(step));

    this.requestComponentUpdate('log');
  } // ---------------------------------------------------------------- presses


  onCancel() {
    this.sfEmit('cancel', {}, {
      cancelable: true
    });
  }

  onRetry() {
    const state = this.drawnState;

    if (state === 'partial') {
      this.sfEmit('retry', {
        scope: 'failed'
      });
      return;
    }

    const failed = this.list.find(step => step.state === 'failed');
    this.sfEmit('retry', failed ? {
      scope: 'all',
      from: failed.id
    } : {
      scope: 'all'
    });
  }

  onPause() {
    this.sfEmit('pause', {});
  }

  onResume() {
    this.sfEmit('resume', {});
  }

  onMinimize() {
    this.sfEmit('minimize', {});
  }

  onExpand() {
    this.sfEmit('expand', {});
  } // The error count link and «Ещё N ошибок»: a request for the report. Not
  // cancelled, the link moves to the error list the summary shows.


  onReport(event) {
    const asked = this.sfEmit('report', {}, {
      cancelable: true
    });
    if (!event) return;
    const list = this.querySelector(`#${this._ids.errors}`);

    if (event.currentTarget?.localName === 'a') {
      event.preventDefault();
      if (asked && list) list.focus({
        preventScroll: false
      });
    }
  }

  onHide() {
    this.sfEmit('close', {
      reason: 'close'
    }, {
      cancelable: true
    });
  }

  onDownload() {
    const name = text(this.fileName) || 'output.txt';
    if (!this.sfEmit('download', {
      'file-name': name
    }, {
      cancelable: true
    })) return;
    const doc = this.ownerDocument;
    const url = URL.createObjectURL(new Blob([this.outputText], {
      type: 'text/plain;charset=utf-8'
    }));
    const link = doc.createElement('a');
    link.href = url;
    link.download = name;
    link.hidden = true;
    doc.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  } // ---------------------------------------------------------------- time
  // The moments the run saw and the samples of the rate, kept as it draws.


  observe(state, now) {
    const previous = this._lastState;

    if (state !== previous) {
      // Going on after a pause: the rate is measured afresh (the pause is not work).
      this._resumed = previous === 'paused' && state === 'running';
      if (state === 'paused' || previous === 'paused') this._samples = [];
      if (state === 'running' && !this._seenStart) this._seenStart = now;
      if (ENDED.includes(state) && !this._seenEnd) this._seenEnd = now;
      if (!ENDED.includes(state)) this._seenEnd = 0;
      this._lastState = state;
    }

    const value = this.done;

    if (state === 'running' && value !== null) {
      const last = this._samples[this._samples.length - 1];
      if (!last || last.v !== value) this._samples.push({
        t: now,
        v: value
      });

      while (this._samples.length > 2 && now - this._samples[1].t > RATE_WINDOW_MS) this._samples.shift();
    }
  } // The job's elapsed time: the host's started, else the moment the run saw
  // it run; to finished, the moment it ended, or now.


  elapsed(state, now) {
    const start = (0,_core_js_format_intl_js__WEBPACK_IMPORTED_MODULE_2__.toDate)(this.startedAt)?.getTime() ?? (this._seenStart || null);
    if (!start) return null;
    const end = (0,_core_js_format_intl_js__WEBPACK_IMPORTED_MODULE_2__.toDate)(this.finishedAt)?.getTime() ?? (ENDED.includes(state) ? this._seenEnd || null : null);
    if (ENDED.includes(state) && !end) return null;
    return Math.max(0, (end ?? now) - start);
  } // One timer per run, only while a time counts up: a running step with a
  // start, the elapsed time of an unknown size, or the time left.


  syncTimer() {
    const state = this.drawnState;
    const counting = this.isConnected && (this.list.some(step => step.state === 'running' && step.started && step.duration === null && !step.finished) || state === 'running');
    if (counting && !this._timer) this._timer = setInterval(() => this.requestComponentUpdate('time'), 1000);else if (!counting) this.stopTimer();
  }

  stopTimer() {
    if (this._timer) clearInterval(this._timer);
    this._timer = 0;
  } // ---------------------------------------------------------------- drawing
  // «4 812 из 12 000 товаров · 40 %», the count so far, or nothing.


  figures(value, total, unit, {
    short = false
  } = {}) {
    const locale = this.locale;

    const word = (key, options) => this.sfWord(key, options);

    if (value === null && total === null) return '';

    if (total === null) {
      // An absent number setting reads 0: with no size, a count of 0 says
      // nothing, so the line shows nothing (not a bare «0»).
      if (!value) return '';
      const forms = text(unit);
      return word('figures-count', {
        vars: {
          value: formatNumber(value ?? 0, locale),
          unit: forms ? ` ${pluralForm(forms, value ?? 0, locale)}` : ''
        }
      });
    }

    const percent = percentOf(value ?? 0, total);
    if (short === 'plain') return word('figures-plain', {
      vars: {
        value: formatNumber(value ?? 0, locale),
        total: formatNumber(total, locale)
      }
    });
    if (short) return word('percent', {
      vars: {
        percent
      }
    });
    const forms = text(unit);
    return word('figures', {
      vars: {
        value: formatNumber(value ?? 0, locale),
        total: formatNumber(total, locale),
        unit: forms ? ` ${pluralForm(forms, total, locale)}` : '',
        percent
      }
    });
  }

  templateContext() {
    const now = Date.now();
    const list = this.list;
    const state = this.drawnState;
    const view = this.drawnView;
    const ended = ENDED.includes(state);
    const locale = this.locale;

    const word = (key, options) => this.sfWord(key, options);

    this.observe(state, now);
    this.sfHostState('data-state', state);
    const value = this.done;
    const total = this.whole;
    const indeterminate = total === null && (state === 'running' || state === 'paused');
    const showBar = total !== null || !list.length;
    const percent = percentOf(value ?? 0, total);
    const barValue = total !== null ? state === 'done' ? 100 : percentOf(value ?? 0, total) : ended ? 100 : 0; // The time on the figures line: the time left while it runs, the time it
    // took once ended, the elapsed time while the size is unknown.

    const elapsed = this.elapsed(state, now); // An absent number setting reads 0; no running job has 0 left, so 0 means «not given».

    const given = number(this.remaining);
    const remainingMs = given ? given : estimateRemaining(this._samples, total, now);
    let time = '';
    let timeShort = '';

    if (ended) {
      time = elapsed !== null ? word('took', {
        vars: {
          time: formatTime(elapsed)
        }
      }) : '';
    } else if (state === 'running' && total !== null) {
      time = remainingMs !== null ? remainingWords(remainingMs, word) : word('estimating');
      timeShort = remainingMs !== null ? remainingWords(remainingMs, word, {
        short: true
      }) : '';
    } else if ((state === 'running' || state === 'paused') && elapsed !== null) {
      time = formatTime(elapsed);
      timeShort = time;
    }

    const counters = shownCounters(this.counters, {
      ended
    }).map(counter => ({ ...counter,
      words: counterWords(counter, locale, word)
    }));
    const errors = ended ? normalizeErrors(this.errors) : [];
    const errorsTotal = Math.max(this.errorsCount, errors.length);
    const resultShown = ended ? this.resultText || word(`result-${state}`) : ''; // What a screen reader hears: the result and the state changes only.

    let announcement = '';
    if (ended) announcement = resultShown;else if (state === 'paused') announcement = word('announce-paused');else if (state === 'running' && this._resumed) announcement = word('announce-resumed'); // The badge and bar of the state (not the look setting, which is view).

    const stateLook = STATE_LOOK[state] ?? STATE_LOOK.waiting;
    const badgeText = {
      running: 'state-word-running',
      paused: 'state-word-paused',
      partial: 'state-word-partial',
      cancelled: 'state-word-cancelled',
      waiting: 'state-word-waiting'
    }[state];
    const failed = list.find(step => step.state === 'failed');
    return this.createTemplateContext({ ...this.getPropsContext(),
      component: this,
      ids: this._ids,
      view,
      size: this.size === '1/2' ? '1/2' : '1',
      label: this.label,
      caption: text(this.caption),
      headingLevel: ['1', '2', '3', '4', '5', '6'].includes(String(this.headingLevel)) ? String(this.headingLevel) : '3',
      regionLabel: this.label || word('label'),
      steps: list.map(step => {
        const log = `${step.log}${this._logs.get(step.id) ?? ''}`;
        return { ...step,
          time: formatTime(stepTime(step, now)),
          stateWord: word(`state-${step.state}`),
          figures: step.value !== null || step.total !== null ? this.figures(step.value, step.total && step.total > 0 ? step.total : null, step.unit) : '',
          log,
          logOpen: Boolean(log) && this.stepLogOpen(step)
        };
      }),
      state,
      ended,
      stateLook,
      badgeText: badgeText ? word(badgeText) : '',
      showBar,
      indeterminate,
      barValue,
      barStatus: stateLook.bar,
      percent,
      figures: this.figures(value, total, this.unit),
      figuresShort: total !== null ? this.figures(value, total, this.unit, {
        short: true
      }) : '',
      figuresPlain: total !== null ? this.figures(value, total, this.unit, {
        short: 'plain'
      }) : '',
      time,
      timeShort,
      counters,
      errors,
      errorsTotal,
      moreErrors: errorsTotal > errors.length && ended ? errorsTotal - errors.length : 0,
      resultShown,
      announcement,
      outputShown: this.outputText,
      outputOpen: Boolean(this.outputOpen),
      outputLabel: this.outputLabel,
      showCancel: Boolean(this.cancelable) && (state === 'running' || state === 'paused'),
      showPause: Boolean(this.pausable) && state === 'running',
      showResume: Boolean(this.pausable) && state === 'paused',
      showMinimize: Boolean(this.minimizable) && view === 'full',
      showRetry: Boolean(this.retryable) && (state === 'failed' || state === 'cancelled' || state === 'partial'),
      retryWord: state === 'partial' ? word('retry-failed') : word('retry'),
      retryFrom: state === 'failed' && failed ? failed.id : '',
      showHide: Boolean(this.hideable) && ended,
      icons: ICONS,
      words: {
        steps: word('steps'),
        cancel: word('cancel'),
        retry: word('retry'),
        hide: word('hide'),
        copy: word('copy'),
        download: word('download'),
        emptyOutput: word('empty-output'),
        pause: word('pause'),
        resume: word('resume'),
        minimize: word('minimize'),
        expand: word('expand'),
        stepLog: word('step-log'),
        counts: word('counts'),
        errorsList: errors.length ? word('errors-shown', {
          count: errors.length,
          vars: {
            total: formatNumber(errorsTotal, locale)
          }
        }) : '',
        moreErrors: errorsTotal > errors.length ? word('more-errors', {
          count: errorsTotal - errors.length
        }) : '',
        errorsCount: word('errors-count', {
          count: errorsTotal
        })
      },
      rootClass: this.getRootClass()
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_6__.renderProgressRunTemplate)(this.templateContext());
  } // ---------------------------------------------------------------- focus
  // The run's own button that holds focus, by its part name (pause, resume,
  // minimize, expand, cancel, retry, hide...), or ''.


  focusedAction() {
    const active = this.ownerDocument?.activeElement;
    if (!active || !this.contains(active)) return '';
    const host = active.closest(buttonHosts());
    if (!host || !this.contains(host)) return '';
    const part = [...host.classList].map(name => /^sf-progress-run-([a-z]+)$/u.exec(name)?.[1]).find(Boolean);
    return part || '';
  }

  beforeRender(changedAttributes) {
    super.beforeRender?.(changedAttributes); // A render overtaken by the next one never reaches afterRender: the
    // button it removed stays noted until a render that did lands.

    const focused = this.focusedAction();
    if (focused) this._focusAction = focused;
  } // A press the host answers swaps the run's own button: Pause becomes
  // Continue, Minimize turns the card into the notice with its Expand. The
  // button that had focus is gone, and focus fell to the page (WCAG 2.4.3):
  // a second Space did nothing. Focus moves to the button that took its
  // place, else to the next one the run still shows. Only a focus the run
  // lost itself is moved; it never takes focus from elsewhere.


  restoreFocus() {
    const lost = this._focusAction;
    this._focusAction = '';
    if (!lost) return;
    const active = this.ownerDocument?.activeElement;
    if (active && active !== this.ownerDocument.body && active.isConnected) return;

    for (const part of [...(FOCUS_NEXT[lost] ?? []), lost, ...FOCUS_FALLBACK]) {
      const target = this.querySelector(`.sf-progress-run-${part}`);

      if (target && typeof target.focus === 'function') {
        target.focus({
          preventScroll: true
        });
        return;
      }
    }
  }

  afterRender() {
    super.afterRender?.();
    this.restoreFocus();
    this.syncTimer();
    const pane = this.querySelector('.sf-progress-run-output');
    this._reading.element = pane; // Instant: the page's smooth scrolling would leave a log behind its end
    // while lines arrive faster than the animation.

    if (pane && this._follow) pane.scrollTo({
      top: pane.scrollHeight,
      behavior: 'instant'
    });

    for (const log of this.querySelectorAll('.sf-progress-run-step-log')) log.scrollTo({
      top: log.scrollHeight,
      behavior: 'instant'
    });
  }

}

SfProgressRun.define('sf-progress-run');

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "3bb2b1c9d41d"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderProgressRunTemplate: () => (/* binding */ renderProgressRunTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var lit_static_html_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("ee5035470810");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);

 // sf-progress-run's markup (scss/ draws it on one rung of the ladder).
//
// look full (C34): a region named by label, in groups the sheet spaces by
// meaning (R073):
// - head: the title, a heading of heading-level, with the state badge on its
//   first line and the caption under it;
// - progress: the overall sf-progress-bar (indeterminate while the size is
//   unknown) and the figures line «N из M · %» with the time left (not live);
// - results: once ended, the result line and the counts as one line of text,
//   a non-zero error count a link to the error list;
// - errors: the first errors, a list the error link moves to;
// - steps: an ordered list: the state glyph (sf-steps' set, running turning),
//   the title with its state said in words (visually hidden), the step's
//   figures and text, and the time at the end; the running one is
//   aria-current; a step with a log is a toggle (aria-expanded,
//   aria-controls) over its log;
// - output: a toggle (sf-button, aria-expanded, aria-controls); open, a pre in
//   a scroller of role log (not live, focusable to scroll), with copy
//   (sf-button-copy, the pre as its target) and download;
// - actions: «Ещё N ошибок» at the start, then Minimize, Pause/Continue,
//   Cancel, Retry and Hide, as their states allow.
// The result line is the one status live region: it says the result and the
// state changes; nothing else is live.
//
// look compact: one line -- the bar and «62 % · 3 мин» while it runs, the
// badge once it stopped -- and icon actions. look notice: the mark in the
// icon field (the ring, or the state's icon), the name and a line of
// figures, and Expand.
// The rung below the run's: texts, times, the output, the badges and the
// buttons. A size the template gives is relative to the run's (density, C22).

const BELOW = {
  '1/2': '1/3',
  1: '1/2'
};

const icon = (name, extra = '') => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class=${['sf-icon', 'sf-progress-run-icon', extra].filter(Boolean).join(' ')} aria-hidden="true">${name}</i>`;

function badge(context, size) {
  const {
    stateLook,
    badgeText
  } = context;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-badge class="sf-progress-run-badge" size=${size} appearance="tonal"
    activity=${stateLook.activity || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} status=${stateLook.status || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} icon-start=${stateLook.icon || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    text=${badgeText || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}></sf-badge>`;
}

function bar(context, extra = '') {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-progress-bar class=${['sf-progress-run-bar', extra].filter(Boolean).join(' ')} value=${String(context.barValue)}
    status=${context.barStatus} ?indeterminate=${context.indeterminate} ?paused=${context.state === 'paused'}
    text-position="none" label=${context.regionLabel}></sf-progress-bar>`;
}

function heading(context) {
  const {
    ids,
    label,
    caption,
    headingLevel
  } = context;
  if (!label && !caption) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const tag = (0,lit_static_html_js__WEBPACK_IMPORTED_MODULE_1__.unsafeStatic)(`h${headingLevel}`);
  const below = BELOW[context.size];
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-progress-run-head">
    ${label ? (0,lit_static_html_js__WEBPACK_IMPORTED_MODULE_1__.html)`<${tag} class="sf-progress-run-heading" id=${ids.heading}>${label}</${tag}>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    <span class="sf-progress-run-state">${badge(context, below)}</span>
    ${caption ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<p class="sf-progress-run-caption">${caption}</p>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
  </div>`;
}

function progress(context) {
  // A run of steps alone (1.2's look) has no overall bar: its steps say it.
  if (!context.showBar) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-progress-run-progress">
    ${context.showBar ? bar(context) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    ${context.figures || context.time ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-progress-run-figures">
      ${context.figures ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-progress-run-done">${context.figures}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      ${context.time ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-progress-run-eta">${context.time}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    </div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
  </div>`;
}

function counts(context) {
  const {
    component,
    counters,
    ids,
    errors
  } = context;
  if (!counters.length) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<p class="sf-progress-run-counts">${counters.map(counter => {
    if (counter.error && !counter.zero) {
      return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-progress-run-count sf-progress-run-count--error" data-id=${counter.id || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}><a class="sf-progress-run-count-link"
        href=${errors.length ? `#${ids.errors}` : '#'} @click=${event => component.onReport(event)}>${counter.words}</a></span>`;
    }

    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class=${`sf-progress-run-count${counter.zero ? ' sf-progress-run-count--zero' : ''}`} data-id=${counter.id || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>${counter.words}</span>`;
  })}</p>`;
} // The result line is the run's one status live region, always there (1.2
// kept its class and role): once ended it shows the result with its icon;
// before, it is visually hidden and holds only a state change to say
// (paused, going on), so the percentages are never read.


function result(context) {
  const {
    ended,
    state,
    icons,
    resultShown
  } = context;
  if (!ended) return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class=${`sf-progress-run-result sf-progress-run-result--${state} sr-only`} role="status">${context.announcement}</div>`;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class=${`sf-progress-run-result sf-progress-run-result--${state}`} role="status">
    ${icon(icons[state], `sf-progress-run-icon--${state}`)}<span class="sf-progress-run-result-text">${resultShown}</span>
  </div>`;
}

function results(context) {
  if (!context.ended && !context.counters.length) return result(context);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-progress-run-results">
    ${result(context)}
    ${counts(context)}
  </div>`;
}

function errorList(context) {
  const {
    errors,
    ids,
    words
  } = context;
  if (!errors.length) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<ul class="sf-progress-run-errors" id=${ids.errors} tabindex="-1" aria-label=${words.errorsList}>
    ${errors.map(error => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<li class="sf-progress-run-error">
      <span class="sf-progress-run-error-where">${error.where}</span>
      <span class="sf-progress-run-error-key">${error.key}</span>
      <span class="sf-progress-run-error-text">${error.text}</span>
    </li>`)}
  </ul>`;
}

function step(context, item) {
  const {
    component,
    ids,
    words
  } = context;
  const logId = `${ids.log}-${item.id}`;
  const body = (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${icon(context.icons[item.state], `sf-progress-run-icon--${item.state}`)}
    <span class="sf-progress-run-step-text">
      <span class="sf-progress-run-step-title">${item.title}<span class="sr-only">, ${item.stateWord}</span></span>
      ${item.figures ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-progress-run-step-supporting sf-progress-run-step-figures">${item.figures}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      ${item.text ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-progress-run-step-supporting">${item.text}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    </span>`;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<li class=${`sf-progress-run-step sf-progress-run-step--${item.state}${item.log ? ' sf-progress-run-step--log' : ''}`} data-id=${item.id} data-state=${item.state}
      aria-current=${item.state === 'running' ? 'step' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
    ${item.log ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<button type="button" class="sf-progress-run-step-toggle" aria-expanded=${item.logOpen ? 'true' : 'false'} aria-controls=${logId}
          title=${words.stepLog} @click=${() => component.toggleStepLog(item.id)}>${body}${icon(item.logOpen ? 'expand_less' : 'expand_more', 'sf-progress-run-icon--chevron')}</button>` : body}
    ${item.time ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-progress-run-time">${item.time}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    ${item.log && item.logOpen ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<pre class="sf-progress-run-step-log" id=${logId} role="log" aria-live="off" aria-label=${`${words.stepLog}: ${item.title}`} tabindex="0">${item.log}</pre>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
  </li>`;
}

function output(context) {
  const {
    component,
    ids,
    size,
    outputOpen,
    words
  } = context;
  const below = BELOW[size];
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-progress-run-output-block">
    <div class="sf-progress-run-output-bar">
      <sf-button class="sf-progress-run-toggle" size=${below} appearance="ghost" text=${context.outputLabel}
        icon-end=${outputOpen ? 'expand_less' : 'expand_more'} expanded=${outputOpen ? 'true' : 'false'} aria-controls=${ids.output}
        @click=${() => component.toggleOutput()}></sf-button>
      ${outputOpen ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-progress-run-output-tools">
        <sf-button-copy class="sf-progress-run-copy" size=${below} appearance="ghost" target=${`#${ids.output}-text`} label=${words.copy}></sf-button-copy>
        <sf-button-icon class="sf-progress-run-download" size=${below} appearance="ghost" icon="download"
          aria-label=${words.download} title=${words.download} @click=${() => component.onDownload()}></sf-button-icon>
      </span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    </div>
    ${outputOpen ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-progress-run-output" id=${ids.output} role="log" aria-live="off" aria-label=${context.outputLabel} tabindex="0">
      <pre class="sf-progress-run-output-text" id=${`${ids.output}-text`}>${context.outputShown}</pre>
      ${context.outputShown ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-progress-run-output-empty">${words.emptyOutput}</span>`}
    </div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
  </div>`;
}

function actions(context) {
  const {
    component,
    size,
    words,
    showCancel,
    showRetry,
    showHide,
    showPause,
    showResume,
    showMinimize,
    moreErrors
  } = context;
  if (!showCancel && !showRetry && !showHide && !showPause && !showResume && !showMinimize && !moreErrors) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const below = BELOW[size];
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-progress-run-actions">
    ${moreErrors ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button class="sf-progress-run-more" size=${below} appearance="ghost" text=${words.moreErrors}
      @click=${() => component.onReport()}></sf-button>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    ${showMinimize ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button class="sf-progress-run-minimize" size=${below} appearance="ghost" icon-start="close_fullscreen" text=${words.minimize}
      @click=${() => component.onMinimize()}></sf-button>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    ${showPause ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button class="sf-progress-run-pause" size=${below} appearance="outline" icon-start="pause" text=${words.pause}
      @click=${() => component.onPause()}></sf-button>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    ${showResume ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button class="sf-progress-run-resume" size=${below} appearance="outline" icon-start="play_arrow" text=${words.resume}
      @click=${() => component.onResume()}></sf-button>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    ${showCancel ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button class="sf-progress-run-cancel" size=${below} appearance="outline" status="danger" text=${words.cancel}
      @click=${() => component.onCancel()}></sf-button>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    ${showRetry ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button class="sf-progress-run-retry" size=${below} appearance=${context.state === 'cancelled' ? 'outline' : 'default'} icon-start="replay" text=${context.retryWord}
      data-scope=${context.state === 'partial' ? 'failed' : 'all'} data-from=${context.retryFrom || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      @click=${() => component.onRetry()}></sf-button>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    ${showHide ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button class="sf-progress-run-hide" size=${below} appearance="ghost" text=${words.hide}
      @click=${() => component.onHide()}></sf-button>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
  </div>`;
} // The icon actions of the compact and notice looks.


function iconActions(context) {
  const {
    component,
    size,
    words,
    showCancel,
    showRetry,
    showPause,
    showResume,
    view,
    regionLabel
  } = context;
  const below = BELOW[size];

  const one = (name, glyph, label, press) => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button-icon class=${`sf-progress-run-${name}`} size=${below} appearance="ghost" scheme="on-surface-variant"
    icon=${glyph} aria-label=${label} title=${label} @click=${press}></sf-button-icon>`;

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-progress-run-icon-actions">
    ${showPause ? one('pause', 'pause', words.pause, () => component.onPause()) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    ${showResume ? one('resume', 'play_arrow', words.resume, () => component.onResume()) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    ${showCancel && view === 'compact' ? one('cancel', 'close', words.cancel, () => component.onCancel()) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    ${showRetry && view === 'compact' ? one('retry', 'replay', context.retryWord, () => component.onRetry()) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    ${view === 'notice' ? one('expand', 'open_in_full', `${words.expand}: ${regionLabel}`, () => component.onExpand()) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
  </span>`;
}

function compact(context) {
  const {
    state,
    ended,
    size
  } = context;
  const running = state === 'running' || state === 'paused';
  const short = state === 'paused' ? [context.badgeText, context.figuresShort].filter(Boolean).join(' · ') : [context.figuresShort, context.timeShort].filter(Boolean).join(' · ');
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-progress-run-line">
    ${running ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-progress-run-inline">${bar(context)}${short ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-progress-run-figures-short">${short}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}</span>` : badge(context, BELOW[size])}
    ${ended || running ? iconActions(context) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
  </div>`;
}

function notice(context) {
  const {
    state,
    ended,
    component,
    ids,
    regionLabel,
    icons,
    errors
  } = context;
  const running = state === 'running' || state === 'paused';
  const mark = running ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-progress-ring class="sf-progress-run-ring" size="1/2" value=${String(context.barValue)} status=${context.barStatus}
        ?indeterminate=${context.indeterminate} label=${regionLabel}></sf-progress-ring>` : icon(icons[state] ?? icons.waiting, `sf-progress-run-icon--${state}`);
  let line;

  if (state === 'partial') {
    line = (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${context.figuresPlain ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${context.figuresPlain} · ` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}<a class="sf-progress-run-count-link" href=${errors.length ? `#${ids.errors}` : '#'}
      @click=${event => component.onReport(event)}>${context.words.errorsCount}</a>`;
  } else if (ended) {
    line = context.resultShown;
  } else if (state === 'paused') {
    line = [context.badgeText, context.figuresShort].filter(Boolean).join(' · ');
  } else if (state === 'waiting') {
    line = context.badgeText;
  } else {
    line = [context.figuresShort || context.caption, context.time].filter(Boolean).join(' · ');
  }

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-progress-run-line">
    <span class="sf-progress-run-mark">${mark}</span>
    <span class="sf-progress-run-notice-text">
      <span class="sf-progress-run-notice-title">${regionLabel}</span>
      <span class="sf-progress-run-notice-figures">${line}</span>
    </span>
    ${iconActions(context)}
  </div>`;
}

function renderProgressRunTemplate(context) {
  const {
    size,
    state,
    view,
    ids,
    label
  } = context;
  const classes = ['sf-progress-run', `sf-progress-run--size-${size === '1/2' ? 'half' : '1'}`, `sf-progress-run--${state}`, `sf-progress-run--view-${view}`, context.rootClass].filter(Boolean).join(' ');

  if (view === 'compact' || view === 'notice') {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class=${classes} style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} role="group" aria-label=${context.regionLabel}>
      ${view === 'compact' ? compact(context) : notice(context)}
      <div class=${`sf-progress-run-result sf-progress-run-result--${state} sr-only`} role="status">${context.announcement}</div>
    </div>`;
  }

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<section class=${classes} style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      aria-labelledby=${label ? ids.heading : lit__WEBPACK_IMPORTED_MODULE_0__.nothing} aria-label=${label ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : context.regionLabel}>
    ${heading(context)}
    ${progress(context)}
    ${results(context)}
    ${errorList(context)}
    ${context.steps.length ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<ol class="sf-progress-run-steps" aria-label=${context.words.steps}>${context.steps.map(item => step(context, item))}</ol>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    ${output(context)}
    ${actions(context)}
  </section>`;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "533b90592c77"
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

/***/ "43090d1c8307"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("page-language", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("page-language", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "deb1a4d61565"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("smart-base", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("smart-base", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "f550d360fd36"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   _$LH: () => (/* binding */ j),
/* harmony export */   html: () => (/* binding */ b),
/* harmony export */   mathml: () => (/* binding */ T),
/* harmony export */   noChange: () => (/* binding */ E),
/* harmony export */   nothing: () => (/* binding */ A),
/* harmony export */   render: () => (/* binding */ D),
/* harmony export */   svg: () => (/* binding */ w)
/* harmony export */ });
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,i=t=>t,s=t.trustedTypes,e=s?s.createPolicy("lit-html",{createHTML:t=>t}):void 0,h="$lit$",o=`lit$${Math.random().toFixed(9).slice(2)}$`,n="?"+o,r=`<${n}>`,l=document,c=()=>l.createComment(""),a=t=>null===t||"object"!=typeof t&&"function"!=typeof t,u=Array.isArray,d=t=>u(t)||"function"==typeof t?.[Symbol.iterator],f="[ \t\n\f\r]",v=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_=/-->/g,m=/>/g,p=RegExp(`>|${f}(?:([^\\s"'>=/]+)(${f}*=${f}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),g=/'/g,$=/"/g,y=/^(?:script|style|textarea|title)$/i,x=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),b=x(1),w=x(2),T=x(3),E=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),C=new WeakMap,P=l.createTreeWalker(l,129);function V(t,i){if(!u(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==e?e.createHTML(i):i}const N=(t,i)=>{const s=t.length-1,e=[];let n,l=2===i?"<svg>":3===i?"<math>":"",c=v;for(let i=0;i<s;i++){const s=t[i];let a,u,d=-1,f=0;for(;f<s.length&&(c.lastIndex=f,u=c.exec(s),null!==u);)f=c.lastIndex,c===v?"!--"===u[1]?c=_:void 0!==u[1]?c=m:void 0!==u[2]?(y.test(u[2])&&(n=RegExp("</"+u[2],"g")),c=p):void 0!==u[3]&&(c=p):c===p?">"===u[0]?(c=n??v,d=-1):void 0===u[1]?d=-2:(d=c.lastIndex-u[2].length,a=u[1],c=void 0===u[3]?p:'"'===u[3]?$:g):c===$||c===g?c=p:c===_||c===m?c=v:(c=p,n=void 0);const x=c===p&&t[i+1].startsWith("/>")?" ":"";l+=c===v?s+r:d>=0?(e.push(a),s.slice(0,d)+h+s.slice(d)+o+x):s+o+(-2===d?i:x)}return[V(t,l+(t[s]||"<?>")+(2===i?"</svg>":3===i?"</math>":"")),e]};class S{constructor({strings:t,_$litType$:i},e){let r;this.parts=[];let l=0,a=0;const u=t.length-1,d=this.parts,[f,v]=N(t,i);if(this.el=S.createElement(f,e),P.currentNode=this.el.content,2===i||3===i){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(r=P.nextNode())&&d.length<u;){if(1===r.nodeType){if(r.hasAttributes())for(const t of r.getAttributeNames())if(t.endsWith(h)){const i=v[a++],s=r.getAttribute(t).split(o),e=/([.?@])?(.*)/.exec(i);d.push({type:1,index:l,name:e[2],strings:s,ctor:"."===e[1]?I:"?"===e[1]?L:"@"===e[1]?z:H}),r.removeAttribute(t)}else t.startsWith(o)&&(d.push({type:6,index:l}),r.removeAttribute(t));if(y.test(r.tagName)){const t=r.textContent.split(o),i=t.length-1;if(i>0){r.textContent=s?s.emptyScript:"";for(let s=0;s<i;s++)r.append(t[s],c()),P.nextNode(),d.push({type:2,index:++l});r.append(t[i],c())}}}else if(8===r.nodeType)if(r.data===n)d.push({type:2,index:l});else{let t=-1;for(;-1!==(t=r.data.indexOf(o,t+1));)d.push({type:7,index:l}),t+=o.length-1}l++}}static createElement(t,i){const s=l.createElement("template");return s.innerHTML=t,s}}function M(t,i,s=t,e){if(i===E)return i;let h=void 0!==e?s._$Co?.[e]:s._$Cl;const o=a(i)?void 0:i._$litDirective$;return h?.constructor!==o&&(h?._$AO?.(!1),void 0===o?h=void 0:(h=new o(t),h._$AT(t,s,e)),void 0!==e?(s._$Co??=[])[e]=h:s._$Cl=h),void 0!==h&&(i=M(t,h._$AS(t,i.values),h,e)),i}class R{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:i},parts:s}=this._$AD,e=(t?.creationScope??l).importNode(i,!0);P.currentNode=e;let h=P.nextNode(),o=0,n=0,r=s[0];for(;void 0!==r;){if(o===r.index){let i;2===r.type?i=new k(h,h.nextSibling,this,t):1===r.type?i=new r.ctor(h,r.name,r.strings,this,t):6===r.type&&(i=new Z(h,this,t)),this._$AV.push(i),r=s[++n]}o!==r?.index&&(h=P.nextNode(),o++)}return P.currentNode=l,e}p(t){let i=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++}}class k{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,i,s,e){this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cv=e?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t?.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=M(this,t,i),a(t)?t===A||null==t||""===t?(this._$AH!==A&&this._$AR(),this._$AH=A):t!==this._$AH&&t!==E&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):d(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==A&&a(this._$AH)?this._$AA.nextSibling.data=t:this.T(l.createTextNode(t)),this._$AH=t}$(t){const{values:i,_$litType$:s}=t,e="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=S.createElement(V(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===e)this._$AH.p(i);else{const t=new R(e,this),s=t.u(this.options);t.p(i),this.T(s),this._$AH=t}}_$AC(t){let i=C.get(t.strings);return void 0===i&&C.set(t.strings,i=new S(t)),i}k(t){u(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const h of t)e===i.length?i.push(s=new k(this.O(c()),this.O(c()),this,this.options)):s=i[e],s._$AI(h),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e)}_$AR(t=this._$AA.nextSibling,s){for(this._$AP?.(!1,!0,s);t!==this._$AB;){const s=i(t).nextSibling;i(t).remove(),t=s}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class H{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,i,s,e,h){this.type=1,this._$AH=A,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=h,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=A}_$AI(t,i=this,s,e){const h=this.strings;let o=!1;if(void 0===h)t=M(this,t,i,0),o=!a(t)||t!==this._$AH&&t!==E,o&&(this._$AH=t);else{const e=t;let n,r;for(t=h[0],n=0;n<h.length-1;n++)r=M(this,e[s+n],i,n),r===E&&(r=this._$AH[n]),o||=!a(r)||r!==this._$AH[n],r===A?t=A:t!==A&&(t+=(r??"")+h[n+1]),this._$AH[n]=r}o&&!e&&this.j(t)}j(t){t===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class I extends H{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===A?void 0:t}}class L extends H{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==A)}}class z extends H{constructor(t,i,s,e,h){super(t,i,s,e,h),this.type=5}_$AI(t,i=this){if((t=M(this,t,i,0)??A)===E)return;const s=this._$AH,e=t===A&&s!==A||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,h=t!==A&&(s===A||e);e&&this.element.removeEventListener(this.name,this,s),h&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class Z{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){M(this,t)}}const j={M:h,P:o,A:n,C:1,L:N,R,D:d,V:M,I:k,H,N:L,U:z,B:I,F:Z},B=t.litHtmlPolyfillSupport;B?.(S,k),(t.litHtmlVersions??=[]).push("3.3.3");const D=(t,i,s)=>{const e=s?.renderBefore??i;let h=e._$litPart$;if(void 0===h){const t=s?.renderBefore??null;e._$litPart$=h=new k(i.insertBefore(c(),t),t,void 0,s??{})}return h._$AI(t),h};
//# sourceMappingURL=lit-html.js.map


/***/ },

/***/ "ba5a8db95d92"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   html: () => (/* binding */ u),
/* harmony export */   literal: () => (/* binding */ i),
/* harmony export */   mathml: () => (/* binding */ $),
/* harmony export */   svg: () => (/* binding */ c),
/* harmony export */   unsafeStatic: () => (/* binding */ s),
/* harmony export */   withStatic: () => (/* binding */ n)
/* harmony export */ });
/* harmony import */ var _lit_html_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("f550d360fd36");

/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const a=Symbol.for(""),o=t=>{if(t?.r===a)return t?._$litStatic$},s=t=>({_$litStatic$:t,r:a}),i=(t,...r)=>({_$litStatic$:r.reduce((r,e,a)=>r+(t=>{if(void 0!==t._$litStatic$)return t._$litStatic$;throw Error(`Value passed to 'literal' function must be a 'literal' result: ${t}. Use 'unsafeStatic' to pass non-literal values, but\n            take care to ensure page security.`)})(e)+t[a+1],t[0]),r:a}),l=new Map,n=t=>(r,...e)=>{const a=e.length;let s,i;const n=[],u=[];let c,$=0,f=!1;for(;$<a;){for(c=r[$];$<a&&void 0!==(i=e[$],s=o(i));)c+=s+r[++$],f=!0;$!==a&&u.push(i),n.push(c),$++}if($===a&&n.push(r[a]),f){const t=n.join("$$lit$$");void 0===(r=l.get(t))&&(n.raw=n,l.set(t,r=n)),e=u}return t(r,...e)},u=n(_lit_html_js__WEBPACK_IMPORTED_MODULE_0__.html),c=n(_lit_html_js__WEBPACK_IMPORTED_MODULE_0__.svg),$=n(_lit_html_js__WEBPACK_IMPORTED_MODULE_0__.mathml);
//# sourceMappingURL=static.js.map


/***/ },

/***/ "ee5035470810"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   html: () => (/* reexport safe */ lit_html_static_js__WEBPACK_IMPORTED_MODULE_0__.html),
/* harmony export */   literal: () => (/* reexport safe */ lit_html_static_js__WEBPACK_IMPORTED_MODULE_0__.literal),
/* harmony export */   mathml: () => (/* reexport safe */ lit_html_static_js__WEBPACK_IMPORTED_MODULE_0__.mathml),
/* harmony export */   svg: () => (/* reexport safe */ lit_html_static_js__WEBPACK_IMPORTED_MODULE_0__.svg),
/* harmony export */   unsafeStatic: () => (/* reexport safe */ lit_html_static_js__WEBPACK_IMPORTED_MODULE_0__.unsafeStatic),
/* harmony export */   withStatic: () => (/* reexport safe */ lit_html_static_js__WEBPACK_IMPORTED_MODULE_0__.withStatic)
/* harmony export */ });
/* harmony import */ var lit_html_static_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ba5a8db95d92");

//# sourceMappingURL=static-html.js.map


/***/ },

/***/ "d092c5059e25"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.progress-run","tag":"sf-progress-run","version":"1.3.3","kind":"leaf","settings":{"look":{"type":"enum","values":["full","compact","notice"],"default":"full"},"label":{"type":"string","default":""},"heading-level":{"type":"enum","values":["1","2","3","4","5","6"],"default":"3"},"caption":{"type":"string","default":""},"value":{"type":"number","optional":true,"min":0},"total":{"type":"number","optional":true,"min":0},"unit":{"type":"string","default":""},"remaining":{"type":"number","optional":true,"min":0},"started-at":{"type":"string","default":""},"finished-at":{"type":"string","default":""},"steps":{"type":"list","schema":{"items":{"type":"object","properties":{"id":{"type":"string"},"title":{"type":"string"},"state":{"type":"string","enum":["waiting","running","done","failed","skipped"]},"text":{"type":"string"},"started":{"type":"string"},"finished":{"type":"string"},"duration":{"type":"number"},"value":{"type":"number"},"total":{"type":"number"},"unit":{"type":"string"},"log":{"type":"string"}},"required":["id","title"]}},"default":[]},"run-state":{"type":"enum","values":["auto","running","paused","done","partial","failed","cancelled"],"default":"auto"},"result-text":{"type":"string","default":""},"counters":{"type":"list","schema":{"items":{"type":"object","properties":{"id":{"type":"string"},"label":{"type":"string"},"value":{"type":"number"},"status":{"type":"string","enum":["","error"]},"zero":{"type":"string"}},"required":["id","label"]}},"default":[]},"errors":{"type":"list","schema":{"items":{"type":"object","properties":{"where":{"type":"string"},"key":{"type":"string"},"text":{"type":"string"}},"required":["text"]}},"default":[]},"errors-total":{"type":"number","optional":true,"min":0},"output":{"type":"string","default":""},"output-label":{"type":"string","default-from":"runtime.output-label"},"file-name":{"type":"string","default":"output.txt"},"cancelable":{"type":"boolean","default":false},"pausable":{"type":"boolean","default":false},"retryable":{"type":"boolean","default":false},"hideable":{"type":"boolean","default":false},"minimizable":{"type":"boolean","default":false},"size":{"type":"enum","values":["1/2","1"],"default":"1"}},"values":{"output-open":{"type":"boolean","default":false}},"events":{"cancel":{"carries":{},"cancelable":true},"retry":{"carries":{"scope":{"type":"enum","values":["all","failed"]},"from":{"type":"string","optional":true}}},"close":{"carries":{"reason":{"type":"enum","values":["close"]}},"cancelable":true},"download":{"carries":{"file-name":"string"},"cancelable":true},"toggle":{"carries":{"open":"boolean"}},"pause":{"carries":{}},"resume":{"carries":{}},"minimize":{"carries":{}},"expand":{"carries":{}},"report":{"carries":{},"cancelable":true}},"actions":{"chunk":{"with":{"text":"string","step":{"type":"string","optional":true}}},"clear":{"with":{}},"step":{"with":{"id":"string","state":"string","text":"string","value":"number","total":"number","started":"string","finished":"string","duration":"number"}}},"host-states":{"data-state":"string"},"css-variables":{"--sf-progress-run-background-color":{"type":"color","state":"default"},"--sf-progress-run-divider-color":{"type":"color","state":"default"},"--sf-progress-run-output-background-color":{"type":"color","state":"default"},"--sf-progress-run-output-color":{"type":"color","state":"default"},"--sf-progress-run-output-max-height":{"type":"length","state":"default"},"--sf-progress-run-padding-inline":{"type":"length","state":"default"},"--sf-progress-run-gap":{"type":"length","state":"default"},"--sf-progress-run-gap-tight":{"type":"length","state":"default"}}}');

/***/ },

/***/ "bb540c15b990"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Progress","runtime":{"label":"Progress","output-label":"Output","steps":"Steps","state-waiting":"waiting","state-running":"running","state-done":"done","state-failed":"failed","state-skipped":"skipped","result-done":"Done","result-failed":"Failed","result-cancelled":"Cancelled","cancel":"Cancel","retry":"Retry","hide":"Hide","copy":"Copy the output","download":"Download the output","empty-output":"No output yet","result-partial":"Done with errors","state-word-running":"Running","state-word-paused":"Paused","state-word-partial":"With errors","state-word-cancelled":"Cancelled","state-word-waiting":"Queued","announce-paused":"Paused","announce-resumed":"Going on","figures":"{value} of {total}{unit} · {percent}%","figures-count":"{value}{unit}","percent":"{percent}%","estimating":"estimating time…","remaining":"about {time} left","remaining-short":"{time}","remaining-less":"less than a minute left","remaining-less-short":"< 1 min","minutes":"{n} min","hours":"{h} h {m} min","took":"took {time}","errors-shown":{"one":"Errors: the first {n} of {total}","other":"Errors: the first {n} of {total}"},"more-errors":{"one":"{n} more error","other":"{n} more errors"},"errors-count":{"one":"{n} error","other":"{n} errors"},"no-errors":"no errors","retry-failed":"Retry failed","pause":"Pause","resume":"Continue","minimize":"Minimize","expand":"Expand","step-log":"Step log","counts":"Result","figures-plain":"{value} of {total}"},"events":{"cancel":{"label":"Cancel"},"retry":{"label":"Retry"},"close":{"label":"Hide"},"download":{"label":"Download the output"},"pause":{"label":"Pause"},"resume":{"label":"Continue"},"minimize":{"label":"Minimize"},"expand":{"label":"Expand"},"report":{"label":"Errors"}}}');

/***/ },

/***/ "7e1b23a85a40"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Ход выполнения","runtime":{"label":"Ход выполнения","output-label":"Вывод","steps":"Шаги","state-waiting":"ожидает","state-running":"выполняется","state-done":"готово","state-failed":"не удалось","state-skipped":"пропущен","result-done":"Готово","result-failed":"Не удалось","result-cancelled":"Отменено","cancel":"Отменить","retry":"Повторить","hide":"Скрыть","copy":"Скопировать вывод","download":"Скачать вывод","empty-output":"Вывода пока нет","result-partial":"Готово с ошибками","state-word-running":"Идёт","state-word-paused":"Пауза","state-word-partial":"С ошибками","state-word-cancelled":"Отменено","state-word-waiting":"В очереди","announce-paused":"Пауза","announce-resumed":"Продолжается","figures":"{value} из {total}{unit} · {percent} %","figures-count":"{value}{unit}","percent":"{percent} %","estimating":"оцениваем время…","remaining":"осталось ≈ {time}","remaining-short":"{time}","remaining-less":"осталось меньше минуты","remaining-less-short":"< 1 мин","minutes":"{n} мин","hours":"{h} ч {m} мин","took":"заняло {time}","errors-shown":{"one":"Ошибки: первая {n} из {total}","few":"Ошибки: первые {n} из {total}","many":"Ошибки: первые {n} из {total}","other":"Ошибки: первые {n} из {total}"},"more-errors":{"one":"Ещё {n} ошибка","few":"Ещё {n} ошибки","many":"Ещё {n} ошибок","other":"Ещё {n} ошибки"},"errors-count":{"one":"{n} ошибка","few":"{n} ошибки","many":"{n} ошибок","other":"{n} ошибки"},"no-errors":"ошибок нет","retry-failed":"Повторить неудачные","pause":"Пауза","resume":"Продолжить","minimize":"Свернуть","expand":"Развернуть","step-log":"Журнал шага","counts":"Итог","figures-plain":"{value} из {total}"},"events":{"cancel":{"label":"Отменить"},"retry":{"label":"Повторить"},"close":{"label":"Скрыть"},"download":{"label":"Скачать вывод"},"pause":{"label":"Пауза"},"resume":{"label":"Продолжить"},"minimize":{"label":"Свернуть"},"expand":{"label":"Развернуть"},"report":{"label":"Ошибки"}}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("d8d23d4adc43");
/******/
/******/ })()
;