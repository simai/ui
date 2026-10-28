/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "6723cc45152d"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _core_js_position_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("116963e5e31b");
/* harmony import */ var _core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("bf0cea966575");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("eaf281324a90");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("cd1ae22812c1");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("850094d8ffb2");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("c07ccd74494d");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("23401528a3d5");
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("48eb1fd0f69f");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_position_js__WEBPACK_IMPORTED_MODULE_2__, _core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_3__, _js_templates_default__WEBPACK_IMPORTED_MODULE_4__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_position_js__WEBPACK_IMPORTED_MODULE_2__, _core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_3__, _js_templates_default__WEBPACK_IMPORTED_MODULE_4__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_position_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_core_js_position_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_3__);
// sf-help-mark: a «?» beside a label that opens a short explanation -- a
// toggletip (owner-approved assignment, 2026-10-14). A press opens and closes
// it, never a hover, so it works by touch and keyboard alike; the
// explanation is announced politely when it opens, so a screen reader hears it
// without leaving the button. An explanation holding a link or a control
// follows the button in the focus order and closes when the focus leaves both.
//
// From its component.json (standard simai.smart-component 1.3.8 §3, §4, §8):
// the settings are made by core/js/element-manifest.js (title is heading's
// dated alias), open and close are the actions and answer outcomes, and the
// facts are sf-help-mark-opened and -closed, the old -open and -close their
// dated aliases (aliases.json).











const position = () => globalThis.SF?.Position || (_core_js_position_js__WEBPACK_IMPORTED_MODULE_2___default());

const PLACEMENTS = {
  auto: 'block-end',
  bottom: 'block-end',
  top: 'block-start',
  start: 'inline-start',
  end: 'inline-end'
};
let sequence = 0;
const HelpMarkElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_5__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_7__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_8__
  },
  source: 'ru',
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_6__,
  actions: {
    open() {
      return this.runOpen();
    },

    close() {
      return this.runClose();
    }

  }
});

class SfHelpMark extends HelpMarkElement {
  constructor() {
    super();
    this._id = `sf-help-mark-${++sequence}`;
    this.isOpen = false;
    this.announcement = '';

    this._onOutside = event => {
      if (!this.isOpen || event.composedPath().includes(this)) return;
      this.runClose({
        restoreFocus: false
      });
    }; // An open explanation owns Escape as the innermost open layer, and says so
    // on the root through the shared mark, so a record panel listening in
    // capture before it stands back instead of closing with it.


    this._onKey = event => {
      if (!this.isOpen || event.key !== 'Escape' || event.defaultPrevented || !(0,_core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_3__.isTopOpenSurface)(this)) return;
      event.preventDefault();
      event.stopPropagation();
      this.runClose();
    };

    this.addEventListener('focusout', event => {
      // Focus left both the button and the explanation: an explanation one
      // could tab into closes; one without anything to reach stays.
      if (!this.isOpen || !this.interactive()) return;
      if (event.relatedTarget && this.contains(event.relatedTarget)) return;
      this.runClose({
        restoreFocus: false
      });
    });
  }

  panel() {
    return this.querySelector(':scope .sf-help-mark-panel');
  }

  button() {
    return this.querySelector(':scope .sf-help-mark-button button') ?? this.querySelector(':scope .sf-help-mark-button');
  }

  interactive() {
    return Boolean(this.panel()?.querySelector('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'));
  } // The template's press: a helper, not an action (the actions are open and
  // close).


  toggle() {
    return this.isOpen ? this.close() : this.open();
  } // The action open (component.json).


  async runOpen() {
    if (this.isOpen) return {
      outcome: 'applied'
    };
    this.isOpen = true;
    this.sfHostState('data-open', true);
    this.requestComponentUpdate('open');
    await this.whenRendered?.(); // Closed while it was drawing: it must not raise a mark nobody releases.

    if (!this.isOpen) return {
      outcome: 'cancelled'
    };
    const panel = this.panel();
    const button = this.button();
    if (!panel || !button) return {
      outcome: 'applied'
    };

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
      this.announcement = [this.heading, this.text || panel.querySelector('.sf-help-mark-body')?.textContent?.trim()].filter(Boolean).join('. ');
      this.requestComponentUpdate('announce');
    }, 50);
    this.sfEmit('opened', {});
    return {
      outcome: 'applied'
    };
  } // The action close (component.json); inside, an outside press or focus
  // leaving both parts closes without taking the focus back.


  runClose({
    restoreFocus = true
  } = {}) {
    if (!this.isOpen) return {
      outcome: 'applied'
    };
    this.isOpen = false;
    this.sfHostState('data-open', false);
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
    this.sfEmit('closed', {});
    return {
      outcome: 'applied'
    };
  }

  disconnectedCallback() {
    this.runClose({
      restoreFocus: false
    });
    super.disconnectedCallback?.();
  }

  templateContext() {
    return this.createTemplateContext({ ...this.getPropsContext(),
      component: this,
      id: this._id,
      size: this.size,
      heading: this.heading,
      name: this.label,
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
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
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
        ${context.heading ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-help-mark-title">${context.heading}</div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
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

/***/ "5b7d7695b41b"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("element-manifest", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("element-manifest", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "2a080a730149"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("lit", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "bf0cea966575"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("open-surface-mark", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("open-surface-mark", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "116963e5e31b"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("position", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("position", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "deb1a4d61565"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("smart-base", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("smart-base", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "850094d8ffb2"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-help-mark for the shim (stands/18-aliases-ci/alias.mjs, standard §16 item 20). mode: same-detail (the shim sends the new and the old name), split / detail-adds (a detail adapter, refused by the shim), attribute-and-property, method, property, manifest-only (the DOM name does not change), host-attribute (no shim), retired.","component":"sf-help-mark","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"title","to":"heading","kind":"setting","component":"sf-help-mark","since":"2026-10-27","remove_after":"2026-12-01","section":"§3.1, §16 item 26","note":"title is a property of every element (§3.1); the shim maps the attribute, the browser keeps its title property"},{"from":"sf-help-mark-open","to":"sf-help-mark-opened","kind":"event","component":"sf-help-mark","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","section":"§8, vocabulary §4","note":"sent after the explanation opened: a fact, so the past form"},{"from":"sf-help-mark-close","to":"sf-help-mark-closed","kind":"event","component":"sf-help-mark","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","section":"§8, vocabulary §4","note":"sent after the explanation closed: a fact, so the past form"}]}');

/***/ },

/***/ "cd1ae22812c1"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.help-mark","tag":"sf-help-mark","version":"1.1.4","kind":"leaf","settings":{"text":{"type":"string","default":"","summary":"The explanation; slot `content` takes links or lists instead."},"heading":{"type":"string","default":""},"label":{"type":"string","default-from":"runtime.label","summary":"The button\'s accessible name; «Подробнее» / More information by default, best naming the subject («Подробнее: код решения»)."},"size":{"type":"enum","values":["1/3","1/2","1"],"default":"1/2"},"placement":{"type":"enum","values":["auto","top","bottom","start","end"],"default":"auto"}},"values":{},"events":{"opened":{"carries":{}},"closed":{"carries":{}}},"actions":{"open":{"waits":true,"x-outcomes":["applied","cancelled"],"summary":"Opens the explanation.","x-returns":{"type":"object","description":"A promise."}},"close":{"x-outcomes":["applied"],"summary":"Closes it.","x-returns":{"type":"object","description":"Nothing."}}},"host-states":{"data-open":"boolean"},"css-variables":{"--sf-help-mark-background-color":{"type":"color","state":"open"},"--sf-help-mark-color":{"type":"color","state":"open"},"--sf-help-mark-border-color":{"type":"color","state":"open"},"--sf-help-mark-radius":{"type":"length","state":"default"},"--sf-help-mark-max-width":{"type":"length","state":"default"},"--sf-help-mark-padding-inline":{"type":"length","state":"default"},"--sf-help-mark-padding-block":{"type":"length","state":"default"},"--sf-help-mark-gap":{"type":"length","state":"default"}}}');

/***/ },

/***/ "c07ccd74494d"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Help mark","runtime":{"label":"More information"}}');

/***/ },

/***/ "23401528a3d5"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Подсказка «?»","runtime":{"label":"Подробнее"}}');

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