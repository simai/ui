/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "2abe37330ca5"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   nameTarget: () => (/* binding */ nameTarget),
/* harmony export */   unlinkNameTip: () => (/* binding */ unlinkNameTip)
/* harmony export */ });
// The name tooltip of the class icon button (owner decision C248,
// 2026-11-16; C160 (1), C224, C48): a .sf-icon-button the page wrote with an
// aria-label and no visible label shows that name as the Framework's tooltip
// by itself, as <sf-button-icon> does -- the same 0.5 s, the neighbours at
// once, keyboard focus at once, a long press on a touch screen, the flip at
// the edge (component.tooltip). It showed nothing: a page wrote fourteen
// lines of sf-tooltip-anchor + data-tooltip, or the browser's title.
//
// Nothing is drawn or fetched before the first hover, keyboard focus or long
// press on such a button, so the first paint is unchanged: then the tooltip
// surface (the tooltip composition, a .sf-tooltip the button names by
// data-tooltip) is made beside the button, the tooltip controller is asked
// for (the Loader's lazy plugin), and the event that woke it is handed over
// once the controller has linked the button.
//
// Left alone: data-tooltip="off" (the page's opt-out) and any data-tooltip of
// the page's own (its own link is stronger); a button with a title, its own
// or a host's around it (the page chose the browser's tooltip, or a component
// wrote its hint there -- the plain theme button, C244; drop the title for
// the Framework's): never a second tooltip; a button
// with visible words; a close button (sf-button-close, C14: it carries no
// name tooltip, as the Smart one does not); a button inside <sf-button-icon>,
// which shows its own; a disabled or hidden one.
const NAME_TIP = 'sf-icon-button-tooltip'; // What draws a glyph, not words: the icon (a ligature is text), the cross,
// an SVG, the loading spinner.

const GLYPHS = '.sf-icon, sf-icon, i, svg, .sf-close, sf-button-close, .sf-icon-button-spinner, [class*="sf-loader"]';
const SKIP_HOSTS = 'sf-button-icon, sf-icon-button, .sf-tooltip-anchor, [aria-hidden="true"], [inert]'; // A title on the button or on a host around it (the theme button writes its
// next-theme hint there, C244) is a tooltip of the page's own: the browser
// would draw it beside ours, so the button is left alone.

function hasTitle(button) {
  for (let node = button; node && node.nodeType === 1; node = node.parentElement) {
    if ((node.getAttribute('title') || '').trim()) return true;
  }

  return false;
} // The surfaces' numbers are counted on the page, not in this file, and under
// a name of their own: every bundle that carries this file has its own copy
// of it (sf-button since C370, the icon buttons), and <sf-button-icon>
// numbers its own tooltips «sf-icon-button-tooltip-N» from 1 too; two
// counters from 1 made a second «sf-icon-button-tooltip-1», and the language
// glyph in the docs header showed the shrunk search's «Поиск ⌘K».


const MADE = Symbol.for('sf.icon-button.name-tooltip.made');

function nextTipId(doc) {
  let id = '';

  do {
    globalThis[MADE] = (globalThis[MADE] || 0) + 1;
    id = `sf-name-tooltip-${globalThis[MADE]}`;
  } while (doc.getElementById(id));

  return id;
}

function tooltipController() {
  return globalThis.SF?.ComponentRegistry?.Tooltip || globalThis.SF?.Loader?.ComponentRegistry?.Tooltip || null;
} // The controller is there: run now; else ask the Loader for it (a lazy
// plugin) and run once it registered -- as <sf-button-icon> does.


function whenTooltipReady(run) {
  if (tooltipController()) {
    run();
    return;
  }

  const loader = globalThis.SF?.Loader;
  loader?.ensurePlugin?.('tooltip');
  if (typeof loader?.ready === 'function') loader.ready('Tooltip', () => run());else globalThis.addEventListener?.('Tooltip:ready', () => run(), {
    once: true
  });
} // Whether the button shows words of its own beside (or instead of) its icon.


function hasVisibleLabel(button) {
  const walker = button.ownerDocument.createTreeWalker(button, NodeFilter.SHOW_TEXT);

  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (!node.data.trim()) continue;
    if (node.parentElement?.closest(GLYPHS)) continue;
    return true;
  }

  return false;
}

function nameOf(button) {
  return String(button.getAttribute('data-sf-shrink-tip') || button.getAttribute('aria-label') || '').replace(/\s+/gu, ' ').trim();
} // An sf-button drawn as its glyph by its bar (shrink="icon", data-shrunk;
// owner decision C370): its words are hidden, so it shows its text and keys
// as this tooltip, «Поиск ⌘K» (data-sf-shrink-tip), as an icon button shows
// its name. Whole again, it shows none.


const SHRUNK = 'sf-button[shrink="icon"][data-shrunk="true"] > .sf-button[data-sf-shrink-tip]'; // A control a component draws with no words of its own and marks with
// data-sf-name-tip (a role=button part, not an .sf-icon-button: the phone
// field's country flag, sf-input-country, FS-11) shows its name the same way.

const MARKED = '[data-sf-name-tip]'; // The button a name tooltip is for, or null.

function nameTarget(node) {
  const marked = node instanceof Element ? node.closest(MARKED) : null;

  if (marked) {
    if (!nameOf(marked) || marked.hasAttribute('data-tooltip') || hasTitle(marked)) return null;
    if (marked.matches(':disabled, [aria-disabled="true"]') || marked.closest('[aria-hidden="true"], [inert]')) return null;
    return marked;
  }

  const shrunk = node instanceof Element ? node.closest(SHRUNK) : null;

  if (shrunk) {
    if (shrunk.hasAttribute('data-tooltip') || hasTitle(shrunk) || shrunk.matches(':disabled, [aria-disabled="true"]')) return null;
    return nameOf(shrunk) ? shrunk : null;
  }

  const button = node instanceof Element ? node.closest('.sf-icon-button') : null;
  if (!button || !nameOf(button)) return null;
  if (!(button.localName === 'button' || button.localName === 'a' && button.hasAttribute('href') || button.getAttribute('role') === 'button')) return null;
  if (button.hasAttribute('data-tooltip') || hasTitle(button)) return null;
  if (button.matches('.sf-button-close, .sf-icon-button--close, :disabled, [aria-disabled="true"]')) return null;
  if (button.parentElement?.closest(SKIP_HOSTS) || button.matches(SKIP_HOSTS)) return null;
  if (hasVisibleLabel(button)) return null;
  return button;
} // A tooltip this file made keeps the button's name: an aria-label changed
// later (a toggle's «Показать» / «Скрыть») is said on the next hover.


function syncMadeTip(button) {
  const id = button?.getAttribute?.('data-tooltip');
  if (!id) return;
  const tip = button.ownerDocument.getElementById(id);
  if (!tip?.classList.contains(NAME_TIP)) return;
  const text = tip.querySelector('.sf-tooltip-text');
  const name = nameOf(button);
  if (text && name && text.textContent !== name) text.textContent = name;
}

function wake(event) {
  const origin = event.target;
  if (origin instanceof Element) syncMadeTip(origin.closest(`.sf-icon-button[data-tooltip], .sf-button[data-sf-shrink-tip][data-tooltip], ${MARKED}[data-tooltip]`));
  if (event.type === 'pointerdown' && event.pointerType !== 'touch') return;
  if (event.type === 'pointerover' && event.pointerType === 'touch') return;
  const button = nameTarget(origin);
  if (!button) return;

  if (event.type === 'focusin') {
    let shown = true;

    try {
      shown = button.matches(':focus-visible');
    } catch {
      shown = true;
    }

    if (!shown) return;
  }

  const doc = button.ownerDocument;
  const tip = doc.createElement('span');
  tip.className = `sf-tooltip sf-tooltip--dark ${NAME_TIP}`;
  tip.id = button.id ? `${button.id}--tooltip` : nextTipId(doc);
  tip.hidden = true;
  const content = doc.createElement('span');
  content.className = 'sf-tooltip-content';
  const text = doc.createElement('span');
  text.className = 'sf-tooltip-text';
  text.textContent = nameOf(button);
  content.append(text);
  tip.append(content);
  button.after(tip);
  button.setAttribute('data-tooltip', tip.id);
  const kind = event.type;
  const pointerType = event.pointerType;
  let released = false;
  if (kind === 'pointerdown') button.addEventListener('pointerup', () => {
    released = true;
  }, {
    once: true
  });
  whenTooltipReady(() => setTimeout(() => {
    if (button.getAttribute('data-tooltip') !== tip.id) return; // The controller links the button on its own (its observer); the event
    // is handed over only while it still holds.

    if (kind === 'pointerover' && button.matches(':hover')) {
      button.dispatchEvent(new PointerEvent('pointerenter', {
        pointerType
      }));
    } else if (kind === 'focusin' && doc.activeElement === button) {
      button.dispatchEvent(new FocusEvent('focusin'));
    } else if (kind === 'pointerdown' && !released) {
      button.dispatchEvent(new PointerEvent('pointerdown', {
        pointerType
      }));
    }
  }, 0));
} // One listener set per page, shared by every bundle that carries this file.


const BOUND = Symbol.for('sf.icon-button.name-tooltip');

if (typeof document !== 'undefined' && !globalThis[BOUND]) {
  globalThis[BOUND] = true;

  for (const type of ['pointerover', 'focusin', 'pointerdown']) {
    document.addEventListener(type, wake, {
      capture: true,
      passive: true
    });
  }
} // A name tooltip this file made for a button is taken away (an sf-button
// whole again, shrink="icon"): the button no longer names it, and the
// surface goes.


function unlinkNameTip(button) {
  const id = button?.getAttribute?.('data-tooltip');
  if (!id) return;
  const tip = button.ownerDocument.getElementById(id);
  if (!tip?.classList.contains(NAME_TIP)) return;
  button.removeAttribute('data-tooltip');
  tip.remove();
}



/***/ },

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
}; // An Apple keyboard's own signs where they differ (component.kbd 1.3.3, CM-9
// of ui-control research 2026-11-14-context-menu): forward delete is ⌦, as
// macOS menus print it; Del is a Windows word.

const MAC_KEY_CAPS = {
  delete: '⌦'
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

  const key = (apple ? MAC_KEY_CAPS[parsed.key] : undefined) ?? KEY_CAPS[parsed.key] ?? (parsed.key.length === 1 ? parsed.key.toUpperCase() : parsed.key.charAt(0).toUpperCase() + parsed.key.slice(1));
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
/* harmony import */ var _helpers_control_status__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("60a3f9a6662c");
/* harmony import */ var _helpers_button_set__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("d9c5a43b5214");
/* harmony import */ var _core_js_tag_aliases_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("4a85acfb05c1");
/* harmony import */ var _core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("e92fd2d1a38c");
/* harmony import */ var _component_kbd_js_shortcut__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("151a293c8c90");
/* harmony import */ var _helpers_cycle__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("64feefebb417");
/* harmony import */ var _component_icon_buttons_js_name_tooltip_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__("2abe37330ca5");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__("5bb33fb22db3");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__("902a6f38915d");
/* harmony import */ var _lang_index_mjs__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__("16d3d315e23f");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_2__, lit__WEBPACK_IMPORTED_MODULE_3__, _core_js_control_spacing__WEBPACK_IMPORTED_MODULE_4__, _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_5__, _helpers_button_set__WEBPACK_IMPORTED_MODULE_7__, _core_js_tag_aliases_js__WEBPACK_IMPORTED_MODULE_8__, _core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_9__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_2__, lit__WEBPACK_IMPORTED_MODULE_3__, _core_js_control_spacing__WEBPACK_IMPORTED_MODULE_4__, _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_5__, _helpers_button_set__WEBPACK_IMPORTED_MODULE_7__, _core_js_tag_aliases_js__WEBPACK_IMPORTED_MODULE_8__, _core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_9__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _core_js_control_spacing__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_core_js_control_spacing__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_9__);















 // Only the words on screen ship in the bundle, English only (owner decision
// C282): Russian and every other language come from a language file. The
// title, settings and events stay in the language files for the Studio and the
// docs (localization study LC-2).

const COMPONENT_ATTRIBUTES = new Set(["template", "size", "height", "appearance", "type", "scheme", "status", "text", "icon", "icon-start", "icon-end", "icon-left", "icon-right", "icon-position", "text-position", "spacing", "tightness", "radius", "full-width", "overflow", "max-width", // title is the button's own (1.17.0): the native button's title, or, on a
// cut label, the text of its tooltip (syncTitle).
"title", "root-class", "loading", "segment", "disabled", "native-type", "form", "name", "value", "href", "target", "rel", "expanded", "pressed", "text-pressed", "cycle", "theme-cycle", "menu", "split", "shortcut", "shortcut-listen", "shrink", // The bar's state on the host (C370): the sheet and the name tooltip read
// it there, so it is not moved onto the inner button as data-* are.
"data-shrunk", "aria-label", "class", "style", "id", "slot"]); // height (1.10.0, decision C27): the size's tightness steps. A value outside
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
} // The button set (1.14.0, owner decision C116; helpers/button-set.js):
// scheme="secondary" draws as on-surface, appearance="surface" as the soft grey
// button (tonal + on-surface, C113), and a danger button that asks for tonal or
// surface draws as outline. Each is a former name until 2027-01-01, noted in
// SF.deprecations and said once per page (change journal
// value-button-set-c116). surface with on-surface-variant, retired in 1.11.0
// (value-button-surface-quiet-scheme), is part of the retired surface now and
// draws the same soft grey button. Words of two settings, so the component
// reads them itself rather than through value aliases.


function setLook(host) {
  return (0,_helpers_button_set__WEBPACK_IMPORTED_MODULE_7__.buttonSetLook)({
    appearance: host.getAttribute("appearance") ?? host.getAttribute("type"),
    scheme: host.getAttribute("scheme"),
    status: host.getAttribute("status")
  });
} // menu and split (1.15.0, owner decision C119; ui-control research
// 2026-11-13-buttons-system R206). menu is a list of sf-menu-context entries;
// the attribute takes JSON, the property a list. With menu alone the button is
// a menu button: the whole button opens the menu and draws its own arrow. With
// split as well it is a split button: the label part acts (press) and a square
// arrow part of the same height opens the menu, two tab stops, joined like a
// button group. A split button is the main (default primary) or the regular
// (outline) look only; another look, or a danger one, draws as a menu button
// and says so once per page.


function parseMenu(value) {
  if (Array.isArray(value)) return value;
  if (value === null || value === undefined || value === "") return [];

  if (typeof value === "string") {
    try {
      const list = JSON.parse(value);
      return Array.isArray(list) ? list : [];
    } catch {
      return [];
    }
  }

  return [];
}

function menuEntries(host) {
  const list = host.getProp?.("menu");
  return Array.isArray(list) ? list.filter(entry => entry && typeof entry === "object") : [];
} // Said once per page for each reason (every bundle carries its own copy of
// this module, so the set lives on the shared global, as BS-1's does).


function sayMenuOnce(key, message) {
  const root = globalThis.SF = globalThis.SF || {};

  if (!(root.__sfButtonMenuWarned instanceof Set)) {
    Object.defineProperty(root, "__sfButtonMenuWarned", {
      value: new Set(),
      configurable: true
    });
  }

  if (root.__sfButtonMenuWarned.has(key)) return;

  root.__sfButtonMenuWarned.add(key);

  globalThis.console?.warn?.(`[SIMAI Framework] sf-button: ${message}`);
} // overflow="truncate" (1.17.0, FW-LH-1, owner decision C301 (2)): the label
// stays on one line and is cut with an ellipsis at max-width, or at the width
// its container gives. max-width is a CSS length (22rem, 40vw, min(22rem,
// 40vw), var(--sf-...)); a value that could close the declaration is dropped.


function maxWidthStyle(value) {
  const width = String(value ?? "").trim();
  if (!width || /[;{}<>"\\]/u.test(width)) return "";
  return `--sf-button--max-width: ${width}`;
} // The menu element the template draws, by its current and its former tag.


const MENU_ELEMENT = `:scope > ${(0,_core_js_tag_aliases_js__WEBPACK_IMPORTED_MODULE_8__.tagSelector)("sf-menu-context")}`;
const SPLIT_ANSWERS = Object.freeze({
  menu: "menu",
  split: "split"
}); // What the button is: null (a plain button), "menu" or "split".

function menuMode(host, {
  appearance,
  scheme,
  status,
  text
}) {
  const entries = menuEntries(host);
  const split = host.hasAttribute("split") && host.getAttribute("split") !== "false";

  if (!entries.length) {
    if (split) sayMenuOnce("split-empty", "split without menu entries is a plain button; give menu its entries (C119).");
    return null;
  }

  if ((0,_helpers_cycle__WEBPACK_IMPORTED_MODULE_11__.hasCycle)(host)) {
    sayMenuOnce("menu-cycle", "menu and cycle cannot share a button; the cycle is kept and the menu is left out.");
    return null;
  }

  if (host.getAttribute("href")) {
    sayMenuOnce("menu-href", "menu on a link (href) is left out; a link opens a page, not a menu.");
    return null;
  }

  const label = String(text || "").trim().toLowerCase();

  if (split && label && entries.some(entry => String(entry.text ?? "").trim().toLowerCase() === label)) {
    sayMenuOnce("split-repeat", `the main action «${text}» is repeated in the menu of a split button; the menu holds the other actions only (C119).`);
  }

  if (!split) return SPLIT_ANSWERS.menu;
  const danger = status === "danger" || status === "error";
  const main = appearance === "default" && scheme === "primary";
  if (!danger && (main || appearance === "outline")) return SPLIT_ANSWERS.split;
  sayMenuOnce(`split-look|${appearance}|${scheme}|${danger ? "danger" : ""}`, `split is the main (default primary) or the regular (outline) look only (C119); appearance="${appearance}" scheme="${scheme}"${danger ? " status=\"danger\"" : ""} draws as a menu button.`);
  return SPLIT_ANSWERS.menu;
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


const ButtonElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_13__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: _lang_index_mjs__WEBPACK_IMPORTED_MODULE_15__.files,
  source: "ru",
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_14__
});

class SfButton extends ButtonElement {
  static get props() {
    return { ...super.props,
      // The attribute takes JSON or value::label::flags|…; the property a list.
      cycle: {
        type: Array,
        default: [],
        parser: _helpers_cycle__WEBPACK_IMPORTED_MODULE_11__.parseCycle
      },
      // The menu's entries (1.15.0, C119): JSON on the attribute, a list as
      // the property, shaped as sf-menu-context's entries.
      menu: {
        type: Array,
        default: [],
        parser: parseMenu
      }
    };
  }

  get menu() {
    return this.getProp("menu");
  }

  set menu(value) {
    Object.defineProperty(this, "menu", {
      configurable: true,
      enumerable: true,
      writable: true,
      value
    });
    this.requestComponentUpdate?.("menu");
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
    if (!(0,_helpers_cycle__WEBPACK_IMPORTED_MODULE_11__.hasCycle)(this)) return null;
    return (0,_helpers_cycle__WEBPACK_IMPORTED_MODULE_11__.cycleState)(this, {
      base: this.getAttribute("aria-label") || "",
      words: (key, options) => this.sfWord(key, options)
    });
  } // aria-label is the host's (§3.1), not a setting, so the manifest makes no
  // observed attribute of it, and the forwarder leaves it out (it is in
  // COMPONENT_ATTRIBUTES): a name changed after the first drawing never reached
  // the inner button. sf-input-image's «Заменить изображение «photo.png»» kept
  // the first file's name after a new drop (1.14.0); sf-button-icon watched it
  // since 2026-11-06. A change now draws the button again with the new name.
  // title: a cut label's tooltip says it in place of the label (1.17.0).


  static get observedAttributes() {
    return [...new Set([...super.observedAttributes, "aria-label", "title", "data-shrunk"])];
  } // shrink="icon" (owner decision C370, 2026-11-19): the bar the button stands
  // in (sf-header-site collapse auto) asks it to give way by its host state
  // data-shrunk; then it draws its glyph only, ghost, with its name, its
  // aria-keyshortcuts and the Framework's tooltip «Поиск ⌘K» (C160). The
  // sheet draws the glyph's square at once (component.buttons), so the bar
  // measures the row it decided in the same task.


  get shrunk() {
    return this.getAttribute("shrink") === "icon" && this.getAttribute("data-shrunk") === "true";
  }

  constructor() {
    super();
    this._attributeObserver = null;
    this._textFromChildren = "";
    this._shortcutListener = null;
  } // appearance and scheme: the set's former words read as their successors
  // (C116): surface as tonal, a danger tonal or surface as outline.


  get appearance() {
    const look = setLook(this);
    return look.formers.some(former => former.attribute === "appearance") ? look.appearance : super.appearance;
  }

  set appearance(value) {
    super.appearance = value;
  } // secondary, and the scheme the retired surface brings, read as on-surface.


  get scheme() {
    const look = setLook(this);
    return look.formers.some(former => former.attribute === "scheme" || former.from === "surface" && former.to === "tonal") ? look.scheme : super.scheme;
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
    if ((0,_helpers_cycle__WEBPACK_IMPORTED_MODULE_11__.hasCycle)(this)) return undefined;
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
    if (cycle) (0,_helpers_cycle__WEBPACK_IMPORTED_MODULE_11__.warnCycleToggle)(this, ["pressed", "text-pressed"]);
    noteSpacing(this); // success, warning, info: no such buttons (C13, BS-1); said once per page.

    (0,_helpers_control_status__WEBPACK_IMPORTED_MODULE_6__.warnUnknownControlStatus)("sf-button", this.getAttribute("status")); // secondary, surface, a danger tonal or surface (C116); said once per page.

    (0,_helpers_button_set__WEBPACK_IMPORTED_MODULE_7__.sayButtonSetFormers)("sf-button", setLook(this).formers);
    const mode = menuMode(this, {
      appearance: this.appearance,
      scheme: this.scheme,
      status: this.status,
      text: this.text
    });
    this._menuMode = mode;
    const announce = Boolean(cycle && this.__sfCycleAnnounce);
    this.__sfCycleAnnounce = false; // A cycle with an icon shows the item's icon in place of the start icon;
    // one without shows the item's label as its text.

    const cycleIcon = cycle?.item.icon || ""; // The icons a press can show, asked for before the press (R074).

    (0,_helpers_cycle__WEBPACK_IMPORTED_MODULE_11__.preloadSwitchIcons)(this, {
      icons: [this.iconStart, this.iconEnd, ...["icon", "icon-left", "icon-right"].map(name => this.getAttribute(name))]
    }); // shrink="icon": the name stays the same whole and as a glyph (the text,
    // unless the page named it), so a screen reader hears no change; as a
    // glyph the look is ghost and the tooltip says the text and the keys.

    const shrinks = this.getAttribute("shrink") === "icon";
    const shrunk = this.shrunk;
    const caps = (0,_component_kbd_js_shortcut__WEBPACK_IMPORTED_MODULE_10__.shortcutCaps)((0,_component_kbd_js_shortcut__WEBPACK_IMPORTED_MODULE_10__.parseShortcut)(this.shortcut));
    const shrinkName = shrinks ? this.getAttribute("aria-label") || String(this.text || "").trim() : ""; // The tooltip says what the glyph stands for as the whole button showed
    // it: its text and its keys («Поиск ⌘K»), the name when it has no text.

    const shrinkWords = String(this.text || "").trim() || shrinkName;
    return this.createTemplateContext({ ...props,
      // Through the getter: the props context knows only the text attribute,
      // and a button whose label is a text child has none.
      text: this.text,
      shrunk,
      shrinkTip: shrunk && shrinkWords ? [shrinkWords, caps.map(cap => cap.text).join((0,_component_kbd_js_shortcut__WEBPACK_IMPORTED_MODULE_10__.isApplePlatform)() ? "" : "+")].filter(Boolean).join(" ") : "",
      // Resolved names the template reads (contracts/template-context.json).
      iconStart: this.iconStart,
      iconEnd: this.iconEnd,
      // A menu button draws its arrow at the end unless the page wrote an end icon.
      menuArrow: mode === "menu" && this.iconEnd === null ? "expand_more" : "",
      appearance: shrunk ? "ghost" : this.appearance,
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
      ariaLabel: cycle ? this.getAttribute("aria-label") || cycleIcon && !this.text ? cycle.name : "" : this.getAttribute("aria-label") || shrinkName || "",
      // A menu button says it has a menu and whether it is open; the menu
      // writes aria-expanded while it is open.
      expanded: mode === "menu" ? Boolean(this.expanded) : this.expanded,
      hasPopup: mode === "menu" ? "menu" : "",
      // The split button (C119): the arrow part's name and the menu's entries.
      menuMode: mode,
      menuEntries: mode ? menuEntries(this) : [],
      splitLabel: mode === "split" ? this.sfWord("split-more", {
        vars: {
          label: this.text || this.getAttribute("aria-label") || ""
        }
      }) : "",
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
      shortcutCaps: (0,_component_kbd_js_shortcut__WEBPACK_IMPORTED_MODULE_10__.shortcutCaps)((0,_component_kbd_js_shortcut__WEBPACK_IMPORTED_MODULE_10__.parseShortcut)(this.shortcut)),
      // Words join with + where the platform spells its modifiers (the kbd
      // sheet shows the join only where keys are plain glyphs).
      shortcutJoin: !(0,_component_kbd_js_shortcut__WEBPACK_IMPORTED_MODULE_10__.isApplePlatform)(),
      ariaKeyShortcuts: (0,_component_kbd_js_shortcut__WEBPACK_IMPORTED_MODULE_10__.ariaKeyShortcuts)((0,_component_kbd_js_shortcut__WEBPACK_IMPORTED_MODULE_10__.parseShortcut)(this.shortcut)),
      ...(0,_core_js_control_spacing__WEBPACK_IMPORTED_MODULE_4__.resolveControlSpacing)({
        spacing: this.getAttribute('spacing')
      }),
      height: buttonHeight(this),
      // overflow="truncate" (1.17.0, FW-LH-1): the width it is cut at, and
      // a cut label's tooltip (the Framework's plain tooltip, as sf-tag's).
      overflow: this.truncates() ? "truncate" : "wrap",
      rootStyle: [this.getRootStyle(), this.truncates() ? maxWidthStyle(this.getAttribute("max-width")) : ""].filter(Boolean).join("; "),
      cutTooltipId: this._sfCut ? (0,_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_9__.partId)((0,_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_9__.instancePath)(this, {
        kind: "sf-button"
      }), "tooltip") : "",
      cutText: this._sfCut ? this.cutText() : "",
      component: this
    });
  } // ─── overflow="truncate" (1.17.0, FW-LH-1, owner decision C301 (2)) ───────


  truncates() {
    return String(this.getAttribute("overflow") || "").trim().toLowerCase() === "truncate";
  } // What the tooltip of a cut label says: the host's title when the page wrote
  // one, else the whole label as drawn (a cycle's or a pressed toggle's label
  // included).


  cutText() {
    const title = String(this.getAttribute("title") || "").trim();
    if (title) return title;
    const label = this.querySelector(":scope > .sf-button > .sf-button-text-container, :scope > .sf-button-split > .sf-button > .sf-button-text-container");
    return String(label?.textContent ?? this.text ?? "").replace(/\s+/gu, " ").trim();
  } // Whether the drawn label is cut: read from the label, since the width the
  // container gives, the font and the row decide it, not the text's length.


  measureCut() {
    const label = this.truncates() ? this.querySelector(":scope > .sf-button > .sf-button-text-container, :scope > .sf-button-split > .sf-button > .sf-button-text-container") : null;
    const cut = Boolean(label && label.scrollWidth - label.clientWidth > 0.5);

    if (cut) {
      // The tooltip controller, fetched once a label is cut (a lazy relation).
      globalThis.SF?.Loader?.ensurePlugin?.("tooltip");
    }

    const text = cut ? this.cutText() : "";
    if (cut === Boolean(this._sfCut) && text === (this._sfCutText || "")) return;
    this._sfCut = cut;
    this._sfCutText = text;
    this.requestComponentUpdate("cut");
  } // The native button's title: the cycle's tooltip (the current and the next
  // value); else the host's title, except on a cut label, whose Framework
  // tooltip says it, so the browser draws none over it (as sf-button-icon's,
  // C160 (1)). An empty title on the button keeps the host's (an ancestor's)
  // from showing.


  syncTitle() {
    const button = this.querySelector(".sf-button");
    if (!button) return;
    const cycle = this.cycleState();
    if (cycle) button.setAttribute("title", cycle.tooltip);else if (!this.hasAttribute("title")) button.removeAttribute("title");else button.setAttribute("title", this._sfCut ? "" : this.getAttribute("title"));
  }

  watchCut() {
    const label = this.truncates() ? this.querySelector(":scope > .sf-button > .sf-button-text-container, :scope > .sf-button-split > .sf-button > .sf-button-text-container") : null;
    if (this._sfCutLabel === label) return;
    this._sfCutObserver?.disconnect();
    this._sfCutObserver = null;
    this._sfCutLabel = label;
    if (!label || typeof ResizeObserver === "undefined") return;
    this._sfCutObserver = new ResizeObserver(() => this.measureCut());

    this._sfCutObserver.observe(label);
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_2__.renderButtonTemplate)(this.templateContext());
  }

  resolveUpdateMode() {
    return "lit";
  } // ─── the menu (1.15.0, C119) ───────────────────────────────────────────────


  get menuElement() {
    return this.querySelector(MENU_ELEMENT);
  } // The control that opens the menu: the arrow part's native button on a
  // split button, the button itself on a menu button.


  menuAnchor() {
    if (this._menuMode === "split") {
      const arrow = this.querySelector(":scope > .sf-button-split > .sf-button-split-arrow");
      return arrow?.querySelector("button") ?? null;
    }

    if (this._menuMode === "menu") return this.querySelector(".sf-button");
    return null;
  }
  /** Opens or closes the menu; focus "first" or "last" picks the row it lands on. */


  toggleMenu({
    focus = "first",
    open = false
  } = {}) {
    const menu = this.menuElement;
    const anchor = this.menuAnchor();
    if (!menu || !anchor || anchor.disabled) return;
    const align = this._menuMode === "split" ? "end" : "start";
    customElements.whenDefined("sf-menu-context").then(() => {
      if (open) {
        if (menu._owned?.anchor === anchor) return;
        menu.openFor(anchor, {
          align,
          focus
        });
      } else {
        menu.toggleFor(anchor, {
          align,
          focus
        });
      }
    });
  } // ArrowDown and ArrowUp on the control that opens the menu open it on the
  // first and the last row; Enter and Space press the native button, whose
  // click toggles it.


  onMenuKey(event) {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    event.preventDefault();
    this.toggleMenu({
      focus: event.key === "ArrowUp" ? "last" : "first",
      open: true
    });
  } // A row was chosen: the menu closes itself and returns focus to the control
  // that opened it; the page hears sf-button-select, not the menu's event.


  onMenuSelect(event) {
    event.stopPropagation();
    const id = event.detail?.id ?? null;
    this.sfEmit("select", {
      id,
      entry: event.detail?.entry ?? null
    });
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
      this._cycleTheme = () => (0,_helpers_cycle__WEBPACK_IMPORTED_MODULE_11__.themeCycleFollow)(this);

      globalThis.addEventListener?.("sf-theme-change", this._cycleTheme);
    }

    super.onConnected?.();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback?.(name, oldValue, newValue);

    if ((name === "shortcut" || name === "shortcut-listen") && oldValue !== newValue && this.isConnected) {
      this.syncShortcutListener();
    } // A cut label's tooltip says the host's title (overflow="truncate").


    if (name === "title" && oldValue !== newValue && this.isConnected) {
      if (this.truncates()) this.measureCut();
      this.syncTitle();
    }

    if ((name === "data-shrunk" || name === "shrink") && oldValue !== newValue && this._isMounted) {
      // Whole again: the name tooltip made for the glyph leaves with it.
      if (!this.shrunk) (0,_component_icon_buttons_js_name_tooltip_js__WEBPACK_IMPORTED_MODULE_12__.unlinkNameTip)(this.querySelector(":scope > .sf-button"));
      this.requestComponentUpdate("shrink");
    }
  } // shortcut-listen: one keydown listener on the document while the button is
  // connected and listens. The combination presses the native button -- a
  // click, so the press event follows as for a person's click -- unless a
  // listener before it took the key, the button is disabled or loading, or
  // the combination has no modifier and focus is in a field.


  syncShortcutListener() {
    const wanted = Boolean(this.shortcutListen) && Boolean((0,_component_kbd_js_shortcut__WEBPACK_IMPORTED_MODULE_10__.parseShortcut)(this.shortcut));

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
    const parsed = (0,_component_kbd_js_shortcut__WEBPACK_IMPORTED_MODULE_10__.parseShortcut)(this.shortcut);
    if (!(0,_component_kbd_js_shortcut__WEBPACK_IMPORTED_MODULE_10__.matchesShortcut)(event, parsed)) return;
    const target = event.composedPath?.()[0] ?? event.target;
    if (!(0,_component_kbd_js_shortcut__WEBPACK_IMPORTED_MODULE_10__.isCommandShortcut)(parsed) && (0,_component_kbd_js_shortcut__WEBPACK_IMPORTED_MODULE_10__.isEditableTarget)(target)) return;
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

    if (button.disabled || button.getAttribute("aria-disabled") === "true") return; // A menu button's press opens its menu (C119); it is not an action.

    if (this._menuMode === "menu") {
      this.toggleMenu();
      return;
    }

    this.sfEmit("press", {}); // A cycle moves to its next value after the press (D11d).

    (0,_helpers_cycle__WEBPACK_IMPORTED_MODULE_11__.pressCycle)(this, this.cycleState());
  }

  afterRender() {
    const button = this.querySelector(".sf-button");
    applyButtonAttributes(this, button); // The cycle's tooltip names the current and the next value.

    this.syncTitle(); // A cut label (overflow="truncate"): its tooltip says the whole label.

    this.watchCut();
    this.measureCut();

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
      overflow: this.truncates() ? "truncate" : "wrap",
      maxWidth: this.getAttribute("max-width") || "",
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
      menu: menuEntries(this),
      split: this.hasAttribute("split") && this.getAttribute("split") !== "false",
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
  } // No weight is written (1.16.0, owner decision C151 point 4): the icon takes
  // its label's, medium beside a label (component.buttons), regular alone.
  // A pressed toggle draws its icons filled (1.6.0, rule C12): the filled
  // attribute, not the sheet's FILL alone, so the Loader's icon subset holds
  // the filled glyph -- a FILL set by a rule drew the outlined one from it.


  createIcon(name, filled = false) {
    if (!name) return "";
    return (0,lit__WEBPACK_IMPORTED_MODULE_3__.html)`<sf-icon icon="${name}" ?filled=${filled} root-class="pointer-events-none" aria-hidden="true"></sf-icon>`;
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

    this._sfCutObserver?.disconnect();
    this._sfCutObserver = null;
    this._sfCutLabel = null;
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
  const rightIconName = context.menuArrow || (context.iconEnd ?? (iconRight || (icon && isIconEnd ? icon : '')));
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
  // plain (1.18.0): a ghost that never takes a plate, the box its
  // content -- sf-button--ghost with sf-button--plain (it was never
  // link, so no former class beside it).
  (appearance || type) === 'plain' ? 'sf-button--ghost sf-button--plain' : `sf-button--${appearance || type}`, (appearance || type) === 'ghost' ? 'sf-button--link' : '', // One colour name, as the styles expect: the status when one is set, the
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
  context.fullWidth ? 'sf-button--full-width' : '', // overflow="truncate" (1.17.0, FW-LH-1, owner decision C301 (2)): one
  // line, cut with an ellipsis at max-width or the container's width.
  context.overflow === 'truncate' ? 'sf-button--truncate' : '', rootClass, loading ? 'loading sf-button-state-loading' : '', // A loading button keeps its scheme colour (owner decision C36); one
  // that is disabled as well wears the disabled look, so it says so.
  loading && disabled ? 'disabled' : '', // A toggle that is on wears the pressed look (component.buttons 1.5.0,
  // rule C12): the class carries it whether or not aria-pressed is said.
  context.pressed || context.cycleView?.pressedLook ? 'sf-button--pressed' : ''].filter(Boolean);
  const content = (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
            ${overlayContent}
            ${startContent}
            ${textContent ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span
                    class="sf-button-text-container text-${textPosition} pointer-events-none${fullText ? ' flex-1' : ''}">
        ${textContent}
      </span>` : ''}
            ${endContent}${renderCutTooltip(context)}${shortcutCaps.length ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-button-shortcut pointer-events-none" aria-hidden="true"><kbd class="sf-kbd--group">${shortcutCaps.map((cap, at) => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${at && context.shortcutJoin ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-kbd-join">+</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}<kbd class=${cap.square ? 'sf-kbd--square' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>${cap.text}</kbd>`)}</kbd></span>` : ''}
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
                data-sf-shrink-tip=${context.shrinkTip || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                data-tooltip=${context.cutTooltipId || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        >${content}</a>
    `;
  }

  const button = (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
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
                aria-haspopup=${context.hasPopup || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                @keydown=${context.menuMode === 'menu' ? event => component.onMenuKey(event) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                aria-pressed=${announcesPressed ? String(Boolean(context.pressed)) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                aria-keyshortcuts=${context.ariaKeyShortcuts || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                data-sf-shrink-tip=${context.shrinkTip || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                data-tooltip=${context.cutTooltipId || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        >${content}</button>${context.cycleView ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-button-announce sr-only" role="status" aria-live="polite" aria-atomic="true">${context.cycleView.announcement}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    `;
  if (!context.menuMode) return button;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${context.menuMode === 'split' ? renderSplit(context, button) : button}${renderMenu(context)}`;
} // The Framework's plain tooltip (component.tooltip, class markup) of a label
// cut with an ellipsis (overflow="truncate", FW-LH-1, C301 (2)), as sf-tag's
// (C58): hidden until the tooltip controller shows it on hover or keyboard
// focus. The label stays whole in the markup, so the accessible name is all of
// it; the tooltip is for the eye and says the whole label (or the host's title).

function renderCutTooltip(context) {
  if (!context.cutTooltipId) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span id=${context.cutTooltipId} class="sf-tooltip sf-tooltip--dark sf-tooltip--size-1/3 sf-button-tooltip" aria-hidden="true" hidden><span class="sf-tooltip-content"><span class="sf-tooltip-text">${context.cutText}</span></span></span>`;
}

const stop = event => event.stopPropagation(); // The split button (1.15.0, owner decision C119): the label part is the button
// above; the arrow part is an sf-button-icon of the same size, height, look and
// radius -- square, so it is as tall as the label part on every size, height
// and density -- with expand_more. The buttons sheet joins them like a button
// group (sf-button-split): inner corners square, a 1 px seam (the page between
// two filled parts, one shared border between two outlined ones). Its press
// opens the menu and stays inside: the page hears sf-button-press from the
// label part and sf-button-select from the menu.


function renderSplit(context, button) {
  const {
    component
  } = context;
  const off = Boolean(context.disabled || context.loading);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class=${['sf-button-split', context.fullWidth ? 'sf-button-split--full-width' : ''].filter(Boolean).join(' ')}>${button}<sf-button-icon
            class="sf-button-split-arrow"
            icon="expand_more"
            appearance=${context.appearance}
            scheme=${context.scheme}
            size=${context.size}
            height=${context.height && context.height !== 'default' ? context.height : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            radius=${context.radius || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ?disabled=${off}
            aria-label=${context.splitLabel}
            title=${context.splitLabel}
            aria-haspopup="menu"
            aria-expanded="false"
            @click=${() => component.toggleMenu()}
            @keydown=${event => component.onMenuKey(event)}
            @sf-button-icon-press=${stop}
        ></sf-button-icon></span>`;
} // The menu is the Framework's sf-menu-context, a popup opened under the
// control (end-aligned under a split button's arrow). Its own events stay
// inside: the page hears sf-button-select.


function renderMenu(context) {
  const {
    component
  } = context;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-menu-context
            popup
            size=${context.size === '1/3' || context.size === '1/2' ? '1/2' : '1'}
            aria-label=${context.text || context.ariaLabel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            .entries=${context.menuEntries}
            @sf-menu-context-select=${event => component.onMenuSelect(event)}
            @sf-context-menu-select=${stop}
        ></sf-menu-context>`;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "d9c5a43b5214"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BUTTON_SET_REMOVE_AFTER: () => (/* binding */ BUTTON_SET_REMOVE_AFTER),
/* harmony export */   BUTTON_SET_SINCE: () => (/* binding */ BUTTON_SET_SINCE),
/* harmony export */   buttonSetLook: () => (/* binding */ buttonSetLook),
/* harmony export */   dangerLook: () => (/* binding */ dangerLook),
/* harmony export */   isDangerStatus: () => (/* binding */ isDangerStatus),
/* harmony export */   sayButtonSetFormers: () => (/* binding */ sayButtonSetFormers)
/* harmony export */ });
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d3818183b14c");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_0__);
// The button set (owner decision C116, 2026-11-13; ui-control research
// 2026-11-13-buttons-system, prototype buttons-system.html). Three words of a
// button become former names until 2027-01-01 and draw as their successors:
//
// - scheme="secondary" on sf-button draws as on-surface (#q-secondary). The
//   secondary colour stays in core for badges, tabs and segments; the icon
//   button already reads it as on-surface-variant (C15, 2026-11-08).
// - appearance="surface" on sf-button draws as the soft grey button, tonal
//   with the on-surface scheme (#q-surface, C113).
// - a danger button keeps three looks -- filled (the last confirmation),
//   outline (opens a confirmation) and the fill-less icon in a row
//   (#q-danger-looks); tonal or surface with status danger draws as outline,
//   on sf-button and sf-button-icon alike.
//
// Each word is noted in SF.deprecations and said once per page in the console
// for each component and word, whether or not the page opted in to the notes,
// as sf-button's spacing and the BS-1 status warning are. Every bundle carries
// its own copy of this module, so the words already said live on one shared
// global.

const BUTTON_SET_SINCE = '2026-11-13';
const BUTTON_SET_REMOVE_AFTER = '2027-01-01';
const DANGER = new Set(['danger', 'error', 'critical']);

function saidWords() {
  const root = globalThis.SF = globalThis.SF || {};

  if (!(root.__sfButtonSetWarned instanceof Set)) {
    Object.defineProperty(root, '__sfButtonSetWarned', {
      value: new Set(),
      configurable: true
    });
  }

  return root.__sfButtonSetWarned;
} // Whether a status word paints the control as danger (C13: error and critical
// are danger's former names on a control).


function isDangerStatus(status) {
  return DANGER.has(String(status ?? ''));
} // A danger control's look: tonal and surface draw as outline. Answers the look
// drawn and the former word, or '' when the look is one of danger's own.

function dangerLook(appearance, status) {
  if (!isDangerStatus(status)) return {
    appearance,
    former: ''
  };
  if (appearance === 'tonal' || appearance === 'surface') return {
    appearance: 'outline',
    former: appearance
  };
  return {
    appearance,
    former: ''
  };
} // sf-button's look under C116. `appearance` and `scheme` are the words the page
// wrote (after the dated aliases: link is already ghost); answers the look and
// the colour the template draws and the former words met, each
// {attribute, from, to, drawn, danger?}.

function buttonSetLook({
  appearance,
  scheme,
  status
} = {}) {
  const formers = [];
  let look = appearance;
  let colour = scheme;
  const danger = dangerLook(look, status);

  if (danger.former) {
    formers.push({
      attribute: 'appearance',
      from: danger.former,
      to: 'outline',
      danger: true,
      drawn: 'appearance="outline" status="danger" (a danger button is filled, outline or a fill-less icon)'
    });
    look = danger.appearance;
  } else if (look === 'surface') {
    formers.push({
      attribute: 'appearance',
      from: 'surface',
      to: 'tonal',
      drawn: 'appearance="tonal" scheme="on-surface"'
    });
    look = 'tonal';
    colour = 'on-surface';
  }

  if (scheme === 'secondary') {
    formers.push({
      attribute: 'scheme',
      from: 'secondary',
      to: 'on-surface',
      drawn: 'scheme="on-surface"'
    });
    colour = 'on-surface';
  }

  return {
    appearance: look,
    scheme: colour,
    formers
  };
}

function sentence(component, former) {
  return `[SIMAI Framework] ${component}: ${former.attribute}="${former.from}"${former.danger ? ' with status="danger"' : ''} is a former name until ${BUTTON_SET_REMOVE_AFTER} and draws as ${former.drawn}; write that instead (rule C116). See contracts/changes/journal.json (value-button-set-c116).`;
} // Notes each former word in SF.deprecations and says it once per page.


function sayButtonSetFormers(component, formers = []) {
  for (const former of formers) {
    (0,_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_0__.noteDeprecated)({
      component,
      tag: component,
      kind: 'value',
      attribute: former.attribute,
      from: former.danger ? `${former.from} (status danger)` : former.from,
      to: former.to,
      since: BUTTON_SET_SINCE,
      remove_after: BUTTON_SET_REMOVE_AFTER
    });
    const said = saidWords();
    const key = `${component}|${former.attribute}|${former.from}|${former.to}`;
    if (said.has(key)) continue;
    said.add(key);
    globalThis.console?.warn?.(sentence(component, former));
  }
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "60a3f9a6662c"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   warnUnknownControlStatus: () => (/* binding */ warnUnknownControlStatus)
/* harmony export */ });
// A control's status is danger alone (rule C13): a button, an icon button or
// a menu item that deletes, discards or cannot be undone. error is its former
// name (until 2027-01-01) and critical an older one. There are no success,
// warning or info controls -- a result's colour belongs to a notice or a
// badge (ui-control research 2026-11-13-button-schemes, R202, defect BS-1).
// Such a word used to be dropped without a sound and the scheme colour drawn;
// it still draws so, and the console now says it once per page for each
// component and word.
//
// Every bundle carries its own copy of this module, so the words already said
// live on one shared global, as SF.deprecations keeps its notes.
const CONTROL_STATUSES = Object.freeze(['', 'danger', 'error', 'critical']);

function saidWords() {
  const root = globalThis.SF = globalThis.SF || {};

  if (!(root.__sfUnknownStatusWarned instanceof Set)) {
    Object.defineProperty(root, '__sfUnknownStatusWarned', {
      value: new Set(),
      configurable: true
    });
  }

  return root.__sfUnknownStatusWarned;
} // Answers whether `value` is a status the control does not know, and says so
// once per page. `allowed` narrows the words a component reads; `label` is how
// the message names the setting (status="…" on a host, an item's status).


function warnUnknownControlStatus(component, value, {
  allowed = CONTROL_STATUSES,
  label = 'status'
} = {}) {
  if (value === null || value === undefined) return false;
  const word = String(value);
  if (allowed.includes(word)) return false;
  const said = saidWords();
  const key = `${component}|${label}|${word}`;
  if (said.has(key)) return true;
  said.add(key);
  globalThis.console?.warn?.(`[SIMAI Framework] ${component}: ${label}="${word}" is not a status of a control; a control's status is danger (rule C13), and there are no success, warning or info controls. Drawn without a status.`);
  return true;
}

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

/***/ "5dcef5de40cf"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("alias-table", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("alias-table", 1).then(resolve, reject), { once: true })));

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

/***/ "e92fd2d1a38c"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("instance-path", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("instance-path", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "2a080a730149"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("lit", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "deb1a4d61565"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("smart-base", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("smart-base", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "16d3d315e23f"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   files: () => (/* binding */ files)
/* harmony export */ });
/* harmony import */ var _en_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d7b6a56d1dd6");
// Written by scripts/build-language-packs.mjs from src/core/lang/built-in.json
// (owner decision C282); do not edit. The words this bundle carries: the
// built-in languages' (en); every other language comes from
// a language file (core/lang/<code>.js or its parts).


const files = { en: { runtime: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime } };

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ en: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime });


/***/ },

/***/ "902a6f38915d"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-button for the shim (stands/18-aliases-ci/alias.mjs, standard §16 item 20). mode: same-detail (the shim sends the new and the old name), split / detail-adds (a detail adapter, refused by the shim), attribute-and-property, method, property, manifest-only (the DOM name does not change), host-attribute (no shim), retired.","component":"sf-button","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"aria-label","to":null,"kind":"attribute","component":"sf-button","since":"2026-10-27","remove_after":"2026-12-01","mode":"host-attribute","section":"§3.1","note":"stays a host attribute, read by the base (§3.1, §4.8); no shim"},{"from":"type","to":"appearance","kind":"setting","component":"sf-button","since":"2026-10-27","remove_after":"2026-12-01","section":"§16 item 20, contracts/public-api-axes.json","note":"the legacy axis name; the shim maps the attribute and the property"},{"from":"icon-left","to":"icon-start","kind":"setting","component":"sf-button","since":"2026-10-27","remove_after":"2026-12-01","section":"§16 item 20","note":"journal attribute-icon-left-right-to-start-end; icon-start wins when both are given"},{"from":"icon-right","to":"icon-end","kind":"setting","component":"sf-button","since":"2026-10-27","remove_after":"2026-12-01","section":"§16 item 20","note":"journal attribute-icon-left-right-to-start-end; icon-end wins when both are given"},{"from":"tightness","to":"spacing","kind":"setting","component":"sf-button","since":"2026-10-27","remove_after":"2026-12-01","section":"§16 item 20","note":"journal attribute-tightness-to-spacing; its words are spacing\'s value aliases below, spacing wins when both are given"},{"from":"link","to":"ghost","kind":"value","setting":"appearance","component":"sf-button","since":"2026-11-08","remove_after":"2027-01-01","section":"§16 item 20","note":"journal value-button-link-to-ghost (rule C15): ghost is the name, link its former one; the earlier ghost-to-link record stays in the journal"},{"from":"error","to":"danger","kind":"value","setting":"status","component":"sf-button","since":"2026-11-08","remove_after":"2027-01-01","section":"§16 item 20","note":"journal value-control-status-error-to-danger (rule C13): a control\'s destructive status is danger; messages keep error"},{"from":"critical","to":"danger","kind":"value","setting":"status","component":"sf-button","since":"2026-10-27","remove_after":"2026-12-01","section":"§16 item 20","note":"journal value-control-status-error-to-danger (rule C13); critical was an older word for the same"},{"from":"low","to":"compact","kind":"value","setting":"spacing","component":"sf-button","since":"2026-10-27","remove_after":"2026-12-01","section":"§16 item 20","note":"tightness\'s word, journal attribute-tightness-to-spacing"},{"from":"high","to":"comfortable","kind":"value","setting":"spacing","component":"sf-button","since":"2026-10-27","remove_after":"2026-12-01","section":"§16 item 20","note":"tightness\'s word, journal attribute-tightness-to-spacing"},{"from":"highest","to":"spacious","kind":"value","setting":"spacing","component":"sf-button","since":"2026-10-27","remove_after":"2026-12-01","section":"§16 item 20","note":"tightness\'s word, journal attribute-tightness-to-spacing"},{"from":"left","to":"start","kind":"value","setting":"icon-position","component":"sf-button","since":"2026-10-27","remove_after":"2026-12-01","section":"§16 item 20","note":"the physical name the template read as start"},{"from":"right","to":"end","kind":"value","setting":"icon-position","component":"sf-button","since":"2026-10-27","remove_after":"2026-12-01","section":"§16 item 20","note":"the physical name the template read as end"}]}');

/***/ },

/***/ "5bb33fb22db3"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.button","tag":"sf-button","version":"1.18.2","kind":"leaf","settings":{"size":{"type":"enum","values":["1/3","1/2","1","2","3"],"default":"1"},"height":{"type":"enum","values":["low","default","high","highest"],"default":"default"},"appearance":{"type":"enum","values":["default","tonal","outline","ghost","plain"],"default":"default"},"scheme":{"type":"enum","values":["primary","on-surface","on-surface-variant"],"default":"primary"},"status":{"type":"enum","values":["","danger"],"default":""},"text-position":{"type":"string","default":"center"},"text":{"type":"string","default":""},"segment":{"type":"string","default":""},"icon":{"type":"icon","default":""},"icon-start":{"type":"icon","default":""},"icon-end":{"type":"icon","default":""},"icon-position":{"type":"enum","values":["start","end"],"default":"start"},"spacing":{"type":"enum","values":["compact","normal","comfortable","spacious"],"default":"normal"},"radius":{"type":"enum","values":["","default","square","rounded"],"default":""},"full-width":{"type":"boolean","default":false},"overflow":{"type":"enum","values":["wrap","truncate"],"default":"wrap"},"max-width":{"type":"string","default":""},"loading":{"type":"boolean","default":false},"disabled":{"type":"boolean","default":false},"native-type":{"type":"enum","values":["button","submit","reset"],"default":"button"},"form":{"type":"string","default":""},"name":{"type":"string","default":""},"value":{"type":"string","default":""},"href":{"type":"string","default":""},"target":{"type":"string","default":""},"rel":{"type":"string","default":""},"shortcut":{"type":"string","default":""},"shortcut-listen":{"type":"boolean","default":false},"shrink":{"type":"enum","values":["none","icon"],"default":"none"},"expanded":{"type":"boolean","optional":true},"pressed":{"type":"boolean","optional":true},"text-pressed":{"type":"string","default":""},"cycle":{"type":"list","default":[],"of":{"value":"string","label":"string","icon":{"type":"icon","optional":true},"lang":{"type":"string","optional":true},"pressed":{"type":"boolean","optional":true}}},"theme-cycle":{"type":"string","optional":true},"menu":{"type":"list","default":[],"of":{"id":"string","text":"string","icon":{"type":"icon","optional":true},"caption":{"type":"string","optional":true},"shortcut":{"type":"string","optional":true},"disabled":{"type":"boolean","optional":true},"status":{"type":"string","optional":true},"kind":{"type":"string","optional":true}}},"split":{"type":"boolean","default":false}},"values":{},"events":{"press":{"carries":{}},"change":{"carries":{"previous":"string","value":"string","item":{"type":"object","nullable":true}}},"select":{"carries":{"id":{"type":"string","nullable":true},"entry":{"type":"object","nullable":true}}}},"actions":{},"host-states":{"data-shrunk":"boolean"},"css-variables":{"--sf-button-background-color":{"type":"color","state":"default"},"--sf-button-color":{"type":"color","state":"default"},"--sf-button-border-color":{"type":"color","state":"default"},"--sf-button-border-width":{"type":"length","state":"default"},"--sf-button-radius":{"type":"length","state":"default"},"--sf-button-padding-inline":{"type":"length","state":"default"},"--sf-button-padding-block":{"type":"length","state":"default"},"--sf-button-max-width":{"type":"length","state":"default"},"--sf-button-pressed-background-color":{"type":"color","state":"pressed"},"--sf-button-pressed-color":{"type":"color","state":"pressed"}}}');

/***/ },

/***/ "d7b6a56d1dd6"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Buttons","runtime":{"theme":"Theme","theme-system":"system","theme-light":"light","theme-dark":"dark","theme-system-now":"system (now {theme})","cycle-next":"{name}. Press for {next}","split-more":"More options: {label}"}}');

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