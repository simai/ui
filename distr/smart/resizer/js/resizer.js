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

/***/ "f7b9ec5790a0"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SfResizer: () => (/* binding */ SfResizer)
/* harmony export */ });
/* harmony import */ var _engine_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("bffb4b61998b");
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("43090d1c8307");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _core_js_aliases_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("892a0da25239");
/* harmony import */ var _core_js_preferences_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("51250bf01ab0");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("bed569d628ec");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("20dea37abe64");
/* harmony import */ var _lang_index_mjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("f3c30de36007");
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("d4f7aa048f0e");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2__, _core_js_aliases_js__WEBPACK_IMPORTED_MODULE_3__]);
([_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2__, _core_js_aliases_js__WEBPACK_IMPORTED_MODULE_3__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _core_js_aliases_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_core_js_aliases_js__WEBPACK_IMPORTED_MODULE_3__);
// sf-resizer: a handle on the edge of a panel that changes its width by a
// drag, the keyboard or a double click back to the default (owner,
// 2026-10-14: the admin menu's columns are widened and narrowed by their
// edges). It is a separator in the accessibility sense -- role="separator",
// focusable, its value the width in pixels between min and max -- and it owns
// nothing but the width it writes: on its target (its parent, or the closest
// ancestor matching `target`), as a custom property when `property` names one,
// otherwise as inline-size. With `storage-key` the width is remembered in this
// browser and restored the next time. With `collapsible` the panel folds to
// its edge and comes back (owner decision C158 (2)).







 // Only the words on screen ship in the bundle, English only (owner decision
// C282): Russian and every other language come from a language file. The
// title, settings and events stay in the language files for the Studio and the
// docs (localization study LC-2).

 // The words are lang/<locale>.json, read through the shared reader, so
// SF.language.use() chooses the language and SF.language.register('sf-resizer',
// ...) adds one the Framework has never heard of (ui-mail feedback
// ui-mail.resizer-language, 2026-10-21; standard 1.3.8 §11).
// The handle draws nothing, so it is no Smart renderer: a plain element with
// the instance's scope (standard 1.3.8 §7.7) and its dated aliases (§16.20).

class ResizerHost extends HTMLElement {
  get sfScope() {
    if (!this.__sfScope || this.__sfScope.signal.aborted) this.__sfScope = new AbortController();
    return this.__sfScope.signal;
  }

  connectedCallback() {
    if (this.constructor.aliases && !this.__sfAliases) {
      this.__sfAliases = (0,_core_js_aliases_js__WEBPACK_IMPORTED_MODULE_3__.installAliases)(this, this.constructor.aliases, {
        tag: this.localName,
        signal: this.sfScope
      });
    }
  }

  disconnectedCallback() {
    // Removed and not placed again before the next task: the scope ends.
    setTimeout(() => {
      if (this.isConnected) return;
      this.__sfScope?.abort();
      this.__sfAliases = null;
    }, 0);
  }

} // From its component.json: settings are attributes and properties made by
// core/js/element-manifest.js; sf-resize is a dated alias of sf-resizer-resize.


const ResizerElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_5__, {
  base: ResizerHost,
  lang: _lang_index_mjs__WEBPACK_IMPORTED_MODULE_7__.files,
  source: 'ru',
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_6__
}); // A CSS length (tokens included) in pixels, read in the target's context.

function pixels(value, context) {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(value);
  if (Number.isFinite(number)) return number;
  const probe = document.createElement('span');
  probe.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none;block-size:0;padding:0;border:0';
  probe.style.inlineSize = String(value);
  (context?.isConnected ? context : document.body).append(probe);
  const width = parseFloat(getComputedStyle(probe).width);
  probe.remove();
  return Number.isFinite(width) ? width : null;
} // The width is a view preference (SF.Preferences, owner 2026-10-14): kept in
// this browser, and for the person when the host keeps preferences.


const preferences = () => globalThis.SF?.Preferences || _core_js_preferences_js__WEBPACK_IMPORTED_MODULE_4__["default"];

const preferenceKey = key => `sf-resizer/${String(key).replace(/[^\w.:-]+/gu, '-')}`; // The kept width, and whether the panel was folded (C158 (2)): {v: 1, width,
// folded}; width is the width it comes back to.


function readFolded(key) {
  if (!key) return false;
  return preferences()?.read(preferenceKey(key))?.folded === true;
}

function readStored(key) {
  if (!key) return null;
  const kept = preferences()?.read(preferenceKey(key));
  if (Number.isFinite(kept?.width) && kept.width > 0) return kept.width;
  if (kept) return null; // A width this browser kept before the standard, taken over once.

  try {
    const legacy = Number(globalThis.localStorage?.getItem(`sf-resizer:${key}`)) || null;

    if (legacy) {
      preferences()?.write(preferenceKey(key), {
        v: 1,
        width: legacy
      });
      globalThis.localStorage?.removeItem(`sf-resizer:${key}`);
    }

    return legacy;
  } catch {
    return null;
  }
}

function writeStored(key, value, folded = false) {
  if (!key) return;
  if (value === null && !folded) preferences()?.remove(preferenceKey(key));else if (folded) preferences()?.write(preferenceKey(key), {
    v: 1,
    width: value ? Math.round(value) : 0,
    folded: true
  });else preferences()?.write(preferenceKey(key), {
    v: 1,
    width: Math.round(value)
  });
} // The words of the value (aria-valuetext): «27 %», or folded (C158 (3)).


const valueWords = dictionary => (share, folded, handle) => (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageWord)(dictionary, folded ? 'folded' : 'value', handle, {
  component: 'sf-resizer',
  source: 'ru',
  count: share
}); // The words of an edge without an upper limit, whose value is its width in
// pixels: «244 px», or folded.


const widthWords = dictionary => (width, folded, handle) => (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageWord)(dictionary, folded ? 'folded' : 'width', handle, {
  component: 'sf-resizer',
  source: 'ru',
  count: width
}); // The panel the handle folds is said folded by data-folded (the name the
// study's prototype gives it); the «Показать» button that brings it back
// stands on its edge (data-sf-resizer-unfold), and below the layout's split
// step the handle is not there (data-sf-resizer-narrow, C158 (4)).


const FOLDED = 'data-folded';
const UNFOLD = 'data-sf-resizer-unfold';
const NARROW = 'data-sf-resizer-narrow'; // The layout split step: h0 of the size scale (40rem) of the container, the
// step .sf-workspace stacks its regions at.

const SPLIT_STEP = 'var(--sf-h0)';
let panelIds = 0; // The split a panel stands in, whose width the split step reads (C158 (4)):
// the nearest box around the panel whose width does not come from the panels
// it holds. A box that only wraps them -- display contents, an inline-level
// box, a float, a width of max-content, min-content or fit-content, a flex
// item that does not grow and takes its basis from its content -- is as wide
// as the columns, so the split is the box it stands in, and so on up: an
// admin menu's navigation (max-content, a flex item of the page row) wraps
// its two columns, and the split is the page row beside its main area. A
// container (container-type) is a split of its own. Two columns on a wide
// page keep their handles; a narrow split, or a phone, hides them.

const CONTENT_WIDTH = new Set(['max-content', 'min-content', 'fit-content', '-webkit-fit-content', '-moz-fit-content']);

function keyword(box, property) {
  try {
    const value = box.computedStyleMap?.().get(property);
    return value && 'value' in value && typeof value.value === 'string' ? value.value : null;
  } catch {
    return null;
  }
} // The box a box is laid out in: its parent, past boxes of display contents.


function layoutParent(box) {
  let outer = box.parentElement;

  while (outer && outer !== box.ownerDocument.body && getComputedStyle(outer).display === 'contents') outer = outer.parentElement;

  return outer;
}

function wrapsItsContent(box, style) {
  if (style.display === 'contents' || style.display.startsWith('inline') || style.float !== 'none') return true;
  const width = keyword(box, 'width');
  if (width && CONTENT_WIDTH.has(width)) return true;
  if (style.position === 'absolute' || style.position === 'fixed') return false;
  const outer = layoutParent(box);
  if (!outer) return false;
  const outerStyle = getComputedStyle(outer);
  const flexRow = outerStyle.display.includes('flex') && !outerStyle.flexDirection.includes('column');
  if (!flexRow || Number.parseFloat(style.flexGrow) > 0) return false; // Where the browser says the specified width (Typed OM), a flex item of a
  // length (flex: 0 0 18rem, or inline-size 18rem) is a split of its own;
  // elsewhere a flex item that does not grow is read as its content's width.

  const basis = keyword(box, 'flex-basis');
  if (box.computedStyleMap) return (width === null || width === 'auto') && (basis === 'auto' || basis === 'content');
  return true;
}

function splitPlace(target) {
  const body = target.ownerDocument.body;
  let place = target.parentElement;

  while (place && place !== body && place.parentElement) {
    const style = getComputedStyle(place);
    if (style.containerType && style.containerType !== 'normal') break;
    if (!wrapsItsContent(place, style)) break;
    place = place.parentElement;
  }

  return place ?? target.parentElement;
} // The handle placed outside a target that clips: absolute (against an
// ancestor) or fixed (against the viewport); the measured place it is given.


const OUTSIDE = 'data-sf-resizer-outside';
const PLACE = ['--sf-resizer--x', '--sf-resizer--y', '--sf-resizer--h']; // The overflow values that clip (all but the initial one); named so, the
// template-utility reader takes no class from an overflow value.

const CLIPPING = new Set(['hidden', 'clip', 'auto', 'scroll']); // The widest the target may be and leave the content beside it at least
// `reserve` (min) wide: the target's width plus the widest such sibling's,
// less the reserve. The content beside is an in-flow sibling on the same row
// that gives way when the target widens -- in a flex row one that may shrink
// or grow; a column of fixed width (the admin menu's second column, flex
// 0 0 auto) is another panel, not content. Infinity when nothing stands beside
// it (a stacked layout, an absolute drawer, panels only).

function roomBeside(target, reserve) {
  const parent = target.parentElement;
  if (!parent) return Infinity;
  const own = getComputedStyle(target).position;
  if (own === 'absolute' || own === 'fixed') return Infinity;
  const box = target.getBoundingClientRect();
  if (!box.width && !box.height) return Infinity;
  const flex = getComputedStyle(parent).display.includes('flex');
  let widest = -1;

  for (const sibling of parent.children) {
    if (sibling === target) continue;
    const style = getComputedStyle(sibling);
    if (style.display === 'none' || style.display === 'contents' || style.position === 'absolute' || style.position === 'fixed') continue;
    if (flex && !(Number.parseFloat(style.flexShrink) > 0 || Number.parseFloat(style.flexGrow) > 0)) continue;
    const other = sibling.getBoundingClientRect();
    if (!other.width || !other.height) continue;
    if (other.top >= box.bottom || other.bottom <= box.top) continue;
    widest = Math.max(widest, other.width);
  }

  return widest < 0 ? Infinity : box.width + widest - reserve;
}

class SfResizer extends ResizerElement {
  static get observedAttributes() {
    return ['min', 'max', 'label', 'disabled', 'value', 'collapsible'];
  }

  constructor() {
    super();

    this._onWindowResize = () => this.schedule(); // An element that scrolls and holds the target moves the target's edge;
    // a handle placed outside the target's clip follows it.


    this._onScroll = event => {
      if (!this.hasAttribute(OUTSIDE)) return;
      const target = this.target();
      if (event.target !== target && (event.target === document || event.target?.contains?.(target))) this.schedule();
    };
  }

  connectedCallback() {
    super.connectedCallback(); // The handle is a Tab stop of its own making; a disabled one is none
    // (syncLabel), and a tabindex the page wrote stays the page's.

    if (!this.hasAttribute('tabindex')) {
      this.tabIndex = 0;
      this._ownTabIndex = true;
    }

    this.syncLabel(); // The gesture is the shared one (attachResizer): the element only says
    // what the width is the width of and where it is kept.

    this._detach = (0,_engine_mjs__WEBPACK_IMPORTED_MODULE_0__.attachResizer)(this, {
      session: () => this.disabled || this._narrow ? null : this.session(),
      text: valueWords(ResizerElement.sfWords),
      widthText: widthWords(ResizerElement.sfWords)
    });
    globalThis.addEventListener('resize', this._onWindowResize);
    document.addEventListener?.('scroll', this._onScroll, {
      capture: true,
      passive: true
    }); // A language announced after the handle drew itself -- SF.language.use(),
    // or a word registered for it -- renames it where it stands. A Lit
    // component gets this from smart-base; this one is an ordinary element, so
    // it listens for itself, as the anchored badges do.

    this._languageOff = _core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.language.onChange(() => {
      if (this.isConnected) this.syncLabel();
    }); // A width the host keeps for the person (value) wins over this
    // browser's memory of it. It is written now, while the element connects,
    // so the frame that first draws the handle draws the panel at that width:
    // written a frame later, the remembered 288 landed ~52 ms after a first
    // paint of 256 (study RS-8, 2026-11-14). Reading a limit forces the
    // layout it needs, so a percentage limit is still read against a real
    // width.
    // A host's value of 0 is a folded panel (C158 (3): 0 is folded); so is
    // a fold this browser kept.

    const value = this.getAttribute('value');
    this._wanted = Number(value) || readStored(this.storageKey) || null;
    this._folded = this.collapsible && (value === '0' || value === null && readFolded(this.storageKey));
    this._restore = this._wanted; // A panel that folds shows the «Показать» button on its edge: its code is
    // asked for when a pointer or the keyboard reaches the handle, before it
    // can fold, so the button draws whole the first time; a page that never
    // folds a panel never loads it.

    const warm = () => this.warmUnfold();

    this.addEventListener('pointerenter', warm, {
      once: true,
      signal: this.sfScope
    });
    this.addEventListener('focusin', warm, {
      once: true,
      signal: this.sfScope
    });

    if (this.target()) {
      this.control();
      this.layout();
      this.syncValue();
    } // The panel and its container may still be growing (a parser that has
    // not reached the content beside it, a sheet on its way): the layout is
    // read again when they change size, and once more in the next frame.


    if (globalThis.ResizeObserver) {
      this._observer = new ResizeObserver(() => this.schedule());
      const target = this.target();
      if (target) this._observer.observe(target);
      if (target?.parentElement) this._observer.observe(target.parentElement); // The split, read by the first layout, when it is not the parent.

      if (this._place && this._place !== target?.parentElement) this._observer.observe(this._place);
    }

    this.schedule();
  } // One layout pass per frame, whatever asked for it.


  schedule() {
    if (this._scheduled) return;
    this._scheduled = true;
    requestAnimationFrame(() => {
      this._scheduled = false;
      if (this.isConnected) this.layout();
    });
  } // The width within its limits (fit), then the handle on the target's edge
  // (place).


  layout() {
    this.narrowCheck();
    if (!this._dragging) this.fit();
    this.showFold();
    this.place();
  }

  warmUnfold() {
    if (this.collapsible) globalThis.SF?.Loader?.ensure?.(['sf-button-icon']);
  } // The panel the handle controls (aria-controls, C158 (3)): by its id; a
  // panel without one is named by element reference where the browser has
  // it (ariaControlsElements), so the page's markup gets no made-up id, and
  // is given an id where it does not.


  control() {
    const target = this.target();
    if (!target) return;

    if (target.id) {
      this.setAttribute('aria-controls', target.id);
      return;
    }

    if ('ariaControlsElements' in this) {
      this.removeAttribute('aria-controls');
      this.ariaControlsElements = [target];
      return;
    }

    target.id = `sf-resizer-panel-${++panelIds}`;
    this.setAttribute('aria-controls', target.id);
  } // Below the layout's split step (40rem of the container, C158 (4)) the
  // handle is not there: the layout shows one panel at a time, and the width
  // the person chose waits for a wide screen. A region of .sf-workspace says
  // its layout itself (--sf-workspace--layout); any other panel is measured
  // against the width of its split (splitPlace): the box the panel and its
  // neighbours share, past wrappers as wide as the panels.


  narrowCheck() {
    const target = this.target();
    let narrow = false;

    if (target?.parentElement) {
      const parent = target.parentElement;
      const layout = parent.classList.contains('sf-workspace') ? getComputedStyle(target).getPropertyValue('--sf-workspace--layout').trim() : '';
      if (layout) narrow = layout === 'narrow';else {
        const place = splitPlace(target);

        if (place !== this._place) {
          if (this._place && this._place !== parent) this._observer?.unobserve(this._place);
          this._place = place;
          if (place !== parent) this._observer?.observe(place);
        }

        const width = place.getBoundingClientRect().width;
        const step = pixels(SPLIT_STEP, place) ?? 0;
        narrow = width > 0 && width < step;
      }
    }

    if (narrow === Boolean(this._narrow)) return;
    this._narrow = narrow;
    this.toggleAttribute(NARROW, narrow);
  } // A folded panel: data-folded on it, its width written 0, the «Показать»
  // button on its edge. Below the split step the panel shows as the layout
  // places it (folding is a wide screen's), and folds again when it widens.


  showFold() {
    const target = this.target();
    if (!target) return;
    const folded = Boolean(this._folded && this.collapsible && !this._narrow);

    if (folded) {
      this.warmUnfold();
      this.unfoldButton();
      target.setAttribute(FOLDED, '');
      if (this.property) target.style.setProperty(this.property, '0px');else target.style.inlineSize = '0px';
    } else if (target.hasAttribute(FOLDED)) {
      target.removeAttribute(FOLDED);
      this.unwrite(target);
      if (this._wanted) this.apply(this._wanted);
    }
  } // The «Показать» button on the folded panel's edge (C158 (2)), made the
  // first time the panel folds: an sf-button-icon in a holder of its own in
  // the panel (the holder stays where the button may redraw itself), shown
  // only while the panel is folded. The glyph shows the side the panel opens
  // from.


  unfoldButton() {
    const target = this.target();
    if (!target) return null;
    let holder = this._unfold;

    if (!holder || holder.parentElement !== target) {
      holder?.remove();
      holder = document.createElement('span');
      holder.setAttribute(UNFOLD, '');
      holder.addEventListener('click', event => {
        if (!event.target?.closest?.('button, sf-button-icon')) return;
        event.stopPropagation();
        this.fold(false, 'end');
        this.focus({
          preventScroll: true
        });
      });
      target.append(holder);
      this._unfold = holder;
    }

    const rtl = getComputedStyle(this).direction === 'rtl';
    const startEdge = this.getAttribute('edge') === 'inline-start'; // A panel whose edge is on its right stands on the left of the page.

    const icon = rtl === startEdge ? 'left_panel_open' : 'right_panel_open';
    const word = this.sfWord('show');
    const key = `${icon} ${word}`;

    if (holder.__sfKey !== key) {
      holder.__sfKey = key;
      const button = document.createElement('sf-button-icon');
      button.setAttribute('size', '1/2');
      button.setAttribute('appearance', 'ghost');
      button.setAttribute('scheme', 'on-surface');
      button.setAttribute('icon', icon);
      button.setAttribute('aria-label', word);
      button.setAttribute('title', word);
      holder.replaceChildren(button);
    }

    return holder;
  } // Folds the panel to its edge (on) or gives back the width it had (off).
  // phase move: during a drag, said as move and not kept; end: kept and said.


  fold(on, phase = 'end') {
    if (!this.collapsible || this.disabled) return;
    const target = this.target();
    if (!target) return;

    if (on && !this._folded) {
      // A drag that folds gives back the width it started from, not the min
      // it passed on the way.
      const {
        min
      } = this.limits();
      const width = Math.max(min, Math.round(phase === 'move' && this._dragFrom ? this._dragFrom : this.width()) || 0);
      this._restore = width;
      this._folded = true;
      this.showFold();
      this.syncValue(0);
      this.announce(0, phase === 'move' ? 'move' : 'end');
    } else if (!on && this._folded) {
      this._folded = false;
      const back = this._restore || this._wanted;
      target.removeAttribute(FOLDED);
      if (back) this.apply(back);else this.unwrite(target);
      const width = Math.round(this.width());
      this.syncValue(width);
      this.announce(width, phase === 'move' ? 'move' : 'end');

      if (phase !== 'move') {
        this._wanted = back || null;
        if (back) writeStored(this.storageKey, back);else writeStored(this.storageKey, null);
      }

      return;
    } else if (on && phase !== 'move') this.announce(0, 'end');

    if (on && phase !== 'move') writeStored(this.storageKey, this._restore, true);
  }

  folded() {
    return Boolean(this._folded && this.collapsible && !this._narrow);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._detach?.();
    this._detach = null;
    this._languageOff?.();
    this._languageOff = null;
    this._observer?.disconnect();
    this._observer = null;
    this._place = null;
    globalThis.removeEventListener('resize', this._onWindowResize);
    document.removeEventListener?.('scroll', this._onScroll, {
      capture: true
    });
  }

  attributeChangedCallback(name, before, after) {
    if (name === 'value' && after === '0' && after !== before && this.isConnected && this.collapsible) {
      this.fold(true, 'move');
      return;
    }

    if (name === 'value' && after && after !== before && this.isConnected) {
      if (this._folded) {
        this._folded = false;
        this.target()?.removeAttribute(FOLDED);
      }

      this.restore(after);
      return;
    }

    if (name === 'collapsible' && this.isConnected) {
      this.schedule();
      return;
    }

    if (this.isConnected) {
      this.syncLabel();
      this.syncValue(); // New limits fit the width again.

      if (name === 'min' || name === 'max') this.schedule();
    }
  }

  get step() {
    return Math.max(1, Number(this.getAttribute('step')) || 16);
  }

  set step(value) {
    if (value === null || value === undefined || value === '') this.removeAttribute('step');else this.setAttribute('step', String(value));
  } // The panel it resizes: its parent, or the closest ancestor matching the
  // setting target. The method keeps the property name it has had since 1.0.0.


  target() {
    const selector = this.getAttribute('target');
    return (selector ? this.parentElement?.closest(selector) : this.parentElement) ?? null;
  } // min and max as the page wrote them, in pixels; max also stops where the
  // content beside the panel would be left narrower than min (room), so the
  // handle never takes the content's width: on a 390 phone a 14rem menu left
  // its text 116 px (study RS-9, 2026-11-14).


  limits() {
    const target = this.target();
    const context = target?.parentElement ?? document.body;
    const min = pixels(this.getAttribute('min') || '12rem', context) ?? 0;
    const max = pixels(this.getAttribute('max') || '40rem', context) ?? Infinity;
    const room = target ? roomBeside(target, min) : Infinity;
    return {
      min,
      max: Math.max(min, Math.min(max, room)),
      room
    };
  }

  width() {
    return this.target()?.getBoundingClientRect().width ?? 0;
  }

  session() {
    const fold = this.collapsible ? {
      fold: (on, phase) => this.fold(on, phase),
      folded: () => this.folded()
    } : {};
    return { ...fold,
      measure: () => this.width(),
      limits: () => this.limits(),
      apply: (width, phase) => {
        const written = this.apply(width);
        if (phase === 'move' && written !== null) this.announce(written, 'move');
        return written;
      },
      commit: width => this.commit(width),
      reset: () => this.reset(),
      // A drag owns the width while it lasts: a layout pass does not fit it.
      start: () => {
        this._dragging = true;
        this._dragFrom = this.folded() ? 0 : Math.round(this.width());
      },
      end: () => {
        this._dragging = false;
        this.schedule();
      },
      // A handle on the inline end widens the panel rightwards in a
      // left-to-right page; on the start, leftwards.
      direction: () => {
        const rtl = getComputedStyle(this).direction === 'rtl';
        return (rtl ? -1 : 1) * (this.getAttribute('edge') === 'inline-start' ? -1 : 1);
      },
      step: this.step
    };
  }

  apply(value) {
    const target = this.target();
    if (!target) return null;
    const {
      min,
      max
    } = this.limits();
    const width = Math.round(Math.min(max, Math.max(min, value)));
    if (this.property) target.style.setProperty(this.property, `${width}px`);else target.style.inlineSize = `${width}px`;
    this.syncValue(width);
    return width;
  } // resize {width, phase} (§8 own verb); sf-resize follows with the same detail.


  announce(width, phase) {
    this.sfEmit('resize', {
      width,
      phase
    });
  }

  commit(width) {
    this._wanted = width;
    this._fitted = false;
    this._pageWidth = '';
    writeStored(this.storageKey, width);
    this.announce(width, 'end');
  } // Back to the width the page's stylesheet gives, and forgotten.


  reset() {
    if (this.disabled) return;
    const target = this.target();
    if (!target) return; // The default width is an open panel.

    this._folded = false;
    this._restore = null;
    target.removeAttribute(FOLDED);
    this._wanted = null;
    this._fitted = false;
    this._pageWidth = '';
    this.unwrite(target);
    writeStored(this.storageKey, null);
    requestAnimationFrame(() => {
      this.layout();
      const width = Math.round(this.width());
      this.syncValue(width);
      this.announce(width, 'reset');
    });
  } // A width the host keeps (a person's settings): written as if dragged,
  // within the limits, and remembered as the browser's too.


  restore(width) {
    const number = Number(width);
    if (!Number.isFinite(number) || number <= 0) return null;
    this._wanted = number;
    this._fitted = false;
    this._pageWidth = '';
    const written = this.apply(number);
    if (written !== null) writeStored(this.storageKey, written);
    return written;
  }

  unwrite(target = this.target()) {
    if (!target) return;
    if (this.property) target.style.removeProperty(this.property);else target.style.removeProperty('inline-size');
  }

  written(target = this.target()) {
    if (!target) return '';
    return this.property ? target.style.getPropertyValue(this.property).trim() : target.style.inlineSize;
  } // The width within the limits as they are now. The width the person or the
  // host wants is written again, clamped: a narrowed window takes it in, a
  // widened one gives it back. Without one, the stylesheet's width stands
  // unless the content beside it would be left narrower than min; then the
  // panel is narrowed for as long as that lasts, and nothing is remembered.


  fit() {
    const target = this.target();
    if (!target) return;
    if (this.folded()) return;

    if (this._wanted) {
      this.apply(this._wanted);
      return;
    } // A narrowing of our own is undone first: what the page wrote, or
    // nothing, is the width the limits are measured against again.


    if (this._fitted) {
      if (this._pageWidth) {
        if (this.property) target.style.setProperty(this.property, this._pageWidth);else target.style.inlineSize = this._pageWidth;
      } else this.unwrite(target);

      this._fitted = false;
      this._pageWidth = '';
    }

    const written = this.written(target);
    const {
      min,
      max,
      room
    } = this.limits();

    if (written) {
      // A width the page wrote itself (a length, tokens included): the value
      // written is what is clamped, not the panel as measured: in a stacked
      // layout the panel is the window's width whatever is written, and
      // clamping that measurement wrote the maximum over the remembered width
      // (docs trial 4, 2026-10-15). Read in pixels: 16rem is 256, not 16.
      const value = pixels(written, target.parentElement);
      if (value === null || value <= max + 0.5 && value >= min - 0.5) return;
      this._pageWidth = written;
      this.apply(value);
      this._fitted = true;
      return;
    }

    if (room < Infinity && this.width() > Math.max(min, room) + 0.5) {
      this.apply(room);
      this._fitted = true;
    }
  } // The handle on the target's edge. A target that clips its overflow (an
  // .sf-workspace region scrolls, so does many a panel) cut a handle placed
  // inside it in half: 4 of its 8 px caught, and the panel gained a sideways
  // scroll (study RS-2, 2026-11-14). Such a handle stands outside the clip:
  // positioned against an ancestor of the target (the target is not made
  // relative), or against the viewport when the page positioned the target
  // itself, at the target's measured edge. The look is the same.


  place() {
    const target = this.target();
    if (!target) return;
    const style = getComputedStyle(target);
    const clips = CLIPPING.has(style.overflowX) || CLIPPING.has(style.overflowY);

    if (!clips) {
      if (this.hasAttribute(OUTSIDE)) {
        this.removeAttribute(OUTSIDE);

        for (const name of PLACE) this.style.removeProperty(name);
      }

      if (style.position === 'static') {
        target.style.position = 'relative';
        this._madeRelative = true;
      }

      return;
    }

    if (this._madeRelative) {
      target.style.removeProperty('position');
      this._madeRelative = false;
    }

    const mode = getComputedStyle(target).position === 'static' ? 'absolute' : 'fixed';
    if (this.getAttribute(OUTSIDE) !== mode) this.setAttribute(OUTSIDE, mode);
    const box = target.getBoundingClientRect();
    const own = this.getBoundingClientRect();
    const placed = getComputedStyle(this); // Where left: 0 / top: 0 stand: the containing block, wherever it is.

    const originX = own.left - (Number.parseFloat(placed.left) || 0);
    const originY = own.top - (Number.parseFloat(placed.top) || 0);
    const rtl = placed.direction === 'rtl';
    const startEdge = this.getAttribute('edge') === 'inline-start';
    const edge = rtl === startEdge ? box.right : box.left;
    this.style.setProperty('--sf-resizer--x', `${Math.round((edge - originX - own.width / 2) * 100) / 100}px`);
    this.style.setProperty('--sf-resizer--y', `${Math.round((box.top - originY) * 100) / 100}px`);
    this.style.setProperty('--sf-resizer--h', `${Math.round(box.height * 100) / 100}px`);
  }

  syncLabel() {
    const label = this.sfWord('label');
    const hint = this.sfWord('hint');

    if (!this.getAttribute('aria-label') || this._ownLabel) {
      this.setAttribute('aria-label', this.getAttribute('label') || label);
      this._ownLabel = true;
    }

    this.title = this.getAttribute('label') ? `${this.getAttribute('label')}. ${hint}` : hint; // A disabled handle says so and leaves the Tab order: it kept tabindex=0
    // and was a stop that did nothing (study RS-6, 2026-11-14). A tabindex
    // the page wrote is put back when the handle is enabled again.

    if (this._unfold) this.unfoldButton();

    if (this.disabled) {
      this.setAttribute('aria-disabled', 'true');
      if (this._ownTabIndex) this.removeAttribute('tabindex');else if (this.hasAttribute('tabindex') && this._pageTabIndex === undefined) {
        this._pageTabIndex = this.getAttribute('tabindex');
        this.setAttribute('tabindex', '-1');
      }
    } else {
      this.removeAttribute('aria-disabled');

      if (this._pageTabIndex !== undefined) {
        this.setAttribute('tabindex', this._pageTabIndex);
        this._pageTabIndex = undefined;
      } else if (this._ownTabIndex && !this.hasAttribute('tabindex')) this.tabIndex = 0;
    }
  }

  syncValue(width = this.width()) {
    (0,_engine_mjs__WEBPACK_IMPORTED_MODULE_0__.setResizerValue)(this, {
      limits: () => this.limits(),
      measure: () => width,
      folded: () => this.folded()
    }, width, valueWords(ResizerElement.sfWords), widthWords(ResizerElement.sfWords));
  }

}
if (!customElements.get('sf-resizer')) customElements.define('sf-resizer', SfResizer);
globalThis.SF = globalThis.SF || {}; // attach: the same gesture on any handle -- a table's column edges use it.
// Their value says its words in the page's language, as the handle's does,
// unless the caller gives its own text().

const attach = (root, options = {}) => (0,_engine_mjs__WEBPACK_IMPORTED_MODULE_0__.attachResizer)(root, {
  text: valueWords(ResizerElement.sfWords),
  widthText: widthWords(ResizerElement.sfWords),
  ...options
});

globalThis.SF.Resizer = Object.freeze({
  SfResizer,
  attach,
  attachResizer: attach
});
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "d4f7aa048f0e"
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

/***/ "bffb4b61998b"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   attachResizer: () => (/* binding */ attachResizer),
/* harmony export */   setResizerValue: () => (/* binding */ setValue)
/* harmony export */ });
// The width a person changes by an edge, as one behaviour: a drag, the arrow
// keys (Shift: four steps; Home and End: the limits; PageUp and PageDown: four
// steps), a double click back to the default, a separator's role and value
// (the share of the way from min to max, 0-100, and its words), the resize
// cursor over the whole page while it lasts. An edge that folds (C158 (2))
// folds when dragged past min by half of min, and Enter folds it and gives
// the width back; an edge that does not fold takes Enter back to the
// default. Space does nothing (APG window splitter). What
// the width is the width of -- a panel, a table's column -- and where it is
// kept is the caller's (owner, 2026-10-14: the admin menu's columns and a
// table's columns are the same gesture).
//
// attach(root, options) -> detach()
//   options.handles   a selector: the handles are root's descendants matching
//                     it, found when used (a table redraws its headers);
//                     without it, root is the one handle.
//   options.session(handle) -> {
//     measure(): the width now, in pixels
//     limits(): {min, max} in pixels
//     apply(width, phase): writes it, returns the width written
//     commit(width): the width a drag or a key ended at
//     reset(): back to the default (a double click; Enter on an edge that
//              does not fold)
//     fold(on, phase), folded(): an edge that folds (sf-resizer collapsible):
//              fold(true|false, 'move'|'end') folds or gives the width back,
//              folded() says which it is
//     direction(): +1 when a pointer (or ArrowRight) moving right widens,
//                  -1 otherwise; it holds the writing direction and the edge
//     step: pixels an arrow moves (default 16)
//     start(), end(): around a drag
//   } -- or null, when this handle does not resize now.
//   options.text(share, folded, handle): the words of the value
//                     (aria-valuetext), «27 %»; without it, none.
//   options.widthText(width, folded, handle): the words of an edge without
//                     an upper limit (max not finite), whose value is its
//                     width in pixels, «244 px»; without it, none. text is
//                     never asked for such an edge: its share would be a
//                     width, said as a percentage.
//
// Edges another component draws (options.handles) leave Enter and Escape to
// it: a table's column edge goes back to its header on either (C158 (5)).
const ACTIVE = 'data-sf-resizer-active';

// The value a screen reader hears is the share of the way from min to max,
// 0-100, as in the APG window splitter: 0 is the narrowest, or folded. It was
// the width in pixels, «256» (study RS-6, owner decision C158 (3)).
function share(session, width) {
  if (session.folded?.()) return 0;
  const {min, max} = session.limits();
  if (!(max > min)) return width >= max ? 100 : 0;
  return Math.round(Math.min(100, Math.max(0, ((width - min) / (max - min)) * 100)));
}

// An edge without an upper limit (max Infinity, or not a number: a column
// with no maxWidth) has no way from min to max: its share was always 0
// (ui-view, 2026-11-17). Its value is then the width in pixels from min, and
// aria-valuemax is left out, as WAI-ARIA allows when the maximum is unknown;
// its words are widthText's («244 px»), never the share's «%».
function setValue(handle, session, width = session.measure(), text = null, widthText = null) {
  const {min, max} = session.limits();
  const folded = Boolean(session.folded?.());
  if (!Number.isFinite(max)) {
    const floor = Number.isFinite(min) ? Math.max(0, Math.round(min)) : 0;
    const now = folded ? 0 : Math.max(floor, Math.round(Number(width) || 0));
    handle.setAttribute('aria-valuemin', String(folded ? 0 : floor));
    handle.removeAttribute('aria-valuemax');
    handle.setAttribute('aria-valuenow', String(now));
    const words = widthText?.(now, folded, handle);
    if (words) handle.setAttribute('aria-valuetext', words);
    else handle.removeAttribute('aria-valuetext');
    return;
  }
  const now = share(session, width);
  handle.setAttribute('aria-valuemin', '0');
  handle.setAttribute('aria-valuemax', '100');
  handle.setAttribute('aria-valuenow', String(now));
  const words = text?.(now, folded, handle);
  if (words) handle.setAttribute('aria-valuetext', words);
  else handle.removeAttribute('aria-valuetext');
}

function clamp(session, width) {
  const {min, max} = session.limits();
  return Math.round(Math.min(Math.max(min, max), Math.max(min, width)));
}

function attachResizer(root, options = {}) {
  const handleOf = (target) => (options.handles ? target?.closest?.(options.handles) : root);
  const owns = (handle) => handle && (handle === root || root.contains(handle));
  const sessionOf = (handle) => (owns(handle) ? options.session?.(handle) ?? null : null);
  const text = options.text ?? null;
  const widthText = options.widthText ?? null;
  const say = (handle, session, width) => setValue(handle, session, width, text, widthText);
  let drag = null;

  const finish = (commit) => {
    const current = drag;
    if (!current) return;
    drag = null;
    globalThis.removeEventListener('pointermove', current.move, true);
    globalThis.removeEventListener('pointerup', current.up, true);
    globalThis.removeEventListener('pointercancel', current.up, true);
    document.documentElement.removeAttribute(ACTIVE);
    delete current.handle.dataset.sfResizing;
    current.session.end?.();
    if (!commit) return;
    const folded = Boolean(current.session.folded?.());
    if (folded) {
      if (!current.wasFolded) current.session.fold(true, 'end');
    } else if (current.wasFolded || current.width !== Math.round(current.from)) current.session.commit?.(current.width);
  };

  const onPointerDown = (event) => {
    if (event.button > 0 || drag) return;
    const handle = handleOf(event.target);
    const session = sessionOf(handle);
    if (!session) return;
    event.preventDefault();
    event.stopPropagation();
    handle.focus?.({preventScroll: true});
    const foldable = typeof session.fold === 'function';
    const wasFolded = Boolean(session.folded?.());
    const from = wasFolded ? 0 : session.measure();
    const current = {handle, session, pointer: event.pointerId, x: event.clientX, from, width: Math.round(from), wasFolded};
    current.move = (next) => {
      if (next.pointerId !== current.pointer) return;
      const wanted = current.from + (next.clientX - current.x) * (session.direction?.() ?? 1);
      // Past min by half of min the edge folds; back over that line it
      // opens again at the width the pointer asks for (C158 (2)).
      if (foldable) {
        const {min} = session.limits();
        if (wanted < min / 2) {
          if (!session.folded()) {
            session.fold(true, 'move');
            current.width = 0;
            say(handle, session, 0);
          }
          return;
        }
        if (session.folded()) session.fold(false, 'move');
      }
      const width = clamp(session, wanted);
      if (width === current.width) return;
      current.width = session.apply(width, 'move') ?? width;
      say(handle, session, current.width);
    };
    current.up = (next) => {
      if (next.pointerId === current.pointer) finish(true);
    };
    drag = current;
    session.start?.();
    handle.dataset.sfResizing = '';
    document.documentElement.setAttribute(ACTIVE, '');
    globalThis.addEventListener('pointermove', current.move, true);
    globalThis.addEventListener('pointerup', current.up, true);
    globalThis.addEventListener('pointercancel', current.up, true);
  };

  const onKeyDown = (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const handle = handleOf(event.target);
    if (handle !== event.target) return;
    const session = sessionOf(handle);
    if (!session) return;
    // Space does nothing (C158 (2)): it restored the default, which the APG
    // window splitter gives to no key; it does not scroll the page either.
    if (event.key === ' ') {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    if (event.key === 'Enter' || event.key === 'Escape') {
      // An edge another component draws: its own (a column edge goes back to
      // its header).
      if (options.handles || event.key === 'Escape') return;
      event.preventDefault();
      event.stopPropagation();
      // Enter folds an edge that folds and gives the width back; one that
      // does not goes back to the default.
      if (typeof session.fold === 'function') {
        session.fold(!session.folded(), 'end');
        say(handle, session);
      } else session.reset?.();
      return;
    }
    const {min, max} = session.limits();
    const folded = Boolean(session.folded?.());
    const now = folded ? 0 : session.measure();
    // ArrowRight moves the edge to the right and ArrowLeft to the left, as a
    // pointer does: direction() already holds the writing direction and the
    // edge, so it is applied once. Flipped again for RTL here, the arrows of
    // an RTL page ran against the edge (study RS-5, 2026-11-14).
    const right = session.direction?.() ?? 1;
    const step = (session.step ?? 16) * (event.shiftKey ? 4 : 1);
    let next = null;
    if (event.key === 'ArrowRight') next = now + step * right;
    else if (event.key === 'ArrowLeft') next = now - step * right;
    else if (event.key === 'PageUp') next = now + step * 4;
    else if (event.key === 'PageDown') next = now - step * 4;
    else if (event.key === 'Home') next = min;
    // End on an edge without an upper limit has nowhere to go: it would
    // write an infinite width. It is left to the page.
    else if (event.key === 'End') next = Number.isFinite(max) ? max : null;
    if (next === null) return;
    event.preventDefault();
    event.stopPropagation();
    // A key on a folded edge that widens opens it, at the width the key asks
    // for (an arrow: min); one that narrows leaves it folded.
    if (folded && next <= 0) return;
    if (folded) session.fold(false, 'move');
    const width = session.apply(clamp(session, next), 'end') ?? clamp(session, next);
    say(handle, session, width);
    session.commit?.(width);
  };

  const onDoubleClick = (event) => {
    const handle = handleOf(event.target);
    const session = sessionOf(handle);
    if (!session) return;
    event.preventDefault();
    event.stopPropagation();
    session.reset?.();
  };

  // The value is read when the handle is reached, so a redrawn handle says it.
  const onFocusIn = (event) => {
    const handle = handleOf(event.target);
    const session = sessionOf(handle);
    if (session) say(handle, session);
  };

  root.addEventListener('pointerdown', onPointerDown);
  root.addEventListener('keydown', onKeyDown);
  root.addEventListener('dblclick', onDoubleClick);
  root.addEventListener('focusin', onFocusIn);
  if (!options.handles) {
    root.setAttribute('role', 'separator');
    root.setAttribute('aria-orientation', 'vertical');
  }
  return () => {
    finish(false);
    root.removeEventListener('pointerdown', onPointerDown);
    root.removeEventListener('keydown', onKeyDown);
    root.removeEventListener('dblclick', onDoubleClick);
    root.removeEventListener('focusin', onFocusIn);
  };
}




/***/ },

/***/ "f3c30de36007"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   files: () => (/* binding */ files)
/* harmony export */ });
/* harmony import */ var _en_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("4012ebee0398");
// Written by scripts/build-language-packs.mjs from src/core/lang/built-in.json
// (owner decision C282); do not edit. The words this bundle carries: the
// built-in languages' (en); every other language comes from
// a language file (core/lang/<code>.js or its parts).


const files = { en: { runtime: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime } };

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ en: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime });


/***/ },

/***/ "20dea37abe64"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-resizer for the shim (core/js/aliases.js, standard §16 item 20). mode: same-detail (the shim sends the new and the old name), detail-adds (the new detail holds the old fields), attribute-and-property, host-attribute (no shim), manifest-only (the DOM name does not change), retired (no new name; kept and noted by the component until the date).","component":"sf-resizer","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"sf-resize","to":"sf-resizer-resize","kind":"event","component":"sf-resizer","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","section":"§8, vocabulary §7","note":"the old name follows with the same detail {width, phase}"}]}');

/***/ },

/***/ "bed569d628ec"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.resizer","tag":"sf-resizer","version":"1.5.1","kind":"leaf","settings":{"min":{"type":"string","default":"12rem"},"max":{"type":"string","default":"40rem"},"property":{"type":"string","default":""},"target":{"type":"string","default":""},"edge":{"type":"enum","values":["inline-end","inline-start"],"default":"inline-end"},"step":{"type":"number","default":16,"min":1},"storage-key":{"type":"string","default":""},"label":{"type":"string","default-from":"runtime.label"},"disabled":{"type":"boolean","default":false},"collapsible":{"type":"boolean","default":false},"value":{"type":"number","nullable":true,"default":null}},"values":{},"events":{"resize":{"carries":{"width":"number","phase":{"type":"enum","values":["move","end","reset"]}},"own-verb":true}},"actions":{},"css-variables":{"--sf-resizer-hit-size":{"type":"length","state":"default"},"--sf-resizer-line-width":{"type":"length","state":"default"},"--sf-resizer-line-color":{"type":"color","state":"default"},"--sf-resizer-hover-line-color":{"type":"color","state":"hover"},"--sf-resizer-z-index":{"type":"integer","state":"default"}}}');

/***/ },

/***/ "4012ebee0398"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Resizer","runtime":{"hint":"Drag, or use the arrow keys; a double click restores the width.","label":"Resize","value":"{n}%","width":"{n} px","folded":"Collapsed","show":"Show"},"events":{"resize":{"label":"Change the width"}}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("f7b9ec5790a0");
/******/
/******/ })()
;