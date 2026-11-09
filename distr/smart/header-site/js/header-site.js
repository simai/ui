/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "1373e294ec38"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BREAKPOINTS: () => (/* binding */ BREAKPOINTS),
/* harmony export */   breakpointMedia: () => (/* binding */ breakpointMedia),
/* harmony export */   breakpointQuery: () => (/* binding */ breakpointQuery),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   matchesBreakpoint: () => (/* binding */ matchesBreakpoint)
/* harmony export */ });
// The Framework's breakpoints for scripts (reuse audit 2026-11-02, finding 6).
// The sheets switch at the steps of core/scss/vars/_sf_var__breakpoint.scss;
// a component that also decides in script (sf-contents, sf-site-header,
// sf-search) had copied the steps by hand, word for word, and nine such
// constants (48rem, 60rem, 1023px, 1024) had drifted apart elsewhere, so one
// admin screen switched at two points. The same values here, and
// tests/breakpoint-ladder.contract.test.mjs holds the two files equal.

/** The ladder: each name is the width it starts at, in rem as the sheets write it. */
const BREAKPOINTS = Object.freeze({
  xs: '0rem',
  sm: '32rem',
  // g6, 512px
  md: '44rem',
  // h1, 704px
  lg: '60rem',
  // h5, 960px
  xl: '72rem',
  // h8, 1152px
  xxl: '80rem' // i0, 1280px

}); // The step under a threshold, as the sheets' media-breakpoint-down writes it:
// one pixel less, in rem (_mix__breakpoint.scss breakpoint-max).

const PIXEL_REM = 1 / 16;
/**
 * The media query of a breakpoint: from its width up, or with `below: true`
 * the widths under it -- the two sides the sheets switch on. An unknown name
 * is null, so a typo is not a query that always matches.
 *
 *   breakpointQuery('md')                  (min-width: 44rem)
 *   breakpointQuery('md', {below: true})   (max-width: 43.9375rem)
 */

function breakpointQuery(name, {
  below = false
} = {}) {
  if (!Object.hasOwn(BREAKPOINTS, name)) return null;
  const rem = Number.parseFloat(BREAKPOINTS[name]);
  if (below) return rem > 0 ? `(max-width: ${rem - PIXEL_REM}rem)` : 'not all';
  return `(min-width: ${rem}rem)`;
}
/** The page's MediaQueryList for a breakpoint, to read and to follow; null without matchMedia or for an unknown name. */

function breakpointMedia(name, {
  below = false,
  view = globalThis
} = {}) {
  const query = breakpointQuery(name, {
    below
  });
  return query && typeof view?.matchMedia === 'function' ? view.matchMedia(query) : null;
}
/** Whether the page is at least as wide as the breakpoint now (or under it, with `below`). */

function matchesBreakpoint(name, options = {}) {
  return breakpointMedia(name, options)?.matches === true;
}
const Breakpoints = Object.freeze({
  ladder: BREAKPOINTS,
  query: breakpointQuery,
  media: breakpointMedia,
  matches: matchesBreakpoint
}); // Core publishes the helper; component bundles that carry their own copy reuse
// an already published one instead of replacing it.

if (typeof globalThis !== 'undefined') {
  globalThis.SF = globalThis.SF || {};
  if (!globalThis.SF.breakpoints) globalThis.SF.breakpoints = Breakpoints;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Breakpoints);

/***/ },

/***/ "060946d394b8"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SfSiteHeader: () => (/* binding */ SfSiteHeader)
/* harmony export */ });
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _core_js_breakpoints_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("1373e294ec38");
/* harmony import */ var _core_js_layer_stack__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("18003344cff0");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("67b1088f5f56");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("3b2d3ad548e5");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("0ad7db0d1ea2");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("298b141c5283");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("72ed3243e073");
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("32835c4bc572");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_layer_stack__WEBPACK_IMPORTED_MODULE_3__, _js_templates_default__WEBPACK_IMPORTED_MODULE_4__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_layer_stack__WEBPACK_IMPORTED_MODULE_3__, _js_templates_default__WEBPACK_IMPORTED_MODULE_4__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_layer_stack__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_3__);
// sf-header-site: the top bar of a SIMAI site -- the effects catalogue, the
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










const SLOTS = ['brand', 'nav', 'actions', 'tools', 'sheet'];
let sequence = 0;
const SiteHeaderElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_5__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_7__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_8__
  },
  source: 'ru',
  // The events of the former tag name (sf-site-header-*) follow the current
  // ones through the shim until the date in aliases.json.
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_6__,
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

    this._scrollFrame = 0;

    this._onScroll = () => {
      if (this._scrollFrame) return;
      this._scrollFrame = globalThis.requestAnimationFrame?.(() => {
        this._scrollFrame = 0;
        this.syncScrolled();
      }) ?? 0;
      if (!this._scrollFrame) this.syncScrolled();
    };
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
    this.watchScroll();
  }

  disconnectedCallback() {
    if (this.isOpen) this.finishClose({
      emit: false,
      restoreFocus: false
    });
    this._media?.removeEventListener?.('change', this._onMedia);
    this._media = null;
    this.unwatchScroll();
    super.disconnectedCallback?.();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === 'collapse' && oldValue !== newValue && this._isMounted) this.watchCollapse();
    if (name === 'sticky' && oldValue !== newValue && this._isMounted) this.watchScroll();
  } // Whether the bar is collapsed now: the same answer as the sheet's media rule.


  get collapsed() {
    if (this.collapse === 'always') return true;
    if (this.collapse === 'none') return false;
    return this._media ? !this._media.matches : false;
  }

  watchCollapse() {
    this._media?.removeEventListener?.('change', this._onMedia); // Collapsed below the Framework's step (core/js/breakpoints.js, the sheet's
    // own ladder; reuse audit 2026-11-02, finding 6); none has no step.

    this._media = (0,_core_js_breakpoints_js__WEBPACK_IMPORTED_MODULE_2__.breakpointMedia)(this.collapse);
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
  } // A sticky bar is the flat place while the page is at its top and the raised
  // one while content runs under it (shadow system C20): the host says so with
  // data-scrolled, and the sheet draws the raised shadow from it. Only a
  // sticky bar listens; a bar in the flow scrolls away with the page.


  watchScroll() {
    this.unwatchScroll();

    if (!this.sticky || typeof globalThis.addEventListener !== 'function') {
      this.sfHostState('data-scrolled', false);
      return;
    }

    globalThis.addEventListener('scroll', this._onScroll, {
      passive: true
    });
    this._watchingScroll = true;
    this.syncScrolled();
  }

  unwatchScroll() {
    if (this._watchingScroll) globalThis.removeEventListener?.('scroll', this._onScroll);
    this._watchingScroll = false;
    if (this._scrollFrame) globalThis.cancelAnimationFrame?.(this._scrollFrame);
    this._scrollFrame = 0;
  } // Content is under the bar when the page has scrolled and the bar stands
  // stuck at the top of the window (its top at or above the sticky edge).


  syncScrolled() {
    const bar = this.header();
    const scrolled = Boolean(bar) && (globalThis.scrollY ?? 0) > 0 && bar.getBoundingClientRect().top <= 0;
    this.sfHostState('data-scrolled', scrolled);
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
    if (this.isOpen) return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.applied)();
    if (!this.collapsed) return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.refused)('not-collapsed');
    if (!this.sfEmit('open', {}, {
      cancelable: true
    })) return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.refused)('prevented');
    this._returnTo = document.activeElement;
    this._returnAncestors = (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_3__.landmarksAround)(this._returnTo);
    this.isOpen = true;
    this.sfHostState('data-open', true);
    (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_3__.openLayer)(this, {
      kind: 'panel',
      // The stack's default page lock (lockPageScroll), the one every layer takes.
      locksPage: true,
      trapsFocus: true,
      returnTo: this._returnTo,
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
    return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.applied)();
  } // The action close; reason by §19.3.


  runClose({
    reason = 'api',
    restoreFocus = true
  } = {}) {
    if (!this.isOpen) return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.refused)('closed');
    if (!this.sfEmit('close', {
      reason
    }, {
      cancelable: true
    })) return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.refused)('prevented');
    this.finishClose({
      reason,
      restoreFocus
    });
    return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.applied)();
  }

  finishClose({
    reason = 'api',
    emit = true,
    restoreFocus = true
  } = {}) {
    this.isOpen = false;
    this.sfHostState('data-open', false);
    const wasTop = (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_3__.closeLayer)(this, {
      restoreFocus: false
    });
    this.place('');
    this.requestComponentUpdate('close');

    if (restoreFocus) {
      // Focus goes back to the menu button that opened it (§19.2), or by the
      // stack's rule when that is gone.
      const button = this.menuButton();
      const target = button?.getClientRects().length ? button : this._returnTo;
      (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_3__.returnLayerFocus)(wasTop, target, this._returnAncestors);
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
  }

  focusable() {
    return (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_3__.focusablesIn)(this.panel());
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
    if (event.defaultPrevented || !this.isOpen || !(0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_3__.isTopLayer)(this)) return false;
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
      navigationAlign: this.navigationAlign,
      label: this.label,
      menuLabel: this.menuLabel,
      closeLabel: this.closeLabel,
      slot: name => this.getSlotContent(name),
      hasSlot: name => SLOTS.includes(name) && this.hasSlotContent(name),
      rootClass: this.getRootClass()
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_4__.renderSiteHeaderTemplate)(this.templateContext());
  }

}

SfSiteHeader.define('sf-header-site');

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "67b1088f5f56"
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
    navigationAlign,
    label,
    menuLabel,
    closeLabel,
    slot,
    hasSlot,
    rootClass
  } = context;
  const panelId = `${id}-panel`;
  const headingId = `${id}-heading`;
  const classes = ['sf-site-header', `sf-site-header--collapse-${collapse}`, `sf-site-header--size-${size === '1/2' ? 'half' : '1'}`, navigationAlign === 'center' ? 'sf-site-header--navigation-center' : '', sticky ? 'sf-site-header--sticky' : '', open ? 'sf-site-header--open' : '', rootClass].filter(Boolean).join(' ');
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<header class=${classes} style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
    <div class="sf-site-header-row container w-full m-inline-auto">
      <sf-button-icon class="sf-site-header-menu-button" icon="menu" size=${size} appearance="ghost" scheme="on-surface"
        aria-label=${menuLabel} aria-haspopup="dialog" aria-controls=${panelId} aria-expanded=${String(Boolean(open))}
        @click=${() => component.toggle()}></sf-button-icon>
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
          <sf-button-icon class="sf-site-header-close-button" icon="close" size=${size} appearance="ghost" scheme="on-surface"
            aria-label=${closeLabel} @click=${() => component.close({
    reason: 'close'
  })}></sf-button-icon>
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

/***/ "32835c4bc572"
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

/***/ "0ad7db0d1ea2"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-header-site, generated from component.json \\"aliases\\" by scripts/generate-component-files.mjs; read by core/js/alias-table.js and the shim. Do not edit.","component":"sf-header-site","since":"2026-11-03","remove_after":"2027-01-01","aliases":[{"from":"sf-site-header","to":"sf-header-site","kind":"tag","component":"sf-header-site","since":"2026-11-03","remove_after":"2027-01-01","section":"rename plan R0 (ui-control RENAME-PLAN-2026-11-03), naming decision 2026-11-02","note":"the element is sf-header-site; sf-site-header is a subclass defined beside it until the date"},{"from":"sf-site-header-open","to":"sf-header-site-open","kind":"event","component":"sf-header-site","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-site-header-opened","to":"sf-header-site-opened","kind":"event","component":"sf-header-site","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-site-header-close","to":"sf-header-site-close","kind":"event","component":"sf-header-site","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-site-header-closed","to":"sf-header-site-closed","kind":"event","component":"sf-header-site","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"}]}');

/***/ },

/***/ "3b2d3ad548e5"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.header-site","tag":"sf-header-site","version":"1.7.2","kind":"leaf","settings":{"collapse":{"type":"enum","values":["none","sm","md","lg","xl","always"],"default":"lg"},"sticky":{"type":"boolean","default":false},"size":{"type":"enum","values":["1/2","1"],"default":"1"},"navigation-align":{"type":"enum","values":["start","center"],"default":"start"},"label":{"type":"string","default-from":"runtime.label"},"menu-label":{"type":"string","default-from":"runtime.menu-label"},"close-label":{"type":"string","default-from":"runtime.close-label"}},"values":{},"events":{"open":{"carries":{},"cancelable":true},"opened":{"carries":{}},"close":{"carries":{"reason":{"type":"enum","values":["close","escape","outside","cancelled","api"]}},"cancelable":true},"closed":{"carries":{"reason":{"type":"enum","values":["close","escape","outside","cancelled","api"]}}}},"actions":{"open":{},"close":{"with":{"reason":{"type":"enum","values":["close","escape","outside","cancelled","api"]}}},"toggle":{}},"layer":{"kind":"panel","locks-page":true,"traps-focus":true},"host-states":{"data-open":"boolean","data-collapsed":"boolean","data-scrolled":"boolean"},"css-variables":{"--sf-site-header-background-color":{"type":"color","state":"default"},"--sf-site-header-color":{"type":"color","state":"default"},"--sf-site-header-border-color":{"type":"color","state":"default"},"--sf-site-header-block-size":{"type":"length","state":"default"},"--sf-site-header-gap":{"type":"length","state":"default"},"--sf-site-header-tools-gap":{"type":"length","state":"default"},"--sf-site-header-brand-size":{"type":"length","state":"default"},"--sf-site-header-sheet-inline-size":{"type":"length","state":"open"},"--sf-site-header-z-index":{"type":"number","state":"default"}}}');

/***/ },

/***/ "298b141c5283"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Site header","runtime":{"label":"Navigation","menu-label":"Open menu","close-label":"Close menu"}}');

/***/ },

/***/ "72ed3243e073"
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
/******/ 	let __webpack_exports__ = __webpack_require__("060946d394b8");
/******/
/******/ })()
;