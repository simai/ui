/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "a2a9d3c2841e"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BADGE_HUES: () => (/* binding */ BADGE_HUES),
/* harmony export */   BADGE_MAIN_TONAL: () => (/* binding */ BADGE_MAIN_TONAL),
/* harmony export */   BADGE_SCHEMES: () => (/* binding */ BADGE_SCHEMES),
/* harmony export */   BADGE_SCHEME_ALIASES: () => (/* binding */ BADGE_SCHEME_ALIASES),
/* harmony export */   BADGE_SIZES: () => (/* binding */ BADGE_SIZES),
/* harmony export */   BADGE_TYPES: () => (/* binding */ BADGE_TYPES),
/* harmony export */   BADGE_VARIANTS: () => (/* binding */ BADGE_VARIANTS),
/* harmony export */   canonicalBadgeHue: () => (/* binding */ canonicalBadgeHue),
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
const BADGE_SIZES = Object.freeze(['1/3', '1/2', '1']); // The hues of the static palette a badge takes as a class, sf-badge--<hue>
// (owner decision C411): the sixteen names of src/core/scss/vars/_sf_var__hue.scss
// ($sf-static-hues), in its order. The class draws tone 50 at the fill step 24
// under --sf-on-surface in both themes; status colours stay with the status
// classes, so a hue is never a status.

const BADGE_HUES = Object.freeze(['red', 'orange', 'amber', 'yellow', 'lime', 'green', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'pink', 'brown', 'gray']); // The hue for a name, '' when it is not one of BADGE_HUES.

function canonicalBadgeHue(value) {
  const name = String(value ?? '').trim().toLowerCase();
  return BADGE_HUES.includes(name) ? name : '';
} // The default look is tonal (owner decision C140 (1), badges study BG-1): a
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

/***/ "e6d86f2cd058"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FIELD_LADDER: () => (/* binding */ FIELD_LADDER),
/* harmony export */   FIELD_SIZES: () => (/* binding */ FIELD_SIZES),
/* harmony export */   FIELD_WIDTHS: () => (/* binding */ FIELD_WIDTHS),
/* harmony export */   INPUT_SIZES: () => (/* binding */ INPUT_SIZES),
/* harmony export */   RETIRED_FIELD_SIZES: () => (/* binding */ RETIRED_FIELD_SIZES),
/* harmony export */   fieldSize: () => (/* binding */ fieldSize),
/* harmony export */   fieldWidth: () => (/* binding */ fieldWidth),
/* harmony export */   fieldWidthClass: () => (/* binding */ fieldWidthClass),
/* harmony export */   inputSize: () => (/* binding */ inputSize),
/* harmony export */   ladderSize: () => (/* binding */ ladderSize),
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
//
// The fields of the field ladder below are the exception: they stand on all
// five steps, as sf-input does.

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
} // The field ladder (fields ladder, 2026-11-14): one height per step for every
// field that stands on it, the control ladder sf-button and sf-button-icon
// stand on (--sf-ui-<size>--control-height: 28 / 32 / 40 / 48 / 56 on a
// desktop). A text field kept the outer steps first (actions block item 4,
// 2026-11-08: a toolbar search or a hero search stands beside buttons of 1/3
// and 3); sf-input-lookup, -quantity, -date, -code, -color and -country drew
// 32 / 48 or 40 at 1/3 and 3 beside it, so they take the same five steps and
// the stylesheets size their parts from the same steps
// (component/inputs/scss/_field-ladder.scss). The textarea and the rich text
// followed (2026-11-14), then the dropdown, the file upload area and the image
// field (queue #70, 2026-11-16): every field of the family stands on the
// ladder. FIELD_SIZES, fieldSize and retireFieldSizeClass stay for the lines
// of tags, badges and avatars and for a file's row, which keep three sizes.

const FIELD_LADDER = Object.freeze(['1/3', ...FIELD_SIZES, '3']);
const INPUT_SIZES = FIELD_LADDER;
/** A size on the field ladder: one of the five steps, else the fallback. */

function ladderSize(value, fallback = '1') {
  const size = String(value ?? '').trim().toLowerCase();
  return FIELD_LADDER.includes(size) ? size : fallback;
}
function inputSize(value, fallback = '1') {
  return ladderSize(value, fallback);
} // Markup written by hand carries its size as a class, so the binder moves a
// retired size class to the kept one before anything measures the field.

function retireFieldSizeClass(root, block) {
  if (!root?.classList) return;

  for (const [retired, kept] of Object.entries(RETIRED_FIELD_SIZES)) {
    const name = `${block}--size-${retired}`;
    if (!root.classList.contains(name)) continue;
    root.classList.replace(name, `${block}--size-${fieldSize(retired, block)}`);
  }
} // How wide a field is (owner decision C396, WM-4): the value it is made for,
// in characters of the width ladder, read from the field's width setting --
// short (20: a date, a number, a code), medium (28: a name, a phone) and long
// (44: a path, an e-mail, an address); the roles --sf-field--width-short,
// -medium and -long stand on the steps --sf-measure-20, -28 and -44 (core
// figma_measure.scss) and follow the text size, the density and the phone.
// It is the field's widest: in a narrower container the field is the
// container's width, as without it. Empty or any other value: the whole
// width, as every field drew before. The class is core's
// (core/scss/_sf_css__field_width.scss), so a field whose own sheet has not
// come yet already stands at its width.

const FIELD_WIDTHS = Object.freeze(['short', 'medium', 'long']);
/** A field width: short, medium or long, else '' (the whole width). */

function fieldWidth(value) {
  const width = String(value ?? '').trim().toLowerCase();
  return FIELD_WIDTHS.includes(width) ? width : '';
}
/** The root class of a field width, or '' for the whole width. */

function fieldWidthClass(value) {
  const width = fieldWidth(value);
  return width ? `sf-field--width-${width}` : '';
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

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
  remove_after: '2027-01-01',
  package: 'pro'
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
  remove_after: '2027-01-01',
  package: 'pro'
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
  remove_after: '2027-01-01',
  package: 'pro'
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
  remove_after: '2027-01-01',
  package: 'pro'
}), Object.freeze({
  from: 'sf-textarea',
  to: 'sf-input-textarea',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-thread-list',
  to: 'sf-chat-threads',
  since: '2026-11-03',
  remove_after: '2027-01-01',
  package: 'pro'
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
      remove_after: String(row.remove_after ?? ''),
      ...(typeof row.package === 'string' && row.package ? {
        package: row.package
      } : {})
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
    expired,
    package: row.package
  });
  if (shared.noted.has(row.from)) return;
  shared.noted.add(row.from); // deprecations.js prints an expired name itself, and every name when the
  // page opted in; the note here is for the rest.

  const optedIn = globalThis.document?.documentElement?.dataset?.sfDeprecations === 'warn' || globalThis.SF?.deprecations?.warn === true;
  if (expired || optedIn) return; // A package's element says which package ships it now (C174 NM-3).

  const where = row.package ? ` from the component package ${row.package}` : '';
  globalThis.console?.warn?.(`[SIMAI Framework] <${row.from}> is now <${row.to}>; the old tag works until ${row.remove_after}. Write <${row.to}>${where}. See contracts/changes/journal.json.`);
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

/***/ "c69a3dc158df"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AVATAR_PLACEHOLDER_ICON: () => (/* binding */ AVATAR_PLACEHOLDER_ICON),
/* harmony export */   AVATAR_SIZES: () => (/* binding */ AVATAR_SIZES),
/* harmony export */   avatarClasses: () => (/* binding */ avatarClasses),
/* harmony export */   avatarContent: () => (/* binding */ avatarContent),
/* harmony export */   avatarPicture: () => (/* binding */ avatarPicture),
/* harmony export */   avatarPictureContext: () => (/* binding */ avatarPictureContext),
/* harmony export */   avatarPictureIcons: () => (/* binding */ avatarPictureIcons),
/* harmony export */   avatarStepText: () => (/* binding */ avatarStepText)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var lit_directives_keyed_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("9d9903b87148");
/* harmony import */ var _helpers_text__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("cbce4a5232a6");
/* harmony import */ var _tone_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("a6b3ed0c1589");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, lit_directives_keyed_js__WEBPACK_IMPORTED_MODULE_1__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, lit_directives_keyed_js__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lit_directives_keyed_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lit_directives_keyed_js__WEBPACK_IMPORTED_MODULE_1__);



 // One avatar drawing (avatar study AV-8, 2026-11-14). sf-avatar and every
// component that shows a person beside its own content -- sf-avatar-group,
// sf-tag, sf-list-item, sf-dropdown, sf-input-lookup, sf-menu-context, the
// signs of sf-list -- draw the picture with these functions and the avatars
// sheet's classes: a photo is an <img> filling the circle, initials stand on
// the neutral plate (or the hue the host names, C17), and with neither the
// placeholder is a glyph on the neutral plate -- person by default, the
// host's icon for a bot, a system or a service. Before, five copies drew it
// five ways: the photo as a background image in the tag, the list row and the
// dropdown, an empty transparent circle in a row with no photo, and the
// context menu's own classes on the secondary container.

/** The sizes of the avatar ladder. */

const AVATAR_SIZES = Object.freeze(["1/4", "1/3", "1/2", "1", "2", "3"]);
/** The glyph of a placeholder: a person, unless the host names another. */

const AVATAR_PLACEHOLDER_ICON = "person"; // The letters a step holds (owner decision C152 (3), 2026-11-14): two from
// 1/3 up, one at 1/4 (16 px holds one letter of a readable size, two were
// 10 px each). Only letters are cut: «+5» or a number stays whole.

function avatarStepText(text, size) {
  const value = String(text ?? "");
  if (String(size ?? "") !== "1/4") return value;
  const letters = value.match(/^(\p{L}\p{M}*)\p{L}/u);
  return letters ? letters[1] : value;
}
/**
 * The drawing context of one avatar picture, from what a host knows: the photo,
 * the initials or the name they are taken from, the hue, the placeholder's
 * glyph, the size (or the text line of a form size) and the shape.
 */

function avatarPictureContext(options = {}) {
  const imageUrl = String(options.imageUrl ?? "").trim();
  const name = String(options.name ?? "").trim();
  const explicitText = String(options.text ?? "").trim();
  const namedIcon = String(options.icon ?? "").trim();
  const size = AVATAR_SIZES.includes(String(options.size ?? "")) ? String(options.size) : ""; // The initials: the host's own, else those of the name -- unless the host
  // names a glyph (a bot, a system), which stands in for them. With a photo
  // they stand under it until it comes and when it fails (C152 (2)).

  const text = avatarStepText(namedIcon ? explicitText : explicitText || (0,_helpers_text__WEBPACK_IMPORTED_MODULE_2__.getInitials)(name), size);
  const isImage = Boolean(imageUrl); // isText: the initials are drawn (alone, or under the photo).

  const isText = Boolean(text);
  const icon = namedIcon || AVATAR_PLACEHOLDER_ICON;
  return {
    size,
    line: String(options.line ?? ""),
    shape: options.shape === "square" ? "square" : "circle",
    imageUrl,
    isImage,
    isText,
    text,
    icon,
    status: options.status || "none",
    expressive: Boolean(options.expressive),
    resolvedHue: isText && options.hue ? (0,_tone_mjs__WEBPACK_IMPORTED_MODULE_3__.resolveAvatarHue)(options.hue, name || text, "") : "",
    rootClass: options.rootClass || "",
    rootStyle: options.rootStyle || "",
    disabled: Boolean(options.disabled),
    // A long list's rows load their photos as they scroll in.
    lazy: Boolean(options.lazy),
    component: options.component
  };
}
/**
 * The classes of the avatar picture. The avatars sheet answers every class
 * this file writes. sf-avatar's own templates hand it their utility classes
 * for the box (options.layout, src/smart/avatar/js/templates/shared.js), as
 * they wrote them before; a host's picture writes none -- sf-avatar--picture
 * gives it the same box from the avatars sheet -- so a host asks the Loader
 * for no utility it did not ask for before (a menu, a tag, a list row).
 */

function avatarClasses(context, options = {}) {
  const includeRootClass = options.includeRootClass !== false;
  const layout = options.layout ?? null;
  const classes = ["sf-avatar", layout ? layout.box : "sf-avatar--picture", context.size ? `sf-avatar--size-${context.size}` : "", context.line ? `sf-avatar--line-${context.line}` : "", layout ? layout.inline : ""].filter(Boolean);

  if (context.isText) {
    classes.push("sf-avatar--text");
    if (layout) classes.push(layout.center); // The hue's role set (core .sf-hue-<name>, C17); the class sheet
    // draws the plate and the ink from it.

    if (context.resolvedHue) {
      classes.push(`sf-hue-${context.resolvedHue}`);
    }
  }

  if (!context.isText) {
    classes.push("sf-avatar--placeholder");
    if (layout) classes.push(layout.center);
  } // The decorative level (C91 level 2): the sheet turns the initials'
  // plate of the largest size into a cover of its hue.


  if (context.expressive) {
    classes.push("sf-avatar--expressive");
  }

  if (context.status && context.status !== "none" && layout) {
    classes.push(layout.anchor);
  }

  if (context.shape === "square") {
    classes.push("sf-avatar--square");
  }

  if (context.status === "online") {
    classes.push("sf-avatar--status-icon-online-indicator");
  }

  if (options.disabled) {
    classes.push("disabled");
  }

  if (includeRootClass && context.rootClass) {
    classes.push(context.rootClass);
  }

  if (options.extraClass) {
    classes.push(options.extraClass);
  }

  return classes.join(" ");
} // The photo says when it has come or failed (C152 (2)): the sheet fades it
// in over the initials when loaded and drops it on an error, so the avatar is
// never an empty circle or the browser's broken-image glyph. The state is
// the runtime mark data-sf-loaded ("true" or "error"), which the template
// does not bind, so a redraw keeps it, and which a first-paint snapshot
// leaves out (it depends on the network); a new address is a new element
// (keyed), which starts transparent again.

function onImageLoad(event) {
  event.currentTarget.dataset.sfLoaded = "true";
}

function onImageError(event) {
  event.currentTarget.dataset.sfLoaded = "error";
}
/**
 * What the circle holds: the initials, or the placeholder glyph as an sf-icon
 * element, so its name reaches the icon font request (a bare <i class="sf-icon">
 * drawn after the page's scan stayed blank: buttons review 2026-11-09); with a
 * photo, the photo over them (owner decision C152 (2)).
 */


function avatarContent(context) {
  const under = context.isText ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-avatar-text">${context.text}</span>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-icon icon=${context.icon || AVATAR_PLACEHOLDER_ICON} aria-hidden="true"></sf-icon>`;
  if (!context.isImage) return under;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${under}${(0,lit_directives_keyed_js__WEBPACK_IMPORTED_MODULE_1__.keyed)(context.imageUrl, (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<img class="sf-avatar-image" src=${context.imageUrl} alt="" loading=${context.lazy ? "lazy" : lit__WEBPACK_IMPORTED_MODULE_0__.nothing} decoding=${context.lazy ? "async" : lit__WEBPACK_IMPORTED_MODULE_0__.nothing} @load=${onImageLoad} @error=${onImageError} />`)}`;
}
/** The icon names a picture draws (for a host's icon preload). */

function avatarPictureIcons(options = {}) {
  const context = avatarPictureContext(options);
  return context.isText ? [] : [context.icon];
}
/**
 * One avatar picture beside a host's own content: a span hidden from
 * assistive technology (the host's visible text names the person), drawn with
 * the avatars sheet. extraClass adds the host's own geometry class.
 */

function avatarPicture(options = {}) {
  const context = avatarPictureContext(options);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span
        class=${avatarClasses(context, {
    extraClass: options.extraClass,
    disabled: context.disabled
  })}
        style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        aria-hidden="true"
    >${avatarContent(context)}</span>`;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "64feefebb417"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   THEME_ICONS: () => (/* binding */ THEME_ICONS),
/* harmony export */   cycleItems: () => (/* binding */ cycleItems),
/* harmony export */   cycleState: () => (/* binding */ cycleState),
/* harmony export */   hasCycle: () => (/* binding */ hasCycle),
/* harmony export */   loaderOwnsTheme: () => (/* binding */ loaderOwnsTheme),
/* harmony export */   nextTheme: () => (/* binding */ nextTheme),
/* harmony export */   parseCycle: () => (/* binding */ parseCycle),
/* harmony export */   preloadControlIcons: () => (/* binding */ preloadControlIcons),
/* harmony export */   preloadSwitchIcons: () => (/* binding */ preloadSwitchIcons),
/* harmony export */   pressCycle: () => (/* binding */ pressCycle),
/* harmony export */   switchIconEntries: () => (/* binding */ switchIconEntries),
/* harmony export */   themeCycleFollow: () => (/* binding */ themeCycleFollow),
/* harmony export */   themeCycleValues: () => (/* binding */ themeCycleValues),
/* harmony export */   themePreference: () => (/* binding */ themePreference),
/* harmony export */   visibleTheme: () => (/* binding */ visibleTheme),
/* harmony export */   warnCycleToggle: () => (/* binding */ warnCycleToggle),
/* harmony export */   warnThemeNotOwned: () => (/* binding */ warnThemeNotOwned)
/* harmony export */ });
// One button, several values (docs review R039, owner decision D11d;
// research ui-control control/research/2026-11-08-cycle-button.md).
//
// sf-button and sf-button-icon share this: the `cycle` setting is a list of
// items shaped like sf-segmented's items ({value, label, icon} and an
// optional `pressed`, which draws the item with the pressed look), `value`
// is the current item, and a press moves to the next item and wraps. The
// `theme-cycle` setting draws a ready theme switch over SF.Loader's theme
// (the same contract as sf-segmented's theme-switch: themePreference,
// setTheme, sf-theme-change).
//
// The name and the icon say the current value («Тема: тёмная»), the tooltip
// says the current and the next («Тема: тёмная. Нажмите — как в системе»),
// and a polite live region says the new value after a press. A cycle is a
// plain button: it carries no aria-pressed, so pressed, label-pressed and
// text-pressed are ignored beside it (with one console warning).
const THEME_VALUES = ['system', 'light', 'dark']; // «Как в системе» in a cycle is the half-dark, half-light circle (D11d): a
// monitor alone does not say a theme.

const THEME_ICONS = Object.freeze({
  system: 'contrast',
  light: 'light_mode',
  dark: 'dark_mode'
});

function parseList(source) {
  if (Array.isArray(source)) return source;
  const text = String(source ?? '').trim();
  if (!text) return [];

  if (text.startsWith('[')) {
    try {
      const parsed = JSON.parse(text);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  } // value::label::flags|… as sf-segmented's items take it; a flag icon=<name>
  // names the icon, pressed draws the pressed look.


  return text.split('|').map(entry => {
    const [value, label = value, flags = ''] = entry.split('::');
    const list = flags.split(',').map(flag => flag.trim()).filter(Boolean);
    const icon = list.find(flag => flag.startsWith('icon='));
    return {
      value: value.trim(),
      label: label.trim(),
      icon: icon ? icon.slice(5) : '',
      pressed: list.includes('pressed')
    };
  });
}
/** The cycle's items, normalised: a value each, once, in the given order. */

/** Reads the attribute's JSON or value::label::flags form; a list stays a list. */


function parseCycle(value) {
  return parseList(value);
}
function cycleItems(source) {
  const seen = new Set();
  return parseList(source).map((item, index) => {
    const one = typeof item === 'string' ? {
      value: item,
      label: item
    } : item;
    if (!one || typeof one !== 'object') return null;
    const value = String(one.value ?? one.id ?? index).trim();
    if (!value || seen.has(value)) return null;
    seen.add(value);
    return {
      value,
      label: String(one.label ?? one.text ?? value),
      icon: String(one.icon || ''),
      lang: String(one.lang || '').trim(),
      pressed: Boolean(one.pressed)
    };
  }).filter(Boolean);
}
/** The themes a theme-cycle offers: all three, or the two it names. */

function themeCycleValues(attribute) {
  const named = String(attribute ?? '').trim().toLowerCase().split(/[\s,]+/u).map(word => word === 'auto' ? 'system' : word).filter(word => THEME_VALUES.includes(word));
  const unique = [...new Set(named)]; // Two themes without «as the system» flip the visible theme; anything else
  // (empty, one word, all three) is the full cycle.

  if (unique.length === 2 && !unique.includes('system')) return ['light', 'dark'];
  return THEME_VALUES;
}

const opposite = theme => theme === 'dark' ? 'light' : 'dark';

function loader() {
  return globalThis.SF?.Loader;
}
/**
 * False when the page's host draws the theme itself and started the Loader
 * with `theme: false` (SF_BOOT_CONFIG.theme): the Loader then neither reads
 * nor sets a theme, and its `theme` stays at the value it began with.
 */


function loaderOwnsTheme() {
  return loader()?.themeEnabled !== false;
}
/**
 * The theme drawn now (light or dark), whatever the preference. The Loader's
 * own value counts only while the Loader owns the theme; under a host that
 * owns it (R076: a Docara example frame) the document says what is drawn.
 */

function visibleTheme() {
  const theme = loaderOwnsTheme() ? loader()?.theme : undefined;
  if (theme === 'dark' || theme === 'light') return theme;
  const root = globalThis.document?.documentElement;
  if (root?.classList?.contains('theme-dark')) return 'dark';
  if (root?.classList?.contains('theme-light')) return 'light';
  return globalThis.matchMedia?.('(prefers-color-scheme: dark)')?.matches ? 'dark' : 'light';
}
/** What the person chose: system, light or dark. */

function themePreference() {
  const preference = loader()?.themePreference;
  return THEME_VALUES.includes(preference) ? preference : 'system';
}
/**
 * The owner's order (D11d): first the theme opposite to the visible one,
 * then the other, then «as the system». It needs the value before the
 * current one: from an explicit theme reached from the other explicit theme
 * the next is system; from system, or from a theme the page loaded with, the
 * opposite theme. Two themes: always the opposite of the visible theme.
 */

function nextTheme({
  values,
  current,
  previous
}) {
  if (!values.includes('system')) return opposite(visibleTheme());
  if (current === 'system') return opposite(visibleTheme());
  if (previous && previous !== 'system' && previous === opposite(current)) return 'system';
  return opposite(current);
}
/**
 * The cycle state the template reads: {items, item, next, index, name,
 * tooltip}. `words(key, vars)` gives the element's words; `base` is the
 * button's own name (aria-label, or the text of an sf-button).
 */

function hasCycle(host) {
  if (host.hasAttribute('theme-cycle')) return true;
  const own = host.getProp?.('cycle');
  return Boolean(host.hasAttribute('cycle') || Array.isArray(own) && own.length);
}
function cycleState(host, {
  base = '',
  words
}) {
  if (host.hasAttribute('theme-cycle')) {
    const values = themeCycleValues(host.getAttribute('theme-cycle'));
    const two = !values.includes('system');
    const current = two ? visibleTheme() : themePreference();

    const label = value => words(`theme-${value}`);

    const items = values.map(value => ({
      value,
      label: label(value),
      icon: THEME_ICONS[value],
      lang: '',
      pressed: false
    }));
    const item = items.find(one => one.value === current) ?? items[0];
    const nextValue = nextTheme({
      values,
      current: item.value,
      previous: host.__sfCyclePrevious
    });
    const next = items.find(one => one.value === nextValue) ?? items[0];
    const title = base || words('theme');
    const now = item.value === 'system' ? words('theme-system-now', {
      vars: {
        theme: label(visibleTheme())
      }
    }) : item.label;
    const name = `${title}: ${now}`;
    return {
      theme: true,
      items,
      item,
      next,
      name,
      tooltip: words('cycle-next', {
        vars: {
          name,
          next: next.label
        }
      })
    };
  }

  const items = cycleItems(host.getProp?.('cycle') ?? host.getAttribute('cycle'));
  if (!items.length) return null;
  const at = Math.max(0, items.findIndex(one => one.value === (host.getAttribute('value') ?? '')));
  const item = items[at];
  const next = items[(at + 1) % items.length];
  const name = base ? `${base}: ${item.label}` : item.label;
  return {
    theme: false,
    items,
    item,
    next,
    name,
    tooltip: words('cycle-next', {
      vars: {
        name,
        next: next.label
      }
    })
  };
}
/** A cycle beside a toggle's settings: the toggle's are ignored, said once. */

function warnCycleToggle(host, names) {
  const given = names.filter(name => host.hasAttribute(name));
  if (!given.length || host.__sfCycleWarned) return;
  host.__sfCycleWarned = true;
  globalThis.console?.warn?.(`[SIMAI Framework] ${host.localName}: cycle and theme-cycle are not toggles; ${given.join(', ')} ignored.`);
}
/**
 * A theme cycle whose press cannot move the theme says why, once per
 * element (R076): a host that owns the theme (the Loader started with
 * `theme: false`), or no Loader at all. The button stays where it is and
 * sends no change.
 */

function warnThemeNotOwned(host) {
  if (host.__sfThemeWarned) return;
  host.__sfThemeWarned = true;
  const reason = loader() ? 'the page\'s theme belongs to its host (the Loader runs with theme: false); a host that hands the theme to the Loader makes it work (a Docara example: theme_switch=true)' : 'SF.Loader is absent';
  globalThis.console?.warn?.(`[SIMAI Framework] ${host.localName} theme-cycle: the press changes nothing: ${reason}.`);
}
/**
 * A person's press of a cycle: the next value, the change event and the
 * announcement. Answers true when it moved.
 */

function pressCycle(host, state) {
  if (!state) return false;
  const previous = state.item.value;
  const value = state.next.value; // Said after the drawing that follows: the flag first, as the drawing may
  // come at once.

  const before = host.__sfCyclePrevious;
  host.__sfCycleAnnounce = true;
  host.__sfCyclePrevious = previous;

  if (state.theme) {
    // The Loader moves the page first, so a listener of change finds the
    // page in the theme it chose; a Loader that cannot (absent, or the
    // theme switched off) leaves the cycle where it is.
    host.__sfCycleExpect = value;

    if (loader()?.setTheme?.(value) !== true) {
      warnThemeNotOwned(host);
      host.__sfCycleAnnounce = false;
      host.__sfCyclePrevious = before;
      host.__sfCycleExpect = undefined;
      return false;
    }
  } else {
    host.setAttribute('value', value);
  }

  host.requestComponentUpdate?.('value');
  const item = state.items.find(one => one.value === value) ?? null;
  host.sfEmit('change', {
    previous,
    value,
    item: item ? { ...item
    } : null
  });
  return true;
}
/**
 * sf-theme-change for a theme cycle: a theme set elsewhere (another switch,
 * SF.Loader.setTheme) starts the order afresh from what is shown.
 */

function themeCycleFollow(host) {
  if (!host.hasAttribute('theme-cycle')) return;
  const values = themeCycleValues(host.getAttribute('theme-cycle'));
  const now = values.includes('system') ? themePreference() : visibleTheme();
  if (host.__sfCycleExpect !== now) host.__sfCyclePrevious = undefined;
  host.__sfCycleExpect = undefined;
  host.requestComponentUpdate?.('theme-cycle');
} // The icons a control can switch to, asked for before it switches (R074).
// Only the icon on screen was tracked, so the first press that showed another
// one asked the subset service for a grown font on the click, and the new
// icon stayed blank while the service built it (up to ~30 s when it was busy).
// Asked for when the control is drawn, the names join the page's first icon
// request (held until the Loader is ready); a control added later costs one
// grown font off the click.

/**
 * The icon entries ({icon, filled}) a cycle, a theme cycle or a toggle can
 * show. `icons` are a toggle's own icon names: with `pressed` present they
 * are drawn filled while on, so both forms are asked for. `filled` is the
 * control's own filled setting (every form filled).
 */

function switchIconEntries(host, {
  icons = [],
  filled = false
} = {}) {
  const entries = [];

  const add = (icon, fill) => {
    const name = String(icon || '').trim();
    if (name) entries.push({
      icon: name,
      filled: Boolean(fill || filled)
    });
  };

  if (host.hasAttribute('theme-cycle')) {
    themeCycleValues(host.getAttribute('theme-cycle')).forEach(value => add(THEME_ICONS[value], false));
  } else if (hasCycle(host)) {
    cycleItems(host.getProp?.('cycle') ?? host.getAttribute('cycle')).forEach(item => add(item.icon, item.pressed));
  } else if (host.hasAttribute('pressed')) {
    icons.forEach(icon => {
      add(icon, false);
      add(icon, true);
    });
  }

  const seen = new Set();
  return entries.filter(entry => {
    const key = `${entry.icon}|${entry.filled}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
/**
 * Asks the Loader for these icon entries once per distinct list (a render
 * that draws the same items asks nothing). Answers the number of new names.
 */

function preloadControlIcons(host, entries) {
  if (!Array.isArray(entries) || !entries.length) return 0;
  const key = JSON.stringify(entries);
  if (host.__sfPreloadedIcons === key) return 0;
  const preload = loader()?.preloadIcons;
  if (typeof preload !== 'function') return 0;
  host.__sfPreloadedIcons = key;
  return preload.call(loader(), entries) || 0;
}
/** switchIconEntries, asked for. */

function preloadSwitchIcons(host, options = {}) {
  return preloadControlIcons(host, switchIconEntries(host, options));
}

/***/ },

/***/ "b30ec5bc0edb"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   OPTION_BADGE_HUES: () => (/* binding */ OPTION_BADGE_HUES),
/* harmony export */   OPTION_BADGE_PALETTE: () => (/* binding */ OPTION_BADGE_PALETTE),
/* harmony export */   nearestPaletteHue: () => (/* binding */ nearestPaletteHue),
/* harmony export */   optionBadgeClass: () => (/* binding */ optionBadgeClass),
/* harmony export */   optionBadgeLook: () => (/* binding */ optionBadgeLook),
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
//
// optionBadgeProps is the former form: the hue written as the badge's two
// public variables in a style. The Framework's own parts draw a hue through
// optionBadgeLook and the badge's hue class (C411); this one stays for hosts
// until 2027-01-01 (journal class-option-badge-hue-class).


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
/**
 * The badge look of an option as the badge's own settings (owner decision
 * C411): {scheme, hue}. scheme is a Framework badge scheme (a former name read
 * as its canonical one), else neutral; hue is a name of the static palette
 * (red, teal, gray...; C17), a hex drawn in the palette hue nearest it, else
 * ''. A part gives the hue to sf-badge as hue="<name>", or to class markup as
 * the class sf-badge--<name>: the class sets the fill (tone 50 at the fill
 * step 24) and the text --sf-on-surface in both themes, so nothing is written
 * in a style.
 */

function optionBadgeLook(option = {}) {
  const raw = option?.scheme ?? option?.color;
  const color = typeof raw === "string" ? raw.trim() : "";
  const scheme = (0,_component_badges_js_contract_js__WEBPACK_IMPORTED_MODULE_0__.canonicalBadgeScheme)(color);
  if (scheme) return {
    scheme,
    hue: ""
  };
  const name = color.toLowerCase();
  if (OPTION_BADGE_PALETTE.includes(name)) return {
    scheme: "neutral",
    hue: name
  };
  if (HEX_COLOR.test(color)) return {
    scheme: "neutral",
    hue: nearestPaletteHue(color)
  };
  return {
    scheme: "neutral",
    hue: ""
  };
}
/** The hue class of an option's badge for class markup ('' without a hue): sf-badge--<hue> (C411). */

const optionBadgeClass = (option = {}) => {
  const {
    hue
  } = optionBadgeLook(option);
  return hue ? `sf-badge--${hue}` : "";
};

/***/ },

/***/ "cbce4a5232a6"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getInitials: () => (/* binding */ getInitials),
/* harmony export */   normalizeInitialsWords: () => (/* binding */ normalizeInitialsWords)
/* harmony export */ });
// c282-allow-start: input parsing (initials read from Russian names, C152)
const INITIALS_SKIP_WORDS = new Set(["а", "без", "в", "во", "для", "до", "за", "из", "из-за", "из-под", "и", "к", "ко", "между", "на", "над", "о", "об", "от", "по", "под", "при", "про", "с", "со", "у", "через", "the", "a", "an", "and", "for", "from", "in", "of", "on", "to"]); // Words a name carries that are not the person's or the organisation's own
// (owner decision C152 (3), 2026-11-14): legal forms (ООО «Ромашка» → Р),
// titles (Dr. John Smith → JS) and name particles (Мария фон Штейн → МШ) are
// skipped wherever they stand. Compared without case and without the dots
// around them (normalizeInitialsWords strips those).

const INITIALS_SERVICE_WORDS = new Set([// legal forms
"ооо", "оао", "зао", "пао", "ао", "нао", "ип", "нко", "ано", "гуп", "муп", "фгуп", "гбу", "мбу", "чоп", "llc", "inc", "ltd", "gmbh", "ag", "corp", "co", "llp", "plc", "lp", "bv", "oy", "ab", "srl", "sarl", // titles
"dr", "prof", "mr", "mrs", "ms", "mx", "miss", "sir", "jr", "sr", "phd", "д-р", "проф", "акад", "г-н", "г-жа", "доц", // particles
"фон", "ван", "дер", "де", "ди", "да", "дю", "ла", "ле", "ибн", "бен", "оглы", "кызы", "von", "van", "der", "den", "de", "di", "da", "du", "del", "della", "la", "le", "ten", "ter", "bin", "ibn"]); // c282-allow-end

function normalizeInitialsWords(value = "") {
  return String(value || "").trim().split(/[\s/|]+/).map(word => word.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "")).filter(Boolean);
} // The first character a reader sees: a whole grapheme, so a letter written
// with a combining accent («E» + U+0301) or outside the basic plane keeps all
// of its code points. Array.from alone splits surrogate pairs correctly but
// not combining marks; Intl.Segmenter does both where the platform has it.

function firstGrapheme(word) {
  const Segmenter = globalThis.Intl?.Segmenter;

  if (typeof Segmenter === "function") {
    for (const {
      segment
    } of new Segmenter(undefined, {
      granularity: "grapheme"
    }).segment(word)) {
      return segment;
    }

    return "";
  }

  return Array.from(word)[0] || "";
} // The one rule for initials (reuse audit 2026-11-02, finding 10): sf-avatar,
// the context menu, the admin menu and the chat drew them by five rules that
// disagreed on a hyphen, an empty name and a letter outside the basic plane.
//
//   «Анна Смирнова»        → «АС»   the first letters of the first two words
//   «Отдел по работе»      → «ОР»   a preposition after the first word is skipped
//   «Жан-Поль»             → «ЖП»   one hyphenated word reads as its parts
//   «Анна-Мария Смирнова»  → «АС»   ...but a name of several words by its words
//   «Анна»                 → «А»
//   «ООО «Ромашка»»        → «Р»    legal forms, titles, particles skipped (C152)
//   «Мария фон Штейн»      → «МШ»
//   «Dr. John Smith»       → «JS»
//   «anna@simai.ru»        → «A»    an address: the first letter before «@»
//   «»                     → ''     or `fallback`: '?' where text must stand
//
// `maxLetters` caps the letters (two), `skipWords` replaces the skipped words,
// `locale` capitalises by a locale's rule.


function getInitials(value = "", options = {}) {
  const {
    maxLetters = 2,
    skipWords = INITIALS_SKIP_WORDS,
    fallback = "",
    locale
  } = options;
  let source = String(value ?? "").trim(); // An address reads by the name before «@»: one letter (C152 (3)),
  // anna@simai.ru → A, not the letters of its parts.

  if (/^[^\s@]+@[^\s@]+$/u.test(source)) {
    const local = normalizeInitialsWords(source.slice(0, source.indexOf("@")).replace(/[._+-]+/gu, " "));
    if (!local.length) return String(fallback);
    const letter = firstGrapheme(local[0]);
    return (locale ? letter.toLocaleUpperCase(locale) : letter.toUpperCase()) || String(fallback);
  }

  const allWords = normalizeInitialsWords(source); // Legal forms, titles and particles go first; a name made of them alone
  // keeps them, so it still has initials.

  const ownWords = allWords.filter(word => !INITIALS_SERVICE_WORDS.has(String(word).toLowerCase()));
  const words = ownWords.length ? ownWords : allWords;
  let significantWords = words.filter((word, index) => index === 0 || !skipWords.has(String(word).toLowerCase())); // One word written with a hyphen or a dash is a compound name: its parts
  // are its words. Split before the skip list, «из-за» would be two words.

  if (significantWords.length === 1) {
    const parts = significantWords[0].split(/[-\u2010-\u2015]+/u).filter(Boolean);
    if (parts.length > 1) significantWords = parts;
  }

  if (!significantWords.length) {
    return String(fallback);
  }

  const letters = significantWords.length > 1 ? significantWords.slice(0, Math.max(1, maxLetters)).map(firstGrapheme).join("") : firstGrapheme(significantWords[0]);
  return (locale ? letters.toLocaleUpperCase(locale) : letters.toUpperCase()) || String(fallback);
}

/***/ },

/***/ "fed59e5c8a07"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   tagHref: () => (/* binding */ tagHref),
/* harmony export */   tagHue: () => (/* binding */ tagHue)
/* harmony export */ });
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("d3818183b14c");
/* harmony import */ var _component_field_size__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("e6d86f2cd058");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("a038e9885b82");
/* harmony import */ var _helpers_cycle__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("64feefebb417");
/* harmony import */ var _core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("e92fd2d1a38c");
/* harmony import */ var _js_tag_row_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("550ba610396b");
/* harmony import */ var _helpers_option_badge_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("b30ec5bc0edb");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("7eee137ec5ff");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("e01b02206b25");
/* harmony import */ var _lang_index_mjs__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("109c3b010316");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_2__, _component_field_size__WEBPACK_IMPORTED_MODULE_3__, _js_templates_default__WEBPACK_IMPORTED_MODULE_4__, _core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_6__, _js_tag_row_js__WEBPACK_IMPORTED_MODULE_7__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_2__, _component_field_size__WEBPACK_IMPORTED_MODULE_3__, _js_templates_default__WEBPACK_IMPORTED_MODULE_4__, _core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_6__, _js_tag_row_js__WEBPACK_IMPORTED_MODULE_7__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_6__);











 // Only the words on screen ship in the bundle, English only (owner decision
// C282): Russian and every other language come from a language file. The
// title, settings and events stay in the language files for the Studio and the
// docs (localization study LC-2).

const TAG_KINDS = ['checkbox', 'icon', 'default', 'color', 'avatar']; // The glyphs the template draws in sf-icon: an icon tag's icon (sell when
// none is named) and an avatar tag's placeholder; a slot drawn instead asks
// for nothing. Read from the element, so it can be asked before it draws.

function drawnIcons(host) {
  const slotted = name => host.hasSlotContent?.(name); // A filter tag's check mark is drawn when it is chosen (C145 (2)); it is
  // asked for with the tag, so a press never shows a blank glyph.


  if (host.type === 'checkbox' && !slotted('leading') && !host.href) return ['check'];
  if (host.type === 'icon' && !slotted('leading')) return [host.icon || 'sell'];
  if (host.type === 'avatar' && !slotted('avatar') && !host.avatarImageUrl && !host.avatarText) return ['person'];
  return [];
} // Asked for when the tag connects, before it draws (R074 F3, the remedy
// sf-segmented got in 2f588136): the inner sf-icon told the Loader its name
// only once the tag had drawn, a task or more after the tag was defined, and
// the page's first icon request, which waits a frame after the definitions,
// went without it; a second request followed 50-140 ms later, and on a slow
// service the tag's icon was blank until the full font arrived. Asked again
// when it draws (a name set later); one request per distinct list.


const preloadTagIcons = host => (0,_helpers_cycle__WEBPACK_IMPORTED_MODULE_5__.preloadControlIcons)(host, drawnIcons(host).map(icon => ({
  icon,
  filled: false
})));

const TAG_STATUSES = ['', 'info', 'success', 'warning', 'error'];
const HEX_COLOR = /^#(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/iu; // The hue of the colour dot (owner decision C145 (7); C140 BG-7): a hue of
// the static palette by name, or the hue nearest a hex colour from data --
// never the raw colour. Anything else: no hue (color-class may still paint).

function tagHue(value) {
  const color = String(value ?? '').trim();
  if (!color) return '';
  const name = color.toLowerCase();
  if (_helpers_option_badge_js__WEBPACK_IMPORTED_MODULE_8__.OPTION_BADGE_PALETTE.includes(name)) return name;
  return HEX_COLOR.test(color) ? (0,_helpers_option_badge_js__WEBPACK_IMPORTED_MODULE_8__.nearestPaletteHue)(color) : '';
} // A link's address (owner decision C145 (6)): a relative address, a path, a
// fragment or a query is kept; an address with a scheme only when it is http,
// https, mailto or tel. javascript:, data: and the rest lead nowhere.

const SAFE_SCHEMES = new Set(['http:', 'https:', 'mailto:', 'tel:']); // eslint-disable-next-line no-control-regex -- matching control characters is the point

const CONTROLS = /[\u0000- \u007f-\u009f]/gu;
function tagHref(value) {
  const given = String(value ?? '').trim();
  if (!given) return '';
  const compact = given.replace(CONTROLS, '');
  const scheme = /^([a-z][a-z0-9+.-]*):/iu.exec(compact);
  if (!scheme) return given;
  return SAFE_SCHEMES.has(`${scheme[1].toLowerCase()}:`) ? given : '';
}

const normalize = value => String(value ?? '').trim().toLowerCase(); // `type` answered two questions from one list: what the tag carries (kind)
// and what it reports (status). It is not a setting any more and not a dated
// alias either -- an alias names one target and cannot split -- so the routing
// stays here, and each use is noted with the dates of journal
// attribute-tag-type-split. `quantity` was renamed to `default` before either
// axis was named: a dated value alias of kind (aliases.json), still read here
// for type="quantity".


const TYPE_SPLIT = {
  since: '2026-10-27',
  remove_after: '2026-12-01'
};

function legacyType(element, axis) {
  const legacy = normalize(element?.getAttribute?.('type'));
  if (!legacy) return '';
  const kind = legacy === 'quantity' ? 'default' : legacy;
  const fits = axis === 'kind' ? TAG_KINDS.includes(kind) : TAG_STATUSES.includes(kind);
  if (fits) (0,_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_2__.noteDeprecated)({
    component: 'sf-tag',
    tag: 'sf-tag',
    kind: 'attribute',
    from: 'type',
    to: axis,
    ...TYPE_SPLIT
  });
  return fits ? kind : '';
} // height (1.4.0, decision C27; docs precheck TG-02): the size's tightness
// steps, as on sf-button. spacing is its former name until 2027-01-01
// (journal attribute-tag-spacing-to-height): compact, comfortable and spacious
// draw as low, high and highest, and height wins when both are given.


const TAG_HEIGHTS = ['low', 'default', 'high', 'highest'];
const SPACING_HEIGHT = Object.freeze({
  compact: 'low',
  comfortable: 'high',
  spacious: 'highest'
});

function tagHeight(element) {
  const raw = String(element.getAttribute('height') ?? '').trim().toLowerCase();

  if (raw && raw !== 'default') {
    if (TAG_HEIGHTS.includes(raw)) return raw;

    if (!element._sfHeightWarned) {
      element._sfHeightWarned = true;
      globalThis.console?.warn?.(`[SIMAI Framework] sf-tag: height="${raw}" is not a height; write low, default, high or highest (the size's steps). Read as default.`);
    }

    return 'default';
  }

  if (raw === 'default') return 'default';
  if (!element.hasAttribute('spacing')) return 'default';

  if (!element._sfSpacingNoted) {
    element._sfSpacingNoted = true;
    (0,_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_2__.noteDeprecated)({
      component: 'sf-tag',
      tag: 'sf-tag',
      kind: 'attribute',
      from: 'spacing',
      to: 'height',
      since: '2026-11-10',
      remove_after: '2027-01-01'
    });
  }

  return SPACING_HEIGHT[String(element.getAttribute('spacing')).trim().toLowerCase()] || 'default';
} // appearance (1.4.0, docs precheck smart content, applied decision d): the
// faint fill with a hairline edge is outline, a name of C15's vocabulary;
// surface, the word C15 retired, is its former name until 2027-01-01 (journal
// value-tag-appearance-surface-to-outline) and draws the same.


function tagAppearance(element) {
  const raw = String(element.getAttribute('appearance') ?? '').trim().toLowerCase();
  if (raw !== 'surface') return ['default', 'outline', 'ghost'].includes(raw) ? raw : 'default';

  if (!element._sfSurfaceNoted) {
    element._sfSurfaceNoted = true;
    (0,_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_2__.noteDeprecated)({
      component: 'sf-tag',
      tag: 'sf-tag',
      kind: 'value',
      attribute: 'appearance',
      from: 'surface',
      to: 'outline',
      since: '2026-11-10',
      remove_after: '2027-01-01'
    });
  }

  return 'outline';
} // A bare tag is a plain tag (owner decision C280, 2026-11-17; Smart joint
// pass SM-TG-1, prototypes/smart-tags-study.html#q-tag-default): kind default,
// as the class twin starts, and a filter toggle only with kind="checkbox".
// Until 2027-01-01 (journal value-tag-default-kind-plain) a bare tag a page
// still uses as a toggle keeps toggling and is noted in SF.deprecations: one
// whose change the page listens to, one in an sf-tag-group that selects
// (selection one or many, the group's filters), and the copy of either in a
// group's «+N» panel.


const BARE_TOGGLE = {
  since: '2026-11-17',
  remove_after: '2027-01-01'
}; // interactive written on the host, as the boolean attribute reads it.

function isInteractive(element) {
  return Boolean(element?.hasAttribute?.('interactive')) && normalize(element.getAttribute('interactive')) !== 'false';
}

function bareToggle(element) {
  // An interactive tag opens something (a filter field's menu): its label is
  // a button beside the remove action, never a toggle, in a group that
  // selects or with a change listener (1.12.6, DEV order msg-d56fa72b: an
  // interactive bare tag in such a group drew as a checkbox and toggled).
  if (isInteractive(element)) return false;
  const original = element?._sfOriginal;
  if (original && original !== element) return original.kind === 'checkbox';
  const group = element?.parentElement; // A group selects only when asked (its selection defaults to none): a bare
  // tag in a plain group is a plain tag (1.13.0, TG-4).

  const selecting = group?.localName === 'sf-tag-group' && normalize(group.getAttribute('selection') || 'none') !== 'none';
  if (!element?._sfChangeHeard && !selecting) return false;

  if (!element._sfBareToggleNoted) {
    element._sfBareToggleNoted = true;
    (0,_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_2__.noteDeprecated)({
      component: 'sf-tag',
      tag: 'sf-tag',
      kind: 'value',
      attribute: 'kind',
      from: '(none) as a toggle',
      to: 'checkbox',
      ...BARE_TOGGLE
    });
  }

  return true;
}

function resolveTagKind(element, raw, fallback) {
  const requested = normalize(raw);

  if (requested) {
    return requested === 'quantity' ? 'default' : TAG_KINDS.includes(requested) ? requested : fallback;
  }

  return legacyType(element, 'kind') || (bareToggle(element) ? 'checkbox' : fallback);
}

function resolveTagStatus(element, raw, fallback) {
  const requested = normalize(raw);

  if (requested) {
    return TAG_STATUSES.includes(requested) ? requested : fallback;
  }

  return legacyType(element, 'status') || fallback;
} // sf-tag from its component.json (standard simai.smart-component 1.3.8 §3,
// §4, §8): the settings are the attributes and properties
// core/js/element-manifest.js makes from the manifest; kind and status keep
// their parsers for the split of type. change keeps the browser's name with
// {active}; close is sf-tag-close, the old name close its dated alias.


const TagElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_9__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: _lang_index_mjs__WEBPACK_IMPORTED_MODULE_11__.files,
  source: 'ru',
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_10__
});

class SfTag extends TagElement {
  static get props() {
    return { ...super.props,
      templateName: {
        attribute: 'template',
        default: 'default'
      },
      // One closed list used to answer two questions: what the tag carries and
      // what it reports. They are separate axes now, and `type` keeps answering
      // both — see contracts/public-api-axes.json. The routing lives in the prop
      // rather than in a getter, because the template reads the props context.
      kind: {
        default: 'default',
        values: TAG_KINDS,
        parser: (raw, fallback, element) => resolveTagKind(element, raw, fallback)
      },
      status: {
        default: '',
        values: TAG_STATUSES,
        parser: (raw, fallback, element) => resolveTagStatus(element, raw, fallback)
      }
    };
  }

  get componentName() {
    return 'tag';
  }

  get templateName() {
    return this.getAttribute('template') || 'default';
  }

  get kind() {
    return this.getProp('kind');
  } // A page that listens to a bare tag's change uses it as a toggle (C280): it
  // keeps toggling until 2027-01-01, noted (bareToggle).


  addEventListener(type, listener, options) {
    if (type === 'change' && !this._sfChangeHeard) {
      this._sfChangeHeard = true;
      if (!this.hasAttribute('kind') && !this.hasAttribute('type')) this.requestComponentUpdate?.('kind');
    }

    return super.addEventListener(type, listener, options);
  }

  set kind(value) {
    super.kind = value;
  }

  get status() {
    return this.getProp('status');
  }

  set status(value) {
    super.status = value;
  } // The legacy name, which answered both questions from one list: a status when
  // one is set, the kind otherwise.


  get type() {
    return this.status || this.kind;
  }

  set size(value) {
    super.size = value;
  }

  get size() {
    // On a text line the tag is one size down, the step a dropdown's size 1/2
    // field takes for its tags, so its label sits on the line.
    const line = this.line;
    if (line) return {
      '1/2': '1/3',
      '1': '1/2',
      '2': '1'
    }[line];
    return super.size;
  } // The height drawn: height, else the former spacing's step until
  // 2027-01-01 (tagHeight), so the property says what the template draws
  // (template-context probe). The base puts its setter back beside it.


  get height() {
    return tagHeight(this);
  } // In a table cell or beside other text the tag takes the text line of a form
  // size, so the row keeps its control height.


  get line() {
    const line = this.getAttribute('line') || '';
    return line ? (0,_component_field_size__WEBPACK_IMPORTED_MODULE_3__.fieldSize)(line, 'sf-tag line') : '';
  }

  set line(value) {
    super.line = value;
  }

  get inline() {
    return Boolean(this.line) || super.inline;
  }

  set inline(value) {
    super.inline = value;
  }

  get rootClass() {
    return this.getRootClass();
  } // A checkbox tag removes only when asked: it is the default kind, and a remove
  // action on every filter chip would be a surprise. Asked, it is honoured --
  // it used to be dropped without a word (documentation trial, 2026-10-12).


  set closable(value) {
    super.closable = value;
  }

  get closable() {
    // A link is removed by no one (C145 (6)).
    if (this.href) return false;
    if (this.type === 'checkbox') return this.hasAttribute('closable') && this.getBooleanAttr('closable', true);

    if (this.hasAttribute('closable')) {
      return this.getBooleanAttr('closable', true);
    }

    return ['icon', 'color', 'avatar'].includes(this.type);
  } // An interactive tag (for example a filter chip that opens a menu) renders
  // its label as a real button next to the remove action, so both are
  // reachable and operable from the keyboard. Checkbox tags are buttons already.


  get interactive() {
    return this.type !== 'checkbox' && !this.href && super.interactive;
  } // The address the tag leads to, made safe (tagHref): empty, it is no link.


  get href() {
    return tagHref(super.href);
  }

  set href(value) {
    super.href = value;
  }

  set interactive(value) {
    super.interactive = value;
  }

  templateContext() {
    const props = this.getPropsContext();
    return this.createTemplateContext({ ...props,
      // A tag on a line resolves its size and inline mode from the line; the
      // kind is resolved too, so the canonical kind="checkbox" is interactive,
      // not only the legacy type="checkbox".
      kind: this.kind,
      type: this.type,
      size: this.size,
      height: tagHeight(this),
      appearance: tagAppearance(this),
      inline: this.inline,
      line: this.line,
      component: this,
      rootClass: this.rootClass,
      closable: this.closable,
      interactive: this.interactive,
      href: this.href,
      hue: tagHue(this.color),
      closeLabel: this.closeLabel,
      active: this.active,
      ariaLabel: this.getAttribute('aria-label') || '',
      // A name cut with an ellipsis has its whole text as the tag's tooltip
      // (C58; TG-1), the Framework's plain tooltip.
      cutTooltipId: this._sfCut ? (0,_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_6__.partId)((0,_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_6__.instancePath)(this, {
        kind: 'sf-tag'
      }), 'name') : '',
      cutText: this._sfCut ? this.cutText() : ''
    });
  } // The label's whole text, as the tooltip says it.


  cutText() {
    const label = this.querySelector(':scope > .sf-tag .sf-tag-container');
    return String(label?.textContent ?? this.text ?? '').trim();
  } // The remove action's name (1.13.0, TG-1): close-label when the page gave
  // one; else «Удалить Москва», the tag's own name in the words of
  // sf-input-lookup's chips, so the crosses of a row are told apart; a tag
  // with no name keeps «Удалить».


  get closeLabel() {
    const given = this.getAttribute('close-label');
    if (given !== null) return given;
    const name = String(this.text || this.getAttribute('aria-label') || '').trim();
    return name ? this.sfWord('remove-named', {
      vars: {
        label: name
      }
    }) : this.sfWord('remove');
  }

  set closeLabel(value) {
    super.closeLabel = value;
  } // The tag's id in a group (sf-tag-group's selected and selected-ids): its
  // key, else its text.


  get groupKey() {
    return String(this.key || this.text || this.textContent || '').trim();
  } // Whether the drawn label is cut: read from the label, since the column,
  // the font and the row decide it, not the length of the text.


  measureCut() {
    const label = this.querySelector(':scope > .sf-tag .sf-tag-container');
    const cut = Boolean(label && label.scrollWidth - label.clientWidth > 0.5);
    if (cut === Boolean(this._sfCut)) return;
    this._sfCut = cut;
    this.requestComponentUpdate('cut');
  }

  watchCut() {
    const label = this.querySelector(':scope > .sf-tag .sf-tag-container');
    if (!label || typeof ResizeObserver === 'undefined') return;
    if (this._sfCutLabel === label) return;
    this._sfCutObserver?.disconnect();
    this._sfCutLabel = label;
    this._sfCutObserver = new ResizeObserver(() => this.measureCut());

    this._sfCutObserver.observe(label);
  }

  afterRender(changed) {
    const result = super.afterRender(changed);
    this.watchCut();
    this.measureCut(); // The row the tag stands in shows what fits and «+N», and walks closable
    // tags in a field by keys (js/tag-row.js).

    if (!this.hasAttribute('data-sf-tag-more')) (0,_js_tag_row_js__WEBPACK_IMPORTED_MODULE_7__.tagInRow)(this); // A group's «+N» stands in its popover; its button exists only once it
    // drew, so the group walks it from then on (one Tab stop, C145 (4)).
    else this.closest('sf-tag-group')?.sfTagDrew?.();
    this._sfRow = this.parentElement;
    return result;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._sfCutObserver?.disconnect();
    this._sfCutObserver = null;
    this._sfCutLabel = null;
    (0,_js_tag_row_js__WEBPACK_IMPORTED_MODULE_7__.tagLeftRow)(this._sfRow);
    this._sfRow = null;
  }

  onToggle() {
    if (this.disabled || this.type !== 'checkbox' || this.href) return;
    const active = !this.active;
    this.toggleAttribute('active', active); // §8: a person's change, under the browser's name, with data only.

    this.sfEmit('change', {
      active
    });
  }

  onClose() {
    if (this.disabled || !this.closable) return; // sf-tag-close (§8); the shim sends the old name close after it.

    this.sfEmit('close', {});
  }

  connectedCallback() {
    super.connectedCallback(); // After the base has read the slots and the settings, before the update
    // it requested draws the tag.

    if (this.isConnected) preloadTagIcons(this);
  }

  template() {
    preloadTagIcons(this);
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_4__.renderTagTemplate)(this.templateContext());
  }

  get value() {
    return {
      template: this.templateName,
      kind: this.kind,
      status: this.status,
      type: this.type,
      appearance: this.appearance,
      size: this.size,
      spacing: this.spacing,
      inline: this.inline,
      line: this.line,
      text: this.text,
      count: this.count,
      icon: this.icon,
      colorClass: this.colorClass,
      avatarImageUrl: this.avatarImageUrl,
      avatarText: this.avatarText,
      avatarStatus: this.avatarStatus,
      rootClass: this.rootClass,
      active: this.active,
      disabled: this.disabled,
      closable: this.closable,
      href: this.href,
      color: this.color,
      key: this.key,
      ariaLabel: this.getAttribute('aria-label') || '',
      closeLabel: this.closeLabel
    };
  }

  set value(nextValue) {
    this.setValueAttributes(nextValue);
  }

}

SfTag.define('sf-tag');
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "b22d4f28d908"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CLOSE_SIZE: () => (/* binding */ CLOSE_SIZE),
/* harmony export */   closeSize: () => (/* binding */ closeSize)
/* harmony export */ });
// The size sf-tag asks sf-button-close for, for its remove button. The button's
// sizes are 1/3, 1/2, 1, 2 and 3; the tag asks for the smallest at every tag
// size and its stylesheet draws the box from the label (templates/default.css).
// Before 1.1.6 sizes 1/2 and 1/3 asked for 1/4, a size the button does not
// have, and it fell back to size 1. A pure module, so a contract reads it.
const CLOSE_SIZE = '1/3';
function closeSize() {
  return CLOSE_SIZE;
}

/***/ },

/***/ "550ba610396b"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   boxesOf: () => (/* binding */ boxesOf),
/* harmony export */   nameOf: () => (/* binding */ nameOf),
/* harmony export */   oneRow: () => (/* binding */ oneRow),
/* harmony export */   overflows: () => (/* binding */ overflows),
/* harmony export */   said: () => (/* binding */ said),
/* harmony export */   setAttr: () => (/* binding */ setAttr),
/* harmony export */   stopOf: () => (/* binding */ stopOf),
/* harmony export */   stopsIn: () => (/* binding */ stopsIn),
/* harmony export */   tagInRow: () => (/* binding */ tagInRow),
/* harmony export */   tagLeftRow: () => (/* binding */ tagLeftRow)
/* harmony export */ });
/* harmony import */ var _core_js_tag_aliases_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("4a85acfb05c1");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_tag_aliases_js__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
_core_js_tag_aliases_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
// The row an sf-tag stands in (owner decisions C58 and C139 (6); tags study
// TG-2, TG-8). A tag is one element; what a row of them needs is read from
// the row itself, the parent the tags share, without a group element of its
// own (a group part is an open owner question):
//
// - «+N»: in a one-row container (a flex row that does not wrap: filters, a
//   table cell, a card) the tags keep their width (the tag sheet), the row
//   shows those that fit and a plain count «+N» for the rest. The first tag
//   always stands; a name too long for the row ends in an ellipsis. A row
//   that wraps (a form) wraps, as C58 asks. «+N» opens nothing: what it
//   opens is an open owner question, so it is a count with the hidden names
//   in its title.
// - keys: closable tags in a field (inside an .sf-input-field frame) are one
//   Tab stop. ArrowLeft and ArrowRight walk them (mirrored right to left),
//   Home and End go to the ends, Delete or Backspace removes the one stood on
//   (sf-tag-close, as the cross; the host removes it) and the focus goes to
//   its neighbour; each step is said in a polite line, «Москва, 1 из 3,
//   Delete — убрать», the words of sf-input-lookup's chips. The cross under
//   the mouse is unchanged. Tags outside a field keep a stop per cross: that
//   is an open owner question (tags study #q-keys).
//
// A host that lays out its own chips (sf-input-lookup, sf-dropdown) keeps its
// own rules: its rows are left alone. So does sf-tag-group (owner decision
// C145 (3)-(5)): the group owns its row -- one Tab stop for every tag, «+N»
// that opens the hidden tags -- with the helpers exported here.
//
// Every bundle that carries sf-tag carries a copy of this module; the rows
// are kept on one shared record.

const ROWS = Symbol.for('sf.tag.rows');

const rows = () => globalThis[ROWS] || (globalThis[ROWS] = new WeakMap());

const OVER = 'data-sf-tag-over';
const SHRINK = 'data-sf-tag-shrink';
const MORE = 'data-sf-tag-more';
const MANAGED = 'sf-input-lookup, sf-lookup, sf-dropdown, .sf-dropdown, sf-tag-group';

const isTag = node => node?.localName === 'sf-tag';

const tagsOf = row => [...row.children].filter(isTag); // What a row lays out: a host drawn with display: contents gives its boxes.


function boxesOf(row) {
  const out = [];

  for (const child of row.children) {
    if (child.hidden) continue;
    const view = getComputedStyle(child);
    if (view.display === 'none') continue;
    if (view.display === 'contents') out.push(...[...child.children].filter(one => getComputedStyle(one).display !== 'none' && !one.hidden));else out.push(child);
  }

  return out;
}
function oneRow(row) {
  const view = getComputedStyle(row);
  return /flex/u.test(view.display) && view.flexWrap === 'nowrap' && view.flexDirection.startsWith('row');
} // Whether anything the row lays out passes its content box, on either side.

function overflows(row) {
  const view = getComputedStyle(row);
  const box = row.getBoundingClientRect();
  const start = box.left + (parseFloat(view.borderLeftWidth) || 0) + (parseFloat(view.paddingLeft) || 0);
  const end = box.right - (parseFloat(view.borderRightWidth) || 0) - (parseFloat(view.paddingRight) || 0);
  return boxesOf(row).some(one => {
    const rect = one.getBoundingClientRect();
    return rect.width > 0 && (rect.right > end + 0.5 || rect.left < start - 0.5);
  });
}
function setAttr(element, name, on) {
  if (on && !element.hasAttribute(name)) element.setAttribute(name, '');else if (!on && element.hasAttribute(name)) element.removeAttribute(name);
} // The «+N» count: class markup of a default tag of the row's size, so it is
// drawn the moment it is placed and measured in the same pass.

function moreFor(row, state, tags) {
  let more = state.more;

  if (!more || !more.isConnected || more.parentElement !== row) {
    more = row.ownerDocument.createElement('span');
    more.setAttribute(MORE, '');
    more.innerHTML = '<span class="sf-tag-container"></span>';
    state.more = more;
  }

  const root = tags[0].querySelector(':scope > .sf-tag') || tags[0].firstElementChild;
  const steps = [...(root?.classList || [])].filter(name => /^sf-tag--(size|height)-/u.test(name));
  const className = ['sf-tag', 'sf-tag--default', ...(steps.length ? steps : ['sf-tag--size-1/2']), 'inline-flex', 'flex-row', 'flex-nowrap', 'items-center'].join(' ');
  if (more.className !== className) more.className = className;
  return more;
}

function placeMore(row, more, after, count, names, word) {
  if (more.previousElementSibling !== after || more.parentElement !== row) after.after(more);
  const text = `+${count}`;
  const label = more.firstElementChild;
  if (label.textContent !== text) label.textContent = text;
  const title = word('more', {
    count,
    vars: {
      n: count,
      names
    }
  });
  if (more.title !== title) more.title = title;
}

function dropMore(state) {
  if (state.more?.isConnected) state.more.remove();
}

function nameOf(tag) {
  return String(tag.text ?? tag.getAttribute('text') ?? tag.textContent ?? '').trim();
}

function fit(row, state) {
  const tags = tagsOf(row);

  for (const tag of tags) {
    setAttr(tag, OVER, false);
    setAttr(tag, SHRINK, false);
  }

  if (!tags.length || row.closest(MANAGED) || !oneRow(row)) {
    dropMore(state);
    return;
  }

  dropMore(state);
  if (!overflows(row)) return;

  const word = (key, options) => tags[0].sfWord?.(key, options) ?? '';

  const more = moreFor(row, state, tags);
  let shown = tags.length;

  while (shown > 1) {
    shown -= 1;
    setAttr(tags[shown], OVER, true);
    const hidden = tags.slice(shown);
    placeMore(row, more, tags[shown - 1], hidden.length, hidden.map(nameOf).join(', '), word);
    if (!overflows(row)) return;
  }

  if (tags.length === 1) dropMore(state); // The first tag always stands: it gives up its width and ends in an
  // ellipsis.

  setAttr(tags[0], SHRINK, true);
} // ---------------------------------------------------------- keys in a field


function inField(row) {
  return Boolean(row.closest('.sf-input-field')) && !row.closest(MANAGED);
}

function groupOf(row) {
  if (!inField(row)) return [];
  return tagsOf(row).filter(tag => tag.closable && !tag.disabled && !tag.hasAttribute(OVER));
} // The tag's stop: its label button when it has one (a checkbox or an
// interactive tag), else its cross.
// Asked at the call, so a name the page registers later is found too.


const crossButton = () => `:scope > .sf-tag > ${(0,_core_js_tag_aliases_js__WEBPACK_IMPORTED_MODULE_0__.tagSelector)('sf-button-close')} button, :scope > .sf-tag > .sf-icon-button`;

function stopOf(tag) {
  return tag.querySelector(':scope > button.sf-tag, :scope > a.sf-tag[href], :scope > .sf-tag > .sf-tag-action') || tag.querySelector(crossButton());
}
function stopsIn(tag) {
  return [...tag.querySelectorAll('button, a[href]')];
}

function untab(row, state) {
  const group = groupOf(row);
  const was = state.group || []; // Tags that left the group get their own stops back.

  for (const tag of was) {
    if (group.includes(tag)) continue;

    for (const button of stopsIn(tag)) if (button.dataset.sfTagRoving !== undefined) {
      button.removeAttribute('tabindex');
      delete button.dataset.sfTagRoving;
    }
  }

  state.group = group;

  if (group.length < 2) {
    for (const tag of group) for (const button of stopsIn(tag)) if (button.dataset.sfTagRoving !== undefined) {
      button.removeAttribute('tabindex');
      delete button.dataset.sfTagRoving;
    }

    return;
  }

  if (state.active >= group.length) state.active = group.length - 1;
  if (state.active < 0) state.active = 0;
  group.forEach((tag, index) => {
    const stop = stopOf(tag);

    for (const button of stopsIn(tag)) {
      const tabIndex = button === stop && index === state.active ? '0' : '-1';
      if (button.getAttribute('tabindex') !== tabIndex) button.setAttribute('tabindex', tabIndex);
      button.dataset.sfTagRoving = '';
    }
  });
}

function said(doc) {
  let line = doc.querySelector('[data-sf-tag-said]');

  if (!line) {
    line = doc.createElement('div');
    line.setAttribute('data-sf-tag-said', '');
    line.setAttribute('aria-live', 'polite');
    line.setAttribute('role', 'status'); // Out of view, read: the visually hidden pattern, one Framework pixel.

    line.style.cssText = 'position:absolute;inline-size:var(--sf-px);block-size:var(--sf-px);overflow:hidden;clip-path:inset(50%);white-space:nowrap;';
    doc.body.append(line);
  }

  return line;
}

function announce(tag, index, total) {
  const text = tag.sfWord?.('position', {
    vars: {
      label: nameOf(tag),
      position: index + 1,
      total
    }
  }) || '';
  if (!text) return;
  const line = said(tag.ownerDocument);
  line.textContent = '';
  requestAnimationFrame(() => {
    line.textContent = text;
  });
}

function focusAt(row, state, index) {
  const group = groupOf(row);
  if (!group.length) return;
  state.active = Math.max(0, Math.min(index, group.length - 1));
  untab(row, state);
  const tag = group[state.active];
  stopOf(tag)?.focus();
}

function onKeydown(row, state, event) {
  const group = state.group || [];
  if (group.length < 2) return;
  const index = group.findIndex(tag => tag.contains(event.target));
  if (index < 0) return;
  const rtl = getComputedStyle(row).direction === 'rtl';
  const back = rtl ? 'ArrowRight' : 'ArrowLeft';
  const ahead = rtl ? 'ArrowLeft' : 'ArrowRight';
  const {
    key
  } = event;

  if (key === back || key === ahead || key === 'Home' || key === 'End') {
    event.preventDefault();
    const next = key === 'Home' ? 0 : key === 'End' ? group.length - 1 : Math.max(0, Math.min(group.length - 1, index + (key === ahead ? 1 : -1)));
    focusAt(row, state, next);
    return;
  }

  if (key === 'Delete' || key === 'Backspace') {
    event.preventDefault();
    const tag = group[index];
    tag.onClose?.(); // The host removes the tag (sf-tag-close); the focus then goes to the
    // neighbour that took its place, or the one before the last.

    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (tag.isConnected && groupOf(row).includes(tag)) return;
      untab(row, state);
      const left = state.group || [];
      if (left.length) focusAt(row, state, Math.min(index, left.length - 1));
    }));
  }
}

function onFocusin(row, state, event) {
  const group = state.group || [];
  if (group.length < 2) return;
  const index = group.findIndex(tag => tag.contains(event.target));
  if (index < 0) return;

  if (index !== state.active) {
    state.active = index;
    untab(row, state);
  }

  announce(group[index], index, group.length);
} // ---------------------------------------------------------- the record


function settle(row, state) {
  state.frame = 0;

  if (!row.isConnected || !tagsOf(row).length) {
    forget(row);
    return;
  }

  state.busy = true;

  try {
    fit(row, state);
    untab(row, state);
  } finally {
    // The changes made here are not news: the observers' records of them are
    // taken before the next frame.
    state.mutations?.takeRecords();
    state.busy = false;
  }
}

function schedule(row, state) {
  if (state.frame) return;
  state.frame = requestAnimationFrame(() => settle(row, state));
}

function forget(row) {
  const state = rows().get(row);
  if (!state) return;
  state.resize?.disconnect();
  state.mutations?.disconnect();
  row.removeEventListener('keydown', state.keydown);
  row.removeEventListener('focusin', state.focusin);
  if (state.frame) cancelAnimationFrame(state.frame);
  dropMore(state);
  rows().delete(row);
}
/** A tag that drew (or moved) asks its row to be laid out again. */


function tagInRow(tag) {
  const row = tag.parentElement;
  if (!row || typeof requestAnimationFrame !== 'function') return; // A group lays out and walks its own tags (sf-tag-group): it is told.

  if (row.localName === 'sf-tag-group') {
    row.sfTagDrew?.();
    return;
  }

  let state = rows().get(row);

  if (!state) {
    state = {
      frame: 0,
      more: null,
      group: [],
      active: 0,
      busy: false
    };
    rows().set(row, state);

    if (typeof ResizeObserver === 'function') {
      let width = -1;
      state.resize = new ResizeObserver(([entry]) => {
        const now = Math.round(entry?.contentRect?.width ?? 0);
        if (now === width) return;
        width = now;
        schedule(row, state);
      });
      state.resize.observe(row);
    }

    if (typeof MutationObserver === 'function') {
      state.mutations = new MutationObserver(() => {
        if (!state.busy) schedule(row, state);
      });
      state.mutations.observe(row, {
        childList: true
      });
    }

    state.keydown = event => onKeydown(row, state, event);

    state.focusin = event => onFocusin(row, state, event);

    row.addEventListener('keydown', state.keydown);
    row.addEventListener('focusin', state.focusin);
  }

  schedule(row, state);
}
/** A tag that left asks the row it stood in to be laid out again. */

function tagLeftRow(row) {
  const state = row && rows().get(row);
  if (state) schedule(row, state);
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "a038e9885b82"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderTagTemplate: () => (/* binding */ renderTagTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var _default_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("eab03d52c052");
/* harmony import */ var _close_size_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("b22d4f28d908");
/* harmony import */ var _avatar_js_picture__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("c69a3dc158df");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, _avatar_js_picture__WEBPACK_IMPORTED_MODULE_3__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, _avatar_js_picture__WEBPACK_IMPORTED_MODULE_3__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);



 // Sizes 1, 2 and 3 take the larger dot; 1/2 and 1/3 the smaller.

const LARGE_SIZES = new Set(['1', '2', '3']);

function dotSize(size) {
  return LARGE_SIZES.has(size) ? '1/2' : '1/3';
} // A filter tag shows no mark until it is chosen; chosen, a check mark stands
// before the label on the primary container fill (owner decision C145 (2),
// tags study #q-selected B). The empty checkbox square on every tag is gone:
// the row read as a form of check boxes. The mark is an sf-icon, the picture
// of the tag's size (tag - 8, C58), so its name joins the icon request.


function renderCheckboxIcon(context) {
  if (context.component?.hasSlotContent?.('leading')) return context.component.getSlotContent('leading');
  return context.active ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-icon icon="check" root-class="sf-tag-icon sf-tag-check" aria-hidden="true"></sf-icon>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
} // The icon is an sf-icon, as in every other component: the element tells the
// Loader its name, so the name joins the icon font request. A bare
// <i class="sf-icon"> drawn here after the page's scan never did -- its glyph
// stayed blank (buttons review 2026-11-09: label missing from icon_names).


function renderGenericIcon(context) {
  const iconName = context.icon || 'sell';
  return context.component?.hasSlotContent?.('leading') ? context.component.getSlotContent('leading') : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-icon icon=${iconName} root-class="sf-tag-icon" aria-hidden="true"></sf-icon>`;
} // A colour from data is a dot of the static palette before the label; the
// tag itself stays neutral (owner decision C145 (7), tags study #q-color B):
// selection and hover read the same on every tag, and a label colour never
// mimics a status. The hue's role set (.sf-hue-<name>, core) gives the dot its
// strong fill in both themes.


function renderColorIcon(context) {
  if (context.component?.hasSlotContent?.('leading')) return context.component.getSlotContent('leading');
  const classes = ['sf-tag-color-icon', context.hue ? `sf-tag-color-icon--hue sf-hue-${context.hue}` : '', context.colorClass || ''].filter(Boolean);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class=${classes.join(' ')} aria-hidden="true"></span>`;
}

function renderStatusDot(context) {
  return context.component?.hasSlotContent?.('leading') ? context.component.getSlotContent('leading') : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                <span class="sf-dot sf-dot--size-${dotSize(context.size)}" aria-hidden="true">
                    <div class="sf-dot-item"></div>
                </span>
        `;
} // The avatar is sf-avatar's own drawing (js/picture.js, avatar study AV-8):
// the photo an <img> filling the circle, the initials on the neutral plate,
// the person glyph without either. It was a background image here.


function renderAvatar(context) {
  if (context.component?.hasSlotContent?.('avatar')) {
    return context.component.getSlotContent('avatar');
  }

  return (0,_avatar_js_picture__WEBPACK_IMPORTED_MODULE_3__.avatarPicture)({
    size: '1/4',
    imageUrl: context.avatarImageUrl,
    text: context.avatarText
  });
}

function renderLeading(context) {
  // A link carries no check mark (C145 (6)).
  if (context.href && context.type === 'checkbox') return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;

  switch (context.type) {
    case 'checkbox':
      return renderCheckboxIcon(context);

    case 'icon':
      return renderGenericIcon(context);

    case 'color':
      return renderColorIcon(context);

    case 'avatar':
      return renderAvatar(context);

    case 'info':
    case 'success':
    case 'error':
    case 'warning':
      return renderStatusDot(context);

    default:
      return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  }
}

function renderCount(context) {
  if (context.type !== 'default') return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return context.component?.hasSlotContent?.('count') ? context.component.getSlotContent('count') // No count, no element: an empty one kept its padding and the gap
  // before it, an empty band at the end of every tag (owner, 2026-10-14).
  : context.count ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-tag-count pointer-events-none flex">${context.count}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
} // The remove button is sf-button-close, plain (owner decision C14: a tag's
// remove has no spot, the cross darkens and the ring stands around it). It was
// sf-button-icon kind="close", the name C14 retired (LK-06); before that link,
// the alias F3 of pair ui-a0370c0c99fb counted on every closable tag.


function renderClose(context) {
  if (!context.closable) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return context.component?.hasSlotContent?.('close') ? context.component.getSlotContent('close') : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                <sf-button-close
                        size="${(0,_close_size_js__WEBPACK_IMPORTED_MODULE_2__.closeSize)(context.size)}"
                        appearance="plain"
                        ?disabled=${context.disabled}
                        aria-label=${context.closeLabel}
                        @click="${e => {
    e.stopPropagation();
    context.component.onClose();
  }}"
                ></sf-button-close>
        `;
} // A status on a tag that is neither pressed nor removed is a badge (owner
// decision C140 (6), badges study BG-6): the tag draws the tonal badge of the
// same status -- the same container fill, the same hue -- in the badge's size
// for a row of the tag's size (host -> badge: 1/3 in rows 1/3 to 1, 1/2 in a
// row 2, 1 in a row 3), or on the tag's line when it has one. Status on a tag
// is for a filter or a chosen value: interactive or closable.


const BADGE_FOR_TAG = {
  '1/3': '1/3',
  '1/2': '1/3',
  '1': '1/3',
  '2': '1/2',
  '3': '1'
};

function renderStatusBadge(context, textContent) {
  const classes = ['sf-badge', 'sf-badge--tonal', `sf-badge--${context.status}`, `sf-badge--size-${BADGE_FOR_TAG[context.size] || '1/3'}`, context.line ? `sf-badge--line-${context.line}` : '', 'sf-tag-badge', 'inline-flex', 'flex-row', 'flex-nowrap', 'justify-center', 'items-center', `${context.rootClass || ''}`].filter(Boolean);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class=${classes.join(' ')} style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}><span
        class="sf-badge-text-container flex items-center"><span
        class="sf-badge-text">${textContent}</span></span></span>`;
} // A tag that leads to a page (owner decision C145 (6), tags study #q-link B):
// the whole tag is one native link, with no check mark and no cross; its
// label underlines on hover like any link (component.tags, .sf-tag--link).
// A tag list of an article (Docara, Larena sites) is the use.


function renderLinkTag(context, textContent) {
  const classes = ['sf-tag', `sf-tag--${context.status || (context.kind === 'checkbox' ? 'default' : context.kind) || 'default'}`, context.appearance && context.appearance !== 'default' ? `sf-tag--appearance-${context.appearance}` : '', `sf-tag--size-${context.size}`, context.height && context.height !== 'default' ? `sf-tag--height-${context.height}` : '', context.inline ? 'sf-tag--inline' : '', context.line ? `sf-tag--line-${context.line}` : '', 'sf-tag--link', 'inline-flex', 'flex-row', 'flex-nowrap', 'items-center', `${context.rootClass}`, context.disabled ? 'disabled' : ''].filter(Boolean); // A disabled link leads nowhere: no href, aria-disabled, out of the Tab order.

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<a
            class=${classes.join(' ')}
            style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            href=${context.disabled ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : context.href}
            aria-disabled=${context.disabled ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            aria-label=${context.ariaLabel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            data-tooltip=${context.cutTooltipId || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    >${renderLeading(context)}<span class="sf-tag-container pointer-events-none">${textContent}</span>${renderCount(context)}${renderCutTooltip(context)}</a>`;
} // The Framework's plain tooltip (component.tooltip, class markup), hidden
// until the tooltip controller shows it on hover or keyboard focus of the
// trigger: a name cut with an ellipsis says itself whole (owner decision C58;
// tags study TG-1). The label stays whole in the markup, so a screen reader
// hears all of it; the tooltip is for the eye.


function renderCutTooltip(context) {
  if (!context.cutTooltipId) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span id=${context.cutTooltipId} class="sf-tooltip sf-tooltip--dark sf-tooltip--size-1/3 sf-tag-tooltip" aria-hidden="true" hidden><span class="sf-tooltip-content"><span class="sf-tooltip-text">${context.cutText}</span></span></span>`;
}

function renderTagTemplate(context) {
  const textContent = context.component?.hasSlotContent?.('text') ? context.component.getSlotContent('text') : context.text; // A tag with an address is a link first (C145 (6)), whatever its status.

  if (context.href) return renderLinkTag(context, textContent);

  if (context.status && !context.interactive && !context.closable) {
    return renderStatusBadge(context, textContent);
  }

  const classes = ['sf-tag', // One class still carries both answers, because the styles are written
  // that way: a status wins when it is set, exactly as the single list did.
  `sf-tag--${context.status || context.kind || context.type}`, // A named appearance carries its own class, because it is a different axis
  // from the type: the default appearance adds nothing.
  context.appearance && context.appearance !== 'default' ? `sf-tag--appearance-${context.appearance}` : '', `sf-tag--size-${context.size}`, // The height class (1.4.0, C27); spacing is read into it by the element.
  context.height && context.height !== 'default' ? `sf-tag--height-${context.height}` : '', context.inline ? 'sf-tag--inline' : '', context.line ? `sf-tag--line-${context.line}` : '', 'inline-flex', 'flex-row', 'flex-nowrap', 'items-center', `${context.rootClass}`, context.type === 'checkbox' || context.interactive ? 'sf-tag--interactive' : '', context.closable ? 'sf-tag--removable' : '', context.active ? 'active' : '', context.disabled ? 'disabled' : ''].filter(Boolean);
  const content = (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
            ${renderLeading(context)}
            <span class="sf-tag-container pointer-events-none">${textContent}</span>
            ${renderCount(context)}
            ${renderClose(context)}
    `; // A removable checkbox tag is two controls side by side, the toggle and
  // the remove action, because a button cannot hold another button.

  if (context.type === 'checkbox' && context.closable) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
            <div
                    class=${classes.join(' ')}
                    style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            >
                ${renderCutTooltip(context)}
                <button
                        type="button"
                        class="sf-tag-action inline-flex flex-row flex-nowrap items-center min-w-0"
                        aria-label=${context.ariaLabel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                        aria-pressed=${String(context.active)}
                        data-tooltip=${context.cutTooltipId || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                        ?disabled=${context.disabled}
                        @click=${() => context.component.onToggle()}
                >
                    ${renderLeading(context)}
                    <span class="sf-tag-container pointer-events-none">${textContent}</span>
                    ${renderCount(context)}
                </button>
                ${renderClose(context)}
            </div>
        `;
  }

  if (context.type === 'checkbox') {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
            <button
                    type="button"
                    class=${classes.join(' ')}
                    style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    aria-label=${context.ariaLabel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    aria-pressed=${String(context.active)}
                    data-tooltip=${context.cutTooltipId || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    ?disabled=${context.disabled}
                    @click=${() => context.component.onToggle()}
            >${content}${renderCutTooltip(context)}</button>
        `;
  }

  if (context.interactive) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
            <div
                    class=${classes.join(' ')}
                    style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            >
                ${renderCutTooltip(context)}
                <button
                        type="button"
                        class="sf-tag-action inline-flex flex-row flex-nowrap items-center min-w-0"
                        aria-label=${context.ariaLabel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                        data-tooltip=${context.cutTooltipId || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                        ?disabled=${context.disabled}
                >
                    ${renderLeading(context)}
                    <span class="sf-tag-container pointer-events-none">${textContent}</span>
                    ${renderCount(context)}
                </button>
                ${renderClose(context)}
            </div>
        `;
  }

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div
                class=${classes.join(' ')}
                style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                data-tooltip=${context.cutTooltipId || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        >${content}${renderCutTooltip(context)}</div>
    `;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "eab03d52c052"
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

/***/ "e92fd2d1a38c"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("instance-path", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("instance-path", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "9d9903b87148"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit/directives/keyed.js", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("lit/directives/keyed.js", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "2a080a730149"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("lit", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "deb1a4d61565"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("smart-base", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("smart-base", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "a6b3ed0c1589"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AVATAR_HUES: () => (/* binding */ AVATAR_HUES),
/* harmony export */   AVATAR_TONES: () => (/* binding */ AVATAR_TONES),
/* harmony export */   STATIC_HUES: () => (/* binding */ STATIC_HUES),
/* harmony export */   TONE_HUES: () => (/* binding */ TONE_HUES),
/* harmony export */   avatarHue: () => (/* binding */ avatarHue),
/* harmony export */   avatarTone: () => (/* binding */ avatarTone),
/* harmony export */   avatarToneHash: () => (/* binding */ avatarToneHash),
/* harmony export */   resolveAvatarHue: () => (/* binding */ resolveAvatarHue),
/* harmony export */   resolveAvatarTone: () => (/* binding */ resolveAvatarTone)
/* harmony export */ });
// sf-avatar's hue from a name, without a document: a plain function of its
// argument, so tests/avatar-tones.contract.test.mjs runs it in Node and a server
// can print the same class in the first paint. docs/docs.md gives the algorithm
// for a server in another language.
//
// Owner decision C17 (2026-11-08): avatars have no colours of their own. The
// initials take a hue of the static palette (the hue setting, the class
// sf-hue-<name>); the eight tones of initials are gone, and `auto` picks among
// eight static hues in the old order, so a name keeps its slot: rose is pink,
// the former violet (HCT hue 325) is purple, the other six keep their names.
// A former tone moves at most 15 degrees (dispatcher, 2026-11-09).
//
// FNV-1a, 32 bits, over the UTF-8 bytes of the string exactly as given (no
// trimming, no case folding, no normalisation), its high half folded onto the
// low one, because the low bits of FNV-1a alone follow the low bits of the
// input; the remainder by the length of the list picks the tone.
//
// The list and its order are part of the algorithm: a name keeps its tone only
// while they stay. A later named tone does not join `auto`.
const AVATAR_HUES = Object.freeze(['pink', 'amber', 'lime', 'green', 'teal', 'sky', 'indigo', 'purple']);

// Every hue a setting may name: the static palette (theme-palette.js
// STATIC_HUES, tests/avatar-tones.contract.test.mjs holds the two equal).
const STATIC_HUES = Object.freeze(['red', 'orange', 'amber', 'yellow', 'lime', 'green', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'pink', 'brown', 'gray']);

// The former tone setting and its names, until 2027-01-01 (journal
// attribute-c17-avatar-tone-to-hue, value-c17-avatar-rose-to-pink, which
// also carries violet to purple).
const AVATAR_TONES = Object.freeze(['rose', 'amber', 'lime', 'green', 'teal', 'sky', 'indigo', 'violet']);
const TONE_HUES = Object.freeze({rose: 'pink', violet: 'purple'});

const FNV_OFFSET = 0x811c9dc5;
const FNV_PRIME = 0x01000193;

function avatarToneHash(name) {
  let hash = FNV_OFFSET;
  for (const byte of new TextEncoder().encode(String(name))) {
    hash = Math.imul(hash ^ byte, FNV_PRIME) >>> 0;
  }
  return (hash ^ (hash >>> 16)) >>> 0;
}

// No name, no hue: the neutral look.
function avatarHue(name) {
  const text = name === undefined || name === null ? '' : String(name);
  return text ? AVATAR_HUES[avatarToneHash(text) % AVATAR_HUES.length] : '';
}

// The hue a setting asks for: a named one as it is, auto the one of the name,
// empty (or a name the palette does not have) the neutral look. The former
// tone setting is read when hue is empty, its rose as pink and its violet as purple.
function resolveAvatarHue(hue, name, tone = '') {
  const setting = hue || TONE_HUES[tone] || tone || '';
  if (setting === 'auto') return avatarHue(name);
  return STATIC_HUES.includes(setting) ? setting : '';
}

// The former names (2027-01-01): the tone of a name in the old words.
function avatarTone(name) {
  const text = name === undefined || name === null ? '' : String(name);
  return text ? AVATAR_TONES[avatarToneHash(text) % AVATAR_TONES.length] : '';
}

function resolveAvatarTone(setting, name) {
  return setting === 'auto' ? avatarTone(name) : setting || '';
}


/***/ },

/***/ "109c3b010316"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   files: () => (/* binding */ files)
/* harmony export */ });
/* harmony import */ var _en_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d65b1989605d");
// Written by scripts/build-language-packs.mjs from src/core/lang/built-in.json
// (owner decision C282); do not edit. The words this bundle carries: the
// built-in languages' (en); every other language comes from
// a language file (core/lang/<code>.js or its parts).


const files = { en: { runtime: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime } };

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ en: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime });


/***/ },

/***/ "e01b02206b25"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-tag for the shim (stands/18-aliases-ci/alias.mjs, standard §16 item 20). mode: same-detail (the shim sends the new and the old name), split / detail-adds (a detail adapter, refused by the shim), attribute-and-property, method, property, manifest-only (the DOM name does not change), host-attribute (no shim), retired.","component":"sf-tag","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"aria-label","to":null,"kind":"attribute","component":"sf-tag","since":"2026-10-27","remove_after":"2026-12-01","mode":"host-attribute","section":"§3.1","note":"stays a host attribute, read by the base (§3.1, §4.8); no shim"},{"from":"close","to":"sf-tag-close","kind":"event","component":"sf-tag","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","cancelable":false,"manifest":{"from":"sf-tag-close","to":"close"},"section":"§8","note":"the old DOM name of the request; the element left the detail (§8), the rest is the same","alias-table":{"to":"sf-tag-close","status":"planned","alias_mode":"same-detail"}},{"from":"quantity","to":"default","kind":"value","setting":"kind","component":"sf-tag","since":"2026-10-27","remove_after":"2026-12-01","section":"§16 item 20","note":"journal value-tag-quantity-to-default; the number stays in count"},{"from":"surface","to":"outline","kind":"value","setting":"appearance","component":"sf-tag","since":"2026-11-10","remove_after":"2027-01-01","section":"§16 item 20","note":"C15 retired surface; journal value-tag-appearance-surface-to-outline"}]}');

/***/ },

/***/ "7eee137ec5ff"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.tag","tag":"sf-tag","version":"1.13.0","kind":"leaf","settings":{"kind":{"type":"enum","values":["checkbox","icon","default","color","avatar"],"default":"default"},"status":{"type":"enum","values":["","info","success","warning","error"],"default":""},"appearance":{"type":"enum","values":["default","outline","ghost","surface"],"default":"default"},"size":{"type":"enum","values":["1/3","1/2","1","2","3"],"default":"1/2"},"line":{"type":"enum","values":["","1/2","1","2"],"default":""},"height":{"type":"enum","values":["low","default","high","highest"],"default":"default"},"spacing":{"type":"enum","values":["compact","normal","comfortable","spacious"],"default":"normal"},"inline":{"type":"boolean","default":false},"text":{"type":"string","default":""},"href":{"type":"string","default":""},"key":{"type":"string","default":""},"count":{"type":"string","default":""},"icon":{"type":"icon","default":""},"color-class":{"type":"string","default":""},"color":{"type":"string","default":""},"avatar-image-url":{"type":"string","default":""},"avatar-text":{"type":"string","default":""},"avatar-status":{"type":"string","default":""},"disabled":{"type":"boolean","default":false},"closable":{"type":"boolean","optional":true},"interactive":{"type":"boolean","default":false},"close-label":{"type":"string","default-from":"runtime.remove"}},"values":{"active":{"type":"boolean","default":false}},"events":{"change":{"carries":{"active":"boolean"}},"close":{"carries":{}}},"actions":{},"css-variables":{"--sf-tag-background-color":{"type":"color","state":"default"},"--sf-tag-color":{"type":"color","state":"default"},"--sf-tag-radius":{"type":"length","state":"default"},"--sf-tag-padding-inline":{"type":"length","state":"default"},"--sf-tag-padding-block":{"type":"length","state":"default"},"--sf-tag-gap":{"type":"length","state":"default"}}}');

/***/ },

/***/ "d65b1989605d"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Tags","runtime":{"remove":"Remove","remove-named":"Remove {label}","more":{"one":"{n} more: {names}","other":"{n} more: {names}"},"position":"{label}, {position} of {total}, Delete to remove"}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("fed59e5c8a07");
/******/
/******/ })()
;