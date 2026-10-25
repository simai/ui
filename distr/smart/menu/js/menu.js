/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "421676f72963"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   OPEN_SURFACE_MARK: () => (/* binding */ OPEN_SURFACE_MARK),
/* harmony export */   holdOpenSurfaceMark: () => (/* binding */ holdOpenSurfaceMark),
/* harmony export */   isOpenSurfaceMarked: () => (/* binding */ isOpenSurfaceMarked),
/* harmony export */   isTopOpenSurface: () => (/* binding */ isTopOpenSurface)
/* harmony export */ });
// While a transient surface is open the root says so, and a component whose own
// Escape closes something larger -- a drawer, a modal, a record panel -- stands
// back. They all listen on the document in capture, where stopPropagation
// cannot reach a listener on the same node and the one registered first wins
// whatever it is: without a shared mark, one press closed the surface and the
// window behind it together.
//
// The mark started inside sf-popover, which made it that component's state
// instead of the protocol it is: a dropdown list is the same kind of surface and
// raised nothing, so Escape over an open list closed the record panel behind it
// (Larena storage QA, 2026-10-22) -- and a drawer and a modal read the same mark,
// so the same press closed those too. It lives here now, raised by every surface
// that owns Escape while it is open and read by every component that owns Escape
// for something larger.
//
// The attribute name is unchanged, because it is already the published protocol:
// `document.documentElement.dataset.sfPopoverOpen`.
const OPEN_MARK = 'sfPopoverOpen'; // A count, not a flag: two surfaces can be open at once -- a dropdown inside a
// popover -- and the first to close must not clear the mark the second needs.

const held = new WeakSet(); // The same holders in the order they opened, so the one opened last -- the
// innermost layer -- is known. The mark answers "is anything open"; this answers
// "is it me". Two surfaces that both listen on the document in capture cannot
// settle it with stopPropagation, which does not reach a listener on the same
// node: a calendar opened inside a popover closed together with the popover, and
// a popover closed over a dropdown list it held and left the list open.
//
// Kept on a shared global, not in module scope: every Smart bundle carries its
// own copy of this module, so a module-scope list in the popover's bundle never
// saw the calendar the datepicker's bundle opened. The count lives on the root
// for the same reason.

const LAYERS_KEY = Symbol.for('sf.openSurfaceLayers');

function openLayers() {
  const scope = globalThis;
  if (!Array.isArray(scope[LAYERS_KEY])) scope[LAYERS_KEY] = [];
  return scope[LAYERS_KEY];
}

function step(delta) {
  const root = globalThis.document?.documentElement;
  if (!root) return;
  const next = Math.max(0, Number(root.dataset[OPEN_MARK] || 0) + delta);
  if (next) root.dataset[OPEN_MARK] = String(next);else delete root.dataset[OPEN_MARK];
} // Idempotent for one owner, so a component can call it from every update with
// its own open state and only a change moves the count. An owner that is removed
// while open releases it the same way, from wherever it tears down.


function holdOpenSurfaceMark(owner, open) {
  if (!owner) return;
  const wanted = Boolean(open);
  if (wanted === held.has(owner)) return;
  const layers = openLayers();

  if (wanted) {
    held.add(owner);
    layers.push(owner);
  } else {
    held.delete(owner);
    const at = layers.lastIndexOf(owner);
    if (at >= 0) layers.splice(at, 1);
  }

  step(wanted ? 1 : -1);
} // What a surface asks before its own Escape closes it: whether it is the
// innermost open layer. A holder that left the document without releasing is
// passed over rather than allowed to hold every Escape on the page. An owner
// that holds nothing is the top only when nothing else is open.

function isTopOpenSurface(owner) {
  const layers = openLayers();

  for (let at = layers.length - 1; at >= 0; at -= 1) {
    const layer = layers[at];
    if (layer?.isConnected === false) continue;
    return layer === owner;
  }

  return true;
} // What a component asks before its own Escape closes something larger.

function isOpenSurfaceMarked() {
  return Boolean(globalThis.document?.documentElement?.dataset?.[OPEN_MARK]);
}
const OPEN_SURFACE_MARK = OPEN_MARK;

/***/ },

/***/ "3267d93fb0d3"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SfSmartMenu: () => (/* binding */ SfSmartMenu)
/* harmony export */ });
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("fbe0570fcc69");
/* harmony import */ var _core_js_position_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5c1dc214bb5e");
/* harmony import */ var _core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("421676f72963");
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("0d662e4d7d63");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("e29406217b0b");
/* harmony import */ var _items_mjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("7332c9a6d69c");
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("831ef45545b2");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_position_js__WEBPACK_IMPORTED_MODULE_1__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_3__, _js_templates_default__WEBPACK_IMPORTED_MODULE_4__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_position_js__WEBPACK_IMPORTED_MODULE_1__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_3__, _js_templates_default__WEBPACK_IMPORTED_MODULE_4__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_position_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_position_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__);
// sf-menu: site navigation built from data -- a site's sections, a cabinet's
// pages, a documentation tree -- drawn as the class menu (src/component/menu),
// so its styles apply and nothing of them is forked (owner, 2026-10-25). The
// items come from `items` (an array, or the same as JSON) or from a nested
// <ul><li><a> written inside the element.
//
// It is the WAI-ARIA disclosure navigation pattern, not an application menu:
// native links in a named <nav>, a branch's button with aria-expanded and
// aria-controls, the current page marked aria-current="page". Tab walks the
// links and the buttons; Enter and Space are the button's; Escape closes the
// innermost open panel only and gives the focus back to its button.
//
// The element draws the class markup and keeps its state itself: open
// branches, the current page, the panel a row that does not fit becomes. The
// markup carries data-sf-menu-owned, so the class runtime -- loaded beside it
// for the sheet -- leaves it alone and two owners never toggle one branch.






 // Prefer the helper Core published; an isolated bundle uses its own copy.

const positioning = () => globalThis.SF?.Position || (_core_js_position_js__WEBPACK_IMPORTED_MODULE_1___default());

const MENU_TEXT = {
  en: {
    toggleLabel: 'Menu'
  },
  ru: {
    toggleLabel: 'Меню'
  }
};
let sequence = 0;

class SfSmartMenu extends (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()) {
  static get props() {
    return {
      templateName: {
        attribute: 'template',
        default: 'default'
      },
      items: {
        default: []
      },
      orientation: {
        default: 'vertical',
        values: _items_mjs__WEBPACK_IMPORTED_MODULE_5__.MENU_ORIENTATIONS
      },
      appearance: {
        default: 'default',
        values: _items_mjs__WEBPACK_IMPORTED_MODULE_5__.MENU_APPEARANCES
      },
      current: {
        default: ''
      },
      currentFromLocation: {
        attribute: 'current-from-location',
        type: Boolean,
        default: false
      },
      collapse: {
        default: 'auto',
        values: _items_mjs__WEBPACK_IMPORTED_MODULE_5__.MENU_COLLAPSE
      },
      label: {
        default: ''
      },
      toggleLabel: {
        attribute: 'toggle-label',
        default: ''
      },
      rootClass: {
        default: ''
      }
    };
  }

  constructor() {
    super();
    this._id = `sf-smart-menu-${++sequence}`; // undefined: follow the attribute. Set by the property; an attribute
    // written later takes over again.

    this._items = undefined;
    this._childItems = [];
    this._childLabel = ''; // What the person or the host opened and closed, by item id, over the
    // open flag each item carries.

    this._openState = new Map();
    this._panelOpen = false; // A row that did not fit, and the width it needed: it comes back as a row
    // only when that width is there again, so it never flickers between both.

    this._autoCollapsed = false;
    this._neededWidth = 0;
    this._mode = '';
    this._domIds = new Map();
    this._anchors = new Map();
    this._holding = false;
    this._escapeTaken = false; // A value set as a property before the element was defined is an own
    // property that would hide the accessor; it is taken through it.

    if (Object.prototype.hasOwnProperty.call(this, 'items')) {
      const early = this.items;
      delete this.items;
      this._items = (0,_items_mjs__WEBPACK_IMPORTED_MODULE_5__.normaliseItems)(early);
    }

    this.addEventListener('click', this.onClick);
    this.addEventListener('focusin', this.onFocusChange);
    this.addEventListener('focusout', this.onFocusOut);
  }

  attributeChangedCallback(name, previous, next) {
    if (name === 'items' && previous !== next) {
      this._items = undefined;
      this._autoCollapsed = false;
    }

    super.attributeChangedCallback(name, previous, next);
  } // A list written inside the element is the menu too: a <ul> (or a <nav>
  // holding one) of <li> with a link and, for a branch, a nested <ul>. Read
  // once, as slots are, and taken out of the light DOM; without the script it
  // stays a working list of links.


  captureSlotTemplates() {
    const first = !this._slotTemplatesCaptured;
    super.captureSlotTemplates();
    if (!first) return;
    const children = Array.from(this.children);
    const nav = children.find(child => child.localName === 'nav');
    const list = children.find(child => child.localName === 'ul') || nav?.querySelector(':scope > ul');
    if (!list) return;
    this._childItems = (0,_items_mjs__WEBPACK_IMPORTED_MODULE_5__.normaliseItems)((0,_items_mjs__WEBPACK_IMPORTED_MODULE_5__.itemsFromList)(list));
    this._childLabel = nav?.getAttribute('aria-label') || list.getAttribute('aria-label') || '';
    (list.parentElement === nav ? nav : list).remove();
  }

  onConnected() {
    this._onLocation = () => {
      if (this.currentFromLocation) this.requestComponentUpdate('location');
    };

    window.addEventListener('popstate', this._onLocation);
    window.addEventListener('hashchange', this._onLocation);
  }

  onDisconnected() {
    super.onDisconnected();
    window.removeEventListener('popstate', this._onLocation);
    window.removeEventListener('hashchange', this._onLocation);
    this._resizeObserver?.disconnect();
    this._resizeObserver = null;
    this._observed = null;

    for (const submenu of [...this._anchors.keys()]) this.releaseAnchor(submenu);

    this.holdSurface(false);
  } // The items, from the property or the attribute, else from the markup.


  get items() {
    if (this._items !== undefined) return this._items;
    return (0,_items_mjs__WEBPACK_IMPORTED_MODULE_5__.normaliseItems)(this.getAttribute('items'));
  }

  set items(next) {
    this._items = (0,_items_mjs__WEBPACK_IMPORTED_MODULE_5__.normaliseItems)(next);
    this._autoCollapsed = false;
    this.requestComponentUpdate('items');
  }

  get menuItems() {
    const items = this.items;
    return items.length ? items : this._childItems;
  }

  get orientation() {
    return this.getProp('orientation');
  }

  get appearance() {
    return this.getProp('appearance');
  }

  get collapse() {
    return this.getProp('collapse');
  }

  get currentFromLocation() {
    return this.getBooleanAttr('current-from-location', false);
  } // The documentation tree and the compact rail are columns.


  get horizontal() {
    return this.orientation === 'horizontal' && this.appearance === 'default';
  } // The row became a button that opens the same links as a column.


  get collapsed() {
    if (this.collapse === 'always') return true;
    return this.collapse === 'auto' && this.horizontal && this._autoCollapsed;
  } // Branches open as panels beside the row: a row that is shown as a row.


  get flyouts() {
    return this.horizontal && !this.collapsed;
  }

  get panelOpen() {
    return this.collapsed && this._panelOpen;
  } // The id of the item that is the current page, or null.


  get currentId() {
    const here = globalThis.location;
    return (0,_items_mjs__WEBPACK_IMPORTED_MODULE_5__.currentItemId)(this.menuItems, {
      current: this.getProp('current'),
      pathname: here?.pathname || '',
      base: here?.href || '',
      fromLocation: this.currentFromLocation
    });
  } // The ids of the open branches, outermost first.


  get openIds() {
    this.syncMode();
    return [...(0,_items_mjs__WEBPACK_IMPORTED_MODULE_5__.openBranches)(this.menuItems, this._openState, this.currentId, !this.flyouts)];
  }

  isOpen(id) {
    return this.openIds.includes(String(id));
  }

  item(id) {
    return (0,_items_mjs__WEBPACK_IMPORTED_MODULE_5__.findItem)(this.menuItems, id);
  }

  open(id) {
    return this.setOpen(id, true, 'method');
  }

  close(id) {
    return this.setOpen(id, false, 'method');
  }

  toggle(id) {
    return this.setOpen(id, !this.isOpen(id), 'method');
  } // Closes every open panel of a row and the panel of a collapsed menu; the
  // groups of a column keep their state. Returns whether anything changed.


  closeAll() {
    const flyouts = this.flyouts ? this.closeFlyouts('method') : false;
    const panel = this.setPanelOpen(false, 'method');
    return flyouts || panel;
  } // A row's open panels are one chain: opening a branch closes every panel
  // that is not above it, closing one closes the panels inside it. A column's
  // groups open and close each on its own. A disabled branch is not opened or
  // closed by the person. Returns whether anything changed.


  setOpen(id, open, source = 'method') {
    const item = this.item(id);
    if (!item || !item.children.length || this.appearance === 'compact') return false;
    if (item.disabled && source === 'user') return false;
    const before = new Set(this.openIds);
    if (before.has(item.id) === Boolean(open)) return false;
    const after = new Set(before);

    if (this.flyouts) {
      const above = new Set((0,_items_mjs__WEBPACK_IMPORTED_MODULE_5__.pathTo)(this.menuItems, item.id) || []);

      for (const other of before) if (!above.has(other)) after.delete(other);

      if (open) after.add(item.id);
    } else if (open) {
      after.add(item.id);
    } else {
      after.delete(item.id);
    }

    return this.applyOpen(before, after, source, item.id);
  }

  closeFlyouts(source) {
    const before = new Set(this.openIds);
    if (!before.size) return false;
    return this.applyOpen(before, new Set(), source, null);
  }

  applyOpen(before, after, source, asked) {
    const changed = [];
    (0,_items_mjs__WEBPACK_IMPORTED_MODULE_5__.walkItems)(this.menuItems, one => {
      if (one.children.length && before.has(one.id) !== after.has(one.id)) changed.push(one);
    });
    if (!changed.length) return false;

    for (const one of changed) this._openState.set(one.id, after.has(one.id));

    this.requestComponentUpdate('open'); // The branch asked for first, then the ones it closed, innermost first.

    const depth = one => ((0,_items_mjs__WEBPACK_IMPORTED_MODULE_5__.pathTo)(this.menuItems, one.id) || []).length;

    changed.sort((a, b) => a.id === asked ? -1 : b.id === asked ? 1 : depth(b) - depth(a));

    for (const one of changed) {
      this.dispatchEvent(new CustomEvent('sf-menu:toggle', {
        bubbles: true,
        composed: true,
        detail: {
          id: one.id,
          open: after.has(one.id),
          source,
          item: one
        }
      }));
    }

    return true;
  } // The panel of a menu shown as a button. Its event names no item: id null.


  setPanelOpen(open, source = 'method') {
    if (!this.collapsed || this._panelOpen === Boolean(open)) return false;
    this._panelOpen = Boolean(open);
    this.requestComponentUpdate('panel');
    this.dispatchEvent(new CustomEvent('sf-menu:toggle', {
      bubbles: true,
      composed: true,
      detail: {
        id: null,
        open: this._panelOpen,
        source,
        item: null
      }
    }));
    return true;
  } // A change between a row, a column and a button starts from closed panels:
  // a panel opened beside a row is not a group to keep open in a column.


  syncMode() {
    const mode = this.collapsed ? 'collapsed' : this.flyouts ? 'row' : 'column';
    if (mode === this._mode) return;

    if (this._mode) {
      this._openState.clear();

      this._panelOpen = false;
    }

    this._mode = mode;
  } // A stable element id for each item, whatever its own id holds.


  domId(id) {
    if (!this._domIds.has(id)) this._domIds.set(id, this._domIds.size + 1);
    return this._domIds.get(id);
  }

  ownControl(target, selector) {
    const control = target?.closest?.(selector);
    return control && control.closest('sf-menu') === this ? control : null;
  }

  rowItem(control) {
    return this.item(control?.closest('[data-sf-menu-item]')?.dataset.sfMenuItem);
  }

  onClick = event => {
    const panelToggle = this.ownControl(event.target, '[data-sf-menu-panel-toggle]');

    if (panelToggle) {
      this.setPanelOpen(!this._panelOpen, 'user');
      return;
    }

    const toggle = this.ownControl(event.target, '[data-sf-menu-toggle]');

    if (toggle) {
      if (!toggle.disabled) this.setOpen(toggle.dataset.sfMenuToggle, !this.isOpen(toggle.dataset.sfMenuToggle), 'user');
      return;
    }

    const link = this.ownControl(event.target, 'a[data-sf-menu-link]');
    if (link) this.onNavigate(event, link);
  }; // A link's own press: a cancellable sf-menu:navigate first, so a host that
  // routes the page itself prevents it and the browser does not go. A press
  // that opens another tab or window is the browser's alone.

  onNavigate(event, link) {
    if (event.defaultPrevented || event.button > 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if ((link.getAttribute('target') || '_self') !== '_self') return;
    const item = this.item(link.dataset.sfMenuLink);
    if (!item) return;
    const navigate = new CustomEvent('sf-menu:navigate', {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: {
        id: item.id,
        href: item.href,
        item
      }
    });
    this.dispatchEvent(navigate);
    if (navigate.defaultPrevented) event.preventDefault(); // Gone to the page: nothing stays open over it.

    if (this.flyouts) this.closeFlyouts('user');
    this.setPanelOpen(false, 'user');
  }

  onFocusChange = () => {
    this.syncSurface();
  }; // Focus that leaves the element closes a row's panels (WAI-ARIA disclosure
  // navigation); focus that leaves the page keeps them.

  onFocusOut = event => {
    const next = event.relatedTarget;
    if (next instanceof Node && !this.contains(next) && this.flyouts) this.closeFlyouts('user');
    queueMicrotask(() => this.syncSurface());
  }; // A row's open panel is a surface over the page; the panel of a button is
  // one while the focus is in it. Either holds the shared open-surface mark,
  // so a drawer or a modal behind it stands back on Escape, and takes Escape
  // only as the innermost open layer.

  syncSurface() {
    const flyoutOpen = this.flyouts && this.openIds.length > 0;
    const panel = this.panelOpen && this.contains(document.activeElement);
    this.holdSurface(this.isConnected && (flyoutOpen || panel || this._escapeTaken));
  }

  holdSurface(hold) {
    if (hold === this._holding) return;
    this._holding = hold;
    (0,_core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_2__.holdOpenSurfaceMark)(this, hold);

    if (hold) {
      document.addEventListener('keydown', this.onDocumentKeydown, true);
      document.addEventListener('pointerdown', this.onDocumentPointerDown, true);
    } else {
      document.removeEventListener('keydown', this.onDocumentKeydown, true);
      document.removeEventListener('pointerdown', this.onDocumentPointerDown, true);
    }
  } // Escape closes the innermost open panel only -- the deepest open panel of
  // a row, the one the focus is in first, else the panel of the button -- and
  // gives the focus back to the button that opened it.


  onDocumentKeydown = event => {
    if (event.key !== 'Escape' || event.defaultPrevented || !(0,_core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_2__.isTopOpenSurface)(this)) return; // The mark stays up until the press has reached every listener: the
    // re-render after closing runs between two of them, and a drawer reading
    // only the mark would otherwise close on the press that closed the panel.

    this._escapeTaken = true;
    setTimeout(() => {
      this._escapeTaken = false;
      this.syncSurface();
    });
    const innermost = this.innermostOpen();

    if (innermost) {
      event.preventDefault();
      event.stopPropagation();
      this.setOpen(innermost.id, false, 'user');
      this.focusAfterRender(`[data-sf-menu-toggle="${CSS.escape(innermost.id)}"]`);
      return;
    }

    if (this.panelOpen) {
      event.preventDefault();
      event.stopPropagation();
      this.setPanelOpen(false, 'user');
      this.focusAfterRender('[data-sf-menu-panel-toggle]');
    }
  };
  onDocumentPointerDown = event => {
    if ((event.composedPath?.() ?? []).includes(this)) return;
    if (this.flyouts) this.closeFlyouts('user');
  };

  innermostOpen() {
    if (!this.flyouts) return null;
    const open = new Set(this.openIds);
    if (!open.size) return null;

    const depth = id => ((0,_items_mjs__WEBPACK_IMPORTED_MODULE_5__.pathTo)(this.menuItems, id) || []).length;

    const focused = document.activeElement;
    const ids = [...open].sort((a, b) => depth(b) - depth(a));
    const withFocus = ids.find(id => this.querySelector(`[data-sf-menu-item="${CSS.escape(id)}"]`)?.contains(focused)); // The deepest open panel the focus is in or under, else the deepest.

    const deepest = ids[0];
    const chosen = withFocus && depth(withFocus) >= depth(deepest) ? withFocus : deepest;
    return this.item(chosen);
  }

  focusAfterRender(selector) {
    this.whenRendered(() => this.querySelector(selector)?.focus(), {
      next: true
    });
  }

  focusDelegate() {
    return this.querySelector('[data-sf-menu-panel-toggle], a[href], button:not(:disabled)');
  } // A row's panels are placed by the Framework's geometry, as the class menu
  // places them: the first level below its item, deeper ones to the inline
  // end; both flip and shift inside the viewport instead of overflowing it.


  syncAnchors() {
    const wanted = new Set();

    if (this.flyouts) {
      for (const id of this.openIds) {
        const row = this.querySelector(`[data-sf-menu-item="${CSS.escape(id)}"]`);
        const submenu = row?.querySelector(':scope > ul.sf-menu');
        if (!submenu || submenu.hidden) continue;
        wanted.add(submenu);

        const current = this._anchors.get(submenu);

        if (current) {
          current.anchor.update();
          continue;
        }

        const saved = ['min-width', 'overflow-y'].map(name => [name, submenu.style.getPropertyValue(name), submenu.style.getPropertyPriority(name)]); // min-inline-size: 100% would resolve against the viewport once fixed.

        submenu.style.minWidth = `${row.getBoundingClientRect().width}px`;
        submenu.style.overflowY = 'auto';
        const anchor = positioning().anchor(row, submenu, {
          side: row.dataset.sfMenuLevel === '1' ? 'block-end' : 'inline-end',
          align: 'start',
          offset: 0,
          fitHeight: true
        });

        this._anchors.set(submenu, {
          anchor,
          saved
        });
      }
    }

    for (const submenu of [...this._anchors.keys()]) if (!wanted.has(submenu)) this.releaseAnchor(submenu);
  }

  releaseAnchor(submenu) {
    const current = this._anchors.get(submenu);

    if (!current) return;
    current.anchor.stop();

    for (const [name, value, priority] of current.saved) {
      if (value) submenu.style.setProperty(name, value, priority);else submenu.style.removeProperty(name);
    }

    this._anchors.delete(submenu);
  } // A row that does not fit the width it is given becomes the button; it is
  // a row again once the width it needed is there.


  observeWidth() {
    const nav = this.querySelector(':scope > nav.sf-smart-menu');
    if (!nav || typeof ResizeObserver === 'undefined') return;

    if (this._observed !== nav) {
      this._resizeObserver?.disconnect();
      this._resizeObserver = new ResizeObserver(() => this.measureFit());

      this._resizeObserver.observe(nav);

      this._observed = nav;
    }

    this.measureFit();
  }

  measureFit() {
    const nav = this._observed;
    if (!nav?.isConnected) return;

    if (this.collapse !== 'auto' || !this.horizontal) {
      if (this._autoCollapsed) {
        this._autoCollapsed = false;
        this.requestComponentUpdate('collapse');
      }

      return;
    }

    const width = nav.clientWidth;

    if (!this._autoCollapsed) {
      const list = nav.querySelector(':scope > ul.sf-menu');
      const needed = list ? list.scrollWidth : 0;

      if (needed > width + 1) {
        this._neededWidth = needed;
        this._autoCollapsed = true;
        this.requestComponentUpdate('collapse');
      }
    } else if (width >= this._neededWidth) {
      this._autoCollapsed = false;
      this.requestComponentUpdate('collapse');
    }
  }

  afterRender(callback) {
    if (typeof callback === 'function') return super.afterRender(callback);
    this.syncAnchors();
    this.observeWidth();
    this.syncSurface();
    return undefined;
  }

  templateContext() {
    const props = this.getPropsContext();
    this.syncMode();
    const items = this.menuItems;
    return this.createTemplateContext({ ...props,
      component: this,
      id: this._id,
      items,
      open: new Set(this.openIds),
      currentId: this.currentId,
      flyouts: this.flyouts,
      collapsed: this.collapsed,
      panelOpen: this.panelOpen,
      compact: this.appearance === 'compact',
      appearance: this.appearance,
      label: this.getAttribute('aria-label') || this.getProp('label') || this._childLabel,
      toggleLabel: this.getProp('toggleLabel') || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageText)(MENU_TEXT, 'toggleLabel', this),
      domId: id => this.domId(id),
      rootClass: this.getRootClass()
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_4__.renderMenuTemplate)(this.templateContext());
  }

}

SfSmartMenu.define('sf-menu');

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "e29406217b0b"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderMenuTemplate: () => (/* binding */ renderMenuTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ddf1cdb42ecc");
/* harmony import */ var lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("0d9131aa10ba");
/* harmony import */ var _items_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("7332c9a6d69c");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__);




function joinClasses(...tokens) {
  return tokens.flat().filter(Boolean).join(' ');
} // The class menu's level classes: four levels, a deeper one drawn as the
// fourth.


const levelClass = level => `sf-menu-element--level-${Math.min(Math.max(level, 1), _items_mjs__WEBPACK_IMPORTED_MODULE_2__.LEVEL_LIMIT)}`; // The glyph the class runtime writes on a branch: a top-level panel of a row
// opens below it (down, up when open), every other branch opens to its inline
// end (right, down when open; mirrored in RTL by the class sheet).


function branchGlyph(context, level, open) {
  if (context.flyouts && level === 1) return open ? 'keyboard_arrow_up' : 'keyboard_arrow_down';
  return open ? 'keyboard_arrow_down' : 'chevron_right';
} // A count is the class counter: a .sf-badge with data-count, which the badges
// runtime caps at 99+, hides at 0 and names after the label. Any other badge
// is a short label in the same place.


function renderBadge(item) {
  if (!item.badge) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const count = (0,_items_mjs__WEBPACK_IMPORTED_MODULE_2__.badgeCount)(item.badge);
  return count !== null ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-badge" data-count=${count}></span>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-badge">${item.badge}</span>`;
} // What a row holds, in the class order: an icon, the words, a counter.


function renderWrapContent(item) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${item.icon ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class="sf-icon sf-menu-element-icon" aria-hidden="true">${item.icon}</i>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}<span class="sf-menu-element-text">${item.label}</span>${renderBadge(item)}`;
}

const renderWrap = item => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-menu-element-wrap">${renderWrapContent(item)}</span>`; // The branch's disclosure glyph as the class draws it inside a button row: an
// icon-button box hidden from assistive technology, the button being the row.


const renderTrailing = glyph => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-icon-button" aria-hidden="true"><span class="sf-icon" aria-hidden="true">${glyph}</span></span>`;

function renderRow(context, item, level, branch, open, submenuId) {
  const current = context.currentId === item.id;
  const classes = joinClasses('sf-menu-element', levelClass(level), branch ? 'sf-menu-element--has-submenu' : '', open ? 'open' : '', item.disabled ? 'disabled' : '');
  const linked = Boolean(item.href) && !item.disabled;

  if (!branch) {
    // A destination is a link; an unavailable one keeps its place as a link
    // without an address, out of the tab order. A row without an address is
    // words in the row's place.
    if (linked) {
      return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<a class=${classes} href=${item.href} aria-current=${current ? 'page' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                     data-sf-menu-link=${item.id}>${renderWrap(item)}</a>`;
    }

    if (item.disabled) return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<a class=${classes} aria-disabled="true">${renderWrap(item)}</a>`;
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class=${classes} aria-current=${current ? 'page' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>${renderWrap(item)}</span>`;
  }

  const glyph = branchGlyph(context, level, open); // A branch that is also a destination: the link and the disclosure button
  // are siblings inside the row, as the class menu documents.

  if (item.href) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class=${classes}>
      ${linked ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<a class="sf-menu-element-wrap" href=${item.href} aria-current=${current ? 'page' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                  data-sf-menu-link=${item.id}>${renderWrapContent(item)}</a>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<a class="sf-menu-element-wrap" aria-disabled="true">${renderWrapContent(item)}</a>`}
      <button class="sf-icon-button" type="button" aria-expanded=${open ? 'true' : 'false'} aria-controls=${submenuId}
              aria-label=${item.label} ?disabled=${item.disabled}
              data-sf-menu-toggle=${item.id}><span class="sf-icon" aria-hidden="true">${glyph}</span></button>
    </div>`;
  }

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<button class=${classes} type="button" aria-expanded=${open ? 'true' : 'false'} aria-controls=${submenuId}
                      ?disabled=${item.disabled} data-sf-menu-toggle=${item.id}>${renderWrap(item)}${renderTrailing(glyph)}</button>`;
}

function renderItem(context, item, level) {
  // A compact rail opens no branch: its rows are the first level alone.
  const branch = item.children.length > 0 && !context.compact;
  const open = branch && context.open.has(item.id);
  const submenuId = `${context.id}-menu-${context.domId(item.id)}`;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <li class=${joinClasses('sf-menu-item', branch ? 'sf-menu-item--has-submenu' : '', open ? 'open' : '')}
        data-sf-menu-item=${item.id} data-sf-menu-level=${level}>
      ${renderRow(context, item, level, branch, open, submenuId)}
      ${branch ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<ul class="sf-menu" id=${submenuId} ?hidden=${!open}>${renderItems(context, item.children, level + 1)}</ul>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    </li>
  `;
}

function renderItems(context, items, level) {
  return (0,lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__.repeat)(items, item => item.id, item => renderItem(context, item, level));
} // The button a row that does not fit becomes: a class menu row (a size 1
// control, as every row), the menu glyph and its words, the disclosure glyph
// at its end.


function renderPanelToggle(context) {
  const open = context.panelOpen;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<button class=${joinClasses('sf-menu-element', 'sf-menu-element--level-1', 'sf-menu-element--has-submenu', 'sf-smart-menu-toggle', open ? 'open' : '')}
                      type="button" aria-expanded=${open ? 'true' : 'false'} aria-controls=${`${context.id}-list`}
                      data-sf-menu-panel-toggle>
    <span class="sf-menu-element-wrap"><i class="sf-icon sf-menu-element-icon" aria-hidden="true">menu</i><span class="sf-menu-element-text">${context.toggleLabel}</span></span>
    ${renderTrailing(open ? 'keyboard_arrow_up' : 'keyboard_arrow_down')}
  </button>`;
} // The class markup inside a named <nav>: ul.sf-menu > li.sf-menu-item > the
// row and the nested ul.sf-menu. The whole of it carries data-sf-menu-owned,
// so the class runtime, loaded beside it for the sheet, leaves it to the
// element.


function renderMenuTemplate(context) {
  const listClasses = joinClasses('sf-menu', context.flyouts ? 'sf-menu--horizontal' : '', context.appearance !== 'default' ? `sf-menu--${context.appearance}` : '');
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <nav class=${joinClasses('sf-smart-menu', context.collapsed ? 'sf-smart-menu--collapsed' : '', context.rootClass)}
         style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
         aria-label=${context.label || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
         data-orientation=${context.flyouts ? 'horizontal' : 'vertical'}
         data-sf-menu-owned>
      ${context.collapsed ? renderPanelToggle(context) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      <ul class=${listClasses} id=${`${context.id}-list`} ?hidden=${context.collapsed && !context.panelOpen}>
        ${renderItems(context, context.items, 1)}
      </ul>
    </nav>
  `;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "831ef45545b2"
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

/***/ "5c1dc214bb5e"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("position") : new Promise((resolve) => globalThis.addEventListener("sf-runtime-ready", () => resolve(globalThis.SF.runtimeModule("position")), { once: true })));

/***/ },

/***/ "fbe0570fcc69"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("smart-base") : new Promise((resolve) => globalThis.addEventListener("sf-runtime-ready", () => resolve(globalThis.SF.runtimeModule("smart-base")), { once: true })));

/***/ },

/***/ "7332c9a6d69c"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LEVEL_LIMIT: () => (/* binding */ LEVEL_LIMIT),
/* harmony export */   MENU_APPEARANCES: () => (/* binding */ MENU_APPEARANCES),
/* harmony export */   MENU_COLLAPSE: () => (/* binding */ MENU_COLLAPSE),
/* harmony export */   MENU_ORIENTATIONS: () => (/* binding */ MENU_ORIENTATIONS),
/* harmony export */   badgeCount: () => (/* binding */ badgeCount),
/* harmony export */   currentItemId: () => (/* binding */ currentItemId),
/* harmony export */   findItem: () => (/* binding */ findItem),
/* harmony export */   itemsFromList: () => (/* binding */ itemsFromList),
/* harmony export */   normaliseItem: () => (/* binding */ normaliseItem),
/* harmony export */   normaliseItems: () => (/* binding */ normaliseItems),
/* harmony export */   normalisePath: () => (/* binding */ normalisePath),
/* harmony export */   openBranches: () => (/* binding */ openBranches),
/* harmony export */   pathTo: () => (/* binding */ pathTo),
/* harmony export */   walkItems: () => (/* binding */ walkItems)
/* harmony export */ });
// The parts of sf-menu that are about data, not the page: the shape an item
// takes, from the items a host gives or from the links written in the markup,
// which item is the current page, and which branches lead to it. Kept apart
// from the element so the contract tests can run them in Node, as
// sf-accordion's sections.mjs is.

// The class menu's orientations: a column for a side panel, a row for a page
// header (sf-menu--horizontal, the first level only).
const MENU_ORIENTATIONS = Object.freeze(['vertical', 'horizontal']);
// The class menu's presentations by name: default, the documentation tree
// (sf-menu--documentation-tree) and the compact rail (sf-menu--compact). The
// tree and the rail are columns: with them the menu is vertical.
const MENU_APPEARANCES = Object.freeze(['default', 'documentation-tree', 'compact']);
// When a row of links that does not fit becomes a button that opens them as a
// column: when it does not fit, always, or never.
const MENU_COLLAPSE = Object.freeze(['auto', 'always', 'none']);
// The class menu draws four levels; a deeper one is drawn as the fourth.
const LEVEL_LIMIT = 4;

const text = (value) => (value === null || value === undefined ? '' : String(value));

// One item, as the element draws it, with its children. `label` is text, never
// markup; `badge` is a count (drawn by the class counter: capped at 99+,
// hidden at 0, its phrase ends the link's name) or a short label.
function normaliseItem(item, index = 0, parentId = '', seen = new Set()) {
  if (typeof item === 'string') item = {label: item};
  if (!item || typeof item !== 'object' || Array.isArray(item)) return null;
  const own = text(item.id ?? item.key).trim();
  const id = own || (parentId ? `${parentId}-${index + 1}` : `item-${index + 1}`);
  if (seen.has(id)) return null;
  seen.add(id);
  const children = [];
  (Array.isArray(item.children) ? item.children : []).forEach((child, at) => {
    const normalised = normaliseItem(child, at, id, seen);
    if (normalised) children.push(normalised);
  });
  return {
    id,
    label: text(item.label ?? item.text ?? item.title),
    href: text(item.href).trim(),
    icon: text(item.icon).trim(),
    badge: text(item.badge).trim(),
    current: Boolean(item.current),
    disabled: Boolean(item.disabled),
    open: Boolean(item.open),
    children,
  };
}

// The items from what a host gave: an array, or the same array as JSON in the
// `items` attribute. An item whose id repeats an earlier one, anywhere in the
// tree, is left out with its children, as one id must name one item.
function normaliseItems(items) {
  let list = items;
  if (typeof list === 'string') {
    const raw = list.trim();
    if (!raw) return [];
    try {
      list = JSON.parse(raw);
    } catch {
      return [];
    }
  }
  if (!Array.isArray(list)) return [];
  const seen = new Set();
  const result = [];
  list.forEach((item, index) => {
    const normalised = normaliseItem(item, index, '', seen);
    if (normalised) result.push(normalised);
  });
  return result;
}

// A badge that is a whole number is a count; anything else is a label.
function badgeCount(badge) {
  return /^\d+$/u.test(text(badge).trim()) ? text(badge).trim() : null;
}

// Every item, depth first, with the ids of the branches above it.
function walkItems(items, visit, path = []) {
  for (const item of items) {
    visit(item, path);
    if (item.children.length) walkItems(item.children, visit, [...path, item.id]);
  }
}

function findItem(items, id) {
  let found = null;
  walkItems(items, (item) => {
    if (!found && item.id === String(id)) found = item;
  });
  return found;
}

// The ids of the branches above an item, outermost first; null when no item
// has that id.
function pathTo(items, id) {
  let found = null;
  walkItems(items, (item, path) => {
    if (!found && item.id === String(id)) found = path;
  });
  return found;
}

// A path as the menu compares it: no trailing slash but the root's, and no
// index document name.
function normalisePath(path) {
  let value = text(path).split(/[?#]/u)[0] || '/';
  value = value.replace(/\/index\.html?$/u, '/');
  if (value.length > 1) value = value.replace(/\/+$/u, '');
  return value || '/';
}

// The item that is the current page: the one the element's `current` names,
// else -- when the menu follows the location -- the item whose link leads to
// this path (the first, depth first), else the first item marked current.
// `base` resolves relative links, as the browser would.
function currentItemId(items, {current = '', pathname = '', base = '', fromLocation = false} = {}) {
  const named = text(current).trim();
  if (named && findItem(items, named)) return named;
  if (fromLocation && pathname) {
    const here = normalisePath(pathname);
    let found = null;
    walkItems(items, (item) => {
      if (found || !item.href || item.disabled) return;
      let target;
      try {
        target = new globalThis.URL(item.href, base || 'http://localhost/');
      } catch {
        return;
      }
      if (base && new globalThis.URL(base).origin !== target.origin) return;
      if (normalisePath(target.pathname) === here) found = item.id;
    });
    if (found) return found;
  }
  let flagged = null;
  walkItems(items, (item) => {
    if (!flagged && item.current) flagged = item.id;
  });
  return flagged;
}

// Which branches are open: what the person or the host set, else -- in a
// column -- what the item says, and the branches above the current page, so
// it can be seen. A row's panels open only when asked: none is open when the
// page starts.
function openBranches(items, overrides = new Map(), currentId = null, inColumn = true) {
  const reveal = new Set(inColumn && currentId ? pathTo(items, currentId) || [] : []);
  const open = new Set();
  walkItems(items, (item) => {
    if (!item.children.length) return;
    const fallback = inColumn && (item.open || reveal.has(item.id));
    const state = overrides.has(item.id) ? overrides.get(item.id) : fallback;
    if (state) open.add(item.id);
  });
  return open;
}

// A list written in the markup, read as items: each <li> is an item, its
// direct <a> the link (href, aria-current, the label from its words), its
// direct <ul> the children. data-id (or id), data-icon, data-badge,
// data-open and data-disabled give the other fields; a row the class menu has
// already drawn is read too (its .sf-menu-element-icon, .sf-menu-element-text
// and counter). Icon glyphs, counters and what is hidden from assistive
// technology are not words of the label. Works on any DOM-like node with
// children, childNodes and attributes.
const NOT_WORDS = /(?:^|\s)(?:sf-icon|sf-icon-button|sf-badge|sf-badge-anchored-text)(?:\s|$)/u;

function wordsOf(node) {
  if (!node) return '';
  if (node.nodeType === 3) return text(node.textContent);
  if (node.nodeType !== 1) return '';
  if (node.localName === 'ul' || NOT_WORDS.test(text(node.getAttribute?.('class')))
    || node.getAttribute?.('aria-hidden') === 'true') return '';
  return Array.from(node.childNodes || []).map(wordsOf).join(' ');
}

const squeeze = (value) => text(value).replace(/\s+/gu, ' ').trim();

function itemsFromList(list) {
  if (!list) return [];
  const own = (node, name) => Array.from(node.children || []).find((child) => child.localName === name) || null;
  const attr = (node, name) => (node?.getAttribute ? node.getAttribute(name) : null);
  const has = (node, name) => Boolean(node?.hasAttribute?.(name));
  const find = (node, selector) => node?.querySelector?.(selector) || null;
  return Array.from(list.children || [])
    .filter((child) => child.localName === 'li')
    .map((li) => {
      const link = own(li, 'a') || find(li, ':scope > .sf-menu-element > a[href]');
      const row = link || find(li, ':scope > .sf-menu-element') || li;
      const nested = own(li, 'ul');
      const currentAttr = attr(link, 'aria-current');
      const drawnText = find(row, '.sf-menu-element-text');
      const drawnIcon = find(row, '.sf-menu-element-icon');
      const drawnCount = find(row, '.sf-badge[data-count]');
      return {
        id: attr(li, 'data-id') || attr(link, 'data-id') || attr(li, 'id') || undefined,
        label: squeeze(drawnText ? drawnText.textContent : wordsOf(row)),
        href: link ? attr(link, 'href') || '' : '',
        icon: attr(li, 'data-icon') || attr(link, 'data-icon') || squeeze(drawnIcon?.textContent),
        badge: attr(li, 'data-badge') || attr(link, 'data-badge') || attr(drawnCount, 'data-count') || '',
        current: (currentAttr !== null && currentAttr !== 'false') || has(li, 'data-current'),
        disabled: has(li, 'data-disabled') || has(li, 'disabled') || attr(link, 'aria-disabled') === 'true',
        open: has(li, 'data-open') || Boolean(li.classList?.contains?.('open')),
        children: nested ? itemsFromList(nested) : [],
      };
    });
}


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
/******/ 	let __webpack_exports__ = __webpack_require__("3267d93fb0d3");
/******/
/******/ })()
;