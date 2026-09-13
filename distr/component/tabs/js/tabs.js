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

/***/ "13fe7358c81f"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d7f974466839");
/* harmony import */ var _register_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("58661bec99a6");


const TABS_SELECTOR = '.sf-tabs';
const TABS_BOUND_FLAG = 'sfTabsBound';
const SELECTED_CLASS = 'selected';
const boundTabs = new WeakSet();
const generatedLabels = new WeakMap();
let tabsIdentity = 0;

function isSmartTabsRoot(root) {
  return root?.parentElement?.localName === 'sf-tabs';
}

function ownedMatches(root, selector) {
  return Array.from(root.querySelectorAll(selector)).filter(item => item.closest('.sf-tabs') === root);
}

function getTabButtons(root) {
  return ownedMatches(root, '.sf-tabs-top .sf-button, .sf-tabs-top .sf-icon-button');
}

function isDisabled(button) {
  return button.disabled || button.classList.contains('disabled') || button.getAttribute('aria-disabled') === 'true';
}

function ensureId(element, part) {
  const duplicateGeneratedId = /^sf-tabs-(?:tab|panel|label)-\d+$/.test(element.id) && document.querySelectorAll(`#${CSS.escape(element.id)}`).length > 1;

  if (!element.id || duplicateGeneratedId) {
    let id;

    do {
      id = `sf-tabs-${part}-${++tabsIdentity}`;
    } while (document.getElementById(id));

    element.id = id;
  }

  return element.id;
}

function syncSemantics(root, buttons, panels) {
  const list = ownedMatches(root, '.sf-tabs-top')[0];
  if (!list) return; // Panels are siblings of the tablist, not its descendants in the ARIA tree.

  if (root.getAttribute('role') === 'tablist') root.removeAttribute('role');
  list.setAttribute('role', 'tablist');
  list.setAttribute('aria-orientation', root.classList.contains('sf-tabs--vertical') ? 'vertical' : 'horizontal');

  for (const name of ['aria-label', 'aria-labelledby']) {
    if (!list.hasAttribute(name) && root.hasAttribute(name)) list.setAttribute(name, root.getAttribute(name));
  }

  setIndex(buttons);
  setIndex(panels);
  buttons.forEach((button, index) => {
    ensureId(button, 'tab');
    button.setAttribute('role', 'tab');
    if (panels[index]) button.setAttribute('aria-controls', ensureId(panels[index], 'panel'));
    const label = button.querySelector('.sf-button-text-container');
    const previous = generatedLabels.get(button);

    if (label && !button.hasAttribute('aria-label') && (!button.hasAttribute('aria-labelledby') || button.getAttribute('aria-labelledby') === previous || /^sf-tabs-label-\d+$/.test(button.getAttribute('aria-labelledby')))) {
      const labelId = ensureId(label, 'label');
      button.setAttribute('aria-labelledby', labelId);
      generatedLabels.set(button, labelId);
    }
  });
  panels.forEach((panel, index) => {
    panel.setAttribute('role', 'tabpanel');
    if (buttons[index]) panel.setAttribute('aria-labelledby', buttons[index].id);
    if (!panel.hasAttribute('tabindex')) panel.tabIndex = 0;
  });
}

function initTabs(target) {
  if (!(target instanceof Element) && target !== document) return;

  if (target instanceof Element && target.matches?.(TABS_SELECTOR)) {
    bindTabs(target);
  }

  target.querySelectorAll?.(TABS_SELECTOR).forEach(bindTabs);
}

function setIndex(items) {
  let i = 0;

  for (const item of items) {
    item.dataset.tab = i++;
  }
}

function normalizeIndex(index, total) {
  const value = Number.parseInt(index, 10);

  if (!Number.isFinite(value) || value < 0 || value >= total) {
    return 0;
  }

  return value;
}

function getInitialIndex(root, buttons) {
  const configuredIndex = root.getAttribute('data-active-index') || root.getAttribute('data-active') || root.getAttribute('active-index') || root.getAttribute('active');

  if (configuredIndex !== null) {
    return normalizeIndex(configuredIndex, buttons.length);
  }

  const selectedIndex = Array.from(buttons).findIndex(button => button.classList.contains(SELECTED_CLASS));
  return normalizeIndex(selectedIndex, buttons.length);
}

function activateTab(root, index) {
  // Smart Tabs owns its selected index, lifecycle and events. The ordinary
  // runtime must not silently write a second state into that rendered subtree.
  if (isSmartTabsRoot(root)) return;
  const buttons = getTabButtons(root);
  const mainTabs = ownedMatches(root, '.sf-tabs-main-container .sf-tabs-main-tab');
  const activeIndex = normalizeIndex(index, buttons.length);
  syncSemantics(root, buttons, mainTabs);
  const tabStop = buttons[activeIndex] && !isDisabled(buttons[activeIndex]) ? buttons[activeIndex] : buttons.find(button => !isDisabled(button));
  if (root.dataset.activeIndex !== String(activeIndex)) root.dataset.activeIndex = String(activeIndex);
  buttons.forEach((button, itemIndex) => {
    const active = itemIndex === activeIndex;
    if (button.classList.contains(SELECTED_CLASS) !== active) button.classList.toggle(SELECTED_CLASS, active);
    button.setAttribute('aria-selected', String(active));
    button.setAttribute('tabindex', button === tabStop ? '0' : '-1');
  });
  mainTabs.forEach((tab, itemIndex) => {
    const active = itemIndex === activeIndex;
    if (tab.classList.contains(SELECTED_CLASS) !== active) tab.classList.toggle(SELECTED_CLASS, active);
    tab.toggleAttribute('hidden', !active);
  });
}

function bindTabs(root) {
  if (!(root instanceof HTMLElement) || isSmartTabsRoot(root)) {
    return;
  }

  const buttons = getTabButtons(root);
  activateTab(root, getInitialIndex(root, buttons)); // Explicit init also refreshes changed markup. A copied data marker is not
  // evidence that this DOM node already owns event listeners.

  if (boundTabs.has(root)) return;
  root.addEventListener('click', event => {
    const button = event.target.closest?.('.sf-button, .sf-icon-button');
    const currentButtons = getTabButtons(root),
          index = currentButtons.indexOf(button);
    if (index < 0 || isDisabled(button)) return;
    activateTab(root, index);
  });
  root.addEventListener('keydown', event => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
    const currentButtons = getTabButtons(root),
          button = event.target;
    if (!currentButtons.includes(button) || isDisabled(button)) return;

    if (event.key === 'Enter' || event.key === ' ') {
      // Native buttons retain their normal click event. Non-button legacy
      // controls with a tab role need explicit keyboard activation.
      if (button.tagName !== 'BUTTON') {
        event.preventDefault();
        activateTab(root, currentButtons.indexOf(button));
      }

      return;
    }

    const vertical = root.classList.contains('sf-tabs--vertical');
    const arrows = vertical ? ['ArrowUp', 'ArrowDown'] : ['ArrowLeft', 'ArrowRight'];
    if (!['Home', 'End', ...arrows].includes(event.key)) return;
    const enabled = currentButtons.filter(item => !isDisabled(item));
    if (!enabled.length) return;
    event.preventDefault();
    let direction = event.key === arrows[0] ? -1 : 1;
    if (!vertical && getComputedStyle(button.closest('.sf-tabs-top')).direction === 'rtl') direction *= -1;
    const next = event.key === 'Home' ? enabled[0] : event.key === 'End' ? enabled[enabled.length - 1] : enabled[(enabled.indexOf(button) + direction + enabled.length) % enabled.length];
    activateTab(root, currentButtons.indexOf(next));
    next.focus();
  });
  boundTabs.add(root);
  root.dataset[TABS_BOUND_FLAG] = '1';
}

class Tabs extends _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__.ComponentObserver {
  static componentName = 'Tabs';
  html = null;
}

(0,_register_helper__WEBPACK_IMPORTED_MODULE_1__["default"])('Tabs', Tabs);

if (typeof window !== 'undefined') {
  window.SF = window.SF || {};
  window.SF.Tabs = window.SF.Tabs || {};
  window.SF.Tabs.activate = activateTab;
  window.SF.Tabs.init = initTabs;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initTabs(document));
} else {
  initTabs(document);
} // One document observer; roots/listeners are weakly tracked, so detached blocks
// are not kept alive. Output attributes are either not watched or idempotent.


if (typeof MutationObserver !== 'undefined') {
  const observer = new MutationObserver(records => {
    const roots = new Set();
    records.forEach(record => {
      const owner = record.target.closest?.(TABS_SELECTOR);
      if (owner) roots.add(owner);
      record.addedNodes.forEach(node => {
        if (!(node instanceof Element)) return;
        if (node.matches(TABS_SELECTOR)) roots.add(node);
        node.querySelectorAll(TABS_SELECTOR).forEach(root => roots.add(root));
      });
    });
    roots.forEach(root => {
      if (root.isConnected && !isSmartTabsRoot(root)) bindTabs(root);
    });
  });
  observer.observe(document.documentElement, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ['class', 'disabled', 'aria-disabled', 'data-active-index', 'data-active', 'active-index', 'active']
  });
}

/***/ },

/***/ "3d8d7b2253e9"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _tabs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("13fe7358c81f");
/*
* Main JS file for including JS for component.
*
* Imports:
* - Base function component (_component_name.js)
*/


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
          // Only explicit (.class) annotations are classes; the
          // parentheses in var(--token) are CSS values, not markup.
          if (cls.startsWith('.') && cls.length > 1) classes.add(cls.slice(1));
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

/***/ "c516309e5631"
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
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("c516309e5631");
/* harmony import */ var _js_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("3d8d7b2253e9");
/**
* SIMAI Framework
* Copyright 2008-2026 SIMAI Ltd
* http://simai.studio
* Read the license: http://framework.simai.studio/license/
* Documentation: http://framework.simai.studio/
* Support: http://simai.studio/support/
*
* TABS
*
* Entry point for importing components from this directory.
* Simplifies the import process in other parts of the project.
* Instead of importing individual files, all component can be imported through this file.
*/


})();

/******/ })()
;