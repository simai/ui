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
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("4012ebee0398");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("d865d3c42424");
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("d4f7aa048f0e");
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
// browser and restored the next time.









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
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_7__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_8__
  },
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

const preferenceKey = key => `sf-resizer/${String(key).replace(/[^\w.:-]+/gu, '-')}`;

function readStored(key) {
  if (!key) return null;
  const kept = preferences()?.read(preferenceKey(key));
  if (Number.isFinite(kept?.width)) return kept.width; // A width this browser kept before the standard, taken over once.

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

function writeStored(key, value) {
  if (!key) return;
  if (value === null) preferences()?.remove(preferenceKey(key));else preferences()?.write(preferenceKey(key), {
    v: 1,
    width: Math.round(value)
  });
}

class SfResizer extends ResizerElement {
  static get observedAttributes() {
    return ['min', 'max', 'label', 'disabled', 'value'];
  }

  constructor() {
    super();

    this._onWindowResize = () => this.clampToLimits();
  }

  connectedCallback() {
    super.connectedCallback();
    if (!this.hasAttribute('tabindex')) this.tabIndex = 0;
    this.syncLabel(); // The gesture is the shared one (attachResizer): the element only says
    // what the width is the width of and where it is kept.

    this._detach = (0,_engine_mjs__WEBPACK_IMPORTED_MODULE_0__.attachResizer)(this, {
      session: () => this.disabled ? null : this.session()
    });
    globalThis.addEventListener('resize', this._onWindowResize); // A language announced after the handle drew itself -- SF.language.use(),
    // or a word registered for it -- renames it where it stands. A Lit
    // component gets this from smart-base; this one is an ordinary element, so
    // it listens for itself, as the anchored badges do.

    this._languageOff = _core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.language.onChange(() => {
      if (this.isConnected) this.syncLabel();
    }); // Restored after the target has laid out, so a percentage limit is read
    // against a real width.

    requestAnimationFrame(() => {
      if (!this.isConnected) return;
      const target = this.target();
      if (target && getComputedStyle(target).position === 'static') target.style.position = 'relative'; // A width the host keeps for the person (value) wins over this
      // browser's memory of it.

      const kept = Number(this.getAttribute('value')) || readStored(this.storageKey);
      if (kept) this.apply(kept);
      this.syncValue();
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._detach?.();
    this._detach = null;
    this._languageOff?.();
    this._languageOff = null;
    globalThis.removeEventListener('resize', this._onWindowResize);
  }

  attributeChangedCallback(name, before, after) {
    if (name === 'value' && after && after !== before && this.isConnected) {
      this.restore(after);
      return;
    }

    if (this.isConnected) {
      this.syncLabel();
      this.syncValue();
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
  }

  limits() {
    const context = this.target()?.parentElement ?? document.body;
    const min = pixels(this.getAttribute('min') || '12rem', context) ?? 0;
    const max = pixels(this.getAttribute('max') || '40rem', context) ?? Infinity;
    return {
      min,
      max: Math.max(min, max)
    };
  }

  width() {
    return this.target()?.getBoundingClientRect().width ?? 0;
  }

  session() {
    return {
      measure: () => this.width(),
      limits: () => this.limits(),
      apply: (width, phase) => {
        const written = this.apply(width);
        if (phase === 'move' && written !== null) this.announce(written, 'move');
        return written;
      },
      commit: width => this.commit(width),
      reset: () => this.reset(),
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
    writeStored(this.storageKey, width);
    this.announce(width, 'end');
  } // Back to the width the page's stylesheet gives, and forgotten.


  reset() {
    if (this.disabled) return;
    const target = this.target();
    if (!target) return;
    if (this.property) target.style.removeProperty(this.property);else target.style.removeProperty('inline-size');
    writeStored(this.storageKey, null);
    requestAnimationFrame(() => {
      const width = Math.round(this.width());
      this.syncValue(width);
      this.announce(width, 'reset');
    });
  } // A width the host keeps (a person's settings): written as if dragged,
  // within the limits, and remembered as the browser's too.


  restore(width) {
    const number = Number(width);
    if (!Number.isFinite(number) || number <= 0) return null;
    const written = this.apply(number);
    if (written !== null) writeStored(this.storageKey, written);
    return written;
  } // A window narrowed under a remembered width brings it back within limits.


  clampToLimits() {
    const target = this.target();
    if (!target) return;
    const written = this.property ? target.style.getPropertyValue(this.property) : target.style.inlineSize;
    if (!written) return; // The value written is what is clamped, not the panel as measured: in a
    // stacked layout the panel is the window's width whatever is written, and
    // clamping that measurement wrote the maximum over the remembered width
    // (docs trial 4, 2026-10-15).

    const {
      min,
      max
    } = this.limits();
    const value = Number.parseFloat(written);
    if (!Number.isFinite(value)) return;
    if (value > max || value < min) this.apply(value);
  }

  syncLabel() {
    const label = this.sfWord('label');
    const hint = this.sfWord('hint');

    if (!this.getAttribute('aria-label') || this._ownLabel) {
      this.setAttribute('aria-label', this.getAttribute('label') || label);
      this._ownLabel = true;
    }

    this.title = this.getAttribute('label') ? `${this.getAttribute('label')}. ${hint}` : hint;
    if (this.disabled) this.setAttribute('aria-disabled', 'true');else this.removeAttribute('aria-disabled');
  }

  syncValue(width = this.width()) {
    (0,_engine_mjs__WEBPACK_IMPORTED_MODULE_0__.setResizerValue)(this, {
      limits: () => this.limits(),
      measure: () => width
    }, width);
  }

}
if (!customElements.get('sf-resizer')) customElements.define('sf-resizer', SfResizer);
globalThis.SF = globalThis.SF || {}; // attach: the same gesture on any handle -- a table's column edges use it.

globalThis.SF.Resizer = Object.freeze({
  SfResizer,
  attach: _engine_mjs__WEBPACK_IMPORTED_MODULE_0__.attachResizer,
  attachResizer: _engine_mjs__WEBPACK_IMPORTED_MODULE_0__.attachResizer
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
// steps), Enter or Space and a double click back to the default, a separator's
// role and value, the resize cursor over the whole page while it lasts. What
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
//     reset(): back to the default (Enter, Space, a double click)
//     direction(): +1 when a pointer moving right widens, -1 otherwise
//     step: pixels an arrow moves (default 16)
//     start(), end(): around a drag
//   } -- or null, when this handle does not resize now.
const ACTIVE = 'data-sf-resizer-active';

function setValue(handle, session, width = session.measure()) {
  const {min, max} = session.limits();
  handle.setAttribute('aria-valuemin', String(Math.round(min)));
  handle.setAttribute('aria-valuemax', String(Math.round(max)));
  if (width) handle.setAttribute('aria-valuenow', String(Math.round(width)));
}

function clamp(session, width) {
  const {min, max} = session.limits();
  return Math.round(Math.min(Math.max(min, max), Math.max(min, width)));
}

function attachResizer(root, options = {}) {
  const handleOf = (target) => (options.handles ? target?.closest?.(options.handles) : root);
  const owns = (handle) => handle && (handle === root || root.contains(handle));
  const sessionOf = (handle) => (owns(handle) ? options.session?.(handle) ?? null : null);
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
    if (commit && current.width !== Math.round(current.from)) current.session.commit?.(current.width);
  };

  const onPointerDown = (event) => {
    if (event.button > 0 || drag) return;
    const handle = handleOf(event.target);
    const session = sessionOf(handle);
    if (!session) return;
    event.preventDefault();
    event.stopPropagation();
    handle.focus?.({preventScroll: true});
    const from = session.measure();
    const current = {handle, session, pointer: event.pointerId, x: event.clientX, from, width: Math.round(from)};
    current.move = (next) => {
      if (next.pointerId !== current.pointer) return;
      const width = clamp(session, current.from + (next.clientX - current.x) * (session.direction?.() ?? 1));
      if (width === current.width) return;
      current.width = session.apply(width, 'move') ?? width;
      setValue(handle, session, current.width);
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
    const {min, max} = session.limits();
    const now = session.measure();
    const rtl = getComputedStyle(handle).direction === 'rtl';
    const sign = session.direction?.() ?? 1;
    const step = (session.step ?? 16) * (event.shiftKey ? 4 : 1);
    const right = (rtl ? -1 : 1) * sign;
    let next = null;
    if (event.key === 'ArrowRight') next = now + step * right;
    else if (event.key === 'ArrowLeft') next = now - step * right;
    else if (event.key === 'PageUp') next = now + step * 4;
    else if (event.key === 'PageDown') next = now - step * 4;
    else if (event.key === 'Home') next = min;
    else if (event.key === 'End') next = max;
    else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      event.stopPropagation();
      session.reset?.();
      return;
    }
    if (next === null) return;
    event.preventDefault();
    event.stopPropagation();
    const width = session.apply(clamp(session, next), 'end') ?? clamp(session, next);
    setValue(handle, session, width);
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
    if (session) setValue(handle, session);
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

/***/ "20dea37abe64"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-resizer for the shim (core/js/aliases.js, standard §16 item 20). mode: same-detail (the shim sends the new and the old name), detail-adds (the new detail holds the old fields), attribute-and-property, host-attribute (no shim), manifest-only (the DOM name does not change), retired (no new name; kept and noted by the component until the date).","component":"sf-resizer","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"sf-resize","to":"sf-resizer-resize","kind":"event","component":"sf-resizer","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","section":"§8, vocabulary §7","note":"the old name follows with the same detail {width, phase}"}]}');

/***/ },

/***/ "bed569d628ec"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.resizer","tag":"sf-resizer","version":"1.1.3","kind":"leaf","settings":{"min":{"type":"string","default":"12rem"},"max":{"type":"string","default":"40rem"},"property":{"type":"string","default":""},"target":{"type":"string","default":""},"edge":{"type":"enum","values":["inline-end","inline-start"],"default":"inline-end"},"step":{"type":"number","default":16,"min":1},"storage-key":{"type":"string","default":""},"label":{"type":"string","default-from":"runtime.label"},"disabled":{"type":"boolean","default":false},"value":{"type":"number","nullable":true,"default":null}},"values":{},"events":{"resize":{"carries":{"width":"number","phase":{"type":"enum","values":["move","end","reset"]}},"own-verb":true}},"actions":{},"css-variables":{"--sf-resizer-hit-size":{"type":"length","state":"default"},"--sf-resizer-line-width":{"type":"length","state":"default"},"--sf-resizer-line-color":{"type":"color","state":"default"},"--sf-resizer-hover-line-color":{"type":"color","state":"hover"},"--sf-resizer-z-index":{"type":"integer","state":"default"}}}');

/***/ },

/***/ "4012ebee0398"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Resizer","runtime":{"hint":"Drag, or use the arrow keys; a double click restores the width.","label":"Resize"},"events":{"resize":{"label":"Change the width"}}}');

/***/ },

/***/ "d865d3c42424"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Изменение ширины","runtime":{"hint":"Тяните или нажимайте стрелки; двойной щелчок возвращает ширину.","label":"Изменить ширину"},"events":{"resize":{"label":"Изменить ширину"}}}');

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