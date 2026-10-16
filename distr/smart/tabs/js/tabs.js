/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "e010c688f3f1"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ddf1cdb42ecc");
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("fbe0570fcc69");
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("0d662e4d7d63");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("795a53b0bbe9");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, _core_js_smart_base__WEBPACK_IMPORTED_MODULE_1__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_2__, _js_templates_default__WEBPACK_IMPORTED_MODULE_3__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, _core_js_smart_base__WEBPACK_IMPORTED_MODULE_1__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_2__, _js_templates_default__WEBPACK_IMPORTED_MODULE_3__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_core_js_page_language__WEBPACK_IMPORTED_MODULE_2__);




const TABS_TEXT = {
  en: {
    more: 'More',
    customize: 'Customize tabs',
    reset: 'Reset',
    visible: 'Shown',
    pinned: 'Always shown',
    moved: 'Moved'
  },
  ru: {
    more: 'Ещё',
    customize: 'Настроить вкладки',
    reset: 'Сбросить',
    visible: 'Показывать',
    pinned: 'Всегда на месте',
    moved: 'Перемещено'
  }
};
const OVERFLOWS = ['scroll', 'wrap', 'more']; // Which item a tab in the list draws. An sf-button moves its data attributes
// to the button inside it, so the index is read wherever it landed.

function tabIndexOf(element) {
  const own = element?.dataset?.sfTabIndex ?? element?.querySelector?.(':scope > [data-sf-tab-index]')?.dataset?.sfTabIndex;
  const index = Number(own);
  return own !== undefined && Number.isInteger(index) ? index : null;
}

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
  const value = (0,_core_js_smart_base__WEBPACK_IMPORTED_MODULE_1__.toNumber)(index, 0);

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

class SfTabs extends (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_1___default()) {
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
      // scroll (the default), wrap, or more: what does not fit goes into
      // «Ещё» (owner, 2026-10-14).
      overflow: {
        default: 'scroll'
      },
      // A gear at the end of the tabs: the person orders and hides them; the
      // host keeps the choice (sf-tabs-settings-change, setSettings).
      configurable: {
        type: Boolean,
        default: false
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
    this._settings = {
      order: [],
      hidden: []
    };
    this._resizeObserver = typeof ResizeObserver === 'function' ? new ResizeObserver(() => this.scheduleOverflow()) : null;
    this.addEventListener('sf-after-render', event => {
      // Built-in Smart buttons can finish rendering after their owning Tabs.
      if (event.target !== this && event.target.parentElement === this.tabList) {
        this.syncTabSemantics();
      }
    });
  }

  get tabList() {
    return this.querySelector(':scope > .sf-tabs > .sf-tabs-top-container > [role="tablist"]');
  } // The tab of each item, by the item's index: the tabs are drawn in the
  // person's order, and a hidden one is not drawn at all.


  get tabTargets() {
    const targets = [];

    for (const element of Array.from(this.tabList?.children || [])) {
      const target = element.matches('sf-button,sf-icon-button') ? element.querySelector(':scope > button') : element.matches('[role="tab"]') ? element : null;
      const index = tabIndexOf(element);
      if (Number.isInteger(index)) targets[index] = target;
    }

    return targets;
  }

  afterRender(callback) {
    if (typeof callback === 'function') return super.afterRender(callback);
    this.syncTabSemantics(); // The box that has a size: sf-tabs is display:contents, so observing the
    // element itself never fired and «Ещё» was laid out once, wrong after any
    // resize (docs trial 4, 2026-10-15).

    const container = this.tabList?.parentElement;

    if (this._resizeObserver && container && this._observed !== container) {
      this._resizeObserver.disconnect();

      this._resizeObserver.observe(container);

      this._observed = container;
    }

    this.scheduleOverflow();
  }

  disconnectedCallback() {
    this._resizeObserver?.disconnect();
    this._observed = null;
    this._moreMenu?.close?.({
      restoreFocus: false
    });
    this._moreMenu?.remove?.();
    this._settingsMenu?.close?.({
      restoreFocus: false
    });
    this._settingsMenu?.remove?.();
    super.disconnectedCallback?.();
  }

  text(key) {
    return (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_2__.pageText)(TABS_TEXT, key, this, 'sf-tabs');
  } // The menus the tabs open («Ещё», the settings) are a step the tabs are: 1/2
  // for tabs at 1/2, 1 otherwise.


  menuSize() {
    return (this.getAttribute('size') ?? '1') === '1/2' ? '1/2' : '1';
  }

  syncTabSemantics() {
    const items = this.computedItems;
    const shown = new Set(this.displayItems.map(item => item.index));
    const tabStop = items.find(item => item.selected && !item.disabled && shown.has(item.index)) || items.find(item => !item.disabled && shown.has(item.index));
    this.tabTargets.forEach((tab, index) => {
      const item = items[index];
      if (!tab || !item) return;
      if (item.href && item.selected) tab.setAttribute('aria-current', 'page');else tab.removeAttribute?.('aria-current');
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
      return (0,_core_js_smart_base__WEBPACK_IMPORTED_MODULE_1__.toNumber)(a.replace('panel-', ''), 0) - (0,_core_js_smart_base__WEBPACK_IMPORTED_MODULE_1__.toNumber)(b.replace('panel-', ''), 0);
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
        key: String(item.key ?? index),
        pinned: Boolean(item.pinned),
        count: item.count ?? null,
        href: item.href || '',
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

  get overflow() {
    const value = this.getAttribute('overflow');
    return OVERFLOWS.includes(value) ? value : 'scroll';
  }

  get configurable() {
    return this.getBooleanAttr('configurable', false);
  } // ─── the person's arrangement ─────────────────────────────────────────────
  // {order: [keys], hidden: [keys]}, kept by the host. A key the items no
  // longer have is ignored; an item the order does not name follows, visible,
  // in its declared place; a pinned tab is never hidden.


  get settings() {
    return {
      order: [...this._settings.order],
      hidden: [...this._settings.hidden]
    };
  }

  setSettings(settings = {}) {
    const order = Array.isArray(settings?.order) ? settings.order.map(String) : [];
    const hidden = Array.isArray(settings?.hidden) ? settings.hidden.map(String) : [];
    this._settings = {
      order,
      hidden
    };
    this.requestComponentUpdate('settings');
    this.renderSettingsList();
    return this;
  } // The tabs as the person arranged them: in their order, without the hidden
  // ones -- except the active one, which is shown in place while it is active,
  // so a panel never stands without its tab.


  get displayItems() {
    const hidden = new Set(this._settings.hidden);
    return this.arrangedItems.filter(item => item.pinned || item.selected || !hidden.has(item.key));
  } // The arrangement as the settings list shows it: every tab, in order.
  // Pinned tabs stay first, in their declared order, whatever the stored
  // order says: the person arranges the others after them (docs trial 5: a
  // pinned tab could be dragged and overtaken).


  get arrangedItems() {
    const items = this.computedItems;
    const byKey = new Map(items.map(item => [item.key, item]));
    const ordered = items.filter(item => item.pinned);

    for (const key of this._settings.order) {
      const item = byKey.get(key);
      if (item && !ordered.includes(item)) ordered.push(item);
    }

    for (const item of items) if (!ordered.includes(item)) ordered.push(item);

    return ordered;
  }

  changeSettings(next, reason) {
    // A pinned tab is never hidden, so it is not said to be.
    const pinned = new Set(this.computedItems.filter(item => item.pinned).map(item => item.key));
    this._settings = {
      order: next.order.map(String),
      hidden: next.hidden.map(String).filter(key => !pinned.has(key))
    };
    this.requestComponentUpdate('settings');
    this.renderSettingsList();
    this.emitComponentEvent('tabs-settings-change', { ...this.settings,
      reason
    });
  }

  resetSettings() {
    this._settings = {
      order: [],
      hidden: []
    };
    this.requestComponentUpdate('settings-reset');
    this.renderSettingsList();
    this.emitComponentEvent('tabs-settings-reset', {});
  } // ─── «Ещё» ────────────────────────────────────────────────────────────────


  scheduleOverflow() {
    if (this._overflowFrame) return;
    this._overflowFrame = requestAnimationFrame(() => {
      this._overflowFrame = 0;
      this.layoutOverflow();
    });
  }

  layoutOverflow() {
    const list = this.tabList;
    const more = this.querySelector(':scope > .sf-tabs > .sf-tabs-top-container > .sf-tabs-more');
    if (!list) return;
    const hosts = Array.from(list.children).filter(element => Number.isInteger(tabIndexOf(element)));

    for (const host of hosts) host.classList.remove('sf-tabs-overflowed');

    this._overflowed = [];
    const container = list.parentElement;

    const showMore = shown => {
      if (shown) container?.setAttribute('data-sf-tabs-more', '');else container?.removeAttribute('data-sf-tabs-more');
    };

    if (this.overflow !== 'more' || this.getAttribute('type') === 'vertical') {
      showMore(false);
      return;
    }

    const width = host => {
      const box = host.matches('sf-button,sf-icon-button') ? host.querySelector(':scope > .sf-button, :scope > .sf-icon-button, :scope > button') : host;
      return box?.getBoundingClientRect().width ?? 0;
    };

    const widths = hosts.map(width);
    const gap = parseFloat(getComputedStyle(list).columnGap) || 0;

    const fits = available => {
      const kept = [];
      let used = 0;
      hosts.forEach((host, at) => {
        const next = used + (kept.length ? gap : 0) + widths[at];

        if (next <= available + 0.5) {
          kept.push(at);
          used = next;
        }
      });
      return kept.length === hosts.length ? null : kept;
    };

    showMore(false);
    let kept = fits(list.clientWidth);

    if (kept) {
      showMore(true);
      kept = fits(list.clientWidth) ?? hosts.map((_, at) => at); // The active tab always stays: the last kept one gives way to it.

      const active = hosts.findIndex(host => tabIndexOf(host) === this.activeIndex);

      if (active >= 0 && !kept.includes(active)) {
        let used = kept.reduce((sum, at, n) => sum + widths[at] + (n ? gap : 0), 0);

        while (kept.length && used + gap + widths[active] > list.clientWidth + 0.5) {
          const dropped = kept.pop();
          used -= widths[dropped] + (kept.length ? gap : 0);
        }

        kept.push(active);
        kept.sort((a, b) => a - b);
      }

      hosts.forEach((host, at) => {
        // A class, not a data attribute: sf-button moves its data attributes
        // to the button inside it, and only class and style stay on the host.
        if (!kept.includes(at)) host.classList.add('sf-tabs-overflowed');
      });
      this._overflowed = hosts.filter((_, at) => !kept.includes(at)).map(host => tabIndexOf(host));

      if (more) {
        const label = `${this.text('more')} (${this._overflowed.length})`;
        more.setAttribute('text', label);
        more.setAttribute('aria-label', label);
      }
    }
  }

  async openMore(anchor) {
    const items = this.computedItems;
    const entries = (this._overflowed ?? []).map(index => items[index]).filter(Boolean).map(item => ({
      id: String(item.index),
      text: item.label,
      icon: item.icon || undefined,
      disabled: item.disabled,
      value: item.count === null || item.count === undefined ? undefined : String(item.count)
    }));
    if (!entries.length) return;
    const menu = await this.standardMenu('_moreMenu', id => this.activate(Number(id)));
    menu.setAttribute('aria-label', this.text('more'));
    menu.setAttribute('size', this.menuSize());
    menu.entries = entries;
    menu.toggleFor(anchor);
  }

  async standardMenu(field, select) {
    if (!customElements.get('sf-context-menu')) {
      globalThis.SF?.Loader?.ensurePlugin?.('cl-context-menu');
      await Promise.race([customElements.whenDefined('sf-context-menu'), new Promise(done => setTimeout(done, 3000))]);
    }

    if (this[field]?.isConnected) return this[field];
    const menu = document.createElement('sf-context-menu');
    menu.setAttribute('popup', '');
    menu.addEventListener('sf-context-menu-select', event => select?.(event.detail?.id, event));
    (this.closest('dialog[open]') || document.body).append(menu);
    this[field] = menu;
    return menu;
  } // A tab chosen anywhere -- its own button, «Ещё» -- is activated the same
  // way; a tab that is a link goes to its address.


  activate(index, event = null) {
    const item = this.computedItems[index];
    if (!item || item.disabled) return;

    if (item.href) {
      if (event && (event.metaKey || event.ctrlKey || event.shiftKey || event.button === 1)) {
        globalThis.open?.(item.href, '_blank', 'noopener');
        return;
      }

      this.goTo(index);
      if (globalThis.location && item.href !== globalThis.location.href) globalThis.location.assign(item.href);
      return;
    }

    this.goTo(index);
  } // ─── the settings ─────────────────────────────────────────────────────────


  async openSettings(anchor) {
    const menu = await this.settingsMenu();
    menu.setAttribute('size', this.menuSize());
    this.renderSettingsList();
    menu.toggleFor(anchor, {
      width: 'content'
    });
  }

  async settingsMenu() {
    if (this._settingsMenu?.isConnected) return this._settingsMenu;

    if (!customElements.get('sf-context-menu')) {
      globalThis.SF?.Loader?.ensurePlugin?.('cl-context-menu');
      await Promise.race([customElements.whenDefined('sf-context-menu'), new Promise(done => setTimeout(done, 3000))]);
    }

    globalThis.SF?.Loader?.ensureSmartElementLoaded?.('sf-sortable');
    globalThis.SF?.Loader?.ensureSmartElementLoaded?.('sf-checkbox');
    const menu = document.createElement('sf-context-menu');
    menu.setAttribute('popup', '');
    menu.setAttribute('aria-label', this.text('customize'));
    menu.setAttribute('role', 'dialog');
    const body = document.createElement('div');
    body.slot = 'content';
    body.className = 'sf-context-menu-body sf-tabs-settings-body';
    const reset = document.createElement('sf-button');
    reset.slot = 'footer';
    reset.setAttribute('appearance', 'outline');
    reset.setAttribute('scheme', 'on-surface');
    reset.setAttribute('size', this.menuSize());
    reset.setAttribute('text', this.text('reset'));
    reset.addEventListener('click', () => this.resetSettings());
    menu.append(body, reset);
    (this.closest('dialog[open]') || document.body).append(menu);
    this._settingsMenu = menu;
    this._settingsBody = body;
    return menu;
  }

  renderSettingsList() {
    const body = this._settingsBody;
    if (!body) return;
    const items = this.arrangedItems;
    const hidden = new Set(this._settings.hidden);
    const size = this.menuSize(); // Only the tabs that are not pinned are sortable items, so the index the
    // list reports counts among them; the pinned ones lead.

    const pinnedKeys = items.filter(entry => entry.pinned).map(entry => entry.key);

    const onIntent = event => {
      const {
        item,
        index
      } = event.detail ?? {};
      const keys = items.filter(entry => !entry.pinned).map(entry => entry.key);
      const from = keys.indexOf(String(item));
      if (from < 0) return;
      keys.splice(from, 1);
      keys.splice(Math.max(0, Math.min(index, keys.length)), 0, String(item));
      this.changeSettings({
        order: [...pinnedKeys, ...keys],
        hidden: [...hidden]
      }, 'order');
    };

    const toggle = (key, shown) => {
      const next = new Set(hidden);
      if (shown) next.delete(key);else next.add(key);
      this.changeSettings({
        order: items.map(entry => entry.key),
        hidden: [...next]
      }, 'visibility');
    };

    (0,lit__WEBPACK_IMPORTED_MODULE_0__.render)((0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
      <sf-sortable class="sf-tabs-settings-list" group="sf-tabs-settings" label=${this.text('customize')}
                   @sf-sortable-intent=${onIntent}>
        ${items.map(item => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
          <div class=${item.pinned ? 'sf-tabs-settings-row sf-tabs-settings-row--pinned' : 'sf-tabs-settings-row'}
               data-sf-sortable-item=${item.pinned ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : item.key}>
            ${item.pinned ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-tabs-settings-handle" aria-hidden="true"></span>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-tabs-settings-handle" data-sf-sortable-handle aria-hidden="true"><i class="sf-icon">drag_indicator</i></span>`}
            <span class="sf-tabs-settings-label">${item.label}</span>
            ${item.pinned ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class="sf-icon sf-tabs-settings-pin" title=${this.text('pinned')} aria-label=${this.text('pinned')}>push_pin</i>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-checkbox size=${size} .checked=${!hidden.has(item.key)} aria-label=${`${this.text('visible')}: ${item.label}`}
                       @change=${event => toggle(item.key, Boolean(event.target?.checked ?? event.detail?.checked))}></sf-checkbox>`}
          </div>`)}
      </sf-sortable>`, body);
  }

  templateContext() {
    const props = this.getPropsContext();
    return this.createTemplateContext({ ...props,
      component: this,
      tabsId: this._tabsId,
      activeIndex: this.activeIndex,
      displayItems: this.displayItems,
      overflow: this.overflow,
      configurable: this.configurable,
      moreText: this.text('more'),
      customizeText: this.text('customize'),
      rootClass: this.getRootClass(),
      items: this.computedItems,
      data: this.getData()
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_3__.renderTabsTemplate)(this.templateContext());
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
      const attr = (0,_core_js_smart_base__WEBPACK_IMPORTED_MODULE_1__.toAttributeName)(key);

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
    const tool = event.target?.closest?.('.sf-tabs-more, .sf-tabs-settings');

    if (tool && tool.closest('sf-tabs') === this) {
      const anchor = tool.querySelector('button') ?? tool;
      if (tool.classList.contains('sf-tabs-more')) this.openMore(anchor);else this.openSettings(anchor);
      return;
    }

    const tab = this.ownedTab(event);
    if (!tab) return;
    this.activate(Number(tab.dataset.sfTabIndex), event);
  }; // «Ещё», when it stands: the arrows reach it after the last tab in the row
  // and leave it back to the tabs (docs trial 5: only Tab reached it).

  get moreTarget() {
    const more = this.querySelector('.sf-tabs-more');
    if (!more || more.closest('sf-tabs') !== this || more.hidden) return null; // sf-button's host is display: contents and has no box: the button is
    // what stands, or not.

    const button = more.querySelector('button');
    return button && button.getClientRects().length ? button : null;
  }

  handleRootKeyDown = event => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
    const more = this.moreTarget;

    if (more && (event.target === more || more.contains(event.target)) && this.tabList.getAttribute('aria-orientation') !== 'vertical') {
      const rtl = getComputedStyle(this.tabList).direction === 'rtl';
      const back = event.key === (rtl ? 'ArrowRight' : 'ArrowLeft') || event.key === 'End';
      const forward = event.key === (rtl ? 'ArrowLeft' : 'ArrowRight') || event.key === 'Home';
      if (!back && !forward) return;
      const overflowed = new Set(this._overflowed ?? []);
      const shown = this.displayItems.filter(item => !item.disabled && !overflowed.has(item.index));
      const target = back ? shown[shown.length - 1] : shown[0];
      if (!target) return;
      event.preventDefault();
      this.goTo(target.index);
      this.syncTabSemantics();
      this.tabTargets[target.index]?.focus();
      return;
    }

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
    if (!vertical && getComputedStyle(this.tabList).direction === 'rtl') direction *= -1; // The arrows walk the tabs in the order they stand, past the ones in
    // «Ещё» and the hidden ones.

    const overflowed = new Set(this._overflowed ?? []);
    const enabledItems = this.displayItems.filter(item => !item.disabled && !overflowed.has(item.index));

    if (!enabledItems.length) {
      return;
    }

    const currentEnabledIndex = enabledItems.findIndex(item => item.index === Number(tab.dataset.sfTabIndex)); // Past the last tab in the row, forward, is «Ещё» when it stands.

    if (more && arrows.includes(event.key) && direction === 1 && currentEnabledIndex === enabledItems.length - 1) {
      more.focus();
      return;
    }

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
/* harmony import */ var lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("0d9131aa10ba");
/* harmony import */ var _default_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("7502a1c8ab1e");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__);




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
  } // A count after the label, when the item has one; the tab's own slot wins.


  const counted = tabContent === lit__WEBPACK_IMPORTED_MODULE_0__.nothing && item.count !== null && item.count !== undefined && item.count !== '' ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span slot="text" class="sf-tabs-label">${item.label}<span class="sf-tabs-count">${String(item.count)}</span></span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;

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
              ${tabContent === lit__WEBPACK_IMPORTED_MODULE_0__.nothing ? counted : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span slot="text">${tabContent}</span>`}
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
  const sizeClass = `sf-tabs--size-${String(context.size || '1').replace('/', '-')}`;
  const rootClasses = joinClasses('sf-tabs', sizeClass, context.overflow && context.overflow !== 'scroll' ? `sf-tabs--overflow-${context.overflow}` : '', context.type ? `sf-tabs--${context.type}` : '', vertical ? 'sf-tabs--vertical flex' : 'flex flex-col', context.rootClass);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div
      class=${rootClasses}
      style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      data-active-index=${String(context.activeIndex)}
      role="group"
    >
      <div class=${joinClasses('sf-tabs-top-container', context.overflow === 'more' || context.configurable ? 'sf-tabs-top-container--tools' : '')}>
        <div
          class=${joinClasses(`sf-tabs-top flex content-main-${context.topPosition}`, context.type === 'vertical' ? 'flex-col' : '', context.topClass)}
          role="tablist"
          aria-label=${context.component?.getAttribute('aria-label') || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          aria-labelledby=${context.component?.getAttribute('aria-labelledby') || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          aria-orientation=${vertical ? 'vertical' : 'horizontal'}
        >
          ${(0,lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__.repeat)(context.displayItems ?? context.items, // Keyed by the tab, so a reordered tab keeps its own button: by
  // position, the buttons kept their old labels and counts while the
  // hosts' text was already the new one (docs trial 4).
  item => item.key ?? item.index, item => renderTab(item, context))}
        </div>
        ${context.overflow === 'more' && !vertical ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button class="sf-tabs-more" appearance="link" scheme="on-surface" size=${context.size}
                            icon-end="expand_more" text=${context.moreText} aria-haspopup="menu"></sf-button>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        ${context.configurable ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-icon-button class="sf-tabs-settings" appearance="link" scheme="on-surface" size=${context.size}
                                 icon="tune" aria-label=${context.customizeText} title=${context.customizeText}
                                 aria-haspopup="dialog"></sf-icon-button>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
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

/***/ "0d9131aa10ba"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit/directives/repeat.js") : new Promise((resolve) => globalThis.addEventListener("sf-runtime-ready", () => resolve(globalThis.SF.runtimeModule("lit/directives/repeat.js")), { once: true })));

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
/******/ 	let __webpack_exports__ = __webpack_require__("e010c688f3f1");
/******/
/******/ })()
;