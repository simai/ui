/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "5b7a5658d78a"
() {

const ROOT_SELECTOR = '.sf-breadcrumbs';
const ITEM_SELECTOR = '.sf-breadcrumbs-item';
const GENERATED_SELECTOR = '[data-sf-breadcrumbs-generated="ellipsis"]';
const BOUND_KEY = '__sfBreadcrumbsBound';

function getMaxItems(root) {
  const value = root.getAttribute('data-max-items') || root.getAttribute('max-items') || root.dataset.maxItems;
  const maxItems = Number(value);
  return Number.isFinite(maxItems) ? maxItems : 4;
}

function getItemLabel(item) {
  return String(item.textContent || '').trim();
}

function isSeparator(item) {
  if (!(item instanceof HTMLElement)) {
    return false;
  }

  if (item.dataset.sfBreadcrumbSeparator === 'true') {
    return true;
  }

  if (!item.classList.contains('sf-breadcrumbs-item--default')) {
    return false;
  }

  const label = getItemLabel(item);
  return label === 'chevron_right' || label === 'chevron_rightchevron_right';
}

function isGenerated(item) {
  return item?.matches?.(GENERATED_SELECTOR);
}

function getBreadcrumbNodes(root) {
  return Array.from(root.children).filter(child => child instanceof HTMLElement && child.matches(ITEM_SELECTOR) && !isGenerated(child));
}

function getContentItems(root) {
  return getBreadcrumbNodes(root).filter(item => !isSeparator(item));
}

function getPreviousSeparator(item) {
  let current = item.previousElementSibling;

  while (current && isGenerated(current)) {
    current = current.previousElementSibling;
  }

  return isSeparator(current) ? current : null;
}

function clearGenerated(root) {
  root.querySelectorAll(GENERATED_SELECTOR).forEach(node => node.remove());
}

function setCollapsedState(root, collapsedItems = []) {
  const collapsedSet = new Set(collapsedItems);
  getBreadcrumbNodes(root).forEach(node => {
    const shouldHide = collapsedSet.has(node) || collapsedItems.some(item => getPreviousSeparator(item) === node);
    node.hidden = shouldHide;
  });
}

function createSeparator() {
  const separator = document.createElement('div');
  separator.className = 'sf-breadcrumbs-item sf-breadcrumbs-item--default';
  separator.dataset.sfBreadcrumbsGenerated = 'ellipsis';
  separator.dataset.sfBreadcrumbSeparator = 'true';
  separator.setAttribute('aria-hidden', 'true');
  separator.innerHTML = '<span class="sf-breadcrumbs-item-container flex items-cross-center"><i class="sf-icon">chevron_right</i></span>';
  return separator;
}

function createEllipsis(root, hiddenItems) {
  const ellipsis = document.createElement('button');
  ellipsis.type = 'button';
  ellipsis.className = 'sf-breadcrumbs-item sf-breadcrumbs-item--link sf-breadcrumbs-item--default';
  ellipsis.dataset.sfBreadcrumbsGenerated = 'ellipsis';
  ellipsis.dataset.sfBreadcrumbIndex = 'ellipsis';
  ellipsis.setAttribute('aria-label', 'Show hidden breadcrumbs');
  ellipsis.innerHTML = '<span class="sf-breadcrumbs-item-container flex items-cross-center"><span>...</span></span>';
  ellipsis.addEventListener('click', event => {
    const clickEvent = new CustomEvent('sf-breadcrumb-click', {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: {
        root,
        item: {
          label: '...',
          ellipsis: true,
          hiddenItems
        },
        index: 'ellipsis',
        items: getContentItems(root),
        originalEvent: event
      }
    });
    root.dispatchEvent(clickEvent);

    if (clickEvent.defaultPrevented) {
      return;
    }

    expandBreadcrumbs(root);
  });
  return ellipsis;
}

function expandBreadcrumbs(root) {
  root.dataset.sfBreadcrumbsExpanded = 'true';
  clearGenerated(root);
  setCollapsedState(root, []);
}

function collapseBreadcrumbs(root) {
  const maxItems = getMaxItems(root);
  const items = getContentItems(root);
  clearGenerated(root);
  setCollapsedState(root, []);

  if (root.dataset.sfBreadcrumbsExpanded === 'true') {
    return;
  }

  if (maxItems < 3 || items.length <= maxItems) {
    return;
  }

  const visibleSlots = maxItems - 1;
  const leadingCount = Math.floor(visibleSlots / 2);
  const trailingCount = visibleSlots - leadingCount;
  const hiddenItems = items.slice(leadingCount, items.length - trailingCount);

  if (!hiddenItems.length) {
    return;
  }

  setCollapsedState(root, hiddenItems);
  const firstHidden = hiddenItems[0];
  const lastHidden = hiddenItems[hiddenItems.length - 1];
  const insertionTarget = lastHidden.nextElementSibling;
  const separator = createSeparator();
  const ellipsis = createEllipsis(root, hiddenItems);
  root.insertBefore(separator, firstHidden);
  root.insertBefore(ellipsis, insertionTarget);
}

function bindBreadcrumbs(root) {
  if (!(root instanceof HTMLElement) || root[BOUND_KEY]) {
    return;
  }

  root[BOUND_KEY] = true;
  collapseBreadcrumbs(root);
}

function initBreadcrumbs(target = document) {
  if (target instanceof HTMLElement && target.matches(ROOT_SELECTOR)) {
    bindBreadcrumbs(target);
  }

  target.querySelectorAll?.(ROOT_SELECTOR).forEach(bindBreadcrumbs);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initBreadcrumbs(document));
} else {
  initBreadcrumbs(document);
}

if (typeof MutationObserver !== 'undefined') {
  new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (!(node instanceof HTMLElement) || isGenerated(node)) {
          return;
        }

        initBreadcrumbs(node);
        const root = node.closest?.(ROOT_SELECTOR);

        if (root instanceof HTMLElement && root[BOUND_KEY]) {
          delete root.dataset.sfBreadcrumbsExpanded;
          collapseBreadcrumbs(root);
        }
      });
    });
  }).observe(document.documentElement, {
    childList: true,
    subtree: true
  });
}

/***/ },

/***/ "61b2b2e52939"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
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
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("61b2b2e52939");
/* harmony import */ var _js_breadcrumbs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7a5658d78a");
/* harmony import */ var _js_breadcrumbs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_js_breadcrumbs__WEBPACK_IMPORTED_MODULE_1__);
/**
* SIMAI Framework
* Copyright 2008-2026 SIMAI Ltd
* http://simai.studio
* Read the license: http://framework.simai.studio/license/
* Documentation: http://framework.simai.studio/
* Support: http://simai.studio/support/
*
* BREADCRUMBS
*
* Entry point for importing components from this directory.
* Simplifies the import process in other parts of the project.
* Instead of importing individual files, all component can be imported through this file.
*/


})();

/******/ })()
;