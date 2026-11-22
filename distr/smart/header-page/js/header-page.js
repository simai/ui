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

/***/ "fb52758a61f1"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SfPageHeader: () => (/* binding */ SfPageHeader)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _core_js_density__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("1412c5875b4d");
/* harmony import */ var _core_js_overflow_row_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("2db3a835ac11");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("7fc7df212ec0");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("96b1e08482fd");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("b8705148b32a");
/* harmony import */ var _lang_index_mjs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("d1d35d196e05");
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("6c4095b537c9");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, _core_js_smart_base__WEBPACK_IMPORTED_MODULE_1__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2__, _js_templates_default__WEBPACK_IMPORTED_MODULE_5__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, _core_js_smart_base__WEBPACK_IMPORTED_MODULE_1__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2__, _js_templates_default__WEBPACK_IMPORTED_MODULE_5__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2__);
// The head of a work page of an app: where the page is, what it is called,
// whether it is a favourite, its actions and its views. An app with a side
// menu has no top bar (owner decision C161 (1); larena-specs
// frontend-interface-program, sf-admin-menu assignment, v5, section 6), so
// this is the only place a page says these things -- the admin's pages, SIMAI
// Pro's conversation head and ui-mail's columns alike; a site shows
// sf-header-site.
//
// The host owns everything in it. The path, the start of the line («назад»,
// a phone's menu), the actions and the tabs are the host's own markup in
// slots; the heading, the count
// and whether the page is shared by every site are attributes. The star is the
// one control the header draws itself, and pressing it is a request the host
// answers: sf-page-header-toggle {on} is cancelable, and a host that wants to
// wait for its own answer cancels it and sets `star` when it knows.
//
// From its component.json (standard simai.smart-component 1.3.8 §3, §4, §8):
// the settings are made by core/js/element-manifest.js, the words are the
// language files', and the old sf-page-header-star follows the toggle as a
// dated alias (aliases.json).








 // Only the words on screen ship in the bundle, English only (owner decision
// C282): Russian and every other language come from a language file. The
// title, settings and events stay in the language files for the Studio and the
// docs (localization study LC-2).


const PageHeaderElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_6__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_1___default()),
  lang: _lang_index_mjs__WEBPACK_IMPORTED_MODULE_8__.files,
  source: 'ru',
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_7__
}); // The header's slots. A child naming one of them is the page's content for it.

const HOST_SLOTS = new Set(['path', 'start', 'media', 'heading', 'actions', 'tabs']); // The nearest box that scrolls the header (overflow auto or scroll on the
// block axis), or null for the window: the work area a sticky header stays
// at the top of.

function scrollerOf(element) {
  for (let node = element.parentElement; node && node !== document.body && node !== document.documentElement; node = node.parentElement) {
    const overflow = getComputedStyle(node).overflowY;
    if (overflow === 'auto' || overflow === 'scroll' || overflow === 'overlay') return node;
  }

  return null;
}

class SfPageHeader extends PageHeaderElement {
  // The base takes the slot children once, when the element connects. A page
  // that adds an action later -- «Создать» once the list has loaded, a button
  // the person's rights allow -- appended it to the host, and it stood after
  // the drawn header, outside it (ui-doc «Рецепты», 2026-11-10). A child that
  // names a slot and arrives after the connection joins that slot, after the
  // ones it already holds, and the header draws again.
  onConnected() {
    super.onConnected?.();
    this.watchScroll();
    if (this._lateSlotObserver) return;
    this._lateSlotObserver = new MutationObserver(() => this.adoptLateSlotChildren());

    this._lateSlotObserver.observe(this, {
      childList: true
    });

    this.adoptLateSlotChildren();
  }

  onDisconnected() {
    this.unwatchScroll();
    this._lateSlotObserver?.disconnect();
    this._lateSlotObserver = null;
    this._rowObserver?.disconnect();
    this._rowObserver = null;
    this._rowObserved = null;
    this._rowMutations?.disconnect();
    this._rowMutations = null;
    this._rowWatched = null;
    super.onDisconnected?.();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback?.(name, oldValue, newValue);
    if (name === 'sticky' && oldValue !== newValue && this._isMounted) this.watchScroll();
  } // ─── sticky (owner decision C161 (7)) ───────────────────────────────────────
  // A sticky header stays at the top of the work area that scrolls it -- the
  // nearest box that scrolls, else the window -- flat while the area is at its
  // top and raised while content runs under it (C20, as sf-header-site): the
  // host says data-scrolled, and the sheet draws the raised shadow and folds
  // the path away from it. Only a sticky header listens.


  watchScroll() {
    this.unwatchScroll();

    if (!this.sticky || typeof globalThis.addEventListener !== 'function') {
      this.sfHostState('data-scrolled', false);
      return;
    }

    this._scroller = scrollerOf(this);

    this._onScroll ??= () => {
      if (this._scrollFrame) return;
      this._scrollFrame = globalThis.requestAnimationFrame?.(() => {
        this._scrollFrame = 0;
        this.syncScrolled();
      }) ?? 0;
      if (!this._scrollFrame) this.syncScrolled();
    };

    (this._scroller || globalThis).addEventListener('scroll', this._onScroll, {
      passive: true
    });
    this._watchingScroll = true;
    this.syncScrolled();
  }

  unwatchScroll() {
    if (this._watchingScroll) (this._scroller || globalThis).removeEventListener?.('scroll', this._onScroll);
    this._watchingScroll = false;
    this._scroller = null;
    if (this._scrollFrame) globalThis.cancelAnimationFrame?.(this._scrollFrame);
    this._scrollFrame = 0;
  } // Content is under the header when its area has scrolled and the header
  // stands stuck at the area's top edge.


  syncScrolled() {
    const header = this.querySelector(':scope > .sf-page-header');
    const scroller = this._scroller;
    const scrolled = scroller ? scroller.scrollTop : globalThis.scrollY ?? 0;
    const edge = scroller ? scroller.getBoundingClientRect().top + (parseFloat(getComputedStyle(scroller).borderTopWidth) || 0) : 0; // Stuck: at the edge, not above it (a header whose column ended has
    // scrolled away with it, and nothing runs under it).

    this.sfHostState('data-scrolled', Boolean(header) && scrolled > 0 && Math.abs(header.getBoundingClientRect().top - edge) <= 1);
  } // ─── «Ещё» (owner decision C155 (7), C161 (4)) ─────────────────────────────
  // overflow="more" (the default): the actions stay on one row; what does not
  // fit leaves for ⋯ at its end -- from the end, by the actions' priority
  // where the page gives one, the main action (the filled one), a pressed
  // toggle and priority="pin" never. ⋯ lists them with their icons and words
  // and presses the action itself. overflow="wrap" keeps the former row that
  // wraps onto further rows (OV-2). On a narrow line (below the g6 step of the
  // line's own width, C181 (2); the sheet says --sf-page-header--fold: 1) the
  // head folds as C155 (7) and C161 (4) say for a phone: the actions that must
  // stay stay and every other one is in ⋯, whatever room is left (1.8.0).


  get overflowMore() {
    return this.getAttribute('overflow') !== 'wrap';
  }

  afterRender(changed) {
    const result = super.afterRender?.(changed);
    this.observeActionRow();
    this.layoutActions();
    return result;
  }

  actionRow() {
    return this.querySelector(':scope > .sf-page-header > .sf-page-header-line > .sf-page-header-actions');
  }

  actionItems(row = this.actionRow()) {
    return row ? [...row.children].filter(child => !child.classList.contains('sf-page-header-more')) : [];
  } // The line, the title and every action are watched: a sheet or a face
  // arriving later widens an action or the heading without resizing the line
  // (1.7.0: the title too; a heading that took its face late left a phone's
  // row laid for the wider fallback, on a line of its own). The observer's
  // callback runs after layout and before paint, so the row is never drawn
  // whole first.
  //
  // An action is watched by the box it draws, and that box is replaced when
  // the action's own code comes: sf-button draws a new <button> in place of
  // its printed one. The row's children and their markup are watched too
  // (1.8.0): the new box is observed and the row laid again at once. Before,
  // a printed head adopted by the code was laid while its buttons were
  // pictures held out of view (every width 0, everything fits) and never
  // again: on a phone path-and-action stood 116 high with both actions under
  // the heading, where its rule lays «Создать» and ⋯ beside it (68). A toggle
  // pressed or a look changed moves an action in or out of what must stay.


  observeActionRow() {
    const row = this.actionRow();

    if (!row || typeof ResizeObserver === 'undefined') {
      this._rowObserver?.disconnect();
      this._rowObserved = null;
      this._rowMutations?.disconnect();
      this._rowWatched = null;
      return;
    }

    this._rowObserver ??= new ResizeObserver(() => this.layoutActions());

    if (typeof MutationObserver !== 'undefined' && this._rowWatched !== row) {
      this._rowMutations ??= new MutationObserver(() => {
        if (!this.actionRow()) return;
        this.observeActionRow();
        this.layoutActions();
      });

      this._rowMutations.disconnect();

      this._rowMutations.observe(row, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['appearance', 'variant', 'pressed', 'aria-pressed', 'priority']
      });

      this._rowWatched = row;
    } // overflow="wrap" watches the line alone: the star follows its wrap.


    const title = row.parentElement.querySelector(':scope > .sf-page-header-title');
    const boxes = [row.parentElement, title, ...(this.overflowMore ? this.actionItems(row) : []).map(item => {
      let box = item;

      while (box && getComputedStyle(box).display === 'contents') box = box.firstElementChild;

      return box;
    })].filter(Boolean);
    if (this._rowObserved && boxes.length === this._rowObserved.length && boxes.every((box, at) => box === this._rowObserved[at])) return;

    this._rowObserver.disconnect();

    for (const box of boxes) this._rowObserver.observe(box);

    this._rowObserved = boxes;
  } // The room the actions have beside the title: the line less what stands
  // before them -- the start slot and the title at the width the line's wrap
  // gives it (its words, no wider than the g0 step). When the actions that
  // must stay do not fit there, the row takes a line of its own, as wide as
  // the line.


  roomBesideTitle(line, row) {
    const style = getComputedStyle(line);
    const gap = parseFloat(style.columnGap) || 0;
    let room = line.getBoundingClientRect().width - (parseFloat(style.paddingInlineStart) || 0) - (parseFloat(style.paddingInlineEnd) || 0);

    for (const child of line.children) {
      if (child === row) continue;

      if (child.classList.contains('sf-page-header-title')) {
        // With a description (1.10.0) the heading and its line stand in a
        // column (sf-page-header-name) that gives way as the heading does;
        // its words are the wider of the two lines.
        const heading = child.querySelector(':scope > .sf-page-header-heading, :scope > .sf-page-header-name');
        const titleGap = parseFloat(getComputedStyle(child).columnGap) || 0; // The star is counted at the actions' rung, the size it takes when
        // the actions keep the line beside it (C103): the room is the same
        // whichever size it has now, so the row never moves for the star.

        const parts = [...child.children].filter(part => part !== heading).map(part => part.classList.contains('sf-page-header-star') ? Math.max((0,_core_js_overflow_row_js__WEBPACK_IMPORTED_MODULE_4__.drawnBox)(part).width, this.actionsRungSide(row)) : (0,_core_js_overflow_row_js__WEBPACK_IMPORTED_MODULE_4__.drawnBox)(part).width);
        const named = heading?.classList.contains('sf-page-header-name') ? Math.max(0, ...[...heading.children].map(line => line.scrollWidth)) : heading?.scrollWidth;
        const words = (named || 0) + parts.reduce((sum, width) => sum + width + titleGap, 0);
        const basis = parseFloat(getComputedStyle(child).flexBasis);
        room -= Math.min(words, Number.isFinite(basis) ? basis : words) + gap;
      } else {
        room -= (0,_core_js_overflow_row_js__WEBPACK_IMPORTED_MODULE_4__.drawnBox)(child).width + gap;
      }
    }

    return room;
  }

  layoutActions() {
    this.placeActions();
    this.syncStarRung();
    this.relayWhenSheetArrives();
  } // A row laid before the header's own sheet applied read no fold and no
  // title basis; the sheet's arrival need not resize anything the observers
  // watch, so the row is laid again once the sheet is in (its title rule:
  // flex-basis var(--sf-g0), never auto), checked once a frame, for a few
  // seconds at most (1.8.0: 1 load in 16 of a 435 px column was left with
  // every action in view where its rule folds it).


  relayWhenSheetArrives() {
    const title = this.querySelector(':scope > .sf-page-header > .sf-page-header-line > .sf-page-header-title');
    if (!title || this._sheetWait || getComputedStyle(title).flexBasis !== 'auto' || typeof requestAnimationFrame !== 'function') return;
    const until = performance.now() + 5000;

    const check = () => {
      const now = this.querySelector(':scope > .sf-page-header > .sf-page-header-line > .sf-page-header-title');

      if (!this.isConnected || !now) {
        this._sheetWait = 0;
        return;
      }

      if (getComputedStyle(now).flexBasis !== 'auto') {
        this._sheetWait = 0;
        this.layoutActions();
        return;
      }

      this._sheetWait = performance.now() < until ? requestAnimationFrame(check) : 0;
    };

    this._sheetWait = requestAnimationFrame(check);
  } // The side of the actions' controls: the drawn height of the first one
  // (an icon button on that rung is as wide as it is tall).


  actionsRungSide(row = this.actionRow()) {
    const first = row ? this.actionItems(row).find(item => !item.classList.contains('sf-page-header-out')) : null;
    return first ? (0,_core_js_overflow_row_js__WEBPACK_IMPORTED_MODULE_4__.drawnBox)((0,_core_js_overflow_row_js__WEBPACK_IMPORTED_MODULE_4__.controlOf)(first)).height : 0;
  } // The star stands on the rung of the controls in its row (owner decision
  // C103: one row, one rung): the actions' size while they keep the line
  // beside the title, else the start slot's control («назад», a phone's menu
  // button) beside it, else the half step it has alone with the heading
  // (32). A phone's actions on a line of their own under the heading leave
  // the star at the half step. Whether the actions keep the line is the
  // line's own arithmetic, not where they stand now: the room beside the
  // title with the star at the actions' rung (roomBesideTitle) against the
  // row's width. It does not depend on the star's size, so a star that grows
  // never moves the row and never swings back.


  syncStarRung() {
    const line = this.querySelector(':scope > .sf-page-header > .sf-page-header-line');
    const star = line?.querySelector(':scope > .sf-page-header-title > .sf-page-header-star');
    if (!star) return;
    const title = star.parentElement;
    const row = this.actionRow();

    const sizeOf = element => element?.getAttribute('size') || '1';

    const first = row ? this.actionItems(row).find(item => !item.classList.contains('sf-page-header-out')) : null;
    const start = [...line.children].find(child => child !== title && child !== row && child.nodeType === 1); // Not laid yet: the line before its sheet, an action before its code.

    if (getComputedStyle(line).display !== 'flex' || first && !(0,_core_js_overflow_row_js__WEBPACK_IMPORTED_MODULE_4__.drawnBox)((0,_core_js_overflow_row_js__WEBPACK_IMPORTED_MODULE_4__.controlOf)(first)).height) return;
    let want = '1/2';

    if (first) {
      // The line's wrap has no tolerance (placeActions takes the room a
      // pixel short); the row's drawn width with what left for ⋯ out.
      if (this.roomBesideTitle(line, row) - 1 >= row.getBoundingClientRect().width) want = sizeOf(first);
    } else if (start) {
      const box = title.getBoundingClientRect();
      const drawn = (0,_core_js_overflow_row_js__WEBPACK_IMPORTED_MODULE_4__.drawnBox)((0,_core_js_overflow_row_js__WEBPACK_IMPORTED_MODULE_4__.controlOf)(start) || start);
      const middle = (drawn.top + drawn.bottom) / 2;
      if (drawn.height > 0 && middle > box.top && middle < box.bottom) want = sizeOf(start);
    }

    if (want === (star.getAttribute('size') || '1/2')) return;
    this._starRung = want;
    star.setAttribute('size', want);
  }

  placeActions() {
    const row = this.actionRow();
    const more = row?.querySelector(':scope > .sf-page-header-more');
    if (!row || !more) return;
    const items = this.actionItems(row);

    if (!this.overflowMore) {
      for (const item of [...items, more]) item.classList.remove('sf-page-header-out', 'sf-page-header-pin');

      return;
    }

    const units = items.map(element => {
      const {
        rank,
        pin
      } = (0,_core_js_overflow_row_js__WEBPACK_IMPORTED_MODULE_4__.readPriority)(element.getAttribute('priority'));
      return {
        element,
        rank,
        pin: pin || (0,_core_js_overflow_row_js__WEBPACK_IMPORTED_MODULE_4__.isMainAction)(element) || (0,_core_js_overflow_row_js__WEBPACK_IMPORTED_MODULE_4__.isPressed)(element),
        group: 0
      };
    }); // The ones that must stay are marked (sf-page-header-pin): a printed
    // head folds on a narrow line by the same mark before its code comes.

    for (const unit of units) unit.element.classList.toggle('sf-page-header-pin', unit.pin);

    const line = row.parentElement;

    if (getComputedStyle(row).getPropertyValue('--sf-page-header--fold').trim() === '1') {
      const out = [];
      units.forEach((unit, at) => {
        unit.element.classList.toggle('sf-page-header-out', !unit.pin);
        if (!unit.pin) out.push(at);
      });
      more.classList.toggle('sf-page-header-out', !out.length);
      this.finishRow(row, more, out);
      return;
    } // The line's wrap has no tolerance: a row half a pixel over the room
    // beside the title moves to a line of its own, so the room is taken a
    // pixel short.


    let laid = (0,_core_js_overflow_row_js__WEBPACK_IMPORTED_MODULE_4__.layoutActionRow)({
      row,
      units,
      more,
      outClass: 'sf-page-header-out',
      room: this.roomBesideTitle(line, row) - 1
    }); // The ones that must stay do not fit beside the title: the row takes a
    // line of its own (the line wraps it there), as wide as the line.

    if (!laid.fits) laid = (0,_core_js_overflow_row_js__WEBPACK_IMPORTED_MODULE_4__.layoutActionRow)({
      row,
      units,
      more,
      outClass: 'sf-page-header-out',
      room: (0,_core_js_overflow_row_js__WEBPACK_IMPORTED_MODULE_4__.rowRoom)(line)
    });
    this.finishRow(row, more, laid.out);
  }

  finishRow(row, more, out) {
    row.setAttribute('data-sf-row-laid', '');
    this._actionsOut = out;
    more.setAttribute('aria-label', this.sfWord('more'));
    more.setAttribute('title', this.sfWord('more'));
  } // ⋯ pressed: the actions that left, as menu rows; a row presses its action.


  openActionsMore(event) {
    const anchor = (0,_core_js_overflow_row_js__WEBPACK_IMPORTED_MODULE_4__.controlOf)(event.currentTarget);
    const items = this.actionItems();
    const entries = (this._actionsOut || []).map(at => (0,_core_js_overflow_row_js__WEBPACK_IMPORTED_MODULE_4__.actionEntry)(items[at], at)).filter(entry => entry.text);
    (0,_core_js_overflow_row_js__WEBPACK_IMPORTED_MODULE_4__.openRowMenu)(this, {
      anchor,
      entries,
      label: this.sfWord('more'),
      size: (items[0]?.getAttribute('size') || '1') === '1/2' ? '1/2' : '1',
      select: id => (0,_core_js_overflow_row_js__WEBPACK_IMPORTED_MODULE_4__.controlOf)(this.actionItems()[Number(id)])?.click()
    });
  }

  adoptLateSlotChildren() {
    if (!this._slotTemplatesCaptured) return;
    const late = [...this.children].filter(child => HOST_SLOTS.has(child.getAttribute('slot')) && child.localName !== 'template');
    if (!late.length) return;

    for (const child of late) {
      const name = child.getAttribute('slot');
      const nodes = this._liveSlotNodes.get(name) || [];
      nodes.push(child);

      this._liveSlotNodes.set(name, nodes); // The page's content: a size it gives stays the page's (density, C22; it
      // follows the region like any size since C79).


      (0,_core_js_density__WEBPACK_IMPORTED_MODULE_3__.noteAuthored)([child]);
      child.remove();
    }

    this.requestComponentUpdate('slot-change');
  } // star is optional (§4.2): absent draws no star, so it reads undefined
  // rather than the boolean's false.


  get star() {
    return this.hasAttribute('star') ? super.star : undefined;
  }

  set star(value) {
    if (value === undefined || value === null) this.removeAttribute('star');else this.setAttribute('star', value ? 'true' : 'false');
  } // VS-10 (views study, owner decision C393): where the Framework's icon
  // button has the toggle look (sf-button-icon appearance="toggle",
  // component.icon-buttons 1.20.0), the star is that toggle -- off a quiet
  // ghost, on the soft primary plate with its ring, the glyph kept outline,
  // aria-pressed its state and one name, «В избранное», so the state is said
  // once (C12). Where it has not, the star keeps the filled glyph in the
  // favourite's colour and says its state by its name (1.2.2). Checked on the
  // element sf-button-icon defines: until it is defined the star draws the
  // former look and is drawn again once it is.


  starLook() {
    const Button = globalThis.customElements?.get?.('sf-button-icon');

    if (!Button) {
      if (!this._starToggleWait && globalThis.customElements?.whenDefined) {
        this._starToggleWait = globalThis.customElements.whenDefined('sf-button-icon').then(() => this.requestComponentUpdate('star-look'));
      }

      return null;
    }

    const values = Button.sfInterface?.settings?.appearance?.values;
    return Array.isArray(values) && values.includes('toggle') ? 'toggle' : null;
  } // The template's press: the request toggle {on}; not cancelled, the header
  // writes the star itself.


  toggleStar() {
    const on = this.star !== true;
    if (this.sfEmit('toggle', {
      on
    }, {
      cancelable: true
    })) this.star = on;
  } // The actions in the order the header places them (owner decision C161 (3)):
  // the main action -- the filled sf-button -- last, at the end of the line,
  // the outlined and quiet ones before it in the page's order. The nodes are
  // the page's and are only placed, so the reading and Tab order follow what
  // is seen. Windows and panels keep their own order (C157 (3), C159 (4)).
  // ⋯ «Ещё» stands between the two, so the main action ends the line on a
  // phone too (C161 (3), (4)).


  orderedActions() {
    const nodes = [].concat(this.getSlotContent('actions') || []).filter(node => node && node !== lit__WEBPACK_IMPORTED_MODULE_0__.nothing);
    const main = nodes.filter(node => node.nodeType === 1 && (0,_core_js_overflow_row_js__WEBPACK_IMPORTED_MODULE_4__.isMainAction)(node));
    return {
      rest: nodes.filter(node => !main.includes(node)),
      main
    };
  } // ⋯ takes the look of the actions it stands for: outlined when the first
  // action that may leave is outlined (the prototype's «Ещё» beside «Импорт»,
  // «Экспорт»), else the row's quiet ghost on the surface (C155 (2)).


  actionMoreLook() {
    const first = this.orderedActions().rest.find(node => node.nodeType === 1);
    return first?.getAttribute('appearance') === 'outline' ? {
      appearance: 'outline',
      scheme: first.getAttribute('scheme') || ''
    } : {
      appearance: 'ghost',
      scheme: 'on-surface'
    };
  }

  templateContext() {
    return this.createTemplateContext({ ...this.getPropsContext(),
      component: this,
      sticky: this.sticky,
      actions: () => this.orderedActions(),
      heading: this.heading,
      headingLevel: this.headingLevelValue(),
      description: this.description || '',
      count: this.count,
      level: this.level,
      star: this.star,
      starLook: this.star === undefined ? null : this.starLook(),
      rootClass: this.getRootClass(),
      overflow: this.overflowMore ? 'more' : 'wrap',
      moreSize: this.actionMoreSize(),
      starSize: this._starRung ?? this.starSize(),
      moreLook: this.actionMoreLook(),
      text: key => this.sfWord(key),
      hostSlot: name => this.getSlotContent(name),
      hasHostSlot: name => this.hasSlotContent(name)
    });
  } // ⋯ stands on the actions' rung: the size the page gave its first action.


  actionMoreSize() {
    const nodes = this._liveSlotNodes?.get?.('actions') || [];
    const first = nodes.find(node => node.nodeType === 1);
    return first?.getAttribute('size') || '1';
  } // The star's rung before the line is laid (syncStarRung then follows the
  // line): the size the page gave its first action (1 when it gave none), as
  // ⋯ takes; with no actions the start slot control's size; alone with the
  // heading the half step (32).


  starSize() {
    for (const name of ['actions', 'start']) {
      const first = (this._liveSlotNodes?.get?.(name) || []).find(node => node.nodeType === 1);
      if (first) return first.getAttribute('size') || '1';
    }

    return '1/2';
  } // The heading element's level (1.10.0): 1 to 6, 1 when the attribute says
  // anything else. Only the tag changes; the look stays the fourth heading
  // step. A head inside a page that has its own h1 (a conversation embedded
  // in a page) says 2.


  headingLevelValue() {
    const value = Number(this.getAttribute('heading-level'));
    return Number.isInteger(value) && value >= 1 && value <= 6 ? value : 1;
  } // The media slot (1.10.0): an avatar before the title stands on the line's
  // rung, as the star does before the line is laid: the size the page gave
  // its first action, else its start control's, else 1 beside a description
  // (the heading and its line are that tall) and the half step alone with
  // the heading. A size the page writes itself stays; the header writes only
  // a size it chose (data-sf-page-header-size marks it, so it follows a rung
  // that changes).


  sizeMedia() {
    const media = (this._liveSlotNodes?.get?.('media') || []).filter(node => node.nodeType === 1);
    if (!media.length) return;
    let rung = '';

    for (const name of ['actions', 'start']) {
      const first = (this._liveSlotNodes?.get?.(name) || []).find(node => node.nodeType === 1);

      if (first) {
        rung = first.getAttribute('size') || '1';
        break;
      }
    }

    if (!rung) rung = this.description ? '1' : '1/2';

    for (const node of media) {
      if (node.hasAttribute('size') && !node.hasAttribute('data-sf-page-header-size')) continue;
      if (node.getAttribute('size') !== rung) node.setAttribute('size', rung);
      node.setAttribute('data-sf-page-header-size', '');
    }
  }

  template() {
    this.sizeMedia();
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_5__.renderPageHeaderTemplate)(this.templateContext());
  }

}

SfPageHeader.define('sf-header-page');

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "7fc7df212ec0"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderPageHeaderTemplate: () => (/* binding */ renderPageHeaderTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var lit_static_html_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("ee5035470810");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);

 // Framework utilities and the header's own sheet (scss/: the gaps and colours
// are its public variables): a column for the path above the line, and a line
// holding the title -- the heading, its count, the install mark and the star --
// then the actions at the end. The heading is the fourth heading step, the size
// the admin pages have always titled themselves at. The title is a group of its
// own so that a long heading closes down to its ellipsis beside the actions
// instead of taking a line and pushing the count and the actions under it
// (HD-12); the count and the marks stay right after the words. The actions
// come in the header's order, the main one last (C161 (3)); the tabs slot
// ends the header, its line the header's lower edge (C161 (5)).
//
// The head of a conversation (C161, 1.10.0) adds three optional parts, each
// drawn only when the page gives it, so a head without them is the markup it
// always was: the media slot (an avatar) first in the title, so that it moves
// with the name when a narrow line wraps the title under «назад», a
// heading slot (a control, such as a picker of whom to talk to) inside the
// heading element in place of the heading's words, and a description line
// under the heading (whether the person is online). heading-level changes the
// heading element's tag only; its look stays the fourth heading step.

function renderPageHeaderTemplate(context) {
  const {
    component,
    heading,
    count,
    level,
    star,
    text,
    hostSlot,
    hasHostSlot,
    rootClass
  } = context;
  const headingLevel = context.headingLevel || 1;
  const tag = (0,lit_static_html_js__WEBPACK_IMPORTED_MODULE_1__.unsafeStatic)(`h${headingLevel}`);
  const slotted = hasHostSlot('heading');
  const headingBody = slotted ? hostSlot('heading') : heading;
  const headingClass = slotted ? 'sf-page-header-heading sf-page-header-heading--slot sf-h-4 m-0 min-w-0 flex items-cross-center' : 'sf-page-header-heading sf-h-4 m-0 min-w-0 truncate';
  const headingElement = headingLevel === 1 && !slotted ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<h1 class="sf-page-header-heading sf-h-4 m-0 min-w-0 truncate">${heading}</h1>` : (0,lit_static_html_js__WEBPACK_IMPORTED_MODULE_1__.html)`<${tag} class=${headingClass}>${headingBody}</${tag}>`;
  const description = context.description;
  const name = description ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-page-header-name flex flex-col min-w-0">${headingElement}<p class="sf-page-header-description m-0 min-w-0 truncate">${description}</p></div>` : headingElement;
  const classes = ['sf-page-header', 'flex', 'flex-col', 'min-w-0', context.expressive ? 'sf-page-header--expressive' : '', context.sticky ? 'sf-page-header--sticky' : '', rootClass].filter(Boolean).join(' ');
  const on = star === true;
  const actions = context.actions ? context.actions() : {
    rest: hostSlot('actions'),
    main: lit__WEBPACK_IMPORTED_MODULE_0__.nothing
  };
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<header class=${classes} style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
    ${hasHostSlot('path') ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-page-header-path flex items-cross-center min-w-0">${hostSlot('path')}</div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    <div class="sf-page-header-line flex items-cross-center flex-wrap min-w-0">
      ${hasHostSlot('start') ? hostSlot('start') : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      <div class="sf-page-header-title flex items-cross-center min-w-0">
        ${hasHostSlot('media') ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-page-header-media flex items-cross-center">${hostSlot('media')}</div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}${name}
        ${count !== '' && count !== null && count !== undefined ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-badge appearance="tonal" scheme="neutral" size="1/2" text=${String(count)}></sf-badge>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        ${level === 'install' ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-badge appearance="outline" scheme="tertiary" size="1/2" text=${text('all-sites')}></sf-badge>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        ${star === true || star === false // The star's name says what pressing it does («В избранное», «Убрать
  // из избранного»), so it says the state too and carries no
  // aria-pressed (1.2.2, rule C12): both at once read «Убрать из
  // избранного, нажата». The filled glyph in its own colour shows it.
  // It stands on its row's rung (C103, 1.7.0): the actions' size while
  // they keep the line beside it, else the start control's, else the
  // half step (index.js syncStarRung).
  ? context.starLook // The toggle look (VS-10, C393): one name and aria-pressed, the
  // state on the plate, the glyph outline. The look is the one
  // index.js starLook found the icon button to declare.
  ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button-icon size=${context.starSize || '1/2'} appearance=${context.starLook}
                class=${on ? 'sf-page-header-star sf-page-header-star--toggle sf-page-header-star--on' : 'sf-page-header-star sf-page-header-star--toggle'}
                icon="star"
                pressed=${on ? 'true' : 'false'}
                aria-label=${text('star')}
                title=${text('star')}
                @click=${() => component.toggleStar()}></sf-button-icon>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button-icon size=${context.starSize || '1/2'} appearance="ghost" scheme="on-surface"
                class=${on ? 'sf-page-header-star sf-page-header-star--on' : 'sf-page-header-star'}
                icon="star"
                ?filled=${on}
                aria-label=${on ? text('unstar') : text('star')}
                title=${on ? text('unstar') : text('star')}
                @click=${() => component.toggleStar()}></sf-button-icon>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      </div>
      ${hasHostSlot('actions') // overflow more (owner decision C155 (7), C161 (3), (4)): one row,
  // and ⋯ for what does not fit, right before the main action, which
  // ends the line -- the actions' rung and the look of the actions it
  // stands for (outlined beside outlined ones, else the quiet ghost),
  // «Ещё» its name and tooltip. It is drawn out of the row
  // (sf-page-header-out) until the row is laid out and something left.
  ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class=${context.overflow === 'more' ? 'sf-page-header-actions sf-page-header-actions--more flex items-cross-center' : 'sf-page-header-actions flex items-cross-center'}>${actions.rest}${context.overflow === 'more' ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button-icon class="sf-page-header-more sf-page-header-out" icon="more_horiz" appearance=${context.moreLook.appearance} scheme=${context.moreLook.scheme || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                size=${context.moreSize || '1'} aria-label=${text('more')} title=${text('more')} aria-haspopup="menu"
                @click=${event => component.openActionsMore(event)}></sf-button-icon>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}${actions.main}</div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    </div>
    ${hasHostSlot('tabs') ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-page-header-tabs min-w-0">${hostSlot('tabs')}</div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
  </header>`;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "6c4095b537c9"
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

/***/ "ba5a8db95d92"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   html: () => (/* binding */ u),
/* harmony export */   literal: () => (/* binding */ i),
/* harmony export */   mathml: () => (/* binding */ $),
/* harmony export */   svg: () => (/* binding */ c),
/* harmony export */   unsafeStatic: () => (/* binding */ s),
/* harmony export */   withStatic: () => (/* binding */ n)
/* harmony export */ });
/* harmony import */ var _lit_html_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("f550d360fd36");

/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const a=Symbol.for(""),o=t=>{if(t?.r===a)return t?._$litStatic$},s=t=>({_$litStatic$:t,r:a}),i=(t,...r)=>({_$litStatic$:r.reduce((r,e,a)=>r+(t=>{if(void 0!==t._$litStatic$)return t._$litStatic$;throw Error(`Value passed to 'literal' function must be a 'literal' result: ${t}. Use 'unsafeStatic' to pass non-literal values, but\n            take care to ensure page security.`)})(e)+t[a+1],t[0]),r:a}),l=new Map,n=t=>(r,...e)=>{const a=e.length;let s,i;const n=[],u=[];let c,$=0,f=!1;for(;$<a;){for(c=r[$];$<a&&void 0!==(i=e[$],s=o(i));)c+=s+r[++$],f=!0;$!==a&&u.push(i),n.push(c),$++}if($===a&&n.push(r[a]),f){const t=n.join("$$lit$$");void 0===(r=l.get(t))&&(n.raw=n,l.set(t,r=n)),e=u}return t(r,...e)},u=n(_lit_html_js__WEBPACK_IMPORTED_MODULE_0__.html),c=n(_lit_html_js__WEBPACK_IMPORTED_MODULE_0__.svg),$=n(_lit_html_js__WEBPACK_IMPORTED_MODULE_0__.mathml);
//# sourceMappingURL=static.js.map


/***/ },

/***/ "ee5035470810"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   html: () => (/* reexport safe */ lit_html_static_js__WEBPACK_IMPORTED_MODULE_0__.html),
/* harmony export */   literal: () => (/* reexport safe */ lit_html_static_js__WEBPACK_IMPORTED_MODULE_0__.literal),
/* harmony export */   mathml: () => (/* reexport safe */ lit_html_static_js__WEBPACK_IMPORTED_MODULE_0__.mathml),
/* harmony export */   svg: () => (/* reexport safe */ lit_html_static_js__WEBPACK_IMPORTED_MODULE_0__.svg),
/* harmony export */   unsafeStatic: () => (/* reexport safe */ lit_html_static_js__WEBPACK_IMPORTED_MODULE_0__.unsafeStatic),
/* harmony export */   withStatic: () => (/* reexport safe */ lit_html_static_js__WEBPACK_IMPORTED_MODULE_0__.withStatic)
/* harmony export */ });
/* harmony import */ var lit_html_static_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ba5a8db95d92");

//# sourceMappingURL=static-html.js.map


/***/ },

/***/ "d1d35d196e05"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   files: () => (/* binding */ files)
/* harmony export */ });
/* harmony import */ var _en_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("e4e3e149eb84");
// Written by scripts/build-language-packs.mjs from src/core/lang/built-in.json
// (owner decision C282); do not edit. The words this bundle carries: the
// built-in languages' (en); every other language comes from
// a language file (core/lang/<code>.js or its parts).


const files = { en: { runtime: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime } };

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ en: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime });


/***/ },

/***/ "b8705148b32a"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-header-page for the shim (stands/18-aliases-ci/alias.mjs, standard §16 item 20). mode: same-detail (the shim sends the new and the old name), split / detail-adds (a detail adapter, refused by the shim), attribute-and-property, method, property, manifest-only (the DOM name does not change), host-attribute (no shim), retired.","component":"sf-header-page","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"sf-page-header-star","to":"sf-page-header-toggle","kind":"event","component":"sf-header-page","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","cancelable":true,"manifest":{"from":"sf-page-header-star","to":"sf-page-header-toggle"},"section":"§8, vocabulary 1.1.5 §5 toggle; stand 24"},{"from":"sf-page-header","to":"sf-header-page","kind":"tag","component":"sf-header-page","since":"2026-11-03","remove_after":"2027-01-01","section":"rename plan R0 (ui-control RENAME-PLAN-2026-11-03), naming decision 2026-11-02","note":"the element is sf-header-page; sf-page-header is a subclass defined beside it until the date"},{"from":"sf-page-header-toggle","to":"sf-header-page-toggle","kind":"event","component":"sf-header-page","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"}]}');

/***/ },

/***/ "96b1e08482fd"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.header-page","tag":"sf-header-page","version":"1.11.2","kind":"leaf","settings":{"heading":{"type":"string","default":""},"heading-level":{"type":"number","integer":true,"min":1,"max":6,"default":1},"description":{"type":"string","default":""},"count":{"type":"string","default":""},"level":{"type":"enum","values":["site","install"],"default":"site"},"expressive":{"type":"boolean","default":false},"overflow":{"type":"enum","values":["more","wrap"],"default":"more"},"sticky":{"type":"boolean","default":false},"star":{"type":"boolean","optional":true}},"values":{},"events":{"toggle":{"carries":{"on":"boolean"},"cancelable":true}},"actions":{},"host-states":{"data-scrolled":"boolean"},"css-variables":{"--sf-page-header-gap":{"type":"length","state":"default"},"--sf-page-header-line-gap":{"type":"length","state":"default"},"--sf-page-header-actions-gap":{"type":"length","state":"default"},"--sf-page-header-heading-color":{"type":"color","state":"default"},"--sf-page-header-star-color":{"type":"color","state":"on"}}}');

/***/ },

/***/ "e4e3e149eb84"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Page header","runtime":{"all-sites":"for all sites","more":"More","star":"Add to favourites","unstar":"Remove from favourites"}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("fb52758a61f1");
/******/
/******/ })()
;