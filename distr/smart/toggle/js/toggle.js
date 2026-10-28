/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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

/***/ "000c296a3de1"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bindToggle: () => (/* binding */ bindToggle),
/* harmony export */   setToggleState: () => (/* binding */ setToggleState),
/* harmony export */   syncToggleState: () => (/* binding */ syncToggleState),
/* harmony export */   unbindToggle: () => (/* binding */ unbindToggle)
/* harmony export */ });
/* harmony import */ var _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d7f974466839");
/* harmony import */ var _register_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("58661bec99a6");
/* harmony import */ var _form_reset_helper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("67eed2647f47");



const TOGGLE_SELECTOR = 'label.sf-toggle';
const TOGGLE_BOUND_FLAG = 'sfToggleBound';

function toBoolean(value, defaultValue = false) {
  if (value === undefined || value === null || value === '') return defaultValue;
  if (typeof value === 'boolean') return value;
  return ['1', 'true', 'yes', 'on', 'checked', 'disabled'].includes(String(value).toLowerCase());
}

function getToggleNodes(root) {
  if (!(root instanceof HTMLElement)) {
    return {};
  }

  return {
    input: root.querySelector('input[type="checkbox"]'),
    control: root.querySelector('.sf-toggle-control'),
    container: root.querySelector('.sf-toggle-container')
  };
}

function syncToggleState(root) {
  const {
    input,
    container
  } = getToggleNodes(root);
  if (!input) return;
  const isChecked = !!input.checked;
  const isDisabled = !!input.disabled;
  root.classList.toggle('active', isChecked);
  root.classList.toggle('disabled', isDisabled);

  if (container) {
    container.classList.toggle('content-main-start', !isChecked);
    container.classList.toggle('content-main-end', isChecked);
  }
}

function bindToggle(root) {
  if (!(root instanceof HTMLElement) || root.dataset[TOGGLE_BOUND_FLAG] === '1') return;
  const {
    input
  } = getToggleNodes(root);
  if (!(input instanceof HTMLInputElement)) return;

  const handleChange = () => syncToggleState(root);

  root.__sfToggleHandleChange = handleChange;
  input.addEventListener('change', handleChange);
  root.__sfToggleReleaseReset = (0,_form_reset_helper__WEBPACK_IMPORTED_MODULE_2__.bindFormReset)(input, handleChange);
  root.dataset[TOGGLE_BOUND_FLAG] = '1';
  syncToggleState(root);
}

function unbindToggle(root) {
  if (!(root instanceof HTMLElement)) return;
  root.__sfToggleReleaseReset?.();
  delete root.__sfToggleReleaseReset;
  const {
    input
  } = getToggleNodes(root);

  if (input && root.__sfToggleHandleChange) {
    input.removeEventListener('change', root.__sfToggleHandleChange);
  }

  delete root.__sfToggleHandleChange;
  delete root.dataset[TOGGLE_BOUND_FLAG];
}

function initToggleTree(target) {
  if (!(target instanceof Element) && target !== document) return;

  if (target instanceof Element && target.matches?.(TOGGLE_SELECTOR)) {
    bindToggle(target);
  }

  target.querySelectorAll?.(TOGGLE_SELECTOR).forEach(bindToggle);
}

function initExistingToggles(target = document) {
  initToggleTree(target);
}

function setToggleState(input, state = {}) {
  if (!(input instanceof HTMLInputElement) || input.type !== 'checkbox') {
    return false;
  }

  if (Object.prototype.hasOwnProperty.call(state, 'checked')) {
    input.checked = toBoolean(state.checked);
  }

  if (Object.prototype.hasOwnProperty.call(state, 'disabled')) {
    input.disabled = toBoolean(state.disabled);
  }

  const root = input.closest(TOGGLE_SELECTOR);

  if (root) {
    syncToggleState(root);
  }

  return true;
}

function buildSimpleToggle(template, options) {
  const {
    checked,
    disabled,
    name,
    value
  } = options;
  const control = document.createElement('span');
  control.className = 'sf-toggle-control';
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.setAttribute('role', 'switch');
  input.checked = checked;
  input.defaultChecked = input.checked;
  input.disabled = disabled;
  if (name) input.name = name;
  if (value !== undefined) input.value = value;
  const container = document.createElement('span');
  container.className = 'sf-toggle-container transition flex items-center content-main-start';
  const innerWrap = document.createElement('span');
  innerWrap.className = 'sf-toggle-inner-wrap transition flex items-center content-main-center';
  const inner = document.createElement('span');
  inner.className = 'sf-toggle-inner transition';
  inner.setAttribute('aria-hidden', 'true');
  innerWrap.append(inner);
  container.append(innerWrap);
  control.append(input, container);
  template.append(control);
}

function buildIconToggle(template, options) {
  const {
    checked,
    disabled,
    name,
    value,
    icon
  } = options;
  const control = document.createElement('span');
  control.className = 'sf-toggle-control';
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.setAttribute('role', 'switch');
  input.checked = checked;
  input.defaultChecked = input.checked;
  input.disabled = disabled;
  if (name) input.name = name;
  if (value !== undefined) input.value = value;
  const container = document.createElement('span');
  container.className = 'sf-toggle-container transition flex items-center content-main-start';
  const innerWrap = document.createElement('span');
  innerWrap.className = 'sf-toggle-inner-wrap transition flex items-center content-main-center';
  const iconNode = document.createElement('i');
  iconNode.className = 'sf-icon';
  iconNode.setAttribute('aria-hidden', 'true');
  iconNode.textContent = icon || 'check';
  innerWrap.append(iconNode);
  container.append(innerWrap);
  control.append(input, container);
  template.append(control);
}

function buildShortToggle(template, options) {
  const {
    checked,
    disabled,
    name,
    value
  } = options;
  const control = document.createElement('span');
  control.className = 'sf-toggle-control';
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.setAttribute('role', 'switch');
  input.checked = checked;
  input.defaultChecked = input.checked;
  input.disabled = disabled;
  if (name) input.name = name;
  if (value !== undefined) input.value = value;
  const container = document.createElement('span');
  container.className = 'sf-toggle-container transition flex items-center content-main-start';
  const innerWrap = document.createElement('span');
  innerWrap.className = 'sf-toggle-inner-wrap transition flex items-center content-main-center';
  const inner = document.createElement('span');
  inner.className = 'sf-toggle-inner transition';
  inner.setAttribute('aria-hidden', 'true');
  innerWrap.append(inner);
  container.append(innerWrap);
  control.append(input, container);
  template.append(control);
}

class Toggle extends _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__.ComponentObserver {
  static componentName = 'Toggle';
  html = null;

  constructor(props) {
    super(props);
    const {
      size = '1',
      type = 'simple',
      label = '',
      icon = '',
      checked = false,
      disabled = false,
      name = '',
      value
    } = this.params || {};
    const className = this.attrs.class || this.attrs.className;
    this.template = document.createElement('label');

    if (this.id) {
      this.template.id = this.id;
    }

    this.template.classList.add('sf-toggle', `sf-toggle--${type}`, `sf-toggle--size-${size}`, 'flex', 'items-center');

    if (className) {
      this.template.classList.add(...String(className).split(' ').filter(Boolean));
    }

    const options = {
      checked: toBoolean(checked),
      disabled: toBoolean(disabled),
      name,
      value,
      icon
    };

    if (type === 'icon') {
      buildIconToggle(this.template, options);
    } else if (type === 'short') {
      buildShortToggle(this.template, options);
    } else {
      buildSimpleToggle(this.template, options);
    }

    if (label) {
      const text = document.createElement('span');
      text.className = 'sf-toggle-text';
      text.textContent = label;
      this.template.append(text);
    }
  }

  init() {
    bindToggle(this.template);
  }

  destroyInternal() {
    if (!this.template) return;
    unbindToggle(this.template);
  }

}

(0,_register_helper__WEBPACK_IMPORTED_MODULE_1__["default"])('Toggle', Toggle);

if (typeof window !== 'undefined') {
  window.SF = window.SF || {};
  window.SF.Toggle = window.SF.Toggle || {};
  window.SF.Toggle.setState = setToggleState;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initExistingToggles());
} else {
  initExistingToggles();
}

const toggleObserver = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (!(node instanceof Element)) return;
      initToggleTree(node);
    });
  });
});
toggleObserver.observe(document.documentElement, {
  childList: true,
  subtree: true
});


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

/***/ "475ac5c00ebd"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _component_toggle_js_toggle__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("000c296a3de1");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("d939bb700b07");
/* harmony import */ var _helpers_checkableReset__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("078aa87e580e");
/* harmony import */ var _helpers_form_field__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("38ea8d53f301");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("3e97ac3b5805");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("ed5997a95114");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("49c7c2d8d4ab");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("9e528d1869a4");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_3__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_3__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);









 // sf-toggle from its component.json (standard simai.smart-component 1.3.8 §3,
// §4, §17.1). Deprecated: sf-switch draws the same control and carries both of
// its looks (contracts/changes/journal.json component-toggle-to-switch). The
// settings are made by core/js/element-manifest.js, the legacy axis name
// `type` is a dated alias of `kind` (aliases.json), and the host is the form
// control through ElementInternals: a checked toggle submits its value, "on"
// without one, as a native checkbox does (§17.1 item 2).

const ToggleElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_6__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_8__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_9__
  },
  source: 'ru',
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_7__
});

class SfToggle extends (0,_helpers_form_field__WEBPACK_IMPORTED_MODULE_5__.FormField)(ToggleElement) {
  constructor() {
    super();
    this._boundRoot = null;
  }

  templateContext() {
    const props = this.getPropsContext();
    return this.createTemplateContext({ ...props,
      component: this,
      rootClass: this.getRootClass(),
      // The host is the form control where the browser has ElementInternals,
      // so the inner checkbox carries no name (§17.1 item 6).
      checkboxName: (0,_helpers_form_field__WEBPACK_IMPORTED_MODULE_5__.innerControlName)(this, props.name),
      // Resolved names the template reads (contracts/template-context.json).
      type: this.kind
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_3__.renderToggleTemplate)(this.templateContext());
  }

  afterRender() {
    this._releaseReset?.();
    this._releaseReset = null;

    if (this._boundRoot) {
      const prevInput = this.getInputElement();
      prevInput?.removeEventListener('change', this._handleChange);
      (0,_component_toggle_js_toggle__WEBPACK_IMPORTED_MODULE_2__.unbindToggle)(this._boundRoot);
      this._boundRoot = null;
    }

    this._boundRoot = this.querySelector('.sf-toggle');

    if (this._boundRoot) {
      (0,_component_toggle_js_toggle__WEBPACK_IMPORTED_MODULE_2__.bindToggle)(this._boundRoot);
      const input = this.getInputElement();

      if (input) {
        (0,_component_toggle_js_toggle__WEBPACK_IMPORTED_MODULE_2__.setToggleState)(input, {
          checked: this.checked,
          disabled: this.disabled
        });
        input.addEventListener('change', this._handleChange);
        this._releaseReset = (0,_helpers_checkableReset__WEBPACK_IMPORTED_MODULE_4__.bindCheckableReset)(this, input);
      }
    }

    this.sfSyncFormState();
  }

  onDisconnected() {
    this._releaseReset?.();
    this._releaseReset = null;
    const input = this.getInputElement();

    if (input) {
      input.removeEventListener('change', this._handleChange);
    }

    if (this._boundRoot) {
      (0,_component_toggle_js_toggle__WEBPACK_IMPORTED_MODULE_2__.unbindToggle)(this._boundRoot);
      this._boundRoot = null;
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

    this.sfSyncFormState();
  };

  getInputElement() {
    return this.querySelector('.sf-toggle input[type="checkbox"]');
  }

  isChecked() {
    return !!this.getInputElement()?.checked;
  }

  setChecked(nextValue = false) {
    this.checked = !!nextValue;
    this.setState({
      checked: !!nextValue
    });
    return this;
  }

  setDisabled(nextValue = false) {
    this.disabled = !!nextValue;
    this.setState({
      disabled: !!nextValue
    });
    return this;
  }

  get state() {
    const input = this.getInputElement();
    return {
      type: this.kind,
      size: this.size,
      checked: !!input?.checked,
      disabled: !!input?.disabled,
      name: this.name,
      value: this.value,
      icon: this.icon,
      label: this.label
    };
  }

  setState(nextState = {}) {
    const input = this.getInputElement();

    if (!input) {
      super.setState(nextState);
      return this;
    }

    (0,_component_toggle_js_toggle__WEBPACK_IMPORTED_MODULE_2__.setToggleState)(input, nextState);

    if (Object.prototype.hasOwnProperty.call(nextState, 'checked')) {
      if (this.toBoolean(nextState.checked)) {
        this.setAttribute('checked', '');
      } else {
        this.removeAttribute('checked');
      }
    }

    if (Object.prototype.hasOwnProperty.call(nextState, 'disabled')) {
      if (this.toBoolean(nextState.disabled)) {
        this.setAttribute('disabled', '');
      } else {
        this.removeAttribute('disabled');
      }
    }

    if (Object.prototype.hasOwnProperty.call(nextState, 'type')) {
      this.setAttribute('kind', String(nextState.type || 'simple'));
    }

    if (Object.prototype.hasOwnProperty.call(nextState, 'kind')) {
      this.setAttribute('kind', String(nextState.kind || 'simple'));
    }

    if (Object.prototype.hasOwnProperty.call(nextState, 'size')) {
      this.setAttribute('size', String(nextState.size || '1'));
    }

    if (Object.prototype.hasOwnProperty.call(nextState, 'icon')) {
      if (nextState.icon) {
        this.setAttribute('icon', String(nextState.icon));
      } else {
        this.removeAttribute('icon');
      }
    }

    if (Object.prototype.hasOwnProperty.call(nextState, 'label')) {
      if (nextState.label) {
        this.setAttribute('label', String(nextState.label));
      } else {
        this.removeAttribute('label');
      }
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

SfToggle.define('sf-toggle');
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "d939bb700b07"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderToggleTemplate: () => (/* binding */ renderToggleTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);


function joinClasses(...tokens) {
  return tokens.flat().filter(Boolean).join(' ');
}

function renderIconContent(context) {
  if (context.type !== 'icon') {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-toggle-inner transition" aria-hidden="true"></span>`;
  }

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class="sf-icon" aria-hidden="true">${context.icon || 'check'}</i>`;
}

function renderToggleTemplate(context) {
  const rootClasses = joinClasses('sf-toggle', `sf-toggle--${context.kind ?? context.type}`, `sf-toggle--size-${context.size}`, 'flex', 'items-center', context.rootClass);
  const labelContent = context.component?.hasSlotContent?.('label') ? context.component.getSlotContent('label') : context.label ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-toggle-text">${context.label}</span>` : '';
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <label class=${rootClasses} style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
      <span class="sf-toggle-control">
        <input
          type="checkbox"
          role="switch"
          name=${context.checkboxName || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          .value=${context.value || 'on'}
          .checked=${context.checked}
          ?disabled=${context.disabled}
        />
        <span class="sf-toggle-container transition flex items-center ${context.checked ? 'content-main-end' : 'content-main-start'}">
          <span class="sf-toggle-inner-wrap transition flex items-center content-main-center">
            ${renderIconContent(context)}
          </span>
        </span>
      </span>
      ${labelContent}
    </label>
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

/***/ "ed5997a95114"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-toggle for the shim (stands/18-aliases-ci/alias.mjs, standard §16 item 20). mode: same-detail (the shim sends the new and the old name), split / detail-adds (a detail adapter, refused by the shim), attribute-and-property, method, property, manifest-only (the DOM name does not change), host-attribute (no shim), retired.","component":"sf-toggle","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"type","to":"kind","kind":"setting","component":"sf-toggle","since":"2026-10-27","remove_after":"2026-12-01","section":"§16 item 20, contracts/public-api-axes.json","note":"the legacy axis name; the shim maps the attribute and the property"}]}');

/***/ },

/***/ "3e97ac3b5805"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.toggle","tag":"sf-toggle","version":"1.1.3","kind":"leaf","settings":{"size":{"type":"enum","values":["1","2"],"default":"1"},"kind":{"type":"enum","values":["simple","icon","short"],"default":"simple"},"label":{"type":"string","default":""},"icon":{"type":"icon","default":""},"disabled":{"type":"boolean","default":false},"name":{"type":"string","default":""},"value":{"type":"string","default":"on"}},"values":{"checked":{"type":"boolean","default":false}},"events":{"change":{"carries":"native"}},"actions":{},"form":{"value":"checked","name":"name","default":"checked","submits":"value","reset":"default","disabled":"disabled","validity":["custom-error"]},"css-variables":{"--sf-toggle-background-color":{"type":"color","state":"default"},"--sf-toggle-checked-background-color":{"type":"color","state":"checked"},"--sf-toggle-border-color":{"type":"color","state":"default"},"--sf-toggle-color":{"type":"color","state":"default"},"--sf-toggle-gap":{"type":"length","state":"default"}}}');

/***/ },

/***/ "49c7c2d8d4ab"
(module) {

module.exports = {"title":"Toggle"};

/***/ },

/***/ "9e528d1869a4"
(module) {

module.exports = {"title":"Тумблер"};

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
/******/ 	let __webpack_exports__ = __webpack_require__("475ac5c00ebd");
/******/
/******/ })()
;