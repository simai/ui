/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "843ec340b1b8"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SfSettingsMenu: () => (/* binding */ SfSettingsMenu)
/* harmony export */ });
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _core_js_position_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("116963e5e31b");
/* harmony import */ var _core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("bf0cea966575");
/* harmony import */ var _core_js_layer_stack__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("18003344cff0");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("fe83ec210d67");
/* harmony import */ var _js_templates_rows__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("9fbae193ea6e");
/* harmony import */ var _js_templates_parts__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("1675e024ebbb");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("7c78f2280ef9");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("09d34676d34e");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("9a162ac1a701");
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("44c62e8ffa8e");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_position_js__WEBPACK_IMPORTED_MODULE_2__, _core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_3__, _core_js_layer_stack__WEBPACK_IMPORTED_MODULE_4__, _js_templates_default__WEBPACK_IMPORTED_MODULE_5__, _js_templates_rows__WEBPACK_IMPORTED_MODULE_6__, _js_templates_parts__WEBPACK_IMPORTED_MODULE_7__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_position_js__WEBPACK_IMPORTED_MODULE_2__, _core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_3__, _core_js_layer_stack__WEBPACK_IMPORTED_MODULE_4__, _js_templates_default__WEBPACK_IMPORTED_MODULE_5__, _js_templates_rows__WEBPACK_IMPORTED_MODULE_6__, _js_templates_parts__WEBPACK_IMPORTED_MODULE_7__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_position_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_core_js_position_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _core_js_layer_stack__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_4__);
// sf-settings-menu: compact settings -- a reader's theme and text size, a
// table's view options, a chat's settings -- as one menu a page fills with
// data, instead of a popover of buttons and switches made again on each page.
//
// A special case of the context menu. The settings are data (items); the
// component draws them, keeps the values and reports every change, and the
// page decides what a value means. Two arrangements of the same parts are
// its templates (standard simai.smart-component 1.3.13 §6): drill, the
// default, where a choice opens its list in place, and rows, where the
// control stands at the end of the row. Tiles on top are optional.
//
// The popup form is the platform popover in the top layer, positioned against
// its trigger by core/js/position.js as sf-context-menu is, and a surface of
// the shared layer stack (§19, core/js/layer-stack.js through
// core/js/open-surface-mark.js): only the top layer takes Escape and an outside
// press. The inline form is always open, for a panel or a sidebar.
//
// From its component.json (§3, §4, §8): the settings are made by
// core/js/element-manifest.js, open, close, toggle and reset are the actions
// and answer outcomes, the words are the language files'.












const TEMPLATES = {
  default: _js_templates_default__WEBPACK_IMPORTED_MODULE_5__.renderSettingsMenuTemplate,
  rows: _js_templates_rows__WEBPACK_IMPORTED_MODULE_6__.renderSettingsMenuRowsTemplate
};
const TYPES = new Set(['boolean', 'choice', 'range', 'action', 'section', 'divider']); // Two short words: a pill holds a word of eight characters at most.

const SHORT_WORD = 8;
const PLACEMENT = {
  'bottom-end': {
    side: 'block-end',
    align: 'end'
  },
  'bottom-start': {
    side: 'block-end',
    align: 'start'
  },
  'top-end': {
    side: 'block-start',
    align: 'end'
  },
  'top-start': {
    side: 'block-start',
    align: 'start'
  },
  'inline-end': {
    side: 'inline-end',
    align: 'start'
  },
  'inline-start': {
    side: 'inline-start',
    align: 'start'
  }
};
const FOCUSABLE = 'button, a[href], input, select, textarea, [tabindex]';
let sequence = 0; // Prefer the helper Core published; a bundle loaded without core.js still
// positions with its own copy.

const position = () => globalThis.SF?.Position || (_core_js_position_js__WEBPACK_IMPORTED_MODULE_2___default());

const applied = () => ({
  outcome: 'applied'
});

const refused = reason => ({
  outcome: 'refused',
  reason
});

const has = (object, key) => Object.prototype.hasOwnProperty.call(object ?? {}, key);

const SettingsMenuElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_8__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_9__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_10__
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
        reason: reason || 'api'
      });
    },

    toggle() {
      return this._open ? this.runClose({
        reason: 'close'
      }) : this.runOpen();
    },

    reset() {
      return this.runReset();
    }

  }
});

class SfSettingsMenu extends SettingsMenuElement {
  constructor() {
    super();
    this._id = `sf-settings-menu-${++sequence}`;
    this._open = false;
    this._level = null;
    this._current = null;
    this._afterRender = null;
    this.addEventListener('keydown', event => this.onKeyDown(event));
    this.addEventListener('click', event => this.onHostClick(event));
    this.addEventListener('focusin', event => {
      const stop = event.target?.closest?.(`.${_js_templates_parts__WEBPACK_IMPORTED_MODULE_7__.STOP}`);

      if (stop && this.panel()?.contains(stop)) {
        this._current = stop;
        this.syncStops();
      }
    });

    this._onOutsidePress = event => {
      const path = event.composedPath?.() ?? [];
      if (path.includes(this) || path.includes(this.trigger())) return; // A press inside a layer opened above the menu -- its compact select's
      // list, a dialog -- is that layer's (§19.3).

      if ((0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_4__.hasLayerAbove)(this, ['surface', 'modal', 'panel'])) return;
      this.runClose({
        reason: 'outside',
        restoreFocus: false
      });
    }; // A control elsewhere in the page named by `for` opens the panel.


    this._onDocumentClick = event => {
      if (this.inline || !this.for || event.defaultPrevented) return;
      const target = event.target?.closest?.(`#${globalThis.CSS?.escape ? CSS.escape(this.for) : this.for}`);
      if (!target || this.contains(target)) return;
      event.preventDefault();
      if (this._open) this.runClose({
        reason: 'close'
      });else this.runOpen();
    };
  }

  onConnected() {
    super.onConnected?.();
    document.addEventListener('click', this._onDocumentClick, {
      signal: this.sfScope
    });
    this.syncTrigger();
  }

  disconnectedCallback() {
    // Taken out of the page, it closes without asking: nothing is left to keep.
    if (this._open) this.finishClose({
      emit: false,
      restoreFocus: false
    });
    this.closeSelect();
    super.disconnectedCallback?.();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (oldValue === newValue || !this._isMounted) return;
    if (name === 'inline' && this.inline && this._open) this.finishClose({
      reason: 'api',
      restoreFocus: false
    });
    if (name === 'for' || name === 'inline') this.syncTrigger();
  } // ─── templates ──────────────────────────────────────────────────────────


  hasBuiltInTemplate(templateName = this.componentTemplateName) {
    return has(TEMPLATES, templateName);
  }

  template() {
    return (TEMPLATES[this.componentTemplateName] || TEMPLATES.default)(this.templateContext());
  } // ─── data ───────────────────────────────────────────────────────────────
  // One item as the templates read it: typed, its options as strings, its
  // value's label, and the control a choice is drawn with in this template.


  normalize(raw) {
    if (!raw || typeof raw !== 'object') return null;
    const options = Array.isArray(raw.options) ? raw.options.filter(option => option && option.value !== undefined && option.value !== null).map(option => ({
      value: String(option.value),
      label: String(option.label ?? option.value),
      icon: option.icon ? String(option.icon) : ''
    })) : [];
    const type = TYPES.has(raw.type) ? raw.type : raw.type ? '' : options.length ? 'choice' : typeof raw.value === 'boolean' ? 'boolean' : typeof raw.value === 'number' ? 'range' : 'action';
    if (!type) return null;
    if (type === 'section' || type === 'divider') return {
      type,
      key: raw.key ? String(raw.key) : '',
      label: String(raw.label ?? '')
    };
    if (raw.key === undefined || raw.key === null || raw.key === '') return null;
    const item = {
      type,
      key: String(raw.key),
      label: String(raw.label ?? raw.key),
      caption: raw.caption ? String(raw.caption) : '',
      icon: raw.icon ? String(raw.icon) : '',
      options,
      disabled: raw.disabled === true,
      tile: raw.tile === true && (type === 'boolean' || type === 'choice'),
      control: '',
      hasDefault: has(raw, 'default')
    };

    if (type === 'boolean') {
      item.value = raw.value === true || raw.value === 'true';
      item.default = raw.default === true || raw.default === 'true';
      item.valueLabel = this.sfWord(item.value ? 'on' : 'off');
      item.on = item.value;
    } else if (type === 'choice') {
      if (!options.length) return null;
      const value = raw.value === undefined || raw.value === null ? options[0].value : String(raw.value);
      const chosen = options.find(option => option.value === value);
      item.value = value;
      item.default = item.hasDefault ? String(raw.default) : options[0].value;
      item.valueLabel = chosen ? chosen.label : value;
      item.valueIcon = chosen?.icon || '';
      item.on = value !== item.default;
      item.control = this.controlFor(raw.control, options);
    } else if (type === 'range') {
      item.min = Number.isFinite(Number(raw.min)) ? Number(raw.min) : 0;
      item.max = Number.isFinite(Number(raw.max)) ? Number(raw.max) : 100;
      item.step = Number.isFinite(Number(raw.step)) && Number(raw.step) > 0 ? Number(raw.step) : 1;
      const value = Number(raw.value);
      item.value = Math.min(item.max, Math.max(item.min, Number.isFinite(value) ? value : item.min));
      item.default = item.hasDefault ? Number(raw.default) : item.value;
      item.unit = raw.unit ? String(raw.unit) : '';
      item.valueLabel = `${item.value}${item.unit}`;
    }

    return item;
  } // How a choice is drawn (component.json x-decisions): drill opens it in
  // place; rows draws pills for up to three icons or two short words, else a
  // compact select. A page may name the form.


  controlFor(asked, options) {
    const rows = this.componentTemplateName === 'rows';
    if (asked === 'pills' || asked === 'drill') return asked;
    if (asked === 'select') return rows ? 'select' : 'drill';
    if (!rows) return 'drill';
    const icons = options.length <= 3 && options.every(option => option.icon);
    const words = options.length <= 2 && options.every(option => [...option.label].length <= SHORT_WORD);
    return icons || words ? 'pills' : 'select';
  }

  allItems() {
    return (Array.isArray(this.items) ? this.items : []).map(raw => this.normalize(raw)).filter(Boolean);
  }

  item(key) {
    return this.allItems().find(item => item.key === key && item.type !== 'section' && item.type !== 'divider') ?? null;
  } // §4: every item's value by its key.


  get values() {
    return Object.fromEntries(this.allItems().filter(item => item.type === 'boolean' || item.type === 'choice' || item.type === 'range').map(item => [item.key, item.value]));
  } // The page's items with one value changed: the same entries, so what the
  // page put in them stays.


  writeValues(next) {
    const list = Array.isArray(this.items) ? this.items : [];
    this.items = list.map(raw => raw && has(next, String(raw.key)) ? { ...raw,
      value: next[String(raw.key)]
    } : raw);
  } // ─── changing a value ───────────────────────────────────────────────────
  // A person's change is a request (sf-settings-menu-change, cancelable);
  // the fact (sf-settings-menu-changed) follows once the value is kept. A
  // cancelled change leaves the value -- and a native control the person
  // moved is put back.


  requestChange(key, value, {
    control = null
  } = {}) {
    const item = this.item(key);
    if (!item || item.disabled || item.type === 'action') return refused('unknown');
    const next = item.type === 'boolean' ? Boolean(value) : item.type === 'range' ? Number(value) : String(value);
    const previous = item.value;
    if (next === previous) return applied();
    if (item.type === 'choice' && !item.options.some(option => option.value === next)) return refused('unknown');

    if (!this.sfEmit('change', {
      key,
      value: next,
      previous
    }, {
      cancelable: true
    })) {
      if (control?.type === 'checkbox') control.checked = Boolean(previous);else if (control?.type === 'range') control.value = String(previous);
      this.requestComponentUpdate('items');
      return refused('prevented');
    }

    this.writeValues({
      [key]: next
    });
    this.sfEmit('changed', {
      key,
      value: next,
      previous
    });
    return applied();
  }

  toggleBoolean(key, control) {
    const item = this.item(key);
    return this.requestChange(key, control ? control.checked : !item?.value, {
      control
    });
  } // A range shows its value while it moves and asks once, when it is let go.


  previewRange(key, control) {
    const item = this.item(key);
    const label = control?.closest('.sf-settings-menu-row')?.querySelector('.sf-settings-menu-range-value');
    if (item && label) label.textContent = `${control.value}${item.unit}`;
  }

  commitRange(key, control) {
    return this.requestChange(key, control.value, {
      control
    });
  } // An option chosen in the list a row opened: the panel goes back to the
  // rows, the focus to the row it came from.


  pick(key, value) {
    const result = this.requestChange(key, value);
    if (result.outcome === 'applied') this.back();
    return result;
  }

  pressTile(key) {
    const item = this.item(key);
    if (!item || item.disabled) return refused('unknown');
    if (item.type === 'boolean') return this.requestChange(key, !item.value);
    if (item.options.length > 3) return this.drillIn(key);
    const at = item.options.findIndex(option => option.value === item.value);
    return this.requestChange(key, item.options[(at + 1) % item.options.length].value);
  } // An action row: the page does the action (vocabulary §5 apply, §18.3); a
  // popup closes unless a listener cancelled the request to keep it.


  chooseAction(key) {
    const item = this.item(key);
    if (!item || item.disabled) return refused('unknown');
    const allowed = this.sfEmit('apply', {
      action: key,
      scope: 'entry',
      ids: [key]
    }, {
      cancelable: true
    });
    if (allowed && this._open) this.runClose({
      reason: 'api'
    });
    return allowed ? applied() : refused('prevented');
  } // The action reset: the items that declare a default and differ from it.


  runReset() {
    const changing = this.allItems().filter(item => item.hasDefault && item.value !== item.default);
    const keys = changing.map(item => item.key);
    if (!this.sfEmit('reset', {
      keys
    }, {
      cancelable: true
    })) return refused('prevented');
    if (!keys.length) return applied();
    this.writeValues(Object.fromEntries(changing.map(item => [item.key, item.default])));

    for (const item of changing) this.sfEmit('changed', {
      key: item.key,
      value: item.default,
      previous: item.value
    });

    return applied();
  } // ─── the list in place ──────────────────────────────────────────────────


  drillIn(key) {
    const item = this.item(key);
    if (!item || item.type !== 'choice' || item.disabled) return refused('unknown');
    this.closeSelect();
    this._level = key;
    this.sfHostState('data-level', key);
    this.focusAfterRender(() => {
      const options = this.stops();
      return options.find(stop => stop.getAttribute('aria-selected') === 'true') ?? options[0];
    });
    this.requestComponentUpdate('level');
    return applied();
  }

  back() {
    const key = this._level;
    if (!key) return refused('top');
    this._level = null;
    this.sfHostState('data-level', null);
    this.focusAfterRender(() => this.stops().find(stop => stop.dataset.sfKey === key) ?? this.stops()[0]);
    this.requestComponentUpdate('level');
    return applied();
  }

  focusAfterRender(pick) {
    this._afterRender = () => {
      const target = pick();
      if (!target) return;
      this._current = target;
      this.syncStops(); // Only a panel that held the focus moves it: an inline menu changed by
      // a pointer leaves the focus where the person put it.

      if (this.panel()?.contains(document.activeElement) || this._open || document.activeElement === document.body) {
        target.focus({
          preventScroll: true
        });
      }
    };
  } // ─── the compact select's small menu (rows) ─────────────────────────────


  async openSelect(button, key, event) {
    const item = this.item(key);
    if (!item || item.disabled) return;

    if (this._select?.isOpen && this._select._sfSettingsKey === key) {
      this._select.close({
        reason: 'close'
      });

      return;
    }

    this.closeSelect();
    const menu = document.createElement('sf-context-menu');
    menu._sfSettingsKey = key;
    menu.setAttribute('popup', '');
    menu.setAttribute('aria-label', item.label);
    menu.entries = item.options.map(option => ({
      id: option.value,
      text: option.label,
      icon: option.icon || undefined,
      kind: 'radio',
      checked: option.value === item.value
    })); // The choice is this menu's to ask for; the list closes once it is kept.

    menu.addEventListener('sf-context-menu-select', selected => {
      selected.stopPropagation();
      if (this.requestChange(key, selected.detail?.id).outcome !== 'applied') selected.preventDefault();
    });
    menu.addEventListener('sf-context-menu-closed', () => {
      if (this._select === menu) this._select = null;
      menu.remove();
    });
    (this.closest('dialog[open]') || document.body).append(menu);
    (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_4__.carryLayerOrigin)(menu, this);
    this._select = menu;
    await customElements.whenDefined('sf-context-menu');
    if (this._select !== menu) return;
    await menu.openFor(button, {
      side: 'block-end',
      align: 'end',
      focus: event?.detail === 0 ? 'first' : 'none'
    });
  }

  closeSelect() {
    const menu = this._select;
    if (!menu) return;
    this._select = null;
    if (menu.isOpen) menu.close({
      restoreFocus: false,
      ask: false
    });
    menu.remove();
  } // ─── the popup ──────────────────────────────────────────────────────────


  panel() {
    return this.querySelector(':scope > .sf-settings-menu');
  } // What opens the panel: the trigger slot's element, or the page's control
  // named by `for`.


  trigger() {
    if (this.inline) return null;
    const slotted = [].concat(this._liveSlotNodes?.get('trigger') || []).find(node => node instanceof Element);
    if (slotted) return slotted;
    return this.for ? document.getElementById(this.for) : null;
  } // The element that says it opens a dialog: a native control itself, an
  // sf-icon-button or sf-button host (it forwards aria-* to its button), or
  // the first control inside.


  triggerControl() {
    const trigger = this.trigger();
    if (!trigger) return null;
    if (trigger.matches(FOCUSABLE) || trigger.localName.includes('-')) return trigger;
    return trigger.querySelector(FOCUSABLE) ?? trigger;
  }

  focusableTrigger() {
    const control = this.triggerControl();
    if (!control) return null;
    return control.localName.includes('-') ? control.querySelector(FOCUSABLE) ?? control : control;
  }

  syncTrigger() {
    const control = this.triggerControl();
    if (!control) return;
    control.setAttribute('aria-haspopup', 'dialog');
    control.setAttribute('aria-expanded', String(this._open));
    control.setAttribute('aria-controls', `${this._id}-panel`);
  }

  onHostClick(event) {
    if (this.inline) return;
    const path = event.composedPath?.() ?? [];
    const trigger = [].concat(this._liveSlotNodes?.get('trigger') || []).find(node => node instanceof Element);
    if (!trigger || !path.includes(trigger)) return;
    event.preventDefault();
    if (this._open) this.runClose({
      reason: 'close'
    });else this.runOpen();
  } // The action open.


  runOpen() {
    if (this.inline) return refused('inline');
    if (this._open) return applied();
    const anchor = this.trigger();
    if (!anchor) return refused('no-trigger');
    if (!this.sfEmit('open', {}, {
      cancelable: true
    })) return refused('prevented');
    const active = document.activeElement;
    this._returnTo = active instanceof HTMLElement && active !== document.body && active !== document.documentElement && !this.panel()?.contains(active) ? active : this.focusableTrigger();
    this._open = true;
    this._level = null;
    this._current = null;
    this.sfHostState('data-open', true);
    this.sfHostState('data-level', null);
    this.syncTrigger();
    this.requestComponentUpdate('open');
    this.whenRendered(() => this.placeOpen(anchor));
    return applied();
  }

  placeOpen(anchor) {
    const surface = this.panel();
    if (!this._open || !surface) return;
    surface.classList.add('sf-settings-menu--open'); // The top layer, where the platform has it: above every stacking context
    // and every clipping box.

    if (typeof surface.showPopover === 'function') {
      surface.setAttribute('popover', 'manual');
      if (!surface.matches(':popover-open')) surface.showPopover();
    } else {
      surface.style.zIndex = 'var(--sf-z-index-9)';
    }

    const {
      side,
      align
    } = PLACEMENT[this.placement] ?? PLACEMENT['bottom-end'];
    this._position?.stop();
    this._position = position().anchor(anchor, surface, {
      side,
      align,
      flip: true,
      shift: true,
      fitHeight: true
    }); // A surface of the one stack (§19.1): the mark makes a drawer or a modal
    // under it stand back, and the stack hands it Escape while it is on top.

    (0,_core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_3__.holdOpenSurfaceMark)(this, true);
    (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_4__.updateLayer)(this, {
      root: () => this.panel(),
      onEscape: event => this.onLayerEscape(event)
    });
    document.addEventListener('pointerdown', this._onOutsidePress, true);
    this.syncStops();
    this.stops()[0]?.focus({
      preventScroll: true
    });
    this.sfEmit('opened', {});
  } // The action close; reason by §19.3.


  runClose({
    reason = 'api',
    restoreFocus = true
  } = {}) {
    if (!this._open) return refused('closed');
    if (!this.sfEmit('close', {
      reason,
      unsaved: false
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
    this._open = false;
    this.closeSelect();
    this._position?.stop();
    this._position = null;
    document.removeEventListener('pointerdown', this._onOutsidePress, true);
    (0,_core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_3__.holdOpenSurfaceMark)(this, false);
    const surface = this.panel();

    if (surface) {
      if (surface.matches?.(':popover-open')) surface.hidePopover();
      surface.removeAttribute('popover');
      surface.classList.remove('sf-settings-menu--open');
      surface.style.removeProperty('z-index');
    }

    this._level = null;
    this.sfHostState('data-open', false);
    this.sfHostState('data-level', null);
    this.syncTrigger();
    this.requestComponentUpdate('close');

    if (restoreFocus) {
      // Focus goes back to the control that opened it (§19.2).
      const target = this._returnTo?.isConnected ? this._returnTo : this.focusableTrigger();
      target?.focus?.({
        preventScroll: true
      });
    }

    if (emit) this.sfEmit('closed', {
      reason
    });
  } // Escape through the stack, wherever the focus is: back from a list first.


  onLayerEscape(event) {
    if (!this._open || event.defaultPrevented) return false;
    if (this._level) this.back();else this.runClose({
      reason: 'escape'
    });
    return true;
  } // ─── keyboard ───────────────────────────────────────────────────────────
  // The stops of the level shown, in order: one per control.


  stops() {
    const panel = this.panel();
    if (!panel) return [];
    return Array.from(panel.querySelectorAll(`.${_js_templates_parts__WEBPACK_IMPORTED_MODULE_7__.STOP}`)).filter(stop => !stop.disabled && stop.getClientRects().length > 0);
  } // One stop in the tab order: the one last focused, else the chosen pill or
  // option, else the first.


  syncStops() {
    const all = this.panel() ? Array.from(this.panel().querySelectorAll(`.${_js_templates_parts__WEBPACK_IMPORTED_MODULE_7__.STOP}`)) : [];
    const stops = this.stops();

    if (!stops.includes(this._current)) {
      this._current = stops.find(stop => stop.getAttribute('aria-selected') === 'true') ?? stops[0] ?? null;
    }

    for (const stop of all) stop.tabIndex = stop === this._current ? 0 : -1;
  }

  afterRender(changed) {
    if (typeof changed === 'function') return super.afterRender(changed);
    super.afterRender?.(changed);
    this.syncStops();
    const run = this._afterRender;
    this._afterRender = null;
    run?.();
    return undefined;
  } // The row a stop is in, and the stop a row is entered at: its pressed pill
  // or chosen option, else its first.


  rowOf(stop) {
    return stop?.dataset.sfRow ?? null;
  }

  entryOf(row, stops) {
    const inRow = stops.filter(stop => this.rowOf(stop) === row);
    return inRow.find(stop => stop.getAttribute('aria-pressed') === 'true') ?? inRow[0];
  }

  moveRow(from, step, stops) {
    const rows = [...new Set(stops.map(stop => this.rowOf(stop)))];
    if (!rows.length) return null;
    let at = rows.indexOf(this.rowOf(from));
    if (step === 'first') at = 0;else if (step === 'last') at = rows.length - 1;else at = at < 0 ? 0 : (at + step + rows.length) % rows.length;
    return this.entryOf(rows[at], stops);
  }

  onKeyDown(event) {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
    const panel = this.panel();
    if (!panel || !panel.contains(event.target)) return;
    const stops = this.stops();
    const stop = event.target.closest?.(`.${_js_templates_parts__WEBPACK_IMPORTED_MODULE_7__.STOP}`);
    const rtl = getComputedStyle(panel).direction === 'rtl';
    const inward = rtl ? 'ArrowLeft' : 'ArrowRight';
    const outward = rtl ? 'ArrowRight' : 'ArrowLeft';
    const inRow = stop ? stops.filter(one => this.rowOf(one) === this.rowOf(stop)) : [];
    const range = stop?.type === 'range';

    const go = target => {
      event.preventDefault();
      event.stopPropagation();

      if (target) {
        this._current = target;
        this.syncStops();
        target.focus();
      }
    };

    switch (event.key) {
      case 'ArrowDown':
        if (!event.shiftKey) go(this.moveRow(stop, 1, stops));
        return;

      case 'ArrowUp':
        if (!event.shiftKey) go(this.moveRow(stop, -1, stops));
        return;

      case 'Home':
        if (!range) go(this.moveRow(stop, 'first', stops));
        return;

      case 'End':
        if (!range) go(this.moveRow(stop, 'last', stops));
        return;

      case 'Escape':
        if (this._level) {
          go(null);
          this.back();
        } else if (this._open) {
          go(null);
          this.runClose({
            reason: 'escape'
          });
        }

        return;

      case 'Tab':
        // Tab leaves the popup for the page: the menu does not trap it.
        if (this._open) this.runClose({
          reason: 'api'
        });
        return;

      case 'Enter':
        // A switch is a checkbox: Space toggles it natively, Enter here.
        if (stop?.type === 'checkbox') {
          event.preventDefault();
          stop.click();
        }

        return;

      default:
        break;
    }

    if (range || !stop) return;

    if (event.key === inward) {
      if (inRow.length > 1) go(inRow[(inRow.indexOf(stop) + 1) % inRow.length]);else if (stop.classList.contains('sf-settings-menu-row--drill')) {
        go(null);
        this.drillIn(stop.dataset.sfKey);
      }
    } else if (event.key === outward) {
      if (inRow.length > 1) go(inRow[(inRow.indexOf(stop) + inRow.length - 1) % inRow.length]);else if (this._level) {
        go(null);
        this.back();
      } else if (this._open) {
        go(null);
        this.runClose({
          reason: 'api'
        });
      }
    }
  } // ─── drawing ────────────────────────────────────────────────────────────


  templateContext() {
    const all = this.allItems();
    const level = this._level ? all.find(item => item.key === this._level && item.type === 'choice') ?? null : null;
    const tiles = all.filter(item => item.tile);
    const items = all.filter(item => !item.tile); // Row numbers for the keyboard: the tiles are one row, then each control.

    let row = tiles.length ? 1 : 0;

    for (const tile of tiles) tile.row = 0;

    for (const item of items) if (item.type !== 'section' && item.type !== 'divider') item.row = row++;

    return this.createTemplateContext({ ...this.getPropsContext(),
      component: this,
      id: this._id,
      items,
      tiles,
      level,
      lead: items.some(item => item.icon && item.type !== 'section' && item.type !== 'divider'),
      resetRow: row,
      open: this._open,
      inline: this.inline,
      size: this.size,
      label: this.label,
      heading: this.heading,
      resettable: this.resettable,
      resetLabel: this.resetLabel,
      backLabel: this.backLabel,
      trigger: this.inline ? '' : this.getSlotContent('trigger'),
      rootClass: this.getRootClass(),
      rootStyle: this.getRootStyle()
    });
  }

}

SfSettingsMenu.define('sf-settings-menu');

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "fe83ec210d67"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderSettingsMenuTemplate: () => (/* binding */ renderSettingsMenuTemplate)
/* harmony export */ });
/* harmony import */ var _parts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("1675e024ebbb");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_parts__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
_parts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
 // drill, the default arrangement (owner, 2026-10-30): each row is a leading
// icon, the setting's name and its current value under the name in small
// dimmed text, and a chevron at the end. Pressing it opens the choice list in
// place -- the same panel, a head with the way back, a check mark on the
// chosen option. A boolean stays in its row as a switch. A long name wraps, a
// long value ends in an ellipsis with the whole of it in title, and the panel
// keeps its width.

function renderSettingsMenuTemplate(context) {
  return (0,_parts__WEBPACK_IMPORTED_MODULE_0__.renderPanel)(context, 'drill');
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "1675e024ebbb"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   STOP: () => (/* binding */ STOP),
/* harmony export */   icon: () => (/* binding */ icon),
/* harmony export */   renderActionRow: () => (/* binding */ renderActionRow),
/* harmony export */   renderDivider: () => (/* binding */ renderDivider),
/* harmony export */   renderDrillRow: () => (/* binding */ renderDrillRow),
/* harmony export */   renderHeading: () => (/* binding */ renderHeading),
/* harmony export */   renderLevel: () => (/* binding */ renderLevel),
/* harmony export */   renderPanel: () => (/* binding */ renderPanel),
/* harmony export */   renderPillsRow: () => (/* binding */ renderPillsRow),
/* harmony export */   renderRangeRow: () => (/* binding */ renderRangeRow),
/* harmony export */   renderReset: () => (/* binding */ renderReset),
/* harmony export */   renderRow: () => (/* binding */ renderRow),
/* harmony export */   renderSection: () => (/* binding */ renderSection),
/* harmony export */   renderSelectRow: () => (/* binding */ renderSelectRow),
/* harmony export */   renderSwitchRow: () => (/* binding */ renderSwitchRow),
/* harmony export */   renderText: () => (/* binding */ renderText),
/* harmony export */   renderTiles: () => (/* binding */ renderTiles)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
 // The parts both templates of sf-settings-menu draw: the panel around them,
// its heading, the tiles on top, the choice list a row opens in place, the
// rows every arrangement shares (a switch, a range, an action, a section, a
// divider) and the reset row. The two templates differ only in how a choice
// row looks (default.js: the value under the name and a chevron; rows.js:
// the control at the end).
//
// Every focusable part is a native control with its own role and carries
// the class sf-settings-menu-stop and data-sf-row, the row it belongs to:
// index.js walks the rows with the arrow keys and keeps one stop in the tab
// order.

const STOP = 'sf-settings-menu-stop';
function icon(name, className = '') {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class="sf-icon ${className}" aria-hidden="true">${name}</i>`;
} // The leading place of a row: its icon, or an empty place of the same width
// when another row of the level has one, so the names start on one line.

function lead(item, context) {
  if (item.icon) return icon(item.icon, 'sf-settings-menu-row-icon');
  return context.lead ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-settings-menu-row-icon" aria-hidden="true"></span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
}

function renderText(item, context, {
  value = false
} = {}) {
  const nameId = `${context.id}-name-${item.key}`;
  const captionId = `${context.id}-caption-${item.key}`;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-settings-menu-row-text">
    <span class="sf-settings-menu-row-name" id=${nameId}>${item.label}</span>
    ${value ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-settings-menu-row-value" title=${item.valueLabel}>${item.valueLabel}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    ${item.caption ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-settings-menu-row-caption" id=${captionId}>${item.caption}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
  </span>`;
}

const ids = (item, context) => ({
  name: `${context.id}-name-${item.key}`,
  caption: item.caption ? `${context.id}-caption-${item.key}` : undefined
}); // A boolean: the Framework switch (component switch) at the end of a row the
// whole of which is its label, so a press anywhere on the row toggles it.


function renderSwitchRow(item, context) {
  const {
    component
  } = context;
  const {
    name,
    caption
  } = ids(item, context);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<label class="sf-settings-menu-row sf-settings-menu-row--switch ${item.disabled ? 'sf-settings-menu-row--disabled' : ''}" data-sf-key=${item.key}>
    ${lead(item, context)}
    ${renderText(item, context)}
    <span class="sf-switch sf-switch--size-1/2 sf-settings-menu-switch ${item.disabled ? 'disabled' : ''}">
      <span class="sf-switch-toggler">
        <input type="checkbox" role="switch" class=${STOP} data-sf-row=${item.row} tabindex="-1"
          .checked=${Boolean(item.value)} ?disabled=${item.disabled}
          aria-labelledby=${name} aria-describedby=${caption ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          @change=${event => component.toggleBoolean(item.key, event.target)}>
        <span class="sf-switch-inner" aria-hidden="true"></span>
      </span>
    </span>
  </label>`;
} // A number in a range: the native slider, the value written after it.

function renderRangeRow(item, context) {
  const {
    component
  } = context;
  const {
    name,
    caption
  } = ids(item, context);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-settings-menu-row sf-settings-menu-row--range ${item.disabled ? 'sf-settings-menu-row--disabled' : ''}" data-sf-key=${item.key}>
    ${lead(item, context)}
    <span class="sf-settings-menu-row-main">
    ${renderText(item, context)}
    <span class="sf-settings-menu-row-control">
      <input type="range" class="sf-settings-menu-range ${STOP}" data-sf-row=${item.row} tabindex="-1"
        min=${item.min} max=${item.max} step=${item.step} .value=${String(item.value)} ?disabled=${item.disabled}
        aria-labelledby=${name} aria-describedby=${caption ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing} aria-valuetext=${item.valueLabel}
        @input=${event => component.previewRange(item.key, event.target)}
        @change=${event => component.commitRange(item.key, event.target)}>
      <span class="sf-settings-menu-range-value" aria-hidden="true">${item.valueLabel}</span>
    </span>
    </span>
  </div>`;
} // An action: a row that is one button; the page does the action.

function renderActionRow(item, context) {
  const {
    component
  } = context;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<button type="button" class="sf-settings-menu-row sf-settings-menu-row--action ${STOP}" data-sf-row=${item.row} data-sf-key=${item.key}
    tabindex="-1" ?disabled=${item.disabled} @click=${() => component.chooseAction(item.key)}>
    ${lead(item, context)}
    ${renderText(item, context)}
  </button>`;
} // A choice drawn in place of a list: the row is one button with the current
// value under the name, ending in a chevron; it opens the list in place.

function renderDrillRow(item, context) {
  const {
    component
  } = context;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<button type="button" class="sf-settings-menu-row sf-settings-menu-row--drill ${STOP}" data-sf-row=${item.row} data-sf-key=${item.key}
    tabindex="-1" ?disabled=${item.disabled} @click=${() => component.drillIn(item.key)}>
    ${lead(item, context)}
    ${renderText(item, context, {
    value: true
  })}
    ${icon('chevron_right', 'sf-settings-menu-row-chevron')}
  </button>`;
} // A choice of up to three icons or two short words: quiet pills without a
// frame, the chosen one on a soft fill. Toggle buttons in a group named by
// the row.

function renderPillsRow(item, context) {
  const {
    component
  } = context;
  const {
    name,
    caption
  } = ids(item, context);
  const iconsOnly = item.options.every(option => option.icon);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-settings-menu-row sf-settings-menu-row--pills ${item.disabled ? 'sf-settings-menu-row--disabled' : ''}" data-sf-key=${item.key}>
    ${lead(item, context)}
    <span class="sf-settings-menu-row-main">
    ${renderText(item, context)}
    <span class="sf-settings-menu-pills ${iconsOnly ? 'sf-settings-menu-pills--icons' : ''}" role="group" aria-labelledby=${name} aria-describedby=${caption ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
      ${item.options.map(option => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<button type="button" class="sf-settings-menu-pill ${STOP}" data-sf-row=${item.row} tabindex="-1"
        aria-pressed=${String(option.value === item.value)} ?disabled=${item.disabled}
        aria-label=${iconsOnly ? option.label : lit__WEBPACK_IMPORTED_MODULE_0__.nothing} title=${iconsOnly ? option.label : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        @click=${() => component.requestChange(item.key, option.value)}>${iconsOnly ? icon(option.icon) : option.label}</button>`)}
    </span>
    </span>
  </div>`;
} // A choice of more or longer options in rows: a compact select «value ⇕»
// that opens a small sf-context-menu of the options against itself.

function renderSelectRow(item, context) {
  const {
    component
  } = context;
  const {
    name,
    caption
  } = ids(item, context);
  const valueId = `${context.id}-value-${item.key}`;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-settings-menu-row sf-settings-menu-row--select ${item.disabled ? 'sf-settings-menu-row--disabled' : ''}" data-sf-key=${item.key}>
    ${lead(item, context)}
    <span class="sf-settings-menu-row-main">
    ${renderText(item, context)}
    <button type="button" class="sf-settings-menu-select ${STOP}" data-sf-row=${item.row} tabindex="-1"
      aria-haspopup="menu" aria-expanded="false" ?disabled=${item.disabled}
      aria-labelledby="${name} ${valueId}" aria-describedby=${caption ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing} title=${item.valueLabel}
      @click=${event => component.openSelect(event.currentTarget, item.key, event)}>
      <span class="sf-settings-menu-select-text" id=${valueId}>${item.valueLabel}</span>
      ${icon('unfold_more', 'sf-settings-menu-select-icon')}
    </button>
    </span>
  </div>`;
}
function renderSection(item) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-settings-menu-section" role="presentation">${item.label}</div>`;
}
function renderDivider() {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-settings-menu-divider" role="separator"></div>`;
}
function renderHeading(context) {
  if (!context.heading) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-settings-menu-head">
    <span class="sf-settings-menu-heading" id=${`${context.id}-heading`}>${context.label}</span>
  </div>`;
} // The tiles on top: one press toggles a boolean, cycles a short choice or
// opens a long one in place.

function renderTiles(context) {
  const {
    tiles,
    component
  } = context;
  if (!tiles.length) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-settings-menu-tiles sf-settings-menu-tiles--${tiles.length === 4 ? 2 : Math.min(tiles.length, 3)}" role="group" aria-label=${context.label}>
    ${tiles.map(item => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<button type="button" class="sf-settings-menu-tile ${item.on ? 'sf-settings-menu-tile--on' : ''} ${STOP}"
      data-sf-row=${item.row} data-sf-key=${item.key} tabindex="-1" ?disabled=${item.disabled}
      aria-pressed=${item.type === 'boolean' ? String(Boolean(item.value)) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      aria-label=${`${item.label}: ${item.valueLabel}`}
      @click=${() => component.pressTile(item.key)}>
      ${icon(item.valueIcon || item.icon || 'tune', 'sf-settings-menu-tile-icon')}
      <span class="sf-settings-menu-tile-name">${item.label}</span>
      <span class="sf-settings-menu-tile-value" title=${item.valueLabel}>${item.valueLabel}</span>
    </button>`)}
  </div>`;
}
function renderReset(context) {
  if (!context.resettable) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const {
    component
  } = context;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${renderDivider()}<button type="button" class="sf-settings-menu-row sf-settings-menu-row--action sf-settings-menu-row--reset ${STOP}"
    data-sf-row=${context.resetRow} data-sf-key="" tabindex="-1" @click=${() => component.reset()}>
    ${icon('restart_alt', 'sf-settings-menu-row-icon')}
    <span class="sf-settings-menu-row-text"><span class="sf-settings-menu-row-name">${context.resetLabel}</span></span>
  </button>`;
} // The list a choice opens in place: the same panel, a head with the way back
// and the setting's name, then the options with a check mark on the chosen.

function renderLevel(context) {
  const {
    level: item,
    component
  } = context;
  const titleId = `${context.id}-level-title`;
  const lead = item.options.some(option => option.icon);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-settings-menu-level-head">
      <sf-icon-button class="sf-settings-menu-back" icon="arrow_back" size=${context.size} appearance="link" scheme="on-surface"
        aria-label=${context.backLabel} title=${context.backLabel} @click=${() => component.back()}></sf-icon-button>
      <span class="sf-settings-menu-level-title" id=${titleId}>${item.label}</span>
    </div>
    <div class="sf-settings-menu-options" role="listbox" aria-labelledby=${titleId}>
      ${item.options.map((option, at) => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<button type="button" role="option" class="sf-settings-menu-option ${STOP}"
        data-sf-row=${at} data-sf-value=${option.value} tabindex="-1" aria-selected=${String(option.value === item.value)}
        @click=${() => component.pick(item.key, option.value)}>
        ${option.icon ? icon(option.icon, 'sf-settings-menu-row-icon') : lead ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-settings-menu-row-icon" aria-hidden="true"></span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        <span class="sf-settings-menu-row-text"><span class="sf-settings-menu-row-name">${option.label}</span></span>
        <span class="sf-settings-menu-option-check">${option.value === item.value ? icon('check') : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}</span>
      </button>`)}
    </div>`;
} // One row by its type; a choice by the control the template chose for it.

function renderRow(item, context) {
  switch (item.type) {
    case 'section':
      return renderSection(item);

    case 'divider':
      return renderDivider();

    case 'boolean':
      return renderSwitchRow(item, context);

    case 'range':
      return renderRangeRow(item, context);

    case 'action':
      return renderActionRow(item, context);

    case 'choice':
      if (item.control === 'pills') return renderPillsRow(item, context);
      if (item.control === 'select') return renderSelectRow(item, context);
      return renderDrillRow(item, context);

    default:
      return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  }
} // The panel: a dialog named by its heading when it pops up from a trigger, a
// group when it stands inline. The trigger stays where the page wrote it.

function renderPanel(context, arrangement) {
  const classes = ['sf-settings-menu', `sf-settings-menu--${arrangement}`, `sf-settings-menu--size-${context.size === '1' ? '1' : 'half'}`, context.inline ? 'sf-settings-menu--inline' : 'sf-settings-menu--popup', context.open ? 'sf-settings-menu--open' : '', context.level ? 'sf-settings-menu--level' : '', context.rootClass].filter(Boolean).join(' ');
  const named = context.heading && !context.level;
  const body = context.level ? renderLevel(context) : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${renderHeading(context)}${renderTiles(context)}${context.items.map(item => renderRow(item, context))}${renderReset(context)}`;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${context.trigger}<div class=${classes} id=${`${context.id}-panel`}
    role=${context.inline ? 'group' : 'dialog'}
    aria-labelledby=${named ? `${context.id}-heading` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    aria-label=${named ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : context.label}
    style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>${body}</div>`;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "9fbae193ea6e"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderSettingsMenuRowsTemplate: () => (/* binding */ renderSettingsMenuRowsTemplate)
/* harmony export */ });
/* harmony import */ var _parts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("1675e024ebbb");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_parts__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
_parts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
 // rows: the name (and a caption) at the start of the row, the control at
// the end -- a switch for a boolean, quiet pills for up to three icons or two
// short words, else a compact select «value ⇕» that opens a small menu. A
// long name takes the whole line and the control drops under it.

function renderSettingsMenuRowsTemplate(context) {
  return (0,_parts__WEBPACK_IMPORTED_MODULE_0__.renderPanel)(context, 'rows');
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "44c62e8ffa8e"
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

/***/ "7c78f2280ef9"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.settings-menu","tag":"sf-settings-menu","version":"1.0.0","kind":"leaf","settings":{"items":{"type":"list","default":[],"of":{"key":"string","type":{"type":"enum","values":["boolean","choice","range","action","section","divider"]},"label":"string","caption":{"type":"string","optional":true},"icon":{"type":"icon","optional":true},"options":{"type":"list","optional":true,"of":{"value":"string","label":"string","icon":{"type":"icon","optional":true}}},"value":{"type":"string","optional":true},"default":{"type":"string","optional":true},"disabled":{"type":"boolean","optional":true},"tile":{"type":"boolean","optional":true},"control":{"type":"enum","optional":true,"values":["drill","pills","select"]},"min":{"type":"number","optional":true},"max":{"type":"number","optional":true},"step":{"type":"number","optional":true},"unit":{"type":"string","optional":true}}},"label":{"type":"string","default-from":"runtime.label"},"heading":{"type":"boolean","default":true},"inline":{"type":"boolean","default":false},"for":{"type":"string","default":""},"placement":{"type":"enum","values":["bottom-end","bottom-start","top-end","top-start","inline-end","inline-start"],"default":"bottom-end"},"size":{"type":"enum","values":["1/2","1"],"default":"1/2"},"resettable":{"type":"boolean","default":false},"reset-label":{"type":"string","default-from":"runtime.reset-label"},"back-label":{"type":"string","default-from":"runtime.back-label"}},"values":{"values":{"type":"object"}},"events":{"change":{"carries":{"key":"string","value":"string","previous":"string"},"cancelable":true,"x-native":false},"changed":{"carries":{"key":"string","value":"string","previous":"string"}},"apply":{"carries":{"action":"string","scope":{"type":"enum","values":["entry"]},"ids":"list"},"cancelable":true},"reset":{"carries":{"keys":"list"},"cancelable":true},"open":{"carries":{},"cancelable":true},"opened":{"carries":{}},"close":{"carries":{"reason":{"type":"enum","values":["close","escape","outside","cancelled","api"]},"unsaved":"boolean"},"cancelable":true},"closed":{"carries":{"reason":{"type":"enum","values":["close","escape","outside","cancelled","api"]}}}},"actions":{"open":{},"close":{"with":{"reason":{"type":"enum","values":["close","escape","outside","cancelled","api"]}}},"toggle":{},"reset":{}},"layer":{"kind":"surface","locks-page":false,"traps-focus":false},"host-states":{"data-open":"boolean","data-level":"string"},"css-variables":{"--sf-settings-menu-inline-size":{"type":"length","state":"default"},"--sf-settings-menu-background":{"type":"color","state":"default"},"--sf-settings-menu-color":{"type":"color","state":"default"},"--sf-settings-menu-border-color":{"type":"color","state":"default"},"--sf-settings-menu-radius":{"type":"length","state":"default"},"--sf-settings-menu-hover-background":{"type":"color","state":"hover"},"--sf-settings-menu-selected-background":{"type":"color","state":"selected"},"--sf-settings-menu-tile-background":{"type":"color","state":"default"},"--sf-settings-menu-accent-color":{"type":"color","state":"checked"}}}');

/***/ },

/***/ "09d34676d34e"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Settings menu","runtime":{"label":"Settings","reset-label":"Reset","back-label":"Back","on":"On","off":"Off"}}');

/***/ },

/***/ "9a162ac1a701"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Компактные настройки","runtime":{"label":"Настройки","reset-label":"Сбросить","back-label":"Назад","on":"Включено","off":"Выключено"}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("843ec340b1b8");
/******/
/******/ })()
;