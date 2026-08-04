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




const VERIFICATION_FORM_SELECTOR = '.sf-verification-form';
const VERIFICATION_SELECTOR = '.sf-verification';
const BOUND_FORM_FLAG = 'sfVerificationFormBound';

function getFormInputs(root) {
  return Array.from(root?.querySelectorAll?.(`${VERIFICATION_SELECTOR} input`) || []);
}

function normalizeInputValue(input, raw) {
  if (!input) return '';
  const mode = String(input.dataset.mode || 'numeric').toLowerCase();
  const source = String(raw ?? input.value ?? '');
  let filtered = source;

  if (mode === 'numeric') {
    filtered = filtered.replace(/\D/g, '');
  } else if (mode === 'alphanumeric') {
    filtered = filtered.replace(/[^a-z0-9]/gi, '');
  } else {
    filtered = filtered.replace(/\s/g, '');
  }

  const normalized = filtered.slice(0, 1);
  input.value = normalized;
  return normalized;
}

function syncVerificationActiveState(root) {
  getFormInputs(root).forEach(input => {
    const box = input.closest(VERIFICATION_SELECTOR);
    if (!box) return;

    if (box.classList.contains('error')) {
      box.classList.remove('active');
      return;
    }

    box.classList.toggle('active', Boolean(String(input.value || '').trim()));
  });
}

function focusInput(input) {
  if (!input || input.disabled) return;
  input.focus();
  if (typeof input.select === 'function') input.select();
}

function onFormPaste(root, event) {
  const inputs = getFormInputs(root).filter(input => !input.disabled);
  if (!inputs.length) return;
  event.preventDefault();
  const target = event.target instanceof HTMLInputElement ? event.target : inputs[0];
  const startIndex = Math.max(0, inputs.indexOf(target));
  const payload = event.clipboardData?.getData('text') || '';
  const mode = String(target?.dataset?.mode || 'numeric').toLowerCase();
  let chars = payload;

  if (mode === 'numeric') {
    chars = chars.replace(/\D/g, '');
  } else if (mode === 'alphanumeric') {
    chars = chars.replace(/[^a-z0-9]/gi, '');
  } else {
    chars = chars.replace(/\s/g, '');
  }

  if (!chars) return;
  let lastFilled = startIndex;
  chars.split('').forEach((char, offset) => {
    const input = inputs[startIndex + offset];
    if (!input) return;
    input.value = char;
    lastFilled = startIndex + offset;
  });
  syncVerificationActiveState(root);
  focusInput(inputs[Math.min(lastFilled + 1, inputs.length - 1)]);
}

function bindVerificationForm(root) {
  if (!root || root.dataset[BOUND_FORM_FLAG] === '1') return;
  const inputs = getFormInputs(root);
  if (!inputs.length) return;

  const onInput = event => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement)) return;
    const box = input.closest(VERIFICATION_SELECTOR);

    if (box?.classList.contains('error')) {
      box.classList.remove('error');
    }

    const normalized = normalizeInputValue(input, input.value);
    syncVerificationActiveState(root);
    if (!normalized) return;
    const enabledInputs = getFormInputs(root).filter(item => !item.disabled);
    const index = enabledInputs.indexOf(input);
    const next = enabledInputs[index + 1];
    if (next) focusInput(next);
  };

  const onKeydown = event => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement)) return;
    const enabledInputs = getFormInputs(root).filter(item => !item.disabled);
    const index = enabledInputs.indexOf(input);
    const prev = enabledInputs[index - 1];

    if (event.key === 'Backspace' && !input.value && prev) {
      event.preventDefault();
      prev.value = '';
      syncVerificationActiveState(root);
      focusInput(prev);
    }

    if (event.key === 'ArrowLeft' && prev) {
      event.preventDefault();
      focusInput(prev);
    }

    if (event.key === 'ArrowRight') {
      const next = enabledInputs[index + 1];

      if (next) {
        event.preventDefault();
        focusInput(next);
      }
    }
  };

  const onFocus = event => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement)) return;
    if (typeof input.select === 'function') input.select();
  };

  const onPaste = event => onFormPaste(root, event);

  inputs.forEach(input => {
    if (!input.hasAttribute('maxlength')) input.setAttribute('maxlength', '1');
    input.addEventListener('input', onInput);
    input.addEventListener('keydown', onKeydown);
    input.addEventListener('focus', onFocus);
  });
  root.addEventListener('paste', onPaste);
  root.__sfVerificationOnInput = onInput;
  root.__sfVerificationOnKeydown = onKeydown;
  root.__sfVerificationOnFocus = onFocus;
  root.__sfVerificationOnPaste = onPaste;
  root.dataset[BOUND_FORM_FLAG] = '1';
  syncVerificationActiveState(root);
}

function unbindVerificationForm(root) {
  if (!root || root.dataset[BOUND_FORM_FLAG] !== '1') return;
  const inputs = getFormInputs(root);
  inputs.forEach(input => {
    if (root.__sfVerificationOnInput) {
      input.removeEventListener('input', root.__sfVerificationOnInput);
    }

    if (root.__sfVerificationOnKeydown) {
      input.removeEventListener('keydown', root.__sfVerificationOnKeydown);
    }

    if (root.__sfVerificationOnFocus) {
      input.removeEventListener('focus', root.__sfVerificationOnFocus);
    }
  });

  if (root.__sfVerificationOnPaste) {
    root.removeEventListener('paste', root.__sfVerificationOnPaste);
  }

  delete root.__sfVerificationOnInput;
  delete root.__sfVerificationOnKeydown;
  delete root.__sfVerificationOnFocus;
  delete root.__sfVerificationOnPaste;
  delete root.dataset[BOUND_FORM_FLAG];
}

function initExistingVerificationForms(target = document) {
  target.querySelectorAll(VERIFICATION_FORM_SELECTOR).forEach(bindVerificationForm);
}

function getVerificationValue(target) {
  const root = target instanceof HTMLElement ? target.closest(VERIFICATION_FORM_SELECTOR) || target : null;
  if (!root) return '';
  return getFormInputs(root).map(input => String(input.value || '')).join('');
}

function setVerificationValue(target, value = '') {
  const root = target instanceof HTMLElement ? target.closest(VERIFICATION_FORM_SELECTOR) || target : null;
  if (!root) return false;
  const inputs = getFormInputs(root);
  const chars = String(value || '').split('');
  inputs.forEach((input, index) => {
    input.value = chars[index] || '';
  });
  syncVerificationActiveState(root);
  return true;
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
    bindVerificationForm(this.template);
  }

  destroyInternal() {
    unbindVerificationForm(this.template);
  }

}

VerificationForm.utilityMap = _json_verification_form_utility_json__WEBPACK_IMPORTED_MODULE_3__;
(0,_register_helper__WEBPACK_IMPORTED_MODULE_1__["default"])('VerificationForm', VerificationForm);

if (typeof window !== 'undefined') {
  window.SF = window.SF || {};
  window.SF.Verification = window.SF.Verification || {};
  window.SF.Verification.getValue = getVerificationValue;
  window.SF.Verification.setValue = setVerificationValue;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initExistingVerificationForms());
} else {
  initExistingVerificationForms();
}

const verificationObserver = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (!(node instanceof Element)) return;

      if (node.matches?.(VERIFICATION_FORM_SELECTOR)) {
        bindVerificationForm(node);
      }

      initExistingVerificationForms(node);
    });
  });
});
verificationObserver.observe(document.documentElement, {
  childList: true,
  subtree: true
});

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