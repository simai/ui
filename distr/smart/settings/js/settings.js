/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "51250bf01ab0"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createPreferences: () => (/* binding */ createPreferences),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// SF.Preferences: what a person changes about how a thing looks -- column
// order, widths, sort, density, a menu's column widths -- kept one way for
// every component (owner, 2026-10-14; ui-control
// control/designs/2026-10-14-view-preferences.md).
//
// - A preference is a plain JSON value under a key `<component>/<instance>`,
//   e.g. `sf-table/cms.solutions`. No key, nothing is kept.
// - It is read synchronously, so a component applies it before its first
//   paint: the skeleton is already in the person's order.
// - The browser keeps a copy always (localStorage `sf-pref:<key>`), the cache
//   a first paint can read. A host that keeps preferences for its user
//   (Larena) plugs in with useHost(); its values win over the cache, and every
//   write goes to it as well, debounced per key.
// - A page can preload the host's values: preload({key: value}), or a
//   <script type="application/json" data-sf-preferences> (or id
//   "sf-preferences") in the page, read before the first value is.
//
// The registry lives on globalThis.SF: every bundle carries its own copy of
// this module, and two copies with two caches would disagree.
const PREFIX = 'sf-pref:';
const DELAY = 400;
const KEY = /^[\w.*:-]+(?:\/[\w.*:/-]+)?$/u;

function storage() {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

function validKey(key) {
  return typeof key === 'string' && key.length > 0 && key.length <= 200 && KEY.test(key);
}

function same(a, b) {
  try {
    return JSON.stringify(a) === JSON.stringify(b);
  } catch {
    return false;
  }
}

function plain(value) {
  return value === null || value === undefined ? null : JSON.parse(JSON.stringify(value));
}

function createPreferences() {
  const host = {
    adapter: null,
    values: new Map()
  };
  const listeners = new Map();
  const timers = new Map(); // The page's own block of the host's values, read once, before the first
  // read: a component may connect before this module's start-up ran.

  let inlineRead = false;

  const readInline = () => {
    if (inlineRead) return;
    const node = globalThis.document?.querySelector?.('script[type="application/json"][data-sf-preferences], script#sf-preferences[type="application/json"]');
    if (!node) return;
    inlineRead = true;

    try {
      api.preload(JSON.parse(node.textContent || '{}'));
    } catch {
      /* not JSON: ignored */
    }
  };

  const notify = (key, value) => {
    for (const listener of listeners.get(key) ?? []) {
      try {
        listener(plain(value), key);
      } catch (error) {
        console.error('SF.Preferences listener failed', key, error);
      }
    }
  };

  const readCache = key => {
    const store = storage();
    if (!store) return null;

    try {
      const raw = store.getItem(PREFIX + key);
      return raw === null ? null : JSON.parse(raw);
    } catch {
      return null;
    }
  };

  const writeCache = (key, value) => {
    const store = storage();
    if (!store) return;

    try {
      if (value === null) store.removeItem(PREFIX + key);else store.setItem(PREFIX + key, JSON.stringify(value));
    } catch {// A full or refused storage keeps the value for this page only.
    }
  };

  const saveToHost = key => {
    clearTimeout(timers.get(key));
    timers.delete(key);
    const adapter = host.adapter;
    if (!adapter) return;
    const value = host.values.has(key) ? host.values.get(key) : readCache(key);

    try {
      const answer = value === null ? adapter.remove?.(key) : adapter.save?.(key, plain(value));
      Promise.resolve(answer).catch(error => console.warn('SF.Preferences: the host did not keep', key, error));
    } catch (error) {
      console.warn('SF.Preferences: the host did not keep', key, error);
    }
  };

  const schedule = key => {
    if (!host.adapter) return;
    clearTimeout(timers.get(key));
    timers.set(key, setTimeout(() => saveToHost(key), DELAY));
  };

  const api = {
    // The value for a key: the host's when it gave one, else this browser's.
    read(key) {
      if (!validKey(key)) return null;
      readInline();
      if (host.values.has(key)) return plain(host.values.get(key));
      return plain(readCache(key));
    },

    // Several keys from the most general to the most particular, merged field
    // by field: `sf-table/*` (the person's tables) under `sf-table/<instance>`.
    readMerged(...keys) {
      const merged = {};
      let found = false;

      for (const key of keys.flat()) {
        const value = api.read(key);

        if (value && typeof value === 'object' && !Array.isArray(value)) {
          Object.assign(merged, value);
          found = true;
        }
      }

      return found ? merged : null;
    },

    write(key, value) {
      if (!validKey(key)) return false;
      const next = plain(value); // The value already kept is not written again: a component restoring
      // what the host gave it (sf-resizer's value) sent it back to the host on
      // every load (docs trial 5).

      if (JSON.stringify(api.read(key)) === JSON.stringify(next)) return true;
      if (host.values.has(key)) host.values.set(key, next);
      writeCache(key, next);
      schedule(key);
      return true;
    },

    // «Сбросить вид»: gone from both.
    remove(key) {
      if (!validKey(key)) return false;
      if (host.values.has(key)) host.values.set(key, null);
      writeCache(key, null);
      schedule(key);
      notify(key, null);
      return true;
    },

    subscribe(key, listener) {
      if (!validKey(key) || typeof listener !== 'function') return () => {};
      if (!listeners.has(key)) listeners.set(key, new Set());
      listeners.get(key).add(listener);
      return () => listeners.get(key)?.delete(listener);
    },

    // The host's values for this person. Each that differs from this
    // browser's copy replaces it and is announced, so a component re-applies.
    preload(values) {
      if (!values || typeof values !== 'object') return;

      for (const [key, value] of Object.entries(values)) {
        if (!validKey(key)) continue;
        const next = plain(value);
        const before = api.read(key);
        host.values.set(key, next);
        writeCache(key, next);
        if (!same(before, next)) notify(key, next);
      }
    },

    // {save(key, value), remove(key), load?(keys) → Promise<{key: value}>}.
    useHost(adapter) {
      if (!adapter || typeof adapter.save !== 'function') throw new TypeError('A preferences host saves: {save(key, value)}');
      host.adapter = adapter;
      return api;
    },

    // Asks the host for keys it has not given yet (a component that appears
    // after the page loaded).
    async load(keys) {
      const wanted = [].concat(keys).filter(key => validKey(key) && !host.values.has(key));
      if (!wanted.length || typeof host.adapter?.load !== 'function') return;

      try {
        api.preload(await host.adapter.load(wanted));
      } catch (error) {
        console.warn('SF.Preferences: the host did not answer', wanted, error);
      }
    },

    get hosted() {
      return Boolean(host.adapter);
    },

    // Writes still waiting go now (a page that is leaving).
    flush() {
      for (const key of [...timers.keys()]) saveToHost(key);
    }

  }; // Another tab changed a preference.

  globalThis.addEventListener?.('storage', event => {
    if (!event.key?.startsWith(PREFIX) || event.storageArea !== storage()) return;
    const key = event.key.slice(PREFIX.length);
    if (host.values.has(key)) return;
    let value = null;

    try {
      value = event.newValue === null ? null : JSON.parse(event.newValue);
    } catch {
      value = null;
    }

    notify(key, value);
  });
  globalThis.addEventListener?.('pagehide', () => api.flush());
  readInline();
  return Object.freeze(api);
}

if (typeof globalThis !== 'undefined') {
  globalThis.SF = globalThis.SF || {};
  if (!globalThis.SF.Preferences) globalThis.SF.Preferences = createPreferences();
}

const Preferences = globalThis.SF?.Preferences;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Preferences);


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

/***/ "31b7143e3e61"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SfSettings: () => (/* binding */ SfSettings),
/* harmony export */   rememberKey: () => (/* binding */ rememberKey)
/* harmony export */ });
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _core_js_preferences_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("51250bf01ab0");
/* harmony import */ var _core_js_tag_aliases_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("4a85acfb05c1");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("4bfbd0eebbca");
/* harmony import */ var _js_settings__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("bb67a9697f33");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("72cabd0f91e5");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("fb3a1cbd7459");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("0eadcd89fc76");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_tag_aliases_js__WEBPACK_IMPORTED_MODULE_3__, _js_templates_default__WEBPACK_IMPORTED_MODULE_4__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_tag_aliases_js__WEBPACK_IMPORTED_MODULE_3__, _js_templates_default__WEBPACK_IMPORTED_MODULE_4__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
// sf-settings: compact settings -- a few settings a person changes on the
// spot, a reader's theme and text size, a table's density, a chat's sound.
// The items are data, each holding its own value:
//
//   <sf-settings look="rows">
//     (the page's trigger: an icon button, a link)
//     <script type="application/json" data-sf-settings>{"items": [...]}</script>
//   </sf-settings>
//
// It composes sf-menu-context and draws nothing of its own (owner decision
// 2026-11-06): the items become the menu's entries, laid out by one attribute,
// look -- drill (the value under the name, the options in the same panel),
// rows (the name at the start, the control at the end) or tiles (the switches
// used most as tiles on top, the rest as rows). With a trigger (the trigger
// slot, the children without a slot, or for="<id>") the panel opens over the
// page against it; without one it stands open in the page's flow.
//
// A person's change is asked first (change, cancellable, before the write);
// then the value is written into its item and changed says so. remember keeps
// the values as a preference of the person (SF.Preferences
// sf-settings/<name>) and puts them back when the element meets its items.
// The menu's own events stay inside.
//
// From its component.json (standard simai.smart-component 1.3.14 §3, §4, §8):
// settings, values, actions and events are made by core/js/element-manifest.js.








 // The menu it draws, found under its current name and its former one.

const MENU = `:scope > .sf-settings-parts > ${(0,_core_js_tag_aliases_js__WEBPACK_IMPORTED_MODULE_3__.tagSelector)('sf-menu-context')}`;
const FOCUSABLE = 'button, a[href], input, select, textarea, [tabindex]';

const text = value => value === undefined || value === null ? '' : String(value).trim();

const same = (a, b) => a === b || Number.isNaN(a) && Number.isNaN(b); // The values are a preference of the person (SF.Preferences, owner
// 2026-10-14): in the browser under sf-pref:sf-settings/<remember>, and by a
// host that keeps preferences for its user. The registry is the shared one
// when core has published it (every bundle has its own copy).


const preferences = () => globalThis.SF?.Preferences || _core_js_preferences_js__WEBPACK_IMPORTED_MODULE_2__["default"];
/** The SF.Preferences key a remember name keeps the values under. */


const rememberKey = name => text(name) ? `sf-settings/${text(name)}` : '';
const SettingsElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_6__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_7__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_8__
  },
  source: 'ru'
});

class SfSettings extends SettingsElement {
  constructor() {
    super();
    this._declared = null;
    this._declaredFor = null;
    this._restoredFor = null;
    this._entries = {
      items: null,
      look: '',
      label: '',
      list: []
    };

    this._onDocumentClick = event => this.onDocumentClick(event);

    this._onHostClick = event => this.onHostClick(event);
  } // The trigger is the default slot (component.json): the children the page
  // wrote without a slot attribute, taken live like the named ones. The JSON
  // island is read and taken out before (element-manifest.js).


  onConnected() {
    super.onConnected?.();
    const live = this._liveSlotNodes;

    if (live && !live.has('trigger')) {
      const nodes = Array.from(this.children).filter(child => !child.hasAttribute('slot') && !child.hasAttribute('data-sf-static') && child.localName !== 'script' && child.localName !== 'template');

      if (nodes.length) {
        nodes.forEach(node => node.remove());
        live.set('trigger', nodes);
      }
    }

    document.addEventListener('click', this._onDocumentClick);
    this.addEventListener('click', this._onHostClick);
  }

  disconnectedCallback() {
    document.removeEventListener('click', this._onDocumentClick);
    this.removeEventListener('click', this._onHostClick);
    super.disconnectedCallback?.();
  } // ------------------------------------------------------------- the values
  // The declared values: the ones the items carried when the page gave them,
  // taken once per list the page gave. reset puts them back.


  declaredValues() {
    if (this._declaredFor !== this.items) {
      this._declared = (0,_js_settings__WEBPACK_IMPORTED_MODULE_5__.valueMap)(this.items);
      this._declaredFor = this.items;
    }

    return this._declared;
  } // The items after a write the element made itself: the declared snapshot
  // stays the page's, and a remembered element keeps the values.


  writeItems(list) {
    this.declaredValues();
    this._declaredFor = list;
    this._restoredFor = list;
    this.items = list;
    this.keep();
  }
  /** Every setting's value by its id: {theme: 'dark', sound: true, scale: 110}. */


  get values() {
    this.restore();
    return (0,_js_settings__WEBPACK_IMPORTED_MODULE_5__.valueMap)(this.items);
  } // A remembered element puts the person's values back into the items the
  // first time it meets them -- before its first drawing, so the panel never
  // shows one value and then another. Nothing is announced: the page reads
  // values, as after setAll.


  restore() {
    const key = rememberKey(this.remember);
    const items = this.items;
    if (!key || this._restoredFor === items || !Array.isArray(items) || !items.length) return;
    this.declaredValues();
    this._restoredFor = items;
    let kept = null;

    try {
      kept = preferences().read(key);
    } catch {
      kept = null;
    }

    if (!kept || typeof kept !== 'object' || Array.isArray(kept)) return;
    const {
      list,
      count
    } = (0,_js_settings__WEBPACK_IMPORTED_MODULE_5__.rewriteValues)(items, item => Object.hasOwn(kept, item.id) ? (0,_js_settings__WEBPACK_IMPORTED_MODULE_5__.valuePatch)(item, kept[item.id]) : null);
    if (!count) return;
    this._declaredFor = list;
    this._restoredFor = list;
    this.items = list;
  }

  keep() {
    const key = rememberKey(this.remember);
    if (!key) return;

    try {
      preferences().write(key, (0,_js_settings__WEBPACK_IMPORTED_MODULE_5__.valueMap)(this.items));
    } catch {// A page without storage (private mode, blocked) still changes the value.
    }
  } // A person asks the menu for a value: the page is asked first, by this
  // element's change. Cancelled, the menu leaves the row as it was.


  onMenuChange(event) {
    event.stopPropagation();
    const {
      id,
      value,
      previous
    } = event.detail ?? {};
    const item = (0,_js_settings__WEBPACK_IMPORTED_MODULE_5__.findItem)(this.items, id);
    if (!item) return;
    const patch = (0,_js_settings__WEBPACK_IMPORTED_MODULE_5__.valuePatch)(item, value);
    const detail = {
      id,
      value,
      previous: previous ?? (0,_js_settings__WEBPACK_IMPORTED_MODULE_5__.itemValue)(item),
      item: { ...item,
        ...(patch ?? {})
      }
    };
    if (!patch || !this.sfEmit('change', detail, {
      cancelable: true
    })) event.preventDefault();
  } // The menu wrote the value into its row: the element writes it into the
  // item, keeps it, and says so.


  onMenuChanged(event) {
    event.stopPropagation();
    const {
      id,
      value,
      previous
    } = event.detail ?? {};
    const item = (0,_js_settings__WEBPACK_IMPORTED_MODULE_5__.findItem)(this.items, id);
    if (!item) return;
    const patch = (0,_js_settings__WEBPACK_IMPORTED_MODULE_5__.valuePatch)(item, value);
    if (!patch) return;
    const {
      list
    } = (0,_js_settings__WEBPACK_IMPORTED_MODULE_5__.rewriteValues)(this.items, one => one.id === id ? patch : null);
    this.writeItems(list);
    this.sfEmit('changed', {
      id,
      value,
      previous,
      item: { ...item,
        ...patch
      }
    });
  }
  /**
   * Writes one setting's value into its item: the page's answer to a
   * cancelled change, or a value restored on load. Raises nothing.
   * setValue('theme', 'dark') or setValue({id, value}).
   */


  setValue(target, given) {
    const {
      id,
      value
    } = target && typeof target === 'object' ? target : {
      id: target,
      value: given
    };
    const item = (0,_js_settings__WEBPACK_IMPORTED_MODULE_5__.findItem)(this.items, id);
    if (!item) return {
      outcome: 'refused',
      reason: 'not-found'
    };
    const patch = (0,_js_settings__WEBPACK_IMPORTED_MODULE_5__.valuePatch)(item, value);
    if (!patch) return {
      outcome: 'refused',
      reason: 'invalid'
    };
    if (same((0,_js_settings__WEBPACK_IMPORTED_MODULE_5__.itemValue)(item), patch.value)) return {
      outcome: 'applied'
    };
    this.writeItems((0,_js_settings__WEBPACK_IMPORTED_MODULE_5__.rewriteValues)(this.items, one => one.id === id ? patch : null).list);
    return {
      outcome: 'applied'
    };
  }
  /**
   * Writes a map of values at once -- {id: value} -- into the items that
   * carry those ids: a panel restored from storage. Raises nothing.
   */


  setAll(given) {
    const values = given && typeof given === 'object' && given.values && typeof given.values === 'object' ? given.values : given;
    const map = values && typeof values === 'object' && !Array.isArray(values) ? values : {};
    const {
      list,
      count
    } = (0,_js_settings__WEBPACK_IMPORTED_MODULE_5__.rewriteValues)(this.items, item => Object.hasOwn(map, item.id) ? (0,_js_settings__WEBPACK_IMPORTED_MODULE_5__.valuePatch)(item, map[item.id]) : null);
    if (!count) return {
      outcome: 'refused',
      reason: 'not-found',
      count
    };
    this.writeItems(list);
    return {
      outcome: 'applied',
      count
    };
  }
  /**
   * The declared values back. reset is asked first (cancellable); not
   * cancelled, every setting that moved goes back and changed says so once
   * for each.
   */


  reset() {
    const declared = this.declaredValues();
    if (!this.sfEmit('reset', {}, {
      cancelable: true
    })) return {
      outcome: 'cancelled'
    };
    const facts = [];
    const {
      list,
      count
    } = (0,_js_settings__WEBPACK_IMPORTED_MODULE_5__.rewriteValues)(this.items, item => {
      if (!Object.hasOwn(declared, item.id)) return null;
      const previous = (0,_js_settings__WEBPACK_IMPORTED_MODULE_5__.itemValue)(item);
      const value = declared[item.id];
      if (same(previous, value)) return null;
      const patch = (0,_js_settings__WEBPACK_IMPORTED_MODULE_5__.valuePatch)(item, value);
      if (patch) facts.push({
        id: item.id,
        value,
        previous,
        item: { ...item,
          ...patch
        }
      });
      return patch;
    });
    if (count) this.writeItems(list);

    for (const fact of facts) this.sfEmit('changed', fact);

    return {
      outcome: 'applied',
      count
    };
  }
  /**
   * Goes straight to one setting: a popup opens first; in the drill look the
   * panel opens the levels down to it; the focus goes to its row.
   */


  async show(given) {
    const id = given && typeof given === 'object' ? given.id : given;
    if (!(0,_js_settings__WEBPACK_IMPORTED_MODULE_5__.findItem)(this.items, id)) return {
      outcome: 'refused',
      reason: 'not-found'
    };
    await this.whenRendered?.();
    const menu = this.menu;
    if (!menu) return {
      outcome: 'unavailable',
      reason: 'no-panel'
    };
    await customElements.whenDefined('sf-menu-context');

    if (this.popup && !menu.isOpen) {
      const anchor = this.anchor();
      if (!anchor) return {
        outcome: 'unavailable',
        reason: 'no-trigger'
      }; // An outcome since sf-menu-context 1.12.2; a boolean before.

      const opened = await menu.openFor(anchor, {
        focus: 'none'
      });
      if (opened !== true && opened?.outcome !== 'applied') return {
        outcome: 'cancelled'
      };
    }

    if (this.look === 'drill') {
      const result = menu.show(id);
      if (result?.outcome !== 'applied') return result;
      return {
        outcome: 'applied'
      };
    }

    await menu.whenRendered?.();
    const row = [...menu.querySelectorAll('[data-sf-entry]')].find(one => menu.entryOf(one)?.id === id);
    const control = row?.matches('.sf-context-menu-value-row') ? row.querySelector(FOCUSABLE) : row;
    menu.syncMenuItems?.();
    control?.focus({
      preventScroll: false
    });
    return {
      outcome: 'applied'
    };
  } // ------------------------------------------------------------- the popup


  get menu() {
    return this.querySelector(MENU);
  } // The page's elements that open the panel: the slot's and those for names.


  triggers() {
    const own = [].concat(this._liveSlotNodes?.get('trigger') || []).filter(node => node instanceof Element);
    const ids = text(this.for).split(/\s+/u).filter(Boolean);
    const named = ids.map(one => document.getElementById(one)).filter(Boolean);
    return [...own, ...named];
  }
  /** Whether the panel opens over the page (it has a trigger) or stands inline. */


  get popup() {
    return Boolean(text(this.for)) || this.hasSlotContent('trigger');
  } // The control a trigger is: its native control when it is a Smart host.


  anchor(trigger = this.triggers()[0]) {
    if (!trigger) return null;
    return trigger.matches(FOCUSABLE) ? trigger : trigger.querySelector(FOCUSABLE) ?? trigger;
  }
  /** Opens or closes the panel of a popup against a trigger. */


  toggle(trigger) {
    const menu = this.menu;
    const anchor = this.anchor(trigger);
    if (!menu || !anchor || !this.popup) return;
    customElements.whenDefined('sf-menu-context').then(() => menu.toggleFor(anchor));
  }

  onHostClick(event) {
    if (event.defaultPrevented) return;
    const target = event.target instanceof Element ? event.target : null;
    const trigger = target && this.triggers().find(one => one.contains(target));
    if (trigger) this.toggle(trigger);
  }

  onDocumentClick(event) {
    if (event.defaultPrevented || !text(this.for) || !(event.target instanceof Element)) return;
    if (this.contains(event.target)) return;
    const trigger = this.triggers().find(one => one.contains(event.target) && !this.contains(one));
    if (trigger) this.toggle(trigger);
  } // The triggers say they open a menu (openFor says whether it is open).


  syncTriggers() {
    for (const trigger of this.triggers()) {
      const control = this.anchor(trigger);
      if (control && !control.hasAttribute('aria-haspopup')) control.setAttribute('aria-haspopup', 'menu');
      if (control && !control.hasAttribute('aria-expanded')) control.setAttribute('aria-expanded', 'false');
    }
  } // ------------------------------------------------------------- drawing
  // The entries are made again only when the items, the look or the words
  // change, so the menu is not handed a new list (and a new declared
  // snapshot) on every drawing.


  entries(look, tilesLabel) {
    const cache = this._entries;

    if (cache.items !== this.items || cache.look !== look || cache.label !== tilesLabel) {
      this._entries = {
        items: this.items,
        look,
        label: tilesLabel,
        list: (0,_js_settings__WEBPACK_IMPORTED_MODULE_5__.entriesFor)(this.items, look, {
          tilesLabel
        })
      };
    }

    return this._entries.list;
  }

  templateContext() {
    this.restore();
    const look = _js_settings__WEBPACK_IMPORTED_MODULE_5__.LOOKS.includes(this.look) ? this.look : 'drill';
    const size = _js_settings__WEBPACK_IMPORTED_MODULE_5__.SIZES.includes(this.size) ? this.size : '1/2';
    const popup = this.popup;
    this.sfHostState('data-look', look);
    return this.createTemplateContext({ ...this.getPropsContext(),
      component: this,
      look,
      size,
      popup,
      label: this.label,
      entries: this.entries(look, this.sfWord('tiles')),
      slot: name => this.getSlotContent(name),
      hasSlot: name => name === 'trigger' && this.hasSlotContent(name),
      rootClass: this.getRootClass()
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_4__.renderSettingsTemplate)(this.templateContext());
  }

  afterRender(changed) {
    super.afterRender?.(changed);
    this.syncTriggers();
  }

}

SfSettings.define('sf-settings');

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "bb67a9697f33"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LOOKS: () => (/* binding */ LOOKS),
/* harmony export */   SIZES: () => (/* binding */ SIZES),
/* harmony export */   TYPES: () => (/* binding */ TYPES),
/* harmony export */   entriesFor: () => (/* binding */ entriesFor),
/* harmony export */   findItem: () => (/* binding */ findItem),
/* harmony export */   holdsValue: () => (/* binding */ holdsValue),
/* harmony export */   itemValue: () => (/* binding */ itemValue),
/* harmony export */   rewriteValues: () => (/* binding */ rewriteValues),
/* harmony export */   tileItems: () => (/* binding */ tileItems),
/* harmony export */   valueMap: () => (/* binding */ valueMap),
/* harmony export */   valuePatch: () => (/* binding */ valuePatch)
/* harmony export */ });
// sf-settings' data: the items a page gives, their values, and the entries of
// sf-menu-context they become in each look. Pure functions, no DOM, so the
// contract test reads them without a browser.
//
// An item is a setting or what stands between settings:
//
//   {id, type: 'switch', text, value: true}                         a boolean
//   {id, type: 'choice', text, value: 'dark', options: [{id, text}]} one of a few
//   {id, type: 'range', text, value: 100, min, max, step, unit}      a number
//   {type: 'heading', text}, {type: 'separator'}
//   {type: 'group', text, items: [...]}                              a titled block
//
// The value lives in the item and nowhere else.
const LOOKS = ['drill', 'rows', 'tiles'];
const SIZES = ['1/2', '1'];
const TYPES = ['switch', 'choice', 'range', 'heading', 'separator', 'group'];
const VALUE_TYPES = new Set(['switch', 'choice', 'range']);

const isItem = item => Boolean(item) && typeof item === 'object' && TYPES.includes(item.type);

const optionsOf = item => Array.isArray(item?.options) ? item.options.filter(option => option && typeof option === 'object' && option.id !== undefined && option.id !== null) : [];
/** Whether an item holds a value (a switch, a choice or a range with an id). */


const holdsValue = item => isItem(item) && VALUE_TYPES.has(item.type) && typeof item.id === 'string' && item.id !== '';
/**
 * An item's value: a boolean for a switch, a number for a range, the chosen
 * option's id for a choice (its value, else the option marked checked, else
 * null).
 */

function itemValue(item) {
  if (item?.type === 'switch') return Boolean(item.value);

  if (item?.type === 'range') {
    const number = Number(item.value ?? item.min ?? 0);
    return Number.isFinite(number) ? number : 0;
  }

  if (item?.type === 'choice') {
    const options = optionsOf(item);
    if (item.value !== undefined && item.value !== null && options.some(option => option.id === item.value)) return item.value;
    return options.find(option => option.checked)?.id ?? null;
  }

  return null;
}
/**
 * What to write into an item to give it a value; null when the item cannot
 * hold that value (a choice without such an option, a range given no number).
 */

function valuePatch(item, value) {
  if (item?.type === 'switch') return typeof value === 'boolean' ? {
    value
  } : null;

  if (item?.type === 'range') {
    if (value === null || value === '' || typeof value === 'boolean') return null;
    const number = Number(value);
    return Number.isFinite(number) ? {
      value: number
    } : null;
  }

  if (item?.type === 'choice') return optionsOf(item).some(option => option.id === value) ? {
    value
  } : null;
  return null;
}
/** Every setting's value by its id, at the depth it sits. */

function valueMap(items, into = {}) {
  for (const item of Array.isArray(items) ? items : []) {
    if (holdsValue(item)) into[item.id] = itemValue(item);
    if (item?.type === 'group') valueMap(item.items, into);
  }

  return into;
}
/** The item carrying an id, at any depth; null when none does. */

function findItem(items, id) {
  for (const item of Array.isArray(items) ? items : []) {
    if (holdsValue(item) && item.id === id) return item;

    if (item?.type === 'group') {
      const found = findItem(item.items, id);
      if (found) return found;
    }
  }

  return null;
}
/**
 * The items with every setting a resolver answers for rewritten: a new list
 * (the lists above a rewritten item are copied), and how many were. A list
 * with nothing to change is given back as it was.
 */

function rewriteValues(items, resolve) {
  if (!Array.isArray(items)) return {
    list: items,
    count: 0
  };
  let count = 0;
  const list = items.map(item => {
    if (!item || typeof item !== 'object') return item;

    if (holdsValue(item)) {
      const patch = resolve(item);
      if (!patch) return item;
      count += 1;
      return { ...item,
        ...patch
      };
    }

    if (item.type === 'group') {
      const inner = rewriteValues(item.items, resolve);
      if (!inner.count) return item;
      count += inner.count;
      return { ...item,
        items: inner.list
      };
    }

    return item;
  });
  return {
    list: count ? list : items,
    count
  };
} // ─── entries of sf-menu-context ───────────────────────────────────────────

const own = (item, keys) => Object.fromEntries(keys.filter(key => item[key] !== undefined && item[key] !== null).map(key => [key, item[key]])); // One setting as a menu entry. A choice's value becomes its options' checked
// marks, the way the menu reads it; drill opens its options in the panel.


function settingEntry(item, look) {
  const base = { ...own(item, ['id', 'text', 'caption', 'icon', 'keywords']),
    type: item.type
  };
  if (item.disabled) base.disabled = true;
  if (item.type === 'switch') return { ...base,
    value: itemValue(item)
  };
  if (item.type === 'range') return { ...base,
    ...own(item, ['min', 'max', 'step', 'unit']),
    value: itemValue(item)
  };
  const value = itemValue(item);
  const options = optionsOf(item).map(option => ({ ...own(option, ['id', 'text', 'icon']),
    ...(option.disabled ? {
      disabled: true
    } : {}),
    checked: option.id === value
  }));
  return { ...base,
    ...(look === 'drill' ? {
      view: 'drill'
    } : {}),
    options
  };
} // The entries of a list of items: a group is its title (a heading) and its
// rows; an item of no known type is left out.


function entriesOf(items, look, skip) {
  const out = [];

  for (const item of Array.isArray(items) ? items : []) {
    if (!isItem(item)) continue;

    if (item.type === 'heading') {
      out.push({
        type: 'heading',
        text: item.text ?? ''
      });
    } else if (item.type === 'separator') {
      out.push({
        type: 'separator'
      });
    } else if (item.type === 'group') {
      const rows = entriesOf(item.items, look, skip);
      if (!rows.length) continue;
      if (item.text) out.push({
        type: 'heading',
        text: item.text
      });
      out.push({
        type: 'group',
        ...own(item, ['text']),
        items: rows
      });
    } else if (holdsValue(item) && !skip.has(item.id)) {
      out.push(settingEntry(item, look));
    }
  } // A separator does not open or close the list, and two do not stand together.


  return out.filter((entry, index, list) => entry.type !== 'separator' || index > 0 && index < list.length - 1 && list[index + 1].type !== 'separator');
}
/**
 * The switches the tiles look puts on top: those marked tile: true, at any
 * depth; when none is marked, the switches of the top level.
 */


function tileItems(items) {
  const marked = [];

  const walk = list => {
    for (const item of Array.isArray(list) ? list : []) {
      if (holdsValue(item) && item.type === 'switch' && item.tile === true) marked.push(item);
      if (item?.type === 'group') walk(item.items);
    }
  };

  walk(items);
  if (marked.length) return marked;
  return (Array.isArray(items) ? items : []).filter(item => holdsValue(item) && item.type === 'switch');
}
/**
 * The menu's entries for a look:
 *   drill  every choice opens its options in the panel (view: drill), the
 *          value under the name; the menu is submenu="drill";
 *   rows   the name at the start, the control at the end: quiet pills, a
 *          switch, a slider;
 *   tiles  the tile switches as tiles on top (a group with view: tiles named
 *          tilesLabel), the rest as rows below a separator.
 */

function entriesFor(items, look = 'drill', {
  tilesLabel = ''
} = {}) {
  if (look !== 'tiles') return entriesOf(items, look, new Set());
  const tiles = tileItems(items);
  if (!tiles.length) return entriesOf(items, 'rows', new Set());
  const rest = entriesOf(items, 'rows', new Set(tiles.map(item => item.id)));
  const top = {
    type: 'group',
    view: 'tiles',
    text: tilesLabel,
    items: tiles.map(item => settingEntry(item, 'rows'))
  };
  return rest.length ? [top, {
    type: 'separator'
  }, ...rest] : [top];
}

/***/ },

/***/ "4bfbd0eebbca"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderSettingsTemplate: () => (/* binding */ renderSettingsTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
 // sf-settings' markup: sf-menu-context with the items as its entries, and,
// in a popup, the page's trigger beside it. The element draws nothing of its
// own, so it has no sheet.
//
// - inline (no trigger): the menu stands open in the page's flow;
// - popup (a trigger in the trigger slot, or one named by for): the trigger as
//   the page wrote it, and the menu hidden until the trigger opens it.
//
// The panel's width is fixed for every look (280 px, the drilling menu's own
// width, --sf-context-menu-inline-size): it is given to the menu as its
// lower and upper bound, so a long name wraps and a value ends in an ellipsis
// rather than the panel growing.
//
// The menu's value events stay inside (stopPropagation): the page hears
// sf-settings-change, -changed and -reset, never the menu's.

const stop = event => event.stopPropagation();

const WIDTH = 'var(--sf-context-menu-inline-size, calc(var(--sf-f7) + var(--sf-a8)))';
const PANEL = `--sf-context-menu--min-inline-size: ${WIDTH}; --sf-context-menu--max-inline-size: ${WIDTH}`;

function renderMenu(context) {
  const {
    component
  } = context;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-menu-context
      class=${['sf-settings', context.rootClass].filter(Boolean).join(' ')}
      ?popup=${context.popup}
      submenu=${context.look === 'drill' ? 'drill' : 'flyout'}
      size=${context.size}
      aria-label=${context.label}
      style=${PANEL}
      .entries=${context.entries}
      @sf-menu-context-change=${event => component.onMenuChange(event)}
      @sf-menu-context-changed=${event => component.onMenuChanged(event)}
      @sf-menu-context-select=${stop}
      @sf-menu-context-reset=${stop}
      @sf-context-menu-change=${stop}
      @sf-context-menu-changed=${stop}
      @sf-context-menu-select=${stop}
      @sf-context-menu-reset=${stop}
    ></sf-menu-context>`;
} // The parts stand in a frame without a box of its own (display: contents), so
// they lay out in the host's place. The frame is what the first paint prints
// as static markup: the menu inside it waits for this element and takes its
// printed picture from it, rather than drawing alone, empty, before it.


const frame = parts => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-settings-parts" style="display: contents">${parts}</div>`;

function renderSettingsTemplate(context) {
  const trigger = context.popup && context.hasSlot('trigger') ? context.slot('trigger') : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return frame((0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${trigger}${renderMenu(context)}`);
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

/***/ "2a080a730149"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("lit", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "deb1a4d61565"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("smart-base", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("smart-base", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "72cabd0f91e5"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.settings","tag":"sf-settings","version":"1.0.5","kind":"leaf","settings":{"items":{"type":"list","schema":{"items":{"type":"object","properties":{"id":{"type":"string"},"type":{"type":"string","enum":["switch","choice","range","heading","separator","group"]},"text":{"type":"string"},"caption":{"type":"string"},"icon":{"type":"string"},"value":{},"options":{"type":"array"},"min":{"type":"number"},"max":{"type":"number"},"step":{"type":"number"},"unit":{"type":"string"},"items":{"type":"array"},"tile":{"type":"boolean"},"disabled":{"type":"boolean"}},"required":["type"]}},"default":[]},"look":{"type":"enum","values":["drill","rows","tiles"],"default":"drill"},"size":{"type":"enum","values":["1/2","1"],"default":"1/2"},"for":{"type":"string","default":""},"remember":{"type":"string","default":""},"label":{"type":"string","default-from":"runtime.label"}},"values":{"values":{"type":"object"}},"events":{"change":{"x-native":false,"carries":{"id":{"type":"string"},"value":{"type":"id"},"previous":{"type":"id"},"item":{"type":"object"}},"cancelable":true},"changed":{"x-native":false,"carries":{"id":{"type":"string"},"value":{"type":"id"},"previous":{"type":"id"},"item":{"type":"object"}}},"reset":{"carries":{},"cancelable":true,"own-verb":true}},"actions":{"set-value":{"with":{"id":"string","value":{"type":"id"}}},"set-all":{"with":{"values":"object"}},"show":{"with":{"id":"string"},"waits":true},"reset":{"emits":"reset"}},"layer":{"kind":"surface","locks-page":false,"traps-focus":false},"host-states":{"data-look":"string"}}');

/***/ },

/***/ "fb3a1cbd7459"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Settings","runtime":{"label":"Settings","tiles":"Quick settings"}}');

/***/ },

/***/ "0eadcd89fc76"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Настройки","runtime":{"label":"Настройки","tiles":"Быстрые настройки"}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("31b7143e3e61");
/******/
/******/ })()
;