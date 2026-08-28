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

/***/ "2e6d67465f5f"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bindToast: () => (/* binding */ bindToast),
/* harmony export */   createToastElement: () => (/* binding */ createToastElement),
/* harmony export */   dismissToast: () => (/* binding */ dismissToast),
/* harmony export */   showToast: () => (/* binding */ showToast),
/* harmony export */   unbindToast: () => (/* binding */ unbindToast)
/* harmony export */ });
/* harmony import */ var _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d7f974466839");
/* harmony import */ var _register_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("58661bec99a6");


const TOAST_SELECTOR = '.sf-toast';
const TOAST_BOUND_FLAG = 'sfToastBound';

function joinClasses(...tokens) {
  return tokens.flat().filter(Boolean).join(' ');
}

function bindToast(root) {
  if (!(root instanceof HTMLElement) || root.dataset[TOAST_BOUND_FLAG] === '1') {
    return;
  }

  const closeButtons = root.querySelectorAll('[data-toast-close]');
  const actionButtons = root.querySelectorAll('[data-toast-action]');

  const handleClose = event => {
    event.preventDefault();
    dismissToast(root);
  };

  const handleAction = event => {
    root.dispatchEvent(new CustomEvent('sf-toast-action', {
      bubbles: true,
      composed: true,
      detail: {
        action: event.currentTarget?.getAttribute?.('data-toast-action') || '',
        toast: root
      }
    }));
  };

  closeButtons.forEach(button => button.addEventListener('click', handleClose));
  actionButtons.forEach(button => button.addEventListener('click', handleAction));
  root.__sfToastHandleClose = handleClose;
  root.__sfToastHandleAction = handleAction;
  root.dataset[TOAST_BOUND_FLAG] = '1';
}

function unbindToast(root) {
  if (!(root instanceof HTMLElement)) {
    return;
  }

  const closeButtons = root.querySelectorAll('[data-toast-close]');
  const actionButtons = root.querySelectorAll('[data-toast-action]');

  if (root.__sfToastHandleClose) {
    closeButtons.forEach(button => button.removeEventListener('click', root.__sfToastHandleClose));
  }

  if (root.__sfToastHandleAction) {
    actionButtons.forEach(button => button.removeEventListener('click', root.__sfToastHandleAction));
  }

  delete root.__sfToastHandleClose;
  delete root.__sfToastHandleAction;
  delete root.dataset[TOAST_BOUND_FLAG];
}

function dismissToast(root) {
  if (!(root instanceof HTMLElement)) {
    return false;
  }

  unbindToast(root);
  root.dispatchEvent(new CustomEvent('sf-toast-close', {
    bubbles: true,
    composed: true,
    detail: {
      toast: root
    }
  }));
  root.remove();
  return true;
}

function createToastElement(options = {}) {
  const {
    type = 'default',
    icon = '',
    title = '',
    supportingText = '',
    actionText = '',
    action = '',
    closable = true
  } = options;
  const root = document.createElement('div');
  root.className = joinClasses('sf-toast', `sf-toast--${type}`, 'flex');

  if (icon) {
    const iconNode = document.createElement('i');
    iconNode.className = 'sf-icon';
    iconNode.setAttribute('aria-hidden', 'true');
    iconNode.textContent = icon;
    root.append(iconNode);
  }

  const container = document.createElement('div');
  container.className = 'sf-toast-container flex flex-col flex-1';
  const wrap = document.createElement('div');
  wrap.className = 'sf-toast-wrap flex flex-col';

  if (title) {
    const titleNode = document.createElement('div');
    titleNode.className = 'sf-toast-text';
    titleNode.textContent = title;
    wrap.append(titleNode);
  }

  if (supportingText) {
    const supportingTextNode = document.createElement('div');
    supportingTextNode.className = 'sf-toast-supporting-text';
    supportingTextNode.textContent = supportingText;
    wrap.append(supportingTextNode);
  }

  container.append(wrap);

  if (actionText) {
    const bottom = document.createElement('div');
    bottom.className = 'sf-toast-bottom flex items-center';
    const actionButton = document.createElement('button');
    actionButton.type = 'button';
    actionButton.className = 'sf-button sf-button--primary sf-button--link sf-button--size-1';
    actionButton.setAttribute('data-toast-action', action || 'action');
    const actionTextNode = document.createElement('span');
    actionTextNode.className = 'sf-button-text-container';
    actionTextNode.textContent = actionText;
    actionButton.append(actionTextNode);
    bottom.append(actionButton);
    container.append(bottom);
  }

  root.append(container);

  if (closable) {
    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'sf-close sf-close--size-1 flex justify-center items-center';
    closeButton.setAttribute('aria-label', 'Close toast');
    closeButton.setAttribute('data-toast-close', '');
    const closeIcon = document.createElement('span');
    closeIcon.className = 'sf-close-icon';
    closeButton.append(closeIcon);
    root.append(closeButton);
  }

  bindToast(root);
  return root;
}

function showToast(target, options = {}) {
  const root = typeof target === 'string' ? document.querySelector(target) : target instanceof Element ? target : null;

  if (!(root instanceof Element)) {
    return null;
  }

  const toast = createToastElement(options);
  root.append(toast);
  return toast;
}

function initToastTree(target) {
  if (!(target instanceof Element) && target !== document) return;

  if (target instanceof Element && target.matches?.(TOAST_SELECTOR)) {
    bindToast(target);
  }

  target.querySelectorAll?.(TOAST_SELECTOR).forEach(bindToast);
}

class Toast extends _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__.ComponentObserver {
  static componentName = 'Toast';
  html = null;

  constructor(props) {
    super(props);
    const {
      type = 'default',
      icon = '',
      title = '',
      supportingText = '',
      actionText = '',
      action = '',
      closable = true
    } = this.params || {};
    this.template = createToastElement({
      type,
      icon,
      title,
      supportingText,
      actionText,
      action,
      closable
    });

    if (this.id) {
      this.template.id = this.id;
    }
  }

  init() {
    bindToast(this.template);
  }

  destroyInternal() {
    if (!this.template) return;
    unbindToast(this.template);
  }

}

(0,_register_helper__WEBPACK_IMPORTED_MODULE_1__["default"])('Toast', Toast);

if (typeof window !== 'undefined') {
  window.SF = window.SF || {};
  window.SF.Toast = window.SF.Toast || {};
  window.SF.Toast.bind = bindToast;
  window.SF.Toast.unbind = unbindToast;
  window.SF.Toast.dismiss = dismissToast;
  window.SF.Toast.create = createToastElement;
  window.SF.Toast.show = showToast;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initToastTree(document));
} else {
  initToastTree(document);
}

const toastObserver = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (!(node instanceof Element)) return;
      initToastTree(node);
    });
  });
});
toastObserver.observe(document.documentElement, {
  childList: true,
  subtree: true
});


/***/ },

/***/ "1ace9a75160f"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _toast__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2e6d67465f5f");
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

/***/ "0a7ae57ea2d3"
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
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("0a7ae57ea2d3");
/* harmony import */ var _js_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("1ace9a75160f");
/**
* SIMAI Framework
* Copyright 2008-2026 SIMAI Ltd
* http://simai.studio
* Read the license: http://framework.simai.studio/license/
* Documentation: http://framework.simai.studio/
* Support: http://simai.studio/support/
*
* SLIDER
*
* Entry point for importing components from this directory.
* Simplifies the import process in other parts of the project.
* Instead of importing individual files, all component can be imported through this file.
*/


})();

/******/ })()
;