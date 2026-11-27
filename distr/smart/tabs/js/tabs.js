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

/***/ "8d229b7c92e9"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   menuOpen: () => (/* binding */ menuOpen),
/* harmony export */   publishMenu: () => (/* binding */ publishMenu)
/* harmony export */ });
/* harmony import */ var _density_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("1412c5875b4d");
// SF.menu.open: the page's one menu of actions (owner decision C184 (4),
// 2026-11-14; the public name is the owner's; study control/research/
// 2026-11-14-toolbar-menu-open.md, K-03).
//
// A row's «⋯», a toolbar's «Ещё», the right button and the menu key on a row
// all open the standard menu -- sf-menu-context -- and every component used to
// place its own and wait for it (nine in SIMAI Pro, more in the Framework).
// Now one call opens the one menu of the page:
//
//   const choice = await SF.menu.open({anchor, entries, label});
//   const choice = await SF.menu.open({x, y, entries, label, returnTo: row});
//   // choice: {id, entry} of the row chosen, or null (closed without one)
//
// - anchor: the control the menu hangs from (a press on the same control
//   while its menu is open closes it, as a toggle); or x, y: a point in the
//   window -- where a right-click was, or a row's corner for Shift+F10 -- the
//   menu's corner exactly there;
// - entries: the rows, as sf-menu-context takes them;
// - label: the menu's name, read by a screen reader;
// - size: the menu's size step, as sf-menu-context's size attribute; left
//   out, the step of what opens it (the anchor's, its component's or the
//   Smart component holding it: a row menu of a table of size 1 is size 1);
// - returnTo: where the focus goes when the menu closes (the row it acted
//   on); left out, the menu gives the focus back to where it was, or to the
//   anchor;
// - align: 'start' (the default) lines the menu's start edge up with the
//   anchor's, 'end' its end edge -- for a control at the end of a toolbar,
//   whose menu would otherwise run past it towards the window's edge (view
//   round 1, table group). Start and end follow the page's direction (in a
//   right-to-left page 'end' is the left edge), and a menu that does not fit
//   still flips to the other side and is shifted inside the window. At a
//   point, 'end' puts the menu's end corner at the point.
//
// The menu is fetched by the Loader the first time (SF.Loader.ensure), one on
// the page -- on the body, or in the open modal dialog the anchor is in, since
// a modal dialog makes the rest of the page inert. A second opening while one
// is open closes the first, which answers null. The answer never rejects:
// without a menu (no Loader, no sf-menu-context) it is null.
//
// Every bundle may carry a copy of this module (bundles each carry their own
// module copy), so the one menu and its pending answer live behind the shared
// global: the first copy to run publishes SF.menu.open and every other copy
// calls the published one.

const SHARED = 'data-sf-menu-shared';
const ALIGNS = new Set(['start', 'end']);

function installMenuOpen() {
  let pending = null;
  let point = null; // The opening the menu belongs to now, kept past its answer: a choice
  // answers before the menu closes, and the focus goes back on closing.

  let shown = null;

  const settle = value => {
    const waiting = pending;
    pending = null;
    waiting?.resolve(value);
    return waiting;
  };

  function sharedMenu(anchor) {
    const doc = globalThis.document;
    let menu = doc.querySelector(`[${SHARED}]`);

    if (!menu) {
      menu = doc.createElement('sf-menu-context');
      menu.setAttribute('popup', '');
      menu.setAttribute(SHARED, '');
      menu.addEventListener('sf-menu-context-select', event => {
        if (event.target !== menu) return;
        settle({
          id: event.detail?.id ?? null,
          entry: event.detail?.entry ?? null
        });
      });
      menu.addEventListener('sf-menu-context-closed', event => {
        if (event.target !== menu) return;
        settle(null);
        const opening = shown;
        shown = null;
        const back = opening?.returnTo;
        if (!back?.isConnected) return; // After the menu's own return: the row the person acted on, when the
        // focus fell to the page, stayed in the closed menu or went back to
        // the «⋯» that opened it (a pointer's control, not a Tab stop).

        const anchor = opening.anchor;
        setTimeout(() => {
          const active = doc.activeElement;

          if (!active || active === doc.body || active === doc.documentElement || menu.contains(active) || anchor && (active === anchor || anchor.contains?.(active))) {
            back.focus?.({
              preventScroll: true
            });
          }
        }, 0);
      });
    } // In the open modal dialog the opener is in, or on the body.


    const home = anchor?.closest?.('dialog[open]') || doc.body;
    if (menu.parentNode !== home && !menu.isOpen) home.append(menu);
    return menu;
  } // A point in the window as an anchor of no size: sf-menu-context hangs its
  // corner exactly there and reads the page under it (density, focus back).


  function pointAnchor(x, y, near) {
    const doc = globalThis.document;

    if (!point?.isConnected) {
      point = doc.createElement('span');
      point.setAttribute('aria-hidden', 'true');
      point.setAttribute('data-sf-menu-point', '');
    }

    const home = near?.closest?.('dialog[open]') || doc.body;
    if (point.parentNode !== home) home.append(point);
    point.style.cssText = `position:fixed;left:${x}px;top:${y}px;inline-size:0;block-size:0;pointer-events:none;overflow:hidden`;
    return point;
  }

  return async function open(options = {}) {
    const {
      anchor = null,
      x,
      y,
      entries = [],
      label = '',
      size = '',
      returnTo = null
    } = options || {}; // Logical, so a right-to-left page mirrors it; anything else is start.

    const align = ALIGNS.has(options?.align) ? options.align : 'start';
    const atPoint = !(anchor instanceof Element);
    if (atPoint && !(Number.isFinite(Number(x)) && Number.isFinite(Number(y)))) return null;
    const doc = globalThis.document;
    if (!doc) return null; // A press opens it: the wait does not give up while the menu's code is
    // on its way (SF.Loader.ensure press, GB18 L2; GB19).

    await globalThis.SF?.Loader?.ensure?.(['sf-menu-context'], {
      press: true
    });
    if (!globalThis.customElements?.get('sf-menu-context')) return null;
    const menu = sharedMenu(atPoint ? returnTo : anchor); // The same control again: its open menu closes (a toggle).

    if (!atPoint && menu.isOpen && pending?.anchor === anchor) {
      menu.close({
        reason: 'api'
      });
      return null;
    }

    if (menu.isOpen) {
      settle(null);
      shown = null;
      menu.close({
        restoreFocus: false,
        reason: 'api',
        ask: false
      });
    }

    if (label) menu.setAttribute('aria-label', label);else menu.removeAttribute('aria-label');
    if (size) menu.setAttribute('size', String(size));else {
      menu.removeAttribute('size');
      menu.removeAttribute(_density_js__WEBPACK_IMPORTED_MODULE_0__.RELATIVE);
    } // In the density of the control or the row it opens from (C22, C79), not
    // of the body it stands on.

    (0,_density_js__WEBPACK_IMPORTED_MODULE_0__.followDensity)(menu, atPoint ? returnTo : anchor);
    menu.search = null;
    menu.entries = Array.isArray(entries) ? entries : [];
    return new Promise(resolve => {
      pending = {
        resolve,
        anchor,
        returnTo: returnTo instanceof Element ? returnTo : null
      };
      shown = pending;
      const mine = pending;
      const opening = atPoint ? typeof menu.openAt === 'function' ? menu.openAt(Number(x), Number(y), {
        target: returnTo ?? undefined,
        align
      }) : menu.openFor(pointAnchor(Number(x), Number(y), returnTo), {
        side: 'block-end',
        align,
        focus: 'first'
      }) : menu.openFor(anchor, {
        side: 'block-end',
        align,
        focus: 'first'
      });
      Promise.resolve(opening).then(answer => {
        // Refused (a listener kept it closed) or no surface: nothing chosen.
        if (pending === mine && answer && answer !== true && answer.outcome !== 'applied') settle(null);
      }, () => {
        if (pending === mine) settle(null);
      });
    });
  };
} // The published one, or this copy published.


function publishMenu() {
  const SF = globalThis.SF = globalThis.SF || {};
  SF.menu = SF.menu || {};
  if (typeof SF.menu.open !== 'function') SF.menu.open = installMenuOpen();
  return SF.menu;
}
function menuOpen(options) {
  return publishMenu().open(options);
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (menuOpen);

/***/ },

/***/ "2db3a835ac11"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   actionEntry: () => (/* binding */ actionEntry),
/* harmony export */   chooseBeside: () => (/* binding */ chooseBeside),
/* harmony export */   controlOf: () => (/* binding */ controlOf),
/* harmony export */   drawnBox: () => (/* binding */ drawnBox),
/* harmony export */   fitBesideMore: () => (/* binding */ fitBesideMore),
/* harmony export */   fitByPriority: () => (/* binding */ fitByPriority),
/* harmony export */   fitInOrder: () => (/* binding */ fitInOrder),
/* harmony export */   isMainAction: () => (/* binding */ isMainAction),
/* harmony export */   isPressed: () => (/* binding */ isPressed),
/* harmony export */   layoutActionRow: () => (/* binding */ layoutActionRow),
/* harmony export */   layoutHeight: () => (/* binding */ layoutHeight),
/* harmony export */   layoutRowRoom: () => (/* binding */ layoutRowRoom),
/* harmony export */   layoutWidth: () => (/* binding */ layoutWidth),
/* harmony export */   measureShown: () => (/* binding */ measureShown),
/* harmony export */   openRowMenu: () => (/* binding */ openRowMenu),
/* harmony export */   readPriority: () => (/* binding */ readPriority),
/* harmony export */   rowRoom: () => (/* binding */ rowRoom),
/* harmony export */   spanOf: () => (/* binding */ spanOf),
/* harmony export */   spanOfUnits: () => (/* binding */ spanOfUnits),
/* harmony export */   squeezeStep: () => (/* binding */ squeezeStep),
/* harmony export */   standardMenu: () => (/* binding */ standardMenu),
/* harmony export */   textWidth: () => (/* binding */ textWidth),
/* harmony export */   triggerExtra: () => (/* binding */ triggerExtra)
/* harmony export */ });
/* harmony import */ var _density_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("1412c5875b4d");
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
} // The current tab alone beside «Ещё» and still wider than the row (squeezed
// above): how it gives way (group build 16 returns GB16-1 and GB16-2, DEV's
// answer to question 1, 2026-11-22). It is shortened with an ellipsis while at
// least two letters stay before it; below that a tab with an icon draws its
// icon alone -- the whole glyph and the tab's padding, never a cut glyph or a
// one-letter stub -- and a tab of words keeps two letters and the ellipsis.
// When even that does not stand beside «Ещё (n)», the trigger gives way: it
// draws its glyph alone as a square (its words stay its name, as shrink="icon"
// does, C370). The current tab never goes into «Ещё».
//   tabRoom: the width the tab can have beside the trigger as it will be;
//   textRoom: the label's own width there; twoLetters: the label's width with
//   two letters and the ellipsis; iconOnly: the tab's width with its icon
//   alone, or null for a tab without one; moreGain: how much narrower the
//   trigger is with its glyph alone; compactTextRoom: the label's width
//   beside the trigger drawn as its glyph alone (measured; else textRoom and
//   the gain).
// The label is decided again beside the glyph-alone trigger before the tab
// gives up its words (group build 16 return GB16-5, 2026-11-22): the trigger
// keeps its name out of sight and as a tooltip, the current tab's name is the
// row's content -- an icon beside a bare chevron with 40-96 px empty and the
// whole name fitting there read as a fault. So: two letters or more beside
// «Ещё (n)»; else two letters or more (up to the whole word) beside the
// glyph alone; else the icon alone, the trigger keeping its words while the
// icon stands beside them; a tab of words keeps two letters.
// Answers {icon, compact}: the tab draws its icon alone; the trigger its glyph.

function squeezeStep({
  tabRoom,
  textRoom,
  twoLetters,
  iconOnly = null,
  moreGain = 0,
  compactTextRoom = null
}) {
  if (textRoom + TOLERANCE >= twoLetters) return {
    icon: false,
    compact: false
  };
  const besideGlyph = compactTextRoom ?? textRoom + moreGain;
  if (moreGain > 0 && besideGlyph + TOLERANCE >= twoLetters) return {
    icon: false,
    compact: true
  };
  if (iconOnly !== null) return {
    icon: true,
    compact: tabRoom + TOLERANCE < iconOnly && moreGain > 0
  };
  return {
    icon: false,
    compact: moreGain > 0
  };
} // The content box of a row that clips and has no scrollbar, in fractional
// pixels: clientWidth is a whole pixel, and a row 383.6 px wide read as 383 or
// 384 laid out differently (C54 return).

function rowRoom(list) {
  const style = getComputedStyle(list);
  const edges = ['borderInlineStartWidth', 'borderInlineEndWidth', 'paddingInlineStart', 'paddingInlineEnd'];
  return list.getBoundingClientRect().width - edges.reduce((sum, edge) => sum + (parseFloat(style[edge]) || 0), 0);
} // The width an element is laid out at, in fractional CSS pixels, before any
// transform of it or of an ancestor (its border box). getBoundingClientRect is
// a screen box: inside scale(.7) a 90 px tab reads 63, inside rotate() it reads
// the width of its rotated bounding box, and a row that compares such widths
// with its padding, a text measured in canvas or a ResizeObserver size mixes
// screen and layout pixels (docs hero study 2026-11-19, section 9). The used
// width of the computed style is the layout's own, with its fractions; a box
// without one (an inline box, an element not drawn) gives offsetWidth.

function layoutWidth(element) {
  if (!element) return 0;
  const style = getComputedStyle(element);
  const width = parseFloat(style.width);
  if (!Number.isFinite(width)) return element.offsetWidth || 0;
  if (style.boxSizing === 'border-box') return width;
  return ['paddingLeft', 'paddingRight', 'borderLeftWidth', 'borderRightWidth'].reduce((sum, edge) => sum + (parseFloat(style[edge]) || 0), width);
} // The block size of the same box (layoutWidth's other axis).

function layoutHeight(element) {
  if (!element) return 0;
  const style = getComputedStyle(element);
  const height = parseFloat(style.height);
  if (!Number.isFinite(height)) return element.offsetHeight || 0;
  if (style.boxSizing === 'border-box') return height;
  return ['paddingTop', 'paddingBottom', 'borderTopWidth', 'borderBottomWidth'].reduce((sum, edge) => sum + (parseFloat(style[edge]) || 0), height);
} // rowRoom in layout pixels: the row's content box before any transform, for a
// row whose items are measured with layoutWidth.

function layoutRowRoom(list) {
  const style = getComputedStyle(list);
  const edges = ['borderInlineStartWidth', 'borderInlineEndWidth', 'paddingInlineStart', 'paddingInlineEnd'];
  return layoutWidth(list) - edges.reduce((sum, edge) => sum + (parseFloat(style[edge]) || 0), 0);
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
// first used (SF.Loader.ensure with press: a press opens it, so the wait
// goes on while its code is on its way, GB18 L2 / GB19; never thrown), one per owner and field, on the body or in the open dialog. The
// one copy in core (defect TL-8): the sortable inserter and the handle's move
// menu place theirs through it too. null when no sf-menu-context came (no
// Loader, or the relation failed): an element that never upgrades opens
// nothing. setup(menu) runs once on a new menu, for the listeners an owner
// adds beside select.

async function standardMenu(owner, field, select, {
  setup
} = {}) {
  await globalThis.SF?.Loader?.ensure?.(['sf-menu-context'], {
    press: true
  });
  if (owner[field]?.isConnected) return owner[field];
  if (!globalThis.customElements?.get('sf-menu-context')) return null;
  const doc = owner.ownerDocument || globalThis.document;
  const menu = doc.createElement('sf-menu-context');
  menu.setAttribute('popup', '');
  if (select) menu.addEventListener('sf-menu-context-select', event => select(event.detail?.id, event));
  setup?.(menu);
  (owner.closest('dialog[open]') || doc.body).append(menu);
  owner[field] = menu;
  return menu;
} // ─── Rows of actions and tools (owner decision C155, 2026-11-14) ─────────────
// The one row engine of the Framework: the navigation rows above (sf-tabs,
// sf-contents, sf-menu) and the action and tool rows below (sf-header-page's
// actions, sf-input-rich's toolbar, .sf-button-group) share the measuring and
// the rule. What does not fit leaves for «Ещё»: from the end by default, by
// an author's priority where one is given (priority="1" is the most important,
// a bigger number leaves sooner, an item without one before every numbered
// item); the main action, a pressed or current item and priority="pin" never
// leave (C155 (3)). A toolbar's units are its groups: a group leaves whole and
// takes its separator with it (C155 (4)).
// An author's priority as the engine reads it: a whole number from 1, pin, or
// nothing (leaves first, the last first).

function readPriority(value) {
  if (value === null || value === undefined) return {
    rank: Infinity,
    pin: false
  };
  const text = String(value).trim().toLowerCase();
  if (text === 'pin') return {
    rank: 0,
    pin: true
  };
  const number = Number(text);
  return Number.isFinite(number) && text !== '' ? {
    rank: number,
    pin: false
  } : {
    rank: Infinity,
    pin: false
  };
} // The span of some units laid side by side: their widths, the row's gap
// between neighbours and, where two neighbours belong to different groups, a
// separator with the gap on each of its sides.

function spanOfUnits(units, gap, separator, indices) {
  let span = 0;
  indices.forEach((at, n) => {
    if (n) {
      span += gap;
      if (separator && units[indices[n - 1]].group !== units[at].group) span += separator + gap;
    }

    span += units[at].width;
  });
  return span;
} // Which units stay in a row that is room wide. units: [{width, rank, pin,
// group}] in the row's order; more: the width «Ещё» adds when it shows (its
// own width, the gap before it and, in a toolbar, its separator). Answers the
// indices that stay, in order, and the ones that left; every unit stays when
// all fit. The units that leave go by rank, the biggest first, and among equal
// ranks the last first; a pinned unit never leaves, even when the pinned ones
// alone do not fit (the row then clips, as a current tab is squeezed).

function fitByPriority({
  units,
  gap = 0,
  separator = 0,
  room,
  more = 0
}) {
  const all = units.map((_, at) => at);
  const whole = spanOfUnits(units, gap, separator, all);
  if (whole <= room + TOLERANCE) return {
    kept: all,
    out: [],
    span: whole,
    fits: true
  };
  const order = all.filter(at => !units[at].pin).sort((a, b) => units[b].rank - units[a].rank || b - a);
  const kept = all.slice();
  const out = [];

  const used = () => spanOfUnits(units, gap, separator, kept) + (kept.length ? more : more - gap);

  while (order.length && used() > room + TOLERANCE) {
    const at = order.shift();
    kept.splice(kept.indexOf(at), 1);
    out.push(at);
  }

  const span = used();
  return {
    kept,
    out: out.sort((a, b) => a - b),
    span,
    fits: span <= room + TOLERANCE
  };
} // The box an element draws: a Framework host with display: contents (sf-button,
// sf-button-icon) has none of its own, so its first drawn child's.

function drawnBox(element) {
  let box = element;

  while (box && getComputedStyle(box).display === 'contents') box = box.firstElementChild;

  return box ? box.getBoundingClientRect() : {
    width: 0,
    height: 0,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  };
} // Every element's drawn width with all of them shown, in one task: the class
// that takes an element out of the row is lifted for the measure and put back
// before anything is painted (the row never draws all its items at once).

function measureShown(elements, outClass) {
  const was = elements.map(element => element.classList.contains(outClass));

  for (const element of elements) element.classList.remove(outClass);

  const widths = elements.map(element => drawnBox(element).width);
  elements.forEach((element, at) => element.classList.toggle(outClass, was[at]));
  return widths;
} // A row of actions or tools laid out by the rule above, in one task.
// row: the flex row; units: [{element, rank, pin, group}]; more: the «Ещё»
// element (inside the row, last); moreSeparator: a separator before it (a
// toolbar's), separators: [{element, after: group}] -- a separator standing
// after a group, shown only between two groups that keep something; outClass:
// the row's own class that takes an element out (display: none); room: the
// room the row has, when it is not the row's own content box (a row sized by
// its content). Answers {out: the indices that left, fits: whether what
// stays fits the room}.

function layoutActionRow({
  row,
  units,
  more,
  moreSeparator = null,
  separators = [],
  outClass,
  room = null
}) {
  const style = getComputedStyle(row);
  const gap = parseFloat(style.columnGap) || 0;
  const elements = units.map(unit => unit.element);
  const extra = [more, moreSeparator, ...separators.map(one => one.element)].filter(Boolean);
  const widths = measureShown([...elements, ...extra], outClass);
  const moreWidth = widths[elements.length];
  const separatorWidth = separators.length || moreSeparator ? Math.max(0, ...widths.slice(elements.length + 1)) : 0;
  const measured = units.map((unit, at) => ({ ...unit,
    width: widths[at]
  }));
  const {
    out,
    fits
  } = fitByPriority({
    units: measured,
    gap,
    separator: separatorWidth,
    room: room ?? rowRoom(row),
    more: moreWidth + gap + (moreSeparator ? separatorWidth + gap : 0)
  });
  const gone = new Set(out);
  elements.forEach((element, at) => element.classList.toggle(outClass, gone.has(at))); // A separator stands after its group only while that group and a group
  // after it both keep something: an emptied group leaves with its separator,
  // and none stands first or last.

  const keeps = group => units.some((unit, at) => unit.group === group && !gone.has(at));

  const groups = [...new Set(units.map(unit => unit.group))];

  for (const {
    element,
    after
  } of separators) {
    const later = groups.slice(groups.indexOf(after) + 1);
    element.classList.toggle(outClass, !(keeps(after) && later.some(keeps)));
  }

  more?.classList.toggle(outClass, !out.length);
  moreSeparator?.classList.toggle(outClass, !out.length || gone.size === units.length);
  return {
    out,
    fits
  };
} // ─── «Ещё» of an action or tool row ──────────────────────────────────────────
// Whether an action is the row's main one: a filled sf-button (no appearance,
// or default) -- one per row (C116, C161 (3)).

function isMainAction(element) {
  if (!element?.matches?.('sf-button, .sf-button')) return false;
  const look = element.getAttribute('appearance') ?? element.getAttribute('variant');
  return look === null || look === '' || look === 'default' || look === 'filled';
} // Whether a toggle in a row is on: a pressed sf-button or icon button, or a
// button saying aria-pressed="true".

function isPressed(element) {
  if (!element) return false;
  const value = element.getAttribute('pressed');
  if (value !== null && value !== 'false') return true;
  return element.getAttribute('aria-pressed') === 'true' || element.querySelector?.(':scope > button[aria-pressed="true"]') != null;
} // The control a row item is pressed through: its own button or link.

function controlOf(element) {
  if (!element) return null;
  if (element.matches('button, a[href]')) return element;
  return element.querySelector(':scope > button, :scope > a[href], button, a[href]') || element;
} // The menu row an action of a row becomes in «Ещё»: its words, its icon, and
// a check when it is a pressed toggle (C155 (6), (7)).

function actionEntry(element, id) {
  const control = controlOf(element);
  const text = (element.getAttribute('text') || element.getAttribute('aria-label') || element.getAttribute('title') || control?.getAttribute('aria-label') || element.textContent || '').trim();
  const icon = element.getAttribute('icon-start') || element.getAttribute('icon') || element.getAttribute('icon-end') || control?.querySelector?.('.sf-icon')?.textContent.trim() || undefined;
  const entry = {
    id: String(id),
    text,
    icon: icon || undefined
  };
  const toggle = element.hasAttribute('pressed') || control?.hasAttribute?.('aria-pressed');

  if (toggle) {
    entry.kind = 'check';
    entry.checked = isPressed(element);
  }

  if (element.hasAttribute('disabled') || control?.disabled || control?.getAttribute?.('aria-disabled') === 'true') entry.disabled = true;
  return entry;
} // The «Ещё» menu of a row: the standard sf-menu-context (standardMenu), named
// «Ещё», on the row's size and density, listing entries; toggled from anchor.

async function openRowMenu(owner, {
  anchor,
  entries,
  select,
  label,
  size = '1'
}) {
  if (!entries.length) return null;
  const menu = await standardMenu(owner, '_sfRowMoreMenu', (id, event) => owner._sfRowMoreSelect?.(id, event));
  if (!menu) return null;
  owner._sfRowMoreSelect = select;
  if (label) menu.setAttribute('aria-label', label);
  menu.setAttribute('size', size);
  (0,_density_js__WEBPACK_IMPORTED_MODULE_0__.followDensity)(menu, owner);
  menu.entries = entries;
  menu.toggleFor(anchor);
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
/* harmony import */ var _core_js_menu_open_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("8d229b7c92e9");
/* harmony import */ var _core_js_device_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("cbcfcde04d12");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("795a53b0bbe9");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__("84d032c55810");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__("51b106697124");
/* harmony import */ var _lang_index_mjs__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__("c74d9c9cd2e0");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, _core_js_smart_base__WEBPACK_IMPORTED_MODULE_1__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2__, _core_js_instance_path__WEBPACK_IMPORTED_MODULE_3__, _core_js_tag_aliases_js__WEBPACK_IMPORTED_MODULE_4__, _core_js_deprecations__WEBPACK_IMPORTED_MODULE_7__, _js_templates_default__WEBPACK_IMPORTED_MODULE_11__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, _core_js_smart_base__WEBPACK_IMPORTED_MODULE_1__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2__, _core_js_instance_path__WEBPACK_IMPORTED_MODULE_3__, _core_js_tag_aliases_js__WEBPACK_IMPORTED_MODULE_4__, _core_js_deprecations__WEBPACK_IMPORTED_MODULE_7__, _js_templates_default__WEBPACK_IMPORTED_MODULE_11__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _core_js_instance_path__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_core_js_instance_path__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _core_js_deprecations__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_core_js_deprecations__WEBPACK_IMPORTED_MODULE_7__);














 // Only the words on screen ship in the bundle, English only (owner decision
// C282): Russian and every other language come from a language file. The
// title, settings and events stay in the language files for the Studio and the
// docs (localization study LC-2).
// sf-tabs from its component.json (standard simai.smart-component 1.3.8 §3,
// §4, §7.2.1, §7.2.3, §8, §11): the settings are attributes and properties
// made by core/js/element-manifest.js, the words are lang/<locale>.json, the
// actions answer outcomes, and the old event name sf-tab-change is a dated
// alias of sf-tabs-change.

const TabsElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_12__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_1___default()),
  lang: _lang_index_mjs__WEBPACK_IMPORTED_MODULE_14__.files,
  source: 'ru',
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_13__,
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
// The tooltip controller asked for by a row that hides a name (GB16-6).

let rowTipsAsked = false;
const INVALID = '[aria-invalid="true"], [invalid]:not([invalid="false"]), :invalid'; // What takes the focus inside a panel: a panel holding one is not a tab stop
// of its own (APG tabs; R184 T8).

const FOCUSABLE = ['a[href]', 'area[href]', 'button:not([disabled])', 'input:not([disabled]):not([type="hidden"])', 'select:not([disabled])', 'textarea:not([disabled])', 'iframe', 'audio[controls]', 'video[controls]', 'summary', '[contenteditable]:not([contenteditable="false"])', '[tabindex]:not([tabindex="-1"])'].join(', '); // Which item a tab in the list draws. An sf-button moves its data attributes
// to the button inside it, so the index is read wherever it landed.
// A panel with something to read or to show: an element, or words. The
// drawing's comment marks and white space are nothing.

function panelHasContent(panel) {
  for (const node of panel.childNodes) {
    if (node.nodeType === 1) return true;
    if (node.nodeType === 3 && node.textContent.trim()) return true;
  }

  return false;
} // A box's content width: its border box less its padding and border.
// Layout widths (1.4.7): before any scale() or rotate() around the tabs.


function contentWidth(box) {
  const width = (0,_core_js_overflow_row_js__WEBPACK_IMPORTED_MODULE_8__.layoutWidth)(box);
  if (!width) return 0;
  const style = globalThis.getComputedStyle?.(box);
  const sides = ['paddingInlineStart', 'paddingInlineEnd', 'borderInlineStartWidth', 'borderInlineEndWidth'].reduce((sum, side) => sum + (Number.parseFloat(style?.[side]) || 0), 0);
  return Math.max(0, width - sides);
} // One attribute order on a tab's button, whichever ran last (VO-1). The
// button host (sf-button, sf-button-icon) forwards its data-* -- the tab's
// data-sf-tab-index among them -- by taking them off and appending them, so
// a forward after the tabs set id, role and aria-* left them at the end, and
// one before left them in front: a printed page read «stale» by chance. When
// a forwarded name stands before one the tabs write, the tabs append the
// forwarded names again, in the host's order -- the order a later forward
// writes. Names others add later (a tooltip's aria-describedby) stay after.


const TAB_OWN_ATTRIBUTES = new Set(['id', 'role', 'aria-controls', 'aria-selected', 'aria-disabled', 'aria-labelledby', 'aria-label', 'aria-current', 'tabindex']);

function settleForwardedAttributes(tab) {
  const host = tab?.parentElement;
  const keys = host && host.__sfHostDataAttributeTarget === tab ? tab[host.__sfHostDataAttributeTargetKeys] : null;
  if (!keys?.size) return;
  const names = Array.from(keys).filter(name => tab.hasAttribute(name) && !TAB_OWN_ATTRIBUTES.has(name));
  if (!names.length) return;
  const order = Array.from(tab.attributes).map(attribute => attribute.name);
  const lastOwn = order.reduce((at, name, index) => TAB_OWN_ATTRIBUTES.has(name) ? index : at, -1);
  const placed = names.map(name => order.indexOf(name));
  if (placed.every((at, index) => at > lastOwn && (index === 0 || at > placed[index - 1]))) return;

  for (const name of names) {
    const value = tab.getAttribute(name);
    tab.removeAttribute(name);
    tab.setAttribute(name, value);
  }
}

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
      // fold (owner remark VR11-1, group build 16): auto -- vertical tabs turn
      // into the line with «Ещё» on a narrow place (C181 (2)); never -- the
      // vertical list stays at any width of its place (a host that sizes the
      // column itself, as sf-view-properties' section column does).
      fold: {
        default: 'auto',
        values: ['auto', 'never']
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
    this.syncPanelFocus();
    this.followPlace(); // The box that has a size: sf-tabs is display:contents, so observing the
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
      if (!box || host.classList.contains('sf-tabs-squeezed') || host.classList.contains('sf-tabs-icon-only')) return;
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
    // Vertical tabs become a row with «Ещё» (C96 item 5) on a narrow place:
    // below the h1 step (md, 44rem) of the width they stand in, not of the
    // screen (C181 (2)) -- a vertical column in a 30rem panel of a wide page
    // stayed a column beside a squeezed panel, one in a wide frame of a phone
    // preview folded. The window's step is left only for a place with no
    // width yet. fit auto reads the row's own width (narrowPlace).
    if (!this._narrowMedia) {
      this._narrowMedia = (0,_core_js_breakpoints_js__WEBPACK_IMPORTED_MODULE_6__.breakpointMedia)('md', {
        below: true
      });

      this._onNarrow = () => this.followPlace();

      this._narrowMedia?.addEventListener?.('change', this._onNarrow);
    }

    this._narrow = this.readNarrow();

    if (!this._placeObserver && typeof ResizeObserver === 'function') {
      this._placeObserver = new ResizeObserver(() => this.followPlace());
    }

    this.watchPlace();
    this._deviceLayout = (0,_core_js_device_js__WEBPACK_IMPORTED_MODULE_10__.layoutOf)(this);
    this._stopLayout?.();
    this._stopLayout = (0,_core_js_device_js__WEBPACK_IMPORTED_MODULE_10__.watchLayout)(this, now => {
      this._deviceLayout = now;
      this.requestComponentUpdate('layout');
    });
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
    this._stopLayout?.();
    this._stopLayout = null;
    this._narrowMedia?.removeEventListener?.('change', this._onNarrow);
    this._narrowMedia = null;
    this._placeObserver?.disconnect();
    this._watchedPlace = null;
    this._watchedRoot = null;

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
    this._panelContentObserver?.disconnect();
    this._panelContentWatched = null;
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
  } // The label a page panel carries for its tab (aria-label), or none.


  pagePanelLabel(key, index) {
    const panel = this.pagePanelFor({
      key
    }, index);
    return String(panel?.getAttribute('aria-label') ?? '').trim();
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
      settleForwardedAttributes(tab);
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
        // A tab without a label takes its page panel's aria-label (1.6.0: a
        // server prints <div role="tabpanel" aria-label="…"> per tab and no
        // items, Docara's :::tabs), else is named in the page's language
        // (R184 T14: the English «Tab N» on every page).
        label: item.label || this.pagePanelLabel?.(own, index) || this.sfWord('tab', {
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
  } // The width the vertical look folds on (C181 (2)): the box that holds the
  // tabs and their content (VP-26, C96 (5), C289 (5)); before the first
  // drawing, the parent's content box. Layout widths (1.4.7): a screen box
  // inside scale() or rotate() is not the width the md step is compared with.


  placeWidth() {
    const place = this.placeBox();
    if (place) return contentWidth(place);
    const parent = this.parentElement;
    if (!parent) return 0;
    return contentWidth(parent);
  } // With the panels inside, the tabs' own block holds the tabs and the
  // content (sf-tabs itself is display: contents). A tab list alone -- the
  // host draws the content beside it, as sf-view-properties' section column
  // does -- stands in a column of its own, always below the step: its own
  // block folded the column into the line with «Ещё (n)» even full screen at
  // 1440 (VP-26). Its place is then the first box around it wider than that
  // column: the wrapper of the column and the content. A column's own
  // wrappers (as wide as it) are passed over; with none wider, its own block.


  placeBox() {
    const root = this.querySelector(':scope > .sf-tabs');
    if (!root) return null;
    if (this.holdsContent()) return root;
    const own = (0,_core_js_overflow_row_js__WEBPACK_IMPORTED_MODULE_8__.layoutWidth)(root);
    const top = this.ownerDocument?.documentElement;

    for (let box = this.parentElement; box && box !== top; box = box.parentElement) {
      if (contentWidth(box) > own + 0.5) return box;
    }

    return root;
  } // The content stands inside the tabs: a panel given (a page panel, a slot,
  // a part or a text) or one the page filled.


  holdsContent() {
    return this.computedItems.some(item => this.pagePanelFor(item, item.index) || this.hasSlotContent?.(item.slotName) || item.panel?.component || typeof item.panel?.text !== 'undefined') || this.drawnPanels().some(panelHasContent);
  }

  readNarrow() {
    if (this.getAttribute('type') !== 'vertical') return false;
    const width = this.placeWidth();

    if (width > 0) {
      const rem = Number.parseFloat(globalThis.getComputedStyle?.(document.documentElement).fontSize) || 16;
      return width < Number.parseFloat(_core_js_breakpoints_js__WEBPACK_IMPORTED_MODULE_6__.BREAKPOINTS.md) * rem;
    }

    return this._narrowMedia?.matches === true;
  }

  followPlace() {
    this.watchPlace();
    const narrow = this.readNarrow();
    if (narrow === this._narrow) return;
    this._narrow = narrow;
    this.requestComponentUpdate('narrow');
  } // Only vertical tabs fold, so only they watch their place.


  watchPlace() {
    if (!this._placeObserver) return; // The tabs' own block and the box they fold by (placeBox): a column that
    // changes width can change which box that is.

    const vertical = this.getAttribute('type') === 'vertical';
    const root = vertical ? this.querySelector(':scope > .sf-tabs') : null;
    const place = vertical ? this.placeBox() || this.parentElement : null;
    if (place === this._watchedPlace && root === this._watchedRoot) return;

    this._placeObserver.disconnect();

    this._watchedPlace = place;
    this._watchedRoot = root;
    if (place) this._placeObserver.observe(place);
    if (root && root !== place) this._placeObserver.observe(root);
  } // The look drawn (C96 item 1): line unless pills or vertical; vertical on a
  // narrow place is the line with «Ещё» (item 5) unless fold="never" (VR11-1;
  // an unknown value is auto). The place is still watched and read under
  // never, so fold back to auto folds a list on a narrow place at once. type="full" is the line with fit
  // always; no type and the scheme fills draw the line.


  get look() {
    const type = this.getAttribute('type');
    if (type === 'pills') return 'pills';
    if (type === 'vertical') return this._narrow && this.getAttribute('fold') !== 'never' ? 'underline' : 'vertical';
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
  } // fit: the tabs share the row equally (C96 item 7); auto on a narrow place,
  // the row's own width below the h1 step (C181 (2)), as the sheet shares a
  // printed row.


  fitsEqually(count) {
    const fit = this.fit;
    if (fit === 'never' || this.look === 'vertical') return false;
    return fit === 'always' ? count > 1 : this.narrowPlace() && count >= 2 && count <= 4;
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
  // An empty panel is no stop either: tabs that drive the host's content
  // elsewhere (sf-view-properties' vertical tabs) drew a stop with nothing to
  // read. A panel the host fills later becomes one then (watched below).
  // A page's panel written with a tabindex keeps it.


  syncPanelFocus() {
    const links = this.links;
    const panels = this.drawnPanels(); // A panel row drawn hidden because no panel had content (the template's
    // data-sf-panels-empty) shows while a drawn panel holds something the
    // host wrote into it, and hides again when it is empty.

    const row = this.querySelector?.(':scope > .sf-tabs > .sf-tabs-main-container[data-sf-panels-empty]');
    if (row && !links) row.hidden = !panels.some(panelHasContent);

    for (const panel of panels) {
      if (this._authoredPanelFocus.has(panel)) continue;
      if (links || !panelHasContent(panel) || panel.querySelector(FOCUSABLE)) panel.removeAttribute('tabindex');else panel.setAttribute('tabindex', '0');
    }

    this.watchPanelContent(panels);
  } // The words or parts a host writes into a drawn panel after the drawing
  // decide its stop again.


  watchPanelContent(panels) {
    if (typeof MutationObserver !== 'function') return;
    this._panelContentObserver ||= new MutationObserver(() => this.schedulePanelFocus());
    this._panelContentWatched ||= new WeakSet();

    for (const panel of panels) {
      if (this._panelContentWatched.has(panel)) continue;

      this._panelContentWatched.add(panel);

      this._panelContentObserver.observe(panel, {
        childList: true,
        subtree: true,
        characterData: true
      });
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
  //
  // A tab that carries `devices` (study S-A, Touch screens rule 4) is shown
  // only in the layouts it names -- the layout of the tabs' place, core's
  // word (phone below 600 px) -- and, like a hidden one, stays in place while
  // it is the active tab.


  get displayItems() {
    const hidden = new Set(this._settings.hidden);
    const layout = this.deviceLayout;
    return this.arrangedItems.filter(item => item.selected || (item.pinned || !hidden.has(item.key)) && (0,_core_js_device_js__WEBPACK_IMPORTED_MODULE_10__.inLayout)(item, layout));
  } // The layout the tabs are shown for, 'phone' or 'desktop' (core
  // SF.device.layoutOf), followed while connected.


  get deviceLayout() {
    return this._deviceLayout || 'desktop';
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
    this.layoutRow();
    this.syncRowTips(); // The sheet shares a narrow row of two to four tabs by itself, so the
    // printed first frame is the laid row (C96 item 7 by C181 (2)); a narrow
    // row whose tabs keep their own widths says so with data-sf-tabs-own.

    const container = this.tabList?.parentElement;
    if (!container) return;
    if (container.hasAttribute('data-sf-tabs-fit') || !this.narrowPlace()) container.removeAttribute('data-sf-tabs-own');else container.setAttribute('data-sf-tabs-own', '');
  } // The row is narrow when the sheet says so: below the h1 step of the row's
  // own width (component.tabs, @container sf-tabs-row), not the screen's.


  narrowPlace() {
    const list = this.tabList;
    return Boolean(list) && getComputedStyle(list).getPropertyValue('--sf-tabs--narrow').trim() === '1';
  }

  layoutRow() {
    const list = this.tabList;
    const more = this.querySelector(':scope > .sf-tabs > .sf-tabs-top-container > .sf-tabs-more');
    if (!list) return;
    const hosts = Array.from(list.children).filter(element => Number.isInteger(tabIndexOf(element)));

    for (const host of hosts) {
      host.classList.remove('sf-tabs-overflowed', 'sf-tabs-squeezed', 'sf-tabs-icon-only'); // The floor stands on the label box itself: sf-button hands its host's
      // style to its button, so a floor left on the host outlived the layout.

      tabBox(host)?.querySelector(':scope > .sf-button-text-container')?.style.removeProperty('--sf-tabs--squeezed-min');
    }

    this._overflowed = [];
    const container = list.parentElement;
    container?.removeAttribute('data-sf-tabs-more-compact'); // The tabs are measured at their own widths; fit shares the row after.

    container?.removeAttribute('data-sf-tabs-fit');
    container?.setAttribute('data-sf-tabs-own', '');

    const showMore = shown => {
      if (shown) container?.setAttribute('data-sf-tabs-more', '');else container?.removeAttribute('data-sf-tabs-more');
    };

    if (this.overflow !== 'more' || this.look === 'vertical') {
      showMore(false);
      this._expectedTabSizes = null;
      return;
    } // Layout widths (1.4.7): the room, the text of «Ещё (n)» measured in canvas
    // and the ResizeObserver sizes are layout pixels, so the tabs are too; a
    // screen box inside scale() or rotate() mixed the two (docs hero study
    // 2026-11-19, section 9).


    const width = host => (0,_core_js_overflow_row_js__WEBPACK_IMPORTED_MODULE_8__.layoutWidth)(tabBox(host));

    const widths = hosts.map(width); // A tab's own width, the label it cuts included (1.5.0, group build 16
    // G12, view record study VRS-2): a tab is at most as wide as the row
    // (max-inline-size 100 %), so a row narrower than the current tab measured
    // it at the row's width -- it "fitted", stayed unshortened, and its label
    // was cut hard («Зака»). With the cut added back it does not fit: it is
    // the shortened one, with an ellipsis, or the row takes others instead.

    const cut = host => {
      const text = tabBox(host)?.querySelector(':scope > .sf-button-text-container');
      return text ? Math.max(0, text.scrollWidth - text.clientWidth) : 0;
    };

    const own = widths.map((value, at) => value + cut(hosts[at]));
    const gap = parseFloat(getComputedStyle(list).columnGap) || 0; // The row's arithmetic is the shared row engine (core/js/overflow-row.js,
    // taken out of these tabs for sf-contents' bar): the tabs in their order
    // up to the first that does not fit, each whole in the row or in «Ещё»
    // (owner decision C54); the room is the row's content box in fractional
    // pixels (rowRoom: clientWidth is a whole pixel, C54 return), before any
    // transform (layoutRowRoom).

    const room = () => (0,_core_js_overflow_row_js__WEBPACK_IMPORTED_MODULE_8__.layoutRowRoom)(list);

    showMore(false);
    this.syncMoreErrors(more, 0);
    let kept = (0,_core_js_overflow_row_js__WEBPACK_IMPORTED_MODULE_8__.fitInOrder)(own, gap, room()); // A shared row gives the first and the last tab back the padding of their
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

    if (!kept && this.fitsEqually(hosts.length) && !(0,_core_js_overflow_row_js__WEBPACK_IMPORTED_MODULE_8__.fitInOrder)(own, gap, room() - edgesBack())) {
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
          widths: own,
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

      hosts.forEach((host, at) => {
        // A class, not a data attribute: sf-button moves its data attributes
        // to the button inside it, and only class and style stay on the host.
        if (!kept.includes(at)) host.classList.add('sf-tabs-overflowed');
      }); // Measured once the tabs «Ещё» holds have left the row (GB16-5): with
      // them still in it, the label's room read the room of four tabs, and
      // the current one went to its icon with its whole name fitting.

      if (laid.squeezed >= 0) {
        hosts[laid.squeezed].classList.add('sf-tabs-squeezed');
        const extraFor = (0,_core_js_overflow_row_js__WEBPACK_IMPORTED_MODULE_8__.triggerExtra)(textBox, label);
        this.squeezeCurrent(hosts[laid.squeezed], list, more, extraFor ? extraFor(this._overflowed.length) : 0);
      }

      this.expectTabSizes(hosts, widths, kept);

      if (more) {
        const text = label(this._overflowed.length);
        const errors = this.errorsOf(this._overflowed);
        more.setAttribute('text', text); // The badge is aria-hidden: the name says the errors, as a tab does
        // («Ещё (3), 2 ошибки»).

        more.setAttribute('aria-label', errors ? `${text}, ${this.errorWords(errors)}` : text);
      }
    }
  } // The current tab alone beside «Ещё» and wider than the row gives way by
  // the tightest-row rule (squeezeStep, group build 16 returns GB16-1 and
  // GB16-2): at least two letters before the ellipsis, else its icon alone,
  // else «Ещё» draws its glyph alone too; a tab of words keeps two letters.
  // Measured in this task, before the trigger draws its new count: extra is
  // how much wider the trigger will be.


  squeezeCurrent(host, list, more, extra = 0) {
    const box = tabBox(host);
    const text = box?.querySelector(':scope > .sf-button-text-container');
    if (!box || !text) return;
    const name = Array.from(((text.querySelector('.sf-tabs-name') ?? text).textContent || '').trim());
    const widthOfText = (0,_core_js_overflow_row_js__WEBPACK_IMPORTED_MODULE_8__.textWidth)(text);
    if (!widthOfText || !name.length) return;
    const twoLetters = widthOfText(name.length > 2 ? `${name.slice(0, 2).join('')}\u2026` : name.join('')); // The label's own width as laid out now (its content box).

    const labelWidth = () => {
      const style = getComputedStyle(text);
      const inner = parseFloat(style.width) || 0;
      const sides = ['paddingInlineStart', 'paddingInlineEnd', 'borderInlineStartWidth', 'borderInlineEndWidth'].reduce((sum, edge) => sum + (parseFloat(style[edge]) || 0), 0);
      return style.boxSizing === 'border-box' ? inner - sides : inner;
    };

    const textRoom = labelWidth() - extra;
    const tabRoom = (0,_core_js_overflow_row_js__WEBPACK_IMPORTED_MODULE_8__.layoutRowRoom)(list) - extra;
    let iconOnly = null;

    if (box.querySelector(':scope > sf-icon, :scope > .sf-icon')) {
      host.classList.replace('sf-tabs-squeezed', 'sf-tabs-icon-only');
      iconOnly = (0,_core_js_overflow_row_js__WEBPACK_IMPORTED_MODULE_8__.layoutWidth)(box);
      host.classList.replace('sf-tabs-icon-only', 'sf-tabs-squeezed');
    }

    const container = list.parentElement;
    const trigger = more?.querySelector(':scope > button');
    let moreGain = 0;
    let compactTextRoom = null;

    if (container && trigger) {
      const full = (0,_core_js_overflow_row_js__WEBPACK_IMPORTED_MODULE_8__.layoutWidth)(trigger) + extra;
      container.setAttribute('data-sf-tabs-more-compact', '');
      moreGain = full - (0,_core_js_overflow_row_js__WEBPACK_IMPORTED_MODULE_8__.layoutWidth)(trigger); // The label beside the glyph-alone trigger, as it will stand (GB16-5):
      // the room the trigger gives back is decided on, not left empty.

      compactTextRoom = labelWidth();
      container.removeAttribute('data-sf-tabs-more-compact');
    }

    const step = (0,_core_js_overflow_row_js__WEBPACK_IMPORTED_MODULE_8__.squeezeStep)({
      tabRoom,
      textRoom,
      twoLetters,
      iconOnly,
      moreGain,
      compactTextRoom
    });
    if (step.icon) host.classList.replace('sf-tabs-squeezed', 'sf-tabs-icon-only');else text.style.setProperty('--sf-tabs--squeezed-min', `${twoLetters}px`);
    if (step.compact) container?.setAttribute('data-sf-tabs-more-compact', '');
  } // The names the tightest row hides (group build 16 return GB16-6): the
  // trigger drawn as its glyph alone and the current tab drawn as its icon
  // alone keep their words out of sight, as their accessible names; a mouse
  // and a keyboard get them as the Framework's tooltip (component.tooltip,
  // C59, C160 (1)), not a browser title -- the surface is a .sf-tooltip in
  // the row's container that the button names by data-tooltip, and the
  // tooltip controller, asked for here only when a name is hidden, links it
  // and shows it on hover, keyboard focus and a long press. A name the row
  // draws again loses its tooltip. The controller does not describe the
  // button with a tooltip that repeats its name.


  syncRowTips() {
    const container = this.tabList?.parentElement;
    const wanted = new Map();

    if (container) {
      const trigger = container.hasAttribute('data-sf-tabs-more-compact') ? container.querySelector(':scope > .sf-tabs-more > button') : null;
      const words = trigger ? String(trigger.closest('.sf-tabs-more')?.getAttribute('aria-label') || trigger.getAttribute('aria-label') || '').trim() : '';
      if (trigger && words) wanted.set('more', {
        button: trigger,
        words
      });
      const host = Array.from(this.tabList.children).find(element => element.classList.contains('sf-tabs-icon-only'));
      const button = host && !(0,_core_js_tag_aliases_js__WEBPACK_IMPORTED_MODULE_4__.isTag)(host, 'sf-button-icon') ? tabBox(host) : null;
      const label = button ? String(this.computedItems[tabIndexOf(host)]?.label ?? '').trim() : '';
      if (button && label) wanted.set('tab', {
        button,
        words: label
      });
    }

    this._rowTips ??= new Map();

    for (const [part, tip] of this._rowTips) {
      const next = wanted.get(part); // A surface still standing in the row is kept, even when the button
      // that names it was drawn anew: a surface put in again is a new node
      // the Loader scans, and that scan woke every row again (step-0 probe).

      if (next && tip.surface.isConnected && tip.surface.parentElement === container) {
        if (next.button !== tip.button && tip.button.getAttribute('data-tooltip') === tip.surface.id) tip.button.removeAttribute('data-tooltip');
        tip.button = next.button;
        continue;
      }

      if (tip.button.getAttribute('data-tooltip') === tip.surface.id) tip.button.removeAttribute('data-tooltip');
      tip.surface.remove();

      this._rowTips.delete(part);
    }

    if (!wanted.size) return; // Asked for once a page: the Loader's ensurePlugin rescans the page until
    // the plugin is there, and a row laid out on every rescan asked again --
    // a 248-row page laid every row out for ever (step-0 probe). A Loader not
    // ready yet (false) is asked again by the next layout.

    if (!rowTipsAsked) rowTipsAsked = globalThis.SF?.Loader?.ensurePlugin?.('tooltip') === true;

    for (const [part, next] of wanted) {
      // A tooltip the page linked itself stays its own.
      const linked = next.button.getAttribute('data-tooltip');

      let tip = this._rowTips.get(part);

      if (linked && linked !== tip?.surface.id) continue;

      if (!tip) {
        const surface = document.createElement('span');
        surface.className = 'sf-tooltip sf-tooltip--dark sf-tooltip--size-1/3 sf-tabs-tooltip';
        surface.id = `${this.tabsId}--${part}-tooltip`;
        surface.hidden = true;
        const content = document.createElement('span');
        content.className = 'sf-tooltip-content';
        const text = document.createElement('span');
        text.className = 'sf-tooltip-text';
        content.append(text);
        surface.append(content);
        container.append(surface);
        tip = {
          button: next.button,
          surface
        };

        this._rowTips.set(part, tip);
      }

      const text = tip.surface.querySelector('.sf-tooltip-text');
      if (text && text.textContent !== next.words) text.textContent = next.words;
      if (next.button.getAttribute('data-tooltip') !== tip.surface.id) next.button.setAttribute('data-tooltip', tip.surface.id);
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

    badge.className = `${(0,_js_templates_default__WEBPACK_IMPORTED_MODULE_11__.errorBadgeClasses)(errors)} sf-tabs-more-errors`;
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
    if (!entries.length) return; // The page's one menu (core SF.menu.open, owner decision C184 (4)); a
    // second press on «Ещё» closes it.

    const choice = await (0,_core_js_menu_open_js__WEBPACK_IMPORTED_MODULE_9__.menuOpen)({
      anchor,
      entries,
      label: this.text('more'),
      size: this.menuSize()
    });
    if (choice?.id != null && this.isConnected) this.activate(Number(choice.id), null, {
      person: true
    });
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

    globalThis.SF?.Loader?.ensure?.(['sf-sortable', 'sf-checkbox'], {
      press: true
    }); // A press opens the settings: the wait goes on while the menu's code is
    // on its way (SF.Loader.ensure press, GB18 L2; GB19).

    await globalThis.SF?.Loader?.ensure?.(['sf-menu-context'], {
      press: true
    });
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
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_11__.renderTabsTemplate)(this.templateContext());
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
/* harmony import */ var _core_js_device_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("cbcfcde04d12");
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
        data-sf-devices=${devicesMark(item)}
      data-tab-label=${item.label}
      data-tooltip=${item.hint ? hintId(item, context) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    ><sf-icon root-class="pointer-events-none" icon=${item.iconStart || item.icon || item.iconEnd || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      weight="400" aria-hidden="true"></sf-icon></a>`;
} // A tab that carries `devices` says them on its button (data-sf-devices,
// DEV answer 3 on group build 20): the element leaves the other layout's tabs
// out when it draws, but static first-paint markup is printed at one width,
// and core.styles hides a printed «desktop» tab below the phone layout
// signal (SF.device PHONE_BELOW) and a printed «phone» tab above it until
// the element draws. The selected tab is always drawn, so it is not marked.


function devicesMark(item) {
  const scope = item.selected ? null : (0,_core_js_device_js__WEBPACK_IMPORTED_MODULE_2__.devicesOf)(item);
  return scope ? scope.join(' ') : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
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
        data-sf-devices=${devicesMark(item)}
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
        data-sf-devices=${devicesMark(item)}
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
        data-sf-devices=${devicesMark(item)}
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
// Tabs keep their panels (each tab's aria-controls names one) in a hidden
// row marked data-sf-panels-empty when none has, so a tab row used
// as a switcher (a board's lanes on a phone, a settings head) takes no room
// under it: the row's padding was 24 px of nothing (view round 2 board,
// 2026-11-18). Words or parts a host writes into a drawn panel later show
// the row again (index.js syncPanelFocus).


function hasPanelContent(context) {
  return context.items.some(item => context.pagePanel?.(item, item.index) || context.component?.hasSlotContent?.(item.slotName) || item.panel?.component || typeof item.panel?.text !== 'undefined');
}

function renderTabsTemplate(context) {
  // The look drawn (C96 item 1): line, plate (pills) or the menu column
  // (vertical); a custom template still reads context.type.
  const look = context.look ?? context.type;
  const vertical = look === 'vertical';
  const panels = hasPanelContent(context);
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

      ${context.links && !hasPanelContent(context) ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-tabs-main-container" ?hidden=${!panels} ?data-sf-panels-empty=${!panels}>
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

/***/ "c74d9c9cd2e0"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   files: () => (/* binding */ files)
/* harmony export */ });
/* harmony import */ var _en_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("33cd7c3c3aca");
// Written by scripts/build-language-packs.mjs from src/core/lang/built-in.json
// (owner decision C282); do not edit. The words this bundle carries: the
// built-in languages' (en); every other language comes from
// a language file (core/lang/<code>.js or its parts).


const files = { en: { runtime: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime } };

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ en: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime });


/***/ },

/***/ "51b106697124"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-tabs for the shim (core/js/aliases.js, standard §16 item 20). mode: same-detail (the shim sends the new and the old name), split (the old detail from the element\'s adapter), host-attribute (no shim).","component":"sf-tabs","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"sf-tab-change","to":"sf-tabs-change","kind":"event","component":"sf-tabs","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":false,"section":"§8, §16 item 42","note":"the old detail adds component, tagName and template, which §8 takes out of the new one: the element\'s detail adapter makes it"},{"from":"data-tab","to":"data-sf-tab-index","kind":"attribute","component":"sf-tabs","since":"2026-11-12","remove_after":"2027-01-01","mode":"retired","section":"§3.1 (a name the component writes carries its prefix); R193 DP-11","note":"written beside data-sf-tab-index on each tab for one minor (1.2.x) and dropped in 1.3.0: a page selector [data-tab] caught the tabs\' own buttons (the dropdown-panels prototype hid tab 0 with pane 0); read data-sf-tab-index"}]}');

/***/ },

/***/ "84d032c55810"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.tabs","tag":"sf-tabs","version":"1.6.2","kind":"leaf","settings":{"type":{"type":"enum","values":["underline","pills","full","vertical"],"optional":true},"size":{"type":"enum","values":["1/2","1","2"],"default":"1"},"variant":{"type":"string","default":"buttons"},"scheme":{"type":"string","default":"default"},"top-position":{"type":"string","default":"start"},"active-index":{"type":"number","integer":true,"min":0,"default":0},"items":{"type":"list","default":[],"of":{"id":"id","label":"string","icon":{"type":"icon","optional":true},"count":{"type":"number","optional":true},"errors":{"type":"number","optional":true},"href":{"type":"string","optional":true},"disabled":{"type":"boolean","optional":true},"hint":{"type":"string","optional":true},"pinned":{"type":"boolean","optional":true},"devices":{"type":"list","optional":true}}},"top-class":{"type":"string","default":""},"panel-class":{"type":"string","default":""},"overflow":{"type":"enum","values":["scroll","wrap","more"],"default":"more"},"fit":{"type":"enum","values":["auto","always","never"],"default":"auto"},"fold":{"type":"enum","values":["auto","never"],"default":"auto"},"configurable":{"type":"boolean","default":false},"lazy":{"type":"boolean","default":false},"hash":{"type":"boolean","default":false},"sticky":{"type":"boolean","default":false},"settings":{"type":"object"}},"values":{"selected":{"type":"id","default":""}},"events":{"change":{"x-native":false,"carries":{"selected":"id","previous":"number","current":"number","item":"object","items":"list"}},"settings-change":{"carries":{"order":{"type":"list","schema":{"items":{"type":"string"}}},"hidden":{"type":"list","schema":{"items":{"type":"string"}}},"reason":{"type":"enum","values":["order","visibility"],"optional":true}},"own-verb":true},"settings-reset":{"carries":{},"own-verb":true}},"actions":{"set-data":{"with":{"data":"object","reason":{"type":"string","optional":true}}},"set-panels":{"with":{"panels":"list","reason":{"type":"string","optional":true}}},"go-to":{"with":{"index":"number"}},"go-to-error":{"with":{}}},"css-variables":{"--sf-tabs-color":{"type":"color","state":"default"},"--sf-tabs-indicator-color":{"type":"color","state":"selected"},"--sf-tabs-indicator-width":{"type":"length","state":"selected"},"--sf-tabs-border-color":{"type":"color","state":"default"},"--sf-tabs-border-width":{"type":"length","state":"default"},"--sf-tabs-gap":{"type":"length","state":"default"},"--sf-tabs-sticky-top":{"type":"length","state":"default"}}}');

/***/ },

/***/ "33cd7c3c3aca"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Tabs","events":{"settings-change":{"label":"Tabs arranged"},"settings-reset":{"label":"Tabs reset"}},"runtime":{"customize":"Customize tabs","errors":{"one":"{n} error","other":"{n} errors"},"more":"More","moved":"Moved","pinned":"Always shown","reset":"Reset","tab":"Tab {n}","visible":"Shown"}}');

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