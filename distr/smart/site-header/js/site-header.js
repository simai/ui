/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "748f667c05c6"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SfSiteHeader: () => (/* binding */ SfSiteHeader)
/* harmony export */ });
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _core_js_layer_stack__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("18003344cff0");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("e3c105b02047");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("52c9a0720bbf");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("fdfe6583c3a1");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("2426ba4bd8b0");
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("5fe419424f19");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_layer_stack__WEBPACK_IMPORTED_MODULE_2__, _js_templates_default__WEBPACK_IMPORTED_MODULE_3__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_layer_stack__WEBPACK_IMPORTED_MODULE_2__, _js_templates_default__WEBPACK_IMPORTED_MODULE_3__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_layer_stack__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_2__);
// sf-site-header: the top bar of a SIMAI site -- the effects catalogue, the
// Docara documentation sites and the simai.io hub show one bar, made once
// here, rather than three copies of a header row and a mobile sheet.
//
// The bar is a frame. Its brand, navigation, actions and tools are the page's
// own markup in slots, drawn with the Framework's components; the bar gives
// them one row on the container's width and, below the `collapse` breakpoint,
// a menu button that opens the navigation and the actions as a side panel.
//
// The side panel is a layer of the shared stack (standard simai.smart-component
// 1.3.11 §19, core/js/layer-stack.js), registered the way sf-drawer registers:
// the stack orders it, hands it Escape and Tab only while it is the top layer,
// holds the one page lock and gives focus back when it closes. The panel is
// the header's own element: wide it is display: contents, so the slot nodes
// stand in the row; collapsed it is the panel. The nodes are placed once and
// never move or get copied (§4.5).
//
// From its component.json (§3, §4, §8): the settings are made by
// core/js/element-manifest.js, open, close and toggle are the actions and
// answer outcomes, the words are the language files'.







 // The Framework's breakpoints (core/scss/vars/_sf_var__breakpoint.scss), as
// the sheet's media rules read them: collapsed below the step.

const STEPS = {
  sm: '32rem',
  md: '44rem',
  lg: '60rem',
  xl: '72rem'
};
const SLOTS = ['brand', 'nav', 'actions', 'tools', 'sheet'];
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
let sequence = 0;

const applied = () => ({
  outcome: 'applied'
});

const refused = reason => ({
  outcome: 'refused',
  reason
});

const SiteHeaderElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_4__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_5__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_6__
  },
  source: 'ru',
  actions: {
    open() {
      return this.runOpen();
    },

    close({
      reason
    } = {}) {
      return this.runClose({
        reason
      });
    },

    toggle() {
      return this.isOpen ? this.runClose({
        reason: 'close'
      }) : this.runOpen();
    }

  }
});

class SfSiteHeader extends SiteHeaderElement {
  constructor() {
    super();
    this._id = `sf-site-header-${++sequence}`;
    this.isOpen = false;
    this._media = null;

    this._onMedia = () => this.syncCollapsed();
  } // The nav is the default slot (component.json): the children the page wrote
  // without a slot attribute, taken live like the named ones, never copied.


  onConnected() {
    super.onConnected?.();
    const live = this._liveSlotNodes;

    if (live && !live.has('nav')) {
      const nodes = Array.from(this.children).filter(child => !child.hasAttribute('slot') && !child.hasAttribute('data-sf-static') && child.localName !== 'script' && child.localName !== 'template');

      if (nodes.length) {
        nodes.forEach(node => node.remove());
        live.set('nav', nodes);
      }
    }

    this.watchCollapse();
  }

  disconnectedCallback() {
    if (this.isOpen) this.finishClose({
      emit: false,
      restoreFocus: false
    });
    this._media?.removeEventListener?.('change', this._onMedia);
    this._media = null;
    super.disconnectedCallback?.();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === 'collapse' && oldValue !== newValue && this._isMounted) this.watchCollapse();
  } // Whether the bar is collapsed now: the same answer as the sheet's media rule.


  get collapsed() {
    if (this.collapse === 'always') return true;
    if (this.collapse === 'none') return false;
    return this._media ? !this._media.matches : false;
  }

  watchCollapse() {
    this._media?.removeEventListener?.('change', this._onMedia);
    const step = STEPS[this.collapse];
    this._media = step && typeof globalThis.matchMedia === 'function' ? globalThis.matchMedia(`(min-width: ${step})`) : null;
    this._media?.addEventListener?.('change', this._onMedia);
    this.syncCollapsed();
  } // The window crossed the breakpoint: the host says so, a horizontal sf-menu
  // in the nav turns into a column while it stands in the panel, and an open
  // panel the wide bar no longer has closes.


  syncCollapsed() {
    const collapsed = this.collapsed;
    this.sfHostState('data-collapsed', collapsed);

    for (const menu of this.navMenus()) {
      if (collapsed) {
        if (menu.dataset.sfSiteHeaderOrientation === undefined) menu.dataset.sfSiteHeaderOrientation = menu.getAttribute('orientation') ?? '';
        menu.setAttribute('orientation', 'vertical');
      } else if (menu.dataset.sfSiteHeaderOrientation !== undefined) {
        const was = menu.dataset.sfSiteHeaderOrientation;
        delete menu.dataset.sfSiteHeaderOrientation;
        if (was) menu.setAttribute('orientation', was);else menu.removeAttribute('orientation');
      }
    }

    if (!collapsed && this.isOpen) this.runClose({
      reason: 'api'
    });
  }

  navMenus() {
    const nodes = [].concat(this._liveSlotNodes?.get('nav') || []);
    return nodes.flatMap(node => node.localName === 'sf-menu' ? [node] : Array.from(node.querySelectorAll?.('sf-menu') || []));
  }

  panel() {
    return this.querySelector(':scope .sf-site-header-panel');
  }

  menuButton() {
    return this.querySelector(':scope .sf-site-header-menu-button button') ?? this.querySelector(':scope .sf-site-header-menu-button');
  }

  header() {
    return this.querySelector(':scope > .sf-site-header');
  } // The menu button is the control the host's focus() reaches while the bar is
  // collapsed (the host is display: contents and has no box).


  focusDelegate() {
    return this.collapsed ? this.menuButton() : null;
  } // The action open.


  runOpen() {
    if (this.isOpen) return applied();
    if (!this.collapsed) return refused('not-collapsed');
    if (!this.sfEmit('open', {}, {
      cancelable: true
    })) return refused('prevented');
    this._returnTo = document.activeElement;
    this._returnAncestors = (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_2__.landmarksAround)(this._returnTo);
    this.isOpen = true;
    this.sfHostState('data-open', true);
    (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_2__.openLayer)(this, {
      kind: 'panel',
      locksPage: true,
      trapsFocus: true,
      returnTo: this._returnTo,
      lockPage: () => this.lockPage(),
      root: () => this.panel(),
      focusIn: () => this.focusFirst(),
      onEscape: event => this.onEscape(event),
      onTab: event => this.onTab(event),
      place: ({
        zIndex
      }) => this.place(zIndex)
    });
    this.requestComponentUpdate('open'); // Lit draws the open panel in a microtask; a frame later it has a box to
    // take focus.

    const settle = () => {
      if (!this.isOpen) return;
      this.focusFirst();
      this.sfEmit('opened', {});
    };

    if (typeof globalThis.requestAnimationFrame === 'function') globalThis.requestAnimationFrame(settle);else Promise.resolve().then(settle);
    return applied();
  } // The action close; reason by §19.3.


  runClose({
    reason = 'api',
    restoreFocus = true
  } = {}) {
    if (!this.isOpen) return refused('closed');
    if (!this.sfEmit('close', {
      reason
    }, {
      cancelable: true
    })) return refused('prevented');
    this.finishClose({
      reason,
      restoreFocus
    });
    return applied();
  }

  finishClose({
    reason = 'api',
    emit = true,
    restoreFocus = true
  } = {}) {
    this.isOpen = false;
    this.sfHostState('data-open', false);
    const wasTop = (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_2__.closeLayer)(this, {
      restoreFocus: false
    });
    this.place('');
    this.requestComponentUpdate('close');

    if (restoreFocus) {
      // Focus goes back to the menu button that opened it (§19.2), or by the
      // stack's rule when that is gone.
      const button = this.menuButton();
      const target = button?.getClientRects().length ? button : this._returnTo;
      (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_2__.returnLayerFocus)(wasTop, target, this._returnAncestors);
    }

    if (emit) this.sfEmit('closed', {
      reason
    });
  } // The bar's place in the stack while open: its z-index lifts the header,
  // and the panel and scrim inside it, to the layer's height.


  place(zIndex) {
    const header = this.header();
    if (!header) return;
    if (zIndex === '' || zIndex === undefined) header.style.removeProperty('z-index');else header.style.zIndex = String(zIndex);
  } // The one page lock (§19.1): the stack takes it with the first layer that
  // locks the page and gives it back with the last.


  lockPage() {
    const root = document.documentElement;
    const body = document.body;
    if (!root || !body) return () => {};
    const gap = Math.max(0, window.innerWidth - root.clientWidth);
    const kept = {
      root: root.style.overflow,
      body: body.style.overflow,
      padding: body.style.paddingInlineEnd
    };
    root.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    if (gap > 0) body.style.paddingInlineEnd = `${gap}px`;
    return () => {
      root.style.overflow = kept.root;
      body.style.overflow = kept.body;
      body.style.paddingInlineEnd = kept.padding;
    };
  }

  focusable() {
    const panel = this.panel();
    if (!panel) return [];
    return Array.from(panel.querySelectorAll(FOCUSABLE)).filter(element => element.getClientRects().length > 0);
  } // Focus on open: the current page's link (the last one, as the nav comes
  // before a documentation tree in the sheet slot), else the first link, else
  // the close button.


  focusFirst() {
    const panel = this.panel();
    if (!panel) return;
    const current = Array.from(panel.querySelectorAll('[aria-current="page"]')).filter(element => element.getClientRects().length > 0);
    const links = Array.from(panel.querySelectorAll('a[href]')).filter(element => element.getClientRects().length > 0);
    const close = panel.querySelector('.sf-site-header-close-button button') ?? panel.querySelector('.sf-site-header-close-button');
    const target = current.at(-1) || links[0] || close || panel;
    target.focus({
      preventScroll: true
    });
  }

  onEscape(event) {
    if (event.defaultPrevented || !this.isOpen || !(0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_2__.isTopLayer)(this)) return false;
    this.close({
      reason: 'escape'
    });
    return true;
  }

  onTab(event) {
    if (!this.isOpen) return;
    const items = this.focusable();
    const panel = this.panel();

    if (!items.length) {
      event.preventDefault();
      panel?.focus();
      return;
    }

    const first = items[0];
    const last = items.at(-1);
    const active = document.activeElement;

    if (!panel?.contains(active)) {
      event.preventDefault();
      (event.shiftKey ? last : first).focus();
    } else if (event.shiftKey && (active === first || active === panel)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  } // A link chosen in the open panel closes it (the page goes on to the link).


  onPanelClick(event) {
    if (!this.isOpen) return;
    const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
    if (link && this.panel()?.contains(link)) this.runClose({
      reason: 'api',
      restoreFocus: false
    });
  }

  templateContext() {
    return this.createTemplateContext({ ...this.getPropsContext(),
      component: this,
      id: this._id,
      open: this.isOpen,
      collapse: this.collapse,
      sticky: this.sticky,
      size: this.size,
      label: this.label,
      menuLabel: this.menuLabel,
      closeLabel: this.closeLabel,
      slot: name => this.getSlotContent(name),
      hasSlot: name => SLOTS.includes(name) && this.hasSlotContent(name),
      rootClass: this.getRootClass()
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_3__.renderSiteHeaderTemplate)(this.templateContext());
  }

}

SfSiteHeader.define('sf-site-header');

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "e3c105b02047"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderSiteHeaderTemplate: () => (/* binding */ renderSiteHeaderTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
 // The bar: a <header> (the page's banner) holding one container-wide row.
// Wide, the row reads brand · nav … actions · tools, and the panel around the
// nav and the actions is display: contents, so they stand in the row itself.
// Collapsed (a media rule per `collapse` step, scss/), the menu button comes
// first and the panel is shown only while open: a side panel at the inline
// start over a scrim, named by its heading. The page's slot nodes are placed
// once and stay where they are in both forms.

function renderSiteHeaderTemplate(context) {
  const {
    component,
    id,
    open,
    collapse,
    sticky,
    size,
    label,
    menuLabel,
    closeLabel,
    slot,
    hasSlot,
    rootClass
  } = context;
  const panelId = `${id}-panel`;
  const headingId = `${id}-heading`;
  const classes = ['sf-site-header', `sf-site-header--collapse-${collapse}`, `sf-site-header--size-${size === '1/2' ? 'half' : '1'}`, sticky ? 'sf-site-header--sticky' : '', open ? 'sf-site-header--open' : '', rootClass].filter(Boolean).join(' ');
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<header class=${classes} style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
    <div class="sf-site-header-row container w-full m-inline-auto">
      <sf-icon-button class="sf-site-header-menu-button" icon="menu" size=${size} appearance="link" scheme="on-surface"
        aria-label=${menuLabel} aria-haspopup="dialog" aria-controls=${panelId} aria-expanded=${String(Boolean(open))}
        @click=${() => component.toggle()}></sf-icon-button>
      ${hasSlot('brand') ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-site-header-brand">${slot('brand')}</div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      <div class="sf-site-header-scrim" aria-hidden="true" @click=${() => component.close({
    reason: 'outside'
  })}></div>
      <div class="sf-site-header-panel" id=${panelId}
        role=${open ? 'dialog' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing} aria-modal=${open ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing} aria-labelledby=${open ? headingId : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        tabindex=${open ? '-1' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        @click=${event => component.onPanelClick(event)}>
        <div class="sf-site-header-panel-head">
          <span class="sf-site-header-panel-heading" id=${headingId}>${label}</span>
          <sf-icon-button class="sf-site-header-close-button" icon="close" size=${size} appearance="link" scheme="on-surface"
            aria-label=${closeLabel} @click=${() => component.close({
    reason: 'close'
  })}></sf-icon-button>
        </div>
        ${hasSlot('nav') ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-site-header-nav">${slot('nav')}</div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        ${hasSlot('actions') ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-site-header-actions">${slot('actions')}</div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        ${hasSlot('sheet') ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-site-header-sheet">${slot('sheet')}</div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      </div>
      ${hasSlot('tools') ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-site-header-tools">${slot('tools')}</div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    </div>
  </header>`;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "5fe419424f19"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "5b7d7695b41b"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("element-manifest", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("element-manifest", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "18003344cff0"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("layer-stack", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("layer-stack", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "2a080a730149"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("lit", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "deb1a4d61565"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("smart-base", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("smart-base", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "52c9a0720bbf"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.site-header","tag":"sf-site-header","version":"1.0.0","kind":"leaf","settings":{"collapse":{"type":"enum","values":["none","sm","md","lg","xl","always"],"default":"lg"},"sticky":{"type":"boolean","default":false},"size":{"type":"enum","values":["1/2","1"],"default":"1"},"label":{"type":"string","default-from":"runtime.label"},"menu-label":{"type":"string","default-from":"runtime.menu-label"},"close-label":{"type":"string","default-from":"runtime.close-label"}},"values":{},"events":{"open":{"carries":{},"cancelable":true},"opened":{"carries":{}},"close":{"carries":{"reason":{"type":"enum","values":["close","escape","outside","cancelled","api"]}},"cancelable":true},"closed":{"carries":{"reason":{"type":"enum","values":["close","escape","outside","cancelled","api"]}}}},"actions":{"open":{},"close":{"with":{"reason":{"type":"enum","values":["close","escape","outside","cancelled","api"]}}},"toggle":{}},"layer":{"kind":"panel","locks-page":true,"traps-focus":true},"host-states":{"data-open":"boolean","data-collapsed":"boolean"},"css-variables":{"--sf-site-header-background":{"type":"color","state":"default"},"--sf-site-header-color":{"type":"color","state":"default"},"--sf-site-header-border-color":{"type":"color","state":"default"},"--sf-site-header-block-size":{"type":"length","state":"default"},"--sf-site-header-gap":{"type":"length","state":"default"},"--sf-site-header-brand-size":{"type":"length","state":"default"},"--sf-site-header-sheet-inline-size":{"type":"length","state":"open"},"--sf-site-header-z-index":{"type":"number","state":"default"}}}');

/***/ },

/***/ "fdfe6583c3a1"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Site header","runtime":{"label":"Navigation","menu-label":"Open menu","close-label":"Close menu"}}');

/***/ },

/***/ "2426ba4bd8b0"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Шапка сайта","runtime":{"label":"Навигация","menu-label":"Открыть меню","close-label":"Закрыть меню"}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("748f667c05c6");
/******/
/******/ })()
;