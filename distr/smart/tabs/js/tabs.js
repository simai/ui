/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "e010c688f3f1"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("fbe0570fcc69");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("795a53b0bbe9");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _js_templates_default__WEBPACK_IMPORTED_MODULE_1__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _js_templates_default__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);


let tabsSequence = 0;

function parseItems(items = '') {
  if (Array.isArray(items)) {
    return items.map(item => typeof item === 'string' ? {
      label: item
    } : item).filter(Boolean);
  }

  return String(items || '').split('|').map(item => item.trim()).filter(Boolean).map(entry => {
    const [labelPart, flagsPart = ''] = entry.split('::');
    const flags = flagsPart.split(',').map(flag => flag.trim().toLowerCase()).filter(Boolean);
    const options = {};
    flags.forEach(flag => {
      const [key, value] = flag.split('=');
      if (!value && !['icon-start', 'icon-end', 'iconstart', 'iconend'].includes(key)) return;
      options[key] = value;
    });
    return {
      label: labelPart.trim(),
      disabled: flags.includes('disabled'),
      icon: options.icon || '',
      iconLeft: options['icon-left'] || options.iconleft || '',
      iconRight: options['icon-right'] || options.iconright || '',
      iconStart: options['icon-start'] ?? options.iconstart ?? null,
      iconEnd: options['icon-end'] ?? options.iconend ?? null
    };
  });
}

function normalizeIndex(index, total) {
  const value = (0,_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__.toNumber)(index, 0);

  if (!Number.isFinite(value) || value < 0 || value >= total) {
    return 0;
  }

  return value;
}

function normalizeComponentDescriptor(component = null) {
  if (!component || typeof component !== 'object' || !component.type) {
    return null;
  }

  return {
    type: component.type,
    props: component.props && typeof component.props === 'object' ? component.props : {}
  };
}

function normalizeTabItem(item = {}) {
  if (typeof item === 'string') {
    return {
      label: item
    };
  }

  if (!item || typeof item !== 'object') {
    return null;
  }

  const component = normalizeComponentDescriptor(item.component);
  return { ...item,
    component,
    label: item.label || item.text || item.title || ''
  };
}

function normalizePanelItem(item = {}) {
  if (typeof item === 'string') {
    return {
      text: item
    };
  }

  if (!item || typeof item !== 'object') {
    return null;
  }

  return { ...item,
    component: normalizeComponentDescriptor(item.component)
  };
}

class SfTabs extends (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()) {
  static get props() {
    return {
      templateName: {
        attribute: 'template',
        default: 'default'
      },
      type: {
        default: null
      },
      size: {
        default: '1'
      },
      variant: {
        default: 'buttons'
      },
      scheme: {
        default: 'default'
      },
      topPosition: {
        default: 'start'
      },
      activeIndex: {
        type: Number,
        default: 0
      },
      items: {
        default: [],

        parser(value) {
          return parseItems(value);
        }

      },
      rootClass: {
        default: ''
      },
      topClass: {
        default: ''
      },
      panelClass: {
        default: ''
      }
    };
  }

  constructor() {
    super();
    this._tabsId = `sf-smart-tabs-${++tabsSequence}`;
    this._data = {
      tabs: [],
      panels: []
    };
    this.addEventListener('click', this.handleRootClick);
    this.addEventListener('keydown', this.handleRootKeyDown);
    this.addEventListener('sf-after-render', event => {
      // Built-in Smart buttons can finish rendering after their owning Tabs.
      if (event.target !== this && event.target.parentElement === this.tabList) {
        this.syncTabSemantics();
      }
    });
  }

  get tabList() {
    return this.querySelector(':scope > .sf-tabs > .sf-tabs-top-container > [role="tablist"]');
  }

  get tabTargets() {
    return Array.from(this.tabList?.children || []).map(element => {
      return element.matches('sf-button,sf-icon-button') ? element.querySelector(':scope > button') : element.matches('[role="tab"]') ? element : null;
    });
  }

  afterRender(callback) {
    if (typeof callback === 'function') return super.afterRender(callback);
    this.syncTabSemantics();
  }

  syncTabSemantics() {
    const items = this.computedItems;
    const tabStop = items.find(item => item.selected && !item.disabled) || items.find(item => !item.disabled);
    this.tabTargets.forEach((tab, index) => {
      const item = items[index];
      if (!tab || !item) return;
      tab.id = `${this._tabsId}-tab-${index}`;
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-controls', `${this._tabsId}-panel-${index}`);
      tab.setAttribute('aria-selected', item.selected ? 'true' : 'false');
      tab.setAttribute('aria-disabled', item.disabled ? 'true' : 'false');
      const label = tab.querySelector(':scope > .sf-button-text-container');

      if (label) {
        // Preserve authored text slots while excluding decorative icon ligatures
        // from the name. Icon-only buttons receive item.label in the template.
        label.id = `${this._tabsId}-label-${index}`;
        tab.setAttribute('aria-labelledby', label.id);
      } else if (item.label) {
        // An icon-only tab is named on its inner button. On the sf-icon-button
        // host the name would make the host a named node inside the tablist,
        // where only tabs are allowed, and the tab itself would stay unnamed.
        tab.setAttribute('aria-label', item.label);
      }

      tab.tabIndex = item === tabStop ? 0 : -1;
    });
  }

  ownedTab(event) {
    const tab = event.target?.closest?.('[data-sf-tab-index]');
    if (!(tab instanceof HTMLElement) || tab.closest('sf-tabs') !== this || tab.closest('[role="tablist"]') !== this.tabList) return null;
    return this.tabTargets.includes(tab) ? tab : null;
  }

  getData() {
    const data = this._data;
    return data && typeof data === 'object' ? data : {
      tabs: [],
      panels: []
    };
  }

  normalizeData(data = {}) {
    const tabsSource = data.tabs || data.items || [];
    const panelsSource = data.panels || data.content || [];
    return { ...data,
      tabs: Array.isArray(tabsSource) ? tabsSource.map(normalizeTabItem).filter(Boolean) : [],
      panels: Array.isArray(panelsSource) ? panelsSource.map(normalizePanelItem).filter(Boolean) : []
    };
  }

  setData(data = {}, reason = 'data') {
    const currentData = this.getData();
    const nextData = typeof data === 'function' ? data(currentData) : data;

    if (!nextData || typeof nextData !== 'object') {
      return this;
    }

    this._data = this.normalizeData({ ...currentData,
      ...nextData
    });
    this.requestComponentUpdate(reason);
    return this;
  }

  setItems(items = [], reason = 'items') {
    const nextItems = typeof items === 'function' ? items(this.dataTabs) : items;
    return this.setData({
      tabs: Array.isArray(nextItems) ? nextItems : []
    }, reason);
  }

  addItems(items = [], reason = 'items') {
    const nextItems = Array.isArray(items) ? items : [items];
    return this.setItems(currentItems => [...currentItems, ...nextItems.filter(Boolean)], reason);
  }

  setPanels(panels = [], reason = 'panels') {
    const nextPanels = typeof panels === 'function' ? panels(this.dataPanels) : panels;
    return this.setData({
      panels: Array.isArray(nextPanels) ? nextPanels : []
    }, reason);
  }

  addPanels(panels = [], reason = 'panels') {
    const nextPanels = Array.isArray(panels) ? panels : [panels];
    return this.setPanels(currentPanels => [...currentPanels, ...nextPanels.filter(Boolean)], reason);
  }

  get items() {
    return this.getProp('items');
  }

  get dataTabs() {
    const data = this.getData();
    return Array.isArray(data.tabs) ? data.tabs : [];
  }

  get dataPanels() {
    const data = this.getData();
    return Array.isArray(data.panels) ? data.panels : [];
  }

  get panelSlotNames() {
    const names = new Set();
    [this._slotTemplates, this._liveSlotNodes].forEach(storage => {
      if (!storage) return;
      storage.forEach((_, name) => {
        if (/^panel-\d+$/.test(name)) {
          names.add(name);
        }
      });
    });
    return Array.from(names).sort((a, b) => {
      return (0,_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__.toNumber)(a.replace('panel-', ''), 0) - (0,_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__.toNumber)(b.replace('panel-', ''), 0);
    });
  }

  get tabCount() {
    return Math.max(this.dataTabs.length, this.dataPanels.length, this.items.length, this.panelSlotNames.length);
  }

  get computedItems() {
    const items = this.dataTabs.length ? this.dataTabs : this.items;
    const panels = this.dataPanels;
    const activeIndex = this.activeIndex;
    return Array.from({
      length: this.tabCount
    }).map((_, index) => {
      const item = items[index] || {};
      return { ...item,
        label: item.label || `Tab ${index + 1}`,
        disabled: Boolean(item.disabled),
        icon: item.icon || '',
        iconStart: item.iconStart ?? (item.iconLeft || item.icon || ''),
        iconEnd: item.iconEnd ?? (item.iconRight || ''),
        iconLeft: item.iconStart ?? (item.iconLeft || item.icon || ''),
        iconRight: item.iconEnd ?? (item.iconRight || ''),
        component: item.component || null,
        panel: panels[index] || null,
        index,
        slotName: item.slotName || `panel-${index}`,
        tabSlotName: item.tabSlotName || `tab-${index}`,
        selected: index === activeIndex
      };
    });
  }

  get activeIndex() {
    const rawValue = this.getAttribute('active-index') || this.getAttribute('active') || this.getAttribute('data-active-index') || 0;
    return normalizeIndex(rawValue, Math.max(this.tabCount, 1));
  }

  templateContext() {
    const props = this.getPropsContext();
    return this.createTemplateContext({ ...props,
      component: this,
      tabsId: this._tabsId,
      activeIndex: this.activeIndex,
      rootClass: this.getRootClass(),
      items: this.computedItems,
      data: this.getData()
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_1__.renderTabsTemplate)(this.templateContext());
  }

  get state() {
    const props = this.getPropsContext();
    return { ...props,
      activeIndex: this.activeIndex,
      items: this.items,
      data: this.getData(),
      rootClass: this.getRootClass()
    };
  }

  setState(nextState = {}) {
    Object.entries(nextState || {}).forEach(([key, value]) => {
      const attr = (0,_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__.toAttributeName)(key);

      if (!attr) {
        return;
      }

      if (value === false || value === null || value === undefined || value === '') {
        this.removeAttribute(attr);
        return;
      }

      if (Array.isArray(value)) {
        const serialized = value.map(item => {
          if (typeof item === 'string') {
            return item;
          }

          const flags = [];

          if (item?.disabled) {
            flags.push('disabled');
          }

          if (item?.icon) {
            flags.push(`icon=${item.icon}`);
          }

          if (item?.iconLeft) {
            flags.push(`icon-left=${item.iconLeft}`);
          }

          if (item?.iconRight) {
            flags.push(`icon-right=${item.iconRight}`);
          }

          if (item?.iconStart !== undefined && item?.iconStart !== null) {
            flags.push(`icon-start=${item.iconStart}`);
          }

          if (item?.iconEnd !== undefined && item?.iconEnd !== null) {
            flags.push(`icon-end=${item.iconEnd}`);
          }

          return flags.length ? `${item.label}::${flags.join(',')}` : item.label;
        }).join('|');
        this.setAttribute(attr, serialized);
        return;
      }

      this.setAttribute(attr, value === true ? '' : String(value));
    });
    return this;
  }

  goTo(index) {
    const items = this.computedItems;
    const nextIndex = normalizeIndex(index, Math.max(items.length, 1));
    const item = items[nextIndex];

    if (!item || item.disabled || nextIndex === this.activeIndex) {
      return this;
    }

    const previous = this.activeIndex;
    this.setAttribute('active-index', String(nextIndex));
    this.emitComponentEvent('tab-change', {
      previous,
      current: nextIndex,
      item,
      items
    });
    return this;
  }

  onTabChange(handler, options) {
    if (typeof handler === 'function') {
      this.addEventListener('sf-tab-change', event => {
        handler(event.detail?.current, event.detail, event);
      }, options);
    }

    return this;
  }

  handleRootClick = event => {
    const tab = this.ownedTab(event);
    if (!tab) return;
    this.goTo(tab.dataset.sfTabIndex);
  };
  handleRootKeyDown = event => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
    const tab = this.ownedTab(event); // A custom tab descriptor may contain its own input/widget. Its keys are
    // not navigation commands for this tab list.

    if (!tab || event.target !== tab) return;
    const vertical = this.tabList.getAttribute('aria-orientation') === 'vertical';
    const arrows = vertical ? ['ArrowUp', 'ArrowDown'] : ['ArrowLeft', 'ArrowRight'];
    if (!['Enter', ' ', 'Home', 'End', ...arrows].includes(event.key)) return;
    event.preventDefault();

    if (event.key === 'Enter' || event.key === ' ') {
      this.goTo(tab.dataset.sfTabIndex);
      return;
    }

    let direction = event.key === arrows[0] ? -1 : 1;
    if (!vertical && getComputedStyle(this.tabList).direction === 'rtl') direction *= -1;
    const enabledItems = this.computedItems.filter(item => !item.disabled);

    if (!enabledItems.length) {
      return;
    }

    const currentEnabledIndex = enabledItems.findIndex(item => item.index === Number(tab.dataset.sfTabIndex));
    const nextEnabledIndex = event.key === 'Home' ? 0 : event.key === 'End' ? enabledItems.length - 1 : (currentEnabledIndex + direction + enabledItems.length) % enabledItems.length;
    const nextIndex = enabledItems[nextEnabledIndex].index;
    this.goTo(nextIndex);
    this.syncTabSemantics();
    this.tabTargets[nextIndex]?.focus();
  };
}

SfTabs.define('sf-tabs');
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "795a53b0bbe9"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderTabsTemplate: () => (/* binding */ renderTabsTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ddf1cdb42ecc");
/* harmony import */ var _default_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("7502a1c8ab1e");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);



function joinClasses(...tokens) {
  return tokens.flat().filter(Boolean).join(' ');
}

function renderComponent(component, owner) {
  if (!component?.type) {
    return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  }

  return owner.renderSmartElement(component.type, component.props || {});
}

function renderPanel(item, context) {
  const panelContent = context.component?.hasSlotContent?.(item.slotName) ? context.component.getSlotContent(item.slotName) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const dataContent = item.panel?.component ? renderComponent(item.panel.component, context.component) : typeof item.panel?.text !== 'undefined' ? item.panel.text : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div
      class=${joinClasses('sf-tabs-main-tab', item.selected ? 'selected' : '', context.panelClass)}
      role="tabpanel"
      id=${`${context.tabsId}-panel-${item.index}`}
      aria-labelledby=${`${context.tabsId}-tab-${item.index}`}
      tabindex="0"
      data-sf-tab-panel=${String(item.index)}
      ?hidden=${!item.selected}
    >
      ${panelContent === lit__WEBPACK_IMPORTED_MODULE_0__.nothing ? dataContent : panelContent}
    </div>
  `;
}

function renderTab(item, context) {
  const tabContent = context.component?.hasSlotContent?.(item.tabSlotName) ? context.component.getSlotContent(item.tabSlotName) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;

  if (item.component) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
      <span
        data-sf-tab-index=${String(item.index)}
        data-tab=${String(item.index)}
        role="tab"
        aria-label=${item.label}
        aria-selected=${item.selected ? 'true' : 'false'}
        tabindex=${item.selected ? '0' : '-1'}
      >
        <span aria-hidden="true" inert>
          ${renderComponent({ ...item.component,
      props: { ...(item.component.props || {}),
        rootClass: joinClasses(item.component.props?.rootClass || '', item.selected ? 'selected' : ''),
        disabled: item.disabled || item.component.props?.disabled || false
      }
    }, context.component)}
        </span>
      </span>
    `;
  }

  if (context.variant !== 'icons') {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
          <sf-button
                  appearance="primary"
                  size=${context.size}
                  scheme=${context.scheme}
                  text=${item.label}
                  icon=${item.icon || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                  icon-start=${item.iconLeft || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                  icon-end=${item.iconRight || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                  root-class=${joinClasses(item.selected ? 'selected' : '')}
                  data-sf-tab-index=${String(item.index)}
                  data-tab=${String(item.index)}
                  ?disabled=${item.disabled}
          >
              ${tabContent === lit__WEBPACK_IMPORTED_MODULE_0__.nothing ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span slot="text">${tabContent}</span>`}
          </sf-button>
      `;
  } else {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
          <sf-icon-button
                  appearance="primary"
                  size=${context.size}
                  scheme=${context.scheme}
                  icon=${item.icon || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                  data-tab-label=${item.label}
                  root-class=${joinClasses(item.selected ? 'selected' : '')}
                  data-sf-tab-index=${String(item.index)}
                  data-tab=${String(item.index)}
                  ?disabled=${item.disabled}
          >
          </sf-icon-button>
      `;
  }
}

function renderTabsTemplate(context) {
  const vertical = context.type === 'vertical';
  const rootClasses = joinClasses('sf-tabs', context.type ? `sf-tabs--${context.type}` : '', vertical ? 'sf-tabs--vertical flex' : 'flex flex-col', context.rootClass);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div
      class=${rootClasses}
      style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      data-active-index=${String(context.activeIndex)}
      role="group"
    >
      <div class="sf-tabs-top-container">
        <div
          class=${joinClasses(`sf-tabs-top flex content-main-${context.topPosition}`, context.type === 'vertical' ? 'flex-col' : '', context.topClass)}
          role="tablist"
          aria-label=${context.component?.getAttribute('aria-label') || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          aria-labelledby=${context.component?.getAttribute('aria-labelledby') || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          aria-orientation=${vertical ? 'vertical' : 'horizontal'}
        >
          ${context.items.map(item => renderTab(item, context))}
        </div>
      </div>

      <div class="sf-tabs-main-container">
        ${context.items.map(item => renderPanel(item, context))}
      </div>
    </div>
  `;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "7502a1c8ab1e"
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
/******/ 	let __webpack_exports__ = __webpack_require__("e010c688f3f1");
/******/
/******/ })()
;