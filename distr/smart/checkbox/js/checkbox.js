/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "9b5005c560e4"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bindCheckbox: () => (/* binding */ bindCheckbox),
/* harmony export */   resolveCheckboxIcon: () => (/* binding */ resolveCheckboxIcon),
/* harmony export */   setCheckboxState: () => (/* binding */ setCheckboxState),
/* harmony export */   syncCheckboxState: () => (/* binding */ syncCheckboxState),
/* harmony export */   unbindCheckbox: () => (/* binding */ unbindCheckbox)
/* harmony export */ });
/* harmony import */ var _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d7f974466839");
/* harmony import */ var _register_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("58661bec99a6");
/* harmony import */ var _form_reset_helper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("67eed2647f47");
/* harmony import */ var _json_checkbox_utility_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("2eddfed602cd");




const CHECKBOX_SELECTOR = 'label.sf-checkbox';
const CHECKBOX_BOUND_FLAG = 'sfCheckboxBound';

function toBoolean(value, defaultValue = false) {
  if (value === undefined || value === null || value === '') return defaultValue;
  if (typeof value === 'boolean') return value;
  const normalized = String(value).toLowerCase();
  return ['1', 'true', 'yes', 'on', 'checked', 'disabled', 'indeterminate'].includes(normalized);
}

function resolveCheckboxIcon(state) {
  if (!state) return '';
  if (state.indeterminate) return 'remove';
  if (state.checked) return 'check';
  return '';
}

function setCheckboxIcon(iconElement, icon = '') {
  if (!iconElement) return;

  if (iconElement.tagName?.toLowerCase() === 'sf-icon') {
    if (typeof iconElement.setState === 'function') {
      iconElement.setState({
        icon
      });
    } else if (icon) {
      iconElement.setAttribute('icon', icon);
    } else {
      iconElement.removeAttribute('icon');
    }

    return;
  }

  iconElement.textContent = icon;
}

function getCheckboxNodes(root) {
  if (!root) return {};
  const input = root.querySelector('input[type="checkbox"]');
  const boxIcon = root.querySelector('.sf-checkbox-box sf-icon, .sf-checkbox-box .sf-icon');
  return {
    input,
    boxIcon
  };
}

function syncCheckboxState(root) {
  const {
    input,
    boxIcon
  } = getCheckboxNodes(root);
  if (!input || !boxIcon) return;
  setCheckboxIcon(boxIcon, resolveCheckboxIcon(input));
}

function bindCheckbox(root) {
  if (!root || root.dataset[CHECKBOX_BOUND_FLAG] === '1') return;
  const {
    input
  } = getCheckboxNodes(root);
  if (!input) return;

  if (input.hasAttribute('data-indeterminate')) {
    input.indeterminate = toBoolean(input.getAttribute('data-indeterminate'), true);
  }

  const handleChange = () => syncCheckboxState(root);

  root.__sfCheckboxHandleChange = handleChange;
  input.addEventListener('change', handleChange);
  root.__sfCheckboxReleaseReset = (0,_form_reset_helper__WEBPACK_IMPORTED_MODULE_2__.bindFormReset)(input, handleChange);
  root.dataset[CHECKBOX_BOUND_FLAG] = '1';
  syncCheckboxState(root);
}

function unbindCheckbox(root) {
  if (!root) return;
  root.__sfCheckboxReleaseReset?.();
  delete root.__sfCheckboxReleaseReset;
  const {
    input
  } = getCheckboxNodes(root);

  if (input && root.__sfCheckboxHandleChange) {
    input.removeEventListener('change', root.__sfCheckboxHandleChange);
  }

  delete root.__sfCheckboxHandleChange;
  delete root.dataset[CHECKBOX_BOUND_FLAG];
}

function shouldAutoBindCheckbox(root) {
  return root instanceof Element && !root.closest('sf-checkbox');
}

function initCheckboxTree(target) {
  if (!(target instanceof Element) && target !== document) return;

  if (target instanceof Element && target.matches?.(CHECKBOX_SELECTOR) && shouldAutoBindCheckbox(target)) {
    bindCheckbox(target);
  }

  target.querySelectorAll?.(CHECKBOX_SELECTOR).forEach(root => {
    if (shouldAutoBindCheckbox(root)) {
      bindCheckbox(root);
    }
  });
}

function setCheckboxState(input, state = {}) {
  if (!(input instanceof HTMLInputElement) || input.type !== 'checkbox') {
    return false;
  }

  if (Object.prototype.hasOwnProperty.call(state, 'checked')) {
    input.checked = toBoolean(state.checked);
  }

  if (Object.prototype.hasOwnProperty.call(state, 'indeterminate')) {
    input.indeterminate = toBoolean(state.indeterminate);
  }

  if (Object.prototype.hasOwnProperty.call(state, 'disabled')) {
    input.disabled = toBoolean(state.disabled);
  }

  const root = input.closest(CHECKBOX_SELECTOR);

  if (root) {
    syncCheckboxState(root);
  }

  return true;
}

function initExistingCheckboxes(target = document) {
  initCheckboxTree(target);
}

class Checkbox extends _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__.ComponentObserver {
  static componentName = 'Checkbox';
  html = null;

  constructor(props) {
    super(props);
    const {
      size = '1',
      title = '',
      description = '',
      help = '',
      checked = false,
      disabled = false,
      indeterminate = false,
      name,
      value
    } = this.params || {};
    const className = this.attrs.class || this.attrs.className;
    this.template = document.createElement('label');

    if (this.id) {
      this.template.id = this.id;
    }

    this.template.classList.add('sf-checkbox', `sf-checkbox--size-${size}`);

    if (className) {
      this.template.classList.add(...`${className}`.split(' ').filter(Boolean));
    }

    this.box = document.createElement('span');
    this.box.classList.add('sf-checkbox-box');
    this.input = document.createElement('input');
    this.input.type = 'checkbox';

    if (name) {
      this.input.name = name;
    }

    if (value !== undefined) {
      this.input.value = value;
    }

    this.input.checked = toBoolean(checked);
    this.input.defaultChecked = this.input.checked;
    this.input.disabled = toBoolean(disabled);
    this.input.indeterminate = toBoolean(indeterminate);
    Object.entries(this.attrs).filter(([attr]) => !['class', 'className'].includes(attr)).forEach(([attr, attrValue]) => {
      if (attrValue === undefined || attrValue === null) return;
      this.input.setAttribute(attr, attrValue);
    });
    this.boxIcon = document.createElement('span');
    this.boxIcon.classList.add('sf-icon');
    this.boxIcon.setAttribute('aria-hidden', 'true');
    this.box.append(this.input, this.boxIcon);
    this.template.append(this.box);

    if (title || description || help) {
      this.container = document.createElement('span');
      this.container.classList.add('sf-checkbox-container');

      if (title || help) {
        this.top = document.createElement('span');
        this.top.classList.add('sf-checkbox-top');

        if (title) {
          this.label = document.createElement('span');
          this.label.classList.add('sf-checkbox-label');
          this.label.textContent = title;
          this.top.append(this.label);
        }

        if (help) {
          this.helpIcon = document.createElement('i');
          this.helpIcon.classList.add('sf-icon');
          this.helpIcon.setAttribute('aria-hidden', 'true');
          this.helpIcon.textContent = help;
          this.top.append(this.helpIcon);
        }

        this.container.append(this.top);
      }

      if (description) {
        this.description = document.createElement('span');
        this.description.classList.add('sf-checkbox-description');
        this.description.textContent = description;
        this.container.append(this.description);
      }

      this.template.append(this.container);
    } // The layout lives in utility hints (the stylesheet draws no display):
    // without these classes the label drew inline -- a 26x21 mark, no gap and a
    // 21px row (simai/ui-source#49). Optional parts are skipped by the helper.


    this.applyLayoutUtilities(this.template, '.sf-checkbox');
    this.applyLayoutUtilities(this.box, '.sf-checkbox .sf-checkbox-box');
    this.applyLayoutUtilities(this.container, '.sf-checkbox .sf-checkbox-container');
    this.applyLayoutUtilities(this.top, '.sf-checkbox .sf-checkbox-top');
    this.applyLayoutUtilities(this.label, '.sf-checkbox .sf-checkbox-label');
  }

  init() {
    bindCheckbox(this.template);
  }

  destroyInternal() {
    if (!this.template) return;
    unbindCheckbox(this.template);
  }

}

Checkbox.utilityMap = _json_checkbox_utility_json__WEBPACK_IMPORTED_MODULE_3__;
(0,_register_helper__WEBPACK_IMPORTED_MODULE_1__["default"])('Checkbox', Checkbox);

if (typeof window !== 'undefined') {
  window.SF = window.SF || {};
  window.SF.Checkbox = window.SF.Checkbox || {};
  window.SF.Checkbox.setState = setCheckboxState;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initExistingCheckboxes());
} else {
  initExistingCheckboxes();
}

const checkboxObserver = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (!(node instanceof Element)) return;
      initCheckboxTree(node);
    });
  });
});
checkboxObserver.observe(document.documentElement, {
  childList: true,
  subtree: true
});


/***/ },

/***/ "67eed2647f47"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bindFormReset: () => (/* binding */ bindFormReset)
/* harmony export */ });
// Reset fires before the browser restores default values. Synchronize afterwards
// without synthesizing input/change events or retaining detached controls.
const subscriptions = new WeakMap();
const listeningDocuments = new WeakSet();
function bindFormReset(input, synchronize) {
  const doc = input.ownerDocument;

  if (!listeningDocuments.has(doc)) {
    doc.addEventListener('reset', event => {
      const form = event.target;
      if (form?.tagName !== 'FORM') return;
      const controls = Array.from(form.elements);
      setTimeout(() => {
        if (event.defaultPrevented) return;

        for (const control of controls) {
          if (!control.isConnected || control.form !== form) continue;

          for (const callback of subscriptions.get(control) || []) callback();
        }
      }, 0);
    }, true);
    listeningDocuments.add(doc);
  }

  let callbacks = subscriptions.get(input);
  if (!callbacks) subscriptions.set(input, callbacks = new Set());
  callbacks.add(synchronize);
  return () => callbacks.delete(synchronize);
}

/***/ },

/***/ "58661bec99a6"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   registerComponent: () => (/* binding */ registerComponent)
/* harmony export */ });
// Simple helper to register a component in one call.
// Usage inside component bundle:
//   import register from './register-helper';
//   register('Buttons', Buttons);
function registerComponent(name, cls) {
  if (!name || !cls) return;

  if (typeof window !== 'undefined' && typeof window.registerSfComponent === 'function') {
    window.registerSfComponent(name, cls);
    return;
  }

  if (typeof window !== 'undefined' && window.SF?.Loader?.registerComponent) {
    window.SF.Loader.registerComponent(name, cls);
    return;
  }

  if (typeof window !== 'undefined') {
    const pending = window.SF_PENDING_COMPONENTS = window.SF_PENDING_COMPONENTS || [];
    pending.push([name, cls]);
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (registerComponent);

/***/ },

/***/ "d7f974466839"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ComponentObserver: () => (/* binding */ ComponentObserver)
/* harmony export */ });
class ComponentObserver {
  // Components name themselves with a static field (static componentName =
  // 'Modal'), and the Loader writes the name on the prototype only when it
  // registers the class; the lifecycle events read the instance, so an
  // instance made before that announced itself as `undefined:render`. Not a
  // getter: the Loader assigns the prototype property, and an accessor
  // without a setter made that assignment throw.
  lifecycleName() {
    return this.componentName ?? this.constructor.componentName;
  }

  constructor(props) {
    this.props = props;
    this.id = props?.id;
    this.params = props?.param;
    this.attrs = props?.attrs || {};
    this.template = null;
    window.dispatchEvent(new CustomEvent(`${this.lifecycleName()}:beforeRender`, {
      detail: this
    }));
  }

  getUtilityMap() {
    return this.constructor.utilityMap || null;
  }

  extractUtilityClasses(values) {
    if (!Array.isArray(values)) {
      return [];
    }

    const classes = new Set();
    values.forEach(value => {
      if (typeof value !== 'string') {
        return;
      }

      const matches = value.match(/\(([^)]+)\)/g);

      if (!matches) {
        return;
      }

      matches.forEach(match => {
        const raw = match.slice(1, -1);
        raw.split(/\s+/).filter(Boolean).forEach(cls => {
          // Only explicit (.class) annotations are classes; the
          // parentheses in var(--token) are CSS values, not markup.
          if (cls.startsWith('.') && cls.length > 1) classes.add(cls.slice(1));
        });
      });
    });
    return Array.from(classes);
  }

  applyLayoutUtilities(target, selector) {
    if (!target || !selector) {
      return;
    }

    const map = this.getUtilityMap();

    if (!map || !map[selector]) {
      return;
    }

    const classes = this.extractUtilityClasses(map[selector]);
    classes.forEach(cls => target.classList.add(cls));
  }

  render() {
    this.html = this.template;

    if (typeof this.init === 'function') {
      this.init();
    }

    if (this.html) {
      window.dispatchEvent(new CustomEvent(`${this.lifecycleName()}:render`, {
        detail: this
      }));
    }

    return this.html;
  }

  destroy() {
    this.destroyInternal?.();
    this.props = null;
    this.id = null;
    this.params = null;
    this.template = null;

    if (this.html) {
      this.html.remove();
      this.html = null;
    }

    window.dispatchEvent(new CustomEvent(`${this.lifecycleName()}:destroy`, {
      detail: this
    }));
  }

  destroyInternal() {}

}

/***/ },

/***/ "5d4f4a988974"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _component_checkbox_js_checkbox__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("9b5005c560e4");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("fe282de00908");
/* harmony import */ var _helpers_checkableReset__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("078aa87e580e");
/* harmony import */ var _helpers_form_field__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("38ea8d53f301");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("47e9950fb20b");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("0f14f861d828");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("0ae1a29b7840");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("56e00394ab1f");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_3__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_3__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);









 // sf-checkbox from its component.json (standard simai.smart-component 1.3.8
// §3, §4, §17.1, §17.2). The settings and the values checked and
// indeterminate are made by core/js/element-manifest.js; `error` is a dated
// alias of `invalid` (§17.2, aliases.json); the host is the form control
// through ElementInternals, so a checked box submits its value, "on" without
// one, as a native checkbox does (§17.1 item 2), and the inner checkbox
// carries no name.

const CheckboxElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_6__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_8__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_9__
  },
  source: 'ru',
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_7__
});

class SfCheckbox extends (0,_helpers_form_field__WEBPACK_IMPORTED_MODULE_5__.FormField)(CheckboxElement) {
  static get props() {
    return { ...super.props,
      // A host attribute, never a setting (§3.1): read for the inner input's name.
      ariaLabel: {
        attribute: 'aria-label',
        default: ''
      },
      rootClass: {
        type: String,
        default: ''
      }
    };
  }

  constructor() {
    super();
    this._inputElement = null;
  } // A checkbox with no visible label still needs a name: a table's row and
  // select-all boxes are the common case. Like sf-button, the name comes from
  // the host's aria-label or the ariaLabel prop and lands on the native input.


  get ariaLabel() {
    return this.getProp('ariaLabel') || this.getAttribute('aria-label') || '';
  }

  get stateIcon() {
    return (0,_component_checkbox_js_checkbox__WEBPACK_IMPORTED_MODULE_2__.resolveCheckboxIcon)({
      checked: this.checked,
      indeterminate: this.indeterminate
    });
  }

  template() {
    const context = this.templateContext();
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_3__.renderCheckboxTemplate)({ ...context,
      // The host is the form control where the browser has ElementInternals
      // (§17.1 item 6).
      name: (0,_helpers_form_field__WEBPACK_IMPORTED_MODULE_5__.innerControlName)(this, context.name),
      stateIcon: this.stateIcon,
      ariaLabel: this.ariaLabel
    });
  }

  async afterRender() {
    await this.whenChildrenDefined();
    const input = this.getInputElement();
    if (!input) return;
    this.syncInputState(input);
    this._releaseReset?.();
    this._releaseReset = (0,_helpers_checkableReset__WEBPACK_IMPORTED_MODULE_4__.bindCheckableReset)(this, input);

    if (this._inputElement && this._inputElement !== input) {
      this._inputElement.removeEventListener('change', this._handleChange);
    }

    if (this._inputElement !== input) {
      input.addEventListener('change', this._handleChange);
      this._inputElement = input;
    }

    this.sfSyncFormState();
  }

  onDisconnected() {
    this._releaseReset?.();
    this._releaseReset = null;

    if (this._inputElement) {
      this._inputElement.removeEventListener('change', this._handleChange);

      this._inputElement = null;
    }
  }

  _handleChange = () => {
    const input = this.getInputElement();
    if (!input) return;

    if (input.checked) {
      this.setAttribute('checked', '');
    } else {
      this.removeAttribute('checked');
    }

    if (input.indeterminate) {
      this.setAttribute('indeterminate', '');
    } else {
      this.removeAttribute('indeterminate');
    }

    this.sfSyncFormState();
  };

  getInputElement() {
    return this.querySelector('.sf-checkbox input[type="checkbox"]');
  }

  isChecked() {
    return !!this.getInputElement()?.checked;
  }

  setChecked(nextValue = false) {
    const checked = (0,_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__.toBoolean)(nextValue, false);
    this.setState({
      checked
    });
    return this;
  }

  setIndeterminate(nextValue = false) {
    const indeterminate = (0,_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__.toBoolean)(nextValue, false);
    this.setState({
      indeterminate
    });
    return this;
  }

  setDisabled(nextValue = false) {
    const disabled = (0,_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__.toBoolean)(nextValue, false);
    this.setState({
      disabled
    });
    return this;
  }

  get state() {
    const input = this.getInputElement();
    return {
      checked: !!input?.checked,
      indeterminate: !!input?.indeterminate,
      disabled: !!input?.disabled,
      name: this.name,
      value: this.value
    };
  }

  syncInputState(input = this.getInputElement()) {
    if (!input) return;
    input.checked = this.checked;
    input.disabled = this.disabled;
    input.indeterminate = this.indeterminate;
  }

  setBooleanStateAttribute(name, value) {
    if (value) {
      this.setAttribute(name, '');
    } else {
      this.removeAttribute(name);
    }
  }

  setState(nextState = {}) {
    const restState = { ...nextState
    };
    const input = this.getInputElement();

    if (Object.prototype.hasOwnProperty.call(nextState, 'checked')) {
      const checked = (0,_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__.toBoolean)(nextState.checked);
      this.setBooleanStateAttribute('checked', checked);
      if (input) input.checked = checked;
      delete restState.checked;
    }

    if (Object.prototype.hasOwnProperty.call(nextState, 'indeterminate')) {
      const indeterminate = (0,_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__.toBoolean)(nextState.indeterminate);
      this.setBooleanStateAttribute('indeterminate', indeterminate);
      if (input) input.indeterminate = indeterminate;
      delete restState.indeterminate;
    }

    if (Object.prototype.hasOwnProperty.call(nextState, 'disabled')) {
      const disabled = (0,_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__.toBoolean)(nextState.disabled);
      this.setBooleanStateAttribute('disabled', disabled);
      if (input) input.disabled = disabled;
      delete restState.disabled;
    }

    if (Object.keys(restState).length) {
      super.setState(restState);
    }

    this.sfSyncFormState();
    return this;
  }

  onChange(handler, options) {
    if (typeof handler === 'function') {
      this.addEventListener('change', handler, options);
    }

    return this;
  }

  onFocus(handler, options) {
    if (typeof handler === 'function') {
      this.addEventListener('focusin', handler, options);
    }

    return this;
  }

  onBlur(handler, options) {
    if (typeof handler === 'function') {
      this.addEventListener('focusout', handler, options);
    }

    return this;
  }

}

SfCheckbox.define('sf-checkbox');
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "fe282de00908"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderCheckboxTemplate: () => (/* binding */ renderCheckboxTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var _default_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("fcfc3bb80ec7");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);


function renderCheckboxTemplate(context) {
  const {
    size,
    label,
    description,
    help,
    checked,
    disabled,
    position,
    indeterminate,
    name,
    rootClass,
    rootStyle,
    value,
    invalid,
    stateIcon,
    ariaLabel
  } = context;
  const rootClasses = ['sf-checkbox', `sf-checkbox--size-${size}`, 'flex', rootClass];

  if (invalid) {
    rootClasses.push('error');
  }

  if (!disabled) {
    rootClasses.push('cursor-pointer');
  }

  const labelContent = context.component?.hasSlotContent?.('label') ? context.component.getSlotContent('label') : label ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-checkbox-label">${label}</span>` : '';
  const descriptionContent = context.component?.hasSlotContent?.('description') ? context.component.getSlotContent('description') : description ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-checkbox-description">${description}</span>` : '';
  const helpContent = context.component?.hasSlotContent?.('help') ? context.component.getSlotContent('help') : help ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                            <sf-icon aria-hidden="true" icon="${help}"></sf-icon>` : '';
  const showContainer = !!(labelContent || descriptionContent || helpContent);
  const isStart = position === 'start';
  const input = (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <span class="sf-checkbox-box transition flex">
        <input
                type="checkbox"
                name=${name || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                .value=${value || 'on'}
                .checked=${checked}
                ?disabled=${disabled}
                .indeterminate=${indeterminate}
                aria-invalid=${invalid ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                aria-label=${!label && !context.component?.hasSlotContent?.('label') && ariaLabel ? ariaLabel : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        />
          <sf-icon aria-hidden="true" icon=${stateIcon || ''}></sf-icon>
      </span>`;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <label class=${rootClasses.filter(Boolean).join(' ')} style=${rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
            ${isStart ? input : ''}
            ${showContainer ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                        <span class="sf-checkbox-container flex flex-col">
              ${labelContent || helpContent ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                          <span class="sf-checkbox-top flex">
                      ${labelContent}
                      ${helpContent}
                    </span>
                      ` : ''}
              ${descriptionContent}
            </span>
                    ` : ''}
            ${!isStart ? input : ''}
        </label>
    `;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "078aa87e580e"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bindCheckableReset: () => (/* binding */ bindCheckableReset)
/* harmony export */ });
/* harmony import */ var _component_form_reset_helper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("67eed2647f47");
 // checked is the Smart component's live, reflected state. Keep the initial
// native reset default separate so rerenders do not turn it into the last value.

function bindCheckableReset(component, input) {
  if (!Object.prototype.hasOwnProperty.call(component, '_resetChecked')) {
    component._resetChecked = !!component.checked;
  }

  const current = input.checked;
  input.defaultChecked = component._resetChecked;
  input.checked = current;
  return (0,_component_form_reset_helper__WEBPACK_IMPORTED_MODULE_0__.bindFormReset)(input, () => {
    if (component.getInputElement() === input) component._handleChange();
  });
}

/***/ },

/***/ "38ea8d53f301"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FormField: () => (/* binding */ FormField),
/* harmony export */   VALIDITY_FLAGS: () => (/* binding */ VALIDITY_FLAGS),
/* harmony export */   innerControlName: () => (/* binding */ innerControlName),
/* harmony export */   syncFieldValidity: () => (/* binding */ syncFieldValidity),
/* harmony export */   syncOwnValidity: () => (/* binding */ syncOwnValidity)
/* harmony export */ });
// The form-control half of a field built from its component.json (standard
// simai.smart-component 1.3.8 §17.1, §17.2), shared by the field family.
//
// core/js/element-manifest.js makes the host form-associated and gives it
// ElementInternals, sfFormValue() and sfSyncForm(). What a field adds is the
// same in every member, so it is written once here:
//
// - validity (§17.2): the host reports what its inner native control knows
//   (value-missing, too-short, pattern-mismatch, ...) with the control as the
//   anchor, so reportValidity() points at the box the person types in; a
//   custom error set with setCustomValidity() or the action set-error wins
//   until it is cleared;
// - the inner controls stay out of the page's form (§17.1 item 6): they carry
//   no name while the host is the form control;
// - a field with no inner native control to read (a list of buttons, a
//   picker, a file area) says what it knows itself with `fieldValidity()`:
//   value-missing while `required` and the form value is empty by default,
//   and where the browser points;
// - form reset and fieldset[disabled] (§17.1 items 3, 4): `form.reset()`
//   calls the component's `fieldReset()` when it has one (its default back,
//   without events), and the host syncs its form value and validity after the
//   browser has reset its parts;
// - restore: `formStateRestoreCallback` hands the saved form value to
//   `fieldRestore(state)` when the component has one.
//
// Usage, over the element core/js/element-manifest.js gives:
//
//   const Element = elementFromManifest(manifest, {base: SfBaseElement, ...});
//   class SfThing extends FormField(Element) { ... }
//
// Without ElementInternals nothing here runs, and the named inner control
// submits as it always did (§16 item 11).
// ValidityState's own flags, in the order of §17.2's list.
const VALIDITY_FLAGS = Object.freeze(['valueMissing', 'typeMismatch', 'patternMismatch', 'tooShort', 'tooLong', 'rangeUnderflow', 'rangeOverflow', 'stepMismatch', 'badInput']);
/** The name an inner native control carries: none while the host submits (§17.1 item 6). */

function innerControlName(component, name) {
  return component?.sfInternals ? '' : String(name || '');
}
/**
 * The host's validity from its inner control: the control's failed flags and
 * message, or the custom error the page set, or valid. `own` adds flags the
 * component reads itself, {flag: message} (a number field's range and step,
 * which its text box cannot know).
 */

function syncFieldValidity(component, control, own = {}) {
  const internals = component?.sfInternals;
  if (!internals) return;

  try {
    const custom = component.sfCustomError || '';

    if (custom) {
      internals.setValidity({
        customError: true
      }, custom, control || undefined);
      return;
    }

    const validity = control?.validity;
    const flags = {};
    let message = '';

    if (validity && !validity.valid && control.willValidate !== false) {
      for (const flag of VALIDITY_FLAGS) if (validity[flag]) flags[flag] = true;

      message = control.validationMessage;
    }

    for (const [flag, text] of Object.entries(own || {})) {
      flags[flag] = true;
      message ||= String(text || '');
    }

    if (Object.keys(flags).length) internals.setValidity(flags, message || ' ', control || undefined);else internals.setValidity({});
  } catch (error) {
    component.reportComponentError?.(error, 'validity');
  }
}
/**
 * The host's validity from what the component says itself (fieldValidity()):
 * value-missing and the custom error the page set; `anchor`, when it is a part
 * of the host, is where the browser points.
 */

function syncOwnValidity(component, {
  valueMissing = false,
  message = '',
  anchor = null
} = {}) {
  const internals = component?.sfInternals;
  if (!internals) return;
  const custom = component.sfCustomError || '';
  const flags = {};
  let text = '';

  if (custom) {
    flags.customError = true;
    text = custom;
  }

  if (valueMissing) {
    flags.valueMissing = true;
    text ||= message || 'value-missing';
  }

  try {
    if (Object.keys(flags).length) {
      const target = anchor && component.contains?.(anchor) ? anchor : undefined;
      internals.setValidity(flags, text, target);
    } else {
      internals.setValidity({});
    }
  } catch (error) {
    component.reportComponentError?.(error, 'validity');
  }
}
/**
 * The field family's form plumbing over a manifest element. A component
 * names the control its validity comes from with `sfValidityAnchor()`
 * (default: getInputElement()).
 */

const FormField = Base => class extends Base {
  constructor() {
    super(); // A person's edit reaches the host as input/change; the form value and
    // validity follow it without a redraw.

    this.__sfFormSync = () => this.sfSyncFormState();

    this.addEventListener('input', this.__sfFormSync);
    this.addEventListener('change', this.__sfFormSync);
  }

  sfValidityAnchor() {
    return this.getInputElement?.() || null;
  }
  /**
   * What the component knows of its validity itself, {valueMissing, message,
   * anchor}, or null when an inner native control's ValidityState is the
   * answer (sfValidityAnchor()). With no such control: value-missing while
   * `required` and the form value is empty. A component overrides it.
   */


  fieldValidity() {
    if (this.sfValidityAnchor()) return null;
    const required = this.hasAttribute('required') && this.getAttribute('required') !== 'false';
    const value = this.sfFormValue?.();
    return {
      valueMissing: required && !this.disabled && (value === null || value === undefined || value === ''),
      message: this.sfWord?.('value-missing') || 'value-missing',
      anchor: null
    };
  }
  /** The validity, now: the component's own account, or its inner control's. */


  sfSyncValidity() {
    const own = this.fieldValidity();
    if (own) syncOwnValidity(this, own);else syncFieldValidity(this, this.sfValidityAnchor());
  }
  /** The form value and the validity, now. */


  sfSyncFormState() {
    this.sfSyncForm?.();
    this.sfSyncValidity();
  }
  /** §17.2: a custom error keeps the form from submitting until it is cleared. */


  setCustomValidity(message = '') {
    this.sfCustomError = String(message ?? '');
    this.sfSyncValidity();
  } // fieldReset() puts the component's default back, without events. The
  // browser resets the parts after it calls this: the sync waits for them,
  // and once more for the parts that put their own default back a task later
  // (component/form-reset-helper.js: masks, the checkables' attributes).


  formResetCallback() {
    if (typeof this.fieldReset === 'function') {
      try {
        this.fieldReset();
      } catch (error) {
        this.reportComponentError?.(error, 'form reset');
      }
    }

    this.sfSyncFormState();
    Promise.resolve().then(() => this.sfSyncFormState());
    setTimeout(() => this.sfSyncFormState(), 0);
  }

  formStateRestoreCallback(state) {
    if (typeof this.fieldRestore === 'function') this.fieldRestore(state);
    this.sfSyncFormState();
  }

};

/***/ },

/***/ "fcfc3bb80ec7"
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

/***/ "deb1a4d61565"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("smart-base", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("smart-base", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "2eddfed602cd"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{".sf-checkbox":["display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","justify-content/flex-start (.justify-start)","align-items/flex-start (.items-start)"],".sf-checkbox .sf-checkbox-box":["display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","justify-content/center (.justify-center)","align-items/center (.items-center)"],".sf-checkbox .sf-checkbox-container":["display/flex (.flex)","flex-direction/column (.flex-col)","flex-wrap/nowrap (.flex-nowrap)","justify-content/flex-start (.justify-start)","align-items/flex-start (.items-start)"],".sf-checkbox .sf-checkbox-top":["display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","gap/var(--sf-checkbox-top--gap)","justify-content/flex-start (.justify-start)","align-items/flex-start (.items-start)"],".sf-checkbox .sf-checkbox-label":["display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","justify-content/center (.justify-center)","align-items/center (.items-center)"]}');

/***/ },

/***/ "0f14f861d828"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-checkbox for the shim (stands/18-aliases-ci/alias.mjs, standard §16 item 20). mode: same-detail (the shim sends the new and the old name), split / detail-adds (a detail adapter, refused by the shim), attribute-and-property, method, property, manifest-only (the DOM name does not change), host-attribute (no shim), retired.","component":"sf-checkbox","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"aria-label","to":null,"kind":"attribute","component":"sf-checkbox","since":"2026-10-27","remove_after":"2026-12-01","mode":"host-attribute","section":"§3.1","note":"stays a host attribute, read by the base (§3.1, §4.8); no shim"},{"from":"error","to":"invalid","kind":"setting","component":"sf-checkbox","since":"2026-10-27","remove_after":"2026-12-01","section":"§17.2","note":"error is a dated alias of invalid; the shim maps the attribute and the property"}]}');

/***/ },

/***/ "47e9950fb20b"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.checkbox","tag":"sf-checkbox","version":"1.1.5","kind":"leaf","settings":{"size":{"type":"enum","values":["1/2","1","2"],"default":"1"},"label":{"type":"string","default":""},"description":{"type":"string","default":""},"help":{"type":"icon","default":""},"position":{"type":"enum","values":["start","end"],"default":"start"},"disabled":{"type":"boolean","default":false},"name":{"type":"string","default":""},"value":{"type":"string","default":"on"},"invalid":{"type":"boolean","default":false}},"values":{"checked":{"type":"boolean","default":false},"indeterminate":{"type":"boolean","default":false}},"events":{"change":{"carries":"native"}},"actions":{},"form":{"value":"checked","name":"name","default":"checked","submits":"value","reset":"default","disabled":"disabled","validity":["custom-error"]},"css-variables":{"--sf-checkbox-background-color":{"type":"color","state":"default"},"--sf-checkbox-border-color":{"type":"color","state":"default"},"--sf-checkbox-border-width":{"type":"length","state":"default"},"--sf-checkbox-radius":{"type":"length","state":"default"},"--sf-checkbox-size":{"type":"length","state":"default"},"--sf-checkbox-gap":{"type":"length","state":"default"},"--sf-checkbox-checked-background-color":{"type":"color","state":"checked"},"--sf-checkbox-invalid-border-color":{"type":"color","state":"invalid"}}}');

/***/ },

/***/ "0ae1a29b7840"
(module) {

module.exports = {"title":"Checkbox"};

/***/ },

/***/ "56e00394ab1f"
(module) {

module.exports = {"title":"Флажок"};

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
/******/ 	let __webpack_exports__ = __webpack_require__("5d4f4a988974");
/******/
/******/ })()
;