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

/***/ "3358c85d2142"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bindSwitch: () => (/* binding */ bindSwitch),
/* harmony export */   setSwitchState: () => (/* binding */ setSwitchState),
/* harmony export */   syncSwitchState: () => (/* binding */ syncSwitchState),
/* harmony export */   unbindSwitch: () => (/* binding */ unbindSwitch)
/* harmony export */ });
/* harmony import */ var _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d7f974466839");
/* harmony import */ var _register_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("58661bec99a6");
/* harmony import */ var _form_reset_helper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("67eed2647f47");



const SWITCH_SELECTOR = 'label.sf-switch';
const SWITCH_BOUND_FLAG = 'sfSwitchBound';

function toBoolean(value, defaultValue = false) {
  if (value === undefined || value === null || value === '') return defaultValue;
  if (typeof value === 'boolean') return value;
  const normalized = String(value).toLowerCase();
  return ['1', 'true', 'yes', 'on', 'checked', 'disabled'].includes(normalized);
}

function getSwitchNodes(root) {
  if (!root) return {};
  const input = root.querySelector('input[type="checkbox"]');
  const toggler = root.querySelector('.sf-switch-toggler');
  const inner = root.querySelector('.sf-switch-inner');
  const description = root.querySelector('.sf-switch-description');
  return {
    input,
    toggler,
    inner,
    description
  };
}

function syncSwitchState(root) {
  const {
    input,
    toggler,
    inner,
    description
  } = getSwitchNodes(root);
  if (!input || !toggler || !inner) return;
  const isChecked = !!input.checked;
  const isDisabled = !!input.disabled;
  const onText = root.dataset.sfSwitchOnText || '';
  const offText = root.dataset.sfSwitchOffText || '';
  const hasToggleText = !!(onText && offText);
  root.classList.toggle('active', isChecked);
  root.classList.toggle('disabled', isDisabled); // The thumb used to move by swapping the track's alignment here. No browser
  // animates justify-content, so it jumped to the far end while the fill faded
  // under it. The stylesheet moves it with a transform now, off the same state
  // class as everything else, and the track keeps one alignment for good.

  toggler.removeAttribute('aria-hidden');
  inner.setAttribute('aria-hidden', 'true');

  if (description && hasToggleText) {
    description.textContent = isChecked ? onText : offText;
  }
}

function bindSwitch(root) {
  if (!root || root.dataset[SWITCH_BOUND_FLAG] === '1') return;
  const {
    input
  } = getSwitchNodes(root);
  if (!input) return;

  const handleChange = () => syncSwitchState(root);

  root.__sfSwitchHandleChange = handleChange;
  input.addEventListener('change', handleChange);
  root.__sfSwitchReleaseReset = (0,_form_reset_helper__WEBPACK_IMPORTED_MODULE_2__.bindFormReset)(input, handleChange);
  root.dataset[SWITCH_BOUND_FLAG] = '1';
  syncSwitchState(root);
}

function unbindSwitch(root) {
  if (!root) return;
  root.__sfSwitchReleaseReset?.();
  delete root.__sfSwitchReleaseReset;
  const {
    input
  } = getSwitchNodes(root);

  if (input && root.__sfSwitchHandleChange) {
    input.removeEventListener('change', root.__sfSwitchHandleChange);
  }

  delete root.__sfSwitchHandleChange;
  delete root.dataset[SWITCH_BOUND_FLAG];
}

function initSwitchTree(target) {
  if (!(target instanceof Element) && target !== document) return;

  if (target instanceof Element && target.matches?.(SWITCH_SELECTOR)) {
    bindSwitch(target);
  }

  target.querySelectorAll?.(SWITCH_SELECTOR).forEach(bindSwitch);
}

function setSwitchState(input, state = {}) {
  if (!(input instanceof HTMLInputElement) || input.type !== 'checkbox') {
    return false;
  }

  if (Object.prototype.hasOwnProperty.call(state, 'checked')) {
    input.checked = toBoolean(state.checked);
  }

  if (Object.prototype.hasOwnProperty.call(state, 'disabled')) {
    input.disabled = toBoolean(state.disabled);
  }

  const root = input.closest(SWITCH_SELECTOR);

  if (root) {
    syncSwitchState(root);
  }

  return true;
}

function initExistingSwitches(target = document) {
  initSwitchTree(target);
}

class Switch extends _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__.ComponentObserver {
  static componentName = 'Switch';
  html = null;

  constructor(props) {
    super(props);
    const {
      size = '1',
      title = '',
      label = title,
      description = '',
      help = '',
      checked = false,
      disabled = false,
      name = '',
      on,
      off,
      value
    } = this.params || {};
    const className = this.attrs.class || this.attrs.className;
    this.template = document.createElement('label');

    if (this.id) {
      this.template.id = this.id;
    }

    this.template.classList.add('sf-switch', `sf-switch--size-${size}`, 'flex');

    if (className) {
      this.template.classList.add(...`${className}`.split(' ').filter(Boolean));
    }

    this.toggler = document.createElement('span');
    this.toggler.classList.add('sf-switch-toggler', 'flex', 'items-cross-center');
    this.input = document.createElement('input');
    this.input.type = 'checkbox';
    this.input.setAttribute('role', 'switch');

    if (name) {
      this.input.name = name;
    }

    if (value !== undefined) {
      this.input.value = value;
    }

    this.hasToggleText = !!(off && on);
    this.onText = on || '';
    this.offText = off || '';
    const descriptionText = this.hasToggleText ? toBoolean(checked) ? this.onText : this.offText : description;
    this.input.checked = toBoolean(checked);
    this.input.defaultChecked = this.input.checked;
    this.input.disabled = toBoolean(disabled);

    if (this.hasToggleText) {
      this.template.dataset.sfSwitchOnText = this.onText;
      this.template.dataset.sfSwitchOffText = this.offText;
    }

    Object.entries(this.attrs).filter(([attr]) => !['class', 'className', 'on', 'off'].includes(attr)).forEach(([attr, attrValue]) => {
      if (attrValue === undefined || attrValue === null) return;
      this.input.setAttribute(attr, attrValue);
    });
    this.inner = document.createElement('span'); // The component owns the motion now; the utility would override it with
    // its own clock and its own list of properties.

    this.inner.classList.add('sf-switch-inner');
    this.inner.setAttribute('aria-hidden', 'true');
    this.toggler.append(this.input, this.inner);
    this.template.append(this.toggler);

    if (label || descriptionText || help) {
      this.containerWrap = document.createElement('span');
      this.containerWrap.classList.add('sf-switch-container-wrap', 'flex', 'flex-col', 'text-start', 'flex-1');

      if (label || help) {
        this.top = document.createElement('span');
        this.top.classList.add('sf-switch-top', 'flex');

        if (label) {
          this.container = document.createElement('span');
          this.container.classList.add('sf-switch-container', 'flex', 'items-cross-center', 'content-main-center');
          this.text = document.createElement('span');
          this.text.classList.add('sf-switch-text');
          this.text.textContent = label;
          this.container.append(this.text);
          this.top.append(this.container);
        }

        if (help) {
          this.helpIcon = document.createElement('i');
          this.helpIcon.classList.add('sf-icon');
          this.helpIcon.setAttribute('aria-hidden', 'true');
          this.helpIcon.textContent = help;
          this.top.append(this.helpIcon);
        }

        this.containerWrap.append(this.top);
      }

      if (descriptionText) {
        this.description = document.createElement('span');
        this.description.classList.add('sf-switch-description');
        this.description.textContent = descriptionText;
        this.containerWrap.append(this.description);
      }

      this.template.append(this.containerWrap);
    }
  }

  init() {
    bindSwitch(this.template);
  }

  destroyInternal() {
    if (!this.template) return;
    unbindSwitch(this.template);
  }

}

(0,_register_helper__WEBPACK_IMPORTED_MODULE_1__["default"])('Switch', Switch);

if (typeof window !== 'undefined') {
  window.SF = window.SF || {};
  window.SF.Switch = window.SF.Switch || {};
  window.SF.Switch.setState = setSwitchState;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initExistingSwitches());
} else {
  initExistingSwitches();
}

const switchObserver = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (!(node instanceof Element)) return;
      initSwitchTree(node);
    });
  });
});
switchObserver.observe(document.documentElement, {
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

/***/ "778671c79fa6"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   INHERITED_RESET_EVENT: () => (/* binding */ INHERITED_RESET_EVENT),
/* harmony export */   INHERITED_TEXT: () => (/* binding */ INHERITED_TEXT),
/* harmony export */   InheritedValueField: () => (/* binding */ InheritedValueField),
/* harmony export */   inheritedStepDown: () => (/* binding */ inheritedStepDown),
/* harmony export */   renderInheritedSlot: () => (/* binding */ renderInheritedSlot)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ddf1cdb42ecc");
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("0d662e4d7d63");
/* harmony import */ var _inherited_value_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("c6c9dfe31af4");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_1__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__);


 // An inherited value, for every field of the input family (simai/ui-source#28).
//
// A setting whose empty value means «use what the parent says» -- a letter's
// colour from the brand, a page's font from the theme -- has two states a field
// must tell apart: «not set, so the parent's value applies» and «set, to
// something that may even equal it». Only the first follows the parent when the
// parent changes. A placeholder alone draws the first as if it were a value
// (ui-mail polish audit B2, P-15), and there was no way back to it once a
// person had typed.
//
// So a field that opts in takes `inherited-value`: while it holds no value of
// its own it shows that value in the placeholder ink with a small «inherited»
// marker, and the form gets an empty value. Once it holds a value of its own,
// the marker gives way to a reset button that empties the field again. The
// record views of package larena already draw a field's `inheritedValue` this
// way (property-view port 1.8.0 and later); this is the same state on the
// controls themselves, so a record view can hand it down rather than draw it
// beside them.
//
// Written once here and opted into by each control, which says only what its
// own value is, how to empty it and what takes focus: sf-input, sf-textarea,
// sf-dropdown, sf-color and sf-switch.

const INHERITED_RESET_EVENT = 'sf-field:reset'; // The marker and the reset, in the page's language. A product names its own
// words with `inherited-text` and `reset-label`, or registers a language.

const INHERITED_TEXT = {
  en: {
    inherited: 'inherited',
    reset: 'Reset to inherited',
    described: 'Inherited: {value}'
  },
  ru: {
    inherited: 'наследуется',
    reset: 'Сбросить к наследуемому',
    described: 'Наследуется: {value}'
  }
}; // Each control declares the three in its own props -- inherited-value,
// inherited-text and reset-label -- written out rather than spread from here, so
// the manifest check that reads a component's props sees them.
// The marker and the reset are one step down the ladder from the field they
// sit in, so they fit inside its box: a size 1 field (40px) holds a size 1/2
// button (32px) with the same inset on every side.

const STEP_DOWN = Object.freeze({
  '1/2': '1/3',
  '1': '1/2',
  '2': '1'
});
const inheritedStepDown = size => STEP_DOWN[String(size)] || '1/2';
/**
 * The mixin a control opts in with. The control supplies:
 *   - `inheritedOwnValue()` -- its own value as a string, '' when it has none;
 *   - `clearOwnValue()` -- empties it, firing the control's own input/change;
 *   - `inheritedFocusTarget()` -- the element that takes focus after a reset;
 * and may override `inheritedDisplayValue()` (what the inherited value reads
 * as -- a dropdown shows the option's label, not its machine value).
 */

const InheritedValueField = Base => class extends Base {
  constructor() {
    super(); // Typing changes the state without a redraw: the native field holds the
    // text, and redrawing on every key would fight it.

    this.__sfInheritedSync = () => this.syncInheritedState();

    this.addEventListener('input', this.__sfInheritedSync);
    this.addEventListener('change', this.__sfInheritedSync);
  }

  get inheritedValue() {
    return this.getAttribute('inherited-value') || '';
  }

  set inheritedValue(next) {
    if (next === null || next === undefined || next === '') this.removeAttribute('inherited-value');else this.setAttribute('inherited-value', String(next));
  }

  get inheritedText() {
    return this.getAttribute('inherited-text') || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(INHERITED_TEXT, 'inherited', this);
  }

  get resetLabel() {
    return this.getAttribute('reset-label') || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(INHERITED_TEXT, 'reset', this);
  }

  get hasInheritedValue() {
    return this.inheritedValue !== '';
  } // True while the field holds nothing of its own and the inherited value
  // applies. False without an inherited value: an empty field is then empty.


  get isInherited() {
    return this.hasInheritedValue && this.inheritedOwnValue() === '';
  }

  inheritedOwnValue() {
    return String(this.value ?? '');
  }

  inheritedDisplayValue() {
    return this.inheritedValue;
  }

  inheritedFocusTarget() {
    return null;
  }

  clearOwnValue() {
    this.value = '';
  } // What a screen reader hears beside the name while the value is inherited.


  inheritedDescription() {
    return (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(INHERITED_TEXT, 'described', this).replace('{value}', this.inheritedDisplayValue());
  }
  /**
   * Back to the inherited value. Fires `sf-field:reset` first, cancellable:
   * a host that must confirm or refuse calls preventDefault and nothing
   * changes. Returns whether the field was reset.
   */


  resetToInherited() {
    if (!this.hasInheritedValue || this.inheritedOwnValue() === '') return false;
    if (this.hasAttribute('disabled') || this.hasAttribute('readonly')) return false;
    const event = new CustomEvent(INHERITED_RESET_EVENT, {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: {
        value: this.inheritedOwnValue(),
        inheritedValue: this.inheritedValue,
        name: this.getAttribute('name') || ''
      }
    });
    if (!this.dispatchEvent(event)) return false;
    this.clearOwnValue();
    this.syncInheritedState(); // The button that was pressed is gone, so focus goes where the person
    // works: the control itself. Left on a hidden button, it would fall to the
    // page and a keyboard user would start over from the top.

    const focus = () => this.inheritedFocusTarget()?.focus?.({
      preventScroll: true
    });

    focus();
    if (!this.contains(document.activeElement)) requestAnimationFrame(focus);
    return true;
  } // The state, drawn without a redraw: the host says it, the marker and the
  // reset swap, and the control carries the description. Each control calls it
  // at the end of its own afterRender, which the controls override without
  // calling up, so the mixin cannot hook it for them.


  syncInheritedState() {
    if (!this.hasInheritedValue && !this.__sfInheritedDescribed) {
      this.removeAttribute('data-inherited');
      return;
    }

    const inherited = this.isInherited;
    const own = this.hasInheritedValue && !inherited;
    if (inherited) this.setAttribute('data-inherited', 'true');else this.removeAttribute('data-inherited');
    this.querySelectorAll(':scope [data-inherited-marker]').forEach(node => {
      node.hidden = !inherited;
    });
    this.querySelectorAll(':scope [data-inherited-reset]').forEach(node => {
      node.hidden = !own;
    });
    const control = this.inheritedFocusTarget();
    if (!control) return;

    if (inherited) {
      control.setAttribute('aria-description', this.inheritedDescription());
      this.__sfInheritedDescribed = control;
    } else if (this.__sfInheritedDescribed === control) {
      control.removeAttribute('aria-description');
      this.__sfInheritedDescribed = null;
    }
  }

};
/**
 * The marker and the reset, for a control's trailing slot. Nothing at all
 * without an inherited value, so a field that does not use it is unchanged.
 */

function renderInheritedSlot(component, {
  size = '1',
  disabled = false,
  className = ''
} = {}) {
  if (!component?.hasInheritedValue) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const step = inheritedStepDown(size);
  const inherited = component.isInherited;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <span class="sf-field-inherited-slot sf-field-inherited-slot--size-${size} flex items-cross-center ${className}">
      <span class="sf-field-inherited sf-field-inherited--size-${step}"
            data-inherited-marker
            aria-hidden="true"
            ?hidden=${!inherited}>${component.inheritedText}</span>
      <button
        type="button"
        class="sf-field-reset sf-icon-button sf-icon-button--icon sf-icon-button--on-surface sf-icon-button--link sf-icon-button--size-${step}"
        data-inherited-reset
        aria-label=${component.resetLabel}
        title=${component.resetLabel}
        ?hidden=${inherited}
        ?disabled=${disabled}
        @click=${event => {
    // Inside a field's <label>, a press would also reach the control the
    // label is for -- a dropdown would open, a switch would flip.
    event.preventDefault();
    event.stopPropagation();
    component.resetToInherited();
  }}
      ><i class="sf-icon" aria-hidden="true">restart_alt</i></button>
    </span>
  `;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "70333283d751"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("fbe0570fcc69");
/* harmony import */ var _component_switch_js_switch__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("3358c85d2142");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("d39911485561");
/* harmony import */ var _helpers_checkableReset__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("078aa87e580e");
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("0d662e4d7d63");
/* harmony import */ var _helpers_inherited_value__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("778671c79fa6");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _js_templates_default__WEBPACK_IMPORTED_MODULE_2__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_4__, _helpers_inherited_value__WEBPACK_IMPORTED_MODULE_5__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _js_templates_default__WEBPACK_IMPORTED_MODULE_2__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_4__, _helpers_inherited_value__WEBPACK_IMPORTED_MODULE_5__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_core_js_page_language__WEBPACK_IMPORTED_MODULE_4__);






const SWITCH_TEXT = {
  en: {
    on: 'on',
    off: 'off'
  },
  ru: {
    on: 'включено',
    off: 'выключено'
  }
};

class SfSwitch extends (0,_helpers_inherited_value__WEBPACK_IMPORTED_MODULE_5__.InheritedValueField)((_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default())) {
  static get props() {
    return {
      size: {
        default: '1'
      },
      label: {
        default: ''
      },
      description: {
        default: ''
      },
      help: {
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
      },
      ariaLabel: {
        attribute: 'aria-label',
        default: ''
      },
      // Whether the switch is on while it holds no value of its own
      // (simai/ui-source#28): `true`/`on` or `false`/`off`.
      inheritedValue: {
        attribute: 'inherited-value',
        default: ''
      },
      inheritedText: {
        attribute: 'inherited-text',
        default: ''
      },
      resetLabel: {
        attribute: 'reset-label',
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

  get label() {
    return this.getAttribute('label') || '';
  } // A switch inside a field that is already labelled -- a record panel draws the
  // label beside the control -- still needs a name. Like sf-checkbox and
  // sf-button, it comes from the host's aria-label or the ariaLabel prop and
  // lands on the native input, so the label is not printed a second time.


  get ariaLabel() {
    return this.getProp('ariaLabel') || '';
  }

  get description() {
    return this.getAttribute('description') || '';
  }

  get help() {
    return this.getAttribute('help') || '';
  }

  get checked() {
    return this.getBooleanAttr('checked', false);
  }

  set checked(nextValue) {
    this._writeChecked(!!nextValue);
  } // With an inherited value, «off» is a value of its own and must be told from
  // «nothing chosen»: it is kept as checked="false", and no `checked` at all
  // means the inherited state applies. Without one, a switch is on or off and
  // nothing else, as it always was.


  _writeChecked(on) {
    if (on) this.setAttribute('checked', '');else if (this.hasInheritedValue) this.setAttribute('checked', 'false');else this.removeAttribute('checked');
  }

  get inheritedOn() {
    return this.toBoolean(this.inheritedValue, false);
  } // The inherited-value seam. The own value is whether `checked` is there at
  // all; the native checkbox is the focus and carries the description.


  inheritedOwnValue() {
    if (!this.hasAttribute('checked')) return '';
    return this.checked ? 'on' : 'off';
  }

  inheritedDisplayValue() {
    return (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_4__.pageText)(SWITCH_TEXT, this.inheritedOn ? 'on' : 'off', this);
  }

  inheritedFocusTarget() {
    return this.getInputElement();
  } // Back to no value of its own: the knob goes where the inherited value puts
  // it, and the host says change, as a flip does.


  clearOwnValue() {
    this.removeAttribute('checked');
    const input = this.getInputElement();
    if (input) input.checked = this.inheritedOn;
    this.dispatchEvent(new Event('change', {
      bubbles: true
    }));
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
    const inherited = this.isInherited;
    return this.createTemplateContext({ ...props,
      // While the inherited state applies the knob shows it, and the form gets
      // nothing: the checkbox is not named, so it submits no value.
      checked: inherited ? this.inheritedOn : props.checked,
      name: inherited ? '' : props.name,
      component: this
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_2__.renderSwitchTemplate)(this.templateContext());
  }

  afterRender() {
    this._releaseReset?.();
    this._releaseReset = null;

    if (this._boundRoot) {
      (0,_component_switch_js_switch__WEBPACK_IMPORTED_MODULE_1__.unbindSwitch)(this._boundRoot);
      this._boundRoot = null;
    }

    this._boundRoot = this.querySelector('.sf-switch');

    if (this._boundRoot) {
      (0,_component_switch_js_switch__WEBPACK_IMPORTED_MODULE_1__.bindSwitch)(this._boundRoot);
      const input = this.getInputElement();

      if (input) {
        (0,_component_switch_js_switch__WEBPACK_IMPORTED_MODULE_1__.setSwitchState)(input, {
          // While inherited, the knob is where the inherited value puts it.
          checked: this.isInherited ? this.inheritedOn : this.checked,
          disabled: this.disabled
        });
        input.addEventListener('change', this._handleChange);
        this._releaseReset = (0,_helpers_checkableReset__WEBPACK_IMPORTED_MODULE_3__.bindCheckableReset)(this, input);
      }
    }

    this.syncInheritedState();
  }

  onDisconnected() {
    this._releaseReset?.();
    this._releaseReset = null;
    const input = this.getInputElement();

    if (input) {
      input.removeEventListener('change', this._handleChange);
    }

    if (this._boundRoot) {
      (0,_component_switch_js_switch__WEBPACK_IMPORTED_MODULE_1__.unbindSwitch)(this._boundRoot);
      this._boundRoot = null;
    }
  }

  _handleChange = () => {
    const input = this.getInputElement();
    if (!input) return;

    this._writeChecked(input.checked); // The first flip of an inherited switch gives it a value of its own, and the
    // form its name back.


    if (this.hasInheritedValue && this.name && input.name !== this.name) input.name = this.name;
  };

  getInputElement() {
    return this.querySelector('.sf-switch input[type="checkbox"]');
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
      checked: !!input?.checked,
      disabled: !!input?.disabled,
      name: input?.name || '',
      value: input?.value || ''
    };
  }

  setState(nextState = {}) {
    const input = this.getInputElement();

    if (!input) {
      super.setState(nextState);
      return this;
    }

    (0,_component_switch_js_switch__WEBPACK_IMPORTED_MODULE_1__.setSwitchState)(input, nextState);

    if (Object.prototype.hasOwnProperty.call(nextState, 'checked')) {
      this._writeChecked(this.toBoolean(nextState.checked));
    }

    if (Object.prototype.hasOwnProperty.call(nextState, 'disabled')) {
      if (this.toBoolean(nextState.disabled)) {
        this.setAttribute('disabled', '');
      } else {
        this.removeAttribute('disabled');
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

SfSwitch.define('sf-switch');
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "d39911485561"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderSwitchTemplate: () => (/* binding */ renderSwitchTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ddf1cdb42ecc");
/* harmony import */ var _helpers_inherited_value__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("778671c79fa6");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, _helpers_inherited_value__WEBPACK_IMPORTED_MODULE_1__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, _helpers_inherited_value__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);


function renderSwitchTemplate(context) {
  const {
    size,
    label,
    description,
    help,
    checked,
    disabled,
    name,
    value,
    ariaLabel
  } = context;
  const rootClasses = ['sf-switch', `sf-switch--size-${size}`, 'flex', context.rootClass];
  const labelContent = context.component?.hasSlotContent?.('label') ? context.component.getSlotContent('label') : label ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-switch-text">${label}</span>` : '';
  const descriptionContent = context.component?.hasSlotContent?.('description') ? context.component.getSlotContent('description') : description ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-switch-description">${description}</span>` : '';
  const helpContent = context.component?.hasSlotContent?.('help') ? context.component.getSlotContent('help') : help ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class="sf-icon" aria-hidden="true">${help}</i>` : '';
  const showContainer = !!(labelContent || descriptionContent || helpContent);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <label class=${rootClasses.filter(Boolean).join(' ')} style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
      <span class="sf-switch-toggler transition flex items-cross-center content-main-start">
        <input
          type="checkbox"
          role="switch"
          name=${name || ''}
          .value=${value || ''}
          .checked=${checked}
          ?disabled=${disabled}
          aria-label=${!labelContent && ariaLabel ? ariaLabel : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        />
        <span class="sf-switch-inner transition" aria-hidden="true"></span>
      </span>

      ${showContainer ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
            <span class="sf-switch-container-wrap flex flex-col">
              ${labelContent || helpContent ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                    <span class="sf-switch-top flex">
                      ${labelContent ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                            <span class="sf-switch-container flex items-cross-center content-main-center">
                              ${labelContent}
                            </span>
                          ` : ''}
                      ${helpContent}
                    </span>
                  ` : ''}
              ${descriptionContent}
            </span>
          ` : ''}
      ${(0,_helpers_inherited_value__WEBPACK_IMPORTED_MODULE_1__.renderInheritedSlot)(context.component, {
    size,
    disabled,
    className: 'sf-switch-inherited'
  })}
    </label>
  `;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "c6c9dfe31af4"
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
/******/ 	let __webpack_exports__ = __webpack_require__("70333283d751");
/******/
/******/ })()
;