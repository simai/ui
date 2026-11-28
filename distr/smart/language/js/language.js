/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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

/***/ "38ea8d53f301"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FormField: () => (/* binding */ FormField),
/* harmony export */   ShownRequired: () => (/* binding */ ShownRequired),
/* harmony export */   ShownValidity: () => (/* binding */ ShownValidity),
/* harmony export */   VALIDITY_FLAGS: () => (/* binding */ VALIDITY_FLAGS),
/* harmony export */   VALIDITY_WORDS: () => (/* binding */ VALIDITY_WORDS),
/* harmony export */   afterPress: () => (/* binding */ afterPress),
/* harmony export */   claimFirstInvalid: () => (/* binding */ claimFirstInvalid),
/* harmony export */   forgetFormTried: () => (/* binding */ forgetFormTried),
/* harmony export */   formTried: () => (/* binding */ formTried),
/* harmony export */   hasFieldWord: () => (/* binding */ hasFieldWord),
/* harmony export */   innerControlName: () => (/* binding */ innerControlName),
/* harmony export */   ownInvalid: () => (/* binding */ ownInvalid),
/* harmony export */   syncFieldValidity: () => (/* binding */ syncFieldValidity),
/* harmony export */   syncOwnValidity: () => (/* binding */ syncOwnValidity),
/* harmony export */   validityWords: () => (/* binding */ validityWords)
/* harmony export */ });
// The form-control half of a field built from its component.json (standard
// simai.smart-component 1.3.8 §17.1, §17.2), shared by the field family.
//
// core/js/element-manifest.js makes the host form-associated and gives it
// ElementInternals, sfFormValue() and sfSyncForm(). What a field adds is the
// same in every member, so it is written once here:
//
// - validity (§17.2): the host reports what its inner native control knows
//   (value-missing, too-short, pattern-mismatch, ...) with the control as the
//   anchor, so reportValidity() points at the box the person types in; a
//   custom error set with setCustomValidity() or the action set-error wins
//   until it is cleared;
// - the inner controls stay out of the page's form (§17.1 item 6): they carry
//   no name while the host is the form control;
// - a field with no inner native control to read (a list of buttons, a
//   picker, a file area) says what it knows itself with `fieldValidity()`:
//   value-missing while `required` and the form value is empty by default,
//   and where the browser points;
// - form reset and fieldset[disabled] (§17.1 items 3, 4): `form.reset()`
//   calls the component's `fieldReset()` when it has one (its default back,
//   without events), and the host syncs its form value and validity after the
//   browser has reset its parts;
// - restore: `formStateRestoreCallback` hands the saved form value to
//   `fieldRestore(state)` when the component has one.
//
// Usage, over the element core/js/element-manifest.js gives:
//
//   const Element = elementFromManifest(manifest, {base: SfBaseElement, ...});
//   class SfThing extends FormField(Element) { ... }
//
// Without ElementInternals nothing here runs, and the named inner control
// submits as it always did (§16 item 11).
// ValidityState's own flags, in the order of §17.2's list.
const VALIDITY_FLAGS = Object.freeze(['valueMissing', 'typeMismatch', 'patternMismatch', 'tooShort', 'tooLong', 'rangeUnderflow', 'rangeOverflow', 'stepMismatch', 'badInput']);
/** The name an inner native control carries: none while the host submits (§17.1 item 6). */

function innerControlName(component, name) {
  return component?.sfInternals ? '' : String(name || '');
}
/**
 * The host's validity from its inner control: the control's failed flags and
 * message, or the custom error the page set, or valid. `own` adds flags the
 * component reads itself, {flag: message} (a number field's range and step,
 * which its text box cannot know).
 */

function syncFieldValidity(component, control, own = {}) {
  const internals = component?.sfInternals;
  if (!internals) return;

  try {
    const custom = component.sfCustomError || '';

    if (custom) {
      internals.setValidity({
        customError: true
      }, custom, control || undefined);
      return;
    }

    const validity = control?.validity;
    const flags = {};
    let message = '';

    if (validity && !validity.valid && control.willValidate !== false) {
      for (const flag of VALIDITY_FLAGS) if (validity[flag]) flags[flag] = true;

      message = control.validationMessage;
    }

    for (const [flag, text] of Object.entries(own || {})) {
      flags[flag] = true;
      message ||= String(text || '');
    }

    if (Object.keys(flags).length) internals.setValidity(flags, message || ' ', control || undefined);else internals.setValidity({});
  } catch (error) {
    component.reportComponentError?.(error, 'validity');
  }
}
/**
 * The host's validity from what the component says itself (fieldValidity()):
 * value-missing, too-long (a counted field past its limit, helpers/char-count.js)
 * and the custom error the page set; `anchor`, when it is a part of the host,
 * is where the browser points.
 */

function syncOwnValidity(component, {
  valueMissing = false,
  tooLong = false,
  message = '',
  anchor = null
} = {}) {
  const internals = component?.sfInternals;
  if (!internals) return;
  const custom = component.sfCustomError || '';
  const flags = {};
  let text = '';

  if (custom) {
    flags.customError = true;
    text = custom;
  }

  if (valueMissing) {
    flags.valueMissing = true;
    text ||= message || 'value-missing';
  }

  if (tooLong) {
    flags.tooLong = true;
    text ||= message || 'too-long';
  }

  try {
    if (Object.keys(flags).length) {
      const target = anchor && component.contains?.(anchor) ? anchor : undefined;
      internals.setValidity(flags, text, target);
    } else {
      internals.setValidity({});
    }
  } catch (error) {
    component.reportComponentError?.(error, 'validity');
  }
}
/**
 * The field family's form plumbing over a manifest element. A component
 * names the control its validity comes from with `sfValidityAnchor()`
 * (default: getInputElement()).
 */

const FormField = Base => class extends Base {
  constructor() {
    super(); // A person's edit reaches the host as input/change; the form value and
    // validity follow it without a redraw.

    this.__sfFormSync = () => this.sfSyncFormState();

    this.addEventListener('input', this.__sfFormSync);
    this.addEventListener('change', this.__sfFormSync);
  }

  sfValidityAnchor() {
    return this.getInputElement?.() || null;
  }
  /**
   * What the component knows of its validity itself, {valueMissing, message,
   * anchor}, or null when an inner native control's ValidityState is the
   * answer (sfValidityAnchor()). With no such control: value-missing while
   * `required` and the form value is empty. A component overrides it.
   */


  fieldValidity() {
    if (this.sfValidityAnchor()) return null;
    const required = this.hasAttribute('required') && this.getAttribute('required') !== 'false';
    const value = this.sfFormValue?.();
    const valueMissing = required && !this.disabled && (value === null || value === undefined || value === ''); // The word only when it is said: asked on every sync, a component without
    // it warned «no word value-missing» on each optional field (simai.main,
    // sf-button-group in property-view's choice field, 2026-10-28).

    return {
      valueMissing,
      message: valueMissing ? this.sfWord?.('value-missing') || 'value-missing' : '',
      anchor: null
    };
  }
  /** The validity, now: the component's own account, or its inner control's. */


  sfSyncValidity() {
    const own = this.fieldValidity();
    if (own) syncOwnValidity(this, own);else syncFieldValidity(this, this.sfValidityAnchor());
  }
  /** The form value and the validity, now. */


  sfSyncFormState() {
    this.sfSyncForm?.();
    this.sfSyncValidity();
  }
  /** §17.2: a custom error keeps the form from submitting until it is cleared. */


  setCustomValidity(message = '') {
    this.sfCustomError = String(message ?? '');
    this.sfSyncValidity();
  } // fieldReset() puts the component's default back, without events. The
  // browser resets the parts after it calls this: the sync waits for them,
  // and once more for the parts that put their own default back a task later
  // (component/form-reset-helper.js: masks, the checkables' attributes).


  formResetCallback() {
    if (typeof this.fieldReset === 'function') {
      try {
        this.fieldReset();
      } catch (error) {
        this.reportComponentError?.(error, 'form reset');
      }
    }

    this.sfSyncFormState();
    Promise.resolve().then(() => this.sfSyncFormState());
    setTimeout(() => this.sfSyncFormState(), 0);
  }

  formStateRestoreCallback(state) {
    if (typeof this.fieldRestore === 'function') this.fieldRestore(state);
    this.sfSyncFormState();
  }

}; // The word key a failed validity flag is said with (owner decision C153 (3)):
// each component carries these words in its lang/<locale>.json runtime
// words, in the page's language (LC-9), never the browser's.

const VALIDITY_WORDS = Object.freeze({
  valueMissing: 'value-missing',
  typeMismatch: 'type-mismatch',
  patternMismatch: 'pattern-mismatch',
  tooShort: 'too-short',
  tooLong: 'too-long',
  rangeUnderflow: 'range-underflow',
  rangeOverflow: 'range-overflow',
  stepMismatch: 'step-mismatch',
  badInput: 'bad-input'
}); // One check pass across every field of a page (C153 (3)): a submit attempt,
// reportValidity() or checkValidity() fires `invalid` on every wrong field
// in tree order, synchronously. The first wrong field of a pass the person
// started (a press or Enter in this task) takes the focus; the rest show
// their errors and keep still. The fields are separate bundles, each with its
// own copy of this module, so the pass lives on a shared global.

const CHECK_KEY = Symbol.for('simai.framework.field-check');

function fieldCheck() {
  const shared = globalThis[CHECK_KEY] || (globalThis[CHECK_KEY] = {
    activated: false,
    focused: false,
    tried: new WeakSet()
  });

  if (!shared.listening && typeof document !== 'undefined') {
    shared.listening = true;

    const mark = event => {
      if (event.type === 'keydown' && event.key !== 'Enter') return;
      shared.activated = true;
      setTimeout(() => {
        shared.activated = false;
      }, 0);
    };

    document.addEventListener('click', mark, true);
    document.addEventListener('keydown', mark, true);
  }

  return shared;
} // A pointer pressed on the page (FO-4, module.smart-helpers 1.20.0): a field
// it leaves holds its leave check until the press is over and a task after
// it, so the error line drawn under that field does not move the button the
// pointer is on before the click lands (at 390 a cleared required field's
// line moved «Сохранить» 20 px down and the save was lost). The press's own
// click checks every field when it submits. A release the page never hears
// ends the hold after PRESS_HOLD_MS. One record for every bundle's copy.


const PRESS_KEY = Symbol.for('simai.framework.field-press');
const PRESS_HOLD_MS = 4000;

function fieldPress() {
  const shared = globalThis[PRESS_KEY] || (globalThis[PRESS_KEY] = {
    down: false,
    queue: [],
    timer: 0
  });

  if (!shared.listening && typeof document !== 'undefined') {
    shared.listening = true;

    const end = () => {
      if (!shared.down) return;
      shared.down = false;
      clearTimeout(shared.timer);
      setTimeout(() => {
        if (shared.down) return;

        for (const run of shared.queue.splice(0)) {
          try {
            run();
          } catch {
            /* a field taken out of the page while the press lasted */
          }
        }
      }, 0);
    };

    const start = () => {
      if (shared.down) return;
      shared.down = true;
      clearTimeout(shared.timer);
      shared.timer = setTimeout(end, PRESS_HOLD_MS);
    };

    document.addEventListener('pointerdown', start, true);
    document.addEventListener('mousedown', start, true);

    for (const type of ['pointerup', 'pointercancel', 'mouseup', 'dragend']) document.addEventListener(type, end, true);
  }

  return shared;
}
/** Runs `check` now, or once a pointer press in progress is over (FO-4). */


function afterPress(check) {
  const shared = fieldPress();
  if (shared.down) shared.queue.push(check);else check();
}
/**
 * Says that `element` failed a check now. Returns true when it is the first
 * wrong field of a pass the person started, the one that takes the focus.
 * Every member of the field family calls it from its `invalid` listener.
 */

function claimFirstInvalid(element) {
  const check = fieldCheck();
  const form = element?.form || element?.closest?.('form') || null;
  if (form) check.tried.add(form);
  if (!check.activated || check.focused) return false;
  check.focused = true;
  setTimeout(() => {
    check.focused = false;
  }, 0);
  return true;
}
/**
 * For a member that draws its own errors on `invalid` (C153 (3)): the
 * browser's bubble is cancelled on the host and on every native control
 * inside it, `show` runs for the host's own event, and the first wrong field
 * of a submit the person made takes the focus. Returns the listener, to
 * remove with removeEventListener('invalid', listener, true).
 */

function ownInvalid(component, show) {
  fieldCheck();

  const listener = event => {
    event.preventDefault();
    if (event.target !== component) return;
    const first = claimFirstInvalid(component);
    show?.(event);

    if (first) {
      const target = component.focusDelegate?.() || component.sfValidityAnchor?.() || component;

      try {
        target.focus?.();
      } catch {
        /* a field taken out of the page while the check ran */
      }
    }
  };

  component.addEventListener('invalid', listener, true);
  return listener;
}
/** A submit attempt has failed on this field's form since its last reset. */

function formTried(element) {
  const form = element?.form || element?.closest?.('form') || null;
  return Boolean(form && fieldCheck().tried.has(form));
}
/** Forgets the failed attempt of a form (form.reset()). */

function forgetFormTried(element) {
  const form = element?.form || element?.closest?.('form') || null;
  if (form) fieldCheck().tried.delete(form);
}
/** Whether the component's dictionaries hold a word, in any language. */

function hasFieldWord(component, key) {
  const words = component?.constructor?.sfWords || {};
  return Object.values(words).some(dictionary => dictionary && dictionary[key] !== undefined && dictionary[key] !== null);
}
/**
 * The words a field says for its validity now (C153 (3)): the page's custom
 * error as written; else the first failed flag in the component's own words,
 * with the limit it broke ({min}, {max}, {step}); a type mismatch of an
 * e-mail or a web address has its own word (type-mismatch-email,
 * type-mismatch-url). A flag the component has no word for says what the
 * component itself set (its own count, range or file words), never the
 * browser's. '' while valid.
 */

function validityWords(component, control = component?.sfValidityAnchor?.()) {
  const validity = component?.validity;
  if (!validity || validity.valid) return '';
  if (validity.customError) return component.validationMessage || '';

  const read = name => control?.getAttribute?.(name) ?? component.getAttribute?.(name) ?? '';

  for (const flag of VALIDITY_FLAGS) {
    if (!validity[flag]) continue;
    let key = VALIDITY_WORDS[flag];

    if (flag === 'typeMismatch') {
      const type = String(control?.type || '').toLowerCase();
      if ((type === 'email' || type === 'url') && hasFieldWord(component, `${key}-${type}`)) key = `${key}-${type}`;
    }

    if (hasFieldWord(component, key)) {
      return component.sfWord(key, {
        vars: {
          min: read(flag === 'tooShort' ? 'minlength' : 'min'),
          max: flag === 'tooLong' ? component.maxlength ?? read('maxlength') : read('max'),
          step: read('step')
        }
      });
    }

    return component.validationMessage || '';
  }

  return component.validationMessage || '';
}
/**
 * The errors a field shows itself (owner decision C153 (3), for the whole
 * field family as C55): never the browser's bubble, always the component's
 * words in the page's language.
 *
 * - A failed check of the form -- a submit attempt, reportValidity(),
 *   checkValidity() -- shows the error on every wrong field at once, and the
 *   first wrong field of a submit the person made takes the focus
 *   (claimFirstInvalid). The browser's bubble, on the host and on the native
 *   control inside it, is cancelled.
 * - After that, or once the person has changed the value, leaving the field
 *   checks it: a wrong value shows its error, a right one clears it.
 * - While the person types, a shown error goes the moment the value is right;
 *   a still-wrong value keeps it, in the words of what is wrong now. Nothing
 *   is shown while typing into a field that showed no error.
 * - form.reset() takes every shown error away.
 *
 * The page's invalid / error-message win over it. Usage, over FormField:
 * `class SfThing extends ShownValidity(FormField(Element))`; the template
 * reads `sfShownInvalid(invalid)` and `sfShownMessage(invalid, errorMessage)`
 * instead of the bare settings. ShownRequired, its name before C153, stays
 * the same mixin.
 */

const ShownValidity = Base => class extends Base {
  constructor() {
    super();
    this.__sfErrorShown = false;
    this.__sfTouched = false; // The page-wide pass listens from the first field on, so the press that
    // submits is seen before the check it starts; so does the press record.

    fieldCheck();
    fieldPress(); // Capture: the host's own `invalid` and its native control's, which
    // would draw a second bubble; neither bubbles, so only capture sees both.

    this.addEventListener('invalid', event => {
      event.preventDefault();
      if (event.target !== this) return;
      const first = claimFirstInvalid(this);

      if (!this.__sfErrorShown) {
        this.__sfErrorShown = true;
        this.requestComponentUpdate?.('invalid');
      } else {
        this.requestComponentUpdate?.('validity');
      }

      if (first) this.sfFocusFirstInvalid();
    }, true);
    this.addEventListener('input', () => {
      this.__sfTouched = true;
    });
    this.addEventListener('change', () => {
      this.__sfTouched = true;
    });
    this.addEventListener('focusout', event => {
      if (event.relatedTarget && this.contains(event.relatedTarget)) return; // A layer of the field (a list, a picker) holds the focus for it.

      if (this.matches?.(':focus-within')) return;
      if (!this.__sfTouched && !formTried(this)) return; // A press that left the field holds the check until it is over (FO-4);
      // what the press did meanwhile (a reset, a submit) is read then.

      afterPress(() => {
        if (!this.isConnected || !this.__sfTouched && !formTried(this)) return;
        this.sfSyncValidity?.();
        const wrong = this.validity ? !this.validity.valid : false;

        if (wrong !== this.__sfErrorShown) {
          this.__sfErrorShown = wrong;
          this.requestComponentUpdate?.('validity');
        } else if (wrong) {
          this.requestComponentUpdate?.('validity');
        }
      });
    });
  }
  /** The first wrong field of a submit takes the focus, as the browser's check did. */


  sfFocusFirstInvalid() {
    const target = this.focusDelegate?.() || this.sfValidityAnchor?.() || this;

    try {
      target.focus?.();
    } catch {
      /* a field taken out of the page while the check ran */
    }
  } // A shown error goes the moment the value is right, whatever made it right:
  // the person's input or change, a value set from script, a value attribute
  // (C55 acceptance F1 R2, D1). A still-wrong value redraws its words.


  sfSyncFormState() {
    super.sfSyncFormState?.();
    if (!this.__sfErrorShown) return;

    if (this.validity && !this.validity.valid) {
      const words = validityWords(this);

      if (words !== this.__sfShownWords) {
        this.__sfShownWords = words;
        this.requestComponentUpdate?.('validity');
      }

      return;
    }

    this.__sfErrorShown = false;
    this.__sfShownWords = '';
    this.requestComponentUpdate?.('value');
  }
  /** An error is shown now (the page's own invalid aside). */


  get sfErrorShown() {
    return this.__sfErrorShown;
  }
  /** The name before C153, kept for the components that read it. */


  get sfMissingShown() {
    return this.__sfErrorShown;
  }
  /** The invalid state the field draws: the page's, or the one it shows itself. */


  sfShownInvalid(invalid) {
    return Boolean(invalid) || this.__sfErrorShown;
  }
  /** The message under the field: the page's while it says invalid, else the shown error's words. */


  sfShownMessage(invalid, errorMessage) {
    if (invalid) return errorMessage || '';
    if (!this.__sfErrorShown) return '';
    const words = validityWords(this);
    this.__sfShownWords = words;
    return words;
  }

  formResetCallback() {
    const shown = this.__sfErrorShown;
    this.__sfErrorShown = false;
    this.__sfTouched = false;
    this.__sfShownWords = '';
    forgetFormTried(this);
    super.formResetCallback?.();
    if (shown) this.requestComponentUpdate?.('reset');
  }

};
/** The mixin's name before owner decision C153 (C55 acceptance F1). */

const ShownRequired = ShownValidity;

/***/ },

/***/ "08d5ec4efd25"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SfLanguage: () => (/* binding */ SfLanguage),
/* harmony export */   languageRows: () => (/* reexport safe */ _js_languages__WEBPACK_IMPORTED_MODULE_10__.languageRows),
/* harmony export */   rememberKey: () => (/* binding */ rememberKey)
/* harmony export */ });
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("d3818183b14c");
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("43090d1c8307");
/* harmony import */ var _core_js_preferences_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("51250bf01ab0");
/* harmony import */ var _core_js_tag_aliases_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("4a85acfb05c1");
/* harmony import */ var _core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("e92fd2d1a38c");
/* harmony import */ var _core_js_overflow_row_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("2db3a835ac11");
/* harmony import */ var _helpers_form_field__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("38ea8d53f301");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("688582849827");
/* harmony import */ var _js_languages__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("464bf30e7c23");
/* harmony import */ var _data_names_json__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("9937e6b314d1");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__("11b7e7a66992");
/* harmony import */ var _lang_index_mjs__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__("0161a89699b6");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_2__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_3__, _core_js_tag_aliases_js__WEBPACK_IMPORTED_MODULE_5__, _core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_6__, _js_templates_default__WEBPACK_IMPORTED_MODULE_9__, _js_languages__WEBPACK_IMPORTED_MODULE_10__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_2__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_3__, _core_js_tag_aliases_js__WEBPACK_IMPORTED_MODULE_5__, _core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_6__, _js_templates_default__WEBPACK_IMPORTED_MODULE_9__, _js_languages__WEBPACK_IMPORTED_MODULE_10__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_6__);
// sf-language: the site's language picker. One element whose look follows the
// number of languages it is given:
//
//   <sf-language languages="ru en"></sf-language>            two and more: a button «RU ▾» and a menu
//   <sf-language languages="ru en de … ja zh ar"></sf-language>  eight and more: the menu with search
//   <sf-language languages="ru en" mode="inline"></sf-language>  a settings page: a segmented switch
//
// One language draws nothing. Each language is named in itself («Deutsch»),
// and in the menu in English beside it («German»): the names of the languages
// it supports ship with it (data/names.json, CLDR), the browser
// (Intl.DisplayNames) names the rest. A choice is a cancellable change event first; not cancelled, the
// element follows the language's href when it has one (a site with /ru/ and
// /en/), and otherwise applies it to the page: SF.language.use(code), and lang
// and dir on <html>. remember="<name>" keeps the choice (SF.Preferences, in
// the browser under sf-pref:sf-language/<name>); reading it back before the
// first paint is the site's (docs.md).
//
// It composes the Framework's parts and draws nothing of its own: the switch
// is sf-segmented on its track, the trigger sf-button with
// the Material Symbols «translate» glyph, the current code and expand_more, the list sf-menu-context with its
// search. Their events stay inside: the page hears this element's change.
//
// From its component.json (standard simai.smart-component 1.3.14 §3, §4, §8,
// §17.1): settings, values, the select action and the change event are made
// by core/js/element-manifest.js; the host is the form control.













 // The width an element is drawn at: its own layout box, or -- an element
// with display: contents (the sf-icon host) has none -- the boxes of what it
// draws, side by side. 0 when nothing is drawn.

function renderedWidth(element) {
  if (!element || !element.getClientRects().length && getComputedStyle(element).display !== 'contents') return 0;
  if (getComputedStyle(element).display !== 'contents') return (0,_core_js_overflow_row_js__WEBPACK_IMPORTED_MODULE_7__.layoutWidth)(element);
  return Array.from(element.children).reduce((sum, child) => sum + renderedWidth(child), 0);
} // Only the words on screen ship in the bundle, English only (owner decision
// C282): Russian and every other language come from a language file. The
// title, settings and events stay in the language files for the Studio and the
// docs (localization study LC-2).


const en = _lang_index_mjs__WEBPACK_IMPORTED_MODULE_13__.files.en;
(0,_js_languages__WEBPACK_IMPORTED_MODULE_10__.useNames)(_data_names_json__WEBPACK_IMPORTED_MODULE_11__); // The parts it draws, found under their current names and their former ones.

const MENU = `:scope > .sf-language-parts > ${(0,_core_js_tag_aliases_js__WEBPACK_IMPORTED_MODULE_5__.tagSelector)('sf-menu-context')}`; // The trigger: sf-button «文A RU ▾» (trigger code), or sf-button-icon, the
// glyph alone (trigger icon, owner decision C369).

const TRIGGER = `:scope > .sf-language-parts > :is(${(0,_core_js_tag_aliases_js__WEBPACK_IMPORTED_MODULE_5__.tagSelector)('sf-button')}, ${(0,_core_js_tag_aliases_js__WEBPACK_IMPORTED_MODULE_5__.tagSelector)('sf-button-icon')}, button.sf-language-name)`;
const TRACK = `:scope > .sf-language-parts > ${(0,_core_js_tag_aliases_js__WEBPACK_IMPORTED_MODULE_5__.tagSelector)('sf-segmented')}`;
const FIELD = `:scope > .sf-language-parts > ${(0,_core_js_tag_aliases_js__WEBPACK_IMPORTED_MODULE_5__.tagSelector)('sf-dropdown')}`; // The bar that may ask this element to give way (shrink): the nearest
// ancestor that fits its row (queueFit). The language does not draw it, so it
// names no bar tag.

const fittingBar = element => {
  let node = element.parentElement;

  while (node && typeof node.queueFit !== 'function') node = node.parentElement;

  return node;
}; // A phone: below the md breakpoint, where core declares --sf-breakpoint-md
// (sf-menu-context's own test for its sheet).


const onPhone = node => {
  const root = node?.ownerDocument?.documentElement;
  return Boolean(root) && !getComputedStyle(root).getPropertyValue('--sf-breakpoint-md').trim();
}; // The keys that walk the switch's segments (C142 (4): they move the focus;
// Enter or Space chooses, since a choice may reload the page).


const WALK = new Set(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End']); // The boolean compact showed the codes; it is a dated alias of labels="code"
// (owner decision C134: compact means density only; journal
// attribute-language-compact-to-labels-code), read here, since a boolean's
// presence cannot be a value alias of the shim.

const COMPACT_ALIAS = {
  component: 'sf-language',
  tag: 'sf-language',
  kind: 'attribute',
  from: 'compact',
  to: 'labels="code"',
  since: '2026-11-13',
  remove_after: '2027-01-01'
};
const LABELS = ['name', 'code'];

const text = value => value === undefined || value === null ? '' : String(value).trim(); // A remembered choice is a preference of the person (SF.Preferences, owner
// 2026-10-14): in the browser under sf-pref:sf-language/<remember>, and by a
// host that keeps preferences for its user. The registry is the shared one
// when core has published it (every bundle has its own copy).


const preferences = () => globalThis.SF?.Preferences || _core_js_preferences_js__WEBPACK_IMPORTED_MODULE_4__["default"];
/** The SF.Preferences key a remember name keeps the choice under. */


const rememberKey = name => text(name) ? `sf-language/${text(name)}` : '';
const LanguageElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_12__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: _lang_index_mjs__WEBPACK_IMPORTED_MODULE_13__.files,
  source: 'ru',
  actions: {
    select(args = {}) {
      const value = typeof args === 'string' ? args : args?.value;
      return this.choose(value, 'api');
    }

  }
});

class SfLanguage extends (0,_helpers_form_field__WEBPACK_IMPORTED_MODULE_8__.FormField)(LanguageElement) {
  constructor() {
    super(); // What the element last drew, so a change of the page's language that
    // this element did not make moves the shown value with it.

    this._shownLook = ''; // What the menu's search field holds: the element narrows the rows
    // itself (the menu's search is remote), by word starts.

    this._query = ''; // The switch's arrows move the focus only (C142 (4)): taken here, in
    // the capture phase, before sf-segmented's own keys choose.

    this.addEventListener('keydown', event => this.onTrackKeys(event), true);
  }

  connectedCallback() {
    // The island first: the languages may be in it.
    this.sfReadIsland(); // The value a form reset returns to: the one the element was written with,
    // or the page's language when it was written with none.

    if (!Object.prototype.hasOwnProperty.call(this, '_resetValue')) this._resetValue = this.getAttribute('value') || '';
    super.connectedCallback();
  } // The languages, made safe: each with its names, short label, href and dir.


  get languageList() {
    return (0,_js_languages__WEBPACK_IMPORTED_MODULE_10__.normalizeLanguages)(this.languages, this.items, this.href, {
      missing: this.missing,
      home: this.home
    });
  } // The language shown as chosen: the value when it is one of the list, else
  // the page's language, else the first.


  get current() {
    const list = this.languageList;
    if (!list.length) return null;
    const own = this.getAttribute('value');
    const doc = this.ownerDocument?.documentElement;
    return (own && (0,_js_languages__WEBPACK_IMPORTED_MODULE_10__.matchLanguage)(list, own)) ?? (0,_js_languages__WEBPACK_IMPORTED_MODULE_10__.matchLanguage)(list, doc?.getAttribute('lang') || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageLocale)(doc)) ?? list[0];
  } // The value is a language code of the list; the chosen one is read through
  // current, so an element written without value says the page's language.


  get value() {
    return this.current?.code ?? '';
  }

  set value(next) {
    const code = (0,_js_languages__WEBPACK_IMPORTED_MODULE_10__.canonicalCode)(next);
    if (code) this.setAttribute('value', code);else this.removeAttribute('value');
    this.sfSyncFormState?.();
  } // What the segments say: name or code. labels wins; without it the dated
  // boolean compact says code, noted once per element in SF.deprecations.


  get labelsShown() {
    const own = this.getAttribute('labels');
    if (LABELS.includes(own)) return own;

    if (own === null && this.hasAttribute('compact')) {
      if (!this._compactNoted) {
        this._compactNoted = true;
        (0,_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_2__.noteDeprecated)(COMPACT_ALIAS);
      }

      return 'code';
    }

    return 'name';
  } // The property of the dated boolean, for a script that set it: it writes the
  // attribute, which is read (and noted) as above.


  get compact() {
    return this.hasAttribute('compact');
  }

  set compact(next) {
    this.toggleAttribute('compact', Boolean(next));
  } // compact is observed so a change of it draws again (the base's
  // attributeChangedCallback asks for the update).


  static get observedAttributes() {
    return [...new Set([...super.observedAttributes, 'compact'])];
  } // What the element looks like now: none, inline, menu or search.


  get look() {
    return (0,_js_languages__WEBPACK_IMPORTED_MODULE_10__.lookFor)(this.languageList.length, {
      mode: this.mode,
      inlineMax: this.inlineMax,
      searchFrom: this.searchFrom
    });
  } // What the form gets (§17.1): the chosen code, nothing while disabled or
  // with no language to choose.


  sfFormValue() {
    if (this.disabled || this.sfFormDisabled) return null;
    return this.value || null;
  }

  fieldReset() {
    this.value = this._resetValue;
  } // The choice: the request first (change, cancellable); not cancelled, the
  // value is the language, the choice is remembered, and the page goes to its
  // href or takes the language.


  choose(next, reason = 'press') {
    const list = this.languageList;
    const language = (0,_js_languages__WEBPACK_IMPORTED_MODULE_10__.matchLanguage)(list, next);
    if (!language) return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.refused)('unknown');
    if (this.disabled || this.sfFormDisabled) return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.refused)('disabled');
    const previous = this.value;
    if (language.code === previous) return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.refused)('unchanged');
    const detail = {
      value: language.code,
      previous,
      href: language.href,
      dir: language.dir,
      reason
    };

    if (!this.sfEmit('change', detail, {
      cancelable: true
    })) {
      // The switch shows what it had: the segment a person pressed goes back.
      this.requestComponentUpdate('refused');
      return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.refused)('prevented');
    }

    this.value = language.code;
    this.keep(language.code);

    if (language.href) {
      this.go(language.href);
    } else if (this.apply !== 'none') {
      this.applyLanguage(language);
    }

    this.requestComponentUpdate('value');
    return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.applied)({
      value: language.code
    });
  }

  keep(code) {
    const key = rememberKey(this.remember);
    if (!key) return;

    try {
      preferences().write(key, code);
    } catch {// A page without storage (private mode, blocked) still changes language.
    }
  }

  go(href) {
    const location = this.ownerDocument?.defaultView?.location;
    if (location && typeof location.assign === 'function') location.assign(href);
  } // The page takes the language: the components' words (SF.language.use,
  // which also writes <html lang>), and the direction it is written in.


  applyLanguage(language) {
    const root = this.ownerDocument?.documentElement;
    const shared = globalThis.SF?.language;
    if (typeof shared?.use === 'function') shared.use(language.code);

    if (root) {
      if (root.getAttribute('lang') !== language.code) root.setAttribute('lang', language.code);
      if (root.getAttribute('dir') !== language.dir) root.setAttribute('dir', language.dir);
    }
  } // ---------------------------------------------------------------- the parts
  // A segment was pressed. The group has already moved its plate; the
  // element answers for it, and the group's own change stays inside.


  onGroupChange(event) {
    event.stopPropagation();
    const group = event.currentTarget;
    const result = this.choose(group?.value, 'press');
    if (result.outcome !== 'applied' && group && group.value !== this.value) group.value = this.value;
  } // An arrow, Home or End in the switch moves the focus between the
  // languages and chooses nothing; Enter or Space presses the focused one
  // (its native click), which chooses it. Owner decision C142 (4): a choice
  // may reload the page or go to another address, so walking must not.


  onTrackKeys(event) {
    if (!WALK.has(event.key) || event.altKey || event.ctrlKey || event.metaKey) return;
    const track = this.querySelector(TRACK);
    const from = event.target?.closest?.('button[role="radio"]');
    if (!track || !from || !track.contains(from) || from.closest('.sf-button-group-narrow')) return;
    const radios = [...track.querySelectorAll('button[role="radio"]:not(:disabled)')];
    const at = radios.indexOf(from);
    if (at < 0) return;
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? radios.length - 1 : ['ArrowLeft', 'ArrowUp'].includes(event.key) ? (at - 1 + radios.length) % radios.length : (at + 1) % radios.length;
    event.preventDefault();
    event.stopPropagation();
    radios[next].focus();
  } // The field look's dropdown chose a language: the element answers for it,
  // and the dropdown's own change stays inside.


  onFieldChange(event) {
    event.stopPropagation();
    const field = event.currentTarget;
    const next = event.detail?.value ?? field?.value;
    if (!next) return;
    const result = this.choose(next, 'press');
    if (result.outcome !== 'applied' && field && field.value !== this.value) field.value = this.value;
  } // A row of the menu was chosen: the menu closes itself and returns focus to
  // the trigger; its event stays inside.


  onMenuSelect(event) {
    event.stopPropagation();
    const id = event.detail?.id;
    if (id) this.choose(id, 'press');
  }

  get menu() {
    return this.querySelector(MENU);
  } // The drawn trigger button (the setting trigger is its form: code or icon).


  get triggerButton() {
    return this.querySelector(TRIGGER);
  }
  /**
   * The trigger's boxes for a bar that fits its row (the site header, collapse
   * auto, or a step with fit): its width as drawn and its width shrunk, the
   * code trigger less its translate glyph (shrink="code", group build 20).
   * Read while whole, the glyph is drawn; read while shrunk, both widths are
   * the drawn one. Layout boxes, as the bar reads its row. A trigger that
   * does not shrink says the same width twice. The glyph is measured as it
   * is drawn (group build 21, Docara msg-cd7ddadb): the sf-icon host is
   * display: contents and has no box of its own, so its width read 0, the
   * bar counted no gain from shrinking the language and moved a section into
   * «Ещё» first (the docs header at 1280); its drawn face is the box now.
   */


  shrinkBoxes() {
    const host = this.triggerButton;
    const box = host?.querySelector(':scope > button') ?? host ?? this;
    const width = (0,_core_js_overflow_row_js__WEBPACK_IMPORTED_MODULE_7__.layoutWidth)(box);
    const shrinks = this.getAttribute('shrink') === 'code' && host?.matches((0,_core_js_tag_aliases_js__WEBPACK_IMPORTED_MODULE_5__.tagSelector)('sf-button'));
    const glyph = shrinks ? box.querySelector(':scope > sf-icon:first-child') : null;
    return {
      width,
      shrunk: width - renderedWidth(glyph)
    };
  }
  /**
   * Opens or closes the menu of a menu or search look. Open, the chosen
   * language is in view (research LG-5: with Greek chosen of forty the list
   * opened at Русский): in the menu look it takes the focus, so the arrows go
   * on from it; in the search look the field keeps the focus and the list is
   * scrolled to the chosen row.
   */


  toggleMenu() {
    const menu = this.menu;
    const host = this.triggerButton;
    if (!menu || !host || this.disabled) return;
    const anchor = host.querySelector('button') ?? host;
    const reset = Boolean(this._query);

    if (reset) {
      this._query = '';
      this.requestComponentUpdate('query');
    } // From searchFrom languages on a phone the menu is a sheet at the bottom
    // of the screen (owner decision C142 (5)): sf-menu-context's own sheet,
    // the one a form takes there, with the search on top and no field
    // focused, so no keyboard covers the list; the chosen row takes the
    // focus. Up to searchFrom the menu stays a popover by the trigger.


    const sheet = this.look === 'search' && onPhone(this);
    customElements.whenDefined('sf-menu-context').then(async () => {
      if (reset) await this.whenRendered(null, {
        next: true
      });
      const result = await menu.toggleFor(anchor, sheet ? {
        width: 'form',
        focus: 'none'
      } : {});
      if (result?.outcome !== 'applied' || result.value !== true) return;
      this._sheet = sheet;
      this.revealChosen(menu, true);
      this.followChosen(menu);
    });
  } // The chosen row in view, within the menu's own scrolling list (the page
  // does not move); focused in the menu look, where no field takes the focus.


  revealChosen(menu, focus) {
    if (!menu.isOpen) return;
    const row = menu.querySelector('[role="menuitemradio"][aria-checked="true"]');
    if (!row) return;
    if (focus && (this.look === 'menu' || this._sheet)) row.focus({
      preventScroll: true
    });
    let list = row.parentElement;

    while (list && list !== menu && !(list.scrollHeight > list.clientHeight + 1 && /(auto|scroll)/u.test(getComputedStyle(list).overflowY))) list = list.parentElement;

    if (!list || list === menu) return;
    const box = list.getBoundingClientRect();
    const own = row.getBoundingClientRect(); // Out of view, it comes to the middle of the list (as far as the list
    // goes); in view, nothing moves.

    if (own.top < box.top || own.bottom > box.bottom) list.scrollTop += own.top - box.top - (box.height - own.height) / 2;
  } // The menu is placed after it opens, and placed again when it or the
  // screen changes size: a placement measures the panel at its natural
  // height for a moment, which takes the list's scroll back to the top
  // (within one frame, so the list's size does not change). So until the
  // person does something in the menu, the chosen row is brought back into
  // view whenever the list changes size or is scrolled by something else.


  followChosen(menu) {
    this.stopFollowing();
    const surface = menu.querySelector(':scope > .sf-context-menu');
    if (!surface) return;

    const again = () => this.revealChosen(menu, false);

    const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(again) : null;
    observer?.observe(surface);
    const lists = [...surface.querySelectorAll('.sf-context-menu-list, .sf-context-menu-content')];

    for (const list of lists) {
      observer?.observe(list);
      list.addEventListener('scroll', again, {
        passive: true
      });
    }

    const stop = () => this.stopFollowing();

    const events = ['pointerdown', 'wheel', 'keydown', 'input', 'touchstart'];

    for (const name of events) surface.addEventListener(name, stop, {
      passive: true
    });

    this._following = () => {
      observer?.disconnect();

      for (const list of lists) list.removeEventListener('scroll', again);

      for (const name of events) surface.removeEventListener(name, stop);
    };
  }

  stopFollowing() {
    const following = this._following;
    this._following = null;
    following?.();
  }

  disconnectedCallback() {
    this.stopFollowing();
    super.disconnectedCallback?.();
  } // The menu's search field changed: the rows are narrowed here (remote).


  onMenuSearch(event) {
    event.stopPropagation();
    const query = String(event.detail?.query ?? '');
    if (query === this._query) return;
    this._query = query;
    this.requestComponentUpdate('query');
  } // The menu closed: the next opening starts with every row (the menu clears
  // its field without telling a remote search).


  onMenuClosed(event) {
    event.stopPropagation();
    this.stopFollowing();
    if (!this._query) return;
    this._query = '';
    this.requestComponentUpdate('query');
  } // The menu's rows: the name in itself, beside it its name in the page's
  // language (owner decision C142 (3): «Deutsch немецкий»; none when the two
  // are the same word, «Русский» on a Russian page), the radio mark on the
  // chosen one; each row in its own language. A language this page has no
  // translation of says so under its name (C142 (6)). A search
  // keeps the rows whose words -- the label, the native name, the English
  // name, the name in the page's language and the code -- a query's words
  // begin (research LG-8: a query matched inside words, «ит» found
  // литовский).


  menuEntries(list, current, query = '') {
    return (0,_js_languages__WEBPACK_IMPORTED_MODULE_10__.languageRows)(list, current, {
      page: (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageLocale)(this),
      query,
      missing: this.sfWord('missing')
    });
  } // The field look's options (sf-dropdown): the name in itself, the code as
  // the value.


  fieldOptions(list) {
    return list.map(language => ({
      type: 'text',
      text: language.label,
      value: language.code
    }));
  }

  templateContext() {
    const list = this.languageList;
    const current = this.current;
    const look = (0,_js_languages__WEBPACK_IMPORTED_MODULE_10__.lookFor)(list.length, {
      mode: this.mode,
      inlineMax: this.inlineMax,
      searchFrom: this.searchFrom
    });
    const size = _js_languages__WEBPACK_IMPORTED_MODULE_10__.SIZES.includes(this.size) ? this.size : '1';
    this.sfHostState('data-look', look);
    this._shownLook = look;
    const label = this.label;
    return this.createTemplateContext({ ...this.getPropsContext(),
      component: this,
      look,
      size,
      // The menu has two rungs: rows of 32 px up to 1/2, of 40 px from 1.
      menuSize: size === '1/3' || size === '1/2' ? '1/2' : '1',
      codes: this.labelsShown === 'code',
      disabled: Boolean(this.disabled || this.sfFormDisabled),
      list,
      current,
      value: current?.code ?? '',
      label,
      triggerLabel: current ? this.sfWord('trigger', {
        vars: {
          label,
          name: current.native
        }
      }) : label,
      // The trigger's name tooltip (C160 (1)): its surface's id, from the
      // element's path (§7.1.1).
      // trigger icon (C369): the glyph alone, sf-button-icon, which shows
      // its own name tooltip, so no surface is drawn here.
      // trigger name (C381): the glyph and the current language's own name
      // in the link role; the name is shown, so no tooltip either.
      icon: this.getAttribute('trigger') === 'icon',
      name: this.getAttribute('trigger') === 'name',
      tipId: (look === 'menu' || look === 'search') && !['icon', 'name'].includes(this.getAttribute('trigger')) ? (0,_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_6__.partId)((0,_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_6__.instancePath)(this, {
        kind: 'sf-language'
      }), 'tooltip') : '',
      entries: look === 'menu' || look === 'search' ? this.menuEntries(list, current, look === 'search' ? this._query : '') : [],
      search: look === 'search' ? this.searchOptions() : null,
      // The field look (C142 (8)): sf-dropdown of the same size -- it stands
      // on the whole field ladder since sf-dropdown 1.18.0 (it drew 1/3 and 3
      // at 1/2 and 2) -- its search from searchFrom languages.
      fieldSize: size,
      fieldOptions: look === 'field' ? this.fieldOptions(list) : [],
      fieldSearch: look === 'field' && list.length >= (Number(this.searchFrom) || 8),
      rootClass: this.getRootClass()
    });
  } // The menu's search: the field's words, and remote -- the menu tells this
  // element the query and shows the rows it is given.


  searchOptions() {
    return {
      placeholder: this.sfWord('search'),
      empty: this.sfWord('empty'),
      remote: true
    };
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_9__.renderLanguageTemplate)(this.templateContext());
  }

  afterRender() {
    // The menu takes its search as a property; the template cannot clear it
    // once set, so it is written here every drawing.
    const menu = this.menu;

    if (menu) {
      const search = this.look === 'search' ? this.searchOptions() : null;
      if (JSON.stringify(menu.search) !== JSON.stringify(search)) menu.search = search;
    } // The trigger's name tooltip (C160 (1)): the controller is a lazy
    // relation, asked for once a trigger with its tooltip is drawn.


    if (!this._tipAsked && this.querySelector('.sf-language-tooltip')) {
      this._tipAsked = true;
      globalThis.SF?.Loader?.ensurePlugin?.('tooltip');
    } // shrink="code" (group build 20): the bar that fits its row counted this
    // trigger whole until it was drawn (its glyph is what it gives up); once
    // the trigger button has drawn, the bar decides its row again.


    const trigger = this.getAttribute('shrink') === 'code' ? this.triggerButton : null;

    if (trigger && trigger !== this._shrinkAskedFor && typeof trigger.whenRendered === 'function') {
      this._shrinkAskedFor = trigger;
      trigger.whenRendered(() => fittingBar(this)?.queueFit());
    }

    this.sfSyncFormState();
  }

}
/**
 * The «Язык» row of an app's menu (owner decision C142 (7)): an
 * sf-menu-context entry with the translate glyph, the current language's
 * name as its value and a submenu of sf-language's rows -- the name in
 * itself, its name in the page's language beside it (C49), the radio mark on
 * the current one -- with a search from searchFrom languages. The rows' ids
 * are «language:<code>»; the menu's select event carries it, and the app
 * applies the language (SfLanguage.codeOf(id) reads the code back).
 *
 *   menu.entries = [themeRow, SfLanguage.menuEntry({languages: 'ru en de', value: 'ru'}), ...];
 */


SfLanguage.menuEntry = function menuEntry({
  languages = '',
  items = [],
  value = '',
  page = '',
  label = '',
  missing = '',
  home = '',
  href = '',
  searchFrom = 8
} = {}) {
  const list = (0,_js_languages__WEBPACK_IMPORTED_MODULE_10__.normalizeLanguages)(languages, items, href, {
    missing,
    home
  });
  const doc = globalThis.document?.documentElement;
  const pageCode = page || doc?.getAttribute('lang') || 'en'; // The page language's words: English built in, any other the words its
  // language file registered for sf-language (C282).

  const code = String(pageCode).toLowerCase().replace('_', '-');
  const registered = globalThis.__sfPageLanguage?.registered?.get?.('sf-language'); // A registry alias takes its pack's words (zh-cn: zh-hans, pt: pt-br;
  // core/lang/index.json aliases, kept on the shared store by core).

  const pack = one => globalThis.__sfPageLanguage?.packs?.aliases?.[one] ?? one;

  const base = code.split('-')[0];
  const words = { ...en.runtime,
    ...[...new Set([base, pack(base), pack(code), code])].reduce((all, one) => ({ ...all,
      ...(registered?.get?.(one) ?? {})
    }), {})
  };
  const current = (value && (0,_js_languages__WEBPACK_IMPORTED_MODULE_10__.matchLanguage)(list, value)) ?? (0,_js_languages__WEBPACK_IMPORTED_MODULE_10__.matchLanguage)(list, pageCode) ?? list[0] ?? null;
  const entry = {
    id: 'language',
    text: label || words.label,
    icon: 'translate',
    value: current?.label,
    submenu: (0,_js_languages__WEBPACK_IMPORTED_MODULE_10__.languageRows)(list, current, {
      page: pageCode,
      missing: words.missing,
      prefix: 'language:'
    }),
    // The rows' second names need the panel's width (C32, C142 (3)).
    width: 'panel'
  };
  if (list.length >= (Number(searchFrom) || 8)) entry.search = {
    placeholder: words.search,
    empty: words.empty
  };
  return entry;
};
/** The language code of an app menu row's id («language:de» -> «de»); '' for another row. */


SfLanguage.codeOf = id => String(id ?? '').startsWith('language:') ? String(id).slice('language:'.length) : '';

SfLanguage.define('sf-language');

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "464bf30e7c23"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MODES: () => (/* binding */ MODES),
/* harmony export */   SIZES: () => (/* binding */ SIZES),
/* harmony export */   canonicalCode: () => (/* binding */ canonicalCode),
/* harmony export */   dirOf: () => (/* binding */ dirOf),
/* harmony export */   englishName: () => (/* binding */ englishName),
/* harmony export */   isVariant: () => (/* binding */ isVariant),
/* harmony export */   languageRows: () => (/* binding */ languageRows),
/* harmony export */   lookFor: () => (/* binding */ lookFor),
/* harmony export */   matchLanguage: () => (/* binding */ matchLanguage),
/* harmony export */   matchesQuery: () => (/* binding */ matchesQuery),
/* harmony export */   nameIn: () => (/* binding */ nameIn),
/* harmony export */   nativeName: () => (/* binding */ nativeName),
/* harmony export */   normalizeLanguages: () => (/* binding */ normalizeLanguages),
/* harmony export */   pageName: () => (/* binding */ pageName),
/* harmony export */   searchWords: () => (/* binding */ searchWords),
/* harmony export */   shortLabel: () => (/* binding */ shortLabel),
/* harmony export */   shortLabelIn: () => (/* binding */ shortLabelIn),
/* harmony export */   useNames: () => (/* binding */ useNames)
/* harmony export */ });
/* harmony import */ var _core_js_page_language_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("43090d1c8307");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_page_language_js__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
_core_js_page_language_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var _core_js_page_language_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_page_language_js__WEBPACK_IMPORTED_MODULE_0__);
// The languages of sf-language, without the element: codes made canonical,
// named in themselves and in English, the direction each is written in, the
// look a count of them takes, and what a search finds. The names of the
// languages the component supports ship with it (data/names.json, from CLDR:
// the browser's Intl.DisplayNames names fewer -- research LG-7); the browser
// names the rest, and what neither can name is shown as its code. The
// element gives this module the shipped names (useNames). Their names in
// Russian and any other language are words of sf-language, name-<code>, a
// language file's (owner decision C282), read through the page's language
// registry.

const MODES = ['auto', 'inline', 'menu', 'search', 'field'];
const SIZES = ['1/3', '1/2', '1', '2', '3']; // The languages written right to left, by their primary subtag, where the
// browser cannot say it itself (Intl.Locale textInfo); and the scripts that
// make any language right to left (ku-Arab, pa-Arab, ms-Arab).

const RTL_LANGUAGES = new Set(['ar', 'arc', 'ckb', 'dv', 'fa', 'he', 'iw', 'ks', 'lrc', 'mzn', 'nqo', 'ps', 'sd', 'syr', 'ug', 'ur', 'yi']);
const RTL_SCRIPTS = new Set(['adlm', 'arab', 'hebr', 'mand', 'nkoo', 'rohg', 'syrc', 'thaa']);

const text = value => value === undefined || value === null ? '' : String(value).trim();
/** A language code in its canonical BCP 47 spelling (pt-br -> pt-BR), or '' when it is none. */


function canonicalCode(value) {
  const code = text(value).replace(/_/gu, '-');
  if (!code || !/^[a-z]{2,8}(-[a-z0-9]{1,8})*$/iu.test(code)) return '';

  try {
    return Intl.getCanonicalLocales(code)[0] || '';
  } catch {
    return '';
  }
}
/** ltr or rtl: how a language is written. */

function dirOf(code) {
  const canonical = canonicalCode(code);
  if (!canonical) return 'ltr';

  try {
    const locale = new Intl.Locale(canonical);
    const info = typeof locale.getTextInfo === 'function' ? locale.getTextInfo() : locale.textInfo;
    if (info?.direction === 'rtl' || info?.direction === 'ltr') return info.direction;
  } catch {// Read below.
  }

  const [primary, ...rest] = canonical.toLowerCase().split('-');
  const script = rest.find(part => part.length === 4);
  if (script) return RTL_SCRIPTS.has(script) ? 'rtl' : 'ltr';
  return RTL_LANGUAGES.has(primary) ? 'rtl' : 'ltr';
} // The shipped names, by canonical code in lower case.

const SHIPPED = new Map(); // The code as the data writes it (zh-Hans), by its lower case: the key of its
// name words (name-zh-Hans).

const DATA_CODES = new Map();

const canonicalWordCode = code => DATA_CODES.get(String(code).toLowerCase()) ?? String(code);
/** Takes the shipped names (data/names.json): {names: {<code>: {native, en}}}. */


function useNames(data) {
  SHIPPED.clear();
  DATA_CODES.clear();

  for (const [code, names] of Object.entries(data?.names ?? {})) {
    if (!names || typeof names !== 'object') continue;
    SHIPPED.set(code.toLowerCase(), names);
    DATA_CODES.set(code.toLowerCase(), code);
  }
} // The name of a language in a language the data does not name it in (owner
// decision C282: the data names each in itself and in English; Russian and
// any other language's names are words of sf-language, name-<code>, its
// language file's). undefined when that language has none.

function nameWord(code, inLanguage) {
  const key = `name-${code}`;
  const word = (0,_core_js_page_language_js__WEBPACK_IMPORTED_MODULE_0__.localeText)(null, key, inLanguage, 'sf-language');
  return word === key ? undefined : word;
} // A shipped name of a language in a language: native (in itself), en, or the
// words of the language it is named in; '' when none.


function shippedName(code, inLanguage) {
  const names = SHIPPED.get(String(code).toLowerCase());
  if (!names) return '';
  const want = String(inLanguage).toLowerCase();
  if (want === String(code).toLowerCase()) return names.native || '';
  const own = names[want] || names[want.split('-')[0]];
  if (own) return own;
  const word = nameWord(canonicalWordCode(code), want);
  return typeof word === 'string' ? word : '';
} // A language's name in a language: the shipped one first, else the
// browser's; '' when neither has one.


function displayName(code, inLanguage) {
  const shipped = shippedName(code, inLanguage);
  if (shipped) return shipped;

  try {
    const name = new Intl.DisplayNames([inLanguage], {
      type: 'language',
      fallback: 'none'
    }).of(code);
    return name && name !== code ? name : '';
  } catch {
    return '';
  }
} // A name begins with a capital in a list, as a person writes it in a menu
// («Русский», «Español»); the capital is the language's own.
// A script whose upper case is a display style, not the capital of running
// text (U+10D0-U+10FF), keeps the name as it is written.


const UNCASED = /^[\u10D0-\u10FF]/u;

function capitalised(name, code) {
  if (!name) return '';
  if (UNCASED.test(name)) return name;

  try {
    return name.charAt(0).toLocaleUpperCase(code) + name.slice(1);
  } catch {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }
} // A code's parts: the primary language, and the script and region subtags
// that make it a variant (pt-BR, zh-Hant), or '' when it has none.


function partsOf(code) {
  const [primary = '', ...rest] = String(code).split('-');
  const script = rest.find(part => /^[a-z]{4}$/iu.test(part)) || '';
  const region = rest.find(part => /^([a-z]{2}|\d{3})$/iu.test(part)) || '';
  return {
    primary: primary.toLowerCase(),
    script,
    region
  };
} // A name from the browser in its standard form: the language and, in
// brackets, what makes the variant («português (Brasil)», «中文（简体）»),
// not the dialect name («português europeu», «简体中文»).


function standardName(code, inLanguage) {
  try {
    const name = new Intl.DisplayNames([inLanguage], {
      type: 'language',
      languageDisplay: 'standard',
      fallback: 'none'
    }).of(code);
    return name && name !== code ? name : '';
  } catch {
    return '';
  }
}

function subtagName(type, subtag, inLanguage) {
  try {
    return new Intl.DisplayNames([inLanguage], {
      type,
      fallback: 'none'
    }).of(subtag) || '';
  } catch {
    return '';
  }
} // What makes a variant, in a language: the region («Бразилия») or the script.


function qualifierIn(code, inLanguage) {
  const {
    script,
    region
  } = partsOf(code);
  if (region) return subtagName('region', region.toUpperCase(), inLanguage);
  if (script) return subtagName('script', script.charAt(0).toUpperCase() + script.slice(1).toLowerCase(), inLanguage);
  return '';
}
/** Whether a code is a variant of a language: it names a script or a region (pt-BR, zh-Hant). */


function isVariant(code) {
  const {
    script,
    region
  } = partsOf(code);
  return Boolean(script || region);
}
/**
 * The name of a language in itself: «Deutsch» for de. A variant is the full
 * name with what makes it one, in its own words (owner decision C142 (9)):
 * «Português (Brasil)», «Português (Portugal)», «中文（简体）».
 */

function nativeName(code) {
  if (isVariant(code)) {
    const full = standardName(code, code);
    if (full) return capitalised(full, code);
    const base = displayName(partsOf(code).primary, partsOf(code).primary);
    const qualifier = qualifierIn(code, code);
    if (base && qualifier) return capitalised(`${base} (${qualifier})`, code);
  }

  return capitalised(displayName(code, code), code) || code.toUpperCase();
}
/** The name of a language in English: «German» for de. */

function englishName(code) {
  return capitalised(displayName(code, 'en'), 'en') || code.toUpperCase();
}
/** The name of a language in another, for the search: «немецкий» for de on a Russian page. */

function nameIn(code, language) {
  return displayName(code, language);
}
/**
 * The second name of a menu row: the language's name in the page's language
 * (owner decision C142 (3): «Deutsch немецкий» on a Russian page, W3C
 * language navigation), as it is written in running text. A variant says
 * what makes it one: «португальский, Бразилия»; a script variant the name
 * the component ships («китайский, упрощенное письмо»). '' when the page's
 * language has no name for it.
 */

function pageName(code, page) {
  const language = text(page) || 'en';

  if (isVariant(code)) {
    const {
      primary,
      region
    } = partsOf(code);

    if (region) {
      const base = displayName(primary, language);
      const qualifier = qualifierIn(code, language);
      if (base && qualifier) return `${base}, ${qualifier}`;
    }

    const shipped = shippedName(code, language);
    if (shipped) return shipped;
    const full = standardName(code, language);
    if (full) return full;
  }

  return displayName(code, language);
}
/** The code as a code label (labels="code") shows it: RU, EN, PT-BR. */

function shortLabel(code) {
  return code.toUpperCase();
} // Chinese is told apart by its script, not its country (C142 (9)): the
// labels Chinese sites themselves write.

const CHINESE_SCRIPT = {
  hans: '简体',
  hant: '繁體'
};
const CHINESE_REGION_SCRIPT = {
  cn: 'hans',
  sg: 'hans',
  my: 'hans',
  tw: 'hant',
  hk: 'hant',
  mo: 'hant'
};
/**
 * The code a list shows for a language (the trigger, labels="code"): the
 * language alone while the list holds one variant of it («PT» for pt-BR);
 * the region too when it holds two («PT-BR», «PT-PT»); Chinese by its script
 * («简体», «繁體»). Owner decision C142 (9).
 */

function shortLabelIn(code, list) {
  const {
    primary,
    script,
    region
  } = partsOf(code);
  const variants = list.filter(one => partsOf(one).primary === primary).length;
  if (variants < 2) return primary.toUpperCase();

  if (primary === 'zh') {
    const by = (script || CHINESE_REGION_SCRIPT[region.toLowerCase()] || '').toLowerCase();
    if (CHINESE_SCRIPT[by]) return CHINESE_SCRIPT[by];
  }

  return shortLabel(code);
}
/**
 * The languages as given: codes in a string («ru en de», commas allowed), or a
 * list of codes or of {code, label, short, href, missing}. `href` (a pattern
 * with {code}) gives each language without its own href one. A language this
 * page has no translation for -- written in `missing` («de fr») or an item's
 * missing: true -- stays in the list (C142 (6)); its address is `home` (a
 * pattern with {code}) when given, the site's main page in that language.
 * Unknown codes and repeats are left out.
 */

function normalizeLanguages(languages, items, href = '', {
  missing = '',
  home = ''
} = {}) {
  const source = Array.isArray(items) && items.length ? items : Array.isArray(languages) ? languages : text(languages).split(/[\s,;]+/u);
  const pattern = text(href);
  const homePattern = text(home);
  const absent = new Set(text(missing).split(/[\s,;]+/u).map(one => canonicalCode(one).toLowerCase()).filter(Boolean));
  const seen = new Set();
  const given = [];

  for (const entry of source) {
    const one = typeof entry === 'string' ? {
      code: entry
    } : entry && typeof entry === 'object' ? entry : null;
    if (!one) continue;
    const code = canonicalCode(one.code ?? one.value ?? one.lang);
    if (!code || seen.has(code.toLowerCase())) continue;
    seen.add(code.toLowerCase());
    given.push([code, one]);
  }

  const codes = given.map(([code]) => code);
  return given.map(([code, one]) => {
    const own = nativeName(code);
    const untranslated = one.missing === true || absent.has(code.toLowerCase());
    const address = untranslated && homePattern ? homePattern.replace(/\{(code|lang)\}/gu, code) : text(one.href) || (pattern ? pattern.replace(/\{(code|lang)\}/gu, code) : '');
    return {
      code,
      label: text(one.label) || own,
      native: own,
      english: englishName(code),
      short: text(one.short) || shortLabelIn(code, codes),
      href: address,
      missing: untranslated,
      dir: dirOf(code)
    };
  });
} // What a search compares: lower case in the root locale, without accents
// (é and ё compare as e and е), so a query matches whatever case and marks it
// is typed in.

const folded = value => String(value ?? '').normalize('NFD').replace(/\p{M}+/gu, '').toLocaleLowerCase('und'); // The words a name is made of: split at spaces, hyphens, brackets and the
// like, so «português (Brasil)» is «português» and «brasil», and pt-BR is pt
// and br as well as pt-br.


const WORD_BREAK = /[\s\-\u2010-\u2015()（）[\],.;:'"«»·/]+/u;
/** The word starts of a text, folded: what a search query must begin. */

function searchWords(...texts) {
  const words = new Set();

  for (const text of texts) {
    const whole = folded(text).trim();
    if (!whole) continue;
    words.add(whole);

    for (const word of whole.split(WORD_BREAK)) if (word) words.add(word);
  }

  return [...words];
}
/**
 * Whether a query finds a language by its words (searchWords): each word of
 * the query begins one of them. «ит» finds итальянский, not литовский,
 * where «ит» is inside the word (research LG-8).
 */

function matchesQuery(words, query) {
  const parts = folded(query).trim().split(WORD_BREAK).filter(Boolean);
  if (!parts.length) return true;
  return parts.every(part => words.some(word => word.startsWith(part)));
}
/**
 * The look for a number of languages: none, inline, menu, search or field. In auto
 * every count from two is the menu (owner decision C142: one button, no
 * jump of width from a track to a button when a language is added), from
 * searchFrom the menu with search; the track is mode="inline", for a
 * settings page. inlineMax (1 since 1.4.0) still lets auto draw the track up
 * to that count for a page that writes it.
 */

function lookFor(count, {
  mode = 'auto',
  inlineMax = 1,
  searchFrom = 8
} = {}) {
  if (count < 2) return 'none';
  if (mode === 'inline' || mode === 'menu' || mode === 'search' || mode === 'field') return mode;
  const inline = Number.isFinite(Number(inlineMax)) ? Number(inlineMax) : 1;
  const search = Number.isFinite(Number(searchFrom)) ? Number(searchFrom) : 8;
  if (count >= search) return 'search';
  return count <= inline ? 'inline' : 'menu';
}
/** The language of a list that a code names: the same code, else the same primary language. */

function matchLanguage(list, value) {
  const code = canonicalCode(value).toLowerCase();
  if (!code) return null;
  const exact = list.find(language => language.code.toLowerCase() === code);
  if (exact) return exact;
  const primary = code.split('-')[0];
  return list.find(language => language.code.toLowerCase() === primary) ?? list.find(language => language.code.toLowerCase().split('-')[0] === primary) ?? null;
}
/**
 * The menu rows of a list of languages (sf-menu-context entries): the name in
 * itself; beside it, as the row's value, its name in the page's language
 * (owner decision C142 (3)), left out when it is the same word; under it, for
 * a language this page has no translation of, the line `missing` (C142 (6));
 * the radio mark on the chosen one; each row in its own language. A query
 * keeps the rows whose words it begins (research LG-8). `prefix` goes before
 * each row's id (an app menu's «language:»).
 */

function languageRows(list, current, {
  page = 'en',
  query = '',
  missing = '',
  prefix = ''
} = {}) {
  const same = (a, b) => String(a).toLocaleLowerCase() === String(b).toLocaleLowerCase();

  return list.filter(language => !query || matchesQuery(searchWords(language.label, language.native, language.english, nameIn(language.code, page), pageName(language.code, page), language.code), query)).map(language => {
    const second = pageName(language.code, page);
    return {
      id: `${prefix}${language.code}`,
      text: language.label,
      value: second && !same(second, language.label) && !same(second, language.native) ? second : undefined,
      caption: language.missing && missing ? missing : undefined,
      kind: 'radio',
      checked: language.code === current?.code,
      lang: language.code
    };
  });
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "688582849827"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderLanguageTemplate: () => (/* binding */ renderLanguageTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
 // sf-language's markup: one of three looks, all of them parts the Framework
// already has, so the element has no sheet of its own.
//
// - none (one language or none): nothing at all.
// - menu and search (two and more in auto, owner decision C142): sf-button
//   with the «translate» glyph, the current language's code and the
//   expand_more glyph («RU ▾»), named «Язык: Русский», and sf-menu-context,
//   a popup menu of radio rows, each in its own language; search adds the
//   menu's own search field (remote: the element narrows the rows by word
//   starts) and the panel's constant width of decision C32 (width="panel":
//   20rem, 18rem compact). The code keeps one width whatever language is
//   chosen: every code of the list stands in the same grid cell, the others
//   hidden, so the label is as wide as the widest of them.
// - inline (mode="inline" only, for a settings page): sf-segmented on its
//   track, a radio group named by label, one segment per language labelled
//   with its own name (labels="code": its code, the name kept as the
//   segment's accessible name), each segment in its own language (lang).
//   The arrows move the focus, Enter or Space chooses (C142 (4), the
//   element's keydown).
// - field (mode="field", C142 (8)): sf-dropdown as a form field, its label
//   above it, its rows the languages' names, its search from searchFrom.
//
// Every menu is decision C32's panel width (width="panel": 20rem, 18rem
// compact; C142 (3)): a row holds the name and, beside it, the name in the
// page's language, longer in Russian («французский»). From searchFrom
// languages on a phone it opens as sf-menu-context's sheet (C142 (5)).
//
// The parts' events stay inside the element (stopPropagation): the page hears
// sf-language's change, never a segment's or a menu row's.

const stop = event => event.stopPropagation();

function renderInline(context) {
  const items = context.list.map(language => ({
    value: language.code,
    label: context.codes ? language.short : language.label,
    ariaLabel: context.codes ? language.label : '',
    lang: language.code
  }));
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-segmented
      class=${['sf-language', context.rootClass].filter(Boolean).join(' ')}
      appearance="track"
      size=${context.size}
      .items=${items}
      value=${context.value}
      aria-label=${context.label}
      ?disabled=${context.disabled}
      @change=${event => context.component.onGroupChange(event)}
      @sf-button-group-change=${stop}
    ></sf-segmented>`;
} // The trigger's label: the current code, with every other code of the list
// in the same grid cell and hidden, so the button keeps the width of the
// widest code whatever is chosen (C142: the width does not change with the
// language). The hidden codes are out of the accessibility tree; the
// button's name is its aria-label. The cell is one text line wide (core
// sheet), the width core holds for the trigger before this code arrives, so
// nothing moves when it draws (C130); two capitals stand in it. A list with
// a longer code -- more than two letters (PT-BR) or letters wider than a
// capital (简体) -- sizes the cell to its widest code instead.


const NARROW_CODE = /^[\p{Script=Latin}\p{Script=Cyrillic}\p{Script=Greek}]{1,2}$/u;

function renderCode(context) {
  const shown = context.current?.short ?? '';
  const wide = context.list.some(language => !NARROW_CODE.test(String(language.short ?? '')));
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span slot="text" class="sf-language-code" style=${wide ? 'display: inline-grid; inline-size: auto; grid-template-columns: auto' : 'display: inline-grid'}>${context.list.map(language => {
    const own = language.short === shown;
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span
        style=${own ? 'grid-area: 1 / 1' : 'grid-area: 1 / 1; visibility: hidden'}
        aria-hidden=${own ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : 'true'}
      >${language.short}</span>`;
  })}</span>`;
} // trigger icon (owner decision C369, docs header 2026-11-19): the glyph
// alone, a square icon button of the element's size -- ghost on-surface, as
// the code trigger -- named «Язык: Русский», which shows that name as the
// Framework's tooltip by itself (C160 (1)); the menu is the same.


function renderIconTrigger(context) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button-icon
      class=${['sf-language', context.rootClass].filter(Boolean).join(' ')}
      icon="translate"
      appearance="ghost"
      scheme="on-surface"
      size=${context.size}
      aria-label=${context.triggerLabel}
      aria-haspopup="menu"
      ?disabled=${context.disabled}
      @click=${() => context.component.toggleMenu()}
    ></sf-button-icon>`;
} // trigger name (owner decision C381 with C369, the sign-in screen
// 2026-11-19): the glyph and the current language's own name («Русский»,
// «Deutsch») in the link role (component link, C186) in its navigation
// form: the words in the ink and the size of their place, no fill in any
// state, the line under the name on hover, press, keyboard focus and while
// the menu is open, the link's focus ring; the glyph a line high (C107 (5)),
// 4 from the words. A native button: it opens a menu, it goes nowhere. Its
// width is the name's; the name is shown, so no tooltip. Its accessible name
// stays «Язык: Русский», the name in the language's own lang.


function renderNameTrigger(context) {
  const current = context.current;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<button
      type="button"
      class=${['sf-link', 'sf-link--navigation', 'sf-language-name', context.rootClass].filter(Boolean).join(' ')}
      aria-label=${context.triggerLabel}
      aria-haspopup="menu"
      aria-expanded="false"
      ?disabled=${context.disabled}
      @click=${() => context.component.toggleMenu()}
    ><sf-icon class="sf-link-icon" icon="translate" aria-hidden="true"></sf-icon><span class="sf-link-content" lang=${current?.code || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>${current?.native ?? context.label}</span></button>`;
}

function renderMenu(context) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${context.name ? renderNameTrigger(context) : context.icon ? renderIconTrigger(context) : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button
      class=${['sf-language', context.rootClass].filter(Boolean).join(' ')}
      icon-start="translate"
      icon-end="expand_more"
      appearance="ghost"
      scheme="on-surface"
      size=${context.size}
      aria-label=${context.triggerLabel}
      data-tooltip=${context.tipId || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      aria-haspopup="menu"
      ?disabled=${context.disabled}
      @click=${() => context.component.toggleMenu()}
    >${renderCode(context)}</sf-button>`}
    <sf-menu-context
      popup
      size=${context.menuSize}
      width="panel"
      aria-label=${context.label}
      .entries=${context.entries}
      @sf-menu-context-select=${event => context.component.onMenuSelect(event)}
      @sf-context-menu-select=${stop}
      @sf-menu-context-search=${event => context.component.onMenuSearch(event)}
      @sf-context-menu-search=${stop}
      @sf-menu-context-closed=${event => context.component.onMenuClosed(event)}
      @sf-context-menu-closed=${stop}
    ></sf-menu-context>${renderTooltip(context)}`;
} // The trigger's name as the Framework's tooltip (owner decision C160 (1),
// TT-11), not a browser title: «Язык: Русский» on hover, keyboard focus or a
// long press, the surface named by the button's data-tooltip (sf-button hands
// a data-* to its native button) and shown by the tooltip controller
// (component tooltip, asked for once the trigger draws). The text is the
// button's accessible name, so the controller adds no description.


function renderTooltip(context) {
  if (!context.tipId || !context.triggerLabel) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-tooltip sf-tooltip--dark sf-language-tooltip" id=${context.tipId} hidden><span class="sf-tooltip-content"><span class="sf-tooltip-text">${context.triggerLabel}</span></span></span>`;
} // The parts stand in a frame without a box of its own (display: contents), so
// they lay out in the host's place. The frame is what the first paint prints
// as static markup: the switch and the trigger inside it wait for this
// element and take their printed picture from it, rather than drawing alone
// before it (the switch without its languages, the trigger without its glyph).


const frame = parts => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-language-parts" style="display: contents">${parts}</div>`;

function renderField(context) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-dropdown
      class=${['sf-language', context.rootClass].filter(Boolean).join(' ')}
      mode="select"
      appearance="bordered"
      size=${context.fieldSize}
      label=${context.label}
      .options=${context.fieldOptions}
      value=${context.value}
      .search=${context.fieldSearch}
      search-placeholder=${context.fieldSearch ? context.component.sfWord('search') : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      ?disabled=${context.disabled}
      @change=${event => context.component.onFieldChange(event)}
      @sf-dropdown-change=${stop}
      @input=${stop}
    ></sf-dropdown>`;
}

function renderLanguageTemplate(context) {
  if (context.look === 'inline') return frame(renderInline(context));
  if (context.look === 'field') return frame(renderField(context));
  if (context.look === 'menu' || context.look === 'search') return frame(renderMenu(context));
  return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
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

/***/ "2a080a730149"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("lit", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "43090d1c8307"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("page-language", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("page-language", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "deb1a4d61565"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("smart-base", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("smart-base", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "0161a89699b6"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   files: () => (/* binding */ files)
/* harmony export */ });
/* harmony import */ var _en_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("1fc6cbb91573");
// Written by scripts/build-language-packs.mjs from src/core/lang/built-in.json
// (owner decision C282); do not edit. The words this bundle carries: the
// built-in languages' (en); every other language comes from
// a language file (core/lang/<code>.js or its parts).


const files = { en: { runtime: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime } };

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ en: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime });


/***/ },

/***/ "11b7e7a66992"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.language","tag":"sf-language","version":"1.8.1","kind":"leaf","settings":{"languages":{"type":"string","default":""},"items":{"type":"list","schema":{"items":{"type":"object","properties":{"code":{"type":"string"},"label":{"type":"string"},"short":{"type":"string"},"href":{"type":"string"},"missing":{"type":"boolean"}},"required":["code"]}},"default":[]},"href":{"type":"string","default":""},"missing":{"type":"string","default":""},"home":{"type":"string","default":""},"mode":{"type":"enum","values":["auto","inline","menu","search","field"],"default":"auto"},"inline-max":{"type":"number","integer":true,"min":1,"default":1},"search-from":{"type":"number","integer":true,"min":2,"default":8},"labels":{"type":"enum","values":["name","code"],"default":"name"},"size":{"type":"enum","values":["1/3","1/2","1","2","3"],"default":"1"},"trigger":{"type":"enum","values":["code","icon","name"],"default":"code"},"shrink":{"type":"enum","values":["none","code"],"default":"none"},"apply":{"type":"enum","values":["page","none"],"default":"page"},"remember":{"type":"string","default":""},"label":{"type":"string","default-from":"runtime.label"},"name":{"type":"string","default":""},"disabled":{"type":"boolean","default":false}},"values":{"value":{"type":"string","default":""},"look":{"type":"enum","values":["none","inline","menu","search","field"]}},"events":{"change":{"carries":{"value":{"type":"string"},"previous":{"type":"string"},"href":{"type":"string"},"dir":{"type":"enum","values":["ltr","rtl"]},"reason":{"type":"enum","values":["press","api"]}},"cancelable":true}},"actions":{"select":{"with":{"value":"string"}}},"form":{"value":"value","name":"name","default":"value","submits":"value","reset":"default","disabled":"disabled","validity":["custom-error"]},"host-states":{"data-look":"string","data-shrunk":"boolean"}}');

/***/ },

/***/ "9937e6b314d1"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Names of the languages sf-language supports, from CLDR 48 (ICU 78 as Node.js ships it): each language in itself (native) and in English (en). Since owner decision C282 their names in Russian are the ru language file\'s words (src/core/js/lang/language-names, name-<code>, registered for sf-language), as any other language\'s names may be. The browser\'s Intl.DisplayNames carries fewer languages (headless Chromium names tt only in English and ba, sah not at all; research 2026-11-14-language LG-7), so these names come first and Intl names every other language and page language. Spelled as CLDR writes them; the element gives a name its capital in a list. Data, not code: add a language here with both names, and its Russian name to the language file. Owner decision C278 (2026-11-17): languages of CIS countries other than Russian are not named here (uk, be, uz, az, hy, ka, ky, tg and tk left on 2026-11-18, kk before; tt and ba, languages of regions of Russia, stay); the browser names such a code if a product lists one.","names":{"ru":{"native":"русский","en":"Russian"},"en":{"native":"English","en":"English"},"de":{"native":"Deutsch","en":"German"},"fr":{"native":"français","en":"French"},"es":{"native":"español","en":"Spanish"},"it":{"native":"italiano","en":"Italian"},"pt":{"native":"português","en":"Portuguese"},"pt-BR":{"native":"português (Brasil)","en":"Brazilian Portuguese"},"pt-PT":{"native":"português europeu","en":"European Portuguese"},"tr":{"native":"Türkçe","en":"Turkish"},"pl":{"native":"polski","en":"Polish"},"he":{"native":"עברית","en":"Hebrew"},"ar":{"native":"العربية","en":"Arabic"},"fa":{"native":"فارسی","en":"Persian"},"hi":{"native":"हिन्दी","en":"Hindi"},"bn":{"native":"বাংলা","en":"Bangla"},"ja":{"native":"日本語","en":"Japanese"},"ko":{"native":"한국어","en":"Korean"},"zh":{"native":"中文","en":"Chinese"},"zh-Hans":{"native":"简体中文","en":"Simplified Chinese"},"zh-Hant":{"native":"繁體中文","en":"Traditional Chinese"},"zh-TW":{"native":"中文（台灣）","en":"Chinese (Taiwan)"},"vi":{"native":"Tiếng Việt","en":"Vietnamese"},"th":{"native":"ไทย","en":"Thai"},"id":{"native":"Indonesia","en":"Indonesian"},"ms":{"native":"Melayu","en":"Malay"},"nl":{"native":"Nederlands","en":"Dutch"},"sv":{"native":"svenska","en":"Swedish"},"no":{"native":"norsk","en":"Norwegian"},"nb":{"native":"norsk bokmål","en":"Norwegian Bokmål"},"da":{"native":"dansk","en":"Danish"},"fi":{"native":"suomi","en":"Finnish"},"cs":{"native":"čeština","en":"Czech"},"sk":{"native":"slovenčina","en":"Slovak"},"hu":{"native":"magyar","en":"Hungarian"},"ro":{"native":"română","en":"Romanian"},"bg":{"native":"български","en":"Bulgarian"},"el":{"native":"Ελληνικά","en":"Greek"},"tt":{"native":"татар","en":"Tatar"},"ba":{"native":"башҡорт","en":"Bashkir"},"sah":{"native":"саха тыла","en":"Yakut"},"mn":{"native":"монгол","en":"Mongolian"},"cv":{"native":"чӑваш чӗлхи","en":"Chuvash"},"ce":{"native":"нохчийн","en":"Chechen"},"os":{"native":"ирон","en":"Ossetic"},"lv":{"native":"latviešu","en":"Latvian"},"lt":{"native":"lietuvių","en":"Lithuanian"},"et":{"native":"eesti","en":"Estonian"},"sr":{"native":"српски","en":"Serbian"},"hr":{"native":"hrvatski","en":"Croatian"},"sl":{"native":"slovenščina","en":"Slovenian"},"mk":{"native":"македонски","en":"Macedonian"},"sq":{"native":"shqip","en":"Albanian"},"bs":{"native":"bosanski","en":"Bosnian"},"ug":{"native":"ئۇيغۇرچە","en":"Uyghur"},"ur":{"native":"اردو","en":"Urdu"}}}');

/***/ },

/***/ "1fc6cbb91573"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Language","runtime":{"label":"Language","trigger":"{label}: {name}","search":"Find a language","empty":"No language found","missing":"no translation — the home page opens"}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("08d5ec4efd25");
/******/
/******/ })()
;