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
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("8489d1f5bab4");

 // Every word this part says. A product adds a language with
// SF.language.register('sf-admin-menu', code, words); a ternary on «ru» allowed two
// and no more.

const ADMIN_MENU_ITEM_TEXT = {
  en: {
    collapse: 'Collapse',
    expand: 'Expand'
  },
  ru: {
    collapse: 'Свернуть',
    expand: 'Развернуть'
  }
};
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
      text.textContent = (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(ADMIN_MENU_ITEM_TEXT, state ? 'collapse' : 'expand', text, 'sf-admin-menu');
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
    const nextHeight = visibleItem?.offsetHeight || this.menuItemHeight;

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

  contentFitsWithoutOverflow(items) {
    if (!this.main) return true;

    if (this.moreWrap) {
      this.setInvisible(this.moreWrap, true, true);
    }

    items.forEach(item => {
      this.setHidden(item, false);
      this.setInvisible(item, false);
    });
    return this.main.scrollHeight <= this.main.clientHeight + 1;
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

    if (this.contentFitsWithoutOverflow(items)) {
      this.overflowOpen = false;
      this.main.classList.remove("overflow-auto", "open");
      return;
    }

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

/***/ "8489d1f5bab4"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isRussianPage: () => (/* binding */ isRussianPage),
/* harmony export */   language: () => (/* binding */ language),
/* harmony export */   pageLanguage: () => (/* binding */ pageLanguage),
/* harmony export */   pageLocale: () => (/* binding */ pageLocale),
/* harmony export */   pageText: () => (/* binding */ pageText)
/* harmony export */ });
// What language a component speaks, and how a product adds one.
//
// The Framework speaks English by default and whatever the page says otherwise:
// the language is the nearest [lang] above the node, else the document's, else
// English. One rule for every component, so a page never mixes two because two
// components looked in different places.
//
// Until 2026-10-10 that was the whole of it, and every component carried a
// dictionary of exactly two languages written into its source. Adding a third
// meant editing sixteen files, and a product that needed one could not add it
// at all. There will be many more than two (owner, 2026-10-11), so the
// dictionaries a component ships are now a FLOOR rather than the whole set:
// anything can be registered beside them, for any language, including one the
// Framework has never heard of.
//
// Where a word comes from, in order:
//
//   1. the component's own attribute — a consumer who names a word has named
//      it, and no language changes it;
//   2. a word registered for the resolved language;
//   3. the word the component ships for that language;
//   4. the same two again for the language without its region (`pt-BR` → `pt`);
//   5. the same two again for English;
//   6. the key itself, which is a visible defect rather than a blank.
//
// Registering is additive and reversible, and it does not require the
// Framework to know the language exists.
// The state is shared between every copy of this module, which there are
// several of: core, each smart component and each composite are separate
// bundles, and each one carries its own copy of this file. With the registry
// in module scope the page had as many registries as bundles -- `SF.language`
// was published from core's copy, the table read its own, and registering a
// language changed nothing on screen. Only a browser shows that, and it did
// (2026-10-11).
const STORE = (() => {
  const root = typeof globalThis !== 'undefined' ? globalThis : {};
  const key = '__sfPageLanguage';

  if (!root[key]) {
    root[key] = {
      listeners: new Set(),
      registered: new Map(),
      chosen: null
    };
  }

  return root[key];
})();

const LISTENERS = STORE.listeners;
const REGISTERED = STORE.registered;

const normalise = value => String(value ?? '').trim().toLowerCase().replace('_', '-');
/** The languages to try, most specific first, English last. */


const chain = language => {
  const wanted = normalise(language);
  const base = wanted.split('-')[0];
  const order = [];

  for (const candidate of [wanted, base, 'en']) {
    if (candidate && !order.includes(candidate)) order.push(candidate);
  }

  return order;
};
/** Which component a node belongs to, for words registered against one. */


const componentOf = node => {
  const tag = node?.tagName;
  return typeof tag === 'string' ? tag.toLowerCase() : null;
};

const announce = () => {
  for (const listener of [...LISTENERS]) {
    try {
      listener();
    } catch {// A listener that throws is not allowed to stop the others: a page that
      // half-changed language would be worse than one that did not change.
    }
  }
};
/**
 * The page's language for this node: the nearest [lang], else the document's,
 * else English — unless a product has chosen one explicitly.
 */


function pageLanguage(node) {
  if (STORE.chosen) return STORE.chosen;
  const owner = node && typeof node.closest === 'function' ? node.closest('[lang]') : null;
  const value = owner?.getAttribute('lang') || globalThis.document?.documentElement?.lang || 'en';
  return normalise(value).split('-')[0] || 'en';
}
/** The page's language with its region kept, which is what formatting wants. */

function pageLocale(node) {
  if (STORE.chosen) return STORE.chosen;
  const owner = node && typeof node.closest === 'function' ? node.closest('[lang]') : null;
  return normalise(owner?.getAttribute('lang') || globalThis.document?.documentElement?.lang || 'en');
}
function isRussianPage(node) {
  return pageLanguage(node) === 'ru';
}
/**
 * Text for `key` in the page's language.
 *
 * `dictionary` is what the component ships; `component` names it for the
 * registry and defaults to the node's own tag, so a component calling with
 * `this` identifies itself without saying so twice.
 */

function pageText(dictionary, key, node, component) {
  const owner = component ?? componentOf(node);

  for (const candidate of chain(pageLocale(node))) {
    const added = owner ? REGISTERED.get(owner)?.get(candidate)?.[key] : undefined;
    if (added !== undefined) return added;
    const shipped = dictionary?.[candidate]?.[key];
    if (shipped !== undefined) return shipped;
  }

  return key;
}
const language = {
  /** What the page resolves to for this node, region and all. */
  current(node = globalThis.document?.documentElement ?? null) {
    return pageLocale(node);
  },

  /**
   * Choose a language for the whole page, whatever its markup says. `null`
   * returns to following the document, which is the default and what a
   * server-rendered page wants.
   */
  use(value) {
    const next = value === null || value === undefined ? null : normalise(value);
    if (next === STORE.chosen) return STORE.chosen;
    STORE.chosen = next;
    announce();
    return STORE.chosen;
  },

  /**
   * Add or replace one component's words for one language.
   *
   * The words are merged, so a product can correct a single label without
   * restating the rest, and `null` removes what it added.
   */
  register(component, value, words) {
    const name = String(component ?? '').toLowerCase();
    const code = normalise(value);
    if (!name || !code) throw new TypeError('a component and a language are required');
    if (!REGISTERED.has(name)) REGISTERED.set(name, new Map());
    const byLanguage = REGISTERED.get(name);
    if (words === null) byLanguage.delete(code);else byLanguage.set(code, { ...(byLanguage.get(code) ?? {}),
      ...words
    });
    announce();
    return this;
  },

  /** One language across many components: `{ 'sf-table': {...}, ... }`. */
  registerAll(value, byComponent = {}) {
    for (const [component, words] of Object.entries(byComponent)) {
      this.register(component, value, words);
    }

    return this;
  },

  /** The languages something has registered words for. */
  known(component) {
    const name = String(component ?? '').toLowerCase();
    return [...(REGISTERED.get(name)?.keys() ?? [])];
  },

  /** Every component something has been registered for. */
  components() {
    return [...REGISTERED.keys()];
  },

  /**
   * Called whenever the chosen language or the registered words change, so a
   * component can draw itself again. Returns the way to stop listening.
   */
  onChange(listener) {
    if (typeof listener !== 'function') return () => {};
    LISTENERS.add(listener);
    return () => LISTENERS.delete(listener);
  },

  /** Everything registered is forgotten. For tests, and for a product reset. */
  forget() {
    REGISTERED.clear();
    STORE.chosen = null;
    announce();
    return this;
  }

}; // Reachable by a consumer, which it was not: `sf-admin-menu` had written its
// own reading of the rule because the shared one was an internal module, and
// the two then disagreed about a region that names its own language. A product
// composing its own elements gets the same rule here.

if (typeof window !== 'undefined') {
  window.SF = window.SF || {};
  window.SF.language = language;
  window.SF.pageLanguage = pageLanguage;
  window.SF.pageText = pageText;
}

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