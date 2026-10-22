/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "421676f72963"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   OPEN_SURFACE_MARK: () => (/* binding */ OPEN_SURFACE_MARK),
/* harmony export */   holdOpenSurfaceMark: () => (/* binding */ holdOpenSurfaceMark),
/* harmony export */   isOpenSurfaceMarked: () => (/* binding */ isOpenSurfaceMarked),
/* harmony export */   isTopOpenSurface: () => (/* binding */ isTopOpenSurface)
/* harmony export */ });
// While a transient surface is open the root says so, and a component whose own
// Escape closes something larger -- a drawer, a modal, a record panel -- stands
// back. They all listen on the document in capture, where stopPropagation
// cannot reach a listener on the same node and the one registered first wins
// whatever it is: without a shared mark, one press closed the surface and the
// window behind it together.
//
// The mark started inside sf-popover, which made it that component's state
// instead of the protocol it is: a dropdown list is the same kind of surface and
// raised nothing, so Escape over an open list closed the record panel behind it
// (Larena storage QA, 2026-10-22) -- and a drawer and a modal read the same mark,
// so the same press closed those too. It lives here now, raised by every surface
// that owns Escape while it is open and read by every component that owns Escape
// for something larger.
//
// The attribute name is unchanged, because it is already the published protocol:
// `document.documentElement.dataset.sfPopoverOpen`.
const OPEN_MARK = 'sfPopoverOpen'; // A count, not a flag: two surfaces can be open at once -- a dropdown inside a
// popover -- and the first to close must not clear the mark the second needs.

const held = new WeakSet(); // The same holders in the order they opened, so the one opened last -- the
// innermost layer -- is known. The mark answers "is anything open"; this answers
// "is it me". Two surfaces that both listen on the document in capture cannot
// settle it with stopPropagation, which does not reach a listener on the same
// node: a calendar opened inside a popover closed together with the popover, and
// a popover closed over a dropdown list it held and left the list open.
//
// Kept on a shared global, not in module scope: every Smart bundle carries its
// own copy of this module, so a module-scope list in the popover's bundle never
// saw the calendar the datepicker's bundle opened. The count lives on the root
// for the same reason.

const LAYERS_KEY = Symbol.for('sf.openSurfaceLayers');

function openLayers() {
  const scope = globalThis;
  if (!Array.isArray(scope[LAYERS_KEY])) scope[LAYERS_KEY] = [];
  return scope[LAYERS_KEY];
}

function step(delta) {
  const root = globalThis.document?.documentElement;
  if (!root) return;
  const next = Math.max(0, Number(root.dataset[OPEN_MARK] || 0) + delta);
  if (next) root.dataset[OPEN_MARK] = String(next);else delete root.dataset[OPEN_MARK];
} // Idempotent for one owner, so a component can call it from every update with
// its own open state and only a change moves the count. An owner that is removed
// while open releases it the same way, from wherever it tears down.


function holdOpenSurfaceMark(owner, open) {
  if (!owner) return;
  const wanted = Boolean(open);
  if (wanted === held.has(owner)) return;
  const layers = openLayers();

  if (wanted) {
    held.add(owner);
    layers.push(owner);
  } else {
    held.delete(owner);
    const at = layers.lastIndexOf(owner);
    if (at >= 0) layers.splice(at, 1);
  }

  step(wanted ? 1 : -1);
} // What a surface asks before its own Escape closes it: whether it is the
// innermost open layer. A holder that left the document without releasing is
// passed over rather than allowed to hold every Escape on the page. An owner
// that holds nothing is the top only when nothing else is open.

function isTopOpenSurface(owner) {
  const layers = openLayers();

  for (let at = layers.length - 1; at >= 0; at -= 1) {
    const layer = layers[at];
    if (layer?.isConnected === false) continue;
    return layer === owner;
  }

  return true;
} // What a component asks before its own Escape closes something larger.

function isOpenSurfaceMarked() {
  return Boolean(globalThis.document?.documentElement?.dataset?.[OPEN_MARK]);
}
const OPEN_SURFACE_MARK = OPEN_MARK;

/***/ },

/***/ "6723cc45152d"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("fbe0570fcc69");
/* harmony import */ var _core_js_position_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5c1dc214bb5e");
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("0d662e4d7d63");
/* harmony import */ var _core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("421676f72963");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("eaf281324a90");
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("48eb1fd0f69f");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_position_js__WEBPACK_IMPORTED_MODULE_1__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_2__, _js_templates_default__WEBPACK_IMPORTED_MODULE_4__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_position_js__WEBPACK_IMPORTED_MODULE_1__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_2__, _js_templates_default__WEBPACK_IMPORTED_MODULE_4__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_position_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_position_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_core_js_page_language__WEBPACK_IMPORTED_MODULE_2__);
// sf-help-mark: a «?» beside a label that opens a short explanation -- a
// toggletip (owner-approved assignment, 2026-10-14). A press opens and closes
// it, never a hover, so it works by touch and keyboard alike; the
// explanation is announced politely when it opens, so a screen reader hears it
// without leaving the button. An explanation holding a link or a control
// follows the button in the focus order and closes when the focus leaves both.







const position = () => globalThis.SF?.Position || (_core_js_position_js__WEBPACK_IMPORTED_MODULE_1___default());

const SIZES = ['1/3', '1/2', '1'];
const PLACEMENTS = {
  auto: 'block-end',
  bottom: 'block-end',
  top: 'block-start',
  start: 'inline-start',
  end: 'inline-end'
};
const HELP_TEXT = {
  en: {
    label: 'More information'
  },
  ru: {
    label: 'Подробнее'
  }
};
let sequence = 0;

class SfHelpMark extends (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()) {
  constructor() {
    super();
    this._id = `sf-help-mark-${++sequence}`;
    this.isOpen = false;
    this.announcement = '';

    this._onOutside = event => {
      if (!this.isOpen || event.composedPath().includes(this)) return;
      this.close({
        restoreFocus: false
      });
    }; // An open explanation owns Escape as the innermost open layer, and says so
    // on the root through the shared mark, so a record panel listening in
    // capture before it stands back instead of closing with it.


    this._onKey = event => {
      if (!this.isOpen || event.key !== 'Escape' || event.defaultPrevented || !(0,_core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_3__.isTopOpenSurface)(this)) return;
      event.preventDefault();
      event.stopPropagation();
      this.close();
    };

    this.addEventListener('focusout', event => {
      // Focus left both the button and the explanation: an explanation one
      // could tab into closes; one without anything to reach stays.
      if (!this.isOpen || !this.interactive()) return;
      if (event.relatedTarget && this.contains(event.relatedTarget)) return;
      this.close({
        restoreFocus: false
      });
    });
  }

  static get props() {
    return {
      templateName: {
        attribute: 'template',
        default: 'default'
      },
      text: {
        default: ''
      },
      title: {
        default: ''
      },
      label: {
        default: ''
      },
      size: {
        default: '1/2'
      },
      placement: {
        default: 'auto'
      },
      rootClass: {
        default: ''
      }
    };
  }

  get text() {
    return this.getAttribute('text') || '';
  }

  get title() {
    return this.getAttribute('title') || '';
  }

  get label() {
    return this.getAttribute('label') || '';
  }

  get size() {
    const value = this.getAttribute('size');
    return SIZES.includes(value) ? value : '1/2';
  }

  get placement() {
    const value = this.getAttribute('placement');
    return PLACEMENTS[value] ? value : 'auto';
  }

  panel() {
    return this.querySelector(':scope .sf-help-mark-panel');
  }

  button() {
    return this.querySelector(':scope .sf-help-mark-button button') ?? this.querySelector(':scope .sf-help-mark-button');
  }

  interactive() {
    return Boolean(this.panel()?.querySelector('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'));
  }

  toggle() {
    return this.isOpen ? this.close() : this.open();
  }

  async open() {
    if (this.isOpen) return;
    this.isOpen = true;
    this.requestComponentUpdate('open');
    await this.whenRendered?.(); // Closed while it was drawing: it must not raise a mark nobody releases.

    if (!this.isOpen) return;
    const panel = this.panel();
    const button = this.button();
    if (!panel || !button) return;

    if (typeof panel.showPopover === 'function') {
      panel.setAttribute('popover', 'manual');
      if (!panel.matches(':popover-open')) panel.showPopover();
    }

    this._position = position().anchor(button, panel, {
      side: PLACEMENTS[this.placement],
      align: 'center',
      flip: true,
      shift: true
    });
    (0,_core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_3__.holdOpenSurfaceMark)(this, true);
    document.addEventListener('pointerdown', this._onOutside, true);
    document.addEventListener('keydown', this._onKey, true); // Said once it is open: the text a screen reader hears is the text shown.

    this.announcement = '';
    this.requestComponentUpdate('announce-clear');
    setTimeout(() => {
      if (!this.isOpen) return;
      this.announcement = [this.title, this.text || panel.querySelector('.sf-help-mark-body')?.textContent?.trim()].filter(Boolean).join('. ');
      this.requestComponentUpdate('announce');
    }, 50);
    this.dispatchEvent(new CustomEvent('sf-help-mark-open', {
      bubbles: true,
      composed: true
    }));
  }

  close({
    restoreFocus = true
  } = {}) {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.announcement = '';
    this._position?.stop();
    this._position = null;
    (0,_core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_3__.holdOpenSurfaceMark)(this, false);
    document.removeEventListener('pointerdown', this._onOutside, true);
    document.removeEventListener('keydown', this._onKey, true);
    const panel = this.panel();
    if (panel?.matches?.(':popover-open')) panel.hidePopover();
    this.requestComponentUpdate('close');
    if (restoreFocus) this.button()?.focus({
      preventScroll: true
    });
    this.dispatchEvent(new CustomEvent('sf-help-mark-close', {
      bubbles: true,
      composed: true
    }));
  }

  disconnectedCallback() {
    this.close({
      restoreFocus: false
    });
    super.disconnectedCallback?.();
  }

  templateContext() {
    return this.createTemplateContext({ ...this.getPropsContext(),
      component: this,
      id: this._id,
      size: this.size,
      name: this.label || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_2__.pageText)(HELP_TEXT, 'label', this, 'sf-help-mark'),
      open: this.isOpen,
      announcement: this.announcement,
      body: this.hasSlotContent?.('content') ? this.getSlotContent('content') : null,
      rootClass: this.getRootClass()
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_4__.renderHelpMarkTemplate)(this.templateContext());
  }

}

SfHelpMark.define('sf-help-mark');
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "eaf281324a90"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderHelpMarkTemplate: () => (/* binding */ renderHelpMarkTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ddf1cdb42ecc");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);

function renderHelpMarkTemplate(context) {
  const panelId = `${context.id}-panel`;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <span class=${['sf-help-mark', context.rootClass].filter(Boolean).join(' ')}>
      <sf-icon-button class="sf-help-mark-button" size=${context.size} appearance="link" scheme="on-surface"
                      icon="help" aria-label=${context.name}
                      aria-expanded=${String(Boolean(context.open))} aria-controls=${panelId}
                      @click=${() => context.component.toggle()}></sf-icon-button>
      <div class="sf-help-mark-panel" id=${panelId} ?hidden=${!context.open}>
        ${context.title ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-help-mark-title">${context.title}</div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        <div class="sf-help-mark-body">${context.body ?? context.text}</div>
      </div>
      <span class="sf-help-mark-live" role="status" aria-live="polite" aria-atomic="true">${context.announcement}</span>
    </span>
  `;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "48eb1fd0f69f"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "ddf1cdb42ecc"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit") : new Promise((resolve) => globalThis.addEventListener("sf-runtime-ready", () => resolve(globalThis.SF.runtimeModule("lit")), { once: true })));

/***/ },

/***/ "0d662e4d7d63"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("page-language") : new Promise((resolve) => globalThis.addEventListener("sf-runtime-ready", () => resolve(globalThis.SF.runtimeModule("page-language")), { once: true })));

/***/ },

/***/ "5c1dc214bb5e"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("position") : new Promise((resolve) => globalThis.addEventListener("sf-runtime-ready", () => resolve(globalThis.SF.runtimeModule("position")), { once: true })));

/***/ },

/***/ "fbe0570fcc69"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("smart-base") : new Promise((resolve) => globalThis.addEventListener("sf-runtime-ready", () => resolve(globalThis.SF.runtimeModule("smart-base")), { once: true })));

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
/******/ 	let __webpack_exports__ = __webpack_require__("6723cc45152d");
/******/
/******/ })()
;