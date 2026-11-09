/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "d72a94301527"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ICONS: () => (/* binding */ ICONS),
/* harmony export */   STATUSES: () => (/* binding */ STATUSES),
/* harmony export */   SfListAttention: () => (/* binding */ SfListAttention),
/* harmony export */   normalizeItems: () => (/* binding */ normalizeItems),
/* harmony export */   statusOf: () => (/* binding */ statusOf)
/* harmony export */ });
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("a18165be158e");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("565cca359e31");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("3c901318836b");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("9a754872f29c");
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("2011d1065c58");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_2__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
// sf-list-attention: the problems that need a person, on an overview screen --
// server health, site checks, import errors, update readiness, a form's
// validation summary:
//
//   <sf-list-attention><script type="application/json" data-sf-settings>
//     {"items": [{"id": "cert", "status": "warning", "title": "…",
//       "text": "…", "action": {"label": "Продлить", "href": "/ssl/"}}]}
//   </script></sf-list-attention>
//
// The items are ordered error, warning, info, success, the host's order
// inside a status; the heading shows their count. With none the list draws
// nothing (empty none) or one quiet line (empty line), never an empty card.
// An action with href is a link and asks navigate; one with event is a
// button and sends apply. The list stores and loads nothing.
//
// From its component.json (standard simai.smart-component 1.3.14 §3, §4,
// §8): the settings are made by core/js/element-manifest.js, the words are
// the language files'.






 // The heading's id, one per list on the page (stable across renders).

let sequence = 0;
const STATUSES = ['error', 'warning', 'info', 'success'];
const RANK = {
  error: 0,
  warning: 1,
  info: 2,
  success: 3
}; // sf-alert's status icons, by the shared status words.

const ICONS = {
  error: 'error',
  warning: 'warning',
  info: 'info',
  success: 'check_circle'
};

const text = value => value === undefined || value === null ? '' : String(value).trim();
/** An item's status: the four words; danger is read as error, anything else as info. */


function statusOf(value) {
  const word = text(value).toLowerCase();
  if (word === 'danger') return 'error';
  return STATUSES.includes(word) ? word : 'info';
}
/**
 * The items as given, made safe and ordered by severity; inside a status the
 * host's order. An item without an id or a title, or with an id seen before,
 * is left out. An action needs a label and an href or an event.
 */

function normalizeItems(value) {
  const list = Array.isArray(value) ? value : [];
  const seen = new Set();
  const items = [];
  list.forEach((item, order) => {
    if (!item || typeof item !== 'object') return;
    const id = text(item.id);
    const title = text(item.title);
    if (!id || !title || seen.has(id)) return;
    seen.add(id);
    const given = item.action && typeof item.action === 'object' ? item.action : null;
    const label = text(given?.label);
    const href = text(given?.href);
    const event = text(given?.event);
    items.push({
      id,
      status: statusOf(item.status),
      title,
      text: text(item.text),
      action: label && (href || event) ? {
        label,
        href,
        event
      } : null,
      order
    });
  });
  return items.sort((a, b) => RANK[a.status] - RANK[b.status] || a.order - b.order);
}
const ListAttentionElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_3__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_4__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_5__
  },
  source: 'ru'
});

class SfListAttention extends ListAttentionElement {
  constructor() {
    super();
    this._headingId = `sf-list-attention-heading-${++sequence}`;
  }

  get list() {
    return normalizeItems(this.items);
  } // An action link: the request first; not cancelled, the browser follows it.


  onNavigate(event, item) {
    if (event.defaultPrevented || event.button > 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const allowed = this.sfEmit('navigate', {
      id: item.id,
      status: item.status,
      href: item.action?.href ?? ''
    }, {
      cancelable: true
    });
    if (!allowed) event.preventDefault();
  } // An action button: the fact; the host does it.


  onApply(item) {
    this.sfEmit('apply', {
      action: item.action?.event ?? '',
      scope: 'entry',
      ids: [item.id],
      id: item.id,
      status: item.status
    });
  }

  templateContext() {
    const list = this.list;
    const count = list.length;
    const status = list[0]?.status ?? '';
    const level = Math.min(6, Math.max(2, Math.trunc(Number(this.headingLevel)) || 3));
    this.sfHostState('data-status', status);
    this.sfHostState('data-empty', count === 0);
    return this.createTemplateContext({ ...this.getPropsContext(),
      component: this,
      size: this.size === '1/2' ? '1/2' : '1',
      label: this.label,
      level,
      headingId: this._headingId,
      list: list.map(item => ({ ...item,
        statusWord: this.sfWord(`status-${item.status}`)
      })),
      count,
      status,
      empty: this.empty === 'line' ? 'line' : 'none',
      emptyText: this.emptyText,
      icons: ICONS,
      countText: this.sfWord('count', {
        vars: {
          count
        }
      }),
      rootClass: this.getRootClass()
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_2__.renderListAttentionTemplate)(this.templateContext());
  }

}

SfListAttention.define('sf-list-attention');

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "a18165be158e"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderListAttentionTemplate: () => (/* binding */ renderListAttentionTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
 // sf-list-attention's markup (scss/ draws it on one rung of the ladder).
//
// - The root is a section (role region) named by its heading; the heading is
//   role heading at heading-level, with the count as an sf-badge of the most
//   serious status.
// - The items are a list. Each says its status in words before its title
//   (visually hidden; the icon is a picture), then the title, the text, and
//   its one action: an sf-button link (href) or button (event).
// - With no items: nothing at all (empty none) or one
//   quiet line (empty line).
// The rung below the list's: the texts and the action.

const BELOW = {
  '1/2': '1/3',
  1: '1/2'
};

const icon = (name, extra = '') => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class=${['sf-icon', 'sf-list-attention-icon', extra].filter(Boolean).join(' ')} aria-hidden="true">${name}</i>`;

function action(context, item) {
  if (!item.action) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const {
    component,
    size
  } = context;

  if (item.action.href) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button class="sf-list-attention-action" size=${BELOW[size]} appearance="outline"
      text=${item.action.label} href=${item.action.href}
      @click=${event => component.onNavigate(event, item)}></sf-button>`;
  }

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button class="sf-list-attention-action" size=${BELOW[size]} appearance="outline"
    text=${item.action.label} @click=${() => component.onApply(item)}></sf-button>`;
}

function row(context, item) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<li class="sf-list-attention-item" data-status=${item.status} data-id=${item.id}>
    ${icon(context.icons[item.status], `sf-list-attention-icon--${item.status}`)}
    <div class="sf-list-attention-text">
      <span class="sf-list-attention-title"><span class="sr-only">${item.statusWord}: </span>${item.title}</span>
      ${item.text ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-list-attention-supporting">${item.text}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    </div>
    ${action(context, item)}
  </li>`;
}

function renderListAttentionTemplate(context) {
  const {
    count,
    size,
    status,
    empty,
    label,
    level,
    headingId
  } = context;
  const classes = ['sf-list-attention', `sf-list-attention--size-${size === '1/2' ? 'half' : '1'}`, count === 0 ? 'sf-list-attention--empty' : '', context.rootClass].filter(Boolean).join(' ');

  if (count === 0) {
    if (empty !== 'line') return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class=${classes} style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
      <p class="sf-list-attention-quiet">${icon('check_circle', 'sf-list-attention-icon--success')}<span>${context.emptyText}</span></p>
    </div>`;
  }

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<section class=${classes} style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} aria-labelledby=${headingId}>
    <div class="sf-list-attention-heading" role="heading" aria-level=${String(level)} id=${headingId}>
      <span class="sf-list-attention-heading-text">${label}</span>
      <sf-badge class="sf-list-attention-count" size=${BELOW[size]} appearance="tonal" status=${status || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        text=${context.countText}></sf-badge>
    </div>
    <ul class="sf-list-attention-list">${context.list.map(item => row(context, item))}</ul>
  </section>`;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "2011d1065c58"
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

/***/ "565cca359e31"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.list-attention","tag":"sf-list-attention","version":"1.1.1","kind":"leaf","settings":{"items":{"type":"list","schema":{"items":{"type":"object","properties":{"id":{"type":"string"},"status":{"type":"string","enum":["error","warning","info","success"]},"title":{"type":"string"},"text":{"type":"string"},"action":{"type":"object","properties":{"label":{"type":"string"},"href":{"type":"string"},"event":{"type":"string"}}}},"required":["id","status","title"]}},"default":[]},"label":{"type":"string","default-from":"runtime.label"},"heading-level":{"type":"number","integer":true,"min":2,"max":6,"default":3},"empty":{"type":"enum","values":["none","line"],"default":"none"},"empty-text":{"type":"string","default-from":"runtime.empty-text"},"size":{"type":"enum","values":["1/2","1"],"default":"1"}},"values":{},"events":{"navigate":{"carries":{"id":"string","status":"string","href":"string"},"cancelable":true},"apply":{"carries":{"action":"string","scope":"string","ids":"list","id":"string","status":"string"}}},"actions":{},"host-states":{"data-status":"string","data-empty":"boolean"},"css-variables":{"--sf-list-attention-background-color":{"type":"color","state":"default"},"--sf-list-attention-divider-color":{"type":"color","state":"default"},"--sf-list-attention-heading-color":{"type":"color","state":"default"},"--sf-list-attention-padding-inline":{"type":"length","state":"default"},"--sf-list-attention-gap":{"type":"length","state":"default"}}}');

/***/ },

/***/ "3c901318836b"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Needs attention","runtime":{"label":"Needs attention","empty-text":"All is well","count":"{count}","status-error":"Error","status-warning":"Warning","status-info":"Info","status-success":"Done"},"events":{"navigate":{"label":"Go"},"apply":{"label":"Run"}}}');

/***/ },

/***/ "9a754872f29c"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Требует внимания","runtime":{"label":"Требует внимания","empty-text":"Всё в порядке","count":"{count}","status-error":"Ошибка","status-warning":"Предупреждение","status-info":"Сведения","status-success":"Готово"},"events":{"navigate":{"label":"Перейти"},"apply":{"label":"Выполнить"}}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("d72a94301527");
/******/
/******/ })()
;