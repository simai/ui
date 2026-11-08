/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "8dadc8ecc6d6"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("5f040406bc17");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("02dfc60c5026");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("2bfad53665b2");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("7ca134cd1790");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("3e9ace110bb6");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_2__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);






 // sf-button-close from its component.json (standard simai.smart-component 1.3.8 §3,
// §4): the close button of the SIMAI Framework (owner decision C14, 1.2.0). The
// settings are the attributes and properties core/js/element-manifest.js makes
// from the manifest; a value outside an enum reads as its default.
//
// Standalone, the element draws a native <button type="button"> in the icon
// button's box with the cross inside: it takes focus, Enter and Space press
// it, and the page listens to its click. Its name is the host's aria-label,
// else the runtime word close («Закрыть»).
//
// Inside a containing button -- sf-button-icon kind="close", a page's own
// .sf-icon-button -- it stays the decorative cross of 1.1.x: aria-hidden, never
// focusable; the containing button owns the name and the action.

const CloseElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_3__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_5__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_6__
  },
  source: 'ru',
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_4__
}); // A containing button: a native one, a role="button", or the icon button's
// box that a page writes as plain markup.

const CONTAINER = 'button, [role="button"], .sf-icon-button';

class SfClose extends CloseElement {
  // aria-label is the host's (§3.1), not a setting; it is watched so a name
  // changed after the first drawing reaches the button.
  static get observedAttributes() {
    return [...new Set([...super.observedAttributes, 'aria-label'])];
  }

  get isGlyph() {
    return Boolean(this.parentElement?.closest?.(CONTAINER));
  }

  templateContext() {
    const props = this.getPropsContext();
    return this.createTemplateContext({ ...props,
      component: this,
      glyph: this.isGlyph,
      size: this.size,
      appearance: this.appearance,
      scheme: this.scheme,
      radius: this.radius,
      backdrop: this.backdrop,
      disabled: this.disabled,
      label: this.getAttribute('aria-label') || this.sfWord('close'),
      rootClass: this.getRootClass()
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_2__.renderCloseTemplate)(this.templateContext());
  }

  focus(options) {
    const button = this.querySelector(':scope > button.sf-button-close');
    if (button) button.focus(options);
    return this;
  }

}

SfClose.define('sf-button-close');
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "5f040406bc17"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   buttonSize: () => (/* binding */ buttonSize),
/* harmony export */   renderCloseTemplate: () => (/* binding */ renderCloseTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var _default_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("2b70c9e3b752");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);

 // The control ladder of the box (the icon button's sizes). A glyph-only size
// draws a button at the nearest ladder step: 1/4 at 1/3, 4-7 at 3.

const LADDER = new Set(['1/3', '1/2', '1', '2', '3']);
function buttonSize(size) {
  if (LADDER.has(size)) return size;
  return size === '1/4' ? '1/3' : '3';
}

function renderCross(size, rootClass, rootStyle) {
  const classes = ['sf-close', `sf-close--size-${size || '1/3'}`, 'flex', 'justify-center', 'items-center', rootClass].filter(Boolean).join(' ');
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="${classes}" style=${rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} aria-hidden="true"><span class="sf-close-icon"></span></span>`;
} // The close button (owner decision C14): a native button in the icon button's
// box, the cross inside it. Inside a containing button (context.glyph) the
// element draws only the decorative cross, as it did before 1.2.0.


function renderCloseTemplate(context) {
  if (context.glyph) return renderCross(context.size, context.rootClass, context.rootStyle);
  const size = buttonSize(context.size || '1/3');
  const classes = ['sf-icon-button', `sf-icon-button--size-${size}`, 'sf-icon-button--close', 'sf-button-close', `sf-button-close--${context.appearance || 'ghost'}`, `sf-button-close--${context.scheme || 'on-surface'}`, context.backdrop === 'color' ? 'sf-button-close--backdrop-color' : '', context.radius === 'rounded' ? 'sf-button-close--radius-rounded' : '', 'flex', 'items-cross-center', context.rootClass].filter(Boolean).join(' ');
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<button
    type="button"
    class=${classes}
    style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    aria-label=${context.label}
    ?disabled=${context.disabled}
  >${renderCross(size, 'pointer-event-none', '')}</button>`;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "2b70c9e3b752"
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

/***/ "2bfad53665b2"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-button-close for the shim (stands/18-aliases-ci/alias.mjs, standard §16 item 20). mode: same-detail (the shim sends the new and the old name), split / detail-adds (a detail adapter, refused by the shim), attribute-and-property, method, property, manifest-only (the DOM name does not change), host-attribute (no shim), retired.","component":"sf-button-close","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"sf-close","to":"sf-button-close","kind":"tag","component":"sf-button-close","since":"2026-11-03","remove_after":"2027-01-01","section":"rename plan R0 (ui-control RENAME-PLAN-2026-11-03), naming decision 2026-11-02","note":"the element is sf-button-close; sf-close is a subclass defined beside it until the date"}]}');

/***/ },

/***/ "02dfc60c5026"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.button-close","tag":"sf-button-close","version":"1.2.0","kind":"leaf","settings":{"size":{"type":"enum","values":["1/4","1/3","1/2","1","2","3","4","5","6","7"],"default":"1/3"},"appearance":{"type":"enum","values":["ghost","plain","media"],"default":"ghost"},"radius":{"type":"enum","values":["default","rounded"],"default":"default"},"scheme":{"type":"enum","values":["on-surface","on-surface-variant"],"default":"on-surface"},"backdrop":{"type":"enum","values":["surface","color"],"default":"surface"},"disabled":{"type":"boolean","default":false}},"values":{},"events":{},"actions":{},"css-variables":{"--sf-close-color":{"type":"color","state":"default"},"--sf-close-background-color":{"type":"color","state":"default"},"--sf-close-glyph-size":{"type":"length","state":"default"},"--sf-close-padding-inline":{"type":"length","state":"default"},"--sf-close-padding-block":{"type":"length","state":"default"}}}');

/***/ },

/***/ "7ca134cd1790"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Close","runtime":{"close":"Close"}}');

/***/ },

/***/ "3e9ace110bb6"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Закрытие","runtime":{"close":"Закрыть"}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("8dadc8ecc6d6");
/******/
/******/ })()
;