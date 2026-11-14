/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "3b4e9ff2f1d2"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bindProgressBar: () => (/* binding */ bindProgressBar),
/* harmony export */   getProgressBarState: () => (/* binding */ getProgressBarState),
/* harmony export */   initExistingProgressBars: () => (/* binding */ initExistingProgressBars),
/* harmony export */   setProgressBarState: () => (/* binding */ setProgressBarState),
/* harmony export */   unbindProgressBar: () => (/* binding */ unbindProgressBar)
/* harmony export */ });
/* harmony import */ var _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d7f974466839");
/* harmony import */ var _register_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("58661bec99a6");
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("06e8cd089f28");



const PROGRESS_BAR_SELECTOR = '.sf-progress-bar';
const PROGRESS_BAR_BOUND_FLAG = 'sfProgressBarBound';

function normalizeSize(value) {
  const normalized = String(value || '').toLowerCase();
  const supported = ['1/3', '1/2', '1', '2', '3'];
  return supported.includes(normalized) ? normalized : '1';
}

function normalizeValue(value) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return 0;
  }

  return Math.max(0, Math.min(100, parsed));
} // The text stands over the bar (top: the name at the start, the value at the
// end) or at the end of its row (inline-end), or is not shown (owner decision
// C131 (4)). bottom and right are the former words for top and inline-end,
// read until 2027-01-01 (journal record value-progress-text-position).


const TEXT_POSITIONS = ['none', 'top', 'inline-end'];
const FORMER_TEXT_POSITIONS = {
  bottom: 'top',
  right: 'inline-end'
};

function normalizeTextPosition(value, fallback = 'none') {
  const normalized = String(value || fallback).toLowerCase();
  const named = FORMER_TEXT_POSITIONS[normalized] ?? normalized;

  if (named !== normalized) {
    (0,_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_2__.noteDeprecated)({
      component: 'progress-bar',
      kind: 'value',
      attribute: 'data-position',
      from: normalized,
      to: named,
      since: '2026-11-13',
      remove_after: '2027-01-01'
    });
  }

  return TEXT_POSITIONS.includes(named) ? named : fallback;
} // The shared status words (owner decision C131 (1)): no status draws the
// theme's primary and carries no class; neutral is grey, as in sf-dot and
// sf-badge. `primary` is the former word for no status.


const TONES = ['neutral', 'info', 'success', 'warning', 'error'];

function normalizeTone(value) {
  const normalized = String(value || '').toLowerCase();
  return TONES.includes(normalized) ? normalized : '';
}

function getProgressNode(root) {
  return root?.querySelector?.('.sf-progress-bar-progress') || null;
}

function getTextNode(root) {
  return root?.querySelector?.('.sf-progress-bar-text') || null;
}

function getHeadNode(root) {
  return root?.querySelector?.(':scope > .sf-progress-bar-head') || null;
}

function getMainNode(root) {
  return root?.querySelector?.('.sf-progress-bar-main') || null;
}

function detectTextPosition(root) {
  if (!getTextNode(root)) {
    return 'none';
  }

  if (getHeadNode(root) || root.classList.contains('flex-col')) {
    return 'top';
  }

  return 'inline-end';
}

function ensureTextNode(root) {
  let textNode = getTextNode(root);
  if (textNode) return textNode;
  textNode = document.createElement('div');
  textNode.className = 'sf-progress-bar-text';
  root.append(textNode);
  return textNode;
}

function syncRootLayout(root, textPosition = 'none') {
  root.classList.add('sf-progress-bar', 'flex');
  root.classList.remove('flex-col', 'flex-row', 'items-cross-end', 'items-cross-center');

  if (textPosition === 'top') {
    root.classList.add('flex-col');
    return;
  }

  if (textPosition === 'inline-end') {
    root.classList.add('flex-row', 'items-cross-center');
  }
} // Indeterminate (C34): the size of the work is not known, so the bar has no
// value to say: aria-valuenow is left out (WAI-ARIA progressbar), and the
// value text, when the page gives one, says what is going on.
// A meter always has a value, so it is never indeterminate.


function isIndeterminate(root) {
  if (root.dataset.meter === 'true') return false;
  return root.classList.contains('sf-progress-bar--indeterminate') || root.dataset.indeterminate === 'true';
} // Paused (C34): the work stands still, so an indeterminate segment stops.


function isPaused(root) {
  return root.classList.contains('sf-progress-bar--paused') || root.dataset.paused === 'true';
} // Meter (owner decision C131 (7)): an amount within a known range (a quota
// used), not a task's progress: role meter. A meter always has a value.


function isMeter(root) {
  return root.dataset.meter === 'true';
}

function syncProgressAccessibility(root, value) {
  root.setAttribute('role', isMeter(root) ? 'meter' : 'progressbar');
  root.setAttribute('aria-valuemin', '0');
  root.setAttribute('aria-valuemax', '100');
  if (isIndeterminate(root)) root.removeAttribute('aria-valuenow');else root.setAttribute('aria-valuenow', String(value));
  const label = root.dataset.label;

  if (label) {
    root.setAttribute('aria-label', label);
  }

  const valueText = root.dataset.valueText;

  if (valueText) {
    root.setAttribute('aria-valuetext', valueText);
  } else {
    root.removeAttribute('aria-valuetext');
  }
} // One status class at most; no status has none.


function syncTone(root, tone) {
  ['primary', ...TONES].forEach(name => {
    root.classList.toggle(`sf-progress-bar--${name}`, name === tone);
  });
  if (tone) root.dataset.tone = tone;else delete root.dataset.tone;
}

function renderProgressBar(root) {
  if (!root) return false;
  const progress = getProgressNode(root);
  const main = getMainNode(root);
  if (!progress || !main) return false;
  const value = normalizeValue(root.dataset.value ?? root.getAttribute('data-value') ?? 0);
  const textPosition = normalizeTextPosition(root.dataset.position ?? root.dataset.textPosition ?? root.getAttribute('data-text-position'), detectTextPosition(root));
  const tone = normalizeTone(root.dataset.tone);
  syncRootLayout(root, textPosition);
  syncTone(root, tone);
  const indeterminate = isIndeterminate(root);
  root.classList.toggle('sf-progress-bar--indeterminate', indeterminate);
  root.classList.toggle('sf-progress-bar--paused', isPaused(root));
  syncProgressAccessibility(root, value);
  if (indeterminate) progress.style.removeProperty('width');else progress.style.width = `${value}%`;
  root.dataset.value = String(value);
  root.dataset.position = textPosition; // Top: one line over the bar, the name at the start and the value at the
  // end. The line is a picture of what the role already says (name and
  // value), so it is hidden from the accessibility tree.

  if (textPosition === 'top') {
    let head = getHeadNode(root);

    if (!head) {
      head = document.createElement('div');
      head.className = 'sf-progress-bar-head';
      root.insertBefore(head, main);
    }

    head.setAttribute('aria-hidden', 'true');
    let labelNode = head.querySelector('.sf-progress-bar-label');
    const label = root.dataset.label || '';

    if (label) {
      if (!labelNode) {
        labelNode = document.createElement('span');
        labelNode.className = 'sf-progress-bar-label';
        head.prepend(labelNode);
      }

      if (labelNode.textContent !== label) labelNode.textContent = label;
    } else if (labelNode) {
      labelNode.remove();
    }

    let textNode = head.querySelector('.sf-progress-bar-text');

    if (indeterminate) {
      textNode?.remove();
    } else {
      if (!textNode) {
        textNode = getTextNode(root) || document.createElement('span');
        textNode.className = 'sf-progress-bar-text';
        head.append(textNode);
      }

      if (textNode.textContent !== `${value}%`) textNode.textContent = `${value}%`;
    }

    root.querySelectorAll(':scope > .sf-progress-bar-text').forEach(node => node.remove());
    return true;
  }

  getHeadNode(root)?.remove();

  if (textPosition === 'none' || indeterminate) {
    const textNode = getTextNode(root);

    if (textNode) {
      textNode.remove();
    }

    return true;
  }

  const textNode = ensureTextNode(root);
  if (textNode.textContent !== `${value}%`) textNode.textContent = `${value}%`;
  textNode.setAttribute('aria-hidden', 'true');
  return true;
}

function bindProgressBar(root) {
  if (!root || root.dataset[PROGRESS_BAR_BOUND_FLAG] === '1') return;
  renderProgressBar(root);
  root.dataset[PROGRESS_BAR_BOUND_FLAG] = '1';
}

function unbindProgressBar(root) {
  if (!root || root.dataset[PROGRESS_BAR_BOUND_FLAG] !== '1') return;
  delete root.dataset[PROGRESS_BAR_BOUND_FLAG];
}

function initExistingProgressBars(target = document) {
  target.querySelectorAll(PROGRESS_BAR_SELECTOR).forEach(bindProgressBar);
}

function setProgressBarState(target, state = {}) {
  const root = target instanceof HTMLElement ? target.closest(PROGRESS_BAR_SELECTOR) || target : null;
  if (!root) return false;

  if (Object.prototype.hasOwnProperty.call(state, 'value')) {
    root.dataset.value = String(normalizeValue(state.value));
  }

  if (Object.prototype.hasOwnProperty.call(state, 'textPosition')) {
    root.dataset.position = normalizeTextPosition(state.textPosition);
  } // A progress indicator's colour role is its status (journal record
  // attribute-tone-to-status); tone is still read until that record leaves.


  if (Object.prototype.hasOwnProperty.call(state, 'status') || Object.prototype.hasOwnProperty.call(state, 'tone')) {
    root.dataset.tone = normalizeTone(state.status ?? state.tone);
  }

  if (Object.prototype.hasOwnProperty.call(state, 'label')) {
    const label = String(state.label || '').trim();

    if (label) {
      root.dataset.label = label;
      root.setAttribute('aria-label', label);
    } else {
      delete root.dataset.label;
      root.removeAttribute('aria-label');
    }
  }

  if (Object.prototype.hasOwnProperty.call(state, 'valueText')) {
    const valueText = String(state.valueText || '').trim();
    if (valueText) root.dataset.valueText = valueText;else delete root.dataset.valueText;
  }

  if (Object.prototype.hasOwnProperty.call(state, 'indeterminate')) {
    if (state.indeterminate) root.dataset.indeterminate = 'true';else delete root.dataset.indeterminate;
    root.classList.toggle('sf-progress-bar--indeterminate', Boolean(state.indeterminate));
  }

  if (Object.prototype.hasOwnProperty.call(state, 'meter')) {
    if (state.meter) root.dataset.meter = 'true';else delete root.dataset.meter;
  }

  if (Object.prototype.hasOwnProperty.call(state, 'paused')) {
    if (state.paused) root.dataset.paused = 'true';else delete root.dataset.paused;
    root.classList.toggle('sf-progress-bar--paused', Boolean(state.paused));
  }

  if (Object.prototype.hasOwnProperty.call(state, 'size')) {
    const currentSizeClass = Array.from(root.classList).find(cls => cls.startsWith('sf-progress-bar--size-'));

    if (currentSizeClass) {
      root.classList.remove(currentSizeClass);
    }

    root.classList.add(`sf-progress-bar--size-${normalizeSize(state.size)}`);
  }

  return renderProgressBar(root);
}

function getProgressBarState(target) {
  const root = target instanceof HTMLElement ? target.closest(PROGRESS_BAR_SELECTOR) || target : null;
  if (!root) return null;
  return {
    value: normalizeValue(root.dataset.value ?? 0),
    textPosition: normalizeTextPosition(root.dataset.position ?? root.dataset.textPosition, detectTextPosition(root)),
    status: normalizeTone(root.dataset.tone),
    tone: normalizeTone(root.dataset.tone),
    label: root.getAttribute('aria-label') || '',
    valueText: root.getAttribute('aria-valuetext') || '',
    indeterminate: isIndeterminate(root),
    paused: isPaused(root),
    meter: isMeter(root)
  };
}

class ProgressBar extends _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__.ComponentObserver {
  static componentName = 'ProgressBar';
  html = null;

  constructor(props) {
    super(props);
    const {
      size = '1',
      value = 0,
      textPosition = 'none',
      status,
      tone = '',
      label = '',
      valueText = '',
      indeterminate = false,
      paused = false,
      meter = false
    } = this.params || {};
    const className = this.attrs.class || this.attrs.className;
    const root = document.createElement('div');

    if (this.id) {
      root.id = this.id;
    }

    root.classList.add('sf-progress-bar', `sf-progress-bar--size-${normalizeSize(size)}`, 'flex');

    if (className) {
      root.classList.add(...String(className).split(' ').filter(Boolean));
    }

    root.dataset.value = String(normalizeValue(value));
    root.dataset.position = normalizeTextPosition(textPosition);
    root.dataset.tone = normalizeTone(status ?? tone);
    if (String(label).trim()) root.dataset.label = String(label).trim();
    if (String(valueText).trim()) root.dataset.valueText = String(valueText).trim();
    if (indeterminate) root.dataset.indeterminate = 'true';
    if (paused) root.dataset.paused = 'true';
    if (meter) root.dataset.meter = 'true';
    const main = document.createElement('div');
    main.className = 'sf-progress-bar-main';
    const progress = document.createElement('div');
    progress.className = 'sf-progress-bar-progress transition';
    main.append(progress);
    root.append(main);
    this.template = root;
  }

  init() {
    bindProgressBar(this.template);
  }

  destroyInternal() {
    unbindProgressBar(this.template);
  }

}

(0,_register_helper__WEBPACK_IMPORTED_MODULE_1__["default"])('ProgressBar', ProgressBar);

if (typeof window !== 'undefined') {
  window.SF = window.SF || {};
  window.SF.ProgressBar = window.SF.ProgressBar || {};
  window.SF.ProgressBar.getState = getProgressBarState;
  window.SF.ProgressBar.setState = setProgressBarState;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initExistingProgressBars(), {
    once: true
  });
} else {
  initExistingProgressBars();
}

const progressBarObserver = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (!(node instanceof Element)) return;

      if (node.matches?.(PROGRESS_BAR_SELECTOR)) {
        bindProgressBar(node);
      }

      initExistingProgressBars(node);
    });
  });
});
progressBarObserver.observe(document.documentElement, {
  childList: true,
  subtree: true
});


/***/ },

/***/ "0a6d884f1102"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _progressbar__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("3b4e9ff2f1d2");
/*
* Main JS file for including JS for component.
*
* Imports:
* - Base function component (_component_name.js)
*/


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
// <html data-sf-deprecations="warn"> or SF.deprecations.warn = true. A dated
// alias (core/js/aliases.js, standard simai.smart-component §16.20) also
// records `tag`, `since` and `remove_after`; once its date has passed the
// record turns `expired` and that is printed once whatever the page opted
// into, because the name can leave with the next sweep.
//
// Every bundle carries its own copy of this module, so a Map of its own made one
// list per bundle, and SF.deprecations.list() answered with whichever bundle set
// it last -- [] on a page printing seven warnings from others. The notes live on
// one shared global instead, whichever copy writes or reads them.
function sharedNotes() {
  const root = globalThis.SF = globalThis.SF || {};

  if (!(root.__deprecationNotes instanceof Map)) {
    Object.defineProperty(root, '__deprecationNotes', {
      value: new Map(),
      configurable: true
    });
  }

  return root.__deprecationNotes;
}

function warnEnabled() {
  const root = globalThis.document?.documentElement;
  return root?.dataset?.sfDeprecations === 'warn' || globalThis.SF?.deprecations?.warn === true;
}

function noteDeprecated({
  component = '',
  kind = 'attribute',
  attribute = '',
  from,
  to = null,
  tag,
  since,
  remove_after: removeAfter,
  expired
} = {}) {
  if (!from) return;
  const key = [component, kind, attribute, from].join('|');
  const notes = sharedNotes();
  let note = notes.get(key);
  const firstExpiry = expired === true && note?.expired !== true;

  if (note) {
    note.count += 1;
  } else {
    note = {
      component,
      kind,
      attribute,
      from,
      to,
      count: 1
    };
    notes.set(key, note);
  } // The dated fields are kept only when a caller knows them, so the records of
  // the Framework's undated aliases keep their shape.


  if (tag !== undefined) note.tag = tag;
  if (since !== undefined) note.since = since;
  if (removeAfter !== undefined) note.remove_after = removeAfter;
  if (expired === true) note.expired = true;

  if (firstExpiry) {
    globalThis.console?.warn?.(`[SIMAI Framework] ${describe(note)} was due to leave after ${note.remove_after || 'its date'}${to ? `; write ${to}` : ''}. See contracts/changes/journal.json.`);
  } else if (note.count === 1 && warnEnabled()) {
    globalThis.console?.warn?.(`[SIMAI Framework] ${describe(note)} is a legacy name${note.remove_after ? ` until ${note.remove_after}` : ''}${to ? `; write ${to}` : ''}. See contracts/changes/journal.json.`);
  }
}

function describe({
  component,
  kind,
  attribute,
  from
}) {
  const where = component ? `${component}: ` : '';
  const what = kind === 'value' ? `${attribute}="${from}"` : `${kind} ${from}`;
  return `${where}${what}`;
}

function listDeprecations() {
  return [...sharedNotes().values()].map(note => ({ ...note
  }));
}
function clearDeprecations() {
  sharedNotes().clear();
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

/***/ "9174511fefab"
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
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("9174511fefab");
/* harmony import */ var _js_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("0a6d884f1102");
/**
* SIMAI Framework
* Copyright 2008-2026 SIMAI Ltd
* http://simai.studio
* Read the license: http://framework.simai.studio/license/
* Documentation: http://framework.simai.studio/
* Support: http://simai.studio/support/
*
* PROGRESSBAR
*
* Entry point for importing components from this directory.
* Simplifies the import process in other parts of the project.
* Instead of importing individual files, all component can be imported through this file.
*/


})();

/******/ })()
;