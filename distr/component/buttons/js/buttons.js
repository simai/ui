/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "176a9b5b7b35"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d7f974466839");
/* harmony import */ var _json_button_utility_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("c71a77b9cdfb");
/* harmony import */ var _register_helper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("58661bec99a6");
/* harmony import */ var _spinner_js_spinner_draw__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("50d2a204ba4c");





class Buttons extends _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__.ComponentObserver {
  static componentName = 'Buttons';
  html = null;

  constructor(props) {
    super(props);
    const {
      size = '1',
      type = 'default',
      scheme = 'primary',
      text = '',
      icon,
      iconLeft,
      iconRight,
      iconPosition = 'start',
      tightness,
      spacing,
      radius,
      loading = false,
      disabled = false,
      utilities = {}
    } = this.params || {};
    const className = this.attrs.class || this.attrs.className;
    this.button = document.createElement('button');

    if (this.id) {
      this.button.id = this.id;
    }

    this.button.classList.add('sf-button', `sf-button--size-${size}`, `sf-button--${type}`, `sf-button--${scheme}`); // The readable names for the same steps: compact, comfortable, spacious.
    // `normal` is the default and needs no class. When both options are given,
    // `spacing` wins, as it does on the Smart element (control-spacing.js), so
    // one control never carries two different steps.

    const hasSpacing = ['normal', 'compact', 'comfortable', 'spacious'].includes(spacing);

    if (hasSpacing && spacing !== 'normal') {
      this.button.classList.add(`spacing-${spacing}`);
    } else if (!hasSpacing && tightness) {
      this.button.classList.add(`tightness-${tightness}`);
    }

    if (radius) {
      this.button.classList.add(`radius-${radius}`);
    }

    if (loading) {
      this.button.classList.add('loading', 'sf-button-state-loading');
      this.button.setAttribute('aria-busy', 'true');
      this.button.disabled = true;
    }

    if (disabled) {
      this.button.disabled = true;
    }

    if (className) {
      this.button.classList.add(...`${className}`.split(' ').filter(Boolean));
    }

    Object.entries(this.attrs).filter(([attr]) => !['class', 'className'].includes(attr)).forEach(([attr, value]) => {
      if (value === undefined || value === null) {
        return;
      }

      this.button.setAttribute(attr, value);
    }); // Avoid implicit "submit" behavior inside forms unless explicitly overridden.

    if (!this.button.hasAttribute('type')) {
      this.button.setAttribute('type', 'button');
    }

    const normalizedIconPosition = `${iconPosition}`.toLowerCase();
    const isIconEnd = ['right', 'end'].includes(normalizedIconPosition);
    const leftIconName = iconLeft ?? (icon && !isIconEnd ? icon : null);
    const rightIconName = iconRight ?? (icon && isIconEnd ? icon : null);
    this.iconLeft = this.createIcon(leftIconName);
    this.iconRight = this.createIcon(rightIconName);
    this.textContainer = document.createElement('span');
    this.textContainer.classList.add('sf-button-text-container');
    this.textElement = document.createElement('span');
    this.textElement.classList.add('sf-button-text');
    this.textContainer.textContent = text;
    this.applyLayoutUtilities(this.button, '.sf-button');
    this.applyLayoutUtilities(this.iconLeft, '.sf-button .sf-icon');
    this.applyLayoutUtilities(this.iconRight, '.sf-button .sf-icon');
    this.applyLayoutUtilities(this.textContainer, '.sf-button .sf-button-text-container');
    this.applyUtilities(this.button, utilities.button ?? utilities);
    this.applyUtilities(this.iconLeft, utilities.icon);
    this.applyUtilities(this.iconRight, utilities.icon);
    this.applyUtilities(this.textContainer, utilities.textContainer); // Loading shows the spinner at the icon's size (simai/ui-source#10): in
    // place of the start icon, else of the end icon; without an icon it lies
    // over the label, which keeps its place and stays the accessible name.

    let startNode = this.iconLeft;
    let endNode = this.iconRight;

    if (loading) {
      const overlay = !startNode && !endNode;
      this.spinner = (0,_spinner_js_spinner_draw__WEBPACK_IMPORTED_MODULE_3__.createInlineSpinner)({
        className: 'sf-button-spinner',
        overlay
      });
      if (startNode) startNode = this.spinner;else if (endNode) endNode = this.spinner;else this.button.append(this.spinner);
    }

    if (startNode) {
      this.button.append(startNode);
    }

    this.button.append(this.textContainer);

    if (endNode) {
      this.button.append(endNode);
    }

    this.template = this.button;
  }

  createIcon(name) {
    if (!name) {
      return null;
    }

    const icon = document.createElement('i');
    icon.classList.add('sf-icon');
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = name;
    return icon;
  }

  applyUtilities(target, utilities) {
    if (!target || !utilities) {
      return;
    }

    const normalize = value => {
      if (Array.isArray(value)) return value;
      if (typeof value === 'string') return value.split(' ');
      if (Array.isArray(value?.classes)) return value.classes;
      if (typeof value?.classes === 'string') return value.classes.split(' ');
      if (Array.isArray(value?.button)) return value.button;
      if (typeof value?.button === 'string') return value.button.split(' ');
      return [];
    };

    normalize(utilities).filter(Boolean).forEach(cls => target.classList.add(cls));
  }

}

Buttons.utilityMap = _json_button_utility_json__WEBPACK_IMPORTED_MODULE_1__;
(0,_register_helper__WEBPACK_IMPORTED_MODULE_2__["default"])('Buttons', Buttons);

/***/ },

/***/ "757f80eca5ff"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _buttons__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("176a9b5b7b35");
/*
* Main JS file for including JS for component.
*
* Imports:
* - Base function component (_component_name.js)
*/


/***/ },

/***/ "58661bec99a6"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   registerComponent: () => (/* binding */ registerComponent)
/* harmony export */ });
// Simple helper to register a component in one call.
// Usage inside component bundle:
//   import register from './register-helper';
//   register('Buttons', Buttons);
function registerComponent(name, cls) {
  if (!name || !cls) return;

  if (typeof window !== 'undefined' && typeof window.registerSfComponent === 'function') {
    window.registerSfComponent(name, cls);
    return;
  }

  if (typeof window !== 'undefined' && window.SF?.Loader?.registerComponent) {
    window.SF.Loader.registerComponent(name, cls);
    return;
  }

  if (typeof window !== 'undefined') {
    const pending = window.SF_PENDING_COMPONENTS = window.SF_PENDING_COMPONENTS || [];
    pending.push([name, cls]);
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (registerComponent);

/***/ },

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

/***/ "d7f974466839"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ComponentObserver: () => (/* binding */ ComponentObserver)
/* harmony export */ });
class ComponentObserver {
  // Components name themselves with a static field (static componentName =
  // 'Modal'), and the Loader writes the name on the prototype only when it
  // registers the class; the lifecycle events read the instance, so an
  // instance made before that announced itself as `undefined:render`. Not a
  // getter: the Loader assigns the prototype property, and an accessor
  // without a setter made that assignment throw.
  lifecycleName() {
    return this.componentName ?? this.constructor.componentName;
  }

  constructor(props) {
    this.props = props;
    this.id = props?.id;
    this.params = props?.param;
    this.attrs = props?.attrs || {};
    this.template = null;
    window.dispatchEvent(new CustomEvent(`${this.lifecycleName()}:beforeRender`, {
      detail: this
    }));
  }

  getUtilityMap() {
    return this.constructor.utilityMap || null;
  }

  extractUtilityClasses(values) {
    if (!Array.isArray(values)) {
      return [];
    }

    const classes = new Set();
    values.forEach(value => {
      if (typeof value !== 'string') {
        return;
      }

      const matches = value.match(/\(([^)]+)\)/g);

      if (!matches) {
        return;
      }

      matches.forEach(match => {
        const raw = match.slice(1, -1);
        raw.split(/\s+/).filter(Boolean).forEach(cls => {
          // Only explicit (.class) annotations are classes; the
          // parentheses in var(--token) are CSS values, not markup.
          if (cls.startsWith('.') && cls.length > 1) classes.add(cls.slice(1));
        });
      });
    });
    return Array.from(classes);
  }

  applyLayoutUtilities(target, selector) {
    if (!target || !selector) {
      return;
    }

    const map = this.getUtilityMap();

    if (!map || !map[selector]) {
      return;
    }

    const classes = this.extractUtilityClasses(map[selector]);
    classes.forEach(cls => target.classList.add(cls));
  }

  render() {
    this.html = this.template;

    if (typeof this.init === 'function') {
      this.init();
    }

    if (this.html) {
      window.dispatchEvent(new CustomEvent(`${this.lifecycleName()}:render`, {
        detail: this
      }));
    }

    return this.html;
  }

  destroy() {
    this.destroyInternal?.();
    this.props = null;
    this.id = null;
    this.params = null;
    this.template = null;

    if (this.html) {
      this.html.remove();
      this.html = null;
    }

    window.dispatchEvent(new CustomEvent(`${this.lifecycleName()}:destroy`, {
      detail: this
    }));
  }

  destroyInternal() {}

}

/***/ },

/***/ "bef9a721ac58"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "c71a77b9cdfb"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{".sf-button":["display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","justify-content/center (.justify-center)","align-items/center (.items-center)"],".sf-button .sf-icon":["display/flex (.flex)","justify-content/center (.justify-center)","align-items/center (.items-center)"],".sf-button .sf-button-text-container":["display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","justify-content/center (.justify-center)","align-items/center (.items-center)"]}');

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
let __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("bef9a721ac58");
/* harmony import */ var _js_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("757f80eca5ff");
/**
* SIMAI Framework
* Copyright 2008-2026 SIMAI Ltd
* http://simai.studio
* Read the license: http://framework.simai.studio/license/
* Documentation: http://framework.simai.studio/
* Support: http://simai.studio/support/
*
* BUTTONS
*
* Entry point for importing components from this directory.
* Simplifies the import process in other parts of the project.
* Instead of importing individual files, all component can be imported through this file.
*/


})();

/******/ })()
;