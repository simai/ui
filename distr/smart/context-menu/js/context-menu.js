/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "765b8f3f8ccb"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _core_js_position_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("116963e5e31b");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("1197ac823db7");
/* harmony import */ var _core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("bf0cea966575");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("e2f5b0e3495d");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("15bdf574d949");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("bfc52fd90c79");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("ef70d4c8e73e");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_position_js__WEBPACK_IMPORTED_MODULE_2__, _js_templates_default__WEBPACK_IMPORTED_MODULE_3__, _core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_4__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_position_js__WEBPACK_IMPORTED_MODULE_2__, _js_templates_default__WEBPACK_IMPORTED_MODULE_3__, _core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_4__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_position_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_core_js_position_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_4__);








 // sf-context-menu from its component.json (standard simai.smart-component 1.3.8
// §3, §4, §8, §19): its settings are attributes and properties made by
// core/js/element-manifest.js, its words are lang/<locale>.json, and its events
// go out by their verbs through sfEmit. aria-label and role stay the host's.

const ContextMenuElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_5__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_7__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_8__
  },
  source: "ru",
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_6__
}); // Prefer the helper Core published; a bundle loaded without core.js still
// positions with its own copy.

const position = () => globalThis.SF?.Position || (_core_js_position_js__WEBPACK_IMPORTED_MODULE_2___default());

const TYPEAHEAD_MS = 500;
const POSITION_ALIASES = {
  start: "inline-start",
  end: "inline-end",
  "top-start": "top-inline-start",
  "top-end": "top-inline-end",
  "bottom-start": "bottom-inline-start",
  "bottom-end": "bottom-inline-end",
  "left-start": "left-top",
  "left-end": "left-bottom",
  "right-start": "right-top",
  "right-end": "right-bottom",
  "inline-start-start": "inline-start-top",
  "inline-start-end": "inline-start-bottom",
  "inline-end-start": "inline-end-top",
  "inline-end-end": "inline-end-bottom"
};

function normalizePosition(value = "") {
  const normalized = String(value || "").trim().toLowerCase();
  return POSITION_ALIASES[normalized] || normalized;
}

class SfContextMenu extends ContextMenuElement {
  constructor() {
    super();
    this._itemAttributes = new Map();
    this._currentItem = null;
    this._itemObserver = new MutationObserver(() => this.syncMenuItems());
    this.addEventListener("keydown", this.handleMenuKeyDown);
    this.addEventListener("keydown", this.handleOwnedKeyDown);
    this.addEventListener("click", this.handleEntryClick);
    this.addEventListener("pointerover", this.handleEntryHover);
    this._owned = null;
    this._typeahead = {
      text: "",
      at: 0
    };

    if (Object.prototype.hasOwnProperty.call(this, "search")) {
      const early = this.search;
      delete this.search;
      this._search = early && typeof early === "object" ? early : null;
    }

    if (Object.prototype.hasOwnProperty.call(this, "entries")) {
      const early = this.entries;
      delete this.entries;
      this._entries = Array.isArray(early) ? early : null;
    }

    this._onOutsidePress = event => {
      const path = event.composedPath();
      if (path.includes(this) || path.includes(this._owned?.anchor)) return; // A press inside an open submenu is inside the menu.

      if (this._submenu && path.includes(this._submenu)) return;
      this.close({
        restoreFocus: false,
        reason: "outside"
      });
    };

    this.addEventListener("focusin", event => {
      if (this.menuItems().includes(event.target)) {
        this._currentItem = event.target;
        this.syncMenuItems();
      }
    });
    this.addEventListener("sf-after-render", event => {
      if (event.target !== this && event.target.closest("sf-context-menu") === this) {
        this.syncMenuItems();
      }
    });
  }

  afterRender(callback) {
    if (typeof callback === "function") return super.afterRender(callback);

    this._itemObserver.disconnect();

    this.syncMenuItems();
    const content = this.querySelector(".sf-context-menu-content");
    if (content) this._itemObserver.observe(content, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["disabled", "aria-disabled", "hidden", "inert"]
    });
  }

  disconnectedCallback() {
    // Taken out of the page, it closes without asking: nothing is left to keep.
    if (this._owned) this.close({
      restoreFocus: false,
      ask: false
    });

    this._itemObserver.disconnect();

    for (const item of this._itemAttributes.keys()) this.releaseItem(item);

    this._currentItem = null;
    super.disconnectedCallback();
  }

  menuItems() {
    if (this.templateName !== "default" || this.menuRole !== "menu") return [];
    const content = this.querySelector(".sf-context-menu-content"); // Rendered from entries, every row is an item and carries its own role
    // (menuitem, menuitemcheckbox or menuitemradio).

    if (this.entries.length) return Array.from(content?.querySelectorAll(".sf-context-menu-item") || []);
    return Array.from(content?.children || []).flatMap(child => {
      const item = child.localName === "sf-button" ? child.querySelector("button, a[href]") : child;
      if (!item?.matches("button, a[href]")) return [];
      const role = item.getAttribute("role");
      return !role || role === "menuitem" ? [item] : [];
    });
  }

  availableMenuItems() {
    return this.menuItems().filter(item => !item.matches(":disabled") && !item.closest('[hidden], [inert], [aria-disabled="true"], sf-button[disabled]') && item.getClientRects().length > 0 && getComputedStyle(item).visibility !== "hidden");
  }

  ownItemAttribute(item, name, value) {
    let attributes = this._itemAttributes.get(item);

    if (!attributes) this._itemAttributes.set(item, attributes = new Map());
    let lease = attributes.get(name);

    if (!lease) {
      lease = {
        original: item.getAttribute(name),
        value: item.getAttribute(name),
        released: false
      };
      attributes.set(name, lease);
    } // A later application override is not ours to erase on cleanup or rerender.


    if (lease.released || item.getAttribute(name) !== lease.value) {
      lease.released = true;
      return;
    }

    if (lease.value !== value) item.setAttribute(name, value);
    lease.value = value;
  }

  releaseItem(item) {
    for (const [name, lease] of this._itemAttributes.get(item) || []) {
      if (lease.released || item.getAttribute(name) !== lease.value) continue;
      if (lease.original === null) item.removeAttribute(name);else item.setAttribute(name, lease.original);
    }

    this._itemAttributes.delete(item);
  }

  syncMenuItems() {
    const items = this.menuItems(),
          available = this.availableMenuItems();

    for (const item of this._itemAttributes.keys()) if (!items.includes(item)) this.releaseItem(item);

    if (!available.includes(this._currentItem)) this._currentItem = available[0] || null;

    for (const item of items) {
      if (!item.classList.contains("sf-context-menu-item")) this.ownItemAttribute(item, "role", "menuitem");
      this.ownItemAttribute(item, "tabindex", item === this._currentItem ? "0" : "-1");
    }
  }

  focus(options) {
    this.syncMenuItems();
    this._currentItem?.focus(options);
  } // ─── entries ─────────────────────────────────────────────────────────────
  // Entries are data, set as a property (`.entries=${…}` in a template) or as
  // JSON in the attribute. Set before the element was defined, the value sat
  // on the instance and is taken over in the constructor.


  get entries() {
    if (Array.isArray(this._entries)) return this._entries;
    if (!this.hasAttribute("entries")) return [];

    try {
      const parsed = JSON.parse(this.getAttribute("entries"));
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  set entries(value) {
    this._entries = Array.isArray(value) ? value : null;
    this.requestComponentUpdate("entries");
  }

  entryOf(element) {
    const row = element?.closest?.(".sf-context-menu-item");
    if (!row || !this.contains(row)) return null;
    return this.entries[Number(row.dataset.sfEntry)] ?? null;
  } // A search over the entries: a submenu given `search` (or a menu given the
  // property) draws a field above its rows and narrows them as one types.


  get search() {
    return this._search && typeof this._search === "object" ? this._search : null;
  }

  set search(value) {
    this._search = value && typeof value === "object" ? value : null;
    this.requestComponentUpdate("search");
  }

  get query() {
    return this._query ?? "";
  }

  setQuery(value) {
    this._query = String(value ?? "");
    this.requestComponentUpdate("query"); // A search the host answers: it is told the query and sets the entries.

    if (this.search?.remote) this.sfEmit("search", {
      query: this._query
    });
  }

  searchField() {
    return this.querySelector(".sf-context-menu-search-input");
  } // One option of a choice row: the menu marks it at once, so the row shows
  // the choice while the host applies it, and stays open -- a theme is tried,
  // not committed.


  chooseOption(row, entry) {
    const at = Number(row.dataset.sfOption);
    const option = entry.options?.[at];
    if (!option || option.disabled) return;
    const selected = this.sfEmit("select", {
      id: option.id ?? null,
      entry: option,
      checked: true,
      group: entry.id ?? null
    }, {
      cancelable: true
    });
    if (!selected) return;
    const index = this.entries.indexOf(entry);
    const next = { ...entry,
      options: entry.options.map((item, i) => ({ ...item,
        checked: i === at
      }))
    };
    this.entries = this.entries.map((item, i) => i === index ? next : item);
    if (entry.keepOpen === false) this.closeAll();
  }

  handleEntryClick(event) {
    const row = event.target?.closest?.(".sf-context-menu-item");
    if (!row || !this.contains(row) || row.matches(":disabled")) return;
    const entry = this.entryOf(row);
    if (!entry) return;

    if (row.dataset.sfOption !== undefined) {
      this.chooseOption(row, entry);
      return;
    }

    if (Array.isArray(entry.submenu) && entry.submenu.length) {
      event.preventDefault(); // A pointer leaves the focus where it is, unless the submenu is a search:
      // whoever opened a list to find something is about to type.

      this.openSubmenu(row, entry, {
        focus: event.detail === 0 || entry.search ? "first" : "none"
      });
      return;
    }

    const checkable = entry.kind === "check" || entry.kind === "radio";
    const detail = {
      id: entry.id ?? null,
      entry,
      checked: checkable ? entry.kind === "radio" ? true : !entry.checked : null
    };
    const selected = this.sfEmit("select", detail, {
      cancelable: true
    }); // A choice ends the menu, unless the host cancelled the event to keep it
    // (a check list ticked several times) or the entry asked to stay.

    if (selected && !entry.keepOpen) this.closeAll({
      restoreFocus: !entry.href
    });
  } // A pointer resting on a row with a submenu opens it; resting on another
  // row of this menu closes the one that was open.


  handleEntryHover(event) {
    if (!this._owned || event.pointerType === "touch") return;
    const row = event.target?.closest?.(".sf-context-menu-item");
    if (!row || !this.contains(row) || row === this._hoverRow) return;
    this._hoverRow = row;
    clearTimeout(this._hoverTimer);
    this._hoverTimer = setTimeout(() => {
      if (this._hoverRow !== row || !this._owned) return;
      const entry = this.entryOf(row);

      if (entry && Array.isArray(entry.submenu) && entry.submenu.length && !row.matches(":disabled")) {
        this.openSubmenu(row, entry, {
          focus: "none"
        });
      } else {
        this.closeSubmenu({
          restoreFocus: false
        });
      }
    }, 120);
  } // ─── opening (the menu owns its lifecycle when opened through openFor) ────


  toggleFor(anchor, options = {}) {
    if (this._owned?.anchor === anchor) {
      this.close();
      return Promise.resolve(false);
    }

    return this.openFor(anchor, options);
  }

  get isOpen() {
    return Boolean(this._owned);
  }

  surface() {
    return this.querySelector(":scope > .sf-context-menu");
  } // width: "content" (the default) lets the menu be as wide as its longest
  // line; "trigger" makes it exactly as wide as the control that opened it --
  // a site switcher, a profile button (owner, 2026-10-14) -- a long line ending
  // in an ellipsis; a CSS length fixes it. The attribute gives the default.


  async openFor(anchor, {
    side = "block-end",
    align = "start",
    focus = "first",
    parentMenu = null,
    alignmentOffset = 0,
    width = this.width
  } = {}) {
    if (!(anchor instanceof Element)) throw new TypeError("A menu opens for an element");
    if (this._owned) this.close({
      restoreFocus: false,
      ask: false
    }); // The request first (§19, vocabulary §4): a listener that prevents it keeps
    // the menu closed.

    if (!this.sfEmit("open", {}, {
      cancelable: true
    })) return false;
    await this.whenRendered();
    const surface = this.surface();
    if (!surface) return false; // Focus goes back where it was, or to the control that opened the menu
    // when it was nowhere -- a press on an sf-button leaves it on the body in
    // some browsers, and the menu returned it there. A host element is not
    // itself focusable; its native control is.

    const focusable = element => element?.matches?.("button, a[href], input, select, textarea, [tabindex]") ? element : element?.querySelector?.("button, a[href], input, select, textarea, [tabindex]") ?? element;

    const active = document.activeElement;
    this._owned = {
      anchor,
      parentMenu,
      returnTo: active instanceof HTMLElement && active !== document.body && active !== document.documentElement ? active : focusable(anchor),
      expanded: anchor.getAttribute("aria-expanded"),
      haspopup: anchor.getAttribute("aria-haspopup")
    };
    anchor.setAttribute("aria-haspopup", "menu");
    anchor.setAttribute("aria-expanded", "true"); // The top layer, where the platform has it: above every stacking context
    // and every clipping box, so a menu in a scrolled card is never cut and
    // never under the table it belongs to.

    surface.classList.add("sf-context-menu--open");

    if (typeof surface.showPopover === "function") {
      surface.setAttribute("popover", "manual");
      if (!surface.matches(":popover-open")) surface.showPopover();
    } else {
      surface.style.zIndex = "var(--sf-z-index-9)";
    }

    const content = this.querySelector(".sf-context-menu-content");
    const sized = width && width !== "content";

    if (sized && content) {
      const length = width === "trigger" ? `${anchor.getBoundingClientRect().width}px` : width;
      content.style.setProperty("--sf-context-menu--min-inline-size", length);
      content.style.setProperty("--sf-context-menu--max-inline-size", length);
      content.style.setProperty("inline-size", length);
      this._owned.sizedContent = content;
    }

    this._owned.position = position().anchor(anchor, surface, {
      side,
      align,
      alignmentOffset,
      flip: true,
      shift: true,
      fitHeight: true,
      matchWidth: width === "trigger"
    });
    document.addEventListener("pointerdown", this._onOutsidePress, true); // A menu it opens owns Escape, so the root says a surface is open: a record
    // panel listening on the document in capture runs before the menu's own
    // listener and would otherwise close with it.

    (0,_core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_4__.holdOpenSurfaceMark)(this, true);
    this.sfEmit("opened", {});

    if (focus !== "none") {
      this.syncMenuItems();
      const items = this.availableMenuItems();
      const field = this.searchField();
      if (field && focus !== "last") field.focus({
        preventScroll: true
      });else (focus === "last" ? items[items.length - 1] : items[0])?.focus({
        preventScroll: true
      });
    }

    return true;
  } // reason says why (standard 1.3.8 §19.3): escape, outside, close (the head's
  // close button) or api (a choice, Tab, a script). A listener that prevents
  // sf-context-menu-close keeps the menu open; `ask: false` closes without
  // asking (the menu is leaving the page, or reopening).


  close({
    restoreFocus = true,
    reason = "api",
    ask = true
  } = {}) {
    const owned = this._owned;
    if (!owned) return false;
    if (ask && !this.sfEmit("close", {
      reason,
      unsaved: false
    }, {
      cancelable: true
    })) return false;
    this.closeSubmenu({
      restoreFocus: false
    });
    this._owned = null;
    this._hoverRow = null; // Cleared for the next opening, without telling a host-searched list:
    // closing is not a search.

    if (this._query) {
      this._query = "";
      this.requestComponentUpdate("query");
    }

    clearTimeout(this._hoverTimer);
    owned.position?.stop();

    for (const name of ["--sf-context-menu--min-inline-size", "--sf-context-menu--max-inline-size", "inline-size"]) {
      owned.sizedContent?.style.removeProperty(name);
    }

    document.removeEventListener("pointerdown", this._onOutsidePress, true);
    (0,_core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_4__.holdOpenSurfaceMark)(this, false);
    const surface = this.surface();

    if (surface) {
      if (surface.matches?.(":popover-open")) surface.hidePopover();
      surface.removeAttribute("popover");
      surface.classList.remove("sf-context-menu--open");
      surface.style.removeProperty("z-index");
    }

    const {
      anchor
    } = owned;
    if (owned.haspopup === null) anchor.removeAttribute("aria-haspopup");else anchor.setAttribute("aria-haspopup", owned.haspopup);
    if (owned.expanded === null) anchor.setAttribute("aria-expanded", "false");else anchor.setAttribute("aria-expanded", owned.expanded);
    if (restoreFocus) (owned.returnTo?.isConnected ? owned.returnTo : anchor)?.focus?.({
      preventScroll: true
    });
    this.sfEmit("closed", {
      reason
    });
    return true;
  } // A choice in a submenu closes the whole chain and returns focus to where
  // the first menu was opened from.


  closeAll({
    restoreFocus = true,
    reason = "api"
  } = {}) {
    let root = this;

    while (root._owned?.parentMenu) root = root._owned.parentMenu;

    if (root === this) return this.close({
      restoreFocus,
      reason
    });
    return root.close({
      restoreFocus,
      reason
    });
  }

  async openSubmenu(row, entry, {
    focus = "first"
  } = {}) {
    if (this._submenu?._owned?.anchor === row) {
      if (focus !== "none") this._submenu.focus();
      return this._submenu;
    }

    this.closeSubmenu({
      restoreFocus: false
    });
    const child = document.createElement("sf-context-menu");
    child.setAttribute("aria-label", entry.text ?? "");
    child.setAttribute("popup", ""); // A submenu is the size of the menu it opens from.

    if (this.size === "1") child.setAttribute("size", "1");
    child.entries = entry.submenu;
    if (entry.search) child.search = entry.search; // Selections in the submenu are the parent's to announce: a host listens
    // on one element whatever depth the item sits at.

    child.addEventListener("sf-context-menu-select", event => {
      event.stopPropagation();
      const forwarded = this.sfEmit("select", event.detail, {
        cancelable: true
      });
      if (!forwarded) event.preventDefault();
    });
    child.addEventListener("sf-context-menu-closed", () => {
      if (this._submenu === child) {
        this._submenu = null;
        child.remove();
      }
    });
    (this.closest("dialog[open]") || document.body).append(child);
    this._submenu = child; // The submenu's first row stands level with the row that opened it: the
    // panel moves up by its own padding and border, which this menu shares.

    const content = this.querySelector(".sf-context-menu-content");
    const style = content ? getComputedStyle(content) : null;
    const inset = style ? (parseFloat(style.paddingTop) || 0) + (parseFloat(style.borderTopWidth) || 0) : 0;
    await child.openFor(row, {
      side: "inline-end",
      align: "start",
      focus,
      parentMenu: this,
      alignmentOffset: -inset
    });
    return child;
  }

  closeSubmenu({
    restoreFocus = true
  } = {}) {
    const child = this._submenu;
    if (!child) return false;
    this._submenu = null;
    child.close({
      restoreFocus,
      ask: false
    });
    child.remove();
    return true;
  } // Escape, Tab, typeahead and the submenu keys belong to a menu that owns its
  // lifecycle. A host that renders the menu itself keeps them, as before.


  handleOwnedKeyDown(event) {
    if (!this._owned || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
    if (!this.contains(event.target)) return;
    const rtl = getComputedStyle(this.surface() ?? document.documentElement).direction === "rtl";
    const inward = rtl ? "ArrowLeft" : "ArrowRight",
          outward = rtl ? "ArrowRight" : "ArrowLeft"; // Inside a choice row the side arrows move between its options.

    const option = event.target?.closest?.(".sf-context-menu-choice-option");

    if (option && (event.key === inward || event.key === outward)) {
      const options = Array.from(option.parentElement.querySelectorAll(".sf-context-menu-choice-option:not(:disabled)"));
      const at = options.indexOf(option);
      const next = options[(at + (event.key === inward ? 1 : options.length - 1)) % options.length];
      event.preventDefault();
      next?.focus();
      return;
    } // In the search field the letters and the side arrows are the field's;
    // ArrowDown goes on to the rows, and Escape still closes.


    if (event.target === this.searchField() && event.key !== "Escape" && event.key !== "Tab") {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        this.syncMenuItems();
        this.availableMenuItems()[0]?.focus();
      }

      return;
    }

    if (event.key === "Escape" || event.key === outward && this._owned.parentMenu) {
      event.preventDefault();
      event.stopPropagation();
      this.close({
        reason: event.key === "Escape" ? "escape" : "api"
      });
      return;
    }

    if (event.key === "Tab") {
      // Tab leaves the menu for the page; the menu does not trap it.
      this.closeAll({
        restoreFocus: true
      });
      return;
    }

    const entry = this.entryOf(event.target);

    if (event.key === inward && entry && Array.isArray(entry.submenu) && entry.submenu.length) {
      event.preventDefault();
      this.openSubmenu(event.target.closest(".sf-context-menu-item"), entry, {
        focus: "first"
      });
      return;
    }

    if (event.key.length === 1 && event.key !== " ") this.typeahead(event);
  }

  typeahead(event) {
    const now = Date.now();
    this._typeahead.text = (now - this._typeahead.at > TYPEAHEAD_MS ? "" : this._typeahead.text) + event.key.toLowerCase();
    this._typeahead.at = now;
    const items = this.availableMenuItems();
    const from = Math.max(0, items.indexOf(event.target));
    const ordered = [...items.slice(from + (this._typeahead.text.length === 1 ? 1 : 0)), ...items.slice(0, from + 1)];
    const found = ordered.find(item => (item.querySelector(".sf-context-menu-item-label")?.textContent ?? item.textContent).trim().toLowerCase().startsWith(this._typeahead.text));
    if (!found) return;
    event.preventDefault();
    found.focus();
  }

  handleMenuKeyDown(event) {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const items = this.availableMenuItems(),
          index = items.indexOf(event.target);
    if (index < 0) return;
    let next;

    switch (event.key) {
      case "ArrowDown":
        next = (index + 1) % items.length;
        break;

      case "ArrowUp":
        next = (index + items.length - 1) % items.length;
        break;

      case "Home":
        next = 0;
        break;

      case "End":
        next = items.length - 1;
        break;

      default:
        return;
      // Native activation and host-owned Tab/Escape remain intact.
    }

    event.preventDefault();
    event.stopPropagation();
    items[next].focus();
  } // The manifest's settings, and what the menu reads more closely (its
  // position's old words, the lists set as properties, the host's role).


  static get props() {
    return { ...super.props,
      templateName: {
        attribute: "template",
        default: "default"
      },
      position: {
        default: ""
      },
      tooltip: {
        type: Boolean,
        default: true
      },
      text: {
        default: ""
      },
      items: {
        type: Array,
        default: []
      },
      entries: {
        type: Array,
        default: []
      },
      popup: {
        type: Boolean,
        default: false
      },
      role: {
        default: "menu"
      },
      contentClass: {
        default: ""
      },
      rootClass: {
        default: ""
      },
      // The menu's size: "1/2" (32px rows, the default) or "1" (40px rows).
      size: {
        default: "1/2"
      },
      // How wide the menu opens: "content" (its longest line, the default),
      // "trigger" (exactly the control that opened it) or a CSS length.
      width: {
        default: "content"
      },
      // A panel with tabs (owner, 2026-10-15): the tabs and the way out on a
      // head that never scrolls, the rows of the chosen tab in a body that
      // does, the actions in a footer that stays. "A|B" or [{id, label}].
      tabs: {
        default: ""
      },
      // The chosen tab's id (or index); the host shows that tab's rows.
      activeTab: {
        attribute: "active-tab",
        default: ""
      },
      // A close button at the end of the head.
      closable: {
        type: Boolean,
        default: false
      }
    };
  } // The tabs as [{id, label}]: a string list names each tab by its label.


  get tabs() {
    const raw = Array.isArray(this._tabs) ? this._tabs : this.getAttribute("tabs") || "";
    const list = Array.isArray(raw) ? raw : String(raw).split("|").map(label => label.trim()).filter(Boolean);
    return list.map((tab, index) => typeof tab === "string" ? {
      id: tab,
      label: tab,
      index
    } : {
      id: String(tab.id ?? index),
      label: String(tab.label ?? tab.id ?? index),
      index
    });
  }

  set tabs(value) {
    if (Array.isArray(value)) {
      this._tabs = value;
      this.requestComponentUpdate("tabs");
      return;
    }

    this._tabs = null;
    this.setState({
      tabs: value ? String(value) : ""
    });
  }

  get activeTab() {
    const tabs = this.tabs;
    const asked = this.getAttribute("active-tab") ?? "";
    return tabs.find(tab => tab.id === asked) ?? tabs[Number(asked)] ?? tabs[0] ?? null;
  }

  get closable() {
    return this.getBooleanAttr("closable", false);
  }

  get panel() {
    return this.tabs.length > 0;
  } // A tab chosen: the head marks it and says so; the host puts that tab's
  // rows in the body. The panel keeps its width -- it is fixed, never the
  // width of what a tab holds.


  chooseTab(index) {
    const tab = this.tabs[index];
    if (!tab || tab.id === this.activeTab?.id) return this;
    this.setState({
      activeTab: tab.id
    });
    this.sfEmit("tab", {
      id: tab.id,
      index: tab.index
    });
    return this;
  } // The head's close button: an owned menu closes itself; a menu its host
  // placed is closed by the host, which hears the same event either way.


  requestClose() {
    if (this._owned) return this.close({
      reason: "close"
    });
    this.sfEmit("close", {
      reason: "close",
      unsaved: false
    }, {
      cancelable: true
    });
    return true;
  }

  get templateName() {
    return this.getAttribute("template") || "default";
  }

  get position() {
    return normalizePosition(this.getAttribute("position"));
  } // The host's role (§3.1): a menu unless the page says otherwise.


  get menuRole() {
    return this.getAttribute("role") || "menu";
  }

  templateContext() {
    const props = this.getPropsContext();
    return this.createTemplateContext({ ...props,
      entries: this.entries,
      search: this.search,
      query: this.query,
      tabs: this.tabs,
      activeTab: this.activeTab,
      closable: this.closable,
      closeLabel: this.sfWord("close"),
      role: this.menuRole,
      panel: this.panel,
      position: this.position,
      size: this.size,
      component: this,
      rootClass: this.getRootClass()
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_3__.renderContextMenuTemplate)(this.templateContext());
  }

}

SfContextMenu.define("sf-context-menu");
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "1197ac823db7"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderContextMenuTemplate: () => (/* binding */ renderContextMenuTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);


function joinClasses(...tokens) {
  return tokens.flat().filter(Boolean).join(" ");
}

function renderItem(item) {
  if (item?.component === "sf-button") {
    const props = item.props || {};
    const click = props["@click"];
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
            <sf-button
                    appearance=${props.type || "default"}
                    scheme=${props.scheme || "primary"}
                    size=${props.size || "1"}
                    text=${props.text || ""}
                    icon-start=${props.iconLeft || ""}
                    icon-end=${props.iconRight || ""}
                    aria-label=${props.ariaLabel || props.text || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    ?disabled=${Boolean(props.disabled)}
                    @click=${typeof click === "function" ? click : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ></sf-button>
        `;
  }

  return SF.__internal.litHtml(item.component, item.props);
}

function renderItems(items) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        ${items.map(renderItem)}
    `;
} // The standard menu: entries are data, not components. An item is a row with
// an optional icon, a label and caption, and at its end a value, a shortcut, a
// check or a submenu chevron; a separator is a rule; a heading names the group
// of items under it. The row geometry is the profile menu's (owner, 2026-10-12):
// as tall as a size-1/2 field, its content on the field's axis.


const ROLE = {
  check: "menuitemcheckbox",
  radio: "menuitemradio"
};

function icon(name, className) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class="sf-icon ${className}" aria-hidden="true">${name}</i>`;
} // Initials for a person without a picture: the first letter of the first two
// words, the way an avatar draws them.


function initials(name = "") {
  return String(name).trim().split(/\s+/u).slice(0, 2).map(word => word[0] ?? "").join("").toUpperCase();
} // What leads a row: an icon, or a picture of the thing itself -- a site's logo,
// a person -- with its initials when there is no picture.


function renderLead(entry) {
  if (entry.avatar) return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<img class="sf-context-menu-item-avatar" src=${entry.avatar} alt="">`;
  if (entry.initials) return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-context-menu-item-avatar" aria-hidden="true">${entry.initials}</span>`;
  return entry.icon ? icon(entry.icon, "sf-context-menu-item-icon") : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
} // Who the menu is about -- the signed-in person at the top of a profile menu.
// Text, not an item: it is read, not chosen.


function renderHeader(entry) {
  const picture = entry.avatar ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<img class="sf-context-menu-header-avatar" src=${entry.avatar} alt="">` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-context-menu-header-avatar" aria-hidden="true">${entry.initials ?? initials(entry.text)}</span>`;
  const lines = Array.isArray(entry.caption) ? entry.caption : [entry.caption].filter(Boolean);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-context-menu-header" role="presentation">
        ${picture}
        <span class="sf-context-menu-header-text">
            <span class="sf-context-menu-header-name">${entry.text ?? ""}</span>
            ${lines.map(line => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-context-menu-header-caption">${line}</span>`)}
        </span>
    </div>`;
} // A choice of a few options side by side -- the theme in a profile menu. Each
// option is a menuitemradio of the menu, so the arrows walk through them as
// through any row.


function renderChoice(entry, index) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-context-menu-choice" role="group" aria-label=${entry.text ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
        ${(entry.options ?? []).map((option, at) => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<button
                type="button"
                class="sf-context-menu-item sf-context-menu-choice-option"
                role="menuitemradio"
                data-sf-entry=${index}
                data-sf-option=${at}
                aria-checked=${String(Boolean(option.checked))}
                aria-label=${option.text ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                title=${option.text ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ?disabled=${Boolean(option.disabled)}
        >${option.icon ? icon(option.icon, "") : option.text ?? ""}</button>`)}
    </div>`;
}

function renderEntry(entry, index, lead) {
  if (entry?.type === "header") return renderHeader(entry);
  if (entry?.type === "choice") return renderChoice(entry, index);

  if (entry?.type === "note") {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<p class="sf-context-menu-note">${entry.text ?? ""}</p>`;
  }

  if (entry?.type === "separator") {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-context-menu-separator" role="separator"></div>`;
  }

  if (entry?.type === "heading") {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-context-menu-heading" role="presentation">${entry.text ?? ""}</div>`;
  }

  const role = ROLE[entry.kind] ?? "menuitem";
  const checkable = role !== "menuitem";
  const submenu = Array.isArray(entry.submenu) && entry.submenu.length > 0;
  const classes = joinClasses("sf-context-menu-item", entry.danger ? "sf-context-menu-item--danger" : "", entry.current ? "sf-context-menu-item--current" : "");
  const body = (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        ${lead ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-context-menu-item-lead">${renderLead(entry)}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        <span class="sf-context-menu-item-text">
            <span class="sf-context-menu-item-label">${entry.text ?? ""}</span>
            ${entry.caption ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-context-menu-item-caption">${entry.caption}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        </span>
        ${entry.value ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-context-menu-item-value">${entry.value}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        ${entry.shortcut ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<kbd class="sf-context-menu-item-shortcut">${entry.shortcut}</kbd>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        ${checkable ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-context-menu-item-check">${entry.checked ? icon("check", "") : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        ${submenu ? icon("chevron_right", "sf-context-menu-item-chevron") : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    `;

  if (entry.href && !submenu && !entry.disabled) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<a class=${classes} href=${entry.href} role=${role} data-sf-entry=${index} lang=${entry.lang ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>${body}</a>`;
  }

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<button
            type="button"
            class=${classes}
            role=${role}
            data-sf-entry=${index}
            lang=${entry.lang ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            aria-checked=${checkable ? String(Boolean(entry.checked)) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            aria-haspopup=${submenu ? "menu" : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            aria-expanded=${submenu ? "false" : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ?disabled=${Boolean(entry.disabled)}
    >${body}</button>`;
}

const ROWS = entry => entry && !["separator", "heading", "header", "choice", "note"].includes(entry.type); // What a search narrows to: the rows whose label or caption holds the query.


function matches(entry, query) {
  if (!query) return true;
  if (!ROWS(entry)) return false;
  const text = `${entry.text ?? ""} ${entry.caption ?? ""} ${entry.keywords ?? ""}`.toLowerCase();
  return text.includes(query);
}

function renderSearch(context) {
  const search = context.search;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-context-menu-search">
        <input
                class="sf-context-menu-search-input"
                type="search"
                autocomplete="off"
                spellcheck="false"
                placeholder=${search.placeholder ?? ""}
                aria-label=${search.placeholder || context.ariaLabel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                .value=${context.query ?? ""}
                @input=${event => context.component.setQuery(event.target.value)}
        >
    </div>`;
}

function renderEntries(context) {
  const entries = context.entries;
  const query = String(context.query ?? "").trim().toLowerCase(); // One leading column for the whole menu: when any item has an icon, every
  // item keeps the place, so the labels start on one line.

  const lead = entries.some(entry => ROWS(entry) && (entry.icon || entry.avatar || entry.initials)); // A search the host answers (search.remote) shows the entries as the host
  // set them for the query; a local one narrows them here.

  const remote = Boolean(context.search?.remote);
  const shown = entries.map((entry, index) => [entry, index]).filter(([entry]) => remote || matches(entry, query));
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        ${context.search ? renderSearch(context) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        ${shown.map(([entry, index]) => renderEntry(entry, index, lead))}
        ${context.search && query && !shown.some(([entry]) => ROWS(entry)) ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<p class="sf-context-menu-note" role="status">${context.search.empty ?? ""}</p>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    `;
}

function renderContent(context) {
  if (context.entries && context.entries.length) {
    return renderEntries(context);
  }

  if (context.items && context.items.length) {
    return renderItems(context.items); // console.log(items);
  }

  if (context.component?.hasSlotContent?.("content")) {
    return context.component.getSlotContent("content");
  }

  return context.text || lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
} // The footer of actions: what is slotted as "footer" stands under the rows,
// at the bottom while they scroll, its buttons sharing the width.


function renderFooter(context) {
  if (!context.component?.hasSlotContent?.("footer")) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-context-menu-footer">${context.component.getSlotContent("footer")}</div>`;
} // A panel's head: the tabs, and the way out at its end. It never scrolls --
// the body under it does (owner, 2026-10-15).


function renderPanelHead(context) {
  const active = context.activeTab;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-context-menu-head">
        <sf-tabs class="sf-context-menu-tabs" type="underline" size=${context.size === "1" ? "1" : "1/2"}
                items=${context.tabs.map(tab => tab.label).join("|")}
                active-index=${String(active?.index ?? 0)}
                @sf-tab-change=${event => {
    event.stopPropagation();
    context.component.chooseTab(Number(event.detail?.current ?? 0));
  }}></sf-tabs>
        ${context.closable ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-icon-button class="sf-context-menu-close" appearance="link" scheme="on-surface"
                size=${context.size === "1" ? "1" : "1/2"} icon="close"
                aria-label=${context.closeLabel} title=${context.closeLabel}
                @click=${() => context.component.requestClose()}></sf-icon-button>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    </div>`;
} // No tail (owner, 2026-10-12): it never read as one piece with the panel. The
// position attribute is kept for its class and draws nothing.


function renderTooltip() {
  return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
}

function renderContextMenuTemplate(context) {
  const rootClasses = joinClasses("sf-context-menu", context.position ? `sf-context-menu--position-${context.position}` : "", context.entries && context.entries.length ? "sf-context-menu--entries" : "", context.size === "1" ? "sf-context-menu--size-1" : "", context.panel ? "sf-context-menu--panel" : "", "flex", context.rootClass);
  const contentClasses = joinClasses("sf-context-menu-content", "flex", "flex-col", "flex-1", context.contentClass);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div
                class=${rootClasses}
                style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                role=${context.role || "menu"}
                aria-label=${context.ariaLabel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        >
            <div class="relative">
                ${renderTooltip(context)}
                ${context.panel ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class=${contentClasses}>
                        ${renderPanelHead(context)}
                        <div class="sf-context-menu-body" role="tabpanel" aria-label=${context.activeTab?.label ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>${renderContent(context)}</div>
                        ${renderFooter(context)}
                    </div>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class=${contentClasses}>${renderContent(context)}${renderFooter(context)}</div>`}
            </div>
        </div>
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

/***/ "15bdf574d949"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-context-menu for the shim (core/js/aliases.js, standard §16 item 20). mode: host-attribute (no shim), manifest-only (the DOM name does not change; its meaning does), retired (no new name; kept until the date).","component":"sf-context-menu","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"aria-label","to":null,"kind":"attribute","component":"sf-context-menu","since":"2026-10-27","remove_after":"2026-12-01","mode":"host-attribute","section":"§3.1","note":"stays a host attribute, read by the base (§3.1, §4.8); no shim"},{"from":"role","to":null,"kind":"attribute","component":"sf-context-menu","since":"2026-10-27","remove_after":"2026-12-01","mode":"host-attribute","section":"§3.1","note":"stays a host attribute (menu by default); no shim"},{"from":"sf-context-menu-open","to":null,"kind":"event","component":"sf-context-menu","since":"2026-10-27","remove_after":"2026-12-01","mode":"manifest-only","section":"§19.3, vocabulary §4","note":"the same DOM name is the cancelable request now (sent before opening); the fact is sf-context-menu-opened"},{"from":"sf-context-menu-close","to":null,"kind":"event","component":"sf-context-menu","since":"2026-10-27","remove_after":"2026-12-01","mode":"manifest-only","section":"§19.3, vocabulary §4","note":"the same DOM name is the cancelable request now ({reason, unsaved}, sent before closing); the fact is sf-context-menu-closed"},{"from":"position","to":null,"kind":"setting","component":"sf-context-menu","since":"2026-10-27","remove_after":"2026-12-01","mode":"retired","section":"compatibility.deprecations 1.3.0","note":"openFor(anchor, {side, align}) places the menu; read until the date"},{"from":"tooltip","to":null,"kind":"setting","component":"sf-context-menu","since":"2026-10-27","remove_after":"2026-12-01","mode":"retired","section":"compatibility.deprecations 1.3.0","note":"a menu has no tail; read until the date"}]}');

/***/ },

/***/ "e2f5b0e3495d"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.context-menu","tag":"sf-context-menu","version":"1.4.3","kind":"leaf","settings":{"position":{"type":"enum","values":["","inline-start","inline-start-top","inline-start-bottom","inline-end","inline-end-top","inline-end-bottom","top","top-inline-start","top-inline-end","bottom","bottom-inline-start","bottom-inline-end","start","end","top-start","top-end","bottom-start","bottom-end","left","left-top","left-bottom","right","right-top","right-bottom","top-left","top-center","top-right","bottom-left","bottom-center","bottom-right","left-start","left-end","right-start","right-end","inline-start-start","inline-start-end","inline-end-start","inline-end-end"],"default":""},"tooltip":{"type":"boolean","default":true},"text":{"type":"string","default":""},"items":{"type":"list","default":[],"of":{"text":"string","value":"string"},"x-note":"the older list form; entries is the current one"},"content-class":{"type":"string","default":""},"entries":{"type":"list","default":[],"of":{"id":"string","text":"string","caption":{"type":"string","optional":true},"icon":{"type":"icon","optional":true},"avatar":{"type":"string","optional":true},"initials":{"type":"string","optional":true},"shortcut":{"type":"string","optional":true},"kind":{"type":"string","optional":true},"type":{"type":"string","optional":true},"value":{"type":"string","optional":true},"lang":{"type":"string","optional":true},"keywords":{"type":"string","optional":true},"checked":{"type":"boolean","optional":true},"disabled":{"type":"boolean","optional":true},"danger":{"type":"boolean","optional":true},"current":{"type":"boolean","optional":true},"href":{"type":"string","optional":true},"keep-open":{"type":"boolean","optional":true},"submenu":{"type":"list","optional":true},"search":{"type":"object","optional":true},"options":{"type":"list","optional":true}}},"popup":{"type":"boolean","default":false},"search":{"type":"object","optional":true},"size":{"type":"enum","values":["1/2","1"],"default":"1/2"},"width":{"type":"string","default":"content"},"tabs":{"type":"string","default":"","x-note":"\\"A|B\\" in the attribute; the property also takes a list [{id, label}] (the component\'s own accessor), one member with one type (§4.2)"},"active-tab":{"type":"string","default":""},"closable":{"type":"boolean","default":false}},"values":{},"events":{"select":{"carries":{"id":"string","entry":"object","checked":"boolean","group":"string"},"cancelable":true},"open":{"carries":{},"cancelable":true},"opened":{"carries":{}},"close":{"carries":{"reason":{"type":"enum","values":["close","escape","outside","cancelled","api"]},"unsaved":"boolean"},"cancelable":true},"closed":{"carries":{"reason":{"type":"enum","values":["close","escape","outside","cancelled","api"]}}},"search":{"carries":{"query":"string"},"own-verb":true},"tab":{"carries":{"id":"string","index":"number"},"own-verb":true}},"actions":{"open-for":{"with":{"anchor":"object","options":{"type":"object","optional":true}},"waits":true,"x-outcomes":["applied","conflict","refused","unavailable","cancelled"],"emits":"open"},"toggle-for":{"with":{"anchor":"object","options":{"type":"object","optional":true}},"waits":true,"x-outcomes":["applied","conflict","refused","unavailable","cancelled"]},"close":{"with":{"reason":{"type":"enum","values":["close","escape","outside","cancelled","api"]}},"emits":"close","x-outcomes":["applied","refused"]},"choose-tab":{"with":{"index":"number"},"x-outcomes":["applied","refused"]},"request-close":{"x-outcomes":["applied","refused"]}},"layer":{"kind":"surface","locks-page":false,"traps-focus":false},"css-variables":{"--sf-context-menu-background-color":{"type":"color","state":"default"},"--sf-context-menu-color":{"type":"color","state":"default"},"--sf-context-menu-border-color":{"type":"color","state":"default"},"--sf-context-menu-border-width":{"type":"length","state":"default"},"--sf-context-menu-radius":{"type":"length","state":"default"},"--sf-context-menu-padding-inline":{"type":"length","state":"default"},"--sf-context-menu-padding-block":{"type":"length","state":"default"},"--sf-context-menu-gap":{"type":"length","state":"default"}}}');

/***/ },

/***/ "bfc52fd90c79"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Context Menu","runtime":{"close":"Close"},"events":{"search":{"label":"Search the menu"},"tab":{"label":"Choose a tab"}}}');

/***/ },

/***/ "ef70d4c8e73e"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Контекстное меню","runtime":{"close":"Закрыть"},"events":{"search":{"label":"Искать в меню"},"tab":{"label":"Выбрать вкладку"}}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("765b8f3f8ccb");
/******/
/******/ })()
;