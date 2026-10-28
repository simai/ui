/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "53e2b85553b5"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   showChunk: () => (/* binding */ showChunk)
/* harmony export */ });
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("bba1a166d803");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("084d7e69277d");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("4c5d825d13eb");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("504c972b8143");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_2__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);





 // sf-progress-ring from its component.json (standard simai.smart-component
// 1.3.11 §3, §4; the 1.4 folder of five authored files): its settings are
// attributes and properties made by core/js/element-manifest.js, and a job's
// part arrives as the stream fact chunk {done, total} (vocabulary 1.1.5 §5.2),
// which a rule hands to the action chunk, as on sf-progress-bar. The drawing
// is the class component progress-ring's: the value is a custom property on
// the root, the ring carries the role, the slot content stands beside it.

const ProgressRingElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_3__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_4__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_5__
  },
  source: 'ru',
  actions: {
    chunk({
      done,
      total
    } = {}) {
      return showChunk(this, done, total);
    }

  }
}); // A part of a job as a percentage of the ring: done of total (100 when the
// rule gives none), clamped to 0..100 (vocabulary §5.2).

function showChunk(element, done, total) {
  const whole = total === undefined || total === null || total === '' ? 100 : Number(total);
  const part = Number(done);

  if (!Number.isFinite(part) || !Number.isFinite(whole) || whole <= 0) {
    return {
      outcome: 'refused',
      reason: 'invalid'
    };
  }

  const percent = Math.max(0, Math.min(100, part / whole * 100));
  element.value = Math.round(percent * 100) / 100;
  return {
    outcome: 'applied'
  };
}

class SfProgressRing extends ProgressRingElement {
  // The accessible name: label, else the host's aria-label (§3.1, §4.8).
  get accessibleLabel() {
    return this.label || this.getAttribute('aria-label') || '';
  }

  static get observedAttributes() {
    return [...new Set([...super.observedAttributes, 'aria-label'])];
  }

  templateContext() {
    return this.createTemplateContext({ ...this.getPropsContext(),
      label: this.accessibleLabel,
      content: this.hasSlotContent?.('content') ? this.getSlotContent('content') : null,
      rootClass: this.getRootClass(),
      component: this
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_2__.renderProgressRingTemplate)(this.templateContext());
  }

}

SfProgressRing.define('sf-progress-ring');
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "bba1a166d803"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   normalizeValue: () => (/* binding */ normalizeValue),
/* harmony export */   renderProgressRingTemplate: () => (/* binding */ renderProgressRingTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);

const SIZES = ['1/2', '1', '2'];
const STATUSES = ['neutral', 'info', 'success', 'warning', 'error']; // A number from 0 to 100; anything else reads 0.

function normalizeValue(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 0;
  return Math.max(0, Math.min(100, parsed));
}

const on = value => value === true || value === '' || value === 'true'; // The class markup of the ring (src/component/progress-ring): the root holds
// the value as --sf-progress-ring--value, the ring (.sf-progress-ring-indicator)
// carries the role and the value, and the middle holds the slot content or the
// percentage, which is aria-hidden: the ring says the value once.


function renderProgressRingTemplate(context) {
  const size = SIZES.includes(String(context.size)) ? String(context.size) : '1';
  const status = STATUSES.includes(String(context.status)) ? String(context.status) : 'neutral';
  const indeterminate = on(context.indeterminate);
  const meter = on(context.meter);
  const value = normalizeValue(context.value);
  const role = meter ? 'meter' : 'progressbar'; // A meter always has a value; only a progressbar can be indeterminate.

  const unknown = indeterminate && !meter;
  const text = on(context.showText) && !unknown ? `${value}%` : '';
  const content = context.content && context.content !== lit__WEBPACK_IMPORTED_MODULE_0__.nothing ? context.content : null;
  const rootClasses = ['sf-progress-ring', `sf-progress-ring--size-${size}`, status === 'neutral' ? '' : `sf-progress-ring--${status}`, unknown ? 'sf-progress-ring--indeterminate' : '', context.rootClass].filter(Boolean).join(' ');
  const style = [`--sf-progress-ring--value: ${unknown ? 0 : value}`, context.rootStyle].filter(Boolean).join('; ');
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div class=${rootClasses} style=${style} data-value=${String(value)} data-status=${status}>
      <span
        class="sf-progress-ring-indicator"
        role=${role}
        aria-label=${context.label || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow=${unknown ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : String(value)}
        aria-valuetext=${unknown ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : context.valueText || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      ></span>
      ${content ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-progress-ring-content">${content}</span>` : text ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-progress-ring-content" aria-hidden="true">${text}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
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

/***/ "084d7e69277d"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.progress-ring","tag":"sf-progress-ring","version":"1.0.0","kind":"leaf","settings":{"size":{"type":"enum","values":["1/2","1","2"],"default":"1"},"value":{"type":"number","default":0,"min":0,"max":100},"status":{"type":"enum","values":["neutral","info","success","warning","error"],"default":"neutral"},"indeterminate":{"type":"boolean","default":false},"meter":{"type":"boolean","default":false},"show-text":{"type":"boolean","default":false},"label":{"type":"string","default":""},"value-text":{"type":"string","default":""}},"values":{},"events":{},"actions":{"chunk":{"with":{"done":"number","total":"number"}}},"css-variables":{"--sf-progress-ring-size":{"type":"length","state":"default"},"--sf-progress-ring-line-width":{"type":"length","state":"default"},"--sf-progress-ring-gap":{"type":"length","state":"default"},"--sf-progress-ring-fill-color":{"type":"color","state":"default"},"--sf-progress-ring-track-color":{"type":"color","state":"default"},"--sf-progress-ring-color":{"type":"color","state":"default"}}}');

/***/ },

/***/ "4c5d825d13eb"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Progress Ring"}');

/***/ },

/***/ "504c972b8143"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Кольцо прогресса"}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("53e2b85553b5");
/******/
/******/ })()
;