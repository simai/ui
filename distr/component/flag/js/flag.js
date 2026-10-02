/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "9950d347f7d3"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   mount: () => (/* binding */ mount),
/* harmony export */   mountAll: () => (/* binding */ mountAll),
/* harmony export */   render: () => (/* binding */ render)
/* harmony export */ });
/*
 * FLAG
 *
 * <span class="sf-flag sf-flag--rect" data-country="ru"></span>
 *
 * The component fills that box with the right file. Two things it does that the
 * country code field had to invent for itself:
 *
 *   - it knows where the set is. The runtime already knows its own root, so the
 *     default base resolves against it instead of being empty and leaving the
 *     author to supply one.
 *   - it knows which shapes exist. Both shapes now carry the same 247 codes,
 *     but the catalogue stays: a code outside the set, or a set an author
 *     supplies through data-flag-base, is served in the other shape rather
 *     than as a hole.
 */
const SHAPES = ['rect', 'circle'];
const BASE_ATTRIBUTE = 'data-flag-base';
let catalogue = null;
let catalogueRequest = null;
let observer = null;

function normalise(code) {
  return String(code || '').trim().toLowerCase().replace(/[^a-z]/g, '');
}

function runtimeRoot() {
  const path = typeof window !== 'undefined' ? window.sfPath : '';
  if (!path) return '';

  try {
    return new URL('component/flag/flags', path).href.replace(/\/$/, '');
  } catch {
    return String(path).replace(/\/$/, '') + '/component/flag/flags';
  }
}

function baseFor(element) {
  const owner = element.closest(`[${BASE_ATTRIBUTE}]`);
  const declared = owner ? owner.getAttribute(BASE_ATTRIBUTE) : '';
  return (declared || runtimeRoot()).replace(/\/$/, '');
}

function shapeOf(element) {
  for (const shape of SHAPES) {
    if (element.classList.contains(`sf-flag--${shape}`)) return shape;
  }

  return 'rect';
}
/* The catalogue says which codes each shape actually has. It is fetched once and
   shared; until it arrives the asked-for shape is used as given, because that is
   right for the four codes in five that exist in both. */


function loadCatalogue(base) {
  if (catalogue) return Promise.resolve(catalogue);

  if (!catalogueRequest) {
    catalogueRequest = fetch(`${base}/index.json`).then(response => response.ok ? response.json() : null).then(data => {
      catalogue = data && data.rect && data.circle ? {
        rect: new Set(data.rect),
        circle: new Set(data.circle)
      } : {
        rect: null,
        circle: null
      };
      return catalogue;
    }).catch(() => {
      catalogue = {
        rect: null,
        circle: null
      };
      return catalogue;
    });
  }

  return catalogueRequest;
}

function resolveShape(shape, code, known) {
  const have = known && known[shape];
  if (!have || have.has(code)) return shape;
  const other = shape === 'rect' ? 'circle' : 'rect';
  const fallback = known[other];
  return fallback && fallback.has(code) ? other : shape;
}

function paint(element, shape, code, base, triedOther = false) {
  const image = document.createElement('img');
  image.src = `${base}/${shape}/${code}.svg`;
  image.alt = element.getAttribute('data-alt') || '';
  if (!image.alt) image.setAttribute('aria-hidden', 'true');
  image.decoding = 'async'; // A file that does not load is the ground truth about which shapes exist,
  // and it is the only one available everywhere. The catalogue is fetched, and
  // a fetch does not survive every context: inside a sandboxed frame without
  // allow-same-origin -- which is how the documentation renders its examples --
  // the origin is opaque, the request counts as cross-origin and is refused,
  // while images keep loading because they are not subject to that. Falling
  // back on the error covers the case the catalogue cannot reach.

  image.addEventListener('error', () => {
    if (triedOther) return;
    const other = shape === 'rect' ? 'circle' : 'rect';
    paint(element, other, code, base, true);
  }, {
    once: true
  });
  element.replaceChildren(image); // The shape may have changed under the element; the class has to follow, or
  // a circle would sit in a box sized for a rectangle.

  for (const name of SHAPES) element.classList.toggle(`sf-flag--${name}`, name === shape);
}

function render(element) {
  const code = normalise(element.getAttribute('data-country'));

  if (!code) {
    element.replaceChildren();
    return;
  }

  const base = baseFor(element);
  const asked = shapeOf(element);
  loadCatalogue(base).then(known => {
    if (normalise(element.getAttribute('data-country')) !== code) return;
    paint(element, resolveShape(asked, code, known), code, base);
  });
}

function watcher() {
  if (observer || typeof IntersectionObserver === 'undefined') return observer;
  observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);
      render(entry.target);
    }
  }, {
    rootMargin: '200px'
  });
  return observer;
}

function mount(element) {
  if (element.dataset.sfFlagReady === 'true') return;
  element.dataset.sfFlagReady = 'true'; // A list of two hundred countries should not fetch two hundred files to show
  // eight of them; one close to the viewport is fetched at once.

  const lazy = element.getAttribute('data-lazy') !== 'false';
  const watch = lazy ? watcher() : null;
  if (watch) watch.observe(element);else render(element);
}

function mountAll(root) {
  const scope = root && root.querySelectorAll ? root : document;

  for (const element of scope.querySelectorAll('.sf-flag')) mount(element);
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => mountAll(document));
  } else {
    mountAll(document);
  } // Markup that arrives later -- a list the host renders, a dialog that opens.


  if (typeof MutationObserver !== 'undefined') {
    new MutationObserver(records => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (node.nodeType !== 1) continue;
          if (node.classList && node.classList.contains('sf-flag')) mount(node);else mountAll(node);
        }
      }
    }).observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }

  window.SF = window.SF || {};
  window.SF.flag = {
    mount,
    mountAll,
    render
  };
}



/***/ },

/***/ "5b58850a9018"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _flag__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("9950d347f7d3");
/*
* Main JS file for including JS for component.
*/


/***/ },

/***/ "eb42667687bd"
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
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("eb42667687bd");
/* harmony import */ var _js_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b58850a9018");
/**
* SIMAI Framework
* Copyright 2008-2026 SIMAI Ltd
*
* FLAG
*
* Entry point for importing components from this directory.
*/


})();

/******/ })()
;