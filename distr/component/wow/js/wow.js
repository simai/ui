/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "87cc09cff7a3"
() {

var WOW = function (properties) {
  var config = properties || {};
  this._boxClass = config.boxClass || 'wow';
  this._animateClass = config.animateClass || 'animated', this._offset = config.offset || 0, this._mobile = config.mobile === undefined ? true : false;
  this._live = config.live === undefined ? true : false;
  this._seoFixEnabled = config.seoFixEnabled === undefined ? true : false;
  this._animationDuration = config.animationDuration || "1s";
  this._animationDelay = config.animationDelay || "0s";

  this._initStorageVariables();
};

WOW.prototype._initStorageVariables = function () {
  this._animation = [];
  this._boxes = [];
  this._cleanupBoxListener = [];
  this._cleanupBoxVisibleListener = [];
};

WOW.prototype.init = function () {
  if (!this._mobile && this._isMobile()) {
    return;
  }

  this._eachBoxInit(this._prepareBox.bind(this));

  this._startWow();
};

WOW.prototype._isMobile = function () {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

WOW.prototype._eachBoxInit = function (each) {
  var boxes = document.getElementsByClassName(this._boxClass);

  for (var i = 0; i < boxes.length; i++) {
    (function (i) {
      each(boxes[i], i);
    })(i);
  }
};

WOW.prototype._prepareBox = function (box) {
  var index = this._boxes.push(box) - 1;
  this._animation[index] = {
    animationName: box.style.animationName || window.getComputedStyle(box, null).animationName
  };
  box.style.animationName = 'none';
  box.style.visibility = 'hidden';
};

WOW.prototype._startWow = function () {
  if (this._live) {
    this._checkForChanges();
  }

  if (this._scrollY() === 0 && this._seoFixEnabled) {
    this._seoFix();
  }

  this._appearInView();

  this._scrollHandler();
};

WOW.prototype._scrollY = function () {
  if (this._isInt(window.pageYOffset)) {
    return window.pageYOffset;
  }

  if (this._isInt(document.documentElement.scrollTop)) {
    return document.documentElement.scrollTop;
  }

  if (this._isInt(document.body.scrollTop)) {
    return document.body.scrollTop;
  }
};

WOW.prototype._isInt = function (value) {
  return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
};

WOW.prototype._seoFix = function () {
  this._showNotInView();
};

WOW.prototype._appear = function (box, i) {
  if (box.className.indexOf(this._animateClass) === -1) {
    delete this._boxes[i];

    this._onStartAnimation(box, i);

    this._onStopAnimation(box, i);

    this._animate(box, i, this._getAnimationConfig(box));
  }
};

WOW.prototype._onStartAnimation = function (box, i) {
  this._cleanupBoxVisibleListener[i] = this._boxVisible.bind(this, box, i);
  box.addEventListener('animationstart', this._cleanupBoxVisibleListener[i]);
  box.addEventListener('webkitAnimationStart', this._cleanupBoxVisibleListener[i]);
};

WOW.prototype._onStopAnimation = function (box, i) {
  this._cleanupBoxListener[i] = this._cleanupBox.bind(this, box, i);
  box.addEventListener('animationend', this._cleanupBoxListener[i]);
  box.addEventListener('webkitAnimationEnd', this._cleanupBoxListener[i]);
};

WOW.prototype._getAnimationConfig = function (box) {
  return {
    delay: this._getDelay(box),
    duration: this._getDuration(box),
    iterations: this._getIterations(box)
  };
};

WOW.prototype._getDelay = function (box) {
  return box.getAttribute('data-wow-delay') || this._animationDelay;
};

WOW.prototype._getDuration = function (box) {
  return box.getAttribute('data-wow-duration') || this._animationDuration;
};

WOW.prototype._getIterations = function (box) {
  return box.getAttribute('data-wow-iteration') || box.style.animationIterationCount || window.getComputedStyle(box, null).animationIterationCount || 1;
};

WOW.prototype._animate = function (box, i, config) {
  box.style.animationDelay = config.delay;
  box.style.animationDuration = config.duration;
  box.style.animationIterationCount = config.iterations;
  box.style.animationName = this._animation[i].animationName;
  box.className += ' ' + this._animateClass;
};

WOW.prototype._boxVisible = function (box, i) {
  box.style.visibility = 'visible';
  box.removeEventListener('animationstart', this._cleanupBoxVisibleListener[i]);
  box.removeEventListener('webkitAnimationStart', this._cleanupBoxVisibleListener[i]);
  delete this._cleanupBoxVisibleListener[i];
};

WOW.prototype._cleanupBox = function (box, i) {
  box.style.animationDelay = '';
  box.style.animationDuration = '';
  box.style.animationIterationCount = '';
  box.style.animationName = 'none';

  this._cleanupClass(box);

  box.removeEventListener('animationend', this._cleanupBoxListener[i]);
  box.removeEventListener('webkitAnimationEnd', this._cleanupBoxListener[i]);
  delete this._cleanupBoxListener[i];
};

WOW.prototype._cleanupClass = function (box) {
  var classArray = box.className.split(' ');
  var animateIndex = classArray.indexOf(this._animateClass);

  if (animateIndex !== -1) {
    classArray.splice(animateIndex, 1);
    box.className = classArray.join(' ');
  }
};

WOW.prototype._eachBox = function (each) {
  for (var i = 0; i < this._boxes.length; i++) {
    var box = this._boxes[i];

    if (box) {
      (function (i) {
        each(this._boxes[i], i);
      }).bind(this)(i);
    }
  }
};

WOW.prototype._scrollHandler = function () {
  this._hideSeoFixListener = this._hideSeoFix.bind(this);
  window.addEventListener('scroll', this._hideSeoFixListener);
  window.addEventListener('scroll', this._appearInView.bind(this));
  window.addEventListener('resize', this._appearInView.bind(this));
};

WOW.prototype._hideSeoFix = function () {
  window.removeEventListener('scroll', this._hideSeoFixListener);
  delete this._hideSeoFixListener;

  this._eachBox(function (box) {
    if (!this._isInView(box)) {
      box.style.visibility = "hidden";
    }
  }.bind(this));
};

WOW.prototype._appearInView = function () {
  this._eachBox(function (box, i) {
    this._animateBox(box, i);
  }.bind(this));
};

WOW.prototype._animateBox = function (box, i) {
  if (this._isInView(box)) {
    delete this._boxes[i];

    this._appear(box, i);
  }
};

WOW.prototype._showNotInView = function () {
  this._eachBox(function (box, i) {
    this._makeVisible(box, i);
  }.bind(this));
};

WOW.prototype._makeVisible = function (box, i) {
  if (!this._isInView(box)) {
    this._boxes[i].style.visibility = 'visible';
  }
};

WOW.prototype._isInView = function (box) {
  var offset = box.getAttribute('data-wow-offset') || this._offset;

  var boxTopOffset = this._getElementOffset(box);

  var triggerOffset = boxTopOffset + ~~offset;

  var bottomPosition = window.innerHeight + this._scrollY();

  return triggerOffset <= bottomPosition && (triggerOffset === 0 ? 10 : triggerOffset) >= this._scrollY();
};

WOW.prototype._getElementOffset = function (box) {
  var clientRect = box.getBoundingClientRect();
  var body = document.body;

  var scrollTop = this._scrollY();

  var clientTop = document.documentElement.clientTop || body.clientTop || 0;
  var top = clientRect.top + scrollTop - clientTop;
  return Math.round(top);
};

WOW.prototype._checkForChanges = function () {
  var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
  var observer = new MutationObserver(this._mutations.bind(this));
  var config = {
    childList: true,
    subtree: true
  };

  window.onload = function () {
    observer.observe(document.body, config);
  };
};

WOW.prototype._mutations = function (mutations) {
  mutations.forEach(function (mutation) {
    for (var i = 0; i < mutation.addedNodes.length; i++) {
      this.doSync(mutation.addedNodes[i]);
    }
  }.bind(this));
};

WOW.prototype.doSync = function (node) {
  if (typeof node.className == "string") {
    var classes = node.className.split(' ');

    if (classes.indexOf(this._boxClass) !== -1) {
      this._prepareBox(node);
    }
  }
};

window.addEventListener("DOMContentLoaded", function () {
  new WOW().init();
});

/***/ },

/***/ "5943dee85690"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wow__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("87cc09cff7a3");
/* harmony import */ var _wow__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wow__WEBPACK_IMPORTED_MODULE_0__);


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
/* harmony import */ var _js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("5943dee85690");
//import './scss';

})();

/******/ })()
;