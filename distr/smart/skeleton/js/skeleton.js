/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "05a6b544131d"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("bd17ee4444c6");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("1b576216d612");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("b013c522028b");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("7bb5d4886c9b");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("d0cbc3ffd697");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_2__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);








function parseItemAttrs(items) {
  if (!items) return [];
  const list = Array.isArray(items) ? items : `${items}`.split('|');
  return list.map(entry => {
    if (!entry) return null;
    const obj = {};
    `${entry}`.split(',').map(part => part.trim()).filter(Boolean).forEach(pair => {
      const [k, ...rest] = pair.split('=');
      const key = k?.trim();
      const value = rest.join('=').trim();

      if (key) {
        obj[key] = value || true;
      }
    });
    return obj;
  }).filter(Boolean);
}

function isSafeItemAttribute(name) {
  return /^(?:aria-[a-z0-9_-]+|data-[a-z0-9_-]+)$/i.test(name);
} // sf-skeleton from its component.json (standard simai.smart-component 1.3.8
// §3, §4, §5.4): its settings are attributes and properties made by
// core/js/element-manifest.js; variant is a dated alias of kind (aliases.json).
// The bars are CSS only and aria-hidden: the region that waits names itself.


const SkeletonElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_3__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_5__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_6__
  },
  source: 'ru',
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_4__
});

class SfSkeleton extends SkeletonElement {
  static get props() {
    return { ...super.props,
      // The axis is called kind, because that is the question it answers.
      // `variant` keeps working: see contracts/public-api-axes.json.
      kind: {
        default: 'text',
        values: ['text', 'circle', 'square', 'rounded'],
        aliases: ['variant']
      },
      rootClass: {
        default: ''
      }
    };
  }

  get kind() {
    return this.getProp('kind');
  }

  set kind(value) {
    if (value === null || value === undefined || value === '') this.removeAttribute('kind');else this.setAttribute('kind', String(value));
  }

  templateContext() {
    const props = this.getPropsContext();
    return this.createTemplateContext({ ...props,
      component: this,
      rootClass: this.getRootClass(),
      // Resolved names the template reads (contracts/template-context.json).
      variant: this.kind,
      type: this.type
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_2__.renderSkeletonTemplate)(this.templateContext());
  }

  afterRender() {
    const itemAttrs = parseItemAttrs(this.items);

    if (!itemAttrs.length) {
      return;
    }

    this.querySelectorAll('[data-sf-skeleton-item]').forEach((node, index) => {
      const attrs = itemAttrs[index % itemAttrs.length] || {};
      Object.entries(attrs).forEach(([attr, value]) => {
        if (!isSafeItemAttribute(attr)) {
          return;
        }

        if (value === undefined || value === null) {
          return;
        }

        if (value === true) {
          node.setAttribute(attr, '');
          return;
        }

        node.setAttribute(attr, String(value));
      });
    });
  }

  get state() {
    return {
      size: this.size,
      width: this.width,
      height: this.height,
      count: this.count,
      animation: this.animation,
      kind: this.kind,
      type: this.type,
      items: this.items,
      rootClass: this.getRootClass()
    };
  }

  setState(nextState = {}) {
    Object.entries(nextState || {}).forEach(([key, value]) => {
      const attr = (0,_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__.toAttributeName)(key);

      if (!attr) {
        return;
      }

      if (value === false || value === null || value === undefined || value === '') {
        this.removeAttribute(attr);
        return;
      }

      if (value === true) {
        this.setAttribute(attr, '');
        return;
      }

      this.setAttribute(attr, String(value));
    });
    return this;
  }

}

SfSkeleton.define('sf-skeleton');
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "bd17ee4444c6"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderSkeletonTemplate: () => (/* binding */ renderSkeletonTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);


function normalizeList(value, fallback = []) {
  if (value == null || value === '') return [...fallback];
  if (Array.isArray(value)) return value;
  return `${value}`.replace(/^\[|\]$/g, '').split(',').map(item => item.trim()).filter(Boolean);
}

function resolveSize(value) {
  if (value == null || value === '') return '';
  const token = `${value}`.trim().replace(/^\[|\]$/g, '');

  if (/^[a-g][0-9]+(?:\/[0-9]+)?$/i.test(token)) {
    return `var(--sf-${token.toLowerCase()})`;
  }

  if (/^var\(--sf-[a-z0-9_-]+\)$/i.test(token)) {
    return token;
  }

  if (/^(?:100|[0-9]{1,2}(?:\.[0-9]+)?)%$/.test(token)) {
    return token;
  }

  return '';
}

function styleMap(style = {}) {
  return Object.entries(style).filter(([, value]) => value !== undefined && value !== null && value !== '').map(([key, value]) => `${key}: ${value}`).join('; ');
}

function renderSkeletonTemplate(context) {
  const {
    size,
    width,
    height,
    count,
    animation: rawAnimation,
    kind: rawKind,
    variant: rawVariant,
    type: rawType,
    rootClass
  } = context;
  const sizes = ['1/7', '1/6', '1/5', '1/4', '1/3', '1/2', '1', '2', '3', '4', '5', '6', '7'];
  const sizeValue = sizes.includes(`${size}`) ? `${size}` : '1';
  const animation = ['pulse', 'wave', 'none'].includes(`${rawAnimation}`) ? `${rawAnimation}` : 'pulse';
  const requestedShape = rawKind ?? rawVariant;
  const variant = ['text', 'circle', 'square', 'rounded'].includes(`${requestedShape}`) ? `${requestedShape}` : 'text';
  const type = rawType === 'icon' ? 'icon' : '';
  const widths = normalizeList(width, ['100%']);
  const heights = normalizeList(height);
  const rootClasses = ['sf-skeleton', 'flex'];

  if (type !== 'icon') {
    rootClasses.push('flex-1');
  }

  if (animation) {
    rootClasses.push(`sf-skeleton--animation-${animation}`);
  }

  if (rootClass) {
    rootClasses.push(...String(rootClass).split(/\s+/).filter(Boolean));
  }

  const rootStyle = type !== 'icon' && widths.length ? styleMap({
    'inline-size': resolveSize(widths[0])
  }) : '';
  const countValue = Number(count);
  const itemsCount = Number.isFinite(countValue) ? Math.min(20, Math.max(1, Math.trunc(countValue))) : 1;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div class=${rootClasses.join(' ')} style=${rootStyle} aria-hidden="true">
      ${Array.from({
    length: itemsCount
  }, (_, index) => {
    const itemClasses = ['sf-skeleton-text', `sf-skeleton-text--size-${sizeValue}`];

    if (variant && variant !== 'text') {
      itemClasses.push(`sf-skeleton-${variant}`);
    }

    if (type) {
      itemClasses.push(`sf-skeleton-${type}`);
    }

    const resolvedWidth = widths[index % widths.length] || '';
    const resolvedHeight = heights[index % heights.length] || '';
    const itemStyle = type !== 'icon' ? styleMap({
      'inline-size': resolveSize(resolvedWidth || '100%'),
      'block-size': resolvedHeight ? resolveSize(resolvedHeight) : ''
    }) : '';
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
          <div
            class=${itemClasses.join(' ')}
            style=${itemStyle}
            data-sf-skeleton-item=${String(index)}
          ></div>
        `;
  })}
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

/***/ "b013c522028b"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-skeleton for the shim (core/js/aliases.js, standard §16 item 20). mode: same-detail (the shim sends the new and the old name), detail-adds (the new detail holds the old fields), attribute-and-property, host-attribute (no shim), manifest-only (the DOM name does not change), retired (no new name; kept and noted by the component until the date).","component":"sf-skeleton","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"variant","to":"kind","kind":"setting","component":"sf-skeleton","since":"2026-10-27","remove_after":"2026-12-01","section":"the axis\'s old name (contracts/public-api-axes.json)"}]}');

/***/ },

/***/ "1b576216d612"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.skeleton","tag":"sf-skeleton","version":"1.1.1","kind":"leaf","settings":{"size":{"type":"enum","values":["1/7","1/6","1/5","1/4","1/3","1/2","1","2","3","4","5","6","7"],"default":"1"},"width":{"type":"string","default":"100%"},"height":{"type":"string","default":""},"count":{"type":"number","default":1,"integer":true,"min":1,"max":20},"animation":{"type":"enum","values":["pulse","wave","none"],"default":"pulse"},"kind":{"type":"enum","values":["text","circle","square","rounded"],"default":"text"},"type":{"type":"enum","values":["","icon"],"default":""},"items":{"type":"string","default":""}},"values":{},"events":{},"actions":{},"css-variables":{"--sf-skeleton-background-color":{"type":"color","state":"default"},"--sf-skeleton-highlight-color":{"type":"color","state":"default"},"--sf-skeleton-radius":{"type":"length","state":"default"},"--sf-skeleton-gap":{"type":"length","state":"default"},"--sf-skeleton-animation-duration":{"type":"time","state":"default"}}}');

/***/ },

/***/ "7bb5d4886c9b"
(module) {

module.exports = {"title":"Skeleton"};

/***/ },

/***/ "d0cbc3ffd697"
(module) {

module.exports = {"title":"Скелетон"};

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
/******/ 	let __webpack_exports__ = __webpack_require__("05a6b544131d");
/******/
/******/ })()
;