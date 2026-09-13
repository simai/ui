/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "2b61c7885d13"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   dismissAlertElement: () => (/* binding */ dismissAlertElement)
/* harmony export */ });
function dismissAlertElement(alert, removalTarget = alert) {
  if (!alert?.isConnected || !removalTarget?.isConnected) {
    return Promise.resolve(removalTarget);
  }

  const remove = () => {
    if (removalTarget.isConnected) {
      removalTarget.remove();
    }

    return removalTarget;
  };

  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  if (reducedMotion || typeof alert.getAnimations !== 'function') {
    return Promise.resolve(remove());
  } // Commit the resting style before switching to the token-driven exit state.


  window.getComputedStyle(alert).opacity;
  alert.classList.add('closing');
  return new Promise(resolve => {
    window.requestAnimationFrame(() => {
      const animations = alert.getAnimations().filter(animation => {
        const timing = animation.effect?.getComputedTiming?.();
        return timing && timing.iterations !== Infinity;
      });

      if (animations.length === 0) {
        resolve(remove());
        return;
      }

      Promise.allSettled(animations.map(animation => animation.finished)).then(() => resolve(remove()));
    });
  });
}

/***/ },

/***/ "ecb933b3dc1e"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _dismiss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2b61c7885d13");

const BINDING_KEY = '__sfAlertDocumentClickHandler';

function isDisabled(trigger) {
  return trigger.matches(':disabled, [aria-disabled="true"]');
}

function belongsToSmartAlert(alert) {
  return alert.parentElement?.matches('sf-alert') === true;
}

function dispatchAction(alert, trigger) {
  alert.dispatchEvent(new CustomEvent('sf-alert-action', {
    bubbles: true,
    detail: {
      action: trigger.getAttribute('data-action') || trigger.getAttribute('data-alert-action') || '',
      alert,
      trigger
    }
  }));
}

function dispatchClose(alert, trigger) {
  alert.dispatchEvent(new CustomEvent('sf-alert-close', {
    bubbles: true,
    detail: {
      alert,
      trigger
    }
  }));
}

function handleDocumentClick(event) {
  const trigger = event.target?.closest?.('[data-close], [data-alert-close], [data-action], [data-alert-action], .sf-alert--close');
  const alert = trigger?.closest?.('.sf-alert');

  if (!trigger || !alert || isDisabled(trigger) || belongsToSmartAlert(alert)) {
    return;
  }

  if (trigger.matches('[data-close], [data-alert-close], .sf-alert--close')) {
    event.preventDefault();
    dispatchClose(alert, trigger);
    (0,_dismiss__WEBPACK_IMPORTED_MODULE_0__.dismissAlertElement)(alert);
    return;
  }

  dispatchAction(alert, trigger);
}

if (typeof document !== 'undefined' && typeof window !== 'undefined' && !window[BINDING_KEY]) {
  window[BINDING_KEY] = handleDocumentClick;
  document.addEventListener('click', handleDocumentClick);
}

/***/ },

/***/ "baa258d704e7"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _alerts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ecb933b3dc1e");
/*
* Main JS file for including JS for component.
*
* Imports:
* - Base function component (_component_name.js)
*/


/***/ },

/***/ "24c178ecb046"
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
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("24c178ecb046");
/* harmony import */ var _js_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("baa258d704e7");
/**
* SIMAI Framework
* Copyright 2008-2026 SIMAI Ltd
* http://simai.studio
* Read the license: http://framework.simai.studio/license/
* Documentation: http://framework.simai.studio/
* Support: http://simai.studio/support/
*
* ALERTS
*
* Entry point for importing components from this directory.
* Simplifies the import process in other parts of the project.
* Instead of importing individual files, all component can be imported through this file.
*/


})();

/******/ })()
;