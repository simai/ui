/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "ad5bbe113041"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PROFILE_PICKER_TEXT: () => (/* binding */ PROFILE_PICKER_TEXT),
/* harmony export */   SfProfilePicker: () => (/* binding */ SfProfilePicker)
/* harmony export */ });
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("fbe0570fcc69");
/* harmony import */ var _core_js_position_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5c1dc214bb5e");
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("0d662e4d7d63");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("4a548d247667");
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("9b0fd2c3adba");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_position_js__WEBPACK_IMPORTED_MODULE_1__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_2__, _js_templates_default__WEBPACK_IMPORTED_MODULE_3__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_position_js__WEBPACK_IMPORTED_MODULE_1__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_2__, _js_templates_default__WEBPACK_IMPORTED_MODULE_3__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_position_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_position_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_core_js_page_language__WEBPACK_IMPORTED_MODULE_2__);
// sf-profile-picker: the one way a person chooses, makes, renames, removes and
// resets a profile -- the admin menu's profiles, a record's views, and
// whatever has profiles next (owner, 2026-10-14, from the approved
// prototype). Folded it is a field-like button naming the profile in use;
// open, everything happens in its panel: a row per profile, its rename and
// remove on the row, a new profile made inline, a reset at the foot.
//
// The profiles and what may be done with them are the host's: the component
// draws them and says what the person asked for, with one event per act --
// sf-profile-select, -create, -rename, -delete, -reset. It does not change its
// own list; the host answers by setting `profiles` (and `current`), or by
// setting `message` to say why not.






const position = () => globalThis.SF?.Position || (_core_js_position_js__WEBPACK_IMPORTED_MODULE_1___default());

const PROFILE_PICKER_TEXT = {
  en: {
    label: 'Profile',
    newProfile: 'New profile…',
    name: 'Profile name',
    personal: 'Personal',
    shared: 'For everyone',
    builtin: 'standard',
    create: 'Create',
    cancel: 'Cancel',
    rename: 'Rename',
    remove: 'Delete',
    save: 'Save',
    reset: 'Reset to standard',
    removeQuestion: 'Delete «{name}»?',
    removeShared: 'It goes for everyone on the site.',
    copyOf: 'A copy of «{name}».',
    seenByAll: 'Seen by everyone on the site.',
    seenByYou: 'Seen only by you.',
    locked: 'You cannot change it',
    personalTaken: 'You already have a personal profile',
    sharedDenied: 'You cannot make shared profiles',
    nameEmpty: 'Give the profile a name.'
  },
  ru: {
    label: 'Профиль',
    newProfile: 'Новый профиль…',
    name: 'Название профиля',
    personal: 'Личный',
    shared: 'Для всех',
    builtin: 'стандартный',
    create: 'Создать',
    cancel: 'Отмена',
    rename: 'Переименовать',
    remove: 'Удалить',
    save: 'Сохранить',
    reset: 'Сбросить к стандартному',
    removeQuestion: 'Удалить «{name}»?',
    removeShared: 'Он исчезнет у всех на сайте.',
    copyOf: 'Копия профиля «{name}».',
    seenByAll: 'Виден всем на сайте.',
    seenByYou: 'Виден только вам.',
    locked: 'Нет прав на изменение',
    personalTaken: 'Личный профиль уже есть',
    sharedDenied: 'Нет прав на общие профили',
    nameEmpty: 'Дайте профилю название.'
  }
};

class SfProfilePicker extends (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()) {
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
    return {
      templateName: {
        attribute: 'template',
        default: 'default'
      },
      label: {
        default: ''
      },
      size: {
        default: '1/2'
      },
      current: {
        default: ''
      },
      resettable: {
        type: Boolean,
        default: false
      },
      message: {
        default: ''
      },
      disabled: {
        type: Boolean,
        default: false
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

  get label() {
    return this.getAttribute('label') || '';
  }

  get size() {
    return this.getAttribute('size') === '1' ? '1' : '1/2';
  }

  get current() {
    return this.getAttribute('current') ?? String(this._profiles[0]?.id ?? '');
  }

  get resettable() {
    return this.getBooleanAttr('resettable', false);
  }

  get message() {
    return this.getAttribute('message') || '';
  }

  get disabled() {
    return this.getBooleanAttr('disabled', false);
  }

  text(key) {
    return (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_2__.pageText)(PROFILE_PICKER_TEXT, key, this, 'sf-profile-picker');
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
    if (this.disabled || this.state.open) return;
    this.state = { ...this.state,
      open: true,
      mode: null,
      target: null
    };
    this.requestComponentUpdate('open');
    await this.whenRendered?.();
    const panel = this.panel();
    const trigger = this.trigger();
    if (!panel || !trigger) return;

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
    document.addEventListener('pointerdown', this._onOutside, true);
    (panel.querySelector('.sf-profile-picker-row[aria-checked="true"]') ?? panel.querySelector('.sf-profile-picker-row'))?.focus({
      preventScroll: true
    });
  }

  close({
    restoreFocus = true
  } = {}) {
    if (!this.state.open) return;
    this.state = { ...this.state,
      open: false,
      mode: null,
      target: null
    };
    this._position?.stop();
    this._position = null;
    document.removeEventListener('pointerdown', this._onOutside, true);
    const panel = this.panel();
    if (panel?.matches?.(':popover-open')) panel.hidePopover();
    this.requestComponentUpdate('close');
    if (restoreFocus) this.trigger()?.focus({
      preventScroll: true
    });
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


  announce(name, detail, {
    cancelable = false
  } = {}) {
    return this.dispatchEvent(new CustomEvent(`sf-profile-${name}`, {
      bubbles: true,
      composed: true,
      cancelable,
      detail
    }));
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
      id: String(id)
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
      from: String(this.currentProfile()?.id ?? '')
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
      label
    });
  }

  submitDelete(id) {
    this.announce('delete', {
      id: String(id)
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
      event.preventDefault();
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
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_3__.renderProfilePickerTemplate)(this.templateContext());
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
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ddf1cdb42ecc");
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