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

/***/ "14baf2d02711"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   logicalSide: () => (/* binding */ logicalSide),
/* harmony export */   physicalPlacement: () => (/* binding */ physicalPlacement)
/* harmony export */ });
// Pure logical ⇄ physical placement mapping for SF.Position. No DOM and no
// dependencies, so it is testable without Floating UI installed.
const SIDES = ['block-start', 'block-end', 'inline-start', 'inline-end'];
const ALIGNS = ['start', 'center', 'end'];
/** Maps a logical side and alignment to a Floating UI placement. */

function physicalPlacement(side = 'block-end', align = 'start', rtl = false) {
  if (!SIDES.includes(side)) throw new TypeError(`Unknown placement side: ${side}`);
  if (!ALIGNS.includes(align)) throw new TypeError(`Unknown placement alignment: ${align}`);
  const physical = side === 'block-start' ? 'top' : side === 'block-end' ? 'bottom' : side === 'inline-start' ? rtl ? 'right' : 'left' : rtl ? 'left' : 'right'; // Floating UI mirrors start/end alignment itself for right-to-left elements.

  return align === 'center' ? physical : `${physical}-${align}`;
}
/** Maps a Floating UI placement back to the logical side. */

function logicalSide(placement, rtl = false) {
  const physical = String(placement).split('-')[0];
  if (physical === 'top') return 'block-start';
  if (physical === 'bottom') return 'block-end';
  if (physical === 'left') return rtl ? 'inline-end' : 'inline-start';
  return rtl ? 'inline-start' : 'inline-end';
}

/***/ },

/***/ "2e9112dbdda9"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   anchor: () => (/* binding */ anchor),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   resolveLength: () => (/* binding */ resolveLength)
/* harmony export */ });
/* harmony import */ var _floating_ui_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("6d338aa773af");
/* harmony import */ var _position_placement_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("14baf2d02711");
// One anchored-positioning contract for Framework floating surfaces (dropdown
// lists, date panels, menus, tooltips). Geometry comes from Floating UI; this
// module adds logical placements, Framework token lengths and the author's
// size caps, so every component opens, flips and shifts the same way.



function isRtl(element) {
  return getComputedStyle(element).direction === 'rtl';
}
/** Resolves a number or CSS length (tokens included) to pixels in context. */


function resolveLength(value, context = document.body) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  if (typeof value !== 'string' || value.trim() === '') return 0;
  const probe = document.createElement('span');
  probe.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none;block-size:0;padding:0;border:0';
  probe.style.inlineSize = value;
  (context?.isConnected ? context : document.body).append(probe);
  const pixels = parseFloat(getComputedStyle(probe).width) || 0;
  probe.remove();
  return pixels;
}
/**
 * Keeps `floating` anchored to `reference`.
 * options: {side, align, offset, alignmentOffset, padding, flip, shift,
 *           matchWidth, fitHeight, autoUpdate, onPosition({side, placement, x, y})}
 * Returns {update(): Promise, stop(), side}.
 */

function anchor(reference, floating, options = {}) {
  if (!(reference instanceof Element) || !(floating instanceof HTMLElement)) {
    throw new TypeError('Anchored positioning needs a reference element and a floating element');
  }

  const settings = {
    side: 'block-end',
    align: 'start',
    offset: 'var(--sf-space-1\\/4)',
    alignmentOffset: 0,
    padding: 'var(--sf-space-1\\/2)',
    flip: true,
    shift: true,
    matchWidth: false,
    fitHeight: true,
    autoUpdate: true,
    onPosition: null,
    ...options
  }; // Inline styles this helper writes are restored on stop(); the author's caps
  // are kept, so viewport fitting may only tighten them.

  const written = ['position', 'left', 'top', 'right', 'bottom', 'margin', 'max-height', 'max-width', ...(settings.matchWidth ? ['width'] : [])];
  const saved = written.map(name => [name, floating.style.getPropertyValue(name), floating.style.getPropertyPriority(name)]);
  const authored = {
    maxHeight: floating.style.getPropertyValue('max-height')
  }; // Stylesheet caps (max-height, max-width) are read before this helper writes
  // inline values, so fitting the viewport never loosens them.

  const floatingStyle = getComputedStyle(floating);
  const computedCap = parseFloat(floatingStyle.maxHeight);
  const heightCap = Number.isFinite(computedCap) ? computedCap : Infinity;
  const computedWidthCap = parseFloat(floatingStyle.maxWidth);
  const widthCap = Number.isFinite(computedWidthCap) ? computedWidthCap : Infinity;
  const controller = {
    side: settings.side,
    stopped: false
  };
  let running = null;
  let pending = false;

  const run = async () => {
    const rtl = isRtl(reference);
    const gap = resolveLength(settings.offset, reference.parentElement);
    const padding = resolveLength(settings.padding, reference.parentElement); // Measure the natural size so flipping compares the real panel height.

    if (settings.fitHeight) floating.style.maxHeight = authored.maxHeight || ''; // alignmentOffset moves a start/end-aligned panel along its edge (mirrored
    // for end), e.g. so a tail points at the middle of a small trigger.
    // The panel keeps its distance from the viewport's inline edges, but never
    // more than its field keeps. With a flat padding a field closer to the edge
    // than the padding -- every field in a documentation example, which starts
    // at the frame's edge -- had its panel pushed inward by the difference and
    // hanging past the field on the other side. The edge a field reaches is an
    // edge its own panel may reach too.

    const box = reference.getBoundingClientRect();
    const clientWidth = document.documentElement.clientWidth;
    const edges = {
      top: padding,
      bottom: padding,
      left: Math.min(padding, Math.max(0, box.left)),
      right: Math.min(padding, Math.max(0, clientWidth - box.right))
    };
    const middleware = [(0,_floating_ui_dom__WEBPACK_IMPORTED_MODULE_0__.offset)({
      mainAxis: gap,
      alignmentAxis: resolveLength(settings.alignmentOffset, reference.parentElement)
    })];
    if (settings.flip) middleware.push((0,_floating_ui_dom__WEBPACK_IMPORTED_MODULE_0__.flip)({
      padding,
      crossAxis: false
    })); // Shift before size: a panel near the inline edge moves inside the viewport
    // instead of being squeezed to the space left of its field.

    if (settings.shift) middleware.push((0,_floating_ui_dom__WEBPACK_IMPORTED_MODULE_0__.shift)({
      padding: edges,
      crossAxis: false
    }));
    middleware.push((0,_floating_ui_dom__WEBPACK_IMPORTED_MODULE_0__.size)({
      padding: edges,

      apply({
        availableWidth,
        availableHeight,
        rects,
        elements
      }) {
        if (controller.stopped) return;
        const viewportWidth = clientWidth - edges.left - edges.right;
        if (settings.matchWidth) elements.floating.style.width = `${Math.max(0, Math.min(rects.reference.width, viewportWidth))}px`;
        elements.floating.style.maxWidth = `${Math.max(0, Math.min(availableWidth, viewportWidth, widthCap))}px`;
        if (settings.fitHeight) elements.floating.style.maxHeight = `${Math.max(0, Math.min(availableHeight, heightCap))}px`;
      }

    }));
    const result = await (0,_floating_ui_dom__WEBPACK_IMPORTED_MODULE_0__.computePosition)(reference, floating, {
      strategy: 'fixed',
      placement: (0,_position_placement_js__WEBPACK_IMPORTED_MODULE_1__.physicalPlacement)(settings.side, settings.align, rtl),
      middleware
    });
    if (controller.stopped) return result; // right/bottom are cleared so logical insets from the component stylesheet
    // (for example inset-inline-start in RTL) cannot over-constrain the box.

    Object.assign(floating.style, {
      position: 'fixed',
      left: `${result.x}px`,
      top: `${result.y}px`,
      right: 'auto',
      bottom: 'auto',
      margin: '0'
    });
    controller.side = (0,_position_placement_js__WEBPACK_IMPORTED_MODULE_1__.logicalSide)(result.placement, rtl);
    floating.dataset.sfSide = controller.side;
    settings.onPosition?.({
      side: controller.side,
      placement: result.placement,
      x: result.x,
      y: result.y
    });
    return result;
  }; // Coalesce bursts (scroll, resize, observers) into one computation at a time.


  controller.update = () => {
    if (controller.stopped) return Promise.resolve(null);

    if (running) {
      pending = true;
      return running;
    }

    running = run().finally(() => {
      running = null;

      if (pending && !controller.stopped) {
        pending = false;
        controller.update();
      }
    });
    return running;
  };

  const cleanup = settings.autoUpdate ? (0,_floating_ui_dom__WEBPACK_IMPORTED_MODULE_0__.autoUpdate)(reference, floating, controller.update) : null;

  controller.stop = () => {
    controller.stopped = true;
    cleanup?.();
    delete floating.dataset.sfSide;

    for (const [name, value, priority] of saved) {
      if (value) floating.style.setProperty(name, value, priority);else floating.style.removeProperty(name);
    }
  };

  if (!settings.autoUpdate) controller.update();
  return controller;
}
const Position = Object.freeze({
  anchor,
  logicalSide: _position_placement_js__WEBPACK_IMPORTED_MODULE_1__.logicalSide,
  physicalPlacement: _position_placement_js__WEBPACK_IMPORTED_MODULE_1__.physicalPlacement,
  resolveLength
}); // Core publishes the helper; component bundles that carry their own copy reuse
// an already published one instead of replacing it.

if (typeof globalThis !== 'undefined') {
  globalThis.SF = globalThis.SF || {};
  if (!globalThis.SF.Position) globalThis.SF.Position = Position;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Position);

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

/***/ "926043d18700"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   debounce: () => (/* binding */ debounce),
/* harmony export */   getElementRowGap: () => (/* binding */ getElementRowGap),
/* harmony export */   getParent: () => (/* binding */ getParent),
/* harmony export */   setParentSpace: () => (/* binding */ setParentSpace)
/* harmony export */ });
function getElementRowGap(element) {
  return parseFloat(getComputedStyle(element).rowGap) || 0;
}
function setParentSpace(items) {
  const firstRef = items.values().next().value;
  const firstValue = firstRef?.value;
  if (!firstValue) return;
  const parent = firstValue.parentNode;
  if (!parent) return;
  return {
    gap: getElementRowGap(parent),
    item: firstValue,
    parent: parent
  };
}
function debounce(func, wait, immediate) {
  let timeout;
  return function () {
    const context = this,
          args = arguments;

    const later = () => {
      timeout = null;

      if (!immediate) {
        func.apply(context, args);
      }
    };

    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (callNow) {
      func.apply(context, args);
    }
  };
}
function getParent(item) {
  let current = item;

  while (current) {
    if (current.nodeName.toLowerCase().startsWith('sf-')) {
      return current.parentNode;
    }

    current = current.parentNode;
  }

  return null;
}

/***/ },

/***/ "2d094259808e"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bindSortableDrag: () => (/* binding */ bindSortableDrag),
/* harmony export */   getVerticalDragAfterElement: () => (/* binding */ getVerticalDragAfterElement),
/* harmony export */   getVerticalDragItemsLayout: () => (/* binding */ getVerticalDragItemsLayout)
/* harmony export */ });
/* harmony import */ var _loaderDragState__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("870b5dfddc25");

function getVerticalDragItemsLayout(container, options = {}) {
  const accept = typeof options.accept === "function" ? options.accept : () => true;
  return Array.from(container?.children || []).filter(item => item instanceof HTMLElement && !item.classList.contains("is-dragging") && !item.classList.contains("drag-placeholder") && accept(item)).map(item => {
    const box = item.getBoundingClientRect();
    return {
      item,
      top: box.top,
      height: box.height,
      middle: box.top + box.height / 2
    };
  });
}
function getVerticalDragAfterElement(container, y, options = {}) {
  const itemsLayout = Array.isArray(options.itemsLayout) ? options.itemsLayout : getVerticalDragItemsLayout(container, options);
  let closest = {
    offset: Number.NEGATIVE_INFINITY,
    element: null
  };

  for (const layout of itemsLayout) {
    const offset = y - layout.middle;

    if (offset < 0 && offset > closest.offset) {
      closest = {
        offset,
        element: layout.item
      };
    }
  }

  return closest.element;
}
function bindSortableDrag(options = {}) {
  const {
    handle,
    item,
    container,
    holdDelay = 0,
    boundAttr = "data-sf-sortable-drag-bound",
    draggingClass = "is-dragging",
    placeholderClass = "drag-placeholder",
    placeholderExtraClasses = [],
    shouldIgnorePointerDown,
    getAfterElement,
    getSortableItems,
    insertPlaceholder,
    onDragStart,
    onDrop,
    onCancel,
    dragContainer,
    minSortableItems = 2
  } = options;
  if (!handle || !item || !container) return null;
  if (handle.getAttribute(boundAttr) === "1") return null;
  handle.setAttribute(boundAttr, "1");
  let isDragging = false;
  let holdTimer = null;
  let suppressClick = false;
  let shiftX = 0;
  let shiftY = 0;
  let startRect = null;
  let containerRect = null;
  let itemsLayout = [];
  let lastAfterElement = undefined;
  let placeholder = null;
  let originalParent = null;
  let originalNextSibling = null;

  const clearHoldTimer = () => {
    if (!holdTimer) return;
    clearTimeout(holdTimer);
    holdTimer = null;
  };

  const getCurrentSortableItems = () => {
    if (typeof getSortableItems === "function") {
      const items = getSortableItems(container, item);
      return Array.isArray(items) ? items : Array.from(items || []);
    }

    return getVerticalDragItemsLayout(container, {
      accept: typeof getAfterElement === "function" ? () => true : undefined
    }).map(layout => layout.item);
  };

  const resetItemStyle = () => {
    Object.assign(item.style, {
      position: "",
      left: "",
      top: "",
      width: "",
      zIndex: "",
      pointerEvents: "",
      boxSizing: "",
      backgroundColor: ""
    });
  };

  const movePlaceholder = event => {
    const afterElement = typeof getAfterElement === "function" ? getAfterElement(container, event.clientY, event, itemsLayout) : getVerticalDragAfterElement(container, event.clientY, {
      itemsLayout
    });

    if (afterElement === lastAfterElement) {
      return;
    }

    lastAfterElement = afterElement;

    if (typeof insertPlaceholder === "function") {
      insertPlaceholder(container, placeholder, afterElement, event);
      return;
    }

    if (!afterElement) {
      if (placeholder.parentNode === container && !placeholder.nextSibling) {
        return;
      }

      container.appendChild(placeholder);
    } else {
      if (placeholder.nextSibling === afterElement) {
        return;
      }

      container.insertBefore(placeholder, afterElement);
    }
  };

  const startDrag = event => {
    if (isDragging) return;
    event.preventDefault?.();

    if (Number(minSortableItems) > 1) {
      const sortableItems = getCurrentSortableItems().filter(sortableItem => sortableItem instanceof HTMLElement && !sortableItem.classList.contains(draggingClass) && !sortableItem.classList.contains(placeholderClass));

      if (sortableItems.length < Number(minSortableItems)) {
        return;
      }
    }

    isDragging = true;
    suppressClick = true;
    (0,_loaderDragState__WEBPACK_IMPORTED_MODULE_0__.setLoaderDragState)(true);
    startRect = item.getBoundingClientRect();
    containerRect = container.getBoundingClientRect();
    shiftX = event.clientX - startRect.left;
    shiftY = event.clientY - startRect.top;
    placeholder = document.createElement(item.nodeName.toLowerCase());
    placeholder.className = placeholderClass;
    placeholder.style.width = `${startRect.width}px`;
    placeholder.style.minHeight = `${startRect.height}px`;
    placeholder.classList.add(...placeholderExtraClasses, ...item.classList);
    originalParent = item.parentNode;
    originalNextSibling = item.nextSibling;
    item.before(placeholder);
    (dragContainer || document.body).appendChild(item);
    item.classList.add(draggingClass);
    const styles = {
      position: "fixed",
      left: `${startRect.left}px`,
      top: `${startRect.top}px`,
      width: `${startRect.width}px`,
      zIndex: "9999",
      pointerEvents: "none",
      boxSizing: "border-box"
    };

    if (!item.style.backgroundColor) {
      styles.backgroundColor = 'var(--sf-primary-container)';
    }

    Object.assign(item.style, styles);
    itemsLayout = getVerticalDragItemsLayout(container, {
      accept: typeof getAfterElement === "function" ? () => true : undefined
    });
    lastAfterElement = undefined;
    handle.setPointerCapture?.(event.pointerId);
    onDragStart?.({
      event,
      item,
      container,
      placeholder
    });
    document.addEventListener("pointermove", onPointerMove);
  };

  const onPointerMove = event => {
    if (!isDragging) {
      return;
    }

    let left = event.clientX - shiftX;
    let top = event.clientY - shiftY;
    left = Math.max(containerRect.left, left);
    top = Math.max(containerRect.top, top);
    left = Math.min(containerRect.right - startRect.width, left);
    top = Math.min(containerRect.bottom - startRect.height, top);
    item.style.left = `${left}px`;
    item.style.top = `${top}px`;
    movePlaceholder(event);
  };

  const onPointerUp = event => {
    clearHoldTimer();
    document.removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("pointercancel", onPointerCancel);

    if (!isDragging) {
      return;
    }

    isDragging = false;
    (0,_loaderDragState__WEBPACK_IMPORTED_MODULE_0__.setLoaderDragState)(false);
    handle.releasePointerCapture?.(event.pointerId);

    if (placeholder?.parentNode) {
      placeholder.replaceWith(item);
    }

    item.classList.remove(draggingClass);
    resetItemStyle();
    const dropPlaceholder = placeholder;
    placeholder = null;
    startRect = null;
    containerRect = null;
    itemsLayout = [];
    lastAfterElement = undefined;
    originalParent = null;
    originalNextSibling = null;
    onDrop?.({
      event,
      item,
      container,
      placeholder: dropPlaceholder
    });
  };

  const onPointerCancel = () => {
    clearHoldTimer();
    document.removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("pointerup", onPointerUp);

    if (!isDragging) {
      return;
    }

    isDragging = false;
    (0,_loaderDragState__WEBPACK_IMPORTED_MODULE_0__.setLoaderDragState)(false);

    if (originalParent) {
      originalParent.insertBefore(item, originalNextSibling);
    }

    placeholder?.remove();
    item.classList.remove(draggingClass);
    resetItemStyle();
    const cancelPlaceholder = placeholder;
    placeholder = null;
    startRect = null;
    containerRect = null;
    itemsLayout = [];
    lastAfterElement = undefined;
    originalParent = null;
    originalNextSibling = null;
    onCancel?.({
      item,
      container,
      placeholder: cancelPlaceholder
    });
  };

  const onPointerDown = event => {
    if (event.button !== 0) return;
    if (shouldIgnorePointerDown?.(event)) return;
    clearHoldTimer();

    if (holdDelay > 0) {
      holdTimer = setTimeout(() => {
        holdTimer = null;
        startDrag(event);
      }, holdDelay);
    } else {
      startDrag(event);
    }

    document.addEventListener("pointerup", onPointerUp, {
      once: true
    });
    document.addEventListener("pointercancel", onPointerCancel, {
      once: true
    });
  };

  const onClick = event => {
    if (!suppressClick) return;
    suppressClick = false;
    event.preventDefault();
    event.stopImmediatePropagation();
  };

  handle.addEventListener("pointerdown", onPointerDown);
  handle.addEventListener("click", onClick, true);
  return () => {
    clearHoldTimer();
    document.removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("pointerup", onPointerUp);
    document.removeEventListener("pointercancel", onPointerCancel);
    handle.removeEventListener("pointerdown", onPointerDown);
    handle.removeEventListener("click", onClick, true);
    handle.removeAttribute(boundAttr);
    (0,_loaderDragState__WEBPACK_IMPORTED_MODULE_0__.setLoaderDragState)(false);
  };
}

/***/ },

/***/ "870b5dfddc25"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   setLoaderDragState: () => (/* binding */ setLoaderDragState)
/* harmony export */ });
function setLoaderDragState(value) {
  if (typeof SF === "undefined" || !SF.Loader) return;
  const loader = SF.Loader;
  const currentCount = Number(loader.dragObserverLockCount || 0);
  loader.dragObserverLockCount = value ? currentCount + 1 : Math.max(currentCount - 1, 0);
  loader.stopObserver = loader.dragObserverLockCount > 0;
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

/***/ "b53fd744fdaf"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderTableTemplate: () => (/* binding */ renderTableTemplate),
/* harmony export */   resolvedDataState: () => (/* binding */ resolvedDataState)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("fef8077ac919");
/* harmony import */ var lit_directives_keyed_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("707122d76f9d");
/* harmony import */ var lit_directives_ref_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("7fcbcc00731e");
/* harmony import */ var lit_directive_helpers_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("23fcd3fd7fc2");
/* harmony import */ var _default_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("7d99d770602e");
/* harmony import */ var _link_cell_contract_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("a17b6611091c");







function getEventInputValue(event, fallback = '') {
  const pathTarget = event?.composedPath?.()?.[0];
  const candidates = [pathTarget, event?.target, event?.currentTarget];

  for (const candidate of candidates) {
    if (!candidate) continue;

    if (typeof candidate.value !== 'undefined') {
      return candidate.value;
    }

    const input = candidate.querySelector?.('input, textarea');

    if (input && typeof input.value !== 'undefined') {
      return input.value;
    }
  }

  return fallback;
}

function renderToolbar(context) {
  const {
    state
  } = context.component;
  const {
    value
  } = state.search;
  const filterTags = context.component.getCurrentFilterTags();
  const filterValues = context.component.getCurrentFilterValues();
  const hasUnsavedFilterDataChanges = context.component.hasUnsavedFilterDataChanges();
  const activeFilterTags = Object.entries(filterTags || {}).filter(([, tag]) => tag?.active !== false);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div
                class="sf-table-toolbar flex gap-1/2 content-main-between flex-none"
                data-sf-filter-tags="${activeFilterTags.length ? '1' : '0'}"
        >
            <div class="sf-table-toolbar-start flex items-cross-center gap-1/3 flex-wrap min-w-0">
                <div class="flex items-cross-center">
                    <sf-button
                            size="1"
                            type="default"
                            scheme="primary"
                            text=${context.filterText}
                            segment="start"
                            icon-left="filter_list"
                            @click=${e => {
    context.component.openContextMenu(e, {
      type: 'bottom',
      menu: 'filter-settings'
    });
  }}
                    ></sf-button>
                    <sf-icon-button
                            size="1"
                            type="default"
                            scheme="primary"
                            aria-label="Сохранить шаблон фильтра"
                            ?disabled=${!activeFilterTags.length}
                            segment="end"
                            icon="bookmark_add"
                            @click=${e => {
    context.component.openContextMenu(e, {
      type: 'bottom',
      menu: 'filter-favorites',
      parent: true
    });
  }}
                    ></sf-icon-button>
                </div>
                ${activeFilterTags.map(([k, tag]) => {
    const filterValue = filterValues?.[k] || {};
    const hasFilteredValues = Object.prototype.hasOwnProperty.call(filterValues || {}, k);
    const count = Array.isArray(filterValue.values) ? filterValue.values.length : tag.count || '';
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                        <div class="sf-table-tags">
                            <sf-tag
                                    type="default"
                                    size="1"
                                    text='${tag.label}'
                                    interactive
                                    closable
                                    :key=${k}
                                    root-class="${hasFilteredValues ? 'active' : ''}"
                                    @close="${() => {
      context.component.removeFilterTag(k);
    }}"
                                    @click=${e => {
      context.component.openContextMenu(e, {
        type: 'bottom',
        menu: 'tag-settings',
        fieldKey: k,
        anchorSelector: '.sf-tag'
      });
    }}
                                    count='${count}'
                            ></sf-tag>
                        </div>`;
  })}
                ${activeFilterTags.length || hasUnsavedFilterDataChanges ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                    ${hasUnsavedFilterDataChanges ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                        <sf-button
                                size="1"
                                type="default"
                                scheme="primary"
                                text="Сохранить"
                                @click="${() => context.component.saveCurrentFilterTemplateData()}"
                        ></sf-button>
                    ` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    ${activeFilterTags.length ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                        <sf-button
                                size="1"
                                type="outline"
                                scheme="on-surface"
                                text=${context.clearText}
                                @click="${() => context.component.removeFilterTag()}"
                        ></sf-button>
                    ` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            </div>

            <div class="sf-table-toolbar-end flex items-cross-center gap-1/3 flex-wrap flex-auto min-w-0">
                <sf-input
                        size="1"
                        root-class="sf-search-input m-inline-start-auto"
                        type="bordered"
                        value="${value}"
                        placeholder=${context.searchPlaceholder}
                        name="sf_table_search"
                        @input=${e => {
    context.component.searchChange({
      value: getEventInputValue(e, value)
    });
  }}
                        @keydown=${e => {
    context.component.handleSearchKeyDown(e);
  }}
                        @keyup=${e => {
    context.component.handleSearchKeyUp(e);
  }}
                        hint-icon="search"
                >
          <span slot="right">
                <sf-icon-button
                        size="1"
                        type="link"
                        scheme="on-surface"
                        icon=${value.length ? 'close' : 'search'}
                        aria-label=${value.length ? 'Очистить поиск' : 'Поиск'}
                        @click=${e => {
    e.preventDefault();
    e.stopPropagation();
    if (!value.length) return false;
    context.component.updateSearchState({
      value: ''
    });
  }}
                ></sf-icon-button>

          </span>
                </sf-input>

                ${context.actions ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                            <div class="flex items-cross-center">
                                <sf-button
                                        size="1"
                                        type="outline"
                                        scheme="on-surface"
                                        text=${context.createText}
                                        segment=${state.createItems?.length ? 'start' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                                        @click=${() => context.component.requestCreateIntent(null)}
                                ></sf-button>
                                ${state.createItems?.length ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                                    <sf-icon-button
                                            size="1"
                                            type="outline"
                                            scheme="primary"
                                            segment="end"
                                            icon="keyboard_arrow_down"
                                            aria-label="Дополнительные действия создания"
                                            aria-haspopup="menu"
                                            @click=${e => {
    context.component.openContextMenu(e, {
      type: 'bottom',
      menu: 'create'
    });
  }}
                                    ></sf-icon-button>
                                ` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                            </div>
                        ` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}

                <!-- The extra actions of the view, from the host. Column
                     settings are not here: they are the gear in the table's own
                     head, where they have always been. Without actions there is
                     no control, because an empty menu is a dead end. -->
                ${context.settings && state.toolbarActions?.length ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                            <sf-icon-button
                                    size="1"
                                    type="outline"
                                    scheme="primary"
                                    icon="more_vert"
                                    aria-label="Действия с представлением"
                                    aria-haspopup="menu"
                                    @click=${e => {
    context.component.openContextMenu(e, {
      menu: 'toolbar-actions'
    });
  }}
                            ></sf-icon-button>
                        ` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            </div>
        </div>
    `;
} // The state the region is actually in: the author's data-state, or what the
// rows resolve to. It is declared on the region, not guessed from the markup.


function resolvedDataState(context) {
  if (context.dataState !== 'auto') return context.dataState;
  return (context.component?.getTableData?.().rows || []).length ? 'populated' : 'empty';
}

function renderHeadLabel(context, column) {
  const content = column.component ? context.component.renderSmartElement(column.component.type, column.component.props) : column.label;

  if (column.sortable !== true || column.system) {
    return content;
  }

  const sort = context.component.state.sort || {};
  const direction = sort.key === column.key ? sort.direction : null;
  const icon = direction === 'asc' ? 'arrow_upward' : direction === 'desc' ? 'arrow_downward' : 'unfold_more';
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <button type="button" class="sf-table-sort-button flex items-cross-center gap-1/4 min-w-0"
                data-direction=${direction || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
            <span class="truncate">${content}</span>
            <i class="sf-icon sf-table-sort-icon" aria-hidden="true">${icon}</i>
        </button>
    `;
}

function ariaSort(context, column) {
  if (column.sortable !== true || column.system) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const sort = context.component.state.sort || {};
  if (sort.key !== column.key) return 'none';
  return sort.direction === 'asc' ? 'ascending' : 'descending';
}

function renderHead(context) {
  if (context.component?.hasSlotContent?.("head")) {
    return context.component.getSlotContent("head");
  }

  const columns = context.component?.getColumns?.() || [];
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <thead class="sticky top-0 z-5">
        <tr>
            ${columns.map((column, k) => {
    return (0,lit_directives_keyed_js__WEBPACK_IMPORTED_MODULE_1__.keyed)(`head:${column.key}`, (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                            <th
                                    class="relative"
                                    data-key="${column.key}"
                                    data-label="${column.label || column.key || ''}"
                                    data-sf-pinned=${context.component.isPinnedColumn(column) ? '' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                                    style=${context.component.getStickyCellStyle(columns, k) || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                                    aria-sort=${ariaSort(context, column)}
                                    @click=${column.sortable === true ? event => context.component.handleHeaderSortClick(event, column) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                            >
                                ${column.system || k === columns.length - 1 ? renderHeadLabel(context, column) : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div
                                        class="sidebar-resizer flex items-cross-center h-full select-none"
                                >
                                    ${renderHeadLabel(context, column)}
                                    <!-- The width is taken by the line between
                                         two headers. There is no handle to find
                                         first: this is the line's own hit strip,
                                         invisible, astride the separator, and
                                         still a button, so the keyboard keeps
                                         the name and the arrows it had. -->
                                    <button type="button"
                                            class="sf-table-column-resizer"
                                            id=${context.component.getColumnResizerId(column.key)}
                                            data-sf-column-resizer=${column.key}
                                            aria-label="Изменить ширину столбца: ${column.label || column.key}"
                                            aria-keyshortcuts="ArrowLeft ArrowRight"
                                            @keydown=${event => context.component.resizeColumnByKeyboard(event, column.key)}
                                    ></button>
                                </div>`}
                            </th>`);
  })}
        </tr>
        </thead>
    `;
}

function toColumnSize(value) {
  if (value === null || typeof value === "undefined" || value === "") {
    return "";
  }

  return typeof value === "number" ? `${value}px` : String(value);
} // How narrow a data column may become before it stops being readable.
//
// A fixed-layout table divides whatever room it has between its columns and
// will divide it to nothing: at 620px with five columns they came out 61px
// each, which shreds «Код решения» over three lines and cannot hold a date at
// all. The consumer asked for a floor and for the table to scroll instead
// (Larena, 2026-10-06; measured on the admin reference, 2026-10-09).
//
// It is the table's own min-width rather than the columns', because
// `table-layout: fixed` ignores a minimum on a cell -- the widths come from
// the first row. So the floor is summed here and the table carries the total;
// the scroll box around it already scrolls, and starts doing so the moment the
// sum does not fit.
//
// System columns are not in it: select, settings and actions are sized for what
// they hold and are not text anyone reads.


const SYSTEM_COLUMNS = new Set(['select', 'settings', 'actions']); // The floor is the component's measurement, not a declaration here: it is
// applied to a column only while there is not room for every column to be
// readable. Written always it would be the width rather than a minimum -- a
// cell that needs more would wrap and a typed row would grow, measured at 81px
// against 57 (owner, 2026-10-09).

function renderColgroup(context) {
  const columns = context.component?.getColumns?.() || [];

  if (!columns.length) {
    return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  }

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <colgroup>
            ${columns.map(column => {
    // In a fixed layout the column widths come from here, and a
    // column with none is given whatever is left -- divided to
    // nothing when there is little. The floor is written as the
    // width: fixed layout shares any surplus between the columns
    // that have one, so they grow together above it and stop
    // shrinking below it, and the scroll box takes over.
    // `||` and not `??`: toColumnSize answers with an empty string
    // for a column nobody sized, and an empty string is neither
    // null nor undefined. The same shape cost sf-button its icon
    // shortcut for as long as that component existed.
    const width = toColumnSize(column.colWidth ?? column.width ?? column.size) || (context.component?.columnsAreCramped && context.component?.columnTakesFloor?.(column) ? 'var(--sf-table--column-min-inline-size)' : '');
    const minWidth = toColumnSize(column.min_width ?? column.minWidth);
    const maxWidth = toColumnSize(column.maxWidth);
    const style = [width ? `width: ${width}` : "", minWidth ? `min-width: ${minWidth}` : "", maxWidth ? `max-width: ${maxWidth}` : ""].filter(Boolean).join("; ");
    return (0,lit_directives_keyed_js__WEBPACK_IMPORTED_MODULE_1__.keyed)(`col:${column.key}`, (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                    <col
                            data-key=${column.key || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                            style=${style || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    />
                `);
  })}
        </colgroup>
    `;
}

function renderComponent(component, owner) {
  if (!component?.type) {
    return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  }

  const props = { ...(component.props || {})
  };
  return owner.renderSmartElement(component.type, props);
}

function renderCellItem(item, owner) {
  if (item === null || typeof item === "undefined") {
    return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  } // What the shared renderer set answers with is markup, not a descriptor.
  // Nine of its eleven cell renderers happen to answer with a descriptor --
  // a badge, a tag, an avatar, a reference link -- and the two that answer
  // with markup, the colour and the included block, fell through the object
  // branch below and were dropped: every colour cell and every code cell in
  // every table drew nothing at all. A unit calling the renderer saw correct
  // markup, so only a table could show it (admin polygon, 2026-10-10).


  if ((0,lit_directive_helpers_js__WEBPACK_IMPORTED_MODULE_3__.isTemplateResult)(item)) {
    return item;
  }

  if (typeof item === "object") {
    const {
      component,
      props: itemProps,
      ...itemMeta
    } = item;

    if (!component?.type) {
      return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
    }

    return renderComponent({ ...component,
      props: { ...itemMeta,
        ...(itemProps || {}),
        ...(component.props || {})
      }
    }, owner);
  }

  return item;
}

function renderLinkCell(value) {
  const cell = (0,_link_cell_contract_js__WEBPACK_IMPORTED_MODULE_5__.normalizeTableLinkCell)(value);

  if (!cell) {
    return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  }

  const content = (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <span class="sf-table-link-cell-content flex flex-col min-w-0">
            <span class="sf-table-link-cell-text">${cell.text}</span>
            ${cell.subtext === null ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                <span class="sf-table-link-cell-subtext sf-text-1/2">${cell.subtext}</span>
            `}
        </span>
    `;
  return cell.href ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<a class="sf-table-link-cell" href=${cell.href}>${content}</a>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-table-link-cell">${content}</span>`;
}

function renderTableTemplate(context) {
  const {
    state
  } = context.component;

  function renderBody() {
    if (context.component?.hasSlotContent?.("body")) {
      return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                <tbody>
                ${context.component.getSlotContent("body")}
                </tbody>`;
    }

    const {
      state
    } = context.component;
    const columns = context.component?.getColumns?.() || [];
    const {
      rows = []
    } = state.data || {};
    const dataState = resolvedDataState(context); // A re-query over rows that are already on screen leaves them there,
    // dimmed, with one small spinner in the middle of what the person can
    // see. Replacing them with a loader — which is what happened before —
    // threw away the place they were reading and moved the answer to the top
    // left corner of an empty table.

    if (dataState === 'loading' && rows.length) {
      return renderRows(context, columns, rows, {
        busy: true
      });
    }

    if (dataState !== 'populated') {
      const stateContent = {
        // One indicator, the same one a re-query shows, centred in the
        // body rather than lined up at its start. The spinner paints its
        // own `label` as text and defaults it to "Loading...", so it is
        // given an empty one: the words are for a reader, in the
        // language the host set, and the circle is for everyone else.
        // Before this there were two indicators here, one of them in
        // English on a Russian page.
        loading: (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                    <div class="sf-table-state-busy flex items-cross-center content-main-center" role="status">
                        <sf-spinner size="1" label="" aria-label=${context.loadingText}></sf-spinner>
                    </div>
                `,
        error: (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                    <div class="flex flex-col items-cross-start gap-1/2" role="alert">
                        <span>${context.errorText}</span>
                        <sf-button
                                type="outline"
                                scheme="on-surface"
                                size="1"
                                text=${context.retryText}
                                @click=${() => context.component.requestRetry()}
                        ></sf-button>
                    </div>
                `,
        empty: (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span>${context.emptyText}</span>`
      }[dataState] || (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span>${context.emptyText}</span>`;
      return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                <tbody data-state=${dataState}>
                    <tr>
                        <td colspan=${String(Math.max(columns.length, 1))}>
                            <div class="sf-table-state p-2">${stateContent}</div>
                        </td>
                    </tr>
                </tbody>
            `;
    }

    return renderRows(context, columns, rows);
  }

  function renderRows(context, columns, rows, {
    busy = false
  } = {}) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
            <tbody data-busy=${busy ? '' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
            ${rows.map((row, rowIndex) => (0,lit_directives_keyed_js__WEBPACK_IMPORTED_MODULE_1__.keyed)(`row:${row.id ?? row.value ?? rowIndex}`, (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                <tr data-selected=${row.select?.component?.props?.checked === true ? '' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    data-row-id=${context.component.getRowKey(row, rowIndex)}
                    data-current=${context.component.isCurrentRow(row, rowIndex) ? '' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    tabindex="-1"
                    @mousedown=${event => context.component.handleRowPointerDown(event)}
                    @click=${event => context.component.handleRowClick(event, row, rowIndex)}
                    @dblclick=${event => context.component.handleRowOpen(event, row)}
                    @keydown=${event => context.component.handleRowKeydown(event, row)}>
                    ${columns.map((column, index) => (0,lit_directives_keyed_js__WEBPACK_IMPORTED_MODULE_1__.keyed)(`cell:${context.component.getRowKey(row, rowIndex)}:${column.key}`, (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                        <td data-key="${column.key}" data-item="${row.id}_${column.key}"
                            data-sf-pinned=${context.component.isPinnedColumn(column) ? '' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                            style=${context.component.getStickyCellStyle(columns, index) || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>${renderCellValue(row, column)}</td>
                    `))}
                </tr>
            `))}
            </tbody>`;
  }

  function renderCellValue(row, column) {
    if (!column || !row) {
      return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
    }

    let value = row[column.key];

    if (column.renderer === "link") {
      return renderLinkCell(value);
    } // `row.actions` is read here in two vocabularies. From a host it is ids
    // -- `["view"]`, the data view port's word for which of the list's
    // actions apply to this record -- and from a consumer that builds its
    // own controls it is the items themselves. Ids select from the table's
    // list; items are the list.
    //
    // Both went through the second branch before, so an array of ids was
    // handed to the filter AS the action list, where `action.id` is
    // undefined for a string: everything was filtered out and the
    // «Действия» column drew an empty container in every row of every list.
    // A consumer reported it on an embedded one, which is only where they
    // were looking (owner, 2026-10-09).
    // The cell is built from whichever vocabulary the row holds, and built
    // once. From a host `row.actions` is ids -- the data view port's word
    // for which of the list's actions apply to this record -- and after
    // normalizeRow it is the built items.
    //
    // Items are not rebuilt here. Passing them back through the builder
    // made new objects on every render, and a table that hands lit new
    // objects rebuilds the cells rather than keeping them, which costs
    // whatever the cells hold. The round-3 probe measures exactly that.
    // `row.actions` is the host's ids -- the data view port's word for which
    // of the list's actions apply to this record -- or, from a consumer that
    // builds its own controls, the items themselves. Ids select from the
    // list; items are the list. Handing ids to the builder AS the list was
    // the defect: `action.id` is undefined for a string, so everything was
    // filtered out and the «Действия» column drew an empty container in
    // every row of every list (owner, 2026-10-09).
    //
    // The built items are kept on the row, because a render that builds new
    // objects makes lit rebuild the cells rather than keep them, and the
    // cells hold things worth keeping. A re-query brings new row objects,
    // so the cache is fresh exactly when the data is.


    if (column.key === 'actions' && context.component?.getActionRowItems) {
      const built = Array.isArray(value) && value.length && value.every(item => item && typeof item === 'object');
      if (!built) value = context.component.rowActionItems(row);
    }

    if (column.component) {
      if (value !== null && typeof value !== "undefined" && (!Array.isArray(value) || value.length)) {
        return renderCellItem(value, context.component);
      }

      if (column.key === "settings" && (!value || Array.isArray(value) && !value.length)) {
        return renderComponent({
          type: "icon-button",
          props: {
            size: "1",
            type: "link",
            scheme: "on-surface",
            icon: "menu",
            ariaLabel: "Меню",
            value: "menu"
          }
        }, context.component);
      }

      return renderComponent(column.rowComponent || column.component, context.component);
    }

    if (value === null || typeof value === "undefined") {
      return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
    } // The renderer set is asked before the shapes below, because a typed
    // cell's value is often an object -- a user or a related record arrives
    // as {value, label, href} -- and the object branch would render nothing
    // for it: it looks for a component the host put there. A cell that does
    // carry the host's own component still wins, which is the check here.


    const carriesHostComponent = typeof value === "object" && !Array.isArray(value) && Boolean(value.component?.type);

    if (!carriesHostComponent) {
      const typed = context.component?.getTypedCellValue?.(column, value);

      if (typed !== null && typeof typed !== "undefined") {
        if (Array.isArray(typed)) {
          return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                        <div class="flex items-cross-center gap-1/3">
                            ${typed.map(item => renderCellItem(item, context.component))}
                        </div>
                    `;
        }

        return renderCellItem(typed, context.component);
      }
    }

    if (Array.isArray(value)) {
      if (column.key === 'actions') {
        value = value.filter(el => {
          const {
            actions
          } = state;
          const actionId = el.id || el.component?.props?.value;
          const action = actions.find(action => action.id === actionId);
          return action?.visible ?? true;
        });
      }

      return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                <div class="flex items-cross-center gap-1/3">
                    ${value.map(item => renderCellItem(item, context.component))}
                </div>
            `;
    }

    if (typeof value === "object") {
      return renderCellItem(value, context.component);
    }

    return value;
  }

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <section
                class="sf-table min-w-0 flex flex-col gap-1/3 flex-1 min-h-0 ${context.rootClass || ""}"
                style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                aria-label=${context.ariaLabel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                data-sf-instance=${context.component.getInstanceId()}
                data-state=${resolvedDataState(context)}
                aria-busy=${resolvedDataState(context) === 'loading' ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        >
            ${context.toolbar ? renderToolbar(context) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ${context.component.renderBulkActions()}

            <div class="table-wrap min-w-0 max-w-full flex flex-col flex-1 min-h-0">
                <div class="sf-table-scroll min-h-0 min-w-0 overflow-auto flex-1 relative"
                     ${(0,lit_directives_ref_js__WEBPACK_IMPORTED_MODULE_2__.ref)(context.component.refs.scroll)}
                     data-sf-vertical-scroll=${context.verticalScroll}>
                    <div class="sf-table-resize-guide" aria-hidden="true" hidden
                         ${(0,lit_directives_ref_js__WEBPACK_IMPORTED_MODULE_2__.ref)(context.component.refs.resizeGuide)}></div>
                    ${resolvedDataState(context) === 'loading' && (context.component.getTableData()?.rows?.length ?? 0) > 0 ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                            <div class="sf-table-busy" role="status">
                                <sf-spinner size="1" label="" aria-label=${context.loadingText}></sf-spinner>
                            </div>
                        ` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    <table
                            ${(0,lit_directives_ref_js__WEBPACK_IMPORTED_MODULE_2__.ref)(context.component.refs.table)}
                            class="table border-separate border-spacing-0 min-w-full w-max table-fixed transition"
                            aria-label=${context.ariaLabel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    >
                        ${renderColgroup(context)}
                        ${renderHead(context)}
                        ${renderBody(context)}
                    </table>
                </div>

                ${context.pagin ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                            <sf-pagination
                                    current="1"
                                    total=${String(context.paginationTotal)}
                                    bottom="true"
                                    show-action-for-all
                                    page-size=${String(context.paginationPageSize)}
                                    page-sizes=${context.pageSizes}
                                    show-page-size
                                    top-class="content-main-center"
                                    main-class="items-cross-center content-main-between"
                                    bottom-class="items-cross-center gap-2"
                            ></sf-pagination>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            </div>
        </section>
        ${state.contextMenu?.open ? context.component.renderContextMenu(context.state.contextMenu) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        <!-- A demo panel used to stand here, open to nothing, titled after a
             ticket. Closed, it still took a box of its own, and in a card that
             spaces its parts that box became the gap above Show more: three
             spacings instead of one. -->
    `;
}

/***/ },

/***/ "a17b6611091c"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   normalizeTableLinkCell: () => (/* binding */ normalizeTableLinkCell),
/* harmony export */   normalizeTableLinkHref: () => (/* binding */ normalizeTableLinkHref)
/* harmony export */ });
const SAFE_RELATIVE_PREFIXES = ["/", "./", "../", "#", "?"];
function normalizeTableLinkHref(value) {
  if (typeof value !== "string") {
    return null;
  }

  const href = value.trim();

  if (!href) {
    return null;
  }

  if (href.startsWith("//")) {
    return null;
  }

  if (SAFE_RELATIVE_PREFIXES.some(prefix => href.startsWith(prefix))) {
    return href;
  }

  try {
    const url = new URL(href);
    return url.protocol === "http:" || url.protocol === "https:" ? href : null;
  } catch {
    return null;
  }
}
function normalizeTableLinkCell(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const text = value.text === null || typeof value.text === "undefined" ? "" : String(value.text);
  const subtext = value.subtext === null || typeof value.subtext === "undefined" ? null : String(value.subtext);
  return {
    href: normalizeTableLinkHref(value.href),
    subtext,
    text
  };
}

/***/ },

/***/ "7d99d770602e"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "b4b2e395e4eb"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   arrow: () => (/* binding */ arrow),
/* harmony export */   autoPlacement: () => (/* binding */ autoPlacement),
/* harmony export */   computePosition: () => (/* binding */ computePosition),
/* harmony export */   detectOverflow: () => (/* binding */ detectOverflow),
/* harmony export */   flip: () => (/* binding */ flip),
/* harmony export */   hide: () => (/* binding */ hide),
/* harmony export */   inline: () => (/* binding */ inline),
/* harmony export */   limitShift: () => (/* binding */ limitShift),
/* harmony export */   offset: () => (/* binding */ offset),
/* harmony export */   rectToClientRect: () => (/* reexport safe */ _floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.rectToClientRect),
/* harmony export */   shift: () => (/* binding */ shift),
/* harmony export */   size: () => (/* binding */ size)
/* harmony export */ });
/* harmony import */ var _floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("56345afd9e11");



function computeCoordsFromPlacement(_ref, placement, rtl) {
  let {
    reference,
    floating
  } = _ref;
  const sideAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(placement);
  const alignmentAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignmentAxis)(placement);
  const alignLength = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAxisLength)(alignmentAxis);
  const side = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement);
  const isVertical = sideAxis === 'y';
  const commonX = reference.x + reference.width / 2 - floating.width / 2;
  const commonY = reference.y + reference.height / 2 - floating.height / 2;
  const commonAlign = reference[alignLength] / 2 - floating[alignLength] / 2;
  let coords;
  switch (side) {
    case 'top':
      coords = {
        x: commonX,
        y: reference.y - floating.height
      };
      break;
    case 'bottom':
      coords = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;
    case 'right':
      coords = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;
    case 'left':
      coords = {
        x: reference.x - floating.width,
        y: commonY
      };
      break;
    default:
      coords = {
        x: reference.x,
        y: reference.y
      };
  }
  const alignment = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(placement);
  if (alignment) {
    coords[alignmentAxis] += commonAlign * (alignment === 'end' ? 1 : -1) * (rtl && isVertical ? -1 : 1);
  }
  return coords;
}

/**
 * Resolves with an object of overflow side offsets that determine how much the
 * element is overflowing a given clipping boundary on each side.
 * - positive = overflowing the boundary by that number of pixels
 * - negative = how many pixels left before it will overflow
 * - 0 = lies flush with the boundary
 * @see https://floating-ui.com/docs/detectOverflow
 */
async function detectOverflow(state, options) {
  var _await$platform$isEle;
  if (options === void 0) {
    options = {};
  }
  const {
    x,
    y,
    platform,
    rects,
    elements,
    strategy
  } = state;
  const {
    boundary = 'clippingAncestors',
    rootBoundary = 'viewport',
    elementContext = 'floating',
    altBoundary = false,
    padding = 0
  } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);
  const paddingObject = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getPaddingObject)(padding);
  const altContext = elementContext === 'floating' ? 'reference' : 'floating';
  const element = elements[altBoundary ? altContext : elementContext];
  const clippingClientRect = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.rectToClientRect)(await platform.getClippingRect({
    element: ((_await$platform$isEle = await (platform.isElement == null ? void 0 : platform.isElement(element))) != null ? _await$platform$isEle : true) ? element : element.contextElement || (await (platform.getDocumentElement == null ? void 0 : platform.getDocumentElement(elements.floating))),
    boundary,
    rootBoundary,
    strategy
  }));
  const rect = elementContext === 'floating' ? {
    x,
    y,
    width: rects.floating.width,
    height: rects.floating.height
  } : rects.reference;
  const offsetParent = await (platform.getOffsetParent == null ? void 0 : platform.getOffsetParent(elements.floating));
  const offsetScale = (await (platform.isElement == null ? void 0 : platform.isElement(offsetParent))) && (await (platform.getScale == null ? void 0 : platform.getScale(offsetParent))) || {
    x: 1,
    y: 1
  };
  const elementClientRect = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.rectToClientRect)(platform.convertOffsetParentRelativeRectToViewportRelativeRect ? await platform.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements,
    rect,
    offsetParent,
    strategy
  }) : rect);
  return {
    top: (clippingClientRect.top - elementClientRect.top + paddingObject.top) / offsetScale.y,
    bottom: (elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom) / offsetScale.y,
    left: (clippingClientRect.left - elementClientRect.left + paddingObject.left) / offsetScale.x,
    right: (elementClientRect.right - clippingClientRect.right + paddingObject.right) / offsetScale.x
  };
}

// Maximum number of resets that can occur before bailing to avoid infinite reset loops.
const MAX_RESET_COUNT = 50;

/**
 * Computes the `x` and `y` coordinates that will place the floating element
 * next to a given reference element.
 *
 * This export does not have any `platform` interface logic. You will need to
 * write one for the platform you are using Floating UI with.
 */
const computePosition = async (reference, floating, config) => {
  const {
    placement = 'bottom',
    strategy = 'absolute',
    middleware = [],
    platform
  } = config;
  const platformWithDetectOverflow = platform.detectOverflow ? platform : {
    ...platform,
    detectOverflow
  };
  const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(floating));
  let rects = await platform.getElementRects({
    reference,
    floating,
    strategy
  });
  let {
    x,
    y
  } = computeCoordsFromPlacement(rects, placement, rtl);
  let statefulPlacement = placement;
  let resetCount = 0;
  const middlewareData = {};
  for (let i = 0; i < middleware.length; i++) {
    const currentMiddleware = middleware[i];
    if (!currentMiddleware) {
      continue;
    }
    const {
      name,
      fn
    } = currentMiddleware;
    const {
      x: nextX,
      y: nextY,
      data,
      reset
    } = await fn({
      x,
      y,
      initialPlacement: placement,
      placement: statefulPlacement,
      strategy,
      middlewareData,
      rects,
      platform: platformWithDetectOverflow,
      elements: {
        reference,
        floating
      }
    });
    x = nextX != null ? nextX : x;
    y = nextY != null ? nextY : y;
    middlewareData[name] = {
      ...middlewareData[name],
      ...data
    };
    if (reset && resetCount < MAX_RESET_COUNT) {
      resetCount++;
      if (typeof reset === 'object') {
        if (reset.placement) {
          statefulPlacement = reset.placement;
        }
        if (reset.rects) {
          rects = reset.rects === true ? await platform.getElementRects({
            reference,
            floating,
            strategy
          }) : reset.rects;
        }
        ({
          x,
          y
        } = computeCoordsFromPlacement(rects, statefulPlacement, rtl));
      }
      i = -1;
    }
  }
  return {
    x,
    y,
    placement: statefulPlacement,
    strategy,
    middlewareData
  };
};

/**
 * Provides data to position an inner element of the floating element so that it
 * appears centered to the reference element.
 * @see https://floating-ui.com/docs/arrow
 */
const arrow = options => ({
  name: 'arrow',
  options,
  async fn(state) {
    const {
      x,
      y,
      placement,
      rects,
      platform,
      elements,
      middlewareData
    } = state;
    // Since `element` is required, we don't Partial<> the type.
    const {
      element,
      padding = 0
    } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state) || {};
    if (element == null) {
      return {};
    }
    const paddingObject = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getPaddingObject)(padding);
    const coords = {
      x,
      y
    };
    const axis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignmentAxis)(placement);
    const length = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAxisLength)(axis);
    const arrowDimensions = await platform.getDimensions(element);
    const isYAxis = axis === 'y';
    const minProp = isYAxis ? 'top' : 'left';
    const maxProp = isYAxis ? 'bottom' : 'right';
    const clientProp = isYAxis ? 'clientHeight' : 'clientWidth';
    const endDiff = rects.reference[length] + rects.reference[axis] - coords[axis] - rects.floating[length];
    const startDiff = coords[axis] - rects.reference[axis];
    const arrowOffsetParent = await (platform.getOffsetParent == null ? void 0 : platform.getOffsetParent(element));
    let clientSize = arrowOffsetParent ? arrowOffsetParent[clientProp] : 0;

    // DOM platform can return `window` as the `offsetParent`.
    if (!clientSize || !(await (platform.isElement == null ? void 0 : platform.isElement(arrowOffsetParent)))) {
      clientSize = elements.floating[clientProp] || rects.floating[length];
    }
    const centerToReference = endDiff / 2 - startDiff / 2;

    // If the padding is large enough that it causes the arrow to no longer be
    // centered, modify the padding so that it is centered.
    const largestPossiblePadding = clientSize / 2 - arrowDimensions[length] / 2 - 1;
    const minPadding = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.min)(paddingObject[minProp], largestPossiblePadding);
    const maxPadding = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.min)(paddingObject[maxProp], largestPossiblePadding);

    // Make sure the arrow doesn't overflow the floating element if the center
    // point is outside the floating element's bounds.
    const max = clientSize - arrowDimensions[length] - maxPadding;
    const center = clientSize / 2 - arrowDimensions[length] / 2 + centerToReference;
    const offset = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.clamp)(minPadding, center, max);

    // If the reference is small enough that the arrow's padding causes it to
    // to point to nothing for an aligned placement, adjust the offset of the
    // floating element itself. To ensure `shift()` continues to take action,
    // a single reset is performed when this is true.
    const shouldAddOffset = !middlewareData.arrow && (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(placement) != null && center !== offset && rects.reference[length] / 2 - (center < minPadding ? minPadding : maxPadding) - arrowDimensions[length] / 2 < 0;
    const alignmentOffset = shouldAddOffset ? center < minPadding ? center - minPadding : center - max : 0;
    return {
      [axis]: coords[axis] + alignmentOffset,
      data: {
        [axis]: offset,
        centerOffset: center - offset - alignmentOffset,
        ...(shouldAddOffset && {
          alignmentOffset
        })
      },
      reset: shouldAddOffset
    };
  }
});

function getPlacementList(alignment, autoAlignment, allowedPlacements) {
  const allowedPlacementsSortedByAlignment = alignment ? [...allowedPlacements.filter(placement => (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(placement) === alignment), ...allowedPlacements.filter(placement => (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(placement) !== alignment)] : allowedPlacements.filter(placement => (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement) === placement);
  return allowedPlacementsSortedByAlignment.filter(placement => {
    if (alignment) {
      return (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(placement) === alignment || (autoAlignment ? (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getOppositeAlignmentPlacement)(placement) !== placement : false);
    }
    return true;
  });
}
/**
 * Optimizes the visibility of the floating element by choosing the placement
 * that has the most space available automatically, without needing to specify a
 * preferred placement. Alternative to `flip`.
 * @see https://floating-ui.com/docs/autoPlacement
 */
const autoPlacement = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'autoPlacement',
    options,
    async fn(state) {
      var _middlewareData$autoP, _middlewareData$autoP2, _placementsThatFitOnE;
      const {
        rects,
        middlewareData,
        placement,
        platform,
        elements
      } = state;
      const {
        crossAxis = false,
        alignment,
        allowedPlacements = _floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.placements,
        autoAlignment = true,
        ...detectOverflowOptions
      } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);
      const placements$1 = alignment !== undefined || allowedPlacements === _floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.placements ? getPlacementList(alignment || null, autoAlignment, allowedPlacements) : allowedPlacements;
      const currentIndex = ((_middlewareData$autoP = middlewareData.autoPlacement) == null ? void 0 : _middlewareData$autoP.index) || 0;
      const currentPlacement = placements$1[currentIndex];
      if (currentPlacement == null) {
        return {};
      }

      // Make `computeCoords` start from the right place.
      if (placement !== currentPlacement) {
        return {
          reset: {
            placement: placements$1[0]
          }
        };
      }
      const overflow = await platform.detectOverflow(state, detectOverflowOptions);
      const alignmentSides = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignmentSides)(currentPlacement, rects, await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating)));
      const currentOverflows = [overflow[(0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(currentPlacement)], overflow[alignmentSides[0]], overflow[alignmentSides[1]]];
      const allOverflows = [...(((_middlewareData$autoP2 = middlewareData.autoPlacement) == null ? void 0 : _middlewareData$autoP2.overflows) || []), {
        placement: currentPlacement,
        overflows: currentOverflows
      }];
      const nextPlacement = placements$1[currentIndex + 1];

      // There are more placements to check.
      if (nextPlacement) {
        return {
          data: {
            index: currentIndex + 1,
            overflows: allOverflows
          },
          reset: {
            placement: nextPlacement
          }
        };
      }
      const placementsSortedByMostSpace = allOverflows.map(d => {
        const alignment = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(d.placement);
        return [d.placement, alignment && crossAxis ?
        // Check along the mainAxis and main crossAxis side.
        d.overflows.slice(0, 2).reduce((acc, v) => acc + v, 0) :
        // Check only the mainAxis.
        d.overflows[0], d.overflows];
      }).sort((a, b) => a[1] - b[1]);
      const placementsThatFitOnEachSide = placementsSortedByMostSpace.filter(d => d[2].slice(0,
      // Aligned placements should not check their opposite crossAxis
      // side.
      (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(d[0]) ? 2 : 3).every(v => v <= 0));
      const resetPlacement = ((_placementsThatFitOnE = placementsThatFitOnEachSide[0]) == null ? void 0 : _placementsThatFitOnE[0]) || placementsSortedByMostSpace[0][0];
      if (resetPlacement !== placement) {
        return {
          data: {
            index: currentIndex + 1,
            overflows: allOverflows
          },
          reset: {
            placement: resetPlacement
          }
        };
      }
      return {};
    }
  };
};

/**
 * Optimizes the visibility of the floating element by flipping the `placement`
 * in order to keep it in view when the preferred placement(s) will overflow the
 * clipping boundary. Alternative to `autoPlacement`.
 * @see https://floating-ui.com/docs/flip
 */
const flip = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'flip',
    options,
    async fn(state) {
      var _middlewareData$arrow, _middlewareData$flip;
      const {
        placement,
        middlewareData,
        rects,
        initialPlacement,
        platform,
        elements
      } = state;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = true,
        fallbackPlacements: specifiedFallbackPlacements,
        fallbackStrategy = 'bestFit',
        fallbackAxisSideDirection = 'none',
        flipAlignment = true,
        ...detectOverflowOptions
      } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);

      // If a reset by the arrow was caused due to an alignment offset being
      // added, we should skip any logic now since `flip()` has already done its
      // work.
      // https://github.com/floating-ui/floating-ui/issues/2549#issuecomment-1719601643
      if ((_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
        return {};
      }
      const side = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement);
      const initialSideAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(initialPlacement);
      const isBasePlacement = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(initialPlacement) === initialPlacement;
      const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating));
      const fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipAlignment ? [(0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getOppositePlacement)(initialPlacement)] : (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getExpandedPlacements)(initialPlacement));
      const hasFallbackAxisSideDirection = fallbackAxisSideDirection !== 'none';
      if (!specifiedFallbackPlacements && hasFallbackAxisSideDirection) {
        fallbackPlacements.push(...(0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getOppositeAxisPlacements)(initialPlacement, flipAlignment, fallbackAxisSideDirection, rtl));
      }
      const placements = [initialPlacement, ...fallbackPlacements];
      const overflow = await platform.detectOverflow(state, detectOverflowOptions);
      const overflows = [];
      let overflowsData = ((_middlewareData$flip = middlewareData.flip) == null ? void 0 : _middlewareData$flip.overflows) || [];
      if (checkMainAxis) {
        overflows.push(overflow[side]);
      }
      if (checkCrossAxis) {
        const sides = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignmentSides)(placement, rects, rtl);
        overflows.push(overflow[sides[0]], overflow[sides[1]]);
      }
      overflowsData = [...overflowsData, {
        placement,
        overflows
      }];

      // One or more sides is overflowing.
      if (!overflows.every(side => side <= 0)) {
        var _middlewareData$flip2, _overflowsData$filter;
        const nextIndex = (((_middlewareData$flip2 = middlewareData.flip) == null ? void 0 : _middlewareData$flip2.index) || 0) + 1;
        const nextPlacement = placements[nextIndex];
        if (nextPlacement) {
          const ignoreCrossAxisOverflow = checkCrossAxis === 'alignment' ? initialSideAxis !== (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(nextPlacement) : false;
          if (!ignoreCrossAxisOverflow ||
          // We leave the current main axis only if every placement on that axis
          // overflows the main axis.
          overflowsData.every(d => (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(d.placement) === initialSideAxis ? d.overflows[0] > 0 : true)) {
            // Try next placement and re-run the lifecycle.
            return {
              data: {
                index: nextIndex,
                overflows: overflowsData
              },
              reset: {
                placement: nextPlacement
              }
            };
          }
        }

        // First, find the candidates that fit on the mainAxis side of overflow,
        // then find the placement that fits the best on the main crossAxis side.
        let resetPlacement = (_overflowsData$filter = overflowsData.filter(d => d.overflows[0] <= 0).sort((a, b) => a.overflows[1] - b.overflows[1])[0]) == null ? void 0 : _overflowsData$filter.placement;

        // Otherwise fallback.
        if (!resetPlacement) {
          switch (fallbackStrategy) {
            case 'bestFit':
              {
                var _overflowsData$filter2;
                const placement = (_overflowsData$filter2 = overflowsData.filter(d => {
                  if (hasFallbackAxisSideDirection) {
                    const currentSideAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(d.placement);
                    return currentSideAxis === initialSideAxis ||
                    // Create a bias to the `y` side axis due to horizontal
                    // reading directions favoring greater width.
                    currentSideAxis === 'y';
                  }
                  return true;
                }).map(d => [d.placement, d.overflows.filter(overflow => overflow > 0).reduce((acc, overflow) => acc + overflow, 0)]).sort((a, b) => a[1] - b[1])[0]) == null ? void 0 : _overflowsData$filter2[0];
                if (placement) {
                  resetPlacement = placement;
                }
                break;
              }
            case 'initialPlacement':
              resetPlacement = initialPlacement;
              break;
          }
        }
        if (placement !== resetPlacement) {
          return {
            reset: {
              placement: resetPlacement
            }
          };
        }
      }
      return {};
    }
  };
};

function getSideOffsets(overflow, rect) {
  return {
    top: overflow.top - rect.height,
    right: overflow.right - rect.width,
    bottom: overflow.bottom - rect.height,
    left: overflow.left - rect.width
  };
}
function isAnySideFullyClipped(overflow) {
  return _floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.sides.some(side => overflow[side] >= 0);
}
/**
 * Provides data to hide the floating element in applicable situations, such as
 * when it is not in the same clipping context as the reference element.
 * @see https://floating-ui.com/docs/hide
 */
const hide = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'hide',
    options,
    async fn(state) {
      const {
        rects,
        platform
      } = state;
      const {
        strategy = 'referenceHidden',
        ...detectOverflowOptions
      } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);
      switch (strategy) {
        case 'referenceHidden':
          {
            const overflow = await platform.detectOverflow(state, {
              ...detectOverflowOptions,
              elementContext: 'reference'
            });
            const offsets = getSideOffsets(overflow, rects.reference);
            return {
              data: {
                referenceHiddenOffsets: offsets,
                referenceHidden: isAnySideFullyClipped(offsets)
              }
            };
          }
        case 'escaped':
          {
            const overflow = await platform.detectOverflow(state, {
              ...detectOverflowOptions,
              altBoundary: true
            });
            const offsets = getSideOffsets(overflow, rects.floating);
            return {
              data: {
                escapedOffsets: offsets,
                escaped: isAnySideFullyClipped(offsets)
              }
            };
          }
        default:
          {
            return {};
          }
      }
    }
  };
};

function getBoundingRect(rects) {
  const minX = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.min)(...rects.map(rect => rect.left));
  const minY = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.min)(...rects.map(rect => rect.top));
  const maxX = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.max)(...rects.map(rect => rect.right));
  const maxY = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.max)(...rects.map(rect => rect.bottom));
  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY
  };
}
function getRectsByLine(rects) {
  const sortedRects = rects.slice().sort((a, b) => a.y - b.y);
  const groups = [];
  let prevRect = null;
  for (let i = 0; i < sortedRects.length; i++) {
    const rect = sortedRects[i];
    if (!prevRect || rect.y - prevRect.y > prevRect.height / 2) {
      groups.push([rect]);
    } else {
      groups[groups.length - 1].push(rect);
    }
    prevRect = rect;
  }
  return groups.map(rect => (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.rectToClientRect)(getBoundingRect(rect)));
}
/**
 * Provides improved positioning for inline reference elements that can span
 * over multiple lines, such as hyperlinks or range selections.
 * @see https://floating-ui.com/docs/inline
 */
const inline = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'inline',
    options,
    async fn(state) {
      const {
        placement,
        elements,
        rects,
        platform,
        strategy
      } = state;
      // A MouseEvent's client{X,Y} coords can be up to 2 pixels off a
      // ClientRect's bounds, despite the event listener being triggered. A
      // padding of 2 seems to handle this issue.
      const {
        padding = 2,
        x,
        y
      } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);
      const nativeClientRects = Array.from((await (platform.getClientRects == null ? void 0 : platform.getClientRects(elements.reference))) || []);

      // No rects (e.g. a hidden or detached reference, or a collapsed range) —
      // keep the existing reference rect rather than resetting to an invalid
      // one with non-finite values.
      if (!nativeClientRects.length) {
        return {};
      }
      const clientRects = getRectsByLine(nativeClientRects);
      const fallback = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.rectToClientRect)(getBoundingRect(nativeClientRects));
      const paddingObject = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getPaddingObject)(padding);
      function getBoundingClientRect() {
        // There are two rects and they are disjoined.
        if (clientRects.length === 2 && (clientRects[0].left > clientRects[1].right || clientRects[1].left > clientRects[0].right) && x != null && y != null) {
          // Find the first rect in which the point is fully inside.
          return clientRects.find(rect => x > rect.left - paddingObject.left && x < rect.right + paddingObject.right && y > rect.top - paddingObject.top && y < rect.bottom + paddingObject.bottom) || fallback;
        }

        // There are 2 or more connected rects.
        if (clientRects.length >= 2) {
          if ((0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(placement) === 'y') {
            const firstRect = clientRects[0];
            const lastRect = clientRects[clientRects.length - 1];
            const isTop = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement) === 'top';
            const top = firstRect.top;
            const bottom = lastRect.bottom;
            const left = isTop ? firstRect.left : lastRect.left;
            const right = isTop ? firstRect.right : lastRect.right;
            return (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.rectToClientRect)({
              x: left,
              y: top,
              width: right - left,
              height: bottom - top
            });
          }
          const isLeftSide = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement) === 'left';
          const maxRight = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.max)(...clientRects.map(rect => rect.right));
          const minLeft = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.min)(...clientRects.map(rect => rect.left));
          const measureRects = clientRects.filter(rect => isLeftSide ? rect.left === minLeft : rect.right === maxRight);
          const top = measureRects[0].top;
          const bottom = measureRects[measureRects.length - 1].bottom;
          return (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.rectToClientRect)({
            x: minLeft,
            y: top,
            width: maxRight - minLeft,
            height: bottom - top
          });
        }
        return fallback;
      }
      const resetRects = await platform.getElementRects({
        reference: {
          getBoundingClientRect
        },
        floating: elements.floating,
        strategy
      });
      if (rects.reference.x !== resetRects.reference.x || rects.reference.y !== resetRects.reference.y || rects.reference.width !== resetRects.reference.width || rects.reference.height !== resetRects.reference.height) {
        return {
          reset: {
            rects: resetRects
          }
        };
      }
      return {};
    }
  };
};

const originSides = /*#__PURE__*/new Set(['left', 'top']);

// For type backwards-compatibility, the `OffsetOptions` type was also
// Derivable.

async function convertValueToCoords(state, options) {
  const {
    placement,
    platform,
    elements
  } = state;
  const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating));
  const side = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement);
  const alignment = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(placement);
  const isVertical = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(placement) === 'y';
  const mainAxisMulti = originSides.has(side) ? -1 : 1;
  const crossAxisMulti = rtl && isVertical ? -1 : 1;
  const rawValue = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);

  // eslint-disable-next-line prefer-const
  let {
    mainAxis,
    crossAxis,
    alignmentAxis
  } = typeof rawValue === 'number' ? {
    mainAxis: rawValue,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: rawValue.mainAxis || 0,
    crossAxis: rawValue.crossAxis || 0,
    alignmentAxis: rawValue.alignmentAxis
  };
  if (alignment && typeof alignmentAxis === 'number') {
    crossAxis = alignment === 'end' ? alignmentAxis * -1 : alignmentAxis;
  }
  return isVertical ? {
    x: crossAxis * crossAxisMulti,
    y: mainAxis * mainAxisMulti
  } : {
    x: mainAxis * mainAxisMulti,
    y: crossAxis * crossAxisMulti
  };
}

/**
 * Modifies the placement by translating the floating element along the
 * specified axes.
 * A number (shorthand for `mainAxis` or distance), or an axes configuration
 * object may be passed.
 * @see https://floating-ui.com/docs/offset
 */
const offset = function (options) {
  if (options === void 0) {
    options = 0;
  }
  return {
    name: 'offset',
    options,
    async fn(state) {
      var _middlewareData$offse, _middlewareData$arrow;
      const {
        x,
        y,
        placement,
        middlewareData
      } = state;
      const diffCoords = await convertValueToCoords(state, options);

      // If the placement is the same and the arrow caused an alignment offset
      // then we don't need to change the positioning coordinates.
      if (placement === ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse.placement) && (_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
        return {};
      }
      return {
        x: x + diffCoords.x,
        y: y + diffCoords.y,
        data: {
          ...diffCoords,
          placement
        }
      };
    }
  };
};

/**
 * Optimizes the visibility of the floating element by shifting it in order to
 * keep it in view when it will overflow the clipping boundary.
 * @see https://floating-ui.com/docs/shift
 */
const shift = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'shift',
    options,
    async fn(state) {
      const {
        x,
        y,
        placement,
        platform
      } = state;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = false,
        limiter = {
          fn: _ref => {
            let {
              x,
              y
            } = _ref;
            return {
              x,
              y
            };
          }
        },
        ...detectOverflowOptions
      } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);
      const coords = {
        x,
        y
      };
      const overflow = await platform.detectOverflow(state, detectOverflowOptions);
      const crossAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(placement);
      const mainAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getOppositeAxis)(crossAxis);
      let mainAxisCoord = coords[mainAxis];
      let crossAxisCoord = coords[crossAxis];
      const clampCoord = (axis, coord) => (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.clamp)(coord + overflow[axis === 'y' ? 'top' : 'left'], coord, coord - overflow[axis === 'y' ? 'bottom' : 'right']);
      if (checkMainAxis) {
        mainAxisCoord = clampCoord(mainAxis, mainAxisCoord);
      }
      if (checkCrossAxis) {
        crossAxisCoord = clampCoord(crossAxis, crossAxisCoord);
      }
      const limitedCoords = limiter.fn({
        ...state,
        [mainAxis]: mainAxisCoord,
        [crossAxis]: crossAxisCoord
      });
      return {
        ...limitedCoords,
        data: {
          x: limitedCoords.x - x,
          y: limitedCoords.y - y,
          enabled: {
            [mainAxis]: checkMainAxis,
            [crossAxis]: checkCrossAxis
          }
        }
      };
    }
  };
};
/**
 * Built-in `limiter` that will stop `shift()` at a certain point.
 */
const limitShift = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    options,
    fn(state) {
      var _rawOffset$mainAxis, _rawOffset$crossAxis;
      const {
        x,
        y,
        placement,
        rects,
        middlewareData
      } = state;
      const {
        offset = 0,
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = true
      } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);
      const coords = {
        x,
        y
      };
      const crossAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(placement);
      const mainAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getOppositeAxis)(crossAxis);
      let mainAxisCoord = coords[mainAxis];
      let crossAxisCoord = coords[crossAxis];
      const rawOffset = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(offset, state);
      const computedOffset = typeof rawOffset === 'number' ? {
        mainAxis: rawOffset,
        crossAxis: 0
      } : {
        mainAxis: (_rawOffset$mainAxis = rawOffset.mainAxis) != null ? _rawOffset$mainAxis : 0,
        crossAxis: (_rawOffset$crossAxis = rawOffset.crossAxis) != null ? _rawOffset$crossAxis : 0
      };
      if (checkMainAxis) {
        const len = mainAxis === 'y' ? 'height' : 'width';
        const limitMin = rects.reference[mainAxis] - rects.floating[len] + computedOffset.mainAxis;
        const limitMax = rects.reference[mainAxis] + rects.reference[len] - computedOffset.mainAxis;
        if (mainAxisCoord < limitMin) {
          mainAxisCoord = limitMin;
        } else if (mainAxisCoord > limitMax) {
          mainAxisCoord = limitMax;
        }
      }
      if (checkCrossAxis) {
        var _middlewareData$offse, _middlewareData$offse2;
        const len = mainAxis === 'y' ? 'width' : 'height';
        const isOriginSide = originSides.has((0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement));
        const limitMin = rects.reference[crossAxis] - rects.floating[len] + (isOriginSide ? ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse[crossAxis]) || 0 : 0) + (isOriginSide ? 0 : computedOffset.crossAxis);
        const limitMax = rects.reference[crossAxis] + rects.reference[len] + (isOriginSide ? 0 : ((_middlewareData$offse2 = middlewareData.offset) == null ? void 0 : _middlewareData$offse2[crossAxis]) || 0) - (isOriginSide ? computedOffset.crossAxis : 0);
        if (crossAxisCoord < limitMin) {
          crossAxisCoord = limitMin;
        } else if (crossAxisCoord > limitMax) {
          crossAxisCoord = limitMax;
        }
      }
      return {
        [mainAxis]: mainAxisCoord,
        [crossAxis]: crossAxisCoord
      };
    }
  };
};

// Method syntax keeps callback parameters bivariant, but expressing the
// explicit `| undefined` required by `exactOptionalPropertyTypes` needs
// property syntax, which is contravariant under `strictFunctionTypes`.
// Extracting the function from a method position restores that bivariance so
// consumers can still assign callbacks with narrower parameter types.

/**
 * Provides data that allows you to change the size of the floating element —
 * for instance, prevent it from overflowing the clipping boundary or match the
 * width of the reference element.
 * @see https://floating-ui.com/docs/size
 */
const size = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'size',
    options,
    async fn(state) {
      const {
        placement,
        rects,
        platform,
        elements
      } = state;
      const {
        apply = () => {},
        ...detectOverflowOptions
      } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);
      const overflow = await platform.detectOverflow(state, detectOverflowOptions);
      const side = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement);
      const alignment = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(placement);
      const isYAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(placement) === 'y';
      const {
        width,
        height
      } = rects.floating;
      let heightSide;
      let widthSide;
      if (side === 'top' || side === 'bottom') {
        heightSide = side;
        widthSide = alignment === ((await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating))) ? 'start' : 'end') ? 'left' : 'right';
      } else {
        widthSide = side;
        heightSide = alignment === 'end' ? 'top' : 'bottom';
      }
      const maximumClippingHeight = height - overflow.top - overflow.bottom;
      const maximumClippingWidth = width - overflow.left - overflow.right;
      const overflowAvailableHeight = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.min)(height - overflow[heightSide], maximumClippingHeight);
      const overflowAvailableWidth = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.min)(width - overflow[widthSide], maximumClippingWidth);
      const shiftData = state.middlewareData.shift;
      const noShift = !shiftData;
      let availableHeight = overflowAvailableHeight;
      let availableWidth = overflowAvailableWidth;
      if (shiftData != null && shiftData.enabled.x) {
        availableWidth = maximumClippingWidth;
      }
      if (shiftData != null && shiftData.enabled.y) {
        availableHeight = maximumClippingHeight;
      }
      if (noShift && !alignment) {
        if (isYAxis) {
          availableWidth = width - 2 * (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.max)(overflow.left, overflow.right);
        } else {
          availableHeight = height - 2 * (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.max)(overflow.top, overflow.bottom);
        }
      }
      await apply({
        ...state,
        availableWidth,
        availableHeight
      });
      const nextDimensions = await platform.getDimensions(elements.floating);
      if (width !== nextDimensions.width || height !== nextDimensions.height) {
        return {
          reset: {
            rects: true
          }
        };
      }
      return {};
    }
  };
};




/***/ },

/***/ "6d338aa773af"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* empty/unused harmony star reexport */
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   arrow: () => (/* binding */ arrow),
/* harmony export */   autoPlacement: () => (/* binding */ autoPlacement),
/* harmony export */   autoUpdate: () => (/* binding */ autoUpdate),
/* harmony export */   computePosition: () => (/* binding */ computePosition),
/* harmony export */   detectOverflow: () => (/* binding */ detectOverflow),
/* harmony export */   flip: () => (/* binding */ flip),
/* harmony export */   hide: () => (/* binding */ hide),
/* harmony export */   inline: () => (/* binding */ inline),
/* harmony export */   limitShift: () => (/* binding */ limitShift),
/* harmony export */   offset: () => (/* binding */ offset),
/* harmony export */   platform: () => (/* binding */ platform),
/* harmony export */   shift: () => (/* binding */ shift),
/* harmony export */   size: () => (/* binding */ size)
/* harmony export */ });
/* harmony import */ var _floating_ui_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("b4b2e395e4eb");
/* harmony import */ var _floating_ui_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("56345afd9e11");
/* harmony import */ var _floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("d7f28916ed76");





function getCssDimensions(element) {
  const css = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getComputedStyle)(element);
  // In testing environments, the `width` and `height` properties are empty
  // strings for SVG elements, returning NaN. Fallback to `0` in this case.
  let width = parseFloat(css.width) || 0;
  let height = parseFloat(css.height) || 0;
  const hasOffset = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isHTMLElement)(element);
  const offsetWidth = hasOffset ? element.offsetWidth : width;
  const offsetHeight = hasOffset ? element.offsetHeight : height;
  const shouldFallback = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.round)(width) !== offsetWidth || (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.round)(height) !== offsetHeight;
  if (shouldFallback) {
    width = offsetWidth;
    height = offsetHeight;
  }
  return {
    width,
    height,
    $: shouldFallback
  };
}

function unwrapElement(element) {
  return !(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isElement)(element) ? element.contextElement : element;
}

function getScale(element) {
  const domElement = unwrapElement(element);
  if (!(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isHTMLElement)(domElement)) {
    return (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.createCoords)(1);
  }
  const rect = domElement.getBoundingClientRect();
  const {
    width,
    height,
    $
  } = getCssDimensions(domElement);
  let x = ($ ? (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.round)(rect.width) : rect.width) / width;
  let y = ($ ? (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.round)(rect.height) : rect.height) / height;

  // 0, NaN, or Infinity should always fallback to 1.

  if (!x || !Number.isFinite(x)) {
    x = 1;
  }
  if (!y || !Number.isFinite(y)) {
    y = 1;
  }
  return {
    x,
    y
  };
}

const noOffsets = /*#__PURE__*/(0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.createCoords)(0);
function getVisualOffsets(element) {
  const win = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getWindow)(element);
  if (!(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isWebKit)() || !win.visualViewport) {
    return noOffsets;
  }
  return {
    x: win.visualViewport.offsetLeft,
    y: win.visualViewport.offsetTop
  };
}
function shouldAddVisualOffsets(element, isFixed, floatingOffsetParent) {
  if (isFixed === void 0) {
    isFixed = false;
  }
  return !!floatingOffsetParent && isFixed && floatingOffsetParent === (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getWindow)(element);
}

function getBoundingClientRect(element, includeScale, isFixedStrategy, offsetParent) {
  if (includeScale === void 0) {
    includeScale = false;
  }
  if (isFixedStrategy === void 0) {
    isFixedStrategy = false;
  }
  const clientRect = element.getBoundingClientRect();
  const domElement = unwrapElement(element);
  let scale = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.createCoords)(1);
  if (includeScale) {
    if (offsetParent) {
      if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isElement)(offsetParent)) {
        scale = getScale(offsetParent);
      }
    } else {
      scale = getScale(element);
    }
  }
  const visualOffsets = shouldAddVisualOffsets(domElement, isFixedStrategy, offsetParent) ? getVisualOffsets(domElement) : (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.createCoords)(0);
  let x = (clientRect.left + visualOffsets.x) / scale.x;
  let y = (clientRect.top + visualOffsets.y) / scale.y;
  let width = clientRect.width / scale.x;
  let height = clientRect.height / scale.y;
  if (domElement && offsetParent) {
    const win = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getWindow)(domElement);
    const offsetWin = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isElement)(offsetParent) ? (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getWindow)(offsetParent) : offsetParent;
    let currentWin = win;
    let currentIFrame = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getFrameElement)(currentWin);
    while (currentIFrame && offsetWin !== currentWin) {
      const iframeScale = getScale(currentIFrame);
      const iframeRect = currentIFrame.getBoundingClientRect();
      const css = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getComputedStyle)(currentIFrame);
      const left = iframeRect.left + (currentIFrame.clientLeft + parseFloat(css.paddingLeft)) * iframeScale.x;
      const top = iframeRect.top + (currentIFrame.clientTop + parseFloat(css.paddingTop)) * iframeScale.y;
      x *= iframeScale.x;
      y *= iframeScale.y;
      width *= iframeScale.x;
      height *= iframeScale.y;
      x += left;
      y += top;
      currentWin = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getWindow)(currentIFrame);
      currentIFrame = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getFrameElement)(currentWin);
    }
  }
  return (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.rectToClientRect)({
    width,
    height,
    x,
    y
  });
}

// If <html> has a CSS width greater than the viewport, then this will be
// incorrect for RTL.
function getWindowScrollBarX(element, rect) {
  const leftScroll = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getNodeScroll)(element).scrollLeft;
  if (!rect) {
    return getBoundingClientRect((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getDocumentElement)(element)).left + leftScroll;
  }
  return rect.left + leftScroll;
}

function getHTMLOffset(documentElement, scroll) {
  const htmlRect = documentElement.getBoundingClientRect();
  const x = htmlRect.left + scroll.scrollLeft - getWindowScrollBarX(documentElement, htmlRect);
  const y = htmlRect.top + scroll.scrollTop;
  return {
    x,
    y
  };
}

function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
  let {
    elements,
    rect,
    offsetParent,
    strategy
  } = _ref;
  const isFixed = strategy === 'fixed';
  const documentElement = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getDocumentElement)(offsetParent);
  const topLayer = elements ? (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isTopLayer)(elements.floating) : false;
  if (offsetParent === documentElement || topLayer && isFixed) {
    return rect;
  }
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  let scale = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.createCoords)(1);
  const offsets = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.createCoords)(0);
  const isOffsetParentAnElement = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isHTMLElement)(offsetParent);
  if (isOffsetParentAnElement || !isFixed) {
    if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getNodeName)(offsetParent) !== 'body' || (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isOverflowElement)(documentElement)) {
      scroll = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getNodeScroll)(offsetParent);
    }
    if (isOffsetParentAnElement) {
      const offsetRect = getBoundingClientRect(offsetParent);
      scale = getScale(offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    }
  }
  const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.createCoords)(0);
  return {
    width: rect.width * scale.x,
    height: rect.height * scale.y,
    x: rect.x * scale.x - scroll.scrollLeft * scale.x + offsets.x + htmlOffset.x,
    y: rect.y * scale.y - scroll.scrollTop * scale.y + offsets.y + htmlOffset.y
  };
}

function getClientRects(element) {
  return element.getClientRects ? Array.from(element.getClientRects()) : [];
}

// Gets the entire size of the scrollable document area, even extending outside
// of the `<html>` and `<body>` rect bounds if horizontally scrollable.
function getDocumentRect(html) {
  const scroll = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getNodeScroll)(html);
  const body = html.ownerDocument.body;
  const width = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.max)(html.scrollWidth, html.clientWidth, body.scrollWidth, body.clientWidth);
  const height = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.max)(html.scrollHeight, html.clientHeight, body.scrollHeight, body.clientHeight);
  let x = -scroll.scrollLeft + getWindowScrollBarX(html);
  const y = -scroll.scrollTop;
  if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getComputedStyle)(body).direction === 'rtl') {
    x += (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.max)(html.clientWidth, body.clientWidth) - width;
  }
  return {
    width,
    height,
    x,
    y
  };
}

// Safety check: ensure the scrollbar space is reasonable in case this
// calculation is affected by unusual styles.
// Most scrollbars leave 15-18px of space.
const SCROLLBAR_MAX = 25;
function getViewportRect(element, strategy, rootBoundary) {
  if (rootBoundary === void 0) {
    rootBoundary = 'viewport';
  }
  const isLayoutViewport = rootBoundary === 'layoutViewport';
  const win = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getWindow)(element);
  const html = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getDocumentElement)(element);
  const visualViewport = win.visualViewport;
  let width = html.clientWidth;
  let height = html.clientHeight;
  let x = 0;
  let y = 0;
  if (visualViewport) {
    // Client coordinates are relative to the layout viewport, except in
    // WebKit with an `absolute` strategy, where they are relative to the
    // visual viewport.
    const layoutRelativeClientCoords = !(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isWebKit)() || strategy === 'fixed';
    if (isLayoutViewport) {
      if (!layoutRelativeClientCoords) {
        x = -visualViewport.offsetLeft;
        y = -visualViewport.offsetTop;
      }
    } else {
      width = visualViewport.width;
      height = visualViewport.height;
      if (layoutRelativeClientCoords) {
        x = visualViewport.offsetLeft;
        y = visualViewport.offsetTop;
      }
    }
  }
  const windowScrollbarX = getWindowScrollBarX(html);
  // `scrollbar-gutter: stable` on the <html> reserves gutter space that shrinks
  // the visual width but isn't reflected in `html.clientWidth`, so subtract it.
  // Only the inline-end (right) gutter can hold the scrollbar; `both-edges` also
  // reserves an empty inline-start gutter that clips nothing, so exclude just
  // the one scrollbar-side gutter — halve the measured (two-gutter) total. A
  // left-side scrollbar (`windowScrollbarX > 0`) is already handled by
  // `getHTMLOffset`/`visualViewport.width`; skip it here.
  if (windowScrollbarX <= 0) {
    const doc = html.ownerDocument;
    const body = doc.body;
    const bodyStyles = getComputedStyle(body);
    const bodyMarginInline = doc.compatMode === 'CSS1Compat' ? parseFloat(bodyStyles.marginLeft) + parseFloat(bodyStyles.marginRight) || 0 : 0;
    const reservedWidth = Math.abs(html.clientWidth - body.clientWidth - bodyMarginInline);
    const gutter = getComputedStyle(html).scrollbarGutter === 'stable both-edges' ? reservedWidth / 2 : reservedWidth;
    if (gutter <= SCROLLBAR_MAX) {
      width -= gutter;
    }
  }
  return {
    width,
    height,
    x,
    y
  };
}

// Returns the inner client rect, subtracting scrollbars if present.
function getInnerBoundingClientRect(element, strategy) {
  const clientRect = getBoundingClientRect(element, true, strategy === 'fixed');
  const top = clientRect.top + element.clientTop;
  const left = clientRect.left + element.clientLeft;
  const scale = getScale(element);
  const width = element.clientWidth * scale.x;
  const height = element.clientHeight * scale.y;
  const x = left * scale.x;
  const y = top * scale.y;
  return {
    width,
    height,
    x,
    y
  };
}
function getClientRectFromClippingAncestor(element, clippingAncestor, strategy) {
  let rect;
  if (clippingAncestor === 'viewport' || clippingAncestor === 'layoutViewport') {
    rect = getViewportRect(element, strategy, clippingAncestor);
  } else if (clippingAncestor === 'document') {
    rect = getDocumentRect((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getDocumentElement)(element));
  } else if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isElement)(clippingAncestor)) {
    rect = getInnerBoundingClientRect(clippingAncestor, strategy);
  } else {
    const visualOffsets = getVisualOffsets(element);
    rect = {
      x: clippingAncestor.x - visualOffsets.x,
      y: clippingAncestor.y - visualOffsets.y,
      width: clippingAncestor.width,
      height: clippingAncestor.height
    };
  }
  return (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.rectToClientRect)(rect);
}

// A "clipping ancestor" is an `overflow` element with the characteristic of
// clipping (or hiding) child elements. This returns all clipping ancestors
// of the given element up the tree.
function getClippingElementAncestors(element, cache) {
  const cachedResult = cache.get(element);
  if (cachedResult) {
    return cachedResult;
  }
  let result = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getOverflowAncestors)(element, [], false).filter(el => (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isElement)(el) && (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getNodeName)(el) !== 'body');
  let lastKeptComputedStyle = null;
  const elementIsFixed = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getComputedStyle)(element).position === 'fixed';
  let currentNode = elementIsFixed ? (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getParentNode)(element) : element;

  // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block
  while ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isElement)(currentNode) && !(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isLastTraversableNode)(currentNode)) {
    const computedStyle = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getComputedStyle)(currentNode);
    const currentNodeIsContaining = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isContainingBlock)(currentNode);
    // Position of the containing block chain below the current node. A fixed
    // element whose containing block hasn't been found yet is a fixed chain.
    const lastPosition = lastKeptComputedStyle ? lastKeptComputedStyle.position : elementIsFixed ? 'fixed' : '';

    // A non-containing ancestor does not clip the element when the chain
    // below it escapes it: a fixed chain escapes all ancestors up to the
    // next containing block, an absolute chain escapes static ancestors.
    const shouldDropCurrentNode = !currentNodeIsContaining && (lastPosition === 'fixed' || lastPosition === 'absolute' && computedStyle.position === 'static');
    if (shouldDropCurrentNode) {
      // Drop non-containing blocks.
      result = result.filter(ancestor => ancestor !== currentNode);
    } else {
      // The kept node carries the chain position for the next iteration.
      lastKeptComputedStyle = computedStyle;
    }
    currentNode = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getParentNode)(currentNode);
  }
  cache.set(element, result);
  return result;
}

// Gets the maximum area that the element is visible in due to any number of
// clipping ancestors.
function getClippingRect(_ref) {
  let {
    element,
    boundary,
    rootBoundary,
    strategy
  } = _ref;
  const elementClippingAncestors = boundary === 'clippingAncestors' ? (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isTopLayer)(element) ? [] : getClippingElementAncestors(element, this._c) : [].concat(boundary);
  const clippingAncestors = [...elementClippingAncestors, rootBoundary];
  const firstRect = getClientRectFromClippingAncestor(element, clippingAncestors[0], strategy);
  let top = firstRect.top;
  let right = firstRect.right;
  let bottom = firstRect.bottom;
  let left = firstRect.left;
  for (let i = 1; i < clippingAncestors.length; i++) {
    const rect = getClientRectFromClippingAncestor(element, clippingAncestors[i], strategy);
    top = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.max)(rect.top, top);
    right = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.min)(rect.right, right);
    bottom = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.min)(rect.bottom, bottom);
    left = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.max)(rect.left, left);
  }
  return {
    width: right - left,
    height: bottom - top,
    x: left,
    y: top
  };
}

function getDimensions(element) {
  const {
    width,
    height
  } = getCssDimensions(element);
  return {
    width,
    height
  };
}

function getRectRelativeToOffsetParent(element, offsetParent, strategy) {
  const isOffsetParentAnElement = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isHTMLElement)(offsetParent);
  const documentElement = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getDocumentElement)(offsetParent);
  const isFixed = strategy === 'fixed';
  const rect = getBoundingClientRect(element, true, isFixed, offsetParent);
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const offsets = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.createCoords)(0);
  if (isOffsetParentAnElement || !isFixed) {
    if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getNodeName)(offsetParent) !== 'body' || (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isOverflowElement)(documentElement)) {
      scroll = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getNodeScroll)(offsetParent);
    }
    if (isOffsetParentAnElement) {
      const offsetRect = getBoundingClientRect(offsetParent, true, isFixed, offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    }
  }

  // If the <body> scrollbar appears on the left (e.g. RTL systems). Use
  // Firefox with layout.scrollbar.side = 3 in about:config to test this.
  if (!isOffsetParentAnElement && documentElement) {
    offsets.x = getWindowScrollBarX(documentElement);
  }
  const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.createCoords)(0);
  const x = rect.left + scroll.scrollLeft - offsets.x - htmlOffset.x;
  const y = rect.top + scroll.scrollTop - offsets.y - htmlOffset.y;
  return {
    x,
    y,
    width: rect.width,
    height: rect.height
  };
}

function isStaticPositioned(element) {
  return (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getComputedStyle)(element).position === 'static';
}

function getTrueOffsetParent(element, polyfill) {
  if (!(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isHTMLElement)(element) || (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getComputedStyle)(element).position === 'fixed') {
    return null;
  }
  if (polyfill) {
    return polyfill(element);
  }
  let rawOffsetParent = element.offsetParent;

  // Firefox returns the <html> element as the offsetParent if it's non-static,
  // while Chrome and Safari return the <body> element. The <body> element must
  // be used to perform the correct calculations even if the <html> element is
  // non-static.
  if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getDocumentElement)(element) === rawOffsetParent) {
    rawOffsetParent = rawOffsetParent.ownerDocument.body;
  }
  return rawOffsetParent;
}

// Gets the closest ancestor positioned element. Handles some edge cases,
// such as table ancestors and cross browser bugs.
function getOffsetParent(element, polyfill) {
  const win = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getWindow)(element);
  if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isTopLayer)(element)) {
    return win;
  }
  if (!(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isHTMLElement)(element)) {
    let svgOffsetParent = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getParentNode)(element);
    while (svgOffsetParent && !(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isLastTraversableNode)(svgOffsetParent)) {
      if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isElement)(svgOffsetParent) && !isStaticPositioned(svgOffsetParent)) {
        return svgOffsetParent;
      }
      svgOffsetParent = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getParentNode)(svgOffsetParent);
    }
    return win;
  }
  let offsetParent = getTrueOffsetParent(element, polyfill);
  while (offsetParent && (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isTableElement)(offsetParent) && isStaticPositioned(offsetParent)) {
    offsetParent = getTrueOffsetParent(offsetParent, polyfill);
  }
  if (offsetParent && (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isLastTraversableNode)(offsetParent) && isStaticPositioned(offsetParent) && !(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isContainingBlock)(offsetParent)) {
    return win;
  }
  return offsetParent || (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getContainingBlock)(element) || win;
}

const getElementRects = async function (data) {
  const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
  const getDimensionsFn = this.getDimensions;
  const floatingDimensions = await getDimensionsFn(data.floating);
  return {
    reference: getRectRelativeToOffsetParent(data.reference, await getOffsetParentFn(data.floating), data.strategy),
    floating: {
      x: 0,
      y: 0,
      width: floatingDimensions.width,
      height: floatingDimensions.height
    }
  };
};

function isRTL(element) {
  return (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getComputedStyle)(element).direction === 'rtl';
}

const platform = {
  convertOffsetParentRelativeRectToViewportRelativeRect,
  getDocumentElement: _floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getDocumentElement,
  getClippingRect,
  getOffsetParent,
  getElementRects,
  getClientRects,
  getDimensions,
  getScale,
  isElement: _floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isElement,
  isRTL
};

function rectsAreEqual(a, b) {
  return a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height;
}

// https://samthor.au/2021/observing-dom/
function observeMove(element, onMove, ancestorResize) {
  let io = null;
  let timeoutId;
  const root = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getDocumentElement)(element);
  function cleanup() {
    var _io;
    clearTimeout(timeoutId);
    (_io = io) == null || _io.disconnect();
    io = null;
  }
  function refresh(skip, threshold) {
    if (skip === void 0) {
      skip = false;
    }
    if (threshold === void 0) {
      threshold = 1;
    }
    cleanup();
    const elementRectForRootMargin = element.getBoundingClientRect();
    const {
      left,
      top,
      width,
      height
    } = elementRectForRootMargin;
    if (!skip) {
      onMove();
    }
    if (!width || !height) {
      return;
    }
    const insetTop = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.floor)(top);
    const insetRight = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.floor)(root.clientWidth - (left + width));
    const insetBottom = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.floor)(root.clientHeight - (top + height));
    const insetLeft = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.floor)(left);
    const rootMargin = -insetTop + "px " + -insetRight + "px " + -insetBottom + "px " + -insetLeft + "px";
    const options = {
      rootMargin,
      threshold: (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.max)(0, (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.min)(1, threshold)) || 1
    };
    let isFirstUpdate = true;
    function handleObserve(entries) {
      const ratio = entries[0].intersectionRatio;

      // The entry is a snapshot, so the reference may have moved since the
      // intersection was computed (under performance constraints, or between
      // consecutive frames of a multi-frame layout shift). The reported ratio
      // and the observed area are stale in that case and cannot be trusted to
      // detect subsequent movement, so refresh regardless of the ratio.
      if (!rectsAreEqual(elementRectForRootMargin, element.getBoundingClientRect())) {
        return refresh();
      }
      if (ratio !== threshold) {
        if (!isFirstUpdate) {
          return refresh();
        }
        if (!ratio) {
          // If the reference is clipped in place, the ratio is 0. Throttle
          // the refresh to prevent an infinite loop of updates.
          timeoutId = setTimeout(() => {
            refresh(false, 1e-7);
          }, 1000);
        } else {
          refresh(false, ratio);
        }
      }
      isFirstUpdate = false;
    }

    // Older browsers don't support a `document` as the root and will throw an
    // error.
    try {
      io = new IntersectionObserver(handleObserve, {
        ...options,
        // Handle <iframe>s
        root: root.ownerDocument
      });
    } catch (_e) {
      io = new IntersectionObserver(handleObserve, options);
    }
    io.observe(element);
  }
  const win = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getWindow)(element);
  // The window is a resize ancestor, so when `ancestorResize` is enabled its
  // listener already runs the update on resize. Here we only need to rebuild
  // the `IntersectionObserver` for the new root size, skipping a redundant
  // update. When `ancestorResize` is disabled, this becomes the sole update.
  const handleResize = () => refresh(ancestorResize);
  win.addEventListener('resize', handleResize);
  refresh(true);
  return () => {
    win.removeEventListener('resize', handleResize);
    cleanup();
  };
}

/**
 * Automatically updates the position of the floating element when necessary.
 * Should only be called when the floating element is mounted on the DOM or
 * visible on the screen.
 * @returns cleanup function that should be invoked when the floating element is
 * removed from the DOM or hidden from the screen.
 * @see https://floating-ui.com/docs/autoUpdate
 */
function autoUpdate(reference, floating, update, options) {
  if (options === void 0) {
    options = {};
  }
  const {
    ancestorScroll = true,
    ancestorResize = true,
    elementResize = typeof ResizeObserver === 'function',
    layoutShift = typeof IntersectionObserver === 'function',
    animationFrame = false
  } = options;
  const referenceEl = unwrapElement(reference);
  const ancestors = ancestorScroll || ancestorResize ? [...(referenceEl ? (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getOverflowAncestors)(referenceEl) : []), ...(floating ? (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getOverflowAncestors)(floating) : [])] : [];
  ancestors.forEach(ancestor => {
    ancestorScroll && ancestor.addEventListener('scroll', update);
    ancestorResize && ancestor.addEventListener('resize', update);
  });
  const cleanupIo = referenceEl && layoutShift ? observeMove(referenceEl, update, ancestorResize) : null;
  let reobserveFrame = -1;
  let resizeObserver = null;
  if (elementResize) {
    resizeObserver = new ResizeObserver(_ref => {
      let [firstEntry] = _ref;
      if (firstEntry && firstEntry.target === referenceEl && resizeObserver && floating) {
        // Prevent update loops when using the `size` middleware.
        // https://github.com/floating-ui/floating-ui/issues/1740
        resizeObserver.unobserve(floating);
        cancelAnimationFrame(reobserveFrame);
        reobserveFrame = requestAnimationFrame(() => {
          var _resizeObserver;
          (_resizeObserver = resizeObserver) == null || _resizeObserver.observe(floating);
        });
      }
      update();
    });
    if (referenceEl && !animationFrame) {
      resizeObserver.observe(referenceEl);
    }
    if (floating) {
      resizeObserver.observe(floating);
    }
  }
  let frameId;
  let prevRefRect = animationFrame ? getBoundingClientRect(reference) : null;
  if (animationFrame) {
    frameLoop();
  }
  function frameLoop() {
    const nextRefRect = getBoundingClientRect(reference);
    if (prevRefRect && !rectsAreEqual(prevRefRect, nextRefRect)) {
      update();
    }
    prevRefRect = nextRefRect;
    frameId = requestAnimationFrame(frameLoop);
  }
  update();
  return () => {
    var _resizeObserver2;
    ancestors.forEach(ancestor => {
      ancestorScroll && ancestor.removeEventListener('scroll', update);
      ancestorResize && ancestor.removeEventListener('resize', update);
    });
    cleanupIo == null || cleanupIo();
    (_resizeObserver2 = resizeObserver) == null || _resizeObserver2.disconnect();
    resizeObserver = null;
    if (animationFrame) {
      cancelAnimationFrame(frameId);
    }
  };
}

/**
 * Resolves with an object of overflow side offsets that determine how much the
 * element is overflowing a given clipping boundary on each side.
 * - positive = overflowing the boundary by that number of pixels
 * - negative = how many pixels left before it will overflow
 * - 0 = lies flush with the boundary
 * @see https://floating-ui.com/docs/detectOverflow
 */
const detectOverflow = _floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.detectOverflow;

/**
 * Modifies the placement by translating the floating element along the
 * specified axes.
 * A number (shorthand for `mainAxis` or distance), or an axes configuration
 * object may be passed.
 * @see https://floating-ui.com/docs/offset
 */
const offset = _floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.offset;

/**
 * Optimizes the visibility of the floating element by choosing the placement
 * that has the most space available automatically, without needing to specify a
 * preferred placement. Alternative to `flip`.
 * @see https://floating-ui.com/docs/autoPlacement
 */
const autoPlacement = _floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.autoPlacement;

/**
 * Optimizes the visibility of the floating element by shifting it in order to
 * keep it in view when it will overflow the clipping boundary.
 * @see https://floating-ui.com/docs/shift
 */
const shift = _floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.shift;

/**
 * Optimizes the visibility of the floating element by flipping the `placement`
 * in order to keep it in view when the preferred placement(s) will overflow the
 * clipping boundary. Alternative to `autoPlacement`.
 * @see https://floating-ui.com/docs/flip
 */
const flip = _floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.flip;

/**
 * Provides data that allows you to change the size of the floating element —
 * for instance, prevent it from overflowing the clipping boundary or match the
 * width of the reference element.
 * @see https://floating-ui.com/docs/size
 */
const size = _floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.size;

/**
 * Provides data to hide the floating element in applicable situations, such as
 * when it is not in the same clipping context as the reference element.
 * @see https://floating-ui.com/docs/hide
 */
const hide = _floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.hide;

/**
 * Provides data to position an inner element of the floating element so that it
 * appears centered to the reference element.
 * @see https://floating-ui.com/docs/arrow
 */
const arrow = _floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.arrow;

/**
 * Provides improved positioning for inline reference elements that can span
 * over multiple lines, such as hyperlinks or range selections.
 * @see https://floating-ui.com/docs/inline
 */
const inline = _floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.inline;

/**
 * Built-in `limiter` that will stop `shift()` at a certain point.
 */
const limitShift = _floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.limitShift;

/**
 * Computes the `x` and `y` coordinates that will place the floating element
 * next to a given reference element.
 */
const computePosition = (reference, floating, options) => {
  // This caches the expensive `getClippingElementAncestors` function so that
  // multiple lifecycle resets re-use the same result. It only lives for a
  // single call. If other functions become expensive, we can add them as well.
  const cache = new Map();
  const mergedOptions = options != null ? options : {};
  const platformWithCache = {
    ...platform,
    ...mergedOptions.platform,
    _c: cache
  };
  return (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.computePosition)(reference, floating, {
    ...mergedOptions,
    platform: platformWithCache
  });
};




/***/ },

/***/ "d7f28916ed76"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getComputedStyle: () => (/* binding */ getComputedStyle),
/* harmony export */   getContainingBlock: () => (/* binding */ getContainingBlock),
/* harmony export */   getDocumentElement: () => (/* binding */ getDocumentElement),
/* harmony export */   getFrameElement: () => (/* binding */ getFrameElement),
/* harmony export */   getNearestOverflowAncestor: () => (/* binding */ getNearestOverflowAncestor),
/* harmony export */   getNodeName: () => (/* binding */ getNodeName),
/* harmony export */   getNodeScroll: () => (/* binding */ getNodeScroll),
/* harmony export */   getOverflowAncestors: () => (/* binding */ getOverflowAncestors),
/* harmony export */   getParentNode: () => (/* binding */ getParentNode),
/* harmony export */   getWindow: () => (/* binding */ getWindow),
/* harmony export */   isContainingBlock: () => (/* binding */ isContainingBlock),
/* harmony export */   isElement: () => (/* binding */ isElement),
/* harmony export */   isHTMLElement: () => (/* binding */ isHTMLElement),
/* harmony export */   isLastTraversableNode: () => (/* binding */ isLastTraversableNode),
/* harmony export */   isNode: () => (/* binding */ isNode),
/* harmony export */   isOverflowElement: () => (/* binding */ isOverflowElement),
/* harmony export */   isShadowRoot: () => (/* binding */ isShadowRoot),
/* harmony export */   isTableElement: () => (/* binding */ isTableElement),
/* harmony export */   isTopLayer: () => (/* binding */ isTopLayer),
/* harmony export */   isWebKit: () => (/* binding */ isWebKit)
/* harmony export */ });
function hasWindow() {
  return typeof window !== 'undefined';
}
function getNodeName(node) {
  if (isNode(node)) {
    return (node.nodeName || '').toLowerCase();
  }
  // Mocked nodes in testing environments may not be instances of Node. By
  // returning `#document` an infinite loop won't occur.
  // https://github.com/floating-ui/floating-ui/issues/2317
  return '#document';
}
function getWindow(node) {
  var _node$ownerDocument;
  return (node == null || (_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.defaultView) || window;
}
function getDocumentElement(node) {
  var _ref;
  return (_ref = (isNode(node) ? node.ownerDocument : node.document) || window.document) == null ? void 0 : _ref.documentElement;
}
function isNode(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof Node || value instanceof getWindow(value).Node;
}
function isElement(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof Element || value instanceof getWindow(value).Element;
}
function isHTMLElement(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof HTMLElement || value instanceof getWindow(value).HTMLElement;
}
function isShadowRoot(value) {
  if (!hasWindow() || typeof ShadowRoot === 'undefined') {
    return false;
  }
  return value instanceof ShadowRoot || value instanceof getWindow(value).ShadowRoot;
}
function isOverflowElement(element) {
  const {
    overflow,
    overflowX,
    overflowY,
    display
  } = getComputedStyle(element);
  return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && display !== 'inline' && display !== 'contents';
}
function isTableElement(element) {
  return /^(table|td|th)$/.test(getNodeName(element));
}
function isTopLayer(element) {
  try {
    if (element.matches(':popover-open')) {
      return true;
    }
  } catch (_e) {
    // no-op
  }
  try {
    return element.matches(':modal');
  } catch (_e) {
    return false;
  }
}
const willChangeRe = /transform|translate|scale|rotate|perspective|filter/;
const containRe = /paint|layout|strict|content/;
const isNotNone = value => !!value && value !== 'none';
let isWebKitValue;
function isContainingBlock(elementOrCss) {
  const css = isElement(elementOrCss) ? getComputedStyle(elementOrCss) : elementOrCss;

  // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block
  // https://drafts.csswg.org/css-transforms-2/#individual-transforms
  return isNotNone(css.transform) || isNotNone(css.translate) || isNotNone(css.scale) || isNotNone(css.rotate) || isNotNone(css.perspective) || !isWebKit() && (isNotNone(css.backdropFilter) || isNotNone(css.filter)) || willChangeRe.test(css.willChange || '') || containRe.test(css.contain || '');
}
function getContainingBlock(element) {
  let currentNode = getParentNode(element);
  while (isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)) {
    if (isContainingBlock(currentNode)) {
      return currentNode;
    } else if (isTopLayer(currentNode)) {
      return null;
    }
    currentNode = getParentNode(currentNode);
  }
  return null;
}
function isWebKit() {
  if (isWebKitValue == null) {
    isWebKitValue = typeof CSS !== 'undefined' && CSS.supports && CSS.supports('-webkit-backdrop-filter', 'none');
  }
  return isWebKitValue;
}
function isLastTraversableNode(node) {
  return /^(html|body|#document)$/.test(getNodeName(node));
}
function getComputedStyle(element) {
  return getWindow(element).getComputedStyle(element);
}
function getNodeScroll(element) {
  if (isElement(element)) {
    return {
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop
    };
  }
  return {
    scrollLeft: element.scrollX,
    scrollTop: element.scrollY
  };
}
function getParentNode(node) {
  if (getNodeName(node) === 'html') {
    return node;
  }
  const result =
  // Step into the shadow DOM of the parent of a slotted node.
  node.assignedSlot ||
  // DOM Element detected.
  node.parentNode ||
  // ShadowRoot detected.
  isShadowRoot(node) && node.host ||
  // Fallback.
  getDocumentElement(node);
  return isShadowRoot(result) ? result.host : result;
}
function getNearestOverflowAncestor(node) {
  const parentNode = getParentNode(node);
  if (isLastTraversableNode(parentNode)) {
    return (node.ownerDocument || node).body;
  }
  if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) {
    return parentNode;
  }
  return getNearestOverflowAncestor(parentNode);
}
function getOverflowAncestors(node, list, traverseIframes) {
  var _node$ownerDocument2;
  if (list === void 0) {
    list = [];
  }
  if (traverseIframes === void 0) {
    traverseIframes = true;
  }
  const scrollableAncestor = getNearestOverflowAncestor(node);
  const isBody = scrollableAncestor === ((_node$ownerDocument2 = node.ownerDocument) == null ? void 0 : _node$ownerDocument2.body);
  const win = getWindow(scrollableAncestor);
  if (isBody) {
    const frameElement = getFrameElement(win);
    return list.concat(win, win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : [], frameElement && traverseIframes ? getOverflowAncestors(frameElement) : []);
  } else {
    return list.concat(scrollableAncestor, getOverflowAncestors(scrollableAncestor, [], traverseIframes));
  }
}
function getFrameElement(win) {
  return win.parent && Object.getPrototypeOf(win.parent) ? win.frameElement : null;
}




/***/ },

/***/ "56345afd9e11"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   alignments: () => (/* binding */ alignments),
/* harmony export */   clamp: () => (/* binding */ clamp),
/* harmony export */   createCoords: () => (/* binding */ createCoords),
/* harmony export */   evaluate: () => (/* binding */ evaluate),
/* harmony export */   expandPaddingObject: () => (/* binding */ expandPaddingObject),
/* harmony export */   floor: () => (/* binding */ floor),
/* harmony export */   getAlignment: () => (/* binding */ getAlignment),
/* harmony export */   getAlignmentAxis: () => (/* binding */ getAlignmentAxis),
/* harmony export */   getAlignmentSides: () => (/* binding */ getAlignmentSides),
/* harmony export */   getAxisLength: () => (/* binding */ getAxisLength),
/* harmony export */   getExpandedPlacements: () => (/* binding */ getExpandedPlacements),
/* harmony export */   getOppositeAlignmentPlacement: () => (/* binding */ getOppositeAlignmentPlacement),
/* harmony export */   getOppositeAxis: () => (/* binding */ getOppositeAxis),
/* harmony export */   getOppositeAxisPlacements: () => (/* binding */ getOppositeAxisPlacements),
/* harmony export */   getOppositePlacement: () => (/* binding */ getOppositePlacement),
/* harmony export */   getPaddingObject: () => (/* binding */ getPaddingObject),
/* harmony export */   getSide: () => (/* binding */ getSide),
/* harmony export */   getSideAxis: () => (/* binding */ getSideAxis),
/* harmony export */   max: () => (/* binding */ max),
/* harmony export */   min: () => (/* binding */ min),
/* harmony export */   placements: () => (/* binding */ placements),
/* harmony export */   rectToClientRect: () => (/* binding */ rectToClientRect),
/* harmony export */   round: () => (/* binding */ round),
/* harmony export */   sides: () => (/* binding */ sides)
/* harmony export */ });
/**
 * Custom positioning reference element.
 * @see https://floating-ui.com/docs/virtual-elements
 */

const sides = ['top', 'right', 'bottom', 'left'];
const alignments = ['start', 'end'];
const placements = /*#__PURE__*/sides.reduce((acc, side) => acc.concat(side, side + "-" + alignments[0], side + "-" + alignments[1]), []);
const min = Math.min;
const max = Math.max;
const round = Math.round;
const floor = Math.floor;
const createCoords = v => ({
  x: v,
  y: v
});
const oppositeSideMap = {
  left: 'right',
  right: 'left',
  bottom: 'top',
  top: 'bottom'
};
function clamp(start, value, end) {
  return max(start, min(value, end));
}
function evaluate(value, param) {
  return typeof value === 'function' ? value(param) : value;
}
function getSide(placement) {
  return placement.split('-')[0];
}
function getAlignment(placement) {
  return placement.split('-')[1];
}
function getOppositeAxis(axis) {
  return axis === 'x' ? 'y' : 'x';
}
function getAxisLength(axis) {
  return axis === 'y' ? 'height' : 'width';
}
function getSideAxis(placement) {
  const firstChar = placement[0];
  return firstChar === 't' || firstChar === 'b' ? 'y' : 'x';
}
function getAlignmentAxis(placement) {
  return getOppositeAxis(getSideAxis(placement));
}
function getAlignmentSides(placement, rects, rtl) {
  if (rtl === void 0) {
    rtl = false;
  }
  const alignment = getAlignment(placement);
  const alignmentAxis = getAlignmentAxis(placement);
  const length = getAxisLength(alignmentAxis);
  let mainAlignmentSide = alignmentAxis === 'x' ? alignment === (rtl ? 'end' : 'start') ? 'right' : 'left' : alignment === 'start' ? 'bottom' : 'top';
  if (rects.reference[length] > rects.floating[length]) {
    mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
  }
  return [mainAlignmentSide, getOppositePlacement(mainAlignmentSide)];
}
function getExpandedPlacements(placement) {
  const oppositePlacement = getOppositePlacement(placement);
  return [getOppositeAlignmentPlacement(placement), oppositePlacement, getOppositeAlignmentPlacement(oppositePlacement)];
}
function getOppositeAlignmentPlacement(placement) {
  return placement.includes('start') ? placement.replace('start', 'end') : placement.replace('end', 'start');
}
const lrPlacement = ['left', 'right'];
const rlPlacement = ['right', 'left'];
const tbPlacement = ['top', 'bottom'];
const btPlacement = ['bottom', 'top'];
function getSideList(side, isStart, rtl) {
  switch (side) {
    case 'top':
    case 'bottom':
      if (rtl) return isStart ? rlPlacement : lrPlacement;
      return isStart ? lrPlacement : rlPlacement;
    case 'left':
    case 'right':
      return isStart ? tbPlacement : btPlacement;
    default:
      return [];
  }
}
function getOppositeAxisPlacements(placement, flipAlignment, direction, rtl) {
  const alignment = getAlignment(placement);
  let list = getSideList(getSide(placement), direction === 'start', rtl);
  if (alignment) {
    list = list.map(side => side + "-" + alignment);
    if (flipAlignment) {
      list = list.concat(list.map(getOppositeAlignmentPlacement));
    }
  }
  return list;
}
function getOppositePlacement(placement) {
  const side = getSide(placement);
  return oppositeSideMap[side] + placement.slice(side.length);
}
function expandPaddingObject(padding) {
  var _padding$top, _padding$right, _padding$bottom, _padding$left;
  return {
    top: (_padding$top = padding.top) != null ? _padding$top : 0,
    right: (_padding$right = padding.right) != null ? _padding$right : 0,
    bottom: (_padding$bottom = padding.bottom) != null ? _padding$bottom : 0,
    left: (_padding$left = padding.left) != null ? _padding$left : 0
  };
}
function getPaddingObject(padding) {
  return typeof padding !== 'number' ? expandPaddingObject(padding) : {
    top: padding,
    right: padding,
    bottom: padding,
    left: padding
  };
}
function rectToClientRect(rect) {
  const {
    x,
    y,
    width,
    height
  } = rect;
  return {
    width,
    height,
    top: y,
    left: x,
    right: x + width,
    bottom: y + height,
    x,
    y
  };
}




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

/***/ "eff145474937"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   keyed: () => (/* binding */ i)
/* harmony export */ });
/* harmony import */ var _lit_html_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("f550d360fd36");
/* harmony import */ var _directive_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("0e2a9b296d0b");
/* harmony import */ var _directive_helpers_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("a5a956c9f619");

/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const i=(0,_directive_js__WEBPACK_IMPORTED_MODULE_1__.directive)(class extends _directive_js__WEBPACK_IMPORTED_MODULE_1__.Directive{constructor(){super(...arguments),this.key=_lit_html_js__WEBPACK_IMPORTED_MODULE_0__.nothing}render(r,t){return this.key=r,t}update(r,[t,e]){return t!==this.key&&((0,_directive_helpers_js__WEBPACK_IMPORTED_MODULE_2__.setCommittedValue)(r),this.key=t),e}});
//# sourceMappingURL=keyed.js.map


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

/***/ "23fcd3fd7fc2"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TemplateResultType: () => (/* reexport safe */ lit_html_directive_helpers_js__WEBPACK_IMPORTED_MODULE_0__.TemplateResultType),
/* harmony export */   clearPart: () => (/* reexport safe */ lit_html_directive_helpers_js__WEBPACK_IMPORTED_MODULE_0__.clearPart),
/* harmony export */   getCommittedValue: () => (/* reexport safe */ lit_html_directive_helpers_js__WEBPACK_IMPORTED_MODULE_0__.getCommittedValue),
/* harmony export */   getDirectiveClass: () => (/* reexport safe */ lit_html_directive_helpers_js__WEBPACK_IMPORTED_MODULE_0__.getDirectiveClass),
/* harmony export */   insertPart: () => (/* reexport safe */ lit_html_directive_helpers_js__WEBPACK_IMPORTED_MODULE_0__.insertPart),
/* harmony export */   isCompiledTemplateResult: () => (/* reexport safe */ lit_html_directive_helpers_js__WEBPACK_IMPORTED_MODULE_0__.isCompiledTemplateResult),
/* harmony export */   isDirectiveResult: () => (/* reexport safe */ lit_html_directive_helpers_js__WEBPACK_IMPORTED_MODULE_0__.isDirectiveResult),
/* harmony export */   isPrimitive: () => (/* reexport safe */ lit_html_directive_helpers_js__WEBPACK_IMPORTED_MODULE_0__.isPrimitive),
/* harmony export */   isSingleExpression: () => (/* reexport safe */ lit_html_directive_helpers_js__WEBPACK_IMPORTED_MODULE_0__.isSingleExpression),
/* harmony export */   isTemplateResult: () => (/* reexport safe */ lit_html_directive_helpers_js__WEBPACK_IMPORTED_MODULE_0__.isTemplateResult),
/* harmony export */   removePart: () => (/* reexport safe */ lit_html_directive_helpers_js__WEBPACK_IMPORTED_MODULE_0__.removePart),
/* harmony export */   setChildPartValue: () => (/* reexport safe */ lit_html_directive_helpers_js__WEBPACK_IMPORTED_MODULE_0__.setChildPartValue),
/* harmony export */   setCommittedValue: () => (/* reexport safe */ lit_html_directive_helpers_js__WEBPACK_IMPORTED_MODULE_0__.setCommittedValue)
/* harmony export */ });
/* harmony import */ var lit_html_directive_helpers_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("a5a956c9f619");

//# sourceMappingURL=directive-helpers.js.map


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

/***/ "707122d76f9d"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   keyed: () => (/* reexport safe */ lit_html_directives_keyed_js__WEBPACK_IMPORTED_MODULE_0__.keyed)
/* harmony export */ });
/* harmony import */ var lit_html_directives_keyed_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("eff145474937");

//# sourceMappingURL=keyed.js.map


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
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("0845ef25b9de");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("b53fd744fdaf");
/* harmony import */ var _js_option_badge_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("aaa5e760767f");
/* harmony import */ var _field_renderers_index_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("e5483002f3ea");
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("fef8077ac919");
/* harmony import */ var lit_directives_ref_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("7fcbcc00731e");
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("8489d1f5bab4");
/* harmony import */ var _helpers_dom__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("926043d18700");
/* harmony import */ var _helpers_draggable__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("2d094259808e");
/* harmony import */ var _helpers_loaderDragState__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("870b5dfddc25");
/* harmony import */ var _core_js_position_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("2e9112dbdda9");










 // Sized for what they hold rather than for reading, so they take no floor.
// Every word this table says, in the two languages the Framework speaks. The
// rule is the shared one -- `pageText` reads the nearest [lang] and falls back
// to the document's -- and it is here because the table said only Russian: on
// an English page the list's toolbar read «Фильтр» and «Создать» beside a
// record panel that had switched, which is the sort of thing only a language
// switch in an admin shows (owner, 2026-10-10).
//
// An attribute still wins over both: a consumer who names a word names it.

const TABLE_TEXT = {
  en: {
    filterText: "Filter",
    clearText: "Clear",
    searchPlaceholder: "Search",
    createText: "Create",
    pinColumnLabel: "Pin the column",
    unpinColumnLabel: "Unpin the column",
    loadingText: "Loading",
    emptyText: "No data",
    errorText: "The data could not be loaded",
    retryText: "Try again",
    columnMoveLabel: "Move the column",
    filterApplyText: "Apply the filter",
    columnSearchPlaceholder: "Search the fields",
    columnSearchEmptyText: "No field matches",
    editActionText: "Edit",
    viewActionText: "View",
    deleteActionText: "Delete",
    actionsColumnLabel: "Actions",
    settingsColumnLabel: "Settings",
    selectAllLabel: "Select every row",
    defaultTemplateText: "Default",
    fieldsTabText: "Fields",
    templatesTabText: "Templates",
    saveTemplateLabel: "Save the filter as a template",
    filterSettingsLabel: "Filter settings",
    fieldWordText: "field",
    rowActionsLabel: "Row actions",
    createOptionsLabel: "Ways to create",
    resetText: "Reset",
    contextSaveTemplateLabel: "Saving the filter as a template",
    contextFilterSettingsLabel: "Filter settings",
    contextFieldFilterLabel: "Filtering by",
    contextRowActionsLabel: "Row actions",
    contextCreateOptionsLabel: "Ways to create",
    contextViewActionsLabel: "View actions",
    contextTableSettingsLabel: "Table settings",
    templateNamePlaceholder: "Name",
    makeDefaultLabel: "Make it the default",
    saveForEveryoneLabel: "Save for everyone",
    applyText: "Apply",
    renameText: "Rename",
    restoreText: "Restore",
    selectRowLabel: "Select the row",
    menuLabel: "Menu",
    contextTemplateActionsLabel: "Template actions",
    operatorEq: "Exactly",
    operatorGt: "Greater than",
    operatorGte: "Greater or equal",
    operatorLt: "Less than",
    operatorLte: "Less or equal",
    operatorBetween: "Range",
    operatorContains: "Contains",
    operatorStartsWith: "Starts with",
    operatorAny: "Any date",
    operatorToday: "Today",
    operatorWeek: "This week",
    operatorMonth: "This month",
    operatorIn: "In the list"
  },
  ru: {
    filterText: "Фильтр",
    clearText: "Очистить",
    searchPlaceholder: "Поиск",
    createText: "Создать",
    pinColumnLabel: "Закрепить столбец",
    unpinColumnLabel: "Открепить столбец",
    loadingText: "Загрузка данных",
    emptyText: "Нет данных",
    errorText: "Не удалось загрузить данные",
    retryText: "Повторить",
    columnMoveLabel: "Переместить столбец",
    filterApplyText: "Применить фильтр",
    columnSearchPlaceholder: "Поиск по полям",
    columnSearchEmptyText: "Поля не найдены",
    editActionText: "Редактировать",
    viewActionText: "Посмотреть",
    deleteActionText: "Удалить",
    actionsColumnLabel: "Действия",
    settingsColumnLabel: "Настройки",
    selectAllLabel: "Выбрать все строки",
    defaultTemplateText: "По умолчанию",
    fieldsTabText: "Поля",
    templatesTabText: "Шаблоны",
    saveTemplateLabel: "Сохранение шаблона фильтра",
    filterSettingsLabel: "Настройки фильтра",
    fieldWordText: "поле",
    rowActionsLabel: "Действия со строкой",
    createOptionsLabel: "Варианты создания",
    resetText: "Сбросить",
    contextSaveTemplateLabel: "Сохранение шаблона фильтра",
    contextFilterSettingsLabel: "Настройки фильтра",
    contextFieldFilterLabel: "Настройка фильтра",
    contextRowActionsLabel: "Действия со строкой",
    contextCreateOptionsLabel: "Варианты создания",
    contextViewActionsLabel: "Действия с представлением",
    contextTableSettingsLabel: "Настройки таблицы",
    templateNamePlaceholder: "Название",
    makeDefaultLabel: "Сделать по умолчанию",
    saveForEveryoneLabel: "Сохранить для всех",
    applyText: "Применить",
    renameText: "Переименовать",
    restoreText: "Восстановить",
    selectRowLabel: "Выбрать строку",
    menuLabel: "Меню",
    contextTemplateActionsLabel: "Действия с шаблоном",
    operatorEq: "Точно",
    operatorGt: "Больше чем",
    operatorGte: "Больше или равно",
    operatorLt: "Меньше чем",
    operatorLte: "Меньше или равно",
    operatorBetween: "Диапазон",
    operatorContains: "Содержит",
    operatorStartsWith: "Начинается с",
    operatorAny: "Любая дата",
    operatorToday: "Сегодня",
    operatorWeek: "Неделя",
    operatorMonth: "Месяц",
    operatorIn: "В списке"
  }
};
const SYSTEM_COLUMN_KEYS = new Set(["select", "settings", "actions"]);

const positioning = () => globalThis.SF?.Position || _core_js_position_js__WEBPACK_IMPORTED_MODULE_10__["default"]; // Published Composition ports (simai.composition.port-manifest.v1, sf-table@1.0.0).


const SF_TABLE_PORTS = Object.freeze({
  outputs: Object.freeze({
    selection: "record-ids.v1"
  }),
  inputs: Object.freeze({
    context: "record-ids.v1"
  })
});
const MAX_PORT_RECORD_IDS = 1000;

function hasControlCharacter(value) {
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index);
    if (code < 32 || code === 127) return true;
  }

  return false;
}

function checkedRecordIds(value) {
  if (!Array.isArray(value) || value.length > MAX_PORT_RECORD_IDS || Array.from(value).some(id => !(typeof id === "string" && id.length > 0 && id.length <= 256 && !hasControlCharacter(id) || Number.isSafeInteger(id))) || new Set(Array.from(value, id => `${typeof id}:${id}`)).size !== value.length) {
    throw new TypeError("Record identities must be unique nonempty strings or safe integers");
  }

  return Object.freeze([...value]);
} // Two tables on one page share nothing: ids, the settings key fallback and the
// portal are all derived from this counter, never from the component name.


let tableInstances = 0;

class SfTable extends _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__["default"] {
  static get sfPorts() {
    return SF_TABLE_PORTS;
  }

  static get props() {
    return {
      templateName: {
        attribute: "template",
        default: "default"
      },
      ariaLabel: {
        attribute: "aria-label",
        default: "Data table"
      },
      selectable: {
        type: Boolean,
        default: true
      },
      // Who owns the vertical scroll. `self` keeps the rows in their own
      // scroll area, which is what a host that bounds the table's height
      // wants and what every page has had so far. `page` gives the
      // vertical scroll to the document, so the head stays visible while
      // the page scrolls; the rows then scroll sideways only.
      verticalScroll: {
        attribute: 'vertical-scroll',
        default: 'self',
        values: ['self', 'page']
      },
      toolbar: {
        type: Boolean,
        default: true
      },
      settings: {
        type: Boolean,
        default: true
      },
      pagin: {
        type: Boolean,
        default: false
      },
      actions: {
        type: Boolean,
        default: true
      },
      // The row action column alone; the create button still follows actions.
      rowActions: {
        attribute: "row-actions",
        type: Boolean,
        default: true
      },
      filterText: {
        attribute: "filter-text",
        default: "Filter"
      },
      clearText: {
        attribute: "clear-text",
        default: "Clear"
      },
      searchPlaceholder: {
        attribute: "search-placeholder",
        default: "Search"
      },
      createText: {
        attribute: "create-text",
        default: "Create"
      },
      pinColumnLabel: {
        attribute: "pin-column-label",
        default: "Pin the column"
      },
      unpinColumnLabel: {
        attribute: "unpin-column-label",
        default: "Unpin the column"
      },
      paginationTotal: {
        attribute: "pagination-total",
        type: Number,
        default: 10
      },
      paginationPageSize: {
        attribute: "pagination-page-size",
        type: Number,
        default: 10
      },
      pageSizes: {
        attribute: "page-sizes",
        default: "10,20,30,40"
      },
      contextMenuColumns: {
        attribute: "context-menu-columns",
        type: Number,
        // One, because one is what every table has drawn since this input
        // existed: the read was bare, so neither the declared 2 nor a value
        // a host passed ever reached the menu, which fell to `?? 1`. The
        // getter below makes the input work for the first time, and the
        // default is set to the shipped behaviour so that making it work
        // changes nothing for anyone who does not ask.
        default: 1
      },
      tableSettingsKey: {
        attribute: "table-settings-key",
        // Empty, because the effective default was never a string at all:
        // the bare read fell through to the attribute, then the element's
        // id, then its instance id, so every table had its own key. The
        // declaration said "users" and the manifest said
        // "admin.collection" -- two different untruths about the same
        // input. Either one, read properly, would have made every table on
        // a page share one settings key and overwrite the others.
        default: ""
      },
      dataState: {
        attribute: "data-state",
        default: "auto",
        values: ["auto", "loading", "populated", "empty", "error"]
      },
      loadingText: {
        attribute: "loading-text",
        default: "Loading"
      },
      emptyText: {
        attribute: "empty-text",
        default: "No data"
      },
      errorText: {
        attribute: "error-text",
        default: "The data could not be loaded"
      },
      retryText: {
        attribute: "retry-text",
        default: "Try again"
      },
      columnMoveLabel: {
        attribute: "column-move-label",
        default: "Move the column"
      },
      filterApplyText: {
        attribute: "filter-apply-text",
        default: "Apply the filter"
      },
      columnSearchPlaceholder: {
        attribute: "column-search-placeholder",
        default: "Search the fields"
      },
      columnSearchEmptyText: {
        attribute: "column-search-empty-text",
        default: "No field matches"
      }
    };
  } // The manifest's declared defaults for these two were fixed in the same
  // commit as these getters and then lost: a rebase replayed a hand-picked list
  // of source files and classified smart.manifest.json as regenerable, which is
  // true of its provenance and false of its declarations. Two pairs shipped with
  // the getters resolving one thing and the manifest declaring another. The
  // other Framework session's defaults contract -- the manifest default against
  // the value a component resolves with no attribute set -- is what catches this
  // class, and it would have caught it here.
  // Declaring a prop creates no accessor in this Framework. These two were read
  // off `this` and were undefined, which the other Framework session's new
  // contract now names. Each is written so that reading it properly preserves
  // the behaviour that shipped, rather than applying a default that never
  // applied.


  get contextMenuColumns() {
    const declared = this.getNumberAttr?.("context-menu-columns", 1) ?? 1;
    return Number.isFinite(declared) && declared > 0 ? declared : 1;
  }

  get tableSettingsKey() {
    return this.getAttribute?.("table-settings-key") || "";
  }

  constructor() {
    super();
    this._portalContainer = null;
    this._instanceId = `sf-table-${++tableInstances}`;
    this._selectionPortKey = "[]";
    this._routeContext = null;
    this._querySequence = 0;
    this._pendingQuerySequence = null;
    this._abandonedQuery = false;
    this._filterOptionPages = new Map();
    this._contextViewportBound = false;
    this._filterTemplateDragCleanups = [];
    this._columnSettingsDragCleanups = [];
    this.contextKeyEvent = this.contextKeyEvent.bind(this);
    this.contextViewportEvent = this.contextViewportEvent.bind(this);
    this.ACTIONS_SETTINGS_ROW = [{
      name: this.text('editActionText'),
      id: 'edit',
      component: {
        type: 'icon-button',
        props: {
          variant: 'icon',
          size: '1',
          type: 'link',
          scheme: 'on-surface',
          icon: 'edit',
          ariaLabel: this.text('editActionText'),
          value: 'edit'
        }
      }
    }, {
      name: this.text('viewActionText'),
      id: 'view',
      component: {
        type: 'icon-button',
        props: {
          variant: 'icon',
          size: '1',
          type: 'link',
          scheme: 'on-surface',
          icon: 'visibility',
          ariaLabel: this.text('viewActionText'),
          value: 'view'
        }
      }
    }, {
      name: this.text('deleteActionText'),
      id: 'delete',
      component: {
        type: 'icon-button',
        props: {
          variant: 'icon',
          size: '1',
          type: 'link',
          scheme: 'on-surface',
          icon: 'delete',
          ariaLabel: this.text('deleteActionText'),
          value: 'delete'
        }
      }
    }]; // Row actions are a system column like select and settings: always last,
    // not resizable or draggable, and never part of saved column settings.

    this.TABLE_ACTIONS_COLUMN = {
      key: "actions",
      label: this.text("actionsColumnLabel"),
      system: true
    };
    this.TABLE_SETTINGS_COLUMN = {
      key: "settings",
      label: "settings",
      system: true,
      width: 'calc(var(--sf-text-height-1) + (var(--sf-ui-1--space-y-tightness-default) * 2) + var(--sf-b6))',
      component: {
        type: "icon-button",
        props: {
          size: "1",
          type: "link",
          scheme: "on-surface",
          icon: "settings",
          ariaLabel: this.text("settingsColumnLabel"),
          value: "settings",
          '@click': e => {
            this.openContextMenu(e, {
              menu: 'table-settings'
            });
          }
        }
      }
    };
    this.contextEvent = this.contextEvent.bind(this);
    this.hoverEvents = this.hoverEvents.bind(this);
    this.outEvent = this.outEvent.bind(this);
    this.onColumnResizePointerDown = this.onColumnResizePointerDown.bind(this);
    this.onColumnResizePointerMove = this.onColumnResizePointerMove.bind(this);
    this.onColumnResizePointerUp = this.onColumnResizePointerUp.bind(this);
    this.onColumnDragPointerDown = this.onColumnDragPointerDown.bind(this);
    this.onColumnDragPointerMove = this.onColumnDragPointerMove.bind(this);
    this.onColumnDragPointerUp = this.onColumnDragPointerUp.bind(this);
    this.onColumnDragPointerCancel = this.onColumnDragPointerCancel.bind(this);
    this._contextEventBound = false;
    this._hoverEventBound = false;
    this._columnResizeEventBound = false;
    this._columnDragEventBound = false;
    this._columnResizeState = null;
    this._columnDragState = null;
    this._columnAnimationToken = 0;
    this.searchChange = this.scheduleSearchChange.bind(this);
    this._searchDebounceTimer = null;
    this._searchPendingProps = null;
    this._searchHoldKey = '';
    this.refs = {
      contextMenu: this.createRef(),
      items: new Map(),
      templateForm: this.createRef(),
      renameInput: this.createRef(),
      table: this.createRef(),
      scroll: this.createRef(),
      resizeGuide: this.createRef()
    };
    this._currentRowId = null;
    this._checkboxMeasureToken = 0;
    this._responsiveWidth = 0;
    this._responsiveObserver = null;
    this._filterTemplatesLoaded = false;
    this.tempSettings = null;
    this.state = {
      settingsChecked: false,
      bulkActions: [],
      createItems: [],
      // What the toolbar's own control offers, straight from the host.
      toolbarActions: [],
      // What is typed over the list of fields in the column settings.
      columnSettingsQuery: "",
      sort: {
        key: null,
        direction: null
      },
      saveInputValue: '',
      search: {
        searchActive: false,
        value: ''
      },
      contextMenu: {
        open: false
      },
      actions: this.getActions().map(action => Object.assign(action, {
        visible: true
      })),
      actionActive: this.getProp('actions'),
      columnSettings: {},
      selectIndeterminate: false,
      filterDataDirty: false,
      filter: {
        selectedTemplateKey: 'default',
        fields: [],
        templates: [],
        edit: {
          rename: ''
        }
      }
    };
    this.TABLE_SELECT_COLUMN = {
      key: "select",
      label: "select",
      system: true,
      width: 'calc(var(--sf-text-height-1) + var(--sf-b6) + calc(var(--sf-px) * 2))',
      component: {
        type: "checkbox",
        props: {
          position: 'end',
          rootClass: 'content-main-between',
          size: 1,
          '@change': event => {
            const checked = Boolean(event.target.checked); // Marking the page leaves no single row as the anchor a
            // later Shift-click could extend from, so it is dropped
            // rather than left pointing at whatever was clicked last.

            this._selectionAnchorId = null;
            this.set({
              selectIndeterminate: false,
              settingsChecked: checked
            });
            this.updateRows(row => ({ ...row,
              select: this.getDefaultRowCell(this.TABLE_SELECT_COLUMN, { ...row,
                selected: checked,
                checked
              })
            }), "select-all");
          },
          indeterminate: this.state.selectIndeterminate,
          checked: this.state.settingsChecked,
          ariaLabel: this.text("selectAllLabel")
        }
      },
      rowComponent: {
        type: "checkbox",
        props: {
          position: 'end',
          rootClass: 'content-main-between',
          size: 1
        }
      }
    };
  }

  getActions() {
    if (this.getProp('actions')) {
      return this.ACTIONS_SETTINGS_ROW.map(action => {
        const {
          name,
          id
        } = action;
        return {
          name,
          id
        };
      });
    } else {
      return [];
    }
  }

  isSearchHoldKey(key = '') {
    return key === 'Backspace' || key === 'Delete';
  }

  clearSearchDebounce() {
    if (this._searchDebounceTimer) {
      clearTimeout(this._searchDebounceTimer);
      this._searchDebounceTimer = null;
    }
  }

  scheduleSearchChange(props = {}) {
    this._searchPendingProps = props;
    this.clearSearchDebounce();

    if (this._searchHoldKey) {
      return this;
    }

    this._searchDebounceTimer = setTimeout(() => {
      const pendingProps = this._searchPendingProps || {};
      this._searchPendingProps = null;
      this._searchDebounceTimer = null;
      this.updateSearchState(pendingProps);
    }, 500);
    return this;
  }

  handleSearchKeyDown(event) {
    if (!this.isSearchHoldKey(event?.key)) {
      return this;
    }

    this._searchHoldKey = event.key;
    this.clearSearchDebounce();
    return this;
  }

  handleSearchKeyUp(event) {
    if (!this._searchHoldKey || event?.key !== this._searchHoldKey) {
      return this;
    }

    this._searchHoldKey = '';

    if (this._searchPendingProps) {
      this.scheduleSearchChange(this._searchPendingProps);
    }

    return this;
  }

  updateSearchState(props = {}, isActiveState = true) {
    const currentSearch = this.state.search || {};
    let needUpdate = false;

    for (const [key, value] of Object.entries(props)) {
      if (!Object.is(currentSearch[key], value)) {
        needUpdate = true;
        break;
      }
    }

    if (!needUpdate) return this;
    this.set(prevState => {
      return {
        search: { ...prevState.search,
          ...props
        }
      };
    }, () => {
      if (!isActiveState) return false;
      this.dispatchEvent(new CustomEvent('onSearchEnd', {
        bubbles: true,
        composed: true,
        detail: this.state.search.value
      }));
      this.dispatchTableEvent('sf-table-search-change', this.state.search.value);
    });
  }

  dispatchTableEvent(name, detail = null) {
    this.dispatchEvent(new CustomEvent(name, {
      bubbles: true,
      composed: true,
      detail
    }));
    return this;
  }

  requestActionIntent(actionId, recordIds) {
    if (typeof actionId !== 'string' || !actionId.trim() || !Array.isArray(recordIds) || recordIds.length === 0 || Array.from(recordIds).some(id => !(typeof id === 'string' && id.length > 0 || Number.isSafeInteger(id)))) {
      throw new TypeError('Action intent requires an opaque action ID and nonempty typed record IDs');
    }

    const detail = Object.freeze({
      action_id: actionId,
      record_ids: Object.freeze([...recordIds])
    });
    return this.dispatchTableEvent('sf-table-action-intent', detail);
  }

  getSelectedRecordIds() {
    return this.getTableData().rows.filter(row => row.select?.component?.props?.checked === true).map(row => row.id);
  }

  setBulkActions(actions = []) {
    if (!Array.isArray(actions) || Array.from(actions).some(action => !action || typeof action !== 'object' || typeof action.id !== 'string' || !action.id.trim() || typeof action.name !== 'string' || !action.name.trim() || Object.keys(action).some(key => key !== 'id' && key !== 'name'))) {
      throw new TypeError('Bulk actions require opaque id and name only');
    }

    return this.set({
      bulkActions: actions.map(({
        id,
        name
      }) => ({
        id,
        name
      }))
    });
  }

  renderBulkActions() {
    if (!this.state.bulkActions?.length) return lit__WEBPACK_IMPORTED_MODULE_4__.nothing;
    const selected = this.getSelectedRecordIds();
    return (0,lit__WEBPACK_IMPORTED_MODULE_4__.html)`<div class="flex flex-wrap gap-1/3">
            ${this.state.bulkActions.map(action => (0,lit__WEBPACK_IMPORTED_MODULE_4__.html)`<sf-button
                text=${action.name} ?disabled=${selected.length === 0}
                @click=${() => {
      const ids = this.getSelectedRecordIds();
      if (ids.length) this.requestActionIntent(action.id, ids);
    }}></sf-button>`)}
        </div>`;
  } // Items for the create split button menu. Choosing one (or the main
  // button, with item null) emits sf-table-create-intent; the host opens its form.


  setCreateItems(items = []) {
    if (!Array.isArray(items) || Array.from(items).some(item => !item || typeof item !== 'object' || typeof item.id !== 'string' || !item.id.trim() || typeof item.name !== 'string' || !item.name.trim() || Object.keys(item).some(key => key !== 'id' && key !== 'name'))) {
      throw new TypeError('Create items require opaque id and name only');
    }

    return this.set({
      createItems: items.map(({
        id,
        name
      }) => ({
        id,
        name
      }))
    });
  }

  requestCreateIntent(itemId = null) {
    if (itemId !== null && !this.state.createItems.some(item => item.id === itemId)) {
      throw new TypeError(`sf-table has no create item ${String(itemId)}`);
    }

    return this.dispatchTableEvent('sf-table-create-intent', Object.freeze({
      item: itemId
    }));
  } // The actions of the view itself, set by the host: the toolbar's control is
  // a menu of them. Round three took it off column settings, which the gear
  // in the head already owns, and gave it the job the Bitrix-like tables give
  // it -- everything the page used to carry as its own buttons.


  setToolbarActions(items = []) {
    if (!Array.isArray(items) || Array.from(items).some(item => !item || typeof item !== 'object' || typeof item.id !== 'string' || !item.id.trim() || typeof item.label !== 'string' || !item.label.trim() || item.icon != null && typeof item.icon !== 'string' || item.href != null && !this.isSameSiteHref(item.href) || Object.keys(item).some(key => !['id', 'label', 'icon', 'href'].includes(key)))) {
      throw new TypeError('Toolbar actions require id and label, and an optional icon and same-site href');
    }

    return this.set({
      toolbarActions: items.map(({
        id,
        label,
        icon,
        href
      }) => ({
        id,
        label,
        ...(icon ? {
          icon
        } : {}),
        ...(href ? {
          href
        } : {})
      }))
    });
  }

  getToolbarActions() {
    return (this.state.toolbarActions || []).map(item => ({ ...item
    }));
  } // A link out of the table may only go to this same site. A host that sends
  // another origin is sending the person somewhere the table cannot vouch for.


  isSameSiteHref(href = "") {
    const value = String(href ?? "").trim();
    if (!value || value.startsWith("//")) return false;

    try {
      return new URL(value, document.baseURI).origin === new URL(document.baseURI).origin;
    } catch {
      return false;
    }
  } // The event carries the id, and an item with an href also goes there. The
  // event is cancelable, so a host that routes its own pages keeps the view
  // on the page: it calls preventDefault and navigates itself.


  requestToolbarAction(actionId) {
    const action = this.getToolbarActions().find(item => item.id === actionId);

    if (!action) {
      throw new TypeError(`sf-table has no toolbar action ${String(actionId)}`);
    }

    const event = new CustomEvent('sf-table-toolbar-action', {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: Object.freeze({
        action: action.id,
        href: action.href ?? null
      })
    });
    const allowed = this.dispatchEvent(event);

    if (allowed && action.href && this.isSameSiteHref(action.href)) {
      window.location.assign(action.href);
    }

    return this;
  }

  renderToolbarActionsContextMenu(data) {
    const {
      x,
      y
    } = data;
    const items = this.getToolbarActions().map(action => ({
      component: "sf-button",
      props: {
        type: "link",
        scheme: "on-surface",
        text: action.label,
        ...(action.icon ? {
          iconLeft: action.icon
        } : {}),
        "@click": () => {
          this.closeContextMenu();
          this.requestToolbarAction(action.id);
        }
      }
    }));
    return (0,lit__WEBPACK_IMPORTED_MODULE_4__.html)`
            <sf-context-menu
                    :key=${x + y}
                    aria-label=${this.getContextMenuLabel({ ...data,
      menu: 'toolbar-actions'
    })}
                    style="
            position: fixed;
            left: ${x}px;
            inset-block-start: calc(${y}px + calc(var(--sf-focus-outline-width) * 2));
            z-index: var(--sf-table-context-menu--z-index, var(--sf-z-index-9));
          "
                    data-context-main-menu
                    .items=${items}
            ></sf-context-menu>
        `;
  }

  renderCreateContextMenu(data) {
    const {
      x,
      y
    } = data;
    const items = this.state.createItems.map(item => ({
      component: "sf-button",
      props: {
        type: "link",
        scheme: "on-surface",
        text: item.name,
        "@click": () => {
          this.closeContextMenu();
          this.requestCreateIntent(item.id);
        }
      }
    }));
    return (0,lit__WEBPACK_IMPORTED_MODULE_4__.html)`
            <sf-context-menu
                    :key=${x + y}
                    aria-label=${this.getContextMenuLabel({ ...data,
      menu: 'create'
    })}
                    style="
            position: fixed;
            left: ${x}px;
            inset-block-start: calc(${y}px + calc(var(--sf-focus-outline-width) * 2));
            z-index: var(--sf-table-context-menu--z-index, var(--sf-z-index-9));
          "
                    data-context-main-menu
                    .items=${items}
            ></sf-context-menu>
        `;
  } // Sorting reports intent only: the table marks the header and emits
  // sf-table-sort-change; the host reorders or reloads the rows.


  getSort() {
    return { ...this.state.sort
    };
  }

  setSort(key = null, direction = null) {
    if (key === null || direction === null) {
      return this.set({
        sort: {
          key: null,
          direction: null
        }
      });
    }

    if (typeof key !== 'string' || !key || !['asc', 'desc'].includes(direction)) {
      throw new TypeError('Sort requires a column key and direction asc or desc');
    }

    return this.set({
      sort: {
        key,
        direction
      }
    });
  }

  toggleSort(key) {
    const current = this.state.sort || {};
    const direction = current.key !== key ? 'asc' : current.direction === 'asc' ? 'desc' : current.direction === 'desc' ? null : 'asc';
    this.setSort(direction ? key : null, direction);
    return this.dispatchTableEvent('sf-table-sort-change', Object.freeze({
      key,
      direction
    }));
  } // Pointer capture sends the click that ends a column drag or resize to the
  // header cell; that click must not also sort the column.


  suppressNextHeaderClick() {
    this._suppressHeaderClick = true;
    setTimeout(() => {
      this._suppressHeaderClick = false;
    }, 0);
  }

  handleHeaderSortClick(event, column = {}) {
    if (column.sortable !== true || column.system || this._suppressHeaderClick) return;
    const target = event.composedPath?.()[0] || event.target; // A click on the width strip is not a click on the header's own title.

    if (target instanceof Element && target.closest('.sf-table-column-resizer')) return;
    this.toggleSort(column.key);
  } // Emits the selection output once per change of the explicit selection.


  syncSelectionPort() {
    if (!this._isMounted) return this;
    const ids = this.getSelectedRecordIds();
    const key = JSON.stringify(ids.map(id => [typeof id, id]));
    if (key === this._selectionPortKey) return this;
    this._selectionPortKey = key;
    this.dispatchEvent(new CustomEvent("sf-port-output", {
      bubbles: true,
      composed: true,
      detail: Object.freeze({
        port: "selection",
        value: Object.freeze([...ids])
      })
    }));
    return this;
  } // One row's box has been marked. A plain click marks that row; Shift+click
  // marks every row between the last one marked and this one, with the value
  // the clicked box just took, which is what makes unmarking a range work too.


  applyRowSelection(rowId, checked, {
    range = false
  } = {}) {
    const rows = this.getTableData().rows;

    const sameRow = (row, id) => String(row?.id ?? "") === String(id ?? "");

    const index = rows.findIndex(row => sameRow(row, rowId));
    if (index < 0) return this;
    const anchorIndex = range && this._selectionAnchorId != null ? rows.findIndex(row => sameRow(row, this._selectionAnchorId)) : -1;
    const from = anchorIndex < 0 ? index : Math.min(anchorIndex, index);
    const to = anchorIndex < 0 ? index : Math.max(anchorIndex, index); // The page box is cleared first: a row cell asks `settingsChecked`
    // whether it is marked, so leaving it set would mark the rows this call
    // is unmarking back again.

    this.set({
      settingsChecked: false
    });
    this.updateRows((row, position) => position < from || position > to ? row : { ...row,
      selected: checked,
      checked,
      select: this.getDefaultRowCell(this.TABLE_SELECT_COLUMN, { ...row,
        selected: checked,
        checked
      })
    }, range && anchorIndex >= 0 ? "select-range" : "select-row");
    this._selectionAnchorId = rowId;
    return this.syncSelectAllState();
  } // The page box answers for the rows under it: all of them, some of them, or
  // none. It is computed from the rows rather than counted as rows are
  // clicked, so appended rows and a replaced page cannot drift from it.


  syncSelectAllState() {
    const count = this.getSelectedRecordIds().length;
    const total = this.getTableData().rows.length;
    return this.set({
      settingsChecked: total > 0 && count === total,
      selectIndeterminate: count > 0 && count < total
    });
  } // What a pointer press has to settle before the click arrives: whether a
  // range is being extended, and that the press must not start a text
  // selection. A Shift-click or a second click otherwise selects the text of
  // every row it passes over, which is what the host reported.


  handleRowPointerDown(event) {
    this._selectRangeModifier = event?.shiftKey === true;

    if (event?.shiftKey === true || event?.detail > 1) {
      event.preventDefault?.();
    }

    return this;
  } // Controls inside a row answer for themselves. A click on a box, a row
  // menu, a link, a button or a field is that control's click, and neither
  // focuses the row nor opens the record.


  isRowControlTarget(target) {
    if (!(target instanceof Element)) return false;
    return Boolean(target.closest('td[data-key="select"], td[data-key="settings"], a[href], button, input, select, textarea,' + ' [role="button"], [role="link"], sf-checkbox, sf-dropdown, sf-button, sf-icon-button'));
  } // A single click makes the row the current one — wherever in the row it
  // lands. It does not mark it: marking is the box's job, and a click that did
  // both would let a stray click destroy a selection the person had built up.
  //
  // The first version skipped a click on anything interactive, which read
  // well until a consumer's cells turned out to be links: clicking the only
  // content a cell has left the row unmarked as current, and the rule looked
  // broken rather than careful. A control still does its own work — a link
  // still follows, a box still marks — and the row moving under the pointer
  // takes nothing away from that. Only opening the record stays off limits
  // from a control.


  handleRowClick(event, row, index = -1) {
    this.focusRow(this.getRowKey(row, index));
    return this;
  } // Which row this is, for the purpose of being the current one. The rest of
  // the template already keys a row by `id`, then `value`, then its position,
  // because the table is given rows keyed all three ways; the current row
  // followed `id` alone, so in a view whose rows carry another key a click
  // marked nothing and looked broken. Opening a record still needs a real id
  // — there is nothing to open without one.


  getRowKey(row, index = -1) {
    const value = row?.id ?? row?.value;

    if (value !== undefined && value !== null && String(value) !== "") {
      return String(value);
    }

    return index >= 0 ? `index:${index}` : "";
  }

  isCurrentRow(row, index = -1) {
    const key = this.getRowKey(row, index);
    return key !== "" && String(this._currentRowId ?? "") === key;
  } // The current row is marked in the page rather than through state. Going
  // through state re-rendered the rows on every click, and a render between a
  // box's click and its change event swallowed the change — one click on a
  // row was enough to lose a Shift-range selection. The field is read back by
  // the template, so a later render keeps the mark.


  focusRow(rowId) {
    if (rowId == null || rowId === "") return this;
    this._currentRowId = String(rowId);
    const table = this.refs.table?.value;
    if (!table) return this;
    const selector = `tbody tr[data-row-id="${String(rowId).replace(/"/gu, '\\"')}"]`;

    for (const marked of table.querySelectorAll("tbody tr[data-current]")) {
      marked.removeAttribute("data-current");
    }

    const row = table.querySelector(selector);
    row?.setAttribute("data-current", "");
    row?.focus?.({
      preventScroll: true
    });
    return this;
  } // A double click opens the record, and only when the record says it can be
  // opened: the row has to offer the view action. Without it the double click
  // does nothing at all — silently, because a person double-clicking a row
  // that cannot be opened has not made a mistake worth a message.


  canOpenRow(row) {
    return Array.isArray(row?.actions) && row.actions.includes("view");
  }

  handleRowOpen(event, row) {
    if (this.isRowControlTarget(event?.target) || !this.canOpenRow(row)) return this;
    const id = row?.id;
    if (id == null) return this;
    return this.requestActionIntent("view", [id]);
  } // The keyboard reaches the same two answers as the pointer: Enter opens the
  // row, Space marks it. Without them the row would be focusable and mute,
  // and marking would be reachable only by pointing at the box.


  handleRowKeydown(event, row) {
    if (event?.target !== event?.currentTarget) return this;

    if (event.key === "Enter") {
      return this.handleRowOpen({
        target: event.currentTarget
      }, row);
    }

    if (event.key === " " || event.key === "Spacebar") {
      event.preventDefault?.();
      const checked = row?.select?.component?.props?.checked !== true;
      return this.applyRowSelection(row?.id, checked, {
        range: event.shiftKey === true
      });
    }

    return this;
  }

  clearSelection() {
    this._selectionAnchorId = null;
    this.set({
      settingsChecked: false,
      selectIndeterminate: false
    });
    if (!this.getSelectedRecordIds().length) return this;
    return this.updateRows(row => ({ ...row,
      selected: false,
      checked: false,
      select: this.getDefaultRowCell(this.TABLE_SELECT_COLUMN, { ...row,
        selected: false,
        checked: false
      })
    }), "select-clear");
  } // Composition input port. Only declared ports are accepted; the table never
  // resolves a relation itself. It asks the host through a typed query intent.


  sfPortInput(port, value, meta = {}) {
    if (!Object.hasOwn(SF_TABLE_PORTS.inputs, port)) {
      throw new TypeError(`sf-table has no input port ${String(port)}`);
    }

    const recordIds = checkedRecordIds(value);
    const sequence = Number.isSafeInteger(meta?.sequence) && meta.sequence > this._querySequence ? meta.sequence : this._querySequence + 1;
    this._routeContext = Object.freeze({
      record_ids: recordIds
    });
    this._querySequence = sequence;
    this.clearSelection();
    this.requestContextQuery(sequence);
    return undefined;
  }

  requestContextQuery(sequence) {
    this._pendingQuerySequence = sequence;
    this._abandonedQuery = false;
    this.setDataState("loading");
    return this.dispatchTableEvent("sf-table-query-intent", Object.freeze({
      reason: "context",
      context: this._routeContext,
      sequence
    }));
  }

  onConnected() {
    super.onConnected();

    if (typeof ResizeObserver !== "undefined" && !this._responsiveObserver) {
      this._responsiveObserver = new ResizeObserver(([entry]) => {
        const width = Math.floor(entry.contentRect.width);

        if (width > 0 && width !== this._responsiveWidth) {
          this._responsiveWidth = width;
          this.requestComponentUpdate("responsive-columns");
        }

        this.measurePinnedColumns();
      }); // SfBaseElement is display: contents, so its own box has no width.
      // Observe the nearest visible container instead of the custom tag.

      const candidates = [this.querySelector('.sf-table'), this.parentElement, this.getRootNode()?.host];
      const target = candidates.find(element => element?.getBoundingClientRect?.().width > 0) ?? candidates.find(Boolean) ?? this;

      this._responsiveObserver.observe(target);
    }

    if (this._abandonedQuery && this._routeContext) {
      this._querySequence += 1;
      this.requestContextQuery(this._querySequence);
    }
  } // Latest result wins: only the answer to the newest pending context query
  // is applied, and at most once.


  applyQueryResult(sequence, rows) {
    if (!Number.isSafeInteger(sequence) || sequence !== this._pendingQuerySequence || !Array.isArray(rows)) {
      return false;
    }

    this._pendingQuerySequence = null;
    this.setRows(rows);
    this.setDataState("auto");
    return true;
  }

  getQueryContext() {
    return this._routeContext;
  }

  getItemRef(id) {
    if (!this.refs.items.has(id)) {
      this.refs.items.set(id, this.createRef());
    }

    return this.refs.items.get(id);
  } // The table had its own copy of this, which created an element on every
  // render; the base's one keeps the element a position in the template
  // already has. Nothing else about the call changes.


  setIndeterminate() {
    const checked = this.state.data.rows.filter(row => {
      return row.select.component.props.checked;
    });
    return checked.length;
  }

  getTableData() {
    const data = this.state?.data;
    return data && typeof data === "object" ? data : {
      columns: [],
      rows: []
    };
  }

  isContextMenuEvent(event) {
    const target = event?.target;

    if (!(target instanceof Node)) {
      return false;
    }

    const portal = this._portalContainer;

    if (portal instanceof Node && (portal === target || portal.contains(target))) {
      return true;
    }

    const contextMenu = this.refs?.contextMenu?.value;

    if (!(contextMenu instanceof Node)) {
      return false;
    }

    if (contextMenu === target || contextMenu.contains(target)) {
      return true;
    }

    return event.composedPath?.().includes(contextMenu) || false;
  }

  contextEvent(event) {
    if (this.isContextMenuEvent(event)) {
      return;
    } // Nothing in the column settings window is pending any more -- the pin,
    // the tick and the order each apply as they are made -- so a click away
    // has nothing of theirs to lose. What it still drops is the filter form
    // a person was filling in, which is a query rather than a setting.


    this.tempSettings = null;
    this.closeContextMenu(false);
  }

  splitItemsByColumns(items = [], columnCount = 1) {
    const normalizedItems = Array.isArray(items) ? items : [];
    const normalizedColumnCount = Math.max(1, Number(columnCount) || 1);
    const itemsPerColumn = Math.ceil(normalizedItems.length / normalizedColumnCount);

    if (!itemsPerColumn) {
      return [];
    }

    return Array.from({
      length: normalizedColumnCount
    }, (_, index) => normalizedItems.slice(index * itemsPerColumn, (index + 1) * itemsPerColumn)).filter(columnItems => columnItems.length);
  }

  getPendingFilterState(filter = this.state?.filter || {}) {
    const tempFilter = this.tempSettings?.filter || {};
    const hasTempSelectedTemplateKey = Object.prototype.hasOwnProperty.call(tempFilter, "selectedTemplateKey");
    return { ...filter,
      ...tempFilter,
      selectedTemplateKey: hasTempSelectedTemplateKey ? tempFilter.selectedTemplateKey : filter.selectedTemplateKey,
      templates: tempFilter.templates || filter.templates || []
    };
  }

  getSortedFilterTemplates(filter = this.state?.filter || {}) {
    const templates = this.getFilterTemplates(filter);
    return templates.map((template, sourceIndex) => ({ ...template,
      sourceIndex,
      order: typeof template.order === "number" ? template.order : sourceIndex
    })).sort((left, right) => {
      if (Boolean(left.pinned) !== Boolean(right.pinned)) {
        return left.pinned ? -1 : 1;
      }

      if (left.order !== right.order) {
        return left.order - right.order;
      }

      return left.sourceIndex - right.sourceIndex;
    });
  }

  changeTempFilterTemplateSettings(key, patch = {}) {
    if (!key) return;
    const currentFilter = this.getPendingFilterState();
    const templates = this.getFilterTemplates(currentFilter).map(template => {
      for (const [k, v] of Object.entries(patch)) {
        template[k] = key === template.key ? v : !v;
      }

      return template;
    });
    this.tempSettings = { ...(this.tempSettings || {}),
      filter: { ...(this.tempSettings?.filter || {}),
        selectedTemplateKey: currentFilter.selectedTemplateKey,
        templates
      }
    };
    this.requestComponentUpdate("temp-filter-template");
  }

  patchTempFilterTemplateSettings(key, patch = {}) {
    if (!key) return;
    const currentFilter = this.getPendingFilterState();
    const templates = this.getFilterTemplates(currentFilter).map(template => template.key === key ? { ...template,
      ...(typeof patch === "function" ? patch(template) : patch)
    } : template);
    this.tempSettings = { ...(this.tempSettings || {}),
      filter: { ...(this.tempSettings?.filter || {}),
        selectedTemplateKey: currentFilter.selectedTemplateKey,
        templates
      }
    };
    this.requestComponentUpdate("temp-filter-template");
  }

  selectTempFilterTemplate(key) {
    if (!key) return;
    const currentFilter = this.getPendingFilterState();
    const templates = this.getFilterTemplates(currentFilter).map(template => ({ ...template,
      selected: template.key === key
    }));
    this.tempSettings = { ...(this.tempSettings || {}),
      filter: { ...(this.tempSettings?.filter || {}),
        selectedTemplateKey: key,
        templates
      }
    };
    this.requestComponentUpdate("temp-filter-template");
  }

  normalizeFilterTemplate(template = {}, sourceIndex = 0) {
    const key = template.key || `filter_template_${sourceIndex + 1}`;
    const data = template.data && typeof template.data === "object" ? template.data : {};
    return { ...template,
      key,
      label: template.label || data.template_name || key,
      data: { ...data,
        values: { ...(data.values || {})
        },
        tags: { ...(data.tags || {})
        }
      }
    };
  }

  getFilterTemplates(filter = this.state?.filter || {}) {
    const templates = (filter.templates || []).map((template, index) => this.normalizeFilterTemplate(template, index));

    if (templates.length) {
      return templates;
    }

    return [this.normalizeFilterTemplate({
      key: filter.selectedTemplateKey || "default",
      label: this.text("defaultTemplateText"),
      selected: true,
      order: 0,
      data: {}
    })];
  }

  getFilterTemplateByKey(key, filter = this.state?.filter || {}) {
    if (!key || !filter) return null;
    return this.getFilterTemplates(filter).find(template => template.key === key) || null;
  }

  getSelectedFilterTemplate(filter = this.state?.filter || {}) {
    const templates = this.getFilterTemplates(filter);
    const hasSelectedTemplateKey = Object.prototype.hasOwnProperty.call(filter, "selectedTemplateKey");

    if (hasSelectedTemplateKey && filter.selectedTemplateKey === "") {
      return null;
    }

    const selectedKey = filter.selectedTemplateKey || templates.find(template => template.selected)?.key || templates[0]?.key || "";
    return this.getFilterTemplateByKey(selectedKey, { ...filter,
      templates
    }) || templates[0] || null;
  }

  getCurrentFilterValues(filter = this.state?.filter || {}) {
    const selectedTemplate = this.getSelectedFilterTemplate(filter);
    return { ...(selectedTemplate?.data?.values || {})
    };
  }

  getCurrentFilterTags(filter = this.state?.filter || {}) {
    const selectedTemplate = this.getSelectedFilterTemplate(filter);
    return { ...(selectedTemplate?.data?.tags || {})
    };
  }

  normalizeFilterDataForCompare(value) {
    if (Array.isArray(value)) {
      return value.map(item => this.normalizeFilterDataForCompare(item));
    }

    if (value && typeof value === "object") {
      return Object.keys(value).sort().reduce((result, key) => ({ ...result,
        [key]: this.normalizeFilterDataForCompare(value[key])
      }), {});
    }

    return value;
  }

  isSameFilterData(current, next) {
    return JSON.stringify(this.normalizeFilterDataForCompare(current || {})) === JSON.stringify(this.normalizeFilterDataForCompare(next || {}));
  }

  getMergedFilterDraftData(filter = this.state?.filter || {}, tempFilter = this.tempSettings?.filter || {}) {
    const baseFilter = this.getPendingFilterState({ ...filter,
      selectedTemplateKey: Object.prototype.hasOwnProperty.call(tempFilter, "selectedTemplateKey") ? tempFilter.selectedTemplateKey : filter.selectedTemplateKey,
      templates: tempFilter.templates || filter.templates || []
    });
    const currentTags = this.getCurrentFilterTags(baseFilter);
    const currentValues = this.getCurrentFilterValues(baseFilter);
    const tags = tempFilter.replaceTags ? { ...(tempFilter.tags || {})
    } : { ...currentTags,
      ...(tempFilter.tags || {})
    };
    const values = tempFilter.replaceValues ? { ...(tempFilter.values || {})
    } : { ...currentValues,
      ...(tempFilter.values || {})
    };
    Object.entries(tempFilter.values || {}).forEach(([key, value]) => {
      if (!this.isEmptyFilterEntry(value)) {
        return;
      }

      delete values[key];
      delete tags[key];
    });
    return {
      filter: baseFilter,
      tags,
      values
    };
  }

  hasPendingFilterDataChanges(filter = this.state?.filter || {}) {
    const tempFilter = this.tempSettings?.filter;

    if (!tempFilter || !Object.prototype.hasOwnProperty.call(tempFilter, "tags") && !Object.prototype.hasOwnProperty.call(tempFilter, "values") && !tempFilter.replaceTags && !tempFilter.replaceValues) {
      return false;
    }

    const draft = this.getMergedFilterDraftData(filter, tempFilter);
    return !this.isSameFilterData(this.getCurrentFilterTags(draft.filter), draft.tags) || !this.isSameFilterData(this.getCurrentFilterValues(draft.filter), draft.values);
  } // The filter window waits for its button, so a draft and a live query look
  // alike -- the same confusion the pins had, in the window where waiting is
  // the right behaviour. This counts what a press would change, by field: a
  // field whose tag was switched on or off, or whose value or operator
  // differs. Fields are what a person reads as conditions.


  countPendingFilterConditionChanges(filter = this.state?.filter || {}) {
    const tempFilter = this.tempSettings?.filter;
    if (!tempFilter) return 0;
    const draft = this.getMergedFilterDraftData(filter, tempFilter);
    const current = {
      tags: this.getCurrentFilterTags(draft.filter),
      values: this.getCurrentFilterValues(draft.filter)
    };

    const same = (left, right) => this.isSameFilterData(left, right);

    const keys = new Set([...Object.keys(current.tags || {}), ...Object.keys(draft.tags || {}), ...Object.keys(current.values || {}), ...Object.keys(draft.values || {})]);
    let changed = 0;

    for (const key of keys) {
      const wasActive = Boolean((current.tags || {})[key]?.active);
      const willBeActive = Boolean((draft.tags || {})[key]?.active);

      if (wasActive !== willBeActive) {
        changed += 1;
        continue;
      }

      if (!same((current.values || {})[key], (draft.values || {})[key])) {
        changed += 1;
      }
    }

    return changed;
  }

  hasUnsavedFilterDataChanges() {
    return Boolean(this.state?.filterDataDirty && this.getSelectedFilterTemplate(this.state?.filter || {}));
  }

  saveCurrentFilterTemplateData() {
    const template = this.getSelectedFilterTemplate(this.state?.filter || {});

    if (!template) {
      return this;
    }

    return this.set({
      filterDataDirty: false
    }, () => {
      this.dispatchFilterTemplateSave(template.key, this.state.filter, this.getFilterTemplateByKey(template.key));
    });
  }

  mergeObjectDeep(target = {}, patch = {}) {
    return Object.entries(patch || {}).reduce((result, [key, value]) => {
      const currentValue = result[key];
      const shouldMerge = value && typeof value === "object" && !Array.isArray(value) && currentValue && typeof currentValue === "object" && !Array.isArray(currentValue);
      return { ...result,
        [key]: shouldMerge ? this.mergeObjectDeep(currentValue, value) : value
      };
    }, { ...(target || {})
    });
  }

  patchFilterTemplateByKey(key, filter = this.state.filter, props = {}) {
    if (!key || !filter) return {
      filter,
      template: null
    };
    let patchedTemplate = null;
    const nextFilter = { ...filter,
      templates: this.getFilterTemplates(filter).map(template => {
        if (key !== template.key) {
          return template;
        }

        const nextPatch = typeof props === "function" ? props(template) : props;
        patchedTemplate = this.mergeObjectDeep(template, nextPatch);
        return patchedTemplate;
      })
    };
    return {
      filter: nextFilter,
      template: patchedTemplate
    };
  }

  createFilterTemplatePatchState(filter, options = {}) {
    const nextState = {
      filter
    };

    if (Object.prototype.hasOwnProperty.call(options, "saveInputValue")) {
      nextState.saveInputValue = options.saveInputValue;
    }

    return nextState;
  } // Which fields the filter is showing, in the order the host gave them.
  // These are the chips a person adds under "Поля": without them a saved view
  // came back with the fields it was saved without.


  getActiveFilterFieldKeys(filter = this.state?.filter || {}) {
    const tags = this.getCurrentFilterTags(filter);
    const order = this.getFilterFields().map(field => field?.key);
    const chosen = Object.keys(tags).filter(key => tags[key]?.active);
    return [...order.filter(key => chosen.includes(key)), ...chosen.filter(key => !order.includes(key))];
  } // Puts those fields back. The template keeps every other part of itself;
  // only which fields are shown is replaced, because that is what was saved.


  setActiveFilterFields(keys = [], filter = this.state?.filter || {}) {
    if (!Array.isArray(keys) || keys.some(key => typeof key !== 'string' || !key.trim())) {
      throw new TypeError('Filter field keys must be nonempty strings');
    }

    const template = this.getSelectedFilterTemplate(filter);
    if (!template?.key) return this;
    const fields = this.getFilterFields();
    const current = this.getCurrentFilterTags(filter);
    const tags = {};

    for (const key of Object.keys(current)) {
      tags[key] = { ...current[key],
        active: false
      };
    }

    for (const key of keys) {
      const field = fields.find(item => item?.key === key);
      tags[key] = { ...(current[key] || {}),
        active: true,
        label: field?.label ?? current[key]?.label ?? key,
        control: field?.filter?.control || field?.type || field?.dataType || current[key]?.control || 'text'
      };
    }

    const patched = this.patchFilterTemplateByKey(template.key, filter, item => ({ ...item,
      data: { ...(item.data || {}),
        tags
      }
    }));
    return this.set({
      filter: patched.filter
    });
  } // The port passes `settings` through as it is, so the chosen fields ride
  // there. Every save path goes through here: the form's own Save is the one
  // the consumer uses, and it used to send a template without them.


  withFilterFieldSettings(detail, filter = this.state?.filter || {}) {
    if (Array.isArray(detail)) {
      return detail.map(item => this.withFilterFieldSettings(item, filter));
    }

    if (!detail || typeof detail !== 'object') return detail;
    const fields = Array.isArray(detail.data?.tags) ? [] : Object.keys(detail.data?.tags || {}).filter(key => detail.data.tags[key]?.active);
    return { ...detail,
      settings: { ...(detail.settings || {}),
        filter_fields: fields.length ? fields : this.getActiveFilterFieldKeys(filter)
      }
    };
  }

  dispatchFilterTemplateSave(key, filter, template = null) {
    const detail = this.withFilterFieldSettings(template || this.getFilterTemplateByKey(key, filter), filter);
    this.dispatchEvent(new CustomEvent("onTemplateSave", {
      bubbles: true,
      composed: true,
      detail
    }));
    this.dispatchTableEvent('sf-table-template-save', detail);
    return this;
  }

  getChangedFilterTemplates(prevFilter = {}, nextFilter = {}, keys = []) {
    const prevTemplates = new Map(this.getFilterTemplates(prevFilter).map(template => [template.key, template]));
    return this.getFilterTemplates(nextFilter).filter(template => {
      const prevTemplate = prevTemplates.get(template.key);

      if (!prevTemplate) {
        return true;
      }

      return keys.some(key => !Object.is(prevTemplate[key], template[key]));
    });
  }

  dispatchFilterTemplatesSave(templates = []) {
    const filteredTemplates = templates.filter(template => template?.key);

    if (!filteredTemplates.length) {
      return this;
    }

    const detail = this.withFilterFieldSettings(filteredTemplates.length === 1 ? filteredTemplates[0] : filteredTemplates);
    this.dispatchEvent(new CustomEvent("onTemplateSave", {
      bubbles: true,
      composed: true,
      detail
    }));
    this.dispatchTableEvent('sf-table-template-save', detail);
    return this;
  }

  saveFilterTemplatePatch(key, props = {}, options = {}, filter = this.state.filter) {
    if (!key || !filter) return this;
    const patched = this.patchFilterTemplateByKey(key, filter, props);
    const nextFilter = { ...patched.filter,
      ...(options.filterPatch || {})
    };
    return this.set(() => this.createFilterTemplatePatchState(nextFilter, options), () => {
      if (options.dispatch !== false) {
        this.dispatchFilterTemplateSave(key, nextFilter, patched.template);
      }
    });
  }

  setDefaultFilterTemplate(key) {
    if (!key) return this;
    return this.set(prevState => {
      const currentFilter = prevState.filter || {};
      const filter = { ...currentFilter,
        templates: this.getFilterTemplates(currentFilter).map(template => ({ ...template,
          default: template.key === key
        }))
      };
      return {
        filter
      };
    });
  }

  patchFilterTemplateData(filter = {}, patch = {}) {
    const filterRest = { ...filter
    };
    delete filterRest.tags;
    delete filterRest.values;
    const templates = this.getFilterTemplates(filterRest);
    const selectedTemplate = this.getSelectedFilterTemplate({ ...filterRest,
      templates
    });

    if (!selectedTemplate) {
      return { ...filterRest,
        templates
      };
    }

    const nextValues = Object.prototype.hasOwnProperty.call(patch, "values") ? patch.values || {} : selectedTemplate.data?.values || {};
    const nextTags = Object.prototype.hasOwnProperty.call(patch, "tags") ? patch.tags || {} : selectedTemplate.data?.tags || {};
    const nextTemplates = templates.map(template => template.key === selectedTemplate.key ? { ...template,
      data: { ...(template.data || {}),
        ...(patch.data || {}),
        values: nextValues,
        tags: nextTags
      }
    } : template);
    return { ...filterRest,
      selectedTemplateKey: selectedTemplate.key,
      templates: nextTemplates
    };
  }

  getFilterPayload(filter = this.state?.filter || {}) {
    const selectedTemplate = this.getSelectedFilterTemplate(filter);
    return { ...(selectedTemplate?.data || {}),
      templateKey: selectedTemplate?.key || "",
      templateLabel: selectedTemplate?.label || "",
      values: this.getCurrentFilterValues(filter),
      tags: this.getCurrentFilterTags(filter)
    };
  }

  selectFilterTemplate(key) {
    if (!key || this.state?.filter?.selectedTemplateKey === key) {
      return this;
    }

    this.set(prevState => {
      const currentFilter = prevState.filter || {};
      const nextFilter = { ...currentFilter,
        selectedTemplateKey: key,
        templates: (prevState.filter?.templates || []).map(template => ({ ...template,
          selected: template.key === key
        }))
      };
      const selectedTemplate = this.getFilterTemplateByKey(key, nextFilter) || nextFilter.templates[0] || null;
      return {
        filter: nextFilter,
        saveInputValue: selectedTemplate?.label || ""
      };
    });
    return this;
  }

  bindFilterTemplateDrag() {
    this.clearFilterTemplateDragBindings();
    const contextMenu = this.refs?.contextMenu?.value;
    const container = contextMenu?.querySelector?.("[data-filter-template-list]");
    if (!container) return;
    container.querySelectorAll("[data-filter-template-key]").forEach(item => {
      const handle = item.querySelector("[data-move]");
      const cleanup = (0,_helpers_draggable__WEBPACK_IMPORTED_MODULE_8__.bindSortableDrag)({
        handle,
        item,
        container,
        boundAttr: "data-sf-table-template-drag-bound",
        getSortableItems: (currentContainer, currentItem) => this.getFilterTemplateSortableItems(currentContainer, currentItem?.dataset?.pinned === "1"),
        getAfterElement: (currentContainer, y) => this.getFilterTemplateDragAfterElement(currentContainer, y, item.dataset.pinned === "1"),
        insertPlaceholder: (currentContainer, placeholder, afterElement) => {
          this.insertFilterTemplatePlaceholder(currentContainer, placeholder, afterElement, item.dataset.pinned === "1");
        },
        onDrop: () => {
          this.syncFilterTemplateOrderFromContainer(container);
        }
      });

      if (cleanup) {
        this._filterTemplateDragCleanups.push(cleanup);
      }
    });
  } // The order of the columns, by the handle on each row of the settings list.
  // The same binding the filter templates use, grouped the same way: a pinned
  // column moves among pinned columns and a loose one among loose ones, so a
  // drag cannot silently unpin a column.


  bindColumnSettingsDrag() {
    this.clearColumnSettingsDragBindings();
    const contextMenu = this.refs?.contextMenu?.value;
    const container = contextMenu?.querySelector?.('[data-column-settings-list]');
    if (!container) return;
    container.querySelectorAll('[data-column-key]').forEach(item => {
      const handle = item.querySelector('[data-move]');
      const pinnedGroup = item.dataset.pinned === '1';

      const items = currentContainer => Array.from(currentContainer?.children || []).filter(candidate => candidate instanceof HTMLElement && candidate.dataset.columnKey && candidate.dataset.pinned === (pinnedGroup ? '1' : '0') && !candidate.classList.contains('is-dragging') && !candidate.classList.contains('drag-placeholder'));

      const cleanup = (0,_helpers_draggable__WEBPACK_IMPORTED_MODULE_8__.bindSortableDrag)({
        handle,
        item,
        container,
        boundAttr: 'data-sf-table-column-drag-bound',
        getSortableItems: currentContainer => items(currentContainer),
        getAfterElement: (currentContainer, y) => (0,_helpers_draggable__WEBPACK_IMPORTED_MODULE_8__.getVerticalDragAfterElement)(currentContainer, y, {
          accept: candidate => candidate instanceof HTMLElement && Boolean(candidate.dataset.columnKey) && candidate.dataset.pinned === (pinnedGroup ? '1' : '0')
        }),
        insertPlaceholder: (currentContainer, placeholder, afterElement) => {
          const group = items(currentContainer);
          if (afterElement) currentContainer.insertBefore(placeholder, afterElement);else if (group.length) group[group.length - 1].after(placeholder);else currentContainer.append(placeholder);
        },
        onDrop: () => this.syncColumnOrderFromContainer(container)
      });
      if (cleanup) this._columnSettingsDragCleanups.push(cleanup);
    });
  }

  clearColumnSettingsDragBindings() {
    this._columnSettingsDragCleanups.forEach(cleanup => cleanup());

    this._columnSettingsDragCleanups = [];
  } // What the list now reads, written back as `order` in the pending settings:
  // ten apart, so a later move has room between two columns without renumbering
  // the rest.


  syncColumnOrderFromContainer(container) {
    const rows = Array.from(container?.children || []).filter(item => item instanceof HTMLElement && item.dataset.columnKey && !item.classList.contains('drag-placeholder'));
    rows.forEach((item, index) => {
      this.patchTempColumnSettings(item.dataset.columnKey, {
        order: (index + 1) * 10
      });
    });
    this.requestComponentUpdate('column-order'); // The consumer's owner read the drag as applying at once, because the
    // list redraws from the draft. It did not: a click outside threw the new
    // order away with everything else. It does now, so the two controls that
    // look immediate are immediate.

    this.commitColumnSettings('column-order');
    return this;
  }

  clearFilterTemplateDragBindings() {
    this._filterTemplateDragCleanups.forEach(cleanup => cleanup());

    this._filterTemplateDragCleanups = [];
  }

  getFilterTemplateSortableItems(container, pinned = false) {
    return Array.from(container?.children || []).filter(item => item instanceof HTMLElement && item.dataset.filterTemplateKey && item.dataset.pinned === (pinned ? "1" : "0") && !item.classList.contains("hidden") && !item.classList.contains("is-dragging") && !item.classList.contains("drag-placeholder"));
  }

  getFilterTemplateDragAfterElement(container, y, pinned = false, itemsLayout = null) {
    return (0,_helpers_draggable__WEBPACK_IMPORTED_MODULE_8__.getVerticalDragAfterElement)(container, y, {
      itemsLayout: Array.isArray(itemsLayout) ? itemsLayout.filter(layout => layout.item?.dataset?.filterTemplateKey && layout.item?.dataset?.pinned === (pinned ? "1" : "0") && !layout.item.classList.contains("hidden")) : null,
      accept: item => item.dataset.filterTemplateKey && item.dataset.pinned === (pinned ? "1" : "0") && !item.classList.contains("hidden")
    });
  }

  insertFilterTemplatePlaceholder(container, placeholder, afterElement, pinned = false) {
    if (afterElement) {
      container.insertBefore(placeholder, afterElement);
      return;
    }

    const group = pinned ? "1" : "0";
    const groupItems = Array.from(container?.children || []).filter(item => item instanceof HTMLElement && item.dataset.filterTemplateKey && item.dataset.pinned === group && !item.classList.contains("is-dragging") && !item.classList.contains("drag-placeholder"));
    const lastGroupItem = groupItems.at(-1);

    if (lastGroupItem?.nextSibling) {
      container.insertBefore(placeholder, lastGroupItem.nextSibling);
      return;
    }

    if (pinned) {
      const firstUnpinnedItem = Array.from(container?.children || []).find(item => item instanceof HTMLElement && item.dataset.filterTemplateKey && item.dataset.pinned === "0" && !item.classList.contains("is-dragging") && !item.classList.contains("drag-placeholder"));

      if (firstUnpinnedItem) {
        container.insertBefore(placeholder, firstUnpinnedItem);
        return;
      }
    }

    container.appendChild(placeholder);
  }

  syncFilterTemplateOrderFromContainer(container) {
    const orderedByGroup = {
      pinned: new Map(),
      normal: new Map()
    };
    Array.from(container?.children || []).filter(item => item instanceof HTMLElement && item.dataset.filterTemplateKey && !item.classList.contains("drag-placeholder")).forEach(item => {
      const group = item.dataset.pinned === "1" ? "pinned" : "normal";
      orderedByGroup[group].set(item.dataset.filterTemplateKey, orderedByGroup[group].size);
    });
    const currentFilter = this.getPendingFilterState();
    const templates = this.getFilterTemplates(currentFilter).map((template, sourceIndex) => {
      const group = template.pinned ? "pinned" : "normal";
      const nextOrder = orderedByGroup[group].get(template.key);

      if (typeof nextOrder !== "number") {
        return template;
      }

      return { ...template,
        order: nextOrder,
        sourceIndex
      };
    });
    this.tempSettings = { ...(this.tempSettings || {}),
      filter: { ...(this.tempSettings?.filter || {}),
        selectedTemplateKey: currentFilter.selectedTemplateKey,
        templates: templates.sort((left, right) => {
          if (Boolean(left.pinned) !== Boolean(right.pinned)) {
            return left.pinned ? -1 : 1;
          }

          if (left.order !== right.order) {
            return left.order - right.order;
          }

          return left.sourceIndex - right.sourceIndex;
        })
      }
    };
    this.requestComponentUpdate("temp-filter-template-order");
  } // Whether there is room for every data column to be readable.
  //
  // A floor cannot be a width: write one on a column and it becomes the
  // width, so a cell that needs more wraps and a typed row grows -- measured
  // at 81px against 57 where the typed-cells probe watches it. And a minimum
  // on a cell is ignored in a fixed layout. So the floor is applied only when
  // it is actually needed: while there is room the columns share it as they
  // always have, and when there is not they stop at the floor and the box
  // scrolls, which is what the consumer asked for (Larena, 2026-10-06).


  get columnsAreCramped() {
    // The box that would do the scrolling is the one to measure. The
    // responsive observer's width is what it last saw, and in an embedded
    // list it had seen nothing at all -- it reported 0 while the columns
    // were 77px wide and wrapping their headings over four lines (owner,
    // 2026-10-09).
    const width = this.refs.scroll?.value?.clientWidth || this._responsiveWidth;
    if (!width) return false;
    const columns = this.getColumns?.() ?? [];
    const floored = columns.filter(column => this.columnTakesFloor(column));
    if (!floored.length) return false;
    const host = this.querySelector(".sf-table") ?? this;
    const raw = globalThis.getComputedStyle?.(host)?.getPropertyValue("--sf-table--column-min-inline-size")?.trim();
    if (!raw) return false;
    const root = Number.parseFloat(globalThis.getComputedStyle?.(document.documentElement)?.fontSize) || 16;
    const floor = raw.endsWith("rem") ? Number.parseFloat(raw) * root : Number.parseFloat(raw);
    if (!Number.isFinite(floor) || floor <= 0) return false; // What the columns that are not floored already take, measured rather
    // than assumed: the select box, the gear, the actions.

    const taken = [...this.querySelectorAll("thead th")].filter(cell => !floored.some(column => column.key === cell.dataset.key)).reduce((total, cell) => total + cell.getBoundingClientRect().width, 0);
    return width - taken < floored.length * floor;
  }

  columnTakesFloor(column) {
    if (!column?.key || SYSTEM_COLUMN_KEYS.has(column.key)) return false;
    return !(column.colWidth ?? column.width ?? column.size ?? column.min_width ?? column.minWidth);
  }

  getSystemColumns() {
    const columns = [];
    const props = this.getPropsContext();

    if (props.selectable) {
      columns.push(this.getSelectColumn());
    }

    if (props.settings) {
      columns.push(this.TABLE_SETTINGS_COLUMN);
    }

    if (props.actions && props.rowActions && this.state.actionActive) {
      columns.push(this.TABLE_ACTIONS_COLUMN);
    }

    return columns;
  }

  setTemplates(data) {
    const nextTemplates = Object.values(data || {}).map((template, index) => this.normalizeFilterTemplate(template, index));
    return this.set(prevState => {
      const currentFilter = prevState.filter || {};
      const templatesByKey = new Map();
      this.getFilterTemplates(currentFilter).forEach(template => {
        templatesByKey.set(template.key, template);
      });
      nextTemplates.forEach(template => {
        templatesByKey.set(template.key, { ...(templatesByKey.get(template.key) || {}),
          ...template
        });
      });
      const templates = Array.from(templatesByKey.values());
      const hasCurrentSelectedTemplateKey = Object.prototype.hasOwnProperty.call(currentFilter, "selectedTemplateKey");
      const defaultTemplate = templates.find(template => template.default === true);
      const incomingSelectedKey = nextTemplates.find(template => template?.selected)?.key;
      const fallbackSelectedKey = defaultTemplate?.key || templates[0]?.key || "";
      const selectedTemplateKey = this._filterTemplatesLoaded ? incomingSelectedKey ?? (hasCurrentSelectedTemplateKey ? currentFilter.selectedTemplateKey : fallbackSelectedKey) : incomingSelectedKey ?? fallbackSelectedKey;
      const nextFilter = { ...currentFilter,
        selectedTemplateKey,
        templates: templates.map(template => ({ ...template,
          selected: template.key === selectedTemplateKey
        }))
      };
      const selectedTemplate = selectedTemplateKey === "" ? null : this.getFilterTemplateByKey(selectedTemplateKey, { ...nextFilter,
        templates
      }) || templates[0] || null;
      this._filterTemplatesLoaded = true;
      return {
        filter: nextFilter,
        saveInputValue: selectedTemplate?.label || ""
      };
    });
  } // The identity of this instance: the author's id when there is one, its own
  // counter otherwise. Never the component name, so a second table on the page
  // cannot inherit the first one's ids or preferences.


  getInstanceId() {
    return this.id || this._instanceId;
  }

  getColumnResizerId(columnKey) {
    return `${this.getInstanceId()}--column-resizer--${columnKey}`;
  }

  getTableSettingsKey() {
    return this.tableSettingsKey || this.getAttribute?.("table-settings-key") || this.id || this.getInstanceId();
  }

  normalizeTableSettings(data = {}, tableSettingsKey = this.getTableSettingsKey()) {
    const settingsMap = data?.tableSettings && typeof data.tableSettings === "object" && !Array.isArray(data.tableSettings) && !data.tableSettings.columnSettings ? data.tableSettings : null;
    const source = data?.item || settingsMap?.[tableSettingsKey] || data?.tableSettings || data?.settings || data || {};
    const columnSettings = source?.columnSettings || data?.columnSettings || {};
    return { ...source,
      columnSettings: columnSettings && typeof columnSettings === "object" && !Array.isArray(columnSettings) ? columnSettings : {}
    };
  }

  setTableSettings(data = {}, reason = "table-settings-load", tableSettingsKey = this.getTableSettingsKey()) {
    const settings = this.normalizeTableSettings(data, tableSettingsKey);
    return this.setColumnSettings(settings.columnSettings, reason, false);
  }

  getContextMenuLabel(data = {}) {
    switch (data.menu || data.type) {
      case 'filter-favorites':
        return this.text('contextSaveTemplateLabel');

      case 'filter-settings':
        return this.text('contextFilterSettingsLabel');

      case 'filter-template-actions':
        return `${this.text('contextTemplateActionsLabel')}: ${data.template?.label || data.template?.key || ''}`.trim();

      case 'tag-settings':
        {
          const fieldKey = data.fieldKey || '';
          const field = this.getFilterField(fieldKey);
          const label = field?.label || this.getCurrentFilterTags()?.[fieldKey]?.label || fieldKey;
          return `${this.text('contextFieldFilterLabel')}: ${label || this.text('fieldWordText')}`;
        }

      case 'row-settings':
        return this.text('contextRowActionsLabel');

      case 'create':
        return this.text('contextCreateOptionsLabel');

      case 'toolbar-actions':
        return this.text('contextViewActionsLabel');

      case 'table-settings':
      default:
        return this.text('contextTableSettingsLabel');
    }
  }

  renderFilterFavoritesContextMenu(data) {
    const {
      x,
      y,
      position
    } = data;
    const template = this.getSelectedFilterTemplate();
    return (0,lit__WEBPACK_IMPORTED_MODULE_4__.html)`
            <sf-context-menu
                    :key=${x + y + this._renderToken}
                    aria-label=${this.getContextMenuLabel({ ...data,
      menu: 'filter-favorites'
    })}
                    style="
            position: fixed;
            left: ${x}px;
            inset-block-start: calc(${y}px + calc(var(--sf-focus-outline-width) * 2));
            z-index: var(--sf-table-context-menu--z-index, var(--sf-z-index-9));
          "
                    root-class="sf-table-context-menu flex flex-col"
                    data-context-main-menu
                    position="${position || ""}"
            >
                <div class="flex flex-col flex-1 gap-2" slot="content">
                    <div class="sf-table-context-top"><span class="sf-text-2 bold">Сохранение шаблона</span></div>
                    <div class="sf-table-context-main">
                        <form ${(0,lit_directives_ref_js__WEBPACK_IMPORTED_MODULE_5__.ref)(this.refs.templateForm)} id="save_template" class="flex flex-col gap-1/2">
                            <sf-input
                                    size="1"
                                    type="filled"
                                    placeholder="${this.text('templateNamePlaceholder')}"
                                    value="${this.state.saveInputValue}"
                                    name="template_name"
                                    @change=${e => {
      this.set({
        saveInputValue: e.target.value
      });
    }}
                                    @input=${e => {
      this.set({
        saveInputValue: e.target.value
      });
    }}
                            ></sf-input>
                            <div class="flex flex-col gap-1/2">
                                <sf-checkbox
                                        name="template_default"
                                        position="end"
                                        root-class="content-main-between"
                                        value="1"
                                        ?checked=${template.data.template_default}
                                        label="${this.text('makeDefaultLabel')}"
                                ></sf-checkbox>
                                <sf-checkbox
                                        name="template_save_for_all"
                                        position="end"
                                        root-class="content-main-between"
                                        value="1"
                                        ?checked=${template.data.template_save_for_all}
                                        label="${this.text('saveForEveryoneLabel')}"
                                ></sf-checkbox>
                        </form>
                    </div>
                </div>
                <div class="sf-table-context-bottom flex gap-1/3">
                    <sf-button @click="${() => {
      this.tempSettings = null;
      this.requestComponentUpdate('table');
    }}" type="outline" scheme="on-surface" root-class="flex-1"
                               text="${this.text('resetText')}"></sf-button>
                    <sf-button
                            ?disabled=${this.state.saveInputValue.length === 0}
                            @click="${() => {
      this.saveFilterTemplate();
    }}" root-class="flex-1" text="${this.text('applyText')}"></sf-button>
                </div>
                </div>
            </sf-context-menu>
        `;
  }

  saveFilterTemplate() {
    const form = this.refs.templateForm.value;
    if (!form) return false;
    const formData = Object.fromEntries(new FormData(form));
    const {
      templates
    } = this.state.filter;
    const prevTemplate = templates.filter(template => {
      return template.label === formData.template_name;
    })?.[0];
    const values = this.getCurrentFilterValues();
    const tags = this.getCurrentFilterTags();
    let template = {
      key: prevTemplate ? prevTemplate.key : `filter_template_${templates.length + 1}`,
      label: formData.template_name,
      selected: true,
      data: { ...formData,
        values,
        tags
      }
    };
    const detail = this.withFilterFieldSettings(template);
    this.dispatchEvent(new CustomEvent('onTemplateSave', {
      bubbles: true,
      composed: true,
      detail
    }));
    this.dispatchTableEvent('sf-table-template-save', detail);
    this.tempSettings = null;
    this.closeContextMenu();
  }

  renderRowSettingsContextMenu(data) {
    const {
      x,
      y,
      position,
      transform,
      items = this.getActionRowItems(data.row || {}).map(action => ({
        component: "sf-button",
        props: {
          type: "link",
          scheme: "on-surface",
          text: action.name,
          "@click": event => {
            const handler = action.component.props["@click"] || action.component.props.onClick;
            handler?.(event);
            this.closeContextMenu();
          }
        }
      }))
    } = data;
    let pos = `translateY(calc(${transform !== undefined ? transform : -50}%))`;

    if (position) {
      switch (position) {
        case "left-bottom":
        case "right-bottom":
          pos = `translateY(calc(${transform !== undefined ? transform : -100}% + var(--sf-context-menu-tail-corner-offset)))`;
          break;
      }
    }

    return (0,lit__WEBPACK_IMPORTED_MODULE_4__.html)`
            <sf-context-menu
                    :key=${x + y}
                    aria-label=${this.getContextMenuLabel({ ...data,
      menu: 'row-settings'
    })}
                    style="
            position: fixed;
            left: calc(${x}px + var(--sf-context-menu-tail-corner-offset));
            inset-block-start: ${y}px;
            transform: ${pos};
            z-index: var(--sf-table-context-menu--z-index, var(--sf-z-index-9));
          "
                    .items=${items}
                    position="${position || "left"}"
            >
            </sf-context-menu>
        `;
  }

  getColumnItems() {
    const dataColumns = this.getTableData().columns || [];
    const originalIndexByKey = new Map(dataColumns.map((column, index) => [column?.key, index]));

    const getOrder = column => {
      const order = column?.order;
      return order !== null && typeof order !== "undefined" && order !== "" && Number.isFinite(Number(order)) ? Number(order) : originalIndexByKey.get(column?.key) ?? 0;
    };

    return dataColumns.map(column => {
      const settings = this.getColumnSetting(column?.key);
      const nextColumn = { ...column,
        ...settings
      };

      if (settings.width) {
        nextColumn.colWidth = settings.width;
      }

      return nextColumn;
    }).sort((left, right) => {
      // The list reads like the table: the pinned group first, then
      // the rest of the visible columns, then the hidden ones. Sorting
      // by order alone put the hidden columns wherever their stored
      // order happened to fall — a consumer opened the settings and
      // found eight columns it had never shown standing above its own,
      // with the pinned one in the middle.
      const group = column => {
        if (this.isColumnPinned(column)) return 0;
        return this.isColumnVisible(column) ? 1 : 2;
      };

      const leftGroup = group(left);
      const rightGroup = group(right);

      if (leftGroup !== rightGroup) {
        return leftGroup - rightGroup;
      }

      const leftOrder = getOrder(left);
      const rightOrder = getOrder(right);

      if (leftOrder === rightOrder) {
        return (originalIndexByKey.get(left.key) ?? 0) - (originalIndexByKey.get(right.key) ?? 0);
      }

      return leftOrder - rightOrder;
    });
  } // Whether a column is shown. The answer the person is editing right now
  // wins, then what the host has stored, then what the column itself says.


  isColumnVisible(column) {
    if (!column?.key) return false;
    const pending = this.tempSettings?.cols?.[column.key];
    const setting = this.getColumnSetting(column.key) || {};
    return pending?.visible ?? setting.visible ?? column.visible !== false;
  }

  getColumnSettings() {
    const dataSettings = this.getTableData().columnSettings;
    const stateSettings = this.state?.columnSettings;
    const normalizedDataSettings = dataSettings && typeof dataSettings === "object" && !Array.isArray(dataSettings) ? dataSettings : {};
    const normalizedStateSettings = stateSettings && typeof stateSettings === "object" && !Array.isArray(stateSettings) ? stateSettings : {};
    return { ...normalizedDataSettings,
      ...normalizedStateSettings
    };
  }

  getColumnSetting(columnKey) {
    if (!columnKey) return {};
    const settings = this.getColumnSettings()?.[columnKey];
    return settings && typeof settings === "object" && !Array.isArray(settings) ? settings : {};
  }

  normalizeColumnSetting(settings = {}) {
    const nextSettings = {};
    Object.entries(settings || {}).forEach(([key, value]) => {
      if (typeof value === "undefined") {
        return;
      }

      if (key === "colWidth") {
        nextSettings.width = value;
        return;
      }

      nextSettings[key] = value;
    });

    if (typeof nextSettings.order !== "undefined" && nextSettings.order !== null && nextSettings.order !== "") {
      nextSettings.order = Number(nextSettings.order);
    }

    return nextSettings;
  }

  mergeColumnSettings(currentSettings = {}, patch = {}) {
    const nextSettings = { ...(currentSettings || {})
    };
    Object.entries(patch || {}).forEach(([columnKey, columnPatch]) => {
      if (!columnKey || !columnPatch || typeof columnPatch !== "object") {
        return;
      }

      nextSettings[columnKey] = this.normalizeColumnSetting({ ...(nextSettings[columnKey] || {}),
        ...columnPatch
      });
    });
    return nextSettings;
  } // The person asked for the default columns back. The component names no
  // defaults of its own — it says the layer should go, and the host answers
  // with whatever it considers default for this view.


  requestColumnSettingsReset() {
    return this.dispatchTableEvent("sf-table-column-settings-reset", Object.freeze({
      target: "personal",
      tableSettingsKey: this.getTableSettingsKey?.() ?? null
    }));
  }

  emitColumnSettingsChange(reason = "column-settings") {
    const detail = {
      reason,
      columnSettings: this.getColumnSettings(),
      tableSettingsKey: this.getTableSettingsKey()
    };
    this.dispatchEvent(new CustomEvent("sf-table:column-settings-change", {
      bubbles: true,
      composed: true,
      detail
    }));
    this.dispatchTableEvent('sf-table-column-settings-change', detail);
    this.dispatchEvent(new CustomEvent("onColumnSettingsChange", {
      bubbles: true,
      composed: true,
      detail
    }));
    return this;
  }

  setColumnSettings(settings = {}, reason = "column-settings", emit = true) {
    const nextSettings = typeof settings === "function" ? settings(this.getColumnSettings()) : settings;
    return this.set({
      columnSettings: nextSettings && typeof nextSettings === "object" ? nextSettings : {}
    }, reason, () => emit ? this.emitColumnSettingsChange(reason) : false);
  }

  patchColumnSettings(columnKey, patch = {}, reason = "column-settings") {
    if (!columnKey) return this;
    const currentSetting = this.getColumnSetting(columnKey);
    const nextPatch = typeof patch === "function" ? patch(currentSetting) : patch;
    return this.patchColumnSettingsBatch({
      [columnKey]: nextPatch || {}
    }, reason);
  }

  patchColumnSettingsBatch(patch = {}, reason = "column-settings") {
    const currentSettings = this.getColumnSettings();
    const nextSettings = this.mergeColumnSettings(currentSettings, patch);

    if (JSON.stringify(currentSettings) === JSON.stringify(nextSettings)) {
      return this;
    }

    return this.setColumnSettings(nextSettings, reason);
  }

  getFilterFields() {
    const fields = this.state?.filter?.fields;
    return Array.isArray(fields) ? fields : [];
  }

  getFilterField(fieldKey) {
    if (!fieldKey) return null;
    return this.getFilterFields().find(field => field?.key === fieldKey) || null;
  }

  setFilterFields(fields = [], reason = "filter-fields") {
    for (const page of this._filterOptionPages.values()) {
      page.controller?.abort();
      clearTimeout(page.searchTimer);
    }

    this._filterOptionPages.clear();

    return this.set(prevState => ({
      filter: { ...(prevState.filter || {}),
        fields: Array.isArray(fields) ? fields : []
      }
    }), reason);
  }

  patchTempColumnSettings(columnKey, patch = {}) {
    if (!columnKey) return;
    this.tempSettings = { ...(this.tempSettings || {}),
      cols: { ...(this.tempSettings?.cols || {}),
        [columnKey]: { ...(this.tempSettings?.cols?.[columnKey] || {}),
          ...(typeof patch === "function" ? patch() : patch)
        }
      }
    };
  }

  patchTempFilterTagSettings(columnKey, patch = {}) {
    if (!columnKey) return;
    this.tempSettings = { ...(this.tempSettings || {}),
      filter: { ...(this.tempSettings?.filter || {}),
        tags: { ...(this.tempSettings?.filter?.tags || {}),
          [columnKey]: { ...(this.tempSettings?.filter?.tags?.[columnKey] || {}),
            ...(typeof patch === "function" ? patch() : patch)
          }
        }
      }
    }; // The same defect the pins had: a patch is a plain property, so nothing
    // redrew and anything reading the draft kept the state it was drawn
    // with -- here the button that says how many conditions are pending.
    // Switching a condition on is a checkbox, so a redraw costs nothing a
    // person can feel.

    this.requestComponentUpdate('filter-tag');
  }

  patchTempFilterValue(fieldKey, patch = {}) {
    if (!fieldKey) return;
    const currentValues = this.getCurrentFilterValues(this.getPendingFilterState());
    const currentValue = this.tempSettings?.filter?.values?.[fieldKey] || currentValues[fieldKey] || {};
    const nextPatch = typeof patch === "function" ? patch(currentValue) : patch;
    const nextValue = { ...currentValue,
      ...(nextPatch || {})
    };

    const isSameValue = (current, next) => {
      if (!Array.isArray(current) || !Array.isArray(next)) {
        return Object.is(current, next);
      }

      if (current.length !== next.length) {
        return false;
      }

      return current.every((item, index) => Object.is(item, next[index]));
    };

    const changed = Object.keys(nextValue).some(key => !isSameValue(currentValue[key], nextValue[key]));

    if (!changed) {
      return;
    }

    this.tempSettings = { ...(this.tempSettings || {}),
      filter: { ...(this.tempSettings?.filter || {}),
        values: { ...(this.tempSettings?.filter?.values || {}),
          [fieldKey]: nextValue
        }
      }
    };
    this.requestComponentUpdate('temp-filter-value');
  }

  isEmptyFilterValue(value) {
    if (value === null || typeof value === "undefined") {
      return true;
    }

    if (Array.isArray(value)) {
      return value.every(item => this.isEmptyFilterValue(item));
    }

    if (typeof value === "string") {
      return value.trim() === "";
    }

    if (value && typeof value === "object") {
      return Object.values(value).every(item => this.isEmptyFilterValue(item));
    }

    return false;
  }

  isEmptyFilterEntry(entry) {
    if (!entry || typeof entry !== "object") {
      return this.isEmptyFilterValue(entry);
    }

    if (Object.prototype.hasOwnProperty.call(entry, "values")) {
      return this.isEmptyFilterValue(entry.values);
    }

    if (Object.prototype.hasOwnProperty.call(entry, "value")) {
      return this.isEmptyFilterValue(entry.value);
    }

    return Object.entries(entry).filter(([key]) => !["operator", "control", "type"].includes(key)).every(([, value]) => this.isEmptyFilterValue(value));
  }

  mergeFilterState(prevFilter = {}, tempFilter = {}) {
    const {
      filter,
      tags,
      values
    } = this.getMergedFilterDraftData(prevFilter, tempFilter);
    return this.patchFilterTemplateData(filter, {
      tags,
      values
    });
  } // What the person typed over the list of fields. Kept in state so the list
  // and the field agree after a render; there can be hundreds of fields and
  // scrolling for one is not an answer.


  setColumnSettingsQuery(value = "") {
    return this.set({
      columnSettingsQuery: String(value ?? "")
    });
  } // Case and ё/е are not differences a person means when searching.


  matchesColumnQuery(label = "", query = "") {
    const normalise = value => String(value ?? "").toLowerCase().replace(/ё/gu, "е");

    const needle = normalise(query).trim();
    if (!needle) return true;
    return normalise(label).includes(needle);
  }

  getColumnCheckboxItems(options = {}) {
    const {
      checked,
      onChange,
      refPrefix = "column"
    } = options;
    const {
      pin = false,
      handle = false,
      query = ""
    } = options;
    return this.getColumnItems().filter(col => !pin || col.system || this.matchesColumnQuery(col.label, query)).map(col => {
      const itemRef = this.getItemRef(`${refPrefix}:${col.key}`) || false;
      const isChecked = typeof checked === "function" ? Boolean(checked(col)) : Boolean(checked);
      const box = (0,lit__WEBPACK_IMPORTED_MODULE_4__.html)`
                <sf-checkbox
                    size="1"
                    label=${col.label}
                    position="end"
                    root-class="content-main-between"
                    ?checked=${isChecked}
                    ${(0,lit_directives_ref_js__WEBPACK_IMPORTED_MODULE_5__.ref)(itemRef)}
                    @change=${event => onChange?.(col, event)}
                ></sf-checkbox>
            `;

      if (!pin || col.system) {
        return box;
      } // The pin sits beside the visibility box, because both are answers
      // about the same column. The box and the row menu are always pinned
      // and are offered nothing.


      const pinned = this.isColumnPinned(col);
      return (0,lit__WEBPACK_IMPORTED_MODULE_4__.html)`
                <div class="sf-table-column-option flex items-cross-center gap-1/3"
                     data-column-key=${col.key}
                     data-pinned=${pinned ? "1" : "0"}>
                    ${handle ? (0,lit__WEBPACK_IMPORTED_MODULE_4__.html)`<sf-icon-button
                                size="1/2"
                                type="link"
                                scheme="on-surface"
                                icon="drag_indicator"
                                data-move
                                root-class="sf-table-column-move cursor-grab"
                                aria-label=${`${this.text("columnMoveLabel", "column-move-label")}: ${col.label || col.key}`}
                            ></sf-icon-button>` : lit__WEBPACK_IMPORTED_MODULE_4__.nothing}
                    <span class="flex-1 min-w-0">${box}</span>
                    <!-- A pinned column's pin is filled and a loose one's is
                         outlined, the way a pinned filter template already
                         shows itself. Colour alone had to carry the state, and
                         the two schemes are close enough that a person reading
                         a list of twenty pins could not tell which were set. -->
                    <sf-icon-button
                        size="1/2"
                        type="link"
                        scheme=${pinned ? "primary" : "on-surface"}
                        ?filled=${pinned}
                        icon="push_pin"
                        title=${pinned ? this.text("unpinColumnLabel", "unpin-column-label") : this.text("pinColumnLabel", "pin-column-label")}
                        aria-label=${pinned ? this.text("unpinColumnLabel", "unpin-column-label") : this.text("pinColumnLabel", "pin-column-label")}
                        aria-pressed=${pinned ? "true" : "false"}
                        @click=${() => this.toggleColumnPinned(col)}
                    ></sf-icon-button>
                </div>
            `;
    });
  } // «Сбросить» in the column settings: the state the window opened with,
  // applied at once and announced once -- not the host's defaults, which is
  // what the filter window's own Reset asks for.


  restoreColumnSettingsOnOpen(reason = 'column-settings-restore') {
    const columnSettings = JSON.parse(JSON.stringify(this._columnSettingsOnOpen || {}));
    this.tempSettings = null;
    this.set(prevState => ({ ...prevState,
      columnSettings
    }), reason, () => this.emitColumnSettingsChange(reason));
    return this;
  } // What «Применить» did, as a method, so a control that applies on the spot
  // does exactly the same thing rather than its own version of it.


  commitColumnSettings(reason = 'table-settings') {
    const tempSettings = this.tempSettings || {};
    const {
      cols: tempColumns,
      ...rest
    } = tempSettings;
    if (!tempColumns) return this;
    const columnSettings = this.mergeColumnSettings(this.getColumnSettings(), tempColumns);
    this.tempSettings = Object.keys(rest).length ? rest : null;
    this.set(prevState => ({ ...prevState,
      columnSettings
    }), reason, () => this.emitColumnSettingsChange(reason));
    return this;
  } // Pinning a column puts it at the end of the pinned block, unpinning it at
  // the start of the loose ones — the place a person expects what they just
  // moved to be, rather than wherever its old order number happens to land it.


  toggleColumnPinned(col) {
    if (!col?.key || col.system) return this;
    const next = !this.isColumnPinned(col);
    const columns = this.getColumnItems().filter(column => column?.key && !column.system);
    const orders = columns.map((column, index) => {
      const pending = this.tempSettings?.cols?.[column.key];
      const setting = this.getColumnSetting(column.key) || {};
      const value = Number(pending?.order ?? setting.order ?? column.order);
      return Number.isFinite(value) ? value : (index + 1) * 10;
    });
    const group = columns.map((column, index) => ({
      column,
      order: orders[index]
    })).filter(entry => entry.column.key !== col.key && this.isColumnPinned(entry.column) === next);
    const order = next ? Math.max(0, ...group.map(entry => entry.order)) + 10 : Math.min(...group.map(entry => entry.order), 10) - 10;
    this.patchTempColumnSettings(col.key, {
      pinned: next,
      order
    }); // The patch is a plain property, so nothing re-rendered and the pin kept
    // the state it was drawn with: every pin read aria-pressed="false", a
    // press looked like it had done nothing, and the only visible effect was
    // the row moving into the pinned group on some later render.

    this.requestComponentUpdate('column-pin'); // A pin applies on the spot and reaches the host, by the consumer
    // owner's decision of 2026-10-05. Before it, a press wrote a draft that
    // a click outside the window threw away without saying so, and with the
    // window's own buttons below the fold that read as "pins do not work".

    this.commitColumnSettings('column-pin');
    return this;
  }

  getTableColsData() {
    return this.getColumnCheckboxItems({
      pin: true,
      handle: true,
      query: this.state.columnSettingsQuery || "",
      refPrefix: "table-column",
      checked: col => this.isColumnVisible(col),
      onChange: (col, event) => {
        this.patchTempColumnSettings(col.key, {
          visible: Boolean(event.target?.checked)
        }); // Everything in this window applies at once, by the consumer
        // owner's decision of 2026-10-05, so a click outside loses
        // nothing and no «Применить» is left to press.

        this.commitColumnSettings('column-visibility');
      }
    });
  }

  getFilterTagColsData() {
    const fields = this.getFilterFields().filter(field => field?.filter?.enabled !== false);
    const items = fields.length ? fields : this.getColumnItems();
    return items.map(field => {
      const pending = this.tempSettings?.filter?.tags?.[field.key];
      const current = this.getCurrentFilterTags(this.getPendingFilterState())?.[field.key];
      const data = {
        type: "checkbox",
        props: {
          size: 1,
          label: field.label,
          position: 'end',
          rootClass: 'content-main-between',
          checked: pending?.active ?? current?.active ?? false,
          ':ref': this.getItemRef(`filter-tag-column:${field.key}`) || false,
          '@change': event => {
            this.patchTempFilterTagSettings(field.key, {
              active: Boolean(event.target?.checked),
              label: field.label,
              control: field.filter?.control || field.type || field.dataType || 'text'
            });
          }
        }
      };
      return this.renderSmartElement(data.type, data.props);
    });
  }

  getFilterControlValue(fieldKey) {
    return { ...(this.getCurrentFilterValues()?.[fieldKey] || {}),
      ...(this.tempSettings?.filter?.values?.[fieldKey] || {})
    };
  }

  getFilterOptions(field = {}) {
    const filter = field.filter || {};
    const source = filter.optionsSource || {};

    if (source.type === 'endpoint') {
      const page = this.getEndpointFilterPage(field);
      const selected = new Set(this.getFilterControlValue(field.key).values || []);
      const options = new Map();

      for (const option of [...(page?.selected || []), ...(page?.items || [])]) {
        if (typeof option?.value === 'string' && typeof option?.label === 'string') {
          if (selected.has(option.value) || (page?.items || []).includes(option)) {
            options.set(option.value, option);
          }
        }
      }

      return [...options.values()];
    }

    if (Array.isArray(filter.options)) {
      return filter.options;
    }

    if (Array.isArray(source.items)) {
      return source.items;
    }

    return [];
  }

  getEndpointFilterPage(field = {}) {
    const source = field.filter?.optionsSource;

    if (source?.type !== 'endpoint' || typeof source.url !== 'string' || !source.url.trim() || !field.key) {
      return null;
    }

    let page = this._filterOptionPages.get(field.key);

    if (!page || page.url !== source.url) {
      page?.controller?.abort();
      page = {
        url: source.url,
        items: [],
        selected: [],
        nextCursor: null,
        status: 'idle',
        sequence: 0,
        searchable: false
      };

      this._filterOptionPages.set(field.key, page);

      queueMicrotask(() => {
        if (this.isConnected && this._filterOptionPages.get(field.key) === page) {
          this.loadEndpointFilterPage(field);
        }
      });
    }

    return page;
  }

  async loadEndpointFilterPage(field = {}, cursor = null, search = '') {
    const page = this.getEndpointFilterPage(field);
    if (!page || !this.isConnected) return false;
    let url;

    try {
      url = new URL(page.url, globalThis.location?.href);
      if (url.origin !== globalThis.location?.origin) throw new TypeError('filter_options_cross_origin');
    } catch {
      page.status = 'error';
      this.requestComponentUpdate('filter-options');
      return false;
    }

    page.controller?.abort();
    const controller = new AbortController();
    const sequence = ++page.sequence;
    page.controller = controller;
    page.status = 'loading';
    url.searchParams.set('limit', '50');
    url.searchParams.set('sequence', String(sequence));
    if (cursor) url.searchParams.set('cursor', cursor);else url.searchParams.delete('cursor');
    if (search && page.searchable) url.searchParams.set('search', search);else url.searchParams.delete('search');
    url.searchParams.delete('selected_values[]');

    for (const value of this.getFilterControlValue(field.key).values || []) {
      if (typeof value === 'string') url.searchParams.append('selected_values[]', value);
    }

    this.requestComponentUpdate('filter-options');

    try {
      const response = await fetch(url, {
        credentials: 'same-origin',
        signal: controller.signal,
        headers: {
          Accept: 'application/json'
        }
      });
      const answer = await response.json();
      if (page.sequence !== sequence || this._filterOptionPages.get(field.key) !== page || !this.isConnected) return false;

      if (!response.ok || answer?.status !== 'ok' || answer.sequence !== sequence || !Array.isArray(answer.items) || !Array.isArray(answer.selected) || answer.next_cursor !== null && typeof answer.next_cursor !== 'string') {
        throw new TypeError('filter_options_answer_invalid');
      }

      const clean = items => items.filter(item => typeof item?.value === 'string' && item.value && typeof item?.label === 'string' && item.label).map(({
        value,
        label
      }) => ({
        value,
        label
      }));

      const merged = new Map((cursor ? page.items : []).map(item => [item.value, item]));

      for (const item of clean(answer.items)) merged.set(item.value, item);

      page.items = [...merged.values()];
      page.selected = clean(answer.selected);
      page.nextCursor = answer.next_cursor;
      page.searchable = answer.searchable === true;
      page.status = 'ready';
      this.requestComponentUpdate('filter-options');
      return true;
    } catch (error) {
      if (page.sequence !== sequence || error?.name === 'AbortError') return false;
      page.status = 'error';
      this.requestComponentUpdate('filter-options');
      return false;
    }
  }

  getFilterOptionSearch(fieldKey) {
    if (!fieldKey) return '';
    return this.tempSettings?.filterSearch?.[fieldKey] || '';
  }

  patchTempFilterOptionSearch(fieldKey, value = '') {
    if (!fieldKey) return;
    this.tempSettings = { ...(this.tempSettings || {}),
      filterSearch: { ...(this.tempSettings?.filterSearch || {}),
        [fieldKey]: String(value || '')
      }
    };
    this.requestComponentUpdate('filter-option-search');
    const field = this.getFilterField(fieldKey);
    const page = field && this.getEndpointFilterPage(field);

    if (page?.searchable) {
      clearTimeout(page.searchTimer);
      page.searchTimer = setTimeout(() => this.loadEndpointFilterPage(field, null, String(value || '').trim()), 200);
    }
  }

  filterUpdate() {
    return this.getFilterPayload();
  }

  getFilterOptionSearchKeys(field = {}) {
    const keys = field.filter?.searchKeys || field.filter?.optionSearchKeys;

    if (Array.isArray(keys) && keys.length) {
      return keys;
    }

    return ['label', 'title', 'name', 'text', 'value', 'id'];
  }

  getObjectPathValue(source = {}, path = '') {
    return String(path || '').split('.').filter(Boolean).reduce((value, key) => {
      if (value === null || typeof value === 'undefined') {
        return '';
      }

      return value[key];
    }, source);
  }

  normalizeFilterSearchValue(value = '') {
    return String(value || '').trim().toLowerCase();
  }

  optionMatchesSearch(option = {}, search = '', keys = []) {
    const query = this.normalizeFilterSearchValue(search);
    if (!query) return true;
    return keys.some(key => {
      const value = this.getObjectPathValue(option, key);
      return this.normalizeFilterSearchValue(value).includes(query);
    });
  }

  getVisibleFilterOptions(field = {}) {
    const options = this.getFilterOptions(field);
    const search = this.getFilterOptionSearch(field.key);

    if (!search) {
      return options;
    }

    const keys = this.getFilterOptionSearchKeys(field);
    return options.filter(option => this.optionMatchesSearch(option, search, keys));
  } // A cell for a column that names a property type: the Framework's renderer
  // for that type, or nothing, in which case the value renders as itself. A
  // host that passes its own component never reaches here -- the escape hatch
  // is that the host's choice is consulted first, by the template.
  // The set answers with a cell value in the shape a host would pass -- a
  // string, an object with a component, or a list of those -- so the template
  // renders it through the path it already had. The set adds no second way to
  // draw a cell.


  getTypedCellValue(column = {}, value) {
    // The host is passed so `formatFieldValue` is reachable from a cell. It
    // was reachable from the record panel and not from the list -- the
    // panel hands the renderer set its port, the table handed it nothing --
    // so the same date read «25 сентября 2026» in a card and
    // «2026-09-25T07:12:00+03:00» in a row, and a consumer had no way to
    // change the second. The set still refuses to guess a format; this only
    // lets the host say one (admin polygon, 2026-10-10).
    return (0,_field_renderers_index_js__WEBPACK_IMPORTED_MODULE_3__.renderCellField)(column, value, this.cellHost ?? null);
  } // The filter controls were the Framework's only type-aware rendering, and
  // Larena's request asks for one renderer set shared by the record view and
  // the table's cells. Keeping these here as well would have made two maps
  // for one question, so they moved into src/smart/field-renderers and this
  // asks the set. The host interface is small on purpose: the set renders,
  // the table owns the state.


  renderFilterControl(field = {}) {
    return (0,_field_renderers_index_js__WEBPACK_IMPORTED_MODULE_3__.renderFilterField)(field, {
      getFilterControlValue: key => this.getFilterControlValue(key),
      patchTempFilterValue: (key, patch) => this.patchTempFilterValue(key, patch),
      getFilterOperatorLabel: operator => this.getFilterOperatorLabel(operator),
      getFilterOptionSearch: key => this.getFilterOptionSearch(key),
      patchTempFilterOptionSearch: (key, search) => this.patchTempFilterOptionSearch(key, search),
      getVisibleFilterOptions: item => this.getVisibleFilterOptions(item),
      renderFilterOption: (item, option) => this.renderFilterOption(item, option),
      getEndpointFilterPage: item => this.getEndpointFilterPage(item),
      loadEndpointFilterPage: (item, cursor, search) => this.loadEndpointFilterPage(item, cursor, search)
    });
  }

  renderFilterOption(field = {}, option = {}, selected = new Set()) {
    const value = option.value ?? option.id ?? option.key ?? option.label ?? option.title;
    const label = option.label || option.title || String(value || '');
    const badge = field.filter?.optionRenderer === 'badge' ? (0,_js_option_badge_js__WEBPACK_IMPORTED_MODULE_2__.optionBadgeProps)(option) : null;
    return (0,lit__WEBPACK_IMPORTED_MODULE_4__.html)`
            <div
                    ${(0,lit_directives_ref_js__WEBPACK_IMPORTED_MODULE_5__.ref)(this.getItemRef(option.label))}
                    class="flex items-cross-center gap-1/2 content-main-between">
                <div class="flex items-cross-center gap-1/2 min-w-0">
                    ${badge ? (0,lit__WEBPACK_IMPORTED_MODULE_4__.html)`
                        <sf-badge
                                type="tonal"
                                scheme=${badge.scheme}
                                root-style=${badge.rootStyle || lit__WEBPACK_IMPORTED_MODULE_4__.nothing}
                                icon=${option.icon || lit__WEBPACK_IMPORTED_MODULE_4__.nothing}
                                text=${label}
                        ></sf-badge>
                    ` : (0,lit__WEBPACK_IMPORTED_MODULE_4__.html)`
                        ${this.renderFilterOptionVisual(field, option)}
                        <span class="sf-text-1 truncate">${label}</span>
                    `}
                </div>
                <sf-checkbox
                        size="1"
                        position="end"
                        root-class="content-main-between"
                        ?checked=${selected.has(value)}
                        @change=${event => {
      const nextSelected = new Set(selected);

      if (event.target?.checked) {
        nextSelected.add(value);
      } else {
        nextSelected.delete(value);
      }

      this.patchTempFilterValue(field.key, {
        values: Array.from(nextSelected),
        operator: field.filter?.defaultOperator || 'in'
      });
    }}
                ></sf-checkbox>
            </div>
        `;
  }

  renderFilterOptionVisual(field = {}, option = {}) {
    if (field.filter?.optionRenderer !== 'avatar-checkbox') {
      return '';
    }

    if (option.imageUrl) {
      return (0,lit__WEBPACK_IMPORTED_MODULE_4__.html)`
                <sf-avatar
                        size="1"
                        image-url="${option.imageUrl}"
                        title="${option.title || option.label || ''}"
                ></sf-avatar>
            `;
    }

    return (0,lit__WEBPACK_IMPORTED_MODULE_4__.html)`
            <sf-avatar
                    size="1"
                    title="${option.avatarText || option.title || option.label || ''}"
            ></sf-avatar>
        `;
  }

  getFilterOperatorLabel(operator) {
    const keys = {
      eq: 'operatorEq',
      gt: 'operatorGt',
      gte: 'operatorGte',
      lt: 'operatorLt',
      lte: 'operatorLte',
      between: 'operatorBetween',
      contains: 'operatorContains',
      startsWith: 'operatorStartsWith',
      any: 'operatorAny',
      today: 'operatorToday',
      week: 'operatorWeek',
      month: 'operatorMonth',
      in: 'operatorIn'
    }; // An operator nobody has a word for is shown as it is stored, which is
    // better than a blank and says what to add.

    return keys[operator] ? this.text(keys[operator]) : operator;
  }

  renderFilterSettingsContextMenu(data) {
    const {
      x,
      y,
      position,
      columnCount,
      columnsCount,
      transform
    } = data;
    let pos = `translateX(${transform !== undefined ? transform : 0}%)`;
    const pendingFilter = this.getPendingFilterState(); // What a press would change, so the button can say it. The button is
    // already a filled primary one, so an extra fill or ring would say
    // nothing: the count is the marked state, and with nothing pending the
    // button reads exactly as it did before. sf-button carries no `filled`
    // property -- that belongs to the icon button -- so setting one would
    // have been an attribute nobody reads.

    const pendingConditions = this.countPendingFilterConditionChanges();
    const selectedTemplateKey = pendingFilter.selectedTemplateKey;
    const sortTemplates = this.getSortedFilterTemplates(pendingFilter).map(col => {
      let component;
      const isActiveEdit = this.state.filter.rename === col.key;

      if (this.state.filter.rename !== col.key) {
        const data = {
          type: "radio",
          props: {
            size: 1,
            label: col.label,
            name: 'filter_templates',
            checked: selectedTemplateKey ? selectedTemplateKey === col.key : col.selected || false,
            '@change': () => {
              this.selectTempFilterTemplate(col.key);
            }
          }
        };
        component = this.renderSmartElement(data.type, data.props);
      } else {
        component = (0,lit__WEBPACK_IMPORTED_MODULE_4__.html)`
                    <div class="flex items-cross-center gap-1/4 flex-1">
                        <sf-input ${(0,lit_directives_ref_js__WEBPACK_IMPORTED_MODULE_5__.ref)(this.refs.renameInput)} root-class="flex-1"
                                  default-value="${col.label}"></sf-input>
                        <div class="flex items-cross-center flex-none">
                            <sf-icon-button segment="start" type="outline" scheme="on-surface" @click="${() => {
          this.set(prevState => ({
            filter: { ...(prevState.filter || {}),
              rename: ''
            }
          }));
        }}"
                                            icon="close"></sf-icon-button>
                            <sf-icon-button segment="end" icon="check" @click="${() => {
          const name = this.refs.renameInput.value?.value;
          this.saveFilterTemplatePatch(col.key, {
            label: name
          }, {
            filterPatch: {
              rename: ''
            },
            saveInputValue: name
          });
        }}"></sf-icon-button>
                        </div>
                    </div>`;
      }

      return (0,lit__WEBPACK_IMPORTED_MODULE_4__.html)`
                <div
                        :key=${col.key}
                        ${(0,lit_directives_ref_js__WEBPACK_IMPORTED_MODULE_5__.ref)(this.getItemRef(col.label))}
                        class="sf-settings-context-menu-item flex items-cross-center flex-1 gap-1/3 ${col.deleted ? 'opacity-3' : ''}"
                        data-filter-template-key="${col.key}"
                        data-pinned="${col.pinned ? "1" : "0"}"
                >
                    ${!isActiveEdit ? (0,lit__WEBPACK_IMPORTED_MODULE_4__.html)`
                        <sf-icon-button
                                id="${this.getInstanceId()}--template-move--${col.key}"
                                type="link"
                                data-move
                                scheme="on-surface"
                                aria-label="Set order"
                                icon="drag_indicator"
                                root-class="cursor-move"
                        ></sf-icon-button>` : lit__WEBPACK_IMPORTED_MODULE_4__.nothing}
                    ${component}
                    ${!isActiveEdit ? (0,lit__WEBPACK_IMPORTED_MODULE_4__.html)`
                        <div class="flex items-cross-center m-inline-start-auto gap-1/3">
                            <sf-icon-button
                                    type="link"
                                    data-keep
                                    size="1/3"
                                    scheme="on-surface"
                                    aria-label="Keep item"
                                    ?filled="${col.pinned}"
                                    root-class="${col.pinned ? 'sf-button-pinned' : ''}"
                                    icon="keep"
                                    @click=${() => {
        this.patchTempFilterTemplateSettings(col.key, {
          pinned: !col.pinned
        });
      }}
                            ></sf-icon-button>
                            <sf-icon-button
                                    type="link"
                                    data-settings
                                    data-context-submenu-anchor="${col.key}"
                                    scheme="on-surface"
                                    aria-label="Item Settings"
                                    icon="more_vert"
                                    @click=${event => {
        this.openContextSubmenu(event, {
          type: 'filter-template-actions',
          template: col
        });
      }}
                            ></sf-icon-button>
                        </div>` : lit__WEBPACK_IMPORTED_MODULE_4__.nothing}
                </div>`;
    });
    const menuColumnCount = columnCount ?? columnsCount ?? this.contextMenuColumns ?? 1;
    const colsData = this.getFilterTagColsData();
    const columnGroups = this.splitItemsByColumns(colsData, menuColumnCount);
    let contextItems = `${this.text('templatesTabText')}|${this.text('fieldsTabText')}`;
    return (0,lit__WEBPACK_IMPORTED_MODULE_4__.html)`
            <sf-context-menu
                    :key=${x + y + this._renderToken}
                    aria-label=${this.getContextMenuLabel({ ...data,
      menu: 'filter-settings'
    })}
                    style="
            position: fixed;
            left: ${x}px;
            inset-block-start: calc(${y}px + calc(var(--sf-focus-outline-width) * 2));
            transform: ${pos};
            z-index: var(--sf-table-context-menu--z-index, var(--sf-z-index-9));
            --sf-table-context-menu--max-block-size: calc(100dvh - ${y}px - var(--sf-space-4));
          "
                    root-class="sf-table-context-menu flex flex-col"
                    position="${position || ""}"
            >
                <div class="sf-table-context-body flex flex-col flex-1" slot="content">
                    <sf-tabs items="${contextItems}" type="underline">
                        <div slot="panel-0" class="flex">
                            <div
                                    class="sf-context-menu-columns flex flex-col gap-1/4 overflow-auto flex-1"
                                    data-filter-template-list
                            >
                                ${sortTemplates}
                            </div>
                        </div>
                        <div slot="panel-1">
                            <div class="sf-context-menu-columns flex flex-1 gap-1 overflow-auto">
                                ${columnGroups.map(group => (0,lit__WEBPACK_IMPORTED_MODULE_4__.html)`
                                            <div class="flex flex-col gap-1 flex-1">
                                                ${group}
                                            </div>
                                        `)}
                            </div>
                        </div>

                    </sf-tabs>
                    <div class="sf-table-context-bottom flex gap-1/3">
                        <sf-button @click="${() => {
      // Reset means the defaults, not "forget what I just
      // typed here": the draft goes, and the host is asked
      // to clear the person's own layer — order, widths,
      // visibility and pinning — because the defaults are
      // the host's to decide, not this component's.
      this.tempSettings = null;
      this.requestComponentUpdate('table');
      this.requestColumnSettingsReset();
    }}" type="outline" scheme="on-surface" root-class="flex-1"
                                   text="${this.text('resetText')}"></sf-button>
                        <sf-button @click="${() => {
      const tempFilter = this.tempSettings?.filter;

      if (tempFilter) {
        let changedTemplates = [];
        let deletedKeys = [];
        let selectedKey = null;
        this.set(prevState => {
          const hasDataChanges = this.hasPendingFilterDataChanges(prevState.filter || {});
          const filter = this.mergeFilterState(prevState.filter || {}, tempFilter);
          const selectedTemplate = this.getSelectedFilterTemplate(filter);
          changedTemplates = tempFilter.templates ? this.getChangedFilterTemplates(prevState.filter || {}, filter, ['order', 'pinned', 'deleted', 'selected', 'default']) : [];
          deletedKeys = filter.templates.filter(template => template.deleted && template.key).map(template => template.key);
          filter.templates = filter.templates.filter(el => !el.deleted);
          const previousKey = this.getSelectedFilterTemplate(prevState.filter || {})?.key || null;
          selectedKey = selectedTemplate?.key && selectedTemplate.key !== previousKey ? selectedTemplate.key : null;
          return {
            filter,
            filterDataDirty: prevState.filterDataDirty || hasDataChanges,
            saveInputValue: selectedTemplate?.label || ""
          };
        }, () => {
          if (changedTemplates.length) {
            this.dispatchFilterTemplatesSave(changedTemplates);
          }

          for (const key of deletedKeys) {
            this.dispatchTableEvent('sf-table-template-delete', Object.freeze({
              key
            }));
          }

          if (selectedKey) {
            this.dispatchTableEvent('sf-table-template-select', Object.freeze({
              key: selectedKey
            }));
          }
        });
      }

      this.tempSettings = null;
      this.closeContextMenu();
    }}" root-class="flex-1"
                                   aria-label=${pendingConditions ? `${this.text("filterApplyText", "filter-apply-text")}: ${pendingConditions}` : this.text("filterApplyText", "filter-apply-text")}
                                   text=${pendingConditions ? `${this.text("filterApplyText", "filter-apply-text")} (${pendingConditions})` : this.text("filterApplyText", "filter-apply-text")}></sf-button>
                    </div>
                </div>
            </sf-context-menu>
        `;
  }

  renderTagsSettingsContextMenu(data) {
    const {
      x,
      y,
      position,
      fieldKey
    } = data;
    const field = this.getFilterField(fieldKey) || {
      key: fieldKey,
      label: this.getCurrentFilterTags()?.[fieldKey]?.label || fieldKey || '',
      filter: {
        control: this.getCurrentFilterTags()?.[fieldKey]?.control || 'text'
      }
    };
    return (0,lit__WEBPACK_IMPORTED_MODULE_4__.html)`
            <sf-context-menu
                    :key=${x + y + this._renderToken}
                    aria-label=${this.getContextMenuLabel({ ...data,
      menu: 'tag-settings'
    })}
                    style="
            position: fixed;
            left: ${x}px;
            inset-block-start: calc(${y}px + calc(var(--sf-focus-outline-width) * 2));
            z-index: var(--sf-table-context-menu--z-index, var(--sf-z-index-9));
          "
                    root-class="sf-table-context-menu flex flex-col"
                    position="${position || ""}"
            >
                <div class="flex flex-col flex-1 p-top-3" slot="content">
                    <div class="sf-table-context-main">
                        <div class="sf-table-tags-search flex flex-col">
                            <div class="flex flex-col p-bottom-3">
                                ${this.renderFilterControl(field)}
                            </div>
                        </div>
                    </div>
                    <div class="sf-table-context-bottom flex gap-1/3">
                        <sf-button @click="${() => {
      this.tempSettings = null;
      this.requestComponentUpdate('table');
    }}" type="outline" scheme="on-surface" root-class="flex-1"
                                   text="${this.text('resetText')}"></sf-button>
                        <sf-button @click="${() => {
      const tempFilter = this.tempSettings?.filter;

      if (tempFilter) {
        this.set(prevState => {
          const hasDataChanges = this.hasPendingFilterDataChanges(prevState.filter || {});
          return {
            filter: this.mergeFilterState(prevState.filter || {}, tempFilter),
            filterDataDirty: prevState.filterDataDirty || hasDataChanges
          };
        }, () => {
          const detail = this.filterUpdate();
          this.dispatchEvent(new CustomEvent('onFilterUpdate', {
            bubbles: true,
            composed: true,
            detail
          }));
          this.dispatchTableEvent('sf-table-filter-change', detail);
        });
      }

      this.tempSettings = null;
      this.closeContextMenu();
    }}" root-class="flex-1" text="${this.text('applyText')}"></sf-button>
                    </div>
                </div>
            </sf-context-menu>
        `;
  }

  removeFilterTag(id = null) {
    if (id) {
      this.tempSettings = null;
      this.set(prevState => {
        const prevFilter = prevState.filter || {};
        const tags = { ...this.getCurrentFilterTags(prevFilter)
        };
        const values = { ...this.getCurrentFilterValues(prevFilter)
        };
        delete tags[id];
        delete values[id];
        return {
          filter: this.patchFilterTemplateData(prevFilter, {
            tags,
            values
          }),
          filterDataDirty: true
        };
      }, () => {
        const detail = this.filterUpdate();
        this.dispatchEvent(new CustomEvent('onFilterUpdate', {
          bubbles: true,
          composed: true,
          detail
        }));
        this.dispatchTableEvent('sf-table-filter-change', detail);
      });
      return this;
    }

    this.tempSettings = null;
    this.set(prevState => {
      const prevFilter = prevState.filter || {};
      return {
        filter: { ...prevFilter,
          selectedTemplateKey: "",
          templates: this.getFilterTemplates(prevFilter).map(template => ({ ...template,
            selected: false
          }))
        },
        saveInputValue: "",
        filterDataDirty: false
      };
    }, () => {
      const detail = this.filterUpdate();
      this.dispatchEvent(new CustomEvent('onFilterUpdate', {
        bubbles: true,
        composed: true,
        detail
      }));
      this.dispatchTableEvent('sf-table-filter-change', detail);
    });
    return this;
  }

  renderTableSettingsContextMenu(data) {
    const {
      x,
      y,
      position,
      transform,
      columnCount,
      columnsCount
    } = data;
    let pos = `translateX(${transform !== undefined ? transform : 0}%)`;
    const menuColumnCount = columnCount ?? columnsCount ?? this.contextMenuColumns ?? 1;
    const cols = this.getTableColsData();
    const query = this.state.columnSettingsQuery || ""; // The settings window is about the columns. Its "Actions" tab was asked
    // to go on 2026-10-02: row actions are offered in the row's own menu and
    // bulk actions in the band under the table, so a third place to find
    // them taught nobody anything.

    return (0,lit__WEBPACK_IMPORTED_MODULE_4__.html)`
            <sf-context-menu
                    :key=${x + y + this._renderToken}
                    aria-label=${this.getContextMenuLabel({ ...data,
      menu: 'table-settings'
    })}
                    style="
            position: fixed;
            left: ${x}px;
            inset-block-start: calc(${y}px + calc(var(--sf-focus-outline-width) * 2));
            transform: ${pos};
            z-index: var(--sf-table-context-menu--z-index, var(--sf-z-index-9));
            --sf-table-context-menu--max-block-size: calc(100dvh - ${y}px - var(--sf-space-4));
          "
                    root-class="sf-table-context-menu flex flex-col"
                    position="${position || ""}"
            >
                <div class="sf-table-context-body flex flex-col flex-1" slot="content">
                    <!-- One tab held one panel, so its title said only that the
                         window is about fields, which the window already says.
                         The search is here instead: a site can have hundreds of
                         fields, and scrolling for one is not an answer. -->
                    <label class="sf-table-column-search flex flex-col">
                        <sf-input
                            size="1"
                            type="bordered"
                            root-class="sf-table-column-search-input"
                            name="sf_table_column_search"
                            .value=${query}
                            placeholder=${this.getProp('columnSearchPlaceholder')}
                            aria-label=${this.getProp('columnSearchPlaceholder')}
                            @input=${event => this.setColumnSettingsQuery(event.target?.value ?? "")}
                        ></sf-input>
                    </label>
                    <div class="sf-context-menu-columns flex flex-col flex-1 gap-1/3 overflow-auto"
                         data-column-settings-list>
                        ${cols.length ? cols : (0,lit__WEBPACK_IMPORTED_MODULE_4__.html)`<div class="sf-table-column-empty p-1 color-on-surface-variant">
                                ${this.getProp('columnSearchEmptyText')}
                            </div>`}
                    </div>
                    <!-- «Применить» went with the consumer owner's decision of
                         2026-10-05: every control in this window applies as it
                         is pressed, so a button that commits has nothing left
                         to commit. «Сбросить» is the way back -- the settings as
                         they stood when the window was opened, applied at once
                         and announced once. -->
                    <div class="sf-table-context-bottom flex gap-1/3">
                        <sf-button @click="${() => this.restoreColumnSettingsOnOpen()}"
                                   type="outline" scheme="on-surface" root-class="flex-1"
                                   text="${this.text('resetText')}"></sf-button>
                    </div>
                </div>
            </sf-context-menu>
        `;
  }

  renderMainContextMenu(data) {
    const menu = data.menu || data.menuType || data.contextMenu;

    switch (menu) {
      case 'row-settings':
        return this.renderRowSettingsContextMenu(data);

      case 'create':
        return this.renderCreateContextMenu(data);

      case 'toolbar-actions':
        return this.renderToolbarActionsContextMenu(data);

      case 'filter-favorites':
        return this.renderFilterFavoritesContextMenu(data);

      case 'filter-settings':
        return this.renderFilterSettingsContextMenu(data);

      case 'table-settings':
        return this.renderTableSettingsContextMenu(data);

      case 'tag-settings':
        return this.renderTagsSettingsContextMenu(data);

      default:
        return data.type === 'left' ? this.renderRowSettingsContextMenu(data) : this.renderTableSettingsContextMenu(data);
    }
  }

  renderTemplateActionsContextSubmenu(data) {
    const {
      x,
      y,
      position,
      transform,
      template = {}
    } = data;
    let pos = `translateY(${transform !== undefined ? transform : 0}%)`;
    const temp = this.getFilterTemplateByKey(template.key, this.tempSettings?.filter || null);
    let isDeleted = (temp || template).deleted;
    const isDefaultTemplate = (temp || template).default === true;
    return (0,lit__WEBPACK_IMPORTED_MODULE_4__.html)`
            <sf-context-menu
                    :key=${`${template.key || ''}-${x}-${y}`}
                    aria-label=${this.getContextMenuLabel({ ...data,
      type: 'filter-template-actions'
    })}
                    style="
          position: fixed;
        left: calc(${x}px + var(--sf-context-menu-tail-corner-offset));
            inset-block-start: ${y}px;
          z-index: var(--sf-table-context-submenu--z-index, var(--sf-z-index-9));
          transform: ${pos}
        "
                    data-context-submenu
                    root-class="sf-table-context-submenu flex flex-col"
                    position="${position || "right"}"
            >
                <div class="flex flex-col flex-1" slot="content">
                    <sf-button type="link" scheme="on-surface" icon-left="edit" text="${this.text('renameText')}" @click="${() => {
      this.set(prevState => ({
        filter: { ...(prevState.filter || {}),
          rename: template.key
        },
        contextMenu: { ...(prevState.contextMenu || {}),
          submenu: null
        }
      }));
    }}"></sf-button>
                    <sf-button type="link" scheme="on-surface" icon-left="${isDefaultTemplate ? 'remove' : 'check'}"
                               text="${isDefaultTemplate ? this.text('defaultTemplateText') : this.text('makeDefaultLabel')}" @click="${() => {
      this.changeTempFilterTemplateSettings(template.key, {
        default: !template.default
      });
      this.closeContextSubmenu();
    }}"></sf-button>
                    <sf-button type="link" scheme="on-surface" icon-left="delete" @click="${() => {
      this.patchTempFilterTemplateSettings(template.key, {
        deleted: !isDeleted
      });
    }}" text="${isDeleted ? this.text('restoreText') : this.text('deleteActionText')}"></sf-button>
                </div>
            </sf-context-menu>
        `;
  }

  renderContextSubmenu(data) {
    switch (data?.type) {
      case 'filter-template-actions':
        return this.renderTemplateActionsContextSubmenu(data);

      default:
        return lit__WEBPACK_IMPORTED_MODULE_4__.nothing;
    }
  }

  renderContextMenu(data) {
    if (!data?.open) {
      (0,lit__WEBPACK_IMPORTED_MODULE_4__.render)(null, this.getPortalContainer());
      return lit__WEBPACK_IMPORTED_MODULE_4__.nothing;
    }

    (0,lit__WEBPACK_IMPORTED_MODULE_4__.render)((0,lit__WEBPACK_IMPORTED_MODULE_4__.html)`
                <div
                        class="sf-table-context-layer"
                        ${(0,lit_directives_ref_js__WEBPACK_IMPORTED_MODULE_5__.ref)(this.refs.contextMenu)}
                        @click=${event => this.handleContextLayerClick(event)}
                >
                    ${this.renderMainContextMenu(data)}
                    ${data.submenu?.open ? this.renderContextSubmenu(data.submenu) : lit__WEBPACK_IMPORTED_MODULE_4__.nothing}
                </div>
            `, this.getPortalContainer());
    this.bindContextEvent();
    this.bindContextViewport();
    requestAnimationFrame(() => {
      this.bindFilterTemplateDrag();
      this.bindColumnSettingsDrag();
      this.clampContextMenusToViewport(); // The menu lives in the portal, not in this element's own tree.

      this.redrawWhenComponentsUpgrade(this.getPortalContainer());
    });
    return lit__WEBPACK_IMPORTED_MODULE_4__.nothing;
  }

  getActionItems() {
    return this.state.actions.map(action => {
      const data = {
        type: "checkbox",
        props: {
          size: 1,
          label: action.name,
          position: 'end',
          rootClass: 'content-main-between',
          checked: action.visible,
          "@change": e => {
            let actionActive = false;
            let arr = this.tempSettings && this.tempSettings.actions ? this.tempSettings.actions : this.state.actions;
            const items = arr.map(item => {
              let visible = item.id === action.id ? e.target.checked : item.visible;

              if (visible) {
                actionActive = true;
              }

              return { ...item,
                visible: visible
              };
            });
            this.tempSettings = { ...(this.tempSettings || {}),
              actionActive,
              actions: items
            };
          }
        }
      };
      return this.renderSmartElement(data.type, data.props);
    });
  }

  hoverEvents(e) {
    if (this._columnResizeState || this._columnDragState?.started) {
      return;
    }

    const th = e.target.closest('th');

    if (!th) {
      return;
    }

    const wrap = th.querySelector('.sidebar-resizer');

    if (!wrap) {
      return;
    }

    th.classList.add('hover'); // The line belongs to the handle, not to the header. Shown on any
    // header hover it read as if the column were already being resized, and
    // it crossed the rows whenever the pointer merely passed over a title.

    if (this.getColumnResizeHandle(e.target)) {
      this.showColumnResizeGuide(th);
    } else {
      this.hideColumnResizeGuide();
    }
  }

  outEvent(e) {
    if (this._columnResizeState || this._columnDragState?.started) {
      return;
    }

    const th = e.target.closest('th');

    if (!th) {
      return;
    }

    const wrap = th.querySelector('.sidebar-resizer');

    if (!wrap) {
      return;
    }

    th.classList.remove('hover');
    this.hideColumnResizeGuide();
  }
  /**
   * The line that shows where a column edge will land runs through the rows
   * only, from the bottom of the head to the last row. A head cell cannot draw
   * it: a pseudo-element of a `th` has no way to reach into the body, and the
   * body's height is not known to CSS. So it is one element in the scroll
   * area, placed against the edge being dragged.
   */


  showColumnResizeGuide(th) {
    const guide = this.refs.resizeGuide?.value;
    const scroll = this.refs.scroll?.value;
    const table = this.refs.table?.value;

    if (!guide || !scroll || !th || !table) {
      return;
    }

    const head = table.querySelector('thead');
    const body = table.querySelector('tbody');

    if (!head || !body) {
      this.hideColumnResizeGuide();
      return;
    }

    const area = scroll.getBoundingClientRect();
    const cell = th.getBoundingClientRect();
    const headBox = head.getBoundingClientRect();
    const bodyBox = body.getBoundingClientRect();

    if (bodyBox.height <= 0) {
      this.hideColumnResizeGuide();
      return;
    } // The line continues the header's separator, so it is placed on that
    // separator rather than on the cell's outer edge: the separator is the
    // cell's own border, which occupies the last pixels inside the box.
    //
    // Nothing here is rounded. Rounding to whole pixels put the line beside
    // the separator whenever the cell's edge fell on a fraction -- which is
    // what a column width in rem or a root size of 87.5% produces, and what
    // the consumer measured as one pixel aside.


    const border = parseFloat(getComputedStyle(th).borderInlineEndWidth) || 0;
    const inlineStart = this.isRightToLeft() ? cell.left - area.left + scroll.scrollLeft : cell.right - area.left + scroll.scrollLeft - border;
    guide.style.insetInlineStart = `${inlineStart}px`;
    guide.style.insetBlockStart = `${headBox.bottom - area.top + scroll.scrollTop}px`;
    guide.style.blockSize = `${bodyBox.height}px`;
    guide.hidden = false;
  }

  hideColumnResizeGuide() {
    const guide = this.refs.resizeGuide?.value;

    if (guide) {
      guide.hidden = true;
    }
  }

  isRightToLeft() {
    return getComputedStyle(this).direction === 'rtl';
  }

  bindHoverEvent() {
    if (this._hoverEventBound) return;
    this._hoverEventBound = true;
    const table = this.refs.table?.value;
    table?.addEventListener('mouseover', this.hoverEvents);
    table?.addEventListener('mouseout', this.outEvent); //
    // this.addEventListener('mouseout', () => {
    //     this.querySelectorAll('.hover')
    //         .forEach(el => el.classList.remove('hover'));
    // });
  }

  unBindHoverEvent() {
    if (!this._hoverEventBound) {
      return;
    }

    const table = this.refs.table?.value;
    table?.removeEventListener('mouseover', this.hoverEvents);
    table?.removeEventListener('mouseout', this.outEvent);
    this._hoverEventBound = false;
  }

  bindColumnResizeEvent() {
    if (this._columnResizeEventBound) return;
    const table = this.refs.table?.value;
    if (!table) return;
    table.addEventListener('pointerdown', this.onColumnResizePointerDown);
    this._columnResizeEventBound = true;
  }

  unbindColumnResizeEvent() {
    if (!this._columnResizeEventBound) {
      return;
    }

    const table = this.refs.table?.value;
    table?.removeEventListener('pointerdown', this.onColumnResizePointerDown);
    this._columnResizeEventBound = false;
  }

  bindColumnDragEvent() {
    if (this._columnDragEventBound) return;
    const table = this.refs.table?.value;
    if (!table) return;
    table.addEventListener('pointerdown', this.onColumnDragPointerDown);
    this._columnDragEventBound = true;
  }

  unbindColumnDragEvent() {
    if (!this._columnDragEventBound) {
      return;
    }

    const table = this.refs.table?.value;
    table?.removeEventListener('pointerdown', this.onColumnDragPointerDown);
    this._columnDragEventBound = false;
  }

  getColumnResizeHandle(target) {
    if (!(target instanceof Element)) {
      return null;
    } // The handle is found by the attribute it carries, not by a prefix of its
    // id. The id is built from the instance, so it never began with
    // `column_resizer_`: pointerdown on the handle was not recognised as a
    // resize and fell through to the column-move handler, which is why
    // dragging the edge moved the column instead of changing its width.


    return target.closest('[data-sf-column-resizer]');
  }

  getColumnDragHeader(target) {
    if (!(target instanceof Element)) {
      return null;
    }

    if (this.getColumnResizeHandle(target)) {
      return null;
    }

    return target.closest('th[data-key]');
  }

  parseColumnSize(value, fallback = null) {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === 'string') {
      const normalized = value.trim();

      if (/^-?\d+(\.\d+)?px$/.test(normalized)) {
        return parseFloat(normalized);
      }
    }

    return fallback;
  }

  resolveCssLength(value, fallback = 0) {
    const normalized = String(value || '').trim();
    const match = normalized.match(/^(-?\d+(?:\.\d+)?)(px|rem|em)$/);

    if (!match) {
      return fallback;
    }

    const amount = Number(match[1]);
    const unit = match[2];

    if (unit === 'px') {
      return amount;
    }

    const reference = unit === 'rem' ? document.documentElement : this;
    const fontSize = parseFloat(getComputedStyle(reference).fontSize);
    return Number.isFinite(fontSize) ? amount * fontSize : fallback;
  }

  getColumnResizeLimits(column = {}, fallbackWidth = 0) {
    const semanticMinWidth = this.resolveCssLength(getComputedStyle(this).getPropertyValue('--sf-c4'), fallbackWidth);
    const minWidth = this.parseColumnSize(column.minWidth, null) ?? semanticMinWidth;
    const maxWidth = this.parseColumnSize(column.maxWidth, Infinity);
    return {
      minWidth,
      maxWidth: Math.max(maxWidth, minWidth)
    };
  }

  resizeColumnByKeyboard(event, key) {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) {
      return;
    }

    const table = this.refs.table?.value;
    const escapedKey = this.escapeColumnKey(key);
    const th = table?.querySelector(`th[data-key="${escapedKey}"]`);
    const column = this.getColumns().find(item => item?.key === key);

    if (!th || !column || column.system || column.resizable === false) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    const currentWidth = th.getBoundingClientRect().width;
    const {
      minWidth,
      maxWidth
    } = this.getColumnResizeLimits(column, currentWidth);
    const step = this.resolveCssLength(getComputedStyle(this).getPropertyValue('--sf-space-1'), 1);
    const direction = getComputedStyle(table).direction === 'rtl' ? -1 : 1;
    const keyDirection = event.key === 'ArrowRight' ? 1 : -1;
    const nextWidth = Math.min(Math.max(currentWidth + step * direction * keyDirection, minWidth), maxWidth);
    this.applyColumnResizeWidths(key, nextWidth);
    requestAnimationFrame(() => {
      // The strip is a button itself, so it is the focus target; it used
      // to be the inner control of an icon button.
      this.querySelector(`th[data-key="${escapedKey}"] .sf-table-column-resizer`)?.focus?.();
      this.showColumnResizeGuide(th);
    });
  }

  hasColumnSize(column = {}) {
    return [column.colWidth, column.width, column.size].some(value => value !== null && typeof value !== 'undefined' && String(value).trim() !== '');
  }

  escapeColumnKey(key) {
    const value = String(key || '');

    if (typeof CSS !== 'undefined' && typeof CSS.escape === 'function') {
      return CSS.escape(value);
    }

    return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  }

  freezeColumnsWidthForResize(table) {
    const frozenWidths = {};
    const columns = this.getColumns();
    columns.forEach(column => {
      if (!column?.key) {
        return;
      }

      const key = String(column.key);
      const escapedKey = this.escapeColumnKey(key);
      const th = table?.querySelector(`th[data-key="${escapedKey}"]`);
      const col = table?.querySelector(`col[data-key="${escapedKey}"]`);
      const width = th?.getBoundingClientRect?.().width || 0;

      if (!width) {
        return;
      }

      const nextWidth = `${Math.round(width)}px`;

      if (col) {
        col.style.width = nextWidth;
      }

      if (!column.system && !this.hasColumnSize(column)) {
        frozenWidths[key] = nextWidth;
      }
    });
    return frozenWidths;
  }

  applyColumnResizeWidths(key, width, frozenWidths = {}) {
    if (!key) {
      return this;
    }

    const nextWidths = { ...(frozenWidths || {}),
      [key]: `${Math.round(width)}px`
    };
    const settingsPatch = Object.fromEntries(Object.entries(nextWidths).map(([columnKey, columnWidth]) => [columnKey, {
      width: columnWidth
    }]));
    return this.patchColumnSettingsBatch(settingsPatch, 'column-resize');
  }

  getColumnDragLayout(table) {
    const columns = this.getColumns();
    return columns.filter(column => column?.key && !column.system && column.draggable !== false).map(column => {
      const key = String(column.key);
      const escapedKey = this.escapeColumnKey(key);
      const th = table?.querySelector(`th[data-key="${escapedKey}"]`);
      const rect = th?.getBoundingClientRect?.();

      if (!th || !rect) {
        return null;
      }

      return {
        key,
        column,
        th,
        left: rect.left,
        right: rect.right,
        width: rect.width,
        middle: rect.left + rect.width / 2,
        cellIndex: th.cellIndex
      };
    }).sort((left, right) => left.cellIndex - right.cellIndex).filter(Boolean);
  }

  getColumnDragDropIndex(layout, x, draggingKey) {
    const items = layout.filter(item => item.key !== draggingKey);

    for (let index = 0; index < items.length; index += 1) {
      if (x < items[index].middle) {
        return index;
      }
    }

    return items.length;
  }

  getVisibleUserColumnKeysFromDom(table) {
    const systemKeys = new Set(this.getSystemColumns().map(column => String(column.key)));
    const headerCells = Array.from(table?.tHead?.rows?.[0]?.cells || []);
    return headerCells.map(cell => cell?.dataset?.key).filter(key => key && !systemKeys.has(String(key)));
  }

  reorderColumnDomByKeys(table, userKeys = []) {
    if (!table || !Array.isArray(userKeys) || !userKeys.length) {
      return;
    }

    const moveKeyedChildren = (container, selector) => {
      if (!container) {
        return;
      }

      const userKeySet = new Set(userKeys);
      let insertAfter = null;

      for (const child of Array.from(container.children || [])) {
        const childKey = child?.dataset?.key;

        if (childKey && userKeySet.has(childKey)) {
          break;
        }

        if (childKey) {
          insertAfter = child;
        }
      }

      userKeys.forEach(key => {
        const escapedKey = this.escapeColumnKey(key);
        const child = container.querySelector(`${selector}[data-key="${escapedKey}"]`);

        if (child) {
          container.insertBefore(child, insertAfter?.nextSibling || container.firstChild);
          insertAfter = child;
        }
      });
    };

    moveKeyedChildren(table.querySelector('colgroup'), 'col');
    moveKeyedChildren(table.tHead?.rows?.[0], 'th');
    Array.from(table.tBodies || []).forEach(tbody => {
      Array.from(tbody.rows || []).forEach(row => {
        moveKeyedChildren(row, 'td');
      });
    });
  }

  getColumnAnimationCells(table) {
    return Array.from(table?.querySelectorAll('thead th[data-key], tbody td[data-key]') || []).filter(cell => cell instanceof HTMLElement);
  }

  snapshotColumnCellRects(table) {
    const rects = new Map();
    this.getColumnAnimationCells(table).forEach(cell => {
      rects.set(cell, cell.getBoundingClientRect());
    });
    return rects;
  }

  clearColumnAnimationStyles(table = this.refs.table?.value) {
    this._columnAnimationToken += 1;
    this.getColumnAnimationCells(table).forEach(cell => {
      cell.style.transition = '';
      cell.style.transform = '';
      cell.style.willChange = '';
    });
  }

  clearColumnDragDom(table = this.refs.table?.value) {
    table?.querySelectorAll(['.is-column-dragging', '.is-column-drag-placeholder-cell', '.is-column-drag-before', '.is-column-drag-after'].join(',')).forEach(cell => {
      cell.classList.remove('is-column-dragging', 'is-column-drag-placeholder-cell', 'is-column-drag-before', 'is-column-drag-after');
    });
    document.querySelectorAll('.sf-table-column-drag-ghost').forEach(ghost => ghost.remove());
    document.documentElement.classList.remove('sf-table-column-dragging');
  }

  animateColumnReorder(table, beforeRects) {
    if (!table || !(beforeRects instanceof Map)) {
      return;
    }

    const animationToken = ++this._columnAnimationToken;
    const cells = this.getColumnAnimationCells(table);
    cells.forEach(cell => {
      const before = beforeRects.get(cell);

      if (!before) {
        return;
      }

      const after = cell.getBoundingClientRect();
      const deltaX = before.left - after.left;

      if (Math.abs(deltaX) < 1) {
        return;
      }

      cell.style.transition = 'none';
      cell.style.transform = `translate3d(${deltaX}px, 0, 0)`;
      cell.style.willChange = 'transform';
    });
    requestAnimationFrame(() => {
      if (animationToken !== this._columnAnimationToken) {
        return;
      }

      cells.forEach(cell => {
        if (!cell.style.transform) {
          return;
        }

        cell.style.transition = 'transform 140ms ease';
        cell.style.transform = 'translate3d(0, 0, 0)';
      });
      window.setTimeout(() => {
        if (animationToken !== this._columnAnimationToken) {
          return;
        }

        cells.forEach(cell => {
          cell.style.transition = '';
          cell.style.transform = '';
          cell.style.willChange = '';
        });
      }, 160);
    });
  }

  updateColumnDragPreview(state, dropIndex) {
    if (!state || state.dropIndex === dropIndex) {
      return;
    }

    state.layout.forEach(item => {
      item.th.classList.remove('is-column-drag-before', 'is-column-drag-after');
    });
    state.dropIndex = dropIndex;
    const items = state.layout.filter(item => item.key !== state.key);
    const nextKeys = items.map(item => item.key);
    nextKeys.splice(Math.max(0, Math.min(dropIndex, nextKeys.length)), 0, state.key);

    if (nextKeys.join('|') === state.currentKeys?.join('|')) {
      return;
    }

    state.currentKeys = nextKeys;
    const beforeRects = this.snapshotColumnCellRects(state.table);
    this.reorderColumnDomByKeys(state.table, nextKeys);
    this.animateColumnReorder(state.table, beforeRects);
    state.layout = this.getColumnDragLayout(state.table);
    this.setColumnDragPlaceholderClass(state.key, true, state.table);
    const target = state.layout.find(item => item.key === state.key);

    if (!target) {
      return;
    }

    target.th.classList.add('is-column-dragging');
  }

  setColumnDragPlaceholderClass(key, active, table = this.refs.table?.value) {
    if (!key || !table) {
      return;
    }

    const escapedKey = this.escapeColumnKey(key);
    table.querySelectorAll(`th[data-key="${escapedKey}"], td[data-key="${escapedKey}"]`).forEach(cell => {
      cell.classList.toggle('is-column-dragging', Boolean(active));
      cell.classList.toggle('is-column-drag-placeholder-cell', Boolean(active));
    });
  }

  createColumnDragGhost(th) {
    const rect = th.getBoundingClientRect();
    const ghost = document.createElement('div');
    const label = th?.dataset?.label || th?.textContent?.replace(/\s+/g, ' ').trim() || '';
    ghost.textContent = label;
    ghost.classList.add('sf-table-column-drag-ghost');
    Object.assign(ghost.style, {
      position: 'fixed',
      left: `${rect.left}px`,
      top: `${rect.top}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      zIndex: 'var(--sf-table-drag-ghost--z-index, var(--sf-z-index-9))',
      pointerEvents: 'none',
      boxSizing: 'border-box'
    });
    ghost.setAttribute('aria-hidden', 'true');
    document.body.append(ghost);
    return ghost;
  }

  clearColumnDragState(commit = false, event = null) {
    const state = this._columnDragState;
    document.removeEventListener('pointermove', this.onColumnDragPointerMove);
    document.removeEventListener('pointerup', this.onColumnDragPointerUp);
    document.removeEventListener('pointercancel', this.onColumnDragPointerCancel);
    document.documentElement.classList.remove('sf-table-column-dragging');

    if (!state) {
      this.clearColumnAnimationStyles();
      this.clearColumnDragDom();
      (0,_helpers_loaderDragState__WEBPACK_IMPORTED_MODULE_9__.setLoaderDragState)(false);
      return;
    } // A drop is decided in a frame, and a short drag can end before that
    // frame ever runs: the pointer goes down, moves a few times and comes
    // up inside one frame. Cancelling then threw the decision away and the
    // move did nothing at all, which is exactly what a consumer saw on a
    // quick drag. The pending decision is made now instead.


    if (state.frame) {
      if (commit) {
        this.flushColumnDragPreview(state);
      } else {
        cancelAnimationFrame(state.frame);
        state.frame = null;
      }
    }

    state.handle?.releasePointerCapture?.(event?.pointerId);

    if (state.started) {
      this.suppressNextHeaderClick();
    }

    state.ghost?.remove();
    this.clearColumnAnimationStyles(state.table);
    this.setColumnDragPlaceholderClass(state.key, false, state.table);
    state.th?.classList.remove('is-column-dragging');
    state.layout?.forEach(item => {
      item.th.classList.remove('is-column-drag-before', 'is-column-drag-after');
    }); // The order to commit is the one the drag worked out, not the one the
    // cells happen to be in. The preview moves cells by hand, so reading
    // the order back from the DOM worked only as long as nothing re-rendered
    // in between — and a host hands its rows back on every answer, which
    // puts the cells back and made the whole move disappear without a word.
    // The DOM is still read when the drag never updated a preview, so a
    // reorder by any other means is not lost either.

    const previewKeys = Array.isArray(state.currentKeys) ? state.currentKeys : [];
    const domKeys = this.getVisibleUserColumnKeysFromDom(state.table);
    const nextKeys = previewKeys.length ? previewKeys : domKeys;
    const shouldCommit = commit && state.started && nextKeys.length && nextKeys.join('|') !== state.originalKeys?.join('|');
    this._columnDragState = null;
    this.clearColumnDragDom(state.table);
    (0,_helpers_loaderDragState__WEBPACK_IMPORTED_MODULE_9__.setLoaderDragState)(false); // The preview moved header and body cells by hand, between Lit's part
    // markers. Put every node back exactly as it was, so a committed order
    // renders over the DOM Lit knows (otherwise moved cells stay and the
    // columns appear twice) and a cancelled drag leaves nothing behind.
    // The order update runs in a microtask, before the next paint.

    if (state.started) {
      this.restoreColumnDom(state.domSnapshot);
    }

    if (!shouldCommit) {
      return;
    }

    this.applyColumnOrder(nextKeys, state.frozenWidths);
  }

  snapshotColumnDom(table) {
    if (!table) return [];
    const containers = [table.querySelector('colgroup'), table.tHead?.rows?.[0], ...Array.from(table.tBodies || []).flatMap(tbody => Array.from(tbody.rows || []))].filter(Boolean);
    return containers.map(container => ({
      container,
      nodes: Array.from(container.childNodes)
    }));
  }

  restoreColumnDom(snapshot = []) {
    for (const {
      container,
      nodes
    } of snapshot || []) {
      if (!container.isConnected || nodes.some(node => node.parentNode !== container)) continue;
      container.append(...nodes);
    }
  }

  applyColumnOrder(userKeys = [], frozenWidths = {}) {
    // Moving a column rearranges the columns the person can see, among the
    // places those columns already occupy. Numbering every draggable
    // column from ten upward instead renumbered the hidden ones too, and a
    // hidden column has no place on screen to be numbered from, so they
    // came out ahead of everything: a consumer dropped one column one place
    // to the left and found its nine visible columns pushed behind seven it
    // had never shown. Hidden columns keep their order, so they keep their
    // place between the visible ones when they are shown again.
    if (!Array.isArray(userKeys) || !userKeys.length) {
      return this;
    }

    const settingsPatch = {};
    const slots = this.getColumnOrderSlots(userKeys);
    userKeys.forEach((key, index) => {
      settingsPatch[key] = {
        order: slots[index]
      };

      if (frozenWidths?.[key]) {
        settingsPatch[key].width = frozenWidths[key];
      }
    });
    return this.patchColumnSettingsBatch(settingsPatch, 'column-drag');
  } // The places the moved columns already occupy, in order. A column whose
  // order nobody has ever set takes the place its position gives it, so a
  // first move on an untouched layout still numbers in tens.


  getColumnOrderSlots(userKeys = []) {
    const all = (this.getTableData().columns || []).filter(column => column?.key && !column.system);

    const effective = (column, index) => {
      const setting = this.getColumnSetting(column.key) || {};
      const value = setting.order ?? column.order;
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : (index + 1) * 10;
    };

    const current = new Map(all.map((column, index) => [String(column.key), effective(column, index)]));
    const taken = userKeys.map(key => current.get(String(key))).filter(value => Number.isFinite(value)).sort((left, right) => left - right); // Two columns can share a place when a host sends the same order twice.
    // Then the places are rebuilt from the positions, which cannot collide.

    const distinct = new Set(taken);

    if (taken.length !== userKeys.length || distinct.size !== taken.length) {
      return userKeys.map((_, index) => (index + 1) * 10);
    }

    return taken;
  }

  setColumnResizeClasses(th, delta = 0) {
    if (!th) return;
    th.classList.add('is-resizing');
    th.classList.toggle('is-resizing-forward', delta >= 0);
    th.classList.toggle('is-resizing-backward', delta < 0); // The line follows the edge while it is dragged, not only on hover.

    this.showColumnResizeGuide(th); // Resizing a pinned column moves every pinned column after it.

    this.measurePinnedColumns();
  }

  clearColumnResizeClasses(th) {
    if (!th) return;
    th.classList.remove('is-resizing', 'is-resizing-forward', 'is-resizing-backward');
    this.hideColumnResizeGuide();
    this.measurePinnedColumns();
  }

  onColumnDragPointerDown(event) {
    if (event.button !== 0 || this._columnResizeState) {
      return;
    }

    const th = this.getColumnDragHeader(event.target);
    const key = th?.dataset?.key;

    if (!th || !key) {
      return;
    }

    const table = this.refs.table?.value;
    this.clearColumnAnimationStyles(table);
    this.clearColumnDragDom(table);
    const layout = this.getColumnDragLayout(table);
    const column = layout.find(item => item.key === key);
    const userKeys = layout.map(item => item.key);

    if (!column || layout.length < 2) {
      return;
    }

    this._columnDragState = {
      key,
      th,
      table,
      handle: th,
      startRect: th.getBoundingClientRect(),
      startX: event.clientX,
      startY: event.clientY,
      shiftX: event.clientX - column.left,
      shiftY: event.clientY - th.getBoundingClientRect().top,
      originalIndex: layout.findIndex(item => item.key === key),
      originalKeys: userKeys,
      currentKeys: userKeys,
      dropIndex: null,
      layout,
      started: false,
      ghost: null,
      frozenWidths: null
    };
    th.setPointerCapture?.(event.pointerId);
    document.addEventListener('pointermove', this.onColumnDragPointerMove);
    document.addEventListener('pointerup', this.onColumnDragPointerUp, {
      once: true
    });
    document.addEventListener('pointercancel', this.onColumnDragPointerCancel, {
      once: true
    });
  } // A render in the middle of a drag replaces the header cells, and the drag
  // was left holding the old ones: the ghost kept moving while the drop was
  // computed against elements no longer in the page. The cells are found
  // again by the column key, which a render cannot change.


  reconnectColumnDragState(state) {
    const table = this.refs.table?.value;

    if (!table) {
      return false;
    }

    if (state.table !== table || !state.th?.isConnected) {
      const escapedKey = this.escapeColumnKey(state.key);
      const th = table.querySelector(`th[data-key="${escapedKey}"]`);

      if (!th) {
        return false;
      }

      state.table = table;
      state.th = th;
      state.handle = th; // The preview's own marks went with the old cells, and so did the
      // widths frozen on them.

      state.frozenWidths = this.freezeColumnsWidthForResize(table);
      state.domSnapshot = this.snapshotColumnDom(table);
      state.dropIndex = null;
      state.layout = this.getColumnDragLayout(table);
      this.setColumnDragPlaceholderClass(state.key, true, table);
      th.classList.add('is-column-dragging');
    }

    return true;
  }

  onColumnDragPointerMove(event) {
    const state = this._columnDragState;

    if (!state) {
      return;
    }

    if (state.started && !this.reconnectColumnDragState(state)) {
      this.clearColumnDragState(false, event);
      return;
    }

    const deltaX = event.clientX - state.startX;
    const deltaY = event.clientY - state.startY;

    if (!state.started) {
      if (Math.abs(deltaX) < 4 && Math.abs(deltaY) < 4) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      state.started = true;
      state.domSnapshot = this.snapshotColumnDom(state.table);
      (0,_helpers_loaderDragState__WEBPACK_IMPORTED_MODULE_9__.setLoaderDragState)(true);
      state.frozenWidths = this.freezeColumnsWidthForResize(state.table);
      state.ghost = this.createColumnDragGhost(state.th);
      this.setColumnDragPlaceholderClass(state.key, true, state.table);
      document.documentElement.classList.add('sf-table-column-dragging');
    }

    if (state.frame) {
      state.latestEvent = event;
      return;
    }

    state.latestEvent = event;
    state.frame = requestAnimationFrame(() => {
      const latestEvent = state.latestEvent;
      state.frame = null;

      if (!latestEvent || !state.ghost) {
        return;
      }

      state.ghost.style.left = `${latestEvent.clientX - state.shiftX}px`;
      state.ghost.style.top = `${latestEvent.clientY - state.shiftY}px`;
      state.layout = this.getColumnDragLayout(state.table);
      const dropIndex = this.getColumnDragDropIndex(state.layout, latestEvent.clientX, state.key);
      this.updateColumnDragPreview(state, dropIndex);
    });
  }

  flushColumnDragPreview(state) {
    if (!state?.frame) {
      return this;
    }

    cancelAnimationFrame(state.frame);
    state.frame = null;
    const latestEvent = state.latestEvent;

    if (!latestEvent || !state.ghost) {
      return this;
    }

    state.layout = this.getColumnDragLayout(state.table);
    const dropIndex = this.getColumnDragDropIndex(state.layout, latestEvent.clientX, state.key);
    this.updateColumnDragPreview(state, dropIndex);
    return this;
  }

  onColumnDragPointerUp(event) {
    this.clearColumnDragState(true, event);
  }

  onColumnDragPointerCancel(event) {
    this.clearColumnDragState(false, event);
  }

  onColumnResizePointerDown(event) {
    const handle = this.getColumnResizeHandle(event.target);

    if (!handle) {
      return;
    }

    const th = handle.closest('th');
    const key = th?.dataset?.key;

    if (!th || !key) {
      return;
    }

    const column = this.getColumns().find(item => item?.key === key);

    if (!column || column.system || column.resizable === false) {
      return;
    }

    const table = this.refs.table?.value;
    const escapedKey = this.escapeColumnKey(key);
    const col = table?.querySelector(`col[data-key="${escapedKey}"]`);
    const startWidth = th.getBoundingClientRect().width;
    const limits = this.getColumnResizeLimits(column, startWidth);
    const frozenWidths = this.freezeColumnsWidthForResize(table);
    event.preventDefault();
    event.stopPropagation();
    this._columnResizeState = {
      key,
      th,
      col,
      startX: event.clientX,
      startWidth,
      width: startWidth,
      frozenWidths,
      ...limits
    }; // this.setColumnResizeClasses(th);

    (0,_helpers_loaderDragState__WEBPACK_IMPORTED_MODULE_9__.setLoaderDragState)(true);
    document.documentElement.classList.add('sf-table-column-resizing');
    document.addEventListener('pointermove', this.onColumnResizePointerMove);
    document.addEventListener('pointerup', this.onColumnResizePointerUp, {
      once: true
    });
    document.addEventListener('pointercancel', this.onColumnResizePointerUp, {
      once: true
    });
  }

  onColumnResizePointerMove(event) {
    const state = this._columnResizeState;

    if (!state) {
      return;
    }

    const delta = event.clientX - state.startX;
    state.width = Math.min(Math.max(state.startWidth + delta, state.minWidth), state.maxWidth);
    state.delta = delta;

    if (state.frame) {
      return;
    }

    state.frame = requestAnimationFrame(() => {
      state.frame = null; // this.setColumnResizeClasses(state.th, state.delta);

      if (state.col) {
        state.col.style.width = `${state.width}px`;
      }

      state.th.style.width = `${state.width}px`; // The line is placed from the cell's own edge, so it has to be
      // placed again in the same frame the edge moved in. Without this it
      // stayed where the drag began while the header moved away from it.

      this.showColumnResizeGuide(state.th);
    });
  }

  onColumnResizePointerUp() {
    const state = this._columnResizeState;
    document.removeEventListener('pointermove', this.onColumnResizePointerMove);
    document.removeEventListener('pointerup', this.onColumnResizePointerUp);
    document.removeEventListener('pointercancel', this.onColumnResizePointerUp);
    document.documentElement.classList.remove('sf-table-column-resizing');

    if (!state) {
      return;
    }

    (0,_helpers_loaderDragState__WEBPACK_IMPORTED_MODULE_9__.setLoaderDragState)(false);
    this.suppressNextHeaderClick(); // this.clearColumnResizeClasses(state.th);

    this._columnResizeState = null;
    this.outEvent({
      target: state.th
    });
    state.th.style.width = '';
    this.applyColumnResizeWidths(state.key, state.width, state.frozenWidths);
  }

  bindContextEvent() {
    if (this._contextEventBound) {
      return;
    }

    document.addEventListener("click", this.contextEvent);
    document.addEventListener("keydown", this.contextKeyEvent);
    this._contextEventBound = true;
  }

  unbindContextEvent() {
    if (!this._contextEventBound) {
      return;
    }

    document.removeEventListener("click", this.contextEvent);
    document.removeEventListener("keydown", this.contextKeyEvent);
    this._contextEventBound = false;
  }

  contextKeyEvent(event) {
    if (event.key !== 'Escape' || !this.state.contextMenu?.open) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    this.closeContextMenu(true);
  }

  getPortalContainer() {
    if (this._portalContainer?.isConnected) {
      return this._portalContainer;
    }

    const portal = document.createElement("div");
    portal.className = "sf-table-portal";
    portal.dataset.tableSettingsKey = this.getTableSettingsKey();
    portal.dataset.sfInstance = this.getInstanceId();
    document.body.append(portal);
    this._portalContainer = portal;
    return portal;
  }

  getVisualViewportRect() {
    const viewport = window.visualViewport;
    return {
      left: viewport?.offsetLeft || 0,
      top: viewport?.offsetTop || 0,
      right: (viewport?.offsetLeft || 0) + (viewport?.width || window.innerWidth),
      bottom: (viewport?.offsetTop || 0) + (viewport?.height || window.innerHeight)
    };
  }

  clampContextMenusToViewport() {
    const portal = this._portalContainer;

    if (!portal?.isConnected) {
      return;
    }

    const viewport = this.getVisualViewportRect();
    const rootStyle = getComputedStyle(document.documentElement);
    const inset = parseFloat(rootStyle.getPropertyValue('--sf-space-1/3')) || 0;
    const anchored = new Set();
    portal.querySelectorAll('sf-context-menu').forEach(menu => {
      if (this.anchorContextMenu(menu, viewport, inset)) {
        anchored.add(menu);
        return;
      }

      const availableInlineSize = Math.max(0, viewport.right - viewport.left - inset * 2);
      const availableBlockSize = Math.max(0, viewport.bottom - viewport.top - inset * 2); // Both names: the stylesheet reads the second one, and only the
      // first was written here, so a menu placed by click coordinates
      // never received the cap this line means to give it.

      menu.style.setProperty('--sf-table-context-menu--available-inline-size', `${availableInlineSize}px`);
      menu.style.setProperty('--sf-context-menu-available-inline-size', `${availableInlineSize}px`);
      menu.style.setProperty('--sf-context-menu-available-block-size', `${availableBlockSize}px`);
      menu.style.translate = '';
      const surface = menu.querySelector(':scope > .sf-context-menu') || menu;
      const rect = surface.getBoundingClientRect();
      let offsetX = 0;
      let offsetY = 0;

      if (rect.left < viewport.left + inset) {
        offsetX = viewport.left + inset - rect.left;
      } else if (rect.right > viewport.right - inset) {
        offsetX = viewport.right - inset - rect.right;
      }

      if (rect.top < viewport.top + inset) {
        offsetY = viewport.top + inset - rect.top;
      } else if (rect.bottom > viewport.bottom - inset) {
        offsetY = viewport.bottom - inset - rect.bottom;
      }

      if (offsetX || offsetY) {
        menu.style.translate = `${offsetX}px ${offsetY}px`;
      }
    });

    for (const [menu, entry] of this._contextPositions || []) {
      if (!anchored.has(menu)) {
        entry.controller.stop();

        this._contextPositions.delete(menu);
      }
    }
  } // Placement of an open menu relative to the element it was opened from:
  // menus with a tail (row actions, template actions) open beside it, the
  // others below it. null keeps the static click-coordinate placement.
  // Cells re-render their controls, so an opener can be replaced while its
  // menu is open. Remember where it sits (row cell, header, toolbar id) to
  // find its replacement.


  describeContextAnchor(anchor) {
    if (!(anchor instanceof Element)) return null;
    const host = anchor.closest('[data-item], th[data-key], [id]');
    if (!host || !this.contains(host)) return null;
    const selector = host.dataset.item !== undefined ? `[data-item="${this.escapeColumnKey(host.dataset.item)}"]` : host.matches('th[data-key]') ? `th[data-key="${this.escapeColumnKey(host.dataset.key)}"]` : `[id="${this.escapeColumnKey(host.id)}"]`;
    const tag = anchor.tagName.toLowerCase();
    return {
      selector,
      tag,
      index: host === anchor ? -1 : Array.from(host.querySelectorAll(tag)).indexOf(anchor)
    };
  }

  resolveContextAnchor(data) {
    if (data?.anchor instanceof Element && data.anchor.isConnected) return data.anchor;
    const ref = data?.anchorRef;
    const host = ref ? this.querySelector(ref.selector) : null;
    const anchor = host && (ref.index < 0 ? host : host.querySelectorAll(ref.tag)[ref.index]);
    if (!anchor) return null;
    data.anchor = anchor;
    return anchor;
  } // Menus opened from a control at the end of a row align to that control's
  // end edge, so they open under the button instead of hanging past it over
  // the next column. The consumer measured a menu whose left edge matched the
  // button's left and whose right edge stood 34 to 124px beyond it.


  getContextMenuPlacement(menu) {
    const isSubmenu = menu.hasAttribute('data-context-submenu');
    const data = isSubmenu ? this.state.contextMenu?.submenu : this.state.contextMenu;
    const anchor = this.resolveContextAnchor(data);
    if (!anchor) return null;
    const position = String(data.position || (isSubmenu || data.type === 'left' ? 'left' : ''));
    const family = /^(left|right)(-top|-bottom)?$/.exec(position);

    if (!family) {
      // A menu belonging to a control at the end of its row aligns to that
      // control's end edge; otherwise it hangs past the button and over
      // whatever is beside it. The create arrow and the view's actions are
      // both such controls.
      const toTheEnd = ['create', 'toolbar-actions'].includes(data.menu);
      return {
        anchor,
        side: 'block-end',
        align: toTheEnd ? 'end' : 'start',
        tail: null
      };
    }

    const suffix = family[2] || '';
    return {
      anchor,
      side: family[1] === 'left' ? 'inline-end' : 'inline-start',
      align: suffix === '-top' ? 'start' : suffix === '-bottom' ? 'end' : 'center',
      tail: suffix
    };
  } // Shared Framework geometry (SF.Position): the menu flips when its side
  // does not fit, shifts inside the viewport and follows its opener while
  // the page scrolls. Sizes are written to the rendered surface, not the
  // boxless host, so they never re-render the menu over this placement.


  anchorContextMenu(menu, viewport, inset) {
    const placement = this.getContextMenuPlacement(menu);
    if (!placement) return false;
    const surface = menu.querySelector(':scope > .sf-context-menu');
    if (!surface) return false;
    this._contextPositions = this._contextPositions || new Map();

    const current = this._contextPositions.get(menu); // SF.Position writes an inline max-width from the free space, which
    // would override the menu's stylesheet cap; keep that cap in the width.


    const cssCap = current?.cssCap ?? (parseFloat(getComputedStyle(surface).maxWidth) || Infinity);
    const inlineSize = `${Math.max(0, Math.min(viewport.right - viewport.left - inset * 2, cssCap))}px`;
    surface.style.setProperty('--sf-table-context-menu--available-inline-size', inlineSize);
    surface.style.setProperty('--sf-context-menu-available-inline-size', inlineSize);
    const key = `${placement.side}|${placement.align}`;

    if (current && current.anchor === placement.anchor && current.surface === surface && current.key === key) {
      current.controller.update();
      return true;
    }

    current?.controller.stop();
    surface.style.transform = 'none';
    surface.style.translate = 'none';
    surface.style.setProperty('--sf-context-menu-available-block-size', `${Math.max(0, viewport.bottom - viewport.top - inset * 2)}px`);
    const Position = positioning();
    const gap = placement.tail === null ? Position.resolveLength('calc(var(--sf-focus-outline-width) * 2)', surface) : Position.resolveLength('var(--sf-context-menu-tail-corner-offset)', surface);
    const anchorBox = placement.anchor.getBoundingClientRect();
    const controller = Position.anchor(placement.anchor, surface, {
      side: placement.side,
      align: placement.align,
      offset: gap,
      alignmentOffset: placement.align === 'center' || placement.tail === null ? 0 : Math.max(0, anchorBox.height / 2 - gap),
      padding: inset,
      fitHeight: false,
      onPosition: ({
        side
      }) => {
        const box = placement.anchor.getBoundingClientRect();
        const view = this.getVisualViewportRect();
        const blockSize = side === 'block-end' ? view.bottom - inset - box.bottom - gap : side === 'block-start' ? box.top - gap - inset - view.top : view.bottom - view.top - inset * 2;
        const value = `${Math.max(0, Math.floor(blockSize))}px`;

        if (surface.style.getPropertyValue('--sf-context-menu-available-block-size') !== value) {
          surface.style.setProperty('--sf-context-menu-available-block-size', value);
        }

        if (placement.tail !== null) {
          const next = `${side === 'inline-end' ? 'left' : 'right'}${placement.tail}`;
          if (menu.getAttribute('position') !== next) menu.setAttribute('position', next);
        }
      }
    });

    this._contextPositions.set(menu, {
      controller,
      anchor: placement.anchor,
      surface,
      key,
      cssCap
    }); // The first placement is measured before the webfont has arrived, and
    // the cap written then is the cap of a narrower menu. The positioner
    // watches the box, but a font swap is cheap to wait for by name.


    document.fonts?.ready?.then(() => {
      if (this._contextPositions?.get(menu)?.controller === controller) controller.update();
    }).catch(() => {});
    return true;
  }

  stopContextMenuPositions() {
    for (const entry of this._contextPositions?.values() || []) entry.controller.stop();

    this._contextPositions?.clear();
  }

  contextViewportEvent() {
    requestAnimationFrame(() => this.clampContextMenusToViewport());
  }

  bindContextViewport() {
    if (this._contextViewportBound) {
      return;
    }

    window.addEventListener('resize', this.contextViewportEvent);
    window.visualViewport?.addEventListener('resize', this.contextViewportEvent);
    window.visualViewport?.addEventListener('scroll', this.contextViewportEvent);
    this._contextViewportBound = true;
  }

  unbindContextViewport() {
    if (!this._contextViewportBound) {
      return;
    }

    window.removeEventListener('resize', this.contextViewportEvent);
    window.visualViewport?.removeEventListener('resize', this.contextViewportEvent);
    window.visualViewport?.removeEventListener('scroll', this.contextViewportEvent);
    this._contextViewportBound = false;
  }

  openContextMenu(event, opts = {}) {
    this.closeContextMenu(false);
    this.contextTarget?.classList.remove("active");
    const target = event.currentTarget instanceof Element ? event.currentTarget : event.target instanceof Element ? event.target : null;

    if (!target) {
      return;
    } // Custom-element hosts use display:contents and have no positioning box.
    // Anchor to the native control on the event path within this opener.


    const nativeTarget = (event.composedPath?.() || []).filter(node => node instanceof Element).map(node => node.closest?.('button, input, select, textarea, a[href], [role="button"]')).find(node => node && (node === target || target.contains(node))); // Without a native control (for example a clicked sf-tag), anchor to the
    // first rendered box inside the opener instead of its boxless host.

    const hasBox = node => {
      const rect = node.getBoundingClientRect();
      return rect.width > 0 || rect.height > 0;
    };

    const boxedTarget = nativeTarget || hasBox(target) ? target : Array.from((target.shadowRoot || target).querySelectorAll?.('*') || []).find(hasBox) || target;
    this.contextTarget = nativeTarget || boxedTarget;
    this.contextTarget.classList.add("active"); // A chip opens its menu from the label button but anchors to the chip.

    let anchor = opts.anchorSelector && this.contextTarget.closest?.(opts.anchorSelector) || this.contextTarget;
    let pos = anchor.getBoundingClientRect();
    event.preventDefault();
    event.stopPropagation();
    let data = {
      open: true,
      id: this.contextTarget,
      ...opts
    };
    let tempData = {};

    switch (opts.type) {
      case 'left':
        tempData = {
          x: pos.left + pos.width,
          y: pos.y + pos.height / 2
        };
        break;

      case 'bottom':
        {
          let parent = null;

          if (opts.parent) {
            parent = (0,_helpers_dom__WEBPACK_IMPORTED_MODULE_7__.getParent)(event.target);
            pos = parent.getBoundingClientRect();
            anchor = parent;
          }

          tempData = {
            x: pos.left,
            y: pos.y + pos.height
          };
          break;
        }

      default:
        tempData = {
          x: pos.left,
          y: pos.y + pos.height
        };
    }

    data = { ...data,
      ...tempData,
      anchor,
      anchorRef: this.describeContextAnchor(anchor)
    }; // What «Сбросить» returns to in the column settings window: the settings
    // as they stood when it was opened. Everything in that window applies on
    // the spot now, so without this there is nothing to go back to.

    if (data.menu === 'table-settings') {
      this._columnSettingsOnOpen = JSON.parse(JSON.stringify(this.getColumnSettings() || {}));
    }

    this.set({
      contextMenu: { ...data
      }
    });
  } // The element to anchor to: the native control the event passed through,
  // else the first box inside the opener, else the opener itself. A Framework
  // control's host element is display:contents and has no box of its own.


  resolveBoxedAnchor(event, target) {
    if (!(target instanceof Element)) return target;

    const hasBox = node => {
      const rect = node?.getBoundingClientRect?.();
      return Boolean(rect) && (rect.width > 0 || rect.height > 0);
    };

    const native = (event?.composedPath?.() || []).filter(node => node instanceof Element).map(node => node.closest?.('button, input, select, textarea, a[href], [role="button"]')).find(node => node && (node === target || target.contains(node)));
    if (native && hasBox(native)) return native;
    if (hasBox(target)) return target;
    const inside = Array.from((target.shadowRoot || target).querySelectorAll?.('*') || []).find(hasBox);
    return inside || target;
  } // A context menu renders Framework elements, and a page may open one before
  // their modules have arrived -- the consumer saw a template row with its
  // handle and its menu but no radio and no name, and the window's tabs
  // rendering as one list, because sf-radio and sf-tabs were not upgraded yet.
  // Nothing redrew when they were. This asks once per element and redraws when
  // it is defined; an element already defined costs nothing.


  redrawWhenComponentsUpgrade(root = this) {
    if (!root?.querySelectorAll) return this;
    this._awaitedComponents = this._awaitedComponents || new Set();
    const names = new Set(Array.from(root.querySelectorAll('*')).map(node => node.tagName.toLowerCase()).filter(name => name.includes('-') && !customElements.get(name)));

    for (const name of names) {
      if (this._awaitedComponents.has(name)) continue;

      this._awaitedComponents.add(name);

      customElements.whenDefined(name).then(() => {
        this.requestComponentUpdate('component-upgrade');
      }).catch(() => {});
    }

    return this;
  }

  openContextSubmenu(event, opts = {}) {
    event.preventDefault();
    event.stopPropagation();
    const target = event.target instanceof Element ? event.target : null;
    const anchorTarget = event.currentTarget instanceof Element ? event.currentTarget : target;

    if (!anchorTarget) {
      return;
    } // The opener is usually an sf-icon-button, whose host is display:contents
    // and has no box at all: anchoring to it put the menu at the top left of
    // the viewport, which the clamp then pushed to the window's edge -- the
    // consumer saw it open far from its button, over the admin menu. The
    // native control on the event path is the thing with a box.


    const boxed = this.resolveBoxedAnchor(event, anchorTarget);
    const rect = boxed.getBoundingClientRect();
    const anchorKey = opts.anchorKey || opts.template?.key || anchorTarget.dataset?.contextSubmenuAnchor || "";

    if (anchorKey && this.state.contextMenu?.submenu?.open && this.state.contextMenu.submenu.anchorKey === anchorKey) {
      this.closeContextSubmenu();
      return;
    }

    const data = {
      open: true,
      type: opts.type,
      anchorKey,
      x: rect.left + rect.width,
      y: rect.y + rect.height / 2,
      position: opts.position || 'left',
      transform: -50,
      ...opts,
      anchor: boxed,
      anchorRef: this.describeContextAnchor(boxed)
    };
    this.set(state => ({
      contextMenu: { ...(state.contextMenu || {}),
        submenu: data
      }
    }));
  }

  handleContextLayerClick(event) {
    const target = event.target;

    if (!(target instanceof Element)) {
      return;
    }

    if (target.closest("[data-context-submenu]")) {
      return;
    }

    if (target.closest("[data-context-submenu-anchor]")) {
      return;
    }

    if (this.state.contextMenu?.submenu?.open && !target.closest("[data-context-main-menu]")) {
      this.closeContextSubmenu();
    }
  }

  closeContextSubmenu() {
    this.set(state => ({
      contextMenu: { ...(state.contextMenu || {}),
        submenu: null
      }
    }));
  }

  getSelectColumn() {
    return { ...this.TABLE_SELECT_COLUMN,
      component: { ...this.TABLE_SELECT_COLUMN.component,
        props: { ...(this.TABLE_SELECT_COLUMN.component?.props || {}),
          checked: Boolean(this.state?.settingsChecked),
          indeterminate: Boolean(this.state?.selectIndeterminate)
        }
      }
    };
  }

  getColumns() {
    const dataColumns = this.getTableData().columns || [];
    const systemColumns = this.getSystemColumns();
    const systemKeys = new Set(systemColumns.map(column => column.key));
    const rightSystemKeys = new Set(['actions']);
    const originalIndexByKey = new Map(dataColumns.map((column, index) => [column?.key, index]));
    const userColumns = dataColumns.filter(column => column?.key && !systemKeys.has(column.key)).map(column => {
      const settings = this.getColumnSetting(column.key);
      const nextColumn = { ...column,
        ...settings
      };

      if (settings.width) {
        nextColumn.colWidth = settings.width;
      }

      return nextColumn;
    }).sort((left, right) => {
      const getOrder = column => {
        const order = column?.order;
        return order !== null && typeof order !== "undefined" && order !== "" && Number.isFinite(Number(order)) ? Number(order) : originalIndexByKey.get(column?.key) ?? 0;
      };

      const leftOrder = getOrder(left);
      const rightOrder = getOrder(right);

      if (leftOrder === rightOrder) {
        return (originalIndexByKey.get(left.key) ?? 0) - (originalIndexByKey.get(right.key) ?? 0);
      }

      return leftOrder - rightOrder;
    });
    const leftSystemColumns = systemColumns.filter(column => !rightSystemKeys.has(column?.key));
    const rightSystemColumns = systemColumns.filter(column => rightSystemKeys.has(column?.key)); // Pinned columns stand right after the box and the row menu, each group
    // in its own order. The partition is stable, so pinning changes which
    // group a column is in and nothing else about where it sits.

    const pinnedUserColumns = userColumns.filter(column => this.isColumnPinned(column));
    const looseUserColumns = userColumns.filter(column => !this.isColumnPinned(column));
    const columns = [...leftSystemColumns, ...pinnedUserColumns, ...looseUserColumns, ...rightSystemColumns].filter(column => column?.visible !== false);
    const width = this._responsiveWidth || this.clientWidth || 0;
    if (!width || !userColumns.some(column => column.priority !== undefined)) return columns;

    const columnWidth = column => {
      const value = column.min_width ?? column.minWidth ?? column.width;
      const parsed = typeof value === "number" ? value : Number.parseFloat(String(value ?? ""));
      return Number.isFinite(parsed) && parsed > 0 ? parsed : column.system ? 48 : 160;
    };

    const retained = new Set(columns);
    let needed = columns.reduce((sum, column) => sum + columnWidth(column), 0);
    const removable = userColumns.filter(column => column.visible !== false).sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));

    for (const column of removable) {
      if (needed <= width || retained.size <= systemColumns.length + 1) break;
      retained.delete(column);
      needed -= columnWidth(column);
    }

    return columns.filter(column => retained.has(column));
  } // The columns that stay in place while the rows scroll sideways: the box,
  // the row menu, and the column the host marked as the record's title. The
  // host declares the title with `role: "title"` on the column rather than
  // the table guessing the first text column — a guess breaks on a page whose
  // first column is an icon or a flag, and the host already knows which
  // column leads the record.
  // Whether a column is pinned. The person decides, through the toggle in the
  // column settings, and the answer is stored beside the order and the width;
  // the column the host marked as the record's title starts pinned, because
  // that is the column a reader names a row by. The box and the row menu are
  // always pinned and are not offered a toggle.


  isColumnPinned(column) {
    if (!column?.key) return false;
    if (column.key === "select" || column.key === "settings") return true;
    if (column.system) return false;
    const pending = this.tempSettings?.cols?.[column.key];
    const setting = this.getColumnSetting(column.key) || {};
    const chosen = pending?.pinned ?? setting.pinned ?? column.pinned;
    if (typeof chosen === "boolean") return chosen;
    return column.role === "title";
  }

  getPinnedColumnKeys(columns = this.getColumns()) {
    return columns.filter(column => column?.key && this.isColumnPinned(column)).map(column => column.key);
  }

  isPinnedColumn(column) {
    if (!column?.key) return false;
    if (["start", "end"].includes(column.sticky)) return true;
    return this.isColumnPinned(column);
  } // A pinned cell's offset is read from the page, not from the declared
  // widths. The box and the row menu declare their widths as `calc()` over
  // tokens, which no arithmetic here can resolve, and a column the person has
  // resized no longer has the width its description names. The measured
  // offsets are published as custom properties, so the cells themselves only
  // ever name a property.


  getStickyCellStyle(columns, index) {
    const column = columns[index];
    const pinned = this.isPinnedColumn(column);
    if (!pinned) return "";
    const side = ["start", "end"].includes(column.sticky) ? column.sticky : "start"; // Only the placing is inline. The colour is a rule, because a pinned
    // cell has to carry the colour of the row it is in: painting it here
    // beat every row state and left the pinned columns white under a
    // selected or hovered row.

    return `position: sticky; inset-inline-${side}: var(--sf-table-pin-${column.key}, 0px); z-index: 2;`;
  }

  measurePinnedColumns() {
    const table = this.refs.table?.value;
    const scroll = this.refs.scroll?.value;
    if (!table) return this;
    const keys = this.getPinnedColumnKeys();
    const head = table.querySelector("thead tr");
    let offset = 0;

    for (const key of keys) {
      table.style.setProperty(`--sf-table-pin-${key}`, `${Math.round(offset)}px`);
      const cell = head?.querySelector(`th[data-key="${key}"]`);
      offset += cell ? cell.getBoundingClientRect().width : 0;
    }

    const last = keys[keys.length - 1];

    for (const cell of table.querySelectorAll("[data-sf-pin-edge]")) {
      cell.removeAttribute("data-sf-pin-edge");
    }

    if (last) {
      for (const cell of table.querySelectorAll(`[data-key="${last}"]`)) {
        cell.setAttribute("data-sf-pin-edge", "");
      }
    } // The shadow only means something once something is hidden behind the
    // pinned block, so it follows the scroll position. In a right-to-left
    // table the browser reports that position as a negative number.


    if (scroll) {
      const scrolled = Math.abs(scroll.scrollLeft) > 0;
      if (scrolled) scroll.setAttribute("data-sf-pin-scrolled", "");else scroll.removeAttribute("data-sf-pin-scrolled");
    }

    return this;
  }

  bindPinnedColumnScroll() {
    const scroll = this.refs.scroll?.value;
    if (!scroll || this._pinnedScrollBound === scroll) return this;
    this._pinnedScrollBound = scroll;
    scroll.addEventListener("scroll", () => this.measurePinnedColumns(), {
      passive: true
    });
    return this;
  } // A row's select box has no visible label: the row is the label. A reader
  // moving through the column hears each box by the row's first data cell,
  // instead of a run of unnamed checkboxes it cannot tell apart.


  getRowSelectLabel(row) {
    const column = this.getColumnItems().find(item => item?.key && !item.system && item.key !== "select" && item.key !== "settings");
    const raw = column ? row?.[column.key] : undefined;
    const value = raw !== null && typeof raw === "object" ? raw.text ?? raw.label ?? raw.value ?? "" : raw;
    const text = String(value ?? "").trim() || String(row?.id ?? "").trim();
    return text ? `${this.text("selectRowLabel")}: ${text}` : this.text("selectRowLabel");
  }

  createRowComponentCell(component, props = {}) {
    if (!component?.type) {
      return null;
    }

    return {
      component: {
        type: component.type,
        props: { ...(component.props || {}),
          ...props
        }
      }
    };
  } // Which of the table's actions this row offers, and in what shape.
  //
  // `row.actions` is read twice over a row's life and means two things. From
  // a host it is ids -- `["view"]`, the data view port's word for which
  // actions apply to this record -- and that is what selects from the table's
  // own list. Once the cell is built it holds the built items, and the
  // template calls this again with them, so the filter was asking whether an
  // array of objects includes a string. It never does: every action was
  // filtered out and the «Действия» column drew an empty container in every
  // row of every list, page lists included. A consumer reported it on an
  // embedded one, which is only where they happened to be looking (owner,
  // 2026-10-09).
  //
  // Ids select. Anything else is already the selection and is not filtered
  // again.
  // The same items for the same row, so a render finds the elements it made
  // last time rather than new ones.
  //
  // A re-query brings new row objects for the same records, so a cache held
  // on the row produced new items every time and lit rebuilt every actions
  // cell -- which is exactly what tests/browser/table-round-3 exists to
  // refuse: it used to tear every cell out and build it again, and the
  // control a person was using went with them. The key is what the cell
  // actually depends on: the row, the ids it offers, and the list those ids
  // select from (owner, 2026-10-09).


  rowActionItems(row = {}) {
    const ids = Array.isArray(row?.actions) && row.actions.every(item => typeof item === "string") ? row.actions.join(",") : "*";
    const list = this.ACTIONS_SETTINGS_ROW ?? [];
    const listKey = list.map(action => action?.id ?? "").join(",");

    if (this._rowActionListKey !== listKey) {
      this._rowActionListKey = listKey;
      this._rowActionItems = new Map();
    }

    const key = `${row?.id ?? ""}|${ids}`;
    if (!this._rowActionItems) this._rowActionItems = new Map();

    if (!this._rowActionItems.has(key)) {
      this._rowActionItems.set(key, this.getActionRowItems(row));
    }

    return this._rowActionItems.get(key);
  }

  getActionRowItems(row = {}, actions = this.ACTIONS_SETTINGS_ROW) {
    const selection = Array.isArray(row.actions) && row.actions.every(item => typeof item === "string") ? row.actions : null;
    return actions.filter(action => !selection || selection.includes(action.id)).map(action => {
      const component = action.component || {};
      const props = { ...(action.props || {}),
        ...(component.props || {})
      };
      const menu = action.menu || props.menu;
      const hasClickHandler = typeof props["@click"] === "function" || typeof props.onClick === "function";

      if (menu && !hasClickHandler) {
        props["@click"] = event => {
          const menuOptions = menu && typeof menu === "object" ? menu : {
            menu
          };
          this.openContextMenu(event, {
            type: "left",
            row,
            action,
            ...menuOptions
          });
        };
      } else if (!hasClickHandler) {
        props["@click"] = () => this.requestActionIntent(action.id, [row.id]);
      }

      return { ...action,
        component: { ...component,
          props
        }
      };
    });
  }

  getDefaultRowCell(column, row) {
    if (!column?.key) {
      return null;
    }

    if (column.key === "select") {
      return this.createRowComponentCell(column.rowComponent, {
        checked: this.state.settingsChecked ? true : Boolean(row?.selected || row?.checked),
        value: row?.id ?? row?.value ?? "",
        ariaLabel: this.getRowSelectLabel(row),
        "@change": event => {
          this.applyRowSelection(row.id, Boolean(event.target.checked), {
            range: this._selectRangeModifier === true
          });
        }
      });
    }

    if (column.key === "settings") {
      return this.createRowComponentCell(column.rowComponent || {
        type: "icon-button",
        props: {
          size: "1",
          type: "link",
          scheme: "on-surface",
          icon: "menu",
          ariaLabel: this.text("menuLabel"),
          value: "menu",
          "@click": e => {
            this.openContextMenu(e, {
              type: 'left',
              menu: 'row-settings',
              row
            });
          }
        }
      });
    }

    if (column.key === 'actions') {
      return this.getActionRowItems(row);
    }

    return null;
  }

  normalizeRow(row = {}) {
    if (!row || typeof row !== "object" || Array.isArray(row)) {
      return row;
    }

    const nextRow = { ...row
    };
    this.getSystemColumns().forEach(column => {
      if (!column?.key || typeof nextRow[column.key] !== "undefined" || column.visible === false) {
        return;
      }

      const cell = this.getDefaultRowCell(column, nextRow);

      if (cell) {
        nextRow[column.key] = cell;
      }
    });
    return nextRow;
  }

  normalizeRows(rows = []) {
    return Array.isArray(rows) ? rows.map(row => this.normalizeRow(row)) : [];
  }

  setTableData(patch = {}, reason = "data") {
    const currentData = this.getTableData();
    const nextPatch = typeof patch === "function" ? patch(currentData) : patch;

    if (!nextPatch || typeof nextPatch !== "object") {
      return this;
    }

    const result = this.set({
      data: { ...currentData,
        ...nextPatch
      }
    }, reason);
    this.syncSelectionPort();
    return result;
  }

  setColumns(columns = [], reason = "columns") {
    const currentColumns = this.getTableData().columns || [];
    const nextColumns = typeof columns === "function" ? columns(currentColumns) : columns;
    return this.setTableData({
      columns: Array.isArray(nextColumns) ? nextColumns : []
    }, reason);
  }

  addColumns(columns = []) {
    const nextColumns = Array.isArray(columns) ? columns : [columns];
    return this.setColumns(currentColumns => [...currentColumns, ...nextColumns.filter(Boolean)]);
  }

  updateColumn(columnKey, patch = {}, reason = "columns") {
    if (!columnKey) {
      return this;
    }

    return this.setColumns(columns => columns.map((column, index) => {
      if (!column || column.key !== columnKey) {
        return column;
      }

      const nextPatch = typeof patch === "function" ? patch(column, index) : patch;
      return { ...column,
        ...(nextPatch || {})
      };
    }), reason);
  }

  setRows(rows = [], reason = "rows") {
    const currentRows = this.getTableData().rows || [];
    const nextRows = typeof rows === "function" ? rows(currentRows) : rows;
    return this.setTableData({
      rows: this.normalizeRows(nextRows)
    }, reason);
  }

  addRows(rows = [], reason = "rows") {
    const nextRows = Array.isArray(rows) ? rows : [rows];
    return this.setRows(currentRows => [...currentRows, ...nextRows.filter(Boolean)], reason);
  }

  updateRowsByKey(key, value, patch = {}, reason = "rows") {
    if (!key) {
      return this;
    }

    const patchRow = typeof patch === "function" ? patch : row => ({ ...row,
      ...(patch || {})
    });
    return this.setRows(rows => rows.map((row, index) => {
      if (!row || row[key] !== value) {
        return row;
      }

      const nextRow = patchRow(row, index);
      return nextRow && typeof nextRow === "object" ? nextRow : row;
    }), reason);
  }

  updateRowByKey(key, value, patch = {}, reason = "row") {
    return this.updateRowsByKey(key, value, patch, reason);
  }

  updateRows(patch = {}, reason = "rows") {
    const patchRow = typeof patch === "function" ? patch : row => ({ ...row,
      ...(patch || {})
    });
    return this.setRows(rows => rows.map((row, index) => {
      const nextRow = patchRow(row, index);
      return nextRow && typeof nextRow === "object" ? nextRow : row;
    }), reason);
  }

  updateRowCell(rowKey, rowValue, cellKey, patch = {}, reason = "cell") {
    if (!cellKey) {
      return this;
    }

    return this.updateRowsByKey(rowKey, rowValue, row => {
      const currentCell = row && row[cellKey] && typeof row[cellKey] === "object" ? row[cellKey] : {};
      const nextCellPatch = typeof patch === "function" ? patch(currentCell, row) : patch;
      return { ...row,
        [cellKey]: { ...currentCell,
          ...(nextCellPatch || {})
        }
      };
    }, reason);
  }

  updateRowCellProps(rowKey, rowValue, cellKey, props = {}, reason = "cell-props") {
    return this.updateRowCell(rowKey, rowValue, cellKey, cell => ({
      component: { ...(cell.component || {}),
        props: { ...(cell.component?.props || {}),
          ...(typeof props === "function" ? props(cell.component?.props || {}, cell) : props || {})
        }
      }
    }), reason);
  }

  closeContextMenu(restoreFocus = true) {
    const trigger = this.contextTarget;
    this.set({
      contextMenu: {
        open: false
      }
    });
    this.stopContextMenuPositions();
    (0,lit__WEBPACK_IMPORTED_MODULE_4__.render)(null, this.getPortalContainer());

    if (this.refs.contextMenu) {
      this.refs.contextMenu.value = null;
    }

    this.unbindContextEvent();
    this.unbindContextViewport();
    this.contextTarget?.classList.remove("active");
    this.contextTarget = null;

    if (restoreFocus && trigger?.isConnected && typeof trigger.focus === 'function') {
      requestAnimationFrame(() => trigger.focus());
    }
  }

  get templateName() {
    return this.getAttribute("template") || "default";
  }

  get dataState() {
    return this.getEnumAttr('data-state', ['loading', 'populated', 'empty', 'error'], 'auto');
  }

  setDataState(state = 'auto') {
    const normalized = ['loading', 'populated', 'empty', 'error'].includes(state) ? state : 'auto';

    if (normalized === 'auto') {
      this.removeAttribute('data-state');
    } else {
      this.setAttribute('data-state', normalized);
    }

    return this;
  }

  requestRetry() {
    return this.dispatchTableEvent('sf-table-retry');
  }

  disconnectedCallback() {
    for (const page of this._filterOptionPages.values()) {
      page.controller?.abort();
      clearTimeout(page.searchTimer);
    }

    this._filterOptionPages.clear();

    this._responsiveObserver?.disconnect();
    this._responsiveObserver = null;
    this._responsiveWidth = 0;
    this.clearSearchDebounce();
    this._searchPendingProps = null;
    this._searchHoldKey = '';
    this.clearFilterTemplateDragBindings();
    this.stopContextMenuPositions();
    this.unbindContextEvent();
    this.unbindContextViewport();
    this.unBindHoverEvent();
    this.unbindColumnResizeEvent();
    this.unbindColumnDragEvent();
    this.clearColumnDragState(false);
    this.onColumnResizePointerUp();
    this.tempSettings = null;
    this._selectionPortKey = "[]"; // A removed table abandons its pending answer; a remount asks again.

    this._abandonedQuery = this._pendingQuerySequence !== null;
    this._pendingQuerySequence = null;
    this.state.contextMenu = {
      open: false
    };
    this.state.settingsChecked = false;
    this.state.selectIndeterminate = false;
    const data = this.getTableData();
    this.state.data = { ...data,
      rows: data.rows.map(row => ({ ...row,
        selected: false,
        checked: false,
        ...(row.select?.component ? {
          select: { ...row.select,
            component: { ...row.select.component,
              props: { ...row.select.component.props,
                checked: false
              }
            }
          }
        } : {})
      }))
    };

    if (this.refs.contextMenu) {
      this.refs.contextMenu.value = null;
    }

    this.contextTarget?.classList?.remove('active');
    this.contextTarget = null;

    if (this._portalContainer) {
      (0,lit__WEBPACK_IMPORTED_MODULE_4__.render)(null, this._portalContainer);

      this._portalContainer.remove();

      this._portalContainer = null;
    }

    super.disconnectedCallback();
  }
  /**
   * One of this table's words, in the page's language. An attribute wins over
   * both languages, because a consumer who names a word has named it.
   *
   * The declared default is the English one, so a component read through its
   * props alone still says something sensible; the context below overrides
   * every text key with this, which is what makes the Russian reachable. A
   * key left out of that override would quietly fall back to English on a
   * Russian page -- which is exactly how three labels in the record panel's
   * head came to read «Close» beside «В избранное».
   */


  text(key, attribute) {
    return attribute && this.getAttribute(attribute) || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_6__.pageText)(TABLE_TEXT, key, this);
  }

  templateContext() {
    const props = this.getPropsContext();
    return this.createTemplateContext({ ...props,
      component: this,
      rootClass: this.getRootClass(),
      rootStyle: this.getRootStyle(),
      filterText: this.text("filterText", "filter-text"),
      clearText: this.text("clearText", "clear-text"),
      searchPlaceholder: this.text("searchPlaceholder", "search-placeholder"),
      createText: this.text("createText", "create-text"),
      pinColumnLabel: this.text("pinColumnLabel", "pin-column-label"),
      unpinColumnLabel: this.text("unpinColumnLabel", "unpin-column-label"),
      loadingText: this.text("loadingText", "loading-text"),
      emptyText: this.text("emptyText", "empty-text"),
      errorText: this.text("errorText", "error-text"),
      retryText: this.text("retryText", "retry-text"),
      columnMoveLabel: this.text("columnMoveLabel", "column-move-label"),
      filterApplyText: this.text("filterApplyText", "filter-apply-text"),
      columnSearchPlaceholder: this.text("columnSearchPlaceholder", "column-search-placeholder"),
      columnSearchEmptyText: this.text("columnSearchEmptyText", "column-search-empty-text")
    });
  }

  setCheckboxHeight() {
    if (!this.refs.items.size) return;
    const measureToken = ++this._checkboxMeasureToken;
    requestAnimationFrame(() => {
      if (!this.isConnected || measureToken !== this._checkboxMeasureToken) {
        return;
      }

      const parentSpace = (0,_helpers_dom__WEBPACK_IMPORTED_MODULE_7__.setParentSpace)(this.refs.items);

      if (!parentSpace) {
        return;
      }

      const {
        item,
        gap,
        parent
      } = parentSpace;
      this.parentGap = gap;
      const itemHeight = item.tagName.toLowerCase().startsWith('sf-') ? item.children[0]?.clientHeight : item.clientHeight;

      if (!itemHeight) {
        return;
      }

      const itemSize = parent.dataset.size || 8;
      const parentHeight = (itemHeight + gap) * itemSize;

      if (parent.clientHeight <= parentHeight) {
        return false;
      }

      parent.setAttribute('style', `height: ${parentHeight}px; overflow: auto;`);
    });
  }

  beforeRender() {
    super.beforeRender();
    this._checkboxMeasureToken++;
    this.refs.items = new Map();
  }

  afterRender() {
    this.measurePinnedColumns();
    this.bindPinnedColumnScroll();
    this.setCheckboxHeight();
    this.bindHoverEvent();
    this.bindColumnResizeEvent();
    this.bindColumnDragEvent();
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_1__.renderTableTemplate)(this.templateContext());
  }

}

SfTable.define("sf-table");
})();

/******/ })()
;