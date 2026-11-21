/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "15b4e93ff6ed"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   formatDateText: () => (/* binding */ formatDateText),
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
} // A date's year keeps the abbreviation that follows it (A4, group build 15):
// Russian, Ukrainian, Bulgarian, Belarusian, Kazakh, Lithuanian, Macedonian
// and Armenian write one after the year -- «19 нояб. 2026 г.», «2026 р.»,
// «2026 m.», «2026 թ.» -- and the platform joins it with an ordinary space, so
// a narrow cell or a wrapped line printed «2026» at the end of one line and
// «г.» alone at the start of the next. Only the space before an abbreviation
// (letters closed by a full stop: г., гг., m.) becomes a no-break space; a word
// such as English «at» or German «um», a comma, a slash or a time after the
// year is left as the platform writes it (DEV answer msg-e6758728).

/** A DateTimeFormat's text of a moment with the year's marker held to the year. */

function formatDateText(formatter, moment) {
  if (typeof formatter?.formatToParts !== 'function') return formatter.format(moment); // A module-level regular expression is a statement a bundler keeps (core-format test): made here.

  const gap = /^[\s\u00a0\u202f]+(?=\p{L}+\.)/u;
  let text = '';
  let afterYear = false;

  for (const part of formatter.formatToParts(moment)) {
    text += afterYear && part.type === 'literal' ? part.value.replace(gap, '\u00a0') : part.value;
    afterYear = part.type === 'year';
  }

  return text;
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

/***/ "af9b960bb93d"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ICONS: () => (/* binding */ ICONS),
/* harmony export */   STATUSES: () => (/* binding */ STATUSES),
/* harmony export */   SfTileMetric: () => (/* binding */ SfTileMetric),
/* harmony export */   changeOf: () => (/* binding */ changeOf),
/* harmony export */   drawnStatus: () => (/* binding */ drawnStatus),
/* harmony export */   thresholdStatus: () => (/* binding */ thresholdStatus),
/* harmony export */   tileFormat: () => (/* binding */ tileFormat)
/* harmony export */ });
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _core_js_format_number_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("c9ce0852ac73");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("8433b29b08eb");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("1d705aa58430");
/* harmony import */ var _lang_index_mjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("156278cb72e1");
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("6778b5230e7b");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_format_number_js__WEBPACK_IMPORTED_MODULE_2__, _js_templates_default__WEBPACK_IMPORTED_MODULE_3__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_format_number_js__WEBPACK_IMPORTED_MODULE_2__, _js_templates_default__WEBPACK_IMPORTED_MODULE_3__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
// sf-tile-metric: one number that matters on an admin or dashboard screen,
// with its change, its limit and its status -- server load, storage used of a
// quota, visitors against last week, queue depth, licence seats:
//
//   <sf-tile-metric label="Подкачка" value="83" max="100" format="unit-percent"
//     warning-at="80" error-at="95" hint="серверу не хватает памяти"></sf-tile-metric>
//
// The tile formats the value in the page language (core's formatNumber), works
// out the change from the previous value when the page gives no delta, and
// draws the limit as a meter with sf-progress-bar. Whether a rise is good
// (better), the thresholds (warning-at, error-at) and the status are the
// page's; the tile only compares. href makes the whole tile one link, openable
// one button that sends open; a chart comes from the page in slot="chart".
//
// From its component.json (standard simai.smart-component 1.3.14 §3, §4, §8):
// the settings are made by core/js/element-manifest.js, the words are the
// language files'.





 // Only the words on screen ship in the bundle, English only (owner decision
// C282): Russian and every other language come from a language file. The
// title, settings and events stay in the language files for the Studio and the
// docs (localization study LC-2).

 // The label's id, one per tile on the page (the same on every render, so a
// first-paint snapshot is stable).

let sequence = 0;
const RANK = {
  warning: 1,
  error: 2
};
const STATUSES = ['neutral', 'success', 'warning', 'error', 'info']; // sf-alert's status icons, by the shared status words.

const ICONS = {
  success: 'check_circle',
  info: 'info',
  warning: 'warning',
  error: 'error',
  neutral: 'info'
}; // The change's tone as an sf-badge status: better is success, worse is error.

const BADGE = {
  positive: 'success',
  negative: 'error',
  neutral: ''
};
const ARROWS = {
  up: 'arrow_upward',
  down: 'arrow_downward',
  flat: 'remove'
};
/**
 * The format word the tile writes with (owner C168 (2), 2026-11-14): money on
 * a tile is whole by default -- «currency-RUB» is «1 111 111 ₽» -- and keeps
 * its kopecks only when the page asks with a precision word
 * («currency-RUB decimal-2»); «currency-RUB compact» writes «1,1 млн ₽» for a
 * narrow 1/2 tile. Every other word is core's as given.
 */

function tileFormat(format = 'number') {
  const words = String(format || 'number').trim().split(/\s+/u).filter(Boolean);
  const money = words.some(one => /^currency-[A-Z]{3}$/u.test(one));
  const precise = words.some(one => /^(?:integer|compact|decimal-\d{1,2})$/u.test(one));
  return money && !precise ? [...words, 'integer'].join(' ') : words.join(' ') || 'number';
}
/** The threshold a share of the limit reached, in per cent: '', warning or error. */

function thresholdStatus(percent, warningAt, errorAt) {
  if (!Number.isFinite(percent)) return '';
  if (Number.isFinite(errorAt) && percent >= errorAt) return 'error';
  if (Number.isFinite(warningAt) && percent >= warningAt) return 'warning';
  return '';
}
/** The more serious of the page's status and the threshold reached. */

function drawnStatus(status, reached) {
  const given = STATUSES.includes(status) ? status : 'neutral';
  return (RANK[reached] ?? 0) > (RANK[given] ?? 0) ? reached : given;
}
/**
 * The change against the previous period: delta, else value − previous.
 * direction up|down|flat, tone positive|negative|neutral by `better`, and
 * the change's share of the previous value (null without one).
 */

function changeOf({
  value = null,
  previous = null,
  delta = null,
  better = 'up'
} = {}) {
  let change = delta;
  if (change === null && previous !== null && value !== null) change = value - previous;
  if (change === null || !Number.isFinite(change)) return null;
  const base = previous ?? (value !== null ? value - change : null);
  const share = base ? change / Math.abs(base) : null;
  const direction = change > 0 ? 'up' : change < 0 ? 'down' : 'flat';
  const tone = direction === 'flat' || better === 'none' ? 'neutral' : direction === better ? 'positive' : 'negative';
  return {
    change,
    share,
    direction,
    tone
  };
}
const TileMetricElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_4__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: _lang_index_mjs__WEBPACK_IMPORTED_MODULE_5__.files,
  source: 'ru'
});

class SfTileMetric extends TileMetricElement {
  constructor() {
    super();
    this._uid = `sf-tile-metric-${++sequence}`;
  }

  words(key, vars) {
    return this.sfWord(key, vars ? {
      vars
    } : {});
  } // A number setting holds only where the page set it: an unset number reads 0.


  given(attribute) {
    if (!this.hasAttribute(attribute)) return null;
    const number = Number(this.getAttribute(attribute));
    return this.getAttribute(attribute).trim() !== '' && Number.isFinite(number) ? number : null;
  }

  say(value) {
    return (0,_core_js_format_number_js__WEBPACK_IMPORTED_MODULE_2__.formatNumber)(value, tileFormat(this.format), {
      node: this,
      gap: this.words('no-value')
    });
  }

  change(value) {
    const found = changeOf({
      value,
      previous: this.given('previous'),
      delta: this.given('delta'),
      better: this.better
    });
    if (!found) return null;
    const sign = found.change > 0 ? '+' : found.change < 0 ? '−' : '';
    const absolute = `${sign}${this.say(Math.abs(found.change))}`;
    const percent = found.share === null ? '' : `${sign}${(0,_core_js_format_number_js__WEBPACK_IMPORTED_MODULE_2__.formatNumber)(Math.abs(found.share), 'percent', {
      node: this
    })}`;
    const text = this.deltaFormat === 'absolute' || !percent ? absolute : this.deltaFormat === 'both' ? `${percent} (${absolute})` : percent;
    return { ...found,
      text,
      badge: BADGE[found.tone],
      arrow: ARROWS[found.direction],
      word: this.words(`change-${found.direction}`)
    };
  } // The limit as a meter: «45 ГБ из 100 ГБ», 45 %, and the threshold it reached.


  meter(value) {
    const max = this.given('max');
    if (max === null || max <= 0 || value === null) return null;
    const percent = Math.max(0, Math.min(100, value / max * 100));
    const text = this.limitText || this.words('limit', {
      value: this.say(value),
      max: this.say(max)
    });
    return {
      max,
      value: Math.max(0, Math.min(max, value)),
      percent: Math.round(percent * 100) / 100,
      reached: thresholdStatus(percent, this.given('warning-at'), this.given('error-at')),
      warningAt: this.given('warning-at'),
      errorAt: this.given('error-at'),
      text,
      name: this.words('limit-name', {
        label: this.label || this.words('untitled')
      })
    };
  }

  open() {
    this.sfEmit('open', {
      id: this.id || ''
    });
  } // The lines a loading tile keeps (owner decision C130 (2): a skeleton takes
  // exactly the data's place; tile study TM-1): those its settings promise.
  // The change line when the page gave what it is worked out from (previous,
  // delta) or what it is against (period-text), or when the tile has no limit
  // -- a plain number comes with its change; a limit tile with max set
  // shows its meter and the meter's words instead. The status line when the
  // page states one (status, hint). The words are fillers of the right
  // length: the bars stand for them.


  skeleton(status) {
    const max = this.given('max');
    const promised = this.given('previous') !== null || this.given('delta') !== null || Boolean(this.periodText);
    const limited = max !== null && max > 0;
    const statusWord = status === 'neutral' ? '' : this.words(`status-${status}`);
    return {
      value: this.valueText || '000 000',
      change: promised || !limited ? '+00,0\u00a0%' : '',
      limit: limited ? this.limitText || this.words('limit', {
        value: '00',
        max: this.say(max)
      }) : '',
      status: this.hint || statusWord
    };
  }

  templateContext() {
    const loading = Boolean(this.loading);
    const value = loading ? null : this.given('value');
    const meter = loading ? null : this.meter(value);
    const status = drawnStatus(this.status, meter?.reached ?? '');
    const target = this.href ? 'link' : this.openable ? 'button' : '';
    const hasChart = this.hasSlotContent?.('chart') ?? false;
    this.sfHostState('data-status', status);
    this.sfHostState('data-loading', loading);
    let valueText = this.words('no-value');
    if (value !== null) valueText = this.valueText || this.say(value);else if (this.valueText && !loading) valueText = this.valueText;
    return this.createTemplateContext({ ...this.getPropsContext(),
      component: this,
      uid: this._uid,
      size: ['1/2', '1', '2'].includes(this.size) ? this.size : '1',
      loading,
      target,
      href: this.href,
      labelShown: this.label || this.words('untitled'),
      valueShown: valueText,
      unit: this.unit,
      change: value === null ? null : this.change(value),
      periodText: this.periodText,
      meter,
      status,
      statusIcon: ICONS[status],
      statusWord: status === 'neutral' ? '' : this.words(`status-${status}`),
      hint: this.hint,
      hasChart,
      chart: hasChart ? this.getSlotContent('chart') : null,
      skeleton: loading ? this.skeleton(status) : null,
      loadingWord: this.words('loading'),
      rootClass: this.getRootClass()
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_3__.renderTileMetricTemplate)(this.templateContext());
  }

}

SfTileMetric.define('sf-tile-metric');

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "8433b29b08eb"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderTileMetricTemplate: () => (/* binding */ renderTileMetricTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
 // sf-tile-metric's markup (scss/ draws it on one rung of the ladder).
//
// - The root is the tile's one target when it has one: a link (href) or a
//   native button (openable), with nothing interactive inside it; otherwise a
//   group named by its label. Inside a button only phrasing content belongs,
//   so every part is a span the sheet lays out.
// - The change says its direction in words (visually hidden) beside the arrow
//   of a tonal sf-badge (C140); no change is the visible words «без
//   изменений», no badge and no sign (C168 (1)). The status says its word
//   beside the icon, so colour is
//   never the only sign. With a hint the word is said before it (visually
//   hidden); without one the word is the line's text («Внимание»), so a
//   threshold that fired is never an icon alone.
// - The limit is a meter; the sf-progress-bar under it is its picture
//   (aria-hidden), with the page's thresholds.
// - loading keeps the label and draws each line that waits in its own place,
//   as tall as the line that comes (owner decision C130 (2); tile study
//   TM-1): the value a first-paint bar in the value's own type, the change
//   the change badge's own box, the limit the meter's own bar and its words'
//   line, the status its hint's line. Which lines wait is what the settings
//   promise (index.js skeleton()). The bars are core's .sf-first-paint-bar
//   (C136: the capitals' height in the middle of the line, the 12 % fill and
//   the pulse, C130 (3), (4)); a box (the badge, the bar) keeps its real part
//   hidden under one fill of the control radius, so it is exactly as big.
// The rung below the tile's: the label, the change, the limit's words and the hint.

const BELOW = {
  '1/2': '1/3',
  1: '1/2',
  2: '1'
};

const bar = words => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-first-paint-bar">${words}</span>`;

const shape = part => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-tile-metric-skeleton sf-tile-metric-skeleton--shape" aria-hidden="true">${part}</span>`;

function renderWaiting(context) {
  const {
    skeleton,
    size
  } = context;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    ${skeleton.change ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-tile-metric-delta" aria-hidden="true">
      ${shape((0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-badge appearance="tonal" size=${BELOW[size]} icon-start="arrow_upward" text=${skeleton.change}></sf-badge>`)}
      ${context.periodText ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-tile-metric-period">${bar(context.periodText)}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    </span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    ${skeleton.limit ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-tile-metric-meter" aria-hidden="true">
      ${shape((0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-progress-bar class="sf-tile-metric-bar" size=${size} value="0"></sf-progress-bar>`)}
      <span class="sf-tile-metric-limit">${bar(skeleton.limit)}</span>
    </span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    ${skeleton.status ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-tile-metric-status" aria-hidden="true"><span class="sf-tile-metric-hint">${bar(skeleton.status)}</span></span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
  `;
}

function renderDelta(context) {
  const {
    change: delta,
    size
  } = context;
  if (!delta) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing; // No change is said in words on the change's line, with no badge and no
  // sign: a grey «− 0» read as a fall (owner C168 (1), 2026-11-14).

  if (delta.direction === 'flat') {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-tile-metric-delta">
      <span class="sf-tile-metric-flat">${delta.word}</span>
      ${context.periodText ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-tile-metric-period">${context.periodText}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    </span>`;
  }

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-tile-metric-delta">
    <sf-badge class="sf-tile-metric-change" data-tone=${delta.tone} appearance="tonal" size=${BELOW[size]}
      status=${delta.badge || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} icon-start=${delta.arrow} text=${delta.text}></sf-badge>
    <span class="sr-only">${delta.word}</span>
    ${context.periodText ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-tile-metric-period">${context.periodText}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
  </span>`;
}

function renderMeter(context) {
  const {
    meter,
    size
  } = context;
  if (!meter) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-tile-metric-meter" role="meter" aria-label=${meter.name}
      aria-valuemin="0" aria-valuemax=${String(meter.max)} aria-valuenow=${String(meter.value)} aria-valuetext=${meter.text}>
    <sf-progress-bar class="sf-tile-metric-bar" aria-hidden="true" size=${size} value=${String(meter.percent)}
      status=${context.status === 'neutral' ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : context.status} warning-at=${meter.warningAt ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing} error-at=${meter.errorAt ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}></sf-progress-bar>
    <span class="sf-tile-metric-limit" aria-hidden="true">${meter.text}</span>
  </span>`;
}

function renderStatus(context) {
  const {
    status,
    hint
  } = context;
  if (status === 'neutral' && !hint) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class=${`sf-tile-metric-status sf-tile-metric-status--${status}`}>
    ${status === 'neutral' ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class="sf-icon sf-tile-metric-status-icon" aria-hidden="true">${context.statusIcon}</i>`}
    ${context.statusWord && hint ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sr-only">${context.statusWord}: </span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    ${hint || context.statusWord ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-tile-metric-hint">${hint || context.statusWord}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
  </span>`;
}

function renderBody(context) {
  const {
    loading,
    uid
  } = context;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <span class="sf-tile-metric-label" id=${`${uid}-label`}>${context.labelShown}</span>
    <span class="sf-tile-metric-figure">
      ${loading ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-tile-metric-value sf-tile-metric-skeleton" aria-hidden="true">${bar(context.skeleton.value)}</span>${context.unit ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-tile-metric-unit">${context.unit}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}<span class="sr-only">${context.loadingWord}</span>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-tile-metric-value">${context.valueShown}</span>${context.unit ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-tile-metric-unit">${context.unit}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}`}
    </span>
    ${loading ? renderWaiting(context) : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${renderDelta(context)}${renderMeter(context)}${renderStatus(context)}`}
  `;
}

function renderTileMetricTemplate(context) {
  const {
    loading,
    uid,
    target
  } = context;
  const size = context.size === '1/2' ? 'half' : context.size;
  const classes = ['sf-tile-metric', `sf-tile-metric--size-${size}`, `sf-tile-metric--${context.status}`, loading ? 'sf-tile-metric--loading' : '', target ? 'sf-tile-metric--target' : '', context.rootClass].filter(Boolean).join(' ');
  const busy = loading ? 'true' : 'false';
  const chart = (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-tile-metric-chart" ?hidden=${!context.hasChart}>${context.chart ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}</span>`;

  if (target === 'link') {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<a class=${classes} style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} href=${context.href} aria-busy=${busy}>${renderBody(context)}${chart}</a>`;
  }

  if (target === 'button') {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<button type="button" class=${classes} style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} aria-busy=${busy}
      @click=${() => context.component.open()}>${renderBody(context)}${chart}</button>`;
  }

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class=${classes} style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} role="group" aria-labelledby=${`${uid}-label`} aria-busy=${busy}>${renderBody(context)}${chart}</div>`;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "6778b5230e7b"
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

/***/ "43090d1c8307"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("page-language", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("page-language", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "deb1a4d61565"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("smart-base", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("smart-base", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "156278cb72e1"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   files: () => (/* binding */ files)
/* harmony export */ });
/* harmony import */ var _en_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("5875d0203387");
// Written by scripts/build-language-packs.mjs from src/core/lang/built-in.json
// (owner decision C282); do not edit. The words this bundle carries: the
// built-in languages' (en); every other language comes from
// a language file (core/lang/<code>.js or its parts).


const files = { en: { runtime: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime } };

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ en: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime });


/***/ },

/***/ "1d705aa58430"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.tile-metric","tag":"sf-tile-metric","version":"1.6.4","kind":"leaf","settings":{"label":{"type":"string","default":""},"value":{"type":"number","optional":true},"value-text":{"type":"string","default":""},"format":{"type":"string","default":"number"},"unit":{"type":"string","default":""},"previous":{"type":"number","optional":true},"delta":{"type":"number","optional":true},"delta-format":{"type":"enum","values":["percent","absolute","both"],"default":"percent"},"period-text":{"type":"string","default":""},"better":{"type":"enum","values":["up","down","none"],"default":"up"},"max":{"type":"number","optional":true},"limit-text":{"type":"string","default":""},"warning-at":{"type":"number","optional":true,"min":0,"max":100},"error-at":{"type":"number","optional":true,"min":0,"max":100},"status":{"type":"enum","values":["neutral","success","warning","error","info"],"default":"neutral"},"hint":{"type":"string","default":""},"href":{"type":"string","default":""},"openable":{"type":"boolean","default":false},"loading":{"type":"boolean","default":false},"size":{"type":"enum","values":["1/2","1","2"],"default":"1"}},"values":{},"events":{"open":{"carries":{"id":"string"}}},"actions":{},"host-states":{"data-status":"string","data-loading":"boolean"},"css-variables":{"--sf-tile-metric-background-color":{"type":"color","state":"default"},"--sf-tile-metric-border-color":{"type":"color","state":"default"},"--sf-tile-metric-radius":{"type":"length","state":"default"},"--sf-tile-metric-padding":{"type":"length","state":"default"},"--sf-tile-metric-value-color":{"type":"color","state":"default"},"--sf-tile-metric-hover-background-color":{"type":"color","state":"hover"},"--sf-tile-metric-min-width":{"type":"length","state":"default"}}}');

/***/ },

/***/ "5875d0203387"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Metric tile","runtime":{"untitled":"Metric","no-value":"—","loading":"Loading","limit":"{value} of {max}","limit-name":"{label}: used","change-up":"up","change-down":"down","change-flat":"no change","status-success":"OK","status-info":"Info","status-warning":"Warning","status-error":"Error"},"events":{"open":{"label":"Open"}}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("af9b960bb93d");
/******/
/******/ })()
;