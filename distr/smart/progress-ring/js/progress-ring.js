/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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

/***/ "53e2b85553b5"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   drawnStatus: () => (/* binding */ drawnStatus),
/* harmony export */   showChunk: () => (/* binding */ showChunk)
/* harmony export */ });
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _core_js_deprecations__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("d3818183b14c");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("bba1a166d803");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("084d7e69277d");
/* harmony import */ var _lang_index_mjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("15b6f80ad2ae");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_deprecations__WEBPACK_IMPORTED_MODULE_2__, _js_templates_default__WEBPACK_IMPORTED_MODULE_3__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_deprecations__WEBPACK_IMPORTED_MODULE_2__, _js_templates_default__WEBPACK_IMPORTED_MODULE_3__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_deprecations__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_core_js_deprecations__WEBPACK_IMPORTED_MODULE_2__);





 // Only the words on screen ship in the bundle, English only (owner decision
// C282): Russian and every other language come from a language file. The
// title, settings and events stay in the language files for the Studio and the
// docs (localization study LC-2).
// sf-progress-ring from its component.json (standard simai.smart-component
// 1.3.11 §3, §4; the 1.4 folder of five authored files): its settings are
// attributes and properties made by core/js/element-manifest.js, and a job's
// part arrives as the stream fact chunk {done, total} (vocabulary 1.1.5 §5.2),
// which a rule hands to the action chunk, as on sf-progress-bar. The drawing
// is the class component progress-ring's: the value is a custom property on
// the root, the ring carries the role, the slot content stands beside it.

const ProgressRingElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_4__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: _lang_index_mjs__WEBPACK_IMPORTED_MODULE_5__.files,
  source: 'ru',
  actions: {
    chunk({
      done,
      total
    } = {}) {
      return showChunk(this, done, total);
    }

  }
}); // A part of a job as a percentage of the ring: done of total (100 when the
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
} // The status drawn (owner decision C131 (7), as sf-progress-bar 1.2.0): the
// more serious of the page's status and the threshold the value reached. The
// thresholds are the page's, in per cent like the value; unset is none.

const RANK = {
  warning: 1,
  error: 2
};
function drawnStatus(status, value, warningAt, errorAt) {
  const number = Number(value);
  let reached = '';

  if (Number.isFinite(number)) {
    if (Number.isFinite(errorAt) && number >= errorAt) reached = 'error';else if (Number.isFinite(warningAt) && number >= warningAt) reached = 'warning';
  }

  return (RANK[reached] ?? 0) > (RANK[status] ?? 0) ? reached : status;
}

class SfProgressRing extends ProgressRingElement {
  static get props() {
    return { ...super.props,
      // No status (empty) is the theme's primary; neutral is grey (C131 (1)).
      status: {
        default: '',
        values: ['', 'neutral', 'info', 'success', 'warning', 'error'],
        valueAliases: {
          '': ['primary']
        }
      }
    };
  }

  get status() {
    return this.getProp('status');
  } // A threshold holds only where the page set it.


  threshold(attribute) {
    if (!this.hasAttribute(attribute)) return null;
    const number = Number(this.getAttribute(attribute));
    return Number.isFinite(number) ? number : null;
  }

  get drawnStatus() {
    return drawnStatus(this.status, this.value, this.threshold('warning-at'), this.threshold('error-at'));
  } // The accessible name: label, else the host's aria-label (§3.1, §4.8).


  get accessibleLabel() {
    return this.label || this.getAttribute('aria-label') || '';
  }

  static get observedAttributes() {
    return [...new Set([...super.observedAttributes, 'aria-label'])];
  } // A lone avatar child is the ring's content (owner decision C152 (8), DEV
  // AR-4, fix/avatar-ring-ar1 2026-11-16): the recipe is a ring holding an
  // avatar, and a page that left out slot="content" got the avatar beside
  // the ring, 60 px off its middle. The ring names the slot for it when the
  // avatar (sf-avatar or a class .sf-avatar) is its only element child and
  // no child names the content slot; a printed first paint (data-sf-static)
  // is a picture of the ring, not a child.


  captureSlotTemplates() {
    if (!this._slotTemplatesCaptured && !this.querySelector(':scope > [slot="content"]')) {
      const children = [...this.children].filter(child => !child.hasAttribute('data-sf-static'));
      const [only] = children;

      if (children.length === 1 && !only.hasAttribute('slot') && (only.localName === 'sf-avatar' || only.classList?.contains('sf-avatar'))) {
        only.setAttribute('slot', 'content');
      }
    }

    super.captureSlotTemplates();
  } // An avatar the ring cannot take as its content -- beside other children,
  // or under a content slot already named -- stands beside the ring (AR-4,
  // recipe C152 (8)). It is said once a page -- one console warning,
  // wherever the ring is -- and each ring is listed in SF.deprecations, so a
  // person or a probe finds it.


  noteUnslottedAvatar() {
    if (this._unslottedNoted) return;
    const stray = [...this.children].find(child => (child.localName === 'sf-avatar' || child.classList?.contains('sf-avatar')) && !child.hasAttribute('slot') && !child.hasAttribute('data-sf-held'));
    if (!stray) return;
    this._unslottedNoted = true;
    (0,_core_js_deprecations__WEBPACK_IMPORTED_MODULE_2__.noteDeprecated)({
      component: 'sf-progress-ring',
      tag: 'sf-progress-ring',
      kind: 'markup',
      attribute: 'slot',
      from: 'sf-avatar without slot',
      to: 'slot="content"'
    });
    const root = globalThis.SF = globalThis.SF || {};
    if (root.__progressRingAvatarWarned) return;
    Object.defineProperty(root, '__progressRingAvatarWarned', {
      value: true,
      configurable: true
    });
    globalThis.console?.warn?.(`[SIMAI Framework] sf-progress-ring${this.id ? ` #${this.id}` : ''}: an sf-avatar inside the ring beside other content is drawn beside the ring, not in it. Give the sf-avatar slot="content" (decision C152 (8)).`);
  }

  templateContext() {
    this.noteUnslottedAvatar();
    const status = this.drawnStatus;
    this.sfHostState('data-status', status);
    return this.createTemplateContext({ ...this.getPropsContext(),
      drawnStatus: status,
      label: this.accessibleLabel,
      content: this.hasSlotContent?.('content') ? this.getSlotContent('content') : null,
      rootClass: this.getRootClass(),
      component: this
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_3__.renderProgressRingTemplate)(this.templateContext());
  }

}

SfProgressRing.define('sf-progress-ring');
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "bba1a166d803"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   normalizeValue: () => (/* binding */ normalizeValue),
/* harmony export */   renderProgressRingTemplate: () => (/* binding */ renderProgressRingTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var _core_js_format_number_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("c9ce0852ac73");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, _core_js_format_number_js__WEBPACK_IMPORTED_MODULE_1__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, _core_js_format_number_js__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);

 // The avatar's ladder (owner decision C131 (5)).

const SIZES = ['1/4', '1/3', '1/2', '1', '2', '3']; // No status (empty) is the theme's primary and carries no class; neutral is
// grey (C131 (1)).

const STATUSES = ['neutral', 'info', 'success', 'warning', 'error']; // Below size 1 the box leaves no room for a percentage on the text ladder.

const TEXTLESS = new Set(['1/4', '1/3', '1/2']); // A number from 0 to 100; anything else reads 0.

function normalizeValue(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 0;
  return Math.max(0, Math.min(100, parsed));
}

const on = value => value === true || value === '' || value === 'true'; // The class markup of the ring (src/component/progress-ring): the root holds
// the value as --sf-progress-ring--value, the ring (.sf-progress-ring-indicator)
// carries the role and the value, and the middle holds the slot content or the
// percentage, which is aria-hidden: the ring says the value once.


function renderProgressRingTemplate(context) {
  const size = SIZES.includes(String(context.size)) ? String(context.size) : '1';
  const given = String(context.drawnStatus ?? context.status ?? '');
  const status = STATUSES.includes(given) ? given : '';
  const indeterminate = on(context.indeterminate);
  const meter = on(context.meter);
  const value = normalizeValue(context.value);
  const role = meter ? 'meter' : 'progressbar'; // A meter always has a value; only a progressbar can be indeterminate.

  const unknown = indeterminate && !meter; // Below size 1 no percentage is shown (PG-10, C131 (5)): the box leaves
  // 8 px letters, below the text ladder. The value stays the ring's
  // (aria-valuenow), so a screen reader still says it; the eye reads the arc.

  const text = on(context.showText) && !unknown && !TEXTLESS.has(size) ? (0,_core_js_format_number_js__WEBPACK_IMPORTED_MODULE_1__.percentText)(value, context.component ?? null) : '';
  const content = context.content && context.content !== lit__WEBPACK_IMPORTED_MODULE_0__.nothing ? context.content : null; // A ring around a picture is about something of the person's own -- a
  // profile filled in, a photo being sent (owner decision C191 (4)). At 100 %
  // nothing is left to do, so the ring goes away (C191 (7) #q-ar-done): no
  // line and no value to say, the picture alone, in the same box so nothing
  // around it moves. A meter (an amount used) and an unknown value keep the
  // ring: a quota at 100 % is the news, not the end of it.

  const done = Boolean(content) && !meter && !unknown && value >= 100;
  const rootClasses = ['sf-progress-ring', `sf-progress-ring--size-${size}`, status ? `sf-progress-ring--${status}` : '', unknown ? 'sf-progress-ring--indeterminate' : '', context.rootClass].filter(Boolean).join(' ');
  const style = [`--sf-progress-ring--value: ${unknown ? 0 : value}`, context.rootStyle].filter(Boolean).join('; ');
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div class=${rootClasses} style=${style} data-value=${String(value)} data-status=${status}>
      ${done ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span
        class="sf-progress-ring-indicator"
        role=${role}
        aria-label=${context.label || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow=${unknown ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : String(value)}
        aria-valuetext=${unknown ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : context.valueText || (0,_core_js_format_number_js__WEBPACK_IMPORTED_MODULE_1__.percentText)(value, context.component ?? null)}
      ></span>`}
      ${content ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-progress-ring-content">${content}</span>` : text ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-progress-ring-content" aria-hidden="true">${text}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
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

/***/ "15b6f80ad2ae"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   files: () => (/* binding */ files)
/* harmony export */ });
/* harmony import */ var _en_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("4c5d825d13eb");
// Written by scripts/build-language-packs.mjs from src/core/lang/built-in.json
// (owner decision C282); do not edit. The words this bundle carries: the
// built-in languages' (en); every other language comes from
// a language file (core/lang/<code>.js or its parts).


const files = { en: { runtime: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime } };

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ en: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime });


/***/ },

/***/ "084d7e69277d"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.progress-ring","tag":"sf-progress-ring","version":"1.6.3","kind":"leaf","settings":{"size":{"type":"enum","values":["1/4","1/3","1/2","1","2","3"],"default":"1"},"value":{"type":"number","default":0,"min":0,"max":100},"status":{"type":"enum","values":["","neutral","info","success","warning","error"],"default":""},"warning-at":{"type":"number","optional":true,"min":0,"max":100},"error-at":{"type":"number","optional":true,"min":0,"max":100},"indeterminate":{"type":"boolean","default":false},"meter":{"type":"boolean","default":false},"show-text":{"type":"boolean","default":false},"label":{"type":"string","default":""},"value-text":{"type":"string","default":""}},"values":{},"events":{},"actions":{"chunk":{"with":{"done":"number","total":"number"}}},"css-variables":{"--sf-progress-ring-size":{"type":"length","state":"default"},"--sf-progress-ring-line-width":{"type":"length","state":"default"},"--sf-progress-ring-gap":{"type":"length","state":"default"},"--sf-progress-ring-fill-color":{"type":"color","state":"default"},"--sf-progress-ring-track-color":{"type":"color","state":"default"},"--sf-progress-ring-color":{"type":"color","state":"default"}},"host-states":{"data-status":"string"}}');

/***/ },

/***/ "4c5d825d13eb"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Progress Ring"}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("53e2b85553b5");
/******/
/******/ })()
;