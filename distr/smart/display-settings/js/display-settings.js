/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "4fa740738112"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DEFAULTS: () => (/* binding */ DEFAULTS),
/* harmony export */   FONTS: () => (/* binding */ FONTS),
/* harmony export */   IMAGES: () => (/* binding */ IMAGES),
/* harmony export */   LEGACY_REMOVE_AFTER: () => (/* binding */ LEGACY_REMOVE_AFTER),
/* harmony export */   LEGACY_SCHEMES: () => (/* binding */ LEGACY_SCHEMES),
/* harmony export */   LEGACY_SINCE: () => (/* binding */ LEGACY_SINCE),
/* harmony export */   SCHEMES: () => (/* binding */ SCHEMES),
/* harmony export */   STORAGE_KEY: () => (/* binding */ STORAGE_KEY),
/* harmony export */   TEXT_SCALES: () => (/* binding */ TEXT_SCALES),
/* harmony export */   WORDS: () => (/* reexport safe */ _lang_skip_link_index_mjs__WEBPACK_IMPORTED_MODULE_3__["default"]),
/* harmony export */   applySettings: () => (/* binding */ applySettings),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   forcedColors: () => (/* binding */ forcedColors),
/* harmony export */   fromRoot: () => (/* binding */ fromRoot),
/* harmony export */   installSkipLink: () => (/* binding */ installSkipLink),
/* harmony export */   isDefault: () => (/* binding */ isDefault),
/* harmony export */   normalize: () => (/* binding */ normalize),
/* harmony export */   readStored: () => (/* binding */ readStored),
/* harmony export */   reducedMotion: () => (/* reexport safe */ _motion_js__WEBPACK_IMPORTED_MODULE_2__.reducedMotion),
/* harmony export */   resetSettings: () => (/* binding */ resetSettings),
/* harmony export */   schemeName: () => (/* binding */ schemeName),
/* harmony export */   writeSettings: () => (/* binding */ writeSettings)
/* harmony export */ });
/* harmony import */ var _deprecations_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d3818183b14c");
/* harmony import */ var _page_language_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("43090d1c8307");
/* harmony import */ var _motion_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("2ee7a47e9b10");
/* harmony import */ var _lang_skip_link_index_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("b8a4348874ab");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_deprecations_js__WEBPACK_IMPORTED_MODULE_0__, _page_language_js__WEBPACK_IMPORTED_MODULE_1__]);
([_deprecations_js__WEBPACK_IMPORTED_MODULE_0__, _page_language_js__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _deprecations_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_deprecations_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _page_language_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_page_language_js__WEBPACK_IMPORTED_MODULE_1__);
// SF.displaySettings: how a person asked this site to be shown (owner decision
// C196, 2026-11-15; research ui-control
// control/research/2026-11-15-accessibility-worldwide.md).
//
// The settings are root attributes the core sheet reads
// (core/scss/_sf_css__display.scss): data-sf-scheme, data-sf-text-scale,
// data-sf-text-spacing, data-sf-images, data-sf-motion, data-sf-font and
// data-sf-links. Core applies the person's choice on every page of the site,
// whether the page carries the sf-display-settings panel or not; the panel
// only writes it.
//
// - The device first: a text step multiplies the browser's own size; under
//   forced-colors the colours are the system's (the panel's colour group is
//   off); reducedMotion() is true when the device or the person asks.
// - The choice is kept in this browser only: localStorage
//   `sf-display-settings`, no cookie, nothing sent to a server (C196 (5)).
//   A browser that refuses storage keeps it for the page.
// - Nothing here claims that a site meets a standard (C196 (6)).
//
// Also the link «Перейти к содержимому» / «Skip to content» (C196, core on
// every site): written first in <body> when the page has a main region and no
// such link of its own; <html data-sf-skip-link="off"> leaves it out.
//
// The state is on the shared global: every bundle carries its own copy of
// this module.



const STORAGE_KEY = 'sf-display-settings';
const SCHEMES = Object.freeze(['black-on-white', 'white-on-black', 'yellow-on-black', 'blue-on-sky', 'brown-on-cream']);
const TEXT_SCALES = Object.freeze([100, 125, 150, 175, 200]);
const IMAGES = Object.freeze(['colour', 'grey', 'hide']);
const FONTS = Object.freeze(['site', 'sans', 'serif']); // The legacy low-vision version's scheme names (src/component/special, SF4
// cookies `specialcolor`), each to the nearest new scheme until 2027-01-01
// (C196 (3), (7); journal display-settings-replaces-special).

const LEGACY_SCHEMES = Object.freeze({
  white: 'black-on-white',
  black: 'white-on-black',
  yellow: 'yellow-on-black',
  blue: 'blue-on-sky',
  green: 'yellow-on-black'
});
const LEGACY_SINCE = '2026-11-15';
const LEGACY_REMOVE_AFTER = '2027-01-01'; // The words core says itself (core/js/lang/skip-link: English built in, the
// other languages from a language file, C282); the same as
// sf-display-settings' language files (tests/display-settings.contract.test.mjs
// holds them equal).



const DEFAULTS = Object.freeze({
  scheme: '',
  textScale: 100,
  textSpacing: 'normal',
  images: 'colour',
  motion: 'system',
  font: 'site',
  links: 'site'
});
const ATTRIBUTES = Object.freeze({
  scheme: 'data-sf-scheme',
  textScale: 'data-sf-text-scale',
  textSpacing: 'data-sf-text-spacing',
  images: 'data-sf-images',
  motion: 'data-sf-motion',
  font: 'data-sf-font',
  links: 'data-sf-links'
});
const CAPTION = 'sf-image-caption';

function state() {
  const SF = globalThis.SF = globalThis.SF || {};
  const internal = SF.__internal || (SF.__internal = {});
  return internal.displaySettings ||= {
    listeners: new Set(),
    memory: null,
    observer: null,
    skipClick: false
  };
}

function storage() {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}
/** A scheme name as core knows it: a new name, a legacy name aliased, else ''. */


function schemeName(value) {
  const name = String(value ?? '').trim().toLowerCase().replace(/^special/u, '');
  if (SCHEMES.includes(name)) return name;
  const to = LEGACY_SCHEMES[name];
  if (!to) return '';
  (0,_deprecations_js__WEBPACK_IMPORTED_MODULE_0__.noteDeprecated)({
    component: 'sf-display-settings',
    kind: 'value',
    attribute: 'scheme',
    from: String(value),
    to,
    since: LEGACY_SINCE,
    remove_after: LEGACY_REMOVE_AFTER,
    expired: Date.now() > Date.parse(`${LEGACY_REMOVE_AFTER}T23:59:59Z`)
  });
  return to;
}
/** The settings made safe: every field one of its values, unknown fields gone. */

function normalize(value) {
  const given = value && typeof value === 'object' ? value : {};
  const scale = Number(given.textScale);
  return {
    scheme: schemeName(given.scheme),
    textScale: TEXT_SCALES.includes(scale) ? scale : 100,
    textSpacing: given.textSpacing === 'wide' ? 'wide' : 'normal',
    images: IMAGES.includes(given.images) ? given.images : given.images === 'gray' ? 'grey' : 'colour',
    motion: given.motion === 'reduce' ? 'reduce' : 'system',
    font: FONTS.includes(given.font) ? given.font : 'site',
    links: given.links === 'underline' ? 'underline' : 'site'
  };
}
/** Whether nothing is changed. */

function isDefault(settings) {
  const value = normalize(settings);
  return Object.keys(DEFAULTS).every(key => value[key] === DEFAULTS[key]);
} // The root attribute of each field; a default is no attribute.

function attributeValue(key, value) {
  if (value === DEFAULTS[key]) return null;
  return String(value);
}
/** The settings the root shows now (a page or a server may have set them). */


function fromRoot(root = globalThis.document?.documentElement) {
  if (!root?.getAttribute) return normalize({});

  const read = key => root.getAttribute(ATTRIBUTES[key]);

  return normalize({
    scheme: read('scheme'),
    textScale: read('textScale') ?? 100,
    textSpacing: read('textSpacing'),
    images: read('images'),
    motion: read('motion'),
    font: read('font'),
    links: read('links')
  });
}
/** The person's choice kept in this browser, or null. */

function readStored() {
  const store = storage();

  if (store) {
    try {
      const raw = store.getItem(STORAGE_KEY);
      if (raw !== null) return normalize(JSON.parse(raw));
    } catch {// Not JSON, or storage refused: as if nothing was kept.
    }
  }

  return state().memory ? normalize(state().memory) : null;
}

function captionImages(doc) {
  for (const image of doc.querySelectorAll('img[alt], svg[role="img"][aria-label]')) {
    const text = (image.getAttribute('alt') ?? image.getAttribute('aria-label') ?? '').trim();
    if (!text) continue;
    const anchor = image.parentElement?.localName === 'picture' ? image.parentElement : image;
    const next = anchor.nextElementSibling;

    if (next?.classList.contains(CAPTION)) {
      if (next.textContent !== text) next.textContent = text;
      continue;
    }

    const caption = doc.createElement('span');
    caption.className = CAPTION;
    caption.textContent = text;
    anchor.after(caption);
  }
}

function followImages(doc, hide) {
  const held = state();

  if (!hide) {
    held.observer?.disconnect();
    held.observer = null;
    return;
  }

  if (doc.body) captionImages(doc);
  if (held.observer || !doc.defaultView?.MutationObserver || !doc.documentElement) return;
  let queued = false;
  held.observer = new doc.defaultView.MutationObserver(() => {
    if (queued) return;
    queued = true;
    queueMicrotask(() => {
      queued = false;
      captionImages(doc);
    });
  });
  held.observer.observe(doc.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['alt', 'aria-label']
  });
}
/** Writes the settings on the root (no storage). */


function applySettings(settings, root = globalThis.document?.documentElement) {
  if (!root?.setAttribute) return normalize(settings);
  const value = normalize(settings);

  for (const [key, name] of Object.entries(ATTRIBUTES)) {
    const next = attributeValue(key, value[key]);
    if (next === null) root.removeAttribute(name);else if (root.getAttribute(name) !== next) root.setAttribute(name, next);
  }

  if (root.ownerDocument) followImages(root.ownerDocument, value.images === 'hide');
  return value;
}

function announce(value, root) {
  for (const listener of state().listeners) {
    try {
      listener({ ...value
      });
    } catch (error) {
      console.error('SF.displaySettings listener failed', error);
    }
  }

  const View = root?.ownerDocument?.defaultView;
  if (View?.CustomEvent) root.ownerDocument.dispatchEvent(new View.CustomEvent('sf-display-change', {
    detail: { ...value
    }
  }));
}
/** Keeps the choice in this browser and shows it. */


function writeSettings(settings, root = globalThis.document?.documentElement) {
  const value = normalize(settings);
  const store = storage();
  const plain = isDefault(value) ? null : value;
  state().memory = plain;

  if (store) {
    try {
      if (plain) store.setItem(STORAGE_KEY, JSON.stringify(plain));else store.removeItem(STORAGE_KEY);
    } catch {// A full or refused storage keeps the choice for this page only.
    }
  }

  applySettings(value, root);
  announce(value, root);
  return value;
}
/** «Обычная версия»: everything back to the site's own look. */

function resetSettings(root = globalThis.document?.documentElement) {
  return writeSettings(DEFAULTS, root);
}

function matches(query) {
  try {
    return Boolean(globalThis.matchMedia?.(query).matches);
  } catch {
    return false;
  }
}
/** True when the device asks for less motion or the person stopped it here. */



/** True when the system sets the colours (Windows contrast themes). */

function forcedColors() {
  return matches('(forced-colors: active)');
} // ---------------------------------------------------------------------------
// «Перейти к содержимому»
// ---------------------------------------------------------------------------

function focusable(element) {
  return element.matches?.('a[href], button, input, select, textarea, [tabindex], [contenteditable="true"]');
}

function skipTarget(link) {
  const hash = link.getAttribute('href') ?? '';
  if (!hash.startsWith('#') || hash.length < 2) return null;

  try {
    return link.ownerDocument.getElementById(decodeURIComponent(hash.slice(1)));
  } catch {
    return null;
  }
} // The keyboard follows the link: the target takes the focus (Safari and some
// screen readers leave it where it was on a jump to a non-focusable element).


function followSkip(event) {
  const link = event.target?.closest?.('a.sf-skip-link');
  if (!link) return;
  const target = skipTarget(link);
  if (!target) return;
  if (!focusable(target)) target.setAttribute('tabindex', '-1');
  target.focus({
    preventScroll: false
  });
}
/** Writes the skip link when the page has a main region and none of its own. */


function installSkipLink(doc = globalThis.document) {
  if (!doc?.body || !doc.documentElement) return null;
  const held = state();

  if (!held.skipClick) {
    held.skipClick = true;
    doc.addEventListener('click', followSkip);
  }

  if (doc.documentElement.getAttribute('data-sf-skip-link') === 'off') return null;
  if (doc.querySelector('a.sf-skip-link, a[data-sf-skip-link]')) return null;
  const main = doc.querySelector('main, [role="main"]');
  if (!main) return null;

  if (!main.id) {
    let id = 'sf-main';

    for (let n = 2; doc.getElementById(id); n += 1) id = `sf-main-${n}`;

    main.id = id;
  }

  const link = doc.createElement('a');
  link.className = 'sf-skip-link';
  link.href = `#${main.id}`;
  link.setAttribute('data-sf-skip-link', 'core'); // Its word comes from the page's language part, which may arrive after the
  // link is drawn (C282): it is written again whenever words arrive.

  const draw = () => {
    link.textContent = (0,_page_language_js__WEBPACK_IMPORTED_MODULE_1__.pageWord)(_lang_skip_link_index_mjs__WEBPACK_IMPORTED_MODULE_3__["default"], 'skip-link-text', doc.documentElement, {
      component: 'sf-display-settings',
      source: 'ru'
    });
  };

  draw();
  _page_language_js__WEBPACK_IMPORTED_MODULE_1__.language.onChange?.(() => {
    if (link.isConnected) draw();
  });
  doc.body.prepend(link);
  return link;
} // ---------------------------------------------------------------------------

function subscribe(listener) {
  if (typeof listener !== 'function') return () => {};
  state().listeners.add(listener);
  return () => state().listeners.delete(listener);
}

function start() {
  const doc = globalThis.document;
  const root = doc?.documentElement;
  if (!root) return; // The person's choice, before the page draws what core draws. A setting the
  // page printed on the root itself stays when the person chose nothing.

  const stored = readStored();
  if (stored) applySettings(stored, root);else if (root.getAttribute(ATTRIBUTES.images) === 'hide') followImages(doc, true);

  const ready = () => {
    installSkipLink(doc);
    if (root.getAttribute(ATTRIBUTES.images) === 'hide') followImages(doc, true);
  }; // A microtask later when the page is already parsed: core installs its
  // language-pack fetcher after this module runs, and a word asked before it
  // has no pack on its way (C282, group build 10).


  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', ready, {
    once: true
  });else if (typeof queueMicrotask === 'function') queueMicrotask(ready);else ready(); // Another tab of the site changed the choice.

  globalThis.addEventListener?.('storage', event => {
    if (event.key !== STORAGE_KEY || event.storageArea !== storage()) return;
    let next = null;

    try {
      next = event.newValue === null ? null : JSON.parse(event.newValue);
    } catch {
      next = null;
    }

    announce(applySettings(next ?? DEFAULTS, root), root);
  });
}

if (typeof globalThis !== 'undefined') {
  globalThis.SF = globalThis.SF || {};

  if (!globalThis.SF.displaySettings) {
    globalThis.SF.displaySettings = Object.freeze({
      storageKey: STORAGE_KEY,
      schemes: SCHEMES,
      textScales: TEXT_SCALES,
      defaults: DEFAULTS,
      read: () => readStored() ?? fromRoot(),
      current: () => fromRoot(),
      write: settings => writeSettings(settings),
      reset: () => resetSettings(),
      subscribe,
      reducedMotion: () => (0,_motion_js__WEBPACK_IMPORTED_MODULE_2__.reducedMotion)(),
      forcedColors: () => forcedColors(),
      installSkipLink: doc => installSkipLink(doc)
    });
    start();
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (globalThis.SF?.displaySettings);
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "2ee7a47e9b10"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MOTION_ATTRIBUTE: () => (/* binding */ MOTION_ATTRIBUTE),
/* harmony export */   MOTION_CHANGE: () => (/* binding */ MOTION_CHANGE),
/* harmony export */   reducedMotion: () => (/* binding */ reducedMotion),
/* harmony export */   watchMotion: () => (/* binding */ watchMotion)
/* harmony export */ });
// Whether to keep things still: the device asks for less motion
// (prefers-reduced-motion: reduce), or the person stopped motion on this site
// (<html data-sf-motion="reduce">, written by the sf-display-settings panel
// through SF.displaySettings; owner decision C196, 2026-11-15). Core's own
// scripts read this one function; the core sheet stops CSS animations and
// transitions under the same mark (core/scss/_sf_css__display.scss).
//
// No state and no side effect, so every bundle may carry it.
const MOTION_ATTRIBUTE = 'data-sf-motion';
const MOTION_CHANGE = 'sf-display-change';
function reducedMotion(root = globalThis.document?.documentElement, win = globalThis) {
  try {
    if (win.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return true;
  } catch {// No media queries here: only the page's own mark.
  }

  return root?.getAttribute?.(MOTION_ATTRIBUTE) === 'reduce';
} // Calls `listener` when either source changes; returns the stop.

function watchMotion(listener, win = globalThis) {
  const media = win.matchMedia?.('(prefers-reduced-motion: reduce)') ?? null;
  const doc = win.document;
  media?.addEventListener?.('change', listener);
  doc?.addEventListener?.(MOTION_CHANGE, listener);
  return () => {
    media?.removeEventListener?.('change', listener);
    doc?.removeEventListener?.(MOTION_CHANGE, listener);
  };
}

/***/ },

/***/ "d86d592a2f6b"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SfDisplaySettings: () => (/* binding */ SfDisplaySettings),
/* harmony export */   currentSettings: () => (/* binding */ currentSettings),
/* harmony export */   nextTextScale: () => (/* binding */ nextTextScale)
/* harmony export */ });
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _core_js_display_settings_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("4fa740738112");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("031d130e6727");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("24030a2aa914");
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("ea80db6314cf");
/* harmony import */ var _lang_index_mjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("5c0f586d3f5e");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_display_settings_js__WEBPACK_IMPORTED_MODULE_2__, _js_templates_default__WEBPACK_IMPORTED_MODULE_3__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_display_settings_js__WEBPACK_IMPORTED_MODULE_2__, _js_templates_default__WEBPACK_IMPORTED_MODULE_3__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
// sf-display-settings: how a person wants this site shown (owner decision
// C196, 2026-11-15; research ui-control
// control/research/2026-11-15-accessibility-worldwide.md):
//
//   <sf-display-settings></sf-display-settings>
//   <sf-display-settings label="Версия для слабовидящих" show-font show-links></sf-display-settings>
//   <sf-display-settings layout="panel"></sf-display-settings>
//
// Text 100–200 %, a colour scheme, wider spacing, images in colour, grey or
// hidden with their text, motion stopped, «Обычная версия»; the author turns
// on the font and «Подчёркивать ссылки». The panel only writes the choice:
// core (core/js/display-settings.js, SF.displaySettings) keeps it in this
// browser and applies it on every page of the site as root attributes the
// core sheet reads. Nothing is sent, nothing claims conformance.
//
// From its component.json (standard simai.smart-component 1.3.15 §3, §4,
// §8): the settings are made by core/js/element-manifest.js, the words are
// the language files'.






 // Only the words on screen ship in the bundle, English only (owner decision
// C282): Russian and every other language come from a language file. The
// title, settings and events stay in the language files for the Studio and the
// docs (localization study LC-2).
// The panel's ids, one per element on the page (stable across renders).

let sequence = 0;

const media = query => {
  try {
    return globalThis.matchMedia?.(query) ?? null;
  } catch {
    return null;
  }
};
/** The person's settings: what this browser keeps, else what the root shows. */


function currentSettings() {
  return (0,_core_js_display_settings_js__WEBPACK_IMPORTED_MODULE_2__.readStored)() ?? (0,_core_js_display_settings_js__WEBPACK_IMPORTED_MODULE_2__.fromRoot)();
}
/** The next text step from `scale`, `direction` -1 or 1, held to 100–200. */

function nextTextScale(scale, direction) {
  const at = Math.max(0, _core_js_display_settings_js__WEBPACK_IMPORTED_MODULE_2__.TEXT_SCALES.indexOf(Number(scale)));
  const next = Math.min(_core_js_display_settings_js__WEBPACK_IMPORTED_MODULE_2__.TEXT_SCALES.length - 1, Math.max(0, at + Math.sign(direction)));
  return _core_js_display_settings_js__WEBPACK_IMPORTED_MODULE_2__.TEXT_SCALES[next];
}
const DisplaySettingsElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_4__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: _lang_index_mjs__WEBPACK_IMPORTED_MODULE_6__.files,
  source: 'ru',
  actions: {
    reset() {
      const previous = currentSettings();
      if ((0,_core_js_display_settings_js__WEBPACK_IMPORTED_MODULE_2__.isDefault)(previous)) return 'unchanged';
      const settings = (0,_core_js_display_settings_js__WEBPACK_IMPORTED_MODULE_2__.writeSettings)(_core_js_display_settings_js__WEBPACK_IMPORTED_MODULE_2__.DEFAULTS);
      this.requestComponentUpdate('reset');
      this.sfEmit('change', {
        settings,
        previous,
        setting: 'reset'
      });
      return undefined;
    }

  }
});

class SfDisplaySettings extends DisplaySettingsElement {
  constructor() {
    super();
    this._uid = `sf-display-settings-${++sequence}`;

    this._redraw = () => this.requestComponentUpdate('display-settings');

    this._onKey = event => {
      if (event.key !== 'Escape' || this.layout === 'panel' || !this.open) return;
      event.stopPropagation();
      this.open = false;
      this.querySelector('.sf-display-settings__trigger')?.focus?.();
    };
  }

  connectedCallback() {
    super.connectedCallback?.();
    this._forced = media('(forced-colors: active)');
    this._motion = media('(prefers-reduced-motion: reduce)');
    this._forced?.addEventListener?.('change', this._redraw);
    this._motion?.addEventListener?.('change', this._redraw);
    this.ownerDocument.addEventListener('sf-display-change', this._redraw);
    this.addEventListener('keydown', this._onKey);
  }

  disconnectedCallback() {
    this._forced?.removeEventListener?.('change', this._redraw);
    this._motion?.removeEventListener?.('change', this._redraw);
    this.ownerDocument.removeEventListener('sf-display-change', this._redraw);
    this.removeEventListener('keydown', this._onKey);
    super.disconnectedCallback?.();
  } // The value: the person's choice as core keeps it.


  get settings() {
    return currentSettings();
  }

  toggle(open = !this.open) {
    this.open = Boolean(open);
  } // One setting from a press; the root shows it, the browser keeps it.


  choose(setting, value) {
    if (!Object.prototype.hasOwnProperty.call(_core_js_display_settings_js__WEBPACK_IMPORTED_MODULE_2__.DEFAULTS, setting)) return;
    if (setting === 'scheme' && this.forcedColors) return;
    const previous = currentSettings();
    let next = value;
    if (setting === 'links') next = previous.links === 'underline' ? 'site' : 'underline';
    if (setting === 'textScale') next = Number(value);
    const settings = (0,_core_js_display_settings_js__WEBPACK_IMPORTED_MODULE_2__.writeSettings)((0,_core_js_display_settings_js__WEBPACK_IMPORTED_MODULE_2__.normalize)({ ...previous,
      [setting]: next
    }));
    if (JSON.stringify(settings) === JSON.stringify(previous)) return;
    this.sfEmit('change', {
      settings,
      previous,
      setting
    });
  }

  stepText(direction) {
    this.choose('textScale', nextTextScale(currentSettings().textScale, direction));
  }

  get forcedColors() {
    return Boolean(this._forced?.matches);
  }

  templateContext() {
    const settings = currentSettings();
    const forced = this.forcedColors;
    const layout = this.layout === 'panel' ? 'panel' : 'disclosure';
    const shown = layout === 'panel' || Boolean(this.open);
    this.sfHostState('data-open', shown);
    this.sfHostState('data-forced-colors', forced);

    const word = (key, vars) => this.sfWord(key, vars ? {
      vars
    } : undefined);

    const id = name => `${this._uid}-${name}`;

    const options = (setting, values) => values.map(([value, key]) => ({
      value,
      text: word(key),
      pressed: settings[setting] === value
    }));

    const groups = [{
      id: 'textScale',
      labelId: id('text'),
      label: word('text-label'),
      value: word('text-value', {
        value: settings.textScale
      }),
      smaller: {
        mark: word('text-smaller-mark'),
        text: word('text-smaller')
      },
      larger: {
        mark: word('text-larger-mark'),
        text: word('text-larger')
      }
    }, {
      id: 'scheme',
      labelId: id('colour'),
      noteId: id('colour-note'),
      label: word('colour-label'),
      disabled: forced,
      note: forced ? word('colour-system') : '',
      options: options('scheme', [['', 'scheme-site'], ..._core_js_display_settings_js__WEBPACK_IMPORTED_MODULE_2__.SCHEMES.map(name => [name, `scheme-${name}`])])
    }, {
      id: 'textSpacing',
      labelId: id('spacing'),
      label: word('spacing-label'),
      options: options('textSpacing', [['normal', 'spacing-normal'], ['wide', 'spacing-wide']])
    }, {
      id: 'images',
      labelId: id('images'),
      label: word('images-label'),
      options: options('images', [['colour', 'images-colour'], ['grey', 'images-grey'], ['hide', 'images-hide']])
    }, {
      id: 'motion',
      labelId: id('motion'),
      noteId: id('motion-note'),
      label: word('motion-label'),
      note: this._motion?.matches ? word('motion-device') : '',
      options: options('motion', [['system', 'motion-system'], ['reduce', 'motion-reduce']])
    }];

    if (this.showFont) {
      groups.push({
        id: 'font',
        labelId: id('font'),
        label: word('font-label'),
        options: options('font', [['site', 'site-font'], ['sans', 'sans-font'], ['serif', 'serif-font']])
      });
    }

    if (this.showLinks) {
      groups.push({
        id: 'links',
        labelId: id('links'),
        label: word('links-label'),
        options: [{
          value: 'underline',
          text: word('underline-links'),
          pressed: settings.links === 'underline'
        }]
      });
    }

    return this.createTemplateContext({ ...this.getPropsContext(),
      component: this,
      layout,
      shown,
      label: this.label || word('label-text'),
      panelId: id('panel'),
      groups,
      words: {
        reset: word('reset-text')
      },
      rootClass: this.getRootClass()
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_3__.renderDisplaySettingsTemplate)(this.templateContext());
  }

}

SfDisplaySettings.define('sf-display-settings');

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "031d130e6727"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderDisplaySettingsTemplate: () => (/* binding */ renderDisplaySettingsTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
 // sf-display-settings' markup (scss/ draws it; prototype
// accessibility-panel-study, panel B).
//
// - disclosure: an outline sf-button (the label) with aria-expanded and
//   aria-controls, and the panel under it, hidden while closed;
// - panel: the panel alone.
// The panel is a group named by the label; each setting a group named by its
// word, its choices outline sf-buttons with aria-pressed (C12 pressed look on
// the chosen one). The text steps are «А−» and «А+», named in words, the size
// in a polite live region. A group the device decides (forced-colors) is
// disabled and says so.

const BUTTON = {
  size: '1/2',
  appearance: 'outline',
  scheme: 'on-surface'
};

function choice(context, group, option) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button class="sf-display-settings__choice" size=${BUTTON.size} appearance=${BUTTON.appearance}
    scheme=${BUTTON.scheme} text=${option.text} pressed=${option.pressed ? 'true' : 'false'}
    ?disabled=${group.disabled} data-setting=${group.id} data-value=${option.value}
    @click=${() => context.component.choose(group.id, option.value)}></sf-button>`;
}

function textGroup(context, group) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-display-settings__group" role="group" aria-labelledby=${group.labelId}>
    <span class="sf-display-settings__label" id=${group.labelId}>${group.label}</span>
    <sf-button class="sf-display-settings__step" size=${BUTTON.size} appearance=${BUTTON.appearance} scheme=${BUTTON.scheme}
      text=${group.smaller.mark} aria-label=${group.smaller.text} data-setting="textScale" data-value="-1"
      @click=${() => context.component.stepText(-1)}></sf-button>
    <span class="sf-display-settings__value" aria-live="polite">${group.value}</span>
    <sf-button class="sf-display-settings__step" size=${BUTTON.size} appearance=${BUTTON.appearance} scheme=${BUTTON.scheme}
      text=${group.larger.mark} aria-label=${group.larger.text} data-setting="textScale" data-value="1"
      @click=${() => context.component.stepText(1)}></sf-button>
  </div>`;
}

function choiceGroup(context, group) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-display-settings__group" role="group" aria-labelledby=${group.labelId}
    aria-describedby=${group.note ? group.noteId : lit__WEBPACK_IMPORTED_MODULE_0__.nothing} data-group=${group.id}>
    <span class="sf-display-settings__label" id=${group.labelId}>${group.label}</span>
    ${group.options.map(option => choice(context, group, option))}
    ${group.note ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-display-settings__note" id=${group.noteId}>${group.note}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
  </div>`;
}

function panel(context) {
  const {
    words,
    component
  } = context;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-display-settings__panel" id=${context.panelId} role="group" aria-label=${context.label}
    ?hidden=${!context.shown}>
    ${context.groups.map(group => group.id === 'textScale' ? textGroup(context, group) : choiceGroup(context, group))}
    <div class="sf-display-settings__group sf-display-settings__group--reset">
      <sf-button class="sf-display-settings__reset" size=${BUTTON.size} appearance="ghost" scheme=${BUTTON.scheme}
        text=${words.reset} @click=${() => component.reset()}></sf-button>
    </div>
  </div>`;
}

function renderDisplaySettingsTemplate(context) {
  const classes = ['sf-display-settings', `sf-display-settings--${context.layout}`, context.rootClass].filter(Boolean).join(' ');
  if (context.layout === 'panel') return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class=${classes}>${panel(context)}</div>`;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class=${classes}>
    <sf-button class="sf-display-settings__trigger" size=${BUTTON.size} appearance=${BUTTON.appearance} scheme=${BUTTON.scheme}
      text=${context.label} expanded=${context.shown ? 'true' : 'false'} aria-controls=${context.panelId}
      @click=${() => context.component.toggle()}></sf-button>
    ${panel(context)}
  </div>`;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "ea80db6314cf"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


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

/***/ "b8a4348874ab"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   files: () => (/* binding */ files)
/* harmony export */ });
/* harmony import */ var _en_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("f9d8a56b347c");
// Written by scripts/build-language-packs.mjs from src/core/lang/built-in.json
// (owner decision C282); do not edit. The words this bundle carries: the
// built-in languages' (en); every other language comes from
// a language file (core/lang/<code>.js or its parts).


const files = { en: { runtime: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime } };

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ en: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime });


/***/ },

/***/ "5c0f586d3f5e"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   files: () => (/* binding */ files)
/* harmony export */ });
/* harmony import */ var _en_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("9f95a15b5ded");
// Written by scripts/build-language-packs.mjs from src/core/lang/built-in.json
// (owner decision C282); do not edit. The words this bundle carries: the
// built-in languages' (en); every other language comes from
// a language file (core/lang/<code>.js or its parts).


const files = { en: { runtime: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime } };

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ en: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime });


/***/ },

/***/ "f9d8a56b347c"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"runtime":{"skip-link-text":"Skip to content"}}');

/***/ },

/***/ "24030a2aa914"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.display-settings","tag":"sf-display-settings","version":"1.1.3","kind":"leaf","settings":{"label":{"type":"string","default-from":"runtime.label-text"},"layout":{"type":"enum","values":["disclosure","panel"],"default":"disclosure"},"open":{"type":"boolean","default":false},"show-font":{"type":"boolean","default":false},"show-links":{"type":"boolean","default":false}},"values":{"settings":{"type":"object"}},"events":{"change":{"x-native":false,"carries":{"settings":{"type":"object"},"previous":{"type":"object"},"setting":{"type":"string"}}}},"actions":{"reset":{}},"host-states":{"data-open":"boolean","data-forced-colors":"boolean"},"css-variables":{"--sf-display-settings-background":{"type":"color","state":"default"},"--sf-display-settings-border-color":{"type":"color","state":"default"},"--sf-display-settings-label-color":{"type":"color","state":"default"},"--sf-display-settings-gap":{"type":"length","state":"default"},"--sf-display-settings-group-gap":{"type":"length","state":"default"}}}');

/***/ },

/***/ "9f95a15b5ded"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Display settings","runtime":{"label-text":"Display settings","text-label":"Text","text-smaller":"Smaller text","text-larger":"Larger text","text-smaller-mark":"A−","text-larger-mark":"A+","text-value":"{value}%","colour-label":"Colour","scheme-site":"As on the site","scheme-black-on-white":"Black on white","scheme-white-on-black":"White on black","scheme-yellow-on-black":"Yellow on black","scheme-blue-on-sky":"Blue on light blue","scheme-brown-on-cream":"Brown on cream","colour-system":"Colours are set by your device","spacing-label":"Spacing","spacing-normal":"Normal","spacing-wide":"Wider","images-label":"Images","images-colour":"Colour","images-grey":"Greyscale","images-hide":"Hide","motion-label":"Motion","motion-system":"As on the device","motion-reduce":"Stop","motion-device":"Your device already reduces motion","font-label":"Font","site-font":"The site\'s","sans-font":"Sans serif","serif-font":"Serif","links-label":"Links","underline-links":"Underline","reset-text":"Standard view","skip-link-text":"Skip to content"}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("d86d592a2f6b");
/******/
/******/ })()
;