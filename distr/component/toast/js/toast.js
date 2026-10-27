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
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

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
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("8489d1f5bab4");




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


/***/ },

/***/ "1ace9a75160f"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _toast__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2e6d67465f5f");
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

/***/ "8489d1f5bab4"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   followLanguage: () => (/* binding */ followLanguage),
/* harmony export */   isRussianPage: () => (/* binding */ isRussianPage),
/* harmony export */   language: () => (/* binding */ language),
/* harmony export */   pageLanguage: () => (/* binding */ pageLanguage),
/* harmony export */   pageLocale: () => (/* binding */ pageLocale),
/* harmony export */   pageText: () => (/* binding */ pageText),
/* harmony export */   pageWord: () => (/* binding */ pageWord)
/* harmony export */ });
// What language a component speaks, and how a product adds one.
//
// The Framework speaks English by default and whatever the page says otherwise:
// the language is the nearest [lang] above the node, else the document's, else
// English. One rule for every component, so a page never mixes two because two
// components looked in different places.
//
// Until 2026-10-10 that was the whole of it, and every component carried a
// dictionary of exactly two languages written into its source. Adding a third
// meant editing sixteen files, and a product that needed one could not add it
// at all. There will be many more than two (owner, 2026-10-11), so the
// dictionaries a component ships are now a FLOOR rather than the whole set:
// anything can be registered beside them, for any language, including one the
// Framework has never heard of.
//
// Where a word comes from, in order:
//
//   1. the component's own attribute — a consumer who names a word has named
//      it, and no language changes it;
//   2. a word registered for the resolved language;
//   3. the word the component ships for that language;
//   4. the same two again for the language without its region (`pt-BR` → `pt`);
//   5. the same two again for English;
//   6. the key itself, which is a visible defect rather than a blank.
//
// Registering is additive and reversible, and it does not require the
// Framework to know the language exists.
// The state is shared between every copy of this module, which there are
// several of: core, each smart component and each composite are separate
// bundles, and each one carries its own copy of this file. With the registry
// in module scope the page had as many registries as bundles -- `SF.language`
// was published from core's copy, the table read its own, and registering a
// language changed nothing on screen. Only a browser shows that, and it did
// (2026-10-11).
const STORE = (() => {
  const root = typeof globalThis !== 'undefined' ? globalThis : {};
  const key = '__sfPageLanguage';

  if (!root[key]) {
    root[key] = {
      listeners: new Set(),
      registered: new Map(),
      chosen: null
    };
  }

  return root[key];
})();

const LISTENERS = STORE.listeners;
const REGISTERED = STORE.registered;

const normalise = value => String(value ?? '').trim().toLowerCase().replace('_', '-');
/** The languages to try, most specific first, English last. */


const chain = language => {
  const wanted = normalise(language);
  const base = wanted.split('-')[0];
  const order = [];

  for (const candidate of [wanted, base, 'en']) {
    if (candidate && !order.includes(candidate)) order.push(candidate);
  }

  return order;
};
/** Which component a node belongs to, for words registered against one. */


const componentOf = node => {
  const tag = node?.tagName;
  return typeof tag === 'string' ? tag.toLowerCase() : null;
};

const announce = () => {
  for (const listener of [...LISTENERS]) {
    try {
      listener();
    } catch {// A listener that throws is not allowed to stop the others: a page that
      // half-changed language would be worse than one that did not change.
    }
  }
}; // The nearest element that says its language, looking past shadow roots: a
// pagination drawn inside a data view's shadow root found no [lang] there,
// fell back to <html lang> and spoke English inside a Russian admin whose
// language was set on the shell around it.


function langOwner(node) {
  let current = node;

  while (current) {
    const owner = typeof current.closest === 'function' ? current.closest('[lang]') : null;
    if (owner) return owner;
    const root = typeof current.getRootNode === 'function' ? current.getRootNode() : null;
    current = root && root !== current && root.host ? root.host : null;
  }

  return null;
} // The language of a part of the page wins over the language chosen for the
// whole page (owner, 2026-10-26; standard simai.smart-component 1.3.8 §11.1):
//   1. a word given on the element itself (the component's own attribute);
//   2. the nearest [lang] below <html>;
//   3. the page's choice, SF.language.use(), which also sets <html lang>;
//   4. <html lang>;
//   5. English.
// Until 2026-10-27 the choice won over a section's [lang], so an English
// section inside a Russian page that had called use('ru') spoke Russian.


function languageSource(node) {
  const owner = langOwner(node);
  const root = globalThis.document?.documentElement ?? null;
  if (owner && owner !== root) return owner.getAttribute('lang');
  if (STORE.chosen) return STORE.chosen;
  return owner?.getAttribute('lang') || root?.lang || 'en';
}
/**
 * The page's language for this node: the nearest [lang] below <html>, else
 * the language the page chose, else <html lang>, else English.
 */


function pageLanguage(node) {
  // The language without its region, whichever way it was set: a page that
  // chose 'pt-BR' is a Portuguese page, as a page whose markup says
  // lang="pt-BR" is. The chosen value kept its region and answered 'pt-br',
  // which matched no dictionary keyed by language and made isRussianPage false
  // on a page that chose 'ru-RU'. The region stays in pageLocale.
  return normalise(languageSource(node)).split('-')[0] || 'en';
}
/** The page's language with its region kept, which is what formatting wants. */

function pageLocale(node) {
  return normalise(languageSource(node)) || 'en';
}
/**
 * Follows `lang` in the document (§11.1 «changes are followed»): one observer
 * for the page, whichever bundle starts it, and the elements under a changed
 * [lang] draw again. `element.requestComponentUpdate('language')` is what a
 * Smart element does; anything else passes its own `redraw`. Returns the way
 * to stop following.
 */

function followLanguage(element, redraw = () => element.requestComponentUpdate?.('language')) {
  const root = typeof globalThis !== 'undefined' ? globalThis : {};
  const doc = element?.ownerDocument ?? root.document;
  const Observer = doc?.defaultView?.MutationObserver ?? root.MutationObserver;
  if (!doc?.documentElement || typeof Observer !== 'function') return () => {};

  if (!root.__sfLanguageWatch || root.__sfLanguageWatch.document !== doc) {
    const watch = {
      document: doc,
      elements: new Map(),
      observer: null
    };
    watch.observer = new Observer(records => {
      const changed = [...new Set(records.map(record => record.target))];

      for (const [one, again] of [...watch.elements]) {
        if (changed.some(target => within(target, one))) {
          try {
            again();
          } catch {// One element that fails to draw does not keep the others in the
            // old language.
          }
        }
      }
    });
    watch.observer.observe(doc.documentElement, {
      attributes: true,
      attributeFilter: ['lang'],
      subtree: true
    });
    root.__sfLanguageWatch = watch;
  }

  const watch = root.__sfLanguageWatch;
  watch.elements.set(element, redraw);
  return () => watch.elements.delete(element);
} // Whether `node` is `target` or below it, across shadow roots.

function within(target, node) {
  for (let current = node; current;) {
    if (current === target) return true;
    current = current.parentNode || current.host || null;
  }

  return false;
}

function isRussianPage(node) {
  return pageLanguage(node) === 'ru';
}
/**
 * Text for `key` in the page's language.
 *
 * `dictionary` is what the component ships; `component` names it for the
 * registry and defaults to the node's own tag, so a component calling with
 * `this` identifies itself without saying so twice.
 */

function pageText(dictionary, key, node, component) {
  const owner = component ?? componentOf(node);

  for (const candidate of chain(pageLocale(node))) {
    const added = owner ? REGISTERED.get(owner)?.get(candidate)?.[key] : undefined;
    if (added !== undefined) return added;
    const shipped = dictionary?.[candidate]?.[key];
    if (shipped !== undefined) return shipped;
  }

  return key;
} // Missing words are said once per component, word and language: a page that
// draws a hundred rows must not print a hundred warnings. The marks are kept on
// the shared global, because every bundle carries this module.

function warnWord(owner, key, locale, said) {
  const root = typeof globalThis !== 'undefined' ? globalThis : {};
  if (!(root.__sfWordWarnings instanceof Set)) root.__sfWordWarnings = new Set();
  const mark = `${owner}|${key}|${locale}|${said}`;
  if (root.__sfWordWarnings.has(mark)) return;

  root.__sfWordWarnings.add(mark);

  globalThis.console?.warn?.(`[SIMAI Framework] ${owner || 'component'}: no word "${key}" for ${locale}${said === 'key' ? '; the key is shown' : `; said in ${said}`}`);
}

function fill(text, locale, count, vars) {
  return String(text).replace(/\{([a-z][\w-]*)\}/giu, (whole, name) => {
    if (name === 'n' && count !== undefined) {
      try {
        return new Intl.NumberFormat(locale).format(count);
      } catch {
        return String(count);
      }
    }

    return vars && Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name]) : whole;
  });
}
/**
 * A component's own word (standard simai.smart-component 1.3.8 §11, §11.1).
 *
 * `dictionary` is `{<locale>: {<key>: word}}` from the component's language
 * files. A word given on the element itself is the caller's to prefer; this
 * resolves the rest: words registered for the element's language, then the
 * shipped ones, the language without its region, English, the component's
 * source language and, last, the key. The last two warn once. A word that
 * takes a number is an object of plural forms chosen by Intl.PluralRules of
 * the language the word was found in; `{n}` is the number in that language's
 * format and `{name}` takes `vars.name`.
 *
 * `former` names the key the same word had before a rename (one key or a
 * list): a product that registered its words under the old key keeps them
 * until the alias's day. For each language the word registered under the new
 * key wins, then one registered under an old key, then the shipped one; a
 * word taken by an old key is reported to `onFormer(oldKey)`, which notes the
 * deprecation.
 */


function pageWord(dictionary, key, node, {
  component,
  source = '',
  count,
  vars,
  former,
  onFormer
} = {}) {
  const owner = component ?? componentOf(node);
  const locale = pageLocale(node);
  const order = chain(locale);
  const sourceLanguage = normalise(source);
  if (sourceLanguage && !order.includes(sourceLanguage)) order.push(sourceLanguage);
  const formerKeys = former === undefined || former === null ? [] : [].concat(former);

  for (const candidate of order) {
    const registered = owner ? REGISTERED.get(owner)?.get(candidate) : undefined;
    let added = registered?.[key];

    if (added === undefined && registered) {
      const old = formerKeys.find(name => registered[name] !== undefined && registered[name] !== null);

      if (old !== undefined) {
        added = registered[old];
        onFormer?.(old);
      }
    }

    const word = added !== undefined ? added : dictionary?.[candidate]?.[key];
    if (word === undefined || word === null) continue;
    if (candidate === sourceLanguage && !chain(locale).includes(candidate)) warnWord(owner, key, locale, candidate);

    if (typeof word === 'object') {
      let form = 'other';

      if (count !== undefined) {
        try {
          form = new Intl.PluralRules(candidate).select(Number(count));
        } catch {
          form = 'other';
        }
      }

      const picked = word[form] ?? word.other;
      if (picked === undefined) continue;
      return fill(picked, candidate, count, vars);
    }

    return fill(word, candidate, count, vars);
  }

  warnWord(owner, key, locale, 'key');
  return key;
}
const language = {
  /** What the page resolves to for this node, region and all. */
  current(node = globalThis.document?.documentElement ?? null) {
    return pageLocale(node);
  },

  /**
   * Choose a language for the whole page, whatever its markup says. `null`
   * returns to following the document, which is the default and what a
   * server-rendered page wants.
   */
  use(value) {
    const next = value === null || value === undefined ? null : normalise(value);
    if (next === STORE.chosen) return STORE.chosen;
    STORE.chosen = next; // The choice is the page's language: <html lang> says it too (§11.1), so
    // the browser, a screen reader and CSS :lang() agree with the words.
    // use(null) gives the markup's own language back.

    const root = globalThis.document?.documentElement;

    if (root) {
      const holder = globalThis;

      if (next) {
        if (holder.__sfMarkupLanguage === undefined) holder.__sfMarkupLanguage = root.getAttribute('lang');
        if (root.getAttribute('lang') !== next) root.setAttribute('lang', next);
      } else if (holder.__sfMarkupLanguage !== undefined) {
        if (holder.__sfMarkupLanguage === null) root.removeAttribute('lang');else root.setAttribute('lang', holder.__sfMarkupLanguage);
        holder.__sfMarkupLanguage = undefined;
      }
    }

    announce();
    return STORE.chosen;
  },

  /**
   * Add or replace one component's words for one language.
   *
   * The words are merged, so a product can correct a single label without
   * restating the rest, and `null` removes what it added.
   */
  register(component, value, words) {
    const name = String(component ?? '').toLowerCase();
    const code = normalise(value);
    if (!name || !code) throw new TypeError('a component and a language are required');
    if (!REGISTERED.has(name)) REGISTERED.set(name, new Map());
    const byLanguage = REGISTERED.get(name);
    if (words === null) byLanguage.delete(code);else byLanguage.set(code, { ...(byLanguage.get(code) ?? {}),
      ...words
    });
    announce();
    return this;
  },

  /** One language across many components: `{ 'sf-datepicker': {...}, ... }`. */
  registerAll(value, byComponent = {}) {
    for (const [component, words] of Object.entries(byComponent)) {
      this.register(component, value, words);
    }

    return this;
  },

  /** The languages something has registered words for. */
  known(component) {
    const name = String(component ?? '').toLowerCase();
    return [...(REGISTERED.get(name)?.keys() ?? [])];
  },

  /** Every component something has been registered for. */
  components() {
    return [...REGISTERED.keys()];
  },

  /**
   * Called whenever the chosen language or the registered words change, so a
   * component can draw itself again. Returns the way to stop listening.
   */
  onChange(listener) {
    if (typeof listener !== 'function') return () => {};
    LISTENERS.add(listener);
    return () => LISTENERS.delete(listener);
  },

  /** Everything registered is forgotten. For tests, and for a product reset. */
  forget() {
    REGISTERED.clear();
    STORE.chosen = null;
    announce();
    return this;
  }

}; // Reachable by a consumer, which it was not: `sf-admin-menu` had written its
// own reading of the rule because the shared one was an internal module, and
// the two then disagreed about a region that names its own language. A product
// composing its own elements gets the same rule here.

if (typeof window !== 'undefined') {
  window.SF = window.SF || {};
  window.SF.language = language;
  window.SF.pageLanguage = pageLanguage;
  window.SF.pageText = pageText;
}

/***/ },

/***/ "0a7ae57ea2d3"
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
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("0a7ae57ea2d3");
/* harmony import */ var _js_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("1ace9a75160f");
/**
* SIMAI Framework
* Copyright 2008-2026 SIMAI Ltd
* http://simai.studio
* Read the license: http://framework.simai.studio/license/
* Documentation: http://framework.simai.studio/
* Support: http://simai.studio/support/
*
* SLIDER
*
* Entry point for importing components from this directory.
* Simplifies the import process in other parts of the project.
* Instead of importing individual files, all component can be imported through this file.
*/


})();

/******/ })()
;