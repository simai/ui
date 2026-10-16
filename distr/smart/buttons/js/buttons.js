/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "06e8cd089f28"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   clearDeprecations: () => (/* binding */ clearDeprecations),
/* harmony export */   listDeprecations: () => (/* binding */ listDeprecations),
/* harmony export */   noteDeprecated: () => (/* binding */ noteDeprecated)
/* harmony export */ });
// What a page still uses that the Framework keeps only for compatibility. Every
// legacy attribute, value or name a component resolves is noted here once, so a
// person, a probe or an AI upgrading a product can read the list off a running
// page (SF.deprecations.list()) instead of searching the source for it. The
// records behind the names are in contracts/changes/journal.json.
//
// Nothing is printed by default: a page opts in to console warnings with
// <html data-sf-deprecations="warn"> or SF.deprecations.warn = true.
//
// Every bundle carries its own copy of this module, so a Map of its own made one
// list per bundle, and SF.deprecations.list() answered with whichever bundle set
// it last -- [] on a page printing seven warnings from others. The notes live on
// one shared global instead, whichever copy writes or reads them.
function sharedNotes() {
  const root = globalThis.SF = globalThis.SF || {};

  if (!(root.__deprecationNotes instanceof Map)) {
    Object.defineProperty(root, '__deprecationNotes', {
      value: new Map(),
      configurable: true
    });
  }

  return root.__deprecationNotes;
}

function warnEnabled() {
  const root = globalThis.document?.documentElement;
  return root?.dataset?.sfDeprecations === 'warn' || globalThis.SF?.deprecations?.warn === true;
}

function noteDeprecated({
  component = '',
  kind = 'attribute',
  attribute = '',
  from,
  to = null
} = {}) {
  if (!from) return;
  const key = [component, kind, attribute, from].join('|');
  const notes = sharedNotes();
  const existing = notes.get(key);

  if (existing) {
    existing.count += 1;
    return;
  }

  notes.set(key, {
    component,
    kind,
    attribute,
    from,
    to,
    count: 1
  });

  if (warnEnabled()) {
    const where = component ? `${component}: ` : '';
    const what = kind === 'value' ? `${attribute}="${from}"` : `${kind} ${from}`;
    globalThis.console?.warn?.(`[Simai Framework] ${where}${what} is a legacy name${to ? `; write ${to}` : ''}. See contracts/changes/journal.json.`);
  }
}
function listDeprecations() {
  return [...sharedNotes().values()].map(note => ({ ...note
  }));
}
function clearDeprecations() {
  sharedNotes().clear();
}

if (typeof globalThis !== 'undefined') {
  globalThis.SF = globalThis.SF || {};
  const api = globalThis.SF.deprecations || {};
  api.list = listDeprecations;
  api.clear = clearDeprecations;
  api.note = noteDeprecated;
  globalThis.SF.deprecations = api;
}

/***/ },

/***/ "c76f8895b630"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("fbe0570fcc69");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5168bdf4a1f9");
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("ddf1cdb42ecc");
/* harmony import */ var _core_js_control_spacing__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("2feae72af89f");
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("06e8cd089f28");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _js_templates_default__WEBPACK_IMPORTED_MODULE_1__, lit__WEBPACK_IMPORTED_MODULE_2__, _core_js_control_spacing__WEBPACK_IMPORTED_MODULE_3__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _js_templates_default__WEBPACK_IMPORTED_MODULE_1__, lit__WEBPACK_IMPORTED_MODULE_2__, _core_js_control_spacing__WEBPACK_IMPORTED_MODULE_3__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _core_js_control_spacing__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_core_js_control_spacing__WEBPACK_IMPORTED_MODULE_3__);





const COMPONENT_ATTRIBUTES = new Set(["template", "size", "appearance", "type", "scheme", "status", "text", "icon", "icon-start", "icon-end", "icon-left", "icon-right", "icon-position", "text-position", "spacing", "tightness", "radius", "root-class", "loading", "segment", "disabled", "native-type", "aria-label", "class", "style", "id", "slot"]);

function applyButtonAttributes(host, button) {
  host?.forwardHostAttributes(button, {
    exclude: COMPONENT_ATTRIBUTES,
    transferDataAttributes: true,
    storageKey: "__sfButtonForwardedDataAttributes",
    targetStorageKey: "__sfButtonAttributeKeys"
  });
} // Ghost is the link appearance under its old name: the class sf-button--ghost
// already reads as sf-button--link (journal class-button-ghost-to-link), and
// the Smart value now says the same instead of drawing the retired class
// (docs trial 4, 2026-10-15; journal value-button-ghost-to-link).


const BUTTON_APPEARANCES = ["default", "tonal", "outline", "link", "surface"];
const APPEARANCE_ALIASES = {
  ghost: "link"
};

class SfButton extends (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()) {
  constructor() {
    super();
    this._attributeObserver = null;
  }

  static get props() {
    return {
      templateName: {
        attribute: "template",
        default: "default"
      },
      size: {
        default: "1"
      },
      // The axis is called appearance, because that is the question it answers.
      // `type` keeps working: see contracts/public-api-axes.json.
      appearance: {
        default: "default",
        aliases: ["type"]
      },
      scheme: {
        default: "primary"
      },
      // What the control is about, in the shared status vocabulary. A scheme says
      // which colour family a control takes; a status says what it does, and the
      // only one a control paints today is the destructive error. The two cannot
      // both colour it, so a status wins where it is set.
      status: {
        default: "",
        values: ["", "error"]
      },
      textPosition: {
        type: String,
        default: 'center'
      },
      text: {
        default: ""
      },
      segment: {
        default: ""
      },
      icon: {
        default: ""
      },
      iconStart: {
        type: String,
        default: null
      },
      iconEnd: {
        type: String,
        default: null
      },
      iconLeft: {
        default: ""
      },
      iconRight: {
        default: ""
      },
      iconPosition: {
        default: "start"
      },
      spacing: {
        type: String,
        default: null
      },
      tightness: {
        default: "",
        values: ["", "low", "high", "highest"]
      },
      radius: {
        default: "",
        values: ["", "default", "square", "rounded"]
      },
      rootClass: {
        default: ""
      },
      loading: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      nativeType: {
        default: "button"
      },
      ariaLabel: {
        default: ""
      }
    };
  }

  get templateName() {
    return this.getAttribute("template") || "default";
  }

  get size() {
    return this.getAttribute("size") || "1";
  } // A value outside the list draws the default button. It drew none: an unknown
  // appearance (type="primary", a scheme written where the appearance goes) gave
  // the class sf-button--primary twice and no fill, no border, no padding.


  get appearance() {
    const value = this.getAttribute("appearance") || this.getAttribute("type") || "default";

    if (Object.hasOwn(APPEARANCE_ALIASES, value)) {
      (0,_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_4__.noteDeprecated)({
        component: this.localName,
        kind: 'value',
        attribute: 'appearance',
        from: value,
        to: APPEARANCE_ALIASES[value]
      });
      return APPEARANCE_ALIASES[value];
    }

    return BUTTON_APPEARANCES.includes(value) ? value : "default";
  } // The legacy name, kept so a consumer reading el.type still gets an answer.


  get type() {
    return this.appearance;
  }

  get scheme() {
    return this.getAttribute("scheme") || "primary";
  }

  get status() {
    return this.getAttribute("status") || "";
  }

  get text() {
    return this.getAttribute("text") || "";
  }

  get icon() {
    return this.getAttribute("icon") || "";
  } // Null when neither attribute is there, and '' only when one of them is there
  // and empty. The template tells those apart on purpose: an empty icon-start is
  // a consumer saying «no icon here», and it suppresses the `icon` shortcut,
  // while an absent one lets the shortcut through. Both answered '' before, so
  // «never written» read as «deliberately emptied» and `icon="add"` on a button
  // drew nothing at all -- the shortcut the manifest has always described has
  // never once worked (owner, 2026-10-09).


  get iconLeft() {
    return this.getAttribute('icon-start') ?? this.getAttribute('icon-left');
  }

  get iconRight() {
    return this.getAttribute('icon-end') ?? this.getAttribute('icon-right');
  }

  get iconStart() {
    return this.iconLeft;
  }

  get iconEnd() {
    return this.iconRight;
  }

  get iconPosition() {
    return this.getAttribute("icon-position") || "start";
  }

  get tightness() {
    return (0,_core_js_control_spacing__WEBPACK_IMPORTED_MODULE_3__.resolveControlSpacing)({
      spacing: this.getAttribute('spacing'),
      tightness: this.getAttribute('tightness')
    }).tightness;
  }

  get spacing() {
    return (0,_core_js_control_spacing__WEBPACK_IMPORTED_MODULE_3__.resolveControlSpacing)({
      spacing: this.getAttribute('spacing'),
      tightness: this.getAttribute('tightness')
    }).spacing;
  }

  get radius() {
    return this.getEnumAttr("radius", ["default", "square", "rounded"], "");
  }

  get rootClass() {
    return this.getAttribute("root-class") || "";
  }

  get loading() {
    return this.getBooleanAttr("loading", false);
  }

  get disabled() {
    return this.getBooleanAttr("disabled", false);
  }

  get nativeType() {
    return this.getAttribute("native-type") || "button";
  }

  get ariaLabel() {
    return this.getAttribute("aria-label") || "";
  }

  templateContext() {
    const props = this.getPropsContext();
    return this.createTemplateContext({ ...props,
      iconLeft: props.iconStart ?? props.iconLeft,
      iconRight: props.iconEnd ?? props.iconRight,
      // Resolved names the template reads (contracts/template-context.json).
      iconStart: this.iconStart,
      iconEnd: this.iconEnd,
      type: this.type,
      // A legacy appearance reaches the template under its current name, as the
      // getter reports it (journal value-button-ghost-to-link).
      appearance: props.appearance === 'ghost' ? 'link' : props.appearance,
      ...(0,_core_js_control_spacing__WEBPACK_IMPORTED_MODULE_3__.resolveControlSpacing)({
        spacing: this.getAttribute('spacing'),
        tightness: this.getAttribute('tightness')
      }),
      component: this
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_1__.renderButtonTemplate)(this.templateContext());
  }

  resolveUpdateMode() {
    return "lit";
  }

  afterRender() {
    const button = this.querySelector(".sf-button");
    applyButtonAttributes(this, button);

    if (!this._attributeObserver) {
      this._attributeObserver = this.observeForwardedHostAttributes(() => this.querySelector(".sf-button"), {
        exclude: COMPONENT_ATTRIBUTES,
        transferDataAttributes: true,
        storageKey: "__sfButtonForwardedDataAttributes",
        targetStorageKey: "__sfButtonAttributeKeys"
      })._forwardHostAttributeObserver;
    }
  }

  get value() {
    return {
      template: this.templateName,
      size: this.size,
      appearance: this.appearance,
      type: this.type,
      scheme: this.scheme,
      status: this.status,
      text: this.text,
      icon: this.icon,
      iconLeft: this.iconLeft,
      iconRight: this.iconRight,
      iconStart: this.iconStart,
      iconEnd: this.iconEnd,
      iconPosition: this.iconPosition,
      tightness: this.tightness,
      spacing: this.spacing,
      radius: this.radius,
      rootClass: this.rootClass,
      loading: this.loading,
      disabled: this.disabled,
      nativeType: this.nativeType,
      ariaLabel: this.ariaLabel
    };
  }

  onClick(handler, options) {
    if (typeof handler === "function") {
      this.addEventListener("click", handler, options);
    }

    return this;
  }

  onFocus(handler, options) {
    if (typeof handler === "function") {
      this.addEventListener("focusin", handler, options);
    }

    return this;
  }

  onBlur(handler, options) {
    if (typeof handler === "function") {
      this.addEventListener("focusout", handler, options);
    }

    return this;
  }

  onMouseEnter(handler, options) {
    if (typeof handler === "function") {
      this.addEventListener("mouseenter", handler, options);
    }

    return this;
  }

  onMouseLeave(handler, options) {
    if (typeof handler === "function") {
      this.addEventListener("mouseleave", handler, options);
    }

    return this;
  }

  setDisabled(nextValue = true) {
    if (nextValue) {
      this.setAttribute("disabled", "");
    } else {
      this.removeAttribute("disabled");
    }

    return this;
  }

  createIcon(name) {
    if (!name) return "";
    return (0,lit__WEBPACK_IMPORTED_MODULE_2__.html)`<sf-icon icon="${name}" root-class="pointer-event-none" weight="400" aria-hidden="true"></sf-icon>`;
  }

  set value(nextValue) {
    this.setValueAttributes(nextValue);
  }

  onDisconnected() {
    this.disconnectForwardedHostAttributes();
    this._attributeObserver = null;
    super.onDisconnected?.();
  }

}

SfButton.define("sf-button");
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "5168bdf4a1f9"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderButtonTemplate: () => (/* binding */ renderButtonTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ddf1cdb42ecc");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);

function renderButtonTemplate(context) {
  const {
    size,
    appearance,
    type,
    scheme,
    status,
    text,
    icon,
    iconLeft,
    iconRight,
    iconPosition,
    spacing,
    radius,
    rootClass,
    textPosition,
    loading,
    disabled,
    nativeType,
    ariaLabel,
    segment
  } = context;
  const normalizedIconPosition = String(iconPosition || 'start').toLowerCase();
  const isIconEnd = ['right', 'end'].includes(normalizedIconPosition);
  const leftIconName = context.iconStart ?? (iconLeft || (icon && !isIconEnd ? icon : ''));
  const rightIconName = context.iconEnd ?? (iconRight || (icon && isIconEnd ? icon : ''));
  const component = context.component;
  const leftIconContent = component?.hasSlotContent?.('icon-start') ? component.getSlotContent('icon-start') : component?.hasSlotContent?.('icon-left') ? component.getSlotContent('icon-left') : component.createIcon(leftIconName);
  const rightIconContent = component?.hasSlotContent?.('icon-end') ? component.getSlotContent('icon-end') : component?.hasSlotContent?.('icon-right') ? component.getSlotContent('icon-right') : component.createIcon(rightIconName);
  const textContent = component?.hasSlotContent?.('text') ? component.getSlotContent('text') : text;
  const fullText = !leftIconContent && !rightIconContent;
  const rootClasses = ['sf-button', `sf-button--size-${size}`, `sf-button--${appearance || type}`, // One colour name, as the styles expect: the status when one is set, the
  // scheme otherwise. A status says what the control is about -- an error
  // for something destructive -- and a scheme says which colour family it
  // takes; they cannot both paint it.
  `sf-button--${status || scheme}`, 'flex', 'items-cross-center', segment ? `segment-${segment}` : '', // The spacing class, not its retired tightness name (journal
  // class-tightness-to-spacing; docs trial 4).
  spacing && spacing !== 'normal' ? `spacing-${spacing}` : '', radius ? `radius-${radius}` : '', rootClass, loading ? 'loading sf-button-state-loading' : ''].filter(Boolean);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <button
                type=${nativeType}
                class=${rootClasses.join(' ')}
                style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ?disabled=${disabled || loading}
                aria-label=${ariaLabel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                aria-busy=${loading ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        >
            ${leftIconContent}
            ${textContent ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span
                    class="sf-button-text-container text-${textPosition} pointer-event-none${fullText ? ' flex-1' : ''}">
        ${textContent}
      </span>` : ''}
            ${rightIconContent}
        </button>
    `;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "2feae72af89f"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("control-spacing") : new Promise((resolve) => globalThis.addEventListener("sf-runtime-ready", () => resolve(globalThis.SF.runtimeModule("control-spacing")), { once: true })));

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
/******/ 	let __webpack_exports__ = __webpack_require__("c76f8895b630");
/******/
/******/ })()
;