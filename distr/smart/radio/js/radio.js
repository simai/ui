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

/***/ "c2e2433fb668"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bindRadio: () => (/* binding */ bindRadio),
/* harmony export */   setRadioState: () => (/* binding */ setRadioState),
/* harmony export */   syncRadioState: () => (/* binding */ syncRadioState),
/* harmony export */   unbindRadio: () => (/* binding */ unbindRadio)
/* harmony export */ });
/* harmony import */ var _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d7f974466839");
/* harmony import */ var _register_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("58661bec99a6");
/* harmony import */ var _form_reset_helper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("67eed2647f47");
/* harmony import */ var _json_radio_utility_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("48d00b6bd847");




const RADIO_SELECTOR = 'label.sf-radio-button';
const RADIO_BOUND_FLAG = 'sfRadioBound';
const RADIO_FONT_WRAP_SELECTOR = '.sf-radio-wrap--type-font';
const RADIO_INTERNAL_ATTRS = new Set(['class', 'className', 'type', 'count', 'text', 'title', 'description', 'help', 'checked', 'disabled']);

function toBoolean(value, defaultValue = false) {
  if (value === undefined || value === null || value === '') return defaultValue;
  if (typeof value === 'boolean') return value;
  const normalized = String(value).toLowerCase();
  return ['1', 'true', 'yes', 'on', 'checked', 'disabled'].includes(normalized);
}

function toNumber(value, defaultValue = 0) {
  const nextValue = Number(value);
  return Number.isFinite(nextValue) ? nextValue : defaultValue;
}

function toArray(value) {
  if (Array.isArray(value)) {
    return value;
  }

  if (value === undefined || value === null || value === '') {
    return [];
  }

  if (typeof value === 'string') {
    const normalized = value.trim();

    if (!normalized) {
      return [];
    }

    if (normalized.startsWith('[') && normalized.endsWith(']') || normalized.startsWith('{') && normalized.endsWith('}')) {
      try {
        const parsed = JSON.parse(normalized);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return normalized.slice(1, -1).split(',').map(item => item.trim()).filter(Boolean);
      }
    }

    return normalized.split(',').map(item => item.trim()).filter(Boolean);
  }

  return [value];
}

function getRadioNodes(root) {
  if (!root) return {};
  const input = root.querySelector('input[type="radio"]');
  const mark = root.querySelector('.sf-radio-button-box .sf-radio-button-mark');
  return {
    input,
    mark
  };
}

function getRadioGroupRoots(input) {
  if (!(input instanceof HTMLInputElement) || input.type !== 'radio' || !input.name) {
    return [];
  }

  return Array.from(input.getRootNode().querySelectorAll(`${RADIO_SELECTOR} input[type="radio"]`)).filter(node => node.name === input.name && node.form === input.form).map(node => node.closest(RADIO_SELECTOR)).filter(Boolean);
}

function syncRadioState(root) {
  const {
    input,
    mark
  } = getRadioNodes(root);
  if (!input) return;
  root.classList.toggle('active', !!input.checked);
  root.classList.toggle('disabled', !!input.disabled);

  if (mark) {
    mark.setAttribute('aria-hidden', 'true');
  }
}

function syncFontRadioWrap(input) {
  const wrap = input?.closest?.(RADIO_FONT_WRAP_SELECTOR);
  if (!wrap) return;
  const descriptions = toArray(wrap.dataset.sfRadioDescriptions || '');
  const descriptionNode = wrap.querySelector('.sf-radio-button-description');
  const checkedInput = wrap.querySelector(`${RADIO_SELECTOR} input[type="radio"]:checked`);
  const checkedIndex = toNumber(checkedInput?.dataset?.sfRadioFontIndex, -1);
  wrap.querySelectorAll('.sf-radio-text').forEach((node, index) => node.classList.toggle('active', index === checkedIndex));
  if (!descriptionNode) return;

  if (checkedIndex >= 0 && checkedIndex < descriptions.length) {
    descriptionNode.textContent = descriptions[checkedIndex] || '';
    return;
  }

  descriptionNode.textContent = descriptions[0] || wrap.dataset.sfRadioDescription || '';
}

function refreshRadioGroup(input) {
  const roots = getRadioGroupRoots(input);

  if (!roots.length) {
    const root = input?.closest?.(RADIO_SELECTOR);

    if (root) {
      syncRadioState(root);
    }

    syncFontRadioWrap(input);
    return;
  }

  roots.forEach(root => syncRadioState(root));
  syncFontRadioWrap(input);
}

function bindRadio(root) {
  if (!root || root.dataset[RADIO_BOUND_FLAG] === '1') return;
  const {
    input
  } = getRadioNodes(root);
  if (!input) return;

  const handleChange = () => refreshRadioGroup(input);

  root.__sfRadioHandleChange = handleChange;
  input.addEventListener('change', handleChange);
  root.__sfRadioReleaseReset = (0,_form_reset_helper__WEBPACK_IMPORTED_MODULE_2__.bindFormReset)(input, handleChange);
  root.dataset[RADIO_BOUND_FLAG] = '1';
  syncRadioState(root);
}

function unbindRadio(root) {
  if (!root) return;
  root.__sfRadioReleaseReset?.();
  delete root.__sfRadioReleaseReset;
  const {
    input
  } = getRadioNodes(root);

  if (input && root.__sfRadioHandleChange) {
    input.removeEventListener('change', root.__sfRadioHandleChange);
  }

  delete root.__sfRadioHandleChange;
  delete root.dataset[RADIO_BOUND_FLAG];
}

function initRadioTree(target) {
  if (!(target instanceof Element) && target !== document) return;

  if (target instanceof Element && target.matches?.(RADIO_SELECTOR)) {
    bindRadio(target);
  }

  target.querySelectorAll?.(RADIO_SELECTOR).forEach(bindRadio);
}

function setRadioState(input, state = {}) {
  if (!(input instanceof HTMLInputElement) || input.type !== 'radio') {
    return false;
  }

  if (Object.prototype.hasOwnProperty.call(state, 'checked')) {
    input.checked = toBoolean(state.checked);
  }

  if (Object.prototype.hasOwnProperty.call(state, 'disabled')) {
    input.disabled = toBoolean(state.disabled);
  }

  refreshRadioGroup(input);
  return true;
}

function initExistingRadios(target = document) {
  initRadioTree(target);
}

function hideNativeRadioInput(input) {
  if (!(input instanceof HTMLInputElement) || input.type !== 'radio') {
    return input;
  } // A class, not inline styles: an inline style outranks every stylesheet, so a
  // page could not bring the native input back (or style it) at all.


  input.classList.add('sf-radio-native');
  return input;
}

class Radio extends _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__.ComponentObserver {
  static componentName = 'Radio';
  html = null;

  constructor(props) {
    super(props);
    const {
      size = '1',
      type = 'default',
      count = 0,
      text = '',
      title = '',
      description = '',
      help = '',
      checked = false,
      disabled = false,
      name = '',
      value
    } = this.params || {};
    const className = this.attrs.class || this.attrs.className;
    this.type = type || 'default';
    this.template = this.type === 'font' ? this.buildFontTemplate({
      size,
      count,
      text,
      title,
      description,
      help,
      checked,
      disabled,
      name,
      value,
      className
    }) : document.createElement('label');

    if (this.id) {
      this.template.id = this.id;
    }

    if (this.type === 'font') {
      return;
    }

    this.template.classList.add('sf-radio-button', `sf-radio-button--size-${size}`, `sf-radio-button--type-${type || 'default'}`);

    if (className) {
      this.template.classList.add(...`${className}`.split(' ').filter(Boolean));
    }

    this.box = document.createElement('span');
    this.box.classList.add('sf-radio-button-box');
    this.input = document.createElement('input');
    this.input.type = 'radio';

    if (name) {
      this.input.name = name;
    }

    if (value !== undefined) {
      this.input.value = value;
    }

    this.input.checked = this.type === 'font' ? this.previewCheckedIndex >= 0 || toBoolean(checked) : toBoolean(checked);
    this.input.defaultChecked = this.input.checked;
    this.input.disabled = toBoolean(disabled);
    hideNativeRadioInput(this.input);
    Object.entries(this.attrs).filter(([attr]) => !RADIO_INTERNAL_ATTRS.has(attr)).forEach(([attr, attrValue]) => {
      if (attrValue === undefined || attrValue === null) return;
      this.input.setAttribute(attr, attrValue);
    });

    if (this.type === 'font') {
      this.box.classList.add('sf-radio-button-box--font');
      this.box.append(this.input, this.createFontPreview());
    } else {
      this.mark = document.createElement('span');
      this.mark.classList.add('sf-radio-button-mark');
      this.mark.setAttribute('aria-hidden', 'true');
      this.box.append(this.input, this.mark);
    }

    this.template.append(this.box);
    const descriptionText = this.type === 'font' ? this.getSelectedDescription(description) : description;

    if (title || descriptionText || help) {
      this.container = document.createElement('span');
      this.container.classList.add('sf-radio-button-container');

      if (title || help) {
        this.top = document.createElement('span');
        this.top.classList.add('sf-radio-button-top');

        if (title) {
          this.text = document.createElement('span');
          this.text.classList.add('sf-radio-button-text');
          this.text.textContent = title;
          this.top.append(this.text);
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

      if (descriptionText) {
        this.description = document.createElement('span');
        this.description.classList.add('sf-radio-button-description');
        this.description.textContent = descriptionText;
        this.container.append(this.description);
      }

      this.template.append(this.container);
    } // The layout lives in utility hints (the stylesheet draws no display):
    // without these classes the ring was an inline span 2px wide and the
    // selected mark 0px (simai/ui-source#50). Optional parts are skipped by
    // the helper.


    this.applyLayoutUtilities(this.template, '.sf-radio-button');
    this.applyLayoutUtilities(this.box, '.sf-radio-button .sf-radio-button-box');
    this.applyLayoutUtilities(this.container, '.sf-radio-button .sf-radio-button-container');
    this.applyLayoutUtilities(this.top, '.sf-radio-button .sf-radio-button-top');
    this.applyLayoutUtilities(this.text, '.sf-radio-button .sf-radio-button-text');
  }

  init() {
    initRadioTree(this.template);
  }

  destroyInternal() {
    if (!this.template) return;

    if (this.template.matches?.(RADIO_SELECTOR)) {
      unbindRadio(this.template);
      return;
    }

    this.template.querySelectorAll?.(RADIO_SELECTOR).forEach(unbindRadio);
  }

  resolveCheckedIndex(checked, count) {
    const total = Math.max(0, toNumber(count, 0));

    if (typeof checked === 'number' || typeof checked === 'string' && checked !== '') {
      const index = Math.floor(toNumber(checked, -1));
      return index >= 0 && index < total ? index : -1;
    }

    return toBoolean(checked, false) ? 0 : -1;
  }

  buildFontTemplate({
    size = '1',
    count = 1,
    text = 'A',
    title = '',
    description = '',
    help = '',
    checked = false,
    disabled = false,
    name = '',
    value,
    className = ''
  } = {}) {
    const wrap = document.createElement('div');
    const total = Math.max(1, toNumber(count, 1));
    const checkedIndex = this.resolveCheckedIndex(checked, total);
    const descriptions = toArray(description);
    const values = toArray(value);
    wrap.classList.add('sf-radio-button', 'sf-radio-wrap--type-font', 'flex', `sf-radio-button--size-${size}`);

    if (className) {
      wrap.classList.add(...`${className}`.split(' ').filter(Boolean));
    }

    wrap.dataset.sfRadioDescriptions = JSON.stringify(descriptions);
    wrap.dataset.sfRadioDescription = (checkedIndex >= 0 ? descriptions[checkedIndex] : descriptions[0]) || '';
    const group = document.createElement('div');
    group.classList.add('sf-radio-group', 'sf-radio-group--font', 'flex', 'items-cross-start');

    for (let index = 0; index < total; index += 1) {
      const option = document.createElement('label');
      option.classList.add('sf-radio-button', `sf-radio-button--size-${size}`, 'sf-radio-button--type-font');
      const icon = document.createElement('i');
      icon.classList.add('sf-radio-text');

      if (index === checkedIndex) {
        icon.classList.add('active');
      }

      icon.setAttribute('aria-hidden', 'true');
      icon.textContent = text || 'A';
      const input = document.createElement('input');
      input.type = 'radio';
      input.dataset.sfRadioFontIndex = String(index);

      if (name) {
        input.name = name;
      }

      if (values[index] !== undefined) {
        input.value = String(values[index]);
      } else if (value !== undefined && !Array.isArray(value)) {
        input.value = String(value);
      } else {
        input.value = String(index);
      }

      input.checked = index === checkedIndex;
      input.defaultChecked = input.checked;
      input.disabled = toBoolean(disabled);
      const optionLabel = descriptions[index] || (values[index] !== undefined ? String(values[index]) : `${title || text || 'Radio'} ${index + 1}`);
      input.setAttribute('aria-label', optionLabel);
      hideNativeRadioInput(input);
      Object.entries(this.attrs).filter(([attr]) => !RADIO_INTERNAL_ATTRS.has(attr)).forEach(([attr, attrValue]) => {
        if (attrValue === undefined || attrValue === null) return;
        input.setAttribute(attr, attrValue);
      });
      option.append(icon, input);
      group.append(option);
    }

    const container = document.createElement('div');
    container.classList.add('sf-radio-button-container', 'flex', 'flex-col');

    if (title || help) {
      const top = document.createElement('span');
      top.classList.add('sf-radio-button-top', 'flex');

      if (title) {
        const textNode = document.createElement('span');
        textNode.classList.add('sf-radio-button-text');
        textNode.textContent = title;
        top.append(textNode);
      }

      if (help) {
        const helpIcon = document.createElement('i');
        helpIcon.classList.add('sf-icon');
        helpIcon.setAttribute('aria-hidden', 'true');
        helpIcon.textContent = help;
        top.append(helpIcon);
      }

      container.append(top);
    }

    const descriptionText = (checkedIndex >= 0 ? descriptions[checkedIndex] : descriptions[0]) || '';

    if (descriptionText) {
      const descriptionNode = document.createElement('span');
      descriptionNode.classList.add('sf-radio-button-description');
      descriptionNode.textContent = descriptionText;
      container.append(descriptionNode);
    }

    wrap.append(group, container);
    return wrap;
  }

}

Radio.utilityMap = _json_radio_utility_json__WEBPACK_IMPORTED_MODULE_3__;
(0,_register_helper__WEBPACK_IMPORTED_MODULE_1__["default"])('Radio', Radio);

if (typeof window !== 'undefined') {
  window.SF = window.SF || {};
  window.SF.Radio = window.SF.Radio || {};
  window.SF.Radio.setState = setRadioState;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initExistingRadios());
} else {
  initExistingRadios();
}

const radioObserver = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (!(node instanceof Element)) return;
      initRadioTree(node);
    });
  });
});
radioObserver.observe(document.documentElement, {
  childList: true,
  subtree: true
});


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

/***/ "1a0f9759d9a3"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _component_radio_js_radio__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("c2e2433fb668");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("f092e756548c");
/* harmony import */ var _helpers_checkableReset__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("078aa87e580e");
/* harmony import */ var _helpers_form_field__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("38ea8d53f301");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("b9154ac40cf8");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("c00a7eefcca1");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("7ee257be389e");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("63dac91f9223");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_3__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_3__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);









 // sf-radio from its component.json (standard simai.smart-component 1.3.8 §3,
// §4, §17.1, §17.2). The settings and the value checked are made by
// core/js/element-manifest.js; `error` is a dated alias of `invalid` (§17.2,
// aliases.json). The host is the form control through ElementInternals: a
// checked radio submits its value ("on" without one, as a native radio).
//
// The inner radios still make the group -- one checked at a time, the arrow
// keys move through it -- and a native group is the radios of one name in
// one form owner. So while the host submits, an inner radio is taken out of
// the page's form by a `form` attribute that names no form (§17.1 item 6:
// it joins no form and submits nothing), and its name is the group key: the
// host's form (its id, else its place among the page's forms, read from the
// page and never counted) and the host's name, so two forms on one page that
// use the same name keep two groups.

const RadioElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_6__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_8__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_9__
  },
  source: 'ru',
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_7__
}); // The id the inner radios' form attribute names: no element carries it.

const NO_FORM = 'sf-radio-no-form';

function groupKey(component) {
  if (!component.name) return '';
  const form = component.form;
  if (!form) return `sf-radio:page:${component.name}`;
  const place = form.id || String(Array.prototype.indexOf.call(form.ownerDocument?.forms || [], form));
  return `sf-radio:${place}:${component.name}`;
}

function syncSmartRadioGroup(source) {
  if (!source?.name) return;
  document.querySelectorAll('sf-radio').forEach(component => {
    const input = component?.getInputElement?.();
    if (!input || input.name !== source.name || input.form !== source.form || input.getRootNode() !== source.getRootNode()) return;

    if (input.checked) {
      component.setAttribute('checked', '');
    } else {
      component.removeAttribute('checked');
    }

    component.sfSyncFormState?.();
  });
}

class SfRadio extends (0,_helpers_form_field__WEBPACK_IMPORTED_MODULE_5__.FormField)(RadioElement) {
  static get props() {
    return { ...super.props,
      rootClass: {
        default: ''
      }
    };
  }

  constructor() {
    super();
    this._boundRoot = null;
  }

  templateContext() {
    const props = this.getPropsContext();
    const internals = Boolean(this.sfInternals);
    return this.createTemplateContext({ ...props,
      // Without ElementInternals the named inner radio submits, as before.
      controlName: internals ? groupKey(this) : props.name,
      innerForm: internals ? NO_FORM : '',
      component: this
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_3__.renderRadioTemplate)(this.templateContext());
  }

  afterRender() {
    this._releaseReset?.();
    this._releaseReset = null;

    if (this._boundRoot) {
      (0,_component_radio_js_radio__WEBPACK_IMPORTED_MODULE_2__.unbindRadio)(this._boundRoot);
      this._boundRoot = null;
    }

    this._boundRoot = this.querySelector('.sf-radio-button');

    if (this._boundRoot) {
      (0,_component_radio_js_radio__WEBPACK_IMPORTED_MODULE_2__.bindRadio)(this._boundRoot);
      const input = this.getInputElement();

      if (input) {
        (0,_component_radio_js_radio__WEBPACK_IMPORTED_MODULE_2__.setRadioState)(input, {
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
      (0,_component_radio_js_radio__WEBPACK_IMPORTED_MODULE_2__.unbindRadio)(this._boundRoot);
      this._boundRoot = null;
    }
  } // Inside a form the host is reset by the form; its inner radio, out of the
  // form, is put back here: the default is what the markup said (§17.1 item 4).


  formResetCallback() {
    const input = this.getInputElement();

    if (input && this.sfInternals) {
      const checked = Object.prototype.hasOwnProperty.call(this, '_resetChecked') ? this._resetChecked : this.checked;
      input.checked = checked;
      if (checked) this.setAttribute('checked', '');else this.removeAttribute('checked');
    }

    super.formResetCallback();
  } // A group key follows the form the host is in.


  formAssociatedCallback() {
    if (this.sfInternals) this.requestComponentUpdate?.('form');
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
    syncSmartRadioGroup(input);
  };

  getInputElement() {
    return this.querySelector('.sf-radio-button input[type="radio"]');
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
    if (nextValue) {
      this.setAttribute('disabled', '');
    } else {
      this.removeAttribute('disabled');
    }

    this.setState({
      disabled: !!nextValue
    });
    return this;
  }

  get state() {
    const input = this.getInputElement();
    return {
      checked: !!input?.checked,
      disabled: !!input?.disabled,
      name: this.name,
      value: this.value
    };
  }

  setState(nextState = {}) {
    const input = this.getInputElement();

    if (!input) {
      super.setState(nextState);
      return this;
    }

    (0,_component_radio_js_radio__WEBPACK_IMPORTED_MODULE_2__.setRadioState)(input, nextState);

    if (Object.prototype.hasOwnProperty.call(nextState, 'checked')) {
      if (this.toBoolean(nextState.checked)) {
        this.setAttribute('checked', '');
      } else {
        this.removeAttribute('checked');
      }

      syncSmartRadioGroup(input);
    }

    if (Object.prototype.hasOwnProperty.call(nextState, 'disabled')) {
      if (this.toBoolean(nextState.disabled)) {
        this.setAttribute('disabled', '');
      } else {
        this.removeAttribute('disabled');
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

SfRadio.define('sf-radio');
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "f092e756548c"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderRadioTemplate: () => (/* binding */ renderRadioTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);

function renderRadioTemplate(context) {
  const {
    size,
    label,
    description,
    help,
    checked,
    disabled,
    controlName,
    value,
    invalid,
    innerForm
  } = context;
  const rootClasses = ['sf-radio-button', `sf-radio-button--size-${size}`, 'flex', context.rootClass];

  if (invalid) {
    rootClasses.push('error');
  }

  const labelContent = context.component?.hasSlotContent?.('label') ? context.component.getSlotContent('label') : label ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-radio-button-text">${label}</span>` : '';
  const descriptionContent = context.component?.hasSlotContent?.('description') ? context.component.getSlotContent('description') : description ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-radio-button-description">${description}</span>` : '';
  const helpContent = context.component?.hasSlotContent?.('help') ? context.component.getSlotContent('help') : help ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class="sf-icon" aria-hidden="true">${help}</i>` : '';
  const showContainer = !!(labelContent || descriptionContent || helpContent);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <label class=${rootClasses.filter(Boolean).join(' ')} style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
      <span class="sf-radio-button-box transition flex items-cross-center content-main-center">
        <input
          type="radio"
          name=${controlName || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          form=${innerForm || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          .value=${value || 'on'}
          .checked=${checked}
          ?disabled=${disabled}
        />
        <span class="sf-radio-button-mark" aria-hidden="true"></span>
      </span>

      ${showContainer ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
            <span class="sf-radio-button-container flex flex-col">
              ${labelContent || helpContent ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                    <span class="sf-radio-button-top flex">
                      ${labelContent}
                      ${helpContent}
                    </span>
                  ` : ''}
              ${descriptionContent}
            </span>
          ` : ''}
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

/***/ "48d00b6bd847"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{".sf-radio-button":["display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","justify-content/flex-start (.justify-start)","align-items/flex-start (.items-start)"],".sf-radio-button .sf-radio-button-box":["display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","gap/var(--sf-radio-button-box--gap)","justify-content/center (.justify-center)","align-items/center (.items-center)"],".sf-radio-button .sf-radio-button-container":["display/flex (.flex)","flex-direction/column (.flex-col)","flex-wrap/nowrap (.flex-nowrap)","justify-content/flex-start (.justify-start)","align-items/flex-start (.items-start)"],".sf-radio-button .sf-radio-button-top":["display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","justify-content/flex-start (.justify-start)","align-items/flex-start (.items-start)","gap/var(--sf-radio-button-top--gap)"],".sf-radio-button .sf-radio-button-text":["display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","justify-content/center (.justify-center)","align-items/center (.items-center)"]}');

/***/ },

/***/ "c00a7eefcca1"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-radio for the shim (stands/18-aliases-ci/alias.mjs, standard §16 item 20). mode: same-detail (the shim sends the new and the old name), split / detail-adds (a detail adapter, refused by the shim), attribute-and-property, method, property, manifest-only (the DOM name does not change), host-attribute (no shim), retired.","component":"sf-radio","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"error","to":"invalid","kind":"setting","component":"sf-radio","since":"2026-10-27","remove_after":"2026-12-01","section":"§17.2","note":"error is a dated alias of invalid; the shim maps the attribute and the property"}]}');

/***/ },

/***/ "b9154ac40cf8"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.radio","tag":"sf-radio","version":"1.1.3","kind":"leaf","settings":{"size":{"type":"enum","values":["1/2","1","2"],"default":"1","summary":"Radio size token."},"label":{"type":"string","default":""},"description":{"type":"string","default":""},"help":{"type":"icon","default":""},"disabled":{"type":"boolean","default":false},"name":{"type":"string","default":""},"value":{"type":"string","default":"on","summary":"What a checked radio submits; without it, \\"on\\", as a native radio (standard 1.3.8 §17.1 item 2)."},"invalid":{"type":"boolean","default":false,"summary":"The shown invalid state: the error look and aria-invalid on the native input."}},"values":{"checked":{"type":"boolean","default":false}},"events":{"change":{"carries":"native","summary":"The selection changed; the native event bubbles from the inner radio, which is its target. The name to bind."}},"actions":{},"form":{"value":"checked","name":"name","default":"checked","submits":"value","reset":"default","disabled":"disabled","validity":["custom-error"]},"css-variables":{"--sf-radio-button-background-color":{"type":"color","state":"default"},"--sf-radio-button-border-color":{"type":"color","state":"default"},"--sf-radio-button-border-width":{"type":"length","state":"default"},"--sf-radio-button-color":{"type":"color","state":"default"},"--sf-radio-button-size":{"type":"length","state":"default"},"--sf-radio-button-gap":{"type":"length","state":"default"},"--sf-radio-button-checked-color":{"type":"color","state":"checked"},"--sf-radio-button-invalid-border-color":{"type":"color","state":"invalid"}}}');

/***/ },

/***/ "7ee257be389e"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Radio buttons"}');

/***/ },

/***/ "63dac91f9223"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Радиокнопки"}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("1a0f9759d9a3");
/******/
/******/ })()
;