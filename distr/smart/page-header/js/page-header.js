/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "1e65420b829c"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SfPageHeader: () => (/* binding */ SfPageHeader)
/* harmony export */ });
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("b48790dff911");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("2ef427ceec5b");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("d046b3e92e88");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("0cc5550f5b57");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("1337117fe765");
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("0771494c53f9");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_2__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
// The head of an admin page: where the page is, what it is called, how many
// records it holds, whether it is a favourite, and its main action. The admin's
// top bar is gone (larena-specs frontend-interface-program, sf-admin-menu
// assignment, v5, section 6), so this is the only place a page says these
// things -- and it is a shared part because every admin page, Docara's
// included, says the same four.
//
// The host owns everything in it. The path, the start of the line on a phone
// and the actions are the host's own markup in slots; the heading, the count
// and whether the page is shared by every site are attributes. The star is the
// one control the header draws itself, and pressing it is a request the host
// answers: sf-page-header-toggle {on} is cancelable, and a host that wants to
// wait for its own answer cancels it and sets `star` when it knows.
//
// From its component.json (standard simai.smart-component 1.3.8 §3, §4, §8):
// the settings are made by core/js/element-manifest.js, the words are the
// language files', and the old sf-page-header-star follows the toggle as a
// dated alias (aliases.json).








const PageHeaderElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_3__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_5__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_6__
  },
  source: 'ru',
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_4__
});

class SfPageHeader extends PageHeaderElement {
  // star is optional (§4.2): absent draws no star, so it reads undefined
  // rather than the boolean's false.
  get star() {
    return this.hasAttribute('star') ? super.star : undefined;
  }

  set star(value) {
    if (value === undefined || value === null) this.removeAttribute('star');else this.setAttribute('star', value ? 'true' : 'false');
  } // The template's press: the request toggle {on}; not cancelled, the header
  // writes the star itself.


  toggleStar() {
    const on = this.star !== true;
    if (this.sfEmit('toggle', {
      on
    }, {
      cancelable: true
    })) this.star = on;
  }

  templateContext() {
    return this.createTemplateContext({ ...this.getPropsContext(),
      component: this,
      heading: this.heading,
      count: this.count,
      level: this.level,
      star: this.star,
      rootClass: this.getRootClass(),
      text: key => this.sfWord(key),
      hostSlot: name => this.getSlotContent(name),
      hasHostSlot: name => this.hasSlotContent(name)
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_2__.renderPageHeaderTemplate)(this.templateContext());
  }

}

SfPageHeader.define('sf-page-header');

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "b48790dff911"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderPageHeaderTemplate: () => (/* binding */ renderPageHeaderTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
 // Framework utilities and the header's own sheet (scss/: the gaps and colours
// are its public variables): a column for the path above the line, and a line
// holding the heading, its count, the install mark and the star, then the
// actions pushed to the end. The heading is the fourth heading step, the size
// the admin pages have always titled themselves at.

function renderPageHeaderTemplate(context) {
  const {
    component,
    heading,
    count,
    level,
    star,
    text,
    hostSlot,
    hasHostSlot,
    rootClass
  } = context;
  const classes = ['sf-page-header', 'flex', 'flex-col', 'min-w-0', rootClass].filter(Boolean).join(' ');
  const on = star === true;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<header class=${classes} style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
    ${hasHostSlot('path') ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-page-header-path flex items-cross-center min-w-0">${hostSlot('path')}</div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    <div class="sf-page-header-line flex items-cross-center flex-wrap min-w-0">
      ${hasHostSlot('start') ? hostSlot('start') : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      <h1 class="sf-page-header-heading sf-h-4 m-0 min-w-0 truncate">${heading}</h1>
      ${count !== '' && count !== null && count !== undefined ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-badge appearance="tonal" scheme="neutral" size="1/2" text=${String(count)}></sf-badge>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      ${level === 'install' ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-badge appearance="outline" scheme="tertiary" size="1/2" text=${text('all-sites')}></sf-badge>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      ${star === true || star === false ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-icon-button size="1/2" appearance="ghost" scheme="on-surface"
            class=${on ? 'sf-page-header-star sf-page-header-star--on' : 'sf-page-header-star'}
            icon="star"
            ?filled=${on}
            aria-pressed=${String(on)}
            aria-label=${on ? text('unstar') : text('star')}
            title=${on ? text('unstar') : text('star')}
            @click=${() => component.toggleStar()}></sf-icon-button>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      <span class="grow"></span>
      ${hasHostSlot('actions') ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-page-header-actions flex items-cross-center">${hostSlot('actions')}</div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    </div>
  </header>`;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "0771494c53f9"
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

/***/ "d046b3e92e88"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-page-header for the shim (stands/18-aliases-ci/alias.mjs, standard §16 item 20). mode: same-detail (the shim sends the new and the old name), split / detail-adds (a detail adapter, refused by the shim), attribute-and-property, method, property, manifest-only (the DOM name does not change), host-attribute (no shim), retired.","component":"sf-page-header","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"sf-page-header-star","to":"sf-page-header-toggle","kind":"event","component":"sf-page-header","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","cancelable":true,"manifest":{"from":"sf-page-header-star","to":"toggle"},"section":"§8, vocabulary 1.1.5 §5 toggle; stand 24"}]}');

/***/ },

/***/ "2ef427ceec5b"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.page-header","tag":"sf-page-header","version":"1.1.5","kind":"leaf","settings":{"heading":{"type":"string","default":""},"count":{"type":"string","default":""},"level":{"type":"enum","values":["site","install"],"default":"site"},"star":{"type":"boolean","optional":true}},"values":{},"events":{"toggle":{"carries":{"on":"boolean"},"cancelable":true}},"actions":{},"css-variables":{"--sf-page-header-gap":{"type":"length","state":"default"},"--sf-page-header-line-gap":{"type":"length","state":"default"},"--sf-page-header-actions-gap":{"type":"length","state":"default"},"--sf-page-header-heading-color":{"type":"color","state":"default"},"--sf-page-header-star-color":{"type":"color","state":"on"}}}');

/***/ },

/***/ "0cc5550f5b57"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Page header","runtime":{"all-sites":"for all sites","star":"Add to favourites","unstar":"Remove from favourites"}}');

/***/ },

/***/ "1337117fe765"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Шапка страницы","runtime":{"all-sites":"для всех сайтов","star":"В избранное","unstar":"Убрать из избранного"}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("1e65420b829c");
/******/
/******/ })()
;