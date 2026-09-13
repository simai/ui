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

/***/ "e0dd4e1a831d"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _register_helper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("58661bec99a6");

const tooltipInstances = new WeakMap();
const TRIGGER_SELECTOR = '[data-tooltip]';
const SURFACE_SELECTOR = '.sf-tooltip, sf-tooltip';
let tooltipId = 0;

function descriptionTokens(trigger) {
  return (trigger.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean);
}

class SfTooltipController {
  static componentName = 'Tooltip';

  constructor(trigger) {
    this.trigger = trigger;
    this.anchor = trigger?.closest?.('.sf-tooltip-anchor') || null;
    this.surface = null;
    this.pointerInside = false;
    this.focusInside = false;
    this.dismissed = false;
    this.originalDescription = null;
    this.originalRole = null;
    this.originalHidden = false;
    this.onPointerEnter = this.handlePointerEnter.bind(this);
    this.onPointerLeave = this.handlePointerLeave.bind(this);
    this.onFocusIn = this.handleFocusIn.bind(this);
    this.onFocusOut = this.handleFocusOut.bind(this);
    this.onDocumentKeydown = this.handleDocumentKeydown.bind(this);
  }

  resolveSurface() {
    const reference = this.trigger?.getAttribute?.('data-tooltip')?.trim();

    if (reference) {
      const candidate = this.trigger.ownerDocument.getElementById(reference);
      return candidate?.matches?.(SURFACE_SELECTOR) ? candidate : null;
    }

    if (!this.anchor) return null;
    return [...this.anchor.children].find(child => child !== this.trigger && child.matches?.(SURFACE_SELECTOR)) || null;
  }

  init() {
    if (!this.trigger || tooltipInstances.has(this.trigger)) return;
    this.surface = this.resolveSurface();
    if (!this.surface) return;

    if (!this.surface.id) {
      tooltipId += 1;
      this.surface.id = `sf-tooltip-${tooltipId}`;
    }

    this.originalDescription = this.trigger.getAttribute('aria-describedby');
    this.originalRole = this.surface.getAttribute('role');
    this.originalHidden = this.surface.hidden;
    const descriptions = new Set(descriptionTokens(this.trigger));
    descriptions.add(this.surface.id);
    this.trigger.setAttribute('aria-describedby', [...descriptions].join(' '));
    this.trigger.setAttribute('data-tooltip', this.surface.id);
    this.surface.setAttribute('role', 'tooltip');
    this.surface.hidden = true;
    this.surface.classList.remove('active');
    const pointerRoot = this.anchor || this.trigger;
    pointerRoot.addEventListener('pointerenter', this.onPointerEnter);
    pointerRoot.addEventListener('pointerleave', this.onPointerLeave);
    this.trigger.addEventListener('focusin', this.onFocusIn);
    this.trigger.addEventListener('focusout', this.onFocusOut);
    tooltipInstances.set(this.trigger, this);
  }

  destroy() {
    if (!this.trigger || !this.surface) return;
    const pointerRoot = this.anchor || this.trigger;
    pointerRoot.removeEventListener('pointerenter', this.onPointerEnter);
    pointerRoot.removeEventListener('pointerleave', this.onPointerLeave);
    this.trigger.removeEventListener('focusin', this.onFocusIn);
    this.trigger.removeEventListener('focusout', this.onFocusOut);
    this.trigger.ownerDocument.removeEventListener('keydown', this.onDocumentKeydown);

    if (this.originalDescription === null) {
      this.trigger.removeAttribute('aria-describedby');
    } else {
      this.trigger.setAttribute('aria-describedby', this.originalDescription);
    }

    if (this.originalRole === null) {
      this.surface.removeAttribute('role');
    } else {
      this.surface.setAttribute('role', this.originalRole);
    }

    this.surface.hidden = this.originalHidden;
    this.surface.classList.remove('active');
    tooltipInstances.delete(this.trigger);
  }

  handlePointerEnter(event) {
    if (event.pointerType === 'touch') return;
    this.pointerInside = true;
    if (!this.dismissed) this.open();
  }

  handlePointerLeave() {
    this.pointerInside = false;

    if (!this.focusInside) {
      this.dismissed = false;
      this.close();
    }
  }

  handleFocusIn() {
    this.focusInside = true;
    if (!this.dismissed) this.open();
  }

  handleFocusOut() {
    Promise.resolve().then(() => {
      this.focusInside = this.anchor ? this.anchor.contains(this.trigger.ownerDocument.activeElement) : this.trigger === this.trigger.ownerDocument.activeElement;

      if (!this.focusInside && !this.pointerInside) {
        this.dismissed = false;
        this.close();
      }
    });
  }

  handleDocumentKeydown(event) {
    if (event.key !== 'Escape' || this.surface?.hidden) return;
    this.dismissed = true;
    this.close();
  }

  open() {
    if (!this.surface || !this.surface.hidden) return;
    this.surface.hidden = false;
    this.surface.classList.add('active');
    this.trigger.ownerDocument.addEventListener('keydown', this.onDocumentKeydown);
  }

  close() {
    if (!this.surface) return;
    this.surface.hidden = true;
    this.surface.classList.remove('active');
    this.trigger.ownerDocument.removeEventListener('keydown', this.onDocumentKeydown);
  }

}

function initTooltipTriggers(root = document) {
  if (!root?.querySelectorAll) return;

  if (root.matches?.(TRIGGER_SELECTOR)) {
    new SfTooltipController(root).init();
  }

  root.querySelectorAll(TRIGGER_SELECTOR).forEach(trigger => {
    if (!tooltipInstances.has(trigger)) {
      new SfTooltipController(trigger).init();
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initTooltipTriggers(), {
    once: true
  });
} else {
  initTooltipTriggers();
}

if (typeof MutationObserver !== 'undefined') {
  const observer = new MutationObserver(mutations => {
    let retryDocument = false;
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (!(node instanceof HTMLElement)) return;
        initTooltipTriggers(node);

        if (node.matches?.(SURFACE_SELECTOR) || node.querySelector?.(SURFACE_SELECTOR)) {
          retryDocument = true;
        }
      });
    });
    if (retryDocument) initTooltipTriggers();
  });
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
}

(0,_register_helper__WEBPACK_IMPORTED_MODULE_0__["default"])('Tooltip', SfTooltipController);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SfTooltipController);

/***/ },

/***/ "c024d9c4af63"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _tooltip__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("e0dd4e1a831d");
/*
* Main JS file for including JS for component.
*
* Imports:
* - Base function component (_component_name.js)
*/


/***/ },

/***/ "c5eb3374a901"
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
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("c5eb3374a901");
/* harmony import */ var _js_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("c024d9c4af63");
/**
* SIMAI Framework
* Copyright 2008-2026 SIMAI Ltd
* http://simai.studio
* Read the license: http://framework.simai.studio/license/
* Documentation: http://framework.simai.studio/
* Support: http://simai.studio/support/
*
* TOOLTIP
*
* Entry point for importing components from this directory.
* Simplifies the import process in other parts of the project.
* Instead of importing individual files, all component can be imported through this file.
*/


})();

/******/ })()
;