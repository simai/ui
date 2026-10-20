/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "50d2a204ba4c"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SPINNER_GRID: () => (/* binding */ SPINNER_GRID),
/* harmony export */   SPINNER_STROKE: () => (/* binding */ SPINNER_STROKE),
/* harmony export */   createInlineSpinner: () => (/* binding */ createInlineSpinner),
/* harmony export */   createLadderArcSvg: () => (/* binding */ createLadderArcSvg),
/* harmony export */   createSvgNode: () => (/* binding */ createSvgNode)
/* harmony export */ });
// The spinner's drawing, without the component's side effects (no registry, no
// observer), so a control that shows work in place of its icon -- a button, an
// icon button, a group's segment -- draws the one spinner of the Framework
// without loading or binding the spinner component (simai/ui-source#10).
//
// The ladder: a spinner is drawn on the icon grid. Material Symbols are drawn on
// 24 units and, at the regular weight the Framework's controls use, stroke 2 of
// them; a spinner on the same grid, scaled to the icon box of a step, strokes as
// the icons of that step do, and needs no stroke of its own per step.
const SVG_NS = 'http://www.w3.org/2000/svg';
const SPINNER_GRID = 24;
const SPINNER_STROKE = 2;
function createSvgNode(tagName, attributes = {}) {
  const node = document.createElementNS(SVG_NS, tagName);
  Object.entries(attributes).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return;
    }

    node.setAttribute(key, String(value));
  });
  return node;
} // The arc on the icon grid. The circles carry presentation attributes as well
// as their classes: the spinner sheet styles them (track colour, the arc's
// motion, the still arc under reduced motion), and until that sheet has arrived
// they draw a faint ring in the current ink rather than a filled black disc.

function createLadderArcSvg() {
  const centre = SPINNER_GRID / 2;
  const radius = centre - SPINNER_STROKE / 2;
  const svg = createSvgNode('svg', {
    class: 'sf-loader-svg',
    viewBox: `0 0 ${SPINNER_GRID} ${SPINNER_GRID}`,
    'aria-hidden': 'true',
    focusable: 'false'
  });
  const filled = createSvgNode('circle', {
    class: 'sf-loader-ring-filled',
    cx: centre,
    cy: centre,
    r: radius,
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': SPINNER_STROKE,
    opacity: '0.3'
  });
  const accent = createSvgNode('circle', {
    class: 'sf-loader-ring-accent',
    cx: centre,
    cy: centre,
    r: radius,
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': SPINNER_STROKE,
    'stroke-linecap': 'round',
    pathLength: 100,
    'stroke-dasharray': '0 100',
    transform: `rotate(90 ${centre} ${centre})`
  });
  svg.append(filled, accent);
  return svg;
} // A spinner that stands in a control: an endless arc, decorative (the control
// keeps its label and says aria-busy), and marked bound so the spinner
// component, when it is on the page, leaves it as drawn. `className` names the
// control's slot for it; `overlay` lays it over the control's hidden label
// instead of in the place of an icon.

function createInlineSpinner({
  className = '',
  overlay = false
} = {}) {
  const root = document.createElement('span');
  root.className = ['sf-loader-container', 'sf-loader--infinite', className, className && overlay ? `${className}--overlay` : ''].filter(Boolean).join(' ');
  root.dataset.sfSpinnerBound = '1';
  root.dataset.infinite = 'true';
  root.setAttribute('aria-hidden', 'true');
  const indicator = document.createElement('span');
  indicator.className = 'sf-loader--loading-indicator';
  indicator.append(createLadderArcSvg());
  root.append(indicator);
  return root;
}

/***/ },

/***/ "2557e7cf84cc"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("fbe0570fcc69");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("7a7da66f4cf1");
/* harmony import */ var _core_js_control_spacing__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("2feae72af89f");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _js_templates_default__WEBPACK_IMPORTED_MODULE_1__, _core_js_control_spacing__WEBPACK_IMPORTED_MODULE_2__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _js_templates_default__WEBPACK_IMPORTED_MODULE_1__, _core_js_control_spacing__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_control_spacing__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_core_js_control_spacing__WEBPACK_IMPORTED_MODULE_2__);



const COMPONENT_ATTRIBUTES = new Set(['template', 'kind', 'variant', 'size', 'appearance', 'type', 'scheme', 'status', 'icon', 'filled', 'spacing', 'tightness', 'radius', 'segment', 'root-class', 'loading', 'disabled', 'native-type', 'aria-label', 'class', 'style', 'id', 'slot']);

function applyButtonAttributes(host, button) {
  host?.forwardHostAttributes(button, {
    exclude: COMPONENT_ATTRIBUTES,
    transferDataAttributes: true,
    storageKey: '__sfIconButtonForwardedDataAttributes',
    targetStorageKey: '__sfIconButtonAttributeKeys'
  });
}

const ICON_BUTTON_APPEARANCES = ['default', 'tonal', 'outline', 'link', 'surface', 'ghost'];

class SfIconButton extends (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()) {
  constructor() {
    super();
    this._attributeObserver = null;
  }

  static get props() {
    return {
      templateName: {
        attribute: 'template',
        default: 'default'
      },
      // The axis is called kind, because that is the question it answers.
      // `variant` keeps working: see contracts/public-api-axes.json.
      kind: {
        default: 'icon',
        values: ['icon', 'close'],
        aliases: ['variant']
      },
      size: {
        default: '1'
      },
      // The axis is called appearance, because that is the question it answers.
      // `type` keeps working: see contracts/public-api-axes.json.
      appearance: {
        default: 'default',
        aliases: ['type']
      },
      scheme: {
        default: 'primary'
      },
      // What the control is about, in the shared status vocabulary. A scheme says
      // which colour family a control takes; a status says what it does, and the
      // only one a control paints today is the destructive error. The two cannot
      // both colour it, so a status wins where it is set.
      status: {
        default: '',
        values: ['', 'error']
      },
      segment: {
        default: ''
      },
      icon: {
        default: 'add'
      },
      filled: {
        type: Boolean,
        default: false
      },
      spacing: {
        type: String,
        default: null
      },
      tightness: {
        default: '',
        values: ['', 'low', 'high', 'highest']
      },
      radius: {
        default: '',
        values: ['', 'default', 'square', 'rounded']
      },
      rootClass: {
        default: ''
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
        default: 'button'
      },
      ariaLabel: {
        default: ''
      }
    };
  }

  get templateName() {
    return this.getAttribute('template') || 'default';
  }

  get size() {
    return this.getAttribute('size') || '1';
  }

  get kind() {
    return this.getProp('kind');
  } // The legacy name, kept so a consumer reading el.variant still gets an answer.


  get variant() {
    return this.kind;
  } // A value outside the list draws the default button, as sf-button does; an
  // unknown appearance drew a button with no fill and no border.


  get appearance() {
    const value = this.getAttribute('appearance') || this.getAttribute('type') || 'default';
    return ICON_BUTTON_APPEARANCES.includes(value) ? value : 'default';
  } // The legacy name, kept so a consumer reading el.type still gets an answer.


  get type() {
    return this.appearance;
  }

  get scheme() {
    return this.getAttribute('scheme') || 'primary';
  }

  get status() {
    return this.getAttribute('status') || '';
  }

  get icon() {
    return this.getAttribute('icon') || 'add';
  }

  get segment() {
    return this.getEnumAttr('segment', ['start', 'middle', 'end'], '');
  }

  get filled() {
    return this.getBooleanAttr('filled', false);
  }

  get tightness() {
    return (0,_core_js_control_spacing__WEBPACK_IMPORTED_MODULE_2__.resolveControlSpacing)({
      spacing: this.getAttribute('spacing'),
      tightness: this.getAttribute('tightness')
    }).tightness;
  }

  get spacing() {
    return (0,_core_js_control_spacing__WEBPACK_IMPORTED_MODULE_2__.resolveControlSpacing)({
      spacing: this.getAttribute('spacing'),
      tightness: this.getAttribute('tightness')
    }).spacing;
  }

  get radius() {
    return this.getEnumAttr('radius', ['default', 'square', 'rounded'], '');
  }

  get rootClass() {
    return this.getAttribute('root-class') || '';
  }

  get loading() {
    return this.getBooleanAttr('loading', false);
  }

  get disabled() {
    return this.getBooleanAttr('disabled', false);
  }

  get nativeType() {
    return this.getAttribute('native-type') || 'button';
  }

  get ariaLabel() {
    return this.getAttribute('aria-label') || '';
  }

  templateContext() {
    const props = this.getPropsContext();
    return this.createTemplateContext({ ...props,
      // Resolved names the template reads (contracts/template-context.json).
      type: this.type,
      variant: this.variant,
      ...(0,_core_js_control_spacing__WEBPACK_IMPORTED_MODULE_2__.resolveControlSpacing)({
        spacing: this.getAttribute('spacing'),
        tightness: this.getAttribute('tightness')
      }),
      component: this
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_1__.renderIconButtonTemplate)(this.templateContext());
  }

  resolveUpdateMode(changedAttributes = []) {
    // loading is drawn by the template, not patched: it puts the spinner in
    // place of the icon (simai/ui-source#10).
    const directPatchAttributes = ['disabled', 'aria-label', 'icon'];

    if (changedAttributes.length > 0 && changedAttributes.every(attr => directPatchAttributes.includes(attr))) {
      return 'dom';
    }

    return 'lit';
  }

  updateDom(changedAttributes = []) {
    const button = this.querySelector('.sf-icon-button');
    if (!button) return false;

    if (changedAttributes.includes('disabled')) {
      button.disabled = this.disabled || this.loading;
    }

    if (changedAttributes.includes('aria-label')) {
      if (this.ariaLabel) {
        button.setAttribute('aria-label', this.ariaLabel);
      } else {
        button.removeAttribute('aria-label');
      }
    }

    if (changedAttributes.includes('icon')) {
      const iconNode = button.querySelector('.sf-icon');

      if (iconNode) {
        iconNode.textContent = this.icon;
      }
    }

    applyButtonAttributes(this, button);
    return true;
  }

  afterRender() {
    const button = this.querySelector('.sf-icon-button');
    applyButtonAttributes(this, button);

    if (!this._attributeObserver) {
      this._attributeObserver = this.observeForwardedHostAttributes(() => this.querySelector('.sf-icon-button'), {
        exclude: COMPONENT_ATTRIBUTES,
        transferDataAttributes: true,
        storageKey: '__sfIconButtonForwardedDataAttributes',
        targetStorageKey: '__sfIconButtonAttributeKeys'
      })._forwardHostAttributeObserver;
    }
  }

  get value() {
    return {
      template: this.templateName,
      size: this.size,
      variant: this.variant,
      appearance: this.appearance,
      type: this.type,
      scheme: this.scheme,
      status: this.status,
      icon: this.icon,
      segment: this.segment,
      filled: this.filled,
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

  setButtonAttributes(attributes = {}) {
    this.setState({
      buttonAttributes: attributes
    });
    return this;
  }

  onClick(handler, options) {
    if (typeof handler === 'function') {
      this.addEventListener('click', handler, options);
    }

    return this;
  }

  onFocus(handler, options) {
    if (typeof handler === 'function') {
      this.addEventListener('focusin', handler, options);
    }

    return this;
  }

  onBlur(handler, options) {
    if (typeof handler === 'function') {
      this.addEventListener('focusout', handler, options);
    }

    return this;
  }

  onMouseEnter(handler, options) {
    if (typeof handler === 'function') {
      this.addEventListener('mouseenter', handler, options);
    }

    return this;
  }

  onMouseLeave(handler, options) {
    if (typeof handler === 'function') {
      this.addEventListener('mouseleave', handler, options);
    }

    return this;
  }

  setDisabled(nextValue = true) {
    if (nextValue) {
      this.setAttribute('disabled', '');
    } else {
      this.removeAttribute('disabled');
    }

    return this;
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

SfIconButton.define('sf-icon-button');
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "7a7da66f4cf1"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderIconButtonTemplate: () => (/* binding */ renderIconButtonTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ddf1cdb42ecc");
/* harmony import */ var _default_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("9a0682afab99");
/* harmony import */ var _component_spinner_js_spinner_draw__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("50d2a204ba4c");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);



const ICON_BUTTON_SIZES = new Set(['1/3', '1/2', '1', '2', '3']);
function renderIconButtonTemplate(context) {
  const {
    size,
    appearance,
    type,
    scheme,
    status,
    icon,
    segment,
    tightness,
    kind,
    variant,
    radius,
    filled,
    rootClass,
    loading,
    disabled,
    nativeType,
    ariaLabel
  } = context;
  const rootClasses = ['sf-icon-button', // The sizes the icon button draws; a close may be smaller (1/4, the
  // closable tag's), and then sf-close sizes it alone: the class it got
  // here had no rule (documentation trial 6, 2026-10-18).
  ICON_BUTTON_SIZES.has(size || '1') ? `sf-icon-button--size-${size || '1'}` : '', `sf-icon-button--${kind ?? variant ?? 'icon'}`, `sf-icon-button--${appearance || type || 'default'}`, 'flex', 'items-cross-center', segment ? `segment-${segment}` : '', // One colour name, as the styles expect: the status when one is set, the
  // scheme otherwise. A status says what the control is about -- an error
  // for something destructive -- and a scheme says which colour family it
  // takes; they cannot both paint it.
  `sf-icon-button--${status || scheme || 'primary'}`, tightness ? `tightness-${tightness}` : '', radius ? `radius-${radius}` : '', rootClass, loading ? 'loading sf-icon-button-state-loading' : ''].filter(Boolean); // Loading shows the spinner in place of the icon, at the icon's size
  // (simai/ui-source#10); the button keeps its name and says aria-busy.

  const iconContent = loading ? (0,_component_spinner_js_spinner_draw__WEBPACK_IMPORTED_MODULE_2__.createInlineSpinner)({
    className: 'sf-icon-button-spinner'
  }) : context.component?.hasSlotContent?.('icon') ? context.component.getSlotContent('icon') : (kind ?? variant) === 'close' ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                            <sf-close root-class="pointer-event-none" size="${size || '1'}"></sf-close>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                            <sf-icon filled="${filled}" root-class="pointer-event-none" icon="${icon}" weight="400" aria-hidden="true"></sf-icon>`;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <button
                type=${nativeType}
                class=${rootClasses.join(' ')}
                style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ?disabled=${disabled || loading}
                aria-label=${ariaLabel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                aria-busy=${loading ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        >
            ${iconContent}
        </button>
    `;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "9a0682afab99"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


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
/******/ 	let __webpack_exports__ = __webpack_require__("2557e7cf84cc");
/******/
/******/ })()
;