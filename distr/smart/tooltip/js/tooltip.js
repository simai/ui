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

/***/ "0b167a45ab71"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("6d8735a1253b");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("9279cc82ea5a");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("b58689b2b3f6");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("45e954eb1d84");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("616513d619d2");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_2__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);






 // sf-tooltip from its component.json (standard simai.smart-component 1.3.8 §3,
// §4): appearance, size, arrow, text and supporting-text are attributes and
// properties made by core/js/element-manifest.js; the axis's old name `type` is
// a dated alias of appearance (aliases.json).

const TooltipElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_3__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_5__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_6__
  },
  source: 'ru',
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_4__
});

class SfTooltip extends TooltipElement {
  static get props() {
    return { ...super.props,
      templateName: {
        attribute: 'template',
        default: 'default'
      },
      // The axis is called appearance, because that is the question it answers.
      // `type` keeps working: see contracts/public-api-axes.json. dark, the
      // inverse surface, is the plain tooltip and the default (1.2.0).
      appearance: {
        type: String,
        default: 'dark',
        values: ['light', 'dark'],
        aliases: ['type']
      }
    };
  }

  templateContext() {
    return this.createTemplateContext({
      component: this,
      ...this.getPropsContext()
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_2__.renderTooltipTemplate)(this.templateContext());
  }

}

SfTooltip.define('sf-tooltip');
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "6d8735a1253b"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderTooltipTemplate: () => (/* binding */ renderTooltipTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var _component_kbd_js_shortcut__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("151a293c8c90");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);

 // The trigger's shortcut after the words: the kbd component's keys, which it
// draws plain and quiet in a tooltip (C04). The page's shortcut slot wins.

function shortcutTemplate(context) {
  if (context.component?.hasSlotContent?.('shortcut')) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-tooltip-shortcut">${context.component.getSlotContent('shortcut')}</span>`;
  }

  const {
    keys,
    join
  } = (0,_component_kbd_js_shortcut__WEBPACK_IMPORTED_MODULE_1__.shortcutView)(context.shortcut);
  if (!keys.length) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<kbd class="sf-kbd--group sf-tooltip-shortcut">${keys.map((key, at) => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${at && join ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-kbd-join">+</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}<kbd class=${key.square ? 'sf-kbd--square' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>${key.text}</kbd>`)}</kbd>`;
}

function contentTemplate(context) {
  if (context.component?.hasSlotContent?.('content')) {
    return context.component.getSlotContent('content');
  }

  const textContent = context.component?.hasSlotContent?.('text') ? context.component.getSlotContent('text') : context.text;
  const supportingContent = context.component?.hasSlotContent?.('supporting-text') ? context.component.getSlotContent('supporting-text') : context.supportingText;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div class="sf-tooltip-content flex flex-col">
      <div class="sf-tooltip-wrap flex flex-col">
        ${textContent ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-tooltip-text">${textContent}${shortcutTemplate(context)}</div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        ${supportingContent ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-tooltip-supporting-text">${supportingContent}</div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      </div>
    </div>
  `;
}

function tailTemplate(context) {
  if (context.component?.hasSlotContent?.('tail')) {
    return context.component.getSlotContent('tail');
  }

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-tooltip-tail" aria-hidden="true"></div>`;
}

function renderTooltipTemplate(context) {
  const classes = ['sf-tooltip', `sf-tooltip--${context.appearance ?? context.type}`, `sf-tooltip--arrow-${context.arrow}`, `sf-tooltip--size-${context.size}`, 'relative', context.rootClass].filter(Boolean);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div class=${classes.join(' ')} style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
      ${contentTemplate(context)}
      ${tailTemplate(context)}
    </div>
  `;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

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

/***/ "b58689b2b3f6"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-tooltip for the shim (core/js/aliases.js, standard §16 item 20).","component":"sf-tooltip","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"type","to":"appearance","kind":"setting","component":"sf-tooltip","since":"2026-10-27","remove_after":"2026-12-01","section":"the axis\'s old name (contracts/public-api-axes.json)"}]}');

/***/ },

/***/ "9279cc82ea5a"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.tooltip","tag":"sf-tooltip","version":"1.2.0","kind":"leaf","settings":{"appearance":{"type":"enum","values":["light","dark"],"default":"dark"},"size":{"type":"enum","values":["1/3","1/2","1","2","3"],"default":"1/3"},"arrow":{"type":"enum","values":["none","top-center","bottom-center","inline-start","inline-end","bottom-inline-start","bottom-inline-end"],"default":"none"},"text":{"type":"string","default":""},"supporting-text":{"type":"string","default":""},"shortcut":{"type":"string","default":""}},"values":{},"events":{},"actions":{},"css-variables":{"--sf-tooltip-background-color":{"type":"color","state":"default"},"--sf-tooltip-color":{"type":"color","state":"default"},"--sf-tooltip-border-color":{"type":"color","state":"default"},"--sf-tooltip-border-width":{"type":"length","state":"default"},"--sf-tooltip-radius":{"type":"length","state":"default"},"--sf-tooltip-padding-inline":{"type":"length","state":"default"},"--sf-tooltip-padding-block":{"type":"length","state":"default"},"--sf-tooltip-gap":{"type":"length","state":"default"}}}');

/***/ },

/***/ "45e954eb1d84"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Tooltip","runtime":{}}');

/***/ },

/***/ "616513d619d2"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Подсказка","runtime":{}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("0b167a45ab71");
/******/
/******/ })()
;