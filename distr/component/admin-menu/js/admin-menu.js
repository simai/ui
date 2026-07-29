/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "7a28c9851242"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AdminMenu: () => (/* binding */ AdminMenu),
/* harmony export */   initAdminMenus: () => (/* binding */ initAdminMenus)
/* harmony export */ });
/* harmony import */ var _register_helper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("58661bec99a6");

const SMART_TAG = 'SF-ADMIN-MENU';
const ROOT_SELECTOR = ".sf-admin-menu, .sf-admin-menu-panel:not(.sf-admin-menu-panel-sub)";
const BOUND_FLAG = "sfAdminMenuBound";

function isElement(value) {
  return value instanceof Element;
}

function isSmart(root) {
  return root.parentNode.nodeName === SMART_TAG;
}

function getRootScope(root) {
  return root.closest(".sf-admin-menu") || root.parentElement || root;
}

function queryOne(scope, selector) {
  return scope?.querySelector?.(selector) || null;
}

function isAdminMenuRoot(root) {
  if (isSmart(root)) return false;

  if (!isElement(root) || root.classList.contains("sf-admin-menu-panel-sub")) {
    return false;
  }

  return !root.closest(".sf-admin-menu") || root.classList.contains("sf-admin-menu");
}

class AdminMenu {
  static componentName = "AdminMenu";

  constructor(root) {
    if (!isElement(root)) {
      throw new Error("AdminMenu root must be an Element");
    }

    this.root = root;
    this.panel = root.matches(".sf-admin-menu-panel:not(.sf-admin-menu-panel-sub)") ? root : root.querySelector(":scope > .sf-admin-menu-panel:not(.sf-admin-menu-panel-sub)") || root;
    this.scope = getRootScope(root);
    this.main = queryOne(root, ".sf-admin-menu-main");
    this.searchBlock = queryOne(root, ".sf-admin-menu-search");
    this.searchInput = queryOne(this.searchBlock, ".sf-input");
    this.searchIcon = queryOne(this.searchBlock, ".sf-admin-menu-item");
    this.toggleButtons = Array.from(root.querySelectorAll("[data-admin-menu-toggle], #toggle_menu"));
    this.compactTriggerButtons = Array.from(root.querySelectorAll("[data-admin-menu-toggle], #toggle_menu, [data-admin-menu-search-toggle], #search_toggle_menu"));
    this.moreWrap = null;
    this.overflowOpen = false;
    this.compact = this.panel.classList.contains("small");
    this.resizeFrame = null;
    this.isMeasuring = false;
    this.menuItemHeight = 0;
    this.resizeObserver = null;
    this.boundListeners = [];
    this.init();
  }

  init() {
    if (this.root.dataset[BOUND_FLAG] === "1") return;
    this.root.dataset[BOUND_FLAG] = "1";
    this.bindToggleButtons();
    this.bindMenuPanels();
    this.scheduleOverflowUpdate();
    this.observeMainResize();
  }

  bindToggleButtons() {
    this.compactTriggerButtons.forEach(button => {
      const listener = () => this.toggleCompact();

      button.addEventListener("click", listener);
      this.boundListeners.push([button, "click", listener]);
    });
  }

  bindMenuPanels() {
    const buttons = Array.from(this.scope.querySelectorAll("button[data-menu]"));
    buttons.forEach(button => {
      if (button.dataset.sfAdminMenuPanelBound === "1") return;

      const listener = () => {
        if (this.compact) {
          this.toggleCompact(false);
        }

        const panel = this.getPanel(button.dataset.menu);
        if (!panel) return;
        requestAnimationFrame(() => {
          this.observeSubMenu(panel);
          requestAnimationFrame(() => {
            panel.classList.toggle("inline-end-full");
            panel.classList.toggle("inline-end-0");
          });
        });
      };

      button.dataset.sfAdminMenuPanelBound = "1";
      button.addEventListener("click", listener);
      this.boundListeners.push([button, "click", listener]);
    });
  }

  getPanel(name) {
    if (!name) return null;
    const escapedName = typeof CSS !== "undefined" && CSS.escape ? CSS.escape(name) : String(name).replace(/"/g, '\\"');
    return queryOne(this.scope, `section[data-panel="${escapedName}"]`);
  }

  toggleSearchBlock() {
    [this.searchIcon, this.searchInput].forEach(el => {
      el?.classList.toggle("hidden");
    });
  }

  toggleCompact(force = null) {
    const nextCompact = typeof force === "boolean" ? force : !this.compact;
    if (nextCompact === this.compact) return;
    this.toggleSearchBlock();
    this.compact = nextCompact;
    this.panel.classList.toggle("small", this.compact);
    this.toggleButtons.forEach(button => {
      button.classList.toggle("segment-end", this.compact);
      const prevButton = button.previousElementSibling;
      prevButton?.classList.toggle("hidden", this.compact);
      const icon = button.querySelector(".sf-icon");

      if (icon) {
        icon.textContent = `keyboard_double_arrow_${this.compact ? "right" : "left"}`;
      }
    });
    this.scheduleOverflowUpdate();
  }

  observeSubMenu(panel) {
    const menu = queryOne(panel, ":scope > .sf-admin-menu-main-sub");
    if (!menu) return;
    menu.classList.toggle("has_scroll", menu.scrollHeight > menu.clientHeight);
  }

  createMoreItem() {
    const moreContainer = document.createElement("li");
    moreContainer.className = "sf-admin-menu-item-wrap flex flex-col more";
    const moreButton = document.createElement("button");
    moreButton.type = "button";
    moreButton.className = "sf-admin-menu-item flex items-cross-center content-main-between";
    const moreSpan = document.createElement("span");
    moreSpan.className = "sf-admin-menu-item-container flex items-cross-center";
    const moreIcon = document.createElement("i");
    moreIcon.className = "sf-icon";
    const moreText = document.createElement("span");
    moreText.className = "sf-admin-menu-more-text";
    moreSpan.append(moreIcon, moreText);
    moreButton.append(moreSpan);
    moreContainer.append(moreButton);
    moreButton.addEventListener("click", () => {
      this.setOverflowExpanded(!this.overflowOpen);
    });
    this.setMoreText(moreButton, false);
    return moreContainer;
  }

  setMoreText(button, state) {
    const icon = button.querySelector(".sf-icon");
    const text = button.querySelector(".sf-admin-menu-more-text");

    if (icon) {
      icon.textContent = `keyboard_arrow_${state ? "up" : "down"}`;
    }

    if (text) {
      text.textContent = state ? "Свернуть" : "Развернуть";
    }
  }

  setInvisible(item, state, more = false) {
    ["opacity-0", "invisible"].forEach(className => {
      item.classList.toggle(className, state);
    });

    if (more) {
      item.classList.toggle("hidden", state);
    }
  }

  setHidden(item, state) {
    item.classList.toggle("hidden", state);
  }

  setOverflowExpanded(state) {
    if (!this.main || !this.moreWrap) return;
    this.overflowOpen = state;
    const moreButton = this.moreWrap.querySelector(".sf-admin-menu-item");

    if (moreButton) {
      this.setMoreText(moreButton, this.overflowOpen);
    }

    const hiddenItems = Array.from(this.main.querySelectorAll(":scope > ul > .sf-admin-menu-item-wrap:not(.more).invisible"));
    hiddenItems.forEach(item => {
      this.setInvisible(item, !this.overflowOpen);
      this.setHidden(item, !this.overflowOpen);
    });
    ["overflow-auto", "open"].forEach(className => {
      this.main.classList.toggle(className, this.overflowOpen);
    });

    if (this.overflowOpen) {
      this.getItemsList()?.append(this.moreWrap);
      return;
    }

    this.updateOverflow();
  }

  scheduleOverflowUpdate() {
    if (this.resizeFrame || this.isMeasuring) return;
    this.resizeFrame = requestAnimationFrame(() => {
      this.resizeFrame = null;
      this.isMeasuring = true;
      this.updateOverflow();
      requestAnimationFrame(() => {
        this.isMeasuring = false;
      });
    });
  }

  updateMenuItemHeight(items) {
    const visibleItem = items.find(item => !item.classList.contains("hidden"));
    const nextHeight = visibleItem?.offsetHeight || this.menuItemHeight || 56;

    if (nextHeight && nextHeight !== this.menuItemHeight) {
      this.menuItemHeight = nextHeight;
    }

    return this.menuItemHeight;
  }

  getItemsList() {
    return queryOne(this.main, ":scope > ul");
  }

  getItems() {
    const list = this.getItemsList();
    if (!list) return [];
    return Array.from(list.querySelectorAll(":scope > .sf-admin-menu-item-wrap:not(.more)"));
  }

  ensureMoreItem() {
    if (!this.moreWrap) {
      this.moreWrap = this.createMoreItem();
    } else {
      this.setInvisible(this.moreWrap, false, true);
    }

    return this.moreWrap;
  }

  updateOverflow() {
    if (!this.main) return;
    const items = this.getItems();
    if (!items.length) return;
    const itemHeight = this.updateMenuItemHeight(items);
    const containerHeight = this.main.clientHeight - itemHeight;
    const visibleCount = Math.max(0, Math.min(items.length, Math.floor(containerHeight / itemHeight)));
    let hasHidden = false;
    items.forEach((item, index) => {
      const hidden = index >= visibleCount;
      const collapseItem = hidden && !this.overflowOpen;

      if (hidden) {
        hasHidden = true;
      }

      this.setHidden(item, collapseItem);
      this.setInvisible(item, collapseItem);
    });

    if (!hasHidden) {
      if (this.moreWrap) {
        this.setInvisible(this.moreWrap, true, true);
      }

      return;
    }

    const more = this.ensureMoreItem();
    const list = this.getItemsList();
    if (!list) return;

    if (this.overflowOpen) {
      list.append(more);
      return;
    }

    const firstInvisibleElement = list.querySelector(":scope > .sf-admin-menu-item-wrap:not(.more).invisible");

    if (firstInvisibleElement) {
      firstInvisibleElement.before(more);
    }
  }

  observeMainResize() {
    if (!this.main || typeof ResizeObserver === "undefined") return;
    this.resizeObserver = new ResizeObserver(() => {
      this.scheduleOverflowUpdate();
    });
    this.resizeObserver.observe(this.main);
  }

  destroy() {
    this.boundListeners.forEach(([target, eventName, listener]) => {
      target.removeEventListener(eventName, listener);
    });
    this.resizeObserver?.disconnect?.();
    delete this.root.dataset[BOUND_FLAG];
  }

}

function initAdminMenus(scope = document) {
  if (!scope?.querySelectorAll && !isElement(scope)) return;
  const roots = [];

  if (isElement(scope) && scope.matches(ROOT_SELECTOR) && isAdminMenuRoot(scope)) {
    roots.push(scope);
  }

  scope.querySelectorAll?.(ROOT_SELECTOR).forEach(root => {
    if (isAdminMenuRoot(root)) {
      roots.push(root);
    }
  });
  roots.forEach(root => {
    if (root.dataset[BOUND_FLAG] === "1") return;
    root.__sfAdminMenu = new AdminMenu(root);
  });
}

function bootAdminMenu() {
  initAdminMenus(document);
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (!isElement(node)) return;
        initAdminMenus(node);
      });
    });
  });
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
}

(0,_register_helper__WEBPACK_IMPORTED_MODULE_0__["default"])("AdminMenu", AdminMenu);

if (typeof window !== "undefined") {
  window.SF = window.SF || {};
  window.SF.AdminMenu = window.SF.AdminMenu || {};
  window.SF.AdminMenu.init = initAdminMenus;
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootAdminMenu, {
    once: true
  });
} else {
  bootAdminMenu();
}



/***/ },

/***/ "c0cdd3f2d19a"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _admin_menu__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("7a28c9851242");
/*
* Main JS file for including JS for component.
*
* Imports:
* - Base function component (_admin_menu.js)
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

/***/ "c7144e9f03b0"
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
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("c7144e9f03b0");
/* harmony import */ var _js_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("c0cdd3f2d19a");
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