/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "e6d86f2cd058"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FIELD_SIZES: () => (/* binding */ FIELD_SIZES),
/* harmony export */   RETIRED_FIELD_SIZES: () => (/* binding */ RETIRED_FIELD_SIZES),
/* harmony export */   fieldSize: () => (/* binding */ fieldSize),
/* harmony export */   nearestFieldSize: () => (/* binding */ nearestFieldSize),
/* harmony export */   retireFieldSizeClass: () => (/* binding */ retireFieldSizeClass)
/* harmony export */ });
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("06e8cd089f28");
// Form fields come in three sizes. 1/3 and 3 were retired: no consumer used
// them, and they could not hold a field's own pictures, tags and targets. A
// page written for a retired size keeps rendering at the nearest kept size, and
// says so once in the console so the markup can be updated.

const FIELD_SIZES = Object.freeze(['1/2', '1', '2']);
const RETIRED_FIELD_SIZES = Object.freeze({
  '1/3': '1/2',
  '3': '2'
});
const warned = new Set(); // A control placed inside something with the whole scale (a list item, say)
// takes the nearest form size, quietly: the list is not wrong to be 1/3.

function nearestFieldSize(value) {
  const size = String(value ?? '').trim().toLowerCase();
  if (FIELD_SIZES.includes(size)) return size;
  return Object.hasOwn(RETIRED_FIELD_SIZES, size) ? RETIRED_FIELD_SIZES[size] : '1';
}
function fieldSize(value, component = 'field', fallback = '1') {
  const size = String(value ?? '').trim().toLowerCase();
  if (FIELD_SIZES.includes(size)) return size;

  if (Object.hasOwn(RETIRED_FIELD_SIZES, size)) {
    const kept = RETIRED_FIELD_SIZES[size];
    (0,_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_0__.noteDeprecated)({
      component,
      kind: 'value',
      attribute: 'size',
      from: size,
      to: kept
    });
    const key = `${component}:${size}`;

    if (!warned.has(key) && typeof console !== 'undefined') {
      warned.add(key);
      console.warn(`[SIMAI Framework] ${component}: size ${size} is retired for form fields; rendering size ${kept}.`);
    }

    return kept;
  }

  return fallback;
} // Markup written by hand carries its size as a class, so the binder moves a
// retired size class to the kept one before anything measures the field.

function retireFieldSizeClass(root, block) {
  if (!root?.classList) return;

  for (const [retired, kept] of Object.entries(RETIRED_FIELD_SIZES)) {
    const name = `${block}--size-${retired}`;
    if (!root.classList.contains(name)) continue;
    root.classList.replace(name, `${block}--size-${fieldSize(retired, block)}`);
  }
}

/***/ },

/***/ "736e917526e6"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bindProgressScale: () => (/* binding */ bindProgressScale),
/* harmony export */   getProgressScaleState: () => (/* binding */ getProgressScaleState),
/* harmony export */   initExistingProgressScales: () => (/* binding */ initExistingProgressScales),
/* harmony export */   normalizeProgressScaleStep: () => (/* binding */ normalizeProgressScaleStep),
/* harmony export */   normalizeProgressScaleValue: () => (/* binding */ normalizeProgressScaleValue),
/* harmony export */   setProgressScaleState: () => (/* binding */ setProgressScaleState),
/* harmony export */   unbindProgressScale: () => (/* binding */ unbindProgressScale)
/* harmony export */ });
/* harmony import */ var _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d7f974466839");
/* harmony import */ var _register_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("58661bec99a6");


const PROGRESS_SCALE_SELECTOR = '.sf-progress-scale';
const BOUND_FLAG = 'sfProgressScaleBound';
const SIZE_VALUES = ['1/3', '1/2', '1', '2', '3']; // The shared status words. `primary` was the old word for no status: it has no
// colour of its own and draws the default, as before; `info` was turned into it.

const TONE_VALUES = ['info', 'success', 'warning', 'error'];

function normalizeProgressScaleValue(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 0;
  return Math.max(0, Math.min(100, parsed));
}

function normalizeProgressScaleStep(value) {
  return Math.ceil(normalizeProgressScaleValue(value) / 10) * 10;
}

function normalizeProgressScaleSize(value) {
  const normalized = String(value || '').toLowerCase();
  return SIZE_VALUES.includes(normalized) ? normalized : '1';
}

function normalizeProgressScaleTone(value) {
  const normalized = String(value || '').toLowerCase();
  return TONE_VALUES.includes(normalized) ? normalized : '';
}

function normalizeBoolean(value, fallback = true) {
  if (value === undefined || value === null || value === '') return fallback;
  if (typeof value === 'boolean') return value;
  return !['false', '0', 'no', 'off'].includes(String(value).toLowerCase());
}

function ensureScaleStructure(root) {
  let container = root.querySelector('.sf-progress-scale-container');

  if (!container) {
    container = document.createElement('div');
    container.className = 'sf-progress-scale-container grid grid-col-10 overflow-hidden';
    root.prepend(container);
  }

  container.setAttribute('aria-hidden', 'true');
  const blocks = [...container.querySelectorAll('.sf-progress-scale-block')];

  for (let index = blocks.length; index < 10; index += 1) {
    const block = document.createElement('div');
    block.className = 'sf-progress-scale-block';
    container.append(block);
  }

  blocks.slice(10).forEach(block => block.remove());
}

function ensureScaleText(root) {
  let text = root.querySelector('.sf-progress-scale-text, .sf-scale-text');

  if (!text) {
    text = document.createElement('div');
    root.append(text);
  }

  text.classList.add('sf-progress-scale-text');
  return text;
}

function syncScaleClasses(root, step, size, tone) {
  for (let current = 0; current <= 100; current += 10) {
    root.classList.toggle(`sf-progress-scale--${current}`, current === step);
  }

  SIZE_VALUES.forEach(current => {
    root.classList.toggle(`sf-progress-scale--size-${current}`, current === size);
  });
  TONE_VALUES.forEach(current => {
    root.classList.toggle(`sf-progress-scale--${current}`, current === tone);
  });
}

function renderProgressScale(root) {
  if (!root) return false;
  ensureScaleStructure(root);
  const value = normalizeProgressScaleValue(root.dataset.value);
  const step = normalizeProgressScaleStep(value);
  const size = normalizeProgressScaleSize(root.dataset.size);
  const tone = normalizeProgressScaleTone(root.dataset.tone);
  const showText = normalizeBoolean(root.dataset.showText, true); // A scale on a text line lays its track and value out in a row; any other
  // scale stands its value under the track.

  const onLine = /(^|\s)sf-progress-scale--line-/.test(root.className);
  root.classList.add('sf-progress-scale', 'flex', onLine ? 'flex-row' : 'flex-col');
  if (onLine) root.classList.remove('flex-col');
  syncScaleClasses(root, step, size, tone);
  root.dataset.value = String(value);
  root.dataset.size = size;
  root.dataset.tone = tone;
  root.dataset.showText = String(showText);
  root.setAttribute('role', 'progressbar');
  root.setAttribute('aria-valuemin', '0');
  root.setAttribute('aria-valuemax', '100');
  root.setAttribute('aria-valuenow', String(value));
  if (root.dataset.label) root.setAttribute('aria-label', root.dataset.label);
  if (root.dataset.valueText) root.setAttribute('aria-valuetext', root.dataset.valueText);else root.removeAttribute('aria-valuetext');
  const text = ensureScaleText(root);
  text.textContent = `${value}%`;
  text.hidden = !showText;
  return true;
}

function bindProgressScale(root) {
  if (!root || root.dataset[BOUND_FLAG] === '1') return;
  renderProgressScale(root);
  root.dataset[BOUND_FLAG] = '1';
}

function unbindProgressScale(root) {
  if (!root || root.dataset[BOUND_FLAG] !== '1') return;
  delete root.dataset[BOUND_FLAG];
}

function initExistingProgressScales(target = document) {
  target.querySelectorAll(PROGRESS_SCALE_SELECTOR).forEach(bindProgressScale);
}

function setProgressScaleState(target, state = {}) {
  const root = target instanceof HTMLElement ? target.closest(PROGRESS_SCALE_SELECTOR) || target : null;
  if (!root) return false;

  if (Object.prototype.hasOwnProperty.call(state, 'value')) {
    root.dataset.value = String(normalizeProgressScaleValue(state.value));
  }

  if (Object.prototype.hasOwnProperty.call(state, 'size')) {
    root.dataset.size = normalizeProgressScaleSize(state.size);
  } // A progress indicator's colour role is its status (journal record
  // attribute-tone-to-status); tone is still read until that record leaves.


  if (Object.prototype.hasOwnProperty.call(state, 'status') || Object.prototype.hasOwnProperty.call(state, 'tone')) {
    root.dataset.tone = normalizeProgressScaleTone(state.status ?? state.tone);
  }

  if (Object.prototype.hasOwnProperty.call(state, 'showText')) {
    root.dataset.showText = String(normalizeBoolean(state.showText, true));
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

  return renderProgressScale(root);
}

function getProgressScaleState(target) {
  const root = target instanceof HTMLElement ? target.closest(PROGRESS_SCALE_SELECTOR) || target : null;
  if (!root) return null;
  return {
    value: normalizeProgressScaleValue(root.dataset.value),
    size: normalizeProgressScaleSize(root.dataset.size),
    status: normalizeProgressScaleTone(root.dataset.tone),
    tone: normalizeProgressScaleTone(root.dataset.tone),
    showText: normalizeBoolean(root.dataset.showText, true),
    label: root.getAttribute('aria-label') || '',
    valueText: root.getAttribute('aria-valuetext') || ''
  };
}

class ProgressScale extends _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__.ComponentObserver {
  static componentName = 'ProgressScale';
  html = null;

  constructor(props) {
    super(props);
    const {
      size = '1',
      value = 0,
      status,
      tone = 'primary',
      showText = true,
      label = '',
      valueText = ''
    } = this.params || {};
    const root = document.createElement('div');
    root.className = 'sf-progress-scale flex flex-col';
    root.dataset.size = normalizeProgressScaleSize(size);
    root.dataset.value = String(normalizeProgressScaleValue(value));
    root.dataset.tone = normalizeProgressScaleTone(status ?? tone);
    root.dataset.showText = String(normalizeBoolean(showText, true));
    if (String(label).trim()) root.dataset.label = String(label).trim();
    if (String(valueText).trim()) root.dataset.valueText = String(valueText).trim();
    this.template = root;
  }

  init() {
    bindProgressScale(this.template);
  }

  destroyInternal() {
    unbindProgressScale(this.template);
  }

}

(0,_register_helper__WEBPACK_IMPORTED_MODULE_1__["default"])('ProgressScale', ProgressScale);

if (typeof window !== 'undefined') {
  window.SF = window.SF || {};
  window.SF.ProgressScale = window.SF.ProgressScale || {};
  window.SF.ProgressScale.getState = getProgressScaleState;
  window.SF.ProgressScale.setState = setProgressScaleState;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initExistingProgressScales(), {
    once: true
  });
} else {
  initExistingProgressScales();
}

const progressScaleObserver = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (!(node instanceof Element)) return;
      if (node.matches?.(PROGRESS_SCALE_SELECTOR)) bindProgressScale(node);
      initExistingProgressScales(node);
    });
  });
});
progressScaleObserver.observe(document.documentElement, {
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

/***/ "f49a716b86bd"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ALIAS_KINDS: () => (/* binding */ ALIAS_KINDS),
/* harmony export */   ALIAS_MODES: () => (/* binding */ ALIAS_MODES),
/* harmony export */   aliasExpired: () => (/* binding */ aliasExpired),
/* harmony export */   propertyOf: () => (/* binding */ propertyOf),
/* harmony export */   readAliasTable: () => (/* binding */ readAliasTable)
/* harmony export */ });
// The dated alias table of one component (standard simai.smart-component
// 1.3.8 §16.20, vocabulary 1.1.5 §9): what the migration converter writes as
// <component>/aliases.json, read and checked here before core/js/aliases.js
// installs it on an element. Pure data, no DOM, so a build, a lint and the
// runtime share one reading of it.
//
// A table is a list of rows, or {tag, aliases: [rows]}. A row:
//
//   {from, to, kind, since, remove_after, mode?, when?, setting?, tag?}
//
//   kind      event | setting | attribute | action | value
//   since     the first day the new name exists, YYYY-MM-DD
//   remove_after
//             the last day the old name is promised, YYYY-MM-DD
//   mode      events only: same-detail (default) | detail-adds | split
//   when      events only, optional: {<detail field>: <value>}; the old name
//             is sent only for a new event whose detail matches (two old
//             names folded into one new name, as modal:after-hide and
//             modal:after-show into change)
//   setting   values only: the attribute the value belongs to
//
// A row that does not hold is refused with a reason, never thrown: the rest of
// the table still installs, and the refusals are reported.
const ALIAS_KINDS = Object.freeze(['event', 'setting', 'attribute', 'action', 'value']);
const ALIAS_MODES = Object.freeze(['same-detail', 'detail-adds', 'split']);
const DAY = 86400000;
const DATE = /^\d{4}-\d{2}-\d{2}$/u;
const ATTRIBUTE = /^[a-z][a-z0-9-]*$/u;
const MEMBER = /^[A-Za-z_$][\w$]*$/u;

function dateOf(text) {
  if (typeof text !== 'string' || !DATE.test(text)) return NaN;
  const time = Date.parse(`${text}T00:00:00Z`); // 2026-02-30 parses in some engines; it must print back as itself.

  return Number.isNaN(time) || new Date(time).toISOString().slice(0, 10) !== text ? NaN : time;
} // `remove_after` is the last promised day, whole, in UTC: the old name is
// open until the end of it and expired from the next midnight.


function aliasExpired(row, now = Date.now()) {
  const last = dateOf(row?.remove_after);
  return Number.isFinite(last) && now >= last + DAY;
} // kebab-case attribute -> camelCase property: backdrop-blur -> backdropBlur.

function propertyOf(attribute) {
  return String(attribute).replace(/-([a-z0-9])/gu, (_, letter) => letter.toUpperCase());
}

function primitive(value) {
  return value === null || ['string', 'number', 'boolean'].includes(typeof value);
}

function checkRow(row) {
  if (!row || typeof row !== 'object' || Array.isArray(row)) return 'not-an-object';
  const {
    from,
    to,
    kind,
    since,
    mode = 'same-detail',
    when,
    setting
  } = row;
  if (!ALIAS_KINDS.includes(kind)) return 'unknown-kind';
  if (typeof from !== 'string' || !from) return 'no-from';
  if (to === null || to === undefined || to === '') return 'no-new-name';
  if (typeof to !== 'string') return 'no-to';
  if (from === to) return 'same-name';
  const start = dateOf(since);
  const end = dateOf(row.remove_after);
  if (Number.isNaN(start)) return 'bad-since';
  if (Number.isNaN(end)) return 'bad-remove-after';
  if (end < start) return 'remove-after-before-since';
  if (!ALIAS_MODES.includes(mode)) return 'unknown-mode';
  if (kind !== 'event' && mode !== 'same-detail') return 'mode-on-non-event';

  if (when !== undefined) {
    if (kind !== 'event') return 'when-on-non-event';
    if (!when || typeof when !== 'object' || Array.isArray(when) || !Object.values(when).every(primitive)) return 'bad-when';
  }

  if (kind === 'setting' || kind === 'attribute') {
    if (!ATTRIBUTE.test(from) || !ATTRIBUTE.test(to)) return 'bad-attribute-name';
  }

  if (kind === 'action' && (!MEMBER.test(from) || !MEMBER.test(to))) return 'bad-member-name';

  if (kind === 'value') {
    if (typeof setting !== 'string' || !ATTRIBUTE.test(setting)) return 'value-needs-setting';
  } else if (setting !== undefined) {
    return 'setting-on-non-value';
  }

  return null;
}

function normal(row, tag) {
  const out = {
    kind: row.kind,
    from: row.from,
    to: row.to,
    since: row.since,
    remove_after: row.remove_after,
    tag: typeof row.tag === 'string' && row.tag ? row.tag : tag
  };

  if (row.kind === 'event') {
    out.mode = row.mode || 'same-detail';
    if (row.when) out.when = { ...row.when
    };
  }

  if (row.kind === 'value') out.setting = row.setting;
  return Object.freeze(out);
} // -> {tag, rows: [frozen rows], refused: [{index, from, to, kind, reason}]}


function readAliasTable(table, {
  tag = ''
} = {}) {
  const list = Array.isArray(table) ? table : table?.aliases;
  const owner = !Array.isArray(table) && typeof table?.tag === 'string' && table.tag || tag || '';
  const rows = [];
  const refused = [];

  if (!Array.isArray(list)) {
    refused.push({
      index: -1,
      from: null,
      to: null,
      kind: null,
      reason: 'not-a-table'
    });
    return {
      tag: owner,
      rows,
      refused
    };
  }

  const refuse = (index, row, reason) => refused.push({
    index,
    from: row?.from ?? null,
    to: row?.to ?? null,
    kind: row?.kind ?? null,
    reason
  });

  const seen = new Map();
  list.forEach((row, index) => {
    const reason = checkRow(row);
    if (reason) return refuse(index, row, reason);
    const one = normal(row, owner); // An attribute, a property or a method has one new name; an event's old
    // name may be sent beside several new ones (split, folded names).

    const identity = one.kind === 'event' ? `event|${one.from}|${one.to}|${JSON.stringify(one.when ?? null)}` : one.kind === 'value' ? `value|${one.setting}|${one.from}` : `${one.kind === 'action' ? 'action' : 'name'}|${one.from}`;
    const before = seen.get(identity);
    if (before) return refuse(index, row, before.to === one.to ? 'duplicate' : 'conflict');
    seen.set(identity, one);
    rows.push({
      index,
      row: one
    });
  }); // Two old names folded into one new name by their detail: without `when`
  // each would be sent on every new event, the wrong one among them.

  const folded = new Map();

  for (const entry of rows) {
    const {
      row
    } = entry;
    if (row.kind !== 'event' || row.mode === 'same-detail' || row.when) continue;
    folded.set(row.to, [...(folded.get(row.to) ?? []), entry]);
  }

  const ambiguous = new Set();

  for (const group of folded.values()) if (group.length > 1) for (const entry of group) ambiguous.add(entry);

  const kept = [];

  for (const entry of rows) {
    if (ambiguous.has(entry)) refuse(entry.index, entry.row, 'needs-when');else kept.push(entry.row);
  }

  refused.sort((a, b) => a.index - b.index);
  return {
    tag: owner,
    rows: kept,
    refused
  };
}

/***/ },

/***/ "28b603686dcc"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   aliasExpired: () => (/* reexport safe */ _alias_table_js__WEBPACK_IMPORTED_MODULE_1__.aliasExpired),
/* harmony export */   aliasesOf: () => (/* binding */ aliasesOf),
/* harmony export */   aliasesStrict: () => (/* binding */ aliasesStrict),
/* harmony export */   dispatchAliased: () => (/* binding */ dispatchAliased),
/* harmony export */   installAliases: () => (/* binding */ installAliases),
/* harmony export */   readAliasTable: () => (/* reexport safe */ _alias_table_js__WEBPACK_IMPORTED_MODULE_1__.readAliasTable),
/* harmony export */   setAliasClock: () => (/* binding */ setAliasClock),
/* harmony export */   uninstallAliases: () => (/* binding */ uninstallAliases)
/* harmony export */ });
/* harmony import */ var _deprecations_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("06e8cd089f28");
/* harmony import */ var _alias_table_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("f49a716b86bd");
// Dated aliases on an element (standard simai.smart-component 1.3.8 §16.20,
// §8, §16 items 6, 7, 13, 26, 32, 41; vocabulary 1.1.5 §9). When a component
// renames an event, a setting, an attribute, an action or a value, the old
// name keeps working until its `remove_after` day, and each use of it is
// noted in SF.deprecations with its dates, so a person, a probe or an AI can
// read off a running page which old names it still leans on.
//
//   const handle = SF.aliases.install(element, table, {signal});
//   SF.aliases.dispatch(element, 'sf-menu-navigate', {detail, cancelable: true});
//   handle.uninstall();   // or abort `signal`
//
// The table is a component's aliases.json (core/js/alias-table.js reads it).
// What an installed element does:
//
// Events.
//   - One dispatch sends the new name first, then each open old name, with
//     the same `detail` object and the same bubbles / composed / cancelable.
//   - Cancel is shared: preventDefault() on any of them cancels all at once,
//     so a listener that runs later on the other name already sees
//     defaultPrevented, and the dispatch answers false.
//   - stopPropagation() is not shared: the names have different listeners.
//   - It works for today's components without a change in them: the element's
//     own dispatchEvent is wrapped, so a component that still sends the old
//     name (sf-accordion:toggle) sends the new one first through the shim, and
//     a component that sends the new name has the old ones follow. The event
//     object the component made is the one dispatched under its name, so a
//     component that reads its own event's defaultPrevented sees the shared
//     cancel.
//   - A use is a listener that touches the old event (its detail, target,
//     currentTarget, composedPath, preventDefault or the stop methods). It is
//     noted once per dispatch, into one record per name. An old event that
//     nobody listens to is not a use, so a page that moved is not reported.
//     No global prototype is patched to learn this.
//   - `detail-adds` sends the new, larger detail to the old name too: the old
//     fields are all there. `when` sends an old name only for a matching
//     detail (two old names folded into one new name). `split` needs an
//     adapter that makes the old detail from the new one; without it the row
//     is refused. A component that sends the old name of a `detail-adds` or
//     `split` row is not promoted: its old detail cannot make the new one.
//
// Settings and attributes. Writing the old attribute writes the new one (the
// component hears the new one); writing the new one updates the old one when
// the page still has it, so getAttribute(old) stays true. Equal values are
// never written again, which is what ends a round. A setting also gets its
// property: the old property reads and writes the new one.
//
// Actions. The old method calls the new one with the same arguments.
//
// Values. An attribute set to an old value is written with the new one.
//
// A name that the browser's own element owns (title, blur, spellcheck,
// remove, …) is not shadowed as a property or a method unless the component
// already overrides it: the attribute alias still works.
//
// Expiry (decision, §16.20 "after that date the old name is expired"). After
// `remove_after` an old name is `expired`: it is still delivered in 1.x, its
// record carries `expired: true` and a console warning is printed once
// whatever the page opted into. A date passing in a running page must not
// break it between two deploys, and dropping a name inside a major is the
// sweep's job: the release that deletes the row is the removal, under the
// change journal. A page or a host that wants to rehearse the sweep sets
// strict mode, <html data-sf-aliases="strict"> or SF.aliases.strict = true:
// an expired old name is then not delivered — its events are not sent, its
// attribute is not mapped, its property reads undefined, its method throws.
//
// Every bundle carries its own copy of this module, so all state lives on the
// shared global (SF.__aliases, not enumerable) and the first copy's API stays
// on SF.aliases; nothing else is added to the page. Per element state is in a
// WeakMap, the wrappers are own properties of the element and leave with
// uninstall(), and the only listener is on the caller's AbortSignal, itself
// removed by an AbortController of the install.



const VERSION = 1;
const WRAPPED = ['dispatchEvent', 'setAttribute', 'removeAttribute', 'toggleAttribute'];
const TOUCH_GETTERS = ['detail', 'target', 'currentTarget', 'srcElement'];
const TOUCH_METHODS = ['composedPath', 'preventDefault', 'stopPropagation', 'stopImmediatePropagation'];

function shared() {
  const SF = globalThis.SF = globalThis.SF || {};

  if (!SF.__aliases || typeof SF.__aliases !== 'object') {
    Object.defineProperty(SF, '__aliases', {
      configurable: true,
      enumerable: false,
      writable: false,
      value: {
        elements: new WeakMap(),
        ours: new WeakSet(),
        now: () => Date.now()
      }
    });
  }

  return SF.__aliases;
} // A test or a sweep rehearsal sets the clock; null puts the real one back.


function setAliasClock(clock) {
  shared().now = typeof clock === 'function' ? clock : () => Date.now();
}
function aliasesStrict() {
  return globalThis.document?.documentElement?.dataset?.sfAliases === 'strict' || globalThis.SF?.aliases?.strict === true;
}

function life(row) {
  const expired = (0,_alias_table_js__WEBPACK_IMPORTED_MODULE_1__.aliasExpired)(row, shared().now());
  return {
    expired,
    usable: !expired || !aliasesStrict()
  };
}

function note(row, expired) {
  const attribute = row.kind === 'value' ? row.setting : row.kind === 'setting' || row.kind === 'attribute' ? row.from : '';
  (0,_deprecations_js__WEBPACK_IMPORTED_MODULE_0__.noteDeprecated)({
    component: row.tag,
    tag: row.tag,
    kind: row.kind,
    attribute,
    from: row.from,
    to: row.to,
    since: row.since,
    remove_after: row.remove_after,
    ...(expired ? {
      expired: true
    } : {})
  });
} // --- events ---------------------------------------------------------------


const eventGet = name => Object.getOwnPropertyDescriptor(globalThis.Event.prototype, name)?.get;

const nativePrevent = () => globalThis.Event.prototype.preventDefault;

function flagsOf(event) {
  return {
    bubbles: eventGet('bubbles').call(event),
    cancelable: eventGet('cancelable').call(event),
    composed: eventGet('composed').call(event)
  };
}

function detailOf(event) {
  const get = globalThis.CustomEvent && Object.getOwnPropertyDescriptor(globalThis.CustomEvent.prototype, 'detail')?.get;
  return get && event instanceof globalThis.CustomEvent ? get.call(event) : null;
}

function matches(detail, when) {
  if (!when) return true;
  if (!detail || typeof detail !== 'object') return false;
  return Object.entries(when).every(([field, value]) => detail[field] === value);
}

function makeEvent(element, type, detail, flags) {
  const Custom = element.ownerDocument?.defaultView?.CustomEvent ?? globalThis.CustomEvent;
  return new Custom(type, { ...flags,
    detail
  });
} // The first touch of an old event by a listener is a use of the old name.


function instrument(event, row, expired, detail) {
  let used = false;

  const use = () => {
    if (used) return;
    used = true;
    note(row, expired);
  };

  for (const name of TOUCH_GETTERS) {
    const get = name === 'detail' ? () => detail : eventGet(name);
    if (!get) continue;
    Object.defineProperty(event, name, {
      configurable: true,

      get() {
        use();
        return get.call(this);
      }

    });
  }

  for (const name of TOUCH_METHODS) {
    const method = event[name];
    if (typeof method !== 'function') continue;
    Object.defineProperty(event, name, {
      configurable: true,
      writable: true,

      value(...args) {
        use();
        return method.apply(this, args);
      }

    });
  }
}

function shareCancel(events) {
  const cancel = nativePrevent();

  for (const event of events) {
    Object.defineProperty(event, 'preventDefault', {
      configurable: true,
      writable: true,

      value() {
        for (const one of events) cancel.call(one);
      }

    });
  }
} // The old events that go with one new event: open (or expired outside strict)
// rows whose `when` matches, made from the same detail, or from the adapter's
// detail for a split row. `own` is the component's own event when it sent an
// old name: it is reused under that name.


function oldEventsFor(state, element, newType, detail, flags, own) {
  const out = [];
  const names = new Set();

  for (const row of state.byNew.get(newType) ?? []) {
    if (names.has(row.from) || !matches(detail, row.when)) continue;
    const {
      expired,
      usable
    } = life(row);
    if (!usable) continue;
    let oldDetail = detail;

    if (row.mode === 'split') {
      oldDetail = state.adapters[row.from]?.(detail, newType);
      if (oldDetail === undefined) continue;
    }

    names.add(row.from);
    const event = own && own.type === row.from && oldDetail === detail ? own : makeEvent(element, row.from, oldDetail, flags);
    out.push({
      event,
      row,
      expired,
      detail: oldDetail
    });
  }

  return out;
} // Sends the new event, then the old ones, with one cancel. The cancel is
// shared first and the old events instrumented after, so a listener's
// preventDefault() on an old name both cancels all and counts as a use.


function deliver(state, element, first, olds, alsoCancel = []) {
  const ours = shared().ours;
  const events = [first, ...olds.map(one => one.event)];
  const all = [...events, ...alsoCancel.filter(event => !events.includes(event))];
  if (all.some(event => eventGet('cancelable').call(event))) shareCancel(all);

  for (const one of olds) instrument(one.event, one.row, one.expired, one.detail);

  for (const event of events) {
    ours.add(event);
    state.native.dispatchEvent.call(element, event);
  }

  const prevented = eventGet('defaultPrevented');
  return !all.some(event => prevented.call(event));
}

function wrappedDispatch(state, element, event) {
  const native = state.native.dispatchEvent;
  if (!event || shared().ours.has(event)) return native.call(element, event);
  const type = event.type;

  if (state.byNew.has(type)) {
    const detail = detailOf(event);
    return deliver(state, element, event, oldEventsFor(state, element, type, detail, flagsOf(event), null));
  }

  const rows = state.byOld.get(type);
  if (!rows) return native.call(element, event);
  const detail = detailOf(event);
  const flags = flagsOf(event); // An old name with one plain new name is promoted: the new name first.

  const targets = new Set(rows.filter(row => row.mode === 'same-detail' && !row.when).map(row => row.to));

  if (targets.size === 1 && rows.every(row => row.mode === 'same-detail' && !row.when)) {
    const [to] = targets;
    const fresh = makeEvent(element, to, detail, flags);
    const olds = oldEventsFor(state, element, to, detail, flags, event); // A strict page whose old name expired still has the component's own
    // event in the cancel group, though it is not sent.

    return deliver(state, element, fresh, olds, [event]);
  } // Not promotable (detail-adds, split, folded): delivered as it is, a use
  // noted when touched.


  const {
    expired,
    usable
  } = life(rows[0]);
  if (!usable) return true;
  instrument(event, rows[0], expired, detail);
  shared().ours.add(event);
  return native.call(element, event);
} // --- attributes, values -----------------------------------------------------


function mapValue(state, attribute, value, {
  quiet = false
} = {}) {
  const row = state.values.get(attribute)?.get(String(value));
  if (!row) return value;
  const {
    expired,
    usable
  } = life(row);
  if (!quiet) note(row, expired);
  return usable ? row.to : value;
}

function writeIfDifferent(state, element, name, value) {
  const text = String(value);
  if (state.native.getAttribute.call(element, name) !== text) state.native.setAttribute.call(element, name, text);
}

function removeIfPresent(state, element, name) {
  if (state.native.hasAttribute.call(element, name)) state.native.removeAttribute.call(element, name);
}

function wrappedSet(state, element, name, value) {
  const attribute = String(name).toLowerCase();
  const row = state.attrByOld.get(attribute);

  if (row) {
    const {
      expired,
      usable
    } = life(row);
    note(row, expired);
    state.native.setAttribute.call(element, attribute, value);
    if (usable) writeIfDifferent(state, element, row.to, mapValue(state, row.to, value));
    return;
  }

  const mapped = mapValue(state, attribute, value);
  state.native.setAttribute.call(element, attribute, mapped);

  for (const old of state.attrByNew.get(attribute) ?? []) {
    if (state.native.hasAttribute.call(element, old.from)) writeIfDifferent(state, element, old.from, mapped);
  }
}

function wrappedRemove(state, element, name) {
  const attribute = String(name).toLowerCase();
  const row = state.attrByOld.get(attribute);
  state.native.removeAttribute.call(element, attribute);

  if (row) {
    const {
      expired,
      usable
    } = life(row);
    note(row, expired);
    if (usable) removeIfPresent(state, element, row.to);
    return;
  }

  for (const old of state.attrByNew.get(attribute) ?? []) removeIfPresent(state, element, old.from);
}

function wrappedToggle(state, element, name, force) {
  const attribute = String(name).toLowerCase();
  const has = state.native.hasAttribute.call(element, attribute);
  const want = force === undefined ? !has : Boolean(force);
  if (want && !has) wrappedSet(state, element, attribute, '');
  if (!want && has) wrappedRemove(state, element, attribute);
  return want;
} // Changes that did not come through the element's own methods (the parser,
// an Attr node, a framework that calls the prototype): the later change of
// each name wins, and only differing values are written.


function reconcile(state, element, records) {
  const last = new Map();
  records.forEach((record, order) => last.set(record.attributeName, order));
  const names = [...last.keys()].sort((a, b) => last.get(a) - last.get(b));

  const has = name => state.native.hasAttribute.call(element, name);

  const get = name => state.native.getAttribute.call(element, name);

  for (const name of names) {
    const row = state.attrByOld.get(name);

    if (row) {
      const {
        expired,
        usable
      } = life(row);
      if (!usable) continue;

      if (has(name)) {
        if (get(row.to) !== mapValue(state, row.to, get(name), {
          quiet: true
        })) {
          note(row, expired);
          writeIfDifferent(state, element, row.to, mapValue(state, row.to, get(name)));
        }
      } else {
        removeIfPresent(state, element, row.to);
      }

      continue;
    }

    if (state.values.has(name) && has(name)) {
      const mapped = mapValue(state, name, get(name));
      if (mapped !== get(name)) writeIfDifferent(state, element, name, mapped);
    }

    for (const old of state.attrByNew.get(name) ?? []) {
      // The old name changed after this one: its own turn decides.
      if (!has(old.from) || (last.get(old.from) ?? -1) > last.get(name)) continue;
      if (has(name)) writeIfDifferent(state, element, old.from, get(name));else state.native.removeAttribute.call(element, old.from);
    }
  }
} // What the markup already holds: an old attribute is a use and fills the new
// one when that is absent (a new one the page also wrote wins); an old value
// is rewritten.


function adopt(state, element) {
  const has = name => state.native.hasAttribute.call(element, name);

  const get = name => state.native.getAttribute.call(element, name);

  for (const [name, row] of state.attrByOld) {
    if (!has(name)) continue;
    const {
      expired,
      usable
    } = life(row);
    note(row, expired);
    if (usable && !has(row.to)) writeIfDifferent(state, element, row.to, mapValue(state, row.to, get(name)));
  }

  for (const name of state.values.keys()) {
    if (has(name)) writeIfDifferent(state, element, name, mapValue(state, name, get(name)));
  }
} // --- members -----------------------------------------------------------------


function nativePrototypes() {
  const protos = new Set([Object.prototype]);

  for (let proto = globalThis.HTMLElement?.prototype; proto; proto = Object.getPrototypeOf(proto)) protos.add(proto);

  if (globalThis.EventTarget) protos.add(globalThis.EventTarget.prototype);
  return protos;
} // May `name` be defined on the element? Not when the browser's element owns
// it and the component does not override it.


function ownableMember(element, name) {
  const natives = nativePrototypes();

  for (let proto = Object.getPrototypeOf(element); proto; proto = Object.getPrototypeOf(proto)) {
    if (Object.prototype.hasOwnProperty.call(proto, name)) return !natives.has(proto);
  }

  return true;
}

function defineOwn(state, element, name, descriptor) {
  const before = Object.getOwnPropertyDescriptor(element, name);
  state.restore.push(() => {
    delete element[name];
    if (before) Object.defineProperty(element, name, before);
  });
  Object.defineProperty(element, name, {
    configurable: true,
    enumerable: false,
    ...descriptor
  });
  return before;
}

function writable(element, name) {
  for (let object = element; object; object = Object.getPrototypeOf(object)) {
    const own = Object.getOwnPropertyDescriptor(object, name);
    if (own) return Boolean(own.set) || own.writable === true;
  }

  return true;
} // Today's Smart base exposes a setting as a read-only property over its
// attribute; such a setting is written through the attribute.


function writeSetting(state, element, row, property, value) {
  if (writable(element, property)) {
    element[property] = value;
  } else if (value === null || value === undefined || value === false) {
    removeIfPresent(state, element, row.to);
  } else {
    writeIfDifferent(state, element, row.to, value === true ? '' : typeof value === 'object' ? JSON.stringify(value) : value);
  }
}

function installProperty(state, element, row, refuse) {
  const from = (0,_alias_table_js__WEBPACK_IMPORTED_MODULE_1__.propertyOf)(row.from);
  const to = (0,_alias_table_js__WEBPACK_IMPORTED_MODULE_1__.propertyOf)(row.to);
  if (!ownableMember(element, from)) return refuse(row, 'native-member');
  if (!(to in element)) return refuse(row, 'no-new-property');
  const before = defineOwn(state, element, from, {
    get() {
      const {
        expired,
        usable
      } = life(row);
      note(row, expired);
      return usable ? element[to] : undefined;
    },

    set(value) {
      const {
        expired,
        usable
      } = life(row);
      note(row, expired);
      if (usable) writeSetting(state, element, row, to, value);
    }

  }); // A value the page set before the element was installed moves to the new name.

  if (before && 'value' in before && before.value !== undefined) element[from] = before.value;
  return true;
}

function installAction(state, element, row, refuse) {
  if (!ownableMember(element, row.from)) return refuse(row, 'native-member');
  if (typeof element[row.to] !== 'function') return refuse(row, 'no-new-action');
  defineOwn(state, element, row.from, {
    writable: true,

    value(...args) {
      const {
        expired,
        usable
      } = life(row);
      note(row, expired);
      if (!usable) throw new TypeError(`[SIMAI Framework] ${row.tag || element.localName}: ${row.from}() was removed after ${row.remove_after}; call ${row.to}().`);
      return element[row.to](...args);
    }

  });
  return true;
} // --- install ----------------------------------------------------------------


function uninstallAliases(element) {
  const store = shared();
  const state = element && store.elements.get(element);
  if (!state) return false;
  store.elements.delete(element);
  state.observer?.disconnect();
  state.controller.abort();

  for (const restore of state.restore.reverse()) restore();

  return true;
}
function installAliases(element, table, {
  signal,
  adapters = {},
  tag
} = {}) {
  if (!element || typeof element.dispatchEvent !== 'function') throw new TypeError('[SIMAI Framework] SF.aliases.install needs an element');
  uninstallAliases(element);
  const read = (0,_alias_table_js__WEBPACK_IMPORTED_MODULE_1__.readAliasTable)(table, {
    tag: tag || element.localName || ''
  });
  const refused = [...read.refused];
  const handle = {
    installed: 0,
    refused,
    uninstall: () => uninstallAliases(element)
  };
  if (signal?.aborted) return handle;
  const state = {
    rows: read.rows,
    adapters,
    byNew: new Map(),
    byOld: new Map(),
    attrByOld: new Map(),
    attrByNew: new Map(),
    values: new Map(),
    restore: [],
    controller: new AbortController(),
    observer: null,
    native: {}
  };

  for (const name of [...WRAPPED, 'getAttribute', 'hasAttribute']) state.native[name] = element[name];

  const refuse = (row, reason) => {
    refused.push({
      index: -1,
      from: row.from,
      to: row.to,
      kind: row.kind,
      reason
    });
    return false;
  };

  const push = (map, key, row) => map.set(key, [...(map.get(key) ?? []), row]);

  for (const row of read.rows) {
    if (row.kind === 'event') {
      if (row.mode === 'split' && typeof adapters[row.from] !== 'function') {
        refuse(row, 'needs-adapter');
        continue;
      }

      push(state.byNew, row.to, row);
      push(state.byOld, row.from, row);
      handle.installed += 1;
    } else if (row.kind === 'setting' || row.kind === 'attribute') {
      if (typeof state.native.setAttribute !== 'function') {
        refuse(row, 'no-attributes');
        continue;
      }

      state.attrByOld.set(row.from, row);
      push(state.attrByNew, row.to, row);
      handle.installed += 1;
      if (row.kind === 'setting') installProperty(state, element, row, refuse);
    } else if (row.kind === 'value') {
      if (!state.values.has(row.setting)) state.values.set(row.setting, new Map());
      state.values.get(row.setting).set(row.from, row);
      handle.installed += 1;
    } else if (row.kind === 'action' && installAction(state, element, row, refuse)) {
      handle.installed += 1;
    }
  }

  if (state.byNew.size) {
    defineOwn(state, element, 'dispatchEvent', {
      writable: true,
      value: event => wrappedDispatch(state, element, event)
    });
  }

  const attributes = state.attrByOld.size || state.values.size;

  if (attributes) {
    defineOwn(state, element, 'setAttribute', {
      writable: true,
      value: (name, value) => wrappedSet(state, element, name, value)
    });
    defineOwn(state, element, 'removeAttribute', {
      writable: true,
      value: name => wrappedRemove(state, element, name)
    });

    if (typeof state.native.toggleAttribute === 'function') {
      defineOwn(state, element, 'toggleAttribute', {
        writable: true,
        value: (name, force) => wrappedToggle(state, element, name, force)
      });
    }

    adopt(state, element);
    const Observer = element.ownerDocument?.defaultView?.MutationObserver ?? globalThis.MutationObserver;

    if (typeof Observer === 'function') {
      const filter = [...new Set([...state.attrByOld.keys(), ...state.attrByNew.keys(), ...state.values.keys()])];
      state.observer = new Observer(records => reconcile(state, element, records));
      state.observer.observe(element, {
        attributes: true,
        attributeFilter: filter
      });
    }
  }

  shared().elements.set(element, state);
  signal?.addEventListener?.('abort', () => uninstallAliases(element), {
    once: true,
    signal: state.controller.signal
  });
  return handle;
} // For code that sends an event by name: through the element's aliases when
// it has them, a plain dispatch when it has none. Answers false when cancelled.

function dispatchAliased(element, name, {
  detail = null,
  bubbles = true,
  composed = true,
  cancelable = false
} = {}) {
  return element.dispatchEvent(makeEvent(element, name, detail, {
    bubbles,
    composed,
    cancelable
  }));
}
function aliasesOf(element) {
  return [...(shared().elements.get(element)?.rows ?? [])];
} // The first copy's API stays; every copy shares the state.

if (typeof globalThis !== 'undefined') {
  globalThis.SF = globalThis.SF || {};
  const current = globalThis.SF.aliases;

  if (!current || typeof current.install !== 'function') {
    globalThis.SF.aliases = {
      version: VERSION,
      strict: current?.strict === true,
      install: installAliases,
      uninstall: uninstallAliases,
      dispatch: dispatchAliased,
      of: aliasesOf,
      read: _alias_table_js__WEBPACK_IMPORTED_MODULE_1__.readAliasTable,
      expired: (row, now) => (0,_alias_table_js__WEBPACK_IMPORTED_MODULE_1__.aliasExpired)(row, now ?? shared().now())
    };
  }
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

/***/ "59da34819c8b"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   camelName: () => (/* binding */ camelName),
/* harmony export */   elementFromManifest: () => (/* binding */ elementFromManifest),
/* harmony export */   eventName: () => (/* binding */ eventName),
/* harmony export */   propsFromManifest: () => (/* binding */ propsFromManifest),
/* harmony export */   readManifest: () => (/* binding */ readManifest),
/* harmony export */   toOutcome: () => (/* binding */ toOutcome)
/* harmony export */ });
/* harmony import */ var _aliases_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("28b603686dcc");
/* harmony import */ var _page_language_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("0d662e4d7d63");
/* harmony import */ var _page_actions_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("51e3a200cf5f");
/* harmony import */ var _host_port_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("f171c5ece4b4");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_page_language_js__WEBPACK_IMPORTED_MODULE_1__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
_page_language_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var _page_language_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_page_language_js__WEBPACK_IMPORTED_MODULE_1__);
// An element from its manifest (standard simai.smart-component 1.3.8 §3, §4,
// §4.1, §4.4, §7.7, §8, §11, §17.1).
//
// A component folder holds component.json, its language files and its
// aliases.json; the element's attribute and property code, the methods of its
// actions and the names of its events are not written by hand but made from
// them here:
//
//   import manifest from './component.json';
//   import en from './lang/en.json';
//   import ru from './lang/ru.json';
//   import aliases from './aliases.json';
//   const Base = elementFromManifest(manifest, {base: SfBaseElement, lang: {en, ru}, aliases, actions: {...}});
//   class SfThing extends Base { ...behaviour only... }
//
// Why at load and not in the build: ui-builder compiles a Smart component's
// index.js with webpack and babel and transforms nothing of its own, so the
// JSON files are bundled as they are (webpack reads JSON imports) and the
// plumbing is made once per class when the bundle runs. A build step can take
// this over later without a change in the components: the input is the same
// manifest.
//
// What the class gets:
//
// - settings (§4): an attribute and a property per setting, typed (`string`,
//   `enum`, `boolean`, `number`, `icon`, `date`, `id`; `list`, `object` and
//   `state` are properties only); a setting with `"default-from":
//   "runtime.<word>"` defaults to that word in the element's language;
// - values (§4, §4.3): a value with a default is also a setting of the same
//   name; the others are read-only properties that a component overrides with
//   its own getter;
// - events (§8): `sfEmit(verb, detail)` sends `<tag>-<verb>`, or the native
//   name for `change`, `input` and `"carries": "native"` (with the detail
//   when one is given), through the dated aliases, so the old names follow;
// - actions (§4.4): one method per action that takes its `with` parameters as
//   one object or in declared order and answers an outcome, `{outcome:
//   'applied'}` or `{outcome: 'refused', reason}`; `"emits"` sends its event
//   once first, and a page that cancels it makes the action refused; a
//   waiting action whose instance is removed answers `cancelled`;
// - the base action `connect-port {port}` (§4.1, §4.9): `connectPort(port)`,
//   `setHostPort` its alias, the port kept on the instance's scope and read
//   as `sfPort`, the component's `onPortConnected(port, {signal})` its hook
//   (core/js/host-port.js; the Smart base has it, another base gets it here);
// - the base values `shown` and `started` (§4.1) and the host state
//   `data-sf-started`; `sfHostState(name, on)` writes the declared
//   `host-states` (§5.3);
// - static `aliases` from aliases.json (§16.20), installed by the base;
// - words (§11, §11.1): `sfWord(key, {count, vars})`, with the element's own
//   word first, then the nearest [lang], the page's choice, <html lang>,
//   English, the source language and the key;
// - a form control (§17.1): `formAssociated` and ElementInternals where the
//   browser has them; `sfFormValue()` is what the form gets.
//
// Members the runtime adds start with `sf`, which no manifest name may
// (§3.1), so a generated setting or action never collides with them.




const RESERVED = new Set(['props', 'api', 'view', 'scope', 'parts', 'receive', 'render', 'connected', 'disconnected', 'updated', 'outside', 'data', 'template', 'root-class', 'root-style', 'focus', 'blur', 'connect-port', 'shown', 'started']);
const PROPERTY_ONLY = new Set(['list', 'object', 'state']); // core/js/smart-base.js toBoolean: what an attribute value means as true.

const TRUE_WORDS = new Set(['1', 'true', 'yes', 'on', 'checked', 'disabled', 'download', 'indeterminate', 'multiple']);
const camelName = name => String(name).replace(/-([a-z0-9])/gu, (_, letter) => letter.toUpperCase());

const isPlainObject = value => value !== null && typeof value === 'object' && !Array.isArray(value) && Object.getPrototypeOf(value) === Object.prototype; // The browser's own members (§3.1): read from the prototype, never from a copy.


function isNativeMember(property) {
  let proto = globalThis.HTMLElement?.prototype;

  while (proto) {
    if (Object.prototype.hasOwnProperty.call(proto, property)) return true;
    proto = Object.getPrototypeOf(proto);
  }

  return false;
} // The browser's own names a field reports under (§8, §17.3): a page listens
// for `change` and `input` on any form control, ours included, so they keep
// those names whatever they carry -- a detail when the component gives one,
// never `<tag>-change`. A component that holds other content and is no value
// control (sf-tabs, sf-steps, sf-pagination) declares `"x-native": false` on
// the event: it sends `<tag>-change`, so a field's change bubbling out of a
// panel is never taken for its own.


const NATIVE_EVENTS = new Set(['change', 'input']);
/** The DOM name of an event the manifest declares by its verb (§8). */

function eventName(manifest, verb) {
  const declared = manifest?.events?.[verb];
  if (declared?.carries === 'native') return verb;
  if (NATIVE_EVENTS.has(verb) && declared?.['x-native'] !== false) return verb;
  return `${manifest.tag}-${verb}`;
}
/** An action's answer as an outcome (§4.4, vocabulary §3.1). */

function toOutcome(result) {
  if (result === undefined || result === null || result === true) return {
    outcome: 'applied'
  };
  if (result === false) return {
    outcome: 'refused',
    reason: 'refused'
  };

  if (typeof result === 'string') {
    return ['applied', 'cancelled', 'conflict', 'unavailable'].includes(result) ? {
      outcome: result
    } : {
      outcome: 'refused',
      reason: result
    };
  }

  if (typeof result === 'object' && typeof result.outcome === 'string') return result;
  return {
    outcome: 'applied',
    value: result
  };
}

function typedDefault(spec) {
  if (Object.prototype.hasOwnProperty.call(spec, 'default')) return spec.default;

  switch (spec.type) {
    case 'boolean':
      return false;

    case 'number':
      return 0;

    case 'list':
      return [];

    case 'object':
    case 'state':
      return {};

    case 'enum':
      return spec.values?.[0] ?? '';

    default:
      return '';
  }
}

function runtimeWordOf(spec) {
  const from = spec?.['default-from'];
  return typeof from === 'string' && from.startsWith('runtime.') ? from.slice('runtime.'.length) : '';
}
/**
 * The members a manifest declares, read once: what the element exposes and
 * how each name is spelled on it.
 */


function readManifest(manifest) {
  if (!manifest || typeof manifest !== 'object' || !manifest.tag) {
    throw new TypeError('elementFromManifest: a manifest with a tag is required');
  }

  const members = [];
  const refused = [];

  const take = (part, name, spec, writable) => {
    const property = camelName(name);

    if (RESERVED.has(name) || name.startsWith('_') || name.startsWith('sf')) {
      refused.push({
        part,
        name,
        reason: 'reserved'
      });
      return;
    }

    members.push({
      part,
      name,
      property,
      type: spec.type || 'string',
      values: Array.isArray(spec.values) ? spec.values : null,
      default: typedDefault(spec),
      optional: spec.optional === true,
      attribute: PROPERTY_ONLY.has(spec.type) ? '' : name,
      writable,
      word: runtimeWordOf(spec),
      native: isNativeMember(property)
    });
  };

  for (const [name, spec] of Object.entries(manifest.settings || {})) take('settings', name, spec || {}, true);

  for (const [name, spec] of Object.entries(manifest.values || {})) {
    // A value a person changes is also writable as a setting (§4); one that
    // only shows (effective-*) is read.
    const writable = Object.prototype.hasOwnProperty.call(spec || {}, 'default') || Boolean(spec?.['default-from']);
    take('values', name, spec || {}, writable && !name.startsWith('effective-'));
  }

  const events = Object.fromEntries(Object.entries(manifest.events || {}).map(([verb, spec]) => [verb, {
    verb,
    name: eventName(manifest, verb),
    cancelable: spec?.cancelable === true,
    native: NATIVE_EVENTS.has(verb) || spec?.carries === 'native'
  }]));
  const actions = Object.entries(manifest.actions || {}).map(([name, spec]) => ({
    name,
    method: camelName(name),
    with: Object.keys(spec?.with || {}),
    emits: spec?.emits || ''
  }));
  return {
    tag: manifest.tag,
    members,
    events,
    actions,
    refused,
    hostStates: { ...(manifest['host-states'] || {})
    },
    form: manifest.form || null
  };
}
/** The base's `props` for the members that live in attributes or properties. */

function propsFromManifest(manifest) {
  const {
    members
  } = readManifest(manifest);
  const props = {};

  for (const member of members) {
    if (!member.writable) continue;
    const config = {
      default: member.default,
      attribute: member.attribute || false
    };
    if (member.type === 'boolean') config.type = Boolean;else if (member.type === 'number') config.type = Number;else if (member.type === 'list') config.type = Array;else if (PROPERTY_ONLY.has(member.type)) config.type = Object;
    if (member.values) config.values = member.values;

    if (PROPERTY_ONLY.has(member.type)) {
      config.parser = function readProperty(raw, fallback, element) {
        const store = element?.__sfManifestData;
        return store && Object.prototype.hasOwnProperty.call(store, member.name) ? store[member.name] : fallback;
      };
    } else if (member.word) {
      config.parser = function readWord(raw, fallback, element) {
        return raw !== undefined && raw !== null ? raw : element.sfWord(member.word);
      };
    }

    props[member.property] = config;
  }

  return props;
}

function readAttribute(element, member) {
  const raw = element.getAttribute(member.attribute);

  if (member.type === 'boolean') {
    if (raw === null) return member.optional && member.default === undefined ? undefined : Boolean(member.default); // The base's reading, so the template and the property agree: present
    // and empty is true, then the words the base takes for true.

    return raw === '' || TRUE_WORDS.has(raw.toLowerCase());
  }

  if (raw === null) return member.word ? element.sfWord(member.word) : member.default;

  if (member.type === 'number') {
    const number = Number(raw);
    return raw.trim() !== '' && Number.isFinite(number) ? number : member.default;
  }

  if (member.values && !member.values.includes(raw)) return member.default;
  return raw;
}

function writeAttribute(element, member, value) {
  if (value === null || value === undefined) {
    element.removeAttribute(member.attribute);
    return;
  }

  if (member.type === 'boolean') {
    // An optional boolean keeps «off» as a value of its own (§4.2), and so
    // does one that is on by default: taking the attribute away would read
    // as the default, on (sf-pagination's count-known, total-exact).
    if (value) element.setAttribute(member.attribute, '');else if (member.optional || member.default === true) element.setAttribute(member.attribute, 'false');else element.removeAttribute(member.attribute);
    return;
  }

  element.setAttribute(member.attribute, String(value));
}

function defineMembers(target, members) {
  for (const member of members) {
    // The browser's own members stay the browser's (§3.1); a component that
    // must answer one writes its own accessor.
    if (member.native) continue;

    if (!member.writable) {
      Object.defineProperty(target, member.property, {
        configurable: true,

        get() {
          return member.default;
        }

      });
      continue;
    }

    if (!member.attribute) {
      Object.defineProperty(target, member.property, {
        configurable: true,

        get() {
          const store = this.__sfManifestData;
          return store && Object.prototype.hasOwnProperty.call(store, member.name) ? store[member.name] : member.default;
        },

        set(value) {
          if (!this.__sfManifestData) this.__sfManifestData = {};
          this.__sfManifestData[member.name] = value;
          this.requestComponentUpdate?.(member.name);
        }

      });
      continue;
    }

    Object.defineProperty(target, member.property, {
      configurable: true,

      get() {
        return readAttribute(this, member);
      },

      set(value) {
        writeAttribute(this, member, value);
      }

    });
  }
}

function parameters(action, args) {
  if (args.length === 1 && isPlainObject(args[0]) && (action.with.length !== 1 || Object.keys(args[0]).every(key => action.with.includes(key)))) {
    return { ...args[0]
    };
  }

  return Object.fromEntries(action.with.map((name, index) => [name, args[index]]));
}

function defineActions(target, actions, implementations, events) {
  for (const action of actions) {
    if (isNativeMember(action.method)) continue;
    const run = implementations?.[action.name];
    Object.defineProperty(target, action.method, {
      configurable: true,
      writable: true,
      value: function generatedAction(...args) {
        const params = parameters(action, args);

        if (action.emits) {
          const event = events[action.emits];
          const allowed = this.sfEmit(action.emits, params, {
            cancelable: event?.cancelable ?? true
          });
          if (!allowed) return {
            outcome: 'refused',
            reason: 'prevented'
          };
        }

        if (typeof run !== 'function') {
          globalThis.console?.warn?.(`[SIMAI Framework] ${this.localName}: action ${action.name} has no code`);
          return {
            outcome: 'refused',
            reason: 'not-implemented'
          };
        }

        let result;

        try {
          result = run.call(this, params, {
            signal: this.sfScope
          });
        } catch (error) {
          this.reportComponentError?.(error, `action ${action.name}`);
          return {
            outcome: 'refused',
            reason: 'error'
          };
        }

        if (result && typeof result.then === 'function') {
          const signal = this.sfScope;
          return Promise.resolve(result).then(value => signal?.aborted ? {
            outcome: 'cancelled'
          } : toOutcome(value), error => {
            if (signal?.aborted || error?.name === 'AbortError') return {
              outcome: 'cancelled'
            };
            this.reportComponentError?.(error, `action ${action.name}`);
            return {
              outcome: 'refused',
              reason: 'error'
            };
          });
        }

        return toOutcome(result);
      }
    });
  }
} // The nearest closed container (§7.2.1): `hidden`, a closed <details> or
// <dialog>. What has no box in an opened container is not shown.


function isShown(element) {
  if (!element.isConnected) return false;

  for (let node = element; node && node.nodeType === 1; node = node.parentElement || node.getRootNode?.()?.host) {
    if (node.hidden) return false;
    const tag = node.localName;
    if (node !== element && (tag === 'details' || tag === 'dialog') && !node.open) return false;
  }

  return true;
}
/**
 * The class a component extends: its manifest's plumbing over `base`.
 *
 * options:
 *   base      the class to extend (the Smart base, or a trait over it);
 *   lang      `{<locale>: <lang file>}`; the `runtime` words are the element's;
 *   source    the language the component was written in (the fallback before
 *             the key; default the first file that `lang` names);
 *   aliases   the component's aliases.json;
 *   actions   `{<action>(params, {signal}) => outcome}`, the actions' code.
 */


function elementFromManifest(manifest, {
  base,
  lang = {},
  source,
  aliases,
  actions = {}
} = {}) {
  const Base = base || globalThis.SF?.smart?.SfBaseElement;
  if (typeof Base !== 'function') throw new TypeError('elementFromManifest: a base class is required');
  const read = readManifest(manifest);
  const generatedProps = propsFromManifest(manifest);
  const words = Object.fromEntries(Object.entries(lang).map(([locale, file]) => [locale.toLowerCase(), { ...(file?.runtime || {})
  }]));
  const sourceLanguage = source || Object.keys(words)[0] || '';
  const formAssociated = Boolean(read.form) && typeof globalThis.ElementInternals === 'function' && typeof globalThis.ElementInternals.prototype?.setFormValue === 'function';

  class ManifestElement extends Base {
    static get manifest() {
      return manifest;
    } // What SF.Assembly reads of a part it places (assembly/definition.mjs
    // interfaces.of): the same manifest, so a rule can ask its actions.


    static get sfInterface() {
      return manifest;
    }

    static get sfManifest() {
      return read;
    }

    static get sfWords() {
      return words;
    }

    static get formAssociated() {
      return formAssociated;
    }

    static get props() {
      return { ...super.props,
        ...generatedProps
      };
    }

    constructor() {
      super();
      this.sfInternals = formAssociated && typeof this.attachInternals === 'function' ? this.attachInternals() : null;
    }

    connectedCallback() {
      super.connectedCallback(); // A leaf outside an assembly starts with the page (§7.2.1 `now`).

      this.toggleAttribute('data-sf-started', true);
    }
    /** §4.1: the element has a box in an opened container. */


    get shown() {
      return isShown(this);
    }
    /** §4.1: its assembly has started it (a leaf on a page, once connected). */


    get started() {
      return this.hasAttribute('data-sf-started');
    }
    /** The DOM name of a declared event (§8). */


    sfEventName(verb) {
      return read.events[verb]?.name ?? eventName(manifest, verb);
    }
    /**
     * Sends a declared event by its verb. Answers false when a listener
     * refused a cancelable one.
     */


    sfEmit(verb, detail = {}, {
      cancelable
    } = {}) {
      const event = read.events[verb];
      if (!event) globalThis.console?.warn?.(`[SIMAI Framework] ${this.localName}: event ${verb} is not declared`);
      return (0,_aliases_js__WEBPACK_IMPORTED_MODULE_0__.dispatchAliased)(this, this.sfEventName(verb), {
        detail,
        bubbles: true,
        composed: true,
        cancelable: cancelable ?? event?.cancelable ?? false
      });
    }
    /** A word of the element's own, in its language (§11, §11.1). */


    sfWord(key, {
      count,
      vars
    } = {}) {
      return (0,_page_language_js__WEBPACK_IMPORTED_MODULE_1__.pageWord)(words, key, this, {
        component: this.localName,
        source: sourceLanguage,
        count,
        vars
      });
    }
    /** Writes a declared host state (§5.3). */


    sfHostState(name, value) {
      const type = read.hostStates[name];

      if (!type) {
        globalThis.console?.warn?.(`[SIMAI Framework] ${this.localName}: host state ${name} is not declared`);
        return;
      }

      if (type === 'boolean') {
        if (value) this.setAttribute(name, 'true');else this.removeAttribute(name);
      } else if (value === null || value === undefined || value === '') {
        this.removeAttribute(name);
      } else {
        this.setAttribute(name, String(value));
      }
    }
    /**
     * What a form gets (§17.1): the value named by `form.submits` while the
     * value named by `form.value` holds, nothing while disabled. A boolean
     * value submits only when true. A component overrides it for a value of
     * its own shape.
     */


    sfFormValue() {
      const form = read.form;
      if (!form) return null;
      if (form.disabled && this[camelName(form.disabled)]) return null;
      const value = this[camelName(form.value)];

      if (form.submits && form.submits !== form.value) {
        if (!value) return null;
        const submitted = this[camelName(form.submits)];
        return submitted === undefined || submitted === null ? null : String(submitted);
      }

      if (value === undefined || value === null || value === false) return null;
      return typeof value === 'object' ? JSON.stringify(value) : String(value);
    }
    /** Tells the form what the element holds now. */


    sfSyncForm() {
      if (!this.sfInternals) return;

      try {
        this.sfInternals.setFormValue(this.sfFormValue());
      } catch (error) {
        this.reportComponentError?.(error, 'form');
      }
    }

    get form() {
      return this.sfInternals?.form ?? null;
    }

    get labels() {
      return this.sfInternals?.labels ?? null;
    }

    get validity() {
      return this.sfInternals?.validity;
    }

    get validationMessage() {
      return this.sfInternals?.validationMessage ?? '';
    }

    get willValidate() {
      return this.sfInternals?.willValidate ?? false;
    }

    checkValidity() {
      return this.sfInternals ? this.sfInternals.checkValidity() : true;
    }

    reportValidity() {
      return this.sfInternals ? this.sfInternals.reportValidity() : true;
    }

    setCustomValidity(message = '') {
      if (!this.sfInternals) return;
      if (message) this.sfInternals.setValidity({
        customError: true
      }, String(message));else this.sfInternals.setValidity({});
    }

    formDisabledCallback(disabled) {
      this.sfFormDisabled = Boolean(disabled);
      this.requestComponentUpdate?.('form-disabled');
    }

  }

  defineMembers(ManifestElement.prototype, read.members); // connect-port is the base's (§4.1): a base without it gets it here.

  (0,_host_port_js__WEBPACK_IMPORTED_MODULE_3__.installPortAction)(ManifestElement.prototype);
  defineActions(ManifestElement.prototype, read.actions, actions, read.events); // data-sf-action="<id>.<action>" runs a declared action (§8 one page trigger).

  if (read.actions.length) (0,_page_actions_js__WEBPACK_IMPORTED_MODULE_2__.bindPageActions)();
  if (aliases) ManifestElement.aliases = aliases;
  return ManifestElement;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "f171c5ece4b4"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   connectPort: () => (/* binding */ connectPort),
/* harmony export */   installPortAction: () => (/* binding */ installPortAction),
/* harmony export */   portFromParams: () => (/* binding */ portFromParams),
/* harmony export */   portIdOf: () => (/* binding */ portIdOf),
/* harmony export */   portOf: () => (/* binding */ portOf)
/* harmony export */ });
// The base action connect-port {port} (standard simai.smart-component 1.3.8
// §4.1, §4.9): every element takes the host port it is handed, from the page
// or from the assembly it is a part of, by one method, `connectPort(port)`;
// `setHostPort(port)` is its alias.
//
// The port is kept on the instance, for its scope (§7.7): it lasts while the
// instance does and is let go when its scope ends, so an element taken out of
// the page holds no host. A component reacts through an optional hook,
// `onPortConnected(port, {signal})`, run after the port is kept; a component
// written before the base action, which overrides `setHostPort(port)` itself,
// has that override run as the hook, so it needs no change to be reached.
//
// Answers an outcome (§4.4): `{outcome: 'applied'}`; `refused` with
// `no-port` when nothing was handed, `other-port` when the port names an id
// other than the one the manifest declares, and `port-unsupported` when the
// hook throws -- the port is then not kept.
// A host adapter names its port by `id` (SF.Assembly, the port contracts) or
// by `port` (`{port, version, capabilities, raise}`, ui-pro's adapters).
function portIdOf(port) {
  if (!port || typeof port !== 'object') return '';
  if (typeof port.id === 'string' && port.id) return port.id;
  if (typeof port.port === 'string' && port.port) return port.port;
  return '';
} // connect-port takes its parameters as one object, `{port}`, or the port
// itself. An adapter whose `port` is its id (a string) is the port.

function portFromParams(params) {
  if (params && typeof params === 'object' && params.port && typeof params.port === 'object') return params.port;
  return params;
} // The port id the element's manifest declares, if any (§4.9).

function declaredPortId(element) {
  const declared = element?.constructor?.manifest?.port ?? element?.constructor?.sfInterface?.port;
  return portIdOf(declared);
}
/** The port an element holds now, or null. */


function portOf(element) {
  return element?.__sfPortEntry?.port ?? null;
}
/** connect-port {port} on `element`, with `alias` the base's own setHostPort. */

function connectPort(element, params, alias) {
  const port = portFromParams(params);
  if (!port || typeof port !== 'object') return {
    outcome: 'refused',
    reason: 'no-port'
  };
  const declared = declaredPortId(element);
  const given = portIdOf(port);
  if (declared && given && declared !== given) return {
    outcome: 'refused',
    reason: 'other-port'
  };
  const previous = element.__sfPortEntry ?? null; // Kept on the element, not in a module map: every bundle carries its own
  // copy of this module, and the element is what they share.

  const signal = element.sfScope;
  const entry = {
    port,
    signal
  };
  element.__sfPortEntry = entry; // The port lives as long as the scope it was handed in (§7.7).

  if (signal && typeof signal.addEventListener === 'function' && !signal.aborted) {
    signal.addEventListener('abort', () => {
      if (element.__sfPortEntry === entry) element.__sfPortEntry = null;
    }, {
      once: true
    });
  } // The hook. A component's own setHostPort (written before the base action)
  // is the hook when there is no onPortConnected; the guard lets such an
  // override call super.setHostPort without running itself again.


  if (element.__sfConnectingPort) return {
    outcome: 'applied'
  };
  element.__sfConnectingPort = true;

  try {
    if (typeof element.onPortConnected === 'function') {
      element.onPortConnected(port, {
        signal
      });
    } else if (typeof element.setHostPort === 'function' && element.setHostPort !== alias) {
      element.setHostPort(port);
    }
  } catch (error) {
    element.__sfPortEntry = previous;
    return {
      outcome: 'refused',
      reason: 'port-unsupported'
    };
  } finally {
    element.__sfConnectingPort = false;
  }

  element.requestComponentUpdate?.('port');
  return {
    outcome: 'applied'
  };
}
/**
 * Gives a class the base action where its base has none: `connectPort`,
 * `setHostPort` and the read-only `sfPort`.
 */

function installPortAction(proto) {
  if (!proto || typeof proto.connectPort === 'function') return;

  function setHostPort(port) {
    return connectPort(this, port, setHostPort);
  }

  Object.defineProperty(proto, 'connectPort', {
    configurable: true,
    writable: true,
    value: function connectPortAction(port) {
      return connectPort(this, port, setHostPort);
    }
  });

  if (typeof proto.setHostPort !== 'function') {
    Object.defineProperty(proto, 'setHostPort', {
      configurable: true,
      writable: true,
      value: setHostPort
    });
  }

  if (!Object.prototype.hasOwnProperty.call(proto, 'sfPort')) {
    Object.defineProperty(proto, 'sfPort', {
      configurable: true,

      get() {
        return portOf(this);
      }

    });
  }
}

/***/ },

/***/ "51e3a200cf5f"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bindPageActions: () => (/* binding */ bindPageActions),
/* harmony export */   readPageAction: () => (/* binding */ readPageAction),
/* harmony export */   runPageAction: () => (/* binding */ runPageAction)
/* harmony export */ });
// One page trigger (standard simai.smart-component 1.3.8 §8, §16.10, §19.4):
// `data-sf-action="<element id>.<action>"` on a page control runs that action
// of the element, the same method a script or a rule calls. It replaces the
// per-component triggers (`data-sf-modal-open`, `data-sf-drawer-close`, …),
// which stay as their aliases.
//
//   <button data-sf-action="confirm-delete.open">Delete</button>
//   <sf-modal id="confirm-delete">… <button data-sf-action="confirm-delete.confirm">Yes</button></sf-modal>
//
// Only an action the element's manifest declares is run: a page trigger can
// not reach the element's other methods. The action gets no parameters; a
// trigger that needs some is a script.
//
// One click listener for the document, on a shared global: every Smart bundle
// carries its own copy of this module, and a second listener would run each
// action twice.
const KEY = Symbol.for('sf.pageActions');

const camel = name => String(name).replace(/-([a-z0-9])/gu, (_, letter) => letter.toUpperCase());
/** `<id>.<action>` -> {id, action}; the action is the part after the last dot. */


function readPageAction(text) {
  const value = String(text || '').trim();
  const at = value.lastIndexOf('.');
  if (at <= 0 || at === value.length - 1) return null;
  return {
    id: value.slice(0, at),
    action: value.slice(at + 1)
  };
}
/** Runs a page trigger; answers the action's outcome, or null when nothing ran. */

function runPageAction(trigger) {
  const read = readPageAction(trigger?.getAttribute?.('data-sf-action'));
  if (!read) return null; // The element's id, or its instance id: a part an assembly placed is named
  // by its role path (§7.1.1, data-sf-instance="page/form/dialog").

  const doc = trigger.ownerDocument;
  const element = doc?.getElementById(read.id) ?? [...(doc?.querySelectorAll('[data-sf-instance]') ?? [])].find(one => one.getAttribute('data-sf-instance') === read.id);
  const declared = element?.constructor?.sfManifest?.actions ?? [];
  if (!declared.some(action => action.name === read.action)) return null;
  const method = element[camel(read.action)];
  return typeof method === 'function' ? method.call(element, {}) : null;
}
function bindPageActions(doc = globalThis.document) {
  if (!doc || typeof doc.addEventListener !== 'function') return;
  const scope = globalThis;
  if (!scope[KEY]) Object.defineProperty(scope, KEY, {
    value: new WeakSet(),
    configurable: true
  });
  if (scope[KEY].has(doc)) return;
  scope[KEY].add(doc);
  doc.addEventListener('click', event => {
    const trigger = event.target?.closest?.('[data-sf-action]');
    if (!trigger || trigger.matches(':disabled, [aria-disabled="true"]')) return;
    runPageAction(trigger);
  });
}

/***/ },

/***/ "b9c4b63fce15"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("fbe0570fcc69");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("59da34819c8b");
/* harmony import */ var _core_js_deprecations__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("06e8cd089f28");
/* harmony import */ var _component_field_size__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("e6d86f2cd058");
/* harmony import */ var _component_progress_scale_js_progress_scale__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("736e917526e6");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("f65a1c6fa30a");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("14aa46a01a05");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("7b37c5fdb1e6");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("726336abdcb3");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("7f722ca0ec9d");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_5__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_5__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);











function normalizeProgressValue(value) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return 0;
  }

  return Math.max(0, Math.min(100, parsed));
} // sf-progress-scale from its component.json (standard simai.smart-component
// 1.3.8 §3, §4, §4.4): its settings are attributes and properties made by
// core/js/element-manifest.js; a job's part arrives as the stream fact chunk
// {done, total} (vocabulary 1.1.5 §5.2), which a rule hands to the action
// chunk; tone and setProgress are dated aliases (aliases.json).


const ProgressScaleElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_6__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_8__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_9__
  },
  source: 'ru',
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_7__,
  actions: {
    chunk({
      done,
      total
    } = {}) {
      const whole = total === undefined || total === null || total === '' ? 100 : Number(total);
      const part = Number(done);

      if (!Number.isFinite(part) || !Number.isFinite(whole) || whole <= 0) {
        return {
          outcome: 'refused',
          reason: 'invalid'
        };
      }

      this.value = Math.round(normalizeProgressValue(part / whole * 100) * 100) / 100;
      return {
        outcome: 'applied'
      };
    }

  }
});

class SfProgressScale extends ProgressScaleElement {
  static get props() {
    return { ...super.props,
      // The axis is called status, and speaks the shared vocabulary. `tone`
      // and its value `primary` keep working: see contracts/public-api-axes.json.
      status: {
        default: 'neutral',
        values: ['neutral', 'info', 'success', 'warning', 'error'],
        aliases: ['tone'],
        valueAliases: {
          neutral: ['primary']
        }
      }
    };
  } // In a row or a table cell the element takes the text line of a form size,
  // so the row keeps its control height.


  get line() {
    const line = this.getAttribute('line') || '';
    return line ? (0,_component_field_size__WEBPACK_IMPORTED_MODULE_3__.fieldSize)(line, 'sf-progress-scale line') : '';
  }

  set line(value) {
    if (value === null || value === undefined || value === '') this.removeAttribute('line');else this.setAttribute('line', String(value));
  } // The value as the scale shows it: a number clamped to 0..100 (the
  // template and the reader agree, contracts/template-context.json).


  get value() {
    return normalizeProgressValue(this.getAttribute('value') ?? 0);
  }

  set value(next) {
    if (next === null || next === undefined) this.removeAttribute('value');else this.setAttribute('value', String(next));
  }

  get status() {
    return this.getProp('status');
  } // The accessible name: label, else the host's aria-label (§3.1, §4.8).


  get accessibleLabel() {
    return this.label || this.getAttribute('aria-label') || '';
  }

  templateContext() {
    const props = this.getPropsContext();
    return this.createTemplateContext({ ...props,
      component: this,
      line: this.line,
      label: this.accessibleLabel,
      value: normalizeProgressValue(props.value)
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_5__.renderProgressScaleTemplate)(this.templateContext());
  }

  get state() {
    return {
      size: this.size,
      line: this.line,
      value: normalizeProgressValue(this.value),
      showText: this.showText,
      status: this.status,
      label: this.label,
      valueText: this.valueText
    };
  } // §4.4: a reader retires; read value.


  getProgress() {
    (0,_core_js_deprecations__WEBPACK_IMPORTED_MODULE_2__.noteDeprecated)({
      component: 'sf-progress-scale',
      tag: 'sf-progress-scale',
      kind: 'action',
      from: 'getProgress',
      to: null,
      since: _aliases_json__WEBPACK_IMPORTED_MODULE_7__.since,
      remove_after: _aliases_json__WEBPACK_IMPORTED_MODULE_7__.remove_after
    });
    return normalizeProgressValue(this.value);
  }

  resolveUpdateMode(changedAttributes = []) {
    const directPatchAttributes = ['value', 'show-text', 'status', 'tone', 'label', 'value-text', 'aria-label'];

    if (changedAttributes.length > 0 && changedAttributes.every(attr => directPatchAttributes.includes(attr))) {
      return 'dom';
    }

    return 'lit';
  }

  updateDom() {
    const root = this.querySelector('.sf-progress-scale');
    if (!root) return false;
    return (0,_component_progress_scale_js_progress_scale__WEBPACK_IMPORTED_MODULE_4__.setProgressScaleState)(root, {
      value: this.value,
      showText: this.showText,
      tone: this.status,
      label: this.accessibleLabel,
      valueText: this.valueText
    });
  }

}

SfProgressScale.define('sf-progress-scale');
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "f65a1c6fa30a"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderProgressScaleTemplate: () => (/* binding */ renderProgressScaleTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ddf1cdb42ecc");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);


function normalizeProgressValue(value) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return 0;
  }

  return Math.max(0, Math.min(100, parsed));
}

function normalizeScaleStep(value) {
  const normalized = normalizeProgressValue(value);
  return Math.ceil(normalized / 10) * 10;
}

function normalizeSize(value) {
  const normalized = String(value || '').toLowerCase();
  return ['1/3', '1/2', '1', '2', '3'].includes(normalized) ? normalized : '1';
} // The component normalises the legacy words, so the template sees the shared
// vocabulary. `neutral` carries no class of its own, exactly as `primary` did.


function normalizeStatus(value) {
  const normalized = String(value || '').toLowerCase();
  return ['neutral', 'info', 'success', 'warning', 'error'].includes(normalized) ? normalized : 'neutral';
}

function renderProgressScaleTemplate(context) {
  const size = normalizeSize(context.size);
  const value = normalizeProgressValue(context.value);
  const step = normalizeScaleStep(value);
  const tone = normalizeStatus(context.status ?? context.tone);
  const rootClasses = ['sf-progress-scale', `sf-progress-scale--size-${size}`, `sf-progress-scale--${tone}`, // On a text line the track and the value share the line; otherwise the
  // value stands under the track.
  ...(context.line ? [`sf-progress-scale--line-${context.line}`, 'flex', 'flex-row', 'items-cross-center'] : ['flex', 'flex-col']), context.rootClass].filter(Boolean);

  if (step > 0) {
    rootClasses.push(`sf-progress-scale--${step}`);
  }

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div
      class=${rootClasses.join(' ')}
      style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      data-value=${String(value)}
      data-size=${size}
      data-tone=${tone}
      data-show-text=${String(Boolean(context.showText))}
      data-label=${context.label || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      data-value-text=${context.valueText || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      role="progressbar"
      aria-label=${context.label || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow=${String(value)}
      aria-valuetext=${context.valueText || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    >
      <div class="sf-progress-scale-container grid grid-col-10 overflow-hidden">
        ${Array.from({
    length: 10
  }, () => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-progress-scale-block"></div>`)}
      </div>
      ${context.showText ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-progress-scale-text">${value}%</div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    </div>
  `;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

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

/***/ },

/***/ "7b37c5fdb1e6"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-progress-scale for the shim (core/js/aliases.js, standard §16 item 20). mode: same-detail (the shim sends the new and the old name), detail-adds (the new detail holds the old fields), attribute-and-property, host-attribute (no shim), manifest-only (the DOM name does not change), retired (no new name; kept and noted by the component until the date).","component":"sf-progress-scale","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"tone","to":"status","kind":"setting","component":"sf-progress-scale","since":"2026-10-27","remove_after":"2026-12-01","section":"the axis\'s old name (contracts/public-api-axes.json)"},{"from":"setProgress","to":"chunk","kind":"action","component":"sf-progress-scale","since":"2026-10-27","remove_after":"2026-12-01","section":"§4.4, vocabulary §5.2","note":"setProgress(n) calls chunk(n): n of 100"},{"from":"getProgress","to":null,"kind":"action","component":"sf-progress-scale","since":"2026-10-27","remove_after":"2026-12-01","mode":"retired","section":"§4.4","note":"a reader retires: read value; the method stays until the date and notes each call"}]}');

/***/ },

/***/ "14aa46a01a05"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"The source of sf-progress-scale\'s element plumbing (core/js/element-manifest.js). Taken from simai/ui-control control/smart-architecture/migration/out/progress-scale (migration/convert-1.3.8.mjs over simai/ui-source@5100227); standard simai.smart-component 1.3.8, vocabulary 1.1.5. Every x-todo of the conversion is decided: x-decisions says how.","id":"smart.progress-scale","tag":"sf-progress-scale","version":"1.1.0","kind":"leaf","family":"progress","settings":{"size":{"type":"enum","values":["1/3","1/2","1","2","3"],"default":"1"},"line":{"type":"enum","values":["","1/2","1","2"],"default":""},"value":{"type":"number","default":0,"min":0,"max":100},"show-text":{"type":"boolean","default":true},"status":{"type":"enum","values":["neutral","info","success","warning","error"],"default":"neutral"},"label":{"type":"string","default":""},"value-text":{"type":"string","default":""}},"values":{},"events":{},"actions":{"chunk":{"with":{"done":"number","total":"number"},"x-outcomes":["applied","refused"],"x-summary":"Shows a part of a job (vocabulary §5.2 chunk {done, total}): value becomes done of total in per cent; total defaults to 100"}},"templates":{"default":{"file":"js/templates/default.js","$comment":"The Lit template in JavaScript, the migration form of §5.2 (§16)."}},"examples":"examples.json","docs":"docs/docs.md","lang":"lang/","accessibility":{"role":"progressbar","name":{"from":["label","aria-label"]},"keys":{},"$comment":"The root carries role progressbar with aria-valuemin 0, aria-valuemax 100, aria-valuenow the value and aria-valuetext the value-text when given; it takes no focus and no keys."},"css-variables":{"--sf-progress-scale-fill-color":{"type":"color","state":"default"},"--sf-progress-scale-track-color":{"type":"color","state":"default"},"--sf-progress-scale-segment-gap":{"type":"length","state":"default"},"--sf-progress-scale-radius":{"type":"length","state":"default"},"--sf-progress-scale-color":{"type":"color","state":"default"},"--sf-progress-scale-gap":{"type":"length","state":"default"}},"x-summary":"Segmented determinate progress with exact accessible value, explicit semantic tone and ten visual steps.","x-source":{"package":"framework","folder":"progress-scale","manifest":"simai/ui-source@5100227 src/smart/progress-scale/smart.manifest.json","converted":"control/smart-architecture/stands/17-ports-migration/out/progress-scale.component.json"},"x-words":["label","value-text"],"x-kept":{"security":{"permissions_owner":"none","untrusted_inputs":["props","children"],"network_policy":"deny"},"ownership":{"source":"simai/ui-source","data":"host","effects":"component","forbidden_client_responsibilities":["backend access decisions","host route invention","running, cancelling or retrying the task","inferring semantic state from the current segment count","inventing the accessible process label"]},"presentation":{"themes":["light","dark"],"locales":["ru","en"],"responsive":["desktop","mobile"],"skeleton":{"shape":"none","while_loading":"none"}},"ai_guidance":{"use_when":"Use sf-progress-scale when a known progress value is meaningfully represented by ten coarse or staged segments.","do_not":["Do not copy generated ui-smart code","Do not move host data or access decisions into the component","Do not use segmented progress when continuous Progress Bar is clearer","Do not use Progress Scale for an unknown value; use Spinner","Do not infer error, warning or success from the percentage","Do not omit a localized accessible label"],"required_reads":["inputs","methods","events","ownership","provenance"],"minimal_example":"<sf-progress-scale label=\\"Подготовка проекта\\" value=\\"40\\"></sf-progress-scale>","owner_commands":["npm run contract:verify","npm test"]}},"x-target":{"added":{"actions":["chunk"]}},"x-renamed":["settings.tone: the status axis\'s old name, a dated setting alias of status","settings.progress: an object read off setProgress by the conversion, not a setting; it leaves (the value is value, a job\'s part is the action chunk)","methods.setProgress → actions.chunk: a dated action alias; setProgress(n) is chunk(n), n of 100","methods.getProgress: a reader retires (§4.4), kept and noted until the date"],"x-decisions":["version: 1.0.0 → 1.1.0: tone and setProgress are dated aliases, value is a number, chunk is added; a minor while the aliases hold (§4.10).","setter: setProgress was a set-<name> method of the writable setting value (§4.4); a page writes value. A job\'s progress reaches the bar as the stream fact chunk {done, total} of vocabulary 1.1.5 §5.2, so the action a rule asks is chunk: a rule on <source>.chunk asks <bar>.chunk with the carried done and total. setProgress(n) is its dated alias (n of 100).","number-type: value holds a percentage, 0..100, clamped by the template; it is a number (§16 item 29) and an attribute that is no number reads 0.","a11y-role: progressbar on the root with aria-valuenow (the value), aria-valuemin 0, aria-valuemax 100 and aria-valuetext (value-text); the name is label, else the host\'s aria-label (§3.1, §4.8); no keys and no focus.","template: templates.default names the Lit template js/templates/default.js, the migration form §5.2 allows.","examples: examples.json from studio.fixture.json and studio.scenario.json plus a status and a value text; probe.json drives value, chunk and the aliases.","skeleton: none; the bar has no port and no late data: its static markup is its first paint (§5.4).","css-variables: 6 public variables read by the class sheet with the role token as fallback (src/core/contracts/public-variables.v1.json).","settings: tone leaves for its dated alias row (status answers), and progress, an object the conversion read off setProgress, is no setting: value is the setting and chunk the action.","line: a form size of the text line the scale stands on (a row, a cell), kept as it is."]}');

/***/ },

/***/ "726336abdcb3"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Progress Scale"}');

/***/ },

/***/ "7f722ca0ec9d"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Шкала прогресса"}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("b9c4b63fce15");
/******/
/******/ })()
;