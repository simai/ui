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

/***/ "000c296a3de1"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bindToggle: () => (/* binding */ bindToggle),
/* harmony export */   setToggleState: () => (/* binding */ setToggleState),
/* harmony export */   syncToggleState: () => (/* binding */ syncToggleState),
/* harmony export */   unbindToggle: () => (/* binding */ unbindToggle)
/* harmony export */ });
/* harmony import */ var _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d7f974466839");
/* harmony import */ var _register_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("58661bec99a6");


const TOGGLE_SELECTOR = 'label.sf-toggle';
const TOGGLE_BOUND_FLAG = 'sfToggleBound';

function toBoolean(value, defaultValue = false) {
  if (value === undefined || value === null || value === '') return defaultValue;
  if (typeof value === 'boolean') return value;
  return ['1', 'true', 'yes', 'on', 'checked', 'disabled'].includes(String(value).toLowerCase());
}

function getToggleNodes(root) {
  if (!(root instanceof HTMLElement)) {
    return {};
  }

  return {
    input: root.querySelector('input[type="checkbox"]'),
    control: root.querySelector('.sf-toggle-control'),
    container: root.querySelector('.sf-toggle-container')
  };
}

function syncToggleState(root) {
  const {
    input,
    container
  } = getToggleNodes(root);
  if (!input) return;
  const isChecked = !!input.checked;
  const isDisabled = !!input.disabled;
  root.classList.toggle('active', isChecked);
  root.classList.toggle('disabled', isDisabled);

  if (container) {
    container.classList.toggle('content-main-start', !isChecked);
    container.classList.toggle('content-main-end', isChecked);
  }
}

function bindToggle(root) {
  if (!(root instanceof HTMLElement) || root.dataset[TOGGLE_BOUND_FLAG] === '1') return;
  const {
    input
  } = getToggleNodes(root);
  if (!(input instanceof HTMLInputElement)) return;

  const handleChange = () => syncToggleState(root);

  root.__sfToggleHandleChange = handleChange;
  input.addEventListener('change', handleChange);
  root.dataset[TOGGLE_BOUND_FLAG] = '1';
  syncToggleState(root);
}

function unbindToggle(root) {
  if (!(root instanceof HTMLElement)) return;
  const {
    input
  } = getToggleNodes(root);

  if (input && root.__sfToggleHandleChange) {
    input.removeEventListener('change', root.__sfToggleHandleChange);
  }

  delete root.__sfToggleHandleChange;
  delete root.dataset[TOGGLE_BOUND_FLAG];
}

function initToggleTree(target) {
  if (!(target instanceof Element) && target !== document) return;

  if (target instanceof Element && target.matches?.(TOGGLE_SELECTOR)) {
    bindToggle(target);
  }

  target.querySelectorAll?.(TOGGLE_SELECTOR).forEach(bindToggle);
}

function initExistingToggles(target = document) {
  initToggleTree(target);
}

function setToggleState(input, state = {}) {
  if (!(input instanceof HTMLInputElement) || input.type !== 'checkbox') {
    return false;
  }

  if (Object.prototype.hasOwnProperty.call(state, 'checked')) {
    input.checked = toBoolean(state.checked);
  }

  if (Object.prototype.hasOwnProperty.call(state, 'disabled')) {
    input.disabled = toBoolean(state.disabled);
  }

  const root = input.closest(TOGGLE_SELECTOR);

  if (root) {
    syncToggleState(root);
  }

  return true;
}

function buildSimpleToggle(template, options) {
  const {
    checked,
    disabled,
    name,
    value
  } = options;
  const control = document.createElement('span');
  control.className = 'sf-toggle-control';
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.checked = checked;
  input.disabled = disabled;
  if (name) input.name = name;
  if (value !== undefined) input.value = value;
  const container = document.createElement('span');
  container.className = 'sf-toggle-container transition flex items-center content-main-start';
  const innerWrap = document.createElement('span');
  innerWrap.className = 'sf-toggle-inner-wrap transition flex items-center content-main-center';
  const inner = document.createElement('span');
  inner.className = 'sf-toggle-inner transition';
  inner.setAttribute('aria-hidden', 'true');
  innerWrap.append(inner);
  container.append(innerWrap);
  control.append(input, container);
  template.append(control);
}

function buildIconToggle(template, options) {
  const {
    checked,
    disabled,
    name,
    value,
    icon
  } = options;
  const control = document.createElement('span');
  control.className = 'sf-toggle-control';
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.checked = checked;
  input.disabled = disabled;
  if (name) input.name = name;
  if (value !== undefined) input.value = value;
  const container = document.createElement('span');
  container.className = 'sf-toggle-container transition flex items-center content-main-start';
  const innerWrap = document.createElement('span');
  innerWrap.className = 'sf-toggle-inner-wrap transition flex items-center content-main-center';
  const iconNode = document.createElement('i');
  iconNode.className = 'sf-icon';
  iconNode.setAttribute('aria-hidden', 'true');
  iconNode.textContent = icon || 'check';
  innerWrap.append(iconNode);
  container.append(innerWrap);
  control.append(input, container);
  template.append(control);
}

function buildShortToggle(template, options) {
  const {
    checked,
    disabled,
    name,
    value
  } = options;
  const control = document.createElement('span');
  control.className = 'sf-toggle-control';
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.checked = checked;
  input.disabled = disabled;
  if (name) input.name = name;
  if (value !== undefined) input.value = value;
  const container = document.createElement('span');
  container.className = 'sf-toggle-container transition flex items-center content-main-start';
  const innerWrap = document.createElement('span');
  innerWrap.className = 'sf-toggle-inner-wrap transition flex items-center content-main-center';
  const inner = document.createElement('span');
  inner.className = 'sf-toggle-inner transition';
  inner.setAttribute('aria-hidden', 'true');
  innerWrap.append(inner);
  container.append(innerWrap);
  control.append(input, container);
  template.append(control);
}

class Toggle extends _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__.ComponentObserver {
  static componentName = 'Toggle';
  html = null;

  constructor(props) {
    super(props);
    const {
      size = '1',
      type = 'simple',
      label = '',
      icon = '',
      checked = false,
      disabled = false,
      name = '',
      value
    } = this.params || {};
    const className = this.attrs.class || this.attrs.className;
    this.template = document.createElement('label');

    if (this.id) {
      this.template.id = this.id;
    }

    this.template.classList.add('sf-toggle', `sf-toggle--${type}`, `sf-toggle--size-${size}`, 'flex', 'items-center');

    if (className) {
      this.template.classList.add(...String(className).split(' ').filter(Boolean));
    }

    const options = {
      checked: toBoolean(checked),
      disabled: toBoolean(disabled),
      name,
      value,
      icon
    };

    if (type === 'icon') {
      buildIconToggle(this.template, options);
    } else if (type === 'short') {
      buildShortToggle(this.template, options);
    } else {
      buildSimpleToggle(this.template, options);
    }

    if (label) {
      const text = document.createElement('span');
      text.className = 'sf-toggle-text';
      text.textContent = label;
      this.template.append(text);
    }
  }

  init() {
    bindToggle(this.template);
  }

  destroyInternal() {
    if (!this.template) return;
    unbindToggle(this.template);
  }

}

(0,_register_helper__WEBPACK_IMPORTED_MODULE_1__["default"])('Toggle', Toggle);

if (typeof window !== 'undefined') {
  window.SF = window.SF || {};
  window.SF.Toggle = window.SF.Toggle || {};
  window.SF.Toggle.setState = setToggleState;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initExistingToggles());
} else {
  initExistingToggles();
}

const toggleObserver = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (!(node instanceof Element)) return;
      initToggleTree(node);
    });
  });
});
toggleObserver.observe(document.documentElement, {
  childList: true,
  subtree: true
});


/***/ },

/***/ "c0716ffc3267"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _toggle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("000c296a3de1");
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

/***/ "a698ff3cf859"
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
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("a698ff3cf859");
/* harmony import */ var _js_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("c0716ffc3267");
/**
 * SIMAI Framework
 * Copyright 2008-2026 SIMAI Ltd
 * http://simai.studio
 * Read the license: http://framework.simai.studio/license/
 * Documentation: http://framework.simai.studio/
 * Support: http://simai.studio/support/
 *
 * INPUTS
 *
 * Entry point for importing components from this directory.
 * Simplifies the import process in other parts of the project.
 * Instead of importing individual files, all component can be imported through this file.
 */


})();

/******/ })()
;