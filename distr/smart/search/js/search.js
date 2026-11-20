/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "151a293c8c90"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ariaKeyShortcuts: () => (/* binding */ ariaKeyShortcuts),
/* harmony export */   isApplePlatform: () => (/* binding */ isApplePlatform),
/* harmony export */   isCommandShortcut: () => (/* binding */ isCommandShortcut),
/* harmony export */   isEditableTarget: () => (/* binding */ isEditableTarget),
/* harmony export */   matchesShortcut: () => (/* binding */ matchesShortcut),
/* harmony export */   parseShortcut: () => (/* binding */ parseShortcut),
/* harmony export */   shortcutCaps: () => (/* binding */ shortcutCaps),
/* harmony export */   shortcutView: () => (/* binding */ shortcutView)
/* harmony export */ });
// A key combination as a `shortcut` setting writes it (sf-button, an entry
// of sf-menu-context, a row of sf-search): words joined by +, the modifiers
// first and the key last -- mod+k, shift+/, /, escape. `mod` is the
// platform's command modifier: Cmd on Apple platforms, Ctrl elsewhere. Read
// once per render; nothing here holds state.
//
// The kbd component owns how a combination reads (owner decision 2026-11-07,
// docs review R030, rule C04): on an Apple platform the modifiers are glyphs
// in the platform's order, side by side (⇧⌘P); elsewhere they are words in
// Ctrl+Shift+P order, and shortcutView() says to join them with + -- the kbd
// sheet shows the joins where keys are plain glyphs (a menu row, a tooltip)
// and hides them between caps, which stand apart. A host renders the view
// and never styles the keys.
const MODIFIERS = ['mod', 'ctrl', 'alt', 'shift', 'meta']; // What a person reads on a key cap, per platform.

const MAC_CAPS = {
  mod: '⌘',
  meta: '⌘',
  ctrl: '⌃',
  alt: '⌥',
  shift: '⇧'
};
const OTHER_CAPS = {
  mod: 'Ctrl',
  meta: 'Win',
  ctrl: 'Ctrl',
  alt: 'Alt',
  shift: 'Shift'
}; // A cap of one character -- a letter, ⌘, ⇧, ↵ -- is a square key; a cap of
// several letters (Esc, Ctrl, Shift) hugs its word (sheet:
// .sf-button-shortcut-key--square). A modifier's cap is the platform's own
// word, so a page printed on a Mac and drawn on Windows widens by the
// difference: the keys are true to their caps, not to the widest platform
// (docs review R010, 2026-11-06).

const KEY_CAPS = {
  enter: '↵',
  return: '↵',
  escape: 'Esc',
  esc: 'Esc',
  tab: 'Tab',
  space: 'Space',
  backspace: '⌫',
  delete: 'Del',
  up: '↑',
  down: '↓',
  left: '←',
  right: '→',
  arrowup: '↑',
  arrowdown: '↓',
  arrowleft: '←',
  arrowright: '→',
  home: 'Home',
  end: 'End',
  pageup: 'PgUp',
  pagedown: 'PgDn'
}; // An Apple keyboard's own signs where they differ (component.kbd 1.3.3, CM-9
// of ui-control research 2026-11-14-context-menu): forward delete is ⌦, as
// macOS menus print it; Del is a Windows word.

const MAC_KEY_CAPS = {
  delete: '⌦'
}; // The names of KeyboardEvent.key for the words above.

const KEY_NAMES = {
  enter: 'Enter',
  return: 'Enter',
  escape: 'Escape',
  esc: 'Escape',
  tab: 'Tab',
  space: ' ',
  backspace: 'Backspace',
  delete: 'Delete',
  up: 'ArrowUp',
  down: 'ArrowDown',
  left: 'ArrowLeft',
  right: 'ArrowRight',
  arrowup: 'ArrowUp',
  arrowdown: 'ArrowDown',
  arrowleft: 'ArrowLeft',
  arrowright: 'ArrowRight',
  home: 'Home',
  end: 'End',
  pageup: 'PageUp',
  pagedown: 'PageDown'
}; // KeyboardEvent.code of the punctuation a shortcut is usually written with,
// so the combination is heard on any keyboard layout.

const PUNCTUATION_CODES = {
  '/': 'Slash',
  '.': 'Period',
  ',': 'Comma',
  ';': 'Semicolon',
  "'": 'Quote',
  '[': 'BracketLeft',
  ']': 'BracketRight',
  '-': 'Minus',
  '=': 'Equal',
  '`': 'Backquote',
  '\\': 'Backslash'
};
function isApplePlatform() {
  const platform = globalThis.navigator?.userAgentData?.platform || globalThis.navigator?.platform || '';
  return /mac|iphone|ipad|ipod/iu.test(platform);
}
/**
 * The combination as parts: `{modifiers: Set, key}`, or null when there is
 * none. `+` as the key itself is written `mod+plus`.
 */

function parseShortcut(value) {
  const text = String(value ?? '').trim().toLowerCase();
  if (!text) return null;
  const words = text === '+' ? ['+'] : text.split('+').map(word => word.trim()).filter(Boolean);
  if (!words.length) return null;
  const key = words.at(-1) === 'plus' ? '+' : words.at(-1);
  const modifiers = new Set(words.slice(0, -1).filter(word => MODIFIERS.includes(word)));
  return {
    modifiers,
    key
  };
}
/**
 * What the keys read, one cap per key in the platform's words: {text, square},
 * square when the cap is one character.
 */

function shortcutCaps(parsed, apple = isApplePlatform()) {
  if (!parsed) return [];
  const caps = apple ? MAC_CAPS : OTHER_CAPS;
  const order = apple ? ['ctrl', 'alt', 'shift', 'mod', 'meta'] : ['mod', 'ctrl', 'meta', 'alt', 'shift'];
  const modifiers = [];

  for (const name of order.filter(one => parsed.modifiers.has(one))) {
    // On a Mac mod and meta are one key.
    if (modifiers.includes(caps[name])) continue;
    modifiers.push(caps[name]);
  }

  const key = (apple ? MAC_KEY_CAPS[parsed.key] : undefined) ?? KEY_CAPS[parsed.key] ?? (parsed.key.length === 1 ? parsed.key.toUpperCase() : parsed.key.charAt(0).toUpperCase() + parsed.key.slice(1));
  return [...modifiers, key].map(text => ({
    text,
    square: [...text].length === 1
  }));
} // A function key (F1-F24) reads as its name.

const FUNCTION_KEY = /^f(?:[1-9]|1[0-9]|2[0-4])$/u; // Whether a written value is the notation above rather than text a page
// already wrote for people (⇧⌘L, «Ctrl K»): every word but the last a
// modifier, the last one character, a named key or a function key.

function isNotation(value) {
  const text = String(value ?? '').trim().toLowerCase();
  if (!text || /\s/u.test(text.replace(/\s*\+\s*/gu, '+'))) return false;
  if (text === '+') return true;
  const words = text.split('+').map(word => word.trim());
  if (words.some(word => !word)) return false;
  const key = words.at(-1) === 'plus' ? '+' : words.at(-1);
  return words.slice(0, -1).every(word => MODIFIERS.includes(word)) && ([...key].length === 1 || key in KEY_CAPS || FUNCTION_KEY.test(key));
}
/**
 * What a host draws for a `shortcut` value: {keys: [{text, square}], join},
 * the keys in this platform's words and whether they are joined with + (not
 * on an Apple platform, and only between keys). A value that is not the
 * notation -- text a page wrote for people, such as ⇧⌘L -- is one key of
 * that text. Empty: no keys.
 */


function shortcutView(value, apple = isApplePlatform()) {
  const text = String(value ?? '').trim();
  if (!text) return {
    keys: [],
    join: false
  };
  if (!isNotation(text)) return {
    keys: [{
      text,
      square: [...text].length === 1
    }],
    join: false
  };
  const keys = shortcutCaps(parseShortcut(text), apple);
  return {
    keys,
    join: !apple && keys.length > 1
  };
}
/** The value of aria-keyshortcuts (WAI-ARIA 1.2): Meta+K, Control+K, /. */

function ariaKeyShortcuts(parsed, apple = isApplePlatform()) {
  if (!parsed) return '';
  const names = [];
  if (parsed.modifiers.has('ctrl') || parsed.modifiers.has('mod') && !apple) names.push('Control');
  if (parsed.modifiers.has('alt')) names.push('Alt');
  if (parsed.modifiers.has('shift')) names.push('Shift');
  if (parsed.modifiers.has('meta') || parsed.modifiers.has('mod') && apple) names.push('Meta');
  const key = KEY_NAMES[parsed.key] ?? (parsed.key === ' ' ? 'Space' : parsed.key.length === 1 ? parsed.key.toUpperCase() : parsed.key);
  return [...names, key === ' ' ? 'Space' : key].join('+');
} // Whether the event's key is the combination's key: by the character it
// typed, or by the physical key for a letter, a digit or the punctuation
// above, so mod+k is heard on a Russian layout too.

function sameKey(event, key) {
  const name = KEY_NAMES[key];
  if (name) return event.key === name;
  if (String(event.key).toLowerCase() === key) return true;
  if (/^[a-z]$/u.test(key)) return event.code === `Key${key.toUpperCase()}`;
  if (/^[0-9]$/u.test(key)) return event.code === `Digit${key}`;
  return PUNCTUATION_CODES[key] !== undefined && event.code === PUNCTUATION_CODES[key];
}
/** Whether a keydown is the combination. */


function matchesShortcut(event, parsed, apple = isApplePlatform()) {
  if (!parsed || !event) return false;
  const wants = {
    ctrl: parsed.modifiers.has('ctrl') || parsed.modifiers.has('mod') && !apple,
    meta: parsed.modifiers.has('meta') || parsed.modifiers.has('mod') && apple,
    alt: parsed.modifiers.has('alt'),
    shift: parsed.modifiers.has('shift')
  };
  if (Boolean(event.ctrlKey) !== wants.ctrl || Boolean(event.metaKey) !== wants.meta || Boolean(event.altKey) !== wants.alt) return false; // Shift is part of typing a punctuation mark on many layouts (? is shift+/):
  // a combination that does not name it does not mind it for punctuation, and
  // minds it for a letter, a digit or a named key.

  const punctuation = parsed.key.length === 1 && !/^[a-z0-9]$/u.test(parsed.key);
  if (!punctuation && Boolean(event.shiftKey) !== wants.shift) return false;
  if (punctuation && wants.shift && !event.shiftKey) return false;
  return sameKey(event, parsed.key);
}
/** A combination with mod, ctrl, alt or meta is a command even in a field. */

function isCommandShortcut(parsed) {
  return Boolean(parsed) && ['mod', 'ctrl', 'alt', 'meta'].some(name => parsed.modifiers.has(name));
}
/** Whether focus is where a person types: a field, a select or editable text. */

function isEditableTarget(target) {
  const element = target instanceof Element ? target : null;
  if (!element) return false;
  if (element.isContentEditable) return true;
  const tag = element.localName;
  if (tag === 'textarea' || tag === 'select') return true;
  if (tag !== 'input') return false;
  const type = (element.getAttribute('type') || 'text').toLowerCase();
  return !['button', 'submit', 'reset', 'checkbox', 'radio', 'range', 'color', 'file', 'image', 'hidden'].includes(type);
}

/***/ },

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

/***/ "bf0584601359"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GROUP_ROWS: () => (/* binding */ GROUP_ROWS),
/* harmony export */   OPERATORS: () => (/* binding */ OPERATORS),
/* harmony export */   SfSearch: () => (/* binding */ SfSearch),
/* harmony export */   WAIT_LINE_DELAY: () => (/* binding */ WAIT_LINE_DELAY),
/* harmony export */   highlight: () => (/* binding */ highlight),
/* harmony export */   matchesShortcut: () => (/* binding */ matchesShortcut),
/* harmony export */   parseShortcuts: () => (/* binding */ parseShortcuts)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_preferences_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("51250bf01ab0");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _core_js_breakpoints_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("1373e294ec38");
/* harmony import */ var _core_js_layer_stack__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("18003344cff0");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("3298a6643d1e");
/* harmony import */ var _js_host__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("9e5c88241328");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("e264eb73f918");
/* harmony import */ var _lang_index_mjs__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("42ad4537fcaf");
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("ce3ad881d0a0");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, _core_js_smart_base__WEBPACK_IMPORTED_MODULE_1__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_3__, _core_js_layer_stack__WEBPACK_IMPORTED_MODULE_5__, _js_templates_default__WEBPACK_IMPORTED_MODULE_6__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, _core_js_smart_base__WEBPACK_IMPORTED_MODULE_1__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_3__, _core_js_layer_stack__WEBPACK_IMPORTED_MODULE_5__, _js_templates_default__WEBPACK_IMPORTED_MODULE_6__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _core_js_layer_stack__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_5__);
// sf-search: the one search window of a SIMAI site or app -- pages, records
// and commands (owner decision C162 (1); the admin palette is a host of it).
// One surface over the shared scrim: the field is its frameless head with a
// line under it, then the filters, the rows and, after the first arrow key,
// one line of key hints (owner decision C175, prototype ui-control
// prototypes/search-window-study.html); the whole screen below lg (C162 (7)).
//
// The trigger is the page's: an element in the trigger slot (the default slot)
// or one named by `for`; a key opens the window too (`shortcut`, Command or
// Control+K and / by default). The window is a layer of the shared stack
// (standard simai.smart-component 1.3.13 §19, core/js/layer-stack.js),
// registered the way sf-modal registers: the stack orders it, hands it Escape
// and Tab only while it is the top layer, holds the one page lock and gives
// focus back when it closes. It is drawn into a portal at the end of the body,
// carrying the host's language, direction, theme and public variables, so no
// stacking context of the page (a sticky header) holds it under the page.
//
// The panel asks a host through simai.search-port 1.1.0 (§4.9, declared in
// component.json): six intents on one event, one answer envelope, every read
// sequenced. It fetches nothing itself -- the index, the ranking, the access
// and what a command does are the host's. The capability says what is
// possible and the setting says what is wanted: a block whose capability the
// host did not announce is absent, and the setting cannot turn it on (owner's
// delegated envelope, 2026-10-29).
//
// The page hands a host with the base action connect-port (`connectPort`), or
// answers the `sf-host-port-request` this element raises once per connection.
// Where it hands none, the built-in hosts of js/host.js answer: the static
// JSON index of `index`, or the `provider` function -- the two simple paths
// the documentation site and Docara use, written as adapters of the same port.
// Requests are debounced and a stale one is aborted through its signal.
//
// From its component.json (§3, §4, §8): the settings are made by
// core/js/element-manifest.js, open, close and toggle are the actions and
// answer outcomes, the words are the language files'.









 // Only the words on screen ship in the bundle, English only (owner decision
// C282): Russian and every other language come from a language file. The
// title, settings and events stay in the language files for the Studio and the
// docs (localization study LC-2).


const DEBOUNCE = 120; // A search that takes longer than this draws the «Поиск…» line with the
// spinner over the rows it keeps (owner decisions C139 (4), C130 (8): the
// spinner after 1 s, no skeleton); a faster answer replaces the rows at once.

const WAIT_LINE_DELAY = 1000;
const OVERLAY_CONTAINER = '[data-sf-overlay-container], [data-sf-drawer-container]'; // The port's three answers (no revision travels here, so nothing conflicts).

const ANSWERS = ['applied', 'refused', 'unavailable']; // Which capability stands behind an intent (simai.search-port 1.0.0): an
// intent of a capability the host did not announce is never raised.

const INTENT_CAPABILITY = {
  'result.preview': 'preview',
  'action.run': 'actions',
  'recent.forget': 'recent',
  'recent.clear': 'recent'
}; // The rows a group shows in the window (owner decision C175 (9)): the rest is
// on the product's results page, reached by the group's last row.

const GROUP_ROWS = 5; // The operators sf-search knows (C175 (8)): their words are the interface
// language's (lang operator-<id>), and the English ids are read too.

const OPERATORS = ['from', 'subject', 'has', 'date'];
const OPERATOR_ICON = {
  from: 'person',
  subject: 'subject',
  has: 'attach_file',
  date: 'event'
}; // Which block a setting wants, and the capability it wants it over; path and
// keys are the panel's own, so they have no capability.

const BLOCK_CAPABILITY = {
  scopes: 'scopes',
  recent: 'recent',
  popular: 'popular',
  actions: 'actions'
}; // The step at which the card has room for the preview pane beside the list:
// the Framework's lg (core/js/breakpoints.js, the ladder the sheet's own media
// rule reads; reuse audit 2026-11-02, finding 6).

const PREVIEW_STEP = 'lg';
let sequence = 0; // The built-in hosts keep the recent queries as a view preference of the
// person (SF.Preferences, owner 2026-10-14): in the browser under
// sf-pref:sf-search/<recent-key> and by a host that keeps preferences for its
// user. The registry is the shared one when core has published it (every
// bundle has its own copy).

const preferences = () => globalThis.SF?.Preferences || _core_js_preferences_js__WEBPACK_IMPORTED_MODULE_2__["default"]; // `shortcut`: keys separated by spaces, each `mod+k`, `shift+/`, `/`.


function parseShortcuts(text) {
  return String(text ?? '').trim().split(/\s+/u).filter(Boolean).map(one => {
    const parts = one.toLowerCase().split('+');
    const key = parts.pop() || '+';
    return {
      key,
      mod: parts.includes('mod'),
      ctrl: parts.includes('ctrl'),
      meta: parts.includes('meta'),
      alt: parts.includes('alt'),
      shift: parts.includes('shift')
    };
  }).filter(one => one.key);
}

const plainKey = shortcut => !shortcut.mod && !shortcut.ctrl && !shortcut.meta && !shortcut.alt; // mod is Command or Control, whichever the person presses: Command on a Mac,
// Control elsewhere, and either works on both (the answer, and the page's
// printed first paint, are the same on every platform).


function matchesShortcut(event, shortcut) {
  if (String(event.key ?? '').toLowerCase() !== shortcut.key) return false;
  const ctrl = Boolean(event.ctrlKey);
  const meta = Boolean(event.metaKey);

  if (shortcut.mod) {
    if (ctrl === meta && !(shortcut.ctrl && shortcut.meta)) return false;
    if (shortcut.ctrl && !ctrl || shortcut.meta && !meta) return false;
  } else if (ctrl !== shortcut.ctrl || meta !== shortcut.meta) return false;

  if (Boolean(event.altKey) !== shortcut.alt) return false; // A single printable key is typed with whatever Shift its layout needs.

  return plainKey(shortcut) ? true : Boolean(event.shiftKey) === shortcut.shift;
} // aria-keyshortcuts names every way to press them: mod as Control and as Meta.

function ariaShortcuts(list) {
  const name = (one, ctrl, meta) => [ctrl ? 'Control' : '', meta ? 'Meta' : '', one.alt ? 'Alt' : '', one.shift ? 'Shift' : '', one.key.length === 1 ? one.key.toUpperCase() : one.key].filter(Boolean).join('+');

  return list.flatMap(one => one.mod ? [name(one, true, one.meta), name(one, one.ctrl, true)] : [name(one, one.ctrl, one.meta)]).join(' ');
}

const editable = node => node instanceof Element && (node.isContentEditable || Boolean(node.closest('input, textarea, select, [contenteditable=""], [contenteditable="true"]'))); // ------------------------------------------------------------------ the data


const text = value => value === undefined || value === null ? '' : String(value);

const terms = query => query.toLowerCase().split(/\s+/u).filter(Boolean); // A page result with no url is dropped by the panel, never drawn as a row
// that does nothing (simai.search-port 1.0.0, data.results.url).


const drawable = result => Boolean(result && text(result.title)) && (result.kind === 'action' ? true : Boolean(text(result.url)));

const strings = list => Array.isArray(list) ? list.map(text).filter(Boolean) : null;
/** A title cut around the first place a term of the query stands in it. */


function highlight(title, query) {
  const lower = title.toLowerCase();
  const q = text(query).trim().toLowerCase();
  const candidates = q ? [q, ...terms(q)] : [];

  for (const candidate of candidates) {
    const at = lower.indexOf(candidate);
    if (at >= 0) return [title.slice(0, at), title.slice(at, at + candidate.length), title.slice(at + candidate.length)];
  }

  return [title, '', ''];
}
const SearchElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_3__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_8__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_1___default()),
  lang: _lang_index_mjs__WEBPACK_IMPORTED_MODULE_9__.files,
  source: 'ru',
  actions: {
    open() {
      return this.runOpen();
    },

    close({
      reason
    } = {}) {
      return this.runClose({
        reason
      });
    },

    toggle() {
      return this.isOpen ? this.runClose({
        reason: 'close'
      }) : this.runOpen();
    }

  }
});

class SfSearch extends SearchElement {
  constructor() {
    super();
    this._id = `sf-search-${++sequence}`;
    this.isOpen = false;
    this.query = '';
    this.scope = '';
    this.selected = 0;
    this.status = 'idle';
    this.statusMessage = '';
    this.notice = '';
    this.running = false;
    this.answer = null;
    this.emptyAnswer = null;
    this.popularList = [];
    this.recentList = [];
    this.previewOf = null;
    this._portal = null;
    this._controller = null;
    this._timer = 0; // The «Поиск…» line: its timer and whether it is drawn (C139 (4)).

    this._waitTimer = 0;
    this.waitShown = false; // What kind of failure the last query met: error (the host is
    // unavailable, «Повторить»), no-access (forbidden) or a plain refusal.

    this.statusKind = ''; // The port: what the page handed (sfPort, the base action) is asked first;
    // the built-in host is made from index/provider/recent-key and remade when
    // one of them changes.

    this._builtin = null;
    this._builtinFor = null;
    this._portRequested = false;
    this._querySequence = 0;
    this._previewSequence = 0; // The pages last opened (C162 (6)), kept beside the recent queries.

    this.recentPages = []; // A command's next steps open in the same window (C175 (7)): the stack of
    // commands entered, each with the words that stood in the field.

    this.steps = []; // The operators turned into tags (C175 (8)), the one being typed, and
    // the operators the host reads.

    this.tokens = [];
    this.draft = null;
    this.operatorList = []; // The key hints wait for the first arrow key (R252, C175 (11)).

    this.keysUsed = false; // A sentence for the screen reader that is not the count: a scope
    // pressed, a step opened, a link copied (SW-20).

    this.announcement = '';
    this._previewMedia = (0,_core_js_breakpoints_js__WEBPACK_IMPORTED_MODULE_4__.breakpointMedia)(PREVIEW_STEP);

    this._onPreviewMedia = () => this.onPreviewRoomChange();

    this._onDocumentKeydown = event => this.onDocumentKeydown(event);

    this._onDocumentClick = event => this.onDocumentClick(event);

    this._onHostClick = event => this.onHostClick(event);
  } // The trigger is the default slot (component.json): the children the page
  // wrote without a slot attribute, taken live like the named ones.


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

    document.addEventListener('keydown', this._onDocumentKeydown);
    document.addEventListener('click', this._onDocumentClick);
    this.addEventListener('click', this._onHostClick);
    this._previewMedia?.addEventListener?.('change', this._onPreviewMedia);
    this.requestHostPort();
  }

  disconnectedCallback() {
    if (this.isOpen) this.finishClose({
      emit: false,
      restoreFocus: false
    });
    document.removeEventListener('keydown', this._onDocumentKeydown);
    document.removeEventListener('click', this._onDocumentClick);
    this.removeEventListener('click', this._onHostClick);
    this._previewMedia?.removeEventListener?.('change', this._onPreviewMedia); // Once per connection, so an element moved in the page asks again: a
    // portless element and a host that chose not to answer look alike.

    this._portRequested = false;
    super.disconnectedCallback?.();
  }

  afterRender(changed) {
    super.afterRender?.(changed);
    this.syncTriggers();
  }

  get shortcuts() {
    return parseShortcuts(this.shortcut);
  } // The page's elements that open the window: the slot's and those `for` names.


  triggers() {
    const own = [].concat(this._liveSlotNodes?.get('trigger') || []).filter(node => node instanceof Element);
    const ids = String(this.for || '').split(/\s+/u).filter(Boolean);
    const named = ids.map(id => document.getElementById(id)).filter(Boolean);
    return [...own, ...named];
  }

  syncTriggers() {
    const keys = ariaShortcuts(this.shortcuts);

    for (const trigger of this.triggers()) {
      trigger.setAttribute('aria-haspopup', 'dialog');
      trigger.setAttribute('aria-expanded', String(this.isOpen));
      if (this.isOpen) trigger.setAttribute('aria-controls', `${this._id}-dialog`);else trigger.removeAttribute('aria-controls');
      if (keys) trigger.setAttribute('aria-keyshortcuts', keys);else trigger.removeAttribute('aria-keyshortcuts');
    }
  }

  focusDelegate() {
    const first = this.triggers()[0];
    return first?.querySelector?.('button') ?? first ?? null;
  }

  onHostClick(event) {
    if (event.defaultPrevented || this.isOpen) return;
    const target = event.target instanceof Element ? event.target : null;
    if (!target || !this.contains(target)) return;
    this.runOpen();
  }

  onDocumentClick(event) {
    if (event.defaultPrevented || this.isOpen) return;
    const ids = String(this.for || '').split(/\s+/u).filter(Boolean);
    if (!ids.length || !(event.target instanceof Element)) return;
    const selector = ids.map(id => `#${globalThis.CSS?.escape ? CSS.escape(id) : id}`).join(', ');
    if (!event.target.closest(selector)) return;
    event.preventDefault();
    this.runOpen();
  }

  onDocumentKeydown(event) {
    if (event.defaultPrevented || event.isComposing || !this.isConnected) return;
    const hit = this.shortcuts.find(shortcut => matchesShortcut(event, shortcut));
    if (!hit) return;
    if (plainKey(hit) && editable(event.composedPath?.()[0] ?? event.target)) return; // An open window under another layer does not take the key.

    if (this.isOpen && !(0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_5__.isTopLayer)(this)) return;
    event.preventDefault();
    if (this.isOpen) this.focusField({
      select: true
    });else this.runOpen();
  } // ---------------------------------------------------------- open, close


  get contained() {
    return Boolean(this.closest(OVERLAY_CONTAINER));
  }

  runOpen() {
    if (this.isOpen) {
      this.focusField();
      return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_3__.applied)();
    }

    if (!this.sfEmit('open', {}, {
      cancelable: true
    })) return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_3__.refused)('prevented');
    this._returnTo = this.opener();
    this._returnAncestors = (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_5__.landmarksAround)(this._returnTo);
    this.isOpen = true;
    this.query = '';
    this.scope = '';
    this.selected = 0;
    this.status = 'idle';
    this.statusMessage = '';
    this.statusKind = '';
    this.stopWait();
    this.notice = '';
    this.answer = null;
    this.previewOf = null;
    this.steps = [];
    this.tokens = [];
    this.draft = null;
    this.keysUsed = false;
    this.announcement = '';
    this.sfHostState('data-open', true);
    this.mountPortal();
    const contained = this._contained;
    (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_5__.openLayer)(this, {
      kind: 'modal',
      // The stack's default page lock (lockPageScroll), the one every layer takes.
      locksPage: !contained,
      trapsFocus: true,
      returnTo: this._returnTo,
      root: () => this.dialog(),
      focusIn: () => this.focusField(),
      onEscape: event => this.onEscape(event),
      onTab: event => this.onTab(event),
      place: ({
        zIndex
      }) => this.place(zIndex)
    });
    this.renderWindow();
    this.focusField();
    this.syncTriggers(); // The empty query is a question like any other: it is what answers the
    // blocks the host announced -- the recent queries, the popular ones and
    // the commands -- so the panel asks it rather than drawing them itself.

    this.askQuery('');

    const settle = () => {
      if (!this.isOpen) return;
      this.focusField();
      this.sfEmit('opened', {});
    };

    if (typeof globalThis.requestAnimationFrame === 'function') globalThis.requestAnimationFrame(settle);else Promise.resolve().then(settle);
    return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_3__.applied)();
  } // Where the focus goes back when the window closes (SR-7): what had it when
  // the window opened, or -- when nothing had (a key pressed on the page, the
  // body active) -- the trigger that opens the window, if the person can see
  // it. The body was given back before, and the next Tab started from the
  // top of the page.


  opener() {
    const active = document.activeElement;
    if (active && active !== document.body && active !== document.documentElement) return active;
    const trigger = this.focusDelegate(); // checkVisibility with the property also refuses visibility: hidden.

    const shown = trigger?.isConnected && trigger.checkVisibility?.({
      visibilityProperty: true
    }) && !trigger.closest?.('[inert], [hidden]');
    return shown ? trigger : active;
  }

  runClose({
    reason = 'api',
    restoreFocus = true
  } = {}) {
    if (!this.isOpen) return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_3__.refused)('closed');
    if (!this.sfEmit('close', {
      reason
    }, {
      cancelable: true
    })) return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_3__.refused)('prevented');
    this.finishClose({
      reason,
      restoreFocus
    });
    return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_3__.applied)();
  }

  finishClose({
    reason = 'api',
    emit = true,
    restoreFocus = true
  } = {}) {
    this.isOpen = false;
    clearTimeout(this._timer);
    this.stopWait();
    this._controller?.abort();
    this._controller = null;
    this.sfHostState('data-open', false);
    const wasTop = (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_5__.closeLayer)(this, {
      restoreFocus: false
    });
    this.unmountPortal();
    this.syncTriggers(); // Focus goes back to what had it when the window opened (§19.2): the
    // trigger, or the page where the key was pressed.

    if (restoreFocus) (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_5__.returnLayerFocus)(wasTop, this._returnTo, this._returnAncestors);
    if (emit) this.sfEmit('closed', {
      reason
    });
  } // The portal at the end of the body, or of the overlay container the host
  // stands in (a documentation example), which then frames the window and
  // whose page is not locked.


  mountPortal() {
    const home = this.closest(OVERLAY_CONTAINER) || document.body;
    const portal = document.createElement('div');
    portal.className = 'sf-search-portal';
    portal.setAttribute('data-sf-search-portal', this._id);
    home.append(portal);
    (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_5__.carryLayerOrigin)(portal, this, {
      prefixes: ['--sf-search-'],
      area: true,
      except: ['--sf-search-']
    });
    this._portal = portal;
    this._contained = home !== document.body;
    portal.classList.toggle('sf-search-portal--contained', this._contained);
  }

  unmountPortal() {
    if (!this._portal) return;
    (0,lit__WEBPACK_IMPORTED_MODULE_0__.render)(lit__WEBPACK_IMPORTED_MODULE_0__.nothing, this._portal);

    this._portal.remove();

    this._portal = null;
  }

  place(zIndex) {
    if (!this._portal) return;
    if (zIndex === '' || zIndex === undefined) this._portal.style.removeProperty('z-index');else this._portal.style.zIndex = String(zIndex);
  }

  dialog() {
    return this._portal?.querySelector('.sf-search-window') ?? null;
  } // The window is on the page: open and its portal mounted. A key, a press or
  // an input that reaches the window's parts after it closed -- a host that
  // closes it from a capture listener of the same key, a key typed during the
  // close -- finds the portal gone; the window's handlers then do nothing
  // (they neither read the removed portal nor choose a row of a closed list).


  shown() {
    return this.isOpen && Boolean(this._portal);
  } // The window's writing direction: the portal's, the host's while there is no
  // portal.


  rtl() {
    const node = this._portal ?? this;
    return node.isConnected ? getComputedStyle(node).direction === 'rtl' : false;
  }

  field() {
    return this._portal?.querySelector('.sf-search-input') ?? null;
  }

  focusField({
    select = false
  } = {}) {
    const input = this.field();
    if (!input) return;
    input.focus({
      preventScroll: true
    });
    if (select) input.select();
  }

  keepFocus(event) {
    // A press on the card keeps the focus in the field (the rows are options
    // of the field's list, not stops of their own); its buttons still click.
    if (!(event.target instanceof Element) || !event.target.closest('input')) event.preventDefault();
  } // Escape: from a row's buttons back to the field (C148 (3)); a filled field
  // is cleared first (C153 (6)); in a command's step it goes back a step
  // (C175 (7)); an empty field closes the window.


  onEscape(event) {
    if (event.defaultPrevented || !this.isOpen || !(0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_5__.isTopLayer)(this)) return false;

    if (document.activeElement?.closest?.('.sf-search-row-actions')) {
      this.focusField();
      return true;
    }

    if (this.query) {
      this.setQuery('');
      return true;
    }

    if (this.steps.length) {
      this.leaveStep();
      return true;
    }

    this.close({
      reason: 'escape'
    });
    return true;
  } // The X in the field, drawn only while there is something to clear (SW-3):
  // the words, then the operator tags; it is not a Tab stop.


  onClearPress() {
    if (!this.shown()) return;
    if (this.query) this.setQuery('');else if (this.tokens.length) this.setTokens([]);else this.focusField();
  } // The arrow at the head's start: back a step, else (on a phone, where it
  // stands for the window's close) close.


  onBackPress() {
    if (!this.shown()) return;
    if (this.steps.length) this.leaveStep();else this.close({
      reason: 'close'
    });
  }

  onTab(event) {
    if (!this.shown()) return;
    const root = this.dialog(); // The Tab stops alone: the rows (links), the X and a row's buttons are
    // reached by the arrows, so their tabindex -1 keeps them off the cycle.

    const items = (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_5__.focusablesIn)(root).filter(node => node.tabIndex >= 0);
    if (!items.length) return;
    const first = items[0];
    const last = items.at(-1);
    const active = document.activeElement;

    if (!root.contains(active)) {
      event.preventDefault();
      (event.shiftKey ? last : first).focus();
    } else if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  } // ---------------------------------------------------------- the field


  onInput(event) {
    if (!this.shown()) return;
    this.query = event.target.value;
    this.selected = 0;
    this.announcement = '';
    this.readDraft();
    this.scheduleLoad();
    this.renderWindow();
  }

  onFieldKeydown(event) {
    if (event.isComposing) return;

    if (!this.shown()) {
      // The keys the field always took stay taken: an Enter let through
      // would reach what the focus went back to (the trigger) as a press,
      // and open the window again; the arrows would scroll the page.
      if (event.key === 'Enter' || event.key === 'ArrowDown' || event.key === 'ArrowUp') event.preventDefault();
      return;
    }

    const count = this._view?.rowCount ?? 0;

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault(); // The key hints appear with the first arrow and stay until the window
      // closes (R252, C175 (11)).

      if (!this.keysUsed) this.keysUsed = true;

      if (!count) {
        this.renderWindow();
        return;
      }

      const step = event.key === 'ArrowDown' ? 1 : -1;
      this.selected = (this.selected + step + count) % count;
      this.renderWindow({
        reveal: true
      });
      this.askPreview();
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (!count) return; // Ctrl or Command with Enter: a page in a new tab (C175 (6)).

      if (event.ctrlKey || event.metaKey) this.openInNewTab(this.selected);else this.choose(this.selected);
    } else if (event.key === (this.rtl() ? 'ArrowLeft' : 'ArrowRight') && this.atFieldEnd() && this.rowActions().length) {
      // To the selected row's buttons (C148 (3)), toward the row's end: →,
      // ← in a right-to-left page; the other arrow or Escape comes back.
      event.preventDefault();
      this.rowActions()[0].focus();
    } else if (event.key === 'Backspace' && !event.target.value && event.target.selectionStart === 0) {
      // Backspace on an empty field: back a step, else the last tag goes
      // (C175 (7), (8)).
      if (this.steps.length) {
        event.preventDefault();
        this.leaveStep();
      } else if (this.tokens.length) {
        event.preventDefault();
        this.setTokens(this.tokens.slice(0, -1));
      }
    }
  }

  atFieldEnd() {
    const input = this.field();
    return Boolean(input) && input.selectionStart === input.value.length && input.selectionEnd === input.value.length;
  } // The selected row's own buttons (C175 (6), C148 (3)): drawn buttons of the
  // selected row, in order.


  rowActions() {
    const row = this._portal?.querySelector('.sf-search-row--selected');
    return Array.from(row?.querySelectorAll('.sf-search-row-actions button') ?? []);
  } // The arrows walk the row's buttons; ← from the first, or Escape, goes back
  // to the field.


  onRowActionsKeydown(event) {
    if (!this.shown()) return;
    const buttons = this.rowActions();
    const at = buttons.indexOf(document.activeElement);
    if (at < 0) return;
    const rtl = this.rtl();
    const next = event.key === (rtl ? 'ArrowLeft' : 'ArrowRight');
    const previous = event.key === (rtl ? 'ArrowRight' : 'ArrowLeft');
    if (!next && !previous) return;
    event.preventDefault();
    if (next && at < buttons.length - 1) buttons[at + 1].focus();else if (previous && at > 0) buttons[at - 1].focus();else if (previous) this.focusField();
  }

  setQuery(value) {
    const input = this.field();
    if (input) input.value = value;
    this.query = value;
    this.selected = 0;
    this.announcement = '';
    this.readDraft();
    this.scheduleLoad();
    this.renderWindow();
    this.focusField();
  } // A scope pressed is the same question as a keystroke (the port: scope is a
  // field of query.change, never an intent of its own), so the host is asked
  // again; the panel also filters what it holds, so the tags answer at once.
  // The tags are one sf-tag-group of single choice (C175 (4)): chosen from the
  // keyboard, the focus stays on the tag, and the reader hears the scope and
  // its count; chosen with a pointer, the focus goes back to the field
  // (dispatcher 2026-11-16, as the scope pills before 1.10 kept it there), so
  // the person types on without a click into the field.


  setScope(id, {
    focus = true
  } = {}) {
    this.scope = id;
    this.selected = 0;
    const scope = this._view?.scopes?.find(one => one.id === id);
    this.announcement = scope ? `${scope.label}: ${this.sfWord('count-text', {
      count: scope.count
    })}` : '';
    this.renderWindow();
    if (focus) this.focusField();
    this.askQuery(this.query.trim());
  } // sf-tag-group's select: a tag chosen is the scope; the chosen tag cleared
  // is «Все» again, so one tag is always chosen.


  onScopeSelect(event) {
    event.stopPropagation();
    if (!this.shown()) return; // «Все» is the tag of no scope; a scope released is «Все» again.

    const {
      id,
      selected
    } = event.detail ?? {};
    const key = String(id ?? '');
    const pointer = this._scopePointer === true;
    this._scopePointer = false;
    this.setScope(selected && key !== _js_templates_default__WEBPACK_IMPORTED_MODULE_6__.ALL_SCOPE_KEY ? key : '', {
      focus: pointer
    });
  } // How the next scope choice comes: a press of a pointer on the tags, or a
  // key (Enter or Space on a tag, which is a click too).


  onScopePointer() {
    this._scopePointer = true;
  }

  onScopeKey() {
    this._scopePointer = false;
  } // ---------------------------------------------------------- operators

  /** The operators the host reads, with the words that name them. */


  operators() {
    if (!this.hostOffers('operators')) return [];
    const listed = this.operatorList.length ? this.operatorList : OPERATORS.map(id => ({
      id,
      suggest: false
    }));
    return listed.filter(one => OPERATORS.includes(one.id)).map(one => ({ ...one,
      word: this.sfWord(`operator-${one.id}`)
    }));
  } // An operator being typed at the end of the field (C175 (8)): its word in
  // the interface language or in English, a colon, and what follows it.


  readDraft() {
    const known = this.operators();
    this.draft = null;
    if (!known.length) return;
    const match = /(^|\s)([\p{L}]+):\s*([^:]*)$/u.exec(this.query);
    if (!match) return;
    const word = match[2].toLowerCase();
    const operator = known.find(one => one.word.toLowerCase() === word || one.id === word);
    if (!operator) return;
    this.draft = {
      id: operator.id,
      word: operator.word,
      suggest: Boolean(operator.suggest),
      value: match[3].trim(),
      before: this.query.slice(0, match.index + match[1].length).trim()
    };
  }

  setTokens(list) {
    this.tokens = list;
    this.selected = 0;
    this.renderWindow();
    this.focusField();
    this.askQuery(this.query.trim());
  } // A value chosen for the operator being typed: it becomes a tag, and the
  // words before the operator stay the query.


  addToken(token) {
    const before = this.draft?.before ?? '';
    this.draft = null;
    this.tokens = [...this.tokens.filter(one => !(one.id === token.id && one.value === token.value)), token];
    const input = this.field();
    if (input) input.value = before ? `${before} ` : '';
    this.query = input?.value ?? '';
    this.selected = 0;
    this.renderWindow();
    this.focusField();
    this.askQuery(this.query.trim());
  } // «Уточнить»: an operator chosen from the empty window starts it in the field.


  startOperator(operator) {
    const now = this.query.trim();
    this.setQuery(`${now ? `${now} ` : ''}${operator.word}: `);
  } // ---------------------------------------------------------- steps
  // A command with steps opens its next step in the same window (C175 (7)):
  // its tag in the field, the back arrow, the options as rows.


  enterStep(item) {
    this.steps = [...this.steps, {
      id: item.id,
      title: text(item.title),
      icon: text(item.icon),
      query: this.query
    }];
    const input = this.field();
    if (input) input.value = '';
    this.query = '';
    this.draft = null;
    this.answer = null;
    this.scope = '';
    this.selected = 0;
    this.status = 'loading';
    this.renderWindow();
    this.focusField();
    this.askQuery('');
  }

  leaveStep() {
    const left = this.steps.at(-1);
    this.steps = this.steps.slice(0, -1);
    const input = this.field();
    const back = left?.query ?? '';
    if (input) input.value = back;
    this.query = back;
    this.answer = null;
    this.selected = 0;
    this.announcement = '';
    this.renderWindow();
    this.focusField();
    this.askQuery(back.trim());
  } // A row whose title or path is cut by its ellipsis shows the whole of them
  // as its tooltip (SR-8, as a list row's C148 (5)): measured when the
  // pointer comes to the row, so a row that is not cut has none.


  markCut(row) {
    if (!(row instanceof Element)) return;
    const title = row.querySelector('.sf-search-row-title');
    const path = row.querySelector('.sf-search-row-path');

    const cut = el => Boolean(el) && el.scrollWidth > el.clientWidth + 1;

    const words = el => (el?.textContent || '').replace(/\s+/gu, ' ').trim();

    if (cut(title) || cut(path)) row.title = [words(title), words(path)].filter(Boolean).join(' · ');else row.removeAttribute('title');
  } // «Повторить» of the error state asks the same question again (C120 (5));
  // «Искать во всех» of nothing found in a scope asks it of every scope
  // (C162 (5)).


  onStateAction(event) {
    event.stopPropagation();
    if (!this.shown()) return;
    const id = event.detail?.id;

    if (id === 'all') {
      this.setScope('');
      return;
    }

    if (id !== 'retry') return;
    this.focusField();
    this.askQuery(this.query.trim());
  } // A result's picture (port 1.2.0 image) that did not load: the row draws
  // its glyph instead, from the next drawing on, for as long as the window
  // lives (the icon sheet's display stands outside the layers, so the glyph
  // is not drawn and hidden: it is drawn or not).


  pictureFailed(url) {
    if (!url) return;
    this._failedPictures ||= new Set();
    if (this._failedPictures.has(url)) return;

    this._failedPictures.add(url);

    if (this.shown()) this.renderWindow();
  }

  pictureOk(url) {
    return !this._failedPictures || !this._failedPictures.has(url);
  }

  hover(index) {
    if (!this.shown() || this.selected === index) return;
    this.selected = index;
    this.renderWindow();
    this.askPreview();
  } // A result chosen: a page result is opened (result.open), a command is run
  // by the host (action.run). An applied answer closes the window and the
  // page hears navigate; unless it takes it, the browser goes to the url. A
  // refusal is the host's word that this person may not: the window stays
  // open and says so.


  choose(index) {
    const row = this._view?.rows[index];
    if (!row) return undefined;

    if (row.kind === 'recent') {
      this.setQuery(row.text);
      return undefined;
    }

    if (row.kind === 'refine') {
      this.startOperator(row.operator);
      return undefined;
    }

    if (row.kind === 'token') {
      this.addToken(row.token);
      return undefined;
    }

    if (row.kind === 'more') {
      // «Все результаты: N ›» (C175 (9)): the product's results page, or,
      // where the host named none, the group's own scope in the window.
      if (row.url) this.followLink(row.url, {
        id: row.scope || 'all',
        group: row.scope
      });else this.setScope(row.scope);
      return undefined;
    }

    if (row.kind === 'option') return this.runAction(this.steps.at(-1), row.item.id);
    const {
      item
    } = row;

    if (item.kind === 'action' && item.steps) {
      this.enterStep(item);
      return undefined;
    }

    return item.kind === 'action' ? this.runAction(item) : this.openResult(item);
  } // A press on a row: a page row is a link, so Ctrl, Command or Shift with a
  // press and the middle button are the browser's (a new tab or window); the
  // window stays open behind them (C175 (6)). A plain press chooses the row.


  onRowClick(event, index) {
    if (event.defaultPrevented || !this.shown()) return;
    if (event.target instanceof Element && event.target.closest('.sf-search-row-actions')) return;
    const link = event.currentTarget instanceof HTMLAnchorElement && event.currentTarget.href;
    if (link && (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0)) return;
    event.preventDefault();
    this.choose(index);
  }
  /** The address of a row, absolute, or empty. */


  rowUrl(index) {
    const row = this._view?.rows[index];
    const url = row?.kind === 'more' ? row.url : text(row?.item?.url);
    if (!url) return '';

    try {
      return new URL(url, globalThis.location?.href).href;
    } catch {
      return '';
    }
  } // «Открыть в новой вкладке» and Ctrl/Command+Enter: a page row in a new tab;
  // a command or a step's option runs as Enter would.


  openInNewTab(index) {
    const url = this.rowUrl(index);
    if (!url) return this.choose(index);
    globalThis.open?.(url, '_blank', 'noopener');
    return undefined;
  } // «Копировать ссылку»: the row's address on the clipboard, said once.


  async copyLink(index) {
    const url = this.rowUrl(index);
    if (!url) return false;
    let done = false;

    try {
      await globalThis.navigator?.clipboard?.writeText(url);
      done = true;
    } catch {
      done = false;
    }

    this.announcement = this.sfWord(done ? 'copied-text' : 'copy-failed-text');
    this.renderWindow();
    return done;
  }

  followLink(href, {
    id = '',
    group = ''
  } = {}) {
    const query = this.query.trim();
    this.runClose({
      reason: 'api'
    });
    const detail = {
      id,
      href,
      action: '',
      query,
      group
    };
    if (this.sfEmit('navigate', detail, {
      cancelable: true
    }) && detail.href) globalThis.location?.assign(detail.href);
  }

  async openResult(item) {
    const query = this.query.trim();
    const answer = await this.raise('result.open', {
      id: item.id,
      query,
      group: text(item.group),
      url: text(item.url) || null
    });
    if (!answer) return answer;

    if (answer.answer !== 'applied') {
      this.notice = this.answerWords(answer, 'refused-text');
      this.renderWindow();
      return answer;
    }

    this.takeRecent(answer);
    this.runClose({
      reason: 'api'
    });
    const detail = {
      id: item.id,
      href: text(item.url),
      action: '',
      query,
      group: text(item.group)
    };
    const allowed = this.sfEmit('navigate', detail, {
      cancelable: true
    });
    if (allowed && detail.href) globalThis.location?.assign(detail.href);
    return answer;
  } // Only the host knows what a command does, so the panel never guesses: the
  // card is busy while it waits, an applied answer closes the window and the
  // page hears navigate with the command as `action`.


  async runAction(item, value) {
    if (!item) return undefined; // In a step, the query recorded is the one the command was found by.

    const query = this.steps.length ? text(this.steps[0].query).trim() : this.query.trim();
    this.running = true;
    this.renderWindow();
    const payload = {
      id: item.id,
      query
    };
    if (value !== undefined) payload.value = value;
    const answer = await this.raise('action.run', payload);
    this.running = false;
    if (!answer) return answer;

    if (answer.answer !== 'applied') {
      this.notice = this.answerWords(answer, 'action-text');
      this.renderWindow();
      return answer;
    }

    this.takeRecent(answer);
    this.runClose({
      reason: 'api'
    });
    const detail = {
      id: item.id,
      href: '',
      action: text(item.id),
      query,
      group: text(item.group)
    };
    if (value !== undefined) detail.value = value;
    this.sfEmit('navigate', detail, {
      cancelable: true
    });
    return answer;
  } // ---------------------------------------------------------- recent queries
  // The recent queries are the host's data: a removal and a clear are
  // answered with the whole list the host keeps now, and that list is what is
  // drawn -- the panel keeps no history of its own.
  // The recent list (1.1.0): strings are queries, objects the pages last
  // opened; up to five of one and three of the other are drawn (C162 (6)).


  takeRecent(answer) {
    const list = answer?.data?.recent;
    if (!Array.isArray(list)) return;
    this.recentList = list.filter(entry => typeof entry === 'string' && entry).slice(0, _js_host__WEBPACK_IMPORTED_MODULE_7__.RECENT_LIMIT);
    this.recentPages = list.filter(entry => entry && typeof entry === 'object' && text(entry.title) && text(entry.url)).slice(0, _js_host__WEBPACK_IMPORTED_MODULE_7__.RECENT_PAGES_LIMIT);
  }

  async forgetRecent(query) {
    const answer = await this.raise('recent.forget', {
      query: text(query)
    });
    this.afterRecent(answer);
    return answer;
  }

  async forgetRecentPage(id) {
    const answer = await this.raise('recent.forget', {
      id
    });
    this.afterRecent(answer);
    return answer;
  }

  async clearRecent() {
    const answer = await this.raise('recent.clear', {});
    this.afterRecent(answer);
    return answer;
  }

  afterRecent(answer) {
    if (!answer) return;
    if (answer.answer === 'applied') this.takeRecent(answer);else this.notice = this.answerWords(answer, 'refused-text');
    this.selected = 0;
    this.renderWindow();
    this.focusField();
  } // ---------------------------------------------------------- the port

  /**
   * A component that takes a host port asks for one (§4.9): bubbling and
   * composed, once per connection while it has none, answered with
   * `connectPort` at once or later. Until then the built-in host answers.
   */


  requestHostPort() {
    if (this.sfPort || this._portRequested) return false;
    this._portRequested = true;
    this.dispatchEvent(new CustomEvent('sf-host-port-request', {
      bubbles: true,
      composed: true,
      detail: {
        component: this,
        context: {
          owner: null,
          record: null,
          group: null
        }
      }
    }));
    return true;
  }
  /**
   * The hook of the base action connect-port: a host of another edition is
   * refused (the base answers `port-unsupported` and keeps the port it had).
   * A new host brings its own capabilities, its own recent queries and its
   * own answers, so nothing of the one before is drawn.
   */


  onPortConnected(port) {
    const version = text(port?.version);

    if (typeof port?.raise !== 'function' || !_js_host__WEBPACK_IMPORTED_MODULE_7__.SUPPORTED_PORT_VERSIONS.includes(version)) {
      throw new TypeError(`sf-search speaks ${_js_host__WEBPACK_IMPORTED_MODULE_7__.PORT_ID} ${_js_host__WEBPACK_IMPORTED_MODULE_7__.SUPPORTED_PORT_VERSIONS.join(', ')}`);
    }

    this.answer = null;
    this.emptyAnswer = null;
    this.recentList = [];
    this.recentPages = [];
    this.popularList = [];
    this.operatorList = [];
    this.previewOf = null;
    this.notice = '';
    this.statusMessage = '';
    this.scope = '';
    this.tokens = [];
    this.steps = [];
    this.draft = null;
    if (this.isOpen) this.askQuery(this.query.trim());
  }
  /** The host in force: the page's, else the built-in one. */


  host() {
    const connected = this.sfPort;
    if (connected && typeof connected.raise === 'function') return connected;
    return this.builtinHost();
  }
  /**
   * The built-in host (js/host.js): the provider the page gave, else the
   * static index of `index`, else the port's base host, which announces
   * nothing and answers an empty list -- the field, the results and the
   * keyboard, which need no capability.
   */


  builtinHost() {
    const provider = typeof this.provider === 'function' || typeof this.provider?.search === 'function' ? this.provider : null;
    const url = provider ? '' : text(this.index).trim();
    const key = text(this.recentKey).trim();
    const was = this._builtinFor;
    if (this._builtin && was && was.provider === provider && was.url === url && was.key === key) return this._builtin;
    const recent = (0,_js_host__WEBPACK_IMPORTED_MODULE_7__.recentStore)({
      key,
      preferences
    });
    this._builtin = provider ? (0,_js_host__WEBPACK_IMPORTED_MODULE_7__.providerHost)(provider, {
      recent
    }) : url ? (0,_js_host__WEBPACK_IMPORTED_MODULE_7__.indexHost)(url, {
      recent
    }) : (0,_js_host__WEBPACK_IMPORTED_MODULE_7__.builtinSearchHost)({
      recent
    });
    this._builtinFor = {
      provider,
      url,
      key
    };
    return this._builtin;
  }
  /** Whether the host in force announces a capability. */


  hostOffers(capability) {
    return Boolean(this.host()?.capabilities?.includes?.(capability));
  }
  /**
   * Whether a block is drawn: the host announces the capability behind it and
   * the page has not turned the setting off. The capability is the floor and
   * the setting is the veto, so a capability never announced is never drawn
   * as a dead control and a setting cannot turn on what the host cannot do.
   */


  shows(block) {
    const capability = BLOCK_CAPABILITY[block];
    if (capability && !this.hostOffers(capability)) return false;
    return this[block] !== false;
  }
  /** Whether the card has room beside the list and the host has previews. */


  showsPreview() {
    return this.hostOffers('preview') && (this._previewMedia ? this._previewMedia.matches : false);
  }

  onPreviewRoomChange() {
    if (!this.isOpen) return;
    if (!this.showsPreview()) this.previewOf = null;
    this.renderWindow();
    this.askPreview();
  }
  /**
   * One intent, one answer. An intent behind a capability the host did not
   * announce is not raised at all, and a sequenced read whose answer names an
   * older request is dropped (answered null to the caller). Every answer is
   * announced on sf-search-intent, the panel's own included.
   */


  async raise(intent, payload, {
    signal = null,
    sequence: asked = null
  } = {}) {
    const host = this.host();
    const capability = INTENT_CAPABILITY[intent];
    let answer = null;
    if (!host || typeof host.raise !== 'function') answer = {
      answer: 'unavailable',
      reason: 'port-not-connected'
    };else if (capability && !this.hostOffers(capability)) answer = {
      answer: 'unavailable',
      reason: 'capability-not-provided'
    };else {
      try {
        answer = await host.raise(intent, { ...payload
        }, {
          signal
        });
      } catch (error) {
        if (signal?.aborted || error?.name === 'AbortError') return null;
        answer = {
          answer: 'unavailable',
          reason: 'host-failed'
        };
      }

      if (!answer || typeof answer !== 'object' || !ANSWERS.includes(answer.answer)) {
        answer = {
          answer: 'unavailable',
          reason: 'answer-not-of-the-port'
        };
      }
    }
    this.sfEmit('intent', {
      intent,
      payload: { ...payload
      },
      answer
    }); // The sequence rule: a person types faster than a server answers.

    if (asked !== null && answer.sequence !== undefined && answer.sequence !== null && Number(answer.sequence) !== asked) return null;
    return answer;
  }
  /**
   * The words of an answer that is not applied: the host's own sentence when
   * it sent one (the reader's language, shown as text), else the panel's for
   * the reasons the port names, else the fallback asked for.
   */


  answerWords(answer, fallback) {
    const given = text(answer?.text).trim();
    if (given) return given;
    const word = {
      'query-too-short': 'short-text',
      forbidden: 'forbidden-text',
      'not-found': 'not-found-text'
    }[text(answer?.reason)];
    if (word) return this.sfWord(word);
    if (answer?.answer === 'unavailable' && fallback !== 'action-text') return this.sfWord('error-text');
    return this.sfWord(fallback);
  } // ---------------------------------------------------------- the reads


  scheduleLoad() {
    clearTimeout(this._timer);
    const query = this.query.trim();
    this.notice = ''; // In a step, with operator tags or while an operator is typed the empty
    // field is a question too: the step's options, the tags alone.

    if (!query && (this.steps.length || this.tokens.length)) {
      this.startWait();
      this._timer = setTimeout(() => this.askQuery(''), DEBOUNCE);
      return;
    }

    if (!query) {
      // An empty field starts afresh: the next query waits for its own answer
      // rather than showing the last one's under new marks.
      this._controller?.abort();
      this._controller = null;
      this.answer = null;
      this.statusMessage = '';
      this.statusKind = '';
      this.status = 'ready';
      this.stopWait();
      return;
    } // The wait starts with the keystroke, not after the debounce: the rows on
    // screen stay, a step paler, until the answer replaces them (C139 (4)).


    this.startWait();
    this._timer = setTimeout(() => this.askQuery(query), DEBOUNCE);
  } // The wait of a query (C139 (4), C130 (8)): the card keeps the rows it shows
  // a step paler at once, and after WAIT_LINE_DELAY a «Поиск…» line with the
  // spinner stands over them. An answer, a failure or an empty field ends it.


  startWait() {
    this.status = 'loading';
    if (this._waitTimer || this.waitShown) return;
    this._waitTimer = setTimeout(() => {
      this._waitTimer = 0;
      if (!this.isOpen || this.status !== 'loading') return;
      this.waitShown = true;
      this.renderWindow();
    }, WAIT_LINE_DELAY);
  }

  stopWait() {
    clearTimeout(this._waitTimer);
    this._waitTimer = 0;
    this.waitShown = false;
  }
  /**
   * What matches now (query.change): a keystroke, a scope pressed, a chosen
   * popular or recent query, an accepted correction, and the empty query the
   * window opens with -- one question for all of them. The empty query is the
   * host's chance to answer the blocks (recent, popular, the commands).
   */
  // What a question carries besides the words: the step it asks (C175 (7)),
  // the operator tags and the operator being typed (C175 (8)).


  queryPayload(asked, query) {
    const payload = {
      sequence: asked,
      query,
      scope: this.scope || null,
      limit: _js_host__WEBPACK_IMPORTED_MODULE_7__.RESULT_LIMIT,
      offset: 0
    };
    const step = this.steps.at(-1);

    if (step) {
      payload.step = step.id;
      payload.scope = null;
      return payload;
    }

    if (this.hostOffers('operators')) {
      if (this.tokens.length) payload.operators = this.tokens.map(({
        id,
        value,
        label
      }) => ({
        id,
        value: text(value),
        label: text(label)
      }));

      if (this.draft?.suggest) {
        payload.query = this.draft.before;
        payload.operator = {
          id: this.draft.id,
          value: this.draft.value
        };
      }
    }

    return payload;
  } // Whether the question asked is more than the empty field's blocks.


  asksMore(query) {
    return Boolean(query) || this.steps.length > 0 || this.tokens.length > 0;
  }

  async askQuery(query) {
    this._controller?.abort();
    const controller = new AbortController();
    this._controller = controller;
    const asked = ++this._querySequence;
    const more = this.asksMore(query);

    if (more) {
      this.startWait();
      this.renderWindow();
    } // An operator being typed that the host does not suggest for is the
    // person's own words: nothing to ask until it becomes a tag.


    if (this.draft && !this.draft.suggest) {
      this.stopWait();
      this.status = 'ready';
      this.renderWindow();
      return null;
    }

    const answer = await this.raise('query.change', this.queryPayload(asked, query), {
      signal: controller.signal,
      sequence: asked
    });
    if (this._controller === controller) this._controller = null;
    if (!answer || controller.signal.aborted || !this.isOpen || asked !== this._querySequence) return answer;

    if (answer.answer === 'applied') {
      const data = answer.data ?? {};
      const step = this.steps.at(-1); // A step's options and an operator's suggestions need no url: they are
      // chosen, not opened.

      const chosen = Boolean(step) || Boolean(this.draft?.suggest);
      const results = (Array.isArray(data.results) ? data.results : []).filter(result => chosen ? Boolean(result && text(result.title)) : drawable(result));
      const echo = data.echo ?? {};
      const scopes = (Array.isArray(data.scopes) ? data.scopes : []).filter(scope => scope && text(scope.id));

      if (more) {
        // The panel draws the question the host answered, not the one the
        // person has since typed (echo).
        this.answer = {
          query: text(echo.query ?? query),
          scope: text(echo.scope),
          results,
          scopes,
          total: Number.isInteger(data.total) ? data.total : null,
          more: text(data.more),
          step: step ? step.id : null,
          suggest: !step && this.draft?.suggest ? this.draft.id : null,
          correction: this.hostOffers('spelling') && text(data.correction?.query) ? data.correction : null
        };
        this.status = results.length ? 'ready' : 'empty';
        this.statusMessage = '';
        this.statusKind = '';
        this.stopWait(); // A step opened is said with its options (C175 (7), as C157 (6)).

        if (step && !query) this.announcement = `${step.title}, ${this.sfWord('options-text', {
          count: results.length
        })}`;
      } else {
        this.emptyAnswer = {
          results,
          scopes
        };

        if (Array.isArray(data.operators)) {
          this.operatorList = data.operators.filter(one => one && OPERATORS.includes(one.id)).map(one => ({
            id: one.id,
            suggest: Boolean(one.suggest)
          }));
        }
      }

      this.takeRecent(answer);
      const popular = strings(data.popular);
      if (popular?.length) this.popularList = popular;
    } else if (more) {
      this.answer = null;
      this.status = 'error';
      this.statusMessage = this.answerWords(answer, 'refused-text'); // The host could not answer: an error with «Повторить» (C120 (3), (5));
      // forbidden: no access; any other refusal (a query too short) is the
      // host's sentence alone.

      const reason = text(answer.reason);
      this.statusKind = answer.answer === 'unavailable' ? 'error' : reason === 'forbidden' ? 'no-access' : '';
      this.stopWait();
    }

    this.renderWindow();
    this.askPreview();
    return answer;
  }
  /**
   * The words of the row the person stands on (result.preview), asked for
   * only where the host announced the capability and the card has room for
   * the pane. Sequenced like the query: an answer for a row the person has
   * left is dropped.
   */


  async askPreview() {
    if (!this.showsPreview()) {
      if (this.previewOf) {
        this.previewOf = null;
        this.renderWindow();
      }

      return null;
    }

    const row = this._view?.rows?.[this.selected];
    const item = row?.kind === 'result' ? row.item : null;

    if (!item) {
      if (this.previewOf) {
        this.previewOf = null;
        this.renderWindow();
      }

      return null;
    }

    if (this.previewOf && this.previewOf.id === item.id) return null;
    const asked = ++this._previewSequence;
    const answer = await this.raise('result.preview', {
      sequence: asked,
      id: item.id,
      query: this.query.trim()
    }, {
      sequence: asked
    });
    if (!answer || !this.isOpen || asked !== this._previewSequence) return answer;
    const preview = answer.answer === 'applied' && answer.data?.preview ? answer.data.preview : null;
    const standing = this._view?.rows?.[this.selected];
    const on = standing?.kind === 'result' ? standing.item : null; // A preview that arrives for a row the person has left is dropped.

    if (preview && on && String(preview.id) !== String(on.id)) return answer;
    this.previewOf = preview ? {
      id: preview.id,
      title: text(preview.title),
      path: text(preview.path),
      text: text(preview.text)
    } : null;
    this.renderWindow();
    return answer;
  } // ---------------------------------------------------------- drawing
  // What the window shows now: sections of rows, the scopes, a correction, a
  // preview and a message. Every block is drawn only where the host
  // announced its capability and the page left its setting on (shows).


  view() {
    const query = this.query.trim();
    const sections = [];
    const rows = [];

    const add = row => {
      row.index = rows.length;
      rows.push(row);
      return row;
    };

    const step = this.steps.at(-1) ?? null;

    const resultRow = item => add({
      kind: 'result',
      item,
      title: highlight(item.title, query),
      path: text(item.path),
      icon: text(item.icon) || (item.kind === 'action' ? 'bolt' : 'description'),
      shortcut: item.kind === 'action' ? text(item.shortcut) : '',
      url: item.kind === 'action' ? '' : text(item.url)
    });

    const commands = this.shows('actions');
    let scopes = [];
    let correction = null;
    let message = '';
    let state = null;
    const asking = this.asksMore(query);
    const waiting = asking && this.status === 'loading'; // «Уточнить» (C175 (8)): the operators the host reads and the field does
    // not hold yet, each a row that starts it in the field.

    const refine = (except = '') => {
      const used = new Set([except, ...this.tokens.map(token => token.id)]);
      const rows = this.operators().filter(operator => !used.has(operator.id)).map(operator => add({
        kind: 'refine',
        operator,
        title: [`${operator.word}: ${this.sfWord(`operator-${operator.id}-hint`)}`, '', ''],
        path: '',
        icon: OPERATOR_ICON[operator.id],
        shortcut: '',
        url: ''
      }));
      if (rows.length) sections.push({
        kind: 'refine',
        id: `${this._id}-refine`,
        label: this.sfWord('refine-label'),
        rows
      });
    };

    if (step) {
      // A command's next step (C175 (7)): its options under the command's
      // name, chosen, not opened.
      const options = (this.answer?.step === step.id ? this.answer.results : []).map(item => add({
        kind: 'option',
        item,
        title: highlight(text(item.title), query),
        path: text(item.path),
        icon: text(item.icon),
        shortcut: '',
        url: ''
      }));
      if (options.length) sections.push({
        kind: 'results',
        id: `${this._id}-results`,
        groups: [{
          label: step.title,
          captionId: `${this._id}-step`,
          rows: options
        }]
      });else if (this.answer?.step === step.id && !waiting) state = {
        kind: 'nothing-found',
        text: this.sfWord('empty-text', {
          vars: {
            query: query || step.title
          }
        })
      };
    } else if (this.draft) {
      // An operator being typed (C175 (8)): the host's suggestions for its
      // value, or the words typed as the one row that makes the tag.
      const {
        draft
      } = this;

      if (draft.suggest) {
        const found = this.answer?.suggest === draft.id ? this.answer.results : [];
        const rowsOf = found.map(item => add({
          kind: 'token',
          item,
          token: {
            id: draft.id,
            value: text(item.id),
            label: text(item.title)
          },
          title: highlight(text(item.title), draft.value),
          path: text(item.path),
          icon: text(item.icon) || OPERATOR_ICON[draft.id],
          avatar: item.avatar ?? null,
          shortcut: '',
          url: ''
        }));
        if (rowsOf.length) sections.push({
          kind: 'results',
          id: `${this._id}-results`,
          groups: [{
            label: this.sfWord(`operator-${draft.id}-label`),
            captionId: `${this._id}-suggest`,
            rows: rowsOf
          }]
        });
        refine(draft.id);
      } else if (draft.value) {
        const row = add({
          kind: 'token',
          token: {
            id: draft.id,
            value: draft.value,
            label: draft.value
          },
          title: [`${draft.word}: ${draft.value}`, '', ''],
          path: '',
          icon: OPERATOR_ICON[draft.id],
          shortcut: '',
          url: ''
        });
        sections.push({
          kind: 'results',
          id: `${this._id}-results`,
          groups: [{
            label: this.sfWord('refine-label'),
            captionId: `${this._id}-suggest`,
            rows: [row]
          }]
        });
      }
    } else if (!asking || waiting && !this.answer) {
      // A first query waits over what the empty field showed (the recent
      // queries, the commands): those rows stay, a step paler, until the answer
      // replaces them (C139 (4)); before, the card emptied at once for «Ищем…».
      if (this.shows('recent') && (this.recentList.length || this.recentPages.length)) {
        sections.push({
          kind: 'recent',
          id: `${this._id}-recent`,
          label: this.sfWord('recent-label'),
          rows: [...this.recentList.map(entry => add({
            kind: 'recent',
            text: entry,
            title: [entry, '', ''],
            path: '',
            icon: 'history',
            removeLabel: this.sfWord('recent-remove-label', {
              vars: {
                query: entry
              }
            })
          })), ...this.recentPages.map(page => Object.assign(resultRow({ ...page,
            kind: 'page'
          }), {
            recentPage: true,
            removeLabel: this.sfWord('recent-remove-label', {
              vars: {
                query: text(page.title)
              }
            })
          }))]
        });
      }

      if (this.shows('popular') && this.popularList.length) sections.push({
        kind: 'popular',
        texts: this.popularList
      });
      const actions = commands ? (this.emptyAnswer?.results ?? []).filter(item => item.kind === 'action') : [];

      if (actions.length) {
        sections.push({
          kind: 'actions',
          id: `${this._id}-actions`,
          label: this.sfWord('actions-label'),
          rows: actions.map(resultRow)
        });
      }

      refine();
      if (!sections.length && !asking) message = this.sfWord('start-text');
    } else {
      const answer = this.answer;
      const items = (answer?.results ?? []).filter(item => commands || item.kind !== 'action'); // The scopes the host announced, then any group its results name that
      // it did not: the tags follow the host's order, the panel adds nothing
      // of its own to it.

      const order = [];

      if (this.shows('scopes')) {
        for (const scope of answer?.scopes ?? []) order.push(scope); // A group the results name that the host did not announce as a scope
        // is a scope too; a result with no group at all is not one (1.0.0
        // drew it as a nameless pill).


        for (const item of items) {
          const id = text(item.group);
          if (id && !order.some(scope => scope.id === id)) order.push({
            id,
            label: id
          });
        }
      }

      const present = order.filter(scope => items.some(item => item.group === scope.id)); // A scope the host answered with nothing stays pressed: the empty state
      // offers «Искать во всех» (C162 (5)).

      if (items.length && !present.some(scope => scope.id === this.scope)) this.scope = ''; // The host's count where it sent one (the whole index), else the number
      // the panel holds, so a tag says what pressing it will show.

      const counted = scope => Number.isInteger(scope.count) ? scope.count : items.filter(item => item.group === scope.id).length;

      if (present.length) {
        scopes = [{
          id: '',
          label: this.sfWord('all-label'),
          count: Number.isInteger(answer?.total) ? answer.total : items.length,
          pressed: this.scope === ''
        }, ...present.map(scope => ({
          id: scope.id,
          label: text(scope.label) || scope.id,
          count: counted(scope),
          pressed: this.scope === scope.id
        }))];
      }

      const chosen = present.filter(scope => !this.scope || scope.id === this.scope);
      const ungrouped = this.scope ? [] : items.filter(item => !present.some(scope => scope.id === item.group));
      const captions = !this.scope && (present.length > 1 || text(present[0]?.label)); // Up to five rows of a group while every group is shown (C175 (9)); the
      // last row leads to the rest: the product's results page where the host
      // named one, else the group's own scope here. A scope pressed shows the
      // rows held of it, and the page where the host has more.

      const capped = (scope, list) => {
        const count = counted(scope);
        const url = text(scope.more);
        const room = this.scope ? list.length : Math.min(list.length, GROUP_ROWS);
        const shown = list.slice(0, room).map(resultRow);
        const rest = count > shown.length && (url || !this.scope && this.shows('scopes') && list.length > shown.length);
        if (rest) shown.push(add({
          kind: 'more',
          scope: scope.id,
          url,
          count,
          title: [this.sfWord('more-text', {
            vars: {
              count
            }
          }), '', ''],
          path: '',
          icon: 'arrow_forward',
          shortcut: ''
        }));
        return shown;
      };

      const groups = [...chosen.map((scope, n) => ({
        label: text(scope.label) || scope.id || this.sfWord('results-label'),
        captionId: captions && text(scope.label) ? `${this._id}-group-${n}` : '',
        rows: capped(scope, items.filter(item => item.group === scope.id))
      })), ...(ungrouped.length ? [{
        label: this.sfWord('results-label'),
        captionId: '',
        rows: (() => {
          const shown = ungrouped.map(resultRow);
          const total = Number.isInteger(answer?.total) ? answer.total : ungrouped.length;
          if (answer?.more && total > shown.length) shown.push(add({
            kind: 'more',
            scope: '',
            url: answer.more,
            count: total,
            title: [this.sfWord('more-text', {
              vars: {
                count: total
              }
            }), '', ''],
            path: '',
            icon: 'arrow_forward',
            shortcut: ''
          }));
          return shown;
        })()
      }] : [])].filter(group => group.rows.length);
      if (groups.length) sections.push({
        kind: 'results',
        id: `${this._id}-results`,
        groups
      }); // «Возможно, вы искали …»: offered, never applied -- accepting it is an
      // ordinary query.

      if (answer?.correction) {
        correction = {
          query: text(answer.correction.query),
          count: Number.isInteger(answer.correction.total) ? answer.correction.total : null,
          text: this.sfWord('correction-text', {
            vars: {
              query: text(answer.correction.query)
            }
          })
        };
      } // Nothing found and a failure are an inline sf-empty-state (owner
      // decision C120 (3), (5)): search_off with the popular queries under it,
      // the error glyph with «Повторить»; a refusal that is not a failure (a
      // query too short) stays the host's sentence. A search running over
      // them takes them away at once, as a new answer would.


      if (waiting) {// The rows of the last answer stay (paler); an old state goes.
      } else if (this.status === 'error') {
        const words = this.statusMessage || this.sfWord('error-text');
        if (this.statusKind) state = {
          kind: this.statusKind,
          text: words
        };else message = words;
      } else if (!rows.length && answer) {
        const popular = this.shows('popular') ? this.popularList.slice(0, 3) : [];
        state = {
          kind: 'nothing-found',
          text: this.sfWord(popular.length ? 'empty-advice-text' : 'empty-text', {
            vars: {
              query: query || this.tokens.map(one => one.label).join(', ')
            }
          }),
          // In a scope: «Искать во всех» (C162 (5)).
          actions: this.scope ? [{
            id: 'all',
            label: this.sfWord('search-all-label')
          }] : null
        };
        if (popular.length) sections.push({
          kind: 'popular',
          texts: popular
        });
      }
    }

    if (this.selected >= rows.length) this.selected = Math.max(0, rows.length - 1);
    const standing = rows[this.selected];
    const preview = this.showsPreview() && this.previewOf && standing?.kind === 'result' && String(standing.item.id) === String(this.previewOf.id) ? this.previewOf : null;
    return {
      sections,
      rows,
      rowCount: rows.length,
      scopes,
      correction,
      preview,
      pane: this.showsPreview(),
      notice: this.notice,
      message,
      state,
      step,
      draft: this.draft,
      tokens: this.tokens.map(token => ({ ...token,
        word: this.sfWord(`operator-${token.id}`)
      })),
      // The rows on screen belong to the last answer while a new one is
      // awaited; the «Поиск…» line comes after WAIT_LINE_DELAY.
      stale: waiting && rows.length > 0,
      waiting: waiting && this.waitShown,
      activeId: rows.length ? `${this._id}-option-${this.selected}` : ''
    };
  }

  statusText(view) {
    if (this.announcement) return this.announcement;
    if (!this.asksMore(this.query.trim())) return '';
    if (this.status === 'loading') return this.waitShown ? this.sfWord('loading-text') : '';
    if (this.status === 'error') return this.statusMessage || this.sfWord('error-text');
    if (!view.rowCount) return this.answer ? this.sfWord('empty-text', {
      vars: {
        query: this.query.trim()
      }
    }) : '';
    return this.sfWord('count-text', {
      count: view.rowCount
    });
  } // The key hints (R252, C175 (11)): none until the first arrow in the
  // window, then at most three on one line -- move, the Enter of this list
  // and the Escape of this state. The other keys are in the labels of the
  // buttons they act on (aria-keyshortcuts).


  keyHints(view) {
    if (!this.keysUsed || this.keys === false || !view.rowCount) return [];
    const enter = view.step ? 'key-apply-label' : view.draft ? 'key-tag-label' : 'key-open-label';
    const escape = this.query ? 'key-clear-label' : view.step ? 'key-back-label' : 'key-close-label';
    return [{
      keys: ['↑', '↓'],
      label: this.sfWord('key-select-label')
    }, {
      keys: ['↵'],
      label: this.sfWord(enter)
    }, {
      keys: ['Esc'],
      label: this.sfWord(escape)
    }];
  }

  renderWindow({
    reveal = false
  } = {}) {
    if (!this.isOpen || !this._portal) return;
    const view = this.view();
    this._view = view;
    const words = {
      back: this.sfWord('back-label'),
      clear: this.sfWord('clear-label'),
      close: this.sfWord('close-label'),
      scopes: this.sfWord('scopes-label'),
      results: this.sfWord('results-label'),
      popular: this.sfWord('popular-label'),
      preview: this.sfWord('preview-label'),
      recentClear: this.sfWord('recent-clear-label'),
      newTab: this.sfWord('new-tab-label'),
      copyLink: this.sfWord('copy-link-label'),
      removeTag: this.sfWord('remove-tag-label'),
      loading: this.sfWord('loading-text')
    };
    this.drawInto((0,_js_templates_default__WEBPACK_IMPORTED_MODULE_6__.renderSearchWindow)({
      component: this,
      ids: {
        dialog: `${this._id}-dialog`,
        option: index => `${this._id}-option-${index}`
      },
      query: this.query,
      label: this.label,
      placeholder: view.step ? this.sfWord('step-placeholder') : this.placeholder,
      selected: this.selected,
      status: this.status,
      busy: this.status === 'loading' || this.running,
      statusText: this.statusText(view),
      show: {
        path: this.path,
        keys: this.keys !== false
      },
      hints: this.keyHints(view),
      words,
      view
    }), this._portal); // The X and a row's buttons are not Tab stops (C153 (6), C148 (3)): the
    // X is Escape's, a row's buttons are reached with →. The buttons draw
    // their native button when they upgrade, so once more after that.

    this.untabButtons();
    if (typeof globalThis.requestAnimationFrame === 'function') globalThis.requestAnimationFrame(() => this.untabButtons());
    if (reveal) this._portal.querySelector('.sf-search-row--selected')?.scrollIntoView?.({
      block: 'nearest'
    });
  }

  untabButtons() {
    for (const button of this._portal?.querySelectorAll('.sf-search-clear button, .sf-search-row-actions button') ?? []) {
      if (button.tabIndex !== -1) button.tabIndex = -1;
    }
  }

  templateContext() {
    return this.createTemplateContext({ ...this.getPropsContext(),
      component: this,
      id: this._id,
      slot: name => this.getSlotContent(name),
      hasSlot: name => name === 'trigger' && this.hasSlotContent(name),
      rootClass: this.getRootClass()
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_6__.renderSearchTemplate)(this.templateContext());
  }

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (oldValue === newValue || !this.isOpen) return; // A new index or a new key is a new built-in host, with its own
    // capabilities and its own recent queries.

    if (name === 'index' || name === 'recent-key') {
      this._builtin = null;
      this._builtinFor = null;
      this.answer = null;
      this.emptyAnswer = null;
      this.recentList = [];
      this.popularList = [];
      this.askQuery(this.query.trim());
    }

    this.renderWindow();
  }

}

SfSearch.define('sf-search');

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "9e5c88241328"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BUILTIN_CAPABILITIES: () => (/* binding */ BUILTIN_CAPABILITIES),
/* harmony export */   PORT_ID: () => (/* binding */ PORT_ID),
/* harmony export */   PORT_VERSION: () => (/* binding */ PORT_VERSION),
/* harmony export */   RECENT_LIMIT: () => (/* binding */ RECENT_LIMIT),
/* harmony export */   RECENT_PAGES_LIMIT: () => (/* binding */ RECENT_PAGES_LIMIT),
/* harmony export */   RESULT_LIMIT: () => (/* binding */ RESULT_LIMIT),
/* harmony export */   SUPPORTED_PORT_VERSIONS: () => (/* binding */ SUPPORTED_PORT_VERSIONS),
/* harmony export */   avatarOf: () => (/* binding */ avatarOf),
/* harmony export */   builtinSearchHost: () => (/* binding */ builtinSearchHost),
/* harmony export */   indexHost: () => (/* binding */ indexHost),
/* harmony export */   matchIndex: () => (/* binding */ matchIndex),
/* harmony export */   providerHost: () => (/* binding */ providerHost),
/* harmony export */   readIndex: () => (/* binding */ readIndex),
/* harmony export */   recentStore: () => (/* binding */ recentStore),
/* harmony export */   resultOf: () => (/* binding */ resultOf)
/* harmony export */ });
// The built-in hosts of sf-search's port (simai.search-port 1.1.0): the two
// simple paths a site already uses -- a static JSON index (`index`) and a
// `provider` function -- written as adapters of the port rather than as a
// second way into the panel. The element asks these exactly as it asks a host
// the page connected (`connectPort`), so there is one code path: the panel
// raises an intent, a host answers one envelope, and the capabilities the host
// announces decide which blocks exist at all.
//
// What they announce: `scopes`, `recent`, `popular` and `actions` where there
// is something to search (an index address or a provider), and nothing at all
// where there is not -- a page with neither still gets the field, the results
// and the keyboard, which is the port's base host. Neither announces `preview`
// (a static index and a one-answer provider have no words of a row to show
// without opening it) nor `spelling` (neither knows what was meant).
//
// The recent queries are the host's data (the port): these adapters keep them
// where the component used to -- a view preference of the person, under
// `sf-search/<recent-key>` -- so `recent.forget` and `recent.clear` are
// answered with the whole list, and a page that connects a real host hands its
// own recent queries instead and this store is never read. Since 1.1.0 the
// list also holds the pages last opened (owner decision C162 (6): up to five
// queries and up to three pages, «Очистить» clears both).
//
// 1.1.0 (owner decision C175): an entry may carry a type mark (badge), a
// moment (time), an avatar ({name, image}) and, for a command, its next step
// (steps: an array of options in a static index; a provider is asked the step
// with options.step). A group may name the product's results page (more), and
// so may the whole answer.
//
// 1.2.0 (C175 (2), msg-bc1702eb): an entry may carry its own picture (image:
// a file's thumbnail or a record's image, an address).
const PORT_ID = 'simai.search-port';
const PORT_VERSION = '1.2.0';
const SUPPORTED_PORT_VERSIONS = ['1.0.0', '1.1.0', '1.2.0'];
const BUILTIN_CAPABILITIES = ['scopes', 'recent', 'popular', 'actions'];
const RECENT_LIMIT = 5;
const RECENT_PAGES_LIMIT = 3;
const RESULT_LIMIT = 50;

const text = value => value === undefined || value === null ? '' : String(value);

const words = query => query.toLowerCase().split(/\s+/u).filter(Boolean);

const applied = (data, sequence) => sequence === undefined ? {
  answer: 'applied',
  data
} : {
  answer: 'applied',
  sequence,
  data
};
/**
 * One entry of a static index or of a provider's answer as the port's result,
 * with the text the built-in matching reads kept beside it (`match`): a
 * result carries only the keys the port declares, and the index's own `text`
 * is matched, never drawn.
 */


function resultOf(entry, order) {
  const action = text(entry?.action);
  const url = text(entry?.url ?? entry?.href);
  const kind = action || entry?.kind === 'action' ? 'action' : 'page';
  const path = Array.isArray(entry?.path) ? entry.path.map(text).filter(Boolean).join(' › ') : text(entry?.path);
  const result = {
    id: entry?.id ?? (action || url || order),
    group: text(entry?.group),
    title: text(entry?.title),
    path: path || null,
    snippet: text(entry?.snippet) || null,
    icon: text(entry?.icon) || null,
    shortcut: text(entry?.shortcut) || null,
    kind,
    url: kind === 'action' ? null : url || null
  }; // 1.1.0: the parts a row draws only where they are given.

  if (text(entry?.badge)) result.badge = text(entry.badge);
  if (text(entry?.time)) result.time = text(entry.time);
  const avatar = avatarOf(entry?.avatar);
  if (avatar) result.avatar = avatar; // 1.2.0: the result's own picture, an address.

  if (text(entry?.image).trim()) result.image = text(entry.image).trim();
  if (kind === 'action' && (entry?.steps === true || Array.isArray(entry?.steps) && entry.steps.length)) result.steps = true;
  return {
    result,
    match: `${result.title} ${result.path ?? ''} ${text(entry?.text)} ${result.snippet ?? ''}`.toLowerCase(),
    options: kind === 'action' && Array.isArray(entry?.steps) ? entry.steps : null
  };
}
/** An avatar given as a name, or as {name, image}: the port's {name, image}. */

function avatarOf(value) {
  if (!value) return null;
  if (typeof value === 'string') return {
    name: value,
    image: null
  };
  const name = text(value.name ?? value.text);
  const image = text(value.image ?? value.src ?? value.url);
  return name || image ? {
    name,
    image: image || null
  } : null;
}
/** A static index, or a provider's answer, as the port's data (one shape). */

function readIndex(raw) {
  const scopes = (Array.isArray(raw?.groups) ? raw.groups : []).map(group => {
    if (typeof group === 'string') return {
      id: group,
      label: group
    };
    const scope = {
      id: text(group?.id),
      label: text(group?.label ?? group?.id) || null
    };
    if (Number.isInteger(group?.count)) scope.count = group.count;
    if (text(group?.more)) scope.more = text(group.more);
    return scope;
  }).filter(group => group.id);
  const source = Array.isArray(raw) ? raw : Array.isArray(raw?.items) ? raw.items : [];
  const entries = source.filter(entry => entry && text(entry.title)).map(resultOf);
  const popular = (Array.isArray(raw?.popular) ? raw.popular : []).map(text).filter(Boolean);
  const more = text(raw?.more);
  const total = Number.isInteger(raw?.total) ? raw.total : undefined;
  return {
    scopes,
    entries,
    popular,
    more,
    total
  };
}
/**
 * The matching of the built-in index host: every word of the query stands in
 * the title, the path or the entry's own text, case-insensitive; a title that
 * starts with the query first, then one that holds it, then one that holds
 * every word, then the rest, each in the index's order. The empty query
 * answers the commands (`kind: action`), which is what an empty field draws.
 */

function matchIndex({
  scopes,
  entries,
  popular
}, query) {
  const q = text(query).trim().toLowerCase();
  if (!q) return {
    scopes,
    results: entries.filter(({
      result
    }) => result.kind === 'action').map(({
      result
    }) => result),
    popular,
    total: undefined
  };
  const terms = words(q);
  const found = [];
  entries.forEach(({
    result,
    match
  }, order) => {
    if (!terms.every(word => match.includes(word))) return;
    const title = result.title.toLowerCase();
    let rank = 3;
    if (title.startsWith(q)) rank = 0;else if (title.includes(q)) rank = 1;else if (terms.every(word => title.includes(word))) rank = 2;
    found.push({
      result,
      rank,
      order
    });
  });
  found.sort((a, b) => a.rank - b.rank || a.order - b.order);
  return {
    scopes,
    results: found.slice(0, RESULT_LIMIT).map(entry => entry.result),
    popular,
    total: found.length
  };
}
/**
 * Where the built-in hosts keep this person's recent queries: a view
 * preference (`SF.Preferences`, `sf-search/<key>`), or the page's life alone
 * when no key is given or the browser refuses storage. The store is the
 * host's; the panel never reads it.
 */

function recentStore({
  key = '',
  preferences = () => null,
  limit = RECENT_LIMIT,
  pagesLimit = RECENT_PAGES_LIMIT
} = {}) {
  const name = key ? `sf-search/${key}` : '';
  let kept = [];
  let pages = [];

  const pageOf = page => {
    const id = page?.id;
    const title = text(page?.title);
    const url = text(page?.url);
    if (id === undefined || id === null || !title || !url) return null;
    return {
      id,
      title,
      url,
      path: text(page?.path) || null,
      icon: text(page?.icon) || null
    };
  }; // The whole list as the port answers it: the queries, then the pages.


  const both = () => [...kept, ...pages];

  const store = {
    read() {
      if (!name) return both();

      try {
        const saved = preferences()?.read(name);
        const list = Array.isArray(saved?.queries) ? saved.queries : [];
        kept = list.filter(entry => typeof entry === 'string' && entry).slice(0, limit);
        pages = (Array.isArray(saved?.pages) ? saved.pages : []).map(pageOf).filter(Boolean).slice(0, pagesLimit);
      } catch {// Storage refused (a private window, a sandbox): the list lives as long as the page.
      }

      return both();
    },

    write(list, pageList = pages) {
      kept = list.slice(0, limit);
      pages = pageList.slice(0, pagesLimit);
      if (!name) return both();

      try {
        // v 2 adds the pages (1.1.0); a v 1 record is read as queries alone.
        if (kept.length || pages.length) preferences()?.write(name, {
          v: 2,
          queries: kept,
          pages
        });else preferences()?.remove(name);
      } catch {// As above: what cannot be kept is still shown for this page.
      }

      return both();
    },

    record(query) {
      const text_ = text(query).trim();
      store.read();
      if (!text_) return both();
      const rest = kept.filter(entry => entry.toLowerCase() !== text_.toLowerCase());
      return store.write([text_, ...rest]);
    },

    // A page opened from the window (C162 (6)): the newest first, once.
    recordPage(page) {
      const entry = pageOf(page);
      store.read();
      if (!entry) return both();
      const rest = pages.filter(one => String(one.id) !== String(entry.id));
      return store.write(kept, [entry, ...rest]);
    },

    forget(query) {
      store.read();
      return store.write(kept.filter(entry => entry !== query));
    },

    forgetPage(id) {
      store.read();
      return store.write(kept, pages.filter(one => String(one.id) !== String(id)));
    },

    clear() {
      return store.write([], []);
    }

  };
  return store;
}
/**
 * A host of the port over a static index or a provider.
 *
 * `read(query, {scope, signal})` answers the raw data of either path -- the
 * index read once, or the provider's answer -- and `local` says whether the
 * matching is this host's (an index) or the source's (a provider, which was
 * given the query). `recent` is the store above. A host with no `read` is the
 * port's base host: it announces nothing and answers an empty list, so the
 * field, the results and the keyboard work and no block is drawn.
 */

function builtinSearchHost({
  read = null,
  local = false,
  recent = recentStore()
} = {}) {
  // The results last answered, by id, so an opened page is kept in the recent
  // list with its title and path; the options of a static index's commands.
  const seen = new Map();
  const steps = new Map(); // A command's next step: the options the index wrote under it, or the
  // provider's answer to the step (options.step), matched by the words typed.

  const stepOptions = async (step, query, signal) => {
    let list = steps.get(String(step));

    if (!list && !local) {
      const raw = await read(query, {
        scope: '',
        signal,
        step
      });
      list = Array.isArray(raw) ? raw : Array.isArray(raw?.items) ? raw.items : [];
    }

    const q = text(query).trim().toLowerCase();
    return (list ?? []).map(entry => typeof entry === 'string' ? {
      id: entry,
      title: entry
    } : entry).filter(entry => entry && text(entry.title)).map((entry, order) => ({
      id: entry.id ?? order,
      title: text(entry.title),
      icon: text(entry.icon) || null,
      path: text(entry.path) || null,
      kind: 'page',
      url: null
    })).filter(entry => !q || !local || entry.title.toLowerCase().includes(q));
  };

  const host = {
    id: PORT_ID,
    port: PORT_ID,
    version: PORT_VERSION,
    capabilities: read ? [...BUILTIN_CAPABILITIES] : [],
    builtin: true,

    async raise(intent, payload = {}, {
      signal
    } = {}) {
      const sequence = payload.sequence;

      if (intent === 'query.change') {
        const query = text(payload.query);
        const echo = {
          query,
          scope: text(payload.scope) || null
        };
        if (!read) return applied({
          results: [],
          echo
        }, sequence);
        const step = payload.step ?? null;
        if (step !== null && step !== undefined && step !== '') return applied({
          results: await stepOptions(step, query, signal),
          echo
        }, sequence);
        const source = readIndex(await read(query, {
          scope: echo.scope ?? '',
          signal
        }));

        for (const entry of source.entries) if (entry.options) steps.set(String(entry.result.id), entry.options); // An index is matched here; a provider was given the query, so its
        // answer is the page of results in its own order. Either way the
        // empty query answers the commands, which is what an empty field draws.


        const answer = local ? matchIndex(source, query) : {
          scopes: source.scopes,
          popular: source.popular,
          results: (query ? source.entries : source.entries.filter(({
            result
          }) => result.kind === 'action')).map(({
            result
          }) => result).slice(0, RESULT_LIMIT),
          total: source.total
        };

        for (const result of answer.results) seen.set(String(result.id), result);

        const data = {
          results: answer.results,
          echo,
          scopes: answer.scopes,
          popular: answer.popular,
          recent: recent.read()
        };
        if (answer.total !== undefined && answer.total > data.results.length) data.total = answer.total;
        if (query && source.more) data.more = source.more;
        return applied(data, sequence);
      }

      if (intent === 'result.open') {
        // The host records the query and the page opened where it keeps this
        // person's recent list, and answers the whole list back.
        const page = seen.get(String(payload.id)) ?? recent.read().find(entry => typeof entry === 'object' && String(entry.id) === String(payload.id));
        if (page) recent.recordPage({ ...page,
          url: page.url ?? payload.url
        });
        return applied({
          recent: recent.record(payload.query)
        });
      }

      if (intent === 'action.run') {
        // What a command does is the page's: the panel raises its own
        // sf-search-navigate for it (with the value of its step).
        return applied({
          recent: recent.record(payload.query)
        });
      }

      if (intent === 'recent.forget') {
        if (payload.id !== undefined && payload.id !== null) return applied({
          recent: recent.forgetPage(payload.id)
        });
        return applied({
          recent: recent.forget(text(payload.query))
        });
      }

      if (intent === 'recent.clear') return applied({
        recent: recent.clear()
      }); // preview and spelling: never announced, so never asked; asked anyway,
      // the answer is the port's own (§4.9, the kit's capability-absent case).

      if (intent === 'result.preview') return {
        answer: 'unavailable',
        reason: 'capability-not-provided',
        sequence
      };
      return {
        answer: 'unavailable',
        reason: 'intent-unknown'
      };
    }

  };
  return host;
}
/**
 * The index host: reads the address once (a failed read is tried again on the
 * next ask) and matches the query in what it read.
 */

function indexHost(url, {
  fetch: fetchIndex = globalThis.fetch?.bind(globalThis),
  recent
} = {}) {
  let read = null;

  const once = () => {
    if (read) return read;
    read = Promise.resolve(fetchIndex(url, {
      credentials: 'same-origin'
    })).then(response => {
      if (!response.ok) throw new Error(`index ${response.status}`);
      return response.json();
    });
    read.catch(() => {
      read = null;
    });
    return read;
  };

  const host = builtinSearchHost({
    read: () => once(),
    local: true,
    recent
  });
  host.source = url;
  return host;
}
/** The provider host: the page's own function answers every query. */

function providerHost(provider, {
  recent
} = {}) {
  const call = typeof provider === 'function' ? provider : (query, options) => provider.search(query, options);
  const host = builtinSearchHost({
    read: (query, options) => call(query, options),
    local: false,
    recent
  });
  host.source = 'provider';
  return host;
}

/***/ },

/***/ "3298a6643d1e"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ALL_SCOPE_KEY: () => (/* binding */ ALL_SCOPE_KEY),
/* harmony export */   renderSearchTemplate: () => (/* binding */ renderSearchTemplate),
/* harmony export */   renderSearchWindow: () => (/* binding */ renderSearchWindow)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var lit_directives_keyed_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("9d9903b87148");
/* harmony import */ var lit_directives_live_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("2d6390ae26b0");
/* harmony import */ var _component_kbd_js_shortcut__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("151a293c8c90");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, lit_directives_keyed_js__WEBPACK_IMPORTED_MODULE_1__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, lit_directives_keyed_js__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lit_directives_keyed_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lit_directives_keyed_js__WEBPACK_IMPORTED_MODULE_1__);



 // The host: the page's trigger, in place. The host itself is display:
// contents, so the trigger stands in the page as the page wrote it, before the
// code and after it.

function renderSearchTemplate(context) {
  const {
    hasSlot,
    slot
  } = context;
  return hasSlot('trigger') ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${slot('trigger')}` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
} // One part of a title, the match marked (the first place a term of the query
// stands in it): medium weight on the row's own colour (owner decision C139
// (8), as sf-input-lookup marks it), no fill.

const marked = ([before, match, after]) => match ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${before}<mark class="sf-search-mark">${match}</mark>${after}` : before;

const glyph = (name, extra = '') => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class=${`sf-icon ${extra}`.trim()} aria-hidden="true">${name}</i>`; // The scope tag of «Все»: a key no group of a host is called.


const ALL_SCOPE_KEY = '*';

function keycaps(shortcut) {
  const {
    keys,
    join
  } = (0,_component_kbd_js_shortcut__WEBPACK_IMPORTED_MODULE_3__.shortcutView)(shortcut);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<kbd class="sf-kbd--group">${keys.map((key, at) => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${at && join ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-kbd-join">+</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}<kbd class=${key.square ? 'sf-kbd--square' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>${key.text}</kbd>`)}</kbd>`;
} // The row's own buttons (owner decision C175 (6), C148 (3)): icon buttons 32,
// 8 apart (C105 H5), out of the Tab order -- → reaches them from the field.


function rowActions(context, row) {
  const {
    component,
    words,
    selected
  } = context;

  const stop = event => {
    event.preventDefault();
    event.stopPropagation();
  };

  const button = (icon, label, press, keys = '') => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button-icon icon=${icon} size="1/2" appearance="ghost" scheme="on-surface"
    aria-label=${label} aria-keyshortcuts=${keys || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} @click=${event => {
    stop(event);
    press();
  }}></sf-button-icon>`;

  if (row.kind === 'recent' || row.recentPage) {
    // A recent query or page: its cross, which a pointer finds on the row it
    // stands on and a finger always sees (SW-18).
    const forget = row.kind === 'recent' ? () => component.forgetRecent(row.text) : () => component.forgetRecentPage(row.item.id);
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-search-row-actions sf-search-row-actions--recent" @keydown=${event => component.onRowActionsKeydown(event)}
      @mousedown=${stop}>${button('close', row.removeLabel, forget)}</span>`;
  }

  if (row.index !== selected || row.kind !== 'result' || !row.url) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-search-row-actions" @keydown=${event => component.onRowActionsKeydown(event)} @mousedown=${stop}>
    ${button('open_in_new', words.newTab, () => component.openInNewTab(row.index), 'Control+Enter Meta+Enter')}
    ${button('link', words.copyLink, () => component.copyLink(row.index))}
  </span>`;
} // The end of a row: a command's keys, a step's chevron, the row's buttons, or
// on the selected row the Enter it answers.


function rowEnd(context, row) {
  const {
    selected
  } = context;
  if (row.shortcut) return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-search-row-keys">${keycaps(row.shortcut)}</span>`;
  if (row.kind === 'result' && row.item.kind === 'action' && row.item.steps) return glyph('chevron_right', 'sf-search-row-next');
  const actions = rowActions(context, row);
  if (actions !== lit__WEBPACK_IMPORTED_MODULE_0__.nothing) return actions; // A record's time: quiet, at the row's end (C175 (2), the prototype's mail
  // and admin rows).

  if (row.item?.time) return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-search-row-meta"><sf-time datetime=${row.item.time} tooltip="none"></sf-time></span>`;
  if (row.index === selected && row.kind !== 'more') return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-search-row-keys" aria-hidden="true"><kbd class="sf-kbd--group"><kbd class="sf-kbd--square">↵</kbd></kbd></span>`;
  return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
} // The row's picture (C175 (2)): the glyph 20 of menu and list rows, an
// avatar for a person or a chat. sf-avatar draws a button; in a row it is a
// picture, so the host is inert: no Tab stop, nothing read, a press falls to
// the row.
//
// A result's own picture (port 1.2.0 image, msg-bc1702eb): a file's thumbnail
// or a record's image, on a plate of its own at the avatar's size -- the only
// row picture with a plate. The picture is decoration beside the title (alt
// empty); one that fails to load gives its place back to the glyph. Keyed by
// the address, so a reused row never keeps another picture's failure.


function rowLead(context, row) {
  const avatar = row.avatar ?? row.item?.avatar;

  if (avatar && (avatar.name || avatar.image)) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-avatar class="sf-search-row-avatar" size="1/2" heading=${avatar.name || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} image-url=${avatar.image || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      hue="auto" inert></sf-avatar>`;
  }

  const image = typeof row.item?.image === 'string' ? row.item.image.trim() : '';
  const {
    component
  } = context; // A picture of its own (port 1.2.0, C175 (2)) on its plate; one that failed
  // to load gives the row its glyph back (sf-search pictureFailed).

  if (image && (!component?.pictureOk || component.pictureOk(image))) {
    return (0,lit_directives_keyed_js__WEBPACK_IMPORTED_MODULE_1__.keyed)(image, (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-search-row-image" aria-hidden="true"><img class="sf-search-row-image-picture" src=${image} alt=""
      loading="lazy" decoding="async" @error=${() => component?.pictureFailed?.(image)}></span>`);
  }

  return row.icon ? glyph(row.icon, 'sf-search-row-icon') : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
}

function renderRow(context, row) {
  const {
    ids,
    selected,
    component,
    show
  } = context;
  const isSelected = row.index === selected;
  const path = show.path && row.path;
  const item = row.item ?? {};
  const classes = ['sf-search-row', path ? 'sf-search-row--two' : '', row.kind === 'recent' || row.recentPage ? 'sf-search-row--recent' : '', row.kind === 'more' ? 'sf-search-row--more' : '', isSelected ? 'sf-search-row--selected' : ''].filter(Boolean).join(' ');
  const line = (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-search-row-line"><span class="sf-search-row-title">${marked(row.title)}</span>${item.badge ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-badge class="sf-search-row-badge" appearance="outline" size="1/3" text=${item.badge}></sf-badge>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}</span>`;
  const words = (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${rowLead(context, row)}<span class="sf-search-row-text">${line}${path ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-search-row-path">${row.path}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}</span>`;
  const {
    url
  } = row; // A page row is a link (C175 (6)): Ctrl/Command with a press and the middle
  // button open it in a new tab, as any link does. The link covers the row;
  // the row's buttons stand over it.

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class=${classes} role="option" id=${ids.option(row.index)} aria-selected=${isSelected ? 'true' : 'false'}
    @pointerenter=${event => component.markCut(event.currentTarget)}
    @pointermove=${() => component.hover(row.index)} @click=${event => component.onRowClick(event, row.index)}>
    ${url ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<a class="sf-search-row-main" href=${url} tabindex="-1">${words}</a>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-search-row-main">${words}</span>`}
    ${rowEnd(context, row)}
  </div>`;
}

function renderPills(context, texts) {
  const {
    component
  } = context;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-search-pills">${texts.map(text => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<button class="sf-search-pill" type="button"
    @click=${() => component.setQuery(text)}>${text}</button>`)}</div>`;
}

function renderSection(context, section) {
  const {
    words,
    component
  } = context;

  if (section.kind === 'popular') {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-search-section">
      <div class="sf-search-caption"><span>${words.popular}</span></div>
      ${renderPills(context, section.texts)}
    </div>`;
  }

  if (section.kind === 'results') {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-search-list" role="listbox" id=${section.id} aria-label=${words.results} aria-busy=${context.view.stale ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
      ${section.groups.map(group => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-search-group" role="group" aria-labelledby=${group.captionId || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        aria-label=${group.captionId ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : group.label}>
        ${group.captionId ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-search-caption" role="presentation"><span id=${group.captionId}>${group.label}</span></div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        ${group.rows.map(row => renderRow(context, row))}
      </div>`)}
    </div>`;
  } // recent, actions and refine: a caption (with the clear button for recent)
  // over a list of their own.


  const captionId = `${section.id}-caption`;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-search-section">
    <div class="sf-search-caption"><span id=${captionId}>${section.label}</span>
      ${section.kind === 'recent' ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<button class="sf-search-caption-action" type="button"
        @click=${() => component.clearRecent()}>${words.recentClear}</button>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    </div>
    <div class="sf-search-list" role="listbox" id=${section.id} aria-labelledby=${captionId} aria-busy=${context.view.stale ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
      ${section.rows.map(row => renderRow(context, row))}
    </div>
  </div>`;
} // The field's tags (C175 (7), (8)): a command's step, and the operators
// typed; a tag in a field is the field's, its line the head's row less 8
// (C145 (1)).


function renderTags(context) {
  const {
    component,
    view,
    words
  } = context;
  const step = view.step ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-tag class="sf-search-tag" kind="default" size="1/2" inline text=${view.step.title} closable close-label=${words.back}
      @sf-tag-close=${event => {
    event.stopPropagation();
    component.leaveStep();
  }} @close=${event => event.stopPropagation()}></sf-tag>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const tokens = view.tokens.map((token, at) => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-tag class="sf-search-tag" kind="default" size="1/2" inline
    text=${`${token.word}: ${token.label || token.value}`} closable close-label=${words.removeTag}
    @sf-tag-close=${event => {
    event.stopPropagation();
    component.setTokens(view.tokens.filter((_, index) => index !== at));
  }} @close=${event => event.stopPropagation()}></sf-tag>`);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${step}${tokens}`;
} // The window, drawn into the layer's portal while it is open: the scrim and
// one surface -- the field as its frameless head with a line under it (owner
// decisions C175 (1), C06), the filters, the rows and the key hints.


function renderSearchWindow(context) {
  const {
    component,
    ids,
    query,
    words,
    view,
    busy,
    statusText,
    placeholder,
    label,
    hints
  } = context;
  const filled = query.length > 0 || view.tokens.length > 0;
  const listIds = view.sections.filter(section => section.kind !== 'popular').map(section => section.id).join(' ');
  const scopes = view.scopes;
  const {
    correction,
    notice,
    pane,
    preview
  } = view; // The «Поиск…» line over the rows it keeps (C139 (4), C130 (8)): drawn
  // after the wait delay, so its spinner shows with it; the words say the
  // wait once (the spinner's label is for a screen reader and is not drawn).
  // Nothing found and a failure: an inline sf-empty-state (C120), which the
  // window's own status announces (live off).

  const body = (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class=${`sf-search-body${view.stale ? ' sf-search-body--stale' : ''}`}>
        ${view.waiting ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-search-wait" aria-hidden="true">
          <sf-spinner class="sf-search-spinner" size="1/2" label=${words.loading} label-hidden></sf-spinner><span>${words.loading}</span>
        </div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        ${view.state ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-search-state"><sf-empty-state kind=${view.state.kind} layout="inline" size="1/2" live="off"
          text=${view.state.text} .actions=${view.state.actions ?? undefined}
          @sf-empty-state-action=${event => component.onStateAction(event)}></sf-empty-state></div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        ${view.sections.map(section => renderSection(context, section))}
        ${view.message ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-search-message">${view.message}</div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      </div>`;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-search-scrim" aria-hidden="true" @click=${() => component.close({
    reason: 'outside'
  })}></div>
  <div class=${`sf-search-window${pane ? ' sf-search-window--pane' : ''}${view.step ? ' sf-search-window--step' : ''}`} id=${ids.dialog}
    role="dialog" aria-modal="true" aria-label=${label}>
    <div class=${`sf-search-head${filled ? ' sf-search-head--filled' : ''}`}>
      <sf-button-icon class="sf-search-back" icon="arrow_back" size="1/2" appearance="ghost" scheme="on-surface"
        aria-label=${view.step ? words.back : words.close} aria-keyshortcuts="Escape" @click=${() => component.onBackPress()}></sf-button-icon>
      <span class="sf-search-glyph">${glyph('search')}</span>
      <div class="sf-search-query">
        ${renderTags(context)}
        <input class="sf-search-input" type="text" role="combobox" aria-autocomplete="list" aria-expanded="true"
          aria-controls=${listIds || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} aria-activedescendant=${view.activeId || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} aria-label=${label}
          placeholder=${placeholder} autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="search"
          @input=${event => component.onInput(event)} @keydown=${event => component.onFieldKeydown(event)}>
      </div>
      ${filled ? (0,lit_directives_keyed_js__WEBPACK_IMPORTED_MODULE_1__.keyed)(view.step ? 'step' : 'query', (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button-icon class="sf-search-clear" icon="close" size="1/2" appearance="ghost" scheme="on-surface"
        aria-label=${words.clear} aria-keyshortcuts="Escape" @click=${() => component.onClearPress()}></sf-button-icon>`) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    </div>
    ${scopes.length > 1 ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-tag-group class="sf-search-scopes" selection="one" layout="wrap" aria-label=${words.scopes}
      @pointerdown=${() => component.onScopePointer()} @keydown=${() => component.onScopeKey()}
      @sf-tag-group-select=${event => component.onScopeSelect(event)}>
      ${scopes.map(scope => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-tag kind="checkbox" key=${scope.id || ALL_SCOPE_KEY} size="1/2" text=${scope.label} count=${String(scope.count)}
        ?active=${(0,lit_directives_live_js__WEBPACK_IMPORTED_MODULE_2__.live)(scope.pressed)}></sf-tag>`)}
    </sf-tag-group>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    ${notice ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-search-notice" role="alert">${notice}</div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    ${correction ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<button class="sf-search-correction" type="button"
      @click=${() => component.setQuery(correction.query)}>${correction.text}${correction.count === null ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-search-count">${correction.count}</span>`}</button>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    <div class="sf-search-card" aria-busy=${busy ? 'true' : 'false'} @mousedown=${event => component.keepFocus(event)}>
      ${pane ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-search-split">
        ${body}
        <aside class="sf-search-preview" aria-label=${words.preview}>
          ${preview ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${preview.path ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-search-preview-path">${preview.path}</div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          ${preview.title ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-search-preview-title">${preview.title}</div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          ${preview.text ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<p class="sf-search-preview-text">${preview.text}</p>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        </aside>
      </div>` : body}
    </div>
    ${hints.length ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-search-keys" aria-hidden="true">
      ${hints.map(hint => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-search-key">${hint.keys.map(key => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<kbd appearance="cap" class=${key.length === 1 ? 'sf-kbd--square' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>${key}</kbd>`)}${hint.label}</span>`)}
    </div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    <div class="sr-only" role="status" aria-live="polite">${statusText}</div>
  </div>`;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "ce3ad881d0a0"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "5b7d7695b41b"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("element-manifest", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("element-manifest", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "18003344cff0"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("layer-stack", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("layer-stack", 1).then(resolve, reject), { once: true })));

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

/***/ "a5a956c9f619"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TemplateResultType: () => (/* binding */ e),
/* harmony export */   clearPart: () => (/* binding */ j),
/* harmony export */   getCommittedValue: () => (/* binding */ M),
/* harmony export */   getDirectiveClass: () => (/* binding */ f),
/* harmony export */   insertPart: () => (/* binding */ v),
/* harmony export */   isCompiledTemplateResult: () => (/* binding */ d),
/* harmony export */   isDirectiveResult: () => (/* binding */ c),
/* harmony export */   isPrimitive: () => (/* binding */ n),
/* harmony export */   isSingleExpression: () => (/* binding */ r),
/* harmony export */   isTemplateResult: () => (/* binding */ l),
/* harmony export */   removePart: () => (/* binding */ h),
/* harmony export */   setChildPartValue: () => (/* binding */ u),
/* harmony export */   setCommittedValue: () => (/* binding */ p)
/* harmony export */ });
/* harmony import */ var _lit_html_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("f550d360fd36");

/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{I:t}=_lit_html_js__WEBPACK_IMPORTED_MODULE_0__._$LH,i=o=>o,n=o=>null===o||"object"!=typeof o&&"function"!=typeof o,e={HTML:1,SVG:2,MATHML:3},l=(o,t)=>void 0===t?void 0!==o?._$litType$:o?._$litType$===t,d=o=>null!=o?._$litType$?.h,c=o=>void 0!==o?._$litDirective$,f=o=>o?._$litDirective$,r=o=>void 0===o.strings,s=()=>document.createComment(""),v=(o,n,e)=>{const l=o._$AA.parentNode,d=void 0===n?o._$AB:n._$AA;if(void 0===e){const i=l.insertBefore(s(),d),n=l.insertBefore(s(),d);e=new t(i,n,o,o.options)}else{const t=e._$AB.nextSibling,n=e._$AM,c=n!==o;if(c){let t;e._$AQ?.(o),e._$AM=o,void 0!==e._$AP&&(t=o._$AU)!==n._$AU&&e._$AP(t)}if(t!==d||c){let o=e._$AA;for(;o!==t;){const t=i(o).nextSibling;i(l).insertBefore(o,d),o=t}}}return e},u=(o,t,i=o)=>(o._$AI(t,i),o),m={},p=(o,t=m)=>o._$AH=t,M=o=>o._$AH,h=o=>{o._$AR(),o._$AA.remove()},j=o=>{o._$AR()};
//# sourceMappingURL=directive-helpers.js.map


/***/ },

/***/ "0e2a9b296d0b"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Directive: () => (/* binding */ i),
/* harmony export */   PartType: () => (/* binding */ t),
/* harmony export */   directive: () => (/* binding */ e)
/* harmony export */ });
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},e=t=>(...e)=>({_$litDirective$:t,values:e});class i{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}
//# sourceMappingURL=directive.js.map


/***/ },

/***/ "42b0b8d71f19"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   live: () => (/* binding */ l)
/* harmony export */ });
/* harmony import */ var _lit_html_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("f550d360fd36");
/* harmony import */ var _directive_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("0e2a9b296d0b");
/* harmony import */ var _directive_helpers_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("a5a956c9f619");

/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const l=(0,_directive_js__WEBPACK_IMPORTED_MODULE_1__.directive)(class extends _directive_js__WEBPACK_IMPORTED_MODULE_1__.Directive{constructor(r){if(super(r),r.type!==_directive_js__WEBPACK_IMPORTED_MODULE_1__.PartType.PROPERTY&&r.type!==_directive_js__WEBPACK_IMPORTED_MODULE_1__.PartType.ATTRIBUTE&&r.type!==_directive_js__WEBPACK_IMPORTED_MODULE_1__.PartType.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!(0,_directive_helpers_js__WEBPACK_IMPORTED_MODULE_2__.isSingleExpression)(r))throw Error("`live` bindings can only contain a single expression")}render(r){return r}update(i,[t]){if(t===_lit_html_js__WEBPACK_IMPORTED_MODULE_0__.noChange||t===_lit_html_js__WEBPACK_IMPORTED_MODULE_0__.nothing)return t;const o=i.element,l=i.name;if(i.type===_directive_js__WEBPACK_IMPORTED_MODULE_1__.PartType.PROPERTY){if(t===o[l])return _lit_html_js__WEBPACK_IMPORTED_MODULE_0__.noChange}else if(i.type===_directive_js__WEBPACK_IMPORTED_MODULE_1__.PartType.BOOLEAN_ATTRIBUTE){if(!!t===o.hasAttribute(l))return _lit_html_js__WEBPACK_IMPORTED_MODULE_0__.noChange}else if(i.type===_directive_js__WEBPACK_IMPORTED_MODULE_1__.PartType.ATTRIBUTE&&o.getAttribute(l)===t+"")return _lit_html_js__WEBPACK_IMPORTED_MODULE_0__.noChange;return (0,_directive_helpers_js__WEBPACK_IMPORTED_MODULE_2__.setCommittedValue)(i),t}});
//# sourceMappingURL=live.js.map


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

/***/ "2d6390ae26b0"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   live: () => (/* reexport safe */ lit_html_directives_live_js__WEBPACK_IMPORTED_MODULE_0__.live)
/* harmony export */ });
/* harmony import */ var lit_html_directives_live_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("42b0b8d71f19");

//# sourceMappingURL=live.js.map


/***/ },

/***/ "42ad4537fcaf"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   files: () => (/* binding */ files)
/* harmony export */ });
/* harmony import */ var _en_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("b6bee636c245");
// Written by scripts/build-language-packs.mjs from src/core/lang/built-in.json
// (owner decision C282); do not edit. The words this bundle carries: the
// built-in languages' (en); every other language comes from
// a language file (core/lang/<code>.js or its parts).


const files = { en: { runtime: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime } };

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ en: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime });


/***/ },

/***/ "e264eb73f918"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.search","tag":"sf-search","version":"1.12.1","kind":"leaf","settings":{"index":{"type":"string","default":""},"provider":{"type":"object","default":null},"for":{"type":"string","default":""},"shortcut":{"type":"string","default":"mod+k /"},"label":{"type":"string","default-from":"runtime.label"},"placeholder":{"type":"string","default-from":"runtime.placeholder"},"scopes":{"type":"boolean","default":true},"recent":{"type":"boolean","default":true},"recent-key":{"type":"string","default":"site"},"popular":{"type":"boolean","default":true},"actions":{"type":"boolean","default":true},"path":{"type":"boolean","default":true},"keys":{"type":"boolean","default":true}},"values":{},"events":{"open":{"carries":{},"cancelable":true},"opened":{"carries":{}},"close":{"carries":{"reason":{"type":"enum","values":["close","escape","outside","cancelled","api"]}},"cancelable":true},"closed":{"carries":{"reason":{"type":"enum","values":["close","escape","outside","cancelled","api"]}}},"navigate":{"carries":{"id":{"type":"string"},"href":{"type":"string"},"action":{"type":"string"},"query":{"type":"string"},"group":{"type":"string"}},"cancelable":true},"intent":{"carries":{"intent":{"type":"enum","values":["query.change","result.open","result.preview","action.run","recent.forget","recent.clear"]},"payload":{"type":"object"},"answer":{"type":"object"}}}},"actions":{"open":{},"close":{"with":{"reason":{"type":"enum","values":["close","escape","outside","cancelled","api"]}}},"toggle":{}},"layer":{"kind":"modal","locks-page":true,"traps-focus":true},"port":{"id":"simai.search-port","version":"1.2.0","contract":"src/core/contracts/ports/simai.search-port/1.2.0/port.json"},"presentation":{"skeleton":{"late":[]}},"host-states":{"data-open":"boolean"},"css-variables":{"--sf-search-inline-size":{"type":"length","state":"open"},"--sf-search-inset-block-start":{"type":"length","state":"open"},"--sf-search-background-color":{"type":"color","state":"open"},"--sf-search-scrim-color":{"type":"color","state":"open"},"--sf-search-mark-color":{"type":"color","state":"open"},"--sf-search-radius":{"type":"length","state":"open"},"--sf-search-list-max-block-size":{"type":"length","state":"open"}}}');

/***/ },

/***/ "b6bee636c245"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Site search","runtime":{"label":"Site search","placeholder":"Search the site","clear-label":"Clear","close-label":"Close","back-label":"Back","scopes-label":"Search in","all-label":"All","results-label":"Results","recent-label":"Recent","recent-clear-label":"Clear","recent-remove-label":"Remove “{query}”","popular-label":"Popular","actions-label":"Quick actions","start-text":"Start typing to search","loading-text":"Searching…","error-text":"Search is unavailable now","empty-text":"Nothing found for “{query}”","empty-advice-text":"Nothing found for “{query}”. Check the word or pick a frequent query","count-text":{"one":"{n} result","other":"{n} results"},"key-select-label":"select","key-open-label":"open","key-clear-label":"clear","key-close-label":"close","correction-text":"Did you mean “{query}”?","preview-label":"Preview","refused-text":"That is not available to you","action-text":"The command did not run","short-text":"Type a little more","forbidden-text":"You have no access to this","not-found-text":"It is no longer there","step-placeholder":"Choose an option","new-tab-label":"Open in a new tab (Ctrl+↵)","copy-link-label":"Copy link","copied-text":"Link copied","copy-failed-text":"Could not copy the link","remove-tag-label":"Remove tag","refine-label":"Refine","more-text":"All results: {count}","search-all-label":"Search everywhere","options-text":{"one":"{n} option","other":"{n} options"},"key-apply-label":"apply","key-tag-label":"add tag","key-back-label":"back","operator-from":"from","operator-subject":"subject","operator-has":"has","operator-date":"date","operator-from-label":"Sender","operator-subject-label":"Subject","operator-has-label":"Has","operator-date-label":"Date","operator-from-hint":"person","operator-subject-hint":"words of the subject","operator-has-hint":"attachment","operator-date-hint":"period"}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("bf0584601359");
/******/
/******/ })()
;