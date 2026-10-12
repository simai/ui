/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "2b61c7885d13"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   dismissAlertElement: () => (/* binding */ dismissAlertElement)
/* harmony export */ });
function dismissAlertElement(alert, removalTarget = alert) {
  if (!alert?.isConnected || !removalTarget?.isConnected) {
    return Promise.resolve(removalTarget);
  }

  const remove = () => {
    if (removalTarget.isConnected) {
      removalTarget.remove();
    }

    return removalTarget;
  };

  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  if (reducedMotion || typeof alert.getAnimations !== 'function') {
    return Promise.resolve(remove());
  } // Commit the resting style before switching to the token-driven exit state.


  window.getComputedStyle(alert).opacity;
  alert.classList.add('closing');
  return new Promise(resolve => {
    window.requestAnimationFrame(() => {
      const animations = alert.getAnimations().filter(animation => {
        const timing = animation.effect?.getComputedTiming?.();
        return timing && timing.iterations !== Infinity;
      });

      if (animations.length === 0) {
        resolve(remove());
        return;
      }

      Promise.allSettled(animations.map(animation => animation.finished)).then(() => resolve(remove()));
    });
  });
}

/***/ },

/***/ "424c01e70dad"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("fbe0570fcc69");
/* harmony import */ var _component_alerts_dismiss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("2b61c7885d13");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("af050435d334");
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("0d662e4d7d63");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _js_templates_default__WEBPACK_IMPORTED_MODULE_2__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_3__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _js_templates_default__WEBPACK_IMPORTED_MODULE_2__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_3__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__);



 // Every word this component says, in the languages it ships with. A product
// adds any other through SF.language.register("sf-alert", code, words).

const ALERT_TEXT = {
  en: {
    closeLabel: 'Close alert'
  },
  ru: {
    closeLabel: 'Закрыть сообщение'
  }
};

class SfAlert extends (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()) {
  static get props() {
    return {
      templateName: {
        attribute: 'template',
        default: 'default'
      },
      status: {
        default: 'neutral',
        values: ['neutral', 'info', 'success', 'warning', 'error'],
        aliases: ['type'],
        valueAliases: {
          neutral: ['clear'],
          error: ['danger']
        }
      },
      appearance: {
        default: 'default',
        values: ['default', 'outlined', 'flat'],
        aliases: ['variant']
      },
      icon: {
        default: ''
      },
      title: {
        default: ''
      },
      supportingText: {
        default: ''
      },
      actionText: {
        default: ''
      },
      action: {
        default: 'action'
      },
      secondaryActionText: {
        default: ''
      },
      secondaryAction: {
        default: 'secondary'
      },
      closable: {
        type: Boolean,
        default: false
      },
      closeLabel: {
        default: 'Close alert'
      },
      rootClass: {
        default: ''
      }
    };
  }

  constructor() {
    super();
    this._boundRoot = null;
  } // The shared status vocabulary. `clear` and `danger` are the words this
  // component used before it; both still work — see contracts/public-api-axes.json.


  get status() {
    return this.getProp('status');
  } // The legacy name, kept so a consumer reading el.type still gets an answer.


  get type() {
    return this.status;
  }

  get appearance() {
    return this.getProp('appearance');
  } // The legacy name for the appearance.


  get variant() {
    return this.appearance;
  }

  get icon() {
    return this.getAttribute('icon') || '';
  }

  get title() {
    return this.getAttribute('title') || '';
  }

  get supportingText() {
    return this.getAttribute('supporting-text') || '';
  }

  get actionText() {
    return this.getAttribute('action-text') || '';
  }

  get action() {
    return this.getAttribute('action') || 'action';
  }

  get secondaryActionText() {
    return this.getAttribute('secondary-action-text') || '';
  }

  get secondaryAction() {
    return this.getAttribute('secondary-action') || 'secondary';
  }

  get closable() {
    return this.getBooleanAttr('closable', false);
  }

  get closeLabel() {
    return this.getAttribute('close-label') || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageText)(ALERT_TEXT, "closeLabel", this);
  }

  templateContext() {
    const props = this.getPropsContext();
    return this.createTemplateContext({ ...props,
      closeLabel: this.getAttribute("close-label") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageText)(ALERT_TEXT, "closeLabel", this),
      component: this,
      rootClass: this.getRootClass()
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_2__.renderAlertTemplate)(this.templateContext());
  }

  afterRender() {
    if (this._boundRoot) {
      this.removeAlertListeners(this._boundRoot);
      this._boundRoot = null;
    }

    this._boundRoot = this.querySelector('.sf-alert');

    if (!this._boundRoot) {
      return;
    }

    this.addAlertListeners(this._boundRoot);
  }

  onDisconnected() {
    if (this._boundRoot) {
      this.removeAlertListeners(this._boundRoot);
      this._boundRoot = null;
    }
  }

  addAlertListeners(root) {
    root.addEventListener('click', this._handleRootClick);
  }

  removeAlertListeners(root) {
    root.removeEventListener('click', this._handleRootClick);
  }

  _handleRootClick = event => {
    const trigger = event.target?.closest?.('[data-close], [data-alert-close], [data-action], [data-alert-action]');
    if (!trigger || !this._boundRoot?.contains(trigger) || trigger.closest('.sf-alert') !== this._boundRoot) return;
    if (trigger.matches(':disabled, [aria-disabled="true"]')) return; // Nested Smart buttons transfer data attributes onto their native button.
    // Delegation survives that transfer and subsequent child renders.

    if (trigger.matches('[data-close], [data-alert-close]')) this._handleCloseClick(event);else this._handleActionClick(event, trigger);
  };
  _handleCloseClick = event => {
    event.preventDefault();
    this.dismiss();
  };
  _handleActionClick = (event, trigger = event.currentTarget) => {
    this.dispatchEvent(new CustomEvent('sf-alert-action', {
      bubbles: true,
      composed: true,
      detail: {
        action: trigger?.getAttribute('data-action') || trigger?.getAttribute('data-alert-action') || '',
        alert: this
      }
    }));
  };

  dismiss() {
    this.dispatchEvent(new CustomEvent('sf-alert-close', {
      bubbles: true,
      composed: true,
      detail: {
        alert: this
      }
    }));
    (0,_component_alerts_dismiss__WEBPACK_IMPORTED_MODULE_1__.dismissAlertElement)(this._boundRoot || this, this);
    return this;
  }

  close() {
    return this.dismiss();
  }

  onAction(handler, options) {
    if (typeof handler === 'function') {
      this.addEventListener('sf-alert-action', event => {
        handler(event.detail?.action, event.detail, event);
      }, options);
    }

    return this;
  }

  onClose(handler, options) {
    if (typeof handler === 'function') {
      this.addEventListener('sf-alert-close', event => {
        handler(event.detail, event);
      }, options);
    }

    return this;
  }

}

SfAlert.define('sf-alert');
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "af050435d334"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderAlertTemplate: () => (/* binding */ renderAlertTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ddf1cdb42ecc");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);


function joinClasses(...tokens) {
  return tokens.flat().filter(Boolean).join(' ');
}

function resolveIcon(context) {
  if (context.icon === 'none') {
    return '';
  }

  if (context.icon !== undefined && context.icon !== null && context.icon !== '') {
    return context.icon;
  } // Keyed by the shared status vocabulary. The component normalises the legacy
  // words before the template sees them, so clear and danger do not appear here.


  const byStatus = {
    neutral: 'info',
    info: 'info',
    error: 'error',
    warning: 'warning',
    success: 'check_circle'
  };
  return byStatus[context.status ?? context.type] || 'info';
}

function renderAlertTemplate(context) {
  const rootClasses = joinClasses('sf-alert', `sf-alert--${context.status ?? context.type}`, `sf-alert--${context.appearance ?? context.variant}`, 'flex', 'items-start', context.rootClass);
  const iconName = resolveIcon(context);
  const titleContent = context.component?.hasSlotContent?.('title') ? context.component.getSlotContent('title') : context.title;
  const supportingTextContent = context.component?.hasSlotContent?.('supporting-text') ? context.component.getSlotContent('supporting-text') : context.supportingText;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div class=${rootClasses} style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
      ${iconName ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-icon icon="${iconName}" aria-hidden="true"></sf-icon>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}

      <div class="sf-alert-wrap flex flex-col flex-1">
        <div class="sf-alert-content flex flex-col flex-1">
          ${titleContent ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-alert-text">${titleContent}</div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          ${supportingTextContent ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-alert-supporting-text">${supportingTextContent}</div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        </div>

        ${context.actionText || context.secondaryActionText ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
              <div class="sf-alert-buttons flex flex-wrap items-center">
                ${context.actionText ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                      <button
                        type="button"
                        class="sf-button sf-button--default sf-button--on-surface sf-button--size-1/2"
                        data-action=${context.action || 'action'}
                        data-alert-action=${context.action || 'action'}
                      >
                        <span class="sf-button-text-container">${context.actionText}</span>
                      </button>
                    ` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ${context.secondaryActionText ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                      <button
                        type="button"
                        class="sf-button sf-button--on-surface sf-button--outline sf-button--size-1/2"
                        data-action=${context.secondaryAction || 'secondary'}
                        data-alert-action=${context.secondaryAction || 'secondary'}
                      >
                        <span class="sf-button-text-container">${context.secondaryActionText}</span>
                      </button>
                    ` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
              </div>
            ` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      </div>

      ${context.closable ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                  <sf-icon-button
                          variant="close"
                          size="1"
                          type="link"
                          scheme="on-surface"
                          data-close
                          data-alert-close
                          aria-label=${context.closeLabel || 'Close alert'}
                  ></sf-icon-button>
          ` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    </div>
  `;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "ddf1cdb42ecc"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit") : new Promise((resolve) => globalThis.addEventListener("sf-runtime-ready", () => resolve(globalThis.SF.runtimeModule("lit")), { once: true })));

/***/ },

/***/ "0d662e4d7d63"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("page-language") : new Promise((resolve) => globalThis.addEventListener("sf-runtime-ready", () => resolve(globalThis.SF.runtimeModule("page-language")), { once: true })));

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
/******/ 	let __webpack_exports__ = __webpack_require__("424c01e70dad");
/******/
/******/ })()
;