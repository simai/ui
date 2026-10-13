/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "82e4cc4fa9ae"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("fbe0570fcc69");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("9f45ea897c46");
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("0d662e4d7d63");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _js_templates_default__WEBPACK_IMPORTED_MODULE_1__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_2__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _js_templates_default__WEBPACK_IMPORTED_MODULE_1__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_core_js_page_language__WEBPACK_IMPORTED_MODULE_2__);


 // Every word this component says, in the languages it ships with. A product
// adds any other through SF.language.register("sf-breadcrumbs", code, words).

const BREADCRUMBS_TEXT = {
  en: {
    ariaLabel: 'Breadcrumb',
    expandLabel: 'Show hidden breadcrumbs'
  },
  ru: {
    ariaLabel: 'Хлебные крошки',
    expandLabel: 'Показать скрытые крошки'
  }
};

function parseItemFlags(flagsPart = '') {
  const flags = String(flagsPart || '').split(',').map(flag => flag.trim()).filter(Boolean);
  const item = {};
  flags.forEach(flag => {
    const [rawKey, ...rawValue] = flag.split('=');
    const key = String(rawKey || '').trim().toLowerCase();
    const value = rawValue.join('=').trim();
    if (!key) return;

    if (['current', 'active', 'disabled', 'ellipsis'].includes(key)) {
      item[key] = value ? !['0', 'false', 'no'].includes(value.toLowerCase()) : true;
      return;
    }

    item[key] = value;
  });
  return item;
}

function normalizeItem(item = {}, index = 0, total = 0, options = {}) {
  if (typeof item === 'string') {
    return normalizeItem({
      label: item
    }, index, total, options);
  }

  const {
    defaultCurrent = true
  } = options;
  const label = item.label || item.text || item.title || '';
  const current = Boolean(item.current || item.active || defaultCurrent && index === total - 1);
  const ellipsis = Boolean(item.ellipsis || label === '...' || label === '…');
  const hiddenItemsSource = item.hiddenItems || item.hiddenitems || item['hidden-items'] || item.items;
  const hiddenItems = hiddenItemsSource ? parseItems(hiddenItemsSource, {
    defaultCurrent: false
  }) : [];
  return {
    label: ellipsis ? '…' : label,
    href: item.href || item.url || '',
    icon: item.icon || '',
    current,
    active: Boolean(item.active || current),
    disabled: Boolean(item.disabled),
    ellipsis,
    target: item.target || '',
    rel: item.rel || '',
    itemClass: item.itemClass || item['item-class'] || '',
    containerClass: item.containerClass || item['container-class'] || '',
    ariaLabel: item.ariaLabel || item['aria-label'] || '',
    value: item.value || '',
    hiddenItems,
    index
  };
}

function parseItems(items = '', options = {}) {
  if (Array.isArray(items)) {
    return items.map((item, index) => normalizeItem(item, index, items.length, options));
  }

  const raw = String(items || '').trim();

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);

    if (Array.isArray(parsed)) {
      return parsed.map((item, index) => normalizeItem(item, index, parsed.length, options));
    }
  } catch {// Plain string format is handled below.
  }

  const entries = raw.split('|').map(entry => entry.trim()).filter(Boolean);
  return entries.map((entry, index) => {
    const [labelPart, ...flagParts] = entry.split('::');
    const flags = parseItemFlags(flagParts.join(','));
    return normalizeItem({
      label: labelPart.trim(),
      ...flags
    }, index, entries.length, options);
  });
}

class SfBreadcrumbs extends (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()) {
  static itemTemplateSlot = '__items';

  static get props() {
    return {
      templateName: {
        attribute: 'template',
        default: 'default'
      },
      items: {
        default: [],

        parser(value) {
          return parseItems(value);
        }

      },
      separatorIcon: {
        default: 'chevron_right'
      },
      homeIcon: {
        default: 'home'
      },
      homeLabel: {
        default: ''
      },
      rootClass: {
        default: ''
      },
      itemClass: {
        default: ''
      },
      linkClass: {
        default: ''
      },
      currentClass: {
        default: ''
      },
      separatorClass: {
        default: ''
      },
      containerClass: {
        default: ''
      },
      ariaLabel: {
        default: ''
      },
      expandLabel: {
        default: ''
      },
      expandOnEllipsis: {
        default: true,
        type: Boolean
      },
      maxItems: {
        default: 4,
        type: Number
      }
    };
  }

  constructor() {
    super();
    this._itemObserver = null;
    this._readyCaptureHandler = null;
    this._ellipsisExpanded = false;
    this._preserveEllipsisExpanded = false;
  }

  connectedCallback() {
    if (this._isMounted) {
      return;
    }

    this.observeItemChildren();
    this.applyHostDisplayStyle();

    if (this.hasAttribute('items') || this.captureInitialItems()) {
      this.mountComponent();
      return;
    }

    this.scheduleReadyCapture();
  }

  disconnectedCallback() {
    this.disconnectItemObserver();
    this.cancelReadyCapture();
    super.disconnectedCallback();
  }

  get items() {
    return this.getProp('items');
  }

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);

    if (name === 'items' && oldValue !== newValue && !this._preserveEllipsisExpanded) {
      this._ellipsisExpanded = false;
    }

    if (name === 'items' && oldValue !== newValue && this.isConnected && !this._isMounted) {
      this.mountComponent();
    }
  }

  mountComponent() {
    if (!this.isConnected || this._isMounted) {
      return;
    }

    super.connectedCallback();
  }

  observeItemChildren() {
    if (this._itemObserver) {
      return;
    }

    this._itemObserver = new MutationObserver(() => {
      if (!this.captureInitialItems()) {
        return;
      }

      this.cancelReadyCapture();

      if (!this._isMounted) {
        this.mountComponent();
        return;
      }

      if (this._isMounted) {
        this.requestComponentUpdate('items');
      }
    });

    this._itemObserver.observe(this, {
      childList: true
    });
  }

  scheduleReadyCapture() {
    if (document.readyState !== 'loading' || this._readyCaptureHandler) {
      return;
    }

    this._readyCaptureHandler = () => {
      this._readyCaptureHandler = null;

      if (!this.captureInitialItems()) {
        return;
      }

      this.mountComponent();
    };

    document.addEventListener('DOMContentLoaded', this._readyCaptureHandler, {
      once: true
    });
  }

  cancelReadyCapture() {
    if (!this._readyCaptureHandler) {
      return;
    }

    document.removeEventListener('DOMContentLoaded', this._readyCaptureHandler);
    this._readyCaptureHandler = null;
  }

  disconnectItemObserver() {
    this._itemObserver?.disconnect?.();
    this._itemObserver = null;
  }

  isItemNode(node) {
    if (!node || node.nodeType !== Node.ELEMENT_NODE) {
      return false;
    }

    const tagName = node?.tagName?.toLowerCase?.();
    return tagName === 'item' || tagName === 'sf-breadcrumbs-item' || node?.hasAttribute?.('data-sf-breadcrumb-item');
  }

  captureInitialItems() {
    return this.captureChildTemplates(this.constructor.itemTemplateSlot, node => this.isItemNode(node)).length > 0;
  }

  getCapturedItems() {
    const itemNodes = this._slotTemplates.get(this.constructor.itemTemplateSlot) || [];
    return itemNodes.map(node => {
      const label = node.getAttribute('label') || node.getAttribute('text') || node.getAttribute('title') || node.textContent?.trim() || '';
      return {
        label,
        href: node.getAttribute('href') || node.getAttribute('url') || '',
        icon: node.getAttribute('icon') || '',
        current: node.hasAttribute('current') || undefined,
        active: node.hasAttribute('active') || undefined,
        disabled: node.hasAttribute('disabled'),
        ellipsis: node.hasAttribute('ellipsis') || label === '...',
        target: node.getAttribute('target') || '',
        rel: node.getAttribute('rel') || '',
        itemClass: node.getAttribute('item-class') || '',
        containerClass: node.getAttribute('container-class') || '',
        ariaLabel: node.getAttribute('aria-label') || '',
        value: node.getAttribute('value') || '',
        hiddenItems: parseItems(node.getAttribute('hidden-items') || node.getAttribute('items') || '', {
          defaultCurrent: false
        })
      };
    });
  }

  get sourceItems() {
    const items = this.items;

    if (items.length) {
      return items.map((item, index) => normalizeItem(item, index, items.length));
    }

    const capturedItems = this.getCapturedItems();

    if (capturedItems.length) {
      return capturedItems.map((item, index) => normalizeItem(item, index, capturedItems.length));
    }

    return [];
  }

  get normalizedItems() {
    const items = this.sourceItems;
    return this.getDisplayItems(items);
  }

  getDisplayItems(items = []) {
    const maxItems = this.getNumberAttr('maxItems', 4);
    const expandLabel = this.getAttribute('expand-label') || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_2__.pageText)(BREADCRUMBS_TEXT, 'expandLabel', this);

    if (this._ellipsisExpanded || maxItems < 3 || items.length <= maxItems) {
      return this.reindexItems(items);
    }

    const visibleSlots = maxItems - 1;
    const leadingCount = Math.floor(visibleSlots / 2);
    const trailingCount = visibleSlots - leadingCount;
    const startItems = items.slice(0, leadingCount);
    const endItems = items.slice(items.length - trailingCount);
    const hiddenItems = items.slice(leadingCount, items.length - trailingCount);

    if (!hiddenItems.length) {
      return this.reindexItems(items);
    }

    return this.reindexItems([...startItems, normalizeItem({
      label: '…',
      ellipsis: true,
      hiddenItems,
      ariaLabel: expandLabel
    }, leadingCount, items.length, {
      defaultCurrent: false
    }), ...endItems]);
  }

  reindexItems(items = []) {
    return items.map((item, index) => ({ ...item,
      index,
      current: Boolean(item.current && index === items.length - 1),
      active: Boolean(item.active || item.current && index === items.length - 1)
    }));
  }

  templateContext() {
    const props = this.getPropsContext();
    const items = this.normalizedItems.map((item, index) => {
      if (index !== 0 || item.label || !props.homeLabel) {
        return item;
      }

      return { ...item,
        label: props.homeLabel,
        icon: item.icon || props.homeIcon
      };
    });
    return this.createTemplateContext({ ...props,
      ariaLabel: this.getAttribute("aria-label") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_2__.pageText)(BREADCRUMBS_TEXT, "ariaLabel", this),
      expandLabel: this.getAttribute("expand-label") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_2__.pageText)(BREADCRUMBS_TEXT, "expandLabel", this),
      component: this,
      items,
      rootClass: this.getRootClass()
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_1__.renderBreadcrumbsTemplate)(this.templateContext());
  }

  get state() {
    const props = this.getPropsContext();
    return { ...props,
      items: this.normalizedItems,
      rootClass: this.getRootClass()
    };
  }

  setState(nextState = {}) {
    Object.entries(nextState || {}).forEach(([key, value]) => {
      const attr = (0,_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__.toAttributeName)(key);
      if (!attr) return;

      if (value === false || value === null || typeof value === 'undefined') {
        this.removeAttribute(attr);
        return;
      }

      if (Array.isArray(value)) {
        this.setAttribute(attr, JSON.stringify(value));
        return;
      }

      this.setAttribute(attr, value === true ? '' : String(value));
    });
    return this;
  }

  onItemClick(handler, options) {
    if (typeof handler === 'function') {
      this.addEventListener('sf-breadcrumb-click', event => {
        handler(event.detail?.item, event.detail, event);
      }, options);
    }

    return this;
  }

  expandEllipsis(item) {
    if (!item?.ellipsis) {
      return false;
    }

    if (!item.hiddenItems?.length) {
      this._ellipsisExpanded = true;
      this.requestComponentUpdate('ellipsis');
      return true;
    }

    const items = this.normalizedItems;
    const nextItems = items.flatMap(currentItem => {
      if (currentItem.index !== item.index) {
        return [currentItem];
      }

      return item.hiddenItems;
    });
    this._ellipsisExpanded = true;
    this._preserveEllipsisExpanded = true;

    try {
      this.setState({
        items: nextItems.map((nextItem, index) => ({ ...nextItem,
          index,
          active: false,
          current: Boolean(nextItem.current && index === nextItems.length - 1)
        }))
      });
    } finally {
      this._preserveEllipsisExpanded = false;
    }

    return true;
  }

  handleItemClick = (event, item) => {
    if (item.disabled || item.current) {
      event.preventDefault();
    }

    const clickEvent = new CustomEvent('sf-breadcrumb-click', {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: {
        component: this,
        tagName: this.componentTagName,
        template: this.componentTemplateName,
        item,
        index: item.index,
        items: this.normalizedItems,
        originalEvent: event
      }
    });
    this.dispatchEvent(clickEvent);

    if (item.ellipsis && this.getBooleanAttr('expandOnEllipsis', true) && !clickEvent.defaultPrevented) {
      this.expandEllipsis(item);
    }
  };
}

SfBreadcrumbs.define('sf-breadcrumbs');
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "9f45ea897c46"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderBreadcrumbsTemplate: () => (/* binding */ renderBreadcrumbsTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ddf1cdb42ecc");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);


function joinClasses(...tokens) {
  return tokens.flat().filter(Boolean).join(' ');
}

function renderIcon(name) {
  if (!name) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <sf-icon icon="${name}" aria-hidden="true"></sf-icon>
  `;
}

function renderItemContent(item, context) {
  const slotName = `item-${item.index}`;
  const slotContent = context.component?.hasSlotContent?.(slotName) ? context.component.getSlotContent(slotName) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;

  if (slotContent !== lit__WEBPACK_IMPORTED_MODULE_0__.nothing) {
    return slotContent;
  }

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    ${renderIcon(item.icon)}
    ${item.label ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span>${item.label}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
  `;
}

function renderItem(item, context) {
  const isInteractive = !item.current && !item.disabled;
  const tag = item.href && !item.disabled && !item.current ? 'a' : isInteractive ? 'button' : 'div';
  const itemClasses = joinClasses('sf-breadcrumbs-item', item.current ? '' : 'sf-breadcrumbs-item--link', item.current || item.ellipsis ? 'sf-breadcrumbs-item--default' : '', item.active ? 'active' : '', item.disabled ? 'disabled' : '', context.itemClass, item.current ? context.currentClass : context.linkClass, item.itemClass);
  const containerClasses = joinClasses('sf-breadcrumbs-item-container flex items-cross-center', context.containerClass, item.containerClass);
  const content = (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <span class=${containerClasses}>
      ${renderItemContent(item, context)}
    </span>
  `;
  const common = {
    className: itemClasses,
    ariaCurrent: item.current ? 'page' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing,
    ariaLabel: item.ariaLabel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing,
    dataIndex: String(item.index)
  };

  if (tag === 'a') {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
      <a
        href=${item.href}
        class=${common.className}
        target=${item.target || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        rel=${item.rel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        aria-current=${common.ariaCurrent}
        aria-label=${common.ariaLabel}
        data-sf-breadcrumb-index=${common.dataIndex}
        @click=${event => context.component?.handleItemClick?.(event, item)}
      >
        ${content}
      </a>
    `;
  }

  if (tag === 'button') {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
      <button
        type="button"
        class=${common.className}
        ?disabled=${item.disabled}
        aria-current=${common.ariaCurrent}
        aria-label=${common.ariaLabel}
        data-sf-breadcrumb-index=${common.dataIndex}
        @click=${event => context.component?.handleItemClick?.(event, item)}
      >
        ${content}
      </button>
    `;
  }

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div
      class=${common.className}
      aria-current=${common.ariaCurrent}
      aria-label=${common.ariaLabel}
      data-sf-breadcrumb-index=${common.dataIndex}
      @click=${event => context.component?.handleItemClick?.(event, item)}
    >
      ${content}
    </div>
  `;
}

function renderSeparator(context, index) {
  const slotName = `separator-${index}`;
  const slotContent = context.component?.hasSlotContent?.(slotName) ? context.component.getSlotContent(slotName) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div
      class=${joinClasses('sf-breadcrumbs-item sf-breadcrumbs-item--default', 'sf-breadcrumbs-item--separator', context.separatorClass)}
      aria-hidden="true"
      data-sf-breadcrumb-separator=${String(index)}
    >
      <span class="sf-breadcrumbs-item-container flex items-cross-center">
        ${slotContent !== lit__WEBPACK_IMPORTED_MODULE_0__.nothing ? slotContent : renderIcon(context.separatorIcon)}
      </span>
    </div>
  `;
}

function renderBreadcrumbsTemplate(context) {
  const rootClasses = joinClasses('sf-breadcrumbs flex items-cross-center', context.rootClass);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <nav class=${rootClasses} style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} aria-label=${context.ariaLabel || 'Breadcrumb'}>
      ${context.items.map((item, index) => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        ${index > 0 ? renderSeparator(context, index - 1) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        ${renderItem(item, context)}
      `)}
    </nav>
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
/******/ 	let __webpack_exports__ = __webpack_require__("82e4cc4fa9ae");
/******/
/******/ })()
;