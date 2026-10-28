/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "5f0529568b98"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _core_js_deprecations__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("d3818183b14c");
/* harmony import */ var _core_js_instance_path__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("e92fd2d1a38c");
/* harmony import */ var _core_js_layer_stack__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("18003344cff0");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("0dc7c163a2e8");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("d6e446f3d408");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("a3b41385ab12");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("ce0ca620b623");
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("fefa0c5c3ed9");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, _core_js_smart_base__WEBPACK_IMPORTED_MODULE_1__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2__, _core_js_deprecations__WEBPACK_IMPORTED_MODULE_3__, _core_js_instance_path__WEBPACK_IMPORTED_MODULE_4__, _core_js_layer_stack__WEBPACK_IMPORTED_MODULE_5__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, _core_js_smart_base__WEBPACK_IMPORTED_MODULE_1__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2__, _core_js_deprecations__WEBPACK_IMPORTED_MODULE_3__, _core_js_instance_path__WEBPACK_IMPORTED_MODULE_4__, _core_js_layer_stack__WEBPACK_IMPORTED_MODULE_5__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _core_js_deprecations__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_core_js_deprecations__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _core_js_instance_path__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_core_js_instance_path__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _core_js_layer_stack__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_5__);









 // sf-drawer from its component.json (standard simai.smart-component 1.3.8 §3,
// §4, §8, §19): its settings are attributes and properties made by
// core/js/element-manifest.js, its words are lang/<locale>.json (a product
// adds a language through SF.language.register("sf-drawer", code, words)),
// and the old names -- title and the drawer:* events -- are dated aliases.

const DrawerElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_6__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_1___default()),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_8__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_9__
  },
  source: 'ru',
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_7__
}); // The public variables the manifest declares; the panel drawn at the end of the
// body carries their values from where its host stands (§19.1).

const DRAWER_VARIABLES = Object.keys(_component_json__WEBPACK_IMPORTED_MODULE_6__["css-variables"] || {});
const OLD_EVENT_NAMES = ['drawer:before-open', 'drawer:after-open', 'drawer:before-close', 'drawer:after-close', 'drawer:snap']; // A lifecycle copy (drawer:ready, drawer:update) is still sent until its date;
// a listener that reads it is a use (vocabulary §5.1, §16.13).

function retiredEvent(type, detail) {
  const event = new CustomEvent(type, {
    bubbles: true,
    composed: true,
    detail
  });
  let used = false;
  Object.defineProperty(event, 'detail', {
    configurable: true,

    get() {
      if (!used) {
        used = true;
        (0,_core_js_deprecations__WEBPACK_IMPORTED_MODULE_3__.noteDeprecated)({
          component: 'sf-drawer',
          tag: 'sf-drawer',
          kind: 'event',
          from: type,
          to: null,
          since: _aliases_json__WEBPACK_IMPORTED_MODULE_7__.since,
          remove_after: _aliases_json__WEBPACK_IMPORTED_MODULE_7__.remove_after
        });
      }

      return detail;
    }

  });
  return event;
}

const applied = () => ({
  outcome: 'applied'
});

const refused = reason => ({
  outcome: 'refused',
  reason
});


const DRAWER_SELECTOR = 'sf-drawer'; // Only the edge. A foot area was tried and taken out: lit inserts a node that
// appears later beside the markers of its siblings, and those markers move with
// any node the drawer has already projected -- so a bar that appeared when a
// record became editable landed inside the body, above everything. The panel
// scrolls now, so a bar can simply stick to its bottom where it is.

const DRAWER_AREAS = ['edge'];

const asksFor = (node, slot) => node.nodeType === 1 && node.getAttribute('slot') === slot;

const asksForArea = node => DRAWER_AREAS.some(slot => asksFor(node, slot));

const PORTAL_ATTRIBUTE = 'data-sf-drawer-portal'; // A box that holds its own overlays (sf-drawer, sf-modal); the drawer's own
// name came first and is read until the change journal retires it.

const OVERLAY_CONTAINER = '[data-sf-overlay-container], [data-sf-drawer-container]';
const FOCUSABLE_SELECTOR = ['a[href]', 'button:not([disabled])', 'input:not([disabled])', 'select:not([disabled])', 'textarea:not([disabled])', '[tabindex]:not([tabindex="-1"])'].join(','); // The open drawers, in the order they opened: the panels of the one document
// layer stack (layer-stack.js, standard 1.3.8 §19.1). The drawer kept an array
// of its own, so a modal opened from a drawer did not know it was above it
// (simai/ui-source#36) and a drawer opened from a modal was drawn under it
// (simai/ui-source#37).

const openDrawers = () => (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_5__.openLayers)('panel').filter(owner => owner?.localName === DRAWER_SELECTOR); // Below this width of the dock host (or of the window, when the page names no
// host) docked panels overlay the page instead of narrowing it, unless the
// drawer names its own (dock-breakpoint, or --sf-drawer-dock-breakpoint).


const DOCK_MIN_REM = 48;
const PLACEMENTS = ['left', 'right', 'inline-start', 'inline-end', 'bottom']; // The heights a bottom sheet rests at, smallest first: its content (auto, up
// to the room it has), half the room, and all of it.

const SNAPS = ['auto', 'half', 'full']; // A drag of the sheet farther than this share of its height, or faster than
// this, is a decision: down closes (or steps full down to half), up opens to full.

const SWIPE_SHARE = 0.25;
const SWIPE_SPEED = 0.5;

function joinClasses(...parts) {
  return parts.flat().filter(Boolean).join(' ');
} // A threshold in rem, em or px, in pixels. rem and em both read the root's
// font size: the threshold is the page's, not a box's.


function lengthToPixels(value) {
  const match = /^(\d*\.?\d+)(rem|em|px)$/u.exec(String(value).trim());
  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  if (!match) return DOCK_MIN_REM * rem;
  return Number(match[1]) * (match[2] === 'px' ? 1 : rem);
}

function escapeSelector(value) {
  if (globalThis.CSS?.escape) return globalThis.CSS.escape(value);
  return String(value).replace(/["\\]/g, '\\$&');
}

const drawerManager = {
  globalBound: false,
  lockState: null,

  // Opening raises a drawer that is open already: it is the last opened.
  add(drawer) {
    (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_5__.openLayer)(drawer, {
      kind: 'panel',
      ...this.declares(drawer),
      returnTo: drawer._lastActive ?? null,
      lockPage: () => {
        this.lockPage(drawer.preserveScrollGap);
        return () => this.unlockPage();
      },
      root: () => drawer.getDrawerRoot(),
      focusIn: () => drawer.focusFirst(),
      onEscape: event => drawer.onKeyDown(event),
      onTab: event => drawer.onKeyDown(event),
      place: ({
        index
      }) => drawer.applyStackPosition(index)
    });
    this.syncDock();
    drawer.syncSwitches();
  },

  // What the drawer declares to the stack (§19.1): a modal drawer locks the
  // page -- unless it stands in an overlay container, which it covers instead
  // -- and holds the focus. The drawer remembers what it declared, so a docked
  // drawer that starts or stops floating says so again (syncModal).
  declares(drawer) {
    const modal = drawer.modal;
    drawer._declaredModal = modal;
    return {
      locksPage: modal && !drawer.closest(OVERLAY_CONTAINER),
      trapsFocus: modal
    };
  },

  // Answers whether the drawer was the top layer.
  remove(drawer) {
    const wasTop = (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_5__.closeLayer)(drawer, {
      restoreFocus: false
    });
    drawer.applyStackPosition(-1);
    this.sync();
    drawer.syncSwitches();
    return wasTop;
  },

  bringToFront(drawer) {
    if ((0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_5__.layerIndex)(drawer) < 0) return;
    (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_5__.raiseLayer)(drawer);
    this.sync();
  },

  isTop(drawer) {
    return (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_5__.isTopLayer)(drawer);
  },

  sync() {
    for (const drawer of openDrawers()) drawer.applyStackPosition((0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_5__.layerIndex)(drawer));

    this.syncDock();
  },

  // Docked drawers reserve page space: the summed widths of open docked panels
  // per logical side are published as CSS custom properties on the root; any
  // element with data-sf-drawer-dock-host pads itself by them.
  // A docked drawer that has the room is a column of the page and says so on
  // its root (data-sf-drawer-column="true"): it takes the page's surface, not
  // the overlay's (simai/ui-source#26). Without the room it floats over the
  // page, and is drawn as a floating panel.
  syncDock() {
    const root = document.documentElement;
    if (!root) return;
    this.bindDockMedia();
    const sides = {
      start: 0,
      end: 0
    };

    for (const drawer of openDrawers()) {
      if (!drawer.openState || !drawer.docked) continue;
      const column = this.reservesDock(drawer);
      drawer.setDockColumn(column);
      drawer.syncModal();
      if (!column) continue;
      const panel = drawer.getDrawerRoot()?.querySelector('[data-sf-drawer-panel]');
      const width = panel ? Math.round(panel.getBoundingClientRect().width) : 0;
      sides[drawer.dockSide] += width;
    }

    for (const side of ['start', 'end']) {
      const name = `--sf-drawer-dock-inline-${side}`;
      if (sides[side] > 0) root.style.setProperty(name, `${sides[side]}px`);else root.style.removeProperty(name);
    }
  },

  // The window's answer for a threshold, as a media query: a length in rem
  // reads the initial font size there, as every media query does.
  dockMedia(threshold) {
    if (typeof globalThis.matchMedia !== 'function') return null;
    this.dockMediaLists ??= new Map();
    let list = this.dockMediaLists.get(threshold);

    if (!list) {
      list = globalThis.matchMedia(`(min-width: ${threshold})`);
      list.addEventListener?.('change', () => this.syncDock());
      this.dockMediaLists.set(threshold, list);
    }

    return list;
  },

  // Redraws only when some open docked drawer's answer changed: syncDock pads
  // the host, and the padding must not wake the host's observer into a loop.
  syncDockIfChanged() {
    if (openDrawers().some(drawer => drawer.openState && drawer.docked && this.reservesDock(drawer) !== drawer.dockColumn)) {
      this.syncDock();
    }
  },

  bindDockMedia() {
    // The host's own width decides, when the page names a host: a docked
    // drawer inside an editor pane or a documentation example docks by the
    // room that box has, not by the window's (DEV, 2026-10-18).
    const host = document.querySelector('[data-sf-drawer-dock-host]');

    if (host !== this.dockHost) {
      this.dockHostObserver?.disconnect();
      this.dockHost = host;
      this.dockHostObserver = host && typeof ResizeObserver === 'function' ? new ResizeObserver(() => this.syncDockIfChanged()) : null;
      this.dockHostObserver?.observe(host, {
        box: 'border-box'
      });
    }
  },

  // Whether a docked drawer takes room from the page: the dock host is at
  // least as wide as the drawer's threshold (48rem), or -- with no host on the
  // page -- the window is.
  reservesDock(drawer) {
    if (this.dockHost === undefined) this.bindDockMedia();
    const host = this.dockHost;
    const threshold = drawer.dockBreakpoint;

    if (host?.isConnected) {
      return host.getBoundingClientRect().width >= lengthToPixels(threshold);
    }

    const media = this.dockMedia(threshold);
    return media ? media.matches : true;
  },

  // The page lock is the layer stack's one lease, taken while any layer that
  // locks the page is open, a modal's too; a drawer whose `modal` or `docked`
  // changed while open says so again.
  syncPageLock() {
    for (const drawer of openDrawers()) (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_5__.updateLayer)(drawer, this.declares(drawer));
  },

  lockPage(preserveScrollGap) {
    const htmlElement = document.documentElement;
    const body = document.body;
    if (!htmlElement || !body || this.lockState) return;
    const gap = Math.max(0, window.innerWidth - htmlElement.clientWidth);
    this.lockState = {
      htmlOverflow: htmlElement.style.overflow,
      bodyOverflow: body.style.overflow,
      bodyPaddingInlineEnd: body.style.paddingInlineEnd
    };
    htmlElement.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    if (preserveScrollGap && gap > 0) body.style.paddingInlineEnd = `${gap}px`;
  },

  unlockPage() {
    if (!this.lockState) return;
    const htmlElement = document.documentElement;
    const body = document.body;
    htmlElement.style.overflow = this.lockState.htmlOverflow;
    body.style.overflow = this.lockState.bodyOverflow;
    body.style.paddingInlineEnd = this.lockState.bodyPaddingInlineEnd;
    this.lockState = null;
  },

  bindGlobalEvents() {
    if (this.globalBound || typeof document === 'undefined') return;
    document.addEventListener('click', event => {
      if (!(event.target instanceof Element)) return;
      const conciseTrigger = event.target.closest('[data-drawer]');
      const openTrigger = event.target.closest('[data-sf-drawer-open]');
      const toggleTrigger = event.target.closest('[data-sf-drawer-toggle]');
      const closeTrigger = event.target.closest('[data-sf-drawer-close]');
      const conciseOperation = conciseTrigger?.getAttribute('data-drawer') || '';
      const operation = ['open', 'toggle', 'close'].includes(conciseOperation) ? conciseOperation : openTrigger ? 'open' : toggleTrigger ? 'toggle' : closeTrigger ? 'close' : '';
      const trigger = conciseTrigger || openTrigger || toggleTrigger || closeTrigger;
      if (!operation || !trigger) return;
      const id = trigger.getAttribute('aria-controls') || trigger.getAttribute(`data-sf-drawer-${operation}`) || trigger.closest('[data-sf-drawer-id]')?.getAttribute('data-sf-drawer-id');
      if (!id) return;
      customElements.whenDefined(DRAWER_SELECTOR).then(() => {
        document.getElementById(id)?.[operation]?.();
      });
    });
    this.globalBound = true;
  }

};

class SfDrawer extends DrawerElement {
  // The manifest's settings, and what the drawer reads more closely: the size
  // ladder's legacy words, the base's template name.
  static get props() {
    return { ...super.props,
      templateName: {
        attribute: 'template',
        default: 'default'
      },
      placement: {
        default: 'right',
        values: PLACEMENTS
      },
      // A bottom sheet's resting height (placement="bottom").
      snap: {
        default: 'auto',
        values: SNAPS
      },
      // An outside switch opens and closes the panel: the close button stands
      // down while that switch is on screen (simai/ui-source#29).
      controlled: {
        type: Boolean,
        default: false
      },
      // Where the panels start from the top: the height of an app bar they
      // must not cover (simai/ui-source#29). A length; empty for the
      // --sf-drawer-block-start variable, else 0.
      blockStart: {
        attribute: 'block-start',
        default: ''
      },
      overlay: {
        type: Boolean,
        default: true
      },
      modal: {
        type: Boolean,
        default: true
      },
      docked: {
        type: Boolean,
        default: false
      },
      // From what width of the dock host (or the window) a docked drawer is a
      // column of the page: a length in rem, em or px; empty for the
      // --sf-drawer-dock-breakpoint variable, else 48rem.
      dockBreakpoint: {
        attribute: 'dock-breakpoint',
        default: ''
      },
      // The shared size ladder. The words are legacy values, still accepted:
      // see contracts/public-api-axes.json. `full` is not a step of the ladder —
      // it means as wide as the viewport, and drops the radius with it.
      size: {
        default: '1',
        values: ['1/2', '1', '2', 'full'],
        valueAliases: {
          '1/2': ['small'],
          1: ['medium'],
          2: ['large']
        }
      },
      closeOnEsc: {
        attribute: 'close-on-esc',
        type: Boolean,
        default: true
      },
      closeOnOverlay: {
        attribute: 'close-on-overlay',
        type: Boolean,
        default: true
      },
      preserveScrollGap: {
        attribute: 'preserve-scroll-gap',
        type: Boolean,
        default: true
      },
      showClose: {
        attribute: 'show-close',
        type: Boolean,
        default: true
      },
      closePlacement: {
        attribute: 'close-placement',
        default: 'inside',
        values: ['inside', 'outside']
      },
      label: {
        default: ''
      },
      closeLabel: {
        attribute: 'close-label',
        default: ''
      },
      width: {
        default: ''
      },
      stackOffset: {
        attribute: 'stack-offset',
        default: ''
      },
      gutter: {
        default: ''
      },
      zIndex: {
        attribute: 'z-index',
        default: ''
      },
      overlayClass: {
        attribute: 'overlay-class',
        default: ''
      },
      panelClass: {
        attribute: 'panel-class',
        default: ''
      },
      // The panel is the drawer's own surface, and what colour it is belongs to
      // whoever opened it: a consumer painting its content a different colour
      // than the panel leaves the head and the gutters in the other one.
      panelStyle: {
        attribute: 'panel-style',
        default: ''
      },
      headerClass: {
        attribute: 'header-class',
        default: ''
      },
      bodyClass: {
        attribute: 'body-class',
        default: ''
      },
      closeClass: {
        attribute: 'close-class',
        default: ''
      }
    };
  }

  static get defaultTrueAttributes() {
    return new Set(['overlay', 'modal', 'close-on-esc', 'close-on-overlay', 'preserve-scroll-gap', 'show-close', 'dismissible']);
  }

  constructor() {
    super();
    this.drawerId = '';
    this._portalRoot = null;
    this._contentNodes = null;
    this._lastActive = null;
    this._syncingOpenAttribute = false;
    this._hasEmittedReady = false;
    this._stackIndex = -1;
    this._focusAfterRender = false;
    this._emitAfterOpen = false;
    this._dockObserver = null;
    this.onKeyDown = this.onKeyDown.bind(this);
    this.handleRootClick = this.handleRootClick.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);
    this.onSheetPointerDown = this.onSheetPointerDown.bind(this);
    this.onHandleKeyDown = this.onHandleKeyDown.bind(this);
    this._switchVisible = false;
    this._dockColumn = true;
    this._declaredModal = null;
  }

  connectedCallback() {
    // Static markup is a picture of the drawer, not its content (§5.4).
    if (!this._contentNodes) this._contentNodes = Array.from(this.childNodes).filter(node => !node.hasAttribute?.('data-sf-static'));
    this.drawerId = this.resolveDrawerId();
    super.connectedCallback();
    drawerManager.bindGlobalEvents();
    globalThis.addEventListener?.('resize', this.onWindowResize, {
      passive: true
    });

    if (this.openState) {
      this._focusAfterRender = this.modal;
      drawerManager.add(this);
    } // Switches written after the drawer in the page are there a frame later.


    globalThis.requestAnimationFrame?.(() => this.syncSwitches());
  }

  disconnectedCallback() {
    this._areaObserver?.disconnect();
    this._areaObserver = null;
    globalThis.removeEventListener?.('resize', this.onWindowResize);
    this._dockObserver?.disconnect();
    this._dockObserver = null;
    drawerManager.remove(this);
    this.clearPortal();
    super.disconnectedCallback();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    if (name === 'open' && !this._syncingOpenAttribute && this._isMounted) {
      this.syncExternalOpenState(newValue !== null);
      return;
    }

    if ((name === 'modal' || name === 'docked') && this.openState) drawerManager.syncPageLock();

    if ((name === 'docked' || name === 'dock-breakpoint' || name === 'placement' || name === 'size' || name === 'width') && this.openState) {
      requestAnimationFrame(() => {
        drawerManager.syncDock();
        drawerManager.sync();
      });
    }

    super.attributeChangedCallback(name, oldValue, newValue);
  }

  get openState() {
    return this.hasAttribute('open');
  }

  get sheet() {
    return this.placement === 'bottom';
  } // The switch outside the panel that names it in aria-controls, on screen:
  // while it is, it is the way to close the panel and the panel draws no
  // second one.


  hasVisibleSwitch() {
    const id = this.drawerId || this.id;
    if (!id || typeof document === 'undefined') return false;
    const root = this.getDrawerRoot();
    return [...document.querySelectorAll('[aria-controls]')].some(element => {
      if (!element.getAttribute('aria-controls').split(/\s+/u).includes(id)) return false;
      if (root?.contains(element) || this.contains(element)) return false;
      if (element.getClientRects().length === 0) return false;
      return getComputedStyle(element).visibility !== 'hidden';
    });
  }

  onWindowResize() {
    if (!this.controlled || !this._isMounted) return;
    const visible = this.hasVisibleSwitch();
    if (visible !== this._switchVisible) this.requestComponentUpdate('controlled');
  } // A modal drawer -- the default -- covers the page while it floats over it:
  // the scrim takes presses, Tab stays inside, the page does not scroll, and
  // focus goes back to what opened it. A docked drawer that is a column of the
  // page is part of the page layout and is modeless; without the room (the dock
  // host or the window narrower than its dock-breakpoint) it floats over the
  // page and is modal like any other drawer (q-a49e2045c1: a chat's side panel
  // on a phone). modal="false" keeps a drawer modeless everywhere.


  get modal() {
    if (!this.getBooleanAttr('modal', true)) return false;
    if (!this.docked) return true;
    return typeof document !== 'undefined' && !drawerManager.reservesDock(this);
  } // A docked drawer that started or stopped floating while open declares it
  // to the stack again (the trap, the page lock), redraws its scrim, role and
  // aria-modal, and -- now modal and on top -- takes the focus if it is
  // outside (§19.2).


  syncModal() {
    if (!this.openState || (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_5__.layerIndex)(this) < 0) return;
    const modal = this.modal;
    if (modal === this._declaredModal) return;
    (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_5__.updateLayer)(this, drawerManager.declares(this));
    this.requestComponentUpdate('modal');
    if (!modal || !drawerManager.isTop(this)) return;
    globalThis.requestAnimationFrame?.(() => {
      // The panel and its edge are the window (a focus on the edge is inside).
      const root = this.getDrawerRoot();
      const inside = ['[data-sf-drawer-panel]', '[data-sf-drawer-edge]'].some(area => root?.querySelector(area)?.contains(document.activeElement));
      if (this.openState && this.modal && !inside) this.focusFirst();
    });
  } // A bottom sheet floats over the page; it is never a column of it.


  get docked() {
    return this.getBooleanAttr('docked', false) && !this.sheet;
  } // The physical edge the panel opens from, so left and inline-start count as
  // one edge in a left-to-right page and as two in a right-to-left one.


  get stackEdge() {
    const placement = this.placement;
    if (!placement.startsWith('inline')) return placement;
    const rtl = (this.closest('[dir]')?.getAttribute('dir') || document.documentElement.dir) === 'rtl';
    return placement === 'inline-start' !== rtl ? 'left' : 'right';
  } // The width of the dock host (or of the window) from which this docked
  // drawer is a column of the page; narrower, it floats over the page. The
  // drawer's dock-breakpoint, else --sf-drawer-dock-breakpoint where it
  // stands, else 48rem (simai/ui-source#25: a chat's panel needs 64rem).


  get dockBreakpoint() {
    const own = (this.getAttribute('dock-breakpoint') || '').trim();
    if (own) return own;
    const themed = typeof getComputedStyle === 'function' && this.isConnected ? getComputedStyle(this).getPropertyValue('--sf-drawer-dock-breakpoint').trim() : '';
    return themed || `${DOCK_MIN_REM}rem`;
  } // A switch outside the panel that shows and hides it (data-drawer="toggle"
  // naming it in aria-controls, or data-sf-drawer-toggle) says whether the
  // panel is shown: aria-expanded follows the panel, so a button that hides a
  // docked column reads as pressed while the column is there
  // (simai/ui-source#25).


  syncSwitches() {
    const id = this.drawerId || this.id;
    if (!id || typeof document === 'undefined') return;
    const expanded = this.openState ? 'true' : 'false';

    for (const element of document.querySelectorAll('[data-drawer="toggle"][aria-controls], [data-sf-drawer-toggle]')) {
      const named = (element.getAttribute('aria-controls') || element.getAttribute('data-sf-drawer-toggle') || '').split(/\s+/u);
      if (named.includes(id)) element.setAttribute('aria-expanded', expanded);
    }
  } // Whether this docked drawer is, at the moment, a column of the page.


  get dockColumn() {
    return this._dockColumn;
  }

  setDockColumn(column) {
    this._dockColumn = column;
    this.getDrawerRoot()?.setAttribute('data-sf-drawer-column', column ? 'true' : 'false');
  }

  get dockSide() {
    const placement = this.placement;
    if (placement === 'inline-start') return 'start';
    if (placement === 'inline-end') return 'end';
    const rtl = globalThis.getComputedStyle?.(document.documentElement).direction === 'rtl';
    if (placement === 'left') return rtl ? 'end' : 'start';
    return rtl ? 'start' : 'end';
  }

  get size() {
    return this.getProp('size');
  }

  resolveDrawerId() {
    const existing = this.id || this.getAttribute('drawer-id');

    if (existing) {
      // A drawer-id the page wrote is also the element's id, as it was; the
      // path id the drawer made for itself is not.
      if (!this.id && existing !== this._generatedDrawerId) this.id = existing;
      return existing;
    } // Its path id (§7.1.1): sf-drawer-<n> in document order, not a random one
    // (simai/ui-source#41). It names the portal and the title, not the element:
    // an id written on the element would change the order the next drawer
    // without one counts in, and two drawers would share a path.


    const generated = (0,_core_js_instance_path__WEBPACK_IMPORTED_MODULE_4__.partId)((0,_core_js_instance_path__WEBPACK_IMPORTED_MODULE_4__.instancePath)(this));
    this._generatedDrawerId = generated;
    this.setAttribute('drawer-id', generated);
    return generated;
  }

  templateContext() {
    this._switchVisible = this.controlled && this.hasVisibleSwitch();
    if (this.docked && typeof document !== 'undefined') this._dockColumn = drawerManager.reservesDock(this);
    return this.createTemplateContext({
      drawerId: this.drawerId || this.resolveDrawerId(),
      // A path id (§7.1.1): <path>--title.
      titleId: (0,_core_js_instance_path__WEBPACK_IMPORTED_MODULE_4__.partId)((0,_core_js_instance_path__WEBPACK_IMPORTED_MODULE_4__.instancePath)(this), 'title'),
      open: this.openState,
      placement: this.placement,
      overlay: this.overlay,
      modal: this.modal,
      docked: this.docked,
      column: this.docked && this._dockColumn,
      size: this.size,
      showClose: this.showClose && !this._switchVisible,
      controlled: this.controlled,
      sheet: this.sheet,
      snap: this.snap,
      handleLabel: this.sfWord('handle-label'),
      blockStart: this.getAttribute('block-start') || '',
      closePlacement: this.closePlacement,
      title: this.getAttribute('heading') || '',
      // The name: label, else the heading the panel is labelled by (§4.8).
      label: this.getAttribute('label') || '',
      closeLabel: this.getAttribute('close-label') || this.defaultCloseLabel,
      width: this.getAttribute('width') || '',
      stackOffset: this.stackOffset,
      gutter: this.gutter,
      zIndex: this.drawerZIndex,
      overlayClass: this.getAttribute('overlay-class') || '',
      panelClass: this.getAttribute('panel-class') || '',
      panelStyle: this.getAttribute('panel-style') || '',
      headerClass: this.getAttribute('header-class') || '',
      bodyClass: this.getAttribute('body-class') || '',
      closeClass: this.getAttribute('close-class') || ''
    });
  } // The resolved z-index the panel is drawn at; the attribute replaces it.


  get zIndex() {
    return this.drawerZIndex;
  }

  set zIndex(value) {
    if (value === null || value === undefined || value === '') this.removeAttribute('z-index');else this.setAttribute('z-index', String(value));
  } // Its place in the one layer scale (--sf-z-index-layer, in opening order
  // with every other layer); a page's --sf-drawer-z-index moves the base, the
  // z-index attribute replaces it.


  get drawerZIndex() {
    const base = (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_5__.layerZIndexAt)(0);
    const rise = this._stackIndex > 0 ? (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_5__.layerZIndexAt)(this._stackIndex) - base : 0;
    return this.getAttribute('z-index') || `calc(var(--sf-drawer-z-index, ${base}) + ${rise})`;
  } // The shared rule, not a second reading of it. This asked the document
  // directly, which misses a region that names its own language and leaves a
  // product unable to register a third -- the same two faults admin-menu had.


  get defaultCloseLabel() {
    return this.sfWord('close-label');
  }

  async renderComponent(changedAttributes = []) {
    const token = ++this._renderToken;
    const result = await this.resolveTemplateResult(changedAttributes);
    if (!this._isMounted || token !== this._renderToken) return;
    const portal = this.resolvePortalRoot(); // The portal stands at the end of the body; it speaks and looks as the
    // drawer does where it stands (standard 1.3.8 §19.1).

    (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_5__.carryLayerOrigin)(portal, this, {
      variables: DRAWER_VARIABLES
    }); // Static markup printed for the first paint goes as the drawer draws
    // (standard 1.3.8 §5.4); the panel itself is rendered in the portal.

    if (!this.__sfFirstPaintEnded) {
      this.__sfFirstPaintEnded = true;
      this.prepareRenderContainer();
    }

    (0,lit__WEBPACK_IMPORTED_MODULE_0__.render)(result, portal);
    this.afterRender();
  } // The panel is rendered at the end of the body, above the page -- or, when the
  // drawer stands inside a [data-sf-overlay-container] (or the older
  // [data-sf-drawer-container]), at the end of that box,
  // which then frames it (contain: layout makes it the panel's containing
  // block): an editor pane or a documentation example holds its own drawer
  // without a stage of its own (DEV, 2026-10-18).


  resolvePortalRoot() {
    if (this._portalRoot?.isConnected) return this._portalRoot;
    const home = this.closest(OVERLAY_CONTAINER) || document.body;
    const selector = `[${PORTAL_ATTRIBUTE}="${escapeSelector(this.drawerId)}"]`;
    this._portalRoot = home.querySelector(selector) || document.createElement('div');

    this._portalRoot.setAttribute(PORTAL_ATTRIBUTE, this.drawerId);

    if (!this._portalRoot.isConnected) home.append(this._portalRoot);
    return this._portalRoot;
  } // A consumer's bar or edge control may appear long after the drawer connected
  // -- when a record becomes editable, say. The content is captured once, and
  // the drawer renders on its own schedule, so without watching for new children
  // such a node stands where the drawer's own children render: above everything.


  watchForAreaChildren() {
    if (this._areaObserver) return;
    this._areaObserver = new MutationObserver(() => {
      const root = this.getDrawerRoot();
      if (root) this.projectAreas(root);
    });

    this._areaObserver.observe(this, {
      childList: true
    });
  }

  projectAreas(root) {
    for (const [slot, selector] of [['edge', '[data-sf-drawer-edge]']]) {
      const area = root.querySelector(selector);
      if (!area) continue;
      const waiting = [...this._contentNodes.filter(node => asksFor(node, slot) && node.parentElement !== area), ...[...this.children].filter(node => asksFor(node, slot))];
      if (waiting.length) area.append(...new Set(waiting));
    }
  }

  afterRender() {
    const root = this.getDrawerRoot();
    if (!root) return; // A child may ask for the edge, which stands beside the panel, or for the
    // foot, which holds the bottom of it and does not scroll with the body.
    // Everything else is the drawer's content, as before.
    //
    // This runs on every render, not only on the first: the content is captured
    // once, when the element connects, and a consumer whose bar appears later --
    // when a record becomes editable, say -- would otherwise leave it standing
    // where the drawer's own children render, above everything.

    this.projectAreas(root);
    this.watchForAreaChildren();
    const body = root.querySelector('[data-sf-drawer-body]');

    if (body && body.dataset.sfDrawerContentReady !== '1') {
      // A child asking for the edge goes beside the panel, not into it. Every
      // other child is the drawer's content, as before.
      body.replaceChildren(...this._contentNodes.filter(node => !asksForArea(node)));
      body.dataset.sfDrawerContentReady = '1';
    }

    root.removeEventListener('click', this.handleRootClick);
    root.addEventListener('click', this.handleRootClick);
    const handle = root.querySelector('[data-sf-drawer-handle]');
    const head = root.querySelector('.sf-drawer-head');

    for (const grip of [handle, head]) {
      grip?.removeEventListener('pointerdown', this.onSheetPointerDown);
      grip?.addEventListener('pointerdown', this.onSheetPointerDown);
    }

    handle?.removeEventListener('keydown', this.onHandleKeyDown);
    handle?.addEventListener('keydown', this.onHandleKeyDown);
    this.applyStackPosition();
    this.observeDock(root); // Lifecycle copies retire (vocabulary §5.1, §16.13): still sent until their
    // date, and a listener that reads one is noted.

    const eventName = this._hasEmittedReady ? 'drawer:update' : 'drawer:ready';
    this.dispatchEvent(retiredEvent(eventName, {
      component: this,
      drawer: this,
      drawerId: this.drawerId,
      root
    }));
    this._hasEmittedReady = true;

    if (this._focusAfterRender || this._emitAfterOpen) {
      this._focusAfterRender = false;
      requestAnimationFrame(() => {
        if (this.openState && this.modal) this.focusFirst();
        if (this._emitAfterOpen) this.emitDrawerEvent('opened');
        this._emitAfterOpen = false;
      });
    }
  }

  template() {
    const context = this.templateContext();
    const closeButton = context.showClose ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<button
          type="button"
          class=${joinClasses('sf-icon-button sf-drawer-close sf-icon-button--close sf-icon-button--link sf-icon-button--on-surface sf-icon-button--size-1/3 m-0', context.closePlacement === 'outside' && 'sf-drawer-close--outside', context.closeClass)}
          aria-label=${context.closeLabel}
          data-drawer="close"
          data-sf-drawer-close=${context.drawerId}
        >
          <span class="sf-close sf-close--size-1/3 flex justify-center items-center" aria-hidden="true">
            <span class="sf-close-icon"></span>
          </span>
        </button>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div
      class=${joinClasses('sf-drawer', context.open && 'is-open', context.rootClass)}
      style=${`z-index:${context.zIndex};${context.width ? `--sf-drawer-width:${context.width};` : ''}${context.stackOffset ? `--sf-drawer-stack-offset:${context.stackOffset};` : ''}${context.blockStart ? `--sf-drawer-block-start:${context.blockStart};` : ''}${context.rootStyle || ''}`}
      data-sf-drawer-root
      data-sf-drawer-id=${context.drawerId}
      data-sf-drawer-placement=${context.placement}
      data-sf-drawer-size=${context.size}
      data-sf-drawer-modal=${context.modal ? 'true' : 'false'}
      data-sf-drawer-docked=${context.docked ? 'true' : 'false'}
      data-sf-drawer-column=${context.column ? 'true' : 'false'}
      data-sf-drawer-snap=${context.sheet ? context.snap : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      aria-hidden=${context.open ? 'false' : 'true'}
    >
      <div class=${joinClasses('sf-drawer-overlay', context.overlayClass)} data-sf-drawer-overlay ?hidden=${!context.modal || !context.overlay}></div>
      <section
        class=${joinClasses('sf-drawer-panel', context.panelClass)}
        style=${`${context.width ? `--sf-drawer-width:${context.width};` : ''}${context.stackOffset ? `--sf-drawer-stack-offset:${context.stackOffset};` : ''}${context.gutter ? `--sf-drawer-gutter:${context.gutter};` : ''}${context.panelStyle || ''}`}
        role=${context.docked && !context.modal ? 'region' : 'dialog'}
        aria-modal=${context.modal ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        aria-label=${context.label || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        aria-labelledby=${context.title ? context.titleId : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        tabindex="-1"
        ?inert=${!context.open}
        data-sf-drawer-panel
      >
        ${context.sheet ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<button type="button" class="sf-drawer-handle" aria-label=${context.handleLabel}
            data-sf-drawer-handle><span class="sf-drawer-handle-bar" aria-hidden="true"></span></button>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        ${context.title || context.showClose && context.closePlacement === 'inside' || context.headerClass ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                  <header class=${joinClasses('sf-drawer-head', context.headerClass)}>
                    ${context.title ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-drawer-title" id=${context.titleId}>${context.title}</div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    ${context.closePlacement === 'inside' ? closeButton : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                  </header>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        <div class=${joinClasses('sf-drawer-body', context.bodyClass)} data-sf-drawer-body></div>
      </section>
      <div class="sf-drawer-edge" data-sf-drawer-edge>
        ${context.closePlacement === 'outside' ? closeButton : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      </div>
    </div>`;
  } // Opens the panel, or raises an open one. Answers an outcome (§4.4):
  // refused when a listener prevents sf-drawer-open.


  open(options = {}) {
    options = options || {};

    if (this.openState) {
      drawerManager.bringToFront(this);
      return applied();
    }

    if (options.emit !== false && !this.emitDrawerEvent('open', true)) return refused('prevented');
    this._lastActive = document.activeElement;
    this._focusReturnAncestors = (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_5__.landmarksAround)(this._lastActive);
    this.syncOpenAttribute(true);
    drawerManager.add(this);
    this._focusAfterRender = this.modal;
    this._emitAfterOpen = options.emit !== false;
    this.requestComponentUpdate('open');
    return applied();
  } // options.reason says why (standard 1.3.8 §19.3): close, escape, outside,
  // cancelled or api, the default.
  // A listener that prevents sf-drawer-close keeps it open, and the action
  // answers refused (§8); `unsaved` is the setting (§19.3).


  close(options = {}) {
    options = options || {};
    if (!this.openState) return refused('closed');
    const reason = typeof options.reason === 'string' ? options.reason : 'api';
    if (options.emit !== false && !this.emitDrawerEvent('close', true, {
      reason,
      unsaved: Boolean(this.unsaved)
    })) return refused('prevented');
    this.syncOpenAttribute(false);
    const wasTop = drawerManager.remove(this);
    this.requestComponentUpdate('close');
    this.returnFocus(wasTop);
    if (options.emit !== false) this.emitDrawerEvent('closed', false, {
      reason
    });
    return applied();
  } // A drawer that closes under another layer moves no focus (§19.2). A modal
  // drawer on top gives it back by the stack's rule; a modeless one to what
  // was active when it opened, as before.


  returnFocus(wasTop) {
    if (!wasTop) return;
    if (this.modal) (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_5__.returnLayerFocus)(true, this._lastActive, this._focusReturnAncestors);else this.restoreFocus();
  }

  toggle() {
    return this.openState ? this.close() : this.open();
  }

  setState(state = {}) {
    if (state && typeof state === 'object' && Object.prototype.hasOwnProperty.call(state, 'open')) {
      const {
        open: requestedOpen,
        ...rest
      } = state;
      requestedOpen ? this.open() : this.close();
      return super.setState(rest);
    }

    return super.setState(state);
  }

  getState() {
    return { ...this.templateContext(),
      open: this.openState
    };
  }

  syncExternalOpenState(open) {
    if (open) {
      this._lastActive = document.activeElement;
      this._focusReturnAncestors = (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_5__.landmarksAround)(this._lastActive);
      this._focusAfterRender = this.modal;
      drawerManager.add(this);
    } else {
      this.returnFocus(drawerManager.remove(this));
    }

    this.requestComponentUpdate(open ? 'open' : 'close');
  }

  syncOpenAttribute(open) {
    this._syncingOpenAttribute = true;
    this.toggleAttribute('open', open);
    this._syncingOpenAttribute = false;
  }

  getDrawerRoot() {
    return this._portalRoot?.querySelector('[data-sf-drawer-root]') || null;
  }

  observeDock(root) {
    const panel = root.querySelector('[data-sf-drawer-panel]');

    if (!this.docked || !panel || typeof ResizeObserver !== 'function') {
      this._dockObserver?.disconnect();
      this._dockObserver = null;
      if (this.docked) drawerManager.syncDock();
      return;
    }

    if (!this._dockObserver) this._dockObserver = new ResizeObserver(() => drawerManager.syncDock());

    this._dockObserver.disconnect();

    this._dockObserver.observe(panel);

    drawerManager.syncDock();
  }

  applyStackPosition(index = (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_5__.layerIndex)(this)) {
    this._stackIndex = index;
    const root = this.getDrawerRoot();

    if (root) {
      root.style.zIndex = this.drawerZIndex; // Depth is the number of open, undocked drawers below this one at the
      // same edge; the panel stands that many stack offsets in from the edge.

      const edge = this.stackEdge;
      const drawers = openDrawers();
      const depth = this.docked || index < 0 ? 0 : drawers.slice(0, Math.max(0, drawers.indexOf(this))).filter(drawer => drawer.openState && !drawer.docked && drawer.stackEdge === edge).length;
      root.style.setProperty('--sf-drawer-stack-depth', String(depth));
    }

    return this;
  } // The panel takes the focus, not the first control inside it. A modal has to
  // hold the focus, which is why this exists -- but handing it to whatever
  // control happens to be first put a focus ring on a star nobody had pressed,
  // and a person reading the panel saw a control announced instead of the panel.
  // A consumer that wants a field focused says so with `autofocus`.


  focusFirst() {
    const panel = this.getDrawerRoot()?.querySelector('[data-sf-drawer-panel]');
    const wanted = panel?.querySelector('[autofocus]');
    (wanted || panel)?.focus?.();
  }

  restoreFocus() {
    const target = this._lastActive;
    if (!(target instanceof HTMLElement) || !target.isConnected || target.matches(':disabled,[hidden],[inert]')) return;
    target.focus();
  } // The sheet's resting height. Set by the handle, a swipe or the attribute;
  // drawer:snap says where it came to rest.


  setSnap(snap) {
    if (!SNAPS.includes(snap) || snap === this.snap) return this;
    this.setAttribute('snap', snap);
    this.emitDrawerEvent('snapped', false, {
      snap
    });
    return this;
  } // The handle is a button: a press or Enter toggles half and full, the arrows
  // step up and down through the resting heights. Escape still closes.


  onHandleKeyDown(event) {
    const at = SNAPS.indexOf(this.snap);
    const step = {
      ArrowUp: 1,
      ArrowDown: -1
    }[event.key];
    if (step === undefined) return;
    event.preventDefault();
    this.setSnap(SNAPS[Math.min(SNAPS.length - 1, Math.max(0, at + step))]);
  } // A swipe on the handle or the head: the sheet follows the finger down, and
  // on release either closes (or steps down from full), opens to full when
  // pushed up, or settles back. Controls inside the head keep their presses.


  onSheetPointerDown(event) {
    if (!this.sheet || !this.openState || event.button !== 0) return;
    const grip = event.currentTarget;
    if (grip.classList.contains('sf-drawer-head') && event.target.closest('button, a[href], input, select, textarea, [tabindex]')) return;
    const panel = this.getDrawerRoot()?.querySelector('[data-sf-drawer-panel]');
    if (!panel) return;
    const startY = event.clientY;
    const startTime = event.timeStamp;
    const height = panel.getBoundingClientRect().height || 1;
    let moved = false;
    let delta = 0;
    grip.setPointerCapture?.(event.pointerId);

    const move = moveEvent => {
      delta = moveEvent.clientY - startY;
      if (!moved && Math.abs(delta) < 4) return;
      moved = true;
      panel.classList.add('is-dragging');
      panel.style.setProperty('--sf-drawer-sheet-drag', `${Math.max(0, delta)}px`);
    };

    const end = endEvent => {
      grip.removeEventListener('pointermove', move);
      grip.removeEventListener('pointerup', end);
      grip.removeEventListener('pointercancel', end);
      panel.classList.remove('is-dragging');
      panel.style.removeProperty('--sf-drawer-sheet-drag');
      if (!moved || endEvent.type === 'pointercancel') return; // A drag that ends on the handle is not also a press of it.

      grip.addEventListener('click', clickEvent => clickEvent.stopImmediatePropagation(), {
        capture: true,
        once: true
      });
      const speed = delta / Math.max(1, endEvent.timeStamp - startTime);

      if (delta > height * SWIPE_SHARE || speed > SWIPE_SPEED) {
        if (this.snap === 'full') this.setSnap('half');else this.close();
      } else if (-delta > height * SWIPE_SHARE || speed < -SWIPE_SPEED) {
        this.setSnap('full');
      }
    };

    grip.addEventListener('pointermove', move);
    grip.addEventListener('pointerup', end);
    grip.addEventListener('pointercancel', end);
  }

  handleRootClick(event) {
    const root = this.getDrawerRoot();

    if (event.target instanceof Element && event.target.closest('[data-sf-drawer-handle]')) {
      this.setSnap(this.snap === 'full' ? 'half' : 'full');
      return;
    } // A press outside is the top layer's only.


    if (event.target === root?.querySelector('[data-sf-drawer-overlay]') && this.closeOnOverlay && this.dismissible && drawerManager.isTop(this)) {
      this.close({
        reason: 'outside'
      });
      return;
    }

    if (event.target instanceof Element && event.target.closest('[data-sf-drawer-close]')) {
      event.preventDefault();
      this.close({
        reason: 'close'
      });
    }
  } // The layer stack hands the drawer Escape and Tab while it is the top layer:
  // a modal, a list or a drawer opened from it takes them instead. Answers
  // true when it took Escape; the stack then stops the press.


  onKeyDown(event) {
    // An editor or drag operation that handled Escape keeps it.
    if (event.defaultPrevented || !this.openState || !drawerManager.isTop(this)) return false;

    if (event.key === 'Escape' && this.closeOnEsc && this.dismissible) {
      this.close({
        reason: 'escape'
      });
      return true;
    }

    if (!this.modal) return false;
    if (event.key !== 'Tab') return false;
    const panel = this.getDrawerRoot()?.querySelector('[data-sf-drawer-panel]'); // The edge beside the panel is part of the window: its close, a copy and
    // an open-full control stand there. Cycled through the panel alone, Tab
    // never reached them (simai.main keyboard QA, 2026-10-28).

    const edge = this.getDrawerRoot()?.querySelector('[data-sf-drawer-edge]');

    const inside = element => Boolean(element && (panel?.contains(element) || edge?.contains(element)));

    const focusable = [panel, edge].flatMap(area => Array.from(area?.querySelectorAll(FOCUSABLE_SELECTOR) || [])).filter(element => element.getClientRects().length > 0);

    if (focusable.length === 0) {
      event.preventDefault();
      panel?.focus();
      return false;
    }

    const first = focusable[0];
    const last = focusable.at(-1);

    if (!inside(document.activeElement)) {
      event.preventDefault();
      (event.shiftKey ? last : first).focus();
    } else if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }

    return false;
  } // Sends one of the drawer's events by its verb (§8): sf-drawer-<verb> first,
  // then its old drawer:* name with the old detail through the alias table.
  // Data only in detail; answers false when a listener refused it.


  emitDrawerEvent(verb, cancelable = false, extra = {}) {
    return this.sfEmit(verb, {
      drawerId: this.drawerId,
      ...extra
    }, {
      cancelable
    });
  } // The old drawer:* names keep their old detail (§16.20 split rows): the new
  // names carry data only (§8), the old ones also the element and its panel.


  sfAliasAdapters() {
    const add = detail => ({ ...detail,
      component: this,
      drawer: this,
      root: this.getDrawerRoot()
    });

    return Object.fromEntries(OLD_EVENT_NAMES.map(name => [name, add]));
  } // The on* helpers keep their original meaning: only this drawer's events,
  // not those bubbling up from a nested drawer; by their new names (§8).


  ownDrawerHandler(handler) {
    return event => {
      if (event.target === this) handler.call(this, event);
    };
  }

  onDrawerEvent(verb, handler, options) {
    if (typeof handler === 'function') this.addEventListener(this.sfEventName(verb), this.ownDrawerHandler(handler), options);
    return this;
  }

  onBeforeOpen(handler, options) {
    return this.onDrawerEvent('open', handler, options);
  }

  onAfterOpen(handler, options) {
    return this.onDrawerEvent('opened', handler, options);
  }

  onBeforeClose(handler, options) {
    return this.onDrawerEvent('close', handler, options);
  }

  onAfterClose(handler, options) {
    return this.onDrawerEvent('closed', handler, options);
  }

  clearPortal() {
    if (!this._portalRoot) return;
    (0,lit__WEBPACK_IMPORTED_MODULE_0__.render)(lit__WEBPACK_IMPORTED_MODULE_0__.nothing, this._portalRoot);

    this._portalRoot.remove();

    this._portalRoot = null;
  }

}

SfDrawer.define(DRAWER_SELECTOR);
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "fefa0c5c3ed9"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "d3818183b14c"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("deprecations", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("deprecations", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "5b7d7695b41b"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("element-manifest", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("element-manifest", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "e92fd2d1a38c"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("instance-path", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("instance-path", 1).then(resolve, reject), { once: true })));

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

/***/ "d6e446f3d408"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-drawer for the shim (core/js/aliases.js, standard §16 item 20). mode: same-detail, split (the old detail from the element\'s adapter), page-trigger (a page attribute the drawer reads, no shim), retired (no new name; kept and noted by the component until the date).","component":"sf-drawer","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"title","to":"heading","kind":"setting","component":"sf-drawer","since":"2026-10-27","remove_after":"2026-12-01","section":"§3.1, §16 item 26"},{"from":"drawer:before-open","to":"sf-drawer-open","kind":"event","component":"sf-drawer","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":true,"section":"§8, vocabulary §5, §5.1, §9","note":"the old detail adds component, drawer and root (page elements, which §8 takes out of the new detail): the element\'s detail adapter makes it"},{"from":"drawer:after-open","to":"sf-drawer-opened","kind":"event","component":"sf-drawer","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":false,"section":"§8, vocabulary §5, §5.1, §9","note":"the old detail adds component, drawer and root (page elements, which §8 takes out of the new detail): the element\'s detail adapter makes it"},{"from":"drawer:before-close","to":"sf-drawer-close","kind":"event","component":"sf-drawer","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":true,"section":"§8, vocabulary §5, §5.1, §9","note":"the old detail adds component, drawer and root (page elements, which §8 takes out of the new detail): the element\'s detail adapter makes it"},{"from":"drawer:after-close","to":"sf-drawer-closed","kind":"event","component":"sf-drawer","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":false,"section":"§8, vocabulary §5, §5.1, §9","note":"the old detail adds component, drawer and root (page elements, which §8 takes out of the new detail): the element\'s detail adapter makes it"},{"from":"drawer:snap","to":"sf-drawer-snapped","kind":"event","component":"sf-drawer","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":false,"section":"§8, vocabulary §5, §5.1, §9","note":"the old detail adds component, drawer and root (page elements, which §8 takes out of the new detail): the element\'s detail adapter makes it"},{"from":"drawer:ready","to":null,"kind":"event","component":"sf-drawer","since":"2026-10-27","remove_after":"2026-12-01","mode":"retired","section":"vocabulary §5.1, §16.13","note":"a lifecycle copy; sf-after-render is the base\'s; still sent until the date, noted when a listener reads it"},{"from":"drawer:update","to":null,"kind":"event","component":"sf-drawer","since":"2026-10-27","remove_after":"2026-12-01","mode":"retired","section":"vocabulary §5.1, §16.13","note":"a lifecycle copy; still sent until the date, noted when a listener reads it"},{"from":"data-sf-drawer-open","to":"data-sf-action","kind":"attribute","component":"sf-drawer","since":"2026-10-27","remove_after":"2026-12-01","mode":"page-trigger","section":"§8, §16.10","note":"a page trigger: data-sf-drawer-open=\\"<id>\\" is data-sf-action=\\"<id>.open\\"; read by the drawer, no shim (the shim maps an element\'s own attributes)"},{"from":"data-sf-drawer-close","to":"data-sf-action","kind":"attribute","component":"sf-drawer","since":"2026-10-27","remove_after":"2026-12-01","mode":"page-trigger","section":"§8, §16.10","note":"data-sf-action=\\"<id>.close\\""},{"from":"data-sf-drawer-toggle","to":"data-sf-action","kind":"attribute","component":"sf-drawer","since":"2026-10-27","remove_after":"2026-12-01","mode":"page-trigger","section":"§8, §16.10","note":"data-sf-action=\\"<id>.toggle\\""}]}');

/***/ },

/***/ "0dc7c163a2e8"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.drawer","tag":"sf-drawer","version":"1.8.2","kind":"leaf","settings":{"placement":{"type":"enum","values":["left","right","inline-start","inline-end","bottom"],"default":"right"},"snap":{"type":"enum","values":["auto","half","full"],"default":"auto"},"overlay":{"type":"boolean","default":true},"modal":{"type":"boolean","default":true},"docked":{"type":"boolean","default":false},"size":{"type":"enum","values":["1/2","1","2","full"],"default":"1"},"close-on-esc":{"type":"boolean","default":true},"close-on-overlay":{"type":"boolean","default":true},"preserve-scroll-gap":{"type":"boolean","default":true},"show-close":{"type":"boolean","default":true},"controlled":{"type":"boolean","default":false},"close-placement":{"type":"enum","values":["inside","outside"],"default":"inside"},"heading":{"type":"string","default":""},"label":{"type":"string","default":""},"close-label":{"type":"string","default-from":"runtime.close-label"},"width":{"type":"string","default":""},"stack-offset":{"type":"string","default":""},"dock-breakpoint":{"type":"string","default":""},"block-start":{"type":"string","default":""},"gutter":{"type":"string","default":""},"z-index":{"type":"string","default":""},"overlay-class":{"type":"string","default":""},"panel-class":{"type":"string","default":""},"panel-style":{"type":"string","default":""},"header-class":{"type":"string","default":""},"body-class":{"type":"string","default":""},"close-class":{"type":"string","default":""},"unsaved":{"type":"boolean","default":false},"dismissible":{"type":"boolean","default":true}},"values":{"open":{"type":"boolean","default":false}},"events":{"open":{"carries":{"drawer-id":"string"},"cancelable":true},"opened":{"carries":{"drawer-id":"string"}},"close":{"carries":{"drawer-id":"string","reason":{"type":"enum","values":["close","escape","outside","cancelled","api"]},"unsaved":"boolean"},"cancelable":true},"closed":{"carries":{"drawer-id":"string","reason":{"type":"enum","values":["close","escape","outside","cancelled","api"]}}},"snapped":{"carries":{"drawer-id":"string","snap":{"type":"enum","values":["auto","half","full"]}}}},"actions":{"open":{"emits":"open"},"close":{"with":{"reason":{"type":"enum","values":["close","escape","outside","cancelled","api"]}},"emits":"close"},"toggle":{}},"layer":{"kind":"panel","locks-page":true,"traps-focus":true},"css-variables":{"--sf-drawer-background":{"type":"color","state":"default"},"--sf-drawer-color":{"type":"color","state":"default"},"--sf-drawer-overlay-background":{"type":"color","state":"overlay"},"--sf-drawer-gutter":{"type":"length","state":"default"},"--sf-drawer-block-start":{"type":"length","state":"default"},"--sf-drawer-dock-breakpoint":{"type":"length","state":"docked"},"--sf-drawer-z-index":{"type":"number","state":"default"}}}');

/***/ },

/***/ "a3b41385ab12"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Drawer","runtime":{"close-label":"Close drawer","handle-label":"Resize the panel"}}');

/***/ },

/***/ "ce0ca620b623"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Панель","runtime":{"close-label":"Закрыть панель","handle-label":"Изменить высоту панели"}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("5f0529568b98");
/******/
/******/ })()
;