/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "6014669ceac6"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _register_helper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("58661bec99a6");


class SfAccordion {
  static componentName = 'Accordion';

  constructor(el) {
    this.el = el;
    this.content = el?.querySelector?.('.sf-accordion-content') || null;
    this.title = el?.querySelector?.('.sf-accordion-title') || null;
    this.icon = el?.querySelector?.(':scope > .sf-icon') || el?.querySelector?.('.sf-icon');
    this.onClick = this.handleClick.bind(this);
  }

  init() {
    if (!this.el || this.el.dataset.sfAccordionInit === '1') return;
    this.el.dataset.sfAccordionInit = '1';

    if (!this.el.hasAttribute('role')) {
      this.el.setAttribute('role', 'button');
    }

    if (!this.el.hasAttribute('tabindex')) {
      this.el.setAttribute('tabindex', '0');
    }

    this.syncState();
    this.el.addEventListener('click', this.onClick);
    this.el.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        this.toggle();
      }
    });
  }

  destroy() {
    if (!this.el) return;
    this.el.removeEventListener('click', this.onClick);
    delete this.el.dataset.sfAccordionInit;
  }

  handleClick(event) {
    // Ignore clicks on interactive children if they appear later.
    const interactive = event.target.closest?.('a, button, input, textarea, select, summary');
    if (interactive && interactive !== this.el) return;
    this.toggle();
  }

  isOpen() {
    if (!this.content) return false;
    return !this.content.classList.contains('hidden');
  }

  toggle() {
    if (!this.content) return;
    this.content.classList.toggle('hidden');
    this.syncState();
  }

  syncState() {
    const open = this.isOpen();
    this.el?.setAttribute('aria-expanded', open ? 'true' : 'false');
    this.el?.classList.toggle('active', open);

    if (this.icon) {
      this.icon.textContent = open ? 'keyboard_arrow_up' : 'keyboard_arrow_down';
    }
  }

}

function initAccordions(root = document) {
  if (!root?.querySelectorAll) return;
  root.querySelectorAll('.sf-accordion').forEach(el => {
    const inst = new SfAccordion(el);
    inst.init();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initAccordions(), {
    once: true
  });
} else {
  initAccordions();
}

if (typeof MutationObserver !== 'undefined') {
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (!(node instanceof HTMLElement)) return;

        if (node.matches('.sf-accordion')) {
          const inst = new SfAccordion(node);
          inst.init();
          return;
        }

        if (node.querySelector?.('.sf-accordion')) {
          initAccordions(node);
        }
      });
    });
  });
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
}

(0,_register_helper__WEBPACK_IMPORTED_MODULE_0__["default"])('Accordion', SfAccordion);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SfAccordion);

/***/ },

/***/ "5383c575ac1a"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _accordion__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("6014669ceac6");
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

/***/ "cee052b3ccee"
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
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("cee052b3ccee");
/* harmony import */ var _js_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5383c575ac1a");
/**
* SIMAI Framework
* Copyright 2008-2026 SIMAI Ltd
* http://simai.studio
* Read the license: http://framework.simai.studio/license/
* Documentation: http://framework.simai.studio/
* Support: http://simai.studio/support/
*
* ACCORDION
*
* Entry point for importing components from this directory.
* Simplifies the import process in other parts of the project.
* Instead of importing individual files, all component can be imported through this file.
*/


})();

/******/ })()
;