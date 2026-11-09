/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "5eba5005e1c0"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ICONS: () => (/* binding */ ICONS),
/* harmony export */   STATUSES: () => (/* binding */ STATUSES),
/* harmony export */   SfListDescription: () => (/* binding */ SfListDescription),
/* harmony export */   normalizeItems: () => (/* binding */ normalizeItems),
/* harmony export */   valueText: () => (/* binding */ valueText)
/* harmony export */ });
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("dad1e4705d25");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("7c0ab7bd0a28");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("7e7624758b3e");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("4d554d0fe209");
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("a670365322a4");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_2__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
// sf-list-description: facts as label and value rows -- a site summary,
// server facts, a record's header, a job's parameters, licence details:
//
//   <sf-list-description><script type="application/json" data-sf-settings>
//     {"items": [{"label": "Адрес", "value": "demo.test", "href": "https://demo.test/"},
//       {"label": "Корень сайта", "value": "/var/www/demo", "mono": true, "copy": true}]}
//   </script></sf-list-description>
//
// A native dl: the labels in a column of their own as wide as the longest
// one, the values beside them; on a phone (a column narrower than 24rem) each
// label over its value. A value is text: monospace, a link (navigate), copied
// with an sf-button-copy, with a status icon and a hint; an empty one shows
// «—». The list is read-only and stores and loads nothing.
//
// From its component.json (standard simai.smart-component 1.3.14 §3, §4,
// §8): the settings are made by core/js/element-manifest.js, the words are
// the language files'.







const STATUSES = ['success', 'warning', 'error', 'info']; // sf-alert's status icons, by the shared status words.

const ICONS = {
  success: 'check_circle',
  warning: 'warning',
  error: 'error',
  info: 'info'
};

const text = value => value === undefined || value === null ? '' : String(value).trim();
/** A value as the list writes it: text; a list joined with commas; nothing is ''. */


function valueText(value) {
  if (value === undefined || value === null) return '';
  if (Array.isArray(value)) return value.map(valueText).filter(Boolean).join(', ');
  if (typeof value === 'object') return '';
  return String(value).trim();
}
/**
 * The items as given, made safe: an item without a label is left out; the
 * id is the item's, else its place. A status outside the four words is none.
 */

function normalizeItems(value) {
  const list = Array.isArray(value) ? value : [];
  const items = [];
  list.forEach((item, at) => {
    if (!item || typeof item !== 'object') return;
    const label = text(item.label);
    if (!label) return;
    const shown = valueText(item.value);
    const status = text(item.status).toLowerCase();
    items.push({
      id: text(item.id) || String(at),
      label,
      value: shown,
      empty: shown === '',
      hint: text(item.hint),
      mono: item.mono === true,
      copy: item.copy === true && shown !== '',
      href: shown === '' ? '' : text(item.href),
      status: STATUSES.includes(status) ? status : ''
    });
  });
  return items;
}
const ListDescriptionElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_3__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_4__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_5__
  },
  source: 'ru'
});

class SfListDescription extends ListDescriptionElement {
  get list() {
    return normalizeItems(this.items);
  } // A value link: the request first; not cancelled, the browser follows it.


  onNavigate(event, item) {
    if (event.defaultPrevented || event.button > 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const allowed = this.sfEmit('navigate', {
      id: item.id,
      href: item.href
    }, {
      cancelable: true
    });
    if (!allowed) event.preventDefault();
  }

  templateContext() {
    const list = this.list;
    this.sfHostState('data-empty', list.length === 0);
    return this.createTemplateContext({ ...this.getPropsContext(),
      component: this,
      size: ['1/2', '1', '2'].includes(this.size) ? this.size : '1',
      layout: ['columns', 'stacked'].includes(this.layout) ? this.layout : 'auto',
      overflow: this.overflow === 'truncate' ? 'truncate' : 'wrap',
      dividers: Boolean(this.dividers),
      label: this.label,
      list: list.map(item => ({ ...item,
        statusWord: item.status ? this.sfWord(`status-${item.status}`) : '',
        copyLabel: item.copy ? this.sfWord('copy', {
          vars: {
            label: item.label
          }
        }) : ''
      })),
      emptyText: this.emptyText,
      icons: ICONS,
      rootClass: this.getRootClass()
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_2__.renderListDescriptionTemplate)(this.templateContext());
  }

}

SfListDescription.define('sf-list-description');

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "dad1e4705d25"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderListDescriptionTemplate: () => (/* binding */ renderListDescriptionTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
 // sf-list-description's markup (scss/ draws it on one rung of the ladder).
//
// - The root holds a native dl; each row is a div with one dt (the label)
//   and one dd (the value), so the rows can carry dividers and share one
//   grid.
// - A value is text: a link (href), monospace (mono), cut to one line
//   (overflow truncate, then focusable with its whole text as title), or
//   empty-text when there is none. A status icon stands before it, its word
//   visually hidden; a copy button after it; a hint under it.
// - With no items: nothing at all.
// The rung below the list's: the hint, a stacked label, the copy button.

const BELOW = {
  '1/2': '1/3',
  1: '1/2',
  2: '1'
};
const SIZE_CLASS = {
  '1/2': 'half',
  1: '1',
  2: '2'
};

function shown(context, item) {
  const {
    component,
    overflow
  } = context;
  const classes = ['sf-list-description-text', item.mono ? 'sf-list-description-text--mono' : ''].filter(Boolean).join(' ');
  const cut = overflow === 'truncate';
  if (item.empty) return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-list-description-text sf-list-description-empty">${context.emptyText}</span>`;

  if (item.href) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<a class=${`${classes} sf-list-description-link`} href=${item.href} title=${cut ? item.value : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      @click=${event => component.onNavigate(event, item)}>${item.value}</a>`;
  }

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class=${classes} tabindex=${cut ? '0' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing} title=${cut ? item.value : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>${item.value}</span>`;
}

function row(context, item) {
  const {
    size,
    icons
  } = context;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-list-description-row" data-id=${item.id} data-status=${item.status || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
    <dt class="sf-list-description-label">${item.label}</dt>
    <dd class="sf-list-description-value">
      <span class="sf-list-description-line">
        ${item.status ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class=${`sf-icon sf-list-description-icon sf-list-description-icon--${item.status}`} aria-hidden="true">${icons[item.status]}</i><span class="sr-only">${item.statusWord}: </span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        ${shown(context, item)}
        ${item.copy ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button-copy class="sf-list-description-copy" size=${BELOW[size]} appearance="ghost"
          value=${item.value} label=${item.copyLabel}></sf-button-copy>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      </span>
      ${item.hint ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-list-description-hint">${item.hint}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    </dd>
  </div>`;
}

function renderListDescriptionTemplate(context) {
  const {
    size,
    layout,
    overflow,
    dividers,
    list
  } = context;
  if (!list.length) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const classes = ['sf-list-description', `sf-list-description--size-${SIZE_CLASS[size] ?? '1'}`, `sf-list-description--layout-${layout}`, overflow === 'truncate' ? 'sf-list-description--truncate' : '', dividers ? 'sf-list-description--dividers' : '', context.rootClass].filter(Boolean).join(' '); // Named (label) it is a group of that name; the dl inside keeps its own role.

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class=${classes} style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} role=${context.label ? 'group' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing} aria-label=${context.label || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
    <dl class="sf-list-description-list">${list.map(item => row(context, item))}</dl>
  </div>`;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "a670365322a4"
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

/***/ "7c0ab7bd0a28"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.list-description","tag":"sf-list-description","version":"1.0.3","kind":"leaf","settings":{"items":{"type":"list","schema":{"items":{"type":"object","properties":{"id":{"type":"string"},"label":{"type":"string"},"value":{"type":"string"},"hint":{"type":"string"},"mono":{"type":"boolean"},"copy":{"type":"boolean"},"href":{"type":"string"},"status":{"type":"string","enum":["neutral","success","warning","error","info"]}},"required":["label"]}},"default":[]},"label":{"type":"string","default":""},"size":{"type":"enum","values":["1/2","1","2"],"default":"1"},"layout":{"type":"enum","values":["auto","columns","stacked"],"default":"auto"},"dividers":{"type":"boolean","default":false},"overflow":{"type":"enum","values":["wrap","truncate"],"default":"wrap"},"empty-text":{"type":"string","default-from":"runtime.empty-text"}},"values":{},"events":{"navigate":{"carries":{"id":"string","href":"string"},"cancelable":true}},"actions":{},"host-states":{"data-empty":"boolean"},"css-variables":{"--sf-list-description-label-color":{"type":"color","state":"default"},"--sf-list-description-value-color":{"type":"color","state":"default"},"--sf-list-description-divider-color":{"type":"color","state":"default"},"--sf-list-description-label-width":{"type":"length","state":"default"},"--sf-list-description-gap":{"type":"length","state":"default"},"--sf-list-description-padding-inline":{"type":"length","state":"default"}}}');

/***/ },

/***/ "7e7624758b3e"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Description list","runtime":{"empty-text":"—","copy":"Copy: {label}","status-success":"OK","status-warning":"Warning","status-error":"Error","status-info":"Info"},"events":{"navigate":{"label":"Go"}}}');

/***/ },

/***/ "4d554d0fe209"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Список сведений","runtime":{"empty-text":"—","copy":"Скопировать: {label}","status-success":"В порядке","status-warning":"Предупреждение","status-error":"Ошибка","status-info":"Сведения"},"events":{"navigate":{"label":"Перейти"}}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("5eba5005e1c0");
/******/
/******/ })()
;