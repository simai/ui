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

/***/ "95a72b608b88"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _register_helper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("58661bec99a6");

;

(function (window) {
  'use strict';

  function extend(a, b) {
    for (var key in b) {
      if (Object.prototype.hasOwnProperty.call(b, key)) {
        a[key] = b[key];
      }
    }

    return a;
  }

  function sfTab(el, options) {
    this.el = el;
    this.options = extend({}, this.options);
    extend(this.options, options);

    this._init();
  }

  sfTab.prototype.options = {
    start: 0
  };

  sfTab.prototype._init = function () {
    this.tabs = [].slice.call(this.el.querySelectorAll('nav > ul > li'));
    this.items = [].slice.call(this.el.querySelectorAll('.sf-tab-content > section'));
    this.current = -1;

    this._initEvents();

    this.el.classList.add('initialized');
  };

  sfTab.prototype._initEvents = function () {
    var self = this;
    this.tabs.forEach(function (tab, idx) {
      tab.addEventListener('click', function (ev) {
        ev.preventDefault();

        for (var i = 0; i < self.tabs.length; i++) {
          self.tabs[i].classList.remove('hidden>block', 'block>hidden');
          self.items[i].classList.remove('block');
          self.items[i].classList.add('hidden');
        }

        self._show(idx);
      });
    });
  };

  sfTab.prototype._show = function (idx) {
    if (this.current >= 0) {
      this.tabs[this.current].classList.remove('hidden>block', 'block>hidden');
      this.items[this.current].classList.remove('block');
      this.items[this.current].classList.add('hidden');
    }

    if (idx != null) {
      this.current = idx;
      this.tabs[idx].classList.add('hidden>block', 'block>hidden');
      this.items[idx].classList.add('block');
      this.items[idx].classList.remove('hidden');
    }
  };

  sfTab.componentName = 'sfTab';
  window.sfTab = sfTab;
})(window);

;

(function () {
  window.addEventListener('load', function () {
    [].slice.call(document.querySelectorAll('.sf-tab:not(.initialized)')).forEach(function (el) {
      new sfTab(el);
    });
  });
  [].slice.call(document.querySelectorAll('.sf-tab:not(.initialized)')).forEach(function (el) {
    new sfTab(el);
  });
})();

const SfTabExport = window.sfTab;
(0,_register_helper__WEBPACK_IMPORTED_MODULE_0__["default"])('sfTab', SfTabExport);

/***/ },

/***/ "a662749cf487"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _tabs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("95a72b608b88");


/***/ },

/***/ "ad65ed20f8fa"
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
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ad65ed20f8fa");
/* harmony import */ var _js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("a662749cf487");


})();

/******/ })()
;