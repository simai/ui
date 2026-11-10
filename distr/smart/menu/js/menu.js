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

/***/ "3267d93fb0d3"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SfSmartMenu: () => (/* binding */ SfSmartMenu)
/* harmony export */ });
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _core_js_instance_path__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("e92fd2d1a38c");
/* harmony import */ var _core_js_position_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("116963e5e31b");
/* harmony import */ var _core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("bf0cea966575");
/* harmony import */ var _core_js_breakpoints_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("1373e294ec38");
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("d3818183b14c");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("e29406217b0b");
/* harmony import */ var _items_mjs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("7332c9a6d69c");
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("831ef45545b2");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("e0fa46ed075f");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("97168578e30d");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__("33262fd5308c");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__("15d5a97ca4e8");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_instance_path__WEBPACK_IMPORTED_MODULE_2__, _core_js_position_js__WEBPACK_IMPORTED_MODULE_3__, _core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_4__, _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_6__, _js_templates_default__WEBPACK_IMPORTED_MODULE_7__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_instance_path__WEBPACK_IMPORTED_MODULE_2__, _core_js_position_js__WEBPACK_IMPORTED_MODULE_3__, _core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_4__, _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_6__, _js_templates_default__WEBPACK_IMPORTED_MODULE_7__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_instance_path__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_core_js_instance_path__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _core_js_position_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_core_js_position_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_6__);
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








 // An item spelled the first release's way (key, text, title) is noted on the
// page's deprecation list until the date it leaves (journal record
// sf-menu-item-field-aliases).

(0,_items_mjs__WEBPACK_IMPORTED_MODULE_8__.onItemAlias)((from, to) => (0,_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_6__.noteDeprecated)({
  component: 'sf-menu',
  kind: 'property',
  attribute: 'items',
  from,
  to,
  remove_after: '2027-01-01'
}));




 // Prefer the helper Core published; an isolated bundle uses its own copy.

const positioning = () => globalThis.SF?.Position || (_core_js_position_js__WEBPACK_IMPORTED_MODULE_3___default()); // From its component.json (standard simai.smart-component 1.3.8 §3, §4, §8,
// §11): the settings are attributes and properties made by
// core/js/element-manifest.js, the button's word is lang/<locale>.json, the
// actions answer outcomes, and the old event names sf-menu:navigate and
// sf-menu:toggle are dated aliases of sf-menu-navigate and sf-menu-toggle.


const MenuElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_10__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_12__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_13__
  },
  source: 'ru',
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_11__
}); // open('catalog') and open({id: 'catalog'}) both name an item (§4.4).
// How many levels of panels an item opens: 0 for a leaf.

const panelDepth = item => item?.children?.length ? 1 + Math.max(...item.children.map(panelDepth)) : 0;

const itemArgument = value => value && typeof value === 'object' ? value.id : value;

class SfSmartMenu extends MenuElement {
  static get props() {
    return { ...super.props,
      templateName: {
        attribute: 'template',
        default: 'default'
      },
      items: {
        default: []
      },
      orientation: {
        default: 'vertical',
        values: _items_mjs__WEBPACK_IMPORTED_MODULE_8__.MENU_ORIENTATIONS
      },
      appearance: {
        default: 'default',
        values: _items_mjs__WEBPACK_IMPORTED_MODULE_8__.MENU_APPEARANCES
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
        values: _items_mjs__WEBPACK_IMPORTED_MODULE_8__.MENU_COLLAPSE
      },
      overflow: {
        default: 'collapse',
        values: _items_mjs__WEBPACK_IMPORTED_MODULE_8__.MENU_OVERFLOW
      },
      moreLabel: {
        attribute: 'more-label',
        default: ''
      },
      openOn: {
        attribute: 'open-on',
        default: 'hover',
        values: _items_mjs__WEBPACK_IMPORTED_MODULE_8__.MENU_OPEN_ON
      },
      indicator: {
        default: 'line',
        values: _items_mjs__WEBPACK_IMPORTED_MODULE_8__.MENU_INDICATORS
      },
      label: {
        default: ''
      },
      toggleLabel: {
        attribute: 'toggle-label',
        default: ''
      },
      sticky: {
        type: Boolean,
        default: false
      },
      bordered: {
        type: Boolean,
        default: false
      },
      search: {
        type: Boolean,
        default: false
      },
      searchPlaceholder: {
        attribute: 'search-placeholder',
        default: ''
      },
      rootClass: {
        default: ''
      }
    };
  }

  constructor() {
    super(); // undefined: follow the attribute. Set by the property; an attribute
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
    this._escapeTaken = false; // Under the md breakpoint (a phone), for collapse narrow.

    this._narrow = false; // overflow more: the ids of the first-level items that left the row for
    // «Ещё», in their order.

    this._overflowHidden = []; // open-on hover: the timers of the branches the pointer rests on or left.

    this._hoverTimers = new Map(); // A region's template, stamped once per name, so a render keeps its nodes.

    this._regionNodes = new Map(); // search: what the field holds, and the ranges this element lays in the
    // shared sf-menu-match highlight.

    this._query = '';
    this._matchRanges = []; // A value set as a property before the element was defined is an own
    // property that would hide the accessor; it is taken through it.

    if (Object.prototype.hasOwnProperty.call(this, 'items')) {
      const early = this.items;
      delete this.items;
      this._items = (0,_items_mjs__WEBPACK_IMPORTED_MODULE_8__.normaliseItems)(early);
    }

    this.addEventListener('click', this.onClick);
    this.addEventListener('focusin', this.onFocusChange);
    this.addEventListener('focusout', this.onFocusOut);
    this.addEventListener('keydown', this.onKeydown);
    this.addEventListener('pointerover', this.onPointerOver);
    this.addEventListener('pointerout', this.onPointerOut);
    this.addEventListener('input', this.onSearchInput);
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
    if (!first) return; // Static markup is a picture of the menu, not its items (§5.4).

    const children = Array.from(this.children).filter(child => !child.hasAttribute('data-sf-static'));
    const nav = children.find(child => child.localName === 'nav');
    const list = children.find(child => child.localName === 'ul') || nav?.querySelector(':scope > ul');
    if (!list) return;
    this._childItems = (0,_items_mjs__WEBPACK_IMPORTED_MODULE_8__.normaliseItems)((0,_items_mjs__WEBPACK_IMPORTED_MODULE_8__.itemsFromList)(list));
    this._childLabel = nav?.getAttribute('aria-label') || list.getAttribute('aria-label') || '';
    (list.parentElement === nav ? nav : list).remove();
  }

  onConnected() {
    this._onLocation = () => {
      if (this.currentFromLocation) this.requestComponentUpdate('location');
    };

    window.addEventListener('popstate', this._onLocation);
    window.addEventListener('hashchange', this._onLocation); // The phone's width, as the sheets switch on it (core/js/breakpoints).

    this._narrowMedia = (0,_core_js_breakpoints_js__WEBPACK_IMPORTED_MODULE_5__.breakpointMedia)('md', {
      below: true
    });
    this._narrow = this._narrowMedia?.matches === true;

    this._onNarrow = () => {
      const narrow = this._narrowMedia?.matches === true;
      if (narrow === this._narrow) return;
      this._narrow = narrow;
      if (this.collapse === 'narrow') this.requestComponentUpdate('narrow');
    };

    this._narrowMedia?.addEventListener?.('change', this._onNarrow); // The words of a row change their width when the font arrives: «Ещё» is
    // measured again then.

    this._onFonts = () => this.measureFit();

    document.fonts?.addEventListener?.('loadingdone', this._onFonts);
    document.fonts?.ready?.then?.(() => this.isConnected && this.measureFit());
  }

  onDisconnected() {
    super.onDisconnected();
    window.removeEventListener('popstate', this._onLocation);
    window.removeEventListener('hashchange', this._onLocation);
    this._narrowMedia?.removeEventListener?.('change', this._onNarrow);
    this._narrowMedia = null;
    document.fonts?.removeEventListener?.('loadingdone', this._onFonts);

    for (const timer of this._hoverTimers.values()) clearTimeout(timer);

    this._hoverTimers.clear();

    this._resizeObserver?.disconnect();
    this._resizeObserver = null;
    this._observed = null;

    for (const submenu of [...this._anchors.keys()]) this.releaseAnchor(submenu);

    this.holdSurface(false);
    this._scrollObserver?.disconnect();
    this._scrollObserver = null;
    this._scrollWatched = null;
    this.setMatchRanges([]);
  } // The items, from the property or the attribute, else from the markup.


  get items() {
    if (this._items !== undefined) return this._items;
    return (0,_items_mjs__WEBPACK_IMPORTED_MODULE_8__.normaliseItems)(this.getAttribute('items'));
  }

  set items(next) {
    this._items = (0,_items_mjs__WEBPACK_IMPORTED_MODULE_8__.normaliseItems)(next);
    this._autoCollapsed = false;
    this.requestComponentUpdate('items');
  }

  get menuItems() {
    const items = this.items;
    return items.length ? items : this._childItems;
  } // A row with overflow more: the items that left the row stand under the
  // trailing «Ещё» branch.


  get moreActive() {
    return this.overflow === 'more' && this.flyouts;
  } // The tree the open panels, the current path and the keys walk: the items,
  // or -- in a row with overflow more -- the row's items with the ones that
  // left it under «Ещё».


  get treeItems() {
    const items = this.menuItems;
    if (!this.moreActive) return items;
    const row = (0,_items_mjs__WEBPACK_IMPORTED_MODULE_8__.withoutGroups)(items);
    const hidden = new Set(this._overflowHidden);
    return [...row.filter(item => !hidden.has(item.id)), this.moreItem(row.filter(item => hidden.has(item.id)))];
  } // «Ещё» -- the more-label words -- or «Меню» when no item stays in the row.


  moreItem(children = []) {
    const none = children.length > 0 && children.length === (0,_items_mjs__WEBPACK_IMPORTED_MODULE_8__.withoutGroups)(this.menuItems).length;
    const label = none ? this.getAttribute('toggle-label') || this.sfWord('toggle-label') : this.getAttribute('more-label') || this.sfWord('more-label');
    return {
      id: _items_mjs__WEBPACK_IMPORTED_MODULE_8__.MORE_ID,
      label,
      href: '',
      icon: '',
      badge: '',
      status: '',
      current: false,
      disabled: false,
      open: false,
      region: '',
      children
    };
  } // The ids of the first-level items that left the row for «Ещё».


  get overflowHidden() {
    return this.moreActive ? [...this._overflowHidden] : [];
  } // orientation, appearance, collapse, current-from-location and the words are
  // the manifest's accessors (attribute and property).
  // The documentation tree and the compact rail are columns; the default and
  // the navigation can be a row.


  get horizontal() {
    return this.orientation === 'horizontal' && _items_mjs__WEBPACK_IMPORTED_MODULE_8__.ROW_APPEARANCES.includes(this.appearance);
  } // The row became a button that opens the same links as a column.


  get collapsed() {
    if (this.collapse === 'always') return true;
    if (this.collapse === 'narrow') return this._narrow;
    return this.collapse === 'auto' && this.overflow === 'collapse' && this.horizontal && this._autoCollapsed;
  } // Branches open as panels beside the row: a row that is shown as a row.


  get flyouts() {
    return this.horizontal && !this.collapsed;
  } // Groups are drawn with their headings in a column; a row and the compact
  // rail draw their items in the group's place.


  get groupsDrawn() {
    return !this.flyouts && this.appearance !== 'compact';
  }

  get panelOpen() {
    return this.collapsed && this._panelOpen;
  } // The id of the item that is the current page, or null.


  get currentId() {
    const here = globalThis.location;
    return (0,_items_mjs__WEBPACK_IMPORTED_MODULE_8__.currentItemId)(this.menuItems, {
      current: this.getProp('current'),
      pathname: here?.pathname || '',
      hash: here?.hash || '',
      base: here?.href || '',
      fromLocation: this.currentFromLocation
    });
  } // The ids of the open branches, outermost first.


  get openIds() {
    this.syncMode();
    return [...(0,_items_mjs__WEBPACK_IMPORTED_MODULE_8__.openBranches)(this.treeItems, this._openState, this.currentId, !this.flyouts)];
  }

  isOpen(id) {
    return this.openIds.includes(String(id));
  }

  item(id) {
    return (0,_items_mjs__WEBPACK_IMPORTED_MODULE_8__.findItem)(this.treeItems, id);
  } // The actions open, close and toggle {id} and close-all (§4.4): each
  // answers an outcome, applied or refused with a reason.


  open(id) {
    return this.setOpen(itemArgument(id), true, 'method');
  }

  close(id) {
    return this.setOpen(itemArgument(id), false, 'method');
  }

  toggle(id) {
    const key = itemArgument(id);
    return this.setOpen(key, !this.isOpen(key), 'method');
  } // Closes every open panel of a row and the panel of a collapsed menu; the
  // groups of a column keep their state.


  closeAll() {
    const flyouts = this.flyouts ? this.closeFlyouts('method') : false;
    const panel = this.setPanelOpen(false, 'method');
    return flyouts || panel ? {
      outcome: 'applied'
    } : {
      outcome: 'refused',
      reason: 'already'
    };
  } // A row's open panels are one chain: opening a branch closes every panel
  // that is not above it, closing one closes the panels inside it. A column's
  // groups open and close each on its own. A disabled branch is not opened or
  // closed by the person. Answers an outcome: applied, or refused with
  // unknown (no such branch), compact (no groups), disabled or already.


  setOpen(id, open, source = 'method') {
    const item = this.item(id);
    if (!item || !item.children.length) return {
      outcome: 'refused',
      reason: 'unknown'
    };
    if (this.appearance === 'compact') return {
      outcome: 'refused',
      reason: 'compact'
    }; // A group that is not collapsible, or a group a row does not draw, stays
    // as it is.

    if (item.group && (!item.collapsible || !this.groupsDrawn)) return {
      outcome: 'refused',
      reason: 'fixed'
    };
    if (item.disabled && source === 'user') return {
      outcome: 'refused',
      reason: 'disabled'
    }; // Any decision on a branch (a press, a key, a method or a rest that ran)
    // drops the rests still pending on it: a branch Escape closed under a
    // resting mouse stays closed until the pointer comes back.

    this.clearHoverTimer(`open\u0000${item.id}`);
    this.clearHoverTimer(`close\u0000${item.id}`);
    const before = new Set(this.openIds);
    if (before.has(item.id) === Boolean(open)) return {
      outcome: 'refused',
      reason: 'already'
    };
    const after = new Set(before);

    if (this.flyouts) {
      const above = new Set((0,_items_mjs__WEBPACK_IMPORTED_MODULE_8__.pathTo)(this.treeItems, item.id) || []);

      for (const other of before) if (!above.has(other)) after.delete(other);

      if (open) after.add(item.id);
    } else if (open) {
      after.add(item.id);
    } else {
      after.delete(item.id);
    }

    return this.applyOpen(before, after, source, item.id) ? {
      outcome: 'applied'
    } : {
      outcome: 'refused',
      reason: 'already'
    };
  }

  closeFlyouts(source) {
    const before = new Set(this.openIds);
    if (!before.size) return false;
    return this.applyOpen(before, new Set(), source, null);
  }

  applyOpen(before, after, source, asked) {
    const changed = [];
    (0,_items_mjs__WEBPACK_IMPORTED_MODULE_8__.walkItems)(this.treeItems, one => {
      if (one.children.length && before.has(one.id) !== after.has(one.id)) changed.push(one);
    });
    if (!changed.length) return false;

    for (const one of changed) this._openState.set(one.id, after.has(one.id));

    this.requestComponentUpdate('open'); // The branch asked for first, then the ones it closed, innermost first.

    const depth = one => ((0,_items_mjs__WEBPACK_IMPORTED_MODULE_8__.pathTo)(this.treeItems, one.id) || []).length;

    changed.sort((a, b) => a.id === asked ? -1 : b.id === asked ? 1 : depth(b) - depth(a)); // sf-menu-toggle, then its old name sf-menu:toggle with the same detail
    // (aliases.json, until 2026-12-01).

    for (const one of changed) {
      this.sfEmit('toggle', {
        id: one.id,
        open: after.has(one.id),
        source,
        item: one
      });
    }

    return true;
  } // The panel of a menu shown as a button. Its event names no item: id null.


  setPanelOpen(open, source = 'method') {
    if (!this.collapsed || this._panelOpen === Boolean(open)) return false;
    this._panelOpen = Boolean(open);
    this.requestComponentUpdate('panel');
    this.sfEmit('toggle', {
      id: null,
      open: this._panelOpen,
      source,
      item: null
    });
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

    if (link) {
      this.onNavigate(event, link);
      return;
    } // A link of a region's own template is the host's: following it closes
    // the region, as a menu link does.


    const regionLink = this.ownControl(event.target, '.sf-menu-region a[href]');
    if (regionLink && this.flyouts && !event.defaultPrevented) this.closeFlyouts('user');
  }; // open-on hover (C30, the default of a row): a mouse resting on a row's
  // branch opens it after 300 ms (a region after 500 ms); once it has been
  // outside a branch and its panel for 500 ms the branch closes. Touch, a pen
  // and the keyboard go through the branch's chevron, which a press opens
  // and closes.

  hoverOpens(event) {
    return this.openOn === 'hover' && this.flyouts && event.pointerType === 'mouse';
  } // A first-level branch of a row that opens a region rather than a panel.


  flyoutRegion(item) {
    return Boolean(item?.region) && this.flyouts && this.menuItems.some(top => top.id === item.id);
  } // The ids of the items whose rows or panels hold a node, innermost first.


  itemChain(node) {
    const chain = [];

    for (let li = node?.closest?.('[data-sf-menu-item]'); li && this.contains(li); li = li.parentElement?.closest('[data-sf-menu-item]')) {
      chain.push(li.dataset.sfMenuItem);
    }

    return chain;
  }

  hoverTimer(key, delay, run) {
    if (this._hoverTimers.has(key)) return;

    this._hoverTimers.set(key, setTimeout(() => {
      this._hoverTimers.delete(key);

      if (this.isConnected && this.flyouts) run();
    }, delay));
  }

  clearHoverTimer(key) {
    const timer = this._hoverTimers.get(key);

    if (timer === undefined) return;
    clearTimeout(timer);

    this._hoverTimers.delete(key);
  }

  onPointerOver = event => {
    if (!this.hoverOpens(event)) return;
    const chain = new Set(this.itemChain(event.target));

    for (const key of [...this._hoverTimers.keys()]) {
      const [kind, id] = key.split('\u0000');
      if (kind === 'close' && chain.has(id) || kind === 'open' && !chain.has(id)) this.clearHoverTimer(key);
    }

    const [id] = chain;
    const item = id ? this.item(id) : null;
    if (!item?.children.length || item.disabled || this.isOpen(id)) return;
    const delay = this.flyoutRegion(item) ? _items_mjs__WEBPACK_IMPORTED_MODULE_8__.HOVER_REGION_OPEN_DELAY : _items_mjs__WEBPACK_IMPORTED_MODULE_8__.HOVER_OPEN_DELAY;
    this.hoverTimer(`open\u0000${id}`, delay, () => this.setOpen(id, true, 'user'));
  };
  onPointerOut = event => {
    if (!this.hoverOpens(event)) return;
    const next = event.relatedTarget instanceof Node && this.contains(event.relatedTarget) ? new Set(this.itemChain(event.relatedTarget)) : new Set();

    for (const key of [...this._hoverTimers.keys()]) {
      const [kind, id] = key.split('\u0000');
      if (kind === 'open' && !next.has(id)) this.clearHoverTimer(key);
    }

    for (const id of this.openIds) {
      if (next.has(id)) continue;
      this.hoverTimer(`close\u0000${id}`, _items_mjs__WEBPACK_IMPORTED_MODULE_8__.HOVER_CLOSE_DELAY, () => {
        if (this.isOpen(id)) this.setOpen(id, false, 'user');
      });
    }
  }; // The arrows of a row (WAI-ARIA disclosure navigation, the optional keys):
  // Left and Right walk the row's first level, Home and End go to its ends,
  // Down and Up open a branch and enter its panel at the first or the last
  // row; in a panel Down and Up walk its rows, Home and End go to its ends,
  // Right opens a side panel and enters it, Left closes the side panel the
  // focus is in and gives the focus back to its branch; in a region Down and
  // Up walk its links and Left and Right its columns. Tab, Enter, Space and
  // Escape are as before. A column has no arrows: it is not a tree widget.

  onKeydown = event => {
    if (this.searchActive && this.searchKey(event)) return;
    if (!this.flyouts || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
    const key = event.key;
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(key)) return;
    const li = event.target?.closest?.('[data-sf-menu-item]');
    if (!li || !this.contains(li)) return;
    const region = event.target.closest('.sf-menu-region');
    const handled = region && li.contains(region) ? this.regionKey(region, event.target, key) : li.dataset.sfMenuLevel === '1' ? this.rowKey(li, key) : this.panelKey(li, event.target, key);
    if (handled) event.preventDefault();
  }; // The control a row's item is reached by: its link, or its branch button.

  rowControl(li) {
    const row = li?.querySelector(':scope > .sf-menu-element');
    if (!row) return null;
    const control = row.matches('a[href], button') ? row : row.querySelector(':scope > a[href], :scope > button');
    return control && !control.disabled ? control : null;
  } // The items of one list that can be reached, in order.


  reachable(list) {
    return Array.from(list?.children || []).filter(li => li.matches('[data-sf-menu-item]:not([hidden])') && this.rowControl(li));
  } // Opens a branch if it is closed, then gives the focus to the first or the
  // last control of its panel.


  enterBranch(li, last = false) {
    const id = li.dataset.sfMenuItem;

    const focusInside = () => {
      const panel = li.querySelector(':scope > .sf-menu, :scope > .sf-menu-region');
      if (!panel) return;
      const controls = panel.matches('.sf-menu-region') ? this.regionControls(panel) : this.reachable(panel).map(one => this.rowControl(one));
      (last ? controls[controls.length - 1] : controls[0])?.focus();
    };

    if (this.isOpen(id)) {
      focusInside();
      return true;
    }

    const outcome = this.setOpen(id, true, 'user');
    if (outcome.outcome !== 'applied') return false;
    this.whenRendered(focusInside, {
      next: true
    });
    return true;
  }

  rowKey(li, key) {
    const items = this.reachable(li.parentElement);
    const at = items.indexOf(li);
    if (at < 0) return false;

    if (key === 'ArrowLeft' || key === 'ArrowRight') {
      this.rowControl(items[(at + (key === 'ArrowRight' ? 1 : -1) + items.length) % items.length])?.focus();
      return true;
    }

    if (key === 'Home' || key === 'End') {
      this.rowControl(items[key === 'Home' ? 0 : items.length - 1])?.focus();
      return true;
    }

    if (!li.matches('.sf-menu-item--has-submenu')) return false;
    return this.enterBranch(li, key === 'ArrowUp');
  }

  panelKey(li, target, key) {
    const items = this.reachable(li.parentElement);
    const at = items.indexOf(li);
    if (at < 0) return false; // Inside the vertical-to-horizontal sense of the row: the side a panel
    // opens to is the row's inline end, mirrored in RTL.

    const rtl = getComputedStyle(this.querySelector(':scope > nav') || this).direction === 'rtl';
    const inward = rtl ? 'ArrowLeft' : 'ArrowRight';

    if (key === 'ArrowDown' || key === 'ArrowUp') {
      this.rowControl(items[(at + (key === 'ArrowDown' ? 1 : -1) + items.length) % items.length])?.focus();
      return true;
    }

    if (key === 'Home' || key === 'End') {
      this.rowControl(items[key === 'Home' ? 0 : items.length - 1])?.focus();
      return true;
    }

    if (key === inward) {
      if (!li.matches('.sf-menu-item--has-submenu')) return false;
      return this.enterBranch(li);
    } // Outward from a side panel: it closes and its branch takes the focus.


    const owner = li.parentElement?.closest('[data-sf-menu-item]');
    if (!owner || owner.dataset.sfMenuLevel === '1') return false;
    this.setOpen(owner.dataset.sfMenuItem, false, 'user');
    this.focusAfterRender(`[data-sf-menu-item="${CSS.escape(owner.dataset.sfMenuItem)}"] > .sf-menu-element [data-sf-menu-toggle], [data-sf-menu-item="${CSS.escape(owner.dataset.sfMenuItem)}"] > [data-sf-menu-toggle]`);
    return true;
  }

  regionControls(region) {
    return Array.from(region.querySelectorAll('a[href], button:not(:disabled), [tabindex]:not([tabindex="-1"])')).filter(node => node.getClientRects().length > 0);
  }

  regionKey(region, target, key) {
    const controls = this.regionControls(region);
    const at = controls.indexOf(target.closest('a[href], button, [tabindex]'));
    if (at < 0 || !controls.length) return false;

    if (key === 'ArrowDown' || key === 'ArrowUp') {
      controls[(at + (key === 'ArrowDown' ? 1 : -1) + controls.length) % controls.length].focus();
      return true;
    }

    if (key === 'Home' || key === 'End') {
      controls[key === 'Home' ? 0 : controls.length - 1].focus();
      return true;
    } // A column is a child of the region (or of its columns' grid) that holds
    // controls: Left and Right go to the first control of the one beside.


    const columns = Array.from(region.querySelectorAll(':scope > *, :scope > .sf-menu-region-columns > *')).filter(column => !column.matches('.sf-menu-region-columns') && this.regionControls(column).length);
    const column = columns.findIndex(one => one.contains(target));
    if (column < 0) return false;
    const rtl = getComputedStyle(region).direction === 'rtl';
    const step = key === 'ArrowRight' !== rtl ? 1 : -1;
    this.regionControls(columns[(column + step + columns.length) % columns.length])[0]?.focus();
    return true;
  } // A link's own press: a cancellable sf-menu-navigate first (and its old name
  // sf-menu:navigate, one cancel for both), so a host that routes the page
  // itself prevents it and the browser does not go. A press that opens
  // another tab or window is the browser's alone.


  onNavigate(event, link) {
    if (event.defaultPrevented || event.button > 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if ((link.getAttribute('target') || '_self') !== '_self') return;
    const item = this.item(link.dataset.sfMenuLink);
    if (!item) return;
    const allowed = this.sfEmit('navigate', {
      id: item.id,
      href: item.href,
      item
    });
    if (!allowed) event.preventDefault(); // Gone to the page: nothing stays open over it.

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
    this._holding = hold; // A press outside comes from the layer stack's one listener, while the
    // menu is the top layer (§19.3).

    (0,_core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_4__.holdOpenSurfaceMark)(this, hold, {
      onOutsidePress: this.onOutsidePress
    });

    if (hold) {
      document.addEventListener('keydown', this.onDocumentKeydown, true);
    } else {
      document.removeEventListener('keydown', this.onDocumentKeydown, true);
    }
  } // Escape closes the innermost open panel only -- the deepest open panel of
  // a row, the one the focus is in first, else the panel of the button -- and
  // gives the focus back to the button that opened it.


  onDocumentKeydown = event => {
    if (event.key !== 'Escape' || event.defaultPrevented || !(0,_core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_4__.isTopOpenSurface)(this)) return; // The mark stays up until the press has reached every listener: the
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
  }; // Outside the menu: the stack has checked that already.

  onOutsidePress = () => {
    if (this.flyouts) this.closeFlyouts('user');
  };

  innermostOpen() {
    if (!this.flyouts) return null;
    const open = new Set(this.openIds);
    if (!open.size) return null;

    const depth = id => ((0,_items_mjs__WEBPACK_IMPORTED_MODULE_8__.pathTo)(this.treeItems, id) || []).length;

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
  } // search (C30 amended 2026-11-09, R071 a): a column only -- a row keeps a
  // search button in its header.


  get searchActive() {
    return Boolean(this.search) && !this.flyouts && this.appearance !== 'compact';
  }

  get searchQuery() {
    return this.searchActive ? this._query.trim() : '';
  } // The items the field leaves, or null while it is empty.


  searchResult() {
    const query = this.searchQuery;
    if (!query) return null;
    const all = this.menuItems;
    return (0,_items_mjs__WEBPACK_IMPORTED_MODULE_8__.filterItems)(this.groupsDrawn ? all : (0,_items_mjs__WEBPACK_IMPORTED_MODULE_8__.withoutGroups)(all), query);
  }

  searchField() {
    return this.querySelector('[data-sf-menu-search] input');
  }

  onSearchInput = event => {
    const field = event.target;
    if (!this.searchActive || field?.localName !== 'input' || !field.closest?.('[data-sf-menu-search]')) return;
    if (field.value === this._query) return;
    this._query = field.value;
    this.requestComponentUpdate('search');
    const result = this.searchResult();
    this.sfEmit('search', {
      query: this.searchQuery,
      count: result ? result.count : 0
    });
  };

  setQuery(value) {
    const field = this.searchField();
    if (field) field.value = value;
    if (value === this._query) return;
    this._query = value;
    this.requestComponentUpdate('search');
    const result = this.searchResult();
    this.sfEmit('search', {
      query: this.searchQuery,
      count: result ? result.count : 0
    });
  } // The rows a person walks with the arrows from the field: each row's own
  // control -- its link, its branch button, a group's heading button -- not
  // a split row's chevron.


  searchRows() {
    const list = this.querySelector(':scope > nav > ul.sf-menu');
    if (!list || list.hidden) return [];
    return [...list.querySelectorAll('.sf-menu-element:is(a[href], button), .sf-menu-element > a.sf-menu-element-wrap[href], button.sf-menu-group-heading')].filter(control => !control.disabled && !control.closest('[hidden]'));
  } // Down from the field enters the first result, Down and Up walk the
  // results, Up from the first gives the focus back to the field; Escape in
  // the field clears it, in the results goes back to the field.


  searchKey(event) {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return false;
    const key = event.key;
    if (!['ArrowDown', 'ArrowUp', 'Escape'].includes(key)) return false;
    const field = this.searchField();
    if (!field) return false;
    const inField = event.target === field;

    if (inField) {
      if (key === 'Escape') {
        if (!field.value) return false;
        event.preventDefault();
        event.stopPropagation();
        this.setQuery('');
        return true;
      }

      if (key === 'ArrowDown') {
        const first = this.searchRows()[0];
        if (!first) return false;
        event.preventDefault();
        first.focus();
        return true;
      }

      return false;
    }

    const rows = this.searchRows();
    const at = rows.indexOf(event.target);
    if (at === -1) return false;
    event.preventDefault();

    if (key === 'Escape') {
      event.stopPropagation();
      field.focus();
    } else if (key === 'ArrowDown') {
      rows[Math.min(at + 1, rows.length - 1)].focus();
    } else if (at === 0) {
      field.focus();
    } else {
      rows[at - 1].focus();
    }

    return true;
  } // The words that match, highlighted without touching the markup (the CSS
  // Custom Highlight API): ::highlight(sf-menu-match) draws them with the
  // Framework's mark colour. The highlight is shared by every sf-menu on the
  // page; each keeps its own ranges in it.


  syncSearchHighlight() {
    const query = (0,_items_mjs__WEBPACK_IMPORTED_MODULE_8__.foldWords)(this.searchQuery).trim();
    const ranges = [];

    if (query) {
      for (const node of this.querySelectorAll(':scope > nav > ul.sf-menu :is(.sf-menu-element-text, .sf-menu-group-label)')) {
        // The words are a text node between the template's markers.
        for (const words of node.childNodes) {
          if (words.nodeType !== 3) continue;
          const folded = (0,_items_mjs__WEBPACK_IMPORTED_MODULE_8__.foldWords)(words.data);
          let at = folded.indexOf(query);

          while (at !== -1) {
            const range = document.createRange();
            range.setStart(words, at);
            range.setEnd(words, at + query.length);
            ranges.push(range);
            at = folded.indexOf(query, at + query.length);
          }
        }
      }
    }

    this.setMatchRanges(ranges);
  }

  setMatchRanges(ranges) {
    const registry = globalThis.CSS?.highlights;
    const Kind = globalThis.Highlight;
    if (!registry || typeof Kind !== 'function') return;
    let highlight = registry.get('sf-menu-match');

    if (!highlight && ranges.length) {
      highlight = new Kind();
      registry.set('sf-menu-match', highlight);
    }

    if (!highlight) return;

    for (const range of this._matchRanges) highlight.delete(range);

    for (const range of ranges) highlight.add(range);

    this._matchRanges = ranges;
    if (!highlight.size) registry.delete('sf-menu-match');
  } // A box that scrolls says so with sf-menu--scroll -- a box with a border
  // draws the path's line one pixel inside it then, as the border area is
  // clipped (R084) -- and with sf-menu--scrollbar when its scrollbar takes
  // room: a column gives the scrollbar its end padding back (C07). A row's panel scrolls only when it does not fit; else nothing
  // clips the line on its border.


  syncScroll(box, panel = false) {
    if (!box?.isConnected) return;
    if (panel) box.style.overflowY = 'visible';
    const over = box.scrollHeight > box.clientHeight + 1;
    if (panel) box.style.overflowY = over ? 'auto' : 'visible';
    const style = getComputedStyle(box);
    const scrolls = over && (panel || ['auto', 'scroll'].includes(style.overflowY));
    const bar = box.offsetWidth - box.clientWidth - (parseFloat(style.borderLeftWidth) || 0) - (parseFloat(style.borderRightWidth) || 0);
    box.classList.toggle('sf-menu--scroll', scrolls);
    box.classList.toggle('sf-menu--scrollbar', scrolls && bar > 0.5);
  }

  watchColumnScroll() {
    const list = this.flyouts ? null : this.querySelector(':scope > nav > ul.sf-menu');

    if (this._scrollWatched === list) {
      if (list) this.syncScroll(list);
      return;
    }

    this._scrollObserver?.disconnect();
    this._scrollWatched = list;
    if (!list || typeof ResizeObserver === 'undefined') return;
    this._scrollObserver = new ResizeObserver(() => this.syncScroll(list));

    this._scrollObserver.observe(list);

    this.syncScroll(list);
  } // A row's panels are placed by the Framework's geometry, as the class menu
  // places them: the first level below its item, deeper ones to the inline
  // end; both flip and shift inside the viewport instead of overflowing it.


  syncAnchors() {
    const wanted = new Set();

    if (this.flyouts) {
      for (const id of this.openIds) {
        const row = this.querySelector(`[data-sf-menu-item="${CSS.escape(id)}"]`);
        const submenu = row?.querySelector(':scope > ul.sf-menu, :scope > .sf-menu-region');
        if (!submenu || submenu.hidden) continue;
        wanted.add(submenu);

        const current = this._anchors.get(submenu);

        if (current) {
          current.anchor.update();
          this.syncScroll(submenu, true);
          continue;
        }

        const saved = ['min-width', 'overflow-y'].map(name => [name, submenu.style.getPropertyValue(name), submenu.style.getPropertyPriority(name)]);
        submenu.style.overflowY = 'auto';
        let anchor;

        if (submenu.matches('.sf-menu-region')) {
          // A region is as wide as the header the row stands in -- else the
          // row's own nav -- and opens under it.
          const header = this.closest('.sf-site-header, header') || this.querySelector(':scope > nav') || row;
          anchor = positioning().anchor(header, submenu, {
            side: 'block-end',
            align: 'start',
            offset: 0,
            matchWidth: true,
            fitHeight: true,
            onPosition: () => this.syncScroll(submenu, true)
          });
        } else if (row.dataset.sfMenuLevel === '1') {
          // min-inline-size: 100% would resolve against the viewport once fixed.
          submenu.style.minWidth = `${row.getBoundingClientRect().width}px`; // It stands the gap under the header's edge, not under the row:
          // sf-header-site says how far its edge is below the row
          // (--sf-site-header--edge), so the current section's line on that
          // edge stays in sight while the panel is open (C30, R060).

          anchor = positioning().anchor(row, submenu, {
            side: 'block-end',
            align: 'start',
            offset: 'calc(var(--sf-site-header--edge, calc(var(--sf-px) * 0)) + var(--sf-space-1\\/4))',
            fitHeight: true,
            onPosition: () => this.syncScroll(submenu, true)
          });
        } else {
          // A side panel stands beside the panel its row is in, not over it:
          // past that panel's own edge (its padding and border) by the gap
          // between panels, its first row level with the row that opened it.
          // Its side is the chain's: the first side level takes the side
          // with room for every level still under it, and the levels under
          // it keep that side, so no level opens back over its own chain
          // (no zig-zag at the window's edge). Only a level that has no room
          // on that side at all turns over. The chevron stays › (R059).
          const panel = row.parentElement;
          submenu.style.minWidth = `${row.getBoundingClientRect().width}px`;
          const outer = panel.getBoundingClientRect();
          const box = row.getBoundingClientRect();
          const own = getComputedStyle(submenu);
          const gap = positioning().resolveLength('var(--sf-space-1\\/4)', this);
          const inherited = panel.dataset.sfSide;
          let side = 'inline-end';

          if (inherited === 'inline-start' || inherited === 'inline-end') {
            side = inherited;
          } else {
            const width = submenu.getBoundingClientRect().width + gap;
            const needed = width * panelDepth(this.item(id));
            const rtl = getComputedStyle(this).direction === 'rtl';
            const right = document.documentElement.clientWidth - outer.right;
            const left = outer.left;
            const [after, before] = rtl ? [left, right] : [right, left];
            side = after >= needed || after >= before ? 'inline-end' : 'inline-start';
          }

          submenu.dataset.sfSide = side;
          anchor = positioning().anchor(row, submenu, {
            side,
            align: 'start',
            fitHeight: true,
            offset: Math.max(outer.right - box.right, box.left - outer.left) + gap,
            alignmentOffset: -((parseFloat(own.paddingTop) || 0) + (parseFloat(own.borderTopWidth) || 0)),
            // The height it is given is known once placed: a panel cut to
            // the window scrolls, and its path line steps inside (R084).
            onPosition: () => this.syncScroll(submenu, true)
          });
        }

        this._anchors.set(submenu, {
          anchor,
          saved
        });

        this.syncScroll(submenu, true);
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

    if (this.moreActive) {
      this.measureOverflow(nav);
      return;
    }

    if (this._overflowHidden.length) this.setOverflowHidden([]);

    if (this.collapse !== 'auto' || this.overflow !== 'collapse' || !this.horizontal) {
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
  } // overflow more (priority+, C30): each first-level item's width is measured
  // as the row draws it -- every item and «Ещё» shown for the measure, in the
  // same task, so nothing is painted -- and the items that do not fit leave
  // the row from its end; the section that holds the current page stays
  // while it fits beside «Ещё». sf-menu-overflow says which left, each time
  // that changes.


  measureOverflow(nav) {
    const list = nav.querySelector(':scope > ul.sf-menu');
    const more = list?.querySelector(':scope > .sf-menu-item--more');
    if (!list || !more) return;
    const tops = Array.from(list.children).filter(li => li !== more && li.matches('[data-sf-menu-item], [data-sf-menu-placeholder]'));
    const was = [...tops, more].map(li => li.hidden);

    for (const li of [...tops, more]) li.hidden = false;

    const widths = tops.map(li => li.getBoundingClientRect().width);
    const moreWidth = more.getBoundingClientRect().width;
    [...tops, more].forEach((li, at) => {
      li.hidden = was[at];
    });
    const gap = parseFloat(getComputedStyle(list).columnGap) || 0;
    const ids = tops.map(li => li.dataset.sfMenuItem || li.dataset.sfMenuPlaceholder);
    const currentId = this.currentId;
    const above = currentId ? [currentId, ...((0,_items_mjs__WEBPACK_IMPORTED_MODULE_8__.pathTo)(this.menuItems, currentId) || [])] : [];
    const keep = ids.findIndex(id => above.includes(id));
    const stays = new Set((0,_items_mjs__WEBPACK_IMPORTED_MODULE_8__.fitRow)(widths, moreWidth, nav.clientWidth, gap, keep));
    this.setOverflowHidden(ids.filter((_, at) => !stays.has(at)), nav.clientWidth);
  }

  setOverflowHidden(hidden, width) {
    if (hidden.length === this._overflowHidden.length && hidden.every((id, at) => id === this._overflowHidden[at])) return; // A row in a box that takes its width from its content (a header not yet
    // drawn, a shrink-to-fit cell) gets wider when items leave it and
    // narrower when they come back: going straight back to the set it just
    // left, sooner than a frame or two, is that loop -- the row keeps the
    // set with more items under «Ещё» until its width changes on its own.

    const key = hidden.join('\u0000');
    const now = typeof performance === 'undefined' ? Date.now() : performance.now();
    const flip = this._overflowFlip;
    if (flip && flip.back === key && now - flip.at < 100 && hidden.length < this._overflowHidden.length) return; // The other way round: a set with fewer items under «Ещё» that bounced
    // straight back (the row narrowed once they were shown) does not hold at
    // the width it was measured at; a later measure at that same width (a
    // panel opening re-draws the row) keeps the row as it is, and the open
    // panel stays.

    const loop = this._overflowLoop;
    if (loop && loop.key === key && width !== undefined && loop.width === width) return;

    if (flip && flip.back === key && now - flip.at < 100 && hidden.length > this._overflowHidden.length) {
      this._overflowLoop = {
        key: this._overflowHidden.join('\u0000'),
        width: flip.width
      };
    }

    this._overflowFlip = {
      back: this._overflowHidden.join('\u0000'),
      at: now,
      width
    }; // A panel open over the row was placed for the row as it was.

    if (this.flyouts) this.closeFlyouts('method');
    this._overflowHidden = hidden;
    this.requestComponentUpdate('overflow');
    this.sfEmit('overflow', {
      hidden: [...hidden]
    });
  }

  afterRender(callback) {
    if (typeof callback === 'function') return super.afterRender(callback);
    this.syncAnchors();
    this.observeWidth();
    this.syncSurface();
    this.watchColumnScroll();
    this.syncSearchHighlight();
    return undefined;
  }

  templateContext() {
    const props = this.getPropsContext();
    this.syncMode();
    const all = this.menuItems;
    const result = this.searchResult();
    const items = result ? result.items : this.groupsDrawn ? all : (0,_items_mjs__WEBPACK_IMPORTED_MODULE_8__.withoutGroups)(all);
    const currentId = this.currentId;
    const tree = this.treeItems;
    const moreActive = this.moreActive;
    const selector = this.collapse === 'narrow' && this.collapsed;
    return this.createTemplateContext({ ...props,
      component: this,
      // The host's path id (§7.1.1, simai/ui-source#41): <path>--list and
      // <path>--menu-<n>, n the item's place in this element's own map.
      id: (0,_core_js_instance_path__WEBPACK_IMPORTED_MODULE_2__.partId)((0,_core_js_instance_path__WEBPACK_IMPORTED_MODULE_2__.instancePath)(this, {
        kind: 'sf-menu'
      })),
      items,
      // While the field holds words, the branches that lead to a match are
      // open and the others closed, whatever the person had opened.
      open: result ? result.open : new Set(this.openIds),
      currentId,
      // The branches above the current page: a closed one draws the bar (C23).
      holding: new Set(currentId ? (0,_items_mjs__WEBPACK_IMPORTED_MODULE_8__.pathTo)(tree, currentId) || [] : []),
      // overflow more: the first-level items that left the row (drawn there
      // as placeholders) and the «Ещё» branch that holds them.
      hidden: new Set(moreActive ? this._overflowHidden : []),
      moreItem: moreActive ? tree[tree.length - 1] : null,
      moreShown: moreActive && this._overflowHidden.length > 0,
      moreId: _items_mjs__WEBPACK_IMPORTED_MODULE_8__.MORE_ID,
      regionContent: name => this.regionNodes(name),
      // collapse narrow: the button is a selector showing the current item.
      selector,
      selectedItem: selector && currentId ? (0,_items_mjs__WEBPACK_IMPORTED_MODULE_8__.findItem)(all, currentId) : null,
      statusWord: status => this.sfWord(`status-${status}`),
      // A split row's chevron is named after its section: «Каталог: подразделы».
      subsectionsName: label => `${label}: ${this.sfWord('subsections')}`,
      indicator: this.indicator,
      bordered: this.bordered,
      search: this.searchActive,
      searchPlaceholder: this.getAttribute('search-placeholder') || this.sfWord('search-placeholder'),
      searchEmpty: Boolean(result) && result.items.length === 0,
      searchEmptyWords: this.sfWord('search-empty'),
      searchStatus: result ? result.items.length ? this.sfWord('search-found', {
        count: result.count
      }) : this.sfWord('search-empty') : '',
      newTabWords: this.sfWord('new-tab'),
      flyouts: this.flyouts,
      collapsed: this.collapsed,
      panelOpen: this.panelOpen,
      compact: this.appearance === 'compact',
      appearance: this.appearance,
      label: this.getAttribute('aria-label') || this.getProp('label') || this._childLabel,
      toggleLabel: this.getAttribute('toggle-label') || this.sfWord('toggle-label'),
      domId: id => this.domId(id),
      rootClass: this.getRootClass()
    });
  } // A region's template (<template slot="region-<name>">), stamped once: the
  // region keeps its nodes from one render to the next.


  regionNodes(name) {
    if (!name) return null;
    if (this._regionNodes.has(name)) return this._regionNodes.get(name);
    const nodes = this._slotTemplates.get(`region-${name}`) || [];
    if (!nodes.length) return null;
    const stamped = nodes.map(node => node.cloneNode(true));

    this._regionNodes.set(name, stamped);

    return stamped;
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_7__.renderMenuTemplate)(this.templateContext());
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
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("efa66f8927d1");
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
// opens below it (down, up when open); a deeper panel of a row opens to the
// side and its glyph is always › (inline end; mirrored in RTL only): the
// panel's side follows the room, the glyph never turns (C30, R059); a
// column's branch opens in place (right, down when open).


function branchGlyph(context, level, open) {
  if (context.flyouts && level === 1) return open ? 'keyboard_arrow_up' : 'keyboard_arrow_down';
  if (context.flyouts) return 'chevron_right';
  return open ? 'keyboard_arrow_down' : 'chevron_right';
} // A count is the class counter: a .sf-badge with data-count, which the badges
// runtime caps at 99+, hides at 0 and names after the label. Any other badge
// is a short label in the same place.


function renderBadge(item) {
  if (!item.badge) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const count = (0,_items_mjs__WEBPACK_IMPORTED_MODULE_2__.badgeCount)(item.badge);
  return count !== null ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-badge" data-count=${count}></span>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-badge sf-badge--tight">${item.badge}</span>`;
} // An item's status: the class dot of its tone at the row's end, before the
// counter, and its word in the link's name («Адрес, внимание»), out of sight.


function renderStatus(context, item) {
  if (!item.status) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class=${`sf-dot sf-dot--size-1/2 sf-dot--${item.status}`} aria-hidden="true"><span class="sf-dot-item"></span></span><span class="sf-menu-element-status">${context.statusWord(item.status)}</span>`;
} // A link that leaves the site (C30 amended, R071): ↗ at the row's end, and
// in the link's name, out of sight, that it opens in a new tab when it does.


function renderExternal(context, item) {
  if (!item.external) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class="sf-icon sf-menu-element-external" aria-hidden="true">arrow_outward</i>${item.target === '_blank' ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-menu-element-status">${context.newTabWords}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}`;
} // What a row holds, in the class order: an icon, the words, a status dot and a
// counter.


function renderWrapContent(context, item) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${item.icon ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class="sf-icon sf-menu-element-icon" aria-hidden="true">${item.icon}</i>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}<span class="sf-menu-element-text">${item.label}</span>${renderStatus(context, item)}${renderBadge(item)}${renderExternal(context, item)}`;
} // A link's own target: rel noopener for a new tab.


const targetOf = item => item.target || lit__WEBPACK_IMPORTED_MODULE_0__.nothing;

const relOf = item => item.target === '_blank' ? 'noopener' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;

const renderWrap = (context, item) => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-menu-element-wrap">${renderWrapContent(context, item)}</span>`; // The branch's disclosure glyph as the class draws it inside a button row: an
// icon-button box hidden from assistive technology, the button being the row.


const renderTrailing = glyph => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-icon-button" aria-hidden="true"><span class="sf-icon" aria-hidden="true">${glyph}</span></span>`; // A first-level item a row with overflow more shows in its «Ещё» panel stays
// in the row as a placeholder, hidden: the same row, so its width is measured
// as it would be drawn, without the names and the controls of the real one.


function renderRow(context, item, level, branch, open, submenuId, placeholder = false) {
  const current = context.currentId === item.id;

  const own = value => placeholder ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : value; // A row with items under it that holds the current page and shows no list
  // -- a closed branch, a rail row -- takes the class menu's bar (C23).
  // In a row every level keeps the mark while its panel is open: the panel
  // is over the page, not the row, and an open path row keeps its medium
  // label and primary › on the select plate (C30, R057).


  const holds = item.children.length > 0 && context.holding.has(item.id) && (!open || context.flyouts);
  const classes = joinClasses('sf-menu-element', levelClass(level), branch ? 'sf-menu-element--has-submenu' : '', open ? 'open' : '', holds ? 'sf-menu-element--holds-current' : '', item.disabled ? 'disabled' : '');
  const linked = Boolean(item.href) && !item.disabled;

  if (!branch) {
    // A destination is a link; an unavailable one keeps its place as a link
    // without an address, out of the tab order. A row without an address is
    // words in the row's place.
    if (linked) {
      return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<a class=${classes} href=${item.href} aria-current=${current ? 'page' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                     target=${targetOf(item)} rel=${relOf(item)}
                     data-sf-menu-link=${own(item.id)}>${renderWrap(context, item)}</a>`;
    }

    if (item.disabled) return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<a class=${classes} aria-disabled="true">${renderWrap(context, item)}</a>`;
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class=${classes} aria-current=${current ? 'page' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>${renderWrap(context, item)}</span>`;
  }

  const glyph = branchGlyph(context, level, open); // A branch that is also a destination: the link and the disclosure button
  // are siblings inside the row, as the class menu documents.

  if (item.href) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class=${classes}>
      ${linked ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<a class="sf-menu-element-wrap" href=${item.href} aria-current=${current ? 'page' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                  target=${targetOf(item)} rel=${relOf(item)}
                  data-sf-menu-link=${own(item.id)}>${renderWrapContent(context, item)}</a>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<a class="sf-menu-element-wrap" aria-disabled="true">${renderWrapContent(context, item)}</a>`}
      <button class="sf-icon-button" type="button" aria-expanded=${open ? 'true' : 'false'} aria-controls=${own(submenuId)}
              aria-label=${context.subsectionsName(item.label)} ?disabled=${item.disabled}
              data-sf-menu-toggle=${own(item.id)}><span class="sf-icon" aria-hidden="true">${glyph}</span></button>
    </div>`;
  }

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<button class=${classes} type="button" aria-expanded=${open ? 'true' : 'false'} aria-controls=${own(submenuId)}
                      ?disabled=${item.disabled} data-sf-menu-toggle=${own(item.id)}>${renderWrap(context, item)}${renderTrailing(glyph)}</button>`;
} // A region's own row: a link, or the words of an item without an address, in
// the class row of its place (head, link or small link).


function renderRegionLink(context, item, part) {
  const current = context.currentId === item.id;
  const classes = joinClasses('sf-menu-element', `sf-menu-region-${part}`, item.disabled ? 'disabled' : '');

  if (item.href && !item.disabled) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<a class=${classes} href=${item.href} aria-current=${current ? 'page' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                   data-sf-menu-link=${item.id}>${renderWrap(context, item)}</a>`;
  }

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class=${classes} aria-disabled=${item.disabled ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>${renderWrap(context, item)}</span>`;
} // The region a row's branch opens without a template of its own: a column per
// child that has children of its own -- its row the column's head, its
// children the links, their children the small links under each -- and the
// children without any in a line under the columns.


function renderRegionColumns(context, item) {
  const columns = item.children.filter(child => child.children.length);
  const loose = item.children.filter(child => !child.children.length);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    ${columns.length ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-menu-region-columns">${(0,lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__.repeat)(columns, column => column.id, column => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
      <div class="sf-menu-region-column">
        ${renderRegionLink(context, column, 'head')}
        <ul class="sf-menu-region-list">${(0,lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__.repeat)(column.children, child => child.id, child => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
          <li>${renderRegionLink(context, child, 'link')}${child.children.length ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<ul class="sf-menu-region-list sf-menu-region-list--small">${(0,lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__.repeat)(child.children, small => small.id, small => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<li>${renderRegionLink(context, small, 'small')}</li>`)}</ul>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}</li>`)}
        </ul>
      </div>`)}</div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    ${loose.length ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<ul class="sf-menu-region-list sf-menu-region-foot">
      ${(0,lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__.repeat)(loose, child => child.id, child => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<li>${renderRegionLink(context, child, 'link')}</li>`)}
    </ul>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
  `;
} // A row's first-level branch with a region (a mega menu): a panel as wide as
// the header under it, holding the template the host wrote for it -- any
// markup -- or the item's children as columns.


function renderRegion(context, item, open, submenuId) {
  const content = context.regionContent(item.region);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class=${joinClasses('sf-menu-region', content ? 'sf-menu-region--template' : '')} id=${submenuId}
                   role="group" aria-label=${item.label} data-sf-menu-region=${item.region} ?hidden=${!open}>
    ${content || renderRegionColumns(context, item)}
  </div>`;
}

function renderItem(context, item, level) {
  // A compact rail opens no branch: its rows are the first level alone.
  const branch = item.children.length > 0 && !context.compact; // A first-level item of a row that went to «Ещё»: its placeholder.

  if (level === 1 && context.hidden.has(item.id)) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
      <li class=${joinClasses('sf-menu-item', branch ? 'sf-menu-item--has-submenu' : '')} hidden inert
          data-sf-menu-placeholder=${item.id} data-sf-menu-level="1">
        ${renderRow(context, item, level, branch, false, '', true)}
      </li>
    `;
  }

  const open = branch && context.open.has(item.id);
  const submenuId = `${context.id}--menu-${context.domId(item.id)}`;
  const region = branch && context.flyouts && level === 1 && item.region; // The «Ещё» branch draws the items that left the row as rows of its panel:
  // the second level, so their branches open to the side.

  const more = item.id === context.moreId;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <li class=${joinClasses('sf-menu-item', branch ? 'sf-menu-item--has-submenu' : '', open ? 'open' : '', region ? 'sf-menu-item--has-region' : '', more ? 'sf-menu-item--more' : '')}
        data-sf-menu-item=${item.id} data-sf-menu-level=${level} ?hidden=${more && !context.moreShown}>
      ${renderRow(context, item, level, more || branch, open, submenuId)}
      ${!branch && !more ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : region ? renderRegion(context, item, open, submenuId) : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<ul class="sf-menu" id=${submenuId} ?hidden=${!open}>${renderItems(context, item.children, level + 1)}</ul>`}
    </li>
  `;
} // A group of a column: its heading -- words, or the button that opens and
// closes it when it is collapsible -- over a list of first-level rows that the
// heading names.


function renderGroup(context, item) {
  const open = context.open.has(item.id);
  const listId = `${context.id}--menu-${context.domId(item.id)}`;
  const headingId = `${listId}-heading`;
  const heading = item.collapsible ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<button class="sf-menu-group-heading" type="button" id=${headingId}
                   aria-expanded=${open ? 'true' : 'false'} aria-controls=${listId}
                   ?disabled=${item.disabled} data-sf-menu-toggle=${item.id}>
        <span class="sf-menu-group-label">${item.label}</span>${renderStatus(context, item)}${renderBadge(item)}
        <span class="sf-icon" aria-hidden="true">${open ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}</span>
      </button>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-menu-group-heading" id=${headingId}>
        <span class="sf-menu-group-label">${item.label}</span>${renderStatus(context, item)}${renderBadge(item)}
      </span>`;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <li class=${joinClasses('sf-menu-item', 'sf-menu-item--group', open ? 'open' : '')}
        data-sf-menu-item=${item.id} data-sf-menu-group>
      ${heading}
      <ul class="sf-menu" id=${listId} aria-labelledby=${headingId} ?hidden=${!open}>${renderItems(context, item.children, 1)}</ul>
    </li>
  `;
}

function renderItems(context, items, level) {
  return (0,lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__.repeat)(items, item => item.id, item => item.group ? renderGroup(context, item) : renderItem(context, item, level));
} // The button a row that does not fit becomes: a class menu row (a size 1
// control, as every row), the menu glyph and its words, the disclosure glyph
// at its end.
// A selector (collapse narrow) shows the current item instead -- its icon and
// words -- and is named by the menu and that item: «Разделы: Адрес».


function renderPanelToggle(context) {
  const open = context.panelOpen;
  const selected = context.selector ? context.selectedItem : null;
  const icon = selected ? selected.icon : 'menu';
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<button class=${joinClasses('sf-menu-element', 'sf-menu-element--level-1', 'sf-menu-element--has-submenu', 'sf-smart-menu-toggle', open ? 'open' : '')}
                      type="button" aria-expanded=${open ? 'true' : 'false'} aria-controls=${`${context.id}--list`}
                      aria-label=${selected ? `${context.label || context.toggleLabel}: ${selected.label}` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                      data-sf-menu-panel-toggle>
    <span class="sf-menu-element-wrap">${icon ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class="sf-icon sf-menu-element-icon" aria-hidden="true">${icon}</i>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}<span class="sf-menu-element-text">${selected ? selected.label : context.toggleLabel}</span></span>
    ${renderTrailing(open ? 'keyboard_arrow_up' : 'keyboard_arrow_down')}
  </button>`;
} // A column's search (C30 amended, R071 a): a field over the rows -- the
// Framework's sf-input, filled and rounded, its magnifier over the rows'
// icons (C06) -- and a polite live region that says how many matched. The
// field stands still; the rows under it scroll.


function renderSearch(context) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-smart-menu-search">
    <sf-input class="sf-smart-menu-search-field" input-type="search" appearance="filled" radius="rounded" icon-start="search"
              placeholder=${context.searchPlaceholder} aria-label=${context.searchPlaceholder}
              autocomplete="off" data-sf-menu-search></sf-input>
    <span class="sf-menu-element-status" role="status" aria-live="polite" aria-atomic="true">${context.searchStatus}</span>
  </div>`;
} // The class markup inside a named <nav>: ul.sf-menu > li.sf-menu-item > the
// row and the nested ul.sf-menu. The whole of it carries data-sf-menu-owned,
// so the class runtime, loaded beside it for the sheet, leaves it to the
// element.


function renderMenuTemplate(context) {
  const listClasses = joinClasses('sf-menu', context.flyouts ? 'sf-menu--horizontal' : '', context.appearance !== 'default' ? `sf-menu--${context.appearance}` : '', // The row's current section: a line on the header's edge (default) or,
  // with indicator fill, the C23 plate (C30).
  context.flyouts && context.indicator === 'fill' ? 'sf-menu--indicator-fill' : '', // A column with a border of its own: the path's line lies on it (R072 e).
  !context.flyouts && context.bordered ? 'sf-menu--bordered' : '');
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <nav class=${joinClasses('sf-smart-menu', context.collapsed ? 'sf-smart-menu--collapsed' : '', context.search ? 'sf-smart-menu--search' : '', context.rootClass)}
         style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
         aria-label=${context.label || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
         data-orientation=${context.flyouts ? 'horizontal' : 'vertical'}
         data-overflow=${context.moreItem ? 'more' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
         data-sf-menu-owned>
      ${context.collapsed ? renderPanelToggle(context) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      ${context.search ? renderSearch(context) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      <ul class=${listClasses} id=${`${context.id}--list`} ?hidden=${context.collapsed && !context.panelOpen || context.searchEmpty}>
        ${renderItems(context, context.items, 1)}${context.moreItem ? renderItem(context, context.moreItem, 1) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      </ul>
      ${context.search && context.searchEmpty ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<p class="sf-smart-menu-search-empty">${context.searchEmptyWords}</p>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
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

/***/ "efa66f8927d1"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit/directives/repeat.js", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("lit/directives/repeat.js", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "2a080a730149"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("lit", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "bf0cea966575"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("open-surface-mark", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("open-surface-mark", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "116963e5e31b"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("position", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("position", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "deb1a4d61565"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("smart-base", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("smart-base", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "7332c9a6d69c"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HOVER_CLOSE_DELAY: () => (/* binding */ HOVER_CLOSE_DELAY),
/* harmony export */   HOVER_OPEN_DELAY: () => (/* binding */ HOVER_OPEN_DELAY),
/* harmony export */   HOVER_REGION_OPEN_DELAY: () => (/* binding */ HOVER_REGION_OPEN_DELAY),
/* harmony export */   ITEM_FIELD_ALIASES: () => (/* binding */ ITEM_FIELD_ALIASES),
/* harmony export */   LEVEL_LIMIT: () => (/* binding */ LEVEL_LIMIT),
/* harmony export */   MENU_APPEARANCES: () => (/* binding */ MENU_APPEARANCES),
/* harmony export */   MENU_COLLAPSE: () => (/* binding */ MENU_COLLAPSE),
/* harmony export */   MENU_INDICATORS: () => (/* binding */ MENU_INDICATORS),
/* harmony export */   MENU_OPEN_ON: () => (/* binding */ MENU_OPEN_ON),
/* harmony export */   MENU_ORIENTATIONS: () => (/* binding */ MENU_ORIENTATIONS),
/* harmony export */   MENU_OVERFLOW: () => (/* binding */ MENU_OVERFLOW),
/* harmony export */   MENU_STATUSES: () => (/* binding */ MENU_STATUSES),
/* harmony export */   MORE_ID: () => (/* binding */ MORE_ID),
/* harmony export */   ROW_APPEARANCES: () => (/* binding */ ROW_APPEARANCES),
/* harmony export */   badgeCount: () => (/* binding */ badgeCount),
/* harmony export */   currentItemId: () => (/* binding */ currentItemId),
/* harmony export */   filterItems: () => (/* binding */ filterItems),
/* harmony export */   findItem: () => (/* binding */ findItem),
/* harmony export */   fitRow: () => (/* binding */ fitRow),
/* harmony export */   foldWords: () => (/* binding */ foldWords),
/* harmony export */   itemsFromList: () => (/* binding */ itemsFromList),
/* harmony export */   matchesIn: () => (/* binding */ matchesIn),
/* harmony export */   normaliseItem: () => (/* binding */ normaliseItem),
/* harmony export */   normaliseItems: () => (/* binding */ normaliseItems),
/* harmony export */   normalisePath: () => (/* binding */ normalisePath),
/* harmony export */   onItemAlias: () => (/* binding */ onItemAlias),
/* harmony export */   openBranches: () => (/* binding */ openBranches),
/* harmony export */   pathTo: () => (/* binding */ pathTo),
/* harmony export */   walkItems: () => (/* binding */ walkItems),
/* harmony export */   withoutGroups: () => (/* binding */ withoutGroups)
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
// (sf-menu--documentation-tree), the compact rail (sf-menu--compact) and the
// header navigation (sf-menu--navigation). The tree and the rail are columns:
// with them the menu is vertical. The navigation is a row or a column, as
// orientation says, like the default.
const MENU_APPEARANCES = Object.freeze(['default', 'documentation-tree', 'compact', 'navigation']);
// The presentations that can stand in a row.
const ROW_APPEARANCES = Object.freeze(['default', 'navigation']);
// When a row of links that does not fit becomes a button that opens them as a
// column: when it does not fit, always, or never.
// narrow: a column (or a row) that is shown as that button while the page is
// narrower than the md breakpoint -- a phone -- whose words are then the
// current item's, a compact selector of the sections.
const MENU_COLLAPSE = Object.freeze(['auto', 'always', 'narrow', 'none']);
// What a row of links does when its items do not fit (C30, the values of
// sf-tabs' overflow where they mean the same): more, the items that do not fit
// leave the row for a trailing «Ещё» branch -- priority+ -- and the section
// holding the current page stays; collapse, the whole row becomes the button
// (collapse auto); none, the row stays as it is.
const MENU_OVERFLOW = Object.freeze(['more', 'collapse', 'none']);
// How a row's branch opens: a press (the default, WAI-ARIA and USWDS), or a
// pointer resting on it -- the hover delays of NN/g, 300 ms to open and
// 500 ms outside before it closes -- with the press still working.
const MENU_OPEN_ON = Object.freeze(['click', 'hover']);
const MENU_INDICATORS = Object.freeze(['line', 'fill']);
const HOVER_OPEN_DELAY = 300;
// A region (a mega menu) is a bigger change of the page: it waits longer.
const HOVER_REGION_OPEN_DELAY = 500;
const HOVER_CLOSE_DELAY = 500;
// The id of the trailing «Ещё» branch of a row with overflow more. An item id
// never starts with @ in a host's data by this rule: one that does is
// renamed by its place.
const MORE_ID = '@more';
// The tones of an item's status dot: the class dot's tones (src/component/dot).
const MENU_STATUSES = Object.freeze(['success', 'warning', 'error', 'info', 'neutral']);
// The class menu draws four levels; a deeper one is drawn as the fourth.
const LEVEL_LIMIT = 4;

const text = (value) => (value === null || value === undefined ? '' : String(value));

// One item, as the element draws it, with its children. `label` is text, never
// markup; `badge` is a count (drawn by the class counter: capped at 99+,
// hidden at 0, its phrase ends the link's name) or a short label, and `count`
// the same count by its own name. `status` is a dot of one of the tones.
//
// A first-level item with `group: true` is a group: a heading over its items
// (`children`, or `items` by the shape of a grouped navigation), never a
// destination itself. Its items are first-level rows; a group is open unless
// it says `open: false`, and only a `collapsible` one is opened and closed.
// The first release's spellings of an item's fields -- key for id, text and
// title for label -- are read until 2027-01-01 and never offered: they are
// in no contract, and contracts/changes/journal.json records them
// (sf-menu-item-field-aliases). The element hands in its runtime note, so this
// module stays free of the page and runs in Node.
const ITEM_FIELD_ALIASES = Object.freeze({key: 'id', text: 'label', title: 'label'});
let noteAlias = () => {};
function onItemAlias(note) {
  noteAlias = typeof note === 'function' ? note : () => {};
}

function normaliseItem(item, index = 0, parentId = '', seen = new Set()) {
  if (typeof item === 'string') item = {label: item};
  if (!item || typeof item !== 'object' || Array.isArray(item)) return null;
  if (item.id == null && item.key != null) noteAlias('key', 'id');
  if (item.label == null && item.text != null) noteAlias('text', 'label');
  else if (item.label == null && item.title != null) noteAlias('title', 'label');
  const own = text(item.id ?? item.key).trim().replace(/^@.*$/u, '');
  const id = own || (parentId ? `${parentId}-${index + 1}` : `item-${index + 1}`);
  if (seen.has(id)) return null;
  seen.add(id);
  const group = !parentId && Boolean(item.group);
  const nested = Array.isArray(item.children) ? item.children : group && Array.isArray(item.items) ? item.items : [];
  const children = [];
  nested.forEach((child, at) => {
    const normalised = normaliseItem(child, at, id, seen);
    if (normalised) children.push(normalised);
  });
  const status = text(item.status).trim();
  const normalised = {
    id,
    label: text(item.label ?? item.text ?? item.title),
    href: group ? '' : text(item.href).trim(),
    icon: text(item.icon).trim(),
    badge: text(item.badge ?? item.count).trim(),
    status: MENU_STATUSES.includes(status) ? status : '',
    current: !group && Boolean(item.current),
    disabled: Boolean(item.disabled),
    open: group ? item.open !== false : Boolean(item.open),
    // A row's first-level branch that opens a region (a mega menu) instead of
    // a panel: the name of a <template slot="region-<name>"> written inside
    // the element; without one the region draws the item's children as
    // columns. Elsewhere -- a column, a deeper level, the «Ещё» panel -- it
    // is an ordinary branch.
    region: group ? '' : text(item.region).trim(),
    // A link that leaves the site or opens elsewhere (C30 amended, R071): its
    // target is the link's, and an item with a target of its own (_blank) or
    // external: true draws ↗ after its words.
    target: group ? '' : text(item.target).trim(),
    external: !group && (Boolean(item.external) || (Boolean(text(item.target).trim()) && text(item.target).trim() !== '_self')),
    children,
  };
  if (group) {
    normalised.group = true;
    normalised.collapsible = Boolean(item.collapsible);
  }
  return normalised;
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
function currentItemId(items, {current = '', pathname = '', hash = '', base = '', fromLocation = false} = {}) {
  const named = text(current).trim();
  const namedItem = named ? findItem(items, named) : null;
  if (namedItem && !namedItem.group) return named;
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
      // A link to a section of a page (#address) is that section only while
      // the location names it: in-page panels, one hash each.
      if (target.hash && target.hash !== text(hash)) return;
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
// page starts. A group that cannot be collapsed is always open; a row draws
// no group (its items stand in the row), so none is open there.
function openBranches(items, overrides = new Map(), currentId = null, inColumn = true) {
  const reveal = new Set(inColumn && currentId ? pathTo(items, currentId) || [] : []);
  const open = new Set();
  walkItems(items, (item) => {
    if (!item.children.length) return;
    if (item.group && !item.collapsible) {
      if (inColumn) open.add(item.id);
      return;
    }
    const fallback = inColumn && (item.open || reveal.has(item.id));
    const state = overrides.has(item.id) ? overrides.get(item.id) : fallback;
    if (state) open.add(item.id);
  });
  return open;
}

// A list written in the markup, read as items: each <li> is an item, its
// direct <a> the link (href, aria-current, the label from its words), its
// direct <ul> the children. data-id (or id), data-icon, data-badge,
// data-open, data-disabled, data-status, data-group and data-collapsible
// give the other fields (data-open="false" closes a group at first); a row the class menu has
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
        // A group is open unless data-open="false" says otherwise.
        open: has(li, 'data-group')
          ? attr(li, 'data-open') !== 'false'
          : has(li, 'data-open') || Boolean(li.classList?.contains?.('open')),
        group: has(li, 'data-group'),
        region: attr(li, 'data-region') || '',
        target: attr(link, 'target') || '',
        external: has(li, 'data-external') || has(link, 'data-external'),
        collapsible: has(li, 'data-collapsible'),
        status: attr(li, 'data-status') || '',
        children: nested ? itemsFromList(nested) : [],
      };
    });
}

// The items as a row or a compact rail draws them: a group gives its items
// to the first level, in its place, and draws no heading.
function withoutGroups(items) {
  return items.flatMap((item) => (item.group ? item.children : [item]));
}

// Which first-level items of a row stay in it when the row is `available`
// wide (priority+, C30): every item when all fit; else, from the start, as
// many as fit beside the «Ещё» button, the item at `keep` (the section that
// holds the current page) first of all -- unless it does not fit beside the
// button either. Widths are each item's own, `gap` the row's gap. Answers the
// indexes that stay, in order; none means the button alone, then «Меню».
function fitRow(widths, moreWidth, available, gap = 0, keep = -1) {
  const count = widths.length;
  const all = widths.reduce((sum, width) => sum + width, 0) + gap * Math.max(0, count - 1);
  if (all <= available + 0.5) return widths.map((_, index) => index);
  const stays = [];
  let used = moreWidth;
  if (keep >= 0 && keep < count && used + gap + widths[keep] <= available + 0.5) {
    used += gap + widths[keep];
    stays.push(keep);
  }
  for (let index = 0; index < count; index += 1) {
    if (index === keep) continue;
    if (used + gap + widths[index] > available + 0.5) break;
    used += gap + widths[index];
    stays.push(index);
  }
  return stays.sort((a, b) => a - b);
}

// Search in a column (C30 amended 2026-11-09, R071 a). Words are compared
// without case and with ё as е; one character stays one character, so a
// place in the folded words is the same place in the words drawn.
function foldWords(value) {
  let folded = '';
  for (const unit of text(value)) {
    const lower = unit.toLowerCase();
    folded += lower === 'ё' ? 'е' : lower.length === unit.length ? lower : unit;
  }
  return folded;
}

// Where `query` stands in `words`: [start, end] pairs, none when it does not.
function matchesIn(words, query) {
  const needle = foldWords(query).trim();
  if (!needle) return [];
  const haystack = foldWords(words);
  const found = [];
  let at = haystack.indexOf(needle);
  while (at !== -1) {
    found.push([at, at + needle.length]);
    at = haystack.indexOf(needle, at + needle.length);
  }
  return found;
}

// The items a query keeps: an item whose words match stays with all its
// children, closed unless one of them matches too; an item one of whose
// descendants matches stays, open, with only the branches that lead to a
// match; a group whose heading matches stays whole. Answers {items, open,
// count}: the tree to draw, the ids to draw open (groups and the branches
// leading to a match) and how many words matched.
function filterItems(items, query) {
  const open = new Set();
  let count = 0;
  const keep = (item, whole) => {
    const hit = matchesIn(item.label, query).length > 0;
    if (hit) count += 1;
    if (whole) {
      // Under a matching heading or parent: everything stays; matches below
      // still count and still open their branch.
      const children = item.children.map((child) => keep(child, true));
      if (item.children.some((child, at) => children[at].leads)) open.add(item.id);
      return {item: {...item, children: children.map((entry) => entry.item)}, leads: hit || children.some((entry) => entry.leads)};
    }
    if (hit) {
      const children = item.children.map((child) => keep(child, true));
      if (item.group || children.some((entry) => entry.leads)) open.add(item.id);
      return {item: {...item, children: children.map((entry) => entry.item)}, leads: true};
    }
    const children = item.children.map((child) => keep(child, false)).filter(Boolean);
    if (!children.length) return null;
    open.add(item.id);
    return {item: {...item, children: children.map((entry) => entry.item)}, leads: true};
  };
  const kept = items.map((item) => keep(item, false)).filter(Boolean);
  return {items: kept.map((entry) => entry.item), open, count};
}


/***/ },

/***/ "97168578e30d"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-menu for the shim (core/js/aliases.js, standard §16 item 20). mode: same-detail (the shim sends the new and the old name), split (the old detail from the element\'s adapter), host-attribute (no shim).","component":"sf-menu","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"sf-menu:navigate","to":"sf-menu-navigate","kind":"event","component":"sf-menu","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","cancelable":true,"section":"§8, §16 item 6, vocabulary §5.1","note":"{id, href, item} is data only; one cancel for both names"},{"from":"sf-menu:toggle","to":"sf-menu-toggle","kind":"event","component":"sf-menu","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","cancelable":false,"section":"§8, §16 item 6","note":"{id, open, source, item} is data only"}]}');

/***/ },

/***/ "e0fa46ed075f"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.menu","tag":"sf-menu","version":"1.6.0","kind":"leaf","settings":{"items":{"type":"list","default":[],"of":{"id":"id","label":"string","href":{"type":"string","optional":true},"icon":{"type":"icon","optional":true},"badge":{"type":"string","optional":true},"count":{"type":"number","optional":true},"status":{"type":"enum","values":["success","warning","error","info","neutral"],"optional":true},"current":{"type":"boolean","optional":true},"disabled":{"type":"boolean","optional":true},"open":{"type":"boolean","optional":true},"children":{"type":"list","optional":true},"region":{"type":"string","optional":true},"target":{"type":"string","optional":true},"external":{"type":"boolean","optional":true},"group":{"type":"boolean","optional":true},"collapsible":{"type":"boolean","optional":true},"items":{"type":"list","optional":true}}},"orientation":{"type":"enum","values":["vertical","horizontal"],"default":"vertical"},"appearance":{"type":"enum","values":["default","documentation-tree","compact","navigation"],"default":"default"},"current-from-location":{"type":"boolean","default":false},"collapse":{"type":"enum","values":["auto","always","narrow","none"],"default":"auto"},"overflow":{"type":"enum","values":["more","collapse","none"],"default":"collapse"},"more-label":{"type":"string","default-from":"runtime.more-label"},"open-on":{"type":"enum","values":["click","hover"],"default":"hover"},"indicator":{"type":"enum","values":["line","fill"],"default":"line"},"label":{"type":"string","default":""},"toggle-label":{"type":"string","default-from":"runtime.toggle-label"},"sticky":{"type":"boolean","default":false},"bordered":{"type":"boolean","default":false},"search":{"type":"boolean","default":false},"search-placeholder":{"type":"string","default-from":"runtime.search-placeholder"}},"values":{"current":{"type":"string","default":""}},"events":{"navigate":{"carries":{"id":"id","href":"string","item":"object"},"cancelable":true},"toggle":{"carries":{"id":{"type":"id","nullable":true},"open":"boolean","source":{"type":"enum","values":["user","method"]},"item":{"type":"object","nullable":true}}},"overflow":{"carries":{"hidden":{"type":"list","of":"id"}}},"search":{"carries":{"query":"string","count":"number"}}},"actions":{"open":{"with":{"id":"id"}},"close":{"with":{"id":"id"}},"toggle":{"with":{"id":"id"}},"close-all":{}},"presentation":{"skeleton":{"late":["items"]}},"css-variables":{"--sf-menu-background-color":{"type":"color","state":"default"},"--sf-menu-gap":{"type":"length","state":"default"},"--sf-menu-item-color":{"type":"color","state":"default"},"--sf-menu-item-background-color":{"type":"color","state":"default"},"--sf-menu-item-border-color":{"type":"color","state":"default"},"--sf-menu-item-radius":{"type":"length","state":"default"},"--sf-menu-submenu-background-color":{"type":"color","state":"open"},"--sf-menu-submenu-border-color":{"type":"color","state":"open"},"--sf-menu-submenu-radius":{"type":"length","state":"open"},"--sf-menu-sticky-top":{"type":"length","state":"default"}}}');

/***/ },

/***/ "33262fd5308c"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Menu","runtime":{"toggle-label":"Menu","more-label":"More","status-success":"all good","status-warning":"needs attention","status-error":"error","status-info":"something new","status-neutral":"no data","subsections":"subsections","search-placeholder":"Search","search-found":"Found: {n}","search-empty":"Nothing found","new-tab":"opens in a new tab"}}');

/***/ },

/***/ "15d5a97ca4e8"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Меню","runtime":{"toggle-label":"Меню","more-label":"Ещё","status-success":"в порядке","status-warning":"внимание","status-error":"ошибка","status-info":"есть новое","status-neutral":"нет данных","subsections":"подразделы","search-placeholder":"Поиск","search-found":"Найдено: {n}","search-empty":"Ничего не найдено","new-tab":"откроется в новой вкладке"}}');

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