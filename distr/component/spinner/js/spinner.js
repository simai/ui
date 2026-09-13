/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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

/***/ "eecc41af23fd"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bindSpinner: () => (/* binding */ bindSpinner),
/* harmony export */   createSpinnerArcSvg: () => (/* binding */ createSpinnerArcSvg),
/* harmony export */   createSpinnerDotsSvg: () => (/* binding */ createSpinnerDotsSvg),
/* harmony export */   renderSpinner: () => (/* binding */ renderSpinner),
/* harmony export */   unbindSpinner: () => (/* binding */ unbindSpinner)
/* harmony export */ });
/* harmony import */ var _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d7f974466839");
/* harmony import */ var _register_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("58661bec99a6");


const SVG_NS = 'http://www.w3.org/2000/svg';
const SPINNER_SELECTOR = '.sf-loader-container';
const SPINNER_BOUND_FLAG = 'sfSpinnerBound';

function toNumber(value, fallback) {
  const parsed = Number.parseFloat(String(value ?? ''));
  return Number.isFinite(parsed) ? parsed : fallback;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function normalizeChoice(value, allowed, fallback) {
  const normalized = String(value || '').trim().toLowerCase();
  return allowed.includes(normalized) ? normalized : fallback;
}

function createSvgNode(tagName, attributes = {}) {
  const node = document.createElementNS(SVG_NS, tagName);
  Object.entries(attributes).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return;
    }

    node.setAttribute(key, String(value));
  });
  return node;
}

function createSpinnerArcSvg({
  width = 58,
  height = 58,
  strokeWidth = 4
} = {}) {
  const safeWidth = clamp(toNumber(width, 58), 16, 256);
  const safeHeight = clamp(toNumber(height, safeWidth), 16, 256);
  const safeStroke = clamp(toNumber(strokeWidth, 4), 1, Math.min(safeWidth, safeHeight) / 2);
  const radius = Math.max(1, Math.min(safeWidth, safeHeight) / 2 - safeStroke / 2);
  const cx = safeWidth / 2;
  const cy = safeHeight / 2;
  const svg = createSvgNode('svg', {
    class: 'sf-loader-svg',
    viewBox: `0 0 ${safeWidth} ${safeHeight}`,
    width: safeWidth,
    height: safeHeight,
    'aria-hidden': 'true'
  });
  const filled = createSvgNode('circle', {
    class: 'sf-loader-ring-filled',
    cx,
    cy,
    r: radius
  });
  const accent = createSvgNode('circle', {
    class: 'sf-loader-ring-accent',
    cx,
    cy,
    r: radius,
    pathLength: 100,
    'stroke-dasharray': '0 100',
    transform: `rotate(90 ${cx} ${cy})`
  });
  svg.append(filled, accent);
  return svg;
}

function createSpinnerDotsSvg({
  width = 58,
  height = 58,
  dots = 16,
  filled = 6,
  dotRadius = null,
  direction = 'clockwise'
} = {}) {
  const safeWidth = clamp(toNumber(width, 58), 16, 256);
  const safeHeight = clamp(toNumber(height, safeWidth), 16, 256);
  const count = clamp(Math.floor(toNumber(dots, 16)), 3, 32);
  const activeDots = clamp(Math.floor(toNumber(filled, 6)), 1, count);
  const resolvedDotRadius = dotRadius === null ? Math.max(1.5, Math.min(safeWidth, safeHeight) * 0.06) : clamp(toNumber(dotRadius, 1), 1, Math.min(safeWidth, safeHeight) / 4);
  const orbitRadius = Math.max(resolvedDotRadius, Math.min(safeWidth, safeHeight) / 2 - resolvedDotRadius - 1);
  const cx = safeWidth / 2;
  const cy = safeHeight / 2;
  const svg = createSvgNode('svg', {
    class: 'sf-loader-svg',
    viewBox: `0 0 ${safeWidth} ${safeHeight}`,
    width: safeWidth,
    height: safeHeight,
    'aria-hidden': 'true',
    style: `--sf-loader-dot-count:${count}; --sf-loader-dot-filled:${activeDots};`
  });

  for (let index = 0; index < count; index += 1) {
    const angle = Math.PI * 2 / count * index - Math.PI / 2;
    const dotCx = cx + orbitRadius * Math.cos(angle);
    const dotCy = cy + orbitRadius * Math.sin(angle);
    const animationIndex = direction === 'counterclockwise' ? index : (count - index) % count;
    const dot = createSvgNode('circle', {
      class: `sf-loader-dot${index < activeDots ? ' sf-loader-dot--active' : ''}`,
      cx: dotCx,
      cy: dotCy,
      r: resolvedDotRadius,
      style: `--sf-loader-dot-index:${index}; --sf-loader-dot-step:${animationIndex};`
    });
    svg.append(dot);
  }

  return svg;
}

function getSpinnerConfig(root) {
  const indicator = root.querySelector('.sf-loader--loading-indicator');
  const circles = root.querySelector('.sf-loader--circles');
  const labelNode = root.querySelector('.sf-loader--text');
  const hasExplicitWidth = Object.prototype.hasOwnProperty.call(root.dataset, 'width') || Object.prototype.hasOwnProperty.call(root.dataset, 'w');
  const hasExplicitHeight = Object.prototype.hasOwnProperty.call(root.dataset, 'height') || Object.prototype.hasOwnProperty.call(root.dataset, 'h');
  const width = clamp(toNumber(root.dataset.width, toNumber(root.dataset.w, 58)), 16, 256);
  const height = clamp(toNumber(root.dataset.height, toNumber(root.dataset.h, width)), 16, 256);
  const strokeWidth = root.dataset.strokeWidth ? clamp(toNumber(root.dataset.strokeWidth, 4), 1, Math.min(width, height) / 2) : null;
  const dots = clamp(Math.floor(toNumber(root.dataset.dots, 16)), 3, 32);
  const filled = clamp(Math.floor(toNumber(root.dataset.filled, 6)), 1, dots);
  const dotRadius = root.dataset.dotRadius ? clamp(toNumber(root.dataset.dotRadius, 1), 1, Math.min(width, height) / 4) : null;
  const direction = normalizeChoice(root.dataset.direction, ['clockwise', 'counterclockwise'], 'clockwise');
  let variant = String(root.dataset.variant || '').toLowerCase();
  variant = normalizeChoice(variant, ['arc', 'dots'], circles ? 'dots' : 'arc');
  return {
    width,
    height,
    strokeWidth,
    dots,
    filled,
    dotRadius,
    direction,
    variant,
    hasExplicitWidth,
    hasExplicitHeight,
    infinite: root.dataset.infinite === 'true',
    announce: root.dataset.announce === 'true',
    label: root.dataset.label !== undefined ? root.dataset.label : labelNode?.textContent?.trim?.() || '',
    indicator,
    circles,
    labelNode
  };
}

function syncSpinnerAccessibility(root, config) {
  const hasLabel = Boolean(config.label);
  root.toggleAttribute('aria-hidden', !hasLabel);

  if (config.announce && hasLabel) {
    root.setAttribute('role', 'status');
    root.setAttribute('aria-live', 'polite');
    root.setAttribute('aria-atomic', 'true');
    root.dataset.sfSpinnerSemantics = 'status';
    return;
  }

  if (root.dataset.sfSpinnerSemantics === 'status') {
    root.removeAttribute('role');
    root.removeAttribute('aria-live');
    root.removeAttribute('aria-atomic');
    delete root.dataset.sfSpinnerSemantics;
  }
}

function ensureSpinnerPart(root, selector, className) {
  let node = root.querySelector(selector);

  if (node) {
    node.innerHTML = '';
    return node;
  }

  node = document.createElement('div');
  node.className = className;
  node.dataset.sfSpinnerPart = className;
  root.append(node);
  return node;
}

function renderSpinner(root) {
  if (!(root instanceof HTMLElement)) return root;
  const config = getSpinnerConfig(root);
  root.classList.add('sf-loader-container');

  if (config.infinite) {
    root.classList.add('sf-loader--infinite');
  } else {
    root.classList.remove('sf-loader--infinite');
  }

  if (config.hasExplicitWidth) {
    root.style.setProperty('--sf-loader-svg-width', `${config.width}px`);
  } else {
    root.style.removeProperty('--sf-loader-svg-width');
  }

  if (config.hasExplicitHeight || config.hasExplicitWidth) {
    root.style.setProperty('--sf-loader-svg-height', `${config.height}px`);
  } else {
    root.style.removeProperty('--sf-loader-svg-height');
  }

  if (config.strokeWidth !== null) {
    root.style.setProperty('--sf-loader-stroke-width', `${config.strokeWidth}px`);
  } else {
    root.style.removeProperty('--sf-loader-stroke-width');
  }

  const visualClass = config.variant === 'dots' ? 'sf-loader--circles' : 'sf-loader--loading-indicator';
  const visual = ensureSpinnerPart(root, `.${visualClass}`, visualClass);
  const label = config.label || config.labelNode ? ensureSpinnerPart(root, '.sf-loader--text', 'sf-loader--text') : null;
  const svg = config.variant === 'dots' ? createSpinnerDotsSvg(config) : createSpinnerArcSvg(config);
  visual.append(svg);
  const obsoleteClass = config.variant === 'dots' ? '.sf-loader--loading-indicator' : '.sf-loader--circles';
  root.querySelector(obsoleteClass)?.remove();

  if (label) {
    label.textContent = config.label || '';
  }

  syncSpinnerAccessibility(root, config);
  return root;
}

function bindSpinner(root) {
  if (!(root instanceof HTMLElement) || root.dataset[SPINNER_BOUND_FLAG] === '1') {
    return root;
  }

  renderSpinner(root);
  root.dataset[SPINNER_BOUND_FLAG] = '1';
  return root;
}

function unbindSpinner(root) {
  if (!(root instanceof HTMLElement)) return;
  delete root.dataset[SPINNER_BOUND_FLAG];
}

function initSpinnerTree(target) {
  if (!(target instanceof Element) && target !== document) return;

  if (target instanceof Element && target.matches?.(SPINNER_SELECTOR)) {
    bindSpinner(target);
  }

  target.querySelectorAll?.(SPINNER_SELECTOR).forEach(bindSpinner);
}

class Spinner extends _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__.ComponentObserver {
  static componentName = 'Spinner';

  constructor(props) {
    super(props);
    const {
      width = 58,
      height = 58,
      label = 'Loading...',
      variant = 'arc',
      dots = 16,
      filled = 6,
      strokeWidth = null,
      dotRadius = null,
      infinite = false,
      announce = false,
      direction = 'clockwise'
    } = this.params || {};
    const className = this.attrs.class || this.attrs.className;
    this.template = document.createElement('div');

    if (this.id) {
      this.template.id = this.id;
    }

    this.template.classList.add('sf-loader-container');

    if (className) {
      this.template.classList.add(...`${className}`.split(' ').filter(Boolean));
    }

    Object.entries(this.attrs).filter(([attr]) => !['class', 'className'].includes(attr)).forEach(([attr, value]) => {
      if (value === undefined || value === null) return;
      this.template.setAttribute(attr, value);
    });
    this.template.dataset.width = String(width);
    this.template.dataset.height = String(height);
    this.template.dataset.label = String(label ?? '');
    this.template.dataset.variant = String(variant);
    this.template.dataset.dots = String(dots);
    this.template.dataset.filled = String(filled);

    if (strokeWidth !== null && strokeWidth !== undefined && strokeWidth !== '') {
      this.template.dataset.strokeWidth = String(strokeWidth);
    }

    this.template.dataset.infinite = String(infinite);
    this.template.dataset.announce = String(announce);
    this.template.dataset.direction = String(direction);

    if (dotRadius !== null && dotRadius !== undefined) {
      this.template.dataset.dotRadius = String(dotRadius);
    }
  }

  init() {
    bindSpinner(this.template);
  }

  destroyInternal() {
    unbindSpinner(this.template);
  }

}

(0,_register_helper__WEBPACK_IMPORTED_MODULE_1__["default"])('Spinner', Spinner);

if (typeof window !== 'undefined') {
  window.SF = window.SF || {};
  window.SF.Spinner = window.SF.Spinner || {};
  window.SF.Spinner.bind = bindSpinner;
  window.SF.Spinner.render = renderSpinner;
  window.SF.Spinner.unbind = unbindSpinner;
  window.SF.Spinner.createArcSvg = createSpinnerArcSvg;
  window.SF.Spinner.createDotsSvg = createSpinnerDotsSvg;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initSpinnerTree(document));
} else {
  initSpinnerTree(document);
}

const spinnerObserver = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (!(node instanceof Element)) return;
      initSpinnerTree(node);
    });
  });
});
spinnerObserver.observe(document.documentElement, {
  childList: true,
  subtree: true
});


/***/ },

/***/ "11ee8fe694f8"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _spinner__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("eecc41af23fd");
/*
* Main JS file for including JS for component.
*
* Imports:
* - Base function component (_component_name.js)
*/


/***/ },

/***/ "d7f974466839"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ComponentObserver: () => (/* binding */ ComponentObserver)
/* harmony export */ });
class ComponentObserver {
  constructor(props) {
    this.props = props;
    this.id = props?.id;
    this.params = props?.param;
    this.attrs = props?.attrs || {};
    this.template = null;
    window.dispatchEvent(new CustomEvent(`${this.componentName}:beforeRender`, {
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
      window.dispatchEvent(new CustomEvent(`${this.componentName}:render`, {
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

    window.dispatchEvent(new CustomEvent(`${this.componentName}:destroy`, {
      detail: this
    }));
  }

  destroyInternal() {}

}

/***/ },

/***/ "71a47b831017"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


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
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("71a47b831017");
/* harmony import */ var _js_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("11ee8fe694f8");
/**
* SIMAI Framework
* Copyright 2008-2026 SIMAI Ltd
* http://simai.studio
* Read the license: http://framework.simai.studio/license/
* Documentation: http://framework.simai.studio/
* Support: http://simai.studio/support/
*
* SPINNER
*
* Entry point for importing components from this directory.
* Simplifies the import process in other parts of the project.
* Instead of importing individual files, all component can be imported through this file.
*/


})();

/******/ })()
;