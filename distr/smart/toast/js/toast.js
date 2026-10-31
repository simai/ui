/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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

/***/ "ab7da13ee130"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   dismissToastElement: () => (/* binding */ dismissToastElement)
/* harmony export */ });
function finiteAnimations(element) {
  if (!element || typeof element.getAnimations !== 'function') return [];
  return element.getAnimations().filter(animation => Number.isFinite(animation.effect?.getTiming?.().duration));
}

function dismissToastElement(toast, removalTarget = toast) {
  if (!(toast instanceof HTMLElement) || !(removalTarget instanceof Element)) return false;

  const remove = () => {
    if (removalTarget.isConnected) removalTarget.remove();
  };

  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
    remove();
    return true;
  } // Commit the initial frame before applying the exit state.


  void toast.offsetWidth;
  toast.classList.add('closing');
  const animations = finiteAnimations(toast);

  if (!animations.length) {
    remove();
    return true;
  }

  Promise.allSettled(animations.map(animation => animation.finished)).then(remove);
  return true;
}



/***/ },

/***/ "2e6d67465f5f"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bindToast: () => (/* binding */ bindToast),
/* harmony export */   createToastElement: () => (/* binding */ createToastElement),
/* harmony export */   dismissToast: () => (/* binding */ dismissToast),
/* harmony export */   showToast: () => (/* binding */ showToast),
/* harmony export */   unbindToast: () => (/* binding */ unbindToast)
/* harmony export */ });
/* harmony import */ var _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d7f974466839");
/* harmony import */ var _register_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("58661bec99a6");
/* harmony import */ var _dismiss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("ab7da13ee130");
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("43090d1c8307");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__);




const TOAST_TEXT = {
  en: {
    close: 'Close message'
  },
  ru: {
    close: 'Закрыть сообщение'
  }
};
const TOAST_SELECTOR = '.sf-toast';
const TOAST_BOUND_FLAG = 'sfToastBound'; // The shared status vocabulary (neutral, info, success, warning, error). The
// words this component used before -- default and primary -- are still taken
// and mean neutral and info (journal class-status-aliases); SF.Toast.show
// refused the new words and drew them as default.

const TOAST_TYPES = new Set(['neutral', 'info', 'success', 'warning', 'error']);
const LEGACY_TOAST_TYPES = {
  default: 'neutral',
  primary: 'info'
};

function joinClasses(...tokens) {
  return tokens.flat().filter(Boolean).join(' ');
}

function normalizeType(value) {
  const status = LEGACY_TOAST_TYPES[value] ?? value;
  return TOAST_TYPES.has(status) ? status : 'neutral';
}

function readDuration(root) {
  const duration = Number(root.getAttribute('data-duration'));
  return Number.isFinite(duration) && duration > 0 ? duration : 0;
}

function clearToastTimer(root) {
  if (root.__sfToastTimer) window.clearTimeout(root.__sfToastTimer);
  root.__sfToastTimer = null;
}

function startToastTimer(root) {
  clearToastTimer(root);
  if (!root.__sfToastRemaining || root.__sfToastPauseReasons?.size) return;
  root.__sfToastStartedAt = performance.now();
  root.__sfToastTimer = window.setTimeout(() => {
    dismissToast(root, root.__sfToastRemovalTarget || root);
  }, root.__sfToastRemaining);
}

function pauseToastTimer(root, reason) {
  root.__sfToastPauseReasons?.add(reason);
  if (!root.__sfToastTimer) return;
  root.__sfToastRemaining = Math.max(0, root.__sfToastRemaining - (performance.now() - root.__sfToastStartedAt));
  clearToastTimer(root);
}

function resumeToastTimer(root, reason) {
  root.__sfToastPauseReasons?.delete(reason);
  startToastTimer(root);
}

function bindToast(root, removalTarget = root) {
  if (!(root instanceof HTMLElement)) return;
  root.__sfToastRemovalTarget = removalTarget instanceof Element ? removalTarget : root;
  if (root.dataset[TOAST_BOUND_FLAG] === '1') return;

  const handleClick = event => {
    const trigger = event.target?.closest?.('[data-close], [data-toast-close], [data-action], [data-toast-action]');
    if (!trigger || !root.contains(trigger) || trigger.closest(TOAST_SELECTOR) !== root) return;
    if (trigger.matches(':disabled, [aria-disabled="true"]')) return;

    if (trigger.matches('[data-close], [data-toast-close]')) {
      event.preventDefault();
      dismissToast(root, root.__sfToastRemovalTarget || root, trigger);
      return;
    }

    root.dispatchEvent(new CustomEvent('sf-toast-action', {
      bubbles: true,
      composed: true,
      detail: {
        action: trigger.getAttribute('data-action') || trigger.getAttribute('data-toast-action') || '',
        toast: root,
        trigger
      }
    }));
  };

  const handlePointerEnter = () => pauseToastTimer(root, 'pointer');

  const handlePointerLeave = () => resumeToastTimer(root, 'pointer');

  const handleFocusIn = () => pauseToastTimer(root, 'focus');

  const handleFocusOut = event => {
    if (!root.contains(event.relatedTarget)) resumeToastTimer(root, 'focus');
  };

  root.addEventListener('click', handleClick);
  root.addEventListener('pointerenter', handlePointerEnter);
  root.addEventListener('pointerleave', handlePointerLeave);
  root.addEventListener('focusin', handleFocusIn);
  root.addEventListener('focusout', handleFocusOut);
  root.__sfToastHandlers = {
    handleClick,
    handlePointerEnter,
    handlePointerLeave,
    handleFocusIn,
    handleFocusOut
  };
  root.__sfToastPauseReasons = new Set();
  root.__sfToastRemaining = readDuration(root);
  root.dataset[TOAST_BOUND_FLAG] = '1';
  startToastTimer(root);
}

function unbindToast(root) {
  if (!(root instanceof HTMLElement)) {
    return;
  }

  const handlers = root.__sfToastHandlers;

  if (handlers) {
    root.removeEventListener('click', handlers.handleClick);
    root.removeEventListener('pointerenter', handlers.handlePointerEnter);
    root.removeEventListener('pointerleave', handlers.handlePointerLeave);
    root.removeEventListener('focusin', handlers.handleFocusIn);
    root.removeEventListener('focusout', handlers.handleFocusOut);
  }

  clearToastTimer(root);
  delete root.__sfToastHandlers;
  delete root.__sfToastPauseReasons;
  delete root.__sfToastRemaining;
  delete root.__sfToastStartedAt;
  delete root.__sfToastRemovalTarget;
  delete root.dataset[TOAST_BOUND_FLAG];
} // The removal target is read after the guard: as a default parameter it was
// read first, and dismiss(null) threw instead of answering false.


function dismissToast(root, removalTarget = null, trigger = null) {
  if (!(root instanceof HTMLElement) || root.classList.contains('closing')) return false;
  removalTarget = removalTarget || root.__sfToastRemovalTarget || root;
  unbindToast(root); // A cancelable request (standard 1.3.8 §19.3, §8): a listener that prevents
  // it keeps the toast, bound as it was.

  const allowed = root.dispatchEvent(new CustomEvent('sf-toast-close', {
    bubbles: true,
    composed: true,
    cancelable: true,
    detail: {
      toast: root,
      trigger
    }
  }));

  if (!allowed) {
    bindToast(root, removalTarget);
    return false;
  }

  return (0,_dismiss__WEBPACK_IMPORTED_MODULE_2__.dismissToastElement)(root, removalTarget);
} // What a toast reports is its status (journal record attribute-type-to-status);
// `type` is still read, as the attribute is, until that record leaves. Code
// that had moved to `status` got a default toast from the JS API.


function createToastElement(options = {}) {
  const {
    status,
    type = 'default',
    icon = '',
    title = '',
    supportingText = '',
    actionText = '',
    action = '',
    closable = true,
    closeLabel = (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageText)(TOAST_TEXT, 'close', document.documentElement),
    duration = 0,
    role = ''
  } = options;
  const root = document.createElement('div');
  root.className = joinClasses('sf-toast', `sf-toast--${normalizeType(status ?? type)}`, 'flex', 'items-cross-start');

  if (Number.isFinite(Number(duration)) && Number(duration) > 0) {
    root.dataset.duration = String(Number(duration));
  }

  if (role === 'status' || role === 'alert') root.setAttribute('role', role);

  if (icon) {
    const iconNode = document.createElement('i');
    iconNode.className = 'sf-icon';
    iconNode.setAttribute('aria-hidden', 'true');
    iconNode.textContent = icon;
    root.append(iconNode);
  }

  const container = document.createElement('div');
  container.className = 'sf-toast-container flex flex-col flex-1';
  const wrap = document.createElement('div');
  wrap.className = 'sf-toast-wrap flex flex-col';

  if (title) {
    const titleNode = document.createElement('div');
    titleNode.className = 'sf-toast-text';
    titleNode.textContent = title;
    wrap.append(titleNode);
  }

  if (supportingText) {
    const supportingTextNode = document.createElement('div');
    supportingTextNode.className = 'sf-toast-supporting-text';
    supportingTextNode.textContent = supportingText;
    wrap.append(supportingTextNode);
  }

  container.append(wrap);

  if (actionText) {
    const bottom = document.createElement('div');
    bottom.className = 'sf-toast-bottom flex items-center';
    const actionButton = document.createElement('button');
    actionButton.type = 'button';
    actionButton.className = 'sf-button sf-button--primary sf-button--link sf-button--size-1';
    actionButton.setAttribute('data-action', action || 'action');
    actionButton.setAttribute('data-toast-action', action || 'action');
    const actionTextNode = document.createElement('span');
    actionTextNode.className = 'sf-button-text-container';
    actionTextNode.textContent = actionText;
    actionButton.append(actionTextNode);
    bottom.append(actionButton);
    container.append(bottom);
  }

  root.append(container);

  if (closable) {
    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = joinClasses('sf-icon-button', 'sf-icon-button--variant-close', 'sf-icon-button--on-surface', 'sf-icon-button--link', 'sf-icon-button--size-1/3');
    closeButton.setAttribute('aria-label', closeLabel);
    closeButton.setAttribute('data-close', '');
    closeButton.setAttribute('data-toast-close', '');
    const close = document.createElement('span');
    close.className = 'sf-close sf-close--size-1/3 flex justify-center items-center';
    close.setAttribute('aria-hidden', 'true');
    const closeIcon = document.createElement('span');
    closeIcon.className = 'sf-close-icon';
    close.append(closeIcon);
    closeButton.append(close);
    root.append(closeButton);
  }

  bindToast(root);
  return root;
}

function showToast(target, options = {}) {
  const root = typeof target === 'string' ? document.querySelector(target) : target instanceof Element ? target : null;

  if (!(root instanceof Element)) {
    return null;
  }

  const toast = createToastElement(options);
  root.append(toast);
  return toast;
}

function initToastTree(target) {
  if (!(target instanceof Element) && target !== document) return;

  if (target instanceof Element && target.matches?.(TOAST_SELECTOR)) {
    bindToast(target);
  }

  target.querySelectorAll?.(TOAST_SELECTOR).forEach(bindToast);
}

class Toast extends _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__.ComponentObserver {
  static componentName = 'Toast';
  html = null;

  constructor(props) {
    super(props);
    const {
      status,
      type = 'default',
      icon = '',
      title = '',
      supportingText = '',
      actionText = '',
      action = '',
      closable = true
    } = this.params || {};
    this.template = createToastElement({
      status,
      type,
      icon,
      title,
      supportingText,
      actionText,
      action,
      closable,
      closeLabel: this.params?.closeLabel,
      duration: this.params?.duration,
      role: this.params?.role
    });

    if (this.id) {
      this.template.id = this.id;
    }
  }

  init() {
    bindToast(this.template);
  }

  destroyInternal() {
    if (!this.template) return;
    unbindToast(this.template);
  }

}

(0,_register_helper__WEBPACK_IMPORTED_MODULE_1__["default"])('Toast', Toast);

if (typeof window !== 'undefined') {
  window.SF = window.SF || {};
  window.SF.Toast = window.SF.Toast || {};
  window.SF.Toast.bind = bindToast;
  window.SF.Toast.unbind = unbindToast;
  window.SF.Toast.dismiss = dismissToast;
  window.SF.Toast.create = createToastElement;
  window.SF.Toast.show = showToast;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initToastTree(document));
} else {
  initToastTree(document);
}

const toastObserver = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (!(node instanceof Element)) return;
      initToastTree(node);
    });
  });
});
toastObserver.observe(document.documentElement, {
  childList: true,
  subtree: true
});

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

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

/***/ "58c811a8f37f"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _component_toast_js_toast__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("2e6d67465f5f");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("9560d0717f6e");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("b3afcae54093");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("712ff066c789");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("1347db922742");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("8191ff6a39ca");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _component_toast_js_toast__WEBPACK_IMPORTED_MODULE_2__, _js_templates_default__WEBPACK_IMPORTED_MODULE_3__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _component_toast_js_toast__WEBPACK_IMPORTED_MODULE_2__, _js_templates_default__WEBPACK_IMPORTED_MODULE_3__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);







 // sf-toast from its component.json (standard simai.smart-component 1.3.8 §3,
// §4, §8): its settings are attributes and properties made by
// core/js/element-manifest.js, its words are lang/<locale>.json (a product adds
// a language through SF.language.register("sf-toast", code, words)), and the
// old names title and type are dated aliases.

const ToastElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_4__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_6__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_7__
  },
  source: 'ru',
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_5__
});

const applied = () => ({
  outcome: 'applied'
});

const refused = reason => ({
  outcome: 'refused',
  reason
});

class SfToast extends ToastElement {
  static get props() {
    return { ...super.props,
      // The shared status vocabulary. This component used `default` for a plain
      // message and `primary` for a highlighted one; both still work — `primary`
      // was a colour in a list of statuses, and its meaning here is info.
      status: {
        default: 'neutral',
        values: ['neutral', 'info', 'success', 'warning', 'error'],
        aliases: ['type'],
        valueAliases: {
          neutral: ['default'],
          info: ['primary']
        }
      },
      // A host attribute (§3.1): status or alert, written on the toast's root.
      role: {
        default: ''
      },
      rootClass: {
        default: ''
      }
    };
  }

  constructor() {
    super();
    this._boundRoot = null;
    this._closeReason = 'api';
  }

  get status() {
    return this.getProp('status');
  }

  get duration() {
    const duration = Number(this.getAttribute('duration'));
    return Number.isFinite(duration) && duration > 0 ? duration : 0;
  } // The root's role: the host's role attribute when it says status or alert.


  get toastRole() {
    const role = this.getAttribute('role') || '';
    return role === 'status' || role === 'alert' ? role : '';
  }

  onConnected() {
    super.onConnected?.(); // The shared class toast sends its events on its root with the elements in
    // detail; the element's own events are sent from the host with data only
    // (§8), so the class events stop here.

    this.addEventListener('sf-toast-close', this._onRootClose, true);
    this.addEventListener('sf-toast-action', this._onRootAction, true);
  }

  _onRootClose = event => {
    if (event.target === this) return;
    event.stopImmediatePropagation();
    const reason = event.detail?.trigger ? 'close' : this._closeReason;
    this._closeReason = 'api'; // A refused request keeps the toast (§19.3): the class dismissal hears the
    // cancel on its own event.

    if (!this.sfEmit('close', {
      reason
    }, {
      cancelable: true
    })) {
      event.preventDefault();
      return;
    }

    this.sfEmit('closed', {
      reason
    });
  };
  _onRootAction = event => {
    if (event.target === this) return;
    event.stopImmediatePropagation();
    this.sfEmit('action', {
      action: event.detail?.action ?? ''
    });
  };

  templateContext() {
    const props = this.getPropsContext();
    return this.createTemplateContext({ ...props,
      closeLabel: this.closeLabel,
      component: this,
      rootClass: this.getRootClass(),
      // Resolved names the template reads (contracts/template-context.json).
      title: this.heading,
      type: this.status,
      role: this.toastRole
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_3__.renderToastTemplate)(this.templateContext());
  }

  afterRender() {
    if (this._boundRoot) {
      (0,_component_toast_js_toast__WEBPACK_IMPORTED_MODULE_2__.unbindToast)(this._boundRoot);
      this._boundRoot = null;
    }

    this._boundRoot = this.querySelector('.sf-toast');

    if (!this._boundRoot) {
      return;
    }

    (0,_component_toast_js_toast__WEBPACK_IMPORTED_MODULE_2__.bindToast)(this._boundRoot, this);
  }

  onDisconnected() {
    if (this._boundRoot) {
      (0,_component_toast_js_toast__WEBPACK_IMPORTED_MODULE_2__.unbindToast)(this._boundRoot);
      this._boundRoot = null;
    }
  }

  dismiss() {
    if (this._boundRoot) {
      (0,_component_toast_js_toast__WEBPACK_IMPORTED_MODULE_2__.dismissToast)(this._boundRoot, this);
    } else if (this.isConnected) {
      this.remove();
    }

    return this;
  } // Closes the toast with reason api. Answers an outcome (§4.4): refused when
  // a listener prevents sf-toast-close.


  close() {
    if (!this._boundRoot) {
      if (!this.isConnected) return refused('closed');
      this.remove();
      return applied();
    }

    this._closeReason = 'api';
    return (0,_component_toast_js_toast__WEBPACK_IMPORTED_MODULE_2__.dismissToast)(this._boundRoot, this) ? applied() : refused('prevented');
  } // Says a message: text (the assembly's word for code and count, §11.2) is the
  // heading, tone the status.


  show(params = {}) {
    const text = typeof params === 'string' ? params : params?.text;
    if (typeof text === 'string' && text) this.setAttribute('heading', text);
    if (params?.tone) this.setAttribute('status', params.tone);
    return this.isConnected ? applied() : refused('closed');
  }

  get state() {
    return {
      status: this.status,
      icon: this.icon,
      heading: this.heading,
      supportingText: this.supportingText,
      actionText: this.actionText,
      action: this.action,
      closable: this.closable,
      closeLabel: this.closeLabel,
      duration: this.duration,
      role: this.toastRole,
      rootClass: this.getRootClass()
    };
  }

  setState(nextState = {}) {
    Object.entries(nextState || {}).forEach(([key, value]) => {
      const attr = (0,_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__.toAttributeName)(key);

      if (!attr) {
        return;
      }

      if (value === false || value === null || value === undefined || value === '') {
        this.removeAttribute(attr);
        return;
      }

      if (value === true) {
        this.setAttribute(attr, '');
        return;
      }

      this.setAttribute(attr, String(value));
    });
    return this;
  }

  onAction(handler, options) {
    if (typeof handler === 'function') {
      this.addEventListener('sf-toast-action', event => {
        if (event.target === this) handler(event.detail?.action, event.detail, event);
      }, options);
    }

    return this;
  }

  onClose(handler, options) {
    if (typeof handler === 'function') {
      this.addEventListener('sf-toast-close', event => {
        if (event.target === this) handler(event.detail, event);
      }, options);
    }

    return this;
  }

}

SfToast.define('sf-toast');
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "9560d0717f6e"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderToastTemplate: () => (/* binding */ renderToastTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);


function joinClasses(...tokens) {
  return tokens.flat().filter(Boolean).join(' ');
}

function buttonClasses(type) {
  if (type === 'primary') {
    return 'sf-button sf-button--default sf-button--primary sf-button--size-1/2';
  }

  return 'sf-button sf-button--default sf-button--on-surface sf-button--size-1/2';
}

function renderToastTemplate(context) {
  const rootClasses = joinClasses('sf-toast', // The component normalises the legacy words, so the template sees only the
  // shared vocabulary.
  `sf-toast--${['neutral', 'info', 'success', 'warning', 'error'].includes(context.status ?? context.type) ? context.status ?? context.type : 'neutral'}`, 'flex', 'items-cross-start', context.rootClass);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div
      class=${rootClasses}
      style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      role=${context.role || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      data-duration=${context.duration > 0 ? context.duration : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    >
      ${context.icon ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class="sf-icon" aria-hidden="true">${context.icon}</i>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}

      <div class="sf-toast-container flex flex-col flex-1">
        <div class="sf-toast-wrap flex flex-col">
          ${context.title ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-toast-text">${context.title}</div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          ${context.supportingText ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-toast-supporting-text">${context.supportingText}</div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        </div>

        ${context.actionText ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
              <div class="sf-toast-bottom flex items-center">
                <button
                  type="button"
                  class=${buttonClasses(context.type)}
                  data-action=${context.action || 'action'}
                  data-toast-action=${context.action || 'action'}
                >
                  <span class="sf-button-text-container">${context.actionText}</span>
                </button>
              </div>
            ` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      </div>

      ${context.closable ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
            <button
              type="button"
              class="sf-icon-button sf-icon-button--variant-close sf-icon-button--on-surface sf-icon-button--link sf-icon-button--size-1/3"
              aria-label=${context.closeLabel || 'Close message'}
              data-close
              data-toast-close
            >
              <span
                class="sf-close sf-close--size-1/3 flex justify-center items-center"
                aria-hidden="true"
              >
                <span class="sf-close-icon"></span>
              </span>
            </button>
          ` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    </div>
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

/***/ "43090d1c8307"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("page-language", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("page-language", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "deb1a4d61565"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("smart-base", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("smart-base", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "712ff066c789"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-toast for the shim (core/js/aliases.js, standard §16 item 20). mode: same-detail (setting rows), host-attribute (no shim), manifest-only (the DOM name does not change).","component":"sf-toast","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"title","to":"heading","kind":"setting","component":"sf-toast","since":"2026-10-27","remove_after":"2026-12-01","section":"§3.1, §16 item 26"},{"from":"type","to":"status","kind":"setting","component":"sf-toast","since":"2026-10-27","remove_after":"2026-12-01","section":"the axis\'s old name (journal attribute-type-to-status)"},{"from":"role","to":null,"kind":"attribute","component":"sf-toast","since":"2026-10-27","remove_after":"2026-12-01","mode":"host-attribute","section":"§3.1","note":"stays a host attribute, read by the toast (status or alert) and written on its root; no shim"},{"from":"sf-toast-action","to":null,"kind":"event","component":"sf-toast","since":"2026-10-27","remove_after":"2026-12-01","mode":"manifest-only","section":"§8","note":"the DOM name stays; detail keeps action and loses the elements toast and trigger"},{"from":"sf-toast-close","to":null,"kind":"event","component":"sf-toast","since":"2026-10-27","remove_after":"2026-12-01","mode":"manifest-only","section":"§8, §19.3","note":"the DOM name stays and is cancelable now; detail is {reason}, without the elements toast and trigger"}]}');

/***/ },

/***/ "b3afcae54093"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.toast","tag":"sf-toast","version":"1.1.4","kind":"leaf","settings":{"status":{"type":"enum","values":["neutral","info","success","warning","error"],"default":"neutral"},"icon":{"type":"icon","default":""},"heading":{"type":"string","default":""},"supporting-text":{"type":"string","default":""},"action-text":{"type":"string","default":""},"action":{"type":"string","default":"action"},"closable":{"type":"boolean","default":true},"close-label":{"type":"string","default-from":"runtime.close-label"},"duration":{"type":"number","default":0,"min":0}},"values":{},"events":{"action":{"carries":{"action":{"type":"string"}},"own-verb":true},"close":{"carries":{"reason":{"type":"enum","values":["close","escape","outside","cancelled","api"]}},"cancelable":true},"closed":{"carries":{"reason":{"type":"enum","values":["close","escape","outside","cancelled","api"]}}}},"actions":{"close":{"emits":"close"},"show":{"with":{"text":"string","code":"string","count":"number","tone":{"type":"enum","values":["info","success","warning","error"]}}}},"layer":{"kind":"toast","locks-page":false,"traps-focus":false},"css-variables":{"--sf-toast-background-color":{"type":"color","state":"default"},"--sf-toast-color":{"type":"color","state":"default"},"--sf-toast-border-color":{"type":"color","state":"default"},"--sf-toast-border-width":{"type":"length","state":"default"},"--sf-toast-radius":{"type":"length","state":"default"},"--sf-toast-padding-inline":{"type":"length","state":"default"},"--sf-toast-padding-block":{"type":"length","state":"default"},"--sf-toast-gap":{"type":"length","state":"default"}}}');

/***/ },

/***/ "1347db922742"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Toast","runtime":{"close-label":"Close message"},"events":{"action":{"label":"Do the toast\'s action"}}}');

/***/ },

/***/ "8191ff6a39ca"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Всплывающие сообщения","runtime":{"close-label":"Закрыть сообщение"},"events":{"action":{"label":"Выполнить действие сообщения"}}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("58c811a8f37f");
/******/
/******/ })()
;