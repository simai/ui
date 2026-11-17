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
//   anchor.
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
    } = options || {};
    const atPoint = !(anchor instanceof Element);
    if (atPoint && !(Number.isFinite(Number(x)) && Number.isFinite(Number(y)))) return null;
    const doc = globalThis.document;
    if (!doc) return null;
    await globalThis.SF?.Loader?.ensure?.(['sf-menu-context']);
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
        target: returnTo ?? undefined
      }) : menu.openFor(pointAnchor(Number(x), Number(y), returnTo), {
        side: 'block-end',
        align: 'start',
        focus: 'first'
      }) : menu.openFor(anchor, {
        side: 'block-end',
        align: 'start',
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
/* harmony export */   measureShown: () => (/* binding */ measureShown),
/* harmony export */   openRowMenu: () => (/* binding */ openRowMenu),
/* harmony export */   readPriority: () => (/* binding */ readPriority),
/* harmony export */   rowRoom: () => (/* binding */ rowRoom),
/* harmony export */   spanOf: () => (/* binding */ spanOf),
/* harmony export */   spanOfUnits: () => (/* binding */ spanOfUnits),
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
// thrown), one per owner and field, on the body or in the open dialog. The
// one copy in core (defect TL-8): the sortable inserter and the handle's move
// menu place theirs through it too. null when no sf-menu-context came (no
// Loader, or the relation failed): an element that never upgrades opens
// nothing. setup(menu) runs once on a new menu, for the listeners an owner
// adds beside select.

async function standardMenu(owner, field, select, {
  setup
} = {}) {
  await globalThis.SF?.Loader?.ensure?.(['sf-menu-context']);
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

/***/ "fea62563f6ac"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SfContents: () => (/* binding */ SfContents),
/* harmony export */   parseLevels: () => (/* binding */ parseLevels),
/* harmony export */   slugOf: () => (/* binding */ slugOf)
/* harmony export */ });
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _core_js_breakpoints_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("1373e294ec38");
/* harmony import */ var _core_js_overflow_row_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("2db3a835ac11");
/* harmony import */ var _core_js_menu_open_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("8d229b7c92e9");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("cd89fc8cb241");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("98e539eba4a2");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("8e187cb370e4");
/* harmony import */ var _lang_index_mjs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("52dd2df8d015");
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("39f7a04bb258");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_5__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_5__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
// sf-contents: the table of contents of one page («Оглавление») -- its
// sections as in-page links, the current one marked while the page scrolls.
//
// One list, four views (the stylesheet's): a side column with the current
// section's bar, the sheet -- a button with the reading progress that opens
// the list -- strokes at the edge with the names on hover and focus, and a
// sticky row of anchor tabs; auto is the column on a wide screen and the sheet
// below the collapse step, by a media rule, so the printed markup is
// right before this code arrives.
//
// The sections are the items a server gives (the JSON island, or the
// property), else links written inside the element, else the headings of the
// target in the levels range. The printed list is plain links: without the
// script the browser jumps to the section.
//
// The current section is the last one whose top is at or above the top of the
// scroll area -- the container's scroll-padding-top, where a page with a
// sticky header says how much of the top is covered -- asked by an
// IntersectionObserver over the sections and a frame-throttled scroll
// listener, which also gives the reading progress.
//
// From its component.json (§3, §4, §8): the settings are made by
// core/js/element-manifest.js, refresh and toggle are the actions and answer
// outcomes, change is the fact sf-contents-change, the words are the language
// files'.








 // Only the words on screen ship in the bundle, English only (owner decision
// C282): Russian and every other language come from a language file. The
// title, settings and events stay in the language files for the Studio and the
// docs (localization study LC-2).

 // The values of hash (CT-10): choose writes the address when a section is
// chosen, scroll also while the page scrolls, false never. true and an empty
// attribute, the boolean of 1.4, read as the default.

const HASH_MODES = ['choose', 'scroll', 'false']; // The statuses an entry may carry (C95 point 6, CT-07); error also sends a
// chosen entry to the first invalid field of its section.

const STATUSES = ['error', 'warning', 'success']; // A field that says it is invalid: a Framework field's invalid setting, an
// aria-invalid control, a control the browser found invalid after the person
// touched it.

const INVALID = '[invalid]:not([invalid="false"]), [aria-invalid="true"], :user-invalid'; // A chosen section holds the answer while its scroll moves -- each scroll
// event extends the hold by this long, so a long smooth scroll keeps it and a
// section already in place lets it go at once -- and, once the scroll ended,
// while the section is in view and the person has not scrolled again: a
// section near the end of the page that cannot reach the top stays chosen.

const HOLD_MS = 300;
let sequence = 0; // layout compact is a dated value alias of sheet (aliases.json, C134).

const ContentsElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_6__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: _lang_index_mjs__WEBPACK_IMPORTED_MODULE_8__.files,
  source: 'ru',
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_7__,
  actions: {
    refresh() {
      this.collect();
      return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.applied)();
    },

    toggle() {
      return this.isOpen ? this.closeList({
        restoreFocus: false
      }) : this.openList();
    }

  }
}); // The heading levels of a levels setting: "2-3", "2", "2,3".

function parseLevels(value) {
  const text = String(value ?? '').trim();
  const range = text.match(/^([1-6])\s*-\s*([1-6])$/u);

  if (range) {
    const [from, to] = [Number(range[1]), Number(range[2])].sort((a, b) => a - b);
    return Array.from({
      length: to - from + 1
    }, (_, at) => from + at);
  }

  const list = text.split(/[\s,]+/u).map(Number).filter(level => Number.isInteger(level) && level >= 1 && level <= 6);
  return list.length ? [...new Set(list)].sort((a, b) => a - b) : [2, 3];
} // An id for a heading that has none: its words, lower case, joined by -.

function slugOf(text) {
  return String(text ?? '').toLowerCase().trim().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-+|-+$/gu, '') || 'section';
} // What a heading says, without what it hides from assistive technology (an
// anchor mark, a permalink glyph).

function headingText(element) {
  const copy = element.cloneNode(true);
  copy.querySelectorAll('[aria-hidden="true"], .sf-sr-only-skip, script, style').forEach(node => node.remove());
  return copy.textContent.replace(/\s+/gu, ' ').trim();
}

const isScrollable = element => {
  const style = getComputedStyle(element);
  return /(auto|scroll|overlay)/u.test(style.overflowY) && element.scrollHeight > element.clientHeight + 1;
};

const reducedMotion = () => globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;

class SfContents extends ContentsElement {
  constructor() {
    super();
    this._id = `sf-contents-${++sequence}`;
    this.isOpen = false;
    this._sections = [];
    this._childItems = [];
    this._current = '';
    this._progress = 0;
    this._answered = false;
    this._hold = null;
    this._media = null;
    this._observer = null;
    this._scroller = null;
    this._frame = 0;
    this._revealCurrent = false;
    this._focusCurrent = false;

    this._onMedia = () => this.syncCompact();

    this._onScroll = event => {
      if (this._hold && event?.type === 'scroll') {
        if (this._hold.settled || Date.now() > this._hold.until) this._hold = null;else this._hold.until = Date.now() + HOLD_MS;
      }

      this.scheduleSpy();
    };

    this._onScrollEnd = () => {
      if (this._hold) this._hold.settled = true;
      this.scheduleSpy();
    };

    this._onOutside = event => {
      if (!this.isOpen) return;
      const path = event.composedPath?.() ?? [];
      if (!path.includes(this)) this.closeList({
        restoreFocus: false
      });
    };

    this._onReady = () => this.collect();

    this._lastPointer = '';

    this._onPointer = event => {
      this._lastPointer = event.pointerType || '';
    };

    this._overflowed = [];
    this._overflowFrame = 0;
    this._resizeObserver = typeof ResizeObserver === 'function' ? new ResizeObserver(() => this.layoutOverflowNow()) : null;
  } // The mode of the address (CT-10); the boolean of 1.4 reads as choose.


  get hashMode() {
    const value = this.getAttribute('hash');
    return HASH_MODES.includes(value) ? value : 'choose';
  } // The read-only value current (component.json values).


  get current() {
    return this._current;
  } // A list set by the page or read from the island collects again.


  get items() {
    return super.items;
  }

  set items(value) {
    super.items = value;
    if (this._isMounted) this.collect();
  } // The sheet view is showing: layout sheet, or auto below the collapse step.
  // (The getter and the host state data-compact keep their names: they are
  // not the setting's value.)


  get compact() {
    if (this.layout === 'sheet') return true;
    if (this.layout !== 'auto') return false;
    return this._media ? !this._media.matches : false;
  } // The links written inside the element are its items (the default slot):
  // read once, taken out, and drawn as the list.


  onConnected() {
    super.onConnected?.();
    const nodes = Array.from(this.children).filter(child => !child.hasAttribute('slot') && !child.hasAttribute('data-sf-static') && child.localName !== 'script' && child.localName !== 'template');
    const links = nodes.flatMap(node => node.matches?.('a[href^="#"]') ? [node] : Array.from(node.querySelectorAll?.('a[href^="#"]') ?? []));

    if (links.length) {
      this._childItems = links.map(link => ({
        id: decodeURIComponent(link.getAttribute('href').slice(1)),
        text: link.textContent.replace(/\s+/gu, ' ').trim(),
        level: Number(link.dataset.level || link.getAttribute('aria-level')) || 2,
        count: Number(link.dataset.count) || 0,
        status: link.dataset.status || ''
      })).filter(item => item.id);
      nodes.forEach(node => node.remove());
    }

    this.addEventListener('pointerdown', this._onPointer, true);
    this.watchMedia();
    this.collect();
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', this._onReady, {
      once: true
    });
  }

  onDisconnected() {
    this.stopSpy();
    this._media?.removeEventListener?.('change', this._onMedia);
    this._media = null;
    document.removeEventListener('DOMContentLoaded', this._onReady);
    document.removeEventListener('pointerdown', this._onOutside, true);
    this.removeEventListener('pointerdown', this._onPointer, true);
    this._resizeObserver?.disconnect();
    this._observedRow = null;
    this._observedTrigger = null;
    if (this._fontsListener) globalThis.document?.fonts?.removeEventListener?.('loadingdone', this._fontsListener);
    this._fontsListener = null;
    if (this._overflowFrame) globalThis.cancelAnimationFrame?.(this._overflowFrame);
    this._overflowFrame = 0;
    this._moreMenu?.close?.({
      restoreFocus: false
    });
    this._moreMenu?.remove?.();
    this._moreMenu = null;
    this.isOpen = false;
    super.onDisconnected?.();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (oldValue === newValue || !this._isMounted) return;
    if (name === 'layout' || name === 'collapse') this.watchMedia();
    if (name === 'layout' && this.isOpen && !this.canOpen) this.closeList({
      restoreFocus: false
    });
    if (name === 'target' || name === 'levels') this.collect();
    if (name === 'expand') this.requestComponentUpdate('expand');
  }

  watchMedia() {
    this._media?.removeEventListener?.('change', this._onMedia); // Compact below the Framework's step (core/js/breakpoints.js, the sheet's
    // own ladder; reuse audit 2026-11-02, finding 6).

    this._media = this.layout === 'auto' ? (0,_core_js_breakpoints_js__WEBPACK_IMPORTED_MODULE_2__.breakpointMedia)(this.collapse) : null;
    this._media?.addEventListener?.('change', this._onMedia);
    this.syncCompact();
  } // The window crossed the step: the host says so, and a list the column no
  // longer opens closes.


  syncCompact() {
    this.sfHostState('data-compact', this.compact);
    if (!this.canOpen && this.isOpen) this.closeList({
      restoreFocus: false
    });
    this.requestComponentUpdate('compact');
  } // The content the headings are collected from.


  targetElement() {
    const selector = this.target;

    if (selector) {
      try {
        const found = document.querySelector(selector);
        if (found) return found;
      } catch {
        globalThis.console?.warn?.(`[SIMAI Framework] sf-contents: target "${selector}" is not a selector`);
      }

      return null;
    }

    return document.querySelector('main') ?? document.body;
  } // The sections: the items, else the links written inside, else the
  // headings of the target. A heading without an id is given one.


  collect() {
    const given = (Array.isArray(this.items) && this.items.length ? this.items : this._childItems).filter(item => item && item.id).map(item => ({
      id: String(item.id),
      text: String(item.text ?? item.label ?? item.id),
      level: Number(item.level) || 2,
      count: Number(item.count) || 0,
      status: STATUSES.includes(item.status) ? item.status : ''
    }));
    let sections;

    if (given.length) {
      sections = given.map(item => ({ ...item,
        element: document.getElementById(item.id)
      }));
    } else {
      const root = this.targetElement();
      const levels = parseLevels(this.levels);
      const selector = levels.map(level => `h${level}`).join(', ');
      const headings = root ? Array.from(root.querySelectorAll(selector)) : [];
      const taken = new Set();
      sections = headings.filter(heading => !this.contains(heading) && !heading.closest('[hidden], sf-contents, [data-sf-contents-skip]')).map(heading => {
        const text = headingText(heading);

        if (!heading.id) {
          const base = slugOf(text);
          let id = base;

          for (let n = 2; document.getElementById(id) || taken.has(id); n += 1) id = `${base}-${n}`;

          heading.id = id;
        }

        taken.add(heading.id);
        return {
          id: heading.id,
          text,
          level: Number(heading.localName.slice(1)),
          element: heading
        };
      }).filter(section => section.text);
    }

    this._sections = sections; // Fewer than two sections say nothing the page does not (CT-03, C95
    // point 5): the host says so and the sheet draws nothing.

    this.sfHostState('data-empty', sections.length < 2);
    this.startSpy();
    this.spy({
      emit: false
    });
    this.requestComponentUpdate('sections');
  } // The element that scrolls the sections: the nearest scrolling ancestor of
  // the first one, else the window (null).


  scroller() {
    const first = this._sections.find(section => section.element)?.element;

    for (let node = first?.parentElement; node && node !== document.body && node !== document.documentElement; node = node.parentElement) {
      if (isScrollable(node)) return node;
    }

    return null;
  } // How much of the top of the scroll area is covered: its scroll-padding-top.


  coveredTop() {
    const element = this._scroller ?? document.documentElement;
    const value = parseFloat(getComputedStyle(element).scrollPaddingTop);
    return Number.isFinite(value) ? value : 0;
  }

  startSpy() {
    this.stopSpy();
    this._scroller = this.scroller();
    const source = this._scroller ?? globalThis;
    source.addEventListener('scroll', this._onScroll, {
      passive: true
    });
    source.addEventListener('scrollend', this._onScrollEnd, {
      passive: true
    });
    globalThis.addEventListener('resize', this._onScroll, {
      passive: true
    });
    this._source = source;

    if (typeof globalThis.IntersectionObserver === 'function') {
      this._observer = new IntersectionObserver(() => this.scheduleSpy(), {
        root: this._scroller,
        rootMargin: `-${Math.round(this.coveredTop())}px 0px 0px 0px`,
        threshold: [0, 1]
      });

      this._sections.forEach(section => section.element && this._observer.observe(section.element));
    }
  }

  stopSpy() {
    this._observer?.disconnect();
    this._observer = null;
    this._source?.removeEventListener('scroll', this._onScroll);
    this._source?.removeEventListener('scrollend', this._onScrollEnd);
    globalThis.removeEventListener('resize', this._onScroll);
    this._source = null;
    if (this._frame) globalThis.cancelAnimationFrame?.(this._frame);
    this._frame = 0;
  }

  scheduleSpy() {
    if (this._frame) return;

    const run = () => {
      this._frame = 0;
      this.spy();
    };

    this._frame = typeof globalThis.requestAnimationFrame === 'function' ? globalThis.requestAnimationFrame(run) : (Promise.resolve().then(run), 1);
  } // The current section and the reading progress, from the geometry now.


  spy({
    emit = true
  } = {}) {
    const sections = this._sections;
    const scroller = this._scroller;
    const area = scroller ? scroller.getBoundingClientRect() : {
      top: 0,
      bottom: globalThis.innerHeight || 0
    };
    const scrolling = scroller ?? document.scrollingElement ?? document.documentElement;
    const room = scrolling.scrollHeight - scrolling.clientHeight; // Nothing to scroll is nothing read yet: the printed line starts empty.

    const progress = room > 1 ? Math.min(1, Math.max(0, scrolling.scrollTop / room)) : 0;
    this.setProgress(progress);

    if (!sections.length) {
      this.setCurrent('', {
        emit
      });
      return;
    }

    const line = area.top + this.coveredTop();
    let id = sections[0].id;

    for (const section of sections) {
      if (!section.element) continue;
      const margin = parseFloat(getComputedStyle(section.element).scrollMarginTop) || 0;
      if (section.element.getBoundingClientRect().top - margin <= line + 1) id = section.id;
    }

    if (room > 1 && scrolling.scrollTop >= room - 2) {
      const shown = sections.filter(section => section.element && section.element.getBoundingClientRect().top < area.bottom);
      if (shown.length) id = shown.at(-1).id;
    }

    const held = this._hold && sections.find(section => section.id === this._hold.id);
    const inView = held?.element && held.element.getBoundingClientRect().top < area.bottom && held.element.getBoundingClientRect().bottom > area.top;
    if (held && (this._hold.settled ? inView : Date.now() < this._hold.until)) id = held.id;else this._hold = null;
    this.setCurrent(id, {
      emit
    });
  }

  setProgress(progress) {
    if (Math.abs(progress - this._progress) < 0.001) return;
    this._progress = progress; // The line follows every frame without a redraw of the list.

    this.querySelector(':scope .sf-contents-progress-value')?.style.setProperty('--sf-contents--progress', String(progress));
  } // via: scroll (the spy) or choose (a section chosen). The address follows a
  // scroll only with hash="scroll" (CT-10).


  setCurrent(id, {
    emit = true,
    via = 'scroll'
  } = {}) {
    const previous = this._current;
    const first = !this._answered;
    this._answered = true;
    if (id === previous) return;
    this._current = id;
    this._revealCurrent = true;
    this.requestComponentUpdate('current');
    if (first || !emit || !id) return;
    if (via === 'scroll' && this.hashMode === 'scroll') this.writeHash(id);
    this.sfEmit('change', {
      id,
      previous: previous || null
    });
  } // #id in the address, with replaceState: no history entry.


  writeHash(id) {
    if (!id || this.hashMode === 'false' || globalThis.location?.hash === `#${encodeURIComponent(id)}`) return;

    try {
      globalThis.history?.replaceState(globalThis.history.state, '', `#${encodeURIComponent(id)}`);
    } catch {// A sandboxed frame may refuse; the address is a convenience.
    }
  } // A link chosen: its section, smoothly unless the person asked for less
  // motion, focus there, the address and the answer at once.


  choose(event, id) {
    if (event.defaultPrevented || event.button > 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return; // The rail where nothing hovers (CT-04): the first tap on a stroke shows
    // the names, as the hover does; a tap on a shown name goes there. A
    // keyboard's Enter (no pointer) goes at once: focus already shows them.

    if (this.layout === 'rail' && !this.isOpen && this._lastPointer === 'touch' && !this.hovers()) {
      event.preventDefault();
      this._lastPointer = '';
      this.openList();
      return;
    }

    this._lastPointer = '';
    this.jumpTo(id, event);
  } // The first invalid field of a section: after its element (or inside it)
  // and before the next section's.


  firstInvalid(section) {
    const at = this._sections.indexOf(section);

    const start = section.element;
    const end = this._sections.slice(at + 1).find(one => one.element)?.element ?? null;
    const scope = this.targetElement() ?? document.body;
    let fields;

    try {
      fields = Array.from(scope.querySelectorAll(INVALID));
    } catch {
      // A browser without :user-invalid.
      fields = Array.from(scope.querySelectorAll(INVALID.replace(/, :user-invalid$/u, '')));
    }

    const after = node => start === node || start.contains(node) || Boolean(start.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_FOLLOWING);

    const before = node => !end || Boolean(node.compareDocumentPosition(end) & Node.DOCUMENT_POSITION_FOLLOWING);

    return fields.find(node => !this.contains(node) && after(node) && before(node) // A field inside a Framework field is the field's own control: the outer one is focused.
    && !fields.some(outer => outer !== node && outer.contains(node))) ?? null;
  } // An entry's accessible name with its mark (C95 point 6): «Контакты: 2
  // ошибки», «Оплата: есть предупреждения», «Доставка: 3».


  markedName(text, {
    count = 0,
    status = ''
  } = {}) {
    if (status && count) return `${text}: ${this.sfWord(`count-${status}`, {
      count
    })}`;
    if (status) return `${text}: ${this.sfWord(`status-${status}`)}`;
    return `${text}: ${count}`;
  } // The device has no hover: a touch screen, where :hover never comes.


  hovers() {
    return globalThis.matchMedia?.('(hover: hover)').matches === true;
  } // The section of id: scrolled to, focused, current, in the address. A
  // section marked error goes to its first invalid field instead of its
  // heading (C95 point 6, CT-07), centred, the field focused.


  jumpTo(id, event = null) {
    const section = this._sections.find(one => one.id === id);

    const element = section?.element ?? document.getElementById(id);
    if (this.isOpen) this.closeList({
      restoreFocus: false
    });
    if (!element) return;
    event?.preventDefault();
    this._hold = {
      id,
      until: Date.now() + HOLD_MS
    };
    const field = section?.status === 'error' ? this.firstInvalid(section) : null; // instant, not auto: auto is the page's scroll-behavior, which may be smooth.

    const behavior = reducedMotion() ? 'instant' : 'smooth';

    if (field) {
      field.scrollIntoView({
        behavior,
        block: 'center'
      });
      field.focus({
        preventScroll: true
      });
      this.setCurrent(id, {
        emit: true,
        via: 'choose'
      });
      this.writeHash(id);
      return;
    }

    element.scrollIntoView({
      behavior,
      block: 'start'
    });
    if (!element.matches('a[href], button, input, select, textarea, [tabindex]')) element.setAttribute('tabindex', '-1');
    element.focus({
      preventScroll: true
    });
    this.setCurrent(id, {
      emit: true,
      via: 'choose'
    });
    this.writeHash(id);
  } // The sheet view's list, or the rail's names (CT-04), can open.


  get canOpen() {
    return this.compact || this.layout === 'rail';
  } // The action toggle opens the sheet view's list, and in the rail shows
  // the names.


  openList() {
    if (this.isOpen) return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.applied)();
    if (!this.canOpen) return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.refused)('not-compact');
    this.isOpen = true;
    this.sfHostState('data-open', true);
    document.addEventListener('pointerdown', this._onOutside, true);
    this.requestComponentUpdate('open'); // The sheet's list (a bottom sheet on a phone) opens on the current
    // entry: focus goes to its link, so the keyboard and a screen reader start
    // where the reader is (C95 point 4, CT-08). The rail keeps focus.

    if (this.compact) this._focusCurrent = true;
    return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.applied)();
  }

  focusCurrent() {
    if (!this.isOpen || !this.compact) return;
    const list = this.querySelector(':scope .sf-contents-list');
    const link = list?.querySelector('[aria-current="location"]') ?? list?.querySelector('.sf-contents-link');
    link?.focus({
      preventScroll: true
    }); // The current entry in view inside the list, never the page.

    if (link && list && list.scrollHeight > list.clientHeight) {
      const box = list.getBoundingClientRect();
      const at = link.getBoundingClientRect();
      if (at.top < box.top || at.bottom > box.bottom) list.scrollTop += at.top - box.top - (box.height - at.height) / 2;
    }
  }

  closeList({
    restoreFocus = true
  } = {}) {
    if (!this.isOpen) return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.refused)('closed');
    this.isOpen = false;
    this.sfHostState('data-open', false);
    document.removeEventListener('pointerdown', this._onOutside, true);
    this.requestComponentUpdate('close');
    if (restoreFocus && this.compact) this.toggleButton()?.focus({
      preventScroll: true
    });
    return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.applied)();
  }

  toggleButton() {
    return this.querySelector(':scope .sf-contents-toggle button');
  }

  onKeydown(event) {
    if (event.key !== 'Escape' || !this.isOpen || event.defaultPrevented) return;
    event.preventDefault();
    event.stopPropagation();
    this.closeList({
      restoreFocus: true
    });
  } // The sheet's button is what the host's focus() reaches in the sheet
  // view (the host is display: contents and has no box).


  focusDelegate() {
    return this.compact ? this.toggleButton() : this.querySelector(':scope .sf-contents-link');
  } // The bar keeps the current tab in view by scrolling itself, never the page;
  // with overflow more it is laid out instead, the current tab in the row.


  afterRender(changed) {
    const result = super.afterRender?.(changed);

    if (this._focusCurrent) {
      this._focusCurrent = false;
      this.focusCurrent();
    }

    this.watchRow();

    if (this.overflowsToMore()) {
      this._revealCurrent = false;
      this.layoutOverflow();
    } else if (this._revealCurrent && this.layout === 'bar') {
      this._revealCurrent = false;
      const list = this.querySelector(':scope .sf-contents-list');
      const link = list?.querySelector('[aria-current="location"]');

      if (list && link && list.scrollWidth > list.clientWidth) {
        const box = list.getBoundingClientRect();
        const at = link.getBoundingClientRect();
        let left = list.scrollLeft;
        if (at.left < box.left) left -= box.left - at.left;else if (at.right > box.right) left += at.right - box.right;
        if (left !== list.scrollLeft) list.scrollTo({
          left,
          behavior: reducedMotion() ? 'instant' : 'smooth'
        });
      }
    }

    return result;
  } // ─── «Ещё (n)» of the bar (CT-05) ───────────────────────────────────────


  overflowsToMore() {
    return this.layout === 'bar' && this.overflow !== 'scroll';
  }

  row() {
    return this.querySelector(':scope .sf-contents-list');
  }

  trigger() {
    return this.querySelector(':scope .sf-contents-more');
  } // The row and the trigger's button are watched: a resize lays the row out
  // in the observer's callback, before the paint; a font arriving later too.


  watchRow() {
    if (!this._resizeObserver) return;
    const row = this.overflowsToMore() ? this.row() : null;
    const button = row ? this.trigger()?.querySelector(':scope > button') : null;

    if (row !== this._observedRow) {
      if (this._observedRow) this._resizeObserver.unobserve(this._observedRow);
      if (row) this._resizeObserver.observe(row);
      this._observedRow = row;
    }

    if (button !== this._observedTrigger) {
      if (this._observedTrigger) this._resizeObserver.unobserve(this._observedTrigger);
      if (button) this._resizeObserver.observe(button);
      this._observedTrigger = button;
    }

    if (row && !this._fontsListener && globalThis.document?.fonts?.addEventListener) {
      this._fontsListener = () => this.scheduleOverflow();

      document.fonts.addEventListener('loadingdone', this._fontsListener);
    }
  }

  scheduleOverflow() {
    if (this._overflowFrame || typeof globalThis.requestAnimationFrame !== 'function') return;
    this._overflowFrame = globalThis.requestAnimationFrame(() => {
      this._overflowFrame = 0;
      this.layoutOverflow();
    });
  }

  layoutOverflowNow() {
    if (this._overflowFrame) globalThis.cancelAnimationFrame?.(this._overflowFrame);
    this._overflowFrame = 0;
    this.layoutOverflow();
  } // The sections in their order up to the first that does not fit, the
  // current one always kept; the rest whole in «Ещё (n)» (core/js/overflow-row.js).


  layoutOverflow() {
    const row = this.row();
    const nav = row?.parentElement;
    if (!row || !nav) return;
    const items = Array.from(row.children);

    for (const item of items) item.classList.remove('sf-contents-overflowed', 'sf-contents-squeezed');

    this._overflowed = [];
    nav.removeAttribute('data-more');
    if (!this.overflowsToMore() || items.length < 2) return;
    const widths = items.map(item => item.getBoundingClientRect().width);
    const gap = parseFloat(getComputedStyle(row).columnGap) || 0;
    if (!(0,_core_js_overflow_row_js__WEBPACK_IMPORTED_MODULE_3__.fitInOrder)(widths, gap, (0,_core_js_overflow_row_js__WEBPACK_IMPORTED_MODULE_3__.rowRoom)(row))) return;
    nav.setAttribute('data-more', '');
    const current = items.findIndex(item => item.querySelector('[aria-current="location"]'));
    const more = this.trigger();

    const label = count => `${this.sfWord('more')} (${count})`;

    const {
      kept,
      squeezed
    } = (0,_core_js_overflow_row_js__WEBPACK_IMPORTED_MODULE_3__.fitBesideMore)({
      widths,
      gap,
      room: (0,_core_js_overflow_row_js__WEBPACK_IMPORTED_MODULE_3__.rowRoom)(row),
      current,
      must: current >= 0 ? [current] : [],
      extra: (0,_core_js_overflow_row_js__WEBPACK_IMPORTED_MODULE_3__.triggerExtra)(more?.querySelector(':scope > button .sf-button-text-container'), label)
    });
    items.forEach((item, at) => {
      if (!kept.includes(at)) item.classList.add('sf-contents-overflowed');
    });
    if (squeezed >= 0) items[squeezed].classList.add('sf-contents-squeezed');
    this._overflowed = items.map((_, at) => at).filter(at => !kept.includes(at)).map(at => this._sections[at]?.id).filter(Boolean);

    if (more) {
      const text = label(this._overflowed.length);
      if (more.getAttribute('text') !== text) more.setAttribute('text', text);
      more.setAttribute('aria-label', text);
    }
  } // «Ещё (n)»: the standard menu of the sections it holds; one chosen goes
  // there as its link would.


  async openMore(anchor) {
    const entries = this._overflowed.map(id => this._sections.find(section => section.id === id)).filter(Boolean).map(section => ({
      id: section.id,
      text: section.text
    }));

    if (!entries.length) return; // The page's one menu (core SF.menu.open, owner decision C184 (4)).

    const choice = await (0,_core_js_menu_open_js__WEBPACK_IMPORTED_MODULE_4__.menuOpen)({
      anchor: anchor?.querySelector?.(':scope > button') ?? anchor,
      entries,
      label: this.sfWord('more'),
      size: this.size === '1' ? '1' : '1/2'
    });
    if (choice?.id != null && this.isConnected) this.jumpTo(String(choice.id));
  }

  templateContext() {
    return this.createTemplateContext({ ...this.getPropsContext(),
      component: this,
      id: this._id,
      layout: this.layout,
      collapse: this.collapse,
      size: this.size,
      sticky: this.sticky,
      open: this.isOpen,
      compact: this.compact,
      label: this.label,
      headingLevel: this.headingLevel,
      overflow: this.overflow,
      line: this.line,
      expand: this.expand,
      moreText: this.sfWord('more'),
      sections: this._sections.map(({
        id,
        text,
        level,
        count,
        status
      }) => ({
        id,
        text,
        level,
        count,
        status
      })),
      current: this._current,
      progress: this._progress,
      rootClass: this.getRootClass()
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_5__.renderContentsTemplate)(this.templateContext());
  }

}

SfContents.define('sf-contents');

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "cd89fc8cb241"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   currentBranch: () => (/* binding */ currentBranch),
/* harmony export */   renderContentsTemplate: () => (/* binding */ renderContentsTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
 // One list drawn four ways. The root is a <nav> named by the label: a heading
// line, the sheet view's button and progress line, and an ordered list of
// in-page links, the current one aria-current="location". Which parts show is
// the stylesheet's (scss/): column shows the heading and the list; sheet the
// button and the progress, and the list as a raised panel while open; rail the
// list as strokes; bar the list as a row. layout auto is column or sheet by a
// media rule, so the printed markup is right before the script arrives.
//
// The heading is a heading (role heading at heading-level) that names the
// navigation (aria-labelledby): shown in the column, hidden in the other
// layouts, where it still names the landmark (CT-09). The bar with overflow
// more ends in «Ещё (n)», which the element lays out (CT-05).
//
// C95 (owner, 2026-11-12): line says who draws the line -- the element (own),
// its host's divider (edge) or nobody (none); expand current folds the deeper
// entries outside the current branch; an entry with a count or a status
// carries a badge on the line of its text (sf-badge line="text") and says it
// in its name; the sheet view's veil stands behind the open list, which is a
// bottom sheet on a phone. The badge is tonal whatever it says (owner decision
// C140; C96 (6): an error in a label stays tonal red): the status mark drew
// the filled look, which is the attention count's alone.

const STATUSES = ['error', 'warning', 'success'];
const STATUS_ICONS = {
  error: 'error',
  warning: 'warning',
  success: 'check_circle'
}; // The entries of the current branch: the top-level entry at or before the
// current one, and every deeper entry under it. Without a current entry, the
// first branch.

function currentBranch(sections, current) {
  const depthOf = section => section.level - Math.min(...sections.map(one => one.level));

  const at = Math.max(0, sections.findIndex(section => section.id === current));
  let start = at;

  while (start > 0 && depthOf(sections[start]) > 0) start -= 1;

  const open = new Set();

  for (let index = start; index < sections.length; index += 1) {
    if (index > start && depthOf(sections[index]) === 0) break;
    open.add(sections[index].id);
  }

  return open;
}
function renderContentsTemplate(context) {
  const {
    component,
    id,
    layout,
    collapse,
    size,
    sticky,
    open,
    compact,
    label,
    sections,
    current,
    progress,
    rootClass
  } = context;
  const labelId = `${id}-label`;
  const level = Math.min(6, Math.max(2, Math.round(Number(context.headingLevel)) || 2));
  const more = layout === 'bar' && context.overflow !== 'scroll';
  const listId = `${id}-list`;
  const currentSection = sections.find(section => section.id === current) ?? sections[0];
  const currentText = currentSection?.text ?? '';
  const top = sections.reduce((lowest, section) => Math.min(lowest, section.level), Infinity);
  const line = ['edge', 'none'].includes(context.line) ? context.line : 'own';
  const folding = context.expand === 'current';
  const branch = folding ? currentBranch(sections, current) : null;

  const statusOf = section => STATUSES.includes(section.status) ? section.status : '';

  const countOf = section => Number.isFinite(section.count) && section.count > 0 ? Math.round(section.count) : 0;

  const classes = ['sf-contents', `sf-contents--layout-${layout}`, // The sheet writes its former class beside its own until 2027-01-01, so a
  // page selector that reached sf-contents--layout-compact still does (C134;
  // journal value-contents-layout-compact-to-sheet).
  layout === 'sheet' ? 'sf-contents--layout-compact' : '', layout === 'auto' ? `sf-contents--collapse-${collapse}` : '', `sf-contents--size-${size === '1' ? '1' : 'half'}`, sticky ? 'sf-contents--sticky' : '', open ? 'sf-contents--open' : '', more ? 'sf-contents--overflow-more' : '', line !== 'own' ? `sf-contents--line-${line}` : '', folding ? 'sf-contents--expand-current' : '', rootClass].filter(Boolean).join(' ');
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<nav class=${classes} style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} aria-labelledby=${labelId}
      @keydown=${event => component.onKeydown(event)}>
    <div class="sf-contents-head">
      <sf-button class="sf-contents-toggle" appearance="outline" scheme="on-surface" size=${size}
        icon-start="toc" icon-end="expand_more" text=${currentText || label} text-position="start" root-class="w-full"
        aria-label=${currentText ? `${label}: ${currentText}` : label} aria-controls=${listId}
        expanded=${compact && open ? '' : 'false'}
        @click=${() => component.toggle()}></sf-button>
      <span class="sf-contents-progress" aria-hidden="true"><span class="sf-contents-progress-value"
        style=${`--sf-contents--progress: ${progress}`}></span></span>
    </div>
    <div class="sf-contents-label" id=${labelId} role="heading" aria-level=${String(level)}>${label}</div>
    <span class="sf-contents-veil" aria-hidden="true" @click=${() => component.closeList({
    restoreFocus: true
  })}></span>
    <ol class="sf-contents-list" id=${listId} role="list">
      ${sections.map(section => {
    const depth = Math.max(0, section.level - (Number.isFinite(top) ? top : section.level));
    const status = statusOf(section);
    const count = countOf(section);
    const marked = status || count;
    const folded = branch && depth > 0 && !branch.has(section.id);
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<li class=${folded ? 'sf-contents-item sf-contents-folded' : 'sf-contents-item'} data-depth=${depth}>
        <a class=${marked ? 'sf-contents-link sf-contents-link--marked' : 'sf-contents-link'} href=${`#${section.id}`}
          aria-current=${section.id === current ? 'location' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          aria-label=${marked ? component.markedName(section.text, {
      count,
      status
    }) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          data-status=${status || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          @click=${event => component.choose(event, section.id)}><span class="sf-contents-mark" aria-hidden="true"></span><span class="sf-contents-text">${section.text}</span>${marked ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-badge class="sf-contents-count" line="text"
            status=${status || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} appearance="tonal" text=${count ? String(count) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            icon=${!count && status ? STATUS_ICONS[status] : lit__WEBPACK_IMPORTED_MODULE_0__.nothing} icon-only=${!count && status ? '' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            aria-hidden="true"></sf-badge>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}</a>
      </li>`;
  })}
    </ol>
    ${more ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button class="sf-contents-more" appearance="ghost" scheme="on-surface" size=${size}
      icon-end="expand_more" text=${context.moreText} aria-haspopup="menu"
      @click=${event => component.openMore(event.currentTarget)}></sf-button>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
  </nav>`;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "39f7a04bb258"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


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

/***/ "52dd2df8d015"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   files: () => (/* binding */ files)
/* harmony export */ });
/* harmony import */ var _en_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("c7309b7d2b47");
// Written by scripts/build-language-packs.mjs from src/core/lang/built-in.json
// (owner decision C282); do not edit. The words this bundle carries: the
// built-in languages' (en); every other language comes from
// a language file (core/lang/<code>.js or its parts).


const files = { en: { runtime: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime } };

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ en: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime });


/***/ },

/***/ "8e187cb370e4"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-contents for the shim (core/js/aliases.js, standard §16 item 20).","component":"sf-contents","since":"2026-11-13","remove_after":"2027-01-01","aliases":[{"from":"compact","to":"sheet","kind":"value","setting":"layout","component":"sf-contents","since":"2026-11-13","remove_after":"2027-01-01","section":"§16 item 20","note":"owner decision C134 (control/research/2026-11-13-navigation-density.md D5, Q1): the word compact means density only; the button view is layout sheet and writes the class sf-contents--layout-sheet beside its former sf-contents--layout-compact until the date"}]}');

/***/ },

/***/ "98e539eba4a2"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.contents","tag":"sf-contents","version":"1.8.3","kind":"leaf","settings":{"layout":{"type":"enum","values":["auto","column","sheet","rail","bar"],"default":"auto"},"collapse":{"type":"enum","values":["sm","md","lg","xl"],"default":"lg"},"target":{"type":"string","default":""},"levels":{"type":"string","default":"2-3"},"items":{"type":"list","default":[],"of":{"id":"id","text":"string","level":{"type":"number","optional":true},"count":{"type":"number","optional":true},"status":{"type":"string","optional":true}}},"size":{"type":"enum","values":["1/2","1"],"default":"1/2"},"sticky":{"type":"boolean","default":true},"line":{"type":"enum","values":["own","edge","none"],"default":"own"},"expand":{"type":"enum","values":["all","current"],"default":"all"},"overflow":{"type":"enum","values":["more","scroll"],"default":"more"},"hash":{"type":"enum","values":["choose","scroll","false"],"default":"choose"},"label":{"type":"string","default-from":"runtime.label"},"heading-level":{"type":"number","integer":true,"min":2,"max":6,"default":2}},"values":{"current":{"type":"id"}},"events":{"change":{"x-native":false,"carries":{"id":"id","previous":{"type":"id","nullable":true}}}},"actions":{"refresh":{},"toggle":{}},"host-states":{"data-open":"boolean","data-compact":"boolean","data-empty":"boolean"},"css-variables":{"--sf-contents-color":{"type":"color","state":"default"},"--sf-contents-current-color":{"type":"color","state":"current"},"--sf-contents-line-color":{"type":"color","state":"default"},"--sf-contents-background-color":{"type":"color","state":"default"},"--sf-contents-indent":{"type":"length","state":"default"},"--sf-contents-inset-inline":{"type":"length","state":"default"},"--sf-contents-gap":{"type":"length","state":"default"},"--sf-contents-inset-block-start":{"type":"length","state":"default"},"--sf-contents-z-index":{"type":"number","state":"default"}}}');

/***/ },

/***/ "c7309b7d2b47"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Contents","runtime":{"label":"On this page","more":"More","count-error":{"one":"{n} error","other":"{n} errors"},"count-warning":{"one":"{n} warning","other":"{n} warnings"},"count-success":{"one":"{n}, done","other":"{n}, done"},"status-error":"has errors","status-warning":"has warnings","status-success":"done"}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("fea62563f6ac");
/******/
/******/ })()
;