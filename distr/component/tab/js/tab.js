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
/* harmony import */ var _core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("695f21e50358");


const ROOT_SELECTOR = '.sf-tab';
const ACTIVE_CLASS = 'active';
const boundRoots = new WeakSet();

function owned(root, selector) {
  return Array.from(root.querySelectorAll(selector)).filter(item => item.closest(ROOT_SELECTOR) === root);
}

function getParts(root) {
  return {
    list: owned(root, 'nav > ul')[0] || null,
    tabs: owned(root, 'nav > ul > li'),
    panels: owned(root, '.sf-tab-content > section')
  };
} // <path>--<part>-<n> (standard 1.3.8 §7.1.1, simai/ui-source#41), not a module
// counter that numbered the parts in creation order.


function ensureId(root, element, part, index) {
  if (!element.id) element.id = (0,_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_1__.partId)((0,_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_1__.instancePath)(root, {
    kind: 'sf-tab'
  }), `${part}-${index}`);
  return element.id;
}

function isDisabled(tab) {
  return tab.classList.contains('disabled') || tab.getAttribute('aria-disabled') === 'true';
}

function normalizeIndex(index, total) {
  const value = Number.parseInt(index, 10);
  return Number.isFinite(value) && value >= 0 && value < total ? value : 0;
}

function initialIndex(root, tabs, panels, configuredStart) {
  const configured = root.getAttribute('data-active') ?? configuredStart;
  if (configured !== undefined && configured !== null) return normalizeIndex(configured, tabs.length);
  const marked = tabs.findIndex((tab, index) => tab.classList.contains(ACTIVE_CLASS) || panels[index]?.classList.contains(ACTIVE_CLASS));
  return normalizeIndex(marked, tabs.length);
}

function syncSemantics(root, start) {
  const {
    list,
    tabs,
    panels
  } = getParts(root);
  if (!list || !tabs.length) return {
    list,
    tabs,
    panels
  };
  list.setAttribute('role', 'tablist');
  list.setAttribute('aria-orientation', 'horizontal');
  const navigation = list.closest('nav');

  for (const name of ['aria-label', 'aria-labelledby']) {
    if (!list.hasAttribute(name) && navigation?.hasAttribute(name)) {
      list.setAttribute(name, navigation.getAttribute(name));
    }
  }

  const index = initialIndex(root, tabs, panels, start);
  tabs.forEach((tab, itemIndex) => {
    tab.setAttribute('role', 'tab');
    ensureId(root, tab, 'trigger', itemIndex);
    if (panels[itemIndex]) tab.setAttribute('aria-controls', ensureId(root, panels[itemIndex], 'panel', itemIndex));
  });
  activate(root, index, false);
  return {
    list,
    tabs,
    panels
  };
}

function activate(root, requestedIndex, emit = true) {
  const {
    tabs,
    panels
  } = getParts(root);
  if (!tabs.length) return;
  const index = normalizeIndex(requestedIndex, tabs.length);
  const selected = !isDisabled(tabs[index]) ? tabs[index] : tabs.find(tab => !isDisabled(tab));
  const selectedIndex = selected ? tabs.indexOf(selected) : index;
  tabs.forEach((tab, itemIndex) => {
    const active = itemIndex === selectedIndex;
    tab.classList.toggle(ACTIVE_CLASS, active);
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = tab === selected && !isDisabled(tab) ? 0 : -1;
  });
  panels.forEach((panel, itemIndex) => {
    const active = itemIndex === selectedIndex;
    panel.classList.toggle(ACTIVE_CLASS, active);
    panel.toggleAttribute('hidden', !active);
    panel.setAttribute('role', 'tabpanel');
    if (tabs[itemIndex]) panel.setAttribute('aria-labelledby', tabs[itemIndex].id);
  });

  if (root.getAttribute('data-active') !== String(selectedIndex)) {
    root.setAttribute('data-active', String(selectedIndex));
  }

  if (emit) root.dispatchEvent(new CustomEvent('sf:tab-change', {
    bubbles: true,
    detail: {
      index: selectedIndex,
      tab: tabs[selectedIndex],
      panel: panels[selectedIndex] || null
    }
  }));
}

function move(root, current, key) {
  const {
    tabs
  } = getParts(root);
  const enabled = tabs.filter(tab => !isDisabled(tab));
  if (!enabled.length) return null;
  if (key === 'Home') return enabled[0];
  if (key === 'End') return enabled[enabled.length - 1];
  let direction = key === 'ArrowLeft' ? -1 : 1;
  if (getComputedStyle(current).direction === 'rtl') direction *= -1;
  return enabled[(enabled.indexOf(current) + direction + enabled.length) % enabled.length];
}

function bind(root, options = {}) {
  if (!(root instanceof HTMLElement)) return;
  syncSemantics(root, options.start);
  root.classList.add('initialized');
  if (boundRoots.has(root)) return;
  root.addEventListener('click', event => {
    const {
      tabs
    } = getParts(root);
    const tab = event.target.closest?.('nav > ul > li');
    const index = tabs.indexOf(tab);
    if (index < 0 || isDisabled(tab)) return;
    event.preventDefault();
    activate(root, index);
  });
  root.addEventListener('keydown', event => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
    const {
      tabs
    } = getParts(root);
    const tab = event.target.closest?.('nav > ul > li');
    if (!tabs.includes(tab) || event.target !== tab || isDisabled(tab)) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      activate(root, tabs.indexOf(tab));
      return;
    }

    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    const next = move(root, tab, event.key);
    if (!next) return;
    event.preventDefault();
    activate(root, tabs.indexOf(next));
    next.focus();
  });
  boundRoots.add(root);
}

function init(target = document) {
  if (target instanceof Element && target.matches(ROOT_SELECTOR)) bind(target);
  target.querySelectorAll?.(ROOT_SELECTOR).forEach(root => bind(root));
}

function sfTab(element, options = {}) {
  this.el = element;
  this.options = { ...this.options,
    ...options
  };
  bind(element, this.options);
}

sfTab.prototype.options = {
  start: 0
};

sfTab.prototype._show = function show(index) {
  activate(this.el, index);
};

sfTab.prototype.refresh = function refresh() {
  syncSemantics(this.el, this.options.start);
};

sfTab.componentName = 'sfTab';
window.sfTab = sfTab;
window.SF = window.SF || {};
window.SF.Tab = window.SF.Tab || {
  init,
  activate
};
(0,_register_helper__WEBPACK_IMPORTED_MODULE_0__["default"])('sfTab', sfTab);
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => init());else init();

if (typeof MutationObserver !== 'undefined') {
  const observer = new MutationObserver(records => {
    const roots = new Set();
    records.forEach(record => {
      const owner = record.target.closest?.(ROOT_SELECTOR);
      if (owner) roots.add(owner);
      record.addedNodes.forEach(node => {
        if (!(node instanceof Element)) return;
        if (node.matches(ROOT_SELECTOR)) roots.add(node);
        node.querySelectorAll(ROOT_SELECTOR).forEach(root => roots.add(root));
      });
    });
    roots.forEach(root => {
      if (root.isConnected) bind(root);
    });
  });
  observer.observe(document.documentElement, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ['aria-disabled', 'data-active']
  });
}

/***/ },

/***/ "a662749cf487"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _tabs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("95a72b608b88");


/***/ },

/***/ "695f21e50358"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   instancePath: () => (/* binding */ instancePath),
/* harmony export */   partId: () => (/* binding */ partId),
/* harmony export */   pathIsSettled: () => (/* binding */ pathIsSettled)
/* harmony export */ });
// An instance's id is its role path (standard simai.smart-component 1.3.8
// §7.1.1; simai/ui-source#41).
//
//   - at the top of the page: `page/<host id or data-sf-role>`;
//   - a part with `data-sf-role` inside another instance:
//     `<parent path>/<role>`;
//   - neither: `<kind>[<n>]`, n counted in document order among the
//     instances of the same kind that have neither.
//
// Ids that templates write (`for`, `aria-controls`, `aria-labelledby`) are
// `<path with every non-word run as ->--<local name>`. A counter is never an
// id: the field ids used to come from a module-scope counter, and every
// bundle that carries the field code (eight of them) had its own, so a class
// sf-quantity and an <sf-quantity> on one page both took
// `sf-quantity-1-control` and a label pointed at the other field. Ids that
// follow creation order also swap when two instances swap, and server markup
// (§5.4) cannot repeat them. A path is read from the page, so every bundle
// gives the same answer.
//
// `kind` is the element's tag for a Smart element; class markup passes its
// root class and is told apart as `class.<root class>`.
const isElement = node => node && node.nodeType === 1 && typeof node.getAttribute === 'function';

const isCustom = node => isElement(node) && String(node.localName || '').includes('-');

function parentInstance(node) {
  for (let current = node.parentNode || node.host || null; current; current = current.parentNode || current.host || null) {
    if (isCustom(current)) return current;
  }

  return null;
}

function kindOf(owner, kind) {
  const tag = String(owner?.localName || '').toLowerCase();
  if (tag && tag.includes('-')) return tag;
  return `class.${kind || tag || 'element'}`;
}

function documentIndex(owner, kind) {
  const doc = owner?.ownerDocument;
  if (!owner?.isConnected || typeof doc?.querySelectorAll !== 'function') return 0;
  const selector = kind.startsWith('class.') ? `.${kind.slice('class.'.length)}` : kind;
  let index = 0;

  for (const one of doc.querySelectorAll(selector)) {
    if (kind.startsWith('class.') && isCustom(one)) continue;
    if (one.id || one.getAttribute('data-sf-role')) continue;
    index += 1;
    if (one === owner) return index;
  }

  return 0;
}
/** The role path of an instance (§7.1.1). */


function instancePath(owner, {
  kind = ''
} = {}) {
  const id = isElement(owner) ? String(owner.id || '').trim() : String(owner?.id || '').trim();
  if (id) return `page/${id}`;
  const role = isElement(owner) ? String(owner.getAttribute('data-sf-role') || '').trim() : '';

  if (role) {
    const parent = parentInstance(owner);
    return parent ? `${instancePath(parent, {
      kind: parent.localName
    })}/${role}` : `page/${role}`;
  }

  const resolved = kindOf(owner, kind);
  return `${resolved}[${documentIndex(owner, resolved)}]`;
}
/** An id a template writes for one of its parts: `<path as a word>--<local name>`. */

function partId(path, local) {
  const base = String(path).replace(/\W+/gu, '-').replace(/^-+|-+$/gu, '');
  return local ? `${base}--${local}` : base;
}
/** Whether the path is final: an instance in the page, or one with an id. */

function pathIsSettled(owner) {
  return Boolean(owner?.isConnected || String(owner?.id || '').trim());
}

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