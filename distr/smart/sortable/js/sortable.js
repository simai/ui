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

/***/ "6064f55a0aa2"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_composition_sortable_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("7c1f9c2b36da");
/* harmony import */ var _core_js_composition_sortable_inserter_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("96c896bdd1c2");
/* harmony import */ var _core_js_composition_manifest_host_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("6b629b4c1b7e");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("34bb89f847b9");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("6faa2d48a2c0");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("fca41e9837f0");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("46c0e03c9179");
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("8185ae1e4765");
/* harmony import */ var _core_js_composition_sortable_move_menu_mjs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("269d4777d276");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_composition_sortable_mjs__WEBPACK_IMPORTED_MODULE_0__, _core_js_composition_sortable_inserter_mjs__WEBPACK_IMPORTED_MODULE_1__, _core_js_composition_manifest_host_mjs__WEBPACK_IMPORTED_MODULE_2__, _core_js_composition_sortable_move_menu_mjs__WEBPACK_IMPORTED_MODULE_8__]);
([_core_js_composition_sortable_mjs__WEBPACK_IMPORTED_MODULE_0__, _core_js_composition_sortable_inserter_mjs__WEBPACK_IMPORTED_MODULE_1__, _core_js_composition_manifest_host_mjs__WEBPACK_IMPORTED_MODULE_2__, _core_js_composition_sortable_move_menu_mjs__WEBPACK_IMPORTED_MODULE_8__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
// Smart entry for sf-sortable. The loader fetches this bundle only when the
// page has an <sf-sortable> list, so pages without an editor keep core.js small.
//
// From its component.json (standard simai.smart-component 1.3.8 §3, §4, §8):
// the list is defined over the class core/js/composition/manifest-host.mjs
// makes from it -- the settings' properties, the words, the dated aliases --
// and asks sf-sortable-move (vocabulary 1.1.5 §5 move), the old
// sf-sortable-intent following until 2026-12-01.






 // Only the words on screen ship in the bundle; the title, settings and events
// stay in the language files for the Studio and the docs (localization study LC-2).

const en = {
  runtime: _lang_en_json__WEBPACK_IMPORTED_MODULE_5__.runtime
};
const ru = {
  runtime: _lang_ru_json__WEBPACK_IMPORTED_MODULE_6__.runtime
};

 // Defined with its insertion point and inserter (inserter-items, opt-in) and
// the handle's move menu (C171 (1)). They come with this bundle only: the
// composition overlay carries the drag module too and has no use for them.

(0,_core_js_composition_sortable_mjs__WEBPACK_IMPORTED_MODULE_0__.defineSortable)((0,_core_js_composition_sortable_move_menu_mjs__WEBPACK_IMPORTED_MODULE_8__.moveMenuRegistry)((0,_core_js_composition_sortable_inserter_mjs__WEBPACK_IMPORTED_MODULE_1__.inserterRegistry)()), {
  base: (0,_core_js_composition_manifest_host_mjs__WEBPACK_IMPORTED_MODULE_2__.manifestHost)(_component_json__WEBPACK_IMPORTED_MODULE_3__, {
    lang: {
      en,
      ru
    },
    source: 'ru',
    aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_4__
  })
});
globalThis.SF = globalThis.SF || {}; // attach: sf-sortable's pointer behaviour on any container (the column mode).

globalThis.SF.Sortable = Object.freeze({
  SORTABLE_INSERT_EVENT: _core_js_composition_sortable_inserter_mjs__WEBPACK_IMPORTED_MODULE_1__.SORTABLE_INSERT_EVENT,
  SORTABLE_INTENT_EVENT: _core_js_composition_sortable_mjs__WEBPACK_IMPORTED_MODULE_0__.SORTABLE_INTENT_EVENT,
  SORTABLE_MOVE_EVENT: _core_js_composition_sortable_mjs__WEBPACK_IMPORTED_MODULE_0__.SORTABLE_MOVE_EVENT,
  SORTABLE_STATE_EVENT: _core_js_composition_sortable_mjs__WEBPACK_IMPORTED_MODULE_0__.SORTABLE_STATE_EVENT,
  activeSortableSession: _core_js_composition_sortable_mjs__WEBPACK_IMPORTED_MODULE_0__.activeSortableSession,
  attach: _core_js_composition_sortable_mjs__WEBPACK_IMPORTED_MODULE_0__.attachSortable,
  attachSortable: _core_js_composition_sortable_mjs__WEBPACK_IMPORTED_MODULE_0__.attachSortable,
  registerSortableDropTarget: _core_js_composition_sortable_mjs__WEBPACK_IMPORTED_MODULE_0__.registerSortableDropTarget,
  sortableIndexAt: _core_js_composition_sortable_mjs__WEBPACK_IMPORTED_MODULE_0__.sortableIndexAt
});
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "8185ae1e4765"
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

/***/ "96c896bdd1c2"
(__webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SORTABLE_INSERT_EVENT: () => (/* binding */ SORTABLE_INSERT_EVENT),
/* harmony export */   createSortableInserter: () => (/* binding */ createSortableInserter),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   inserterRegistry: () => (/* binding */ inserterRegistry),
/* harmony export */   insertionGeometry: () => (/* binding */ insertionGeometry),
/* harmony export */   nearestInsertion: () => (/* binding */ nearestInsertion),
/* harmony export */   withSortableInserter: () => (/* binding */ withSortableInserter)
/* harmony export */ });
/* harmony import */ var _page_language_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("43090d1c8307");
/* harmony import */ var _sortable_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("7c1f9c2b36da");
/* harmony import */ var _overflow_row_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("2db3a835ac11");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_page_language_js__WEBPACK_IMPORTED_MODULE_0__, _sortable_mjs__WEBPACK_IMPORTED_MODULE_1__]);
([_page_language_js__WEBPACK_IMPORTED_MODULE_0__, _sortable_mjs__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
// The insertion point of sf-sortable and the inserter it opens. A block editor
// asks for a "+" exactly where the next block goes -- between two rows, before
// the first, after the last -- that opens a searchable list of the kinds of
// thing that can go there (simai/ui-source#21; ui-mail redesign F4, 2026-10-22:
// "Добавить" always appended to the end, so every insert needed a later move).
// It is the same need in every editor built on a list -- mail, Docara studio,
// admin forms -- so it belongs to the list, not to each editor.
//
// The component reports the choice and creates nothing: the host hears
// sf-sortable-insert with the place and the kind, builds the item and puts it
// in the list, exactly as it applies sf-sortable-intent. The inserter is the
// Framework's standard menu (sf-menu-context, opened with openFor and its own
// local search), so its rows, its keys, its top layer and its Escape are the
// ones every other menu has; nothing here draws a second popover.
//
// It is opt-in: a list without inserter items gets a controller that draws
// nothing and listens to nothing, so every list written before is the list it
// was, its drag included. The drag module itself (sortable.mjs) is not changed:
// the element is extended here (withSortableInserter).




const SORTABLE_INSERT_EVENT = 'sf-sortable-insert';

const ITEM = '[data-sf-sortable-item]';

const MESSAGES = {
  ru: {
    point: 'Вставить: позиция {index} из {total}',
    menu: 'Вставить',
    search: 'Найти',
    empty: 'Ничего не найдено',
    inserted: 'Вставлено: {item}, позиция {index} в «{list}».',
    hint: 'Плюс — вставить после.',
  },
  en: {
    point: 'Insert: position {index} of {total}',
    menu: 'Insert',
    search: 'Find',
    empty: 'Nothing found',
    inserted: 'Inserted {item} at position {index} in “{list}”.',
    hint: 'Plus to insert after.',
  },
};

const format = (template, values) => template.replace(/\{(\w+)\}/gu, (_, key) => String(values[key] ?? ''));
const text = (key) => (0,_page_language_js__WEBPACK_IMPORTED_MODULE_0__.pageText)(MESSAGES, key, undefined, 'sf-sortable');

function items(list) {
  return [...list.querySelectorAll(ITEM)].filter((item) => item.closest('sf-sortable') === list);
}

function listName(list) {
  return list.getAttribute('label') || list.getAttribute('aria-label') || list.getAttribute('group') || '';
}

// The same test the drag uses: two items side by side on one row make a grid,
// and a grid is read row by row.
function isWrapped(all) {
  for (let position = 1; position < all.length; position += 1) {
    const previous = all[position - 1].getBoundingClientRect();
    const current = all[position].getBoundingClientRect();
    if (current.top < previous.bottom - 1 && current.left >= previous.right - 1) return true;
  }
  return false;
}

/**
 * Where the place `index` is, in viewport coordinates: a line across the list
 * (axis "y", a vertical list), down it (axis "x", a horizontal one), or down the
 * side of one cell of a grid. `at` is the line's position on its axis -- the
 * middle of the gap between two items, so the point sits on the gap and not on
 * either item -- and `start`/`end` its extent across.
 */
function insertionGeometry(list, all, index) {
  const box = list.getBoundingClientRect();
  const inner = {
    left: box.left + list.clientLeft, top: box.top + list.clientTop,
    width: list.clientWidth, height: list.clientHeight,
  };
  const horizontal = list.getAttribute('orientation') === 'horizontal';
  const before = all[index]?.getBoundingClientRect();
  const after = all[index - 1]?.getBoundingClientRect();
  if (!horizontal && isWrapped(all)) {
    const cell = before ?? after;
    if (!cell) return { axis: 'y', at: inner.top + inner.height / 2, start: inner.left, end: inner.left + inner.width };
    const sameRow = before && after && after.top < before.bottom - 1 && before.left >= after.right - 1;
    const at = before ? (sameRow ? (after.right + before.left) / 2 : before.left) : after.right;
    return { axis: 'x', at, start: cell.top, end: cell.bottom };
  }
  if (horizontal) {
    const at = before && after ? (after.right + before.left) / 2 : before ? before.left : after ? after.right : inner.left + inner.width / 2;
    return { axis: 'x', at, start: inner.top, end: inner.top + inner.height };
  }
  const at = before && after ? (after.bottom + before.top) / 2 : before ? before.top : after ? after.bottom : inner.top + inner.height / 2;
  return { axis: 'y', at, start: inner.left, end: inner.left + inner.width };
}

/**
 * The place nearest a pointer, and how far it is: across a vertical list only
 * the height counts, along a horizontal one only the width; a grid's place is
 * a side of a cell and counts only on that cell's row.
 */
function nearestInsertion(list, all, x, y) {
  let best = null;
  for (let index = 0; index <= all.length; index += 1) {
    const place = insertionGeometry(list, all, index);
    const along = place.axis === 'y' ? y : x;
    const across = place.axis === 'y' ? x : y;
    if (across < place.start || across > place.end) continue;
    const distance = Math.abs(along - place.at);
    if (!best || distance < best.distance) best = { index, distance, place };
  }
  return best;
}

function toEntries(list) {
  return list.inserterItems.flatMap((item) => {
    if (!item || typeof item !== 'object') return [];
    if (item.type === 'separator') return [{ type: 'separator' }];
    if (item.type === 'heading') return [{ type: 'heading', text: String(item.label ?? '') }];
    if (item.value === undefined || item.value === null) return [];
    return [{
      id: String(item.value), text: String(item.label ?? item.value),
      icon: item.icon || undefined, caption: item.caption || undefined,
      keywords: item.keywords || undefined, disabled: Boolean(item.disabled),
    }];
  });
}

/**
 * The controller one list owns. connect/disconnect follow the list; refresh
 * follows its inserter items; ensure follows a host redraw of its children.
 */
function createSortableInserter(list) {
  let connected = false;
  let active = false;
  let wiring = null;
  let control = null;
  let button = null;
  let menu = null;
  let menuIndex = 0;
  // The place the point stands at, and why it is shown: a pointer near a gap,
  // a focused row (its place after it), the point's own focus or its menu.
  let point = 0;
  let hover = null;
  let rowFocus = null;

  const document_ = () => globalThis.document;
  const count = () => items(list).length;
  const clamp = (index) => Math.max(0, Math.min(count(), index));

  function build() {
    control = document_().createElement('div');
    control.className = 'sf-sortable-insert';
    control.setAttribute('data-sf-sortable-insert', '');
    // A native icon button of the Framework's smallest rung: its height, its
    // glyph and its padding are the ladder's (1/3), and its look is the quiet
    // surface one a row action has, so it reads the same on any canvas.
    button = document_().createElement('button');
    button.type = 'button';
    // Under a finger the point is the phone's step 36 (rung 1 at a phone's
    // width) and answers on a 44 target (its sheet): a 24 circle was below a
    // finger (SO-5).
    const finger = Boolean(globalThis.matchMedia?.('(pointer: coarse)')?.matches);
    const rung = finger ? 'sf-icon-button--size-1' : 'sf-icon-button--size-1/3';
    button.className = `sf-icon-button sf-icon-button--icon sf-icon-button--tonal sf-icon-button--on-surface ${rung} sf-sortable-insert-button`;
    button.setAttribute('aria-haspopup', 'menu');
    button.setAttribute('aria-expanded', 'false');
    const glyph = document_().createElement('i');
    glyph.className = 'sf-icon';
    glyph.setAttribute('aria-hidden', 'true');
    glyph.textContent = 'add';
    button.append(glyph);
    control.append(button);
  }

  // The point after the last item in the document, so it is the list's last tab
  // stop: Tab from the last row reaches it and Tab from it leaves the list, and
  // nothing is trapped. A host that appends its redrawn items after the
  // component's own nodes would otherwise put the point in front of them.
  function ensure() {
    if (!active || !control) return;
    const last = items(list).at(-1);
    const misplaced = control.parentNode !== list
      || Boolean(last && (control.compareDocumentPosition(last) & globalThis.Node.DOCUMENT_POSITION_FOLLOWING));
    if (misplaced) {
      const focused = document_().activeElement === button;
      list.append(control);
      // Moving a focused node drops its focus; the person keeps their place.
      if (focused) button.focus({ preventScroll: true });
    }
    // The rows moved under it: the place is measured again.
    place();
  }

  function shownReason() {
    if ((0,_sortable_mjs__WEBPACK_IMPORTED_MODULE_1__.activeSortableSession)()) return null;
    if (menu?.isOpen) return 'menu';
    if (document_().activeElement === button) return 'focus';
    if (hover !== null) return 'hover';
    if (rowFocus !== null) return 'row';
    return null;
  }

  function place() {
    if (!active || !control) return;
    const reason = shownReason();
    if (reason === 'hover') point = hover;
    else if (reason === 'row') point = rowFocus;
    point = clamp(point);
    const all = items(list);
    const geometry = insertionGeometry(list, all, point);
    const box = list.getBoundingClientRect();
    const originX = box.left + list.clientLeft - list.scrollLeft;
    const originY = box.top + list.clientTop - list.scrollTop;
    control.dataset.axis = geometry.axis;
    if (geometry.axis === 'y') {
      Object.assign(control.style, { left: `${geometry.start - originX}px`, top: `${geometry.at - originY}px`, width: `${geometry.end - geometry.start}px`, height: '0px' });
    } else {
      Object.assign(control.style, { left: `${geometry.at - originX}px`, top: `${geometry.start - originY}px`, width: '0px', height: `${geometry.end - geometry.start}px` });
    }
    control.toggleAttribute('data-shown', Boolean(reason));
    control.dataset.index = String(point);
    button.setAttribute('aria-label', format(text('point'), { index: point + 1, total: all.length + 1 }));
  }

  // Pointer: the point comes to the gap the pointer is near, within half the
  // point's own height of it -- near enough to mean the gap, not the row.
  function onPointerMove(event) {
    if (event.buttons || (0,_sortable_mjs__WEBPACK_IMPORTED_MODULE_1__.activeSortableSession)() || menu?.isOpen) return;
    if (control.contains(event.target)) return;
    const zone = Math.max(button.offsetHeight, button.offsetWidth) / 2;
    const nearest = nearestInsertion(list, items(list), event.clientX, event.clientY);
    const next = nearest && nearest.distance <= zone ? nearest.index : null;
    if (next === hover) return;
    hover = next;
    place();
  }

  function onPointerLeave() {
    if (hover === null) return;
    hover = null;
    place();
  }

  // A focused row shows the place after it: the place its "+" key opens, and
  // the one a tap on a touch screen, which has no hover, can reach.
  function onFocusIn(event) {
    const item = event.target.closest?.(ITEM);
    if (event.target === button) {
      place();
      return;
    }
    rowFocus = item && item.closest('sf-sortable') === list ? items(list).indexOf(item) + 1 : null;
    place();
  }

  function onFocusOut() {
    globalThis.setTimeout(() => {
      if (!connected) return;
      if (!list.contains(document_().activeElement)) rowFocus = null;
      place();
    }, 0);
  }

  // The point's own keys: the arrows of the list's direction walk the places,
  // Home and End go to the first and the last, and each step is said. Enter
  // and Space are the button's own.
  function onButtonKeyDown(event) {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const horizontal = list.getAttribute('orientation') === 'horizontal';
    const rtl = globalThis.getComputedStyle(list).direction === 'rtl';
    const steps = horizontal
      ? { ArrowLeft: rtl ? 1 : -1, ArrowRight: rtl ? -1 : 1, ArrowUp: -1, ArrowDown: 1 }
      : { ArrowUp: -1, ArrowDown: 1, ArrowLeft: -1, ArrowRight: 1 };
    let next = null;
    if (event.key in steps) next = point + steps[event.key];
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = count();
    if (next === null) return;
    event.preventDefault();
    hover = null;
    rowFocus = null;
    point = clamp(next);
    place();
    list.announce?.(format(text('point'), { index: point + 1, total: count() + 1 }));
  }

  function onButtonClick(event) {
    event.preventDefault();
    if (menu?.isOpen) {
      menu.close();
      return;
    }
    open(point);
  }

  // The standard menu, placed by core's one helper (overflow-row.js
  // standardMenu, defect TL-8), held on the list.
  async function standardMenu() {
    menu = await (0,_overflow_row_js__WEBPACK_IMPORTED_MODULE_2__.standardMenu)(list, '_sfInserterMenu', null, {
      setup(surface) {
        surface.addEventListener('sf-menu-context-select', onSelect);
        surface.addEventListener('sf-menu-context-closed', () => { button?.setAttribute('aria-expanded', 'false'); place(); });
        // Enter in the search takes the first row it left: whoever typed the name
        // of what they want has chosen it. The menu's own Enter is a row's.
        surface.addEventListener('keydown', (event) => {
          if (event.key !== 'Enter' || event.defaultPrevented || event.target !== surface.searchField?.()) return;
          event.preventDefault();
          surface.syncMenuItems?.();
          surface.availableMenuItems?.()[0]?.click();
        });
      },
    });
    return menu;
  }

  /** Opens the inserter for the place `index` (0 before the first item). */
  async function open(index) {
    if (!active || (0,_sortable_mjs__WEBPACK_IMPORTED_MODULE_1__.activeSortableSession)()) return false;
    point = clamp(index);
    hover = null;
    place();
    const surface = await standardMenu();
    if (!surface || !active) return false;
    menuIndex = point;
    surface.setAttribute('aria-label', listName(list) ? `${text('menu')}: ${listName(list)}` : text('menu'));
    surface.search = { placeholder: text('search'), empty: text('empty') };
    surface.entries = toEntries(list);
    // openFor answers an outcome (sf-menu-context 1.12.2); a menu of an earlier
    // pair answered a boolean. The inserter's own answer stays a boolean.
    const answer = await surface.openFor(button, { side: 'block-end', align: 'start', focus: 'first' });
    place();
    return answer === true || answer?.outcome === 'applied';
  }

  // A choice is the host's to apply: it hears the place and the kind, and a
  // refusal (preventDefault) leaves the inserter open for another choice. The
  // menu is closed here rather than by itself, so a host that moved focus to
  // the item it just inserted keeps it there.
  function onSelect(event) {
    event.preventDefault();
    const entry = event.detail?.entry;
    if (!entry || entry.id === undefined || entry.id === null) return;
    const index = menuIndex;
    const accepted = list.dispatchEvent(new globalThis.CustomEvent(SORTABLE_INSERT_EVENT, {
      bubbles: true, composed: true, cancelable: true,
      detail: Object.freeze({ index, item: entry.id, to: list.getAttribute('id') || list.getAttribute('group') || '' }),
    }));
    if (!accepted) return;
    list.announce?.(format(text('inserted'), { item: entry.text ?? entry.id, index: index + 1, list: listName(list) }));
    // The next insert goes after this one, so a run of choices builds in order.
    point = index + 1;
    const focusMoved = !menu.contains(document_().activeElement);
    menu.close({ restoreFocus: !focusMoved });
  }

  function onItemKeyDown(event, item) {
    if (!active || event.key !== '+' || event.altKey || event.ctrlKey || event.metaKey) return false;
    event.preventDefault();
    open(items(list).indexOf(item) + 1);
    return true;
  }

  function onSortableState() {
    hover = null;
    place();
  }

  function mount() {
    if (!control) build();
    wiring = new globalThis.AbortController();
    const options = { signal: wiring.signal };
    list.setAttribute('data-sf-sortable-inserter', '');
    list.addEventListener('pointermove', onPointerMove, options);
    list.addEventListener('pointerleave', onPointerLeave, options);
    list.addEventListener('focusin', onFocusIn, options);
    list.addEventListener('focusout', onFocusOut, options);
    list.addEventListener('sf-sortable-state', onSortableState, options);
    button.addEventListener('keydown', onButtonKeyDown, options);
    button.addEventListener('click', onButtonClick, options);
    // The icon button's look and the glyph's font are component stylesheets:
    // asked for here, and named as relations of the rule, so a page without
    // them still gets them.
    globalThis.SF?.Loader?.ensurePlugin?.('icon-buttons');
    globalThis.SF?.Loader?.ensurePlugin?.('icons');
    active = true;
    ensure();
    place();
  }

  function unmount() {
    active = false;
    wiring?.abort();
    wiring = null;
    menu?.close?.({ restoreFocus: false });
    control?.remove();
    list.removeAttribute('data-sf-sortable-inserter');
    hover = null;
    rowFocus = null;
  }

  function refresh() {
    const wanted = connected && list.inserterItems.length > 0;
    if (wanted && !active) mount();
    else if (!wanted && active) unmount();
    else if (wanted && menu?.isOpen) menu.entries = toEntries(list);
    list.updateInstructions?.();
  }

  return {
    connect() { connected = true; refresh(); },
    disconnect() {
      connected = false;
      if (active) unmount();
      menu?.remove();
      menu = null;
    },
    refresh,
    ensure,
    open,
    onItemKeyDown,
    instructions: () => (active ? text('hint') : ''),
    get active() { return active; },
    get index() { return point; },
  };
}

/**
 * sf-sortable with an inserter: the drag element of sortable.mjs, extended.
 * It is an extension rather than an edit of that module because the
 * composition overlay's bundle carries sortable.mjs too (for the shared drag
 * session) and has no use for an inserter; extending it here keeps the
 * inserter in the sf-sortable bundle alone and the drag module as it was.
 */
function withSortableInserter(Base) {
  return class SfSortable extends Base {
    static get observedAttributes() {
      return [...(super.observedAttributes ?? []), 'inserter-items'];
    }

    constructor() {
      super();
      this.inserterController = null;
      this._inserterHint = '';
      // Set before the element was defined, the value sat on the instance and
      // would hide the accessor; it is taken over here, as sf-context-menu
      // takes over its entries.
      if (Object.prototype.hasOwnProperty.call(this, 'inserterItems')) {
        const early = this.inserterItems;
        delete this.inserterItems;
        this._inserterItems = Array.isArray(early) ? early : null;
      }
    }

    // What the inserter offers: [{value, label, icon?, caption?, keywords?,
    // disabled?}], as a property or as JSON in the inserter-items attribute.
    // An empty list is no inserter, and the list is the list it was before.
    get inserterItems() {
      if (Array.isArray(this._inserterItems)) return this._inserterItems;
      const raw = this.getAttribute('inserter-items');
      if (!raw) return [];
      try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }

    set inserterItems(value) {
      this._inserterItems = Array.isArray(value) ? value : null;
      this.inserterController?.refresh();
    }

    attributeChangedCallback(name, previous, next) {
      super.attributeChangedCallback?.(name, previous, next);
      if (name === 'inserter-items' && previous !== next) this.inserterController?.refresh();
    }

    connectedCallback() {
      super.connectedCallback();
      if (!this.inserterController) this.inserterController = createSortableInserter(this);
      this.inserterController.connect();
    }

    disconnectedCallback() {
      this.inserterController?.disconnect();
      super.disconnectedCallback();
    }

    // The instructions every item points at say the inserter's key while the
    // list has one. The drag module writes its own sentence; the hint follows it.
    updateInstructions() {
      if (!this.instructions) return;
      const current = this.instructions.textContent;
      const own = this._inserterHint && current.endsWith(` ${this._inserterHint}`)
        ? current.slice(0, -(this._inserterHint.length + 1))
        : current;
      const hint = this.inserterController?.instructions() || '';
      const next = hint ? `${own} ${hint}` : own;
      this._inserterHint = hint;
      // Written only when it changes: the list observes its own subtree, and a
      // write would wake the observer that called this.
      if (next !== current) this.instructions.textContent = next;
    }

    // A host redraw takes the component's nodes out with its own, or leaves the
    // insertion point in front of the items it appends: both come back.
    ensureAccessibilityNodes() {
      super.ensureAccessibilityNodes();
      this.updateInstructions();
      this.inserterController?.ensure();
    }

    // The inserter's key on a row ("+": insert after it) comes before the
    // drag's keys; anything else is the drag's.
    onKeyDown(event) {
      const item = event.target.closest?.(ITEM);
      if (!(0,_sortable_mjs__WEBPACK_IMPORTED_MODULE_1__.activeSortableSession)() && item && item.closest('sf-sortable') === this && event.target === item
          && this.inserterController?.onItemKeyDown(event, item)) return;
      super.onKeyDown(event);
    }
  };
}

// The registry sf-sortable is defined in, through which it is defined with its
// inserter: defineSortable takes the registry it defines into.
function inserterRegistry(registry = globalThis.customElements) {
  return {
    get: (name) => registry.get(name),
    define: (name, Base, options) => registry.define(name, withSortableInserter(Base), options),
  };
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ SORTABLE_INSERT_EVENT, createSortableInserter, inserterRegistry, insertionGeometry, nearestInsertion, withSortableInserter });

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "269d4777d276"
(__webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createSortableMoveMenu: () => (/* binding */ createSortableMoveMenu),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   moveMenuEntries: () => (/* binding */ moveMenuEntries),
/* harmony export */   moveMenuRegistry: () => (/* binding */ moveMenuRegistry),
/* harmony export */   moveMenuTarget: () => (/* binding */ moveMenuTarget),
/* harmony export */   withSortableMoveMenu: () => (/* binding */ withSortableMoveMenu)
/* harmony export */ });
/* harmony import */ var _page_language_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("43090d1c8307");
/* harmony import */ var _sortable_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("7c1f9c2b36da");
/* harmony import */ var _overflow_row_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("2db3a835ac11");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_page_language_js__WEBPACK_IMPORTED_MODULE_0__, _sortable_mjs__WEBPACK_IMPORTED_MODULE_1__]);
([_page_language_js__WEBPACK_IMPORTED_MODULE_0__, _sortable_mjs__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
// The handle's menu of sf-sortable (owner C171 (1), 2026-11-14): a press on a
// row's handle -- a press that did not become a drag -- opens the standard
// menu «Выше · Ниже · В начало · В конец». A person who cannot drag, or who
// does not want to carry a row down a long list, moves it in one choice; the
// keyboard path on the row stays as it was. Nothing is moved here: the choice
// asks the host with the very request a drag ends with (sf-sortable-move) and
// is said with the same words.
//
// The menu is sf-menu-context, fetched on the first press (it is a lazy
// relation of the rule already, for the inserter), so its rows, keys, top layer
// and Escape are every menu's. Like the inserter, this is an extension of the
// drag element in the sf-sortable bundle only: the editor overlay's bundle
// carries the drag module and has handles of its own.




const ITEM = '[data-sf-sortable-item]';
const HANDLE = '[data-sf-sortable-handle]';

const MESSAGES = {
  ru: {
    'move-menu': 'Переместить «{item}»',
    'move-up': 'Выше',
    'move-down': 'Ниже',
    'move-first': 'В начало',
    'move-last': 'В конец',
  },
  en: {
    'move-menu': 'Move “{item}”',
    'move-up': 'Up',
    'move-down': 'Down',
    'move-first': 'To the top',
    'move-last': 'To the bottom',
  },
};

const format = (template, values) => template.replace(/\{(\w+)\}/gu, (_, key) => String(values[key] ?? ''));
const text = (key) => (0,_page_language_js__WEBPACK_IMPORTED_MODULE_0__.pageText)(MESSAGES, key, undefined, 'sf-sortable');

function items(list) {
  return [...list.querySelectorAll(ITEM)].filter((item) => item.closest('sf-sortable') === list);
}

function itemLabel(item) {
  if (item.getAttribute('aria-label')) return item.getAttribute('aria-label');
  const clone = item.cloneNode(true);
  for (const hidden of clone.querySelectorAll('[aria-hidden="true"], .sf-sortable-live')) hidden.remove();
  return clone.textContent.replace(/\s+/gu, ' ').trim();
}

// The control a handle is: itself when it is a button, else the button inside
// it (sf-button-icon draws one), else the handle element.
function controlOf(handle) {
  if (handle.matches('button')) return handle;
  return handle.querySelector('button') || handle;
}

/** The places a move menu offers for the item at `index` of `count`. */
function moveMenuEntries(index, count) {
  const last = count - 1;
  return [
    { id: 'up', text: text('move-up'), icon: 'arrow_upward', disabled: index <= 0 },
    { id: 'down', text: text('move-down'), icon: 'arrow_downward', disabled: index >= last },
    { type: 'separator' },
    { id: 'first', text: text('move-first'), icon: 'vertical_align_top', disabled: index <= 0 },
    { id: 'last', text: text('move-last'), icon: 'vertical_align_bottom', disabled: index >= last },
  ];
}

/** The place an entry moves the item at `index` of `count` to. */
function moveMenuTarget(id, index, count) {
  return { up: index - 1, down: index + 1, first: 0, last: count - 1 }[id] ?? index;
}

function createSortableMoveMenu(list) {
  let wiring = null;
  let menu = null;
  let current = null;

  function prepare(only = null) {
    for (const item of only ? [only] : items(list)) {
      const handle = item.querySelector(HANDLE);
      if (!handle) continue;
      const control = controlOf(handle);
      if (!control.hasAttribute('aria-haspopup')) control.setAttribute('aria-haspopup', 'menu');
      if (!control.hasAttribute('aria-expanded')) control.setAttribute('aria-expanded', 'false');
    }
  }

  // The standard menu, placed by core's one helper (overflow-row.js
  // standardMenu, defect TL-8), held on the list.
  async function standardMenu() {
    menu = await (0,_overflow_row_js__WEBPACK_IMPORTED_MODULE_2__.standardMenu)(list, '_sfMoveMenu', null, {
      setup(surface) {
        surface.addEventListener('sf-menu-context-select', onSelect);
        surface.addEventListener('sf-menu-context-closed', () => {
          if (current?.control) current.control.setAttribute('aria-expanded', 'false');
        });
      },
    });
    return menu;
  }

  async function open(item, handle) {
    if ((0,_sortable_mjs__WEBPACK_IMPORTED_MODULE_1__.activeSortableSession)()) return false;
    const all = items(list);
    const index = all.indexOf(item);
    if (index < 0) return false;
    const control = controlOf(handle);
    const surface = await standardMenu();
    if (!surface) return false;
    if (surface.isOpen && current?.item === item) {
      surface.close();
      return false;
    }
    current = { item, control, id: item.getAttribute('data-sf-sortable-item') };
    surface.setAttribute('aria-label', format(text('move-menu'), { item: itemLabel(item) }));
    surface.entries = moveMenuEntries(index, all.length);
    control.setAttribute('aria-expanded', 'true');
    await surface.openFor(control, { side: 'block-end', align: 'start', focus: 'first' });
    return true;
  }

  // The choice asks the host; focus comes back to the moved row's handle once
  // the host has redrawn the list, wherever the row now stands.
  function onSelect(event) {
    event.preventDefault();
    const id = event.detail?.entry?.id;
    const chosen = current;
    if (!chosen || !id) return;
    const all = items(list);
    const index = all.indexOf(chosen.item);
    if (index >= 0) (0,_sortable_mjs__WEBPACK_IMPORTED_MODULE_1__.requestSortableMove)(list, chosen.item, moveMenuTarget(id, index, all.length));
    menu.close({ restoreFocus: false });
    const back = () => {
      const escape = globalThis.CSS?.escape ? globalThis.CSS.escape(chosen.id) : chosen.id;
      const row = list.querySelector(`[data-sf-sortable-item="${escape}"]`);
      const handle = row?.querySelector(HANDLE);
      const control = handle ? controlOf(handle) : null;
      // A handle that is a picture (a glyph, no control) gives focus to its row.
      const target = control && (control.matches('button') || control.tabIndex >= 0) ? control : row;
      target?.focus?.({ preventScroll: false });
    };
    if (typeof globalThis.requestAnimationFrame !== 'function') back();
    else globalThis.requestAnimationFrame(() => globalThis.requestAnimationFrame(back));
  }

  // A click on a handle is a press that did not become a drag: the drag module
  // swallows the click a drop ends with.
  function onClick(event) {
    const handle = event.target.closest?.(HANDLE);
    const item = handle?.closest(ITEM);
    if (!handle || !item || item.closest('sf-sortable') !== list) return;
    event.preventDefault();
    open(item, handle);
  }

  return {
    connect() {
      if (wiring) return;
      wiring = new globalThis.AbortController();
      list.addEventListener('click', onClick, { signal: wiring.signal });
      prepare();
    },
    disconnect() {
      wiring?.abort();
      wiring = null;
      menu?.close?.({ restoreFocus: false });
      menu?.remove();
      menu = null;
    },
    prepare,
    open,
  };
}

/** sf-sortable with the handle's move menu: the drag element, extended. */
function withSortableMoveMenu(Base) {
  return class SfSortable extends Base {
    connectedCallback() {
      super.connectedCallback();
      if (!this.moveMenuController) this.moveMenuController = createSortableMoveMenu(this);
      this.moveMenuController.connect();
    }

    disconnectedCallback() {
      this.moveMenuController?.disconnect();
      super.disconnectedCallback();
    }

    // Handles the host adds later say they open a menu as well.
    prepareItem(item) {
      super.prepareItem(item);
      if (item && item.closest('sf-sortable') === this) this.moveMenuController?.prepare(item);
    }
  };
}

// A registry that defines sf-sortable with the move menu, over another one
// (the inserter's): defineSortable takes the registry it defines into.
function moveMenuRegistry(registry = globalThis.customElements) {
  return {
    get: (name) => registry.get(name),
    define: (name, Base, options) => registry.define(name, withSortableMoveMenu(Base), options),
  };
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ createSortableMoveMenu, moveMenuEntries, moveMenuRegistry, moveMenuTarget, withSortableMoveMenu });

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "7c1f9c2b36da"
(__webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
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
/* harmony export */   sortableIndexAt: () => (/* binding */ sortableIndexAt)
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

const ITEM = '[data-sf-sortable-item]';
const HANDLE = '[data-sf-sortable-handle]';
const INTERACTIVE = 'a[href],button,input,select,textarea,summary,[contenteditable]:not([contenteditable="false"])';
const NAME = /^[a-z][a-z0-9-]{0,31}$/u;
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
  ru: {
    instructions: 'Пробел или Enter — взять, стрелки — переместить, Пробел или Enter — положить, Escape — отменить.',
    picked: 'Взято: {item}. Позиция {index} из {total} в «{list}».',
    moved: 'Позиция {index} из {total} в «{list}».',
    dropped: 'Положено: {item}, позиция {index} в «{list}».',
    cancelled: 'Перемещение отменено.',
    target: 'Цель: {target}.',
    roledescription: 'перемещаемый',
  },
  en: {
    instructions: 'Space or Enter to pick up, arrows to move, Space or Enter to drop, Escape to cancel.',
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

// Visible text of an item without decorative (aria-hidden) parts.
function itemLabel(item) {
  if (item.getAttribute('aria-label')) return item.getAttribute('aria-label');
  const clone = item.cloneNode(true);
  for (const hidden of clone.querySelectorAll('[aria-hidden="true"]')) hidden.remove();
  return clone.textContent.replace(/\s+/gu, ' ').trim();
}

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
function describeItem(item) {
  if (!item.hasAttribute('role') && GENERIC.has(item.tagName)) {
    const holdsControl = item.querySelector(`${INTERACTIVE},${HANDLE},[tabindex]`);
    item.setAttribute('role', holdsControl ? 'group' : 'button');
  }
  if (!item.hasAttribute('aria-roledescription')) item.setAttribute('aria-roledescription', messages().roledescription);
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
    }

    connectedCallback() {
      super.connectedCallback?.();
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
      this.instructions.textContent = messages().instructions;
      this.append(this.live, this.instructions);
      this.addEventListener('pointerdown', (event) => this.onPointerDown(event), options);
      this.addEventListener('keydown', (event) => this.onKeyDown(event), options);
      this.addEventListener('focusin', (event) => this.prepareItem(event.target.closest?.(ITEM)), options);
      for (const item of items(this)) this.prepareItem(item);
      // Items the host adds later become focusable and draggable as well.
      this.observer = new globalThis.MutationObserver(() => { this.ensureAccessibilityNodes(); for (const item of items(this)) this.prepareItem(item); });
      this.observer.observe(this, { childList: true, subtree: true });
      this.setAttribute('data-sf-sortable', 'connected');
    }

    disconnectedCallback() {
      super.disconnectedCallback?.();
      this.observer?.disconnect();
      this.observer = null;
      this.connection?.abort();
      this.connection = null;
      if (shared.session?.fromList === this || shared.session?.list === this) finish(this, 'cancelled');
      this.setAttribute('data-sf-sortable', 'disposed');
    }

    prepareItem(item) {
      if (!item || item.closest('sf-sortable') !== this) return;
      if (!item.hasAttribute('tabindex') && !item.matches(INTERACTIVE)) item.tabIndex = 0;
      const described = (item.getAttribute('aria-describedby') || '').split(/\s+/u);
      if (this.instructions && !described.includes(this.instructions.id)) item.setAttribute('aria-describedby', [...described.filter(Boolean), this.instructions.id].join(' '));
      describeItem(item);
      // A row without a handle is the handle itself; a finger takes it by a long
      // press, so the page keeps scrolling over it (SO-3: touch-action none on
      // the whole row stopped that).
      item.toggleAttribute('data-sf-sortable-whole', !item.querySelector(HANDLE));
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
      this.instructions.textContent = messages().instructions;
      this.append(this.live, this.instructions);
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
      return [...globalThis.document.querySelectorAll('sf-sortable')].filter((list) => list === shared.session?.fromList ? shared.session.mode === 'move' : accepts(list, shared.session?.group));
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
        if (!item || item.closest('sf-sortable') !== this || event.target !== item) return;
        if (event.key !== ' ' && event.key !== 'Enter') return;
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
 * sf-sortable's pointer behaviour on any container, without the element: a
 * table's head row cannot hold a custom element around its cells, and its
 * columns move with every cell under them (owner, 2026-10-13). The container
 * keeps its markup; the controller listens on it.
 *
 * options:
 *   items        selector of the movable children (required)
 *   canStart     (event, item) => boolean -- a press that may begin a drag
 *   groupOf      (item) => string -- an item moves among items of its group
 *   preview      'column' (default) | 'line'
 *   extent       the element a column spans (a table); default the container
 *   cellsOf      (item) => elements to mark as the moving column (its cells)
 *   label        the list's name for the announcement
 *   onIntent     ({item, from, index, group}) -- index among the group's items
 *                without the dragged one, the place it is to take
 * Returns detach().
 *
 * Keyboard reordering stays where a list is: a table's column settings are an
 * sf-sortable list with every key path. A click that ends a drag is swallowed,
 * so a heading that sorts on click does not sort on a drop.
 */
function attachSortable(container, options = {}) {
  if (!(container instanceof globalThis.Element) || typeof options.items !== 'string') {
    throw new TypeError('attachSortable needs a container and an items selector');
  }
  const doc = globalThis.document;
  const preview = options.preview === 'line' ? 'line' : 'column';
  const groupOf = typeof options.groupOf === 'function' ? options.groupOf : () => '';
  const canStart = typeof options.canStart === 'function' ? options.canStart : () => true;
  const cellsOf = typeof options.cellsOf === 'function' ? options.cellsOf : (item) => [item];
  const extentOf = () => options.extent?.isConnected ? options.extent : container;
  const live = doc.createElement('div');
  live.className = 'sf-sortable-live';
  live.setAttribute('aria-live', 'polite');
  doc.body.append(live);
  const abort = new AbortController();
  let session = null;

  const members = (group) => [...container.querySelectorAll(options.items)].filter((item) => groupOf(item) === group);
  const outline = () => {
    if (session.outline) return session.outline;
    const box = doc.createElement('div');
    box.className = preview === 'column' ? 'sf-sortable-column-outline' : 'sf-sortable-indicator';
    box.setAttribute('aria-hidden', 'true');
    doc.body.append(box);
    session.outline = box;
    return box;
  };

  const place = (x) => {
    const peers = members(session.group).filter((item) => item !== session.item);
    const boxes = peers.map((item) => item.getBoundingClientRect());
    let index = boxes.length;
    for (let at = 0; at < boxes.length; at += 1) {
      if (x < boxes[at].left + boxes[at].width / 2) { index = at; break; }
    }
    session.index = index;
    const extent = extentOf().getBoundingClientRect();
    const width = session.width;
    const before = boxes[index];
    const after = boxes[index - 1];
    let left;
    if (preview === 'column') {
      // The outline stands where the column will be. Moving towards the start
      // it takes the place of the column it goes before (that one moves on);
      // moving towards the end it ends where the column it goes after ends.
      if (index > session.originalIndex && after) left = after.right - width;
      else left = before ? before.left : (after ? after.right - width : extent.left);
    } else {
      left = (before ? before.left : after ? after.right : extent.left) - HALF;
    }
    Object.assign(outline().style, {
      left: `${left}px`, top: `${extent.top}px`,
      width: preview === 'column' ? `${width}px` : `${LINE}px`, height: `${extent.height}px`,
    });
  };

  const autoScroll = (x) => {
    for (let node = container.parentElement; node; node = node.parentElement) {
      const style = globalThis.getComputedStyle(node);
      if (!/(auto|scroll)/u.test(style.overflowX) || node.scrollWidth <= node.clientWidth) continue;
      const box = node.getBoundingClientRect();
      if (x < box.left + EDGE) node.scrollBy({left: -Math.ceil((box.left + EDGE - x) / 4), behavior: 'instant'});
      else if (x > box.right - EDGE) node.scrollBy({left: Math.ceil((x - box.right + EDGE) / 4), behavior: 'instant'});
      return;
    }
  };

  const end = (dropped) => {
    const ended = session;
    session = null;
    if (!ended) return;
    ended.pending.abort();
    ended.ghost?.remove();
    ended.outline?.remove();
    for (const cell of ended.cells) cell.removeAttribute('data-sf-sortable-column-source');
    doc.documentElement.removeAttribute('data-sf-sortable-active');
    if (!ended.started) return;
    // The click a drop ends with is not a click on the heading. It comes in the
    // same task as the pointerup, so the guard is gone by the next one and a
    // later click is a click again.
    const swallow = (event) => { event.preventDefault(); event.stopImmediatePropagation(); };
    container.addEventListener('click', swallow, {capture: true, once: true});
    globalThis.setTimeout(() => container.removeEventListener('click', swallow, {capture: true}), 0);
    if (!dropped) {
      live.textContent = messages().cancelled;
      return;
    }
    if (ended.index === undefined || ended.index === ended.originalIndex) return;
    const id = ended.item.getAttribute('data-sf-sortable-item') || ended.item.dataset.key || '';
    live.textContent = format(messages().dropped, {item: itemLabel(ended.item), index: ended.index + 1, list: options.label || ''});
    options.onIntent?.({item: id, from: ended.group, index: ended.index, group: ended.group});
  };

  container.addEventListener('pointerdown', (event) => {
    if (event.button !== 0 || session || shared.session) return;
    const item = event.target.closest?.(options.items);
    if (!item || !container.contains(item) || !canStart(event, item)) return;
    const group = groupOf(item);
    const peers = members(group);
    if (peers.length < 2) return;
    const start = {x: event.clientX, y: event.clientY};
    const pending = new AbortController();
    const box = item.getBoundingClientRect();
    session = {item, group, pending, started: false, cells: [], width: box.width, originalIndex: peers.indexOf(item)};
    const move = (moveEvent) => {
      if (moveEvent.pointerId !== event.pointerId || !session) return;
      if (!session.started) {
        if (Math.hypot(moveEvent.clientX - start.x, moveEvent.clientY - start.y) < DRAG_THRESHOLD) return;
        session.started = true;
        doc.documentElement.setAttribute('data-sf-sortable-active', '');
        const ghost = ghostOf(item, box);
        ghost.style.height = `${box.height}px`;
        session.ghost = ghost;
        session.offset = {x: start.x - box.left, y: start.y - box.top};
        session.cells = cellsOf(item).filter(Boolean);
        for (const cell of session.cells) cell.setAttribute('data-sf-sortable-column-source', '');
      }
      moveEvent.preventDefault();
      Object.assign(session.ghost.style, {left: `${moveEvent.clientX - session.offset.x}px`, top: `${moveEvent.clientY - session.offset.y}px`});
      autoScroll(moveEvent.clientX);
      place(moveEvent.clientX);
    };
    globalThis.addEventListener('pointermove', move, {signal: pending.signal, passive: false});
    globalThis.addEventListener('pointerup', (upEvent) => { if (upEvent.pointerId === event.pointerId) end(true); }, {signal: pending.signal});
    globalThis.addEventListener('pointercancel', () => end(false), {signal: pending.signal});
    globalThis.addEventListener('keydown', (keyEvent) => {
      if (keyEvent.key === 'Escape' && session?.started) { keyEvent.preventDefault(); keyEvent.stopPropagation(); end(false); }
    }, {signal: pending.signal, capture: true});
  }, {signal: abort.signal});

  return () => {
    end(false);
    abort.abort();
    live.remove();
  };
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ SORTABLE_DROP_LINE, SORTABLE_MOVE_EVENT, activeSortableSession, attachSortable, defineSortable, registerSortableDropTarget, requestSortableMove, sortableIndexAt });

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "6faa2d48a2c0"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-sortable for the shim (stands/18-aliases-ci/alias.mjs, standard §16 item 20). mode: same-detail (the shim sends the new and the old name), split / detail-adds (a detail adapter, refused by the shim), attribute-and-property, method, property, manifest-only (the DOM name does not change), host-attribute (no shim), retired.","component":"sf-sortable","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"sf-sortable-intent","to":"sf-sortable-move","kind":"event","component":"sf-sortable","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","cancelable":false,"manifest":{"from":"sf-sortable-intent","to":"move"},"section":"§8, vocabulary 1.1.5 §5.1","note":"the alias table planned sf-sortable; the vocabulary\'s sf-sortable-move decides"},{"from":"sf-sortable-state","to":"state","kind":"event","component":"sf-sortable","since":"2026-10-27","remove_after":"2026-12-01","mode":"manifest-only","note":"the manifest declares the verb; the DOM name sf-sortable-state is unchanged, so the shim has nothing to send"},{"from":"sf-sortable-insert","to":"insert","kind":"event","component":"sf-sortable","since":"2026-10-27","remove_after":"2026-12-01","mode":"manifest-only","note":"the manifest declares the verb; the DOM name sf-sortable-insert is unchanged, so the shim has nothing to send"}]}');

/***/ },

/***/ "34bb89f847b9"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.sortable","tag":"sf-sortable","version":"1.4.1","kind":"leaf","settings":{"group":{"type":"string","default":""},"accepts":{"type":"string","default":""},"mode":{"type":"enum","values":["move","copy"],"default":"move"},"orientation":{"type":"enum","values":["vertical","horizontal"],"default":"vertical"},"label":{"type":"string","default":""},"preview":{"type":"enum","values":["silhouette","line"],"default":"silhouette"},"inserter-items":{"type":"string","default":""}},"values":{},"events":{"move":{"carries":{"item":"string","from":"string","to":"string","index":"number","mode":{"type":"enum","values":["move","copy"]}}},"state":{"carries":{"state":{"type":"enum","values":["picked","dropped","cancelled"]},"item":"string"},"own-verb":true},"insert":{"carries":{"index":{"type":"number","integer":true,"schema":{"minimum":0}},"item":"string","to":"string"},"cancelable":true,"own-verb":true}},"actions":{},"css-variables":{"--sf-sortable-dragging-opacity":{"type":"number","state":"dragging"},"--sf-sortable-ghost-opacity":{"type":"number","state":"dragging"},"--sf-sortable-ghost-z-index":{"type":"number","state":"dragging"},"--sf-sortable-indicator-color":{"type":"color","state":"dragging"},"--sf-sortable-placeholder-border-color":{"type":"color","state":"dragging"}}}');

/***/ },

/***/ "fca41e9837f0"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Drag and drop","runtime":{"cancelled":"Move cancelled.","dropped":"Dropped {item} at position {index} in “{list}”.","empty":"Nothing found","hint":"Plus to insert after.","inserted":"Inserted {item} at position {index} in “{list}”.","instructions":"Space or Enter to pick up, arrows to move, Space or Enter to drop, Escape to cancel.","menu":"Insert","move-down":"Down","move-first":"To the top","move-last":"To the bottom","move-menu":"Move “{item}”","move-up":"Up","moved":"Position {index} of {total} in “{list}”.","picked":"Picked up {item}. Position {index} of {total} in “{list}”.","point":"Insert: position {index} of {total}","roledescription":"draggable","search":"Find","target":"Target: {target}."},"events":{"state":{"label":"Drag step"},"insert":{"label":"Insert"}}}');

/***/ },

/***/ "46c0e03c9179"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Перетаскивание","runtime":{"cancelled":"Перемещение отменено.","dropped":"Положено: {item}, позиция {index} в «{list}».","empty":"Ничего не найдено","hint":"Плюс — вставить после.","inserted":"Вставлено: {item}, позиция {index} в «{list}».","instructions":"Пробел или Enter — взять, стрелки — переместить, Пробел или Enter — положить, Escape — отменить.","menu":"Вставить","move-down":"Ниже","move-first":"В начало","move-last":"В конец","move-menu":"Переместить «{item}»","move-up":"Выше","moved":"Позиция {index} из {total} в «{list}».","picked":"Взято: {item}. Позиция {index} из {total} в «{list}».","point":"Вставить: позиция {index} из {total}","roledescription":"перемещаемый","search":"Найти","target":"Цель: {target}."},"events":{"state":{"label":"Шаг перетаскивания"},"insert":{"label":"Вставить"}}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("6064f55a0aa2");
/******/
/******/ })()
;