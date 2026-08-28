/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "e138a730fd7c"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createFieldContract: () => (/* binding */ createFieldContract),
/* harmony export */   syncFieldContract: () => (/* binding */ syncFieldContract)
/* harmony export */ });
let fieldSequence = 0;
const fieldIdentities = new WeakMap();

function nextIdentity(owner, prefix) {
  if (owner && fieldIdentities.has(owner)) return fieldIdentities.get(owner);
  const explicit = owner?.id ? String(owner.id).trim() : '';
  const base = explicit || `${prefix}-${++fieldSequence}`;
  const identity = {
    controlId: `${base}-control`,
    messageId: `${base}-message`
  };

  if (owner && (typeof owner === 'object' || typeof owner === 'function')) {
    fieldIdentities.set(owner, identity);
  }

  return identity;
}

function mergeIdRefs(existing, additions) {
  return [...new Set([...String(existing || '').split(/\s+/).filter(Boolean), ...additions.filter(Boolean)])].join(' ');
}

function createFieldContract(owner, {
  prefix = 'sf-field',
  required = false,
  invalid = false,
  hint = '',
  errorMessage = ''
} = {}) {
  const identity = nextIdentity(owner, prefix);
  const normalizedInvalid = Boolean(invalid);
  const message = normalizedInvalid && errorMessage ? errorMessage : hint;
  return { ...identity,
    required: Boolean(required),
    invalid: normalizedInvalid,
    message,
    describedBy: message ? identity.messageId : '',
    errorMessageId: normalizedInvalid && errorMessage ? identity.messageId : ''
  };
}
function syncFieldContract(root, control, {
  prefix = 'sf-field',
  required = false,
  invalid = false,
  messageNode = null,
  errorMessage = ''
} = {}) {
  if (!root || !control) return null;
  const hint = messageNode?.textContent?.trim() || '';
  const contract = createFieldContract(root, {
    prefix,
    required,
    invalid,
    hint,
    errorMessage
  });
  if (!control.id) control.id = contract.controlId;
  control.required = contract.required;
  root.classList.toggle('error', contract.invalid);
  control.classList.toggle('error', contract.invalid);
  if (contract.invalid) control.setAttribute('aria-invalid', 'true');else control.removeAttribute('aria-invalid');

  if (messageNode) {
    if (!messageNode.id) messageNode.id = contract.messageId;
    control.setAttribute('aria-describedby', mergeIdRefs(control.getAttribute('aria-describedby'), [messageNode.id]));
  }

  if (contract.errorMessageId && messageNode) {
    control.setAttribute('aria-errormessage', messageNode.id);
  } else {
    control.removeAttribute('aria-errormessage');
  }

  return contract;
}

/***/ },

/***/ "73aef1a2bf74"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bindInput: () => (/* binding */ bindInput),
/* harmony export */   setInputState: () => (/* binding */ setInputState),
/* harmony export */   unbindInput: () => (/* binding */ unbindInput)
/* harmony export */ });
/* harmony import */ var _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d7f974466839");
/* harmony import */ var _register_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("58661bec99a6");
/* harmony import */ var _json_input_utility_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("d6935866be49");
/* harmony import */ var _field_contract__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("e138a730fd7c");




const INPUT_SELECTOR = 'label.sf-input';
const INPUT_BOUND_FLAG = 'sfInputBound';

function toBoolean(value, fallback = false) {
  if (value === undefined || value === null || value === '') return fallback;
  if (typeof value === 'boolean') return value;
  return ['1', 'true', 'yes', 'on'].includes(String(value).toLowerCase());
}

function getInputNode(root) {
  return root?.querySelector?.('.sf-input-field input, input') || null;
}

function getMessageNode(root) {
  return root?.querySelector?.('.sf-input-hint-text-wrap') || null;
}

function ensureMessageNode(root) {
  const existing = getMessageNode(root);
  if (existing) return existing;
  const messageNode = document.createElement('span');
  messageNode.classList.add('sf-input-hint-text-wrap');
  root.append(messageNode);
  return messageNode;
}

function messageState(root) {
  const messageNode = getMessageNode(root);
  return {
    messageNode,
    errorMessage: messageNode?.dataset.fieldMessage === 'error' ? messageNode.textContent?.trim() || '' : ''
  };
}

function parseMaskOptions(raw) {
  if (!raw || typeof raw !== 'string') return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;

  try {
    const parsed = JSON.parse(trimmed);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
}

function resolveMaskConfig(root, input) {
  const enabled = toBoolean(input.dataset.mask ?? root.dataset.mask, false);
  if (!enabled) return null;
  const fromInput = parseMaskOptions(input.dataset.maskOptions);
  const fromRoot = parseMaskOptions(root.dataset.maskOptions);
  if (fromInput) return applyMaskOptionAttributes(fromInput, root, input);
  if (fromRoot) return applyMaskOptionAttributes(fromRoot, root, input);
  const pattern = input.dataset.maskPattern ?? root.dataset.maskPattern;

  if (pattern) {
    return applyMaskOptionAttributes({
      mask: String(pattern)
    }, root, input);
  }

  return null;
}

function applyMaskOptionAttributes(config, root, input) {
  const nextConfig = { ...config
  };
  const lazy = input.dataset.maskLazy ?? root.dataset.maskLazy;
  const placeholderChar = input.dataset.maskPlaceholderChar ?? root.dataset.maskPlaceholderChar;

  if (typeof lazy !== 'undefined' && lazy !== '') {
    nextConfig.lazy = toBoolean(lazy, true);
  }

  if (typeof placeholderChar !== 'undefined' && placeholderChar !== '') {
    nextConfig.placeholderChar = String(placeholderChar);
  }

  return nextConfig;
}

async function bindMask(root, input) {
  const config = resolveMaskConfig(root, input);
  if (!config) return;
  if (!window.SF?.Mask?.create) return;

  try {
    const instance = await window.SF.Mask.create(input, config);
    if (!instance) return;

    if (root.dataset[INPUT_BOUND_FLAG] !== '1') {
      window.SF.Mask.destroy(instance);
      return;
    }

    root.__sfInputMask = instance;
  } catch (error) {
    console.warn('SF.Input mask init failed', error);
  }
}

function bindInput(root) {
  if (!root || root.dataset[INPUT_BOUND_FLAG] === '1') return;
  const input = getInputNode(root);
  if (!input) return; // Placeholder for shared behaviors (masking/validation hooks).

  const noopHandler = () => {};

  input.addEventListener('input', noopHandler);
  root.__sfInputNoopHandler = noopHandler;
  root.dataset[INPUT_BOUND_FLAG] = '1';
  const message = messageState(root);
  (0,_field_contract__WEBPACK_IMPORTED_MODULE_3__.syncFieldContract)(root, input, {
    prefix: 'sf-input',
    required: input.required || Boolean(root.querySelector('.sf-input-required')),
    invalid: root.classList.contains('error') || input.classList.contains('error'),
    ...message
  });
  bindMask(root, input);
}

function unbindInput(root) {
  if (!root || root.dataset[INPUT_BOUND_FLAG] !== '1') return;
  const input = getInputNode(root);

  if (input && root.__sfInputNoopHandler) {
    input.removeEventListener('input', root.__sfInputNoopHandler);
  }

  if (root.__sfInputMask) {
    window.SF?.Mask?.destroy?.(root.__sfInputMask);
  }

  delete root.__sfInputMask;
  delete root.__sfInputNoopHandler;
  delete root.dataset[INPUT_BOUND_FLAG];
}

function initExistingInputs(target = document) {
  target.querySelectorAll(INPUT_SELECTOR).forEach(bindInput);
}

function setInputState(target, state = {}) {
  const root = target instanceof HTMLElement ? target.closest(INPUT_SELECTOR) || target : null;
  if (!root) return false;
  const input = getInputNode(root);
  if (!input) return false;

  if (Object.prototype.hasOwnProperty.call(state, 'disabled')) {
    input.disabled = toBoolean(state.disabled);
  }

  if (Object.prototype.hasOwnProperty.call(state, 'error')) {
    const invalid = toBoolean(state.error);
    root.classList.toggle('error', invalid);
    input.classList.toggle('error', invalid);
  }

  if (Object.prototype.hasOwnProperty.call(state, 'invalid')) {
    const invalid = toBoolean(state.invalid);
    root.classList.toggle('error', invalid);
    input.classList.toggle('error', invalid);
  }

  if (Object.prototype.hasOwnProperty.call(state, 'errorMessage')) {
    const value = String(state.errorMessage ?? '');
    const messageNode = value ? ensureMessageNode(root) : getMessageNode(root);

    if (messageNode) {
      messageNode.textContent = value;
      messageNode.dataset.fieldMessage = value ? 'error' : 'hint';
    }
  }

  if (Object.prototype.hasOwnProperty.call(state, 'value')) {
    input.value = String(state.value ?? '');
    input.dispatchEvent(new Event('input', {
      bubbles: true
    }));
  }

  (0,_field_contract__WEBPACK_IMPORTED_MODULE_3__.syncFieldContract)(root, input, {
    prefix: 'sf-input',
    required: input.required || Boolean(root.querySelector('.sf-input-required')),
    invalid: root.classList.contains('error') || input.classList.contains('error'),
    ...messageState(root)
  });
  return true;
}

class Inputs extends _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__.ComponentObserver {
  static componentName = 'Inputs';
  html = null;

  constructor(props) {
    super(props);
    const {
      size = '1',
      type = 'bordered',
      label = 'Label',
      required = true,
      placeholder = 'placeholder',
      hint = '',
      value = '',
      name = '',
      leftIcon = '',
      rightText = '',
      hintIcon = '',
      disabled = false,
      readonly = false,
      error = false,
      invalid = false,
      errorMessage = '',
      mask = false,
      maskPattern = '',
      maskLazy = '',
      maskPlaceholderChar = '',
      maskOptions = ''
    } = this.params || {};
    const className = this.attrs.class || this.attrs.className;
    this.template = document.createElement('label');
    if (this.id) this.template.id = this.id;
    this.template.classList.add('sf-input', `sf-input--size-${size}`, `sf-input--${type}`);
    this.template.classList.toggle('error', toBoolean(invalid || error, false));
    this.template.dataset.mask = String(toBoolean(mask, false));
    this.template.dataset.maskPattern = String(maskPattern || '');
    this.template.dataset.maskLazy = String(maskLazy ?? '');
    this.template.dataset.maskPlaceholderChar = String(maskPlaceholderChar || '');
    this.template.dataset.maskOptions = String(maskOptions || '');

    if (className) {
      this.template.classList.add(...`${className}`.split(' ').filter(Boolean));
    }

    const labelWrap = document.createElement('span');
    labelWrap.classList.add('sf-input-label');
    const labelText = document.createElement('span');
    labelText.classList.add('sf-input-text');
    labelText.textContent = label;
    labelWrap.append(labelText);

    if (toBoolean(required, true)) {
      const requiredMark = document.createElement('span');
      requiredMark.classList.add('sf-input-required');
      requiredMark.textContent = '*';
      labelWrap.append(requiredMark);
    }

    const field = document.createElement('span');
    field.classList.add('sf-input-field');

    if (leftIcon) {
      const icon = document.createElement('i');
      icon.classList.add('sf-icon');
      icon.textContent = String(leftIcon);
      field.append(icon);
    }

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = String(placeholder ?? '');
    input.value = String(value ?? '');
    if (name) input.name = String(name);
    input.disabled = toBoolean(disabled, false);
    input.readOnly = toBoolean(readonly, false);
    input.required = toBoolean(required, true);
    input.dataset.mask = String(toBoolean(mask, false));
    input.dataset.maskPattern = String(maskPattern || '');
    input.dataset.maskLazy = String(maskLazy ?? '');
    input.dataset.maskPlaceholderChar = String(maskPlaceholderChar || '');
    input.dataset.maskOptions = String(maskOptions || '');
    input.classList.toggle('error', toBoolean(invalid || error, false));
    field.append(input);

    if (rightText) {
      const right = document.createElement('span');
      right.classList.add('sf-input-right');
      right.textContent = String(rightText);
      field.append(right);
    }

    if (hintIcon) {
      const iconHint = document.createElement('i');
      iconHint.classList.add('sf-icon', 'sf-icon-hint');
      iconHint.textContent = String(hintIcon);
      field.append(iconHint);
    }

    this.template.append(labelWrap, field);
    const message = toBoolean(invalid || error, false) && errorMessage ? errorMessage : hint;

    if (message) {
      const hintWrap = document.createElement('span');
      hintWrap.classList.add('sf-input-hint-text-wrap');
      hintWrap.textContent = String(message);
      hintWrap.dataset.fieldMessage = toBoolean(invalid || error, false) && errorMessage ? 'error' : 'hint';
      this.template.append(hintWrap);
    }

    this.applyLayoutUtilities(this.template, '.sf-input');
    this.applyLayoutUtilities(labelWrap, '.sf-input .sf-input-group');
    this.applyLayoutUtilities(field, '.sf-input .sf-input-field');
    this.applyLayoutUtilities(input, '.sf-input .sf-input-text-container');
  }

  init() {
    bindInput(this.template);
  }

  destroyInternal() {
    unbindInput(this.template);
  }

}

Inputs.utilityMap = _json_input_utility_json__WEBPACK_IMPORTED_MODULE_2__;
(0,_register_helper__WEBPACK_IMPORTED_MODULE_1__["default"])('Inputs', Inputs);

if (typeof window !== 'undefined') {
  window.SF = window.SF || {};
  window.SF.Input = window.SF.Input || {};
  window.SF.Input.setState = setInputState;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initExistingInputs());
} else {
  initExistingInputs();
}

const inputObserver = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (!(node instanceof Element)) return;

      if (node.matches?.(INPUT_SELECTOR)) {
        bindInput(node);
      }

      initExistingInputs(node);
    });
  });
});
inputObserver.observe(document.documentElement, {
  childList: true,
  subtree: true
});


/***/ },

/***/ "82934b8e84bb"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _inputs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("73aef1a2bf74");
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

/***/ "f8617676bb87"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "d6935866be49"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{".sf-input":["display/flex (.flex)","flex-direction/column (.flex-col)","flex-wrap/nowrap (.flex-nowrap)","gap/var(--sf-space-1\\\\/4)","justify-content/flex-start (.justify-start)","align-items/flex-start (.items-start)"],".sf-input .sf-input-field":["flex/1 (.flex-1)","display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","justify-content/flex-start (.justify-start)","align-items/center (.items-center)"],".sf-input .sf-input-field .sf-icon":["display/flex (.flex)","justify-content/flex-start (.justify-start)","align-items/center (.items-center)"],".sf-input .sf-input-text-container":["flex/1 (.flex-1)","display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","justify-content/flex-start (.justify-start)","align-items/center (.items-center)"],".sf-input .sf-input-group":["display/flex (.flex)","flex-direction/column (.flex-col)","flex-wrap/nowrap (.flex-nowrap)","justify-content/center (.justify-center)","align-items/flex-start (.items-start)"],".sf-input .sf-input-text-container-alt":["display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","justify-content/center (.justify-center)","align-items/center (.items-center)"],".sf-input .sf-icon-alt":["display/flex (.flex)","justify-content/flex-start (.justify-start)","align-items/center (.items-center)"],".sf-input .sf-input-hint-text-wrap":["flex/1 (.flex-1)","display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","gap/var(--sf-b0)","justify-content/flex-start (.justify-start)","align-items/center (.items-center)"]}');

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
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("f8617676bb87");
/* harmony import */ var _js_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("82934b8e84bb");
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