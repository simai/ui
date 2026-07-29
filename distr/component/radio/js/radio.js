/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "c2e2433fb668"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bindRadio: () => (/* binding */ bindRadio),
/* harmony export */   setRadioState: () => (/* binding */ setRadioState),
/* harmony export */   syncRadioState: () => (/* binding */ syncRadioState),
/* harmony export */   unbindRadio: () => (/* binding */ unbindRadio)
/* harmony export */ });
/* harmony import */ var _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d7f974466839");
/* harmony import */ var _register_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("58661bec99a6");


const RADIO_SELECTOR = 'label.sf-radio-button';
const RADIO_BOUND_FLAG = 'sfRadioBound';
const RADIO_FONT_WRAP_SELECTOR = '.sf-radio-wrap--type-font';
const RADIO_INTERNAL_ATTRS = new Set(['class', 'className', 'type', 'count', 'text', 'title', 'description', 'help', 'checked', 'disabled']);

function toBoolean(value, defaultValue = false) {
  if (value === undefined || value === null || value === '') return defaultValue;
  if (typeof value === 'boolean') return value;
  const normalized = String(value).toLowerCase();
  return ['1', 'true', 'yes', 'on', 'checked', 'disabled'].includes(normalized);
}

function toNumber(value, defaultValue = 0) {
  const nextValue = Number(value);
  return Number.isFinite(nextValue) ? nextValue : defaultValue;
}

function toArray(value) {
  if (Array.isArray(value)) {
    return value;
  }

  if (value === undefined || value === null || value === '') {
    return [];
  }

  if (typeof value === 'string') {
    const normalized = value.trim();

    if (!normalized) {
      return [];
    }

    if (normalized.startsWith('[') && normalized.endsWith(']') || normalized.startsWith('{') && normalized.endsWith('}')) {
      try {
        const parsed = JSON.parse(normalized);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return normalized.slice(1, -1).split(',').map(item => item.trim()).filter(Boolean);
      }
    }

    return normalized.split(',').map(item => item.trim()).filter(Boolean);
  }

  return [value];
}

function getRadioNodes(root) {
  if (!root) return {};
  const input = root.querySelector('input[type="radio"]');
  const mark = root.querySelector('.sf-radio-button-box .sf-radio-button-mark');
  return {
    input,
    mark
  };
}

function getRadioGroupRoots(input) {
  if (!(input instanceof HTMLInputElement) || input.type !== 'radio' || !input.name) {
    return [];
  }

  return Array.from(document.querySelectorAll(`${RADIO_SELECTOR} input[type="radio"][name="${input.name}"]`)).map(node => node.closest(RADIO_SELECTOR)).filter(Boolean);
}

function syncRadioState(root) {
  const {
    input,
    mark
  } = getRadioNodes(root);
  if (!input) return;
  root.classList.toggle('active', !!input.checked);
  root.classList.toggle('disabled', !!input.disabled);

  if (mark) {
    mark.setAttribute('aria-hidden', 'true');
  }
}

function syncFontRadioWrap(input) {
  const wrap = input?.closest?.(RADIO_FONT_WRAP_SELECTOR);
  if (!wrap) return;
  const descriptions = toArray(wrap.dataset.sfRadioDescriptions || '');
  const descriptionNode = wrap.querySelector('.sf-radio-button-description');
  const checkedInput = wrap.querySelector(`${RADIO_SELECTOR} input[type="radio"]:checked`);
  const checkedIndex = toNumber(checkedInput?.dataset?.sfRadioFontIndex, -1);
  wrap.querySelectorAll('.sf-radio-text').forEach((node, index) => node.classList.toggle('active', index === checkedIndex));
  if (!descriptionNode) return;

  if (checkedIndex >= 0 && checkedIndex < descriptions.length) {
    descriptionNode.textContent = descriptions[checkedIndex] || '';
    return;
  }

  descriptionNode.textContent = descriptions[0] || wrap.dataset.sfRadioDescription || '';
}

function refreshRadioGroup(input) {
  const roots = getRadioGroupRoots(input);

  if (!roots.length) {
    const root = input?.closest?.(RADIO_SELECTOR);

    if (root) {
      syncRadioState(root);
    }

    syncFontRadioWrap(input);
    return;
  }

  roots.forEach(root => syncRadioState(root));
  syncFontRadioWrap(input);
}

function bindRadio(root) {
  if (!root || root.dataset[RADIO_BOUND_FLAG] === '1') return;
  const {
    input
  } = getRadioNodes(root);
  if (!input) return;

  const handleChange = () => refreshRadioGroup(input);

  root.__sfRadioHandleChange = handleChange;
  input.addEventListener('change', handleChange);
  root.dataset[RADIO_BOUND_FLAG] = '1';
  syncRadioState(root);
}

function unbindRadio(root) {
  if (!root) return;
  const {
    input
  } = getRadioNodes(root);

  if (input && root.__sfRadioHandleChange) {
    input.removeEventListener('change', root.__sfRadioHandleChange);
  }

  delete root.__sfRadioHandleChange;
  delete root.dataset[RADIO_BOUND_FLAG];
}

function initRadioTree(target) {
  if (!(target instanceof Element) && target !== document) return;

  if (target instanceof Element && target.matches?.(RADIO_SELECTOR)) {
    bindRadio(target);
  }

  target.querySelectorAll?.(RADIO_SELECTOR).forEach(bindRadio);
}

function setRadioState(input, state = {}) {
  if (!(input instanceof HTMLInputElement) || input.type !== 'radio') {
    return false;
  }

  if (Object.prototype.hasOwnProperty.call(state, 'checked')) {
    input.checked = toBoolean(state.checked);
  }

  if (Object.prototype.hasOwnProperty.call(state, 'disabled')) {
    input.disabled = toBoolean(state.disabled);
  }

  refreshRadioGroup(input);
  return true;
}

function initExistingRadios(target = document) {
  initRadioTree(target);
}

function hideNativeRadioInput(input) {
  if (!(input instanceof HTMLInputElement) || input.type !== 'radio') {
    return input;
  }

  input.style.position = 'absolute';
  input.style.opacity = '0';
  input.style.pointerEvents = 'none';
  input.style.inlineSize = '0';
  input.style.blockSize = '0';
  input.style.margin = '0';
  return input;
}

class Radio extends _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__.ComponentObserver {
  static componentName = 'Radio';
  html = null;

  constructor(props) {
    super(props);
    const {
      size = '1',
      type = 'default',
      count = 0,
      text = '',
      title = '',
      description = '',
      help = '',
      checked = false,
      disabled = false,
      name = '',
      value
    } = this.params || {};
    const className = this.attrs.class || this.attrs.className;
    this.type = type || 'default';
    this.template = this.type === 'font' ? this.buildFontTemplate({
      size,
      count,
      text,
      title,
      description,
      help,
      checked,
      disabled,
      name,
      value,
      className
    }) : document.createElement('label');

    if (this.id) {
      this.template.id = this.id;
    }

    if (this.type === 'font') {
      return;
    }

    this.template.classList.add('sf-radio-button', `sf-radio-button--size-${size}`, `sf-radio-button--type-${type || 'default'}`);

    if (className) {
      this.template.classList.add(...`${className}`.split(' ').filter(Boolean));
    }

    this.box = document.createElement('span');
    this.box.classList.add('sf-radio-button-box');
    this.input = document.createElement('input');
    this.input.type = 'radio';

    if (name) {
      this.input.name = name;
    }

    if (value !== undefined) {
      this.input.value = value;
    }

    this.input.checked = this.type === 'font' ? this.previewCheckedIndex >= 0 || toBoolean(checked) : toBoolean(checked);
    this.input.disabled = toBoolean(disabled);
    hideNativeRadioInput(this.input);
    Object.entries(this.attrs).filter(([attr]) => !RADIO_INTERNAL_ATTRS.has(attr)).forEach(([attr, attrValue]) => {
      if (attrValue === undefined || attrValue === null) return;
      this.input.setAttribute(attr, attrValue);
    });

    if (this.type === 'font') {
      this.box.classList.add('sf-radio-button-box--font');
      this.box.append(this.input, this.createFontPreview());
    } else {
      this.mark = document.createElement('span');
      this.mark.classList.add('sf-radio-button-mark');
      this.mark.setAttribute('aria-hidden', 'true');
      this.box.append(this.input, this.mark);
    }

    this.template.append(this.box);
    const descriptionText = this.type === 'font' ? this.getSelectedDescription(description) : description;

    if (title || descriptionText || help) {
      this.container = document.createElement('span');
      this.container.classList.add('sf-radio-button-container', 'flex', 'flex-col');

      if (title || help) {
        this.top = document.createElement('span');
        this.top.classList.add('sf-radio-button-top', 'flex');

        if (title) {
          this.text = document.createElement('span');
          this.text.classList.add('sf-radio-button-text');
          this.text.textContent = title;
          this.top.append(this.text);
        }

        if (help) {
          this.helpIcon = document.createElement('i');
          this.helpIcon.classList.add('sf-icon');
          this.helpIcon.setAttribute('aria-hidden', 'true');
          this.helpIcon.textContent = help;
          this.top.append(this.helpIcon);
        }

        this.container.append(this.top);
      }

      if (descriptionText) {
        this.description = document.createElement('span');
        this.description.classList.add('sf-radio-button-description');
        this.description.textContent = descriptionText;
        this.container.append(this.description);
      }

      this.template.append(this.container);
    }
  }

  init() {
    initRadioTree(this.template);
  }

  destroyInternal() {
    if (!this.template) return;

    if (this.template.matches?.(RADIO_SELECTOR)) {
      unbindRadio(this.template);
      return;
    }

    this.template.querySelectorAll?.(RADIO_SELECTOR).forEach(unbindRadio);
  }

  resolveCheckedIndex(checked, count) {
    const total = Math.max(0, toNumber(count, 0));

    if (typeof checked === 'number' || typeof checked === 'string' && checked !== '') {
      const index = Math.floor(toNumber(checked, -1));
      return index >= 0 && index < total ? index : -1;
    }

    return toBoolean(checked, false) ? 0 : -1;
  }

  buildFontTemplate({
    size = '1',
    count = 1,
    text = 'A',
    title = '',
    description = '',
    help = '',
    checked = false,
    disabled = false,
    name = '',
    value,
    className = ''
  } = {}) {
    const wrap = document.createElement('div');
    const total = Math.max(1, toNumber(count, 1));
    const checkedIndex = this.resolveCheckedIndex(checked, total);
    const descriptions = toArray(description);
    const values = toArray(value);
    wrap.classList.add('sf-radio-button', 'sf-radio-wrap--type-font', 'flex', `sf-radio-button--size-${size}`);

    if (className) {
      wrap.classList.add(...`${className}`.split(' ').filter(Boolean));
    }

    wrap.dataset.sfRadioDescriptions = JSON.stringify(descriptions);
    wrap.dataset.sfRadioDescription = (checkedIndex >= 0 ? descriptions[checkedIndex] : descriptions[0]) || '';
    const group = document.createElement('div');
    group.classList.add('sf-radio-group', 'sf-radio-group--font', 'flex', 'items-cross-start');

    for (let index = 0; index < total; index += 1) {
      const option = document.createElement('label');
      option.classList.add('sf-radio-button', `sf-radio-button--size-${size}`, 'sf-radio-button--type-font');
      const icon = document.createElement('i');
      icon.classList.add('sf-radio-text');

      if (index === checkedIndex) {
        icon.classList.add('active');
      }

      icon.setAttribute('aria-hidden', 'true');
      icon.textContent = text || 'A';
      const input = document.createElement('input');
      input.type = 'radio';
      input.dataset.sfRadioFontIndex = String(index);

      if (name) {
        input.name = name;
      }

      if (values[index] !== undefined) {
        input.value = String(values[index]);
      } else if (value !== undefined && !Array.isArray(value)) {
        input.value = String(value);
      } else {
        input.value = String(index);
      }

      input.checked = index === checkedIndex;
      input.disabled = toBoolean(disabled);
      hideNativeRadioInput(input);
      Object.entries(this.attrs).filter(([attr]) => !RADIO_INTERNAL_ATTRS.has(attr)).forEach(([attr, attrValue]) => {
        if (attrValue === undefined || attrValue === null) return;
        input.setAttribute(attr, attrValue);
      });
      option.append(icon, input);
      group.append(option);
    }

    const container = document.createElement('div');
    container.classList.add('sf-radio-button-container', 'flex', 'flex-col');

    if (title || help) {
      const top = document.createElement('span');
      top.classList.add('sf-radio-button-top', 'flex');

      if (title) {
        const textNode = document.createElement('span');
        textNode.classList.add('sf-radio-button-text');
        textNode.textContent = title;
        top.append(textNode);
      }

      if (help) {
        const helpIcon = document.createElement('i');
        helpIcon.classList.add('sf-icon');
        helpIcon.setAttribute('aria-hidden', 'true');
        helpIcon.textContent = help;
        top.append(helpIcon);
      }

      container.append(top);
    }

    const descriptionText = (checkedIndex >= 0 ? descriptions[checkedIndex] : descriptions[0]) || '';

    if (descriptionText) {
      const descriptionNode = document.createElement('span');
      descriptionNode.classList.add('sf-radio-button-description');
      descriptionNode.textContent = descriptionText;
      container.append(descriptionNode);
    }

    wrap.append(group, container);
    return wrap;
  }

}

(0,_register_helper__WEBPACK_IMPORTED_MODULE_1__["default"])('Radio', Radio);

if (typeof window !== 'undefined') {
  window.SF = window.SF || {};
  window.SF.Radio = window.SF.Radio || {};
  window.SF.Radio.setState = setRadioState;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initExistingRadios());
} else {
  initExistingRadios();
}

const radioObserver = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (!(node instanceof Element)) return;
      initRadioTree(node);
    });
  });
});
radioObserver.observe(document.documentElement, {
  childList: true,
  subtree: true
});


/***/ },

/***/ "65d79a2935f2"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _radio__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("c2e2433fb668");
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

/***/ "fe76739c64c5"
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
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("fe76739c64c5");
/* harmony import */ var _js_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("65d79a2935f2");
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