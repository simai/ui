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

/***/ "060946d394b8"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SfSiteHeader: () => (/* binding */ SfSiteHeader)
/* harmony export */ });
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _core_js_breakpoints_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("1373e294ec38");
/* harmony import */ var _core_js_overflow_row_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("2db3a835ac11");
/* harmony import */ var _core_js_layer_stack__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("18003344cff0");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("67b1088f5f56");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("3b2d3ad548e5");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("0ad7db0d1ea2");
/* harmony import */ var _lang_index_mjs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("14c6c8c48855");
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("32835c4bc572");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_layer_stack__WEBPACK_IMPORTED_MODULE_4__, _js_templates_default__WEBPACK_IMPORTED_MODULE_5__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_layer_stack__WEBPACK_IMPORTED_MODULE_4__, _js_templates_default__WEBPACK_IMPORTED_MODULE_5__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_layer_stack__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_4__);
// sf-header-site: the top bar of a SIMAI site -- the effects catalogue, the
// Docara documentation sites and the simai.io hub show one bar, made once
// here, rather than three copies of a header row and a mobile sheet.
//
// The bar is a frame. Its brand, navigation, actions and tools are the page's
// own markup in slots, drawn with the Framework's components; the bar gives
// them one row on the container's width and, below the `collapse` step of
// its own width (a container condition, C181 (2)), a menu button that opens the navigation and the actions as a side panel.
//
// The side panel is a layer of the shared stack (standard simai.smart-component
// 1.3.11 §19, core/js/layer-stack.js), registered the way sf-drawer registers:
// the stack orders it, hands it Escape and Tab only while it is the top layer,
// holds the one page lock and gives focus back when it closes. The panel is
// the header's own element: wide it is display: contents, so the slot nodes
// stand in the row; collapsed it is the panel. The nodes are placed once and
// never get copied (§4.5); only the settings among the tools -- the language
// and the theme switch -- move, between the bar's tools and the panel's
// «Настройки» group, when the bar crosses its breakpoint (owner decision C161
// (8)): a phone's bar keeps the menu button, the brand, search and profile.
//
// From its component.json (§3, §4, §8): the settings are made by
// core/js/element-manifest.js, open, close and toggle are the actions and
// answer outcomes, the words are the language files'.








 // Only the words on screen ship in the bundle, English only (owner decision
// C282): Russian and every other language come from a language file. The
// title, settings and events stay in the language files for the Studio and the
// docs (localization study LC-2).


const SLOTS = ['brand', 'nav', 'actions', 'tools', 'sheet'];
const TAGS = ['sf-header-site', 'sf-site-header'];
const SWITCH_OPERATIONS = ['toggle', 'open', 'close']; // A tool that is a setting of the page rather than a tool of the site: the
// language (sf-language) and the theme switch (any element with theme-switch).
// On a collapsed bar these stand in the panel under the sections (C161 (8)).

const SETTING_TOOLS = 'sf-language, [theme-switch]';

function settingKind(node) {
  if (node?.nodeType !== 1) return null;
  const setting = node.matches(SETTING_TOOLS) ? node : node.querySelector?.(SETTING_TOOLS);
  if (!setting) return null; // A wrapper that holds the setting beside other tools (search, language,
  // theme in one row) is the tools row, not the language: it was labelled
  // «Язык» though it held more (GB10). Its word is the neutral «Инструменты».

  if (setting !== node && node.children.length > 1) return 'tools';
  return setting.localName === 'sf-language' ? 'language' : 'theme';
}

let sequence = 0; // A switch of the page's own (owner decision C104, as sf-drawer's
// data-drawer): an element with data-header-site="toggle", "open" or "close"
// naming the bar's id in aria-controls. sf-button carries its data-* and
// aria-controls to its native button, so the press finds them there. One
// listener for the document, bound when the first bar connects.

function controlsBar(element, id) {
  return (element.getAttribute('aria-controls') || '').split(/\s+/u).includes(id);
}

function barSwitches(id) {
  if (!id || typeof document === 'undefined') return [];
  return Array.from(document.querySelectorAll('[data-header-site][aria-controls]')).filter(element => SWITCH_OPERATIONS.includes(element.getAttribute('data-header-site')) && controlsBar(element, id));
}

let switchesBound = false;

function bindSwitches() {
  if (switchesBound || typeof document === 'undefined') return;
  document.addEventListener('click', event => {
    if (!(event.target instanceof Element)) return;
    const trigger = event.target.closest('[data-header-site][aria-controls]');
    const operation = trigger?.getAttribute('data-header-site');
    if (!trigger || !SWITCH_OPERATIONS.includes(operation)) return;

    for (const id of trigger.getAttribute('aria-controls').split(/\s+/u)) {
      const bar = id ? document.getElementById(id) : null;

      if (bar && TAGS.includes(bar.localName) && typeof bar[operation] === 'function') {
        bar[operation](operation === 'close' ? {
          reason: 'close'
        } : undefined);
      }
    }
  });
  switchesBound = true;
}

const SiteHeaderElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_6__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: _lang_index_mjs__WEBPACK_IMPORTED_MODULE_8__.files,
  source: 'ru',
  // The events of the former tag name (sf-site-header-*) follow the current
  // ones through the shim until the date in aliases.json.
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_7__,
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

class SfSiteHeader extends SiteHeaderElement {
  // The slot nodes stay in the page until the bar draws and places them, in
  // the same task: a page that finds its sf-menu by id once the tag is
  // defined finds it on every load (pair ui-a0370c0c99fb acceptance, D1).
  static holdsSlotNodesUntilDrawn = true;

  constructor() {
    super();
    this._id = `sf-site-header-${++sequence}`;
    this.isOpen = false;
    this._media = null;

    this._onMedia = () => this.syncCollapsed(); // The bar's own width decides (the sheet's container condition); the
    // observer tells the script when it changed. undefined: not answered yet.


    this._collapsedNow = undefined;
    this._sizeObserver = null;
    this._observedHeader = null; // F-1: the bar's width at which a nav that overflowed fits again (0: it
    // fits, or it was never measured too wide).

    this._fitNeed = 0;
    this._fitFrame = 0; // collapse auto (C371, C372): the tools that give way first (sf-button
    // shrink="icon") and the width each drew whole, read while it was whole,
    // so the bar knows the row's width with them whole while they are glyphs.

    this._toolsCompact = false;
    this._wholeWidths = new WeakMap();
    this._fitting = false;

    this._onFonts = () => this.queueFit();

    this._outsideSwitch = false;
    this._switchFrame = 0;

    this._onResize = () => {
      if (this._switchFrame) return;
      this._switchFrame = globalThis.requestAnimationFrame?.(() => {
        this._switchFrame = 0;
        this.syncSwitches();
      }) ?? 0;
      if (!this._switchFrame) this.syncSwitches();
    };

    this._scrollFrame = 0;

    this._onScroll = () => {
      if (this._scrollFrame) return;
      this._scrollFrame = globalThis.requestAnimationFrame?.(() => {
        this._scrollFrame = 0;
        this.syncScrolled();
      }) ?? 0;
      if (!this._scrollFrame) this.syncScrolled();
    };
  } // The nav is the default slot (component.json): the children the page wrote
  // without a slot attribute, taken live like the named ones, never copied,
  // and held in the page until the bar draws, as the named ones are.


  onConnected() {
    super.onConnected?.();
    const live = this._liveSlotNodes;

    if (live && !live.has('nav')) {
      const nodes = Array.from(this.children).filter(child => !child.hasAttribute('slot') && !child.hasAttribute('data-sf-static') && child.localName !== 'script' && child.localName !== 'template');

      if (nodes.length) {
        nodes.forEach(node => this.holdSlotNode(node));
        live.set('nav', nodes);
      }
    }

    this.watchCollapse();
    this.watchScroll();
    bindSwitches();
    if (typeof globalThis.addEventListener === 'function') globalThis.addEventListener('resize', this._onResize, {
      passive: true
    });
    this._offSwitches?.();
    this._offSwitches = this.onAfterRender(() => {
      this.observeSize();
      if (this.collapsedAnswerStale()) this.syncCollapsed();
      this.syncSwitches();
      this.queueFit();
    }, {
      once: false
    }); // Words that arrive with a face change the nav's width, not the bar's.

    globalThis.document?.fonts?.addEventListener?.('loadingdone', this._onFonts);
  }

  disconnectedCallback() {
    if (this.isOpen) this.finishClose({
      emit: false,
      restoreFocus: false
    });
    this._media?.removeEventListener?.('change', this._onMedia);
    this._media = null;
    this._sizeObserver?.disconnect();
    this._sizeObserver = null;
    this._observedHeader = null;
    this._collapsedNow = undefined;
    globalThis.document?.fonts?.removeEventListener?.('loadingdone', this._onFonts);
    if (this._fitFrame) globalThis.cancelAnimationFrame?.(this._fitFrame);
    this._fitFrame = 0;
    this.unwatchScroll();
    if (typeof globalThis.removeEventListener === 'function') globalThis.removeEventListener('resize', this._onResize);
    if (this._switchFrame) globalThis.cancelAnimationFrame?.(this._switchFrame);
    this._switchFrame = 0;
    this._offSwitches?.();
    this._offSwitches = null;
    super.disconnectedCallback?.();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);

    if (name === 'collapse' && oldValue !== newValue && this._isMounted) {
      this._collapsedNow = undefined;
      this.setFit(0);
      this.watchCollapse();
    }

    if (name === 'sticky' && oldValue !== newValue && this._isMounted) this.watchScroll();
  } // Whether the bar is collapsed now: the sheet's own answer. The bar is the
  // container of its parts, and below the `collapse` step of its width the
  // sheet's container condition gives the row --sf-site-header--collapsed: 1
  // (C181 (2), C104): the bar and the sf-menu in it read one width, the bar's,
  // so a bar narrower than the window -- a column, a card, an example frame --
  // collapses with its nav instead of leaving the nav to fold into its own
  // button over the actions. Before the row is drawn, the window's step is the
  // guess (core/js/breakpoints.js): a full-width bar gives the same answer.


  get collapsed() {
    if (this.collapse === 'always') return true;
    if (this.collapse === 'none') return false;
    const row = this.header()?.querySelector(':scope > .sf-site-header-row');

    if (row && typeof globalThis.getComputedStyle === 'function') {
      return globalThis.getComputedStyle(row).getPropertyValue('--sf-site-header--collapsed').trim() === '1';
    }

    return this._media ? !this._media.matches : false;
  } // The sheet's answer is read again only when it can have changed: the row
  // it was read on was drawn anew, or the step changed. The bar's width is
  // the observer's (it answers after layout, at no cost). A read after each
  // drawing made the browser work out the page's styles again every time the
  // bar drew (DF-9).
  // Under collapse auto the sheet also answers by whether the nav's sf-menu
  // has its code yet (the phone's step until it has): its definition changes
  // the answer without drawing the row again, so it counts as a change too
  // (group build 14: without it the bar stood open for one frame when the
  // menu arrived, CLS 1.68 at 390).


  collapsedAnswerStale() {
    return this._collapsedNow === undefined || this._collapsedRow !== this.collapseRow() || this._collapsedStep !== this.collapse || this._collapsedMenusDefined !== this.navMenusDefined();
  }

  navMenusDefined() {
    return this.collapse !== 'auto' || this.navMenus().every(menu => menu.matches(':defined'));
  }

  collapseRow() {
    return this.header()?.querySelector(':scope > .sf-site-header-row') ?? null;
  }

  watchCollapse() {
    this._media?.removeEventListener?.('change', this._onMedia); // The guess before the row is drawn, and a wake-up when the window
    // crosses the step (the bar's width moves with it); none has no step.

    this._media = (0,_core_js_breakpoints_js__WEBPACK_IMPORTED_MODULE_2__.breakpointMedia)(this.collapse);
    this._media?.addEventListener?.('change', this._onMedia);
    this.syncCollapsed();
  } // The bar's width is watched where it is drawn: the <header> is the
  // container the sheet's condition reads.


  observeSize() {
    const header = this.header();
    if (!header || header === this._observedHeader || typeof ResizeObserver === 'undefined') return;
    this._sizeObserver?.disconnect();
    this._sizeObserver = new ResizeObserver(() => {
      if (this.collapse === 'auto') {
        this.fitRow();
        return;
      }

      this.syncCollapsed();
      this.syncFit();
    });

    this._sizeObserver.observe(header);

    this._observedHeader = header;
    this.observeParts();
  } // collapse auto: the brand and the tools are watched too -- a face that
  // arrives, a word that changes, a tool that draws late change the room the
  // nav has without changing the bar's width.


  observeParts() {
    if (!this._sizeObserver || this.collapse !== 'auto') return;
    const header = this.header();

    for (const part of header?.querySelectorAll(':scope > .sf-site-header-row > :is(.sf-site-header-brand, .sf-site-header-tools)') ?? []) {
      if (this._observedParts?.has(part)) continue;
      this._observedParts ??= new WeakSet();

      this._observedParts.add(part);

      this._sizeObserver.observe(part);
    }
  } // The bar crossed its step: the host says so, a horizontal sf-menu in the
  // nav turns into a column while it stands in the panel, and an open panel
  // the wide bar no longer has closes. Only a change acts, so the observer,
  // the drawing and the window can all ask.


  syncCollapsed() {
    const collapsed = this.collapsed;
    this._collapsedRow = this.collapseRow();
    this._collapsedStep = this.collapse;
    this._collapsedMenusDefined = this.navMenusDefined();
    if (collapsed === this._collapsedNow) return;
    this._collapsedNow = collapsed;
    this.sfHostState('data-collapsed', collapsed); // The settings among the tools stand in the bar or in the panel by the
    // bar's form: a change of form draws them again in their place.

    if (this._drawnCollapsed !== undefined && this._drawnCollapsed !== collapsed) this.requestComponentUpdate('collapse');

    for (const menu of this.navMenus()) {
      if (collapsed) {
        if (menu.dataset.sfSiteHeaderOrientation === undefined) menu.dataset.sfSiteHeaderOrientation = menu.getAttribute('orientation') ?? '';
        menu.setAttribute('orientation', 'vertical');
      } else if (menu.dataset.sfSiteHeaderOrientation !== undefined) {
        const was = menu.dataset.sfSiteHeaderOrientation;
        delete menu.dataset.sfSiteHeaderOrientation;
        if (was) menu.setAttribute('orientation', was);else menu.removeAttribute('orientation');
      }
    }

    if (!collapsed && this.isOpen) this.runClose({
      reason: 'api'
    });
  } // F-1 (docs header, 2026-11-18): a wide bar whose nav needs more room than
  // the row leaves it drew the nav over the brand and the tools (the docs'
  // static class menu of five sections at 1180-1320 px under collapse xl:
  // up to 60 px over). The bar gives way instead: when the nav's content is
  // wider than the nav's box, the host says data-nav-overflow and the sheet
  // collapses the bar as below its step -- the menu button, the nav and the
  // actions in the side panel -- until the bar is again as wide as the nav
  // measured it needed. A nav whose sf-menu gives way itself (overflow more
  // or collapse, its defaults) is left to it; collapse none never collapses
  // and always already does.


  navGivesWay() {
    return this.navMenus().some(menu => menu.getAttribute('overflow') !== 'none' || menu.getAttribute('collapse') !== 'none');
  }

  setFit(need) {
    this._fitNeed = need;
    this.sfHostState('data-nav-overflow', need > 0);
  }

  queueFit() {
    if (this._fitFrame) return;
    const raf = globalThis.requestAnimationFrame;

    if (typeof raf !== 'function') {
      this.syncFit();
      return;
    }

    this._fitFrame = raf(() => {
      this._fitFrame = 0;
      this.syncFit();
    });
  }

  syncFit() {
    if (this.collapse === 'auto') {
      this.fitRow();
      return;
    }

    const header = this.header();

    if (!header || this.collapse === 'none' || this.collapse === 'always' || typeof document === 'undefined') {
      if (this._fitNeed) this.setFit(0);
      return;
    }

    const width = header.getBoundingClientRect().width;

    if (this._fitNeed) {
      if (width < this._fitNeed) return; // Room again: draw the row and measure it in the next frame.

      this.setFit(0);
      this.syncCollapsed();
      this.queueFit();
      return;
    }

    if (this.collapsed) return;
    const nav = header.querySelector('.sf-site-header-nav');
    if (!nav || !nav.firstElementChild || this.navGivesWay()) return;
    const room = nav.getBoundingClientRect();
    const range = document.createRange();
    range.selectNodeContents(nav);
    const spread = range.getBoundingClientRect();
    const over = Math.max(0, room.left - spread.left) + Math.max(0, spread.right - room.right);
    if (over <= 0.5 || !room.height) return;
    this.setFit(Math.ceil(width + spread.width - room.width) + 1);
    this.syncCollapsed();
  } // collapse auto (owner decisions C371, C372, 2026-11-19): the bar measures
  // its own row and gives way in one order -- first the tools that can
  // (sf-button shrink="icon" draws its glyph only), then the nav's sf-menu
  // moves its sections one by one into «Ещё» (overflow more), and only when
  // not even one section beside «Ещё» fits, the menu button and the side
  // panel. Every width change is decided here, in the observer that saw it,
  // before the paint and in one step: the tools' state is written first, so
  // the nav has its final room when the menu is asked for its row in the same
  // task (measureFit({driven: true})); nothing in between is drawn.
  //
  // The widths: the row's content box; the brand, the actions and the tools
  // as they stand; a shrinking tool whole (the width it drew whole, read
  // while it was) and as a glyph (a square of its own height); the menu's
  // whole row and its narrowest row (rowNeeds, one item and «Ещё»). A nav
  // without such a menu asks its content's width and moves whole.


  drivesRow(menu) {
    return this.collapse === 'auto' && !this.collapsed && this.navMenus().includes(menu);
  }

  shrinkingTools() {
    const tools = this.header()?.querySelector(':scope > .sf-site-header-row > .sf-site-header-tools');
    return tools ? Array.from(tools.querySelectorAll('[shrink="icon"]')) : [];
  }

  setToolsCompact(compact) {
    for (const tool of this.shrinkingTools()) {
      if (compact) tool.setAttribute('data-shrunk', 'true');else tool.removeAttribute('data-shrunk');
    }

    if (compact === this._toolsCompact) return;
    this._toolsCompact = compact;
    this.sfHostState('data-tools-compact', compact);
  } // The nav's needs: the menu's own, else its content measured as it lies.
  // null while a menu in it is not drawn as a row yet (its code not here,
  // or a column turning back into a row): the menu asks the bar again once
  // it has drawn (rowHost), and nothing is decided on a half-drawn nav.


  navNeeds(nav) {
    const menus = this.navMenus();
    if (menus.some(element => !element.matches(':defined'))) return null;
    const menu = menus.find(element => typeof element.rowNeeds === 'function' && element.moreActive);

    if (menu) {
      const needs = menu.rowNeeds();
      return needs ? { ...needs,
        menu
      } : null;
    }

    const range = document.createRange();
    range.selectNodeContents(nav);
    const whole = range.getBoundingClientRect().width;
    return {
      whole,
      least: whole,
      menu: null
    };
  }

  fitRow() {
    if (this.collapse !== 'auto' || this._fitting || typeof document === 'undefined') return;
    const header = this.header();
    const row = header?.querySelector(':scope > .sf-site-header-row');
    if (!row) return;
    this._fitting = true;

    try {
      this.fitRowNow(row);
    } finally {
      this._fitting = false;
    }

    this.sfHostState('data-fitted', true);
  } // Layout boxes, not screen boxes (layoutWidth, layoutRowRoom; the row
  // engine's measures under a transformed ancestor, fix/segmented-transform):
  // a bar in a scaled preview decides as it is laid out.


  fitRowNow(row) {
    const room = (0,_core_js_overflow_row_js__WEBPACK_IMPORTED_MODULE_3__.layoutRowRoom)(row); // Collapsed by this measure: the bar comes back when its row is again as
    // wide as the narrowest row needed when it collapsed. The menu draws as a
    // row again, measures and asks the bar back (rowHost), which then decides
    // the row in full.

    if (this._fitNeed) {
      if (room + 0.5 < this._fitNeed) return;
      this.setFit(0);
      this.syncCollapsed();
      return;
    } // Below the floor (the md step, a phone, until the nav's menu has drawn)
    // the sheet collapses the bar; the floor lifted, the menu turns back into
    // a row and asks the bar again.


    this.syncCollapsed();

    if (this.collapsed) {
      this.setToolsCompact(this.shrinkingTools().length > 0);
      return;
    }

    const nav = row.querySelector('.sf-site-header-nav');
    const gap = parseFloat(getComputedStyle(row).columnGap) || 0;

    const width = element => element ? (0,_core_js_overflow_row_js__WEBPACK_IMPORTED_MODULE_3__.layoutWidth)(element) : 0;

    const brand = row.querySelector(':scope > .sf-site-header-brand');
    const actions = row.querySelector('.sf-site-header-actions');
    const tools = row.querySelector(':scope > .sf-site-header-tools');
    const parts = [brand, nav, actions, tools].filter(part => part && part.getClientRects().length);
    const besides = width(brand) + width(actions) + gap * Math.max(0, parts.length - 1);
    const toolsNow = width(tools);
    let whole = 0;
    let glyph = 0;

    for (const tool of this.shrinkingTools()) {
      const box = tool.querySelector(':scope > :is(button, a)') ?? tool;
      const drawn = {
        width: (0,_core_js_overflow_row_js__WEBPACK_IMPORTED_MODULE_3__.layoutWidth)(box),
        height: (0,_core_js_overflow_row_js__WEBPACK_IMPORTED_MODULE_3__.layoutHeight)(box)
      };
      if (!this._toolsCompact) this._wholeWidths.set(tool, drawn.width);
      whole += this._wholeWidths.get(tool) ?? drawn.width;
      glyph += this._toolsCompact ? drawn.width : drawn.height;
    }

    const shrinks = this.shrinkingTools().length > 0;
    const toolsWhole = this._toolsCompact ? toolsNow - glyph + whole : toolsNow;
    const toolsGlyph = this._toolsCompact ? toolsNow : toolsNow - whole + glyph;

    if (!nav || !nav.firstElementChild) {
      this.setToolsCompact(shrinks && besides + toolsWhole > room + 0.5);
      return;
    }

    const needs = this.navNeeds(nav);
    if (!needs) return;
    const roomWhole = room - besides - toolsWhole;
    const roomGlyph = room - besides - toolsGlyph;

    if (needs.whole <= roomWhole + 0.5) {
      this.setToolsCompact(false);
    } else if (needs.least <= (shrinks ? roomGlyph : roomWhole) + 0.5) {
      this.setToolsCompact(shrinks);
    } else {
      // Not even one section beside «Ещё»: the menu button and the panel,
      // until the row is as wide as that row needs.
      this.setToolsCompact(shrinks);
      this.setFit(Math.ceil(room + needs.least - (shrinks ? roomGlyph : roomWhole)) + 1);
      this.syncCollapsed();
      return;
    } // The nav has its room now (the tools' state is drawn by the sheet at
    // once): the menu decides its row in the same task.


    needs.menu?.measureFit({
      driven: true
    });
  } // A sticky bar is the flat place while the page is at its top and the raised
  // one while content runs under it (shadow system C20): the host says so with
  // data-scrolled, and the sheet draws the raised shadow from it. Only a
  // sticky bar listens; a bar in the flow scrolls away with the page.


  watchScroll() {
    this.unwatchScroll();

    if (!this.sticky || typeof globalThis.addEventListener !== 'function') {
      this.sfHostState('data-scrolled', false);
      return;
    }

    globalThis.addEventListener('scroll', this._onScroll, {
      passive: true
    });
    this._watchingScroll = true;
    this.syncScrolled();
  }

  unwatchScroll() {
    if (this._watchingScroll) globalThis.removeEventListener?.('scroll', this._onScroll);
    this._watchingScroll = false;
    if (this._scrollFrame) globalThis.cancelAnimationFrame?.(this._scrollFrame);
    this._scrollFrame = 0;
  } // Content is under the bar when the page has scrolled and the bar stands
  // stuck at the top of the window (its top at or above the sticky edge).


  syncScrolled() {
    const bar = this.header();
    const scrolled = Boolean(bar) && (globalThis.scrollY ?? 0) > 0 && bar.getBoundingClientRect().top <= 0;
    this.sfHostState('data-scrolled', scrolled);
  } // The page's switches (data-header-site): each says whether the panel is
  // open, and while a toggle or open switch outside the panel is on screen
  // the bar draws no menu button of its own (C104). Checked after each
  // drawing and on resize, as sf-drawer's controlled checks its switch.


  syncSwitches() {
    const switches = barSwitches(this.id);
    const expanded = this.isOpen ? 'true' : 'false';

    for (const element of switches) {
      if (element.getAttribute('data-header-site') !== 'close' && element.getAttribute('aria-expanded') !== expanded) {
        element.setAttribute('aria-expanded', expanded);
      }
    }

    const panel = this.panel();
    const outside = switches.some(element => element.getAttribute('data-header-site') !== 'close' && !panel?.contains(element) && element.getClientRects().length > 0 && (element.checkVisibility?.({
      visibilityProperty: true
    }) ?? true));

    if (outside !== this._outsideSwitch) {
      this._outsideSwitch = outside;
      this.requestComponentUpdate('switch');
    }
  } // The page's switch on screen, when the bar draws no menu button.


  outsideSwitch() {
    if (!this._outsideSwitch) return null;
    const panel = this.panel();
    return barSwitches(this.id).find(element => element.getAttribute('data-header-site') !== 'close' && !panel?.contains(element) && element.getClientRects().length > 0) ?? null;
  }

  navMenus() {
    const nodes = [].concat(this._liveSlotNodes?.get('nav') || []);
    return nodes.flatMap(node => node.localName === 'sf-menu' ? [node] : Array.from(node.querySelectorAll?.('sf-menu') || []));
  }

  panel() {
    return this.querySelector(':scope .sf-site-header-panel');
  }

  menuButton() {
    return this.querySelector(':scope .sf-site-header-menu-button button') ?? this.querySelector(':scope .sf-site-header-menu-button');
  }

  header() {
    return this.querySelector(':scope > .sf-site-header');
  } // The menu button is the control the host's focus() reaches while the bar is
  // collapsed (the host is display: contents and has no box).


  focusDelegate() {
    return this.collapsed ? this.menuButton() ?? this.outsideSwitch() : null;
  } // The action open.


  runOpen() {
    if (this.isOpen) return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.applied)();
    if (!this.collapsed) return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.refused)('not-collapsed');
    if (!this.sfEmit('open', {}, {
      cancelable: true
    })) return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.refused)('prevented');
    this._returnTo = document.activeElement;
    this._returnAncestors = (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_4__.landmarksAround)(this._returnTo);
    this.isOpen = true;
    this.sfHostState('data-open', true);
    (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_4__.openLayer)(this, {
      kind: 'panel',
      // The stack's default page lock (lockPageScroll), the one every layer takes.
      locksPage: true,
      trapsFocus: true,
      returnTo: this._returnTo,
      root: () => this.panel(),
      focusIn: () => this.focusFirst(),
      onEscape: event => this.onEscape(event),
      onTab: event => this.onTab(event),
      place: ({
        zIndex
      }) => this.place(zIndex)
    });
    this.syncSwitches();
    this.requestComponentUpdate('open'); // Lit draws the open panel in a microtask; a frame later it has a box to
    // take focus.

    const settle = () => {
      if (!this.isOpen) return;
      this.focusFirst();
      this.sfEmit('opened', {});
    };

    if (typeof globalThis.requestAnimationFrame === 'function') globalThis.requestAnimationFrame(settle);else Promise.resolve().then(settle);
    return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.applied)();
  } // The action close; reason by §19.3.


  runClose({
    reason = 'api',
    restoreFocus = true
  } = {}) {
    if (!this.isOpen) return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.refused)('closed');
    if (!this.sfEmit('close', {
      reason
    }, {
      cancelable: true
    })) return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.refused)('prevented');
    this.finishClose({
      reason,
      restoreFocus
    });
    return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.applied)();
  }

  finishClose({
    reason = 'api',
    emit = true,
    restoreFocus = true
  } = {}) {
    this.isOpen = false;
    this.sfHostState('data-open', false);
    const wasTop = (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_4__.closeLayer)(this, {
      restoreFocus: false
    });
    this.place('');
    this.syncSwitches();
    this.requestComponentUpdate('close');

    if (restoreFocus) {
      // Focus goes back to the menu button that opened it (§19.2), or by the
      // stack's rule when that is gone.
      const button = this.menuButton() ?? this.outsideSwitch();
      const target = button?.getClientRects().length ? button : this._returnTo;
      (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_4__.returnLayerFocus)(wasTop, target, this._returnAncestors);
    }

    if (emit) this.sfEmit('closed', {
      reason
    });
  } // The bar's place in the stack while open: its z-index lifts the header,
  // and the panel and scrim inside it, to the layer's height.


  place(zIndex) {
    const header = this.header();
    if (!header) return;
    if (zIndex === '' || zIndex === undefined) header.style.removeProperty('z-index');else header.style.zIndex = String(zIndex);
  }

  focusable() {
    return (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_4__.focusablesIn)(this.panel());
  } // Focus on open: the current page's link (the last one, as the nav comes
  // before a documentation tree in the sheet slot), else the first link, else
  // the close button.


  focusFirst() {
    const panel = this.panel();
    if (!panel) return;
    const current = Array.from(panel.querySelectorAll('[aria-current="page"]')).filter(element => element.getClientRects().length > 0);
    const links = Array.from(panel.querySelectorAll('a[href]')).filter(element => element.getClientRects().length > 0);
    const close = panel.querySelector('.sf-site-header-close-button button') ?? panel.querySelector('.sf-site-header-close-button');
    const target = current.at(-1) || links[0] || close || panel;
    target.focus({
      preventScroll: true
    });
  }

  onEscape(event) {
    if (event.defaultPrevented || !this.isOpen || !(0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_4__.isTopLayer)(this)) return false;
    this.close({
      reason: 'escape'
    });
    return true;
  }

  onTab(event) {
    if (!this.isOpen) return;
    const items = this.focusable();
    const panel = this.panel();

    if (!items.length) {
      event.preventDefault();
      panel?.focus();
      return;
    }

    const first = items[0];
    const last = items.at(-1);
    const active = document.activeElement;

    if (!panel?.contains(active)) {
      event.preventDefault();
      (event.shiftKey ? last : first).focus();
    } else if (event.shiftKey && (active === first || active === panel)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  } // A link chosen in the open panel closes it (the page goes on to the link).


  onPanelClick(event) {
    if (!this.isOpen) return;
    const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
    if (link && this.panel()?.contains(link)) this.runClose({
      reason: 'api',
      restoreFocus: false
    });
  } // The tools split by the bar's form (C161 (8)): wide, every tool in the
  // bar in the page's order; collapsed, the settings (language, theme) in the
  // panel's «Настройки» group, each with its word, and the rest in the bar.


  toolParts(collapsed) {
    const nodes = [].concat(this.hasSlotContent('tools') ? this.getSlotContent('tools') : []).filter(node => node && typeof node === 'object' && 'nodeType' in node);
    if (!collapsed) return {
      bar: nodes,
      settings: []
    };
    const settings = nodes.filter(node => settingKind(node)).map(node => ({
      node,
      kind: settingKind(node),
      label: this.sfWord(settingKind(node))
    }));
    return {
      bar: nodes.filter(node => !settingKind(node)),
      settings
    };
  }

  templateContext() {
    const collapsed = this.collapsedAnswerStale() ? this.collapsed : this._collapsedNow;
    this._drawnCollapsed = collapsed;
    const tools = this.toolParts(collapsed);
    return this.createTemplateContext({ ...this.getPropsContext(),
      component: this,
      id: this._id,
      open: this.isOpen,
      collapse: this.collapse,
      menuPlacement: this.menuPlacement === 'inline-end' ? 'inline-end' : 'inline-start',
      ownMenuButton: !this._outsideSwitch,
      sticky: this.sticky,
      size: this.size,
      navigationAlign: this.navigationAlign,
      label: this.label,
      menuLabel: this.menuLabel,
      tools,
      settingsLabel: this.sfWord('settings'),
      closeLabel: this.closeLabel,
      slot: name => this.getSlotContent(name),
      hasSlot: name => SLOTS.includes(name) && this.hasSlotContent(name),
      rootClass: this.getRootClass()
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_5__.renderSiteHeaderTemplate)(this.templateContext());
  }

}

SfSiteHeader.define('sf-header-site');

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "67b1088f5f56"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderSiteHeaderTemplate: () => (/* binding */ renderSiteHeaderTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
 // The bar: a <header> (the page's banner) holding one container-wide row.
// Wide, the row reads brand · nav … actions · tools, and the panel around the
// nav and the actions is display: contents, so they stand in the row itself.
// Collapsed (a media rule per `collapse` step, scss/), the menu button comes
// first (menu-placement inline-start) or last, after the tools (inline-end),
// and the panel is shown only while open: a side panel from the button's edge
// over a scrim, named by its heading. The button is in the DOM where it is
// shown, so the reading and Tab order follow what is seen. While a switch of
// the page's own is on screen (data-header-site, C104) the bar draws none.
// The panel's close is sf-button-close, the one close button (C14), at the
// bar's size, ghost on the panel's surface.
// The page's slot nodes are placed once and stay where they are in both
// forms, but for the settings among the tools (language, theme): collapsed,
// they stand in the panel's «Настройки» group under the sections, each on a
// row with its word, and the bar keeps the rest of the tools (C161 (8)).

function renderSiteHeaderTemplate(context) {
  const {
    component,
    id,
    open,
    collapse,
    tools,
    settingsLabel,
    menuPlacement,
    ownMenuButton,
    sticky,
    size,
    navigationAlign,
    label,
    menuLabel,
    closeLabel,
    slot,
    hasSlot,
    rootClass
  } = context;
  const panelId = `${id}-panel`;
  const headingId = `${id}-heading`;
  const menuButton = (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button-icon class="sf-site-header-menu-button" icon="menu" size=${size} appearance="ghost" scheme="on-surface"
        aria-label=${menuLabel} aria-haspopup="dialog" aria-controls=${panelId} aria-expanded=${String(Boolean(open))}
        @click=${() => component.toggle()}></sf-button-icon>`;
  const classes = ['sf-site-header', `sf-site-header--collapse-${collapse}`, menuPlacement === 'inline-end' ? 'sf-site-header--menu-inline-end' : '', `sf-site-header--size-${size === '1/2' ? 'half' : '1'}`, navigationAlign === 'center' ? 'sf-site-header--navigation-center' : '', sticky ? 'sf-site-header--sticky' : '', open ? 'sf-site-header--open' : '', rootClass].filter(Boolean).join(' ');
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<header class=${classes} style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
    <div class="sf-site-header-row container w-full m-inline-auto">
      ${ownMenuButton && menuPlacement !== 'inline-end' ? menuButton : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      ${hasSlot('brand') ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-site-header-brand">${slot('brand')}</div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      <div class="sf-site-header-scrim" aria-hidden="true" @click=${() => component.close({
    reason: 'outside'
  })}></div>
      <div class="sf-site-header-panel" id=${panelId}
        role=${open ? 'dialog' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing} aria-modal=${open ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing} aria-labelledby=${open ? headingId : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        tabindex=${open ? '-1' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        @click=${event => component.onPanelClick(event)}>
        <div class="sf-site-header-panel-head">
          <span class="sf-site-header-panel-heading" id=${headingId}>${label}</span>
          <sf-button-close class="sf-site-header-close-button" size=${size}
            aria-label=${closeLabel} @click=${() => component.close({
    reason: 'close'
  })}></sf-button-close>
        </div>
        ${hasSlot('nav') ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-site-header-nav">${slot('nav')}</div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        ${hasSlot('actions') ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-site-header-actions">${slot('actions')}</div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        ${tools?.settings.length ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-site-header-settings" role="group" aria-labelledby=${`${id}-settings`}>
          <span class="sf-site-header-settings-heading" id=${`${id}-settings`}>${settingsLabel}</span>
          ${tools.settings.map(({
    node,
    kind,
    label: word
  }) => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-site-header-setting" role=${kind === 'tools' ? 'group' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing} aria-label=${kind === 'tools' ? word : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}><span class="sf-site-header-setting-label" aria-hidden="true">${word}</span>${node}</div>`)}
        </div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        ${hasSlot('sheet') ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-site-header-sheet">${slot('sheet')}</div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      </div>
      ${tools ? tools.bar.length ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-site-header-tools">${tools.bar}</div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing : hasSlot('tools') ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-site-header-tools">${slot('tools')}</div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      ${ownMenuButton && menuPlacement === 'inline-end' ? menuButton : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    </div>
  </header>`;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "32835c4bc572"
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

/***/ "2a080a730149"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("lit", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "deb1a4d61565"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("smart-base", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("smart-base", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "14c6c8c48855"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   files: () => (/* binding */ files)
/* harmony export */ });
/* harmony import */ var _en_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("298b141c5283");
// Written by scripts/build-language-packs.mjs from src/core/lang/built-in.json
// (owner decision C282); do not edit. The words this bundle carries: the
// built-in languages' (en); every other language comes from
// a language file (core/lang/<code>.js or its parts).


const files = { en: { runtime: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime } };

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ en: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime });


/***/ },

/***/ "0ad7db0d1ea2"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-header-site, generated from component.json \\"aliases\\" by scripts/generate-component-files.mjs; read by core/js/alias-table.js and the shim. Do not edit.","component":"sf-header-site","since":"2026-11-03","remove_after":"2027-01-01","aliases":[{"from":"sf-site-header","to":"sf-header-site","kind":"tag","component":"sf-header-site","since":"2026-11-03","remove_after":"2027-01-01","section":"rename plan R0 (ui-control RENAME-PLAN-2026-11-03), naming decision 2026-11-02","note":"the element is sf-header-site; sf-site-header is a subclass defined beside it until the date"},{"from":"sf-site-header-open","to":"sf-header-site-open","kind":"event","component":"sf-header-site","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-site-header-opened","to":"sf-header-site-opened","kind":"event","component":"sf-header-site","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-site-header-close","to":"sf-header-site-close","kind":"event","component":"sf-header-site","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-site-header-closed","to":"sf-header-site-closed","kind":"event","component":"sf-header-site","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"}]}');

/***/ },

/***/ "3b2d3ad548e5"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.header-site","tag":"sf-header-site","version":"1.16.0","kind":"leaf","settings":{"collapse":{"type":"enum","values":["none","sm","md","lg","xl","auto","always"],"default":"lg"},"menu-placement":{"type":"enum","values":["inline-start","inline-end"],"default":"inline-start"},"sticky":{"type":"boolean","default":false},"size":{"type":"enum","values":["1/2","1"],"default":"1"},"navigation-align":{"type":"enum","values":["start","center"],"default":"start"},"label":{"type":"string","default-from":"runtime.label"},"menu-label":{"type":"string","default-from":"runtime.menu-label"},"close-label":{"type":"string","default-from":"runtime.close-label"}},"values":{},"events":{"open":{"carries":{},"cancelable":true},"opened":{"carries":{}},"close":{"carries":{"reason":{"type":"enum","values":["close","escape","outside","cancelled","api"]}},"cancelable":true},"closed":{"carries":{"reason":{"type":"enum","values":["close","escape","outside","cancelled","api"]}}}},"actions":{"open":{},"close":{"with":{"reason":{"type":"enum","values":["close","escape","outside","cancelled","api"]}}},"toggle":{}},"layer":{"kind":"panel","locks-page":true,"traps-focus":true},"host-states":{"data-open":"boolean","data-collapsed":"boolean","data-scrolled":"boolean","data-nav-overflow":"boolean","data-tools-compact":"boolean","data-fitted":"boolean"},"css-variables":{"--sf-site-header-background-color":{"type":"color","state":"default"},"--sf-site-header-color":{"type":"color","state":"default"},"--sf-site-header-border-color":{"type":"color","state":"default"},"--sf-site-header-block-size":{"type":"length","state":"default"},"--sf-site-header-gap":{"type":"length","state":"default"},"--sf-site-header-tools-gap":{"type":"length","state":"default"},"--sf-site-header-brand-gap":{"type":"length","state":"default"},"--sf-site-header-brand-size":{"type":"length","state":"default"},"--sf-site-header-sheet-inline-size":{"type":"length","state":"open"},"--sf-site-header-z-index":{"type":"number","state":"default"}}}');

/***/ },

/***/ "298b141c5283"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Site header","runtime":{"label":"Menu","menu-label":"Open menu","close-label":"Close menu","settings":"Settings","language":"Language","tools":"Tools","theme":"Theme"}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("060946d394b8");
/******/
/******/ })()
;