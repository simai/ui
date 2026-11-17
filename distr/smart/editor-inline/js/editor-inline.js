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

/***/ "b77e802bd89d"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_composition_inline_editor_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("f0e430451ca1");
/* harmony import */ var _core_js_composition_manifest_host_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("6b629b4c1b7e");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("243fec56a554");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("834c8c68675a");
/* harmony import */ var _lang_index_mjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("504b63c18e7b");
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("2610c6032931");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_composition_inline_editor_mjs__WEBPACK_IMPORTED_MODULE_0__, _core_js_composition_manifest_host_mjs__WEBPACK_IMPORTED_MODULE_1__]);
([_core_js_composition_inline_editor_mjs__WEBPACK_IMPORTED_MODULE_0__, _core_js_composition_manifest_host_mjs__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
// Smart entry for the inline text editor. The loader fetches this bundle when
// the page has an <sf-editor-inline> element; SF.Composition.startInlineEdit
// in Core delegates here once it is loaded.
//
// From its component.json (standard simai.smart-component 1.3.8 §3, §4, §8):
// the carrier is defined over the class core/js/composition/manifest-host.mjs
// makes from it; the edited element sends sf-inline-editor-input, -change and
// -cancel {id, content}, the former sf-inline-edit-* following until
// 2026-12-01.




 // Only the words on screen ship in the bundle, English only (owner decision
// C282): Russian and every other language come from a language file. The
// title, settings and events stay in the language files for the Studio and the
// docs (localization study LC-2).

 // The words the module does not carry itself (the link window's hint and
// reasons, «Ещё», the new-block label; owner decision C172) are the
// language files'.

(0,_core_js_composition_inline_editor_mjs__WEBPACK_IMPORTED_MODULE_0__.useInlineEditorWords)(_lang_index_mjs__WEBPACK_IMPORTED_MODULE_4__.files);
globalThis.SF = globalThis.SF || {};
globalThis.SF.InlineEditor = Object.freeze({
  INLINE_ENTER_MODES: _core_js_composition_inline_editor_mjs__WEBPACK_IMPORTED_MODULE_0__.INLINE_ENTER_MODES,
  INLINE_EVENTS: _core_js_composition_inline_editor_mjs__WEBPACK_IMPORTED_MODULE_0__.INLINE_EVENTS,
  INLINE_EVENTS_FORMER_TAG: _core_js_composition_inline_editor_mjs__WEBPACK_IMPORTED_MODULE_0__.INLINE_EVENTS_FORMER_TAG,
  INLINE_EVENTS_LEGACY: _core_js_composition_inline_editor_mjs__WEBPACK_IMPORTED_MODULE_0__.INLINE_EVENTS_LEGACY,
  INLINE_TOOLBAR_MODES: _core_js_composition_inline_editor_mjs__WEBPACK_IMPORTED_MODULE_0__.INLINE_TOOLBAR_MODES,
  linkProblem: _core_js_composition_inline_editor_mjs__WEBPACK_IMPORTED_MODULE_0__.linkProblem,
  readInlineDom: _core_js_composition_inline_editor_mjs__WEBPACK_IMPORTED_MODULE_0__.readInlineDom,
  renderInlineDom: _core_js_composition_inline_editor_mjs__WEBPACK_IMPORTED_MODULE_0__.renderInlineDom,
  startInlineEdit: _core_js_composition_inline_editor_mjs__WEBPACK_IMPORTED_MODULE_0__.startInlineEdit,
  textOffset: _core_js_composition_inline_editor_mjs__WEBPACK_IMPORTED_MODULE_0__.textOffset
}); // edit(element, options) takes its fields in order; the runtime gives it the
// object form of §4.4 as well: edit({element, options}).
// An editor page draws parameter forms: the composition editor words, no
// longer part of every page's core (localization study LC-1), are fetched
// once now, so SF.Composition.editorFieldMessages() answers in full.

globalThis.SF.Composition?.loadEditorWords?.();
(0,_core_js_composition_inline_editor_mjs__WEBPACK_IMPORTED_MODULE_0__.defineInlineEditor)(globalThis.customElements, {
  base: (0,_core_js_composition_manifest_host_mjs__WEBPACK_IMPORTED_MODULE_1__.manifestHost)(_component_json__WEBPACK_IMPORTED_MODULE_2__, {
    lang: _lang_index_mjs__WEBPACK_IMPORTED_MODULE_4__.files,
    source: 'ru',
    aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_3__,
    positional: ['edit']
  })
});
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "2610c6032931"
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

/***/ "43090d1c8307"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("page-language", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("page-language", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "f0e430451ca1"
(__webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   INLINE_ENTER_MODES: () => (/* binding */ INLINE_ENTER_MODES),
/* harmony export */   INLINE_EVENTS: () => (/* binding */ INLINE_EVENTS),
/* harmony export */   INLINE_EVENTS_FORMER_TAG: () => (/* binding */ INLINE_EVENTS_FORMER_TAG),
/* harmony export */   INLINE_EVENTS_LEGACY: () => (/* binding */ INLINE_EVENTS_LEGACY),
/* harmony export */   INLINE_TOOLBAR_MODES: () => (/* binding */ INLINE_TOOLBAR_MODES),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   defineInlineEditor: () => (/* binding */ defineInlineEditor),
/* harmony export */   linkProblem: () => (/* binding */ linkProblem),
/* harmony export */   readInlineDom: () => (/* binding */ readInlineDom),
/* harmony export */   renderInlineDom: () => (/* binding */ renderInlineDom),
/* harmony export */   startInlineEdit: () => (/* binding */ startInlineEdit),
/* harmony export */   textOffset: () => (/* binding */ textOffset),
/* harmony export */   useInlineEditorWords: () => (/* binding */ useInlineEditorWords),
/* harmony export */   wordAround: () => (/* binding */ wordAround)
/* harmony export */ });
/* harmony import */ var _page_language_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("43090d1c8307");
/* harmony import */ var _overflow_row_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("2db3a835ac11");
/* harmony import */ var _roving_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("557c99eb8f3a");
/* harmony import */ var _tag_aliases_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("4a85acfb05c1");
/* harmony import */ var _inline_model_mjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("e66d878fb4f8");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_page_language_js__WEBPACK_IMPORTED_MODULE_0__, _tag_aliases_js__WEBPACK_IMPORTED_MODULE_3__]);
([_page_language_js__WEBPACK_IMPORTED_MODULE_0__, _tag_aliases_js__WEBPACK_IMPORTED_MODULE_3__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);






// In-place editor for the Composition inline content model. The host starts
// it on a rendered heading or paragraph element; the editor exposes only
// normalized content (never HTML) through events. Cancel restores the exact
// original DOM; commit restores it too and lets the host re-render the saved
// value, so the canvas always returns to host-rendered HTML.

// The names sf-editor-inline's component.json declares (standard 1.3.8 §8,
// vocabulary 1.1.5): input while the text changes, change when it is
// committed, cancel when it is put back -- {id, content}, data only. The
// edited element is the host's, which carries no shim, so each event is
// followed here by the name it had under the former tag sf-inline-editor
// (the same detail, until 2027-01-01), then by its former name with its
// former detail ({node_id, content}) until 2026-12-01.
const INLINE_EVENTS = Object.freeze({
  input: 'sf-editor-inline-input',
  commit: 'sf-editor-inline-change',
  cancel: 'sf-editor-inline-cancel',
});

const INLINE_EVENTS_FORMER_TAG = Object.freeze({
  input: 'sf-inline-editor-input',
  commit: 'sf-inline-editor-change',
  cancel: 'sf-inline-editor-cancel',
});

const INLINE_EVENTS_LEGACY = Object.freeze({
  input: 'sf-inline-edit-input',
  commit: 'sf-inline-edit-commit',
  cancel: 'sf-inline-edit-cancel',
});

// next: the text after the caret when Enter starts a new block (enter:
// 'new-block', C172 (2)); the former names' details never carry it.
function emitInline(element, key, id, content, next) {
  const detail = content === undefined ? { id } : next === undefined ? { id, content } : { id, content, next };
  const legacy = content === undefined ? { node_id: id } : { node_id: id, content };
  const frozen = Object.freeze(detail);
  element.dispatchEvent(new globalThis.CustomEvent(INLINE_EVENTS[key], { bubbles: true, composed: true, detail: frozen }));
  element.dispatchEvent(new globalThis.CustomEvent(INLINE_EVENTS_FORMER_TAG[key], { bubbles: true, composed: true, detail: frozen }));
  element.dispatchEvent(new globalThis.CustomEvent(INLINE_EVENTS_LEGACY[key], { bubbles: true, composed: true, detail: Object.freeze(legacy) }));
}

const MESSAGES = {
  en: { toolbar: 'Formatting', strong: 'Bold', em: 'Italic', code: 'Code', strike: 'Strikethrough', link: 'Link', url: 'Link address', apply: 'Apply', unlink: 'Remove link', editing: '{label}: editing. Enter saves, Escape cancels.', invalid: 'Invalid link address' },
};
const SHORTCUTS = { strong: 'b', em: 'i', code: 'e' };
// The marks the toolbar offers when the host names none: strike (inline model
// 1.2.0) is read, kept and drawn, and has a button only where a host asks.
const TOOLBAR_MARKS = Object.freeze(['strong', 'em', 'code']);
const SKIP = new Set(['SCRIPT', 'STYLE', 'TEMPLATE', 'HEAD', 'TITLE', 'META', 'LINK', 'IMG', 'SVG', 'OBJECT', 'IFRAME', 'NOSCRIPT']);
const BLOCK = new Set(['P', 'DIV', 'LI', 'UL', 'OL', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'TR', 'TABLE', 'BLOCKQUOTE', 'SECTION', 'ARTICLE']);
// While editing, an atom or an opaque node is one element that is not
// editable inside and carries its entry as JSON here, so reading the DOM back,
// and pasting what the editor copied, return the entry exactly.
const NODE_ATTRIBUTE = 'data-sf-inline-node';
const ATOM_TAGS = new Map(Object.entries(_inline_model_mjs__WEBPACK_IMPORTED_MODULE_4__.INLINE_COMPONENTS).map(([name, entry]) => [entry.tag.toUpperCase(), name]));
const isAtomElement = (node) => node?.nodeType === 1 && node.hasAttribute(NODE_ATTRIBUTE);
// A mark the editor has no element for is drawn as a span carrying its name,
// never as an element of that name, so it survives the DOM read-back.
const MARK_ATTRIBUTE = 'data-sf-inline-mark';
// Editor-copied HTML carries the page's copy token on its wrapper; pasted
// HTML without it loses every data-sf-inline-* attribute first, so another
// page cannot inject entries or marks (2026-11-11 acceptance, L3). The token
// lives on the global, since every bundle carries its own module copy.
const COPY_ATTRIBUTE = 'data-sf-inline-copy';
const COPY_KEY = Symbol.for('simai.composition.inline-copy');
const copyToken = () => {
  if (!globalThis[COPY_KEY]) globalThis[COPY_KEY] = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  return globalThis[COPY_KEY];
};
// The extension keys of a text run, a break or a link (inline model,
// 2026-11-11) ride on a wrapper span (or the <a>) as JSON, so the DOM
// read-back keeps them. Foreign paste loses them with the other
// data-sf-inline-* attributes.
const EXTRA_ATTRIBUTE = 'data-sf-inline-extra';
const readExtra = (node) => {
  const json = node?.nodeType === 1 ? node.getAttribute(EXTRA_ATTRIBUTE) : null;
  if (json === null) return null;
  try {
    const value = JSON.parse(json);
    return value && typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length ? value : null;
  } catch {
    return null;
  }
};
const MARK_TAGS = new Map([['strong', 'strong'], ['em', 'em'], ['code', 'code'], ['strike', 's']]);
// A break the editor drew carries this attribute; any other <br> the browser
// or a paste brings is read as a break too, except the placeholder a browser
// keeps as the last child of an emptied or break-ended line.
const BREAK_ATTRIBUTE = 'data-sf-inline-break';
const isBreakElement = (node) => node?.nodeType === 1 && node.tagName === 'BR' && node.hasAttribute(BREAK_ATTRIBUTE);

/** The entry an atom element holds: its JSON, or for a drawn atom without it, its tag and declared attributes. */
function atomEntry(element) {
  const json = element.getAttribute(NODE_ATTRIBUTE);
  if (json !== null) {
    try {
      const entry = JSON.parse(json);
      // Only atoms and opaque nodes travel this way; text and links are read from the DOM.
      if (entry && typeof entry === 'object' && !Array.isArray(entry) && typeof entry.type === 'string' && entry.type !== 'text' && entry.type !== 'link') return entry;
    } catch { /* not ours: read the element as markup */ }
    return null;
  }
  const name = ATOM_TAGS.get(element.tagName.toUpperCase());
  if (!name) return null;
  const declared = _inline_model_mjs__WEBPACK_IMPORTED_MODULE_4__.INLINE_COMPONENTS[name].props;
  const props = {};
  if (name === 'kbd') props.text = element.textContent.replace(/\s+/gu, ' ').trim();
  else for (const [key, kind] of Object.entries(declared)) {
    if (!element.hasAttribute(key)) continue;
    props[key] = kind === 'boolean' ? true : element.getAttribute(key);
  }
  // An element read back is written under the current names: a dated alias
  // attribute (sf-badge compact) becomes its new prop (icon-only).
  const current = (0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_4__.currentInlineProps)(name, props);
  const entry = { type: 'component', name, ...(Object.keys(current).length ? { props: current } : {}) };
  return (0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_4__.isInlineComponent)(entry) ? entry : null;
}

const format = (template, values) => template.replace(/\{(\w+)\}/gu, (_, key) => String(values[key] ?? ''));
// The words of sf-editor-inline's language files (lang/<locale>.json,
// runtime), given by its bundle (useInlineEditorWords): the words this module
// does not carry in MESSAGES -- the link window's hint and reasons, «Ещё»,
// the new-block label (owner decision C172) -- live only there.
let shippedWords = null;
function useInlineEditorWords(lang) {
  shippedWords = lang && typeof lang === 'object' ? lang : null;
}
const dictionary = () => {
  if (!shippedWords) return MESSAGES;
  const merged = {};
  for (const locale of new Set([...Object.keys(MESSAGES), ...Object.keys(shippedWords)])) merged[locale] = { ...(MESSAGES[locale] || {}), ...(shippedWords[locale]?.runtime || {}) };
  return merged;
};
// Words in the page's language through pageText, as every component takes
// them: the editor read <html lang> alone and offered only English or Russian,
// so SF.language.use() and a product's own dictionary never reached it
// (documentation trial, 2026-10-12).
const words = (node) => {
  const all = dictionary();
  return Object.fromEntries(Object.keys(all.en || MESSAGES.en).map((key) => [key, (0,_page_language_js__WEBPACK_IMPORTED_MODULE_0__.pageText)(all, key, node, 'sf-editor-inline')]));
};

/** Reads inline content from any DOM subtree; foreign markup and styles are dropped. */
function readInlineDom(root, { marks = _inline_model_mjs__WEBPACK_IMPORTED_MODULE_4__.INLINE_MARKS, links = true, collapse = false } = {}) {
  const segments = [];
  const carry = (extra, linkExtra, href) => ({ ...(extra ? { extra } : {}), ...(href && linkExtra ? { linkExtra } : {}) });
  const visit = (node, active, href, extra = null, linkExtra = null) => {
    if (node.nodeType === 3) {
      let text = node.nodeValue.replace(/\u00a0/gu, ' ').replace(/[\r\n\t\f\v]/gu, ' ');
      if (collapse) text = text.replace(/ {2,}/gu, ' ');
      if (text) segments.push({ text, marks: [...active], href, ...carry(extra, linkExtra, href) });
      return;
    }
    if (node.nodeType !== 1 && node.nodeType !== 11) return;
    if (node.nodeType === 1 && node !== root) {
      const entry = atomEntry(node);
      if (entry) {
        // An atom is never inside a link, even when pasted inside an <a>.
        segments.push({ text: _inline_model_mjs__WEBPACK_IMPORTED_MODULE_4__.INLINE_OBJECT, marks: [], href: entry.type === 'component' ? null : href, node: entry, ...(entry.type === 'component' ? {} : carry(null, linkExtra, href)) });
        return;
      }
    }
    if (node.nodeType === 1 && SKIP.has(node.tagName.toUpperCase())) return;
    const tag = node.nodeType === 1 ? node.tagName.toUpperCase() : '';
    const next = new Set(active);
    let nextHref = href;
    if (tag === 'STRONG' || tag === 'B') next.add('strong');
    if (tag === 'EM' || tag === 'I') next.add('em');
    if (tag === 'CODE' || tag === 'KBD' || tag === 'SAMP') next.add('code');
    if (tag === 'S' || tag === 'STRIKE' || tag === 'DEL') next.add('strike');
    // A mark this editor cannot draw rides on its wrapper (renderInlineDom).
    const carried = node.nodeType === 1 ? node.getAttribute(MARK_ATTRIBUTE) : null;
    // Any non-empty name, the inline model's own rule (sortMarks).
    if (carried) next.add(carried);
    if (node.nodeType === 1 && node.style) {
      const weight = node.style.fontWeight;
      if (weight === 'bold' || weight === 'bolder' || Number(weight) >= 600) next.add('strong');
      if (node.style.fontStyle === 'italic') next.add('em');
    }
    let nextExtra = extra;
    let nextLinkExtra = linkExtra;
    if (tag === 'A' && !href && links) {
      const candidate = node.getAttribute('href');
      if ((0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_4__.safeHref)(candidate)) {
        nextHref = candidate;
        nextLinkExtra = readExtra(node);
      }
    } else if (node.nodeType === 1 && tag !== 'A') {
      const own = readExtra(node);
      if (own) nextExtra = { ...(extra || {}), ...own };
    }
    if (tag === 'BR') {
      // A line break is a break (inline model 1.2.0), no longer a space. The
      // placeholder <br> a browser leaves as the last child of the edited
      // element (an emptied editor, or the empty line after a final break)
      // is not content; a break the editor drew says so itself.
      if (!node.hasAttribute(BREAK_ATTRIBUTE) && isLastLeaf(node, root)) return;
      segments.push({ ...(0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_4__.breakSegment)([...active], href, readExtra(node) || extra), ...carry(null, linkExtra, href) });
      return;
    }
    for (const child of node.childNodes) visit(child, next, nextHref, nextExtra, nextLinkExtra);
    // Nested blocks (pasted paragraphs) are separated by one space; the root is not.
    if (BLOCK.has(tag) && node !== root) segments.push({ text: ' ', marks: [], href: null });
  };
  visit(root, new Set(), null);
  // The field's marks limit the known ones; a mark the model does not know is
  // kept as it came, so an edit never drops it (validation still reports it).
  const allowed = new Set(marks);
  const keep = (mark) => allowed.has(mark) || !_inline_model_mjs__WEBPACK_IMPORTED_MODULE_4__.INLINE_MARKS.includes(mark);
  let content = (0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_4__.fromSegments)(segments.map((segment) => ({ ...segment, marks: segment.marks.filter(keep), href: links ? segment.href : null })));
  if (collapse) {
    const flat = (0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_4__.toSegments)(content);
    if (flat.length && !flat[0].node) flat[0] = { ...flat[0], text: flat[0].text.replace(/^ +/u, '') };
    if (flat.length && !flat.at(-1).node) flat[flat.length - 1] = { ...flat.at(-1), text: flat.at(-1).text.replace(/ +$/u, '') };
    content = (0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_4__.fromSegments)(flat);
  }
  return content;
}

/**
 * Renders inline content with the same element nesting as the Framework
 * renderer. An atom draws its component's element, an opaque node a
 * placeholder; both are not editable inside and carry their entry.
 */
function renderInlineDom(doc, content) {
  const fragment = doc.createDocumentFragment();
  const object = (entry) => {
    const view = (0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_4__.inlineComponentView)(entry);
    const element = doc.createElement(view ? view.tag : 'span');
    if (view) {
      for (const [name, value] of view.attributes) element.setAttribute(name, value);
      if (view.text) element.textContent = view.text;
    } else element.textContent = _inline_model_mjs__WEBPACK_IMPORTED_MODULE_4__.INLINE_OBJECT;
    element.setAttribute('contenteditable', 'false');
    element.setAttribute(NODE_ATTRIBUTE, JSON.stringify(entry));
    return element;
  };
  const run = (entry) => {
    if (entry.type !== 'text' && entry.type !== 'break') return object(entry);
    let node;
    if (entry.type === 'break') {
      node = doc.createElement('br');
      node.setAttribute(BREAK_ATTRIBUTE, '');
    } else node = doc.createTextNode(entry.value);
    for (const mark of entry.marks || []) {
      const wrapper = doc.createElement(MARK_TAGS.get(mark) || 'span');
      if (!MARK_TAGS.has(mark)) wrapper.setAttribute(MARK_ATTRIBUTE, mark);
      wrapper.append(node);
      node = wrapper;
    }
    const extra = (0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_4__.inlineExtensions)(entry);
    if (extra) {
      const wrapper = doc.createElement('span');
      wrapper.setAttribute(EXTRA_ATTRIBUTE, JSON.stringify(extra));
      wrapper.append(node);
      node = wrapper;
    }
    return node;
  };
  const normalized = (0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_4__.normalizeInline)(content);
  for (const entry of normalized) {
    if (entry.type === 'link') {
      const anchor = doc.createElement('a');
      anchor.setAttribute('href', entry.href);
      const linkExtra = (0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_4__.inlineExtensions)(entry);
      if (linkExtra) anchor.setAttribute(EXTRA_ATTRIBUTE, JSON.stringify(linkExtra));
      for (const child of entry.children) anchor.append(run(child));
      fragment.append(anchor);
    } else fragment.append(run(entry));
  }
  // A line that ends on a break needs one more <br> to show its empty last
  // line; that one is the placeholder and is not read back.
  const last = normalized.at(-1);
  // It goes inside the marks of that break, so text typed on the new line
  // keeps them, as it would after a break inside a line.
  if (last?.type === 'break' || (last?.type === 'link' && last.children.at(-1)?.type === 'break')) {
    let host = fragment;
    while (host.lastChild?.nodeType === 1 && host.lastChild.tagName !== 'BR') host = host.lastChild;
    host.append(doc.createElement('br'));
  }
  return fragment;
}

// True when node is the last thing inside root: nothing follows it at any level.
function isLastLeaf(node, root) {
  for (let current = node; current && current !== root; current = current.parentNode) if (current.nextSibling) return false;
  return true;
}

// The units of offset inside root, in document order: text nodes outside
// atoms, and atom elements, which hold one unit each.
function units(root) {
  const list = [];
  const visit = (node) => {
    for (const child of node.childNodes) {
      if (child.nodeType === 3) list.push(child);
      else if (isAtomElement(child) || isBreakElement(child)) list.push(child);
      else if (child.nodeType === 1) visit(child);
    }
  };
  visit(root);
  return list;
}
const unitLength = (unit) => (unit.nodeType === 3 ? unit.nodeValue.length : 1);

/** Offset of a DOM position inside root: characters of text nodes, one per atom. */
function textOffset(root, container, offset) {
  const range = root.ownerDocument.createRange();
  range.setStart(root, 0);
  range.setEnd(container, offset);
  let total = 0;
  for (const unit of units(root)) {
    if (unit === container) return total + offset;
    // A unit counts once its end is inside [root start, position].
    const [parent, index] = unit.nodeType === 3 ? [unit, unit.nodeValue.length] : [unit.parentNode, [...unit.parentNode.childNodes].indexOf(unit) + 1];
    if (range.comparePoint(parent, index) !== 0) break;
    total += unitLength(unit);
  }
  return total;
}

// The DOM position of an offset: inside a text node where one holds it, else
// beside the atom, so the caret never lands inside one.
function locate(root, offset) {
  let total = 0;
  const list = units(root);
  for (const unit of list) {
    if (unit.nodeType === 3) {
      if (offset <= total + unit.nodeValue.length) return [unit, offset - total];
    } else if (offset <= total) return [unit.parentNode, [...unit.parentNode.childNodes].indexOf(unit)];
    total += unitLength(unit);
  }
  const last = list.at(-1);
  if (!last) return [root, 0];
  return last.nodeType === 3 ? [last, last.nodeValue.length] : [last.parentNode, [...last.parentNode.childNodes].indexOf(last) + 1];
}

/** Selects from anchor to focus (focus may come first: a backward selection). */
function setSelection(root, anchor, focus = anchor) {
  const selection = root.ownerDocument.getSelection();
  const [anchorNode, anchorOffset] = locate(root, anchor);
  const [focusNode, focusOffset] = locate(root, focus);
  selection.setBaseAndExtent(anchorNode, anchorOffset, focusNode, focusOffset);
}

// When the formatting toolbar shows (owner decision C172 (1), 2026-11-14):
// only while text is selected, over the selection (selection, the default
// since sf-editor-inline 1.9.0), or for the whole edit, over the element
// (session, the default before it, kept for a host that asks for it;
// simai/ui-source#67). On a phone the toolbar is a strip of icons above the
// screen keyboard for the whole edit, whatever the mode (C172 (3)).
const INLINE_TOOLBAR_MODES = Object.freeze(['selection', 'session']);

// What Enter does (owner decision C172 (2)): save, the default, commits the
// edit; new-block -- a block editor's setting «Enter — новый блок» -- commits
// the text before the caret and gives the text after it as next, for the
// host to make the next block of. Shift+Enter is a line break in both, focus
// leaving saves in both.
const INLINE_ENTER_MODES = Object.freeze(['save', 'new-block']);

const MARK_ICONS = Object.freeze({ strong: 'format_bold', em: 'format_italic', code: 'code', strike: 'strikethrough_s' });
// The toolbar's rungs: icon buttons 1/2 over the page (C141 (4), C144); on a
// phone the strip's buttons are 2, the touch rung.
const BAR_SIZE = Object.freeze({ float: '1/2', dock: '2' });
// The link window is one small form on one rung (C141 (6)): its field and
// both buttons are 1/2.
const LINK_SIZE = '1/2';
// A row unit that left for «Ещё» (core/js/overflow-row.js, C155).
const OUT = 'sf-inline-editor-out';
// Below the md breakpoint core.css does not declare --sf-breakpoint-md: a
// phone, as sf-input-rich reads it.
const onPhone = (doc) => !doc.defaultView?.getComputedStyle(doc.documentElement).getPropertyValue('--sf-breakpoint-md').trim();
const ICON_BUTTON = ['sf-icon-button', 'sf-icon-button--icon', 'sf-icon-button--ghost', 'sf-icon-button--on-surface'];

// Why a link address is refused, as the link window says it under the field
// (owner decision C172 (4)): the word of the reason, which names what to
// change, or null when the address is accepted (safeHref).
function linkProblem(value) {
  const text = String(value ?? '');
  if (!text) return 'link-empty';
  if ((0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_4__.safeHref)(text)) return null;
  if (text.length > _inline_model_mjs__WEBPACK_IMPORTED_MODULE_4__.INLINE_LIMITS.maxHrefLength) return 'link-long';
  if (/\s/u.test(text)) return 'link-spaces';
  if (text.startsWith('//') || text.includes('\\')) return 'link-slashes';
  if (/^[a-z][a-z0-9+.-]*:/iu.test(text)) return 'link-scheme';
  return 'link-start';
}

// The word around an offset (letters, digits, joiners inside a word), as
// [start, end], or null in a space or beside an atom: Ctrl/⌘+K with no
// selection links the word under the caret (C172 (4), IE-3).
function wordAround(content, offset) {
  const text = (0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_4__.toSegments)(content).map((segment) => (segment.node || segment.break ? '\u0000' : segment.text)).join('');
  const inWord = (at) => at >= 0 && at < text.length && /[\p{L}\p{N}\p{M}_'’-]/u.test(text[at]);
  let start = offset;
  let end = offset;
  while (inWord(start - 1)) start -= 1;
  while (inWord(end)) end += 1;
  while (start < end && /[-'’_]/u.test(text[start])) start += 1;
  while (end > start && /[-'’_]/u.test(text[end - 1])) end -= 1;
  return start < end ? [start, end] : null;
}

/**
 * Starts in-place editing of a rendered heading or paragraph element.
 * options: {content, nodeId, label, marks, links, messages, toolbar, enter}
 * Returns {commit(), cancel(), value(), element}.
 */
function startInlineEdit(element, options = {}) {
  if (!(element instanceof globalThis.Element)) throw new TypeError('Inline editing needs an element');
  if (element.hasAttribute('data-sf-inline-editing')) throw new TypeError('inline_edit_active');
  const toolbarMode = options.toolbar ?? 'selection';
  if (!INLINE_TOOLBAR_MODES.includes(toolbarMode)) throw new TypeError(`inline_toolbar_unknown: ${toolbarMode}`);
  const enterMode = options.enter ?? 'save';
  if (!INLINE_ENTER_MODES.includes(enterMode)) throw new TypeError(`inline_enter_unknown: ${enterMode}`);
  const doc = element.ownerDocument;
  const text = { ...words(element), ...(options.messages || {}) };
  // options.marks: the marks the field allows and offers; without it every
  // known mark is kept and the toolbar offers TOOLBAR_MARKS.
  const marks = (options.marks || _inline_model_mjs__WEBPACK_IMPORTED_MODULE_4__.INLINE_MARKS).filter((mark) => _inline_model_mjs__WEBPACK_IMPORTED_MODULE_4__.INLINE_MARKS.includes(mark));
  const offered = options.marks ? marks : TOOLBAR_MARKS.filter((mark) => marks.includes(mark));
  const links = options.links !== false;
  const original = { html: element.innerHTML, attributes: ['contenteditable', 'role', 'aria-multiline', 'aria-label', 'spellcheck', 'tabindex'].map((name) => [name, element.getAttribute(name)]) };
  const history = [];
  let historyIndex = -1;
  let composing = false;
  let lastTyping = 0;
  let finished = false;
  const connection = new AbortController();
  const signal = { signal: connection.signal };

  const read = () => readInlineDom(element, { marks, links });
  const selectionOffsets = () => {
    const selection = doc.getSelection();
    if (!selection?.rangeCount || !element.contains(selection.anchorNode)) return [(0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_4__.inlineLength)(read()), (0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_4__.inlineLength)(read())];
    const range = selection.getRangeAt(0);
    return [textOffset(element, range.startContainer, range.startOffset), textOffset(element, range.endContainer, range.endOffset)];
  };
  const draw = (content, start, end) => {
    element.replaceChildren(renderInlineDom(doc, content));
    setSelection(element, start, end);
  };
  const snapshot = (merge = false) => {
    const entry = { content: read(), selection: selectionOffsets() };
    if (merge && historyIndex === history.length - 1 && history[historyIndex].typing) history[historyIndex] = { ...entry, typing: true };
    else {
      history.splice(historyIndex + 1);
      history.push({ ...entry, typing: merge });
      historyIndex = history.length - 1;
    }
  };
  const emitInput = () => emitInline(element, 'input', options.nodeId ?? null, read());
  const apply = (content, start, end) => {
    draw(content, start, end);
    snapshot(false);
    emitInput();
    updateToolbar();
  };
  const restore = (index) => {
    historyIndex = index;
    const entry = history[index];
    draw(entry.content, ...entry.selection);
    emitInput();
    updateToolbar();
  };

  // Toolbar ----------------------------------------------------------------
  // One row of icon buttons in groups (owner decisions C141 (4), C144, C172):
  // the marks, a separator, the link; 4 apart inside a group, a 1 px line with
  // 4 on each side between groups. What does not fit the row leaves for
  // ⋯ «Ещё» at its end, a whole group with its separator, the link first
  // (core/js/overflow-row.js, C155); the marks stay.
  const toolbar = doc.createElement('div');
  toolbar.className = 'sf-inline-editor-toolbar';
  toolbar.setAttribute('role', 'toolbar');
  toolbar.setAttribute('aria-label', text.toolbar);
  toolbar.dataset.sfToolbar = toolbarMode;
  toolbar.hidden = toolbarMode === 'selection';
  const buttons = new Map();
  const tools = [];
  const toolButton = (id, icon, label) => {
    const button = doc.createElement('button');
    button.type = 'button';
    button.classList.add('sf-inline-editor-button', `sf-inline-editor-button--${id}`, ...ICON_BUTTON);
    button.dataset.sfTool = id;
    button.setAttribute('aria-label', label);
    button.title = label;
    const glyph = doc.createElement('i');
    glyph.className = 'sf-icon';
    glyph.setAttribute('aria-hidden', 'true');
    glyph.textContent = icon;
    button.append(glyph);
    tools.push(button);
    return button;
  };
  const group = (priority) => {
    const box = doc.createElement('div');
    box.className = 'sf-inline-editor-group';
    box.setAttribute('role', 'group');
    box.dataset.sfPriority = String(priority);
    return box;
  };
  const separator = (...extra) => {
    const line = doc.createElement('span');
    line.className = ['sf-inline-editor-separator', ...extra].join(' ');
    line.setAttribute('aria-hidden', 'true');
    return line;
  };
  const groups = [];
  const separators = [];
  const marksGroup = group(1);
  for (const mark of offered) {
    const button = toolButton(mark, MARK_ICONS[mark] || 'format_clear', text[mark]);
    button.dataset.mark = mark;
    button.setAttribute('aria-pressed', 'false');
    if (SHORTCUTS[mark]) button.setAttribute('aria-keyshortcuts', `Control+${SHORTCUTS[mark].toUpperCase()} Meta+${SHORTCUTS[mark].toUpperCase()}`);
    buttons.set(mark, button);
    marksGroup.append(button);
  }
  if (marksGroup.childElementCount) groups.push(marksGroup);
  if (links) {
    const linkGroup = group(2);
    const button = toolButton('link', 'link', text.link);
    button.dataset.link = 'toggle';
    button.setAttribute('aria-pressed', 'false');
    button.setAttribute('aria-haspopup', 'dialog');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-keyshortcuts', 'Control+K Meta+K');
    buttons.set('link', button);
    linkGroup.append(button);
    groups.push(linkGroup);
  }
  groups.forEach((box, at) => {
    if (at) {
      const line = separator();
      separators.push(line);
      toolbar.append(line);
    }
    toolbar.append(box);
  });
  const moreSeparator = separator('sf-inline-editor-more-separator', OUT);
  const moreButton = toolButton('more', 'more_horiz', text.more);
  moreButton.classList.add(OUT);
  moreButton.setAttribute('aria-haspopup', 'menu');
  moreButton.setAttribute('aria-expanded', 'false');
  toolbar.append(moreSeparator, moreButton);
  doc.body.append(toolbar);
  // The toolbar's keys (owner decision C184 (1)-(3), TL-4): one Tab stop that
  // comes back to the tool left, the arrows in the row's direction, Home and
  // End; a tool under «Ещё» (C155) and the link panel's buttons are not in the walk.
  const toolbarKeys = (0,_roving_js__WEBPACK_IMPORTED_MODULE_2__.roving)(toolbar, { items: () => [...tools, moreButton], out: `.${OUT}, [hidden], [inert]` });
  let toolsOut = [];
  let docked = false;
  let savedSelection = [0, 0];
  let lastSelection = null;

  // The link window (C141 (6), C172 (4)): its own panel under the selected
  // text -- the address field with its hint under it, then «Применить» and,
  // on a link, «Убрать ссылку» in a row from the start -- and a sheet at the
  // bottom of the screen on a phone (C32), above the keyboard. A refused
  // address says why in the hint's place.
  const linkPanel = doc.createElement('div');
  linkPanel.className = 'sf-inline-editor-link';
  linkPanel.setAttribute('role', 'dialog');
  linkPanel.setAttribute('aria-label', text.link);
  linkPanel.hidden = true;
  const linkInput = doc.createElement('sf-input');
  linkInput.className = 'sf-inline-editor-url';
  linkInput.setAttribute('size', LINK_SIZE);
  linkInput.setAttribute('label', text.url);
  linkInput.setAttribute('hint', text['link-hint']);
  linkInput.setAttribute('autocomplete', 'url');
  linkInput.setAttribute('inputmode', 'url');
  const linkActions = doc.createElement('div');
  linkActions.className = 'sf-inline-editor-link-actions';
  const linkApply = doc.createElement('sf-button');
  linkApply.className = 'sf-inline-editor-apply';
  linkApply.setAttribute('size', LINK_SIZE);
  linkApply.setAttribute('text', text.apply);
  const linkRemove = doc.createElement('sf-button');
  linkRemove.className = 'sf-inline-editor-unlink';
  linkRemove.setAttribute('size', LINK_SIZE);
  linkRemove.setAttribute('appearance', 'outline');
  linkRemove.setAttribute('text', text.unlink);
  linkActions.append(linkApply, linkRemove);
  // The reason, said once to a screen reader as it appears; the field shows it.
  const linkError = doc.createElement('span');
  linkError.className = 'sf-inline-editor-error';
  linkError.setAttribute('role', 'alert');
  linkPanel.append(linkInput, linkActions, linkError);
  if (links) doc.body.append(linkPanel);

  const inside = (node) => Boolean(node) && (element.contains(node) || toolbar.contains(node) || linkPanel.contains(node) || Boolean(toolbar._sfRowMoreMenu?.contains?.(node)) || node === toolbar._sfRowMoreMenu);
  const fieldControl = () => linkInput.querySelector('input');
  const linkValue = () => String(fieldControl()?.value ?? linkInput.value ?? '');
  const setLinkValue = (value) => {
    linkInput.value = value;
    const control = fieldControl();
    if (control) control.value = value;
  };
  const clearError = () => {
    linkInput.removeAttribute('invalid');
    linkInput.removeAttribute('error-message');
    linkError.textContent = '';
  };
  const showError = (problem) => {
    const message = format(text[problem] ?? text.invalid, { max: _inline_model_mjs__WEBPACK_IMPORTED_MODULE_4__.INLINE_LIMITS.maxHrefLength });
    linkInput.setAttribute('invalid', '');
    linkInput.setAttribute('error-message', message);
    linkError.textContent = message;
  };

  // The box of the text between two offsets: the first line's top, the last
  // line's bottom, the span between the leftmost and rightmost edge; for a
  // caret, its line.
  function rangeBox(start, end) {
    const range = doc.createRange();
    range.setStart(...locate(element, Math.min(start, end)));
    range.setEnd(...locate(element, Math.max(start, end)));
    const lines = [...range.getClientRects()].filter((rect) => rect.width > 0 || rect.height > 0);
    if (!lines.length) {
      if (start !== end) return null;
      const box = range.getBoundingClientRect();
      if (box.height > 0) return { top: box.top, bottom: box.bottom, left: box.left, right: box.right };
      const own = element.getBoundingClientRect();
      return { top: own.top, bottom: own.bottom, left: own.left, right: own.right };
    }
    return {
      top: Math.min(...lines.map((rect) => rect.top)),
      bottom: Math.max(...lines.map((rect) => rect.bottom)),
      left: Math.min(...lines.map((rect) => rect.left)),
      right: Math.max(...lines.map((rect) => rect.right)),
    };
  }
  // The room between the text and what floats by it: the toolbar's own gap
  // (--sf-space-1/4 through its sheet).
  const gap = () => parseFloat(globalThis.getComputedStyle(toolbar).columnGap) || 4;
  // The bottom of what the person sees: above the screen keyboard where the
  // browser says where it is (visualViewport).
  const keyboardEdge = () => {
    const view = globalThis.visualViewport;
    return view ? view.offsetTop + view.height : globalThis.innerHeight;
  };

  // The selection mode's place: above the selected text, centred on it,
  // below it when there is no room above, kept inside the viewport. While the
  // link window is open the selection is in its field, so the saved one counts.
  function positionOverSelection() {
    const [start, end] = linkPanel.hidden ? selectionOffsets() : savedSelection;
    if (start === end && linkPanel.hidden) return;
    const box = rangeBox(start, end);
    if (!box) return;
    const bar = toolbar.getBoundingClientRect();
    const above = box.top - bar.height - gap();
    const top = above >= 0 ? above : Math.min(globalThis.innerHeight - bar.height, box.bottom + gap());
    const left = (box.left + box.right) / 2 - bar.width / 2;
    Object.assign(toolbar.style, { top: `${top}px`, left: `${Math.max(0, Math.min(left, doc.documentElement.clientWidth - bar.width))}px` });
  }

  function positionToolbar() {
    if (finished) return;
    if (!toolbar.hidden) {
      if (docked) {
        const bar = toolbar.getBoundingClientRect();
        Object.assign(toolbar.style, { top: `${keyboardEdge() - bar.height}px`, left: '' });
      } else if (toolbarMode === 'selection') positionOverSelection();
      else {
        const box = element.getBoundingClientRect();
        const bar = toolbar.getBoundingClientRect();
        const rtl = globalThis.getComputedStyle(element).direction === 'rtl';
        const above = box.top - bar.height - gap();
        const top = above >= 0 ? above : Math.min(globalThis.innerHeight - bar.height, box.bottom + gap());
        const start = rtl ? box.right - bar.width : box.left;
        Object.assign(toolbar.style, { top: `${top}px`, left: `${Math.max(0, Math.min(start, doc.documentElement.clientWidth - bar.width))}px` });
      }
    }
    placeLinkPanel();
  }

  // The link window under the selected text (above the toolbar when there is
  // no room below), from its start edge, inside the viewport; on a phone a
  // sheet standing on the keyboard.
  function placeLinkPanel() {
    if (linkPanel.hidden) return;
    if (docked) {
      linkPanel.setAttribute('data-sf-sheet', '');
      linkPanel.style.left = '';
      linkPanel.style.top = `${keyboardEdge() - linkPanel.getBoundingClientRect().height}px`;
      return;
    }
    linkPanel.removeAttribute('data-sf-sheet');
    const box = rangeBox(...savedSelection);
    if (!box) return;
    const panel = linkPanel.getBoundingClientRect();
    const bar = toolbar.hidden ? null : toolbar.getBoundingClientRect();
    const space = gap();
    const barBelow = bar && bar.top >= box.bottom - 1;
    let top = (barBelow ? bar.bottom : box.bottom) + space;
    if (top + panel.height > globalThis.innerHeight) {
      const above = (bar && !barBelow ? bar.top : box.top) - space - panel.height;
      top = above >= 0 ? above : Math.max(0, globalThis.innerHeight - panel.height);
    }
    const rtl = globalThis.getComputedStyle(element).direction === 'rtl';
    const start = rtl ? box.right - panel.width : box.left;
    Object.assign(linkPanel.style, { top: `${top}px`, left: `${Math.max(0, Math.min(start, doc.documentElement.clientWidth - panel.width))}px` });
  }

  // The row: the groups that fit, the rest in ⋯ (C155 (3), (4)). A floating
  // toolbar's room is the viewport's width less its own padding; the strip's
  // is its own width.
  function layoutBar() {
    if (finished || toolbar.hidden) return;
    let room = null;
    if (!docked) {
      const style = globalThis.getComputedStyle(toolbar);
      const chrome = ['paddingLeft', 'paddingRight', 'borderLeftWidth', 'borderRightWidth'].reduce((sum, edge) => sum + (parseFloat(style[edge]) || 0), 0);
      room = doc.documentElement.clientWidth - chrome;
    }
    const units = groups.map((box, at) => ({ element: box, rank: at + 1, pin: at === 0, group: at }));
    const { out } = (0,_overflow_row_js__WEBPACK_IMPORTED_MODULE_1__.layoutActionRow)({ row: toolbar, units, more: moreButton, moreSeparator, separators: separators.map((line, at) => ({ element: line, after: at })), outClass: OUT, room });
    toolsOut = out.flatMap((at) => [...groups[at].querySelectorAll('button')]);
    toolbar.setAttribute('data-sf-row-laid', '');
  }

  // A phone takes the strip above the keyboard with buttons on the touch
  // rung; wider, the floating toolbar on the 1/2 rung.
  function followScreen() {
    const next = onPhone(doc);
    if (next === docked && toolbar.hasAttribute('data-sf-size')) return;
    docked = next;
    toolbar.classList.toggle('sf-inline-editor-toolbar--dock', docked);
    const size = docked ? BAR_SIZE.dock : BAR_SIZE.float;
    toolbar.dataset.sfSize = size;
    for (const button of tools) {
      for (const name of [...button.classList]) if (name.startsWith('sf-icon-button--size-')) button.classList.remove(name);
      button.classList.add(`sf-icon-button--size-${size}`);
    }
  }

  function updateToolbar() {
    if (finished) return;
    const [start, end] = linkPanel.hidden ? selectionOffsets() : savedSelection;
    if (linkPanel.hidden && element.contains(doc.getSelection()?.anchorNode)) lastSelection = [start, end];
    const state = (0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_4__.marksIn)(read(), start, end === start ? Math.max(0, start - 1) : end);
    for (const mark of offered) buttons.get(mark).setAttribute('aria-pressed', state.marks.includes(mark) ? 'true' : 'false');
    buttons.get('link')?.setAttribute('aria-pressed', state.href ? 'true' : 'false');
    const wasHidden = toolbar.hidden;
    // Selection mode: the bar is there while text is selected or a link is
    // being written, and nowhere while the caret only stands in the text --
    // except on a phone, where the strip stays for the whole edit.
    toolbar.hidden = !docked && toolbarMode === 'selection' && start === end && linkPanel.hidden;
    if (wasHidden && !toolbar.hidden) layoutBar();
    positionToolbar();
  }

  function toggle(mark) {
    const [start, end] = selectionOffsets();
    if (start === end) return;
    apply((0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_4__.toggleMark)(read(), start, end, mark), start, end);
  }

  function insertBreak() {
    const [start, end] = selectionOffsets();
    const content = read();
    const at = (0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_4__.toSegments)((0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_4__.sliceInline)(content, Math.max(0, start - 1), start)).find((segment) => !segment.node);
    apply((0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_4__.replaceRange)(content, start, end, [(0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_4__.breakSegment)(at?.marks || [], at?.href || null)]), start + 1, start + 1);
  }

  // The field takes the focus once sf-input has drawn it.
  function focusField() {
    const ready = globalThis.customElements?.get('sf-input') ? null : globalThis.SF?.Loader?.ensure?.(['sf-input', 'sf-button']);
    Promise.resolve(ready).then(() => linkInput.updateComplete).then(() => {
      if (finished || linkPanel.hidden) return;
      const control = fieldControl();
      if (control) {
        control.focus({ preventScroll: true });
        control.select?.();
      } else linkInput.focus?.({ preventScroll: true });
      placeLinkPanel();
    });
  }

  function openLink() {
    if (!links || finished) return;
    let [start, end] = selectionOffsets();
    // No selection: the word under the caret; none there, the address
    // becomes the link's text where the caret stands.
    if (start === end) {
      const word = wordAround(read(), start);
      if (word) {
        [start, end] = word;
        setSelection(element, start, end);
      }
    }
    savedSelection = [start, end];
    const href = start === end ? '' : ((0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_4__.marksIn)(read(), start, end).href || '');
    linkRemove.hidden = !href;
    clearError();
    setLinkValue(href);
    linkPanel.hidden = false;
    buttons.get('link')?.setAttribute('aria-expanded', 'true');
    updateToolbar();
    focusField();
  }

  function closeLink(focusEditor = true) {
    if (linkPanel.hidden) return;
    linkPanel.hidden = true;
    linkPanel.removeAttribute('data-sf-sheet');
    buttons.get('link')?.setAttribute('aria-expanded', 'false');
    clearError();
    if (focusEditor && !finished) {
      element.focus({ preventScroll: true });
      setSelection(element, ...savedSelection);
    }
    if (!finished) updateToolbar();
  }

  function applyLink(href) {
    if (href !== null) {
      const problem = linkProblem(href);
      if (problem) {
        showError(problem);
        return;
      }
    }
    closeLink();
    const [start, end] = savedSelection;
    if (href !== null && start === end) {
      // Nothing selected and no word: the address is the link's text.
      const shown = href.replace(/^(mailto|tel):/u, '');
      apply((0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_4__.replaceRange)(read(), start, end, [{ text: shown, marks: [], href }]), start + shown.length, start + shown.length);
    } else apply((0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_4__.setLink)(read(), start, end, href), start, end);
  }

  // A tool of the toolbar or of its «Ещё»: from the menu the text gets the
  // focus and its selection back first.
  function runTool(id, fromMenu = false) {
    if (finished) return;
    if (fromMenu) {
      element.focus({ preventScroll: true });
      if (lastSelection) setSelection(element, ...lastSelection);
    }
    if (id === 'link') (linkPanel.hidden ? openLink() : closeLink());
    else if (offered.includes(id)) toggle(id);
  }

  async function openMore() {
    const entries = [];
    let last = null;
    for (const button of toolsOut) {
      const box = button.closest('.sf-inline-editor-group');
      if (last && box !== last) entries.push({ type: 'separator' });
      last = box;
      const entry = (0,_overflow_row_js__WEBPACK_IMPORTED_MODULE_1__.actionEntry)(button, button.dataset.sfTool);
      const key = button.dataset.mark ? SHORTCUTS[button.dataset.mark] : button.dataset.link ? 'k' : null;
      if (key) entry.shortcut = `mod+${key}`;
      entries.push(entry);
    }
    await (0,_overflow_row_js__WEBPACK_IMPORTED_MODULE_1__.openRowMenu)(toolbar, { anchor: moreButton, entries, label: text.more, size: docked ? '1' : '1/2', select: (id) => runTool(id, true) });
  }

  // Lifecycle --------------------------------------------------------------
  let observer = null;
  function teardown() {
    finished = true;
    connection.abort();
    observer?.disconnect();
    toolbarKeys.destroy();
    toolbar._sfRowMoreMenu?.remove?.();
    toolbar.remove();
    linkPanel.remove();
    element.innerHTML = original.html;
    for (const [name, value] of original.attributes) {
      if (value === null) element.removeAttribute(name);
      else element.setAttribute(name, value);
    }
    element.removeAttribute('data-sf-inline-editing');
  }

  function commit() {
    if (finished) return null;
    const content = (0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_4__.normalizeInline)(read());
    teardown();
    emitInline(element, 'commit', options.nodeId ?? null, content);
    return content;
  }

  // Enter in a block editor (enter: 'new-block'): the text before the caret
  // is saved, the text after it (the selection dropped) goes as next.
  function commitNewBlock() {
    if (finished) return null;
    const [start, end] = selectionOffsets();
    const content = read();
    const before = (0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_4__.normalizeInline)((0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_4__.sliceInline)(content, 0, start));
    const next = (0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_4__.normalizeInline)((0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_4__.sliceInline)(content, end, (0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_4__.inlineLength)(content)));
    teardown();
    emitInline(element, 'commit', options.nodeId ?? null, before, next);
    return before;
  }

  function cancel() {
    if (finished) return;
    teardown();
    emitInline(element, 'cancel', options.nodeId ?? null);
  }

  // Start ------------------------------------------------------------------
  const initial = (0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_4__.normalizeInline)(options.content ?? readInlineDom(element, { marks, links }));
  element.setAttribute('data-sf-inline-editing', '');
  element.setAttribute('contenteditable', 'true');
  element.setAttribute('role', 'textbox');
  element.setAttribute('aria-multiline', 'false');
  element.setAttribute('aria-label', format(enterMode === 'new-block' ? text['editing-block'] : text.editing, { label: options.label || '' }).replace(/^: /u, ''));
  element.replaceChildren(renderInlineDom(doc, initial));
  element.focus();
  setSelection(element, (0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_4__.inlineLength)(initial));
  history.push({ content: initial, selection: selectionOffsets(), typing: false });
  historyIndex = 0;

  element.addEventListener('beforeinput', (event) => {
    if (event.inputType === 'historyUndo' || event.inputType === 'historyRedo') {
      event.preventDefault();
      if (event.inputType === 'historyUndo' && historyIndex > 0) restore(historyIndex - 1);
      if (event.inputType === 'historyRedo' && historyIndex < history.length - 1) restore(historyIndex + 1);
    } else if (event.inputType === 'insertParagraph' || event.inputType === 'insertLineBreak') {
      event.preventDefault();
    } else if (event.inputType.startsWith('format')) {
      event.preventDefault();
      const mark = { formatBold: 'strong', formatItalic: 'em' }[event.inputType];
      if (mark && marks.includes(mark)) toggle(mark);
    } else if (event.inputType === 'insertFromDrop') {
      event.preventDefault();
    }
  }, signal);
  element.addEventListener('input', () => {
    if (composing) return;
    const now = Date.now();
    snapshot(now - lastTyping < 700);
    lastTyping = now;
    emitInput();
    updateToolbar();
  }, signal);
  element.addEventListener('compositionstart', () => { composing = true; }, signal);
  element.addEventListener('compositionend', () => {
    composing = false;
    snapshot(false);
    emitInput();
  }, signal);
  element.addEventListener('paste', (event) => {
    event.preventDefault();
    const data = event.clipboardData;
    const html = data?.getData('text/html');
    const plain = data?.getData('text/plain') || '';
    let parsed = [{ type: 'text', value: plain.replace(/\s+/gu, ' ').trim() }];
    if (html) {
      const body = new globalThis.DOMParser().parseFromString(html, 'text/html').body;
      if (body.querySelector(`[${COPY_ATTRIBUTE}]`)?.getAttribute(COPY_ATTRIBUTE) !== copyToken()) {
        for (const node of body.querySelectorAll('*')) for (const name of node.getAttributeNames()) if (name.startsWith('data-sf-inline-')) node.removeAttribute(name);
      }
      parsed = readInlineDom(body, { marks, links, collapse: true });
    }
    const inserted = (0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_4__.toSegments)(parsed);
    const [start, end] = selectionOffsets();
    const length = (0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_4__.inlineLength)((0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_4__.fromSegments)(inserted));
    apply((0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_4__.replaceRange)(read(), start, end, inserted), start + length, start + length);
  }, signal);
  element.addEventListener('drop', (event) => event.preventDefault(), signal);
  // Copy and cut write the editor's own HTML, in which an atom keeps its
  // entry, so pasting it into an inline editor gives the same atom back.
  const copySelection = (event, remove) => {
    const [start, end] = selectionOffsets();
    if (start === end || !event.clipboardData) return;
    event.preventDefault();
    const slice = (0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_4__.sliceInline)(read(), start, end);
    const holder = doc.createElement('div');
    const wrapper = doc.createElement('span');
    wrapper.setAttribute(COPY_ATTRIBUTE, copyToken());
    wrapper.append(renderInlineDom(doc, slice));
    holder.append(wrapper);
    event.clipboardData.setData('text/html', holder.innerHTML);
    event.clipboardData.setData('text/plain', (0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_4__.toSegments)(slice).map(({ text, node, break: isBreak }) => (node ? (typeof node.props?.text === 'string' ? node.props.text : '') : isBreak ? '\n' : text)).join(''));
    if (remove) apply((0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_4__.replaceRange)(read(), start, end, []), start, start);
  };
  element.addEventListener('copy', (event) => copySelection(event, false), signal);
  element.addEventListener('cut', (event) => copySelection(event, true), signal);
  // An atom is one caret stop: arrows step over it in one move, Backspace
  // and Delete remove it whole. Only the moves next to an atom are taken over.
  const stepOverAtom = (event) => {
    const selection = doc.getSelection();
    if (!selection?.rangeCount || event.altKey || event.ctrlKey || event.metaKey) return false;
    const content = read();
    const [start, end] = selectionOffsets();
    if (event.key === 'Backspace' || event.key === 'Delete') {
      if (start !== end) {
        if (!(0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_4__.toSegments)((0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_4__.sliceInline)(content, start, end)).some(({ node }) => node)) return false;
        apply((0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_4__.replaceRange)(content, start, end, []), start, start);
        return true;
      }
      const at = event.key === 'Backspace' ? start - 1 : start;
      if (at < 0 || !(0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_4__.objectAt)(content, at)) return false;
      apply((0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_4__.replaceRange)(content, at, at + 1, []), at, at);
      return true;
    }
    const rtl = globalThis.getComputedStyle(element).direction === 'rtl';
    const forward = (event.key === 'ArrowRight') !== rtl;
    const anchor = textOffset(element, selection.anchorNode, selection.anchorOffset);
    const focus = textOffset(element, selection.focusNode, selection.focusOffset);
    if (!event.shiftKey && anchor !== focus) return false;
    const next = forward ? focus + 1 : focus - 1;
    if (!(0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_4__.objectAt)(content, forward ? focus : focus - 1)) return false;
    setSelection(element, event.shiftKey ? anchor : next, next);
    updateToolbar();
    return true;
  };
  element.addEventListener('keydown', (event) => {
    if (event.isComposing || composing) return;
    const modifier = event.ctrlKey || event.metaKey;
    if (['ArrowLeft', 'ArrowRight', 'Backspace', 'Delete'].includes(event.key) && stepOverAtom(event)) {
      event.preventDefault();
    } else if (event.key === 'Enter' && event.shiftKey) {
      // Shift+Enter: a soft line break in the same block, with the marks and
      // link of the text before it (inline model 1.2.0).
      event.preventDefault();
      insertBreak();
    } else if (event.key === 'Enter' && !event.shiftKey) {
      // Enter saves (C172 (2)); in a block editor it starts the next block.
      event.preventDefault();
      if (enterMode === 'new-block') commitNewBlock();
      else commit();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      cancel();
    } else if (modifier && event.key.toLowerCase() === 'z') {
      event.preventDefault();
      if (event.shiftKey) { if (historyIndex < history.length - 1) restore(historyIndex + 1); } else if (historyIndex > 0) restore(historyIndex - 1);
    } else if (modifier && event.key.toLowerCase() === 'y') {
      event.preventDefault();
      if (historyIndex < history.length - 1) restore(historyIndex + 1);
    } else if (modifier && event.key.toLowerCase() === 'k' && links) {
      event.preventDefault();
      openLink();
    } else if (modifier) {
      const mark = Object.entries(SHORTCUTS).find(([, key]) => key === event.key.toLowerCase())?.[0];
      if (mark && marks.includes(mark)) {
        event.preventDefault();
        toggle(mark);
      }
    }
  }, signal);
  toolbar.addEventListener('mousedown', (event) => {
    // Keep the text selection while pressing toolbar buttons.
    if (event.target.closest('button')) event.preventDefault();
  }, signal);
  toolbar.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;
    if (button === moreButton) openMore();
    else runTool(button.dataset.sfTool);
  }, signal);
  // The arrows, Home and End are core's roving helper (C184, above); Escape
  // goes back to the text.
  toolbar.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    element.focus({ preventScroll: true });
    if (lastSelection) setSelection(element, ...lastSelection);
  }, signal);
  linkPanel.addEventListener('keydown', (event) => {
    if (event.isComposing) return;
    if (event.key === 'Enter' && !event.target.closest?.('sf-button')) { event.preventDefault(); applyLink(linkValue().trim()); }
    if (event.key === 'Escape') { event.preventDefault(); closeLink(); }
  }, signal);
  // The reason goes as soon as the address changes (C153 (3)).
  linkPanel.addEventListener('input', () => { if (linkInput.hasAttribute('invalid')) clearError(); }, signal);
  linkPanel.addEventListener('click', (event) => {
    if (event.target.closest('.sf-inline-editor-apply')) applyLink(linkValue().trim());
    else if (event.target.closest('.sf-inline-editor-unlink')) applyLink(null);
  }, signal);
  // On a phone the sheet stands over a scrim: a press outside it closes it
  // and keeps the edit.
  doc.addEventListener('pointerdown', (event) => {
    if (!docked || linkPanel.hidden || linkPanel.contains(event.target)) return;
    event.preventDefault();
    closeLink();
  }, { ...signal, capture: true });
  const onFocusOut = (event) => {
    if (inside(event.relatedTarget)) return;
    // Let a click inside the toolbar or the link window land before deciding to commit.
    globalThis.setTimeout(() => {
      if (!finished && !inside(doc.activeElement)) commit();
    }, 0);
  };
  element.addEventListener('focusout', onFocusOut, signal);
  toolbar.addEventListener('focusout', onFocusOut, signal);
  linkPanel.addEventListener('focusout', onFocusOut, signal);
  doc.addEventListener('selectionchange', () => { if (element.contains(doc.getSelection()?.anchorNode)) updateToolbar(); }, signal);
  const onResize = () => {
    const was = docked;
    followScreen();
    if (was !== docked) toolbar.removeAttribute('data-sf-row-laid');
    layoutBar();
    positionToolbar();
  };
  globalThis.addEventListener('scroll', positionToolbar, { ...signal, passive: true, capture: true });
  globalThis.addEventListener('resize', onResize, { ...signal, passive: true });
  globalThis.visualViewport?.addEventListener('resize', positionToolbar, { ...signal, passive: true });
  globalThis.visualViewport?.addEventListener('scroll', positionToolbar, { ...signal, passive: true });
  // The groups widen when the icon face arrives: the row is laid out again.
  if (typeof globalThis.ResizeObserver === 'function') {
    observer = new globalThis.ResizeObserver(() => { layoutBar(); positionToolbar(); });
    for (const box of groups) observer.observe(box);
    // The link window grows when a reason takes two lines: it is placed again.
    if (links) observer.observe(linkPanel);
  }
  followScreen();
  updateToolbar();
  layoutBar();
  positionToolbar();

  return Object.freeze({ element, commit, cancel, value: () => (0,_inline_model_mjs__WEBPACK_IMPORTED_MODULE_4__.normalizeInline)(read()) });
}

/**
 * <sf-editor-inline> is the loadable carrier of the inline editor: placing it
 * on a page lets the Smart loader fetch this code on demand. It renders
 * nothing; edit(element, options) is startInlineEdit.
 */
//
// base: the class made from sf-editor-inline's component.json
// (manifest-host.mjs); without it the carrier is a plain element.
function defineInlineEditor(registry = globalThis.customElements, { base = null } = {}) {
  if (!registry || typeof globalThis.HTMLElement !== 'function') return null;
  const existing = registry.get('sf-editor-inline');
  if (existing) return existing;
  class SfInlineEditor extends (base || globalThis.HTMLElement) {
    connectedCallback() {
      super.connectedCallback?.();
      this.hidden = true;
    }

    edit(element, options) {
      return startInlineEdit(element, options);
    }
  }
  registry.define('sf-editor-inline', SfInlineEditor);
  // The former tag sf-inline-editor is a dated alias (a subclass, noted once).
  (0,_tag_aliases_js__WEBPACK_IMPORTED_MODULE_3__.defineTagAliases)(SfInlineEditor, 'sf-editor-inline', { define: (name, Class) => registry.define(name, Class) });
  return SfInlineEditor;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ INLINE_ENTER_MODES, INLINE_EVENTS, INLINE_EVENTS_FORMER_TAG, INLINE_EVENTS_LEGACY, INLINE_TOOLBAR_MODES, defineInlineEditor, linkProblem, readInlineDom, renderInlineDom, startInlineEdit, textOffset, useInlineEditorWords, wordAround });

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "e66d878fb4f8"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   INLINE_COMPONENTS: () => (/* binding */ INLINE_COMPONENTS),
/* harmony export */   INLINE_EXTENSION_KEY: () => (/* binding */ INLINE_EXTENSION_KEY),
/* harmony export */   INLINE_FORBIDDEN_KEYS: () => (/* binding */ INLINE_FORBIDDEN_KEYS),
/* harmony export */   INLINE_LIMITS: () => (/* binding */ INLINE_LIMITS),
/* harmony export */   INLINE_MARKS: () => (/* binding */ INLINE_MARKS),
/* harmony export */   INLINE_MODEL_VERSION: () => (/* binding */ INLINE_MODEL_VERSION),
/* harmony export */   INLINE_OBJECT: () => (/* binding */ INLINE_OBJECT),
/* harmony export */   INLINE_PROP_ALIASES: () => (/* binding */ INLINE_PROP_ALIASES),
/* harmony export */   INLINE_RESERVED_KEYS: () => (/* binding */ INLINE_RESERVED_KEYS),
/* harmony export */   breakSegment: () => (/* binding */ breakSegment),
/* harmony export */   currentInlineProps: () => (/* binding */ currentInlineProps),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   fromSegments: () => (/* binding */ fromSegments),
/* harmony export */   inlineComponentSchemas: () => (/* binding */ inlineComponentSchemas),
/* harmony export */   inlineComponentView: () => (/* binding */ inlineComponentView),
/* harmony export */   inlineExtensions: () => (/* binding */ inlineExtensions),
/* harmony export */   inlineLength: () => (/* binding */ inlineLength),
/* harmony export */   inlineText: () => (/* binding */ inlineText),
/* harmony export */   isInlineComponent: () => (/* binding */ isInlineComponent),
/* harmony export */   isInlineExtensionKey: () => (/* binding */ isInlineExtensionKey),
/* harmony export */   marksIn: () => (/* binding */ marksIn),
/* harmony export */   normalizeInline: () => (/* binding */ normalizeInline),
/* harmony export */   objectAt: () => (/* binding */ objectAt),
/* harmony export */   replaceRange: () => (/* binding */ replaceRange),
/* harmony export */   safeHref: () => (/* binding */ safeHref),
/* harmony export */   setLink: () => (/* binding */ setLink),
/* harmony export */   sliceInline: () => (/* binding */ sliceInline),
/* harmony export */   toSegments: () => (/* binding */ toSegments),
/* harmony export */   toggleMark: () => (/* binding */ toggleMark)
/* harmony export */ });
// Pure operations on the Composition inline content model used by
// content.heading and content.paragraph: text runs with strong, em, code and
// strike marks, soft line breaks ({type: 'break', marks?}), links whose
// children are text runs and breaks, and inline component atoms
// ({type: 'component', name, props}). No DOM access here.
//
// Inline model 1.2.0 (2026-11-10): the break and the mark strike. A break is
// one unit of offset, like a character: it takes marks and stands inside a
// link, and no operation removes one except a deletion of its own range.
//
// Every other entry -- a node from a newer producer, or an atom this model
// does not know -- is opaque: it holds one caret stop, takes no marks, and
// comes back out of every operation exactly as it went in. toSegments used
// to drop such entries, so an edit next to them lost them silently.
//
// Extension keys (2026-11-11, owner rule: no silent data loss): a key a
// newer producer adds to a known entry -- a text run's `lang`, a link's
// `title`, any other -- rides with that entry through every operation
// (normalize, typing, marks, links, slice, split, join, copy). Runs merge
// only when their extension keys are the same. Validation accepts a key as
// extension data when its name matches INLINE_EXTENSION_KEY (lowercase,
// not one of the model's own names, not on*, not a forbidden name such as
// style or class); render never draws one.

const INLINE_MARKS = Object.freeze(['strong', 'em', 'code', 'strike']);
const INLINE_MODEL_VERSION = '1.2.0';
const MARK_ORDER = new Map(INLINE_MARKS.map((mark, index) => [mark, index]));
const SAFE_SCHEMES = new Set(['http:', 'https:', 'mailto:', 'tel:']);

// The keys each known entry defines; any other key is extension data.
const OWN_KEYS = Object.freeze({ text: ['type', 'value', 'marks'], break: ['type', 'marks'], link: ['type', 'href', 'children'], component: ['type', 'name', 'props'] });
// Names an extension key may not take: the model's own (on any entry), an
// event handler (on*), and the Document's forbidden names (validation's
// FORBIDDEN_KEYS: executable, styling or secret data, F1.6).
const INLINE_RESERVED_KEYS = Object.freeze(['type', 'value', 'marks', 'href', 'children', 'name', 'props']);
const INLINE_FORBIDDEN_KEYS = Object.freeze([
  'html', 'innerhtml', 'script', 'javascript', 'php', 'eval', 'function',
  'expression', 'query', 'sql', 'graphql', 'class', 'classname', 'rootclass',
  'cssclass', 'style', 'secret', 'password', 'token', 'cookie', 'authorization', 'request',
]);
/** The name rule of an extension key, as a JSON Schema pattern (patternProperties). */
const INLINE_EXTENSION_KEY = `^(?!on)(?!(?:${[...INLINE_RESERVED_KEYS, ...INLINE_FORBIDDEN_KEYS].join('|')})$)[a-z][a-z0-9_.:]{0,63}$`;
const EXTENSION_PATTERN = new RegExp(INLINE_EXTENSION_KEY, 'u');
/** Whether a key is accepted as extension data on a known inline entry. */
const isInlineExtensionKey = (key) => EXTENSION_PATTERN.test(key);

// The extension keys of an entry: every key its type does not define, as it came.
function extensionsOf(entry, kind) {
  const own = OWN_KEYS[kind];
  const out = {};
  for (const [key, value] of Object.entries(entry)) if (!own.includes(key)) out[key] = clone(value);
  return Object.keys(out).length ? out : null;
}
/** The extension keys of a known entry (text, break, link, component), or null. */
function inlineExtensions(entry) {
  return isPlainEntry(entry) && Object.hasOwn(OWN_KEYS, entry.type) ? extensionsOf(entry, entry.type) : null;
}
// Extension keys compare by value: key order does not count, at any depth
// ({lang, title} and {title, lang} are the same keys, so their runs merge).
const sortedKeys = (value) => (Array.isArray(value) ? value.map(sortedKeys)
  : value !== null && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, sortedKeys(value[key])])) : value);
const sameExtra = (left, right) => JSON.stringify(sortedKeys(left ?? null)) === JSON.stringify(sortedKeys(right ?? null));
const INLINE_LIMITS = Object.freeze({ maxTextLength: 100000, maxHrefLength: 2048, maxPropLength: 1000 });

// The closed list of inline atoms. Each name draws one element; its props
// are that component's own settings, a string (text) or a token (a name the
// component reads from a fixed set) or a boolean. Nothing else is drawn, so
// no prop can become an event handler or markup.
const INLINE_COMPONENTS = Object.freeze({
  badge: Object.freeze({ tag: 'sf-badge', required: [], props: Object.freeze({ text: 'text', icon: 'token', appearance: 'token', scheme: 'token', status: 'token', size: 'token', 'icon-only': 'boolean', compact: 'boolean' }) }),
  kbd: Object.freeze({ tag: 'kbd', required: ['text'], props: Object.freeze({ text: 'text' }) }),
  icon: Object.freeze({ tag: 'sf-icon', required: ['icon'], props: Object.freeze({ icon: 'token', label: 'text', size: 'token', filled: 'boolean' }) }),
  button: Object.freeze({ tag: 'sf-button', required: [], props: Object.freeze({ text: 'text', icon: 'token', appearance: 'token', scheme: 'token', size: 'token' }) }),
});
// Dated prop aliases of an atom: the old prop is still accepted and drawn as
// the new one, until remove_after. The badge that shows its icon alone is
// icon-only (owner decision C134: the word compact means density only,
// sf-badge 1.6.0); compact is its alias in a Document, as on the element
// (journal property-inline-badge-compact-to-icon-only). An entry that has
// both draws the new one.
const INLINE_PROP_ALIASES = Object.freeze({
  badge: Object.freeze({ compact: Object.freeze({ to: 'icon-only', since: '2026-11-16', remove_after: '2027-01-01' }) }),
});
const aliasOf = (name, key) => INLINE_PROP_ALIASES[name]?.[key]?.to ?? null;

/** The atom's props under their current names: a dated alias moved to its new prop (the new prop wins). */
function currentInlineProps(name, props = {}) {
  const out = {};
  for (const [key, value] of Object.entries(props)) if (!aliasOf(name, key)) out[key] = value;
  for (const [key, value] of Object.entries(props)) {
    const to = aliasOf(name, key);
    if (to && !(to in out)) out[to] = value;
  }
  return out;
}
const TOKEN = '^[a-z0-9][a-z0-9_/-]{0,63}$';
const TOKEN_PATTERN = new RegExp(TOKEN, 'u');
// The one unit an atom or an opaque node holds in segment offsets.
const INLINE_OBJECT = '\ufffc';

/** JSON Schema of one inline atom per name, for the type manifests. */
function inlineComponentSchemas() {
  const prop = (kind) => (kind === 'boolean' ? { type: 'boolean' } : kind === 'token' ? { type: 'string', pattern: TOKEN } : { type: 'string', maxLength: INLINE_LIMITS.maxPropLength });
  return Object.entries(INLINE_COMPONENTS).map(([name, entry]) => ({
    type: 'object',
    required: ['type', 'name', ...(entry.required.length ? ['props'] : [])],
    additionalProperties: false,
    patternProperties: { [INLINE_EXTENSION_KEY]: {} },
    properties: {
      type: { const: 'component' },
      name: { const: name },
      props: {
        type: 'object',
        ...(entry.required.length ? { required: [...entry.required] } : {}),
        additionalProperties: false,
        properties: Object.fromEntries(Object.entries(entry.props).map(([key, kind]) => [key, prop(kind)])),
      },
    },
  }));
}

/** True for an atom whose name is declared and whose props are all declared and well typed. */
function isInlineComponent(node) {
  const entry = node?.type === 'component' && Object.hasOwn(INLINE_COMPONENTS, node.name) ? INLINE_COMPONENTS[node.name] : null;
  if (!entry) return false;
  if (Object.keys(node).some((key) => !['type', 'name', 'props'].includes(key) && !isInlineExtensionKey(key))) return false;
  const props = node.props ?? {};
  if (!props || typeof props !== 'object' || Array.isArray(props)) return false;
  if (entry.required.some((key) => !(key in props))) return false;
  return Object.entries(props).every(([key, value]) => {
    const kind = Object.hasOwn(entry.props, key) ? entry.props[key] : null;
    if (kind === 'boolean') return typeof value === 'boolean';
    if (kind === 'token') return typeof value === 'string' && TOKEN_PATTERN.test(value);
    return kind === 'text' && typeof value === 'string' && value.length <= INLINE_LIMITS.maxPropLength;
  });
}

/** The tag and attributes an atom draws as; text is a kbd's content. Values are raw: the caller escapes. */
function inlineComponentView(node) {
  if (!isInlineComponent(node)) return null;
  const entry = INLINE_COMPONENTS[node.name];
  const props = currentInlineProps(node.name, node.props ?? {});
  if (node.name === 'kbd') return { tag: entry.tag, attributes: [], text: props.text };
  const attributes = Object.keys(entry.props).filter((key) => key in props && props[key] !== false)
    .map((key) => [key, props[key] === true ? '' : props[key]]);
  return { tag: entry.tag, attributes, text: '' };
}

const clone = (value) => JSON.parse(JSON.stringify(value));
const isAtom = (entry) => entry?.type === 'component';
const isObjectEntry = (entry) => entry !== null && typeof entry === 'object' && !Array.isArray(entry) && entry.type !== 'text' && entry.type !== 'link' && !isBreak(entry);
// A break as the model knows it: type break, marks (if any) a list; any
// other key is its extension data.
const isBreak = (entry) => entry?.type === 'break' && (entry.marks === undefined || Array.isArray(entry.marks));

/** The segment of one soft line break: one unit, with the marks and link of its place. */
function breakSegment(marks = [], href = null, extra = null) {
  return { text: INLINE_OBJECT, marks: [...marks], href, break: true, ...(extra ? { extra } : {}) };
}

/** Same link rule as Document validation: relative, fragment or http(s)/mailto/tel. */
function safeHref(value) {
  if (typeof value !== 'string' || value.length < 1 || value.length > INLINE_LIMITS.maxHrefLength) return false;
  // Browsers read "/\\host" like "//host": backslashes never form a local link.
  if (/^(?:\/|\.?\.\/|#)/u.test(value)) return !value.startsWith('//') && !value.includes('\\');
  try {
    return SAFE_SCHEMES.has(new globalThis.URL(value).protocol);
  } catch {
    return false;
  }
}

// Known marks in their canonical order, then any mark this model does not
// know (a newer producer's), in the order it came: an edit never drops a mark
// it cannot draw. Validation still refuses an unknown mark; render draws none.
function sortMarks(marks) {
  const unique = [...new Set(marks)].filter((mark) => typeof mark === 'string' && mark);
  const known = unique.filter((mark) => MARK_ORDER.has(mark)).sort((left, right) => MARK_ORDER.get(left) - MARK_ORDER.get(right));
  return [...known, ...unique.filter((mark) => !MARK_ORDER.has(mark))];
}

/**
 * Flat segments: {text, marks: string[], href: string|null}. An atom or an
 * opaque node is one segment {text: INLINE_OBJECT, marks: [], href, node}
 * that carries the entry unchanged. An atom ({type: 'component'}) never
 * carries a link's href: a link holds no atom, so one that held an atom is
 * split around it. An opaque node from a newer producer keeps its link.
 */
function toSegments(content) {
  const segments = [];
  const push = (run, href, linkExtra) => {
    const link = href && linkExtra ? { linkExtra } : {};
    if (isBreak(run)) {
      segments.push({ ...breakSegment(sortMarks(run.marks || []), href, extensionsOf(run, 'break')), ...link });
      return;
    }
    if (isObjectEntry(run)) {
      segments.push({ text: INLINE_OBJECT, marks: [], href: isAtom(run) ? null : href, node: clone(run), ...(isAtom(run) ? {} : link) });
      return;
    }
    if (run?.type !== 'text' || typeof run.value !== 'string' || !run.value) return;
    const extra = extensionsOf(run, 'text');
    segments.push({ text: run.value, marks: sortMarks(Array.isArray(run.marks) ? run.marks : []), href, ...(extra ? { extra } : {}), ...link });
  };
  for (const entry of Array.isArray(content) ? content : []) {
    if (entry?.type === 'link') {
      // An unsafe link is dropped by design (its href and its extension keys); its text stays.
      const href = safeHref(entry.href) ? entry.href : null;
      const linkExtra = isPlainEntry(entry) ? extensionsOf(entry, 'link') : null;
      for (const child of Array.isArray(entry.children) ? entry.children : []) push(child, href, linkExtra);
    } else push(entry, null, null);
  }
  return segments;
}

const isPlainEntry = (entry) => entry !== null && typeof entry === 'object' && !Array.isArray(entry);
const sameStyle = (left, right) => !left.node && !right.node && !left.break && !right.break && left.href === right.href && left.marks.join() === right.marks.join()
  && sameExtra(left.extra, right.extra) && sameExtra(left.linkExtra, right.linkExtra);

/** Builds normalized content: merged runs, canonical marks, no empty parts. */
function fromSegments(segments) {
  const merged = [];
  for (const segment of segments) {
    // A link's extension keys go only where the link goes.
    const linked = (href) => (href && segment.linkExtra ? { linkExtra: segment.linkExtra } : {});
    if (segment.node) {
      // An atom is never inside a link: the link stops before it and starts again after.
      const href = !isAtom(segment.node) && segment.href && safeHref(segment.href) ? segment.href : null;
      merged.push({ text: INLINE_OBJECT, marks: [], href, node: segment.node, ...linked(href) });
      continue;
    }
    if (segment.break) {
      const href = segment.href && safeHref(segment.href) ? segment.href : null;
      merged.push({ ...breakSegment(sortMarks(segment.marks || []), href, segment.extra || null), ...linked(href) });
      continue;
    }
    if (!segment.text) continue;
    const cleanHref = segment.href && safeHref(segment.href) ? segment.href : null;
    const clean = { text: segment.text, marks: sortMarks(segment.marks || []), href: cleanHref, ...(segment.extra ? { extra: segment.extra } : {}), ...linked(cleanHref) };
    const previous = merged.at(-1);
    if (previous && sameStyle(previous, clean)) previous.text += clean.text;
    else merged.push(clean);
  }
  const content = [];
  for (const segment of merged) {
    const extra = segment.extra ? clone(segment.extra) : {};
    const run = segment.node ? clone(segment.node)
      : segment.break ? { type: 'break', ...(segment.marks.length ? { marks: segment.marks } : {}), ...extra }
        : { type: 'text', value: segment.text, ...(segment.marks.length ? { marks: segment.marks } : {}), ...extra };
    const previous = content.at(-1);
    if (segment.href) {
      if (previous?.type === 'link' && previous.href === segment.href && sameExtra(linkExtraOf(previous), segment.linkExtra)) previous.children.push(run);
      else content.push({ type: 'link', href: segment.href, ...(segment.linkExtra ? clone(segment.linkExtra) : {}), children: [run] });
    } else content.push(run);
  }
  return content;
}

const linkExtraOf = (link) => extensionsOf(link, 'link');

function normalizeInline(content) {
  return fromSegments(toSegments(content));
}

/** The text of the text runs, a line feed for each break; atoms and opaque nodes add nothing. */
function inlineText(content) {
  return toSegments(content).filter(({ node }) => !node).map((segment) => (segment.break ? '\n' : segment.text)).join('');
}

/** Length in segment offsets: characters, plus one for each atom or opaque node. */
function inlineLength(content) {
  return toSegments(content).reduce((sum, { text }) => sum + text.length, 0);
}

/** The atom or opaque node that holds offset [at, at + 1), or null. */
function objectAt(content, at) {
  let position = 0;
  for (const segment of toSegments(content)) {
    if (position === at && segment.node) return segment.node;
    position += segment.text.length;
    if (position > at) return null;
  }
  return null;
}

/** The segments of [start, end), for copying. */
function sliceInline(content, start, end) {
  const [from, to] = [Math.min(start, end), Math.max(start, end)];
  return fromSegments(range(content, from, to).filter(({ inside }) => inside).map(({ segment }) => segment));
}

function split(segments, offset) {
  const output = [];
  let position = 0;
  for (const segment of segments) {
    const end = position + segment.text.length;
    if (offset > position && offset < end) {
      output.push({ ...segment, text: segment.text.slice(0, offset - position) }, { ...segment, text: segment.text.slice(offset - position) });
    } else output.push(segment);
    position = end;
  }
  return output;
}

function range(content, start, end) {
  const segments = split(split(toSegments(content), start), end);
  let position = 0;
  return segments.map((segment) => {
    const from = position;
    position += segment.text.length;
    return { segment, inside: from >= start && position <= end && position > from };
  });
}

/** Marks and link shared by every character in [start, end). */
function marksIn(content, start, end) {
  // Atoms take no marks and no link, so they do not decide the state.
  const inside = range(content, Math.min(start, end), Math.max(start, end)).filter(({ inside: isInside, segment }) => isInside && !segment.node).map(({ segment }) => segment);
  if (!inside.length) return { marks: [], href: null };
  const marks = INLINE_MARKS.filter((mark) => inside.every((segment) => segment.marks.includes(mark)));
  const href = inside.every((segment) => segment.href === inside[0].href) ? inside[0].href : null;
  return { marks, href };
}

/** Adds the mark to [start, end) unless every character already has it. */
function toggleMark(content, start, end, mark) {
  if (!MARK_ORDER.has(mark) || start === end) return normalizeInline(content);
  const [from, to] = [Math.min(start, end), Math.max(start, end)];
  const remove = marksIn(content, from, to).marks.includes(mark);
  return fromSegments(range(content, from, to).map(({ segment, inside }) => (inside && !segment.node
    ? { ...segment, marks: remove ? segment.marks.filter((entry) => entry !== mark) : [...segment.marks, mark] }
    : segment)));
}

/** Sets or removes (href null) a link on [start, end); unsafe links are refused. */
function setLink(content, start, end, href) {
  if (href !== null && !safeHref(href)) throw new TypeError('inline_link_unsafe');
  const [from, to] = [Math.min(start, end), Math.max(start, end)];
  if (from === to) return normalizeInline(content);
  // An atom is never nested in a link: the link stops on each side of it.
  return fromSegments(range(content, from, to).map(({ segment, inside }) => (inside && !segment.node ? { ...segment, href } : segment)));
}

/** Replaces [start, end) with segments (typing, paste or deletion). */
function replaceRange(content, start, end, inserted) {
  const [from, to] = [Math.min(start, end), Math.max(start, end)];
  const parts = range(content, from, to);
  const before = parts.filter((_, index) => parts.slice(0, index + 1).reduce((sum, part) => sum + part.segment.text.length, 0) <= from).map(({ segment }) => segment);
  let consumed = 0;
  const after = [];
  for (const { segment } of parts) {
    const segmentStart = consumed;
    consumed += segment.text.length;
    if (segmentStart >= to) after.push(segment);
  }
  return fromSegments([...before, ...inserted, ...after]);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ INLINE_EXTENSION_KEY, INLINE_FORBIDDEN_KEYS, INLINE_RESERVED_KEYS, inlineExtensions, isInlineExtensionKey, INLINE_COMPONENTS, INLINE_MARKS, INLINE_MODEL_VERSION, INLINE_OBJECT, breakSegment, fromSegments, inlineComponentSchemas, inlineComponentView, inlineLength, inlineText, isInlineComponent, marksIn, normalizeInline, objectAt, replaceRange, safeHref, setLink, sliceInline, toSegments, toggleMark });


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

/***/ "504b63c18e7b"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   files: () => (/* binding */ files)
/* harmony export */ });
/* harmony import */ var _en_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("5bd53c217eca");
// Written by scripts/build-language-packs.mjs from src/core/lang/built-in.json
// (owner decision C282); do not edit. The words this bundle carries: the
// built-in languages' (en); every other language comes from
// a language file (core/lang/<code>.js or its parts).


const files = { en: { runtime: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime } };

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ en: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime });


/***/ },

/***/ "834c8c68675a"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-editor-inline for the shim (stands/18-aliases-ci/alias.mjs, standard §16 item 20). mode: same-detail (the shim sends the new and the old name), split / detail-adds (a detail adapter, refused by the shim), attribute-and-property, method, property, manifest-only (the DOM name does not change), host-attribute (no shim), retired. These events are sent on the edited element, which carries no shim: core/js/composition/inline-editor.mjs sends each former name itself, with its former detail.","component":"sf-editor-inline","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"sf-inline-edit-input","to":"sf-editor-inline-input","kind":"event","component":"sf-editor-inline","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":false,"manifest":{"from":"sf-inline-edit-input","to":"input"},"section":"§8, vocabulary 1.1.5","note":"sent by the module after the new name; detail {node_id, content}"},{"from":"sf-inline-edit-commit","to":"sf-editor-inline-change","kind":"event","component":"sf-editor-inline","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":false,"manifest":{"from":"sf-inline-edit-commit","to":"change"},"section":"§8, vocabulary 1.1.5","note":"sent by the module after the new name; detail {node_id, content}"},{"from":"sf-inline-edit-cancel","to":"sf-editor-inline-cancel","kind":"event","component":"sf-editor-inline","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":false,"manifest":{"from":"sf-inline-edit-cancel","to":"cancel"},"section":"§8, vocabulary 1.1.5","note":"sent by the module after the new name; detail {node_id}"},{"from":"sf-inline-editor","to":"sf-editor-inline","kind":"tag","component":"sf-editor-inline","since":"2026-11-03","remove_after":"2027-01-01","section":"rename plan R0 (ui-control RENAME-PLAN-2026-11-03), naming decision 2026-11-02","note":"the element is sf-editor-inline; sf-inline-editor is a subclass defined beside it until the date"},{"from":"sf-inline-editor-input","to":"sf-editor-inline-input","kind":"event","component":"sf-editor-inline","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-inline-editor-change","to":"sf-editor-inline-change","kind":"event","component":"sf-editor-inline","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-inline-editor-cancel","to":"sf-editor-inline-cancel","kind":"event","component":"sf-editor-inline","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"}]}');

/***/ },

/***/ "243fec56a554"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.editor-inline","tag":"sf-editor-inline","version":"1.12.2","kind":"leaf","settings":{},"values":{},"events":{"input":{"carries":{"id":{"type":"string","nullable":true},"content":{"type":"list","of":{"type":"string","value":"string","marks":"list","href":"string"}}},"x-native":false},"change":{"carries":{"id":{"type":"string","nullable":true},"content":{"type":"list","of":{"type":"string","value":"string","marks":"list","href":"string"}}},"x-native":false},"cancel":{"carries":{"id":{"type":"string","nullable":true}}}},"actions":{"edit":{"with":{"element":"object","options":"object"}}},"css-variables":{"--sf-inline-editor-outline-color":{"type":"color","state":"editing"},"--sf-inline-editor-toolbar-background-color":{"type":"color","state":"editing"},"--sf-inline-editor-toolbar-radius":{"type":"length","state":"editing"},"--sf-inline-editor-toolbar-gap":{"type":"length","state":"editing"},"--sf-inline-editor-toolbar-padding":{"type":"length","state":"editing"}}}');

/***/ },

/***/ "5bd53c217eca"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Inline editor","runtime":{"apply":"Apply","code":"Code","editing":"{label}: editing. Enter saves, Escape cancels.","editing-block":"{label}: editing. Enter starts a new block, Escape cancels.","em":"Italic","invalid":"Invalid link address","link":"Link","link-empty":"Enter the link address","link-hint":"https://…, mailto:, tel: or a path on this site such as /about","link-long":"The address is longer than {max} characters","link-scheme":"This address is not allowed: start with https://, mailto: or tel:","link-slashes":"An address on this site starts with a single slash /","link-spaces":"Remove the spaces: an address has none","link-start":"The address has no start: https://, or / for a page of this site","more":"More","strong":"Bold","toolbar":"Formatting","unlink":"Remove link","url":"Link address","strike":"Strikethrough"}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("b77e802bd89d");
/******/
/******/ })()
;