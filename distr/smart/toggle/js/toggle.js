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
  constructor(props) {
    this.props = props;
    this.id = props?.id;
    this.params = props?.param;
    this.attrs = props?.attrs || {};
    this.template = null;
    window.dispatchEvent(new CustomEvent(`${this.componentName}:beforeRender`, {
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
      window.dispatchEvent(new CustomEvent(`${this.componentName}:render`, {
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

    window.dispatchEvent(new CustomEvent(`${this.componentName}:destroy`, {
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

/***/ "475ac5c00ebd"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("fbe0570fcc69");
/* harmony import */ var _component_toggle_js_toggle__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("000c296a3de1");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("d939bb700b07");
/* harmony import */ var _helpers_checkableReset__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("078aa87e580e");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _js_templates_default__WEBPACK_IMPORTED_MODULE_2__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _js_templates_default__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);





class SfToggle extends (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()) {
  static get props() {
    return {
      size: {
        default: '1'
      },
      // The axis is called kind, because that is the question it answers.
      // `type` keeps working: see contracts/public-api-axes.json.
      kind: {
        default: 'simple',
        values: ['simple', 'icon', 'short'],
        aliases: ['type']
      },
      label: {
        default: ''
      },
      icon: {
        default: ''
      },
      checked: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      name: {
        default: ''
      },
      value: {
        default: ''
      }
    };
  }

  constructor() {
    super();
    this._boundRoot = null;
  }

  get size() {
    return this.getAttribute('size') || '1';
  }

  get kind() {
    return this.getProp('kind');
  } // The legacy name, kept so a consumer reading el.type still gets an answer.


  get type() {
    return this.kind;
  }

  get label() {
    return this.getAttribute('label') || '';
  }

  get icon() {
    return this.getAttribute('icon') || '';
  }

  get checked() {
    return this.getBooleanAttr('checked', false);
  }

  set checked(nextValue) {
    if (nextValue) {
      this.setAttribute('checked', '');
    } else {
      this.removeAttribute('checked');
    }
  }

  get disabled() {
    return this.getBooleanAttr('disabled', false);
  }

  set disabled(nextValue) {
    if (nextValue) {
      this.setAttribute('disabled', '');
    } else {
      this.removeAttribute('disabled');
    }
  }

  get name() {
    return this.getAttribute('name') || '';
  }

  get value() {
    return this.getAttribute('value') || '';
  }

  set value(nextValue) {
    if (nextValue === null || nextValue === undefined) {
      this.removeAttribute('value');
      return;
    }

    this.setAttribute('value', String(nextValue));
  }

  templateContext() {
    const props = this.getPropsContext();
    return this.createTemplateContext({ ...props,
      component: this,
      rootClass: this.getRootClass(),
      // Resolved names the template reads (contracts/template-context.json).
      type: this.type
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_2__.renderToggleTemplate)(this.templateContext());
  }

  afterRender() {
    this._releaseReset?.();
    this._releaseReset = null;

    if (this._boundRoot) {
      const prevInput = this.getInputElement();
      prevInput?.removeEventListener('change', this._handleChange);
      (0,_component_toggle_js_toggle__WEBPACK_IMPORTED_MODULE_1__.unbindToggle)(this._boundRoot);
      this._boundRoot = null;
    }

    this._boundRoot = this.querySelector('.sf-toggle');

    if (this._boundRoot) {
      (0,_component_toggle_js_toggle__WEBPACK_IMPORTED_MODULE_1__.bindToggle)(this._boundRoot);
      const input = this.getInputElement();

      if (input) {
        (0,_component_toggle_js_toggle__WEBPACK_IMPORTED_MODULE_1__.setToggleState)(input, {
          checked: this.checked,
          disabled: this.disabled
        });
        input.addEventListener('change', this._handleChange);
        this._releaseReset = (0,_helpers_checkableReset__WEBPACK_IMPORTED_MODULE_3__.bindCheckableReset)(this, input);
      }
    }
  }

  onDisconnected() {
    this._releaseReset?.();
    this._releaseReset = null;
    const input = this.getInputElement();

    if (input) {
      input.removeEventListener('change', this._handleChange);
    }

    if (this._boundRoot) {
      (0,_component_toggle_js_toggle__WEBPACK_IMPORTED_MODULE_1__.unbindToggle)(this._boundRoot);
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
      type: this.type,
      size: this.size,
      checked: !!input?.checked,
      disabled: !!input?.disabled,
      name: input?.name || '',
      value: input?.value || '',
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

    (0,_component_toggle_js_toggle__WEBPACK_IMPORTED_MODULE_1__.setToggleState)(input, nextState);

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
      this.setAttribute('type', String(nextState.type || 'simple'));
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
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ddf1cdb42ecc");
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
          name=${context.name || ''}
          .value=${context.value || ''}
          .checked=${context.checked}
          ?disabled=${context.disabled}
        />
        <span class="sf-toggle-container transition flex items-center content-main-start">
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

/***/ "ddf1cdb42ecc"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit") : new Promise((resolve) => globalThis.addEventListener("sf-runtime-ready", () => resolve(globalThis.SF.runtimeModule("lit")), { once: true })));

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
/******/ 	let __webpack_exports__ = __webpack_require__("475ac5c00ebd");
/******/
/******/ })()
;