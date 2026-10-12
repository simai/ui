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
  // The language without its region, whichever way it was set: a page that
  // chose 'pt-BR' is a Portuguese page, as a page whose markup says
  // lang="pt-BR" is. The chosen value kept its region and answered 'pt-br',
  // which matched no dictionary keyed by language and made isRussianPage false
  // on a page that chose 'ru-RU'. The region stays in pageLocale.
  if (STORE.chosen) return STORE.chosen.split('-')[0];
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

/***/ "b30ec5bc0edb"
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
// The data view port names the badge look `scheme` on a column's options; a
// filter option has always said `color`. Both are read: reading only `color`
// left every port column's scheme unread and its badges neutral.

function optionBadgeProps(option = {}) {
  const raw = option?.scheme ?? option?.color;
  const color = typeof raw === "string" ? raw.trim() : "";
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
/* harmony export */   FILTER_RENDERERS: () => (/* binding */ FILTER_RENDERERS),
/* harmony export */   renderCellField: () => (/* binding */ renderCellField),
/* harmony export */   renderEditField: () => (/* binding */ renderEditField),
/* harmony export */   renderFilterField: () => (/* binding */ renderFilterField),
/* harmony export */   renderViewField: () => (/* binding */ renderViewField)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("fef8077ac919");
/* harmony import */ var _helpers_option_badge_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("b30ec5bc0edb");
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
  if (!value || typeof value !== 'object' || !value.label) return null; // A column the host says holds images shows each as a thumbnail; any other
  // file as a tile with its extension. Which files are images is the host's
  // to say through the variant, never guessed from a name.

  if (isImageField(field)) return renderFilePreviewCell(value);
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
} // A file as a thumbnail on the row's line: the image when the host gave its
// address and its type is an image, the extension in a tile otherwise. It is
// sf-file-preview told to show nothing but its leading visual, so a file looks
// the same in a row as in the record that holds it.


function renderFilePreviewCell(value) {
  const mime = String(value.mime ?? value.mimeType ?? '');
  const image = Boolean(value.href) && /^image\//u.test(mime);
  return {
    component: {
      type: 'file-preview',
      props: {
        compact: true,
        fileName: String(value.label),
        mimeType: mime,
        icon: fileIcon(mime),
        ...(value.href ? {
          href: String(value.href)
        } : {}),
        ...(image ? {
          imageUrl: String(value.href),
          kind: 'image'
        } : {
          kind: 'icon'
        }),
        actions: false,
        downloadAction: false,
        removeAction: false
      }
    }
  };
} // Several values in one cell: one tag per value, each on the row's text line.
// The tag's `line` resolves its own size and inline mode, so neither is passed
// -- the session that owns it fixed the template to read the resolved values
// rather than the attributes, which is what makes that true.


function renderChoicesCell(field, value) {
  if (!Array.isArray(value) || !value.length) return null;
  if (String(field.variant ?? '') === 'badges') return renderChoicesBadgesCell(field, value);
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
} // Several values as tonal badges, each coloured by its option's scheme -- a
// page's publication in each language. A value may be {value, text}: the host
// says more in that one cell than the option's label («ru · 14.10 09:00»), which
// is the host's to format, so the set does not.


function renderChoicesBadgesCell(field, value) {
  const options = field.options || field.filter?.options || field.constraints?.options;
  return value.map(item => {
    const key = item && typeof item === 'object' ? item.value : item;
    const option = Array.isArray(options) ? options.find(candidate => String(candidate?.value) === String(key)) : null;
    const badge = option ? (0,_helpers_option_badge_js__WEBPACK_IMPORTED_MODULE_1__.optionBadgeProps)(option) : null;
    const text = item && typeof item === 'object' && item.text !== undefined ? String(item.text) : String(option?.label ?? option?.text ?? key);
    return {
      component: {
        type: 'badge',
        props: {
          line: CELL_LINE,
          text,
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
  });
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
  const badge = (0,_helpers_option_badge_js__WEBPACK_IMPORTED_MODULE_1__.optionBadgeProps)(option);
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
  const badge = (0,_helpers_option_badge_js__WEBPACK_IMPORTED_MODULE_1__.optionBadgeProps)(option);
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
})();

/******/ })()
;