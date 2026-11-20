/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "a323dcfdc8c0"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LABEL_MIN_EM: () => (/* binding */ LABEL_MIN_EM),
/* harmony export */   MIN_FOLD: () => (/* binding */ MIN_FOLD),
/* harmony export */   capRange: () => (/* binding */ capRange),
/* harmony export */   collapseRange: () => (/* binding */ collapseRange),
/* harmony export */   cutBelowMin: () => (/* binding */ cutBelowMin),
/* harmony export */   cutByRoom: () => (/* binding */ cutByRoom),
/* harmony export */   fitRange: () => (/* binding */ fitRange),
/* harmony export */   maxFitHidden: () => (/* binding */ maxFitHidden),
/* harmony export */   menuEntries: () => (/* binding */ menuEntries),
/* harmony export */   nextFit: () => (/* binding */ nextFit),
/* harmony export */   starvedFit: () => (/* binding */ starvedFit),
/* harmony export */   trailOverflows: () => (/* binding */ trailOverflows),
/* harmony export */   trailStarved: () => (/* binding */ trailStarved)
/* harmony export */ });
// Which crumbs of a trail are hidden behind «…» (R177 BC-06, BC-11).
//
// One answer for every runtime that collapses a trail: the ordinary script
// (breadcrumbs.js, the class markup a server prints) and sf-breadcrumbs, which
// imports this file into its own bundle. Before, each kept its own copy of the
// arithmetic and they drifted.
//
// A trail collapses for two reasons:
//
//   - a cap: max-items, when the page sets one (3 or more). It keeps the shape
//     it always had: floor((max - 1) / 2) crumbs at the start, the rest at the
//     end, «…» in between.
//   - room (owner decision C93 item 1): while the row has no room for its
//     crumbs (trailOverflows), one more crumb goes behind «…». The first crumb
//     goes last of the ancestors, and the tail is never hidden: the parent and
//     the current page (or, in a trail of parents only, the parent). At its
//     narrowest a trail reads «… › parent › current» (C93 item 2). Room is the
//     only reason on every ladder: a trail that fits the phone stays whole, and
//     no single crumb hides behind «…» (L1 of the C93 review). Past that
//     narrowest, a tail crumb cut below a few letters (cutBelowMin) folds too:
//     «… › current» (starvedFit).
//
// A range is {start, end}: the crumbs start .. end - 1 are hidden. null hides
// nothing.
// The crumbs a cap of max-items hides.
function capRange(count, maxItems) {
  const total = Math.max(0, Math.floor(Number(count) || 0));
  const max = Math.floor(Number(maxItems) || 0);
  if (max < 3 || total <= max) return null;
  const visible = max - 1;
  const leading = Math.floor(visible / 2);
  const trailing = visible - leading;
  if (total - leading - trailing <= 0) return null;
  return {
    start: leading,
    end: total - trailing
  };
} // Room hides two crumbs at least: one crumb behind «…» saves next to no width
// and costs a tap (L1 of the C93 review). A trail that cannot spare two keeps
// every crumb and cuts its names instead.

const MIN_FOLD = 2; // How many crumbs room can hide at most: everything but the tail, or nothing
// when that is less than MIN_FOLD.

function maxFitHidden(count, tail = 2) {
  const total = Math.max(0, Math.floor(Number(count) || 0));
  const kept = Math.max(1, Math.floor(Number(tail) || 0));
  const max = total - kept;
  return max >= MIN_FOLD ? max : 0;
} // The crumbs hidden when room hides `hidden` of them.

function fitRange(count, hidden, tail = 2) {
  const total = Math.max(0, Math.floor(Number(count) || 0));
  const kept = Math.max(1, Math.floor(Number(tail) || 0));
  const max = maxFitHidden(total, kept);
  const asked = Math.floor(Number(hidden) || 0);
  const wanted = Math.min(asked > 0 ? Math.max(asked, MIN_FOLD) : 0, max);
  if (wanted <= 0) return null; // While the first crumb can stay, the middle goes from its start.

  if (wanted <= total - 1 - kept) return {
    start: 1,
    end: 1 + wanted
  }; // Then the first one goes too: «… › parent › current».

  return {
    start: 0,
    end: total - kept
  };
} // The range shown: the cap's, until room asks for more than it hides.

function collapseRange(count, {
  maxItems = 0,
  fit = 0,
  tail = 2
} = {}) {
  const cap = capRange(count, maxItems);
  const capped = cap ? cap.end - cap.start : 0;
  const wanted = Math.floor(Number(fit) || 0);
  if (wanted <= capped) return cap;
  return fitRange(count, wanted, tail) || cap;
} // The next number of hidden crumbs to try when the trail does not fit, or
// null when nothing more can go.

function nextFit(count, {
  maxItems = 0,
  fit = 0,
  tail = 2
} = {}) {
  const range = collapseRange(count, {
    maxItems,
    fit,
    tail
  });
  const hidden = range ? range.end - range.start : 0;
  const next = Math.max(hidden + 1, MIN_FOLD);
  return next <= maxFitHidden(count, tail) ? next : null;
} // Whether a crumb's words are cut for want of room. An ancestor is cut at
// its own cap by design (--sf-breadcrumbs--label-max, C93 item 6), whatever
// the room; cut narrower than that cap, or a crumb with no cap cut at all
// (the page on the phone), means the row ran out of room.

function cutByRoom(crumb, view = globalThis) {
  const container = crumb?.querySelector?.(':scope > .sf-breadcrumbs-item-container');
  if (!container) return false;
  const label = container.querySelector(':scope > span') || container;
  if (!(label.scrollWidth > label.clientWidth + 1)) return false;
  const cap = Number.parseFloat(view.getComputedStyle?.(container)?.maxInlineSize);
  if (!(cap > 0)) return true;
  return container.getBoundingClientRect().width < cap - 1;
} // A cut name must still read: a crumb shown narrower than LABEL_MIN_EM of its
// own text size (three letters or so with the ellipsis, the least of a name
// one can tell apart) is no crumb at all (N1 of the nav-4b acceptance, after
// C93 item 6). Folded as far as room goes, such a crumb goes behind «…» too
// (starvedFit).

const LABEL_MIN_EM = 3; // Whether a crumb's words are cut to less than LABEL_MIN_EM for want of room.

function cutBelowMin(crumb, view = globalThis) {
  const container = crumb?.querySelector?.(':scope > .sf-breadcrumbs-item-container');
  if (!container) return false;
  const label = container.querySelector(':scope > span') || container;
  if (!(label.scrollWidth > label.clientWidth + 1)) return false;
  const size = Number.parseFloat(view.getComputedStyle?.(label)?.fontSize);
  const least = LABEL_MIN_EM * (size > 0 ? size : 16);
  return container.getBoundingClientRect().width < least - 0.5;
} // Whether a shown crumb of the trail is cut below the least that reads
// (cutBelowMin). Separators, «…» and the siblings button have no words to cut.

function trailStarved(entries = [], view = globalThis) {
  return entries.some(entry => {
    if (!entry || entry.hidden) return false;
    const crumbs = entry.matches?.('.sf-breadcrumbs-item') ? [entry] : Array.from(entry.querySelectorAll?.(':scope > .sf-breadcrumbs-item') || []);
    return crumbs.some(crumb => !crumb.hidden && !crumb.classList?.contains('sf-breadcrumbs-item--separator') && !crumb.hasAttribute?.('aria-expanded') && cutBelowMin(crumb, view));
  });
} // The last fold: room has hidden all it may (nextFit gave null) and a crumb of
// the tail is still cut below the least that reads. Then the parent goes too
// and the page stands alone after «…»: «… › current». Only a tail of two (the
// parent and the page) gives one up; a trail of parents keeps its parent.
// Returns the options to fold with ({tail, fit}), or null.

function starvedFit(count, {
  tail = 2
} = {}) {
  const kept = Math.max(1, Math.floor(Number(tail) || 0));
  if (kept < 2) return null;
  const hidden = maxFitHidden(count, 1);
  return hidden > 0 ? {
    tail: 1,
    fit: hidden
  } : null;
} // Whether the trail has no room for its crumbs (BC-06, C93 item 1). The row
// never wraps (L2: a line never starts with «›»), so room runs out in one of
// three ways: the row is wider than its box, a crumb is cut for want of room
// (cutByRoom), or a page that wraps the row anyway (its own CSS) put an
// entry below the first. A page name that wraps by words in the rest of the
// row is not a want of room (C93 item 6). Hidden entries take no part.

function trailOverflows(row, entries = [], view = globalThis) {
  if (row && row.scrollWidth > row.clientWidth + 1) return true;
  const shown = entries.filter(entry => {
    if (!entry || entry.hidden) return false;
    const box = entry.getBoundingClientRect?.();
    return Boolean(box) && !(box.width === 0 && box.height === 0);
  });
  if (shown.length === 0) return false;
  const boxes = shown.map(entry => entry.getBoundingClientRect());
  const lowest = Math.min(...boxes.map(box => box.height));
  if (boxes.some(box => box.top - boxes[0].top >= lowest / 2)) return true;
  return shown.some(entry => {
    const crumbs = entry.matches?.('.sf-breadcrumbs-item') ? [entry] : Array.from(entry.querySelectorAll?.(':scope > .sf-breadcrumbs-item') || []);
    return crumbs.some(crumb => !crumb.classList?.contains('sf-breadcrumbs-item--separator') && cutByRoom(crumb, view));
  });
} // The menu entries of crumbs (sf-menu-context entries): hidden crumbs behind
// «…» (C93 item 1) or a crumb's siblings (item 3). The id is the crumb's place
// in the list given, so a choice finds its crumb again.

function menuEntries(crumbs = []) {
  return crumbs.map((crumb, index) => {
    const entry = {
      id: String(index),
      text: String(crumb?.label ?? '')
    };
    if (crumb?.href) entry.href = crumb.href;
    if (crumb?.icon) entry.icon = crumb.icon;
    if (crumb?.value) entry.value = String(crumb.value);
    if (crumb?.disabled) entry.disabled = true;

    if (crumb?.current) {
      entry.current = true;
      entry.checked = true;
    }

    return entry;
  });
}

/***/ },

/***/ "82e4cc4fa9ae"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("9f45ea897c46");
/* harmony import */ var _component_breadcrumbs_js_trail__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("a323dcfdc8c0");
/* harmony import */ var _js_items__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("1f7bf97c23d2");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("22d7cebd40ee");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("73f8db8bd4ae");
/* harmony import */ var _lang_index_mjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("d3e36df62fe9");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_2__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);







 // Only the words on screen ship in the bundle, English only (owner decision
// C282): Russian and every other language come from a language file. The
// title, settings and events stay in the language files for the Studio and the
// docs (localization study LC-2).
// sf-breadcrumbs from its component.json (standard simai.smart-component 1.3.8
// §3, §4, §8, §11): its settings are attributes and properties made by
// core/js/element-manifest.js, its words are lang/<locale>.json (a product adds
// another language through SF.language.register("sf-breadcrumbs", code,
// words)), and the old event name sf-breadcrumb-click is a dated alias of
// sf-breadcrumbs-press.

const BreadcrumbsElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_5__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: _lang_index_mjs__WEBPACK_IMPORTED_MODULE_7__.files,
  source: 'ru',
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_6__
});

class SfBreadcrumbs extends BreadcrumbsElement {
  static itemTemplateSlot = '__items'; // The manifest's settings, and what the trail reads more closely: items from
  // the attribute's own forms or the property.

  static get props() {
    return { ...super.props,
      templateName: {
        attribute: 'template',
        default: 'default'
      },
      items: {
        default: [],

        parser(value, fallback, element) {
          if (value !== undefined && value !== null) return (0,_js_items__WEBPACK_IMPORTED_MODULE_4__.parseItems)(value);
          return (0,_js_items__WEBPACK_IMPORTED_MODULE_4__.parseItems)(element?.__sfManifestData?.items ?? []);
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
        default: 0,
        type: Number
      }
    };
  }

  constructor() {
    super();
    this._itemObserver = null;
    this._readyCaptureHandler = null;
    this._ellipsisExpanded = false;
    this._preserveEllipsisExpanded = false; // How many crumbs room hides (BC-06): 0 until the trail is measured.

    this._fitHidden = 0; // The tail room keeps: null (the parent and the page) until a crumb is
    // cut below a few letters at the narrowest fold (starvedFit), then 1.

    this._fitTail = null;
    this._fitSettled = null;
    this._roomObserver = null;
    this._roomFrame = 0;
  }

  connectedCallback() {
    if (this._isMounted) {
      return;
    } // Its scope (§7.7) opens with every placing, mounted or still waiting
    // for items: disconnectedCallback ends it either way, and a trail placed
    // again before its items came kept the ended one.


    this.sfOpenScope(); // The trail mounts once it has items: a printed JSON island holds them
    // (standard 1.3.8 §5.4), read before it looks for item children.

    this.sfReadIsland();
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
    this.disconnectRoom();
    super.disconnectedCallback();
  }

  get items() {
    return this.getProp('items');
  } // A list setting is a property (§4): the list given here wins until the
  // attribute is written again.


  set items(value) {
    if (!this.__sfManifestData) this.__sfManifestData = {};
    this.__sfManifestData.items = value;
    this._ellipsisExpanded = false;
    this.restartFit();
    if (this.hasAttribute('items')) this.removeAttribute('items');else if (this._isMounted) this.requestComponentUpdate('items');else this.mountComponent();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);

    if (name === 'items' && oldValue !== newValue && !this._preserveEllipsisExpanded) {
      this._ellipsisExpanded = false;
    } // A new trail, cap or page mode is measured again from the full trail.


    if (['items', 'max-items', 'current'].includes(name) && oldValue !== newValue && !this._preserveEllipsisExpanded) {
      this.restartFit();
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
        // current, current="false" or nothing (BC-01).
        current: node.hasAttribute('current') ? (0,_js_items__WEBPACK_IMPORTED_MODULE_4__.readFlag)(node.getAttribute('current') || 'true') : undefined,
        active: node.hasAttribute('active') || undefined,
        disabled: node.hasAttribute('disabled'),
        ellipsis: node.hasAttribute('ellipsis') || label === '...',
        target: node.getAttribute('target') || '',
        rel: node.getAttribute('rel') || '',
        itemClass: node.getAttribute('item-class') || '',
        containerClass: node.getAttribute('container-class') || '',
        ariaLabel: node.getAttribute('aria-label') || '',
        value: node.getAttribute('value') || '',
        hiddenItems: (0,_js_items__WEBPACK_IMPORTED_MODULE_4__.parseItems)(node.getAttribute('hidden-items') || node.getAttribute('items') || '', {
          defaultCurrent: false
        }),
        siblings: node.getAttribute('siblings') || ''
      };
    });
  } // Which crumb is the page: "last" (the default) or "none", a trail of
  // parents. In sf-header-page's path the heading below is the page (owner
  // decision C93 item 4), so there the default is "none".


  get currentMode() {
    const value = String(this.getAttribute('current') || '').trim().toLowerCase();
    if (value === 'none' || value === 'last') return value;

    if (this.getAttribute('slot') === 'path' && this.parentElement?.closest?.('sf-header-page')) {
      return 'none';
    }

    return 'last';
  }

  get sourceItems() {
    const items = this.items;
    const mode = this.currentMode;

    if (items.length) {
      return (0,_js_items__WEBPACK_IMPORTED_MODULE_4__.markCurrent)(items.map((item, index) => (0,_js_items__WEBPACK_IMPORTED_MODULE_4__.normalizeItem)(item, index, items.length)), mode);
    }

    const capturedItems = this.getCapturedItems();

    if (capturedItems.length) {
      return (0,_js_items__WEBPACK_IMPORTED_MODULE_4__.markCurrent)(capturedItems.map((item, index) => (0,_js_items__WEBPACK_IMPORTED_MODULE_4__.normalizeItem)(item, index, capturedItems.length)), mode);
    }

    return [];
  }

  get normalizedItems() {
    const items = this.sourceItems;
    return this.getDisplayItems(items);
  } // The crumbs that fold (component/breadcrumbs/js/_trail.js, shared with
  // the class runtime, BC-11): the max-items cap when the page sets one, and
  // room -- what the last measure hid (BC-06).


  collapseOptions(items = []) {
    const last = items[items.length - 1];
    const tail = this._fitTail || (last?.current ? 2 : 1);
    return {
      maxItems: this.getNumberAttr('maxItems', 0),
      // Room only, on every ladder (C93 item 1; L1 of the C93 review: a trail
      // that fits the phone stays whole).
      fit: this._fitHidden,
      tail
    };
  } // Whether a crumb's siblings are offered (C93 item 3): off unless the host
  // says siblings and the crumb carries them.


  get siblingsShown() {
    return this.getBooleanAttr('siblings', false);
  }

  getDisplayItems(items = []) {
    const expandLabel = this.getAttribute('expand-label') || this.sfWord('expand-label');

    if (this._ellipsisExpanded) {
      return this.reindexItems(items);
    }

    const range = (0,_component_breadcrumbs_js_trail__WEBPACK_IMPORTED_MODULE_3__.collapseRange)(items.length, this.collapseOptions(items));

    if (!range) {
      return this.reindexItems(items);
    }

    const hiddenItems = items.slice(range.start, range.end);
    return this.reindexItems([...items.slice(0, range.start), { ...(0,_js_items__WEBPACK_IMPORTED_MODULE_4__.normalizeItem)({
        label: '…',
        ellipsis: true,
        hiddenItems,
        ariaLabel: expandLabel
      }, range.start, items.length),
      current: false,
      auto: true
    }, ...items.slice(range.end)]);
  }

  reindexItems(items = []) {
    return items.map((item, index) => ({ ...item,
      index
    }));
  } // Room (BC-06, owner decision C93 item 1): after each drawing, while the
  // row has no room for its crumbs, one more crumb goes behind «…». A new
  // width starts again from the full trail. The trail's own change of size
  // (it got shorter) does not count as a new width.


  afterUpdate(changedAttributes, mode) {
    super.afterUpdate?.(changedAttributes, mode);
    this.fitTrail();
  }

  trailRow() {
    return this.querySelector(':scope > nav > ol');
  }

  trailEntries() {
    const list = this.trailRow();
    return list ? Array.from(list.children) : [];
  }

  fitTrail() {
    // Only the element's own drawing is measured, never a printed first paint
    // it has not replaced yet.
    if (!this.isConnected || !this._isMounted || !this._hasRendered) return;
    this.observeRoom(); // Folded as far as it goes, the tail keeps what room is left: cut on the
    // phone, the page's name wrapped on a wider screen.

    if (!this._ellipsisExpanded && (0,_component_breadcrumbs_js_trail__WEBPACK_IMPORTED_MODULE_3__.trailOverflows)(this.trailRow(), this.trailEntries())) {
      const items = this.sourceItems;
      const options = this.collapseOptions(items);
      const next = (0,_component_breadcrumbs_js_trail__WEBPACK_IMPORTED_MODULE_3__.nextFit)(items.length, options);

      if (next !== null) {
        this._fitHidden = next;
        this.requestComponentUpdate('fit');
        return;
      } // Folded as far as that goes, a crumb cut below a few letters takes the
      // parent with it: «… › current» (N1 of the nav-4b acceptance).


      const last = (0,_component_breadcrumbs_js_trail__WEBPACK_IMPORTED_MODULE_3__.trailStarved)(this.trailEntries()) ? (0,_component_breadcrumbs_js_trail__WEBPACK_IMPORTED_MODULE_3__.starvedFit)(items.length, options) : null;

      if (last) {
        this._fitTail = last.tail;
        this._fitHidden = last.fit;
        this.requestComponentUpdate('fit');
        return;
      }
    }

    this.markCutLabels();
    this._fitSettled = this.roomSize();
  } // A new list, setting or width measures the fold again from its start.


  restartFit() {
    this._fitHidden = 0;
    this._fitTail = null;
  } // A name cut with an ellipsis (C93 item 6) has its whole text as the
  // crumb's tooltip; the text itself stays whole for a screen reader.


  markCutLabels() {
    this.querySelectorAll(':scope > nav [data-sf-breadcrumb-index]').forEach(crumb => {
      const label = crumb.querySelector(':scope > .sf-breadcrumbs-item-container > span');
      const cut = Boolean(label && label.scrollWidth > label.clientWidth + 1);
      if (cut) crumb.setAttribute('title', label.textContent.trim());else if (crumb.dataset.sfBreadcrumbCut) crumb.removeAttribute('title');
      if (cut) crumb.dataset.sfBreadcrumbCut = '';else delete crumb.dataset.sfBreadcrumbCut;
    });
  }

  roomSize() {
    const nav = this.querySelector(':scope > nav');
    const parent = this.parentElement;
    return {
      width: parent ? parent.getBoundingClientRect().width : 0,
      height: nav ? nav.getBoundingClientRect().height : 0
    };
  }

  observeRoom() {
    if (typeof ResizeObserver === 'undefined') return;
    const nav = this.querySelector(':scope > nav');
    if (!nav || this._roomObserver && this._roomNav === nav) return;
    this.disconnectRoom();
    this._roomNav = nav;
    this._roomObserver = new ResizeObserver(() => {
      if (this._roomFrame) return;
      this._roomFrame = requestAnimationFrame(() => {
        this._roomFrame = 0;
        const before = this._fitSettled;
        const now = this.roomSize();

        if (!before || Math.abs(before.width - now.width) < 0.5 && Math.abs(before.height - now.height) < 0.5) {
          return;
        }

        this._fitSettled = null;
        this.restartFit();
        this.requestComponentUpdate('fit');
      });
    });

    this._roomObserver.observe(nav);

    if (this.parentElement) this._roomObserver.observe(this.parentElement);
  }

  disconnectRoom() {
    this._roomObserver?.disconnect?.();
    this._roomObserver = null;
    this._roomNav = null;
    if (this._roomFrame) cancelAnimationFrame(this._roomFrame);
    this._roomFrame = 0;
    this._fitSettled = null;
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
      ariaLabel: this.getAttribute('aria-label') || this.sfWord('aria-label'),
      expandLabel: this.getAttribute('expand-label') || this.sfWord('expand-label'),
      siblingsLabel: this.sfWord('siblings-label'),
      siblings: this.siblingsShown,
      expanded: this._ellipsisExpanded,
      component: this,
      items,
      rootClass: this.getRootClass()
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_2__.renderBreadcrumbsTemplate)(this.templateContext());
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
      this.addEventListener(this.sfEventName('press'), event => {
        handler(event.detail?.item, event.detail, event);
      }, options);
    }

    return this;
  } // The «…» button leaves the trail when it opens: focus goes to the first
  // crumb it revealed (R177 BC-02), which takes the button's place.


  focusRevealed(index) {
    this.whenRendered(() => {
      const crumbs = Array.from(this.querySelectorAll(':scope > nav [data-sf-breadcrumb-index]')).filter(node => Number(node.dataset.sfBreadcrumbIndex) >= index);
      const target = crumbs.find(node => node.matches('a[href], button:not([disabled])')) || crumbs[0];
      if (!target) return;

      if (!target.matches('a[href], button:not([disabled])')) {
        target.setAttribute('tabindex', '-1');
      }

      target.focus({
        preventScroll: true
      });
    }, {
      next: true
    });
  }

  expandEllipsis(item) {
    if (!item?.ellipsis) {
      return false;
    }

    const hadFocus = this.contains(document.activeElement) || document.activeElement === document.body; // «…» this trail folded by itself: the full trail comes back.

    if (item.auto || !item.hiddenItems?.length) {
      this._ellipsisExpanded = true;
      if (hadFocus) this.focusRevealed(item.index);
      this.requestComponentUpdate('ellipsis');
      return true;
    }

    if (hadFocus) this.focusRevealed(item.index);
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
          // Each crumb keeps what it says; the page is decided again.
          current: nextItem.currentFlag,
          currentFlag: undefined,
          hiddenItems: undefined
        }))
      });
    } finally {
      this._preserveEllipsisExpanded = false;
    }

    return true;
  } // A press on a crumb (§8): sf-breadcrumbs-press with data only, cancelable;
  // the old name sf-breadcrumb-click follows through the alias table with its
  // old detail and the same cancel.


  handleItemClick = (event, item) => {
    if (item.disabled || item.current) {
      event.preventDefault();
    }

    this._pressOrigin = event;
    let allowed;

    try {
      allowed = this.sfEmit('press', {
        item,
        index: item.index,
        items: this.normalizedItems
      });
    } finally {
      this._pressOrigin = null;
    } // «…» opens its hidden crumbs as a menu beside it (C93 item 1); focus
    // goes into the menu and back to «…» when it closes.


    if (item.ellipsis && this.getBooleanAttr('expandOnEllipsis', true) && allowed) {
      this.openMenu(item.hiddenItems || [], event.currentTarget, {
        label: this.getAttribute('expand-label') || this.sfWord('expand-label'),
        kind: 'hidden'
      });
    }
  }; // The siblings of a crumb, from the button after it (C93 item 3).

  handleSiblingsClick = (event, item) => {
    this.openMenu(item.siblings || [], event.currentTarget, {
      label: `${this.sfWord('siblings-label')}: ${item.label}`,
      kind: 'siblings'
    });
  };

  get menu() {
    return this.querySelector(':scope > .sf-breadcrumbs-menu');
  }

  openMenu(crumbs, anchor, {
    label = '',
    kind = 'hidden'
  } = {}) {
    const menu = this.menu;
    if (!menu || !(anchor instanceof Element) || !crumbs.length) return false;
    this._menuCrumbs = crumbs;
    this._menuKind = kind;
    menu.setAttribute('aria-label', label);
    menu.entries = (0,_component_breadcrumbs_js_trail__WEBPACK_IMPORTED_MODULE_3__.menuEntries)(crumbs); // The Loader brings sf-menu-context with the first trail that needs it.

    customElements.whenDefined('sf-menu-context').then(() => menu.toggleFor(anchor, {
      align: 'start'
    }));
    return true;
  } // A choice in the menu is a press on that crumb (§8): a link goes by itself,
  // a crumb with a value is the page's to handle; refusing the press keeps the
  // menu open.


  handleMenuSelect = event => {
    event.stopPropagation();
    const crumb = this._menuCrumbs?.[Number(event.detail?.id)];
    if (!crumb) return;
    const allowed = this.sfEmit('press', {
      item: { ...crumb,
        sibling: this._menuKind === 'siblings'
      },
      index: Number.isFinite(crumb.index) ? crumb.index : Number(event.detail.id),
      items: this.normalizedItems
    });
    if (!allowed) event.preventDefault();
  }; // The old name keeps its old detail (§16.20 split row): the element, its
  // template and the browser's event were in it.

  sfAliasAdapters() {
    return {
      'sf-breadcrumb-click': detail => ({
        component: this,
        tagName: this.componentTagName,
        template: this.componentTemplateName,
        ...detail,
        originalEvent: this._pressOrigin ?? null
      })
    };
  }

}

SfBreadcrumbs.define('sf-breadcrumbs');
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "1f7bf97c23d2"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   markCurrent: () => (/* binding */ markCurrent),
/* harmony export */   normalizeItem: () => (/* binding */ normalizeItem),
/* harmony export */   parseItemFlags: () => (/* binding */ parseItemFlags),
/* harmony export */   parseItems: () => (/* binding */ parseItems),
/* harmony export */   readFlag: () => (/* binding */ readFlag)
/* harmony export */ });
// The items of sf-breadcrumbs: read from the attribute's JSON or
// "label::flag,key=value|label" form, from the property, or from the
// sf-breadcrumbs-item children, and the page of the trail decided over the
// whole list (R177 BC-01). No DOM and no import: the unit tests read it in
// node, the element imports it into its bundle.
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
  } // Which crumb is the page is decided over the whole trail (markCurrent):
  // here only what the item itself says -- true, false, or nothing.


  const label = item.label || item.text || item.title || ''; // An item read once already carries its flag: reading it again keeps it
  // (its current is only the flag's true).

  const currentFlag = Object.prototype.hasOwnProperty.call(item, 'currentFlag') ? item.currentFlag : readFlag(item.current) ?? (item.active ? true : undefined);
  const current = currentFlag === true;
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
    currentFlag,
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
    // The crumb's siblings (C93 item 3): shown when the host says siblings.
    siblings: item.siblings ? parseItems(item.siblings) : [],
    index
  };
} // true, false or undefined (not said) from a JSON value, a flag or an attribute.

function readFlag(value) {
  if (value === undefined || value === null) return undefined;
  if (typeof value === 'boolean') return value;
  const text = String(value).trim().toLowerCase();
  return !['0', 'false', 'no', 'off'].includes(text);
} // The page of the trail (R177 BC-01). With current="none" -- a trail of
// parents above the page's heading (owner decision C93 item 4) -- no crumb is
// the page and every crumb with an address is a link. Otherwise a crumb that
// says current is the page (the last one that says it), and when none says
// it the last crumb is, unless it says current: false.

function markCurrent(items = [], mode = 'last') {
  let page = -1;

  if (mode !== 'none') {
    items.forEach((item, index) => {
      if (item.currentFlag === true) page = index;
    });

    if (page < 0 && items.length && items[items.length - 1].currentFlag !== false) {
      page = items.length - 1;
    }
  }

  return items.map((item, index) => {
    const current = index === page && !item.ellipsis;
    return { ...item,
      current,
      active: Boolean(current || mode !== 'none' && item.active && item.currentFlag !== false)
    };
  });
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

/***/ },

/***/ "9f45ea897c46"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderBreadcrumbsTemplate: () => (/* binding */ renderBreadcrumbsTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
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
} // A crumb is a link when it has an address, a button when the page handles it
// (a value, as a folder picker's crumbs that drive its window, or «…»), and
// text otherwise (R177 BC-05): a crumb without either was a focusable button
// that did nothing.


function crumbTag(item) {
  if (item.current || item.disabled) return 'div';
  if (item.href) return 'a';
  if (item.ellipsis || item.value) return 'button';
  return 'div';
}

function renderItem(item, context) {
  const tag = crumbTag(item);
  const itemClasses = joinClasses('sf-breadcrumbs-item', item.current || tag === 'div' && !item.disabled ? '' : 'sf-breadcrumbs-item--link', tag === 'div' || item.ellipsis ? 'sf-breadcrumbs-item--default' : '', item.active ? 'active' : '', item.disabled ? 'disabled' : '', context.itemClass, item.current ? context.currentClass : context.linkClass, item.itemClass);
  const containerClasses = joinClasses('sf-breadcrumbs-item-container', context.containerClass, item.containerClass);
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
        aria-haspopup=${item.ellipsis ? 'menu' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        aria-expanded=${item.ellipsis ? 'false' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        data-sf-breadcrumb-index=${common.dataIndex}
        @click=${event => context.component?.handleItemClick?.(event, item)}
      >
        ${content}
      </button>
    `;
  } // A disabled item is plain text that says so (docs precheck BC-01): it was
  // a div without aria-disabled, drawn in the link colour.


  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div
      class=${common.className}
      aria-current=${common.ariaCurrent}
      aria-disabled=${item.disabled ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      aria-label=${common.ariaLabel}
      data-sf-breadcrumb-index=${common.dataIndex}
      @click=${event => context.component?.handleItemClick?.(event, item)}
    >
      ${content}
    </div>
  `;
} // The siblings of a crumb (owner decision C93 item 3, off unless the host
// says siblings): a button after the crumb opens them as a menu.


function renderSiblings(item, context) {
  if (!context.siblings || item.ellipsis || !item.siblings?.length) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <button
      type="button"
      class="sf-breadcrumbs-item sf-breadcrumbs-item--link sf-breadcrumbs-item--default"
      aria-haspopup="menu"
      aria-expanded="false"
      aria-label=${`${context.siblingsLabel}: ${item.label}`}
      data-sf-breadcrumb-siblings=${String(item.index)}
      @click=${event => context.component?.handleSiblingsClick?.(event, item)}
    >
      <span class="sf-breadcrumbs-item-container">${renderIcon('expand_more')}</span>
    </button>
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
      <span class="sf-breadcrumbs-item-container">
        ${slotContent !== lit__WEBPACK_IMPORTED_MODULE_0__.nothing ? slotContent : renderIcon(context.separatorIcon)}
      </span>
    </div>
  `;
} // The trail is a list (R177 BC-09): a reader says «list, N items» as it does
// for Fluent, USWDS, GOV.UK and Carbon. One entry per crumb, its separator
// before it. The sheet draws the row itself, with no utility class (BC-07).
// The name is the host's aria-label or the language file's word (BC-10: no
// English literal of its own). The row never wraps; a trail opened in place
// (every crumb asked for) is marked expanded and may.


function renderBreadcrumbsTemplate(context) {
  const rootClasses = joinClasses('sf-breadcrumbs', context.rootClass);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <nav
      class=${rootClasses}
      style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      aria-label=${context.ariaLabel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      data-sf-breadcrumbs-expanded=${context.expanded ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    >
      <ol>
        ${context.items.map((item, index) => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
          <li>
            ${index > 0 ? renderSeparator(context, index - 1) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ${renderItem(item, context)}
            ${renderSiblings(item, context)}
          </li>
        `)}
      </ol>
    </nav>
    ${context.items.some(item => item.ellipsis) || context.siblings && context.items.some(item => item.siblings?.length) ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-menu-context
          class="sf-breadcrumbs-menu"
          popup
          @sf-menu-context-select=${event => context.component?.handleMenuSelect?.(event)}
        ></sf-menu-context>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
  `;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "5b7d7695b41b"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("element-manifest", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("element-manifest", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "2a080a730149"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("lit", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "deb1a4d61565"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("smart-base", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("smart-base", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "d3e36df62fe9"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   files: () => (/* binding */ files)
/* harmony export */ });
/* harmony import */ var _en_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("dce1dcba5093");
// Written by scripts/build-language-packs.mjs from src/core/lang/built-in.json
// (owner decision C282); do not edit. The words this bundle carries: the
// built-in languages' (en); every other language comes from
// a language file (core/lang/<code>.js or its parts).


const files = { en: { runtime: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime } };

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ en: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime });


/***/ },

/***/ "73f8db8bd4ae"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-breadcrumbs for the shim (core/js/aliases.js, standard §16 item 20). mode: same-detail (the shim sends the new and the old name), split (the old detail from the element\'s adapter), host-attribute (no shim).","component":"sf-breadcrumbs","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"aria-label","to":null,"kind":"attribute","component":"sf-breadcrumbs","since":"2026-10-27","remove_after":"2026-12-01","mode":"host-attribute","section":"§3.1, §4.8","note":"stays a host attribute, read for the accessible name; no shim"},{"from":"sf-breadcrumb-click","to":"sf-breadcrumbs-press","kind":"event","component":"sf-breadcrumbs","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":true,"section":"§3.1 (click), §8","note":"the old detail adds component, tagName, template and originalEvent, which §8 takes out of the new one: the element\'s detail adapter makes it"}]}');

/***/ },

/***/ "22d7cebd40ee"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.breadcrumbs","tag":"sf-breadcrumbs","version":"1.2.10","kind":"leaf","settings":{"items":{"type":"list","default":[],"of":{"label":"string","href":{"type":"string","optional":true},"icon":{"type":"icon","optional":true},"current":{"type":"boolean","optional":true},"disabled":{"type":"boolean","optional":true},"ellipsis":{"type":"boolean","optional":true},"target":{"type":"string","optional":true},"rel":{"type":"string","optional":true},"value":{"type":"string","optional":true},"aria-label":{"type":"string","optional":true},"item-class":{"type":"string","optional":true},"container-class":{"type":"string","optional":true},"hidden-items":{"type":"list","optional":true},"siblings":{"type":"list","optional":true}}},"current":{"type":"enum","values":["last","none"],"default":"last"},"siblings":{"type":"boolean","default":false},"separator-icon":{"type":"icon","default":"chevron_right"},"home-icon":{"type":"icon","default":"home"},"home-label":{"type":"string","default":""},"item-class":{"type":"string","default":""},"link-class":{"type":"string","default":""},"current-class":{"type":"string","default":""},"separator-class":{"type":"string","default":""},"container-class":{"type":"string","default":""},"expand-label":{"type":"string","default-from":"runtime.expand-label"},"expand-on-ellipsis":{"type":"boolean","default":true},"max-items":{"type":"number","integer":true,"min":0,"default":0}},"values":{},"events":{"press":{"carries":{"item":"object","index":"number","items":"list"},"cancelable":true}},"actions":{},"css-variables":{"--sf-breadcrumbs-gap":{"type":"length","state":"default"},"--sf-breadcrumbs-color":{"type":"color","state":"default"},"--sf-breadcrumbs-link-color":{"type":"color","state":"default"},"--sf-breadcrumbs-link-hover-color":{"type":"color","state":"hover"},"--sf-breadcrumbs-current-color":{"type":"color","state":"current"},"--sf-breadcrumbs-separator-color":{"type":"color","state":"default"}}}');

/***/ },

/***/ "dce1dcba5093"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Breadcrumbs","runtime":{"aria-label":"Breadcrumb","expand-label":"Show hidden breadcrumbs","siblings-label":"Sibling sections"}}');

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