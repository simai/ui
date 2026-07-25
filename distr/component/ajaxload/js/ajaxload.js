/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "1db96685a8ef"
(__unused_webpack_module, exports) {

var sft = window.SF;

window.SF = window.SF || function () {};

if (sft) {
  Object.keys(sft).forEach(key => {
    window.SF[key] = sft[key];
  });
}

exports = window.SF;

SF.AjaxLoad = function (el, opt) {
  /**
   * @function send() - Отправляет событие
   * @param {*} event
   */
  this.send = function (event, element, params = false) {
    let e = new Event(event, {
      bubbles: true
    });

    if (params) {
      e.params = params;
    }

    element.dispatchEvent(e);
  };
  /**
   * @function receive() - регистрирует обработчик события
   * @param {*} event
   * @param {*} handler
   */


  this.receive = function (event, el, handler) {
    if (window.addEventListener) el.addEventListener(event, handler, false);else if (window.attachEvent) el.attachEvent(event, handler);
  };

  this.getAjax = function (el) {
    BX.ajax.post(this.param.src, '', function (data) {
      el.innerHTML = data;
      el.load.style.display = 'none';
    });
  };
  /**
   * extend() -
   * @param {*} defaults
   * @param {*} options
   */


  this.extend = function (defaults, options) {
    for (var key in options) {
      if (Object.prototype.hasOwnProperty.call(options, key)) {
        if (Object.prototype.toString.call(options[key]) == '[object Object]') {
          this.extend(defaults[key], options[key]);
        } else {
          defaults[key] = options[key];
        }
      }
    }

    return defaults;
  };
  /**
   * @function checklayer() -
   * @param {*} el
   */


  this.checklayer = function (el) {
    let comp = getComputedStyle(el);

    if (el.getAttribute(this.param.data.loaded) !== 'loaded' && comp.display !== 'none') {
      el.setAttribute(this.param.data.loaded, 'loaded');
      el.innerHTML = this.param.load;
      setTimeout(this.getAjax.bind(this, el), 1000);
    } else {
      el.setAttribute(this.param.data.loaded, '');
    }

    if (el.hasAttribute(this.param.data.cancel) && el.getAttribute(this.param.data.loaded) == 'loaded') {
      this.send(this.param.events.cancel, el);
    }
  };

  this.clearInterval = function (callback) {
    clearInterval(callback);
  };

  this.init = function (el) {
    return setInterval(this.checklayer.bind(this, el), 1000);
  };
  /**
   * @var param - параметры
   */


  this.param = {
    load: '<div class="sf-progress"><div class="sf-progress-animation"></div></div>',
    events: {
      init: 'ajaxloadinit',
      cancel: 'ajaxloadcanceltrack',
      create: 'ajaxloadcreate'
    },
    data: {
      init: 'sf-ajaxload',
      src: 'sf-src',
      cancel: 'sf-canceltrack',
      loaded: 'sf-ajaxloaded'
    },
    attributes: {},
    modifier: {
      src: ''
    }
  }; // === Init

  this.param = this.extend(this.param, opt);
  this.clearTimeout = setInterval(this.checklayer.bind(this, el), 1000);
  this.receive(this.param.events.cancel, el, this.clearInterval.bind(this, this.clearTimeout));
};

/***/ },

/***/ "1c4d5957a876"
() {

window.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('[sf-ajaxload]').forEach(item => {
    let param = {
      src: item.getAttribute('sf-src')
    };
    new SF.AjaxLoad(item, param);
  });
});

/***/ },

/***/ "716b54d8eb11"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _ajaxload_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("1db96685a8ef");
/* harmony import */ var _ajaxload_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_ajaxload_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _init_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("1c4d5957a876");
/* harmony import */ var _init_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_init_js__WEBPACK_IMPORTED_MODULE_1__);



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
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			const getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/
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
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("716b54d8eb11");

})();

/******/ })()
;