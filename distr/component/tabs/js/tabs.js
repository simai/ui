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

/***/ "13fe7358c81f"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d7f974466839");
/* harmony import */ var _register_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("58661bec99a6");


const TABS_SELECTOR = '.sf-tabs';
const TABS_BOUND_FLAG = 'sfTabsBound';
const SELECTED_CLASS = 'selected';

function initTabs(target) {
  if (!(target instanceof Element) && target !== document) return;

  if (target instanceof Element && target.matches?.(TABS_SELECTOR)) {
    bindTabs(target);
  }

  target.querySelectorAll?.(TABS_SELECTOR).forEach(bindTabs);
}

function setIndex(items) {
  let i = 0;

  for (const item of items) {
    item.dataset.tab = i++;
  }
}

function normalizeIndex(index, total) {
  const value = Number.parseInt(index, 10);

  if (!Number.isFinite(value) || value < 0 || value >= total) {
    return 0;
  }

  return value;
}

function getInitialIndex(root, buttons) {
  const configuredIndex = root.getAttribute('data-active-index') || root.getAttribute('data-active') || root.getAttribute('active-index') || root.getAttribute('active');

  if (configuredIndex !== null) {
    return normalizeIndex(configuredIndex, buttons.length);
  }

  const selectedIndex = Array.from(buttons).findIndex(button => button.classList.contains(SELECTED_CLASS));
  return normalizeIndex(selectedIndex, buttons.length);
}

function activateTab(root, index) {
  let buttons = Array.from(root.querySelectorAll('.sf-tabs-top .sf-button'));

  if (!buttons.length) {
    buttons = Array.from(root.querySelectorAll('.sf-tabs-top .sf-icon-button'));
  }

  const mainTabs = Array.from(root.querySelectorAll('.sf-tabs-main-container .sf-tabs-main-tab'));
  const activeIndex = normalizeIndex(index, buttons.length);
  root.dataset.activeIndex = String(activeIndex);
  buttons.forEach((button, itemIndex) => {
    const active = itemIndex === activeIndex;
    button.classList.toggle(SELECTED_CLASS, active);
    button.setAttribute('aria-selected', String(active));
    button.setAttribute('tabindex', active ? '0' : '-1');
  });
  mainTabs.forEach((tab, itemIndex) => {
    const active = itemIndex === activeIndex;
    tab.classList.toggle(SELECTED_CLASS, active);
    tab.toggleAttribute('hidden', !active);
  });
}

function bindTabs(root) {
  if (!(root instanceof HTMLElement) || root.dataset[TABS_BOUND_FLAG] === '1') {
    return;
  }

  let buttons = root.querySelectorAll('.sf-tabs-top .sf-button');

  if (!buttons.length) {
    buttons = Array.from(root.querySelectorAll('.sf-tabs-top .sf-icon-button'));
  }

  const mainTabs = root.querySelectorAll('.sf-tabs-main-container .sf-tabs-main-tab');
  setIndex(buttons);
  setIndex(mainTabs);
  root.setAttribute('role', root.getAttribute('role') || 'tablist');
  buttons.forEach(button => {
    button.setAttribute('role', 'tab');
  });
  mainTabs.forEach(tab => {
    tab.setAttribute('role', 'tabpanel');
  });
  activateTab(root, getInitialIndex(root, buttons));
  root.addEventListener('click', event => {
    let button = event.target.closest?.('.sf-tabs-top .sf-button');

    if (!button) {
      button = event.target.closest?.('.sf-tabs-top .sf-icon-button');
    }

    if (!button || !root.contains(button) || button.disabled) {
      return;
    }

    activateTab(root, button.dataset.tab);
  });
  root.dataset[TABS_BOUND_FLAG] = '1';
}

class Tabs extends _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__.ComponentObserver {
  static componentName = 'Tabs';
  html = null;
}

(0,_register_helper__WEBPACK_IMPORTED_MODULE_1__["default"])('Tabs', Tabs);

if (typeof window !== 'undefined') {
  window.SF = window.SF || {};
  window.SF.Tabs = window.SF.Tabs || {};
  window.SF.Tabs.activate = activateTab;
  window.SF.Tabs.init = initTabs;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initTabs(document));
} else {
  initTabs(document);
}

/***/ },

/***/ "3d8d7b2253e9"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _tabs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("13fe7358c81f");
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

/***/ "c516309e5631"
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
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("c516309e5631");
/* harmony import */ var _js_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("3d8d7b2253e9");
/**
* SIMAI Framework
* Copyright 2008-2026 SIMAI Ltd
* http://simai.studio
* Read the license: http://framework.simai.studio/license/
* Documentation: http://framework.simai.studio/
* Support: http://simai.studio/support/
*
* TABS
*
* Entry point for importing components from this directory.
* Simplifies the import process in other parts of the project.
* Instead of importing individual files, all component can be imported through this file.
*/


})();

/******/ })()
;