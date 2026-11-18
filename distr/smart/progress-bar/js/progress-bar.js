/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "3b4e9ff2f1d2"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
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
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("d3818183b14c");
/* harmony import */ var _core_js_format_number_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("c9ce0852ac73");
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("43090d1c8307");
/* harmony import */ var _progress_threshold__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("a9f36a72486a");
/* harmony import */ var _lang_index_mjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("1eba9aa7827a");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_2__, _core_js_format_number_js__WEBPACK_IMPORTED_MODULE_3__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_4__]);
([_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_2__, _core_js_format_number_js__WEBPACK_IMPORTED_MODULE_3__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_4__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_core_js_page_language__WEBPACK_IMPORTED_MODULE_4__);





 // The words live in the component's language files, the Smart bar's words
// under the same name (sf-progress-bar), so a pack serves both.


const PAUSED_WORDS = {
  en: _lang_index_mjs__WEBPACK_IMPORTED_MODULE_6__["default"].en,
  ru: _lang_index_mjs__WEBPACK_IMPORTED_MODULE_6__["default"].ru
};
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
} // Writes a text into a node of the bar without taking out what a renderer
// keeps there. The Smart element draws the label and the value with Lit, which
// marks each text with a comment and writes later values into its own text
// node; textContent removed both, so the element's next drawing wrote into a
// removed node and failed («Cannot set properties of null (setting 'data')»,
// RG-R-53, three bars of sf-file-upload in the file-upload recipe). The text
// goes into the node's one text node; a node without one (class markup) takes
// textContent as before.


function writeText(node, text) {
  if (node.textContent === text) return;
  const texts = Array.from(node.childNodes).filter(child => child.nodeType === Node.TEXT_NODE);
  const kept = Array.from(node.childNodes).some(child => child.nodeType === Node.COMMENT_NODE);

  if (kept && texts.length >= 1) {
    texts[0].data = text;
    texts.slice(1).forEach(child => {
      child.data = '';
    });
    return;
  }

  node.textContent = text;
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
  // The inline look is an inline box (its sheet: inline-flex), so it leaves
  // the block-level flex utility off.
  root.classList.add('sf-progress-bar');
  root.classList.toggle('flex', !isInline(root));
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
} // A paused bar is at least a warning, as the Smart bar draws it (C34; examples
// pass EX-2): an error stays an error. The page's status stays in data-tone,
// so the bar takes it back when the work goes on.


function pausedTone(tone, paused) {
  return paused && (_progress_threshold__WEBPACK_IMPORTED_MODULE_5__.STATUS_RANK[tone] ?? 0) < _progress_threshold__WEBPACK_IMPORTED_MODULE_5__.STATUS_RANK.warning ? 'warning' : tone;
} // What a screen reader hears for a paused bar, as the Smart bar says it:
// «35 %, на паузе», or «на паузе» while the size of the work is not known.


function pausedValueText(root, value) {
  if (isIndeterminate(root)) return (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_4__.pageText)(PAUSED_WORDS, 'paused', root, 'sf-progress-bar');
  return (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_4__.pageText)(PAUSED_WORDS, 'paused-value', root, 'sf-progress-bar').replace('{value}', String(Math.round(value * 100) / 100));
} // Meter (owner decision C131 (7)): an amount within a known range (a quota
// used), not a task's progress: role meter. A meter always has a value.


function isMeter(root) {
  return root.dataset.meter === 'true';
} // Inline (owner decision C203): the row-end look -- a track of its own width,
// the number before it and always shown. The text stands at inline-end in the
// markup; the sheet puts it before the track.


function isInline(root) {
  return root.dataset.inline === 'true';
}

function syncProgressAccessibility(root, value) {
  root.setAttribute('role', isMeter(root) ? 'meter' : 'progressbar');
  root.setAttribute('aria-valuemin', '0');
  root.setAttribute('aria-valuemax', '100');
  if (isIndeterminate(root)) root.removeAttribute('aria-valuenow');else root.setAttribute('aria-valuenow', String(value));
  const label = root.dataset.label;

  if (label) {
    root.setAttribute('aria-label', label);
  } // What a screen reader hears: the page's value text, else the per cent the
  // bar shows, «72 %» (C203 (3)); nothing while the size is not known.


  const valueText = root.dataset.valueText || (isPaused(root) ? pausedValueText(root, value) : '') || (isIndeterminate(root) ? '' : (0,_core_js_format_number_js__WEBPACK_IMPORTED_MODULE_3__.percentText)(value, root));

  if (valueText) {
    root.setAttribute('aria-valuetext', valueText);
  } else {
    root.removeAttribute('aria-valuetext');
  }
} // One status class at most; no status has none. The class drawn is the
// paused bar's warning (pausedTone); data-tone keeps the page's status.


function syncTone(root, tone) {
  const drawn = pausedTone(tone, isPaused(root));
  ['primary', ...TONES].forEach(name => {
    root.classList.toggle(`sf-progress-bar--${name}`, name === drawn);
  });
  if (tone) root.dataset.tone = tone;else delete root.dataset.tone;
}

function renderProgressBar(root) {
  if (!root) return false;
  const progress = getProgressNode(root);
  const main = getMainNode(root);
  if (!progress || !main) return false;
  const value = normalizeValue(root.dataset.value ?? root.getAttribute('data-value') ?? 0); // An inline bar always shows its number (C203 (3)): at inline-end in the
  // markup, before the track on screen.

  const inline = isInline(root);
  const textPosition = inline ? 'inline-end' : normalizeTextPosition(root.dataset.position ?? root.dataset.textPosition ?? root.getAttribute('data-text-position'), detectTextPosition(root));
  const tone = normalizeTone(root.dataset.tone);
  syncRootLayout(root, textPosition);
  syncTone(root, tone);
  root.classList.toggle('sf-progress-bar--inline', inline);
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

      writeText(labelNode, label);
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

      writeText(textNode, (0,_core_js_format_number_js__WEBPACK_IMPORTED_MODULE_3__.percentText)(value, root));
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
  writeText(textNode, (0,_core_js_format_number_js__WEBPACK_IMPORTED_MODULE_3__.percentText)(value, root));
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

  if (Object.prototype.hasOwnProperty.call(state, 'inline')) {
    if (state.inline) root.dataset.inline = 'true';else delete root.dataset.inline;
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
    meter: isMeter(root),
    inline: isInline(root)
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
      meter = false,
      inline = false
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
    if (inline) root.dataset.inline = 'true';
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

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "a9f36a72486a"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   STATUS_RANK: () => (/* binding */ STATUS_RANK),
/* harmony export */   effectiveStatus: () => (/* binding */ effectiveStatus),
/* harmony export */   readThreshold: () => (/* binding */ readThreshold),
/* harmony export */   thresholdStatus: () => (/* binding */ thresholdStatus)
/* harmony export */ });
// The status a progress indicator draws (owner decision C131 (7)): the more
// serious of the page's status and the threshold its value reached. The
// thresholds are the page's, in per cent like the value; unset (null, an
// empty attribute, a word) is no threshold. neutral, info and success rank
// below warning, warning below error. One source for sf-progress-bar,
// sf-progress-scale and the class scale (div.sf-progress-scale with
// data-warning-at / data-error-at), so a scale and a bar with the same
// numbers draw the same colour.
const STATUS_RANK = {
  warning: 1,
  error: 2
};
function thresholdStatus(value, warningAt, errorAt) {
  const number = Number(value);
  if (!Number.isFinite(number)) return '';
  if (Number.isFinite(errorAt) && number >= errorAt) return 'error';
  if (Number.isFinite(warningAt) && number >= warningAt) return 'warning';
  return '';
}
function effectiveStatus(status, value, warningAt, errorAt) {
  const reached = thresholdStatus(value, warningAt, errorAt);
  return (STATUS_RANK[reached] ?? 0) > (STATUS_RANK[status] ?? 0) ? reached : status;
} // A threshold as an attribute holds it: a number, else none. An empty or
// missing attribute is none, never 0 (Number('') is 0).

function readThreshold(raw) {
  if (raw === null || raw === undefined || String(raw).trim() === '') return null;
  const number = Number(raw);
  return Number.isFinite(number) ? number : null;
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

/***/ "15b4e93ff6ed"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   formatLocale: () => (/* binding */ formatLocale),
/* harmony export */   intlFormatter: () => (/* binding */ intlFormatter),
/* harmony export */   toDate: () => (/* binding */ toDate)
/* harmony export */ });
/* harmony import */ var _page_language_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("43090d1c8307");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_page_language_js__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
_page_language_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var _page_language_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_page_language_js__WEBPACK_IMPORTED_MODULE_0__);
// The part every format module shares (core/js/format.js says what the
// helpers are): the locale a call formats in, a Date from what a host gives,
// and the Intl formatters, kept on a global every copy of these modules shares
// (bundles each carry their own module copy; page-language.js says why).
//
// No top-level side effects, here or in format-number.js, format-date.js,
// format-relative.js and format-file-size.js (ui-chart, 2026-11-05): a bundle
// that imports one function carries that function and what it calls, nothing
// else. The global is made on the first format, not on load, and SF.format is
// published by core's entry (index.js, publishFormat in format.js).

/** The locale a call formats in: the one it names, else its node's page language. */

function formatLocale({
  locale,
  node
} = {}) {
  return String(locale || '').trim() || (0,_page_language_js__WEBPACK_IMPORTED_MODULE_0__.pageLocale)(node);
}
/** A Date from a Date, a time in milliseconds or a date string; null when it is none. */

function toDate(value) {
  if (value === null || value === undefined || value === '') return null;
  const date = value instanceof Date ? new Date(value.getTime()) : new Date(typeof value === 'string' && /^\d+$/u.test(value) ? Number(value) : value);
  return Number.isNaN(date.getTime()) ? null : date;
} // The formatters every copy shares, made on the first call.

function formatterCache() {
  const root = typeof globalThis !== 'undefined' ? globalThis : {};
  if (!root.__sfFormat) root.__sfFormat = {
    formatters: new Map()
  };
  return root.__sfFormat.formatters;
} // One formatter per kind, locale and options. An unknown locale falls back to
// the browser's, and options the platform refuses (an unknown unit or
// currency) to a plain number, so a typo in a page never throws at a reader.


function intlFormatter(kind, locale, options) {
  const key = `${kind}|${locale}|${JSON.stringify(options)}`;
  const cache = formatterCache();
  if (cache.has(key)) return cache.get(key);
  const Make = Intl[kind];
  let made;

  try {
    made = new Make(locale || undefined, options);
  } catch {
    try {
      made = new Make(undefined, options);
    } catch {
      made = new Make(locale || undefined, kind === 'NumberFormat' ? {
        maximumFractionDigits: 2
      } : {});
    }
  } // A page that formats in many locales does not grow the cache for ever.


  if (cache.size >= 256) cache.delete(cache.keys().next().value);
  cache.set(key, made);
  return made;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "c9ce0852ac73"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   formatNumber: () => (/* binding */ formatNumber),
/* harmony export */   numberOptions: () => (/* binding */ numberOptions),
/* harmony export */   percentSign: () => (/* binding */ percentSign),
/* harmony export */   percentText: () => (/* binding */ percentText)
/* harmony export */ });
/* harmony import */ var _format_intl_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("15b4e93ff6ed");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_format_intl_js__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
_format_intl_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
// Numbers in the page's language by a format word: formatNumber and
// numberOptions alone, with no top-level side effects (format-intl.js). The
// same functions as core/js/format.js and SF.format.number; a bundle that
// formats numbers only imports them from here.

/**
 * The Intl options of a number format word (ui-chart's words, kept so a page
 * writes a format as an attribute):
 *
 *   number (default)  1 234,5   as many digits as `step` needs, at most 6; 2 without one
 *   integer           1 235
 *   decimal-<n>       n digits after the point, always (0 to 20)
 *   share             a share 0..1 as 12 % (0.125 is 12,5 %)
 *   percent           the same share: the charts' word, kept
 *   unit-percent      a value that already is the percent (12.5 is 12,5 %),
 *                     as the property type `percent` stores it
 *   compact           1,2 тыс.  /  1.2K
 *   currency-<CODE>   1 234,50 ₽ (an ISO 4217 code)
 *   unit-<unit>       45,3 ГБ (an Intl unit: gigabyte, megabit-per-second)
 *
 * Anything else reads as number. Words join with a space: a kind (currency-,
 * unit-, percent) and a precision (integer, decimal-<n>, compact), so
 * «currency-RUB integer» is 1 235 ₽, «currency-RUB decimal-2» 1 234,50 ₽ and
 * «currency-RUB compact» 1,1 млн ₽. The precision wins whatever the order.
 */

function numberOptions(format = 'number', step = 0) {
  const words = String(format || 'number').trim().split(/\s+/u).filter(Boolean);

  if (words.length > 1) {
    const PRECISION = /^(?:integer|compact|decimal-\d{1,2})$/u;
    const kinds = words.filter(one => !PRECISION.test(one));
    const precision = words.filter(one => PRECISION.test(one));
    return [...kinds, ...precision].reduce((options, one) => ({ ...options,
      ...numberOptions(one, step)
    }), {});
  }

  const word = words[0] ?? 'number';
  if (word === 'integer') return {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }; // Two meanings of «percent» met in the Framework (C294, MP-4): this word
  // multiplies a share by 100, while the property type `percent` holds the
  // percent itself. `share` says which one it is; `percent` stays its alias for
  // the charts that write it, and `unit-percent` is the percent itself.

  if (word === 'share' || word === 'percent') return {
    style: 'percent',
    maximumFractionDigits: 1
  };
  if (word === 'compact') return {
    notation: 'compact',
    maximumFractionDigits: 1
  };
  const decimal = /^decimal-(\d{1,2})$/u.exec(word);

  if (decimal) {
    const digits = Math.min(20, Number(decimal[1]));
    return {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits
    };
  }

  const unit = /^unit-([a-z]+(?:-per-[a-z]+)?)$/u.exec(word);
  if (unit) return {
    style: 'unit',
    unit: unit[1],
    unitDisplay: 'short',
    maximumFractionDigits: 1
  };
  const currency = /^currency-([A-Z]{3})$/u.exec(word);
  if (currency) return {
    style: 'currency',
    currency: currency[1]
  };
  const digits = step > 0 && step < 1 ? Math.min(6, Math.ceil(-Math.log10(step) - 1e-9)) : 2;
  return {
    maximumFractionDigits: digits
  };
}
/**
 * A number in the locale by a format word (numberOptions). `grouping: false`
 * writes it without thousands marks («2026»), `step` sets the digits of
 * `number`, and a value that is not a finite number is `gap`, '' by default
 * (a chart passes '—').
 */

function formatNumber(value, format = 'number', {
  step = 0,
  gap = '',
  grouping = true,
  ...where
} = {}) {
  const number = typeof value === 'string' && value.trim() !== '' ? Number(value) : value;
  if (typeof number !== 'number' || !Number.isFinite(number)) return gap;
  const options = numberOptions(format, step);
  if (grouping === false) options.useGrouping = false;
  const text = (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.intlFormatter)('NumberFormat', (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.formatLocale)(where), options).format(number);
  return options.style === 'percent' || options.unit === 'percent' ? percentSign(text) : text;
}
/**
 * One spelling of a per cent in every language (owner decision C203 (3), DEV
 * msg-913fd9e4, 2026-11-15): the number, a no-break space (U+00A0) and «%» --
 * «72 %», «12,5 %», and «72 %» in English too, where Intl writes «72%». A
 * language that writes the sign first («%72») keeps its order.
 */

function percentSign(text) {
  // A right-to-left language writes direction marks around the sign («12.5‎%‎»
  // in Arabic); they go with the space it had, and the number keeps the mark
  // it starts with (C294).
  return String(text).replace(/[\s\u00a0\u202f\u200e\u200f\u061c]*%[\u200e\u200f\u061c]*$/u, '\u00a0%');
}
/**
 * A value that already is a per cent (0..100, «72», «72.5») as the progress
 * family shows and says it (owner decision C203 (3), IM-3): the number in the
 * language of the node's part of the page, as many digits as it has (up to
 * 2), a no-break space and «%» -- «72 %», «72,5 %».
 */

function percentText(value, node) {
  const number = Number(value);
  return percentSign(`${formatNumber(Number.isFinite(number) ? number : 0, 'number', {
    node,
    grouping: false
  })}%`);
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "7bd8e00a777a"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   effectiveStatus: () => (/* reexport safe */ _component_progress_threshold__WEBPACK_IMPORTED_MODULE_6__.effectiveStatus),
/* harmony export */   pausedStatus: () => (/* binding */ pausedStatus),
/* harmony export */   showChunk: () => (/* binding */ showChunk),
/* harmony export */   thresholdStatus: () => (/* reexport safe */ _component_progress_threshold__WEBPACK_IMPORTED_MODULE_6__.thresholdStatus)
/* harmony export */ });
/* harmony import */ var _component_progress_bar_js_progressbar__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("3b4e9ff2f1d2");
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _core_js_deprecations__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("d3818183b14c");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("9c29247e4834");
/* harmony import */ var _core_js_format_number_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("c9ce0852ac73");
/* harmony import */ var _component_progress_threshold__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("a9f36a72486a");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("e023bc52f90d");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("361e38151042");
/* harmony import */ var _lang_index_mjs__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("710a5651d6d4");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_component_progress_bar_js_progressbar__WEBPACK_IMPORTED_MODULE_0__, _core_js_smart_base__WEBPACK_IMPORTED_MODULE_1__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2__, _core_js_deprecations__WEBPACK_IMPORTED_MODULE_3__, _js_templates_default__WEBPACK_IMPORTED_MODULE_4__, _core_js_format_number_js__WEBPACK_IMPORTED_MODULE_5__]);
([_component_progress_bar_js_progressbar__WEBPACK_IMPORTED_MODULE_0__, _core_js_smart_base__WEBPACK_IMPORTED_MODULE_1__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2__, _core_js_deprecations__WEBPACK_IMPORTED_MODULE_3__, _js_templates_default__WEBPACK_IMPORTED_MODULE_4__, _core_js_format_number_js__WEBPACK_IMPORTED_MODULE_5__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _core_js_deprecations__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_core_js_deprecations__WEBPACK_IMPORTED_MODULE_3__);









 // Only the words on screen ship in the bundle, English only (owner decision
// C282): Russian and every other language come from a language file. The
// title, settings and events stay in the language files for the Studio and the
// docs (localization study LC-2).
// sf-progress-bar from its component.json (standard simai.smart-component
// 1.3.8 §3, §4, §4.4): its settings are attributes and properties made by
// core/js/element-manifest.js; a job's part arrives as the stream fact chunk
// {done, total} (vocabulary 1.1.5 §5.2), which a rule hands to the action
// chunk; tone and setProgress are dated aliases (aliases.json). warning-at and
// error-at (1.2.0) turn the bar a warning or an error by itself. indeterminate
// (1.3.0) runs a segment for work of unknown size; paused (1.3.0) is at least
// a warning and is said in the value text (C34).

const ProgressBarElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_7__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_1___default()),
  lang: _lang_index_mjs__WEBPACK_IMPORTED_MODULE_9__.files,
  source: 'ru',
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_8__,
  actions: {
    chunk({
      done,
      total
    } = {}) {
      return showChunk(this, done, total);
    }

  }
}); // A part of a job as a percentage of the bar: done of total (100 when the
// rule gives none), clamped to 0..100 (vocabulary §5.2).

function showChunk(element, done, total) {
  const whole = total === undefined || total === null || total === '' ? 100 : Number(total);
  const part = Number(done);

  if (!Number.isFinite(part) || !Number.isFinite(whole) || whole <= 0) {
    return {
      outcome: 'refused',
      reason: 'invalid'
    };
  }

  const percent = Math.max(0, Math.min(100, part / whole * 100));
  element.value = Math.round(percent * 100) / 100;
  return {
    outcome: 'applied'
  };
} // The status the bar draws (1.2.0): the more serious of the page's status and
// the threshold the value reached -- one source with sf-progress-scale and the
// class scale (component/progress-threshold.js); kept exported here for the
// modules that import it from the bar.

 // Paused (1.3.0, C34): at least a warning; an error stays an error.

function pausedStatus(status, paused) {
  return paused && (_component_progress_threshold__WEBPACK_IMPORTED_MODULE_6__.STATUS_RANK[status] ?? 0) < _component_progress_threshold__WEBPACK_IMPORTED_MODULE_6__.STATUS_RANK.warning ? 'warning' : status;
} // What retires without a new name (aliases.json rows with `to: null`): kept
// until the date, and each call is noted with it.

function noteRetired(from) {
  (0,_core_js_deprecations__WEBPACK_IMPORTED_MODULE_3__.noteDeprecated)({
    component: 'sf-progress-bar',
    tag: 'sf-progress-bar',
    kind: 'action',
    from,
    to: null,
    since: _aliases_json__WEBPACK_IMPORTED_MODULE_8__.since,
    remove_after: _aliases_json__WEBPACK_IMPORTED_MODULE_8__.remove_after
  });
}

class SfProgressBar extends ProgressBarElement {
  static get props() {
    return { ...super.props,
      // The axis is called status, and speaks the shared vocabulary. `tone`
      // and its value `primary` keep working: see contracts/public-api-axes.json.
      // No status (empty) is the theme's primary; neutral is grey (C131 (1)).
      status: {
        default: '',
        values: ['', 'neutral', 'info', 'success', 'warning', 'error'],
        aliases: ['tone'],
        valueAliases: {
          '': ['primary']
        }
      },
      // top | inline-end | none (C131 (4)); bottom and right are the former
      // words until 2027-01-01 (journal value-progress-text-position).
      textPosition: {
        default: 'none',
        values: ['none', 'top', 'inline-end'],
        attribute: 'text-position',
        valueAliases: {
          top: ['bottom'],
          'inline-end': ['right']
        }
      }
    };
  }

  constructor() {
    super();
    this._boundRoot = null;
  }

  get status() {
    return this.getProp('status');
  } // A threshold holds only where the page set it a number: unset or empty is
  // none (Number('') would read 0).


  threshold(attribute) {
    return (0,_component_progress_threshold__WEBPACK_IMPORTED_MODULE_6__.readThreshold)(this.getAttribute(attribute));
  } // The status drawn: the page's, or the threshold the value reached; a
  // paused bar is at least a warning (C34).


  get drawnStatus() {
    return pausedStatus((0,_component_progress_threshold__WEBPACK_IMPORTED_MODULE_6__.effectiveStatus)(this.status, this.value, this.threshold('warning-at'), this.threshold('error-at')), this.paused);
  } // What a screen reader hears beside the value: the page's value text, else
  // for a paused bar the value with the word paused (C34), else the per cent
  // the bar shows, «72 %» (owner decision C203 (3)); nothing while the size of
  // the work is not known.


  get spokenValueText() {
    if (this.valueText) return this.valueText;
    const unknown = this.indeterminate && !this.meter;
    const value = Math.max(0, Math.min(100, Number(this.value) || 0));
    if (!this.paused) return unknown ? '' : (0,_core_js_format_number_js__WEBPACK_IMPORTED_MODULE_5__.percentText)(value, this);
    if (unknown) return this.sfWord('paused');
    return this.sfWord('paused-value').replace('{value}', String(Math.round(value * 100) / 100));
  } // The accessible name: label, else the host's aria-label (§3.1, §4.8).


  get accessibleLabel() {
    return this.label || this.getAttribute('aria-label') || '';
  }

  templateContext() {
    const props = this.getPropsContext();
    const status = this.drawnStatus;
    this.sfHostState('data-status', status); // The drawn status and the spoken value text go under their own names:
    // status and valueText are the page's settings as given (their getters),
    // and the template reads what the bar resolved (template-context rule).

    return this.createTemplateContext({ ...props,
      drawnStatus: status,
      label: this.accessibleLabel,
      spokenValueText: this.spokenValueText,
      indeterminate: Boolean(this.indeterminate),
      paused: Boolean(this.paused),
      meter: Boolean(this.meter),
      inline: Boolean(this.inline),
      component: this
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_4__.renderProgressBarTemplate)(this.templateContext());
  }

  get state() {
    return {
      size: this.size,
      value: this.value,
      textPosition: this.textPosition,
      status: this.status,
      drawnStatus: this.drawnStatus,
      label: this.label,
      valueText: this.valueText,
      indeterminate: Boolean(this.indeterminate),
      paused: Boolean(this.paused),
      meter: Boolean(this.meter),
      inline: Boolean(this.inline)
    };
  } // §4.4: a reader retires; read value.


  getProgress() {
    noteRetired('getProgress');
    return Number(this.value || 0);
  } // §4.4: text-position is a writable setting.


  setTextPosition(nextValue) {
    noteRetired('setTextPosition');
    this.textPosition = nextValue === null || nextValue === undefined || nextValue === '' ? null : nextValue;
    return this;
  } // Every change is drawn by the template (RG-R-53). The bar patched value,
  // label, position, status and the rest straight into the drawn markup
  // through the class (setProgressBarState), so Lit's text and parts no longer
  // matched the page: its next drawing wrote into a removed text node, and a
  // part the class added (the value text, the head) stood beside Lit's own.
  // A drawing is one small template; afterRender hands the root to the class,
  // which only sets the fill's width and checks what the template wrote.


  afterRender() {
    if (this._boundRoot) {
      (0,_component_progress_bar_js_progressbar__WEBPACK_IMPORTED_MODULE_0__.unbindProgressBar)(this._boundRoot);
      this._boundRoot = null;
    }

    this._boundRoot = this.querySelector('.sf-progress-bar');

    if (this._boundRoot) {
      (0,_component_progress_bar_js_progressbar__WEBPACK_IMPORTED_MODULE_0__.bindProgressBar)(this._boundRoot);
    }
  }

  onDisconnected() {
    if (this._boundRoot) {
      (0,_component_progress_bar_js_progressbar__WEBPACK_IMPORTED_MODULE_0__.unbindProgressBar)(this._boundRoot);
      this._boundRoot = null;
    }
  }

}

SfProgressBar.define('sf-progress-bar');
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "9c29247e4834"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderProgressBarTemplate: () => (/* binding */ renderProgressBarTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var _core_js_format_number_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("c9ce0852ac73");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, _core_js_format_number_js__WEBPACK_IMPORTED_MODULE_1__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, _core_js_format_number_js__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);



function normalizeValue(value) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return 0;
  }

  return Math.max(0, Math.min(100, parsed));
}

function normalizeSize(value) {
  const normalized = String(value || '').toLowerCase();
  return ['1/3', '1/2', '1', '2', '3'].includes(normalized) ? normalized : '1';
} // The component normalises the legacy words, so the template sees the shared
// vocabulary (owner decision C131 (1)): no status (empty) draws the theme's
// primary and carries no class; neutral is grey, as in sf-dot and sf-badge.


function normalizeStatus(value) {
  const normalized = String(value || '').toLowerCase();
  return ['neutral', 'info', 'success', 'warning', 'error'].includes(normalized) ? normalized : '';
} // top | inline-end | none (C131 (4)); bottom and right are the former words.


const FORMER_POSITIONS = {
  bottom: 'top',
  right: 'inline-end'
};

function normalizePosition(value) {
  const named = FORMER_POSITIONS[value] ?? value;
  return ['none', 'top', 'inline-end'].includes(named) ? named : 'none';
}

const on = value => value === true || value === '' || value === 'true';

function renderProgressBarTemplate(context) {
  const {
    value,
    textPosition
  } = context;
  const size = normalizeSize(context.size);
  const tone = normalizeStatus(context.drawnStatus ?? context.status ?? context.tone);
  const normalizedValue = normalizeValue(value); // Inline (owner decision C203): the row-end look. Its number is always
  // shown, at inline-end in the markup and before the track on screen (the
  // sheet's order), so the position setting does not apply to it.

  const inline = on(context.inline);
  const normalizedPosition = inline ? 'inline-end' : normalizePosition(textPosition); // A meter (C131 (7)) shows an amount within a known range: it always has a
  // value, so it is never indeterminate.

  const meter = on(context.meter);
  const indeterminate = Boolean(context.indeterminate) && !meter;
  const paused = Boolean(context.paused);
  const rootClasses = ['sf-progress-bar', `sf-progress-bar--size-${size}`, tone ? `sf-progress-bar--${tone}` : '', indeterminate ? 'sf-progress-bar--indeterminate' : '', paused ? 'sf-progress-bar--paused' : '', inline ? 'sf-progress-bar--inline' : 'flex', context.rootClass].filter(Boolean);

  if (normalizedPosition === 'inline-end') {
    rootClasses.push('flex-row', 'items-cross-center');
  } else if (normalizedPosition === 'top') {
    rootClasses.push('flex-col');
  } // «72 %»: the number, a no-break space and the sign (C203 (3)).


  const valueText = (0,_core_js_format_number_js__WEBPACK_IMPORTED_MODULE_1__.percentText)(normalizedValue, context.component ?? null);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div
      class=${rootClasses.join(' ')}
      style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      data-value=${String(normalizedValue)}
      data-position=${normalizedPosition}
      data-tone=${tone}
      data-label=${context.label || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      data-value-text=${(context.spokenValueText ?? context.valueText) || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      data-indeterminate=${indeterminate ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      data-paused=${paused ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      data-meter=${meter ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      data-inline=${inline ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      role=${meter ? 'meter' : 'progressbar'}
      aria-label=${context.label || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow=${indeterminate ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : String(normalizedValue)}
      aria-valuetext=${(context.spokenValueText ?? context.valueText) || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    >
      ${normalizedPosition === 'top' ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-progress-bar-head" aria-hidden="true">${context.label ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-progress-bar-label">${context.label}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}${indeterminate ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-progress-bar-text">${valueText}</span>`}</div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      <div class="sf-progress-bar-main">
        <div class="sf-progress-bar-progress transition"></div>
      </div>
      ${normalizedPosition === 'inline-end' && !indeterminate ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-progress-bar-text" aria-hidden="true">${valueText}</div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    </div>
  `;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "d3818183b14c"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("deprecations", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("deprecations", 1).then(resolve, reject), { once: true })));

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

/***/ "1eba9aa7827a"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   files: () => (/* binding */ files)
/* harmony export */ });
/* harmony import */ var _en_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("05f645d429b2");
// Written by scripts/build-language-packs.mjs from src/core/lang/built-in.json
// (owner decision C282); do not edit. The words this bundle carries: the
// built-in languages' (en); every other language comes from
// a language file (core/lang/<code>.js or its parts).


const files = { en: { runtime: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime } };

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ en: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime });


/***/ },

/***/ "710a5651d6d4"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   files: () => (/* binding */ files)
/* harmony export */ });
/* harmony import */ var _en_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("8c9a03a2745a");
// Written by scripts/build-language-packs.mjs from src/core/lang/built-in.json
// (owner decision C282); do not edit. The words this bundle carries: the
// built-in languages' (en); every other language comes from
// a language file (core/lang/<code>.js or its parts).


const files = { en: { runtime: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime } };

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ en: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime });


/***/ },

/***/ "05f645d429b2"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"runtime":{"paused-value":"{value} %, paused","paused":"paused"}}');

/***/ },

/***/ "361e38151042"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-progress-bar for the shim (core/js/aliases.js, standard §16 item 20). mode: same-detail (the shim sends the new and the old name), detail-adds (the new detail holds the old fields), attribute-and-property, host-attribute (no shim), manifest-only (the DOM name does not change), retired (no new name; kept and noted by the component until the date).","component":"sf-progress-bar","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"tone","to":"status","kind":"setting","component":"sf-progress-bar","since":"2026-10-27","remove_after":"2026-12-01","section":"the axis\'s old name (contracts/public-api-axes.json)"},{"from":"setProgress","to":"chunk","kind":"action","component":"sf-progress-bar","since":"2026-10-27","remove_after":"2026-12-01","section":"§4.4, vocabulary §5.2","note":"setProgress(n) calls chunk(n): n of 100"},{"from":"getProgress","to":null,"kind":"action","component":"sf-progress-bar","since":"2026-10-27","remove_after":"2026-12-01","mode":"retired","section":"§4.4","note":"a reader retires: read value; the method stays until the date and notes each call"},{"from":"setTextPosition","to":null,"kind":"action","component":"sf-progress-bar","since":"2026-10-27","remove_after":"2026-12-01","mode":"retired","section":"§4.4","note":"text-position is a writable setting; the method stays until the date and notes each call"},{"from":"bottom","to":"top","kind":"value","setting":"text-position","component":"sf-progress-bar","since":"2026-11-13","remove_after":"2027-01-01","section":"owner decision C131 (4)","note":"journal value-progress-text-position: the label positions are top and inline-end; the former word is read as the new one until the date"},{"from":"right","to":"inline-end","kind":"value","setting":"text-position","component":"sf-progress-bar","since":"2026-11-13","remove_after":"2027-01-01","section":"owner decision C131 (4)","note":"journal value-progress-text-position: the label positions are top and inline-end; the former word is read as the new one until the date"}]}');

/***/ },

/***/ "e023bc52f90d"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.progress-bar","tag":"sf-progress-bar","version":"1.5.4","kind":"leaf","settings":{"size":{"type":"enum","values":["1/3","1/2","1","2","3"],"default":"1"},"value":{"type":"number","default":0,"min":0,"max":100},"text-position":{"type":"enum","values":["none","top","inline-end"],"default":"none"},"status":{"type":"enum","values":["","neutral","info","success","warning","error"],"default":""},"warning-at":{"type":"number","optional":true,"min":0,"max":100},"error-at":{"type":"number","optional":true,"min":0,"max":100},"indeterminate":{"type":"boolean","default":false},"paused":{"type":"boolean","default":false},"meter":{"type":"boolean","default":false},"inline":{"type":"boolean","default":false},"label":{"type":"string","default":""},"value-text":{"type":"string","default":""}},"values":{},"events":{},"actions":{"chunk":{"with":{"done":"number","total":"number"}}},"css-variables":{"--sf-progress-bar-fill-color":{"type":"color","state":"default"},"--sf-progress-bar-track-color":{"type":"color","state":"default"},"--sf-progress-bar-height":{"type":"length","state":"default"},"--sf-progress-bar-radius":{"type":"length","state":"default"},"--sf-progress-bar-color":{"type":"color","state":"default"},"--sf-progress-bar-gap":{"type":"length","state":"default"},"--sf-progress-bar-track-size":{"type":"length","state":"default"}},"host-states":{"data-status":"string"}}');

/***/ },

/***/ "8c9a03a2745a"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Progress Bar","runtime":{"paused-value":"{value} %, paused","paused":"paused"}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("7bd8e00a777a");
/******/
/******/ })()
;