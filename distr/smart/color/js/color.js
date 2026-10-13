/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "3dd6551de8f2"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SfColor: () => (/* binding */ SfColor)
/* harmony export */ });
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("fbe0570fcc69");
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("0d662e4d7d63");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("b16e9ecc75e4");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_2__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__);


 // A colour, for anywhere a colour is set: a theme, a site's own look, a label, a
// chart series. It was built because the property set had no colour at all while a
// running Larena site declares fourteen of them, but nothing here is about a
// property view -- it is a control like a switch or a date.
//
// Two things it does that a bare `<input type="color">` does not. It can be
// **unset**, which is the state the site actually uses: a colour inherited from the
// theme until somebody chooses one, and returnable to that. And it offers the
// colours a product already has, as swatches, so a person picks «the brand colour»
// rather than matching a hex by eye.

const COLOR_TEXT = {
  en: {
    choose: "Choose a colour",
    clear: "Use the inherited colour",
    inherited: "inherited",
    custom: "Custom"
  },
  ru: {
    choose: "Выбрать цвет",
    clear: "Вернуть унаследованный",
    inherited: "наследуется",
    custom: "Свой"
  }
}; // #abc, #aabbcc and #aabbccdd, which is what a person pastes and what a store
// keeps. Anything else is not a colour this control will claim to hold.

const HEX = /^#(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/iu;

const normalise = value => {
  const text = String(value ?? "").trim();
  if (!text) return "";
  const hash = text.startsWith("#") ? text : `#${text}`;
  return HEX.test(hash) ? hash.toLowerCase() : "";
};

class SfColor extends (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()) {
  static get props() {
    return {
      templateName: {
        attribute: "template",
        default: "default"
      },
      value: {
        default: ""
      },
      size: {
        default: "1",
        values: ["1/2", "1", "2"]
      },
      appearance: {
        default: "bordered",
        values: ["bordered", "outlined", "plain"]
      },
      swatches: {
        default: ""
      },
      inheritedValue: {
        attribute: "inherited-value",
        default: ""
      },
      clearable: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      name: {
        default: ""
      },
      label: {
        default: ""
      },
      chooseLabel: {
        attribute: "choose-label",
        default: ""
      },
      clearLabel: {
        attribute: "clear-label",
        default: ""
      },
      inheritedText: {
        attribute: "inherited-text",
        default: ""
      }
    };
  }

  static get observedAttributes() {
    return [...(super.observedAttributes ?? []), "value", "inherited-value", "swatches", "disabled"];
  }

  attributeChangedCallback(name, previous, next) {
    super.attributeChangedCallback?.(name, previous, next);
    if (previous !== next && this.isConnected) this.requestComponentUpdate("attribute");
  }

  get value() {
    return normalise(this.getAttribute("value"));
  }

  get size() {
    return this.getAttribute("size") || "1";
  }

  get appearance() {
    return this.getAttribute("appearance") || "bordered";
  }

  get disabled() {
    return this.hasAttribute("disabled");
  }

  get clearable() {
    return this.hasAttribute("clearable");
  }

  get name() {
    return this.getAttribute("name") || "";
  }

  get label() {
    return this.getAttribute("label") || "";
  } // What the colour falls back to while nothing is chosen. Shown rather than
  // guessed: a control that drew the inherited colour as if it were the value
  // would make «not set» and «set to the same colour» look identical, and only
  // one of them follows the theme when the theme changes.


  get inheritedValue() {
    return normalise(this.getAttribute("inherited-value"));
  }

  get inheritedText() {
    return this.getAttribute("inherited-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(COLOR_TEXT, "inherited", this);
  }

  get chooseLabel() {
    return this.getAttribute("choose-label") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(COLOR_TEXT, "choose", this);
  }

  get clearLabel() {
    return this.getAttribute("clear-label") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(COLOR_TEXT, "clear", this);
  }

  get customText() {
    return (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(COLOR_TEXT, "custom", this);
  } // The colours a product already has. A space or comma separated list, each one
  // a hex, optionally `#hex|Name` so a swatch can say what it is.


  get swatchList() {
    return String(this.getAttribute("swatches") || "").split(/[\s,]+/u).filter(Boolean).map(entry => {
      const [color, name] = entry.split("|");
      const hex = normalise(color);
      return hex ? {
        value: hex,
        name: name || hex
      } : null;
    }).filter(Boolean);
  } // What is painted now: the value when there is one, the inherited colour when
  // there is not.


  get shown() {
    return this.value || this.inheritedValue || "";
  }

  get isSet() {
    return Boolean(this.value);
  }

  setValue(next) {
    const value = normalise(next);
    if (value === this.value) return false;
    if (value) this.setAttribute("value", value);else this.removeAttribute("value");
    this.requestComponentUpdate("value"); // `change` on the host, once per change a person makes, which is what the
    // Framework calls a committed value change.

    this.dispatchEvent(new CustomEvent("change", {
      bubbles: true,
      composed: true,
      detail: {
        value,
        name: this.name
      }
    }));
    return true;
  }

  clear() {
    return this.setValue("");
  }

  templateContext() {
    return this.createTemplateContext({ ...this.getPropsContext(),
      component: this,
      value: this.value,
      shown: this.shown,
      isSet: this.isSet,
      inheritedValue: this.inheritedValue,
      inheritedText: this.inheritedText,
      chooseLabel: this.chooseLabel,
      clearLabel: this.clearLabel,
      customText: this.customText,
      swatchList: this.swatchList,
      clearable: this.clearable,
      disabled: this.disabled,
      size: this.size,
      appearance: this.appearance,
      name: this.name,
      label: this.label
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_2__.renderColorTemplate)(this.templateContext());
  }

}

SfColor.define("sf-color");

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "b16e9ecc75e4"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderColorTemplate: () => (/* binding */ renderColorTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ddf1cdb42ecc");
/* harmony import */ var _default_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("53bac87b41ad");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);

 // The control is a swatch that opens the browser's own colour picker, with the
// product's own colours beside it and a way back to the inherited one. The native
// input is what opens the picker: every platform has one, it is reachable from the
// keyboard, and reimplementing a colour wheel would be a worse version of a thing
// the system already does well.

function renderColorTemplate(context) {
  const {
    shown,
    isSet,
    disabled,
    size,
    appearance
  } = context;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-color sf-color--${appearance} sf-color--size-${size}"
             data-set=${isSet ? 'true' : 'false'}>
            <label class="sf-color-swatch" title=${context.chooseLabel}>
                <span class="sf-color-chip"
                      style=${shown ? `--sf-color-chip: ${shown}` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                      data-empty=${shown ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : 'true'}
                      aria-hidden="true"></span>
                <input
                        type="color"
                        class="sf-color-input"
                        name=${context.name || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                        .value=${shown || '#000000'}
                        ?disabled=${disabled}
                        aria-label=${context.label || context.chooseLabel}
                        @input=${event => context.component.setValue(event.target.value)}
                >
            </label>

            <span class="sf-color-text">
                ${isSet ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<code>${context.value}</code>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-color-inherited">${context.inheritedText}</span>`}
            </span>

            ${context.swatchList.length ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                        <span class="sf-color-swatches" role="group" aria-label=${context.chooseLabel}>
                            ${context.swatchList.map(swatch => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                                <button
                                        type="button"
                                        class="sf-color-preset"
                                        style=${`--sf-color-chip: ${swatch.value}`}
                                        title=${swatch.name}
                                        aria-label=${swatch.name}
                                        aria-pressed=${context.value === swatch.value ? 'true' : 'false'}
                                        ?disabled=${disabled}
                                        @click=${() => context.component.setValue(swatch.value)}
                                ></button>
                            `)}
                        </span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}

            ${context.clearable && isSet ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                        <sf-icon-button
                                appearance="link"
                                size=${size}
                                icon="restart_alt"
                                data-action="clear"
                                aria-label=${context.clearLabel}
                                ?disabled=${disabled}
                                @click=${() => context.component.clear()}
                        ></sf-icon-button>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        </div>
    `;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "53bac87b41ad"
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
/******/ 	let __webpack_exports__ = __webpack_require__("3dd6551de8f2");
/******/
/******/ })()
;