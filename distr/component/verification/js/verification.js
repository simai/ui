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

/***/ "d4a6de1bf8b2"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d7f974466839");
/* harmony import */ var _register_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("58661bec99a6");
/* harmony import */ var _json_verification_utility_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("0a5cfbb47dfc");
/* harmony import */ var _json_verification_form_utility_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("abd75d757c58");




const FORM_SELECTOR = '.sf-verification-form';
const CONTROL_SELECTOR = '.sf-verification';
const INPUT_SELECTOR = '.sf-verification-input';
const states = new WeakMap();

function getRoot(target) {
  return target instanceof Element ? target.closest(FORM_SELECTOR) || target : null;
}

function getMode(root) {
  return String(root?.dataset?.mode || 'numeric').toLowerCase();
}

function getLength(root, input) {
  const requested = Number.parseInt(root?.dataset?.length || input?.maxLength || '6', 10);
  return Number.isFinite(requested) && requested > 0 ? Math.min(requested, 12) : 6;
}

function normalize(value, mode, length) {
  let result = String(value || '');
  if (mode === 'numeric') result = result.replace(/\D/g, '');else if (mode === 'alphanumeric') result = result.replace(/[^a-z0-9]/gi, '');else result = result.replace(/\s/g, '');
  return result.slice(0, length);
}

function canonicalInput(root) {
  return root?.querySelector?.(INPUT_SELECTOR) || null;
}

function legacyInputs(root) {
  if (canonicalInput(root)) return [];
  return Array.from(root?.querySelectorAll?.(`${CONTROL_SELECTOR} input`) || []);
}

function renderCanonical(root, state) {
  const value = normalize(state.input.value, state.mode, state.length);
  if (state.input.value !== value) state.input.value = value;
  state.cells.forEach((cell, index) => {
    cell.textContent = value[index] || '';
    cell.classList.toggle('active', index < value.length);
    cell.classList.toggle('current', index === Math.min(value.length, state.length - 1));
  });
  root.classList.toggle('active', Boolean(value));

  if (value.length === state.length && state.completedValue !== value) {
    state.completedValue = value;
    root.dispatchEvent(new CustomEvent('verification:complete', {
      bubbles: true,
      detail: {
        value
      }
    }));
  } else if (value.length < state.length) {
    state.completedValue = '';
  }
}

function bindCanonical(root, input) {
  const control = input.closest(CONTROL_SELECTOR);
  if (!control) return null;
  const length = getLength(root, input);
  const mode = getMode(root);
  input.maxLength = length;
  if (!input.inputMode && mode === 'numeric') input.inputMode = 'numeric';
  if (!input.autocomplete) input.autocomplete = 'one-time-code';
  input.dir = 'ltr';
  let cellsRoot = control.querySelector('.sf-verification-cells');

  if (!cellsRoot) {
    cellsRoot = document.createElement('span');
    cellsRoot.className = 'sf-verification-cells';
    cellsRoot.setAttribute('aria-hidden', 'true');
    control.appendChild(cellsRoot);
  }

  cellsRoot.replaceChildren();
  const cells = Array.from({
    length
  }, () => {
    const cell = document.createElement('span');
    cell.className = 'sf-verification-cell';
    cellsRoot.appendChild(cell);
    return cell;
  });
  const state = {
    input,
    cells,
    length,
    mode,
    completedValue: ''
  };

  const onInput = () => {
    root.classList.remove('error');
    input.removeAttribute('aria-invalid');
    renderCanonical(root, state);
  };

  const onPaste = event => {
    const value = normalize(event.clipboardData?.getData('text'), mode, length);
    if (!value) return;
    event.preventDefault();
    input.value = value;
    onInput();
  };

  const onReset = () => requestAnimationFrame(() => renderCanonical(root, state));

  input.addEventListener('input', onInput);
  input.addEventListener('paste', onPaste);
  input.form?.addEventListener('reset', onReset);

  state.destroy = () => {
    input.removeEventListener('input', onInput);
    input.removeEventListener('paste', onPaste);
    input.form?.removeEventListener('reset', onReset);
  };

  renderCanonical(root, state);
  return state;
}

function syncLegacy(root, inputs) {
  inputs.forEach(input => {
    const control = input.closest(CONTROL_SELECTOR);
    control?.classList.toggle('active', Boolean(input.value));
  });
}

function bindLegacy(root, inputs) {
  const mode = getMode(root);

  const onInput = event => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement)) return;
    input.value = normalize(input.value, mode, 1);
    root.classList.remove('error');
    syncLegacy(root, inputs);
    if (input.value) inputs[inputs.indexOf(input) + 1]?.focus();
  };

  const onPaste = event => {
    const value = normalize(event.clipboardData?.getData('text'), mode, inputs.length);
    if (!value) return;
    event.preventDefault();
    inputs.forEach((input, index) => {
      input.value = value[index] || '';
    });
    syncLegacy(root, inputs);
    inputs[Math.min(value.length, inputs.length - 1)]?.focus();
  };

  const onKeydown = event => {
    const input = event.target;
    const index = inputs.indexOf(input);

    if (event.key === 'Backspace' && !input.value && index > 0) {
      event.preventDefault();
      inputs[index - 1].value = '';
      inputs[index - 1].focus();
      syncLegacy(root, inputs);
    }
  };

  inputs.forEach(input => {
    input.maxLength = 1;
    input.addEventListener('input', onInput);
    input.addEventListener('keydown', onKeydown);
  });
  root.addEventListener('paste', onPaste);
  syncLegacy(root, inputs);
  return {
    inputs,
    mode,

    destroy() {
      inputs.forEach(input => {
        input.removeEventListener('input', onInput);
        input.removeEventListener('keydown', onKeydown);
      });
      root.removeEventListener('paste', onPaste);
    }

  };
}

function bind(root) {
  if (!root || states.has(root)) return states.get(root);
  const input = canonicalInput(root);
  const inputs = legacyInputs(root);
  const state = input ? bindCanonical(root, input) : inputs.length ? bindLegacy(root, inputs) : null;
  if (state) states.set(root, state);
  return state;
}

function unbind(root) {
  const state = states.get(root);
  if (!state) return;
  state.destroy?.();
  states.delete(root);
}

function initAll(target = document) {
  if (target.matches?.(FORM_SELECTOR)) bind(target);
  target.querySelectorAll?.(FORM_SELECTOR).forEach(bind);
}

function getValue(target) {
  const root = getRoot(target);
  if (!root) return '';
  const input = canonicalInput(root);
  if (input) return normalize(input.value, getMode(root), getLength(root, input));
  return legacyInputs(root).map(item => item.value).join('');
}

function setValue(target, value = '') {
  const root = getRoot(target);
  if (!root) return false;
  const state = bind(root);
  const input = canonicalInput(root);

  if (input) {
    input.value = normalize(value, state.mode, state.length);
    renderCanonical(root, state);
    return true;
  }

  const inputs = legacyInputs(root);
  const normalized = normalize(value, getMode(root), inputs.length);
  inputs.forEach((item, index) => {
    item.value = normalized[index] || '';
  });
  syncLegacy(root, inputs);
  return Boolean(inputs.length);
}

class Verification extends _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__.ComponentObserver {
  static componentName = 'Verification';
  html = null;
}

Verification.utilityMap = _json_verification_utility_json__WEBPACK_IMPORTED_MODULE_2__;
(0,_register_helper__WEBPACK_IMPORTED_MODULE_1__["default"])('Verification', Verification);

class VerificationForm extends _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__.ComponentObserver {
  static componentName = 'VerificationForm';
  html = null;

  init() {
    bind(this.template);
  }

  destroyInternal() {
    unbind(this.template);
  }

}

VerificationForm.utilityMap = _json_verification_form_utility_json__WEBPACK_IMPORTED_MODULE_3__;
(0,_register_helper__WEBPACK_IMPORTED_MODULE_1__["default"])('VerificationForm', VerificationForm);

function install() {
  if (window.SF?.Verification?.contract === 'single-input') return window.SF.Verification;
  window.SF = window.SF || {};
  const api = {
    contract: 'single-input',
    initAll,
    getValue,
    setValue
  };
  window.SF.Verification = api;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initAll(), {
      once: true
    });
  } else initAll();

  const observer = new MutationObserver(mutations => mutations.forEach(mutation => {
    mutation.removedNodes.forEach(node => {
      if (!(node instanceof Element)) return;
      if (node.matches?.(FORM_SELECTOR)) unbind(node);
      node.querySelectorAll?.(FORM_SELECTOR).forEach(unbind);
    });
    mutation.addedNodes.forEach(node => {
      if (node instanceof Element) initAll(node);
    });
  }));
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
  return api;
}

if (typeof window !== 'undefined') install();

/***/ },

/***/ "e8980134012b"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _verification__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d4a6de1bf8b2");
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

/***/ "4238cb1a8806"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "abd75d757c58"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{".sf-verification-form":["flex/1 (.flex-1)","display/flex (.flex)","flex-direction/column (.flex-col)","flex-wrap/nowrap (.flex-nowrap)","gap/var(--sf-space-1\\\\/3)","justify-content/flex-start (.justify-start)","align-items/flex-start (.items-start)"],".sf-verification-form .sf-verification-form-wrap":["display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","gap/var(--sf-b0)","justify-content/flex-start (.justify-start)","align-items/center (.items-center)"]}');

/***/ },

/***/ "0a5cfbb47dfc"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{".sf-verification":["display/flex (.flex)","flex-direction/column (.flex-col)","flex-wrap/nowrap (.flex-nowrap)","justify-content/center (.justify-center)","align-items/center (.items-center)"]}');

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
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("4238cb1a8806");
/* harmony import */ var _js_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("e8980134012b");
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