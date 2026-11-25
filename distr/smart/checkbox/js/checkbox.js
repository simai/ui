/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "61d50f69160a"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CHECKBOX_TEXT_PARTS: () => (/* binding */ CHECKBOX_TEXT_PARTS),
/* harmony export */   RADIO_TEXT_PARTS: () => (/* binding */ RADIO_TEXT_PARTS),
/* harmony export */   SWITCH_TEXT_PARTS: () => (/* binding */ SWITCH_TEXT_PARTS),
/* harmony export */   keepHelpOutOfLabel: () => (/* binding */ keepHelpOutOfLabel),
/* harmony export */   linkCheckableText: () => (/* binding */ linkCheckableText)
/* harmony export */ });
/* harmony import */ var _core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("e92fd2d1a38c");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var _core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_0__);
 // A checkable control's name is its label alone; its description is the
// description (standard simai.smart-component 1.3.8 §4.8; simai/ui-source#44).
// The box, the label and the description sit inside one <label> so a press
// anywhere toggles the control, and a <label> names its control by all of its
// text: «Приглашения на мероприятия Не чаще раза в месяц» was read as one name.
// The input is named by the label row (aria-labelledby) and described by the
// rest of the text column (aria-describedby). An author's aria-label or
// aria-labelledby wins; ids the author put on aria-describedby are kept. Ids
// come from the instance path, never a counter (#41).
//
// sf-switch was fixed this way first (1.3.1, its own copy in _switch.js);
// sf-checkbox and sf-radio share the anatomy and read this helper.
//
// parts:
//   kind         the Smart tag (`sf-checkbox`)
//   classKind    the root class of class markup (`sf-checkbox`, `sf-radio-button`)
//   text         selector of the label text inside the label row: the name;
//                the help mark beside it is a button with a name of its own
//                and is left out (the row is the name when there is no text
//                part, as in class markup without one)
//   label        selector of the label row inside the root
//   column       selector of the text column that holds the label row and the description
//   description  selector of the description when there is no column

function splitIds(value) {
  return String(value || '').split(/\s+/).filter(Boolean);
}

function descriptionParts(root, parts) {
  const column = parts.column ? root.querySelector(parts.column) : null;
  if (!column) return parts.description ? [...root.querySelectorAll(parts.description)] : [];
  const label = root.querySelector(parts.label) || parts.text && root.querySelector(parts.text);
  return [...column.children].filter(node => node !== label && !node.contains(label) && !node.hasAttribute('aria-hidden') && node.textContent.trim());
}

function linkCheckableText(root, parts) {
  if (!root) return;
  const input = root.querySelector('input[type="checkbox"], input[type="radio"]');
  if (!input) return;
  const smart = root.closest(parts.kind);
  const owner = smart || root;
  const kind = smart ? parts.kind : parts.classKind; // A control built before it is placed has no path yet: link it once it is.

  if (!(0,_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_0__.pathIsSettled)(owner)) {
    if (!root.__sfCheckableLinkPending && typeof requestAnimationFrame === 'function') {
      root.__sfCheckableLinkPending = true;
      requestAnimationFrame(() => {
        root.__sfCheckableLinkPending = false;
        if ((0,_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_0__.pathIsSettled)(owner)) linkCheckableText(root, parts);
      });
    }

    return;
  }

  const path = (0,_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_0__.instancePath)(owner, {
    kind
  });
  const linked = root.__sfCheckableLinked || {
    label: '',
    described: []
  };
  const label = parts.text && root.querySelector(parts.text) || root.querySelector(parts.label);
  const ownLabel = linked.label && input.getAttribute('aria-labelledby') === linked.label;

  if (label && label.textContent.trim() && !input.hasAttribute('aria-label') && (ownLabel || !input.hasAttribute('aria-labelledby'))) {
    if (!label.id) label.id = (0,_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_0__.partId)(path, 'label');
    input.setAttribute('aria-labelledby', label.id);
    linked.label = label.id;
  } else if (ownLabel) {
    input.removeAttribute('aria-labelledby');
    linked.label = '';
  }

  const ids = descriptionParts(root, parts).map((node, index) => {
    if (!node.id) node.id = (0,_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_0__.partId)(path, index ? `description-${index + 1}` : 'description');
    return node.id;
  });
  const authored = splitIds(input.getAttribute('aria-describedby')).filter(id => !linked.described.includes(id));
  const describedBy = [...new Set([...authored, ...ids])];
  if (describedBy.length) input.setAttribute('aria-describedby', describedBy.join(' '));else input.removeAttribute('aria-describedby');
  linked.described = ids; // The <label> names its control by `for`, not by the first control inside
  // it: the help mark is a button, and with the box at the end
  // (position="end") the button came first and a press on the text pressed
  // the help.

  if (root instanceof HTMLLabelElement && !root.htmlFor) {
    if (!input.id) input.id = (0,_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_0__.partId)(path, 'input');
    root.htmlFor = input.id;
  }

  root.__sfCheckableLinked = linked;
} // A press that comes from the help (the sf-help-mark of the help setting, or
// what the help slot holds) is the help's, never the control's: the <label>
// around both must not toggle. The press cancels the label's activation (the
// «?» button has no default of its own, its listener still opens the help);
// a link or a field in the explanation keeps its own default, which the label
// leaves alone as interactive content. Read on the <label> as its click
// listener.

function keepHelpOutOfLabel(event) {
  const label = event.currentTarget;
  const target = event.target;
  if (!(target instanceof Element) || !(label instanceof Element)) return;
  const help = target.closest('sf-help-mark, [slot="help"]');
  if (!help || !label.contains(help)) return;
  const own = target.closest('a[href], input, select, textarea, summary');
  if (own && help.contains(own)) return;
  event.preventDefault();
}
const CHECKBOX_TEXT_PARTS = Object.freeze({
  kind: 'sf-checkbox',
  classKind: 'sf-checkbox',
  text: '.sf-checkbox-label, [data-sf-checkbox-label]',
  label: '.sf-checkbox-top',
  column: '.sf-checkbox-container',
  description: '.sf-checkbox-description'
});
const RADIO_TEXT_PARTS = Object.freeze({
  kind: 'sf-radio',
  classKind: 'sf-radio-button',
  text: '.sf-radio-button-text, [data-sf-radio-label]',
  label: '.sf-radio-button-top',
  column: '.sf-radio-button-container',
  description: '.sf-radio-button-description'
}); // sf-switch reads the same binding since C63 W9 (it had its own copy in
// component/switch/js/_switch.js, written first, the same algorithm).

const SWITCH_TEXT_PARTS = Object.freeze({
  kind: 'sf-switch',
  classKind: 'sf-switch',
  text: '.sf-switch-container',
  label: '.sf-switch-top',
  column: '.sf-switch-container-wrap',
  description: '.sf-switch-description'
});
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "9b5005c560e4"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bindCheckbox: () => (/* binding */ bindCheckbox),
/* harmony export */   preloadCheckboxIcons: () => (/* binding */ preloadCheckboxIcons),
/* harmony export */   resolveCheckboxIcon: () => (/* binding */ resolveCheckboxIcon),
/* harmony export */   setCheckboxState: () => (/* binding */ setCheckboxState),
/* harmony export */   syncCheckboxState: () => (/* binding */ syncCheckboxState),
/* harmony export */   unbindCheckbox: () => (/* binding */ unbindCheckbox)
/* harmony export */ });
/* harmony import */ var _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d7f974466839");
/* harmony import */ var _register_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("58661bec99a6");
/* harmony import */ var _form_reset_helper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("67eed2647f47");
/* harmony import */ var _checkable_text_helper__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("61d50f69160a");
/* harmony import */ var _json_checkbox_utility_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("2eddfed602cd");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_checkable_text_helper__WEBPACK_IMPORTED_MODULE_3__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
_checkable_text_helper__WEBPACK_IMPORTED_MODULE_3__ = __webpack_async_dependencies_result__[0];





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
} // The box's glyphs are asked for when the first box binds, with the page's
// first icons: a box that starts unchecked names no glyph, so the first
// subset font had no «check», and the first tick stayed unseen until a second
// font came (the Loader draws a glyph only from a font it has). Once per
// bundle; the Loader asks nothing for a name it already has.


let boxIconsAsked = false;
function preloadCheckboxIcons() {
  if (boxIconsAsked) return false;
  const loader = globalThis.SF?.Loader;
  if (typeof loader?.preloadIcons !== 'function') return false;
  boxIconsAsked = true;
  loader.preloadIcons(['check', 'remove']);
  return true;
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
  preloadCheckboxIcons();
  syncCheckboxState(root);
  (0,_checkable_text_helper__WEBPACK_IMPORTED_MODULE_3__.linkCheckableText)(root, _checkable_text_helper__WEBPACK_IMPORTED_MODULE_3__.CHECKBOX_TEXT_PARTS);
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

Checkbox.utilityMap = _json_checkbox_utility_json__WEBPACK_IMPORTED_MODULE_4__;
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

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "67eed2647f47"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bindFormReset: () => (/* binding */ bindFormReset)
/* harmony export */ });
// Reset fires before the browser restores default values. Synchronize afterwards
// without synthesizing input/change events or retaining detached controls.
//
// One capture listener per document, while a control is bound to it: the first
// binding adds it and the last release takes it away, so a removed instance
// leaves nothing on the document. It used to stay for the page's life, added
// by whichever instance bound first; when that was an instance placed after
// the page settled (a closed layer's field starting late), the instance scope
// gate read it as that instance's leak (gate 36, 2026-11-11). Every bundle
// carries its own copy of this module, so the listener and the subscriptions
// live on the document, shared by the copies: one listener, not one per bundle.
const REGISTRY = Symbol.for('sf.formReset');

function registryOf(doc) {
  let registry = doc[REGISTRY];

  if (!registry) {
    registry = {
      subscriptions: new WeakMap(),
      bound: 0,
      listener: null
    };
    Object.defineProperty(doc, REGISTRY, {
      value: registry,
      configurable: true
    });
  }

  return registry;
}

function listen(doc, registry) {
  registry.listener = event => {
    const form = event.target;
    if (form?.tagName !== 'FORM') return;
    const controls = Array.from(form.elements);
    setTimeout(() => {
      if (event.defaultPrevented) return;

      for (const control of controls) {
        if (!control.isConnected || control.form !== form) continue;

        for (const callback of registry.subscriptions.get(control) || []) callback();
      }
    }, 0);
  };

  doc.addEventListener('reset', registry.listener, true);
}

function bindFormReset(input, synchronize) {
  const doc = input.ownerDocument;
  const registry = registryOf(doc);
  if (!registry.listener) listen(doc, registry);
  let callbacks = registry.subscriptions.get(input);
  if (!callbacks) registry.subscriptions.set(input, callbacks = new Set());
  callbacks.add(synchronize);
  registry.bound += 1;
  let released = false;
  return () => {
    if (released) return false;
    released = true;
    callbacks.delete(synchronize);
    registry.bound -= 1;

    if (registry.bound <= 0 && registry.listener) {
      doc.removeEventListener('reset', registry.listener, true);
      registry.listener = null;
      registry.bound = 0;
    }

    return true;
  };
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
/* harmony import */ var _component_checkable_text_helper__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("61d50f69160a");
/* harmony import */ var _helpers_form_field__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("38ea8d53f301");
/* harmony import */ var _helpers_checkable_row__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("496db683b2c5");
/* harmony import */ var _core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("e92fd2d1a38c");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("47e9950fb20b");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("0f14f861d828");
/* harmony import */ var _lang_index_mjs__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("38f4a3b01f2c");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _component_checkbox_js_checkbox__WEBPACK_IMPORTED_MODULE_2__, _js_templates_default__WEBPACK_IMPORTED_MODULE_3__, _component_checkable_text_helper__WEBPACK_IMPORTED_MODULE_5__, _helpers_checkable_row__WEBPACK_IMPORTED_MODULE_7__, _core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_8__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _component_checkbox_js_checkbox__WEBPACK_IMPORTED_MODULE_2__, _js_templates_default__WEBPACK_IMPORTED_MODULE_3__, _component_checkable_text_helper__WEBPACK_IMPORTED_MODULE_5__, _helpers_checkable_row__WEBPACK_IMPORTED_MODULE_7__, _core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_8__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_8__);











 // Only the words on screen ship in the bundle, English only (owner decision
// C282): Russian and every other language come from a language file. The
// title, settings and events stay in the language files for the Studio and the
// docs (localization study LC-2).
// sf-checkbox from its component.json (standard simai.smart-component 1.3.8
// §3, §4, §17.1, §17.2). The settings and the values checked and
// indeterminate are made by core/js/element-manifest.js; `error` is a dated
// alias of `invalid` (§17.2, aliases.json); the host is the form control
// through ElementInternals, so a checked box submits its value, "on" without
// one, as a native checkbox does (§17.1 item 2), and the inner checkbox
// carries no name.

const CheckboxElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_9__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: _lang_index_mjs__WEBPACK_IMPORTED_MODULE_11__.files,
  source: 'ru',
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_10__
});

class SfCheckbox extends (0,_helpers_form_field__WEBPACK_IMPORTED_MODULE_6__.FormField)(CheckboxElement) {
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
    this._parentWatch = null;
  }

  connectedCallback() {
    super.connectedCallback(); // The tick and the dash are asked for before the first box draws, with
    // the page's first icons: an unchecked box names no glyph, and its first
    // tick waited for a second icon font.

    (0,_component_checkbox_js_checkbox__WEBPACK_IMPORTED_MODULE_2__.preloadCheckboxIcons)();
  } // The checkboxes a parent stands for (controls, owner decision C165 (2)):
  // the elements its ids name now -- sf-checkbox hosts or plain checkbox
  // inputs -- in the page or the shadow root the parent stands in.


  controlledBoxes() {
    const ids = String(this.getAttribute('controls') || '').split(/\s+/u).filter(Boolean);
    if (!ids.length) return [];
    const root = this.getRootNode?.() || document;
    return ids.map(id => root.getElementById?.(id) || document.getElementById(id)).filter(node => node && node !== this && (node.localName === 'sf-checkbox' || node.matches?.('input[type="checkbox"]')));
  }

  static boxInput(node) {
    return node.localName === 'sf-checkbox' ? node.querySelector('.sf-checkbox input[type="checkbox"]') : node;
  }

  static boxChecked(node) {
    if (node.localName === 'sf-checkbox') return node.hasAttribute('checked') || Boolean(SfCheckbox.boxInput(node)?.checked);
    return Boolean(node.checked);
  } // The parent's own state from its children: all, some, none.


  syncFromControlled() {
    const boxes = this.controlledBoxes();
    if (!boxes.length || this._parentPressing) return;
    const on = boxes.filter(node => SfCheckbox.boxChecked(node)).length;
    const all = on === boxes.length;
    const some = on > 0 && !all;

    if (this.hasAttribute('checked') !== all || this.hasAttribute('indeterminate') !== some) {
      this.setState({
        checked: all,
        indeterminate: some
      });
    }

    const input = this.getInputElement();
    if (input) input.setAttribute('aria-controls', boxes.map(node => node.id).join(' '));
  } // A press on the parent: all of them checked, or all unchecked when all
  // were; each one that changes says change, as a press of it would.


  pressControlled() {
    const boxes = this.controlledBoxes();
    if (!boxes.length) return; // A disabled child is counted in the state and never changed; the press
    // turns on the ones that can change unless all of those are already on.

    const free = boxes.filter(node => !SfCheckbox.boxInput(node)?.disabled);
    const next = !free.every(node => SfCheckbox.boxChecked(node));
    this._parentPressing = true;

    try {
      for (const node of boxes) {
        const input = SfCheckbox.boxInput(node);
        if (!input || input.disabled || Boolean(input.checked) === next) continue;
        input.checked = next;
        input.dispatchEvent(new Event('input', {
          bubbles: true,
          composed: true
        }));
        input.dispatchEvent(new Event('change', {
          bubbles: true
        }));
      }
    } finally {
      this._parentPressing = false;
    }

    this.syncFromControlled();
  } // Watches the children while controls names some: a change event from the
  // page (heard at the document, so a child drawn later counts too) and the
  // checked and indeterminate attributes a property or a page sets.


  watchControlled() {
    this._parentWatch?.();
    this._parentWatch = null;
    if (!this.getAttribute('controls')) return;
    const doc = this.ownerDocument;

    const ids = () => new Set(String(this.getAttribute('controls') || '').split(/\s+/u).filter(Boolean));

    const onChange = event => {
      const host = event.target?.closest?.('sf-checkbox') || event.target;
      if (host && ids().has(host.id) && host !== this) this.syncFromControlled();
    };

    doc.addEventListener('change', onChange);
    const observer = new MutationObserver(records => {
      if (records.some(record => record.target !== this && ids().has(record.target.id))) this.syncFromControlled();
    });
    observer.observe(doc.documentElement, {
      subtree: true,
      attributes: true,
      attributeFilter: ['checked', 'disabled']
    });
    const late = requestAnimationFrame(() => this.syncFromControlled());

    this._parentWatch = () => {
      doc.removeEventListener('change', onChange);
      observer.disconnect();
      cancelAnimationFrame(late);
    };
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
      name: (0,_helpers_form_field__WEBPACK_IMPORTED_MODULE_6__.innerControlName)(this, context.name),
      stateIcon: this.stateIcon,
      // The error line's id (error-message, FO-1): the input is described by it.
      messageId: (0,_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_8__.partId)((0,_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_8__.instancePath)(this, {
        kind: 'sf-checkbox'
      }), 'error'),
      ariaLabel: this.ariaLabel,
      // The help button is named by its subject («Подробнее: Сохранять черновики»).
      helpLabel: context.help && context.label ? this.sfWord('help', {
        vars: {
          label: context.label
        }
      }) : ''
    });
  }

  async afterRender() {
    await this.whenChildrenDefined();
    const input = this.getInputElement();
    if (!input) return;
    this.syncInputState(input); // The class binding is skipped inside sf-checkbox; the name and the
    // description are linked here the same way.

    (0,_component_checkable_text_helper__WEBPACK_IMPORTED_MODULE_5__.linkCheckableText)(this.querySelector('.sf-checkbox'), _component_checkable_text_helper__WEBPACK_IMPORTED_MODULE_5__.CHECKBOX_TEXT_PARTS);
    (0,_helpers_checkable_row__WEBPACK_IMPORTED_MODULE_7__.linkCheckableMessage)(this, input);
    this._releaseReset?.();
    this._releaseReset = (0,_helpers_checkableReset__WEBPACK_IMPORTED_MODULE_4__.bindCheckableReset)(this, input);

    if (this._inputElement && this._inputElement !== input) {
      this._inputElement.removeEventListener('change', this._handleChange);
    }

    if (this._inputElement !== input) {
      input.addEventListener('change', this._handleChange);
      this._inputElement = input;
    }

    this.sfSyncFormState(); // A parent (controls, C165 (2)): its state from its children.

    if (this.getAttribute('controls')) {
      if (!this._parentWatch || this._parentWatchFor !== this.getAttribute('controls')) {
        this._parentWatchFor = this.getAttribute('controls');
        this.watchControlled();
      }

      this.syncFromControlled();
    } else if (this._parentWatch) {
      this._parentWatch();

      this._parentWatch = null;
      this._parentWatchFor = null;
      input.removeAttribute('aria-controls');
    }
  }

  onDisconnected() {
    this._parentWatch?.();
    this._parentWatch = null;
    this._parentWatchFor = null;
    this._releaseReset?.();
    this._releaseReset = null;

    if (this._inputElement) {
      this._inputElement.removeEventListener('change', this._handleChange);

      this._inputElement = null;
    }
  }

  _handleChange = () => {
    const input = this.getInputElement();
    if (!input) return; // A parent's press is for its children (controls, C165 (2)).

    if (this.getAttribute('controls') && !this._parentPressing) {
      this.pressControlled();
      this.sfSyncFormState();
      return;
    }

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
/* harmony import */ var _component_checkable_text_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("61d50f69160a");
/* harmony import */ var _helpers_checkable_row__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("496db683b2c5");
/* harmony import */ var _default_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("fcfc3bb80ec7");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, _component_checkable_text_helper__WEBPACK_IMPORTED_MODULE_1__, _helpers_checkable_row__WEBPACK_IMPORTED_MODULE_2__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, _component_checkable_text_helper__WEBPACK_IMPORTED_MODULE_1__, _helpers_checkable_row__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
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

  const labelContent = context.component?.hasSlotContent?.('label') // A slotted label is held in a plain span so the input is named
  // by the label alone (aria-labelledby), not by the help beside it.
  ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span data-sf-checkbox-label>${context.component.getSlotContent('label')}</span>` : label ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-checkbox-label">${label}</span>` : '';
  const descriptionContent = context.component?.hasSlotContent?.('description') // A slotted description is held in a plain span so the input can
  // name it as its description (aria-describedby): a bare text node
  // has no id. The span draws nothing of its own.
  ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span data-sf-checkbox-description>${context.component.getSlotContent('description')}</span>` : description ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-checkbox-description">${description}</span>` : '';
  const helpContent = (0,_helpers_checkable_row__WEBPACK_IMPORTED_MODULE_2__.renderCheckableHelp)(context, 'sf-checkbox-help');
  const showContainer = !!(labelContent || descriptionContent);
  rootClasses.push(...(0,_helpers_checkable_row__WEBPACK_IMPORTED_MODULE_2__.checkableClasses)(size, showContainer));
  const isStart = position === 'start';
  const input = (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <span class="sf-checkbox-box flex">
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
  const control = (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <label class=${rootClasses.filter(Boolean).join(' ')} style=${rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} @click=${_component_checkable_text_helper__WEBPACK_IMPORTED_MODULE_1__.keepHelpOutOfLabel}>
            ${isStart ? input : ''}
            ${(0,_helpers_checkable_row__WEBPACK_IMPORTED_MODULE_2__.renderCheckableText)({
    column: 'sf-checkbox-container',
    top: 'sf-checkbox-top'
  }, labelContent, descriptionContent)}
            ${!isStart ? input : ''}
        </label>
    `;
  return (0,_helpers_checkable_row__WEBPACK_IMPORTED_MODULE_2__.renderCheckableRow)(size, control, helpContent, (0,_helpers_checkable_row__WEBPACK_IMPORTED_MODULE_2__.renderCheckableMessage)(context));
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "496db683b2c5"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CHECKABLE_HELP_SIZE: () => (/* binding */ CHECKABLE_HELP_SIZE),
/* harmony export */   checkableClasses: () => (/* binding */ checkableClasses),
/* harmony export */   linkCheckableMessage: () => (/* binding */ linkCheckableMessage),
/* harmony export */   renderCheckableHelp: () => (/* binding */ renderCheckableHelp),
/* harmony export */   renderCheckableMessage: () => (/* binding */ renderCheckableMessage),
/* harmony export */   renderCheckableRow: () => (/* binding */ renderCheckableRow),
/* harmony export */   renderCheckableText: () => (/* binding */ renderCheckableText)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var _checkable_row_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("42b499506736");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);

 // The shared base of the three choice controls, sf-checkbox, sf-radio and
// sf-switch (audit 2026-11-11 W9, owner decision C63): one text column with a
// help slot, one help mark, one row and one sheet (checkable-row.css) for the
// row's padding, the hit area, the help's size and place. The name and the
// description are linked by src/component/checkable-text-helper.js
// (linkCheckableText) for all three. Each control keeps its own class
// vocabulary (.sf-checkbox-*, .sf-radio-button-*, .sf-switch-*): the class
// markup is public and unchanged; the shared classes are .sf-checkable* on
// what the Smart elements draw.
// The help mark keeps the label's line (the mark adds no height of its own)
// and is the field family's step (field-help.js, DEV msg-e73e6ee2, queue
// msg-fc99b09e: one help size per field): 1/3 beside size 1/2, 1/2 beside
// sizes 1 and 2 -- the «?» a text field and an sf-form field of size 1 draw
// after their label (FS-6). Size 1 drew 1/3 before.

const CHECKABLE_HELP_SIZE = Object.freeze({
  '1/2': '1/3',
  1: '1/2',
  2: '1/2'
}); // The help: what the help slot holds, or a «?» button (sf-help-mark) that
// opens the help setting's explanation.

function renderCheckableHelp(context, className) {
  const component = context.component;
  if (component?.hasSlotContent?.('help')) return component.getSlotContent('help');
  if (!context.help) return '';
  sayBareHelp(context.help, component);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-help-mark class=${className} size=${CHECKABLE_HELP_SIZE[context.size] || '1/3'} text=${context.help} label=${context.helpLabel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}></sf-help-mark>`;
} // The help is an explanation the «?» opens, not a label: a single lowercase
// word such as help="info" is almost always a placeholder (checks study CK-7).
// The development warning says so once per page.

const BARE_HELP_SAID = Symbol.for('sf.checkable.bare-help-said');

function sayBareHelp(help, component) {
  const global = globalThis;
  if (global[BARE_HELP_SAID] || !/^[a-z]+$/u.test(String(help).trim())) return;
  global[BARE_HELP_SAID] = true;
  const name = component?.id ? `#${component.id}` : component?.localName || 'help';
  console.warn(`SIMAI Framework: ${name} has help="${String(help).trim()}". The help is the explanation the «?» opens: write a sentence, or leave help out.`);
} // The text column: the label row (the name), then the description.
//   parts.column  the column's class      (.sf-checkbox-container)
//   parts.top     the label row's class   (.sf-checkbox-top)
//   parts.wrap    a class the label text sits in inside the row, if any


function renderCheckableText(parts, labelContent, descriptionContent) {
  if (!labelContent && !descriptionContent) return '';
  const name = parts.wrap ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class=${parts.wrap}>${labelContent}</span>` : labelContent;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class=${`${parts.column} flex flex-col`}>${labelContent ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class=${`${parts.top} flex`}>${name}</span>` : ''}${descriptionContent}</span>`;
} // The classes the shared sheet reads on the control's <label>.

function checkableClasses(size, hasText) {
  return ['sf-checkable', `sf-checkable--size-${size}`, hasText ? 'sf-checkable--text' : ''];
} // The help mark is the label's sibling in a row, not inside the <label>
// (owner decision C59, as C33 for field labels): pressing «?» is no press on
// the control -- the label and its input never become :active, the box is not
// painted pressed and the value does not change.

function renderCheckableRow(size, control, help, message = '') {
  // The help sits in a box of its own: sf-help-mark's host draws no box
  // (display: contents), so the row places this one.
  const row = help ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class=${`sf-checkable-row sf-checkable--size-${size} flex flex-nowrap items-cross-start`}>${control}<span class="sf-checkable-help">${help}</span></span>` : control;
  if (!message) return row;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class=${`sf-checkable-field sf-checkable--size-${size} flex flex-col`}>${row}${message}</span>`;
} // The error line of a checkbox or a switch while it is invalid (field orders
// 2026-11-18, FO-1): what is wrong, under the control in the error role, as
// every field of the family says it (sf-input, sf-input-choice), so a host
// sets invalid and error-message on the control instead of writing a line of
// its own under it. Nothing without both. Its id joins the native input's
// aria-describedby (linkCheckableMessage).

function renderCheckableMessage(context) {
  if (!context.invalid || !context.errorMessage) return '';
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-checkable-message" id=${context.messageId || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} data-field-message="error">${context.errorMessage}</span>`;
} // The message's id on the input's aria-describedby, and off it once the line
// is gone; ids put there by the author or the text link are kept.

function linkCheckableMessage(host, input) {
  if (!host || !input) return;
  const line = host.querySelector('.sf-checkable-message');
  const before = String(input.getAttribute('aria-describedby') || '').split(/\s+/u).filter(Boolean);
  const kept = before.filter(id => id !== host.__sfCheckableMessageId);
  const next = line?.id ? [...kept, line.id] : kept;
  host.__sfCheckableMessageId = line?.id || '';
  if (next.join(' ') === before.join(' ')) return;
  if (next.length) input.setAttribute('aria-describedby', next.join(' '));else input.removeAttribute('aria-describedby');
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
/* harmony export */   ShownRequired: () => (/* binding */ ShownRequired),
/* harmony export */   ShownValidity: () => (/* binding */ ShownValidity),
/* harmony export */   VALIDITY_FLAGS: () => (/* binding */ VALIDITY_FLAGS),
/* harmony export */   VALIDITY_WORDS: () => (/* binding */ VALIDITY_WORDS),
/* harmony export */   afterPress: () => (/* binding */ afterPress),
/* harmony export */   claimFirstInvalid: () => (/* binding */ claimFirstInvalid),
/* harmony export */   forgetFormTried: () => (/* binding */ forgetFormTried),
/* harmony export */   formTried: () => (/* binding */ formTried),
/* harmony export */   hasFieldWord: () => (/* binding */ hasFieldWord),
/* harmony export */   innerControlName: () => (/* binding */ innerControlName),
/* harmony export */   ownInvalid: () => (/* binding */ ownInvalid),
/* harmony export */   syncFieldValidity: () => (/* binding */ syncFieldValidity),
/* harmony export */   syncOwnValidity: () => (/* binding */ syncOwnValidity),
/* harmony export */   validityWords: () => (/* binding */ validityWords)
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
 * value-missing, too-long (a counted field past its limit, helpers/char-count.js)
 * and the custom error the page set; `anchor`, when it is a part of the host,
 * is where the browser points.
 */

function syncOwnValidity(component, {
  valueMissing = false,
  tooLong = false,
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

  if (tooLong) {
    flags.tooLong = true;
    text ||= message || 'too-long';
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
    const valueMissing = required && !this.disabled && (value === null || value === undefined || value === ''); // The word only when it is said: asked on every sync, a component without
    // it warned «no word value-missing» on each optional field (simai.main,
    // sf-button-group in property-view's choice field, 2026-10-28).

    return {
      valueMissing,
      message: valueMissing ? this.sfWord?.('value-missing') || 'value-missing' : '',
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

}; // The word key a failed validity flag is said with (owner decision C153 (3)):
// each component carries these words in its lang/<locale>.json runtime
// words, in the page's language (LC-9), never the browser's.

const VALIDITY_WORDS = Object.freeze({
  valueMissing: 'value-missing',
  typeMismatch: 'type-mismatch',
  patternMismatch: 'pattern-mismatch',
  tooShort: 'too-short',
  tooLong: 'too-long',
  rangeUnderflow: 'range-underflow',
  rangeOverflow: 'range-overflow',
  stepMismatch: 'step-mismatch',
  badInput: 'bad-input'
}); // One check pass across every field of a page (C153 (3)): a submit attempt,
// reportValidity() or checkValidity() fires `invalid` on every wrong field
// in tree order, synchronously. The first wrong field of a pass the person
// started (a press or Enter in this task) takes the focus; the rest show
// their errors and keep still. The fields are separate bundles, each with its
// own copy of this module, so the pass lives on a shared global.

const CHECK_KEY = Symbol.for('simai.framework.field-check');

function fieldCheck() {
  const shared = globalThis[CHECK_KEY] || (globalThis[CHECK_KEY] = {
    activated: false,
    focused: false,
    tried: new WeakSet()
  });

  if (!shared.listening && typeof document !== 'undefined') {
    shared.listening = true;

    const mark = event => {
      if (event.type === 'keydown' && event.key !== 'Enter') return;
      shared.activated = true;
      setTimeout(() => {
        shared.activated = false;
      }, 0);
    };

    document.addEventListener('click', mark, true);
    document.addEventListener('keydown', mark, true);
  }

  return shared;
} // A pointer pressed on the page (FO-4, module.smart-helpers 1.20.0): a field
// it leaves holds its leave check until the press is over and a task after
// it, so the error line drawn under that field does not move the button the
// pointer is on before the click lands (at 390 a cleared required field's
// line moved «Сохранить» 20 px down and the save was lost). The press's own
// click checks every field when it submits. A release the page never hears
// ends the hold after PRESS_HOLD_MS. One record for every bundle's copy.


const PRESS_KEY = Symbol.for('simai.framework.field-press');
const PRESS_HOLD_MS = 4000;

function fieldPress() {
  const shared = globalThis[PRESS_KEY] || (globalThis[PRESS_KEY] = {
    down: false,
    queue: [],
    timer: 0
  });

  if (!shared.listening && typeof document !== 'undefined') {
    shared.listening = true;

    const end = () => {
      if (!shared.down) return;
      shared.down = false;
      clearTimeout(shared.timer);
      setTimeout(() => {
        if (shared.down) return;

        for (const run of shared.queue.splice(0)) {
          try {
            run();
          } catch {
            /* a field taken out of the page while the press lasted */
          }
        }
      }, 0);
    };

    const start = () => {
      if (shared.down) return;
      shared.down = true;
      clearTimeout(shared.timer);
      shared.timer = setTimeout(end, PRESS_HOLD_MS);
    };

    document.addEventListener('pointerdown', start, true);
    document.addEventListener('mousedown', start, true);

    for (const type of ['pointerup', 'pointercancel', 'mouseup', 'dragend']) document.addEventListener(type, end, true);
  }

  return shared;
}
/** Runs `check` now, or once a pointer press in progress is over (FO-4). */


function afterPress(check) {
  const shared = fieldPress();
  if (shared.down) shared.queue.push(check);else check();
}
/**
 * Says that `element` failed a check now. Returns true when it is the first
 * wrong field of a pass the person started, the one that takes the focus.
 * Every member of the field family calls it from its `invalid` listener.
 */

function claimFirstInvalid(element) {
  const check = fieldCheck();
  const form = element?.form || element?.closest?.('form') || null;
  if (form) check.tried.add(form);
  if (!check.activated || check.focused) return false;
  check.focused = true;
  setTimeout(() => {
    check.focused = false;
  }, 0);
  return true;
}
/**
 * For a member that draws its own errors on `invalid` (C153 (3)): the
 * browser's bubble is cancelled on the host and on every native control
 * inside it, `show` runs for the host's own event, and the first wrong field
 * of a submit the person made takes the focus. Returns the listener, to
 * remove with removeEventListener('invalid', listener, true).
 */

function ownInvalid(component, show) {
  fieldCheck();

  const listener = event => {
    event.preventDefault();
    if (event.target !== component) return;
    const first = claimFirstInvalid(component);
    show?.(event);

    if (first) {
      const target = component.focusDelegate?.() || component.sfValidityAnchor?.() || component;

      try {
        target.focus?.();
      } catch {
        /* a field taken out of the page while the check ran */
      }
    }
  };

  component.addEventListener('invalid', listener, true);
  return listener;
}
/** A submit attempt has failed on this field's form since its last reset. */

function formTried(element) {
  const form = element?.form || element?.closest?.('form') || null;
  return Boolean(form && fieldCheck().tried.has(form));
}
/** Forgets the failed attempt of a form (form.reset()). */

function forgetFormTried(element) {
  const form = element?.form || element?.closest?.('form') || null;
  if (form) fieldCheck().tried.delete(form);
}
/** Whether the component's dictionaries hold a word, in any language. */

function hasFieldWord(component, key) {
  const words = component?.constructor?.sfWords || {};
  return Object.values(words).some(dictionary => dictionary && dictionary[key] !== undefined && dictionary[key] !== null);
}
/**
 * The words a field says for its validity now (C153 (3)): the page's custom
 * error as written; else the first failed flag in the component's own words,
 * with the limit it broke ({min}, {max}, {step}); a type mismatch of an
 * e-mail or a web address has its own word (type-mismatch-email,
 * type-mismatch-url). A flag the component has no word for says what the
 * component itself set (its own count, range or file words), never the
 * browser's. '' while valid.
 */

function validityWords(component, control = component?.sfValidityAnchor?.()) {
  const validity = component?.validity;
  if (!validity || validity.valid) return '';
  if (validity.customError) return component.validationMessage || '';

  const read = name => control?.getAttribute?.(name) ?? component.getAttribute?.(name) ?? '';

  for (const flag of VALIDITY_FLAGS) {
    if (!validity[flag]) continue;
    let key = VALIDITY_WORDS[flag];

    if (flag === 'typeMismatch') {
      const type = String(control?.type || '').toLowerCase();
      if ((type === 'email' || type === 'url') && hasFieldWord(component, `${key}-${type}`)) key = `${key}-${type}`;
    }

    if (hasFieldWord(component, key)) {
      return component.sfWord(key, {
        vars: {
          min: read(flag === 'tooShort' ? 'minlength' : 'min'),
          max: flag === 'tooLong' ? component.maxlength ?? read('maxlength') : read('max'),
          step: read('step')
        }
      });
    }

    return component.validationMessage || '';
  }

  return component.validationMessage || '';
}
/**
 * The errors a field shows itself (owner decision C153 (3), for the whole
 * field family as C55): never the browser's bubble, always the component's
 * words in the page's language.
 *
 * - A failed check of the form -- a submit attempt, reportValidity(),
 *   checkValidity() -- shows the error on every wrong field at once, and the
 *   first wrong field of a submit the person made takes the focus
 *   (claimFirstInvalid). The browser's bubble, on the host and on the native
 *   control inside it, is cancelled.
 * - After that, or once the person has changed the value, leaving the field
 *   checks it: a wrong value shows its error, a right one clears it.
 * - While the person types, a shown error goes the moment the value is right;
 *   a still-wrong value keeps it, in the words of what is wrong now. Nothing
 *   is shown while typing into a field that showed no error.
 * - form.reset() takes every shown error away.
 *
 * The page's invalid / error-message win over it. Usage, over FormField:
 * `class SfThing extends ShownValidity(FormField(Element))`; the template
 * reads `sfShownInvalid(invalid)` and `sfShownMessage(invalid, errorMessage)`
 * instead of the bare settings. ShownRequired, its name before C153, stays
 * the same mixin.
 */

const ShownValidity = Base => class extends Base {
  constructor() {
    super();
    this.__sfErrorShown = false;
    this.__sfTouched = false; // The page-wide pass listens from the first field on, so the press that
    // submits is seen before the check it starts; so does the press record.

    fieldCheck();
    fieldPress(); // Capture: the host's own `invalid` and its native control's, which
    // would draw a second bubble; neither bubbles, so only capture sees both.

    this.addEventListener('invalid', event => {
      event.preventDefault();
      if (event.target !== this) return;
      const first = claimFirstInvalid(this);

      if (!this.__sfErrorShown) {
        this.__sfErrorShown = true;
        this.requestComponentUpdate?.('invalid');
      } else {
        this.requestComponentUpdate?.('validity');
      }

      if (first) this.sfFocusFirstInvalid();
    }, true);
    this.addEventListener('input', () => {
      this.__sfTouched = true;
    });
    this.addEventListener('change', () => {
      this.__sfTouched = true;
    });
    this.addEventListener('focusout', event => {
      if (event.relatedTarget && this.contains(event.relatedTarget)) return; // A layer of the field (a list, a picker) holds the focus for it.

      if (this.matches?.(':focus-within')) return;
      if (!this.__sfTouched && !formTried(this)) return; // A press that left the field holds the check until it is over (FO-4);
      // what the press did meanwhile (a reset, a submit) is read then.

      afterPress(() => {
        if (!this.isConnected || !this.__sfTouched && !formTried(this)) return;
        this.sfSyncValidity?.();
        const wrong = this.validity ? !this.validity.valid : false;

        if (wrong !== this.__sfErrorShown) {
          this.__sfErrorShown = wrong;
          this.requestComponentUpdate?.('validity');
        } else if (wrong) {
          this.requestComponentUpdate?.('validity');
        }
      });
    });
  }
  /** The first wrong field of a submit takes the focus, as the browser's check did. */


  sfFocusFirstInvalid() {
    const target = this.focusDelegate?.() || this.sfValidityAnchor?.() || this;

    try {
      target.focus?.();
    } catch {
      /* a field taken out of the page while the check ran */
    }
  } // A shown error goes the moment the value is right, whatever made it right:
  // the person's input or change, a value set from script, a value attribute
  // (C55 acceptance F1 R2, D1). A still-wrong value redraws its words.


  sfSyncFormState() {
    super.sfSyncFormState?.();
    if (!this.__sfErrorShown) return;

    if (this.validity && !this.validity.valid) {
      const words = validityWords(this);

      if (words !== this.__sfShownWords) {
        this.__sfShownWords = words;
        this.requestComponentUpdate?.('validity');
      }

      return;
    }

    this.__sfErrorShown = false;
    this.__sfShownWords = '';
    this.requestComponentUpdate?.('value');
  }
  /** An error is shown now (the page's own invalid aside). */


  get sfErrorShown() {
    return this.__sfErrorShown;
  }
  /** The name before C153, kept for the components that read it. */


  get sfMissingShown() {
    return this.__sfErrorShown;
  }
  /** The invalid state the field draws: the page's, or the one it shows itself. */


  sfShownInvalid(invalid) {
    return Boolean(invalid) || this.__sfErrorShown;
  }
  /** The message under the field: the page's while it says invalid, else the shown error's words. */


  sfShownMessage(invalid, errorMessage) {
    if (invalid) return errorMessage || '';
    if (!this.__sfErrorShown) return '';
    const words = validityWords(this);
    this.__sfShownWords = words;
    return words;
  }

  formResetCallback() {
    const shown = this.__sfErrorShown;
    this.__sfErrorShown = false;
    this.__sfTouched = false;
    this.__sfShownWords = '';
    forgetFormTried(this);
    super.formResetCallback?.();
    if (shown) this.requestComponentUpdate?.('reset');
  }

};
/** The mixin's name before owner decision C153 (C55 acceptance F1). */

const ShownRequired = ShownValidity;

/***/ },

/***/ "fcfc3bb80ec7"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "42b499506736"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "5b7d7695b41b"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("element-manifest", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("element-manifest", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "e92fd2d1a38c"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("instance-path", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("instance-path", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "2a080a730149"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("lit", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "deb1a4d61565"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("smart-base", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("smart-base", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "38f4a3b01f2c"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   files: () => (/* binding */ files)
/* harmony export */ });
/* harmony import */ var _en_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("0ae1a29b7840");
// Written by scripts/build-language-packs.mjs from src/core/lang/built-in.json
// (owner decision C282); do not edit. The words this bundle carries: the
// built-in languages' (en); every other language comes from
// a language file (core/lang/<code>.js or its parts).


const files = { en: { runtime: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime } };

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ en: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime });


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

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.checkbox","tag":"sf-checkbox","version":"1.6.2","kind":"leaf","settings":{"size":{"type":"enum","values":["1/2","1","2"],"default":"1"},"label":{"type":"string","default":""},"description":{"type":"string","default":""},"help":{"type":"string","default":""},"position":{"type":"enum","values":["start","end"],"default":"start"},"controls":{"type":"string","default":""},"disabled":{"type":"boolean","default":false},"name":{"type":"string","default":""},"value":{"type":"string","default":"on"},"invalid":{"type":"boolean","default":false},"error-message":{"type":"string","default":""}},"values":{"checked":{"type":"boolean","default":false},"indeterminate":{"type":"boolean","default":false}},"events":{"change":{"carries":"native"}},"actions":{},"form":{"value":"checked","name":"name","default":"checked","submits":"value","reset":"default","disabled":"disabled","validity":["custom-error"]},"css-variables":{"--sf-checkbox-background-color":{"type":"color","state":"default"},"--sf-checkbox-border-color":{"type":"color","state":"default"},"--sf-checkbox-border-width":{"type":"length","state":"default"},"--sf-checkbox-radius":{"type":"length","state":"default"},"--sf-checkbox-size":{"type":"length","state":"default"},"--sf-checkbox-gap":{"type":"length","state":"default"},"--sf-checkbox-checked-background-color":{"type":"color","state":"checked"},"--sf-checkbox-invalid-border-color":{"type":"color","state":"invalid"}}}');

/***/ },

/***/ "0ae1a29b7840"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Checkbox","runtime":{"help":"More about: {label}"}}');

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