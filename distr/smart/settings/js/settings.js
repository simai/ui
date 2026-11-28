/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "cb6d39a52a42"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PanelScrollbar: () => (/* binding */ PanelScrollbar),
/* harmony export */   scrollbarTakesRoom: () => (/* binding */ scrollbarTakesRoom)
/* harmony export */ });
// The scrollbar of a dropping panel stands in the inline-end inset only while
// it takes room (owner C07, docs review R029, 2026-11-07): the area that
// scrolls the rows gives up its inline-end padding then, and keeps it beside an
// overlay scrollbar or none. The sheets draw the track (the inset, the thumb,
// the inset -- src/component/context-menu/scss/_panel.scss); this marks the
// area with a class while its scrollbar takes room, read from offsetWidth -
// clientWidth past the borders whenever the area is drawn or changes its size
// (a narrowed search, a panel fitted to its room, a window made smaller).
// Used by sf-menu-context, sf-dropdown's list, sf-input-lookup and
// sf-profile-picker.
function scrollbarTakesRoom(area) {
  const style = getComputedStyle(area);
  const borders = (parseFloat(style.borderLeftWidth) || 0) + (parseFloat(style.borderRightWidth) || 0);
  return area.offsetWidth - area.clientWidth - borders > 0;
}
class PanelScrollbar {
  constructor() {
    this.area = null;
    this.name = '';
    this.observer = null;
  } // Watch `area` (or nothing, given null) and mark it with `name`. A new area
  // releases the old one and takes its mark off.


  watch(area, name) {
    if (area !== this.area || name !== this.name) {
      this.observer?.disconnect();
      if (this.area && this.name) this.area.classList.remove(this.name);
      this.area = area ?? null;
      this.name = name;

      if (this.area && typeof ResizeObserver === 'function') {
        // The mark moves the area's padding, so it is written on the next
        // frame: written in the observer's own call it would resize what is
        // observed while the observer delivers (a ResizeObserver loop).
        this.observer ??= new ResizeObserver(() => requestAnimationFrame(() => this.mark()));
        this.observer.observe(this.area);
      }
    }

    this.mark();
  }

  mark() {
    const area = this.area;
    if (!area?.isConnected || !this.name) return;
    const takesRoom = scrollbarTakesRoom(area);
    if (area.classList.contains(this.name) !== takesRoom) area.classList.toggle(this.name, takesRoom);
  }

  disconnect() {
    this.observer?.disconnect();
    this.observer = null;
    if (this.area && this.name) this.area.classList.remove(this.name);
    this.area = null;
    this.name = '';
  }

}

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
/* harmony export */   sizeOf: () => (/* binding */ sizeOf),
/* harmony export */   sizeStep: () => (/* binding */ sizeStep),
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
} // The size step of the control a popup opens from (owner remark 2026-11-15:
// the row menu of a table of size 1 opened at 1/2). A popup a component
// builds outside itself -- a menu on <body> or in the open dialog -- stood on
// the default step whatever opened it. The step is the first size written
// from the opener up: the opener's own (a row's «⋯», the native button an
// sf-button draws), else its component's, else the Smart component that
// holds it (sf-view-table size="1"). A size a template gave a part it draws
// (data-sf-size-relative) follows its host, so the walk goes on past it. It
// ends on the default step (null) at the second custom element without a
// size: the opener's own component may stand on its default, the host
// holding it decides.

function sizeOf(from) {
  let own = true;

  for (let node = from; node?.nodeType === 1; node = node.parentElement) {
    if (node.hasAttribute('size')) {
      if (!node.hasAttribute(RELATIVE)) return node.getAttribute('size');
      continue;
    }

    if (!node.localName.includes('-')) continue;
    if (!own) return null;
    own = false;
  }

  return null;
} // A size step as a number of the ladder ("1/2" is 0.5, "2" is 2); NaN for
// anything else.

function sizeStep(size) {
  const [top, bottom = '1'] = String(size ?? '').trim().split('/');
  const step = Number(top) / Number(bottom);
  return top !== '' && Number.isFinite(step) && step > 0 ? step : Number.NaN;
}

/***/ },

/***/ "cbcfcde04d12"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   COARSE_QUERY: () => (/* binding */ COARSE_QUERY),
/* harmony export */   LAYOUTS: () => (/* binding */ LAYOUTS),
/* harmony export */   PHONE_BELOW: () => (/* binding */ PHONE_BELOW),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   devicesOf: () => (/* binding */ devicesOf),
/* harmony export */   inLayout: () => (/* binding */ inLayout),
/* harmony export */   itemsInLayout: () => (/* binding */ itemsInLayout),
/* harmony export */   layoutOf: () => (/* binding */ layoutOf),
/* harmony export */   layoutOfWidth: () => (/* binding */ layoutOfWidth),
/* harmony export */   layoutPlace: () => (/* binding */ layoutPlace),
/* harmony export */   markDevices: () => (/* binding */ markDevices),
/* harmony export */   markPageLayout: () => (/* binding */ markPageLayout),
/* harmony export */   pointerKind: () => (/* binding */ pointerKind),
/* harmony export */   watchLayout: () => (/* binding */ watchLayout),
/* harmony export */   watchPointer: () => (/* binding */ watchPointer)
/* harmony export */ });
// Device scope (study S-A, decision q-7097831f9f option 2, 2026-11-24; the
// Touch screens page, docs/foundation-touch-screens.md). Two separate facts,
// one word each, so no component measures them in a copy of its own:
//
//   layout   'phone' when the component's place is narrower than
//            PHONE_BELOW (600 px), else 'desktop'. It decides which items a
//            component shows: an item that carries `devices` is shown only in
//            the layouts it names, and hidden -- not disabled -- in the other.
//   pointer  'coarse' when the page has a touch pointer and no fine one,
//            else 'fine'. It decides gestures and what replaces hover (a
//            check box always shown, a hit area of 44).
//
// A tablet with a keyboard is a coarse pointer in a desktop layout; a narrow
// desktop window a fine pointer in a phone layout. The two words never stand
// for each other.
//
// The place is the nearest size container (an ancestor with a
// `container-type`), as a container query reads it; without one, the page.
// 600 is the width the View layouts already switch at (sf-view-board,
// sf-view-calendar, the view head); it is not a step of the size scale
// (C181 (2) pending), recorded on the page as a known gap.
//
// Marks: an author marks any item -- a setting, a menu item, a tab, a column
// -- with `devices: ['phone']` or `devices: ['desktop']`; a component marks
// its own items it knows are bound to a layout (markDevices). The author's
// mark wins: a component's mark fills only an item that has none.

/** Below this width (px) of its place a component draws its phone layout. */
const PHONE_BELOW = 600;
/** The layouts an item may name in `devices`. */

const LAYOUTS = Object.freeze(['phone', 'desktop']);
/** The coarse-pointer media query: a touch pointer and no fine one. */

const COARSE_QUERY = '(pointer: coarse) and (not (any-pointer: fine))';
const KNOWN = new Set(LAYOUTS);
/** The layout of a width: 'phone' below PHONE_BELOW, else 'desktop'. */

function layoutOfWidth(width) {
  return Number.isFinite(width) && width > 0 && width < PHONE_BELOW ? 'phone' : 'desktop';
}
/**
 * The box whose width decides an element's layout: the element itself or its
 * nearest ancestor that is a size container, else null (the page).
 */

function layoutPlace(element) {
  const view = element?.ownerDocument?.defaultView ?? globalThis;

  for (let node = element instanceof Element ? element : null; node; node = node.parentElement ?? node.getRootNode?.()?.host ?? null) {
    const type = view.getComputedStyle?.(node)?.containerType ?? '';
    if (type && type !== 'normal') return node;
  }

  return null;
}

function placeWidth(element) {
  const place = layoutPlace(element);
  if (place) return place.getBoundingClientRect().width;
  const doc = element?.ownerDocument ?? globalThis.document;
  return doc?.documentElement?.clientWidth || globalThis.innerWidth || 0;
}
/**
 * The layout an element is drawn in: 'phone' or 'desktop'. A number is read
 * as a width; a written word ('phone' | 'desktop') is taken as given, so a
 * host that knows its own layout says it.
 */


function layoutOf(target) {
  if (KNOWN.has(target)) return target;
  if (typeof target === 'number') return layoutOfWidth(target);
  return layoutOfWidth(placeWidth(target));
}
/**
 * Follows an element's layout: calls back with the new word when it changes
 * (not at once). Returns stop(). Without ResizeObserver it follows the page.
 */

function watchLayout(element, callback) {
  let last = layoutOf(element);

  const check = () => {
    const now = layoutOf(element);
    if (now === last) return;
    last = now;
    callback(now);
  };

  const place = layoutPlace(element);
  const view = element?.ownerDocument?.defaultView ?? globalThis;

  if (place && typeof view.ResizeObserver === 'function') {
    const observer = new view.ResizeObserver(check);
    observer.observe(place);
    return () => observer.disconnect();
  }

  view.addEventListener?.('resize', check);
  return () => view.removeEventListener?.('resize', check);
}
/** The page's pointer: 'coarse' (touch, no fine pointer) or 'fine'. */

function pointerKind(view = globalThis) {
  return typeof view?.matchMedia === 'function' && view.matchMedia(COARSE_QUERY).matches ? 'coarse' : 'fine';
}
/** Follows the page's pointer word; returns stop(). */

function watchPointer(callback, view = globalThis) {
  const media = typeof view?.matchMedia === 'function' ? view.matchMedia(COARSE_QUERY) : null;
  if (!media) return () => {};

  const listener = () => callback(media.matches ? 'coarse' : 'fine');

  media.addEventListener?.('change', listener);
  return () => media.removeEventListener?.('change', listener);
}
/**
 * The layouts an item is scoped to, or null (every layout). Unknown words are
 * dropped; a list with no known word is no scope.
 */

function devicesOf(item) {
  const list = Array.isArray(item?.devices) ? item.devices : typeof item?.devices === 'string' ? item.devices.split(/[\s,]+/u) : null;
  if (!list) return null;
  const known = [...new Set(list.filter(word => KNOWN.has(word)))];
  return known.length ? known : null;
}
/** Whether an item is shown in a layout: unscoped, or scoped to it. */

function inLayout(item, layout) {
  const scope = devicesOf(item);
  return !scope || scope.includes(KNOWN.has(layout) ? layout : 'desktop');
}
/**
 * The items shown in a layout, nested lists (`items`, and `options` when
 * `options: true`) filtered the same way. The items are not copied unless a
 * nested list changes.
 */

function itemsInLayout(items, layout, {
  options = false
} = {}) {
  if (!Array.isArray(items)) return [];
  const out = [];

  for (const item of items) {
    if (!inLayout(item, layout)) continue;

    if (!item || typeof item !== 'object') {
      out.push(item);
      continue;
    }

    let next = item;

    if (Array.isArray(item.items)) {
      const inner = itemsInLayout(item.items, layout, {
        options
      });
      if (inner.length !== item.items.length || inner.some((one, at) => one !== item.items[at])) next = { ...next,
        items: inner
      };
    }

    if (options && Array.isArray(item.options)) {
      const inner = item.options.filter(option => inLayout(option, layout));
      if (inner.length !== item.options.length) next = { ...next,
        options: inner
      };
    }

    out.push(next);
  }

  return out;
}
/**
 * A component's own marks over an author's items: `marks` maps an item id to
 * its layouts (['desktop'] for a table-only setting). An item that carries
 * its own `devices` keeps it -- the author's mark wins; nested `items` are
 * marked the same way. Returns new items; the given ones are not changed.
 */

function markDevices(items, marks = {}) {
  if (!Array.isArray(items)) return [];
  const table = marks instanceof Map ? marks : new Map(Object.entries(marks ?? {}));
  return items.map(item => {
    if (!item || typeof item !== 'object') return item;
    let next = item;
    const own = Object.hasOwn(item, 'devices') && item.devices !== undefined && item.devices !== null;
    if (!own && item.id !== undefined && table.has(String(item.id))) next = { ...next,
      devices: [...table.get(String(item.id))]
    };
    if (Array.isArray(item.items)) next = { ...next,
      items: markDevices(item.items, table)
    };
    return next;
  });
}
const Device = Object.freeze({
  PHONE_BELOW,
  LAYOUTS,
  COARSE_QUERY,
  layoutOf,
  layoutOfWidth,
  layoutPlace,
  watchLayout,
  pointer: pointerKind,
  watchPointer,
  devicesOf,
  inLayout,
  itemsInLayout,
  markDevices
}); // Core publishes the helper; a component bundle that carries its own copy
// reuses an already published one instead of replacing it.

if (typeof globalThis !== 'undefined') {
  globalThis.SF = globalThis.SF || {};
  if (!globalThis.SF.device) globalThis.SF.device = Device;
} // The page's layout word on <html> (data-sf-layout="phone" | "desktop"),
// written while core boots and followed on resize (DEV answer 3 on group
// build 20): static first-paint markup printed at one width carries its
// items' scope (data-sf-devices), and core.styles hides the other layout's
// items by this word until their element draws -- the signal's own width,
// PHONE_BELOW of the page, not a width rule of the sheets. One mark per
// page: a second copy of this module finds it and leaves it.


const LAYOUT_MARK = Symbol.for('sf.device.page-layout');
function markPageLayout(doc = globalThis.document) {
  const root = doc?.documentElement;
  const view = doc?.defaultView; // One mark per page, kept on the document under a registry symbol: every
  // bundle carries its own copy of this module, the document is shared.

  if (!root || !view || doc[LAYOUT_MARK]) return;
  doc[LAYOUT_MARK] = true;

  const write = () => {
    const word = layoutOfWidth(root.clientWidth || view.innerWidth || 0);
    if (root.getAttribute('data-sf-layout') !== word) root.setAttribute('data-sf-layout', word);
  };

  write();
  view.addEventListener?.('resize', write, {
    passive: true
  });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Device);

/***/ },

/***/ "51250bf01ab0"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PREPAINT_READER: () => (/* binding */ PREPAINT_READER),
/* harmony export */   STORAGE_PREFIX: () => (/* binding */ STORAGE_PREFIX),
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
 // Before the first paint (GB21, Docara K-13, decision C438): the browser's
// copy of a preference is a public format -- localStorage `sf-pref:<key>`,
// the JSON of its value -- so a page reads it in <head>, before the Framework
// has run, and applies it without a copy of its own (the theme-first-paint
// pattern). PREPAINT_READER is the reader to print there, word for word (ES5,
// no module): sfPreference(key) answers the kept value or null. It reads the
// browser's copy only: a host that keeps preferences for its user prints them
// with the page (preload, the data-sf-preferences block).

const STORAGE_PREFIX = PREFIX;
const PREPAINT_READER = "function sfPreference(key){try{return JSON.parse(localStorage.getItem('sf-pref:'+key)||'null')}catch(e){return null}}";

/***/ },

/***/ "42f1649d1a1b"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SWIPE_SHARE: () => (/* binding */ SWIPE_SHARE),
/* harmony export */   SWIPE_SPEED: () => (/* binding */ SWIPE_SPEED),
/* harmony export */   handleRowHeight: () => (/* binding */ handleRowHeight),
/* harmony export */   inHandleRow: () => (/* binding */ inHandleRow),
/* harmony export */   scrollsAlong: () => (/* binding */ scrollsAlong),
/* harmony export */   startsOnControl: () => (/* binding */ startsOnControl),
/* harmony export */   swipeToClose: () => (/* binding */ swipeToClose),
/* harmony export */   trackSwipe: () => (/* binding */ trackSwipe)
/* harmony export */ });
// A finger closing a panel by pushing it toward its edge (owner decision C157
// (4) and (5), 2026-11-14): the bottom sheet -- sf-drawer placement="bottom"
// and every phone sheet drawn from core/scss/mix/_mix__sheet.scss -- follows
// a drag down and closes past a quarter of its height or on a quick flick; a
// side panel on a phone does the same toward its own edge. The panel follows
// the finger through a length in a custom property the owner's rule reads
// (translate), and settles back when the drag stops short.
//
//   const stop = trackSwipe(pointerdownEvent, {
//     surface,                      the box that moves
//     direction: 'down' | 'left' | 'right' | 'up',
//     variable: '--sf-sheet--drag', the property set on the surface
//     onEnd: ({dismiss, back}) => ...,
//   });
//
// dismiss: the drag passed the share or the speed toward the edge; back: it
// did so the other way (a sheet at rest may open further). A drag along the
// other axis is let go at once (a list scrolling inside a side panel), and a
// drag shorter than the slop is a press, not a swipe.
const SWIPE_SHARE = 0.25;
const SWIPE_SPEED = 0.5;
const SLOP = 4;
const AXES = {
  down: {
    axis: 'y',
    sign: 1
  },
  up: {
    axis: 'y',
    sign: -1
  },
  right: {
    axis: 'x',
    sign: 1
  },
  left: {
    axis: 'x',
    sign: -1
  }
}; // What a swipe must not start on: a control keeps its own presses, a field
// its text selection, a box that scrolls along the swipe's axis its scroll.

const KEEPS_PRESS = 'button, a[href], input, select, textarea, [contenteditable="true"], [role="slider"], [role="scrollbar"], [draggable="true"], sf-resizer';
function startsOnControl(target) {
  return Boolean(target instanceof Element && target.closest(KEEPS_PRESS));
} // Whether something between the target and the surface scrolls along this
// axis toward the swipe (a wide table in a side panel, a carousel).

function scrollsAlong(target, surface, axis) {
  for (let node = target instanceof Element ? target : null; node && node !== surface; node = node.parentElement) {
    const style = getComputedStyle(node);
    const overflow = axis === 'x' ? style.overflowX : style.overflowY;
    if (!/(auto|scroll)/u.test(overflow)) continue;
    if (axis === 'x' ? node.scrollWidth > node.clientWidth + 1 : node.scrollHeight > node.clientHeight + 1) return true;
  }

  return false;
}
function trackSwipe(event, {
  surface,
  direction = 'down',
  variable = '--sf-sheet--drag',
  onEnd,
  onMove
} = {}) {
  const spec = AXES[direction] || AXES.down;
  if (!surface || !event) return () => {};
  const grip = event.currentTarget instanceof Element ? event.currentTarget : surface;
  const start = {
    x: event.clientX,
    y: event.clientY,
    t: event.timeStamp
  };
  const rect = surface.getBoundingClientRect();
  const size = (spec.axis === 'y' ? rect.height : rect.width) || 1; // The owner names the physical edge: a length along x is left-to-right
  // whatever the page's direction.

  const physical = spec.sign;
  let moved = false;
  let given = false;
  let delta = 0;

  const along = e => spec.axis === 'y' ? e.clientY - start.y : e.clientX - start.x;

  const across = e => spec.axis === 'y' ? e.clientX - start.x : e.clientY - start.y; // The moves are heard on the document, not the grip: a pointer that leaves
  // the grip before it is captured (a quick drag off a handle row) still
  // reports to it.


  const doc = grip.ownerDocument || document;

  const clear = () => {
    doc.removeEventListener('pointermove', move, true);
    doc.removeEventListener('pointerup', end, true);
    doc.removeEventListener('pointercancel', end, true);
    surface.classList.remove('is-dragging');
    surface.style.removeProperty(variable);
  };

  const move = e => {
    if (given || e.pointerId !== event.pointerId) return;
    const a = along(e);

    if (!moved) {
      if (Math.abs(a) < SLOP && Math.abs(across(e)) < SLOP) return; // Across the axis first: a scroll or a selection, not this swipe.

      if (Math.abs(across(e)) > Math.abs(a)) {
        given = true;
        clear();
        return;
      }

      moved = true;
      surface.classList.add('is-dragging'); // Captured only once it is a swipe: captured at the press, the click
      // of a tap went to the grip instead of what was tapped.

      try {
        grip.setPointerCapture?.(event.pointerId);
      } catch {
        /* a synthetic event has no pointer */
      }
    }

    delta = a; // The panel follows toward its edge only; the other way it holds.

    const toward = Math.max(0, delta * physical);
    surface.style.setProperty(variable, `${toward * physical}px`);
    onMove?.(toward);
  };

  function end(e) {
    if (e.pointerId !== event.pointerId) return;
    clear();
    if (given || !moved || e.type === 'pointercancel') return; // A drag that ends on the grip is not also a press of it.
    // The click, if any, comes in the same task as the release; one that
    // never comes must not eat a later press.

    const swallow = click => click.stopImmediatePropagation();

    grip.addEventListener('click', swallow, {
      capture: true,
      once: true
    });
    setTimeout(() => grip.removeEventListener('click', swallow, {
      capture: true
    }));
    const toward = delta * physical;
    const speed = toward / Math.max(1, e.timeStamp - start.t);
    const dismiss = toward > size * SWIPE_SHARE || speed > SWIPE_SPEED;
    const back = !dismiss && (-toward > size * SWIPE_SHARE || speed < -SWIPE_SPEED);
    onEnd?.({
      dismiss,
      back,
      distance: toward
    });
  }

  doc.addEventListener('pointermove', move, true);
  doc.addEventListener('pointerup', end, true);
  doc.addEventListener('pointercancel', end, true);
  return clear;
} // The handle row of a sheet drawn by the mixin's ::before: a press within it
// -- from the sheet's top, the 1/2 control's height (the row the bar is
// centred in) -- starts the swipe.

function handleRowHeight(surface) {
  const value = getComputedStyle(surface).getPropertyValue('--sf-ui-1/2--control-height').trim();
  const match = /^(-?\d*\.?\d+)(px|rem|em)?$/u.exec(value);
  if (!match) return 32;
  const unit = match[2] || 'px';
  const base = unit === 'px' ? 1 : parseFloat(getComputedStyle(unit === 'rem' ? document.documentElement : surface).fontSize) || 16;
  return Number(match[1]) * base;
}
function inHandleRow(event, surface) {
  const top = surface.getBoundingClientRect().top;
  return event.clientY >= top && event.clientY - top <= handleRowHeight(surface);
} // A sheet that a swipe down from its handle row closes: binds the press on
// the surface and answers the unbinding. `when` says whether the surface is
// a sheet now (a form anchored on a wide screen is not); a press on a
// control keeps the control's own press.
//
//   const unbind = swipeToClose(surface, {when: () => owned.sheet, onDismiss: () => close()});

function swipeToClose(surface, {
  when = () => true,
  onDismiss
} = {}) {
  if (!surface) return () => {};

  const onPress = event => {
    if (event.button !== 0 || !when()) return;
    if (startsOnControl(event.target) || !inHandleRow(event, surface)) return;
    trackSwipe(event, {
      surface,
      direction: 'down',
      onEnd: ({
        dismiss
      }) => {
        if (dismiss) onDismiss?.();
      }
    });
  };

  surface.addEventListener('pointerdown', onPress);
  return () => surface.removeEventListener('pointerdown', onPress);
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
/* harmony import */ var _core_js_density_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("1412c5875b4d");
/* harmony import */ var _core_js_position_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("116963e5e31b");
/* harmony import */ var _core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("bf0cea966575");
/* harmony import */ var _core_js_layer_stack_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("18003344cff0");
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("d3818183b14c");
/* harmony import */ var _core_js_sheet_swipe_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("42f1649d1a1b");
/* harmony import */ var _core_js_device_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("cbcfcde04d12");
/* harmony import */ var _component_panel_scrollbar_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__("cb6d39a52a42");
/* harmony import */ var _js_settings__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__("bb67a9697f33");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__("72cabd0f91e5");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__("686f52293091");
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__("e1c707506370");
/* harmony import */ var _lang_index_mjs__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__("0d10ff01494f");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_tag_aliases_js__WEBPACK_IMPORTED_MODULE_3__, _js_templates_default__WEBPACK_IMPORTED_MODULE_4__, _core_js_position_js__WEBPACK_IMPORTED_MODULE_6__, _core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_7__, _core_js_layer_stack_js__WEBPACK_IMPORTED_MODULE_8__, _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_9__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_tag_aliases_js__WEBPACK_IMPORTED_MODULE_3__, _js_templates_default__WEBPACK_IMPORTED_MODULE_4__, _core_js_position_js__WEBPACK_IMPORTED_MODULE_6__, _core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_7__, _core_js_layer_stack_js__WEBPACK_IMPORTED_MODULE_8__, _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_9__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_position_js__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_core_js_position_js__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _core_js_layer_stack_js__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_core_js_layer_stack_js__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_9__);
// sf-settings: compact settings -- a few settings a person changes on the
// spot, a reader's theme and text size, a table's density, a chat's sound.
// Where a product has a sign-in, the person's own settings (theme, language,
// text size) are rows of the person menu (owner decision C176 (1)); this
// element is the gear of a screen's view (a table, reading) and of a site
// without a sign-in.
// The items are data, each holding its own value:
//
//   <sf-settings look="rows">
//     (the page's trigger: an icon button, a link)
//     <script type="application/json" data-sf-settings>{"items": [...]}</script>
//   </sf-settings>
//
// It composes sf-menu-context and draws nothing of its own (owner decision
// 2026-11-06): the items become the menu's entries, laid out by one attribute,
// look -- drill (the value under the name, the options in the same panel) or
// rows (the name at the start, the control at the end; a choice whose options
// do not fit beside its name becomes a drill row by itself, C176 (3)). The
// tiles look left (C176 (5)): tiles is a dated former name of drill until
// 2027-01-01, its switches rows. With a trigger (the trigger
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















 // The panel look's sheet (C106); the menu looks draw nothing of their own.


 // Only the words on screen ship in the bundle, English only (owner decision
// C282): Russian and every other language come from a language file. The
// title, settings and events stay in the language files for the Studio and the
// docs (localization study LC-2).
// The menu it draws, found under its current name and its former one.

const MENU = `:scope > .sf-settings-parts > ${(0,_core_js_tag_aliases_js__WEBPACK_IMPORTED_MODULE_3__.tagSelector)('sf-menu-context')}`; // The colour window of the colour rows (C85): sf-input-color's own, opened on «Своё».

const PICKER = `:scope > .sf-settings-parts > .sf-settings-color > ${(0,_core_js_tag_aliases_js__WEBPACK_IMPORTED_MODULE_3__.tagSelector)('sf-input-color')}`;
const FOCUSABLE = 'button, a[href], input, select, textarea, [tabindex]'; // The page's window a panel in the flow may stand in (GB21, Docara K-13): the
// Framework's window and side sheet, found by the panel each draws round its
// content (data-sf-modal-panel, data-sf-drawer-panel) and the portal each
// moves that panel into (data-sf-modal-portal, data-sf-drawer-portal, named
// by the window's id), or the platform's <dialog>. A panel that stands in one
// draws the close button a popup draws, and its press closes that window by
// the window's own close.

const SHELL = '[data-sf-modal-panel], [data-sf-drawer-panel], dialog';
const PORTAL = '[data-sf-modal-portal], [data-sf-drawer-portal]';

const closes = node => node instanceof HTMLElement && node.localName.includes('-') && typeof node.close === 'function'; // The window element round the element: the element whose close it calls.


function shellHost(element) {
  const marker = element?.closest(SHELL);
  if (!marker) return null;
  if (marker.localName === 'dialog') return marker;

  for (let node = marker.parentElement; node; node = node.parentElement) if (closes(node)) return node; // Moved into the window's portal: the window that carries the portal's name.


  const portal = marker.closest(PORTAL);
  const name = portal?.getAttribute('data-sf-modal-portal') ?? portal?.getAttribute('data-sf-drawer-portal');
  if (!name) return null;
  const quoted = CSS.escape(name);
  return [...document.querySelectorAll(`[modal-id="${quoted}"], [drawer-id="${quoted}"], [id="${quoted}"]`)].find(node => closes(node) && (node.modalId === name || node.drawerId === name)) ?? null;
} // Whether the window draws a close of its own (its settings): then the panel
// draws none, so a window never shows two. A window with a header
// (showHeader, the Framework window's) draws its close in that header.
// Whether the window is a side sheet (its panel marker): a sheet reads a
// close of its content's own (data-drawer="close") and then draws none --
// on a phone-wide sheet that covers its opener as well (C104), so the
// panel's close is marked as the sheet's own (GB21 return R1, C438 (1)).


function inSheet(element) {
  return Boolean(element?.closest(SHELL)?.matches('[data-sf-drawer-panel]'));
}

function shellDrawsClose(shell) {
  if (shell.localName === 'dialog') return false;
  if (typeof shell.showHeader === 'boolean' && !shell.showHeader) return false;
  return shell.showClose !== false;
}

const text = value => value === undefined || value === null ? '' : String(value).trim();

const same = _js_settings__WEBPACK_IMPORTED_MODULE_13__.sameValue; // The anchored positioning Core published, or the bundle's own copy.

const position = () => globalThis.SF?.Position || (_core_js_position_js__WEBPACK_IMPORTED_MODULE_6___default()); // On a phone -- below the md breakpoint, where core declares
// --sf-breakpoint-md -- the panel is a sheet at the bottom of the screen
// (C106 (8), C32), as sf-menu-context's forms are.


const onPhone = () => !getComputedStyle(document.documentElement).getPropertyValue('--sf-breakpoint-md').trim(); // The panel's own parts (templates/panel.js).
// The element's own frame round what it draws (templates/default.js).


const FRAME = 'sf-settings-parts';
const PANEL = ':scope > .sf-settings-parts > .sf-settings-panel';
const ROW = '.sf-settings-row-main'; // A pin is sf-button-icon (ST-2, C166): the host lays out as display:contents
// and hands its data-* and tabindex to its native button, which is what takes
// the focus and carries the row's setting and option.

const PIN = '.sf-settings-row-pin';

const pinButton = pin => (pin?.matches?.('button') ? pin : pin?.querySelector?.('button')) ?? null; // A field's «На телефоне» switch (study S-A (2), VL-82): a role="switch" of
// the row, reached by the arrow inward after the pin, as the pin is.


const PHONE = '.sf-settings-row-phone'; // The controls inside a row after its main one, in the order the arrow
// inward reaches them: the pin's button, the phone switch.

const innerControls = main => {
  const row = main?.parentElement;
  return [pinButton(row?.querySelector(`:scope > ${PIN}`)), row?.querySelector(`:scope > ${PHONE}`)].filter(one => one && one.getAttribute('aria-disabled') !== 'true');
};

const innerKind = control => control?.closest?.(PHONE) ? PHONE : PIN;

const rowKey = main => main?.dataset.sfOption ?? main?.dataset.sfSetting ?? ''; // The values are a preference of the person (SF.Preferences, owner
// 2026-10-14): in the browser under sf-pref:sf-settings/<remember>, and by a
// host that keeps preferences for its user. The registry is the shared one
// when core has published it (every bundle has its own copy).


const preferences = () => globalThis.SF?.Preferences || _core_js_preferences_js__WEBPACK_IMPORTED_MODULE_2__["default"];
/** The SF.Preferences key a remember name keeps the values under (settings.js rememberedKey: a public format, read before the first paint). */


const rememberKey = _js_settings__WEBPACK_IMPORTED_MODULE_13__.rememberedKey;
const SettingsElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_14__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: _lang_index_mjs__WEBPACK_IMPORTED_MODULE_17__.files,
  source: 'ru',
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_15__
}); // A row of the rows look fits when its name stands on one line, whole, and its
// options on one line beside it, none of them cut (C176 (3), defect SM-8: in
// an 18rem menu three Russian words broke «Плотность» inside the word and
// left «Размер текста» without its name).

function lineCount(element) {
  const range = document.createRange();
  range.selectNodeContents(element);
  return new Set([...range.getClientRects()].filter(rect => rect.width > 0).map(rect => Math.round(rect.top))).size;
}

function choiceFits(row) {
  const label = row.querySelector('.sf-context-menu-item-label');
  const choice = row.querySelector('.sf-context-menu-choice');
  if (!choice) return true;
  if (label && (lineCount(label) > 1 || label.scrollWidth > label.clientWidth + 1)) return false;
  if (choice.scrollWidth > choice.clientWidth + 1) return false;
  const options = [...choice.querySelectorAll('.sf-context-menu-choice-option')];
  if (new Set(options.map(option => Math.round(option.getBoundingClientRect().top))).size > 1) return false;
  return options.every(option => option.scrollWidth <= option.clientWidth + 1 && lineCount(option) <= 1);
} // The drop line of a drag by the handle (owner remark VR11-5, group build 16):
// SF.Sortable's one line (SORTABLE_DROP_LINE, 2 px, .sf-sortable-indicator in
// sf-sortable's sheet), owned by the panel so the drag module never takes it.
// It stands in the panel (the panel may be in the top layer, over anything on
// the body) at the place the row lands: the top of the row it goes before, or
// the bottom of the last row, across the list -- the rect of SF.Sortable's
// line preview (listIndicatorRect).


const DROP_LINE = 2; // The line's look is sf-sortable's sheet, a lazy relation: asked for when a
// panel with a handle opens and when a drag starts (a lazy relation is fetched
// when it is first used; the Loader asks once).

function askDropLineSheet(panel) {
  if (!panel?.querySelector?.('.sf-settings-row-handle') || globalThis.customElements?.get('sf-sortable')) return;

  try {
    globalThis.SF?.Loader?.ensure?.(['sf-sortable'])?.catch?.(() => {});
  } catch {// No Loader on the page: the line keeps the panel's place, unstyled.
  }
}

function dropLine(panel) {
  const line = document.createElement('div');
  line.className = 'sf-sortable-indicator';
  line.setAttribute('aria-hidden', 'true');
  line.setAttribute('data-sf-drop-line-owner', 'sf-settings');
  line.hidden = true;
  panel?.append(line);
  return line;
}

function placeDropLine(line, list, before, after) {
  if (!before && !after) {
    line.hidden = true;
    return;
  }

  const box = list.getBoundingClientRect();
  const y = before ? before.getBoundingClientRect().top : after.getBoundingClientRect().bottom;
  line.hidden = false;
  Object.assign(line.style, {
    left: `${box.left}px`,
    top: `${y - DROP_LINE / 2}px`,
    width: `${box.width}px`,
    height: `${DROP_LINE}px`
  }); // position: fixed is the viewport's unless a box round the panel makes its
  // own containing block (a transform); the line is moved by what it missed.

  const drawn = line.getBoundingClientRect();
  const dx = box.left - drawn.left;
  const dy = y - DROP_LINE / 2 - drawn.top;
  if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) Object.assign(line.style, {
    left: `${box.left + dx}px`,
    top: `${y - DROP_LINE / 2 + dy}px`
  });
}

class SfSettings extends SettingsElement {
  constructor() {
    super();
    this._declared = null;
    this._declaredFor = null;
    this._restoredFor = null;
    this._entries = {
      items: null,
      look: '',
      folded: null,
      layout: '',
      list: []
    }; // The rows look's choices that did not fit beside their names (C176 (3)),
    // measured for the panel's width and text size they were drawn at.

    this._fit = {
      key: '',
      ids: new Set()
    };
    this._watched = null;

    this._onDocumentClick = event => this.onDocumentClick(event);

    this._onHostClick = event => this.onHostClick(event); // The panel look (C106): whether a popup panel is open, the search, the
    // chosen tab, the values a button-applied panel holds until «Применить»,
    // and each list's Tab stop by the list's key.


    this._open = null;
    this._query = '';
    this._tab = 0;
    this._draft = null;
    this._current = new Map();
    this._scrollbar = new _component_panel_scrollbar_js__WEBPACK_IMPORTED_MODULE_12__.PanelScrollbar();

    this._onPanelKeyDown = event => this.onPanelKeyDown(event);

    this._onPanelInput = event => this.onPanelInput(event);

    this._onPanelFocusIn = event => this.onPanelFocusIn(event);

    this._onPanelFocusOut = event => this.onPanelFocusOut(event);

    this._onPanelPointerDown = event => this.onPanelPointerDown(event); // The layout the items are shown for (core's word, study S-A): measured
    // on its place while connected, unless the page writes device.


    this._layout = '';
    this._stopLayout = null;
  }
  /**
   * The layout the items are shown for, 'phone' or 'desktop': the device
   * setting when written, else the width of the element's place (core's
   * layoutOf: its nearest size container, else the page; phone below 600).
   * An item with devices is shown only in the layouts it names.
   */


  get deviceLayout() {
    if (this.device === 'phone' || this.device === 'desktop') return this.device;
    return this._layout || 'desktop';
  } // The layout followed while connected: a change draws the items again.


  watchDeviceLayout() {
    this._stopLayout?.();
    this._layout = (0,_core_js_device_js__WEBPACK_IMPORTED_MODULE_11__.layoutOf)(this);
    this._stopLayout = (0,_core_js_device_js__WEBPACK_IMPORTED_MODULE_11__.watchLayout)(this, now => {
      this._layout = now;
      if (this.device !== 'phone' && this.device !== 'desktop') this.requestComponentUpdate('layout');
    });
  } // The trigger is the default slot (component.json): the children the page
  // wrote without a slot attribute, taken live like the named ones. The JSON
  // island is read and taken out before (element-manifest.js).


  onConnected() {
    super.onConnected?.();
    const live = this._liveSlotNodes;

    if (live && !live.has('trigger')) {
      // Its own frame is not the page's: a panel drawn before a window took
      // it into its panel (sf-drawer moves its content at its first drawing)
      // connects again holding the frame, and the frame taken as the trigger
      // was drawn into itself -- HierarchyRequestError, an empty panel (GB21
      // return R2, ui-control evidence 2026-11-28-gb21-return).
      const nodes = Array.from(this.children).filter(child => !child.hasAttribute('slot') && !child.hasAttribute('data-sf-static') && child.localName !== 'script' && child.localName !== 'template' && !child.classList.contains(FRAME));

      if (nodes.length) {
        nodes.forEach(node => node.remove());
        live.set('trigger', nodes);
      }
    }

    document.addEventListener('click', this._onDocumentClick);
    this.addEventListener('click', this._onHostClick);
    this.addEventListener('keydown', this._onPanelKeyDown);
    this.addEventListener('input', this._onPanelInput);
    this.addEventListener('focusin', this._onPanelFocusIn);
    this.addEventListener('focusout', this._onPanelFocusOut);
    this.addEventListener('pointerdown', this._onPanelPointerDown);
    this.watchDeviceLayout();
  }

  disconnectedCallback() {
    this._colorWatch?.disconnect();
    this._colorWatch = null;
    this.closePanel({
      restoreFocus: false,
      reason: 'api',
      ask: false
    });

    this._scrollbar.disconnect();

    document.removeEventListener('click', this._onDocumentClick);
    this.removeEventListener('click', this._onHostClick);
    this.removeEventListener('keydown', this._onPanelKeyDown);
    this.removeEventListener('input', this._onPanelInput);
    this.removeEventListener('focusin', this._onPanelFocusIn);
    this.removeEventListener('focusout', this._onPanelFocusOut);
    this.removeEventListener('pointerdown', this._onPanelPointerDown);
    this._stopLayout?.();
    this._stopLayout = null;
    super.disconnectedCallback?.();
  } // ------------------------------------------------------------- the values
  // The declared values: the ones the items carried when the page gave them,
  // taken once per list the page gave. reset puts them back.


  declaredValues() {
    if (this._declaredFor !== this.items) {
      this._declared = (0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.valueMap)(this.items);
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
    return (0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.valueMap)(this.items);
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
    } = (0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.rewriteValues)(items, item => Object.hasOwn(kept, item.id) ? (0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.valuePatch)(item, kept[item.id]) : null);
    if (!count) return;
    this._declaredFor = list;
    this._restoredFor = list;
    this.items = list;
  }

  keep() {
    const key = rememberKey(this.remember);
    if (!key) return;

    try {
      preferences().write(key, (0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.valueMap)(this.items));
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
    const item = (0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.findItem)(this.items, id);
    if (!item) return; // «Свой цвет…» is not a value: it closes the menu and opens the colour
    // window on «Своё»; what is chosen there is the change.

    if (item.type === 'color' && value === _js_settings__WEBPACK_IMPORTED_MODULE_13__.OWN_COLOR) {
      event.preventDefault();

      this._openOwnColor(item);

      return;
    }

    const patch = (0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.valuePatch)(item, value);
    const detail = {
      id,
      value,
      previous: previous ?? (0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.itemValue)(item),
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
    const item = (0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.findItem)(this.items, id);
    if (!item) return;
    const patch = (0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.valuePatch)(item, value);
    if (!patch) return;
    const {
      list
    } = (0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.rewriteValues)(this.items, one => one.id === id ? patch : null);
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
    const item = (0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.findItem)(this.items, id);
    if (!item) return {
      outcome: 'refused',
      reason: 'not-found'
    };
    const patch = (0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.valuePatch)(item, value);
    if (!patch) return {
      outcome: 'refused',
      reason: 'invalid'
    };
    if (same((0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.itemValue)(item), patch.value)) return {
      outcome: 'applied'
    };
    this.writeItems((0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.rewriteValues)(this.items, one => one.id === id ? patch : null).list);
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
    } = (0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.rewriteValues)(this.items, item => Object.hasOwn(map, item.id) ? (0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.valuePatch)(item, map[item.id]) : null);
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
    } = (0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.rewriteValues)(this.items, item => {
      if (!Object.hasOwn(declared, item.id)) return null;
      const previous = (0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.itemValue)(item);
      const value = declared[item.id];
      if (same(previous, value)) return null;
      const patch = (0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.valuePatch)(item, value);
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
    if (!(0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.findItem)(this.items, id)) return {
      outcome: 'refused',
      reason: 'not-found'
    };
    await this.whenRendered?.();
    if (this.isPanel) return this.showInPanel(id);
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

    if (this.shownLook === 'drill' || this._fit.ids.has(id)) {
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
  } // ------------------------------------------------------------- the colour


  get _colorPicker() {
    return this.querySelector(PICKER);
  }
  /** Whether one of the items is a colour row: then the colour window is drawn beside the menu. */


  get _hasColor() {
    const walk = list => (Array.isArray(list) ? list : []).some(item => item?.type === 'color' || item?.type === 'group' && walk(item.items));

    return walk(this.items);
  }
  /**
   * Opens sf-input-color's window on «Своё» for a colour row (C85), against
   * the trigger (or the panel when the element stands inline); the menu
   * closes first. Returns an outcome.
   */


  async _openOwnColor(given) {
    const id = given && typeof given === 'object' ? given.id : given;
    const item = (0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.findItem)(this.items, id);
    if (!item || item.type !== 'color') return {
      outcome: 'refused',
      reason: 'not-found'
    };
    if (item.custom === false || item.disabled) return {
      outcome: 'refused',
      reason: 'not-allowed'
    };
    await this.whenRendered?.();
    const picker = this._colorPicker;
    if (!picker) return {
      outcome: 'unavailable',
      reason: 'no-picker'
    };
    const menu = this.menu;
    const anchor = this.popup && this.anchor() || menu;
    if (this.popup && menu?.isOpen) menu.close?.({
      restoreFocus: false,
      reason: 'own-color'
    });
    await customElements.whenDefined('sf-input-color');
    this._colorItem = item.id;
    picker.setAttribute('aria-label', item.text ?? '');
    picker.value = (0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.colorCode)((0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.itemValue)(item));
    await picker.whenRendered?.();
    const holder = picker.parentElement;
    holder.inert = false;

    if (!picker.openPicker({
      anchor,
      view: 'own'
    })) {
      holder.inert = true;
      return {
        outcome: 'unavailable',
        reason: 'disabled'
      };
    } // Inert again once the window has closed.


    this._colorWatch?.disconnect();
    this._colorWatch = new MutationObserver(() => {
      if (picker.isOpen) return;
      holder.inert = true;
      this._colorWatch?.disconnect();
      this._colorWatch = null;
    });

    this._colorWatch.observe(picker, {
      childList: true,
      subtree: true
    });

    return {
      outcome: 'applied'
    };
  } // A colour chosen in the window: asked for and written as a row's value
  // is (change, then changed). The window's input stays inside.


  _onColorPicked(event) {
    event.stopPropagation();
    if (event.type !== 'change') return;
    const item = (0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.findItem)(this.items, this._colorItem);
    const value = event.detail?.value;
    if (!item || !value) return;
    const patch = (0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.valuePatch)(item, value);
    if (!patch || patch.value === (0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.itemValue)(item)) return;
    const previous = (0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.itemValue)(item);
    const asked = {
      id: item.id,
      value: patch.value,
      previous,
      item: { ...item,
        ...patch
      }
    };
    if (!this.sfEmit('change', asked, {
      cancelable: true
    })) return;
    this.writeItems((0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.rewriteValues)(this.items, one => one.id === item.id ? patch : null).list);
    this.sfEmit('changed', asked);
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
    const anchor = this.anchor(trigger);

    if (this.isPanel) {
      if (!anchor || !this.popup) return;
      if (this._open) this.closePanel({
        reason: 'close'
      });else this.openPanel(anchor);
      return;
    }

    const menu = this.menu;
    if (!menu || !anchor || !this.popup) return;
    customElements.whenDefined('sf-menu-context').then(() => menu.toggleFor(anchor));
  }

  onHostClick(event) {
    if (event.defaultPrevented) return;
    const target = event.target instanceof Element ? event.target : null;

    if (target && this.panel?.contains(target)) {
      this.onPanelClick(event, target);
      return;
    }

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
      const control = this.anchor(trigger); // A panel is a dialog (C106, DP-7); the other looks are menus.

      if (control && this.isPanel) control.setAttribute('aria-haspopup', 'dialog');
      if (control && !control.hasAttribute('aria-haspopup')) control.setAttribute('aria-haspopup', 'menu');
      if (control && !control.hasAttribute('aria-expanded')) control.setAttribute('aria-expanded', 'false');
    }
  } // ------------------------------------------------------------- drawing
  // The entries are made again only when the items, the look or the words
  // change, so the menu is not handed a new list (and a new declared
  // snapshot) on every drawing.


  entries(look) {
    const cache = this._entries;
    const folded = this._fit.ids;
    const layout = this.deviceLayout;

    if (cache.items !== this.items || cache.look !== look || cache.folded !== folded || cache.layout !== layout) {
      const word = (key, vars) => this.sfWord(key, vars ? {
        vars
      } : undefined);

      this._entries = {
        items: this.items,
        look,
        folded,
        layout,
        list: (0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.entriesFor)(this.items, look, {
          word,
          folded,
          layout
        })
      };
    }

    return this._entries.list;
  } // The look drawn: a former name (tiles, C176 (5)) draws the look it became
  // and is noted once, as the dated alias of the attribute is.


  get shownLook() {
    const written = this.look;

    if (Object.hasOwn(_js_settings__WEBPACK_IMPORTED_MODULE_13__.FORMER_LOOKS, written)) {
      (0,_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_9__.noteDeprecated)({
        component: 'sf-settings',
        tag: this.localName,
        kind: 'value',
        attribute: 'look',
        from: written,
        to: _js_settings__WEBPACK_IMPORTED_MODULE_13__.FORMER_LOOKS[written],
        since: '2026-11-14',
        remove_after: '2027-01-01'
      });
    }

    return (0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.lookOf)(written);
  } // ─── the rows look: a choice that does not fit (C176 (3))
  // The menu is measured as it is drawn: in the flow after each drawing, a
  // popup when it opens (closed, it has no box). A choice row whose options do
  // not fit beside its name is given to the menu again as a drill row -- the
  // value under the name, the options a level deeper -- before the frame is
  // painted (the drawings are microtasks). The rows are measured anew when
  // the panel's width or text size changes (a density, a sheet).


  measureFit() {
    if (this.shownLook !== 'rows') return false;
    const menu = this.menu;
    const content = menu?.querySelector('.sf-context-menu-content');
    if (!content || !content.getClientRects().length || !content.clientWidth) return false;
    const key = `${content.clientWidth}|${getComputedStyle(content).fontSize}`;

    if (key !== this._fit.key) {
      const had = this._fit.ids.size > 0 && this._fit.key !== '';
      this._fit = {
        key,
        ids: new Set()
      };

      if (had) {
        this.requestComponentUpdate('fit');
        return true;
      }
    }

    const add = [];

    for (const row of content.querySelectorAll('.sf-context-menu-value-row--choice')) {
      const option = row.querySelector('.sf-context-menu-choice-option');
      const id = option ? menu.entryOf?.(option)?.id : null;
      if (id && !this._fit.ids.has(id) && !choiceFits(row)) add.push(id);
    }

    if (!add.length) return false;
    this._fit = {
      key,
      ids: new Set([...this._fit.ids, ...add])
    };
    this.requestComponentUpdate('fit');
    return true;
  } // The menu tells when it has drawn and when it has opened; a row that held
  // the focus and became a drill row gives it to the level's first row.


  watchMenu() {
    const menu = this.menu;
    if (!menu || this._watched === menu) return;
    this._watched = menu;
    menu.addEventListener('sf-after-render', event => {
      if (event.target === menu) this.measureFit();
    });
    menu.addEventListener('sf-menu-context-opened', event => {
      if (event.target !== menu || !this.measureFit()) return;
      menu.whenRendered?.(null, {
        next: true
      }).then(() => {
        if (menu.contains(document.activeElement)) return;
        menu.syncMenuItems?.();
        menu.availableMenuItems?.()[0]?.focus({
          preventScroll: true
        });
      });
    });
  }

  templateContext() {
    this.restore();
    const look = this.shownLook;
    const size = _js_settings__WEBPACK_IMPORTED_MODULE_13__.SIZES.includes(this.size) ? this.size : _js_settings__WEBPACK_IMPORTED_MODULE_13__.DEFAULT_SIZE;
    const popup = this.popup;
    this.sfHostState('data-look', look);
    return this.createTemplateContext({ ...this.getPropsContext(),
      ...(look === 'panel' ? this.panelContext() : {}),
      component: this,
      look,
      size,
      popup,
      label: this.label,
      entries: look === 'panel' ? [] : this.entries(look),
      hasColor: this._hasColor,
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
    if (this.isPanel) this.afterPanelRender();else {
      this._scrollbar.disconnect();

      this.watchMenu();
      this.measureFit();
    }
  } // ─────────────────────────────────────────── the panel look (C106)
  // A list's view settings in a panel of this element's own: groups as
  // sections in one scroll or as tabs, fields lists with a check, a handle, a
  // pin and a search, applied at once or by «Применить». It is not a mode of
  // the action menu (DP-7): a popup is a dialog with its own closing (×,
  // Escape, a press outside, Tab out), a panel in the page's flow a group.


  get isPanel() {
    return (0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.lookOf)(this.look) === 'panel';
  }

  get panel() {
    return this.querySelector(PANEL);
  }
  /** How a panel applies: at once (instant) or by its «Применить» button. */


  get applyMode() {
    return _js_settings__WEBPACK_IMPORTED_MODULE_13__.APPLY.includes(this.apply) ? this.apply : 'instant';
  } // What the rows show: the values a button-applied panel holds until
  // «Применить», else the items.


  shownItems() {
    return this._draft ?? this.items;
  }

  panelContext() {
    const items = this.shownItems();
    const device = this.deviceLayout;
    const groups = (0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.panelGroups)(items, {
      layout: device
    });
    const layout = (0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.panelLayout)(items, {
      search: Boolean(this.search),
      layout: device
    });
    const tab = Math.min(this._tab, Math.max(0, groups.length - 1));
    const shown = layout === 'tabs' ? [groups[tab]].filter(Boolean) : groups;
    const query = this.search ? this._query : '';

    const rowsOf = list => list.flatMap(item => item.type === 'fields' || item.type === 'choice' ? (item.options ?? []).map(option => [item.type === 'choice' ? item.text : '', option.text]) : [[item.text, item.caption]]);

    const nothingFound = Boolean(query) && !shown.some(group => rowsOf(group.items.filter(item => item.type !== 'heading' && item.type !== 'separator')).some(words => (0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.matches)(query, ...words)));
    return {
      groups,
      layout,
      tab,
      query,
      nothingFound,
      // A panel in the flow that stands in a page's window draws the close
      // button a popup draws, unless the window draws its own (GB21, K-13).
      shellClose: Boolean(this.shellCloses()),
      // ... marked as the side sheet's own close, so the sheet draws none at
      // any width (C438 (1): never two).
      sheetClose: Boolean(this.shellCloses()) && inSheet(this.parentElement),
      open: Boolean(this._open),
      search: Boolean(this.search),
      apply: this.applyMode,
      // The page's own number of conditions (a filter whose conditions are
      // not rows of this panel), else what the panel counts.
      count: Number.isInteger(this.applyCount) && this.applyCount >= 0 ? this.applyCount : (0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.applyCount)(items),
      current: this._current,
      // The panel's words: the element's own (close-label, reset-label,
      // search-placeholder, empty-text, pin-label, unpin-label, move-label),
      // else the page language's.
      words: {
        label: this.sfWord('label'),
        close: this.closeLabel || this.sfWord('close'),
        reset: this.resetLabel || this.sfWord('reset'),
        apply: this.sfWord('apply'),
        search: this.searchPlaceholder || this.sfWord('search'),
        empty: this.emptyText || this.sfWord('empty'),
        pin: this.pinLabel || this.sfWord('pin'),
        unpin: this.unpinLabel || this.sfWord('unpin'),
        moveHint: this.moveLabel || this.sfWord('move-hint'),
        phone: this.sfWord('phone'),
        phoneOf: text => this.sfWord('phone-of', {
          vars: {
            text
          }
        })
      }
    };
  } // The scroll area's mark (the scroll-area inset rule, C105 addendum): the
  // body gives up its inline-end padding while its scrollbar takes room.


  afterPanelRender() {
    const body = this.panel?.querySelector('.sf-settings-panel-body') ?? null;

    this._scrollbar.watch(body, 'sf-settings-panel-body--scrollbar');
  } // A value a person gives in the panel. Applied at once, it is asked
  // (change, cancellable), written and reported (changed), as a menu row's;
  // applied by the button, it waits in the panel's draft.


  async commitValue(id, value) {
    if (this.applyMode === 'button') {
      const draft = this.shownItems();
      const item = (0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.findItem)(draft, id);
      const patch = item && (0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.valuePatch)(item, value);
      if (!patch) return false;
      this._draft = (0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.rewriteValues)(draft, one => one.id === id ? patch : null).list;
      this.requestComponentUpdate('draft');
      await this.whenRendered?.();
      return true;
    }

    return this.writeAsked(id, value);
  } // change (cancellable), then the write and changed: one setting.


  writeAsked(id, value) {
    const item = (0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.findItem)(this.items, id);
    const patch = item && (0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.valuePatch)(item, value);
    if (!patch) return false;
    const next = { ...item,
      ...patch
    };
    const previous = (0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.itemValue)(item);
    const asked = (0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.itemValue)(next);
    if (same(previous, asked)) return true;

    if (!this.sfEmit('change', {
      id,
      value: asked,
      previous,
      item: next
    }, {
      cancelable: true
    })) {
      this.requestComponentUpdate('refused');
      return false;
    }

    this.writeItems((0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.rewriteValues)(this.items, one => one.id === id ? patch : null).list);
    this.sfEmit('changed', {
      id,
      value: asked,
      previous,
      item: next
    });
    return true;
  } // A list's new order or pin: a fields list's value, or the order of a
  // choice that orders (its value stays the chosen option).


  async commitArrangement(id, value) {
    const item = (0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.findItem)(this.shownItems(), id);
    if (!item || item.type !== 'choice') return this.commitValue(id, value);

    if (this.applyMode === 'button') {
      const patch = (0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.orderPatch)(item, value);
      if (!patch) return false;
      this._draft = (0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.rewriteValues)(this.shownItems(), one => one.id === id ? patch : null).list;
      this.requestComponentUpdate('draft');
      await this.whenRendered?.();
      return true;
    }

    return this.writeOrdered(id, value);
  } // arrange (cancellable), then the write and arranged: a choice's order.


  writeOrdered(id, order) {
    const item = (0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.findItem)(this.items, id);
    const patch = item && (0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.orderPatch)(item, order);
    if (!patch) return false;
    const next = { ...item,
      ...patch
    };
    const previous = (0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.choiceOrder)(item);
    const asked = (0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.choiceOrder)(next);
    if (same(previous, asked)) return true;
    const detail = {
      id,
      order: asked,
      previous,
      value: (0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.itemValue)(item),
      item: next
    };

    if (!this.sfEmit('arrange', detail, {
      cancelable: true
    })) {
      this.requestComponentUpdate('refused');
      return false;
    }

    this.writeItems((0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.rewriteValues)(this.items, one => one.id === id ? patch : null).list);
    this.sfEmit('arranged', detail);
    return true;
  } // «Применить»: every setting the draft moved is asked and written, as at
  // once; then the popup closes.


  applyDraft() {
    const draft = this._draft;
    this._draft = null;

    if (draft) {
      const wanted = (0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.valueMap)(draft);
      const now = (0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.valueMap)(this.items);

      for (const [id, value] of Object.entries(wanted)) if (!same(now[id], value)) this.writeAsked(id, value);

      const order = (0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.orderMap)(draft);
      const was = (0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.orderMap)(this.items);

      for (const [id, value] of Object.entries(order)) if (!same(was[id], value)) this.writeOrdered(id, value);
    }

    this.requestComponentUpdate('draft');
    if (this._open) this.closePanel({
      reason: 'api'
    });
  } // «Сбросить»: at once, the declared values back (reset, cancellable);
  // applied by the button, the draft takes them and waits for «Применить».


  resetPanel() {
    if (this.applyMode !== 'button') {
      this.reset();
      return;
    }

    const declared = this.declaredValues();
    this._draft = (0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.rewriteValues)(this.shownItems(), item => Object.hasOwn(declared, item.id) ? (0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.valuePatch)(item, declared[item.id]) : null).list;
    this.requestComponentUpdate('draft');
  }
  /** A tab of the panel chosen (the groups shown as tabs). */


  chooseGroup(index) {
    if (!Number.isInteger(index) || index === this._tab) return;
    this._tab = index;
    this.requestComponentUpdate('tab');
  } // A press in the panel: a row's control, a pin, the close button, the
  // footer's buttons.


  onPanelClick(event, target) {
    if (target.closest('[data-sf-close]')) {
      // The press is the panel's: a side sheet's document handler of its own
      // close (data-drawer="close") leaves it, so a cancelled close keeps it open.
      event.preventDefault();
      if (this._open) this.closePanel({
        reason: 'close'
      });else this.closeShell();
      return;
    }

    if (target.closest('[data-sf-reset]')) {
      this.resetPanel();
      return;
    }

    if (target.closest('[data-sf-apply]')) {
      this.applyDraft();
      return;
    }

    const pin = target.closest(PIN);

    if (pin) {
      this.togglePin(pin);
      return;
    }

    const phone = target.closest(PHONE);

    if (phone) {
      this.togglePhone(phone);
      return;
    } // The empty place of a field without the switch is not a part of its
    // check: a press there does nothing.


    if (target.closest('.sf-settings-row-phone-place')) return;
    if (target.closest('.sf-settings-row-handle')) return;
    const main = target.closest('.sf-settings-row')?.querySelector(`:scope > ${ROW}`);

    if (main) {
      this.stand(main);
      this.activate(main);
    }
  } // What a row's control does: a switch turns, an option is chosen, a field
  // is checked or not.


  activate(main) {
    if (main.getAttribute('aria-disabled') === 'true') return;
    const id = main.dataset.sfSetting;
    const item = (0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.findItem)(this.shownItems(), id);
    if (!item) return;
    if (item.type === 'switch') this.commitValue(id, !(0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.itemValue)(item));else if (item.type === 'choice') this.commitValue(id, main.dataset.sfOption);else if (item.type === 'fields') {
      const value = (0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.toggledField)(item, main.dataset.sfOption, 'checked');
      if (value) this.commitValue(id, value);
    }
  }

  async togglePin(pin) {
    const button = pinButton(pin);
    if (!button) return;
    const id = button.dataset.sfSetting;
    const option = button.dataset.sfOption;
    const item = (0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.findItem)(this.shownItems(), id);
    const value = item && (0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.toggledField)(item, option, 'pinned');
    if (!value) return;
    const focused = button === document.activeElement;
    await this.commitArrangement(id, value);
    await this.whenRendered?.();
    if (focused) this.rowControl(id, option, `${PIN} button`)?.focus({
      preventScroll: true
    });
  } // A field's «На телефоне» switch pressed (S-A (2)): the fields list's
  // value with the option's phone the other way, asked and written as a
  // check is; the focus stays on the switch.


  async togglePhone(phone) {
    if (phone.getAttribute('aria-disabled') === 'true') return;
    const id = phone.dataset.sfSetting;
    const option = phone.dataset.sfOption;
    const item = (0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.findItem)(this.shownItems(), id);
    const value = item && (0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.toggledField)(item, option, 'phone');
    if (!value) return;
    const focused = phone === document.activeElement;
    await this.commitValue(id, value);
    await this.whenRendered?.();
    if (focused) this.rowControl(id, option, PHONE)?.focus({
      preventScroll: true
    });
  } // A row's control or pin by its setting and option, after a drawing.


  rowControl(id, option, selector = ROW) {
    return [...(this.panel?.querySelectorAll(selector) ?? [])].find(one => one.dataset.sfSetting === id && (option === undefined || one.dataset.sfOption === option)) ?? null;
  } // The rows of a list a person can reach: shown and not disabled.


  listRows(list) {
    return [...(list?.querySelectorAll(`:scope > .sf-settings-row:not([hidden]) > ${ROW}`) ?? [])].filter(main => main.getAttribute('aria-disabled') !== 'true');
  } // A row becomes its list's Tab stop (DP-4): one stop per list, the one the
  // person stood on last.


  stand(main) {
    const list = main.closest('.sf-settings-list');
    if (!list) return;

    this._current.set(list.dataset.sfList, rowKey(main));

    for (const one of list.querySelectorAll(`:scope > .sf-settings-row > ${ROW}`)) one.tabIndex = one === main ? 0 : -1;
  }

  onPanelFocusIn(event) {
    const main = event.target?.closest?.(ROW);
    if (main && this.panel?.contains(main)) this.stand(main);
  } // Tab out of a popup closes it (a dialog that does not keep the focus); a
  // sheet keeps it (the layer's Tab below).


  onPanelFocusOut(event) {
    const panel = this.panel;
    if (!this._open || this._open.sheet || !panel?.contains(event.target)) return;
    const next = event.relatedTarget;
    if (!(next instanceof Node) || panel.contains(next) || this._open.anchor.contains(next)) return;
    this.closePanel({
      restoreFocus: false,
      reason: 'api'
    });
  } // The search: the rows are filtered as the field is typed in (no case, ё as
  // е); the scroll area's mark follows the rows left.


  onPanelInput(event) {
    const field = event.target;
    if (!field?.matches?.('[data-sf-search]') || !this.panel?.contains(field)) return;
    this._query = field.value;
    this.requestComponentUpdate('query');
    this.whenRendered?.().then(() => this._scrollbar.mark());
  }

  onPanelKeyDown(event) {
    const panel = this.panel;
    const target = event.target;
    if (!panel || !(target instanceof Element) || !panel.contains(target) || event.defaultPrevented) return;
    const rtl = getComputedStyle(panel).direction === 'rtl';
    const inward = rtl ? 'ArrowLeft' : 'ArrowRight';
    const outward = rtl ? 'ArrowRight' : 'ArrowLeft';

    if (target.matches('[data-sf-search]')) {
      if (event.key === 'ArrowDown') {
        const list = [...panel.querySelectorAll('.sf-settings-list:not([hidden])')][0];
        const main = list?.querySelector(`${ROW}[tabindex="0"]`) ?? this.listRows(list)[0];

        if (main) {
          event.preventDefault();
          main.focus();
        }
      }

      return;
    }

    const inner = target.closest(`${PIN}, ${PHONE}`);
    const main = inner ? inner.parentElement?.querySelector(`:scope > ${ROW}`) : target.closest(ROW);
    if (!main) return;
    const list = main.closest('.sf-settings-list');
    const rows = this.listRows(list);
    const at = rows.indexOf(main);

    if (inner) {
      // The pin and the phone switch: outward and inward step among the
      // row's controls, up and down go to the same control of the next row
      // (else its main control); Space and Enter turn the phone switch.
      const controls = innerControls(main);
      const here = controls.findIndex(one => one === target || one.contains(target) || target.contains(one));
      const kind = innerKind(target);

      if (event.key === outward) {
        event.preventDefault();
        (here > 0 ? controls[here - 1] : main).focus();
      } else if (event.key === inward) {
        if (here >= 0 && here < controls.length - 1) {
          event.preventDefault();
          controls[here + 1].focus();
        }
      } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        const next = rows[(at + (event.key === 'ArrowDown' ? 1 : rows.length - 1)) % rows.length];
        const same = innerControls(next).find(one => innerKind(one) === kind);
        (same ?? next)?.focus();
      } else if (kind === PHONE && (event.key === ' ' || event.key === 'Enter')) {
        event.preventDefault();
        this.togglePhone(target.closest(PHONE));
      }

      return;
    }

    if (event.altKey && (event.key === 'ArrowUp' || event.key === 'ArrowDown')) {
      if (main.querySelector('.sf-settings-row-handle')) {
        event.preventDefault();
        this.moveRow(main, event.key === 'ArrowUp' ? -1 : 1);
      }

      return;
    }

    if (event.altKey || event.ctrlKey || event.metaKey) return;
    let next = null;
    if (event.key === 'ArrowDown') next = rows[(at + 1) % rows.length];else if (event.key === 'ArrowUp') next = rows[(at - 1 + rows.length) % rows.length];else if (event.key === 'Home') next = rows[0];else if (event.key === 'End') next = rows[rows.length - 1];

    if (next) {
      event.preventDefault();
      this.stand(next);
      next.focus(); // A radio group chooses as it moves (APG radio group).

      if (next.getAttribute('role') === 'radio' && next !== main) this.activate(next);
      return;
    }

    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      this.activate(main);
      return;
    }

    if (event.key === inward) {
      const own = innerControls(main)[0];

      if (own) {
        event.preventDefault();
        own.focus();
      }
    }
  } // Alt+↑/↓ (C106 (6)): the row moves one place within its block (the pinned
  // or the rest), keeps the focus, and its place is said: «Срок: 3 из 8».


  async moveRow(main, step) {
    const id = main.dataset.sfSetting;
    const option = main.dataset.sfOption;
    const item = (0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.findItem)(this.shownItems(), id);
    const value = item && (0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.movedField)(item, option, step);
    if (!value) return;
    await this.commitArrangement(id, value);
    await this.whenRendered?.();
    this.afterMove(id, option);
  }

  afterMove(id, option) {
    const main = this.rowControl(id, option);
    if (!main) return;
    this.stand(main);
    if (document.activeElement !== main) main.focus({
      preventScroll: false
    });
    const item = (0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.findItem)(this.shownItems(), id);
    const options = !item ? [] : (0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.choiceArranges)(item) ? (0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.choiceOrder)(item) : (0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.itemValue)(item);
    const index = options.findIndex(one => one.id === option) + 1;
    const label = main.querySelector('.sf-settings-row-label')?.textContent ?? '';
    this.announce(this.sfWord('position', {
      vars: {
        text: label,
        index,
        count: options.length
      }
    }));
  } // The panel's live region: emptied first, so the same words are said again.


  announce(words) {
    const live = this.panel?.querySelector('.sf-settings-panel-live');
    if (!live) return;
    live.textContent = '';
    requestAnimationFrame(() => {
      live.textContent = words;
    });
  } // A drag by the handle (C106 (6)): the row follows the pointer within its
  // block; its new place is written when the pointer is let go.


  onPanelPointerDown(event) {
    const handle = event.target?.closest?.('.sf-settings-row-handle');
    if (!handle || !this.panel?.contains(handle) || event.button > 0) return;
    const row = handle.closest('.sf-settings-row');
    const main = row?.querySelector(`:scope > ${ROW}`);
    const list = row?.parentElement;
    if (!main || !list) return;
    event.preventDefault();
    const id = main.dataset.sfSetting;
    const option = main.dataset.sfOption;
    row.classList.add('sf-settings-row--dragging'); // The rows stay where the drawing put them (lit owns their order); the
    // drop line of SF.Sortable shows where the row will land (owner remark
    // VR11-5): one straight 2 px line across the list, .sf-sortable-indicator
    // of sf-sortable's sheet (the cl-sortable relation), never a look of the
    // panel's own -- the row's inset shadow bent at the row's corners.

    let before = undefined;
    askDropLineSheet(this.panel);
    const line = dropLine(this.panel);

    const move = moved => {
      const rows = [...list.querySelectorAll(':scope > .sf-settings-row:not([hidden])')].filter(one => one !== row);
      const over = rows.find(one => {
        const box = one.getBoundingClientRect();
        return moved.clientY < box.top + box.height / 2;
      });
      before = over ? rowKey(over.querySelector(`:scope > ${ROW}`)) : null;
      placeDropLine(line, list, over ?? null, over ? null : rows[rows.length - 1] ?? null);
    };

    const up = async () => {
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', up);
      document.removeEventListener('pointercancel', up);
      row.classList.remove('sf-settings-row--dragging');
      line.remove();
      const item = (0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.findItem)(this.shownItems(), id);
      const value = before === undefined || !item ? null : (0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.placedField)(item, option, before);
      if (!value) return;
      await this.commitArrangement(id, value);
      await this.whenRendered?.();
      this.afterMove(id, option);
    };

    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', up);
    document.addEventListener('pointercancel', up);
  } // ─── the popup panel
  // Opens the panel against the control that opened it: anchored in the top
  // layer, a sheet at the bottom on a phone (C106 (8)); the focus goes to the
  // search, else the first list's stop, else the first control. The request
  // goes first, as sf-menu-context's does (open, cancelable; opened once it
  // is drawn): a listener that prevents it keeps the panel closed. Returns
  // whether the panel is open.


  async openPanel(anchor) {
    if (this._open || !anchor) return false;
    if (!this.sfEmit('open', {}, {
      cancelable: true
    })) return false;
    this._open = {
      anchor,
      sheet: false,
      position: null,
      returnTo: document.activeElement instanceof HTMLElement && document.activeElement !== document.body ? document.activeElement : anchor
    };
    this.requestComponentUpdate('open');
    await this.whenRendered?.();
    const panel = this.panel;
    const owned = this._open;
    if (!panel || !owned) return false;
    askDropLineSheet(panel);
    anchor.setAttribute('aria-expanded', 'true'); // The density of the control that opened it (C22), where the panel draws.

    owned.density = panel.getAttribute('data-sf-density');
    panel.setAttribute('data-sf-density', (0,_core_js_density_js__WEBPACK_IMPORTED_MODULE_5__.densityOf)(anchor) ?? 'normal');

    if (typeof panel.showPopover === 'function') {
      panel.setAttribute('popover', 'manual');
      if (!panel.matches(':popover-open')) panel.showPopover();
    } // The one sheet (owner decision C157 (5)): a swipe down from its handle
    // row closes it, as Escape does.


    owned.unswipe = (0,_core_js_sheet_swipe_js__WEBPACK_IMPORTED_MODULE_10__.swipeToClose)(panel, {
      when: () => owned.sheet && this._open === owned,
      onDismiss: () => this.closePanel({
        reason: 'close'
      })
    });

    const place = sheet => {
      owned.position?.stop();
      owned.position = null;
      owned.sheet = sheet;
      panel.toggleAttribute('data-sf-sheet', sheet);
      if (!sheet) owned.position = position().anchor(anchor, panel, {
        side: 'block-end',
        align: 'start',
        flip: true,
        shift: true,
        fitHeight: true,
        topLayer: false
      });
    };

    place(onPhone());

    owned.onResize = () => {
      if (this._open === owned && onPhone() !== owned.sheet) place(onPhone());
    };

    window.addEventListener('resize', owned.onResize);
    (0,_core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_7__.holdOpenSurfaceMark)(this, true, {
      root: () => this.panel,
      onEscape: () => {
        this.closePanel({
          reason: 'escape'
        });
        return true;
      },
      onOutsidePress: event => {
        const path = event.composedPath?.() ?? [];
        if (!path.includes(anchor)) this.closePanel({
          restoreFocus: false,
          reason: 'outside'
        });
      },
      // A sheet covers the page, so Tab goes round inside it.
      onTab: event => {
        if (!owned.sheet) return;
        const controls = (0,_core_js_layer_stack_js__WEBPACK_IMPORTED_MODULE_8__.focusablesIn)(panel);
        if (!controls.length) return;
        const first = controls[0];
        const last = controls[controls.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });

    this._scrollbar.mark();

    const field = panel.querySelector('[data-sf-search]');
    const stop = panel.querySelector(`.sf-settings-list:not([hidden]) ${ROW}[tabindex="0"]`);
    (field ?? stop ?? (0,_core_js_layer_stack_js__WEBPACK_IMPORTED_MODULE_8__.focusablesIn)(panel)[0])?.focus({
      preventScroll: true
    });
    this.sfEmit('opened', {});
    return true;
  } // Closes a popup panel: what it held unapplied is dropped, the search is
  // cleared, the focus goes back to the trigger (not after a press outside).
  // As sf-menu-context's close: reason is escape, outside, close (the close
  // button, the trigger again) or api (Apply, Tab out, a script); a listener
  // that prevents close keeps the panel open, unsaved says a draft of
  // apply="button" moved something; closed follows. `ask: false` closes
  // without asking (the element is leaving the page).


  closePanel({
    restoreFocus = true,
    reason = 'api',
    ask = true
  } = {}) {
    const owned = this._open;
    if (!owned) return false;
    if (ask && !this.sfEmit('close', {
      reason,
      unsaved: this.draftMoved()
    }, {
      cancelable: true
    })) return false;
    this._open = null;
    owned.position?.stop();
    window.removeEventListener('resize', owned.onResize);
    (0,_core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_7__.holdOpenSurfaceMark)(this, false);
    const panel = this.panel;

    if (panel) {
      owned.unswipe?.();
      if (panel.matches?.(':popover-open')) panel.hidePopover();
      panel.removeAttribute('popover');
      panel.removeAttribute('data-sf-sheet');
      if (owned.density === null || owned.density === undefined) panel.removeAttribute('data-sf-density');else panel.setAttribute('data-sf-density', owned.density);
    }

    owned.anchor.setAttribute('aria-expanded', 'false');
    this._draft = null;
    this._query = '';
    this.requestComponentUpdate('open');
    if (restoreFocus) (owned.returnTo?.isConnected ? owned.returnTo : owned.anchor)?.focus?.({
      preventScroll: true
    });
    this.sfEmit('closed', {
      reason
    });
    return true;
  } // ─── a panel in a page's window (GB21, Docara K-13)

  /** The page's window this panel stands in (the Framework window or side sheet, a dialog element), when it is not a popup; else null. */


  dialogShell() {
    if (!this.isPanel || this.popup) return null;
    return shellHost(this.parentElement);
  } // The window whose close the panel draws: one it stands in that draws none
  // of its own.


  shellCloses() {
    const shell = this.dialogShell();
    return shell && !shellDrawsClose(shell) ? shell : null;
  } // The close button of a panel in a page's window: close is asked (reason
  // close, cancellable, unsaved as a popup's), then the window is closed by
  // its own action -- the Framework window's and side sheet's close({reason: 'close'}),
  // which ask the page in their turn, or a <dialog>'s close(); closed follows
  // once the window agreed. What a draft of apply="button" held is dropped.


  closeShell() {
    const shell = this.dialogShell();
    if (!shell) return false;
    if (!this.sfEmit('close', {
      reason: 'close',
      unsaved: this.draftMoved()
    }, {
      cancelable: true
    })) return false;
    let answer;

    try {
      if (shell.localName === 'dialog') {
        shell.close();
        answer = {
          outcome: 'applied'
        };
      } else {
        answer = shell.close?.({
          reason: 'close'
        });
      }
    } catch {
      answer = {
        outcome: 'refused'
      };
    }

    Promise.resolve(answer).then(result => {
      if (result && typeof result === 'object' && result.outcome && result.outcome !== 'applied') return;
      this._draft = null;
      this._query = '';
      this.requestComponentUpdate('open');
      this.sfEmit('closed', {
        reason: 'close'
      });
    });
    return true;
  } // Whether the draft of apply="button" holds a value the items do not.


  draftMoved() {
    if (!this._draft) return false;
    const now = (0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.valueMap)(this.items);
    const order = (0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.orderMap)(this.items);
    return Object.entries((0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.valueMap)(this._draft)).some(([id, value]) => !same(now[id], value)) || Object.entries((0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.orderMap)(this._draft)).some(([id, value]) => !same(order[id], value));
  } // show(id) in the panel: a popup opens, the tab that holds the setting is
  // chosen, the focus goes to its row.


  async showInPanel(id) {
    if (this.popup && !this._open) {
      const anchor = this.anchor();
      if (!anchor) return {
        outcome: 'unavailable',
        reason: 'no-trigger'
      };
      if (!(await this.openPanel(anchor))) return {
        outcome: 'cancelled'
      };
    }

    const layout = this.deviceLayout;
    const groups = (0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.panelGroups)(this.shownItems(), {
      layout
    });
    const at = groups.findIndex(group => (0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.findItem)(group.items, id));
    if (at >= 0 && (0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.panelLayout)(this.shownItems(), {
      search: Boolean(this.search),
      layout
    }) === 'tabs') this.chooseGroup(at);
    await this.whenRendered?.();
    const control = this.rowControl(id) ?? this.panel?.querySelector(`[data-sf-setting="${CSS.escape(id)}"]`);
    if (!control) return {
      outcome: 'unavailable',
      reason: 'no-panel'
    };
    if (control.matches(ROW)) this.stand(control);
    control.focus({
      preventScroll: false
    });
    return {
      outcome: 'applied'
    };
  }
  /** The tab the panel shows (its groups as tabs), 0 when they are sections or it is not a panel. */


  get tab() {
    const layout = this.deviceLayout;
    if (!this.isPanel || (0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.panelLayout)(this.shownItems(), {
      search: Boolean(this.search),
      layout
    }) !== 'tabs') return 0;
    return Math.min(this._tab, Math.max(0, (0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.panelGroups)(this.shownItems(), {
      layout
    }).length - 1));
  }
  /**
   * Opens a popup panel against its first trigger, on a tab when one is
   * given (its index): open(), open(1) or open({tab: 1}). Refused for
   * another look or an inline panel; unavailable without a trigger;
   * cancelled when the page cancels open.
   */


  async open(given) {
    const tab = given && typeof given === 'object' ? given.tab : given;
    if (!this.isPanel || !this.popup) return {
      outcome: 'refused',
      reason: 'not-popup'
    };
    await this.whenRendered?.();
    if (Number.isInteger(tab) && tab >= 0 && tab < (0,_js_settings__WEBPACK_IMPORTED_MODULE_13__.panelGroups)(this.shownItems(), {
      layout: this.deviceLayout
    }).length) this.chooseGroup(tab);

    if (this._open) {
      await this.whenRendered?.();
      return {
        outcome: 'applied'
      };
    }

    const anchor = this.anchor();
    if (!anchor) return {
      outcome: 'unavailable',
      reason: 'no-trigger'
    };
    return (await this.openPanel(anchor)) ? {
      outcome: 'applied'
    } : {
      outcome: 'cancelled'
    };
  }
  /** Closes an open popup panel, as its close button does (close, cancellable; reason api). */


  close() {
    if (!this._open) return {
      outcome: 'refused',
      reason: 'not-open'
    };
    return this.closePanel({
      reason: 'api'
    }) ? {
      outcome: 'applied'
    } : {
      outcome: 'cancelled'
    };
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
/* harmony export */   APPLY: () => (/* binding */ APPLY),
/* harmony export */   COLOR_OPTIONS: () => (/* binding */ COLOR_OPTIONS),
/* harmony export */   DEFAULT_SIZE: () => (/* binding */ DEFAULT_SIZE),
/* harmony export */   FORMER_LOOKS: () => (/* binding */ FORMER_LOOKS),
/* harmony export */   HUES: () => (/* binding */ HUES),
/* harmony export */   LOOKS: () => (/* binding */ LOOKS),
/* harmony export */   OWN_COLOR: () => (/* binding */ OWN_COLOR),
/* harmony export */   SIZES: () => (/* binding */ SIZES),
/* harmony export */   TYPES: () => (/* binding */ TYPES),
/* harmony export */   applyCount: () => (/* binding */ applyCount),
/* harmony export */   choiceArranges: () => (/* binding */ choiceArranges),
/* harmony export */   choiceOptions: () => (/* binding */ choiceOptions),
/* harmony export */   choiceOrder: () => (/* binding */ choiceOrder),
/* harmony export */   colorCode: () => (/* binding */ colorCode),
/* harmony export */   colorFill: () => (/* binding */ colorFill),
/* harmony export */   entriesFor: () => (/* binding */ entriesFor),
/* harmony export */   fieldOptions: () => (/* binding */ fieldOptions),
/* harmony export */   findItem: () => (/* binding */ findItem),
/* harmony export */   folded: () => (/* binding */ folded),
/* harmony export */   holdsValue: () => (/* binding */ holdsValue),
/* harmony export */   itemValue: () => (/* binding */ itemValue),
/* harmony export */   itemsFor: () => (/* binding */ itemsFor),
/* harmony export */   lookOf: () => (/* binding */ lookOf),
/* harmony export */   matches: () => (/* binding */ matches),
/* harmony export */   movedField: () => (/* binding */ movedField),
/* harmony export */   optionMoves: () => (/* binding */ optionMoves),
/* harmony export */   optionPhones: () => (/* binding */ optionPhones),
/* harmony export */   optionPins: () => (/* binding */ optionPins),
/* harmony export */   orderMap: () => (/* binding */ orderMap),
/* harmony export */   orderPatch: () => (/* binding */ orderPatch),
/* harmony export */   panelGroups: () => (/* binding */ panelGroups),
/* harmony export */   panelLayout: () => (/* binding */ panelLayout),
/* harmony export */   placedField: () => (/* binding */ placedField),
/* harmony export */   rememberedKey: () => (/* binding */ rememberedKey),
/* harmony export */   rememberedValues: () => (/* binding */ rememberedValues),
/* harmony export */   rewriteValues: () => (/* binding */ rewriteValues),
/* harmony export */   sameValue: () => (/* binding */ sameValue),
/* harmony export */   toggledField: () => (/* binding */ toggledField),
/* harmony export */   valueMap: () => (/* binding */ valueMap),
/* harmony export */   valuePatch: () => (/* binding */ valuePatch)
/* harmony export */ });
/* harmony import */ var _core_js_device_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("cbcfcde04d12");
// sf-settings' data: the items a page gives, their values, and the entries of
// sf-menu-context they become in each look. Pure functions, no DOM, so the
// contract test reads them without a browser.
//
// An item is a setting or what stands between settings:
//
//   {id, type: 'switch', text, value: true}                         a boolean
//   {id, type: 'choice', text, value: 'dark', options: [{id, text}]} one of a few
//   {id, type: 'range', text, value: 100, min, max, step, unit}      a number
//   {id, type: 'color', text, value: 'blue', options?, custom?}       a colour
//   {type: 'heading', text}, {type: 'separator'}
//   {type: 'group', text, items: [...]}                              a titled block
//   {id, type: 'fields', text, options: [{id, text, checked, pinned}],
//    sortable, pinnable, phoneSwitch}                                a list of many
//
// Any item, and an option of a fields list or a choice, may carry
// `devices: ['phone']` or `devices: ['desktop']` (study S-A, q-7097831f9f):
// it is shown only in that layout and hidden -- not disabled -- in the other;
// its value is kept. The layout is core's word (core/js/device.js): 'phone'
// below 600 px of the element's place. A fields list with `phoneSwitch: true`
// draws a «На телефоне» switch on each field (option `phone`), the one column
// list that decides both the desktop and the phone (S-A (2), VL-82); an
// option with `phoneSwitch: false` has none (a table's system column).
//
// The value lives in the item and nowhere else. A fields list (the panel look,
// owner decision C106) keeps its value in its options: their order, which are
// checked and which are pinned; its value reads them as [{id, checked, pinned}]
// in order, the pinned ones first.

const LOOKS = ['drill', 'rows', 'panel']; // The tiles look left (owner decision C176 (5), 2026-11-14): its switches are
// rows. tiles stays a dated former name of drill until 2027-01-01
// (component.json aliases); a page that still writes it gets the drill look.

const FORMER_LOOKS = Object.freeze({
  tiles: 'drill'
});
/** The look a written value draws: a look, a former name's look, else drill. */

const lookOf = value => LOOKS.includes(value) ? value : FORMER_LOOKS[value] ?? 'drill';
const SIZES = ['1/2', '1']; // The size a page that writes none gets (C176, defect SM-1; owner decision
// C22): the ordinary step; compactness is the density of the region.

const DEFAULT_SIZE = '1';
const APPLY = ['instant', 'button'];
const TYPES = ['switch', 'choice', 'range', 'color', 'heading', 'separator', 'group', 'fields'];
const VALUE_TYPES = new Set(['switch', 'choice', 'range', 'color', 'fields']); // ─── the colour row (owner decision C85) ─────────────────────────────────
//
// A colour setting -- a site's or a reader's colour in a settings menu, beside
// the theme -- is a row with the current colour as a circle in its lead; it
// opens a level of palette hues, each a circle and its word, and, unless
// custom is false, «Свой цвет…», which opens sf-input-color's window on «Своё».
// The value is what sf-input-color stores (C83): a palette hue by its name
// (blue), the same in every language, painted 50 light / 70 dark, or an own
// colour as its code (#rrggbb).
// The sixteen hues of the static palette (C17), the names a colour value may
// take (sf-input-color's PALETTE).

const HUES = Object.freeze(['red', 'orange', 'amber', 'yellow', 'lime', 'green', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'pink', 'brown', 'gray']); // The level a colour row opens when its item names no options: the ten hues
// of the accepted menu (prototype theme-generator-study #practice-menu).

const COLOR_OPTIONS = Object.freeze(['red', 'orange', 'amber', 'green', 'teal', 'sky', 'blue', 'violet', 'pink', 'gray']); // The id of the «Свой цвет…» option in the menu's entries.

const OWN_COLOR = '#own';
const SHORT_HEX = /^#?([0-9a-f])([0-9a-f])([0-9a-f])$/iu;
const LONG_HEX = /^#?([0-9a-f]{6})$/iu;
/** An own colour's code, lowercase #rrggbb; '' for anything else. */

function colorCode(value) {
  const text = String(value ?? '').trim();
  const short = SHORT_HEX.exec(text);
  if (short) return `#${short[1]}${short[1]}${short[2]}${short[2]}${short[3]}${short[3]}`.toLowerCase();
  const long = LONG_HEX.exec(text);
  return long ? `#${long[1].toLowerCase()}` : '';
}
/** The CSS colour a colour value paints: a hue's tone for the theme (50 light, 70 dark), or the code. */

const colorFill = value => HUES.includes(value) ? `light-dark(var(--sf-${value}-50), var(--sf-${value}-70))` : colorCode(value); // The hues a colour row offers: its options (names, or {id, text}) that are
// palette hues, else the default ten.

function colorOptions(item) {
  const given = Array.isArray(item?.options) ? item.options : null;
  const list = (given ?? COLOR_OPTIONS).map(option => typeof option === 'string' ? {
    id: option
  } : option).filter(option => option && HUES.includes(option.id));
  return list;
}

const allowsOwn = item => item?.custom !== false;

const isItem = item => Boolean(item) && typeof item === 'object' && TYPES.includes(item.type);
/**
 * The items shown in a layout ('phone' | 'desktop'): an item, a group's item
 * and an option of a fields list or a choice scoped by `devices` to the other
 * layout are left out (core's itemsInLayout). Without a layout, all of them.
 */


function itemsFor(items, layout) {
  if (!layout) return Array.isArray(items) ? items : [];
  return (0,_core_js_device_js__WEBPACK_IMPORTED_MODULE_0__.itemsInLayout)(items, layout, {
    options: true
  });
}
/** Whether a fields list's option has a «На телефоне» switch: the list draws them and the option does not refuse. */

const optionPhones = (item, option) => item?.type === 'fields' && Boolean(item?.phoneSwitch) && option?.phoneSwitch !== false;

const optionsOf = item => Array.isArray(item?.options) ? item.options.filter(option => option && typeof option === 'object' && option.id !== undefined && option.id !== null) : [];
/**
 * A fields list's options in the order they stand, the pinned ones first (a
 * pinned field stays on top, C106 (6)); the order among the pinned and among
 * the rest is the order given.
 */


function fieldOptions(item) {
  const options = optionsOf(item);
  return [...options.filter(option => option.pinned), ...options.filter(option => !option.pinned)];
} // What a fields list is given as its value: the ids to check, in the order
// they stand ([id, ...]), or the options themselves ([{id, checked, pinned}])
// in a new order -- the ones left out keep their state and follow. An id the
// list does not hold makes the value invalid.

function fieldsPatch(item, value) {
  if (!Array.isArray(value)) return null;
  const options = optionsOf(item);
  const byId = new Map(options.map(option => [option.id, option]));

  if (value.every(one => typeof one === 'string')) {
    if (!value.every(id => byId.has(id))) return null;
    const on = new Set(value);
    return {
      options: fieldOptions({
        options: options.map(option => ({ ...option,
          checked: on.has(option.id)
        }))
      })
    };
  }

  if (!value.every(one => one && typeof one === 'object' && byId.has(one.id))) return null;
  const listed = new Set(value.map(one => one.id));
  const ordered = value.map(one => {
    const option = { ...byId.get(one.id)
    };
    if (typeof one.checked === 'boolean') option.checked = one.checked;
    if (typeof one.pinned === 'boolean') option.pinned = one.pinned;
    if (typeof one.phone === 'boolean') option.phone = one.phone;
    return option;
  });
  return {
    options: fieldOptions({
      options: [...ordered, ...options.filter(option => !listed.has(option.id))]
    })
  };
} // A fields list's option as its value reads it: {id, checked, pinned}, and
// phone when the list draws the «На телефоне» switches.


const fieldValue = (item, option) => item?.phoneSwitch ? {
  id: option.id,
  checked: Boolean(option.checked),
  pinned: Boolean(option.pinned),
  phone: Boolean(option.phone)
} : {
  id: option.id,
  checked: Boolean(option.checked),
  pinned: Boolean(option.pinned)
};
/** Whether two values are the same: by identity, or for a fields list by what it holds. */


function sameValue(a, b) {
  if (a === b || Number.isNaN(a) && Number.isNaN(b)) return true;
  if (Array.isArray(a) && Array.isArray(b)) return JSON.stringify(a) === JSON.stringify(b);
  return false;
}
/** Whether an item holds a value (a switch, a choice, a range or a fields list with an id). */

const holdsValue = item => isItem(item) && VALUE_TYPES.has(item.type) && typeof item.id === 'string' && item.id !== '';
/**
 * An item's value: a boolean for a switch, a number for a range, the chosen
 * option's id for a choice (its value, else the option marked checked, else
 * null).
 */

function itemValue(item) {
  if (item?.type === 'fields') return fieldOptions(item).map(option => fieldValue(item, option));
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

  if (item?.type === 'color') return colorPatch(item, item.value)?.value ?? null;
  return null;
} // A colour row takes a hue it offers, or a code while it allows an own colour.

function colorPatch(item, value) {
  if (typeof value !== 'string') return null;
  if (colorOptions(item).some(option => option.id === value)) return {
    value
  };
  const code = allowsOwn(item) ? colorCode(value) : '';
  return code ? {
    value: code
  } : null;
}
/**
 * What to write into an item to give it a value; null when the item cannot
 * hold that value (a choice without such an option, a range given no number).
 */


function valuePatch(item, value) {
  if (item?.type === 'fields') return fieldsPatch(item, value);
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
  if (item?.type === 'color') return colorPatch(item, value);
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

const own = (item, keys) => Object.fromEntries(keys.filter(key => item[key] !== undefined && item[key] !== null).map(key => [key, item[key]])); // A colour row as the menu's choice: the current colour as the row's circle,
// the hues as options with their circles and words, and «Свой цвет…» last
// (OWN_COLOR) -- checked, with its circle and code, while the value is one.


function colorEntry(item, base, look, word) {
  const value = itemValue(item);
  const options = colorOptions(item).map(option => ({
    id: option.id,
    text: option.text ?? word(`hue-${option.id}`),
    swatch: colorFill(option.id),
    checked: option.id === value
  }));
  const code = colorCode(value);

  if (allowsOwn(item)) {
    options.push(code ? {
      id: OWN_COLOR,
      text: word('own-color-value', {
        value: code
      }),
      swatch: code,
      checked: true
    } : {
      id: OWN_COLOR,
      text: word('own-color'),
      icon: 'colorize',
      checked: false
    });
  }

  return { ...base,
    type: 'choice',
    ...(look === 'drill' ? {
      view: 'drill'
    } : {}),
    ...(value ? {
      swatch: colorFill(value)
    } : {}),
    options
  };
} // The words a colour row needs when the element gives none (the contract
// test, a server printing entries): the hue's name and the own colour's.


const plainWord = (key, vars = {}) => {
  if (key === 'own-color') return 'Own colour…';
  if (key === 'own-color-value') return `Own: ${vars.value ?? ''}`;
  return key.replace(/^hue-/u, '');
}; // One setting as a menu entry. A choice's value becomes its options' checked
// marks, the way the menu reads it; drill opens its options in the panel, and
// so does a choice of the rows look whose options did not fit beside its name
// (owner decision C176 (3)): the row becomes a drill row by itself, the value
// under the name, the options a level deeper.


function settingEntry(item, look, word = plainWord, folded = NONE) {
  if (look === 'rows' && folded.has(item.id) && (item.type === 'choice' || item.type === 'color')) look = 'drill';
  const base = { ...own(item, ['id', 'text', 'caption', 'icon', 'keywords']),
    type: item.type
  };
  if (item.disabled) base.disabled = true;
  if (item.type === 'color') return colorEntry(item, base, look, word);
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
}

const NONE = new Set(); // The entries of a list of items: a group is its title (a heading) and its
// rows; an item of no known type is left out.

function entriesOf(items, look, word, folded = NONE) {
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
      const rows = entriesOf(item.items, look, word, folded);
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
    } else if (holdsValue(item) && item.type !== 'fields') {
      // A fields list is the panel look's alone: a menu has no row for it.
      out.push(settingEntry(item, look, word, folded));
    }
  } // A separator does not open or close the list, and two do not stand together.


  return out.filter((entry, index, list) => entry.type !== 'separator' || index > 0 && index < list.length - 1 && list[index + 1].type !== 'separator');
}
/**
 * The menu's entries for a look:
 *   drill  every choice opens its options in the panel (view: drill), the
 *          value under the name; the menu is submenu="drill";
 *   rows   the name at the start, the control at the end: quiet options, a
 *          switch, a slider; a choice named in `folded` -- its options did
 *          not fit beside its name -- is a drill row instead (C176 (3)).
 * A former look (tiles) draws the look it became (lookOf). A switch is a row
 * in every look (C176 (5)); `tile` on an item is no longer read.
 */


function entriesFor(items, look = 'drill', {
  word = plainWord,
  folded = NONE,
  layout = ''
} = {}) {
  return entriesOf(itemsFor(items, layout), lookOf(look), word, folded instanceof Set ? folded : new Set(folded ?? []));
} // ─── the panel look (owner decision C106) ─────────────────────────────────

/**
 * The panel's groups: each top-level group, and the settings between groups
 * gathered into an untitled one, in the order they stand. A heading or a
 * separator stays in the group it stands in.
 */

function panelGroups(items, {
  layout = ''
} = {}) {
  const groups = [];
  let loose = null;

  for (const item of itemsFor(items, layout)) {
    if (!isItem(item)) continue;

    if (item.type === 'group') {
      loose = null;
      const inner = (Array.isArray(item.items) ? item.items : []).filter(isItem);
      if (inner.length) groups.push({
        text: item.text ?? '',
        items: inner
      });
      continue;
    }

    if (!loose) {
      loose = {
        text: '',
        items: []
      };
      groups.push(loose);
    }

    loose.items.push(item);
  }

  return groups.filter(group => group.items.some(item => holdsValue(item)));
}
/**
 * How the panel shows its groups (C106 (5)): sections in one scroll by
 * default; tabs when the panel has a search and a group holds its own long
 * list (a fields list) -- the list and its search take a tab of their own.
 * A single group is never a tab.
 */

function panelLayout(items, {
  search = false,
  layout = ''
} = {}) {
  const groups = panelGroups(items, {
    layout
  });
  if (!search || groups.length < 2) return 'sections';
  return groups.some(group => group.items.some(item => item.type === 'fields')) ? 'tabs' : 'sections';
} // A search's words: no case, ё as е.
// c282-allow: input parsing (ё is searched as е)

const folded = value => String(value ?? '').toLocaleLowerCase().replace(/ё/gu, 'е').trim();
/** Whether a row's words hold the query (no case, ё as е). An empty query holds every row. */

function matches(query, ...words) {
  const asked = folded(query);
  if (!asked) return true;
  return words.flat().some(word => folded(word).includes(asked));
}
/**
 * What «Применить (N)» counts in a panel applied by a button (a filter, C106
 * (4)): the conditions it will hold -- the checked fields of every list and
 * the switches that are on.
 */

function applyCount(items) {
  let count = 0;

  for (const item of Array.isArray(items) ? items : []) {
    if (item?.type === 'group') count += applyCount(item.items);else if (holdsValue(item) && item.type === 'fields') count += optionsOf(item).filter(option => option.checked).length;else if (holdsValue(item) && item.type === 'switch' && itemValue(item)) count += 1;
  }

  return count;
} // ─── order and pins: a fields list, and a choice that orders (C106 (3), (6))
//
// A choice of one -- a filter's saved templates -- may order and pin its
// options as a fields list does: {id, type: 'choice', sortable, pinnable,
// options: [{id, text, pinned}]}. Its value stays the chosen option's id; its
// order is its options' order, the pinned first, read as [{id, pinned}]
// (choiceOrder) and given back by orderPatch. An option may say sortable:
// false or pinnable: false -- a table's system column: it has no handle or no
// pin, and it keeps its place while the others move round it.

/** Whether a list's option moves: the list orders and the option does not refuse. */

const optionMoves = (item, option) => Boolean(item?.sortable) && option?.sortable !== false;
/** Whether a list's option pins: the list pins and the option does not refuse. */

const optionPins = (item, option) => Boolean(item?.pinnable) && option?.pinnable !== false;
/** Whether a choice orders or pins its options (then its order is reported). */

const choiceArranges = item => item?.type === 'choice' && Boolean(item.sortable || item.pinnable);
/** A choice's options in the order they stand, the pinned first (as a fields list's). */

const choiceOptions = item => fieldOptions(item);
/** A choice's order: [{id, pinned}] as its options stand, the pinned first. */

function choiceOrder(item) {
  return choiceOptions(item).map(option => ({
    id: option.id,
    pinned: Boolean(option.pinned)
  }));
}
/**
 * What to write into a choice to give it an order ([{id, pinned}] or ids):
 * the options listed come first in that order, the ones left out follow;
 * null when an id is not the choice's. The chosen option stays chosen.
 */

function orderPatch(item, order) {
  if (item?.type !== 'choice' || !Array.isArray(order)) return null;
  const options = optionsOf(item);
  const byId = new Map(options.map(option => [option.id, option]));
  const given = order.map(one => typeof one === 'string' ? {
    id: one
  } : one);
  if (!given.every(one => one && typeof one === 'object' && byId.has(one.id))) return null;
  const listed = new Set(given.map(one => one.id));
  const ordered = given.map(one => {
    const option = { ...byId.get(one.id)
    };
    if (typeof one.pinned === 'boolean') option.pinned = one.pinned;
    return option;
  });
  return {
    options: fieldOptions({
      options: [...ordered, ...options.filter(option => !listed.has(option.id))]
    })
  };
}
/** Every ordering choice's order by its id, at the depth it sits. */

function orderMap(items, into = {}) {
  for (const item of Array.isArray(items) ? items : []) {
    if (holdsValue(item) && choiceArranges(item)) into[item.id] = choiceOrder(item);
    if (item?.type === 'group') orderMap(item.items, into);
  }

  return into;
} // A list's arrangement for its options in a new order: a fields list's value
// ([{id, checked, pinned}]), a choice's order ([{id, pinned}]).

function arranged(item, options) {
  return item?.type === 'choice' ? options.map(option => ({
    id: option.id,
    pinned: Boolean(option.pinned)
  })) : options.map(option => fieldValue(item, option));
} // The options again with the ones that do not move back at the places they
// stood (`before`), the moving ones in the order `moved` gives them.


function keepFixed(item, before, moved) {
  const loose = moved.filter(option => optionMoves(item, option));
  let at = 0;
  return before.map(option => optionMoves(item, option) ? loose[at++] : option);
}
/**
 * A list with one option moved by `step` places within its own block (the
 * pinned or the rest: a pinned option stays above every other), passing the
 * options that do not move, which keep their places; null when it cannot
 * move that way. A fields list's value or a choice's order.
 */


function movedField(item, optionId, step) {
  const options = fieldOptions(item);
  const option = options.find(one => one.id === optionId);
  if (!option || !optionMoves(item, option)) return null;
  const loose = options.filter(one => optionMoves(item, one));
  const at = loose.indexOf(option);
  const to = at + step;
  if (to < 0 || to >= loose.length || Boolean(loose[to].pinned) !== Boolean(option.pinned)) return null;
  const list = [...loose];
  list.splice(at, 1);
  list.splice(to, 0, option);
  return arranged(item, keepFixed(item, options, list));
}
/** A list with one option put before another of the same block (a drag), or null. */

function placedField(item, optionId, beforeId) {
  const options = fieldOptions(item);
  const moving = options.find(option => option.id === optionId);
  if (!moving || optionId === beforeId || !optionMoves(item, moving)) return null;
  const rest = options.filter(option => option.id !== optionId);
  let at = beforeId === null ? rest.length : rest.findIndex(option => option.id === beforeId);
  if (at < 0) return null; // A pinned option stays among the pinned, the rest below them.

  const pinned = rest.filter(option => option.pinned).length;
  at = moving.pinned ? Math.min(at, pinned) : Math.max(at, pinned);
  rest.splice(at, 0, moving);
  const value = arranged(item, keepFixed(item, options, rest));
  return sameValue(value, arranged(item, options)) ? null : value;
}
/**
 * A list with one option checked or pinned the other way, or null: a fields
 * list's value, a choice's order (pinned only). An option that does not pin
 * is not pinned or unpinned.
 */

function toggledField(item, optionId, key = 'checked') {
  const options = fieldOptions(item);
  const option = options.find(one => one.id === optionId);
  if (!option || key === 'checked' && (option.disabled || item?.type !== 'fields')) return null;
  if (key === 'pinned' && !optionPins(item, option)) return null;
  if (key === 'phone' && (option.disabled || !optionPhones(item, option))) return null;
  return arranged(item, options.map(one => one.id === optionId ? { ...one,
    [key]: !one[key]
  } : one));
} // ─── remembered values before the first paint (GB21, Docara K-13) ─────────
//
// remember="<name>" keeps the values as one SF.Preferences value under the
// key sf-settings/<name>; the browser's copy (core preferences.js, a public
// format) is sf-pref:sf-settings/<name>, the JSON of {<id>: <value>} -- a
// switch's boolean, a choice's option id, a range's number, a colour's hue
// name or #rrggbb, a fields list's [{id, checked, pinned}] -- written whole
// after every change. A site reads it in <head> with core's PREPAINT_READER,
// sfPreference('sf-settings/<name>'), before the Framework has run and before
// the first paint, and applies what the values mean (a reader's text size, a
// theme). The docs print the reader word for word
// (tests/settings-window-c438.contract.test.mjs).

/** The SF.Preferences key a remember name keeps the values under. */

const rememberedKey = name => {
  const text = String(name ?? '').trim();
  return text ? `sf-settings/${text}` : '';
};
/**
 * The values a remember name keeps in a storage (an object with getItem: the
 * browser's copy SF.Preferences writes), {id: value}, or null: nothing kept,
 * storage refused, or not an object. What the head reader answers for the
 * name, as a module function.
 */

function rememberedValues(name, storage) {
  const key = rememberedKey(name);
  if (!key || typeof storage?.getItem !== 'function') return null;

  try {
    const value = JSON.parse(storage.getItem(`sf-pref:${key}`) ?? 'null');
    return value && typeof value === 'object' && !Array.isArray(value) ? value : null;
  } catch {
    return null;
  }
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
/* harmony import */ var _panel_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("04a48c16a107");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, _panel_js__WEBPACK_IMPORTED_MODULE_1__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, _panel_js__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);

 // sf-settings' markup: sf-menu-context with the items as its entries, and,
// in a popup, the page's trigger beside it. In the drill and rows looks
// the element draws nothing of its own; the panel look draws its panel
// (templates/panel.js) with the element's sheet.
//
// - inline (no trigger): the menu stands open in the page's flow;
// - popup (a trigger in the trigger slot, or one named by for): the trigger as
//   the page wrote it, and the menu hidden until the trigger opens it.
//
// The panel's width is fixed for every look (the drilling menu's own width,
// --sf-context-menu-inline-size; by default the menu's ceiling of the popup
// widths, 18rem, 16rem in compact density: owner decision C32, addendum
// 2026-11-09): it is given to the menu as its lower and upper bound, so a
// long name wraps and a value ends in an ellipsis rather than the panel
// growing.
//
// The menu drills in both looks: the drill look's choices open a level, and so
// does a rows-look choice whose options did not fit beside its name (C176
// (3)); a drilling popup is the one sheet on a phone (C157 (5), SM-3). The
// look's rows carry no submenus of their own, so nothing flies out.
//
// The menu's value events stay inside (stopPropagation): the page hears
// sf-settings-change, -changed and -reset, never the menu's.

const stop = event => event.stopPropagation();

const WIDTH = 'var(--sf-context-menu-inline-size, var(--sf-popup-menu-max-width))';
const PANEL = `--sf-context-menu--min-inline-size: ${WIDTH}; --sf-context-menu--max-inline-size: ${WIDTH}`;

function renderMenu(context) {
  const {
    component
  } = context;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-menu-context
      class=${['sf-settings', context.rootClass].filter(Boolean).join(' ')}
      ?popup=${context.popup}
      submenu="drill"
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


const frame = parts => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-settings-parts" style="display: contents">${parts}</div>`; // The colour window of the colour rows (C85): sf-input-color without its
// palette (the menu's level is the palette) and without a box in the page --
// a holder of no size, so only its window is seen; the window stands in the
// top layer against the trigger, where no box of the page clips it. The
// holder is inert while the window is closed, so its hidden field is never a
// tab stop; _openOwnColor lifts that for as long as the window is open.


function renderColor(context) {
  const {
    component
  } = context;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-settings-color" inert style="position: absolute; inline-size: 0; block-size: 0; overflow: hidden">
    <sf-input-color palette="false"
        @input=${event => event.stopPropagation()}
        @change=${event => component._onColorPicked(event)}></sf-input-color>
  </span>`;
} // The panel look (owner decision C106) is this element's own markup
// (templates/panel.js), not a menu: its role is a dialog over the page and a
// group in the page's flow, and the action menu keeps the actions.


function renderSettingsTemplate(context) {
  const trigger = context.popup && context.hasSlot('trigger') ? context.slot('trigger') : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return frame((0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${trigger}${context.look === 'panel' ? (0,_panel_js__WEBPACK_IMPORTED_MODULE_1__.renderPanel)(context) : renderMenu(context)}${context.hasColor ? renderColor(context) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}`);
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "04a48c16a107"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderPanel: () => (/* binding */ renderPanel)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("efa66f8927d1");
/* harmony import */ var _settings_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("bb67a9697f33");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__);


 // sf-settings' panel look (owner decision C106, 2026-11-12): the settings of a
// list's view -- its fields, their order, the density -- in a panel of its own,
// not in the action menu. The panel is this element's markup and its sheet
// (scss/_smart__settings.scss); the other looks stay sf-menu-context's.
//
//   head     the title, or the groups as tabs; the close button of a popup
//            and of a panel in a page's window that draws none (GB21)
//   search   the setting search: a header over the rows (C06), «from ten rows»
//   body     the groups as sections in one scroll, or the chosen tab's rows;
//            the only part that scrolls (the scroll-area inset rule)
//   footer   apply="instant": one «Сбросить»; apply="button" (a filter):
//            «Применить (N)» then «Сбросить» (FF-5)
//
// A row is a plate (.sf-settings-row) with the control a person works
// (.sf-settings-row-main, the role) and, in a fields list that pins, the pin
// button beside it. A selected row is the theme's light fill with a check in
// one column at the inline end (C106 (2)); a choice of one is the fill alone
// (C106 (3)); the handle stands at the row's start (C106 (6)). The rows of one
// list are one Tab stop with the arrows inside (DP-4); index.js keeps the
// roving tabindex and the keys.

const icon = (name, className) => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class=${className} aria-hidden="true"><i class="sf-icon">${name}</i></span>`; // What a row shows after its text: the check of a checked row (a fields list,
// C106 (2)), the switch of a switch, nothing for a choice (the fill alone).


function mark(kind, checked) {
  if (kind === 'switch') {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-switch class="sf-settings-row-switch" size="1/2" ?checked=${checked} inert aria-hidden="true"></sf-switch>`;
  }

  if (kind === 'field') return icon('check', 'sf-settings-row-check');
  return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
} // One row. `row` is {key, kind: field|switch|option, role, checked, text,
// caption, disabled, hidden, current, setting, option, handle, pin, pinned,
// sorts, pins}. sorts and pins say the list orders or pins; handle and pin
// that this row does. A row that does not (an option with sortable: false or
// pinnable: false, a table's system column) keeps the handle's and the pin's
// places empty, so its text stands where its neighbours' does (C105 H2: a row
// without an icon among rows with icons keeps the icon's place).


function renderRow(row, context) {
  const {
    words,
    size
  } = context;
  const main = (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-settings-row-main" role=${row.role}
            aria-checked=${row.checked ? 'true' : 'false'}
            aria-disabled=${row.disabled ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            tabindex=${row.current ? '0' : '-1'}
            data-sf-setting=${row.setting}
            data-sf-option=${row.option ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
            ${row.handle ? icon('drag_indicator', 'sf-settings-row-handle') : row.sorts ? icon('drag_indicator', 'sf-settings-row-handle-place') : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            <span class="sf-settings-row-text">
                <span class="sf-settings-row-label">${row.text}</span>
                ${row.caption ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-settings-row-caption">${row.caption}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            </span>
            ${row.pins ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-settings-row-pin-place" aria-hidden="true"></span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ${mark(row.kind, row.checked)}
        </span>`; // The pin is the Framework's icon button (defect ST-2, owner decision
  // C166; C160 (1)): it shows its name as the Framework tooltip (the short
  // word, its title), and its accessible name says what a press does with
  // the row («Закрепить: Тёги», «Открепить: Тёги»). Its icon is the row's
  // line: the panel's size, height low (1/2: 20 in 28; 1: 24 in 32). One Tab stop with the
  // rows: the arrow inward reaches it (tabindex -1 on its button). Its
  // data-* go down to the native button with the host's other attributes.

  const pin = row.pin ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button-icon class="sf-settings-row-pin" icon="push_pin" appearance="ghost"
                scheme=${row.pinned ? 'primary' : 'on-surface-variant'} size=${size === '1' ? '1' : '1/2'} height="low"
                tabindex="-1"
                aria-label=${`${row.pinned ? words.unpin : words.pin}: ${row.text}`}
                title=${row.pinned ? words.unpin : words.pin}
                data-sf-setting=${row.setting} data-sf-option=${row.option}></sf-button-icon>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing; // The «На телефоне» switch of a field (study S-A (2), VL-82: one column
  // list decides the desktop and the phone): the row's own switch, as a
  // switch row draws it -- sf-switch 1/2 for its look, the span the role and
  // the name («Статус: на телефоне»). One Tab stop with the rows: the arrow
  // inward reaches it after the pin. A field that has none (phoneSwitch:
  // false, a table's system column) keeps its place empty.

  const phone = row.phones ? row.phone ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-settings-row-phone" role="switch" tabindex="-1"
                    aria-checked=${row.onPhone ? 'true' : 'false'}
                    aria-disabled=${row.disabled ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    aria-label=${words.phoneOf(row.text)}
                    data-sf-setting=${row.setting} data-sf-option=${row.option}><sf-switch size="1/2"
                    ?checked=${row.onPhone} ?disabled=${row.disabled} inert aria-hidden="true"></sf-switch></span>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-settings-row-phone-place" aria-hidden="true"><sf-switch size="1/2" inert></sf-switch></span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class=${['sf-settings-row', `sf-settings-row--${row.kind}`, row.pins ? 'sf-settings-row--pins' : '', row.phones ? 'sf-settings-row--phones' : ''].filter(Boolean).join(' ')}
            ?hidden=${row.hidden}
            ?data-checked=${row.checked}
            ?data-pinned=${row.pinned}
            ?data-phone=${row.onPhone}
            ?data-disabled=${row.disabled}>${main}${pin}${phone}</div>`;
} // The rows of one list, and whether each is the list's Tab stop: the one the
// person last stood on (index.js remembers it by its key), else the first one
// shown -- for a choice, the chosen one (a radio group's stop is its checked
// radio).


function withCurrent(rows, remembered) {
  const shown = rows.filter(row => !row.hidden && !row.disabled);
  const current = shown.find(row => row.key === remembered) ?? (rows[0]?.kind === 'option' ? shown.find(row => row.checked) : null) ?? shown[0];
  return rows.map(row => ({ ...row,
    current: row === current
  }));
}

function listOf(key, role, label, rows, context, {
  sortable = false
} = {}) {
  const marked = withCurrent(rows, context.current.get(key));
  if (!marked.length) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const empty = marked.every(row => row.hidden);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-settings-list" role=${role} aria-label=${label || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            data-sf-list=${key} ?hidden=${empty}
            aria-description=${sortable ? context.words.moveHint : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
            ${(0,lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__.repeat)(marked, row => row.key, row => renderRow(row, context))}
        </div>`;
} // The rows a group's settings make, in their lists: the switches standing
// together are one list, a choice is a radio group, a fields list is a list
// of its own; a heading heads the rows under it, a separator is a line.


function renderItems(items, context) {
  const parts = [];
  let switches = [];

  const flush = () => {
    if (!switches.length) return;
    const key = `switches:${switches[0].setting}`;
    parts.push(listOf(key, 'group', '', switches, context));
    switches = [];
  };

  for (const item of items) {
    if (item.type === 'heading') {
      flush();
      parts.push((0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-settings-panel-label" role="presentation">${item.text ?? ''}</div>`);
      continue;
    }

    if (item.type === 'separator') {
      flush();
      parts.push((0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-settings-panel-separator" role="separator"></div>`);
      continue;
    }

    if (!(0,_settings_js__WEBPACK_IMPORTED_MODULE_2__.holdsValue)(item)) continue;

    if (item.type === 'switch') {
      switches.push({
        key: item.id,
        kind: 'switch',
        role: 'switch',
        setting: item.id,
        checked: (0,_settings_js__WEBPACK_IMPORTED_MODULE_2__.itemValue)(item),
        text: item.text ?? '',
        caption: item.caption,
        disabled: Boolean(item.disabled),
        hidden: !(0,_settings_js__WEBPACK_IMPORTED_MODULE_2__.matches)(context.query, item.text, item.caption, item.keywords)
      });
      continue;
    }

    flush();

    if (item.type === 'choice') {
      const value = (0,_settings_js__WEBPACK_IMPORTED_MODULE_2__.itemValue)(item);
      const hit = (0,_settings_js__WEBPACK_IMPORTED_MODULE_2__.matches)(context.query, item.text); // A choice that orders (a filter's templates, C106 (3), (6)): the
      // fill alone for the chosen one, the handle at the start, the pin
      // at the end, the pinned on top -- a fields list's row without its
      // check.

      const arranges = (0,_settings_js__WEBPACK_IMPORTED_MODULE_2__.choiceArranges)(item);
      const options = arranges ? (0,_settings_js__WEBPACK_IMPORTED_MODULE_2__.choiceOptions)(item) : (Array.isArray(item.options) ? item.options : []).filter(option => option && option.id !== undefined && option.id !== null);
      const rows = options.map(option => ({
        key: String(option.id),
        kind: 'option',
        role: 'radio',
        setting: item.id,
        option: String(option.id),
        checked: option.id === value,
        text: option.text ?? '',
        disabled: Boolean(item.disabled || option.disabled),
        pinned: arranges && Boolean(item.pinnable && option.pinned),
        sorts: Boolean(item.sortable),
        pins: Boolean(item.pinnable),
        handle: (0,_settings_js__WEBPACK_IMPORTED_MODULE_2__.optionMoves)(item, option),
        pin: (0,_settings_js__WEBPACK_IMPORTED_MODULE_2__.optionPins)(item, option),
        hidden: !hit && !(0,_settings_js__WEBPACK_IMPORTED_MODULE_2__.matches)(context.query, option.text, option.keywords)
      }));
      if (item.text) parts.push((0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-settings-panel-label" role="presentation" ?hidden=${rows.every(row => row.hidden)}>${item.text}</div>`);
      parts.push(listOf(`choice:${item.id}`, 'radiogroup', item.text, rows, context, {
        sortable: Boolean(item.sortable)
      }));
      continue;
    }

    if (item.type === 'fields') {
      const phones = Boolean(item.phoneSwitch);
      const rows = (0,_settings_js__WEBPACK_IMPORTED_MODULE_2__.fieldOptions)(item).map(option => ({
        key: String(option.id),
        kind: 'field',
        role: 'checkbox',
        setting: item.id,
        option: String(option.id),
        checked: Boolean(option.checked),
        pinned: Boolean(option.pinned),
        text: option.text ?? '',
        disabled: Boolean(item.disabled || option.disabled),
        sorts: Boolean(item.sortable),
        pins: Boolean(item.pinnable),
        handle: (0,_settings_js__WEBPACK_IMPORTED_MODULE_2__.optionMoves)(item, option),
        pin: (0,_settings_js__WEBPACK_IMPORTED_MODULE_2__.optionPins)(item, option),
        phones,
        phone: (0,_settings_js__WEBPACK_IMPORTED_MODULE_2__.optionPhones)(item, option),
        onPhone: phones && Boolean(option.phone),
        hidden: !(0,_settings_js__WEBPACK_IMPORTED_MODULE_2__.matches)(context.query, option.text, option.keywords)
      })); // A list with phone switches names their column at its end, over
      // the switches («На телефоне»); each switch carries its own name,
      // so the caption is not read out.

      const caption = phones ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-settings-panel-label-end" aria-hidden="true">${context.words.phone}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
      const label = item.text && context.layout !== 'tabs' ? item.text : '';
      if (label || phones) parts.push((0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class=${['sf-settings-panel-label', phones ? 'sf-settings-panel-label--phones' : ''].filter(Boolean).join(' ')} role="presentation" ?hidden=${rows.every(row => row.hidden)}>${label}${caption}</div>`);
      parts.push(listOf(`fields:${item.id}`, 'group', item.text, rows, context, {
        sortable: Boolean(item.sortable)
      }));
      continue;
    }

    if (item.type === 'range') {
      parts.push((0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<label class="sf-settings-row sf-settings-row--range" ?hidden=${!(0,_settings_js__WEBPACK_IMPORTED_MODULE_2__.matches)(context.query, item.text)}>
                <span class="sf-settings-row-text"><span class="sf-settings-row-label">${item.text ?? ''}</span></span>
                <input class="sf-settings-row-range" type="range" data-sf-setting=${item.id}
                    min=${item.min ?? 0} max=${item.max ?? 100} step=${item.step ?? 1} .value=${String((0,_settings_js__WEBPACK_IMPORTED_MODULE_2__.itemValue)(item))}
                    ?disabled=${Boolean(item.disabled)} aria-valuetext=${`${(0,_settings_js__WEBPACK_IMPORTED_MODULE_2__.itemValue)(item)}${item.unit ?? ''}`}>
                <output class="sf-settings-row-value">${(0,_settings_js__WEBPACK_IMPORTED_MODULE_2__.itemValue)(item)}${item.unit ?? ''}</output>
            </label>`);
    }
  }

  flush();
  return parts;
} // A section: its heading over its rows. The untitled group of the settings
// between groups has no heading.


function renderSection(group, context) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<section class="sf-settings-panel-section" aria-label=${group.text || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
        ${group.text ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-settings-panel-heading">${group.text}</div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        ${renderItems(group.items, context)}
    </section>`;
}

function renderHead(context) {
  const {
    groups,
    layout,
    tab,
    size,
    words
  } = context;
  const tabs = layout === 'tabs' ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-tabs class="sf-settings-panel-tabs" type="underline" size=${size === '1' ? '1' : '1/2'}
                items=${groups.map(group => group.text || words.label).join('|')}
                active-index=${String(tab)}
                @sf-tabs-change=${event => {
    event.stopPropagation();
    context.component.chooseGroup(Number(event.detail?.current ?? 0));
  }}></sf-tabs>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-settings-panel-title">${context.label}</span>`; // A popup's close, and a panel's in a page's window that draws none of
  // its own (GB21, Docara K-13): the same button, named by close-label.

  const close = context.popup || context.shellClose ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button-icon class="sf-settings-panel-close" appearance="ghost" scheme="on-surface" size=${buttonSize(context)} icon="close"
                aria-label=${words.close} title=${words.close} data-sf-close data-drawer=${context.sheetClose ? 'close' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}></sf-button-icon>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-settings-panel-head">${tabs}${close}</div>`;
}

function renderSearch(context) {
  if (!context.search) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<label class="sf-settings-panel-search">
        <span class="sf-settings-panel-search-icon" aria-hidden="true"><i class="sf-icon">search</i></span>
        <input type="search" class="sf-settings-panel-search-input" autocomplete="off" spellcheck="false"
            placeholder=${context.words.search} aria-label=${context.words.search} .value=${context.query} data-sf-search>
    </label>`;
} // The panel's buttons take its size (owner decision C22: no hand size 1/2;
// the density of the region steps them down with the rows).


const buttonSize = context => context.size === '1' ? '1' : '1/2'; // A filter's footer: «Применить (N)» first, then «Сбросить» (owner decision
// C157 (3): the actions at the start, the main one first).


function renderFooter(context) {
  const {
    words,
    apply,
    count
  } = context;
  const size = buttonSize(context);
  const reset = (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button size=${size} appearance="outline" scheme="on-surface" text=${words.reset} data-sf-reset></sf-button>`;
  if (apply !== 'button') return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-settings-panel-footer">${reset}</div>`;
  const label = count ? `${words.apply} (${count})` : words.apply; // The main action first (C157 (3), C159 (4), FF-5).

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-settings-panel-footer"><sf-button size=${size} text=${label} data-sf-apply></sf-button>${reset}</div>`;
}

function renderPanel(context) {
  const {
    groups,
    layout,
    tab,
    query
  } = context;
  const shown = layout === 'tabs' ? [groups[tab] ?? groups[0]].filter(Boolean) : groups;
  const body = shown.map(group => layout === 'tabs' ? renderItems(group.items, context) : renderSection(group, context));
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class=${['sf-settings-panel', `sf-settings-panel--size-${context.size === '1' ? '1' : '1-2'}`, context.popup ? 'sf-settings-panel--popup' : '', context.rootClass].filter(Boolean).join(' ')}
            role=${context.popup ? 'dialog' : 'group'}
            aria-label=${context.label}
            ?hidden=${context.popup && !context.open}>
        ${renderHead(context)}
        ${renderSearch(context)}
        <div class="sf-settings-panel-body" role=${layout === 'tabs' ? 'tabpanel' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            aria-label=${layout === 'tabs' ? shown[0]?.text || context.label : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
            ${body}
            <p class="sf-settings-panel-empty" role="status" ?hidden=${!query || !context.nothingFound}>${context.words.empty}</p>
        </div>
        ${renderFooter(context)}
        <span class="sf-settings-panel-live" aria-live="polite" aria-atomic="true"></span>
    </div>`;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "e1c707506370"
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

/***/ "18003344cff0"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("layer-stack", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("layer-stack", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "efa66f8927d1"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit/directives/repeat.js", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("lit/directives/repeat.js", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "2a080a730149"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("lit", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "bf0cea966575"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("open-surface-mark", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("open-surface-mark", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "116963e5e31b"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("position", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("position", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "deb1a4d61565"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("smart-base", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("smart-base", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "0d10ff01494f"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   files: () => (/* binding */ files)
/* harmony export */ });
/* harmony import */ var _en_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("fb3a1cbd7459");
// Written by scripts/build-language-packs.mjs from src/core/lang/built-in.json
// (owner decision C282); do not edit. The words this bundle carries: the
// built-in languages' (en); every other language comes from
// a language file (core/lang/<code>.js or its parts).


const files = { en: { runtime: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime } };

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ en: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime });


/***/ },

/***/ "686f52293091"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-settings for the shim (core/js/aliases.js, standard §16 item 20).","component":"sf-settings","since":"2026-11-14","remove_after":"2027-01-01","aliases":[{"from":"tiles","to":"drill","kind":"value","setting":"look","component":"sf-settings","since":"2026-11-14","remove_after":"2027-01-01","section":"§16 item 20","note":"owner decision C176 (5): the tiles look left; its switches are rows of the drill look"}]}');

/***/ },

/***/ "72cabd0f91e5"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.settings","tag":"sf-settings","version":"1.12.1","kind":"leaf","settings":{"items":{"type":"list","schema":{"items":{"type":"object","properties":{"id":{"type":"string"},"type":{"type":"string","enum":["switch","choice","range","color","heading","separator","group","fields"]},"text":{"type":"string"},"caption":{"type":"string"},"icon":{"type":"string"},"value":{},"options":{"type":"array"},"min":{"type":"number"},"max":{"type":"number"},"step":{"type":"number"},"unit":{"type":"string"},"items":{"type":"array"},"tile":{"type":"boolean"},"custom":{"type":"boolean"},"disabled":{"type":"boolean"},"sortable":{"type":"boolean"},"pinnable":{"type":"boolean"},"keywords":{"type":"array"},"devices":{"type":"array","items":{"type":"string","enum":["phone","desktop"]}},"phoneSwitch":{"type":"boolean"},"phone":{"type":"boolean"}},"required":["type"]}},"default":[]},"look":{"type":"enum","values":["drill","rows","panel"],"default":"drill"},"apply":{"type":"enum","values":["instant","button"],"default":"instant"},"search":{"type":"boolean","default":false},"size":{"type":"enum","values":["1/2","1"],"default":"1"},"for":{"type":"string","default":""},"remember":{"type":"string","default":""},"device":{"type":"enum","values":["auto","phone","desktop"],"default":"auto"},"label":{"type":"string","default-from":"runtime.label"},"apply-count":{"type":"number","optional":true},"close-label":{"type":"string","default-from":"runtime.close"},"reset-label":{"type":"string","default-from":"runtime.reset"},"search-placeholder":{"type":"string","default-from":"runtime.search"},"empty-text":{"type":"string","default-from":"runtime.empty"},"pin-label":{"type":"string","default-from":"runtime.pin"},"unpin-label":{"type":"string","default-from":"runtime.unpin"},"move-label":{"type":"string","default-from":"runtime.move-hint"}},"values":{"values":{"type":"object"},"tab":{"type":"number"}},"events":{"change":{"x-native":false,"carries":{"id":{"type":"string"},"value":{"type":"id"},"previous":{"type":"id"},"item":{"type":"object"}},"cancelable":true},"changed":{"x-native":false,"carries":{"id":{"type":"string"},"value":{"type":"id"},"previous":{"type":"id"},"item":{"type":"object"}}},"reset":{"carries":{},"cancelable":true,"own-verb":true},"open":{"carries":{},"cancelable":true},"opened":{"carries":{}},"close":{"carries":{"reason":{"type":"enum","values":["close","escape","outside","cancelled","api"]},"unsaved":"boolean"},"cancelable":true},"closed":{"carries":{"reason":{"type":"enum","values":["close","escape","outside","cancelled","api"]}}},"arrange":{"carries":{"id":{"type":"string"},"order":{"type":"list"},"previous":{"type":"list"},"value":{"type":"id"},"item":{"type":"object"}},"cancelable":true},"arranged":{"carries":{"id":{"type":"string"},"order":{"type":"list"},"previous":{"type":"list"},"value":{"type":"id"},"item":{"type":"object"}}}},"actions":{"set-value":{"with":{"id":"string","value":{"type":"id"}}},"set-all":{"with":{"values":"object"}},"show":{"with":{"id":"string"},"waits":true},"reset":{"emits":"reset"},"open":{"with":{"tab":{"type":"number","optional":true}},"waits":true},"close":{}},"layer":{"kind":"surface","locks-page":false,"traps-focus":false},"host-states":{"data-look":"string"},"css-variables":{"--sf-settings-panel-width":{"type":"length","state":"default"},"--sf-settings-panel-height":{"type":"length","state":"default"}}}');

/***/ },

/***/ "fb3a1cbd7459"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Settings","runtime":{"label":"Settings","hue-red":"Red","hue-orange":"Orange","hue-amber":"Amber","hue-yellow":"Yellow","hue-lime":"Lime","hue-green":"Green","hue-teal":"Teal","hue-cyan":"Cyan","hue-sky":"Sky","hue-blue":"Blue","hue-indigo":"Indigo","hue-violet":"Violet","hue-purple":"Purple","hue-pink":"Pink","hue-brown":"Brown","hue-gray":"Grey","own-color":"Own colour…","own-color-value":"Own: {value}","close":"Close","reset":"Reset","apply":"Apply","search":"Find","empty":"Nothing found","pin":"Pin","unpin":"Unpin","move-hint":"Alt with the up and down arrows changes the order","position":"{text}: {index} of {count}","phone":"On phone","phone-of":"{text}: on phone"}}');

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