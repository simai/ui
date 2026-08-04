/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "3b4e9ff2f1d2"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bindProgressBar: () => (/* binding */ bindProgressBar),
/* harmony export */   getProgressBarState: () => (/* binding */ getProgressBarState),
/* harmony export */   initExistingProgressBars: () => (/* binding */ initExistingProgressBars),
/* harmony export */   setProgressBarState: () => (/* binding */ setProgressBarState),
/* harmony export */   unbindProgressBar: () => (/* binding */ unbindProgressBar)
/* harmony export */ });
/* harmony import */ var _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d7f974466839");
/* harmony import */ var _register_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("58661bec99a6");


const PROGRESS_BAR_SELECTOR = '.sf-progress-bar';
const PROGRESS_BAR_BOUND_FLAG = 'sfProgressBarBound';

function normalizeSize(value) {
  const normalized = String(value || '').toLowerCase();
  const supported = ['1/3', '1/2', '1', '2', '3'];
  return supported.includes(normalized) ? normalized : '1';
}

function normalizeValue(value) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return 0;
  }

  return Math.max(0, Math.min(100, parsed));
}

function normalizeTextPosition(value, fallback = 'none') {
  const normalized = String(value || fallback).toLowerCase();
  return ['none', 'right', 'inline-end', 'bottom'].includes(normalized) ? normalized : fallback;
}

function getProgressNode(root) {
  return root?.querySelector?.('.sf-progress-bar-progress') || null;
}

function getTextNode(root) {
  return root?.querySelector?.('.sf-progress-bar-text') || null;
}

function getMainNode(root) {
  return root?.querySelector?.('.sf-progress-bar-main') || null;
}

function detectTextPosition(root) {
  if (!getTextNode(root)) {
    return 'none';
  }

  if (root.classList.contains('flex-col')) {
    return 'bottom';
  }

  return 'right';
}

function ensureTextNode(root) {
  let textNode = getTextNode(root);
  if (textNode) return textNode;
  textNode = document.createElement('div');
  textNode.className = 'sf-progress-bar-text';
  root.append(textNode);
  return textNode;
}

function syncRootLayout(root, textPosition = 'none') {
  root.classList.add('sf-progress-bar', 'flex');
  root.classList.remove('flex-col', 'flex-row', 'items-cross-end', 'items-cross-center');

  if (textPosition === 'bottom') {
    root.classList.add('flex-col', 'items-cross-end');
    return;
  }

  if (textPosition === 'right' || textPosition === 'inline-end') {
    root.classList.add('flex-row', 'items-cross-center');
  }
}

function renderProgressBar(root) {
  if (!root) return false;
  const progress = getProgressNode(root);
  const main = getMainNode(root);
  if (!progress || !main) return false;
  const value = normalizeValue(root.dataset.value ?? root.getAttribute('data-value') ?? 0);
  const textPosition = normalizeTextPosition(root.dataset.textPosition ?? root.getAttribute('data-text-position'), detectTextPosition(root));
  syncRootLayout(root, textPosition);
  progress.style.width = `${value}%`;
  root.dataset.value = String(value);
  root.dataset.textPosition = textPosition;

  if (textPosition === 'none') {
    const textNode = getTextNode(root);

    if (textNode) {
      textNode.remove();
    }

    return true;
  }

  const textNode = ensureTextNode(root);
  textNode.textContent = `${value}%`;

  if (textPosition === 'bottom' && textNode.parentElement !== root) {
    root.append(textNode);
  }

  return true;
}

function bindProgressBar(root) {
  if (!root || root.dataset[PROGRESS_BAR_BOUND_FLAG] === '1') return;
  renderProgressBar(root);
  root.dataset[PROGRESS_BAR_BOUND_FLAG] = '1';
}

function unbindProgressBar(root) {
  if (!root || root.dataset[PROGRESS_BAR_BOUND_FLAG] !== '1') return;
  delete root.dataset[PROGRESS_BAR_BOUND_FLAG];
}

function initExistingProgressBars(target = document) {
  target.querySelectorAll(PROGRESS_BAR_SELECTOR).forEach(bindProgressBar);
}

function setProgressBarState(target, state = {}) {
  const root = target instanceof HTMLElement ? target.closest(PROGRESS_BAR_SELECTOR) || target : null;
  if (!root) return false;

  if (Object.prototype.hasOwnProperty.call(state, 'value')) {
    root.dataset.value = String(normalizeValue(state.value));
  }

  if (Object.prototype.hasOwnProperty.call(state, 'textPosition')) {
    root.dataset.textPosition = normalizeTextPosition(state.textPosition);
  }

  if (Object.prototype.hasOwnProperty.call(state, 'size')) {
    const currentSizeClass = Array.from(root.classList).find(cls => cls.startsWith('sf-progress-bar--size-'));

    if (currentSizeClass) {
      root.classList.remove(currentSizeClass);
    }

    root.classList.add(`sf-progress-bar--size-${normalizeSize(state.size)}`);
  }

  return renderProgressBar(root);
}

function getProgressBarState(target) {
  const root = target instanceof HTMLElement ? target.closest(PROGRESS_BAR_SELECTOR) || target : null;
  if (!root) return null;
  return {
    value: normalizeValue(root.dataset.value ?? 0),
    textPosition: normalizeTextPosition(root.dataset.textPosition, detectTextPosition(root))
  };
}

class ProgressBar extends _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__.ComponentObserver {
  static componentName = 'ProgressBar';
  html = null;

  constructor(props) {
    super(props);
    const {
      size = '1',
      value = 0,
      textPosition = 'none'
    } = this.params || {};
    const className = this.attrs.class || this.attrs.className;
    const root = document.createElement('div');

    if (this.id) {
      root.id = this.id;
    }

    root.classList.add('sf-progress-bar', `sf-progress-bar--size-${normalizeSize(size)}`, 'flex');

    if (className) {
      root.classList.add(...String(className).split(' ').filter(Boolean));
    }

    root.dataset.value = String(normalizeValue(value));
    root.dataset.textPosition = normalizeTextPosition(textPosition);
    const main = document.createElement('div');
    main.className = 'sf-progress-bar-main';
    const progress = document.createElement('div');
    progress.className = 'sf-progress-bar-progress transition';
    main.append(progress);
    root.append(main);
    this.template = root;
  }

  init() {
    bindProgressBar(this.template);
  }

  destroyInternal() {
    unbindProgressBar(this.template);
  }

}

(0,_register_helper__WEBPACK_IMPORTED_MODULE_1__["default"])('ProgressBar', ProgressBar);

if (typeof window !== 'undefined') {
  window.SF = window.SF || {};
  window.SF.ProgressBar = window.SF.ProgressBar || {};
  window.SF.ProgressBar.getState = getProgressBarState;
  window.SF.ProgressBar.setState = setProgressBarState;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initExistingProgressBars(), {
    once: true
  });
} else {
  initExistingProgressBars();
}

const progressBarObserver = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (!(node instanceof Element)) return;

      if (node.matches?.(PROGRESS_BAR_SELECTOR)) {
        bindProgressBar(node);
      }

      initExistingProgressBars(node);
    });
  });
});
progressBarObserver.observe(document.documentElement, {
  childList: true,
  subtree: true
});


/***/ },

/***/ "0a6d884f1102"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _progressbar__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("3b4e9ff2f1d2");
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
          classes.add(cls.replace(/^\./, ''));
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

/***/ "9174511fefab"
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
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("9174511fefab");
/* harmony import */ var _js_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("0a6d884f1102");
/**
* SIMAI Framework
* Copyright 2008-2026 SIMAI Ltd
* http://simai.studio
* Read the license: http://framework.simai.studio/license/
* Documentation: http://framework.simai.studio/
* Support: http://simai.studio/support/
*
* PROGRESSBAR
*
* Entry point for importing components from this directory.
* Simplifies the import process in other parts of the project.
* Instead of importing individual files, all component can be imported through this file.
*/


})();

/******/ })()
;