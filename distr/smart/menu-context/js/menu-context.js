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

/***/ "cb6d39a52a42"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PanelScrollbar: () => (/* binding */ PanelScrollbar),
/* harmony export */   scrollbarTakesRoom: () => (/* binding */ scrollbarTakesRoom)
/* harmony export */ });
// The scrollbar of a dropping panel stands in the inline-end inset only while
// it takes room (owner C07, docs review R029, 2026-11-07): the area that
// scrolls the rows gives up its inline-end padding then, and keeps it beside an
// overlay scrollbar or none. The sheets draw the track (the inset, the thumb,
// the inset -- src/component/context-menu/scss/_panel.scss); this marks the
// area with a class while its scrollbar takes room, read from offsetWidth -
// clientWidth past the borders whenever the area is drawn or changes its size
// (a narrowed search, a panel fitted to its room, a window made smaller).
// Used by sf-menu-context, sf-dropdown's list, sf-input-lookup and
// sf-profile-picker.
function scrollbarTakesRoom(area) {
  const style = getComputedStyle(area);
  const borders = (parseFloat(style.borderLeftWidth) || 0) + (parseFloat(style.borderRightWidth) || 0);
  return area.offsetWidth - area.clientWidth - borders > 0;
}
class PanelScrollbar {
  constructor() {
    this.area = null;
    this.name = '';
    this.observer = null;
  } // Watch `area` (or nothing, given null) and mark it with `name`. A new area
  // releases the old one and takes its mark off.


  watch(area, name) {
    if (area !== this.area || name !== this.name) {
      this.observer?.disconnect();
      if (this.area && this.name) this.area.classList.remove(this.name);
      this.area = area ?? null;
      this.name = name;

      if (this.area && typeof ResizeObserver === 'function') {
        // The mark moves the area's padding, so it is written on the next
        // frame: written in the observer's own call it would resize what is
        // observed while the observer delivers (a ResizeObserver loop).
        this.observer ??= new ResizeObserver(() => requestAnimationFrame(() => this.mark()));
        this.observer.observe(this.area);
      }
    }

    this.mark();
  }

  mark() {
    const area = this.area;
    if (!area?.isConnected || !this.name) return;
    const takesRoom = scrollbarTakesRoom(area);
    if (area.classList.contains(this.name) !== takesRoom) area.classList.toggle(this.name, takesRoom);
  }

  disconnect() {
    this.observer?.disconnect();
    this.observer = null;
    if (this.area && this.name) this.area.classList.remove(this.name);
    this.area = null;
    this.name = '';
  }

}

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

/***/ "42f1649d1a1b"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SWIPE_SHARE: () => (/* binding */ SWIPE_SHARE),
/* harmony export */   SWIPE_SPEED: () => (/* binding */ SWIPE_SPEED),
/* harmony export */   handleRowHeight: () => (/* binding */ handleRowHeight),
/* harmony export */   inHandleRow: () => (/* binding */ inHandleRow),
/* harmony export */   scrollsAlong: () => (/* binding */ scrollsAlong),
/* harmony export */   startsOnControl: () => (/* binding */ startsOnControl),
/* harmony export */   swipeToClose: () => (/* binding */ swipeToClose),
/* harmony export */   trackSwipe: () => (/* binding */ trackSwipe)
/* harmony export */ });
// A finger closing a panel by pushing it toward its edge (owner decision C157
// (4) and (5), 2026-11-14): the bottom sheet -- sf-drawer placement="bottom"
// and every phone sheet drawn from core/scss/mix/_mix__sheet.scss -- follows
// a drag down and closes past a quarter of its height or on a quick flick; a
// side panel on a phone does the same toward its own edge. The panel follows
// the finger through a length in a custom property the owner's rule reads
// (translate), and settles back when the drag stops short.
//
//   const stop = trackSwipe(pointerdownEvent, {
//     surface,                      the box that moves
//     direction: 'down' | 'left' | 'right' | 'up',
//     variable: '--sf-sheet--drag', the property set on the surface
//     onEnd: ({dismiss, back}) => ...,
//   });
//
// dismiss: the drag passed the share or the speed toward the edge; back: it
// did so the other way (a sheet at rest may open further). A drag along the
// other axis is let go at once (a list scrolling inside a side panel), and a
// drag shorter than the slop is a press, not a swipe.
const SWIPE_SHARE = 0.25;
const SWIPE_SPEED = 0.5;
const SLOP = 4;
const AXES = {
  down: {
    axis: 'y',
    sign: 1
  },
  up: {
    axis: 'y',
    sign: -1
  },
  right: {
    axis: 'x',
    sign: 1
  },
  left: {
    axis: 'x',
    sign: -1
  }
}; // What a swipe must not start on: a control keeps its own presses, a field
// its text selection, a box that scrolls along the swipe's axis its scroll.

const KEEPS_PRESS = 'button, a[href], input, select, textarea, [contenteditable="true"], [role="slider"], [role="scrollbar"], [draggable="true"], sf-resizer';
function startsOnControl(target) {
  return Boolean(target instanceof Element && target.closest(KEEPS_PRESS));
} // Whether something between the target and the surface scrolls along this
// axis toward the swipe (a wide table in a side panel, a carousel).

function scrollsAlong(target, surface, axis) {
  for (let node = target instanceof Element ? target : null; node && node !== surface; node = node.parentElement) {
    const style = getComputedStyle(node);
    const overflow = axis === 'x' ? style.overflowX : style.overflowY;
    if (!/(auto|scroll)/u.test(overflow)) continue;
    if (axis === 'x' ? node.scrollWidth > node.clientWidth + 1 : node.scrollHeight > node.clientHeight + 1) return true;
  }

  return false;
}
function trackSwipe(event, {
  surface,
  direction = 'down',
  variable = '--sf-sheet--drag',
  onEnd,
  onMove
} = {}) {
  const spec = AXES[direction] || AXES.down;
  if (!surface || !event) return () => {};
  const grip = event.currentTarget instanceof Element ? event.currentTarget : surface;
  const start = {
    x: event.clientX,
    y: event.clientY,
    t: event.timeStamp
  };
  const rect = surface.getBoundingClientRect();
  const size = (spec.axis === 'y' ? rect.height : rect.width) || 1; // The owner names the physical edge: a length along x is left-to-right
  // whatever the page's direction.

  const physical = spec.sign;
  let moved = false;
  let given = false;
  let delta = 0;

  const along = e => spec.axis === 'y' ? e.clientY - start.y : e.clientX - start.x;

  const across = e => spec.axis === 'y' ? e.clientX - start.x : e.clientY - start.y; // The moves are heard on the document, not the grip: a pointer that leaves
  // the grip before it is captured (a quick drag off a handle row) still
  // reports to it.


  const doc = grip.ownerDocument || document;

  const clear = () => {
    doc.removeEventListener('pointermove', move, true);
    doc.removeEventListener('pointerup', end, true);
    doc.removeEventListener('pointercancel', end, true);
    surface.classList.remove('is-dragging');
    surface.style.removeProperty(variable);
  };

  const move = e => {
    if (given || e.pointerId !== event.pointerId) return;
    const a = along(e);

    if (!moved) {
      if (Math.abs(a) < SLOP && Math.abs(across(e)) < SLOP) return; // Across the axis first: a scroll or a selection, not this swipe.

      if (Math.abs(across(e)) > Math.abs(a)) {
        given = true;
        clear();
        return;
      }

      moved = true;
      surface.classList.add('is-dragging'); // Captured only once it is a swipe: captured at the press, the click
      // of a tap went to the grip instead of what was tapped.

      try {
        grip.setPointerCapture?.(event.pointerId);
      } catch {
        /* a synthetic event has no pointer */
      }
    }

    delta = a; // The panel follows toward its edge only; the other way it holds.

    const toward = Math.max(0, delta * physical);
    surface.style.setProperty(variable, `${toward * physical}px`);
    onMove?.(toward);
  };

  function end(e) {
    if (e.pointerId !== event.pointerId) return;
    clear();
    if (given || !moved || e.type === 'pointercancel') return; // A drag that ends on the grip is not also a press of it.
    // The click, if any, comes in the same task as the release; one that
    // never comes must not eat a later press.

    const swallow = click => click.stopImmediatePropagation();

    grip.addEventListener('click', swallow, {
      capture: true,
      once: true
    });
    setTimeout(() => grip.removeEventListener('click', swallow, {
      capture: true
    }));
    const toward = delta * physical;
    const speed = toward / Math.max(1, e.timeStamp - start.t);
    const dismiss = toward > size * SWIPE_SHARE || speed > SWIPE_SPEED;
    const back = !dismiss && (-toward > size * SWIPE_SHARE || speed < -SWIPE_SPEED);
    onEnd?.({
      dismiss,
      back,
      distance: toward
    });
  }

  doc.addEventListener('pointermove', move, true);
  doc.addEventListener('pointerup', end, true);
  doc.addEventListener('pointercancel', end, true);
  return clear;
} // The handle row of a sheet drawn by the mixin's ::before: a press within it
// -- from the sheet's top, the 1/2 control's height (the row the bar is
// centred in) -- starts the swipe.

function handleRowHeight(surface) {
  const value = getComputedStyle(surface).getPropertyValue('--sf-ui-1/2--control-height').trim();
  const match = /^(-?\d*\.?\d+)(px|rem|em)?$/u.exec(value);
  if (!match) return 32;
  const unit = match[2] || 'px';
  const base = unit === 'px' ? 1 : parseFloat(getComputedStyle(unit === 'rem' ? document.documentElement : surface).fontSize) || 16;
  return Number(match[1]) * base;
}
function inHandleRow(event, surface) {
  const top = surface.getBoundingClientRect().top;
  return event.clientY >= top && event.clientY - top <= handleRowHeight(surface);
} // A sheet that a swipe down from its handle row closes: binds the press on
// the surface and answers the unbinding. `when` says whether the surface is
// a sheet now (a form anchored on a wide screen is not); a press on a
// control keeps the control's own press.
//
//   const unbind = swipeToClose(surface, {when: () => owned.sheet, onDismiss: () => close()});

function swipeToClose(surface, {
  when = () => true,
  onDismiss
} = {}) {
  if (!surface) return () => {};

  const onPress = event => {
    if (event.button !== 0 || !when()) return;
    if (startsOnControl(event.target) || !inHandleRow(event, surface)) return;
    trackSwipe(event, {
      surface,
      direction: 'down',
      onEnd: ({
        dismiss
      }) => {
        if (dismiss) onDismiss?.();
      }
    });
  };

  surface.addEventListener('pointerdown', onPress);
  return () => surface.removeEventListener('pointerdown', onPress);
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

/***/ "c69a3dc158df"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AVATAR_PLACEHOLDER_ICON: () => (/* binding */ AVATAR_PLACEHOLDER_ICON),
/* harmony export */   AVATAR_SIZES: () => (/* binding */ AVATAR_SIZES),
/* harmony export */   avatarClasses: () => (/* binding */ avatarClasses),
/* harmony export */   avatarContent: () => (/* binding */ avatarContent),
/* harmony export */   avatarPicture: () => (/* binding */ avatarPicture),
/* harmony export */   avatarPictureContext: () => (/* binding */ avatarPictureContext),
/* harmony export */   avatarPictureIcons: () => (/* binding */ avatarPictureIcons),
/* harmony export */   avatarStepText: () => (/* binding */ avatarStepText)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var lit_directives_keyed_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("9d9903b87148");
/* harmony import */ var _helpers_text__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("cbce4a5232a6");
/* harmony import */ var _tone_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("a6b3ed0c1589");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, lit_directives_keyed_js__WEBPACK_IMPORTED_MODULE_1__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, lit_directives_keyed_js__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lit_directives_keyed_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lit_directives_keyed_js__WEBPACK_IMPORTED_MODULE_1__);



 // One avatar drawing (avatar study AV-8, 2026-11-14). sf-avatar and every
// component that shows a person beside its own content -- sf-avatar-group,
// sf-tag, sf-list-item, sf-dropdown, sf-input-lookup, sf-menu-context, the
// signs of sf-list -- draw the picture with these functions and the avatars
// sheet's classes: a photo is an <img> filling the circle, initials stand on
// the neutral plate (or the hue the host names, C17), and with neither the
// placeholder is a glyph on the neutral plate -- person by default, the
// host's icon for a bot, a system or a service. Before, five copies drew it
// five ways: the photo as a background image in the tag, the list row and the
// dropdown, an empty transparent circle in a row with no photo, and the
// context menu's own classes on the secondary container.

/** The sizes of the avatar ladder. */

const AVATAR_SIZES = Object.freeze(["1/4", "1/3", "1/2", "1", "2", "3"]);
/** The glyph of a placeholder: a person, unless the host names another. */

const AVATAR_PLACEHOLDER_ICON = "person"; // The letters a step holds (owner decision C152 (3), 2026-11-14): two from
// 1/3 up, one at 1/4 (16 px holds one letter of a readable size, two were
// 10 px each). Only letters are cut: «+5» or a number stays whole.

function avatarStepText(text, size) {
  const value = String(text ?? "");
  if (String(size ?? "") !== "1/4") return value;
  const letters = value.match(/^(\p{L}\p{M}*)\p{L}/u);
  return letters ? letters[1] : value;
}
/**
 * The drawing context of one avatar picture, from what a host knows: the photo,
 * the initials or the name they are taken from, the hue, the placeholder's
 * glyph, the size (or the text line of a form size) and the shape.
 */

function avatarPictureContext(options = {}) {
  const imageUrl = String(options.imageUrl ?? "").trim();
  const name = String(options.name ?? "").trim();
  const explicitText = String(options.text ?? "").trim();
  const namedIcon = String(options.icon ?? "").trim();
  const size = AVATAR_SIZES.includes(String(options.size ?? "")) ? String(options.size) : ""; // The initials: the host's own, else those of the name -- unless the host
  // names a glyph (a bot, a system), which stands in for them. With a photo
  // they stand under it until it comes and when it fails (C152 (2)).

  const text = avatarStepText(namedIcon ? explicitText : explicitText || (0,_helpers_text__WEBPACK_IMPORTED_MODULE_2__.getInitials)(name), size);
  const isImage = Boolean(imageUrl); // isText: the initials are drawn (alone, or under the photo).

  const isText = Boolean(text);
  const icon = namedIcon || AVATAR_PLACEHOLDER_ICON;
  return {
    size,
    line: String(options.line ?? ""),
    shape: options.shape === "square" ? "square" : "circle",
    imageUrl,
    isImage,
    isText,
    text,
    icon,
    status: options.status || "none",
    expressive: Boolean(options.expressive),
    resolvedHue: isText && options.hue ? (0,_tone_mjs__WEBPACK_IMPORTED_MODULE_3__.resolveAvatarHue)(options.hue, name || text, "") : "",
    rootClass: options.rootClass || "",
    rootStyle: options.rootStyle || "",
    disabled: Boolean(options.disabled),
    // A long list's rows load their photos as they scroll in.
    lazy: Boolean(options.lazy),
    component: options.component
  };
}
/**
 * The classes of the avatar picture. The avatars sheet answers every class
 * this file writes. sf-avatar's own templates hand it their utility classes
 * for the box (options.layout, src/smart/avatar/js/templates/shared.js), as
 * they wrote them before; a host's picture writes none -- sf-avatar--picture
 * gives it the same box from the avatars sheet -- so a host asks the Loader
 * for no utility it did not ask for before (a menu, a tag, a list row).
 */

function avatarClasses(context, options = {}) {
  const includeRootClass = options.includeRootClass !== false;
  const layout = options.layout ?? null;
  const classes = ["sf-avatar", layout ? layout.box : "sf-avatar--picture", context.size ? `sf-avatar--size-${context.size}` : "", context.line ? `sf-avatar--line-${context.line}` : "", layout ? layout.inline : ""].filter(Boolean);

  if (context.isText) {
    classes.push("sf-avatar--text");
    if (layout) classes.push(layout.center); // The hue's role set (core .sf-hue-<name>, C17); the class sheet
    // draws the plate and the ink from it.

    if (context.resolvedHue) {
      classes.push(`sf-hue-${context.resolvedHue}`);
    }
  }

  if (!context.isText) {
    classes.push("sf-avatar--placeholder");
    if (layout) classes.push(layout.center);
  } // The decorative level (C91 level 2): the sheet turns the initials'
  // plate of the largest size into a cover of its hue.


  if (context.expressive) {
    classes.push("sf-avatar--expressive");
  }

  if (context.status && context.status !== "none" && layout) {
    classes.push(layout.anchor);
  }

  if (context.shape === "square") {
    classes.push("sf-avatar--square");
  }

  if (context.status === "online") {
    classes.push("sf-avatar--status-icon-online-indicator");
  }

  if (options.disabled) {
    classes.push("disabled");
  }

  if (includeRootClass && context.rootClass) {
    classes.push(context.rootClass);
  }

  if (options.extraClass) {
    classes.push(options.extraClass);
  }

  return classes.join(" ");
} // The photo says when it has come or failed (C152 (2)): the sheet fades it
// in over the initials when loaded and drops it on an error, so the avatar is
// never an empty circle or the browser's broken-image glyph. The state is
// the runtime mark data-sf-loaded ("true" or "error"), which the template
// does not bind, so a redraw keeps it, and which a first-paint snapshot
// leaves out (it depends on the network); a new address is a new element
// (keyed), which starts transparent again.

function onImageLoad(event) {
  event.currentTarget.dataset.sfLoaded = "true";
}

function onImageError(event) {
  event.currentTarget.dataset.sfLoaded = "error";
}
/**
 * What the circle holds: the initials, or the placeholder glyph as an sf-icon
 * element, so its name reaches the icon font request (a bare <i class="sf-icon">
 * drawn after the page's scan stayed blank: buttons review 2026-11-09); with a
 * photo, the photo over them (owner decision C152 (2)).
 */


function avatarContent(context) {
  const under = context.isText ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-avatar-text">${context.text}</span>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-icon icon=${context.icon || AVATAR_PLACEHOLDER_ICON} aria-hidden="true"></sf-icon>`;
  if (!context.isImage) return under;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${under}${(0,lit_directives_keyed_js__WEBPACK_IMPORTED_MODULE_1__.keyed)(context.imageUrl, (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<img class="sf-avatar-image" src=${context.imageUrl} alt="" loading=${context.lazy ? "lazy" : lit__WEBPACK_IMPORTED_MODULE_0__.nothing} decoding=${context.lazy ? "async" : lit__WEBPACK_IMPORTED_MODULE_0__.nothing} @load=${onImageLoad} @error=${onImageError} />`)}`;
}
/** The icon names a picture draws (for a host's icon preload). */

function avatarPictureIcons(options = {}) {
  const context = avatarPictureContext(options);
  return context.isText ? [] : [context.icon];
}
/**
 * One avatar picture beside a host's own content: a span hidden from
 * assistive technology (the host's visible text names the person), drawn with
 * the avatars sheet. extraClass adds the host's own geometry class.
 */

function avatarPicture(options = {}) {
  const context = avatarPictureContext(options);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span
        class=${avatarClasses(context, {
    extraClass: options.extraClass,
    disabled: context.disabled
  })}
        style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        aria-hidden="true"
    >${avatarContent(context)}</span>`;
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

/***/ "cbce4a5232a6"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getInitials: () => (/* binding */ getInitials),
/* harmony export */   normalizeInitialsWords: () => (/* binding */ normalizeInitialsWords)
/* harmony export */ });
const INITIALS_SKIP_WORDS = new Set(["а", "без", "в", "во", "для", "до", "за", "из", "из-за", "из-под", "и", "к", "ко", "между", "на", "над", "о", "об", "от", "по", "под", "при", "про", "с", "со", "у", "через", "the", "a", "an", "and", "for", "from", "in", "of", "on", "to"]); // Words a name carries that are not the person's or the organisation's own
// (owner decision C152 (3), 2026-11-14): legal forms (ООО «Ромашка» → Р),
// titles (Dr. John Smith → JS) and name particles (Мария фон Штейн → МШ) are
// skipped wherever they stand. Compared without case and without the dots
// around them (normalizeInitialsWords strips those).

const INITIALS_SERVICE_WORDS = new Set([// legal forms
"ооо", "оао", "зао", "пао", "ао", "нао", "ип", "нко", "ано", "гуп", "муп", "фгуп", "гбу", "мбу", "чоп", "llc", "inc", "ltd", "gmbh", "ag", "corp", "co", "llp", "plc", "lp", "bv", "oy", "ab", "srl", "sarl", // titles
"dr", "prof", "mr", "mrs", "ms", "mx", "miss", "sir", "jr", "sr", "phd", "д-р", "проф", "акад", "г-н", "г-жа", "доц", // particles
"фон", "ван", "дер", "де", "ди", "да", "дю", "ла", "ле", "ибн", "бен", "оглы", "кызы", "von", "van", "der", "den", "de", "di", "da", "du", "del", "della", "la", "le", "ten", "ter", "bin", "ibn"]);
function normalizeInitialsWords(value = "") {
  return String(value || "").trim().split(/[\s/|]+/).map(word => word.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "")).filter(Boolean);
} // The first character a reader sees: a whole grapheme, so a letter written
// with a combining accent («E» + U+0301) or outside the basic plane keeps all
// of its code points. Array.from alone splits surrogate pairs correctly but
// not combining marks; Intl.Segmenter does both where the platform has it.

function firstGrapheme(word) {
  const Segmenter = globalThis.Intl?.Segmenter;

  if (typeof Segmenter === "function") {
    for (const {
      segment
    } of new Segmenter(undefined, {
      granularity: "grapheme"
    }).segment(word)) {
      return segment;
    }

    return "";
  }

  return Array.from(word)[0] || "";
} // The one rule for initials (reuse audit 2026-11-02, finding 10): sf-avatar,
// the context menu, the admin menu and the chat drew them by five rules that
// disagreed on a hyphen, an empty name and a letter outside the basic plane.
//
//   «Анна Смирнова»        → «АС»   the first letters of the first two words
//   «Отдел по работе»      → «ОР»   a preposition after the first word is skipped
//   «Жан-Поль»             → «ЖП»   one hyphenated word reads as its parts
//   «Анна-Мария Смирнова»  → «АС»   ...but a name of several words by its words
//   «Анна»                 → «А»
//   «ООО «Ромашка»»        → «Р»    legal forms, titles, particles skipped (C152)
//   «Мария фон Штейн»      → «МШ»
//   «Dr. John Smith»       → «JS»
//   «anna@simai.ru»        → «A»    an address: the first letter before «@»
//   «»                     → ''     or `fallback`: '?' where text must stand
//
// `maxLetters` caps the letters (two), `skipWords` replaces the skipped words,
// `locale` capitalises by a locale's rule.


function getInitials(value = "", options = {}) {
  const {
    maxLetters = 2,
    skipWords = INITIALS_SKIP_WORDS,
    fallback = "",
    locale
  } = options;
  let source = String(value ?? "").trim(); // An address reads by the name before «@»: one letter (C152 (3)),
  // anna@simai.ru → A, not the letters of its parts.

  if (/^[^\s@]+@[^\s@]+$/u.test(source)) {
    const local = normalizeInitialsWords(source.slice(0, source.indexOf("@")).replace(/[._+-]+/gu, " "));
    if (!local.length) return String(fallback);
    const letter = firstGrapheme(local[0]);
    return (locale ? letter.toLocaleUpperCase(locale) : letter.toUpperCase()) || String(fallback);
  }

  const allWords = normalizeInitialsWords(source); // Legal forms, titles and particles go first; a name made of them alone
  // keeps them, so it still has initials.

  const ownWords = allWords.filter(word => !INITIALS_SERVICE_WORDS.has(String(word).toLowerCase()));
  const words = ownWords.length ? ownWords : allWords;
  let significantWords = words.filter((word, index) => index === 0 || !skipWords.has(String(word).toLowerCase())); // One word written with a hyphen or a dash is a compound name: its parts
  // are its words. Split before the skip list, «из-за» would be two words.

  if (significantWords.length === 1) {
    const parts = significantWords[0].split(/[-\u2010-\u2015]+/u).filter(Boolean);
    if (parts.length > 1) significantWords = parts;
  }

  if (!significantWords.length) {
    return String(fallback);
  }

  const letters = significantWords.length > 1 ? significantWords.slice(0, Math.max(1, maxLetters)).map(firstGrapheme).join("") : firstGrapheme(significantWords[0]);
  return (locale ? letters.toLocaleUpperCase(locale) : letters.toUpperCase()) || String(fallback);
}

/***/ },

/***/ "0e16c692aca4"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_density_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("1412c5875b4d");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _core_js_position_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("116963e5e31b");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("b8b80063ca9a");
/* harmony import */ var _core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("bf0cea966575");
/* harmony import */ var _core_js_tag_aliases_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("4a85acfb05c1");
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("d3818183b14c");
/* harmony import */ var _component_panel_scrollbar_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("cb6d39a52a42");
/* harmony import */ var _core_js_sheet_swipe_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("42f1649d1a1b");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("4ff97a05802b");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("68b68beb66a3");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__("25e9776cb404");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__("c19f070ad532");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2__, _core_js_position_js__WEBPACK_IMPORTED_MODULE_3__, _js_templates_default__WEBPACK_IMPORTED_MODULE_4__, _core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_5__, _core_js_tag_aliases_js__WEBPACK_IMPORTED_MODULE_6__, _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_7__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2__, _core_js_position_js__WEBPACK_IMPORTED_MODULE_3__, _js_templates_default__WEBPACK_IMPORTED_MODULE_4__, _core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_5__, _core_js_tag_aliases_js__WEBPACK_IMPORTED_MODULE_6__, _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_7__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _core_js_position_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_core_js_position_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_7__);













 // Only the words on screen ship in the bundle; the title, settings and events
// stay in the language files for the Studio and the docs (localization study LC-2).

const en = {
  runtime: _lang_en_json__WEBPACK_IMPORTED_MODULE_12__.runtime
};
const ru = {
  runtime: _lang_ru_json__WEBPACK_IMPORTED_MODULE_13__.runtime
}; // sf-menu-context from its component.json (standard simai.smart-component 1.3.8
// §3, §4, §8, §19): its settings are attributes and properties made by
// core/js/element-manifest.js, its words are lang/<locale>.json, and its events
// go out by their verbs through sfEmit. aria-label and role stay the host's.

const ContextMenuElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_10__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: {
    en,
    ru
  },
  source: "ru",
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_11__,
  // openFor(anchor, options), toggleFor(anchor, options), openAt(x, y, options) and chooseTab(index)
  // take their fields in order; the runtime gives them the object form of
  // §4.4 as well: openFor({anchor, options}), chooseTab({index}).
  positional: ["open-for", "toggle-for", "open-at", "choose-tab"]
}); // Prefer the helper Core published; a bundle loaded without core.js still
// positions with its own copy.

const position = () => globalThis.SF?.Position || (_core_js_position_js__WEBPACK_IMPORTED_MODULE_3___default()); // What a point anchor stands for (sf-menu-context 1.18.0). An anchor is a
// point when it draws a box of no size: a fixed span at the pointer of a
// right-click. A host that draws no box of its own (display: contents, as
// sf-button) or a hidden element is not one. Answers null for any other
// anchor, else {under, focusable, lent}: the page's element under the point
// (never the anchor or the menu), and what takes the focus back when the
// menu closes and nothing held it before (CM-2): the nearest focusable
// element from it up, else the element itself, lent a tabindex.


const FOCUSABLE = "button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]";

function pointOf(anchor, menu) {
  if (!anchor.getClientRects?.().length) return null;
  const rect = anchor.getBoundingClientRect();
  if (rect.width !== 0 || rect.height !== 0) return null;
  const document = anchor.ownerDocument;
  const under = (document.elementsFromPoint?.(rect.left, rect.top) ?? []).find(element => element !== anchor && !menu.contains(element) && element !== document.documentElement && element !== document.body);
  if (!under) return {
    under: null,
    focusable: null,
    lent: false
  };
  const near = under.closest(FOCUSABLE);
  return near && near !== document.body ? {
    under,
    focusable: near,
    lent: false
  } : {
    under,
    focusable: under,
    lent: true
  };
} // Focus to an element that may not take it: lent a tabindex of -1 (focusable
// from script, never a Tab stop) until it loses the focus.


function focusLent(element, options) {
  if (!element.hasAttribute("tabindex")) {
    element.setAttribute("tabindex", "-1");
    element.addEventListener("blur", () => {
      if (element.getAttribute("tabindex") === "-1") element.removeAttribute("tabindex");
    }, {
      once: true
    });
  }

  element.focus(options);
}

const TYPEAHEAD_MS = 500; // The menus' own numbers for the ids of their icon options' tooltips.

let menuTips = 0; // A tooltip that repeats what is in the row's name is not its description.

function dropDescription(row, id) {
  const rest = (row.getAttribute("aria-describedby") || "").split(/\s+/u).filter(one => one && one !== id);
  if (rest.length) row.setAttribute("aria-describedby", rest.join(" "));else row.removeAttribute("aria-describedby");
} // A menu without `popup` is drawn in place, as its contract says: opened
// through openFor() it floats, and once closed it is drawn where it stands
// again -- with the entries it was last given (sf-editor, evidence
// control/evidence/2026-11-12-menu-context-closed). The contract is unchanged;
// the development warning says so once per page, naming the first such menu.


const IN_PLACE_OPEN_SAID = Symbol.for("sf.menu-context.in-place-open-said");

function sayInPlaceOpen(menu) {
  if (globalThis[IN_PLACE_OPEN_SAID] || menu.hasAttribute("popup")) return;
  globalThis[IN_PLACE_OPEN_SAID] = true;
  const name = menu.id ? `#${menu.id}` : menu.className ? `${menu.localName}.${String(menu.className).trim().split(/\s+/u)[0]}` : menu.localName;
  console.warn(`SIMAI Framework: ${name} was opened through openFor() without the popup attribute. A menu without popup is drawn in place, so it stays drawn after it closes; add popup to a menu that only opens from a control or a right click.`);
} // How wide a popup is by what it holds (owner decision C32, 2026-11-09): the
// class sheet sizes each from core's --sf-popup-*-width steps, which follow
// the density. "content" (the default) is the menu's rule.


const WIDTH_KINDS = new Set(["list", "panel", "form", "form-wide"]);
const FORM_KINDS = new Set(["form", "form-wide"]); // On a phone -- below the md breakpoint, where core declares
// --sf-breakpoint-md -- a form is a sheet at the bottom of the screen. A
// tablet (md up to lg) has room for the form's step beside its control, so it
// keeps the anchored form; a sheet there was a full-width strip for a field
// (C32 acceptance, 2026-11-09).

const onPhone = () => !getComputedStyle(document.documentElement).getPropertyValue("--sf-breakpoint-md").trim(); // What a form, a panel or a slot's own markup holds instead of rows: the
// first of these takes the focus when the menu has no row and no search.


const TABBABLE = 'input:not([type="hidden"]), select, textarea, button, a[href], [tabindex]:not([tabindex="-1"]), [contenteditable=""], [contenteditable="true"]'; // A panel's list (R193, DP-4): the rows of one container that each hold a
// checkable mark -- a checkbox or a switch -- are one Tab stop, and the
// arrows walk them, as a menu's rows (APG). One of several is a radio group,
// whose native radios of one name already are one stop with arrows; they are
// not walked here.

const ROW_MARK = 'input[type="checkbox"], [role="checkbox"], [role="switch"]';

const editable = element => Boolean(element?.matches?.('input, select, textarea, [contenteditable=""], [contenteditable="true"]')); // ─── the menu of an object (owner decision C164, 2026-11-14) ───────────────
// `for` names the page's areas -- a list, a table, a tree, a canvas -- whose
// objects open this menu by the right button, the menu key (Shift+F10 too)
// and a long press on a touch screen: one setting, one menu, the same list
// the object's «⋯» opens (C164 (1), (2)). The object is the row the event
// came from: a table body's row, an element with a row, option, tree item or
// list item role, or a list item; an area without rows is one object itself.


const TARGETS = 'tbody > tr, [role="row"]:not(:has(> [role="columnheader"])), [role="option"], [role="treeitem"], [role="listitem"], li'; // Where the browser's own menu stays: a link, a field and text being edited,
// selected text and the right button with Shift (C164 (1)).

const BROWSER_KEEPS = 'a[href], input, select, textarea, [contenteditable=""], [contenteditable="true"]'; // A long press: half a second, the finger still within ten pixels (the
// platforms' own slop); a move further is a scroll.

const LONG_PRESS_MS = 500;
const LONG_PRESS_SLOP = 10;

const ids = value => String(value ?? "").trim().split(/\s+/u).filter(Boolean);

const selected = element => element?.getAttribute?.("aria-selected") === "true"; // ─── drilling (1.5.0) ────────────────────────────────────────────────────────
// A row's path in the tree, the way the template writes it into the markup:
// "2" is a row of the level and "2/1" a row inside that row -- its submenu, or
// the items of a group. The step says it went one list in, so the depth and the
// place are read from the path alone.


const inside = entry => Array.isArray(entry?.submenu) ? entry.submenu : Array.isArray(entry?.items) ? entry.items : null;

function entryAt(entries, path) {
  let list = entries;
  let entry = null;

  for (const [, step, at] of String(path ?? "").matchAll(/([/]?)(\d+)/gu)) {
    if (entry) list = step === "/" ? inside(entry) : null;
    if (!Array.isArray(list)) return null;
    entry = list[Number(at)] ?? null;
    if (!entry) return null;
  }

  return entry;
} // A row with a submenu: the list it opens, whichever way it opens it.


const submenuOf = entry => Array.isArray(entry?.submenu) && entry.submenu.length > 0 ? entry.submenu : null; // A choice row that asked for its options as a level of their own
// (view: "drill"): the row shows the chosen one under its label and opens the
// list in the panel, a check mark on the chosen option. In a flyout menu there
// is no level to open, so the row stays the quiet one.


const optionsOf = entry => entry?.type === "choice" && entry.view === "drill" && Array.isArray(entry.options) && entry.options.length > 0 ? entry.options : null; // What a drilling panel opens one level into.


const drillable = entry => Boolean(submenuOf(entry) || optionsOf(entry)); // ─── value rows (1.5.0) ──────────────────────────────────────────────────────
// A setting's value lives in its entry and nowhere else: a value with two homes
// is a value that can disagree with itself. These three rows carry one.


const VALUE_ROWS = new Set(["switch", "range", "choice"]); // The value a row has: a boolean for a switch, a number for a range, the chosen
// option's id for a choice.

function entryValue(entry) {
  if (entry?.type === "switch") return Boolean(entry.value);
  if (entry?.type === "range") return Number(entry.value ?? entry.min ?? 0);
  if (entry?.type === "choice") return (entry.options ?? []).find(option => option.checked)?.id ?? null;
  return entry?.value ?? null;
} // What to write into a row to give it a value; null when the row cannot hold
// that value (a choice has no such option), so a refused write stays refused.


function valuePatch(entry, value) {
  if (entry?.type === "switch") return {
    value: Boolean(value)
  };

  if (entry?.type === "range") {
    const number = Number(value);
    return Number.isFinite(number) ? {
      value: number
    } : null;
  }

  if (entry?.type === "choice") {
    const options = Array.isArray(entry.options) ? entry.options : [];
    if (!options.some(option => option.id === value)) return null;
    return {
      options: options.map(option => ({ ...option,
        checked: option.id === value
      }))
    };
  }

  return null;
} // Every value row's value by its id, at the depth it sits: the snapshot reset
// puts back.


function valueMap(entries, into = {}) {
  for (const entry of Array.isArray(entries) ? entries : []) {
    if (!entry || typeof entry !== "object") continue;
    if (entry.id && VALUE_ROWS.has(entry.type)) into[entry.id] = entryValue(entry);
    valueMap(entry.submenu, into);
    valueMap(entry.items, into);
  }

  return into;
} // The tree with one row rewritten, found by its path: the lists above it are
// copied, so a change is a new tree and the template sees it.


function patchAt(entries, path, patch) {
  const steps = [...String(path ?? "").matchAll(/([/]?)(\d+)/gu)].map(found => Number(found[2]));
  if (!steps.length || !Array.isArray(entries)) return entries;

  const rewrite = (list, depth) => {
    if (!Array.isArray(list)) return list;
    const at = steps[depth];
    const entry = list[at];
    if (!entry || typeof entry !== "object") return list;
    let next;

    if (depth + 1 === steps.length) {
      next = { ...entry,
        ...patch
      };
    } else {
      const key = Array.isArray(entry.submenu) ? "submenu" : "items";
      const inner = rewrite(entry[key], depth + 1);
      if (inner === entry[key]) return list;
      next = { ...entry,
        [key]: inner
      };
    }

    const copy = list.slice();
    copy[at] = next;
    return copy;
  };

  return rewrite(entries, 0);
} // The tree with every value row a resolver answers for rewritten: what set-all
// and reset write. A tree with nothing to change is given back as it was.


function rewriteValues(entries, resolve) {
  if (!Array.isArray(entries)) return {
    list: entries,
    count: 0
  };
  let count = 0;
  const list = entries.map(entry => {
    if (!entry || typeof entry !== "object") return entry;
    let next = entry;
    const patch = VALUE_ROWS.has(entry.type) ? resolve(entry) : null;

    if (patch) {
      next = { ...entry,
        ...patch
      };
      count += 1;
    }

    for (const key of ["submenu", "items"]) {
      if (!Array.isArray(next[key])) continue;
      const inner = rewriteValues(next[key], resolve);
      if (!inner.count) continue;
      next = { ...next,
        [key]: inner.list
      };
      count += inner.count;
    }

    return next;
  });
  return {
    list: count ? list : entries,
    count
  };
} // The path of the entry carrying an id, at any depth: what `show` goes to.


function pathOf(entries, id, prefix = "") {
  const list = Array.isArray(entries) ? entries : [];

  for (const [index, entry] of list.entries()) {
    if (!entry || typeof entry !== "object") continue;
    const path = `${prefix}${index}`;
    if (entry.id === id) return path;
    const found = pathOf(inside(entry), id, `${path}/`);
    if (found) return found;
  }

  return "";
} // What the menu walks with its arrows and holds one tab stop in: its rows, and
// the controls that are not rows -- a range's slider keeps its own slider role
// and its side arrows, so it is a stop rather than an item.


const STOPS = ".sf-context-menu-item, .sf-context-menu-stop"; // The page's events the areas named by `for` open the menu by (C164).

const AREA_EVENTS = ["contextmenu", "keydown", "pointerdown", "pointermove", "pointerup", "pointercancel", "click"];
const POSITION_ALIASES = {
  start: "inline-start",
  end: "inline-end",
  "top-start": "top-inline-start",
  "top-end": "top-inline-end",
  "bottom-start": "bottom-inline-start",
  "bottom-end": "bottom-inline-end",
  "left-start": "left-top",
  "left-end": "left-bottom",
  "right-start": "right-top",
  "right-end": "right-bottom",
  "inline-start-start": "inline-start-top",
  "inline-start-end": "inline-start-bottom",
  "inline-end-start": "inline-end-top",
  "inline-end-end": "inline-end-bottom"
};

function normalizePosition(value = "") {
  const normalized = String(value || "").trim().toLowerCase();
  return POSITION_ALIASES[normalized] || normalized;
}

class SfContextMenu extends ContextMenuElement {
  constructor() {
    super();
    this._itemAttributes = new Map();
    this._currentItem = null;
    this._itemObserver = new MutationObserver(() => this.syncMenuItems());
    this._rowMarks = new Map();
    this._rowCurrent = new WeakMap();
    this.addEventListener("keydown", this.handleRowKeyDown);
    this.addEventListener("keydown", this.handleMenuKeyDown);
    this.addEventListener("keydown", this.handleOwnedKeyDown);
    this.addEventListener("click", this.handleEntryClick);
    this.addEventListener("pointerover", this.handleEntryHover); // A drilling row's cut value (TT-11): its tooltip, made on the first
    // hover or keyboard focus.

    this.addEventListener("pointerover", event => this.syncValueTooltip(event));
    this.addEventListener("focusin", event => this.syncValueTooltip(event)); // The objects of the areas named by `for` (C164): the page's events,
    // heard on the document while the menu is in the page.

    this._onAreaEvent = event => this.handleAreaEvent(event);

    this._press = null;
    this._owned = null;
    this._typeahead = {
      text: "",
      at: 0
    }; // The way down a drilling panel: the paths of the rows it was opened
    // through, the last of them the level it shows. Empty is the top level.

    this._drill = [];
    this._afterRender = null;

    if (Object.prototype.hasOwnProperty.call(this, "search")) {
      const early = this.search;
      delete this.search;
      this._search = early && typeof early === "object" ? early : null;
    }

    if (Object.prototype.hasOwnProperty.call(this, "entries")) {
      const early = this.entries;
      delete this.entries;
      this._entries = Array.isArray(early) ? early : null;
    } // A press outside, from the layer stack's one listener while this menu is
    // the top layer (§19.3). The stack hears only the top one, the deepest
    // submenu, so the walk goes up the chain: every menu the press is outside
    // of closes, from the outermost, and a press on a parent row closes only
    // the submenus below it -- as when each menu kept a listener of its own.


    this._onOutsidePress = event => {
      const path = event.composedPath();
      let outermost = null;

      for (let menu = this; menu?._owned; menu = menu._owned.parentMenu) {
        if (path.includes(menu) || path.includes(menu._owned.anchor)) break; // A press inside an open submenu is inside the menu.

        if (menu._submenu && path.includes(menu._submenu)) break;
        outermost = menu;
      }

      if (!outermost) return; // A parent that refuses to close (sf-menu-context-close prevented) keeps
      // itself open; the submenu the press was outside of still closes.

      if (!outermost.close({
        restoreFocus: false,
        reason: "outside"
      }) && outermost !== this) {
        this.close({
          restoreFocus: false,
          reason: "outside"
        });
      }
    };

    this.addEventListener("focusin", event => {
      const list = this.rowListOf(event.target);

      if (list) {
        this._rowCurrent.set(list.parent, event.target);

        this.syncRowLists();
      }

      if (this.menuItems().includes(event.target)) {
        this._currentItem = event.target;
        this.syncMenuItems();
      }
    });
    this.addEventListener("sf-after-render", event => {
      if (event.target !== this && event.target.closest((0,_core_js_tag_aliases_js__WEBPACK_IMPORTED_MODULE_6__.tagSelector)("sf-menu-context")) === this) {
        this.syncMenuItems();
      }
    });
  }

  afterRender(callback) {
    if (typeof callback === "function") return super.afterRender(callback);

    this._itemObserver.disconnect();

    this.syncMenuItems(); // What a drilling step asked to do once its level was drawn.

    const run = this._afterRender;
    this._afterRender = null;
    run?.();
    this.watchScrollbar(); // An icon option names itself by the Framework's tooltip (C160 (1)):
    // the controller is a lazy plugin, asked for once a menu draws one.

    if (!this._tipsAsked && this.querySelector(".sf-context-menu-choice-option[data-tooltip]")) {
      this._tipsAsked = true;
      globalThis.SF?.Loader?.ensurePlugin?.("tooltip");
    }

    const content = this.querySelector(".sf-context-menu-content");
    if (content) this._itemObserver.observe(content, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["disabled", "aria-disabled", "hidden", "inert"]
    });
  } // The scrollbar stands in the inline-end inset only while it takes room
  // (owner C07, R029): the area that scrolls the rows -- the rows' area under
  // a search, else the content of a menu that is not a panel -- gives up its
  // inline-end padding then, and keeps it beside an overlay scrollbar or none.
  // Read whenever the area is drawn or changes its size: a narrowed search, a
  // panel fitted to its room, a window made smaller.
  // A panel with tabs scrolls its body, under the head and over the footer
  // (the scroll-area inset rule, owner C106 addendum to C105, 2026-11-12).


  scrollArea() {
    return this.querySelector(".sf-context-menu-content--search > .sf-context-menu-list") ?? this.querySelector(":scope > .sf-context-menu.sf-context-menu--panel > .sf-context-menu-frame > .sf-context-menu-content > .sf-context-menu-body") ?? this.querySelector(":scope > .sf-context-menu:not(.sf-context-menu--panel) > .sf-context-menu-frame > .sf-context-menu-content");
  } // The mark itself is shared with every dropping panel
  // (src/component/panel-scrollbar.js).


  watchScrollbar() {
    const area = this.scrollArea();
    const name = area?.classList.contains("sf-context-menu-list") ? "sf-context-menu-list--scrollbar" : area?.classList.contains("sf-context-menu-body") ? "sf-context-menu-body--scrollbar" : "sf-context-menu-content--scrollbar";
    this._scrollbar ??= new _component_panel_scrollbar_js__WEBPACK_IMPORTED_MODULE_8__.PanelScrollbar();

    this._scrollbar.watch(area, name);
  }

  connectedCallback() {
    super.connectedCallback();

    for (const type of AREA_EVENTS) document.addEventListener(type, this._onAreaEvent, type === "click");
  }

  disconnectedCallback() {
    for (const type of AREA_EVENTS) document.removeEventListener(type, this._onAreaEvent, type === "click");

    this.cancelPress();
    this._point?.remove();
    this._point = null; // Taken out of the page, it closes without asking: nothing is left to keep.

    if (this._owned) this.close({
      restoreFocus: false,
      ask: false
    });

    this._itemObserver.disconnect();

    this._scrollbar?.disconnect();

    for (const item of this._itemAttributes.keys()) this.releaseItem(item);

    for (const mark of [...this._rowMarks.keys()]) this.releaseRowMark(mark);

    this._currentItem = null;
    super.disconnectedCallback();
  }

  menuItems() {
    if (this.templateName !== "default" || this.menuRole !== "menu") return [];
    const content = this.querySelector(".sf-context-menu-content"); // Rendered from entries, every row is an item and carries its own role
    // (menuitem, menuitemcheckbox or menuitemradio); a value row's own control
    // is a stop of the same walk, under the role the platform gives it.

    if (this.entries.length) return Array.from(content?.querySelectorAll(STOPS) || []);
    return Array.from(content?.children || []).flatMap(child => {
      const item = child.localName === "sf-button" ? child.querySelector("button, a[href]") : child;
      if (!item?.matches("button, a[href]")) return [];
      const role = item.getAttribute("role");
      return !role || role === "menuitem" ? [item] : [];
    });
  } // A row the menu drew from a disabled entry is dimmed but stays in the
  // walk, so its reason -- the caption -- is read (owner decision C164 (4);
  // APG: disabled menu items are focusable but cannot be activated). It is
  // aria-disabled, never disabled, and a press on it does nothing.


  availableMenuItems() {
    return this.menuItems().filter(item => !item.matches(":disabled") && (item.matches(".sf-context-menu-item--disabled") || !item.closest('[aria-disabled="true"]')) && !item.closest('[hidden], [inert], sf-button[disabled]') && item.getClientRects().length > 0 && getComputedStyle(item).visibility !== "hidden");
  }

  ownItemAttribute(item, name, value) {
    let attributes = this._itemAttributes.get(item);

    if (!attributes) this._itemAttributes.set(item, attributes = new Map());
    let lease = attributes.get(name);

    if (!lease) {
      lease = {
        original: item.getAttribute(name),
        value: item.getAttribute(name),
        released: false
      };
      attributes.set(name, lease);
    } // A later application override is not ours to erase on cleanup or rerender.


    if (lease.released || item.getAttribute(name) !== lease.value) {
      lease.released = true;
      return;
    }

    if (lease.value !== value) item.setAttribute(name, value);
    lease.value = value;
  }

  releaseItem(item) {
    for (const [name, lease] of this._itemAttributes.get(item) || []) {
      if (lease.released || item.getAttribute(name) !== lease.value) continue;
      if (lease.original === null) item.removeAttribute(name);else item.setAttribute(name, lease.original);
    }

    this._itemAttributes.delete(item);
  }

  syncMenuItems() {
    const items = this.menuItems(),
          available = this.availableMenuItems();

    for (const item of this._itemAttributes.keys()) if (!items.includes(item)) this.releaseItem(item);

    if (!available.includes(this._currentItem)) this._currentItem = available[0] || null;

    for (const item of items) {
      // A row the menu drew carries its own role; a control that is not a row
      // keeps the platform's. Only a host's own child is given menuitem.
      if (!item.matches(STOPS)) this.ownItemAttribute(item, "role", "menuitem");
      this.ownItemAttribute(item, "tabindex", item === this._currentItem ? "0" : "-1");
    }

    this.syncRowLists();
  } // ─── a panel's lists (R193, DP-4) ───────────────────────────────────────
  // The lists of rows in the menu's content: rows of one container, each
  // with a checkable mark, two or more of them. A row's mark is its first
  // checkbox or switch; a handle or a pin beside it keeps its own stop.


  rowLists() {
    const content = this.querySelector(".sf-context-menu-content");
    if (!content) return [];
    const lists = new Map();

    for (const row of content.querySelectorAll(".sf-context-menu-row")) {
      const mark = row.querySelector(ROW_MARK);
      if (!mark || mark.closest(".sf-context-menu-row") !== row) continue;
      const parent = row.parentElement;
      if (!lists.has(parent)) lists.set(parent, []);
      lists.get(parent).push(mark);
    }

    return Array.from(lists, ([parent, marks]) => ({
      parent,
      marks
    })).filter(list => list.marks.length > 1);
  }

  rowListOf(element) {
    if (!element?.matches?.(ROW_MARK) || !element.closest?.(".sf-context-menu-row")) return null;
    return this.rowLists().find(list => list.marks.includes(element)) ?? null;
  }

  availableRowMarks(list) {
    return list.marks.filter(mark => !mark.matches(":disabled") && mark.getAttribute("aria-disabled") !== "true" && !mark.closest("[hidden], [inert]") && mark.getClientRects().length > 0);
  } // One stop per list: the mark last focused in it, else its first one. A
  // mark that left the lists gets back the tabindex it had.


  syncRowLists() {
    const kept = new Set();

    for (const list of this.rowLists()) {
      const available = this.availableRowMarks(list);

      let current = this._rowCurrent.get(list.parent);

      if (!available.includes(current)) current = available[0] ?? null;

      this._rowCurrent.set(list.parent, current);

      for (const mark of list.marks) {
        kept.add(mark);
        if (!this._rowMarks.has(mark)) this._rowMarks.set(mark, mark.getAttribute("tabindex"));
        const tabindex = mark === current ? "0" : "-1";
        if (mark.getAttribute("tabindex") !== tabindex) mark.setAttribute("tabindex", tabindex);
      }
    }

    for (const mark of [...this._rowMarks.keys()]) if (!kept.has(mark)) this.releaseRowMark(mark);
  }

  releaseRowMark(mark) {
    const original = this._rowMarks.get(mark);

    this._rowMarks.delete(mark);

    if (original === null || original === undefined) mark.removeAttribute("tabindex");else mark.setAttribute("tabindex", original);
  } // Up and down walk a list, Home and End go to its ends; Space is the mark's
  // own and checks it, Tab leaves the list.


  handleRowKeyDown(event) {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    const list = this.rowListOf(event.target);
    if (!list) return;
    const marks = this.availableRowMarks(list),
          index = marks.indexOf(event.target);
    if (index < 0) return;
    let next;

    switch (event.key) {
      case "ArrowDown":
        next = (index + 1) % marks.length;
        break;

      case "ArrowUp":
        next = (index + marks.length - 1) % marks.length;
        break;

      case "Home":
        next = 0;
        break;

      default:
        next = marks.length - 1;
    }

    event.preventDefault();
    event.stopPropagation();

    this._rowCurrent.set(list.parent, marks[next]);

    this.syncRowLists();
    marks[next].focus();
  }

  focus(options) {
    this.syncMenuItems();
    this._currentItem?.focus(options);
  } // ─── entries ─────────────────────────────────────────────────────────────
  // Entries are data, set as a property (`.entries=${…}` in a template) or as
  // JSON in the attribute. Set before the element was defined, the value sat
  // on the instance and is taken over in the constructor.


  get entries() {
    if (Array.isArray(this._entries)) return this._entries;
    if (!this.hasAttribute("entries")) return [];

    try {
      const parsed = JSON.parse(this.getAttribute("entries"));
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  set entries(value) {
    this._entries = Array.isArray(value) ? value : null; // New entries declare new values: the snapshot reset puts back is taken
    // again from them, the next time a value row is asked for one.

    this._declared = null;
    this._rangeFrom = null;
    this.requestComponentUpdate("entries");
  } // The entry a row was drawn from, found by the path in its markup.


  entryOf(element) {
    const row = element?.closest?.(`${STOPS}, .sf-context-menu-value-row`);
    if (!row || !this.contains(row)) return null;
    return entryAt(this.entries, row.dataset.sfEntry) ?? null;
  } // ─── values (1.5.0) ──────────────────────────────────────────────────────
  // The declared values: the ones the entries carried when the host set them,
  // taken once. Re-read after a change they would be the person's values, not
  // the declared ones, and reset would have nothing to put back.


  declaredValues() {
    if (!this._declared) this._declared = valueMap(this.entries);
    return this._declared;
  } // The entries after a change the menu made itself. It goes round the setter,
  // so the declared snapshot is still the host's.


  applyEntries(next) {
    if (!Array.isArray(next)) return;
    this._entries = next;
    this.requestComponentUpdate("entries");
  } // One change of a value row. Three events in order, and the order is the
  // contract: select (cancelable) -- a command row raises it alone, a value row
  // raises both -- then change, the cancelable request, and only when select
  // was not cancelled; the value is written after that, and changed is the
  // fact. A refused request leaves the row as it was, so the view never shows
  // a value its host did not take.


  changeValue(path, value, {
    previous
  } = {}) {
    const before = entryAt(this.entries, path);
    const patch = valuePatch(before, value);
    if (!patch) return false;
    const was = previous === undefined ? entryValue(before) : previous;
    const next = { ...before,
      ...patch
    };
    this.declaredValues();
    const checked = before.type === "switch" ? Boolean(value) : null;
    if (!this.sfEmit("select", {
      id: before.id ?? null,
      entry: next,
      checked
    }, {
      cancelable: true
    })) return false;
    const fact = {
      id: before.id ?? null,
      value,
      previous: was,
      entry: next
    };
    if (!this.sfEmit("change", fact, {
      cancelable: true
    })) return false;
    this.applyEntries(patchAt(this.entries, path, patch));
    this.sfEmit("changed", fact);
    return true;
  } // A boolean setting: the row is the switch, so a press anywhere on it turns
  // the setting. A setting is tried rather than committed, so the menu stays
  // open unless the entry asked otherwise.


  toggleSwitch(row, entry) {
    const changed = this.changeValue(row.dataset.sfEntry, !entry.value, {
      previous: Boolean(entry.value)
    });
    if (changed && entry.keepOpen === false) this.closeAll();
    return changed;
  } // The number under a dragged thumb follows the pointer: the entry holds it,
  // so the row and its number show what the person is doing. The events come
  // when the thumb is let go, or at once from a key, which is one notch.


  previewRange(input) {
    const path = input?.dataset?.sfEntry;
    const entry = entryAt(this.entries, path);
    if (!entry) return;
    const value = Number(input.value);
    if (!Number.isFinite(value) || Number(entry.value) === value) return;
    this.declaredValues();
    if (this._rangeFrom?.path !== path) this._rangeFrom = {
      path,
      value: entryValue(entry)
    };
    this.applyEntries(patchAt(this.entries, path, {
      value
    }));
  } // The thumb let go, or one notch from a key: the request goes out once. A
  // refused request puts the row back where the drag began -- the preview wrote
  // the entry so the number could follow the pointer, and nothing else did.


  commitRange(input) {
    const path = input?.dataset?.sfEntry;
    const entry = entryAt(this.entries, path);
    if (!entry) return false;
    const from = this._rangeFrom?.path === path ? this._rangeFrom.value : entryValue(entry);
    this._rangeFrom = null;
    const value = Number(input.value);
    if (!Number.isFinite(value) || value === from) return false;
    if (this.changeValue(path, value, {
      previous: from
    })) return true;
    this.applyEntries(patchAt(this.entries, path, {
      value: from
    }));
    return false;
  } // Write a setting's value into its own entry: the host's answer to change, or
  // a value restored on load. The menu raises nothing.
  // An action takes one object (`set-value {id, value}`); a page's own call may
  // name the two.


  setValue(target, given) {
    const {
      id,
      value
    } = target && typeof target === "object" ? target : {
      id: target,
      value: given
    };
    this.declaredValues();
    const {
      list,
      count
    } = rewriteValues(this.entries, entry => entry.id === id ? valuePatch(entry, value) : null);
    if (!count) return {
      outcome: "refused",
      reason: "not-found"
    };
    this.applyEntries(list);
    return {
      outcome: "applied"
    };
  } // A whole map at once: a panel restored from storage in one call.


  setAll(given) {
    const values = given && typeof given === "object" && given.values && typeof given.values === "object" ? given.values : given;
    const map = values && typeof values === "object" ? values : {};
    this.declaredValues();
    const {
      list,
      count
    } = rewriteValues(this.entries, entry => entry.id && Object.hasOwn(map, entry.id) ? valuePatch(entry, map[entry.id]) : null);
    if (!count) return {
      outcome: "refused",
      reason: "not-found",
      count
    };
    this.applyEntries(list);
    return {
      outcome: "applied",
      count
    };
  } // The declared values back, and reset asked once. A listener that cancels it
  // keeps the current values; otherwise the menu shows the declared ones, says
  // changed for each row that moved and waits for the host to persist them.


  reset() {
    const declared = this.declaredValues();
    if (!this.sfEmit("reset", {}, {
      cancelable: true
    })) return {
      outcome: "cancelled"
    };
    const facts = [];
    const {
      list,
      count
    } = rewriteValues(this.entries, entry => {
      if (!entry.id || !Object.hasOwn(declared, entry.id)) return null;
      const previous = entryValue(entry);
      const value = declared[entry.id];
      if (previous === value) return null;
      const patch = valuePatch(entry, value);
      if (patch) facts.push({
        id: entry.id,
        value,
        previous,
        entry: { ...entry,
          ...patch
        }
      });
      return patch;
    });
    if (count) this.applyEntries(list);

    for (const fact of facts) this.sfEmit("changed", fact);

    return {
      outcome: "applied"
    };
  } // Straight to one setting: the panel opens the levels down to it -- its own
  // submenu when it has one, otherwise the level its row stands on -- and the
  // focus goes to the row. A flyout menu has no level to go to.


  show(given) {
    const id = given && typeof given === "object" ? given.id : given;
    const path = pathOf(this.entries, id);
    if (!path) return {
      outcome: "refused",
      reason: "not-found"
    };
    if (!this.drill) return {
      outcome: "unavailable",
      reason: "no-levels"
    };
    const entry = entryAt(this.entries, path);
    const stack = [];
    let walked = "";

    for (const [, step, at] of path.matchAll(/([/]?)(\d+)/gu)) {
      walked = walked ? `${walked}${step}${at}` : `${at}`;
      if (walked !== path && drillable(entryAt(this.entries, walked))) stack.push(walked);
    }

    const into = drillable(entry);
    if (into) stack.push(path);
    this._drill = stack;
    this.clearQuery();
    this._afterRender = into ? () => this.focusLevelStart() : () => {
      this.syncMenuItems();
      const row = this.menuItems().find(item => item.dataset.sfEntry === path);
      (row ?? this.availableMenuItems()[0])?.focus({
        preventScroll: true
      });
    };
    this.requestComponentUpdate("drill");
    return {
      outcome: "applied"
    };
  } // ─── drilling ────────────────────────────────────────────────────────────
  // submenu="drill": a submenu replaces the panel's content instead of opening
  // a second panel beside it, so the width never grows with the depth -- the
  // complaint behind the 400px reader panel on ui.simai.io (owner, 2026-10-30).
  // The default stays flyout, so no shipped menu changes.


  get drill() {
    return this.submenu === "drill";
  } // The level the panel shows: its entries, the path they are drawn under, how
  // deep it is and the label of the row it was opened through. A path that no
  // longer leads anywhere (the host set other entries) is dropped, so the
  // panel falls back to the deepest level it can still show.


  drillLevel() {
    if (!this.drill || !this._drill.length) return {
      entries: this.entries,
      prefix: "",
      depth: 0,
      label: "",
      search: null,
      choice: null
    };
    let entries = this.entries;
    let label = "";
    let prefix = "";
    let search = null;
    let choice = null;
    const kept = [];

    for (const path of this._drill) {
      const entry = entryAt(this.entries, path);
      if (!drillable(entry)) break;
      kept.push(path);
      label = entry.text ?? "";
      prefix = `${path}/`; // The option list of a choice row: the level holds no entries of its own,
      // only that row's options, and nothing opens below it.

      if (!submenuOf(entry)) {
        choice = {
          entry,
          path
        };
        entries = [];
        search = null;
        break;
      }

      entries = entry.submenu; // A level opened from a row that asked for a search draws the field,
      // as the flyout it replaces did.

      search = entry.search && typeof entry.search === "object" ? entry.search : null;
    }

    if (kept.length !== this._drill.length) this._drill = kept;
    return {
      entries,
      prefix,
      depth: kept.length,
      label,
      search,
      choice
    };
  } // Into a row's submenu, in place. The focus goes to the level's first row
  // once it is drawn.


  drillInto(path, {
    focus = true
  } = {}) {
    const asked = typeof path === "string" ? path : path?.dataset?.sfEntry;
    if (!this.drill || !drillable(entryAt(this.entries, asked))) return false;
    this._drill = [...this._drill, asked];
    this.clearQuery();
    if (focus) this._afterRender = () => this.focusLevelStart();
    this.requestComponentUpdate("drill");
    return true;
  } // One level back. The focus returns to the row the level was opened from.


  drillBack({
    focus = true
  } = {}) {
    if (!this._drill.length) return false;
    const from = this._drill[this._drill.length - 1];
    this._drill = this._drill.slice(0, -1);
    this.clearQuery();
    if (focus) this._afterRender = () => {
      this.syncMenuItems();
      const row = this.menuItems().find(item => item.dataset.sfEntry === from);
      (row ?? this.availableMenuItems()[0])?.focus({
        preventScroll: true
      });
    };
    this.requestComponentUpdate("drill");
    return true;
  } // A level change clears what was typed, without telling a host-searched
  // list: changing level is not a search.


  clearQuery() {
    if (!this._query) return;
    this._query = "";
    this.requestComponentUpdate("query");
  }

  focusLevelStart() {
    this.syncMenuItems();
    (this.searchField() ?? this.availableMenuItems()[0])?.focus({
      preventScroll: true
    });
  } // A search over the entries: a submenu given `search` (or a menu given the
  // property) draws a field above its rows and narrows them as one types.


  get search() {
    return this._search && typeof this._search === "object" ? this._search : null;
  }

  set search(value) {
    this._search = value && typeof value === "object" ? value : null;
    this.requestComponentUpdate("search");
  }

  get query() {
    return this._query ?? "";
  }

  setQuery(value) {
    this._query = String(value ?? "");
    this.requestComponentUpdate("query"); // A search the host answers: it is told the query and sets the entries.

    if (this.search?.remote) this.sfEmit("search", {
      query: this._query
    });
  }

  searchField() {
    return this.querySelector(".sf-context-menu-search-input");
  } // The controls of the open surface that Tab reaches, in order.


  tabbables() {
    const surface = this.surface() ?? this;
    return Array.from(surface.querySelectorAll(TABBABLE)).filter(element => !element.matches(":disabled") && element.getAttribute("tabindex") !== "-1" && !element.closest('[hidden], [inert]') && element.getClientRects().length > 0 && getComputedStyle(element).visibility !== "hidden");
  } // One option of a choice row: the menu marks it at once, so the row shows
  // the choice while the host applies it, and stays open -- a theme is tried,
  // not committed. The row is found by its path, so a choice row inside a
  // submenu or a group is chosen as one at the top level is.


  chooseOption(row, entry) {
    return this.chooseOptionAt(row.dataset.sfEntry, entry, Number(row.dataset.sfOption));
  }

  chooseOptionAt(path, entry, at) {
    const option = entry.options?.[at];
    if (!option || option.disabled) return false;
    const previous = entryValue(entry);
    const selected = this.sfEmit("select", {
      id: option.id ?? null,
      entry: option,
      checked: true,
      group: entry.id ?? null
    }, {
      cancelable: true
    });
    if (!selected) return false;
    this.declaredValues();
    const patch = {
      options: entry.options.map((item, index) => ({ ...item,
        checked: index === at
      }))
    }; // A choice row is a value row: the cancelable change follows the
    // uncancelled select and the fact follows the write, so a host that wants
    // settings listens to change (or changed) alone.

    const fact = {
      id: entry.id ?? null,
      value: option.id ?? null,
      previous,
      entry: { ...entry,
        ...patch
      }
    };
    if (!this.sfEmit("change", fact, {
      cancelable: true
    })) return false;
    this.applyEntries(patchAt(this.entries, path, patch));
    this.sfEmit("changed", fact);
    if (entry.keepOpen === false) this.closeAll();
    return true;
  } // A tile of a group does what its row would: a switch turns, a choice steps
  // on to the next option, a row with a submenu opens its level.


  pressTile(row, entry) {
    if (entry.type === "switch") return this.toggleSwitch(row, entry);

    if (entry.type === "choice") {
      const options = Array.isArray(entry.options) ? entry.options : [];
      if (!options.length) return false;
      const at = options.findIndex(option => option.checked);
      return this.chooseOptionAt(row.dataset.sfEntry, entry, (at + 1) % options.length);
    }

    return false;
  }

  handleEntryClick(event) {
    const row = event.target?.closest?.(".sf-context-menu-item");
    if (!row || !this.contains(row) || row.matches(":disabled")) return; // A dimmed row is read, not chosen (C164 (4)).

    if (row.getAttribute("aria-disabled") === "true") {
      event.preventDefault();
      return;
    }

    const entry = this.entryOf(row);
    if (!entry) return;

    if (row.dataset.sfOption !== undefined) {
      const chose = this.chooseOption(row, entry); // An option chosen in the level the row opened: the panel goes back to
      // the rows, the focus to the row it came from -- the choice is made.

      if (chose && row.classList.contains("sf-context-menu-level-option")) this.drillBack();
      return;
    }

    if (this.drill ? drillable(entry) : submenuOf(entry)) {
      event.preventDefault();

      if (this.drill) {
        // In place: the same panel, the same width, one level deeper. The
        // row that held the focus is gone from the level, so the focus always
        // moves into it: left behind it falls to the body, where no key of the
        // menu is heard. Moved by a pointer, it draws no ring.
        this.drillInto(row, {
          focus: true
        });
        return;
      } // A pointer leaves the focus where it is, unless the submenu is a search:
      // whoever opened a list to find something is about to type.


      this.openSubmenu(row, entry, {
        focus: event.detail === 0 || entry.search ? "first" : "none"
      });
      return;
    } // A value row: the row is the control, so a press on it changes the
    // setting and the menu stays open.


    if (row.classList.contains("sf-context-menu-tile")) {
      event.preventDefault();
      this.pressTile(row, entry);
      return;
    }

    if (entry.type === "switch") {
      event.preventDefault();
      this.toggleSwitch(row, entry);
      return;
    }

    const checkable = entry.kind === "check" || entry.kind === "radio";
    const detail = {
      id: entry.id ?? null,
      entry,
      checked: checkable ? entry.kind === "radio" ? true : !entry.checked : null
    };
    const selected = this.sfEmit("select", detail, {
      cancelable: true
    }); // A choice ends the menu, unless the host cancelled the event to keep it
    // (a check list ticked several times) or the entry asked to stay.

    if (selected && !entry.keepOpen) this.closeAll({
      restoreFocus: !entry.href
    });
  } // The value under a drilling row's name (TT-11, owner decision C160 (1)):
  // one line, cut with an ellipsis where it is long. A cut value is the row's
  // Framework tooltip on hover, keyboard focus or a long press, not a browser
  // title: the surface stands after the row, named by its data-tooltip, and
  // the tooltip controller (component tooltip, asked for here) shows it. It is
  // measured each time the row is reached, so a value that fits loses it. The
  // value is already in the row's name, so the surface is not its
  // description too (a screen reader would say the value twice).


  syncValueTooltip(event) {
    if (event.type === "pointerover" && event.pointerType === "touch") return;
    const row = event.target?.closest?.(".sf-context-menu-item");
    if (!row || row.closest((0,_core_js_tag_aliases_js__WEBPACK_IMPORTED_MODULE_6__.tagSelector)("sf-menu-context")) !== this) return;
    const under = row.querySelector(".sf-context-menu-item-under");
    if (!under) return;
    const next = row.nextElementSibling;
    let tip = next?.classList?.contains("sf-context-menu-value-tooltip") ? next : null;
    const words = (under.textContent || "").replace(/\s+/gu, " ").trim();
    const cut = under.scrollWidth > under.clientWidth + 1;

    if (!cut || !words) {
      if (tip) {
        if (row.getAttribute("data-tooltip") === tip.id) row.removeAttribute("data-tooltip");
        tip.remove();
      }

      return;
    }

    const fresh = !tip;

    if (!tip) {
      const doc = this.ownerDocument;
      tip = doc.createElement("span");
      tip.className = "sf-tooltip sf-tooltip--dark sf-context-menu-value-tooltip";
      tip.hidden = true;
      const content = doc.createElement("span");
      content.className = "sf-tooltip-content";
      const text = doc.createElement("span");
      text.className = "sf-tooltip-text";
      content.append(text);
      tip.append(content);
      const prefix = this._tipPrefix ??= `sf-menu-tip-${++menuTips}`;
      tip.id = `${prefix}-${String(row.dataset.sfEntry ?? "").replace(/[^\w-]/gu, "-")}-value`;
      row.after(tip);
    }

    const text = tip.querySelector(".sf-tooltip-text");
    if (text && text.textContent !== words) text.textContent = words;
    if (row.getAttribute("data-tooltip") !== tip.id) row.setAttribute("data-tooltip", tip.id);

    if (!fresh) {
      dropDescription(row, tip.id);
      return;
    } // The first time: the controller links the row on its own (its observer)
    // and is handed the event that woke the tooltip while it still holds.


    const kind = event.type;
    const pointerType = event.pointerType;

    const handOver = () => setTimeout(() => {
      if (row.getAttribute("data-tooltip") !== tip.id) return;
      dropDescription(row, tip.id);

      if (kind === "pointerover" && row.matches(":hover")) {
        row.dispatchEvent(new PointerEvent("pointerenter", {
          pointerType
        }));
      } else if (kind === "focusin" && this.ownerDocument.activeElement === row) {
        row.dispatchEvent(new FocusEvent("focusin"));
      }
    }, 0);

    const loader = globalThis.SF?.Loader;

    if (globalThis.SF?.ComponentRegistry?.Tooltip || loader?.ComponentRegistry?.Tooltip) {
      handOver();
      return;
    }

    loader?.ensurePlugin?.("tooltip");
    if (typeof loader?.ready === "function") loader.ready("Tooltip", handOver);else globalThis.addEventListener?.("Tooltip:ready", handOver, {
      once: true
    });
  } // A pointer resting on a row with a submenu opens it; resting on another
  // row of this menu closes the one that was open.


  handleEntryHover(event) {
    if (!this._owned || event.pointerType === "touch") return;
    const row = event.target?.closest?.(".sf-context-menu-item");
    if (!row || !this.contains(row) || row === this._hoverRow) return;
    this._hoverRow = row;
    clearTimeout(this._hoverTimer);
    this._hoverTimer = setTimeout(() => {
      if (this._hoverRow !== row || !this._owned) return;
      if (this.drill) return;
      const entry = this.entryOf(row);

      if (entry && submenuOf(entry) && !row.matches(':disabled, [aria-disabled="true"]')) {
        this.openSubmenu(row, entry, {
          focus: "none"
        });
      } else {
        this.closeSubmenu({
          restoreFocus: false
        });
      }
    }, 120);
  } // ─── opening (the menu owns its lifecycle when opened through openFor) ────
  // Both answer an outcome (§4.4): applied with `value`, whether the menu is
  // open afterwards; refused {reason: prevented} when a listener kept it as it
  // was, {reason: invalid} for an anchor that is not an element; unavailable
  // when the menu has no surface to open.


  toggleFor(anchor, options = {}) {
    if (this._owned?.anchor === anchor) {
      const closed = this.close();
      return Promise.resolve(closed ? {
        outcome: "applied",
        value: false
      } : {
        outcome: "refused",
        reason: "prevented"
      });
    }

    return this.openFor(anchor, options);
  }

  get isOpen() {
    return Boolean(this._owned);
  } // The menu takes the size step of what opens it (owner remark 2026-11-15):
  // the opener's size, else its component's or the Smart component holding
  // it (core density.js sizeOf); its two steps are "1/2" for an opener below
  // 1 and "1" from 1 up, as sf-button's own menu reads its size. A size the
  // page or a host gave the menu wins: the menu takes the opener's only while
  // its size attribute is the one it wrote itself, and writes it again on
  // every opening, so one menu opened from two tables follows each.


  followOpenerSize(place) {
    if (this.hasAttribute("size") && this._openerSize === undefined) return;
    const step = (0,_core_js_density_js__WEBPACK_IMPORTED_MODULE_1__.sizeStep)((0,_core_js_density_js__WEBPACK_IMPORTED_MODULE_1__.sizeOf)(place));
    const size = Number.isNaN(step) ? null : step < 1 ? "1/2" : "1";
    this._writingSize = true;

    try {
      if (size === null) this.removeAttribute("size");else if (this.getAttribute("size") !== size) this.setAttribute("size", size);
    } finally {
      this._writingSize = false;
    }

    this._openerSize = size === null ? undefined : size;
  } // A size written by anyone but the menu itself is the menu's own: it wins
  // over the opener's from then on.


  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "size" && !this._writingSize) this._openerSize = undefined;
    super.attributeChangedCallback(name, oldValue, newValue);
  } // Open with the menu's corner exactly at a point of the screen -- the
  // pointer's -- with no gap (CM-5), flipping at the edges. `target` is the
  // object it acts on: the focus goes back to it, and on a phone the menu is
  // the sheet at the bottom (C164 (6)). The options are openFor()'s.


  openAt(x, y, options = {}) {
    if (!Number.isFinite(Number(x)) || !Number.isFinite(Number(y))) return Promise.resolve({
      outcome: "refused",
      reason: "invalid"
    });

    if (!this._point) {
      this._point = document.createElement("span");

      this._point.setAttribute("aria-hidden", "true");

      this._point.className = "sf-context-menu-point";
    } // Where the menu is, so a dialog's top layer holds it as it holds the menu.


    (this.closest("dialog[open]") || document.body).append(this._point); // The point is drawn by the menu's sheet (.sf-context-menu-point): a
    // zero box fixed to the screen; only where it stands is set here.

    this._point.style.left = `${Number(x)}px`;
    this._point.style.top = `${Number(y)}px`;
    return this.openFor(this._point, {
      side: "block-end",
      align: "start",
      offset: "0px",
      ...options
    });
  } // ─── the areas named by `for` (C164) ─────────────────────────────────────


  areas() {
    return ids(this.getAttribute("for") ?? this.for).map(id => document.getElementById(id)).filter(Boolean);
  } // The object a node of the page stands in: {area, target}, or null outside
  // every area.


  targetOf(node) {
    if (!(node instanceof Element)) return null;

    for (const area of this.areas()) {
      if (!area.contains(node)) continue;
      const row = node.closest(TARGETS);
      return {
        area,
        target: row && row !== area && area.contains(row) ? row : area
      };
    }

    return null;
  } // Which objects the menu acts on (C164 (3)): every selected row of the
  // area when the row is selected (aria-selected="true"); a row that can be
  // selected and is not is selected alone first (`select` lists the rows
  // that lose their selection); any other object is acted on alone.


  selectionOf({
    area,
    target
  }) {
    if (!area || target === area) return {
      targets: [target],
      select: null
    };
    const rows = Array.from(area.querySelectorAll(TARGETS));

    if (selected(target)) {
      const all = rows.filter(selected);
      return {
        targets: all.length ? all : [target],
        select: null
      };
    }

    if (target.hasAttribute("aria-selected")) return {
      targets: [target],
      select: rows.filter(row => row !== target && selected(row))
    };
    return {
      targets: [target],
      select: null
    };
  } // The rows the open menu acts on (empty when it is not open for an object).


  get targets() {
    return this._targets ?? [];
  } // The right button with Shift, a link, a field and selected text keep the
  // browser's own menu (C164 (1)).


  browserKeeps(event, target) {
    if (event.shiftKey && event.type === "contextmenu" && event.button === 2) return true;
    if (event.target?.closest?.(BROWSER_KEEPS) && target.contains(event.target.closest(BROWSER_KEEPS))) return true;
    const selection = document.getSelection?.();
    return Boolean(selection && !selection.isCollapsed && String(selection).trim() && selection.anchorNode && target.contains(selection.anchorNode));
  } // The menu at an object opened from the keyboard: under its start.


  openAtTarget(target, options = {}) {
    const rect = target.getBoundingClientRect();
    const rtl = getComputedStyle(target).direction === "rtl";
    return this.openAt(rtl ? rect.right : rect.left, Math.min(rect.bottom, window.innerHeight), { ...options,
      target
    });
  }

  cancelPress() {
    if (this._press?.timer) clearTimeout(this._press.timer);
    this._press = null;
  }

  handleAreaEvent(event) {
    const {
      type
    } = event;

    if (type === "pointermove") {
      const press = this._press;
      if (press && !press.fired && Math.hypot(event.clientX - press.x, event.clientY - press.y) > LONG_PRESS_SLOP) this.cancelPress();
      return;
    }

    if (type === "pointerup" || type === "pointercancel") {
      if (this._press && !this._press.fired) this.cancelPress();
      return;
    }

    if (type === "click") {
      // The lift after a long press is not a press on the row.
      if (this._press?.fired) {
        const {
          at
        } = this._press;
        this._press = null;

        if (Date.now() - at < 2000) {
          event.preventDefault();
          event.stopPropagation();
        }
      }

      return;
    } // The menu's own rows, when the page placed the menu inside its area,
    // are not objects of the area.


    if (event.defaultPrevented || this.contains(event.target)) return;
    const found = this.targetOf(event.target);
    if (!found) return;

    if (type === "pointerdown") {
      this.cancelPress();
      if (event.pointerType !== "touch" || event.button > 0 || !event.isPrimary) return;
      if (event.target.closest?.(BROWSER_KEEPS)) return;
      const press = {
        x: event.clientX,
        y: event.clientY,
        fired: false,
        at: 0
      };
      press.timer = setTimeout(() => {
        if (this._press !== press) return;
        press.fired = true;
        press.at = Date.now();
        this.openAt(press.x, press.y, {
          target: found.target
        });
      }, LONG_PRESS_MS);
      this._press = press;
      return;
    }

    if (type === "keydown") {
      if (event.key !== "ContextMenu" && !(event.shiftKey && event.key === "F10")) return;
      if (event.target.closest?.(BROWSER_KEEPS)) return;
      event.preventDefault();
      this._keyAt = Date.now();
      this.openAtTarget(found.target);
      return;
    } // contextmenu: a long press that opened the menu already, a key the
    // keydown answered, the right button, or a phone's own long press.


    if (this._press?.fired || Date.now() - (this._keyAt ?? 0) < 500) {
      event.preventDefault();
      return;
    }

    if (this.browserKeeps(event, found.target)) return;
    event.preventDefault();
    this.cancelPress();

    if (event.pointerType === "touch") {
      this._press = {
        fired: true,
        at: Date.now()
      };
      this.openAt(event.clientX, event.clientY, {
        target: found.target
      });
    } else if (event.button === 2) {
      this.openAt(event.clientX, event.clientY, {
        target: found.target
      });
    } else {
      this.openAtTarget(found.target);
    }
  }

  surface() {
    return this.querySelector(":scope > .sf-context-menu");
  } // width: "content" (the default) lets the menu be as wide as its longest
  // line, between the menu's clamps; "trigger" makes it exactly as wide as the
  // control that opened it -- a site switcher, a profile button (owner,
  // 2026-10-14) -- a long line ending in an ellipsis; a CSS length fixes it.
  // The kinds of decision C32 size it by what it holds: "list" (at least the
  // trigger, up to the list's step or the trigger), "panel" (the panel's step
  // or the trigger, whichever is wider), "form" and "form-wide" (the form's
  // steps; on a phone a sheet at the bottom, the screen's width). The
  // attribute gives the default.


  async openFor(anchor, {
    side = "block-end",
    align = "start",
    focus = "first",
    parentMenu = null,
    alignmentOffset = 0,
    offset = undefined,
    width = this.width,
    target = undefined
  } = {}) {
    if (!(anchor instanceof Element)) return {
      outcome: "refused",
      reason: "invalid"
    };
    sayInPlaceOpen(this);
    if (this._owned) this.close({
      restoreFocus: false,
      ask: false
    }); // The object the menu acts on (C164): the row of an area named by `for`
    // that holds the anchor -- the row's «⋯» opens the same menu the right
    // button does -- or the one openAt() was given; on a selected row every
    // selected row of its area (C164 (3)).

    const found = target instanceof Element ? this.targetOf(target) ?? {
      area: null,
      target
    } : this.targetOf(anchor);
    const selection = found ? this.selectionOf(found) : null; // The request first (§19, vocabulary §4): a listener that prevents it keeps
    // the menu closed. It names the object and the objects, so the host gives
    // the entries for them, in one place for every way in (C164 (2)).

    if (!this.sfEmit("open", {
      target: found?.target ?? null,
      targets: selection?.targets ?? []
    }, {
      cancelable: true
    })) {
      return {
        outcome: "refused",
        reason: "prevented"
      };
    } // An unselected row is selected alone before the menu acts on it (C164 (3)).


    if (selection?.select) {
      for (const row of selection.select) row.setAttribute("aria-selected", "false");

      found.target.setAttribute("aria-selected", "true");
    }

    const targets = selection?.targets ?? [];

    if (targets.length || this._targets?.length) {
      this._targets = targets;
      this.requestComponentUpdate("targets");
    } // An anchor the size of nothing is a point: where a right-click was (a
    // host's contextmenu, SF.Effects). The menu's corner is the point itself,
    // not --sf-space-1/4 below it (CM-5, as system menus open), and what
    // stands under the point is the place the menu belongs to: its density
    // (C22/C79), its size and where the focus goes back (CM-2). A point
    // appended to <body> had neither, so the menu came out normal in a compact
    // table and the focus fell to <body>. Where it does not fit, core
    // positioning turns it to the other side of the point (C164 (1)): left of
    // it at the right edge, above it at the bottom edge.


    const point = pointOf(anchor, this);
    const place = point?.under ?? anchor; // The size of what opens it, on every opening (owner remark 2026-11-15):
    // a menu without a size of its own is drawn where it stands -- often on
    // <body> -- so the row menu of a table of size 1 opened at 1/2.

    this.followOpenerSize(place);
    await this.whenRendered();
    const surface = this.surface();
    if (!surface) return {
      outcome: "unavailable",
      reason: "no-surface"
    }; // Focus goes back where it was, or to the control that opened the menu
    // when it was nowhere -- a press on an sf-button leaves it on the body in
    // some browsers, and the menu returned it there. A host element is not
    // itself focusable; its native control is.

    const focusable = element => element?.matches?.("button, a[href], input, select, textarea, [tabindex]") ? element : element?.querySelector?.("button, a[href], input, select, textarea, [tabindex]") ?? element;

    const active = document.activeElement;
    const somewhere = active instanceof HTMLElement && active !== document.body && active !== document.documentElement; // Opened at the pointer for an object (openAt, C164), the focus goes back
    // to the object it acted on -- where it was inside it, else the object
    // itself, lent a tabindex when it takes none (CM-2: it fell to the page).

    const forObject = anchor === this._point && Boolean(found);
    const back = forObject && !(somewhere && found.target.contains(active));
    this._owned = {
      anchor,
      parentMenu,
      target: found?.target ?? null,
      returnTo: back ? found.target : somewhere ? active : point ? point.focusable : focusable(anchor),
      lent: back ? !found.target.matches(FOCUSABLE) : Boolean(point?.lent) && !somewhere,
      expanded: anchor.getAttribute("aria-expanded"),
      haspopup: anchor.getAttribute("aria-haspopup")
    };
    anchor.setAttribute("aria-haspopup", "menu");
    anchor.setAttribute("aria-expanded", "true"); // The density of the control that opens it (C22): the panel is drawn
    // where the menu element stands -- often on <body>, outside the compact
    // region of the toolbar or table that opens it -- so two menus of one
    // compact page drew at two sizes. A size the page gave the menu is a step
    // on that region's ladder too (C79), so every menu takes it.

    this._owned.density = surface.getAttribute("data-sf-density");
    surface.setAttribute("data-sf-density", (0,_core_js_density_js__WEBPACK_IMPORTED_MODULE_1__.densityOf)(place) ?? "normal"); // The top layer, where the platform has it: above every stacking context
    // and every clipping box, so a menu in a scrolled card is never cut and
    // never under the table it belongs to.

    surface.classList.add("sf-context-menu--open");

    if (typeof surface.showPopover === "function") {
      surface.setAttribute("popover", "manual");
      if (!surface.matches(":popover-open")) surface.showPopover();
    } else {
      surface.style.zIndex = "var(--sf-layer--popover)";
    }

    const content = this.querySelector(".sf-context-menu-content");
    const kind = WIDTH_KINDS.has(width) ? width : ""; // The control's width, for the kinds that read it (C32), public while
    // the menu is open: a page may size a part of the panel by it.

    const triggerWidth = () => `${(position().referenceRect?.(anchor) ?? anchor.getBoundingClientRect()).width}px`;

    surface.style.setProperty("--sf-context-menu-trigger-inline-size", triggerWidth());
    this._owned.trigger = triggerWidth;

    if (content) {
      if (kind) content.setAttribute("data-sf-width", kind);else content.removeAttribute("data-sf-width");
      this._owned.kindContent = content;
    } // A form, the menu of an object (C164 (6)) and a drilling popup -- a
    // settings menu, the person menu with its settings rows (owner decision
    // C176, defect SM-3) -- are the one sheet on a phone (C157 (5)): its levels
    // open inside the same sheet with the way back in its head (C157 (6)).


    const sheets = FORM_KINDS.has(kind) || Boolean(found) || this.drill && !parentMenu;
    const sheet = sheets && onPhone();
    const sized = width && width !== "content" && !kind;

    if (sized && content) {
      // A display: contents trigger (sf-button-icon, sf-button) is as wide as
      // what it draws (#68).
      const rect = position().referenceRect?.(anchor) ?? anchor.getBoundingClientRect();
      const length = width === "trigger" ? `${rect.width}px` : width;
      content.style.setProperty("--sf-context-menu--min-inline-size", length);
      content.style.setProperty("--sf-context-menu--max-inline-size", length);
      content.style.setProperty("inline-size", length);
      this._owned.sizedContent = content;
    } // offset: the gap between the trigger and the menu, a token or a length
    // (simai/ui-source#69); left out, the positioning's own --sf-space-1/4.
    // A form on a phone is not anchored: it is a sheet at the bottom of the
    // screen (the sheet's rules are the class sheet's).


    const owned = this._owned;

    const placeAt = asSheet => {
      owned.position?.stop();
      owned.position = null;
      owned.sheet = asSheet;

      if (asSheet) {
        surface.setAttribute("data-sf-sheet", "");
        return;
      }

      surface.removeAttribute("data-sf-sheet");
      owned.position = position().anchor(anchor, surface, {
        side,
        align,
        alignmentOffset,
        flip: true,
        shift: true,
        fitHeight: true,
        matchWidth: width === "trigger",
        ...(offset === undefined || offset === null || offset === "" ? point ? {
          offset: 0
        } : {} : {
          offset
        }),
        // The trigger may change its width while the menu is open (a field
        // that grows): the width the kinds read follows it.
        onPosition: () => {
          if (this._owned?.anchor === anchor) surface.style.setProperty("--sf-context-menu-trigger-inline-size", triggerWidth());
        }
      });
    };

    placeAt(sheet); // The one sheet (owner decision C157 (5)): a swipe down from its handle
    // row closes the form, as Escape does.

    owned.unswipe = (0,_core_js_sheet_swipe_js__WEBPACK_IMPORTED_MODULE_9__.swipeToClose)(surface, {
      when: () => owned.sheet && this._owned === owned,
      onDismiss: () => this.close({
        reason: "close"
      })
    }); // A form stays what the screen makes it: opened wide and the window
    // narrowed to a phone, it becomes the sheet; widened, it is anchored again.

    if (sheets) {
      owned.onResize = () => {
        if (this._owned === owned && onPhone() !== owned.sheet) placeAt(onPhone());
      };

      window.addEventListener("resize", owned.onResize);
    } // A menu it opens owns Escape, so the root says a surface is open: a record
    // panel listening on the document in capture runs before the menu's own
    // listener and would otherwise close with it. The outside press comes from
    // the stack.


    (0,_core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_5__.holdOpenSurfaceMark)(this, true, {
      onOutsidePress: this._onOutsidePress
    });
    this.sfEmit("opened", {});

    if (focus !== "none") {
      this.syncMenuItems();
      const items = this.availableMenuItems();
      const field = this.searchField();
      const row = focus === "last" ? items[items.length - 1] : items[0];
      if (field && focus !== "last") field.focus({
        preventScroll: true
      });else if (row) row.focus({
        preventScroll: true
      }); // A form or a slot's own markup has no row: its first control takes
      // the focus, so the keys -- Escape among them -- reach the menu (C32
      // acceptance, 2026-11-09: the focus stayed on the trigger).
      else this.tabbables()[focus === "last" ? this.tabbables().length - 1 : 0]?.focus({
        preventScroll: true
      });
    }

    return {
      outcome: "applied",
      value: true
    };
  } // reason says why (standard 1.3.8 §19.3): escape, outside, close (the head's
  // close button) or api (a choice, Tab, a script). A listener that prevents
  // sf-menu-context-close keeps the menu open; `ask: false` closes without
  // asking (the menu is leaving the page, or reopening).


  close({
    restoreFocus = true,
    reason = "api",
    ask = true
  } = {}) {
    const owned = this._owned;
    if (!owned) return false;
    if (ask && !this.sfEmit("close", {
      reason,
      unsaved: false
    }, {
      cancelable: true
    })) return false;
    this.closeSubmenu({
      restoreFocus: false
    });
    this._owned = null;
    this._hoverRow = null; // The next opening starts at the top level: a panel that reopened three
    // levels down is a panel that remembers what the person left behind.

    if (this._drill.length) {
      this._drill = [];
      this.requestComponentUpdate("drill");
    } // Cleared for the next opening, without telling a host-searched list:
    // closing is not a search.


    if (this._query) {
      this._query = "";
      this.requestComponentUpdate("query");
    }

    clearTimeout(this._hoverTimer);
    owned.position?.stop();
    if (owned.onResize) window.removeEventListener("resize", owned.onResize);

    for (const name of ["--sf-context-menu--min-inline-size", "--sf-context-menu--max-inline-size", "inline-size"]) {
      owned.sizedContent?.style.removeProperty(name);
    }

    owned.kindContent?.removeAttribute("data-sf-width");
    (0,_core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_5__.holdOpenSurfaceMark)(this, false);
    const surface = this.surface();

    if (surface) {
      owned.unswipe?.();
      if (surface.matches?.(":popover-open")) surface.hidePopover();
      surface.removeAttribute("popover");
      surface.classList.remove("sf-context-menu--open");
      surface.style.removeProperty("z-index");
      surface.style.removeProperty("--sf-context-menu-trigger-inline-size");
      surface.removeAttribute("data-sf-sheet");

      if (owned.density !== undefined) {
        if (owned.density === null) surface.removeAttribute("data-sf-density");else surface.setAttribute("data-sf-density", owned.density);
      }
    }

    const {
      anchor
    } = owned;
    if (owned.haspopup === null) anchor.removeAttribute("aria-haspopup");else anchor.setAttribute("aria-haspopup", owned.haspopup);
    if (owned.expanded === null) anchor.setAttribute("aria-expanded", "false");else anchor.setAttribute("aria-expanded", owned.expanded);

    if (restoreFocus) {
      if (owned.lent && owned.returnTo?.isConnected) focusLent(owned.returnTo, {
        preventScroll: true
      });else (owned.returnTo?.isConnected ? owned.returnTo : anchor)?.focus?.({
        preventScroll: true
      });
    }

    if (this._targets?.length) {
      this._targets = [];
      this.requestComponentUpdate("targets");
    }

    this.sfEmit("closed", {
      reason
    });
    return true;
  } // A choice in a submenu closes the whole chain and returns focus to where
  // the first menu was opened from.


  closeAll({
    restoreFocus = true,
    reason = "api"
  } = {}) {
    let root = this;

    while (root._owned?.parentMenu) root = root._owned.parentMenu;

    if (root === this) return this.close({
      restoreFocus,
      reason
    });
    return root.close({
      restoreFocus,
      reason
    });
  }

  async openSubmenu(row, entry, {
    focus = "first"
  } = {}) {
    if (this._submenu?._owned?.anchor === row) {
      if (focus !== "none") this._submenu.focus();
      return this._submenu;
    }

    this.closeSubmenu({
      restoreFocus: false
    });
    const child = document.createElement("sf-menu-context");
    child.setAttribute("aria-label", entry.text ?? "");
    child.setAttribute("popup", ""); // A submenu is the size of the menu it opens from.

    if (this.size === "1") child.setAttribute("size", "1");
    child.entries = entry.submenu;
    if (entry.search) child.search = entry.search; // A submenu's width, as the menu's own setting reads it (C32 kinds or a
    // length): a submenu of language rows is the panel (C142 (7)), so the
    // second name beside each name is not cut.

    if (entry.width) child.setAttribute("width", entry.width); // Selections in the submenu are the parent's to announce: a host listens
    // on one element whatever depth the item sits at.

    child.addEventListener("sf-menu-context-select", event => {
      event.stopPropagation();
      const forwarded = this.sfEmit("select", event.detail, {
        cancelable: true
      });
      if (!forwarded) event.preventDefault();
    });
    child.addEventListener("sf-menu-context-closed", () => {
      if (this._submenu === child) {
        this._submenu = null;
        child.remove();
      }
    }); // In the density of the menu it opens from, wherever it is placed (C22).

    (0,_core_js_density_js__WEBPACK_IMPORTED_MODULE_1__.followDensity)(child, this.surface() ?? this);
    (this.closest("dialog[open]") || document.body).append(child);
    this._submenu = child; // The submenu's first row stands level with the row that opened it: the
    // panel moves up by its own padding and border, which this menu shares.

    const content = this.querySelector(".sf-context-menu-content");
    const style = content ? getComputedStyle(content) : null;
    const inset = style ? (parseFloat(style.paddingTop) || 0) + (parseFloat(style.borderTopWidth) || 0) : 0;
    await child.openFor(row, {
      side: "inline-end",
      align: "start",
      focus,
      parentMenu: this,
      alignmentOffset: -inset
    });
    return child;
  }

  closeSubmenu({
    restoreFocus = true
  } = {}) {
    const child = this._submenu;
    if (!child) return false;
    this._submenu = null;
    child.close({
      restoreFocus,
      ask: false
    });
    child.remove();
    return true;
  } // Escape, Tab, typeahead and the submenu keys belong to a menu that owns its
  // lifecycle. A host that renders the menu itself keeps them, as before.


  handleOwnedKeyDown(event) {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
    if (!this.contains(event.target)) return;
    const rtl = getComputedStyle(this.surface() ?? document.documentElement).direction === "rtl";
    const inward = rtl ? "ArrowLeft" : "ArrowRight",
          outward = rtl ? "ArrowRight" : "ArrowLeft"; // A drilling panel the page placed: nothing to close and no walk of its
    // own, but the way out of a level is the same as in an opened menu. The
    // side arrows stay the slider's and the search field's.

    if (!this._owned) {
      const editing = event.target?.classList?.contains("sf-context-menu-range-input") || event.target === this.searchField();

      if (event.key === "Enter" && event.target === this.searchField()) {
        this.chooseFirstMatch(event);
        return;
      }

      if (this._drill?.length && (event.key === "Escape" || event.key === outward && !editing)) {
        event.preventDefault();
        event.stopPropagation();
        this.drillBack();
      }

      return;
    } // In a range row the side arrows, Home, End and the digits are the
    // slider's: the platform moves the value. The menu keeps Escape, Tab and
    // its own up and down walk.


    if (event.target?.classList?.contains("sf-context-menu-range-input") && !["Escape", "Tab", "ArrowDown", "ArrowUp"].includes(event.key)) return; // Inside a choice row the side arrows move between its options.

    const option = event.target?.closest?.(".sf-context-menu-choice-option");

    if (option && (event.key === inward || event.key === outward)) {
      const options = Array.from(option.parentElement.querySelectorAll(".sf-context-menu-choice-option:not(:disabled)"));
      const at = options.indexOf(option);
      const next = options[(at + (event.key === inward ? 1 : options.length - 1)) % options.length];
      event.preventDefault();
      next?.focus();
      return;
    } // In the search field the letters and the side arrows are the field's;
    // ArrowDown goes on to the rows, Enter chooses the first row the query
    // left, as a combobox does (simai/ui-source#72), and Escape still closes.


    if (event.target === this.searchField() && event.key !== "Escape" && event.key !== "Tab") {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        this.syncMenuItems();
        this.availableMenuItems()[0]?.focus();
      }

      if (event.key === "Enter") this.chooseFirstMatch(event);
      return;
    } // One level back before the menu closes: the way out of a drilling panel
    // is the way it came in. Escape at the top level closes it, as before.


    if (this._drill.length && (event.key === "Escape" || event.key === outward)) {
      event.preventDefault();
      event.stopPropagation();
      this.drillBack();
      return;
    }

    if (event.key === "Escape" || event.key === outward && this._owned.parentMenu && !editable(event.target)) {
      event.preventDefault();
      event.stopPropagation();
      this.close({
        reason: event.key === "Escape" ? "escape" : "api"
      });
      return;
    } // In a form or a panel Tab walks its controls. Past the last (or before
    // the first) it leaves a popup for the page; a sheet, which covers the
    // page, takes it round to the other end.


    if (event.key === "Tab" && !this.menuItems().includes(event.target) && this.tabbables().length > 1) {
      const controls = this.tabbables();
      const at = controls.indexOf(event.target);
      const edge = event.shiftKey ? 0 : controls.length - 1;
      if (at !== edge && at >= 0) return;

      if (this._owned.sheet) {
        event.preventDefault();
        controls[event.shiftKey ? controls.length - 1 : 0].focus();
        return;
      }
    }

    if (event.key === "Tab") {
      // Tab leaves the menu for the page; the menu does not trap it.
      this.closeAll({
        restoreFocus: true
      });
      return;
    }

    const entry = this.entryOf(event.target);

    if (event.key === inward && (this.drill ? drillable(entry) : submenuOf(entry)) && event.target.getAttribute?.("aria-disabled") !== "true") {
      event.preventDefault();
      const row = event.target.closest(".sf-context-menu-item");
      if (this.drill) this.drillInto(row);else this.openSubmenu(row, entry, {
        focus: "first"
      });
      return;
    } // Letters typed into a form's field are the field's.


    if (event.key.length === 1 && event.key !== " " && !editable(event.target)) this.typeahead(event);
  } // Enter in the search field: the first row the query left is chosen, as a
  // press on it would choose it -- a command row selects and closes, a
  // submenu row opens, a drilling row goes a level in. A word still being
  // composed (an input method) is the field's Enter, and a query that left no
  // row does nothing. The key is taken (preventDefault) and still bubbles, so
  // a host that once answered Enter itself can tell the menu did.


  chooseFirstMatch(event) {
    if (event.isComposing || event.keyCode === 229) return;
    this.syncMenuItems();
    const first = this.availableMenuItems()[0];
    if (!first) return;
    event.preventDefault();
    first.click();
  }

  typeahead(event) {
    const now = Date.now();
    this._typeahead.text = (now - this._typeahead.at > TYPEAHEAD_MS ? "" : this._typeahead.text) + event.key.toLowerCase();
    this._typeahead.at = now;
    const items = this.availableMenuItems();
    const from = Math.max(0, items.indexOf(event.target));
    const ordered = [...items.slice(from + (this._typeahead.text.length === 1 ? 1 : 0)), ...items.slice(0, from + 1)];
    const found = ordered.find(item => (item.querySelector(".sf-context-menu-item-label")?.textContent ?? item.textContent).trim().toLowerCase().startsWith(this._typeahead.text));
    if (!found) return;
    event.preventDefault();
    found.focus();
  }

  handleMenuKeyDown(event) {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return; // Home and End take a slider to its ends; the menu does not take them away.

    if (event.target?.classList?.contains("sf-context-menu-range-input") && (event.key === "Home" || event.key === "End")) return;
    const items = this.availableMenuItems(),
          index = items.indexOf(event.target);
    if (index < 0) return;
    let next;

    switch (event.key) {
      case "ArrowDown":
        next = (index + 1) % items.length;
        break;

      case "ArrowUp":
        next = (index + items.length - 1) % items.length;
        break;

      case "Home":
        next = 0;
        break;

      case "End":
        next = items.length - 1;
        break;

      default:
        return;
      // Native activation and host-owned Tab/Escape remain intact.
    }

    event.preventDefault();
    event.stopPropagation();
    items[next].focus();
  } // The manifest's settings, and what the menu reads more closely (its
  // position's old words, the lists set as properties, the host's role).


  static get props() {
    return { ...super.props,
      templateName: {
        attribute: "template",
        default: "default"
      },
      position: {
        default: ""
      },
      tooltip: {
        type: Boolean,
        default: true
      },
      text: {
        default: ""
      },
      items: {
        type: Array,
        default: []
      },
      entries: {
        type: Array,
        default: []
      },
      popup: {
        type: Boolean,
        default: false
      },
      role: {
        default: "menu"
      },
      contentClass: {
        default: ""
      },
      rootClass: {
        default: ""
      },
      // The menu's size, a step on the region's ladder (C79): "1/2" by
      // default (owner decision C134: 32px rows on a page, 28 in a compact
      // region, 44 under a finger on a phone) or "1" (40, 32 compact).
      size: {
        default: "1/2"
      },
      // How wide the menu opens: "content" (its longest line, the default),
      // "trigger" (exactly the control that opened it), a kind of decision
      // C32 ("list", "panel", "form", "form-wide") or a CSS length.
      width: {
        default: "content"
      },
      // A panel with tabs (owner, 2026-10-15): the tabs and the way out on a
      // head that never scrolls, the rows of the chosen tab in a body that
      // does, the actions in a footer that stays. "A|B" or [{id, label}].
      tabs: {
        default: ""
      },
      // The chosen tab's id (or index); the host shows that tab's rows.
      activeTab: {
        attribute: "active-tab",
        default: ""
      },
      // A close button at the end of the head.
      closable: {
        type: Boolean,
        default: false
      }
    };
  } // The tabs as [{id, label}]: a string list names each tab by its label.


  get tabs() {
    const raw = Array.isArray(this._tabs) ? this._tabs : this.getAttribute("tabs") || "";
    const list = Array.isArray(raw) ? raw : String(raw).split("|").map(label => label.trim()).filter(Boolean);
    return list.map((tab, index) => typeof tab === "string" ? {
      id: tab,
      label: tab,
      index
    } : {
      id: String(tab.id ?? index),
      label: String(tab.label ?? tab.id ?? index),
      index
    });
  }

  set tabs(value) {
    if (Array.isArray(value)) {
      this._tabs = value;
      this.requestComponentUpdate("tabs");
      return;
    }

    this._tabs = null;
    this.setState({
      tabs: value ? String(value) : ""
    });
  }

  get activeTab() {
    const tabs = this.tabs;
    const asked = this.getAttribute("active-tab") ?? "";
    return tabs.find(tab => tab.id === asked) ?? tabs[Number(asked)] ?? tabs[0] ?? null;
  }

  get closable() {
    return this.getBooleanAttr("closable", false);
  } // A panel with tabs is a former name until 2027-01-01 (owner decision
  // C106): a list's view settings are sf-settings look="panel". It is still
  // drawn; a page that asks for deprecation notes hears it once.


  get panel() {
    const panel = this.tabs.length > 0;
    if (panel) (0,_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_7__.noteDeprecated)({
      component: "sf-menu-context",
      tag: this.localName,
      kind: "setting",
      attribute: "tabs",
      from: "tabs",
      to: 'sf-settings look="panel"',
      since: "2026-11-12",
      remove_after: "2027-01-01"
    });
    return panel;
  } // A tab chosen: the head marks it and says so; the host puts that tab's
  // rows in the body. The panel keeps its width -- it is fixed, never the
  // width of what a tab holds.


  chooseTab(index) {
    const tab = this.tabs[index];
    if (!tab || tab.id === this.activeTab?.id) return this;
    this.setState({
      activeTab: tab.id
    });
    this.sfEmit("tab", {
      id: tab.id,
      index: tab.index
    });
    return this;
  } // The head's close button: an owned menu closes itself; a menu its host
  // placed is closed by the host, which hears the same event either way.


  requestClose() {
    if (this._owned) return this.close({
      reason: "close"
    });
    this.sfEmit("close", {
      reason: "close",
      unsaved: false
    }, {
      cancelable: true
    });
    return true;
  }

  get templateName() {
    return this.getAttribute("template") || "default";
  }

  get position() {
    return normalizePosition(this.getAttribute("position"));
  } // The host's role (§3.1): a menu unless the page says otherwise.


  get menuRole() {
    return this.getAttribute("role") || "menu";
  }

  templateContext() {
    const props = this.getPropsContext();
    const level = this.drillLevel();
    return this.createTemplateContext({ ...props,
      // The older list form set as a property (`.items=${…}`, sf-admin-menu's
      // settings menu) is kept by the manifest's accessor, which the props
      // above do not read: they gave the default, an empty list, and the menu
      // drew an empty panel. JSON in the attribute is still the props' reading.
      items: this.hasAttribute("items") ? props.items : this.items,
      entries: this.entries,
      search: level.search ?? this.search,
      query: this.query,
      tabs: this.tabs,
      activeTab: this.activeTab,
      closable: this.closable,
      closeLabel: this.sfWord("close"),
      backLabel: this.sfWord("back"),
      // What a switch tile says it is set to, in the menu's language.
      onLabel: this.sfWord("on"),
      offLabel: this.sfWord("off"),
      drill: this.drill,
      // The ids of the icon options' name tooltips (C160 (1)): one prefix per menu.
      tipPrefix: this._tipPrefix ??= `sf-menu-tip-${++menuTips}`,
      level,
      role: this.menuRole,
      panel: this.panel,
      position: this.position,
      size: this.size,
      component: this,
      rootClass: this.getRootClass(),
      // On a selection the menu acts on every selected row and says how many
      // (C164 (3)).
      selectionLabel: this.targets.length > 1 ? this.sfWord("selected", {
        vars: {
          count: this.targets.length
        }
      }) : ""
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_4__.renderContextMenuTemplate)(this.templateContext());
  }

}

SfContextMenu.define("sf-menu-context");
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "b8b80063ca9a"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderContextMenuTemplate: () => (/* binding */ renderContextMenuTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var _avatar_js_picture__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("c69a3dc158df");
/* harmony import */ var _component_kbd_js_shortcut__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("151a293c8c90");
/* harmony import */ var _helpers_control_status__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("60a3f9a6662c");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, _avatar_js_picture__WEBPACK_IMPORTED_MODULE_1__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, _avatar_js_picture__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);



 // A destructive row: danger: true, or status "danger" as every control writes
// it (C13), with "error" read as its alias. Any other status (success,
// warning, info) draws a plain row and is said once per page (BS-1).

const ITEM_STATUSES = Object.freeze(["", "danger", "error"]);

function isDestructive(entry) {
  (0,_helpers_control_status__WEBPACK_IMPORTED_MODULE_3__.warnUnknownControlStatus)("sf-menu-context", entry.status, {
    allowed: ITEM_STATUSES,
    label: "item status"
  });
  return Boolean(entry.danger) || entry.status === "danger" || entry.status === "error";
} // An entry's shortcut: the kbd component's keys -- `mod+c` in this platform's
// words, or the text a page wrote (⇧⌘L, F2) as it is. Inside a menu the kbd
// sheet draws them as plain glyphs in the muted ink; the menu never styles
// them (owner decision 2026-11-07, docs review R030, rule C04).


function renderShortcut(value) {
  const {
    keys,
    join
  } = (0,_component_kbd_js_shortcut__WEBPACK_IMPORTED_MODULE_2__.shortcutView)(value);
  if (!keys.length) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<kbd class="sf-kbd--group sf-context-menu-item-shortcut">${keys.map((key, at) => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${at && join ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-kbd-join">+</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}<kbd class=${key.square ? "sf-kbd--square" : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>${key.text}</kbd>`)}</kbd>`;
}

function joinClasses(...tokens) {
  return tokens.flat().filter(Boolean).join(" ");
}

function renderItem(item) {
  if (item?.component === "sf-button") {
    const props = item.props || {};
    const click = props["@click"];
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
            <sf-button
                    appearance=${props.type || "default"}
                    scheme=${props.scheme || "primary"}
                    size=${props.size || "1"}
                    text=${props.text || ""}
                    icon-start=${props.iconLeft || ""}
                    icon-end=${props.iconRight || ""}
                    aria-label=${props.ariaLabel || props.text || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    ?disabled=${Boolean(props.disabled)}
                    @click=${typeof click === "function" ? click : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ></sf-button>
        `;
  }

  return SF.__internal.litHtml(item.component, item.props);
}

function renderItems(items) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        ${items.map(renderItem)}
    `;
} // The standard menu: entries are data, not components. An item is a row with
// an optional icon (or a check, on a row that is ticked), a label and caption,
// and at its end a value, a shortcut or a submenu chevron; a separator is a rule; a heading names the group
// of items under it. The row geometry is the profile menu's (owner, 2026-10-12):
// as tall as a size-1/2 field, its content on the field's axis.


const ROLE = {
  check: "menuitemcheckbox",
  radio: "menuitemradio"
};

function icon(name, className) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class="sf-icon ${className}" aria-hidden="true">${name}</i>`;
} // A colour the row stands for -- a colour row of sf-settings (C85), a label's
// colour -- drawn as a circle in the place of an icon. `swatch` is a CSS
// colour (a code, var() of a token, light-dark() of two); anything that could
// close the declaration is not drawn.


const SWATCH = /^[#\w\s(),.%/-]+$/u;

const hasSwatch = entry => typeof entry?.swatch === "string" && SWATCH.test(entry.swatch);

function swatch(value) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-context-menu-item-swatch" style=${`--sf-context-menu-swatch: ${value}`} aria-hidden="true"></span>`;
} // The pictures of a row and of the header are sf-avatar's own drawing
// (avatar js/picture.js, avatar study AV-8): the photo an <img>, the initials
// on the neutral plate, the person glyph without either; the context menu's
// sheet gives them the row's line and the header's step only. They were the
// menu's own classes on the secondary container, in the medium weight.
// What leads a row: an icon, or a picture of the thing itself -- a site's logo,
// a person -- with its initials when there is no picture. A row ticked on and
// off (kind: "check") leads with its check, in the column and at the width of
// the icons: nothing is kept at the row's end for it (owner R016, 2026-11-07).
// Unticked, it shows its own icon, if it has one.


function renderLead(entry) {
  if (entry.kind === "check" && entry.type !== "switch" && entry.checked) return icon("check", "sf-context-menu-item-check");
  if (entry.avatar || entry.initials) return (0,_avatar_js_picture__WEBPACK_IMPORTED_MODULE_1__.avatarPicture)({
    imageUrl: entry.avatar,
    text: entry.initials,
    shape: "square",
    extraClass: "sf-context-menu-item-avatar"
  });
  if (hasSwatch(entry)) return swatch(entry.swatch);
  return entry.icon ? icon(entry.icon, "sf-context-menu-item-icon") : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
} // The leading column of the level: kept for every row once any row of it has
// something to lead with -- an icon, a picture, or a check it may be given --
// so the labels start on one line.


function renderLeadPlace(entry, lead) {
  return lead ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-context-menu-item-lead">${renderLead(entry)}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
} // Who the menu is about -- the signed-in person at the top of a profile menu.
// Text, not an item: it is read, not chosen.
// Its initials, without a picture, are sf-avatar's rule (helpers/text.js
// getInitials; reuse audit 2026-11-02, finding 10): the copy here took
// word[0], half a letter outside the basic plane, and kept «по» as a word.


function renderHeader(entry) {
  const picture = (0,_avatar_js_picture__WEBPACK_IMPORTED_MODULE_1__.avatarPicture)({
    imageUrl: entry.avatar,
    text: entry.initials,
    name: entry.text,
    extraClass: "sf-context-menu-header-avatar"
  });
  const lines = Array.isArray(entry.caption) ? entry.caption : [entry.caption].filter(Boolean);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-context-menu-header" role="presentation">
        ${picture}
        <span class="sf-context-menu-header-text">
            <span class="sf-context-menu-header-name">${entry.text ?? ""}</span>
            ${lines.map(line => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-context-menu-header-caption">${line}</span>`)}
        </span>
    </div>`;
} // A meter row (owner decision C191 (4)-(6)): an amount within a known range,
// such as the account's tariff remainder in a person menu -- read, not
// chosen, so it is a block between rows, not a row. The bar is
// sf-progress-bar's meter and shows the share used, so the page's thresholds
// fire (warning-at, error-at; C131 (7)); the words over it are the page's
// value-text (the remainder: «Осталось 1,7 из 10 ГБ»), else the percentage,
// on one line with the name as the bar's own «top» text (C131 (4)). That line
// is aria-hidden: the bar says the name and the words once.


function renderMeter(entry) {
  const number = Number(entry.value);
  const value = Number.isFinite(number) ? Math.max(0, Math.min(100, number)) : 0;
  const words = entry.valueText ?? entry["value-text"] ?? "";
  const warningAt = entry.warningAt ?? entry["warning-at"];
  const errorAt = entry.errorAt ?? entry["error-at"];
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-context-menu-meter" role="none">
        <div class="sf-context-menu-meter-head" aria-hidden="true">
            <span class="sf-context-menu-meter-name">${entry.text ?? ""}</span>
            <span class="sf-context-menu-meter-value">${words || `${value}%`}</span>
        </div>
        <sf-progress-bar
                class="sf-context-menu-meter-bar"
                meter
                value=${String(value)}
                label=${entry.text || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                value-text=${words || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                warning-at=${warningAt ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                error-at=${errorAt ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        ></sf-progress-bar>
    </div>`;
} // The text of a row: its label, the value under it where the row shows one (a
// drilling row), and the caption. A long label wraps and a long value is cut,
// so neither widens the panel; a cut value is the row's Framework tooltip
// (the element's syncValueTooltip, C160 (1)), never a browser title.


function renderItemText(entry, under = "") {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-context-menu-item-text">
            <span class="sf-context-menu-item-label">${entry.text ?? ""}</span>
            ${under ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-context-menu-item-under">${under}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ${entry.caption ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-context-menu-item-caption">${entry.caption}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        </span>`;
} // The options of a choice, side by side. Each is a menuitemradio of the menu,
// so the arrows walk through them as through any row. An option drawn as an
// icon alone shows its name as the Framework's tooltip (owner decision C160
// (1), C176 defect SM-6), not a browser title: the tooltip's surface stands
// beside it, named by data-tooltip, and the tooltip controller (component
// tooltip, loaded by the menu when it draws one) shows it on hover, focus or
// a long press.


function renderChoiceOptions(entry, path, iconsOnly, context) {
  const tip = at => `${context?.tipPrefix ?? "sf-menu-tip"}-${String(path).replace(/[^\w-]/gu, "-")}-${at}`;

  return (entry.options ?? []).map((option, at) => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<button
            type="button"
            class="sf-context-menu-item sf-context-menu-choice-option"
            role="menuitemradio"
            data-sf-entry=${path}
            data-sf-option=${at}
            data-tooltip=${iconsOnly && option.text ? tip(at) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            aria-checked=${String(Boolean(option.checked))}
            aria-label=${option.text ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ?disabled=${Boolean(option.disabled)}
    >${hasSwatch(option) ? swatch(option.swatch) : option.icon ? icon(option.icon, "") : option.text ?? ""}</button>${iconsOnly && option.text ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-tooltip sf-tooltip--dark sf-context-menu-choice-tooltip" id=${tip(at)} hidden><span class="sf-tooltip-content"><span class="sf-tooltip-text">${option.text}</span></span></span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}`);
} // A choice of a few options -- the theme in a profile menu, a setting in a
// panel. The quiet form, the default since 1.5.0 (owner, 2026-10-30): the
// label on its own row with the options at its end, sized to their content,
// no frame and no dividers, the chosen one on a soft fill. `view: "band"`
// draws the framed full-width band instead, for a row that must show every
// option across the panel.
// A choice row that opens its options as a level of their own: the label, the
// chosen option under it in small dimmed text and the chevron at the end --
// the shape a row with a submenu has, because that is what it is. Only a
// drilling panel has a level to open, so a flyout menu draws the quiet row.


function renderChoiceDrill(entry, path, lead) {
  const chosen = (entry.options ?? []).find(option => option.checked);
  const under = chosen?.text ?? "";
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<button
            type="button"
            class="sf-context-menu-item"
            role="menuitem"
            data-sf-entry=${path}
            aria-haspopup="menu"
            aria-expanded="false"
            ?disabled=${Boolean(entry.disabled)}
    >
        ${renderLeadPlace(entry, lead)}
        ${renderItemText(entry, under)}
        ${icon("chevron_right", "sf-context-menu-item-chevron")}
    </button>`;
} // The options of a drilled choice as the level's rows: each a menuitemradio of
// the menu, the chosen one on the soft fill of a chosen row and no check mark
// (owner R016, 2026-11-07: a pick-one list), found by the row's own path and
// its place in the list, as an option of the quiet row is.


function renderLevelOptions(choice, context) {
  const {
    entry,
    path
  } = choice;
  const options = entry.options ?? [];
  const lead = options.some(option => option.icon || hasSwatch(option));
  const query = String(context.query ?? "").trim().toLowerCase();
  const shown = options.map((option, at) => [option, at]).filter(([option]) => !query || String(option.text ?? "").toLowerCase().includes(query));
  return shown.map(([option, at]) => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<button
            type="button"
            class=${joinClasses("sf-context-menu-item", "sf-context-menu-level-option", option.checked ? "sf-context-menu-item--chosen" : "")}
            role="menuitemradio"
            data-sf-entry=${path}
            data-sf-option=${at}
            aria-checked=${String(Boolean(option.checked))}
            ?disabled=${Boolean(option.disabled)}
    >
        ${lead ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-context-menu-item-lead">${hasSwatch(option) ? swatch(option.swatch) : option.icon ? icon(option.icon, "sf-context-menu-item-icon") : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        ${renderItemText(option)}
    </button>`);
}

function renderChoice(entry, path, lead, context) {
  const options = entry.options ?? [];
  const iconsOnly = options.length > 0 && options.every(option => option.icon || hasSwatch(option));

  if (context?.drill && entry.view === "drill" && options.length > 0) {
    return renderChoiceDrill(entry, path, lead);
  }

  if (entry.view === "band") {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-context-menu-choice sf-context-menu-choice--band" role="group" aria-label=${entry.text ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
            ${renderChoiceOptions(entry, path, iconsOnly, context)}
        </div>`;
  }

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-context-menu-value-row sf-context-menu-value-row--choice">
        ${renderLeadPlace(entry, lead)}
        ${renderItemText(entry)}
        <span class=${joinClasses("sf-context-menu-choice", iconsOnly ? "sf-context-menu-choice--icons" : "")}
                role="group" aria-label=${entry.text ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
            ${renderChoiceOptions(entry, path, iconsOnly, context)}
        </span>
    </div>`;
} // A boolean setting's control: the Framework switch's track and thumb, drawn.
// The row itself is the menuitemcheckbox -- an input inside a button is no
// markup at all -- so the state is read from the row's aria-checked.


function renderSwitch() {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-context-menu-item-switch" aria-hidden="true">
        <span class="sf-context-menu-item-switch-thumb"></span>
    </span>`;
} // How a range's value reads: the number and the unit written after it, with no
// space -- "90%", "16px" -- the way the ladder's own lengths are written.


function rangeText(entry) {
  return `${entry.value ?? entry.min ?? 0}${entry.unit ?? ""}`;
} // A number in a range: the platform's own slider at the row's end with the
// number after it. The slider is not a menu item -- it keeps its own slider
// role, its side arrows and its announcement -- and carries
// sf-context-menu-stop, which joins it to the menu's roving tab stop.


function renderRange(entry, path, lead, context) {
  const text = rangeText(entry);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-context-menu-value-row sf-context-menu-value-row--range">
        ${renderLeadPlace(entry, lead)}
        ${renderItemText(entry)}
        <span class="sf-context-menu-range">
            <input
                    class="sf-context-menu-range-input sf-context-menu-stop"
                    type="range"
                    data-sf-entry=${path}
                    min=${entry.min ?? 0}
                    max=${entry.max ?? 100}
                    step=${entry.step ?? 1}
                    .value=${String(entry.value ?? entry.min ?? 0)}
                    ?disabled=${Boolean(entry.disabled)}
                    aria-label=${entry.text ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    aria-valuetext=${text}
                    @input=${event => context?.component?.previewRange(event.target)}
                    @change=${event => context?.component?.commitRange(event.target)}
            >
            <span class="sf-context-menu-range-value" aria-hidden="true">${text}</span>
        </span>
    </div>`;
} // What a tile says it is set to: a switch's state in words, the chosen option
// of a choice, otherwise the row's own value.


function tileValue(entry, context) {
  if (entry?.type === "switch") return entry.value ? context?.onLabel ?? "" : context?.offLabel ?? "";
  if (entry?.type === "choice") return (entry.options ?? []).find(option => option.checked)?.text ?? "";
  return entry?.value ?? "";
} // A tile of a group: a row of the menu with the row's own role, laid out as a
// plate -- the icon, the name and the current value -- so it is read without a
// tooltip. A switch tile is on when its value is.


function renderTile(entry, path, context) {
  const toggle = entry?.type === "switch";
  const value = tileValue(entry, context);
  const classes = joinClasses("sf-context-menu-item", "sf-context-menu-tile", toggle && entry.value ? "sf-context-menu-tile--on" : "");
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<button
            type="button"
            class=${classes}
            role=${toggle ? "menuitemcheckbox" : "menuitem"}
            data-sf-entry=${path}
            aria-checked=${toggle ? String(Boolean(entry.value)) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            aria-label=${value ? `${entry.text ?? ""}: ${value}` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ?disabled=${Boolean(entry.disabled)}
    >
        ${icon(entry.icon || "tune", "sf-context-menu-tile-icon")}
        <span class="sf-context-menu-tile-name">${entry.text ?? ""}</span>
        <span class="sf-context-menu-tile-value" title=${value || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>${value}</span>
    </button>`;
} // A block of rows declared as one entry: a named group of rows, or the grid of
// tiles a panel's quick settings are. Its items carry paths of their own, the
// step the submenu grammar already had, and a search narrows them as it
// narrows the level.


function renderGroup(entry, path, context, query) {
  const items = (entry.items ?? []).map((item, index) => [item, index]).filter(([item]) => matches(item, query));
  if (!items.length) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const name = entry.text ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing;

  if (entry.view === "tiles") {
    const columns = items.length === 4 ? 2 : Math.min(items.length, 3);
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class=${`sf-context-menu-tiles sf-context-menu-tiles--${columns}`} role="group" aria-label=${name}>
            ${items.map(([item, index]) => renderTile(item, `${path}/${index}`, context))}
        </div>`;
  }

  const lead = items.some(([item]) => leads(item));
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-context-menu-group" role="group" aria-label=${name}>
        ${items.map(([item, index]) => renderEntry(item, `${path}/${index}`, lead, context, query))}
    </div>`;
}

function renderEntry(entry, path, lead, context, query) {
  if (entry?.type === "header") return renderHeader(entry);
  if (entry?.type === "choice") return renderChoice(entry, path, lead, context);
  if (entry?.type === "range") return renderRange(entry, path, lead, context);
  if (entry?.type === "group") return renderGroup(entry, path, context, query);

  if (entry?.type === "note") {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<p class="sf-context-menu-note">${entry.text ?? ""}</p>`;
  }

  if (entry?.type === "meter") return renderMeter(entry);

  if (entry?.type === "separator") {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-context-menu-separator" role="separator"></div>`;
  }

  if (entry?.type === "heading") {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-context-menu-heading" role="presentation">${entry.text ?? ""}</div>`;
  } // A switch row is a boolean setting (1.5.0): the row is the
  // menuitemcheckbox, its value lives in the entry and the switch is drawn.


  const toggle = entry?.type === "switch";
  const role = toggle ? "menuitemcheckbox" : ROLE[entry.kind] ?? "menuitem";
  const checkable = !toggle && role !== "menuitem"; // One of a pick-one list (kind: "radio") is marked by the soft fill of a
  // chosen row, with no mark and no column kept for one, so the rows use the
  // whole width (owner R016, 2026-11-07).

  const chosen = role === "menuitemradio" && Boolean(entry.checked);
  const submenu = Array.isArray(entry.submenu) && entry.submenu.length > 0; // A drilling row shows its value under the name, where a long one is cut
  // instead of pushing the row's end about (owner, 2026-10-30).

  const under = context?.drill && submenu ? entry.value ?? "" : ""; // A disabled row is dimmed but stays in the walk with its reason, the
  // caption (owner decision C164 (4)): aria-disabled, never disabled.

  const dimmed = Boolean(entry.disabled);
  const classes = joinClasses("sf-context-menu-item", toggle ? "sf-context-menu-item--switch" : "", dimmed ? "sf-context-menu-item--disabled" : "", isDestructive(entry) ? "sf-context-menu-item--danger" : "", entry.current ? "sf-context-menu-item--current" : "", chosen ? "sf-context-menu-item--chosen" : "");
  const body = (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        ${renderLeadPlace(entry, lead)}
        ${renderItemText(entry, under)}
        ${entry.value && !under && !toggle ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-context-menu-item-value">${entry.value}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        ${renderShortcut(entry.shortcut)}
        ${toggle ? renderSwitch() : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        ${submenu ? icon("chevron_right", "sf-context-menu-item-chevron") : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    `;

  if (entry.href && !submenu && !entry.disabled) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<a class=${classes} href=${entry.href} role=${role} data-sf-entry=${path} lang=${entry.lang ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>${body}</a>`;
  }

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<button
            type="button"
            class=${classes}
            role=${role}
            data-sf-entry=${path}
            lang=${entry.lang ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            aria-checked=${toggle ? String(Boolean(entry.value)) : checkable ? String(Boolean(entry.checked)) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            aria-haspopup=${submenu ? "menu" : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            aria-expanded=${submenu ? "false" : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            aria-disabled=${dimmed ? "true" : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    >${body}</button>`;
} // The order a level's rows are drawn in (owner decision C164 (5)): a
// destructive row -- «Удалить» -- is always last, after a line, whatever
// place the host gave it. A line left at either end, or doubled where a row
// moved away, is not drawn. Each row keeps its own path.


function actionOrder(shown) {
  const destructive = entry => ROWS(entry) && entry.type !== "group" && (Boolean(entry.danger) || entry.status === "danger" || entry.status === "error");

  const danger = shown.filter(([entry]) => destructive(entry));
  if (!danger.length) return shown;

  const separator = pair => pair[0]?.type === "separator";

  const rest = [];

  for (const pair of shown.filter(one => !danger.includes(one))) {
    if (separator(pair) && (!rest.length || separator(rest[rest.length - 1]))) continue;
    rest.push(pair);
  }

  while (rest.length && separator(rest[rest.length - 1])) rest.pop();

  return rest.length ? [...rest, [{
    type: "separator"
  }, -1], ...danger] : danger;
} // What is not a row: the blocks that stand between rows. A choice row is a
// row since 1.5.0 (the quiet form, owner 2026-10-30): it has a lead, a label
// and a value of its own, so it keeps the level's leading column and a search
// narrows to it. A group holds rows, so it counts as rows.


const BLOCKS = new Set(["separator", "heading", "header", "note", "meter"]);

const ROWS = entry => entry && !BLOCKS.has(entry.type); // A row that keeps the level's leading column: one with an icon or a picture,
// and one that can be ticked, whose check stands there.


function leads(entry) {
  return Boolean(entry.icon || entry.avatar || entry.initials || hasSwatch(entry) || entry.kind === "check" && entry.type !== "switch");
} // What a search narrows to: the rows whose label or caption holds the query. A
// group is kept while one of its own rows is: the block is where its rows live,
// not a thing to be found on its own.


function matches(entry, query) {
  if (!query) return true;
  if (!ROWS(entry)) return false;
  if (entry.type === "group") return (entry.items ?? []).some(item => matches(item, query));
  const text = `${entry.text ?? ""} ${entry.caption ?? ""} ${entry.keywords ?? ""}`.toLowerCase();
  return text.includes(query);
}

function renderSearch(context) {
  const search = context.search; // The panel's header (owner C06, R029): the search icon over the rows'
  // icons, the text over their text, no frame.

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-context-menu-search">
        ${icon("search", "sf-context-menu-search-icon")}
        <input
                class="sf-context-menu-search-input"
                type="search"
                autocomplete="off"
                spellcheck="false"
                placeholder=${search.placeholder ?? ""}
                aria-label=${search.placeholder || context.ariaLabel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                .value=${context.query ?? ""}
                @input=${event => context.component.setQuery(event.target.value)}
        >
    </div>`;
} // The way back and the parent's label, on a drilling panel's head: the panel
// replaces its content instead of opening a second one beside it, so its width
// never grows with the depth (owner, 2026-10-30).


function renderDrillHead(context) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-context-menu-drill-head">
        <sf-button-icon class="sf-context-menu-back" icon="arrow_back" appearance="ghost" scheme="on-surface"
                size=${context.size === "1" ? "1" : "1/2"}
                aria-label=${context.backLabel} title=${context.backLabel}
                @click=${() => context.component.drillBack()}></sf-button-icon>
        <span class="sf-context-menu-level-title">${context.level?.label ?? ""}</span>
    </div>`;
}

function renderEntries(context) {
  const level = context.level ?? {
    entries: context.entries,
    prefix: "",
    depth: 0,
    label: ""
  }; // A level that is one choice row's options: its rows are those options,
  // under the head that says which setting they belong to.

  if (level.choice) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
            ${renderDrillHead(context)}
            ${context.search ? renderSearch(context) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ${searchList(context, renderLevelOptions(level.choice, context))}
        `;
  }

  const entries = level.entries;
  const prefix = level.prefix;
  const query = String(context.query ?? "").trim().toLowerCase(); // One leading column for the whole menu: when any item has an icon, every
  // item keeps the place, so the labels start on one line.
  // A group's rows keep a leading column of their own, inside the block.

  const lead = entries.some(entry => ROWS(entry) && entry.type !== "group" && leads(entry)); // A search the host answers (search.remote) shows the entries as the host
  // set them for the query; a local one narrows them here. A host that set no
  // rows has found nothing, whatever the field holds -- an answer to an older
  // query can arrive after the field was cleared -- so its note shows then too.

  const remote = Boolean(context.search?.remote);
  let shown = actionOrder(entries.map((entry, index) => [entry, index]).filter(([entry]) => remote || matches(entry, query))); // On a selection the top level says how many rows it acts on, «Выбрано N»,
  // in place of a heading the host gave the one object (C164 (3)).

  const selection = level.depth === 0 && context.selectionLabel;
  if (selection && shown[0]?.[0]?.type === "heading") shown = shown.slice(1);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        ${level.depth > 0 ? renderDrillHead(context) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        ${context.search ? renderSearch(context) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        ${searchList(context, (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
            ${selection ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-context-menu-heading sf-context-menu-heading--selection" role="presentation">${context.selectionLabel}</div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ${shown.map(([entry, index]) => renderEntry(entry, `${prefix}${index}`, lead, context, remote ? "" : query))}
            ${context.search && (query || remote) && !shown.some(([entry]) => ROWS(entry)) ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<p class="sf-context-menu-note" role="status">${context.search.empty ?? ""}</p>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        `)}
    `;
} // A menu with a search keeps the field (and a drilling level's head) where it
// is and scrolls its rows alone, under it: the field scrolled away with the
// list and the scrollbar ran beside it (owner R012, 2026-11-07). Without a
// search the rows stay children of the content, as before; a panel with tabs
// already scrolls its body alone under a head that stays.


function searchList(context, rows) {
  return context.search && !context.panel ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-context-menu-list">${rows}</div>` : rows;
} // Whether the menu draws entries. A menu with a search does while its entries
// are empty: a host that answered a query with no rows took the field, and the
// focus in it, out of the page, and the root lost its entries class -- the
// class list openFor() wrote sf-context-menu--open into was written again
// without it, so the surface hid and the menu looked closed (docs thread,
// 2026-11-07). The field stays, with the empty note under it, as a local
// search shows, and the class lists stay as they were.


function drawsEntries(context) {
  if (context.entries && context.entries.length) return true;
  return Boolean(context.search && !(context.items && context.items.length) && !context.component?.hasSlotContent?.("content"));
}

function renderContent(context) {
  if (drawsEntries(context)) {
    return renderEntries(context);
  }

  if (context.items && context.items.length) {
    return renderItems(context.items); // console.log(items);
  }

  if (context.component?.hasSlotContent?.("content")) {
    return context.component.getSlotContent("content");
  }

  return context.text || lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
} // The footer of actions: what is slotted as "footer" stands under the rows,
// at the bottom while they scroll, its buttons sharing the width.


function renderFooter(context) {
  if (!context.component?.hasSlotContent?.("footer")) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-context-menu-footer">${context.component.getSlotContent("footer")}</div>`;
} // A panel's head: the tabs, and the way out at its end. It never scrolls --
// the body under it does (owner, 2026-10-15). The tab is chosen on sf-tabs'
// current event, sf-tabs-change; its former name sf-tab-change, which sf-tabs
// still sends after it until 2026-12-01, is only kept inside the menu (both
// stop here, the menu is not a tab strip). Remove that stopper with the alias.


function renderPanelHead(context) {
  const active = context.activeTab;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-context-menu-head">
        <sf-tabs class="sf-context-menu-tabs" type="underline" size=${context.size === "1" ? "1" : "1/2"}
                items=${context.tabs.map(tab => tab.label).join("|")}
                active-index=${String(active?.index ?? 0)}
                @sf-tabs-change=${event => {
    event.stopPropagation();
    context.component.chooseTab(Number(event.detail?.current ?? 0));
  }}
                @sf-tab-change=${event => event.stopPropagation()}></sf-tabs>
        ${context.closable ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button-icon class="sf-context-menu-close" appearance="ghost" scheme="on-surface"
                size=${context.size === "1" ? "1" : "1/2"} icon="close"
                aria-label=${context.closeLabel} title=${context.closeLabel}
                @click=${() => context.component.requestClose()}></sf-button-icon>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    </div>`;
} // No tail (owner, 2026-10-12): it never read as one piece with the panel. The
// position attribute is kept for its class and draws nothing.


function renderTooltip() {
  return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
} // The box is laid out by the menu's own sheet, not by utilities: the root a
// row of one, .sf-context-menu-frame the positioned frame, the content a
// column that takes the rest (component.context-menu 1.8.0). The template
// wrote flex, relative, flex-col and flex-1, and on a Docara page the Loader
// linked utility/position after the first frame (sf-menu-context 1.14.1).


function renderContextMenuTemplate(context) {
  const rootClasses = joinClasses("sf-context-menu", context.position ? `sf-context-menu--position-${context.position}` : "", drawsEntries(context) ? "sf-context-menu--entries" : "", context.size === "1" ? "sf-context-menu--size-1" : "", context.panel ? "sf-context-menu--panel" : "", context.drill ? "sf-context-menu--drill" : "", context.rootClass);
  const contentClasses = joinClasses("sf-context-menu-content", // On the content, not the root: the root's class list is the one
  // openFor() adds sf-context-menu--open to, and a level that draws a
  // search changes the list while the menu is open.
  context.search && drawsEntries(context) && !context.panel ? "sf-context-menu-content--search" : "", context.contentClass);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div
                class=${rootClasses}
                style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                role=${context.role || "menu"}
                aria-label=${(context.selectionLabel ? [context.ariaLabel || context.component?.getAttribute?.("aria-label"), context.selectionLabel].filter(Boolean).join(", ") : context.ariaLabel) || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        >
            <div class="sf-context-menu-frame">
                ${renderTooltip(context)}
                ${context.panel ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class=${contentClasses}>
                        ${renderPanelHead(context)}
                        <div class="sf-context-menu-body" role="tabpanel" aria-label=${context.activeTab?.label ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>${renderContent(context)}</div>
                        ${renderFooter(context)}
                    </div>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class=${contentClasses}>${renderContent(context)}${renderFooter(context)}</div>`}
            </div>
        </div>
    `;
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

/***/ "9d9903b87148"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit/directives/keyed.js", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("lit/directives/keyed.js", 1).then(resolve, reject), { once: true })));

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

/***/ "a6b3ed0c1589"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AVATAR_HUES: () => (/* binding */ AVATAR_HUES),
/* harmony export */   AVATAR_TONES: () => (/* binding */ AVATAR_TONES),
/* harmony export */   STATIC_HUES: () => (/* binding */ STATIC_HUES),
/* harmony export */   TONE_HUES: () => (/* binding */ TONE_HUES),
/* harmony export */   avatarHue: () => (/* binding */ avatarHue),
/* harmony export */   avatarTone: () => (/* binding */ avatarTone),
/* harmony export */   avatarToneHash: () => (/* binding */ avatarToneHash),
/* harmony export */   resolveAvatarHue: () => (/* binding */ resolveAvatarHue),
/* harmony export */   resolveAvatarTone: () => (/* binding */ resolveAvatarTone)
/* harmony export */ });
// sf-avatar's hue from a name, without a document: a plain function of its
// argument, so tests/avatar-tones.contract.test.mjs runs it in Node and a server
// can print the same class in the first paint. docs/docs.md gives the algorithm
// for a server in another language.
//
// Owner decision C17 (2026-11-08): avatars have no colours of their own. The
// initials take a hue of the static palette (the hue setting, the class
// sf-hue-<name>); the eight tones of initials are gone, and `auto` picks among
// eight static hues in the old order, so a name keeps its slot: rose is pink,
// the former violet (HCT hue 325) is purple, the other six keep their names.
// A former tone moves at most 15 degrees (dispatcher, 2026-11-09).
//
// FNV-1a, 32 bits, over the UTF-8 bytes of the string exactly as given (no
// trimming, no case folding, no normalisation), its high half folded onto the
// low one, because the low bits of FNV-1a alone follow the low bits of the
// input; the remainder by the length of the list picks the tone.
//
// The list and its order are part of the algorithm: a name keeps its tone only
// while they stay. A later named tone does not join `auto`.
const AVATAR_HUES = Object.freeze(['pink', 'amber', 'lime', 'green', 'teal', 'sky', 'indigo', 'purple']);

// Every hue a setting may name: the static palette (theme-palette.js
// STATIC_HUES, tests/avatar-tones.contract.test.mjs holds the two equal).
const STATIC_HUES = Object.freeze(['red', 'orange', 'amber', 'yellow', 'lime', 'green', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'pink', 'brown', 'gray']);

// The former tone setting and its names, until 2027-01-01 (journal
// attribute-c17-avatar-tone-to-hue, value-c17-avatar-rose-to-pink, which
// also carries violet to purple).
const AVATAR_TONES = Object.freeze(['rose', 'amber', 'lime', 'green', 'teal', 'sky', 'indigo', 'violet']);
const TONE_HUES = Object.freeze({rose: 'pink', violet: 'purple'});

const FNV_OFFSET = 0x811c9dc5;
const FNV_PRIME = 0x01000193;

function avatarToneHash(name) {
  let hash = FNV_OFFSET;
  for (const byte of new TextEncoder().encode(String(name))) {
    hash = Math.imul(hash ^ byte, FNV_PRIME) >>> 0;
  }
  return (hash ^ (hash >>> 16)) >>> 0;
}

// No name, no hue: the neutral look.
function avatarHue(name) {
  const text = name === undefined || name === null ? '' : String(name);
  return text ? AVATAR_HUES[avatarToneHash(text) % AVATAR_HUES.length] : '';
}

// The hue a setting asks for: a named one as it is, auto the one of the name,
// empty (or a name the palette does not have) the neutral look. The former
// tone setting is read when hue is empty, its rose as pink and its violet as purple.
function resolveAvatarHue(hue, name, tone = '') {
  const setting = hue || TONE_HUES[tone] || tone || '';
  if (setting === 'auto') return avatarHue(name);
  return STATIC_HUES.includes(setting) ? setting : '';
}

// The former names (2027-01-01): the tone of a name in the old words.
function avatarTone(name) {
  const text = name === undefined || name === null ? '' : String(name);
  return text ? AVATAR_TONES[avatarToneHash(text) % AVATAR_TONES.length] : '';
}

function resolveAvatarTone(setting, name) {
  return setting === 'auto' ? avatarTone(name) : setting || '';
}


/***/ },

/***/ "68b68beb66a3"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-menu-context for the shim (core/js/aliases.js, standard §16 item 20). mode: host-attribute (no shim), manifest-only (the DOM name does not change; its meaning does), retired (no new name; kept until the date).","component":"sf-menu-context","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"aria-label","to":null,"kind":"attribute","component":"sf-menu-context","since":"2026-10-27","remove_after":"2026-12-01","mode":"host-attribute","section":"§3.1","note":"stays a host attribute, read by the base (§3.1, §4.8); no shim"},{"from":"role","to":null,"kind":"attribute","component":"sf-menu-context","since":"2026-10-27","remove_after":"2026-12-01","mode":"host-attribute","section":"§3.1","note":"stays a host attribute (menu by default); no shim"},{"from":"position","to":null,"kind":"setting","component":"sf-menu-context","since":"2026-10-27","remove_after":"2026-12-01","mode":"retired","section":"compatibility.deprecations 1.3.0","note":"openFor(anchor, {side, align}) places the menu; read until the date"},{"from":"tooltip","to":null,"kind":"setting","component":"sf-menu-context","since":"2026-10-27","remove_after":"2026-12-01","mode":"retired","section":"compatibility.deprecations 1.3.0","note":"a menu has no tail; read until the date"},{"from":"sf-context-menu","to":"sf-menu-context","kind":"tag","component":"sf-menu-context","since":"2026-11-03","remove_after":"2027-01-01","section":"rename plan R0 (ui-control RENAME-PLAN-2026-11-03), naming decision 2026-11-02","note":"the element is sf-menu-context; sf-context-menu is a subclass defined beside it until the date"},{"from":"sf-context-menu-select","to":"sf-menu-context-select","kind":"event","component":"sf-menu-context","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-context-menu-change","to":"sf-menu-context-change","kind":"event","component":"sf-menu-context","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-context-menu-changed","to":"sf-menu-context-changed","kind":"event","component":"sf-menu-context","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-context-menu-reset","to":"sf-menu-context-reset","kind":"event","component":"sf-menu-context","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-context-menu-open","to":"sf-menu-context-open","kind":"event","component":"sf-menu-context","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-context-menu-opened","to":"sf-menu-context-opened","kind":"event","component":"sf-menu-context","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-context-menu-close","to":"sf-menu-context-close","kind":"event","component":"sf-menu-context","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-context-menu-closed","to":"sf-menu-context-closed","kind":"event","component":"sf-menu-context","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-context-menu-search","to":"sf-menu-context-search","kind":"event","component":"sf-menu-context","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-context-menu-tab","to":"sf-menu-context-tab","kind":"event","component":"sf-menu-context","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"tabs","to":null,"kind":"setting","component":"sf-menu-context","since":"2026-11-12","remove_after":"2027-01-01","mode":"retired","section":"owner decision C106 (1)","note":"a list\'s view settings are sf-settings look=\\"panel\\"; the action menu\'s tabs are read and drawn until the date"}]}');

/***/ },

/***/ "4ff97a05802b"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.menu-context","tag":"sf-menu-context","version":"1.25.5","kind":"leaf","settings":{"position":{"type":"enum","values":["","inline-start","inline-start-top","inline-start-bottom","inline-end","inline-end-top","inline-end-bottom","top","top-inline-start","top-inline-end","bottom","bottom-inline-start","bottom-inline-end","start","end","top-start","top-end","bottom-start","bottom-end","left","left-top","left-bottom","right","right-top","right-bottom","top-left","top-center","top-right","bottom-left","bottom-center","bottom-right","left-start","left-end","right-start","right-end","inline-start-start","inline-start-end","inline-end-start","inline-end-end"],"default":""},"tooltip":{"type":"boolean","default":true},"text":{"type":"string","default":""},"items":{"type":"list","default":[],"of":{"text":"string","value":"string"}},"content-class":{"type":"string","default":""},"entries":{"type":"list","default":[],"of":{"id":"string","text":"string","caption":{"type":"string","optional":true},"icon":{"type":"icon","optional":true},"avatar":{"type":"string","optional":true},"initials":{"type":"string","optional":true},"shortcut":{"type":"string","optional":true},"kind":{"type":"string","optional":true},"type":{"type":"string","optional":true},"value":{"type":"string","optional":true},"lang":{"type":"string","optional":true},"keywords":{"type":"string","optional":true},"checked":{"type":"boolean","optional":true},"disabled":{"type":"boolean","optional":true},"danger":{"type":"boolean","optional":true},"status":{"type":"string","optional":true},"current":{"type":"boolean","optional":true},"href":{"type":"string","optional":true},"keep-open":{"type":"boolean","optional":true},"submenu":{"type":"list","optional":true},"search":{"type":"object","optional":true},"width":{"type":"string","optional":true},"options":{"type":"list","optional":true},"items":{"type":"list","optional":true},"min":{"type":"number","optional":true},"max":{"type":"number","optional":true},"step":{"type":"number","optional":true},"unit":{"type":"string","optional":true},"view":{"type":"string","optional":true},"value-text":{"type":"string","optional":true},"warning-at":{"type":"number","optional":true},"error-at":{"type":"number","optional":true}}},"popup":{"type":"boolean","default":false},"search":{"type":"object","optional":true},"submenu":{"type":"enum","values":["flyout","drill"],"default":"flyout"},"size":{"type":"enum","values":["1/2","1"],"default":"1/2"},"width":{"type":"string","default":"content"},"tabs":{"type":"string","default":""},"active-tab":{"type":"string","default":""},"closable":{"type":"boolean","default":false},"for":{"type":"string","default":""}},"values":{},"events":{"select":{"carries":{"id":{"type":"string","nullable":true},"entry":"object","checked":{"type":"boolean","nullable":true},"group":{"type":"string","nullable":true}},"cancelable":true},"change":{"x-native":false,"carries":{"id":{"type":"string","nullable":true},"value":{"type":"id"},"previous":{"type":"id"},"entry":"object"},"cancelable":true},"changed":{"x-native":false,"carries":{"id":{"type":"string","nullable":true},"value":{"type":"id"},"previous":{"type":"id"},"entry":"object"}},"reset":{"carries":{},"cancelable":true,"own-verb":true},"open":{"carries":{"target":{"type":"object","nullable":true},"targets":{"type":"list"}},"cancelable":true},"opened":{"carries":{}},"close":{"carries":{"reason":{"type":"enum","values":["close","escape","outside","cancelled","api"]},"unsaved":"boolean"},"cancelable":true},"closed":{"carries":{"reason":{"type":"enum","values":["close","escape","outside","cancelled","api"]}}},"search":{"carries":{"query":"string"},"own-verb":true},"tab":{"carries":{"id":"string","index":"number"},"own-verb":true}},"actions":{"open-for":{"with":{"anchor":"object","options":{"type":"object","optional":true,"schema":{"properties":{"side":{"type":"string","default":"block-end"},"align":{"type":"string","default":"start"},"focus":{"type":"string","enum":["first","last","none"],"default":"first"},"offset":{"type":"string"}}}}},"waits":true,"emits":"open"},"toggle-for":{"with":{"anchor":"object","options":{"type":"object","optional":true}},"waits":true},"open-at":{"with":{"x":"number","y":"number","options":{"type":"object","optional":true,"schema":{"properties":{"target":{"type":"object"},"focus":{"type":"string","enum":["first","last","none"],"default":"first"}}}}},"waits":true,"emits":"open"},"close":{"with":{"reason":{"type":"enum","values":["close","escape","outside","cancelled","api"]}},"emits":"close"},"choose-tab":{"with":{"index":"number"}},"request-close":{},"set-value":{"with":{"id":"string","value":{"type":"id"}}},"set-all":{"with":{"values":"object"}},"show":{"with":{"id":"string"}},"reset":{"emits":"reset"}},"layer":{"kind":"surface","locks-page":false,"traps-focus":false},"css-variables":{"--sf-context-menu-background-color":{"type":"color","state":"default"},"--sf-context-menu-color":{"type":"color","state":"default"},"--sf-context-menu-border-color":{"type":"color","state":"default"},"--sf-context-menu-border-width":{"type":"length","state":"default"},"--sf-context-menu-radius":{"type":"length","state":"default"},"--sf-context-menu-padding-inline":{"type":"length","state":"default"},"--sf-context-menu-padding-block":{"type":"length","state":"default"},"--sf-context-menu-gap":{"type":"length","state":"default"},"--sf-context-menu-inline-size":{"type":"length","state":"default"}}}');

/***/ },

/***/ "25e9776cb404"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Context Menu","runtime":{"close":"Close","back":"Back","on":"On","off":"Off","selected":"{count} selected"},"events":{"search":{"label":"Search the menu"},"tab":{"label":"Choose a tab"},"reset":{"label":"Put the settings back"}}}');

/***/ },

/***/ "c19f070ad532"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Контекстное меню","runtime":{"close":"Закрыть","back":"Назад","on":"Вкл.","off":"Выкл.","selected":"Выбрано {count}"},"events":{"search":{"label":"Искать в меню"},"tab":{"label":"Выбрать вкладку"},"reset":{"label":"Вернуть настройки"}}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("0e16c692aca4");
/******/
/******/ })()
;