/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "622ad16beac8"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LONG: () => (/* binding */ LONG),
/* harmony export */   SfChange: () => (/* binding */ SfChange),
/* harmony export */   isLong: () => (/* binding */ isLong),
/* harmony export */   normalizeChanges: () => (/* binding */ normalizeChanges),
/* harmony export */   valueText: () => (/* binding */ valueText)
/* harmony export */ });
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("32f2d60c5165");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("ad38f797cd15");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("b99c8b8e2c4b");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("2484a115f83a");
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("1c518e38db07");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_2__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
// sf-change: a field's change as text (owner decision C40, 2026-11-09):
//
//   <sf-change label="Статус" before="Собран" after="Передан в доставку"></sf-change>
//   <sf-change layout="list" changes='[{"label":"Вес","before":"4,2 кг","after":"4,6 кг"}]'></sf-change>
//
// The old value quiet, an arrow, the new value in the text colour and medium
// weight; no badges and no strikethrough. inline sits in a sentence; list is
// a description list of the fields of one update; a long value in a sentence
// is revealed in place behind «Показать изменения». An empty value reads
// «пусто». sf-confirm-change draws its list with it.
//
// From its component.json (standard simai.smart-component 1.3.15 §3, §4,
// §8): the settings are made by core/js/element-manifest.js, the words are
// the language files'.






 // A value longer than this (in graphemes, roughly characters) is not put in a sentence.

const LONG = 80; // The reveal's ids, one per element on the page (stable across renders).

let sequence = 0;
/** A value as text: null, undefined and '' are empty (null); a number is its text. */

function valueText(value) {
  if (value === null || value === undefined) return null;
  const text = typeof value === 'object' ? '' : String(value);
  return text.trim() === '' ? null : text;
}
/** The changes made safe: {label, before, after} each, the values as text or null. */

function normalizeChanges(value) {
  let list = value;

  if (typeof list === 'string') {
    try {
      list = JSON.parse(list);
    } catch {
      list = [];
    }
  }

  if (!Array.isArray(list)) return [];
  return list.filter(item => item && typeof item === 'object').map(item => ({
    label: valueText(item.label) ?? '',
    before: valueText(item.before),
    after: valueText(item.after)
  }));
}
/** Whether a value is too long to stand in a sentence. */

function isLong(text) {
  return text !== null && Array.from(text).length > LONG;
}
const ChangeElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_3__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_4__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_5__
  },
  source: 'ru'
});

class SfChange extends ChangeElement {
  static get observedAttributes() {
    return [...new Set([...(super.observedAttributes || []), 'changes'])];
  }

  constructor() {
    super();
    this._uid = `sf-change-${++sequence}`;
    this._revealed = false;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback?.(name, oldValue, newValue);
    if (name === 'changes' && oldValue !== newValue) this.requestComponentUpdate('changes');
  } // The list: the property, else the changes attribute (JSON in markup).


  get list() {
    const given = normalizeChanges(this.changes);
    if (given.length) return given;
    return this.hasAttribute('changes') ? normalizeChanges(this.getAttribute('changes')) : [];
  } // The one pair of layout inline: before and after, else the first change.
  // before and after are the browser's own ChildNode methods (§3.1: the
  // manifest leaves them the browser's), so the settings are read from the
  // attributes through the base, never as this.before / this.after.


  get pair() {
    const before = valueText(this.getProp('before'));
    const after = valueText(this.getProp('after'));
    if (before !== null || after !== null || !this.list.length) return {
      label: valueText(this.label) ?? '',
      before,
      after
    };
    const first = this.list[0];
    return { ...first,
      label: valueText(this.label) ?? first.label
    };
  }

  get revealed() {
    return this._revealed;
  }

  toggleReveal(open = !this._revealed) {
    this._revealed = Boolean(open);
    this.requestComponentUpdate('reveal');
  }

  templateContext() {
    const layout = this.layout === 'list' ? 'list' : 'inline';
    const changes = layout === 'list' ? this.list : [this.pair];
    const pair = changes[0] ?? {
      label: '',
      before: null,
      after: null
    };
    const folded = layout === 'inline' && this.reveal !== 'none' && (isLong(pair.before) || isLong(pair.after)); // Nothing to say: no change in the list, or a pair with neither value.

    const empty = layout === 'list' ? !changes.length : pair.before === null && pair.after === null;
    this.sfHostState('data-empty', empty);
    this.sfHostState('data-block', layout === 'list' || folded);
    this.sfHostState('data-revealed', folded && this._revealed);
    return this.createTemplateContext({ ...this.getPropsContext(),
      component: this,
      layout,
      // rows, not changes: the changes prop keeps its own value ([]) in the context.
      rows: changes,
      pair,
      empty,
      folded,
      revealed: folded && this._revealed,
      showLabel: Boolean(this.showLabel),
      blocksId: `${this._uid}-blocks`,
      words: {
        empty: this.sfWord('empty-text'),
        to: this.sfWord('to-text'),
        separator: this.sfWord('label-separator'),
        show: this.sfWord('show-text'),
        hide: this.sfWord('hide-text'),
        before: this.sfWord('before-text'),
        after: this.sfWord('after-text')
      },
      rootClass: this.getRootClass()
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_2__.renderChangeTemplate)(this.templateContext());
  }

}

SfChange.define('sf-change');

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "32f2d60c5165"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   WHOLE_VALUE_MAX: () => (/* binding */ WHOLE_VALUE_MAX),
/* harmony export */   renderChangeTemplate: () => (/* binding */ renderChangeTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
 // sf-change's markup (scss/ draws it).
//
// - inline: [label: ] old value, then the arrow glued to the start of the new
//   value; the values wrap. The arrow is a picture; a visually hidden
//   word between the values says the change to a screen reader.
// - list: a dl, a term (the label) and a description (the pair) per change.
// - folded (a long value in a sentence): the button «Показать изменения»
//   (aria-expanded, aria-controls) and, revealed, the two values as blocks
//   labelled «Было» and «Стало».
// An empty value is the word «пусто».
// A short value -- a number and its unit, a phone number, a name -- stays
// whole on one line (it reads wrong broken: «4,6 / кг»); only a longer one
// wraps (dispatcher decision, C40 follow-up 2026-11-11). Whole is made by the
// text, not by nowrap: its spaces become no-break spaces and a word joiner
// (U+2060, zero width, not read aloud) follows each hyphen and dash, so the
// value stays on one line where it fits and still wraps (overflow-wrap
// anywhere) where its frame is narrower than the value -- never past the
// frame, and the arrow stays glued to the new value. A value is trimmed, so
// a padded value draws no leading gap.

const WHOLE_VALUE_MAX = 20;

const whole = text => [...text].length <= WHOLE_VALUE_MAX;

const unbroken = text => text.replace(/ /gu, '\u00a0').replace(/([-\u2010\u2013])/gu, '$1\u2060');

const value = (context, text, part) => {
  if (text === null) return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class=${`sf-change__${part} sf-change__empty`}>${context.words.empty}</span>`;
  const shown = String(text).trim();
  return whole(shown) ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class=${`sf-change__${part} sf-change__whole`}>${unbroken(shown)}</span>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class=${`sf-change__${part}`}>${shown}</span>`;
}; // The arrow and the new value are joined by a no-break space (the hidden word
// is out of flow and makes no break), so the arrow never ends a line alone;
// both values wrap like any text.


const pair = (context, change) => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${value(context, change.before, 'before')}<span class="sf-change__pair"> <span
  class="sf-change__arrow" aria-hidden="true">→</span><span class="sr-only"> ${context.words.to}</span>\u00a0${value(context, change.after, 'after')}</span>`;

const label = (context, change) => context.showLabel && change.label ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-change__label">${change.label}${context.words.separator} </span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;

function folded(context) {
  const {
    pair: change,
    revealed,
    blocksId,
    words,
    component
  } = context;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class=${['sf-change', 'sf-change--folded', revealed ? 'sf-change--revealed' : '', context.rootClass].filter(Boolean).join(' ')}>
    ${label(context, change)}<button type="button" class="sf-change__toggle" aria-expanded=${revealed ? 'true' : 'false'}
      aria-controls=${blocksId} @click=${() => component.toggleReveal()}><span>${revealed ? words.hide : words.show}</span><sf-icon
      class="sf-change__toggle-icon" icon=${revealed ? 'expand_less' : 'expand_more'} aria-hidden="true"></sf-icon></button>
    <span class="sf-change__blocks" id=${blocksId} ?hidden=${!revealed}>
      <span class="sf-change__block sf-change__block--before"><span class="sf-change__block-label">${words.before}</span>${change.before ?? words.empty}</span>
      <span class="sf-change__block sf-change__block--after"><span class="sf-change__block-label">${words.after}</span>${change.after ?? words.empty}</span>
    </span>
  </span>`;
}

function renderChangeTemplate(context) {
  if (context.empty) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;

  if (context.layout === 'list') {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<dl class=${['sf-change', 'sf-change--list', context.rootClass].filter(Boolean).join(' ')}>
      ${context.rows.map(change => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-change__row"><dt class="sf-change__term">${change.label}</dt><dd
        class="sf-change__value">${pair(context, change)}</dd></div>`)}
    </dl>`;
  }

  if (context.folded) return folded(context);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class=${['sf-change', 'sf-change--inline', context.rootClass].filter(Boolean).join(' ')}>${label(context, context.pair)}${pair(context, context.pair)}</span>`;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "1c518e38db07"
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

/***/ "ad38f797cd15"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.change","tag":"sf-change","version":"1.0.1","kind":"leaf","settings":{"before":{"type":"string","default":""},"after":{"type":"string","default":""},"label":{"type":"string","default":""},"show-label":{"type":"boolean","default":false},"changes":{"type":"list","schema":{"items":{"type":"object","properties":{"label":{"type":"string"},"before":{"type":"string"},"after":{"type":"string"}},"required":["label"]}},"default":[]},"layout":{"type":"enum","values":["inline","list"],"default":"inline"},"reveal":{"type":"enum","values":["auto","none"],"default":"auto"}},"values":{},"events":{},"actions":{},"host-states":{"data-empty":"boolean","data-block":"boolean","data-revealed":"boolean"},"css-variables":{"--sf-change-before-color":{"type":"color","state":"default"},"--sf-change-after-color":{"type":"color","state":"default"},"--sf-change-after-weight":{"type":"keyword","state":"default"},"--sf-change-arrow-color":{"type":"color","state":"default"},"--sf-change-label-color":{"type":"color","state":"default"},"--sf-change-column-gap":{"type":"length","state":"default"}}}');

/***/ },

/***/ "b99c8b8e2c4b"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Change","runtime":{"empty-text":"empty","to-text":"to","label-separator":":","show-text":"Show changes","hide-text":"Hide changes","before-text":"Before","after-text":"After"}}');

/***/ },

/***/ "2484a115f83a"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Изменение","runtime":{"empty-text":"пусто","to-text":"на","label-separator":":","show-text":"Показать изменения","hide-text":"Скрыть изменения","before-text":"Было","after-text":"Стало"}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("622ad16beac8");
/******/
/******/ })()
;