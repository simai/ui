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

/***/ "d1a6a5f99125"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bindTextarea: () => (/* binding */ bindTextarea),
/* harmony export */   setTextareaState: () => (/* binding */ setTextareaState),
/* harmony export */   unbindTextarea: () => (/* binding */ unbindTextarea)
/* harmony export */ });
/* harmony import */ var _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d7f974466839");
/* harmony import */ var _register_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("58661bec99a6");
/* harmony import */ var _json_textarea_utility_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("9fe5ba254a5b");
/* harmony import */ var _field_contract__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("e138a730fd7c");




const TEXTAREA_SELECTOR = 'label.sf-textarea';
const TEXTAREA_BOUND_FLAG = 'sfTextareaBound';

function toBoolean(value, fallback = false) {
  if (value === undefined || value === null || value === '') return fallback;
  if (typeof value === 'boolean') return value;
  return ['1', 'true', 'yes', 'on'].includes(String(value).toLowerCase());
}

function getTextareaNode(root) {
  return root?.querySelector?.('textarea') || null;
}

function getMessageNode(root) {
  return root?.querySelector?.('.sf-textarea-hint-text-wrap') || null;
}

function ensureMessageNode(root) {
  const existing = getMessageNode(root);
  if (existing) return existing;
  const messageNode = document.createElement('span');
  messageNode.classList.add('sf-textarea-hint-text-wrap');
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

function resolveMaskConfig(root, textarea) {
  const enabled = toBoolean(textarea.dataset.mask ?? root.dataset.mask, false);
  if (!enabled) return null;
  const fromTextarea = parseMaskOptions(textarea.dataset.maskOptions);
  const fromRoot = parseMaskOptions(root.dataset.maskOptions);
  if (fromTextarea) return fromTextarea;
  if (fromRoot) return fromRoot;
  const pattern = textarea.dataset.maskPattern ?? root.dataset.maskPattern;
  if (pattern) return {
    mask: String(pattern)
  };
  return null;
}

async function bindMask(root, textarea) {
  const config = resolveMaskConfig(root, textarea);
  if (!config) return;
  if (!window.SF?.Mask?.create) return;

  try {
    const instance = await window.SF.Mask.create(textarea, config);
    if (!instance) return;

    if (root.dataset[TEXTAREA_BOUND_FLAG] !== '1') {
      window.SF.Mask.destroy(instance);
      return;
    }

    root.__sfTextareaMask = instance;
  } catch (error) {
    console.warn('SF.Textarea mask init failed', error);
  }
}

function bindTextarea(root) {
  if (!root || root.dataset[TEXTAREA_BOUND_FLAG] === '1') return;
  const textarea = getTextareaNode(root);
  if (!textarea) return;

  const noopHandler = () => {};

  textarea.addEventListener('input', noopHandler);
  root.__sfTextareaNoopHandler = noopHandler;
  root.dataset[TEXTAREA_BOUND_FLAG] = '1';
  const message = messageState(root);
  (0,_field_contract__WEBPACK_IMPORTED_MODULE_3__.syncFieldContract)(root, textarea, {
    prefix: 'sf-textarea',
    required: textarea.required || Boolean(root.querySelector('.sf-textarea-required')),
    invalid: root.classList.contains('error') || textarea.classList.contains('error'),
    ...message
  });
  bindMask(root, textarea);
}

function unbindTextarea(root) {
  if (!root || root.dataset[TEXTAREA_BOUND_FLAG] !== '1') return;
  const textarea = getTextareaNode(root);

  if (textarea && root.__sfTextareaNoopHandler) {
    textarea.removeEventListener('input', root.__sfTextareaNoopHandler);
  }

  if (root.__sfTextareaMask) {
    window.SF?.Mask?.destroy?.(root.__sfTextareaMask);
  }

  delete root.__sfTextareaMask;
  delete root.__sfTextareaNoopHandler;
  delete root.dataset[TEXTAREA_BOUND_FLAG];
}

function initExistingTextareas(target = document) {
  target.querySelectorAll(TEXTAREA_SELECTOR).forEach(bindTextarea);
}

function setTextareaState(target, state = {}) {
  const root = target instanceof HTMLElement ? target.closest(TEXTAREA_SELECTOR) || target : null;
  if (!root) return false;
  const textarea = getTextareaNode(root);
  if (!textarea) return false;

  if (Object.prototype.hasOwnProperty.call(state, 'disabled')) {
    textarea.disabled = toBoolean(state.disabled);
  }

  if (Object.prototype.hasOwnProperty.call(state, 'error')) {
    const invalid = toBoolean(state.error);
    root.classList.toggle('error', invalid);
    textarea.classList.toggle('error', invalid);
  }

  if (Object.prototype.hasOwnProperty.call(state, 'invalid')) {
    const invalid = toBoolean(state.invalid);
    root.classList.toggle('error', invalid);
    textarea.classList.toggle('error', invalid);
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
    textarea.value = String(state.value ?? '');
    textarea.dispatchEvent(new Event('input', {
      bubbles: true
    }));
  }

  (0,_field_contract__WEBPACK_IMPORTED_MODULE_3__.syncFieldContract)(root, textarea, {
    prefix: 'sf-textarea',
    required: textarea.required || Boolean(root.querySelector('.sf-textarea-required')),
    invalid: root.classList.contains('error') || textarea.classList.contains('error'),
    ...messageState(root)
  });
  return true;
}

class Textarea extends _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__.ComponentObserver {
  static componentName = 'Textarea';
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
      rows = 3,
      disabled = false,
      readonly = false,
      error = false,
      invalid = false,
      errorMessage = '',
      mask = false,
      maskOptions,
      maskPattern
    } = this.params || {};
    const className = this.attrs.class || this.attrs.className;
    this.template = document.createElement('label');
    if (this.id) this.template.id = this.id;
    this.template.classList.add('sf-textarea', `sf-textarea--size-${size}`, `sf-textarea--${type}`);
    this.template.classList.toggle('error', toBoolean(invalid || error, false));

    if (className) {
      this.template.classList.add(...`${className}`.split(' ').filter(Boolean));
    }

    const labelWrap = document.createElement('span');
    labelWrap.classList.add('sf-textarea-label');
    const labelText = document.createElement('span');
    labelText.classList.add('sf-textarea-text');
    labelText.textContent = String(label);
    labelWrap.append(labelText);

    if (toBoolean(required, true)) {
      const requiredMark = document.createElement('span');
      requiredMark.classList.add('sf-textarea-required');
      requiredMark.textContent = '*';
      labelWrap.append(requiredMark);
    }

    const textarea = document.createElement('textarea');
    textarea.placeholder = String(placeholder ?? '');
    textarea.value = String(value ?? '');
    textarea.rows = Number(rows) > 0 ? Number(rows) : 3;
    if (name) textarea.name = String(name);
    textarea.disabled = toBoolean(disabled, false);
    textarea.readOnly = toBoolean(readonly, false);
    textarea.required = toBoolean(required, true);
    textarea.classList.toggle('error', toBoolean(invalid || error, false));
    textarea.dataset.mask = String(Boolean(mask));
    if (maskPattern) textarea.dataset.maskPattern = String(maskPattern);

    if (maskOptions && typeof maskOptions === 'object') {
      textarea.dataset.maskOptions = JSON.stringify(maskOptions);
    }

    this.template.append(labelWrap, textarea);
    const message = toBoolean(invalid || error, false) && errorMessage ? errorMessage : hint;

    if (message) {
      const hintWrap = document.createElement('span');
      hintWrap.classList.add('sf-textarea-hint-text-wrap');
      hintWrap.textContent = String(message);
      hintWrap.dataset.fieldMessage = toBoolean(invalid || error, false) && errorMessage ? 'error' : 'hint';
      this.template.append(hintWrap);
    }

    this.applyLayoutUtilities(this.template, '.sf-textarea');
    this.applyLayoutUtilities(labelWrap, '.sf-textarea .sf-textarea-label');
    this.applyLayoutUtilities(textarea, '.sf-textarea textarea');
  }

  init() {
    bindTextarea(this.template);
  }

  destroyInternal() {
    unbindTextarea(this.template);
  }

}

Textarea.utilityMap = _json_textarea_utility_json__WEBPACK_IMPORTED_MODULE_2__;
(0,_register_helper__WEBPACK_IMPORTED_MODULE_1__["default"])('Textarea', Textarea);

if (typeof window !== 'undefined') {
  window.SF = window.SF || {};
  window.SF.Textarea = window.SF.Textarea || {};
  window.SF.Textarea.setState = setTextareaState;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initExistingTextareas());
} else {
  initExistingTextareas();
}

const textareaObserver = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (!(node instanceof Element)) return;

      if (node.matches?.(TEXTAREA_SELECTOR)) {
        bindTextarea(node);
      }

      initExistingTextareas(node);
    });
  });
});
textareaObserver.observe(document.documentElement, {
  childList: true,
  subtree: true
});


/***/ },

/***/ "5d28d50fe1f7"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _textarea__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d1a6a5f99125");
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

/***/ "2e93e8130040"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "9fe5ba254a5b"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{".sf-textarea":["display/flex (.flex)","flex-direction/column (.flex-col)","flex-wrap/nowrap (.flex-nowrap)","gap/var(--sf-space-1\\\\/4)","justify-content/flex-start (.justify-start)","align-items/flex-start (.items-start)"],".sf-textarea .sf-textarea-label":["flex/1 (.flex-1)","display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","gap/var(--sf-space-1\\\\/4)","justify-content/flex-start (.justify-start)","align-items/flex-start (.items-start)"],".sf-textarea textarea":["flex/1 (.flex-1)","display/flex (.flex)"],".sf-textarea .sf-textarea-hint-text-wrap":["flex/1 (.flex-1)","display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","gap/var(--sf-b0)","justify-content/flex-start (.justify-start)","align-items/center (.items-center)"]}');

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
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2e93e8130040");
/* harmony import */ var _js_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5d28d50fe1f7");
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