/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "cb6d39a52a42"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PanelScrollbar: () => (/* binding */ PanelScrollbar),
/* harmony export */   scrollbarTakesRoom: () => (/* binding */ scrollbarTakesRoom)
/* harmony export */ });
// The scrollbar of a dropping panel stands in the inline-end inset only while
// it takes room (owner C07, docs review R029, 2026-11-07): the area that
// scrolls the rows gives up its inline-end padding then, and keeps it beside an
// overlay scrollbar or none. The sheets draw the track (the inset, the thumb,
// the inset -- src/component/context-menu/scss/_panel.scss); this marks the
// area with a class while its scrollbar takes room, read from offsetWidth -
// clientWidth past the borders whenever the area is drawn or changes its size
// (a narrowed search, a panel fitted to its room, a window made smaller).
// Used by sf-menu-context, sf-dropdown's list, sf-input-lookup and
// sf-profile-picker.
function scrollbarTakesRoom(area) {
  const style = getComputedStyle(area);
  const borders = (parseFloat(style.borderLeftWidth) || 0) + (parseFloat(style.borderRightWidth) || 0);
  return area.offsetWidth - area.clientWidth - borders > 0;
}
class PanelScrollbar {
  constructor() {
    this.area = null;
    this.name = '';
    this.observer = null;
  } // Watch `area` (or nothing, given null) and mark it with `name`. A new area
  // releases the old one and takes its mark off.


  watch(area, name) {
    if (area !== this.area || name !== this.name) {
      this.observer?.disconnect();
      if (this.area && this.name) this.area.classList.remove(this.name);
      this.area = area ?? null;
      this.name = name;

      if (this.area && typeof ResizeObserver === 'function') {
        // The mark moves the area's padding, so it is written on the next
        // frame: written in the observer's own call it would resize what is
        // observed while the observer delivers (a ResizeObserver loop).
        this.observer ??= new ResizeObserver(() => requestAnimationFrame(() => this.mark()));
        this.observer.observe(this.area);
      }
    }

    this.mark();
  }

  mark() {
    const area = this.area;
    if (!area?.isConnected || !this.name) return;
    const takesRoom = scrollbarTakesRoom(area);
    if (area.classList.contains(this.name) !== takesRoom) area.classList.toggle(this.name, takesRoom);
  }

  disconnect() {
    this.observer?.disconnect();
    this.observer = null;
    if (this.area && this.name) this.area.classList.remove(this.name);
    this.area = null;
    this.name = '';
  }

}

/***/ },

/***/ "ad5bbe113041"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SfProfilePicker: () => (/* binding */ SfProfilePicker)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _core_js_position_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("116963e5e31b");
/* harmony import */ var _core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("bf0cea966575");
/* harmony import */ var _core_js_layer_stack__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("18003344cff0");
/* harmony import */ var _component_panel_scrollbar__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("cb6d39a52a42");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("4a548d247667");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("816c0ad0728a");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("9ad70024c464");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("ad1b3554788b");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("0c5af1be4f82");
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__("9b0fd2c3adba");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, _core_js_smart_base__WEBPACK_IMPORTED_MODULE_1__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2__, _core_js_position_js__WEBPACK_IMPORTED_MODULE_3__, _core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_4__, _core_js_layer_stack__WEBPACK_IMPORTED_MODULE_5__, _js_templates_default__WEBPACK_IMPORTED_MODULE_7__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, _core_js_smart_base__WEBPACK_IMPORTED_MODULE_1__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2__, _core_js_position_js__WEBPACK_IMPORTED_MODULE_3__, _core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_4__, _core_js_layer_stack__WEBPACK_IMPORTED_MODULE_5__, _js_templates_default__WEBPACK_IMPORTED_MODULE_7__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _core_js_position_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_core_js_position_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _core_js_layer_stack__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_5__);
// sf-profile-picker: the one way a person chooses, makes, renames, removes and
// resets a profile -- the admin menu's profiles, a record's views, and
// whatever has profiles next (owner, 2026-10-14, from the approved
// prototype). It picks a settings profile -- a named set of menu rows, of a
// record's view, of a table's columns -- never an account or an organisation
// (owner decision C163 (1): those are the person menu's, sf-menu-context).
// Folded it is the standard button naming the profile in use (sf-button ghost
// with a chevron, C163 (2)); open, everything happens in its panel: a row per
// profile, its rename and remove behind the row's «⋯» (C163 (3)), a new
// profile made inline, a reset at the foot. On a phone the panel is the
// Framework's bottom sheet, sf-drawer placement=bottom (C163 (4), C157 (5)).
//
// The profiles and what may be done with them are the host's: the component
// draws them and says what the person asked for, with one event per act --
// sf-profile-picker-select, -create, -rename, -delete, -reset (the old
// sf-profile-* names follow until 2026-12-01). It does not change its own
// list; the host answers by setting `profiles` (and `current`), or by setting
// `message` to say why not.
//
// From its component.json (standard simai.smart-component 1.3.8 §3, §4, §8):
// settings and values are made by core/js/element-manifest.js, the words are
// lang/<locale>.json, and skeleton.html is its first paint before the host's
// profiles arrive (§5.4).











 // Only the words on screen ship in the bundle; the title, settings and events
// stay in the language files for the Studio and the docs (localization study LC-2).

const en = {
  runtime: _lang_en_json__WEBPACK_IMPORTED_MODULE_10__.runtime
};
const ru = {
  runtime: _lang_ru_json__WEBPACK_IMPORTED_MODULE_11__.runtime
};

const ProfilePickerElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_8__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_1___default()),
  lang: {
    en,
    ru
  },
  source: 'ru',
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_9__
});

const position = () => globalThis.SF?.Position || (_core_js_position_js__WEBPACK_IMPORTED_MODULE_3___default()); // On a phone -- below the md breakpoint, where core declares
// --sf-breakpoint-md -- the panel is a sheet at the bottom of the screen
// (owner decisions C32, C106 (8): a panel holding a form is a bottom sheet on
// a phone; C163 (4), C157 (5): the one bottom sheet is sf-drawer
// placement=bottom, a lazy relation). A page without sf-drawer gets the
// picker's own sheet, the panel at the bottom of the screen.


const onPhone = () => !getComputedStyle(document.documentElement).getPropertyValue('--sf-breakpoint-md').trim(); // The row's buttons are reached by the arrows' F2 and Delete, not by Tab: the
// menu is one stop (sf-button-icon draws its native button late, so it is
// tamed as it appears).


const tameButtons = panel => {
  for (const button of panel?.querySelectorAll('.sf-profile-picker-actions button') ?? []) button.tabIndex = -1;
}; // Asks the Loader for a lazy relation and answers whether it is defined.


const ensureElement = async tag => {
  if (globalThis.customElements?.get(tag)) return true;

  try {
    await globalThis.SF?.Loader?.ensure?.([tag]);
  } catch {// Not on this page: the caller's fallback.
  }

  return Boolean(globalThis.customElements?.get(tag));
}; // The template names its words in camelCase; the language files in kebab-case.


const kebab = key => String(key).replace(/[A-Z]/gu, letter => `-${letter.toLowerCase()}`);

class SfProfilePicker extends ProfilePickerElement {
  constructor() {
    super();
    this._profiles = [];
    this._rights = {};
    this.state = {
      open: false,
      sheet: false,
      drawer: false,
      mode: null,
      target: null,
      draft: {
        name: '',
        shared: false
      }
    };
  }

  static get props() {
    return { ...super.props,
      templateName: {
        attribute: 'template',
        default: 'default'
      },
      rootClass: {
        default: ''
      }
    };
  } // [{id, label, shared, builtin, editable}]: editable false is a profile this
  // person may see and choose but not change; builtin is the standard one,
  // never renamed or removed.


  get profiles() {
    return this._profiles;
  }

  set profiles(value) {
    this._profiles = Array.isArray(value) ? value.filter(entry => entry && entry.id !== undefined) : []; // A host that answers with the list has answered the act in progress.

    if (this.state.mode && this.state.mode !== 'delete-confirm') this.state = { ...this.state,
      mode: null,
      target: null
    };

    if (this.state.mode === 'delete-confirm' && !this._profiles.some(entry => String(entry.id) === this.state.target)) {
      this.state = { ...this.state,
        mode: null,
        target: null
      };
    }

    this.requestComponentUpdate('profiles');
  } // {create: {personal, shared}, reset}: what this person may make. A
  // personal profile is one per person, so a host that has one says so.


  get rights() {
    return this._rights;
  }

  set rights(value) {
    this._rights = value && typeof value === 'object' ? value : {};
    this.requestComponentUpdate('rights');
  } // Size 1 by default (owner decision C22): a compact admin gets its smaller
  // step from data-sf-density, a phone from the ladder; 1/2 was the default
  // and made a phone's trigger 24 high. size="1/2" is still drawn as asked.


  get size() {
    return this.getAttribute('size') === '1/2' ? '1/2' : '1';
  }

  set size(value) {
    if (value === null || value === undefined || value === '') this.removeAttribute('size');else this.setAttribute('size', String(value));
  }

  get current() {
    return this.getAttribute('current') ?? String(this._profiles[0]?.id ?? '');
  }

  set current(value) {
    if (value === null || value === undefined) this.removeAttribute('current');else this.setAttribute('current', String(value));
  }

  text(key) {
    return this.sfWord(kebab(key));
  }

  currentProfile() {
    return this._profiles.find(entry => String(entry.id) === String(this.current)) ?? this._profiles[0] ?? null;
  }

  mayChange(profile) {
    return Boolean(profile) && profile.editable !== false && !profile.builtin;
  }

  canCreate() {
    const create = this._rights.create ?? {};
    return Boolean(create.personal || create.shared);
  }

  panel() {
    if (this.state.drawer) return this._sheetBody?.querySelector('.sf-profile-picker-panel') ?? null;
    return this.querySelector(':scope > .sf-profile-picker > .sf-profile-picker-panel');
  } // The trigger's native button (sf-button's host lays out as
  // display:contents, so the box and the focus are its button's).


  trigger() {
    const host = this.querySelector(':scope > .sf-profile-picker > .sf-profile-picker-trigger');
    return host?.querySelector(':scope > button') ?? null;
  } // ─── opening ───────────────────────────────────────────────────────────


  async open() {
    if (this.disabled) return {
      outcome: 'refused',
      reason: 'disabled'
    };
    if (this.state.open) return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2__.applied)();

    if (onPhone() && !this._noDrawer) {
      this.state = { ...this.state,
        open: true,
        sheet: true,
        drawer: true,
        mode: null,
        target: null
      };
      this.requestComponentUpdate('open');
      if (await ensureElement('sf-drawer')) return this.openSheet(); // No bottom sheet on this page: the picker's own.

      this._noDrawer = true;
      if (!this.state.open || !this.isConnected) return {
        outcome: 'refused',
        reason: 'closed'
      };
      this.state = { ...this.state,
        open: false,
        sheet: false,
        drawer: false
      };
    }

    this.state = { ...this.state,
      open: true,
      sheet: onPhone(),
      drawer: false,
      mode: null,
      target: null
    };
    this.requestComponentUpdate('open');
    await this.whenRendered?.(); // Closed or taken out while it drew (§7.7): nothing is started, or the
    // listeners, the placement and the layer it registers would outlive it.
    // The action answers cancelled when its scope has ended (element-manifest.js).

    if (!this.state.open || !this.isConnected) return {
      outcome: 'refused',
      reason: 'closed'
    };
    const panel = this.panel();
    const trigger = this.trigger();
    if (!panel || !trigger) return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2__.applied)();

    if (typeof panel.showPopover === 'function') {
      panel.setAttribute('popover', 'manual');
      if (!panel.matches(':popover-open')) panel.showPopover();
    }

    this.place();

    this._onResize = () => {
      if (this.state.open && onPhone() !== this.state.sheet) {
        this.state = { ...this.state,
          sheet: onPhone()
        };
        this.requestComponentUpdate('sheet');
        this.whenRendered?.().then(() => this.place());
      }
    };

    window.addEventListener('resize', this._onResize);
    tameButtons(panel);
    this._tamer = typeof MutationObserver === 'function' ? new MutationObserver(() => tameButtons(this.panel())) : null;
    this._tamer?.observe(panel, {
      childList: true,
      subtree: true
    }); // The scrollbar stands in the panel's inline-end inset while it takes
    // room (owner C07, docs review R029).

    this._scrollbar ??= new _component_panel_scrollbar__WEBPACK_IMPORTED_MODULE_6__.PanelScrollbar();

    this._scrollbar.watch(panel, 'sf-profile-picker-panel--scrollbar'); // The open panel owns Escape: the root says so, and a drawer or record
    // panel listening on the document stands back. A press outside the picker
    // and its panel closes it, heard through the layer stack's one listener
    // while it is the top layer (§19.3).


    (0,_core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_4__.holdOpenSurfaceMark)(this, true, {
      root: () => this.panel(),
      onOutsidePress: () => this.close({
        restoreFocus: false
      }),
      // An Escape whose focus is not in a row (the page, after a press
      // outside the rows) still closes the open panel.
      onEscape: () => {
        if (this.state.mode) this.setMode(null);else this.close();
        return true;
      },
      // A sheet covers the page, so Tab goes round inside it.
      onTab: event => {
        if (!this.state.sheet) return;
        const controls = (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_5__.focusablesIn)(this.panel());
        if (!controls.length) return;
        const first = controls[0];
        const last = controls[controls.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });
    (panel.querySelector('.sf-profile-picker-row[aria-checked="true"]') ?? panel.querySelector('.sf-profile-picker-row'))?.focus({
      preventScroll: true
    });
    return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2__.applied)();
  } // ─── the bottom sheet on a phone ────────────────────────────────────────
  // sf-drawer placement=bottom, made once and kept in the host so it carries
  // the picker's language, direction and theme to its portal. The drawer
  // draws the head (the picker's name and its close button), holds the focus
  // and the scrim, closes on Escape, the scrim and a swipe down, and gives the
  // focus back to the trigger; the picker draws its rows into the body.


  sheetDrawer() {
    if (this._sheet?.isConnected && this._sheet.parentNode === this) return this._sheet;
    const sheet = document.createElement('sf-drawer');
    sheet.setAttribute('placement', 'bottom');
    sheet.setAttribute('modal', '');
    const body = document.createElement('div');
    body.className = 'sf-profile-picker-sheet-body';
    sheet.append(body);
    sheet.addEventListener('sf-drawer-opened', () => this.focusSheetRow());
    sheet.addEventListener('sf-drawer-closed', () => this.sheetClosed());
    this.append(sheet);
    this._sheet = sheet;
    this._sheetBody = body;
    return sheet;
  }

  async openSheet() {
    await this.whenRendered?.();
    if (!this.state.open || !this.isConnected) return {
      outcome: 'refused',
      reason: 'closed'
    };
    const sheet = this.sheetDrawer(); // The sheet's title, which also names its dialog.

    sheet.setAttribute('heading', this.label || this.text('label'));
    sheet.setAttribute('close-label', this.text('close'));
    this.renderSheet(); // The drawer focuses its panel when it opens (and again when its sheet
    // has come on a first open); the picker hands that focus on to the
    // current row, as the dropping panel opens on it.

    this._sheetFocus ??= event => {
      const panel = this._sheetBody?.closest('[data-sf-drawer-panel]');
      if (this.state.drawer && panel && event.target === panel) this.focusSheetRow();
    };

    document.addEventListener('focusin', this._sheetFocus, true);
    this._tamer?.disconnect();
    this._tamer = typeof MutationObserver === 'function' ? new MutationObserver(() => tameButtons(this.panel())) : null;
    this._tamer?.observe(this._sheetBody, {
      childList: true,
      subtree: true
    });
    await sheet.open?.();
    tameButtons(this.panel());
    return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2__.applied)();
  }

  focusSheetRow() {
    const panel = this.panel();
    if (!this.state.drawer || !panel || this.state.mode) return;
    (panel.querySelector('.sf-profile-picker-row[aria-checked="true"]') ?? panel.querySelector('.sf-profile-picker-row'))?.focus({
      preventScroll: true
    });
  }

  renderSheet() {
    if (!this._sheetBody) return;
    (0,lit__WEBPACK_IMPORTED_MODULE_0__.render)((0,_js_templates_default__WEBPACK_IMPORTED_MODULE_7__.renderProfilePickerSheet)(this.templateContext()), this._sheetBody);
  } // The drawer closed itself (its close button, the scrim, Escape, a swipe):
  // the picker is closed too; the drawer has given the focus back.


  sheetClosed() {
    if (!this.state.drawer) return;
    this.finishClose();
    this.requestComponentUpdate('close');
  } // Every update of the element draws the sheet's body too while it is open.


  renderTemplateResult(templateResult) {
    super.renderTemplateResult(templateResult);
    if (this.state.drawer) this.renderSheet();
  } // Anchored under the trigger, at least its width; a sheet at the bottom of
  // the screen on a phone (the stylesheet's sf-profile-picker-panel--sheet).


  place() {
    const panel = this.panel();
    const trigger = this.trigger();
    this._position?.stop();
    this._position = null;
    if (!panel || !trigger) return;

    if (this.state.sheet) {
      panel.style.removeProperty('min-inline-size');

      for (const property of ['top', 'left', 'right', 'bottom', 'inset', 'translate', 'transform', 'max-block-size', 'max-height']) panel.style.removeProperty(property);

      return;
    } // At least the trigger's width, wider for a long name.


    panel.style.minInlineSize = `${Math.round(trigger.getBoundingClientRect().width)}px`;
    this._position = position().anchor(trigger, panel, {
      side: 'block-end',
      align: 'start',
      flip: true,
      shift: true,
      fitHeight: true
    });
  }

  close({
    restoreFocus = true
  } = {}) {
    if (!this.state.open) return {
      outcome: 'refused',
      reason: 'closed'
    };
    this._actions?.close?.({
      restoreFocus: false
    });

    if (this.state.drawer) {
      // The drawer gives the focus back to what opened it, the trigger.
      const sheet = this._sheet;
      this.finishClose();
      this.requestComponentUpdate('close');
      sheet?.close?.({
        reason: 'close'
      });
      return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2__.applied)();
    }

    this.finishClose();
    this._position?.stop();
    this._position = null;
    window.removeEventListener('resize', this._onResize);
    this._tamer?.disconnect();
    this._tamer = null;
    this._scrollbar?.disconnect();
    (0,_core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_4__.holdOpenSurfaceMark)(this, false);
    const panel = this.panel();
    if (panel?.matches?.(':popover-open')) panel.hidePopover();
    this.requestComponentUpdate('close');
    if (restoreFocus) this.trigger()?.focus({
      preventScroll: true
    });
    return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2__.applied)();
  } // What every close does, whoever closed: the state, the listeners.


  finishClose() {
    this.state = { ...this.state,
      open: false,
      sheet: false,
      drawer: false,
      mode: null,
      target: null
    };
    if (this._sheetFocus) document.removeEventListener('focusin', this._sheetFocus, true);
    this._tamer?.disconnect();
    this._tamer = null;
    if (this._sheetBody) (0,lit__WEBPACK_IMPORTED_MODULE_0__.render)((0,_js_templates_default__WEBPACK_IMPORTED_MODULE_7__.renderProfilePickerSheet)(this.templateContext()), this._sheetBody);
  }

  toggle() {
    return this.state.open ? this.close() : this.open();
  } // ─── a row's «⋯» (owner decision C163 (3)) ─────────────────────────────
  // One menu per picker, the standard sf-menu-context as a popup (a lazy
  // relation): «Переименовать» (F2) and, after a line, «Удалить…» in the
  // danger colour, which asks first in the row. It stands above the panel and
  // the sheet, and gives the focus back to the «⋯» it opened from.


  async openActions(id, from) {
    const profile = this._profiles.find(entry => String(entry.id) === String(id));

    if (!this.mayChange(profile) || !(await ensureElement('sf-menu-context'))) return;
    if (!this.state.open || !this.isConnected) return;

    if (!this._actions?.isConnected) {
      const menu = document.createElement('sf-menu-context');
      menu.setAttribute('popup', '');
      menu.className = 'sf-profile-picker-actions-menu';
      menu.addEventListener('sf-menu-context-select', event => {
        const chosen = event.detail?.id;
        const target = this._actionsFor;
        if (!target || chosen !== 'rename' && chosen !== 'delete') return; // The row's form takes the focus once it is drawn.

        setTimeout(() => this.setMode(chosen === 'rename' ? 'rename' : 'delete-confirm', target), 0);
      });
      this.append(menu);
      this._actions = menu;
    }

    const menu = this._actions;
    menu.setAttribute('aria-label', `${this.text('actions')}: ${profile.label ?? id}`);
    menu.entries = [{
      id: 'rename',
      text: this.text('rename'),
      icon: 'edit',
      shortcut: 'F2'
    }, {
      type: 'separator'
    }, {
      id: 'delete',
      text: this.text('removeAsk'),
      icon: 'delete',
      danger: true,
      shortcut: 'Delete'
    }];
    this._actionsFor = String(id);
    const anchor = from?.querySelector?.(':scope > button') ?? from;
    await menu.toggleFor?.(anchor);
  }

  disconnectedCallback() {
    this.close({
      restoreFocus: false
    });
    this._actions?.close?.({
      restoreFocus: false
    });
    super.disconnectedCallback();
  } // ─── acts ──────────────────────────────────────────────────────────────
  // sf-profile-picker-<verb> (§8); the old sf-profile-<verb> follows.


  announce(name, detail, {
    cancelable = false
  } = {}) {
    return this.sfEmit(name, detail, {
      cancelable
    });
  }

  setMode(mode, target = null) {
    const current = this.currentProfile();
    const create = this._rights.create ?? {};
    const draft = mode === 'create' ? {
      name: '',
      shared: create.personal ? false : true
    } : this.state.draft; // Leaving a form, the focus goes back to the row it was opened from (or
    // to «Новый профиль…»), so the next Escape still reaches the panel: it
    // fell to the page with the form, and the panel stayed open.

    const back = mode ? null : this.state.mode === 'create' ? 'add' : this.state.target;
    this.state = { ...this.state,
      mode,
      target: target === null ? null : String(target),
      draft
    };
    this.setAttribute('message', '');
    this.requestComponentUpdate('mode');
    this.whenRendered?.().then(() => {
      const panel = this.panel();

      if (!mode) {
        if (!this.state.open || !panel || panel.contains(document.activeElement) && document.activeElement !== panel) return;
        const row = back === 'add' ? panel.querySelector('.sf-profile-picker-add') : back !== null && [...panel.querySelectorAll('.sf-profile-picker-row[data-id]')].find(entry => entry.dataset.id === back) || panel.querySelector('.sf-profile-picker-row[aria-checked="true"]');
        row?.focus({
          preventScroll: true
        });
        return;
      }

      const field = panel?.querySelector('.sf-profile-picker-field');
      field?.focus();
      field?.select?.();
    });
    return current;
  }

  choose(id) {
    if (String(id) !== String(this.current)) this.announce('select', {
      id: String(id),
      ids: [String(id)]
    });
    this.close();
  }

  submitCreate(name, shared) {
    const label = String(name ?? '').trim();

    if (!label) {
      this.setAttribute('message', this.text('nameEmpty'));
      return;
    }

    const create = this._rights.create ?? {};
    const kind = shared && create.shared || !create.personal ? true : Boolean(shared);
    this.announce('create', {
      label,
      shared: kind,
      from: String(this.currentProfile()?.id ?? ''),
      kind: kind ? 'shared' : 'personal'
    });
  }

  submitRename(id, name) {
    const label = String(name ?? '').trim();

    if (!label) {
      this.setAttribute('message', this.text('nameEmpty'));
      return;
    }

    this.announce('rename', {
      id: String(id),
      label,
      title: label
    });
  }

  submitDelete(id) {
    this.announce('delete', {
      id: String(id),
      ids: [String(id)]
    });
  }

  reset() {
    this.announce('reset', {
      id: String(this.currentProfile()?.id ?? '')
    });
    this.close();
  }

  handleKeyDown(event) {
    if (event.key === 'Escape') {
      // Consumed: the press closes the panel (or leaves its form), not the
      // drawer or the window the picker sits in.
      event.preventDefault();
      event.stopPropagation();
      if (this.state.mode) this.setMode(null);else this.close();
      return;
    }

    const rows = [...(this.panel()?.querySelectorAll('.sf-profile-picker-row[tabindex]') ?? [])];
    const at = rows.indexOf(event.target);
    if (at < 0) return;
    const row = rows[at];

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      rows[(at + (event.key === 'ArrowDown' ? 1 : rows.length - 1)) % rows.length]?.focus();
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      rows[event.key === 'Home' ? 0 : rows.length - 1]?.focus();
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      row.click();
    } else if (event.key === 'F2' && row.dataset.id) {
      const profile = this._profiles.find(entry => String(entry.id) === row.dataset.id);

      if (this.mayChange(profile)) {
        event.preventDefault();
        this.setMode('rename', row.dataset.id);
      }
    } else if (event.key === 'Delete' && row.dataset.id) {
      const profile = this._profiles.find(entry => String(entry.id) === row.dataset.id);

      if (this.mayChange(profile)) {
        event.preventDefault();
        this.setMode('delete-confirm', row.dataset.id);
      }
    } else if ((event.key === 'ContextMenu' || event.key === 'F10' && event.shiftKey) && row.dataset.id) {
      // The row's «⋯» from the keyboard: its menu, as a context menu opens.
      const more = row.querySelector('.sf-profile-picker-more');

      if (more) {
        event.preventDefault();
        this.openActions(row.dataset.id, more);
      }
    }
  }

  templateContext() {
    return this.createTemplateContext({ ...this.getPropsContext(),
      component: this,
      // The page language's «Profile» when the host names nothing.
      heading: this.label || this.text('label'),
      size: this.size,
      profiles: this._profiles,
      current: this.current,
      currentProfile: this.currentProfile(),
      rights: this._rights,
      state: this.state,
      message: this.message,
      resettable: this.resettable,
      text: key => this.text(key),
      rootClass: this.getRootClass()
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_7__.renderProfilePickerTemplate)(this.templateContext());
  }

}

SfProfilePicker.define('sf-profile-picker');
globalThis.SF = globalThis.SF || {};

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "4a548d247667"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderProfilePickerSheet: () => (/* binding */ renderProfilePickerSheet),
/* harmony export */   renderProfilePickerTemplate: () => (/* binding */ renderProfilePickerTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);


const icon = (name, className = '') => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class="sf-icon ${className}" aria-hidden="true">${name}</i>`;

const kindIcon = profile => profile?.shared ? 'group' : 'person';

const fill = (text, values) => Object.entries(values).reduce((out, [key, value]) => out.replace(`{${key}}`, value), text); // A row's icon buttons are one step below the picker's size, so they sit in
// its row (sf-button-icon, PP-5; they were own buttons with raw glyphs).


const BUTTON_SIZE = {
  '1': '1/2',
  '1/2': '1/3'
};

const iconButton = (context, {
  icon: name,
  label,
  title,
  className = '',
  popup = false,
  onClick
}) => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button-icon
  class=${['sf-profile-picker-icon-button', className].filter(Boolean).join(' ')}
  icon=${name} size=${BUTTON_SIZE[context.size] ?? '1/2'} appearance="ghost" scheme="on-surface"
  aria-label=${label} aria-haspopup=${popup ? 'menu' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing} title=${title ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing} @click=${onClick}></sf-button-icon>`;

function renderRow(context, profile) {
  const {
    component,
    state,
    text
  } = context;
  const id = String(profile.id);
  const current = String(context.currentProfile?.id ?? '') === id;
  const may = component.mayChange(profile);

  if (state.mode === 'rename' && state.target === id) {
    let value = profile.label ?? '';
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-profile-picker-edit" data-id=${id}>
      <input class="sf-profile-picker-field" .value=${value} aria-label=${text('name')}
             @input=${event => {
      value = event.target.value;
    }}
             @keydown=${event => {
      if (event.key === 'Enter') {
        event.preventDefault();
        component.submitRename(id, event.target.value);
      }
    }}>
      ${iconButton(context, {
      icon: 'check',
      label: text('save'),
      title: text('save'),
      onClick: event => component.submitRename(id, event.currentTarget.closest('.sf-profile-picker-edit').querySelector('input').value)
    })}
      ${iconButton(context, {
      icon: 'close',
      label: text('cancel'),
      title: text('cancel'),
      onClick: () => component.setMode(null)
    })}
    </div>`;
  }

  if (state.mode === 'delete-confirm' && state.target === id) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-profile-picker-confirm" role="alertdialog" aria-label=${fill(text('removeQuestion'), {
      name: profile.label ?? id
    })}>
      <div>${fill(text('removeQuestion'), {
      name: profile.label ?? id
    })}${profile.shared ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)` ${text('removeShared')}` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}</div>
      <div class="sf-profile-picker-buttons">
        <sf-button size=${context.size} status="danger" text=${text('remove')} @click=${() => component.submitDelete(id)}></sf-button>
        <sf-button size=${context.size} appearance="ghost" scheme="on-surface" text=${text('cancel')} @click=${() => component.setMode(null)}></sf-button>
      </div>
    </div>`;
  } // The profile in use is the row's fill alone (owner decisions C08, C106
  // (3): a single choice is the fill, no check); aria-checked says it.
  // A profile the person may change has one «⋯» at its end (owner decision
  // C163 (3)): its menu holds «Переименовать» (F2) and «Удалить…» (Delete);
  // the pencil and the red bin stood on every row.


  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-profile-picker-row" role="menuitemradio" tabindex="-1" data-id=${id}
                   aria-checked=${String(current)} @click=${event => {
    if (!event.target.closest('button, .sf-profile-picker-icon-button')) component.choose(id);
  }}>
    ${icon(kindIcon(profile), 'sf-profile-picker-kind')}
    <span class="sf-profile-picker-text">
      <span class="sf-profile-picker-label">${profile.label ?? id}</span>
      <span class="sf-profile-picker-caption">${profile.shared ? text('shared') : text('personal')}${profile.builtin ? ` · ${text('builtin')}` : ''}</span>
    </span>
    ${may ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-profile-picker-actions">
          ${iconButton(context, {
    icon: 'more_horiz',
    className: 'sf-profile-picker-more',
    popup: true,
    label: `${text('actions')}: ${profile.label ?? id}`,
    title: text('actions'),
    onClick: event => component.openActions(id, event.currentTarget)
  })}
        </span>` : profile.editable === false ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-profile-picker-lock" title=${text('locked')}>${icon('lock')}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
  </div>`;
}

function renderCreate(context) {
  const {
    component,
    state,
    text,
    rights
  } = context;
  const create = rights.create ?? {};

  if (state.mode !== 'create') {
    if (!component.canCreate()) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-profile-picker-row sf-profile-picker-add" role="menuitem" tabindex="-1"
                     @click=${() => component.setMode('create')}>
      ${icon('add', 'sf-profile-picker-kind')}
      <span class="sf-profile-picker-text"><span class="sf-profile-picker-label">${text('newProfile')}</span></span>
    </div>`;
  }

  const shared = create.personal ? state.draft.shared : true;

  const choose = value => {
    component.state = { ...state,
      draft: { ...state.draft,
        shared: value
      }
    };
    component.requestComponentUpdate('draft');
  };

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-profile-picker-form">
    <input class="sf-profile-picker-field" placeholder=${text('name')} aria-label=${text('name')} .value=${state.draft.name}
           @input=${event => {
    state.draft.name = event.target.value;
  }}
           @keydown=${event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      component.submitCreate(event.target.value, shared);
    }
  }}>
    <sf-segmented class="sf-profile-picker-kinds" size=${context.size} full-width aria-label=${text('kind')}
                  items=${JSON.stringify([{
    value: 'personal',
    label: text('personal'),
    icon: 'person',
    disabled: !create.personal
  }, {
    value: 'shared',
    label: text('shared'),
    icon: 'group',
    disabled: !create.shared
  }])}
                  value=${shared ? 'shared' : 'personal'}
                  @change=${event => {
    event.stopPropagation();
    choose(event.detail?.value === 'shared');
  }}></sf-segmented>
    <div class="sf-profile-picker-hint">${fill(text('copyOf'), {
    name: context.currentProfile?.label ?? ''
  })} ${shared ? text('seenByAll') : text('seenByYou')}${// Why a kind cannot be chosen: said under the switch (a disabled
  // segment takes no pointer, so its tooltip never showed).
  !create.personal ? ` ${text('personalTaken')}.` : !create.shared ? ` ${text('sharedDenied')}.` : ''}</div>
    <div class="sf-profile-picker-buttons">
      <sf-button size=${context.size} text=${text('create')}
                 @click=${event => component.submitCreate(event.target.closest('.sf-profile-picker-form').querySelector('input').value, shared)}></sf-button>
      <sf-button size=${context.size} appearance="ghost" scheme="on-surface" text=${text('cancel')} @click=${() => component.setMode(null)}></sf-button>
    </div>
  </div>`;
} // What the open panel holds: a row per profile, the new-profile row or its
// form, the host's refusal and the reset. The same content stands in the
// dropping panel and in the bottom sheet on a phone.


function renderContent(context) {
  const {
    component,
    text
  } = context;
  const current = context.currentProfile;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    ${context.profiles.map(profile => renderRow(context, profile))}
    <div class="sf-profile-picker-separator" role="separator"></div>
    ${renderCreate(context)}
    ${context.message ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<p class="sf-profile-picker-message" role="alert">${context.message}</p>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    ${context.resettable && component.mayChange({ ...current,
    builtin: false
  }) ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-profile-picker-footer">
          <sf-button size=${context.size} appearance="outline" scheme="on-surface" icon-start="restart_alt"
                     text=${text('reset')} @click=${() => component.reset()}></sf-button>
        </div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
  `;
}

const rootClasses = (context, extra = '') => ['sf-profile-picker', `sf-profile-picker--size-${context.size === '1' ? '1' : '1-2'}`, extra, context.rootClass].filter(Boolean).join(' '); // The bottom sheet's body on a phone (owner decisions C163 (4), C157 (5)): the
// Framework's sheet, sf-drawer placement=bottom, draws the head -- the
// picker's name and its close button -- and this is what stands under it,
// the rows (60 under a finger, C49) and the new-profile form in the same sheet.


function renderProfilePickerSheet(context) {
  const {
    component
  } = context;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="${rootClasses(context, 'sf-profile-picker--sheet')}">
    <div class="sf-profile-picker-panel sf-profile-picker-panel--in-sheet" role="menu" aria-label=${context.heading}
         @keydown=${event => component.handleKeyDown(event)}>
      ${context.state.open ? renderContent(context) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    </div>
  </div>`;
}
function renderProfilePickerTemplate(context) {
  const {
    component,
    state,
    text
  } = context;
  const current = context.currentProfile; // The trigger is the standard button (owner decision C163 (2)): sf-button
  // ghost on-surface with the kind's glyph and a chevron, as tall as the
  // toolbar buttons beside it; it was a field-like button of its own.

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div class=${rootClasses(context)}>
      <sf-button class="sf-profile-picker-trigger" size=${context.size} appearance="ghost" scheme="on-surface"
                 icon-start=${kindIcon(current)} icon-end="expand_more"
                 text=${`${context.heading}: ${current?.label ?? ''}`}
                 aria-haspopup="menu" expanded=${state.open ? '' : 'false'} ?disabled=${context.disabled}
                 @click=${() => component.toggle()}></sf-button>
      <div class=${`sf-profile-picker-panel${state.sheet ? ' sf-profile-picker-panel--sheet' : ''}`} role="menu" aria-label=${context.heading}
           ?hidden=${!state.open || state.drawer}
           @keydown=${event => component.handleKeyDown(event)}>
        ${state.open && state.sheet && !state.drawer ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-profile-picker-sheet-head" role="presentation">
          <span class="sf-profile-picker-sheet-title">${context.heading}</span>
          <sf-button-icon class="sf-profile-picker-sheet-close" icon="close" appearance="ghost" scheme="on-surface"
                          aria-label=${text('close')} @click=${() => component.close()}></sf-button-icon>
        </div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        ${state.open && !state.drawer ? renderContent(context) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      </div>
    </div>
  `;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "9b0fd2c3adba"
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

/***/ "9ad70024c464"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-profile-picker for the shim (core/js/aliases.js, standard §16 item 20). mode: same-detail (the shim sends the new and the old name), detail-adds (the new detail holds the old fields), attribute-and-property, host-attribute (no shim), manifest-only (the DOM name does not change), retired (no new name; kept and noted by the component until the date).","component":"sf-profile-picker","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"sf-profile-select","to":"sf-profile-picker-select","kind":"event","component":"sf-profile-picker","since":"2026-10-27","remove_after":"2026-12-01","mode":"detail-adds","section":"vocabulary §7: the DOM name takes the tag","note":"the old name follows with the same detail, which holds the old fields"},{"from":"sf-profile-create","to":"sf-profile-picker-create","kind":"event","component":"sf-profile-picker","since":"2026-10-27","remove_after":"2026-12-01","mode":"detail-adds","section":"vocabulary §7: the DOM name takes the tag","note":"the old name follows with the same detail, which holds the old fields"},{"from":"sf-profile-rename","to":"sf-profile-picker-rename","kind":"event","component":"sf-profile-picker","since":"2026-10-27","remove_after":"2026-12-01","mode":"detail-adds","section":"vocabulary §7: the DOM name takes the tag","note":"the old name follows with the same detail, which holds the old fields"},{"from":"sf-profile-delete","to":"sf-profile-picker-delete","kind":"event","component":"sf-profile-picker","since":"2026-10-27","remove_after":"2026-12-01","mode":"detail-adds","section":"vocabulary §7: the DOM name takes the tag","note":"the old name follows with the same detail, which holds the old fields"},{"from":"sf-profile-reset","to":"sf-profile-picker-reset","kind":"event","component":"sf-profile-picker","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","section":"vocabulary §7: the DOM name takes the tag","note":"the old name follows with the same detail"}]}');

/***/ },

/***/ "816c0ad0728a"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.profile-picker","tag":"sf-profile-picker","version":"1.7.1","kind":"leaf","settings":{"label":{"type":"string","default-from":"runtime.label"},"size":{"type":"enum","values":["1/2","1"],"default":"1"},"resettable":{"type":"boolean","default":false},"message":{"type":"string","default":""},"disabled":{"type":"boolean","default":false},"profiles":{"type":"list","of":{"id":"id","label":"string","shared":"boolean","builtin":"boolean","editable":"boolean"}},"rights":{"type":"object"}},"values":{"current":{"type":"string","default":""}},"events":{"select":{"carries":{"id":"string","ids":"list"}},"create":{"carries":{"label":"string","shared":"boolean","from":"string","kind":{"type":"enum","values":["personal","shared"]}}},"rename":{"carries":{"id":"string","label":"string","title":"string"}},"delete":{"carries":{"id":"string","ids":"list"}},"reset":{"carries":{"id":"string"}}},"actions":{"open":{},"close":{},"toggle":{}},"presentation":{"skeleton":{"file":"skeleton.html","late":["profiles"]}},"css-variables":{"--sf-profile-picker-background-color":{"type":"color","state":"default"},"--sf-profile-picker-border-color":{"type":"color","state":"default"},"--sf-profile-picker-radius":{"type":"length","state":"default"},"--sf-profile-picker-color":{"type":"color","state":"default"},"--sf-profile-picker-panel-background-color":{"type":"color","state":"default"}}}');

/***/ },

/***/ "ad1b3554788b"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Settings profiles","runtime":{"actions":"Actions","builtin":"standard","cancel":"Cancel","close":"Close","copy-of":"A copy of «{name}».","create":"Create","kind":"Who sees the profile","label":"Profile","locked":"You cannot change it","name":"Profile name","name-empty":"Give the profile a name.","new-profile":"New profile…","personal":"Personal","personal-taken":"You already have a personal profile","remove":"Delete","remove-ask":"Delete…","remove-question":"Delete «{name}»?","remove-shared":"It goes for everyone on the site.","rename":"Rename","reset":"Reset to standard","save":"Save","seen-by-all":"Seen by everyone on the site.","seen-by-you":"Seen only by you.","shared":"For everyone","shared-denied":"You cannot make shared profiles"}}');

/***/ },

/***/ "0c5af1be4f82"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Профили настроек","runtime":{"actions":"Действия","builtin":"стандартный","cancel":"Отмена","close":"Закрыть","copy-of":"Копия профиля «{name}».","create":"Создать","kind":"Кому виден профиль","label":"Профиль","locked":"Нет прав на изменение","name":"Название профиля","name-empty":"Дайте профилю название.","new-profile":"Новый профиль…","personal":"Личный","personal-taken":"Личный профиль уже есть","remove":"Удалить","remove-ask":"Удалить…","remove-question":"Удалить «{name}»?","remove-shared":"Он исчезнет у всех на сайте.","rename":"Переименовать","reset":"Сбросить к стандартному","save":"Сохранить","seen-by-all":"Виден всем на сайте.","seen-by-you":"Виден только вам.","shared":"Для всех","shared-denied":"Нет прав на общие профили"}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("ad5bbe113041");
/******/
/******/ })()
;