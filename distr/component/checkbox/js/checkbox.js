/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "9b5005c560e4"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bindCheckbox: () => (/* binding */ bindCheckbox),
/* harmony export */   resolveCheckboxIcon: () => (/* binding */ resolveCheckboxIcon),
/* harmony export */   setCheckboxState: () => (/* binding */ setCheckboxState),
/* harmony export */   syncCheckboxState: () => (/* binding */ syncCheckboxState),
/* harmony export */   unbindCheckbox: () => (/* binding */ unbindCheckbox)
/* harmony export */ });
/* harmony import */ var _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d7f974466839");
/* harmony import */ var _register_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("58661bec99a6");


const CHECKBOX_SELECTOR = 'label.sf-checkbox';
const CHECKBOX_BOUND_FLAG = 'sfCheckboxBound';

function toBoolean(value, defaultValue = false) {
  if (value === undefined || value === null || value === '') return defaultValue;
  if (typeof value === 'boolean') return value;
  const normalized = String(value).toLowerCase();
  return ['1', 'true', 'yes', 'on', 'checked', 'disabled', 'indeterminate'].includes(normalized);
}

function resolveCheckboxIcon(state) {
  if (!state) return '';
  if (state.indeterminate) return 'remove';
  if (state.checked) return 'check';
  return '';
}

function setCheckboxIcon(iconElement, icon = '') {
  if (!iconElement) return;

  if (iconElement.tagName?.toLowerCase() === 'sf-icon') {
    if (typeof iconElement.setState === 'function') {
      iconElement.setState({
        icon
      });
    } else if (icon) {
      iconElement.setAttribute('icon', icon);
    } else {
      iconElement.removeAttribute('icon');
    }

    return;
  }

  iconElement.textContent = icon;
}

function getCheckboxNodes(root) {
  if (!root) return {};
  const input = root.querySelector('input[type="checkbox"]');
  const boxIcon = root.querySelector('.sf-checkbox-box sf-icon, .sf-checkbox-box .sf-icon');
  return {
    input,
    boxIcon
  };
}

function syncCheckboxState(root) {
  const {
    input,
    boxIcon
  } = getCheckboxNodes(root);
  if (!input || !boxIcon) return;
  setCheckboxIcon(boxIcon, resolveCheckboxIcon(input));
}

function bindCheckbox(root) {
  if (!root || root.dataset[CHECKBOX_BOUND_FLAG] === '1') return;
  const {
    input
  } = getCheckboxNodes(root);
  if (!input) return;

  const handleChange = () => syncCheckboxState(root);

  root.__sfCheckboxHandleChange = handleChange;
  input.addEventListener('change', handleChange);
  root.dataset[CHECKBOX_BOUND_FLAG] = '1';
  syncCheckboxState(root);
}

function unbindCheckbox(root) {
  if (!root) return;
  const {
    input
  } = getCheckboxNodes(root);

  if (input && root.__sfCheckboxHandleChange) {
    input.removeEventListener('change', root.__sfCheckboxHandleChange);
  }

  delete root.__sfCheckboxHandleChange;
  delete root.dataset[CHECKBOX_BOUND_FLAG];
}

function shouldAutoBindCheckbox(root) {
  return root instanceof Element && !root.closest('sf-checkbox');
}

function initCheckboxTree(target) {
  if (!(target instanceof Element) && target !== document) return;

  if (target instanceof Element && target.matches?.(CHECKBOX_SELECTOR) && shouldAutoBindCheckbox(target)) {
    bindCheckbox(target);
  }

  target.querySelectorAll?.(CHECKBOX_SELECTOR).forEach(root => {
    if (shouldAutoBindCheckbox(root)) {
      bindCheckbox(root);
    }
  });
}

function setCheckboxState(input, state = {}) {
  if (!(input instanceof HTMLInputElement) || input.type !== 'checkbox') {
    return false;
  }

  if (Object.prototype.hasOwnProperty.call(state, 'checked')) {
    input.checked = toBoolean(state.checked);
  }

  if (Object.prototype.hasOwnProperty.call(state, 'indeterminate')) {
    input.indeterminate = toBoolean(state.indeterminate);
  }

  if (Object.prototype.hasOwnProperty.call(state, 'disabled')) {
    input.disabled = toBoolean(state.disabled);
  }

  const root = input.closest(CHECKBOX_SELECTOR);

  if (root) {
    syncCheckboxState(root);
  }

  return true;
}

function initExistingCheckboxes(target = document) {
  initCheckboxTree(target);
}

class Checkbox extends _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__.ComponentObserver {
  static componentName = 'Checkbox';
  html = null;

  constructor(props) {
    super(props);
    const {
      size = '1',
      title = '',
      description = '',
      help = '',
      checked = false,
      disabled = false,
      indeterminate = false,
      name,
      value
    } = this.params || {};
    const className = this.attrs.class || this.attrs.className;
    this.template = document.createElement('label');

    if (this.id) {
      this.template.id = this.id;
    }

    this.template.classList.add('sf-checkbox', `sf-checkbox--size-${size}`);

    if (className) {
      this.template.classList.add(...`${className}`.split(' ').filter(Boolean));
    }

    this.box = document.createElement('span');
    this.box.classList.add('sf-checkbox-box');
    this.input = document.createElement('input');
    this.input.type = 'checkbox';

    if (name) {
      this.input.name = name;
    }

    if (value !== undefined) {
      this.input.value = value;
    }

    this.input.checked = toBoolean(checked);
    this.input.disabled = toBoolean(disabled);
    this.input.indeterminate = toBoolean(indeterminate);
    Object.entries(this.attrs).filter(([attr]) => !['class', 'className'].includes(attr)).forEach(([attr, attrValue]) => {
      if (attrValue === undefined || attrValue === null) return;
      this.input.setAttribute(attr, attrValue);
    });
    this.boxIcon = document.createElement('span');
    this.boxIcon.classList.add('sf-icon');
    this.boxIcon.setAttribute('aria-hidden', 'true');
    this.box.append(this.input, this.boxIcon);
    this.template.append(this.box);

    if (title || description || help) {
      this.container = document.createElement('span');
      this.container.classList.add('sf-checkbox-container');

      if (title || help) {
        this.top = document.createElement('span');
        this.top.classList.add('sf-checkbox-top');

        if (title) {
          this.label = document.createElement('span');
          this.label.classList.add('sf-checkbox-label');
          this.label.textContent = title;
          this.top.append(this.label);
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

      if (description) {
        this.description = document.createElement('span');
        this.description.classList.add('sf-checkbox-description');
        this.description.textContent = description;
        this.container.append(this.description);
      }

      this.template.append(this.container);
    }
  }

  init() {
    bindCheckbox(this.template);
  }

  destroyInternal() {
    if (!this.template) return;
    unbindCheckbox(this.template);
  }

}

(0,_register_helper__WEBPACK_IMPORTED_MODULE_1__["default"])('Checkbox', Checkbox);

if (typeof window !== 'undefined') {
  window.SF = window.SF || {};
  window.SF.Checkbox = window.SF.Checkbox || {};
  window.SF.Checkbox.setState = setCheckboxState;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initExistingCheckboxes());
} else {
  initExistingCheckboxes();
}

const checkboxObserver = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (!(node instanceof Element)) return;
      initCheckboxTree(node);
    });
  });
});
checkboxObserver.observe(document.documentElement, {
  childList: true,
  subtree: true
});


/***/ },

/***/ "d314a44002f3"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _checkbox__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("9b5005c560e4");
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

/***/ "f84c26cb4666"
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
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("f84c26cb4666");
/* harmony import */ var _js_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("d314a44002f3");
/**
* SIMAI Framework
* Copyright 2008-2026 SIMAI Ltd
* http://simai.studio
* Read the license: http://framework.simai.studio/license/
* Documentation: http://framework.simai.studio/
* Support: http://simai.studio/support/
*
* CHECKBOX
*
* Entry point for importing components from this directory.
* Simplifies the import process in other parts of the project.
* Instead of importing individual files, all component can be imported through this file.
*/


})();

/******/ })()
;