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
/* harmony import */ var _core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("695f21e50358");




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
} // The parts of the description: the .sf-switch-description of class markup and
// of a description setting, or whatever a description slot placed after the
// label row.


function descriptionParts(root) {
  const wrap = root.querySelector('.sf-switch-container-wrap');
  if (!wrap) return [...root.querySelectorAll('.sf-switch-description')];
  return [...wrap.children].filter(node => !node.classList.contains('sf-switch-top') && !node.hasAttribute('aria-hidden') && node.textContent.trim());
}

function splitIds(value) {
  return String(value || '').split(/\s+/).filter(Boolean);
} // The switch's name is its label alone; its description is the description
// (standard simai.smart-component 1.3.8 §4.8; simai/ui-source#44). Everything
// sits inside one <label> so a press anywhere flips the switch, and a label
// names its control by all its text: the description, the inherited marker and
// the reset button were read as part of the name. The input is named by the
// label row (aria-labelledby) and described by the description
// (aria-describedby). An author's aria-label or aria-labelledby wins; ids the
// author put on aria-describedby are kept. Ids come from the instance path,
// never a counter (#41).


function linkSwitchText(root) {
  const {
    input
  } = getSwitchNodes(root);
  if (!input) return;
  const owner = root.closest('sf-switch') || root; // A switch built before it is placed has no path yet: link it once it is.

  if (!(0,_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_3__.pathIsSettled)(owner)) {
    if (!root.__sfSwitchLinkPending && typeof requestAnimationFrame === 'function') {
      root.__sfSwitchLinkPending = true;
      requestAnimationFrame(() => {
        root.__sfSwitchLinkPending = false;
        if ((0,_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_3__.pathIsSettled)(owner)) linkSwitchText(root);
      });
    }

    return;
  }

  const path = (0,_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_3__.instancePath)(owner, {
    kind: 'sf-switch'
  });
  const linked = root.__sfSwitchLinked || {
    label: '',
    described: []
  };
  const label = root.querySelector('.sf-switch-container');
  const ownLabel = linked.label && input.getAttribute('aria-labelledby') === linked.label;

  if (label && label.textContent.trim() && !input.hasAttribute('aria-label') && (ownLabel || !input.hasAttribute('aria-labelledby'))) {
    if (!label.id) label.id = (0,_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_3__.partId)(path, 'label');
    input.setAttribute('aria-labelledby', label.id);
    linked.label = label.id;
  } else if (ownLabel) {
    input.removeAttribute('aria-labelledby');
    linked.label = '';
  }

  const ids = descriptionParts(root).map((node, index) => {
    if (!node.id) node.id = (0,_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_3__.partId)(path, index ? `description-${index + 1}` : 'description');
    return node.id;
  });
  const authored = splitIds(input.getAttribute('aria-describedby')).filter(id => !linked.described.includes(id));
  const describedBy = [...new Set([...authored, ...ids])];
  if (describedBy.length) input.setAttribute('aria-describedby', describedBy.join(' '));else input.removeAttribute('aria-describedby');
  linked.described = ids;
  root.__sfSwitchLinked = linked;
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
  linkSwitchText(root);
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

/***/ "2d7e07f685fc"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _switch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("3358c85d2142");
/*
* Main JS file for including JS for component.
*
* Imports:
* - Base function component (_component_name.js)
*/


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

/***/ "695f21e50358"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   instancePath: () => (/* binding */ instancePath),
/* harmony export */   partId: () => (/* binding */ partId),
/* harmony export */   pathIsSettled: () => (/* binding */ pathIsSettled)
/* harmony export */ });
// An instance's id is its role path (standard simai.smart-component 1.3.8
// §7.1.1; simai/ui-source#41).
//
//   - at the top of the page: `page/<host id or data-sf-role>`;
//   - a part with `data-sf-role` inside another instance:
//     `<parent path>/<role>`;
//   - neither: `<kind>[<n>]`, n counted in document order among the
//     instances of the same kind that have neither.
//
// Ids that templates write (`for`, `aria-controls`, `aria-labelledby`) are
// `<path with every non-word run as ->--<local name>`. A counter is never an
// id: the field ids used to come from a module-scope counter, and every
// bundle that carries the field code (eight of them) had its own, so a class
// sf-quantity and an <sf-input-quantity> on one page both took
// `sf-quantity-1-control` and a label pointed at the other field. Ids that
// follow creation order also swap when two instances swap, and server markup
// (§5.4) cannot repeat them. A path is read from the page, so every bundle
// gives the same answer.
//
// `kind` is the element's tag for a Smart element; class markup passes its
// root class and is told apart as `class.<root class>`.
const isElement = node => node && node.nodeType === 1 && typeof node.getAttribute === 'function';

const isCustom = node => isElement(node) && String(node.localName || '').includes('-');

function parentInstance(node) {
  for (let current = node.parentNode || node.host || null; current; current = current.parentNode || current.host || null) {
    if (isCustom(current)) return current;
  }

  return null;
}

function kindOf(owner, kind) {
  const tag = String(owner?.localName || '').toLowerCase();
  if (tag && tag.includes('-')) return tag;
  return `class.${kind || tag || 'element'}`;
}

function documentIndex(owner, kind) {
  const doc = owner?.ownerDocument;
  if (!owner?.isConnected || typeof doc?.querySelectorAll !== 'function') return 0;
  const selector = kind.startsWith('class.') ? `.${kind.slice('class.'.length)}` : kind;
  let index = 0;

  for (const one of doc.querySelectorAll(selector)) {
    if (kind.startsWith('class.') && isCustom(one)) continue;
    if (one.id || one.getAttribute('data-sf-role')) continue;
    index += 1;
    if (one === owner) return index;
  }

  return 0;
}
/** The role path of an instance (§7.1.1). */


function instancePath(owner, {
  kind = ''
} = {}) {
  const id = isElement(owner) ? String(owner.id || '').trim() : String(owner?.id || '').trim();
  if (id) return `page/${id}`;
  const role = isElement(owner) ? String(owner.getAttribute('data-sf-role') || '').trim() : '';

  if (role) {
    const parent = parentInstance(owner);
    return parent ? `${instancePath(parent, {
      kind: parent.localName
    })}/${role}` : `page/${role}`;
  }

  const resolved = kindOf(owner, kind);
  return `${resolved}[${documentIndex(owner, resolved)}]`;
}
/** An id a template writes for one of its parts: `<path as a word>--<local name>`. */

function partId(path, local) {
  const base = String(path).replace(/\W+/gu, '-').replace(/^-+|-+$/gu, '');
  return local ? `${base}--${local}` : base;
}
/** Whether the path is final: an instance in the page, or one with an id. */

function pathIsSettled(owner) {
  return Boolean(owner?.isConnected || String(owner?.id || '').trim());
}

/***/ },

/***/ "604233088ade"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


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
let __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("604233088ade");
/* harmony import */ var _js_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("2d7e07f685fc");
/**
 * SIMAI Framework
 * Copyright 2008-2026 SIMAI Ltd
 * http://simai.studio
 * Read the license: http://framework.simai.studio/license/
 * Documentation: http://framework.simai.studio/
 * Support: http://simai.studio/support/
 *
 * INPUTS
 *
 * Entry point for importing components from this directory.
 * Simplifies the import process in other parts of the project.
 * Instead of importing individual files, all component can be imported through this file.
 */


})();

/******/ })()
;