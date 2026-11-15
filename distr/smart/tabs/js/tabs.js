/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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

/***/ "1412c5875b4d"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RELATIVE: () => (/* binding */ RELATIVE),
/* harmony export */   densityOf: () => (/* binding */ densityOf),
/* harmony export */   drawing: () => (/* binding */ drawing),
/* harmony export */   followDensity: () => (/* binding */ followDensity),
/* harmony export */   markRelativeSizes: () => (/* binding */ markRelativeSizes),
/* harmony export */   noteAuthored: () => (/* binding */ noteAuthored),
/* harmony export */   sizedBefore: () => (/* binding */ sizedBefore)
/* harmony export */ });
// Density (owner decision C22, 2026-11-09). data-sf-density="compact" on the
// root or on a container moves every component one ladder step down; the CSS
// does it (core/scss/_sf_css__density.scss): each step variable holds the step
// below. An explicit size is a step on the region's ladder (owner decision
// C79, 2026-11-12, changing C22): it comes down with the region, and only
// data-sf-density="normal" takes the normal ladder back.
//
// A size a component's template gives an element it draws (sf-input's clear
// button, a pager's buttons, a submenu) is relative to the component's own
// size; those are still marked data-sf-size-relative once the component has
// drawn. Since C79 the density CSS treats both alike; the mark stays a
// published runtime mark (host-runtime-marks) for hosts that read it.
//
// What a component holds of the page's own (captured slot content, children
// left in place) keeps its size explicit. The store is on the shared global:
// every bundle carries its own copy of this module.
const store = () => {
  const SF = globalThis.SF = globalThis.SF || {};
  const internal = SF.__internal || (SF.__internal = {});
  return internal.density ||= {
    authored: new WeakSet(),
    depth: 0
  };
};

const RELATIVE = 'data-sf-size-relative'; // Page content a component captured to place in its own drawing. Content a
// template hands to a child while it draws is the template's, not the page's.

function noteAuthored(nodes) {
  const state = store();
  if (state.depth > 0) return;

  for (const node of nodes) if (node && typeof node === 'object') state.authored.add(node);
}
function drawing(callback) {
  const state = store();
  state.depth += 1;

  try {
    return callback();
  } finally {
    state.depth -= 1;
  }
} // The sized elements present before a host first draws are the page's.
// A printed first-paint picture is the drawing's, not the page's.

function sizedBefore(host) {
  return new Set(Array.from(host.querySelectorAll?.('[size]') ?? []).filter(element => {
    const picture = element.closest('[data-sf-static]');
    return !picture || !host.contains(picture);
  }));
} // After a host drew: every sized element its drawing holds that is not the
// page's is relative to the host.

function markRelativeSizes(host, before = null) {
  const {
    authored
  } = store();

  for (const element of host.querySelectorAll?.('[size]') ?? []) {
    if (element.hasAttribute(RELATIVE) || before?.has(element)) continue;
    let node = element;
    let page = false;

    while (node && node !== host) {
      if (authored.has(node)) {
        page = true;
        break;
      }

      node = node.parentNode;
    }

    if (!page) element.setAttribute(RELATIVE, '');
  }
} // A popup a component builds itself and places outside its own box (a menu on
// <body>, in an open dialog): sized from the component, so relative, and in
// the component's density, not the density of where it was placed.

function followDensity(element, from) {
  if (!element?.setAttribute) return element;
  if (element.hasAttribute('size')) element.setAttribute(RELATIVE, '');
  const density = densityOf(from);
  if (density) element.setAttribute('data-sf-density', density);else element.removeAttribute('data-sf-density');
  return element;
} // The density an element stands in: the nearest region's (an explicit size
// follows its region since C79); null outside any.

function densityOf(from) {
  for (let node = from; node?.nodeType === 1; node = node.parentElement) {
    if (node.hasAttribute('data-sf-density')) return node.getAttribute('data-sf-density');
  }

  return null;
}

/***/ },

/***/ "2db3a835ac11"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   chooseBeside: () => (/* binding */ chooseBeside),
/* harmony export */   fitBesideMore: () => (/* binding */ fitBesideMore),
/* harmony export */   fitInOrder: () => (/* binding */ fitInOrder),
/* harmony export */   rowRoom: () => (/* binding */ rowRoom),
/* harmony export */   spanOf: () => (/* binding */ spanOf),
/* harmony export */   standardMenu: () => (/* binding */ standardMenu),
/* harmony export */   textWidth: () => (/* binding */ textWidth),
/* harmony export */   triggerExtra: () => (/* binding */ triggerExtra)
/* harmony export */ });
// One row of items that do not all fit, and a trailing «Ещё (n)» that holds
// the rest (owner decision C54): the items in their order up to the first
// that does not fit, each whole in the row or in «Ещё»; the items that must
// stay (the current one, the pinned ones) stay, the last kept others giving
// way to them; the room is taken with the width «Ещё (n)» will have with its
// own count. Only the arithmetic and the measuring are here -- the element
// keeps its markup, its classes and its menu entries.
//
// Taken out of sf-tabs (fix/tabs-overflow-more, C54 and its returns D1, D2)
// so a second row (sf-contents layout="bar", CT-05) lays out by the same
// rules instead of a copy of them. Every number is a width in CSS pixels,
// fractional; half a pixel is the tolerance, as the tabs measured it.
const TOLERANCE = 0.5; // The items in their order up to the first that does not fit in available:
// their indices, or null when every item fits.

function fitInOrder(widths, gap, available) {
  const kept = [];
  let used = 0;

  for (let at = 0; at < widths.length; at += 1) {
    const next = used + (kept.length ? gap : 0) + widths[at];
    if (next > available + TOLERANCE) break;
    kept.push(at);
    used = next;
  }

  return kept.length === widths.length ? null : kept;
} // The width of some items laid side by side.

function spanOf(widths, gap, indices) {
  return indices.reduce((sum, at, n) => sum + widths[at] + (n ? gap : 0), 0);
} // The row beside «Ещё», in available: the items in order, then the items that
// must stay put back in -- the last kept items that need not stay give way to
// them, and when the must-stay items alone do not fit, they give way too, the
// last first, but never the current one.

function chooseBeside({
  widths,
  gap = 0,
  available,
  must = [],
  current = -1
}) {
  let chosen = fitInOrder(widths, gap, available) ?? widths.map((_, at) => at);
  const missing = must.filter(at => !chosen.includes(at));
  if (!missing.length) return chosen;
  const next = [...chosen, ...missing];

  while (spanOf(widths, gap, next) > available + TOLERANCE) {
    const dropAt = next.slice().reverse().find(at => !must.includes(at)) ?? next.slice().reverse().find(at => at !== current);
    if (dropAt === undefined) break;
    next.splice(next.indexOf(dropAt), 1);
  }

  chosen = next.sort((a, b) => a - b);
  return chosen;
} // The row beside «Ещё (n)»: room is the row's room with the trigger standing
// as it is drawn now; extra(count) is how much wider (or narrower) the
// trigger will be with count in it. Of the rows that fit beside their own
// count, the one with the most items; when no count agrees with its row, the
// row that fits beside the widest. squeezed is the current item when it alone
// is left and still wider than the room (it alone may be shortened), else -1.

function fitBesideMore({
  widths,
  gap = 0,
  room,
  must = [],
  current = -1,
  extra = null
}) {
  let kept = null;

  if (typeof extra === 'function') {
    const besides = [];

    for (let count = 1; count < widths.length && !kept; count += 1) {
      const more = extra(count);
      besides.push(more);
      const chosen = chooseBeside({
        widths,
        gap,
        available: room - more,
        must,
        current
      });
      if (widths.length - chosen.length === count) kept = chosen;
    }

    if (!kept && besides.length) kept = chooseBeside({
      widths,
      gap,
      available: room - Math.max(...besides),
      must,
      current
    });
  }

  kept ??= chooseBeside({
    widths,
    gap,
    available: room,
    must,
    current
  });
  const squeezed = kept.length === 1 && kept[0] === current && spanOf(widths, gap, kept) > room + TOLERANCE ? current : -1;
  return {
    kept,
    squeezed
  };
} // The content box of a row that clips and has no scrollbar, in fractional
// pixels: clientWidth is a whole pixel, and a row 383.6 px wide read as 383 or
// 384 laid out differently (C54 return).

function rowRoom(list) {
  const style = getComputedStyle(list);
  const edges = ['borderInlineStartWidth', 'borderInlineEndWidth', 'paddingInlineStart', 'paddingInlineEnd'];
  return list.getBoundingClientRect().width - edges.reduce((sum, edge) => sum + (parseFloat(style[edge]) || 0), 0);
} // A text measurer in an element's own face, or null without a canvas: the
// width «Ещё (7)» will have before its button draws it.

let measureCanvas = null;
function textWidth(element) {
  const style = getComputedStyle(element);
  measureCanvas ??= globalThis.document?.createElement('canvas') ?? null;
  const context = measureCanvas?.getContext?.('2d');
  if (!context) return null;
  context.font = style.font;
  if ('letterSpacing' in context) context.letterSpacing = style.letterSpacing === 'normal' ? '0px' : style.letterSpacing;
  return text => context.measureText(text).width;
} // extra(count) for a trigger whose text box shows label(count) now.

function triggerExtra(textBox, label) {
  const measure = textBox ? textWidth(textBox) : null;
  if (!measure) return null;
  const drawn = measure(textBox.textContent.trim());
  return count => measure(label(count)) - drawn;
} // The standard menu «Ещё» opens: sf-menu-context, a relation fetched when
// first used (SF.Loader.ensure: asked for, waited for up to 3 s, never
// thrown), one per owner and field, on the body or in the open dialog.

async function standardMenu(owner, field, select) {
  await globalThis.SF?.Loader?.ensure?.(['sf-menu-context']);
  if (owner[field]?.isConnected) return owner[field];
  const menu = document.createElement('sf-menu-context');
  menu.setAttribute('popup', '');
  menu.addEventListener('sf-menu-context-select', event => select?.(event.detail?.id, event));
  (owner.closest('dialog[open]') || document.body).append(menu);
  owner[field] = menu;
  return menu;
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

/***/ "e010c688f3f1"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _core_js_instance_path__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("e92fd2d1a38c");
/* harmony import */ var _core_js_tag_aliases_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("4a85acfb05c1");
/* harmony import */ var _core_js_density_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("1412c5875b4d");
/* harmony import */ var _core_js_breakpoints_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("1373e294ec38");
/* harmony import */ var _core_js_deprecations__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("d3818183b14c");
/* harmony import */ var _core_js_overflow_row_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("2db3a835ac11");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("795a53b0bbe9");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("84d032c55810");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("51b106697124");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__("33cd7c3c3aca");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__("90473944857f");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, _core_js_smart_base__WEBPACK_IMPORTED_MODULE_1__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2__, _core_js_instance_path__WEBPACK_IMPORTED_MODULE_3__, _core_js_tag_aliases_js__WEBPACK_IMPORTED_MODULE_4__, _core_js_deprecations__WEBPACK_IMPORTED_MODULE_7__, _js_templates_default__WEBPACK_IMPORTED_MODULE_9__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, _core_js_smart_base__WEBPACK_IMPORTED_MODULE_1__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2__, _core_js_instance_path__WEBPACK_IMPORTED_MODULE_3__, _core_js_tag_aliases_js__WEBPACK_IMPORTED_MODULE_4__, _core_js_deprecations__WEBPACK_IMPORTED_MODULE_7__, _js_templates_default__WEBPACK_IMPORTED_MODULE_9__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _core_js_instance_path__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_core_js_instance_path__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _core_js_deprecations__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_core_js_deprecations__WEBPACK_IMPORTED_MODULE_7__);













 // sf-tabs from its component.json (standard simai.smart-component 1.3.8 §3,
// §4, §7.2.1, §7.2.3, §8, §11): the settings are attributes and properties
// made by core/js/element-manifest.js, the words are lang/<locale>.json, the
// actions answer outcomes, and the old event name sf-tab-change is a dated
// alias of sf-tabs-change.

const TabsElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_10__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_1___default()),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_12__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_13__
  },
  source: 'ru',
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_11__,
  // setData(data, reason) and setPanels(panels, reason) take their fields in
  // order; the runtime gives them the object form of §4.4 as well.
  positional: ['set-data', 'set-panels']
}); // A page's or an assembly's own panels: direct children of the host
// (§7.2.1 «A tab opens a part», §7.2.3 a panel per entry).

const isPagePanel = node => node?.nodeType === 1 && node.getAttribute('role') === 'tabpanel' && !node.hasAttribute('slot') && !node.hasAttribute('data-sf-static');

const OVERFLOWS = ['scroll', 'wrap', 'more']; // fit (owner decision C96 item 7): the tabs share the row equally -- auto on
// a phone when two to four fit, always, or never.

const FITS = ['auto', 'always', 'never']; // The looks of sf-tabs 1.3.0 (owner decision C96 item 1): the line (the
// default) and the plate (pills); vertical is the menu column. The filled
// look without a type, full and the scheme fills are retired.

const RETIRED = {
  since: '2026-11-12',
  remove_after: '2027-01-01'
}; // A field that says it is wrong, inside a panel (goToError).

const INVALID = '[aria-invalid="true"], [invalid]:not([invalid="false"]), :invalid'; // What takes the focus inside a panel: a panel holding one is not a tab stop
// of its own (APG tabs; R184 T8).

const FOCUSABLE = ['a[href]', 'area[href]', 'button:not([disabled])', 'input:not([disabled]):not([type="hidden"])', 'select:not([disabled])', 'textarea:not([disabled])', 'iframe', 'audio[controls]', 'video[controls]', 'summary', '[contenteditable]:not([contenteditable="false"])', '[tabindex]:not([tabindex="-1"])'].join(', '); // Which item a tab in the list draws. An sf-button moves its data attributes
// to the button inside it, so the index is read wherever it landed.

function tabIndexOf(element) {
  const own = element?.dataset?.sfTabIndex ?? element?.querySelector?.(':scope > [data-sf-tab-index]')?.dataset?.sfTabIndex;
  const index = Number(own);
  return own !== undefined && Number.isInteger(index) ? index : null;
} // The drawn box of a tab: the button inside an sf-button or sf-button-icon,
// or the tab itself. The row measures it and the resize observer watches it,
// the same element both times.


function tabBox(host) {
  return host.matches('sf-button') || (0,_core_js_tag_aliases_js__WEBPACK_IMPORTED_MODULE_4__.isTag)(host, 'sf-button-icon') ? host.querySelector(':scope > .sf-button, :scope > .sf-icon-button, :scope > button') : host;
}

function parseItems(items = '') {
  // The list as JSON in the attribute reads like the property.
  if (typeof items === 'string' && items.trim().startsWith('[')) {
    try {
      return parseItems(JSON.parse(items));
    } catch {// Not JSON: the "label::flags|label" form below.
    }
  }

  if (Array.isArray(items)) {
    return items.map(item => typeof item === 'string' ? {
      label: item
    } : item).filter(Boolean);
  }

  return String(items || '').split('|').map(item => item.trim()).filter(Boolean).map(entry => {
    const [labelPart, flagsPart = ''] = entry.split('::');
    const flags = flagsPart.split(',').map(flag => flag.trim().toLowerCase()).filter(Boolean);
    const options = {};
    flags.forEach(flag => {
      const [key, value] = flag.split('=');
      if (!value && !['icon-start', 'icon-end', 'iconstart', 'iconend'].includes(key)) return;
      options[key] = value;
    });
    return {
      label: labelPart.trim(),
      disabled: flags.includes('disabled'),
      icon: options.icon || '',
      iconLeft: options['icon-left'] || options.iconleft || '',
      iconRight: options['icon-right'] || options.iconright || '',
      iconStart: options['icon-start'] ?? options.iconstart ?? null,
      iconEnd: options['icon-end'] ?? options.iconend ?? null
    };
  });
}

function normalizeIndex(index, total) {
  const value = (0,_core_js_smart_base__WEBPACK_IMPORTED_MODULE_1__.toNumber)(index, 0);

  if (!Number.isFinite(value) || value < 0 || value >= total) {
    return 0;
  }

  return value;
}

function normalizeComponentDescriptor(component = null) {
  if (!component || typeof component !== 'object' || !component.type) {
    return null;
  }

  return {
    type: component.type,
    props: component.props && typeof component.props === 'object' ? component.props : {}
  };
}

function normalizeTabItem(item = {}) {
  if (typeof item === 'string') {
    return {
      label: item
    };
  }

  if (!item || typeof item !== 'object') {
    return null;
  }

  const component = normalizeComponentDescriptor(item.component);
  return { ...item,
    component,
    label: item.label || item.text || item.title || ''
  };
}

function normalizePanelItem(item = {}) {
  if (typeof item === 'string') {
    return {
      text: item
    };
  }

  if (!item || typeof item !== 'object') {
    return null;
  }

  return { ...item,
    component: normalizeComponentDescriptor(item.component)
  };
}

class SfTabs extends TabsElement {
  static get props() {
    return { ...super.props,
      templateName: {
        attribute: 'template',
        default: 'default'
      },
      type: {
        default: null
      },
      // The sheet's sizes (component.json): an unknown one draws as 1.
      size: {
        default: '1',
        values: ['1/2', '1', '2']
      },
      variant: {
        default: 'buttons'
      },
      scheme: {
        default: 'default'
      },
      topPosition: {
        default: 'start'
      },
      // more (the default since 1.2.0, owner decision C54, 2026-11-11): what
      // does not fit goes into «Ещё (n)» whole; scroll keeps the former
      // scrolling row, wrap wraps the rows.
      overflow: {
        default: 'more'
      },
      fit: {
        default: 'auto'
      },
      // A gear at the end of the tabs: the person orders and hides them; the
      // host keeps the choice (sf-tabs-settings-change, setSettings).
      configurable: {
        type: Boolean,
        default: false
      },
      // A panel is drawn when its tab is first opened, and kept (R184 T8).
      lazy: {
        type: Boolean,
        default: false
      },
      // The address keeps the selected tab (#<id>): Back and links work (R184 T10).
      hash: {
        type: Boolean,
        default: false
      },
      // The tab row stays in sight while the panel scrolls.
      sticky: {
        type: Boolean,
        default: false
      },
      activeIndex: {
        type: Number,
        default: 0
      },
      items: {
        default: [],

        parser(value, fallback, element) {
          if (value !== undefined && value !== null) return parseItems(value);
          return parseItems(element?.__sfManifestData?.items ?? []);
        }

      },
      rootClass: {
        default: ''
      },
      topClass: {
        default: ''
      },
      panelClass: {
        default: ''
      }
    };
  }

  constructor() {
    super(); // The page's own panels, in their order (see capturePagePanels).

    this._pagePanels = [];
    this._data = {
      tabs: [],
      panels: []
    };
    this.addEventListener('click', this.handleRootClick);
    this.addEventListener('keydown', this.handleRootKeyDown);
    this._settings = {
      order: [],
      hidden: []
    }; // The entries whose panel was drawn once (lazy): kept drawn.

    this._openedPanels = new Set(); // The page's panels that came with a tabindex of their own: left as they are.

    this._authoredPanelFocus = new WeakSet(); // A change of the row's box or of a tab's box is laid out in the
    // observer's own callback, which runs after the browser's layout and
    // before it paints: the row is never painted as it stood before the
    // change. Laid out a frame later, the first frame of every row showed all
    // its tabs clipped (C54 D3): the Smart base defines its elements in a
    // frame callback, so the tabs and their buttons are drawn in one, and a
    // layout asked for from there came a frame later, after a paint. The
    // trigger's own resize -- «Ещё (n)» drawing its new count, which the
    // layout already took into account (D2) -- is laid out a frame later as
    // before: laid out in the callback too, every pass of a large page ran
    // before its first paint (470 rows at 390: painted after 24 s, not 11 s).

    this._resizeObserver = typeof ResizeObserver === 'function' ? new ResizeObserver(entries => this.onResize(entries)) : null;
    this.addEventListener('sf-after-render', event => {
      // Built-in Smart buttons can finish rendering after their owning Tabs.
      if (event.target !== this && event.target.parentElement === this.tabList) {
        this.syncTabSemantics(); // A tab drawn after the row was laid out has its width only now; its
        // box is watched, so the observer lays the row out before the paint.

        this.observeTabBoxes();
        this.scheduleOverflow();
      } else if (event.target !== this && event.target.closest?.('[data-sf-tab-panel]')?.closest('sf-tabs') === this) {
        // A part in a panel drawn after the tabs: its field may be what takes
        // the focus there.
        this.schedulePanelFocus();
      }
    });
  } // type is optional (component.json): absent is no type, not the first value.


  get type() {
    return this.getProp('type');
  }

  set type(value) {
    if (value === null || value === undefined || value === '') this.removeAttribute('type');else this.setAttribute('type', String(value));
  }

  get tabList() {
    // The row: a tablist, or the nav of a strip of links (R184 T4).
    return this.querySelector(':scope > .sf-tabs > .sf-tabs-top-container > .sf-tabs-top');
  } // The tab of each item, by the item's index: the tabs are drawn in the
  // person's order, and a hidden one is not drawn at all.


  get tabTargets() {
    const targets = [];

    for (const element of Array.from(this.tabList?.children || [])) {
      // An icon link of a strip of links is drawn by the tabs themselves (T4).
      const target = element.matches('sf-button') || (0,_core_js_tag_aliases_js__WEBPACK_IMPORTED_MODULE_4__.isTag)(element, 'sf-button-icon') ? element.querySelector(':scope > button, :scope > a') : element.matches('[role="tab"], a.sf-icon-button') ? element : null;
      const index = tabIndexOf(element);
      if (Number.isInteger(index)) targets[index] = target;
    }

    return targets;
  }

  afterRender(callback) {
    if (typeof callback === 'function') return super.afterRender(callback); // With hash, the first drawing opens the tab the address names.

    if (!this._addressRead) {
      this._addressRead = true;
      this.readAddress({
        person: false
      });
    }

    this.syncTabSemantics();
    this.syncPanelFocus(); // The box that has a size: sf-tabs is display:contents, so observing the
    // element itself never fired and «Ещё» was laid out once, wrong after any
    // resize (docs trial 4, 2026-10-15).

    const container = this.tabList?.parentElement;

    if (this._resizeObserver && container && this._observed !== container) {
      // disconnect() lets every box go: the trigger and the tabs are watched
      // again below.
      this._resizeObserver.disconnect();

      this._observedTrigger = null;
      this._observedTabs = null;

      this._resizeObserver.observe(container);

      this._observed = container;
    } // «Ещё (n)» changes its width with its count after the row was laid out
    // (its sf-button draws the new text later), and the room it takes is the
    // tabs' room: the last tab stood clipped under overflow-x: clip (C54
    // defect, «Архив» in the filled look at 640 px). Its button is watched as
    // well, so the row is laid out again with the trigger's real width.


    const trigger = this.querySelector(':scope > .sf-tabs > .sf-tabs-top-container > .sf-tabs-more > button');

    if (this._resizeObserver && trigger && this._observedTrigger !== trigger) {
      if (this._observedTrigger) this._resizeObserver.unobserve(this._observedTrigger);

      this._resizeObserver.observe(trigger);

      this._observedTrigger = trigger;
    } // A tab's own box: a sheet or a text face arriving later widens the tabs
    // without resizing the row, and the observer lays the row out again before
    // that frame is painted.


    this.observeTabBoxes(); // The text face arriving later widens every tab without resizing the box.

    if (!this._fontsListener && globalThis.document?.fonts?.addEventListener) {
      this._fontsListener = () => this.scheduleOverflow();

      document.fonts.addEventListener('loadingdone', this._fontsListener);
    }

    this.scheduleOverflow();
  } // The drawn box of each tab (its button, or the tab itself), each watched
  // once; a box gone from the row is let go.


  observeTabBoxes() {
    if (!this._resizeObserver) return;
    const boxes = new Set();

    for (const element of Array.from(this.tabList?.children || [])) {
      if (!Number.isInteger(tabIndexOf(element))) continue;
      const box = tabBox(element);
      if (box) boxes.add(box);
    }

    this._observedTabs ??= new Set();

    for (const box of this._observedTabs) {
      if (!boxes.has(box)) {
        this._resizeObserver.unobserve(box);

        this._observedTabs.delete(box);
      }
    }

    for (const box of boxes) {
      if (!this._observedTabs.has(box)) {
        this._resizeObserver.observe(box, {
          box: 'border-box'
        });

        this._observedTabs.add(box);
      }
    }
  } // The width each tab box is left at by the last layout: none for a tab put
  // in «Ещё», its measured width for one kept in the row. A shortened tab has
  // none to expect.


  expectTabSizes(hosts, widths, kept) {
    const expected = new WeakMap();
    hosts.forEach((host, at) => {
      const box = tabBox(host);
      if (!box || host.classList.contains('sf-tabs-squeezed')) return;
      expected.set(box, kept && !kept.includes(at) ? 0 : widths[at]);
    });
    this._expectedTabSizes = expected;
  } // The trigger's own resize (its new count, «Ещё (7)») is laid out a frame
  // later, unless the row now stands past its room: then a tab would be
  // painted clipped for that frame (2 rows of 470 at 390), and it is laid out
  // now. The row was just laid out, so reading its widths costs nothing.


  onResize(entries) {
    if (this.onlyOwnSizes(entries)) return;
    const later = entries.every(entry => entry.target === this._observedTrigger || this.ownSize(entry));
    if (later && !this.rowOverflows()) this.scheduleOverflow();else this.layoutOverflowNow();
  }

  rowOverflows() {
    const list = this.tabList;
    return Boolean(list) && list.scrollWidth > list.clientWidth;
  } // The observer's report of the layout's own work -- tabs it hid or showed
  // again, at the widths it left them -- is not a change to lay out again:
  // laid out for it, every row was laid out twice for each resize and the
  // 470-row page took twice as long to settle (C54 D3, cost.mjs: 27 s, base
  // 12 s, at 1440).


  onlyOwnSizes(entries) {
    const expected = this._expectedTabSizes;
    if (!expected) return false;
    return entries.every(entry => this.ownSize(entry));
  }

  ownSize(entry) {
    const expected = this._expectedTabSizes;
    if (!expected?.has(entry.target)) return false;
    const size = entry.borderBoxSize?.[0]?.inlineSize ?? entry.contentRect.width;
    return Math.abs(size - expected.get(entry.target)) <= 0.5;
  }

  connectedCallback() {
    // The phone's width (core/js/breakpoints, md): vertical tabs become a row
    // with «Ещё», and fit auto shares the row (C96 items 5 and 7).
    if (!this._narrowMedia) {
      this._narrowMedia = (0,_core_js_breakpoints_js__WEBPACK_IMPORTED_MODULE_6__.breakpointMedia)('md', {
        below: true
      });
      this._narrow = this._narrowMedia?.matches === true;

      this._onNarrow = () => {
        const narrow = this._narrowMedia?.matches === true;
        if (narrow === this._narrow) return;
        this._narrow = narrow;
        this.requestComponentUpdate('narrow');
      };

      this._narrowMedia?.addEventListener?.('change', this._onNarrow);
    }

    super.connectedCallback?.(); // The address is read again when it changes (Back, Forward, a link to
    // #<id> on the page); the listener answers only with hash on.

    if (!this._addressListener) {
      this._addressListener = () => this.readAddress({
        person: true
      });

      globalThis.addEventListener?.('hashchange', this._addressListener);
      globalThis.addEventListener?.('popstate', this._addressListener);
    }
  }

  disconnectedCallback() {
    this._narrowMedia?.removeEventListener?.('change', this._onNarrow);
    this._narrowMedia = null;

    if (this._addressListener) {
      globalThis.removeEventListener?.('hashchange', this._addressListener);
      globalThis.removeEventListener?.('popstate', this._addressListener);
      this._addressListener = null;
    }

    this._resizeObserver?.disconnect();
    this._observed = null;
    this._observedTrigger = null;
    this._observedTabs = null;

    if (this._fontsListener) {
      document.fonts?.removeEventListener?.('loadingdone', this._fontsListener);
      this._fontsListener = null;
    }

    this._panelObserver?.disconnect();
    this._moreMenu?.close?.({
      restoreFocus: false
    });
    this._moreMenu?.remove?.();
    this._settingsMenu?.close?.({
      restoreFocus: false
    });
    this._settingsMenu?.remove?.();
    super.disconnectedCallback?.();
  }

  text(key) {
    return this.sfWord(key);
  } // The host's path id (§7.1.1, simai/ui-source#41): the tab, panel and label
  // ids are <path>--tab-<n>, --panel-<n> and --label-<n>. A module counter
  // numbered them in creation order before.


  get tabsId() {
    return (0,_core_js_instance_path__WEBPACK_IMPORTED_MODULE_3__.partId)((0,_core_js_instance_path__WEBPACK_IMPORTED_MODULE_3__.instancePath)(this, {
      kind: 'sf-tabs'
    }));
  } // ─── the page's panels (§7.2.1, §7.2.3) ───────────────────────────────────
  // <div role="tabpanel"> written inside the host, or placed there by an
  // assembly, are the panels: the same live nodes, moved into the panel row
  // and never copied. A panel with data-entry="<id>" is the panel of that
  // entry; the others follow in order. A closed one carries `hidden`, so a
  // part with start opened inside it starts when its tab opens.
  // The panels a page adds later are watched while the element is in the
  // page (§7.7): the watch stops when it is taken out and starts again, with
  // the panels added meanwhile, when it is placed again.


  captureSlotTemplates() {
    const first = !this._slotTemplatesCaptured;
    super.captureSlotTemplates();
    if (first) this.notePanelSlots();

    if (first) {
      this.capturePagePanels();

      if (typeof MutationObserver === 'function') {
        this._panelObserver = new MutationObserver(() => {
          if (this.capturePagePanels()) this.requestComponentUpdate('panels');
        });
      }
    } else if (this.capturePagePanels()) {
      this.requestComponentUpdate('panels');
    }

    this._panelObserver?.observe(this, {
      childList: true
    });
  } // A panel slot whose host carried only its slot attribute -- <p
  // slot="panel-0"> -- gives the panel its children, and the host is dropped
  // (the base unwraps it). The panel the content goes into carries that slot
  // name instead, so a page that finds its panel by [slot="panel-0"] after the
  // drawing still finds it (R184 T15: it got null). A host the content keeps
  // (one with other attributes) carries its own slot attribute.


  notePanelSlots() {
    this._unwrappedPanelSlots = new Set();

    for (const [name, nodes] of this._liveSlotNodes ?? []) {
      if (!/^panel-\d+$/u.test(name)) continue;
      if (!nodes.some(node => node?.nodeType === 1 && node.getAttribute('slot') === name)) this._unwrappedPanelSlots.add(name);
    }
  } // The slot name a panel carries (see notePanelSlots), or none.


  panelSlotOf(item) {
    return this._unwrappedPanelSlots?.has(item.slotName) && this.hasSlotContent?.(item.slotName) ? item.slotName : null;
  }

  capturePagePanels() {
    const found = Array.from(this.children).filter(isPagePanel);

    for (const panel of found) {
      if (panel.hasAttribute('tabindex')) this._authoredPanelFocus.add(panel);
      panel.remove();

      this._pagePanels.push(panel);
    }

    return found.length > 0;
  } // The page's panel of an entry: by data-entry, else by place among the ones
  // without it.


  pagePanelFor(item, index) {
    if (!this._pagePanels.length) return null;

    const byEntry = this._pagePanels.find(panel => panel.getAttribute('data-entry') === item.key);

    if (byEntry) return byEntry;

    const loose = this._pagePanels.filter(panel => !panel.hasAttribute('data-entry'));

    return loose[index] ?? null;
  } // Manual activation over deferred panels (§7.2.1): a panel holding a part
  // that starts later is opened by Enter or Space, never by the arrows alone.


  get manualActivation() {
    return this._pagePanels.some(panel => panel.querySelector?.('[data-sf-start]')) || Boolean(this.querySelector?.(':scope > .sf-tabs > .sf-tabs-main-container [data-sf-start]'));
  } // The menus the tabs open («Ещё», the settings) are a step the tabs are: 1/2
  // for tabs at 1/2, 1 otherwise.


  menuSize() {
    return (this.getAttribute('size') ?? '1') === '1/2' ? '1/2' : '1';
  } // Every item an address: the row is a strip of links -- a <nav> of <a>,
  // the current one aria-current="page" -- not a tablist (owner decision C96
  // item 8; R184 T4: a tab with href was a role=tab button that promised a
  // panel and had no link to open in a new tab).


  get links() {
    const items = this.computedItems;
    return items.length > 0 && items.every(item => item.href);
  }

  syncTabSemantics() {
    if (this.links) {
      this.syncLinkSemantics();
      return;
    }

    const items = this.computedItems;
    const shown = new Set(this.displayItems.map(item => item.index));
    const tabStop = items.find(item => item.selected && !item.disabled && shown.has(item.index)) || items.find(item => !item.disabled && shown.has(item.index));
    const tabsId = this.tabsId;
    this.tabTargets.forEach((tab, index) => {
      const item = items[index];
      if (!tab || !item) return;
      if (item.href && item.selected) tab.setAttribute('aria-current', 'page');else tab.removeAttribute?.('aria-current');
      tab.id = `${tabsId}--tab-${index}`;
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-controls', this.pagePanelFor(item, index)?.id || `${tabsId}--panel-${index}`);
      tab.setAttribute('aria-selected', item.selected ? 'true' : 'false');
      tab.setAttribute('aria-disabled', item.disabled ? 'true' : 'false');
      const label = tab.querySelector(':scope > .sf-button-text-container');

      if (label) {
        // Preserve authored text slots while excluding decorative icon ligatures
        // from the name. Icon-only buttons receive item.label in the template.
        label.id = `${tabsId}--label-${index}`;
        tab.setAttribute('aria-labelledby', label.id);
      } else if (item.label) {
        // An icon-only tab is named on its inner button. On the sf-icon-button
        // host the name would make the host a named node inside the tablist,
        // where only tabs are allowed, and the tab itself would stay unnamed.
        tab.setAttribute('aria-label', item.label);
      }

      tab.tabIndex = item === tabStop ? 0 : -1;
    });
  } // A strip of links: no tab roles and no roving tab stop; the current link
  // says aria-current="page". A disabled link is sf-button's: no href,
  // aria-disabled.


  syncLinkSemantics() {
    const items = this.computedItems;
    this.tabTargets.forEach((link, index) => {
      const item = items[index];
      if (!link || !item) return;

      for (const name of ['role', 'aria-controls', 'aria-selected', 'aria-labelledby', 'tabindex']) {
        if (name === 'role' && link.getAttribute('role') === 'link') continue;
        link.removeAttribute(name);
      }

      if (link.localName !== 'a') link.removeAttribute('aria-disabled');
      if (item.disabled) link.setAttribute('aria-disabled', 'true');
      if (item.selected) link.setAttribute('aria-current', 'page');else link.removeAttribute('aria-current');
      if (!link.querySelector(':scope > .sf-button-text-container') && item.label) link.setAttribute('aria-label', item.label);
    });
  }

  ownedTab(event) {
    const tab = event.target?.closest?.('[data-sf-tab-index]');
    if (!(tab instanceof HTMLElement) || tab.closest('sf-tabs') !== this || tab.closest('.sf-tabs-top') !== this.tabList) return null;
    return this.tabTargets.includes(tab) ? tab : null;
  }

  getData() {
    const data = this._data;
    return data && typeof data === 'object' ? data : {
      tabs: [],
      panels: []
    };
  }

  normalizeData(data = {}) {
    const tabsSource = data.tabs || data.items || [];
    const panelsSource = data.panels || data.content || [];
    return { ...data,
      tabs: Array.isArray(tabsSource) ? tabsSource.map(normalizeTabItem).filter(Boolean) : [],
      panels: Array.isArray(panelsSource) ? panelsSource.map(normalizePanelItem).filter(Boolean) : []
    };
  }

  setData(data = {}, reason = 'data') {
    const currentData = this.getData();
    const nextData = typeof data === 'function' ? data(currentData) : data;

    if (!nextData || typeof nextData !== 'object') {
      return {
        outcome: 'refused',
        reason: 'invalid'
      };
    }

    this._data = this.normalizeData({ ...currentData,
      ...nextData
    });
    this.requestComponentUpdate(reason);
    return {
      outcome: 'applied'
    };
  }

  setItems(items = [], reason = 'items') {
    const nextItems = typeof items === 'function' ? items(this.dataTabs) : items;
    return this.setData({
      tabs: Array.isArray(nextItems) ? nextItems : []
    }, reason);
  }

  addItems(items = [], reason = 'items') {
    const nextItems = Array.isArray(items) ? items : [items];
    return this.setItems(currentItems => [...currentItems, ...nextItems.filter(Boolean)], reason);
  }

  setPanels(panels = [], reason = 'panels') {
    const nextPanels = typeof panels === 'function' ? panels(this.dataPanels) : panels;
    return this.setData({
      panels: Array.isArray(nextPanels) ? nextPanels : []
    }, reason);
  }

  addPanels(panels = [], reason = 'panels') {
    const nextPanels = Array.isArray(panels) ? panels : [panels];
    return this.setPanels(currentPanels => [...currentPanels, ...nextPanels.filter(Boolean)], reason);
  }

  get items() {
    return this.getProp('items');
  } // A list setting is a property (§4, §16 item 42): the list given here wins
  // until the attribute is written again.


  set items(value) {
    if (!this.__sfManifestData) this.__sfManifestData = {};
    this.__sfManifestData.items = value;
    if (this.hasAttribute('items')) this.removeAttribute('items');else this.requestComponentUpdate('items');
  }

  get dataTabs() {
    const data = this.getData();
    return Array.isArray(data.tabs) ? data.tabs : [];
  }

  get dataPanels() {
    const data = this.getData();
    return Array.isArray(data.panels) ? data.panels : [];
  }

  get panelSlotNames() {
    const names = new Set();
    [this._slotTemplates, this._liveSlotNodes].forEach(storage => {
      if (!storage) return;
      storage.forEach((_, name) => {
        if (/^panel-\d+$/.test(name)) {
          names.add(name);
        }
      });
    });
    return Array.from(names).sort((a, b) => {
      return (0,_core_js_smart_base__WEBPACK_IMPORTED_MODULE_1__.toNumber)(a.replace('panel-', ''), 0) - (0,_core_js_smart_base__WEBPACK_IMPORTED_MODULE_1__.toNumber)(b.replace('panel-', ''), 0);
    });
  }

  get tabCount() {
    return Math.max(this.dataTabs.length, this.dataPanels.length, this.items.length, this.panelSlotNames.length, this._pagePanels.filter(panel => !panel.hasAttribute('data-entry')).length);
  }

  get computedItems() {
    const items = this.dataTabs.length ? this.dataTabs : this.items;
    const panels = this.dataPanels;
    const activeIndex = this.activeIndex;
    return Array.from({
      length: this.tabCount
    }).map((_, index) => {
      const item = items[index] || {};
      const own = String(item.id ?? item.key ?? index);
      const errors = Number(this._errors?.has(own) ? this._errors.get(own) : item.errors);
      return { ...item,
        // A tab without a label is named in the page's language (R184 T14:
        // the English «Tab N» on every page).
        label: item.label || this.sfWord('tab', {
          vars: {
            n: index + 1
          }
        }),
        // The entry's id (§16 item 42); key is its old name.
        key: String(item.id ?? item.key ?? index),
        // The errors in the tab's panel (C96 item 6): a count on the tab, said
        // with its name.
        errors: Number.isFinite(errors) && errors > 0 ? Math.floor(errors) : 0,
        pinned: Boolean(item.pinned),
        count: item.count ?? null,
        href: item.href || '',
        disabled: Boolean(item.disabled),
        // A short text in a tooltip on the tab; for a disabled one, why it is
        // off (R184 T9).
        hint: item.hint ? String(item.hint) : '',
        icon: item.icon || '',
        iconStart: item.iconStart ?? (item.iconLeft || item.icon || ''),
        iconEnd: item.iconEnd ?? (item.iconRight || ''),
        iconLeft: item.iconStart ?? (item.iconLeft || item.icon || ''),
        iconRight: item.iconEnd ?? (item.iconRight || ''),
        component: item.component || null,
        panel: panels[index] || null,
        index,
        slotName: item.slotName || `panel-${index}`,
        tabSlotName: item.tabSlotName || `tab-${index}`,
        selected: index === activeIndex
      };
    });
  }

  get activeIndex() {
    // `selected` names the entry by its id (§7.2.3 values.selected).
    const selectedId = this.getAttribute('selected');

    if (selectedId) {
      const items = this.dataTabs.length ? this.dataTabs : this.items;
      const at = items.findIndex((item, index) => String(item?.id ?? item?.key ?? index) === selectedId);
      if (at >= 0) return at;
    }

    const rawValue = this.getAttribute('active-index') || this.getAttribute('active') || this.getAttribute('data-active-index') || 0;
    return normalizeIndex(rawValue, Math.max(this.tabCount, 1));
  }

  set activeIndex(value) {
    this.setAttribute('active-index', String((0,_core_js_smart_base__WEBPACK_IMPORTED_MODULE_1__.toNumber)(value, 0)));
  } // The selected entry's id (§4 values): writing it selects that tab and is
  // not reported (§8).


  get selected() {
    return this.computedItems[this.activeIndex]?.key ?? '';
  }

  set selected(value) {
    if (value === null || value === undefined || value === '') this.removeAttribute('selected');else this.setAttribute('selected', String(value));
  } // The look drawn (C96 item 1): line unless pills or vertical; vertical on a
  // phone is the line with «Ещё» (item 5). type="full" is the line with fit
  // always; no type and the scheme fills draw the line.


  get look() {
    const type = this.getAttribute('type');
    if (type === 'pills') return 'pills';
    if (type === 'vertical') return this._narrow ? 'underline' : 'vertical';
    return 'underline';
  }

  get fit() {
    const value = this.getAttribute('fit');
    if (FITS.includes(value)) return value;
    return this.getAttribute('type') === 'full' ? 'always' : 'auto';
  } // The retired looks, each noted once per element (SF.deprecations).


  noteRetiredLooks() {
    const type = this.getAttribute('type');
    const scheme = this.getAttribute('scheme');
    const notes = [];
    if (type === 'full') notes.push({
      attribute: 'type',
      from: 'full',
      to: 'underline'
    });
    if (scheme === 'outline' || scheme === 'link') notes.push({
      attribute: 'scheme',
      from: scheme,
      to: null
    });
    this._retiredNoted ??= new Set();

    for (const note of notes) {
      const key = `${note.attribute}=${note.from}`;
      if (this._retiredNoted.has(key)) continue;

      this._retiredNoted.add(key);

      (0,_core_js_deprecations__WEBPACK_IMPORTED_MODULE_7__.noteDeprecated)({
        component: 'sf-tabs',
        tag: 'sf-tabs',
        kind: 'value',
        ...note,
        ...RETIRED
      });
    }
  } // fit: the tabs share the row equally (C96 item 7).


  fitsEqually(count) {
    const fit = this.fit;
    if (fit === 'never' || this.look === 'vertical') return false;
    return fit === 'always' ? count > 1 : Boolean(this._narrow) && count >= 2 && count <= 4;
  }

  get overflow() {
    const value = this.getAttribute('overflow');
    return OVERFLOWS.includes(value) ? value : 'more';
  }

  get configurable() {
    return this.getBooleanAttr('configurable', false);
  }

  get lazy() {
    return this.getBooleanAttr('lazy', false);
  }

  get hash() {
    return this.getBooleanAttr('hash', false);
  }

  get sticky() {
    return this.getBooleanAttr('sticky', false);
  } // ─── the address (hash) ────────────────────────────────────────────────────
  // The tab the address names: #<id> of an item, or #<id> of an element
  // inside one of the panels (a link to a section of a closed tab opens it).


  addressedIndex() {
    const raw = globalThis.location?.hash?.slice(1);
    if (!raw) return null;
    let id = raw;

    try {
      id = decodeURIComponent(raw);
    } catch {
      /* the hash as written */
    }

    const items = this.computedItems;
    const at = items.findIndex(item => item.key === id);
    if (at >= 0) return at;
    const target = globalThis.document?.getElementById?.(id);
    const panel = target?.closest?.('[data-sf-tab-panel]');
    if (panel && panel.closest('sf-tabs') === this) return Number(panel.dataset.sfTabPanel);
    return null;
  } // On the first drawing the address selects without a change (as the
  // selected attribute does); Back, Forward and a #link are the person's.


  readAddress({
    person
  }) {
    if (!this.hash || this.links) return;
    const index = this.addressedIndex();
    if (index === null || index === this.activeIndex) return;
    this.selectTab(index, {
      person,
      fromAddress: true
    });
  } // A tab the person chose is a new entry of the history, so Back returns
  // to the previous tab; the path and the query stay.


  writeAddress(item) {
    if (!this.hash || this.links || !globalThis.history?.pushState || !globalThis.location) return;
    const next = `#${encodeURIComponent(item.key)}`;
    if (globalThis.location.hash === next) return;
    globalThis.history.pushState(globalThis.history.state, '', `${globalThis.location.pathname}${globalThis.location.search}${next}`);
  } // ─── the panels: drawn when opened (lazy), a tab stop when nothing in them is
  // A panel is drawn unless lazy and never opened; the open one is drawn.


  panelDrawn(item) {
    return !this.lazy || item.selected || this._openedPanels.has(item.key);
  } // A panel is a tab stop of its own only when nothing in it takes the focus
  // (APG tabs; R184 T8: every panel was, even one that starts with a field).
  // A page's panel written with a tabindex keeps it.


  syncPanelFocus() {
    const links = this.links;

    for (const panel of this.drawnPanels()) {
      if (this._authoredPanelFocus.has(panel)) continue;
      if (links || panel.querySelector(FOCUSABLE)) panel.removeAttribute('tabindex');else panel.setAttribute('tabindex', '0');
    }
  }

  schedulePanelFocus() {
    if (this._panelFocusQueued) return;
    this._panelFocusQueued = true;
    queueMicrotask(() => {
      this._panelFocusQueued = false;
      this.syncPanelFocus();
    });
  } // callback() once the panel of this item is drawn: now, or after the
  // drawing that draws a lazy panel opened for the first time.


  whenPanelDrawn(item, callback) {
    if (this.panelDrawn({ ...item,
      selected: false
    })) {
      callback();
      return;
    }

    const drawn = event => {
      if (event.target !== this) return;
      this.removeEventListener('sf-after-render', drawn);
      callback();
    };

    this.addEventListener('sf-after-render', drawn);
  } // ─── the person's arrangement ─────────────────────────────────────────────
  // {order: [keys], hidden: [keys]}, kept by the host. A key the items no
  // longer have is ignored; an item the order does not name follows, visible,
  // in its declared place; a pinned tab is never hidden.


  get settings() {
    return {
      order: [...this._settings.order],
      hidden: [...this._settings.hidden]
    };
  }

  set settings(value) {
    this.setSettings(value);
  }

  setSettings(settings = {}) {
    const order = Array.isArray(settings?.order) ? settings.order.map(String) : [];
    const hidden = Array.isArray(settings?.hidden) ? settings.hidden.map(String) : [];
    this._settings = {
      order,
      hidden
    };
    this.requestComponentUpdate('settings');
    this.renderSettingsList();
    return this;
  } // The tabs as the person arranged them: in their order, without the hidden
  // ones -- except the active one, which is shown in place while it is active,
  // so a panel never stands without its tab.


  get displayItems() {
    const hidden = new Set(this._settings.hidden);
    return this.arrangedItems.filter(item => item.pinned || item.selected || !hidden.has(item.key));
  } // The arrangement as the settings list shows it: every tab, in order.
  // Pinned tabs stay first, in their declared order, whatever the stored
  // order says: the person arranges the others after them (docs trial 5: a
  // pinned tab could be dragged and overtaken).


  get arrangedItems() {
    const items = this.computedItems;
    const byKey = new Map(items.map(item => [item.key, item]));
    const ordered = items.filter(item => item.pinned);

    for (const key of this._settings.order) {
      const item = byKey.get(key);
      if (item && !ordered.includes(item)) ordered.push(item);
    }

    for (const item of items) if (!ordered.includes(item)) ordered.push(item);

    return ordered;
  }

  changeSettings(next, reason) {
    // A pinned tab is never hidden, so it is not said to be.
    const pinned = new Set(this.computedItems.filter(item => item.pinned).map(item => item.key));
    this._settings = {
      order: next.order.map(String),
      hidden: next.hidden.map(String).filter(key => !pinned.has(key))
    };
    this.requestComponentUpdate('settings');
    this.renderSettingsList();
    this.sfEmit('settings-change', { ...this.settings,
      reason
    });
  }

  resetSettings() {
    this._settings = {
      order: [],
      hidden: []
    };
    this.requestComponentUpdate('settings-reset');
    this.renderSettingsList();
    this.sfEmit('settings-reset', {});
  } // ─── «Ещё» ────────────────────────────────────────────────────────────────


  scheduleOverflow() {
    if (this._overflowFrame) return;
    this._overflowFrame = requestAnimationFrame(() => {
      this._overflowFrame = 0;
      this.layoutOverflow();
    });
  } // Now, in place of the frame asked for: from the resize observer, whose
  // callback runs before the paint.


  layoutOverflowNow() {
    if (this._overflowFrame) {
      cancelAnimationFrame(this._overflowFrame);
      this._overflowFrame = 0;
    }

    this.layoutOverflow();
  }

  layoutOverflow() {
    const list = this.tabList;
    const more = this.querySelector(':scope > .sf-tabs > .sf-tabs-top-container > .sf-tabs-more');
    if (!list) return;
    const hosts = Array.from(list.children).filter(element => Number.isInteger(tabIndexOf(element)));

    for (const host of hosts) host.classList.remove('sf-tabs-overflowed', 'sf-tabs-squeezed');

    this._overflowed = [];
    const container = list.parentElement; // The tabs are measured at their own widths; fit shares the row after.

    container?.removeAttribute('data-sf-tabs-fit');

    const showMore = shown => {
      if (shown) container?.setAttribute('data-sf-tabs-more', '');else container?.removeAttribute('data-sf-tabs-more');
    };

    if (this.overflow !== 'more' || this.look === 'vertical') {
      showMore(false);
      this._expectedTabSizes = null;
      return;
    }

    const width = host => tabBox(host)?.getBoundingClientRect().width ?? 0;

    const widths = hosts.map(width);
    const gap = parseFloat(getComputedStyle(list).columnGap) || 0; // The row's arithmetic is the shared row engine (core/js/overflow-row.js,
    // taken out of these tabs for sf-contents' bar): the tabs in their order
    // up to the first that does not fit, each whole in the row or in «Ещё»
    // (owner decision C54); the room is the row's content box in fractional
    // pixels (rowRoom: clientWidth is a whole pixel, C54 return).

    const room = () => (0,_core_js_overflow_row_js__WEBPACK_IMPORTED_MODULE_8__.rowRoom)(list);

    showMore(false);
    this.syncMoreErrors(more, 0);
    let kept = (0,_core_js_overflow_row_js__WEBPACK_IMPORTED_MODULE_8__.fitInOrder)(widths, gap, room()); // A shared row gives the first and the last tab back the padding of their
    // outer edges, which a row of their own widths leaves off (owner decision
    // C99, TS-5 and TS-7): the tabs share the row only when they fit with it.

    const edgesBack = () => {
      const first = tabBox(hosts[0]);
      const last = tabBox(hosts[hosts.length - 1]);
      if (!first || !last || first === last) return 0;
      const start = getComputedStyle(first);
      const end = getComputedStyle(last);

      const back = (style, outer, inner) => Math.max(0, (parseFloat(style[inner]) || 0) - (parseFloat(style[outer]) || 0));

      return back(start, 'paddingInlineStart', 'paddingInlineEnd') + back(end, 'paddingInlineEnd', 'paddingInlineStart');
    };

    if (!kept && this.fitsEqually(hosts.length) && !(0,_core_js_overflow_row_js__WEBPACK_IMPORTED_MODULE_8__.fitInOrder)(widths, gap, room() - edgesBack())) {
      // Every tab fits: they share the row, each at least its own width. The
      // shared widths are what the observer will report, not a change.
      container?.setAttribute('data-sf-tabs-fit', '');
      this.expectTabSizes(hosts, hosts.map(width), null);
    } else if (!kept) this.expectTabSizes(hosts, widths, null);

    if (kept) {
      showMore(true);
      const items = this.computedItems; // The pinned tabs and the current one always stay in the row (docs
      // trial 5; the C54 return D1: a pinned tab gives way to the current one,
      // the last pinned first).

      const must = hosts.map((host, at) => at).filter(at => {
        const index = tabIndexOf(hosts[at]);
        return index === this.activeIndex || items[index]?.pinned === true;
      });
      const current = hosts.findIndex(host => tabIndexOf(host) === this.activeIndex); // «Ещё (n)» draws its new count a task later, and the digits are not of
      // one width (C54 return D2): the room is taken with the width the
      // trigger will have with the count it gets, measured in its text face.

      const label = count => `${this.text('more')} (${count})`;

      const textBox = more?.querySelector(':scope > button .sf-button-text-container');

      const place = () => {
        const laid = (0,_core_js_overflow_row_js__WEBPACK_IMPORTED_MODULE_8__.fitBesideMore)({
          widths,
          gap,
          room: room(),
          must,
          current,
          extra: (0,_core_js_overflow_row_js__WEBPACK_IMPORTED_MODULE_8__.triggerExtra)(textBox, label)
        });
        this._overflowed = hosts.filter((_, at) => !laid.kept.includes(at)).map(host => tabIndexOf(host));
        return laid;
      };

      let laid = place(); // The errors of the tabs «Ещё» holds are summed on it (owner decision
      // C96 item 6): a badge after its label widens the trigger, so the row
      // is laid out once more with it drawn, in the same task -- the observer
      // sees one layout, not an echo. Less room only moves more tabs into
      // «Ещё», so the sum stays above 0 and a third pass is not needed.

      if (this.syncMoreErrors(more, this.errorsOf(this._overflowed))) {
        laid = place();
        this.syncMoreErrors(more, this.errorsOf(this._overflowed));
      }

      kept = laid.kept; // The current tab alone is wider than the row: it alone may be
      // shortened, with an ellipsis; every other tab is whole or in «Ещё».

      if (laid.squeezed >= 0) hosts[laid.squeezed].classList.add('sf-tabs-squeezed');
      hosts.forEach((host, at) => {
        // A class, not a data attribute: sf-button moves its data attributes
        // to the button inside it, and only class and style stay on the host.
        if (!kept.includes(at)) host.classList.add('sf-tabs-overflowed');
      });
      this.expectTabSizes(hosts, widths, kept);

      if (more) {
        const text = label(this._overflowed.length);
        const errors = this.errorsOf(this._overflowed);
        more.setAttribute('text', text); // The badge is aria-hidden: the name says the errors, as a tab does
        // («Ещё (3), 2 ошибки»).

        more.setAttribute('aria-label', errors ? `${text}, ${this.errorWords(errors)}` : text);
      }
    }
  } // The errors of some tabs, by index: what «Ещё» sums.


  errorsOf(indices = []) {
    const items = this.computedItems;
    return indices.reduce((sum, index) => sum + (items[index]?.errors || 0), 0);
  } // The errors badge after the «Ещё» label (C96 item 6): the class form of
  // sf-badge line="text" (component.badges, C95 point 6), so it is drawn and
  // measured at once. Written into the trigger's button, after its text box,
  // outside the button's own drawn parts. Says whether its width changed.


  syncMoreErrors(more, errors) {
    const button = more?.querySelector(':scope > button');
    if (!button) return false;
    let badge = button.querySelector(':scope > .sf-tabs-more-errors');
    const before = badge ? badge.getBoundingClientRect().width : 0;

    if (!errors) {
      badge?.remove();
      return before > 0;
    }

    if (!badge) {
      badge = document.createElement('span');
      badge.setAttribute('aria-hidden', 'true');
      badge.append(document.createElement('span'));
      badge.firstChild.className = 'sf-badge-text-container flex items-center';
      badge.firstChild.append(document.createElement('span'));
      badge.firstChild.firstChild.className = 'sf-badge-text';
      const text = button.querySelector(':scope > .sf-button-text-container');
      if (text) text.after(badge);else button.append(badge);
    }

    badge.className = `${(0,_js_templates_default__WEBPACK_IMPORTED_MODULE_9__.errorBadgeClasses)(errors)} sf-tabs-more-errors`;
    badge.querySelector('.sf-badge-text').textContent = String(errors);
    return badge.getBoundingClientRect().width !== before;
  }

  async openMore(anchor) {
    const items = this.computedItems;
    const entries = (this._overflowed ?? []).map(index => items[index]).filter(Boolean).map(item => ({
      id: String(item.index),
      text: item.label,
      icon: item.icon || undefined,
      disabled: item.disabled,
      value: item.count === null || item.count === undefined ? undefined : String(item.count)
    }));
    if (!entries.length) return;
    const menu = await this.standardMenu('_moreMenu', id => this.activate(Number(id), null, {
      person: true
    }));
    menu.setAttribute('aria-label', this.text('more'));
    menu.setAttribute('size', this.menuSize());
    (0,_core_js_density_js__WEBPACK_IMPORTED_MODULE_5__.followDensity)(menu, this);
    menu.entries = entries;
    menu.toggleFor(anchor);
  } // The standard menu «Ещё» and the settings open (core/js/overflow-row.js).


  standardMenu(field, select) {
    return (0,_core_js_overflow_row_js__WEBPACK_IMPORTED_MODULE_8__.standardMenu)(this, field, select);
  } // A tab chosen anywhere -- its own button, «Ещё» -- is activated the same
  // way; a tab that is a link goes to its address.


  activate(index, event = null, {
    person = true
  } = {}) {
    const item = this.computedItems[index];
    if (!item || item.disabled) return; // A link of the strip pressed by the person: the browser follows it (and
    // opens it in a new tab with a modifier); the strip only marks it current.

    if (item.href && event?.target?.closest?.('a[href]') && this.links) {
      if (!(event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)) this.selectTab(index, {
        person
      });
      return;
    }

    if (item.href) {
      if (event && (event.metaKey || event.ctrlKey || event.shiftKey || event.button === 1)) {
        globalThis.open?.(item.href, '_blank', 'noopener');
        return;
      }

      this.selectTab(index, {
        person
      });
      if (globalThis.location && item.href !== globalThis.location.href) globalThis.location.assign(item.href);
      return;
    }

    this.selectTab(index, {
      person
    });
  } // ─── the settings ─────────────────────────────────────────────────────────


  async openSettings(anchor) {
    const menu = await this.settingsMenu();
    menu.setAttribute('size', this.menuSize());
    (0,_core_js_density_js__WEBPACK_IMPORTED_MODULE_5__.followDensity)(menu, this);
    this.renderSettingsList();
    menu.toggleFor(anchor, {
      width: 'content'
    });
  }

  async settingsMenu() {
    if (this._settingsMenu?.isConnected) return this._settingsMenu; // The list's elements are asked for now, not waited for: the Loader also
    // finds them in the menu once it is drawn.

    globalThis.SF?.Loader?.ensure?.(['sf-sortable', 'sf-checkbox']);
    await globalThis.SF?.Loader?.ensure?.(['sf-menu-context']);
    const menu = document.createElement('sf-menu-context');
    menu.setAttribute('popup', '');
    menu.setAttribute('aria-label', this.text('customize'));
    menu.setAttribute('role', 'dialog');
    const body = document.createElement('div');
    body.slot = 'content';
    body.className = 'sf-context-menu-body sf-tabs-settings-body';
    const reset = document.createElement('sf-button');
    reset.slot = 'footer';
    reset.setAttribute('appearance', 'outline');
    reset.setAttribute('scheme', 'on-surface');
    reset.setAttribute('size', this.menuSize());
    reset.setAttribute(_core_js_density_js__WEBPACK_IMPORTED_MODULE_5__.RELATIVE, '');
    reset.setAttribute('text', this.text('reset'));
    reset.addEventListener('click', () => this.resetSettings());
    menu.append(body, reset);
    (this.closest('dialog[open]') || document.body).append(menu);
    this._settingsMenu = menu;
    this._settingsBody = body;
    return menu;
  }

  renderSettingsList() {
    const body = this._settingsBody;
    if (!body) return;
    const items = this.arrangedItems;
    const hidden = new Set(this._settings.hidden);
    const size = this.menuSize(); // Only the tabs that are not pinned are sortable items, so the index the
    // list reports counts among them; the pinned ones lead.

    const pinnedKeys = items.filter(entry => entry.pinned).map(entry => entry.key);

    const onIntent = event => {
      const {
        item,
        index
      } = event.detail ?? {};
      const keys = items.filter(entry => !entry.pinned).map(entry => entry.key);
      const from = keys.indexOf(String(item));
      if (from < 0) return;
      keys.splice(from, 1);
      keys.splice(Math.max(0, Math.min(index, keys.length)), 0, String(item));
      this.changeSettings({
        order: [...pinnedKeys, ...keys],
        hidden: [...hidden]
      }, 'order');
    };

    const toggle = (key, shown) => {
      const next = new Set(hidden);
      if (shown) next.delete(key);else next.add(key);
      this.changeSettings({
        order: items.map(entry => entry.key),
        hidden: [...next]
      }, 'visibility');
    };

    this.drawInto((0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
      <sf-sortable class="sf-tabs-settings-list" group="sf-tabs-settings" label=${this.text('customize')}
                   @sf-sortable-move=${onIntent}>
        ${items.map(item => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
          <div class=${item.pinned ? 'sf-tabs-settings-row sf-tabs-settings-row--pinned' : 'sf-tabs-settings-row'}
               data-sf-sortable-item=${item.pinned ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : item.key}>
            ${item.pinned ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-tabs-settings-handle" aria-hidden="true"></span>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-tabs-settings-handle" data-sf-sortable-handle aria-hidden="true"><i class="sf-icon">drag_indicator</i></span>`}
            <span class="sf-tabs-settings-label">${item.label}</span>
            ${item.pinned ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class="sf-icon sf-tabs-settings-pin" title=${this.text('pinned')} aria-label=${this.text('pinned')}>push_pin</i>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-checkbox size=${size} .checked=${!hidden.has(item.key)} aria-label=${`${this.text('visible')}: ${item.label}`}
                       @change=${event => toggle(item.key, Boolean(event.target?.checked ?? event.detail?.checked))}></sf-checkbox>`}
          </div>`)}
      </sf-sortable>`, body);
  }

  templateContext() {
    const props = this.getPropsContext();
    this.noteRetiredLooks(); // The open panel is drawn now and kept drawn (lazy).

    const open = this.computedItems[this.activeIndex];
    if (open) this._openedPanels.add(open.key);
    return this.createTemplateContext({ ...props,
      component: this,
      tabsId: this.tabsId,
      pagePanel: (item, index) => this.pagePanelFor(item, index),
      panelSlot: item => this.panelSlotOf(item),
      panelDrawn: item => this.panelDrawn(item),
      activeIndex: this.activeIndex,
      displayItems: this.displayItems,
      overflow: this.overflow,
      configurable: this.configurable,
      links: this.links,
      sticky: this.sticky,
      look: this.look,
      // The scheme fills are retired (C96 item 1): the tabs' buttons take one
      // look, and the tabs' sheet draws line, plate or column on it.
      scheme: 'default',
      errorWords: count => this.errorWords(count),
      moreText: this.text('more'),
      customizeText: this.text('customize'),
      rootClass: this.getRootClass(),
      items: this.computedItems,
      data: this.getData()
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_9__.renderTabsTemplate)(this.templateContext());
  }

  get state() {
    const props = this.getPropsContext();
    return { ...props,
      activeIndex: this.activeIndex,
      items: this.items,
      data: this.getData(),
      rootClass: this.getRootClass()
    };
  }

  setState(nextState = {}) {
    Object.entries(nextState || {}).forEach(([key, value]) => {
      const attr = (0,_core_js_smart_base__WEBPACK_IMPORTED_MODULE_1__.toAttributeName)(key);

      if (!attr) {
        return;
      }

      if (value === false || value === null || value === undefined || value === '') {
        this.removeAttribute(attr);
        return;
      }

      if (Array.isArray(value)) {
        const serialized = value.map(item => {
          if (typeof item === 'string') {
            return item;
          }

          const flags = [];

          if (item?.disabled) {
            flags.push('disabled');
          }

          if (item?.icon) {
            flags.push(`icon=${item.icon}`);
          }

          if (item?.iconLeft) {
            flags.push(`icon-left=${item.iconLeft}`);
          }

          if (item?.iconRight) {
            flags.push(`icon-right=${item.iconRight}`);
          }

          if (item?.iconStart !== undefined && item?.iconStart !== null) {
            flags.push(`icon-start=${item.iconStart}`);
          }

          if (item?.iconEnd !== undefined && item?.iconEnd !== null) {
            flags.push(`icon-end=${item.iconEnd}`);
          }

          return flags.length ? `${item.label}::${flags.join(',')}` : item.label;
        }).join('|');
        this.setAttribute(attr, serialized);
        return;
      }

      this.setAttribute(attr, value === true ? '' : String(value));
    });
    return this;
  } // The errors in each panel, by entry id ({profile: 0, access: 2}): the
  // tabs show the count and say it with the tab's name (C96 item 6). An id
  // not given keeps the item's own errors.


  setErrors(errors = {}) {
    this._errors = new Map(Object.entries(errors && typeof errors === 'object' ? errors : {}).map(([key, value]) => [String(key), Number(value) || 0]));
    this.requestComponentUpdate('errors');
    return this;
  } // The action go-to-error (C96 item 6): opens the first tab, in the order
  // the tabs stand, with an error and focuses the first wrong field in its
  // panel, as a form's Save does after a failed check. Not reported (§8).


  goToError() {
    const target = this.arrangedItems.find(item => item.errors > 0 && !item.disabled);
    if (!target) return {
      outcome: 'refused',
      reason: 'no-errors'
    };
    if (target.index !== this.activeIndex) this.selectTab(target.index, {
      person: false
    });
    this.whenPanelDrawn(target, () => {
      const panel = this.drawnPanels().find(one => Number(one.dataset.sfTabPanel) === target.index);
      const field = panel?.querySelector(INVALID);
      if (!field) return;
      const own = field.matches('input, select, textarea, button, [tabindex], [contenteditable]') ? field : field.querySelector('input, select, textarea, [contenteditable], [tabindex]:not([tabindex="-1"])');
      (own ?? field).focus?.();
    });
    return {
      outcome: 'applied'
    };
  }

  errorWords(count) {
    return this.sfWord('errors', {
      count,
      vars: {
        n: count
      }
    });
  } // The action go-to {index} (§4.4): selects the tab and answers an outcome.
  // It reports nothing: `change` is what a person did (§8).


  goTo(index) {
    return this.selectTab(index?.index ?? index, {
      person: false
    });
  }

  selectTab(index, {
    person = false,
    fromAddress = false
  } = {}) {
    const items = this.computedItems;
    const requested = (0,_core_js_smart_base__WEBPACK_IMPORTED_MODULE_1__.toNumber)(index, Number.NaN);

    if (!Number.isInteger(requested) || requested < 0 || requested >= items.length) {
      return {
        outcome: 'refused',
        reason: 'out-of-range'
      };
    }

    const item = items[requested];
    if (item.disabled) return {
      outcome: 'refused',
      reason: 'disabled'
    };
    if (requested === this.activeIndex) return {
      outcome: 'refused',
      reason: 'current'
    };
    const previous = this.activeIndex; // The attribute the page uses keeps being the one written.

    if (this.hasAttribute('selected')) this.setAttribute('selected', item.key);else this.setAttribute('active-index', String(requested)); // The page sees the new selection in the change's handler: the tabs say
    // aria-selected and the panels are shown or hidden now, not at the next
    // drawing (R184 T12: in the handler the previous tab was still selected
    // and the new panel hidden, so a field in it could not take the focus).

    this.showSelection();
    if (person && !fromAddress) this.writeAddress(item);

    if (person) {
      const detail = {
        selected: item.key,
        previous,
        current: requested,
        item,
        items
      }; // A lazy panel opened for the first time is drawn first.

      this.whenPanelDrawn(item, () => this.sfEmit('change', detail));
    }

    return {
      outcome: 'applied'
    };
  } // The selection written on the drawn tabs and panels at once; the next
  // drawing writes the same.


  showSelection() {
    this.syncTabSemantics();
    const active = this.activeIndex;

    for (const host of Array.from(this.tabList?.children || [])) {
      const index = tabIndexOf(host);
      if (!Number.isInteger(index)) continue;
      const box = tabBox(host);
      box?.classList?.toggle('selected', index === active);
    }

    for (const panel of this.drawnPanels()) {
      const selected = Number(panel.dataset.sfTabPanel) === active;
      panel.hidden = !selected;
      panel.classList.toggle('selected', selected);
    }
  }

  drawnPanels() {
    return Array.from(this.querySelectorAll(':scope > .sf-tabs > .sf-tabs-main-container > [data-sf-tab-panel]'));
  } // The old name keeps its old detail (§16.20 split row): the element and its
  // template were in it.


  sfAliasAdapters() {
    return {
      'sf-tab-change': detail => ({
        component: this,
        tagName: this.componentTagName,
        template: this.componentTemplateName,
        ...detail
      })
    };
  }

  onTabChange(handler, options) {
    if (typeof handler === 'function') {
      this.addEventListener(this.sfEventName('change'), event => {
        handler(event.detail?.current, event.detail, event);
      }, options);
    }

    return this;
  }

  handleRootClick = event => {
    const tool = event.target?.closest?.('.sf-tabs-more, .sf-tabs-settings');

    if (tool && tool.closest('sf-tabs') === this) {
      const anchor = tool.querySelector('button') ?? tool;
      if (tool.classList.contains('sf-tabs-more')) this.openMore(anchor);else this.openSettings(anchor);
      return;
    }

    const tab = this.ownedTab(event);
    if (!tab) return;
    this.activate(Number(tab.dataset.sfTabIndex), event);
  }; // The focus on a tab; with manual activation the tab stop follows it, so Tab
  // leaves from where the person is.

  focusTab(index) {
    const target = this.tabTargets[index];
    if (!target) return; // A disabled tab with the focus holds the tab stop too, so Tab leaves the
    // row from it rather than landing on the selected tab after it.

    if (this.manualActivation || this.computedItems[index]?.disabled) {
      for (const tab of this.tabTargets) if (tab) tab.tabIndex = tab === target ? 0 : -1;
    }

    target.focus();
  } // «Ещё», when it stands: the arrows reach it after the last tab in the row
  // and leave it back to the tabs (docs trial 5: only Tab reached it).


  get moreTarget() {
    const more = this.querySelector('.sf-tabs-more');
    if (!more || more.closest('sf-tabs') !== this || more.hidden) return null; // sf-button's host is display: contents and has no box: the button is
    // what stands, or not.

    const button = more.querySelector('button');
    return button && button.getClientRects().length ? button : null;
  }

  handleRootKeyDown = event => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return; // A strip of links is walked with Tab and followed with Enter, as links are.

    if (this.links) return;
    const more = this.moreTarget;

    if (more && (event.target === more || more.contains(event.target)) && this.tabList.getAttribute('aria-orientation') !== 'vertical') {
      const rtl = getComputedStyle(this.tabList).direction === 'rtl';
      const back = event.key === (rtl ? 'ArrowRight' : 'ArrowLeft') || event.key === 'End';
      const forward = event.key === (rtl ? 'ArrowLeft' : 'ArrowRight') || event.key === 'Home';
      if (!back && !forward) return;
      const overflowed = new Set(this._overflowed ?? []);
      const shown = this.displayItems.filter(item => !overflowed.has(item.index));
      const target = back ? shown[shown.length - 1] : shown[0];
      if (!target) return;
      event.preventDefault();
      if (!this.manualActivation) this.selectTab(target.index, {
        person: true
      });
      this.syncTabSemantics();
      this.focusTab(target.index);
      return;
    }

    const tab = this.ownedTab(event); // A custom tab descriptor may contain its own input/widget. Its keys are
    // not navigation commands for this tab list.

    if (!tab || event.target !== tab) return;
    const vertical = this.tabList.getAttribute('aria-orientation') === 'vertical';
    const arrows = vertical ? ['ArrowUp', 'ArrowDown'] : ['ArrowLeft', 'ArrowRight'];
    if (!['Enter', ' ', 'Home', 'End', ...arrows].includes(event.key)) return;
    event.preventDefault();

    if (event.key === 'Enter' || event.key === ' ') {
      this.selectTab(tab.dataset.sfTabIndex, {
        person: true
      });
      return;
    }

    let direction = event.key === arrows[0] ? -1 : 1;
    if (!vertical && getComputedStyle(this.tabList).direction === 'rtl') direction *= -1; // The arrows walk the tabs in the order they stand, past the ones in
    // «Ещё» and the hidden ones. A disabled tab is reached and selects
    // nothing (R184 T9), so the person hears it and its hint.

    const overflowed = new Set(this._overflowed ?? []);
    const enabledItems = this.displayItems.filter(item => !overflowed.has(item.index));

    if (!enabledItems.length) {
      return;
    }

    const currentEnabledIndex = enabledItems.findIndex(item => item.index === Number(tab.dataset.sfTabIndex)); // Past the last tab in the row, forward, is «Ещё» when it stands.

    if (more && arrows.includes(event.key) && direction === 1 && currentEnabledIndex === enabledItems.length - 1) {
      more.focus();
      return;
    }

    const nextEnabledIndex = event.key === 'Home' ? 0 : event.key === 'End' ? enabledItems.length - 1 : (currentEnabledIndex + direction + enabledItems.length) % enabledItems.length;
    const nextIndex = enabledItems[nextEnabledIndex].index; // Over deferred panels the arrows only move the focus (§7.2.1).

    if (!this.manualActivation) this.selectTab(nextIndex, {
      person: true
    });
    this.syncTabSemantics();
    this.focusTab(nextIndex);
  };
}

SfTabs.define('sf-tabs');
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "795a53b0bbe9"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   errorBadgeClasses: () => (/* binding */ errorBadgeClasses),
/* harmony export */   renderTabsTemplate: () => (/* binding */ renderTabsTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("efa66f8927d1");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__);



function joinClasses(...tokens) {
  return tokens.flat().filter(Boolean).join(' ');
}

function renderComponent(component, owner) {
  if (!component?.type) {
    return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  }

  return owner.renderSmartElement(component.type, component.props || {});
} // The page's own panel of an entry (§7.2.1, §7.2.3): the same live node, its
// ids and `hidden` written on it, never copied or wrapped.


function placePagePanel(panel, item, context) {
  panel.id ||= `${context.tabsId}--panel-${item.index}`;
  panel.setAttribute('aria-labelledby', `${context.tabsId}--tab-${item.index}`); // Its tabindex is the tabs' to decide after the drawing (syncPanelFocus):
  // 0 only when nothing in it takes the focus.

  panel.setAttribute('data-sf-tab-panel', String(item.index));
  panel.classList.add('sf-tabs-main-tab');
  panel.classList.toggle('selected', Boolean(item.selected));
  panel.hidden = !item.selected;
  return panel;
}

function renderPanel(item, context) {
  const pagePanel = context.pagePanel?.(item, item.index);
  if (pagePanel) return placePagePanel(pagePanel, item, context); // lazy: a panel never opened is drawn empty (its id stays, for the tab's
  // aria-controls) and filled when its tab is first opened.

  const drawn = context.panelDrawn ? context.panelDrawn(item) : true;
  const panelContent = drawn && context.component?.hasSlotContent?.(item.slotName) ? context.component.getSlotContent(item.slotName) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const dataContent = !drawn ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : item.panel?.component ? renderComponent(item.panel.component, context.component) : typeof item.panel?.text !== 'undefined' ? item.panel.text : lit__WEBPACK_IMPORTED_MODULE_0__.nothing; // Beside a strip of links a panel is the current page's content, not a
  // tabpanel: no tab names it.

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div
      class=${joinClasses('sf-tabs-main-tab', item.selected ? 'selected' : '', context.panelClass)}
      role=${context.links ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : 'tabpanel'}
      id=${`${context.tabsId}--panel-${item.index}`}
      aria-labelledby=${context.links ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : `${context.tabsId}--tab-${item.index}`}
      data-sf-tab-panel=${String(item.index)}
      data-entry=${item.key}
      slot=${context.panelSlot?.(item) || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      ?hidden=${!item.selected}
    >
      ${panelContent === lit__WEBPACK_IMPORTED_MODULE_0__.nothing ? dataContent : panelContent}
    </div>
  `;
} // A disabled tab stays focusable and says aria-disabled (R184 T9: a native
// disabled button could not be reached, so nobody learnt why it was off). It
// is not the native disabled: the tabs' sheet gives the class the disabled
// look, and a press on it selects nothing. A disabled link of a strip of
// links is sf-button's disabled link: no href, aria-disabled.


function tabClasses(item) {
  return joinClasses(item.selected ? 'selected' : '', item.disabled ? 'disabled' : '');
} // The tooltip of a tab with a hint -- for a disabled tab, why it is off: the
// Framework's plain tooltip (component.tooltip), named by the tab's
// data-tooltip, which the tooltip makes the tab's description.


function hintId(item, context) {
  return `${context.tabsId}--hint-${item.index}`;
}

function renderHint(item, context) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span id=${hintId(item, context)} class="sf-tooltip sf-tooltip--dark sf-tooltip--size-1/3 sf-tabs-hint"
      hidden><span class="sf-tooltip-content"><span class="sf-tooltip-text">${item.hint}</span></span></span>`;
} // The errors of a tab's panel, or of the tabs «Ещё» holds (owner decision C96
// item 6): a badge on the line of the label (rule C95 point 6), sf-badge
// line="text" in its class form (component.badges): drawn with the tab, so the
// row measures its width at once, and no element to wait for. Tonal: the
// error container, as the count stood before.


function errorBadgeClasses(errors) {
  return joinClasses('sf-badge sf-badge--tonal sf-badge--error sf-badge--size-1/3 sf-badge--line-text', [...String(errors)].length === 1 ? 'sf-badge--figure' : '', 'inline-flex flex-row flex-nowrap justify-center items-center');
}

function renderErrorBadge(errors, className) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class=${`${errorBadgeClasses(errors)} ${className}`} aria-hidden="true"><span
      class="sf-badge-text-container flex items-center"><span class="sf-badge-text">${String(errors)}</span></span></span>`;
} // An icon tab of a strip of links (R184 T4, C96 item 8): sf-button-icon has no
// address, so the link is drawn in the icon button's class form, an <a> with
// the same classes, size and line; named by the item's label, the current one
// aria-current="page". A disabled link has no href and says aria-disabled.


function renderIconLink(item, context) {
  const size = context.size || '1';
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<a
      class=${joinClasses('sf-icon-button', `sf-icon-button--size-${size}`, 'sf-icon-button--icon', 'sf-icon-button--default', `sf-icon-button--${context.scheme || 'primary'}`, 'flex', 'items-cross-center', tabClasses(item))}
      href=${item.disabled ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : item.href}
      aria-label=${item.label}
      aria-current=${item.selected ? 'page' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      aria-disabled=${item.disabled ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      data-sf-tab-index=${String(item.index)}
      data-tab-label=${item.label}
      data-tooltip=${item.hint ? hintId(item, context) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    ><sf-icon root-class="pointer-event-none" icon=${item.iconStart || item.icon || item.iconEnd || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      weight="400" aria-hidden="true"></sf-icon></a>`;
} // A tab is marked data-sf-tab-index only (R193 DP-11): the unprefixed
// data-tab, its former name, was written for one minor (1.2.x) and is not
// written from 1.3.0 -- a page selector [data-tab] caught these buttons.
// The tab buttons are asked on their own axes (BT-1, C15): appearance="default"
// scheme="primary". sf-tabs draws one look per type whatever its retired scheme
// (owner decision C96 item 1), so the look is not taken from scheme. Before,
// the template wrote appearance="primary" scheme=<the tabs scheme>, two values
// outside sf-button's lists, and every tab fell back to default primary --
// the same classes it draws now.


function renderTab(item, context) {
  const tabContent = context.component?.hasSlotContent?.(item.tabSlotName) ? context.component.getSlotContent(item.tabSlotName) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;

  if (item.component) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
      <span
        data-sf-tab-index=${String(item.index)}
        role="tab"
        aria-label=${item.label}
        aria-selected=${item.selected ? 'true' : 'false'}
        tabindex=${item.selected ? '0' : '-1'}
      >
        <span aria-hidden="true" inert>
          ${renderComponent({ ...item.component,
      props: { ...(item.component.props || {}),
        rootClass: joinClasses(item.component.props?.rootClass || '', item.selected ? 'selected' : ''),
        disabled: item.disabled || item.component.props?.disabled || false
      }
    }, context.component)}
        </span>
      </span>
    `;
  } // The label, a count after it when the item has one, and the errors of its
  // panel (C96 item 6: the count on the error colours, said with the name --
  // «Доступ, 2 ошибки»); the tab's own slot wins. The name keeps the width
  // of its medium face, so selecting a tab, whose label alone is medium
  // (C96 item 3), moves nothing (sf-tabs-name, data-text).


  const hasCount = item.count !== null && item.count !== undefined && item.count !== '';
  const counted = tabContent === lit__WEBPACK_IMPORTED_MODULE_0__.nothing ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span slot="text" class="sf-tabs-label"><span class="sf-tabs-name" data-text=${item.label}>${item.label}</span>${hasCount ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-tabs-count">${String(item.count)}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}${item.errors ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${renderErrorBadge(item.errors, 'sf-tabs-errors')}<span class="sf-tabs-said">, ${context.errorWords?.(item.errors) ?? item.errors}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing; // A vertical tab's label starts at the start (owner decisions C96 item 5,
  // C99): sf-button centres its label unless told otherwise (text-center).

  const vertical = (context.look ?? context.type) === 'vertical';

  if (context.variant !== 'icons') {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
          <sf-button
                  appearance="default"
                  size=${context.size}
                  scheme="primary"
                  text-position=${vertical ? 'start' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                  href=${context.links ? item.href : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                  ?disabled=${Boolean(context.links && item.disabled)}
                  text=${item.label}
                  icon=${item.icon || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                  icon-start=${item.iconLeft || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                  icon-end=${item.iconRight || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                  root-class=${tabClasses(item)}
                  data-sf-tab-index=${String(item.index)}
                  data-tooltip=${item.hint ? hintId(item, context) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          >
              ${tabContent === lit__WEBPACK_IMPORTED_MODULE_0__.nothing ? counted : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span slot="text">${tabContent}</span>`}
          </sf-button>
      `;
  } else if (context.links) {
    return renderIconLink(item, context);
  } else {
    // An icon tab draws the item's icon however it was given: icon, or the
    // icon-start / icon-end of the "label::icon-start=home" form, which the
    // parser keeps as iconStart (R184 T3: the docs example drew the
    // button-icon default `add` on every tab).
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
          <sf-button-icon
                  appearance="default"
                  size=${context.size}
                  scheme="primary"
                  icon=${item.iconStart || item.icon || item.iconEnd || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                  data-tab-label=${item.label}
                  root-class=${tabClasses(item)}
                  data-sf-tab-index=${String(item.index)}
                  data-tooltip=${item.hint ? hintId(item, context) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          >
          </sf-button-icon>
      `;
  }
}

function topClasses(context) {
  return joinClasses(`sf-tabs-top flex content-main-${context.topPosition}`, (context.look ?? context.type) === 'vertical' ? 'flex-col' : '', context.topClass);
}

function renderTabs(context) {
  return (0,lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__.repeat)(context.displayItems ?? context.items, // Keyed by the tab, so a reordered tab keeps its own button: by
  // position, the buttons kept their old labels and counts while the
  // hosts' text was already the new one (docs trial 4).
  item => item.key ?? item.index, item => renderTab(item, context));
} // Every item an address (sf-tabs 1.3.0, owner decision C96 item 8): a <nav>
// of links with the same look, the current one aria-current="page"; no
// tablist, no arrows, no panels named by tabs.


function renderLinkRow(context) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<nav
          class=${topClasses(context)}
          aria-label=${context.component?.getAttribute('aria-label') || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          aria-labelledby=${context.component?.getAttribute('aria-labelledby') || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        >
          ${renderTabs(context)}
        </nav>`;
} // A strip of links draws its panel row only when a panel has content.


function hasPanelContent(context) {
  return context.items.some(item => context.pagePanel?.(item, item.index) || context.component?.hasSlotContent?.(item.slotName) || item.panel?.component || typeof item.panel?.text !== 'undefined');
}

function renderTabsTemplate(context) {
  // The look drawn (C96 item 1): line, plate (pills) or the menu column
  // (vertical); a custom template still reads context.type.
  const look = context.look ?? context.type;
  const vertical = look === 'vertical';
  const sizeClass = `sf-tabs--size-${String(context.size || '1').replace('/', '-')}`;
  const rootClasses = joinClasses('sf-tabs', sizeClass, context.overflow && context.overflow !== 'scroll' ? `sf-tabs--overflow-${context.overflow}` : '', look ? `sf-tabs--${look}` : '', vertical ? 'sf-tabs--vertical flex' : 'flex flex-col', context.links ? 'sf-tabs--links' : '', context.sticky ? 'sf-tabs--sticky' : '', context.rootClass);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div
      class=${rootClasses}
      style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      data-active-index=${String(context.activeIndex)}
      role="group"
    >
      <div class=${joinClasses('sf-tabs-top-container', context.overflow === 'more' || context.configurable ? 'sf-tabs-top-container--tools' : '')}>
        ${context.links ? renderLinkRow(context) : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div
          class=${topClasses(context)}
          role="tablist"
          aria-label=${context.component?.getAttribute('aria-label') || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          aria-labelledby=${context.component?.getAttribute('aria-labelledby') || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          aria-orientation=${vertical ? 'vertical' : 'horizontal'}
        >
          ${renderTabs(context)}
        </div>`}
        ${context.overflow === 'more' && !vertical ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button class="sf-tabs-more" appearance="ghost" scheme="on-surface" size=${context.size}
                            icon-end="expand_more" text=${context.moreText} aria-haspopup="menu"></sf-button>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        ${(context.displayItems ?? context.items).filter(item => item.hint).map(item => renderHint(item, context))}
        ${context.configurable ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button-icon class="sf-tabs-settings" appearance="ghost" scheme="on-surface" size=${context.size}
                                 icon="tune" aria-label=${context.customizeText} title=${context.customizeText}
                                 aria-haspopup="dialog"></sf-button-icon>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      </div>

      ${context.links && !hasPanelContent(context) ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-tabs-main-container">
        ${context.items.map(item => renderPanel(item, context))}
      </div>`}
    </div>
  `;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

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

/***/ "51b106697124"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-tabs for the shim (core/js/aliases.js, standard §16 item 20). mode: same-detail (the shim sends the new and the old name), split (the old detail from the element\'s adapter), host-attribute (no shim).","component":"sf-tabs","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"sf-tab-change","to":"sf-tabs-change","kind":"event","component":"sf-tabs","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":false,"section":"§8, §16 item 42","note":"the old detail adds component, tagName and template, which §8 takes out of the new one: the element\'s detail adapter makes it"},{"from":"data-tab","to":"data-sf-tab-index","kind":"attribute","component":"sf-tabs","since":"2026-11-12","remove_after":"2027-01-01","mode":"retired","section":"§3.1 (a name the component writes carries its prefix); R193 DP-11","note":"written beside data-sf-tab-index on each tab for one minor (1.2.x) and dropped in 1.3.0: a page selector [data-tab] caught the tabs\' own buttons (the dropdown-panels prototype hid tab 0 with pane 0); read data-sf-tab-index"}]}');

/***/ },

/***/ "84d032c55810"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.tabs","tag":"sf-tabs","version":"1.3.2","kind":"leaf","settings":{"type":{"type":"enum","values":["underline","pills","full","vertical"],"optional":true},"size":{"type":"enum","values":["1/2","1","2"],"default":"1"},"variant":{"type":"string","default":"buttons"},"scheme":{"type":"string","default":"default"},"top-position":{"type":"string","default":"start"},"active-index":{"type":"number","integer":true,"min":0,"default":0},"items":{"type":"list","default":[],"of":{"id":"id","label":"string","icon":{"type":"icon","optional":true},"count":{"type":"number","optional":true},"errors":{"type":"number","optional":true},"href":{"type":"string","optional":true},"disabled":{"type":"boolean","optional":true},"hint":{"type":"string","optional":true},"pinned":{"type":"boolean","optional":true}}},"top-class":{"type":"string","default":""},"panel-class":{"type":"string","default":""},"overflow":{"type":"enum","values":["scroll","wrap","more"],"default":"more"},"fit":{"type":"enum","values":["auto","always","never"],"default":"auto"},"configurable":{"type":"boolean","default":false},"lazy":{"type":"boolean","default":false},"hash":{"type":"boolean","default":false},"sticky":{"type":"boolean","default":false},"settings":{"type":"object"}},"values":{"selected":{"type":"id","default":""}},"events":{"change":{"x-native":false,"carries":{"selected":"id","previous":"number","current":"number","item":"object","items":"list"}},"settings-change":{"carries":{"order":{"type":"list","schema":{"items":{"type":"string"}}},"hidden":{"type":"list","schema":{"items":{"type":"string"}}},"reason":{"type":"enum","values":["order","visibility"],"optional":true}},"own-verb":true},"settings-reset":{"carries":{},"own-verb":true}},"actions":{"set-data":{"with":{"data":"object","reason":{"type":"string","optional":true}}},"set-panels":{"with":{"panels":"list","reason":{"type":"string","optional":true}}},"go-to":{"with":{"index":"number"}},"go-to-error":{"with":{}}},"css-variables":{"--sf-tabs-color":{"type":"color","state":"default"},"--sf-tabs-indicator-color":{"type":"color","state":"selected"},"--sf-tabs-indicator-width":{"type":"length","state":"selected"},"--sf-tabs-border-color":{"type":"color","state":"default"},"--sf-tabs-border-width":{"type":"length","state":"default"},"--sf-tabs-gap":{"type":"length","state":"default"},"--sf-tabs-sticky-top":{"type":"length","state":"default"}}}');

/***/ },

/***/ "33cd7c3c3aca"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Tabs","events":{"settings-change":{"label":"Tabs arranged"},"settings-reset":{"label":"Tabs reset"}},"runtime":{"customize":"Customize tabs","errors":{"one":"{n} error","other":"{n} errors"},"more":"More","moved":"Moved","pinned":"Always shown","reset":"Reset","tab":"Tab {n}","visible":"Shown"}}');

/***/ },

/***/ "90473944857f"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Вкладки","events":{"settings-change":{"label":"Вкладки настроены"},"settings-reset":{"label":"Вкладки сброшены"}},"runtime":{"customize":"Настроить вкладки","errors":{"one":"{n} ошибка","few":"{n} ошибки","many":"{n} ошибок","other":"{n} ошибки"},"more":"Ещё","moved":"Перемещено","pinned":"Всегда на месте","reset":"Сбросить","tab":"Вкладка {n}","visible":"Показывать"}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("e010c688f3f1");
/******/
/******/ })()
;