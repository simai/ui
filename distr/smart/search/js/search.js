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

/***/ "bf0584601359"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SfSearch: () => (/* binding */ SfSearch),
/* harmony export */   highlight: () => (/* binding */ highlight),
/* harmony export */   matchesShortcut: () => (/* binding */ matchesShortcut),
/* harmony export */   normalizeAnswer: () => (/* binding */ normalizeAnswer),
/* harmony export */   parseShortcuts: () => (/* binding */ parseShortcuts),
/* harmony export */   searchIndex: () => (/* binding */ searchIndex)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_preferences_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("51250bf01ab0");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _core_js_layer_stack__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("18003344cff0");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("3298a6643d1e");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("e264eb73f918");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("b6bee636c245");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("028000b98469");
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("ce3ad881d0a0");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, _core_js_smart_base__WEBPACK_IMPORTED_MODULE_1__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_3__, _core_js_layer_stack__WEBPACK_IMPORTED_MODULE_4__, _js_templates_default__WEBPACK_IMPORTED_MODULE_5__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, _core_js_smart_base__WEBPACK_IMPORTED_MODULE_1__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_3__, _core_js_layer_stack__WEBPACK_IMPORTED_MODULE_4__, _js_templates_default__WEBPACK_IMPORTED_MODULE_5__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _core_js_layer_stack__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_4__);
// sf-search: the site search of a SIMAI site -- a window with a large rounded
// field and a separate results card under it, over a light scrim; a
// full-screen sheet on a phone. Variant 1 «Прожектор» of the owner's prototype
// (ui-control prototypes/search-and-settings.html, approved 2026-10-30).
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
// The results come from a provider -- a function the page gives, the port of
// this component -- or from the built-in provider over a static JSON index
// (`index`). Requests are debounced and a stale one is aborted.
//
// From its component.json (§3, §4, §8): the settings are made by
// core/js/element-manifest.js, open, close and toggle are the actions and
// answer outcomes, the words are the language files'.










const DEBOUNCE = 120;
const RECENT_LIMIT = 5;
const RESULT_LIMIT = 50;
const OVERLAY_CONTAINER = '[data-sf-overlay-container], [data-sf-drawer-container]';
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
let sequence = 0;

const applied = () => ({
  outcome: 'applied'
});

const refused = reason => ({
  outcome: 'refused',
  reason
}); // The recent queries are a view preference of the person (SF.Preferences,
// owner 2026-10-14): kept in the browser under sf-pref:sf-search/<recent-key>
// and by a host that keeps preferences for its user. The registry is the
// shared one when core has published it (every bundle has its own copy).


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
/** A provider's answer, or an index, in one shape (component.json provider). */


function normalizeAnswer(raw) {
  const groups = (Array.isArray(raw?.groups) ? raw.groups : []).map(group => typeof group === 'string' ? {
    id: group,
    label: group
  } : {
    id: text(group?.id),
    label: text(group?.label ?? group?.id)
  }).filter(group => group.id);
  const source = Array.isArray(raw) ? raw : Array.isArray(raw?.items) ? raw.items : [];
  const items = source.filter(item => item && text(item.title)).map((item, index) => ({
    id: text(item.id ?? item.href ?? item.url ?? item.action ?? index),
    group: text(item.group),
    title: text(item.title),
    path: Array.isArray(item.path) ? item.path.map(text).join(' › ') : text(item.path),
    href: text(item.href ?? item.url),
    action: text(item.action),
    icon: text(item.icon),
    shortcut: text(item.shortcut),
    text: text(item.text)
  }));
  const popular = (Array.isArray(raw?.popular) ? raw.popular : []).map(text).filter(Boolean);
  return {
    groups,
    items,
    popular
  };
}

const terms = query => query.toLowerCase().split(/\s+/u).filter(Boolean);
/**
 * The built-in provider's matching over a static index: every term of the
 * query is in the title, the path or the entry's text, case-insensitive; a
 * title that starts with the query comes first, then one that holds it, then
 * one that holds every term, then the rest, each in the index's order. The
 * empty query answers the quick actions and the popular queries.
 */


function searchIndex(index, query) {
  const data = normalizeAnswer(index);
  const q = text(query).trim().toLowerCase();
  if (!q) return {
    groups: data.groups,
    items: data.items.filter(item => item.action),
    popular: data.popular
  };
  const words = terms(q);
  const found = [];
  data.items.forEach((item, order) => {
    const title = item.title.toLowerCase();
    const hay = `${title} ${item.path} ${item.text}`.toLowerCase();
    if (!words.every(word => hay.includes(word))) return;
    let rank = 3;
    if (title.startsWith(q)) rank = 0;else if (title.includes(q)) rank = 1;else if (words.every(word => title.includes(word))) rank = 2;
    found.push({
      item,
      rank,
      order
    });
  });
  found.sort((a, b) => a.rank - b.rank || a.order - b.order);
  return {
    groups: data.groups,
    items: found.slice(0, RESULT_LIMIT).map(entry => entry.item),
    popular: data.popular
  };
}
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
const SearchElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_3__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_6__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_1___default()),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_7__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_8__
  },
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
    this.answer = null;
    this.emptyAnswer = null;
    this.popularList = [];
    this.recentList = [];
    this._portal = null;
    this._controller = null;
    this._timer = 0;
    this._index = null;

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
  }

  disconnectedCallback() {
    if (this.isOpen) this.finishClose({
      emit: false,
      restoreFocus: false
    });
    document.removeEventListener('keydown', this._onDocumentKeydown);
    document.removeEventListener('click', this._onDocumentClick);
    this.removeEventListener('click', this._onHostClick);
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

    if (this.isOpen && !(0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_4__.isTopLayer)(this)) return;
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
      return applied();
    }

    if (!this.sfEmit('open', {}, {
      cancelable: true
    })) return refused('prevented');
    this._returnTo = document.activeElement;
    this._returnAncestors = (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_4__.landmarksAround)(this._returnTo);
    this.isOpen = true;
    this.query = '';
    this.scope = '';
    this.selected = 0;
    this.status = 'idle';
    this.answer = null;
    this.recentList = this.readRecent();
    this.sfHostState('data-open', true);
    this.mountPortal();
    const contained = this._contained;
    (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_4__.openLayer)(this, {
      kind: 'modal',
      locksPage: !contained,
      trapsFocus: true,
      returnTo: this._returnTo,
      lockPage: () => this.lockPage(),
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
    this.syncTriggers();
    this.load('');

    const settle = () => {
      if (!this.isOpen) return;
      this.focusField();
      this.sfEmit('opened', {});
    };

    if (typeof globalThis.requestAnimationFrame === 'function') globalThis.requestAnimationFrame(settle);else Promise.resolve().then(settle);
    return applied();
  }

  runClose({
    reason = 'api',
    restoreFocus = true
  } = {}) {
    if (!this.isOpen) return refused('closed');
    if (!this.sfEmit('close', {
      reason
    }, {
      cancelable: true
    })) return refused('prevented');
    this.finishClose({
      reason,
      restoreFocus
    });
    return applied();
  }

  finishClose({
    reason = 'api',
    emit = true,
    restoreFocus = true
  } = {}) {
    this.isOpen = false;
    clearTimeout(this._timer);
    this._controller?.abort();
    this._controller = null;
    this.sfHostState('data-open', false);
    const wasTop = (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_4__.closeLayer)(this, {
      restoreFocus: false
    });
    this.unmountPortal();
    this.syncTriggers(); // Focus goes back to what had it when the window opened (§19.2): the
    // trigger, or the page where the key was pressed.

    if (restoreFocus) (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_4__.returnLayerFocus)(wasTop, this._returnTo, this._returnAncestors);
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
    (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_4__.carryLayerOrigin)(portal, this, {
      prefixes: ['--sf-search-']
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
  } // The one page lock (§19.1), as sf-site-header and sf-drawer take it.


  lockPage() {
    const root = document.documentElement;
    const body = document.body;
    if (!root || !body) return () => {};
    const gap = Math.max(0, window.innerWidth - root.clientWidth);
    const kept = {
      root: root.style.overflow,
      body: body.style.overflow,
      padding: body.style.paddingInlineEnd
    };
    root.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    if (gap > 0) body.style.paddingInlineEnd = `${gap}px`;
    return () => {
      root.style.overflow = kept.root;
      body.style.overflow = kept.body;
      body.style.paddingInlineEnd = kept.padding;
    };
  }

  dialog() {
    return this._portal?.querySelector('.sf-search-window') ?? null;
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
  } // Escape: a filled field is cleared first, an empty one closes the window.


  onEscape(event) {
    if (event.defaultPrevented || !this.isOpen || !(0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_4__.isTopLayer)(this)) return false;

    if (this.query) {
      this.setQuery('');
      return true;
    }

    this.close({
      reason: 'escape'
    });
    return true;
  } // The X in the field: the same two steps as Escape.


  onClearPress() {
    if (this.query) this.setQuery('');else this.close({
      reason: 'close'
    });
  }

  onTab(event) {
    if (!this.isOpen) return;
    const root = this.dialog();
    const items = root ? Array.from(root.querySelectorAll(FOCUSABLE)).filter(element => element.getClientRects().length > 0) : [];
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
    this.query = event.target.value;
    this.selected = 0;
    this.scheduleLoad();
    this.renderWindow();
  }

  onFieldKeydown(event) {
    if (event.isComposing) return;
    const count = this._view?.rowCount ?? 0;

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!count) return;
      const step = event.key === 'ArrowDown' ? 1 : -1;
      this.selected = (this.selected + step + count) % count;
      this.renderWindow({
        reveal: true
      });
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (count) this.choose(this.selected);
    }
  }

  setQuery(value) {
    const input = this.field();
    if (input) input.value = value;
    this.query = value;
    this.selected = 0;
    this.scheduleLoad();
    this.renderWindow();
    this.focusField();
  }

  setScope(id) {
    this.scope = id;
    this.selected = 0;
    this.renderWindow();
    this.focusField();
  }

  hover(index) {
    if (this.selected === index) return;
    this.selected = index;
    this.renderWindow();
  } // A result chosen: the query is recorded, the window closes, and the page
  // hears navigate; unless it takes it, the browser goes to href.


  choose(index) {
    const row = this._view?.rows[index];
    if (!row) return;

    if (row.kind === 'recent') {
      this.setQuery(row.text);
      return;
    }

    const query = this.query.trim();
    if (query) this.recordRecent(query);
    const {
      item
    } = row;
    this.runClose({
      reason: 'api'
    });
    const detail = {
      id: item.id,
      href: item.href,
      action: item.action,
      query,
      group: item.group
    };
    const allowed = this.sfEmit('navigate', detail, {
      cancelable: true
    });
    if (allowed && item.href && !item.action) globalThis.location?.assign(item.href);
  } // ---------------------------------------------------------- recent queries


  get recentPreference() {
    const key = String(this.recentKey || '').trim();
    return key ? `sf-search/${key}` : '';
  }

  readRecent() {
    if (!this.recent || !this.recentPreference) return this.recent ? this.recentList : [];

    try {
      const kept = preferences()?.read(this.recentPreference);
      const list = Array.isArray(kept?.queries) ? kept.queries : [];
      return list.filter(entry => typeof entry === 'string' && entry).slice(0, RECENT_LIMIT);
    } catch {
      return this.recentList;
    }
  }

  writeRecent(list) {
    this.recentList = list;
    if (!this.recentPreference) return;

    try {
      if (list.length) preferences()?.write(this.recentPreference, {
        v: 1,
        queries: list
      });else preferences()?.remove(this.recentPreference);
    } catch {// Storage refused (a private window, a sandbox): the list lives as long as the page.
    }
  }

  recordRecent(query) {
    if (!this.recent) return;
    const kept = this.readRecent().filter(entry => entry.toLowerCase() !== query.toLowerCase());
    this.writeRecent([query, ...kept].slice(0, RECENT_LIMIT));
  }

  removeRecent(query) {
    this.writeRecent(this.recentList.filter(entry => entry !== query));
    this.selected = 0;
    this.renderWindow();
    this.focusField();
  }

  clearRecent() {
    this.writeRecent([]);
    this.selected = 0;
    this.renderWindow();
    this.focusField();
  } // ---------------------------------------------------------- the port
  // The provider the page gave, else the built-in one over `index`.


  resolveProvider() {
    if (typeof this.provider === 'function') return this.provider;
    if (this.provider && typeof this.provider.search === 'function') return (query, options) => this.provider.search(query, options);
    const url = String(this.index || '').trim();
    if (!url) return null;
    return async query => searchIndex(await this.readIndex(url), query);
  } // The index is read once per address; a failed read is tried again next time.


  readIndex(url) {
    if (this._index?.url === url) return this._index.promise;
    const promise = fetch(url, {
      credentials: 'same-origin'
    }).then(response => {
      if (!response.ok) throw new Error(`index ${response.status}`);
      return response.json();
    });
    this._index = {
      url,
      promise
    };
    promise.catch(() => {
      if (this._index?.promise === promise) this._index = null;
    });
    return promise;
  }

  scheduleLoad() {
    clearTimeout(this._timer);
    const query = this.query.trim();

    if (!query) {
      // An empty field starts afresh: the next query waits for its own answer
      // rather than showing the last one's under new marks.
      this._controller?.abort();
      this._controller = null;
      this.answer = null;
      this.status = 'ready';
      return;
    }

    this._timer = setTimeout(() => this.load(query), DEBOUNCE);
  }

  async load(query) {
    this._controller?.abort();
    const provider = this.resolveProvider();

    if (!provider) {
      this.status = 'ready';
      this.renderWindow();
      return;
    }

    const controller = new AbortController();
    this._controller = controller;

    if (query) {
      this.status = 'loading';
      this.renderWindow();
    }

    try {
      const answer = normalizeAnswer(await provider(query, {
        scope: this.scope,
        signal: controller.signal
      }));
      if (controller.signal.aborted || !this.isOpen) return;
      if (query) this.answer = { ...answer,
        query
      };else this.emptyAnswer = answer;
      if (answer.popular.length) this.popularList = answer.popular;
      if (query) this.status = answer.items.length ? 'ready' : 'empty';
    } catch (error) {
      if (controller.signal.aborted || error?.name === 'AbortError' || !this.isOpen) return;
      if (query) this.status = 'error';
    }

    if (this._controller === controller) this._controller = null;
    this.renderWindow();
  } // ---------------------------------------------------------- drawing
  // What the window shows now: sections of rows, the scopes and a message.


  view() {
    const query = this.query.trim();
    const sections = [];
    const rows = [];

    const add = row => {
      row.index = rows.length;
      rows.push(row);
      return row;
    };

    const resultRow = item => add({
      kind: 'result',
      item,
      title: highlight(item.title, query),
      path: item.path,
      icon: item.icon || (item.action ? 'bolt' : 'description'),
      shortcut: item.action ? item.shortcut : ''
    });

    let scopes = [];
    let message = '';
    let messagePills = [];

    if (!query) {
      if (this.recent && this.recentList.length) {
        sections.push({
          kind: 'recent',
          id: `${this._id}-recent`,
          label: this.sfWord('recent-label'),
          rows: this.recentList.map(entry => add({
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
          }))
        });
      }

      if (this.popular && this.popularList.length) sections.push({
        kind: 'popular',
        texts: this.popularList
      });
      const actions = this.actions ? (this.emptyAnswer?.items ?? []).filter(item => item.action) : [];

      if (actions.length) {
        sections.push({
          kind: 'actions',
          id: `${this._id}-actions`,
          label: this.sfWord('actions-label'),
          rows: actions.map(resultRow)
        });
      }

      if (!sections.length) message = this.sfWord('start-text');
    } else {
      const answer = this.answer;
      const items = (answer?.items ?? []).filter(item => this.actions || !item.action);
      const order = [...(answer?.groups ?? [])];

      for (const item of items) if (!order.some(group => group.id === item.group)) order.push({
        id: item.group,
        label: item.group
      });

      const present = order.filter(group => items.some(item => item.group === group.id));
      if (!present.some(group => group.id === this.scope)) this.scope = '';
      if (!this.scopes) this.scope = '';
      scopes = [{
        id: '',
        label: this.sfWord('all-label'),
        count: items.length,
        pressed: this.scope === ''
      }, ...present.map(group => ({
        id: group.id,
        label: group.label,
        count: items.filter(item => item.group === group.id).length,
        pressed: this.scope === group.id
      }))];
      const shown = present.filter(group => !this.scope || group.id === this.scope);
      const captions = !this.scope && (present.length > 1 || present[0]?.label);
      const groups = shown.map((group, n) => ({
        label: group.label || this.sfWord('results-label'),
        captionId: captions && group.label ? `${this._id}-group-${n}` : '',
        rows: items.filter(item => item.group === group.id).map(resultRow)
      }));
      if (rows.length) sections.push({
        kind: 'results',
        id: `${this._id}-results`,
        groups
      });
      if (!answer && this.status === 'loading') message = this.sfWord('loading-text');else if (this.status === 'error') message = this.sfWord('error-text');else if (!rows.length && answer) {
        message = this.sfWord('empty-text', {
          vars: {
            query
          }
        });
        if (this.popular) messagePills = this.popularList.slice(0, 3);
      }
    }

    if (this.selected >= rows.length) this.selected = Math.max(0, rows.length - 1);
    return {
      sections,
      rows,
      rowCount: rows.length,
      scopes,
      message,
      messagePills,
      activeId: rows.length ? `${this._id}-option-${this.selected}` : ''
    };
  }

  statusText(view) {
    if (!this.query.trim()) return '';
    if (this.status === 'loading' && !this.answer) return this.sfWord('loading-text');
    if (this.status === 'error') return this.sfWord('error-text');
    if (!view.rowCount) return this.answer ? this.sfWord('empty-text', {
      vars: {
        query: this.query.trim()
      }
    }) : '';
    return this.sfWord('count-text', {
      count: view.rowCount
    });
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
      recentClear: this.sfWord('recent-clear-label'),
      keySelect: this.sfWord('key-select-label'),
      keyOpen: this.sfWord('key-open-label'),
      keyClear: this.sfWord('key-clear-label'),
      keyClose: this.sfWord('key-close-label')
    };
    (0,lit__WEBPACK_IMPORTED_MODULE_0__.render)((0,_js_templates_default__WEBPACK_IMPORTED_MODULE_5__.renderSearchWindow)({
      component: this,
      ids: {
        dialog: `${this._id}-dialog`,
        option: index => `${this._id}-option-${index}`
      },
      query: this.query,
      label: this.label,
      placeholder: this.placeholder,
      selected: this.selected,
      status: this.status,
      statusText: this.statusText(view),
      show: {
        scopes: this.scopes,
        path: this.path,
        keys: this.keys
      },
      words,
      view
    }), this._portal);
    if (reveal) this._portal.querySelector('.sf-search-row--selected')?.scrollIntoView?.({
      block: 'nearest'
    });
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
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_5__.renderSearchTemplate)(this.templateContext());
  }

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (oldValue === newValue || !this.isOpen) return;

    if (name === 'index') {
      this.answer = null;
      this.emptyAnswer = null;
      this.load(this.query.trim());
    }

    this.renderWindow();
  }

}

SfSearch.define('sf-search');

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "3298a6643d1e"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderSearchTemplate: () => (/* binding */ renderSearchTemplate),
/* harmony export */   renderSearchWindow: () => (/* binding */ renderSearchWindow)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var lit_directives_keyed_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("9d9903b87148");
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
// stands in it).

const marked = ([before, match, after]) => match ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${before}<mark class="sf-search-mark">${match}</mark>${after}` : before;

const glyph = (name, extra = '') => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class=${`sf-icon ${extra}`.trim()} aria-hidden="true">${name}</i>`;

function renderRow(context, row) {
  const {
    ids,
    selected,
    component,
    show
  } = context;
  const isSelected = row.index === selected;
  const classes = ['sf-search-row', row.kind === 'recent' ? 'sf-search-row--recent' : '', !show.path || !row.path ? 'sf-search-row--single' : '', isSelected ? 'sf-search-row--selected' : ''].filter(Boolean).join(' ');
  let trailing = lit__WEBPACK_IMPORTED_MODULE_0__.nothing;

  if (row.kind === 'recent') {
    trailing = (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<button class="sf-search-remove" type="button" tabindex="-1" aria-label=${row.removeLabel}
      @click=${event => {
      event.stopPropagation();
      component.removeRecent(row.text);
    }}>${glyph('close')}</button>`;
  } else if (row.shortcut) {
    trailing = (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<kbd class="sf-search-shortcut">${row.shortcut}</kbd>`;
  } else {
    trailing = glyph('arrow_forward', 'sf-search-go');
  }

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class=${classes} role="option" id=${ids.option(row.index)} aria-selected=${isSelected ? 'true' : 'false'}
    @pointermove=${() => component.hover(row.index)} @click=${() => component.choose(row.index)}>
    <span class="sf-search-row-icon">${glyph(row.icon)}</span>
    <span class="sf-search-row-text">
      <span class="sf-search-row-title">${marked(row.title)}</span>
      ${show.path && row.path ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-search-row-path">${row.path}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    </span>
    ${trailing}
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
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-search-list" role="listbox" id=${section.id} aria-label=${words.results}>
      ${section.groups.map(group => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-search-group" role="group" aria-labelledby=${group.captionId || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        aria-label=${group.captionId ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : group.label}>
        ${group.captionId ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-search-caption" role="presentation"><span id=${group.captionId}>${group.label}</span></div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        ${group.rows.map(row => renderRow(context, row))}
      </div>`)}
    </div>`;
  } // recent and actions: a caption (with the clear button for recent) over a
  // list of their own.


  const captionId = `${section.id}-caption`;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-search-section">
    <div class="sf-search-caption"><span id=${captionId}>${section.label}</span>
      ${section.kind === 'recent' ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<button class="sf-search-caption-action" type="button"
        @click=${() => component.clearRecent()}>${words.recentClear}</button>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    </div>
    <div class="sf-search-list" role="listbox" id=${section.id} aria-labelledby=${captionId}>
      ${section.rows.map(row => renderRow(context, row))}
    </div>
  </div>`;
} // The window, drawn into the layer's portal while it is open: the scrim, the
// field and the results card. The field and the card are two raised surfaces
// with the scrim between them and the page.


function renderSearchWindow(context) {
  const {
    component,
    ids,
    query,
    words,
    show,
    view,
    status,
    statusText,
    placeholder,
    label
  } = context;
  const filled = query.length > 0;
  const listIds = view.sections.filter(section => section.kind !== 'popular').map(section => section.id).join(' ');
  const scopes = view.scopes;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-search-scrim" aria-hidden="true" @click=${() => component.close({
    reason: 'outside'
  })}></div>
  <div class="sf-search-window" id=${ids.dialog} role="dialog" aria-modal="true" aria-label=${label}>
    <div class=${`sf-search-field${filled ? ' sf-search-field--filled' : ''}`}>
      <sf-icon-button class="sf-search-back" icon="arrow_back" size="1/2" appearance="link" scheme="on-surface"
        aria-label=${words.back} @click=${() => component.close({
    reason: 'close'
  })}></sf-icon-button>
      <span class="sf-search-glyph">${glyph('search')}</span>
      <input class="sf-search-input" type="text" role="combobox" aria-autocomplete="list" aria-expanded="true"
        aria-controls=${listIds || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} aria-activedescendant=${view.activeId || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} aria-label=${label}
        placeholder=${placeholder} autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="search"
        @input=${event => component.onInput(event)} @keydown=${event => component.onFieldKeydown(event)}>
      ${(0,lit_directives_keyed_js__WEBPACK_IMPORTED_MODULE_1__.keyed)(filled, (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-icon-button class="sf-search-clear" icon="close" size="1/2" appearance="link" scheme="on-surface"
        aria-label=${filled ? words.clear : words.close} @click=${() => component.onClearPress()}></sf-icon-button>`)}
    </div>
    <div class="sf-search-card" aria-busy=${status === 'loading' ? 'true' : 'false'} @mousedown=${event => component.keepFocus(event)}>
      ${show.scopes && scopes.length > 1 ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-search-scopes" role="group" aria-label=${words.scopes}>
        ${scopes.map(scope => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<button class="sf-search-pill sf-search-scope" type="button" aria-pressed=${scope.pressed ? 'true' : 'false'}
          @click=${() => component.setScope(scope.id)}>${scope.label}<span class="sf-search-count">${scope.count}</span></button>`)}
      </div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      <div class="sf-search-body">
        ${view.sections.map(section => renderSection(context, section))}
        ${view.message ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-search-message">${view.message}</div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        ${view.messagePills?.length ? renderPills(context, view.messagePills) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      </div>
      ${show.keys && view.rowCount ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-search-keys" aria-hidden="true">
        <span class="sf-search-key"><kbd>↑</kbd><kbd>↓</kbd>${words.keySelect}</span>
        <span class="sf-search-key"><kbd>↵</kbd>${words.keyOpen}</span>
        <span class="sf-search-key"><kbd>esc</kbd>${filled ? words.keyClear : words.keyClose}</span>
      </div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    </div>
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

/***/ "e264eb73f918"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.search","tag":"sf-search","version":"1.0.0","kind":"leaf","settings":{"index":{"type":"string","default":""},"provider":{"type":"object","default":null},"for":{"type":"string","default":""},"shortcut":{"type":"string","default":"mod+k /"},"label":{"type":"string","default-from":"runtime.label"},"placeholder":{"type":"string","default-from":"runtime.placeholder"},"scopes":{"type":"boolean","default":true},"recent":{"type":"boolean","default":true},"recent-key":{"type":"string","default":"site"},"popular":{"type":"boolean","default":true},"actions":{"type":"boolean","default":true},"path":{"type":"boolean","default":true},"keys":{"type":"boolean","default":true}},"values":{},"events":{"open":{"carries":{},"cancelable":true},"opened":{"carries":{}},"close":{"carries":{"reason":{"type":"enum","values":["close","escape","outside","cancelled","api"]}},"cancelable":true},"closed":{"carries":{"reason":{"type":"enum","values":["close","escape","outside","cancelled","api"]}}},"navigate":{"carries":{"id":{"type":"string"},"href":{"type":"string"},"action":{"type":"string"},"query":{"type":"string"},"group":{"type":"string"}},"cancelable":true}},"actions":{"open":{},"close":{"with":{"reason":{"type":"enum","values":["close","escape","outside","cancelled","api"]}}},"toggle":{}},"layer":{"kind":"modal","locks-page":true,"traps-focus":true},"host-states":{"data-open":"boolean"},"css-variables":{"--sf-search-inline-size":{"type":"length","state":"open"},"--sf-search-inset-block-start":{"type":"length","state":"open"},"--sf-search-background":{"type":"color","state":"open"},"--sf-search-scrim-color":{"type":"color","state":"open"},"--sf-search-mark-color":{"type":"color","state":"open"},"--sf-search-radius":{"type":"length","state":"open"},"--sf-search-list-max-block-size":{"type":"length","state":"open"}}}');

/***/ },

/***/ "b6bee636c245"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Site search","runtime":{"label":"Site search","placeholder":"Search the site","clear-label":"Clear","close-label":"Close","back-label":"Back","scopes-label":"Search in","all-label":"All","results-label":"Results","recent-label":"Recent","recent-clear-label":"Clear","recent-remove-label":"Remove “{query}”","popular-label":"Popular","actions-label":"Quick actions","start-text":"Start typing to search","loading-text":"Searching…","error-text":"Search is unavailable now","empty-text":"Nothing found for “{query}”","count-text":{"one":"{n} result","other":"{n} results"},"key-select-label":"select","key-open-label":"open","key-clear-label":"clear","key-close-label":"close"}}');

/***/ },

/***/ "028000b98469"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Поиск по сайту","runtime":{"label":"Поиск по сайту","placeholder":"Найти на сайте","clear-label":"Очистить","close-label":"Закрыть","back-label":"Назад","scopes-label":"Где искать","all-label":"Все","results-label":"Результаты","recent-label":"Недавние","recent-clear-label":"Очистить","recent-remove-label":"Убрать «{query}»","popular-label":"Часто ищут","actions-label":"Быстрые действия","start-text":"Начните вводить запрос","loading-text":"Ищем…","error-text":"Поиск сейчас недоступен","empty-text":"Ничего не нашлось по «{query}»","count-text":{"one":"{n} результат","few":"{n} результата","many":"{n} результатов","other":"{n} результата"},"key-select-label":"выбрать","key-open-label":"открыть","key-clear-label":"очистить","key-close-label":"закрыть"}}');

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