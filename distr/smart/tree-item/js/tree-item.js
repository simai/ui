/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "11057d00e2b0"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("fbe0570fcc69");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("26d4ed181d97");
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("0d662e4d7d63");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _js_templates_default__WEBPACK_IMPORTED_MODULE_1__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_2__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _js_templates_default__WEBPACK_IMPORTED_MODULE_1__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_core_js_page_language__WEBPACK_IMPORTED_MODULE_2__);


 // Every word this component says, in the languages it ships with. A product
// adds any other through SF.language.register("sf-tree-item", code, words).

const TREE_ITEM_TEXT = {
  en: {
    openLabel: 'Open item',
    closeLabel: 'Close item'
  },
  ru: {
    openLabel: 'Развернуть',
    closeLabel: 'Свернуть'
  }
};

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
    type: node.getAttribute('type') || '',
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
}

class SfTreeItem extends (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()) {
  static contentTemplateSlot = '__content';

  static get props() {
    return {
      templateName: {
        attribute: 'template',
        default: 'default'
      },
      label: {
        default: ''
      },
      text: {
        default: ''
      },
      href: {
        default: ''
      },
      target: {
        default: ''
      },
      rel: {
        default: ''
      },
      // The axis is called kind, because that is the question it answers.
      // `type` keeps working: see contracts/public-api-axes.json.
      kind: {
        default: 'folder',
        values: ['folder', 'file'],
        aliases: ['type']
      },
      value: {
        default: ''
      },
      open: {
        type: Boolean,
        default: false
      },
      selected: {
        type: Boolean,
        default: false
      },
      active: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      itemsData: {
        type: Array,
        default: []
      },
      openIcon: {
        attribute: 'open-icon',
        default: 'folder_open'
      },
      closedIcon: {
        attribute: 'closed-icon',
        default: 'folder'
      },
      icon: {
        type: Boolean,
        default: true
      },
      chevronOpenIcon: {
        attribute: 'chevron-open-icon',
        default: 'keyboard_arrow_down'
      },
      chevronClosedIcon: {
        attribute: 'chevron-closed-icon',
        default: 'chevron_right'
      },
      openLabel: {
        attribute: 'open-label',
        default: 'Open item'
      },
      closeLabel: {
        attribute: 'close-label',
        default: 'Close item'
      },
      rootClass: {
        default: ''
      },
      itemClass: {
        attribute: 'item-class',
        default: ''
      },
      containerClass: {
        attribute: 'container-class',
        default: ''
      },
      nameClass: {
        attribute: 'name-class',
        default: ''
      }
    };
  }

  constructor() {
    super();
    this._itemObserver = null;
    this._itemsData = [];
    this._itemsDataProp = [];
    this._sourceData = null;
  }

  connectedCallback() {
    if (!this.__treeItemSourceCaptured) {
      this.captureSourceData();
      this.captureInitialContent();
      this.captureInitialItems();
      this.__treeItemSourceCaptured = true;
    }

    this.observeChildItems();
    super.connectedCallback();
  }

  disconnectedCallback() {
    this.disconnectItemObserver();
    super.disconnectedCallback();
  }

  observeChildItems() {
    if (this._itemObserver) {
      return;
    }

    this._itemObserver = new MutationObserver(mutations => {
      const hasNewItems = mutations.some(mutation => Array.from(mutation.addedNodes || []).some(isTreeItemNode));

      if (!hasNewItems || !this.captureInitialItems(true)) {
        return;
      }

      this.requestComponentUpdate('children');
    });

    this._itemObserver.observe(this, {
      childList: true
    });
  }

  disconnectItemObserver() {
    this._itemObserver?.disconnect?.();
    this._itemObserver = null;
  }

  isContentNode(node) {
    if (!node || isTreeItemNode(node)) {
      return false;
    }

    if (node.nodeType === Node.TEXT_NODE) {
      return String(node.textContent || '').trim() !== '';
    }

    return node.nodeType === Node.ELEMENT_NODE;
  }

  captureSourceData() {
    if (this._sourceData) {
      return this._sourceData;
    }

    const children = Array.from(this.children || []).filter(isTreeItemNode).map(treeItemNodeToData);
    this._sourceData = {
      label: this.getAttribute('label') || this.getAttribute('text') || this.getAttribute('title') || getDirectLabel(this),
      href: this.getAttribute('href') || '',
      target: this.getAttribute('target') || '',
      rel: this.getAttribute('rel') || '',
      type: this.getAttribute('type') || '',
      value: this.getAttribute('value') || '',
      open: this.hasAttribute('open'),
      selected: this.hasAttribute('selected'),
      active: this.hasAttribute('active'),
      disabled: this.hasAttribute('disabled'),
      openIcon: this.getAttribute('open-icon') || '',
      closedIcon: this.getAttribute('closed-icon') || '',
      icon: !this.hasAttribute('icon') || this.getAttribute('icon') !== 'false',
      chevronOpenIcon: this.getAttribute('chevron-open-icon') || '',
      chevronClosedIcon: this.getAttribute('chevron-closed-icon') || '',
      openLabel: this.getAttribute('open-label') || '',
      closeLabel: this.getAttribute('close-label') || '',
      children
    };
    return this._sourceData;
  }

  captureInitialContent() {
    if (this._slotTemplates.has(this.constructor.contentTemplateSlot)) {
      return false;
    }

    return this.captureChildTemplates(this.constructor.contentTemplateSlot, node => this.isContentNode(node)).length > 0;
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

  get hasChildren() {
    return !this.isFile && this.childItems.length > 0;
  }

  get content() {
    return this.getSlotContent(this.constructor.contentTemplateSlot);
  }

  get itemsData() {
    return this._itemsDataProp;
  }

  set itemsData(value) {
    this._itemsDataProp = Array.isArray(value) ? value : [];
    if (this._isMounted) this.requestComponentUpdate('items-data');
  }

  get childItems() {
    if (this.isFile) {
      return [];
    }

    const propItems = this.itemsData;
    return Array.isArray(propItems) && propItems.length ? propItems : this._itemsData;
  }

  get label() {
    return this.getProp('label') || this.getProp('text') || this._sourceData?.label || '';
  }

  get kind() {
    return this.getProp('kind') || this._sourceData?.type || 'folder';
  } // The legacy name, kept so a consumer reading el.type still gets an answer.


  get type() {
    return this.kind;
  }

  get isFile() {
    return this.type === 'file';
  }

  toTreeItemData() {
    const sourceData = this.captureSourceData();
    return { ...sourceData,
      label: this.label,
      href: this.getProp('href') || sourceData.href || '',
      target: this.getProp('target') || sourceData.target || '',
      rel: this.getProp('rel') || sourceData.rel || '',
      type: this.type,
      value: this.getProp('value') || sourceData.value || '',
      open: this.getProp('open') || sourceData.open || false,
      selected: this.getProp('selected') || sourceData.selected || false,
      active: this.getProp('active') || sourceData.active || false,
      disabled: this.getProp('disabled') || sourceData.disabled || false,
      openIcon: this.getProp('openIcon') || sourceData.openIcon || '',
      closedIcon: this.getProp('closedIcon') || sourceData.closedIcon || '',
      icon: this.getProp('icon'),
      chevronOpenIcon: this.getProp('chevronOpenIcon') || sourceData.chevronOpenIcon || '',
      chevronClosedIcon: this.getProp('chevronClosedIcon') || sourceData.chevronClosedIcon || '',
      openLabel: this.getProp('openLabel') || sourceData.openLabel || '',
      closeLabel: this.getProp('closeLabel') || sourceData.closeLabel || '',
      children: this.isFile ? [] : this.childItems.length ? this.childItems : sourceData.children || []
    };
  }

  templateContext() {
    const props = this.getPropsContext();
    return this.createTemplateContext({ ...props,
      openLabel: this.getAttribute("open-label") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_2__.pageText)(TREE_ITEM_TEXT, "openLabel", this),
      closeLabel: this.getAttribute("close-label") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_2__.pageText)(TREE_ITEM_TEXT, "closeLabel", this),
      component: this,
      label: this.label,
      content: this.content,
      type: this.type,
      isFile: this.isFile,
      children: this.childItems,
      hasChildren: this.hasChildren,
      rootClass: this.getRootClass(),
      rootStyle: this.getRootStyle(),
      onToggle: this.handleToggle,
      onItemClick: this.handleItemClick
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_1__.renderTreeItemTemplate)(this.templateContext());
  }

  getTreeItemControl() {
    return this.querySelector(':scope > .sf-tree-item[role="treeitem"]');
  }

  getRenderedChildItems() {
    return Array.from(this.querySelectorAll(':scope > .sf-tree-item > .sf-tree-group > sf-tree-item'));
  }

  setTabStop(active = false) {
    const control = this.getTreeItemControl();
    if (control) control.tabIndex = active ? 0 : -1;
    return this;
  }

  focusItem() {
    this.getTreeItemControl()?.focus?.();
    return this;
  }

  activate() {
    if (this.getProp('disabled')) return this;
    const link = this.querySelector(':scope > .sf-tree-item > .sf-tree-item-container > a[href]');

    if (link) {
      link.click();
      return this;
    }

    this.emitComponentEvent('tree-item-click', {
      item: this,
      value: this.getProp('value'),
      originalEvent: null
    });
    return this;
  }

  setOpen(open = true) {
    const nextOpen = Boolean(open);

    if (this.isFile || !this.hasChildren || this.getProp('disabled')) {
      return this;
    }

    if (this.getProp('open') === nextOpen) {
      return this;
    }

    this.toggleAttribute('open', nextOpen);
    this.emitComponentEvent('tree-item-toggle', {
      item: this,
      open: nextOpen,
      value: this.getProp('value')
    });
    return this;
  }

  open() {
    return this.setOpen(true);
  }

  close() {
    return this.setOpen(false);
  }

  toggle() {
    return this.setOpen(!this.getProp('open'));
  }

  onToggle(handler, options) {
    if (typeof handler === 'function') {
      this.addEventListener('sf-tree-item-toggle', event => {
        handler(event.detail?.open, event.detail, event);
      }, options);
    }

    return this;
  }

  handleToggle = event => {
    event.preventDefault();
    event.stopPropagation();
    this.toggle();
  };
  handleItemClick = event => {
    if (this.getProp('disabled')) {
      event.preventDefault();
      return;
    }

    this.emitComponentEvent('tree-item-click', {
      item: this,
      value: this.getProp('value'),
      originalEvent: event
    });
  };
}

SfTreeItem.define('sf-tree-item');
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "26d4ed181d97"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderTreeItemTemplate: () => (/* binding */ renderTreeItemTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ddf1cdb42ecc");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);


function joinClasses(...tokens) {
  return tokens.flat().filter(Boolean).join(' ');
} // Regular, not filled. A filled glyph was how a tree's icons carried their
// weight while they were painted at a quarter strength; at full strength the
// fill is a solid block beside a regular name, which is heavier than anything
// else in the row (owner, 2026-10-08).


function renderIcon(icon, className = '') {
  if (!icon) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <sf-icon icon=${icon} class=${className || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}></sf-icon>
  `;
}

function renderLabel(context) {
  if (context.label) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span>${context.label}</span>`;
  }

  return context.content !== lit__WEBPACK_IMPORTED_MODULE_0__.nothing ? context.content : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
}

function renderTreeItemData(item = {}) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <sf-tree-item
      label=${item.label || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      href=${item.href || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      target=${item.target || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      rel=${item.rel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      type=${item.type || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
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

function renderTreeItemTemplate(context) {
  const itemClasses = joinClasses('sf-tree-item flex flex-col', context.type ? `sf-tree-item--${context.kind ?? context.type}` : '', context.open ? 'open' : '', context.hasChildren ? 'has-children' : '', context.selected || context.active ? 'active' : '', context.disabled ? 'disabled' : '', context.rootClass, context.itemClass);
  const containerClasses = joinClasses('sf-tree-item-container flex items-cross-center relative', context.containerClass);
  const nameClasses = joinClasses('sf-tree-item-name', context.nameClass);
  const nodeIcon = context.open ? context.openIcon : context.closedIcon;
  const chevronIcon = context.open ? context.chevronOpenIcon : context.chevronClosedIcon;
  const canToggle = !context.isFile && context.hasChildren;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div
      class=${itemClasses}
      style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      role="treeitem"
      tabindex="-1"
      aria-expanded=${canToggle ? String(context.open) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      aria-selected=${String(Boolean(context.selected))}
      aria-current=${context.active ? 'page' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      aria-disabled=${context.disabled ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      data-open-icon=${context.openIcon || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      data-closed-icon=${context.closedIcon || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      data-value=${context.value || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    >
      <div class=${containerClasses}>
        ${canToggle ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
              <button
                type="button"
                tabindex="-1"
                class="sf-icon-button sf-tree-toggle"
                ?disabled=${context.disabled}
                aria-expanded=${String(context.open)}
                aria-label=${context.open ? context.closeLabel : context.openLabel}
                @click=${context.onToggle}
              >
                ${renderIcon(chevronIcon, 'sf-tree-chevron')}
              </button>
            ` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-tree-toggle-spacer" aria-hidden="true"></span>`}
        ${context.icon ? context.isFile ? renderIcon('draft', 'sf-tree-node-icon') : renderIcon(nodeIcon, 'sf-tree-node-icon') : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}

        ${context.href && !context.disabled ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
              <a
                class=${nameClasses}
                href=${context.href}
                target=${context.target || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                rel=${context.rel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                tabindex="-1"
                @click=${context.onItemClick}
              >
                ${renderLabel(context)}
              </a>
            ` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
              <span class=${nameClasses} @click=${context.onItemClick}>
                ${renderLabel(context)}
              </span>
            `}
      </div>

      ${context.open && canToggle ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
            <div class="sf-tree-group flex flex-col" role="group">
              ${(context.children || []).map(item => renderTreeItemData(item))}
            </div>
          ` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    </div>
  `;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "ddf1cdb42ecc"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit") : new Promise((resolve) => globalThis.addEventListener("sf-runtime-ready", () => resolve(globalThis.SF.runtimeModule("lit")), { once: true })));

/***/ },

/***/ "0d662e4d7d63"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("page-language") : new Promise((resolve) => globalThis.addEventListener("sf-runtime-ready", () => resolve(globalThis.SF.runtimeModule("page-language")), { once: true })));

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
/******/ 	let __webpack_exports__ = __webpack_require__("11057d00e2b0");
/******/
/******/ })()
;