/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "03bdf58522db"
() {

const MENU_ITEM_SELECTOR = '.sf-menu-item';
const BOUND_FLAG = 'sfMenuBound';
const EVENTS_BOUND_FLAG = 'sfMenuEventsBound';
const OBSERVED_ATTRIBUTES = ['icon', 'trailing-icon', 'text', 'expanded', 'aria-expanded', 'disabled'];

function toBoolean(value, fallback = false) {
  if (value === undefined || value === null || value === '') return fallback;
  if (typeof value === 'boolean') return value;
  return ['1', 'true', 'yes', 'on'].includes(String(value).toLowerCase());
}

function isExpanded(root) {
  return root.classList.contains('open') || root.hasAttribute('expanded') || toBoolean(root.getAttribute('expanded')) || toBoolean(root.getAttribute('aria-expanded'));
}

function getElementLevel(root) {
  const levelClass = Array.from(root.classList).find(className => className.startsWith('sf-menu-element--level-'));
  if (levelClass) return levelClass;
  const itemLevelClass = Array.from(root.classList).find(className => className.startsWith('sf-menu-item--level-'));

  if (itemLevelClass) {
    return itemLevelClass.replace('sf-menu-item--', 'sf-menu-element--');
  }

  let level = 1;
  let currentMenu = root.parentElement?.closest('.sf-menu');

  while (currentMenu) {
    const parentItem = currentMenu.parentElement?.closest('.sf-menu-item');
    if (!parentItem) break;
    level += 1;
    currentMenu = parentItem.parentElement?.closest('.sf-menu');
  }

  const normalizedLevel = Math.min(Math.max(level, 1), 4);
  return `sf-menu-element--level-${normalizedLevel}`;
}

function getTextContent(root) {
  const explicitText = root.getAttribute('text');
  if (explicitText) return explicitText;
  const text = root.querySelector('.sf-menu-element-text');
  if (text) return text.textContent?.trim() || '';
  return Array.from(root.childNodes).filter(node => node.nodeType === Node.TEXT_NODE).map(node => node.textContent || '').join(' ').replace(/\s+/g, ' ').trim();
}

function clearDirectTextNodes(root) {
  Array.from(root.childNodes).forEach(node => {
    if (node.nodeType !== Node.TEXT_NODE) return;
    node.remove();
  });
}

function hasSubmenu(root) {
  const nestedMenu = root.querySelector(':scope > .sf-menu');
  return Boolean(nestedMenu);
}

function ensureElement(root) {
  let element = root.querySelector(':scope > .sf-menu-element');

  if (!element) {
    element = document.createElement('div');
    element.className = 'sf-menu-element';
    root.prepend(element);
  }

  return element;
}

function ensureWrap(element) {
  let wrap = element.querySelector(':scope > .sf-menu-element-wrap');

  if (!wrap) {
    wrap = document.createElement('span');
    wrap.className = 'sf-menu-element-wrap';
    element.prepend(wrap);
  }

  return wrap;
}

function ensureLeading(root, wrap) {
  const iconName = root.getAttribute('icon') || '';
  let leading = wrap.querySelector('.sf-menu-element-icon');

  if (!iconName) {
    if (leading) leading.remove();
    return null;
  }

  if (!leading) {
    leading = document.createElement('span');
    leading.className = 'sf-icon sf-menu-element-icon';
    wrap.prepend(leading);
  }

  leading.textContent = iconName;
  return leading;
}

function ensureText(root, wrap) {
  let text = wrap.querySelector('.sf-menu-element-text');

  if (!text) {
    text = document.createElement('span');
    text.className = 'sf-menu-element-text';
    wrap.append(text);
  }

  text.textContent = getTextContent(root);
  return text;
}

function ensureTrailing(element) {
  let trailing = element.querySelector(':scope > .sf-icon-button');

  if (!trailing) {
    trailing = document.createElement('button');
    trailing.type = 'button';
    trailing.className = 'sf-icon-button';
    trailing.innerHTML = '<span class="sf-icon" aria-hidden="true"></span>';
    element.append(trailing);
  }

  trailing.classList.add('sf-icon-button');
  return trailing;
}

function removeTrailing(element) {
  const trailing = element.querySelector(':scope > .sf-icon-button');

  if (trailing) {
    trailing.remove();
  }
}

function applyElementState(root, element, expanded, isBranch) {
  element.classList.remove('sf-menu-element--level-1', 'sf-menu-element--level-2', 'sf-menu-element--level-3', 'sf-menu-element--level-4');
  element.classList.add(getElementLevel(root));
  element.classList.toggle('open', expanded);
  element.classList.toggle('sf-menu-element--has-submenu', isBranch);
  element.classList.toggle('disabled', root.classList.contains('disabled') || root.hasAttribute('disabled'));

  if (isBranch) {
    element.setAttribute('aria-expanded', String(expanded));
  } else {
    element.removeAttribute('aria-expanded');
  }
}

function applyTrailingState(trailing, root, expanded) {
  const trailingIcon = root.getAttribute('trailing-icon') || (expanded ? 'expand_less' : 'expand_more');
  trailing.disabled = root.classList.contains('disabled') || root.hasAttribute('disabled');
  const icon = trailing.querySelector('.sf-icon');

  if (icon) {
    icon.textContent = trailingIcon;
  }
}

function toggleMenuItem(root) {
  if (!root || root.classList.contains('disabled') || root.hasAttribute('disabled')) {
    return false;
  }

  const nestedMenu = root.querySelector(':scope > .sf-menu');
  if (!nestedMenu) return false;
  const nextOpen = !root.classList.contains('open');

  if (nextOpen) {
    root.classList.add('open');
    root.setAttribute('expanded', '');
    root.setAttribute('aria-expanded', 'true');
  } else {
    root.classList.remove('open');
    root.removeAttribute('expanded');
    root.setAttribute('aria-expanded', 'false');
  }

  initMenuItem(root);
  return true;
}

function initMenuItem(root) {
  if (!root) return;
  const expanded = isExpanded(root);
  const isBranch = hasSubmenu(root);
  const element = ensureElement(root);
  const wrap = ensureWrap(element);
  root.dataset[BOUND_FLAG] = 'true';
  root.classList.add('sf-menu-item');
  root.classList.toggle('sf-menu-item--has-submenu', isBranch);

  if (!element.hasAttribute('role') && root.tagName !== 'BUTTON' && root.tagName !== 'A') {
    element.setAttribute('role', 'button');
  }

  if (!element.hasAttribute('tabindex') && root.tagName !== 'BUTTON' && root.tagName !== 'A') {
    element.setAttribute('tabindex', root.hasAttribute('disabled') ? '-1' : '0');
  }

  ensureLeading(root, wrap);
  ensureText(root, wrap);
  clearDirectTextNodes(root);
  applyElementState(root, element, expanded, isBranch);

  if (isBranch) {
    const trailing = ensureTrailing(element);
    applyTrailingState(trailing, root, expanded);
  } else {
    removeTrailing(element);
  }
}

function setupMenuItem(root) {
  if (!root || root.dataset[BOUND_FLAG] === 'true') {
    initMenuItem(root);
    return;
  }

  initMenuItem(root);
}

function initAllMenuItems(scope = document) {
  const roots = scope instanceof Element && scope.matches(MENU_ITEM_SELECTOR) ? [scope] : Array.from(scope.querySelectorAll?.(MENU_ITEM_SELECTOR) || []);
  roots.forEach(setupMenuItem);
}

function observeMenuItems() {
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.type === 'attributes' && mutation.target instanceof Element) {
        if (mutation.target.matches(MENU_ITEM_SELECTOR)) {
          initMenuItem(mutation.target);
        }

        return;
      }

      mutation.addedNodes.forEach(node => {
        if (!(node instanceof Element)) return;
        initAllMenuItems(node);
      });
    });
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: OBSERVED_ATTRIBUTES
  });
}

function bindMenuEvents() {
  if (document.body.dataset[EVENTS_BOUND_FLAG] === 'true') return;
  document.body.dataset[EVENTS_BOUND_FLAG] = 'true';
  document.addEventListener('click', event => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const button = target.closest('.sf-menu-item > .sf-menu-element > .sf-icon-button');

    if (button) {
      event.preventDefault();
      event.stopPropagation();
      toggleMenuItem(button.closest('.sf-menu-item'));
      return;
    }

    const element = target.closest('.sf-menu-item > .sf-menu-element');
    if (!element) return;
    if (target.closest('.sf-icon-button')) return;
    toggleMenuItem(element.closest('.sf-menu-item'));
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const target = event.target;
    if (!(target instanceof Element)) return;
    const element = target.closest('.sf-menu-item > .sf-menu-element');
    if (!element) return;
    event.preventDefault();
    toggleMenuItem(element.closest('.sf-menu-item'));
  });
}

function bootMenuItems() {
  initAllMenuItems(document);
  observeMenuItems();
  bindMenuEvents();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootMenuItems, {
    once: true
  });
} else {
  bootMenuItems();
}

/***/ },

/***/ "ec84dd674a49"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _menu__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("03bdf58522db");
/* harmony import */ var _menu__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_menu__WEBPACK_IMPORTED_MODULE_0__);
/*
* Main JS file for including JS for component.
*
* Imports:
* - Base function component (_admin_menu.js)
*/


/***/ },

/***/ "4df711608965"
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
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("4df711608965");
/* harmony import */ var _js_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("ec84dd674a49");
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