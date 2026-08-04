/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "c117564a8b72"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d7f974466839");
/* harmony import */ var _json_badge_utility_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("22cb9d3aeb2b");
/* harmony import */ var _register_helper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("58661bec99a6");
/* harmony import */ var _contract__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("a2a9d3c2841e");





class Badges extends _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__.ComponentObserver {
  static componentName = 'Badges';
  html = null;

  constructor(props) {
    super(props);
    const {
      text = '',
      icon,
      iconLeft,
      iconRight,
      iconPosition = 'start'
    } = this.params || {};
    const {
      size,
      type,
      scheme
    } = (0,_contract__WEBPACK_IMPORTED_MODULE_3__.normalizeBadgeContract)(this.params);
    const className = this.attrs.class || this.attrs.className;
    this.badge = document.createElement('div');

    if (this.id) {
      this.badge.id = this.id;
    }

    this.badge.classList.add('sf-badge', `sf-badge--size-${size}`, `sf-badge--${type}`, `sf-badge--${scheme}`);

    if (className) {
      this.badge.classList.add(...`${className}`.split(' ').filter(Boolean));
    }

    Object.entries(this.attrs).filter(([attr]) => !['class', 'className'].includes(attr)).forEach(([attr, value]) => {
      if (value === undefined || value === null) {
        return;
      }

      this.badge.setAttribute(attr, value);
    });
    const startIcon = iconLeft ?? (icon && iconPosition !== 'end' ? icon : null);
    const endIcon = iconRight ?? (icon && iconPosition === 'end' ? icon : null);
    this.iconContainerLeft = this.createIcon(startIcon);
    this.iconContainerRight = this.createIcon(endIcon);
    this.textContainer = null;
    this.textElement = null;

    if (text !== undefined && text !== null && String(text).length > 0) {
      this.textContainer = document.createElement('span');
      this.textContainer.classList.add('sf-badge-text-container');
      this.textElement = document.createElement('span');
      this.textElement.classList.add('sf-badge-text');
      this.textElement.textContent = text;
      this.textContainer.append(this.textElement);
    }

    this.applyLayoutUtilities(this.badge, '.sf-badge');
    this.applyLayoutUtilities(this.iconContainerLeft, '.sf-badge .sf-badge-icon-container');
    this.applyLayoutUtilities(this.iconContainerRight, '.sf-badge .sf-badge-icon-container');
    this.applyLayoutUtilities(this.textContainer, '.sf-badge .sf-badge-text-container');
    this.applyLayoutUtilities(this.textElement, '.sf-badge .sf-badge-text');
    this.applyUtilities(this.badge, this.params?.utilities?.badge ?? this.params?.utilities);
    this.applyUtilities(this.iconContainerLeft, this.params?.utilities?.iconContainer ?? this.params?.utilities?.icon);
    this.applyUtilities(this.iconContainerRight, this.params?.utilities?.iconContainer ?? this.params?.utilities?.icon);
    this.applyUtilities(this.textContainer, this.params?.utilities?.textContainer);
    this.applyUtilities(this.textElement, this.params?.utilities?.text);

    if (this.iconContainerLeft) {
      this.badge.append(this.iconContainerLeft);
    }

    if (this.textContainer) {
      this.badge.append(this.textContainer);
    }

    if (this.iconContainerRight) {
      this.badge.append(this.iconContainerRight);
    }

    this.template = this.badge;
  }

  createIcon(iconName) {
    if (!iconName) {
      return null;
    }

    const container = document.createElement('span');
    container.classList.add('sf-badge-icon-container');
    const icon = document.createElement('i');
    icon.classList.add('sf-icon');
    icon.textContent = iconName;
    container.append(icon);
    return container;
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
      if (Array.isArray(value?.badge)) return value.badge;
      if (typeof value?.badge === 'string') return value.badge.split(' ');
      return [];
    };

    normalize(utilities).filter(Boolean).forEach(cls => target.classList.add(cls));
  }

  init() {}

}

Badges.utilityMap = _json_badge_utility_json__WEBPACK_IMPORTED_MODULE_1__;
(0,_register_helper__WEBPACK_IMPORTED_MODULE_2__["default"])('Badges', Badges);

/***/ },

/***/ "a2a9d3c2841e"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BADGE_SCHEMES: () => (/* binding */ BADGE_SCHEMES),
/* harmony export */   BADGE_SIZES: () => (/* binding */ BADGE_SIZES),
/* harmony export */   BADGE_TYPES: () => (/* binding */ BADGE_TYPES),
/* harmony export */   BADGE_VARIANTS: () => (/* binding */ BADGE_VARIANTS),
/* harmony export */   normalizeBadgeContract: () => (/* binding */ normalizeBadgeContract)
/* harmony export */ });
const BADGE_TYPES = Object.freeze(['main', 'tonal', 'outline']);
const BADGE_SCHEMES = Object.freeze(['neutral', 'primary', 'secondary', 'tertiary', 'info', 'success', 'warning', 'danger', 'on-surface']);
const BADGE_SIZES = Object.freeze(['1/3', '1/2', '1']);
const DEFAULT_BADGE_TYPE = 'main';
const DEFAULT_BADGE_SCHEME = 'neutral';
const DEFAULT_BADGE_SIZE = '1/3';

const normalizeEnum = (value, allowed, fallback) => {
  const normalized = String(value ?? fallback).trim().toLowerCase();
  return allowed.includes(normalized) ? normalized : fallback;
};

const BADGE_VARIANTS = Object.freeze(BADGE_SCHEMES.flatMap(scheme => BADGE_TYPES.filter(type => !(scheme === 'on-surface' && type === 'tonal')).flatMap(type => BADGE_SIZES.map(size => Object.freeze({
  type,
  scheme,
  size
})))));
function normalizeBadgeContract({
  type,
  scheme,
  size
} = {}) {
  let normalizedType = normalizeEnum(type, BADGE_TYPES, DEFAULT_BADGE_TYPE);
  const normalizedScheme = normalizeEnum(scheme, BADGE_SCHEMES, DEFAULT_BADGE_SCHEME);
  const normalizedSize = normalizeEnum(size, BADGE_SIZES, DEFAULT_BADGE_SIZE);

  if (normalizedType === 'tonal' && normalizedScheme === 'on-surface') {
    normalizedType = 'main';
  }

  return {
    type: normalizedType,
    scheme: normalizedScheme,
    size: normalizedSize
  };
}

/***/ },

/***/ "986d3a6db62b"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _badges__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("c117564a8b72");
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

/***/ "0c7667d4c371"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "22cb9d3aeb2b"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{".sf-badge":["display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","gap/var(--sf-a0)","justify-content/center (.justify-center)","align-items/center (.items-center)"],".sf-badge .sf-badge-icon-container":["display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","justify-content/center (.justify-center)","align-items/center (.items-center)"],".sf-badge .sf-badge-icon-container .sf-icon":["display/flex (.flex)","justify-content/center (.justify-center)","align-items/center (.items-center)"],".sf-badge .sf-badge-text-container":["display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","justify-content/center (.justify-center)","align-items/center (.items-center)"]}');

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
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("0c7667d4c371");
/* harmony import */ var _js_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("986d3a6db62b");
/**
* SIMAI Framework
* Copyright 2008-2026 SIMAI Ltd
* http://simai.studio
* Read the license: http://framework.simai.studio/license/
* Documentation: http://framework.simai.studio/
* Support: http://simai.studio/support/
*
* BADGES
*
* Entry point for importing components from this directory.
* Simplifies the import process in other parts of the project.
* Instead of importing individual files, all component can be imported through this file.
*/


})();

/******/ })()
;