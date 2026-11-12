/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "151a293c8c90"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ariaKeyShortcuts: () => (/* binding */ ariaKeyShortcuts),
/* harmony export */   isApplePlatform: () => (/* binding */ isApplePlatform),
/* harmony export */   isCommandShortcut: () => (/* binding */ isCommandShortcut),
/* harmony export */   isEditableTarget: () => (/* binding */ isEditableTarget),
/* harmony export */   matchesShortcut: () => (/* binding */ matchesShortcut),
/* harmony export */   parseShortcut: () => (/* binding */ parseShortcut),
/* harmony export */   shortcutCaps: () => (/* binding */ shortcutCaps),
/* harmony export */   shortcutView: () => (/* binding */ shortcutView)
/* harmony export */ });
// A key combination as a `shortcut` setting writes it (sf-button, an entry
// of sf-menu-context, a row of sf-search): words joined by +, the modifiers
// first and the key last -- mod+k, shift+/, /, escape. `mod` is the
// platform's command modifier: Cmd on Apple platforms, Ctrl elsewhere. Read
// once per render; nothing here holds state.
//
// The kbd component owns how a combination reads (owner decision 2026-11-07,
// docs review R030, rule C04): on an Apple platform the modifiers are glyphs
// in the platform's order, side by side (⇧⌘P); elsewhere they are words in
// Ctrl+Shift+P order, and shortcutView() says to join them with + -- the kbd
// sheet shows the joins where keys are plain glyphs (a menu row, a tooltip)
// and hides them between caps, which stand apart. A host renders the view
// and never styles the keys.
const MODIFIERS = ['mod', 'ctrl', 'alt', 'shift', 'meta']; // What a person reads on a key cap, per platform.

const MAC_CAPS = {
  mod: '⌘',
  meta: '⌘',
  ctrl: '⌃',
  alt: '⌥',
  shift: '⇧'
};
const OTHER_CAPS = {
  mod: 'Ctrl',
  meta: 'Win',
  ctrl: 'Ctrl',
  alt: 'Alt',
  shift: 'Shift'
}; // A cap of one character -- a letter, ⌘, ⇧, ↵ -- is a square key; a cap of
// several letters (Esc, Ctrl, Shift) hugs its word (sheet:
// .sf-button-shortcut-key--square). A modifier's cap is the platform's own
// word, so a page printed on a Mac and drawn on Windows widens by the
// difference: the keys are true to their caps, not to the widest platform
// (docs review R010, 2026-11-06).

const KEY_CAPS = {
  enter: '↵',
  return: '↵',
  escape: 'Esc',
  esc: 'Esc',
  tab: 'Tab',
  space: 'Space',
  backspace: '⌫',
  delete: 'Del',
  up: '↑',
  down: '↓',
  left: '←',
  right: '→',
  arrowup: '↑',
  arrowdown: '↓',
  arrowleft: '←',
  arrowright: '→',
  home: 'Home',
  end: 'End',
  pageup: 'PgUp',
  pagedown: 'PgDn'
}; // The names of KeyboardEvent.key for the words above.

const KEY_NAMES = {
  enter: 'Enter',
  return: 'Enter',
  escape: 'Escape',
  esc: 'Escape',
  tab: 'Tab',
  space: ' ',
  backspace: 'Backspace',
  delete: 'Delete',
  up: 'ArrowUp',
  down: 'ArrowDown',
  left: 'ArrowLeft',
  right: 'ArrowRight',
  arrowup: 'ArrowUp',
  arrowdown: 'ArrowDown',
  arrowleft: 'ArrowLeft',
  arrowright: 'ArrowRight',
  home: 'Home',
  end: 'End',
  pageup: 'PageUp',
  pagedown: 'PageDown'
}; // KeyboardEvent.code of the punctuation a shortcut is usually written with,
// so the combination is heard on any keyboard layout.

const PUNCTUATION_CODES = {
  '/': 'Slash',
  '.': 'Period',
  ',': 'Comma',
  ';': 'Semicolon',
  "'": 'Quote',
  '[': 'BracketLeft',
  ']': 'BracketRight',
  '-': 'Minus',
  '=': 'Equal',
  '`': 'Backquote',
  '\\': 'Backslash'
};
function isApplePlatform() {
  const platform = globalThis.navigator?.userAgentData?.platform || globalThis.navigator?.platform || '';
  return /mac|iphone|ipad|ipod/iu.test(platform);
}
/**
 * The combination as parts: `{modifiers: Set, key}`, or null when there is
 * none. `+` as the key itself is written `mod+plus`.
 */

function parseShortcut(value) {
  const text = String(value ?? '').trim().toLowerCase();
  if (!text) return null;
  const words = text === '+' ? ['+'] : text.split('+').map(word => word.trim()).filter(Boolean);
  if (!words.length) return null;
  const key = words.at(-1) === 'plus' ? '+' : words.at(-1);
  const modifiers = new Set(words.slice(0, -1).filter(word => MODIFIERS.includes(word)));
  return {
    modifiers,
    key
  };
}
/**
 * What the keys read, one cap per key in the platform's words: {text, square},
 * square when the cap is one character.
 */

function shortcutCaps(parsed, apple = isApplePlatform()) {
  if (!parsed) return [];
  const caps = apple ? MAC_CAPS : OTHER_CAPS;
  const order = apple ? ['ctrl', 'alt', 'shift', 'mod', 'meta'] : ['mod', 'ctrl', 'meta', 'alt', 'shift'];
  const modifiers = [];

  for (const name of order.filter(one => parsed.modifiers.has(one))) {
    // On a Mac mod and meta are one key.
    if (modifiers.includes(caps[name])) continue;
    modifiers.push(caps[name]);
  }

  const key = KEY_CAPS[parsed.key] ?? (parsed.key.length === 1 ? parsed.key.toUpperCase() : parsed.key.charAt(0).toUpperCase() + parsed.key.slice(1));
  return [...modifiers, key].map(text => ({
    text,
    square: [...text].length === 1
  }));
} // A function key (F1-F24) reads as its name.

const FUNCTION_KEY = /^f(?:[1-9]|1[0-9]|2[0-4])$/u; // Whether a written value is the notation above rather than text a page
// already wrote for people (⇧⌘L, «Ctrl K»): every word but the last a
// modifier, the last one character, a named key or a function key.

function isNotation(value) {
  const text = String(value ?? '').trim().toLowerCase();
  if (!text || /\s/u.test(text.replace(/\s*\+\s*/gu, '+'))) return false;
  if (text === '+') return true;
  const words = text.split('+').map(word => word.trim());
  if (words.some(word => !word)) return false;
  const key = words.at(-1) === 'plus' ? '+' : words.at(-1);
  return words.slice(0, -1).every(word => MODIFIERS.includes(word)) && ([...key].length === 1 || key in KEY_CAPS || FUNCTION_KEY.test(key));
}
/**
 * What a host draws for a `shortcut` value: {keys: [{text, square}], join},
 * the keys in this platform's words and whether they are joined with + (not
 * on an Apple platform, and only between keys). A value that is not the
 * notation -- text a page wrote for people, such as ⇧⌘L -- is one key of
 * that text. Empty: no keys.
 */


function shortcutView(value, apple = isApplePlatform()) {
  const text = String(value ?? '').trim();
  if (!text) return {
    keys: [],
    join: false
  };
  if (!isNotation(text)) return {
    keys: [{
      text,
      square: [...text].length === 1
    }],
    join: false
  };
  const keys = shortcutCaps(parseShortcut(text), apple);
  return {
    keys,
    join: !apple && keys.length > 1
  };
}
/** The value of aria-keyshortcuts (WAI-ARIA 1.2): Meta+K, Control+K, /. */

function ariaKeyShortcuts(parsed, apple = isApplePlatform()) {
  if (!parsed) return '';
  const names = [];
  if (parsed.modifiers.has('ctrl') || parsed.modifiers.has('mod') && !apple) names.push('Control');
  if (parsed.modifiers.has('alt')) names.push('Alt');
  if (parsed.modifiers.has('shift')) names.push('Shift');
  if (parsed.modifiers.has('meta') || parsed.modifiers.has('mod') && apple) names.push('Meta');
  const key = KEY_NAMES[parsed.key] ?? (parsed.key === ' ' ? 'Space' : parsed.key.length === 1 ? parsed.key.toUpperCase() : parsed.key);
  return [...names, key === ' ' ? 'Space' : key].join('+');
} // Whether the event's key is the combination's key: by the character it
// typed, or by the physical key for a letter, a digit or the punctuation
// above, so mod+k is heard on a Russian layout too.

function sameKey(event, key) {
  const name = KEY_NAMES[key];
  if (name) return event.key === name;
  if (String(event.key).toLowerCase() === key) return true;
  if (/^[a-z]$/u.test(key)) return event.code === `Key${key.toUpperCase()}`;
  if (/^[0-9]$/u.test(key)) return event.code === `Digit${key}`;
  return PUNCTUATION_CODES[key] !== undefined && event.code === PUNCTUATION_CODES[key];
}
/** Whether a keydown is the combination. */


function matchesShortcut(event, parsed, apple = isApplePlatform()) {
  if (!parsed || !event) return false;
  const wants = {
    ctrl: parsed.modifiers.has('ctrl') || parsed.modifiers.has('mod') && !apple,
    meta: parsed.modifiers.has('meta') || parsed.modifiers.has('mod') && apple,
    alt: parsed.modifiers.has('alt'),
    shift: parsed.modifiers.has('shift')
  };
  if (Boolean(event.ctrlKey) !== wants.ctrl || Boolean(event.metaKey) !== wants.meta || Boolean(event.altKey) !== wants.alt) return false; // Shift is part of typing a punctuation mark on many layouts (? is shift+/):
  // a combination that does not name it does not mind it for punctuation, and
  // minds it for a letter, a digit or a named key.

  const punctuation = parsed.key.length === 1 && !/^[a-z0-9]$/u.test(parsed.key);
  if (!punctuation && Boolean(event.shiftKey) !== wants.shift) return false;
  if (punctuation && wants.shift && !event.shiftKey) return false;
  return sameKey(event, parsed.key);
}
/** A combination with mod, ctrl, alt or meta is a command even in a field. */

function isCommandShortcut(parsed) {
  return Boolean(parsed) && ['mod', 'ctrl', 'alt', 'meta'].some(name => parsed.modifiers.has(name));
}
/** Whether focus is where a person types: a field, a select or editable text. */

function isEditableTarget(target) {
  const element = target instanceof Element ? target : null;
  if (!element) return false;
  if (element.isContentEditable) return true;
  const tag = element.localName;
  if (tag === 'textarea' || tag === 'select') return true;
  if (tag !== 'input') return false;
  const type = (element.getAttribute('type') || 'text').toLowerCase();
  return !['button', 'submit', 'reset', 'checkbox', 'radio', 'range', 'color', 'file', 'image', 'hidden'].includes(type);
}

/***/ },

/***/ "50d2a204ba4c"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SPINNER_DEFAULT_LOOK: () => (/* binding */ SPINNER_DEFAULT_LOOK),
/* harmony export */   SPINNER_DOTS: () => (/* binding */ SPINNER_DOTS),
/* harmony export */   SPINNER_DOTS_FILLED: () => (/* binding */ SPINNER_DOTS_FILLED),
/* harmony export */   SPINNER_GRID: () => (/* binding */ SPINNER_GRID),
/* harmony export */   SPINNER_LIVE_AREA: () => (/* binding */ SPINNER_LIVE_AREA),
/* harmony export */   SPINNER_LOOKS: () => (/* binding */ SPINNER_LOOKS),
/* harmony export */   SPINNER_STROKE: () => (/* binding */ SPINNER_STROKE),
/* harmony export */   createInlineSpinner: () => (/* binding */ createInlineSpinner),
/* harmony export */   createLadderSpinnerSvg: () => (/* binding */ createLadderSpinnerSvg),
/* harmony export */   createSpinnerSvg: () => (/* binding */ createSpinnerSvg),
/* harmony export */   createSvgNode: () => (/* binding */ createSvgNode),
/* harmony export */   normalizeSpinnerLook: () => (/* binding */ normalizeSpinnerLook)
/* harmony export */ });
// The spinner's drawing, without the component's side effects (no registry, no
// observer), so a control that shows work in place of its icon -- a button, an
// icon button, a group's segment, a modal waiting for its content -- draws the
// one spinner of the Framework without loading or binding the spinner
// component (simai/ui-source#10).
//
// The ladder: a spinner is drawn on the icon grid. Material Symbols are drawn on
// 24 units and, at the regular weight the Framework's controls use, stroke 2 of
// them; a spinner on the same grid, scaled to the icon box of a step, strokes as
// the icons of that step do, and needs no stroke of its own per step.
//
// The ring is drawn inside the icon's live area, not across its box (docs
// review R027, owner decision C11, 2026-11-07): Material Symbols draw in 20 of
// their 24 units and leave 2 of air on every side, so a ring that filled the
// box stood larger than the icon beside it. On the grid the ring's outer edge
// is the live area -- radius 9 at stroke 2, 20 units across -- and the box
// stays the icon's box, so a control that swaps its icon for the spinner moves
// nothing. The proportion is the grid's, the same at every step.
//
// The looks (simai/ui-source#11): every spinner carries the four looks on the
// same ring -- the arc and the breathing arc (one circle, two motions), the
// comet and the dots -- and the spinner sheet shows the one the page asks for:
// data-sf-spinner on html, body or any block (the nearest wins), data-variant on
// the spinner itself above both. The choice is CSS alone, so a page that
// changes the attribute changes every spinner at once, drawn or not yet drawn.
// Without the spinner sheet only the arc is shown, still.
const SVG_NS = 'http://www.w3.org/2000/svg';
const SPINNER_GRID = 24;
const SPINNER_STROKE = 2;
const SPINNER_LIVE_AREA = 20;
const SPINNER_LOOKS = ['arc', 'breathing', 'comet', 'dots'];
const SPINNER_DEFAULT_LOOK = 'arc'; // The dots look on the grid: a ring of dots as big as the stroke allows, so at
// every step the dots are the step's and no attribute sizes them.

const SPINNER_DOTS = 8;
const SPINNER_DOTS_FILLED = 3; // The comet: a head and a tail a little under half the ring, in segments whose
// opacity falls towards the end of the tail. Segments rather than a gradient,
// because an SVG gradient cannot follow a circle and a CSS one would leave the
// ring and its stroke; each segment strokes in the current ink.

const COMET_SEGMENTS = 10;
const COMET_LENGTH = 40;
function normalizeSpinnerLook(value, fallback = SPINNER_DEFAULT_LOOK) {
  const look = String(value ?? '').trim().toLowerCase();
  return SPINNER_LOOKS.includes(look) ? look : fallback;
}
function createSvgNode(tagName, attributes = {}) {
  const node = document.createElementNS(SVG_NS, tagName);
  Object.entries(attributes).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return;
    }

    node.setAttribute(key, String(value));
  });
  return node;
}

const round = value => Math.round(value * 1000) / 1000; // The four looks in one drawing. On the ladder it is the 24-unit grid with
// stroke 2, every look on the ring of the live area (`inset` 2 units from the
// edge of the box); a spinner still drawn in pixels (the deprecated attributes) passes
// its own width, height and stroke. The circles carry presentation attributes
// as well as their classes: the spinner sheet styles them (track colour, the
// motion of each look, the still frame under reduced motion), and until that
// sheet has arrived they draw a faint ring and the arc in the current ink
// rather than a filled black disc; the comet and the dots wait hidden. The arc
// is a fixed 30% of the ring (simai/ui-source#13): the sheet turns the drawing,
// the arc itself never changes length.


function createSpinnerSvg({
  width = SPINNER_GRID,
  height = SPINNER_GRID,
  stroke = SPINNER_STROKE,
  dots = SPINNER_DOTS,
  filled = SPINNER_DOTS_FILLED,
  dotRadius = null,
  direction = 'clockwise',
  pixel = false,
  inset = 0
} = {}) {
  const cx = width / 2;
  const cy = height / 2; // The outer edge of every look: the track, the arc, the comet and the dots.

  const half = Math.max(stroke, Math.min(width, height) / 2 - inset);
  const radius = Math.max(1, half - stroke / 2);
  const svg = createSvgNode('svg', {
    class: 'sf-loader-svg',
    viewBox: `0 0 ${width} ${height}`,
    width: pixel ? width : null,
    height: pixel ? height : null,
    'aria-hidden': 'true',
    focusable: 'false'
  });
  const ring = {
    cx,
    cy,
    r: round(radius),
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': stroke
  };
  const track = createSvgNode('circle', {
    class: 'sf-loader-ring-filled',
    ...ring,
    opacity: '0.3'
  });
  const accent = createSvgNode('circle', {
    class: 'sf-loader-ring-accent',
    ...ring,
    'stroke-linecap': 'round',
    pathLength: 100,
    'stroke-dasharray': '30 70',
    transform: `rotate(90 ${cx} ${cy})`
  }); // The comet starts at the top and runs clockwise: segment 0 is the end of the
  // tail, the last one the head, drawn last and with a round cap.

  const comet = createSvgNode('g', {
    class: 'sf-loader-comet',
    display: 'none',
    transform: `rotate(-90 ${cx} ${cy})`
  });
  const segment = COMET_LENGTH / COMET_SEGMENTS;

  for (let index = 0; index < COMET_SEGMENTS; index += 1) {
    const head = index === COMET_SEGMENTS - 1;
    comet.append(createSvgNode('circle', {
      class: `sf-loader-comet-segment${head ? ' sf-loader-comet-head' : ''}`,
      ...ring,
      'stroke-linecap': head ? 'round' : 'butt',
      pathLength: 100,
      'stroke-dasharray': `${round(segment)} ${round(100 - segment)}`,
      'stroke-dashoffset': round(-segment * index),
      opacity: round(((index + 1) / COMET_SEGMENTS) ** 1.6)
    }));
  } // The dots sit on the same ring: a dot as wide as the stroke allows without
  // touching its neighbours, so fewer dots are bigger ones.


  const count = Math.max(3, Math.min(32, Math.floor(Number(dots) || SPINNER_DOTS)));
  const active = Math.max(1, Math.min(count, Math.floor(Number(filled) || SPINNER_DOTS_FILLED)));
  const fitted = Math.min(stroke, 0.7 * Math.PI * (half - stroke) / count);
  const dotR = dotRadius === null || dotRadius === undefined || dotRadius === '' ? fitted : Math.max(1, Math.min(Number(dotRadius) || fitted, half / 4));
  const orbit = Math.max(dotR, half - dotR);
  const dotsGroup = createSvgNode('g', {
    class: 'sf-loader-dots',
    display: 'none',
    style: `--sf-loader-dot-count:${count}; --sf-loader-dot-filled:${active};`
  });

  for (let index = 0; index < count; index += 1) {
    const angle = Math.PI * 2 / count * index - Math.PI / 2;
    const step = direction === 'counterclockwise' ? index : (count - index) % count;
    dotsGroup.append(createSvgNode('circle', {
      class: `sf-loader-dot${index < active ? ' sf-loader-dot--active' : ''}`,
      cx: round(cx + orbit * Math.cos(angle)),
      cy: round(cy + orbit * Math.sin(angle)),
      r: round(dotR),
      fill: 'currentColor',
      style: `--sf-loader-dot-index:${index}; --sf-loader-dot-step:${step};`
    }));
  }

  svg.append(track, accent, comet, dotsGroup);
  return svg;
} // The drawing on the icon grid, the one every spinner on the ladder uses: the
// ring in the icon's live area, 20 of the 24 units.

function createLadderSpinnerSvg(options = {}) {
  return createSpinnerSvg({ ...options,
    width: SPINNER_GRID,
    height: SPINNER_GRID,
    stroke: SPINNER_STROKE,
    dotRadius: null,
    pixel: false,
    inset: (SPINNER_GRID - SPINNER_LIVE_AREA) / 2
  });
} // A spinner that stands in a control: endless, decorative (the control keeps
// its label and says aria-busy), and marked bound so the spinner component,
// when it is on the page, leaves it as drawn. `className` names the control's
// slot for it; `overlay` lays it over the control's hidden label instead of in
// the place of an icon. Its look is the page's, as every spinner's.

function createInlineSpinner({
  className = '',
  overlay = false
} = {}) {
  const root = document.createElement('span');
  root.className = ['sf-loader-container', 'sf-loader--infinite', className, className && overlay ? `${className}--overlay` : ''].filter(Boolean).join(' ');
  root.dataset.sfSpinnerBound = '1';
  root.dataset.infinite = 'true';
  root.setAttribute('aria-hidden', 'true');
  const indicator = document.createElement('span');
  indicator.className = 'sf-loader--loading-indicator';
  indicator.append(createLadderSpinnerSvg());
  root.append(indicator);
  return root;
}

/***/ },

/***/ "1fab5b780b3d"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("b5e6381153f8");
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("2a080a730149");
/* harmony import */ var _core_js_control_spacing__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("9abcb852f1cf");
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("d3818183b14c");
/* harmony import */ var _component_kbd_js_shortcut__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("151a293c8c90");
/* harmony import */ var _helpers_cycle__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("64feefebb417");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("5bb33fb22db3");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("902a6f38915d");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("d7b6a56d1dd6");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("96bdb2ff5f5d");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_2__, lit__WEBPACK_IMPORTED_MODULE_3__, _core_js_control_spacing__WEBPACK_IMPORTED_MODULE_4__, _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_5__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_2__, lit__WEBPACK_IMPORTED_MODULE_3__, _core_js_control_spacing__WEBPACK_IMPORTED_MODULE_4__, _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_5__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _core_js_control_spacing__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_core_js_control_spacing__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_5__);












const COMPONENT_ATTRIBUTES = new Set(["template", "size", "height", "appearance", "type", "scheme", "status", "text", "icon", "icon-start", "icon-end", "icon-left", "icon-right", "icon-position", "text-position", "spacing", "tightness", "radius", "full-width", "root-class", "loading", "segment", "disabled", "native-type", "form", "name", "value", "href", "target", "rel", "expanded", "pressed", "text-pressed", "cycle", "theme-cycle", "shortcut", "shortcut-listen", "aria-label", "class", "style", "id", "slot"]); // height (1.10.0, decision C27): the size's tightness steps. A value outside
// the list reads as default and is said once per button.

const HEIGHTS = new Set(["low", "default", "high", "highest"]);

function buttonHeight(host) {
  const raw = host.getAttribute("height");
  if (raw === null || raw === "") return "default";
  const value = raw.trim().toLowerCase();
  if (HEIGHTS.has(value)) return value;

  if (!host.__sfHeightWarned) {
    host.__sfHeightWarned = true;
    globalThis.console?.warn?.(`[SIMAI Framework] sf-button: height="${raw}" is not a height; write low, default, high or highest (the size's steps). Read as default.`);
  }

  return "default";
} // spacing is deprecated (1.10.0, decision C27; journal
// attribute-button-spacing-to-height): it keeps drawing the side padding
// until 2027-01-01 and is not turned into a height. It is noted in
// SF.deprecations and said once per page in the console -- the decision asks
// for the warning whether or not the page opted in to them.


function noteSpacing(host) {
  if (!host.hasAttribute("spacing")) return;
  (0,_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_5__.noteDeprecated)({
    component: "sf-button",
    kind: "attribute",
    from: "spacing",
    to: "height",
    since: "2026-11-09",
    remove_after: "2027-01-01"
  });
  const root = globalThis.SF = globalThis.SF || {};
  if (root.__sfButtonSpacingWarned) return;
  Object.defineProperty(root, "__sfButtonSpacingWarned", {
    value: true,
    configurable: true
  });
  globalThis.console?.warn?.("[SIMAI Framework] sf-button: spacing is deprecated until 2027-01-01 and draws the side padding only; write height=\"low|default|high|highest\" for the control height. See contracts/changes/journal.json (attribute-button-spacing-to-height).");
} // surface with the quiet scheme on-surface-variant is retired (1.11.0,
// following C15 on the icon buttons; buttons review 2026-11-09): on the
// surface fill the quiet ink read 4.88:1 in the dark theme and a key on it
// 4.38:1. The pair draws as surface with on-surface until 2027-01-01 (change
// journal value-button-surface-quiet-scheme), noted in SF.deprecations and
// said once per page in the console with its replacement. A combination of two
// settings, so the component reads it itself rather than through a value alias.


function retiredSurfaceQuiet(host) {
  const appearance = host.getAttribute("appearance") ?? host.getAttribute("type");
  return appearance === "surface" && host.getAttribute("scheme") === "on-surface-variant";
}

function noteSurfaceQuiet() {
  (0,_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_5__.noteDeprecated)({
    component: "sf-button",
    kind: "value",
    attribute: "scheme",
    from: "on-surface-variant",
    to: "on-surface",
    since: "2026-11-09",
    remove_after: "2027-01-01"
  });
  const root = globalThis.SF = globalThis.SF || {};
  if (root.__sfButtonSurfaceQuietWarned) return;
  Object.defineProperty(root, "__sfButtonSurfaceQuietWarned", {
    value: true,
    configurable: true
  });
  globalThis.console?.warn?.("[SIMAI Framework] sf-button: appearance=\"surface\" with scheme=\"on-surface-variant\" is retired until 2027-01-01 and draws as scheme=\"on-surface\"; write scheme=\"on-surface\", or appearance=\"tonal\" or \"outline\" to keep the quiet scheme. See contracts/changes/journal.json (value-button-surface-quiet-scheme).");
} // href (1.4.0) takes the addresses a link may follow: a relative one, a
// fragment, http(s), mailto and tel. Any other scheme (javascript:, data:)
// draws the button as a button.


const SAFE_HREF = /^(?:[^:/?#]*(?:[/?#]|$)|https?:|mailto:|tel:)/iu;

function linkAddress(value) {
  const href = String(value || "").trim();
  return href && SAFE_HREF.test(href) ? href : "";
} // A link that opens a new tab says noopener noreferrer unless the page wrote
// its own rel (1.7.0): the opened page cannot reach window.opener.


function linkRelation(target, rel) {
  const own = String(rel || "").trim();
  if (own) return own;
  return String(target || "").trim().toLowerCase() === "_blank" ? "noopener noreferrer" : "";
}

function applyButtonAttributes(host, button) {
  host?.forwardHostAttributes(button, {
    exclude: COMPONENT_ATTRIBUTES,
    transferDataAttributes: true,
    storageKey: "__sfButtonForwardedDataAttributes",
    targetStorageKey: "__sfButtonAttributeKeys"
  });
} // sf-button from its component.json (standard simai.smart-component 1.3.8 §3,
// §4, §8): the settings are the attributes and properties
// core/js/element-manifest.js makes from the manifest. The legacy names --
// type, icon-left, icon-right, tightness -- and the legacy values -- ghost,
// danger, critical, tightness's words, left and right -- are dated aliases
// (aliases.json, until 2026-12-01): the shim writes the new attribute and
// notes the use, so a value outside a list reads as the default here.


const ButtonElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_8__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_10__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_11__
  },
  source: "ru",
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_9__
});

class SfButton extends ButtonElement {
  static get props() {
    return { ...super.props,
      // The attribute takes JSON or value::label::flags|…; the property a list.
      cycle: {
        type: Array,
        default: [],
        parser: _helpers_cycle__WEBPACK_IMPORTED_MODULE_7__.parseCycle
      }
    };
  } // cycle is a list setting (§4.2) whose attribute keeps its JSON form, as
  // sf-segmented's items: a list set as a property stays the instance's own.


  get cycle() {
    return this.getProp("cycle");
  }

  set cycle(value) {
    Object.defineProperty(this, "cycle", {
      configurable: true,
      enumerable: true,
      writable: true,
      value
    });
    this.requestComponentUpdate?.("cycle");
  } // The cycle (D11d): null when the button is not one. Its name is the
  // button's aria-label, or none: then the current label is the text and the name.


  cycleState() {
    if (!(0,_helpers_cycle__WEBPACK_IMPORTED_MODULE_7__.hasCycle)(this)) return null;
    return (0,_helpers_cycle__WEBPACK_IMPORTED_MODULE_7__.cycleState)(this, {
      base: this.getAttribute("aria-label") || "",
      words: (key, options) => this.sfWord(key, options)
    });
  }

  constructor() {
    super();
    this._attributeObserver = null;
    this._textFromChildren = "";
    this._shortcutListener = null;
  } // scheme: surface with on-surface-variant reads as on-surface (1.11.0).


  get scheme() {
    if (retiredSurfaceQuiet(this)) {
      noteSurfaceQuiet();
      return "on-surface";
    }

    return super.scheme;
  }

  set scheme(value) {
    super.scheme = value;
  }

  get templateName() {
    return this.getAttribute("template") || "default";
  } // A text attribute, even an empty one, is the label: emptying it empties
  // the button. Before, an empty attribute fell through to the text captured
  // from children, and a toolbar that cleared a label kept the old one
  // (simai.main, Main's isolated toolbar on ui-36116c01a792, 2026-10-28).


  get text() {
    if (this.hasAttribute("text")) return this.getAttribute("text") || "";
    return this._textFromChildren || "";
  }

  set text(value) {
    super.text = value;
  } // The label a button written in JavaScript carries, the way every element
  // carries one: createElement('sf-button') with textContent = 'Добавить', and
  // <sf-button>Добавить</sf-button> in HTML. The text attribute and the text
  // slot still come first. Before, an unslotted text child was left where it
  // was: the button rendered empty and the text stood beside it as a second,
  // unstyled label (consumer case ui-mail.button-text-content, 2026-10-21).


  captureTextChildren() {
    if (this.hasSlotContent?.("text")) return;
    const nodes = Array.from(this.childNodes).filter(node => node.nodeType === 3 && String(node.textContent).trim() !== "");
    if (!nodes.length) return;
    this._textFromChildren = nodes.map(node => String(node.textContent).trim()).join(" ");
    nodes.forEach(node => node.remove());
  } // Null when the attribute is not there, and '' only when it is there and
  // empty. The template tells those apart on purpose: an empty icon-start is a
  // consumer saying «no icon here», and it suppresses the `icon` shortcut,
  // while an absent one lets the shortcut through. Both answered '' before, so
  // «never written» read as «deliberately emptied» and `icon="add"` on a button
  // drew nothing at all (owner, 2026-10-09). The old names icon-left and
  // icon-right write these attributes through the dated aliases.


  get iconStart() {
    return this.getAttribute('icon-start');
  }

  set iconStart(value) {
    super.iconStart = value;
  }

  get iconEnd() {
    return this.getAttribute('icon-end');
  }

  set iconEnd(value) {
    super.iconEnd = value;
  }

  get rootClass() {
    return this.getAttribute("root-class") || "";
  } // expanded is optional (§4.2): absent says nothing, so aria-expanded is
  // written only while the attribute is there.


  get expanded() {
    return this.hasAttribute("expanded") ? super.expanded : undefined;
  }

  set expanded(value) {
    if (value === undefined || value === null) this.removeAttribute("expanded");else this.setAttribute("expanded", value ? "" : "false");
  } // pressed is optional too: absent, the button is not a toggle and says
  // nothing; present, aria-pressed and the selected look follow it.


  get pressed() {
    // A cycle is not a toggle: pressed is ignored beside it.
    if ((0,_helpers_cycle__WEBPACK_IMPORTED_MODULE_7__.hasCycle)(this)) return undefined;
    return this.hasAttribute("pressed") ? super.pressed : undefined;
  }

  set pressed(value) {
    if (value === undefined || value === null) this.removeAttribute("pressed");else this.setAttribute("pressed", value ? "" : "false");
  }

  templateContext() {
    // A child parsed after connectedCallback is still the label.
    this.captureTextChildren?.();
    const props = this.getPropsContext();
    const cycle = this.cycleState();
    if (cycle) (0,_helpers_cycle__WEBPACK_IMPORTED_MODULE_7__.warnCycleToggle)(this, ["pressed", "text-pressed"]);
    noteSpacing(this);
    const announce = Boolean(cycle && this.__sfCycleAnnounce);
    this.__sfCycleAnnounce = false; // A cycle with an icon shows the item's icon in place of the start icon;
    // one without shows the item's label as its text.

    const cycleIcon = cycle?.item.icon || ""; // The icons a press can show, asked for before the press (R074).

    (0,_helpers_cycle__WEBPACK_IMPORTED_MODULE_7__.preloadSwitchIcons)(this, {
      icons: [this.iconStart, this.iconEnd, ...["icon", "icon-left", "icon-right"].map(name => this.getAttribute(name))]
    });
    return this.createTemplateContext({ ...props,
      // Through the getter: the props context knows only the text attribute,
      // and a button whose label is a text child has none.
      text: this.text,
      // Resolved names the template reads (contracts/template-context.json).
      iconStart: this.iconStart,
      iconEnd: this.iconEnd,
      appearance: this.appearance,
      type: this.appearance,
      status: this.status,
      scheme: this.scheme,
      size: this.size,
      iconPosition: this.iconPosition,
      nativeType: this.nativeType,
      // A native button's own words (1.5.0): the form it submits, and the
      // name and value it submits under.
      formId: this.getAttribute("form") || "",
      submitName: this.getAttribute("name") || "",
      submitValue: cycle && !cycle.theme ? cycle.item.value : this.getAttribute("value") ?? "",
      href: linkAddress(this.getAttribute("href")),
      // Where the link opens and its relation (1.7.0, Larena after sf-wizard):
      // a new tab with no rel is noopener noreferrer.
      linkTarget: this.getAttribute("target") || "",
      linkRel: linkRelation(this.getAttribute("target"), this.getAttribute("rel")),
      radius: this.radius,
      // A cycle's name says its current value; without an aria-label the
      // shown label is the name.
      ariaLabel: cycle ? this.getAttribute("aria-label") || cycleIcon && !this.text ? cycle.name : "" : this.getAttribute("aria-label") || "",
      expanded: this.expanded,
      pressed: cycle ? undefined : this.pressed,
      textPressed: cycle ? "" : this.textPressed,
      // The cycle's item: its icon in place of the start icon, or, without
      // one, its label in place of the text.
      // cycleView, not cycle: `cycle` is the setting (the list of items).
      cycleView: cycle ? {
        icon: cycleIcon,
        label: cycleIcon ? '' : cycle.item.label,
        pressedLook: cycle.item.pressed,
        name: cycle.name,
        tooltip: cycle.tooltip,
        announcement: announce ? cycle.name : ""
      } : null,
      // The shortcut's key caps and its aria-keyshortcuts, in this platform's
      // words (component/kbd/js/shortcut.js).
      shortcutCaps: (0,_component_kbd_js_shortcut__WEBPACK_IMPORTED_MODULE_6__.shortcutCaps)((0,_component_kbd_js_shortcut__WEBPACK_IMPORTED_MODULE_6__.parseShortcut)(this.shortcut)),
      // Words join with + where the platform spells its modifiers (the kbd
      // sheet shows the join only where keys are plain glyphs).
      shortcutJoin: !(0,_component_kbd_js_shortcut__WEBPACK_IMPORTED_MODULE_6__.isApplePlatform)(),
      ariaKeyShortcuts: (0,_component_kbd_js_shortcut__WEBPACK_IMPORTED_MODULE_6__.ariaKeyShortcuts)((0,_component_kbd_js_shortcut__WEBPACK_IMPORTED_MODULE_6__.parseShortcut)(this.shortcut)),
      ...(0,_core_js_control_spacing__WEBPACK_IMPORTED_MODULE_4__.resolveControlSpacing)({
        spacing: this.getAttribute('spacing')
      }),
      height: buttonHeight(this),
      component: this
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_2__.renderButtonTemplate)(this.templateContext());
  }

  resolveUpdateMode() {
    return "lit";
  }

  onConnected() {
    this.captureTextChildren();

    if (!this._pressListener) {
      this._pressListener = event => this.handlePress(event);

      this.addEventListener("click", this._pressListener);
    }

    this.syncShortcutListener();

    if (!this._cycleTheme) {
      // A theme cycle follows the theme wherever it was set.
      this._cycleTheme = () => (0,_helpers_cycle__WEBPACK_IMPORTED_MODULE_7__.themeCycleFollow)(this);

      globalThis.addEventListener?.("sf-theme-change", this._cycleTheme);
    }

    super.onConnected?.();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback?.(name, oldValue, newValue);

    if ((name === "shortcut" || name === "shortcut-listen") && oldValue !== newValue && this.isConnected) {
      this.syncShortcutListener();
    }
  } // shortcut-listen: one keydown listener on the document while the button is
  // connected and listens. The combination presses the native button -- a
  // click, so the press event follows as for a person's click -- unless a
  // listener before it took the key, the button is disabled or loading, or
  // the combination has no modifier and focus is in a field.


  syncShortcutListener() {
    const wanted = Boolean(this.shortcutListen) && Boolean((0,_component_kbd_js_shortcut__WEBPACK_IMPORTED_MODULE_6__.parseShortcut)(this.shortcut));

    if (wanted && !this._shortcutListener) {
      this._shortcutListener = event => this.handleShortcut(event);

      globalThis.document?.addEventListener("keydown", this._shortcutListener);
    } else if (!wanted && this._shortcutListener) {
      globalThis.document?.removeEventListener("keydown", this._shortcutListener);
      this._shortcutListener = null;
    }
  }

  handleShortcut(event) {
    if (event.defaultPrevented || event.repeat || event.isComposing) return;
    const parsed = (0,_component_kbd_js_shortcut__WEBPACK_IMPORTED_MODULE_6__.parseShortcut)(this.shortcut);
    if (!(0,_component_kbd_js_shortcut__WEBPACK_IMPORTED_MODULE_6__.matchesShortcut)(event, parsed)) return;
    const target = event.composedPath?.()[0] ?? event.target;
    if (!(0,_component_kbd_js_shortcut__WEBPACK_IMPORTED_MODULE_6__.isCommandShortcut)(parsed) && (0,_component_kbd_js_shortcut__WEBPACK_IMPORTED_MODULE_6__.isEditableTarget)(target)) return;
    const button = this.querySelector(".sf-button");
    if (!button || button.disabled || button.getAttribute("aria-disabled") === "true" || !button.getClientRects().length) return;
    event.preventDefault();
    button.click();
  } // §8: a person's press of the native button, sent once as sf-button-press.
  // A disabled or loading button never gets the click, and a click on the host
  // outside the native button (there is no such box: the host is
  // display:contents) is not a press.


  handlePress(event) {
    const button = this.querySelector(".sf-button");
    if (!button || !(event.target instanceof Node) || !button.contains(event.target)) return; // A link that is off (href, disabled or loading: 1.4.0) is not pressed either.

    if (button.disabled || button.getAttribute("aria-disabled") === "true") return;
    this.sfEmit("press", {}); // A cycle moves to its next value after the press (D11d).

    (0,_helpers_cycle__WEBPACK_IMPORTED_MODULE_7__.pressCycle)(this, this.cycleState());
  }

  afterRender() {
    const button = this.querySelector(".sf-button");
    applyButtonAttributes(this, button); // The cycle's tooltip names the current and the next value.

    const cycle = this.cycleState();
    if (button && cycle) button.setAttribute("title", cycle.tooltip);

    if (!this._attributeObserver) {
      this._attributeObserver = this.observeForwardedHostAttributes(() => this.querySelector(".sf-button"), {
        exclude: COMPONENT_ATTRIBUTES,
        transferDataAttributes: true,
        storageKey: "__sfButtonForwardedDataAttributes",
        targetStorageKey: "__sfButtonAttributeKeys"
      })._forwardHostAttributeObserver;
    }
  } // The native button is what takes focus: the host lays out as
  // display:contents and takes none, so focus() on the host did nothing and
  // left document.activeElement where it was. A product that holds the host --
  // from querySelector('sf-button'), or from closest('sf-button') on a data-* match --
  // focuses it and reaches the control through this.


  focusDelegate() {
    return this.querySelector(".sf-button");
  }

  get value() {
    return {
      template: this.templateName,
      size: this.size,
      height: buttonHeight(this),
      appearance: this.appearance,
      type: this.appearance,
      scheme: this.scheme,
      status: this.status,
      text: this.text,
      icon: this.icon,
      iconLeft: this.iconStart,
      iconRight: this.iconEnd,
      iconStart: this.iconStart,
      iconEnd: this.iconEnd,
      iconPosition: this.iconPosition,
      tightness: (0,_core_js_control_spacing__WEBPACK_IMPORTED_MODULE_4__.resolveControlSpacing)({
        spacing: this.getAttribute('spacing')
      }).tightness,
      spacing: this.spacing,
      radius: this.radius,
      fullWidth: this.fullWidth,
      rootClass: this.rootClass,
      loading: this.loading,
      disabled: this.disabled,
      nativeType: this.nativeType,
      form: this.getAttribute("form") || "",
      name: this.getAttribute("name") || "",
      value: this.getAttribute("value") || "",
      href: this.getAttribute("href") || "",
      target: this.getAttribute("target") || "",
      rel: this.getAttribute("rel") || "",
      shortcut: this.shortcut,
      shortcutListen: this.shortcutListen,
      ariaLabel: this.getAttribute("aria-label") || ""
    };
  }

  onClick(handler, options) {
    if (typeof handler === "function") {
      this.addEventListener("click", handler, options);
    }

    return this;
  }

  onFocus(handler, options) {
    if (typeof handler === "function") {
      this.addEventListener("focusin", handler, options);
    }

    return this;
  }

  onBlur(handler, options) {
    if (typeof handler === "function") {
      this.addEventListener("focusout", handler, options);
    }

    return this;
  }

  onMouseEnter(handler, options) {
    if (typeof handler === "function") {
      this.addEventListener("mouseenter", handler, options);
    }

    return this;
  }

  onMouseLeave(handler, options) {
    if (typeof handler === "function") {
      this.addEventListener("mouseleave", handler, options);
    }

    return this;
  }

  setDisabled(nextValue = true) {
    if (nextValue) {
      this.setAttribute("disabled", "");
    } else {
      this.removeAttribute("disabled");
    }

    return this;
  } // A pressed toggle draws its icons filled (1.6.0, rule C12): the filled
  // attribute, not the sheet's FILL alone, so the Loader's icon subset holds
  // the filled glyph -- a FILL set by a rule drew the outlined one from it.


  createIcon(name, filled = false) {
    if (!name) return "";
    return (0,lit__WEBPACK_IMPORTED_MODULE_3__.html)`<sf-icon icon="${name}" ?filled=${filled} root-class="pointer-event-none" weight="400" aria-hidden="true"></sf-icon>`;
  }

  set value(nextValue) {
    this.setValueAttributes(nextValue);
  }

  onDisconnected() {
    if (this._pressListener) {
      this.removeEventListener("click", this._pressListener);
      this._pressListener = null;
    }

    if (this._shortcutListener) {
      globalThis.document?.removeEventListener("keydown", this._shortcutListener);
      this._shortcutListener = null;
    }

    if (this._cycleTheme) {
      globalThis.removeEventListener?.("sf-theme-change", this._cycleTheme);
      this._cycleTheme = null;
    }

    this.disconnectForwardedHostAttributes();
    this._attributeObserver = null;
    super.onDisconnected?.();
  }

}

SfButton.define("sf-button");
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "b5e6381153f8"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderButtonTemplate: () => (/* binding */ renderButtonTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var _component_spinner_js_spinner_draw__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("50d2a204ba4c");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);


function renderButtonTemplate(context) {
  const {
    size,
    appearance,
    type,
    scheme,
    status,
    text,
    icon,
    iconLeft,
    iconRight,
    iconPosition,
    spacing,
    radius,
    rootClass,
    textPosition,
    loading,
    disabled,
    nativeType,
    ariaLabel,
    segment
  } = context;
  const normalizedIconPosition = String(iconPosition || 'start').toLowerCase();
  const isIconEnd = ['right', 'end'].includes(normalizedIconPosition);
  const leftIconName = context.cycleView?.icon || (context.iconStart ?? (iconLeft || (icon && !isIconEnd ? icon : '')));
  const rightIconName = context.iconEnd ?? (iconRight || (icon && isIconEnd ? icon : ''));
  const component = context.component;
  const leftIconContent = component?.hasSlotContent?.('icon-start') ? component.getSlotContent('icon-start') : component?.hasSlotContent?.('icon-left') ? component.getSlotContent('icon-left') : component.createIcon(leftIconName, context.pressed === true || Boolean(context.cycleView?.pressedLook));
  const rightIconContent = component?.hasSlotContent?.('icon-end') ? component.getSlotContent('icon-end') : component?.hasSlotContent?.('icon-right') ? component.getSlotContent('icon-right') : component.createIcon(rightIconName, context.pressed === true); // A toggle whose label changes (text-pressed, 1.6.0): «В избранное» at rest,
  // «В избранном» while on. The label then says the state, so aria-pressed
  // is not written as well (docs review R028, rule C12): a screen reader
  // would hear «В избранном, нажата». The look follows pressed either way.

  const pressedLabel = context.pressed === true && context.textPressed ? context.textPressed : '';
  const announcesPressed = context.pressed !== undefined && !context.textPressed;
  const textContent = component?.hasSlotContent?.('text') ? component.getSlotContent('text') : context.cycleView?.label || pressedLabel || text; // The shortcut's keys sit at the end; the label then takes the free room,
  // so a stretched button reads label ... keys and text-position places it.
  // The keys are the kbd component's (soft caps inside a button); the
  // wrapper only gives them the label's ink.

  const shortcutCaps = context.shortcutCaps || [];
  const fullText = !leftIconContent && !rightIconContent || shortcutCaps.length > 0; // Loading shows the spinner at the icon's size (simai/ui-source#10): in
  // place of the start icon, else of the end icon; a button without an icon
  // lays it over its label, which keeps its place (and the button its width)
  // and stays the accessible name. Icon-only is the first case.

  let startContent = leftIconContent;
  let endContent = rightIconContent;
  let overlayContent = '';

  if (loading) {
    const spinner = overlay => (0,_component_spinner_js_spinner_draw__WEBPACK_IMPORTED_MODULE_1__.createInlineSpinner)({
      className: 'sf-button-spinner',
      overlay
    });

    if (leftIconContent) startContent = spinner(false);else if (rightIconContent) endContent = spinner(false);else overlayContent = spinner(true);
  }

  const rootClasses = ['sf-button', `sf-button--size-${size}`, // ghost (C15): the class is sf-button--ghost; sf-button--link, its
  // former name, is written beside it until 2027-01-01 (journal
  // class-button-link-to-ghost), so a page selector that reached it
  // still does. href, not the look, makes a link.
  `sf-button--${appearance || type}`, (appearance || type) === 'ghost' ? 'sf-button--link' : '', // One colour name, as the styles expect: the status when one is set, the
  // scheme otherwise. A status says what the control is about -- an error
  // for something destructive -- and a scheme says which colour family it
  // takes; they cannot both paint it.
  // danger (C13) is drawn with the error roles: the danger class and the
  // error one the sheets and their consumers also select.
  ...(status === 'danger' || status === 'error' ? ['sf-button--danger', 'sf-button--error'] : [`sf-button--${scheme}`]), // on-surface-variant is the on-surface family one step quieter: both
  // classes, so every on-surface rule holds and one rule quietens it.
  !status && scheme === 'on-surface-variant' ? 'sf-button--on-surface' : '', 'flex', 'items-cross-center', segment ? `segment-${segment}` : '', // The spacing class, not its retired tightness name (journal
  // class-tightness-to-spacing; docs trial 4).
  spacing && spacing !== 'normal' ? `spacing-${spacing}` : '', // The height (decision C27): the class of the size's tightness step;
  // default draws none, the size's own step.
  context.height && context.height !== 'default' ? `sf-button--height-${context.height}` : '', radius ? `radius-${radius}` : '', // full-width (1.12.0, owner decision C36): sf-segmented's setting.
  context.fullWidth ? 'sf-button--full-width' : '', rootClass, loading ? 'loading sf-button-state-loading' : '', // A loading button keeps its scheme colour (owner decision C36); one
  // that is disabled as well wears the disabled look, so it says so.
  loading && disabled ? 'disabled' : '', // A toggle that is on wears the pressed look (component.buttons 1.5.0,
  // rule C12): the class carries it whether or not aria-pressed is said.
  context.pressed || context.cycleView?.pressedLook ? 'sf-button--pressed' : ''].filter(Boolean);
  const content = (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
            ${overlayContent}
            ${startContent}
            ${textContent ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span
                    class="sf-button-text-container text-${textPosition} pointer-event-none${fullText ? ' flex-1' : ''}">
        ${textContent}
      </span>` : ''}
            ${endContent}${shortcutCaps.length ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-button-shortcut pointer-event-none" aria-hidden="true"><kbd class="sf-kbd--group">${shortcutCaps.map((cap, at) => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${at && context.shortcutJoin ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-kbd-join">+</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}<kbd class=${cap.square ? 'sf-kbd--square' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>${cap.text}</kbd>`)}</kbd></span>` : ''}
`; // href (1.4.0): a link with the button's look. The browser's own link
  // follows it (Enter, the context menu, a new tab); a button's states that
  // a link has no words for -- native-type, expanded, pressed -- do not
  // apply. Disabled or loading, the link has no href, so it is not reached
  // or followed, and says aria-disabled.

  if (context.href) {
    const inactive = Boolean(disabled || loading);
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <a
                href=${inactive ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : context.href}
                target=${context.linkTarget || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                rel=${context.linkRel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                class=${rootClasses.join(' ')}
                style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                role=${inactive ? 'link' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                aria-disabled=${inactive ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                aria-label=${ariaLabel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                aria-busy=${loading ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                aria-keyshortcuts=${context.ariaKeyShortcuts || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        >${content}</a>
    `;
  }

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <button
                type=${nativeType}
                form=${context.formId || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                name=${context.submitName || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                value=${context.submitName || context.submitValue ? context.submitValue : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                class=${rootClasses.join(' ')}
                style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ?disabled=${disabled || loading}
                aria-label=${ariaLabel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                aria-busy=${loading ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                aria-expanded=${context.expanded === undefined ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : String(Boolean(context.expanded))}
                aria-pressed=${announcesPressed ? String(Boolean(context.pressed)) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                aria-keyshortcuts=${context.ariaKeyShortcuts || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        >${content}</button>${context.cycleView ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-button-announce sr-only" role="status" aria-live="polite" aria-atomic="true">${context.cycleView.announcement}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    `;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "64feefebb417"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   THEME_ICONS: () => (/* binding */ THEME_ICONS),
/* harmony export */   cycleItems: () => (/* binding */ cycleItems),
/* harmony export */   cycleState: () => (/* binding */ cycleState),
/* harmony export */   hasCycle: () => (/* binding */ hasCycle),
/* harmony export */   loaderOwnsTheme: () => (/* binding */ loaderOwnsTheme),
/* harmony export */   nextTheme: () => (/* binding */ nextTheme),
/* harmony export */   parseCycle: () => (/* binding */ parseCycle),
/* harmony export */   preloadControlIcons: () => (/* binding */ preloadControlIcons),
/* harmony export */   preloadSwitchIcons: () => (/* binding */ preloadSwitchIcons),
/* harmony export */   pressCycle: () => (/* binding */ pressCycle),
/* harmony export */   switchIconEntries: () => (/* binding */ switchIconEntries),
/* harmony export */   themeCycleFollow: () => (/* binding */ themeCycleFollow),
/* harmony export */   themeCycleValues: () => (/* binding */ themeCycleValues),
/* harmony export */   themePreference: () => (/* binding */ themePreference),
/* harmony export */   visibleTheme: () => (/* binding */ visibleTheme),
/* harmony export */   warnCycleToggle: () => (/* binding */ warnCycleToggle),
/* harmony export */   warnThemeNotOwned: () => (/* binding */ warnThemeNotOwned)
/* harmony export */ });
// One button, several values (docs review R039, owner decision D11d;
// research ui-control control/research/2026-11-08-cycle-button.md).
//
// sf-button and sf-button-icon share this: the `cycle` setting is a list of
// items shaped like sf-segmented's items ({value, label, icon} and an
// optional `pressed`, which draws the item with the pressed look), `value`
// is the current item, and a press moves to the next item and wraps. The
// `theme-cycle` setting draws a ready theme switch over SF.Loader's theme
// (the same contract as sf-segmented's theme-switch: themePreference,
// setTheme, sf-theme-change).
//
// The name and the icon say the current value («Тема: тёмная»), the tooltip
// says the current and the next («Тема: тёмная. Нажмите — как в системе»),
// and a polite live region says the new value after a press. A cycle is a
// plain button: it carries no aria-pressed, so pressed, label-pressed and
// text-pressed are ignored beside it (with one console warning).
const THEME_VALUES = ['system', 'light', 'dark']; // «Как в системе» in a cycle is the half-dark, half-light circle (D11d): a
// monitor alone does not say a theme.

const THEME_ICONS = Object.freeze({
  system: 'contrast',
  light: 'light_mode',
  dark: 'dark_mode'
});

function parseList(source) {
  if (Array.isArray(source)) return source;
  const text = String(source ?? '').trim();
  if (!text) return [];

  if (text.startsWith('[')) {
    try {
      const parsed = JSON.parse(text);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  } // value::label::flags|… as sf-segmented's items take it; a flag icon=<name>
  // names the icon, pressed draws the pressed look.


  return text.split('|').map(entry => {
    const [value, label = value, flags = ''] = entry.split('::');
    const list = flags.split(',').map(flag => flag.trim()).filter(Boolean);
    const icon = list.find(flag => flag.startsWith('icon='));
    return {
      value: value.trim(),
      label: label.trim(),
      icon: icon ? icon.slice(5) : '',
      pressed: list.includes('pressed')
    };
  });
}
/** The cycle's items, normalised: a value each, once, in the given order. */

/** Reads the attribute's JSON or value::label::flags form; a list stays a list. */


function parseCycle(value) {
  return parseList(value);
}
function cycleItems(source) {
  const seen = new Set();
  return parseList(source).map((item, index) => {
    const one = typeof item === 'string' ? {
      value: item,
      label: item
    } : item;
    if (!one || typeof one !== 'object') return null;
    const value = String(one.value ?? one.id ?? index).trim();
    if (!value || seen.has(value)) return null;
    seen.add(value);
    return {
      value,
      label: String(one.label ?? one.text ?? value),
      icon: String(one.icon || ''),
      lang: String(one.lang || '').trim(),
      pressed: Boolean(one.pressed)
    };
  }).filter(Boolean);
}
/** The themes a theme-cycle offers: all three, or the two it names. */

function themeCycleValues(attribute) {
  const named = String(attribute ?? '').trim().toLowerCase().split(/[\s,]+/u).map(word => word === 'auto' ? 'system' : word).filter(word => THEME_VALUES.includes(word));
  const unique = [...new Set(named)]; // Two themes without «as the system» flip the visible theme; anything else
  // (empty, one word, all three) is the full cycle.

  if (unique.length === 2 && !unique.includes('system')) return ['light', 'dark'];
  return THEME_VALUES;
}

const opposite = theme => theme === 'dark' ? 'light' : 'dark';

function loader() {
  return globalThis.SF?.Loader;
}
/**
 * False when the page's host draws the theme itself and started the Loader
 * with `theme: false` (SF_BOOT_CONFIG.theme): the Loader then neither reads
 * nor sets a theme, and its `theme` stays at the value it began with.
 */


function loaderOwnsTheme() {
  return loader()?.themeEnabled !== false;
}
/**
 * The theme drawn now (light or dark), whatever the preference. The Loader's
 * own value counts only while the Loader owns the theme; under a host that
 * owns it (R076: a Docara example frame) the document says what is drawn.
 */

function visibleTheme() {
  const theme = loaderOwnsTheme() ? loader()?.theme : undefined;
  if (theme === 'dark' || theme === 'light') return theme;
  const root = globalThis.document?.documentElement;
  if (root?.classList?.contains('theme-dark')) return 'dark';
  if (root?.classList?.contains('theme-light')) return 'light';
  return globalThis.matchMedia?.('(prefers-color-scheme: dark)')?.matches ? 'dark' : 'light';
}
/** What the person chose: system, light or dark. */

function themePreference() {
  const preference = loader()?.themePreference;
  return THEME_VALUES.includes(preference) ? preference : 'system';
}
/**
 * The owner's order (D11d): first the theme opposite to the visible one,
 * then the other, then «as the system». It needs the value before the
 * current one: from an explicit theme reached from the other explicit theme
 * the next is system; from system, or from a theme the page loaded with, the
 * opposite theme. Two themes: always the opposite of the visible theme.
 */

function nextTheme({
  values,
  current,
  previous
}) {
  if (!values.includes('system')) return opposite(visibleTheme());
  if (current === 'system') return opposite(visibleTheme());
  if (previous && previous !== 'system' && previous === opposite(current)) return 'system';
  return opposite(current);
}
/**
 * The cycle state the template reads: {items, item, next, index, name,
 * tooltip}. `words(key, vars)` gives the element's words; `base` is the
 * button's own name (aria-label, or the text of an sf-button).
 */

function hasCycle(host) {
  if (host.hasAttribute('theme-cycle')) return true;
  const own = host.getProp?.('cycle');
  return Boolean(host.hasAttribute('cycle') || Array.isArray(own) && own.length);
}
function cycleState(host, {
  base = '',
  words
}) {
  if (host.hasAttribute('theme-cycle')) {
    const values = themeCycleValues(host.getAttribute('theme-cycle'));
    const two = !values.includes('system');
    const current = two ? visibleTheme() : themePreference();

    const label = value => words(`theme-${value}`);

    const items = values.map(value => ({
      value,
      label: label(value),
      icon: THEME_ICONS[value],
      lang: '',
      pressed: false
    }));
    const item = items.find(one => one.value === current) ?? items[0];
    const nextValue = nextTheme({
      values,
      current: item.value,
      previous: host.__sfCyclePrevious
    });
    const next = items.find(one => one.value === nextValue) ?? items[0];
    const title = base || words('theme');
    const now = item.value === 'system' ? words('theme-system-now', {
      vars: {
        theme: label(visibleTheme())
      }
    }) : item.label;
    const name = `${title}: ${now}`;
    return {
      theme: true,
      items,
      item,
      next,
      name,
      tooltip: words('cycle-next', {
        vars: {
          name,
          next: next.label
        }
      })
    };
  }

  const items = cycleItems(host.getProp?.('cycle') ?? host.getAttribute('cycle'));
  if (!items.length) return null;
  const at = Math.max(0, items.findIndex(one => one.value === (host.getAttribute('value') ?? '')));
  const item = items[at];
  const next = items[(at + 1) % items.length];
  const name = base ? `${base}: ${item.label}` : item.label;
  return {
    theme: false,
    items,
    item,
    next,
    name,
    tooltip: words('cycle-next', {
      vars: {
        name,
        next: next.label
      }
    })
  };
}
/** A cycle beside a toggle's settings: the toggle's are ignored, said once. */

function warnCycleToggle(host, names) {
  const given = names.filter(name => host.hasAttribute(name));
  if (!given.length || host.__sfCycleWarned) return;
  host.__sfCycleWarned = true;
  globalThis.console?.warn?.(`[SIMAI Framework] ${host.localName}: cycle and theme-cycle are not toggles; ${given.join(', ')} ignored.`);
}
/**
 * A theme cycle whose press cannot move the theme says why, once per
 * element (R076): a host that owns the theme (the Loader started with
 * `theme: false`), or no Loader at all. The button stays where it is and
 * sends no change.
 */

function warnThemeNotOwned(host) {
  if (host.__sfThemeWarned) return;
  host.__sfThemeWarned = true;
  const reason = loader() ? 'the page\'s theme belongs to its host (the Loader runs with theme: false); a host that hands the theme to the Loader makes it work (a Docara example: theme_switch=true)' : 'SF.Loader is absent';
  globalThis.console?.warn?.(`[SIMAI Framework] ${host.localName} theme-cycle: the press changes nothing: ${reason}.`);
}
/**
 * A person's press of a cycle: the next value, the change event and the
 * announcement. Answers true when it moved.
 */

function pressCycle(host, state) {
  if (!state) return false;
  const previous = state.item.value;
  const value = state.next.value; // Said after the drawing that follows: the flag first, as the drawing may
  // come at once.

  const before = host.__sfCyclePrevious;
  host.__sfCycleAnnounce = true;
  host.__sfCyclePrevious = previous;

  if (state.theme) {
    // The Loader moves the page first, so a listener of change finds the
    // page in the theme it chose; a Loader that cannot (absent, or the
    // theme switched off) leaves the cycle where it is.
    host.__sfCycleExpect = value;

    if (loader()?.setTheme?.(value) !== true) {
      warnThemeNotOwned(host);
      host.__sfCycleAnnounce = false;
      host.__sfCyclePrevious = before;
      host.__sfCycleExpect = undefined;
      return false;
    }
  } else {
    host.setAttribute('value', value);
  }

  host.requestComponentUpdate?.('value');
  const item = state.items.find(one => one.value === value) ?? null;
  host.sfEmit('change', {
    previous,
    value,
    item: item ? { ...item
    } : null
  });
  return true;
}
/**
 * sf-theme-change for a theme cycle: a theme set elsewhere (another switch,
 * SF.Loader.setTheme) starts the order afresh from what is shown.
 */

function themeCycleFollow(host) {
  if (!host.hasAttribute('theme-cycle')) return;
  const values = themeCycleValues(host.getAttribute('theme-cycle'));
  const now = values.includes('system') ? themePreference() : visibleTheme();
  if (host.__sfCycleExpect !== now) host.__sfCyclePrevious = undefined;
  host.__sfCycleExpect = undefined;
  host.requestComponentUpdate?.('theme-cycle');
} // The icons a control can switch to, asked for before it switches (R074).
// Only the icon on screen was tracked, so the first press that showed another
// one asked the subset service for a grown font on the click, and the new
// icon stayed blank while the service built it (up to ~30 s when it was busy).
// Asked for when the control is drawn, the names join the page's first icon
// request (held until the Loader is ready); a control added later costs one
// grown font off the click.

/**
 * The icon entries ({icon, filled}) a cycle, a theme cycle or a toggle can
 * show. `icons` are a toggle's own icon names: with `pressed` present they
 * are drawn filled while on, so both forms are asked for. `filled` is the
 * control's own filled setting (every form filled).
 */

function switchIconEntries(host, {
  icons = [],
  filled = false
} = {}) {
  const entries = [];

  const add = (icon, fill) => {
    const name = String(icon || '').trim();
    if (name) entries.push({
      icon: name,
      filled: Boolean(fill || filled)
    });
  };

  if (host.hasAttribute('theme-cycle')) {
    themeCycleValues(host.getAttribute('theme-cycle')).forEach(value => add(THEME_ICONS[value], false));
  } else if (hasCycle(host)) {
    cycleItems(host.getProp?.('cycle') ?? host.getAttribute('cycle')).forEach(item => add(item.icon, item.pressed));
  } else if (host.hasAttribute('pressed')) {
    icons.forEach(icon => {
      add(icon, false);
      add(icon, true);
    });
  }

  const seen = new Set();
  return entries.filter(entry => {
    const key = `${entry.icon}|${entry.filled}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
/**
 * Asks the Loader for these icon entries once per distinct list (a render
 * that draws the same items asks nothing). Answers the number of new names.
 */

function preloadControlIcons(host, entries) {
  if (!Array.isArray(entries) || !entries.length) return 0;
  const key = JSON.stringify(entries);
  if (host.__sfPreloadedIcons === key) return 0;
  const preload = loader()?.preloadIcons;
  if (typeof preload !== 'function') return 0;
  host.__sfPreloadedIcons = key;
  return preload.call(loader(), entries) || 0;
}
/** switchIconEntries, asked for. */

function preloadSwitchIcons(host, options = {}) {
  return preloadControlIcons(host, switchIconEntries(host, options));
}

/***/ },

/***/ "9abcb852f1cf"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("control-spacing", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("control-spacing", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "d3818183b14c"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("deprecations", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("deprecations", 1).then(resolve, reject), { once: true })));

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

/***/ "902a6f38915d"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-button for the shim (stands/18-aliases-ci/alias.mjs, standard §16 item 20). mode: same-detail (the shim sends the new and the old name), split / detail-adds (a detail adapter, refused by the shim), attribute-and-property, method, property, manifest-only (the DOM name does not change), host-attribute (no shim), retired.","component":"sf-button","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"aria-label","to":null,"kind":"attribute","component":"sf-button","since":"2026-10-27","remove_after":"2026-12-01","mode":"host-attribute","section":"§3.1","note":"stays a host attribute, read by the base (§3.1, §4.8); no shim"},{"from":"type","to":"appearance","kind":"setting","component":"sf-button","since":"2026-10-27","remove_after":"2026-12-01","section":"§16 item 20, contracts/public-api-axes.json","note":"the legacy axis name; the shim maps the attribute and the property"},{"from":"icon-left","to":"icon-start","kind":"setting","component":"sf-button","since":"2026-10-27","remove_after":"2026-12-01","section":"§16 item 20","note":"journal attribute-icon-left-right-to-start-end; icon-start wins when both are given"},{"from":"icon-right","to":"icon-end","kind":"setting","component":"sf-button","since":"2026-10-27","remove_after":"2026-12-01","section":"§16 item 20","note":"journal attribute-icon-left-right-to-start-end; icon-end wins when both are given"},{"from":"tightness","to":"spacing","kind":"setting","component":"sf-button","since":"2026-10-27","remove_after":"2026-12-01","section":"§16 item 20","note":"journal attribute-tightness-to-spacing; its words are spacing\'s value aliases below, spacing wins when both are given"},{"from":"link","to":"ghost","kind":"value","setting":"appearance","component":"sf-button","since":"2026-11-08","remove_after":"2027-01-01","section":"§16 item 20","note":"journal value-button-link-to-ghost (rule C15): ghost is the name, link its former one; the earlier ghost-to-link record stays in the journal"},{"from":"error","to":"danger","kind":"value","setting":"status","component":"sf-button","since":"2026-11-08","remove_after":"2027-01-01","section":"§16 item 20","note":"journal value-control-status-error-to-danger (rule C13): a control\'s destructive status is danger; messages keep error"},{"from":"critical","to":"danger","kind":"value","setting":"status","component":"sf-button","since":"2026-10-27","remove_after":"2026-12-01","section":"§16 item 20","note":"journal value-control-status-error-to-danger (rule C13); critical was an older word for the same"},{"from":"low","to":"compact","kind":"value","setting":"spacing","component":"sf-button","since":"2026-10-27","remove_after":"2026-12-01","section":"§16 item 20","note":"tightness\'s word, journal attribute-tightness-to-spacing"},{"from":"high","to":"comfortable","kind":"value","setting":"spacing","component":"sf-button","since":"2026-10-27","remove_after":"2026-12-01","section":"§16 item 20","note":"tightness\'s word, journal attribute-tightness-to-spacing"},{"from":"highest","to":"spacious","kind":"value","setting":"spacing","component":"sf-button","since":"2026-10-27","remove_after":"2026-12-01","section":"§16 item 20","note":"tightness\'s word, journal attribute-tightness-to-spacing"},{"from":"left","to":"start","kind":"value","setting":"icon-position","component":"sf-button","since":"2026-10-27","remove_after":"2026-12-01","section":"§16 item 20","note":"the physical name the template read as start"},{"from":"right","to":"end","kind":"value","setting":"icon-position","component":"sf-button","since":"2026-10-27","remove_after":"2026-12-01","section":"§16 item 20","note":"the physical name the template read as end"}]}');

/***/ },

/***/ "5bb33fb22db3"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.button","tag":"sf-button","version":"1.13.0","kind":"leaf","settings":{"size":{"type":"enum","values":["1/3","1/2","1","2","3"],"default":"1"},"height":{"type":"enum","values":["low","default","high","highest"],"default":"default"},"appearance":{"type":"enum","values":["default","tonal","outline","ghost","surface"],"default":"default"},"scheme":{"type":"enum","values":["primary","secondary","on-surface","on-surface-variant"],"default":"primary"},"status":{"type":"enum","values":["","danger"],"default":""},"text-position":{"type":"string","default":"center"},"text":{"type":"string","default":""},"segment":{"type":"string","default":""},"icon":{"type":"icon","default":""},"icon-start":{"type":"icon","default":""},"icon-end":{"type":"icon","default":""},"icon-position":{"type":"enum","values":["start","end"],"default":"start"},"spacing":{"type":"enum","values":["compact","normal","comfortable","spacious"],"default":"normal"},"radius":{"type":"enum","values":["","default","square","rounded"],"default":""},"full-width":{"type":"boolean","default":false},"loading":{"type":"boolean","default":false},"disabled":{"type":"boolean","default":false},"native-type":{"type":"enum","values":["button","submit","reset"],"default":"button"},"form":{"type":"string","default":""},"name":{"type":"string","default":""},"value":{"type":"string","default":""},"href":{"type":"string","default":""},"target":{"type":"string","default":""},"rel":{"type":"string","default":""},"shortcut":{"type":"string","default":""},"shortcut-listen":{"type":"boolean","default":false},"expanded":{"type":"boolean","optional":true},"pressed":{"type":"boolean","optional":true},"text-pressed":{"type":"string","default":""},"cycle":{"type":"list","default":[],"of":{"value":"string","label":"string","icon":{"type":"icon","optional":true},"lang":{"type":"string","optional":true},"pressed":{"type":"boolean","optional":true}}},"theme-cycle":{"type":"string","optional":true}},"values":{},"events":{"press":{"carries":{}},"change":{"carries":{"previous":"string","value":"string","item":{"type":"object","nullable":true}}}},"actions":{},"css-variables":{"--sf-button-background-color":{"type":"color","state":"default"},"--sf-button-color":{"type":"color","state":"default"},"--sf-button-border-color":{"type":"color","state":"default"},"--sf-button-border-width":{"type":"length","state":"default"},"--sf-button-radius":{"type":"length","state":"default"},"--sf-button-padding-inline":{"type":"length","state":"default"},"--sf-button-padding-block":{"type":"length","state":"default"},"--sf-button-pressed-background-color":{"type":"color","state":"pressed"},"--sf-button-pressed-color":{"type":"color","state":"pressed"}}}');

/***/ },

/***/ "d7b6a56d1dd6"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Buttons","runtime":{"theme":"Theme","theme-system":"system","theme-light":"light","theme-dark":"dark","theme-system-now":"system (now {theme})","cycle-next":"{name}. Press for {next}"}}');

/***/ },

/***/ "96bdb2ff5f5d"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Кнопки","runtime":{"theme":"Тема","theme-system":"как в системе","theme-light":"светлая","theme-dark":"тёмная","theme-system-now":"как в системе (сейчас {theme})","cycle-next":"{name}. Нажмите — {next}"}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("1fab5b780b3d");
/******/
/******/ })()
;