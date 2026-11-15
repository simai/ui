/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "571c22df775f"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fillShortcut: () => (/* binding */ fillShortcut),
/* harmony export */   fillShortcuts: () => (/* binding */ fillShortcuts)
/* harmony export */ });
/* harmony import */ var _shortcut_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("151a293c8c90");
/* harmony import */ var _spoken_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("a17921630512");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("ea38bd73e984");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("03ae6703d3d5");
// A combination in running text (owner decision C191 (9) and (10),
// 2026-11-15; ui-control research 2026-11-14-recipe-parts, #q-kb-text and
// #q-kb-names). An author writes the notation once, as a host's `shortcut`
// setting takes it, on a plain <kbd>:
//
//   Нажмите <kbd data-sf-shortcut="mod+k"></kbd>, чтобы открыть поиск.
//
// and this fills it with the caps the shared helper draws for every host
// (js/shortcut.js shortcutView): ⌘ K on a Mac, Ctrl K elsewhere -- caps stand
// apart in text, and the + between Windows words is written as the hosts write
// it (.sf-kbd-join), shown only where keys are plain glyphs (a tooltip, a
// menu). No new component (D11e): like data-sf-copy (C48), an attribute on
// the element the page already has, which works in Markdown, PHP and
// templates.
//
// The caps are hidden from a screen reader and the names of the keys stand
// beside them, read and never seen, in the page's language (js/spoken.js,
// lang/<locale>.json): «Command K», «Ctrl K», «Shift Command Z», «Ввод». A
// product adds a language with SF.language.register('sf-kbd', code, words).
//
// Markup added later is filled too (one observer for the document, as the
// copy route keeps), and so is a changed value, the page's language or a
// [lang] above a combination.




const WORDS = {
  en: _lang_en_json__WEBPACK_IMPORTED_MODULE_2__.runtime,
  ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_3__.runtime
};
const SELECTOR = 'kbd[data-sf-shortcut]';
const ATTRIBUTE = 'data-sf-shortcut'; // Read, never seen; inline as well, so the words take no room before the
// sheet has arrived (the sheet holds the same, .sf-kbd-spoken).

const UNSEEN = 'position:absolute;inline-size:1px;block-size:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap'; // The words through Core's language rule (SF.pageText, core/js/page-language.js:
// a word registered for sf-kbd, the shipped one, the language without its
// region, English), read from the page's SF so this bundle does not carry a
// second copy of the rule. Without Core, the nearest [lang] and English.

function say(word, node) {
  const pageText = globalThis.SF?.pageText;
  if (typeof pageText === 'function') return pageText(WORDS, word, node, 'sf-kbd');
  const lang = String(node?.closest?.('[lang]')?.getAttribute('lang') || 'en').toLowerCase().split('-')[0];
  return WORDS[lang]?.[word] ?? WORDS.en[word] ?? word;
}
/**
 * Fills one <kbd data-sf-shortcut>: the caps (aria-hidden) and the words a
 * reader says. Again only when what it would write differs.
 */


function fillShortcut(element, apple = (0,_shortcut_js__WEBPACK_IMPORTED_MODULE_0__.isApplePlatform)()) {
  if (!element || element.localName !== 'kbd' || !element.hasAttribute(ATTRIBUTE)) return false;
  const value = element.getAttribute(ATTRIBUTE);
  const view = (0,_shortcut_js__WEBPACK_IMPORTED_MODULE_0__.shortcutView)(value, apple);
  const spoken = (0,_spoken_js__WEBPACK_IMPORTED_MODULE_1__.spokenText)(view.keys, word => say(word, element));
  const mark = `${value}\u0000${apple}\u0000${spoken}`;
  if (element.__sfShortcut === mark) return false;
  element.__sfShortcut = mark;
  const doc = element.ownerDocument;
  const parts = [];

  if (view.keys.length) {
    const words = doc.createElement('span');
    words.className = 'sf-kbd-spoken';
    words.setAttribute('style', UNSEEN);
    words.textContent = spoken;
    parts.push(words);
  }

  view.keys.forEach((key, at) => {
    if (at && view.join) {
      const join = doc.createElement('span');
      join.className = 'sf-kbd-join';
      join.setAttribute('aria-hidden', 'true');
      join.textContent = '+';
      parts.push(join);
    }

    const cap = doc.createElement('kbd');
    if (key.square) cap.className = 'sf-kbd--square';
    cap.setAttribute('aria-hidden', 'true');
    cap.textContent = key.text;
    parts.push(cap);
  });
  element.classList.add('sf-kbd--group');
  element.replaceChildren(...parts);
  return true;
}
/** Fills every combination in `root` (and `root` itself). */

function fillShortcuts(root = globalThis.document) {
  if (!root) return 0;
  const apple = (0,_shortcut_js__WEBPACK_IMPORTED_MODULE_0__.isApplePlatform)();
  let filled = 0;
  if (root.matches?.(SELECTOR) && fillShortcut(root, apple)) filled += 1;
  root.querySelectorAll?.(SELECTOR).forEach(element => {
    if (fillShortcut(element, apple)) filled += 1;
  });
  return filled;
} // Once per document, whichever copy of this bundle runs first.

if (typeof document !== 'undefined' && !document.__sfShortcutRoute) {
  document.__sfShortcutRoute = true;

  const fillAll = () => fillShortcuts(document);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fillAll, {
      once: true
    });
  }

  fillAll(); // Added combinations, a changed value, and a changed [lang] above one. The
  // keys this writes inside a combination carry no data-sf-shortcut, so they
  // ask for nothing again.

  new MutationObserver(records => {
    let languageChanged = false;

    for (const record of records) {
      if (record.type === 'attributes') {
        if (record.attributeName === 'lang') languageChanged = true;else if (record.target instanceof Element) fillShortcuts(record.target);
        continue;
      }

      record.addedNodes.forEach(node => {
        if (node instanceof Element) fillShortcuts(node);
      });
    }

    if (languageChanged) fillAll();
  }).observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: [ATTRIBUTE, 'lang']
  }); // SF.language.use() and words a product registers.

  globalThis.SF?.language?.onChange?.(fillAll);
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

/***/ "a17921630512"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   spokenParts: () => (/* binding */ spokenParts),
/* harmony export */   spokenText: () => (/* binding */ spokenText)
/* harmony export */ });
// What a screen reader says for a combination (owner decision C191 (10),
// 2026-11-15): the name of each key in the page's language -- «Command»,
// «Ввод», «Стрелка вверх» -- while the caps stay as printed (⌘, ↵, ↑; on
// Russian keyboards the caps are Latin too). ⌘ alone is read as «place of
// interest» or not at all, so the caps are hidden from the reader and these
// words stand in their place.
//
// The names follow the caps the shared helper prints (js/shortcut.js
// shortcutView), so a combination is heard as it is drawn, on either
// platform: ⌘ is Command, ⌃ Control, ⌥ Option on a Mac; Ctrl, Alt and Win
// elsewhere. A cap without a name of its own -- a letter, a digit, F5, / --
// is said as printed. Each name is a key of the kbd component's words
// (lang/<locale>.json, runtime); nothing here reads the page.
// A cap's word, by what it prints.
const CAP_WORDS = {
  '⌘': 'command',
  '⌃': 'control',
  '⌥': 'option',
  '⇧': 'shift',
  Ctrl: 'ctrl',
  Alt: 'alt',
  Shift: 'shift',
  Win: 'win',
  '↵': 'enter',
  Esc: 'escape',
  Tab: 'tab',
  Space: 'space',
  '⌫': 'backspace',
  Del: 'delete',
  '⌦': 'delete',
  '↑': 'up',
  '↓': 'down',
  '←': 'left',
  '→': 'right',
  Home: 'home',
  End: 'end',
  PgUp: 'pageup',
  PgDn: 'pagedown',
  '+': 'plus'
}; // The signs a key text a page wrote for people (⇧⌘L, given as one cap
// because it is not the notation) is read sign by sign.

const SIGNS = new Set(['⌘', '⌃', '⌥', '⇧', '↵', '⌫', '⌦', '↑', '↓', '←', '→']);
/**
 * The parts a reader says for printed caps, in order: `{word}` for a key
 * with a name of its own (a key of the words), `{text}` for one said as
 * printed.
 */

function spokenParts(caps) {
  const parts = [];

  for (const cap of caps ?? []) {
    const text = String(cap?.text ?? '');
    if (!text) continue;
    const word = CAP_WORDS[text];

    if (word) {
      parts.push({
        word
      });
      continue;
    } // A cap of the page's own text: its signs by name, the rest as printed.


    let rest = '';

    for (const sign of text) {
      if (SIGNS.has(sign)) {
        if (rest.trim()) parts.push({
          text: rest.trim()
        });
        rest = '';
        parts.push({
          word: CAP_WORDS[sign]
        });
      } else {
        rest += sign;
      }
    }

    if (rest.trim()) parts.push({
      text: rest.trim()
    });
  }

  return parts;
}
/** The words for printed caps, each part said by `say(word)`, one space apart. */

function spokenText(caps, say) {
  return spokenParts(caps).map(part => part.word ? say(part.word) : part.text).join(' ');
}

/***/ },

/***/ "6f9dd815d727"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "ea38bd73e984"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Keyboard key","runtime":{"command":"Command","control":"Control","option":"Option","shift":"Shift","ctrl":"Ctrl","alt":"Alt","win":"Windows","enter":"Enter","escape":"Escape","tab":"Tab","space":"Space","backspace":"Backspace","delete":"Delete","up":"Up Arrow","down":"Down Arrow","left":"Left Arrow","right":"Right Arrow","home":"Home","end":"End","pageup":"Page Up","pagedown":"Page Down","plus":"Plus"}}');

/***/ },

/***/ "03ae6703d3d5"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Клавиша","runtime":{"command":"Command","control":"Control","option":"Option","shift":"Shift","ctrl":"Ctrl","alt":"Alt","win":"Windows","enter":"Ввод","escape":"Escape","tab":"Tab","space":"Пробел","backspace":"Backspace","delete":"Delete","up":"Стрелка вверх","down":"Стрелка вниз","left":"Стрелка влево","right":"Стрелка вправо","home":"Home","end":"End","pageup":"Page Up","pagedown":"Page Down","plus":"Плюс"}}');

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
let __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("6f9dd815d727");
/* harmony import */ var _js_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("571c22df775f");
 // A combination written as notation in text, <kbd data-sf-shortcut="mod+k">
// (owner decision C191, 2026-11-15): filled with the shared helper's caps and
// the spoken names of the keys.


})();

/******/ })()
;