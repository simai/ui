/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "ad5bbe113041"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SfProfilePicker: () => (/* binding */ SfProfilePicker)
/* harmony export */ });
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _core_js_position_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("116963e5e31b");
/* harmony import */ var _core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("bf0cea966575");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("4a548d247667");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("816c0ad0728a");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("9ad70024c464");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("ad1b3554788b");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("0c5af1be4f82");
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("9b0fd2c3adba");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_position_js__WEBPACK_IMPORTED_MODULE_2__, _core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_3__, _js_templates_default__WEBPACK_IMPORTED_MODULE_4__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_position_js__WEBPACK_IMPORTED_MODULE_2__, _core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_3__, _js_templates_default__WEBPACK_IMPORTED_MODULE_4__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_position_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_core_js_position_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_3__);
// sf-profile-picker: the one way a person chooses, makes, renames, removes and
// resets a profile -- the admin menu's profiles, a record's views, and
// whatever has profiles next (owner, 2026-10-14, from the approved
// prototype). Folded it is a field-like button naming the profile in use;
// open, everything happens in its panel: a row per profile, its rename and
// remove on the row, a new profile made inline, a reset at the foot.
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










const ProfilePickerElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_5__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_7__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_8__
  },
  source: 'ru',
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_6__
});

const position = () => globalThis.SF?.Position || (_core_js_position_js__WEBPACK_IMPORTED_MODULE_2___default()); // The template names its words in camelCase; the language files in kebab-case.


const kebab = key => String(key).replace(/[A-Z]/gu, letter => `-${letter.toLowerCase()}`);

const applied = () => ({
  outcome: 'applied'
});

class SfProfilePicker extends ProfilePickerElement {
  constructor() {
    super();
    this._profiles = [];
    this._rights = {};
    this.state = {
      open: false,
      mode: null,
      target: null,
      draft: {
        name: '',
        shared: false
      }
    };

    this._onOutside = event => {
      if (!this.state.open) return;
      const path = event.composedPath();
      if (path.includes(this) || path.includes(this.panel())) return;
      this.close({
        restoreFocus: false
      });
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
  }

  get size() {
    return this.getAttribute('size') === '1' ? '1' : '1/2';
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
    return this.querySelector(':scope .sf-profile-picker-panel');
  }

  trigger() {
    return this.querySelector(':scope .sf-profile-picker-trigger');
  } // ─── opening ───────────────────────────────────────────────────────────


  async open() {
    if (this.disabled) return {
      outcome: 'refused',
      reason: 'disabled'
    };
    if (this.state.open) return applied();
    this.state = { ...this.state,
      open: true,
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
    if (!panel || !trigger) return applied();

    if (typeof panel.showPopover === 'function') {
      panel.setAttribute('popover', 'manual');
      if (!panel.matches(':popover-open')) panel.showPopover();
    } // At least the trigger's width, wider for a long name.


    panel.style.minInlineSize = `${Math.round(trigger.getBoundingClientRect().width)}px`;
    this._position = position().anchor(trigger, panel, {
      side: 'block-end',
      align: 'start',
      flip: true,
      shift: true,
      fitHeight: true
    });
    document.addEventListener('pointerdown', this._onOutside, true); // The open panel owns Escape: the root says so, and a drawer or record
    // panel listening on the document stands back.

    (0,_core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_3__.holdOpenSurfaceMark)(this, true);
    (panel.querySelector('.sf-profile-picker-row[aria-checked="true"]') ?? panel.querySelector('.sf-profile-picker-row'))?.focus({
      preventScroll: true
    });
    return applied();
  }

  close({
    restoreFocus = true
  } = {}) {
    if (!this.state.open) return {
      outcome: 'refused',
      reason: 'closed'
    };
    this.state = { ...this.state,
      open: false,
      mode: null,
      target: null
    };
    this._position?.stop();
    this._position = null;
    document.removeEventListener('pointerdown', this._onOutside, true);
    (0,_core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_3__.holdOpenSurfaceMark)(this, false);
    const panel = this.panel();
    if (panel?.matches?.(':popover-open')) panel.hidePopover();
    this.requestComponentUpdate('close');
    if (restoreFocus) this.trigger()?.focus({
      preventScroll: true
    });
    return applied();
  }

  toggle() {
    return this.state.open ? this.close() : this.open();
  }

  disconnectedCallback() {
    this.close({
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
    } : this.state.draft;
    this.state = { ...this.state,
      mode,
      target: target === null ? null : String(target),
      draft
    };
    this.setAttribute('message', '');
    this.requestComponentUpdate('mode');
    this.whenRendered?.().then(() => {
      const field = this.panel()?.querySelector('.sf-profile-picker-field');
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
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_4__.renderProfilePickerTemplate)(this.templateContext());
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
/* harmony export */   renderProfilePickerTemplate: () => (/* binding */ renderProfilePickerTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);


const icon = (name, className = '') => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class="sf-icon ${className}" aria-hidden="true">${name}</i>`;

const kindIcon = profile => profile?.shared ? 'group' : 'person';

const fill = (text, values) => Object.entries(values).reduce((out, [key, value]) => out.replace(`{${key}}`, value), text);

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
      <button type="button" class="sf-profile-picker-icon-button" title=${text('save')} aria-label=${text('save')}
              @click=${event => component.submitRename(id, event.currentTarget.parentElement.querySelector('input').value)}>${icon('check')}</button>
      <button type="button" class="sf-profile-picker-icon-button" title=${text('cancel')} aria-label=${text('cancel')}
              @click=${() => component.setMode(null)}>${icon('close')}</button>
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
        <sf-button size=${context.size} status="error" text=${text('remove')} @click=${() => component.submitDelete(id)}></sf-button>
        <sf-button size=${context.size} appearance="outline" scheme="on-surface" text=${text('cancel')} @click=${() => component.setMode(null)}></sf-button>
      </div>
    </div>`;
  }

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-profile-picker-row" role="menuitemradio" tabindex="-1" data-id=${id}
                   aria-checked=${String(current)} @click=${event => {
    if (!event.target.closest('button')) component.choose(id);
  }}>
    <span class="sf-profile-picker-check">${current ? icon('check') : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}</span>
    ${icon(kindIcon(profile), 'sf-profile-picker-kind')}
    <span class="sf-profile-picker-text">
      <span class="sf-profile-picker-label">${profile.label ?? id}</span>
      <span class="sf-profile-picker-caption">${profile.shared ? text('shared') : text('personal')}${profile.builtin ? ` · ${text('builtin')}` : ''}</span>
    </span>
    ${may ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-profile-picker-actions">
          <button type="button" class="sf-profile-picker-icon-button" tabindex="-1" title=${`${text('rename')} (F2)`}
                  aria-label=${`${text('rename')}: ${profile.label ?? id}`} @click=${() => component.setMode('rename', id)}>${icon('edit')}</button>
          <button type="button" class="sf-profile-picker-icon-button sf-profile-picker-danger" tabindex="-1" title=${text('remove')}
                  aria-label=${`${text('remove')}: ${profile.label ?? id}`} @click=${() => component.setMode('delete-confirm', id)}>${icon('delete')}</button>
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
      <span class="sf-profile-picker-check"></span>${icon('add', 'sf-profile-picker-kind')}
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
    <div class="sf-profile-picker-segmented" role="group">
      <button type="button" aria-pressed=${String(!shared)} ?disabled=${!create.personal}
              title=${create.personal ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : text('personalTaken')} @click=${() => choose(false)}>${icon('person')}${text('personal')}</button>
      <button type="button" aria-pressed=${String(shared)} ?disabled=${!create.shared}
              title=${create.shared ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : text('sharedDenied')} @click=${() => choose(true)}>${icon('group')}${text('shared')}</button>
    </div>
    <div class="sf-profile-picker-hint">${fill(text('copyOf'), {
    name: context.currentProfile?.label ?? ''
  })} ${shared ? text('seenByAll') : text('seenByYou')}</div>
    <div class="sf-profile-picker-buttons">
      <sf-button size=${context.size} text=${text('create')}
                 @click=${event => component.submitCreate(event.target.closest('.sf-profile-picker-form').querySelector('input').value, shared)}></sf-button>
      <sf-button size=${context.size} appearance="outline" scheme="on-surface" text=${text('cancel')} @click=${() => component.setMode(null)}></sf-button>
    </div>
  </div>`;
}

function renderProfilePickerTemplate(context) {
  const {
    component,
    state,
    text
  } = context;
  const current = context.currentProfile;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div class=${['sf-profile-picker', `sf-profile-picker--size-${context.size === '1' ? '1' : '1-2'}`, context.rootClass].filter(Boolean).join(' ')}>
      <button type="button" class="sf-profile-picker-trigger" aria-haspopup="menu" aria-expanded=${String(state.open)}
              ?disabled=${context.disabled} @click=${() => component.toggle()}>
        ${icon(kindIcon(current), 'sf-profile-picker-kind')}
        <span class="sf-profile-picker-name">${context.heading}: <b>${current?.label ?? ''}</b></span>
        ${icon('expand_more', 'sf-profile-picker-chevron')}
      </button>
      <div class="sf-profile-picker-panel" role="menu" aria-label=${context.heading} ?hidden=${!state.open}
           @keydown=${event => component.handleKeyDown(event)}>
        ${state.open ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
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
        ` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
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

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.profile-picker","tag":"sf-profile-picker","version":"1.1.5","kind":"leaf","settings":{"label":{"type":"string","default-from":"runtime.label","summary":"What a profile is called here («Профиль», «Вид»); the page language\'s «Profile» when empty."},"size":{"type":"enum","values":["1/2","1"],"default":"1/2"},"resettable":{"type":"boolean","default":false,"summary":"Offers «Сбросить к стандартному» at the foot."},"message":{"type":"string","default":"","summary":"Why the host refused the last act, shown in the panel."},"disabled":{"type":"boolean","default":false},"profiles":{"type":"list","of":{"id":"id","label":"string","shared":"boolean","builtin":"boolean","editable":"boolean"},"x-summary":"The profiles the host offers; the picker never changes its own list"},"rights":{"type":"object","x-summary":"What this person may do: {create: {personal, shared}, reset}"}},"values":{"current":{"type":"string","default":"","summary":"The id of the profile in use."}},"events":{"select":{"carries":{"id":"string","ids":"list"}},"create":{"carries":{"label":"string","shared":"boolean","from":"string","kind":{"type":"enum","values":["personal","shared"]}}},"rename":{"carries":{"id":"string","label":"string","title":"string"}},"delete":{"carries":{"id":"string","ids":"list"}},"reset":{"carries":{"id":"string"}}},"actions":{"open":{"x-outcomes":["applied","refused"],"x-summary":"Opens the panel; refused (disabled) when disabled, applied when already open"},"close":{"x-outcomes":["applied","refused"],"x-summary":"Closes the panel and gives the focus back to the trigger; refused (closed) when closed"},"toggle":{"x-outcomes":["applied","refused"]}},"presentation":{"skeleton":{"file":"skeleton.html","$comment":"The folded trigger with a bar for the profile\'s name: the first paint before the host sets profiles (§5.4).","late":["profiles"]}},"css-variables":{"--sf-profile-picker-background-color":{"type":"color","state":"default"},"--sf-profile-picker-border-color":{"type":"color","state":"default"},"--sf-profile-picker-radius":{"type":"length","state":"default"},"--sf-profile-picker-color":{"type":"color","state":"default"},"--sf-profile-picker-panel-background-color":{"type":"color","state":"default"}}}');

/***/ },

/***/ "ad1b3554788b"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Profile picker","runtime":{"builtin":"standard","cancel":"Cancel","copy-of":"A copy of «{name}».","create":"Create","label":"Profile","locked":"You cannot change it","name":"Profile name","name-empty":"Give the profile a name.","new-profile":"New profile…","personal":"Personal","personal-taken":"You already have a personal profile","remove":"Delete","remove-question":"Delete «{name}»?","remove-shared":"It goes for everyone on the site.","rename":"Rename","reset":"Reset to standard","save":"Save","seen-by-all":"Seen by everyone on the site.","seen-by-you":"Seen only by you.","shared":"For everyone","shared-denied":"You cannot make shared profiles"}}');

/***/ },

/***/ "0c5af1be4f82"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Выбор профиля","runtime":{"builtin":"стандартный","cancel":"Отмена","copy-of":"Копия профиля «{name}».","create":"Создать","label":"Профиль","locked":"Нет прав на изменение","name":"Название профиля","name-empty":"Дайте профилю название.","new-profile":"Новый профиль…","personal":"Личный","personal-taken":"Личный профиль уже есть","remove":"Удалить","remove-question":"Удалить «{name}»?","remove-shared":"Он исчезнет у всех на сайте.","rename":"Переименовать","reset":"Сбросить к стандартному","save":"Сохранить","seen-by-all":"Виден всем на сайте.","seen-by-you":"Виден только вам.","shared":"Для всех","shared-denied":"Нет прав на общие профили"}}');

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