/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "1373e294ec38"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BREAKPOINTS: () => (/* binding */ BREAKPOINTS),
/* harmony export */   breakpointMedia: () => (/* binding */ breakpointMedia),
/* harmony export */   breakpointQuery: () => (/* binding */ breakpointQuery),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   matchesBreakpoint: () => (/* binding */ matchesBreakpoint)
/* harmony export */ });
// The Framework's breakpoints for scripts (reuse audit 2026-11-02, finding 6).
// The sheets switch at the steps of core/scss/vars/_sf_var__breakpoint.scss;
// a component that also decides in script (sf-contents, sf-site-header,
// sf-search) had copied the steps by hand, word for word, and nine such
// constants (48rem, 60rem, 1023px, 1024) had drifted apart elsewhere, so one
// admin screen switched at two points. The same values here, and
// tests/breakpoint-ladder.contract.test.mjs holds the two files equal.

/** The ladder: each name is the width it starts at, in rem as the sheets write it. */
const BREAKPOINTS = Object.freeze({
  xs: '0rem',
  sm: '32rem',
  // g6, 512px
  md: '44rem',
  // h1, 704px
  lg: '60rem',
  // h5, 960px
  xl: '72rem',
  // h8, 1152px
  xxl: '80rem' // i0, 1280px

}); // The step under a threshold, as the sheets' media-breakpoint-down writes it:
// one pixel less, in rem (_mix__breakpoint.scss breakpoint-max).

const PIXEL_REM = 1 / 16;
/**
 * The media query of a breakpoint: from its width up, or with `below: true`
 * the widths under it -- the two sides the sheets switch on. An unknown name
 * is null, so a typo is not a query that always matches.
 *
 *   breakpointQuery('md')                  (min-width: 44rem)
 *   breakpointQuery('md', {below: true})   (max-width: 43.9375rem)
 */

function breakpointQuery(name, {
  below = false
} = {}) {
  if (!Object.hasOwn(BREAKPOINTS, name)) return null;
  const rem = Number.parseFloat(BREAKPOINTS[name]);
  if (below) return rem > 0 ? `(max-width: ${rem - PIXEL_REM}rem)` : 'not all';
  return `(min-width: ${rem}rem)`;
}
/** The page's MediaQueryList for a breakpoint, to read and to follow; null without matchMedia or for an unknown name. */

function breakpointMedia(name, {
  below = false,
  view = globalThis
} = {}) {
  const query = breakpointQuery(name, {
    below
  });
  return query && typeof view?.matchMedia === 'function' ? view.matchMedia(query) : null;
}
/** Whether the page is at least as wide as the breakpoint now (or under it, with `below`). */

function matchesBreakpoint(name, options = {}) {
  return breakpointMedia(name, options)?.matches === true;
}
const Breakpoints = Object.freeze({
  ladder: BREAKPOINTS,
  query: breakpointQuery,
  media: breakpointMedia,
  matches: matchesBreakpoint
}); // Core publishes the helper; component bundles that carry their own copy reuse
// an already published one instead of replacing it.

if (typeof globalThis !== 'undefined') {
  globalThis.SF = globalThis.SF || {};
  if (!globalThis.SF.breakpoints) globalThis.SF.breakpoints = Breakpoints;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Breakpoints);

/***/ },

/***/ "51250bf01ab0"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PREPAINT_READER: () => (/* binding */ PREPAINT_READER),
/* harmony export */   STORAGE_PREFIX: () => (/* binding */ STORAGE_PREFIX),
/* harmony export */   createPreferences: () => (/* binding */ createPreferences),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// SF.Preferences: what a person changes about how a thing looks -- column
// order, widths, sort, density, a menu's column widths -- kept one way for
// every component (owner, 2026-10-14; ui-control
// control/designs/2026-10-14-view-preferences.md).
//
// - A preference is a plain JSON value under a key `<component>/<instance>`,
//   e.g. `sf-table/cms.solutions`. No key, nothing is kept.
// - It is read synchronously, so a component applies it before its first
//   paint: the skeleton is already in the person's order.
// - The browser keeps a copy always (localStorage `sf-pref:<key>`), the cache
//   a first paint can read. A host that keeps preferences for its user
//   (Larena) plugs in with useHost(); its values win over the cache, and every
//   write goes to it as well, debounced per key.
// - A page can preload the host's values: preload({key: value}), or a
//   <script type="application/json" data-sf-preferences> (or id
//   "sf-preferences") in the page, read before the first value is.
//
// The registry lives on globalThis.SF: every bundle carries its own copy of
// this module, and two copies with two caches would disagree.
const PREFIX = 'sf-pref:';
const DELAY = 400;
const KEY = /^[\w.*:-]+(?:\/[\w.*:/-]+)?$/u;

function storage() {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

function validKey(key) {
  return typeof key === 'string' && key.length > 0 && key.length <= 200 && KEY.test(key);
}

function same(a, b) {
  try {
    return JSON.stringify(a) === JSON.stringify(b);
  } catch {
    return false;
  }
}

function plain(value) {
  return value === null || value === undefined ? null : JSON.parse(JSON.stringify(value));
}

function createPreferences() {
  const host = {
    adapter: null,
    values: new Map()
  };
  const listeners = new Map();
  const timers = new Map(); // The page's own block of the host's values, read once, before the first
  // read: a component may connect before this module's start-up ran.

  let inlineRead = false;

  const readInline = () => {
    if (inlineRead) return;
    const node = globalThis.document?.querySelector?.('script[type="application/json"][data-sf-preferences], script#sf-preferences[type="application/json"]');
    if (!node) return;
    inlineRead = true;

    try {
      api.preload(JSON.parse(node.textContent || '{}'));
    } catch {
      /* not JSON: ignored */
    }
  };

  const notify = (key, value) => {
    for (const listener of listeners.get(key) ?? []) {
      try {
        listener(plain(value), key);
      } catch (error) {
        console.error('SF.Preferences listener failed', key, error);
      }
    }
  };

  const readCache = key => {
    const store = storage();
    if (!store) return null;

    try {
      const raw = store.getItem(PREFIX + key);
      return raw === null ? null : JSON.parse(raw);
    } catch {
      return null;
    }
  };

  const writeCache = (key, value) => {
    const store = storage();
    if (!store) return;

    try {
      if (value === null) store.removeItem(PREFIX + key);else store.setItem(PREFIX + key, JSON.stringify(value));
    } catch {// A full or refused storage keeps the value for this page only.
    }
  };

  const saveToHost = key => {
    clearTimeout(timers.get(key));
    timers.delete(key);
    const adapter = host.adapter;
    if (!adapter) return;
    const value = host.values.has(key) ? host.values.get(key) : readCache(key);

    try {
      const answer = value === null ? adapter.remove?.(key) : adapter.save?.(key, plain(value));
      Promise.resolve(answer).catch(error => console.warn('SF.Preferences: the host did not keep', key, error));
    } catch (error) {
      console.warn('SF.Preferences: the host did not keep', key, error);
    }
  };

  const schedule = key => {
    if (!host.adapter) return;
    clearTimeout(timers.get(key));
    timers.set(key, setTimeout(() => saveToHost(key), DELAY));
  };

  const api = {
    // The value for a key: the host's when it gave one, else this browser's.
    read(key) {
      if (!validKey(key)) return null;
      readInline();
      if (host.values.has(key)) return plain(host.values.get(key));
      return plain(readCache(key));
    },

    // Several keys from the most general to the most particular, merged field
    // by field: `sf-table/*` (the person's tables) under `sf-table/<instance>`.
    readMerged(...keys) {
      const merged = {};
      let found = false;

      for (const key of keys.flat()) {
        const value = api.read(key);

        if (value && typeof value === 'object' && !Array.isArray(value)) {
          Object.assign(merged, value);
          found = true;
        }
      }

      return found ? merged : null;
    },

    write(key, value) {
      if (!validKey(key)) return false;
      const next = plain(value); // The value already kept is not written again: a component restoring
      // what the host gave it (sf-resizer's value) sent it back to the host on
      // every load (docs trial 5).

      if (JSON.stringify(api.read(key)) === JSON.stringify(next)) return true;
      if (host.values.has(key)) host.values.set(key, next);
      writeCache(key, next);
      schedule(key);
      return true;
    },

    // «Сбросить вид»: gone from both.
    remove(key) {
      if (!validKey(key)) return false;
      if (host.values.has(key)) host.values.set(key, null);
      writeCache(key, null);
      schedule(key);
      notify(key, null);
      return true;
    },

    subscribe(key, listener) {
      if (!validKey(key) || typeof listener !== 'function') return () => {};
      if (!listeners.has(key)) listeners.set(key, new Set());
      listeners.get(key).add(listener);
      return () => listeners.get(key)?.delete(listener);
    },

    // The host's values for this person. Each that differs from this
    // browser's copy replaces it and is announced, so a component re-applies.
    preload(values) {
      if (!values || typeof values !== 'object') return;

      for (const [key, value] of Object.entries(values)) {
        if (!validKey(key)) continue;
        const next = plain(value);
        const before = api.read(key);
        host.values.set(key, next);
        writeCache(key, next);
        if (!same(before, next)) notify(key, next);
      }
    },

    // {save(key, value), remove(key), load?(keys) → Promise<{key: value}>}.
    useHost(adapter) {
      if (!adapter || typeof adapter.save !== 'function') throw new TypeError('A preferences host saves: {save(key, value)}');
      host.adapter = adapter;
      return api;
    },

    // Asks the host for keys it has not given yet (a component that appears
    // after the page loaded).
    async load(keys) {
      const wanted = [].concat(keys).filter(key => validKey(key) && !host.values.has(key));
      if (!wanted.length || typeof host.adapter?.load !== 'function') return;

      try {
        api.preload(await host.adapter.load(wanted));
      } catch (error) {
        console.warn('SF.Preferences: the host did not answer', wanted, error);
      }
    },

    get hosted() {
      return Boolean(host.adapter);
    },

    // Writes still waiting go now (a page that is leaving).
    flush() {
      for (const key of [...timers.keys()]) saveToHost(key);
    }

  }; // Another tab changed a preference.

  globalThis.addEventListener?.('storage', event => {
    if (!event.key?.startsWith(PREFIX) || event.storageArea !== storage()) return;
    const key = event.key.slice(PREFIX.length);
    if (host.values.has(key)) return;
    let value = null;

    try {
      value = event.newValue === null ? null : JSON.parse(event.newValue);
    } catch {
      value = null;
    }

    notify(key, value);
  });
  globalThis.addEventListener?.('pagehide', () => api.flush());
  readInline();
  return Object.freeze(api);
}

if (typeof globalThis !== 'undefined') {
  globalThis.SF = globalThis.SF || {};
  if (!globalThis.SF.Preferences) globalThis.SF.Preferences = createPreferences();
}

const Preferences = globalThis.SF?.Preferences;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Preferences);
 // Before the first paint (GB21, Docara K-13, decision C438): the browser's
// copy of a preference is a public format -- localStorage `sf-pref:<key>`,
// the JSON of its value -- so a page reads it in <head>, before the Framework
// has run, and applies it without a copy of its own (the theme-first-paint
// pattern). PREPAINT_READER is the reader to print there, word for word (ES5,
// no module): sfPreference(key) answers the kept value or null. It reads the
// browser's copy only: a host that keeps preferences for its user prints them
// with the page (preload, the data-sf-preferences block).

const STORAGE_PREFIX = PREFIX;
const PREPAINT_READER = "function sfPreference(key){try{return JSON.parse(localStorage.getItem('sf-pref:'+key)||'null')}catch(e){return null}}";

/***/ },

/***/ "d461538f1791"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ROW_LIMIT: () => (/* binding */ ROW_LIMIT),
/* harmony export */   STAGES: () => (/* binding */ STAGES),
/* harmony export */   STATES: () => (/* binding */ STATES),
/* harmony export */   SfWizard: () => (/* binding */ SfWizard),
/* harmony export */   TYPES: () => (/* binding */ TYPES),
/* harmony export */   answersOf: () => (/* binding */ answersOf),
/* harmony export */   currentIndex: () => (/* binding */ currentIndex),
/* harmony export */   primaryOf: () => (/* binding */ primaryOf),
/* harmony export */   reachable: () => (/* binding */ reachable),
/* harmony export */   readStep: () => (/* binding */ readStep)
/* harmony export */ });
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("2f8a34e9c9c5");
/* harmony import */ var _core_js_preferences_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("51250bf01ab0");
/* harmony import */ var _core_js_breakpoints_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("1373e294ec38");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("c784a72456f7");
/* harmony import */ var _lang_index_mjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("ba786af14a68");
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("97e6d3ece1f6");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_2__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
// sf-wizard: the universal step-by-step wizard (owner decision 2026-11-06,
// ui-control control/decisions/2026-11-06-sf-wizard.md). The frame holds the
// progress, the step's title and «why», the step's body and one footer; each
// step is a child sf-wizard-step whose children are its body:
//
//   <sf-wizard heading="Настройка сервера">
//     <sf-wizard-step name="address" label="Адрес панели" type="form" …>
//       <form>…Framework fields…</form>
//     </sf-wizard-step>
//     …
//   </sf-wizard>
//
// The steps are live nodes placed in the frame (data-sf-live) and never
// copied: a server's form, its errors and its listeners stay what they are.
// The wizard keeps nothing the host must know: the states are the steps'
// attributes, the answers its value, and every move and press an event.
//
// Places: inline, modal (an sf-modal the wizard composes), drawer (an
// sf-drawer it composes, owner decision C179 (3)) and pages (the server's
// page per step: the footer's submit buttons post the step's form with their
// word, sf-button 1.5.0 form/name/value).
//
// The draft (C179 (6)): the wizard keeps its place, the steps' states and
// the answers itself, after every move and a moment after every edit, under
// remember -- else the element's id -- in SF.Preferences (the browser's copy
// is localStorage sf-pref:sf-wizard/<key>; a product that keeps preferences
// for its user, SF.Preferences, gets it too). Closing a window is «continue
// later»: no question, the draft stays, and close says where it stopped.






 // Only the words on screen ship in the bundle, English only (owner decision
// C282): Russian and every other language come from a language file. The
// title, settings and events stay in the language files for the Studio and the
// docs (localization study LC-2).


const TYPES = ['info', 'form', 'action', 'review', 'result'];
const STATES = ['done', 'skipped', 'running', 'error']; // The progress draws a row up to this many steps, the count above (owner);
// auto also draws the count where the row does not fit (C101 (4), fitProgress).

const ROW_LIMIT = 7; // Rounding slack only: the row's steps do not shrink, so a row wider than its
// place by half a pixel already cuts its last label (measured at the switch
// point: 717.53 in 717 cut «Готово» by 0.53 px).

const FIT_SLACK = 0.05; // sf-steps' word for each state of a step.

const STAGES = {
  done: 'completed',
  skipped: 'skipped',
  running: 'running',
  error: 'error',
  '': 'default'
}; // The place kept for remember: SF.Preferences under sf-wizard/<key> (the
// browser's copy is localStorage sf-pref:sf-wizard/<key>; a host that keeps
// preferences for its user gets it too).

const STORE = 'sf-wizard/'; // The draft is kept this long after the last edit (C179 (6)).

const DRAFT_DELAY = 400;

const preferences = () => globalThis.SF?.Preferences || _core_js_preferences_js__WEBPACK_IMPORTED_MODULE_3__["default"]; // One wizard id per instance, the same on every render (a first-paint
// snapshot stays stable).


let sequence = 0;

const text = value => value === undefined || value === null ? '' : String(value).trim();
/** A step element read as data. */


function readStep(element, index) {
  const attr = name => text(element.getAttribute(name));

  const type = attr('type');
  const state = attr('state');
  return {
    element,
    index,
    name: attr('name') || `step-${index + 1}`,
    label: attr('label') || attr('heading') || `${index + 1}`,
    heading: attr('heading') || attr('label'),
    // The step's «why»: its description attribute.
    why: attr('description'),
    type: TYPES.includes(type) ? type : 'info',
    state: STATES.includes(state) ? state : '',
    optional: element.hasAttribute('optional') && element.getAttribute('optional') !== 'false',
    href: attr('href'),
    actionText: attr('action-text'),
    message: attr('message')
  };
}
/** The step shown: the one current names, else the first not done or skipped, else the first. */

function currentIndex(steps, current) {
  if (!steps.length) return -1;
  const named = steps.findIndex(step => step.name === current);
  if (named >= 0) return named;
  const open = steps.findIndex(step => step.state !== 'done' && step.state !== 'skipped');
  return open >= 0 ? open : 0;
}
/** Whether a press in the progress may open step `index` under the rule. */

function reachable(steps, index, at, rule = 'linear') {
  if (index === at || index < 0 || index >= steps.length) return index === at;
  if (rule === 'free') return true;

  const passed = step => step.state === 'done' || step.state === 'skipped' || step.state === 'error';

  if (rule === 'visited') return passed(steps[index]) || index < at; // linear: any step up to the first one not done or skipped.

  const first = steps.findIndex(step => step.state !== 'done' && step.state !== 'skipped');
  return index <= Math.max(first < 0 ? steps.length - 1 : first, at);
}
/** What the primary button does on a step, and its word. */

function primaryOf(step, last) {
  if (!step) return {
    action: 'next',
    word: 'next'
  };

  if (step.type === 'action') {
    if (step.state === 'error') return {
      action: 'retry',
      word: 'retry'
    };
    if (step.state !== 'done') return {
      action: 'run',
      word: 'run',
      text: step.actionText
    };
  }

  if (step.type === 'review' && step.state !== 'done') return {
    action: 'apply',
    word: 'apply',
    text: step.actionText
  };
  if (step.type === 'result' || last) return {
    action: 'done',
    word: 'done',
    text: step.type === 'action' ? '' : step.actionText
  };
  return {
    action: 'next',
    word: 'next',
    text: step.type === 'action' ? '' : step.actionText
  };
} // A node inside a [hidden] element that stands within root (root's own
// hidden, a closed step, does not count).
// A Framework field that draws its own errors (C153 (3), the ShownValidity
// mixin of smart/helpers/form-field.js): it has the shown-message reader.

function showsOwnErrors(field) {
  return typeof field?.sfShownMessage === 'function';
} // The message the wizard writes on a field that does not draw its own errors.


function fieldMessage(control, word) {
  const validity = control?.validity;
  if (!validity || validity.valid) return '';
  if (validity.valueMissing) return word('required');
  if (validity.customError) return control.validationMessage || word('invalid');
  return word('invalid');
} // A plain control (no Framework field around it) shows the browser's own
// bubble; the wizard gives that bubble the Framework's words through the
// control's custom validity (C153 (3), study WZ-6) and marks what it set, so
// the next check and the person's edit take it off again. A custom error the
// page set itself is never touched.


const OWN_WORDS = 'data-sf-wizard-words';

function sayInWords(control, message) {
  if (!message || typeof control?.setCustomValidity !== 'function') return;
  if (control.validity?.customError && !control.hasAttribute(OWN_WORDS)) return;
  control.setCustomValidity(message);
  control.setAttribute(OWN_WORDS, '');
}

function dropWords(control) {
  if (!control?.hasAttribute?.(OWN_WORDS)) return;
  control.removeAttribute(OWN_WORDS);
  control.setCustomValidity?.('');
}

function hiddenWithin(node, root) {
  const hidden = node.parentElement?.closest('[hidden]');
  return Boolean(hidden && hidden !== root && root.contains(hidden));
}
/** The named answers of a step, as its forms would post them: FormData of
 * each form (Framework fields are form-associated, a native control is
 * itself), then the named controls outside a form. A name given twice is a
 * list; a file is its name. */


function answersOf(root) {
  if (!root) return {};
  const values = {};

  const add = (name, value) => {
    if (!name) return;
    const answer = typeof File !== 'undefined' && value instanceof File ? value.name : value;
    if (Object.hasOwn(values, name)) values[name] = [].concat(values[name], answer);else values[name] = answer;
  };

  const forms = root.localName === 'form' ? [root] : [...root.querySelectorAll('form')];

  for (const form of forms) {
    for (const [name, value] of new FormData(form)) add(name, value);
  } // Named controls outside any form of the step.


  for (const control of root.querySelectorAll('[name]')) {
    if (control.closest('form') || control.disabled || hiddenWithin(control, root)) continue;
    const native = ['input', 'select', 'textarea'].includes(control.localName);
    if (!native && !control.constructor?.formAssociated) continue; // A native control drawn inside a Framework field is the field's, not an answer.

    if (native && control.parentElement?.closest('[name]')?.constructor?.formAssociated) continue;
    const type = (control.type || '').toLowerCase();
    if (['submit', 'button', 'reset', 'image'].includes(type)) continue;

    if (type === 'file') {
      for (const file of control.files ?? []) add(control.getAttribute('name'), file);

      continue;
    }

    if ((type === 'checkbox' || type === 'radio') && !control.checked) continue;

    if (control.localName === 'select' && control.multiple) {
      for (const option of control.selectedOptions) add(control.getAttribute('name'), option.value);

      continue;
    }

    if (!native && control.checked === false) continue;
    add(control.getAttribute('name'), control.value ?? '');
  }

  return values;
}
const WizardElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_5__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: _lang_index_mjs__WEBPACK_IMPORTED_MODULE_6__.files,
  source: 'ru',
  actions: {
    open() {
      return this.openWindow();
    },

    close() {
      return this.closeWindow('api');
    },

    'go-to-step'(args = {}) {
      const name = typeof args === 'string' ? args : args?.name;
      const steps = this.steps;
      const index = steps.findIndex(step => step.name === text(name));
      if (index < 0) return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.refused)('missing');
      if (index === this.index) return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.refused)('current');
      this.show(index, {
        person: false
      });
      return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.applied)();
    },

    next() {
      return this.primary();
    }

  }
});

class SfWizard extends WizardElement {
  constructor() {
    super();
    this._steps = [];
    this._id = `sf-wizard-${++sequence}`;
    this._listOpen = false;
    this._dirty = false;
    this._savedAt = 0;
    this._draftTimer = 0;
    this._announce = '';
    this._marked = new Set();
    this._restored = false;

    this._onSubmit = event => this.onNativeSubmit(event);

    this._onInvalid = event => this.onNativeInvalid(event);

    this._onInput = event => this.onInput(event);

    this._onClick = event => this.onBodyClick(event);

    this._onTrigger = event => this.onTrigger(event);

    this._onModal = event => this.onModalClose(event);

    this._onPhone = () => this.requestComponentUpdate('phone');

    this._onStepsDrawn = event => {
      if (event.target?.classList?.contains('sf-wizard-steps')) this.fitProgress();
    };
  } // ------------------------------------------------------------ the steps
  // The steps: the sf-wizard-step elements of this wizard, wherever they
  // stand -- direct children, inside the printed picture (first paint), or in
  // the frame's body once placed (also when a window carried the frame into
  // its portal).


  captureSlotTemplates() {
    const first = !this._slotTemplatesCaptured;
    super.captureSlotTemplates();
    if (first) this.collectSteps();

    if (first && typeof MutationObserver === 'function') {
      this._stepObserver = new MutationObserver(() => {
        if (this.collectSteps()) this.requestComponentUpdate('steps');
      });
    }

    this._stepObserver?.observe(this, {
      childList: true
    });
  }

  collectSteps() {
    const own = element => element.closest('sf-wizard') === this || element.sfWizard === this;

    const found = Array.from(this.querySelectorAll('sf-wizard-step')).filter(own);
    const fresh = found.filter(step => !this._steps.includes(step));
    if (!fresh.length) return false; // Page order: the printed or written order of the host's own steps.

    this._steps = [...this._steps, ...fresh];

    for (const step of fresh) step.sfWizard = this;

    return true;
  }

  get stepElements() {
    return this._steps;
  }

  get steps() {
    return this._steps.map((element, index) => readStep(element, index));
  }

  get index() {
    return currentIndex(this.steps, this.current);
  }

  get place() {
    const value = this.getAttribute('place');
    return ['inline', 'modal', 'drawer', 'pages'].includes(value) ? value : 'inline';
  } // A window place: an sf-modal or an sf-drawer the wizard composes.


  get inWindow() {
    return this.place === 'modal' || this.place === 'drawer';
  } // A phone (below sm, the step the windows' sheets read, C159 (2)): the
  // window takes the whole screen and the footer stays at its bottom
  // (C179 (4)).


  get onPhone() {
    return Boolean(this._phoneQuery?.matches);
  } // The value open (places modal and drawer); the action open() is the method of that name.


  get isOpen() {
    return this.hasAttribute('open') && this.getAttribute('open') !== 'false';
  }

  get isPages() {
    return this.place === 'pages';
  } // A step told its wizard it changed (sf-wizard-step).


  stepChanged() {
    this.requestComponentUpdate('step');
  } // The one value of every answer, by step and field (owner).


  get value() {
    const value = {};

    for (const step of this.steps) {
      const answers = answersOf(step.element);
      if (Object.keys(answers).length) value[step.name] = answers;
    }

    return value;
  }

  set value(_value) {// Read-only: the wizard collects it from the steps' fields.
  }

  get stepStates() {
    return this.steps.map(step => ({
      name: step.name,
      state: step.state
    }));
  }

  get currentStep() {
    return this.steps[this.index] ?? null;
  }

  get busy() {
    return this.currentStep?.state === 'running';
  } // The form of a step: its first form, or the form its controls belong to.


  formOf(step) {
    const element = step?.element;
    if (!element) return null;
    const form = element.querySelector('form') ?? element.closest('form');
    if (form && !form.id) form.id = `${this._id}-form-${step.index + 1}`;
    return form;
  } // ------------------------------------------------------------ lifecycle


  onConnected() {
    super.onConnected?.();
    this.listen(this);
    this.bindTriggers();
    this._phoneQuery = (0,_core_js_breakpoints_js__WEBPACK_IMPORTED_MODULE_4__.breakpointMedia)('sm', {
      below: true
    });
    this._phoneQuery?.addEventListener?.('change', this._onPhone);
    this.restore();
    if (this.isPages && this.focusTitle) this.whenDrawn(() => this.focusStepTitle(), {
      first: true
    });
  }

  onDisconnected() {
    super.onDisconnected?.();
    this.listen(null);
    this._stepObserver?.disconnect();
    this.unbindTriggers();
    this._phoneQuery?.removeEventListener?.('change', this._onPhone);
    this._phoneQuery = null;
    this.unobserveFit();

    if (this._draftTimer) {
      clearTimeout(this._draftTimer);
      this._draftTimer = 0;
      this.keep();
    }
  } // The steps' events reach the wizard where the frame stands: in the host,
  // or in a window's portal at the end of the body (place modal).


  listen(target) {
    const pairs = [['submit', this._onSubmit, true], ['invalid', this._onInvalid, true], ['input', this._onInput, false], ['change', this._onInput, false], ['click', this._onClick, false]];
    if (this._listening) for (const [type, handler, capture] of pairs) this._listening.removeEventListener(type, handler, capture);
    this._listening = target;
    if (target) for (const [type, handler, capture] of pairs) target.addEventListener(type, handler, capture);
  } // The frame: in the host, or in the window's portal.


  get frameRoot() {
    return this.querySelector(`.sf-wizard[data-sf-wizard="${this._id}"]`) ?? this.ownerDocument.querySelector(`.sf-wizard[data-sf-wizard="${this._id}"]`);
  }

  find(selector) {
    return this.frameRoot?.querySelector(selector) ?? null;
  } // The steps stand in the frame's body; while the first paint's picture is
  // replaced, they must not take a printed picture meant for the frame's own
  // controls (smart-base handOverStaticMarkup): they keep their own.


  handOverStaticMarkup(printed) {
    const marked = this._steps.filter(step => !step.hasAttribute('data-sf-static'));

    marked.forEach(step => step.setAttribute('data-sf-static', ''));

    try {
      super.handOverStaticMarkup(printed);
    } finally {
      marked.forEach(step => step.removeAttribute('data-sf-static'));
    }
  } // Runs after the element's next drawing (and its controls' own).


  whenDrawn(callback, {
    first = false
  } = {}) {
    const run = () => {
      const settle = () => callback();

      if (typeof globalThis.requestAnimationFrame === 'function') globalThis.requestAnimationFrame(settle);else Promise.resolve().then(settle);
    };

    if (first && this._hasRendered) {
      run();
      return;
    }

    const done = event => {
      if (event.target !== this) return;
      this.removeEventListener('sf-after-render', done);
      run();
    };

    this.addEventListener('sf-after-render', done);
  } // ------------------------------------------------------------ remember
  // The draft's key (C179 (6)): remember, else the element's id; none, the
  // draft lives as long as the page (the steps keep their fields).


  get storeKey() {
    const key = text(this.remember) || text(this.id);
    return key && !this.isPages ? `${STORE}${key}` : '';
  }

  keep() {
    if (this._draftTimer) {
      clearTimeout(this._draftTimer);
      this._draftTimer = 0;
    }

    const key = this.storeKey;
    if (!key) return;
    preferences()?.write(key, {
      v: 1,
      current: this.currentStep?.name ?? '',
      steps: this.stepStates,
      value: this.value
    });

    const minute = at => Math.floor(at / 60000);

    const shown = this._savedAt;
    this._savedAt = Date.now();
    if (!shown || minute(shown) !== minute(this._savedAt)) this.requestComponentUpdate('draft');
  } // A moment after an edit the draft is kept (one write per pause).


  keepSoon() {
    if (!this.storeKey) return;
    if (this._draftTimer) clearTimeout(this._draftTimer);
    this._draftTimer = setTimeout(() => {
      this._draftTimer = 0;
      this.keep();
    }, DRAFT_DELAY);
  } // «Черновик сохранён в 12:04» in the page's language, once kept.


  get savedLine() {
    if (!this._savedAt || !this.storeKey) return '';
    let time = '';

    try {
      time = new Intl.DateTimeFormat(this.closest('[lang]')?.getAttribute('lang') || undefined, {
        hour: '2-digit',
        minute: '2-digit'
      }).format(this._savedAt);
    } catch {
      time = '';
    }

    return this.sfWord('saved', {
      vars: {
        time
      }
    });
  }

  forget() {
    const key = this.storeKey;
    if (!key) return;
    preferences()?.remove(key);
  } // The place, the states and the answers kept last time (remember).


  restore() {
    if (this._restored) return;
    this._restored = true;
    const key = this.storeKey;
    if (!key) return;
    const kept = preferences()?.read(key);
    if (!kept || typeof kept !== 'object') return;
    const steps = this.steps;

    for (const {
      name,
      state
    } of Array.isArray(kept.steps) ? kept.steps : []) {
      const step = steps.find(one => one.name === name);
      if (step && STATES.includes(state) && state !== 'running' && !step.state) step.element.setAttribute('state', state);
    }

    for (const [name, answers] of Object.entries(kept.value && typeof kept.value === 'object' ? kept.value : {})) {
      const step = steps.find(one => one.name === name);
      if (step) this.fill(step.element, answers);
    }

    if (kept.current && steps.some(step => step.name === kept.current)) this.current = kept.current;
  } // Answers written back into a step's named controls (a Framework field
  // through its own value, so it draws it).


  fill(root, answers) {
    for (const [name, value] of Object.entries(answers || {})) {
      const controls = Array.from(root.querySelectorAll('[name]')).filter(control => control.getAttribute('name') === name);

      for (const control of controls) {
        const field = control.localName.includes('-') ? control : control.closest('[name]');
        const target = field ?? control;

        if (target.type === 'checkbox' || target.type === 'radio') {
          target.checked = [].concat(value).map(String).includes(String(target.value));
        } else if (!Array.isArray(value)) {
          if ('value' in target) target.value = value;else target.setAttribute('value', value);
        }
      }
    }
  } // ------------------------------------------------------------ moves


  show(index, {
    person = true,
    mark = null
  } = {}) {
    const steps = this.steps;
    const from = this.index;
    if (index < 0 || index >= steps.length) return;
    if (mark && steps[from] && steps[from].state !== mark) steps[from].element.setAttribute('state', mark);
    const previous = steps[from]?.name ?? '';
    this.current = steps[index].name;
    this._dirty = false;
    this.sfHostState('data-dirty', false);
    this._listOpen = false;
    this._announce = this.sfWord('moved', {
      vars: {
        n: index + 1,
        count: steps.length,
        step: steps[index].label
      }
    });
    this.requestComponentUpdate('move');
    if (person) this.sfEmit('change', {
      previous,
      current: steps[index].name,
      value: this.value
    });
    this.keep();
    this.whenDrawn(() => this.focusStepTitle());
  }

  focusStepTitle() {
    this.find(`#${this._id}-title`)?.focus({
      preventScroll: false
    });
  } // A press in the progress (sf-steps or the list) or on data-wizard-step.


  goTo(index) {
    const steps = this.steps;
    const at = this.index;
    if (index === at || this.busy) return false;
    if (!reachable(steps, index, at, this.navigation)) return false;

    if (this.isPages) {
      const step = steps[index];
      if (step.href) this.follow(step.name, step.href);
      return Boolean(step.href);
    }

    this.show(index);
    return true;
  }

  back() {
    if (this.busy) return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.refused)('busy');
    const at = this.index;
    if (at <= 0) return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.refused)('first');

    if (this.isPages) {
      const step = this.steps[at - 1];
      if (step.href) this.follow(step.name, step.href);
      return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.applied)();
    }

    this.show(at - 1);
    return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.applied)();
  } // place pages: a link, as a request first.


  follow(name, href, event = null) {
    const allowed = this.sfEmit('navigate', {
      id: name,
      href
    }, {
      cancelable: true
    });

    if (!allowed) {
      event?.preventDefault();
      return;
    }

    if (!event) globalThis.location?.assign(href);
  } // ------------------------------------------------------------ validation
  // The browser's own validation over the step's controls (required, type,
  // pattern, a form-associated element's validity). Each invalid Framework
  // field gets invalid and the message; the first takes focus.


  validate(step) {
    const root = step?.element;
    if (!root) return true;
    const controls = Array.from(root.querySelectorAll('input, select, textarea, *')).filter(node => {
      if (typeof node.checkValidity !== 'function' || node.disabled) return false;
      if (hiddenWithin(node, root)) return false;
      if (['input', 'select', 'textarea'].includes(node.localName)) return node.willValidate !== false;
      return node.constructor?.formAssociated === true && node.willValidate;
    }); // The words the last check gave plain controls go first: the browser
    // checks the value as it is now.

    controls.forEach(dropWords); // checkValidity fires the native invalid events this wizard listens to:
    // the wizard's own check speaks once, below.

    this._validating = true;
    let invalid;

    try {
      invalid = controls.filter(control => !control.checkValidity());
    } finally {
      this._validating = false;
    }

    if (!invalid.length) return true;
    invalid.forEach(control => this.markInvalid(control));
    const first = invalid[0];
    first.focus?.({
      preventScroll: false
    });
    if (!this.fieldOf(first)) first.reportValidity?.();
    this.sfEmit('invalid', {
      step: step.name,
      fields: invalid.map(control => control.name || control.getAttribute?.('name') || '').filter(Boolean)
    });
    return false;
  } // The Framework field around a control: an element whose manifest has the
  // setting invalid (sf-input, sf-input-textarea, sf-dropdown …).


  fieldOf(control) {
    for (let node = control; node && node !== this; node = node.parentElement) {
      if (node.localName?.includes('-') && node.constructor?.manifest?.settings?.invalid) return node;
    }

    return null;
  }

  markInvalid(control) {
    const field = this.fieldOf(control); // A field that shows its own errors (owner decision C153 (3): sf-input
    // and its family) says them in the Framework's words on its own invalid
    // event, which the check above fired; it is not marked from outside, so
    // the browser's words never stand in its message (study WZ-6).

    if (field && showsOwnErrors(field)) {
      this._marked.add(field);

      return;
    }

    if (field) {
      if (!field.hasAttribute('invalid')) {
        field.setAttribute('invalid', '');
        field.setAttribute('data-sf-wizard-invalid', ''); // The Framework's words in the page's language (C153 (3)): an empty
        // required field says «required», the page's own custom error stays
        // as written, any other failure says «invalid» -- never the
        // browser's validationMessage.

        const message = fieldMessage(control, key => this.sfWord(key));

        if (!field.getAttribute('error-message') && message) {
          field.setAttribute('error-message', message);
          field.setAttribute('data-sf-wizard-message', '');
        }
      }

      this._marked.add(field);
    } else {
      // A plain control: the browser's bubble, in the Framework's words.
      sayInWords(control, fieldMessage(control, key => this.sfWord(key)));
      control.setAttribute('aria-invalid', 'true');
      control.setAttribute('data-sf-wizard-invalid', '');

      this._marked.add(control);
    }
  } // What the wizard set goes when the person edits the field.


  unmark(target) {
    for (const node of Array.from(this._marked)) {
      if (!(node === target || node.contains?.(target))) continue;

      this._marked.delete(node);

      if (!node.hasAttribute('data-sf-wizard-invalid')) continue;
      node.removeAttribute('data-sf-wizard-invalid');

      if (node.localName.includes('-')) {
        node.removeAttribute('invalid');

        if (node.hasAttribute('data-sf-wizard-message')) {
          node.removeAttribute('error-message');
          node.removeAttribute('data-sf-wizard-message');
        }
      } else {
        node.removeAttribute('aria-invalid');
        dropWords(node);
      }
    }
  }

  onNativeInvalid(event) {
    // place pages: the browser validates the post; the Framework field shows
    // the message instead of the browser's bubble, and the first takes focus.
    const control = event.target;
    if (!this.currentStep?.element?.contains(control)) return;
    if (this.fieldOf(control)) event.preventDefault();
    if (this._validating) return;
    this.markInvalid(control);

    if (!this._invalidSent) {
      this._invalidSent = true;
      queueMicrotask(() => {
        this._invalidSent = false;
        const first = Array.from(this._marked)[0];
        (first?.localName?.includes('-') ? first.querySelector('input, select, textarea, button') : first)?.focus?.();
        this.sfEmit('invalid', {
          step: this.currentStep?.name ?? '',
          fields: Array.from(this._marked).map(node => node.getAttribute('name') || '').filter(Boolean)
        });
      });
    }
  }

  onInput(event) {
    const step = this.currentStep;
    if (!step?.element?.contains(event.target)) return;
    this.unmark(event.target);

    if (!this._dirty) {
      this._dirty = true;
      this.sfHostState('data-dirty', true);
    }

    this.keepSoon();
  } // ------------------------------------------------------------ presses
  // The primary button: validation, the request, then the move (inline,
  // modal) or the post (pages, the browser's own submit of the button).


  primary(skip = false) {
    const steps = this.steps;
    const at = this.index;
    const step = steps[at];
    if (!step) return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.refused)('missing');
    if (this.busy) return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.refused)('busy');
    const last = at === steps.length - 1;
    const {
      action
    } = skip ? {
      action: 'skip'
    } : primaryOf(step, last);
    if (!skip && !this.validate(step)) return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.refused)('invalid');
    const values = answersOf(step.element);
    if (!this.sfEmit('submit', {
      step: step.name,
      action,
      values,
      value: this.value
    }, {
      cancelable: true
    })) return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.refused)('prevented');
    this._dirty = false;
    this.sfHostState('data-dirty', false);
    if (this.isPages) return this.post(step, action, last); // Inline and modal: an action step without a host that runs it is done.

    if (action === 'run' || action === 'retry' || action === 'apply') {
      step.element.setAttribute('state', 'done');

      if (step.type === 'action') {
        this.keep();
        return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.applied)();
      }
    }

    if (action === 'done' || last) {
      if (step.state !== 'done') step.element.setAttribute('state', 'done');
      const value = this.value;
      this.forget();
      this._savedAt = 0;
      this.sfEmit('completed', {
        steps: this.stepStates,
        value
      });
      if (this.inWindow) this.finishWindow('close');
      return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.applied)();
    }

    this.show(at + 1, {
      mark: skip ? 'skipped' : 'done'
    });
    return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.applied)();
  } // place pages: the step's form posts with the button's word; a step
  // without a form moves by the next step's address.


  post(step, action, last) {
    const form = this.formOf(step);

    if (form) {
      const button = this.find(action === 'skip' ? '.sf-wizard-skip button' : '.sf-wizard-primary button');
      const keep = form.noValidate;
      if (action === 'skip') form.noValidate = true;
      if (step.type === 'action' && action !== 'skip') this.markRunning(step);
      this._posting = true;

      try {
        if (button && typeof form.requestSubmit === 'function') form.requestSubmit(button.form === form ? button : undefined);else form.submit();
      } finally {
        this._posting = false;
        form.noValidate = keep;
      }

      return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.applied)();
    }

    const next = this.steps[step.index + 1];
    const href = action === 'done' || last ? this.doneHref : next?.href;
    if (href) this.follow(next && !last ? next.name : step.name, href);
    return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.applied)();
  } // The step shows running once the browser has read the form: the entry
  // list is built after the submit event, and a redraw in between (the
  // microtasks of a person's press run before it) would disable the
  // submitter and drop its word from the post.


  markRunning(step) {
    setTimeout(() => step.element.setAttribute('state', 'running'));
  } // A native submit inside the steps: in place pages the footer's own button
  // (or Enter in a field) posts it, so the request goes first and the step
  // shows running; elsewhere it is the primary press.


  onNativeSubmit(event) {
    if (this._posting) return;
    const step = this.currentStep;
    if (!step?.element?.contains(event.target) && this.formOf(step) !== event.target) return;

    if (this.isPages) {
      const word = event.submitter?.value || primaryOf(step, this.index === this.steps.length - 1).action;
      const values = answersOf(step.element);

      if (!this.sfEmit('submit', {
        step: step.name,
        action: word,
        values,
        value: this.value
      }, {
        cancelable: true
      })) {
        event.preventDefault();
        return;
      }

      this._dirty = false;
      if (step.type === 'action' && word !== 'skip') this.markRunning(step);
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    this.primary();
  } // Footer presses in place pages are native (submit buttons and links);
  // their request is sent by onNativeSubmit or here.


  onFooter(event, which) {
    if (this.isPages) {
      const steps = this.steps;
      const step = this.currentStep;

      if (which === 'back') {
        const previous = steps[this.index - 1];
        if (previous?.href) this.follow(previous.name, previous.href, event);
        return;
      }

      if (which === 'skip' || which === 'primary') {
        if (this.busy) {
          event.preventDefault();
          return;
        }

        const form = this.formOf(step);

        if (!form) {
          const last = this.index === steps.length - 1;
          const next = steps[this.index + 1];
          const href = which === 'primary' && (last || primaryOf(step, last).action === 'done') ? this.doneHref : next?.href;

          if (!this.sfEmit('submit', {
            step: step.name,
            action: which === 'skip' ? 'skip' : primaryOf(step, last).action,
            values: {},
            value: this.value
          }, {
            cancelable: true
          })) {
            event.preventDefault();
            return;
          }

          if (href) this.follow(next && !last ? next.name : step.name, href, event);
          return;
        } // The browser checks the post: the words the last check gave plain
        // controls go first, it sees the value as it is now.


        step.element?.querySelectorAll(`[${OWN_WORDS}]`).forEach(dropWords);

        if (which === 'skip') {
          // Skip posts without validation: the browser reads novalidate on
          // the form when the press's default action runs, after this.
          form.noValidate = true;
          setTimeout(() => {
            form.noValidate = false;
          });
        }
      }

      return;
    }

    if (which === 'back') this.back();else if (which === 'skip') this.primary(true);else this.primary();
  } // «Изменить» in a review: any element with data-wizard-step="<name>".


  onBodyClick(event) {
    const link = event.target?.closest?.('[data-wizard-step]');
    if (!link || !this.frameRoot?.contains(link)) return;
    const index = this.steps.findIndex(step => step.name === link.getAttribute('data-wizard-step'));
    if (index < 0) return;
    if (this.isPages && link.getAttribute('href')) return;
    event.preventDefault();
    this.goTo(index);
  }

  onProgress(event) {
    const index = Number(event.detail?.current);
    if (!Number.isInteger(index)) return;

    if (!this.goTo(index)) {
      // sf-steps moved its own mark: put it back on the step shown.
      event.target?.setAttribute?.('current', String(this.index));
    }
  }

  toggleList(force) {
    this._listOpen = force === undefined ? !this._listOpen : Boolean(force);
    this.requestComponentUpdate('list');
  } // ------------------------------------------------------------ leaving
  // «Продолжить позже», and every close of a window (C179 (6)): the draft
  // is kept, nothing is asked.


  continueLater(event) {
    this.leave('later', event);
  }

  leave(reason, event = null) {
    const detail = {
      reason,
      current: this.currentStep?.name ?? '',
      steps: this.stepStates,
      value: this.value
    };

    if (!this.sfEmit('close', detail, {
      cancelable: true
    })) {
      event?.preventDefault();
      return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.refused)('prevented');
    }

    this.keep();
    if (this.inWindow) this.finishWindow(reason);else if (!event && this.laterHref && reason === 'later') globalThis.location?.assign(this.laterHref);
    this.requestComponentUpdate('leave');
    return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.applied)();
  } // ------------------------------------------------------------ the window
  // The window the wizard composes: its sf-modal or sf-drawer.


  get modal() {
    return this.querySelector(':scope > :is(sf-modal.sf-wizard-modal, sf-drawer.sf-wizard-drawer)') ?? this._modal ?? null;
  }

  triggers() {
    const ids = text(this.for).split(/\s+/u).filter(Boolean);
    return ids.map(id => this.ownerDocument.getElementById(id)).filter(Boolean);
  }

  bindTriggers() {
    if (!this.inWindow) return;

    for (const trigger of this.triggers()) {
      trigger.addEventListener('click', this._onTrigger);
      trigger.setAttribute('aria-haspopup', 'dialog');
    }
  }

  unbindTriggers() {
    for (const trigger of this.triggers()) trigger.removeEventListener('click', this._onTrigger);
  }

  onTrigger(event) {
    event.preventDefault();
    this.openWindow();
  }

  openWindow() {
    if (!this.inWindow) return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.refused)('place');
    if (this.isOpen) return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.refused)('open');
    if (!this.sfEmit('open', {}, {
      cancelable: true
    })) return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.refused)('prevented');
    this.toggleAttribute('open', true);
    this.requestComponentUpdate('open');
    this.whenDrawn(() => this.whenDrawn(() => this.focusStepTitle()));
    return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.applied)();
  }

  closeWindow(reason = 'api') {
    if (!this.inWindow || !this.isOpen) return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.refused)('closed');
    return this.leave(reason);
  }

  finishWindow() {
    this._closing = true;
    this.toggleAttribute('open', false);
    this.modal?.close?.({
      reason: 'api'
    });
    this._closing = false;
    this.requestComponentUpdate('close');
  } // The window asks before it closes (its ×, Escape, the scrim): it is the
  // wizard's close, «continue later» (C179 (6)) -- the draft is kept and
  // nothing is asked, so the window's own question about changes (C159 (6))
  // does not come either.


  onModalClose(event) {
    if (event.target !== this.modal || this._closing) return;
    const reason = event.detail?.reason === 'escape' || event.detail?.reason === 'outside' ? event.detail.reason : 'close';
    event.preventDefault();
    this.leave(reason);
  } // ------------------------------------------------------------ drawing


  templateContext() {
    const steps = this.steps;
    const count = steps.length;
    const index = this.index;
    const step = steps[index] ?? null;
    const last = index === count - 1;
    const rule = this.navigation;

    const word = (key, vars) => this.sfWord(key, vars ? {
      vars
    } : {}); // The steps' bodies: the current one shown, the others hidden.


    steps.forEach(one => {
      one.element.hidden = one.index !== index;
      one.element.sfWizard = this;
    }); // The drawn progress: auto resolves to a row up to ROW_LIMIT steps, the
    // count above; a row that does not fit draws the count too (fitProgress).

    const shape = this.progress === 'auto' || !this.progress ? count > ROW_LIMIT ? 'count' : 'row' : this.progress;
    const primary = primaryOf(step, last);
    this.sfHostState('data-place', this.place);
    this.sfHostState('data-busy', this.busy);
    return this.createTemplateContext({ ...this.getPropsContext(),
      component: this,
      id: this._id,
      place: this.place,
      size: this.size === '1/2' ? '1/2' : '1',
      heading: this.heading,
      // The region's (and the modal's) accessible name.
      name: this.heading || this.label,
      level: Math.min(Math.max(Number(this.level) || 2, 1), 6),
      shape,
      steps: steps.map(one => ({ ...one,
        current: one.index === index,
        reachable: reachable(steps, one.index, index, rule),
        stateWord: one.state ? word(`state-${one.state}`) : ''
      })),
      count,
      index,
      step,
      first: index <= 0,
      last,
      busy: this.busy,
      listOpen: this._listOpen,
      phone: this.onPhone,
      saved: this.savedLine,
      announce: this._announce,
      form: this.isPages ? this.formOf(step) : null,
      stepNodes: this._steps,
      backHref: steps[index - 1]?.href ?? '',
      nextHref: steps[index + 1]?.href ?? '',
      doneHref: this.doneHref,
      primary: { ...primary,
        text: primary.text || word(primary.word)
      },
      offerLater: this.hasAttribute('later') || Boolean(this.laterHref),
      laterHref: this.laterHref,
      actionName: this.actionName || 'wizard-action',
      open: this.isOpen,
      words: {
        position: word('position', {
          n: index + 1,
          count
        }),
        back: word('back'),
        skip: word('skip'),
        later: word('later'),
        steps: word('steps'),
        allSteps: word('all-steps'),
        hideSteps: word('hide-steps'),
        progress: word('progress'),
        running: step?.message || this.runningText || word('running-text')
      },
      rootClass: this.getRootClass()
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_2__.renderWizardTemplate)(this.templateContext());
  }

  afterRender(changedAttributes) {
    super.afterRender?.(changedAttributes);
    const modal = this.querySelector(':scope > :is(sf-modal.sf-wizard-modal, sf-drawer.sf-wizard-drawer)');

    if (modal && modal !== this._modal) {
      this._modal?.removeEventListener('sf-modal-close', this._onModal);
      this._modal?.removeEventListener('sf-drawer-close', this._onModal);
      this._modal = modal;
      modal.addEventListener(modal.localName === 'sf-drawer' ? 'sf-drawer-close' : 'sf-modal-close', this._onModal);
    }

    if (modal) {
      // The window follows the value open.
      const shown = Boolean(modal.openState);
      if (this.isOpen && !shown) modal.open?.();
      const frame = this.frameRoot;
      if (frame && frame !== this._listening) this.listen(frame);
    }

    this.revealInColumn();
    this.fitProgress();
  } // ------------------------------------------------------------ the row's fit

  /**
   * progress auto (owner decision C101 (4)): the row of steps while it fits
   * the wizard's own width, else the count line «Шаг N из M» over the bar.
   * The row is laid out at its one-line width for a moment (data-sf-measure
   * on the frame and on sf-steps' root, in the same task, never painted) and
   * compared with the room the head gives it; where it is wider the frame
   * is marked data-sf-progress-fit="count" and the sheet draws the count
   * line (the mark goes when the row fits). The row stays in the markup, out of view, so a wider wizard
   * measures it again. Measured after each drawing of the wizard and of its
   * sf-steps (before the first paint of the row: sf-steps' after-render), when
   * the fonts are in, and when the wizard's own width changes (a
   * ResizeObserver on the frame, the change applied in the next frame so the
   * observer never sees its own change).
   */


  fitProgress() {
    const frame = this.frameRoot;
    if (!frame || !this.isConnected) return;
    this.observeFit(frame);
    const auto = this.progress === 'auto' || !this.progress;

    if (!auto || !frame.classList.contains('sf-wizard--progress-row')) {
      frame.removeAttribute('data-sf-progress-fit');
      return;
    }

    const root = frame.querySelector('.sf-wizard-steps > .sf-steps');
    const list = root?.querySelector(':scope > .sf-steps-container'); // sf-steps has not drawn yet: its after-render comes back here.

    if (!root || !list) return;
    frame.setAttribute('data-sf-measure', '');
    root.setAttribute('data-sf-measure', '');
    const room = root.getBoundingClientRect().width;
    const need = list.getBoundingClientRect().width;
    root.removeAttribute('data-sf-measure');
    frame.removeAttribute('data-sf-measure');
    this._fitWidth = frame.getBoundingClientRect().width; // Not laid out (a closed window, display none): nothing to decide.

    if (!room) return; // Only the count is marked: a row that fits is the frame as drawn, so a
    // printed first paint (snapshot) carries nothing measured.

    const fit = need > room + FIT_SLACK ? 'count' : 'row';

    if (fit === 'count') {
      if (frame.getAttribute('data-sf-progress-fit') !== fit) frame.setAttribute('data-sf-progress-fit', fit);
    } else {
      frame.removeAttribute('data-sf-progress-fit');
    }
  }

  observeFit(frame) {
    if (frame === this._fitFrame) return;
    this.unobserveFit();
    this._fitFrame = frame;
    frame.addEventListener('sf-after-render', this._onStepsDrawn);
    if (typeof ResizeObserver !== 'function') return;

    if (!this._fitObserver) {
      this._fitObserver = new ResizeObserver(() => {
        const seen = this._fitFrame?.getBoundingClientRect().width;
        if (!seen || Math.abs(seen - (this._fitWidth ?? 0)) < 0.5 || this._fitQueued) return;
        this._fitQueued = true;

        const settle = () => {
          this._fitQueued = false;
          this.fitProgress();
        };

        if (typeof globalThis.requestAnimationFrame === 'function') globalThis.requestAnimationFrame(settle);else Promise.resolve().then(settle);
      });
      globalThis.document?.fonts?.ready?.then?.(() => this.fitProgress());
    }

    this._fitObserver.observe(frame);
  }

  unobserveFit() {
    this._fitObserver?.disconnect();
    this._fitFrame?.removeEventListener('sf-after-render', this._onStepsDrawn);
    this._fitFrame = null;
  }
  /**
   * Keeps the current step in view in the column's own scroller after a move
   * (block nearest): only the column scrolls, never the page, and a step
   * already in view does not move. Read after layout, once per step.
   */


  revealInColumn() {
    const scroller = this.find('.sf-wizard-column-scroll');

    if (!scroller) {
      this._revealed = undefined;
      return;
    }

    const key = `${this.index}:${scroller.clientHeight > 0}`;
    if (key === this._revealed) return;

    const settle = () => {
      const item = scroller.querySelector('[aria-current="step"]');
      if (!item || !scroller.isConnected || scroller.clientHeight === 0) return;
      this._revealed = `${this.index}:true`;
      const view = scroller.getBoundingClientRect();
      const box = item.getBoundingClientRect();
      if (box.top < view.top) scroller.scrollTop -= view.top - box.top;else if (box.bottom > view.bottom) scroller.scrollTop += box.bottom - view.bottom;
    };

    if (typeof globalThis.requestAnimationFrame === 'function') globalThis.requestAnimationFrame(settle);else settle();
  }

}

SfWizard.define('sf-wizard');

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "2f8a34e9c9c5"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderWizardTemplate: () => (/* binding */ renderWizardTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
 // sf-wizard's markup (scss/ draws it on one rung of the ladder).
//
//   .sf-wizard (region, the container the queries read)
//     .sf-wizard-head      the heading, «Шаг N из M», «Продолжить позже»;
//                          the row (sf-steps) or the compact line (the
//                          step's label, sf-progress-bar, «Все шаги») and
//                          the list of all steps on demand
//     .sf-wizard-main      the column of steps (progress column: as tall as
//                          the body, never taller -- it scrolls inside, an
//                          sf-scrollbar with the one bar) and the body:
//                          the step's title (heading, the focus target), its
//                          «why», the running line, the result, the steps
//                          themselves (data-sf-live: the page's live nodes,
//                          printed once in the first paint), the question
//                          before closing
//     .sf-wizard-footer    Back · (Skip) · one primary
//     a visually hidden status region that says where a move went
//
// Place modal draws the same frame inside an sf-modal, place drawer inside an
// sf-drawer; under the footer a quiet line says when the draft was kept
// (C179 (6)). Place pages makes the
// primary and Skip native submit buttons of the step's form (sf-button
// 1.5.0 form, name, value) and Back a link.

const STATE_ICONS = {
  done: 'check_circle',
  skipped: 'do_not_disturb_on',
  running: 'progress_activity',
  error: 'error'
};
const ALERT_STATUS = {
  done: 'success',
  error: 'error'
}; // The row is sf-steps 1.4 (owner decision C101): a row always (the wizard
// draws its own compact head when narrow), the steps the wizard's rule lets a
// person reach as buttons (navigation free over the wizard's own reachable),
// each step's state in sf-steps' words.

function stepsRow(context) {
  const {
    steps,
    index,
    size,
    words,
    component
  } = context;
  const items = steps.map(step => ({
    label: step.label,
    ...(step.state || !step.current ? {
      state: STAGES[step.state || '']
    } : {}),
    ...(step.reachable ? {} : {
      disabled: true
    })
  }));
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-steps class="sf-wizard-steps" size=${size} current=${String(index)} aria-label=${words.steps}
    layout="row" navigation="free"
    items=${JSON.stringify(items)} @sf-steps-change=${event => component.onProgress(event)}></sf-steps>`;
} // sf-steps' word for each state of a wizard step.


const STAGES = {
  done: 'done',
  skipped: 'skipped',
  running: 'running',
  error: 'error',
  '': 'ahead'
};

function stepList(context, extra = '') {
  const {
    steps,
    component,
    words,
    id
  } = context;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<ol class=${['sf-wizard-list', extra].filter(Boolean).join(' ')} id=${extra ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : `${id}-list`} aria-label=${words.steps}>
    ${steps.map(step => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<li class="sf-wizard-list-item" data-state=${step.state || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
      <button type="button" class="sf-wizard-list-step" ?disabled=${!step.reachable}
        aria-current=${step.current ? 'step' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        aria-label=${step.stateWord ? `${step.index + 1}. ${step.label}, ${step.stateWord}` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        @click=${() => component.goTo(step.index)}>
        <span class="sf-wizard-list-mark" aria-hidden="true">${STATE_ICONS[step.state] ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class="sf-icon">${STATE_ICONS[step.state]}</i>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-wizard-list-number">${step.index + 1}</span>`}</span>
        <span class="sf-wizard-list-label">${step.label}</span>
      </button>
    </li>`)}
  </ol>`;
}

function compact(context) {
  const {
    index,
    count,
    size,
    words,
    listOpen,
    component,
    id
  } = context;
  const value = count ? Math.round((index + 1) / count * 100) : 0;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-wizard-compact">
    <div class="sf-wizard-compact-line">
      <span class="sf-wizard-compact-label">${words.position}</span>
      <sf-button class="sf-wizard-all" size=${size === '1' ? '1/2' : '1/3'} appearance="ghost" scheme="on-surface-variant"
        text=${listOpen ? words.hideSteps : words.allSteps} expanded=${listOpen ? 'true' : 'false'} aria-controls=${`${id}-list`}
        @click=${() => component.toggleList()}></sf-button>
    </div>
    <sf-progress-bar class="sf-wizard-bar" size="1/3" value=${String(value)} label=${words.progress} value-text=${words.position}></sf-progress-bar>
  </div>`;
}

function head(context) {
  const {
    heading,
    words,
    offerLater,
    laterHref,
    size,
    shape,
    listOpen,
    component
  } = context;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-wizard-head">
    <div class=${heading || offerLater ? 'sf-wizard-top' : 'sf-wizard-top sf-wizard-top--bare'}>
      ${heading ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<p class="sf-wizard-heading">${heading}</p>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      <span class="sf-wizard-position">${words.position}</span>
      ${offerLater ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button class="sf-wizard-later" size=${size === '1' ? '1/2' : '1/3'} appearance="ghost" scheme="on-surface-variant"
        text=${words.later} href=${laterHref || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} @click=${event => component.continueLater(event)}></sf-button>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    </div>
    ${shape === 'row' ? stepsRow(context) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    ${compact(context)}
    ${listOpen ? stepList(context) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
  </div>`;
}

function result(step) {
  const status = ALERT_STATUS[step?.state];
  if (!status || !step.message) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-alert class="sf-wizard-result" status=${status} supporting-text=${step.message}></sf-alert>`;
}

function body(context) {
  const {
    step,
    level,
    words,
    busy,
    id,
    stepNodes,
    size
  } = context;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-wizard-body" aria-busy=${busy ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
    <div class="sf-wizard-step-head">
      <div class="sf-wizard-title" id=${`${id}-title`} role="heading" aria-level=${String(level)} tabindex="-1">${step?.heading ?? ''}</div>
      ${step?.why ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<p class="sf-wizard-why">${step.why}</p>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    </div>
    ${busy ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-wizard-running" role="status">
      <sf-spinner class="sf-wizard-spinner" size=${size} label=${words.running}></sf-spinner>
    </div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    ${result(step)}
    <div class="sf-wizard-live" data-sf-live>${stepNodes}</div>
  </div>`;
}

function footer(context) {
  const {
    first,
    step,
    size,
    words,
    primary,
    busy,
    component,
    form,
    place,
    actionName,
    last
  } = context;
  const pages = place === 'pages';
  const back = first || step?.type === 'result' ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button class="sf-wizard-back" size=${size}
    appearance="outline" scheme="on-surface" text=${words.back} icon-start="arrow_back" ?disabled=${busy}
    href=${pages && context.backHref && !busy ? context.backHref : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    @click=${event => component.onFooter(event, 'back')}></sf-button>`;
  const skip = step?.optional && step.state !== 'done' && step.type !== 'result' ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button class="sf-wizard-skip" size=${size}
    appearance="ghost" scheme="on-surface" text=${words.skip} ?disabled=${busy}
    native-type=${pages && form ? 'submit' : 'button'} form=${pages && form ? form.id : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    name=${pages && form ? actionName : lit__WEBPACK_IMPORTED_MODULE_0__.nothing} value=${pages && form ? 'skip' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    href=${pages && !form && context.nextHref ? context.nextHref : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    @click=${event => component.onFooter(event, 'skip')}></sf-button>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const primaryHref = pages && !form ? primary.action === 'done' || last ? context.doneHref : context.nextHref : '';
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-wizard-footer">
    ${back}
    <span class="sf-wizard-footer-end">
      ${skip}
      <sf-button class="sf-wizard-primary" size=${size} appearance="default" scheme="primary" text=${primary.text}
        ?loading=${busy}
        native-type=${pages && form ? 'submit' : 'button'} form=${pages && form ? form.id : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        name=${pages && form ? actionName : lit__WEBPACK_IMPORTED_MODULE_0__.nothing} value=${pages && form ? primary.action : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        href=${primaryHref || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        @click=${event => component.onFooter(event, 'primary')}></sf-button>
    </span>
  </div>`;
}

function frame(context) {
  const {
    shape,
    size,
    name,
    place,
    announce,
    busy
  } = context;
  const classes = ['sf-wizard', `sf-wizard--size-${size === '1' ? '1' : 'half'}`, `sf-wizard--progress-${shape}`, `sf-wizard--place-${place}`, place === 'modal' || place === 'drawer' ? 'sf-wizard--window' : '', busy ? 'sf-wizard--busy' : '', context.rootClass].filter(Boolean).join(' ');
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class=${classes} data-sf-wizard=${context.id} style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} role="region" aria-label=${name || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
    ${head(context)}
    <div class="sf-wizard-main">
      ${shape === 'column' ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<nav class="sf-wizard-column sf-scrollbar" aria-label=${context.words.steps}>
        <div class="sf-wizard-column-scroll sf-scrollbar__viewport">${stepList(context, 'sf-wizard-list--column')}</div>
      </nav>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      ${body(context)}
    </div>
    ${footer(context)}
    ${context.saved ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<p class="sf-wizard-saved"><i class="sf-icon" aria-hidden="true">cloud_done</i><span>${context.saved}</span></p>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    <div class="sf-wizard-announce sr-only" role="status">${announce}</div>
  </div>`;
}

function renderWizardTemplate(context) {
  const {
    place,
    name
  } = context;

  if (place === 'drawer') {
    // Place drawer (owner decision C179 (3)): a short wizard of two to four
    // steps in a side panel 30rem wide (sf-drawer size 2, C157 (2)) at the
    // end edge; the panel's title is the wizard's name, its × closes it
    // (= continue later, C179 (6)). On a phone the panel takes the screen
    // (C157 (4)).
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-drawer class="sf-wizard-drawer" heading=${name} size="2" placement="inline-end">
      <div class="sf-wizard-window" slot="content">${frame({ ...context,
      heading: ''
    })}</div>
    </sf-drawer>`;
  }

  if (place !== 'modal') return frame(context); // Place modal: the frame in an sf-modal; closed, nothing is drawn of it.
  // A window of the Framework (owner decisions C159, C179 (3), (4)): a size
  // by name -- form, 36rem (32rem compact), wide 48rem only with the column
  // of steps, the whole screen on a phone -- and the window's header with
  // the wizard's name as its title on the h4 step (C159 (5), C179 (2)) and
  // the ×; the frame draws no name of its own inside (heading: '').

  const size = context.phone ? 'full' : context.shape === 'column' ? 'wide' : 'form';
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-modal class="sf-wizard-modal" heading=${name} size=${size}>
    <div class="sf-wizard-window" slot="content">${frame({ ...context,
    heading: ''
  })}</div>
  </sf-modal>`;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "97e6d3ece1f6"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "5b7d7695b41b"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("element-manifest", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("element-manifest", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "2a080a730149"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("lit", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "deb1a4d61565"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("smart-base", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("smart-base", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "ba786af14a68"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   files: () => (/* binding */ files)
/* harmony export */ });
/* harmony import */ var _en_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("79fe483bc03d");
// Written by scripts/build-language-packs.mjs from src/core/lang/built-in.json
// (owner decision C282); do not edit. The words this bundle carries: the
// built-in languages' (en); every other language comes from
// a language file (core/lang/<code>.js or its parts).


const files = { en: { runtime: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime } };

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ en: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime });


/***/ },

/***/ "c784a72456f7"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.wizard","tag":"sf-wizard","version":"1.5.5","kind":"leaf","settings":{"place":{"type":"enum","values":["inline","modal","drawer","pages"],"default":"inline"},"navigation":{"type":"enum","values":["linear","free","visited"],"default":"linear"},"progress":{"type":"enum","values":["auto","row","count","column"],"default":"auto"},"size":{"type":"enum","values":["1/2","1"],"default":"1"},"heading":{"type":"string","default":""},"label":{"type":"string","default-from":"runtime.label"},"level":{"type":"number","integer":true,"min":1,"max":6,"default":2},"for":{"type":"string","default":""},"later":{"type":"boolean","default":false},"later-href":{"type":"string","default":""},"remember":{"type":"string","default":""},"done-href":{"type":"string","default":""},"action-name":{"type":"string","default":"wizard-action"},"running-text":{"type":"string","default-from":"runtime.running-text"},"focus-title":{"type":"boolean","default":false}},"values":{"current":{"type":"id","default":""},"open":{"type":"boolean","default":false},"value":{"type":"object","default":{}}},"events":{"change":{"x-native":false,"carries":{"previous":"string","current":"string","value":"object"}},"submit":{"carries":{"step":"string","action":{"type":"enum","values":["next","run","retry","apply","done","skip"]},"values":"object","value":"object"},"cancelable":true},"invalid":{"carries":{"step":"string","fields":"list"},"own-verb":true},"navigate":{"carries":{"id":"string","href":"string"},"cancelable":true},"open":{"carries":{},"cancelable":true},"close":{"carries":{"reason":{"type":"enum","values":["later","close","escape","outside","api"]},"current":"string","steps":"list","value":"object"},"cancelable":true},"completed":{"carries":{"steps":"list","value":"object"}}},"actions":{"open":{},"close":{},"go-to-step":{"with":{"name":"string"}},"next":{}},"host-states":{"data-place":"string","data-busy":"boolean","data-dirty":"boolean"},"css-variables":{"--sf-wizard-gap":{"type":"length","state":"default"},"--sf-wizard-padding":{"type":"length","state":"default"},"--sf-wizard-background-color":{"type":"color","state":"default"},"--sf-wizard-border-color":{"type":"color","state":"default"},"--sf-wizard-radius":{"type":"length","state":"default"},"--sf-wizard-max-width":{"type":"length","state":"default"}}}');

/***/ },

/***/ "79fe483bc03d"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Wizard","runtime":{"label":"Step-by-step setup","running-text":"Working…","position":"Step {n} of {count}","moved":"Step {n} of {count}: {step}","back":"Back","skip":"Skip","next":"Next","run":"Run","retry":"Try again","apply":"Apply","done":"Done","later":"Continue later","steps":"Steps","all-steps":"All steps","hide-steps":"Hide steps","progress":"Wizard progress","state-done":"Done","state-skipped":"Skipped","state-running":"In progress","state-error":"Error","required":"Fill in this field","invalid":"Check the value","saved":"Draft saved at {time}"},"events":{"close":{"label":"Continue later"}}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("d461538f1791");
/******/
/******/ })()
;