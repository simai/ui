/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "4dcf76c21762"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   anchorFloating: () => (/* binding */ anchorFloating),
/* harmony export */   floatEngine: () => (/* binding */ floatEngine),
/* harmony export */   supportsCssAnchoring: () => (/* binding */ supportsCssAnchoring)
/* harmony export */ });
/* harmony import */ var _position_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("116963e5e31b");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_position_js__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
_position_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var _position_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_position_js__WEBPACK_IMPORTED_MODULE_0__);
// The floating-surface engine of C59 (owner decision 2026-11-11), internal to
// the Framework: sf-popover uses it now, the tooltip, the «?» toggletip and the
// hover card are meant to sit on it in stages S2-S4. It is not on window.SF and
// not in the public JS API contract (dispatcher 2026-11-11: a public engine
// name is an owner-level API decision, taken once the later kinds prove the
// shape).
//
// It places a panel by CSS anchor positioning (anchor-name, position-area,
// position-try-fallbacks) where the browser has it and the panel stands in the
// top layer, and by SF.Position (Floating UI) everywhere else: no CSS anchor
// positioning, a reference with no box of its own, a panel outside the top
// layer -- and, for the rest of an opening, when no CSS area keeps the panel
// inside the window (CSS has no shift). It builds on SF.Position's public API
// only; position.js itself is not changed here.
//
// Both engines say the side the panel took in data-sf-side (block-start,
// block-end, inline-start, inline-end) and, asked (arrow: true), where the
// reference's centre is in the panel's box: --sf-position-arrow-x and -y, in
// px, kept arrowPadding from the panel's corners.


const positioning = () => globalThis.SF?.Position || (_position_js__WEBPACK_IMPORTED_MODULE_0___default()); // <html data-sf-position-engine="script"> keeps the script on a page (a
// diagnostic, and the tests' way to drive the fallback).


const ENGINE_ATTRIBUTE = 'data-sf-position-engine'; // Anchor names are document-wide: every bundle that carries this module counts
// on one shared counter, not on a module-scope one of its own.

const COUNTER = Symbol.for('sf.float-anchor.names');

function nextAnchorName() {
  globalThis[COUNTER] = (globalThis[COUNTER] || 0) + 1;
  return `--sf-anchor-${globalThis[COUNTER]}`;
} // The name is given by a rule, not by the reference's inline style: a Smart
// host's \`style\` is its author style, handed to its template root (an inline
// anchor-name never reached the host's box), and its style attribute is
// rewritten on every render. The reference carries the names in
// data-sf-float-anchor; one adopted sheet per document or shadow root holds a
// rule per name, kept on a shared global as the counter is.


const ANCHOR_ATTRIBUTE = 'data-sf-float-anchor';
const SHEETS = Symbol.for('sf.float-anchor.sheets');

function anchorSheet(root) {
  if (!root || !('adoptedStyleSheets' in root)) return null;
  const sheets = globalThis[SHEETS] || (globalThis[SHEETS] = new WeakMap());
  let entry = sheets.get(root);

  if (!entry) {
    const view = (root.ownerDocument || root).defaultView || globalThis;
    if (typeof view.CSSStyleSheet !== 'function') return null;
    entry = {
      sheet: new view.CSSStyleSheet(),
      rules: new Map()
    };
    root.adoptedStyleSheets = [...root.adoptedStyleSheets, entry.sheet];
    sheets.set(root, entry);
  }

  return entry;
}

function writeAnchorRules(entry) {
  entry.sheet.replaceSync([...entry.rules.values()].join('\n'));
}

function supportsCssAnchoring() {
  try {
    return typeof CSS !== 'undefined' && CSS.supports('anchor-name: --sf-a') && CSS.supports('position-area: bottom span-right') && CSS.supports('position-try-fallbacks: flip-block') && CSS.supports('justify-self: anchor-center');
  } catch {
    return false;
  }
}

function inTopLayer(element) {
  try {
    return element.matches(':popover-open') || element.matches(':modal');
  } catch {
    return false;
  }
}

const drawsNoBox = element => getComputedStyle(element).display === 'contents'; // What the CSS engine re-reads on: a scroll anywhere (capture), a resize, a
// size change of the panel or the reference -- one read per frame. The browser
// moves the panel itself; this only says the side and the arrow again. (Floating
// UI stays the shared helper's alone: tests/pure-runtime-dependencies.)


function watch(reference, floating, run) {
  const view = floating.ownerDocument.defaultView;
  let frame = 0;

  const soon = () => {
    if (frame) return;
    frame = view.requestAnimationFrame(() => {
      frame = 0;
      run();
    });
  };

  view.addEventListener('scroll', soon, {
    capture: true,
    passive: true
  });
  view.addEventListener('resize', soon, {
    passive: true
  });
  const sizes = typeof view.ResizeObserver === 'function' ? new view.ResizeObserver(soon) : null;
  sizes?.observe(floating);
  sizes?.observe(reference);
  run();
  return () => {
    view.removeEventListener('scroll', soon, {
      capture: true
    });
    view.removeEventListener('resize', soon);
    sizes?.disconnect();
    if (frame) view.cancelAnimationFrame(frame);
  };
}
/** The engine a panel is placed by: 'css' or 'script'. */


function floatEngine(reference, floating, options = {}) {
  if (floating?.ownerDocument?.documentElement?.getAttribute(ENGINE_ATTRIBUTE) === 'script') return 'script';
  if (!supportsCssAnchoring()) return 'script';
  if (options.fitHeight || options.matchWidth || options.alignmentOffset) return 'script';
  if (!(reference instanceof Element) || drawsNoBox(reference)) return 'script';
  if (!anchorSheet(reference.getRootNode())) return 'script';
  if (reference.getRootNode() !== floating.getRootNode() || !inTopLayer(floating)) return 'script';
  return 'css';
} // The area a placement takes around its anchor, in physical words: the side,
// and across it the span that keeps the panel's start (or end) edge on the
// anchor's; a centred panel spans the whole cross axis and centres on the
// anchor. The tactics try the other alignment first (a shift along the edge),
// then the other side, then both, as Floating UI's shift and flip do; they
// carry the gap (a margin) and the window's padding (insets) with them.

function cssArea(placement) {
  const [side, align] = placement.split('-');
  const across = side === 'top' || side === 'bottom';
  const span = !align ? 'span-all' : across ? align === 'start' ? 'span-right' : 'span-left' : align === 'start' ? 'span-bottom' : 'span-top';
  const fallbacks = !align ? across ? 'flip-block' : 'flip-inline' : across ? 'flip-inline, flip-block, flip-block flip-inline' : 'flip-block, flip-inline, flip-block flip-inline';
  return {
    side,
    area: `${side} ${span}`,
    fallbacks,
    centred: !align,
    across
  };
} // Floating UI mirrors start/end alignment for a right-to-left element; the CSS
// area is physical, so the mirrored placement is written out.


function mirroredPlacement(placement, rtl) {
  const [side, align] = placement.split('-');
  if (!rtl || !align || side !== 'top' && side !== 'bottom') return placement;
  return `${side}-${align === 'start' ? 'end' : 'start'}`;
}

const OPPOSITE = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left'
};

function measuredSide(box, panel) {
  if (panel.bottom <= box.top + 1) return 'top';
  if (panel.top >= box.bottom - 1) return 'bottom';
  if (panel.right <= box.left + 1) return 'left';
  return 'right';
}

const CSS_WRITTEN = ['position', 'top', 'right', 'bottom', 'left', 'margin', 'max-width', 'position-anchor', 'position-area', 'position-try-fallbacks', 'justify-self', 'align-self'];
const ARROW_WRITTEN = ['--sf-position-arrow-x', '--sf-position-arrow-y'];
/**
 * Keeps `floating` anchored to `reference`, by CSS where it can and by
 * SF.Position.anchor() where it cannot. options: SF.Position.anchor()'s
 * (side, align, offset, padding, flip, shift, fitHeight, matchWidth,
 * alignmentOffset, topLayer, onPosition) plus arrow and arrowPadding.
 * Returns {update(), stop(), side, engine}.
 */

function anchorFloating(reference, floating, options = {}) {
  const Position = positioning();
  const settings = {
    side: 'block-end',
    align: 'start',
    offset: 'var(--sf-space-1\\/4)',
    padding: 'var(--sf-space-1\\/2)',
    arrow: false,
    arrowPadding: 'var(--sf-space-1)',
    ...options
  };
  const style = floating.style;
  const saved = [...CSS_WRITTEN, ...ARROW_WRITTEN].map(name => [name, style.getPropertyValue(name), style.getPropertyPriority(name)]);

  const restore = names => {
    for (const [name, value, priority] of saved) {
      if (!names.includes(name)) continue;
      if (value) style.setProperty(name, value, priority);else style.removeProperty(name);
    }
  };

  const controller = {
    side: settings.side,
    engine: floatEngine(reference, floating, settings),
    stopped: false
  };
  let script = null;
  let cleanup = null;
  let anchorName = '';

  const writeArrow = (box, panel) => {
    if (!settings.arrow) return;
    const inset = Position.resolveLength(settings.arrowPadding, reference.parentElement);

    const clamp = (value, whole) => {
      const edge = Math.min(inset, whole / 2);
      return Math.max(edge, Math.min(whole - edge, value));
    };

    style.setProperty('--sf-position-arrow-x', `${Math.round(clamp(box.left + box.width / 2 - panel.left, panel.width))}px`);
    style.setProperty('--sf-position-arrow-y', `${Math.round(clamp(box.top + box.height / 2 - panel.top, panel.height))}px`);
  }; // The panel's anchor: its name in the reference's data-sf-float-anchor and
  // a rule that gives the reference that name, beside any it already has. If
  // something takes the attribute away, it is written again before the next
  // paint (a MutationObserver runs in the same task's microtasks).


  const holdAnchorName = () => {
    const entry = anchorSheet(reference.getRootNode());
    if (!entry) return;

    if (!anchorName) {
      anchorName = nextAnchorName();
      const current = getComputedStyle(reference).getPropertyValue('anchor-name').trim();
      const names = current && current !== 'none' ? current.split(',').map(name => name.trim()).filter(Boolean) : [];
      entry.rules.set(anchorName, `[${ANCHOR_ATTRIBUTE}~="${anchorName}"] { anchor-name: ${[...names, anchorName].join(', ')}; }`);
      writeAnchorRules(entry);
    }

    const held = (reference.getAttribute(ANCHOR_ATTRIBUTE) || '').split(/\s+/u).filter(Boolean);
    if (!held.includes(anchorName)) reference.setAttribute(ANCHOR_ATTRIBUTE, [...held, anchorName].join(' '));
  };

  const releaseAnchorName = () => {
    if (!anchorName) return;
    const entry = anchorSheet(reference.getRootNode());
    if (entry?.rules.delete(anchorName)) writeAnchorRules(entry);
    const rest = (reference.getAttribute(ANCHOR_ATTRIBUTE) || '').split(/\s+/u).filter(name => name && name !== anchorName);
    if (rest.length) reference.setAttribute(ANCHOR_ATTRIBUTE, rest.join(' '));else reference.removeAttribute(ANCHOR_ATTRIBUTE);
    anchorName = '';
  }; // The script: SF.Position.anchor(), which writes data-sf-side itself; the
  // arrow is read after each placement.


  const startScript = () => {
    controller.engine = 'script';
    script = Position.anchor(reference, floating, { ...settings,
      onPosition: position => {
        controller.side = position.side;
        writeArrow(Position.referenceRect(reference), floating.getBoundingClientRect());
        settings.onPosition?.({ ...position,
          engine: 'script'
        });
      }
    });

    controller.update = () => script.update();
  }; // CSS: the browser places it; each run writes the area again (idempotent)
  // and reads where it went -- the side, the arrow, and whether it stayed in
  // the window. If not, the script takes over for the rest of this anchoring.


  const runCss = () => {
    if (controller.stopped || controller.engine !== 'css') return;
    const rtl = getComputedStyle(reference).direction === 'rtl'; // The gap and the window's padding are written as the lengths they were
    // given (var(--sf-space-…) follows a density change at once, with no
    // resize and no reopen); only the width cap needs a number.

    const length = value => typeof value === 'number' ? `${value}px` : String(value || 0);

    const gap = length(settings.offset);
    const padding = length(settings.padding);
    const placement = mirroredPlacement(Position.physicalPlacement(settings.side, settings.align, rtl), rtl);
    const {
      side,
      area,
      fallbacks,
      centred,
      across
    } = cssArea(placement);
    holdAnchorName();
    const insets = {
      top: padding,
      right: padding,
      bottom: padding,
      left: padding
    };
    insets[OPPOSITE[side]] = '0px';

    if (!centred) {
      if (across) insets[placement.endsWith('-start') ? 'left' : 'right'] = '0px';else insets[placement.endsWith('-start') ? 'top' : 'bottom'] = '0px';
    }

    style.position = 'fixed';

    for (const edge of ['top', 'right', 'bottom', 'left']) {
      style.setProperty(edge, insets[edge]);
      style.setProperty(`margin-${edge}`, edge === OPPOSITE[side] ? gap : '0px');
    }

    style.setProperty('position-anchor', anchorName);
    style.setProperty('position-area', area);
    style.setProperty('position-try-fallbacks', fallbacks);
    if (centred) style.setProperty(across ? 'justify-self' : 'align-self', 'anchor-center');
    const width = document.documentElement.clientWidth;
    const height = document.documentElement.clientHeight;
    const room = `max(0px, ${width}px - 2 * ${padding})`;
    style.maxWidth = Number.isFinite(controller.widthCap) ? `min(${controller.widthCap}px, ${room})` : room;
    const box = Position.referenceRect(reference);
    const panel = floating.getBoundingClientRect();
    const out = panel.left < -0.5 || panel.top < -0.5 || panel.right > width + 0.5 || panel.bottom > height + 0.5;
    const visible = box.bottom > 0 && box.top < height && box.right > 0 && box.left < width; // A panel wider than the room on either side of its anchor is slid back
    // into the window by the browser -- over its own trigger, the side read
    // as the wrong one (a 180 px start/end panel at a 120 px trigger in a 390
    // window covered 45 px of it and said inline-end for start: C59 S1
    // acceptance D2). CSS has no size middleware; the script keeps it beside
    // the trigger, narrowed to the room there.

    const covers = Math.min(panel.right, box.right) - Math.max(panel.left, box.left) > 0.5 && Math.min(panel.bottom, box.bottom) - Math.max(panel.top, box.top) > 0.5;

    if ((out || covers) && visible) {
      // No area of the four keeps it in the window clear of its trigger:
      // Floating UI shifts and narrows it.
      cleanup?.();
      cleanup = null;
      restore(CSS_WRITTEN);
      releaseAnchorName();
      startScript();
      return;
    }

    const physical = measuredSide(box, panel);
    controller.side = Position.logicalSide(physical, rtl);
    floating.dataset.sfSide = controller.side;
    writeArrow(box, panel);
    settings.onPosition?.({
      side: controller.side,
      placement: physical,
      x: panel.left,
      y: panel.top,
      engine: 'css'
    });
  };

  controller.stop = () => {
    controller.stopped = true;
    cleanup?.();
    script?.stop();
    releaseAnchorName();
    delete floating.dataset.sfSide;
    restore([...CSS_WRITTEN, ...ARROW_WRITTEN]);
  };

  if (controller.engine === 'css') {
    // The author's width cap, read before anything is written inline.
    const cap = parseFloat(getComputedStyle(floating).maxWidth);
    controller.widthCap = Number.isFinite(cap) && !String(getComputedStyle(floating).maxWidth).endsWith('%') ? cap : Infinity;

    controller.update = () => {
      runCss();
      return Promise.resolve(null);
    }; // The browser moves the panel with its anchor; this only re-reads the side
    // and the arrow on a scroll, a resize or a size change.


    const unwatch = watch(reference, floating, runCss);
    const view = reference.ownerDocument.defaultView;
    const restyled = typeof view.MutationObserver === 'function' ? new view.MutationObserver(() => {
      if (!controller.stopped && controller.engine === 'css') holdAnchorName();
    }) : null;
    restyled?.observe(reference, {
      attributes: true,
      attributeFilter: [ANCHOR_ATTRIBUTE]
    });

    cleanup = () => {
      restyled?.disconnect();
      unwatch();
    };
  } else {
    startScript();
  }

  return controller;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

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

/***/ "e470697f4c03"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _core_js_deprecations__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("d3818183b14c");
/* harmony import */ var _core_js_tag_aliases_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("4a85acfb05c1");
/* harmony import */ var _core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("bf0cea966575");
/* harmony import */ var _core_js_layer_stack__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("18003344cff0");
/* harmony import */ var _core_js_position_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("116963e5e31b");
/* harmony import */ var _core_js_float_anchor_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("4dcf76c21762");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("18fc6da7e766");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("fcb18992f3bb");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("d8578a2cb338");
/* harmony import */ var _lang_index_mjs__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("ddeb2e55b250");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_deprecations__WEBPACK_IMPORTED_MODULE_2__, _core_js_tag_aliases_js__WEBPACK_IMPORTED_MODULE_3__, _core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_4__, _core_js_layer_stack__WEBPACK_IMPORTED_MODULE_5__, _core_js_position_js__WEBPACK_IMPORTED_MODULE_6__, _core_js_float_anchor_js__WEBPACK_IMPORTED_MODULE_7__, _js_templates_default__WEBPACK_IMPORTED_MODULE_8__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_deprecations__WEBPACK_IMPORTED_MODULE_2__, _core_js_tag_aliases_js__WEBPACK_IMPORTED_MODULE_3__, _core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_4__, _core_js_layer_stack__WEBPACK_IMPORTED_MODULE_5__, _core_js_position_js__WEBPACK_IMPORTED_MODULE_6__, _core_js_float_anchor_js__WEBPACK_IMPORTED_MODULE_7__, _js_templates_default__WEBPACK_IMPORTED_MODULE_8__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_deprecations__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_core_js_deprecations__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _core_js_layer_stack__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _core_js_position_js__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_core_js_position_js__WEBPACK_IMPORTED_MODULE_6__);











 // Only the words on screen ship in the bundle, English only (owner decision
// C282): Russian and every other language come from a language file. The
// title, settings and events stay in the language files for the Studio and the
// docs (localization study LC-2).
// sf-popover from its component.json (standard simai.smart-component 1.3.8
// §3, §4, §8, §19): placement, label, width, dismissible, surface-role and the
// value open are attributes and properties made by core/js/element-manifest.js;
// the old host attribute role is a dated alias of surface-role.
// The one anchored-positioning contract of the Framework's floating surfaces
// (core/js/position.js): the page's published copy when there is one.

const positioning = () => globalThis.SF?.Position || (_core_js_position_js__WEBPACK_IMPORTED_MODULE_6___default()); // Where the surface hangs from, as the shared helper's side and alignment.
// top, bottom, start and end centre it on the trigger; -start and -end align
// its start or end edge with the trigger's (C59, research 2026-11-11). The
// first six are the names it had; inline-start and inline-end are start-start
// and end-start.


const ANCHOR_PLACEMENTS = {
  'bottom-start': {
    side: 'block-end',
    align: 'start'
  },
  'bottom-end': {
    side: 'block-end',
    align: 'end'
  },
  'top-start': {
    side: 'block-start',
    align: 'start'
  },
  'top-end': {
    side: 'block-start',
    align: 'end'
  },
  'inline-end': {
    side: 'inline-end',
    align: 'start'
  },
  'inline-start': {
    side: 'inline-start',
    align: 'start'
  },
  bottom: {
    side: 'block-end',
    align: 'center'
  },
  top: {
    side: 'block-start',
    align: 'center'
  }
}; // start and end, and each with -start and -end. Composed, not written out:
// start-start and end-end are also flex-align utility classes, and a literal
// here would load that sheet with every popover
// (scripts/generate-template-utilities.mjs reads words loosely).

for (const [name, side] of [['start', 'inline-start'], ['end', 'inline-end']]) {
  ANCHOR_PLACEMENTS[name] = {
    side,
    align: 'center'
  };

  for (const align of ['start', 'end']) ANCHOR_PLACEMENTS[`${name}-${align}`] = {
    side,
    align
  };
} // The gap an arrow needs when no offset is given: the arrow's own reach.


const ARROW_OFFSET = 'var(--sf-space-1\\/2)';
const PopoverElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_9__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: _lang_index_mjs__WEBPACK_IMPORTED_MODULE_11__.files,
  source: 'ru',
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_10__
}); // A surface anchored to a control the consumer supplies: a field's settings, a
// list of things to add, a filter, a colour picker's own panel. It exists
// because the Framework had the surface and not the behaviour -- sf-context-menu
// is positioned and takes any content and any role, but it has no open state, no
// trigger, no dismissal and no focus to return. Two composites built that by
// hand within a week of each other, the second copying the first, which is the
// moment a part belongs here instead.
//
// It claims nothing about the shape of the content: a menu of commands, a list
// of ticks, a form. The role it is given reaches the surface, and the arrow keys
// and roving focus of a menu stay where they already are -- in sf-context-menu,
// which this draws into.
// While any popover is open the root says so, and a component whose own Escape
// closes something -- a drawer, a modal, a panel -- stands back. The mark is a
// protocol shared with every other surface that owns Escape, so it is held
// through core (`core/js/open-surface-mark`) rather than written here.
// The anchors given to popovers are told apart by a number of their own
// (data-sf-popover-anchor), kept on a shared global: every bundle may carry
// this module.

const POPOVER_ANCHORS = globalThis[Symbol.for('sf.popover.anchors')] || (globalThis[Symbol.for('sf.popover.anchors')] = {
  count: 0
});

class SfPopover extends PopoverElement {
  // Its DOM updates are all it draws: the first one counts as its render
  // (Smart base, simai/ui-source#70).
  static rendersNoTemplate = true; // The manifest's settings and value, and the base's template name.

  static get props() {
    return { ...super.props,
      templateName: {
        attribute: 'template',
        default: 'default'
      }
    };
  }

  constructor() {
    super();
    this._onDocumentPointerDown = null;
    this._onDocumentKeyDown = null;
    this._closeReason = 'api';
  }

  static get observedAttributes() {
    return [...new Set([...(super.observedAttributes ?? []), 'open'])];
  } // A role written on the host is the surface's: it is taken once into
  // surface-role and off the host, so the host is not a second menu or dialog
  // around the real one (a dated alias, aliases.json).


  _adoptLegacyRole() {
    if (!this.hasAttribute('role')) return;
    const role = String(this.getAttribute('role') || '').trim().toLowerCase();
    if (!this.hasAttribute('surface-role') && ['dialog', 'menu', 'listbox', 'group'].includes(role)) this.setAttribute('surface-role', role);
    this.removeAttribute('role');
    (0,_core_js_deprecations__WEBPACK_IMPORTED_MODULE_2__.noteDeprecated)({
      component: 'sf-popover',
      tag: 'sf-popover',
      kind: 'attribute',
      attribute: 'role',
      from: 'role',
      to: 'surface-role',
      since: _aliases_json__WEBPACK_IMPORTED_MODULE_10__.since,
      remove_after: _aliases_json__WEBPACK_IMPORTED_MODULE_10__.remove_after
    });
  } // The host is a box rather than a passthrough: the surface is positioned
  // against it and the trigger sits inside it. The base makes every Smart
  // element `display: contents`, which has no box to position against -- and
  // the alternative, moving the children into one this component renders, is
  // undone by the next render of whatever template engine put them there.
  // Nothing is moved: the children stay exactly where the consumer wrote them
  // and this says where they are.
  // What the page set inline that a child inherits -- custom properties,
  // colour, font -- stays on the host before its box, as on every Smart host.


  applyHostDisplayStyle() {
    const next = [this.hostInheritedStyle(), 'display: inline-flex; align-items: center; position: relative;'].filter(Boolean).join(' ');
    return this.writeHostStyle(next);
  } // The base lifts every `[slot]` child out of the document at connect, for a
  // template to place back where it decides. This component decides nothing
  // about where they go: the trigger and the surface stay exactly where the
  // consumer wrote them, and `slot` here names which of the two a node is.


  captureSlotTemplates() {
    this._slotTemplatesCaptured = true;
  }

  onConnected() {
    this._adoptLegacyRole();

    super.onConnected?.();

    this._bindDismissal();

    this.addEventListener('click', this._onTriggerClick);
  } // A press anywhere in the trigger opens it, or closes it with reason
  // close; a press in the content is the content's own.


  _onTriggerClick = event => {
    const path = event.composedPath?.() ?? [];
    const inTrigger = path.some(node => node?.getAttribute?.('slot') === 'trigger');
    if (!inTrigger) return;
    event.preventDefault();
    if (this.open) this.close({
      reason: 'close'
    });else this.show();
  };

  onDisconnected() {
    this._watchSheet(null);

    this._releaseAnchor();

    this._lower();

    cancelAnimationFrame(this._focusFrame);
    this.removeEventListener('click', this._onTriggerClick);

    this._releaseDismissal();

    super.onDisconnected?.();
  }

  attributeChangedCallback(name, previous, next) {
    super.attributeChangedCallback?.(name, previous, next);
    if (previous === next || name !== 'open') return;

    this._bindDismissal(); // The fact, after the state changed (vocabulary §4); a setting written
    // from outside is reported the same way, as the surface's own state.


    if (this.open) this.sfEmit('opened', {});else this.sfEmit('closed', {
      reason: this._closeReason || 'api'
    });
    this._closeReason = 'api';
    if (!this.open) this.returnFocus();
  } // Opens or closes the surface. Answers an outcome (§4.4): refused when a
  // listener prevents the request (sf-popover-open, sf-popover-close).


  toggle(force) {
    const given = force && typeof force === 'object' ? force.force : force;
    const next = typeof given === 'boolean' ? given : !this.open;
    if (next === this.open) return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.applied)();
    return next ? this.show() : this.close();
  } // The element the surface stands beside (1.8.0, FO-5): the anchor
  // property when a page gives one, else the host and the trigger in it. An
  // anchor lets a surface open from any control -- a chip, a column's
  // heading, a cell -- with no trigger of its own: the focus goes back to
  // it, and a press on it while the surface is open closes the surface
  // (reason close), as a press on a trigger does.


  get _reference() {
    const anchor = this.anchor;
    return anchor && anchor.nodeType === 1 && anchor.isConnected ? anchor : this;
  }

  show() {
    if (this.open) return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.applied)();
    if (!this.sfEmit('open', {}, {
      cancelable: true
    })) return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.refused)('prevented');
    this._opener = this.querySelector('[slot="trigger"]') ?? (this._reference !== this ? this._reference : null);
    this.toggleAttribute('open', true);
    this.requestComponentUpdate('open');

    this._focusInSoon();

    return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.applied)();
  } // A dialog surface takes the focus when it is opened (C59: the popover
  // kind is a non-modal dialog): Tab goes on into its content and Escape
  // brings the focus back to the trigger. It waits a frame, so a consumer
  // that focuses its own field on sf-popover-opened (sf-input-rich's link
  // editor) keeps it; a menu or a list moves its own focus, and a surface
  // opened by writing the open attribute leaves the focus where it is.


  _focusInSoon() {
    if (this.surfaceRole !== 'dialog') return;
    cancelAnimationFrame(this._focusFrame);
    this._focusFrame = requestAnimationFrame(() => {
      const surface = this.querySelector(':scope > [slot="content"]');
      if (!this.open || !surface?.isConnected) return;
      const active = this.ownerDocument.activeElement;
      if (active && active !== this.ownerDocument.body && surface.contains(active)) return;

      if (!surface.hasAttribute('tabindex')) {
        surface.setAttribute('tabindex', '-1');
        surface.setAttribute('data-sf-popover-focus', '');
      }

      surface.focus({
        preventScroll: true
      });
    });
  } // options.reason says why (standard 1.3.8 §19.3): escape, outside, close
  // (the trigger pressed again) or api, the default.


  close(options = {}) {
    if (!this.open) return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.refused)('closed');
    const reason = typeof options?.reason === 'string' ? options.reason : 'api';
    if (!this.sfEmit('close', {
      reason,
      unsaved: Boolean(this.unsaved)
    }, {
      cancelable: true
    })) return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.refused)('prevented');
    this._closeReason = reason;
    this.toggleAttribute('open', false);
    this.requestComponentUpdate('open');
    return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.applied)();
  } // The control that opened it gets the focus back, because a surface that
  // closes leaving the focus on the document start makes a keyboard lose its
  // place entirely.


  returnFocus() {
    const trigger = this._opener?.isConnected ? this._opener : this.querySelector('[slot="trigger"]') ?? (this._reference !== this ? this._reference : null);
    const focusable = trigger?.matches?.('button, a[href], input, select, textarea, [tabindex]') ? trigger : trigger?.querySelector?.('button, a[href], input, select, textarea, [tabindex]');
    focusable?.focus?.();
    return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.applied)();
  }

  _bindDismissal() {
    if (!this.open || !this.dismissible) {
      this._releaseDismissal();

      return;
    }

    if (this._onDocumentPointerDown) return;
    (0,_core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_4__.holdOpenSurfaceMark)(this, true, {
      place: this._onLayerPlace
    });

    this._onDocumentPointerDown = event => {
      const path = event.composedPath?.() ?? [];
      if (path.includes(this)) return; // A press on the anchor closes it as a press on a trigger does.

      const reference = this._reference;

      if (reference !== this && path.includes(reference)) {
        this.close({
          reason: 'close'
        });
        return;
      } // An outside press is the top layer's (standard 1.3.8 §19.3): a
      // press inside a drawer or a window opened from this popover is
      // theirs, and the popover under them stays. A list opened from it
      // closes with it, as before.


      if ((0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_5__.hasLayerAbove)(this)) return;
      this.close({
        reason: 'outside'
      });
    }; // Capture, and the press is stopped going further: a surface closing
    // under the pointer must not also activate what the pointer landed on.
    // Only as the innermost open layer: a calendar or a list opened inside
    // it takes the press first, and the popover the next one.


    this._onDocumentKeyDown = event => {
      if (event.key !== 'Escape' || event.defaultPrevented || !(0,_core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_4__.isTopOpenSurface)(this)) return;
      event.preventDefault();
      event.stopPropagation();
      this.close({
        reason: 'escape'
      });
    };

    document.addEventListener('pointerdown', this._onDocumentPointerDown, true);
    document.addEventListener('keydown', this._onDocumentKeyDown, true);
  }

  _releaseDismissal() {
    (0,_core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_4__.holdOpenSurfaceMark)(this, false);

    if (this._onDocumentPointerDown) {
      document.removeEventListener('pointerdown', this._onDocumentPointerDown, true);
    }

    if (this._onDocumentKeyDown) {
      document.removeEventListener('keydown', this._onDocumentKeyDown, true);
    }

    this._onDocumentPointerDown = null;
    this._onDocumentKeyDown = null;
    this._under = false;
  } // It draws no markup of its own, so it takes the base's own patch path and
  // never renders: lit owns the children of whatever it renders into, and this
  // element renders into itself. A template returning nothing would therefore
  // delete the trigger and the surface the consumer wrote -- which is the same
  // wound as moving them, taken from the other side.


  resolveUpdateMode() {
    return 'dom';
  } // What it owns is said in attributes the stylesheet reads: where the surface
  // sits, how wide it is, and what it is to a reader. Whether it is shown is
  // the open value's own attribute (open); the host's data-open is the
  // page's (1.8.0, DEV order msg-d56fa72b: it was written as "true" or
  // "false" on every drawing, over a page's own data-open, and repeated the
  // value in an undeclared state; journal behaviour-popover-data-open-retired).


  updateDom() {
    this.dataset.placement = this.placement;

    this._adoptLegacyRole(); // The control that opens it says that it does and whether it has.


    const trigger = this.querySelector('[slot="trigger"]');
    const control = trigger?.matches?.('button, a[href], [tabindex]') ? trigger : trigger?.querySelector?.(`button, a[href], [tabindex], sf-button, ${(0,_core_js_tag_aliases_js__WEBPACK_IMPORTED_MODULE_3__.tagSelector)('sf-button-icon')}`);

    if (control) {
      control.setAttribute('aria-expanded', this.open ? 'true' : 'false');
      control.setAttribute('aria-haspopup', this.surfaceRole === 'group' ? 'true' : this.surfaceRole);
    }

    const surface = this.querySelector('[slot="content"]');
    if (!surface) return true;
    if (control && surface.id) control.setAttribute('aria-controls', surface.id);
    surface.setAttribute('role', this.surfaceRole);
    if (this.label) surface.setAttribute('aria-label', this.label);else surface.removeAttribute('aria-label');
    surface.style.setProperty('--sf-popover--width', this.width || ''); // The gap to the trigger (#69), a margin on the trigger's side.

    const offset = this._offset();

    if (offset) surface.style.setProperty('--sf-popover--offset', offset);else surface.style.removeProperty('--sf-popover--offset');

    if (!this.open && surface.hasAttribute('data-sf-popover-focus')) {
      surface.removeAttribute('tabindex');
      surface.removeAttribute('data-sf-popover-focus');
    }

    this._syncAnchor(surface);

    return true;
  } // The gap: the offset given, or with an arrow the arrow's reach.


  _offset() {
    return this.offset || (this.arrow ? ARROW_OFFSET : '');
  } // The top layer (C59): an open surface is drawn over the whole page, so no
  // ancestor's overflow, z-index, transform or contain clips or covers it.
  // It stays where it is in the document, so it keeps the host's variables,
  // theme, language, direction and density. While a window or a drawer
  // stands above it in the layer stack -- one opened from its content -- it
  // steps down out of the top layer, so that window is drawn over it; it
  // comes back up when the window closes.


  _lift(surface) {
    if (this._lowerSurface && this._liftedSurface === surface) return;

    this._lower();

    this._lowerSurface = positioning().liftToTopLayer?.(surface) ?? null;
    this._liftedSurface = this._lowerSurface ? surface : null;
  }

  _lower() {
    const lower = this._lowerSurface;
    this._lowerSurface = null;
    this._liftedSurface = null;
    lower?.();
  } // The layer stack tells every open layer where it stands (layer-stack
  // sync); a window or a drawer above sends the surface down.


  _onLayerPlace = () => {
    const under = (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_5__.hasLayerAbove)(this);
    if (under === Boolean(this._under)) return;
    this._under = under;
    const surface = this.querySelector(':scope > [slot="content"]');

    if (surface) {
      this._releaseAnchor();

      this._syncAnchor(surface);
    }
  }; // An open surface is kept on screen as every other floating surface is
  // (core/js/position.js): it hangs from the corner its placement names and
  // moves along the trigger's edge, or to the other side, when the window has
  // no room for it there. Placed by the stylesheet alone, a panel wider than
  // the room beside a trigger at the window's edge ran off it (ui-doc
  // «Рецепты», «Уведомления», 2026-11-10: 320px from a bell 60px from the
  // edge of a 400px window ended 260px past it). It stays where it stands in
  // the stacking order (no top layer): a window or a drawer opened from it is
  // still drawn over it. Closed, the stylesheet's placement is back.
  //
  // A surface a consumer draws as a sheet (data-sf-sheet: sf-input-rich's
  // link editor on a phone, C32 RT-02) is placed by that consumer's sheet
  // rule, so it is not anchored: the inline placement would hold it at the
  // trigger (it hung at the top of a 390 screen). The attribute can arrive
  // after the surface opened, so it is watched while the surface is open.

  _syncAnchor(surface) {
    const live = this.open && surface?.isConnected;

    this._watchSheet(live ? surface : null); // In the top layer while open, a sheet included (it was lifted by its
    // consumer before; now the popover holds it); down when closed or
    // while a window stands above it.


    if (live && !this._under) this._lift(surface);else this._lower();
    const sheet = surface?.hasAttribute?.('data-sf-sheet');
    const reference = this._reference;

    if (reference !== this && !reference.dataset.sfPopoverAnchor) {
      POPOVER_ANCHORS.count += 1;
      reference.dataset.sfPopoverAnchor = String(POPOVER_ANCHORS.count);
    }

    const want = live && !sheet ? `${this.placement}|${this._offset()}|${this.arrow}|${Boolean(this._under)}|${reference === this ? '' : reference.dataset.sfPopoverAnchor}` : null;
    if (this._anchor && (this._anchorSurface !== surface || this._anchorKey !== want)) this._releaseAnchor();
    if (!want || this._anchor) return;
    const {
      side,
      align
    } = ANCHOR_PLACEMENTS[this.placement] || ANCHOR_PLACEMENTS['bottom-end']; // The floating-surface engine (core/js/float-anchor.js, internal):
    // CSS anchor positioning in the top layer, SF.Position elsewhere.

    this._anchor = (0,_core_js_float_anchor_js__WEBPACK_IMPORTED_MODULE_7__.anchorFloating)(reference, surface, {
      side,
      align,
      offset: this._offset() || 0,
      flip: true,
      shift: true,
      fitHeight: false,
      topLayer: false,
      arrow: this.arrow
    });
    this._anchorSurface = surface;
    this._anchorKey = want;
  }

  _watchSheet(surface) {
    if (this._sheetWatch?.surface === surface) return;
    this._sheetWatch?.observer.disconnect();
    this._sheetWatch = null;
    if (!surface || typeof MutationObserver !== 'function') return;
    const observer = new MutationObserver(() => this._syncAnchor(surface));
    observer.observe(surface, {
      attributes: true,
      attributeFilter: ['data-sf-sheet']
    });
    this._sheetWatch = {
      surface,
      observer
    };
  }

  _releaseAnchor() {
    this._anchor?.stop();
    this._anchor = null;
    this._anchorSurface = null;
    this._anchorKey = null;
  }

  templateContext() {
    return this.createTemplateContext({ ...this.getPropsContext(),
      component: this
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_8__.renderPopoverTemplate)(this.templateContext());
  }

}

SfPopover.define('sf-popover');
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SfPopover);
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "18fc6da7e766"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderPopoverTemplate: () => (/* binding */ renderPopoverTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var _default_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("39f4699b9dcf");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);

 // Nothing. The trigger and the content are the consumer's own nodes, left where
// they were written; this component says where they are with attributes the
// stylesheet reads, and never moves them -- a node moved out from under a
// template engine comes back on its next render, in the wrong place and wired to
// nothing.

function renderPopoverTemplate() {
  return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "39f4699b9dcf"
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

/***/ "ddeb2e55b250"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   files: () => (/* binding */ files)
/* harmony export */ });
/* harmony import */ var _en_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("0f5fc1613e82");
// Written by scripts/build-language-packs.mjs from src/core/lang/built-in.json
// (owner decision C282); do not edit. The words this bundle carries: the
// built-in languages' (en); every other language comes from
// a language file (core/lang/<code>.js or its parts).


const files = { en: { runtime: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime } };

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ en: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime });


/***/ },

/***/ "d8578a2cb338"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-popover for the shim (core/js/aliases.js, standard §16 item 20). mode: same-detail (attribute rows), manifest-only (the DOM name does not change; its meaning does, so no shim).","component":"sf-popover","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"role","to":"surface-role","kind":"attribute","component":"sf-popover","since":"2026-10-27","remove_after":"2026-12-01","mode":"host-attribute","section":"§3.1","note":"read by the popover, not the shim: role leaves the host once read (the shim would mirror that removal onto surface-role); each read is noted with these dates"},{"from":"sf-popover-open","to":null,"kind":"event","component":"sf-popover","since":"2026-10-27","remove_after":"2026-12-01","mode":"manifest-only","section":"§19.3, vocabulary §4","note":"the same DOM name is the cancelable request now (sent before opening); the fact is sf-popover-opened"},{"from":"sf-popover-close","to":null,"kind":"event","component":"sf-popover","since":"2026-10-27","remove_after":"2026-12-01","mode":"manifest-only","section":"§19.3, vocabulary §4","note":"the same DOM name is the cancelable request now (sent before closing, {reason, unsaved}); the fact is sf-popover-closed"}]}');

/***/ },

/***/ "fcb18992f3bb"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.popover","tag":"sf-popover","version":"1.10.2","kind":"leaf","settings":{"placement":{"type":"enum","values":["bottom-start","bottom-end","top-start","top-end","inline-start","inline-end","bottom","top","start","start-start","start-end","end","end-start","end-end"],"default":"bottom-end"},"anchor":{"type":"object","default":null},"label":{"type":"string","default":""},"width":{"type":"string","default":""},"offset":{"type":"string","default":""},"arrow":{"type":"boolean","default":false},"dismissible":{"type":"boolean","default":true},"surface-role":{"type":"enum","values":["dialog","menu","listbox","group"],"default":"dialog"},"unsaved":{"type":"boolean","default":false}},"values":{"open":{"type":"boolean","default":false,"reflect":true}},"events":{"open":{"carries":{},"cancelable":true},"opened":{"carries":{}},"close":{"carries":{"reason":{"type":"enum","values":["close","escape","outside","cancelled","api"]},"unsaved":"boolean"},"cancelable":true},"closed":{"carries":{"reason":{"type":"enum","values":["close","escape","outside","cancelled","api"]}}}},"actions":{"toggle":{"with":{"force":{"type":"boolean","optional":true}}},"show":{"emits":"open"},"close":{"with":{"reason":{"type":"enum","values":["close","escape","outside","cancelled","api"],"optional":true}},"emits":"close"},"return-focus":{}},"layer":{"kind":"surface","locks-page":false,"traps-focus":false},"css-variables":{"--sf-popover-background-color":{"type":"color","state":"default"},"--sf-popover-color":{"type":"color","state":"default"},"--sf-popover-radius":{"type":"length","state":"default"},"--sf-popover-shadow":{"type":"shadow","state":"default"},"--sf-popover-max-width":{"type":"length","state":"default"},"--sf-popover-max-height":{"type":"length","state":"default"}}}');

/***/ },

/***/ "0f5fc1613e82"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Popover","runtime":{}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("e470697f4c03");
/******/
/******/ })()
;