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

/***/ "557c99eb8f3a"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   focusTarget: () => (/* binding */ focusTarget),
/* harmony export */   roving: () => (/* binding */ roving)
/* harmony export */ });
// One Tab stop for a row of controls, and the arrows between them (owner
// decision C184 (1)-(3), 2026-11-14; study control/research/2026-11-14-
// toolbar-menu-open.md, K-02). A toolbar is not a component of its own
// (C155 (8): no sf-toolbar): it is ordinary sf-button-icon groups, 4 apart
// inside a group and a separator between groups (C144), and this helper gives
// them the keyboard of the WAI-ARIA toolbar pattern:
//
// - the row is one Tab stop; Tab comes back to the control the person left
//   (memory, C184 (3)), or to the first one (memory: false);
// - the arrows of the row's orientation move between the controls, in the
//   row's direction (right-to-left reverses ← and →), Home and End go to the
//   ends, and the walk wraps;
// - a control that cannot be used now (aria-disabled) stays in the walk,
//   dimmed by its component, with its reason as a tooltip (C184 (2), as
//   C164 (4) does for a menu row); disabled: 'skip' leaves it out. A control
//   with the native disabled attribute cannot take the focus and is skipped;
// - a control inside «Ещё» (the C155 row engine marks the part that left the
//   row with .out or [hidden]) is not in the walk;
// - ↓ (↑) on a menu button of a horizontal row opens its menu, as the
//   pattern's menu button does.
//
// It is also the list's keyboard (C184 (5)): a list is one Tab stop and ↑ ↓
// move between its rows (orientation 'vertical').
//
// roving(container, options) -> {refresh, set, current, items, destroy}.
// The look stays with the components; this module holds no state of its own
// outside the controller it returns, so every bundle may carry its own copy.
const NATIVE_FOCUSABLE = 'button, a[href], input, select, textarea, [tabindex], [contenteditable=""], [contenteditable="true"]';
const OUT = '.out, [hidden], [data-sf-out], [inert]'; // The element that takes the focus for an item: the item itself when it can
// (a <button>, a row with a tabindex), else the control inside it -- an
// sf-button-icon host draws a <button> and is display: contents.

function focusTarget(item) {
  if (!item) return null;
  if (item.matches?.(NATIVE_FOCUSABLE)) return item;
  return item.querySelector?.('button, a[href], [role="button"], [tabindex]') ?? item;
}

const isUnavailable = target => target.getAttribute?.('aria-disabled') === 'true';

const isDisabled = target => Boolean(target.disabled) || target.matches?.(':disabled');

function roving(container, {
  items: itemsOf = 'button',
  orientation = 'horizontal',
  wrap = true,
  disabled = 'focusable',
  memory = true,
  out = OUT,
  onMove = null,
  observe = true
} = {}) {
  let current = null; // Every item of the row, in order, as the targets that take the focus.

  const all = () => {
    const found = typeof itemsOf === 'function' ? itemsOf() : [...container.querySelectorAll(itemsOf)];
    const targets = [];

    for (const item of found) {
      const target = focusTarget(item);
      if (!target || !container.contains(target) || targets.includes(target)) continue; // Out of the row: a part inside it that left (into «Ещё») or is
      // hidden. The row itself being hidden for now does not count.

      const away = target.closest(out);
      if (away && away !== container && container.contains(away)) continue;
      targets.push(target);
    }

    return targets;
  }; // The items the walk stops on.


  const items = () => all().filter(target => !isDisabled(target) && (disabled === 'focusable' || !isUnavailable(target)));

  function set(element) {
    const target = focusTarget(element);
    const every = all();
    if (!target || !every.includes(target)) return;
    current = target;

    for (const other of every) {
      const next = other === target ? '0' : '-1';
      if (other.getAttribute('tabindex') !== next) other.setAttribute('tabindex', next);
    }
  } // After a drawing or a change of the row: the one Tab stop is the item
  // remembered, or the first one when it is gone (or the row forgets).


  function refresh() {
    const list = items();

    if (!list.length) {
      // Nothing to stop on: no item keeps a stop either (a disabled field's
      // toolbar is not a Tab stop).
      for (const other of all()) if (other.getAttribute('tabindex') !== '-1') other.setAttribute('tabindex', '-1');

      current = null;
      return;
    }

    set(current && list.includes(current) ? current : list[0]);
  }

  const vertical = orientation === 'vertical';
  const both = orientation === 'both';

  function onKeydown(event) {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
    const list = items();
    const target = list.find(one => one === event.target || one.contains(event.target));
    if (!target) return; // A field inside an item (a link's address) keeps its own keys.

    if (event.target !== target && event.target.matches?.('input, textarea, select, [contenteditable="true"], [contenteditable=""]')) return;
    const rtl = getComputedStyle(container).direction === 'rtl';
    const forward = vertical ? ['ArrowDown'] : both ? ['ArrowDown', rtl ? 'ArrowLeft' : 'ArrowRight'] : [rtl ? 'ArrowLeft' : 'ArrowRight'];
    const back = vertical ? ['ArrowUp'] : both ? ['ArrowUp', rtl ? 'ArrowRight' : 'ArrowLeft'] : [rtl ? 'ArrowRight' : 'ArrowLeft'];
    const at = list.indexOf(target);
    let next = null;

    if (!vertical && !both && (event.key === 'ArrowDown' || event.key === 'ArrowUp') && target.getAttribute('aria-haspopup') === 'menu' && !isUnavailable(target)) {
      event.preventDefault();
      target.click();
      return;
    }

    if (forward.includes(event.key)) next = at + 1 < list.length ? list[at + 1] : wrap ? list[0] : null;else if (back.includes(event.key)) next = at > 0 ? list[at - 1] : wrap ? list[list.length - 1] : null;else if (event.key === 'Home') next = list[0];else if (event.key === 'End') next = list[list.length - 1];else return;
    event.preventDefault();
    if (!next || next === target) return;
    set(next);
    next.focus();
    onMove?.(next, event.key);
  }

  function onFocusIn(event) {
    const target = all().find(one => one === event.target);
    if (!target || target === current) return;
    set(target);
    onMove?.(target, 'focus');
  }

  function onFocusOut(event) {
    if (memory || container.contains(event.relatedTarget)) return;
    const list = items();
    if (list.length) set(list[0]);
  }

  container.addEventListener('keydown', onKeydown);
  container.addEventListener('focusin', onFocusIn);
  container.addEventListener('focusout', onFocusOut); // Items drawn later -- a host that draws its <button> on its own schedule
  // (sf-button-icon), a row added -- join the walk with tabindex -1 at once:
  // the row stays one Tab stop whatever draws when.

  let queued = false;
  const watcher = observe && typeof MutationObserver === 'function' ? new MutationObserver(() => {
    if (queued) return;
    queued = true;
    queueMicrotask(() => {
      queued = false;
      refresh();
    });
  }) : null;
  watcher?.observe(container, {
    childList: true,
    subtree: true
  });
  refresh();
  return {
    refresh,
    set,
    items,

    get current() {
      return current;
    },

    destroy() {
      watcher?.disconnect();
      container.removeEventListener('keydown', onKeydown);
      container.removeEventListener('focusin', onFocusIn);
      container.removeEventListener('focusout', onFocusOut);
    }

  };
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (roving);

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

/***/ "ac307690e585"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_composition_overlay_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("dd1616d485c7");
/* harmony import */ var _core_js_composition_manifest_host_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("6b629b4c1b7e");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("7e115d411c69");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("8e25252ed5d8");
/* harmony import */ var _lang_index_mjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("80fa922ae034");
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("2fd7a4d3f4d6");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_composition_overlay_mjs__WEBPACK_IMPORTED_MODULE_0__, _core_js_composition_manifest_host_mjs__WEBPACK_IMPORTED_MODULE_1__]);
([_core_js_composition_overlay_mjs__WEBPACK_IMPORTED_MODULE_0__, _core_js_composition_manifest_host_mjs__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
// Smart entry for sf-editor-overlay, the editor canvas overlay. Library
// drags from sf-sortable land here through the shared drag session. A framed
// canvas (a same-origin iframe fed a flat node list) uses attachFrame and setNodes.
//
// From its component.json (standard simai.smart-component 1.3.8 §3, §4, §8):
// the overlay is defined over the class core/js/composition/manifest-host.mjs
// makes from it; it sends select, apply, insert, move and change by the
// vocabulary, the former -action and -edit following until 2026-12-01.




 // Only the words on screen ship in the bundle, English only (owner decision
// C282): Russian and every other language come from a language file. The
// title, settings and events stay in the language files for the Studio and the
// docs (localization study LC-2).


globalThis.SF = globalThis.SF || {};
globalThis.SF.CompositionOverlay = Object.freeze({
  OVERLAY_EVENTS: _core_js_composition_overlay_mjs__WEBPACK_IMPORTED_MODULE_0__.OVERLAY_EVENTS,
  OVERLAY_EVENTS_FORMER_TAG: _core_js_composition_overlay_mjs__WEBPACK_IMPORTED_MODULE_0__.OVERLAY_EVENTS_FORMER_TAG,
  OVERLAY_EVENTS_LEGACY: _core_js_composition_overlay_mjs__WEBPACK_IMPORTED_MODULE_0__.OVERLAY_EVENTS_LEGACY,
  checkOverlayActions: _core_js_composition_overlay_mjs__WEBPACK_IMPORTED_MODULE_0__.checkOverlayActions,
  checkOverlayNodes: _core_js_composition_overlay_mjs__WEBPACK_IMPORTED_MODULE_0__.checkOverlayNodes,
  overlayNodes: _core_js_composition_overlay_mjs__WEBPACK_IMPORTED_MODULE_0__.overlayNodes
}); // The overlay's methods take their fields in order (setNodes(nodes, options));
// the runtime gives each the object form of §4.4 as well (setNodes({nodes,
// options}), setMessages({messages})).

const positional = ['attach', 'attach-frame', 'set-document', 'set-nodes', 'set-drop-filter', 'set-actions', 'set-messages', 'set-insertion-target', 'select', 'edit']; // An editor page draws parameter forms: the composition editor words, no
// longer part of every page's core (localization study LC-1), are fetched
// once now, so SF.Composition.editorFieldMessages() answers in full.

globalThis.SF.Composition?.loadEditorWords?.();
(0,_core_js_composition_overlay_mjs__WEBPACK_IMPORTED_MODULE_0__.defineCompositionOverlay)(globalThis.customElements, {
  base: (0,_core_js_composition_manifest_host_mjs__WEBPACK_IMPORTED_MODULE_1__.manifestHost)(_component_json__WEBPACK_IMPORTED_MODULE_2__, {
    lang: _lang_index_mjs__WEBPACK_IMPORTED_MODULE_4__.files,
    source: 'ru',
    aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_3__,
    positional
  })
});
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "2fd7a4d3f4d6"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "5dcef5de40cf"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("alias-table", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("alias-table", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "892a0da25239"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("aliases", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("aliases", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "d3818183b14c"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("deprecations", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("deprecations", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "5b7d7695b41b"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("element-manifest", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("element-manifest", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "bf0cea966575"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("open-surface-mark", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("open-surface-mark", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "43090d1c8307"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("page-language", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("page-language", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "6f489cc65b77"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   canonical: () => (/* binding */ canonical),
/* harmony export */   isPlainObject: () => (/* binding */ isPlainObject),
/* harmony export */   stableStringify: () => (/* binding */ stableStringify)
/* harmony export */ });
function isPlainObject(value) {
  if (!value || Object.prototype.toString.call(value) !== '[object Object]') return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (isPlainObject(value)) {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonical(value[key])]));
  }
  return value;
}

function stableStringify(value) {
  return JSON.stringify(canonical(value));
}




/***/ },

/***/ "6b629b4c1b7e"
(__webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   manifestHost: () => (/* binding */ manifestHost)
/* harmony export */ });
/* harmony import */ var _element_manifest_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _aliases_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("892a0da25239");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_element_manifest_js__WEBPACK_IMPORTED_MODULE_0__, _aliases_js__WEBPACK_IMPORTED_MODULE_1__]);
([_element_manifest_js__WEBPACK_IMPORTED_MODULE_0__, _aliases_js__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
// The editors' elements from their manifests (standard simai.smart-component
// 1.3.8 §3, §4, §8, §16.20).
//
// sf-sortable, sf-editor-inline and sf-editor-overlay are plain custom
// elements defined by the composition modules (core/js/composition): the
// overlay's bundle carries the drag module too, and a page may define them
// before any Smart base is loaded. They draw nothing through the Smart base
// and keep their own lifecycle. What the manifest gives every component --
// the settings' attributes and properties, sfEmit through the dated aliases,
// sfWord, the declared actions -- they take from elementFromManifest over a
// plain base that answers the two callbacks the generated class calls and
// installs the component's aliases.json once the element is placed.
//
//   const base = manifestHost(manifest, {lang: {en, ru}, source: 'ru', aliases});
//   defineSortable(registry, {base});



function manifestHost(manifest, options = {}) {
  const Html = globalThis.HTMLElement;
  if (typeof Html !== 'function') return null;

  class PlainHost extends Html {
    connectedCallback() {
      // An element placed inside another element's printed first paint (a
      // list in a board's picture: the board drew the cards into it) is part
      // of that picture, as a Smart element is (smart-base renderComponent):
      // the children there are what the element around it drew, not this
      // element's own static markup. It leaves them, and the element around
      // it replaces the picture when its code comes. Clearing them took a
      // board's cards away whenever sf-sortable's code came first (view
      // round 2 board, 2026-11-18).
      if (this.sfInPicture()) return;
      // Static markup printed for the first paint (standard 1.3.8 §5.4) goes
      // as the element connects: these elements draw in the same task.
      if (!this.__sfFirstPaintEnded) {
        this.__sfFirstPaintEnded = true;
        for (const child of Array.from(this.children)) {
          if (child.hasAttribute('data-sf-static') && !child.hasAttribute('slot')) child.remove();
          else child.removeAttribute('data-sf-held');
        }
        this.removeAttribute('data-sf-first-paint');
      }
      // Installed once and kept while the element is detached, as the Smart
      // base does: a page that moves the element keeps its old names.
      if (this.constructor.aliases && !this.__sfAliases) {
        this.__sfAliases = (0,_aliases_js__WEBPACK_IMPORTED_MODULE_1__.installAliases)(this, this.constructor.aliases, {
          tag: this.localName,
          adapters: this.sfAliasAdapters?.() ?? {},
        });
      }
    }

    disconnectedCallback() {}

    // True while the element stands in a printed first paint: it, or a node
    // around it, is static markup (data-sf-static). A page's own host is
    // never marked, so an element the page wrote ends its first paint.
    sfInPicture() {
      return Boolean(this.closest?.('[data-sf-static]'));
    }

    // The generated actions read the instance's scope (§7.7); a plain host's
    // ends when the page removes it.
    get sfScope() {
      if (!this.__sfScope || (this.__sfScope.signal.aborted && this.isConnected)) this.__sfScope = new AbortController();
      return this.__sfScope.signal;
    }
  }

  return (0,_element_manifest_js__WEBPACK_IMPORTED_MODULE_0__.elementFromManifest)(manifest, { ...options, base: PlainHost });
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ manifestHost });

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "dd1616d485c7"
(__webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   OVERLAY_EVENTS: () => (/* binding */ OVERLAY_EVENTS),
/* harmony export */   OVERLAY_EVENTS_FORMER_TAG: () => (/* binding */ OVERLAY_EVENTS_FORMER_TAG),
/* harmony export */   OVERLAY_EVENTS_LEGACY: () => (/* binding */ OVERLAY_EVENTS_LEGACY),
/* harmony export */   checkOverlayActions: () => (/* binding */ checkOverlayActions),
/* harmony export */   checkOverlayNodes: () => (/* binding */ checkOverlayNodes),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   defineCompositionOverlay: () => (/* binding */ defineCompositionOverlay),
/* harmony export */   flatOverlayNodes: () => (/* binding */ flatOverlayNodes),
/* harmony export */   frameRectToHost: () => (/* binding */ frameRectToHost),
/* harmony export */   frameViewport: () => (/* binding */ frameViewport),
/* harmony export */   openDetail: () => (/* binding */ openDetail),
/* harmony export */   overlayNodes: () => (/* binding */ overlayNodes),
/* harmony export */   shortcutMatches: () => (/* binding */ shortcutMatches)
/* harmony export */ });
/* harmony import */ var _canonical_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("6f489cc65b77");
/* harmony import */ var _page_language_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("43090d1c8307");
/* harmony import */ var _tag_aliases_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("4a85acfb05c1");
/* harmony import */ var _sortable_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("7c1f9c2b36da");
/* harmony import */ var _overflow_row_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("2db3a835ac11");
/* harmony import */ var _breakpoints_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("1373e294ec38");
/* harmony import */ var _open_surface_mark_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("bf0cea966575");
/* harmony import */ var _roving_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("557c99eb8f3a");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_page_language_js__WEBPACK_IMPORTED_MODULE_1__, _tag_aliases_js__WEBPACK_IMPORTED_MODULE_2__, _sortable_mjs__WEBPACK_IMPORTED_MODULE_3__, _open_surface_mark_js__WEBPACK_IMPORTED_MODULE_6__]);
([_page_language_js__WEBPACK_IMPORTED_MODULE_1__, _tag_aliases_js__WEBPACK_IMPORTED_MODULE_2__, _sortable_mjs__WEBPACK_IMPORTED_MODULE_3__, _open_surface_mark_js__WEBPACK_IMPORTED_MODULE_6__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);









// Editor canvas overlay. It draws hover and selection frames, an action toolbar
// above the selected block and one insertion point at the seam under the pointer
// over a rendered Composition Document without touching the canvas DOM: the
// published HTML stays byte-identical. The host supplies node descriptions and
// actions and performs every change.
//
// Placed in the same scroller as its canvas, the overlay's parts lie in the
// scrolled content and travel with it, so nothing runs on scroll and nothing
// trails a frame behind; the script measures only when geometry changes. Placed
// outside it, the parts stay fixed to the viewport and follow by script.
//
// Framed mode (attachFrame + setNodes) draws the same chrome over a same-origin
// iframe fed a flat node list: frame coordinates are mapped to the host page
// through the iframe's position, borders, padding, scale and the frame's own
// scroll, and a plain-string inline edit happens on the element inside the frame.

// The names sf-editor-overlay's component.json declares (standard 1.3.8
// §8, vocabulary 1.1.5): select {ids, id}, apply {action, scope: entry, ids}
// (one entry's own action, §18.3), insert, move {ids, id, parent, position}
// (one manual move), change {id, value, previous} for a plain-string edit and
// open {ids, id, node, point, trigger} (vocabulary §5 open, since 1.5.0).
// select, move and insert keep their names and add the vocabulary's fields to
// the former ones (node_id, parent_id stay for the composition host); apply
// and change are new names, followed by sf-composition-overlay-action and
// -edit with their former details until 2026-12-01 (aliases.json). Since
// 2026-11-03 the tag is sf-editor-overlay: each name is also sent under the
// former tag (sf-composition-overlay-*, the same detail) until 2027-01-01,
// open (1.5.0) too, as the tag's alias policy asks of every event.
const OVERLAY_EVENTS = Object.freeze({
  select: 'sf-editor-overlay-select',
  action: 'sf-editor-overlay-apply',
  insert: 'sf-editor-overlay-insert',
  move: 'sf-editor-overlay-move',
  edit: 'sf-editor-overlay-change',
  open: 'sf-editor-overlay-open',
});

const OVERLAY_EVENTS_FORMER_TAG = Object.freeze({
  select: 'sf-composition-overlay-select',
  action: 'sf-composition-overlay-apply',
  insert: 'sf-composition-overlay-insert',
  move: 'sf-composition-overlay-move',
  edit: 'sf-composition-overlay-change',
  open: 'sf-composition-overlay-open',
});
const FORMER_TAG_NAME = new Map(Object.keys(OVERLAY_EVENTS_FORMER_TAG).map((key) => [OVERLAY_EVENTS[key], OVERLAY_EVENTS_FORMER_TAG[key]]));

const OVERLAY_EVENTS_LEGACY = Object.freeze({
  action: 'sf-composition-overlay-action',
  edit: 'sf-composition-overlay-edit',
});

const LEGACY_DETAIL = {
  action: (detail) => ({ action_id: detail.action, node_id: detail.ids[0] ?? null }),
  edit: (detail) => ({ node_id: detail.id, value: detail.value, previous: detail.previous }),
};

const MESSAGES = {
  en: { picked: 'Moving {label}. Arrows choose a place, Enter drops, Escape cancels.', cancelled: 'Move cancelled.', tree: 'Page structure', toolbar: 'Actions', insert: 'Insert', insertAt: 'Insert into “{slot}”, position {index}', position: '{index} of {total}', selected: 'Selected: {label}', editing: 'Editing {label}. Enter saves, Escape cancels.', more: 'More', insertAfter: 'Insert after “{label}”', dropped: 'Moved {label}. {place}.' },
};

const dashed = (key) => key.replace(/[A-Z]/gu, (letter) => `-${letter.toLowerCase()}`);
const DASHED_MESSAGES = { en: Object.fromEntries(Object.entries(MESSAGES.en).map(([key, word]) => [dashed(key), word])) };

const ACTION_ID = /^[a-z][a-z0-9-]{0,63}$/u;
const ACTION_KEYS = new Set(['id', 'label', 'icon', 'shortcut', 'disabled', 'tone', 'priority']);
// The toolbar shows up to this many icon actions (owner decision C170 (1));
// the rest, and every action without an icon, are in «⋯».
const ROW_ICONS = 5;
// The toolbar is a phone's bottom bar below the sm breakpoint (C170 (4)).
const PHONE_BELOW = 'sm';
const OUT = 'sf-composition-overlay-out';
const ICON_NAME = /^[a-z][a-z0-9_]{0,63}$/u;
// The action a drag starts from is the one drawn as a grip.
const GRIP_ICON = 'drag_indicator';
// Blocks and the frame reach their place together.
const GLIDE = { duration: 180, easing: 'cubic-bezier(.2, 0, 0, 1)' };
// The seam takes the pointer about this far either side, and stays this long after it leaves.
const SEAM_REACH = 10;
const SEAM_LEAVE = 140;
// A drag starts after this many pixels and scrolls the canvas near its edges.
const DRAG_START = 4;
const DRAG_EDGE = 48;
const DRAG_STEP = 10;
const SCROLLS = /^(auto|scroll)$/u;
const PASSIVE_WORDS = new Set(['1', 'true', 'yes', 'on']);
const format = (template, values) => template.replace(/\{(\w+)\}/gu, (_, key) => String(values[key] ?? ''));

/** Flattens a Document into overlay nodes in document order. */
function overlayNodes(document) {
  const nodes = [];
  const visit = (node, parent, slot, index, level) => {
    if (!(0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(node) || typeof node.id !== 'string') return;
    const entry = { id: node.id, type: node.type, parent, slot, index, level, slots: {} };
    nodes.push(entry);
    for (const [name, children] of Object.entries((0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(node.slots) ? node.slots : {})) {
      if (!Array.isArray(children)) continue;
      entry.slots[name] = children.map((child) => child?.id).filter((id) => typeof id === 'string');
      children.forEach((child, childIndex) => visit(child, node.id, name, childIndex, level + 1));
    }
  };
  visit(document?.root, null, null, 0, 1);
  return nodes;
}

function checkOverlayActions(actions) {
  if (!Array.isArray(actions) || actions.length > 16) throw new TypeError('Overlay actions must be a list of up to 16 entries');
  return actions.map((action) => {
    if (!(0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(action) || !ACTION_ID.test(action.id || '') || typeof action.label !== 'string' || !action.label.trim()
      || Object.keys(action).some((key) => !ACTION_KEYS.has(key))) {
      throw new TypeError('Overlay actions have an opaque id, a label and optionally icon, shortcut, disabled and tone');
    }
    if ((action.icon !== undefined && !ICON_NAME.test(String(action.icon)))
      || (action.shortcut !== undefined && (typeof action.shortcut !== 'string' || !action.shortcut.trim()))
      || (action.disabled !== undefined && typeof action.disabled !== 'boolean')
      || (action.tone !== undefined && action.tone !== 'danger')
      || (action.priority !== undefined && action.priority !== 'pin' && !(Number.isSafeInteger(action.priority) && action.priority >= 1))) {
      throw new TypeError(`Overlay action ${action.id} has an icon name, a shortcut string, a boolean disabled, the tone "danger" and a priority (a whole number from 1, or "pin") at most`);
    }
    const checked = { id: action.id, label: action.label };
    for (const key of ['icon', 'shortcut', 'disabled', 'tone', 'priority']) if (action[key] !== undefined) checked[key] = action[key];
    return Object.freeze(checked);
  });
}

const SHORTCUT_MODIFIERS = { '⌥': 'alt', '⇧': 'shift', '⌘': 'mod', '⌃': 'mod' };
const SHORTCUT_KEYS = { '↑': 'ArrowUp', '↓': 'ArrowDown', '←': 'ArrowLeft', '→': 'ArrowRight', '⏎': 'Enter', '↵': 'Enter', '⎋': 'Escape', '⌦': 'Delete' };

/**
 * Whether a keydown is an action's shortcut: the symbols the tooltip shows, as in
 * "⌥↑", "⌘D", "⌫" or "Enter". ⌘ is Command or Control, and ⌫ is Backspace or Delete.
 */
function shortcutMatches(shortcut, event) {
  let rest = String(shortcut).trim();
  const held = { alt: false, shift: false, mod: false };
  while (rest.length > 1 && SHORTCUT_MODIFIERS[rest[0]]) {
    held[SHORTCUT_MODIFIERS[rest[0]]] = true;
    rest = rest.slice(1);
  }
  if (Boolean(event.altKey) !== held.alt || Boolean(event.shiftKey) !== held.shift || Boolean(event.metaKey || event.ctrlKey) !== held.mod) return false;
  if (rest === '⌫') return event.key === 'Backspace' || event.key === 'Delete';
  const key = SHORTCUT_KEYS[rest] ?? rest;
  return key.length === 1 ? String(event.key).toLowerCase() === key.toLowerCase() : event.key === key;
}

const NODE_KEYS = new Set(['id', 'kind', 'rect', 'element', 'label', 'parent', 'editable']);
const finite = (value) => typeof value === 'number' && Number.isFinite(value);
// Elements of the frame belong to another realm, so `instanceof Element` is false for them.
// The overlay a pointer selected with last: with several on a page, a key on
// the body is that one's (simai/ui-source#62).
let pointerOwner = null;

// An element a key types into: a text field, a select, an editable host.
const TEXT_INPUTS = new Set(['', 'text', 'search', 'email', 'url', 'tel', 'password', 'number', 'date', 'datetime-local', 'month', 'time', 'week']);
function takesText(element) {
  const name = element.localName;
  if (name === 'textarea' || name === 'select') return true;
  if (name === 'input') return TEXT_INPUTS.has(String(element.getAttribute('type') || '').toLowerCase());
  return Boolean(element.isContentEditable || element.closest?.('[contenteditable]:not([contenteditable="false"])'));
}

const isElement = (value) => Boolean(value) && typeof value === 'object' && value.nodeType === 1 && typeof value.getBoundingClientRect === 'function';

/**
 * Checks a framed canvas's flat node list: [{id, kind, rect? | element?, label?,
 * parent?, editable?}]. rect is in frame-document coordinates {x, y, width,
 * height}; element is a node inside the frame. Returns frozen entries.
 */
function checkOverlayNodes(nodes) {
  if (!Array.isArray(nodes)) throw new TypeError('Overlay nodes must be a list');
  const seen = new Set();
  const list = nodes.map((node) => {
    if (!(0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(node) || Object.keys(node).some((key) => !NODE_KEYS.has(key))) {
      throw new TypeError('Overlay nodes have id, kind, rect or element, label, parent and editable only');
    }
    if (typeof node.id !== 'string' || !node.id || seen.has(node.id)) throw new TypeError('Overlay nodes have unique non-empty string ids');
    if (typeof node.kind !== 'string' || !node.kind) throw new TypeError(`Overlay node ${node.id} names its kind`);
    const { rect, element } = node;
    if (rect !== undefined && (!(0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(rect) || !['x', 'y', 'width', 'height'].every((key) => finite(rect[key])) || rect.width < 0 || rect.height < 0)) {
      throw new TypeError(`Overlay node ${node.id} has a rect {x, y, width, height} of finite numbers`);
    }
    if (element !== undefined && !isElement(element)) throw new TypeError(`Overlay node ${node.id} has an element`);
    if (rect === undefined && element === undefined) throw new TypeError(`Overlay node ${node.id} has a rect or an element`);
    if (node.label !== undefined && typeof node.label !== 'string') throw new TypeError(`Overlay node ${node.id} has a string label`);
    if (node.parent !== undefined && node.parent !== null && (typeof node.parent !== 'string' || node.parent === node.id)) {
      throw new TypeError(`Overlay node ${node.id} names another node as its parent`);
    }
    if (node.editable !== undefined && typeof node.editable !== 'boolean') throw new TypeError(`Overlay node ${node.id} has a boolean editable`);
    if (node.editable && element === undefined) throw new TypeError(`Overlay node ${node.id} is editable only with an element`);
    seen.add(node.id);
    return Object.freeze({
      id: node.id,
      kind: node.kind,
      rect: rect === undefined ? null : Object.freeze({ x: rect.x, y: rect.y, width: rect.width, height: rect.height }),
      element: element ?? null,
      label: node.label ?? null,
      parent: node.parent ?? null,
      editable: node.editable === true,
    });
  });
  const byId = new Map(list.map((node) => [node.id, node]));
  for (const node of list) {
    const visited = new Set([node.id]);
    for (let parent = node.parent; parent !== null; parent = byId.get(parent).parent) {
      if (!byId.has(parent)) throw new TypeError(`Overlay node ${node.id} names a parent that is not in the list`);
      if (visited.has(parent)) throw new TypeError(`Overlay node ${node.id} is its own ancestor`);
      visited.add(parent);
    }
  }
  return Object.freeze(list);
}

/** Overlay entries for a checked flat list, in list order; the top level is parent null, slot "default". */
function flatOverlayNodes(list) {
  const entries = list.map((node) => ({ id: node.id, type: node.kind, kind: node.kind, label: node.label, parent: node.parent, slot: 'default', index: 0, level: 1, slots: {}, flat: node }));
  const byId = new Map(entries.map((entry) => [entry.id, entry]));
  const counts = new Map();
  for (const entry of entries) {
    const key = entry.parent ?? '';
    entry.index = counts.get(key) || 0;
    counts.set(key, entry.index + 1);
    if (entry.parent) (byId.get(entry.parent).slots.default ||= []).push(entry.id);
    for (let parent = entry.parent; parent; parent = byId.get(parent).parent) entry.level += 1;
  }
  return entries;
}

/**
 * Where a frame's viewport lies on the host page. rect is the iframe's border box
 * on the host (after any transform or zoom), layout its untransformed border box
 * size (offsetWidth/offsetHeight), border and padding its own {top, right,
 * bottom, left} in CSS px, inner the frame's viewport size in its own px and
 * scroll the frame's scroll position. The scale is rect over layout; without a
 * layout size it is taken from the parts, which the viewport's whole-pixel size
 * makes less exact under zoom.
 */
function frameViewport({ rect, layout = null, border, padding, inner, scroll = { x: 0, y: 0 } }) {
  const outerWidth = layout?.width > 0 ? layout.width : border.left + padding.left + inner.width + padding.right + border.right;
  const outerHeight = layout?.height > 0 ? layout.height : border.top + padding.top + inner.height + padding.bottom + border.bottom;
  const scaleX = outerWidth > 0 && rect.width > 0 ? rect.width / outerWidth : 1;
  const scaleY = outerHeight > 0 && rect.height > 0 ? rect.height / outerHeight : 1;
  return {
    left: rect.left + (border.left + padding.left) * scaleX,
    top: rect.top + (border.top + padding.top) * scaleY,
    width: inner.width * scaleX,
    height: inner.height * scaleY,
    scaleX,
    scaleY,
    scrollX: scroll.x,
    scrollY: scroll.y,
  };
}

/** A box in the frame's viewport coordinates {x, y, width, height}, mapped to the host page. */
function frameRectToHost(box, view) {
  const left = view.left + box.x * view.scaleX;
  const top = view.top + box.y * view.scaleY;
  const width = box.width * view.scaleX;
  const height = box.height * view.scaleY;
  return { x: left, y: top, left, top, width, height, right: left + width, bottom: top + height };
}

const plainText = (element) => (element.textContent || '').replace(/\s+/gu, ' ').trim();
const px = (value) => Number.parseFloat(value) || 0;
// Puts children in a parent only when they differ: a focused button that is not
// moved keeps its focus.
function sync(parent, children) {
  if (children.length !== parent.children.length || children.some((child, at) => child !== parent.children[at])) parent.replaceChildren(...children);
}
const intersect = (a, b) => ({ left: Math.max(a.left, b.left), top: Math.max(a.top, b.top), right: Math.min(a.right, b.right), bottom: Math.min(a.bottom, b.bottom) });
const calm = () => globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;

// The element whose scrolling carries this one: the nearest ancestor that scrolls
// (or is fixed, so nothing carries it further), null for the page itself.
function nearestScroller(start) {
  const { body, documentElement: root } = globalThis.document;
  for (let element = start?.parentElement; element && element !== body && element !== root; element = element.parentElement) {
    const own = globalThis.getComputedStyle(element);
    if (SCROLLS.test(own.overflowY) || SCROLLS.test(own.overflowX) || own.position === 'fixed') return element;
  }
  return null;
}

// One manual move (vocabulary 1.1.5 §5 move, {id, parent, position}) in the
// vocabulary's words beside the composition host's.
function moveDetail(id, descriptor) {
  return { node_id: id, ...descriptor, ids: [id], id, parent: descriptor.parent_id ?? null, position: descriptor.index };
}

/**
 * The detail of open (vocabulary 1.1.5 §5 open, {id}): the node, and the point
 * the intent came from in canvas coordinates -- from the top-left corner of the
 * canvas element's border box, or of a framed canvas's viewport (the frame
 * document's client coordinates). trigger is click (a second click on the
 * chosen node), dblclick or enter; for Enter the point is the centre of the
 * node's box. A point that cannot be measured is null.
 */
function openDetail(id, point, trigger) {
  const at = point && finite(point.x) && finite(point.y) ? Object.freeze({ x: point.x, y: point.y }) : null;
  return Object.freeze({ ids: Object.freeze([id]), id, node: id, point: at, trigger });
}

// base: the class made from sf-editor-overlay's component.json
// (manifest-host.mjs); without it the overlay is a plain element.
function defineCompositionOverlay(registry = globalThis.customElements, { base = null } = {}) {
  if (!registry || typeof globalThis.HTMLElement !== 'function') return null;
  const existing = registry.get('sf-editor-overlay');
  if (existing) return existing;

  class SfCompositionOverlay extends (base || globalThis.HTMLElement) {
    constructor() {
      super();
      this.canvas = null;
      this.nodes = [];
      this.byId = new Map();
      this.describe = () => ({});
      this._actions = [];
      this.selectedId = null;
      this.hoverId = null;
      this._insertionTarget = null;
      this.connection = null;
      this.frameRequest = 0;
      this.resizeObserver = null;
      this.layer = null;
      this.dropFilter = () => true;
      this.moving = null;
      this.unregisterDrop = null;
      this.dropHint = null;
      this.iframe = null;
      this.frameDoc = null;
      this.frameConnection = null;
      this.view = null;
      this.elementIds = new Map();
      this.rectNodes = [];
      this.editing = null;
      this.scroller = null;
      this.followConnection = null;
      this.observed = [];
      this.offsets = new Map();
      this.glide = null;
      this.pointer = null;
      this.pointerRequest = 0;
      this.seam = null;
      this.seamTimer = 0;
      this.gripDrag = null;
      this.actionParts = new Map();
      this.groupParts = [];
      this.toolGroups = [];
      this.menuOnly = [];
      this.toolsOut = new Set();
      this.phoneQuery = null;
      // The node a first click opened, so the double click it begins opens it once.
      this.openedByClick = null;
      // Whether the selection was made by a pointer on a 'for' canvas: the
      // action keys are then taken where the click left focus (#62).
      this.pointerSelected = false;
    }

    // actions, messages and insertion-target are settings of the manifest
    // (properties); a write goes through the same checks as the host port's
    // setActions, setMessages and setInsertionTarget, which stay.
    get actions() {
      return this._actions;
    }

    set actions(value) {
      this.setActions(value ?? []);
    }

    get insertionTarget() {
      return this._insertionTarget;
    }

    set insertionTarget(value) {
      this.setInsertionTarget(value ?? null);
    }

    set messages(value) {
      this.setMessages(value);
    }

    get messages() {
      // In the page's language through pageText, as every component's words
      // are: English here, any other language the words its language file
      // registered for sf-editor-overlay (C282), whose keys are dashed
      // (insert-at for insertAt).
      const words = Object.fromEntries(Object.keys(MESSAGES.en).map((key) => [key, (0,_page_language_js__WEBPACK_IMPORTED_MODULE_1__.pageText)(DASHED_MESSAGES, dashed(key), this, 'sf-editor-overlay')]));
      return { ...words, ...(this.customMessages || {}) };
    }

    connectedCallback() {
      super.connectedCallback?.();
      if (!this.layer) this.buildLayer();
      const canvasId = this.getAttribute('for');
      const frameId = this.getAttribute('frame');
      if (frameId && !this.canvas && !this.iframe) {
        const iframe = globalThis.document.getElementById(frameId);
        if (iframe) this.attachFrame(iframe);
      } else if (canvasId && !this.canvas && !this.iframe) {
        const canvas = globalThis.document.getElementById(canvasId);
        if (canvas) this.attach(canvas);
      } else if (this.canvas || this.iframe) {
        this.bind();
      }
    }

    disconnectedCallback() {
      super.disconnectedCallback?.();
      this.unbind();
    }

    static get observedAttributes() {
      return [...new Set([...(super.observedAttributes ?? []), 'placement', 'passive'])];
    }

    attributeChangedCallback(name, ...values) {
      super.attributeChangedCallback?.(name, ...values);
      if (name === 'placement') this.schedule();
      if (name === 'passive') this.applyPassive();
    }

    /**
     * Passive (the setting passive, since 1.5.0): the overlay takes no input on
     * its canvas -- no click, double click, key, hover, seam or drop is read or
     * stopped, so an editor the host placed in a chosen block gets every one --
     * and keeps its node list and selection. Its own parts step aside: no hover
     * frame, toolbar, insertion point or move handle, and the tree leaves the
     * Tab order. The selected frame stays drawn. Off again, it reads input as
     * before, with the same selection.
     */
    isPassive() {
      // Read as the manifest base reads a boolean: present and empty, or a word for true.
      const raw = this.getAttribute('passive');
      return raw !== null && (raw === '' || PASSIVE_WORDS.has(raw.toLowerCase()));
    }

    applyPassive() {
      if (!this.layer) return;
      const passive = this.isPassive();
      if (passive) {
        // What was under way ends as a blur or Escape would end it.
        if (this.editing) this.finishEdit(true);
        this.moving = null;
        this.pointerDrag?.abort();
        this.pointerDrag = null;
        this.endGripDrag(false);
        this.showDropHint(null);
        this.clearSeam();
        this.hoverId = null;
        this.openedByClick = null;
      }
      this.tree.tabIndex = passive ? -1 : 0;
      this.schedule();
    }

    buildLayer() {
      const doc = globalThis.document;
      this.classList.add('sf-composition-overlay');
      this.layer = doc.createElement('div');
      this.layer.className = 'sf-composition-overlay-layer';
      this.layer.setAttribute('aria-hidden', 'true');
      this.hoverFrame = this.frame('hover');
      this.selectedFrame = this.frame('selected');
      this.insertionLayer = doc.createElement('div');
      this.insertionLayer.className = 'sf-composition-overlay-insertions';
      this.toolbar = doc.createElement('div');
      this.toolbar.className = 'sf-composition-overlay-toolbar';
      this.toolbar.setAttribute('role', 'toolbar');
      this.toolbar.hidden = true;
      this.buildToolbarParts();
      // The rail holds the toolbar's sticky range in the scrolled content.
      this.rail = doc.createElement('div');
      this.rail.className = 'sf-composition-overlay-rail';
      this.rail.append(this.toolbar);
      this.tree = doc.createElement('div');
      this.tree.className = 'sf-composition-overlay-tree';
      this.tree.setAttribute('role', 'tree');
      this.tree.tabIndex = this.isPassive() ? -1 : 0;
      this.live = doc.createElement('div');
      this.live.className = 'sf-composition-overlay-live';
      this.live.setAttribute('aria-live', 'polite');
      this.append(this.tree, this.rail, this.insertionLayer, this.layer, this.live);
      this.layer.append(this.hoverFrame, this.selectedFrame);
    }

    frame(kind) {
      const frame = globalThis.document.createElement('div');
      frame.className = `sf-composition-overlay-frame sf-composition-overlay-frame--${kind}`;
      frame.hidden = true;
      // No label above the frame (owner decision C170 (2), revised after R253):
      // the block's kind and name start the toolbar.
      return frame;
    }

    // The toolbar's own parts, made once: the block's kind icon and name at its
    // start, «⋯» «Ещё» at its end with the separator before it, and on a phone
    // the «+» that adds after the selected block (C170 (1), (2a), (4)).
    buildToolbarParts() {
      const doc = globalThis.document;
      this.nameItem = doc.createElement('span');
      this.nameItem.className = 'sf-composition-overlay-name';
      this.nameIcon = doc.createElement('i');
      this.nameIcon.className = 'sf-icon';
      this.nameIcon.setAttribute('aria-hidden', 'true');
      this.nameText = doc.createElement('span');
      this.nameText.className = 'sf-composition-overlay-name-text';
      this.nameItem.append(this.nameIcon, this.nameText);
      this.nameSeparator = this.separator();
      this.moreSeparator = this.separator();
      this.moreSeparator.classList.add('sf-composition-overlay-more-separator', OUT);
      this.moreTool = this.createTool({ icon: 'more_horiz', label: this.messages.more });
      this.moreTool.root.classList.add(OUT);
      this.moreTool.root.setAttribute('data-sf-overlay-more', '');
      this.moreTool.button.setAttribute('aria-haspopup', 'menu');
      this.addTool = this.createTool({ icon: 'add', label: this.messages.insert, appearance: 'default' });
      this.addTool.root.setAttribute('data-sf-overlay-add', '');
    }

    separator() {
      const line = globalThis.document.createElement('span');
      line.className = 'sf-composition-overlay-separator';
      line.setAttribute('role', 'separator');
      line.setAttribute('aria-orientation', 'vertical');
      return line;
    }

    /** Binds the overlay to a rendered canvas; the canvas is never modified. */
    attach(canvas) {
      if (!(canvas instanceof globalThis.Element)) throw new TypeError('Overlay canvas must be an element');
      if (!this.layer) this.buildLayer();
      this.unbind();
      this.canvas = canvas;
      this.iframe = null;
      this.removeAttribute('data-sf-overlay-mode');
      this.layer.style.clipPath = '';
      this.insertionLayer.style.clipPath = '';
      if (this.isConnected) this.bind();
      return this;
    }

    /** Binds the overlay to a same-origin iframe canvas fed by setNodes; the frame's HTML is never modified by the overlay. */
    attachFrame(iframe) {
      if (!isElement(iframe) || iframe.localName !== 'iframe') throw new TypeError('Overlay frame must be an iframe element');
      if (!this.layer) this.buildLayer();
      this.unbind();
      this.canvas = null;
      this.iframe = iframe;
      this.setAttribute('data-sf-overlay-mode', 'frame');
      if (this.isConnected) this.bind();
      return this;
    }

    bind() {
      if (this.connection || (!this.canvas && !this.iframe)) return;
      this.connection = new AbortController();
      const options = { signal: this.connection.signal };
      const passive = { ...options, passive: true };
      if (this.iframe) {
        // A new letter (srcdoc, navigation) is a new document: listen to it again.
        this.iframe.addEventListener('load', () => this.bindFrameDocument(), options);
        this.iframe.addEventListener('pointerleave', () => this.onPointerGone(), passive);
      } else {
        this.canvas.addEventListener('pointermove', (event) => this.onPointerMove(event), passive);
        this.canvas.addEventListener('pointerleave', () => this.onPointerGone(), passive);
        this.canvas.addEventListener('click', (event) => this.onCanvasClick(event), { ...options, capture: true });
        this.canvas.addEventListener('dblclick', (event) => this.onCanvasDoubleClick(event), options);
        // A click on the canvas leaves focus where the browser puts it: on the
        // scroller around the canvas, on the body, or on something focusable
        // in a block. The action keys of a pointer selection are taken there,
        // as a framed canvas takes them inside its frame (simai/ui-source#62).
        globalThis.document?.addEventListener('keydown', (event) => this.onCanvasKey(event), options);
      }
      this.tree.addEventListener('keydown', (event) => this.onTreeKey(event), options);
      this.tree.addEventListener('focus', () => {
        // The tree has the keys now; the canvas no longer takes them (#62).
        this.pointerSelected = false;
        this.setAttribute('data-sf-overlay-focus', '');
        if (!this.selectedId && this.nodes.length && !this.isPassive()) this.select(this.nodes[0].id);
      }, options);
      this.tree.addEventListener('blur', () => this.removeAttribute('data-sf-overlay-focus'), options);
      this.toolbar.addEventListener('click', (event) => this.onToolbarClick(event), options);
      this.toolbar.addEventListener('keydown', (event) => this.onToolbarKey(event), options);
      // One Tab stop that comes back to the action left, Home and End (core's
      // roving helper, owner decision C184 (1), (3)); the arrows stay
      // onToolbarKey's, which knows the bar's side.
      this.toolbarKeys?.destroy();
      this.toolbarKeys = (0,_roving_js__WEBPACK_IMPORTED_MODULE_7__.roving)(this.toolbar, { items: 'button[data-action]' });
      this.insertionLayer.addEventListener('click', (event) => this.onInsertionClick(event), options);
      this.toolbar.addEventListener('pointerdown', (event) => this.onToolbarPointerDown(event), options);
      this.insertionLayer.addEventListener('pointerover', () => this.holdSeam(), passive);
      this.insertionLayer.addEventListener('pointerout', () => this.leaveSeam(), passive);
      // Scrolling inside the canvas moves its nodes under the parts; the scroller around it carries both.
      this.canvas?.addEventListener('scroll', () => this.schedule(), { ...passive, capture: true });
      globalThis.addEventListener('resize', () => this.schedule(), passive);
      if (typeof globalThis.ResizeObserver === 'function') {
        this.resizeObserver = new globalThis.ResizeObserver(() => this.schedule());
        this.observeGeometry();
      }
      this.unregisterDrop = (0,_sortable_mjs__WEBPACK_IMPORTED_MODULE_3__.registerSortableDropTarget)({
        resolve: (x, y, dragSession) => (!this.isPassive() && this.acceptsDrag(dragSession) ? this.resolveDrop(x, y, null) : null),
        keyboardTargets: (dragSession) => (!this.isPassive() && this.acceptsDrag(dragSession) ? this.dropTargets(null) : []),
        drop: (dragSession, descriptor) => this.emit(OVERLAY_EVENTS.insert, { ...descriptor, parent: descriptor.parent_id ?? null, item: dragSession.item, from: dragSession.from, mode: dragSession.mode }),
        leave: () => this.showDropHint(null),
      });
      this.phoneQuery = (0,_breakpoints_js__WEBPACK_IMPORTED_MODULE_5__.breakpointMedia)(PHONE_BELOW, { below: true });
      this.phoneQuery?.addEventListener?.('change', () => this.applyPhone(), options);
      this.applyPhone();
      this.setAttribute('data-sf-overlay', 'connected');
      this.renderTree();
      if (this.iframe) this.bindFrameDocument();
      this.schedule();
    }

    /** Listens to the frame's current document and window; called on bind and on every frame load. */
    bindFrameDocument() {
      if (this.editing) this.finishEdit(false);
      this.frameConnection?.abort();
      this.frameConnection = null;
      let doc = null;
      try {
        doc = this.iframe.contentDocument;
      } catch {
        doc = null;
      }
      const win = doc?.defaultView || null;
      this.frameDoc = win ? doc : null;
      this.offsets = new Map();
      if (!this.frameDoc) {
        this.observeGeometry();
        // A cross-origin or not yet available frame: nothing is drawn over it.
        this.setAttribute('data-sf-overlay-frame', 'unreachable');
        this.schedule();
        return;
      }
      this.removeAttribute('data-sf-overlay-frame');
      this.frameConnection = new AbortController();
      const options = { signal: this.frameConnection.signal };
      const passive = { ...options, passive: true };
      doc.addEventListener('pointermove', (event) => {
        if (this.isPassive()) return;
        this.setHover(this.frameNodeAt(event));
        this.trackPointer(event.clientX, event.clientY, true);
      }, passive);
      doc.addEventListener('pointerout', (event) => { if (!event.relatedTarget) this.onPointerGone(); }, passive);
      doc.addEventListener('click', (event) => this.onFrameClick(event), { ...options, capture: true });
      doc.addEventListener('dblclick', (event) => this.onFrameDoubleClick(event), { ...options, capture: true });
      doc.addEventListener('keydown', (event) => this.onFrameKey(event), { ...options, capture: true });
      win.addEventListener('scroll', () => this.schedule(), { ...passive, capture: true });
      win.addEventListener('resize', () => this.schedule(), passive);
      this.observeGeometry();
      this.schedule();
    }

    // What changes the parts' geometry: the canvas, its document, the scroller's
    // port and the selected node. Scrolling changes none of them.
    observeGeometry() {
      const observer = this.resizeObserver;
      if (!observer) return;
      const root = this.frameDoc?.documentElement;
      const wanted = [this.canvas || this.iframe, this.scroller, root, this.frameDoc?.body, this.selectedElement()].filter(Boolean);
      if (wanted.length === this.observed.length && wanted.every((element, index) => element === this.observed[index])) return;
      observer.disconnect();
      for (const element of wanted) observer.observe(element);
      this.observed = wanted;
    }

    selectedElement() {
      const node = this.selectedId ? this.byId.get(this.selectedId) : null;
      if (!node) return null;
      return node.flat ? node.flat.element : this.element(node.id);
    }

    unbind() {
      this.finishEdit(false);
      this.frameConnection?.abort();
      this.frameConnection = null;
      this.frameDoc = null;
      this.pointerDrag?.abort();
      this.pointerDrag = null;
      this.endGripDrag(false);
      this.settleGlide();
      this.clearSeam();
      this.followConnection?.abort();
      this.followConnection = null;
      this.observed = [];
      this.unregisterDrop?.();
      this.unregisterDrop = null;
      this.moving = null;
      this.pointerSelected = false;
      if (pointerOwner === this) pointerOwner = null;
      this.connection?.abort();
      this.connection = null;
      this.resizeObserver?.disconnect();
      this.resizeObserver = null;
      // The toolbar's roving keys watch the bar (a MutationObserver): bind()
      // makes them again (GB20, instance-scope gate 36: it stayed).
      this.toolbarKeys?.destroy();
      this.toolbarKeys = null;
      if (this.frameRequest) globalThis.cancelAnimationFrame(this.frameRequest);
      this.frameRequest = 0;
      if (this.pointerRequest) globalThis.cancelAnimationFrame(this.pointerRequest);
      this.pointerRequest = 0;
      if (this.canvas || this.iframe) this.setAttribute('data-sf-overlay', 'disposed');
    }

    /** Supplies the Document structure and a describe(node) → {label, badges}. */
    setDocument(document, { describe } = {}) {
      this.elementIds = new Map();
      this.rectNodes = [];
      this.replaceNodes(overlayNodes(document), describe);
      return this;
    }

    /**
     * Supplies a framed canvas's flat node list [{id, kind, rect? | element?,
     * label?, parent?, editable?}] in selection order, and an optional
     * describe(node) → {label, badges}; without it the label is node.label or its kind.
     */
    setNodes(nodes, { describe } = {}) {
      const list = checkOverlayNodes(nodes);
      this.elementIds = new Map(list.filter((node) => node.element).map((node) => [node.element, node.id]));
      const entries = flatOverlayNodes(list);
      this.rectNodes = entries.filter((entry) => entry.flat.rect && !entry.flat.element);
      if (this.editing) {
        const next = list.find((node) => node.id === this.editing.id);
        if (!next || next.element !== this.editing.element || !next.editable) this.finishEdit(false);
      }
      this.replaceNodes(entries, typeof describe === 'function' ? describe : (node) => ({ label: node.label || node.kind }));
      return this;
    }

    replaceNodes(nodes, describe) {
      const previous = this.selectedId ? this.byId.get(this.selectedId) : null;
      const active = globalThis.document.activeElement;
      const focused = Boolean(active) && (this.toolbar?.contains(active) || this.insertionLayer?.contains(active));
      this.settleGlide();
      const before = this.offsets;
      this.elementIndex = null;
      this.nodes = nodes;
      this.byId = new Map(this.nodes.map((node) => [node.id, node]));
      if (typeof describe === 'function') this.describe = describe;
      this.renderTree();
      // A selected node the host removed is deselected (and announced), so its
      // toolbar and insertion places do not stay on screen. When keyboard focus
      // was on a disappearing button, the parent (or first node) is selected and
      // focus moves to the tree instead of dropping onto the page body.
      if (this.selectedId !== null && !this.byId.has(this.selectedId)) {
        const fallback = previous?.parent && this.byId.has(previous.parent) ? previous.parent : this.nodes[0]?.id ?? null;
        this.select(focused ? fallback : null, { focus: focused });
      }
      if (!this.startGlide(before)) this.schedule();
    }

    /** Re-measures on the next frame, after a change no observer reports (a transform on an ancestor of the canvas). */
    refresh() {
      this.schedule();
      return this;
    }

    setActions(actions) {
      this._actions = checkOverlayActions(actions);
      this.renderToolbar();
      this.schedule();
      return this;
    }

    setMessages(messages) {
      this.customMessages = (0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(messages) ? { ...messages } : null;
      this.renderTree();
      return this;
    }

    /** filter({parent_id, slot, index}, item) → boolean hides invalid places. */
    setDropFilter(filter) {
      this.dropFilter = typeof filter === 'function' ? filter : () => true;
      return this;
    }

    // Named so, not accepts: that is the setting's property (component.json).
    acceptsDrag(dragSession) {
      const groups = (this.getAttribute('accepts') || '').split(/\s+/u).filter(Boolean);
      return Boolean(dragSession && groups.includes(dragSession.group));
    }

    // The overlay's aliases.json sends the name under the former tag after
    // it; an overlay defined without its manifest sends it here.
    emit(type, detail) {
      const frozen = Object.freeze(detail);
      const allowed = this.dispatchEvent(new globalThis.CustomEvent(type, { bubbles: true, composed: true, detail: frozen }));
      if (!this.__sfAliases && FORMER_TAG_NAME.has(type)) this.dispatchEvent(new globalThis.CustomEvent(FORMER_TAG_NAME.get(type), { bubbles: true, composed: true, detail: frozen }));
      return allowed;
    }

    // A renamed event: the overlay's aliases.json sends the former name after
    // it (the adapters below); an overlay defined without its manifest sends
    // both here. Answers false when a listener cancelled either.
    sendRenamed(key, detail, cancelable = false) {
      const event = new globalThis.CustomEvent(OVERLAY_EVENTS[key], { bubbles: true, composed: true, cancelable, detail: Object.freeze(detail) });
      let allowed = this.dispatchEvent(event);
      if (!this.__sfAliases) {
        const former = new globalThis.CustomEvent(OVERLAY_EVENTS_FORMER_TAG[key], { bubbles: true, composed: true, cancelable, detail: event.detail });
        allowed = this.dispatchEvent(former) && allowed;
        if (former.defaultPrevented) event.preventDefault();
        const legacy = new globalThis.CustomEvent(OVERLAY_EVENTS_LEGACY[key], { bubbles: true, composed: true, cancelable, detail: Object.freeze(LEGACY_DETAIL[key](detail)) });
        allowed = this.dispatchEvent(legacy) && allowed;
      }
      return allowed && !event.defaultPrevented;
    }

    sfAliasAdapters() {
      return {
        [OVERLAY_EVENTS_LEGACY.action]: LEGACY_DETAIL.action,
        [OVERLAY_EVENTS_LEGACY.edit]: LEGACY_DETAIL.edit,
      };
    }

    /** Every valid insertion place in document order; moving excludes its own subtree and no-op places. */
    dropTargets(moving) {
      const excluded = new Set();
      if (moving) {
        const stack = [moving];
        while (stack.length) {
          const id = stack.pop();
          excluded.add(id);
          for (const children of Object.values(this.byId.get(id)?.slots || {})) stack.push(...children);
        }
      }
      const places = [];
      if (this.iframe) this.view = this.frameMetrics();
      const source = moving ? this.byId.get(moving) : null;
      for (const { parent, slot, children } of this.groups()) {
        if (excluded.has(parent)) continue;
        const remaining = moving ? children.filter((id) => id !== moving) : children;
        for (let index = 0; index <= remaining.length; index += 1) {
          if (source && (source.parent ?? '') === parent && source.slot === slot && index === source.index) continue;
          const descriptor = { parent_id: parent, slot, index };
          if (!this.dropFilter(descriptor, moving ? { node_id: moving } : (0,_sortable_mjs__WEBPACK_IMPORTED_MODULE_3__.activeSortableSession)())) continue;
          const rect = this.placeRect(parent, slot, index, remaining);
          if (rect) places.push({ descriptor, rect, label: format(this.messages.insertAt, { slot: this.placeName(parent, slot), index: index + 1 }) });
        }
      }
      return places;
    }

    // Every list of places, the outer ones first: a node's slots, and in framed
    // mode the top level (parent "", slot "default") before them.
    groups() {
      const groups = [];
      const top = this.nodes.filter((node) => node.flat && !node.parent).map((node) => node.id);
      if (top.length) groups.push({ parent: '', slot: 'default', children: top });
      for (const node of this.nodes) {
        for (const [slot, children] of Object.entries(node.slots)) groups.push({ parent: node.id, slot, children });
      }
      return groups;
    }

    placeRect(parentId, slot, index, children) {
      const before = this.nodeBox(children[index]);
      const box = before || this.nodeBox(children[index - 1]) || this.nodeBox(parentId);
      if (!box) return null;
      const y = before ? box.top : box.bottom;
      // The one drop line of the kit (owner decision C171 (4)): the drag module's
      // thickness, centred on the seam.
      return { left: box.left, top: y - _sortable_mjs__WEBPACK_IMPORTED_MODULE_3__.SORTABLE_DROP_LINE / 2, width: box.width, height: _sortable_mjs__WEBPACK_IMPORTED_MODULE_3__.SORTABLE_DROP_LINE };
    }

    resolveDrop(x, y, moving) {
      if (!this.canvas) return null;
      const under = globalThis.document.elementsFromPoint(x, y).find((element) => this.canvas.contains(element));
      let id = under ? this.nodeAt(under) : null;
      const allowedPlaces = moving ? this.dropTargets(moving) : null;
      const allowed = (descriptor) => (moving
        ? allowedPlaces.some((place) => JSON.stringify(place.descriptor) === JSON.stringify(descriptor))
        : this.dropFilter(descriptor, (0,_sortable_mjs__WEBPACK_IMPORTED_MODULE_3__.activeSortableSession)()));
      // Over the moving node or its subtree there is no target.
      if (moving) {
        for (let cursor = id; cursor; cursor = this.byId.get(cursor)?.parent) {
          if (cursor === moving) {
            this.showDropHint(null);
            return null;
          }
        }
      }
      while (id) {
        const node = this.byId.get(id);
        // An empty slot of the container under the pointer is a target too.
        for (const [slot, children] of Object.entries(node.slots)) {
          const remaining = moving ? children.filter((entry) => entry !== moving) : children;
          const descriptor = { parent_id: node.id, slot, index: 0 };
          if (remaining.length === 0 && allowed(descriptor)) {
            const rect = this.placeRect(node.id, slot, 0, remaining);
            this.showDropHint(rect);
            return { descriptor, rect, label: format(this.messages.insertAt, { slot: this.placeName(node.id, slot), index: 1 }) };
          }
        }
        if (!node.parent) break;
        const element = this.element(id);
        const box = element.getBoundingClientRect();
        const siblings = this.byId.get(node.parent).slots[node.slot];
        const remaining = moving ? siblings.filter((entry) => entry !== moving) : siblings;
        const position = remaining.indexOf(id);
        if (position >= 0) {
          const index = y > box.top + box.height / 2 ? position + 1 : position;
          const descriptor = { parent_id: node.parent, slot: node.slot, index };
          if (allowed(descriptor)) {
            const rect = this.placeRect(node.parent, node.slot, index, remaining);
            this.showDropHint(rect);
            return { descriptor, rect, label: format(this.messages.insertAt, { slot: this.placeName(node.parent, node.slot), index: index + 1 }) };
          }
        }
        id = node.parent;
      }
      this.showDropHint(null);
      return null;
    }

    showDropHint(rect) {
      if (!this.dropHint) {
        this.dropHint = globalThis.document.createElement('div');
        // The drag module's line, drawn by its sheet (a relation of this rule);
        // the overlay owns this one, so the drag module never takes it over.
        this.dropHint.className = 'sf-composition-overlay-drop sf-sortable-indicator';
        this.dropHint.setAttribute('data-sf-drop-line-owner', 'overlay');
        this.layer?.append(this.dropHint);
      }
      this.dropHint.hidden = !rect;
      if (!rect) return;
      Object.assign(this.dropHint.style, this.onLayer(rect));
    }

    // Dragging by the grip action: the block dims, one line shows where it lands,
    // the canvas scrolls near its edges, Escape cancels. The pointer is captured,
    // so a frame under it does not swallow the moves.
    onToolbarPointerDown(event) {
      if (this.isPassive()) return;
      const button = event.target instanceof globalThis.Element ? event.target.closest('button[data-action]') : null;
      const action = button ? this.actions.find((entry) => entry.id === button.dataset.action) : null;
      const node = this.selectedId ? this.byId.get(this.selectedId) : null;
      if (event.button !== 0 || action?.icon !== GRIP_ICON || action.disabled || !node || (!node.flat && !node.parent)) return;
      event.preventDefault();
      this.endGripDrag(false);
      button.focus({ preventScroll: true });
      button.setPointerCapture?.(event.pointerId);
      const connection = new AbortController();
      const options = { signal: connection.signal };
      const drag = { id: this.selectedId, startY: event.clientY, y: event.clientY, started: false, request: 0, place: null, dim: null, connection };
      this.gripDrag = drag;
      globalThis.addEventListener('pointermove', (moveEvent) => {
        drag.y = moveEvent.clientY;
        if (!drag.started && Math.abs(drag.y - drag.startY) > DRAG_START) this.beginGripDrag(drag);
      }, options);
      globalThis.addEventListener('pointerup', () => this.endGripDrag(true), options);
      globalThis.addEventListener('pointercancel', () => this.endGripDrag(false), options);
      globalThis.addEventListener('keydown', (keyEvent) => {
        if (keyEvent.key !== 'Escape') return;
        keyEvent.preventDefault();
        keyEvent.stopPropagation();
        this.endGripDrag(false);
      }, { ...options, capture: true });
    }

    beginGripDrag(drag) {
      drag.started = true;
      this.clearSeam();
      this.setHover(null);
      drag.dim = this.selectedElement()?.animate?.([{ opacity: 0.35 }], { duration: 1, fill: 'forwards' }) ?? null;
      const step = () => {
        const port = this.scrollPort();
        const by = drag.y < port.top + DRAG_EDGE ? -DRAG_STEP : drag.y > port.bottom - DRAG_EDGE ? DRAG_STEP : 0;
        if (by) (this.scroller || globalThis).scrollBy({ top: by, behavior: 'instant' });
        this.trackGripDrag(drag);
        drag.request = globalThis.requestAnimationFrame(step);
      };
      drag.request = globalThis.requestAnimationFrame(step);
      this.trackGripDrag(drag);
    }

    // The nearest place among the node's siblings; its own place is a place too,
    // where a drop changes nothing.
    trackGripDrag(drag) {
      const node = this.byId.get(drag.id);
      if (!node) return;
      if (this.iframe) this.view = this.frameMetrics();
      const parent = node.parent ?? '';
      const siblings = this.nodes.filter((entry) => entry.parent === node.parent && entry.slot === node.slot && entry.id !== drag.id).map((entry) => entry.id);
      let best = null;
      for (let index = 0; index <= siblings.length; index += 1) {
        const rect = this.placeRect(parent, node.slot, index, siblings);
        if (!rect) continue;
        const descriptor = { parent_id: parent, slot: node.slot, index };
        const own = index === node.index;
        if (!own && !this.dropFilter(descriptor, { node_id: drag.id })) continue;
        const distance = Math.abs(drag.y - rect.top);
        if (!best || distance < best.distance) best = { descriptor, rect, own, distance };
      }
      drag.place = best;
      this.showDropHint(best?.rect ?? null);
    }

    endGripDrag(drop) {
      const drag = this.gripDrag;
      if (!drag) return;
      this.gripDrag = null;
      drag.connection.abort();
      if (drag.request) globalThis.cancelAnimationFrame(drag.request);
      drag.dim?.cancel();
      this.showDropHint(null);
      if (drop && drag.started && drag.place && !drag.place.own) this.emit(OVERLAY_EVENTS.move, moveDetail(drag.id, drag.place.descriptor));
    }

    // Moving a canvas node: by the grip action, or from the keyboard via the tree
    // (C170 (5)); the label it was once dragged by is gone with the label (C170 (2)).
    startKeyboardMove() {
      const node = this.byId.get(this.selectedId);
      if (!node?.parent) return;
      const places = this.dropTargets(node.id);
      if (!places.length) return;
      this.moving = { node: node.id, places, index: 0 };
      // Picked and the first place in one message: a second write at once would
      // replace the first before it is read (CO-6).
      this.showKeyboardPlace(format(this.messages.picked, { label: this.info(node).label }));
    }

    showKeyboardPlace(lead = '') {
      const place = this.moving.places[this.moving.index];
      this.showDropHint(place.rect);
      this.live.textContent = lead ? `${lead} ${place.label}` : place.label;
    }

    onMoveKey(event) {
      const moving = this.moving;
      if (event.key === 'Escape' || event.key === 'Tab') {
        if (event.key === 'Escape') event.preventDefault();
        this.moving = null;
        this.showDropHint(null);
        this.live.textContent = this.messages.cancelled;
        return true;
      }
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        const place = moving.places[moving.index];
        this.moving = null;
        this.showDropHint(null);
        const node = this.byId.get(moving.node);
        if (node) this.live.textContent = format(this.messages.dropped, { label: this.info(node).label, place: place.label });
        this.emit(OVERLAY_EVENTS.move, moveDetail(moving.node, place.descriptor));
        return true;
      }
      const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[event.key];
      if (step === undefined) return true;
      event.preventDefault();
      moving.index = Math.max(0, Math.min(moving.places.length - 1, moving.index + step));
      this.showKeyboardPlace();
      return true;
    }

    setInsertionTarget(target) {
      this._insertionTarget = target && typeof target.parent_id === 'string' && typeof target.slot === 'string' && Number.isSafeInteger(target.index)
        ? Object.freeze({ parent_id: target.parent_id, slot: target.slot, index: target.index }) : null;
      this.schedule();
      return this;
    }

    // Read once per measure: the seam and the offsets ask for every node.
    element(id) {
      if (!this.canvas || typeof id !== 'string') return null;
      let found = this.elementIndex?.get(id);
      if (!found || !found.isConnected) {
        this.elementIndex = new Map();
        for (const element of this.canvas.querySelectorAll('[data-sf-composition-id]')) {
          const key = element.getAttribute('data-sf-composition-id');
          if (!this.elementIndex.has(key)) this.elementIndex.set(key, element);
        }
        found = this.elementIndex.get(id);
      }
      return found ?? null;
    }

    info(node) {
      const described = this.describe(node) || {};
      const label = typeof described.label === 'string' && described.label.trim() ? described.label : node.id;
      const badges = Array.isArray(described.badges) ? described.badges.filter((badge) => typeof badge === 'string' && badge.trim()).slice(0, 4) : [];
      // The kind's icon the toolbar starts with (C170 (2a)): a Material Symbols name.
      const icon = typeof described.icon === 'string' && ICON_NAME.test(described.icon) ? described.icon : null;
      return { label, badges, icon };
    }

    // A list of places by the words a person knows: its parent block's name, the
    // slot's id only beside it when the block has more than one (CO-6).
    placeName(parentId, slot) {
      const parent = parentId ? this.byId.get(parentId) : null;
      if (!parent) return this.getAttribute('label') || this.messages.tree;
      const { label } = this.info(parent);
      return Object.keys(parent.slots).length > 1 ? `${label} · ${slot}` : label;
    }

    // The place after the selected block: where its «+» adds (C170 (3), (4)).
    afterSelected() {
      const selected = this.selectedId && !this.isPassive() ? this.byId.get(this.selectedId) : null;
      if (!selected) return null;
      const parent = selected.parent ?? (selected.flat ? '' : null);
      if (parent !== null) {
        const place = { parent_id: parent, slot: selected.slot, index: selected.index + 1 };
        return this.placeAllowed(place) ? place : null;
      }
      const [slot, children] = Object.entries(selected.slots)[0] ?? [];
      return slot === undefined ? null : { parent_id: selected.id, slot, index: children.length };
    }

    select(id, { focus = false, emit = true } = {}) {
      if (id !== null && !this.byId.has(id)) return this;
      if (this.editing && this.editing.id !== id) this.finishEdit(true);
      if (this.selectedId === id) return this;
      this.selectedId = id;
      this.renderTreeSelection();
      this.renderToolbar();
      // The frame and the toolbar arrive with the selection, in the same paint.
      this.settleGlide();
      this.observeGeometry();
      this.positionNow();
      if (id !== null) {
        const node = this.byId.get(id);
        const siblings = this.nodes.filter((entry) => entry.parent === node.parent && entry.slot === node.slot);
        const { label } = this.info(node);
        this.live.textContent = `${format(this.messages.selected, { label })}, ${format(this.messages.position, { index: siblings.indexOf(node) + 1, total: siblings.length })}`;
      }
      if (focus) this.tree.focus();
      if (emit) this.emit(OVERLAY_EVENTS.select, { ids: id === null ? [] : [id], id, node_id: id });
      return this;
    }

    setHover(id) {
      if (this.hoverId === id) return;
      this.hoverId = id;
      this.schedule();
    }

    nodeAt(target) {
      let element = target instanceof globalThis.Element ? target.closest('[data-sf-composition-id]') : null;
      while (element && this.canvas.contains(element)) {
        const id = element.getAttribute('data-sf-composition-id');
        if (this.byId.has(id)) return id;
        element = element.parentElement?.closest('[data-sf-composition-id]') || null;
      }
      return null;
    }

    onPointerMove(event) {
      if (this.isPassive()) return;
      this.setHover(this.nodeAt(event.target));
      this.trackPointer(event.clientX, event.clientY, false);
    }

    onPointerGone() {
      this.setHover(null);
      this.leaveSeam();
    }

    // One place to add: the seam under the pointer, read once a frame while it moves.
    trackPointer(x, y, inFrame) {
      this.pointer = { x, y, inFrame };
      if (this.pointerRequest) return;
      this.pointerRequest = globalThis.requestAnimationFrame(() => {
        this.pointerRequest = 0;
        this.updateSeam();
      });
    }

    updateSeam() {
      if (!this.pointer || !this.connection || this.isPassive() || this.editing || this.moving || this.gripDrag || this.pointerDrag || this.glide) return;
      if (this.iframe) this.view = this.frameMetrics();
      let { x, y } = this.pointer;
      if (this.pointer.inFrame) {
        if (!this.view) return;
        ({ left: x, top: y } = frameRectToHost({ x, y, width: 0, height: 0 }, this.view));
      }
      const seam = this.seamAt(x, y);
      if (!seam) {
        this.leaveSeam();
        return;
      }
      this.holdSeam();
      if (this.seam && seam.parent === this.seam.parent && seam.slot === this.seam.slot && seam.index === this.seam.index) return;
      this.seam = seam;
      this.positionInsertions();
    }

    /** The place whose seam lies within reach of a point on the host page; the outer lists win. */
    seamAt(x, y) {
      for (const { parent, slot, children } of this.groups()) {
        for (let index = 0; index <= children.length; index += 1) {
          const line = this.seamLine(parent, children, index);
          if (!line || x < line.left || x > line.left + line.width || Math.abs(y - line.top) > SEAM_REACH) continue;
          if (this.placeAllowed({ parent_id: parent, slot, index })) return { parent, slot, index };
        }
      }
      return null;
    }

    // Halfway between two blocks that stack; nothing between two that stand side by side.
    seamLine(parent, children, index) {
      const before = this.nodeBox(children[index]);
      const after = this.nodeBox(children[index - 1]);
      if (before && after) {
        if (after.bottom > before.top + 1) return null;
        const left = Math.min(before.left, after.left);
        return { left, width: Math.max(before.right, after.right) - left, top: (after.bottom + before.top) / 2 };
      }
      if (before || after) return { left: (before || after).left, width: (before || after).width, top: before ? before.top : after.bottom };
      const box = children.length ? null : this.nodeBox(parent);
      return box ? { left: box.left, width: box.width, top: box.top + box.height / 2 } : null;
    }

    // A framed host's filter hides insertion places; on a Composition canvas it speaks
    // for drops, with the dragged item, and the Document has the last word on the rest.
    placeAllowed(place) {
      return !this.iframe || this.dropFilter(place, null);
    }

    holdSeam() {
      if (this.seamTimer) globalThis.clearTimeout(this.seamTimer);
      this.seamTimer = 0;
    }

    // A short delay, so the pointer can reach the button.
    leaveSeam() {
      if (!this.seam || this.seamTimer) return;
      this.seamTimer = globalThis.setTimeout(() => {
        this.seamTimer = 0;
        this.seam = null;
        this.positionInsertions();
      }, SEAM_LEAVE);
    }

    clearSeam() {
      this.holdSeam();
      if (!this.seam) return;
      this.seam = null;
      if (this.insertionLayer) this.positionInsertions();
    }

    onCanvasClick(event) {
      // Passive, the click is the page's: an editor in the chosen block gets it.
      if (this.isPassive()) return;
      const id = this.nodeAt(event.target);
      if (!id) return;
      // In the editor a click selects; it never follows links or submits.
      event.preventDefault();
      event.stopPropagation();
      this.clickSelect(id, event, () => this.canvasPoint(event));
    }

    // A click selects; a click on the node already chosen is a request to open
    // it. The second click of a double click opens nothing: the double click
    // does, unless the first click already has.
    clickSelect(id, event, point) {
      this.pointerSelected = true;
      pointerOwner = this;
      if (id !== this.selectedId) {
        this.openedByClick = null;
        this.select(id);
        return;
      }
      if ((event.detail ?? 0) > 1) return;
      this.openedByClick = id;
      this.sendOpen(id, point(), 'click');
    }

    onCanvasDoubleClick(event) {
      if (this.isPassive()) return;
      const id = this.nodeAt(event.target);
      if (!id) return;
      this.doubleClickOpen(id, () => this.canvasPoint(event));
    }

    doubleClickOpen(id, point) {
      const opened = this.openedByClick === id;
      this.openedByClick = null;
      if (opened) return;
      if (this.selectedId !== id) this.select(id);
      this.sendOpen(id, point(), 'dblclick');
    }

    /** A pointer event's point in canvas coordinates: from the canvas element's border box corner. */
    canvasPoint(event) {
      const box = this.canvas?.getBoundingClientRect();
      return box ? { x: event.clientX - box.left, y: event.clientY - box.top } : null;
    }

    /** The centre of a node's box in canvas coordinates (a framed canvas: its viewport). */
    nodeCentre(id) {
      const node = this.byId.get(id);
      if (!node) return null;
      if (node.flat) {
        const { element, rect } = node.flat;
        const win = this.frameDoc?.defaultView;
        if (element) {
          if (!element.isConnected) return null;
          const box = element.getBoundingClientRect();
          return { x: box.left + box.width / 2, y: box.top + box.height / 2 };
        }
        return win ? { x: rect.x - win.scrollX + rect.width / 2, y: rect.y - win.scrollY + rect.height / 2 } : null;
      }
      const box = this.element(id)?.getBoundingClientRect();
      const canvas = this.canvas?.getBoundingClientRect();
      return box && canvas ? { x: box.left - canvas.left + box.width / 2, y: box.top - canvas.top + box.height / 2 } : null;
    }

    // open {ids, id, node, point, trigger}: the host decides what opening is
    // (an editor in the block, a dialog); the overlay changes nothing.
    sendOpen(id, point, trigger) {
      if (this.isPassive() || !this.byId.has(id)) return false;
      return this.emit(OVERLAY_EVENTS.open, openDetail(id, point, trigger));
    }

    // A host-mapped key: the selected node's action whose shortcut it is. An
    // unavailable action takes the key and does nothing.
    runShortcut(event) {
      if (!this.selectedId || event.isComposing) return false;
      const action = this.actions.find((entry) => entry.shortcut && shortcutMatches(entry.shortcut, event));
      if (!action) return false;
      event.preventDefault();
      if (!action.disabled) this.sendRenamed('action', { action: action.id, scope: 'entry', ids: [this.selectedId] });
      return true;
    }

    // A key where a pointer selection on a 'for' canvas left focus: on the
    // canvas or an element in it that types no text, or on an element holding
    // the canvas (its scroller, the body). Only the selected node's action
    // shortcuts are read there; the tree, the toolbar and a field in a block
    // keep their own keys. Of several overlays, the one clicked last takes them.
    onCanvasKey(event) {
      if (event.defaultPrevented || this.isPassive() || !this.canvas || this.iframe) return;
      if (!this.pointerSelected || pointerOwner !== this || !this.selectedId || this.moving || this.editing) return;
      const target = event.target;
      if (!isElement(target) || this.contains(target)) return;
      const inside = this.canvas.contains(target);
      if (!inside && !target.contains(this.canvas)) return;
      if (inside && takesText(target)) return;
      this.runShortcut(event);
    }

    onTreeKey(event) {
      if (this.isPassive()) return;
      if (this.moving && this.onMoveKey(event)) return;
      if (this.runShortcut(event)) return;
      if (event.key === ' ' && this.selectedId && !this.iframe) {
        event.preventDefault();
        this.startKeyboardMove();
        return;
      }
      const index = this.nodes.findIndex((node) => node.id === this.selectedId);
      const current = this.nodes[index];
      let next = null;
      if (event.key === 'ArrowDown') next = this.nodes[Math.min(this.nodes.length - 1, index + 1)];
      else if (event.key === 'ArrowUp') next = this.nodes[Math.max(0, index - 1)];
      else if (event.key === 'Home') next = this.nodes[0];
      else if (event.key === 'End') next = this.nodes.at(-1);
      else if (event.key === 'ArrowLeft' && current?.parent) next = this.byId.get(current.parent);
      else if (event.key === 'ArrowRight' && current) next = this.nodes.find((node) => node.parent === current.id) || null;
      else if (event.key === 'Escape' && this.selectedId !== null && (!this.iframe || (0,_open_surface_mark_js__WEBPACK_IMPORTED_MODULE_6__.isTopOpenSurface)(this))) {
        event.preventDefault();
        this.select(null);
        return;
      } else if (event.key === 'Enter' && this.iframe && current?.flat?.editable) {
        event.preventDefault();
        this.edit(current.id);
        return;
      } else if (event.key === 'Enter' && current && (!current.flat?.editable)) {
        // Enter reaches the toolbar, as before, and asks to open the chosen
        // node: a host that opens it takes the focus from there.
        const button = this.toolbar.querySelector('button:not(:disabled)');
        if (!button && (event.altKey || event.metaKey || event.ctrlKey || event.shiftKey)) return;
        event.preventDefault();
        button?.focus();
        if (!(event.altKey || event.metaKey || event.ctrlKey || event.shiftKey)) this.sendOpen(current.id, this.nodeCentre(current.id), 'enter');
        return;
      } else if (event.key === 'Enter' && this.toolbar.querySelector('button:not(:disabled)')) {
        event.preventDefault();
        this.toolbar.querySelector('button:not(:disabled)').focus();
        return;
      } else return;
      event.preventDefault();
      if (next) this.select(next.id);
    }

    onToolbarKey(event) {
      // Only what the row shows: a group that left for «⋯» is out of the arrows' way.
      const buttons = [...this.toolbar.querySelectorAll('button:not(:disabled)')].filter((button) => !button.closest(`.${OUT}`));
      const index = buttons.indexOf(globalThis.document.activeElement);
      // Enter and Space press the button in focus; the other shortcuts work here too.
      if (event.key !== 'Enter' && event.key !== ' ' && this.runShortcut(event)) return;
      const along = this.hasAttribute('data-sf-overlay-side')
        ? { ArrowDown: 1, ArrowUp: -1 }[event.key]
        : { ArrowRight: 1, ArrowLeft: -1 }[event.key];
      if (event.key === 'Escape') {
        event.preventDefault();
        this.tree.focus();
      } else if (along) {
        event.preventDefault();
        const step = this.hasAttribute('data-sf-overlay-side') || globalThis.getComputedStyle(this).direction !== 'rtl' ? along : -along;
        buttons[(index + step + buttons.length) % buttons.length]?.focus();
      }
    }

    onToolbarClick(event) {
      const target = event.target instanceof globalThis.Element ? event.target : null;
      if (target?.closest('[data-sf-overlay-more]')) {
        this.openMore();
        return;
      }
      if (target?.closest('[data-sf-overlay-add]')) {
        const place = this.afterSelected();
        if (place) this.insertAt(place);
        return;
      }
      const button = target ? target.closest('button[data-action]') : null;
      if (!button || !this.selectedId) return;
      // The grip is pressed to drag; a click from the keyboard still reaches the host.
      if (event.detail > 0 && this.actions.find((entry) => entry.id === button.dataset.action)?.icon === GRIP_ICON) return;
      this.sendRenamed('action', { action: button.dataset.action, scope: 'entry', ids: [this.selectedId] });
    }

    onInsertionClick(event) {
      const button = event.target instanceof globalThis.Element ? event.target.closest('button[data-parent]') : null;
      if (!button) return;
      this.insertAt({ parent_id: button.dataset.parent, slot: button.dataset.slot, index: Number(button.dataset.index) });
    }

    insertAt(target) {
      this.setInsertionTarget(target);
      this.positionInsertions();
      this.emit(OVERLAY_EVENTS.insert, { ...target, parent: target.parent_id });
    }

    // «⋯» lists what the row does not show, in the actions' order, a separator
    // between groups: the groups that left, the icons past the fifth and every
    // action without an icon (C170 (1), C155; CO-1). A choice is an action.
    openMore() {
      if (!this.selectedId) return null;
      const entries = [];
      let last = null;
      for (const action of this.actions) {
        const group = this.toolGroups.find((entry) => entry.ids.includes(action.id));
        const out = !group || this.toolsOut.has(group);
        // A phone has no drag: the grip is neither in its bar nor in «⋯» (C170 (4)).
        if (!out || (group?.grip && this.isPhone())) continue;
        // One priority, one group of rows: a separator only where it changes.
        const key = group ? group.key : `p:${action.priority ?? ''}`;
        if (last !== null && key !== last) entries.push({ type: 'separator' });
        last = key;
        const entry = { id: action.id, text: action.label };
        if (action.icon) entry.icon = action.icon;
        if (action.shortcut) entry.shortcut = action.shortcut;
        if (action.disabled) entry.disabled = true;
        if (action.tone === 'danger') entry.danger = true;
        entries.push(entry);
      }
      const anchor = this.moreTool.button.querySelector?.('button') || this.moreTool.button;
      return (0,_overflow_row_js__WEBPACK_IMPORTED_MODULE_4__.openRowMenu)(this, {
        anchor,
        entries,
        label: this.messages.more,
        size: this.isPhone() ? '1' : '1/2',
        select: (id) => {
          if (id && this.selectedId) this.sendRenamed('action', { action: id, scope: 'entry', ids: [this.selectedId] });
        },
      });
    }

    isPhone() {
      return this.hasAttribute('data-sf-overlay-phone');
    }

    applyPhone() {
      const phone = Boolean(this.phoneQuery?.matches);
      if (phone === this.isPhone() && this.phoneApplied) return;
      this.phoneApplied = true;
      this.toggleAttribute('data-sf-overlay-phone', phone);
      this.renderToolbar();
      this.schedule();
    }

    renderTree() {
      if (!this.tree) return;
      this.tree.setAttribute('aria-label', this.getAttribute('label') || this.messages.tree);
      this.tree.replaceChildren(...this.nodes.map((node) => {
        const item = globalThis.document.createElement('div');
        const siblings = this.nodes.filter((entry) => entry.parent === node.parent && entry.slot === node.slot);
        const { label, badges } = this.info(node);
        item.id = `${this.id || 'sf-overlay'}-item-${node.id}`.replace(/[^A-Za-z0-9_-]/gu, '-');
        item.setAttribute('role', 'treeitem');
        item.setAttribute('aria-level', String(node.level));
        item.setAttribute('aria-setsize', String(siblings.length));
        item.setAttribute('aria-posinset', String(siblings.indexOf(node) + 1));
        item.setAttribute('aria-label', badges.length ? `${label} (${badges.join(', ')})` : label);
        item.dataset.nodeId = node.id;
        return item;
      }));
      this.renderTreeSelection();
    }

    renderTreeSelection() {
      let active = null;
      for (const item of this.tree?.children || []) {
        const selected = item.dataset.nodeId === this.selectedId;
        item.setAttribute('aria-selected', selected ? 'true' : 'false');
        if (selected) active = item.id;
      }
      if (active) this.tree.setAttribute('aria-activedescendant', active);
      else this.tree?.removeAttribute('aria-activedescendant');
    }

    // The toolbar (owner decision C170 (1), (2a); C144; C155): the block's kind
    // icon and name, a separator, then the icon actions in groups -- neighbours
    // of one priority are a group, the grip is a group of its own -- 4 apart
    // with a separator between groups, and «⋯» last. Up to five icons stand in
    // the row; the rest, and every action without an icon, are in «⋯» (CO-1).
    // Buttons stay where they are: each is kept by its action's id, updated in
    // place, and an unavailable one dims, so focus and neighbours never move.
    renderToolbar() {
      if (!this.toolbar) return;
      this.toolbar.setAttribute('aria-label', this.messages.toolbar);
      const active = globalThis.document.activeElement;
      const focused = this.toolbar.contains(active) ? active : null;
      const phone = this.isPhone();
      const previous = this.actionParts;
      this.actionParts = new Map();
      this.menuOnly = [];
      const groups = [];
      let icons = 0;
      for (const action of this.actions) {
        if (!action.icon || icons >= ROW_ICONS) {
          this.menuOnly.push(action);
          continue;
        }
        icons += 1;
        const parts = previous.get(action.id) || this.createTool(action);
        this.updateAction(parts, action, phone);
        this.actionParts.set(action.id, parts);
        const grip = action.icon === GRIP_ICON;
        const key = grip ? 'grip' : `p:${action.priority ?? ''}`;
        const last = groups[groups.length - 1];
        if (last && last.key === key && !grip) last.parts.push(parts);
        else groups.push({ key, grip, priority: grip ? 'pin' : action.priority, parts: [parts] });
      }
      // Group boxes are kept by their place, so a stable row moves nothing.
      this.groupParts.length = Math.min(this.groupParts.length, groups.length);
      this.toolGroups = groups.map((group, at) => {
        let parts = this.groupParts[at];
        if (!parts) {
          const element = globalThis.document.createElement('span');
          element.className = 'sf-composition-overlay-group';
          parts = { element, separator: this.separator() };
          this.groupParts[at] = parts;
        }
        sync(parts.element, group.parts.map((tool) => tool.root));
        parts.element.toggleAttribute('data-sf-overlay-grip-group', group.grip);
        parts.separator.toggleAttribute('data-sf-overlay-grip-group', group.grip);
        return { ...group, element: parts.element, separator: parts.separator, ids: group.parts.map((tool) => tool.action.id) };
      });
      this.toolsOut = new Set();
      this.updateName();
      this.updateTool(this.moreTool, { icon: 'more_horiz', label: this.messages.more }, phone);
      const after = this.afterSelected();
      this.updateTool(this.addTool, { icon: 'add', label: format(this.messages.insertAfter, { label: this.selectedId ? this.info(this.byId.get(this.selectedId)).label : '' }), appearance: 'default' }, phone);
      this.addTool.button.toggleAttribute('disabled', !after);
      const roots = [this.nameItem, this.nameSeparator];
      this.toolGroups.forEach((group, at) => {
        roots.push(group.element);
        if (at < this.toolGroups.length - 1) roots.push(group.separator);
      });
      if (phone) roots.push(this.addTool.root);
      roots.push(this.moreSeparator, this.moreTool.root);
      sync(this.toolbar, roots);
      // Until it is laid out the row shows every group and no «⋯».
      this.moreTool.root.classList.toggle(OUT, this.menuOnly.length === 0);
      this.moreSeparator.classList.toggle(OUT, this.menuOnly.length === 0 || this.toolGroups.length === 0);
      this.rowKey = '';
      if (focused && (!focused.isConnected || focused.disabled)) (this.toolbar.querySelector('button:not(:disabled)') || this.tree)?.focus();
      this.toolbarKeys?.refresh();
      if (!this.selectedId || this.actions.length === 0) this.toolbar.hidden = true;
    }

    // The start of the toolbar: what the host's describe() calls the block, with
    // the icon of its kind (C170 (2a)).
    updateName() {
      const node = this.selectedId ? this.byId.get(this.selectedId) : null;
      const { label = '', icon = null } = node ? this.info(node) : {};
      if (this.nameText.textContent !== label) this.nameText.textContent = label;
      this.nameIcon.textContent = icon || '';
      this.nameIcon.hidden = !icon;
      this.nameItem.title = label;
    }

    // An icon action: sf-button-icon at size 1/2 (2 on a phone, 44), its label
    // the name, and sf-tooltip holding the label and the shortcut (its shortcut
    // setting: the kbd component's quiet keys). The tooltip is the plain one,
    // its defaults. In the DOM from setActions on, so both load before the
    // first selection needs them.
    createTool(action) {
      const doc = globalThis.document;
      const root = doc.createElement('span');
      root.className = 'sf-composition-overlay-tool sf-tooltip-anchor';
      const button = doc.createElement('sf-button-icon');
      button.setAttribute('size', '1/2');
      button.setAttribute('appearance', action.appearance || 'ghost');
      if (!action.appearance) button.setAttribute('scheme', 'on-surface-variant');
      if (action.id) button.setAttribute('data-action', action.id);
      button.setAttribute('data-tooltip', '');
      const tooltip = doc.createElement('sf-tooltip');
      tooltip.setAttribute('arrow', 'bottom-center');
      tooltip.hidden = true;
      root.append(button, tooltip);
      return { root, button, tooltip, action };
    }

    updateTool(parts, action, phone) {
      const { button, tooltip } = parts;
      button.setAttribute('size', phone ? '2' : '1/2');
      button.setAttribute('icon', action.icon);
      button.setAttribute('aria-label', action.label);
      tooltip.setAttribute('text', action.label);
      if (action.shortcut) tooltip.setAttribute('shortcut', action.shortcut);
      else tooltip.removeAttribute('shortcut');
    }

    updateAction(parts, action, phone = this.isPhone()) {
      const { root, button } = parts;
      parts.action = action;
      if (action.tone) root.dataset.tone = action.tone;
      else delete root.dataset.tone;
      button.toggleAttribute('disabled', action.disabled === true);
      this.updateTool(parts, action, phone);
      root.toggleAttribute('data-sf-overlay-grip', action.icon === GRIP_ICON);
    }

    // The row in the room it has (C155's engine): whole groups leave for «⋯»,
    // the biggest priority number first, the grip never; the name gives way
    // first, down to its icon, so the toolbar is never wider than its port (CO-3).
    layoutToolbar(width) {
      const phone = this.isPhone();
      const key = `${Math.round(width)}|${phone}|${this.actions.length}|${this.toolGroups.length}`;
      this.toolbar.style.maxInlineSize = `${width / this.layerOrigin().scaleX}px`;
      if (key === this.rowKey) return;
      this.rowKey = key;
      const groups = this.toolGroups.filter((group) => !(phone && group.grip));
      for (const group of this.toolGroups) {
        const hide = phone && group.grip;
        group.element.classList.toggle(OUT, hide);
        group.separator.classList.toggle(OUT, hide);
      }
      const style = globalThis.getComputedStyle(this.toolbar);
      const { scaleX } = this.layerOrigin();
      const gap = px(style.columnGap) * scaleX;
      const fixed = (px(style.paddingInlineStart) + px(style.paddingInlineEnd) + px(globalThis.getComputedStyle(this.nameItem).minInlineSize)) * scaleX
        + gap + (0,_overflow_row_js__WEBPACK_IMPORTED_MODULE_4__.drawnBox)(this.nameSeparator).width + gap
        + (phone ? (0,_overflow_row_js__WEBPACK_IMPORTED_MODULE_4__.drawnBox)(this.addTool.root).width + gap : 0);
      const units = groups.map((group, at) => {
        const { rank, pin } = (0,_overflow_row_js__WEBPACK_IMPORTED_MODULE_4__.readPriority)(group.priority);
        return { element: group.element, rank, pin, group: at };
      });
      const separators = groups.slice(0, -1).map((group) => group.separator);
      // C155's engine (fitByPriority) over the row's measures, as layoutActionRow
      // does it, with one difference: «⋯» may stand for good, when actions live
      // in it whatever the room (the icons past the fifth, those without one).
      const widths = (0,_overflow_row_js__WEBPACK_IMPORTED_MODULE_4__.measureShown)([...units.map((unit) => unit.element), this.moreTool.root, this.moreSeparator, ...separators], OUT);
      const separator = Math.max(0, ...widths.slice(units.length + 1));
      const moreSpan = widths[units.length] + gap + (phone ? 0 : separator + gap);
      const always = this.menuOnly.length > 0;
      const { out } = (0,_overflow_row_js__WEBPACK_IMPORTED_MODULE_4__.fitByPriority)({
        units: units.map((unit, at) => ({ ...unit, width: widths[at] })),
        gap,
        separator,
        room: width - fixed - (always ? moreSpan : 0),
        more: always ? 0 : moreSpan,
      });
      const gone = new Set(out);
      units.forEach((unit, at) => unit.element.classList.toggle(OUT, gone.has(at)));
      // A separator stands between two groups that both keep something.
      const keeps = (at) => !gone.has(at);
      separators.forEach((element, at) => element.classList.toggle(OUT, !(keeps(at) && units.some((_, later) => later > at && keeps(later)))));
      const more = always || out.length > 0;
      this.moreTool.root.classList.toggle(OUT, !more);
      this.moreSeparator.classList.toggle(OUT, !more || gone.size === units.length);
      this.toolsOut = new Set(out.map((at) => groups[at]));
      for (const group of this.toolGroups) if (phone && group.grip) this.toolsOut.add(group);
    }

    schedule() {
      if (this.frameRequest || !this.connection) return;
      this.frameRequest = globalThis.requestAnimationFrame(() => {
        this.frameRequest = 0;
        this.position();
      });
    }

    positionNow() {
      if (!this.connection) return;
      if (this.frameRequest) globalThis.cancelAnimationFrame(this.frameRequest);
      this.frameRequest = 0;
      this.position();
    }

    /** A node's box on the host page: its element's rect, or in framed mode its frame box mapped out of the frame. */
    nodeBox(id) {
      const node = typeof id === 'string' ? this.byId.get(id) : null;
      if (!node) return null;
      if (!node.flat) return this.element(id)?.getBoundingClientRect() ?? null;
      const view = this.view;
      if (!view || !this.frameDoc) return null;
      const { element, rect } = node.flat;
      if (element) {
        if (!element.isConnected || element.ownerDocument !== this.frameDoc) return null;
        const box = element.getBoundingClientRect();
        if (!box.width && !box.height) return null;
        return frameRectToHost({ x: box.left, y: box.top, width: box.width, height: box.height }, view);
      }
      return frameRectToHost({ x: rect.x - view.scrollX, y: rect.y - view.scrollY, width: rect.width, height: rect.height }, view);
    }

    place(frame, id) {
      const box = id ? this.nodeBox(id) : null;
      if (!box) {
        frame.hidden = true;
        return null;
      }
      frame.hidden = false;
      Object.assign(frame.style, this.onLayer(box));
      return box;
    }

    /** A box on the host page as the left, top, width and height of a part on the layer. */
    onLayer(box) {
      const { left, top, scaleX, scaleY } = this.layerOrigin();
      const out = { left: `${(box.left - left) / scaleX}px`, top: `${(box.top - top) / scaleY}px` };
      if (box.width !== undefined) out.width = `${box.width / scaleX}px`;
      if (box.height !== undefined) out.height = `${box.height / scaleY}px`;
      return out;
    }

    /**
     * Where the parts live. In the scroller of the canvas they lie in its content
     * and travel with it: nothing listens to its scroll. Elsewhere they stay fixed
     * to the viewport and follow every scroll by script.
     */
    syncPlace() {
      const anchor = this.iframe || this.canvas;
      this.scroller = nearestScroller(anchor);
      const travels = this.scroller === nearestScroller(this);
      this.setAttribute('data-sf-overlay-place', travels ? 'content' : 'viewport');
      if (travels) {
        this.followConnection?.abort();
        this.followConnection = null;
      } else if (!this.followConnection) {
        this.followConnection = new AbortController();
        globalThis.addEventListener('scroll', () => this.schedule(), { signal: this.followConnection.signal, passive: true, capture: true });
      }
      return travels;
    }

    /** The scroller's port on the host page, and where its scrolled content starts. */
    scrollPort() {
      const scroller = this.scroller;
      const root = globalThis.document.documentElement;
      if (!scroller) return { left: 0, top: 0, right: root.clientWidth, bottom: globalThis.innerHeight, contentTop: -globalThis.scrollY };
      const box = scroller.getBoundingClientRect();
      const scale = scroller.offsetHeight > 0 && box.height > 0 ? box.height / scroller.offsetHeight : 1;
      const left = box.left + scroller.clientLeft * scale;
      const top = box.top + scroller.clientTop * scale;
      return { left, top, right: left + scroller.clientWidth * scale, bottom: top + scroller.clientHeight * scale, contentTop: top - scroller.scrollTop * scale };
    }

    position() {
      if (!this.canvas && !this.iframe) return;
      const travels = this.syncPlace();
      this.elementIndex = null;
      this.observeGeometry();
      if (this.glide) {
        this.glide.pending = true;
        return;
      }
      if (this.iframe) {
        this.view = this.frameMetrics();
        this.applyClip(this.view);
      }
      this.place(this.hoverFrame, this.hoverId && this.hoverId !== this.selectedId && !this.isPassive() ? this.hoverId : null);
      const box = this.place(this.selectedFrame, this.selectedId);
      this.positionToolbar(box, travels);
      this.positionInsertions();
      this.rememberOffsets();
    }

    positionToolbar(box, travels) {
      const clip = this.view?.clip;
      const visible = Boolean(box) && !this.isPassive() && (!this.iframe || Boolean(clip && box.right > clip.left && box.left < clip.right && box.bottom > clip.top && box.top < clip.bottom));
      // No toolbar without a drawn selection, e.g. while the host re-renders,
      // unless it holds keyboard focus.
      if (visible) this.toolbar.hidden = this.actions.length === 0;
      else if (this.isPassive() || !this.toolbar.contains(globalThis.document.activeElement)) this.toolbar.hidden = true;
      if (!visible || this.toolbar.hidden) return;
      const port = travels ? this.scrollPort() : this.followPort();
      if (this.isPhone()) {
        // A phone's bottom bar, the screen's width (C170 (4)): placed by the sheet.
        this.toolbar.setAttribute('aria-orientation', 'horizontal');
        this.toggleAttribute('data-sf-overlay-side', false);
        Object.assign(this.toolbar.style, { left: '', top: '' });
        this.layoutToolbar(globalThis.document.documentElement.clientWidth);
        return;
      }
      this.layoutToolbar(port.right - port.left);
      // The side only where the room for it is; otherwise above, as the docs say.
      const wantsSide = this.getAttribute('placement') === 'side';
      this.toggleAttribute('data-sf-overlay-side', wantsSide);
      let bar = this.toolbar.getBoundingClientRect();
      const { scaleY } = this.layerOrigin();
      const gap = px(globalThis.getComputedStyle(this.toolbar).marginBlockEnd) * scaleY;
      const side = wantsSide && port.right - box.right >= bar.width + gap;
      if (wantsSide && !side) {
        this.toggleAttribute('data-sf-overlay-side', false);
        bar = this.toolbar.getBoundingClientRect();
      }
      this.toolbar.setAttribute('aria-orientation', side ? 'vertical' : 'horizontal');
      if (travels) this.placeRail(box, bar, gap, port, side);
      else this.placeFollowing(box, bar, gap, port, side);
    }

    /**
     * The toolbar in the scrolled content: right-aligned above the block, where it
     * may overlap the block above and never the selected one. A block too tall to
     * show with its toolbar gives the rail its whole height, so the sticky toolbar
     * stays on screen while the block is. With no room above a block that fits, it
     * stands under the block; inside the block only when neither is possible.
     */
    placeRail(box, bar, gap, port, side) {
      // A sticky inset counts from inside the scroller's padding; the toolbar pins to its edge.
      const padding = this.scroller ? px(globalThis.getComputedStyle(this.scroller).paddingBlockStart) : 0;
      Object.assign(this.toolbar.style, { left: '', top: `${gap / this.layerOrigin().scaleY - padding}px` });
      if (side) {
        Object.assign(this.rail.style, this.onLayer({ left: box.right + gap, top: box.top, width: bar.width, height: Math.max(box.height, bar.height) }));
        return;
      }
      const lift = bar.height + gap;
      const tall = box.height + lift > port.bottom - port.top;
      const room = box.top - port.contentTop >= lift;
      let top = box.top - lift;
      let height = tall ? box.height + lift : bar.height;
      if (!room && !tall) top = box.bottom + gap;
      else if (!room) {
        top = port.contentTop;
        height = box.bottom - port.contentTop;
      }
      const width = Math.max(box.width, bar.width);
      const rtl = globalThis.getComputedStyle(this).direction === 'rtl';
      let left = rtl ? Math.max(box.left, port.left) : Math.min(box.right, port.right) - width;
      left = Math.max(port.left, Math.min(left, port.right - width));
      Object.assign(this.rail.style, this.onLayer({ left, top, width, height }));
    }

    /** The visible part of the page a viewport-fixed toolbar stays in. */
    followPort() {
      const root = globalThis.document.documentElement;
      return this.view?.clip ?? { left: 0, top: 0, right: root.clientWidth, bottom: globalThis.innerHeight };
    }

    // Above the node, else below it, and always inside the visible part.
    placeFollowing(box, bar, gap, port, side) {
      const rtl = globalThis.getComputedStyle(this).direction === 'rtl';
      let top;
      let left;
      if (side) {
        top = Math.max(port.top, Math.min(box.top, port.bottom - bar.height));
        left = box.right + gap;
      } else {
        const above = box.top - bar.height - gap;
        top = above >= port.top ? above : box.bottom + gap;
        top = Math.max(port.top, Math.min(top, port.bottom - bar.height));
        left = rtl ? box.left : box.right - bar.width;
      }
      const root = globalThis.document.documentElement;
      left = Math.max(0, Math.min(left, root.clientWidth - bar.width));
      Object.assign(this.toolbar.style, this.onLayer({ left, top }));
    }

    // One place to add under the pointer. Besides it only what the host keeps marked
    // and, for the keyboard, a place after the selected node that shows when it
    // takes focus: nothing else is ever drawn on the selected block.
    positionInsertions() {
      if (this.iframe) this.view = this.frameMetrics();
      const points = [];
      const add = (parent, slot, index, shown) => {
        if (points.some((point) => point.parent === parent && point.slot === slot && point.index === index)) {
          if (shown) points.find((point) => point.parent === parent && point.slot === slot && point.index === index).shown = true;
          return;
        }
        points.push({ parent, slot, index, shown });
      };
      const target = this.isPassive() ? null : this.insertionTarget;
      if (this.seam && !this.isPassive()) add(this.seam.parent, this.seam.slot, this.seam.index, true);
      if (target) add(target.parent_id, target.slot, target.index, true);
      // The «+» stands under the selected block at all times (C170 (3)); on a
      // phone it is in the bottom bar, and the place stays for the keyboard.
      const after = this.afterSelected();
      if (after) add(after.parent_id, after.slot, after.index, !this.isPhone());
      // Buttons are reused by key so keyboard focus and marks survive repositioning.
      const existing = new Map([...this.insertionLayer.children].map((button) => [button.dataset.key, button]));
      const keep = new Set();
      for (const point of points) {
        const group = this.groups().find((entry) => entry.parent === point.parent && entry.slot === point.slot);
        const line = this.seamLine(point.parent, group?.children ?? [], point.index);
        if (!line) continue;
        const key = `${point.parent}|${point.slot}|${point.index}`;
        keep.add(key);
        let button = existing.get(key);
        if (!button) {
          button = globalThis.document.createElement('button');
          button.type = 'button';
          button.className = 'sf-composition-overlay-insert';
          button.dataset.key = key;
          button.dataset.parent = point.parent;
          button.dataset.slot = point.slot;
          button.dataset.index = String(point.index);
          // The icon button's own look, round, above the line (owner R246).
          const mark = globalThis.document.createElement('span');
          mark.className = 'sf-composition-overlay-insert-mark sf-icon-button sf-icon-button--icon sf-icon-button--default sf-icon-button--primary sf-icon-button--size-1/3';
          mark.setAttribute('aria-hidden', 'true');
          const icon = globalThis.document.createElement('i');
          icon.className = 'sf-icon';
          icon.textContent = 'add';
          mark.append(icon);
          button.append(mark);
          this.insertionLayer.append(button);
        }
        const marked = Boolean(target && target.parent_id === point.parent && target.slot === point.slot && target.index === point.index);
        button.setAttribute('aria-pressed', marked ? 'true' : 'false');
        button.setAttribute('aria-label', format(this.messages.insertAt, { slot: this.placeName(point.parent, point.slot), index: point.index + 1 }));
        button.toggleAttribute('data-sf-insert-shown', point.shown);
        // Under the selected block the «+» stands alone on the frame's edge; the
        // line is drawn where a place is pointed at, marked or focused.
        const own = Boolean(after && after.parent_id === point.parent && after.slot === point.slot && after.index === point.index);
        button.toggleAttribute('data-sf-insert-after', own && !marked && !(this.seam && this.seam.parent === point.parent && this.seam.slot === point.slot && this.seam.index === point.index));
        Object.assign(button.style, this.onLayer(line));
      }
      for (const [key, button] of existing) if (!keep.has(key)) button.remove();
    }

    /** The frame's viewport on the host page and the part of it that is visible (clip). */
    frameMetrics() {
      const iframe = this.iframe;
      const win = this.frameDoc?.defaultView;
      if (!iframe?.isConnected || !win) return null;
      const rect = iframe.getBoundingClientRect();
      if (!rect.width && !rect.height) return null;
      const style = globalThis.getComputedStyle(iframe);
      const sides = (name, suffix = '') => ({ top: px(style[`${name}Top${suffix}`]), right: px(style[`${name}Right${suffix}`]), bottom: px(style[`${name}Bottom${suffix}`]), left: px(style[`${name}Left${suffix}`]) });
      const view = frameViewport({ rect, layout: { width: iframe.offsetWidth, height: iframe.offsetHeight }, border: sides('border', 'Width'), padding: sides('padding'), inner: { width: win.innerWidth, height: win.innerHeight }, scroll: { x: win.scrollX, y: win.scrollY } });
      let clip = { left: view.left, top: view.top, right: view.left + view.width, bottom: view.top + view.height };
      // Scrolling ancestors hide what lies outside them, and so does the window. In
      // the scroller's content its own edge clips the parts natively, whatever the scroll.
      const root = globalThis.document.documentElement;
      const travels = this.getAttribute('data-sf-overlay-place') === 'content';
      for (let element = iframe.parentElement; element && element !== root && element !== globalThis.document.body && !(travels && element === this.scroller); element = element.parentElement) {
        const own = globalThis.getComputedStyle(element);
        if (own.overflowX === 'visible' && own.overflowY === 'visible') continue;
        const box = element.getBoundingClientRect();
        const left = box.left + element.clientLeft;
        const top = box.top + element.clientTop;
        clip = intersect(clip, { left, top, right: left + element.clientWidth, bottom: top + element.clientHeight });
      }
      view.clip = travels ? clip : intersect(clip, { left: 0, top: 0, right: root.clientWidth, bottom: root.clientHeight });
      const inner = this.frameDoc.documentElement;
      view.scrolls = Boolean(inner) && (inner.scrollHeight > win.innerHeight + 1 || inner.scrollWidth > win.innerWidth + 1);
      return view;
    }

    /**
     * Where the layer's own box starts. Everything the overlay draws is
     * `position: fixed` and placed from page coordinates, which is right
     * while the viewport is the containing block. An ancestor with
     * `contain: layout` becomes that containing block instead -- the
     * Framework's own drawer gives it to [data-sf-drawer-container] -- and
     * every frame then sat the ancestor's corner away from its node (48 px
     * under an app bar: simai/ui-source#58, found by ui-mail). The layer is
     * `inset: 0` of the same containing block, so its corner is exactly that
     * error: zero on an ordinary page, the ancestor's corner inside one.
     */
    layerOrigin() {
      const box = this.layer?.getBoundingClientRect?.();
      if (!box) return { left: 0, top: 0, scaleX: 1, scaleY: 1 };
      // A scale on an ancestor of the layer: its px are not the page's.
      const scaleX = box.width > 0 && this.layer.offsetWidth > 0 ? box.width / this.layer.offsetWidth : 1;
      const scaleY = box.height > 0 && this.layer.offsetHeight > 0 ? box.height / this.layer.offsetHeight : 1;
      return { left: box.left, top: box.top, scaleX, scaleY };
    }

    // Parts of a frame that scrolls inside itself, or of one seen through the host's
    // scrollers from a fixed layer, are cut to what shows. In the scrolled content a
    // frame as tall as its document needs no cut, and its edges keep their seams whole.
    applyClip(view) {
      const clip = view?.clip ?? null;
      const travels = this.getAttribute('data-sf-overlay-place') === 'content';
      let value = '';
      if (travels && view && !view.scrolls) value = '';
      else if (!clip || clip.right <= clip.left || clip.bottom <= clip.top) value = 'inset(50%)';
      else {
        const layer = this.layer.getBoundingClientRect();
        const { scaleX, scaleY } = this.layerOrigin();
        value = `inset(${(clip.top - layer.top) / scaleY}px ${(layer.right - clip.right) / scaleX}px ${(layer.bottom - clip.bottom) / scaleY}px ${(clip.left - layer.left) / scaleX}px)`;
      }
      this.layer.style.clipPath = value;
      this.insertionLayer.style.clipPath = value;
    }

    // Where each node lies in its canvas, whatever the scroll: what a glide starts from.
    nodeOffset(id) {
      const node = this.byId.get(id);
      if (node?.flat) {
        const win = this.frameDoc?.defaultView;
        const { element, rect } = node.flat;
        if (!element) return rect ? { left: rect.x, top: rect.y } : null;
        if (!win || !element.isConnected) return null;
        const box = element.getBoundingClientRect();
        return box.width || box.height ? { left: box.left + win.scrollX, top: box.top + win.scrollY } : null;
      }
      const box = this.element(id)?.getBoundingClientRect();
      if (!box || !this.canvas) return null;
      const canvas = this.canvas.getBoundingClientRect();
      return { left: box.left - canvas.left, top: box.top - canvas.top };
    }

    rememberOffsets() {
      this.offsets = new Map();
      for (const node of this.nodes) {
        const offset = this.nodeOffset(node.id);
        if (offset) this.offsets.set(node.id, offset);
      }
    }

    /**
     * A new list whose nodes changed order, came or went: blocks glide from where
     * they were and the frame and toolbar travel with the selected one, on one clock.
     * The parts are placed for the end first, so a measure in between cannot see a
     * block in flight. Answers whether it placed them.
     */
    startGlide(before) {
      if (!this.connection || !before.size || this.editing || calm()) return false;
      if (this.iframe) this.view = this.frameMetrics();
      const after = new Map();
      for (const node of this.nodes) {
        const offset = this.nodeOffset(node.id);
        if (offset) after.set(node.id, offset);
      }
      const byTop = (map) => [...map.keys()].filter((id) => before.has(id) && after.has(id)).sort((a, b) => map.get(a).top - map.get(b).top);
      const order = byTop(before);
      if (!order.length) return false;
      const changed = before.size !== after.size || [...after.keys()].some((id) => !before.has(id)) || byTop(after).some((id, index) => id !== order[index]);
      if (!changed) return false;
      this.hoverId = null;
      this.clearSeam();
      this.positionNow();
      const scaleY = (this.view?.scaleY ?? 1) / this.layerOrigin().scaleY;
      const animations = [];
      const glide = (element, from) => {
        const animation = element?.animate?.([{ transform: `translateY(${from}px)` }, { transform: 'none' }], GLIDE);
        if (animation) animations.push(animation);
      };
      const carried = new Set();
      for (const node of this.nodes) {
        const element = this.nodeElement(node);
        if (!element) continue;
        if (node.parent && carried.has(node.parent)) {
          carried.add(node.id);
          continue;
        }
        const target = this.ownBox(element);
        if (!after.has(node.id)) continue;
        if (!before.has(node.id)) {
          const fade = target.animate?.([{ opacity: 0 }, { opacity: 1 }], GLIDE);
          if (fade) animations.push(fade);
          carried.add(node.id);
          continue;
        }
        const from = before.get(node.id).top - after.get(node.id).top;
        if (Math.abs(from) < 0.5) continue;
        glide(target, from);
        carried.add(node.id);
      }
      const selected = this.selectedId;
      if (selected && before.has(selected) && after.has(selected)) {
        const from = (before.get(selected).top - after.get(selected).top) * scaleY;
        if (Math.abs(from) >= 0.5) {
          glide(this.selectedFrame, from);
          glide(this.getAttribute('data-sf-overlay-place') === 'content' ? this.rail : this.toolbar, from);
        }
      }
      if (!animations.length) return true;
      const state = { animations, pending: false };
      this.glide = state;
      Promise.allSettled(animations.map((animation) => animation.finished)).then(() => {
        if (this.glide !== state) return;
        this.glide = null;
        if (state.pending) this.schedule();
      });
      return true;
    }

    settleGlide() {
      const state = this.glide;
      if (!state) return;
      this.glide = null;
      for (const animation of state.animations) animation.finish();
    }

    nodeElement(node) {
      return node.flat ? node.flat.element : this.element(node.id);
    }

    // The outermost box that holds this node's element and no other node's: the
    // whole block moves, not its inner box. The canvas's own DOM is not changed:
    // Web Animations write no attribute.
    ownBox(element) {
      const others = this.nodes.map((node) => this.nodeElement(node)).filter((other) => other && other !== element && !element.contains(other));
      let box = element;
      for (let parent = box.parentElement; parent && parent !== parent.ownerDocument.body && parent !== this.canvas; parent = parent.parentElement) {
        if (others.some((other) => parent.contains(other))) break;
        box = parent;
      }
      return box;
    }

    /** The innermost node under a pointer event in the frame: the smallest element or rect node that holds it. */
    frameNodeAt(event) {
      let best = null;
      let area = Infinity;
      const consider = (id, width, height) => {
        if (width * height < area) {
          best = id;
          area = width * height;
        }
      };
      for (let element = isElement(event.target) ? event.target : event.target?.parentElement; element; element = element.parentElement) {
        const id = this.elementIds.get(element);
        if (id === undefined || !this.byId.has(id)) continue;
        const box = element.getBoundingClientRect();
        consider(id, box.width, box.height);
      }
      const win = this.frameDoc?.defaultView;
      if (win && this.rectNodes.length && finite(event.clientX)) {
        const x = event.clientX + win.scrollX;
        const y = event.clientY + win.scrollY;
        for (const { id, flat: { rect } } of this.rectNodes) {
          if (x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height) consider(id, rect.width, rect.height);
        }
      }
      return best;
    }

    onFrameClick(event) {
      if (this.isPassive()) return;
      if (this.editing && this.editing.element.contains(event.target)) return;
      // In the editor a click selects; it never follows links or submits. A
      // click on no node goes back to no selection (the letter itself).
      event.preventDefault();
      const id = this.frameNodeAt(event);
      if (id) event.stopPropagation();
      // An editable node opens by its own inline edit (double click, Enter), not by open.
      if (id && !this.byId.get(id).flat?.editable) this.clickSelect(id, event, () => ({ x: event.clientX, y: event.clientY }));
      else {
        this.openedByClick = null;
        this.select(id);
      }
    }

    onFrameDoubleClick(event) {
      if (this.isPassive() || this.editing) return;
      const id = this.frameNodeAt(event);
      if (!id) return;
      if (!this.byId.get(id).flat?.editable) {
        this.doubleClickOpen(id, () => ({ x: event.clientX, y: event.clientY }));
        return;
      }
      event.preventDefault();
      this.edit(id);
    }

    onFrameKey(event) {
      if (this.isPassive()) return;
      if (this.editing) {
        if (event.isComposing) return;
        if (event.key === 'Enter' || event.key === 'Escape') {
          event.preventDefault();
          event.stopPropagation();
          this.finishEdit(event.key === 'Enter');
        }
        return;
      }
      if (!event.defaultPrevented) this.onTreeKey(event);
    }

    /** Starts plain-string editing of an editable node inside the frame; returns whether it started. */
    edit(id) {
      const node = typeof id === 'string' ? this.byId.get(id) : null;
      const element = node?.flat?.editable ? node.flat.element : null;
      if (!element || !this.frameDoc || !element.isConnected || element.ownerDocument !== this.frameDoc) return false;
      if (this.editing?.id === id) return true;
      if (this.editing) this.finishEdit(true);
      const returnFocus = globalThis.document.activeElement === this.tree;
      this.select(id);
      const doc = element.ownerDocument;
      const attribute = element.getAttribute('contenteditable');
      element.setAttribute('contenteditable', 'plaintext-only');
      // Where plaintext-only is unknown, rich editing is narrowed to plain text by hand.
      const plain = element.contentEditable === 'plaintext-only';
      if (!plain) element.setAttribute('contenteditable', 'true');
      const connection = new AbortController();
      const options = { signal: connection.signal };
      element.addEventListener('blur', () => this.finishEdit(true), options);
      element.addEventListener('input', () => this.schedule(), options);
      element.addEventListener('beforeinput', (event) => {
        const type = event.inputType || '';
        if (type === 'insertParagraph' || type === 'insertLineBreak' || (!plain && type.startsWith('format'))) event.preventDefault();
      }, options);
      if (!plain) {
        element.addEventListener('paste', (event) => {
          event.preventDefault();
          doc.execCommand('insertText', false, (event.clipboardData?.getData('text/plain') || '').replace(/\s+/gu, ' '));
        }, options);
      }
      this.editing = { id, element, saved: element.cloneNode(true), previous: plainText(element), attribute, connection, returnFocus };
      (0,_open_surface_mark_js__WEBPACK_IMPORTED_MODULE_6__.holdOpenSurfaceMark)(this, true);
      this.setAttribute('data-sf-overlay-editing', '');
      element.focus({ preventScroll: true });
      const selection = doc.defaultView?.getSelection();
      if (selection) {
        const range = doc.createRange();
        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      this.live.textContent = format(this.messages.editing, { label: this.info(node).label });
      this.schedule();
      return true;
    }

    /** Ends the inline edit: commit emits sf-editor-overlay-change, then sf-composition-overlay-change and -edit (cancelable) when the text changed; cancel restores it. */
    finishEdit(commit) {
      const editing = this.editing;
      if (!editing) return;
      this.editing = null;
      editing.connection.abort();
      (0,_open_surface_mark_js__WEBPACK_IMPORTED_MODULE_6__.holdOpenSurfaceMark)(this, false);
      this.removeAttribute('data-sf-overlay-editing');
      const { element } = editing;
      if (editing.attribute === null) element.removeAttribute('contenteditable');
      else element.setAttribute('contenteditable', editing.attribute);
      const restore = () => {
        if (element.isConnected) element.replaceChildren(...editing.saved.childNodes);
      };
      const value = plainText(element);
      if (!commit) restore();
      else if (value !== editing.previous) {
        // The host refused the value: the letter shows what it showed before.
        if (!this.sendRenamed('edit', { id: editing.id, value, previous: editing.previous }, true)) restore();
      }
      if (editing.returnFocus && this.isConnected) this.tree.focus({ preventScroll: true });
      this.schedule();
    }
  }

  // passive is a setting of the manifest (a property over the attribute); an
  // overlay defined without its manifest gets the same pair here.
  if (!('passive' in SfCompositionOverlay.prototype)) {
    Object.defineProperty(SfCompositionOverlay.prototype, 'passive', {
      configurable: true,
      get() { return this.isPassive(); },
      set(value) { this.toggleAttribute('passive', Boolean(value)); },
    });
  }
  registry.define('sf-editor-overlay', SfCompositionOverlay);
  // The former tag sf-composition-overlay is a dated alias (a subclass, noted once).
  (0,_tag_aliases_js__WEBPACK_IMPORTED_MODULE_2__.defineTagAliases)(SfCompositionOverlay, 'sf-editor-overlay', { define: (name, Class) => registry.define(name, Class) });
  return SfCompositionOverlay;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ OVERLAY_EVENTS, OVERLAY_EVENTS_FORMER_TAG, OVERLAY_EVENTS_LEGACY, checkOverlayActions, checkOverlayNodes, defineCompositionOverlay, flatOverlayNodes, frameRectToHost, frameViewport, openDetail, overlayNodes, shortcutMatches });

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "7c1f9c2b36da"
(__webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SORTABLE_CHECK_EVENT: () => (/* binding */ SORTABLE_CHECK_EVENT),
/* harmony export */   SORTABLE_DROP_LINE: () => (/* binding */ SORTABLE_DROP_LINE),
/* harmony export */   SORTABLE_INTENT_EVENT: () => (/* binding */ SORTABLE_INTENT_EVENT),
/* harmony export */   SORTABLE_MOVE_EVENT: () => (/* binding */ SORTABLE_MOVE_EVENT),
/* harmony export */   SORTABLE_STATE_EVENT: () => (/* binding */ SORTABLE_STATE_EVENT),
/* harmony export */   activeSortableSession: () => (/* binding */ activeSortableSession),
/* harmony export */   attachSortable: () => (/* binding */ attachSortable),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   defineSortable: () => (/* binding */ defineSortable),
/* harmony export */   registerSortableDropTarget: () => (/* binding */ registerSortableDropTarget),
/* harmony export */   requestSortableMove: () => (/* binding */ requestSortableMove),
/* harmony export */   requestSortableTransfer: () => (/* binding */ requestSortableTransfer),
/* harmony export */   sortableIndexAt: () => (/* binding */ sortableIndexAt),
/* harmony export */   sortableItemLabel: () => (/* binding */ sortableItemLabel),
/* harmony export */   sortableKeyAction: () => (/* binding */ sortableKeyAction),
/* harmony export */   sortableMoveTargets: () => (/* binding */ sortableMoveTargets),
/* harmony export */   sortableReadableText: () => (/* binding */ sortableReadableText),
/* harmony export */   sortableRefusal: () => (/* binding */ sortableRefusal),
/* harmony export */   sortableRovingStep: () => (/* binding */ sortableRovingStep),
/* harmony export */   sortableSelectable: () => (/* binding */ sortableSelectable)
/* harmony export */ });
/* harmony import */ var _page_language_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("43090d1c8307");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_page_language_js__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
_page_language_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
// Sortable drag-and-drop primitive. <sf-sortable> lists and registered
// external drop targets share one drag session. Pointer (mouse, pen, touch via
// handles), keyboard and screen-reader paths all end in the same intent event;
// the component never moves host DOM or data. The host applies the change.


// The request to move an item (simai.smart-vocabulary 1.1.5 §5 move): the
// name sf-sortable's component.json declares. The former sf-sortable-intent
// follows it with the same detail until 2026-12-01.
const SORTABLE_MOVE_EVENT = 'sf-sortable-move';
const SORTABLE_INTENT_EVENT = 'sf-sortable-intent';
const SORTABLE_STATE_EVENT = 'sf-sortable-state';
// The host's word on a target list before an item goes there by the handle's
// menu, a drag or the keys (BV-7): cancelable; a host that refuses calls
// preventDefault() and may say why in detail.reason, which the menu shows on
// the disabled row.
const SORTABLE_CHECK_EVENT = 'sf-sortable-check';

const ITEM = '[data-sf-sortable-item]';
const HANDLE = '[data-sf-sortable-handle]';
const INTERACTIVE = 'a[href],button,input,select,textarea,summary,[contenteditable]:not([contenteditable="false"])';
const NAME = /^[a-z][a-z0-9-]{0,31}$/u;
// The controls inside an item, which leave the Tab order (BV-6), and the ones
// that keep their own arrows (a text field, a radio group, a list box).
const CONTROL = `${INTERACTIVE},[tabindex]`;
const OWN_ARROWS = 'input:not([type="checkbox"]):not([type="button"]):not([type="submit"]):not([type="reset"]),select,textarea,[contenteditable]:not([contenteditable="false"]),[role="slider"],[role="spinbutton"],[role="listbox"],[role="radiogroup"]';
// An sf-list-item row keeps its list's one Tab stop and its arrows itself.
const OWN_ROVING = '[data-sf-list-roving]';
// What makes an item selectable (C146 (8)): a selection mark inside it, or a
// host-kept aria-selected. On such an item Space selects and Enter picks up (BV-8).
const SELECT_MARK = 'input[type="checkbox"],[role="checkbox"]';
const TAMED = 'data-sf-sortable-tabindex';
// The id of a list's instructions, which its items name in aria-describedby:
// a page-wide count, kept on a shared global because every bundle that
// carries this module has its own module scope. It used to be random base 36,
// and one id in about twenty-five held "h1".."h6", which the headers utility's
// rule (/(h1|h2|h3|h4|h5|h6)/, tested on every element's attributes) reads as a
// heading: the Loader asked for utility/headers on some loads and not on
// others, and the first-paint sheet lists moved from run to run.
const HELP_IDS = Symbol.for('simai.sf.sortable.help-ids');
function nextHelpId() {
  globalThis[HELP_IDS] = (globalThis[HELP_IDS] ?? 0) + 1;
  return `sf-sortable-help-${globalThis[HELP_IDS]}`;
}
const DRAG_THRESHOLD = 4;
const EDGE = 32;
// A row without a handle is taken by a finger only after a long press (owner
// C171 (2), 2026-11-14): a plain swipe over the list scrolls the page, as any
// list does. Moving further than the slop before the time is a scroll.
const LONG_PRESS = 500;
const LONG_PRESS_SLOP = 8;
/**
 * The drop line: one line two pixels thick for every place something lands --
 * a list's gap, a grid cell's side, a canvas seam of the editor overlay (owner
 * C171 (4), 2026-11-14: the overlay drew three). Its look is one rule,
 * .sf-sortable-indicator, in sf-sortable's sheet, which the overlay's rule
 * loads with it.
 */
const SORTABLE_DROP_LINE = 2;
const LINE = SORTABLE_DROP_LINE;
const HALF = SORTABLE_DROP_LINE / 2;

const MESSAGES = {
  en: {
    instructions: 'Enter or Space to pick up, arrows to move, Enter or Space to drop, Escape to cancel.',
    'instructions-select': 'Space to select, Enter to pick up, arrows to move, Enter to drop, Escape to cancel.',
    refused: 'Not here',
    picked: 'Picked up {item}. Position {index} of {total} in “{list}”.',
    moved: 'Position {index} of {total} in “{list}”.',
    dropped: 'Dropped {item} at position {index} in “{list}”.',
    cancelled: 'Move cancelled.',
    target: 'Target: {target}.',
    roledescription: 'draggable',
  },
};

const format = (template, values) => template.replace(/\{(\w+)\}/gu, (_, key) => String(values[key] ?? ''));
// In the page's language through pageText, as every component's words are;
// <html lang> alone left SF.language.use() unheard (documentation trial).
const messages = () => Object.fromEntries(Object.keys(MESSAGES.en).map((key) => [key, (0,_page_language_js__WEBPACK_IMPORTED_MODULE_0__.pageText)(MESSAGES, key, undefined, 'sf-sortable')]));
// Separate Smart bundles (sf-sortable, sf-composition-overlay) each carry a copy
// of this module; the drag session and external targets live on one global
// record so a library drag can land on the overlay. The key carries the record
// version, so bundles with another record shape never share it.
const shared = globalThis.__sfSortableSharedV1 || (globalThis.__sfSortableSharedV1 = { targets: new Set(), session: null });
const externalTargets = shared.targets;

/** The active drag session (read-only view), or null. */
function activeSortableSession() {
  return shared.session ? Object.freeze({ item: shared.session.item, from: shared.session.from, group: shared.session.group, mode: shared.session.mode, input: shared.session.input }) : null;
}

/**
 * Registers a non-list drop target such as the editor overlay.
 * resolve(x, y, session) returns {descriptor, rect, label} or null;
 * drop(session, descriptor) performs the intent emission.
 */
function registerSortableDropTarget(target) {
  if (!target || typeof target.resolve !== 'function' || typeof target.drop !== 'function') throw new TypeError('Drop target needs resolve and drop');
  externalTargets.add(target);
  return () => externalTargets.delete(target);
}

// What an item is called in the move menu and the live announcements.
//
// An item's text read as one run glued its parts: a board card said «Заказ
// № 1002 Кафе «Лето»5 070,00 ₽» (board study, 2026-11-17), the client and the
// amount being two blocks with nothing between them. Now, in order: the
// item's aria-label; the text of what aria-labelledby names; the part marked
// data-sf-sortable-label or slot="title" (the card's title); else its visible
// text with a comma between its blocks («Заказ № 1002, Кафе «Лето», 5 070,00
// ₽»). Text inside one line (a <b> in a word) stays together. Decorative
// parts (aria-hidden, hidden, tooltips, the list's live region, `skip`) are
// not read.
const LABEL_SKIP = '[aria-hidden="true"], [hidden], [role="tooltip"], .sf-sortable-live, template, script, style';
const INLINE_TAGS = new Set(['a', 'abbr', 'b', 'bdi', 'bdo', 'cite', 'code', 'data', 'dfn', 'em', 'i', 'kbd', 'label', 'mark', 'q', 's', 'samp', 'small', 'span', 'strong', 'sub', 'sup', 'time', 'u', 'var', 'wbr']);
const FLOW_PARENTS = new Set(['flex', 'inline-flex', 'grid', 'inline-grid']);

function displayOf(element) {
  const view = element.ownerDocument?.defaultView;
  if (typeof view?.getComputedStyle === 'function') {
    try {
      return view.getComputedStyle(element).display || 'inline';
    } catch {
      // A node outside a document: by its tag below.
    }
  }
  return INLINE_TAGS.has(String(element.localName ?? '').toLowerCase()) ? 'inline' : 'block';
}

const tidy = (text) => String(text ?? '').replace(/\s+/gu, ' ').trim();

/** The text of `node` read as a person sees it: its blocks, joined by commas. */
function sortableReadableText(node, { skip = '' } = {}) {
  const skipping = skip ? `${LABEL_SKIP}, ${skip}` : LABEL_SKIP;
  const runs = [''];
  const walk = (current, parentDisplay) => {
    for (const child of current.childNodes ?? []) {
      if (child.nodeType === 3) {
        runs[runs.length - 1] += child.nodeValue ?? '';
        continue;
      }
      if (child.nodeType !== 1) continue;
      if (typeof child.matches === 'function' && child.matches(skipping)) continue;
      const display = displayOf(child);
      if (display === 'none') continue;
      // A flex or grid item is a block of its own whatever its tag.
      // A box of its own (a block, an inline-block chip, a flex or grid
      // item whatever its tag) is a part; an inline element is in the line;
      // display: contents passes its parent's layout on to its children.
      const contents = display === 'contents';
      const apart = !contents && (display !== 'inline' || FLOW_PARENTS.has(parentDisplay));
      if (apart) runs.push('');
      walk(child, contents ? parentDisplay : display);
      if (apart) runs.push('');
    }
  };
  walk(node, node.nodeType === 1 ? displayOf(node) : 'block');
  return runs.map(tidy).filter(Boolean).join(', ');
}

/** What an item is called (see above); `skip` names more parts not to read. */
function sortableItemLabel(item, { skip = '' } = {}) {
  const own = tidy(item.getAttribute?.('aria-label'));
  if (own) return own;
  const ids = tidy(item.getAttribute?.('aria-labelledby')).split(' ').filter(Boolean);
  const root = item.getRootNode?.();
  const named = ids.map((id) => root?.getElementById?.(id) ?? item.ownerDocument?.getElementById?.(id)).filter(Boolean);
  if (named.length) {
    const text = named.map((node) => tidy(node.getAttribute?.('aria-label')) || sortableReadableText(node, { skip })).filter(Boolean).join(', ');
    if (text) return text;
  }
  const title = item.querySelector?.('[data-sf-sortable-label], [slot="title"]');
  if (title) {
    const text = tidy(title.getAttribute?.('aria-label')) || sortableReadableText(title, { skip });
    if (text) return text;
  }
  return sortableReadableText(item, { skip });
}

const itemLabel = (item) => sortableItemLabel(item);

function listName(list) {
  return list.getAttribute('label') || list.getAttribute('aria-label') || list.getAttribute('group') || '';
}

function items(list) {
  return [...list.querySelectorAll(ITEM)].filter((item) => item.closest('sf-sortable') === list);
}

function accepts(list, group) {
  if (!list || list.getAttribute('mode') === 'copy') return false;
  const own = list.getAttribute('group');
  const extra = (list.getAttribute('accepts') || '').split(/\s+/u).filter(Boolean);
  return group === own || extra.includes(group);
}

/** The target list's name in a move request: its id, else its group. */
function nameOf(list) {
  return list.getAttribute('id') || list.group || list.getAttribute('group') || '';
}

/**
 * Asks the host whether `item` may go from `from` to `target` (BV-7): ''
 * when it may, else the reason (the host's detail.reason, or a plain «not
 * here»). A list never asks about itself.
 */
function sortableRefusal(target, from, item) {
  if (!target || target === from) return '';
  const detail = { item: item?.getAttribute?.('data-sf-sortable-item') || '', from: from ? nameOf(from) : '', to: nameOf(target), reason: '' };
  const event = new globalThis.CustomEvent(SORTABLE_CHECK_EVENT, { bubbles: true, composed: true, cancelable: true, detail });
  if (target.dispatchEvent(event)) return '';
  return String(detail.reason || '').trim() || messages().refused;
}

/**
 * The lists an item of `list` can be sent to by the handle's menu (BV-7):
 * every list of the page that takes the list's group, the list itself among
 * them (current), in the page's order, each with the host's refusal if any.
 * A copy list or a list without a group sends nowhere.
 */
function sortableMoveTargets(list, item) {
  const group = list?.group;
  if (!group || list.mode === 'copy') return [];
  return [...globalThis.document.querySelectorAll('sf-sortable')]
    .filter((other) => other === list || accepts(other, group))
    .map((other) => ({ list: other, label: listName(other) || nameOf(other), current: other === list, reason: other === list ? '' : sortableRefusal(other, list, item) }));
}

/**
 * A move to another list asked without dragging (the handle's «Move to»): the
 * request a drag between lists ends with -- to the end of the target -- and
 * its «dropped» words. False when the host refuses the target.
 */
function requestSortableTransfer(list, item, target) {
  const id = item?.getAttribute?.('data-sf-sortable-item');
  if (!id || !target || target === list || !accepts(target, list.group) || sortableRefusal(target, list, item)) return false;
  const index = items(target).length;
  emitIntent(target, { item: id, from: nameOf(list), to: nameOf(target), index, mode: 'move' });
  list.announce?.(format(messages().dropped, { item: itemLabel(item), index: index + 1, list: listName(target) || nameOf(target) }));
  return true;
}

/** Whether an item is selectable: Space selects it rather than picking it up (BV-8). */
function sortableSelectable(item) {
  return Boolean(item?.hasAttribute?.('aria-selected') || selectMarkOf(item));
}

function selectMarkOf(item) {
  if (!item?.querySelectorAll) return null;
  return [...item.querySelectorAll(SELECT_MARK)].find((mark) => mark.closest(ITEM) === item
    && !mark.disabled && mark.getAttribute('aria-disabled') !== 'true') || null;
}

/**
 * What a key does on a list's item outside a move (BV-6, the APG layout grid,
 * as a table's rows, C146 (8)): 'prev', 'next', 'first', 'last' go to another
 * item; 'in' to the item's next control, 'out' back towards the item. The
 * list's axis moves between items; the other axis, toward its end, goes into
 * the item. Logical: in a right-to-left page the arrows of the inline axis swap.
 */
function sortableRovingStep(key, { orientation = 'vertical', rtl = false } = {}) {
  const forward = rtl ? 'ArrowLeft' : 'ArrowRight';
  const back = rtl ? 'ArrowRight' : 'ArrowLeft';
  if (key === 'Home') return 'first';
  if (key === 'End') return 'last';
  if (orientation === 'horizontal') {
    return { [back]: 'prev', [forward]: 'next', ArrowDown: 'in', ArrowUp: 'out' }[key] || null;
  }
  return { ArrowUp: 'prev', ArrowDown: 'next', [forward]: 'in', [back]: 'out' }[key] || null;
}

/**
 * What Space and Enter do on an item outside a move (BV-8, dispatcher's
 * decision 2026-11-17): Enter picks it up; Space selects a selectable item
 * (C146 (8): Space marks a record in every layout) and picks up only an item
 * that is not selectable. Anything else: null.
 */
function sortableKeyAction(key, selectable) {
  if (key === 'Enter') return 'pick';
  if (key === ' ') return selectable ? 'select' : 'pick';
  return null;
}

// The controls of an item: every one leaves the Tab order (BV-6) -- its own
// tabindex kept in data-sf-sortable-tabindex, given back when the list goes --
// and the ones a person can reach are the arrows' stops, inner ones only (an
// sf-button-icon host around its own button is the button).
function controlsOf(item) {
  return [...item.querySelectorAll(CONTROL)].filter((control) => control.closest(ITEM) === item && !control.closest('.sf-sortable-live'));
}

function tame(control) {
  if (!control.hasAttribute(TAMED)) control.setAttribute(TAMED, control.getAttribute('tabindex') ?? '');
  if (control.getAttribute('tabindex') !== '-1') control.setAttribute('tabindex', '-1');
}

function untame(control) {
  const own = control.getAttribute(TAMED);
  control.removeAttribute(TAMED);
  if (own === null) return;
  if (own === '') control.removeAttribute('tabindex');
  else control.setAttribute('tabindex', own);
}

function reachable(control) {
  if (control.disabled || control.getAttribute('aria-disabled') === 'true' || control.closest('[hidden], [inert]')) return false;
  const own = control.getAttribute(TAMED);
  const natively = control.matches(INTERACTIVE);
  if (!natively && !(own !== null && own !== '' && Number(own) >= 0)) return false;
  return control.getClientRects().length > 0;
}

function stopsOf(item) {
  const all = controlsOf(item).filter(reachable);
  return all.filter((control) => !all.some((other) => other !== control && control.contains(other)));
}

function scrollContainer(element) {
  for (let node = element?.parentElement; node; node = node.parentElement) {
    const style = globalThis.getComputedStyle(node);
    if (/(auto|scroll)/u.test(style.overflowY) && node.scrollHeight > node.clientHeight) return node;
  }
  return globalThis.document.scrollingElement;
}

function indicator() {
  let line = globalThis.document.querySelector('.sf-sortable-indicator:not([data-sf-drop-line-owner])');
  if (!line) {
    line = globalThis.document.createElement('div');
    line.className = 'sf-sortable-indicator';
    line.setAttribute('aria-hidden', 'true');
    globalThis.document.body.append(line);
  }
  return line;
}

function showIndicator(rect) {
  const line = indicator();
  if (!rect) {
    line.hidden = true;
    return;
  }
  line.hidden = false;
  Object.assign(line.style, { left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px` });
}

// The silhouette: while a pointer drags, the place the item would take opens in
// the list as an empty outline of its size, and the list moves to make room --
// a line two pixels thick said where, but not how the list would look, and the
// owner could not tell where a row would land before letting go (2026-10-13).
// The item itself leaves the flow while it is dragged; its copy follows the
// pointer. A list that wraps into a grid opens the place among its cells, in
// reading order (owner, 2026-10-14: the fields of a record view arranged in two
// columns moved with a line nobody could follow). Keyboard moves, external
// targets and a list written preview="line" keep the line.
function silhouetteFor(list) {
  return list.getAttribute('preview') !== 'line';
}

function placeholder(session) {
  if (session.placeholder) return session.placeholder;
  const box = session.sourceBox;
  const element = globalThis.document.createElement('div');
  element.className = 'sf-sortable-placeholder';
  element.setAttribute('aria-hidden', 'true');
  Object.assign(element.style, { inlineSize: `${box.width}px`, blockSize: `${box.height}px` });
  session.placeholder = element;
  return element;
}

// Where the outline goes, and the final index it stands for: counted among the
// items still in the flow -- not the dragged one -- so it is the index the item
// will have once it is moved.
function placeSilhouette(session, list, x, y) {
  const horizontal = list.getAttribute('orientation') === 'horizontal';
  const visible = items(list).filter((item) => item !== session.source);
  // A grid is read row by row; the outline is one of its cells. Whether the
  // list wraps is asked of the items left in the flow, the dragged one being
  // out of it, or remembered from when the drag began.
  const wrapped = !horizontal && (isWrapped(visible) || session.wrappedLists?.has(list));
  let index;
  if (wrapped) {
    index = wrappedIndexAt(visible, x, y);
  } else {
    const boxes = visible.map((item) => {
      const box = item.getBoundingClientRect();
      return horizontal ? { start: box.left, end: box.right } : { start: box.top, end: box.bottom };
    });
    index = sortableIndexAt(boxes, horizontal ? x : y);
  }
  const element = placeholder(session);
  const before = visible[index];
  if (before) {
    if (element.nextElementSibling !== before) before.before(element);
  } else if (visible.length) {
    const last = visible[visible.length - 1];
    if (last.nextElementSibling !== element) last.after(element);
  } else if (element.parentElement !== list) {
    list.append(element);
  }
  return index;
}

/** Index where an item would land in a list for a pointer position. */
function sortableIndexAt(boxes, coordinate, exclude = -1) {
  let index = 0;
  for (let position = 0; position < boxes.length; position += 1) {
    if (position === exclude) continue;
    const box = boxes[position];
    if (coordinate > box.start + (box.end - box.start) / 2) index = position + 1;
  }
  return index;
}

/**
 * Whether the list flows in both axes -- two items standing side by side on one
 * row. A list like that is neither vertical nor horizontal, and asking only the
 * vertical axis cannot tell the left half of a row from the right half.
 */
function isWrapped(all) {
  for (let position = 1; position < all.length; position += 1) {
    const previous = all[position - 1].getBoundingClientRect();
    const current = all[position].getBoundingClientRect();
    if (current.top < previous.bottom - 1 && current.left >= previous.right - 1) return true;
  }
  return false;
}

/** Index where an item would land in a list that wraps, in reading order. */
function wrappedIndexAt(all, x, y) {
  let index = 0;
  for (let position = 0; position < all.length; position += 1) {
    const box = all[position].getBoundingClientRect();
    const past = y > box.bottom ? true : y < box.top ? false : x > box.left + box.width / 2;
    if (past) index = position + 1;
  }
  return index;
}

function listTarget(list, x, y) {
  const all = items(list);
  const horizontal = list.getAttribute('orientation') === 'horizontal';
  if (!horizontal && isWrapped(all)) {
    const index = wrappedIndexAt(all, x, y);
    return { list, index, rect: wrappedIndicatorRect(list, all, index) };
  }
  const boxes = all.map((item) => {
    const box = item.getBoundingClientRect();
    return horizontal ? { start: box.left, end: box.right } : { start: box.top, end: box.bottom };
  });
  const index = sortableIndexAt(boxes, horizontal ? x : y);
  return { list, index, rect: listIndicatorRect(list, all, index, horizontal) };
}

/**
 * A line down the side of the place the item would take, not across the whole
 * row: in a two-column list a full-width line cannot say which of the two halves
 * the item is about to land in.
 */
function wrappedIndicatorRect(list, all, index) {
  const box = list.getBoundingClientRect();
  const before = all[index];
  const after = all[index - 1];
  if (before) {
    const target = before.getBoundingClientRect();
    return { left: target.left - HALF, top: target.top, width: LINE, height: target.height };
  }
  if (after) {
    const target = after.getBoundingClientRect();
    return { left: target.right - HALF, top: target.top, width: LINE, height: target.height };
  }
  return { left: box.left, top: box.top, width: LINE, height: box.height };
}

function listIndicatorRect(list, all, index, horizontal) {
  const box = list.getBoundingClientRect();
  const before = all[index];
  const after = all[index - 1];
  if (horizontal) {
    const x = before ? before.getBoundingClientRect().left : after ? after.getBoundingClientRect().right : box.left;
    return { left: x - HALF, top: box.top, width: LINE, height: box.height };
  }
  const y = before ? before.getBoundingClientRect().top : after ? after.getBoundingClientRect().bottom : box.top;
  return { left: box.left, top: y - HALF, width: box.width, height: LINE };
}

/**
 * The copy that follows the pointer: whole, not see-through (owner C171 (3),
 * 2026-11-14: a 40 % copy -- the dimming of the item it was cloned from -- was
 * hard to read), standing over the page on the overlay shadow (C20). The clone
 * keeps its own look; a frame of the popup surface under it gives a row with
 * no fill of its own a body, with the item's own corners.
 */
function ghostOf(item, box) {
  const doc = globalThis.document;
  const copy = item.cloneNode(true);
  copy.removeAttribute('id');
  for (const element of copy.querySelectorAll('[id]')) element.removeAttribute('id');
  for (const name of ['data-sf-sortable-dragging', 'data-sf-sortable-lifted', 'data-sf-sortable-column-source', 'tabindex']) copy.removeAttribute(name);
  copy.classList.add('sf-sortable-ghost-item');
  Object.assign(copy.style, { margin: '0', inlineSize: '100%', boxSizing: 'border-box' });
  const ghost = doc.createElement('div');
  ghost.className = 'sf-sortable-ghost';
  ghost.setAttribute('aria-hidden', 'true');
  ghost.inert = true;
  const style = globalThis.getComputedStyle(item);
  ghost.style.borderRadius = style.borderRadius;
  ghost.style.direction = style.direction;
  Object.assign(ghost.style, { width: `${box.width}px`, left: `${box.left}px`, top: `${box.top}px` });
  ghost.append(copy);
  doc.body.append(ghost);
  return ghost;
}

// A pointer drag ends with a click on what was under it (the handle, or a link
// in a row): that click is the drop, not a press, and the handle's menu or the
// link must not answer it. It comes in the same task as the pointerup.
function swallowNextClick() {
  const swallow = (event) => { event.preventDefault(); event.stopImmediatePropagation(); };
  globalThis.addEventListener('click', swallow, { capture: true, once: true });
  globalThis.setTimeout(() => globalThis.removeEventListener('click', swallow, { capture: true }), 0);
}

// What a reader says an item is (SO-1): a row that is a plain box takes a role
// -- a button when nothing inside it is a control, a group when it holds one
// (a control inside a button is not reachable) -- and every item says it can be
// moved, in the page's language. A host's own role and description stay.
const GENERIC = new Set(['DIV', 'SPAN', 'SECTION', 'ARTICLE', 'P']);
// The description this module wrote is remembered on the item (a shared
// symbol: every bundle carries this module), so a later language -- the page's
// pack arriving after the list was drawn, SF.language.use(), a changed lang --
// replaces its own word and never a host's (VS-SITE-4: the board kept
// «draggable» on a Russian page when the pack came after the list).
const SAID_ROLE = Symbol.for('simai.sf.sortable.roledescription');
function describeItem(item) {
  if (!item.hasAttribute('role') && GENERIC.has(item.tagName)) {
    const holdsControl = item.querySelector(`${INTERACTIVE},${HANDLE},[tabindex]`);
    item.setAttribute('role', holdsControl ? 'group' : 'button');
  }
  const current = item.getAttribute('aria-roledescription');
  if (current !== null && current !== item[SAID_ROLE]) return;
  const word = messages().roledescription;
  if (current !== word) item.setAttribute('aria-roledescription', word);
  item[SAID_ROLE] = word;
}

/**
 * A move a host asks for without dragging (the handle's menu): the same request
 * and the same "dropped" words a drag ends with. index is the place the item
 * takes once moved, as a drag's is.
 */
function requestSortableMove(list, item, index) {
  const all = items(list);
  const id = item?.getAttribute?.('data-sf-sortable-item');
  const from = all.indexOf(item);
  if (!id || from < 0 || index < 0 || index >= all.length || index === from) return false;
  const name = list.getAttribute('id') || list.group || list.getAttribute('group') || '';
  emitIntent(list, { item: id, from: name, to: name, index, mode: 'move' });
  list.announce?.(format(messages().dropped, { item: itemLabel(item), index: index + 1, list: listName(list) }));
  return true;
}

// An sf-sortable list sends the new name and its aliases.json sends the old
// one after it; a container the column mode attached to, or a list defined
// without its manifest, sends both here.
function emitIntent(target, detail) {
  const frozen = Object.freeze(detail);
  target.dispatchEvent(new globalThis.CustomEvent(SORTABLE_MOVE_EVENT, { bubbles: true, composed: true, detail: frozen }));
  if (!target.__sfAliases) target.dispatchEvent(new globalThis.CustomEvent(SORTABLE_INTENT_EVENT, { bubbles: true, composed: true, detail: frozen }));
}

// A keyboard move ends with the person's focus on the item they moved. The
// host applies the intent by redrawing its list, and a redraw that replaces
// the dragged element drops focus to the body: the keyboard user lost their
// place in the page and had to tab back from the top (consumer case
// ui-mail.sortable-editor-recipe, 2026-10-21). Two frames after the drop --
// the host has redrawn by then -- the item with the same id takes focus back,
// in whichever list it landed. A host that restores focus itself keeps it:
// focus is only moved when it fell to the body or out of the document.
function restoreFocusAfterDrop(ended) {
  const document_ = globalThis.document;
  const id = ended.item;
  if (!id || !document_) return;
  const place = () => {
    const active = document_.activeElement;
    if (active && active !== document_.body && document_.contains(active)) return;
    const scope = ended.list && document_.contains(ended.list) ? ended.list : document_;
    const item = scope.querySelector(`[data-sf-sortable-item="${globalThis.CSS?.escape ? globalThis.CSS.escape(id) : id}"]`);
    item?.focus?.({ preventScroll: false });
  };
  if (typeof globalThis.requestAnimationFrame !== 'function') { place(); return; }
  globalThis.requestAnimationFrame(() => globalThis.requestAnimationFrame(place));
}

// A target list the host refused for the item being moved (BV-7), asked once
// per list in a drag or a keyboard move.
function refusedInSession(list) {
  const session = shared.session;
  if (!session || list === session.fromList) return '';
  session.refusals ??= new Map();
  if (!session.refusals.has(list)) session.refusals.set(list, sortableRefusal(list, session.fromList, session.source));
  return session.refusals.get(list);
}

function finish(list, reason) {
  if (!shared.session) return;
  const ended = shared.session;
  shared.session = null;
  ended.cleanup?.abort();
  if (ended.scrollFrame) globalThis.cancelAnimationFrame(ended.scrollFrame);
  ended.source?.removeAttribute('data-sf-sortable-dragging');
  ended.source?.removeAttribute('data-sf-sortable-lifted');
  ended.placeholder?.remove();
  ended.ghost?.remove();
  showIndicator(null);
  for (const target of externalTargets) target.leave?.();
  globalThis.document.documentElement.removeAttribute('data-sf-sortable-active');
  list.dispatchEvent(new globalThis.CustomEvent(SORTABLE_STATE_EVENT, { bubbles: true, composed: true, detail: Object.freeze({ state: reason, item: ended.item }) }));
  if (reason === 'dropped' && ended.input === 'keyboard') restoreFocusAfterDrop(ended);
}

// base: the class made from sf-sortable's component.json (manifest-host.mjs);
// without it the list is a plain element, as the overlay's bundle defines it.
function defineSortable(registry = globalThis.customElements, { base = null } = {}) {
  if (!registry || typeof globalThis.HTMLElement !== 'function') return null;
  const existing = registry.get('sf-sortable');
  if (existing) return existing;

  class SfSortable extends (base || globalThis.HTMLElement) {
    constructor() {
      super();
      this.connection = null;
      this.live = null;
      this.instructions = null;
      this.currentItem = null;
    }

    connectedCallback() {
      super.connectedCallback?.();
      // Inside another element's printed first paint the list is a picture:
      // the element around it draws the live list (manifest-host.mjs
      // sfInPicture). It adds no live region beside the printed one and
      // takes no keys until then.
      if (this.sfInPicture?.()) return;
      if (this.connection) return;
      this.connection = new AbortController();
      const options = { signal: this.connection.signal };
      if (!this.live) {
        this.live = globalThis.document.createElement('div');
        this.live.className = 'sf-sortable-live';
        // Pick-up, move and drop are routine steps the person caused; polite
        // waits for the reader instead of cutting across what it was saying.
        this.live.setAttribute('aria-live', 'polite');
        this.instructions = globalThis.document.createElement('div');
        this.instructions.className = 'sf-sortable-live';
        this.instructions.id = nextHelpId();
      }
      this.append(this.live, this.instructions);
      this.writeInstructions();
      // The words are the page's language when they are read, not when the
      // list was drawn: the language file may arrive later (a Smart bundle
      // before core.js, a slow network), the page may choose another language
      // or change a lang. The instructions and the items' description follow.
      const offLanguage = _page_language_js__WEBPACK_IMPORTED_MODULE_0__.language.onChange(() => this.refreshWords());
      // Followed through the instructions node: followLanguage keeps one
      // redraw per element, and the list itself may be a Smart element with
      // its own.
      const unwatch = (0,_page_language_js__WEBPACK_IMPORTED_MODULE_0__.followLanguage)(this.instructions, () => this.refreshWords());
      this.connection.signal.addEventListener('abort', () => { offLanguage(); unwatch(); }, { once: true });
      this.addEventListener('pointerdown', (event) => this.onPointerDown(event), options);
      this.addEventListener('keydown', (event) => this.onKeyDown(event), options);
      this.addEventListener('focusin', (event) => {
        const item = event.target.closest?.(ITEM);
        this.prepareItem(item);
        // The item a person was on is the list's Tab stop (BV-6).
        if (item && item.closest('sf-sortable') === this && !item.matches(OWN_ROVING) && this.currentItem !== item) {
          this.currentItem = item;
          this.syncRoving();
        }
      }, options);
      for (const item of items(this)) this.prepareItem(item);
      this.syncRoving();
      // Items the host adds later become focusable and draggable as well.
      this.observer = new globalThis.MutationObserver(() => { this.ensureAccessibilityNodes(); for (const item of items(this)) this.prepareItem(item); this.syncRoving(); });
      this.observer.observe(this, { childList: true, subtree: true });
      this.setAttribute('data-sf-sortable', 'connected');
    }

    disconnectedCallback() {
      super.disconnectedCallback?.();
      this.observer?.disconnect();
      this.observer = null;
      this.connection?.abort();
      this.connection = null;
      for (const control of this.querySelectorAll(`[${TAMED}]`)) untame(control);
      if (shared.session?.fromList === this || shared.session?.list === this) finish(this, 'cancelled');
      this.setAttribute('data-sf-sortable', 'disposed');
    }

    prepareItem(item) {
      if (!item || item.closest('sf-sortable') !== this) return;
      // An sf-list-item row takes its own place in the list's one Tab stop.
      if (item.matches(OWN_ROVING)) {
        if (!item.hasAttribute('tabindex') && !item.matches(INTERACTIVE)) item.tabIndex = 0;
      } else {
        // The list is one Tab stop (BV-6): the arrows go between its items, and
        // the controls inside an item are reached from it with the arrows.
        if (!item.hasAttribute('tabindex')) item.tabIndex = -1;
        for (const control of controlsOf(item)) tame(control);
      }
      const described = (item.getAttribute('aria-describedby') || '').split(/\s+/u);
      if (this.instructions && !described.includes(this.instructions.id)) item.setAttribute('aria-describedby', [...described.filter(Boolean), this.instructions.id].join(' '));
      describeItem(item);
      // A row without a handle is the handle itself; a finger takes it by a long
      // press, so the page keeps scrolling over it (SO-3: touch-action none on
      // the whole row stopped that).
      item.toggleAttribute('data-sf-sortable-whole', !item.querySelector(HANDLE));
    }

    // The one item of the list that takes Tab (BV-6): the one a person was on
    // last, else the selected one, else the first. Every other item and every
    // control inside an item is -1.
    syncRoving() {
      const all = items(this).filter((item) => !item.matches(OWN_ROVING));
      if (!all.includes(this.currentItem)) {
        this.currentItem = all.find((item) => item.getAttribute('aria-selected') === 'true') || all[0] || null;
      }
      for (const item of all) {
        const want = item === this.currentItem ? '0' : '-1';
        if (item.getAttribute('tabindex') !== want) item.setAttribute('tabindex', want);
      }
      this.writeInstructions();
    }

    refreshWords() {
      if (!this.connection) return;
      this.writeInstructions();
      for (const item of items(this)) if (item.closest('sf-sortable') === this) describeItem(item);
    }

    // On a list of selectable items the instructions say Space selects (BV-8).
    // An extension of the element may add its own hint after these words
    // through updateInstructions(); they are kept when they already lead.
    writeInstructions() {
      if (!this.instructions) return;
      const words = messages();
      const text = items(this).some(sortableSelectable) ? words['instructions-select'] : words.instructions;
      const current = this.instructions.textContent;
      if (current === text || current.startsWith(`${text} `)) return;
      this.instructions.textContent = text;
      this.updateInstructions?.();
    }

    focusItem(item) {
      if (!item) return;
      this.currentItem = item;
      this.syncRoving();
      item.focus({ preventScroll: false });
    }

    // Keys outside a move on an item or a control in it (BV-6): the list's
    // axis goes between items, the other one in and out of the item's
    // controls; Escape on a control goes back to its item. A control with
    // arrows of its own (a field) keeps them.
    onRovingKey(event, item) {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return false;
      if (item.matches(OWN_ROVING)) return false;
      const onItem = event.target === item;
      if (!onItem && (event.target.matches(OWN_ARROWS) || event.target.closest?.(ITEM) !== item)) return false;
      if (!onItem && event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        this.focusItem(item);
        return true;
      }
      const step = sortableRovingStep(event.key, { orientation: this.getAttribute('orientation') === 'horizontal' ? 'horizontal' : 'vertical', rtl: globalThis.getComputedStyle(this).direction === 'rtl' });
      if (!step) return false;
      event.preventDefault();
      event.stopPropagation();
      const stops = stopsOf(item);
      const at = stops.indexOf(event.target);
      if (step === 'in') {
        const next = onItem ? stops[0] : stops[Math.min(stops.length - 1, at + 1)];
        next?.focus({ preventScroll: false });
        return true;
      }
      if (step === 'out') {
        if (!onItem) (at > 0 ? stops[at - 1] : item).focus({ preventScroll: false });
        return true;
      }
      if (!onItem) {
        this.focusItem(item);
        return true;
      }
      const all = items(this).filter((entry) => !entry.matches(OWN_ROVING));
      const index = all.indexOf(item);
      const target = { prev: all[index - 1], next: all[index + 1], first: all[0], last: all.at(-1) }[step];
      if (target && target !== item) this.focusItem(target);
      return true;
    }

    // The list keeps its live region and its instructions among its own
    // children, so a host that redraws the list with replaceChildren() takes
    // them out: announcements then went to a detached node, and items said
    // nothing (consumer case ui-mail.sortable-editor-recipe, 2026-10-21). The
    // component owns these two nodes and puts them back, with the same
    // instructions id the items point at through aria-describedby.
    ensureAccessibilityNodes() {
      if (!this.live || !this.instructions) return;
      if (this.live.parentNode === this && this.instructions.parentNode === this) return;
      this.append(this.live, this.instructions);
      this.writeInstructions();
    }

    announce(text) {
      this.ensureAccessibilityNodes();
      if (this.live) this.live.textContent = text;
    }

    get group() {
      const value = this.getAttribute('group') || '';
      return NAME.test(value) ? value : '';
    }

    get mode() {
      return this.getAttribute('mode') === 'copy' ? 'copy' : 'move';
    }

    begin(item, input) {
      const id = item.getAttribute('data-sf-sortable-item');
      if (!id || !this.group || shared.session) return false;
      const all = items(this);
      const sourceBox = item.getBoundingClientRect();
      shared.session = {
        sourceBox,
        item: id, from: this.getAttribute('id') || this.group, group: this.group, mode: this.mode, input,
        source: item, fromList: this, sourceIndex: all.indexOf(item), list: this.mode === 'copy' ? null : this,
        index: all.indexOf(item), external: null, cleanup: new AbortController(),
      };
      item.setAttribute('data-sf-sortable-dragging', '');
      globalThis.document.documentElement.setAttribute('data-sf-sortable-active', '');
      this.dispatchEvent(new globalThis.CustomEvent(SORTABLE_STATE_EVENT, { bubbles: true, composed: true, detail: Object.freeze({ state: 'picked', item: id }) }));
      return true;
    }

    // Pointer path ---------------------------------------------------------
    onPointerDown(event) {
      if (event.button !== 0 || shared.session) return;
      const item = event.target.closest?.(ITEM);
      if (!item || item.closest('sf-sortable') !== this) return;
      const handle = item.querySelector(HANDLE);
      if (handle && !handle.contains(event.target)) return;
      if (!handle && event.target.closest(INTERACTIVE) && event.target.closest(INTERACTIVE) !== item) return;
      const start = { x: event.clientX, y: event.clientY };
      const pointer = event.pointerId;
      let started = false;
      const pending = new AbortController();
      // A finger on a row without a handle: the drag waits for a long press.
      const longPress = !handle && event.pointerType === 'touch';
      let timer = 0;
      const lift = (at) => {
        if (!this.begin(item, at.pointerType || event.pointerType || 'mouse')) { pending.abort(); return false; }
        started = true;
        item.setPointerCapture?.(pointer);
        shared.session.ghost = this.ghost(item, at);
        // The item leaves the flow only once its copy is on screen; a copy
        // library (mode copy) keeps its item where it is.
        if (silhouetteFor(this) && this.mode !== 'copy') {
          shared.session.silhouette = true;
          // Asked before the item leaves the flow: with it gone, a grid of
          // two cells is one cell and does not look like a grid.
          shared.session.wrappedLists = new Set(isWrapped(items(this)) ? [this] : []);
          item.setAttribute('data-sf-sortable-lifted', '');
          this.retarget(at.clientX, at.clientY);
        }
        return true;
      };
      const move = (moveEvent) => {
        if (moveEvent.pointerId !== pointer) return;
        if (!started) {
          const distance = Math.hypot(moveEvent.clientX - start.x, moveEvent.clientY - start.y);
          if (longPress) {
            // The finger moved before the press was long: it scrolls the page.
            if (distance > LONG_PRESS_SLOP) pending.abort();
            return;
          }
          if (distance < DRAG_THRESHOLD) return;
          if (!lift(moveEvent)) return;
        }
        moveEvent.preventDefault();
        this.track(moveEvent.clientX, moveEvent.clientY);
      };
      const up = (upEvent) => {
        if (upEvent.pointerId !== pointer) return;
        pending.abort();
        if (started) { swallowNextClick(); this.drop(); }
      };
      const cancel = () => {
        pending.abort();
        if (started) finish(this, 'cancelled');
      };
      pending.signal.addEventListener('abort', () => globalThis.clearTimeout(timer));
      if (longPress) {
        timer = globalThis.setTimeout(() => {
          if (pending.signal.aborted || shared.session) return;
          if (!lift(event)) return;
          this.track(event.clientX, event.clientY);
          // From here the finger moves the row, not the page: a touchmove
          // the page does not scroll by, and no menu of the long press.
          const hold = (touchEvent) => { if (touchEvent.cancelable) touchEvent.preventDefault(); };
          globalThis.addEventListener('touchmove', hold, { signal: pending.signal, passive: false });
          globalThis.addEventListener('contextmenu', hold, { signal: pending.signal, capture: true });
        }, LONG_PRESS);
      }
      globalThis.addEventListener('pointermove', move, { signal: pending.signal, passive: false });
      globalThis.addEventListener('pointerup', up, { signal: pending.signal });
      globalThis.addEventListener('pointercancel', cancel, { signal: pending.signal });
      // Capture phase: cancel the drag before page-level Escape handlers run.
      globalThis.addEventListener('keydown', (keyEvent) => { if (keyEvent.key === 'Escape' && started) { keyEvent.preventDefault(); keyEvent.stopPropagation(); cancel(); } }, { signal: pending.signal, capture: true });
    }

    ghost(item, event) {
      const box = item.getBoundingClientRect();
      shared.session.offset = { x: event.clientX - box.left, y: event.clientY - box.top };
      return ghostOf(item, box);
    }

    track(x, y) {
      if (!shared.session) return;
      shared.session.pointer = { x, y };
      if (shared.session.ghost) Object.assign(shared.session.ghost.style, { left: `${x - shared.session.offset.x}px`, top: `${y - shared.session.offset.y}px` });
      this.retarget(x, y);
      this.startAutoScroll();
    }

    retarget(x, y) {
      const under = globalThis.document.elementFromPoint(x, y);
      const list = under?.closest?.('sf-sortable');
      for (const target of externalTargets) {
        const resolved = target.resolve(x, y, activeSortableSession());
        if (resolved) {
          shared.session.list = null;
          shared.session.external = { target, ...resolved };
          showIndicator(resolved.rect);
          return;
        }
      }
      shared.session.external = null;
      if (list && accepts(list, shared.session.group) && refusedInSession(list)) {
        shared.session.placeholder?.remove();
        shared.session.list = null;
        showIndicator(null);
        return;
      }
      if (list && accepts(list, shared.session.group)
          && shared.session.silhouette && silhouetteFor(list)) {
        shared.session.list = list;
        shared.session.index = placeSilhouette(shared.session, list, x, y);
        showIndicator(null);
        return;
      }
      shared.session.placeholder?.remove();
      if (list && accepts(list, shared.session.group)) {
        const resolved = listTarget(list, x, y);
        shared.session.list = list;
        // Store the final index: positions after the source shift by one.
        shared.session.index = list === shared.session.fromList && shared.session.mode === 'move' && resolved.index > shared.session.sourceIndex ? resolved.index - 1 : resolved.index;
        showIndicator(resolved.rect);
      } else {
        shared.session.list = null;
        showIndicator(null);
      }
    }

    // Scrolls the nearest scroll container every frame while the pointer
    // stays in its edge zone, including when the pointer is held still.
    startAutoScroll() {
      if (!shared.session || shared.session.scrollFrame) return;
      const step = () => {
        if (!shared.session?.pointer) return;
        shared.session.scrollFrame = 0;
        const { x, y } = shared.session.pointer;
        const container = scrollContainer(globalThis.document.elementFromPoint(x, y));
        if (!container) return;
        const box = container === globalThis.document.scrollingElement
          ? { top: 0, bottom: globalThis.innerHeight }
          : container.getBoundingClientRect();
        const max = container.scrollHeight - container.clientHeight;
        let delta = 0;
        if (y < box.top + EDGE && container.scrollTop > 0) delta = -Math.ceil((box.top + EDGE - y) / 4);
        else if (y > box.bottom - EDGE && container.scrollTop < max) delta = Math.ceil((y - box.bottom + EDGE) / 4);
        if (delta) {
          // Instant even under scroll-behavior: smooth, so every frame advances.
          container.scrollBy({ top: delta, behavior: 'instant' });
          this.retarget(x, y);
          shared.session.scrollFrame = globalThis.requestAnimationFrame(step);
        }
      };
      shared.session.scrollFrame = globalThis.requestAnimationFrame(step);
    }

    drop() {
      if (!shared.session) return;
      const current = shared.session;
      if (current.external) {
        current.external.target.drop(activeSortableSession(), current.external.descriptor);
        finish(this, 'dropped');
        return;
      }
      if (current.list) {
        const index = current.index;
        const unchanged = current.list === current.fromList && index === current.sourceIndex;
        if (!unchanged) {
          emitIntent(current.list, {
            item: current.item, from: current.from, to: current.list.getAttribute('id') || current.list.group,
            index, mode: current.mode,
          });
          current.list.announce?.(format(messages().dropped, { item: itemLabel(current.source), index: index + 1, list: listName(current.list) }));
          finish(this, 'dropped');
          return;
        }
      }
      finish(this, 'cancelled');
    }

    // Keyboard path --------------------------------------------------------
    keyboardTargets() {
      return [...globalThis.document.querySelectorAll('sf-sortable')].filter((list) => list === shared.session?.fromList ? shared.session.mode === 'move' : accepts(list, shared.session?.group) && !refusedInSession(list));
    }

    describeKeyboard(announce = true) {
      if (!shared.session) return;
      if (shared.session.external) {
        showIndicator(shared.session.external.rect);
        if (announce) this.announce(format(messages().target, { target: shared.session.external.label || '' }));
        return;
      }
      const list = shared.session.list;
      const full = items(list);
      const sameList = list === shared.session.fromList && shared.session.mode === 'move';
      const positions = full.length + (sameList ? 0 : 1);
      const physical = sameList && shared.session.index > shared.session.sourceIndex ? shared.session.index + 1 : shared.session.index;
      showIndicator(listIndicatorRect(list, full, Math.min(physical, full.length), list.getAttribute('orientation') === 'horizontal'));
      if (announce) this.announce(format(messages().moved, { index: shared.session.index + 1, total: positions, list: listName(list) }));
    }

    onKeyDown(event) {
      const item = event.target.closest?.(ITEM);
      if (!shared.session) {
        if (!item || item.closest('sf-sortable') !== this) return;
        if (this.onRovingKey(event, item) || event.target !== item) return;
        // Enter picks up; Space selects a selectable item and picks up any
        // other (BV-8). The host that keeps aria-selected answers Space itself.
        const action = event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey ? null : sortableKeyAction(event.key, sortableSelectable(item));
        if (!action) return;
        if (action === 'select') {
          const mark = selectMarkOf(item);
          if (mark) {
            event.preventDefault();
            mark.click();
          }
          return;
        }
        event.preventDefault();
        if (!this.begin(item, 'keyboard')) return;
        // An abandoned keyboard move is cancelled when focus or a click leaves the list.
        const abandon = () => { if (shared.session?.fromList === this) { this.announce(messages().cancelled); finish(this, 'cancelled'); } };
        const cleanup = { signal: shared.session.cleanup.signal };
        this.addEventListener('focusout', (focusEvent) => {
          if (focusEvent.relatedTarget && this.contains(focusEvent.relatedTarget)) return;
          globalThis.setTimeout(() => { if (!this.contains(globalThis.document.activeElement)) abandon(); }, 0);
        }, cleanup);
        globalThis.document.addEventListener('pointerdown', (pointerEvent) => { if (!this.contains(pointerEvent.target)) abandon(); }, { ...cleanup, capture: true });
        if (shared.session.mode === 'copy') {
          const [first] = this.keyboardTargets();
          const external = [...externalTargets].flatMap((target) => (target.keyboardTargets?.(activeSortableSession()) || []).map((entry) => ({ target, ...entry })));
          if (first) {
            shared.session.list = first;
            shared.session.index = items(first).length;
          } else if (external.length) {
            shared.session.external = external[0];
          } else {
            finish(this, 'cancelled');
            return;
          }
        }
        if (shared.session.external) {
          this.describeKeyboard(false);
          this.announce(`${format(messages().picked, { item: itemLabel(item), index: 1, total: 1, list: '' }).split('.')[0]}. ${format(messages().target, { target: shared.session.external.label || '' })}`);
          return;
        }
        const all = items(shared.session.list);
        this.describeKeyboard(false);
        this.announce(format(messages().picked, { item: itemLabel(item), index: shared.session.index + 1, total: all.length, list: listName(shared.session.list) }));
        return;
      }
      if (shared.session.input !== 'keyboard' || shared.session.fromList !== this) return;
      const lists = this.keyboardTargets();
      const external = [...externalTargets].flatMap((target) => (target.keyboardTargets?.(activeSortableSession()) || []).map((entry) => ({ target, ...entry })));
      if (event.key === 'Escape' || event.key === 'Tab') {
        if (event.key === 'Escape') event.preventDefault();
        this.announce(messages().cancelled);
        finish(this, 'cancelled');
        return;
      }
      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();
        this.drop();
        return;
      }
      const vertical = { ArrowUp: -1, ArrowDown: 1 }[event.key];
      const across = { ArrowLeft: -1, ArrowRight: 1 }[event.key];
      if (vertical === undefined && across === undefined) return;
      event.preventDefault();
      if (shared.session.external) {
        const position = external.findIndex((entry) => entry.target === shared.session.external.target && JSON.stringify(entry.descriptor) === JSON.stringify(shared.session.external.descriptor));
        const next = external[position + (vertical ?? across)];
        if (next) shared.session.external = next;
        else if ((vertical ?? across) < 0 && lists.length) {
          shared.session.external = null;
          shared.session.list = lists.at(-1);
          shared.session.index = items(shared.session.list).length - (shared.session.list === shared.session.fromList && shared.session.mode === 'move' ? 1 : 0);
        }
        this.describeKeyboard();
        return;
      }
      const list = shared.session.list;
      const count = items(list).length - (list === shared.session.fromList && shared.session.mode === 'move' ? 1 : 0);
      if (vertical !== undefined) {
        const next = shared.session.index + vertical;
        if (next >= 0 && next <= count) shared.session.index = next;
        else if (next > count && across === undefined && external.length && lists.indexOf(list) === lists.length - 1) shared.session.external = external[0];
      } else {
        const next = lists[lists.indexOf(list) + across];
        if (next) {
          shared.session.list = next;
          shared.session.index = Math.min(shared.session.index, items(next).length - (next === shared.session.fromList && shared.session.mode === 'move' ? 1 : 0));
        } else if (across > 0 && external.length) {
          shared.session.external = external[0];
        }
      }
      this.describeKeyboard();
    }
  }

  registry.define('sf-sortable', SfSortable);
  return SfSortable;
}

/**
 * sf-sortable's behaviour on any container, without the element: a table's
 * head row cannot hold a custom element around its cells, and its columns move
 * with every cell under them (owner, 2026-10-13); a table's body cannot hold
 * one around its rows either. The container keeps its markup; the controller
 * listens on it.
 *
 * options:
 *   items        selector of the movable children (required)
 *   orientation  'horizontal' (default: the column mode, columns of a head
 *                row) | 'vertical' (the row mode, rows of a list or a table
 *                body, view round 1 D1)
 *   handle       selector of an item's handle (row mode): when the item has
 *                one, a drag begins there only, and a press on it that does
 *                not become a drag opens the move menu (C171 (1)); without
 *                one the whole row is taken -- a mouse after 4 px, a finger
 *                after a long press, so a swipe still scrolls (C171 (2))
 *   keyboard     row mode: Space or Enter on a focused item picks it up,
 *                arrows move it, Space or Enter drops, Escape or Tab cancels,
 *                each step said in the live region -- sf-sortable's keys.
 *                Default true; false for rows whose keys are the host's (the
 *                handle's menu stays the keyboard path then)
 *   keyOf        (item) => string -- the item's id in the intent; default its
 *                data-sf-sortable-item, else data-key, else data-row-id
 *   canStart     (event, item) => boolean -- a press that may begin a drag
 *   groupOf      (item) => string -- an item moves among items of its group
 *   preview      'column' | 'line'; the column mode draws 'column' (an outline
 *                the size of the column), the row mode 'line' (the one 2 px
 *                drop line, C171 (4)) unless told otherwise
 *   extent       the element a column or a line spans (a table); default the
 *                container
 *   cellsOf      (item) => elements to mark as the moving item (its cells)
 *   label        the list's name for the announcement
 *   labelOf      (item) => string -- what the item is called in the
 *                announcements and the move menu; default its aria-label, a
 *                table row its cells' text joined by commas, anything else its
 *                visible text, the handle and hidden parts left out
 *   onIntent     ({item, from, index, group}) -- index among the group's items
 *                without the dragged one, the place it is to take
 * Returns detach(); detach.move(item, index) asks a move without dragging,
 * with the same intent and the same words (as requestSortableMove does for a
 * list).
 *
 * In the column mode keyboard reordering stays where a list is: a table's
 * column settings are an sf-sortable list with every key path. A click that
 * ends a drag is swallowed, so a heading that sorts on click does not sort on
 * a drop, and a handle does not open its menu.
 */
function attachSortable(container, options = {}) {
  if (!(container instanceof globalThis.Element) || typeof options.items !== 'string') {
    throw new TypeError('attachSortable needs a container and an items selector');
  }
  const doc = globalThis.document;
  const vertical = options.orientation === 'vertical';
  const preview = options.preview === 'line' || options.preview === 'column' ? options.preview : (vertical ? 'line' : 'column');
  const groupOf = typeof options.groupOf === 'function' ? options.groupOf : () => '';
  const canStart = typeof options.canStart === 'function' ? options.canStart : () => true;
  const cellsOf = typeof options.cellsOf === 'function' ? options.cellsOf : (item) => [item];
  const keyOf = typeof options.keyOf === 'function'
    ? options.keyOf
    : (item) => item.getAttribute('data-sf-sortable-item') || item.dataset.key || item.dataset.rowId || '';
  const handleSelector = vertical && typeof options.handle === 'string' && options.handle ? options.handle : '';
  // A row read as one run of text said «ПереместитьЗадача вторая11.11.2026»:
  // the handle's own name (its tooltip, drawn in the cell on hover) and every
  // cell glued together.
  const labelOf = typeof options.labelOf === 'function' ? options.labelOf : (item) => {
    if (item.getAttribute('aria-label')) return item.getAttribute('aria-label');
    const skip = handleSelector;
    if (item.tagName === 'TR') return [...item.cells].map((cell) => sortableReadableText(cell, { skip })).filter(Boolean).join(', ');
    return sortableItemLabel(item, { skip });
  };
  const keyboard = vertical && options.keyboard !== false;
  const extentOf = () => options.extent?.isConnected ? options.extent : container;
  const live = doc.createElement('div');
  live.className = 'sf-sortable-live';
  live.setAttribute('aria-live', 'polite');
  doc.body.append(live);
  // The row mode's keys are said once, in a node the items name in
  // aria-describedby, as a list's are.
  let help = null;
  if (keyboard) {
    help = doc.createElement('div');
    help.className = 'sf-sortable-live';
    help.id = nextHelpId();
    help.textContent = messages().instructions;
    doc.body.append(help);
  }
  const abort = new AbortController();
  // The keys' words follow the page's language, as a list's do (VS-SITE-4).
  if (help) {
    const rewrite = () => {
      const text = messages().instructions;
      if (help.textContent !== text) help.textContent = text;
    };
    const offLanguage = _page_language_js__WEBPACK_IMPORTED_MODULE_0__.language.onChange(rewrite);
    const unwatch = (0,_page_language_js__WEBPACK_IMPORTED_MODULE_0__.followLanguage)(help, rewrite);
    abort.signal.addEventListener('abort', () => { offLanguage(); unwatch(); }, { once: true });
  }
  let session = null;

  const members = (group) => [...container.querySelectorAll(options.items)].filter((item) => groupOf(item) === group);
  const handleOf = (item) => (handleSelector ? item.querySelector(handleSelector) : null);
  const say = (text) => { live.textContent = text; };
  const outline = () => {
    if (session.outline) return session.outline;
    const box = doc.createElement('div');
    box.className = preview === 'column' ? 'sf-sortable-column-outline' : 'sf-sortable-indicator';
    box.setAttribute('aria-hidden', 'true');
    doc.body.append(box);
    session.outline = box;
    return box;
  };

  // Where the outline or the line stands for a place among the peers (the
  // items of the group without the moving one): along the row for columns,
  // down the extent for rows.
  const draw = (boxes, index) => {
    const extent = extentOf().getBoundingClientRect();
    const before = boxes[index];
    const after = boxes[index - 1];
    const startOf = (box) => (vertical ? box.top : box.left);
    const endOf = (box) => (vertical ? box.bottom : box.right);
    const origin = vertical ? extent.top : extent.left;
    let at;
    if (preview === 'column') {
      // The outline stands where the item will be. Moving towards the start
      // it takes the place of the item it goes before (that one moves on);
      // moving towards the end it ends where the item it goes after ends.
      const size = session.size;
      if (index > session.originalIndex && after) at = endOf(after) - size;
      else at = before ? startOf(before) : (after ? endOf(after) - size : origin);
    } else {
      at = (before ? startOf(before) : after ? endOf(after) : origin) - HALF;
    }
    const length = preview === 'column' ? session.size : LINE;
    Object.assign(outline().style, vertical
      ? {left: `${extent.left}px`, top: `${at}px`, width: `${extent.width}px`, height: `${length}px`}
      : {left: `${at}px`, top: `${extent.top}px`, width: `${length}px`, height: `${extent.height}px`});
  };

  const peerBoxes = () => members(session.group).filter((item) => item !== session.item).map((item) => item.getBoundingClientRect());

  const place = (x, y) => {
    const boxes = peerBoxes();
    const coordinate = vertical ? y : x;
    let index = boxes.length;
    for (let at = 0; at < boxes.length; at += 1) {
      const box = boxes[at];
      const middle = vertical ? box.top + box.height / 2 : box.left + box.width / 2;
      if (coordinate < middle) { index = at; break; }
    }
    session.index = index;
    draw(boxes, index);
  };

  const autoScroll = (x, y) => {
    if (!vertical) {
      for (let node = container.parentElement; node; node = node.parentElement) {
        const style = globalThis.getComputedStyle(node);
        if (!/(auto|scroll)/u.test(style.overflowX) || node.scrollWidth <= node.clientWidth) continue;
        const box = node.getBoundingClientRect();
        if (x < box.left + EDGE) node.scrollBy({left: -Math.ceil((box.left + EDGE - x) / 4), behavior: 'instant'});
        else if (x > box.right - EDGE) node.scrollBy({left: Math.ceil((x - box.right + EDGE) / 4), behavior: 'instant'});
        return;
      }
      return;
    }
    const node = scrollContainer(container);
    if (!node) return;
    const box = node === doc.scrollingElement ? {top: 0, bottom: globalThis.innerHeight} : node.getBoundingClientRect();
    if (y < box.top + EDGE) node.scrollBy({top: -Math.ceil((box.top + EDGE - y) / 4), behavior: 'instant'});
    else if (y > box.bottom - EDGE) node.scrollBy({top: Math.ceil((y - box.bottom + EDGE) / 4), behavior: 'instant'});
  };

  // The intent and its words: one path for a drop, a keyboard drop and the
  // handle's menu.
  const request = (item, index, group = groupOf(item)) => {
    const id = keyOf(item);
    say(format(messages().dropped, {item: labelOf(item), index: index + 1, list: options.label || ''}));
    options.onIntent?.({item: id, from: group, index, group});
  };

  // After a keyboard move or a menu choice the person's focus is back on the
  // item they moved (or its handle), once the host has redrawn.
  const refocus = (id, toHandle) => {
    const back = () => {
      const active = doc.activeElement;
      if (active && active !== doc.body && doc.contains(active) && !(toHandle && container.contains(active))) return;
      const item = [...container.querySelectorAll(options.items)].find((candidate) => keyOf(candidate) === id);
      if (!item) return;
      const handle = toHandle ? handleOf(item) : null;
      const control = handle ? (handle.matches('button') ? handle : handle.querySelector('button') || handle) : null;
      (control && (control.matches('button') || control.tabIndex >= 0) ? control : item).focus?.({preventScroll: false});
    };
    if (typeof globalThis.requestAnimationFrame !== 'function') back();
    else globalThis.requestAnimationFrame(() => globalThis.requestAnimationFrame(back));
  };

  const end = (dropped) => {
    const ended = session;
    session = null;
    if (!ended) return;
    ended.pending.abort();
    globalThis.clearTimeout(ended.timer);
    ended.ghost?.remove();
    ended.outline?.remove();
    for (const cell of ended.cells) cell.removeAttribute('data-sf-sortable-column-source');
    doc.documentElement.removeAttribute('data-sf-sortable-active');
    if (!ended.started) return;
    // The row mode says when a drag begins and ends, as a list does; the
    // column mode stays quiet, as it always was.
    if (vertical) container.dispatchEvent(new globalThis.CustomEvent(SORTABLE_STATE_EVENT, {bubbles: true, composed: true, detail: Object.freeze({state: dropped && ended.index !== ended.originalIndex ? 'dropped' : 'cancelled', item: keyOf(ended.item)})}));
    if (ended.input !== 'keyboard') {
      // The click a drop ends with is not a click on the heading (or the
      // handle). It comes in the same task as the pointerup, so the guard is
      // gone by the next one and a later click is a click again.
      const swallow = (event) => { event.preventDefault(); event.stopImmediatePropagation(); };
      container.addEventListener('click', swallow, {capture: true, once: true});
      globalThis.setTimeout(() => container.removeEventListener('click', swallow, {capture: true}), 0);
    }
    if (!dropped) {
      say(messages().cancelled);
      return;
    }
    if (ended.index === undefined || ended.index === ended.originalIndex) {
      if (ended.input === 'keyboard') say(messages().cancelled);
      return;
    }
    request(ended.item, ended.index, ended.group);
    if (ended.input === 'keyboard') refocus(keyOf(ended.item), false);
  };

  // A row is copied into a table of its own, cell widths kept: a bare row
  // outside its table loses its columns.
  const ghostFor = (item, box) => {
    if (item.tagName !== 'TR') return ghostOf(item, box);
    const ghost = ghostOf(item, box);
    const copy = ghost.firstElementChild;
    const table = doc.createElement('table');
    const body = doc.createElement('tbody');
    table.className = item.closest('table')?.className || '';
    Object.assign(table.style, {inlineSize: '100%', tableLayout: 'fixed', borderCollapse: 'collapse', margin: '0'});
    [...copy.children].forEach((cell, at) => {
      const width = item.children[at]?.getBoundingClientRect().width;
      if (width) cell.style.inlineSize = `${width}px`;
    });
    copy.style.inlineSize = '';
    body.append(copy);
    table.append(body);
    ghost.append(table);
    return ghost;
  };

  const lift = (item, at, input) => {
    session.started = true;
    session.input = input;
    doc.documentElement.setAttribute('data-sf-sortable-active', '');
    session.cells = cellsOf(item).filter(Boolean);
    for (const cell of session.cells) cell.setAttribute('data-sf-sortable-column-source', '');
    if (vertical) container.dispatchEvent(new globalThis.CustomEvent(SORTABLE_STATE_EVENT, {bubbles: true, composed: true, detail: Object.freeze({state: 'picked', item: keyOf(item)})}));
    if (input === 'keyboard') return;
    const ghost = ghostFor(item, session.box);
    ghost.style.height = `${session.box.height}px`;
    session.ghost = ghost;
    session.offset = {x: at.x - session.box.left, y: at.y - session.box.top};
  };

  const follow = (x, y) => {
    Object.assign(session.ghost.style, {left: `${x - session.offset.x}px`, top: `${y - session.offset.y}px`});
    autoScroll(x, y);
    place(x, y);
  };

  const open = (item, extra = {}) => {
    const group = groupOf(item);
    const peers = members(group);
    if (peers.length < 2) return null;
    const box = item.getBoundingClientRect();
    session = {item, group, pending: new AbortController(), started: false, cells: [], box,
      size: vertical ? box.height : box.width, originalIndex: peers.indexOf(item), timer: 0, ...extra};
    return session;
  };

  container.addEventListener('pointerdown', (event) => {
    if (event.button !== 0 || session || shared.session) return;
    const item = event.target.closest?.(options.items);
    if (!item || !container.contains(item) || !canStart(event, item)) return;
    const handle = handleOf(item);
    if (handle && !handle.contains(event.target)) return;
    if (vertical && !handle) {
      const control = event.target.closest(INTERACTIVE);
      if (control && control !== item && item.contains(control)) return;
    }
    if (!open(item)) return;
    const start = {x: event.clientX, y: event.clientY};
    const {pending} = session;
    // A finger on a row without a handle: the drag waits for a long press, and
    // a move before it is the page's scroll (C171 (2)).
    const longPress = vertical && !handle && event.pointerType === 'touch';
    const move = (moveEvent) => {
      if (moveEvent.pointerId !== event.pointerId || !session) return;
      if (!session.started) {
        const distance = Math.hypot(moveEvent.clientX - start.x, moveEvent.clientY - start.y);
        if (longPress) {
          if (distance > LONG_PRESS_SLOP) end(false);
          return;
        }
        if (distance < DRAG_THRESHOLD) return;
        lift(item, start, moveEvent.pointerType || 'mouse');
      }
      moveEvent.preventDefault();
      follow(moveEvent.clientX, moveEvent.clientY);
    };
    if (longPress) {
      session.timer = globalThis.setTimeout(() => {
        if (!session || session.item !== item || session.started) return;
        lift(item, start, 'touch');
        follow(start.x, start.y);
        const hold = (touchEvent) => { if (touchEvent.cancelable) touchEvent.preventDefault(); };
        globalThis.addEventListener('touchmove', hold, {signal: pending.signal, passive: false});
        globalThis.addEventListener('contextmenu', hold, {signal: pending.signal, capture: true});
      }, LONG_PRESS);
    }
    globalThis.addEventListener('pointermove', move, {signal: pending.signal, passive: false});
    globalThis.addEventListener('pointerup', (upEvent) => { if (upEvent.pointerId === event.pointerId) end(true); }, {signal: pending.signal});
    globalThis.addEventListener('pointercancel', () => end(false), {signal: pending.signal});
    globalThis.addEventListener('keydown', (keyEvent) => {
      if (keyEvent.key === 'Escape' && session?.started) { keyEvent.preventDefault(); keyEvent.stopPropagation(); end(false); }
    }, {signal: pending.signal, capture: true});
  }, {signal: abort.signal});

  if (keyboard) {
    // Items name the keys when they take the focus (rows the host draws later
    // as well).
    container.addEventListener('focusin', (event) => {
      const item = event.target.closest?.(options.items);
      if (!item || !container.contains(item) || !help) return;
      const described = (item.getAttribute('aria-describedby') || '').split(/\s+/u).filter(Boolean);
      if (!described.includes(help.id)) item.setAttribute('aria-describedby', [...described, help.id].join(' '));
    }, {signal: abort.signal});
    container.addEventListener('keydown', (event) => {
      if (!session) {
        const item = event.target.closest?.(options.items);
        if (!item || event.target !== item || !container.contains(item) || shared.session) return;
        // Enter picks up; Space picks up only a row that is not selectable --
        // on a selectable row (a selection mark, aria-selected) Space is the
        // selection's, left to the host (BV-8).
        if (event.defaultPrevented || sortableKeyAction(event.key, sortableSelectable(item)) !== 'pick') return;
        if (!open(item)) return;
        event.preventDefault();
        event.stopPropagation();
        session.index = session.originalIndex;
        lift(item, null, 'keyboard');
        const total = members(session.group).length;
        draw(peerBoxes(), session.index);
        say(format(messages().picked, {item: labelOf(item), index: session.index + 1, total, list: options.label || ''}));
        // Focus or a press leaving the list abandons the move.
        const {signal} = session.pending;
        container.addEventListener('focusout', (focusEvent) => {
          if (focusEvent.relatedTarget && container.contains(focusEvent.relatedTarget)) return;
          globalThis.setTimeout(() => { if (session?.input === 'keyboard' && !container.contains(doc.activeElement)) end(false); }, 0);
        }, {signal});
        doc.addEventListener('pointerdown', (pointerEvent) => { if (!container.contains(pointerEvent.target)) end(false); }, {signal, capture: true});
        return;
      }
      if (session.input !== 'keyboard') return;
      if (event.key === 'Escape' || event.key === 'Tab') {
        if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); }
        end(false);
        return;
      }
      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();
        event.stopPropagation();
        end(true);
        return;
      }
      const step = {ArrowUp: -1, ArrowDown: 1}[event.key];
      if (step === undefined) return;
      event.preventDefault();
      event.stopPropagation();
      const total = members(session.group).length;
      const next = session.index + step;
      if (next < 0 || next > total - 1) return;
      session.index = next;
      draw(peerBoxes(), next);
      say(format(messages().moved, {index: next + 1, total, list: options.label || ''}));
    }, {signal: abort.signal});
  }

  const detach = () => {
    end(false);
    abort.abort();
    live.remove();
    help?.remove();
  };
  // A move asked without dragging (the handle's menu): the same intent and
  // words; the focus comes back to the moved item's handle.
  detach.move = (item, index) => {
    if (!item || !container.contains(item)) return false;
    const peers = members(groupOf(item));
    const from = peers.indexOf(item);
    if (from < 0 || index < 0 || index >= peers.length || index === from) return false;
    request(item, index);
    refocus(keyOf(item), true);
    return true;
  };
  detach.members = (item) => members(groupOf(item));
  detach.handle = handleSelector;
  detach.labelOf = labelOf;
  return detach;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ SORTABLE_CHECK_EVENT, SORTABLE_DROP_LINE, SORTABLE_MOVE_EVENT, activeSortableSession, attachSortable, defineSortable, registerSortableDropTarget, requestSortableMove, requestSortableTransfer, sortableIndexAt, sortableKeyAction, sortableMoveTargets, sortableRefusal, sortableRovingStep, sortableSelectable });

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "80fa922ae034"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   files: () => (/* binding */ files)
/* harmony export */ });
/* harmony import */ var _en_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("5842a411d855");
// Written by scripts/build-language-packs.mjs from src/core/lang/built-in.json
// (owner decision C282); do not edit. The words this bundle carries: the
// built-in languages' (en); every other language comes from
// a language file (core/lang/<code>.js or its parts).


const files = { en: { runtime: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime } };

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ en: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime });


/***/ },

/***/ "8e25252ed5d8"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-editor-overlay for the shim (stands/18-aliases-ci/alias.mjs, standard §16 item 20). mode: same-detail (the shim sends the new and the old name), split / detail-adds (a detail adapter, refused by the shim), attribute-and-property, method, property, manifest-only (the DOM name does not change), host-attribute (no shim), retired.","component":"sf-editor-overlay","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"sf-composition-overlay-action","to":"sf-editor-overlay-apply","kind":"event","component":"sf-editor-overlay","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":false,"manifest":{"from":"sf-composition-overlay-action","to":"apply"},"section":"§8, vocabulary 1.1.5","note":"the old detail {action_id, node_id} is made by the element\'s adapter"},{"from":"sf-composition-overlay-edit","to":"sf-editor-overlay-change","kind":"event","component":"sf-editor-overlay","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":true,"manifest":{"from":"sf-composition-overlay-edit","to":"change"},"section":"§8, vocabulary 1.1.5","note":"the old detail {node_id, value, previous} is made by the element\'s adapter; the cancel is shared"},{"from":"sf-composition-overlay","to":"sf-editor-overlay","kind":"tag","component":"sf-editor-overlay","since":"2026-11-03","remove_after":"2027-01-01","section":"rename plan R0 (ui-control RENAME-PLAN-2026-11-03), naming decision 2026-11-02","note":"the element is sf-editor-overlay; sf-composition-overlay is a subclass defined beside it until the date"},{"from":"sf-composition-overlay-select","to":"sf-editor-overlay-select","kind":"event","component":"sf-editor-overlay","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-composition-overlay-apply","to":"sf-editor-overlay-apply","kind":"event","component":"sf-editor-overlay","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-composition-overlay-insert","to":"sf-editor-overlay-insert","kind":"event","component":"sf-editor-overlay","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-composition-overlay-move","to":"sf-editor-overlay-move","kind":"event","component":"sf-editor-overlay","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-composition-overlay-change","to":"sf-editor-overlay-change","kind":"event","component":"sf-editor-overlay","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-composition-overlay-open","to":"sf-editor-overlay-open","kind":"event","component":"sf-editor-overlay","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag; open (1.5.0) follows the tag\'s alias policy as the other events do"}]}');

/***/ },

/***/ "7e115d411c69"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.editor-overlay","tag":"sf-editor-overlay","version":"1.12.11","kind":"leaf","settings":{"for":{"type":"string","default":""},"frame":{"type":"string","default":""},"accepts":{"type":"string","default":""},"label":{"type":"string","default":""},"placement":{"type":"enum","values":["top","side"],"default":"top"},"passive":{"type":"boolean","default":false},"actions":{"type":"list","default":[],"of":{"id":"string","label":"string","icon":{"type":"string","optional":true},"shortcut":{"type":"string","optional":true},"disabled":{"type":"boolean","optional":true},"tone":{"type":"enum","values":["danger"],"optional":true},"priority":{"type":"number|string","optional":true}}},"messages":{"type":"object","default":{}},"insertion-target":{"type":"object","default":{}}},"values":{},"events":{"select":{"carries":{"ids":"list","id":{"type":"id","nullable":true},"node_id":{"type":"id","nullable":true}}},"apply":{"carries":{"action":"string","scope":{"type":"enum","values":["entry"]},"ids":{"type":"list","schema":{"items":{"type":"string"}}}}},"insert":{"carries":{"parent":"id","slot":"string","index":{"type":"number","integer":true},"item":{"type":"string","optional":true},"from":{"type":"string","optional":true},"mode":{"type":"enum","values":["move","copy"],"optional":true},"parent_id":{"type":"id"}},"own-verb":true},"move":{"carries":{"ids":"list","id":"id","parent":"id","position":"number","slot":"string","node_id":{"type":"id"},"parent_id":{"type":"id"},"index":{"type":"number","integer":true}}},"change":{"carries":{"id":"id","value":"string","previous":"string"},"cancelable":true,"x-native":false},"open":{"carries":{"ids":"list","id":"id","node":{"type":"id"},"point":{"type":"object","nullable":true},"trigger":{"type":"enum","values":["click","dblclick","enter"]}}}},"actions":{"attach":{"with":{"canvas":"object"}},"attach-frame":{"with":{"iframe":"object"}},"set-document":{"with":{"document":"object","options":"object"}},"set-nodes":{"with":{"nodes":{"type":"list","of":{"id":"id","kind":"string","label":"string","parent":"id","editable":"boolean","rect":"object","element":"object"}},"options":"object"}},"set-drop-filter":{"with":{"filter":{"type":"object"}}},"set-actions":{"with":{"actions":"list"}},"set-messages":{"with":{"messages":"object"}},"set-insertion-target":{"with":{"target":{"type":"object","nullable":true}}},"select":{"with":{"id":{"type":"id","nullable":true},"options":"object"}},"edit":{"with":{"id":"string"}},"refresh":{}},"css-variables":{"--sf-composition-overlay-frame-color":{"type":"color","state":"default"},"--sf-composition-overlay-z-index":{"type":"number","state":"default"},"--sf-composition-overlay-toolbar-background-color":{"type":"color","state":"selected"},"--sf-composition-overlay-toolbar-radius":{"type":"length","state":"selected"},"--sf-composition-overlay-toolbar-gap":{"type":"length","state":"selected"}}}');

/***/ },

/***/ "5842a411d855"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Composition overlay","runtime":{"cancelled":"Move cancelled.","dropped":"Moved {label}. {place}.","editing":"Editing {label}. Enter saves, Escape cancels.","insert":"Insert","insert-after":"Insert after “{label}”","insert-at":"Insert into “{slot}”, position {index}","more":"More","picked":"Moving {label}. Arrows choose a place, Enter drops, Escape cancels.","position":"{index} of {total}","selected":"Selected: {label}","toolbar":"Actions","tree":"Page structure"},"events":{"insert":{"label":"Insert"}}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("ac307690e585");
/******/
/******/ })()
;