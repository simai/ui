/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "ff6757f5dacf"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   activateCopy: () => (/* binding */ activateCopy),
/* harmony export */   bindCopyButton: () => (/* binding */ bindCopyButton),
/* harmony export */   initCopyTree: () => (/* binding */ initCopyTree),
/* harmony export */   normalizeCopyError: () => (/* binding */ normalizeCopyError),
/* harmony export */   resolveCopySource: () => (/* binding */ resolveCopySource),
/* harmony export */   unbindCopyButton: () => (/* binding */ unbindCopyButton),
/* harmony export */   writeText: () => (/* binding */ writeText)
/* harmony export */ });
/* harmony import */ var _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d7f974466839");
/* harmony import */ var _register_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("58661bec99a6");


const COPY_SELECTOR = '.sf-clipboard, .btn-clipboard';
const BOUND_FLAG = 'sfCopyBound';
const ICON_SELECTOR = 'sf-icon, .sf-icon';
const COPY_SIZES = new Set(['1/3', '1/2', '1', '2', '3']);
const COPY_TYPES = new Set(['default', 'tonal', 'outline', 'link']);
const COPY_SCHEMES = new Set(['primary', 'secondary', 'on-surface']);
const SOURCE_ERROR_CODES = new Set(['ambiguous_source', 'empty_source', 'missing_source', 'missing_target']);

function normalizeChoice(value, choices, fallback) {
  const normalized = String(value || '').trim().toLowerCase();
  return choices.has(normalized) ? normalized : fallback;
}

function normalizeDuration(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 5000;
  return Math.min(10000, Math.max(1000, parsed));
}

function normalizeCopyError(error) {
  if (SOURCE_ERROR_CODES.has(error?.message)) return error.message;
  if (error?.message === 'copy_unsupported') return 'copy_unsupported';

  if (error?.name === 'NotAllowedError' || error?.name === 'SecurityError') {
    return 'copy_denied';
  }

  return 'copy_failed';
}

function resolveIdTarget(button, value) {
  const normalized = String(value || '').trim();
  if (!/^#[A-Za-z][\w:.-]*$/.test(normalized)) return null;
  return button.ownerDocument.getElementById(normalized.slice(1));
}

function readTargetText(target) {
  if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
    return target.value;
  }

  return target?.textContent || '';
}

function resolveCopySource(button) {
  const hasValue = button.hasAttribute('data-copy');
  const targetValues = [button.getAttribute('data-target'), button.getAttribute('data-clipboard-target')].filter(value => value !== null && String(value).trim() !== '');
  const uniqueTargets = [...new Set(targetValues)];

  if (hasValue && uniqueTargets.length || uniqueTargets.length > 1) {
    throw new Error('ambiguous_source');
  }

  if (hasValue) return String(button.getAttribute('data-copy') || '');

  if (uniqueTargets.length === 1) {
    const target = resolveIdTarget(button, uniqueTargets[0]);
    if (!target) throw new Error('missing_target');
    return readTargetText(target);
  }

  throw new Error('missing_source');
}

function legacyWriteText(text, documentRef) {
  const textarea = documentRef.createElement('textarea');
  textarea.className = 'sf-clipboard-fallback';
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  documentRef.body.append(textarea);
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);
  let copied = false;

  try {
    copied = documentRef.execCommand('copy');
  } finally {
    textarea.remove();
  }

  if (!copied) throw new Error('copy_unsupported');
}

async function writeText(text, documentRef = document) {
  if (window.isSecureContext && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return 'native';
  }

  legacyWriteText(text, documentRef);
  return 'legacy';
}

function ensureStatus(button) {
  const selector = button.getAttribute('data-status');
  const authored = selector ? resolveIdTarget(button, selector) : null;

  if (authored) {
    authored.setAttribute('role', 'status');
    authored.setAttribute('aria-live', 'polite');
    authored.setAttribute('aria-atomic', 'true');
    return {
      element: authored,
      generated: false
    };
  }

  const status = button.ownerDocument.createElement('span');
  status.className = 'sf-clipboard-status';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  status.setAttribute('aria-atomic', 'true');
  button.after(status);
  return {
    element: status,
    generated: true
  };
}

function setIcon(button, name) {
  const icon = button.querySelector(ICON_SELECTOR);
  if (!icon) return;
  if (icon.tagName.toLowerCase() === 'sf-icon') icon.setAttribute('icon', name);else icon.textContent = name;
}

function setCopyFeedback(button, controller, state, message) {
  window.clearTimeout(controller.resetTimer);
  button.dataset.copyState = state;
  controller.status.element.textContent = message;
  setIcon(button, state === 'success' ? 'check' : state === 'error' ? 'error' : 'content_copy');

  if (state === 'success' || state === 'error') {
    controller.resetTimer = window.setTimeout(() => {
      delete button.dataset.copyState;
      controller.status.element.textContent = '';
      setIcon(button, 'content_copy');
    }, normalizeDuration(button.dataset.duration));
  }
}

async function activateCopy(button, controller) {
  if (controller.pending) return;
  controller.pending = true;
  button.setAttribute('aria-disabled', 'true');
  button.dataset.copyState = 'pending';

  try {
    const text = resolveCopySource(button);
    if (!text) throw new Error('empty_source');
    const method = await writeText(text, button.ownerDocument);
    setCopyFeedback(button, controller, 'success', button.dataset.success || '');
    button.dispatchEvent(new CustomEvent('sf:copy-success', {
      bubbles: true,
      detail: {
        method,
        text
      }
    }));
  } catch (error) {
    const code = normalizeCopyError(error);
    setCopyFeedback(button, controller, 'error', button.dataset.error || '');
    button.dispatchEvent(new CustomEvent('sf:copy-error', {
      bubbles: true,
      detail: {
        code
      }
    }));
  } finally {
    controller.pending = false;
    button.removeAttribute('aria-disabled');
  }
}

function bindCopyButton(button) {
  if (!(button instanceof HTMLButtonElement)) return null;
  if (button.dataset[BOUND_FLAG] === 'true') return button._sfCopyController;
  const controller = {
    pending: false,
    resetTimer: null,
    status: ensureStatus(button)
  };

  controller.onClick = () => activateCopy(button, controller);

  button.addEventListener('click', controller.onClick);
  button.dataset[BOUND_FLAG] = 'true';
  button._sfCopyController = controller;
  return controller;
}

function unbindCopyButton(button) {
  const controller = button?._sfCopyController;
  if (!controller) return;
  button.removeEventListener('click', controller.onClick);
  window.clearTimeout(controller.resetTimer);
  if (controller.status.generated) controller.status.element.remove();
  delete button._sfCopyController;
  delete button.dataset[BOUND_FLAG];
  delete button.dataset.copyState;
  button.removeAttribute('aria-disabled');
}

function initCopyTree(target = document) {
  if (target instanceof Element && target.matches?.(COPY_SELECTOR)) bindCopyButton(target);
  target.querySelectorAll?.(COPY_SELECTOR).forEach(bindCopyButton);
}

class Copy extends _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__.ComponentObserver {
  static componentName = 'Copy';

  constructor(props) {
    super(props);
    const {
      size = '1',
      type = 'link',
      scheme = 'on-surface',
      text = '',
      copy = text,
      done = '',
      error = '',
      label = ''
    } = this.params || {};
    const normalizedSize = normalizeChoice(size, COPY_SIZES, '1');
    const normalizedType = normalizeChoice(type, COPY_TYPES, 'link');
    const normalizedScheme = normalizeChoice(scheme, COPY_SCHEMES, 'on-surface');
    const button = document.createElement('button');
    button.type = 'button';
    button.classList.add('sf-clipboard', `sf-clipboard-${normalizedSize}`, 'm-0');
    button.dataset.copy = String(copy || '');
    if (done) button.dataset.success = done;
    if (error) button.dataset.error = error;
    const hasText = Boolean(String(text).trim());
    const accessibleLabel = String(this.attrs['aria-label'] || label || '').trim();
    if (accessibleLabel) button.setAttribute('aria-label', accessibleLabel);else if (!hasText) button.disabled = true;
    button.classList.add(hasText ? 'sf-button' : 'sf-icon-button', 'flex', 'items-cross-center', hasText ? `sf-button--size-${normalizedSize}` : 'sf-icon-button--icon', hasText ? `sf-button--${normalizedScheme}` : `sf-icon-button--size-${normalizedSize}`, hasText ? `sf-button--${normalizedType}` : `sf-icon-button--${normalizedScheme}`);
    if (!hasText) button.classList.add(`sf-icon-button--${normalizedType}`);
    const icon = document.createElement('sf-icon');
    icon.setAttribute('icon', 'content_copy');
    icon.setAttribute('aria-hidden', 'true');
    button.append(icon);

    if (hasText) {
      const span = document.createElement('span');
      span.className = 'sf-button-text-container';
      span.textContent = text;
      button.append(span);
    }

    this.template = button;
  }

  init() {
    bindCopyButton(this.html);
  }

  destroyInternal() {
    unbindCopyButton(this.html);
  }

}

(0,_register_helper__WEBPACK_IMPORTED_MODULE_1__["default"])('Copy', Copy);

if (typeof window !== 'undefined') {
  window.SF = window.SF || {};
  window.SF.Clipboard = {
    bind: bindCopyButton,
    copy: button => activateCopy(button, button?._sfCopyController || bindCopyButton(button)),
    unbind: unbindCopyButton
  };
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initCopyTree(), {
    once: true
  });
} else {
  initCopyTree();
}

new MutationObserver(mutations => mutations.forEach(mutation => {
  mutation.addedNodes.forEach(node => {
    if (node instanceof Element) initCopyTree(node);
  });
})).observe(document.documentElement, {
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

/***/ "65609afdaa7d"
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
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("65609afdaa7d");
/* harmony import */ var _js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("ff6757f5dacf");


})();

/******/ })()
;