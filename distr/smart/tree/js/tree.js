/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "cea13a5dfcb6"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("fbe0570fcc69");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("d9bd94b9a408");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _js_templates_default__WEBPACK_IMPORTED_MODULE_1__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _js_templates_default__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);



function isTreeItemNode(node) {
  return node?.nodeType === Node.ELEMENT_NODE && node?.tagName?.toLowerCase?.() === 'sf-tree-item';
}

function getDirectLabel(node) {
  return Array.from(node?.childNodes || []).filter(child => !isTreeItemNode(child)).map(child => child.textContent || '').join(' ').replace(/\s+/g, ' ').trim();
}

function treeItemNodeToData(node) {
  if (typeof node?.toTreeItemData === 'function') {
    return node.toTreeItemData();
  }

  const children = Array.from(node?.children || []).filter(isTreeItemNode).map(treeItemNodeToData);
  return {
    label: node.getAttribute('label') || node.getAttribute('text') || node.getAttribute('title') || getDirectLabel(node),
    href: node.getAttribute('href') || '',
    target: node.getAttribute('target') || '',
    rel: node.getAttribute('rel') || '',
    type: node.getAttribute('kind') || node.getAttribute('type') || '',
    value: node.getAttribute('value') || '',
    open: node.hasAttribute('open'),
    selected: node.hasAttribute('selected'),
    active: node.hasAttribute('active'),
    disabled: node.hasAttribute('disabled'),
    openIcon: node.getAttribute('open-icon') || '',
    closedIcon: node.getAttribute('closed-icon') || '',
    icon: !node.hasAttribute('icon') || node.getAttribute('icon') !== 'false',
    chevronOpenIcon: node.getAttribute('chevron-open-icon') || '',
    chevronClosedIcon: node.getAttribute('chevron-closed-icon') || '',
    openLabel: node.getAttribute('open-label') || '',
    closeLabel: node.getAttribute('close-label') || '',
    children
  };
} // An item given as data answers the same questions a node does, and falls back
// the same way where it says nothing.


function normalizeTreeItemData(item) {
  if (!item || typeof item !== 'object') return null;
  const children = Array.isArray(item.children) ? item.children.map(child => normalizeTreeItemData(child)).filter(Boolean) : [];
  return {
    label: String(item.label ?? item.text ?? item.title ?? ''),
    href: item.href ? String(item.href) : '',
    target: item.target ? String(item.target) : '',
    rel: item.rel ? String(item.rel) : '',
    // `kind` is the axis (port and manifest); `type` the legacy name.
    type: item.kind || item.type ? String(item.kind || item.type) : '',
    value: item.value === undefined || item.value === null ? '' : String(item.value),
    open: Boolean(item.open),
    selected: Boolean(item.selected),
    active: Boolean(item.active),
    disabled: Boolean(item.disabled),
    openIcon: item.openIcon ? String(item.openIcon) : '',
    closedIcon: item.closedIcon ? String(item.closedIcon) : '',
    icon: item.icon !== false,
    chevronOpenIcon: item.chevronOpenIcon ? String(item.chevronOpenIcon) : '',
    chevronClosedIcon: item.chevronClosedIcon ? String(item.chevronClosedIcon) : '',
    openLabel: item.openLabel ? String(item.openLabel) : '',
    closeLabel: item.closeLabel ? String(item.closeLabel) : '',
    children
  };
} // What a list writes when its rows are dragged: {ids, source}.


const RECORDS_TYPE = 'application/x-sf-records+json';

class SfTree extends (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()) {
  static get props() {
    return {
      templateName: {
        attribute: 'template',
        default: 'default'
      },
      rootClass: {
        default: ''
      },
      ariaLabel: {
        attribute: 'aria-label',
        default: ''
      },
      role: {
        default: 'tree',
        values: ['tree']
      },
      selection: {
        default: 'none',
        values: ['none', 'single', 'multiple']
      },
      acceptRecords: {
        attribute: 'accept-records',
        type: Boolean,
        default: false
      },
      acceptFiles: {
        attribute: 'accept-files',
        type: Boolean,
        default: false
      }
    };
  }

  constructor() {
    super();
    this._itemObserver = null;
    this._itemsData = [];
    this._tabStopItem = null;
    this._typeahead = '';
    this._typeaheadTimer = null;
  } // A node takes what is dropped on it (owner, 2026-10-15, the file manager):
  // records dragged from a list -- `accept-records` -- and files from the
  // computer -- `accept-files`. The tree moves and uploads nothing itself; it
  // says where the drop landed: sf-tree-records-drop {value, ids, source} and
  // sf-tree-files-drop {value, files}. The records travel as
  // application/x-sf-records+json, which sf-table writes for its rows.


  dropKind(event) {
    const types = [...(event.dataTransfer?.types ?? [])];
    if (this.hasAttribute('accept-records') && types.includes(RECORDS_TYPE)) return 'records';
    if (this.hasAttribute('accept-files') && types.includes('Files')) return 'files';
    return null;
  }

  dropNode(event) {
    const node = event.target?.closest?.('.sf-tree-item[data-value]');
    return node && this.contains(node) && node.getAttribute('aria-disabled') !== 'true' ? node : null;
  }

  markDropTarget(node) {
    if (this._dropTarget === node) return;
    this._dropTarget?.removeAttribute('data-sf-drop-target');
    this._dropTarget = node;
    node?.setAttribute('data-sf-drop-target', '');
  }

  handleTreeDragOver = event => {
    const kind = this.dropKind(event);
    const node = kind ? this.dropNode(event) : null;

    if (!node) {
      this.markDropTarget(null);
      return;
    }

    event.preventDefault();
    event.dataTransfer.dropEffect = kind === 'files' ? 'copy' : 'move';
    this.markDropTarget(node);
  };
  handleTreeDragLeave = event => {
    if (!this.contains(event.relatedTarget)) this.markDropTarget(null);
  };
  handleTreeDrop = event => {
    const kind = this.dropKind(event);
    const node = kind ? this.dropNode(event) : null;
    this.markDropTarget(null);
    if (!node) return;
    event.preventDefault();
    const value = node.dataset.value;

    if (kind === 'files') {
      this.dispatchEvent(new CustomEvent('sf-tree-files-drop', {
        bubbles: true,
        composed: true,
        detail: {
          value,
          files: [...event.dataTransfer.files]
        }
      }));
      return;
    }

    let payload = {};

    try {
      payload = JSON.parse(event.dataTransfer.getData(RECORDS_TYPE) || '{}');
    } catch {
      payload = {};
    }

    const ids = Array.isArray(payload.ids) ? payload.ids.map(String) : [];
    if (!ids.length) return;
    this.dispatchEvent(new CustomEvent('sf-tree-records-drop', {
      bubbles: true,
      composed: true,
      detail: {
        value,
        ids,
        source: payload.source ?? null
      }
    }));
  };

  connectedCallback() {
    this.addEventListener('dragover', this.handleTreeDragOver);
    this.addEventListener('dragleave', this.handleTreeDragLeave);
    this.addEventListener('drop', this.handleTreeDrop);
    this.addEventListener('keydown', this.handleTreeKeydown);
    this.addEventListener('focusin', this.handleTreeFocusIn);
    this.addEventListener('click', this.handleTreeClick);
    this.addEventListener('sf-after-render', this.handleAfterRender);
    this.observeItemChildren();
    this.captureInitialItems();
    super.connectedCallback();
  }

  disconnectedCallback() {
    this.removeEventListener('dragover', this.handleTreeDragOver);
    this.removeEventListener('dragleave', this.handleTreeDragLeave);
    this.removeEventListener('drop', this.handleTreeDrop);
    this.markDropTarget(null);
    this.removeEventListener('keydown', this.handleTreeKeydown);
    this.removeEventListener('focusin', this.handleTreeFocusIn);
    this.removeEventListener('click', this.handleTreeClick);
    this.removeEventListener('sf-after-render', this.handleAfterRender);
    clearTimeout(this._typeaheadTimer);
    this.disconnectItemObserver();
    super.disconnectedCallback();
  }

  observeItemChildren() {
    if (this._itemObserver) {
      return;
    }

    this._itemObserver = new MutationObserver(mutations => {
      const hasNewItems = mutations.some(mutation => Array.from(mutation.addedNodes || []).some(isTreeItemNode));

      if (!hasNewItems || !this.captureInitialItems(true)) {
        return;
      }

      this.requestComponentUpdate('items');
    });

    this._itemObserver.observe(this, {
      childList: true
    });
  }

  disconnectItemObserver() {
    this._itemObserver?.disconnect?.();
    this._itemObserver = null;
  }

  captureInitialItems(append = false) {
    const nodes = Array.from(this.childNodes || []).filter(isTreeItemNode);

    if (!nodes.length) {
      return false;
    }

    const nextItems = nodes.map(treeItemNodeToData);
    this._itemsData = append ? [...this._itemsData, ...nextItems] : nextItems;
    nodes.forEach(node => node.remove());
    return true;
  }

  get items() {
    return this._itemsData;
  } // Whether anything in this tree can be opened. A leaf keeps the chevron's
  // column so its name lines up with the branches beside it; where there are no
  // branches, that column is an indent nobody chose.


  get hasBranches() {
    const anyChildren = items => (items ?? []).some(item => (item?.children ?? []).length > 0 || anyChildren(item?.children));

    return anyChildren(this._itemsData) || this.getRenderedItems().some(item => item.hasChildren);
  } // Items may also arrive as data. The tree reads its `sf-tree-item` children
  // once and removes them, and watches only for children appearing -- so a
  // parent that re-renders a changed item changes a node the tree no longer
  // holds, and the tree goes on drawing the name it read at the start. A
  // section renamed in a record's arranging mode kept its old name in the list
  // beside the fields for exactly that reason. The same seam sf-dropdown has
  // for its options, and for the same reason: a parent rendering from a
  // template cannot put a changed list back through children it no longer owns.


  set items(value) {
    const next = Array.isArray(value) ? value.map(item => normalizeTreeItemData(item)) : [];
    this._itemsData = next.filter(Boolean);
    this.requestComponentUpdate('items');
  }

  getRenderedItems() {
    return Array.from(this.querySelectorAll('sf-tree-item')).filter(item => item.closest('sf-tree') === this);
  }

  getVisibleItems() {
    return this.getRenderedItems();
  }

  getEventItem(event) {
    const item = event.target?.closest?.('sf-tree-item');
    return item?.closest?.('sf-tree') === this ? item : null;
  }

  getParentItem(item) {
    const parent = item?.parentElement?.closest?.('sf-tree-item');
    return parent?.closest?.('sf-tree') === this ? parent : null;
  }

  setTabStop(item, focus = false) {
    const visible = this.getVisibleItems();
    const next = visible.includes(item) ? item : visible[0] || null;
    this.getRenderedItems().forEach(candidate => {
      candidate.setTabStop?.(candidate === next);
    });
    this._tabStopItem = next;
    if (focus) next?.focusItem?.();
    return next;
  }

  syncTabStop(fallbackItem = null) {
    const visible = this.getVisibleItems();
    const selection = this.getProp('selection');
    this.getRenderedItems().forEach(item => {
      const control = item.getTreeItemControl?.();
      if (!control) return;
      if (selection === 'none') control.removeAttribute('aria-selected');else control.setAttribute('aria-selected', String(item.hasAttribute('selected')));
    });
    const current = visible.find(item => item.getTreeItemControl?.()?.tabIndex === 0);
    const focused = visible.find(item => item.getTreeItemControl?.() === document.activeElement);
    const preferred = visible.find(item => item.hasAttribute('selected') || item.hasAttribute('active'));
    return this.setTabStop(focused || preferred || (visible.includes(this._tabStopItem) ? this._tabStopItem : null) || current || (visible.includes(fallbackItem) ? fallbackItem : null) || visible[0] || null);
  }

  selectItem(item) {
    const mode = this.getProp('selection');

    if (!['single', 'multiple'].includes(mode)) {
      item.activate?.();
      return;
    }

    const nextSelected = mode === 'multiple' ? !item.getProp('selected') : true;

    if (mode === 'single') {
      this.getRenderedItems().forEach(candidate => {
        candidate.toggleAttribute('selected', candidate === item);
      });
    } else {
      item.toggleAttribute('selected', nextSelected);
    }

    this.emitComponentEvent('tree-selection-change', {
      item,
      selected: nextSelected,
      value: item.getProp('value')
    });
  }

  moveTypeahead(item, key) {
    clearTimeout(this._typeaheadTimer);
    this._typeahead += key.toLocaleLowerCase();
    this._typeaheadTimer = setTimeout(() => {
      this._typeahead = '';
    }, 500);
    const visible = this.getVisibleItems();
    const start = Math.max(visible.indexOf(item), 0);
    const ordered = visible.slice(start + 1).concat(visible.slice(0, start + 1));
    const match = ordered.find(candidate => String(candidate.label || '').trim().toLocaleLowerCase().startsWith(this._typeahead));
    if (match) this.setTabStop(match, true);
  }

  handleAfterRender = event => {
    const fallback = event.target?.tagName?.toLowerCase?.() === 'sf-tree-item' ? event.target : null;
    queueMicrotask(() => this.syncTabStop(fallback));
  };
  handleTreeFocusIn = event => {
    const item = this.getEventItem(event);
    if (item) this.setTabStop(item);
  }; // A press selects, the way the space bar does. Only the tab stop moved before,
  // so a tree asked for a single selection answered the keyboard and not the
  // pointer: a list of destinations could be walked with the arrows and chosen
  // with the space bar, and clicking one did nothing at all. The chevron stops
  // its own press, so opening a branch is still not choosing it.

  handleTreeClick = event => {
    const item = this.getEventItem(event);
    if (!item) return;
    this.setTabStop(item);
    if (item.getProp?.('disabled')) return;
    const mode = this.getProp('selection');
    if (mode === 'single' || mode === 'multiple') this.selectItem(item);
  };
  handleTreeKeydown = event => {
    const item = this.getEventItem(event);
    if (!item) return;
    const visible = this.getVisibleItems();
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
          const children = item.getRenderedChildItems?.() || [];
          if (item.hasChildren && !item.getProp('open')) item.open();else target = children[0] || null;
          break;
        }

      case 'ArrowLeft':
        if (item.hasChildren && item.getProp('open')) item.close();else target = this.getParentItem(item);
        break;

      case 'Enter':
        if (item.hasChildren) item.toggle();else item.activate?.();
        break;

      case ' ':
        this.selectItem(item);
        break;

      default:
        handled = false;
    }

    if (!handled && event.key.length === 1 && !event.altKey && !event.metaKey) {
      this.moveTypeahead(item, event.key);
      handled = true;
    }

    if (!handled) return;
    event.preventDefault();
    event.stopPropagation();
    if (target) this.setTabStop(target, true);
  };

  templateContext() {
    const props = this.getPropsContext();
    return this.createTemplateContext({ ...props,
      component: this,
      items: this.items,
      hasBranches: this.hasBranches,
      rootClass: this.getRootClass(),
      rootStyle: this.getRootStyle()
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_1__.renderTreeTemplate)(this.templateContext());
  }

  onToggle(handler, options) {
    if (typeof handler === 'function') {
      this.addEventListener('sf-tree-item-toggle', event => {
        handler(event.detail?.item, event.detail, event);
      }, options);
    }

    return this;
  }

}

SfTree.define('sf-tree');
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "d9bd94b9a408"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderTreeItemData: () => (/* binding */ renderTreeItemData),
/* harmony export */   renderTreeTemplate: () => (/* binding */ renderTreeTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ddf1cdb42ecc");
/* harmony import */ var _default_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("8a0d367d7d58");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);



function joinClasses(...tokens) {
  return tokens.flat().filter(Boolean).join(' ');
}

function renderTreeItemData(item = {}) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <sf-tree-item
      label=${item.label || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      href=${item.href || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      target=${item.target || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      rel=${item.rel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      kind=${item.type || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      value=${item.value || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      open-icon=${item.openIcon || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      closed-icon=${item.closedIcon || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      chevron-open-icon=${item.chevronOpenIcon || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      chevron-closed-icon=${item.chevronClosedIcon || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      open-label=${item.openLabel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      close-label=${item.closeLabel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      icon=${item.icon === false ? 'false' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      ?open=${Boolean(item.open)}
      ?selected=${Boolean(item.selected)}
      ?active=${Boolean(item.active)}
      ?disabled=${Boolean(item.disabled)}
      .itemsData=${item.children || []}
    ></sf-tree-item>
  `;
}
function renderTreeTemplate(context) {
  const rootClasses = joinClasses('sf-tree flex flex-col', context.rootClass);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div
      class=${rootClasses}
      style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      role=${context.role || 'tree'}
      data-sf-tree-flat=${context.hasBranches ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : 'true'}
      aria-label=${context.ariaLabel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      aria-multiselectable=${context.selection === 'multiple' ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    >
      ${(context.items || []).map(item => renderTreeItemData(item))}
    </div>
  `;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "8a0d367d7d58"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "ddf1cdb42ecc"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit") : new Promise((resolve) => globalThis.addEventListener("sf-runtime-ready", () => resolve(globalThis.SF.runtimeModule("lit")), { once: true })));

/***/ },

/***/ "fbe0570fcc69"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("smart-base") : new Promise((resolve) => globalThis.addEventListener("sf-runtime-ready", () => resolve(globalThis.SF.runtimeModule("smart-base")), { once: true })));

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
/******/ 	/* webpack/runtime/async module */
/******/ 	(() => {
/******/ 		const hasSymbol = typeof Symbol === "function";
/******/ 		const webpackQueues = hasSymbol ? Symbol("webpack queues") : "__webpack_queues__";
/******/ 		const webpackExports = hasSymbol ? Symbol("webpack exports") : "__webpack_exports__";
/******/ 		const webpackError = hasSymbol ? Symbol("webpack error") : "__webpack_error__";
/******/
/******/ 		const resolveQueue = (queue) => {
/******/ 			if(queue?.d < 1) {
/******/ 				queue.d = 1;
/******/ 				queue.forEach((fn) => (fn.r--));
/******/ 				queue.forEach((fn) => (fn.r-- ? fn.r++ : fn()));
/******/ 			}
/******/ 		}
/******/ 		const wrapDeps = (deps) => (deps.map((dep) => {
/******/ 			if(dep !== null && typeof dep === "object") {
/******/
/******/ 				if(dep[webpackQueues]) return dep;
/******/ 				if(dep.then) {
/******/ 					const queue = [];
/******/ 					queue.d = 0;
/******/ 					dep.then((r) => {
/******/ 						obj[webpackExports] = r;
/******/ 						resolveQueue(queue);
/******/ 					}, (e) => {
/******/ 						obj[webpackError] = e;
/******/ 						resolveQueue(queue);
/******/ 					});
/******/ 					const obj = {};
/******/
/******/ 					obj[webpackQueues] = (fn) => (fn(queue));
/******/ 					return obj;
/******/ 				}
/******/ 			}
/******/ 			const ret = {};
/******/ 			ret[webpackQueues] = x => {};
/******/ 			ret[webpackExports] = dep;
/******/ 			return ret;
/******/ 		}));
/******/ 		__webpack_require__.a = (module, body, hasAwait) => {
/******/ 			let queue;
/******/ 			hasAwait && ((queue = []).d = -1);
/******/ 			const depQueues = new Set();
/******/ 			const exports = module.exports;
/******/ 			let currentDeps;
/******/ 			let outerResolve;
/******/ 			let reject;
/******/ 			const promise = new Promise((resolve, rej) => {
/******/ 				reject = rej;
/******/ 				outerResolve = resolve;
/******/ 			});
/******/ 			promise[webpackExports] = exports;
/******/ 			promise[webpackQueues] = (fn) => (queue && fn(queue), depQueues.forEach(fn), promise["catch"](x => {}));
/******/ 			module.exports = promise;
/******/ 			const handle = (deps) => {
/******/ 				currentDeps = wrapDeps(deps);
/******/ 				let fn;
/******/ 				const getResult = () => (currentDeps.map((d) => {
/******/
/******/ 					if(d[webpackError]) throw d[webpackError];
/******/ 					return d[webpackExports];
/******/ 				}))
/******/ 				const promise = new Promise((resolve) => {
/******/ 					fn = () => (resolve(getResult));
/******/ 					fn.r = 0;
/******/ 					const fnQueue = (q) => (q !== queue && !depQueues.has(q) && (depQueues.add(q), q && !q.d && (fn.r++, q.push(fn))));
/******/ 					currentDeps.map((dep) => (dep[webpackQueues](fnQueue)));
/******/ 				});
/******/ 				return fn.r ? promise : getResult();
/******/ 			}
/******/ 			const done = (err) => ((err ? reject(promise[webpackError] = err) : outerResolve(exports)), resolveQueue(queue))
/******/ 			body(handle, done);
/******/ 			queue?.d < 0 && (queue.d = 0);
/******/ 		};
/******/ 	})();
/******/
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
/******/
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module used 'module' so it can't be inlined
/******/ 	let __webpack_exports__ = __webpack_require__("cea13a5dfcb6");
/******/
/******/ })()
;