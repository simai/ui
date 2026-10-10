/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "a2a9d3c2841e"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BADGE_SCHEMES: () => (/* binding */ BADGE_SCHEMES),
/* harmony export */   BADGE_SIZES: () => (/* binding */ BADGE_SIZES),
/* harmony export */   BADGE_TYPES: () => (/* binding */ BADGE_TYPES),
/* harmony export */   BADGE_VARIANTS: () => (/* binding */ BADGE_VARIANTS),
/* harmony export */   normalizeBadgeContract: () => (/* binding */ normalizeBadgeContract)
/* harmony export */ });
const BADGE_TYPES = Object.freeze(['main', 'tonal', 'outline']);
const BADGE_SCHEMES = Object.freeze(['neutral', 'primary', 'secondary', 'tertiary', 'info', 'success', 'warning', 'danger', 'on-surface']);
const BADGE_SIZES = Object.freeze(['1/3', '1/2', '1']);
const DEFAULT_BADGE_TYPE = 'main';
const DEFAULT_BADGE_SCHEME = 'neutral';
const DEFAULT_BADGE_SIZE = '1/3';

const normalizeEnum = (value, allowed, fallback) => {
  const normalized = String(value ?? fallback).trim().toLowerCase();
  return allowed.includes(normalized) ? normalized : fallback;
};

const BADGE_VARIANTS = Object.freeze(BADGE_SCHEMES.flatMap(scheme => BADGE_TYPES.filter(type => !(scheme === 'on-surface' && type === 'tonal')).flatMap(type => BADGE_SIZES.map(size => Object.freeze({
  type,
  scheme,
  size
})))));
function normalizeBadgeContract({
  type,
  scheme,
  size
} = {}) {
  let normalizedType = normalizeEnum(type, BADGE_TYPES, DEFAULT_BADGE_TYPE);
  const normalizedScheme = normalizeEnum(scheme, BADGE_SCHEMES, DEFAULT_BADGE_SCHEME);
  const normalizedSize = normalizeEnum(size, BADGE_SIZES, DEFAULT_BADGE_SIZE);

  if (normalizedType === 'tonal' && normalizedScheme === 'on-surface') {
    normalizedType = 'main';
  }

  return {
    type: normalizedType,
    scheme: normalizedScheme,
    size: normalizedSize
  };
}

/***/ },

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
    try {
      await navigator.clipboard.writeText(text);
      return 'native';
    } catch {// A secure page whose clipboard permission is denied -- a policy, an
      // embedded frame, a browser that asks and was answered no. The API being
      // present was read as the API being allowed, so the fallback that exists
      // for exactly this was never reached and the copy simply failed.
    }
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

/***/ "06e8cd089f28"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   clearDeprecations: () => (/* binding */ clearDeprecations),
/* harmony export */   listDeprecations: () => (/* binding */ listDeprecations),
/* harmony export */   noteDeprecated: () => (/* binding */ noteDeprecated)
/* harmony export */ });
// What a page still uses that the Framework keeps only for compatibility. Every
// legacy attribute, value or name a component resolves is noted here once, so a
// person, a probe or an AI upgrading a product can read the list off a running
// page (SF.deprecations.list()) instead of searching the source for it. The
// records behind the names are in contracts/changes/journal.json.
//
// Nothing is printed by default: a page opts in to console warnings with
// <html data-sf-deprecations="warn"> or SF.deprecations.warn = true.
const notes = new Map();

function warnEnabled() {
  const root = globalThis.document?.documentElement;
  return root?.dataset?.sfDeprecations === 'warn' || globalThis.SF?.deprecations?.warn === true;
}

function noteDeprecated({
  component = '',
  kind = 'attribute',
  attribute = '',
  from,
  to = null
} = {}) {
  if (!from) return;
  const key = [component, kind, attribute, from].join('|');
  const existing = notes.get(key);

  if (existing) {
    existing.count += 1;
    return;
  }

  notes.set(key, {
    component,
    kind,
    attribute,
    from,
    to,
    count: 1
  });

  if (warnEnabled()) {
    const where = component ? `${component}: ` : '';
    const what = kind === 'value' ? `${attribute}="${from}"` : `${kind} ${from}`;
    globalThis.console?.warn?.(`[Simai Framework] ${where}${what} is a legacy name${to ? `; write ${to}` : ''}. See contracts/changes/journal.json.`);
  }
}
function listDeprecations() {
  return [...notes.values()].map(note => ({ ...note
  }));
}
function clearDeprecations() {
  notes.clear();
}

if (typeof globalThis !== 'undefined') {
  globalThis.SF = globalThis.SF || {};
  const api = globalThis.SF.deprecations || {};
  api.list = listDeprecations;
  api.clear = clearDeprecations;
  api.note = noteDeprecated;
  globalThis.SF.deprecations = api;
}

/***/ },

/***/ "8489d1f5bab4"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isRussianPage: () => (/* binding */ isRussianPage),
/* harmony export */   language: () => (/* binding */ language),
/* harmony export */   pageLanguage: () => (/* binding */ pageLanguage),
/* harmony export */   pageLocale: () => (/* binding */ pageLocale),
/* harmony export */   pageText: () => (/* binding */ pageText)
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
};
/**
 * The page's language for this node: the nearest [lang], else the document's,
 * else English — unless a product has chosen one explicitly.
 */


function pageLanguage(node) {
  if (STORE.chosen) return STORE.chosen;
  const owner = node && typeof node.closest === 'function' ? node.closest('[lang]') : null;
  const value = owner?.getAttribute('lang') || globalThis.document?.documentElement?.lang || 'en';
  return normalise(value).split('-')[0] || 'en';
}
/** The page's language with its region kept, which is what formatting wants. */

function pageLocale(node) {
  if (STORE.chosen) return STORE.chosen;
  const owner = node && typeof node.closest === 'function' ? node.closest('[lang]') : null;
  return normalise(owner?.getAttribute('lang') || globalThis.document?.documentElement?.lang || 'en');
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
    STORE.chosen = next;
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

  /** One language across many components: `{ 'sf-table': {...}, ... }`. */
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

/***/ "0845ef25b9de"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   applySmartProps: () => (/* binding */ applySmartProps),
/* harmony export */   createSmartElement: () => (/* binding */ createSmartElement),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   normalizeEnum: () => (/* binding */ normalizeEnum),
/* harmony export */   parseJsonAttribute: () => (/* binding */ parseJsonAttribute),
/* harmony export */   smartElement: () => (/* binding */ smartElement),
/* harmony export */   toAttributeName: () => (/* binding */ toAttributeName),
/* harmony export */   toBoolean: () => (/* binding */ toBoolean),
/* harmony export */   toNumber: () => (/* binding */ toNumber)
/* harmony export */ });
/* harmony import */ var _deprecations_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("06e8cd089f28");
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("fef8077ac919");
/* harmony import */ var lit_directives_ref_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("7fcbcc00731e");
/* harmony import */ var lit_directive_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("69fcfee6f64b");
/* harmony import */ var _page_language__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("8489d1f5bab4");





function toBoolean(value, fallback = false) {
  if (value === undefined || value === null || value === "") return fallback;
  if (typeof value === "boolean") return value;
  return ["1", "true", "yes", "on", "checked", "disabled", "download", "indeterminate", "multiple"].includes(String(value).toLowerCase());
}
function toAttributeName(key) {
  if (key === "className") {
    return "class";
  }

  return String(key || "").replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
}
function toNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
} // A closed list may also answer to legacy values that mean the same thing, which
// is how a value can be renamed without breaking a consumer: {'1/2': ['small']}
// keeps size="small" working while the canonical answer is 1/2.

function normalizeEnum(value, allowed, fallback, valueAliases = null, onLegacy = null) {
  const normalized = String(value || fallback).trim().toLowerCase();

  if (Array.isArray(allowed) && allowed.includes(normalized)) {
    return normalized;
  }

  if (valueAliases) {
    for (const [canonical, legacy] of Object.entries(valueAliases)) {
      const names = Array.isArray(legacy) ? legacy : [legacy];

      if (names.map(name => String(name).toLowerCase()).includes(normalized)) {
        onLegacy?.(normalized, canonical);
        return canonical;
      }
    }
  }

  return fallback;
}
function parseJsonAttribute(element, name, fallback = null) {
  const rawValue = element?.getAttribute?.(name);

  if (!rawValue) {
    return fallback;
  }

  try {
    return JSON.parse(rawValue);
  } catch (error) {
    console.warn(`${element?.tagName?.toLowerCase?.() || "sf-element"}: invalid ${name} JSON`, error);
    return fallback;
  }
}

function smartTagName(type) {
  const tagName = String(type || "").startsWith("sf-") ? String(type) : `sf-${String(type || "")}`;

  if (!/^sf-[a-z0-9-]+$/.test(tagName)) {
    throw new Error(`Invalid SF tag name: ${tagName}`);
  }

  return tagName;
} // Writes a props object onto an element that already exists, and reports what it
// wrote so the next write can take back what the props no longer carry. An
// attribute is only touched when its value differs, a listener only swapped when
// the function differs; both matter for an element a person is using while the
// table re-renders around them.


function applySmartProps(element, props = {}, previous = null) {
  const listeners = previous?.listeners ?? new Map();
  const attributes = previous?.attributes ?? new Set();
  const nextListeners = new Map();
  const nextAttributes = new Set();

  for (const [key, value] of Object.entries(props || {})) {
    if (key === ":key" || typeof value === "undefined" || value === null) {
      continue;
    }

    if (key === ":ref") {
      if (typeof value === "function") {
        value(element);
      } else if (value && typeof value === "object") {
        value.value = element;
      }

      continue;
    }

    const eventName = key.startsWith("@") ? key.slice(1) : /^on[A-Z]/.test(key) ? key.slice(2).toLowerCase() : null;

    if (eventName && typeof value === "function") {
      nextListeners.set(eventName, value);
      continue;
    }

    const attributeName = toAttributeName(key);

    if (typeof value === "boolean") {
      element.toggleAttribute(attributeName, value);
      nextAttributes.add(attributeName);
      continue;
    }

    if (typeof value === "object" || typeof value === "function") {
      element[key] = value;
      continue;
    }

    if (element.getAttribute(attributeName) !== String(value)) {
      element.setAttribute(attributeName, String(value));
    }

    nextAttributes.add(attributeName);
  }

  for (const [name, handler] of listeners) {
    if (nextListeners.get(name) !== handler) {
      element.removeEventListener(name, handler);
    }
  }

  for (const [name, handler] of nextListeners) {
    if (listeners.get(name) !== handler) {
      element.addEventListener(name, handler);
    }
  }

  for (const name of attributes) {
    if (!nextAttributes.has(name)) {
      element.removeAttribute(name);
    }
  }

  return {
    listeners: nextListeners,
    attributes: nextAttributes
  };
} // One element per place in the template. A directive instance belongs to the
// position it was rendered in, so the element it makes is the element that
// position keeps: a re-render writes the props onto it instead of replacing it.
//
// Elements used to be created on every render and handed to lit as a new node,
// so every cell that is a Framework element was torn out and rebuilt whenever
// anything in the table changed -- fourteen nodes a row, changed row or not,
// taking the control a person was interacting with with them.

class SmartElementDirective extends lit_directive_js__WEBPACK_IMPORTED_MODULE_3__.Directive {
  constructor(partInfo) {
    super(partInfo);

    if (partInfo.type !== lit_directive_js__WEBPACK_IMPORTED_MODULE_3__.PartType.CHILD) {
      throw new Error("renderSmartElement belongs in a child position of a template");
    }

    this._element = null;
    this._tagName = "";
    this._written = null;
  }

  render(type, props = {}) {
    const tagName = smartTagName(type);

    if (!this._element || this._tagName !== tagName) {
      this._element = document.createElement(tagName);
      this._tagName = tagName;
      this._written = null;
    }

    this._written = applySmartProps(this._element, props, this._written);
    return this._element;
  }

}

const smartElement = (0,lit_directive_js__WEBPACK_IMPORTED_MODULE_3__.directive)(SmartElementDirective); // The same element, outside a template. A caller that holds the element itself
// -- a portal, a measurement, a test -- gets a fresh one, because there is no
// position to keep it in.

function createSmartElement(type, props = {}) {
  const element = document.createElement(smartTagName(type));
  applySmartProps(element, props, null);
  return element;
}

class SfBaseElement extends HTMLElement {
  static externalTemplateBasePath = "/local/smart/templates";
  static externalTemplateModules = new Map();
  static externalTemplateMisses = new Set();
  static externalTemplateChecks = new Map();
  static externalTemplateCssLoaded = new Set();
  static externalTemplateCssMisses = new Set();
  static waitForStylesBeforeRenderReady = true;
  static styleReadyTimeout = 3000;
  static styleReadinessCssId = "sf-smart-style-readiness";

  static get props() {
    return {};
  }

  static get observedAttributes() {
    return Array.from(new Set([...this.propsToAttributes(), "template", "root-class", "root-style", "style"]));
  }

  static propsToAttributes(props = this.props) {
    return Object.entries(props || {}).flatMap(([key, config]) => {
      const normalized = this.normalizePropConfig(key, config);
      return [normalized.attribute, ...normalized.aliases];
    }).filter(Boolean);
  }

  static normalizePropConfig(key, config = "") {
    const isConfigObject = config && typeof config === "object" && !Array.isArray(config) && (Object.prototype.hasOwnProperty.call(config, "type") || Object.prototype.hasOwnProperty.call(config, "default") || Object.prototype.hasOwnProperty.call(config, "attribute") || Object.prototype.hasOwnProperty.call(config, "parser") || Object.prototype.hasOwnProperty.call(config, "parse") || Object.prototype.hasOwnProperty.call(config, "values"));
    const propConfig = isConfigObject ? { ...config
    } : {
      default: config
    };
    const defaultValue = propConfig.default;
    const inferredType = propConfig.type || (Array.isArray(defaultValue) ? Array : defaultValue !== null && typeof defaultValue === "object" ? Object : typeof defaultValue === "boolean" ? Boolean : typeof defaultValue === "number" ? Number : String); // A prop may name legacy attributes it still answers to. The canonical name
    // wins when both are present; otherwise the first legacy name that is set is
    // read. This is what lets an axis be renamed without breaking a consumer.

    const aliases = (Array.isArray(propConfig.aliases) ? propConfig.aliases : propConfig.aliases ? [propConfig.aliases] : []).map(alias => alias === false ? "" : toAttributeName(alias)).filter(Boolean);
    return { ...propConfig,
      key,
      attribute: propConfig.attribute === false ? "" : propConfig.attribute || toAttributeName(key),
      aliases,
      default: defaultValue,
      type: inferredType
    };
  }

  static toBoolean(value, fallback = false) {
    return toBoolean(value, fallback);
  }

  static toAttributeName(key) {
    return toAttributeName(key);
  }

  static toNumber(value, fallback = 0) {
    return toNumber(value, fallback);
  }

  static normalizeEnum(value, allowed, fallback) {
    return normalizeEnum(value, allowed, fallback);
  }

  static parseJsonAttribute(element, name, fallback = null) {
    return parseJsonAttribute(element, name, fallback);
  }

  static get tagName() {
    return this.resolveTagName();
  }

  static resolveTagName(className = this.name) {
    const tagName = String(className || "").trim().replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/([A-Z])([A-Z][a-z])/g, "$1-$2").replace(/_/g, "-").toLowerCase();

    if (!tagName) {
      return "";
    }

    return tagName.includes("-") ? tagName : `sf-${tagName}`;
  } // One component can reach a page twice: as its own file and inside a bundle
  // that carries it. Those are two class objects with the same tag, and
  // re-registering is a no-op, not a mistake worth a warning. A tag taken by a
  // different component, or by a class that is not a Simai element at all, is
  // a real conflict and still warns.


  static get sfElementBrand() {
    return "simai.smart-base.v1";
  }

  static isSameComponentAs(other) {
    if (other === this) {
      return true;
    }

    if (!other || other.sfElementBrand !== this.sfElementBrand) {
      return false;
    }

    const isClassName = value => /^[A-Z][A-Za-z0-9_]{2,}$/.test(String(value || ""));

    if (isClassName(other.name) && isClassName(this.name)) {
      return other.name === this.name;
    } // Minified builds mangle class names; the shared brand and the tag are
    // then all the identity there is.


    return true;
  }

  static define(tagName) {
    const resolvedTagName = String(tagName || this.resolveTagName()).trim().toLowerCase();

    if (!resolvedTagName || !resolvedTagName.includes("-")) {
      throw new Error(`${this.name || "SfBaseElement"}.define(): cannot resolve custom element tag. Call define() on a named subclass or pass tagName explicitly.`);
    }

    const existing = customElements.get(resolvedTagName);

    if (existing) {
      if (!this.isSameComponentAs(existing)) {
        console.warn(`${this.name || "SfBaseElement"}.define(): ${resolvedTagName} is already defined`, existing);
      }

      return existing;
    }

    customElements.define(resolvedTagName, this);
    return this;
  }

  static ensureStyleReadinessCss() {
    if (typeof document === "undefined" || document.getElementById(this.styleReadinessCssId)) {
      return;
    }

    const style = document.createElement("style");
    style.id = this.styleReadinessCssId;
    style.textContent = "[data-sf-style-pending],[data-sf-style-pending] *{visibility:hidden!important;}";
    document.head.append(style);
  }

  constructor() {
    super();
    this._updateScheduled = false;
    this._changedAttributes = new Set();
    this._updateLoopCount = 0;
    this._updateLoopResetScheduled = false;
    this._updateLoopBlocked = false;
    this._updateLoopWarned = false;
    this._isMounted = false;
    this._hasRendered = false;
    this._renderToken = 0;
    this._externalTemplateModule = null;
    this._slotTemplates = new Map();
    this._liveSlotNodes = new Map();
    this._slotTemplatesCaptured = false;
    this._customTemplateProps = new Map();
    this._refEffects = new Map();
    this._activeRefEffects = null;
    this._hostStyle = "";
    this._syncingHostStyle = false;
    this._authorStyleElement = null;
    this._authorStyleObserver = null;
    this._styleReady = false;
    this._styleReadyPromise = null;
    this.__sfSmartElement = true;
    this.__sfSourceCaptured = false;
  }

  connectedCallback() {
    this.constructor.ensureStyleReadinessCss();
    this.captureHostStyle();
    this.applyHostDisplayStyle();
    this.captureSlotTemplates();
    this.__sfSourceCaptured = true;
    this._isMounted = true;
    this.onConnected(); // A component chooses its words when it draws and would otherwise keep
    // them for ever: changing the page's language used to mean reloading it.
    // Subscribing here rather than in each component is the same argument as
    // the shared rule itself -- sixteen subscriptions would be sixteen chances
    // to forget one (owner, 2026-10-11: «языков будет гораздо больше чем два»).

    this.__sfLanguageOff = _page_language__WEBPACK_IMPORTED_MODULE_4__.language.onChange(() => {
      if (this._isMounted) this.requestComponentUpdate("language");
    });
    this.emitComponentEvent("connected");
    this.requestComponentUpdate("connected");
  }

  disconnectedCallback() {
    this._isMounted = false;
    this.__sfLanguageOff?.();
    this.__sfLanguageOff = null;

    try {
      this.onDisconnected();
    } finally {
      this._releaseExternalTemplate();
    }

    this.emitComponentEvent("disconnected");
  }

  toBoolean(value, fallback = false) {
    return toBoolean(value, fallback);
  }

  toAttributeName(key) {
    return toAttributeName(key);
  } // Kept as the name every template already calls. The element it returns is
  // the one this position in the template already had.


  renderSmartElement(type, props = {}) {
    return smartElement(type, props);
  }

  toNumber(value, fallback = 0) {
    return toNumber(value, fallback);
  }

  normalizeEnum(value, allowed, fallback) {
    return normalizeEnum(value, allowed, fallback);
  }

  parseJsonAttribute(name, fallback = null) {
    return parseJsonAttribute(this, name, fallback);
  }

  getBooleanAttr(name, fallback = false) {
    const attr = this.attributeName(name);

    if (!attr || !this.hasAttribute(attr)) {
      return fallback;
    }

    const value = this.getAttribute(attr);

    if (value === "") {
      return true;
    }

    return toBoolean(value, fallback);
  }

  getNumberAttr(name, fallback = 0) {
    const attr = this.attributeName(name);

    if (!attr || !this.hasAttribute(attr)) {
      return fallback;
    }

    const value = this.getAttribute(attr);

    if (value === "") {
      return fallback;
    }

    return toNumber(value, fallback);
  } // The canonical attribute if it is set, otherwise the first legacy name that is.


  resolveAttributeName({
    attribute = "",
    aliases = []
  } = {}) {
    if (attribute && this.hasAttribute(attribute)) {
      return attribute;
    }

    const legacy = aliases.find(alias => this.hasAttribute(alias));

    if (legacy) {
      (0,_deprecations_js__WEBPACK_IMPORTED_MODULE_0__.noteDeprecated)({
        component: this.localName,
        kind: 'attribute',
        from: legacy,
        to: attribute || null
      });
    }

    return legacy || attribute;
  } // The same rule for a component that reads an enum directly. It may pass the
  // legacy attribute names it answers to, and — through the options form —
  // the legacy values it accepts:
  //   getEnumAttr('size', {values: ['1/2', '1'], fallback: '1',
  //                        valueAliases: {'1/2': ['small'], 1: ['medium']}})


  getEnumAttr(name, allowed = [], fallback = "", aliases = []) {
    const options = allowed && !Array.isArray(allowed) && typeof allowed === "object" ? allowed : {
      values: allowed,
      fallback,
      aliases
    };
    const attr = this.resolveAttributeName({
      attribute: this.attributeName(name),
      aliases: (Array.isArray(options.aliases) ? options.aliases : [options.aliases]).filter(Boolean).map(alias => this.attributeName(alias))
    });
    const value = attr && this.hasAttribute(attr) ? this.getAttribute(attr) : undefined;
    return normalizeEnum(value, options.values ?? [], options.fallback ?? "", options.valueAliases ?? null, (from, to) => (0,_deprecations_js__WEBPACK_IMPORTED_MODULE_0__.noteDeprecated)({
      component: this.localName,
      kind: 'value',
      attribute: this.attributeName(name),
      from,
      to
    }));
  }

  hasDeclaredProps() {
    return Object.keys(this.constructor.props || {}).length > 0;
  }

  createRef() {
    const ref = (0,lit_directives_ref_js__WEBPACK_IMPORTED_MODULE_2__.createRef)();
    ref.__sfOwner = this;
    return ref;
  }

  registerRefEffect(ref, callback, options = {}) {
    if (!ref || typeof callback !== "function") {
      return this;
    }

    const currentRecord = this._refEffects.get(ref) || {};
    const record = { ...currentRecord,
      callback,
      once: options.once === true
    };

    this._refEffects.set(ref, record);

    this._activeRefEffects?.add(ref);
    return this;
  }

  flushRefEffects() {
    if (!this._refEffects.size) {
      return this;
    }

    const activeRefs = this._activeRefEffects;

    this._refEffects.forEach((record, ref) => {
      if (activeRefs && !activeRefs.has(ref)) {
        if (typeof record.cleanup === "function") {
          record.cleanup();
        }

        this._refEffects.delete(ref);

        return;
      }

      const nextValue = ref?.value || null;

      if (Object.is(record.value, nextValue)) {
        return;
      }

      if (typeof record.cleanup === "function") {
        record.cleanup();
      }

      record.value = nextValue;
      record.cleanup = null;

      if (!nextValue) {
        return;
      }

      const cleanup = record.callback.call(this, nextValue, {
        component: this,
        ref,
        value: nextValue
      });
      record.cleanup = typeof cleanup === "function" ? cleanup : null;

      if (record.once) {
        this._refEffects.delete(ref);
      }
    });

    this._activeRefEffects = null;
    return this;
  }

  getPropsContext(props = this.constructor.props || {}) {
    return Object.fromEntries(Object.entries(props).map(([key, config]) => [key, this.getPropValue(key, config)]));
  }

  getProp(key, fallbackConfig = "") {
    const props = this.constructor.props || {};
    return this.getPropValue(key, props[key] ?? fallbackConfig);
  }

  getPropValue(key, config = "") {
    const propConfig = this.constructor.normalizePropConfig(key, config);
    const {
      type,
      default: defaultValue
    } = propConfig;
    const parser = propConfig.parser || propConfig.parse;
    const attribute = this.resolveAttributeName(propConfig);
    const hasAttribute = attribute ? this.hasAttribute(attribute) : false;
    const rawValue = hasAttribute ? this.getAttribute(attribute) : undefined;

    if (!hasAttribute && Object.prototype.hasOwnProperty.call(this, key)) {
      return this.coercePropValue(this[key], propConfig);
    }

    if (typeof parser === "function") {
      return parser.call(this, rawValue, defaultValue, this);
    }

    if (!hasAttribute) {
      return this.clonePropDefault(defaultValue, type);
    }

    return this.coercePropValue(rawValue, propConfig);
  }

  coercePropValue(value, config = {}) {
    const {
      type,
      default: defaultValue,
      values,
      valueAliases
    } = config;

    if (type === Boolean) {
      if (value === "") {
        return true;
      }

      return toBoolean(value, Boolean(defaultValue));
    }

    if (type === Number) {
      return toNumber(value, Number(defaultValue || 0));
    }

    if (type === Array || type === Object) {
      if (typeof value !== "string") {
        return value ?? this.clonePropDefault(defaultValue, type);
      }

      try {
        return JSON.parse(value);
      } catch (error) {
        console.warn(`${this.tagName.toLowerCase()}: invalid ${config.attribute} JSON`, error);
        return this.clonePropDefault(defaultValue, type);
      }
    }

    if (Array.isArray(values)) {
      // The legacy values belong here, not only in a component's own getter: the
      // template reads the props context, so a legacy word that is normalised in
      // the getter alone would still reach the class list as the default.
      return normalizeEnum(value, values, defaultValue || values[0] || "", valueAliases || null, (from, to) => (0,_deprecations_js__WEBPACK_IMPORTED_MODULE_0__.noteDeprecated)({
        component: this.localName,
        kind: 'value',
        attribute: config.attribute || config.key || '',
        from,
        to
      }));
    }

    return value ?? this.clonePropDefault(defaultValue, type);
  }

  clonePropDefault(defaultValue, type) {
    if (Array.isArray(defaultValue)) {
      return [...defaultValue];
    }

    if (defaultValue && typeof defaultValue === "object" && (type === Object || type === Array)) {
      return { ...defaultValue
      };
    }

    if (typeof defaultValue !== "undefined") {
      return defaultValue;
    }

    if (type === Boolean) {
      return false;
    }

    if (type === Number) {
      return 0;
    }

    if (type === Array) {
      return [];
    }

    if (type === Object) {
      return {};
    }

    return "";
  }

  get value() {
    return this.getAttribute("value") || "";
  }

  set value(nextValue) {
    if (nextValue && typeof nextValue === "object" && !Array.isArray(nextValue)) {
      this.setValueAttributes(nextValue);
      return;
    }

    this.setAttributeValue("value", nextValue);
  }

  getAttributeValue(name = "value", fallback = "") {
    return this.getAttribute(name) || fallback;
  }

  setAttributeValue(name = "value", nextValue = "") {
    const attr = toAttributeName(name);

    if (!attr) {
      return this;
    }

    if (nextValue === null || typeof nextValue === "undefined") {
      this.removeAttribute(attr);
      return this;
    }

    this.setAttribute(attr, String(nextValue));
    return this;
  }

  setValueAttributes(nextValue = {}, options = {}) {
    if (!nextValue || typeof nextValue !== "object") {
      return this;
    }

    const {
      stringifyObjects = true,
      removeEmptyString = true
    } = options;
    Object.entries(nextValue).forEach(([key, value]) => {
      const attr = toAttributeName(key);

      if (!attr) {
        return;
      }

      this.setCustomTemplateProp(key, value);

      if (value === false || value === null || typeof value === "undefined" || removeEmptyString && value === "") {
        this.removeAttribute(attr);
        return;
      }

      if (value === true) {
        this.setAttribute(attr, "");
        return;
      }

      if (stringifyObjects && (Array.isArray(value) || typeof value === "object")) {
        this.setAttribute(attr, JSON.stringify(value));
        return;
      }

      this.setAttribute(attr, String(value));
    });
    return this;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) {
      return;
    }

    if (name === "style") {
      if (this._syncingHostStyle) {
        return;
      }

      this._hostStyle = this.normalizeHostStyle(newValue);
      this.syncAuthorStyle();
      this.applyHostDisplayStyle();
    }

    this.requestComponentUpdate(name);
  }

  get updateLoopLimit() {
    const limit = Number(this.constructor.updateLoopLimit ?? 50);
    return Number.isFinite(limit) ? limit : 50;
  }

  resetUpdateLoopGuard() {
    this._updateLoopCount = 0;
    this._updateLoopResetScheduled = false;
    this._updateLoopBlocked = false;
    this._updateLoopWarned = false;
  }

  scheduleUpdateLoopGuardReset() {
    if (this._updateLoopResetScheduled) {
      return;
    }

    this._updateLoopResetScheduled = true;
    setTimeout(() => {
      this.resetUpdateLoopGuard();
    }, 0);
  }

  canScheduleComponentUpdate(reason = "unknown") {
    if (this._updateLoopBlocked) {
      return false;
    }

    const limit = this.updateLoopLimit;

    if (limit <= 0) {
      return true;
    }

    this.scheduleUpdateLoopGuardReset();
    this._updateLoopCount += 1;

    if (this._updateLoopCount <= limit) {
      return true;
    }

    this._updateLoopBlocked = true;

    this._changedAttributes.clear();

    if (!this._updateLoopWarned) {
      this._updateLoopWarned = true;
      console.warn(`${this.componentTagName || "sf-element"}: update loop limit reached`, {
        reason,
        limit,
        component: this
      });
    }

    return false;
  }

  requestComponentUpdate(reason = "unknown") {
    if (this._updateLoopBlocked) {
      return;
    }

    if (reason) {
      this._changedAttributes.add(reason);
    }

    if (this._updateScheduled) {
      return;
    }

    if (!this.canScheduleComponentUpdate(reason)) {
      return;
    }

    this._updateScheduled = true;
    Promise.resolve().then(() => {
      this._updateScheduled = false;

      if (!this._isMounted) {
        return;
      }

      const changedAttributes = Array.from(this._changedAttributes);

      this._changedAttributes.clear();

      void this.performComponentUpdate(changedAttributes);
    });
  }

  async performComponentUpdate(changedAttributes = []) {
    const mode = this.hasBuiltInTemplate(this.componentTemplateName) && !this._externalTemplateModule ? this.resolveUpdateMode(changedAttributes) : "lit";

    if (mode === "dom" && this.updateDom(changedAttributes) !== false) {
      this.afterUpdate(changedAttributes, mode);
      this.emitComponentEvent("updated", {
        changedAttributes,
        updateMode: mode
      });
      this.emitComponentEvent("props-change", this.createPropChangeDetail(changedAttributes, mode));
      return;
    }

    await this.renderComponent(changedAttributes);
    this.afterUpdate(changedAttributes, "lit");
    this.emitComponentEvent("updated", {
      changedAttributes,
      updateMode: "lit"
    });
    this.emitComponentEvent("props-change", this.createPropChangeDetail(changedAttributes, "lit"));
  }

  async renderComponent(changedAttributes = []) {
    const renderToken = ++this._renderToken;

    if (!this._isMounted) {
      return;
    }

    this._activeRefEffects = new Set();
    this.beforeRender(changedAttributes);
    this.emitComponentEvent("before-render", {
      changedAttributes
    });
    this.runExternalHook("beforeRender", {
      changedAttributes,
      root: this
    });
    const templateResult = await this.resolveTemplateResult(changedAttributes);

    if (!this._isMounted || renderToken !== this._renderToken) {
      return;
    }

    this.prepareRenderContainer(changedAttributes);
    this.markStylePending(this);
    (0,lit__WEBPACK_IMPORTED_MODULE_1__.render)(templateResult, this);
    this.flushRefEffects();
    await this.whenRenderedStylesReady(this);

    if (!this._isMounted || renderToken !== this._renderToken) {
      return;
    }

    this._hasRendered = true;
    this.afterRender(changedAttributes);
    this._childrenDefinedPromise = null;
    this.runExternalHook("afterRender", {
      changedAttributes,
      root: this
    });
    this.emitComponentEvent("after-render", {
      changedAttributes
    });
  }

  shouldWaitForStylesReady() {
    return this.constructor.waitForStylesBeforeRenderReady !== false;
  }

  markStylePending(target = this) {
    if (this.shouldWaitForStylesReady() && !this._styleReady && target?.setAttribute) {
      target.setAttribute("data-sf-style-pending", "");
      target.removeAttribute("data-sf-style-ready");
    }

    return this;
  }

  markStyleReady(target = this) {
    this._styleReady = true;
    [target, this].forEach(element => {
      if (element?.removeAttribute && element?.setAttribute) {
        element.removeAttribute("data-sf-style-pending");
        element.setAttribute("data-sf-style-ready", "");
      }
    });
    return this;
  }

  async whenRenderedStylesReady(target = this) {
    if (!this.shouldWaitForStylesReady()) {
      return;
    }

    const loader = window.SF?.Loader;

    if (!loader || typeof loader.ensureStylesReady !== "function") {
      this.markStyleReady(target);
      return;
    }

    const readiness = Promise.resolve().then(() => loader.ensureStylesReady(target || this, {
      autoLoad: true
    }));
    const timeout = Number(this.constructor.styleReadyTimeout ?? 3000);
    this._styleReadyPromise = timeout > 0 ? Promise.race([readiness, new Promise(resolve => {
      setTimeout(resolve, timeout);
    })]) : readiness;
    await this._styleReadyPromise.catch(error => {
      console.warn(`${this.componentTagName || "sf-element"}: style readiness failed`, error);
    });
    this.markStyleReady(target);
  }

  getChildCustomElements() {
    return Array.from(this.querySelectorAll("*")).filter(node => {
      const tagName = node?.tagName?.toLowerCase?.() || "";
      return tagName.startsWith("sf-");
    });
  }

  async whenChildrenDefined() {
    if (this._childrenDefinedPromise) {
      return this._childrenDefinedPromise;
    }

    this._childrenDefinedPromise = Promise.resolve().then(async () => {
      const children = this.getChildCustomElements();
      await Promise.all(children.map(async child => {
        const tagName = child.tagName?.toLowerCase?.();

        if (!tagName || !window.customElements?.whenDefined) {
          return;
        }

        await window.customElements.whenDefined(tagName);

        if (child.updateComplete?.then) {
          await child.updateComplete;
        }

        if (child._updateScheduled) {
          await Promise.resolve();
        }
      }));
      return children;
    });
    return this._childrenDefinedPromise;
  }

  get componentTagName() {
    return this.tagName?.toLowerCase?.() || "";
  }

  get componentTemplateName() {
    return this.getAttribute("template") || "default";
  }

  get externalTemplateComponentName() {
    return this.componentTagName.startsWith("sf-") ? this.componentTagName.replace(/^sf-/, "") : this.componentTagName;
  }

  get externalTemplateBasePath() {
    return window.SF_SMART_TEMPLATE_PATH || window.SFSmartTemplatePath || this.constructor.externalTemplateBasePath;
  }

  emitComponentEvent(name, detail = {}) {
    const eventDetail = {
      component: this,
      tagName: this.componentTagName,
      template: this.componentTemplateName,
      ...detail
    };
    this.dispatchEvent(new CustomEvent(`sf-${name}`, {
      bubbles: true,
      composed: true,
      detail: eventDetail
    }));
  }

  attributeName(key) {
    return String(key || "").replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
  }

  shouldSerializeFalseAttribute(attr) {
    const attributes = this.constructor.defaultTrueAttributes;

    if (!attributes) {
      return false;
    }

    if (attributes instanceof Set) {
      return attributes.has(attr);
    }

    if (Array.isArray(attributes)) {
      return attributes.includes(attr);
    }

    return false;
  }

  setAttributes(nextAttributes = {}) {
    if (!nextAttributes || typeof nextAttributes !== "object") {
      return this;
    }

    Object.entries(nextAttributes).forEach(([key, value]) => {
      const attr = this.attributeName(key);

      if (!attr) {
        return;
      }

      this.setCustomTemplateProp(key, value);

      if (value === false && this.shouldSerializeFalseAttribute(attr)) {
        this.setAttribute(attr, "false");
        return;
      }

      if (value === false || value === null || value === undefined || value === "") {
        this.removeAttribute(attr);
        return;
      }

      if (value === true) {
        this.setAttribute(attr, "");
        return;
      }

      this.setAttribute(attr, String(value));
    });
    return this;
  }

  forwardHostAttributes(target, options = {}) {
    if (!target) {
      return this;
    }

    const {
      exclude = [],
      transferDataAttributes = true,
      storageKey = "__sfForwardedDataAttributes",
      targetStorageKey = "__sfForwardedAttributeKeys"
    } = options;
    const excludeSet = exclude instanceof Set ? exclude : new Set(exclude);
    const dataAttributes = this[storageKey] || new Map();
    const previous = target[targetStorageKey] || new Set();
    const dataAttributeNamesToRemove = [];
    const nextKeys = new Set();
    previous.forEach(name => {
      target.removeAttribute(name);
    });
    Array.from(this.attributes).forEach(attribute => {
      const {
        name,
        value
      } = attribute;

      if (excludeSet.has(name)) {
        return;
      }

      if (/^on[a-z]/i.test(name)) {
        return;
      }

      if (transferDataAttributes && name.startsWith("data-")) {
        dataAttributes.set(name, value);
        dataAttributeNamesToRemove.push(name);
        return;
      }

      nextKeys.add(name);
      target.setAttribute(name, value);
    });
    dataAttributes.forEach((value, name) => {
      nextKeys.add(name);
      target.setAttribute(name, value);
    });
    target[targetStorageKey] = nextKeys;
    this[storageKey] = dataAttributes;

    if (dataAttributeNamesToRemove.length) {
      this.__sfForwardingHostAttributes = true;
      dataAttributeNamesToRemove.forEach(name => this.removeAttribute(name));
      this.__sfForwardingHostAttributes = false;
    }

    return this;
  }

  observeForwardedHostAttributes(targetGetter, options = {}) {
    if (this._forwardHostAttributeObserver) {
      return this;
    }

    const resolveTarget = typeof targetGetter === "function" ? targetGetter : () => targetGetter;
    this._forwardHostAttributeObserver = new MutationObserver(() => {
      if (this.__sfForwardingHostAttributes) {
        return;
      }

      this.forwardHostAttributes(resolveTarget(), options);
    });

    this._forwardHostAttributeObserver.observe(this, {
      attributes: true
    });

    return this;
  }

  disconnectForwardedHostAttributes() {
    this._forwardHostAttributeObserver?.disconnect?.();
    this._forwardHostAttributeObserver = null;
    return this;
  }

  removeAttributes(attributeNames = []) {
    const names = Array.isArray(attributeNames) ? attributeNames : [attributeNames];
    names.filter(Boolean).forEach(name => this.removeAttribute(this.attributeName(name)));
    return this;
  }

  refresh(reason = "manual") {
    this.requestComponentUpdate(reason);
    return this;
  }

  get isRendered() {
    return this._hasRendered === true;
  }

  createRenderDetail(detail = {}) {
    return {
      component: this,
      tagName: this.componentTagName,
      template: this.componentTemplateName,
      ...detail
    };
  }

  runRenderedCallback(callback, detail = {}, event = null) {
    if (typeof callback !== "function") {
      return undefined;
    }

    return callback.call(this, this.createRenderDetail(detail), event);
  }

  whenRendered(callback = null, options = {}) {
    const waitNext = options.next === true;

    if (this.isRendered && !waitNext) {
      const detail = this.createRenderDetail({
        changedAttributes: [],
        immediate: true
      });
      return Promise.resolve().then(() => {
        this.runRenderedCallback(callback, detail);
        return detail;
      });
    }

    return new Promise(resolve => {
      const onAfterRender = event => {
        const detail = event?.detail || this.createRenderDetail();
        this.runRenderedCallback(callback, detail, event);
        resolve(detail);
      };

      this.addEventListener("sf-after-render", onAfterRender, {
        once: true
      });
    });
  }

  onAfterRender(callback, options = {}) {
    const immediate = options.immediate !== false;
    const once = options.once !== false;

    if (immediate && this.isRendered) {
      this.runRenderedCallback(callback, {
        changedAttributes: [],
        immediate: true
      });

      if (once) {
        return () => {};
      }
    }

    const onAfterRender = event => {
      this.runRenderedCallback(callback, event?.detail || {}, event);

      if (once) {
        this.removeEventListener("sf-after-render", onAfterRender);
      }
    };

    this.addEventListener("sf-after-render", onAfterRender);
    return () => this.removeEventListener("sf-after-render", onAfterRender);
  }

  getState() {
    if (typeof this.state !== "undefined") {
      return this.state;
    }

    if (this.hasDeclaredProps()) {
      return this.templateContext();
    }

    if (typeof this.value !== "undefined") {
      return this.value;
    }

    return this.templateContext();
  }

  normalizeStateCallbackArgs(reasonOrCallback, callback, fallbackReason = "state") {
    if (typeof reasonOrCallback === "function") {
      return {
        reason: fallbackReason,
        callback: reasonOrCallback
      };
    }

    return {
      reason: reasonOrCallback || fallbackReason,
      callback
    };
  }

  runStateCallback(callback, detail = {}) {
    if (typeof callback !== "function") {
      return this;
    }

    callback.call(this, {
      component: this,
      state: this.getState(),
      ...detail
    });
    return this;
  }

  scheduleStateCallback(callback, detail = {}) {
    if (typeof callback !== "function") {
      return this;
    }

    if (this._isMounted && this._updateScheduled) {
      this.whenRendered(renderDetail => {
        this.runStateCallback(callback, { ...detail,
          renderDetail
        });
      }, {
        next: true
      });
      return this;
    }

    Promise.resolve().then(() => {
      this.runStateCallback(callback, detail);
    });
    return this;
  }

  setState(nextState = {}, callback = null) {
    this.setAttributes(nextState);
    this.scheduleStateCallback(callback, {
      patch: nextState,
      reason: "attributes"
    });
    return this;
  }

  patchState(nextState = {}, reasonOrCallback = "state", callback = null) {
    const {
      reason,
      callback: stateCallback
    } = this.normalizeStateCallbackArgs(reasonOrCallback, callback, "state");
    const prevState = this.state && typeof this.state === "object" ? this.state : {};
    const patch = typeof nextState === "function" ? nextState(prevState) : nextState;

    if (!patch || typeof patch !== "object" || Object.is(patch, prevState)) {
      this.scheduleStateCallback(stateCallback, {
        patch,
        reason,
        changed: false,
        changedKeys: [],
        prevState,
        nextState: prevState
      });
      return this;
    }

    let changed = false;
    const changedKeys = [];
    const state = { ...prevState
    };
    Object.entries(patch).forEach(([key, value]) => {
      if (Object.is(state[key], value)) {
        return;
      }

      state[key] = value;
      changed = true;
      changedKeys.push(key);
    });

    if (!changed) {
      this.scheduleStateCallback(stateCallback, {
        patch,
        reason,
        changed: false,
        changedKeys,
        prevState,
        nextState: prevState
      });
      return this;
    }

    this.state = state;
    this.requestComponentUpdate(reason);
    this.scheduleStateCallback(stateCallback, {
      patch,
      reason,
      changed: true,
      changedKeys,
      prevState,
      nextState: state
    });
    return this;
  }

  set(nextState = {}, reasonOrCallback = "state", callback = null) {
    return this.patchState(nextState, reasonOrCallback, callback);
  }

  getRootClass() {
    return this.getAttribute("root-class") || "";
  }

  normalizeHostStyle(style = "") {
    const element = document.createElement("div");
    element.setAttribute("style", String(style || ""));
    element.style.removeProperty("display");
    return element.style.cssText;
  } // The host is deliberately boxless; author styles belong to the template
  // root. Keep a real, stable CSSStyleDeclaration for CSSOM edits rather than
  // exposing the internal display-only declaration and losing prior edits.


  get style() {
    if (!this._authorStyleElement) {
      this._authorStyleElement = document.createElement("div");
      this._hostStyle = this.normalizeHostStyle(this.getAttribute("style")) || this._hostStyle;
      this.syncAuthorStyle();
      this._authorStyleObserver = new MutationObserver(() => this.flushAuthorStyle());

      this._authorStyleObserver.observe(this._authorStyleElement, {
        attributes: true,
        attributeFilter: ["style"]
      });
    }

    return this._authorStyleElement.style;
  }

  set style(value) {
    this.style.cssText = value == null ? "" : String(value);
  }

  syncAuthorStyle() {
    if (!this._authorStyleElement) return;
    const next = `${this._hostStyle} display: contents;`.trim();

    if (this._authorStyleElement.style.cssText !== next) {
      this._authorStyleElement.style.cssText = next;
    }
  }

  flushAuthorStyle() {
    if (!this._authorStyleElement) return;
    const next = this.normalizeHostStyle(this._authorStyleElement.style.cssText);

    if (next !== this._hostStyle) {
      // Reuse the existing attribute -> render path. Attribute replacement and
      // removal supersede pending CSSOM edits just as they do for native style.
      this.setAttribute("style", next);
    } else if (this._authorStyleElement.style.display !== "contents") {
      this.syncAuthorStyle();
    }
  }

  captureHostStyle() {
    this.flushAuthorStyle();
    const normalized = this.normalizeHostStyle(this.getAttribute("style"));

    if (normalized || !this._hostStyle) {
      this._hostStyle = normalized;
    }

    this.syncAuthorStyle();
    return this;
  }

  applyHostDisplayStyle() {
    const nextStyle = "display: contents;";

    if (this.getAttribute("style") === nextStyle) {
      return this;
    }

    this._syncingHostStyle = true;
    this.setAttribute("style", nextStyle);
    this._syncingHostStyle = false;
    return this;
  }

  getRootStyle() {
    this.flushAuthorStyle();
    return [this._hostStyle, this.getAttribute("root-style")].filter(Boolean).join("; ");
  }

  setRootClass(nextValue = "") {
    const value = String(nextValue || "").trim();

    if (!value) {
      this.removeAttribute("root-class");
      return this;
    }

    this.setAttribute("root-class", value);
    return this;
  }

  addRootClass(...tokens) {
    const classes = new Set(this.getRootClass().split(/\s+/).filter(Boolean));
    tokens.flat().filter(Boolean).forEach(token => {
      String(token).split(/\s+/).filter(Boolean).forEach(part => classes.add(part));
    });
    return this.setRootClass(Array.from(classes).join(" "));
  }

  setRootStyle(nextValue = "") {
    const value = String(nextValue || "").trim();

    if (!value) {
      this.removeAttribute("root-style");
      return this;
    }

    this.setAttribute("root-style", value);
    return this;
  }

  removeRootClass(...tokens) {
    const classes = new Set(this.getRootClass().split(/\s+/).filter(Boolean));
    tokens.flat().filter(Boolean).forEach(token => {
      String(token).split(/\s+/).filter(Boolean).forEach(part => classes.delete(part));
    });
    return this.setRootClass(Array.from(classes).join(" "));
  }

  toggleRootClass(token, force) {
    const normalized = String(token || "").trim();

    if (!normalized) {
      return this;
    }

    const classes = new Set(this.getRootClass().split(/\s+/).filter(Boolean));
    const shouldAdd = typeof force === "boolean" ? force : !classes.has(normalized);

    if (shouldAdd) {
      classes.add(normalized);
    } else {
      classes.delete(normalized);
    }

    this.setRootClass(Array.from(classes).join(" "));
    return this;
  }

  setHidden(hidden = true) {
    const next = toBoolean(hidden, true);
    this.toggleAttribute("hidden", next);
    this.toggleRootClass("hidden", next);
    return this;
  }

  isHidden() {
    const rootClasses = new Set(this.getRootClass().split(/\s+/).filter(Boolean));
    return this.hasAttribute("hidden") || rootClasses.has("hidden");
  }

  createPropChangeDetail(changedAttributes = [], updateMode = "lit") {
    return {
      changedAttributes,
      updateMode,
      state: this.getState()
    };
  }

  onPropChange(handler, options) {
    if (typeof handler === "function") {
      this.addEventListener("sf-props-change", event => {
        handler(event.detail?.state, event.detail, event);
      }, options);
    }

    return this;
  }

  onUpdate(handler, options) {
    if (typeof handler === "function") {
      this.addEventListener("sf-updated", event => {
        handler(this.getState(), event.detail, event);
      }, options);
    }

    return this;
  }

  createTemplateContext(baseContext = {}) {
    const propsContext = this.hasDeclaredProps() ? this.getPropsContext() : {};
    const normalizedContext = {
      component: this,
      rootClass: this.getRootClass(),
      rootStyle: this.getRootStyle(),
      ...propsContext,
      ...baseContext
    };
    const custom = this.getCustomTemplateProps(normalizedContext);
    return { ...custom,
      ...normalizedContext,
      custom
    };
  }

  getCustomTemplateProps(baseContext = {}) {
    const reservedAttributes = this.getReservedTemplateAttributes();
    const reservedKeys = this.getReservedTemplateKeys(baseContext);
    const props = {};

    this._customTemplateProps.forEach((value, key) => {
      if (!this.isCustomTemplateProp(key, baseContext)) {
        return;
      }

      props[key] = value;
    });

    Object.entries(this.getOwnCustomTemplateProps(baseContext)).forEach(([key, value]) => {
      if (!key || reservedKeys.has(key) || Object.prototype.hasOwnProperty.call(props, key)) {
        return;
      }

      props[key] = value;
    });
    Array.from(this.attributes || []).forEach(({
      name,
      value
    }) => {
      if (reservedAttributes.has(name)) {
        return;
      }

      const key = this.attributeToPropertyName(name);

      if (!key || reservedKeys.has(key) || Object.prototype.hasOwnProperty.call(props, key)) {
        return;
      }

      props[key] = value;
    });
    return props;
  }

  getOwnCustomTemplateProps(baseContext = {}) {
    const props = {};
    const reservedKeys = this.getReservedTemplateKeys(baseContext);
    Object.keys(this).forEach(key => {
      if (key.startsWith("_") || reservedKeys.has(key) || typeof this[key] === "function") {
        return;
      }

      props[key] = this[key];
    });
    return props;
  }

  getReservedTemplateAttributes() {
    const reservedAttributes = new Set(["class", "style", "id", "slot", "template"]);
    const observedAttributes = this.constructor.observedAttributes || [];
    observedAttributes.forEach(name => {
      const attr = toAttributeName(name);

      if (attr) {
        reservedAttributes.add(attr);
      }
    });
    return reservedAttributes;
  }

  getReservedTemplateKeys(baseContext = {}) {
    const reservedKeys = new Set(["custom"]);
    Object.keys(baseContext || {}).forEach(key => {
      reservedKeys.add(key);
    });
    this.getReservedTemplateAttributes().forEach(attr => {
      const key = this.attributeToPropertyName(attr);

      if (key) {
        reservedKeys.add(key);
      }
    });
    return reservedKeys;
  }

  isCustomTemplateProp(key, baseContext = {}) {
    const prop = this.attributeToPropertyName(toAttributeName(key));

    if (!prop) {
      return false;
    }

    const attr = toAttributeName(prop);
    const reservedAttributes = this.getReservedTemplateAttributes();
    const reservedKeys = this.getReservedTemplateKeys(baseContext);
    return !reservedAttributes.has(attr) && !reservedKeys.has(prop);
  }

  setCustomTemplateProps(nextProps = {}, baseContext = {}) {
    if (!nextProps || typeof nextProps !== "object") {
      return this;
    }

    Object.entries(nextProps).forEach(([key, value]) => {
      this.setCustomTemplateProp(key, value, baseContext);
    });
    return this;
  }

  setCustomTemplateProp(key, value, baseContext = {}) {
    const prop = this.attributeToPropertyName(toAttributeName(key));

    if (!this.isCustomTemplateProp(prop, baseContext)) {
      return this;
    }

    if (value === false || value === null || typeof value === "undefined") {
      if (this._customTemplateProps.delete(prop)) {
        this.requestComponentUpdate(prop);
      }

      return this;
    }

    if (this._customTemplateProps.get(prop) === value) {
      return this;
    }

    this._customTemplateProps.set(prop, value);

    this.requestComponentUpdate(prop);
    return this;
  }

  attributeToPropertyName(name) {
    return String(name || "").replace(/-([a-z0-9])/g, (_, symbol) => symbol.toUpperCase());
  }

  resolveUpdateMode() {
    return "lit";
  }

  createPropsTemplateContext(extraContext = {}) {
    return this.createTemplateContext({
      component: this,
      ...this.getPropsContext(),
      ...extraContext
    });
  }

  templateContext() {
    return this.createPropsTemplateContext();
  }

  captureSlotTemplates() {
    if (this._slotTemplatesCaptured) {
      return;
    }

    this._slotTemplatesCaptured = true;
    Array.from(this.children).forEach(child => {
      if (!(child instanceof HTMLElement)) {
        return;
      }

      const slotName = child.getAttribute("slot");

      if (!slotName) {
        return;
      }

      if (child.tagName?.toLowerCase?.() === "template") {
        if (!this._slotTemplates.has(slotName)) {
          this._slotTemplates.set(slotName, []);
        }

        Array.from(child.content?.childNodes || []).forEach(node => {
          this._slotTemplates.get(slotName).push(node.cloneNode(true));
        });
        child.remove();
        return;
      }

      if (!this._liveSlotNodes.has(slotName)) {
        this._liveSlotNodes.set(slotName, []);
      }

      const shouldUnwrapSlotHost = child.getAttributeNames().length === 1 && child.hasAttribute("slot");
      const slotNodes = shouldUnwrapSlotHost ? Array.from(child.childNodes) : [child];

      this._liveSlotNodes.get(slotName).push(...slotNodes);

      child.remove();
    });
  }

  captureChildTemplates(name, matcher, options = {}) {
    if (!name) {
      return [];
    }

    const {
      append = true,
      remove = true
    } = options;
    const matches = typeof matcher === "function" ? matcher : node => node instanceof Element && typeof matcher === "string" && node.matches?.(matcher);
    const nodes = Array.from(this.childNodes || []).filter(child => matches(child));

    if (!nodes.length) {
      return [];
    }

    if (!append || !this._slotTemplates.has(name)) {
      this._slotTemplates.set(name, []);
    }

    const templates = nodes.map(node => node.cloneNode(true));
    templates.forEach(node => {
      this._slotTemplates.get(name).push(node);
    });

    if (remove) {
      nodes.forEach(node => node.remove());
    }

    return templates.map(node => node.cloneNode(true));
  }

  hasSlotContent(name) {
    if ((this._liveSlotNodes.get(name) || []).length > 0) {
      return true;
    }

    return (this._slotTemplates.get(name) || []).length > 0;
  }

  getSlotContent(name) {
    const liveSlotContent = this._liveSlotNodes.get(name) || [];

    if (liveSlotContent.length) {
      return liveSlotContent.length === 1 ? liveSlotContent[0] : liveSlotContent;
    }

    const slotContent = this._slotTemplates.get(name) || [];

    if (!slotContent.length) {
      return lit__WEBPACK_IMPORTED_MODULE_1__.nothing;
    }

    if (slotContent.length === 1) {
      return slotContent[0].cloneNode(true);
    }

    return slotContent.map(node => node.cloneNode(true));
  }

  setSlot(name, ...elements) {
    if (!name) {
      return this;
    } // Преобразуем строки в DOM-элементы


    const parsed = elements.map(el => {
      if (typeof el === "string") {
        const wrapper = document.createElement("div");
        wrapper.innerHTML = el;
        return Array.from(wrapper.childNodes);
      }

      return [el];
    }).flat().filter(node => node instanceof Node); // Обновляем _slotTemplates (Lit-рендеринг)

    this._slotTemplates.delete(name); // Обновляем _liveSlotNodes (если есть — для совместимости с sf-modal)


    this._liveSlotNodes.set(name, parsed); // Запрашиваем перерендер


    this.requestComponentUpdate("slot-change");
    return this;
  }

  copyRuntimeData(source, target) {
    if (!(source instanceof Node) || !(target instanceof Node)) {
      return;
    }

    if (source.__sfCreateEventHandlers) {
      Object.defineProperty(target, "__sfCreateEventHandlers", {
        configurable: true,
        enumerable: false,
        value: source.__sfCreateEventHandlers.slice()
      });
    }

    const sourceChildren = Array.from(source.childNodes || []);
    const targetChildren = Array.from(target.childNodes || []);
    sourceChildren.forEach((sourceChild, index) => {
      this.copyRuntimeData(sourceChild, targetChildren[index]);
    });
  }

  clearSlot(name) {
    if (!name) {
      return this;
    }

    this._slotTemplates.delete(name);

    if (this._liveSlotNodes) {
      this._liveSlotNodes.delete(name);
    }

    this.requestComponentUpdate("slot-change");
    return this;
  }

  async resolveTemplateResult(changedAttributes = []) {
    const templateName = this.componentTemplateName;
    const renderToken = this._renderToken;

    if (this.hasBuiltInTemplate(templateName)) {
      this._releaseExternalTemplate();

      return this.template();
    }

    const externalModule = await this.resolveExternalTemplateModule(templateName);

    if (!this._isMounted || renderToken !== this._renderToken || templateName !== this.componentTemplateName) {
      return lit__WEBPACK_IMPORTED_MODULE_1__.nothing;
    }

    if (externalModule !== this._externalTemplateModule) {
      this._releaseExternalTemplate();
    }

    this._externalTemplateModule = externalModule || null;

    if (externalModule) {
      const rawContext = this.templateContext();
      const context = this.createTemplateContext(this.mapExternalTemplateContext(rawContext, externalModule));
      const renderFn = typeof externalModule.default === "function" ? externalModule.default : null;

      if (renderFn) {
        return renderFn({
          html: lit__WEBPACK_IMPORTED_MODULE_1__.html,
          nothing: lit__WEBPACK_IMPORTED_MODULE_1__.nothing,
          context,
          component: this,
          changedAttributes
        });
      }
    }

    this._externalTemplateModule = null;
    return this.template();
  }

  hasBuiltInTemplate(templateName = this.componentTemplateName) {
    return !templateName || templateName === "default";
  }

  mapExternalTemplateContext(context, externalModule) {
    if (typeof externalModule?.mapContext === "function") {
      return externalModule.mapContext({
        context,
        component: this,
        html: lit__WEBPACK_IMPORTED_MODULE_1__.html,
        nothing: lit__WEBPACK_IMPORTED_MODULE_1__.nothing
      }) || context;
    }

    return context;
  }

  async resolveExternalTemplateModule(templateName = this.componentTemplateName) {
    if (!templateName) {
      return null;
    }

    const moduleUrl = this.getExternalTemplateModuleUrl(templateName);

    if (!moduleUrl) {
      return null;
    }

    await this.loadExternalTemplateCss(templateName);

    if (this.constructor.externalTemplateModules.has(moduleUrl)) {
      return this.constructor.externalTemplateModules.get(moduleUrl);
    }

    if (this.constructor.externalTemplateMisses.has(moduleUrl)) {
      return null;
    }

    const exists = await this.checkExternalTemplateModule(moduleUrl);

    if (!exists) {
      this.constructor.externalTemplateMisses.add(moduleUrl);
      return null;
    }

    try {
      const externalModule = await import(
      /* webpackIgnore: true */
      moduleUrl);
      this.constructor.externalTemplateModules.set(moduleUrl, externalModule);
      return externalModule;
    } catch (error) {
      console.warn(error);
      this.constructor.externalTemplateMisses.add(moduleUrl);
      return null;
    }
  }

  async checkExternalTemplateModule(moduleUrl) {
    if (!moduleUrl) {
      return false;
    }

    if (this.constructor.externalTemplateChecks.has(moduleUrl)) {
      return this.constructor.externalTemplateChecks.get(moduleUrl);
    }

    const checkPromise = fetch(moduleUrl, {
      method: "GET",
      cache: "no-store"
    }).then(response => response.ok).catch(() => false);
    this.constructor.externalTemplateChecks.set(moduleUrl, checkPromise);
    const exists = await checkPromise;

    if (!exists) {
      this.constructor.externalTemplateChecks.delete(moduleUrl);
    }

    return exists;
  }

  getExternalTemplateModuleUrl(templateName = this.componentTemplateName) {
    const basePath = String(this.externalTemplateBasePath || "").replace(/\/$/, "");
    const componentName = this.externalTemplateComponentName;

    if (!basePath || !componentName || !templateName) {
      return "";
    }

    return `${basePath}/${componentName}/${templateName}/index.js`;
  }

  getExternalTemplateCssUrl(templateName = this.componentTemplateName) {
    const basePath = String(this.externalTemplateBasePath || "").replace(/\/$/, "");
    const componentName = this.externalTemplateComponentName;

    if (!basePath || !componentName || !templateName) {
      return "";
    }

    return `${basePath}/${componentName}/${templateName}/index.css`;
  }

  loadExternalTemplateCss(templateName = this.componentTemplateName) {
    const cssUrl = this.getExternalTemplateCssUrl(templateName);

    if (!cssUrl) {
      return Promise.resolve(false);
    }

    if (this.constructor.externalTemplateCssLoaded.has(cssUrl)) {
      return Promise.resolve(true);
    }

    if (this.constructor.externalTemplateCssMisses.has(cssUrl)) {
      return Promise.resolve(false);
    }

    const existing = document.querySelector(`link[data-sf-smart-css="${cssUrl}"]`);

    if (existing) {
      this.constructor.externalTemplateCssLoaded.add(cssUrl);
      return Promise.resolve(true);
    }

    return new Promise(resolve => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = cssUrl;
      link.dataset.sfSmartCss = cssUrl;

      link.onload = () => {
        this.constructor.externalTemplateCssLoaded.add(cssUrl);
        resolve(true);
      };

      link.onerror = () => {
        this.constructor.externalTemplateCssMisses.add(cssUrl);
        resolve(false);
      };

      document.head.append(link);
    });
  }

  _releaseExternalTemplate() {
    const externalModule = this._externalTemplateModule;
    if (!externalModule) return;
    this._externalTemplateModule = null;
    this.runExternalHook("destroy", {}, externalModule);
  }

  runExternalHook(hookName, detail = {}, externalModule = this._externalTemplateModule) {
    if (typeof externalModule?.[hookName] !== "function") {
      return;
    }

    try {
      externalModule[hookName]({
        component: this,
        root: this,
        html: lit__WEBPACK_IMPORTED_MODULE_1__.html,
        nothing: lit__WEBPACK_IMPORTED_MODULE_1__.nothing,
        context: this.templateContext(),
        ...detail
      });
    } catch (error) {
      console.warn(error);
    }
  }

  updateDom() {
    return false;
  }

  shouldClearLightDomBeforeFirstRender() {
    return this.constructor.clearLightDomBeforeFirstRender === true;
  }

  prepareRenderContainer() {
    if (this._hasRendered || !this.shouldClearLightDomBeforeFirstRender()) {
      return;
    }

    this.replaceChildren();
  }

  template() {
    return lit__WEBPACK_IMPORTED_MODULE_1__.nothing;
  }

  beforeRender() {}

  afterRender(callback) {
    if (typeof callback === "function") {
      return this.whenRendered(callback);
    }

    return undefined;
  }

  afterUpdate() {}

  onConnected() {}

  onDisconnected() {
    this._releaseExternalTemplate();
  }

}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SfBaseElement); // Global access for Playground, console, and project-level components.

if (typeof window !== "undefined") {
  window.SfBaseElement = SfBaseElement;
  window.html = lit__WEBPACK_IMPORTED_MODULE_1__.html;
  window.nothing = lit__WEBPACK_IMPORTED_MODULE_1__.nothing;
  window.render = lit__WEBPACK_IMPORTED_MODULE_1__.render;

  if (!window.SF) {
    window.SF = {};
  }

  window.SF.SfBaseElement = SfBaseElement;
  window.SF.html = lit__WEBPACK_IMPORTED_MODULE_1__.html;
  window.SF.nothing = lit__WEBPACK_IMPORTED_MODULE_1__.nothing;
  window.SF.render = lit__WEBPACK_IMPORTED_MODULE_1__.render;
  window.SF.smart = { ...(window.SF.smart || {}),
    SfBaseElement,
    html: lit__WEBPACK_IMPORTED_MODULE_1__.html,
    nothing: lit__WEBPACK_IMPORTED_MODULE_1__.nothing,
    render: lit__WEBPACK_IMPORTED_MODULE_1__.render,
    toBoolean,
    toAttributeName,
    toNumber,
    normalizeEnum,
    parseJsonAttribute
  };
}

/***/ },

/***/ "e5483002f3ea"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FILTER_RENDERERS: () => (/* binding */ FILTER_RENDERERS),
/* harmony export */   renderCellField: () => (/* binding */ renderCellField),
/* harmony export */   renderEditField: () => (/* binding */ renderEditField),
/* harmony export */   renderFilterField: () => (/* binding */ renderFilterField),
/* harmony export */   renderViewField: () => (/* binding */ renderViewField)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("fef8077ac919");
/* harmony import */ var _table_js_option_badge_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("aaa5e760767f");
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("8489d1f5bab4");


 // The Framework's field renderers, addressed by a property type and a template
// rather than by a control name.
//
// Larena asked for one set of renderers shared by the record view and the
// table's cells (their request of 2026-10-05, part B6). The Framework already
// had type-aware rendering in exactly one place -- the table's filter controls
// -- and a second map would have drifted from it, so this module is that map
// with the filter controls moved into it unchanged. The table now asks the set
// instead of answering itself.
//
// The renderers take a host rather than `this`: a small interface the caller
// implements, so the same function serves a table's filter window, a record
// view and anything else that renders a field.
//
//   getFilterControlValue(key)            the value a control shows
//   patchTempFilterValue(key, patch)      the value a control writes
//   getFilterOperatorLabel(operator)      the word for an operator
//   getFilterOptionSearch(key)            what is typed in an option search
//   patchTempFilterOptionSearch(key, s)   what that search writes
//   getVisibleFilterOptions(field)        the options to draw
//   renderFilterOption(field, option)     one option row
//   getEndpointFilterPage(field)          the page of options a host returned
//   loadEndpointFilterPage(field, cursor, search)   ask the host for a page
//
// Every prop below names the axis it answers -- appearance, status, kind -- and
// never `type`, which contracts/public-api-axes.json retires. The names were
// read from each component's description rather than from the property's name:
// `size` on sf-file-preview is the file's size as text, not a rung of the
// ladder, and `type` on sf-list-item answers `kind` while on sf-input it
// answers `appearance`.

function renderTextFilterControl(field, host) {
  const value = host.getFilterControlValue(field.key);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-input
                size="1"
                appearance="filled"
                placeholder="${setText(host, 'searchInList')}"
                value="${value.value || ''}"
                name="sf_filter_${field.key || 'text'}"
                @change=${event => {
    host.patchTempFilterValue(field.key, {
      value: event.target?.value || '',
      operator: value.operator || field.filter?.defaultOperator || 'contains'
    });
  }}
        ></sf-input>
    `;
}

function renderRangeFilterControl(field, host) {
  const control = host.getFilterControlValue(field.key);
  const operators = field.filter?.operators || ['eq'];
  const selectedOperator = control.operator || field.filter?.defaultOperator || operators[0];
  const isBetween = selectedOperator === 'between';
  const rangeValue = isBetween ? control.value : Array.isArray(control.value) ? control.value[0] : control.value;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="flex gap-1/3 flex-col">
            <div class="sf-filter-operator-range flex gap-1/3 items-cross-center">
                <sf-range-slider
                        id="smart-range-slider-single"
                        min="0"
                        label="tooltip"
                        suffix="%"
                        max="100"
                        multiple=${String(isBetween)}
                        .value=${rangeValue}
                        @onSliderEnd=${e => {
    host.patchTempFilterValue(field.key, {
      value: isBetween ? e.detail.values || [] : e.detail.value,
      operator: selectedOperator
    });
  }}
                ></sf-range-slider>
            </div>
            <sf-dropdown
                    size="1"
                    appearance="outlined"
                    mode="select"
                    placeholder="${setText(host, 'operator')}"
                    root-class="flex-1"
                    search="false"
                    @change=${event => {
    const operator = event.detail?.values?.[0] || event.detail?.value || selectedOperator;
    host.patchTempFilterValue(field.key, {
      operator
    });
  }}
            >
                ${operators.map(operator => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                    <sf-list-item
                            kind="text"
                            size="1"
                            text="${host.getFilterOperatorLabel(operator)}"
                            value="${operator}"
                            ?selected=${operator === selectedOperator}
                    ></sf-list-item>
                `)}
            </sf-dropdown>
        </div>
    `;
}

function renderNumberFilterControl(field, host) {
  const control = host.getFilterControlValue(field.key);
  const operators = field.filter?.operators || ['eq'];
  const selectedOperator = control.operator || field.filter?.defaultOperator || operators[0];
  const isBetween = selectedOperator === 'between';
  const rawValue = control.value;
  const rangeValue = Array.isArray(rawValue) ? rawValue : [rawValue || '', ''];

  const patchNumberValue = (index, nextInputValue) => {
    if (!isBetween) {
      host.patchTempFilterValue(field.key, {
        value: nextInputValue || '',
        operator: selectedOperator
      });
      return;
    }

    const nextValue = [...rangeValue];
    nextValue[index] = nextInputValue || '';
    host.patchTempFilterValue(field.key, {
      value: nextValue,
      operator: selectedOperator
    });
  };

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="flex gap-1/3 flex-col">
            <div class="sf-filter-operator-inputs flex gap-1/3 items-cross-center">
                <sf-input
                        size="1"
                        appearance="bordered"
                        root-class="flex-1 min-w-0"
                        label="${isBetween ? setText(host, 'rangeFrom') : host.getFilterOperatorLabel(selectedOperator)}"
                        value="${isBetween ? rangeValue[0] || '' : rawValue || ''}"
                        name="sf_filter_${field.key || 'number'}"
                        @change=${event => {
    patchNumberValue(0, event.target?.value);
  }}
                ></sf-input>
                ${isBetween ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                    <sf-input
                            size="1"
                            appearance="bordered"
                            label="${setText(host, 'rangeTo')}"
                            root-class="flex-1 min-w-0"
                            value="${rangeValue[1] || ''}"
                            name="sf_filter_${field.key || 'number'}_second"
                            @change=${event => {
    patchNumberValue(1, event.target?.value);
  }}
                    ></sf-input>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            </div>
            <sf-dropdown
                    size="1"
                    appearance="outlined"
                    mode="select"
                    placeholder="${setText(host, 'operator')}"
                    root-class="flex-1"
                    search="false"
                    @change=${event => {
    const operator = event.detail?.values?.[0] || event.detail?.value || selectedOperator;
    host.patchTempFilterValue(field.key, {
      operator
    });
  }}
            >
                ${operators.map(operator => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                    <sf-list-item
                            kind="text"
                            size="1"
                            text="${host.getFilterOperatorLabel(operator)}"
                            value="${operator}"
                            ?selected=${operator === selectedOperator}
                    ></sf-list-item>
                `)}
            </sf-dropdown>
        </div>
    `;
}

function renderDateFilterControl(field, host) {
  const control = host.getFilterControlValue(field.key);
  const operators = field.filter?.operators || ['eq'];
  const selectedOperator = control.operator || field.filter?.defaultOperator || operators[0];
  const isBetween = selectedOperator === 'between';
  const dateValue = isBetween && Array.isArray(control.value) ? control.value : isBetween ? ['', ''] : control.value || '';
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="flex flex-col gap-1/3">
            <sf-datepicker
                    .value=${dateValue}
                    ?range=${isBetween}
                    name="sf_filter_${field.key || 'date'}"
                    locale="ru-Ru"
                    @change=${event => {
    host.patchTempFilterValue(field.key, {
      value: event.detail.value,
      operator: selectedOperator
    });
  }}
            ></sf-datepicker>
            <sf-dropdown
                    size="1"
                    appearance="outlined"
                    mode="select"
                    placeholder="${setText(host, 'operator')}"
                    root-class="flex-1"
                    search="false"
                    @change=${event => {
    const operator = event.detail?.values?.[0] || event.detail?.value || selectedOperator;
    host.patchTempFilterValue(field.key, {
      operator
    });
  }}
            >
                ${operators.map(operator => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                    <sf-list-item
                            kind="text"
                            size="1"
                            text="${host.getFilterOperatorLabel(operator)}"
                            value="${operator}"
                            ?selected=${operator === selectedOperator}
                    ></sf-list-item>
                `)}
            </sf-dropdown>
        </div>
    `;
}

function renderMultiSelectFilterControl(field, host) {
  const endpointPage = host.getEndpointFilterPage(field);
  const options = host.getVisibleFilterOptions(field);
  const value = host.getFilterControlValue(field.key);
  const search = host.getFilterOptionSearch(field.key);
  const selected = new Set(value.values || []);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="flex flex-col gap-1/2">
            ${field.filter?.searchable && (!endpointPage || endpointPage.searchable) ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                <sf-input
                        size="1"
                        appearance="filled"
                        placeholder="${setText(host, 'searchInList')}"
                        value="${search}"
                        name="sf_filter_${field.key || 'list'}_search"
                        @input=${event => {
    host.patchTempFilterOptionSearch(field.key, event.target?.value || '');
  }}
                        @change=${event => {
    host.patchTempFilterOptionSearch(field.key, event.target?.value || '');
  }}
                ></sf-input>
            ` : ''}
            <div class="flex flex-col gap-1/2" data-size="4.5">
                ${options.map(option => host.renderFilterOption(field, option, selected))}
            </div>
            ${endpointPage ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                <div role="status" aria-live="polite" class="sf-text-1">
                    ${endpointPage.status === 'loading' ? setText(host, 'loadingOptions') : endpointPage.status === 'error' ? setText(host, 'optionsError') : ''}
                </div>
                ${endpointPage.status === 'error' ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button appearance="outline" size="1" text="${setText(host, 'retry')}"
                    @click=${() => host.loadEndpointFilterPage(field, null, search)}></sf-button>` : ''}
                ${endpointPage.nextCursor && endpointPage.status !== 'error' ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button appearance="outline" size="1" text="${setText(host, 'loadMore')}"
                    ?disabled=${endpointPage.status === 'loading'}
                    @click=${() => host.loadEndpointFilterPage(field, endpointPage.nextCursor, search)}></sf-button>` : ''}
            ` : ''}
        </div>
    `;
}

function renderEntityMultiSelectFilterControl(field, host) {
  // The host travels with the call. It was lost here when these functions were
  // moved out of the table: as a method, `this.renderMultiSelectFilterControl(field)`
  // carried the receiver by itself, and as a function it has to be handed on.
  // The source suite renders no entity control, so nothing in it noticed; the
  // filter-endpoint probe did, with "Cannot read properties of undefined".
  return renderMultiSelectFilterControl(field, host);
} // The filter template, addressed by the property type. The nine control names
// the table used are kept as aliases of the types they serve, so a host that
// declares a control by name keeps working while a host that declares a
// property type gets the same renderer.


const FILTER_RENDERERS = {
  text: renderTextFilterControl,
  string: renderTextFilterControl,
  number: renderNumberFilterControl,
  integer: renderNumberFilterControl,
  date: renderDateFilterControl,
  datetime: renderDateFilterControl,
  range: renderRangeFilterControl,
  'date-range': renderDateFilterControl,
  'multi-select': renderMultiSelectFilterControl,
  'single-select': renderMultiSelectFilterControl,
  choice: renderMultiSelectFilterControl,
  choices: renderMultiSelectFilterControl,
  boolean: renderMultiSelectFilterControl,
  user: renderMultiSelectFilterControl,
  'entity-multi-select': renderEntityMultiSelectFilterControl,
  'entity-single-select': renderEntityMultiSelectFilterControl,
  record: renderEntityMultiSelectFilterControl,
  relation: renderEntityMultiSelectFilterControl
}; // What a field asks to be filtered by: its own declared control if it has one,
// otherwise its property type, otherwise text.

function renderFilterField(field = {}, host) {
  const asked = field.filter?.control || field.propertyType || field.type || field.dataType || 'text';
  const renderer = FILTER_RENDERERS[asked] || FILTER_RENDERERS.text;
  return renderer(field, host);
} // The cell template. A cell is text unless the Framework has a component that
// says more than the text would, and the set renders one only when it can state
// the shape the value must have. Anything else falls back to the value itself,
// so a host that stores a plain string keeps seeing a plain string.
//
// The value shapes are the consumer's, agreed with Larena on 2026-10-06: a
// renderer cannot turn an opaque reference into a name, and resolving one needs
// an access check, so the host sends what it has resolved.
//
//   choice              a value matching one of the column's options
//   integer / number    a number, and with the `scale` variant a number 0..100
//   boolean             true or false
//   user                {value, label, avatarText}
//   record / relation   {value, label, href?} -- href only when it may be opened
//   file                {value, label, mime?, href?} -- an icon from the mime
//                       type and the label, a link when it may be opened
//   choices             a list of option values; one tag per value on the line
//
// Every element here takes `line`, not `size`: a line element is the row's text
// line, where a control height would make the row grow. That was measured --
// with size-1/2 components a default row went from 57 to 61 on desktop and 45 to
// 51 on mobile.

const CELL_LINE = '1/2'; // A choice badge in a cell is tonal, not the filled default. sf-badges defaults
// appearance to `main`, so the cells shipped filled and the consumer's owner
// asked for the calmer one -- and a table row is the place for it: a column of
// filled badges reads as a column of buttons. A field may still ask for another
// of the three, which is the same arrangement as the boolean's words: the set
// carries a sensible default, not a decision nobody can change.
//
// It composes with colour rather than replacing it. A scheme name reaches the
// scheme's tonal badge; a hex colour already writes --sf-badge--background-color
// as a 24% mix and its own text colour, so the tint survives the appearance
// untouched. Both are measured on the built bytes.

const CELL_BADGE_APPEARANCE = 'tonal'; // A file cell is a reference link with an icon chosen from the mime type: the
// consumer asked for an icon and the label and nothing else -- no size as text
// and no download button, which the record view will carry -- and the component
// that owns that shape already exists. sf-file-preview detects only image/*, so
// this small map lives here until a second caller needs it, which is the session
// that owns that component's own judgement.

const FILE_ICONS = [[/^image\//u, 'image'], [/^video\//u, 'movie'], [/^audio\//u, 'audiotrack'], [/^text\/(csv|tab-separated-values)$/u, 'table'], [/^text\//u, 'description'], [/pdf$/u, 'picture_as_pdf'], [/(zip|compressed|tar|rar|7z)/u, 'folder_zip'], [/(sheet|excel|spreadsheet)/u, 'table'], [/(word|document)$/u, 'description'], [/(presentation|powerpoint)/u, 'slideshow']];

function fileIcon(mime) {
  const value = String(mime || '').toLowerCase();
  const match = FILE_ICONS.find(([pattern]) => pattern.test(value));
  return match ? match[1] : 'attach_file';
} // A colour has the same four faces as every other property. It was absent while a
// running Larena site declares fourteen colours, so a theme colour had nowhere to
// be shown and nowhere to be changed.
//
// `inheritedValue` matters here as much as the value: the site's own colours are
// inherited from the theme until somebody chooses one, and a cell that drew the
// inherited colour as the value would say a record had decided something it had
// not.


function renderColorCell(field, value) {
  const hex = scalarValue(value);
  if (!hex) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing; // The component, not a span with classes of its own: the renderer set has no
  // stylesheet, so markup invented here would reach no rules at all -- and a
  // colour should look the same in a cell as it does in a card, which is what a
  // general part is for.

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-color size="1/2" appearance="plain" value=${String(hex)}
                  label=${field.label || field.key || ''} disabled></sf-color>
    `;
} // Reads what port 1.8.0 declares: `inherited` says a value comes from somewhere
// else, `inheritedValue` says what it is. A view that drew the inherited colour as
// the value would make «not set» and «set to the same colour» look identical, and
// only the first follows the theme when the theme moves.


function renderColorView(field, value) {
  const hex = scalarValue(value);
  const inherited = field.inheritedValue ?? '';
  if (!hex && !inherited) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-color
                size="1"
                appearance="plain"
                value=${hex ? String(hex) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                inherited-value=${inherited ? String(inherited) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                label=${field.label || field.key || ''}
                disabled
        ></sf-color>
    `;
}

function renderColorEdit(field, value, host) {
  const hex = scalarValue(value);
  const inherited = field.inheritedValue ?? '';
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-color
                size=${EDIT_SIZE}
                appearance="bordered"
                name=${fieldName(field)}
                value=${hex ? String(hex) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                inherited-value=${inherited ? String(inherited) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                swatches=${field.swatches ? String(field.swatches) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ?clearable=${Boolean(inherited) || field.required !== true}
                ?disabled=${field.readonly === true}
                label=${field.label || field.key || ''}
                @change=${event => host.setFieldValue(field, event.detail?.value ?? '')}
        ></sf-color>
    `;
}

function renderFileCell(field, value) {
  if (!value || typeof value !== 'object' || !value.label) return null;
  return {
    component: {
      type: 'reference-link',
      props: {
        line: CELL_LINE,
        label: String(value.label),
        icon: fileIcon(value.mime),
        ...(value.href ? {
          href: String(value.href)
        } : {})
      }
    }
  };
} // Several values in one cell: one tag per value, each on the row's text line.
// The tag's `line` resolves its own size and inline mode, so neither is passed
// -- the session that owns it fixed the template to read the resolved values
// rather than the attributes, which is what makes that true.


function renderChoicesCell(field, value) {
  if (!Array.isArray(value) || !value.length) return null;
  const options = field.options || field.filter?.options || field.constraints?.options;

  const label = item => {
    const option = Array.isArray(options) ? options.find(candidate => String(candidate?.value) === String(item)) : null;
    return String(option?.label ?? option?.text ?? item);
  };

  return value.map(item => ({
    component: {
      type: 'tag',
      props: {
        line: CELL_LINE,
        kind: 'default',
        text: label(item)
      }
    }
  }));
}

const CELL_RENDERERS = {
  // A date in a row used to be whatever the host had stored, printed --
  // «2026-09-25T07:12:00+03:00» beside the same value reading «25 сентября
  // 2026» in the record panel, with no way for a consumer to change the
  // first. These two ask the host and fall through to the stored value when
  // it has nothing to say.
  date: renderHostFormattedCell,
  datetime: renderHostFormattedCell,
  boolean: renderBooleanCell,
  choices: renderChoicesCell,
  file: renderFileCell,
  color: renderColorCell,
  include: renderIncludeCell,
  choice: renderChoiceCell,
  integer: renderNumericCell,
  number: renderNumericCell,
  user: renderUserCell,
  record: renderReferenceCell,
  relation: renderReferenceCell
}; // A consumer found this on their stand: the words were written into the set, so
// an English admin saw «Да». The set must not decide what a value is called in
// anyone's language. They come from the field, which is where the rest of the
// Framework keeps its text -- sf-table declares fourteen such inputs -- and the
// Russian stays only as the fallback, so nothing already published changes.
// The field's own words win, as they must: what «true» is called belongs to
// whoever owns the interface. The fallback used to be Russian whatever the page
// was -- an English admin saw «Да» -- so it follows the page's language now.

function booleanWords(field, host) {
  return {
    yes: field.trueText ?? field.labels?.true ?? setText(host, 'yes'),
    no: field.falseText ?? field.labels?.false ?? setText(host, 'no')
  };
}

function renderBooleanCell(field, value, host) {
  if (typeof value !== 'boolean') return null;
  const words = booleanWords(field, host);
  return value ? words.yes : words.no;
}

function renderChoiceCell(field, value) {
  const options = field.options || field.filter?.options || field.constraints?.options;
  if (!Array.isArray(options)) return null;
  const option = options.find(item => String(item?.value) === String(value));
  if (!option) return null;
  const badge = (0,_table_js_option_badge_js__WEBPACK_IMPORTED_MODULE_1__.optionBadgeProps)(option);
  return {
    component: {
      type: 'badge',
      props: {
        line: CELL_LINE,
        text: option.label ?? option.text ?? String(value),
        appearance: field.badgeAppearance ?? CELL_BADGE_APPEARANCE,
        ...(badge?.scheme ? {
          scheme: badge.scheme
        } : {}),
        ...(badge?.rootStyle ? {
          rootStyle: badge.rootStyle
        } : {})
      }
    }
  };
} // The scale is the `scale` variant of a number, and sf-progress-scale takes a
// value between 0 and 100 with no bounds of its own -- which is why the request
// asks for the variant on a field declaring exactly min 0 and max 100. A value
// outside that range is left as text rather than clamped: a clamped number is a
// wrong number drawn confidently.
// A cell the host has formatted. Null when it has not, so the value falls
// through to the plain one the table already prints: the set does not invent a
// format, and «798700» is a better answer than a thousands separator somebody
// did not ask for. What it does not do is leave a consumer no way to say
// «798 700 ₽» -- which was the state of a list until the host reached the cells.


function renderHostFormattedCell(field, value, host) {
  const formatted = host?.formatFieldValue?.(field, value);
  return typeof formatted === 'string' && formatted !== '' ? formatted : null;
}

function renderNumericCell(field, value, host) {
  const variant = field.variant || field.filter?.variant;
  const number = Number(scalarValue(value));

  if (variant !== 'scale' || !Number.isFinite(number)) {
    return renderHostFormattedCell(field, value, host);
  }

  if (number < 0 || number > 100) return null;
  return {
    component: {
      type: 'progress-scale',
      props: {
        line: CELL_LINE,
        value: String(number)
      }
    }
  };
}

function renderUserCell(field, value) {
  if (!value || typeof value !== 'object' || !value.label) return null;
  return [{
    component: {
      type: 'avatar',
      props: {
        line: CELL_LINE,
        text: value.avatarText || ''
      }
    }
  }, String(value.label)];
}

function renderReferenceCell(field, value) {
  if (!value || typeof value !== 'object' || !value.label) return null;
  return {
    component: {
      type: 'reference-link',
      props: {
        line: CELL_LINE,
        label: String(value.label),
        ...(value.href ? {
          href: String(value.href)
        } : {})
      }
    }
  };
} // What a cell should hold for a field, in the same shape a host would pass: a
// string, an object with a component, or a list of those. Null means the value
// is better off as itself. Returning the host's own shape is deliberate -- the
// table renders it through the path it already had, so the set adds no second
// way to draw a cell.


function renderCellField(field = {}, value, host) {
  const asked = field.propertyType || field.type || field.dataType;
  const renderer = CELL_RENDERERS[asked];
  if (!renderer) return null; // `host` is for one thing, as in the view: formatFieldValue, where a
  // consumer's own formatting of a number or a date belongs. A cell had no way
  // to reach it, so a list could not be formatted at all while the record
  // panel beside it could.

  const rendered = renderer(field, value, host);
  return rendered === null || typeof rendered === 'undefined' ? null : rendered;
} // The edit template. A field being edited is a control of the form scale, not of
// a row: these take `size`, where the cell template takes `line`.
//
// The host supplies the value and takes the change, through two methods, because
// a renderer must not decide where a value lives:
//
//   getFieldValue(field)          what the control shows
//   setFieldValue(field, value)   what the control writes
//
// Every event bound here is `change`, and that is a rule now rather than a
// coincidence: contracts/public-api-axes.json `change_event` says every form
// value control reports a committed change as `change` on its host, once per
// change the user makes, with each older name kept as an alias the manifest
// marks `alias_of`. So the set binds the canonical name for all of them --
// sf-input, sf-textarea, sf-switch, sf-dropdown, sf-button-group and
// sf-datepicker -- where it bound three different alias names before. The one
// event this file still binds under its own name is sf-file-upload:select,
// which is not a value change but a selection; the `change` on that component
// is its inner input's.

const EDIT_SIZE = '1';
const EDIT_RENDERERS = {
  record: renderRecordPicker,
  relation: renderRecordPicker,
  user: renderRecordPicker,
  string: renderTextEdit,
  text: renderTextAreaEdit,
  integer: renderNumberEdit,
  number: renderNumberEdit,
  date: renderDateEdit,
  datetime: renderDateEdit,
  boolean: renderBooleanEdit,
  choice: renderChoiceEdit,
  choices: renderChoicesEdit,
  file: renderFileEdit,
  color: renderColorEdit,
  include: renderIncludeEdit
};

function fieldName(field) {
  return `sf_field_${field.key || 'value'}`;
} // A telephone is a string with a shape, not a type of its own: the Framework
// already has a control that knows country codes, dial prefixes and masks, so a
// `string` whose variant is `phone` gets it and everything else about a string
// stays true. Counted on a running Larena site, which declares one.


function renderPhoneEdit(field, value, host) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-country-code
                size=${EDIT_SIZE}
                name=${fieldName(field)}
                value=${scalarValue(value) ?? ''}
                label=${field.label || field.key || ''}
                ?required=${Boolean(field.required)}
                ?disabled=${field.readonly === true}
                use-mask="true"
                show-code="true"
                @change=${event => host.setFieldValue(field, event.detail?.value ?? event.target?.value ?? '')}
        ></sf-country-code>
    `;
} // A file shown as what it is. The site keeps logos, so a file whose variant says
// image is drawn as the image rather than as a row with a paperclip -- the same
// stored file, told apart by the host rather than guessed from a file name.


const IMAGE_VARIANTS = new Set(['image', 'image-card', 'image-list']);

function isImageField(field) {
  return IMAGE_VARIANTS.has(String(field.variant ?? ''));
} // A block of text or code the host keeps in a file: six of them on a running
// Larena site -- scripts in the head, an included area. It is a property like any
// other, so it is shown and edited here rather than behind a separate screen.
//
// `language` is the host's, never guessed from the text: a component that decided
// a file was JavaScript because it saw a brace would be wrong about every template
// that contains one. Without a language it is plain text and says so by looking
// like text.
//
// No syntax colouring. That needs an editor component, which is its own part with
// its own decision; a monospace area that keeps indentation is honest, usable and
// does not pretend to be more.


function renderIncludeView(field, value) {
  const text = scalarValue(value);
  if (!text) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <pre class="sf-field-include" data-language=${field.language ? String(field.language) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}><code>${String(text)}</code></pre>
    `;
}

function renderIncludeEdit(field, value, host) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-textarea
                size=${EDIT_SIZE}
                appearance="bordered"
                class="sf-field-include-edit"
                name=${fieldName(field)}
                value=${scalarValue(value) ?? ''}
                rows="8"
                spellcheck="false"
                aria-label=${field.label || field.key || ''}
                ?disabled=${field.readonly === true}
                @change=${event => host.setFieldValue(field, event.target?.value ?? '')}
                @input=${event => host.setFieldValue(field, event.target?.value ?? '')}
        ></sf-textarea>
    `;
}

function renderIncludeCell(field, value) {
  const text = scalarValue(value);
  if (!text) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing; // One line in a cell: a script in a table row is a fact about the record, not
  // something to read there.

  const first = String(text).split('\n')[0];
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<code>${first.length > 60 ? `${first.slice(0, 60)}…` : first}</code>`;
}

function renderTextEdit(field, value, host) {
  if (String(field.variant ?? '') === 'phone') return renderPhoneEdit(field, value, host);
  value = scalarValue(value);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-input
                size=${EDIT_SIZE}
                appearance="bordered"
                name=${fieldName(field)}
                value=${value ?? ''}
                ?required=${Boolean(field.required)}
                aria-label=${field.label || field.key || ''}
                @input=${event => host.setFieldValue(field, event.target?.value ?? '')}
                @change=${event => host.setFieldValue(field, event.target?.value ?? '')}
        ></sf-input>
    `;
}

function renderTextAreaEdit(field, value, host) {
  value = scalarValue(value);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-textarea
                size=${EDIT_SIZE}
                appearance="bordered"
                name=${fieldName(field)}
                value=${value ?? ''}
                ?required=${Boolean(field.required)}
                aria-label=${field.label || field.key || ''}
                @input=${event => host.setFieldValue(field, event.target?.value ?? '')}
                @change=${event => host.setFieldValue(field, event.target?.value ?? '')}
        ></sf-textarea>
    `;
}

function renderNumberEdit(field, value, host) {
  const decimal = (field.propertyType || field.type) === 'number';
  value = scalarValue(value);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-input
                size=${EDIT_SIZE}
                appearance="bordered"
                name=${fieldName(field)}
                value=${value ?? ''}
                inputmode=${decimal ? 'decimal' : 'numeric'}
                ?required=${Boolean(field.required)}
                aria-label=${field.label || field.key || ''}
                @input=${event => {
    const next = event.target?.value ?? '';
    host.setFieldValue(field, next === '' ? null : Number(next));
  }}
                @change=${event => {
    const next = event.target?.value ?? '';
    host.setFieldValue(field, next === '' ? null : Number(next));
  }}
        ></sf-input>
    `;
} // A date control has no clock. `sf-datepicker` declares a format and a date,
// and its parser is anchored (`^\d{4}-\d{2}-\d{2}$`), so a datetime value
// falls through to a loose digit scan that reads `2026-11-27T13:26:00` as day
// 2026 of month 11 in year 27 -- an impossible date, which renders as an empty
// input. Split the value instead: the control edits the day, and the time the
// record already held is put back on the way out. Without that, editing the day
// of a datetime would write a value with the clock silently zeroed, which is
// worse than the empty control, because it looks like it worked.


const DATE_TIME_RE = /^(\d{4}-\d{2}-\d{2})[T ](\d{2}:\d{2}(?::\d{2})?(?:\.\d+)?)(Z|[+-]\d{2}:?\d{2})?$/;

function splitDateTime(value) {
  const match = typeof value === 'string' ? value.trim().match(DATE_TIME_RE) : null;

  if (!match) {
    return {
      date: value,
      suffix: ''
    };
  }

  return {
    date: match[1],
    suffix: `T${match[2]}${match[3] || ''}`
  };
}

function renderDateEdit(field, value, host) {
  value = scalarValue(value);
  const {
    date,
    suffix
  } = splitDateTime(value);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-datepicker
                size=${EDIT_SIZE}
                name=${fieldName(field)}
                value=${date ?? ''}
                label=${field.label || ''}
                @change=${event => {
    const next = event.detail?.value ?? event.target?.value ?? null;
    host.setFieldValue(field, next && suffix ? `${next}${suffix}` : next);
  }}
        ></sf-datepicker>
    `;
} // A required boolean is a switch: two states are all it has. An optional one is
// a pair of buttons with nothing chosen while the value is absent -- the
// consumer owner's decision of 2026-10-06, and the reason is that a switch
// cannot say «не задано»: rendering one over an absent value would write false
// on the first save, a value nobody chose.


function renderBooleanEdit(field, value, host) {
  const optional = field.required !== true;

  if (!optional) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
            <sf-switch
                    size=${EDIT_SIZE}
                    name=${fieldName(field)}
                    ?checked=${value === true}
                    label=${field.label || ''}
                    @change=${event => host.setFieldValue(field, Boolean(event.target?.checked))}
            ></sf-switch>
        `;
  }

  const words = booleanWords(field, host);
  const items = JSON.stringify([{
    value: 'yes',
    label: words.yes
  }, {
    value: 'no',
    label: words.no
  }]);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-button-group
                size=${EDIT_SIZE}
                items=${items}
                value=${value === true ? 'yes' : value === false ? 'no' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                aria-label=${field.label || field.key || ''}
                @change=${event => {
    const next = event.detail?.value;
    host.setFieldValue(field, next === 'yes' ? true : next === 'no' ? false : null);
  }}
        ></sf-button-group>
    `;
}

function editOptions(field, value, multiple) {
  const options = field.options || field.filter?.options || field.constraints?.options || [];
  const chosen = multiple ? new Set((Array.isArray(value) ? value : []).map(item => String(item))) : new Set([String(value ?? '')]);
  return options.map(option => ({
    type: 'text',
    size: '1',
    text: option.label ?? option.text ?? String(option.value),
    value: String(option.value),
    selected: chosen.has(String(option.value))
  }));
}

function renderChoiceEdit(field, value, host) {
  value = scalarValue(value);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-dropdown
                size=${EDIT_SIZE}
                appearance="outlined"
                mode="select"
                search="false"
                name=${fieldName(field)}
                value=${value ?? ''}
                aria-label=${field.label || field.key || ''}
                .options=${editOptions(field, value, false)}
                @change=${event => host.setFieldValue(field, event.detail?.value ?? null)}
        ></sf-dropdown>
    `;
}

function renderChoicesEdit(field, value, host) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-dropdown
                size=${EDIT_SIZE}
                appearance="outlined"
                mode="select"
                multiple
                search="false"
                name=${fieldName(field)}
                aria-label=${field.label || field.key || ''}
                .options=${editOptions(field, value, true)}
                @change=${event => {
    const next = event.detail?.values ?? event.detail?.value;
    host.setFieldValue(field, Array.isArray(next) ? next : next ? [next] : []);
  }}
        ></sf-dropdown>
    `;
} // The record picker: what a record, a relation or a user is edited with.
//
// It is the entity-select the filter already has, pointed at records instead of
// options and holding one value rather than several. The three cases that break
// a picker are the ones it is built around, and the ones the probe measures
// against the consumer's 448-target field:
//
//   search   hundreds of targets never fit a list, so the search is the way in
//   paging   a page arrives with a cursor and the next is asked for
//   off-page the chosen record is usually not on the page in front of you, so
//            the picker shows what is chosen whether or not the page holds it
//
// The host does the fetching, because a page of records is a query with an
// access check, and the renderer must not make one:
//
//   getFieldOptionsPage(field)                  the page the host holds
//   loadFieldOptions(field, {cursor, search})   ask for a page
//   getFieldOptionSearch(field) / setFieldOptionSearch(field, text)
//
// The value is the resolved object the consumer sends: {value, label}. The
// picker writes the same shape back, so a host never has to re-resolve what it
// already knew.
// The text the set shows beyond a value: a status line, a retry, a load-more, a
// remove label. These belong to whoever owns the interface, not to the set, so
// the host supplies them and the Russian is only the fallback -- the same
// arrangement as `booleanWords`, and the same reason. A host that passes nothing
// keeps exactly what was published.


const SET_TEXT = {
  en: {
    yes: 'Yes',
    no: 'No',
    searchInList: 'Find in the list',
    operator: 'Operator',
    rangeFrom: 'From',
    rangeTo: 'To',
    loadingOptions: 'Loading the options',
    optionsError: 'The options could not be loaded',
    pickRecord: 'Choose a record',
    searchRecords: 'Find a record',
    loadingRecords: 'Loading records',
    recordsError: 'The records could not be loaded',
    retry: 'Try again',
    loadMore: 'Load more',
    removeFile: 'Remove'
  },
  ru: {
    yes: 'Да',
    no: 'Нет',
    searchInList: 'Найти в списке',
    operator: 'Оператор',
    rangeFrom: 'От',
    rangeTo: 'До',
    loadingOptions: 'Загрузка вариантов',
    optionsError: 'Не удалось загрузить варианты',
    pickRecord: 'Выберите запись',
    searchRecords: 'Найти запись',
    loadingRecords: 'Загрузка записей',
    recordsError: 'Не удалось загрузить записи',
    retry: 'Повторить',
    loadMore: 'Загрузить ещё',
    removeFile: 'Удалить'
  }
}; // The host's word wins, as it always did; the set's own fallback now follows
// the page's language instead of being Russian whatever the page is. `host` is
// the component that called the set, which is the node the rule reads from.
// The set is not an element, so it is named here rather than taken from the
// node: `host` is whichever component called it, and words registered for the
// set should apply wherever it draws rather than once per host.

const SET_NAME = 'sf-field-renderers';

function setText(host, key) {
  return host?.getFieldText?.(key) ?? (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_2__.pageText)(SET_TEXT, key, host ?? null, SET_NAME);
}

function renderRecordPicker(field, value, host) {
  if (!host.loadFieldOptions || !host.getFieldOptionsPage) return null;
  const page = host.getFieldOptionsPage(field) || null; // A host that refused this field's candidates has none to give, now or ever.
  // Returning nothing here puts the field on the read-only fallback, which shows
  // the value it holds -- rather than an empty picker and a retry that cannot
  // succeed, over a value that is actually there.

  if (page?.status === 'unsupported') return null;
  const search = host.getFieldOptionSearch?.(field) ?? '';
  const chosen = value && typeof value === 'object' ? value : null;
  const items = Array.isArray(page?.items) ? page.items : []; // What is chosen stays in the list even when the page does not hold it --
  // the common case at 448 targets, and the one that makes a picker look like
  // it has forgotten the answer.

  const options = [...(chosen && !items.some(item => String(item.value) === String(chosen.value)) ? [chosen] : []), ...items].map(item => ({
    type: 'text',
    size: '1',
    text: String(item.label ?? item.value),
    value: String(item.value),
    selected: Boolean(chosen && String(chosen.value) === String(item.value))
  }));

  const pick = next => {
    if (!next) {
      host.setFieldValue(field, null);
      return;
    }

    const found = [chosen, ...items].find(item => item && String(item.value) === String(next));
    host.setFieldValue(field, found ? {
      value: found.value,
      label: found.label
    } : {
      value: next
    });
  };

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-field-picker flex flex-col gap-1/3" data-field-picker=${field.key || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
            <sf-dropdown
                    size=${EDIT_SIZE}
                    appearance="outlined"
                    mode="select"
                    search="true"
                    name=${fieldName(field)}
                    value=${chosen ? String(chosen.value) : ''}
                    placeholder=${field.placeholder || setText(host, 'pickRecord')}
                    search-placeholder=${field.searchPlaceholder || setText(host, 'searchRecords')}
                    aria-label=${field.label || field.key || ''}
                    .options=${options}
                    @change=${event => pick(event.detail?.value ?? null)}
                    @input=${event => {
    const text = event.target?.value ?? '';
    host.setFieldOptionSearch?.(field, text);
    host.loadFieldOptions(field, {
      cursor: null,
      search: text
    });
  }}
            ></sf-dropdown>
            ${page ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                <div class="sf-field-picker-state flex items-cross-center gap-1/3">
                    <div role="status" aria-live="polite" class="sf-text-1">
                        ${page.status === 'loading' && !page.quiet ? setText(host, 'loadingRecords') : page.status === 'error' ? setText(host, 'recordsError') : ''}
                    </div>
                    ${page.status === 'error' ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                        <sf-button appearance="outline" size="1" text=${setText(host, 'retry')}
                                @click=${() => host.loadFieldOptions(field, {
    cursor: null,
    search
  })}
                        ></sf-button>
                    ` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    ${page.nextCursor && page.status !== 'error' ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                        <sf-button appearance="outline" size="1" text=${setText(host, 'loadMore')}
                                ?disabled=${page.status === 'loading'}
                                @click=${() => host.loadFieldOptions(field, {
    cursor: page.nextCursor,
    search
  })}
                        ></sf-button>
                    ` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                </div>
            ` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        </div>
    `;
} // The `file` edit control, composed from the two halves that already exist:
// sf-file-preview for what is stored, sf-file-upload for what is arriving. They
// are not interchangeable and the split is not cosmetic -- the preview carries
// href, download and remove, the upload zone carries progress, retry and the
// selection itself. Neither renders the other's state, so a field that both
// holds files and accepts new ones needs both.
//
// sf-file-upload transfers no bytes. It selects files, keeps an `items` list of
// {state, progress, name, fileSize, errorMessage}, and emits events; the
// transfer is the host's, which is why this renderer asks the host for it
// rather than inventing an endpoint inside the set:
//
//   host.startFieldUpload(field, items)  -- begin transferring; the host writes
//                                           the stored value when a file lands
//   host.getFieldUploads(field)          -- the items in flight, upload-shaped
//   host.retryFieldUpload(field, index)  -- optional; without it, no retry
//   host.setFieldValue(field, next)      -- as every edit renderer
//
// Without the first two the zone is not rendered at all and the stored files
// stay editable, because removing a file that is already there needs no
// transfer. A zone that cannot upload is worse than no zone.
//
// `items` has one writer, and that is the host. The component fills its own
// list the moment files are chosen, but every render writes the host's list
// over it -- so a host that records what `startFieldUpload` was handed sees the
// files it selected, and a host that ignores them watches its own selection
// disappear on the next render. The selected items arrive already in the
// component's own shape, each carrying the real File in `.file`, so recording
// them is a push and not a conversion.


function storedFiles(value) {
  if (Array.isArray(value)) return value.filter(item => item && typeof item === 'object');
  return value && typeof value === 'object' ? [value] : [];
}

function renderFileEdit(field, value, host) {
  const files = storedFiles(value);
  const multiple = field.multiple === true || Array.isArray(value);
  const canUpload = Boolean(host.startFieldUpload && host.getFieldUploads);
  const uploads = canUpload ? host.getFieldUploads(field) : null;
  const items = Array.isArray(uploads) ? uploads : [];

  const drop = index => {
    const next = files.filter((_, position) => position !== index);
    host.setFieldValue(field, multiple ? next : next[0] ?? null);
  }; // download-action and remove-action both read true when the attribute is
  // absent, so a file with no href has to say false rather than drop it.


  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-field-file flex flex-col">
            ${files.map((file, index) => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                <sf-file-preview
                        file-name=${String(file.label ?? file.name ?? 'File')}
                        file-size=${String(file.size ?? '')}
                        icon=${fileIcon(file.mime ?? file.mimeType)}
                        mime-type=${String(file.mime ?? file.mimeType ?? '')}
                        href=${file.href ? String(file.href) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                        download-action=${file.href ? 'true' : 'false'}
                        remove-action="true"
                        remove-label=${`${setText(host, 'removeFile')} ${file.label ?? file.name ?? ''}`.trim()}
                        @sf-file-preview:remove=${() => drop(index)}
                ></sf-file-preview>
            `)}

            ${canUpload ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                        <sf-file-upload
                                size=${EDIT_SIZE}
                                name=${fieldName(field)}
                                accept=${String(field.accept ?? '')}
                                formats=${String(field.formats ?? '')}
                                link-text=${field.uploadText || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                                text=${field.uploadHint || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                                supporting-text=${field.uploadSupportingText || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                                ?multiple=${multiple}
                                ?disabled=${field.readonly === true}
                                aria-label=${field.label || field.key || ''}
                                .items=${items}
                                @sf-file-upload:select=${event => {
    const picked = event.detail?.files;
    const list = Array.isArray(picked) ? picked : [];
    if (list.length) host.startFieldUpload(field, list);
  }}
                                @sf-file-upload:retry=${event => {
    host.retryFieldUpload?.(field, Number(event.detail?.index ?? -1));
  }}
                        ></sf-file-upload>
                    ` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        </div>
    `;
} // The control a field is edited with, or null when the set has none for that
// type yet.


function renderEditField(field = {}, value, host) {
  const asked = field.propertyType || field.type || field.dataType;
  const renderer = EDIT_RENDERERS[asked];
  if (!renderer || !host?.setFieldValue) return null;
  return renderer(field, value, host);
} // The view template: a field shown and not edited, which is the fourth of the
// four the assignment names and the last one the set was missing.
//
// It renders lit templates rather than the host-shaped values the cell template
// returns, because its consumer is a record view rendering into its own layout,
// exactly as the edit template's is. The cell template returns host shapes only
// because sf-table already had a path for those.
//
// `line` and not `size` for everything that sits beside a label on one text
// line -- a badge, a tag, an avatar, a reference link. A size would give those a
// control's height and stand them taller than the words next to them, which is
// the mistake the cell template already avoids one rung down. The two that are
// not inline keep their own scale: a scale bar is a control, and a file preview
// has no visual size at all, its `size` being a legacy name for the file's size
// as text.

const VIEW_LINE = '1'; // A scalar may arrive as the value itself or as {value, text}: the data and the
// host's own formatting of it. The consumer asked for the second and they are
// right -- the Framework has no locale and should not acquire one through a field
// renderer. They already hold the localised text, the viewer's locale and the
// format rules, and a second formatter here would disagree with theirs the first
// time a format setting changed. `text` is the formatted value alone; a unit
// stays its own field so a column of numbers can align its units.

function carriesText(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value) && typeof value.text === 'string';
}

function scalarValue(value) {
  return carriesText(value) ? value.value : value;
}

function viewText(field, value, host) {
  const formatted = host?.formatFieldValue?.(field, value);
  if (typeof formatted === 'string') return formatted;
  if (carriesText(value)) return value.text;
  const plain = scalarValue(value);
  return plain === null || typeof plain === 'undefined' ? '' : String(plain);
}

function renderTextView(field, value, host) {
  const text = viewText(field, value, host);
  return text ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-field-view">${text}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
} // A number carries its unit when the field declares one, and nothing when it
// does not -- the set does not guess at a unit, and «42» with an invented «шт»
// beside it is a worse answer than «42».


function renderNumberView(field, value, host) {
  if (value === null || typeof value === 'undefined' || value === '') return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const variant = field.variant || field.filter?.variant; // The scale needs the number, not the host's text for it.

  const number = Number(scalarValue(value));

  if (variant === 'scale' && Number.isFinite(number) && number >= 0 && number <= 100) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-progress-scale size="1" value=${String(number)}></sf-progress-scale>`;
  }

  const text = viewText(field, value, host);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-field-view">${field.unit ? `${text} ${field.unit}` : text}</span>`;
} // A date is the host's to format. The set has no locale and will not invent one:
// without formatFieldValue it shows what it was given, which is at worst the
// stored form and never a wrong date confidently rendered.


function renderDateView(field, value, host) {
  const text = viewText(field, value, host);
  return text ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-field-view">${text}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
}

function renderBooleanView(field, value, host) {
  if (typeof value !== 'boolean') return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const words = booleanWords(field, host);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-field-view">${value ? words.yes : words.no}</span>`;
}

function renderChoiceView(field, value) {
  const options = field.options || field.filter?.options || field.constraints?.options;
  const option = Array.isArray(options) ? options.find(item => String(item?.value) === String(value)) : null;
  if (!option) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const badge = (0,_table_js_option_badge_js__WEBPACK_IMPORTED_MODULE_1__.optionBadgeProps)(option);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-badge
                line=${VIEW_LINE}
                appearance=${field.badgeAppearance ?? CELL_BADGE_APPEARANCE}
                scheme=${badge.scheme}
                style=${badge.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                text=${String(option.label ?? option.text ?? value)}
        ></sf-badge>
    `;
}

function renderChoicesView(field, value) {
  if (!Array.isArray(value) || !value.length) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const options = field.options || field.filter?.options || field.constraints?.options;

  const label = item => {
    const option = Array.isArray(options) ? options.find(candidate => String(candidate?.value) === String(item)) : null;
    return String(option?.label ?? option?.text ?? item);
  };

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <span class="sf-field-view flex items-cross-center gap-1/3">
            ${value.map(item => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-tag line=${VIEW_LINE} kind="default" text=${label(item)}></sf-tag>`)}
        </span>
    `;
}

function renderUserView(field, value) {
  if (!value || typeof value !== 'object' || !value.label) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <span class="sf-field-view flex items-cross-center gap-1/3">
            <sf-avatar line=${VIEW_LINE} text=${value.avatarText || ''}></sf-avatar>
            <span>${String(value.label)}</span>
        </span>
    `;
}

function renderReferenceView(field, value) {
  if (!value || typeof value !== 'object' || !value.label) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing; // Plain, and without the arrow: a reference read inside a record's field is
  // a value on a line, not a card. The card's frame and fill drew a second box
  // around a value that already sits in one, and the arrow said «go» beside a
  // word that is already a link (owner, 2026-10-08).

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-reference-link
                appearance="plain"
                icon=""
                line=${VIEW_LINE}
                label=${String(value.label)}
                href=${value.href ? String(value.href) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        ></sf-reference-link>
    `;
} // The one place the view template is not a smaller edit control: a stored file
// is shown with its own preview, which carries the download the view wants and
// not the remove an edit does.


function renderFileView(field, value) {
  const files = storedFiles(value);
  if (!files.length) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing; // An image is shown as the image. `image-url` and `kind` are inputs the file
  // preview already has, so this is the same component told what it is holding
  // rather than a second way of drawing a file. Which files are images is the
  // host's to say through the variant: guessing from a file name would be wrong
  // for every stored file whose name does not end in a familiar three letters.

  const asImage = isImageField(field);
  const card = String(field.variant ?? '') === 'image-card';
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <span class="sf-field-view flex ${card ? 'flex-row' : 'flex-col'} gap-1/3">
            ${files.map(file => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                <sf-file-preview
                        file-name=${String(file.label ?? file.name ?? 'File')}
                        file-size=${String(file.size ?? '')}
                        icon=${fileIcon(file.mime ?? file.mimeType)}
                        mime-type=${String(file.mime ?? file.mimeType ?? '')}
                        href=${file.href ? String(file.href) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                        image-url=${asImage && file.href ? String(file.href) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                        kind=${asImage ? 'image' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                        download-action=${file.href ? 'true' : 'false'}
                        remove-action="false"
                ></sf-file-preview>
            `)}
        </span>
    `;
}

const VIEW_RENDERERS = {
  string: renderTextView,
  text: renderTextView,
  integer: renderNumberView,
  number: renderNumberView,
  date: renderDateView,
  datetime: renderDateView,
  boolean: renderBooleanView,
  choice: renderChoiceView,
  choices: renderChoicesView,
  user: renderUserView,
  record: renderReferenceView,
  relation: renderReferenceView,
  file: renderFileView,
  color: renderColorView,
  include: renderIncludeView
}; // A field shown rather than edited. `host` is optional and used for one thing
// only -- formatFieldValue, where a consumer's own formatting of a number or a
// date belongs. Null when the set has no view for that type.

function renderViewField(field = {}, value, host) {
  const asked = field.propertyType || field.type || field.dataType;
  const renderer = VIEW_RENDERERS[asked];
  if (!renderer) return null;
  return renderer(field, value, host);
} // A host has to be able to reach the set, and a module is not an element: there
// is no tag to place and no attribute to set. The Framework already has one
// place for what a page may call -- window.SF, where the base element, `html`,
// `nothing` and `render` live -- so the set publishes itself there under its own
// name. Without this the module is built, bundled and unreachable: the consumer
// could read the mapping and not call it, which was true of this set until now.
//
// This is the runtime half of the discoverability question. The other half --
// describing the module in the registry, so a host learns what it offers without
// reading our source -- is with the registry's owner.

if (typeof window !== 'undefined') {
  window.SF = window.SF || {};
  window.SF.fieldRenderers = { ...(window.SF.fieldRenderers || {}),
    renderCellField,
    renderEditField,
    renderFilterField,
    renderViewField,
    FILTER_RENDERERS
  };
}

/***/ },

/***/ "edced5685745"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderPropertyViewTemplate: () => (/* binding */ renderPropertyViewTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("fef8077ac919");
/* harmony import */ var _default_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("3ec987bd67fe");
/* harmony import */ var _field_renderers_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("e5483002f3ea");


 // The arrangement, drawn in the component's own light DOM. Not in a shadow root:
// the field controls are Smart elements whose stylesheets are document-level, and
// a document stylesheet does not cross a shadow boundary. sf-data-view slots its
// children for exactly this reason and says so beside the slot; the first version
// of this composite built them inside a shadow root and every control came out
// with its markup and none of its CSS.

function renderFieldValue(context, field, editing) {
  const key = String(field.key ?? '');
  const editHost = {
    setFieldValue: (target, value) => context.component.changeField(target, value),
    ...(context.canUploadFiles ? {
      getFieldUploads: target => context.component.getFieldUploads(target),
      startFieldUpload: (target, items) => context.component.startFieldUpload(target, items),
      retryFieldUpload: (target, index) => context.component.retryFieldUpload(target, index)
    } : {}),
    ...(context.canPickRecords ? {
      getFieldOptionsPage: target => context.component.getFieldOptionsPage(target),
      getFieldOptionSearch: target => context.component.getFieldOptionSearch(target),
      setFieldOptionSearch: (target, text) => context.component.setFieldOptionSearch(target, text),
      loadFieldOptions: (target, request) => context.component.loadFieldOptions(target, request)
    } : {})
  };
  const content = editing ? (0,_field_renderers_index_js__WEBPACK_IMPORTED_MODULE_2__.renderEditField)(field, context.changed.has(key) ? context.changed.get(key) : field.value, editHost) : (0,_field_renderers_index_js__WEBPACK_IMPORTED_MODULE_2__.renderViewField)(field, field.value, context.hostPort);
  const reference = ['record', 'relation', 'user'].includes(field.propertyType || field.type) && field.value && typeof field.value === 'object';

  if (!editing && reference && content) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span
                class="sf-property-view-reference"
                @click=${event => {
      event.preventDefault(); // And no further: the field in view is a button that opens
      // the group for editing, so a press that reached it put the
      // whole group into edit behind the record that had just
      // opened (owner, 2026-10-08). Following a reference is one
      // intent, not two.

      event.stopPropagation();
      context.component.openReference(field, field.value);
    }}
        >${content}</span>`;
  } // An edit control the set cannot build is not an empty value. record and
  // relation have no editor until the picker's host methods exist, and the
  // first version showed «не заполнено» over a field that had a value -- a
  // consumer read it as the value having been lost. Fall back to the view, so
  // the value is shown and plainly not editable yet.


  if (editing && (content === null || typeof content === 'undefined' || content === lit__WEBPACK_IMPORTED_MODULE_0__.nothing)) {
    const shown = (0,_field_renderers_index_js__WEBPACK_IMPORTED_MODULE_2__.renderViewField)(field, field.value, context.hostPort);

    if (shown !== null && typeof shown !== 'undefined' && shown !== lit__WEBPACK_IMPORTED_MODULE_0__.nothing) {
      return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-property-view-readonly color-on-surface-variant" data-readonly="true">${shown}</span>`;
    }
  }

  if (content === null || typeof content === 'undefined' || content === lit__WEBPACK_IMPORTED_MODULE_0__.nothing) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-property-view-empty color-on-surface-variant">${context.emptyText}</span>`;
  }

  return content;
} // While the view is being configured every entry is listed, hidden and rare ones
// included: a hidden field a person cannot see is a field they cannot show again,
// and «показать редкие поля» is a reading choice rather than part of the
// arrangement being edited.


function listed(context, entries) {
  return context.configuring ? entries ?? [] : context.visible(entries);
} // The chooser names the layers this person may write and nothing else. A layer
// they may not write is drawn disabled with the host's own reason on it rather
// than left out, because a «Для всех» that is simply absent reads as a feature
// the product does not have.
// The controls of the arranging mode live in the bar at the foot (owner,
// 2026-10-08), where saving, cancelling and deleting live when a group is being
// edited: the foot is where a mode's own answers belong, and a band of them
// under the head pushed the record down by a row it did not need.


function renderConfigureBar(context) {
  if (!context.canConfigureView) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing; // Not configuring: nothing is drawn. Entering is the «⋯» menu's, as the mockup
  // has it -- a standalone «Настроить вид» link stood as its own band under the
  // head and was one of the two empty-looking rows the owner saw.

  if (!context.configuring) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing; // One row of controls and nothing else. It carried a title, a sentence and
  // two differently-shaped actions, which read as three kinds of thing at once;
  // what a person needs from it is the layer being written and the way out.
  //
  // A layer this person may not write stays in the control, disabled, carrying
  // the host's own reason -- a «Для всех» that is simply absent reads as a
  // feature the product does not have.

  const items = [{
    value: 'personal',
    label: context.personalLayerText,
    ariaLabel: context.personalLayerText
  }, {
    value: 'shared',
    label: context.sharedLayerText,
    ariaLabel: context.sharedLayerText
  }].map(item => {
    const denied = context.layerDenied(item.value);
    return denied ? { ...item,
      disabled: true,
      ariaLabel: denied
    } : item;
  }); // Which named view is being arranged, when the host offers more than one.
  // One view is not a choice and draws nothing. The chooser stands before the
  // layer control because it is the larger question: which arrangement, and
  // only then whose copy of it (owner, 2026-10-09).

  const profiles = context.viewProfiles ?? [];
  const chooser = profiles.length > 1 ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
            <sf-dropdown
                    size="1"
                    appearance="outlined"
                    data-action="view-profile"
                    aria-label=${context.viewProfileLabel}
                    value=${context.viewProfile ?? ''}
                    .items=${profiles.map(profile => ({
    value: profile.id,
    label: profile.label,
    // Whose it is, said once beside the name rather than in a
    // second control: a shared view is everyone's, a personal
    // one is this person's.
    description: profile.shared ? context.sharedLayerText : context.personalLayerText
  }))}
                    @change=${event => context.component.selectViewProfile(event.detail?.value ?? event.target?.value ?? '')}
            ></sf-dropdown>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-property-view-actions sf-property-view-configure-bar flex items-cross-center gap-2 flex-wrap"
             data-configuring="true" role="group"
             aria-label=${context.configureText}>
            ${chooser}
            <sf-button-group
                    size="1"
                    scheme="primary"
                    data-action="layer"
                    aria-label=${context.configureText}
                    value=${context.viewTarget}
                    .items=${items}
                    @change=${event => context.component.setViewTarget(event.detail?.value ?? event.target?.value ?? 'personal')}
            ></sf-button-group>
            <span class="grow"></span>
            ${context.resetAsked ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                        <span class="sf-property-view-reset-ask color-error">${context.resetViewAskText}</span>
                        <sf-button
                                appearance="link"
                                size="1"
                                status="error"
                                text=${context.resetViewText}
                                data-action="reset-view-confirm"
                                @click=${() => context.component.resetView()}
                        ></sf-button>
                        <sf-button
                                appearance="outline"
                                size="1"
                                text=${context.cancelConfiguringText}
                                data-action="reset-view-cancel"
                                @click=${() => context.component.cancelReset()}
                        ></sf-button>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                        <!-- Reset, cancel, done: the further a control reaches, the
                             quieter it is drawn. Reset takes the whole layer away
                             and asks first; cancel puts back the arrangement this
                             mode was entered with; done keeps what is there. -->
                        <sf-button
                                appearance="link"
                                size="1"
                                text=${context.resetViewText}
                                data-action="reset-view"
                                @click=${() => context.component.askReset()}
                        ></sf-button>
                        <sf-button
                                appearance="outline"
                                size="1"
                                text=${context.cancelConfiguringText}
                                data-action="cancel-configuring"
                                @click=${() => context.component.cancelConfiguringView()}
                        ></sf-button>
                        <sf-button
                                appearance="default"
                                size="1"
                                text=${context.doneConfiguringText}
                                data-action="done-configuring"
                                @click=${() => context.component.stopConfiguringView()}
                        ></sf-button>`}
        </div>
    `;
} // Width, template variant and hint sit behind the field's own settings rather
// than under every field at once. Drawn under each field they were four controls
// per row, so a group of eight fields was thirty-two controls and the
// arrangement -- the thing being edited -- could no longer be read.


function renderFieldSettings(context, field, key) {
  const variants = Array.isArray(field.variantOptions) ? field.variantOptions : [];
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-popover placement="bottom-end" width="16rem" label=${context.fieldSettingsText}
                    data-settings-for=${key}>
            <sf-icon-button
                    slot="trigger"
                    size="1/2"
                    appearance="link"
                    scheme="secondary"
                    icon="settings"
                    data-action="field-settings"
                    title=${context.fieldSettingsText}
                    aria-label=${context.fieldSettingsText}
            ></sf-icon-button>
            <div slot="content" class="flex flex-col gap-1 p-1">
                <label class="sf-property-view-settings-row sf-property-view-settings-row--stacked flex flex-col gap-1/4">
                    <span class="sf-property-view-settings-label color-on-surface-variant">${context.fieldLabelText}</span>
                    <sf-input
                            size="1/2"
                            appearance="bordered"
                            data-action="field-label"
                            aria-label=${context.fieldLabelText}
                            placeholder=${String(field.label ?? key)}
                            value=${String(field.label ?? '')}
                            @change=${event => context.component.setFieldView(key, {
    label: String(event.target?.value ?? '').trim() || null
  })}
                    ></sf-input>
                </label>
                <label class="sf-property-view-settings-row sf-property-view-settings-row--stacked flex flex-col gap-1/4">
                    <span class="sf-property-view-settings-label color-on-surface-variant">${context.hintText}</span>
                    <sf-input
                            size="1/2"
                            appearance="bordered"
                            data-action="hint"
                            aria-label=${context.hintText}
                            placeholder=${context.hintText}
                            value=${String(field.hint ?? '')}
                            @change=${event => context.component.setFieldView(key, {
    hint: event.target?.value ?? ''
  })}
                    ></sf-input>
                </label>
                ${variants.length ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                            <label class="sf-property-view-settings-row flex items-cross-center justify-between gap-1">
                                <span class="sf-property-view-settings-label color-on-surface-variant">${context.variantText}</span>
                                <sf-dropdown
                                        size="1/2"
                                        appearance="outlined"
                                        mode="select"
                                        search="false"
                                        data-action="variant"
                                        aria-label=${context.variantText}
                                        value=${String(field.variant ?? '')}
                                        .options=${variants.map(variant => ({
    type: 'text',
    size: '1',
    text: variant.label ?? variant.text ?? String(variant.value ?? variant),
    value: String(variant.value ?? variant),
    selected: String(field.variant ?? '') === String(variant.value ?? variant)
  }))}
                                        @change=${event => context.component.setFieldView(key, {
    variant: event.detail?.value ?? null
  })}
                                ></sf-dropdown>
                            </label>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                <label class="sf-property-view-settings-row flex items-cross-center justify-between gap-1">
                    <span class="sf-property-view-settings-label color-on-surface-variant">${context.widthText}</span>
                    <sf-switch
                            size="1/2"
                            data-action="width"
                            ?checked=${field.width === 'full'}
                            @change=${event => context.component.setFieldView(key, {
    width: event.target?.checked ? 'full' : 'half'
  })}
                    ></sf-switch>
                </label>
            </div>
        </sf-popover>
    `;
} // The two controls a field carries while the view is arranged: taking it out of
// this area and where everything else about it lives. They sit at the end of the
// field, on the ladder the rest of the panel uses.
//
// None of them is red (owner, 2026-10-08). Red is the record's own delete, in
// the bar at the foot; a mode whose rows each carry a red mark reads as a list
// of warnings, and taking a field out of an area is an ordinary act of
// arranging that the «+» beside it undoes.
//
// Taking out rather than hiding (owner, 2026-10-07): a field removed here joins
// the unplaced, where the list behind the «+» offers it back, so removing is
// visible and undoable in the same place. Hiding is still what the port carries
// and what a shared layer does to a field for everyone -- a field hidden above
// this layer is drawn with its reason and cannot be taken out from here.


function renderFieldActions(context, field, key) {
  const locked = !context.canChangeVisibility(field);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-property-view-field-actions flex items-cross-center gap-1/4">
            <sf-icon-button
                    size="1/2"
                    appearance="link"
                    scheme="secondary"
                    icon=${field.hidden ? 'visibility_off' : 'close'}
                    data-action="remove-field"
                    ?disabled=${locked}
                    title=${locked ? context.layerDenied('shared') || context.hiddenText : context.removeFieldText}
                    aria-label=${context.removeFieldText}
                    @click=${() => context.component.moveFieldToUnplaced(key)}
            ></sf-icon-button>
            ${renderFieldSettings(context, field, key)}
        </div>
    `;
} // A name that can be changed, where it stands. In the arranging mode the title
// is the control: pressing it, or the pencil beside it, turns it into a field
// with a tick and a cross -- the two answers a person has to a name they are
// typing. Nothing is written until the tick, so an area keeps its name while
// somebody is still deciding on another.


function renderEntryName(context, kind, key, label, titleClass) {
  const renaming = context.renaming?.kind === kind && context.renaming?.key === String(key);

  if (!context.configuring) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<h3 class=${titleClass}>${label}</h3>`;
  }

  if (!renaming) {
    // The pencil stands right after the name rather than at the end of the
    // row: at the end it read as another of the area's controls, and what
    // it edits is the name beside it (owner, 2026-10-08). The name takes
    // only the room it needs, and the space that was taken from it goes to
    // the spacer, which keeps the controls at the end of the row.
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
            <h3 class=${titleClass}>
                <button type="button" class="sf-property-view-rename-trigger text-start cursor-pointer"
                        data-action="rename"
                        title=${context.renameText}
                        @click=${() => context.component.startRenaming(kind, key)}
                >${label}</button>
            </h3>
            <sf-icon-button
                    size="1/2"
                    appearance="link"
                    scheme="secondary"
                    icon="edit"
                    data-action="rename"
                    title=${context.renameText}
                    aria-label=${context.renameText}
                    @click=${() => context.component.startRenaming(kind, key)}
            ></sf-icon-button>
            <span class="grow"></span>
        `;
  }

  const commit = event => {
    const input = event.target?.closest?.('.sf-property-view-rename')?.querySelector('sf-input');
    context.component.renameEntry(kind, key, input?.value ?? label);
  };

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <span class="sf-property-view-rename flex items-cross-center gap-1/4 grow min-w-0">
            <sf-input
                    size="1/2"
                    appearance="bordered"
                    autofocus
                    root-class="flex-auto min-w-0"
                    data-action="rename-input"
                    aria-label=${context.renameText}
                    value=${label}
                    @keydown=${event => {
    if (event.key === 'Enter') commit(event);
    if (event.key === 'Escape') context.component.cancelRenaming();
  }}
            ></sf-input>
            <sf-icon-button
                    size="1/2"
                    appearance="link"
                    scheme="on-surface"
                    icon="check"
                    data-action="rename-save"
                    title=${context.saveNameText}
                    aria-label=${context.saveNameText}
                    @click=${commit}
            ></sf-icon-button>
            <sf-icon-button
                    size="1/2"
                    appearance="link"
                    scheme="on-surface"
                    icon="close"
                    data-action="rename-cancel"
                    title=${context.cancelNameText}
                    aria-label=${context.cancelNameText}
                    @click=${() => context.component.cancelRenaming()}
            ></sf-icon-button>
        </span>
    `;
} // A value is a way in. Reading a record and changing it are the same screen in the
// mockup: a person presses the value and its group opens for editing, with a pen
// showing that it can be. Only a readonly field, a field already being edited and
// a field being arranged are not buttons -- each already means something else.


function renderField(context, field, editing, sectionKey = '', groupKey = '') {
  const key = String(field.key ?? '');
  const error = context.errors.get(key);
  const arrangementError = context.configuring ? context.entryError('field', key) : null;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-property-view-field flex flex-col gap-1 min-w-0 ${field.width === 'full' ? 'sf-property-view-field--full' : ''}"
             data-field=${key}
             data-sf-sortable-item=${context.configuring ? key : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
             data-arranging=${context.configuring ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
             data-hidden=${context.configuring && field.hidden ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
            ${context.configuring ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class="sf-icon sf-property-view-grip items-cross-center" data-sf-sortable-handle
                              aria-hidden="true">drag_indicator</i>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            <div class="sf-property-view-field-label flex items-cross-center gap-1/3 color-on-surface-variant">
                ${String(field.label ?? key)}
                ${field.required && editing ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-property-view-required color-error" aria-hidden="true">*</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ${field.hint ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class="sf-icon sf-icon--size-2 sf-property-view-hint" tabindex="0" role="img"
                                  title=${String(field.hint)} aria-label=${String(field.hint)}>info</i>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ${field.rare ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-property-view-rare color-on-surface-variant">${context.rareText}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ${field.inherited && !editing ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-property-view-inherited color-on-surface-variant">${context.inheritedText}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            </div>
            ${editing || context.configuring || field.readonly === true ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-property-view-field-value min-w-0 flex items-cross-center gap-2 flex-wrap">${renderFieldValue(context, field, editing)}</div>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                        <button
                                type="button"
                                class="sf-property-view-field-value sf-property-view-field-open min-w-0 flex items-cross-center gap-1 text-start cursor-pointer"
                                data-open-group=${groupKey}
                                title=${context.editText}
                                @click=${() => context.component.editGroup(sectionKey, groupKey)}
                        >
                            ${renderFieldValue(context, field, editing)}
                            <i class="sf-icon sf-icon--size-1/2 sf-property-view-pen" aria-hidden="true">edit</i>
                        </button>`}
            ${context.configuring ? renderFieldActions(context, field, key) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ${error || arrangementError ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-property-view-field-error color-error" role="alert">${error || arrangementError}</div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        </div>
    `;
} // A group of related records: the component composes a data view in it and the
// view asks the host for its own port. The records never come through the
// property-view seam -- rows, columns, sorting and paging are the data-view
// port's vocabulary, and relaying them through this one would duplicate all of it.
//
// `chrome=""` leaves out the search box and the page row: the list stands inside a
// group that already has a heading, and a page row under four rows of a capped
// list would offer paging through records the cap is not showing anyway.
//
// The table is slotted in, which is how a data view is composed -- its own page
// markup slots one too. An earlier version left it out and relied on the fallback
// inside the data view's content slot instead, to satisfy a fence that said a
// component rendering another one has to fetch it. That traded one defect for a
// worse one: fallback content lives in the shadow tree, where the Framework's
// page-level stylesheets do not reach, so a consumer got a list whose sort buttons
// read «unfold_more» as text and whose reference cells read «arrow_forward». The
// fence was right and the clever fix was wrong: this component does render a table,
// so it fetches cl-table.


function renderRelatedList(context, group, groupKey) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-data-view
                class="sf-property-view-related"
                chrome=""
                row-cap=${String(group.rowCap ?? 5)}
                port-owner="property-view"
                port-record=${context.recordId || ''}
                port-group=${groupKey}
                aria-label=${String(group.label ?? groupKey)}
        >
            <sf-table
                    slot="content"
                    toolbar="false"
                    aria-label=${String(group.label ?? groupKey)}
            ></sf-table>
        </sf-data-view>
    `;
} // Placing a field in this group without dragging it. Dragging is the gesture the
// mockup asks for and it stays, but it is a poor way to reach a field that is
// three screens away, and no way at all without a pointer -- and a collection
// can have hundreds of fields, which no list anybody scrolls will answer.
//
// So: a search and a set of ticks. What is ticked is what this area shows, which
// makes unticking the way a field leaves it, and each row says where the field
// is now, because a field lives in one place and taking it here takes it from
// there. The surface is anchored by hand because sf-dropdown brings its own
// trigger and the trigger here is the «+».


function renderAddField(context, groupKey) {
  const options = context.fieldChoices(groupKey).map(option => ({
    type: 'checkbox',
    size: '1/2',
    text: option.label,
    value: option.key,
    group: option.group,
    selected: option.selected,
    checked: option.selected,
    ariaLabel: option.label
  }));
  const placed = options.filter(option => option.selected).map(option => option.value); // The list is sf-dropdown's: it carries the search, the groups, the
  // multiple selection and the surface, and takes the «+» as its trigger.
  // What is acted on is the option the change names, not the whole value the
  // dropdown now holds: the component moves a field rather than setting a
  // list, and reading the whole list as the new truth once took five fields
  // out of an area because one was ticked.

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-dropdown
                class="sf-property-view-add"
                size="1/2"
                multiple
                search="true"
                search-placeholder=${context.addFieldText}
                aria-label=${context.addFieldText}
                data-add-for=${groupKey}
                value=${placed.join(',')}
                .options=${options}
                @change=${event => {
    const key = String(event.detail?.value ?? '');
    if (!key) return;
    const values = Array.isArray(event.detail?.values) ? event.detail.values.map(String) : [];
    context.component.toggleFieldInGroup(key, groupKey, values.includes(key));
  }}
        >
            <sf-icon-button
                    slot="trigger"
                    size="1/2"
                    appearance="link"
                    scheme="secondary"
                    icon="add"
                    data-action="add-field"
                    title=${context.addFieldText}
                    aria-label=${context.addFieldText}
            ></sf-icon-button>
        </sf-dropdown>
    `;
}

function renderGroup(context, section, group) {
  const groupKey = String(group.key ?? '');
  const editing = context.editing?.group === groupKey && context.editing?.section === String(section.key ?? '');
  const fields = listed(context, group.fields);
  const configuring = context.configuring;
  const groupError = configuring ? context.entryError('group', groupKey) : null;
  const groupLocked = configuring && !context.canChangeVisibility(group); // The field list is a sortable list and nothing more: the drop is reported by
  // sf-sortable and applied or refused by the component, which is the seam that
  // mechanism already publishes. Its id carries the kind and the container, so
  // one listener can tell a field dropped into a group from a group dropped into
  // a section.

  const rows = (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${fields.map(field => renderField(context, field, editing, String(section.key ?? ''), groupKey))}`;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <section class="sf-property-view-group bg-surface-0 flex flex-col gap-2 ${editing ? 'sf-property-view-group--editing' : ''}"
                 data-group=${groupKey}
                 data-sf-sortable-item=${configuring ? groupKey : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                 data-hidden=${configuring && group.hidden ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                 data-columns=${group.columns === 2 ? '2' : '1'}>
            <header class="sf-property-view-group-header flex items-cross-center justify-between gap-2">
                ${configuring ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class="sf-icon sf-property-view-grip items-cross-center" data-sf-sortable-handle
                                  aria-hidden="true">drag_indicator</i>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ${renderEntryName(context, 'group', groupKey, String(group.label ?? groupKey), 'sf-property-view-group-title')}
                ${group.rare ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-property-view-rare color-on-surface-variant">${context.rareText}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ${configuring ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                            <span class="flex items-cross-center gap-1/4">
                            ${renderAddField(context, groupKey)}
                            <sf-icon-button
                                    size="1/2"
                                    appearance="link"
                                    scheme="secondary"
                                    icon="keyboard_arrow_up"
                                    data-action="group-up"
                                    ?disabled=${context.groupAt(groupKey) === 0}
                                    title=${context.moveUpText}
                                    aria-label=${context.moveUpText}
                                    @click=${() => context.component.moveGroupBy(groupKey, -1)}
                            ></sf-icon-button>
                            <sf-icon-button
                                    size="1/2"
                                    appearance="link"
                                    scheme="secondary"
                                    icon="keyboard_arrow_down"
                                    data-action="group-down"
                                    ?disabled=${context.groupAt(groupKey) === context.groupCount - 1}
                                    title=${context.moveDownText}
                                    aria-label=${context.moveDownText}
                                    @click=${() => context.component.moveGroupBy(groupKey, 1)}
                            ></sf-icon-button>
                            <sf-icon-button
                                    size="1/2"
                                    appearance="link"
                                    scheme="secondary"
                                    icon=${group.hidden ? 'visibility_off' : 'delete'}
                                    data-action="remove-group"
                                    ?disabled=${groupLocked}
                                    title=${groupLocked ? context.layerDenied('shared') || context.hiddenText : context.removeGroupText}
                                    aria-label=${context.removeGroupText}
                                    @click=${() => context.component.removeGroup(groupKey)}
                            ></sf-icon-button>
                            </span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ${!configuring && !editing && group.kind !== 'related' && group.editable !== false ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                            <sf-button
                                    appearance="link"
                                    size="1"
                                    text=${context.editText}
                                    data-action="edit"
                                    @click=${() => context.component.editGroup(String(section.key ?? ''), groupKey)}
                            ></sf-button>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            </header>
            ${groupError ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-property-view-group-error" role="alert">${groupError}</div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ${group.kind === 'related' ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-property-view-group-related">${renderRelatedList(context, group, groupKey)}</div>` : configuring ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                                <sf-sortable
                                        class="sf-property-view-group-fields min-w-0"
                                        group="field"
                                        accepts="field"
                                        id=${`field:${groupKey}`}
                                        label=${String(group.label ?? groupKey)}
                                >${rows}</sf-sortable>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-property-view-group-fields min-w-0">${rows}</div>`}
        </section>
    `;
} // The phone's first screen: the sections as a list, each one leading to its own
// screen. Drawn only when there is more than one, for the same reason the desktop
// list is: a list of one is a control nobody can use, and it would put a screen
// between a person and the only groups there are.


function renderPhoneSectionList(context, sections) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <nav class="sf-property-view-phone-sections flex flex-col" aria-label=${context.sectionsLabel}>
            ${sections.map(section => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                <button
                        type="button"
                        class="sf-property-view-phone-section flex items-cross-center justify-between gap-1"
                        data-phone-section=${String(section.key)}
                        @click=${() => context.component.openPhoneSection(String(section.key))}
                >
                    <span class="sf-property-view-phone-section-label">${String(section.label ?? section.key)}</span>
                    <i class="sf-icon" aria-hidden="true">chevron_right</i>
                </button>
            `)}
        </nav>
    `;
} // The second screen's head: back to the list, and the name of where you are.


function renderPhoneSectionHead(context) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-property-view-phone-head flex items-cross-center gap-2">
            <sf-icon-button
                    size="1"
                    type="link"
                    icon="arrow_back"
                    data-action="phone-back"
                    aria-label=${context.backLabel}
                    @click=${() => context.component.closePhoneSection()}
            ></sf-icon-button>
            <h2 class="sf-property-view-phone-title">${context.phoneSectionLabel}</h2>
        </div>
    `;
}

function renderSectionList(context, sections) {
  // One section is drawn as its groups alone: a list of one is a control nobody
  // can use, and the consumer's request asks for the groups to stand alone.
  if (sections.length < 2 && !context.configuring) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <nav class="sf-property-view-sections self-cross-stretch flex flex-col min-w-0" aria-label=${context.sectionsLabel}>
            ${context.configuring ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                        ${renderSectionTabsArranged(context, sections)}
                        <div class="sf-property-view-additions flex">${renderAddSection(context)}</div>` : renderSectionTree(context, sections)}
        </nav>
    `;
} // Reading: the sections are a tree, which carries the keyboard walk and the
// selection a list of destinations needs.
//
// The items are given as data rather than as children: sf-tree reads its child
// items once and removes them, so a section renamed while the view is being
// arranged kept its old name in this list.


function renderSectionTree(context, sections) {
  const items = sections.map(section => ({
    label: sectionName(context, section),
    value: String(section.key),
    selected: String(section.key) === context.selectedSection,
    openIcon: section.icon ? String(section.icon) : '',
    closedIcon: section.icon ? String(section.icon) : ''
  }));
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-tree
                selection="single"
                .items=${items}
                @sf-tree-selection-change=${event => {
    const value = event.detail?.value;
    if (value) context.component.selectSection(String(value));
  }}
        ></sf-tree>
    `;
} // Arranging: the same tabs, in an order a drag can change, and each one still a
// place to drop a field or an area. A tree cannot be reordered by a pointer --
// it takes its items once and owns their rows -- so while the view is arranged
// the tabs are rows of this component's own, which is also what lets a tab carry
// a handle.


function renderSectionTabsArranged(context, sections) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-sortable
                class="sf-property-view-section-tabs flex flex-col"
                group="section"
                accepts="section"
                id="section:all"
                label=${context.sectionsLabel}
        >
            ${sections.map(section => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                <button
                        type="button"
                        class="sf-property-view-section-tab flex items-cross-center gap-1/3 min-w-0 text-start cursor-pointer"
                        data-section-tab=${String(section.key)}
                        data-sf-sortable-item=${String(section.key)}
                        aria-current=${String(section.key) === context.selectedSection ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                        @click=${() => context.component.selectSection(String(section.key))}
                >
                    <i class="sf-icon sf-property-view-section-grip color-on-surface-variant" data-sf-sortable-handle
                       aria-hidden="true">drag_indicator</i>
                    <i class="sf-icon" aria-hidden="true">${section.icon ? String(section.icon) : 'folder'}</i>
                    <span class="sf-property-view-section-tab-label flex-auto min-w-0">${sectionName(context, section)}</span>
                </button>
            `)}
        </sf-sortable>
    `;
} // A rare section says so in its own name. sf-tree-item takes a label string and
// reads anything slotted into it as text -- markup put there printed lit's own
// markers into the list -- so a trailing mark of its own is a gap in that
// component rather than something to work around here.


function sectionName(context, section) {
  const label = String(section.label ?? section.key);
  return section.rare ? `${label} · ${context.rareText}` : label;
} // The bar at the foot of the panel: what is being done to the record right now,
// and what can be done to the record itself. Arranging the view is neither, so
// while the view is being arranged there is no bar -- its own band carries that
// mode's actions, and two bars at once was the state the owner saw.
//
// The count of changed fields is gone. It named a number nobody acts on, while
// the two controls that matter stood after it; what is still said is what stops
// a save -- errors and a conflict.
// Sections as a row of tabs rather than a list beside the fields. The same
// sections either way -- what changes is where they are read, not what they are
// -- so a section is still selected the same way and a group still moves to one
// by being dropped on it.
// sf-tabs reads its set from an attribute, through a parser that splits on `|`
// and reads `::` as flags; it has no declarative way to take richer items, so a
// section's icon cannot travel with it here. A label carrying either sequence
// would be read as structure, so it is spelled out of the way.


function tabLabel(context, section) {
  return sectionName(context, section).replace(/\|/gu, '\u2502').replace(/::/gu, ':\u2236');
} // The tab row only. The groups are drawn under it by the layout, as they are
// beside the list, so a section's content is in one place whichever way the
// sections are read. Slotting empty panels in here drew empty tabs: a slot for
// a tab replaces its label.


function renderSectionTabs(context, sections) {
  const at = Math.max(0, sections.findIndex(section => String(section.key) === context.selectedSection));
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-tabs
                class="sf-property-view-tabs"
                size="1"
                active-index=${String(at)}
                aria-label=${context.sectionsLabel}
                items=${sections.map(section => tabLabel(context, section)).join('|')}
                @sf-tab-change=${event => {
    const section = sections[Number(event.detail?.current)];
    if (section) context.component.selectSection(String(section.key));
  }}
        ></sf-tabs>
    `;
}

function renderActions(context) {
  const removable = context.recordActions.includes('record.delete'); // While the view is arranged the foot carries that mode's controls instead:
  // saving a record and arranging the view it is read in are two modes, and a
  // bar holding both would offer a save for something nobody was editing.

  if (context.configuring) return renderConfigureBar(context);
  if (!context.editing && !removable) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-property-view-actions flex items-cross-center gap-2 flex-wrap" role="group">
            ${context.editing ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                        <sf-button
                                appearance="default"
                                size="1"
                                text=${context.saveText}
                                data-action="save"
                                ?disabled=${context.changed.size === 0}
                                @click=${() => context.component.saveGroup()}
                        ></sf-button>
                        <sf-button
                                appearance="outline"
                                size="1"
                                text=${context.cancelText}
                                data-action="cancel"
                                @click=${() => context.component.cancelEdit()}
                        ></sf-button>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ${context.errors.size ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-property-view-errors color-error">${context.errorsText}: ${context.errors.size}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ${context.conflict ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-property-view-conflict color-error" role="alert">${context.conflict}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            <span class="grow"></span>
            ${removable ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                        <sf-icon-button
                                appearance="link"
                                status="error"
                                size="1"
                                icon="delete"
                                data-action="delete"
                                title=${context.deleteText}
                                aria-label=${context.deleteText}
                                @click=${() => context.component.deleteRecord()}
                        ></sf-icon-button>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        </div>
    `;
} // An unplaced field is being arranged, not read: it shows its name and a handle
// and nothing else. Drawn like a placed one it carried its value, so the area
// read as a group of fields that happen to be last rather than as the fields
// this view does not show.


function renderUnplacedField(context, field) {
  const key = String(field.key ?? '');
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-property-view-field sf-property-view-field--unplaced flex flex-col gap-1 min-w-0"
             data-field=${key}
             data-sf-sortable-item=${key}
             data-arranging="true">
            <i class="sf-icon sf-property-view-grip items-cross-center" data-sf-sortable-handle aria-hidden="true">drag_indicator</i>
            <div class="sf-property-view-field-label flex items-cross-center gap-1/3 color-on-surface-variant">
                ${String(field.label ?? key)}
                ${field.rare ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-property-view-rare color-on-surface-variant">${context.rareText}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            </div>
        </div>
    `;
} // Fields the view places nowhere. Drawn only while the view is being arranged,
// because they are not part of what a person reads -- and drawn even when there
// are none, so that dragging a field out of every group has somewhere to land
// and a person can see that taking a field out does not destroy it.


function renderUnplaced(context) {
  if (!context.configuring) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const fields = context.unplaced; // The Framework's own accordion rather than a fold built here: the owner
  // asked for it by name, and a second thing that opens and closes is a
  // second thing to keep looking right (owner, 2026-10-09).
  //
  // The accordion owns whether it is open -- its script claims any
  // .sf-accordion the document gains and remembers the state -- so the panel
  // does not bind it. What the panel does instead is press the trigger when a
  // drag starts, the way a person would, and press it back when the drag
  // ends. One controller, and a drop target that is visible exactly when
  // something is in the air.
  //
  // The hint paragraph is gone: it described in two lines what the «+» beside
  // every area does, under a heading that already says what the bin is.

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <article
                class="sf-accordion sf-accordion--outline sf-property-view-group--unplaced"
                data-unplaced="true"
        >
            <h3 class="sf-accordion-heading">
                <button
                        type="button"
                        class="sf-accordion-trigger"
                        data-action="toggle-unplaced"
                        aria-expanded="false"
                >
                    <span class="sf-accordion-title flex items-cross-center gap-1/3">
                        ${context.unplacedTitle}
                        ${fields.length ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-tag
                                    kind="default"
                                    size="1/3"
                                    appearance="surface"
                                    text=${String(fields.length)}
                            ></sf-tag>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    </span>
                    <sf-icon icon="chevron_right" size="1/2"></sf-icon>
                </button>
            </h3>
            <div class="sf-accordion-content" role="region" hidden>
                <sf-sortable
                        class="sf-property-view-group-fields sf-property-view-unplaced"
                        group="field"
                        accepts="field"
                        id=${`unplaced:${context.recordId || 'record'}`}
                        label=${context.unplacedTitle}
                >${fields.map(field => renderUnplacedField(context, field))}</sf-sortable>
            </div>
        </article>
    `;
} // The three controls a panel carries, and none of them invents anything. Close is
// the component's own business; copying and opening need an address, and the
// address is the host's -- a composite that constructed a URL would be guessing at
// the consumer's routing and would be wrong in the first consumer whose routing
// did not match the guess. No address, no two controls.
// The panel's head, as the mockup draws it: the collection on its own line above,
// then the record's name with its favourite star, the host's own actions, and a
// «⋯» for what belongs to the view rather than to the record. One block, so there
// are no empty bands between the title and the first card -- the view this replaces
// had two of about sixty pixels, which is what the owner saw first.
// What belongs to the view rather than to the record: arranging it, resetting it
// and whether the rare entries are shown. It is a menu because there is more than
// one of them; pressing «⋯» used to run the first item straight away, so the
// second never had anywhere to be.


function renderMenuControl(context) {
  const items = context.panelMenuItems;
  const host = context.hasHostSlot('menu') ? context.hostSlot('menu') : null;
  if (!items.length && !host) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing; // Always the menu, never the one item drawn in its place. The place is the
  // panel's own: what belongs in it depends on the task, and a consumer that
  // slots its items into `menu` finds the same «\u2026» wherever it looks --
  // which it could not when one item meant a different glyph in that corner
  // (owner, 2026-10-08).

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-popover placement="bottom-end" role="menu" label=${context.menuLabel}>
            <sf-icon-button
                    slot="trigger"
                    appearance="link"
                    scheme="on-surface"
                    size="1"
                    icon="more_horiz"
                    data-action="menu"
                    aria-label=${context.menuLabel}
            ></sf-icon-button>
            <div slot="content" class="flex flex-col items-cross-stretch p-1/2">
                ${items.map(item => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                    <sf-button
                            appearance="link"
                            size="1"
                            scheme="on-surface"
                            text=${item.name}
                            icon-left=${item.icon}
                            data-menu-item=${item.id}
                            @click=${() => context.component.chooseMenuItem(item.id)}
                    ></sf-button>`)}
                ${host ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            </div>
        </sf-popover>
    `;
}

function renderPanelHead(context) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <header class="sf-property-view-head flex flex-col gap-1">
            <div class="sf-property-view-title-row flex items-cross-center gap-1 min-w-0">
                <h2 class="sf-property-view-title min-w-0 overflow-hidden">${context.panelLabel || context.recordId || ''}</h2>
                <!-- One glyph, filled when the record is a favourite and outlined
                     when it is not: a star that changes shape as well as fill
                     says two things where one will do (owner, 2026-10-08). The
                     press raises the component's own event; whether the record
                     is a favourite stays the host's to decide and to answer. -->
                <sf-icon-button
                        appearance="link"
                        size="1"
                        icon="star"
                        ?filled=${context.favourite}
                        data-action="favourite"
                        aria-pressed=${context.favourite ? 'true' : 'false'}
                        aria-label=${context.favouriteLabel}
                        @click=${() => context.component.toggleFavourite()}
                ></sf-icon-button>
                <span class="grow"></span>
                ${context.hasHostSlot('actions') ? context.hostSlot('actions') : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ${renderMenuControl(context)}
            </div>
        </header>
    `;
} // Round, and on the panel's outer edge rather than inside its head: in a stack
// each panel keeps its own set visible past the one above it, which is what the
// mockup shows and what a row inside the head cannot do.


function renderPanelControls(context) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-property-view-edge flex flex-col gap-1/2" slot="edge"
             aria-label=${context.closeLabel}>
            <sf-icon-button
                    appearance="tonal"
                    scheme="on-surface"
                    root-style="--sf-icon-button--background-color: var(--sf-surface-0)"
                    size="1"
                    icon="close"
                    data-action="close"
                    aria-label=${context.closeLabel}
                    title=${context.closeLabel}
                    @click=${() => context.component.closePanel('close')}
            ></sf-icon-button>
            ${context.address ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                        <sf-icon-button
                                appearance="tonal"
                                scheme="on-surface"
                                root-style="--sf-icon-button--background-color: var(--sf-surface-0)"
                                size="1"
                                icon=${context.addressCopied ? 'check' : 'link'}
                                aria-label=${context.addressCopied ? context.linkCopiedLabel : context.copyLinkLabel}
                                title=${context.addressCopied ? context.linkCopiedLabel : context.copyLinkLabel}
                                data-action="copy-link"
                                data-copied=${context.addressCopied ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                                @click=${() => context.component.copyAddress()}
                        ></sf-icon-button>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ${context.canOpenFullPage ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                        <sf-icon-button
                                appearance="tonal"
                                scheme="on-surface"
                                root-style="--sf-icon-button--background-color: var(--sf-surface-0)"
                                size="1"
                                icon="open_in_full"
                                aria-label=${context.openFullLabel}
                                title=${context.openFullLabel}
                                data-action="open-full"
                                @click=${() => context.component.openFullPage()}
                        ></sf-icon-button>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        </div>
    `;
} // The phone's list screen: below the breakpoint, with more than one section and
// none of them opened. Named once rather than written out at each of the three
// places that ask it -- the first version repeated the expression and the third
// copy was the one that forgot to suppress the groups, so the list screen drew the
// list with a section's groups underneath it.


function onPhoneSectionList(context, sections) {
  return !context.wide && sections.length > 1 && context.phoneSection === null;
} // The section being arranged, named where its areas are. The section list is
// drawn with sf-tree-item, which takes a label as a string and reads anything
// slotted into it as text, so neither a pencil nor a field can stand in the list
// itself -- and a section shown as a tab has no list at all. The name of the
// place you are arranging belongs above the things you are arranging anyway.


function renderSectionBar(context, section, count) {
  if (!section) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-property-view-section-bar flex items-cross-center gap-1/4"
             data-section=${String(section.key)}>
            ${context.configuring ? renderSectionIcon(context, section) : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class="sf-icon" aria-hidden="true">${section.icon ? String(section.icon) : 'folder'}</i>`}
            ${renderEntryName(context, 'section', String(section.key), String(section.label ?? section.key), 'sf-property-view-section-title min-w-0')}
            <sf-icon-button
                    size="1/2"
                    appearance="link"
                    scheme="secondary"
                    icon="delete"
                    data-action="remove-section"
                    ?disabled=${count < 2}
                    title=${context.removeSectionText}
                    aria-label=${context.removeSectionText}
                    @click=${() => context.component.removeSection(String(section.key))}
            ></sf-icon-button>
        </div>
    `;
} // The glyph a section is marked with, chosen from a grid of them. A column of a
// hundred icons is a column nobody scrolls to the end of, so the dropdown lays
// its options out several to a row and searches by the name of the glyph, which
// is the only thing about an icon a person can type.


function renderSectionIcon(context, section) {
  const current = section.icon ? String(section.icon) : '';
  const options = context.sectionIconChoices.map(icon => ({
    type: 'icon',
    size: '1',
    icon,
    text: icon,
    value: icon,
    ariaLabel: icon,
    selected: icon === current
  })); // The chooser is the dropdown laid out as a grid: a hundred and twenty
  // glyphs in a column is a column nobody scrolls to the end of, and the
  // search is the only thing about a glyph a person can type. The trigger is
  // the glyph itself, because a field spelling out the name of what is drawn
  // beside it says the same thing twice.

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-dropdown
                class="sf-property-view-section-icon"
                size="1/2"
                layout="grid"
                columns="6"
                search="true"
                search-placeholder=${context.sectionIconText}
                aria-label=${context.sectionIconText}
                data-icon-for=${String(section.key)}
                value=${current}
                .options=${options}
                @change=${event => context.component.setSectionIcon(String(section.key), event.detail?.value ?? '')}
        >
            <sf-icon-button
                    slot="trigger"
                    size="1/2"
                    appearance="link"
                    scheme="on-surface"
                    icon=${current || 'folder'}
                    data-action="section-icon"
                    title=${context.sectionIconText}
                    aria-label=${context.sectionIconText}
            ></sf-icon-button>
        </sf-dropdown>
    `;
} // Making something new, at the end of the arrangement, where a person who has
// run out of places to put a field looks for one (owner, 2026-10-07). An area
// and a section are the two boxes this view has: one holds fields, the other
// holds areas. Both are named the moment they are made -- the new name opens
// for typing -- because an area called «Новая область» among four real ones is
// a box nobody can tell from the others.
//
// Both stand the width of what they add to, in the neutral scheme and with no
// glyph: making a box is not the primary act of this mode, and a full-width
// outlined button with a plus in it read as the main thing to do on the screen.
// «Add an area» takes the ladder's size 1, the size the panel's own controls
// use; «add a section» stays a step below it, which is where it sits in the
// rail (owner, 2026-10-09).
// Keeping the list of named views, under the arrangement they belong to --
// the same place a new area and a new section are made, because making a box is
// one act whatever the box is (owner, 2026-10-09).
//
// A view is named the moment it is made, like an area and a section: a view
// called «Новый вид» among four real ones is one nobody can tell from the
// others. Removing is offered per view and not at all for the last shared one:
// a scope with no shared view has nothing for a person who has made none of
// their own, and the host refuses it anyway.


function renderViewProfiles(context) {
  const profiles = context.viewProfiles ?? [];
  if (!profiles.length) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <section class="sf-property-view-profiles flex flex-col gap-1/3">
            <h3 class="sf-property-view-profiles-title">${context.viewProfileLabel}</h3>
            ${profiles.map(profile => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                <div class="sf-property-view-profile flex items-cross-center gap-1/3" data-profile=${profile.id}>
                    <sf-input
                            size="1/2"
                            appearance="bordered"
                            class="flex-auto min-w-0"
                            value=${profile.label}
                            aria-label=${profile.label}
                            data-action="rename-profile"
                            @change=${event => context.component.renameViewProfile(profile.id, event.detail?.value ?? event.target?.value ?? '')}
                    ></sf-input>
                    <span class="sf-property-view-profile-scope color-on-surface-variant">
                        ${profile.shared ? context.sharedLayerText : context.personalLayerText}
                    </span>
                    <sf-icon-button
                            size="1/2"
                            appearance="link"
                            scheme="secondary"
                            icon="close"
                            data-action="delete-profile"
                            ?disabled=${!context.canDeleteViewProfile(profile.id)}
                            title=${context.canDeleteViewProfile(profile.id) ? context.deleteViewText : context.lastSharedViewText}
                            aria-label=${context.deleteViewText}
                            @click=${() => context.component.deleteViewProfile(profile.id)}
                    ></sf-icon-button>
                </div>
            `)}
            <sf-button
                    appearance="outline"
                    scheme="on-surface"
                    size="1/2"
                    text=${context.addViewText}
                    data-action="add-profile"
                    @click=${() => context.component.createViewProfile(context.newViewText)}
            ></sf-button>
        </section>
    `;
}

function renderArrangementAdditions(context, section) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-property-view-additions flex flex-col items-cross-stretch gap-1">
            <sf-button
                    appearance="outline"
                    scheme="on-surface"
                    size="1"
                    text=${context.addGroupText}
                    data-action="add-group"
                    @click=${() => context.component.addGroup(section ? String(section.key) : '')}
            ></sf-button>
            ${sidebarDrawn(context) ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : renderAddSection(context)}
            ${renderViewProfiles(context)}
        </div>
    `;
} // A new section is made at the end of the sections (owner, 2026-10-08), which is
// where a person looks for one: under the list of them. Without a rail there is
// no list to put it under, so it stands beside «add an area» as before.


function renderAddSection(context) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-button
                appearance="outline"
                scheme="on-surface"
                size="1/2"
                text=${context.addSectionText}
                data-action="add-section"
                @click=${() => context.component.addSection()}
        ></sf-button>
    `;
} // Whether the column of tabs is drawn beside the fields. It holds the tabs and
// nothing else (owner, 2026-10-07), so what used to stand above the whole panel
// -- the band of the arranging mode -- stands above the fields instead, and the
// column reaches the top of the panel the way a rail of tabs does.


function sidebarDrawn(context) {
  const sections = listed(context, context.sections);
  return Boolean(context.wide && context.sectionsAs === 'list' && (sections.length > 1 || context.configuring));
}

function renderBody(context, railOutside = false, withActions = true) {
  // Sections are listed the same way fields and groups are while the view is
  // being configured: a hidden section filtered out here would be a section
  // nobody could ever show again.
  const sections = listed(context, context.sections);
  const current = sections.find(section => String(section.key) === context.selectedSection) ?? sections[0] ?? null;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-property-view-status" role="status" aria-live="polite" ?hidden=${!context.message}>
            ${context.message}
        </div>
        ${!context.panel && (context.hasHostSlot('actions') || context.hasHostSlot('menu') || context.panelMenuItems.length) ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                    <div class="sf-property-view-host-actions flex flex-wrap items-cross-center justify-end gap-1">
                        ${context.hasHostSlot('actions') ? context.hostSlot('actions') : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                        ${renderMenuControl(context)}
                    </div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        ${onPhoneSectionList(context, sections) ? renderPhoneSectionList(context, sections) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        ${context.wide && context.sectionsAs === 'tabs' && sections.length > 1 ? renderSectionTabs(context, sections) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        <div class="sf-property-view-layout"
             style=${`--sf-property-view--sections-width: ${context.sectionsWidth};`}
             data-sections=${String(sections.length)}
             data-screen=${onPhoneSectionList(context, sections) ? 'sections' : 'groups'}>
            ${!context.wide && sections.length > 1 && context.phoneSection !== null ? renderPhoneSectionHead(context) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ${sidebarDrawn(context) && !railOutside ? renderSectionList(context, sections) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ${context.isEmptyRecord && !context.configuring ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<p class="sf-property-view-empty-record color-on-surface-variant"
                              role="status">${context.emptyRecordText}</p>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ${onPhoneSectionList(context, sections) ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : context.configuring ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                        <div class="sf-property-view-body flex-auto min-w-0 flex flex-col gap-4">
                            ${renderSectionBar(context, current, sections.length)}
                            <sf-sortable
                                    class="sf-property-view-groups flex flex-col gap-4"
                                    group="group"
                                    accepts="group"
                                    id=${`group:${current ? String(current.key) : ''}`}
                                    label=${String(current?.label ?? current?.key ?? '')}
                            >${listed(context, current?.groups).map(group => renderGroup(context, current, group))}</sf-sortable>
                            ${renderArrangementAdditions(context, current)}
                            ${renderUnplaced(context)}
                        </div>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                        <div class="sf-property-view-body flex-auto min-w-0 flex flex-col gap-4">
                            ${context.visible(current?.groups).map(group => renderGroup(context, current, group))}
                        </div>`}
        </div>
        ${context.hasHostSlot('footer') ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-property-view-host-footer flex flex-wrap items-cross-center gap-2">${context.hostSlot('footer')}</div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        ${withActions ? renderActions(context) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    `;
} // A deeper window is narrower by a step, so the one below shows along the
// inline-start edge. That is what makes a stack visible rather than merely true
// in the DOM, and `width` is a declared input on sf-drawer, so it reaches into
// none of that component's internals.
//
// A window above the stack takes no step in from the one below (owner,
// 2026-10-07): the step read as the panel having slipped rather than as a stack,
// and the page behind is already dimmed, which says there is something under
// this. sf-drawer keeps `stack-offset` for a consumer that wants the step; this
// one asks for none.
//
// The panel lies *over* the page: `overlay` is on, so the page behind is dimmed and
// keeps its own layout. It was off before, which is how a consumer's page came to
// be squeezed instead of covered -- the first thing the owner pointed at.
//
// `modal` is on because the drawer draws its overlay only when it is -- the
// element is marked hidden unless modal and overlay are both set, which was
// measured rather than assumed. Dimming the page is what the mockup asks for, and
// a panel that dims the page is modal in the sense that matters. Esc is still
// handled here rather than by the drawer, because in a stack it must close the top
// window and not every one of them.
//
// The drawer is given no `title`: the panel draws its own head, with the collection
// above the name and the star and the «⋯» beside it, and a drawer title as well
// would be the same words twice.


function renderPropertyViewTemplate(context) {
  if (!context.panel) return renderBody(context); // The panel is laid out the way a page is (owner, 2026-10-08): a head across
  // the top, a foot across the bottom, and what is between them scrolling
  // under both. The bands were sticky inside the panel's own scroller before,
  // which held them only while their containing block was on screen -- so a
  // record scrolled far enough took its own head and foot with it.
  //
  // With a rail of tabs what is between them is two columns, each with its own
  // scrollbar: a long list of sections scrolls without moving the record, and
  // a long record scrolls without moving the list.

  const rail = sidebarDrawn(context); // `show-close` is off because the panel draws its own close, in the strip
  // beside copy-link and open-full. With both, a panel carried two close
  // buttons a step apart, and on a phone neither was reachable: the strip is
  // placed a gutter's width beyond the panel's inline start, which on a
  // full-screen drawer is off the screen.

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-drawer
                open
                placement="inline-end"
                modal="true"
                overlay="true"
                size=${context.wide ? context.panelSize : 'full'}
                width=${context.wide ? context.drawerWidth || lit__WEBPACK_IMPORTED_MODULE_0__.nothing : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                gutter="var(--sf-space-1)"
                panel-style=${`--sf-drawer-background: var(--sf-surface-1); --sf-property-view--sections-width: ${context.sectionsWidth}; scrollbar-gutter: auto;`}
                show-close="false"
                close-label=${context.closeLabel}
                close-on-esc="false"
                label=${context.panelLabel || context.recordId || ''}
        >
            ${renderPanelControls(context)}
            <div class="sf-property-view-panel relative flex flex-col gap-2${rail ? ' sf-property-view-panel--railed' : ''}"
                 data-record-id=${context.recordId || ''}
                 data-stack-depth=${String(context.stackDepth)}
                 data-stacked=${context.isTopPanel ? 'false' : 'true'}
            >
                ${renderPanelHead(context)}
                <div class="sf-property-view-scroll flex-auto min-h-0 ${rail ? 'flex' : 'flex flex-col'}">
                    ${rail ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                                ${renderSectionList(context, listed(context, context.sections))}
                                <div class="sf-property-view-frame flex-auto min-w-0 flex flex-col gap-2">
                                    ${renderBody(context, true, false)}
                                </div>` : renderBody(context, false, false)}
                </div>
                ${renderActions(context)}
            </div>
        </sf-drawer>
    `;
}

/***/ },

/***/ "aaa5e760767f"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   optionBadgeProps: () => (/* binding */ optionBadgeProps)
/* harmony export */ });
/* harmony import */ var _component_badges_js_contract_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("a2a9d3c2841e");

const HEX_COLOR = /^#(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
/**
 * Badge look for a filter option with optionRenderer 'badge'. option.color is
 * a Framework badge scheme (success, danger, info...) or a hex colour; a hex
 * colour tints the tonal background and keeps the text on the surface colour,
 * so the label stays readable in both themes. Anything else is neutral.
 */

function optionBadgeProps(option = {}) {
  const color = typeof option?.color === "string" ? option.color.trim() : "";
  const scheme = color.toLowerCase();
  if (_component_badges_js_contract_js__WEBPACK_IMPORTED_MODULE_0__.BADGE_SCHEMES.includes(scheme)) return {
    scheme,
    rootStyle: ""
  };

  if (HEX_COLOR.test(color)) {
    return {
      scheme: "neutral",
      rootStyle: `--sf-badge--background-color: color-mix(in srgb, ${color} 24%, transparent); --sf-badge--color: var(--sf-on-surface)`
    };
  }

  return {
    scheme: "neutral",
    rootStyle: ""
  };
}

/***/ },

/***/ "3ec987bd67fe"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "aa42666a7938"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CSSResult: () => (/* binding */ n),
/* harmony export */   adoptStyles: () => (/* binding */ S),
/* harmony export */   css: () => (/* binding */ i),
/* harmony export */   getCompatibleStyle: () => (/* binding */ c),
/* harmony export */   supportsAdoptingStyleSheets: () => (/* binding */ e),
/* harmony export */   unsafeCSS: () => (/* binding */ r)
/* harmony export */ });
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),o=new WeakMap;class n{constructor(t,e,o){if(this._$cssResult$=!0,o!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const s=this.t;if(e&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=o.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&o.set(s,t))}return t}toString(){return this.cssText}}const r=t=>new n("string"==typeof t?t:t+"",void 0,s),i=(t,...e)=>{const o=1===t.length?t[0]:e.reduce((e,s,o)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[o+1],t[0]);return new n(o,t,s)},S=(s,o)=>{if(e)s.adoptedStyleSheets=o.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of o){const o=document.createElement("style"),n=t.litNonce;void 0!==n&&o.setAttribute("nonce",n),o.textContent=e.cssText,s.appendChild(o)}},c=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return r(e)})(t):t;
//# sourceMappingURL=css-tag.js.map


/***/ },

/***/ "ea86f8429d07"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CSSResult: () => (/* reexport safe */ _css_tag_js__WEBPACK_IMPORTED_MODULE_0__.CSSResult),
/* harmony export */   ReactiveElement: () => (/* binding */ y),
/* harmony export */   adoptStyles: () => (/* reexport safe */ _css_tag_js__WEBPACK_IMPORTED_MODULE_0__.adoptStyles),
/* harmony export */   css: () => (/* reexport safe */ _css_tag_js__WEBPACK_IMPORTED_MODULE_0__.css),
/* harmony export */   defaultConverter: () => (/* binding */ u),
/* harmony export */   getCompatibleStyle: () => (/* reexport safe */ _css_tag_js__WEBPACK_IMPORTED_MODULE_0__.getCompatibleStyle),
/* harmony export */   notEqual: () => (/* binding */ f),
/* harmony export */   supportsAdoptingStyleSheets: () => (/* reexport safe */ _css_tag_js__WEBPACK_IMPORTED_MODULE_0__.supportsAdoptingStyleSheets),
/* harmony export */   unsafeCSS: () => (/* reexport safe */ _css_tag_js__WEBPACK_IMPORTED_MODULE_0__.unsafeCSS)
/* harmony export */ });
/* harmony import */ var _css_tag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("aa42666a7938");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:i,defineProperty:e,getOwnPropertyDescriptor:h,getOwnPropertyNames:r,getOwnPropertySymbols:o,getPrototypeOf:n}=Object,a=globalThis,c=a.trustedTypes,l=c?c.emptyScript:"",p=a.reactiveElementPolyfillSupport,d=(t,s)=>t,u={toAttribute(t,s){switch(s){case Boolean:t=t?l:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,s){let i=t;switch(s){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},f=(t,s)=>!i(t,s),b={attribute:!0,type:String,converter:u,reflect:!1,useDefault:!1,hasChanged:f};Symbol.metadata??=Symbol("metadata"),a.litPropertyMetadata??=new WeakMap;class y extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,s=b){if(s.state&&(s.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((s=Object.create(s)).wrapped=!0),this.elementProperties.set(t,s),!s.noAccessor){const i=Symbol(),h=this.getPropertyDescriptor(t,i,s);void 0!==h&&e(this.prototype,t,h)}}static getPropertyDescriptor(t,s,i){const{get:e,set:r}=h(this.prototype,t)??{get(){return this[s]},set(t){this[s]=t}};return{get:e,set(s){const h=e?.call(this);r?.call(this,s),this.requestUpdate(t,h,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??b}static _$Ei(){if(this.hasOwnProperty(d("elementProperties")))return;const t=n(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(d("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(d("properties"))){const t=this.properties,s=[...r(t),...o(t)];for(const i of s)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const s=litPropertyMetadata.get(t);if(void 0!==s)for(const[t,i]of s)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,s]of this.elementProperties){const i=this._$Eu(t,s);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(s){const i=[];if(Array.isArray(s)){const e=new Set(s.flat(1/0).reverse());for(const s of e)i.unshift((0,_css_tag_js__WEBPACK_IMPORTED_MODULE_0__.getCompatibleStyle)(s))}else void 0!==s&&i.push((0,_css_tag_js__WEBPACK_IMPORTED_MODULE_0__.getCompatibleStyle)(s));return i}static _$Eu(t,s){const i=s.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,s=this.constructor.elementProperties;for(const i of s.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return (0,_css_tag_js__WEBPACK_IMPORTED_MODULE_0__.adoptStyles)(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,s,i){this._$AK(t,i)}_$ET(t,s){const i=this.constructor.elementProperties.get(t),e=this.constructor._$Eu(t,i);if(void 0!==e&&!0===i.reflect){const h=(void 0!==i.converter?.toAttribute?i.converter:u).toAttribute(s,i.type);this._$Em=t,null==h?this.removeAttribute(e):this.setAttribute(e,h),this._$Em=null}}_$AK(t,s){const i=this.constructor,e=i._$Eh.get(t);if(void 0!==e&&this._$Em!==e){const t=i.getPropertyOptions(e),h="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:u;this._$Em=e;const r=h.fromAttribute(s,t.type);this[e]=r??this._$Ej?.get(e)??r,this._$Em=null}}requestUpdate(t,s,i,e=!1,h){if(void 0!==t){const r=this.constructor;if(!1===e&&(h=this[t]),i??=r.getPropertyOptions(t),!((i.hasChanged??f)(h,s)||i.useDefault&&i.reflect&&h===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,i))))return;this.C(t,s,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,s,{useDefault:i,reflect:e,wrapped:h},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??s??this[t]),!0!==h||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(s=void 0),this._$AL.set(t,s)),!0===e&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,s]of this._$Ep)this[t]=s;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[s,i]of t){const{wrapped:t}=i,e=this[s];!0!==t||this._$AL.has(s)||void 0===e||this.C(s,void 0,i,e)}}let t=!1;const s=this._$AL;try{t=this.shouldUpdate(s),t?(this.willUpdate(s),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(s)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(s)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}}y.elementStyles=[],y.shadowRootOptions={mode:"open"},y[d("elementProperties")]=new Map,y[d("finalized")]=new Map,p?.({ReactiveElement:y}),(a.reactiveElementVersions??=[]).push("2.1.2");
//# sourceMappingURL=reactive-element.js.map


/***/ },

/***/ "7ab7aedf3cfc"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CSSResult: () => (/* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.CSSResult),
/* harmony export */   LitElement: () => (/* binding */ i),
/* harmony export */   ReactiveElement: () => (/* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.ReactiveElement),
/* harmony export */   _$LE: () => (/* binding */ n),
/* harmony export */   _$LH: () => (/* reexport safe */ lit_html__WEBPACK_IMPORTED_MODULE_1__._$LH),
/* harmony export */   adoptStyles: () => (/* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.adoptStyles),
/* harmony export */   css: () => (/* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.css),
/* harmony export */   defaultConverter: () => (/* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.defaultConverter),
/* harmony export */   getCompatibleStyle: () => (/* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.getCompatibleStyle),
/* harmony export */   html: () => (/* reexport safe */ lit_html__WEBPACK_IMPORTED_MODULE_1__.html),
/* harmony export */   mathml: () => (/* reexport safe */ lit_html__WEBPACK_IMPORTED_MODULE_1__.mathml),
/* harmony export */   noChange: () => (/* reexport safe */ lit_html__WEBPACK_IMPORTED_MODULE_1__.noChange),
/* harmony export */   notEqual: () => (/* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.notEqual),
/* harmony export */   nothing: () => (/* reexport safe */ lit_html__WEBPACK_IMPORTED_MODULE_1__.nothing),
/* harmony export */   render: () => (/* reexport safe */ lit_html__WEBPACK_IMPORTED_MODULE_1__.render),
/* harmony export */   supportsAdoptingStyleSheets: () => (/* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.supportsAdoptingStyleSheets),
/* harmony export */   svg: () => (/* reexport safe */ lit_html__WEBPACK_IMPORTED_MODULE_1__.svg),
/* harmony export */   unsafeCSS: () => (/* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.unsafeCSS)
/* harmony export */ });
/* harmony import */ var _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ea86f8429d07");
/* harmony import */ var lit_html__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("f550d360fd36");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const s=globalThis;class i extends _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.ReactiveElement{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=(0,lit_html__WEBPACK_IMPORTED_MODULE_1__.render)(r,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return lit_html__WEBPACK_IMPORTED_MODULE_1__.noChange}}i._$litElement$=!0,i["finalized"]=!0,s.litElementHydrateSupport?.({LitElement:i});const o=s.litElementPolyfillSupport;o?.({LitElement:i});const n={_$AK:(t,e,r)=>{t._$AK(e,r)},_$AL:t=>t._$AL};(s.litElementVersions??=[]).push("4.2.2");
//# sourceMappingURL=lit-element.js.map


/***/ },

/***/ "f6a1e423f201"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AsyncDirective: () => (/* binding */ f),
/* harmony export */   Directive: () => (/* reexport safe */ _directive_js__WEBPACK_IMPORTED_MODULE_1__.Directive),
/* harmony export */   PartType: () => (/* reexport safe */ _directive_js__WEBPACK_IMPORTED_MODULE_1__.PartType),
/* harmony export */   directive: () => (/* reexport safe */ _directive_js__WEBPACK_IMPORTED_MODULE_1__.directive)
/* harmony export */ });
/* harmony import */ var _directive_helpers_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("a5a956c9f619");
/* harmony import */ var _directive_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("0e2a9b296d0b");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const s=(i,t)=>{const e=i._$AN;if(void 0===e)return!1;for(const i of e)i._$AO?.(t,!1),s(i,t);return!0},o=i=>{let t,e;do{if(void 0===(t=i._$AM))break;e=t._$AN,e.delete(i),i=t}while(0===e?.size)},r=i=>{for(let t;t=i._$AM;i=t){let e=t._$AN;if(void 0===e)t._$AN=e=new Set;else if(e.has(i))break;e.add(i),c(t)}};function h(i){void 0!==this._$AN?(o(this),this._$AM=i,r(this)):this._$AM=i}function n(i,t=!1,e=0){const r=this._$AH,h=this._$AN;if(void 0!==h&&0!==h.size)if(t)if(Array.isArray(r))for(let i=e;i<r.length;i++)s(r[i],!1),o(r[i]);else null!=r&&(s(r,!1),o(r));else s(this,i)}const c=i=>{i.type==_directive_js__WEBPACK_IMPORTED_MODULE_1__.PartType.CHILD&&(i._$AP??=n,i._$AQ??=h)};class f extends _directive_js__WEBPACK_IMPORTED_MODULE_1__.Directive{constructor(){super(...arguments),this._$AN=void 0}_$AT(i,t,e){super._$AT(i,t,e),r(this),this.isConnected=i._$AU}_$AO(i,t=!0){i!==this.isConnected&&(this.isConnected=i,i?this.reconnected?.():this.disconnected?.()),t&&(s(this,i),o(this))}setValue(t){if((0,_directive_helpers_js__WEBPACK_IMPORTED_MODULE_0__.isSingleExpression)(this._$Ct))this._$Ct._$AI(t,this);else{const i=[...this._$Ct._$AH];i[this._$Ci]=t,this._$Ct._$AI(i,this,0)}}disconnected(){}reconnected(){}}
//# sourceMappingURL=async-directive.js.map


/***/ },

/***/ "a5a956c9f619"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TemplateResultType: () => (/* binding */ e),
/* harmony export */   clearPart: () => (/* binding */ j),
/* harmony export */   getCommittedValue: () => (/* binding */ M),
/* harmony export */   getDirectiveClass: () => (/* binding */ f),
/* harmony export */   insertPart: () => (/* binding */ v),
/* harmony export */   isCompiledTemplateResult: () => (/* binding */ d),
/* harmony export */   isDirectiveResult: () => (/* binding */ c),
/* harmony export */   isPrimitive: () => (/* binding */ n),
/* harmony export */   isSingleExpression: () => (/* binding */ r),
/* harmony export */   isTemplateResult: () => (/* binding */ l),
/* harmony export */   removePart: () => (/* binding */ h),
/* harmony export */   setChildPartValue: () => (/* binding */ u),
/* harmony export */   setCommittedValue: () => (/* binding */ p)
/* harmony export */ });
/* harmony import */ var _lit_html_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("f550d360fd36");

/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{I:t}=_lit_html_js__WEBPACK_IMPORTED_MODULE_0__._$LH,i=o=>o,n=o=>null===o||"object"!=typeof o&&"function"!=typeof o,e={HTML:1,SVG:2,MATHML:3},l=(o,t)=>void 0===t?void 0!==o?._$litType$:o?._$litType$===t,d=o=>null!=o?._$litType$?.h,c=o=>void 0!==o?._$litDirective$,f=o=>o?._$litDirective$,r=o=>void 0===o.strings,s=()=>document.createComment(""),v=(o,n,e)=>{const l=o._$AA.parentNode,d=void 0===n?o._$AB:n._$AA;if(void 0===e){const i=l.insertBefore(s(),d),n=l.insertBefore(s(),d);e=new t(i,n,o,o.options)}else{const t=e._$AB.nextSibling,n=e._$AM,c=n!==o;if(c){let t;e._$AQ?.(o),e._$AM=o,void 0!==e._$AP&&(t=o._$AU)!==n._$AU&&e._$AP(t)}if(t!==d||c){let o=e._$AA;for(;o!==t;){const t=i(o).nextSibling;i(l).insertBefore(o,d),o=t}}}return e},u=(o,t,i=o)=>(o._$AI(t,i),o),m={},p=(o,t=m)=>o._$AH=t,M=o=>o._$AH,h=o=>{o._$AR(),o._$AA.remove()},j=o=>{o._$AR()};
//# sourceMappingURL=directive-helpers.js.map


/***/ },

/***/ "0e2a9b296d0b"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Directive: () => (/* binding */ i),
/* harmony export */   PartType: () => (/* binding */ t),
/* harmony export */   directive: () => (/* binding */ e)
/* harmony export */ });
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},e=t=>(...e)=>({_$litDirective$:t,values:e});class i{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}
//# sourceMappingURL=directive.js.map


/***/ },

/***/ "59df0b19b37c"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createRef: () => (/* binding */ e),
/* harmony export */   ref: () => (/* binding */ n)
/* harmony export */ });
/* harmony import */ var _lit_html_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("f550d360fd36");
/* harmony import */ var _async_directive_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("f6a1e423f201");
/* harmony import */ var _directive_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("0e2a9b296d0b");

/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const e=()=>new h;class h{}const o=new WeakMap,n=(0,_directive_js__WEBPACK_IMPORTED_MODULE_2__.directive)(class extends _async_directive_js__WEBPACK_IMPORTED_MODULE_1__.AsyncDirective{render(i){return _lit_html_js__WEBPACK_IMPORTED_MODULE_0__.nothing}update(i,[s]){const e=s!==this.G;return e&&this.rt(void 0),(e||this.lt!==this.ct)&&(this.G=s,this.ht=i.options?.host,this.rt(this.ct=i.element)),_lit_html_js__WEBPACK_IMPORTED_MODULE_0__.nothing}rt(t){if(void 0!==this.G)if(this.isConnected||(t=void 0),"function"==typeof this.G){const i=this.ht??globalThis;let s=o.get(i);void 0===s&&(s=new WeakMap,o.set(i,s)),void 0!==s.get(this.G)&&this.G.call(this.ht,void 0),s.set(this.G,t),void 0!==t&&this.G.call(this.ht,t)}else this.G.value=t}get lt(){return"function"==typeof this.G?o.get(this.ht??globalThis)?.get(this.G):this.G?.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});
//# sourceMappingURL=ref.js.map


/***/ },

/***/ "15e6f5e928bf"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isServer: () => (/* binding */ o)
/* harmony export */ });
/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const o=!1;
//# sourceMappingURL=is-server.js.map


/***/ },

/***/ "f550d360fd36"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   _$LH: () => (/* binding */ j),
/* harmony export */   html: () => (/* binding */ b),
/* harmony export */   mathml: () => (/* binding */ T),
/* harmony export */   noChange: () => (/* binding */ E),
/* harmony export */   nothing: () => (/* binding */ A),
/* harmony export */   render: () => (/* binding */ D),
/* harmony export */   svg: () => (/* binding */ w)
/* harmony export */ });
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,i=t=>t,s=t.trustedTypes,e=s?s.createPolicy("lit-html",{createHTML:t=>t}):void 0,h="$lit$",o=`lit$${Math.random().toFixed(9).slice(2)}$`,n="?"+o,r=`<${n}>`,l=document,c=()=>l.createComment(""),a=t=>null===t||"object"!=typeof t&&"function"!=typeof t,u=Array.isArray,d=t=>u(t)||"function"==typeof t?.[Symbol.iterator],f="[ \t\n\f\r]",v=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_=/-->/g,m=/>/g,p=RegExp(`>|${f}(?:([^\\s"'>=/]+)(${f}*=${f}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),g=/'/g,$=/"/g,y=/^(?:script|style|textarea|title)$/i,x=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),b=x(1),w=x(2),T=x(3),E=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),C=new WeakMap,P=l.createTreeWalker(l,129);function V(t,i){if(!u(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==e?e.createHTML(i):i}const N=(t,i)=>{const s=t.length-1,e=[];let n,l=2===i?"<svg>":3===i?"<math>":"",c=v;for(let i=0;i<s;i++){const s=t[i];let a,u,d=-1,f=0;for(;f<s.length&&(c.lastIndex=f,u=c.exec(s),null!==u);)f=c.lastIndex,c===v?"!--"===u[1]?c=_:void 0!==u[1]?c=m:void 0!==u[2]?(y.test(u[2])&&(n=RegExp("</"+u[2],"g")),c=p):void 0!==u[3]&&(c=p):c===p?">"===u[0]?(c=n??v,d=-1):void 0===u[1]?d=-2:(d=c.lastIndex-u[2].length,a=u[1],c=void 0===u[3]?p:'"'===u[3]?$:g):c===$||c===g?c=p:c===_||c===m?c=v:(c=p,n=void 0);const x=c===p&&t[i+1].startsWith("/>")?" ":"";l+=c===v?s+r:d>=0?(e.push(a),s.slice(0,d)+h+s.slice(d)+o+x):s+o+(-2===d?i:x)}return[V(t,l+(t[s]||"<?>")+(2===i?"</svg>":3===i?"</math>":"")),e]};class S{constructor({strings:t,_$litType$:i},e){let r;this.parts=[];let l=0,a=0;const u=t.length-1,d=this.parts,[f,v]=N(t,i);if(this.el=S.createElement(f,e),P.currentNode=this.el.content,2===i||3===i){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(r=P.nextNode())&&d.length<u;){if(1===r.nodeType){if(r.hasAttributes())for(const t of r.getAttributeNames())if(t.endsWith(h)){const i=v[a++],s=r.getAttribute(t).split(o),e=/([.?@])?(.*)/.exec(i);d.push({type:1,index:l,name:e[2],strings:s,ctor:"."===e[1]?I:"?"===e[1]?L:"@"===e[1]?z:H}),r.removeAttribute(t)}else t.startsWith(o)&&(d.push({type:6,index:l}),r.removeAttribute(t));if(y.test(r.tagName)){const t=r.textContent.split(o),i=t.length-1;if(i>0){r.textContent=s?s.emptyScript:"";for(let s=0;s<i;s++)r.append(t[s],c()),P.nextNode(),d.push({type:2,index:++l});r.append(t[i],c())}}}else if(8===r.nodeType)if(r.data===n)d.push({type:2,index:l});else{let t=-1;for(;-1!==(t=r.data.indexOf(o,t+1));)d.push({type:7,index:l}),t+=o.length-1}l++}}static createElement(t,i){const s=l.createElement("template");return s.innerHTML=t,s}}function M(t,i,s=t,e){if(i===E)return i;let h=void 0!==e?s._$Co?.[e]:s._$Cl;const o=a(i)?void 0:i._$litDirective$;return h?.constructor!==o&&(h?._$AO?.(!1),void 0===o?h=void 0:(h=new o(t),h._$AT(t,s,e)),void 0!==e?(s._$Co??=[])[e]=h:s._$Cl=h),void 0!==h&&(i=M(t,h._$AS(t,i.values),h,e)),i}class R{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:i},parts:s}=this._$AD,e=(t?.creationScope??l).importNode(i,!0);P.currentNode=e;let h=P.nextNode(),o=0,n=0,r=s[0];for(;void 0!==r;){if(o===r.index){let i;2===r.type?i=new k(h,h.nextSibling,this,t):1===r.type?i=new r.ctor(h,r.name,r.strings,this,t):6===r.type&&(i=new Z(h,this,t)),this._$AV.push(i),r=s[++n]}o!==r?.index&&(h=P.nextNode(),o++)}return P.currentNode=l,e}p(t){let i=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++}}class k{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,i,s,e){this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cv=e?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t?.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=M(this,t,i),a(t)?t===A||null==t||""===t?(this._$AH!==A&&this._$AR(),this._$AH=A):t!==this._$AH&&t!==E&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):d(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==A&&a(this._$AH)?this._$AA.nextSibling.data=t:this.T(l.createTextNode(t)),this._$AH=t}$(t){const{values:i,_$litType$:s}=t,e="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=S.createElement(V(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===e)this._$AH.p(i);else{const t=new R(e,this),s=t.u(this.options);t.p(i),this.T(s),this._$AH=t}}_$AC(t){let i=C.get(t.strings);return void 0===i&&C.set(t.strings,i=new S(t)),i}k(t){u(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const h of t)e===i.length?i.push(s=new k(this.O(c()),this.O(c()),this,this.options)):s=i[e],s._$AI(h),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e)}_$AR(t=this._$AA.nextSibling,s){for(this._$AP?.(!1,!0,s);t!==this._$AB;){const s=i(t).nextSibling;i(t).remove(),t=s}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class H{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,i,s,e,h){this.type=1,this._$AH=A,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=h,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=A}_$AI(t,i=this,s,e){const h=this.strings;let o=!1;if(void 0===h)t=M(this,t,i,0),o=!a(t)||t!==this._$AH&&t!==E,o&&(this._$AH=t);else{const e=t;let n,r;for(t=h[0],n=0;n<h.length-1;n++)r=M(this,e[s+n],i,n),r===E&&(r=this._$AH[n]),o||=!a(r)||r!==this._$AH[n],r===A?t=A:t!==A&&(t+=(r??"")+h[n+1]),this._$AH[n]=r}o&&!e&&this.j(t)}j(t){t===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class I extends H{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===A?void 0:t}}class L extends H{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==A)}}class z extends H{constructor(t,i,s,e,h){super(t,i,s,e,h),this.type=5}_$AI(t,i=this){if((t=M(this,t,i,0)??A)===E)return;const s=this._$AH,e=t===A&&s!==A||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,h=t!==A&&(s===A||e);e&&this.element.removeEventListener(this.name,this,s),h&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class Z{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){M(this,t)}}const j={M:h,P:o,A:n,C:1,L:N,R,D:d,V:M,I:k,H,N:L,U:z,B:I,F:Z},B=t.litHtmlPolyfillSupport;B?.(S,k),(t.litHtmlVersions??=[]).push("3.3.3");const D=(t,i,s)=>{const e=s?.renderBefore??i;let h=e._$litPart$;if(void 0===h){const t=s?.renderBefore??null;e._$litPart$=h=new k(i.insertBefore(c(),t),t,void 0,s??{})}return h._$AI(t),h};
//# sourceMappingURL=lit-html.js.map


/***/ },

/***/ "69fcfee6f64b"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Directive: () => (/* reexport safe */ lit_html_directive_js__WEBPACK_IMPORTED_MODULE_0__.Directive),
/* harmony export */   PartType: () => (/* reexport safe */ lit_html_directive_js__WEBPACK_IMPORTED_MODULE_0__.PartType),
/* harmony export */   directive: () => (/* reexport safe */ lit_html_directive_js__WEBPACK_IMPORTED_MODULE_0__.directive)
/* harmony export */ });
/* harmony import */ var lit_html_directive_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("0e2a9b296d0b");

//# sourceMappingURL=directive.js.map


/***/ },

/***/ "7fcbcc00731e"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createRef: () => (/* reexport safe */ lit_html_directives_ref_js__WEBPACK_IMPORTED_MODULE_0__.createRef),
/* harmony export */   ref: () => (/* reexport safe */ lit_html_directives_ref_js__WEBPACK_IMPORTED_MODULE_0__.ref)
/* harmony export */ });
/* harmony import */ var lit_html_directives_ref_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("59df0b19b37c");

//# sourceMappingURL=ref.js.map


/***/ },

/***/ "fef8077ac919"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CSSResult: () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.CSSResult),
/* harmony export */   LitElement: () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.LitElement),
/* harmony export */   ReactiveElement: () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.ReactiveElement),
/* harmony export */   _$LE: () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__._$LE),
/* harmony export */   _$LH: () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__._$LH),
/* harmony export */   adoptStyles: () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.adoptStyles),
/* harmony export */   css: () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.css),
/* harmony export */   defaultConverter: () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.defaultConverter),
/* harmony export */   getCompatibleStyle: () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.getCompatibleStyle),
/* harmony export */   html: () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.html),
/* harmony export */   isServer: () => (/* reexport safe */ lit_html_is_server_js__WEBPACK_IMPORTED_MODULE_3__.isServer),
/* harmony export */   mathml: () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.mathml),
/* harmony export */   noChange: () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.noChange),
/* harmony export */   notEqual: () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.notEqual),
/* harmony export */   nothing: () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.nothing),
/* harmony export */   render: () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.render),
/* harmony export */   supportsAdoptingStyleSheets: () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.supportsAdoptingStyleSheets),
/* harmony export */   svg: () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.svg),
/* harmony export */   unsafeCSS: () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.unsafeCSS)
/* harmony export */ });
/* harmony import */ var _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ea86f8429d07");
/* harmony import */ var lit_html__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("f550d360fd36");
/* harmony import */ var lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("7ab7aedf3cfc");
/* harmony import */ var lit_html_is_server_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("15e6f5e928bf");

//# sourceMappingURL=index.js.map


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
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SUPPORTED_PORT_VERSIONS: () => (/* binding */ SUPPORTED_PORT_VERSIONS),
/* harmony export */   SfPropertyView: () => (/* binding */ SfPropertyView)
/* harmony export */ });
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("0845ef25b9de");
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("8489d1f5bab4");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("edced5685745");
/* harmony import */ var _component_clipboard_js_index__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("ff6757f5dacf");
// One object's fields, shown and edited. The pair to sf-data-view: that one is a
// set of records in any layout, this one is a single object -- a storage record,
// a related record, site settings, a profile. Named for the property rather than
// for the record because nothing in it knows what kind of object is behind a
// field; the renderer set it draws through is addressed by a property type, and a
// name saying `record` would narrow the component below its own contents.
//
// The host owns values, revisions, rights and addresses. This element owns the
// arrangement on screen and nothing else: it stores no value and no revision of
// its own, and every change leaves through the port.
//
// It renders into its own light DOM, like every other Smart component. The first
// version used a shadow root, and the field controls inside it came out with
// their markup and none of their CSS: a document stylesheet does not cross a
// shadow boundary. sf-data-view avoids this by slotting its children and says so
// beside the slot. A consumer found it on their stand.


 // The Framework's own copy, with its fallback for a browser that refuses the
// clipboard API. Asking navigator.clipboard directly meant one copy worked and
// another did not depending on the page it was on, which is two behaviours for
// one act.

 // Every port version this composite accepts, in one place, the way sf-data-view
// keeps its list -- a guard naming a narrower set than the published versions is
// a component refusing a host it asked to move. The contract test beside this
// file compares the list with the manifest.

const SUPPORTED_PORT_VERSIONS = ["1.0.0", "1.1.0", "1.2.0", "1.3.0", "1.4.0", "1.5.0", "1.6.0", "1.7.0", "1.8.0", "1.9.0", "1.10.0"]; // Every panel open on the page, in the order they were opened. A stack is not one
// state held for several records: each window is its own element with its own
// record, its own open group and its own unsaved changes -- which is what «такое
// же представление поверх» means, and what leaves a half-edited window intact
// underneath the one above it. What the Framework owns is the behaviour between
// them: which window Esc closes, which are dimmed, how far each is inset so the
// one below stays partly visible. That needs no shared state beyond the order.
// The same query sf-drawer docks on, written the same way so a reader grepping
// 48rem finds both. The Framework's own breakpoint array has no 48rem step -- its
// nearest is md at 720px -- but the panel *is* a drawer, and flipping the panel's
// arrangement 48px away from where the drawer changes its own behaviour would be
// visible in that gap. The split between the breakpoint array and the pixel values
// components use is reported rather than settled here.

const WIDE_MEDIA_QUERY = "(min-width: 48rem)"; // The column the list of sections takes. It is here rather than in the
// stylesheet because the panel's own width is computed from it, and the drawer
// that carries the panel is placed outside this component's subtree: a custom
// property declared on the element never reaches it. The stylesheet reads this
// through `--sf-property-view--sections-width`, which the component passes to
// the panel and sets on the layout it draws in place.

const SECTIONS_WIDTH = "14rem"; // How long the copy control shows its tick. The Framework's own clipboard holds
// its tick for this long, and two controls that say «copied» for two different
// lengths are two conventions where there is one act.

const COPY_FEEDBACK_MS = 5000;
const openPanels = [];

function topPanel() {
  return openPanels[openPanels.length - 1] ?? null;
}

function restackPanels() {
  openPanels.forEach((panel, index) => {
    panel.setAttribute("data-stack-depth", String(index));
    panel.toggleAttribute("data-stack-top", panel === topPanel());
    panel.requestComponentUpdate("stack");
  });
} // A payload is copied so that a host cannot mutate what the component still
// holds. Copying it through JSON destroys anything that is not plain data, and
// the upload intent carries a File: it arrived at the host as an empty object,
// so its name was undefined, the host's own size check never matched, and a file
// it would have refused was accepted instead. Found by a probe asserting that
// what arrives is a File, which is the only reason it was not shipped.
//
// So the plain parts are copied and anything that is not plain is passed by
// reference. The protection was always about data; a File is not data the
// component can own a second copy of.


const isPlain = value => value === null || ["string", "number", "boolean", "undefined"].includes(typeof value) || typeof value === "object" && (Array.isArray(value) || value.constructor === Object);

const copy = value => {
  if (value == null) return value;
  if (typeof value !== "object" || !isPlain(value)) return value;
  if (Array.isArray(value)) return value.map(item => copy(item));
  return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, copy(item)]));
}; // The Framework speaks English by default and Russian on a Russian page, as
// src/core/js/page-language states for every component. This composite
// carried Russian defaults instead, so an English page drew a panel entirely
// in Russian -- beside an sf-color inside it that followed the rule and said
// «inherited». A product still overrides any of these by attribute.


const PROPERTY_VIEW_TEXT = {
  en: {
    emptyText: "not filled in",
    emptyRecordText: "This record has nothing to show",
    editText: "edit",
    saveText: "Save",
    cancelText: "Cancel",
    deleteText: "Delete",
    changedText: "Fields changed",
    errorsText: "Errors",
    conflictText: "The record changed; read it again",
    sectionsLabel: "Sections",
    closeLabel: "Close",
    statePortNotConnected: "The record port is not connected",
    stateLoadFailed: "The record could not be read",
    stateLoading: "Reading the record",
    stateUnavailable: "The record is unavailable",
    saveFailedText: "The save failed",
    viewSaveFailedText: "The view could not be saved",
    viewResetFailedText: "The view could not be reset",
    copyLinkLabel: "Copy link",
    linkCopiedLabel: "Link copied",
    openFullLabel: "Open as a page",
    configureText: "Arrange the view",
    doneConfiguringText: "Done",
    resetViewText: "Reset",
    resetViewAskText: "Reset the whole view?",
    cancelConfiguringText: "Cancel",
    personalLayerText: "Personal",
    addViewText: "Add a view",
    newViewText: "New view",
    deleteViewText: "Remove the view",
    lastSharedViewText: "The only view everyone has",
    viewProfileLabel: "View",
    sharedLayerText: "Everyone's",
    widthText: "Full width",
    fieldLabelText: "Name",
    sectionIconText: "Section glyph",
    variantText: "Template",
    hintText: "Hint",
    hiddenText: "Hide",
    configureHintText: "Drag fields between groups and onto a section on the left. Applied at once.",
    configureHintNarrowText: "Drag fields between groups. Applied at once.",
    fieldSettingsText: "Field settings",
    shownText: "Shown",
    showRareText: "Show rare fields",
    hideRareText: "Hide rare fields",
    rareText: "rare",
    unplacedTitle: "Not placed",
    moveUpText: "Move up",
    moveDownText: "Move down",
    addFieldText: "Add a field",
    inThisGroupText: "In this area",
    renameText: "Rename",
    saveNameText: "Save the name",
    cancelNameText: "Leave the name",
    removeFieldText: "Remove from this area",
    removeGroupText: "Remove this area",
    removeSectionText: "Remove this section",
    addGroupText: "Add an area",
    addSectionText: "Add a section",
    newGroupTitle: "New area",
    newSectionTitle: "New section",
    noMatchText: "Nothing matches",
    unplacedHintText: "Fields this view does not show. Drag one into a group to place it, or drag a field here to take it out.",
    viewConflictText: "The view changed and was read again",
    viewDeniedText: "You may not change this layer",
    backLabel: "Back",
    favouriteLabel: "Favourite",
    menuLabel: "More",
    inheritedText: "by default"
  },
  ru: {
    emptyText: "не заполнено",
    emptyRecordText: "В этой записи нечего показать",
    editText: "изменить",
    saveText: "Сохранить",
    cancelText: "Отменить",
    deleteText: "Удалить",
    changedText: "Изменено полей",
    errorsText: "Ошибок",
    conflictText: "Запись изменилась, обновите её",
    sectionsLabel: "Разделы",
    closeLabel: "Закрыть",
    statePortNotConnected: "Порт записи не подключён",
    stateLoadFailed: "Не удалось загрузить запись",
    stateLoading: "Загрузка записи",
    stateUnavailable: "Запись недоступна",
    saveFailedText: "Не удалось сохранить",
    viewSaveFailedText: "Не удалось сохранить вид",
    viewResetFailedText: "Не удалось сбросить вид",
    copyLinkLabel: "Копировать ссылку",
    linkCopiedLabel: "Ссылка скопирована",
    openFullLabel: "Открыть на всю страницу",
    configureText: "Настроить вид",
    doneConfiguringText: "Готово",
    resetViewText: "Сбросить",
    resetViewAskText: "Сбросить весь вид?",
    cancelConfiguringText: "Отменить",
    personalLayerText: "Персональный",
    addViewText: "Добавить вид",
    newViewText: "Новый вид",
    deleteViewText: "Удалить вид",
    lastSharedViewText: "Единственный общий вид",
    viewProfileLabel: "Вид",
    sharedLayerText: "Для всех",
    widthText: "На всю ширину",
    fieldLabelText: "Название",
    sectionIconText: "Значок раздела",
    variantText: "Вид",
    hintText: "Подсказка",
    hiddenText: "Скрыть",
    configureHintText: "Перетаскивайте поля между группами и на разделы слева. Применяется сразу.",
    configureHintNarrowText: "Перетаскивайте поля между группами. Применяется сразу.",
    fieldSettingsText: "Настройки поля",
    shownText: "Показывать",
    showRareText: "Показать редкие поля",
    hideRareText: "Скрыть редкие поля",
    rareText: "редкое",
    unplacedTitle: "Не размещённые",
    moveUpText: "Выше",
    moveDownText: "Ниже",
    addFieldText: "Добавить поле",
    inThisGroupText: "В этой области",
    renameText: "Переименовать",
    saveNameText: "Сохранить название",
    cancelNameText: "Оставить название",
    removeFieldText: "Убрать из области",
    removeGroupText: "Удалить область",
    removeSectionText: "Удалить раздел",
    addGroupText: "Добавить область",
    addSectionText: "Добавить раздел",
    newGroupTitle: "Новая область",
    newSectionTitle: "Новый раздел",
    noMatchText: "Ничего не найдено",
    unplacedHintText: "Поля, которых нет в этом виде. Перетащите поле в группу, чтобы разместить, или сюда, чтобы убрать.",
    viewConflictText: "Вид изменился, он перезагружен",
    viewDeniedText: "Нет права менять этот слой",
    backLabel: "Назад",
    favouriteLabel: "В избранное",
    menuLabel: "Ещё",
    inheritedText: "по умолчанию"
  }
};
const SECTION_ICONS = Object.freeze(["folder", "folder_open", "topic", "home", "dashboard", "apartment", "store", "storefront", "business_center", "work", "badge", "person", "group", "groups", "account_circle", "manage_accounts", "supervisor_account", "contacts", "school", "menu_book", "assignment", "task", "description", "article", "note_alt", "edit_note", "draft", "receipt", "receipt_long", "request_quote", "inventory_2", "category", "label", "sell", "local_offer", "shopping_cart", "shopping_bag", "payments", "savings", "credit_card", "account_balance", "calculate", "percent", "trending_up", "analytics", "insights", "monitoring", "bar_chart", "pie_chart", "table_chart", "schedule", "event", "today", "calendar_month", "date_range", "history", "alarm", "timer", "update", "hourglass_top", "mail", "outgoing_mail", "chat", "forum", "sms", "call", "phone_in_talk", "contact_support", "campaign", "notifications", "language", "public", "place", "map", "location_on", "travel_explore", "flight", "local_shipping", "route", "directions", "settings", "tune", "build", "construction", "handyman", "code", "terminal", "data_object", "api", "bug_report", "database", "storage", "cloud", "backup", "sync", "folder_zip", "upload_file", "download", "attach_file", "link", "lock", "lock_open", "shield", "verified_user", "key", "admin_panel_settings", "policy", "gavel", "fingerprint", "visibility", "palette", "format_paint", "image", "photo_library", "collections", "movie", "play_circle", "mic", "headphones", "brush"]);

class SfPropertyView extends _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__["default"] {
  static get props() {
    return {
      templateName: {
        attribute: "template",
        default: "default"
      },
      recordId: {
        attribute: "record-id",
        default: ""
      },
      collection: {
        default: ""
      },
      showRare: {
        attribute: "show-rare",
        type: Boolean,
        default: false
      },
      emptyText: {
        attribute: "empty-text",
        default: "not filled in"
      },
      emptyRecordText: {
        attribute: "empty-record-text",
        default: "This record has nothing to show"
      },
      editText: {
        attribute: "edit-text",
        default: "edit"
      },
      saveText: {
        attribute: "save-text",
        default: "Save"
      },
      cancelText: {
        attribute: "cancel-text",
        default: "Cancel"
      },
      deleteText: {
        attribute: "delete-text",
        default: "Delete"
      },
      changedText: {
        attribute: "changed-text",
        default: "Fields changed"
      },
      errorsText: {
        attribute: "errors-text",
        default: "Errors"
      },
      conflictText: {
        attribute: "conflict-text",
        default: "The record changed; read it again"
      },
      sectionsLabel: {
        attribute: "sections-label",
        default: "Sections"
      },
      // How the sections are laid out. A list beside the groups is right
      // for a settings screen with many of them; a row of tabs is right
      // for a record with a few, and is what the mockup drew first.
      sectionsAs: {
        attribute: "sections-as",
        default: "list",
        values: ["list", "tabs"]
      },
      panel: {
        type: Boolean,
        default: false
      },
      panelSize: {
        attribute: "panel-size",
        default: "1",
        values: ["1/2", "1", "2", "full"]
      },
      panelLabel: {
        attribute: "panel-label",
        default: ""
      },
      panelWidth: {
        attribute: "panel-width",
        default: ""
      },
      closeLabel: {
        attribute: "close-label",
        default: "Close"
      },
      copyLinkLabel: {
        attribute: "copy-link-label",
        default: "Copy link"
      },
      linkCopiedLabel: {
        attribute: "link-copied-label",
        default: "Link copied"
      },
      openFullLabel: {
        attribute: "open-full-label",
        default: "Open as a page"
      },
      configureText: {
        attribute: "configure-text",
        default: "Arrange the view"
      },
      doneConfiguringText: {
        attribute: "done-configuring-text",
        default: "Done"
      },
      resetViewText: {
        attribute: "reset-view-text",
        default: "Reset"
      },
      resetViewAskText: {
        attribute: "reset-view-ask-text",
        default: "Reset the whole view?"
      },
      cancelConfiguringText: {
        attribute: "cancel-configuring-text",
        default: "Cancel"
      },
      personalLayerText: {
        attribute: "personal-layer-text",
        default: "Personal"
      },
      viewProfileLabel: {
        attribute: "view-profile-label",
        default: "View"
      },
      addViewText: {
        attribute: "add-view-text",
        default: "Add a view"
      },
      newViewText: {
        attribute: "new-view-text",
        default: "New view"
      },
      deleteViewText: {
        attribute: "delete-view-text",
        default: "Remove the view"
      },
      lastSharedViewText: {
        attribute: "last-shared-view-text",
        default: "The only view everyone has"
      },
      sharedLayerText: {
        attribute: "shared-layer-text",
        default: "Everyone's"
      },
      widthText: {
        attribute: "width-text",
        default: "Full width"
      },
      fieldLabelText: {
        attribute: "field-label-text",
        default: "Name"
      },
      sectionIconText: {
        attribute: "section-icon-text",
        default: "Section glyph"
      },
      sectionIcons: {
        attribute: "section-icons",
        default: ""
      },
      variantText: {
        attribute: "variant-text",
        default: "Template"
      },
      hintText: {
        attribute: "hint-text",
        default: "Hint"
      },
      hiddenText: {
        attribute: "hidden-text",
        default: "Hide"
      },
      configureHintText: {
        attribute: "configure-hint-text",
        default: "Drag fields between groups and onto a section on the left. Applied at once."
      },
      configureHintNarrowText: {
        attribute: "configure-hint-narrow-text",
        default: "Drag fields between groups. Applied at once."
      },
      fieldSettingsText: {
        attribute: "field-settings-text",
        default: "Field settings"
      },
      shownText: {
        attribute: "shown-text",
        default: "Shown"
      },
      showRareText: {
        attribute: "show-rare-text",
        default: "Show rare fields"
      },
      hideRareText: {
        attribute: "hide-rare-text",
        default: "Hide rare fields"
      },
      rareText: {
        attribute: "rare-text",
        default: "rare"
      },
      unplacedTitle: {
        attribute: "unplaced-title",
        default: "Not placed"
      },
      moveUpText: {
        attribute: "move-up-text",
        default: "Move up"
      },
      moveDownText: {
        attribute: "move-down-text",
        default: "Move down"
      },
      addFieldText: {
        attribute: "add-field-text",
        default: "Add a field"
      },
      inThisGroupText: {
        attribute: "in-this-group-text",
        default: "In this area"
      },
      renameText: {
        attribute: "rename-text",
        default: "Rename"
      },
      saveNameText: {
        attribute: "save-name-text",
        default: "Save the name"
      },
      cancelNameText: {
        attribute: "cancel-name-text",
        default: "Leave the name"
      },
      removeFieldText: {
        attribute: "remove-field-text",
        default: "Remove from this area"
      },
      removeGroupText: {
        attribute: "remove-group-text",
        default: "Remove this area"
      },
      removeSectionText: {
        attribute: "remove-section-text",
        default: "Remove this section"
      },
      addGroupText: {
        attribute: "add-group-text",
        default: "Add an area"
      },
      addSectionText: {
        attribute: "add-section-text",
        default: "Add a section"
      },
      newGroupTitle: {
        attribute: "new-group-title",
        default: "New area"
      },
      newSectionTitle: {
        attribute: "new-section-title",
        default: "New section"
      },
      noMatchText: {
        attribute: "no-match-text",
        default: "Nothing matches"
      },
      unplacedHintText: {
        attribute: "unplaced-hint-text",
        default: "Fields this view does not show. Drag one into a group to place it, or drag a field here to take it out."
      },
      viewConflictText: {
        attribute: "view-conflict-text",
        default: "The view changed and was read again"
      },
      viewDeniedText: {
        attribute: "view-denied-text",
        default: "You may not change this layer"
      },
      backLabel: {
        attribute: "back-label",
        default: "Back"
      },
      collectionLabel: {
        attribute: "collection-label",
        default: ""
      },
      collectionIcon: {
        attribute: "collection-icon",
        default: ""
      },
      favourite: {
        type: Boolean,
        default: false
      },
      favouriteLabel: {
        attribute: "favourite-label",
        default: "Favourite"
      },
      menuLabel: {
        attribute: "menu-label",
        default: "More"
      },
      inheritedText: {
        attribute: "inherited-text",
        default: "by default"
      }
    };
  }

  constructor() {
    super();
    this.hostPort = null; // What the host last answered with, held for rendering only. Never written
    // to and never the source of a save: a save sends the fields the person
    // changed against the revision the host gave, and the host answers with
    // the object as it now is.

    this.record = null;
    this.sections = [];
    this.selectedSection = null; // Which name is being typed, while it is being typed. A rename is not
    // written until it is confirmed, so an area keeps its name while a
    // person is still deciding on another.

    this.renaming = null; // What the arrangement was when the mode was entered, and whether a
    // reset has been asked for and is waiting to be confirmed.

    this.arrangementEntered = null;
    this.resetAsked = false;
    this.epoch = 0;
    this.message = ""; // Which group is open, and what has been changed in it. Only changed
    // fields are held: a save carries what was touched and nothing else, so it
    // cannot overwrite a field somebody else saved meanwhile.

    this.editing = null;
    this.changed = new Map();
    this.errors = new Map();
    this.conflict = null; // Candidate records for a reference field, per field: the page the host
    // last answered with and the search it was answered for. Held for
    // rendering only, and dropped when the search changes -- a page is not the
    // whole set, so keeping pages across searches would show stale matches.

    this.optionPages = new Map();
    this.optionSearches = new Map(); // One counter per field, because every reference field in a group is read
    // at the same moment and a single counter kept only the last answer.

    this.optionEpochs = new Map(); // Files in flight, per field, in the shape sf-file-upload reads. The host
    // stores them and reports what it reports; the component times nothing,
    // because a progress bar over a transfer it does not perform would be a
    // bar that lies.

    this.uploads = new Map(); // How the arrangement resolved and what this person may change about it,
    // as the host stated it. Absent means the view cannot be configured, and
    // no control that would lead there is drawn.

    this.view = null;
    this.configuring = false; // True while this component opened the not-placed bin for a drag, so it
    // can close it again and leave a bin the person opened alone.

    this._openedForDrag = false;
    this.viewTarget = "personal"; // The layer being edited, as a working copy of what the host sent for it.
    // A layer carries only the entries it decides; the component edits that
    // and writes it back, rather than writing the whole resolved arrangement
    // into it -- a personal layer restating every entry would pin the view and
    // stop any later change to the shared layer from showing through.

    this.layerDraft = null;
    this.entryErrors = new Map(); // One counter for the view writes, for the same reason the field options
    // have one each: an answer that arrives after the next write began is not
    // about the arrangement on screen.

    this.viewEpoch = 0; // Wide until something says otherwise: a first render that assumed a phone
    // would draw the narrow arrangement on a desktop for one frame.

    this.wide = true;
    this.wideMedia = null; // On a phone the sections are a list and a section is the next screen.
    // Null is the list; a key is that section's screen.

    this.phoneSection = null;
  } // Declaring a prop does not create an accessor for it: `static get props()`
  // tells the template context and the manifest what the component takes, and
  // every component writes the getters it reads itself. Without these,
  // `this.recordId` and `this.collection` were undefined and both intents went
  // to the host with a null record, `this.showRare` was undefined so a rare
  // group never appeared, and `this.conflictText` was undefined so a conflict
  // with no message of its own said nothing at all. Found by the probe; the
  // same family as the raw-props work in the other Framework session, from the
  // other side of the same assumption.


  get recordId() {
    return this.getAttribute("record-id") || "";
  }

  get collection() {
    return this.getAttribute("collection") || "";
  }

  get showRare() {
    return this.getBooleanAttr("show-rare", false);
  } // A record the host answered with and that holds nothing visible is a state
  // of its own: without a word for it the panel is an empty box that reads as
  // something still loading.


  get emptyRecordText() {
    return this.getAttribute("empty-record-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PROPERTY_VIEW_TEXT, "emptyRecordText", this);
  }

  get isEmptyRecord() {
    if (!this.record) return false;
    const sections = this.sections ?? [];
    if (!sections.length) return true;
    return !sections.some(section => (section.groups ?? []).some(group => group.kind === "related" || (group.fields ?? []).length > 0));
  }

  get emptyText() {
    return this.getAttribute("empty-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PROPERTY_VIEW_TEXT, "emptyText", this);
  }

  get editText() {
    return this.getAttribute("edit-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PROPERTY_VIEW_TEXT, "editText", this);
  }

  get saveText() {
    return this.getAttribute("save-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PROPERTY_VIEW_TEXT, "saveText", this);
  }

  get cancelText() {
    return this.getAttribute("cancel-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PROPERTY_VIEW_TEXT, "cancelText", this);
  }

  get deleteText() {
    return this.getAttribute("delete-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PROPERTY_VIEW_TEXT, "deleteText", this);
  } // What the host allows on the record itself, as it allows it per row in a
  // data view. The component offers nothing the host did not name: a delete
  // the host would refuse is a control that exists to fail.
  // Fields the collection has that this view places in no group. They are not
  // hidden: hiding keeps a field where it is and dims it, while these are out
  // of the arrangement altogether, and only the arranging mode draws them.


  get unplaced() {
    const fields = this.record?.unplaced;
    return Array.isArray(fields) ? fields : [];
  } // Taking a field out of every group, and putting one back. A field out of
  // the arrangement is the layer saying its group is nothing, which is what
  // the port means by a null group.


  moveFieldToUnplaced(fieldKey, index) {
    if (!this.configuring || !this.layerDraft) return false;
    let moved = null;
    let fromGroup = null;

    for (const section of this.sections) {
      for (const group of section.groups ?? []) {
        const at = (group.fields ?? []).findIndex(field => String(field.key) === String(fieldKey));

        if (at >= 0) {
          fromGroup = group;
          [moved] = group.fields.splice(at, 1);
          break;
        }
      }

      if (moved) break;
    }

    if (!moved) return false;
    const into = this.record.unplaced ?? (this.record.unplaced = []);
    const at = Math.max(0, Math.min(Number.isInteger(index) ? index : into.length, into.length));
    into.splice(at, 0, moved);

    this._writeOrder(this.layerDraft.fields, into, {
      group: null
    });

    if (fromGroup) this._writeOrder(this.layerDraft.fields, fromGroup.fields ?? [], {
      group: String(fromGroup.key)
    });
    this.requestComponentUpdate("view-move");
    return this.saveView();
  }

  get recordActions() {
    const actions = this.record?.actions;
    return Array.isArray(actions) ? actions.map(action => String(action)) : [];
  } // Deleting is the host's, including whether to ask first. The component says
  // it was asked for and closes when the host says it is done; a host that
  // refuses sends its reason and the panel stays open with it on screen.


  async deleteRecord() {
    if (!this.recordActions.includes("record.delete")) return false;
    const answer = await this._raise("record.delete", {
      record_id: this.recordId || null,
      collection: this.collection || null,
      revision: this.record?.revision ?? null
    });
    this.dispatchEvent(new CustomEvent("sf-property-view-delete-record", {
      bubbles: true,
      composed: true,
      detail: {
        record_id: this.recordId || null,
        collection: this.collection || null,
        revision: this.record?.revision ?? null,
        answer: answer?.answer ?? null
      }
    }));
    if (!answer) return false;

    if (answer.answer === "applied") {
      this.closePanel("deleted");
      return true;
    }

    this.message = answer.message || answer.reason || this.viewDeniedText;

    this._setState("ready");

    this.requestComponentUpdate("delete-refused");
    return false;
  }

  get changedText() {
    return this.getAttribute("changed-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PROPERTY_VIEW_TEXT, "changedText", this);
  }

  get errorsText() {
    return this.getAttribute("errors-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PROPERTY_VIEW_TEXT, "errorsText", this);
  }

  get conflictText() {
    return this.getAttribute("conflict-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PROPERTY_VIEW_TEXT, "conflictText", this);
  }

  get sectionsAs() {
    return this.getEnumAttr("sections-as", ["list", "tabs"], "list");
  }

  get sectionsLabel() {
    return this.getAttribute("sections-label") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PROPERTY_VIEW_TEXT, "sectionsLabel", this);
  }

  get panel() {
    return this.getBooleanAttr("panel", false);
  }

  get panelSize() {
    return this.getAttribute("panel-size") || "1";
  }

  get panelLabel() {
    return this.getAttribute("panel-label") || "";
  }

  get panelWidth() {
    return this.getAttribute("panel-width") || "";
  } // What the drawer is told to be. `size` is a ladder and its widest step short
  // of full measured 391px on a consumer's screen, which is too narrow for two
  // columns -- labels wrapped and a record title broke over three lines. `width`
  // is a declared input on sf-drawer, so a consumer can ask for 40rem and get
  // it. A deeper window in the stack is a step narrower than whatever the base
  // is, so the one below shows along its leading edge.
  // The width a consumer asked for, and nothing else. A stacked panel used to be
  // narrowed from it here, by a step this component counted itself -- interim
  // work while sf-drawer had no way to express a stack. It does now: the drawer
  // insets each window by depth times `stack-offset` and keeps its width, so a
  // stack four deep no longer ends in a sliver. The two interim mechanisms this
  // replaced had drifted apart from each other as well -- the width subtracted a
  // space-5 step while the panel margin drew a space-4 one, so the window moved
  // one distance and shrank by another.
  //
  // A section list is added to the panel rather than taken out of it (owner,
  // 2026-10-07): the fields keep the width the consumer asked for and the
  // window grows by the column beside them. Taken out, a 40rem panel showing
  // sections gave its fields 26rem and the two-column arrangement collapsed --
  // the same record looked narrower for having more in it.


  get drawerWidth() {
    const width = this.panelWidth;
    if (!width) return null;
    if (!this.wide || this.sectionsAs !== "list") return width; // The rail is drawn while the view is arranged even with one section,
    // because that is where a second one is made.

    if ((this.sections ?? []).length < 2 && !this.configuring) return width;
    return `calc(${width} + ${SECTIONS_WIDTH} + var(--sf-space-4))`;
  }

  get closeLabel() {
    return this.getAttribute("close-label") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PROPERTY_VIEW_TEXT, "closeLabel", this);
  }

  get linkCopiedLabel() {
    return this.getAttribute("link-copied-label") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PROPERTY_VIEW_TEXT, "linkCopiedLabel", this);
  }

  get copyLinkLabel() {
    return this.getAttribute("copy-link-label") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PROPERTY_VIEW_TEXT, "copyLinkLabel", this);
  }

  get configureText() {
    return this.getAttribute("configure-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PROPERTY_VIEW_TEXT, "configureText", this);
  }

  get resetViewAskText() {
    return this.getAttribute("reset-view-ask-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PROPERTY_VIEW_TEXT, "resetViewAskText", this);
  }

  get cancelConfiguringText() {
    return this.getAttribute("cancel-configuring-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PROPERTY_VIEW_TEXT, "cancelConfiguringText", this);
  }

  get doneConfiguringText() {
    return this.getAttribute("done-configuring-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PROPERTY_VIEW_TEXT, "doneConfiguringText", this);
  }

  get resetViewText() {
    return this.getAttribute("reset-view-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PROPERTY_VIEW_TEXT, "resetViewText", this);
  }

  get addViewText() {
    return this.getAttribute("add-view-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PROPERTY_VIEW_TEXT, "addViewText", this);
  }

  get newViewText() {
    return this.getAttribute("new-view-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PROPERTY_VIEW_TEXT, "newViewText", this);
  }

  get deleteViewText() {
    return this.getAttribute("delete-view-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PROPERTY_VIEW_TEXT, "deleteViewText", this);
  }

  get lastSharedViewText() {
    return this.getAttribute("last-shared-view-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PROPERTY_VIEW_TEXT, "lastSharedViewText", this);
  }

  get viewProfileLabel() {
    return this.getAttribute("view-profile-label") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PROPERTY_VIEW_TEXT, "viewProfileLabel", this);
  }

  get personalLayerText() {
    return this.getAttribute("personal-layer-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PROPERTY_VIEW_TEXT, "personalLayerText", this);
  }

  get sharedLayerText() {
    return this.getAttribute("shared-layer-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PROPERTY_VIEW_TEXT, "sharedLayerText", this);
  }

  get widthText() {
    return this.getAttribute("width-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PROPERTY_VIEW_TEXT, "widthText", this);
  }

  get variantText() {
    return this.getAttribute("variant-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PROPERTY_VIEW_TEXT, "variantText", this);
  }

  get hintText() {
    return this.getAttribute("hint-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PROPERTY_VIEW_TEXT, "hintText", this);
  }

  get hiddenText() {
    return this.getAttribute("hidden-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PROPERTY_VIEW_TEXT, "hiddenText", this);
  }

  get configureHintText() {
    return this.getAttribute("configure-hint-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PROPERTY_VIEW_TEXT, "configureHintText", this);
  } // On a narrow panel the section list is a screen of its own, so a field has
  // nowhere beside the fields to be dropped. The wide sentence names the list
  // on the left, and saying that where there is no list promises something a
  // person cannot do.


  get configureHintNarrowText() {
    return this.getAttribute("configure-hint-narrow-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PROPERTY_VIEW_TEXT, "configureHintNarrowText", this);
  }

  get fieldSettingsText() {
    return this.getAttribute("field-settings-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PROPERTY_VIEW_TEXT, "fieldSettingsText", this);
  }

  get shownText() {
    return this.getAttribute("shown-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PROPERTY_VIEW_TEXT, "shownText", this);
  }

  get showRareText() {
    return this.getAttribute("show-rare-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PROPERTY_VIEW_TEXT, "showRareText", this);
  }

  get hideRareText() {
    return this.getAttribute("hide-rare-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PROPERTY_VIEW_TEXT, "hideRareText", this);
  }

  get rareText() {
    return this.getAttribute("rare-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PROPERTY_VIEW_TEXT, "rareText", this);
  }

  get unplacedTitle() {
    return this.getAttribute("unplaced-title") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PROPERTY_VIEW_TEXT, "unplacedTitle", this);
  }

  get moveUpText() {
    return this.getAttribute("move-up-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PROPERTY_VIEW_TEXT, "moveUpText", this);
  }

  get moveDownText() {
    return this.getAttribute("move-down-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PROPERTY_VIEW_TEXT, "moveDownText", this);
  }

  get addFieldText() {
    return this.getAttribute("add-field-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PROPERTY_VIEW_TEXT, "addFieldText", this);
  }

  get renameText() {
    return this.getAttribute("rename-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PROPERTY_VIEW_TEXT, "renameText", this);
  }

  get saveNameText() {
    return this.getAttribute("save-name-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PROPERTY_VIEW_TEXT, "saveNameText", this);
  }

  get cancelNameText() {
    return this.getAttribute("cancel-name-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PROPERTY_VIEW_TEXT, "cancelNameText", this);
  }

  get removeFieldText() {
    return this.getAttribute("remove-field-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PROPERTY_VIEW_TEXT, "removeFieldText", this);
  }

  get removeGroupText() {
    return this.getAttribute("remove-group-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PROPERTY_VIEW_TEXT, "removeGroupText", this);
  }

  get removeSectionText() {
    return this.getAttribute("remove-section-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PROPERTY_VIEW_TEXT, "removeSectionText", this);
  }

  get addGroupText() {
    return this.getAttribute("add-group-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PROPERTY_VIEW_TEXT, "addGroupText", this);
  }

  get addSectionText() {
    return this.getAttribute("add-section-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PROPERTY_VIEW_TEXT, "addSectionText", this);
  }

  get newGroupTitle() {
    return this.getAttribute("new-group-title") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PROPERTY_VIEW_TEXT, "newGroupTitle", this);
  }

  get newSectionTitle() {
    return this.getAttribute("new-section-title") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PROPERTY_VIEW_TEXT, "newSectionTitle", this);
  }

  get sectionIconText() {
    return this.getAttribute("section-icon-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PROPERTY_VIEW_TEXT, "sectionIconText", this);
  }

  get fieldLabelText() {
    return this.getAttribute("field-label-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PROPERTY_VIEW_TEXT, "fieldLabelText", this);
  }

  get inThisGroupText() {
    return this.getAttribute("in-this-group-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PROPERTY_VIEW_TEXT, "inThisGroupText", this);
  }

  get noMatchText() {
    return this.getAttribute("no-match-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PROPERTY_VIEW_TEXT, "noMatchText", this);
  } // Where a group stands among the groups a person can see, and how many there
  // are, so the control that moves it knows when it has nowhere to go.


  get currentGroups() {
    const section = (this.sections ?? []).find(part => String(part.key) === this.selectedSection) ?? (this.sections ?? [])[0] ?? null;
    return section?.groups ?? [];
  }

  groupAt(groupKey) {
    return this.currentGroups.findIndex(group => String(group.key) === String(groupKey));
  }

  get groupCount() {
    return this.currentGroups.length;
  } // Moving a group one step, for a person who would rather press than drag --
  // and for anyone who cannot drag at all.


  moveGroupBy(groupKey, step) {
    const at = this.groupAt(groupKey);
    if (at < 0) return false;
    const to = at + step;
    if (to < 0 || to >= this.groupCount) return false;
    const section = (this.sections ?? []).find(part => String(part.key) === this.selectedSection) ?? (this.sections ?? [])[0] ?? null;
    if (!section) return false;
    return this.moveGroup(groupKey, String(section.key), to);
  } // Every field this group could hold, with the ones it holds already marked.
  // A collection can have hundreds, so what a person needs is to find one and
  // tick it -- and the ticked set is exactly what this area shows, which makes
  // unticking the way a field leaves it.
  //
  // Where a field lives now is said once, as a heading over the stretch of
  // list that comes from there, rather than after every name in it: written
  // into the row, the area's name was repeated on every line and pushed the
  // name it mattered for off the end.
  //
  // The order and the headings are a snapshot taken when the list opens.
  // Ticking a field moves it into this area, so a live grouping would move the
  // row out from under the pointer at the moment it was pressed -- and a list
  // that rearranges itself as you tick is a list nobody can tick twice.


  fieldChoices(groupKey) {
    const key = String(groupKey);
    const session = this._addSession?.group === key ? this._addSession : this._buildAddSession(key);
    const here = new Set();

    for (const field of this._locateGroup(key)?.group?.fields ?? []) here.add(String(field.key));

    const search = this.addSearch.trim().toLowerCase();
    const options = [];

    for (const entry of session.order) {
      if (search && !entry.label.toLowerCase().includes(search) && !entry.key.toLowerCase().includes(search)) continue;
      options.push({ ...entry,
        selected: here.has(entry.key)
      });
    }

    return options;
  }

  _buildAddSession(groupKey) {
    const key = String(groupKey);
    const order = [];
    const seen = new Set();

    const take = (field, from) => {
      const fieldKey = String(field.key);
      if (seen.has(fieldKey)) return;
      seen.add(fieldKey);
      order.push({
        key: fieldKey,
        label: String(field.label ?? field.key),
        group: from
      });
    };

    for (const field of this._locateGroup(key)?.group?.fields ?? []) take(field, this.inThisGroupText);

    for (const field of this.unplaced ?? []) take(field, this.unplacedTitle);

    for (const section of this.sections ?? []) {
      for (const group of section.groups ?? []) {
        if (String(group.key) === key || group.kind === "related") continue;
        const from = String(group.label ?? group.key);

        for (const field of group.fields ?? []) take(field, from);
      }
    }

    return {
      group: key,
      order
    };
  } // The list opens on a snapshot of where every field is, and forgets it when
  // it closes, so the next opening is read against what the arrangement became.


  startAddSession(groupKey) {
    this._addSearch = "";
    this._addSession = this._buildAddSession(groupKey);
    this.requestComponentUpdate("add-session");
    return this._addSession;
  }

  endAddSession() {
    this._addSession = null;
    this._addSearch = "";
    this.requestComponentUpdate("add-session");
  }

  get addSearch() {
    return this._addSearch ?? "";
  }

  setAddSearch(value) {
    this._addSearch = String(value ?? "");
    this.requestComponentUpdate("add-search");
    return this._addSearch;
  } // Ticking places the field here; unticking takes it out of every area, which
  // is where a field goes when it belongs to none.


  toggleFieldInGroup(fieldKey, groupKey, wanted) {
    return wanted ? this.moveField(fieldKey, groupKey, Number.MAX_SAFE_INTEGER) : this.moveFieldToUnplaced(fieldKey);
  }

  get unplacedHintText() {
    return this.getAttribute("unplaced-hint-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PROPERTY_VIEW_TEXT, "unplacedHintText", this);
  }

  get viewConflictText() {
    return this.getAttribute("view-conflict-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PROPERTY_VIEW_TEXT, "viewConflictText", this);
  } // The head's own words. The port carries a collection *key* and no record
  // title, icon or favourite state, and the port is fixed at 1.7.0 for this
  // work -- so these are the component's inputs, set by the host the way
  // `panel-label` and `panel-width` already are, rather than a port change.


  get collectionLabel() {
    return this.getAttribute("collection-label") || "";
  }

  get collectionIcon() {
    return this.getAttribute("collection-icon") || "";
  }

  get favourite() {
    return this.hasAttribute("favourite");
  }

  get favouriteLabel() {
    return this.getAttribute("favourite-label") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PROPERTY_VIEW_TEXT, "favouriteLabel", this);
  }

  get menuLabel() {
    return this.getAttribute("menu-label") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PROPERTY_VIEW_TEXT, "menuLabel", this);
  } // What a value inherited from somewhere else is marked with. The prototype
  // writes «по умолчанию» beside it, so a person can see that the record has not
  // decided this and that changing the source will change it here.


  get inheritedText() {
    return this.getAttribute("inherited-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PROPERTY_VIEW_TEXT, "inheritedText", this);
  } // The star answers the press at once and reports it. Storing a favourite is
  // the host's, and a host that refuses sets the attribute back -- but a star
  // that does nothing until an answer arrives reads as a control that is
  // broken, which is what it read as on the stand.


  toggleFavourite() {
    const next = !this.favourite;
    this.toggleAttribute("favourite", next);
    this.requestComponentUpdate("favourite");
    this.dispatchEvent(new CustomEvent("sf-property-view-favourite", {
      bubbles: true,
      composed: true,
      detail: {
        record_id: this.recordId || null,
        collection: this.collection || null,
        favourite: next
      }
    }));
    return true;
  } // The «⋯» menu: what belongs to the view rather than to the record. Configure
  // and reset live here, as the mockup has them, so the panel head carries one
  // control instead of a row of words.


  get panelMenuItems() {
    const items = [];

    if (this.canConfigureView && !this.configuring) {
      items.push({
        id: "configure",
        name: this.configureText,
        icon: "tune"
      });
    } // Resetting is not offered here while the view is being arranged: the
    // bar at the foot carries «Сбросить» with a confirmation beside the
    // other two answers, and the same act behind a «⋯» as well is the same
    // destruction reachable two ways, one of them quietly (owner,
    // 2026-10-08).


    if (this.hasRare) {
      items.push({
        id: "show-rare",
        name: this.showRare ? this.hideRareText : this.showRareText,
        icon: this.showRare ? "unfold_less" : "unfold_more"
      });
    }

    return items;
  }

  chooseMenuItem(id) {
    if (id === "configure") return this.startConfiguringView();
    if (id === "reset") return this.resetView();
    if (id === "show-rare") return this.toggleShowRare();
    return false;
  }

  get backLabel() {
    return this.getAttribute("back-label") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PROPERTY_VIEW_TEXT, "backLabel", this);
  }

  get viewDeniedText() {
    return this.getAttribute("view-denied-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PROPERTY_VIEW_TEXT, "viewDeniedText", this);
  }

  get openFullLabel() {
    return this.getAttribute("open-full-label") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PROPERTY_VIEW_TEXT, "openFullLabel", this);
  } // Where this object lives, as the host named it when it answered. Never
  // constructed here: a composite that built a URL would be guessing at the
  // consumer's routing.


  get address() {
    return this.record?.address ?? null;
  } // Opening the record as a page is the host's, and so is whether there is a
  // page at all: an address worth copying does not promise one. Drawn on the
  // address alone, the control stood in every panel and did nothing in the
  // hosts that route no further.


  get canOpenFullPage() {
    return Boolean(this.address) && Boolean(this.hostPort?.capabilities?.includes?.("record-open"));
  }

  static get observedAttributes() {
    return [...(super.observedAttributes ?? []), "record-id"];
  }

  attributeChangedCallback(name, previous, next) {
    super.attributeChangedCallback?.(name, previous, next);
    if (previous === next || !this.isConnected) return;
    if (name === "record-id") this.load("record-id-changed");
  }

  onConnected() {
    super.onConnected?.();

    if (this.panel && !openPanels.includes(this)) {
      openPanels.push(this);
      restackPanels();
    } // The drawer's own close-on-esc is off, because in a stack Esc must close
    // the top window and not every one of them.
    //
    // The listener is on the document rather than on the element, and that is
    // not a preference: sf-drawer portals its content out, so an open panel is
    // not a descendant of this element at all. On the element the handler
    // would never have fired from a real keypress -- only from an event
    // dispatched at the element itself, which is exactly what the first probe
    // did, so it passed while the feature did not work.
    //
    // It acts only when the focus is inside this panel, or when nothing is
    // focused. With a stack the top window is the one holding focus, so the
    // same rule closes the right window then too.


    this._onKeyDown = event => {
      if (event.key !== "Escape" || !this.panel) return; // A surface opened inside this panel takes the press. Both listen on
      // the document in capture, where stopPropagation cannot reach a
      // listener on the same node, so the one that opened last says so on
      // the root and this one stands back.

      if (document.documentElement.dataset.sfPopoverOpen) return; // An open field-settings surface takes the first Esc. Both handlers
      // sit on the document in capture, where stopPropagation does not
      // reach a listener on the same node -- so the two share one.
      // The top window, and no other. The first version guessed from where
      // the focus happened to be, which was the best a single panel could
      // do; with the order known the guess is gone.

      if (topPanel() !== this) return;
      event.stopPropagation();
      this.closePanel("escape");
    };

    document.addEventListener("keydown", this._onKeyDown, true); // The drop is sf-sortable's to report and the component's to apply or
    // refuse -- that is the seam the mechanism already publishes, so no drag
    // is implemented here. The lists name themselves `field:<group>` and
    // `group:<section>`, which is what `to` carries.

    this._onSortableIntent = event => {
      if (!this.configuring) return;
      const detail = event.detail ?? {};
      const [kind, container] = String(detail.to ?? "").split(":");
      if (!container) return;
      if (kind === "section") this.moveSection(detail.item, detail.index);else if (kind === "field") this.moveField(detail.item, container, detail.index);else if (kind === "group") this.moveGroup(detail.item, container, detail.index);else if (kind === "unplaced") this.moveFieldToUnplaced(detail.item, detail.index);
    };

    this.addEventListener("sf-sortable-intent", this._onSortableIntent); // A panel is portalled out of this element, so an intent raised inside one
    // never bubbles to it. The document listener catches those, and checks the
    // list belongs to this record before acting -- two stacked panels are two
    // components, and the wrong one applying the move would rearrange a view
    // nobody was looking at.

    this._onDocumentSortableIntent = event => {
      if (!this.panel || !this.configuring) return;
      const panel = event.target?.closest?.(".sf-property-view-panel");
      if (!panel || panel.getAttribute("data-record-id") !== String(this.recordId)) return;

      this._onSortableIntent(event);
    };

    document.addEventListener("sf-sortable-intent", this._onDocumentSortableIntent); // The not-placed bin is an accordion, closed by default, and a drop
    // target nobody can see is a drop target nobody uses. So a drag opens
    // it -- by pressing its trigger, the way a person would, because the
    // accordion owns whether it is open and a second controller would
    // fight it. It is pressed back when the drag ends, and only if this is
    // what opened it: a person who opened it themselves keeps it open
    // (owner, 2026-10-09).

    this._onSortableState = event => {
      if (!this.configuring) return;
      const state = event.detail?.state; // The panel is portalled out of this element, so it is reached the
      // way the sortable intents are reached: by the record it carries.
      // `this.panel` is not an element and querying it found nothing,
      // which is why the bin stayed shut through a whole drag.

      const panel = globalThis.document?.querySelector?.(`.sf-property-view-panel[data-record-id="${this.recordId}"]`);
      const trigger = panel?.querySelector?.('[data-action="toggle-unplaced"]');
      if (!trigger) return;
      const open = trigger.getAttribute("aria-expanded") === "true";

      if (state === "picked") {
        this._openedForDrag = !open;
        if (!open) trigger.click();
        return;
      }

      if (state !== "dropped" && state !== "cancelled") return;
      if (this._openedForDrag && trigger.getAttribute("aria-expanded") === "true") trigger.click();
      this._openedForDrag = false;
    };

    document.addEventListener("sf-sortable-state", this._onSortableState);
    this.wideMedia = typeof globalThis.matchMedia === "function" ? globalThis.matchMedia(WIDE_MEDIA_QUERY) : null;
    this.wide = this.wideMedia ? this.wideMedia.matches : true;

    this._onWideChange = event => {
      this.wide = event.matches; // Leaving the phone arrangement leaves its navigation behind: a section
      // screen is a phone idea, and keeping the state would show a desktop a
      // single section with a back arrow and no way to see the others.

      if (this.wide) this.phoneSection = null;
      this.requestComponentUpdate("viewport");
    };

    this.wideMedia?.addEventListener?.("change", this._onWideChange);
    if (this.hostPort) this.load("connected");else this._requestHostPort();
  } // The shared convention for a component that takes a host port: ask for one
  // rather than wait to be given it, so a consumer composing this inside
  // something else does not have to find the element and call a method on it.
  // Once per connection and only while there is no port; `setHostPort` answers,
  // at once or later. The same event every such component raises, so a host
  // answers them all the same way.


  _requestHostPort() {
    if (this.hostPort || this._portRequested) return false;
    this._portRequested = true;
    this.dispatchEvent(new CustomEvent("sf-host-port-request", {
      bubbles: true,
      composed: true,
      detail: {
        component: this,
        context: {
          owner: "property-view",
          record: this.recordId || null,
          group: null
        }
      }
    }));
    return true;
  }

  onDisconnected() {
    // Once per connection, so an element moved in the DOM asks again.
    this._portRequested = false;
    const at = openPanels.indexOf(this);

    if (at >= 0) {
      openPanels.splice(at, 1);
      restackPanels();
    }

    if (this._onKeyDown) document.removeEventListener("keydown", this._onKeyDown, true);
    this._onKeyDown = null; // The settings surface listens on the document, so a panel that goes away
    // while it is open takes that listener with it.

    this.configuring = false;

    this._bindSectionDropTarget();

    if (this._onSortableIntent) this.removeEventListener("sf-sortable-intent", this._onSortableIntent);
    this._onSortableIntent = null; // A document listener outliving its component would go on applying drops
    // and writing a layer for a record nobody has open.

    if (this._onDocumentSortableIntent) {
      document.removeEventListener("sf-sortable-intent", this._onDocumentSortableIntent);
    }

    if (this._onSortableState) {
      document.removeEventListener("sf-sortable-state", this._onSortableState);
    }

    this._onDocumentSortableIntent = null;
    if (this._onWideChange) this.wideMedia?.removeEventListener?.("change", this._onWideChange);
    this._onWideChange = null;
    this.wideMedia = null;
    super.onDisconnected?.();
  } // Where this panel's content actually lives. The drawer moves it out of the
  // element, so anything looking for the panel -- a key handler, a probe, a
  // stack deciding which window is on top -- has to ask rather than assume.


  panelContent() {
    const drawer = this.querySelector("sf-drawer") ?? this._panelDrawer ?? null;
    const inside = drawer?.querySelector?.(".sf-property-view-panel");
    if (inside) return inside;
    const instance = this.getAttribute("record-id") || "";
    const candidates = [...document.querySelectorAll(".sf-property-view-panel")];
    return candidates.find(node => node.dataset.recordId === instance) ?? null;
  } // A host adapter exposes raise(intent, payload, {signal}); no transport is
  // implied, exactly as for sf-data-view.


  setHostPort(host) {
    if (!host || typeof host.raise !== "function" || !SUPPORTED_PORT_VERSIONS.includes(host.version)) {
      throw new TypeError(`sf-property-view requires a declared property-view host port: ${SUPPORTED_PORT_VERSIONS.join(", ")}`);
    }

    this.hostPort = host;
    if (this.isConnected) this.load("host-connected");
    return this;
  }

  visible(entries) {
    return (Array.isArray(entries) ? entries : []).filter(entry => entry && entry.hidden !== true).filter(entry => this.showRare || entry.rare !== true);
  }

  templateContext() {
    const props = this.getPropsContext();
    return this.createTemplateContext({ ...props,
      component: this,
      hostPort: this.hostPort,
      emptyText: this.emptyText,
      emptyRecordText: this.emptyRecordText,
      isEmptyRecord: this.isEmptyRecord,
      editText: this.editText,
      saveText: this.saveText,
      cancelText: this.cancelText,
      deleteText: this.deleteText,
      recordActions: this.recordActions,
      changedText: this.changedText,
      errorsText: this.errorsText,
      sectionsLabel: this.sectionsLabel,
      sectionsAs: this.sectionsAs,
      sections: this.sections,
      selectedSection: this.selectedSection,
      editing: this.editing,
      changed: this.changed,
      errors: this.errors,
      canPickRecords: this.canPickRecords,
      canUploadFiles: this.canUploadFiles,
      // The base captures the host's slot content in connectedCallback,
      // before the first render, and returns live nodes by reference -- so a
      // consumer's listeners and open state survive every render. A second
      // mechanism was written here and deleted: it collected in onConnected,
      // which runs after lit has rendered into the element and cleared the
      // host's children, so it collected nothing at all.
      hostSlot: name => this.getSlotContent(name),
      hasHostSlot: name => this.hasSlotContent(name),
      address: this.address,
      stackDepth: this.stackDepth,
      drawerWidth: this.drawerWidth,
      sectionsWidth: SECTIONS_WIDTH,
      isTopPanel: this.isTopPanel,
      conflict: this.conflict,
      message: this.message,
      visible: entries => this.visible(entries),
      canConfigureView: this.canConfigureView,
      configuring: this.configuring,
      unplaced: this.unplaced,
      viewTarget: this.viewTarget,
      editableLayers: this.editableLayers,
      viewProfiles: this.viewProfiles,
      viewProfile: this.viewProfile,
      canDeleteViewProfile: id => this.canDeleteViewProfile(id),
      layerDenied: kind => this.layerDenied(kind),
      canChangeVisibility: entry => this.canChangeVisibility(entry),
      entryError: (kind, key) => this.entryError(kind, key),
      configureText: this.configureText,
      doneConfiguringText: this.doneConfiguringText,
      resetViewText: this.resetViewText,
      resetViewAskText: this.resetViewAskText,
      cancelConfiguringText: this.cancelConfiguringText,
      resetAsked: this.resetAsked,
      personalLayerText: this.personalLayerText,
      viewProfileLabel: this.viewProfileLabel,
      addViewText: this.addViewText,
      newViewText: this.newViewText,
      deleteViewText: this.deleteViewText,
      lastSharedViewText: this.lastSharedViewText,
      sharedLayerText: this.sharedLayerText,
      widthText: this.widthText,
      fieldLabelText: this.fieldLabelText,
      sectionIcons: this.sectionIcons,
      sectionIconChoices: this.sectionIconChoices,
      sectionIconText: this.sectionIconText,
      variantText: this.variantText,
      hintText: this.hintText,
      hiddenText: this.hiddenText,
      configureHintText: this.wide ? this.configureHintText : this.configureHintNarrowText,
      fieldSettingsText: this.fieldSettingsText,
      shownText: this.shownText,
      showRareText: this.showRareText,
      hideRareText: this.hideRareText,
      rareText: this.rareText,
      unplacedTitle: this.unplacedTitle,
      moveUpText: this.moveUpText,
      moveDownText: this.moveDownText,
      addFieldText: this.addFieldText,
      canOpenFullPage: this.canOpenFullPage,
      groupAt: groupKey => this.groupAt(groupKey),
      groupCount: this.groupCount,
      fieldChoices: groupKey => this.fieldChoices(groupKey),
      addSearch: this.addSearch,
      inThisGroupText: this.inThisGroupText,
      renameText: this.renameText,
      saveNameText: this.saveNameText,
      cancelNameText: this.cancelNameText,
      removeFieldText: this.removeFieldText,
      removeGroupText: this.removeGroupText,
      removeSectionText: this.removeSectionText,
      addGroupText: this.addGroupText,
      addSectionText: this.addSectionText,
      newGroupTitle: this.newGroupTitle,
      newSectionTitle: this.newSectionTitle,
      renaming: this.renaming,
      noMatchText: this.noMatchText,
      unplacedHintText: this.unplacedHintText,
      panelMenuItems: this.panelMenuItems,
      collectionLabel: this.collectionLabel,
      collectionIcon: this.collectionIcon,
      favourite: this.favourite,
      favouriteLabel: this.favouriteLabel,
      menuLabel: this.menuLabel,
      addressCopied: this.addressCopied,
      linkCopiedLabel: this.linkCopiedLabel,
      // The three the head draws beside those, which were not here. Every
      // label the panel shows is resolved by a getter that reads the
      // page's language; a label left out of this context falls through
      // to the declared default instead, which is English. So on a
      // Russian page the panel's head read «В избранное», «Ещё» and
      // «Ссылка скопирована» beside «Close», «Copy link» and «Open as a
      // page» -- one header in two languages. `linkCopiedLabel` being
      // here while `copyLinkLabel` was not is the shape of a line added
      // one at a time (owner, 2026-10-10, on the admin polygon).
      closeLabel: this.closeLabel,
      copyLinkLabel: this.copyLinkLabel,
      openFullLabel: this.openFullLabel,
      inheritedText: this.inheritedText,
      wide: this.wide,
      phoneSection: this.phoneSection,
      phoneSectionLabel: this.phoneSectionLabel,
      backLabel: this.backLabel
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_2__.renderPropertyViewTemplate)(this.templateContext());
  }

  _setState(state, message = "") {
    this.setAttribute("data-state", state);
    this.setAttribute("aria-busy", state === "loading" ? "true" : "false");
    this.message = message;
    this.requestComponentUpdate("state");
    this.dispatchEvent(new CustomEvent("sf-property-view-state", {
      bubbles: true,
      composed: true,
      detail: {
        state,
        message
      }
    }));
  } // Whether an answer still describes something on screen is the caller's
  // question, not this method's. One counter for every intent was wrong the
  // moment two reads could be in flight at once: opening a group asks for the
  // candidates of every reference field in it in the same tick, each ask bumped
  // the one counter, and only the last answer was kept -- the others were
  // dropped and their fields sat at «Загрузка записей» for ever. A consumer
  // found it with four reference fields in one group; the probe had one, and one
  // is a number at which concurrency does not exist.


  async _raise(intent, payload, {
    stale = () => false
  } = {}) {
    if (!this.hostPort) {
      this._setState("error", (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PROPERTY_VIEW_TEXT, "statePortNotConnected", this));

      return {
        answer: "unavailable",
        reason: "port-not-connected"
      };
    }

    try {
      const answer = await this.hostPort.raise(intent, copy(payload), {}); // A late answer is dropped rather than rendered: what it describes is
      // not what is on screen any more.

      if (!this.isConnected || stale()) return null;

      if (!answer || !["applied", "conflict", "refused", "unavailable"].includes(answer.answer)) {
        throw new TypeError("Host answer is not a declared port answer");
      }

      return answer;
    } catch (error) {
      if (!this.isConnected || stale()) return null;

      this._setState("error", (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PROPERTY_VIEW_TEXT, "stateLoadFailed", this));

      return {
        answer: "unavailable",
        reason: "host-threw",
        message: String(error?.message || error)
      };
    }
  }

  async load(reason = "requested") {
    this._setState("loading", (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PROPERTY_VIEW_TEXT, "stateLoading", this));

    const epoch = ++this.epoch;
    const answer = await this._raise("record.load", {
      record_id: this.recordId || null,
      collection: this.collection || null,
      reason
    }, {
      stale: () => epoch !== this.epoch
    });
    if (!answer) return null;

    if (answer.answer !== "applied") {
      this._setState("error", answer.message || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PROPERTY_VIEW_TEXT, "stateUnavailable", this));

      return answer;
    }

    this.record = answer.record ?? null; // Copied, not held by reference. Configuring moves a field between groups
    // in this array before the host answers -- «applied immediately» is what
    // the request asks for -- and a component that did that to the object the
    // host handed it would be rearranging the host's own data. A host that
    // caches its answer would find its record silently rewritten by a drag it
    // had not accepted yet.

    this.sections = Array.isArray(answer.record?.sections) ? copy(answer.record.sections) : [];
    this.view = answer.record?.view ?? null; // A target the person may no longer write cannot stay selected: the rights
    // travel with the answer, so they can change between two loads.

    const editable = this.editableLayers;
    if (!editable.includes(this.viewTarget)) this.viewTarget = editable[0] ?? "personal";
    if (!editable.length) this.configuring = false;
    this.layerDraft = this.configuring ? this._layerCopy(this.viewTarget) : null;
    this.entryErrors = new Map();
    const known = this.sections.some(section => String(section.key) === this.selectedSection);
    if (!known) this.selectedSection = this.sections.length ? String(this.sections[0].key) : null;

    this._setState("ready");

    return answer;
  } // The two the file editor asks of a host, and the capability that decides
  // whether the editor exists at all. Without it a file field shows what it
  // already holds, read-only -- the same arrangement as the record picker.


  get canUploadFiles() {
    return Boolean(this.hostPort?.capabilities?.includes("field-upload"));
  }

  getFieldUploads(field) {
    return this.uploads.get(String(field.key ?? "")) ?? [];
  }

  async startFieldUpload(field, items) {
    const key = String(field.key ?? "");
    const chosen = Array.isArray(items) ? items : [];
    if (!chosen.length) return null; // Recorded before anything is sent, because the component is the only
    // thing that knows what the person chose: sf-file-upload fills its own
    // list and every render writes this one over it.

    this.uploads.set(key, [...this.getFieldUploads(field), ...chosen]);
    this.requestComponentUpdate("uploads");

    for (const item of chosen) {
      const answer = await this._raise("field.upload", {
        record_id: this.recordId || null,
        collection: this.collection || null,
        field: key,
        file: item.file ?? item
      }, {
        stale: () => !this.uploads.has(key)
      });
      if (!answer) return null;
      const current = this.getFieldUploads(field);

      if (answer.answer === "applied" && answer.file) {
        // A stored file is a value change like any other: it joins what
        // the person has changed and waits for the save button. Nothing
        // about the record is written here.
        const held = this.changed.has(key) ? this.changed.get(key) : field.value;
        const list = Array.isArray(held) ? held : held ? [held] : [];
        this.changed.set(key, [...list, answer.file]);
        this.uploads.set(key, current.filter(entry => entry !== item));
        this.errors.delete(key);
      } else {
        this.uploads.set(key, current.map(entry => entry === item ? { ...entry,
          state: "error",
          errorMessage: answer.message || answer.reason || ""
        } : entry));

        if (answer.answer === "refused" && answer.reason) {
          this.errors.set(key, String(answer.message || answer.reason));
        }
      }

      this.requestComponentUpdate("uploads");
    }

    return this;
  }

  retryFieldUpload(field, index) {
    const key = String(field.key ?? "");
    const current = this.getFieldUploads(field);
    const item = current[Number(index)];
    if (!item) return null;
    this.uploads.set(key, current.filter(entry => entry !== item));
    return this.startFieldUpload(field, [item]);
  } // A reference value was activated. The component asks and decides nothing:
  // following the href would be routing for the consumer, and opening a window
  // itself would be deciding whether a half-edited window may be covered.


  async openReference(field, value) {
    if (!value || typeof value !== "object") return null;
    const answer = await this._raise("record.open", {
      record_id: this.recordId || null,
      collection: this.collection || null,
      field: String(field.key ?? ""),
      value
    }, {
      stale: () => !this.isConnected
    });
    this.dispatchEvent(new CustomEvent("sf-property-view-open-record", {
      bubbles: true,
      composed: true,
      detail: {
        field: String(field.key ?? ""),
        value,
        answer: answer?.answer ?? null
      }
    }));
    return answer;
  }

  get stackDepth() {
    const at = openPanels.indexOf(this);
    return at < 0 ? 0 : at;
  }

  get isTopPanel() {
    return topPanel() === this;
  } // What a panel's three controls do, and all three are the host's decisions
  // announced rather than carried out here. The component closes itself, says
  // what was copied, and says what should be opened; where a window goes, and
  // whether it may close over unsaved edits, belongs to whoever placed it.


  closePanel(reason = "close") {
    const unsaved = this.changed.size;
    this.dispatchEvent(new CustomEvent("sf-property-view-close", {
      bubbles: true,
      composed: true,
      detail: {
        reason,
        record_id: this.recordId || null,
        unsaved_fields: unsaved
      }
    }));
    return this;
  } // What a person pastes is a page they can open, so the host's address is
  // resolved against the page it is read on (owner, 2026-10-08). The event
  // still carries the host's own address, because that is what the host knows
  // the record by.


  get addressUrl() {
    const address = this.address;
    if (!address) return null;

    try {
      return new URL(String(address), globalThis.location?.href).href;
    } catch {
      return String(address);
    }
  } // Copying says nothing by itself, so the control says it: the glyph becomes
  // a tick for as long as the Framework's own clipboard holds its tick, and
  // goes back on its own. Held here rather than in the template, because the
  // template is redrawn from this state (owner, 2026-10-08).


  get addressCopied() {
    return this._addressCopied === true;
  }

  _showAddressCopied() {
    window.clearTimeout(this._addressCopiedTimer);
    this._addressCopied = true;
    this.requestComponentUpdate("address-copied");
    this._addressCopiedTimer = window.setTimeout(() => {
      this._addressCopied = false;
      this.requestComponentUpdate("address-copied-done");
    }, COPY_FEEDBACK_MS);
    return this;
  }

  async copyAddress() {
    const address = this.address;
    if (!address) return null;
    const url = this.addressUrl ?? address;
    let copied = false;

    try {
      await (0,_component_clipboard_js_index__WEBPACK_IMPORTED_MODULE_3__.writeText)(url);
      copied = true;
    } catch {
      // A clipboard a browser refuses is not an error worth a red state: the
      // event carries the address either way, so a host can offer its own
      // way of copying. Saying «copied» when nothing was would be worse.
      copied = false;
    }

    if (copied) this._showAddressCopied();
    this.dispatchEvent(new CustomEvent("sf-property-view-address-copy", {
      bubbles: true,
      composed: true,
      detail: {
        address,
        url,
        copied,
        record_id: this.recordId || null
      }
    }));
    return copied;
  }

  openFullPage() {
    const address = this.address;
    if (!address) return null; // An intent, not a navigation: the component does not know whether the
    // consumer routes by href, by a client router or by replacing a region.

    this.dispatchEvent(new CustomEvent("sf-property-view-open-full", {
      bubbles: true,
      composed: true,
      detail: {
        address,
        record_id: this.recordId || null
      }
    }));
    return this;
  } // The phone's two screens. Opening a section also selects it, so leaving the
  // phone arrangement lands on the section the person was last reading rather
  // than on the first one.


  openPhoneSection(key) {
    const name = String(key);
    if (!this.sections.some(section => String(section.key) === name)) return false;
    this.phoneSection = name;
    this.selectSection(name);
    this.requestComponentUpdate("phone-section");
    return true;
  }

  closePhoneSection() {
    if (this.phoneSection === null) return false;
    this.phoneSection = null;
    this.requestComponentUpdate("phone-section");
    return true;
  }

  get phoneSectionLabel() {
    const current = this.sections.find(section => String(section.key) === this.phoneSection);
    return current ? String(current.label ?? current.key) : "";
  }

  selectSection(key) {
    this.selectedSection = String(key);
    this.requestComponentUpdate("section");
    return this;
  } // The four the edit template asks for when it builds a record picker. The
  // picker renders only when a host can serve candidates; without them the
  // template returns nothing and the field falls back to its value read-only,
  // which is what a 1.0.0 host gets.


  get canPickRecords() {
    return Boolean(this.hostPort?.capabilities?.includes("field-options"));
  }

  getFieldOptionsPage(field) {
    return this.optionPages.get(String(field.key ?? "")) ?? null;
  }

  getFieldOptionSearch(field) {
    return this.optionSearches.get(String(field.key ?? "")) ?? "";
  }

  setFieldOptionSearch(field, text) {
    this.optionSearches.set(String(field.key ?? ""), String(text ?? ""));
    return this;
  }

  async loadFieldOptions(field, {
    cursor = null,
    search = "",
    quiet = false
  } = {}) {
    const key = String(field.key ?? "");
    const previous = this.optionPages.get(key); // A new search starts a new list; a cursor continues the one on screen.

    const items = cursor && Array.isArray(previous?.items) ? previous.items : []; // `quiet` is the page the group asks for as it opens. It is not announced,
    // because a consumer saw «Загрузка записей» standing under four closed
    // fields at once; an error always is.

    this.optionPages.set(key, {
      items,
      status: "loading",
      quiet,
      nextCursor: previous?.nextCursor ?? null
    });
    this.requestComponentUpdate("options"); // Dropped when the record changes, or when a newer search or page for this
    // same field is in flight -- and not when another field is read.

    const recordEpoch = this.epoch;
    const fieldEpoch = (this.optionEpochs.get(key) ?? 0) + 1;
    this.optionEpochs.set(key, fieldEpoch);
    const answer = await this._raise("field.options", {
      record_id: this.recordId || null,
      collection: this.collection || null,
      field: key,
      cursor,
      search: String(search ?? "")
    }, {
      stale: () => recordEpoch !== this.epoch || fieldEpoch !== this.optionEpochs.get(key)
    });
    if (!answer) return null;

    if (answer.answer !== "applied") {
      // A refusal and an unavailability are different answers and a person
      // can act on only one of them. «Refused» means this field has no
      // candidates to offer -- a relation whose owner package is absent --
      // so a retry would fail for ever and an empty picker over an existing
      // value reads as the value being gone. The field falls back to its
      // value, read-only. «Unavailable» means not now, so the retry stays.
      const refused = answer.answer === "refused";
      this.optionPages.set(key, {
        items,
        status: refused ? "unsupported" : "error",
        quiet: false,
        nextCursor: null
      });
      this.requestComponentUpdate("options");
      return answer;
    }

    const page = answer.options_page ?? {};
    const arrived = Array.isArray(page.items) ? page.items : [];
    this.optionPages.set(key, {
      items: cursor ? [...items, ...arrived] : arrived,
      status: "ready",
      quiet: false,
      // Opaque: sent back exactly as it arrived, never constructed here.
      nextCursor: page.next_cursor ?? null,
      total: page.total ?? null
    });
    this.requestComponentUpdate("options");
    return answer;
  }

  changeField(field, value) {
    const key = String(field.key ?? "");
    this.changed.set(key, value);
    this.errors.delete(key);
    this.requestComponentUpdate("changed");
    return this;
  } // Which fields in a group are picked from a list of records rather than typed.


  _referenceFields(section, group) {
    const current = this.sections.find(entry => String(entry.key) === String(section));
    const found = this.visible(current?.groups).find(entry => String(entry.key) === String(group));
    return this.visible(found?.fields).filter(field => ["record", "relation", "user"].includes(field.propertyType || field.type));
  }

  editGroup(section, group) {
    this.editing = {
      section: String(section),
      group: String(group)
    };
    this.changed.clear();
    this.errors.clear();
    this.conflict = null;
    this.requestComponentUpdate("editing"); // The first page is asked for as the group opens, not when the person
    // first types: a picker that is empty until you search looks broken, and
    // the common case is choosing from the first page without searching at
    // all.

    if (this.canPickRecords) {
      for (const field of this._referenceFields(section, group)) {
        if (!this.optionPages.has(String(field.key ?? ""))) {
          this.loadFieldOptions(field, {
            cursor: null,
            search: "",
            quiet: true
          });
        }
      }
    }

    return this;
  }

  cancelEdit() {
    // Cancel drops what was typed and writes nothing. Data is saved by the
    // button alone, so there is nothing to undo.
    this.editing = null;
    this.changed.clear();
    this.errors.clear();
    this.conflict = null;
    this.requestComponentUpdate("editing");
    return this;
  } // One press, one intent, one revision. Nothing is sent on blur and nothing
  // per field: a save carries the fields the person changed, against the
  // revision the read carried, and the host compares and sets.


  async saveGroup() {
    if (!this.editing || this.changed.size === 0) return null;
    const epoch = ++this.epoch;
    const answer = await this._raise("group.save", {
      record_id: this.recordId || null,
      collection: this.collection || null,
      section: this.editing.section,
      group: this.editing.group,
      values: Object.fromEntries(this.changed),
      revision: this.record?.revision ?? null
    }, {
      stale: () => epoch !== this.epoch
    });
    if (!answer) return null;

    if (answer.answer === "applied") {
      this.record = answer.record ?? this.record;
      this.sections = Array.isArray(answer.record?.sections) ? answer.record.sections : this.sections;
      this.editing = null;
      this.changed.clear();
      this.errors.clear();
      this.conflict = null;

      this._setState("ready");

      return answer;
    }

    if (answer.answer === "conflict") {
      // What the person typed is kept. The object moved underneath them and
      // saying so is the whole point of a conflict; discarding their work to
      // show the newer object would be the component deciding for them.
      this.conflict = answer.message || this.conflictText;
      this.requestComponentUpdate("conflict");
      return answer;
    }

    if (answer.answer === "refused") {
      this.errors = new Map(Object.entries(answer.errors ?? {}).map(([key, value]) => [key, String(value)]));
      this.requestComponentUpdate("errors");
      return answer;
    }

    this._setState("error", answer.message || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PROPERTY_VIEW_TEXT, "saveFailedText", this));

    return answer;
  } // Configuring the view. The host decides three separate things and the
  // component decides none of them: whether a view can be configured at all
  // (the capability), which layers this person may write (`editable`, per
  // person rather than per host, which is why it travels in the answer), and
  // which layer hid a given entry (`hiddenBy`, so the rule that hiding for
  // everyone cannot be undone in a personal view stays in one place).


  get canConfigureView() {
    return Boolean(this.hostPort?.capabilities?.includes?.("view-settings")) && Boolean(this.view) && this.editableLayers.length > 0;
  } // The named views this person may choose between. A view is a whole
  // arrangement with a permanent id -- which is what makes renaming possible
  // -- and the layers still resolve inside whichever one is chosen. Larena
  // had already settled this shape for its lists before the panel needed it,
  // and one idea met twice is worth more than two ideas (owner, 2026-10-09).
  //
  // One view is not a choice, so the component draws no chooser for it.


  get viewProfiles() {
    const profiles = this.view?.profiles;
    if (!Array.isArray(profiles)) return [];
    return profiles.filter(profile => profile && typeof profile.id === "string" && profile.id);
  }

  get viewProfile() {
    const current = this.view?.profile;
    if (typeof current === "string" && current) return current;
    return this.viewProfiles[0]?.id ?? null;
  } // Whether a view may be removed. The last shared one may not: a scope with
  // no shared view has nothing for a person who has made none of their own.
  // The host refuses it too -- it owns the list -- but a control that can
  // only be refused is not offered, which is the same rule the saved-view
  // controls answer to (owner, 2026-10-09).


  canDeleteViewProfile(id) {
    const profiles = this.viewProfiles;
    const profile = profiles.find(item => item.id === String(id ?? ""));
    if (!profile) return false;
    if (!profile.shared) return true;
    return profiles.filter(item => item.shared).length > 1;
  } // Making a view, from what is on screen. The host gives it an id and
  // answers with the record through it, because a person who has just made a
  // view is looking at it.


  createViewProfile(label, {
    shared = false
  } = {}) {
    const name = String(label ?? "").trim();
    if (!name) return null;
    return this._viewProfileIntent("view.create", {
      label: name,
      shared: Boolean(shared),
      view: this.layerDraft ?? this._layerCopy(this.viewTarget)
    });
  } // A rename changes the label. The id is permanent, so anything pointing at
  // the view keeps pointing at it.


  renameViewProfile(id, label) {
    const name = String(label ?? "").trim();
    const profile = String(id ?? "");
    if (!name || !profile) return null;
    if (!this.viewProfiles.some(item => item.id === profile)) return null;
    return this._viewProfileIntent("view.rename", {
      profile,
      label: name
    });
  }

  deleteViewProfile(id) {
    const profile = String(id ?? "");
    if (!this.canDeleteViewProfile(profile)) return null;
    return this._viewProfileIntent("view.delete", {
      profile
    });
  } // The three acts answer the way a read answers, so they are taken the same
  // way: whatever the host sends back is the arrangement from now on.


  async _viewProfileIntent(intent, payload) {
    const epoch = ++this.epoch;
    const answer = await this._raise(intent, {
      record_id: this.recordId || null,
      collection: this.collection || null,
      ...payload
    }, {
      stale: () => epoch !== this.epoch
    });
    if (!answer) return null;

    if (answer.answer !== "applied") {
      this._setState("error", answer.message || this.viewDeniedText);

      return answer;
    }

    this.record = answer.record ?? this.record;
    this.sections = Array.isArray(answer.record?.sections) ? copy(answer.record.sections) : this.sections;
    this.view = answer.record?.view ?? this.view;
    this.layerDraft = this.configuring ? this._layerCopy(this.viewTarget) : null;

    this._setState("ready");

    this.requestComponentUpdate("profiles");
    return answer;
  } // Asking for a different view. The host answers as it answers a read,
  // because reading a record through another arrangement is reading the
  // record. What a person chose is the host's to remember: a choice kept
  // here would live in one browser and vanish in the next, which looks
  // broken rather than absent.


  async selectViewProfile(id) {
    const wanted = String(id ?? "");
    if (!wanted || wanted === this.viewProfile) return null;
    if (!this.viewProfiles.some(profile => profile.id === wanted)) return null;
    const epoch = ++this.epoch;
    const answer = await this._raise("view.profile", {
      record_id: this.recordId || null,
      collection: this.collection || null,
      profile: wanted
    }, {
      stale: () => epoch !== this.epoch
    });
    if (!answer) return null;

    if (answer.answer !== "applied") {
      this._setState("error", answer.message || this.viewDeniedText);

      return answer;
    }

    this.record = answer.record ?? this.record;
    this.sections = Array.isArray(answer.record?.sections) ? copy(answer.record.sections) : this.sections;
    this.view = answer.record?.view ?? this.view;
    this.editing = null;
    this.changed.clear();

    this._setState("ready");

    this.requestComponentUpdate("profile");
    return answer;
  }

  get editableLayers() {
    const editable = this.view?.editable;
    return Array.isArray(editable) ? editable.filter(kind => kind === "personal" || kind === "shared") : [];
  }

  layerDenied(kind) {
    if (this.editableLayers.includes(kind)) return null;
    return this.view?.denied?.[kind] || this.viewDeniedText;
  }

  _emptyLayer() {
    return {
      schema_version: 1,
      sections: {},
      groups: {},
      fields: {}
    };
  }

  _layerCopy(kind) {
    const stored = this.view?.layers?.[kind]?.view;
    return stored ? copy(stored) : this._emptyLayer();
  }

  _layerRevision(kind) {
    const layer = this.view?.layers?.[kind];
    return layer ? layer.revision ?? null : null;
  } // Reading choice, not arrangement: a rare entry is declared rare by whoever
  // owns the collection, and showing it changes no value and writes no layer.
  // It was an attribute only, so nobody short of the host could ever see one.


  toggleShowRare() {
    this.toggleAttribute("show-rare", !this.showRare);
    this.requestComponentUpdate("show-rare");
    return this.showRare;
  } // Whether anything in this record is declared rare. Without one the menu does
  // not offer to show rare entries, because an item that changes nothing reads
  // as a feature that is broken.


  get hasRare() {
    const anyRare = entries => (entries ?? []).some(entry => entry?.rare === true);

    return (this.sections ?? []).some(section => section?.rare === true || anyRare(section?.groups) || (section?.groups ?? []).some(group => anyRare(group?.fields)));
  }

  startConfiguringView() {
    if (!this.canConfigureView) return false;
    this.configuring = true; // What the arrangement was when the mode was entered. Every change in
    // this mode is written at once, so «cancel» can only mean putting back
    // what a person started from -- which is what a person means by it.

    this.arrangementEntered = {
      kind: this.viewTarget,
      view: this._layerCopy(this.viewTarget)
    };
    this.resetAsked = false;
    this.layerDraft = this._layerCopy(this.viewTarget);

    this._bindSectionDropTarget();

    this.entryErrors = new Map();
    this.cancelEdit();
    this.requestComponentUpdate("configuring");
    return true;
  }

  stopConfiguringView() {
    this.configuring = false;

    this._bindSectionDropTarget();

    this.layerDraft = null;
    this.arrangementEntered = null;
    this.resetAsked = false;
    this.entryErrors = new Map();
    this.requestComponentUpdate("configuring");
  } // Leaving the mode with the arrangement a person started from. Not the same
  // as resetting: a reset takes the layer away and lets what lies beneath show
  // through, while this writes back the arrangement that was there when the
  // mode was entered, including one a person had made earlier.


  async cancelConfiguringView() {
    if (!this.configuring) return false;
    const entered = this.arrangementEntered;

    if (!entered || entered.kind !== this.viewTarget) {
      this.stopConfiguringView();
      return true;
    }

    this.layerDraft = copy(entered.view);
    const answer = await this.saveView();
    await this.load("view-cancel");
    this.stopConfiguringView();
    return answer;
  } // A reset asks first. It takes away everything a person arranged in this
  // layer, and a single press of a button next to «done» is too little for
  // that; the button says what it will do and the next press does it.


  askReset() {
    if (!this.configuring) return false;
    this.resetAsked = true;
    this.requestComponentUpdate("reset-ask");
    return true;
  }

  cancelReset() {
    this.resetAsked = false;
    this.requestComponentUpdate("reset-ask");
    return true;
  }

  setViewTarget(kind) {
    if (!this.editableLayers.includes(kind) || kind === this.viewTarget) return false;
    this.viewTarget = kind;
    this.layerDraft = this._layerCopy(kind);
    this.entryErrors = new Map();
    this.requestComponentUpdate("view-target");
    return true;
  } // A hidden entry can be shown again only from the layer that hid it or above
  // it. `package` is above both, `shared` above `personal`, so a personal view
  // cannot reveal what was hidden for everyone -- and the component is told
  // which layer decided rather than working it out.


  canChangeVisibility(entry) {
    const hiddenBy = entry?.hiddenBy ?? null;
    if (!hiddenBy) return true;
    if (hiddenBy === "package") return false;
    if (hiddenBy === "shared") return this.viewTarget === "shared";
    return true;
  }

  entryError(kind, key) {
    return this.entryErrors.get(`${kind}:${key}`) ?? null;
  } // The resolved siblings of a container, in the order they are drawn. The move
  // is computed against what a person sees, not against what the layer stores:
  // a layer is sparse, so the entry being dragged may have no order in it yet.


  _groupsOf(sectionKey) {
    const section = this.sections.find(item => String(item.key) === String(sectionKey));
    return Array.isArray(section?.groups) ? section.groups : [];
  }

  _fieldsOf(groupKey) {
    for (const section of this.sections) {
      for (const group of section.groups ?? []) {
        if (String(group.key) === String(groupKey)) return Array.isArray(group.fields) ? group.fields : [];
      }
    }

    return [];
  }

  _locateGroup(groupKey) {
    for (const section of this.sections) {
      for (const group of section.groups ?? []) {
        if (String(group.key) === String(groupKey)) return {
          section,
          group
        };
      }
    }

    return null;
  } // Dense order for the containers a move touched, and only those. A single
  // sparse order cannot say «between B and C» -- two neighbours may share a
  // number, or have none -- so the layer takes over the order of the one or two
  // containers that changed and leaves every other container resolving as it did.


  _writeOrder(bucket, items, extra = {}) {
    items.forEach((item, index) => {
      const key = String(item.key);
      bucket[key] = { ...(bucket[key] ?? {}),
        ...extra,
        order: index + 1
      };
    });
  } // A field dropped on a section in the list lands in that section's first
  // group that takes fields. A section is not itself a container of fields --
  // a group is -- so something has to choose, and the first group is the one a
  // person sees at the top of the section they aimed at. A section whose only
  // groups are related lists takes nothing, and the drop is refused rather
  // than landing somewhere invisible.


  moveFieldToSection(fieldKey, sectionKey) {
    if (!this.configuring || !this.layerDraft) return false;
    const section = (this.sections ?? []).find(candidate => String(candidate.key) === String(sectionKey));
    if (!section) return false;
    const group = (section.groups ?? []).find(candidate => candidate.kind !== "related");
    if (!group) return false;
    return this.moveField(fieldKey, String(group.key), (group.fields ?? []).length);
  } // The section list is a drop target of its own rather than a sortable list:
  // a list would name the whole column, and a field has to land on one section
  // in it. sf-sortable publishes exactly this seam for a target that is not a
  // list, and it resolves by pointer, so moving a field to another section with
  // the keyboard is still missing.


  _bindSectionDropTarget() {
    if (!this.configuring) {
      this._releaseSectionTarget?.();
      this._releaseSectionTarget = null;
      return;
    }

    if (this._releaseSectionTarget) return;
    const register = globalThis.SF?.Sortable?.registerSortableDropTarget;
    if (typeof register !== "function") return;

    const sectionAt = (x, y) => {
      const under = globalThis.document?.elementFromPoint?.(x, y); // While the view is arranged the sections are rows of their own, so a
      // field may be dropped on a tab the same way it is dropped on a group.

      const item = under?.closest?.("[data-section-tab], sf-tree-item[value]"); // Another panel's list is not this panel's drop target. The drawer
      // moves the content out of the element, so asking `closest` for an
      // sf-property-view finds nothing at all -- which is why the first
      // version of this resolved on no section and a field dropped on the
      // list simply stayed where it was.

      const content = this.panelContent();
      if (!item || !content || !content.contains(item)) return null;
      return item;
    };

    this._releaseSectionTarget = register({
      resolve: (x, y, session) => {
        // A field lands in the section's first group; a whole area moves
        // to the section itself. Anything else is not ours.
        if (session?.group && !["field", "group"].includes(session.group)) return null;
        const item = sectionAt(x, y);
        if (!item) return null;
        const key = item.getAttribute("data-section-tab") ?? item.getAttribute("value");
        if (key === this.selectedSection) return null; // A Smart element is laid out as `display: contents`, so the
        // host's own rect is empty and the indicator would be drawn as a
        // line of no size. The rendered row inside it is what has a shape.

        const shown = item.matches("[data-section-tab]") ? item : item.querySelector(".sf-tree-item-container") || item.firstElementChild || item;
        return {
          descriptor: {
            section: key
          },
          rect: shown.getBoundingClientRect(),
          label: item.getAttribute("label") || item.textContent?.trim() || key
        };
      },
      drop: (session, descriptor) => {
        if (!descriptor?.section) return false;

        if (session?.group === "group") {
          return this.moveGroup(session?.item, descriptor.section, Number.MAX_SAFE_INTEGER);
        }

        return this.moveFieldToSection(session?.item, descriptor.section);
      }
    });
  }

  moveField(fieldKey, toGroupKey, index) {
    if (!this.configuring || !this.layerDraft) return false;

    const target = this._locateGroup(toGroupKey);

    if (!target) return false;
    let moved = null;
    let fromGroup = null;

    for (const section of this.sections) {
      for (const group of section.groups ?? []) {
        const at = (group.fields ?? []).findIndex(field => String(field.key) === String(fieldKey));

        if (at >= 0) {
          fromGroup = group;
          [moved] = group.fields.splice(at, 1);
          break;
        }
      }

      if (moved) break;
    } // A field being placed may be coming back from outside the arrangement
    // rather than from another group.


    let fromUnplaced = false;

    if (!moved) {
      const waiting = this.record?.unplaced ?? [];
      const at = waiting.findIndex(field => String(field.key) === String(fieldKey));

      if (at >= 0) {
        [moved] = waiting.splice(at, 1);
        fromUnplaced = true;
      }
    }

    if (!moved) return false;
    const into = target.group.fields ?? (target.group.fields = []);
    const at = Math.max(0, Math.min(Number.isInteger(index) ? index : into.length, into.length));
    into.splice(at, 0, moved);

    this._writeOrder(this.layerDraft.fields, into, {
      group: String(toGroupKey)
    });

    if (fromUnplaced) {
      this._writeOrder(this.layerDraft.fields, this.record?.unplaced ?? [], {
        group: null
      });
    }

    if (fromGroup && fromGroup !== target.group) {
      this._writeOrder(this.layerDraft.fields, fromGroup.fields ?? [], {
        group: String(fromGroup.key)
      });
    }

    this.requestComponentUpdate("view-move");
    return this.saveView();
  }

  moveGroup(groupKey, toSectionKey, index) {
    if (!this.configuring || !this.layerDraft) return false;
    const target = this.sections.find(item => String(item.key) === String(toSectionKey));
    if (!target) return false;
    let moved = null;
    let fromSection = null;

    for (const section of this.sections) {
      const at = (section.groups ?? []).findIndex(group => String(group.key) === String(groupKey));

      if (at >= 0) {
        fromSection = section;
        [moved] = section.groups.splice(at, 1);
        break;
      }
    }

    if (!moved) return false;
    const into = target.groups ?? (target.groups = []);
    const at = Math.max(0, Math.min(Number.isInteger(index) ? index : into.length, into.length));
    into.splice(at, 0, moved);

    this._writeOrder(this.layerDraft.groups, into, {
      section: String(toSectionKey)
    });

    if (fromSection && fromSection !== target) {
      this._writeOrder(this.layerDraft.groups, fromSection.groups ?? [], {
        section: String(fromSection.key)
      });
    }

    this.requestComponentUpdate("view-move");
    return this.saveView();
  } // Width, template variant and hint, one field at a time. The value is written
  // into the layer and onto the drawn entry together, so the view moves under
  // the person's hand and the layer is what gets stored.


  setFieldView(fieldKey, patch = {}) {
    if (!this.configuring || !this.layerDraft) return false; // `label` is this view's name for the field, the same way a section and
    // an area carry one: the collection keeps its own, and resetting the
    // layer gives it back.

    const allowed = ["width", "variant", "hint", "label"];
    const change = Object.fromEntries(Object.entries(patch).filter(([key]) => allowed.includes(key)));
    if (!Object.keys(change).length) return false;
    const key = String(fieldKey);
    this.layerDraft.fields[key] = { ...(this.layerDraft.fields[key] ?? {}),
      ...change
    };

    for (const section of this.sections) {
      for (const group of section.groups ?? []) {
        for (const field of group.fields ?? []) {
          if (String(field.key) === key) Object.assign(field, change);
        }
      }
    }

    this.requestComponentUpdate("view-field");
    return this.saveView();
  } // The glyphs a section may be marked with. A hundred and twenty names from
  // the Framework's own icon set, the ones products actually reach for, read
  // in rows of what a record's sections are usually about -- what a thing is,
  // who it belongs to, when it happens, what it costs, what it is made of. A
  // host with its own vocabulary passes `section-icons` and this is replaced
  // wholesale rather than added to, because a list nobody chose is a list that
  // grows until it is useless.
  // The input as it was given: a list of glyph names, or nothing for the
  // component's own. A declared input answers with what it was told, so the
  // resolved list is a second question rather than this one's answer.


  get sectionIcons() {
    return this.getAttribute("section-icons") || "";
  }

  get sectionIconChoices() {
    const given = this.sectionIcons;
    if (given) return given.split(/[\s,]+/u).filter(Boolean);
    return SECTION_ICONS;
  } // A section's glyph is this view's, like its name: the layer carries it and
  // resetting the layer gives the host's back.


  setSectionIcon(sectionKey, icon) {
    if (!this.configuring || !this.layerDraft) return false;
    const name = String(sectionKey);
    const section = this.sections.find(part => String(part.key) === name);
    if (!section) return false;
    const next = String(icon ?? "").trim() || null;
    this.layerDraft.sections[name] = { ...(this.layerDraft.sections[name] ?? {}),
      icon: next
    };
    section.icon = next;
    this.requestComponentUpdate("view-section-icon");
    return this.saveView();
  } // Naming what is on screen. A label is the layer's to set -- the port has
  // carried `label` for a section and a group since 1.6.0 -- so renaming is an
  // arrangement, not a change to the collection: what it renames is this
  // view's name for it, and resetting the layer gives the host's name back.


  renameEntry(kind, key, label) {
    if (!this.configuring || !this.layerDraft) return false;
    const buckets = {
      section: "sections",
      group: "groups"
    };
    const bucket = buckets[kind];
    if (!bucket) return false;
    const next = String(label ?? "").trim();
    if (!next) return false;

    const entry = this._findEntry(kind, key);

    if (!entry) return false;
    const name = String(key);
    this.layerDraft[bucket][name] = { ...(this.layerDraft[bucket][name] ?? {}),
      label: next
    };
    entry.label = next;
    this.renaming = null;
    this.requestComponentUpdate("view-rename");
    return this.saveView();
  }

  startRenaming(kind, key) {
    if (!this.configuring) return false;
    this.renaming = {
      kind,
      key: String(key)
    };
    this.requestComponentUpdate("view-rename");
    return true;
  }

  cancelRenaming() {
    this.renaming = null;
    this.requestComponentUpdate("view-rename");
  } // Taking an area out of the view. Its fields are not destroyed with it: they
  // join the unplaced, which is where a field goes when it belongs to no area,
  // so nothing a person put in it is lost by removing the box around it.
  //
  // In the layer an area that is gone is an area that is hidden, because that
  // is what the port has a word for -- the collection still has it, this view
  // does not show it, and resetting the layer brings it back.


  removeGroup(groupKey) {
    if (!this.configuring || !this.layerDraft) return false;

    const target = this._locateGroup(groupKey);

    if (!target || !this.canChangeVisibility(target.group)) return false;

    for (const field of [...(target.group.fields ?? [])]) {
      this.moveFieldToUnplaced(String(field.key));
    }

    const name = String(groupKey);
    this.layerDraft.groups[name] = { ...(this.layerDraft.groups[name] ?? {}),
      hidden: true
    };
    target.group.hidden = true;
    const section = this.sections.find(part => (part.groups ?? []).includes(target.group));
    if (section) section.groups = (section.groups ?? []).filter(group => group !== target.group);
    this.requestComponentUpdate("view-remove-group");
    return this.saveView();
  } // A section is removed the same way, and every area it held goes with it:
  // the areas are kept, moved to the section that remains, so an arrangement
  // is not thrown away by removing the tab it sat behind.


  removeSection(sectionKey) {
    if (!this.configuring || !this.layerDraft) return false;
    const name = String(sectionKey);
    const section = this.sections.find(part => String(part.key) === name);
    if (!section || !this.canChangeVisibility(section)) return false;
    if (this.sections.length < 2) return false;
    const into = this.sections.find(part => part !== section);

    for (const group of [...(section.groups ?? [])]) {
      this.moveGroup(String(group.key), String(into.key), Number.MAX_SAFE_INTEGER);
    }

    this.layerDraft.sections[name] = { ...(this.layerDraft.sections[name] ?? {}),
      hidden: true
    };
    section.hidden = true;
    this.sections = this.sections.filter(part => part !== section);
    if (this.selectedSection === name) this.selectedSection = String(into.key);
    this.requestComponentUpdate("view-remove-section");
    return this.saveView();
  } // The order of the sections, as a drag leaves them. A section is a tab in
  // this arrangement, and a tab nobody can move is an order the host chose
  // once and nobody since.


  moveSection(sectionKey, index) {
    if (!this.configuring || !this.layerDraft) return false;
    const name = String(sectionKey);
    const at = this.sections.findIndex(part => String(part.key) === name);
    if (at < 0) return false;
    const next = [...this.sections];
    const [moved] = next.splice(at, 1);
    const to = Math.max(0, Math.min(Number.isInteger(index) ? index : next.length, next.length));
    next.splice(to, 0, moved);
    if (next.every((part, position) => part === this.sections[position])) return false;
    this.sections = next;

    this._writeOrder(this.layerDraft.sections, this.sections, {});

    this.requestComponentUpdate("view-move-section");
    return this.saveView();
  } // Making a new area, and a new section to hold areas. This is the one act in
  // arranging that does not rearrange what the host sent: it names something
  // the record does not carry yet, and the host decides whether to keep it --
  // the layer write says so, and the area survives the next read only if the
  // host returns it. Until then it is drawn from the layer, so a person sees
  // what they made straight away.


  addGroup(sectionKey) {
    if (!this.configuring || !this.layerDraft) return false;
    const section = this.sections.find(part => String(part.key) === String(sectionKey)) ?? this.sections[0];
    if (!section) return false;

    const key = this._newEntryKey("group");

    const group = {
      key,
      label: this.newGroupTitle,
      columns: 1,
      fields: [],
      hidden: false,
      rare: false,
      editable: true
    };
    section.groups = [...(section.groups ?? []), group];

    this._writeOrder(this.layerDraft.groups, section.groups, {
      section: String(section.key)
    });

    this.layerDraft.groups[key] = { ...(this.layerDraft.groups[key] ?? {}),
      label: group.label,
      section: String(section.key),
      columns: 1,
      hidden: false
    };
    this.renaming = {
      kind: "group",
      key
    };
    this.requestComponentUpdate("view-add-group");
    return this.saveView();
  }

  addSection() {
    if (!this.configuring || !this.layerDraft) return false;

    const key = this._newEntryKey("section");

    const section = {
      key,
      label: this.newSectionTitle,
      groups: [],
      hidden: false,
      rare: false
    };
    this.sections = [...this.sections, section];

    this._writeOrder(this.layerDraft.sections, this.sections, {});

    this.layerDraft.sections[key] = { ...(this.layerDraft.sections[key] ?? {}),
      label: section.label,
      hidden: false
    };
    this.selectedSection = key;
    this.renaming = {
      kind: "section",
      key
    };
    this.requestComponentUpdate("view-add-section");
    return this.saveView();
  } // A key nobody else holds, said in the open so a host reading the layer can
  // tell a key this component made from one of its own.


  _newEntryKey(kind) {
    const stamp = Date.now().toString(36);
    const noise = Math.floor(Math.random() * 46655).toString(36).padStart(3, "0");
    return `view-${kind}-${stamp}${noise}`;
  }

  toggleEntryHidden(kind, key) {
    if (!this.configuring || !this.layerDraft) return false;
    const buckets = {
      section: "sections",
      group: "groups",
      field: "fields"
    };
    const bucket = buckets[kind];
    if (!bucket) return false;

    const entry = this._findEntry(kind, key);

    if (!entry || !this.canChangeVisibility(entry)) return false;
    const next = !entry.hidden;
    const name = String(key);
    this.layerDraft[bucket][name] = { ...(this.layerDraft[bucket][name] ?? {}),
      hidden: next
    };
    entry.hidden = next;
    this.requestComponentUpdate("view-hidden");
    return this.saveView();
  }

  _findEntry(kind, key) {
    const name = String(key);

    for (const section of this.sections) {
      if (kind === "section" && String(section.key) === name) return section;

      for (const group of section.groups ?? []) {
        if (kind === "group" && String(group.key) === name) return group;

        for (const field of group.fields ?? []) {
          if (kind === "field" && String(field.key) === name) return field;
        }
      }
    }

    return null;
  } // Applied immediately, the way column settings are, and against the layer
  // revision. A refusal or a conflict is not something to paper over: the
  // arrangement on screen is the component optimistic copy, so when the host
  // does not accept it the record is read again and the host resolution wins.


  async saveView() {
    if (!this.canConfigureView || !this.layerDraft) return null; // Serialized, one write at a time. Two drags in quick succession would
    // otherwise both be sent against the revision the layer had before either
    // of them, so the second would be answered with a conflict the person
    // caused by being quick -- correct by the contract and useless to them.
    // Waiting means the second write carries the revision the first earned.

    const queued = this._viewWriting ?? Promise.resolve();
    let release;
    this._viewWriting = new Promise(done => {
      release = done;
    });

    try {
      await queued;
      return await this._saveViewNow();
    } finally {
      release();
    }
  }

  async _saveViewNow() {
    if (!this.canConfigureView || !this.layerDraft) return null;
    const kind = this.viewTarget;
    const epoch = ++this.viewEpoch;
    const answer = await this._raise("view.save", {
      record_id: null,
      collection: this.collection || null,
      target: {
        kind,
        revision: this._layerRevision(kind)
      },
      view: copy(this.layerDraft)
    }, {
      stale: () => epoch !== this.viewEpoch
    });
    if (!answer) return null;

    if (answer.answer === "applied") {
      this.entryErrors = new Map();

      this._storeLayer(kind, answer.revision ?? null, answer.view ?? this.layerDraft); // A host that normalised the layer is telling the component its copy
      // is not what was stored, so the arrangement is read again rather
      // than left as the component imagined it.
      // The port says a view write announces sf-property-view-state, so it
      // has to announce it when the write succeeds and not only when it
      // fails -- otherwise the declared event is a half-truth and a host
      // listening for it would hear only bad news.


      if (answer.view) await this.load("view-normalised");else {
        this._setState("ready");

        this.requestComponentUpdate("view-saved");
      }
      return answer;
    }

    if (answer.answer === "conflict") {
      this._storeLayer(kind, answer.revision ?? null, answer.view ?? null);

      this.message = answer.message || this.viewConflictText;
      await this.load("view-conflict");
      return answer;
    }

    if (answer.answer === "refused") {
      this.entryErrors = new Map(Object.entries(answer.entry_errors ?? {}).map(([key, value]) => [key, String(value)]));
      await this.load("view-refused");
      return answer;
    }

    this._setState("error", answer.message || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PROPERTY_VIEW_TEXT, "viewSaveFailedText", this));

    return answer;
  }

  _storeLayer(kind, revision, view) {
    if (!this.view) return;
    this.view.layers = { ...(this.view.layers ?? {})
    };
    this.view.layers[kind] = {
      revision,
      view: view ? copy(view) : null
    };
    this.layerDraft = this._layerCopy(kind);
  } // A reset writes nothing against the revision -- it never sends the component
  // idea of the defaults, because the host owns those and writing them would
  // overwrite them with a guess.


  async resetView() {
    if (!this.canConfigureView) return null;
    this.resetAsked = false; // Behind the same queue as a save: a reset racing a save in flight would
    // clear a layer and then store the save's revision over the cleared one.

    await (this._viewWriting ?? Promise.resolve());
    const kind = this.viewTarget;
    const epoch = ++this.viewEpoch;
    const answer = await this._raise("view.reset", {
      record_id: null,
      collection: this.collection || null,
      target: {
        kind,
        revision: this._layerRevision(kind)
      }
    }, {
      stale: () => epoch !== this.viewEpoch
    });
    if (!answer) return null;

    if (answer.answer === "applied" || answer.answer === "conflict") {
      if (answer.answer === "conflict") this.message = answer.message || this.viewConflictText;

      this._storeLayer(kind, answer.revision ?? null, null);

      this.entryErrors = new Map();
      await this.load("view-reset");
      return answer;
    }

    this._setState("error", answer.message || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(PROPERTY_VIEW_TEXT, "viewResetFailedText", this));

    return answer;
  }

}

SfPropertyView.define("sf-property-view");

})();

/******/ })()
;