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

/***/ "3eb8861071f8"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   activateTreeItem: () => (/* binding */ activateTreeItem),
/* harmony export */   getVisibleItems: () => (/* binding */ getVisibleItems),
/* harmony export */   handleTreeKeydown: () => (/* binding */ handleTreeKeydown),
/* harmony export */   initTree: () => (/* binding */ initTree),
/* harmony export */   isSmartTreeRoot: () => (/* binding */ isSmartTreeRoot),
/* harmony export */   moveTreeTypeahead: () => (/* binding */ moveTreeTypeahead),
/* harmony export */   selectTreeItem: () => (/* binding */ selectTreeItem),
/* harmony export */   setTabStop: () => (/* binding */ setTabStop),
/* harmony export */   setTreeItemOpen: () => (/* binding */ setTreeItemOpen),
/* harmony export */   syncTree: () => (/* binding */ syncTree),
/* harmony export */   toggleTreeItem: () => (/* binding */ toggleTreeItem)
/* harmony export */ });
/* harmony import */ var _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d7f974466839");
/* harmony import */ var _register_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("58661bec99a6");


const TREE_SELECTOR = '.sf-tree';
const TREE_ITEM_SELECTOR = '.sf-tree-item';
const TREE_GROUP_SELECTOR = '.sf-tree-group';
const TREE_BOUND_FLAG = 'sfTreeBound';
const treeTypeahead = new WeakMap();

function isSmartTreeRoot(root) {
  return Boolean(root?.closest?.('sf-tree'));
}

function getItemContainer(item) {
  return item?.querySelector?.(':scope > .sf-tree-item-container') || null;
}

function getNestedItems(item) {
  const group = Array.from(item?.children || []).find(child => child.classList?.contains('sf-tree-group'));
  const owner = group || item;
  return Array.from(owner?.children || []).filter(child => child.classList?.contains('sf-tree-item'));
}

function getParentItem(item, root) {
  const group = item?.parentElement?.closest?.(TREE_GROUP_SELECTOR);
  const parent = group?.parentElement?.closest?.(TREE_ITEM_SELECTOR);
  return parent && root.contains(parent) ? parent : null;
}

function getDirectItems(root) {
  return Array.from(root?.children || []).filter(child => child.classList?.contains('sf-tree-item'));
}

function getItemLabel(item) {
  return getItemContainer(item)?.querySelector?.(':scope > .sf-tree-item-name')?.textContent?.replace(/\s+/g, ' ')?.trim() || '';
}

function getVisibleItems(root) {
  const result = [];

  const visit = (items, visible = true) => {
    items.forEach(item => {
      if (!visible) return;
      result.push(item);
      visit(getNestedItems(item), item.classList.contains('open'));
    });
  };

  visit(getDirectItems(root));
  return result;
}

function setTabStop(root, item, focus = false) {
  const visible = getVisibleItems(root);
  const next = visible.includes(item) ? item : visible[0] || null;
  root.querySelectorAll(TREE_ITEM_SELECTOR).forEach(candidate => {
    candidate.tabIndex = candidate === next ? 0 : -1;
  });
  if (focus) next?.focus?.();
  return next;
}

function isBranch(item) {
  return getNestedItems(item).length > 0;
}

function getToggleButton(item) {
  const container = getItemContainer(item);
  return container?.querySelector?.(':scope > .sf-icon-button') || null;
}

function getButtonIcon(item) {
  return getToggleButton(item)?.querySelector?.('.sf-icon') || null;
}

function getChevronIcon(item) {
  const container = getItemContainer(item);
  return container?.querySelector?.(':scope > .sf-tree-chevron .sf-icon') || null;
}

function getOpenIcon(item) {
  return item.getAttribute('data-open-icon') || 'folder_open';
}

function getClosedIcon(item) {
  return item.getAttribute('data-closed-icon') || 'folder';
}

function setIconText(icon, value) {
  if (icon) {
    icon.textContent = value;
  }
}

function syncTreeItem(item) {
  if (!(item instanceof HTMLElement)) return;
  const branch = isBranch(item);
  const open = item.classList.contains('open') || item.hasAttribute('open');
  const activeOpen = branch && open;
  const button = getToggleButton(item);
  item.classList.toggle('has-children', branch);
  item.classList.toggle('open', activeOpen);
  item.toggleAttribute('open', activeOpen);

  if (branch) {
    item.setAttribute('aria-expanded', String(activeOpen));
  } else {
    item.removeAttribute('aria-expanded');
  }

  item.setAttribute('role', 'treeitem');
  const group = Array.from(item.children || []).find(child => child.classList?.contains('sf-tree-group'));
  group?.setAttribute('role', 'group');

  if (button) {
    button.type = button.getAttribute('type') || 'button';
    button.setAttribute('aria-expanded', branch ? String(activeOpen) : 'false');
    button.toggleAttribute('disabled', !branch);
  }

  setIconText(getButtonIcon(item), activeOpen ? getOpenIcon(item) : getClosedIcon(item));
  setIconText(getChevronIcon(item), activeOpen ? 'keyboard_arrow_down' : 'chevron_right');
}

function syncTree(root) {
  if (isSmartTreeRoot(root)) return;
  root.querySelectorAll(TREE_ITEM_SELECTOR).forEach(syncTreeItem);
  const current = root.querySelector(`${TREE_ITEM_SELECTOR}[tabindex="0"]`);
  setTabStop(root, current);
}

function setTreeItemOpen(item, open = true) {
  if (!(item instanceof HTMLElement) || !isBranch(item)) return false;
  item.classList.toggle('open', open);
  item.toggleAttribute('open', open);
  syncTreeItem(item);
  item.dispatchEvent(new CustomEvent('sf-tree:toggle', {
    bubbles: true,
    detail: {
      item,
      open
    }
  }));
  return true;
}

function toggleTreeItem(item) {
  return setTreeItemOpen(item, !item.classList.contains('open'));
}

function activateTreeItem(item) {
  if (!item || item.matches('.disabled, [aria-disabled="true"]')) return;
  const name = getItemContainer(item)?.querySelector?.(':scope > .sf-tree-item-name');

  if (name?.matches?.('a[href]')) {
    name.click();
    return;
  }

  item.dispatchEvent(new CustomEvent('sf-tree:activate', {
    bubbles: true,
    detail: {
      item,
      value: item.getAttribute('data-value') || ''
    }
  }));
}

function selectTreeItem(root, item) {
  const mode = root.getAttribute('data-selection') || 'none';

  if (!['single', 'multiple'].includes(mode)) {
    activateTreeItem(item);
    return;
  }

  const nextSelected = mode === 'multiple' ? item.getAttribute('aria-selected') !== 'true' : true;

  if (mode === 'single') {
    root.querySelectorAll(TREE_ITEM_SELECTOR).forEach(candidate => {
      const selected = candidate === item;
      candidate.classList.toggle('active', selected);
      candidate.setAttribute('aria-selected', String(selected));
    });
  } else {
    item.classList.toggle('active', nextSelected);
    item.setAttribute('aria-selected', String(nextSelected));
  }

  root.dispatchEvent(new CustomEvent('sf-tree:selection-change', {
    bubbles: true,
    detail: {
      item,
      selected: nextSelected,
      value: item.getAttribute('data-value') || ''
    }
  }));
}

function moveTreeTypeahead(root, item, key) {
  const previous = treeTypeahead.get(root) || {
    value: '',
    timer: null
  };
  clearTimeout(previous.timer);
  const value = `${previous.value}${key}`.toLocaleLowerCase();
  const timer = setTimeout(() => treeTypeahead.delete(root), 500);
  treeTypeahead.set(root, {
    value,
    timer
  });
  const visible = getVisibleItems(root);
  const start = Math.max(visible.indexOf(item), 0);
  const ordered = visible.slice(start + 1).concat(visible.slice(0, start + 1));
  const match = ordered.find(candidate => getItemLabel(candidate).toLocaleLowerCase().startsWith(value));
  if (match) setTabStop(root, match, true);
}

function handleTreeKeydown(root, event) {
  const item = event.target.closest?.(TREE_ITEM_SELECTOR);
  if (!item || !root.contains(item)) return;
  const visible = getVisibleItems(root);
  const index = visible.indexOf(item);
  if (index < 0) return;
  let target = null;
  let handled = true;

  switch (event.key) {
    case 'ArrowDown':
      target = visible[Math.min(index + 1, visible.length - 1)];
      break;

    case 'ArrowUp':
      target = visible[Math.max(index - 1, 0)];
      break;

    case 'Home':
      target = visible[0];
      break;

    case 'End':
      target = visible[visible.length - 1];
      break;

    case 'ArrowRight':
      {
        const children = getNestedItems(item);

        if (children.length && !item.classList.contains('open')) {
          setTreeItemOpen(item, true);
        } else {
          target = children[0] || null;
        }

        break;
      }

    case 'ArrowLeft':
      if (isBranch(item) && item.classList.contains('open')) {
        setTreeItemOpen(item, false);
      } else {
        target = getParentItem(item, root);
      }

      break;

    case 'Enter':
      if (isBranch(item)) toggleTreeItem(item);else activateTreeItem(item);
      break;

    case ' ':
      selectTreeItem(root, item);
      break;

    default:
      handled = false;
  }

  if (!handled && event.key.length === 1 && !event.altKey && !event.metaKey) {
    moveTreeTypeahead(root, item, event.key);
    handled = true;
  }

  if (!handled) return;
  event.preventDefault();
  event.stopPropagation();
  if (target) setTabStop(root, target, true);
}

function bindTree(root) {
  if (!(root instanceof HTMLElement) || root.dataset[TREE_BOUND_FLAG] === '1' || isSmartTreeRoot(root)) {
    return;
  }

  root.setAttribute('role', root.getAttribute('role') || 'tree');

  if (root.getAttribute('data-selection') === 'multiple') {
    root.setAttribute('aria-multiselectable', 'true');
  } else {
    root.removeAttribute('aria-multiselectable');
  }

  syncTree(root);
  root.addEventListener('focusin', event => {
    const item = event.target.closest?.(TREE_ITEM_SELECTOR);
    if (item && root.contains(item)) setTabStop(root, item);
  });
  root.addEventListener('keydown', event => handleTreeKeydown(root, event));
  root.addEventListener('click', event => {
    const button = event.target.closest?.('.sf-icon-button');
    if (!button || !root.contains(button)) return;
    const item = button.closest(TREE_ITEM_SELECTOR);
    if (!item || !root.contains(item)) return;
    const container = getItemContainer(item);
    if (container && !container.contains(button)) return;
    toggleTreeItem(item);
    setTabStop(root, item);
  });
  root.dataset[TREE_BOUND_FLAG] = '1';
}

function initTree(target = document) {
  if (!(target instanceof Element) && target !== document) return;

  if (target instanceof Element && target.matches?.(TREE_SELECTOR)) {
    bindTree(target);
  }

  target.querySelectorAll?.(TREE_SELECTOR).forEach(bindTree);
}

class Tree extends _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__.ComponentObserver {
  static componentName = 'Tree';
  html = null;
}

(0,_register_helper__WEBPACK_IMPORTED_MODULE_1__["default"])('Tree', Tree);

if (typeof window !== 'undefined') {
  window.SF = window.SF || {};
  window.SF.Tree = window.SF.Tree || {};
  window.SF.Tree.init = initTree;
  window.SF.Tree.sync = syncTree;

  window.SF.Tree.open = item => setTreeItemOpen(item, true);

  window.SF.Tree.close = item => setTreeItemOpen(item, false);

  window.SF.Tree.toggle = toggleTreeItem;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initTree(document));
} else {
  initTree(document);
}

const treeObserver = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (!(node instanceof Element)) return;
      initTree(node);
      const tree = node.closest?.(TREE_SELECTOR);

      if (tree && !isSmartTreeRoot(tree)) {
        syncTree(tree);
      }
    });
  });
});
treeObserver.observe(document.documentElement, {
  childList: true,
  subtree: true
});


/***/ },

/***/ "bd12fe10a7e1"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _tree__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("3eb8861071f8");


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

/***/ "caacbb3de1c1"
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
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("caacbb3de1c1");
/* harmony import */ var _js_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("bd12fe10a7e1");


})();

/******/ })()
;