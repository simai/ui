/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "421676f72963"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   OPEN_SURFACE_MARK: () => (/* binding */ OPEN_SURFACE_MARK),
/* harmony export */   holdOpenSurfaceMark: () => (/* binding */ holdOpenSurfaceMark),
/* harmony export */   isOpenSurfaceMarked: () => (/* binding */ isOpenSurfaceMarked)
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

const held = new WeakSet();

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
  if (wanted) held.add(owner);else held.delete(owner);
  step(wanted ? 1 : -1);
} // What a component asks before its own Escape closes something larger.

function isOpenSurfaceMarked() {
  return Boolean(globalThis.document?.documentElement?.dataset?.[OPEN_MARK]);
}
const OPEN_SURFACE_MARK = OPEN_MARK;

/***/ },

/***/ "e470697f4c03"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("fbe0570fcc69");
/* harmony import */ var _core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("421676f72963");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("18fc6da7e766");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _js_templates_default__WEBPACK_IMPORTED_MODULE_2__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _js_templates_default__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);


 // A surface anchored to a control the consumer supplies: a field's settings, a
// list of things to add, a filter, a colour picker's own panel. It exists
// because the Framework had the surface and not the behaviour -- sf-context-menu
// is positioned and takes any content and any role, but it has no open state, no
// trigger, no dismissal and no focus to return. Two composites built that by
// hand within a week of each other, the second copying the first, which is the
// moment a part belongs here instead.
//
// It claims nothing about the shape of the content: a menu of commands, a list
// of ticks, a form. The role it is given reaches the surface, and the arrow keys
// and roving focus of a menu stay where they already are -- in sf-context-menu,
// which this draws into.
// While any popover is open the root says so, and a component whose own Escape
// closes something -- a drawer, a modal, a panel -- stands back. The mark is a
// protocol shared with every other surface that owns Escape, so it is held
// through core (`core/js/open-surface-mark`) rather than written here.

const PLACEMENTS = ['bottom-start', 'bottom-end', 'top-start', 'top-end', 'inline-start', 'inline-end'];

class SfPopover extends (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()) {
  static get props() {
    return {
      templateName: {
        attribute: 'template',
        default: 'default'
      },
      open: {
        type: Boolean,
        default: false
      },
      placement: {
        default: 'bottom-end',
        values: PLACEMENTS
      },
      label: {
        default: ''
      },
      // What the surface is to a reader. `role` was the name, and a role
      // attribute on the host made the host itself a menu or a dialog
      // beside its surface; it is still read once and moved off the host.
      surfaceRole: {
        attribute: 'surface-role',
        default: 'dialog',
        values: ['dialog', 'menu', 'listbox', 'group']
      },
      // A surface wider than its trigger says how wide it is; left to the
      // content, a list of field names made the surface as wide as its
      // longest one.
      width: {
        default: ''
      },
      // Esc and a press outside both close it. A consumer that owns those
      // keys itself -- a step in a wizard, say -- turns them off and calls
      // `close()` when it decides.
      dismissible: {
        type: Boolean,
        default: true
      }
    };
  }

  constructor() {
    super();
    this._onDocumentPointerDown = null;
    this._onDocumentKeyDown = null;
  }

  static get observedAttributes() {
    return [...(super.observedAttributes ?? []), 'open'];
  }

  get open() {
    return this.getBooleanAttr('open', false);
  }

  get placement() {
    return this.getEnumAttr('placement', PLACEMENTS, 'bottom-end');
  }

  get label() {
    return this.getAttribute('label') || '';
  }

  get surfaceRole() {
    const values = ['dialog', 'menu', 'listbox', 'group'];
    if (this.hasAttribute('surface-role')) return this.getEnumAttr('surface-role', values, 'dialog');
    return values.includes(this._legacyRole) ? this._legacyRole : 'dialog';
  } // The legacy name, kept so a consumer reading el.role still gets an answer.


  get role() {
    return this.surfaceRole;
  } // A role written on the host is the surface's: it is taken once and removed,
  // so the host is not a second menu or dialog around the real one.


  _adoptLegacyRole() {
    if (!this.hasAttribute('role')) return;
    this._legacyRole = String(this.getAttribute('role') || '').trim().toLowerCase();
    this.removeAttribute('role');
    globalThis.SF?.deprecations?.note?.({
      component: 'sf-popover',
      kind: 'attribute',
      attribute: 'role',
      from: 'role',
      to: 'surface-role'
    });
  }

  get width() {
    return this.getAttribute('width') || '';
  }

  get dismissible() {
    return this.getBooleanAttr('dismissible', true);
  } // The host is a box rather than a passthrough: the surface is positioned
  // against it and the trigger sits inside it. The base makes every Smart
  // element `display: contents`, which has no box to position against -- and
  // the alternative, moving the children into one this component renders, is
  // undone by the next render of whatever template engine put them there.
  // Nothing is moved: the children stay exactly where the consumer wrote them
  // and this says where they are.


  applyHostDisplayStyle() {
    const next = 'display: inline-flex; align-items: center; position: relative;';
    if (this.getAttribute('style') === next) return this;
    this._syncingHostStyle = true;
    this.setAttribute('style', next);
    this._syncingHostStyle = false;
    return this;
  } // The base lifts every `[slot]` child out of the document at connect, for a
  // template to place back where it decides. This component decides nothing
  // about where they go: the trigger and the surface stay exactly where the
  // consumer wrote them, and `slot` here names which of the two a node is.


  captureSlotTemplates() {
    this._slotTemplatesCaptured = true;
  }

  onConnected() {
    this._adoptLegacyRole();

    super.onConnected?.();

    this._bindDismissal();

    this.addEventListener('click', this._onTriggerClick);
  } // A press anywhere in the trigger opens it; a press in the content is the
  // content's own.


  _onTriggerClick = event => {
    const path = event.composedPath?.() ?? [];
    const inTrigger = path.some(node => node?.getAttribute?.('slot') === 'trigger');
    if (!inTrigger) return;
    event.preventDefault();
    this.toggle();
  };

  onDisconnected() {
    this.removeEventListener('click', this._onTriggerClick);

    this._releaseDismissal();

    super.onDisconnected?.();
  }

  attributeChangedCallback(name, previous, next) {
    super.attributeChangedCallback?.(name, previous, next);
    if (previous === next || name !== 'open') return;

    this._bindDismissal();

    this.emitComponentEvent(this.open ? 'popover-open' : 'popover-close', {
      open: this.open
    });
    if (!this.open) this.returnFocus();
  }

  toggle(force) {
    const next = typeof force === 'boolean' ? force : !this.open;
    if (next === this.open) return this.open;
    if (next) this._opener = this.querySelector('[slot="trigger"]') ?? null;
    this.toggleAttribute('open', next);
    this.requestComponentUpdate('open');
    return next;
  }

  show() {
    return this.toggle(true);
  }

  close() {
    return this.toggle(false);
  } // The control that opened it gets the focus back, because a surface that
  // closes leaving the focus on the document start makes a keyboard lose its
  // place entirely.


  returnFocus() {
    const trigger = this._opener?.isConnected ? this._opener : this.querySelector('[slot="trigger"]');
    const focusable = trigger?.matches?.('button, a[href], [tabindex]') ? trigger : trigger?.querySelector?.('button, a[href], [tabindex]');
    focusable?.focus?.();
  }

  _bindDismissal() {
    if (!this.open || !this.dismissible) {
      this._releaseDismissal();

      return;
    }

    if (this._onDocumentPointerDown) return;
    (0,_core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_1__.holdOpenSurfaceMark)(this, true);

    this._onDocumentPointerDown = event => {
      const path = event.composedPath?.() ?? [];
      if (path.includes(this)) return;
      this.close();
    }; // Capture, and the press is stopped going further: a surface closing
    // under the pointer must not also activate what the pointer landed on.


    this._onDocumentKeyDown = event => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      event.stopPropagation();
      this.close();
    };

    document.addEventListener('pointerdown', this._onDocumentPointerDown, true);
    document.addEventListener('keydown', this._onDocumentKeyDown, true);
  }

  _releaseDismissal() {
    (0,_core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_1__.holdOpenSurfaceMark)(this, false);

    if (this._onDocumentPointerDown) {
      document.removeEventListener('pointerdown', this._onDocumentPointerDown, true);
    }

    if (this._onDocumentKeyDown) {
      document.removeEventListener('keydown', this._onDocumentKeyDown, true);
    }

    this._onDocumentPointerDown = null;
    this._onDocumentKeyDown = null;
  } // It draws no markup of its own, so it takes the base's own patch path and
  // never renders: lit owns the children of whatever it renders into, and this
  // element renders into itself. A template returning nothing would therefore
  // delete the trigger and the surface the consumer wrote -- which is the same
  // wound as moving them, taken from the other side.


  resolveUpdateMode() {
    return 'dom';
  } // What it owns is said in attributes the stylesheet reads: where the surface
  // sits, whether it is shown, how wide it is, and what it is to a reader.


  updateDom() {
    this.dataset.placement = this.placement;
    this.dataset.open = this.open ? 'true' : 'false';

    this._adoptLegacyRole(); // The control that opens it says that it does and whether it has.


    const trigger = this.querySelector('[slot="trigger"]');
    const control = trigger?.matches?.('button, a[href], [tabindex]') ? trigger : trigger?.querySelector?.('button, a[href], [tabindex], sf-button, sf-icon-button');

    if (control) {
      control.setAttribute('aria-expanded', this.open ? 'true' : 'false');
      control.setAttribute('aria-haspopup', this.surfaceRole === 'group' ? 'true' : this.surfaceRole);
    }

    const surface = this.querySelector('[slot="content"]');
    if (!surface) return true;
    surface.setAttribute('role', this.surfaceRole);
    if (this.label) surface.setAttribute('aria-label', this.label);else surface.removeAttribute('aria-label');
    surface.style.setProperty('--sf-popover--width', this.width || '');
    return true;
  }

  templateContext() {
    return this.createTemplateContext({ ...this.getPropsContext(),
      component: this
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_2__.renderPopoverTemplate)(this.templateContext());
  }

}

SfPopover.define('sf-popover');
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SfPopover);
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "18fc6da7e766"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderPopoverTemplate: () => (/* binding */ renderPopoverTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ddf1cdb42ecc");
/* harmony import */ var _default_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("39f4699b9dcf");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);

 // Nothing. The trigger and the content are the consumer's own nodes, left where
// they were written; this component says where they are with attributes the
// stylesheet reads, and never moves them -- a node moved out from under a
// template engine comes back on its next render, in the wrong place and wired to
// nothing.

function renderPopoverTemplate() {
  return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "39f4699b9dcf"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "ddf1cdb42ecc"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit") : new Promise((resolve) => globalThis.addEventListener("sf-runtime-ready", () => resolve(globalThis.SF.runtimeModule("lit")), { once: true })));

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
/******/ 	let __webpack_exports__ = __webpack_require__("e470697f4c03");
/******/
/******/ })()
;