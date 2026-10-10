/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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

/***/ "68a311ab2b87"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderAdminMenuTemplate: () => (/* binding */ renderAdminMenuTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("fef8077ac919");
/* harmony import */ var _helpers_text__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("cbce4a5232a6");


const MENU_TRANSLATIONS = {
  en: {
    empty: "Nothing found",
    favorites: "Favorites",
    saving: "Saving…",
    save: "Save",
    personalSettings: "Personal settings",
    systemSettings: "Settings for everyone",
    hiddenItems: "Hidden items",
    addDivider: "Add divider",
    refreshState: "Refresh state",
    resetSettings: "Reset settings",
    cancel: "Cancel",
    conflict: "Settings changed. Refresh state and save again.",
    saveError: "Could not save settings.",
    collapse: "Collapse",
    expand: "Expand",
    search: "Search",
    sections: "Sections",
    nothingFound: "Nothing found for",
    back: "Back to menu"
  },
  ru: {
    empty: "Ничего не найдено",
    favorites: "Избранное",
    saving: "Сохранение…",
    save: "Сохранить",
    personalSettings: "Личные настройки",
    systemSettings: "Настройки для всех",
    hiddenItems: "Скрытые пункты",
    addDivider: "Добавить разделитель",
    refreshState: "Обновить состояние",
    resetSettings: "Сбросить настройки",
    cancel: "Отменить",
    conflict: "Настройки изменились. Обновите состояние и повторите сохранение.",
    saveError: "Не удалось сохранить настройки.",
    collapse: "Свернуть",
    expand: "Развернуть",
    search: "Поиск",
    sections: "Разделы",
    nothingFound: "Ничего не найдено по",
    back: "Назад к меню"
  }
};

function menuText(key) {
  const locale = String(document.documentElement?.lang || "en").toLowerCase().split("-")[0];
  return MENU_TRANSLATIONS[locale]?.[key] || MENU_TRANSLATIONS.en[key] || key;
}

function joinClasses(...tokens) {
  return tokens.flat().filter(Boolean).join(" ");
}

function isIconSource(value = "") {
  const source = String(value || "").trim();
  if (!source) return false;
  return /^(https?:)?\/\//i.test(source) || /^(data:image\/|blob:)/i.test(source) || source.startsWith("/") || source.startsWith("./") || source.startsWith("../") || /\.(svg|png|jpe?g|webp|gif|avif)(\?.*)?(#.*)?$/i.test(source);
}

function renderPlaceholder(label) {
  const letters = (0,_helpers_text__WEBPACK_IMPORTED_MODULE_1__.getInitials)(label);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span
    class="sf-admin-menu-item-placeholder flex items-cross-center content-main-center flex-none"
    >${letters}</span
  >`;
}

function renderIcon(icon, alt = "", rootClass = "flex-none") {
  if (!icon) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;

  if (isIconSource(icon)) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-admin-menu-item-icon flex-none">
      <img
        src=${icon}
        class="w-full h-full object-contain"
        alt=${alt}
        aria-hidden=${alt ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : "true"}
      />
    </span> `;
  }

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)` <sf-icon
    root-class=${rootClass}
    aria-hidden="true"
    icon="${icon}"
  ></sf-icon>`;
}

function renderBadge(item) {
  if (!item.badge) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)` <sf-badge
    size="1/3"
    type="main"
    scheme="primary"
    text="${item.badge}"
  ></sf-badge>`;
}

function renderAdminMenuTemplate(context) {
  const component = context.component;
  const {
    panels,
    hasHidden,
    visible,
    open,
    menuSettings,
    searchQuery,
    searchResults,
    searchGroups,
    searchRecent,
    searchPending,
    searchActiveId,
    settingsStatus,
    settingsError
  } = component.state;

  function renderItemContent(item, trailing = lit__WEBPACK_IMPORTED_MODULE_0__.nothing, showSettings = false) {
    return !context.compact ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
          <span
            class="sf-admin-menu-item-container max-w-full wrap-none flex items-cross-center flex-1"
          >
            ${item.leftIcon ? renderIcon(item.leftIcon) : item.placeholder ? renderPlaceholder(item.label) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            <span class="overflow-hidden whitespace-nowrap t-ellipsis"
              >${item.label}</span
            >
          </span>
          ${showSettings ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : item.badge ? renderBadge(item) : trailing}
        ` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span
          class="sf-admin-menu-item-container flex items-cross-center flex-1"
        >
              ${item.leftIcon ? renderIcon(item.leftIcon) : item.placeholder ? renderPlaceholder(item.label) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        </span> `;
  }

  function renderMenuButton(item, className, showSettings = false) {
    const trailing = renderIcon("chevron_right", "", "sf-admin-menu-direction-icon flex-none");
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
      <button
        type="button"
        class=${className}
        aria-expanded=${panels[item.panelId]?.open ? "true" : "false"}
        @click=${event => {
      event.preventDefault();
      event.stopPropagation();
      component.togglePanel(item.panelId, true, event.currentTarget);
    }}
        ?disabled=${Boolean(item.disabled)}
      >
        ${renderItemContent(item, trailing, showSettings)}
      </button>
    `;
  }

  function renderMenuLink(item, className, showSettings = false) {
    if (item.disabled) {
      return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <span class=${className} aria-disabled="true">
          ${renderItemContent(item, lit__WEBPACK_IMPORTED_MODULE_0__.nothing, showSettings)}
        </span>
      `;
    }

    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
      <a
        class=${className}
        href=${item.href || "#"}
        target=${item.target || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        rel=${item.rel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        aria-current=${item.current ? "page" : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      >
        ${renderItemContent(item, lit__WEBPACK_IMPORTED_MODULE_0__.nothing, showSettings)}
      </a>
    `;
  }

  function renderSearchResultPath(item) {
    const parentPath = (item.path || []).slice(0, -1);
    if (!parentPath.length) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
      <span
        class="sf-admin-menu-search-result-path sf-text-1/3 color-on-surface-variant overflow-hidden whitespace-nowrap t-ellipsis"
        >${parentPath.join(" / ")}</span
      >
    `;
  }

  function renderSearchResult(item) {
    const content = (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
      <span
        class="sf-admin-menu-item-container max-w-full wrap-none flex items-cross-center flex-1"
      >
        ${item.leftIcon ? renderIcon(item.leftIcon) : item.placeholder ? renderPlaceholder(item.label) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        <span class="flex flex-col min-w-0">
          <span class="overflow-hidden whitespace-nowrap t-ellipsis"
            >${item.label}</span
          >
          ${renderSearchResultPath(item)}
        </span>
      </span>
      ${item.badge ? renderBadge(item) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    `;

    if (item.href && item.href !== "#") {
      return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <li class="sf-admin-menu-item-wrap flex items-cross-center">
          <a
            class="sf-admin-menu-item flex items-cross-center flex-1 max-w-full min-w-0"
            href=${item.href}
            target=${item.target || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            rel=${item.rel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            @click=${event => component.openSearchResult(item, event)}
          >
            ${content}
          </a>
        </li>
      `;
    }

    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
      <li class="sf-admin-menu-item-wrap flex items-cross-center">
        <button
          type="button"
          class="sf-admin-menu-item flex items-cross-center flex-1 max-w-full min-w-0"
          @click=${event => component.openSearchResult(item, event)}
        >
          ${content}
        </button>
      </li>
    `;
  } // The matched part of a label, marked. The parts come from the component, which
  // did the comparing; the template only puts a <mark> around them.


  function renderMatch(label, match) {
    const text = String(label ?? "");
    if (!match || match.start < 0) return text;
    const start = text.slice(0, match.start);
    const middle = text.slice(match.start, match.start + match.length);
    const end = text.slice(match.start + match.length);
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${start}<mark class="sf-admin-menu-search-mark">${middle}</mark>${end}`;
  }

  function renderSearchRow({
    id,
    kind,
    item
  }) {
    const selected = searchActiveId === id;
    const rowClass = joinClasses("sf-admin-menu-item sf-admin-menu-search-row flex items-cross-center flex-1 max-w-full min-w-0", selected ? "selected" : "");
    const body = (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
      <span class="sf-admin-menu-item-container max-w-full wrap-none flex items-cross-center flex-1">
        ${kind === "host" ? item.icon ? renderIcon(item.icon) : renderPlaceholder(item.text) : item.leftIcon ? renderIcon(item.leftIcon) : renderPlaceholder(item.label)}
        <span class="flex flex-col min-w-0">
          <span class="overflow-hidden whitespace-nowrap t-ellipsis">
            ${kind === "host" ? item.text : renderMatch(item.label, item.match)}
          </span>
          ${kind === "host" ? item.subtext ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span
                  class="sf-admin-menu-search-result-path sf-text-1/3 color-on-surface-variant overflow-hidden whitespace-nowrap t-ellipsis"
                  >${item.subtext}</span
                >` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing : item.parentLabel ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span
                  class="sf-admin-menu-search-result-path sf-text-1/3 color-on-surface-variant overflow-hidden whitespace-nowrap t-ellipsis"
                  >${item.parentLabel}</span
                >` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        </span>
      </span>
    `;
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
      <li class="sf-admin-menu-item-wrap flex items-cross-center" role="presentation">
        ${kind === "host" ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<a id=${id} role="option" aria-selected=${selected ? "true" : "false"}
                class=${rowClass} href=${item.href}>${body}</a>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<button id=${id} role="option" aria-selected=${selected ? "true" : "false"}
                type="button" class=${rowClass}
                @click=${event => component.openSearchResult(item, event)}>${body}</button>`}
      </li>
    `;
  }

  function renderSearchGroup(label, rows, more = null) {
    if (!rows.length) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
      <div class="sf-admin-menu-search-group flex flex-col">
        <div class="sf-admin-menu-search-group-head flex items-cross-center content-main-between">
          <span>${label}</span>
          ${more ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<a href=${more.href}>${more.text}</a>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        </div>
        <ul class="p-0 m-0 gap-1/3 flex flex-col" role="presentation">
          ${rows.map(row => renderSearchRow(row))}
        </ul>
      </div>
    `;
  } // Two rows of nothing while the host is answering. They are not results, so
  // they carry no role and the list below stays the list the keyboard reads.


  function renderSearchSkeletons() {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
      <div class="sf-admin-menu-search-group flex flex-col" aria-hidden="true">
        <span class="sf-admin-menu-search-skeleton"></span>
        <span class="sf-admin-menu-search-skeleton"></span>
      </div>
    `;
  }

  function renderSearchPanelBody() {
    const rows = component.getSearchSelectables();
    const sections = rows.filter(row => row.kind === "section"); // An empty field shows what the host offers standing -- a recent list --
    // and a typed one shows the answer to that query.

    const groups = searchQuery ? searchGroups || [] : searchRecent || [];
    const hosted = [];
    let index = sections.length;

    for (const group of groups) {
      hosted.push({
        group,
        rows: group.items.map((item, position) => rows[index + position])
      });
      index += group.items.length;
    }

    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
      <div class="sf-admin-menu-search-field flex-none">
        <span class="sf-input sf-input--size-1 sf-input--filled flex flex-col">
          <span class="sf-input-field items-cross-center transition flex">
            <span class="sf-input-left flex"><sf-icon icon="search"></sf-icon></span>
            <input
              type="search"
              role="combobox"
              aria-expanded="true"
              aria-controls="sf-admin-search-list"
              aria-activedescendant=${searchActiveId || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
              aria-label=${context.searchPlaceholder || menuText("search")}
              placeholder=${context.searchPlaceholder || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
              name="sf_admin_search_input"
              .value=${searchQuery || ""}
              @input=${event => component.search(event.target.value)}
              @keydown=${event => component.handleSearchKeydown(event)}
            />
            <span class="sf-input-right"><kbd class="sf-admin-menu-search-kbd">Esc</kbd></span>
          </span>
        </span>
      </div>
      <div id="sf-admin-search-list" role="listbox" aria-label=${menuText("search")}
           class="sf-admin-menu-search-results-area flex-auto min-h-0 overflow-auto flex flex-col">
        ${searchQuery ? renderSearchGroup(menuText("sections"), sections) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        ${hosted.map(entry => renderSearchGroup(entry.group.label, entry.rows, entry.group.more))}
        ${searchQuery && searchPending ? renderSearchSkeletons() : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        ${searchQuery && !rows.length && !searchPending ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-admin-menu-search-empty p-2 color-on-surface-variant">
              ${menuText("nothingFound")} «${searchQuery}»
            </div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        ${!searchQuery && context.searchHint ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-admin-menu-search-hint p-2 color-on-surface-variant">
              ${context.searchHint}
            </div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      </div>
      <div class="sf-admin-menu-search-keys flex-none">${context.searchKeysHint}</div>
    `;
  }

  function renderSearchResults() {
    if (!searchQuery) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;

    if (!searchResults?.length) {
      return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-admin-menu-search-empty p-2 color-on-surface-variant">
          ${menuText("empty")}
        </div>
      `;
    }

    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
      <ul class="sf-admin-menu-search-results p-0 m-0 gap-1/3 flex flex-col">
        ${searchResults.map(renderSearchResult)}
      </ul>
    `;
  }

  function renderSettings() {
    if (!context.collapsible && !context.settings) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
      <li class="sf-admin-menu-item-wrap flex flex-col">
        <button
          type="button"
          class="sf-admin-menu-item flex-1 flex items-cross-center"
        >
          <span
            class="sf-admin-menu-item-container flex items-cross-center flex-1"
          >
            <i class="sf-icon sf-icon-loaded">star</i>
            <span>${menuText("favorites")}</span>
          </span>
        </button>
      </li>
      <li class="sf-admin-menu-item-wrap flex flex-col">
        ${!menuSettings ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)` <div
              class="sf-admin-menu-item${context.collapsible && context.settings ? "-segment" : ""} flex items-cross-center"
            >
              ${context.settings && !context.compact ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)` <button
                    type="button"
                    @click="${() => component.toggleMenuSettings()}"
                    data-action="settings"
                    aria-label=${context.settingsTitle}
                    class="sf-admin-menu-item flex-1${context.collapsible ? " segment-start " : " "}flex items-cross-center"
                  >
                    <span
                      class="sf-admin-menu-item-container flex items-cross-center flex-1"
                    >
                      <i class="sf-icon sf-icon-loaded">settings</i>
                      <span>${context.settingsTitle}</span>
                    </span>
                  </button>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
              ${context.collapsible ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                    <button
                      @click=${() => component.toggleCompact()}
                      type="button"
                      class="sf-admin-menu-item${context.settings ? " segment-end " : " "}flex items-cross-center"
                      data-admin-menu-toggle
                      aria-label=${context.compact ? menuText("expand") : menuText("collapse")}
                    >
                      <span
                        class="sf-admin-menu-item-container flex items-cross-center flex-1"
                      >
                        <sf-icon
                          icon="keyboard_double_arrow_${context.compact ? "right" : "left"}"
                          root-class="sf-admin-menu-direction-icon"
                        ></sf-icon>
                      </span>
                    </button>
                  ` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            </div>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)` <div
              class="sf-admin-menu-item-segment flex items-cross-center"
            >
              <button
                type="button"
                @click="${() => component.saveMenuSettings()}"
                class="sf-admin-menu-item segment-start flex-1 flex items-cross-center"
                ?disabled=${settingsStatus === "saving"}
              >
                <span
                  class="sf-admin-menu-item-container flex items-cross-center flex-1"
                >
                  <i class="sf-icon sf-icon-loaded">save</i>
                  <span>${settingsStatus === "saving" ? menuText("saving") : menuText("save")}</span>
                </span>
              </button>
              <button
                @click=${event => component.openContextMenu(event, {
      position: "left-bottom",
      items: [{
        component: "sf-button",
        props: {
          type: "link",
          scheme: "on-surface",
          iconLeft: "save",
          text: menuText("save"),
          "@click": () => {
            component.saveMenuSettings();
          }
        }
      }, ...(context.persistenceMode === "external" && context.allowSystemSettings ? [{
        component: "sf-button",
        props: {
          type: "link",
          scheme: "on-surface",
          iconLeft: context.settingsMode === "system" ? "person" : "groups",
          text: context.settingsMode === "system" ? menuText("personalSettings") : menuText("systemSettings"),
          "@click": () => component.selectSettingsMode(context.settingsMode === "system" ? "user" : "system")
        }
      }] : []), ...(context.persistenceMode === "external" ? [{
        component: "sf-button",
        props: {
          type: "link",
          scheme: "on-surface",
          iconLeft: "visibility",
          text: menuText("hiddenItems"),
          "@click": () => {
            component.toggleHidden();
          }
        }
      }, ...(context.persistenceMode !== "external" ? [{
        component: "sf-button",
        props: {
          type: "link",
          scheme: "on-surface",
          iconLeft: "horizontal_rule",
          text: menuText("addDivider"),
          "@click": () => {
            component.createDivider();
          }
        }
      }] : []), {
        component: "sf-button",
        props: {
          type: "link",
          scheme: "on-surface",
          iconLeft: "refresh",
          text: menuText("refreshState"),
          "@click": () => component.refreshSettings()
        }
      }] : []), {
        component: "sf-button",
        props: {
          type: "link",
          scheme: "on-surface",
          iconLeft: "restart_alt",
          text: menuText("resetSettings"),
          "@click": () => component.resetMenuSettings()
        }
      }, {
        component: "sf-button",
        props: {
          type: "link",
          scheme: "on-surface",
          iconLeft: "close",
          text: menuText("cancel"),
          "@click": () => component.cancelMenuSettings()
        }
      }]
    })}
                type="button"
                class="sf-admin-menu-item segment-end flex items-cross-center"
                data-admin-menu-settings
                aria-label=${menuText("personalSettings")}
                aria-haspopup="menu"
                aria-expanded="false"
                ?disabled=${settingsStatus === "saving"}
              >
                <span
                  class="sf-admin-menu-item-container pointer-event-none flex items-cross-center flex-1"
                >
                  <sf-icon icon="settings"></sf-icon>
                </span>
              </button>
            </div>`}
        ${settingsStatus === "conflict" || settingsStatus === "error" ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-admin-menu-settings-status color-danger p-1/2 flex flex-col gap-1/3" role="alert">
              <span>${settingsStatus === "conflict" ? menuText("conflict") : settingsError || menuText("saveError")}</span>
              <sf-button
                type="link"
                scheme="primary"
                size="1/2"
                text=${settingsStatus === "conflict" ? menuText("refreshState") : menuText("save")}
                @click=${settingsStatus === "conflict" ? () => component.refreshSettings() : () => component.saveMenuSettings()}
              ></sf-button>
            </div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      </li>
    `;
  }

  function renderBottom() {
    if (!context.bottomItems?.length && !context.collapsible) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
      <div class="sf-admin-menu-bottom flex-none">
        <nav>
          <ul class="p-0 m-0 gap-1/3 flex flex-col">
            ${(context.bottomItems || []).map(item => {
      return renderMenuItem(item);
    })}
            ${renderSettings(context)}
          </ul>
        </nav>
      </div>
    `;
  }

  function renderSearch() {
    if (!context.searchable) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing; // In panel mode there is no row to render: the magnifier in the header
    // opens the panel, and a collapsed menu shows the magnifier first in the
    // icon column and expands straight into the panel.

    if (context.searchMode === "panel" && !context.compact) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
      <div class="sf-admin-menu-search flex-none">
        ${context.compact ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)` <button
              id="search_toggle_menu"
              data-sf-admin-search-toggle
              @click=${() => {
      if (context.searchMode === "panel") {
        component.openSearchPanel();
        return;
      }

      component.setCompact(false, "search");
      component.focusSearchInput();
    }}
              type="button"
              class="sf-admin-menu-item flex items-cross-center"
              aria-label=${context.searchPlaceholder || menuText("search")}
            >
              <span
                class="sf-admin-menu-item-container flex items-cross-center flex-1"
              >
                <i class="sf-icon sf-icon-loaded">search</i>
              </span>
            </button>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        ${!context.compact ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)` <sf-input
              size="1"
              type="filled"
              @input=${event => {
      component.search(event.target.value);
    }}
              placeholder="${context.searchPlaceholder || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}"
              name="sf_admin_search_input"
              left-icon="search"
            ></sf-input>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      </div>
    `;
  }

  function renderHeader(main = true, item = null) {
    if (main) {
      if (!context.logo && !context.brand) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
      return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-admin-menu-head flex flex-none">
          <div class="sf-admin-menu-head-container flex items-cross-center">
            ${context.logo ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<a
                  class="sf-admin-menu-head-logo flex"
                  href=${context.logoHref || "#"}
                >
                  <img
                    class="sf-admin-menu-logo"
                    src=${context.logo}
                    alt=${context.brand || ""}
                  />
                </a>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ${context.brand ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span>${context.brand}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          </div>
          ${context.searchMode === "panel" && !context.compact ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-icon-button
                data-sf-admin-search-toggle
                root-class="sf-admin-menu-search-toggle"
                type="link"
                scheme="on-surface"
                icon="search"
                title=${context.searchLabel}
                aria-label=${context.searchLabel}
                @click=${() => component.openSearchPanel()}
              ></sf-icon-button>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        </div>
      `;
    } else {
      // The back row is an item, not an icon button in a padded header: that is
      // what puts the arrow in the column the item icons are in and the section's
      // name where an item's label would be. Aligning a bare button by
      // arithmetic worked out to the same place and would have drifted the moment
      // either padding changed.
      return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)` <div
        class="sf-admin-menu-head items-cross-center flex content-main-between flex-none"
      >
        <button
          type="button"
          class="sf-admin-menu-item sf-admin-menu-back flex items-cross-center flex-1 min-w-0"
          aria-label=${menuText("back")}
          @click=${event => {
        event.preventDefault();
        event.stopPropagation();

        if (item.panelId === "search_panel") {
          component.closeSearchPanel();
          return;
        }

        component.togglePanel(item.panelId, false);
      }}
        >
          <span
            class="sf-admin-menu-item-container sf-admin-menu-head-container flex items-cross-center flex-1 min-w-0"
          >
            <i class="sf-icon sf-icon-loaded sf-admin-menu-back-button">chevron_left</i>
            <span class="overflow-hidden whitespace-nowrap t-ellipsis">${item.label}</span>
          </span>
        </button>
      </div>`;
    }
  }

  function renderMenuDivider(item, main = false) {
    const showSettings = main && menuSettings;
    const isTempVisible = visible[item.panelId]?.temp === true;
    const hidden = item.hidden && !isTempVisible || !menuSettings && !open && main && visible[item.panelId] && !visible[item.panelId].visible;
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
      <li
        :key=${item.panelId}
        data-order="${item.order}"
        data-panel-id="${item.panelId}"
        :ref=${main ? component.getItemRef(item.panelId) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        class="sf-admin-menu-item-wrap sf-admin-menu-divider-wrap flex items-cross-center${hidden ? " hidden" : ""}${showSettings ? " settings-on relative" : ""}"
        role="presentation"
      >
        ${showSettings ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)` <sf-icon-button
              id="${item.panelId}_move"
              type="link"
              data-move
              scheme="on-surface"
              aria-label="Set order"
              icon="drag_indicator"
              root-class="cursor-move"
            ></sf-icon-button>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        <span
          class="sf-admin-menu-divider flex-1${showSettings ? " settings-active" : ""}"
        >
          <span
            class="flex flex-1"
            role="separator"
            aria-orientation="horizontal"
          ></span>
        </span>
        ${showSettings ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)` <sf-icon-button
              id="${item.panelId}_settings"
              type="link"
              @click=${event => component.openContextMenu(event, {
      tempVisible: isTempVisible
    })}
              data-settings
              scheme="on-surface"
              aria-label="Item Settings"
              root-class="absolute sf-admin-menu-item-settings"
              icon="more_vert"
            ></sf-icon-button>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      </li>
    `;
  }

  function renderMenuItem(item, main = false) {
    if (item.type === "divider") {
      return renderMenuDivider(item, main);
    }

    const panelVisibility = visible[item.panelId];
    const isTempVisible = panelVisibility?.temp === true;
    const showSettings = main && menuSettings;
    const isOverflowHidden = !menuSettings && !open && main && !isTempVisible && panelVisibility?.visible === false;
    const itemClass = joinClasses(`sf-admin-menu-item flex items-cross-center flex flex-1 max-w-full min-w-0`, item.active || item.current ? "active" : "", isTempVisible ? " opacity-5" : "", item.disabled ? "disabled" : "", showSettings ? "settings-active" : "");
    const hidden = item.hidden && !isTempVisible || isOverflowHidden;
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
      <li
        :key=${item.panelId}
        data-order="${item.order}"
        data-panel-id="${item.panelId}"
        :ref=${main ? component.getItemRef(item.panelId) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        class="sf-admin-menu-item-wrap flex items-cross-center${hidden ? " hidden" : ""}${showSettings ? " settings-on relative" : ""}"
      >
        <!-- Продумать touch-action: none;-->
        ${showSettings ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)` <sf-icon-button
              id="${item.panelId}_move"
              type="link"
              data-move
              scheme="on-surface"
              aria-label="Set order"
              icon="drag_indicator"
              root-class="cursor-move"
            ></sf-icon-button>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        ${item.children?.length ? renderMenuButton(item, itemClass, showSettings) : renderMenuLink(item, itemClass, showSettings)}
        ${showSettings ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)` <sf-icon-button
              id="${item.panelId}_settings"
              type="link"
              @click=${event => component.openContextMenu(event, {
      tempVisible: isTempVisible
    })}
              data-settings
              scheme="on-surface"
              aria-label="Item Settings"
              root-class="absolute sf-admin-menu-item-settings"
              icon="more_vert"
            ></sf-icon-button>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      </li>
    `;
  }

  function renderPanel(item, level = 1) {
    if (!item.children?.length) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
    const isOpen = Boolean(panels[item.panelId]?.open);
    const hasOpenChild = item.children.some(child => child.children?.length && panels[child.panelId]?.open);
    const isInteractive = isOpen && !hasOpenChild;
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
      <section
        class=${joinClasses("sf-admin-menu-panel sf-admin-menu-panel-sub flex flex-col transition-all top-0 bottom-0 absolute overflow-hidden z-7", isOpen ? "open" : "")}
        data-panel=${item.panelId}
        data-level=${level}
        aria-label=${item.label || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        aria-hidden=${isInteractive ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : "true"}
        ?inert=${!isInteractive}
      >
        ${renderHeader(false, item)}
        <nav
          class="sf-admin-menu-section sf-admin-menu-main-sub flex-auto min-h-0"
        >
          <ul class="p-0 m-0 gap-1/3 flex flex-col">
            ${item.children.map(item => {
      return renderMenuItem(item);
    })}
          </ul>
        </nav>
      </section>
      ${item.children.map(child => renderPanel(child, level + 1))}
    `;
  }

  const panelClass = joinClasses("sf-admin-menu-panel flex flex-col h-full overflow-hidden z-6", context.compact ? "small" : "", context.panelClass);
  const hasOpenNestedPanel = [...(context.items || []), ...(context.bottomItems || [])].some(item => item.children?.length && panels[item.panelId]?.open);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <aside
      :ref=${component.refs.mainPanel}
      class=${joinClasses("sf-admin-menu flex h-full relative z-6", context.rootClass)}
      style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      aria-label=${context.ariaLabel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    >
      <section
        class=${panelClass}
        aria-hidden=${hasOpenNestedPanel ? "true" : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        ?inert=${hasOpenNestedPanel}
      >
        ${renderHeader()} ${renderSearch()}
        <nav
          :ref=${component.refs.menuPanel}
          class="sf-admin-menu-section sf-admin-menu-main flex-auto min-h-0 ${open || menuSettings ? "overflow-auto open" : ""}"
        >
          <ul class="p-0 m-0 gap-1/3 flex flex-col">
            ${(context.items || []).map(item => {
    return renderMenuItem(item, true);
  })}
            ${hasHidden && !menuSettings ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)` <li class="sf-admin-menu-item-wrap flex flex-col more">
                  <button
                    type="button"
                    @click=${() => component.toggleOpen()}
                    class="sf-admin-menu-item flex items-cross-center"
                  >
                    <span
                      class="sf-admin-menu-item-container flex items-cross-center flex-1"
                      ><i class="sf-icon sf-icon-loaded"
                        >keyboard_arrow_${open ? "up" : "down"}</i
                      ><span class="sf-admin-menu-more-text"
                        >${open ? menuText("collapse") : menuText("expand")}</span
                      ></span
                    >
                  </button>
                </li>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          </ul>
        </nav>
        ${renderBottom(context)}
      </section>
      ${(context.items || []).map(item => renderPanel(item))}
      ${(context.bottomItems || []).map(item => renderPanel(item))}
      ${!context.searchable ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)` <section
            class=${joinClasses("sf-admin-menu-panel sf-admin-menu-panel-search w-full flex flex-col transition-all top-0 bottom-0 bg-surface-1 absolute overflow-hidden", panels["search_panel"]?.open ? "open z-7" : "z-5")}
            data-panel="search_panel"
            aria-label=${menuText("search")}
            aria-hidden=${panels["search_panel"]?.open ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : "true"}
            ?inert=${!panels["search_panel"]?.open}
          >
            ${renderHeader(false, {
    label: context.searchTitle || menuText("search"),
    panelId: "search_panel"
  })}
            ${context.searchMode === "panel" ? renderSearchPanelBody() : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<nav
                  class="sf-admin-menu-section sf-admin-menu-search-section flex-auto min-h-0 overflow-auto"
                >
                  ${renderSearchResults()}
                </nav>`}
          </section>`}
    </aside>
  `;
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

/***/ "cbce4a5232a6"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getInitials: () => (/* binding */ getInitials),
/* harmony export */   normalizeInitialsWords: () => (/* binding */ normalizeInitialsWords)
/* harmony export */ });
const INITIALS_SKIP_WORDS = new Set(["а", "без", "в", "во", "для", "до", "за", "из", "из-за", "из-под", "и", "к", "ко", "между", "на", "над", "о", "об", "от", "по", "под", "при", "про", "с", "со", "у", "через", "the", "a", "an", "and", "for", "from", "in", "of", "on", "to"]);
function normalizeInitialsWords(value = "") {
  return String(value || "").trim().split(/[\s/|]+/).map(word => word.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "")).filter(Boolean);
}
function getInitials(value = "", options = {}) {
  const {
    maxLetters = 2,
    skipWords = INITIALS_SKIP_WORDS
  } = options;
  const words = normalizeInitialsWords(value);
  const significantWords = words.filter((word, index) => index === 0 || !skipWords.has(String(word).toLowerCase()));

  if (!significantWords.length) {
    return "";
  }

  if (significantWords.length > 1) {
    return significantWords.slice(0, maxLetters).map(word => Array.from(word)[0] || "").join("").toUpperCase();
  }

  return Array.from(significantWords[0]).slice(0, 1).join("").toUpperCase();
}

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
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("0845ef25b9de");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("68a311ab2b87");
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("fef8077ac919");
/* harmony import */ var _helpers_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("926043d18700");
/* harmony import */ var _helpers_draggable__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("2d094259808e");
/* harmony import */ var _core_js_position_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("2e9112dbdda9");
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("8489d1f5bab4");






 // Prefer the helper Core published; an isolated bundle uses its own copy.

const positioning = () => globalThis.SF?.Position || _core_js_position_js__WEBPACK_IMPORTED_MODULE_5__["default"];

const contextPortalOwners = new WeakMap();

function isAdminMenuItemNode(node) {
  return node?.nodeType === Node.ELEMENT_NODE && node?.tagName?.toLowerCase?.() === "sf-admin-menu-item";
}

function getDirectLabel(node) {
  return Array.from(node?.childNodes || []).filter(child => !isAdminMenuItemNode(child)).map(child => child.textContent || "").join(" ").replace(/\s+/g, " ").trim();
}

function normalizeSlot(value = "") {
  const normalized = String(value || "").trim().toLowerCase();
  return ["bottom", "footer"].includes(normalized) ? "bottom" : "main";
}

function normalizeItemType(node) {
  const type = String(node?.getAttribute?.("type") || "").trim().toLowerCase();
  return node?.hasAttribute?.("divider") || type === "divider" || type === "separator" ? "divider" : "item";
}

function createPanelId(path = []) {
  return `admin-menu-${path.join("-") || "root"}`;
}

function parseOrder(value, fallback = 0) {
  if (value === null || typeof value === "undefined" || value === "") {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function sortItemsByOrder(items = []) {
  return [...items].sort((left, right) => {
    if (left.order !== right.order) {
      return left.order - right.order;
    }

    return left.sourceIndex - right.sourceIndex;
  });
}

const LEGACY_MENU_SETTINGS_STORAGE_KEY = "main-menu-settings";
const MENU_TRANSLATIONS = {
  en: {
    save: "Save",
    hide: "Hide",
    show: "Show",
    settingsTitle: "Menu settings",
    searchPlaceholder: "Search sections",
    toggleLabel: "Menu",
    searchLabel: "Search the admin (Ctrl+K)",
    searchKeysHint: "↑↓ select · Enter open · Esc close"
  },
  ru: {
    save: "Сохранить",
    hide: "Скрыть",
    show: "Показать",
    settingsTitle: "Настройки меню",
    searchPlaceholder: "Поиск по разделам",
    toggleLabel: "Меню",
    searchLabel: "Поиск по админке (Ctrl+K)",
    searchKeysHint: "↑↓ выбрать · Enter открыть · Esc закрыть"
  }
}; // What the person typed, compared the way a person means it: case does not
// matter, ё reads as е, and the end of a word is dropped so that "роль" finds
// "Роли" and "платёж" finds "Платежи". The truncation is crude — it is not a
// morphology — but it is the rule the consumer's owner approved, and a crude
// rule that always behaves the same way is easier to live with than a clever
// one that sometimes does not.

const normalizeSearchWord = (value = "") => String(value || "").toLowerCase().replace(/ё/gu, "е");

const searchStem = (query = "") => {
  const word = normalizeSearchWord(query).trim();
  if (word.length < 4) return word;
  return word.slice(0, word.length - (word.length > 5 ? 2 : 1));
}; // Only an address inside this site is followed. A host result naming another
// origin is dropped rather than rendered as a link nobody vetted.


const isSameSiteHref = (href = "") => {
  const value = String(href ?? "").trim();
  if (!value || value.startsWith("//")) return false;

  try {
    const resolved = new URL(value, document.baseURI);
    return resolved.origin === new URL(document.baseURI).origin;
  } catch {
    return false;
  }
}; // The shared rule rather than a second copy of it. This read only the
// document's lang; `pageText` reads the nearest [lang] first, which is what
// every other component does and what src/core/js/page-language exists to make
// true -- «one rule for every component, so a page never mixes the two because
// two components looked in different places».


function documentMenuText(key, node) {
  return (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_6__.pageText)(MENU_TRANSLATIONS, key, node ?? globalThis.document?.documentElement ?? null);
}

function isSameSettings(left = {}, right = {}) {
  const keys = new Set([...Object.keys(left || {}), ...Object.keys(right || {})]);

  for (const key of keys) {
    if (!Object.is(left?.[key], right?.[key])) {
      return false;
    }
  }

  return true;
}

class SfAdminMenu extends _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__["default"] {
  static get props() {
    return {
      templateName: {
        attribute: "template",
        default: "default"
      },
      brand: {
        default: ""
      },
      logo: {
        default: ""
      },
      logoHref: {
        attribute: "logo-href",
        default: "#"
      },
      ariaLabel: {
        attribute: "aria-label",
        default: "Admin menu"
      },
      searchable: {
        type: Boolean,
        default: false
      },
      collapsible: {
        type: Boolean,
        default: false
      },
      settings: {
        type: Boolean,
        default: true
      },
      settingsTitle: {
        default: documentMenuText("settingsTitle")
      },
      compact: {
        type: Boolean,
        default: false
      },
      persistenceMode: {
        attribute: "persistence-mode",
        default: "local"
      },
      settingsMode: {
        attribute: "settings-mode",
        default: "user"
      },
      settingsRevision: {
        attribute: "settings-revision",
        type: Number,
        default: 0
      },
      systemSettingsRevision: {
        attribute: "system-settings-revision",
        type: Number,
        default: 0
      },
      allowSystemSettings: {
        attribute: "allow-system-settings",
        type: Boolean,
        default: false
      },
      searchPlaceholder: {
        attribute: "search-placeholder",
        default: documentMenuText("searchPlaceholder")
      },
      // The search as a panel instead of a row. The default is what every
      // page already has, so nothing moves under a host that says nothing.
      searchMode: {
        attribute: "search-mode",
        default: "row"
      },
      searchLabel: {
        attribute: "search-label",
        default: documentMenuText("searchLabel")
      },
      // The panel's own title. `search-label` is the magnifier's accessible
      // name and usually a sentence with the shortcut in it, which is not
      // a title; a host that wants its own word for the panel sets this.
      searchTitle: {
        attribute: "search-title",
        default: ""
      },
      searchShortcut: {
        attribute: "search-shortcut",
        default: "mod+k"
      },
      searchHint: {
        attribute: "search-hint",
        default: ""
      },
      searchKeysHint: {
        attribute: "search-keys-hint",
        default: documentMenuText("searchKeysHint")
      },
      count: 0,
      toggleLabel: {
        attribute: "toggle-label",
        default: documentMenuText("toggleLabel")
      },
      panelClass: {
        attribute: "panel-class",
        default: ""
      },
      rootClass: {
        default: ""
      }
    };
  }

  constructor() {
    super();
    this.refs = {
      mainPanel: this.createRef(),
      menuPanel: this.createRef(),
      contextMenu: this.createRef(),
      items: new Map()
    };
    this.createdItems = [];
    this._itemObserver = null;
    this.parentGap = 0;
    this.contextTarget = null;
    this._itemsData = [];
    this._itemHeightCache = new Map();
    this.resizeObserver = null;
    this._adminMenuInitToken = 0;
    this._searchSequence = 0;
    this._searchRequestId = null;
    this._searchDebounce = null;
    this._panels = {};

    this.debounce = (callback, delay = 300) => {
      let timerId;
      return (...args) => {
        clearTimeout(timerId);
        timerId = setTimeout(() => {
          callback.apply(this, args);
        }, delay);
      };
    };

    this.search = this.debounce(this.startSearch);
    this.menuSettings = {};
    this._settingsBaseline = {};
    this._itemsBaseline = [];
    this._layoutSettings = {};
    this._layoutBaseline = {};
    this._compactBaseline = false;
    this._settingsStorageError = "";
    this._settingsStorageWarningIssued = false;
    this.contextEvent = this.contextEvent.bind(this);
    this.contextKeyEvent = this.contextKeyEvent.bind(this);
    this.contextFocusEvent = this.contextFocusEvent.bind(this);
    this._contextEventBound = false;
    this._contextOpenToken = 0;
    this._contextPortal = null;
    this._contextReturnFocus = null;
    this._contextReadyHandler = null;
    this._contextTriggerAttributes = null;
    this._contextGeometryFrame = null;
    this._contextSizeObserver = null;
    this._contextSizeTarget = null;
    this._contextScrollPositions = new Map();
    this._panelReturnFocus = new Map();
    this._navigationFocusToken = 0;
    this.scheduleContextGeometry = this.scheduleContextGeometry.bind(this);
    this.contextScrollEvent = this.contextScrollEvent.bind(this);
    this.addEventListener("sf-after-render", event => {
      if (event.target !== this && event.target.closest?.("sf-admin-menu") === this) {
        this.syncContextTriggers();
      }
    });
    this.state = {
      panels: {},
      menuSettings: false,
      openSearch: false,
      searchQuery: "",
      searchResults: [],
      // What the host has answered for the query on screen, whether an
      // answer is still on its way, and which result the keyboard is on.
      searchGroups: [],
      // What the host offers before anything is typed, as a recent list.
      searchRecent: [],
      searchPending: false,
      searchActiveId: "",
      visible: {},
      hasHidden: false,
      open: false,
      settingsStatus: "idle",
      settingsError: ""
    };
  }

  translate(key) {
    return documentMenuText(key);
  }

  connectedCallback() {
    this.bindSearchShortcut();
    this.observeItemChildren();
    this.menuSettings = this.getMainMenuSettings();
    this.captureInitialItems();
    this.commitSettingsBaseline();
    this.set({
      panels: { ...this._panels
      }
    });
    super.connectedCallback();
    this.whenRendered(() => {
      this.emitCompactChange("connected");
    }, {
      next: true
    });
  }

  disconnectedCallback() {
    this.unbindSearchShortcut();
    this.unbindContextEvent();
    this.closeContextMenu({
      restoreFocus: false
    });
    this.disconnectItemObserver();
    this.resizeObserver?.disconnect?.();
    this.resizeObserver = null;
    this._adminMenuInitToken++;
    this._navigationFocusToken++;

    this._panelReturnFocus.clear();

    super.disconnectedCallback();
  }

  itemNodeToData(node, path = []) {
    const sourceIndex = path[path.length - 1] || 0;
    const type = normalizeItemType(node);
    const children = type === "divider" ? [] : sortItemsByOrder(Array.from(node?.children || []).filter(isAdminMenuItemNode).map((child, index) => this.itemNodeToData(child, [...path, index])));
    const label = node.getAttribute("label") || node.getAttribute("text") || node.getAttribute("title") || getDirectLabel(node);
    const data = {
      type,
      label,
      leftIcon: node.getAttribute("left-icon") || "",
      rightIcon: node.getAttribute("right-icon") || "",
      href: node.getAttribute("href") || "",
      target: node.getAttribute("target") || "",
      rel: node.getAttribute("rel") || "",
      badge: node.getAttribute("badge") || "",
      value: node.getAttribute("value") || "",
      hidden: node.hasAttribute("hidden"),
      placeholder: type === "divider" ? false : node.getAttribute("placeholder") || true,
      order: parseOrder(node.getAttribute("order"), sourceIndex),
      sourceIndex,
      slot: normalizeSlot(node.getAttribute("slot") || node.getAttribute("position")),
      activePanels: {},
      active: node.hasAttribute("active"),
      current: node.hasAttribute("current"),
      disabled: node.hasAttribute("disabled"),
      children,
      itemId: node.getAttribute("item-id") || node.getAttribute("panelId") || createPanelId(path),
      panelId: node.getAttribute("item-id") || node.getAttribute("panelId") || createPanelId(path)
    };
    return this.applyMenuItemSettings(data);
  }

  getMenuItemSettings(panelId) {
    if (!panelId || !this.menuSettings || typeof this.menuSettings !== "object") {
      return {};
    }

    const settings = this.menuSettings[panelId];
    return settings && typeof settings === "object" ? settings : {};
  }

  applyMenuItemSettings(item = {}) {
    const settings = this.getMenuItemSettings(item.panelId);

    if (!Object.keys(settings).length) {
      return item;
    }

    return { ...item,
      ...settings,
      panelId: item.panelId,
      children: item.children
    };
  }

  patchMenuItemSettings(panelId, patch = {}, options = {}) {
    if (!panelId) return {};
    const currentSettings = this.menuSettings && typeof this.menuSettings === "object" ? this.menuSettings : {};
    const currentItemSettings = this.getMenuItemSettings(panelId);
    const nextPatch = typeof patch === "function" ? patch(currentItemSettings) : patch;
    const nextItemSettings = { ...currentItemSettings,
      ...(nextPatch || {})
    };

    if (isSameSettings(currentItemSettings, nextItemSettings)) {
      return currentItemSettings;
    }

    this.menuSettings = { ...currentSettings,
      [panelId]: nextItemSettings
    };

    if (options.persist === true && this.isLocalPersistence()) {
      this.persistMenuSettings();
    }

    return nextItemSettings;
  }

  removeMenuItemSettings(panelId, keys = null, options = {}) {
    if (!panelId || !this.menuSettings?.[panelId]) {
      return {};
    }

    if (!keys) {
      const {
        [panelId]: removed,
        ...rest
      } = this.menuSettings;
      this.menuSettings = rest;

      if (options.persist === true && this.isLocalPersistence()) {
        this.persistMenuSettings();
      }

      return removed || {};
    }

    const keysList = Array.isArray(keys) ? keys : [keys];
    const nextItemSettings = { ...this.menuSettings[panelId]
    };
    keysList.forEach(key => {
      delete nextItemSettings[key];
    });

    if (isSameSettings(this.menuSettings[panelId], nextItemSettings)) {
      return this.menuSettings[panelId];
    }

    this.menuSettings = { ...this.menuSettings,
      [panelId]: nextItemSettings
    };

    if (options.persist === true && this.isLocalPersistence()) {
      this.persistMenuSettings();
    }

    return nextItemSettings;
  }

  persistMenuSettings() {
    if (!this.isLocalPersistence()) return false;

    try {
      const nextValue = JSON.stringify(this.menuSettings || {});
      const storageKey = this.getMenuSettingsStorageKey();
      const storage = window.localStorage;

      if (storage.getItem(storageKey) === nextValue) {
        this._settingsStorageError = "";
        return false;
      }

      storage.setItem(storageKey, nextValue);
      this._settingsStorageError = "";
      return true;
    } catch (error) {
      this.handleSettingsStorageError(error, true);
      return false;
    }
  }

  clearMenuSettingsStorage() {
    try {
      const storage = window.localStorage;
      storage.removeItem(this.getMenuSettingsStorageKey());
      storage.removeItem(LEGACY_MENU_SETTINGS_STORAGE_KEY);
      this._settingsStorageError = "";
      return true;
    } catch (error) {
      this.handleSettingsStorageError(error, true);
      return false;
    }
  }

  handleSettingsStorageError(error, expose = false) {
    this._settingsStorageError = "settings_storage_failed";

    if (!this._settingsStorageWarningIssued) {
      this._settingsStorageWarningIssued = true;
      console.warn("SF AdminMenu: browser settings storage is unavailable", error);
    }

    if (expose) {
      this.set({
        settingsStatus: "error",
        settingsError: ""
      }, "settingsStorageError");
    }
  }

  createDivider() {
    const divider = document.createElement("sf-admin-menu-item");
    divider.setAttribute("type", "divider");
    const data = this.itemNodeToData(divider, [`custom-divider-${this._itemsData.length + 1}`]);
    this.createdItems.push(data);
    this._itemsData = [data, ...this._itemsData];
    this.requestComponentUpdate("createDivider");
  }

  findItemByPanelId(panelId, items = this._itemsData) {
    if (!panelId) return null;

    for (const item of items || []) {
      if (item.panelId === panelId) {
        return item;
      }

      const child = this.findItemByPanelId(panelId, item.children || []);

      if (child) {
        return child;
      }
    }

    return null;
  }

  updateItemByPanelId(panelId, updater, items = this._itemsData) {
    return (items || []).map(item => {
      if (item.panelId === panelId) {
        return updater(item);
      }

      if (item.children?.length) {
        return { ...item,
          children: this.updateItemByPanelId(panelId, updater, item.children)
        };
      }

      return item;
    });
  }

  mapItems(updater, items = this._itemsData) {
    return (items || []).map(item => {
      const nextItem = updater(item);
      return { ...nextItem,
        children: nextItem.children?.length ? this.mapItems(updater, nextItem.children) : nextItem.children
      };
    });
  }

  toggleHidden() {
    const visible = { ...(this.state.visible || {})
    };
    this._itemsData = this.mapItems(item => {
      const isStoredHidden = this.getMenuItemSettings(item.panelId).hidden === true;
      const isTempVisible = visible[item.panelId]?.temp === true;

      if (!isStoredHidden && !isTempVisible) {
        return item;
      }

      const nextTemp = !isTempVisible;
      visible[item.panelId] = { ...(visible[item.panelId] || {}),
        temp: nextTemp
      };
      return { ...item,
        hidden: isStoredHidden && !nextTemp
      };
    });
    this.set({
      visible
    }, "toggleHidden");
  }

  toggleItemVisibility(item, visibility) {
    const li = item.closest("li");
    const {
      panelId
    } = li.dataset;
    this.patchMenuItemSettings(panelId, {
      hidden: !visibility
    });
    this._itemsData = this.updateItemByPanelId(panelId, el => ({ ...el,
      hidden: !visibility
    }));
    const visible = { ...(this.state.visible || {})
    };

    if (!visibility) {
      delete visible[panelId];
    } else {
      visible[panelId] = {
        visible: true
      };
    }

    this.closeContextMenu();
    this.set({
      visible
    }, "toggleItemVisibility");
  }

  deleteItem(item) {
    const li = item.closest("li");
    const {
      panelId
    } = li.dataset;
    this._itemsData = this._itemsData.filter(el => el.panelId !== panelId);
    this.closeContextMenu();
    this.requestComponentUpdate("deleteItem");
  }

  isSearchPanelMode() {
    return this.getProp("searchMode") === "panel";
  } // The shortcut opens the search from anywhere on the page. It is an
  // attribute so a host can change it, and an empty one turns it off — a
  // Framework component has no business holding a page-wide key hostage.


  parseSearchShortcut(value = this.getProp("searchShortcut")) {
    const text = String(value ?? "").trim().toLowerCase();
    if (!text) return null;
    const parts = text.split("+").map(part => part.trim()).filter(Boolean);
    const key = parts.pop() || "";
    if (!key) return null;
    return {
      key,
      mod: parts.includes("mod"),
      ctrl: parts.includes("ctrl"),
      meta: parts.includes("meta") || parts.includes("cmd"),
      shift: parts.includes("shift"),
      alt: parts.includes("alt")
    };
  }

  bindSearchShortcut() {
    if (this._searchShortcutBound) return this;

    this._searchShortcutBound = event => this.handleSearchShortcut(event);

    document.addEventListener("keydown", this._searchShortcutBound);
    return this;
  }

  unbindSearchShortcut() {
    if (!this._searchShortcutBound) return this;
    document.removeEventListener("keydown", this._searchShortcutBound);
    this._searchShortcutBound = null;
    return this;
  }

  handleSearchShortcut(event) {
    if (!this.isSearchPanelMode()) return this;
    const shortcut = this.parseSearchShortcut();
    if (!shortcut) return this;
    if (String(event.key || "").toLowerCase() !== shortcut.key) return this;
    const modifier = shortcut.mod ? event.ctrlKey || event.metaKey : (!shortcut.ctrl || event.ctrlKey) && (!shortcut.meta || event.metaKey);
    if (!modifier) return this;
    if (shortcut.shift && !event.shiftKey) return this;
    if (shortcut.alt && !event.altKey) return this;
    event.preventDefault();
    return this.openSearchPanel();
  }

  openSearchPanel() {
    if (!this.isSearchPanelMode()) return this;
    const opener = this.getSearchToggle();
    if (opener) this._panelReturnFocus.set("search_panel", opener);
    this._searchOpenedCompact = this.getProp("compact") !== false;
    if (this._searchOpenedCompact) this.setCompact(false, "search");
    this.set(state => ({
      openSearch: true,
      panels: { ...(state.panels || {}),
        search_panel: { ...(state.panels?.search_panel || {}),
          open: true
        }
      }
    }));
    this.scheduleNavigationFocus(() => this.getSearchInput());
    return this;
  }

  closeSearchPanel() {
    this.clearSearchDebounce();
    this._searchRequestId = null;
    this.set(state => ({
      openSearch: false,
      searchQuery: "",
      searchResults: [],
      searchGroups: [],
      searchPending: false,
      searchActiveId: "",
      panels: { ...(state.panels || {}),
        search_panel: { ...(state.panels?.search_panel || {}),
          open: false
        }
      }
    })); // The panel is wide, so a collapsed menu was expanded to carry it.
    // Closing gives that menu back the way it was found.

    if (this._searchOpenedCompact) {
      this._searchOpenedCompact = false;
      this.setCompact(true, "search-close");
    }

    const returnFocus = this._panelReturnFocus.get("search_panel");

    this._panelReturnFocus.delete("search_panel");

    this.scheduleNavigationFocus(() => this.getSearchReturnTarget(returnFocus));
    return this;
  } // Where the panel gives the focus back. The opener first; then the
  // magnifier. Both of those live in the main menu, which is inert while a
  // submenu is open — then the place the user is actually standing in is that
  // submenu, so its back row takes the focus rather than nothing at all.


  getSearchReturnTarget(returnFocus = null) {
    if (this.isAvailableNavigationTarget(returnFocus)) return returnFocus;
    const toggle = this.getSearchToggle();
    if (this.isAvailableNavigationTarget(toggle)) return toggle;
    const panels = [...this.querySelectorAll(".sf-admin-menu-panel-sub.open")];

    for (let index = panels.length - 1; index >= 0; index -= 1) {
      const back = panels[index].querySelector(".sf-admin-menu-back");
      if (this.isAvailableNavigationTarget(back)) return back;
    }

    return null;
  }

  getSearchToggle() {
    return this.querySelector('[data-sf-admin-search-toggle]');
  }

  normalizeSearchText(text = "") {
    return String(text || "").trim().replace(/\s+/g, " ").toLowerCase();
  }

  flattenMenuItems(items = [], parentPath = [], parentPanels = []) {
    return items.flatMap(item => {
      if (item.hidden || item.type === "divider") {
        return [];
      }

      const path = [...parentPath, item.label].filter(Boolean);
      const panelPath = [...parentPanels];
      const current = { ...item,
        path,
        panelPath,
        searchText: this.normalizeSearchText(path.join(" ")),
        searchLabel: this.normalizeSearchText(item.label)
      };
      const childPanels = item.children?.length ? [...panelPath, item.panelId] : panelPath;
      return [current, ...this.flattenMenuItems(item.children || [], path, childPanels)];
    });
  }

  scoreSearchItem(item, query) {
    if (!query) return 0;
    if (item.searchLabel === query) return 100;
    if (item.searchLabel.startsWith(query)) return 90;
    if (item.searchLabel.includes(query)) return 70;
    if (item.searchText.includes(query)) return 40;
    return 0;
  }

  getSearchResults(text = "") {
    const query = this.normalizeSearchText(text);
    if (!query) return [];
    return this.flattenMenuItems(this._itemsData).map(item => ({ ...item,
      score: this.scoreSearchItem(item, query)
    })).filter(item => item.score > 0 && !item.disabled).sort((left, right) => {
      if (right.score !== left.score) return right.score - left.score;
      return left.path.join(" ").localeCompare(right.path.join(" "));
    }).slice(0, 20);
  } // What the field calls on every keystroke. Both templates have called this
  // since the row was added, and nothing answered: `search` was never defined,
  // so typing in the row raised a TypeError and searched nothing. It is one
  // line, and it is the only way into searching from the page.


  search(text = "") {
    return this.startSearch(text);
  }

  clearSearchDebounce() {
    if (this._searchDebounce) {
      clearTimeout(this._searchDebounce);
      this._searchDebounce = null;
    }

    return this;
  } // The menu's own answer: its sections, including the nested ones, each with
  // the section it sits in and the part that matched, so the panel can show
  // where a result lives and what it matched on.


  getSectionResults(text = "") {
    const stem = searchStem(text);
    if (!stem) return [];
    return this.flattenMenuItems(this._itemsData).filter(item => !item.disabled && item.label).map(item => {
      const label = String(item.label || "");
      const index = normalizeSearchWord(label).indexOf(stem);
      if (index < 0) return null;
      const parentPath = item.path.slice(0, -1);
      return { ...item,
        parentLabel: parentPath[parentPath.length - 1] || "",
        match: {
          start: index,
          length: stem.length
        }
      };
    }).filter(Boolean).slice(0, 20);
  } // The host's answer, for the query it was asked about and no other. An
  // answer to a query the person has moved on from is dropped: it would
  // otherwise replace what they are reading with results for something they
  // typed two keystrokes ago.


  setSearchResults(requestId, groups = []) {
    if (!requestId || requestId !== this._searchRequestId) return false;
    this.set({
      searchGroups: this.cleanSearchGroups(groups),
      searchPending: false
    });
    this.syncSearchSelection();
    return true;
  } // What the host offers an empty field: a recent list, named by the host,
  // standing until it sets another. It is not an answer to a query, so it has
  // no request id -- but it is read the same way and cleaned the same way.


  setRecentResults(groups = []) {
    this.set({
      searchRecent: this.cleanSearchGroups(groups)
    });
    this.syncSearchSelection();
    return true;
  }

  cleanSearchGroups(groups = []) {
    return (Array.isArray(groups) ? groups : []).map(group => ({
      key: String(group?.key ?? ""),
      label: String(group?.label ?? ""),
      more: group?.more && isSameSiteHref(group.more.href) ? {
        text: String(group.more.text ?? ""),
        href: String(group.more.href)
      } : null,
      items: (Array.isArray(group?.items) ? group.items : []).filter(item => item && isSameSiteHref(item.href)).map(item => ({
        text: String(item.text ?? ""),
        subtext: item.subtext == null ? "" : String(item.subtext),
        icon: item.icon == null ? "" : String(item.icon),
        href: String(item.href)
      }))
    })).filter(group => group.items.length);
  } // Asking the host is a separate step from searching the menu: the sections
  // answer at once, the host answers when it can, and the panel says which
  // part it is still waiting for.


  requestHostSearch(query) {
    this.clearSearchDebounce();

    if (!query) {
      this._searchRequestId = null;
      this.set({
        searchGroups: [],
        searchPending: false
      });
      return this;
    }

    this._searchDebounce = setTimeout(() => {
      this._searchDebounce = null;
      const requestId = `search-${++this._searchSequence}`;
      this._searchRequestId = requestId;
      this.set({
        searchPending: true
      });
      this.dispatchEvent(new CustomEvent("sf-admin-menu-search", {
        bubbles: true,
        composed: true,
        detail: Object.freeze({
          query,
          requestId
        })
      }));
    }, 250);
    return this;
  }

  startSearch(text = "") {
    const query = String(text || "").trim(); // In panel mode the panel is already open and stays open: the query
    // only changes what is in it, and an empty query shows whatever the
    // host offers for an empty query rather than closing on the person.

    if (this.isSearchPanelMode()) {
      this.set({
        searchQuery: query,
        searchResults: this.getSectionResults(query),
        searchActiveId: ""
      });
      this.requestHostSearch(query);
      this.syncSearchSelection();
      return this.state.searchResults;
    }

    if (!query.length) {
      this.set(state => ({
        openSearch: false,
        searchQuery: "",
        searchResults: [],
        panels: { ...(state.panels || {}),
          search_panel: { ...(state.panels?.search_panel || {}),
            open: false
          }
        }
      }));
      return false;
    }

    const searchResults = this.getSearchResults(query);
    const activeElement = document.activeElement;

    if (activeElement && this.contains(activeElement)) {
      this._panelReturnFocus.set("search_panel", activeElement);
    }

    this.set(state => ({
      openSearch: true,
      searchQuery: query,
      searchResults,
      panels: { ...(state.panels || {}),
        search_panel: { ...(state.panels?.search_panel || {}),
          open: true
        }
      }
    }));
    return searchResults;
  } // Every row the keyboard can land on, in the order they are read: the
  // sections the menu found, then each group the host sent.


  getSearchSelectables() {
    if (!this.state.searchQuery) {
      return (this.state.searchRecent || []).flatMap((group, groupIndex) => group.items.map((item, index) => ({
        id: `sf-admin-search-recent-${groupIndex}-${index}`,
        kind: "host",
        item
      })));
    }

    const sections = (this.state.searchResults || []).map((item, index) => ({
      id: `sf-admin-search-section-${index}`,
      kind: "section",
      item
    }));
    const hosted = (this.state.searchGroups || []).flatMap((group, groupIndex) => group.items.map((item, index) => ({
      id: `sf-admin-search-${groupIndex}-${index}`,
      kind: "host",
      item
    })));
    return [...sections, ...hosted];
  } // The selection follows the rows: it stays where it is while that row is
  // still there, and otherwise lands on the first one. A selection pointing at
  // a row that no longer exists would leave Enter doing nothing.


  syncSearchSelection() {
    const rows = this.getSearchSelectables();
    const current = this.state.searchActiveId;

    if (!rows.length) {
      if (current) this.set({
        searchActiveId: ""
      });
      return this;
    }

    if (!rows.some(row => row.id === current)) {
      this.set({
        searchActiveId: rows[0].id
      });
    }

    return this;
  }

  moveSearchSelection(step = 1) {
    const rows = this.getSearchSelectables();
    if (!rows.length) return this;
    const index = rows.findIndex(row => row.id === this.state.searchActiveId);
    const next = (index + step + rows.length) % rows.length;
    this.set({
      searchActiveId: rows[next].id
    });
    this.scrollSearchSelectionIntoView();
    return this;
  }

  scrollSearchSelectionIntoView() {
    const id = this.state.searchActiveId;
    if (!id) return this;
    requestAnimationFrame(() => {
      this.querySelector(`[id="${id}"]`)?.scrollIntoView?.({
        block: "nearest"
      });
    });
    return this;
  }

  activateSearchSelection() {
    const row = this.getSearchSelectables().find(entry => entry.id === this.state.searchActiveId);
    if (!row) return this;

    if (row.kind === "host") {
      window.location.assign(row.item.href);
      return this;
    }

    if (row.item.children?.length) {
      return this.openSearchResult(row.item);
    }

    const trigger = this.getPanelTrigger(row.item.panelId) ?? this.querySelector(`[data-sf-admin-item="${row.item.panelId}"]`);
    trigger?.click?.();
    return this;
  } // The field answers the keys a combobox is expected to answer, and nothing
  // else: the arrows move the selection, Enter opens it, Escape leaves.


  handleSearchKeydown(event) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      return this.moveSearchSelection(1);
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      return this.moveSearchSelection(-1);
    }

    if (event.key === "Enter") {
      event.preventDefault();
      return this.activateSearchSelection();
    }

    if (event.key === "Escape") {
      event.preventDefault();
      return this.closeSearchPanel();
    }

    return this;
  }

  openSearchResult(item, event = null) {
    if (!item) return;

    if (item.children?.length) {
      event?.preventDefault?.();
      const returnFocus = this.getPanelTrigger(item.panelId);

      if (returnFocus) {
        this._panelReturnFocus.set(item.panelId, returnFocus);
      }

      const nextPanels = { ...(this.state.panels || {})
      };
      Object.keys(nextPanels).forEach(panelId => {
        if (panelId === "search_panel") return;
        nextPanels[panelId] = { ...(nextPanels[panelId] || {}),
          open: false
        };
      });
      [...(item.panelPath || []), item.panelId].forEach(panelId => {
        nextPanels[panelId] = { ...(nextPanels[panelId] || {}),
          open: true
        };
      });
      nextPanels.search_panel = { ...(nextPanels.search_panel || {}),
        open: false
      };
      this.set({
        panels: nextPanels,
        openSearch: false
      });
      this.scheduleNavigationFocus(() => this.getPanelBackButton(item.panelId));
    }
  }

  observeItemChildren() {
    if (this._itemObserver) return;
    this._itemObserver = new MutationObserver(mutations => {
      const hasNewItems = mutations.some(mutation => Array.from(mutation.addedNodes || []).some(isAdminMenuItemNode));
      if (!hasNewItems || !this.captureInitialItems()) return;
      this.requestComponentUpdate("items");
    });

    this._itemObserver.observe(this, {
      childList: true
    });
  }

  toggleMenuSettings() {
    const opening = !this.state.menuSettings;

    if (opening) {
      this.commitSettingsBaseline();
    }

    this.set(prevState => {
      const {
        menuSettings
      } = prevState;
      return {
        menuSettings: !menuSettings,
        visible: {},
        hasHidden: false
      };
    });

    if (opening && !this.isLocalPersistence()) {
      this.refreshSettings();
    }
  }

  cancelMenuSettings() {
    this.menuSettings = structuredClone(this._settingsBaseline || {});
    this._itemsData = structuredClone(this._itemsBaseline || []);
    this._layoutSettings = structuredClone(this._layoutBaseline || {});
    this.setCompact(this._compactBaseline, "settings-cancel");
    this.closeContextMenu();
    this.set({
      menuSettings: false,
      visible: {},
      hasHidden: false,
      settingsStatus: "idle",
      settingsError: ""
    }, "cancelMenuSettings");
    this.emitSettingsEvent("sf-admin-menu-settings-cancel", {
      target: this.getSettingsMode(),
      base_revision: this.getSettingsRevision()
    });
  }

  resetMenuSettings() {
    if (this.isLocalPersistence()) {
      if (!this.clearMenuSettingsStorage()) return;
      this.menuSettings = {};
      this._itemsData = this.mapItems(item => ({ ...item,
        hidden: false,
        order: item.sourceIndex
      }));
      this.commitSettingsBaseline();
      this.closeContextMenu();
      this.set({
        settingsStatus: "success",
        settingsError: ""
      }, "resetMenuSettings");
      return;
    }

    this.set({
      settingsStatus: "saving",
      settingsError: ""
    }, "resetMenuSettings");
    this.emitSettingsEvent("sf-admin-menu-settings-reset", {
      target: this.getSettingsMode(),
      base_revision: this.getSettingsRevision()
    });
  }

  selectSettingsMode(mode) {
    if (this.isLocalPersistence()) return;
    const nextMode = mode === "system" && this.getProp("allowSystemSettings") ? "system" : "user";
    if (nextMode === this.getSettingsMode()) return;
    this.setState({
      settingsMode: nextMode
    });
    this.set({
      settingsStatus: "saving",
      settingsError: ""
    }, "settingsMode");
    this.emitSettingsEvent("sf-admin-menu-settings-mode-change", {
      target: nextMode
    });
  }

  refreshSettings() {
    if (this.isLocalPersistence()) return;
    this.set({
      settingsStatus: "saving",
      settingsError: ""
    }, "refreshSettings");
    this.emitSettingsEvent("sf-admin-menu-settings-refresh", {
      target: this.getSettingsMode(),
      base_revision: this.getSettingsRevision(),
      profile: this.buildSettingsProfile()
    });
  }

  disconnectItemObserver() {
    this._itemObserver?.disconnect?.();
    this._itemObserver = null;
  }

  toggleCompact() {
    this.setCompact(!this.getProp("compact"), "toggle");
  }

  setCompact(compact, source = "api") {
    const nextCompact = Boolean(compact);
    const changed = nextCompact !== Boolean(this.getProp("compact"));

    if (changed) {
      this.setState({
        compact: nextCompact
      });
    }

    this.emitCompactChange(source);
    return changed;
  }

  emitCompactChange(source = "api") {
    this.emitSettingsEvent("sf-admin-menu-compact-change", {
      compact: Boolean(this.getProp("compact")),
      source
    });
  }

  toggleOpen() {
    this.set(prevState => {
      const {
        open
      } = prevState;
      return {
        open: !open
      };
    });
  }

  getItemRef(id) {
    if (!this.refs.items.has(id)) {
      this.refs.items.set(id, this.createRef());
    }

    return this.refs.items.get(id);
  }

  updateMenuItemHeight() {
    const visibleItem = [...this.refs.items.entries()].find(([id, refValue]) => {
      const value = this.getMenuItemElement(id, refValue);
      return value && !value.classList.contains("hidden") && !value.classList.contains("sf-admin-menu-divider-wrap");
    });
    const visibleItemElement = visibleItem ? this.getMenuItemElement(visibleItem[0], visibleItem[1]) : null;
    const nextHeight = visibleItemElement?.offsetHeight || this.menuItemHeight || 0;

    if (nextHeight && nextHeight !== this.menuItemHeight) {
      this.menuItemHeight = nextHeight;
    }

    return this.menuItemHeight;
  }

  saveNewItemsData() {
    this.createdItems.forEach(item => {
      const created = this.findItemByPanelId(item.panelId);
      this.patchMenuItemSettings(item.panelId, {
        created: true,
        type: created.type,
        order: created.order
      });
    });
    this.createdItems = [];
  }

  saveMenuSettings() {
    this.saveNewItemsData();

    if (this.isLocalPersistence()) {
      this.persistMenuSettings();
      if (this._settingsStorageError) return;
      this.commitSettingsBaseline();
      this.closeContextMenu();
      this.toggleMenuSettings();
      this.set({
        settingsStatus: "success",
        settingsError: ""
      }, "saveMenuSettings");
      return;
    }

    this.set({
      settingsStatus: "saving",
      settingsError: ""
    }, "saveMenuSettings");
    this.emitSettingsEvent("sf-admin-menu-settings-save", {
      target: this.getSettingsMode(),
      base_revision: this.getSettingsRevision(),
      profile: this.buildSettingsProfile()
    });
  }

  applySettingsResult(result = {}) {
    const target = result.target === "system" ? "system" : "user";
    const revision = Number(result.revision);

    if (Number.isFinite(revision)) {
      this.setState(target === "system" ? {
        systemSettingsRevision: revision
      } : {
        settingsRevision: revision
      });
    }

    if (result.profile && typeof result.profile === "object") {
      this.menuSettings = this.profileItemsToSettings(result.profile.items || {});
      this._layoutSettings = { ...(result.profile.layout || {})
      };
    }

    if (Array.isArray(result.tree)) {
      this._itemsData = result.tree.map((node, index) => this.externalNodeToData(node, index));
      this._panels = this.buildPanels(this._itemsData, {});
    }

    if (typeof result.compact === "boolean") {
      this.setCompact(result.compact, "settings-result");
    }

    this.commitSettingsBaseline();
    this.closeContextMenu();
    this.set({
      menuSettings: false,
      settingsStatus: "success",
      settingsError: ""
    }, "applySettingsResult");
  }

  applySettingsError(error = {}) {
    const status = error?.status === 409 || error?.error === "revision_conflict" ? "conflict" : "error";
    this.set({
      settingsStatus: status,
      settingsError: typeof error?.message === "string" ? error.message : ""
    }, "applySettingsError");
  }

  applyExternalSettingsState(state = {}, target = "user") {
    const profile = state?.profiles?.[target]?.profile || {};
    const revision = Number(state?.profiles?.[target]?.revision || 0);
    this.menuSettings = this.profileItemsToSettings(profile.items || {});
    this._layoutSettings = { ...(profile.layout || {})
    };
    const systemCompact = state?.profiles?.system?.profile?.layout?.compact;
    const userCompact = state?.profiles?.user?.profile?.layout?.compact;
    const resolvedCompact = target === "system" ? Boolean(systemCompact ?? false) : Boolean(userCompact ?? systemCompact ?? false);
    const tree = state?.trees?.[target];
    this._itemsData = Array.isArray(tree) ? tree.map((node, index) => this.externalNodeToData(node, index)) : this.mapItems(item => this.applyMenuItemSettings({ ...item,
      hidden: false
    }));
    this._panels = this.buildPanels(this._itemsData, {});
    this.setState(target === "system" ? {
      settingsMode: "system",
      systemSettingsRevision: revision
    } : {
      settingsMode: "user",
      settingsRevision: revision
    });
    this.setCompact(resolvedCompact, "settings-state");
    this.commitSettingsBaseline();
    this.set({
      settingsStatus: "idle",
      settingsError: ""
    }, "applyExternalSettingsState");
  }

  buildSettingsProfile() {
    const items = {};

    const collect = (menuItems = []) => {
      menuItems.forEach(item => {
        if (item.type !== "divider" && item.itemId) {
          const delta = this.getMenuItemSettings(item.panelId);
          const normalized = {};
          if (Number.isFinite(delta.order)) normalized.order = delta.order;
          if (typeof delta.hidden === "boolean") normalized.hidden = delta.hidden;
          if (typeof delta.pinned === "boolean") normalized.pinned = delta.pinned;
          if (Object.keys(normalized).length) items[item.itemId] = normalized;
        }

        collect(item.children || []);
      });
    };

    collect(this._itemsData);
    const layout = {};
    const compact = Boolean(this.getProp("compact"));

    if (typeof this._layoutSettings?.compact === "boolean" || compact !== this._compactBaseline) {
      layout.compact = compact;
    }

    return {
      schema_version: 1,
      items,
      layout
    };
  }

  profileItemsToSettings(items = {}) {
    return Object.fromEntries(Object.entries(items || {}).map(([itemId, delta]) => [itemId, { ...(delta || {})
    }]));
  }

  externalNodeToData(node = {}, sourceIndex = 0) {
    const itemId = String(node.id || "");
    const item = {
      type: "item",
      itemId,
      panelId: itemId,
      label: String(node.label || ""),
      leftIcon: String(node.icon || ""),
      rightIcon: "",
      href: String(node.href || ""),
      target: "",
      rel: "",
      badge: String(node.badge || ""),
      value: "",
      hidden: node.hidden === true,
      placeholder: true,
      order: Number.isFinite(Number(node.order)) ? Number(node.order) : sourceIndex,
      sourceIndex,
      slot: normalizeSlot(node.slot),
      activePanels: {},
      active: node.active === true,
      current: node.current === true,
      disabled: node.disabled === true,
      children: Array.isArray(node.children) ? node.children.map((child, index) => this.externalNodeToData(child, index)) : []
    };
    return this.applyMenuItemSettings(item);
  }

  commitSettingsBaseline() {
    this._settingsBaseline = structuredClone(this.menuSettings || {});
    this._itemsBaseline = structuredClone(this._itemsData || []);
    this._layoutBaseline = structuredClone(this._layoutSettings || {});
    this._compactBaseline = Boolean(this.getProp("compact"));
  }

  emitSettingsEvent(name, detail = {}) {
    this.dispatchEvent(new CustomEvent(name, {
      bubbles: true,
      composed: true,
      detail
    }));
  }

  isLocalPersistence() {
    return this.getProp("persistenceMode") !== "external";
  }

  getSettingsMode() {
    return this.getProp("settingsMode") === "system" ? "system" : "user";
  }

  getSettingsRevision() {
    const revision = this.getSettingsMode() === "system" ? this.getProp("systemSettingsRevision") : this.getProp("settingsRevision");
    return Number.isFinite(Number(revision)) ? Number(revision) : 0;
  }

  getMenuPanelElement() {
    return this.refs.menuPanel?.value || (this.shadowRoot || this).querySelector(".sf-admin-menu-main");
  }

  getMenuItemElement(panelId, refValue = null) {
    if (refValue?.value) return refValue.value;
    return [...(this.shadowRoot || this).querySelectorAll("[data-panel-id]")].find(element => element.dataset.panelId === String(panelId));
  }

  updateOverflow() {
    const menuPanel = this.getMenuPanelElement();
    if (!menuPanel) return;
    if (!this.refs.items.size) return;
    const itemRefs = [...this.refs.items.entries()].filter(([id]) => {
      const item = this.findItemByPanelId(id);
      return !item?.hidden;
    });
    const visibleItemHeight = this.updateMenuItemHeight();
    if (!visibleItemHeight) return;
    const currentVisible = this.state.visible || {};
    const measuredItems = itemRefs.map(([id, refValue]) => {
      const item = this.getMenuItemElement(id, refValue);
      const measuredHeight = item?.offsetHeight || 0;

      if (measuredHeight > 0) {
        item.dataset.sfAdminMenuHeight = String(measuredHeight);

        this._itemHeightCache.set(id, measuredHeight);
      }

      return {
        id,
        itemHeight: measuredHeight || this._itemHeightCache.get(id) || Number(item?.dataset.sfAdminMenuHeight) || visibleItemHeight
      };
    });
    const naturalHeight = measuredItems.reduce((height, item, index) => height + item.itemHeight + (index > 0 ? this.parentGap : 0), 0);
    const fitTolerance = parseFloat(getComputedStyle(menuPanel).getPropertyValue("--sf-px")) || 0;

    if (naturalHeight <= menuPanel.clientHeight + fitTolerance) {
      return {
        items: Object.fromEntries(measuredItems.map(({
          id
        }) => [id, { ...(currentVisible[id] || {}),
          visible: true
        }])),
        hidden: false
      };
    }

    const moreItemReserve = visibleItemHeight + this.parentGap;
    const containerHeight = Math.max(0, menuPanel.clientHeight - moreItemReserve);
    const obj = {};
    let hidden = false;
    let usedHeight = 0;
    measuredItems.forEach(({
      id,
      itemHeight
    }, index) => {
      const nextHeight = usedHeight + itemHeight + (index > 0 ? this.parentGap : 0);
      const itemVisible = nextHeight <= containerHeight;

      if (!itemVisible) {
        hidden = true;
      }

      obj[id] = { ...(currentVisible[id] || {}),
        visible: itemVisible
      };

      if (itemVisible) {
        usedHeight = nextHeight;
      }
    });
    return {
      items: obj,
      hidden
    };
  }

  syncContextTriggers() {
    this.querySelectorAll('[data-admin-menu-settings], button[data-settings]').forEach(button => {
      if (button.closest("sf-admin-menu") !== this) return;
      if (!button.hasAttribute("aria-haspopup")) button.setAttribute("aria-haspopup", "menu");
      if (!button.hasAttribute("aria-expanded")) button.setAttribute("aria-expanded", "false");
    });
  }

  closeContextMenu({
    restoreFocus = true
  } = {}) {
    const menu = this.refs.contextMenu?.value;
    const opener = this._contextReturnFocus;
    const targetId = this.contextTarget?.id;
    const shouldRestore = restoreFocus && menu?.contains(document.activeElement);
    const closeToken = ++this._contextOpenToken;
    if (menu && this._contextReadyHandler) menu.removeEventListener("sf-after-render", this._contextReadyHandler);
    this._contextReadyHandler = null;
    this._contextAnchor = null;
    this.disconnectContextGeometry();

    if (this._contextPortal && contextPortalOwners.get(this._contextPortal) === this) {
      (0,lit__WEBPACK_IMPORTED_MODULE_2__.render)(null, this._contextPortal);
      contextPortalOwners.delete(this._contextPortal);
    }

    this._contextPortal = null;
    this.refs.contextMenu.value = null;
    this.unbindContextEvent();
    this.contextTarget?.classList.remove("active");

    for (const [name, value] of this._contextTriggerAttributes || []) {
      const owned = name === "aria-expanded" ? "true" : "menu";
      if (opener?.getAttribute(name) !== owned) continue;
      if (value === null) opener.removeAttribute(name);else opener.setAttribute(name, value);
    }

    this._contextTriggerAttributes = null;
    this.contextTarget = null;
    this._contextReturnFocus = null;

    if (shouldRestore && opener?.isConnected && !opener.matches(":disabled") && !opener.closest("[hidden], [inert]")) {
      opener.focus({
        preventScroll: true
      });
    }

    if (shouldRestore) {
      requestAnimationFrame(() => requestAnimationFrame(() => {
        // Save/cancel may replace the settings footer immediately after
        // closing. Recover only abandoned focus, never a new user target.
        if (!this.isConnected || closeToken !== this._contextOpenToken || document.activeElement !== document.body) return;
        const replacementHost = targetId ? document.getElementById(targetId) : null;
        const replacement = replacementHost && this.contains(replacementHost) ? replacementHost.matches("button, a[href]") ? replacementHost : replacementHost.querySelector("button, a[href]") : null;
        const candidates = [opener, replacement, this.querySelector('[data-action="settings"]'), ...this.querySelectorAll("button, a[href]")];
        const available = candidates.find(item => item?.isConnected && !item.matches(":disabled") && !item.closest('[hidden], [inert], [aria-disabled="true"]') && item.getClientRects().length && getComputedStyle(item).visibility !== "hidden");
        available?.focus({
          preventScroll: true
        });
      }));
    }
  }

  openContextMenu(event, opts = {}) {
    const target = event.currentTarget instanceof Element ? event.currentTarget : event.target?.closest?.("button, a[href], sf-icon-button") || event.target;
    if (!(target instanceof HTMLElement)) return;
    event.preventDefault();
    event.stopPropagation();

    if (this.contextTarget === target) {
      this.closeContextMenu();
      return;
    }

    this.closeContextMenu({
      restoreFocus: false
    });
    this.contextTarget = target;
    this.contextTarget.classList.add("active");
    this._contextReturnFocus = target.matches("button, a[href]") ? target : target.querySelector("button, a[href]");
    const opener = this._contextReturnFocus;

    if (opener) {
      this._contextTriggerAttributes = new Map(["aria-haspopup", "aria-expanded"].map(name => [name, opener.getAttribute(name)]));
      opener.setAttribute("aria-haspopup", "menu");
      opener.setAttribute("aria-expanded", "true");
    } // Smart hosts may be display:contents; their native control owns the box.


    const anchor = opener || target;
    const pos = anchor.getBoundingClientRect();
    const openTowardInlineStart = pos.right > window.innerWidth / 2;
    this._contextAnchor = {
      element: anchor,
      position: opts.position || null,
      transform: opts.transform
    };
    this.renderContextMenu(Object.assign(opts, {
      id: target,
      x: openTowardInlineStart ? pos.left : pos.right,
      y: pos.y + pos.height / 2,
      position: opts.position || (openTowardInlineStart ? "right" : "left")
    }));
  }

  bindContextEvent() {
    if (this._contextEventBound) {
      return;
    }

    this._contextScrollPositions.clear();

    for (let node = this._contextReturnFocus || this.contextTarget; node instanceof Element; node = node.parentElement) {
      this._contextScrollPositions.set(node, {
        left: node.scrollLeft,
        top: node.scrollTop
      });
    }

    const scrollingElement = document.scrollingElement;

    this._contextScrollPositions.set(document, {
      left: scrollingElement?.scrollLeft,
      top: scrollingElement?.scrollTop
    });

    document.addEventListener("click", this.contextEvent);
    document.addEventListener("keydown", this.contextKeyEvent);
    document.addEventListener("focusin", this.contextFocusEvent);
    document.addEventListener("scroll", this.contextScrollEvent, true);
    window.addEventListener("resize", this.scheduleContextGeometry);
    window.visualViewport?.addEventListener("resize", this.scheduleContextGeometry);
    window.visualViewport?.addEventListener("scroll", this.scheduleContextGeometry);
    document.fonts?.addEventListener("loadingdone", this.scheduleContextGeometry);
    this._contextEventBound = true;
  }

  unbindContextEvent() {
    if (!this._contextEventBound) {
      return;
    }

    document.removeEventListener("click", this.contextEvent);
    document.removeEventListener("keydown", this.contextKeyEvent);
    document.removeEventListener("focusin", this.contextFocusEvent);
    document.removeEventListener("scroll", this.contextScrollEvent, true);
    window.removeEventListener("resize", this.scheduleContextGeometry);
    window.visualViewport?.removeEventListener("resize", this.scheduleContextGeometry);
    window.visualViewport?.removeEventListener("scroll", this.scheduleContextGeometry);
    document.fonts?.removeEventListener("loadingdone", this.scheduleContextGeometry);

    this._contextScrollPositions.clear();

    this._contextEventBound = false;
  }

  contextEvent(event) {
    if (this.isContextMenuEvent(event)) {
      return;
    }

    this.closeContextMenu();
  }

  contextKeyEvent(event) {
    if (event.defaultPrevented || !this.isContextMenuEvent(event)) return;

    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      this.closeContextMenu();
    } else if (event.key === "Tab") {
      // Restore the opener first; native Tab then continues from its position,
      // rather than from the portal appended at the end of the document.
      this.closeContextMenu();
    }
  }

  contextFocusEvent(event) {
    if (!this.isContextMenuEvent(event) && event.target !== this._contextReturnFocus) {
      this.closeContextMenu({
        restoreFocus: false
      });
    }
  }

  contextScrollEvent(event) {
    if (this.isContextMenuEvent(event)) return;
    const node = event.target === document ? document.scrollingElement : event.target;

    const initial = this._contextScrollPositions.get(event.target); // scrollIntoView performed for the opener may deliver its event later.
    // A queued notification of the captured position is not a new scroll.


    if (initial && initial.left === node?.scrollLeft && initial.top === node?.scrollTop) return;
    this.closeContextMenu();
  }

  disconnectContextGeometry() {
    if (this._contextGeometryFrame !== null) cancelAnimationFrame(this._contextGeometryFrame);
    this._contextGeometryFrame = null;
    this._contextSizeObserver?.disconnect();
    this._contextSizeObserver = null;
    this._contextSizeTarget = null;
    this._contextPosition?.controller.stop();
    this._contextPosition = null;
  }

  scheduleContextGeometry() {
    if (!this.refs.contextMenu?.value || this._contextGeometryFrame !== null) return;
    const token = this._contextOpenToken;
    this._contextGeometryFrame = requestAnimationFrame(() => {
      this._contextGeometryFrame = null;
      if (token !== this._contextOpenToken) return;
      this.clampContextMenuToViewport(); // Responsive Admin/control transitions can keep moving the anchor
      // after the resize event. Follow only while those animations run.

      for (let node = this._contextAnchor?.element; node instanceof Element; node = node.parentElement) {
        if (node.getAnimations().some(animation => animation.playState === "running")) {
          this.scheduleContextGeometry();
          break;
        }
      }
    });
  }

  isContextMenuEvent(event) {
    const contextMenu = this.refs?.contextMenu?.value;

    if (!(contextMenu instanceof Node)) {
      return false;
    }

    const target = event?.target;

    if (!(target instanceof Node)) {
      return false;
    }

    if (contextMenu === target || contextMenu.contains(target)) {
      return true;
    }

    return event.composedPath?.().includes(contextMenu) || false;
  }

  renderContextMenu(data) {
    const {
      x,
      y,
      position,
      tempVisible,
      id,
      transform,
      items = [{
        component: "sf-button",
        props: {
          type: "link",
          scheme: "on-surface",
          iconLeft: "save",
          text: this.translate("save"),
          "@click": () => {
            this.saveMenuSettings();
          }
        }
      }, {
        component: "sf-button",
        props: {
          type: "link",
          scheme: "on-surface",
          iconLeft: `visibility${!tempVisible ? "_off" : ""}`,
          text: this.translate(!tempVisible ? "hide" : "show"),
          "@click": () => {
            this.toggleItemVisibility(id, tempVisible);
          }
        }
      }]
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

    const portal = this.getPortalContainer();

    if (this.refs.contextMenu.value && this._contextReadyHandler) {
      this.refs.contextMenu.value.removeEventListener("sf-after-render", this._contextReadyHandler);
    }

    this.disconnectContextGeometry();
    const previousOwner = contextPortalOwners.get(portal);
    if (previousOwner && previousOwner !== this) previousOwner.closeContextMenu({
      restoreFocus: false
    });
    contextPortalOwners.set(portal, this);
    this._contextPortal = portal;
    const token = ++this._contextOpenToken;
    const openingFocus = document.activeElement;
    (0,lit__WEBPACK_IMPORTED_MODULE_2__.render)((0,lit__WEBPACK_IMPORTED_MODULE_2__.html)`
                <sf-context-menu
                        :key=${x + y}
                        style="
            position: fixed;
            inset-inline-start: calc(${x}px + var(--sf-context-menu-tail-corner-offset));
            inset-block-start: ${y}px;
            transform: ${pos};
            z-index: 10000;
          "
                        .items=${items}
                        aria-label=${this._contextReturnFocus?.getAttribute("aria-label") || this.translate("settingsTitle")}
                        position="${position || "left"}"
                >
                </sf-context-menu>
            `, portal);
    this.refs.contextMenu.value = portal.querySelector("sf-context-menu");
    const menu = this.refs.contextMenu.value;
    let focusPending = Boolean(this.contextTarget);

    this._contextReadyHandler = () => {
      if (token !== this._contextOpenToken || this.refs.contextMenu.value !== menu || !menu.isConnected) return;
      this.clampContextMenuToViewport();
      const surface = menu.querySelector(".sf-context-menu");

      if (surface && surface !== this._contextSizeTarget) {
        this._contextSizeObserver?.disconnect();
        this._contextSizeObserver = new ResizeObserver(this.scheduleContextGeometry);

        this._contextSizeObserver.observe(surface);

        this._contextSizeTarget = surface;
      }

      if (!focusPending) return;

      if (document.activeElement !== openingFocus && document.activeElement !== this._contextReturnFocus && !menu.contains(document.activeElement)) {
        focusPending = false;
        return;
      }

      if (!menu.availableMenuItems?.().length) return;
      focusPending = false;
      menu.focus({
        preventScroll: true
      });
    };

    menu.addEventListener("sf-after-render", this._contextReadyHandler);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (token === this._contextOpenToken) this._contextReadyHandler?.();
      });
    });
    this.bindContextEvent();
  }

  clampContextMenuToViewport() {
    const contextMenu = this.refs?.contextMenu?.value;
    if (!(contextMenu instanceof HTMLElement)) return;
    const surface = (contextMenu.shadowRoot || contextMenu).querySelector(".sf-context-menu") || contextMenu; // Let the browser resolve rem/calc/token expressions instead of treating
    // parseFloat('--space') as pixels. The zero-height ruler leaves no layout.

    const ruler = document.createElement("span");
    ruler.setAttribute("aria-hidden", "true");
    ruler.style.cssText = "position:absolute;inset:0 auto auto 0;visibility:hidden;pointer-events:none;inline-size:var(--sf-context-menu-viewport-space, var(--sf-space-1\\/2));block-size:0;padding:0;border:0;";
    surface.append(ruler);
    const resolvedSpace = ruler.getBoundingClientRect().width;
    ruler.style.inlineSize = "var(--sf-context-menu-tail-corner-offset)";
    const anchorGap = ruler.getBoundingClientRect().width;
    ruler.remove();
    const viewport = window.visualViewport;
    const width = viewport?.width || window.innerWidth;
    const height = viewport?.height || window.innerHeight;
    const left = viewport?.offsetLeft || 0;
    const top = viewport?.offsetTop || 0;
    const margin = Math.min(Math.max(0, resolvedSpace), width / 2, height / 2);
    const availableInlineSize = `${Math.max(0, width - margin * 2)}px`;
    const availableBlockSize = `${Math.max(0, height - margin * 2)}px`;
    surface.style.setProperty("--sf-context-menu-available-inline-size", availableInlineSize);
    surface.style.setProperty("--sf-context-menu-available-block-size", availableBlockSize);
    surface.style.maxInlineSize = availableInlineSize;
    surface.style.maxBlockSize = availableBlockSize; // The root must not clip the tail; its content owns long-list scrolling.

    surface.style.overflow = "visible"; // Always measure the uncorrected position. Child renders can call this
    // repeatedly; measuring our previous correction would undo it next time.

    surface.style.translate = "none";
    const anchor = this._contextAnchor; // Preserve unanchored/custom positioning; Admin's native openers use the
    // existing left/right family, whose CSS sides are logical (RTL-aware).

    if (anchor && (!anchor.position || /^(left|right)(-top|-bottom)?$/.test(anchor.position))) {
      if (!anchor.element.isConnected) {
        this.closeContextMenu({
          restoreFocus: false
        });
        return;
      }

      const box = anchor.element.getBoundingClientRect();
      const rtl = getComputedStyle(surface).direction === "rtl";
      const opensRight = anchor.position ? anchor.position.startsWith("left") !== rtl : left + width - margin - box.right >= box.left - left - margin;
      const position = anchor.position || (opensRight !== rtl ? "left" : "right");
      surface.style.insetInlineStart = "auto";
      surface.style.insetInlineEnd = "auto";

      if (anchor.transform === undefined) {
        // Shared Framework geometry (SF.Position): the preferred side
        // flips when it does not fit and the menu shifts inside the
        // viewport; the tail follows the side actually used.
        const suffix = position.replace(/^(left|right)/, "");
        const align = suffix === "-top" ? "start" : suffix === "-bottom" ? "end" : "center";
        surface.style.transform = "none";
        const key = `${position}|${opensRight}`;

        if (this._contextPosition?.element === anchor.element && this._contextPosition.surface === surface && this._contextPosition.key === key) {
          this._contextPosition.controller.update();

          return;
        }

        this._contextPosition?.controller.stop();
        const controller = positioning().anchor(anchor.element, surface, {
          side: opensRight !== rtl ? "inline-end" : "inline-start",
          align,
          offset: anchorGap,
          alignmentOffset: align === "center" ? 0 : Math.max(0, box.height / 2 - anchorGap),
          padding: margin,
          fitHeight: false,
          autoUpdate: false,
          onPosition: ({
            placement
          }) => {
            const next = `${placement.startsWith("right") !== rtl ? "left" : "right"}${suffix}`;
            if (contextMenu.getAttribute("position") !== next) contextMenu.setAttribute("position", next);
          }
        });
        this._contextPosition = {
          controller,
          element: anchor.element,
          surface,
          key
        };
        return;
      } // Custom transforms keep the static geometry; the anchored branch above
      // sets the tail side only from the side actually used, so a flipped
      // menu never toggles its position attribute back and forth.


      if (contextMenu.getAttribute("position") !== position) contextMenu.setAttribute("position", position);
      const size = surface.getBoundingClientRect();
      const alignment = position.endsWith("-bottom") ? -1 : position.endsWith("-top") ? 0 : -0.5;
      const shift = Number(anchor.transform) / 100;
      surface.style.left = `${opensRight ? box.right + anchorGap : box.left - anchorGap - size.width}px`;
      surface.style.top = `${box.top + box.height / 2 + size.height * shift + (alignment === -1 ? anchorGap : alignment === 0 ? -anchorGap : 0)}px`;
      surface.style.transform = "none";
    }

    const rect = surface.getBoundingClientRect();
    const offsetX = rect.left < left + margin ? left + margin - rect.left : rect.right > left + width - margin ? left + width - margin - rect.right : 0;
    const offsetY = rect.top < top + margin ? top + margin - rect.top : rect.bottom > top + height - margin ? top + height - margin - rect.bottom : 0;
    surface.style.translate = `${offsetX}px ${offsetY}px`;
  }

  isSameVisibleState(nextVisible = {}) {
    const currentVisible = this.state?.visible || {};
    const keys = new Set([...Object.keys(currentVisible), ...Object.keys(nextVisible || {})]);

    for (const key of keys) {
      if (currentVisible[key]?.visible !== nextVisible[key]?.visible) {
        return false;
      }
    }

    return true;
  }

  scheduleOverflowUpdate() {
    if (this.resizeFrame || this.state.menuSettings) return;

    if (this.isMeasuring) {
      this.overflowUpdatePending = true;
      return;
    }

    const parentSpace = (0,_helpers_dom__WEBPACK_IMPORTED_MODULE_3__.setParentSpace)(this.refs.items);
    this.parentGap = parentSpace?.gap ?? 0;
    this.resizeFrame = requestAnimationFrame(() => {
      this.resizeFrame = null;
      this.isMeasuring = true;
      const {
        items,
        hidden
      } = this.updateOverflow() || {
        items: {},
        hidden: false
      };

      if (items && (!this.isSameVisibleState(items) || this.state.hasHidden !== hidden)) {
        this.set({
          visible: items,
          hasHidden: hidden
        }, "overflow");
      }

      requestAnimationFrame(() => {
        this.isMeasuring = false;

        if (this.overflowUpdatePending) {
          this.overflowUpdatePending = false;
          this.scheduleOverflowUpdate();
        }
      });
    });
  }

  observeMainResize() {
    const menuPanel = this.getMenuPanelElement();

    if (!menuPanel || typeof ResizeObserver === "undefined" || this.resizeObserver || !this.refs.items.size) {
      return;
    }

    this.resizeObserver = new ResizeObserver(() => {
      this.scheduleOverflowUpdate();
    });
    this.resizeObserver.observe(menuPanel);
  }

  getPanelElement(panelId) {
    if (!panelId) return null;
    return [...this.querySelectorAll("[data-panel]")].find(panel => panel.dataset.panel === String(panelId)) || null;
  }

  getPanelTrigger(panelId) {
    if (!panelId) return null;
    const wrapper = [...this.querySelectorAll("[data-panel-id]")].find(item => item.dataset.panelId === String(panelId));
    return wrapper?.querySelector(":scope > .sf-admin-menu-item") || null;
  } // The back row is the button; the arrow inside it is only an icon, and
  // focusing an icon focuses nothing.


  getPanelBackButton(panelId) {
    return this.getPanelElement(panelId)?.querySelector(".sf-admin-menu-back") || null;
  } // The field, whichever shape it is in: the row builds it from sf-input, and
  // the panel writes the input itself because it carries combobox semantics
  // that sf-input does not pass through.


  getSearchInput() {
    return this.querySelector('input[name="sf_admin_search_input"]');
  }

  isAvailableNavigationTarget(target) {
    return Boolean(target?.isConnected && !target.matches?.(":disabled") && !target.closest?.('[hidden], [inert], [aria-hidden="true"]') && target.getClientRects?.().length && getComputedStyle(target).visibility !== "hidden");
  }

  scheduleNavigationFocus(resolveTarget) {
    const focusToken = ++this._navigationFocusToken;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (!this.isConnected || focusToken !== this._navigationFocusToken) {
        return;
      }

      const target = typeof resolveTarget === "function" ? resolveTarget() : resolveTarget;

      if (this.isAvailableNavigationTarget(target)) {
        target.focus({
          preventScroll: true
        });
      }
    }));
  }

  focusSearchInput() {
    this.scheduleNavigationFocus(() => this.getSearchInput());
  }

  togglePanel(panelId, open = true, opener = null) {
    if (!panelId) return this;

    if (panelId === "search_panel" && !open) {
      this.set({
        openSearch: false
      });
    }

    const compactChanged = this.getProp("compact") !== false;

    if (compactChanged) {
      this.setCompact(false, "panel-open");
    }

    if (open) {
      const returnFocus = opener?.matches?.("button, a[href]") ? opener : this.getPanelTrigger(panelId);

      if (returnFocus) {
        this._panelReturnFocus.set(panelId, returnFocus);
      }
    }

    this.set(state => {
      const panels = state.panels || {};

      if (panels[panelId]?.open === open) {
        return {};
      }

      return {
        panels: { ...panels,
          [panelId]: { ...(panels[panelId] || {}),
            open
          }
        }
      };
    });

    if (open) {
      this.scheduleNavigationFocus(() => this.getPanelBackButton(panelId));
    } else {
      const returnFocus = this._panelReturnFocus.get(panelId);

      this._panelReturnFocus.delete(panelId);

      this.scheduleNavigationFocus(() => {
        if (this.isAvailableNavigationTarget(returnFocus)) {
          return returnFocus;
        }

        return panelId === "search_panel" ? this.getSearchInput() : this.getPanelTrigger(panelId);
      });
    }

    return this;
  }

  buildPanels(items = [], result = {}) {
    items.forEach(item => {
      if (!item.children?.length) return;
      result[item.panelId] = result[item.panelId] || {
        open: false
      };
      this.buildPanels(item.children, result);
    });
    result["search_panel"] = result["search_panel"] || {
      open: false
    };
    return result;
  }

  captureInitialItems() {
    const nodes = Array.from(this.childNodes || []).filter(isAdminMenuItemNode);

    for (const [key, menuItem] of Object.entries(this.menuSettings)) {
      if (menuItem.created) {
        const item = document.createElement("sf-admin-menu-item");
        item.setAttribute("type", menuItem.type);
        item.setAttribute("panelId", key);
        nodes.push(item);
      }
    }

    if (!nodes.length) return false;
    this._itemsData = nodes.map((node, index) => this.itemNodeToData(node, [index]));
    this._itemsData = sortItemsByOrder(this._itemsData);
    this._panels = this.buildPanels(this._itemsData, this._panels);
    nodes.forEach(node => node.remove());
    return true;
  }

  getMainMenuSettings() {
    if (!this.isLocalPersistence()) return {};
    let menuSettings;

    try {
      const storage = window.localStorage;
      const storageKey = this.getMenuSettingsStorageKey();
      menuSettings = storage.getItem(storageKey) || storage.getItem(LEGACY_MENU_SETTINGS_STORAGE_KEY);
      this._settingsStorageError = "";
    } catch (error) {
      this.handleSettingsStorageError(error);
      return {};
    }

    if (!menuSettings) return {};

    try {
      const parsed = JSON.parse(menuSettings);
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch (error) {
      console.warn("SF AdminMenu: failed to parse menu settings", error);
      return {};
    }
  }

  getMenuSettingsStorageKey() {
    const menuId = String(this.id || "default").replace(/[^A-Za-z0-9_.-]/g, "_");
    return "sf-admin-menu:" + menuId + ":settings:v1";
  }

  get items() {
    return this._itemsData.filter(item => item.slot !== "bottom");
  }

  get bottomItems() {
    return this._itemsData.filter(item => item.slot === "bottom");
  }

  templateContext() {
    const props = this.getPropsContext();
    return this.createTemplateContext({ ...props,
      component: this,
      items: this.items,
      bottomItems: this.bottomItems,
      rootClass: this.getRootClass(),
      rootStyle: this.getRootStyle()
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_1__.renderAdminMenuTemplate)(this.templateContext());
  }

  beforeRender() {
    super.beforeRender();
    this.refs.items = new Map();
  }

  makeDraggable(handle, item, container, options = {}) {
    const dragCleanup = (0,_helpers_draggable__WEBPACK_IMPORTED_MODULE_4__.bindSortableDrag)({
      handle,
      item,
      container,
      holdDelay: Number(options.holdDelay) || 0,
      boundAttr: "data-sf-admin-menu-drag-bound",
      placeholderExtraClasses: ["sf-admin-menu-item-cloned"],
      shouldIgnorePointerDown: event => Number(options.holdDelay) > 0 && event.target?.closest?.("[data-move]"),
      getAfterElement: (currentContainer, y, event, itemsLayout) => this.getDragAfterElement(currentContainer, y, itemsLayout),
      onDragStart: () => {
        this.isMeasuring = true;
      },
      onDrop: () => {
        this.syncItemsOrderFromContainer(container);
        this.isMeasuring = false;
        this.requestComponentUpdate("order");
      },
      onCancel: () => {
        this.isMeasuring = false;
      }
    });

    if (dragCleanup || handle?.getAttribute("data-sf-admin-menu-drag-bound") === "1") {
      return dragCleanup;
    }

    if (!handle || !item || !container) return;
    if (handle.dataset.sfAdminMenuDragBound === "1") return;
    handle.dataset.sfAdminMenuDragBound = "1";
    const holdDelay = Number(options.holdDelay) || 0;
    let isDragging = false;
    let holdTimer = null;
    let suppressClick = false;
    let shiftX = 0;
    let shiftY = 0;
    let startRect = null;
    let placeholder = null;

    const clearHoldTimer = () => {
      if (!holdTimer) return;
      clearTimeout(holdTimer);
      holdTimer = null;
    };

    const startDrag = event => {
      if (isDragging) return;
      this.isMeasuring = true;
      event.preventDefault?.();
      isDragging = true;
      suppressClick = true;
      startRect = item.getBoundingClientRect(); // расстояние от курсора до левого верхнего угла элемента

      shiftX = event.clientX - startRect.left;
      shiftY = event.clientY - startRect.top; // placeholder оставляет место в списке

      const name = item.nodeName.toLowerCase();
      placeholder = document.createElement(name);
      placeholder.className = "drag-placeholder";
      placeholder.style.width = `${startRect.width}px`;
      placeholder.style.height = `${startRect.height}px`;
      placeholder.classList.add("sf-admin-menu-item-cloned", ...item.classList);
      item.before(placeholder); // сам элемент вынимаем из потока и двигаем поверх всего

      item.classList.add("is-dragging");
      Object.assign(item.style, {
        position: "fixed",
        left: `${startRect.left}px`,
        top: `${startRect.top}px`,
        width: `${startRect.width}px`,
        zIndex: "9999",
        pointerEvents: "none"
      });
      handle.setPointerCapture?.(event.pointerId);
      document.addEventListener("pointermove", onPointerMove);
    };

    handle.addEventListener("pointerdown", event => {
      if (event.button !== 0) return;
      if (holdDelay > 0 && event.target?.closest?.("[data-move]")) return;
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
    });
    handle.addEventListener("click", event => {
      if (!suppressClick) return;
      suppressClick = false;
      event.preventDefault();
      event.stopImmediatePropagation();
    }, true);

    function onPointerMove(event) {
      if (!isDragging) {
        return;
      }

      const containerRect = container.getBoundingClientRect();
      let left = event.clientX - shiftX;
      let top = event.clientY - shiftY; // ограничиваем движение внутри родителя

      left = Math.max(containerRect.left, left);
      top = Math.max(containerRect.top, top);
      left = Math.min(containerRect.right - startRect.width, left);
      top = Math.min(containerRect.bottom - startRect.height, top);
      item.style.left = `${left}px`;
      item.style.top = `${top}px`;
      movePlaceholder(event.clientX, event.clientY);
    }

    const movePlaceholder = (x, y) => {
      const afterElement = this.getDragAfterElement(container, y);

      if (!afterElement) {
        container.appendChild(placeholder);
      } else {
        container.insertBefore(placeholder, afterElement);
      }
    };

    const onPointerUp = event => {
      clearHoldTimer();
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointercancel", onPointerCancel);

      if (!isDragging) {
        return;
      }

      isDragging = false;
      handle.releasePointerCapture?.(event.pointerId); // вставляем реальный элемент на место placeholder

      if (placeholder?.parentNode) {
        placeholder.replaceWith(item);
      }

      item.classList.remove("is-dragging");
      Object.assign(item.style, {
        position: "",
        left: "",
        top: "",
        width: "",
        zIndex: "",
        pointerEvents: ""
      });
      placeholder = null;
      startRect = null;
      this.syncItemsOrderFromContainer(container);
      this.isMeasuring = false;
      this.requestComponentUpdate("order");
    };

    const onPointerCancel = () => {
      clearHoldTimer();
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerup", onPointerUp);

      if (!isDragging) {
        return;
      }

      isDragging = false;
      placeholder?.remove();
      item.classList.remove("is-dragging");
      Object.assign(item.style, {
        position: "",
        left: "",
        top: "",
        width: "",
        zIndex: "",
        pointerEvents: ""
      });
      placeholder = null;
      startRect = null;
      this.isMeasuring = false;
    };
  }

  getDragAfterElement(container, y, itemsLayout = null) {
    const items = Array.isArray(itemsLayout) ? itemsLayout.filter(layout => layout.item?.dataset?.panelId && !layout.item.classList.contains("hidden") && !layout.item.classList.contains("more")) : Array.from(container?.children || []).filter(item => item instanceof HTMLElement && item.dataset.panelId && !item.classList.contains("is-dragging") && !item.classList.contains("drag-placeholder") && !item.classList.contains("hidden") && !item.classList.contains("more")).map(item => {
      const box = item.getBoundingClientRect();
      return {
        item,
        middle: box.top + box.height / 2
      };
    });
    let closest = {
      offset: Number.NEGATIVE_INFINITY,
      element: null
    };

    for (const layout of items) {
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

  syncItemsOrderFromContainer(container) {
    const orderedPanelIds = Array.from(container?.children || []).filter(item => item instanceof HTMLElement && item.dataset.panelId && !item.classList.contains("more") && !item.classList.contains("drag-placeholder")).map(item => item.dataset.panelId);
    if (!orderedPanelIds.length) return;
    const orderIndex = new Map(orderedPanelIds.map((panelId, index) => [panelId, index]));

    if (this.state.menuSettings) {
      orderedPanelIds.forEach((panelId, index) => {
        this.patchMenuItemSettings(panelId, {
          order: index
        });
      });
    }

    const bottomItems = this._itemsData.filter(item => item.slot === "bottom");

    let test = {};

    const mainItems = this._itemsData.filter(item => item.slot !== "bottom").map(item => {
      if (!orderIndex.has(item.panelId)) return item;
      const order = orderIndex.get(item.panelId);
      test[item.panelId] = order;
      return { ...item,
        order,
        sourceIndex: order
      };
    }).sort((left, right) => {
      const leftOrder = orderIndex.has(left.panelId) ? orderIndex.get(left.panelId) : Number.MAX_SAFE_INTEGER;
      const rightOrder = orderIndex.has(right.panelId) ? orderIndex.get(right.panelId) : Number.MAX_SAFE_INTEGER;
      if (leftOrder !== rightOrder) return leftOrder - rightOrder;
      return left.sourceIndex - right.sourceIndex;
    });

    this._itemsData = [...mainItems, ...bottomItems];
  }

  pruneItemRefs() {
    const ids = new Set();

    const collect = (items = []) => {
      items.forEach(item => {
        ids.add(item.panelId);
        collect(item.children);
      });
    };

    collect(this._itemsData);

    for (const id of this.refs.items.keys()) {
      if (!ids.has(id)) {
        this.refs.items.delete(id);
      }
    }
  }

  getPortalContainer() {
    let portal = document.getElementById("sf-admin-menu-portal");

    if (!portal) {
      portal = document.createElement("div");
      portal.id = "sf-admin-menu-portal";
      document.body.append(portal);
    }

    return portal;
  } // The header of a submenu stands where the header with the logo stands, and
  // the logo is the host's: its height is whatever the host's image is. So the
  // height is measured rather than guessed, and published for the styles to
  // use — the same way the table measures its pinned columns.


  measureHeadHeight() {
    const panel = this.querySelector(".sf-admin-menu-panel:not(.sf-admin-menu-panel-sub):not(.sf-admin-menu-panel-search)");
    const head = panel?.querySelector(":scope > .sf-admin-menu-head");
    const root = this.refs.mainPanel?.value ?? this.querySelector(".sf-admin-menu");
    if (!head || !root) return this;
    const height = Math.round(head.getBoundingClientRect().height);

    if (height > 0) {
      root.style.setProperty("--sf-admin-menu-head--measured-height", `${height}px`);
    }

    return this;
  }

  async afterRender() {
    const initToken = ++this._adminMenuInitToken;
    this.measureHeadHeight();
    this.syncContextTriggers();
    this.scheduleOverflowUpdate();
    await this.whenChildrenDefined();
    await new Promise(resolve => requestAnimationFrame(resolve));
    requestAnimationFrame(() => {
      if (!this.isConnected || initToken !== this._adminMenuInitToken) {
        return;
      }

      this.observeMainResize();
      this.scheduleOverflowUpdate();
      [...this.refs.items.entries()].forEach(([panelId, refValue]) => {
        const value = this.getMenuItemElement(panelId, refValue);

        if (!value) {
          return false;
        }

        const container = this.getMenuPanelElement()?.children[0];
        if (!container) return false;

        if (this.state.menuSettings) {
          const button = value.querySelector("[data-move]");
          this.makeDraggable(button, value, container);
        }

        this.makeDraggable(value, value, container, {
          holdDelay: 200
        });
      });
    });
  }

}

SfAdminMenu.define("sf-admin-menu");
})();

/******/ })()
;