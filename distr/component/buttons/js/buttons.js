/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "176a9b5b7b35"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d7f974466839");
/* harmony import */ var _json_button_utility_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("c71a77b9cdfb");
/* harmony import */ var _register_helper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("58661bec99a6");




class Buttons extends _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__.ComponentObserver {
  static componentName = 'Buttons';
  html = null;

  constructor(props) {
    super(props);
    const {
      size = '1',
      type = 'default',
      scheme = 'primary',
      text = '',
      icon,
      iconLeft,
      iconRight,
      iconPosition = 'start',
      tightness,
      radius,
      loading = false,
      disabled = false,
      utilities = {}
    } = this.params || {};
    const className = this.attrs.class || this.attrs.className;
    this.button = document.createElement('button');

    if (this.id) {
      this.button.id = this.id;
    }

    this.button.classList.add('sf-button', `sf-button--size-${size}`, `sf-button--${type}`, `sf-button--${scheme}`);

    if (tightness) {
      this.button.classList.add(`tightness-${tightness}`);
    }

    if (radius) {
      this.button.classList.add(`radius-${radius}`);
    }

    if (loading) {
      this.button.classList.add('loading', 'sf-button-state-loading');
      this.button.setAttribute('aria-busy', 'true');
    }

    if (disabled) {
      this.button.disabled = true;
    }

    if (className) {
      this.button.classList.add(...`${className}`.split(' ').filter(Boolean));
    }

    Object.entries(this.attrs).filter(([attr]) => !['class', 'className'].includes(attr)).forEach(([attr, value]) => {
      if (value === undefined || value === null) {
        return;
      }

      this.button.setAttribute(attr, value);
    }); // Avoid implicit "submit" behavior inside forms unless explicitly overridden.

    if (!this.button.hasAttribute('type')) {
      this.button.setAttribute('type', 'button');
    }

    const normalizedIconPosition = `${iconPosition}`.toLowerCase();
    const isIconEnd = ['right', 'end'].includes(normalizedIconPosition);
    const leftIconName = iconLeft ?? (icon && !isIconEnd ? icon : null);
    const rightIconName = iconRight ?? (icon && isIconEnd ? icon : null);
    this.iconLeft = this.createIcon(leftIconName);
    this.iconRight = this.createIcon(rightIconName);
    this.textContainer = document.createElement('span');
    this.textContainer.classList.add('sf-button-text-container');
    this.textElement = document.createElement('span');
    this.textElement.classList.add('sf-button-text');
    this.textContainer.textContent = text;
    this.applyLayoutUtilities(this.button, '.sf-button');
    this.applyLayoutUtilities(this.iconLeft, '.sf-button .sf-icon');
    this.applyLayoutUtilities(this.iconRight, '.sf-button .sf-icon');
    this.applyLayoutUtilities(this.textContainer, '.sf-button .sf-button-text-container');
    this.applyUtilities(this.button, utilities.button ?? utilities);
    this.applyUtilities(this.iconLeft, utilities.icon);
    this.applyUtilities(this.iconRight, utilities.icon);
    this.applyUtilities(this.textContainer, utilities.textContainer);

    if (this.iconLeft) {
      this.button.append(this.iconLeft);
    }

    this.button.append(this.textContainer);

    if (this.iconRight) {
      this.button.append(this.iconRight);
    }

    this.template = this.button;
  }

  createIcon(name) {
    if (!name) {
      return null;
    }

    const icon = document.createElement('i');
    icon.classList.add('sf-icon');
    icon.textContent = name;
    return icon;
  }

  applyUtilities(target, utilities) {
    if (!target || !utilities) {
      return;
    }

    const normalize = value => {
      if (Array.isArray(value)) return value;
      if (typeof value === 'string') return value.split(' ');
      if (Array.isArray(value?.classes)) return value.classes;
      if (typeof value?.classes === 'string') return value.classes.split(' ');
      if (Array.isArray(value?.button)) return value.button;
      if (typeof value?.button === 'string') return value.button.split(' ');
      return [];
    };

    normalize(utilities).filter(Boolean).forEach(cls => target.classList.add(cls));
  }

}

Buttons.utilityMap = _json_button_utility_json__WEBPACK_IMPORTED_MODULE_1__;
(0,_register_helper__WEBPACK_IMPORTED_MODULE_2__["default"])('Buttons', Buttons);

/***/ },

/***/ "757f80eca5ff"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _buttons__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("176a9b5b7b35");
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

/***/ "bef9a721ac58"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "c71a77b9cdfb"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{".sf-button":["display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","justify-content/center (.justify-center)","align-items/center (.items-center)"],".sf-button .sf-icon":["display/flex (.flex)","justify-content/center (.justify-center)","align-items/center (.items-center)"],".sf-button .sf-button-text-container":["display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","justify-content/center (.justify-center)","align-items/center (.items-center)"]}');

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
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("bef9a721ac58");
/* harmony import */ var _js_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("757f80eca5ff");
/**
* SIMAI Framework
* Copyright 2008-2026 SIMAI Ltd
* http://simai.studio
* Read the license: http://framework.simai.studio/license/
* Documentation: http://framework.simai.studio/
* Support: http://simai.studio/support/
*
* BUTTONS
*
* Entry point for importing components from this directory.
* Simplifies the import process in other parts of the project.
* Instead of importing individual files, all component can be imported through this file.
*/


})();

/******/ })()
;