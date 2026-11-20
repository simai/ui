/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "a2a9d3c2841e"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BADGE_MAIN_TONAL: () => (/* binding */ BADGE_MAIN_TONAL),
/* harmony export */   BADGE_SCHEMES: () => (/* binding */ BADGE_SCHEMES),
/* harmony export */   BADGE_SCHEME_ALIASES: () => (/* binding */ BADGE_SCHEME_ALIASES),
/* harmony export */   BADGE_SIZES: () => (/* binding */ BADGE_SIZES),
/* harmony export */   BADGE_TYPES: () => (/* binding */ BADGE_TYPES),
/* harmony export */   BADGE_VARIANTS: () => (/* binding */ BADGE_VARIANTS),
/* harmony export */   canonicalBadgeScheme: () => (/* binding */ canonicalBadgeScheme),
/* harmony export */   isRetiredMain: () => (/* binding */ isRetiredMain),
/* harmony export */   normalizeBadgeContract: () => (/* binding */ normalizeBadgeContract)
/* harmony export */ });
const BADGE_TYPES = Object.freeze(['main', 'tonal', 'outline']);
const BADGE_SCHEMES = Object.freeze(['neutral', 'primary', 'secondary', 'tertiary', 'info', 'success', 'warning', 'error', 'on-surface']); // Former scheme names that still draw: `danger` was this component's word for
// the error status before the shared vocabulary (contracts/public-api-axes.json,
// journal class-status-aliases, until 2026-12-01). It is read as `error`, so the
// Native constructor emits the canonical class, as sf-badge does; the
// stylesheet matches `.sf-badge--danger` beside it for markup written by hand.

const BADGE_SCHEME_ALIASES = Object.freeze({
  danger: 'error'
});
const BADGE_SIZES = Object.freeze(['1/3', '1/2', '1']); // The default look is tonal (owner decision C140 (1), badges study BG-1): a
// badge without an appearance is the calm grey mark. It was main, the dark
// grey fill nobody chose.

const DEFAULT_BADGE_TYPE = 'tonal';
const DEFAULT_BADGE_SCHEME = 'neutral';
const DEFAULT_BADGE_SIZE = '1/3';

const normalizeEnum = (value, allowed, fallback) => {
  const normalized = String(value ?? fallback).trim().toLowerCase();
  return allowed.includes(normalized) ? normalized : fallback;
}; // The canonical scheme for a name, a former one included; '' when the name is
// not a badge scheme.


function canonicalBadgeScheme(value) {
  const name = String(value ?? '').trim().toLowerCase();
  const canonical = BADGE_SCHEME_ALIASES[name] ?? name;
  return BADGE_SCHEMES.includes(canonical) ? canonical : '';
} // The looks that are drawn: tonal and outline in every colour, main only with
// the error status (C140 (4)).

const BADGE_VARIANTS = Object.freeze(BADGE_SCHEMES.flatMap(scheme => BADGE_TYPES.filter(type => type !== 'main' || scheme === 'error').flatMap(type => BADGE_SIZES.map(size => Object.freeze({
  type,
  scheme,
  size
}))))); // The filled look is the attention count's alone (owner decision C140 (4)):
// main with the error status. main with any other colour draws tonal; the
// spelling keeps working until this date and each use is noted in
// SF.deprecations (journal value-badge-appearance-main-to-tonal).

const BADGE_MAIN_TONAL = Object.freeze({
  since: '2026-11-14',
  remove_after: '2027-01-01'
}); // True when an appearance asked for is the filled one on a colour that draws
// it tonal: the caller notes the old spelling.

function isRetiredMain({
  type,
  scheme
} = {}) {
  const requested = String(type ?? '').trim().toLowerCase();
  return requested === 'main' && (canonicalBadgeScheme(scheme ?? DEFAULT_BADGE_SCHEME) || DEFAULT_BADGE_SCHEME) !== 'error';
}
function normalizeBadgeContract({
  type,
  scheme,
  size
} = {}) {
  let normalizedType = normalizeEnum(type, BADGE_TYPES, DEFAULT_BADGE_TYPE);
  const normalizedScheme = canonicalBadgeScheme(scheme ?? DEFAULT_BADGE_SCHEME) || DEFAULT_BADGE_SCHEME;
  const normalizedSize = normalizeEnum(size, BADGE_SIZES, DEFAULT_BADGE_SIZE); // main is the attention count's: with any other colour it is tonal. The
  // tonal on-surface badge is the grey tonal one (the stylesheet draws
  // sf-badge--on-surface tonal as neutral); it was drawn main, filled.

  if (normalizedType === 'main' && normalizedScheme !== 'error') {
    normalizedType = 'tonal';
  }

  return {
    type: normalizedType,
    scheme: normalizedScheme,
    size: normalizedSize
  };
}

/***/ },

/***/ "1412c5875b4d"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RELATIVE: () => (/* binding */ RELATIVE),
/* harmony export */   densityOf: () => (/* binding */ densityOf),
/* harmony export */   drawing: () => (/* binding */ drawing),
/* harmony export */   followDensity: () => (/* binding */ followDensity),
/* harmony export */   markRelativeSizes: () => (/* binding */ markRelativeSizes),
/* harmony export */   noteAuthored: () => (/* binding */ noteAuthored),
/* harmony export */   sizeOf: () => (/* binding */ sizeOf),
/* harmony export */   sizeStep: () => (/* binding */ sizeStep),
/* harmony export */   sizedBefore: () => (/* binding */ sizedBefore)
/* harmony export */ });
// Density (owner decision C22, 2026-11-09). data-sf-density="compact" on the
// root or on a container moves every component one ladder step down; the CSS
// does it (core/scss/_sf_css__density.scss): each step variable holds the step
// below. An explicit size is a step on the region's ladder (owner decision
// C79, 2026-11-12, changing C22): it comes down with the region, and only
// data-sf-density="normal" takes the normal ladder back.
//
// A size a component's template gives an element it draws (sf-input's clear
// button, a pager's buttons, a submenu) is relative to the component's own
// size; those are still marked data-sf-size-relative once the component has
// drawn. Since C79 the density CSS treats both alike; the mark stays a
// published runtime mark (host-runtime-marks) for hosts that read it.
//
// What a component holds of the page's own (captured slot content, children
// left in place) keeps its size explicit. The store is on the shared global:
// every bundle carries its own copy of this module.
const store = () => {
  const SF = globalThis.SF = globalThis.SF || {};
  const internal = SF.__internal || (SF.__internal = {});
  return internal.density ||= {
    authored: new WeakSet(),
    depth: 0
  };
};

const RELATIVE = 'data-sf-size-relative'; // Page content a component captured to place in its own drawing. Content a
// template hands to a child while it draws is the template's, not the page's.

function noteAuthored(nodes) {
  const state = store();
  if (state.depth > 0) return;

  for (const node of nodes) if (node && typeof node === 'object') state.authored.add(node);
}
function drawing(callback) {
  const state = store();
  state.depth += 1;

  try {
    return callback();
  } finally {
    state.depth -= 1;
  }
} // The sized elements present before a host first draws are the page's.
// A printed first-paint picture is the drawing's, not the page's.

function sizedBefore(host) {
  return new Set(Array.from(host.querySelectorAll?.('[size]') ?? []).filter(element => {
    const picture = element.closest('[data-sf-static]');
    return !picture || !host.contains(picture);
  }));
} // After a host drew: every sized element its drawing holds that is not the
// page's is relative to the host.

function markRelativeSizes(host, before = null) {
  const {
    authored
  } = store();

  for (const element of host.querySelectorAll?.('[size]') ?? []) {
    if (element.hasAttribute(RELATIVE) || before?.has(element)) continue;
    let node = element;
    let page = false;

    while (node && node !== host) {
      if (authored.has(node)) {
        page = true;
        break;
      }

      node = node.parentNode;
    }

    if (!page) element.setAttribute(RELATIVE, '');
  }
} // A popup a component builds itself and places outside its own box (a menu on
// <body>, in an open dialog): sized from the component, so relative, and in
// the component's density, not the density of where it was placed.

function followDensity(element, from) {
  if (!element?.setAttribute) return element;
  if (element.hasAttribute('size')) element.setAttribute(RELATIVE, '');
  const density = densityOf(from);
  if (density) element.setAttribute('data-sf-density', density);else element.removeAttribute('data-sf-density');
  return element;
} // The density an element stands in: the nearest region's (an explicit size
// follows its region since C79); null outside any.

function densityOf(from) {
  for (let node = from; node?.nodeType === 1; node = node.parentElement) {
    if (node.hasAttribute('data-sf-density')) return node.getAttribute('data-sf-density');
  }

  return null;
} // The size step of the control a popup opens from (owner remark 2026-11-15:
// the row menu of a table of size 1 opened at 1/2). A popup a component
// builds outside itself -- a menu on <body> or in the open dialog -- stood on
// the default step whatever opened it. The step is the first size written
// from the opener up: the opener's own (a row's «⋯», the native button an
// sf-button draws), else its component's, else the Smart component that
// holds it (sf-view-table size="1"). A size a template gave a part it draws
// (data-sf-size-relative) follows its host, so the walk goes on past it. It
// ends on the default step (null) at the second custom element without a
// size: the opener's own component may stand on its default, the host
// holding it decides.

function sizeOf(from) {
  let own = true;

  for (let node = from; node?.nodeType === 1; node = node.parentElement) {
    if (node.hasAttribute('size')) {
      if (!node.hasAttribute(RELATIVE)) return node.getAttribute('size');
      continue;
    }

    if (!node.localName.includes('-')) continue;
    if (!own) return null;
    own = false;
  }

  return null;
} // A size step as a number of the ladder ("1/2" is 0.5, "2" is 2); NaN for
// anything else.

function sizeStep(size) {
  const [top, bottom = '1'] = String(size ?? '').trim().split('/');
  const step = Number(top) / Number(bottom);
  return top !== '' && Number.isFinite(step) && step > 0 ? step : Number.NaN;
}

/***/ },

/***/ "e577837dd70a"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   calendarDayOffset: () => (/* binding */ calendarDayOffset),
/* harmony export */   formatDate: () => (/* binding */ formatDate),
/* harmony export */   knownTimeZone: () => (/* binding */ knownTimeZone),
/* harmony export */   msUntilNextDay: () => (/* binding */ msUntilNextDay),
/* harmony export */   timeZoneOffset: () => (/* binding */ timeZoneOffset),
/* harmony export */   toDate: () => (/* reexport safe */ _format_intl_js__WEBPACK_IMPORTED_MODULE_0__.toDate)
/* harmony export */ });
/* harmony import */ var _format_intl_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("15b4e93ff6ed");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_format_intl_js__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
_format_intl_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
// Dates in the page's language: formatDate, the calendar day offset and the
// next midnight, with no top-level side effects (format-intl.js). The same
// functions as core/js/format.js and SF.format; relative days and times are
// format-relative.js, so a bundle that writes a date does not carry them.


const DAY_MS = 86400000;

function hasDateStyle(style) {
  return style === 'short' || style === 'medium' || style === 'long' || style === 'full';
}
/**
 * A date, a time or both in the locale.
 *
 *   formatDate(at)                          3 нояб. 2026 г.  /  Nov 3, 2026
 *   formatDate(at, {date: 'short'})         03.11.2026       /  11/3/26
 *   formatDate(at, {date: 'long'})          3 ноября 2026 г. /  November 3, 2026
 *   formatDate(at, {time: 'short'})         3 нояб. 2026 г., 14:05
 *   formatDate(at, {date: null, time: 'short'})   14:05   /  2:05 PM
 *
 * `date` and `time` are Intl styles (short, medium, long, full); `intl` gives
 * Intl.DateTimeFormat options outright, for a form the styles do not name (a
 * chart's tick, «14:05» with two-digit hours). `timeZone` (an IANA name,
 * Europe/Moscow) writes the moment on that zone's clock instead of the
 * reader's (owner decision C183 (3): a product that knows the person's zone).
 * Anything that is not a date is `gap`, '' by default.
 */


function formatDate(value, {
  date = 'medium',
  time = null,
  intl = null,
  timeZone = '',
  gap = '',
  ...where
} = {}) {
  const moment = (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.toDate)(value);
  if (!moment) return gap;
  let options = intl;

  if (!options) {
    options = {};
    if (hasDateStyle(date)) options.dateStyle = date;
    if (hasDateStyle(time)) options.timeStyle = time;
    if (!options.dateStyle && !options.timeStyle) options.dateStyle = 'medium';
  }

  if (knownTimeZone(timeZone)) options = { ...options,
    timeZone
  };
  return (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.intlFormatter)('DateTimeFormat', (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.formatLocale)(where), options).format(moment);
}
/**
 * Whether the platform knows an IANA time zone name (Europe/Moscow, UTC). An
 * empty or unknown name is the reader's own zone everywhere here.
 */

function knownTimeZone(timeZone) {
  const name = String(timeZone ?? '').trim();
  if (!name) return false;
  const root = typeof globalThis !== 'undefined' ? globalThis : {};
  if (!(root.__sfTimeZones instanceof Map)) root.__sfTimeZones = new Map();
  if (root.__sfTimeZones.has(name)) return root.__sfTimeZones.get(name);
  let known = true;

  try {
    new Intl.DateTimeFormat('en', {
      timeZone: name
    });
  } catch {
    known = false;
  }

  if (root.__sfTimeZones.size < 64) root.__sfTimeZones.set(name, known);
  return known;
} // The calendar date and the clock of a moment in a zone, as numbers: the
// reader's own when the zone is none.

function wallClock(moment, timeZone) {
  if (!knownTimeZone(timeZone)) {
    return {
      year: moment.getFullYear(),
      month: moment.getMonth(),
      day: moment.getDate(),
      hour: moment.getHours(),
      minute: moment.getMinutes(),
      second: moment.getSeconds()
    };
  }

  const parts = {};

  for (const part of (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.intlFormatter)('DateTimeFormat', 'en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  }).formatToParts(moment)) {
    if (part.type !== 'literal') parts[part.type] = Number(part.value);
  }

  return {
    year: parts.year,
    month: parts.month - 1,
    day: parts.day,
    hour: parts.hour % 24,
    minute: parts.minute,
    second: parts.second
  };
}
/**
 * The zone's offset from UTC at a moment, in minutes (Moscow +180, New York
 * -300 in winter); the reader's own when the zone is none.
 */


function timeZoneOffset(value, {
  timeZone = ''
} = {}) {
  const moment = (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.toDate)(value);
  if (!moment) return Number.NaN;
  if (!knownTimeZone(timeZone)) return -moment.getTimezoneOffset();
  const clock = wallClock(moment, timeZone);
  const asUtc = Date.UTC(clock.year, clock.month, clock.day, clock.hour, clock.minute, clock.second);
  return Math.round((asUtc - Math.floor(moment.getTime() / 1000) * 1000) / 60000);
}
/**
 * Calendar days from `now` to the value in the reader's time zone (or
 * `timeZone`'s): 0 today, -1 yesterday, 1 tomorrow; NaN when the value is no
 * date. Counted on calendar dates, not 24-hour spans, so 23:59 yesterday is
 * -1 at 00:01 and a day of a clock change is still one day.
 */

function calendarDayOffset(value, {
  now = new Date(),
  timeZone = ''
} = {}) {
  const moment = (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.toDate)(value);
  const today = (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.toDate)(now);
  if (!moment || !today) return Number.NaN;
  const at = wallClock(moment, timeZone);
  const from = wallClock(today, timeZone);
  const day = Date.UTC(at.year, at.month, at.day);
  const base = Date.UTC(from.year, from.month, from.day);
  return Math.round((day - base) / DAY_MS);
}
/**
 * Milliseconds from `now` to the reader's next midnight, when every relative
 * day on the screen moves by one. A component that shows them sets a timer
 * for this long (plus a second's margin, so it wakes in the new day) and
 * draws them again; «сегодня» said yesterday is wrong by morning.
 */

function msUntilNextDay(now = new Date(), {
  timeZone = ''
} = {}) {
  const today = (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.toDate)(now) ?? new Date();

  if (!knownTimeZone(timeZone)) {
    const next = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    return next.getTime() - today.getTime();
  } // In a named zone: the time left on its clock until 24:00, corrected by a
  // change of its offset before then (a clock change at night).


  const clock = wallClock(today, timeZone);
  const left = DAY_MS - ((clock.hour * 60 + clock.minute) * 60 + clock.second) * 1000 - today.getMilliseconds();
  const shift = timeZoneOffset(today, {
    timeZone
  }) - timeZoneOffset(new Date(today.getTime() + left), {
    timeZone
  });
  return Math.max(1, left + shift * 60000);
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

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

/***/ "db080b4bfc2b"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CONDITION_NODES: () => (/* binding */ CONDITION_NODES),
/* harmony export */   CONDITION_OPS: () => (/* binding */ CONDITION_OPS),
/* harmony export */   CONDITION_PARTS: () => (/* binding */ CONDITION_PARTS),
/* harmony export */   conditionFields: () => (/* binding */ conditionFields),
/* harmony export */   evaluateCondition: () => (/* binding */ evaluateCondition),
/* harmony export */   fieldConditions: () => (/* binding */ fieldConditions),
/* harmony export */   fieldEditable: () => (/* binding */ fieldEditable)
/* harmony export */ });
// A field's conditions (Framework order FO-3 of the view set study, ui-control
// control/research/2026-11-17-view-round-1/framework-orders.md): when the
// field is shown, required and enabled, each a condition over the other
// fields' values as they stand on screen -- what the record holds, or what
// the person has changed it to and not saved yet. It is a part of the
// Framework field descriptor:
//
//   {key, label, propertyType, required?, readonly?,
//    when?: {visible?: <condition>, required?: <condition>, enabled?: <condition>}}
//
// The grammar is small on purpose (the data view port's, Larena's settings
// SettingConditions):
//
//   {field, op, value}   op: eq, ne, in, not_in (value a list), empty, not_empty,
//                        gt, gte, lt, lte (an order as the server keeps it:
//                        decimals exactly, ISO dates as text; Larena
//                        msg-75b451e2eec6413aa2eb)
//   {all: [...]}         every condition holds
//   {any: [...]}         at least one holds
//   {not: {...}}         the condition does not hold
//
// A value is compared by what it is, not by how it is shown ({value, label}
// by its value), as text on both sides (5 and "5" are one value). A multiple
// field is equal when any of its items is. A condition that cannot be read --
// an unknown op, an empty all or any, in without a list -- leaves the field as
// it is declared: a field lost to a typo is a value nobody can see or change.
// A field that is not enabled is drawn read-only, as a field declared readonly.
//
// Plain functions, no rendering: sf-form evaluates them on every drawing, so a
// field appears the moment the value it waits for is chosen, and the contract
// test runs them without a DOM. sf-view-properties' js/conditions.js was the
// copy this replaces; SF.fieldRenderers.conditions publishes it for a host.
const CONDITION_OPS = Object.freeze(['eq', 'ne', 'in', 'not_in', 'empty', 'not_empty', 'gt', 'gte', 'lt', 'lte']);
const COMPARE_OPS = new Set(['gt', 'gte', 'lt', 'lte']); // An order as the server keeps it (Larena when-cases, simai.settings.when-
// cases 1): decimals compare exactly, by their digits, never as floats (a
// big integer stays exact); ISO dates compare as text; a text is not ordered
// against a decimal, and a list or nothing has no order. -1, 0, 1, or null
// where there is no order.

const DECIMAL = /^[-+]?\d+(\.\d+)?$/u;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}([T ][\d:.]+(Z|[-+]\d{2}:?\d{2})?)?$/u;

function compareDecimal(a, b) {
  const sign = text => text.startsWith('-') ? -1 : 1;

  const parts = text => {
    const [whole, fraction = ''] = text.replace(/^[-+]/u, '').split('.');
    return [whole.replace(/^0+(?=\d)/u, ''), fraction.replace(/0+$/u, '')];
  };

  const [aw, af] = parts(a);
  const [bw, bf] = parts(b);

  const zero = (w, f) => /^0*$/u.test(w) && f === '';

  const sa = zero(aw, af) ? 0 : sign(a);
  const sb = zero(bw, bf) ? 0 : sign(b);
  if (sa !== sb) return sa < sb ? -1 : 1;
  if (sa === 0) return 0;
  let order = aw.length !== bw.length ? aw.length < bw.length ? -1 : 1 : aw < bw ? -1 : aw > bw ? 1 : 0;

  if (order === 0) {
    const width = Math.max(af.length, bf.length);
    const fa = af.padEnd(width, '0');
    const fb = bf.padEnd(width, '0');
    order = fa < fb ? -1 : fa > fb ? 1 : 0;
  }

  return sa < 0 ? -order : order;
}

function orderOf(held, bound) {
  const a = String(held).trim();
  const b = String(bound).trim();
  if (DECIMAL.test(a) && DECIMAL.test(b)) return compareDecimal(a, b);
  if (ISO_DATE.test(a) && ISO_DATE.test(b)) return a < b ? -1 : a > b ? 1 : 0;
  return null;
}

const CONDITION_NODES = Object.freeze(['all', 'any', 'not']);
const CONDITION_PARTS = Object.freeze(['visible', 'required', 'enabled']);

const scalar = value => value && typeof value === 'object' && !Array.isArray(value) && 'value' in value ? value.value : value; // What a field holds, as a list of texts: a multiple field is a list already,
// a single one a list of one, and nothing (null, '', []) a list of none.


const itemsOf = value => (Array.isArray(value) ? value : [value]).map(scalar).filter(item => item !== null && item !== undefined && item !== '').map(item => String(item)); // The values on screen, read by key: a Map, or a plain object.


const reader = values => {
  if (values instanceof Map) return key => values.get(key);
  if (values && typeof values === 'object') return key => values[key];
  return () => undefined;
};
/** True or false, or null for a condition that cannot be read. values: a Map or an object of the fields' values by key. */


function evaluateCondition(condition, values) {
  const read = typeof values === 'function' ? values : reader(values);
  if (!condition || typeof condition !== 'object' || Array.isArray(condition)) return null;

  for (const node of ['all', 'any']) {
    if (!(node in condition)) continue;
    const list = condition[node];
    if (!Array.isArray(list) || !list.length) return null;
    const results = list.map(item => evaluateCondition(item, read));
    if (results.includes(null)) return null;
    return node === 'all' ? results.every(Boolean) : results.some(Boolean);
  }

  if ('not' in condition) {
    const inner = evaluateCondition(condition.not, read);
    return inner === null ? null : !inner;
  }

  if (typeof condition.field !== 'string' || !CONDITION_OPS.includes(condition.op)) return null;
  const held = itemsOf(read(condition.field));
  if (condition.op === 'empty') return held.length === 0;
  if (condition.op === 'not_empty') return held.length > 0;

  if (COMPARE_OPS.has(condition.op)) {
    // An order (gt, gte, lt, lte), as the server decides it: a list or
    // nothing has no order, and no order holds.
    const raw = read(condition.field);
    const bound = scalar(condition.value);
    if (Array.isArray(raw) || held.length !== 1 || bound === null || bound === undefined || typeof bound === 'object') return false;
    const order = orderOf(held[0], bound);
    if (order === null) return false;
    return condition.op === 'gt' ? order > 0 : condition.op === 'gte' ? order >= 0 : condition.op === 'lt' ? order < 0 : order <= 0;
  }

  if (condition.op === 'eq' || condition.op === 'ne') {
    const hit = held.includes(String(scalar(condition.value)));
    return condition.op === 'eq' ? hit : !hit;
  }

  if (!Array.isArray(condition.value)) return null;
  const wanted = condition.value.map(item => String(scalar(item)));
  const hit = held.some(item => wanted.includes(item));
  return condition.op === 'in' ? hit : !hit;
}
/**
 * What a field's `when` decides, given the values on screen: {visible,
 * required, enabled}. A part the field does not condition, or conditions
 * unreadably, is what the field declares: shown, required as `required`
 * says, enabled (`readonly` stays the field's own and is read beside it).
 */

function fieldConditions(field, values) {
  const when = field?.when && typeof field.when === 'object' && !Array.isArray(field.when) ? field.when : null;

  const decide = key => when && key in when ? evaluateCondition(when[key], values) : null;

  const visible = decide('visible');
  const required = decide('required');
  const enabled = decide('enabled');
  return {
    visible: visible ?? true,
    required: required ?? field?.required === true,
    enabled: enabled ?? true
  };
}
/**
 * Whether a single-field edit may open (FO3-4): a table cell's edit, a
 * card's quick edit. The field is shown, enabled by its conditions over the
 * record's values and not declared readonly; otherwise the edit does not
 * open and the value stays as text. The record's other fields are the values.
 */

function fieldEditable(field, values) {
  if (!field || field.readonly === true) return false;
  const {
    visible,
    enabled
  } = fieldConditions(field, values);
  return visible && enabled;
}
/** The keys of the fields a field's `when` reads, each once. */

function conditionFields(field) {
  const keys = new Set();

  const walk = condition => {
    if (!condition || typeof condition !== 'object') return;

    if (Array.isArray(condition)) {
      condition.forEach(walk);
      return;
    }

    if (typeof condition.field === 'string') keys.add(condition.field);
    walk(condition.all);
    walk(condition.any);
    walk(condition.not);
  };

  const when = field?.when;
  if (when && typeof when === 'object') for (const part of CONDITION_PARTS) walk(when[part]);
  return [...keys];
}

/***/ },

/***/ "c11c730f061a"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DATE_FUTURE_PERIODS: () => (/* binding */ DATE_FUTURE_PERIODS),
/* harmony export */   DATE_PERIODS: () => (/* binding */ DATE_PERIODS),
/* harmony export */   LEGACY_DATE_OPERATORS: () => (/* binding */ LEGACY_DATE_OPERATORS),
/* harmony export */   LEGACY_DATE_OPERATORS_UNTIL: () => (/* binding */ LEGACY_DATE_OPERATORS_UNTIL),
/* harmony export */   buildFilterRequest: () => (/* binding */ buildFilterRequest),
/* harmony export */   dateConditionLabel: () => (/* binding */ dateConditionLabel),
/* harmony export */   dateConditionOf: () => (/* binding */ dateConditionOf),
/* harmony export */   dateConditionPhrase: () => (/* binding */ dateConditionPhrase),
/* harmony export */   dateConditionValue: () => (/* binding */ dateConditionValue),
/* harmony export */   dateFilterChipText: () => (/* binding */ dateFilterChipText),
/* harmony export */   dateFilterConditions: () => (/* binding */ dateFilterConditions),
/* harmony export */   dateFilterKind: () => (/* binding */ dateFilterKind),
/* harmony export */   dateGroupLabel: () => (/* binding */ dateGroupLabel),
/* harmony export */   filterRequestContext: () => (/* binding */ filterRequestContext),
/* harmony export */   isEmptyFilterEntry: () => (/* binding */ isEmptyFilterEntry),
/* harmony export */   normalizeFilterEntry: () => (/* binding */ normalizeFilterEntry),
/* harmony export */   resolveDatePeriod: () => (/* binding */ resolveDatePeriod)
/* harmony export */ });
/* harmony import */ var _core_js_page_language_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("43090d1c8307");
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("d3818183b14c");
/* harmony import */ var _input_date_js_locale_calendar_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("c4779e51fee1");
/* harmony import */ var _lang_index_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("354525e80715");
/* harmony import */ var _registry_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("fc654eb7fab0");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_page_language_js__WEBPACK_IMPORTED_MODULE_0__, _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_1__]);
([_core_js_page_language_js__WEBPACK_IMPORTED_MODULE_0__, _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_page_language_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_page_language_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_1__);
// The date filter's conditions, its server contract and its words (owner
// decision C293, 2026-11-17; study ui-control
// prototypes/date-filter-conditions-study.html, notes
// control/research/2026-11-17-date-filter/README.md).
//
// A field holds one date (a date, or a date and time) or a period (a start and
// an end). The filter is a condition first and then exactly what the condition
// needs: nothing, one day, two days, a number of days, or -- for a period
// field -- a period by name or two days. One condition per field travels to the
// server as {operator, value}:
//
//   one date    eq, lt, gt, gte, lte          value: "yyyy-mm-dd"
//               between                       value: ["yyyy-mm-dd", "yyyy-mm-dd"], both days in
//               period                        value: a period's name (DATE_PERIODS)
//               last-days, next-days          value: a whole number of days, today counted
//   a period    overlaps, within, starts, ends   value: a period's name or two days
//               contains                      value: "yyyy-mm-dd"
//   both        empty, not-empty              value: true
//   a time      eq, lt, gt                    value: "hh:mm" (catalogue step 4)
//               between                       value: ["hh:mm", "hh:mm"], both ends in
//               empty, not-empty              value: true
//
// The request carries the context the server resolves the periods in,
// {timeZone, weekStart} (weekStart 0 Sunday .. 6 Saturday, as Date#getDay
// counts): «this week» is the server's to work out, by name, so a saved view
// stays «this week» and the browser's clock is not trusted. A date and time is
// compared by its day in that time zone.
//
// The operators today, week and month (fix/date-pd) are read as the periods
// today, this-week and this-month until 2027-01-01 (contracts/changes/journal.json
// value-date-filter-period-operators).
//
// No DOM here and no Lit: the table, a record view and a server-side test read
// the same rules.





const SET_NAME = 'sf-field-renderers'; // Whole calendar periods (this week is Monday to Sunday where the week starts
// on Monday, this month to its last day, this year to 31 December) and the
// rolling «last 7 days», today and the six days before it.

const DATE_PERIODS = Object.freeze(['today', 'yesterday', 'this-week', 'last-week', 'last-7-days', 'this-month', 'last-month', 'this-year']); // A deadline field (filter.future: true) also looks forward. «Overdue» is not
// a date condition: it depends on the record's status.

const DATE_FUTURE_PERIODS = Object.freeze(['tomorrow', 'next-week', 'next-month']);
const LEGACY_DATE_OPERATORS = Object.freeze({
  today: 'today',
  week: 'this-week',
  month: 'this-month'
});
const LEGACY_DATE_OPERATORS_UNTIL = '2027-01-01'; // What a condition needs: none | day | days | count | when (a period's name or
// two days).

const DAY_OPERATORS = ['eq', 'lt', 'gt', 'gte', 'lte'];
const PERIOD_FIELD_OPERATORS = ['overlaps', 'within', 'starts', 'ends'];

function condition(operator, need, group, period = '', extra = {}) {
  return Object.freeze({
    key: period ? `period:${period}` : operator,
    operator,
    need,
    group,
    ...(period ? {
      period
    } : {}),
    ...extra
  });
}

function singleConditions(future) {
  return [condition('eq', 'day', 'date'), condition('between', 'days', 'date'), condition('lt', 'day', 'date'), condition('gt', 'day', 'date'), condition('gte', 'day', 'date'), condition('lte', 'day', 'date'), ...DATE_PERIODS.map(name => condition('period', 'none', 'period', name)), condition('last-days', 'count', 'period'), ...(future ? [condition('period', 'none', 'period', 'tomorrow'), condition('period', 'none', 'period', 'next-week'), condition('next-days', 'count', 'period'), condition('period', 'none', 'period', 'next-month')] : []), condition('empty', 'none', 'filled'), condition('not-empty', 'none', 'filled')];
}

function periodFieldConditions() {
  return [...PERIOD_FIELD_OPERATORS.map(operator => condition(operator, 'when', 'range')), condition('contains', 'day', 'range'), condition('empty', 'none', 'filled'), condition('not-empty', 'none', 'filled')];
} // A time of day (catalogue step 4; it was searched as text): one time, two
// (both ends in), earlier, later, empty, not empty. A time has no zone and no
// week: the request's context does not change it.


const TIME_NEEDS = {
  eq: 'time',
  between: 'times',
  lt: 'time',
  gt: 'time',
  empty: 'none',
  'not-empty': 'none'
};

function timeConditions() {
  return _registry_js__WEBPACK_IMPORTED_MODULE_4__.TIME_FILTER_OPERATORS.map(operator => condition(operator, TIME_NEEDS[operator], TIME_NEEDS[operator] === 'none' ? 'filled' : 'time', '', {
    time: true
  }));
} // A field is a period when it says so: its property type or control is
// `period`, or its filter's kind is; a time of day when its type or control
// is `time`. Every other date field holds one date.


function dateFilterKind(field = {}) {
  const asked = [field.filter?.kind, field.filter?.control, field.propertyType, field.type];
  if (asked.includes('period')) return 'period';
  return [field.filter?.kind, field.filter?.control, field.propertyType || field.type].includes('time') ? 'time' : 'date';
}

function isDueField(field = {}) {
  return field.filter?.future === true || field.future === true;
} // The conditions the field's filter offers, in the order of the list. A host's
// filter.operators narrows them: an operator it names stays, `period` keeps
// every period, and the old today, week and month keep every period and «last
// N days» (they were the list's periods).


function dateFilterConditions(field = {}) {
  const kind = dateFilterKind(field);
  const all = kind === 'period' ? periodFieldConditions() : kind === 'time' ? timeConditions() : singleConditions(isDueField(field));
  const asked = field.filter?.operators;
  if (!Array.isArray(asked) || !asked.length) return all;
  const names = new Set();

  for (const operator of asked) {
    const name = String(operator);

    if (LEGACY_DATE_OPERATORS[name]) {
      names.add('period');
      names.add('last-days');
      names.add('next-days');
    } else names.add(name);
  }

  const kept = all.filter(one => names.has(one.operator));
  return kept.length ? kept : all;
}

function isDay(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/u.test(value);
}

function dayOf(value) {
  if (typeof value !== 'string') return '';
  const day = value.slice(0, 10);
  return isDay(day) ? day : '';
}

const TIME_TEXT_RE = /^([01]\d|2[0-3]):[0-5]\d$/u;

function timeOf(value) {
  if (typeof value !== 'string') return '';
  const time = value.trim().slice(0, 5);
  return TIME_TEXT_RE.test(time) ? time : '';
}

function isTwoTimes(value) {
  return Array.isArray(value) && value.length === 2 && Boolean(timeOf(value[0])) && Boolean(timeOf(value[1]));
}

function isTwoDays(value) {
  return Array.isArray(value) && value.length === 2 && isDay(dayOf(value[0])) && isDay(dayOf(value[1]));
}

function isPeriodName(value) {
  return typeof value === 'string' && (DATE_PERIODS.includes(value) || DATE_FUTURE_PERIODS.includes(value));
}

function isCount(value) {
  const number = Number(value);
  return value !== '' && value !== null && value !== true && Number.isInteger(number) && number > 0;
} // The old operators as the new periods, noted once per page in
// SF.deprecations until LEGACY_DATE_OPERATORS_UNTIL.


function normalizeFilterEntry(entry) {
  if (!entry || typeof entry !== 'object' || Array.isArray(entry)) return entry;
  const period = LEGACY_DATE_OPERATORS[entry.operator];
  if (!period) return entry;
  (0,_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_1__.noteDeprecated)({
    component: SET_NAME,
    kind: 'value',
    attribute: 'filter operator',
    from: entry.operator,
    to: `period ${period}`,
    since: '2026-11-17',
    remove_after: LEGACY_DATE_OPERATORS_UNTIL
  });
  return { ...entry,
    operator: 'period',
    value: period
  };
}

function isBlank(value) {
  if (value === null || value === undefined) return true;
  if (Array.isArray(value)) return value.every(isBlank);
  if (typeof value === 'string') return value.trim() === '';
  if (typeof value === 'object') return Object.values(value).every(isBlank);
  return false;
} // Whether a filter entry says nothing yet, so the table drops it with its
// chip. It reads the operator (DF-1): a period, «empty» and «not empty» are
// whole by themselves, and a condition that needs a day is empty without one.
// An entry of any other field keeps the old reading: empty when its value or
// values are.


function isEmptyFilterEntry(entry) {
  if (!entry || typeof entry !== 'object' || Array.isArray(entry)) return isBlank(entry);
  const one = LEGACY_DATE_OPERATORS[entry.operator] ? normalizeFilterEntry(entry) : entry;
  const {
    operator,
    value
  } = one;

  switch (operator) {
    case 'empty':
    case 'not-empty':
      return false;

    case 'period':
      return !isPeriodName(value);

    case 'last-days':
    case 'next-days':
      return !isCount(value);

    case 'overlaps':
    case 'within':
    case 'starts':
    case 'ends':
      return !(isPeriodName(value) || isTwoDays(value));

    default:
      break;
  }

  if (Object.prototype.hasOwnProperty.call(one, 'values')) return isBlank(one.values);
  if (Object.prototype.hasOwnProperty.call(one, 'value')) return isBlank(one.value);
  return Object.entries(one).filter(([key]) => !['operator', 'control', 'type'].includes(key)).every(([, item]) => isBlank(item));
} // The value a condition starts with when it is chosen: the stale day of the
// condition before is not carried into a period (DF-2), but a day stays a day
// and two days stay two days.

function dateConditionValue(next, previous = {}) {
  const before = previous?.value;

  switch (next.need) {
    case 'none':
      return next.period || true;

    case 'day':
      return isDay(dayOf(before)) ? dayOf(before) : null;

    case 'days':
      return isTwoDays(before) ? before.map(dayOf) : null;

    case 'count':
      return isCount(before) ? Number(before) : 30;

    case 'when':
      return isPeriodName(before) || isTwoDays(before) ? before : 'this-week';

    case 'time':
      return timeOf(before) || (Array.isArray(before) ? timeOf(before[0]) || null : null);

    case 'times':
      return isTwoTimes(before) ? before.map(timeOf) : timeOf(before) ? [timeOf(before), ''] : ['', ''];

    default:
      return null;
  }
} // The condition an entry stands for, in the field's list.

function dateConditionOf(field, entry) {
  const list = dateFilterConditions(field);
  const one = normalizeFilterEntry(entry || {});
  if (one?.operator === 'period') return list.find(item => item.period === one.value) ?? null;
  return list.find(item => item.operator === one?.operator) ?? null;
} // The context a request carries: the time zone and the first day of the week
// the server resolves the periods in. A host that knows the person's own
// (monday.com takes them from the profile) passes them; otherwise the
// browser's zone and the page language's week.

function filterRequestContext(node = null, {
  timeZone,
  weekStart
} = {}) {
  let zone = typeof timeZone === 'string' && timeZone ? timeZone : '';

  if (!zone) {
    try {
      zone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    } catch {
      zone = 'UTC';
    }
  }

  const start = Number.isInteger(weekStart) && weekStart >= 0 && weekStart <= 7 ? weekStart % 7 : (0,_input_date_js_locale_calendar_js__WEBPACK_IMPORTED_MODULE_2__.localeWeekStart)((0,_core_js_page_language_js__WEBPACK_IMPORTED_MODULE_0__.pageLocale)(node));
  return {
    timeZone: zone,
    weekStart: start
  };
} // A filter's values as the server is asked for them: the old operators read as
// periods, empty entries left out, and the context beside them.

function buildFilterRequest(values = {}, {
  node = null,
  context
} = {}) {
  const out = {};

  for (const [key, entry] of Object.entries(values || {})) {
    if (isEmptyFilterEntry(entry)) continue;
    out[key] = normalizeFilterEntry(entry);
  }

  return {
    values: out,
    context: filterRequestContext(node, context || {})
  };
} // A period's first and last day for a given today, as the server is asked to
// resolve it (a reference for a host's server and for the tests). `today` is
// yyyy-mm-dd in the request's time zone.

function resolveDatePeriod(name, {
  today,
  weekStart = 1
} = {}) {
  if (!isDay(today)) return null;
  const [y, m, d] = today.split('-').map(Number);

  const at = (year, month, day) => {
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.toISOString().slice(0, 10);
  };

  const shift = days => at(y, m, d + days);

  const dow = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  const back = (dow - weekStart % 7 + 7) % 7;

  switch (name) {
    case 'today':
      return [today, today];

    case 'yesterday':
      return [shift(-1), shift(-1)];

    case 'tomorrow':
      return [shift(1), shift(1)];

    case 'this-week':
      return [shift(-back), shift(6 - back)];

    case 'last-week':
      return [shift(-back - 7), shift(-back - 1)];

    case 'next-week':
      return [shift(7 - back), shift(13 - back)];

    case 'last-7-days':
      return [shift(-6), today];

    case 'this-month':
      return [at(y, m, 1), at(y, m + 1, 0)];

    case 'last-month':
      return [at(y, m - 1, 1), at(y, m, 0)];

    case 'next-month':
      return [at(y, m + 1, 1), at(y, m + 2, 0)];

    case 'this-year':
      return [at(y, 1, 1), at(y, 12, 31)];

    default:
      return null;
  }
} // ---- Words ----

const camel = text => String(text).replace(/-([a-z0-9])/gu, (_, letter) => letter.toUpperCase());

function word(node, key, vars, count) {
  return (0,_core_js_page_language_js__WEBPACK_IMPORTED_MODULE_0__.pageWord)(_lang_index_mjs__WEBPACK_IMPORTED_MODULE_3__["default"], key, node, {
    component: SET_NAME,
    vars,
    count
  });
} // A condition's name in the list: «Точная дата», «Прошлый месяц», «Пусто».


function dateConditionLabel(node, item) {
  if (!item) return '';
  if (item.period) return word(node, `datePeriod_${camel(item.period)}`);
  if (item.time && item.operator === 'eq') return word(node, 'timeCondition_eq');
  return word(node, `dateCondition_${camel(item.operator)}`);
}
function dateGroupLabel(node, group) {
  return word(node, `dateGroup_${group}`);
}

function currentYear(timeZone) {
  try {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone,
      year: 'numeric'
    }).format(new Date());
  } catch {
    return String(new Date().getFullYear());
  }
}

function dayDate(day) {
  const [y, m, d] = day.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d, 12));
} // A day as the chip says it: «17 ноября», «20 января 2025» -- the year only when
// it is not this year.


function dayText(node, day, timeZone) {
  if (!isDay(day)) return '…';
  const withYear = day.slice(0, 4) !== currentYear(timeZone);

  try {
    return new Intl.DateTimeFormat((0,_core_js_page_language_js__WEBPACK_IMPORTED_MODULE_0__.pageLocale)(node), {
      day: 'numeric',
      month: 'long',
      ...(withYear ? {
        year: 'numeric'
      } : {}),
      timeZone: 'UTC'
    }).format(dayDate(day));
  } catch {
    return day;
  }
} // Two days as one span: «1–15 ноября», «28 октября – 3 ноября».


function spanText(node, from, to, timeZone) {
  const a = dayOf(from);
  const b = dayOf(to);
  if (!isDay(a) || !isDay(b)) return dayText(node, a || b, timeZone);
  if (a === b) return dayText(node, a, timeZone);
  const year = currentYear(timeZone);
  const withYear = a.slice(0, 4) !== year || b.slice(0, 4) !== year;

  try {
    const format = new Intl.DateTimeFormat((0,_core_js_page_language_js__WEBPACK_IMPORTED_MODULE_0__.pageLocale)(node), {
      day: 'numeric',
      month: 'long',
      ...(withYear ? {
        year: 'numeric'
      } : {}),
      timeZone: 'UTC'
    });
    return format.formatRange(dayDate(a), dayDate(b));
  } catch {
    return `${dayText(node, a, timeZone)} – ${dayText(node, b, timeZone)}`;
  }
}

function periodPhrase(node, name) {
  return word(node, `datePeriodIn_${camel(name)}`);
} // A time as the chip says it, in the page's language: «10:30», «10:30 AM».


function timeText(node, value) {
  const time = timeOf(value);
  if (!time) return '…';
  const [h, m] = time.split(':').map(Number);

  try {
    return new Intl.DateTimeFormat((0,_core_js_page_language_js__WEBPACK_IMPORTED_MODULE_0__.pageLocale)(node), {
      hour: 'numeric',
      minute: '2-digit',
      timeZone: 'UTC'
    }).format(new Date(Date.UTC(2000, 0, 1, h, m)));
  } catch {
    return time;
  }
}

function timePhrase(node, {
  operator,
  value
}) {
  switch (operator) {
    case 'eq':
      return timeText(node, value);

    case 'between':
      return Array.isArray(value) ? `${timeText(node, value[0])}\u2013${timeText(node, value[1])}` : '…';

    case 'lt':
    case 'gt':
      return word(node, `dateChip_${operator}`, {
        date: timeText(node, value)
      });

    case 'empty':
    case 'not-empty':
      return word(node, `dateChip_${camel(operator)}`);

    default:
      return '';
  }
} // What a condition says after the field's name on its chip: «в прошлом
// месяце», «не позже 17 ноября», «идёт на этой неделе», «пусто» (DF-4); for
// a time «10:00–18:00», «раньше 10:30».


function dateConditionPhrase(field, entry, node = null, {
  timeZone
} = {}) {
  if (dateFilterKind(field) === 'time') return timePhrase(node, entry || {});
  const one = normalizeFilterEntry(entry || {});
  const zone = timeZone || filterRequestContext(node).timeZone;
  const {
    operator,
    value
  } = one || {};

  const when = () => isPeriodName(value) ? periodPhrase(node, value) : isTwoDays(value) ? spanText(node, value[0], value[1], zone) : '…';

  switch (operator) {
    case 'eq':
      return dayText(node, dayOf(value), zone);

    case 'between':
      return Array.isArray(value) ? spanText(node, value[0], value[1], zone) : '…';

    case 'lt':
    case 'gt':
    case 'gte':
    case 'lte':
      return word(node, `dateChip_${operator}`, {
        date: dayText(node, dayOf(value), zone)
      });

    case 'period':
      return isPeriodName(value) ? periodPhrase(node, value) : '…';

    case 'last-days':
    case 'next-days':
      return word(node, `dateChip_${camel(operator)}`, undefined, isCount(value) ? Number(value) : 0);

    case 'empty':
    case 'not-empty':
      return word(node, `dateChip_${camel(operator)}`);

    case 'overlaps':
    case 'starts':
    case 'ends':
      return word(node, `dateChip_${operator}`, {
        when: when()
      });

    case 'within':
      return isPeriodName(value) ? word(node, 'dateChip_within', {
        when: when()
      }) : word(node, 'dateChip_withinDays', {
        when: when()
      });

    case 'contains':
      return word(node, 'dateChip_contains', {
        date: dayText(node, dayOf(value), zone)
      });

    default:
      return '';
  }
} // The chip of a date filter: «Дата оплаты: в прошлом месяце». A condition the
// set does not know keeps the field's name alone.

function dateFilterChipText(field = {}, entry, node = null, options = {}) {
  const name = String(field.label ?? field.key ?? '');
  const phrase = dateConditionPhrase(field, entry, node, options);
  return phrase ? word(node, 'dateChip', {
    field: name,
    condition: phrase
  }) : name;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "9ce1a42b2a85"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DATE_TIME_RE: () => (/* binding */ DATE_TIME_RE),
/* harmony export */   composeDateTime: () => (/* binding */ composeDateTime),
/* harmony export */   composeTime: () => (/* binding */ composeTime),
/* harmony export */   normalizeTime: () => (/* binding */ normalizeTime),
/* harmony export */   splitDateTime: () => (/* binding */ splitDateTime),
/* harmony export */   splitTime: () => (/* binding */ splitTime)
/* harmony export */ });
// A datetime's value, read and written back: plain functions, no rendering.
// The edit renderers (renderDateTimeEdit and renderTimeEdit in index.js) use them, the contract
// test runs them without a DOM, and SF.fieldRenderers.dateTime publishes them
// so a host that draws its own pair reads and writes the same way.
//
// Lifted from ui-admin's property view (src/smart/property-view/js/
// datetime-value.js, Larena acceptance 2026-10-22: «Дата и время» kept only
// the day, so a new record could not get a time and «15.11.2026 10:30» was
// saved as «15.11.2026»).
//
// The value is the host's text, in the host's time zone, as it reads it. The
// round trip is lossless: a field whose day and time come back to what they
// were writes back exactly the text it read. A changed day keeps the record's
// clock (seconds, fraction) and zone; a changed time is hh:mm:00 with the
// record's zone; a new value has no zone and is the host's local time.
// The forms a datetime arrives in: a day, or a day and a time separated by T or
// a space, with optional seconds, fraction and zone.
const DATE_TIME_RE = /^(\d{4}-\d{2}-\d{2})(?:[T ](\d{2}):(\d{2})((?::\d{2})(?:\.\d+)?)?(Z|[+-]\d{2}:?\d{2})?)?$/u;
const DAY_RE = /^\d{4}-\d{2}-\d{2}$/u; // The value without the host's formatting ({value, text} carries both).

function rawValue(value) {
  if (value && typeof value === 'object' && !Array.isArray(value) && 'value' in value) return value.value;
  return value;
} // What a stored value is made of. `known` is false for a value that is not a
// datetime at all: the controls start empty and, untouched, nothing is written.


function splitDateTime(value) {
  const raw = rawValue(value);
  if (raw === null || raw === undefined || raw === '') return {
    raw: raw ?? null,
    known: true,
    date: '',
    time: '',
    rest: '',
    zone: ''
  };
  const match = typeof raw === 'string' ? raw.trim().match(DATE_TIME_RE) : null;
  if (!match) return {
    raw,
    known: false,
    date: '',
    time: '',
    rest: '',
    zone: ''
  };
  return {
    raw,
    known: true,
    date: match[1],
    time: match[2] ? `${match[2]}:${match[3]}` : '',
    rest: match[4] || '',
    zone: match[5] || ''
  };
} // A time as the person typed it, as hh:mm, or null when it is not one. The
// mask gives «10:30»; without it «1030», «9:30» and «9.30» are read too.

function normalizeTime(text) {
  const value = String(text ?? '').trim().replace(/[_\s]/gu, '');
  if (value === '' || value === ':') return '';
  const match = value.match(/^(\d{1,2})[:.]?(\d{2})$/u);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;
  return `${String(hours).padStart(2, '0')}:${match[2]}`;
} // The value to write for a day and a time, against what the field held.
// {value} -- the text to write (null clears), or {error} -- the key of the
// sentence that says what is missing: dateMissing, dateInvalid, timeMissing,
// timeInvalid.

function composeDateTime(original, draft) {
  const date = String(draft?.date ?? '').trim();
  const time = normalizeTime(draft?.time);
  if (time === null) return {
    error: 'timeInvalid'
  };
  if (!date && !time) return {
    value: null
  };
  if (!DAY_RE.test(date)) return {
    error: date ? 'dateInvalid' : 'dateMissing'
  };
  if (!time) return {
    error: 'timeMissing'
  };
  const before = original?.known ? original : null; // Back to what it was: the very text it read, separator and all.

  if (before && before.date === date && before.time === time) return {
    value: before.raw
  }; // The clock below the minute and the zone are the record's while the
  // person did not change the time; a time they typed is to the minute.

  const sameTime = before && before.time === time;
  const rest = sameTime ? before.rest : ':00';
  const zone = before && before.time ? before.zone : '';
  return {
    value: `${date}T${time}${rest}${zone}`
  };
} // A time of day as a host stores it: hh:mm, or with seconds and a fraction.

const TIME_RE = /^(\d{2}):(\d{2})((?::\d{2})(?:\.\d+)?)?$/u; // What a stored time is made of, as splitDateTime says it for a datetime.

function splitTime(value) {
  const raw = rawValue(value);
  if (raw === null || raw === undefined || raw === '') return {
    raw: raw ?? null,
    known: true,
    time: '',
    rest: ''
  };
  const match = typeof raw === 'string' ? raw.trim().match(TIME_RE) : null;
  if (!match || normalizeTime(`${match[1]}:${match[2]}`) === null) return {
    raw,
    known: false,
    time: '',
    rest: ''
  };
  return {
    raw,
    known: true,
    time: `${match[1]}:${match[2]}`,
    rest: match[3] || ''
  };
} // The value to write for a time, against what the field held: {value} (null
// clears) or {error: 'timeInvalid'}. The same minute writes back the very
// text it read; a changed one keeps the stored shape (hh:mm:00 where the
// host stores seconds), and a new one is hh:mm.

function composeTime(original, text) {
  const time = normalizeTime(text);
  if (time === null) return {
    error: 'timeInvalid'
  };
  if (!time) return {
    value: null
  };
  const before = original?.known ? original : null;
  if (before && before.time === time) return {
    value: before.raw
  };
  return {
    value: before?.rest ? `${time}:00` : time
  };
}

/***/ },

/***/ "ab3947ea3647"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CURRENCY_DISPLAYS: () => (/* binding */ CURRENCY_DISPLAYS),
/* harmony export */   addDecimal: () => (/* binding */ addDecimal),
/* harmony export */   compareDecimal: () => (/* binding */ compareDecimal),
/* harmony export */   currencyCodes: () => (/* binding */ currencyCodes),
/* harmony export */   currencyDisplayOf: () => (/* binding */ currencyDisplayOf),
/* harmony export */   currencyOf: () => (/* binding */ currencyOf),
/* harmony export */   editableDecimal: () => (/* binding */ editableDecimal),
/* harmony export */   formatDecimal: () => (/* binding */ formatDecimal),
/* harmony export */   formatMoney: () => (/* binding */ formatMoney),
/* harmony export */   formatPercent: () => (/* binding */ formatPercent),
/* harmony export */   fractionDigits: () => (/* binding */ fractionDigits),
/* harmony export */   isRtlLocale: () => (/* binding */ isRtlLocale),
/* harmony export */   minorUnits: () => (/* binding */ minorUnits),
/* harmony export */   moneyParts: () => (/* binding */ moneyParts),
/* harmony export */   moneyTotals: () => (/* binding */ moneyTotals),
/* harmony export */   readDecimal: () => (/* binding */ readDecimal),
/* harmony export */   readTypedDecimal: () => (/* binding */ readTypedDecimal),
/* harmony export */   restingDecimal: () => (/* binding */ restingDecimal)
/* harmony export */ });
/* harmony import */ var _core_js_format_intl_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("15b4e93ff6ed");
/* harmony import */ var _core_js_format_number_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("c9ce0852ac73");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_format_intl_js__WEBPACK_IMPORTED_MODULE_0__, _core_js_format_number_js__WEBPACK_IMPORTED_MODULE_1__]);
([_core_js_format_intl_js__WEBPACK_IMPORTED_MODULE_0__, _core_js_format_number_js__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
// Decimal numbers as strings, never as floats (simai.property-view-port
// 1.18.0; Larena property types standard, notes of 2026-11-03: «Never a float
// on the wire»). What a person typed is read into a canonical decimal string,
// and a decimal, a money amount and a percent are shown in the page's language
// through Intl, which formats a string by its digits: «1500.10» never passes
// through a float on the way to «1 500,10 ₽». Pure, so the unit suite reads it
// without a browser. Money and percent are the Framework's in every mode
// (owner decision C291 (2)) and their display, paste and totals follow owner
// decision C294 (2026-11-17, MP-1..MP-12): the standard sign, never the
// narrow one; a minus and nothing else for a negative; the amount and its
// sign never broken apart; a direction mark on a right-to-left page; what a
// person pastes («1 234,50 ₽», «$1,234.50») read as a decimal string. The
// View set's items, compound and ru.requisites call these functions instead
// of keeping a copy.


const TYPED = /^([+-]?)(\d*)(?:[.,](\d*))?$/u; // Spaces a person or a formatter puts between groups of digits: the plain
// space, the no-break space and the narrow no-break space ru-RU writes, and
// the apostrophe some locales group with.

const GROUP_SPACES = /[\s\u00a0\u202f']/gu;
/**
 * What a person typed, read as a decimal: `{ok: true, value}` with the
 * canonical string (an optional minus, the integer digits without leading
 * zeros, the fraction digits as typed; null for nothing typed), or
 * `{ok: false}` for text that is not a number. A comma and a point both
 * separate the fraction. A JSON integer is read as its digits; a float is not
 * a decimal and is refused rather than guessed at.
 */

function readDecimal(text) {
  if (text === null || typeof text === 'undefined') return {
    ok: true,
    value: null
  };

  if (typeof text === 'number') {
    return Number.isSafeInteger(text) ? {
      ok: true,
      value: String(text)
    } : {
      ok: false
    };
  }

  const plain = String(text).replace(GROUP_SPACES, '');
  if (plain === '') return {
    ok: true,
    value: null
  };
  const match = TYPED.exec(plain);
  if (!match) return {
    ok: false
  };
  const [, sign, whole, fraction] = match;
  if (whole === '' && (fraction ?? '') === '') return {
    ok: false
  };
  const integer = whole.replace(/^0+(?=\d)/u, '') || '0';
  const digits = fraction ?? '';
  const zero = /^0*$/u.test(integer + digits);
  return {
    ok: true,
    value: `${sign === '-' && !zero ? '-' : ''}${integer}${digits ? `.${digits}` : ''}`
  };
}
/** How many digits a canonical decimal string has after its point. */

function fractionDigits(value) {
  const at = String(value ?? '').indexOf('.');
  return at === -1 ? 0 : String(value).length - at - 1;
} // A float a host sent anyway is shown, not refused: a cell is not the place to
// argue with a stored value. Only what reads as a decimal is formatted. A
// float that is not a whole number is rounded to `digits` when they are given
// (a currency's minor units, a percent's six) -- 0.1 + 0.2 roubles are
// «0,30 ₽», never «0,30000000000000004 ₽» (MP-2) -- and the page hears it once
// in the console: the value should have been a decimal string.

const FLOAT_WARNED = new Set();

function warnFloat(kind) {
  if (FLOAT_WARNED.has(kind)) return;
  FLOAT_WARNED.add(kind);
  globalThis.console?.warn?.(`SF.fieldRenderers: a ${kind} value came as a number; send a decimal string ("1500.5"), a float loses digits.`);
}

function decimalOf(value, digits = null, kind = 'number') {
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) return null;
    if (Number.isInteger(value)) return Number.isSafeInteger(value) ? String(value) : BigInt(value).toString();
    if (!Number.isInteger(digits)) return String(value);
    warnFloat(kind);
    return readDecimal(value.toFixed(Math.min(20, digits)).replace(/(\.\d*?)0+$/u, '$1').replace(/\.$/u, '')).value;
  }

  const read = readDecimal(value);
  return read.ok ? read.value : null;
} // Right-to-left languages: a number drawn there starts with the right-to-left
// mark, so a minus, a sign or a «%» never jumps to the other end of the line
// (C294, MP-9). Intl writes the mark for a negative already; the positive
// amount had none.


const RTL_LANGUAGES = new Set(['ar', 'he', 'iw', 'fa', 'ur', 'ps', 'yi', 'dv', 'ckb', 'sd', 'ug']);
const DIRECTION_MARKS = /[\u200e\u200f\u061c\u2066-\u2069]/gu;
function isRtlLocale(locale) {
  return RTL_LANGUAGES.has(String(locale || '').toLowerCase().split(/[-_]/u)[0]);
} // On a right-to-left page a sign that ends in a neutral mark («US$», «CA$»)
// is isolated left to right (U+2066 .. U+2069), or the browser draws «$US»; a
// percent is held left to right as a whole («12.5 %»), as Intl's Arabic
// pattern holds «12.5%» with its marks.

function directed(text, locale, {
  wholeLtr = false
} = {}) {
  if (!text || !isRtlLocale(locale)) return text;
  if (wholeLtr) return `\u200f\u200e${text.replace(DIRECTION_MARKS, '')}\u200e`;
  const glued = text.replace(/[A-Za-z]+[^\sA-Za-z\d\u00a0\u202f\u200e\u200f\u061c\u2066-\u2069.,\u066b\u066c-]+/gu, '\u2066$&\u2069');
  return glued.startsWith('\u200f') ? glued : `\u200f${glued}`;
} // The amount and its sign stay on one line: every plain space Intl leaves
// between them becomes a no-break one (ru, de write U+00A0 already).


const unbroken = text => text.replace(/ /gu, '\u00a0');
/**
 * A decimal string in the locale's digits and groups, with every digit it has
 * and at least `minDigits`: «1 500,5», «1 234 567,5» (the Number type, MP-5;
 * money and percent use the same groups). A float that is not whole keeps at
 * most six digits.
 */


function formatDecimal(value, locale, {
  minDigits = 0
} = {}) {
  const decimal = decimalOf(value, 6);
  if (decimal === null) return '';
  const digits = Math.min(20, Math.max(minDigits, fractionDigits(decimal)));
  return directed(unbroken((0,_core_js_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.intlFormatter)('NumberFormat', locale, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  }).format(decimal)), locale);
}
/** A money value as {amount, currency}; a field that fixes the currency takes a bare amount. */

function moneyParts(value, fixed) {
  const currency = typeof fixed === 'string' && fixed ? fixed : null;

  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return {
      amount: value.amount ?? null,
      currency: currency || (value.currency ?? null)
    };
  }

  if (value === null || typeof value === 'undefined' || value === '') return {
    amount: null,
    currency
  };
  return {
    amount: value,
    currency
  };
} // How a field names its currency (C294, q-mp-sign): Intl's standard sign
// (`symbol`, the default) -- «₽» on a Russian page, «$» for the US dollar on an
// English one and «CA$» for the Canadian dollar, so two currencies never read
// the same -- or the code (`code`, for accounting and exports) or the name
// (`name`). The narrow sign wrote USD, CAD and AUD all as «$» (MP-3): a field
// asking for it gets the standard sign.

const CURRENCY_DISPLAYS = Object.freeze(['symbol', 'code', 'name']);
function currencyDisplayOf(field = {}) {
  return CURRENCY_DISPLAYS.includes(field?.currencyDisplay) ? field.currencyDisplay : 'symbol';
}
/** ISO 4217 minor units of a currency (RUB 2, JPY 0, KWD 3); 2 for a code Intl does not know. */

function minorUnits(currency) {
  try {
    return new Intl.NumberFormat('en', {
      style: 'currency',
      currency
    }).resolvedOptions().maximumFractionDigits ?? 2;
  } catch {
    return 2;
  }
}
/**
 * An amount with its currency, as a person reads it: «1 500,50 ₽», «$1,500.50»,
 * «CA$10.00» (C294). The digits after the point are at least the currency's
 * minor units (ISO 4217) and every digit the amount has; a float is rounded
 * to the minor units, with one console warning. A negative amount has the
 * minus where the language writes it and nothing else -- no colour, no
 * brackets (q-mp-negative). The amount and the sign never break apart, and a
 * right-to-left page gets the direction mark. Without a currency, the amount
 * alone.
 */

function formatMoney(value, field = {}, locale = 'en') {
  const {
    amount,
    currency
  } = moneyParts(value, field.currency);
  const minor = currency ? minorUnits(currency) : 2;
  const decimal = decimalOf(amount, minor, 'money');
  if (decimal === null) return '';
  if (!currency) return formatDecimal(decimal, locale);
  const digits = Math.min(20, Math.max(minor, fractionDigits(decimal)));
  return directed(unbroken((0,_core_js_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.intlFormatter)('NumberFormat', locale, {
    style: 'currency',
    currency,
    currencyDisplay: currencyDisplayOf(field),
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  }).format(decimal)), locale);
}
/**
 * A percent, «12,5 %» and «12.5 %»: the value is the percent ("20" is 20 %),
 * never the share -- the share is SF.format's word `share` (MP-4). One
 * spelling in every language (C203 (3)): the number, a no-break space, «%».
 * A float keeps at most six digits, with one console warning.
 */

function formatPercent(value, locale = 'en') {
  const decimal = decimalOf(value, 6, 'percent');
  if (decimal === null) return '';
  const digits = Math.min(20, fractionDigits(decimal));
  return directed((0,_core_js_format_number_js__WEBPACK_IMPORTED_MODULE_1__.percentSign)((0,_core_js_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.intlFormatter)('NumberFormat', locale, {
    style: 'unit',
    unit: 'percent',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  }).format(decimal)), locale, {
    wholeLtr: true
  });
}
/** The sum of decimal strings, by their digits (a column total): "1500.5" + "0.75" is "1501.25"; null when one is not a decimal. */

function addDecimal(...values) {
  let scale = 0;
  const read = [];

  for (const value of values.flat()) {
    if (value === null || value === undefined || value === '') continue;
    const one = decimalOf(value, 20);
    if (one === null) return null;
    read.push(one);
    scale = Math.max(scale, fractionDigits(one));
  }

  let total = 0n;

  for (const one of read) {
    const negative = one.startsWith('-');
    const [whole, fraction = ''] = one.replace('-', '').split('.');
    const units = BigInt(whole + fraction.padEnd(scale, '0'));
    total += negative ? -units : units;
  }

  const negative = total < 0n;
  const digits = (negative ? -total : total).toString().padStart(scale + 1, '0');
  const whole = digits.slice(0, digits.length - scale) || '0';
  const fraction = scale ? digits.slice(-scale).replace(/0+$/u, '') : '';
  const zero = /^0*$/u.test(whole + fraction);
  return `${negative && !zero ? '-' : ''}${whole}${fraction ? `.${fraction}` : ''}`;
}
/**
 * A money column's total (C294): the amounts added by their digits, one sum
 * per currency, in the order the currencies first appear -- a column of
 * dollars and euros is two sums, never one. [{currency, amount, text}];
 * values that are not money are left out.
 */

function moneyTotals(values = [], field = {}, locale = 'en') {
  const sums = new Map();

  for (const value of values) {
    const {
      amount,
      currency
    } = moneyParts(value, field.currency);
    const decimal = decimalOf(amount, currency ? minorUnits(currency) : null);
    if (decimal === null) continue;
    const key = currency ?? '';
    sums.set(key, addDecimal(sums.get(key) ?? '0', decimal));
  }

  return [...sums].map(([currency, amount]) => ({
    currency: currency || null,
    amount,
    text: formatMoney(currency ? {
      amount,
      currency
    } : amount, {
      currencyDisplay: field.currencyDisplay
    }, locale)
  }));
} // What a person pastes or types, read as a decimal (C294, MP-8). Arabic-Indic
// digits and separators are read as ASCII; the currency's signs and code,
// «%», spaces, apostrophes and direction marks are dropped; a minus may stand
// before or after the digits. With both a point and a comma the last one
// separates the fraction; a separator that repeats groups; a single one is
// the fraction, unless it is the page's group separator followed by exactly
// three digits -- «1,234» on an English page is 1234, on a Russian one 1,234.

const CURRENCY_MARKS = /[$€£¥₽₸₴₺₹₩₪₦₱฿₫¤]/gu;

function signsOf(currency, locale) {
  if (typeof currency !== 'string' || !/^[A-Z]{3}$/u.test(currency)) return [];
  const signs = new Set([currency]);

  for (const display of ['symbol', 'narrowSymbol', 'code', 'name']) {
    try {
      for (const part of new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        currencyDisplay: display
      }).formatToParts(2)) {
        if (part.type === 'currency') signs.add(part.value);
      }
    } catch {// A code Intl does not know keeps its letters only.
    }
  }

  return [...signs].sort((a, b) => b.length - a.length);
}

function separatorsOf(locale) {
  try {
    const parts = new Intl.NumberFormat(locale).formatToParts(1234567.5);
    return {
      group: parts.find(part => part.type === 'group')?.value ?? ',',
      decimal: parts.find(part => part.type === 'decimal')?.value ?? '.'
    };
  } catch {
    return {
      group: ',',
      decimal: '.'
    };
  }
}
/**
 * `{ok: true, value, typedDigits}` for what reads as a number -- the canonical
 * decimal string (no groups, a point, no trailing zeros after it; null for
 * nothing typed) and how many digits were typed after the separator -- or
 * `{ok: false}`. `currency` names the code whose signs may stand in the text.
 */


function readTypedDecimal(text, {
  locale = 'en',
  currency = null
} = {}) {
  if (text === null || text === undefined) return {
    ok: true,
    value: null,
    typedDigits: 0
  };

  if (typeof text === 'number') {
    const read = readDecimal(Number.isInteger(text) ? text : String(text));
    return read.ok ? {
      ok: true,
      value: read.value,
      typedDigits: fractionDigits(read.value ?? '')
    } : {
      ok: false
    };
  }

  let plain = String(text).replace(/[\u0660-\u0669]/gu, digit => String(digit.charCodeAt(0) - 0x660)).replace(/[\u06f0-\u06f9]/gu, digit => String(digit.charCodeAt(0) - 0x6f0)).replace(/\u066b/gu, '.').replace(/\u066c/gu, '');

  for (const sign of signsOf(currency, locale)) plain = plain.split(sign).join('');

  plain = plain.replace(CURRENCY_MARKS, '').replace(/[%\u066a]/gu, '').replace(DIRECTION_MARKS, '').replace(/[\s\u00a0\u202f'\u2019]/gu, '').replace(/[\u2212\u2013]/gu, '-');
  if (plain === '') return {
    ok: true,
    value: null,
    typedDigits: 0
  };
  let negative = false;

  if (plain.startsWith('-')) {
    negative = true;
    plain = plain.slice(1);
  } else if (plain.startsWith('+')) {
    plain = plain.slice(1);
  } else if (plain.endsWith('-')) {
    negative = true;
    plain = plain.slice(0, -1);
  }

  const dots = (plain.match(/\./gu) || []).length;
  const commas = (plain.match(/,/gu) || []).length;

  if (dots && commas) {
    const mark = plain.charAt(Math.max(plain.lastIndexOf('.'), plain.lastIndexOf(',')));
    plain = plain.split(mark === '.' ? ',' : '.').join('');
    if (mark === ',') plain = plain.replace(',', '.');
  } else if (dots + commas > 1) {
    plain = plain.split(dots ? '.' : ',').join('');
  } else if (dots + commas === 1) {
    const mark = dots ? '.' : ',';
    const after = plain.length - plain.indexOf(mark) - 1;
    if (mark === separatorsOf(locale).group && after === 3) plain = plain.replace(mark, '');else plain = plain.replace(',', '.');
  }

  if (!/^\d*(?:\.\d*)?$/u.test(plain) || !/\d/u.test(plain)) return {
    ok: false
  };
  const [whole = '', fraction = ''] = plain.split('.');
  const integer = whole.replace(/^0+(?=\d)/u, '') || '0';
  const digits = fraction.replace(/0+$/u, '');
  const zero = /^0*$/u.test(integer + digits);
  return {
    ok: true,
    value: `${negative && !zero ? '-' : ''}${integer}${digits ? `.${digits}` : ''}`,
    typedDigits: fraction.length
  };
}
/** A decimal at rest in an edit field: the locale's groups and point, at least `minDigits` after it, no sign («1 500,50»). */

function restingDecimal(value, locale = 'en', minDigits = 0) {
  const read = readDecimal(value);
  if (!read.ok || read.value === null) return '';
  const digits = Math.min(20, Math.max(minDigits, fractionDigits(read.value)));
  return unbroken((0,_core_js_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.intlFormatter)('NumberFormat', locale, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  }).format(read.value));
}
/** Every ISO 4217 code the browser knows, for a currency field that names no list; the ten offered codes where Intl cannot list them. */

function currencyCodes(fallback = []) {
  try {
    const codes = Intl.supportedValuesOf?.('currency');
    if (Array.isArray(codes) && codes.length) return codes;
  } catch {// An older engine: the offered list.
  }

  return [...fallback];
} // What the editors of money and percent need (owner decision C291 (2): the two
// types are the Framework's in every mode, the View set's editors were the
// reference): the sign and minor units of a currency, two decimals compared by
// their digits, and a decimal as it is typed back in an input.

/**
 * A currency in a locale: {sign, before, minor} -- the sign the locale writes
 * by the field's `currencyDisplay` (the standard sign by default: «₽», «$»,
 * «CA$»; C294), whether it stands before the amount, and its ISO 4217 minor
 * units (RUB 2, JPY 0, KWD 3). A code Intl does not know keeps its letters,
 * after the amount, with two minor digits.
 */

function currencyOf(code, locale = 'en', display = 'symbol') {
  const fallback = {
    sign: String(code ?? ''),
    before: false,
    minor: 2
  };
  if (typeof code !== 'string' || !/^[A-Z]{3}$/u.test(code)) return fallback;

  try {
    const format = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: code,
      currencyDisplay: CURRENCY_DISPLAYS.includes(display) ? display : 'symbol'
    });
    const parts = format.formatToParts(1);
    const at = parts.findIndex(part => part.type === 'currency');
    if (at === -1) return fallback;
    return {
      sign: parts[at].value,
      before: at < parts.findIndex(part => part.type === 'integer'),
      minor: format.resolvedOptions().maximumFractionDigits ?? 2
    };
  } catch {
    return fallback;
  }
}
/** -1, 0 or 1: two decimals (canonical strings or integers) compared by their digits, never as floats; null when either is not a decimal. */

function compareDecimal(a, b) {
  const left = readDecimal(a);
  const right = readDecimal(b);
  if (!left.ok || !right.ok || left.value === null || right.value === null) return null;
  const scale = Math.max(fractionDigits(left.value), fractionDigits(right.value));

  const units = value => {
    const negative = value.startsWith('-');
    const [whole, fraction = ''] = value.replace('-', '').split('.');
    const digits = BigInt(whole + fraction.padEnd(scale, '0'));
    return negative ? -digits : digits;
  };

  const x = units(left.value);
  const y = units(right.value);
  return x === y ? 0 : x < y ? -1 : 1;
}
/** A decimal as typed back into an input: the locale's point, no groups («1500,5» on a Russian page); '' for nothing or not a decimal. */

function editableDecimal(value, locale = 'en') {
  const read = readDecimal(value);
  if (!read.ok || read.value === null) return '';
  let point = '.';

  try {
    point = (0,_core_js_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.intlFormatter)('NumberFormat', locale, {}).formatToParts(1.5).find(part => part.type === 'decimal')?.value || '.';
  } catch {
    point = '.';
  }

  return read.value.replace('.', point);
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "16fc79105455"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LIST_CONDITIONS: () => (/* binding */ LIST_CONDITIONS),
/* harmony export */   MULTI_CONDITIONS: () => (/* binding */ MULTI_CONDITIONS),
/* harmony export */   NUMBER_CONDITIONS: () => (/* binding */ NUMBER_CONDITIONS),
/* harmony export */   STRING_CONDITIONS: () => (/* binding */ STRING_CONDITIONS),
/* harmony export */   VALUELESS_CONDITIONS: () => (/* binding */ VALUELESS_CONDITIONS),
/* harmony export */   filterActive: () => (/* binding */ filterActive),
/* harmony export */   filterCondition: () => (/* binding */ filterCondition),
/* harmony export */   filterConditionTone: () => (/* binding */ filterConditionTone),
/* harmony export */   filterConditions: () => (/* binding */ filterConditions),
/* harmony export */   filterCount: () => (/* binding */ filterCount),
/* harmony export */   filterKindOf: () => (/* binding */ filterKindOf),
/* harmony export */   filterSummary: () => (/* binding */ filterSummary),
/* harmony export */   filterTypeOf: () => (/* binding */ filterTypeOf),
/* harmony export */   filterValueless: () => (/* binding */ filterValueless),
/* harmony export */   filterWidth: () => (/* binding */ filterWidth)
/* harmony export */ });
// The conditions of a filter field's window, per property type (owner
// decision C310, 2026-11-18; study ui-control control/research/2026-11-18-
// filter-field-choice, the per-property table): which conditions a type has,
// which of them need a value, what the field button shows after applying,
// and how wide the window is. The window's composition (where the condition
// stands, the footer of a single choice) is the shell's and waits for the
// owner's answer on the window without repeats; these are its data.
//
//   choice, user, lookup, record   любой из · ни один из · не задано · задано
//   choices                        любой из · все из · ни один из · не задано · задано
//   boolean                        Да / Нет / Не задано, one choice, no condition line
//   string, text                   содержит · начинается с · не задано · задано
//   number, integer, money         от – до · равно · больше · меньше (money in its currency, C294)
//   date, datetime                 the type's own control (C293's list is the date template's)
//
// A field's filter.conditions, when given, is the list the window offers.
// The stored value stays {operator, value?, values?}: in, all, not_in carry
// values; empty and not_empty carry none.
const LIST_CONDITIONS = Object.freeze(['in', 'not_in', 'empty', 'not_empty']);
const MULTI_CONDITIONS = Object.freeze(['in', 'all', 'not_in', 'empty', 'not_empty']);
const STRING_CONDITIONS = Object.freeze(['contains', 'startsWith', 'empty', 'not_empty']);
const NUMBER_CONDITIONS = Object.freeze(['between', 'eq', 'gt', 'lt']);
const VALUELESS_CONDITIONS = Object.freeze(['empty', 'not_empty']);
const LIST_OPERATORS = new Set(['in', 'all', 'not_in']);
const LIST_TYPES = new Set(['choice', 'user', 'lookup', 'record', 'relation', 'single-select', 'multi-select', 'entity-multi-select', 'entity-single-select', 'file', 'color']);
const WIDE_TYPES = new Set(['user', 'lookup', 'record', 'relation', 'entity-multi-select', 'entity-single-select']);
const STRING_TYPES = new Set(['string', 'text', 'html']);
const NUMBER_TYPES = new Set(['number', 'integer', 'money', 'percent']);
/** The property type a filter is drawn for. */

function filterTypeOf(field = {}) {
  return String(field.filter?.control || field.propertyType || field.type || field.dataType || 'text');
}
/** What kind of window a type has: list, multi (choices), boolean, string, number or own. */

function filterKindOf(field = {}) {
  const type = filterTypeOf(field);
  if (type === 'choices') return 'multi';
  if (type === 'boolean') return 'boolean';
  if (LIST_TYPES.has(type)) return 'list';
  if (STRING_TYPES.has(type)) return 'string';
  if (NUMBER_TYPES.has(type)) return 'number';
  return 'own';
}
/** The conditions the window offers for a field, the field's own list first. */

function filterConditions(field = {}) {
  const own = field.filter?.conditions;
  if (Array.isArray(own) && own.length) return own.map(String);

  switch (filterKindOf(field)) {
    case 'multi':
      return [...MULTI_CONDITIONS];

    case 'list':
      return [...LIST_CONDITIONS];

    case 'string':
      return [...STRING_CONDITIONS];

    case 'number':
      return [...NUMBER_CONDITIONS];

    default:
      return [];
  }
}
/** The condition a value holds, or the field's first. */

function filterCondition(field = {}, value = {}) {
  const conditions = filterConditions(field);
  const asked = value?.operator || field.filter?.defaultCondition || field.filter?.defaultOperator;
  if (asked && (!conditions.length || conditions.includes(asked))) return asked;
  return conditions[0] || asked || '';
} // The colour of a condition (owner decision C314): only an unusual condition
// has one. Excluding (ни один из, не равно, не содержит) is error red,
// presence (не задано, задано) tertiary purple; every other condition is
// the grey of the band (C313) and a grey dot in its menu.

const EXCLUDING_CONDITIONS = new Set(['not_in', 'ne', 'neq', 'not_eq', 'not_contains', 'notContains']);
/** A condition's colour (C314): 'error' for an excluding one, 'tertiary' for presence, '' for the rest (grey). */

function filterConditionTone(operator) {
  if (EXCLUDING_CONDITIONS.has(operator)) return 'error';
  if (VALUELESS_CONDITIONS.includes(operator)) return 'tertiary';
  return '';
}
/** Whether a condition is answered without a value (не задано / задано). */

function filterValueless(operator) {
  return VALUELESS_CONDITIONS.includes(operator);
}

const filled = one => one !== undefined && one !== null && String(one).trim() !== '';
/** Whether the value sets a condition at all (the field button takes its colour). */


function filterActive(field = {}, value = {}) {
  if (!value || typeof value !== 'object') return false;
  const operator = filterCondition(field, value);
  if (filterValueless(operator)) return true;
  if (Array.isArray(value.values)) return value.values.length > 0;
  if (Array.isArray(value.value)) return value.value.some(filled);
  return filled(value.value);
}
/** The number on the field button and in «Применить (N)»: chosen values of a list condition only (C310). */

function filterCount(field = {}, value = {}) {
  const kind = filterKindOf(field);
  if (kind !== 'list' && kind !== 'multi') return 0;
  const operator = filterCondition(field, value);
  if (!LIST_OPERATORS.has(operator)) return 0;
  return Array.isArray(value?.values) ? value.values.length : 0;
}
/** How wide the window is: panel (20rem) or wide (24rem, people and records with a caption). */

function filterWidth(field = {}) {
  const own = field.filter?.width;
  if (own === 'panel' || own === 'wide') return own;
  if (WIDE_TYPES.has(filterTypeOf(field))) return 'wide';
  const options = Array.isArray(field.filter?.options) ? field.filter.options : [];
  return options.some(option => option && option.caption) ? 'wide' : 'panel';
}
/**
 * What the field button says after applying (C300, C310): {active, count,
 * words}. count is shown only for list conditions; any other active
 * condition is the colour alone, its words in the tooltip.
 * label(operator) gives a condition's words; name(value) an option's name.
 */

function filterSummary(field = {}, value = {}, {
  label = one => one,
  name = one => one,
  yes = 'Да',
  no = 'Нет'
} = {}) {
  const active = filterActive(field, value);
  if (!active) return {
    active: false,
    count: 0,
    words: ''
  };
  const operator = filterCondition(field, value);
  const count = filterCount(field, value);
  if (filterValueless(operator)) return {
    active,
    count: 0,
    words: label(operator)
  };
  const kind = filterKindOf(field);

  if (kind === 'boolean') {
    const one = Array.isArray(value.values) ? value.values[0] : value.value;
    return {
      active,
      count: 0,
      words: String(one) === 'true' || one === true ? yes : no
    };
  }

  if (kind === 'list' || kind === 'multi') {
    const names = (value.values || []).map(one => name(String(one))).join(', ');
    return {
      active,
      count,
      words: `${label(operator)}: ${names}`
    };
  }

  const shown = Array.isArray(value.value) ? value.value.filter(filled).join(' – ') : String(value.value);
  return {
    active,
    count: 0,
    words: `${label(operator)} ${shown}`.trim()
  };
}

/***/ },

/***/ "5e0f4b4ddd3f"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   filterOperatorLabel: () => (/* binding */ filterOperatorLabel),
/* harmony export */   filterWindowOpen: () => (/* binding */ filterWindowOpen)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("43090d1c8307");
/* harmony import */ var _core_js_density_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("1412c5875b4d");
/* harmony import */ var _lang_index_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("354525e80715");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_1__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__);
// A filter field's window (Framework order FO-5 of the view set study,
// ui-control control/research/2026-11-17-view-round-1/framework-orders.md):
// the field renderers' filter control of one field in sf-popover, with
// «Применить» and «Сбросить» under it, opened from any control -- a chip, a
// column's heading, a button -- with no table around it. The set's table drew
// this window itself (its chip window), and a page that wanted it without a
// table kept a hidden table only to open it.
//
//   const answer = await SF.fieldRenderers.filterWindow.open({
//     anchor,                  the control it opens from (required)
//     field,                   the Framework field descriptor with its filter
//     value,                   the filter's value now: {value?, values?, operator?}
//     size,                    the step of the controls ('1' or '1/2'), the list's own
//     placement,               sf-popover's (bottom-start)
//   });
//   answer: {action: 'apply', value} -- the value the person set
//           {action: 'reset', value: null} -- the filter taken off
//           null -- closed without either (Escape, a press outside, the anchor again)
//
// The footer is the order of every panel (owner decision C157 (3), C159 (4)):
// the main action first at the start, «Применить», then «Сбросить». The
// window is a non-modal dialog (sf-popover's dialog surface), named by the
// field's label; it takes the focus when it opens and gives it back to the
// anchor when it closes. One window per anchor: opening it again from the
// same anchor while it is open closes it. It holds no state after it closes.
//
// Returns of the component study (ui-control control/research/2026-11-18-
// framework-parts-fo): «Применить (N)» (FO5-1); a bottom sheet on a phone
// (FO5-2); on the body like SF.menu.open, not beside the anchor (FO5-3); the
// reopen guard by the anchor's press, no timer (FO5-4). The check of a value
// row stands at the end of the row (owner decision C308 FO-5, design d03,
// C106 (2)): sf-input-choice's list rows with control-position="end".




const SET_NAME = 'sf-field-renderers';
const SET_TEXT = _lang_index_mjs__WEBPACK_IMPORTED_MODULE_3__["default"]; // The anchor a window was closed from by a press on it: that press's click
// must not open it again (holdReopen).

const CLOSED_BY_ANCHOR = new WeakMap();
const OPEN = new WeakMap();
const OPERATOR_WORDS = {
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
  // The conditions of a list property (owner decision C310, FF-8): любой из,
  // все из, ни один из; and of every type, не задано / задано (C310 replaces
  // C293's «Пусто» / «Не пусто»). operatorIn («В списке») stays in the packs
  // for a host that names it.
  in: 'operatorAnyOf',
  all: 'operatorAllOf',
  not_in: 'operatorNoneOf',
  empty: 'operatorEmpty',
  not_empty: 'operatorFilled'
}; // The window's condition words of a string and a number (C310): содержит,
// начинается с; от – до, равно, больше, меньше -- one lower-case line with
// любой из and не задано. The former capitalised words stay for a table's
// operator field (OPERATOR_WORDS).

const CONDITION_WORDS = {
  string: {
    contains: 'operatorContainsWord',
    startsWith: 'operatorStartsWithWord'
  },
  number: {
    between: 'operatorFromTo',
    eq: 'operatorEqualWord',
    gt: 'operatorMoreWord',
    gte: 'operatorMoreOrEqualWord',
    lt: 'operatorLessWord',
    lte: 'operatorLessOrEqualWord'
  }
};

const word = (key, node) => (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(SET_TEXT, key, node ?? null, SET_NAME);
/** The words of an operator in the page's language; kind (string, number) picks the window's condition words. An operator nobody has a word for is shown as it is stored. */


function filterOperatorLabel(operator, node = null, kind = '') {
  const key = CONDITION_WORDS[kind]?.[operator] ?? OPERATOR_WORDS[operator];
  return key ? word(key, node) : String(operator ?? '');
}

const clone = value => {
  if (!value || typeof value !== 'object') return {};

  try {
    return structuredClone(value);
  } catch {
    return { ...value
    };
  }
}; // The phone (FO5-2): no md breakpoint token on the root, the same reading as
// sf-input-rich's link panel and the other phone sheets (under 600 px).


const onPhone = doc => !doc.defaultView?.getComputedStyle(doc.documentElement).getPropertyValue('--sf-breakpoint-md').trim(); // The window stands where the menu does (FO5-3, as SF.menu.open): on the body,
// or in the open modal dialog the anchor is in (a modal dialog makes the rest
// of the page inert), never inside whatever holds the anchor (a list, a table
// row, a row of buttons). It takes the anchor's density, theme and language.


function mount(surface, anchor) {
  const doc = anchor.ownerDocument;
  (0,_core_js_density_js__WEBPACK_IMPORTED_MODULE_2__.followDensity)(surface, anchor);
  const themed = anchor.closest?.('.theme-dark, .theme-light');

  if (themed && themed !== doc.documentElement && themed !== doc.body) {
    surface.classList.add(themed.classList.contains('theme-dark') ? 'theme-dark' : 'theme-light');
  }

  const lang = anchor.closest?.('[lang]')?.getAttribute('lang');
  if (lang) surface.setAttribute('lang', lang);
  (anchor.closest?.('dialog[open]') || doc.body).append(surface);
} // The reopen guard (FO5-4): a press on the anchor closed its window, and the
// click that follows that press -- or an open its handler asks for later,
// after a fetch -- must not open it again. Held until the next press or key
// (the document hears them first, before the anchor's own handlers); no timer.


function holdReopen(anchor) {
  const doc = anchor.ownerDocument;
  CLOSED_BY_ANCHOR.set(anchor, true);

  const clear = () => {
    CLOSED_BY_ANCHOR.delete(anchor);
    doc.removeEventListener('pointerdown', clear, true);
    doc.removeEventListener('keydown', clear, true);
  };

  doc.addEventListener('pointerdown', clear, true);
  doc.addEventListener('keydown', clear, true);
}

function filterWindowOpen({
  anchor,
  field = {},
  value = {},
  size = '1',
  placement = 'bottom-start',
  width = 'panel',
  count,
  kind = '',
  renderControl,
  footer: withFooter = true
} = {}) {
  if (!anchor?.isConnected || !field?.key) return Promise.resolve(null);
  const open = OPEN.get(anchor);

  if (open) {
    open.close();
    return Promise.resolve(null);
  } // The press on the anchor that closed its window is followed by its click.


  if (CLOSED_BY_ANCHOR.get(anchor)) return Promise.resolve(null);
  const doc = anchor.ownerDocument;
  const sheet = onPhone(doc);
  return new Promise(resolve => {
    let temp = clone(value);
    let answer = null;
    const label = field.label || field.key;
    let frame;
    let body;
    let foot;

    if (sheet) {
      // On a phone (FO5-2, C157 (5)): the same content in a bottom sheet, the
      // field's label its title, the buttons in its pinned footer.
      frame = doc.createElement('sf-drawer');
      frame.setAttribute('placement', 'bottom');
      frame.setAttribute('heading', label);
      frame.setAttribute('data-sf-filter-window', field.key);
      body = doc.createElement('div');
      body.className = 'sf-filter-window flex flex-col'; // The window's list scrolls inside it, under the band and the search
      // (C313): every box down to it may be shorter than its content.

      body.style.minBlockSize = '0';
      frame.append(body);

      if (withFooter) {
        foot = doc.createElement('div');
        foot.setAttribute('slot', 'footer');
        frame.append(foot);
      }
    } else {
      frame = doc.createElement('sf-popover');
      frame.setAttribute('surface-role', 'dialog');
      frame.setAttribute('placement', placement);
      frame.setAttribute('label', label);
      frame.setAttribute('data-sf-filter-window', field.key);
      const surface = doc.createElement('div');
      surface.setAttribute('slot', 'content'); // The window's parts reach its edges (owner decision C313): the
      // condition band, the search's and the list's hairlines; each part
      // keeps its own inset, the footer the panel's.

      surface.className = 'sf-filter-window flex flex-col p-0'; // The window's width (C157, C310): the panel's step, 20rem; 24rem for
      // people and records with a caption.

      surface.setAttribute('data-sf-filter-width', width === 'wide' ? 'wide' : 'panel');
      surface.style.inlineSize = width === 'wide' ? 'var(--sf-popup-form-wide-width)' : 'var(--sf-popup-panel-width)';
      surface.style.maxInlineSize = '100%';
      body = doc.createElement('div');
      body.className = 'sf-filter-window-control flex flex-col';
      body.style.minBlockSize = '0';
      surface.append(body);

      if (withFooter) {
        foot = doc.createElement('div');
        foot.className = 'sf-filter-window-foot p-1/2'; // The footer's hairline across the window, as the band's and the search's.

        foot.style.borderBlockStart = 'var(--sf-px) solid var(--sf-outline-variant)';
        surface.append(foot);
      }

      frame.append(surface);
    }

    const host = {
      size,
      // The single-field window (C308 FO-5): the rows' checks stand at the end.
      filterWindow: true,
      // In a phone's sheet the band reaches the sheet's edges (C313 (1)).
      sheet,
      getFieldText: key => word(key, anchor),
      getFilterControlValue: () => temp,
      patchTempFilterValue: (key, patch) => {
        temp = { ...temp,
          ...patch
        };
        draw();
      },
      getFilterOperatorLabel: operator => filterOperatorLabel(operator, anchor, kind),
      getVisibleFilterOptions: one => Array.isArray(one?.filter?.options) ? one.filter.options : [],
      getFilterOptionsProvider: one => one?.filter?.provider ?? null,
      // A single choice applies on a press, as a menu item (C312 (2)).
      applyTempFilterValue: (key, patch) => {
        temp = { ...temp,
          ...patch
        };
        finish('apply');
      },
      // «Снять условие» (C312 (2)): the filter taken off, as «Сбросить».
      resetFilter: () => finish('reset')
    };

    const finish = action => {
      answer = action === 'apply' ? {
        action,
        value: clone(temp)
      } : {
        action,
        value: null
      };
      close();
    }; // «Применить (N)» (FO5-1, C157 (3)): the number of values chosen when the
    // condition is a list; plain «Применить» otherwise or with none chosen.


    const footSize = sheet ? size : '1/2';

    const applyText = () => {
      const number = typeof count === 'function' ? count(temp) : Array.isArray(temp?.values) ? temp.values.length : 0;
      return number ? `${word('filterApply', anchor)} (${number})` : word('filterApply', anchor);
    };

    function draw() {
      (0,lit__WEBPACK_IMPORTED_MODULE_0__.render)((0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${renderControl(field, host)}`, body);
      if (!foot) return; // The popover's footer buttons are a step below the rows (the accepted
      // study #top3, C313): at size 1 «Применить (N)» and «Сбросить» did not
      // fit a 20rem window side by side and the main one wrapped onto two
      // lines. A phone's sheet is the screen's width and keeps the rows' step,
      // a finger's target.

      (0,lit__WEBPACK_IMPORTED_MODULE_0__.render)((0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-filter-window-footer flex gap-1/3 items-cross-center">
          <sf-button size=${footSize} scheme="primary" text=${applyText()}
                     data-action="apply" @click=${() => finish('apply')}></sf-button>
          <sf-button size=${footSize} appearance="outline" scheme="on-surface" text=${word('filterReset', anchor)}
                     data-action="reset" @click=${() => finish('reset')}></sf-button>
        </div>`, foot);
    }

    const close = () => sheet ? frame.close?.({
      reason: 'api'
    }) : frame.close({
      reason: 'api'
    });

    OPEN.set(anchor, {
      close
    });

    const closed = () => {
      OPEN.delete(anchor); // The sheet gives the focus back to the anchor, as the popover does
      // (the anchor does not name the drawer, so the drawer does not know it).

      if (sheet && anchor.isConnected) {
        const target = anchor.matches?.('button, a[href], input, select, textarea, [tabindex]') ? anchor : anchor.querySelector?.('button, a[href], input, select, textarea, [tabindex]') ?? anchor;
        target.focus?.({
          preventScroll: true
        });
      } // The focus is back on the anchor (sf-popover returnFocus, sf-drawer's
      // opener); the window leaves the page after it.


      queueMicrotask(() => frame.remove());
      resolve(answer);
    };

    if (sheet) {
      frame.addEventListener('sf-drawer-closed', closed, {
        once: true
      });
    } else {
      frame.addEventListener('sf-popover-close', event => {
        if (event.detail?.reason === 'close') holdReopen(anchor);
      });
      frame.addEventListener('sf-popover-closed', closed, {
        once: true
      });
    }

    draw();
    mount(frame, anchor); // The tag is fetched by the Loader when it meets it; the anchor is given
    // once the element is defined (a property set before would hide its
    // accessor), and the window opens on the next frame.

    customElements.whenDefined(sheet ? 'sf-drawer' : 'sf-popover').then(() => {
      if (!sheet) frame.anchor = anchor;
      requestAnimationFrame(() => {
        if (!frame.isConnected) return;
        if (sheet) frame.open?.();else frame.show();
      });
    });
  });
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "01ae054f01b4"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   cleanHtml: () => (/* binding */ cleanHtml),
/* harmony export */   htmlText: () => (/* binding */ htmlText)
/* harmony export */ });
/* harmony import */ var _input_rich_js_rich_text_html_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("4f56033a1eae");
// Formatted text (property-view port 1.17.0, propertyType `html`; Larena,
// 2026-10-30): a value that is an HTML string of sf-input-rich's subset. The
// subset's rule is sf-input-rich's own module, not a second one written here:
// what the editor writes and what a record shows are cleaned by the same
// function, so the two cannot disagree about what a value may hold.
//
// A value is never drawn as it arrives. The host's value may have been stored
// by something other than this editor -- an import, an API, an older site --
// so the view draws only what `cleanHtml` returns, and a table cell draws only
// the text. Both take any value: a string, {value, text} as a host formats a
// scalar, or nothing.


const source = value => {
  const raw = value && typeof value === 'object' && !Array.isArray(value) && 'value' in value ? value.value : value;
  return typeof raw === 'string' ? raw : '';
};
/** The value in the subset: everything else removed, every text escaped; "" when there is no text. */


function cleanHtml(value) {
  const html = source(value);
  return html ? (0,_input_rich_js_rich_text_html_mjs__WEBPACK_IMPORTED_MODULE_0__.sanitizeRichText)(html, {
    mode: 'value'
  }) : '';
}
/** The value's visible text on one line, for a table cell: blocks and line breaks become spaces. */

function htmlText(value) {
  const html = source(value);
  return html ? (0,_input_rich_js_rich_text_html_mjs__WEBPACK_IMPORTED_MODULE_0__.plainText)(html).replace(/\s+/gu, ' ').trim() : '';
}

/***/ },

/***/ "e5483002f3ea"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CONDITION_OPS: () => (/* reexport safe */ _conditions_js__WEBPACK_IMPORTED_MODULE_14__.CONDITION_OPS),
/* harmony export */   DATE_FUTURE_PERIODS: () => (/* reexport safe */ _date_filter_js__WEBPACK_IMPORTED_MODULE_18__.DATE_FUTURE_PERIODS),
/* harmony export */   DATE_PERIODS: () => (/* reexport safe */ _date_filter_js__WEBPACK_IMPORTED_MODULE_18__.DATE_PERIODS),
/* harmony export */   FILTER_RENDERERS: () => (/* binding */ FILTER_RENDERERS),
/* harmony export */   NUMBER_FILTER_OPERATORS: () => (/* reexport safe */ _registry_js__WEBPACK_IMPORTED_MODULE_5__.NUMBER_FILTER_OPERATORS),
/* harmony export */   OWN_ERROR_CONTROLS: () => (/* binding */ OWN_ERROR_CONTROLS),
/* harmony export */   PROPERTY_TYPES: () => (/* reexport safe */ _registry_js__WEBPACK_IMPORTED_MODULE_5__.PROPERTY_TYPES),
/* harmony export */   buildFilterRequest: () => (/* reexport safe */ _date_filter_js__WEBPACK_IMPORTED_MODULE_18__.buildFilterRequest),
/* harmony export */   conditionFields: () => (/* reexport safe */ _conditions_js__WEBPACK_IMPORTED_MODULE_14__.conditionFields),
/* harmony export */   dateFilterChipText: () => (/* reexport safe */ _date_filter_js__WEBPACK_IMPORTED_MODULE_18__.dateFilterChipText),
/* harmony export */   dateFilterConditions: () => (/* reexport safe */ _date_filter_js__WEBPACK_IMPORTED_MODULE_18__.dateFilterConditions),
/* harmony export */   dateTimeAttribute: () => (/* binding */ dateTimeAttribute),
/* harmony export */   evaluateCondition: () => (/* reexport safe */ _conditions_js__WEBPACK_IMPORTED_MODULE_14__.evaluateCondition),
/* harmony export */   fieldConditions: () => (/* reexport safe */ _conditions_js__WEBPACK_IMPORTED_MODULE_14__.fieldConditions),
/* harmony export */   fieldEditable: () => (/* reexport safe */ _conditions_js__WEBPACK_IMPORTED_MODULE_14__.fieldEditable),
/* harmony export */   fieldTemplate: () => (/* binding */ fieldTemplate),
/* harmony export */   filterActive: () => (/* reexport safe */ _filter_conditions_js__WEBPACK_IMPORTED_MODULE_16__.filterActive),
/* harmony export */   filterConditionTone: () => (/* reexport safe */ _filter_conditions_js__WEBPACK_IMPORTED_MODULE_16__.filterConditionTone),
/* harmony export */   filterConditions: () => (/* reexport safe */ _filter_conditions_js__WEBPACK_IMPORTED_MODULE_16__.filterConditions),
/* harmony export */   filterCount: () => (/* reexport safe */ _filter_conditions_js__WEBPACK_IMPORTED_MODULE_16__.filterCount),
/* harmony export */   filterFieldSummary: () => (/* binding */ filterFieldSummary),
/* harmony export */   filterOperatorLabel: () => (/* reexport safe */ _filter_window_js__WEBPACK_IMPORTED_MODULE_15__.filterOperatorLabel),
/* harmony export */   filterRequestContext: () => (/* reexport safe */ _date_filter_js__WEBPACK_IMPORTED_MODULE_18__.filterRequestContext),
/* harmony export */   filterWidth: () => (/* reexport safe */ _filter_conditions_js__WEBPACK_IMPORTED_MODULE_16__.filterWidth),
/* harmony export */   isEmptyFilterEntry: () => (/* reexport safe */ _date_filter_js__WEBPACK_IMPORTED_MODULE_18__.isEmptyFilterEntry),
/* harmony export */   isNumericType: () => (/* binding */ isNumericType),
/* harmony export */   meterStatus: () => (/* binding */ meterStatus),
/* harmony export */   normalizeFilterEntry: () => (/* reexport safe */ _date_filter_js__WEBPACK_IMPORTED_MODULE_18__.normalizeFilterEntry),
/* harmony export */   openFilterWindow: () => (/* binding */ openFilterWindow),
/* harmony export */   propertyModes: () => (/* binding */ propertyModes),
/* harmony export */   renderCellField: () => (/* binding */ renderCellField),
/* harmony export */   renderEditField: () => (/* binding */ renderEditField),
/* harmony export */   renderFilterField: () => (/* binding */ renderFilterField),
/* harmony export */   renderFilterWindowField: () => (/* binding */ renderFilterWindowField),
/* harmony export */   renderTotalField: () => (/* binding */ renderTotalField),
/* harmony export */   renderViewField: () => (/* binding */ renderViewField),
/* harmony export */   resolveDatePeriod: () => (/* reexport safe */ _date_filter_js__WEBPACK_IMPORTED_MODULE_18__.resolveDatePeriod)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var lit_directives_unsafe_html_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("073f05ff1a81");
/* harmony import */ var _helpers_option_badge_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("b30ec5bc0edb");
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("43090d1c8307");
/* harmony import */ var _core_js_format_date_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("e577837dd70a");
/* harmony import */ var _registry_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("fc654eb7fab0");
/* harmony import */ var _text_types_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("f8901823ea4f");
/* harmony import */ var _templates_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("22825a8607d0");
/* harmony import */ var _datetime_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("9ce1a42b2a85");
/* harmony import */ var _mask_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("dd6973f77245");
/* harmony import */ var _html_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("01ae054f01b4");
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("d3818183b14c");
/* harmony import */ var _decimal_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__("ab3947ea3647");
/* harmony import */ var _phone_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__("25be1c2df717");
/* harmony import */ var _conditions_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__("db080b4bfc2b");
/* harmony import */ var _filter_window_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__("5e0f4b4ddd3f");
/* harmony import */ var _filter_conditions_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__("16fc79105455");
/* harmony import */ var _lang_index_mjs__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__("354525e80715");
/* harmony import */ var _date_filter_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__("c11c730f061a");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, lit_directives_unsafe_html_js__WEBPACK_IMPORTED_MODULE_1__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_3__, _core_js_format_date_js__WEBPACK_IMPORTED_MODULE_4__, _templates_js__WEBPACK_IMPORTED_MODULE_7__, _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_11__, _decimal_js__WEBPACK_IMPORTED_MODULE_12__, _filter_window_js__WEBPACK_IMPORTED_MODULE_15__, _date_filter_js__WEBPACK_IMPORTED_MODULE_18__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, lit_directives_unsafe_html_js__WEBPACK_IMPORTED_MODULE_1__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_3__, _core_js_format_date_js__WEBPACK_IMPORTED_MODULE_4__, _templates_js__WEBPACK_IMPORTED_MODULE_7__, _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_11__, _decimal_js__WEBPACK_IMPORTED_MODULE_12__, _filter_window_js__WEBPACK_IMPORTED_MODULE_15__, _date_filter_js__WEBPACK_IMPORTED_MODULE_18__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lit_directives_unsafe_html_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lit_directives_unsafe_html_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_11__);
















 // The set's words and the property types' names live in its language files
// (localization study LC-5), as a Smart component keeps them.


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
// The filter controls take the size of the list they filter: the table's
// size, when it has one. They were written at 1, so a table at the dense
// step 1/2 opened filter fields, buttons and tabs a step larger than itself.

function filterSize(host) {
  const size = String(host?.size || '').trim();
  return size || '1';
}

function renderTextFilterControl(field, host) {
  const value = host.getFilterControlValue(field.key);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-input
                size=${filterSize(host)}
                appearance="filled"
                placeholder="${setText(host, 'containsText')}"
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
} // A phone is searched by what is stored (field orders FO-3): the request gets
// the number as E.164, or the digits of a part of one, however it was typed,
// and the box shows what went -- one form in the view, the row, the edit and
// the filter. The condition is the text filter's (contains by default).
// A full number is sent as E.164 and shown the way view, cell and edit show it;
// a part of a number is sent and shown as its digits.


function phoneFilterShown(sent) {
  return String(sent || '').startsWith('+') ? (0,_phone_js__WEBPACK_IMPORTED_MODULE_13__.formatPhone)(sent) : String(sent || '');
}

function renderPhoneFilterControl(field, host) {
  const value = host.getFilterControlValue(field.key);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-input
                size=${filterSize(host)}
                appearance="filled"
                placeholder="${setText(host, 'containsText')}"
                value="${phoneFilterShown(value.value)}"
                name="sf_filter_${field.key || 'phone'}"
                inputmode="tel"
                @change=${event => {
    const input = event.currentTarget ?? event.target;
    const sent = (0,_phone_js__WEBPACK_IMPORTED_MODULE_13__.phoneSearchText)(input?.value ?? '');
    const shown = phoneFilterShown(sent);
    if (input && input.value !== shown) input.value = shown;
    host.patchTempFilterValue(field.key, {
      value: sent,
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
                <sf-slider-range
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
                ></sf-slider-range>
            </div>
            <sf-dropdown
                    size=${filterSize(host)}
                    appearance="bordered"
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
                            size=${filterSize(host)}
                            text="${host.getFilterOperatorLabel(operator)}"
                            value="${operator}"
                            ?selected=${operator === selectedOperator}
                    ></sf-list-item>
                `)}
            </sf-dropdown>
        </div>
    `;
} // The number filter (owner decision C294, MP-6, MP-7; the same order as the
// date filter): the condition comes first and under it exactly what it needs
// -- one number, two («Между», both ends included) or nothing («Пусто», «Не
// пусто», whose value is true). The nine conditions are the ones AG Grid, MUI
// X and spreadsheets agree on; a field's `filter.operators` may name fewer.
// The value is typed with the decimal keyboard and the sign in the field (a
// fixed currency's sign where the language writes it, «%» after a percent),
// pasted text is read as a person means it («1 234,50 ₽», «$1,234.50») and
// the request carries a decimal string, never the typed text. A money field
// whose currency lives in the value adds a currency choice (q-mp-mix): the
// request carries `currency` and compares amounts within it. A new condition
// of another shape drops the old value.
// The list is the registry's (number, money and percent `conditions`).



const NUMBER_NO_VALUE_OPERATORS = new Set(['empty', 'not-empty']);

const operatorShape = operator => NUMBER_NO_VALUE_OPERATORS.has(operator) ? 'none' : operator === 'between' ? 'two' : 'one';

function numberOperatorLabel(host, operator) {
  return _registry_js__WEBPACK_IMPORTED_MODULE_5__.NUMBER_FILTER_OPERATORS.includes(operator) ? setText(host, `numberOperator_${operator}`) : host.getFilterOperatorLabel(operator);
}

function renderNumberFilterControl(field, host, look = {}) {
  const control = host.getFilterControlValue(field.key) || {};
  const locale = (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageLocale)(host ?? null);
  const operators = field.filter?.operators || _registry_js__WEBPACK_IMPORTED_MODULE_5__.NUMBER_FILTER_OPERATORS;
  const selectedOperator = control.operator || field.filter?.defaultOperator || operators[0];
  const shape = operatorShape(selectedOperator);
  const rawValue = control.value;
  const rangeValue = Array.isArray(rawValue) ? rawValue : [rawValue ?? '', ''];
  const currencies = look.currencies || null;
  const currency = currencies ? currencies.includes(control.currency) ? control.currency : currencies[0] : look.currency || null;
  const sign = look.money && currency ? (0,_decimal_js__WEBPACK_IMPORTED_MODULE_12__.currencyOf)(currency, locale, (0,_decimal_js__WEBPACK_IMPORTED_MODULE_12__.currencyDisplayOf)(field)) : null;
  const textStart = isolatedSign(sign?.before ? sign.sign : '', locale);
  const textEnd = look.percent ? '%' : isolatedSign(sign && !sign.before ? sign.sign : '', locale) || (look.money ? '' : fieldUnit(field));
  const minDigits = look.money && currency ? (0,_decimal_js__WEBPACK_IMPORTED_MODULE_12__.currencyOf)(currency, locale).minor : 0;

  const shown = value => (0,_decimal_js__WEBPACK_IMPORTED_MODULE_12__.restingDecimal)(value, locale, value === '' || value === null || value === undefined ? 0 : minDigits);

  const withCurrency = patch => currencies ? { ...patch,
    currency
  } : patch;

  const patch = next => host.patchTempFilterValue(field.key, withCurrency({
    operator: selectedOperator,
    ...next
  }));

  const typed = (index, event) => {
    const input = event.currentTarget ?? event.target;
    const text = String(input?.value ?? '');
    const read = (0,_decimal_js__WEBPACK_IMPORTED_MODULE_12__.readTypedDecimal)(text, {
      locale,
      currency
    });

    if (input) {
      input.toggleAttribute('invalid', !read.ok);
      if (read.ok) input.removeAttribute('error-message');else input.setAttribute('error-message', setText(host, 'notNumber'));
    }

    if (!read.ok) return;
    const value = read.value ?? '';

    if (shape !== 'two') {
      patch({
        value
      });
      return;
    }

    const next = [...rangeValue];
    next[index] = value;
    patch({
      value: next
    });
  };

  const input = (index, label, value) => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-input
                size=${filterSize(host)}
                appearance="bordered"
                root-class="flex-1 min-w-0"
                label=${label}
                value=${shown(value)}
                inputmode=${look.integer || (0,_templates_js__WEBPACK_IMPORTED_MODULE_7__.resolveField)(field).decimals === 0 ? 'numeric' : 'decimal'}
                text-start=${textStart || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                text-end=${textEnd || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                name="sf_filter_${field.key || 'number'}${index ? '_second' : ''}"
                @change=${event => typed(index, event)}
        ></sf-input>`;

  const valueWord = setText(host, look.money ? 'filterAmount' : look.percent ? 'filterPercent' : 'filterNumber');
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="flex gap-1/3 flex-col">
            <sf-dropdown
                    size=${filterSize(host)}
                    appearance="bordered"
                    mode="select"
                    label=${setText(host, 'condition')}
                    placeholder=${setText(host, 'condition')}
                    root-class="flex-1"
                    search="false"
                    data-sf-filter-part="operator"
                    @change=${event => {
    if (event.target !== event.currentTarget) return;
    const operator = event.detail?.values?.[0] || event.detail?.value || selectedOperator;
    if (operator === selectedOperator) return;
    const next = operatorShape(operator); // A new condition of another shape drops the old value:
    // one amount and two amounts are not the same question.

    const value = next === 'none' ? true : next === shape ? rawValue : next === 'two' ? ['', ''] : '';
    host.patchTempFilterValue(field.key, withCurrency({
      operator,
      value
    }));
  }}
            >
                ${operators.map(operator => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                    <sf-list-item
                            kind="text"
                            size=${filterSize(host)}
                            text="${numberOperatorLabel(host, operator)}"
                            value="${operator}"
                            ?selected=${operator === selectedOperator}
                    ></sf-list-item>
                `)}
            </sf-dropdown>
            ${shape === 'none' ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : shape === 'two' ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                <div class="sf-filter-operator-inputs flex gap-1/3 items-cross-start">
                    ${input(0, setText(host, 'rangeFrom'), rangeValue[0])}
                    ${input(1, setText(host, 'rangeTo'), rangeValue[1])}
                </div>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                <div class="sf-filter-operator-inputs flex gap-1/3 items-cross-start">
                    ${input(0, valueWord, Array.isArray(rawValue) ? rawValue[0] : rawValue)}
                </div>`}
            ${currencies && shape !== 'none' ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                <sf-dropdown
                        size=${filterSize(host)}
                        appearance="bordered"
                        mode="select"
                        label=${setText(host, 'currency')}
                        root-class="flex-1"
                        search=${currencies.length > 12 ? 'true' : 'false'}
                        data-sf-filter-part="currency"
                        .options=${currencies.map(code => ({
    type: 'text',
    size: filterSize(host),
    value: code,
    text: code,
    selected: code === currency
  }))}
                        @change=${event => {
    if (event.target !== event.currentTarget) return;
    const code = event.detail?.values?.[0] || event.detail?.value;
    if (!code || code === currency) return;
    host.patchTempFilterValue(field.key, {
      operator: selectedOperator,
      value: rawValue,
      currency: code
    });
  }}
                ></sf-dropdown>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        </div>
    `;
}

function renderIntegerFilterControl(field, host) {
  return renderNumberFilterControl(field, host, {
    integer: true
  });
} // Money and percent are filtered as numbers with their own sign in the field
// (owner decisions C291 (2), C294): «%» after a percent, a fixed currency's
// sign where the locale writes it. A money field whose currency lives in the
// value chooses the currency in the filter, from the field's `currencies`.


function renderMoneyFilterControl(field, host) {
  const fixed = fixedCurrency(field);
  return renderNumberFilterControl(field, host, {
    money: true,
    currency: fixed,
    currencies: fixed ? null : fieldCurrencies(field)
  });
}

function renderPercentFilterControl(field, host) {
  return renderNumberFilterControl(field, host, {
    percent: true
  });
} // The date filter (owner decision C293, 2026-11-17; it replaces the operator
// words and quick ranges of PD-6/PD-7). A condition first, then exactly what it
// needs: nothing (a period by name, «Пусто», «Не пусто»), one day, two days (a
// range calendar whose quick ranges are the whole periods; pressing one makes
// the condition that period by name), a number of days, or -- for a period
// field -- «when»: a period by name or two days of one's own. The list is
// grouped: Дата, Период, Заполнено (a period field: Период записи,
// Заполнено). Choosing a condition writes its own starting value, so a stale
// day never travels with a period (DF-2); a period, «Пусто» and «Не пусто»
// carry a value of their own, so the table keeps them (DF-1). The rules and
// the words are date-filter.js; this draws them. The day controls keep PD-4,
// PD-5 and PD-8: the table's size, the page's language, the condition above.


function dateFilterPresets(field) {
  const presets = field.filter?.presets;

  if (presets === undefined || presets === null) {
    return [..._date_filter_js__WEBPACK_IMPORTED_MODULE_18__.DATE_PERIODS, ...(field.filter?.future === true ? _date_filter_js__WEBPACK_IMPORTED_MODULE_18__.DATE_FUTURE_PERIODS : [])].join(',');
  }

  return Array.isArray(presets) ? presets : String(presets);
}

function defaultDateCondition(field, list) {
  const asked = field.filter?.defaultOperator;

  if (asked) {
    const one = (0,_date_filter_js__WEBPACK_IMPORTED_MODULE_18__.dateConditionOf)(field, {
      operator: asked,
      value: _date_filter_js__WEBPACK_IMPORTED_MODULE_18__.LEGACY_DATE_OPERATORS[asked] || asked
    });
    const named = list.find(item => item.key === asked);
    if (named || one) return named || one;
  } // One date: «Между» (the list's second, after the exact day); a period
  // field: «Идёт в».


  return list.find(item => item.operator === ((0,_date_filter_js__WEBPACK_IMPORTED_MODULE_18__.dateFilterKind)(field) === 'period' ? 'overlaps' : 'between')) ?? list[0];
}

function dateFilterContext(host) {
  return (0,_date_filter_js__WEBPACK_IMPORTED_MODULE_18__.filterRequestContext)(host ?? null, host?.getFilterContext?.() || {});
}

function renderDateFilterControl(field, host) {
  const control = host.getFilterControlValue(field.key) || {};
  const list = (0,_date_filter_js__WEBPACK_IMPORTED_MODULE_18__.dateFilterConditions)(field);
  const asked = control.operator ? (0,_date_filter_js__WEBPACK_IMPORTED_MODULE_18__.dateConditionOf)(field, control) : null;
  const current = asked ?? defaultDateCondition(field, list);
  const value = asked ? (0,_date_filter_js__WEBPACK_IMPORTED_MODULE_18__.normalizeFilterEntry)(control).value : control.value;
  const size = filterSize(host);

  const patch = next => host.patchTempFilterValue(field.key, next);

  const isDateTime = (field.propertyType || field.type) === 'datetime';
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="flex flex-col gap-1/3">
            <sf-dropdown
                    size=${size}
                    appearance="bordered"
                    mode="select"
                    label="${setText(host, 'dateCondition')}"
                    .value=${current.key}
                    hint=${isDateTime ? setWord(host, 'dateByDayIn', {
    zone: dateFilterContext(host).timeZone
  }) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    root-class="flex-1"
                    search="false"
                    @change=${event => {
    const key = event.detail?.values?.[0] || event.detail?.value || current.key;
    const next = list.find(item => item.key === key); // The condition shown before any is chosen is the default;
    // choosing it writes it, with its own starting value.

    if (!next || asked && next.key === current.key) return;
    patch({
      operator: next.operator,
      value: (0,_date_filter_js__WEBPACK_IMPORTED_MODULE_18__.dateConditionValue)(next, {
        value
      })
    });
  }}
            >
                ${list.map(item => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                    <sf-list-item
                            kind="text"
                            size=${size}
                            group=${(0,_date_filter_js__WEBPACK_IMPORTED_MODULE_18__.dateGroupLabel)(host, item.group)}
                            text="${(0,_date_filter_js__WEBPACK_IMPORTED_MODULE_18__.dateConditionLabel)(host, item)}"
                            value="${item.key}"
                            ?selected=${item.key === current.key}
                    ></sf-list-item>
                `)}
            </sf-dropdown>
            ${renderDateConditionValue(field, host, current, value, patch)}
        </div>
    `;
}

function renderDateConditionValue(field, host, current, value, patch) {
  const size = filterSize(host);
  const name = `sf_filter_${field.key || 'date'}`;
  if (current.need === 'none') return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;

  if (current.need === 'count') {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
            <sf-input-quantity
                    size=${size}
                    label="${setText(host, current.operator === 'next-days' ? 'dateCountNext' : 'dateCountLast')}"
                    min="1"
                    max="366"
                    unit="${setText(host, 'dateCountUnit')}"
                    name="${name}_count"
                    .value=${Number(value) > 0 ? Number(value) : 30}
                    @change=${event => {
      if (event.target !== event.currentTarget) return;
      const count = Math.round(Number(event.detail?.value));
      patch({
        operator: current.operator,
        value: count > 0 ? count : null
      });
    }}
            ></sf-input-quantity>`;
  }

  if (current.need === 'day') {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
            <sf-input-date
                    size=${size}
                    label="${setText(host, current.operator === 'contains' ? 'dateValueDay' : 'dateValueDate')}"
                    .value=${typeof value === 'string' ? value.slice(0, 10) : ''}
                    name="${name}"
                    @change=${event => {
      if (event.target !== event.currentTarget) return;
      patch({
        operator: current.operator,
        value: event.detail?.value || null
      });
    }}
            ></sf-input-date>`;
  }

  if (current.need === 'days') return renderDateRangeValue(field, host, current, value, patch);
  if (current.need === 'time' || current.need === 'times') return renderTimeConditionValue(field, host, current, value, patch); // «when» (a period field): a period by name, or two days of one's own.

  const own = Array.isArray(value);
  const periods = [..._date_filter_js__WEBPACK_IMPORTED_MODULE_18__.DATE_PERIODS, ...(field.filter?.future === true ? _date_filter_js__WEBPACK_IMPORTED_MODULE_18__.DATE_FUTURE_PERIODS : [])];
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-dropdown
                size=${size}
                appearance="bordered"
                mode="select"
                label="${setText(host, 'dateWhen')}"
                .value=${own ? 'own' : typeof value === 'string' ? value : ''}
                root-class="flex-1"
                search="false"
                @change=${event => {
    const key = event.detail?.values?.[0] || event.detail?.value;
    if (!key) return;

    if (key === 'own') {
      if (!own) patch({
        operator: current.operator,
        value: ['', '']
      });
      return;
    }

    if (key !== value) patch({
      operator: current.operator,
      value: key
    });
  }}
        >
            ${periods.map(period => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                <sf-list-item kind="text" size=${size} text="${(0,_date_filter_js__WEBPACK_IMPORTED_MODULE_18__.dateConditionLabel)(host, {
    period
  })}" value="${period}"
                        ?selected=${!own && value === period}></sf-list-item>
            `)}
            <sf-list-item kind="text" size=${size} text="${setText(host, 'dateOwnDays')}" value="own" ?selected=${own}></sf-list-item>
        </sf-dropdown>
        ${own ? renderDateRangeValue(field, host, current, value, patch) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}`;
} // A time of day's condition (catalogue step 4): one time, or two side by side
// for «Между» (from, to; both ends in), typed as the edit types one -- the
// time row of sf-input-date. A half-typed time writes nothing.


function renderTimeConditionValue(field, host, current, value, patch) {
  const size = filterSize(host);
  const name = `sf_filter_${field.key || 'time'}`;
  const two = current.need === 'times';
  const times = two ? Array.isArray(value) ? [String(value[0] ?? ''), String(value[1] ?? '')] : ['', ''] : [typeof value === 'string' ? value : ''];

  const control = (index, label) => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-input-date
                mode="time"
                size=${size}
                root-class=${two ? 'flex-1 min-w-0' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                label="${label}"
                .value=${(0,_datetime_js__WEBPACK_IMPORTED_MODULE_8__.splitTime)(times[index]).time}
                minute-step=${minuteStepOf(field) || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                name="${name}${index ? '_second' : ''}"
                @change=${event => {
    if (event.target !== event.currentTarget) return;
    const time = (0,_datetime_js__WEBPACK_IMPORTED_MODULE_8__.normalizeTime)(String(event.detail?.value ?? ''));
    if (time === null) return;

    if (!two) {
      patch({
        operator: current.operator,
        value: time || null
      });
      return;
    }

    const next = [...times];
    next[index] = time;
    patch({
      operator: current.operator,
      value: next
    });
  }}
        ></sf-input-date>`;

  if (!two) return control(0, setText(host, 'timeValue'));
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-filter-operator-inputs flex gap-1/3 items-cross-start">
            ${control(0, setText(host, 'rangeFrom'))}
            ${control(1, setText(host, 'rangeTo'))}
        </div>`;
} // Two days on a range calendar. Its quick ranges are the whole periods: one
// pressed is the period by name -- in «Между» the condition becomes that
// period (C293 (4)), in a period field's «when» the value is its name.


function renderDateRangeValue(field, host, current, value, patch) {
  const days = Array.isArray(value) ? value.map(day => typeof day === 'string' ? day.slice(0, 10) : '') : ['', ''];
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-input-date
                size=${filterSize(host)}
                range
                label="${setText(host, 'dateValuePeriod')}"
                .value=${days}
                .presets=${dateFilterPresets(field)}
                name="sf_filter_${field.key || 'date'}"
                @change=${event => {
    if (event.target !== event.currentTarget) return;
    const preset = event.detail?.preset?.id;

    if (preset && (_date_filter_js__WEBPACK_IMPORTED_MODULE_18__.DATE_PERIODS.includes(preset) || _date_filter_js__WEBPACK_IMPORTED_MODULE_18__.DATE_FUTURE_PERIODS.includes(preset))) {
      patch(current.operator === 'between' ? {
        operator: 'period',
        value: preset
      } : {
        operator: current.operator,
        value: preset
      });
      return;
    }

    const next = Array.isArray(event.detail?.value) ? event.detail.value : [event.detail?.startValue || '', event.detail?.endValue || ''];
    patch({
      operator: current.operator,
      value: next
    });
  }}
        ></sf-input-date>`;
} // An option of a filter as sf-input-choice draws it (FO-4): its picture
// (avatar, or the former imageUrl and avatarText), its icon and its colour
// (color, or the former scheme) are the option's data and drawn wherever it
// is (FO4-1); how the colour is drawn is the field template's parameter
// (optionLookOf). filter.optionRenderer is the former way of saying it, read
// until 2027-01-01 (FO4-2): avatar-checkbox the picture from the initials of
// the name when none is given, swatch a circle, badge a badge.


function choiceOption(field, option = {}) {
  const value = option.value ?? option.id ?? option.key ?? option.label ?? option.title;
  const label = option.label || option.title || String(value ?? '');
  const look = field.filter?.optionRenderer;
  const item = {
    value: String(value ?? ''),
    label,
    caption: option.caption || '',
    disabled: option.disabled === true
  };
  const avatar = typeof option.avatar === 'string' ? {
    image: option.avatar
  } : option.avatar;
  const image = avatar?.image || avatar?.src || option.imageUrl || '';
  const initials = avatar?.text || option.avatarText || '';
  if (image || initials || look === 'avatar-checkbox') item.avatar = {
    image,
    text: initials || label
  };
  if (option.icon) item.icon = String(option.icon);
  const color = option.color ?? option.scheme ?? '';
  if (color) item.color = String(color);
  return item;
} // How a choice field's option colours are drawn (FO4-2; C302: the look is the
// template's parameter): templateParams.badge true a badge, false a circle;
// else the former filter.optionRenderer (swatch a circle, badge a badge);
// else '' -- sf-input-choice's own default, the tonal label (owner decision
// C308 FO-4).


function optionLookOf(field) {
  const badge = field.templateParams?.badge ?? field.template?.params?.badge;
  if (badge === true) return 'badge';
  if (badge === false) return 'dot';
  const look = field.filter?.optionRenderer;
  if (look === 'swatch') return 'dot';
  if (look === 'badge') return 'badge';
  return '';
} // A filter of a list of options is the Framework's choice field (FO-4):
// sf-input-choice, appearance list, the checks of several values, with the
// options' visuals, its own search (filter.searchable) and the host's pages
// (filter.provider, or host.getFilterOptionsProvider(field): async (query,
// {cursor, limit, signal}) answering {items, nextCursor?}). A host that still
// draws its own option rows (renderFilterOption) gets the 1.13 controls.


function renderChoiceFilterControl(field, host) {
  const value = host.getFilterControlValue(field.key) || {};
  const options = (Array.isArray(field.filter?.options) ? field.filter.options : host.getVisibleFilterOptions?.(field) ?? []).map(option => choiceOption(field, option));
  const given = field.filter?.provider ?? host.getFilterOptionsProvider?.(field);
  const provider = typeof given === 'function' ? (query, request) => Promise.resolve(given(query, request)).then(answer => ({ ...answer,
    items: (Array.isArray(answer?.items) ? answer.items : []).map(option => choiceOption(field, option))
  })) : null; // One wrapper per provider, so the field asks again only when the host's
  // provider changes.

  const pages = provider ? choiceProvider(given, provider) : null;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-input-choice
                appearance="list"
                flow="column"
                multiple
                aria-label=${field.label || field.key || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ?searchable=${choiceSearchable(field, host, options, pages)}
                option-look=${optionLookOf(field) || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                control-position=${host.filterWindow === true ? 'end' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ?panel=${host.filterWindow === true}
                .items=${options}
                .provider=${pages}
                .value=${Array.isArray(value.values) ? value.values.map(String) : []}
                @change=${event => {
    host.patchTempFilterValue(field.key, {
      values: Array.isArray(event.detail?.values) ? [...event.detail.values] : [],
      operator: value.operator || field.filter?.defaultOperator || 'in'
    });
  }}
        ></sf-input-choice>
    `;
} // Whether the choice filter shows its search: when the field asks for it;
// in the single-field filter window also from ten options or with the host's
// pages, which search on the server (filter field study, decided: «search
// from 10»), unless the field says searchable false.
// filter.search (C310): 'off' none; 'local' over the options; 'server' the
// host's pages search; 'auto' (the default in the window) from ten options,
// or with the host's pages.


function choiceSearchable(field, host, options, pages) {
  const asked = field.filter?.searchable;
  const mode = field.filter?.search;
  if (mode === 'off' || asked === false) return false;
  if (asked === true || mode === 'local' || mode === 'server') return true;
  if (host.filterWindow !== true) return false;
  return Boolean(pages) || options.length >= 10;
}

const CHOICE_PROVIDERS = new WeakMap();

function choiceProvider(given, wrapped) {
  if (!CHOICE_PROVIDERS.has(given)) CHOICE_PROVIDERS.set(given, wrapped);
  return CHOICE_PROVIDERS.get(given);
}

function renderMultiSelectFilterControl(field, host) {
  if (typeof host?.renderFilterOption !== 'function') return renderChoiceFilterControl(field, host);
  const endpointPage = host.getEndpointFilterPage(field);
  const options = host.getVisibleFilterOptions(field);
  const value = host.getFilterControlValue(field.key);
  const search = host.getFilterOptionSearch(field.key);
  const selected = new Set(value.values || []); // A list of options scrolls down, never sideways: a checkbox's ring a pixel
  // or two past the edge drew a horizontal bar under the list (owner,
  // 2026-10-15).

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="flex flex-col gap-1/2 overflow-x-hidden">
            ${field.filter?.searchable && (!endpointPage || endpointPage.searchable) ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                <sf-input
                        size=${filterSize(host)}
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
            <div class="flex flex-col gap-1/2 overflow-x-hidden" data-size="4.5">
                ${options.map(option => host.renderFilterOption(field, option, selected))}
            </div>
            ${!options.length && endpointPage?.status !== 'loading' && endpointPage?.status !== 'error' ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                <!-- A list with nothing in it says why, in one line, as every
                     list does (simai.interaction-rules, five states). -->
                <sf-empty-state layout="inline" size="1/2" kind=${search ? 'nothing-found' : 'no-data'}></sf-empty-state>` : ''}
            ${endpointPage ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                <div role="status" aria-live="polite" class="sf-text-1">
                    ${endpointPage.status === 'loading' ? setText(host, 'loadingOptions') : ''}
                </div>
                ${endpointPage.status === 'error' ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-empty-state layout="inline" size="1/2" kind="error" text=${setText(host, 'optionsError')}
                    @sf-empty-state-action=${event => {
    if (event.detail?.id === 'retry') host.loadEndpointFilterPage(field, null, search);
  }}></sf-empty-state>` : ''}
                ${endpointPage.nextCursor && endpointPage.status !== 'error' ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button appearance="outline" size=${filterSize(host)} text="${setText(host, 'loadMore')}"
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
// A file is filtered by its kind, a colour by the field's palette (owner,
// 2026-10-15): both fell back to a text search. The filter's values are the
// kinds -- image, document, archive, other -- or the colours, with the
// operator «in»; what a kind holds is the host's to say.


function renderFileFilterControl(field, host) {
  const options = field.filter?.options ?? ['image', 'document', 'archive', 'other'].map(kind => ({
    value: kind,
    label: setText(host, `fileKind_${kind}`)
  }));
  return renderMultiSelectFilterControl({ ...field,
    filter: { ...(field.filter || {}),
      options,
      defaultOperator: field.filter?.defaultOperator ?? 'in'
    }
  }, host);
}

function renderColorFilterControl(field, host) {
  const palette = field.filter?.options ?? (Array.isArray(field.swatches) ? field.swatches : []).map(swatch => typeof swatch === 'string' ? {
    value: swatch,
    label: swatch
  } : swatch).filter(swatch => swatch?.value).map(swatch => ({
    value: swatch.value,
    label: swatch.label ?? swatch.value,
    color: swatch.value
  })); // No palette, nothing to choose from: the value is searched as text.

  if (!palette.length) return renderTextFilterControl(field, host);
  return renderMultiSelectFilterControl({ ...field,
    filter: { ...(field.filter || {}),
      options: palette,
      optionRenderer: field.filter?.optionRenderer ?? 'swatch',
      defaultOperator: field.filter?.defaultOperator ?? 'in'
    }
  }, host);
}

const FILTER_RENDERERS = {
  text: renderTextFilterControl,
  string: renderTextFilterControl,
  number: renderNumberFilterControl,
  integer: renderIntegerFilterControl,
  date: renderDateFilterControl,
  datetime: renderDateFilterControl,
  // A time of day has its own conditions (catalogue step 4), drawn by the
  // date filter: equals, between, earlier, later, empty, not empty.
  time: renderDateFilterControl,
  range: renderRangeFilterControl,
  'date-range': renderDateFilterControl,
  // A period field (a start and an end, C293): its own conditions -- overlaps,
  // within, starts, ends, contains a day.
  period: renderDateFilterControl,
  'multi-select': renderMultiSelectFilterControl,
  'single-select': renderMultiSelectFilterControl,
  choice: renderMultiSelectFilterControl,
  choices: renderMultiSelectFilterControl,
  boolean: renderMultiSelectFilterControl,
  // phone: its stored form, E.164 or the digits of a part (C302, FO-3);
  // password: set or not set.
  phone: renderPhoneFilterControl,
  password: renderPasswordFilterControl,
  // url, link (its text and its address) and ru.inn are searched as text
  // (catalogue step 3).
  url: renderTextFilterControl,
  link: renderTextFilterControl,
  'ru.inn': renderTextFilterControl,
  user: renderMultiSelectFilterControl,
  'entity-multi-select': renderEntityMultiSelectFilterControl,
  'entity-single-select': renderEntityMultiSelectFilterControl,
  record: renderEntityMultiSelectFilterControl,
  relation: renderEntityMultiSelectFilterControl,
  lookup: renderEntityMultiSelectFilterControl,
  file: renderFileFilterControl,
  color: renderColorFilterControl,
  // A money amount and a percent are filtered as decimals with their sign
  // (C291 (2)); an items field, which the View set draws, by its number of
  // rows (property-view port 1.18.0).
  money: renderMoneyFilterControl,
  percent: renderPercentFilterControl,
  items: renderIntegerFilterControl
}; // What a field asks to be filtered by: its own declared control if it has one,
// otherwise its property type, otherwise text.
// The date filter's rules for a host that builds the request or draws the
// chips itself (sf-view-table): the same functions as SF.fieldRenderers.dateFilter.


function renderFilterField(field = {}, host) {
  const asked = field.filter?.control || (0,_templates_js__WEBPACK_IMPORTED_MODULE_7__.resolveField)(field).type || 'text';
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
//   lookup              {value, label}, or a list of them when multiple; the
//                       labels on one line
//   file                {value, label, mime?, href?} -- an icon from the mime
//                       type and the label, a link when it may be opened
//   choices             a list of option values; one tag per value on the line
//   html                an HTML string of sf-input-rich's subset; its text, on one line
//
// Every element here takes `line`, not `size`: a line element is the row's text
// line, where a control height would make the row grow. That was measured --
// with size-1/2 components a default row went from 57 to 61 on desktop and 45 to
// 51 on mobile.

const CELL_LINE = '1/2'; // A choice badge in a cell is tonal (sf-badge's default since 1.6.0, C140; it
// was main, so the cells shipped filled and the consumer's owner asked for the
// calmer one) -- and a table row is the place for it: a column of
// filled badges reads as a column of buttons. A field may still ask for another
// of the three, which is the same arrangement as the boolean's words: the set
// carries a sensible default, not a decision nobody can change.
//
// It composes with colour rather than replacing it. A scheme name reaches the
// scheme's tonal badge; a hue or a hex colour writes the public
// --sf-badge-background-color as the nearest palette hue's fill step (BG-7,
// C140 (2)) and its own text colour, so the tint survives the appearance
// untouched. Both are measured on the built bytes.

const CELL_BADGE_APPEARANCE = 'tonal'; // The template parameter badge (C302; badgeAppearance before it): tonal or
// outline. main is the attention count's alone (C140 (4)): sf-badge draws it
// tonal on any colour but error, so a value badge reads main as tonal here
// and never asks the badge for it (FW-1).

const VALUE_BADGE_APPEARANCES = new Set(['tonal', 'outline']);

function badgeAppearanceOf(field) {
  const asked = String((0,_templates_js__WEBPACK_IMPORTED_MODULE_7__.templateParam)(field, 'badge') ?? '');
  return VALUE_BADGE_APPEARANCES.has(asked) ? asked : CELL_BADGE_APPEARANCE;
} // A file cell is a reference link with an icon chosen from the mime type: the
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
        <sf-input-color size="1/2" appearance="plain" value=${String(hex)}
                  aria-label=${field.label || field.key || ''} readonly></sf-input-color>
    `;
} // Reads what port 1.8.0 declares: `inherited` says a value comes from somewhere
// else, `inheritedValue` says what it is. A view that drew the inherited colour as
// the value would make «not set» and «set to the same colour» look identical, and
// only the first follows the theme when the theme moves. The view and the cell
// draw the field read-only (sf-input-color 1.17.0): the value in the text's ink;
// disabled drew it in the disabled ink, as a field nobody may use.


function renderColorView(field, value) {
  const hex = scalarValue(value);
  const inherited = field.inheritedValue ?? '';
  if (!hex && !inherited) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-input-color
                size="1"
                appearance="plain"
                value=${hex ? String(hex) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                inherited-value=${inherited ? String(inherited) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                aria-label=${field.label || field.key || ''}
                readonly
        ></sf-input-color>
    `;
}

function renderColorEdit(field, value, host) {
  const hex = scalarValue(value);
  const inherited = field.inheritedValue ?? '';
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-input-color
                size=${EDIT_SIZE}
                appearance="bordered"
                name=${fieldName(field)}
                value=${hex ? String(hex) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                inherited-value=${inherited ? String(inherited) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                swatches=${(0,_templates_js__WEBPACK_IMPORTED_MODULE_7__.templateParam)(field, 'swatches') ? String((0,_templates_js__WEBPACK_IMPORTED_MODULE_7__.templateParam)(field, 'swatches')) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ?clearable=${Boolean(inherited) || field.required !== true}
                ?readonly=${field.readonly === true}
                aria-label=${field.label || field.key || ''}
                @change=${event => host.setFieldValue(field, event.detail?.value ?? '')}
        ></sf-input-color>
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
  if (templateOf(field) === 'badges') return renderChoicesBadgesCell(field, value);
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
    const badge = option ? (0,_helpers_option_badge_js__WEBPACK_IMPORTED_MODULE_2__.optionBadgeProps)(option) : null;
    const text = item && typeof item === 'object' && item.text !== undefined ? String(item.text) : String(option?.label ?? option?.text ?? key);
    return {
      component: {
        type: 'badge',
        props: {
          line: CELL_LINE,
          text,
          appearance: badgeAppearanceOf(field),
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
  // A string is its own text in a row -- except a password, which is never
  // shown anywhere: a row says whether one is set.
  string: renderStringCell,
  phone: renderPhoneCell,
  password: renderPasswordCell,
  url: renderUrlCell,
  link: renderLinkCell,
  'ru.inn': renderInnCell,
  // A date in a row used to be whatever the host had stored, printed --
  // «2026-09-25T07:12:00+03:00» beside the same value reading «25 сентября
  // 2026» in the record panel, with no way for a consumer to change the
  // first. These two ask the host and fall through to the stored value when
  // it has nothing to say.
  date: renderDateCell,
  datetime: renderDateCell,
  time: renderHostFormattedCell,
  boolean: renderBooleanCell,
  choices: renderChoicesCell,
  file: renderFileCell,
  color: renderColorCell,
  include: renderIncludeCell,
  choice: renderChoiceCell,
  number: renderNumericCell,
  user: renderUserCell,
  record: renderReferenceCell,
  relation: renderReferenceCell,
  lookup: renderLookupCell,
  html: renderHtmlCell,
  money: renderMoneyCell,
  percent: renderPercentCell,
  items: renderItemsCell
}; // A consumer found this on their stand: the words were written into the set, so
// an English admin saw «Да». The set must not decide what a value is called in
// anyone's language. They come from the field, which is where the rest of the
// Framework keeps its text -- sf-view-table declares fourteen such inputs -- and the
// Russian stays only as the fallback, so nothing already published changes.
// The field's own words win, as they must: what «true» is called belongs to
// whoever owns the interface. The fallback used to be Russian whatever the page
// was -- an English admin saw «Да» -- so it follows the page's language now.

function booleanWords(field, host) {
  return {
    yes: (0,_templates_js__WEBPACK_IMPORTED_MODULE_7__.templateParam)(field, 'trueText') ?? field.labels?.true ?? setText(host, 'yes'),
    no: (0,_templates_js__WEBPACK_IMPORTED_MODULE_7__.templateParam)(field, 'falseText') ?? field.labels?.false ?? setText(host, 'no')
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
  const badge = (0,_helpers_option_badge_js__WEBPACK_IMPORTED_MODULE_2__.optionBadgeProps)(option);
  return {
    component: {
      type: 'badge',
      props: {
        line: CELL_LINE,
        text: option.label ?? option.text ?? String(value),
        appearance: badgeAppearanceOf(field),
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
} // The types a component set draws (property-view port 1.18.0) have their
// cells here, so a table shows them wherever the set's editors live. A host's
// formatFieldValue wins, as for a date; otherwise the page's language:
//
//   money     {amount, currency} or a bare amount under a fixed `currency`;
//             «1 500,50 ₽», every digit the amount has and at least the
//             currency's minor units, formatted from the digits, never a float
//   percent   a decimal string of the percent, «12,5 %»
//   items     a list of rows; how many, «3 строки»
//
// A value that is not one of these shapes falls through to the plain value.


function renderMoneyCell(field, value, host) {
  const formatted = renderHostFormattedCell(field, value, host);
  if (formatted !== null) return formatted;
  const text = (0,_decimal_js__WEBPACK_IMPORTED_MODULE_12__.formatMoney)(scalarValue(value), field, (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageLocale)(host ?? null));
  return text || null;
}

function renderPercentCell(field, value, host) {
  const level = levelCell(field, value);
  if (level) return level;
  const formatted = renderHostFormattedCell(field, value, host);
  if (formatted !== null) return formatted;
  const text = (0,_decimal_js__WEBPACK_IMPORTED_MODULE_12__.formatPercent)(scalarValue(value), (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageLocale)(host ?? null));
  return text || null;
}

function renderItemsCell(field, value, host) {
  const formatted = renderHostFormattedCell(field, value, host);
  if (formatted !== null) return formatted;
  if (!Array.isArray(value)) return null;
  return value.length ? (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageWord)(SET_TEXT, 'rowCount', host ?? null, {
    component: SET_NAME,
    count: value.length
  }) : '';
} // A date in a row reads as it does in the record panel: the host's text, else
// the page's reading of the day (simai/ui-source#34); null for a value that is
// not a date, which the table prints as it came.


function renderDateCell(field, value, host) {
  const formatted = renderHostFormattedCell(field, value, host);
  if (formatted !== null) return formatted;
  return defaultDateText(field, value, host);
} // A share of a limit (owner decision C203 (5), IM-8): the `meter` variant of a
// number 0..100 is the inline sf-progress-bar meter -- a 64 track, the number
// «72 %» before it -- named by the field's label. The scale stays for levels
// («4 из 5», C185 (5)). Out of range it is left as text, as the scale is.
//
// Its thresholds are the HTML meter's (dispatcher decision msg-bc1702eb, the
// variant name meter): low and high split 0..100 into three regions and
// optimum says which one is good (unset, the middle of the range, as <meter>).
// The value in the optimum's region draws no status, in the region next to it
// warning, two regions away error -- so a disk share with low 80 and high 95
// is warning from above 80 and error above 95, and a fill rate with optimum
// 100 is error below low. Without low and high the meter draws no status.


function meterLimit(raw, fallback, from, to) {
  const number = raw === null || raw === undefined || raw === '' ? NaN : Number(raw);
  return Number.isFinite(number) ? Math.min(to, Math.max(from, number)) : fallback;
}

function meterStatus(field, number) {
  if (!field || !Number.isFinite(number)) return '';
  const {
    low: lowSet,
    high: highSet,
    optimum: optimumSet
  } = field;

  const given = value => value !== undefined && value !== null && value !== '';

  if (!given(lowSet) && !given(highSet)) return '';
  const low = meterLimit(lowSet, 0, 0, 100);
  const high = meterLimit(highSet, 100, low, 100);
  const optimum = meterLimit(optimumSet, 50, 0, 100);

  const region = point => point < low ? 0 : point > high ? 2 : 1; // The optimum on a boundary or between them makes the middle the good region.


  const best = optimum < low ? 0 : optimum > high ? 2 : 1;
  const away = Math.abs(region(number) - best);
  return away === 0 ? '' : away === 1 ? 'warning' : 'error';
}

function meterProps(field, number) {
  const name = typeof field.label === 'string' ? field.label : field.key || '';
  const status = meterStatus(field, number);
  return {
    inline: true,
    meter: true,
    value: String(number),
    ...(name ? {
      label: name
    } : {}),
    ...(status ? {
      status
    } : {})
  };
} // A percent drawn as a scale or a meter (step 5): the number's own drawings,
// for a percent 0..100; any other percent is its text.


function levelCell(field, value) {
  const variant = templateOf(field);
  if (variant !== 'scale' && variant !== 'meter') return null;
  const number = Number(scalarValue(value));
  if (scalarValue(value) === null || scalarValue(value) === '' || !Number.isFinite(number) || number < 0 || number > 100) return null;
  if (variant === 'meter') return {
    component: {
      type: 'progress-bar',
      props: meterProps(field, number)
    }
  };
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

function renderNumericCell(field, value, host) {
  const variant = templateOf(field);
  const number = Number(scalarValue(value));

  if (variant !== 'scale' && variant !== 'meter' || !Number.isFinite(number)) {
    // The host's text first; else the number in the page's language, as
    // the view prints it («12,5»), where the table printed «12.5». The
    // field's unit follows it as it does in the view (cards study CV-7:
    // a card's stock read a bare «13» where the record said «13 шт»).
    const formatted = renderHostFormattedCell(field, value, host);
    const text = formatted !== null ? formatted : carriesText(value) ? value.text || null : (0,_decimal_js__WEBPACK_IMPORTED_MODULE_12__.formatDecimal)(scalarValue(value), (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageLocale)(host ?? null)) || null;
    return text && field.unit ? `${text} ${field.unit}` : text;
  }

  if (number < 0 || number > 100) return null;
  if (variant === 'meter') return {
    component: {
      type: 'progress-bar',
      props: meterProps(field, number)
    }
  };
  return {
    component: {
      type: 'progress-scale',
      props: {
        line: CELL_LINE,
        value: String(number)
      }
    }
  };
} // A reference in a cell is a link and nothing else: the arrow a reference card
// carries said «goes somewhere» a second time beside a label that is already a
// link, and on a dense row it was the widest thing in the cell. Without an href
// the label is plain text -- a link that leads nowhere is not drawn as one.


function referenceLink(value) {
  return {
    component: {
      type: 'reference-link',
      props: {
        line: CELL_LINE,
        appearance: 'plain',
        icon: '',
        label: String(value.label),
        ...(value.href ? {
          href: String(value.href)
        } : {})
      }
    }
  };
} // A person: the avatar and the name, the name a link to the profile when the
// host gives its href.


function renderUserCell(field, value) {
  if (!value || typeof value !== 'object' || !value.label) return null;
  return [// The person's name is the avatar's heading: its accessible name and
  // the source of its initials (sf-avatar 1.6.0; avatar study AV-2).
  {
    component: {
      type: 'avatar',
      props: {
        line: CELL_LINE,
        text: value.avatarText || '',
        heading: String(value.label)
      }
    }
  }, value.href ? referenceLink(value) : String(value.label)];
}

function renderReferenceCell(field, value) {
  if (!value || typeof value !== 'object' || !value.label) return null;
  return referenceLink(value);
} // A value from a reference list is its label, and several are their labels in
// a row: nothing opens from a country or a status, so there is no link to draw.


function renderLookupCell(field, value) {
  const items = lookupItems(field, value);
  return items.length ? items.map(item => item.label).join(', ') : null;
} // Formatted text in a row is its text, as a text cell is: the markup is for a
// record, and a row of headings and lists would not be a row. A string, so the
// table draws and cuts it exactly as it does any text value.


function renderHtmlCell(field, value) {
  return (0,_html_js__WEBPACK_IMPORTED_MODULE_10__.htmlText)(value) || null;
} // What a cell should hold for a field, in the same shape a host would pass: a
// string, an object with a component, or a list of those. Null means the value
// is better off as itself. Returning the host's own shape is deliberate -- the
// table renders it through the path it already had, so the set adds no second
// way to draw a cell.


function renderCellField(field = {}, value, host) {
  const asked = (0,_templates_js__WEBPACK_IMPORTED_MODULE_7__.resolveField)(field).type;
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
// sf-input, sf-textarea, sf-switch, sf-checkbox, sf-dropdown, sf-segmented and
// sf-datepicker -- where it bound three different alias names before. The one
// event this file still binds under its own name is sf-file-upload:select,
// which is not a value change but a selection; the `change` on that component
// is its inner input's.
// The size the controls are drawn at: 1, or 1/2 when the host asks for it
// with renderEditField(…, {size: '1/2'}) -- a record view beside a table at
// 1/2 read a step larger than it (owner, 2026-10-14). Set for the duration of
// one synchronous render.

let EDIT_SIZE = '1';
const EDIT_RENDERERS = {
  record: renderRecordLookup,
  relation: renderRecordLookup,
  user: renderRecordLookup,
  lookup: renderLookupEdit,
  string: renderTextEdit,
  phone: renderPhoneEdit,
  password: renderPasswordEdit,
  url: renderUrlEdit,
  link: renderLinkEdit,
  'ru.inn': renderInnEdit,
  text: renderTextAreaEdit,
  html: renderHtmlEdit,
  number: renderNumberEdit,
  date: renderDateEdit,
  datetime: renderDateTimeEdit,
  time: renderTimeEdit,
  boolean: renderBooleanEdit,
  choice: renderChoiceEdit,
  choices: renderChoicesEdit,
  file: renderFileEdit,
  color: renderColorEdit,
  include: renderIncludeEdit,
  money: renderMoneyEdit,
  percent: renderPercentEdit
};

function fieldName(field) {
  return `sf_field_${field.key || 'value'}`;
} // A telephone is a type of its own (owner decision C302 (1), 2026-11-17): it
// stores E.164 and is checked as a number, where a string is any text. It was
// a `string` whose variant was `phone`, which is still read as this type until
// 2027-01-01 (templates.js). The control is sf-input-country, which knows
// country codes, dial prefixes and masks.
//
// What it writes is E.164, `+79161234567` (FL-1): the control's own form value,
// whatever the box shows -- `+7 916 123-45-67` written back changed a stored
// number on every save. It reads E.164 and the formatted strings stored before.
//
// An extension (`;ext=12`) is not the control's to edit: the number goes to
// it alone and the extension is written back after it, so a save keeps it.
//
// The country an empty field starts on (FL-7): `defaultCountry` (ISO 3166
// alpha-2, "RU") where the field names one, else the page's (ru is Russia,
// en-GB Britain; sf-input-country's own rule). A stored number names its own
// country, so the setting is passed only while the field is empty.


function renderPhoneEdit(field, value, host) {
  const {
    number: stored,
    extension
  } = (0,_phone_js__WEBPACK_IMPORTED_MODULE_13__.splitPhone)(scalarValue(value) ?? '');
  const preferred = String(field.defaultCountry ?? '').trim().toUpperCase();
  const iso2 = /^[A-Z]{2}$/u.test(preferred) && !String(stored).trim() ? preferred : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-input-country
                size=${EDIT_SIZE}
                name=${fieldName(field)}
                value=${stored}
                iso2=${iso2}
                aria-label=${field.label || field.key || ''}
                ?required=${Boolean(field.required)}
                ?disabled=${field.readonly === true}
                use-mask="true"
                show-code="true"
                @change=${event => host.setFieldValue(field, phoneWritten(event, extension))}
        ></sf-input-country>
    `;
} // The control's form value (E.164; nothing for the dial code alone), or the
// box's text brought to E.164 where the element is not defined yet.


function phoneWritten(event, extension = '') {
  const control = event.currentTarget;
  const number = typeof control?.sfFormValue === 'function' ? control.sfFormValue() ?? '' : (0,_phone_js__WEBPACK_IMPORTED_MODULE_13__.phoneE164)(event.detail?.value ?? event.target?.value ?? '');
  return number && extension ? `${number};ext=${extension}` : number;
} // A phone shown: the host's text first (formatFieldValue, or {value, text}),
// as for any string; else the number
// laid out by its country, left to right on a right-to-left page too (an
// Arabic page drew the groups in reverse order).


function phoneText(field, value, host) {
  const formatted = host?.formatFieldValue?.(field, value);
  if (typeof formatted === 'string') return formatted;
  if (carriesText(value)) return value.text;
  return (0,_phone_js__WEBPACK_IMPORTED_MODULE_13__.formatPhone)(scalarValue(value), setText(host, 'phoneExtension'));
} // A password is a type the set never shows (owner, 2026-10-19; a type of its
// own since C302 (1), a string with variant `password` before, read as it
// until 2027-01-01). The host never sends one: the value of a `password`
// field is {set: true} or {set: false}, and null or an absent value reads as
// not set. View, cell and a read-only field say «задан» or «не задан» in the
// page's language and nothing else. A host that sends a string by mistake gets
// «задан» for it, and the string is still not drawn.
//
// The edit control starts empty whatever is stored, and it writes only what a
// person types: an untouched field calls nothing, so a save carries no value for
// it and can neither clear nor echo a password. Typing and then erasing writes
// `undefined` -- the person took the change back, and a host drops the key.
// Clearing a set password is not offered: an empty field means «keep».
//
// The typed text lives in the input and nowhere else: no `value` attribute on
// sf-input, no data-*, no text node, no log. The eye that shows the password is
// sf-input's own (C123 (4): a glyph inside the field, the crossed eye after a
// press); the set drew a second one beside the field until the text inputs
// study (TI-7), so a record card showed two.


function passwordIsSet(value) {
  if (value && typeof value === 'object' && !Array.isArray(value)) return value.set === true;
  return typeof value === 'string' && value !== '';
}

function passwordState(host, value) {
  return setText(host, passwordIsSet(value) ? 'passwordSet' : 'passwordUnset');
}

function renderPasswordEdit(field, value, host) {
  const set = passwordIsSet(value);
  const placeholder = field.placeholder || (set ? setText(host, 'passwordKeep') : '');

  const write = event => {
    const typed = event.target?.value ?? '';
    host.setFieldValue(field, typed === '' ? undefined : typed);
  }; // A set password is not required again: an empty field keeps it. Spellcheck
  // is off on the wrapper: the attribute is inherited, and sf-input does not
  // declare it (a shown password would otherwise be sent to a spellchecker).


  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <span class="sf-field-password flex items-cross-center gap-1/3 min-w-0" spellcheck="false">
            <sf-input
                    size=${EDIT_SIZE}
                    appearance="bordered"
                    root-class="flex-1 min-w-0"
                    input-type="password"
                    autocomplete="new-password"
                    name=${fieldName(field)}
                    placeholder=${placeholder || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    ?required=${Boolean(field.required) && !set}
                    aria-label=${field.label || field.key || ''}
                    @input=${write}
                    @change=${write}
            ></sf-input>
        </span>
    `;
} // url, link, ru.inn (catalogue step 3; text-types.js holds the rules).
//
// A text checked on the way in, as a masked string is (port 1.16.0): what is
// not a value yet is said through setFieldError, which holds a save, and
// under the field once the person leaves it; a host that does not hear
// errors hears undefined. Empty writes null.


function checkedTextEdit(field, value, host, {
  check,
  complete = null,
  inputType = '',
  inputmode = '',
  maxlength = '',
  autocomplete = ''
}) {
  const write = (event, left) => {
    const input = event.currentTarget ?? event.target;
    const typed = String(input?.value ?? '').trim(); // What the text stands for (a url's bare domain, FO-5): checked and
    // written while typing, and shown in the field once the person leaves it.

    const text = typed && complete ? complete(typed) : typed;
    if (left && input && text !== typed && !check(text)) input.value = text;
    const reason = text ? check(text) : null;

    if (reason) {
      const message = setText(host, reason);

      if (left && input) {
        input.setAttribute('error-message', message);
        input.toggleAttribute('invalid', true);
      }

      if (typeof host.setFieldError === 'function') {
        host.setFieldError(field, message);
        host.setFieldValue(field, text);
      } else {
        host.setFieldValue(field, undefined);
      }

      return;
    }

    if (input?.hasAttribute?.('invalid')) {
      input.toggleAttribute('invalid', false);
      input.removeAttribute('error-message');
    }

    host.setFieldError?.(field, null);
    host.setFieldValue(field, text || null);
  };

  const shown = scalarValue(value);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-input
                size=${EDIT_SIZE}
                appearance="bordered"
                name=${fieldName(field)}
                value=${shown === null || shown === undefined ? '' : String(shown)}
                placeholder=${field.placeholder || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                input-type=${inputType || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                inputmode=${inputmode || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                maxlength=${maxlength || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                autocomplete=${autocomplete || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ?required=${Boolean(field.required)}
                aria-label=${field.label || field.key || ''}
                @input=${event => write(event, false)}
                @change=${event => write(event, true)}
        ></sf-input>
    `;
} // A web address (url@1): the edit is sf-input of type url, checked as an
// absolute http(s) address; the view a link that opens in a new tab; a row
// the host and the start of the path. An address that is not one is shown as
// text, never as a link.


function renderUrlEdit(field, value, host) {
  return checkedTextEdit(field, value, host, {
    check: text => (0,_text_types_js__WEBPACK_IMPORTED_MODULE_6__.isWebAddress)(text) ? null : 'urlInvalid',
    // «simai.io» is https://simai.io (dispatcher decision FO-5); a text
    // with a scheme of its own keeps it and is refused unless http(s).
    complete: _text_types_js__WEBPACK_IMPORTED_MODULE_6__.completeWebAddress,
    inputType: 'url',
    inputmode: 'url',
    autocomplete: 'url'
  });
}

function addressLink(href, text) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<a class="sf-link" href=${href} target="_blank" rel="noopener noreferrer"><bdi dir="ltr">${text}</bdi></a>`;
}

function renderUrlView(field, value, host) {
  const text = viewText(field, value, host);
  if (!text) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const href = scalarValue(value);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-field-view">${(0,_text_types_js__WEBPACK_IMPORTED_MODULE_6__.isWebAddress)(href) ? addressLink(href, text) : text}</span>`;
}

function renderUrlCell(field, value, host) {
  const formatted = host?.formatFieldValue?.(field, value);
  const href = scalarValue(value);
  if (!(0,_text_types_js__WEBPACK_IMPORTED_MODULE_6__.isWebAddress)(href)) return typeof formatted === 'string' ? formatted : null;
  return addressLink(href, typeof formatted === 'string' ? formatted : (0,_text_types_js__WEBPACK_IMPORTED_MODULE_6__.shortAddress)(href));
} // A link with its text (link@1): {href, text?}. The view and the row are the
// text as a link (the address where there is no text); a site path or an
// anchor opens in place, an http(s) address in a new tab; an address that is
// not one is the text alone. The edit is two fields, the address and the text.
// A link's own `text` is its words, not a host's formatted text: an object
// with an href is the link itself.


function linkValue(value) {
  return value && typeof value === 'object' && !Array.isArray(value) && typeof value.href === 'string' ? value : scalarValue(value);
}

function linkParts(value) {
  const link = (0,_text_types_js__WEBPACK_IMPORTED_MODULE_6__.readLink)(linkValue(value));
  if (!link) return null;
  const words = link.text || link.href;
  return { ...link,
    words,
    safe: (0,_text_types_js__WEBPACK_IMPORTED_MODULE_6__.isLinkAddress)(link.href)
  };
}

function linkAnchor(link) {
  if (!link.safe) return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${link.words}`;
  const away = (0,_text_types_js__WEBPACK_IMPORTED_MODULE_6__.isWebAddress)(link.href);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<a class="sf-link" href=${link.href} target=${away ? '_blank' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing} rel=${away ? 'noopener noreferrer' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>${link.text ? link.text : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<bdi dir="ltr">${link.href}</bdi>`}</a>`;
}

function renderLinkView(field, value, host) {
  const formatted = host?.formatFieldValue?.(field, value);
  if (typeof formatted === 'string') return formatted ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-field-view">${formatted}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const link = linkParts(value);
  return link ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-field-view">${linkAnchor(link)}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
}

function renderLinkCell(field, value, host) {
  const formatted = host?.formatFieldValue?.(field, value);
  if (typeof formatted === 'string') return formatted || null;
  const link = linkParts(value);
  return link ? linkAnchor(link) : null;
} // Each change reads both fields as they stand, so the text typed before the
// address is kept while the address is still empty.
// The address box is text with the address keyboard, not input-type url: a
// link's href may be a path from the site's root or an #anchor (link@1), which
// the browser's url check calls wrong, and a form that reads the control's
// validity refused a stored «/about» (sf-form 1.7.0 probe). composeLink is the
// check.


function renderLinkEdit(field, value, host) {
  const stored = (0,_text_types_js__WEBPACK_IMPORTED_MODULE_6__.readLink)(linkValue(value)) ?? {
    href: '',
    text: ''
  };

  const write = (part, event, left) => {
    const input = event.currentTarget ?? event.target;
    const box = input?.closest?.('.sf-field-link');
    const hrefInput = box?.querySelector?.('[data-sf-link-part="href"]');
    const textInput = box?.querySelector?.('[data-sf-link-part="text"]');

    const read = (one, own) => String(one ? one.value ?? '' : own);

    const next = {
      href: read(hrefInput, stored.href),
      text: read(textInput, stored.text)
    };
    const result = (0,_text_types_js__WEBPACK_IMPORTED_MODULE_6__.composeLink)(next.href, next.text);

    if (result.error) {
      const message = setText(host, result.error);
      const at = result.error === 'linkTextLong' ? textInput : hrefInput;

      if (left && at) {
        at.setAttribute('error-message', message);
        at.toggleAttribute('invalid', true);
      }

      if (typeof host.setFieldError === 'function') {
        host.setFieldError(field, message);
        host.setFieldValue(field, {
          href: next.href.trim(),
          ...(next.text.trim() ? {
            text: next.text.trim()
          } : {})
        });
      } else {
        host.setFieldValue(field, undefined);
      }

      return;
    }

    for (const one of [hrefInput, textInput]) {
      if (one?.hasAttribute?.('invalid')) {
        one.toggleAttribute('invalid', false);
        one.removeAttribute('error-message');
      }
    }

    host.setFieldError?.(field, null);
    host.setFieldValue(field, result.value);
  };

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <span class="sf-field-link flex flex-col gap-1/3 min-w-0">
            <sf-input
                    size=${EDIT_SIZE}
                    appearance="bordered"
                    data-sf-link-part="href"
                    name="${fieldName(field)}_href"
                    label=${setText(host, 'linkAddress')}
                    value=${stored.href}
                    inputmode="url"
                    ?required=${Boolean(field.required)}
                    aria-label=${`${field.label || field.key || ''} ${setText(host, 'linkAddress')}`.trim()}
                    @input=${event => write('href', event, false)}
                    @change=${event => write('href', event, true)}
            ></sf-input>
            <sf-input
                    size=${EDIT_SIZE}
                    appearance="bordered"
                    data-sf-link-part="text"
                    name="${fieldName(field)}_text"
                    label=${setText(host, 'linkText')}
                    value=${stored.text}
                    maxlength="255"
                    aria-label=${`${field.label || field.key || ''} ${setText(host, 'linkText')}`.trim()}
                    @input=${event => write('text', event, false)}
                    @change=${event => write('text', event, true)}
            ></sf-input>
        </span>
    `;
} // A Russian taxpayer number (ru.inn@1): digits, typed with the digit
// keyboard, checked by its length for the field's `holder` and by the check
// digits; shown and listed as its digits, left to right. No maxlength: it
// drew sf-input's «10 / 12» counter under a complete number, and the length
// is the check's to say.


function renderInnEdit(field, value, host) {
  const holder = (0,_text_types_js__WEBPACK_IMPORTED_MODULE_6__.innHolder)(field);
  return checkedTextEdit(field, value, host, {
    check: text => (0,_text_types_js__WEBPACK_IMPORTED_MODULE_6__.innError)(text, holder),
    inputmode: 'numeric',
    autocomplete: 'off'
  });
}

function innText(field, value, host) {
  return viewText(field, value, host);
}

function renderInnView(field, value, host) {
  const text = innText(field, value, host);
  return text ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-field-view num-tabular"><bdi dir="ltr">${text}</bdi></span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
}

function renderInnCell(field, value, host) {
  const text = innText(field, value, host);
  return text ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<bdi dir="ltr">${text}</bdi>` : null;
} // A string in a row is its own text: the table prints the value.


function renderStringCell() {
  return null;
}

function renderStringView(field, value, host) {
  return renderTextView(field, value, host);
}

function renderPhoneCell(field, value, host) {
  const text = phoneText(field, value, host);
  return text ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<bdi dir="ltr">${text}</bdi>` : null;
}

function renderPhoneView(field, value, host) {
  const text = phoneText(field, value, host);
  return text ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-field-view"><bdi dir="ltr">${text}</bdi></span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
} // A password is never shown anywhere: a row and a record say whether one is set.


function renderPasswordCell(field, value, host) {
  return passwordState(host, value);
}

function renderPasswordView(field, value, host) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-field-view">${passwordState(host, value)}</span>`;
} // A password is filtered by whether it is set: «Задан» is the condition
// not-empty, «Не задан» empty, each with the value true, as the number
// filter writes the two (C294).


function renderPasswordFilterControl(field, host) {
  const control = host.getFilterControlValue(field.key) || {};
  const chosen = control.operator === 'empty' ? 'unset' : control.operator === 'not-empty' ? 'set' : '';
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-dropdown
                size=${filterSize(host)}
                appearance="bordered"
                mode="select"
                search="false"
                label=${setText(host, 'condition')}
                placeholder=${setText(host, 'condition')}
                name="sf_filter_${field.key || 'password'}"
                .options=${[['set', 'passwordSet'], ['unset', 'passwordUnset']].map(([value, word]) => ({
    type: 'text',
    size: filterSize(host),
    value,
    text: setText(host, word),
    selected: value === chosen
  }))}
                @change=${event => {
    if (event.target !== event.currentTarget) return;
    const next = event.detail?.values?.[0] || event.detail?.value;
    if (!next) return;
    host.patchTempFilterValue(field.key, {
      operator: next === 'set' ? 'not-empty' : 'empty',
      value: true
    });
  }}
        ></sf-dropdown>
    `;
} // A file shown as what it is. The site keeps logos, so a file whose template
// is image, image_card or image_list is drawn as the image rather than as a
// row with a paperclip -- the same stored file, told apart by the host rather
// than guessed from a file name.


const IMAGE_TEMPLATES = new Set(['image', 'image_card', 'image_list']); // The template a field is drawn with (C302): templates.js resolveField, which
// reads the former variant and says a fallback once.

function templateOf(field) {
  return (0,_templates_js__WEBPACK_IMPORTED_MODULE_7__.resolveField)(field).template;
}

function isImageField(field) {
  return IMAGE_TEMPLATES.has(templateOf(field));
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
        <pre class="sf-field-include" data-language=${(0,_templates_js__WEBPACK_IMPORTED_MODULE_7__.templateParam)(field, 'language') ? String((0,_templates_js__WEBPACK_IMPORTED_MODULE_7__.templateParam)(field, 'language')) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}><code>${String(text)}</code></pre>
    `;
} // The include editor is code (C141 (8)): sf-input-textarea's text="code" --
// the code font, spelling off, no wrapping -- at a fixed eight rows.


function renderIncludeEdit(field, value, host) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-input-textarea
                size=${EDIT_SIZE}
                appearance="bordered"
                class="sf-field-include-edit"
                name=${fieldName(field)}
                value=${scalarValue(value) ?? ''}
                rows=${rowsOf(field, 8)}
                text="code"
                ?required=${Boolean(field.required)}
                aria-label=${field.label || field.key || ''}
                ?disabled=${field.readonly === true}
                @change=${event => host.setFieldValue(field, event.target?.value ?? '')}
                @input=${event => host.setFieldValue(field, event.target?.value ?? '')}
        ></sf-input-textarea>
    `;
} // The rows a text or a code area shows (template parameter rows, 1..50).


function rowsOf(field, fallback) {
  const asked = Number((0,_templates_js__WEBPACK_IMPORTED_MODULE_7__.templateParam)(field, 'rows'));
  return Number.isInteger(asked) && asked >= 1 && asked <= 50 ? String(asked) : fallback ? String(fallback) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
}

function renderIncludeCell(field, value) {
  const text = scalarValue(value);
  if (!text) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing; // One line in a cell: a script in a table row is a fact about the record, not
  // something to read there.

  const first = String(text).split('\n')[0];
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<code>${first.length > 60 ? `${first.slice(0, 60)}…` : first}</code>`;
}

function renderTextEdit(field, value, host) {
  const mask = (0,_mask_js__WEBPACK_IMPORTED_MODULE_9__.maskPattern)(field);
  if (mask) return renderMaskedEdit(field, value, host, mask);
  value = scalarValue(value);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-input
                size=${EDIT_SIZE}
                appearance="bordered"
                name=${fieldName(field)}
                value=${value ?? ''}
                placeholder=${field.placeholder || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ?required=${Boolean(field.required)}
                aria-label=${field.label || field.key || ''}
                @input=${event => host.setFieldValue(field, event.target?.value ?? '')}
                @change=${event => host.setFieldValue(field, event.target?.value ?? '')}
        ></sf-input>
    `;
} // A string typed through a mask (simai.property-view-port 1.16.0, field.mask;
// consumer simai.main, agreed contract q-b0de123841). The control is the stock
// sf-input with its own mask -- the Framework grammar, the same mask-pattern a
// page writes by hand -- so the typing, the caret and the fixed parts are the
// field's and nothing here formats a character.
//
// What the set adds is the one thing sf-input does not say: whether the text
// fills the pattern (./mask.js). The value written is the text as shown, fixed
// parts included («+7 (912) 345-67-89»): the host stores what it gets. Empty is
// not incomplete -- an optional masked field may be cleared, and writes null,
// or "" for a field that declares `nullable: false`. Required stays a mark: an
// empty required field is written as cleared and the host validates it.
//
// An incomplete text is not a value. The host hears it through the optional
// setFieldError(field, message) on every keystroke -- null once the text is
// complete or empty -- so a panel can hold both of its saves while any masked
// field in it is incomplete, each field on its own. The control marks itself
// invalid with the stock message only once the person leaves it (change):
// shouting «Заполните поле полностью» at the first digit of a phone would be
// an error for typing. A completed or cleared text takes the mark off at once.
//
// What is written while incomplete depends on the host. A host that hears
// errors gets the text as typed, because it re-renders with the value it was
// given and anything else would put an older text over the person's typing (a
// value attribute that moves is written into the input). A host that does not
// hear errors cannot hold a save, so the change is withdrawn with undefined,
// as the datetime pair does: what it saves is never the half-typed text.


function renderMaskedEdit(field, value, host, mask) {
  value = scalarValue(value);
  const cleared = field.nullable === false ? '' : null;

  const write = (event, left) => {
    const input = event.currentTarget;
    const text = String(input?.value ?? '');
    const state = (0,_mask_js__WEBPACK_IMPORTED_MODULE_9__.maskState)(text, mask);

    if (state === 'incomplete') {
      const message = setText(host, 'maskIncomplete');

      if (left && input) {
        input.setAttribute('error-message', message);
        input.toggleAttribute('invalid', true);
      }

      if (typeof host.setFieldError === 'function') {
        host.setFieldError(field, message);
        host.setFieldValue(field, text);
      } else {
        host.setFieldValue(field, undefined);
      }

      return;
    }

    if (input?.hasAttribute('invalid')) {
      input.toggleAttribute('invalid', false);
      input.removeAttribute('error-message');
    }

    host.setFieldError?.(field, null);
    host.setFieldValue(field, state === 'empty' ? cleared : text);
  };

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-input
                size=${EDIT_SIZE}
                appearance="bordered"
                name=${fieldName(field)}
                value=${value ?? ''}
                placeholder=${field.placeholder || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                autocomplete="off"
                mask
                mask-pattern=${mask}
                ?required=${Boolean(field.required)}
                aria-label=${field.label || field.key || ''}
                @input=${event => write(event, false)}
                @change=${event => write(event, true)}
        ></sf-input>
    `;
}

function renderTextAreaEdit(field, value, host) {
  value = scalarValue(value);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-input-textarea
                size=${EDIT_SIZE}
                appearance="bordered"
                name=${fieldName(field)}
                value=${value ?? ''}
                rows=${rowsOf(field)}
                placeholder=${field.placeholder || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ?required=${Boolean(field.required)}
                aria-label=${field.label || field.key || ''}
                @input=${event => host.setFieldValue(field, event.target?.value ?? '')}
                @change=${event => host.setFieldValue(field, event.target?.value ?? '')}
        ></sf-input-textarea>
    `;
} // Formatted text (property-view port 1.17.0): sf-input-rich, named as the
// textarea is. The editor cleans its own value -- what it is given, every
// paste and every edit -- so what it writes back is already the subset. The
// value is read from the element the listener is on: sf-input-rich says input
// and change from its editing surface inside it, which has no value of its own.


function renderHtmlEdit(field, value, host) {
  value = scalarValue(value);

  const write = event => host.setFieldValue(field, event.currentTarget?.value ?? '');

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-input-rich
                size=${EDIT_SIZE}
                appearance="bordered"
                name=${fieldName(field)}
                value=${typeof value === 'string' ? value : ''}
                placeholder=${field.placeholder || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ?required=${Boolean(field.required)}
                ?disabled=${EDIT_DISABLED}
                aria-label=${field.label || field.key || ''}
                @input=${write}
                @change=${write}
        ></sf-input-rich>
    `;
} // A number edited with steps (owner, 2026-10-25): an integer or a number whose
// variant is `stepper` gets sf-input-quantity -- «−» and «+», the arrow keys, the
// bounds the field names -- and every other number keeps the plain sf-input
// below. The bounds, the step and (for a number) the digits are the field's
// own keys, read by this variant alone: a renderer still does not enforce a
// constraint, the stepper only stops at it and the host validates the record.
//
// A number's digits are its `decimals` (C303 (2); `precision` before it, an
// integer's 0), else the digits its `step` implies, else two: a number field
// whose stepper could not take a decimal mark would be a whole one.
// The value goes out as the stepper's number, or null when the field is
// emptied; the panel prints the label, so the control takes it as its
// accessible name only.


function isStepperField(field) {
  return templateOf(field) === 'stepper';
}

function stepperNumber(raw) {
  if (raw === null || raw === undefined || raw === '') return '';
  const number = Number(raw);
  return Number.isFinite(number) ? String(number) : '';
} // A percent's stepper (step 5) writes the decimal string a percent is
// («12.5», never a float) and carries «%» after the number.


function renderStepperEdit(field, value, host, {
  percent = false
} = {}) {
  const {
    decimals
  } = (0,_templates_js__WEBPACK_IMPORTED_MODULE_7__.resolveField)(field);
  const step = stepperNumber(field.step);
  const precision = decimals !== null ? String(decimals) : step ? '' : '2';

  const written = raw => {
    if (!percent || raw === null || raw === undefined || raw === '') return raw ?? null;
    const read = (0,_decimal_js__WEBPACK_IMPORTED_MODULE_12__.readDecimal)(String(raw));
    return read.ok ? read.value : null;
  };

  const write = event => host.setFieldValue(field, written(event.detail?.value ?? null));

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-input-quantity
                size=${EDIT_SIZE}
                name=${fieldName(field)}
                value=${stepperNumber(scalarValue(value))}
                min=${stepperNumber(field.min) || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                max=${stepperNumber(field.max) || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                step=${step || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                precision=${precision || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                unit=${percent ? '%' : fieldUnit(field) || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                aria-label=${field.label || field.key || ''}
                ?required=${Boolean(field.required)}
                ?disabled=${field.readonly === true}
                @input=${write}
                @change=${write}
        ></sf-input-quantity>
    `;
} // A number is a decimal (property-view port 1.18.0: «never a float on the
// wire»). What is typed is read with a comma or a point and spaces between
// groups. A number is one type (C303 (2)): `decimals`, fixed when the field
// is created, is how many digits it keeps after the point, 0 for a whole
// number (an integer field reads as decimals 0); more is a field error,
// never rounded, and a whole number has the digit keyboard. A number field
// whose value arrives as a string, or that declares its decimals, is a
// decimal-string field: it writes the canonical decimal string («1500.50»),
// never a float. Any other number field -- an integer field among them --
// writes a number, as before. Text that is not a number is reported as a
// masked string's incomplete entry is: through setFieldError, which holds the
// save, and under the field once the person leaves it.


function declaresDecimals(field) {
  return Number.isInteger(field.decimals) || Number.isInteger(field.precision);
}

function isDecimalStringField(field, value) {
  return typeof value === 'string' || declaresDecimals(field);
} // A number's unit (`unit`, «шт», «кг») in every place the field is drawn
// (C302 (2): the template knows every place; cards study CV-7): after the
// number in the view and the compact place, inside the box after the value
// when it is edited or filtered -- in the hint's ink, not part of the value.
// It was only the view's: the edit box and the filter box showed a bare
// «13» where the record said «13 шт». A field with no unit draws none.


function fieldUnit(field) {
  return typeof field?.unit === 'string' ? field.unit.trim() : '';
}

function renderNumberEdit(field, value, host) {
  if (isStepperField(field)) return renderStepperEdit(field, value, host);
  const {
    decimals
  } = (0,_templates_js__WEBPACK_IMPORTED_MODULE_7__.resolveField)(field);
  value = scalarValue(value);
  const asString = isDecimalStringField(field, value);

  const write = (event, left) => {
    const input = event.currentTarget ?? event.target;
    const text = String(input?.value ?? '');
    const read = (0,_decimal_js__WEBPACK_IMPORTED_MODULE_12__.readDecimal)(text);
    let message = null;
    if (!read.ok) message = setText(host, 'notNumber');else if (read.value !== null && decimals !== null && (0,_decimal_js__WEBPACK_IMPORTED_MODULE_12__.fractionDigits)(read.value) > decimals) {
      message = decimals === 0 ? setText(host, 'wholeNumber') : (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageWord)(SET_TEXT, 'precisionMax', host ?? null, {
        component: SET_NAME,
        count: decimals
      });
    }

    if (message) {
      if (left && input) {
        input.setAttribute('error-message', message);
        input.toggleAttribute('invalid', true);
      }

      if (typeof host.setFieldError === 'function') {
        host.setFieldError(field, message);
        host.setFieldValue(field, text);
      } else {
        host.setFieldValue(field, undefined);
      }

      return;
    }

    if (input?.hasAttribute?.('invalid')) {
      input.toggleAttribute('invalid', false);
      input.removeAttribute('error-message');
    }

    host.setFieldError?.(field, null);
    if (read.value === null) host.setFieldValue(field, null);else host.setFieldValue(field, asString ? read.value : Number(read.value));
  };

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-input
                size=${EDIT_SIZE}
                appearance="bordered"
                name=${fieldName(field)}
                value=${value ?? ''}
                inputmode=${decimals === 0 ? 'numeric' : 'decimal'}
                root-class=${EDIT_ALIGN_END ? 'text-end num-tabular' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                text-end=${fieldUnit(field) || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ?required=${Boolean(field.required)}
                aria-label=${field.label || field.key || ''}
                @input=${event => write(event, false)}
                @change=${event => write(event, true)}
        ></sf-input>
    `;
} // Money and percent are the Framework's in every mode (owner decision C291
// (2), 2026-11-17; set boundary study BQ-2): the View set's editors were the
// reference, its option names kept -- `currency` (a fixed ISO 4217 code),
// `min`, `max`, `precision` (a percent's digits; money's are its currency's
// minor units, ISO 4217) and `placeholder`, as simai.property-view-port 1.18.0
// declares them. Every value is a decimal string, never a float:
//
//   percent   "12.5" -- the percent, not the share; 0 to 100 unless the
//             field bounds it otherwise
//   money     {amount: "1500.50", currency: "RUB"}; a field with a fixed
//             currency also reads a bare amount, and writes the pair
//
// One sf-input with the decimal keyboard and the sign in the field («%», a
// fixed currency's «₽» after the amount or «$» before it, as the page's
// language writes it); a money field without a fixed currency has a currency
// dropdown beside the amount. What is typed is read with a comma or a point
// and written canonical; the input shows it back in the page's language
// («1500,5»). An entry that is not a value yet -- text that is not a number,
// more digits after the point than allowed, a bound crossed, an amount without
// a currency -- is written as typed and said through setFieldError, which holds
// a save (port 1.16.0, as a masked string's), and under the field once the
// person leaves it. A host without setFieldError hears undefined, as for a
// number.
// The codes a currency choice offers when a field names no `currencies` and
// the browser cannot list ISO 4217 (Intl.supportedValuesOf).


const OFFERED_CURRENCIES = ['RUB', 'USD', 'EUR', 'CNY', 'KZT', 'BYN', 'AED', 'TRY', 'GBP', 'JPY']; // A field's `currencies` (C294, MP-10): an array of ISO 4217 codes or a
// comma-separated string; absent, every code the browser knows.

function fieldCurrencies(field) {
  const asked = Array.isArray(field?.currencies) ? field.currencies : typeof field?.currencies === 'string' ? field.currencies.split(',') : [];
  const codes = asked.map(code => String(code).trim().toUpperCase()).filter(code => /^[A-Z]{3}$/u.test(code));
  return codes.length ? [...new Set(codes)] : (0,_decimal_js__WEBPACK_IMPORTED_MODULE_12__.currencyCodes)(OFFERED_CURRENCIES);
} // What a person is typing, per host and field: the value written is
// canonical («12.5»), and drawn back as such it would move the caret under
// «12,50» or swallow the comma of «12,». The typed text is shown while it
// still reads as the value, and forgotten when the field is left.


const DECIMAL_DRAFTS = new WeakMap();

function draftOf(host, key) {
  return host && typeof host === 'object' ? DECIMAL_DRAFTS.get(host)?.get(key) : undefined;
}

function keepDraft(host, key, text) {
  if (!host || typeof host !== 'object') return;
  let drafts = DECIMAL_DRAFTS.get(host);

  if (!drafts) {
    drafts = new Map();
    DECIMAL_DRAFTS.set(host, drafts);
  }

  if (text === undefined) drafts.delete(key);else drafts.set(key, text);
} // At rest the amount shows its groups and at least `minDigits` after the
// point («1 500,50»); while it is typed, as typed (C294).


function decimalShown(host, key, value, {
  currency = null,
  minDigits = 0
} = {}) {
  if (value === null || value === undefined || value === '') return '';
  const locale = (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageLocale)(host ?? null);
  const read = (0,_decimal_js__WEBPACK_IMPORTED_MODULE_12__.readTypedDecimal)(value, {
    locale: 'en',
    currency
  });
  if (!read.ok) return String(value);
  const draft = draftOf(host, key);

  if (typeof draft === 'string') {
    const typed = (0,_decimal_js__WEBPACK_IMPORTED_MODULE_12__.readTypedDecimal)(draft, {
      locale,
      currency
    });
    if (typed.ok && typed.value === read.value) return draft;
  }

  return (0,_decimal_js__WEBPACK_IMPORTED_MODULE_12__.restingDecimal)(read.value, locale, minDigits);
}

const hasBound = bound => bound !== null && bound !== undefined && bound !== '' && (0,_decimal_js__WEBPACK_IMPORTED_MODULE_12__.readDecimal)(bound).ok; // What is wrong with a typed decimal, or '': not a number, more digits after
// the point than `digits` (never rounded away: «1500,555» is an error, while
// «1500,500» is 1500.5), outside min..max.


function decimalError(host, text, {
  digits = null,
  min = null,
  max = null,
  currency = null
} = {}) {
  const read = (0,_decimal_js__WEBPACK_IMPORTED_MODULE_12__.readTypedDecimal)(text, {
    locale: (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageLocale)(host ?? null),
    currency
  });
  if (!read.ok) return setText(host, 'notNumber');
  if (read.value === null) return '';

  if (Number.isInteger(digits) && (0,_decimal_js__WEBPACK_IMPORTED_MODULE_12__.fractionDigits)(read.value) > digits) {
    return digits === 0 ? setText(host, 'fractionNone') : (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageWord)(SET_TEXT, 'precisionMax', host ?? null, {
      component: SET_NAME,
      count: digits
    });
  }

  const low = hasBound(min) && (0,_decimal_js__WEBPACK_IMPORTED_MODULE_12__.compareDecimal)(read.value, min) === -1;
  const high = hasBound(max) && (0,_decimal_js__WEBPACK_IMPORTED_MODULE_12__.compareDecimal)(read.value, max) === 1;
  if (!low && !high) return '';
  const locale = (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageLocale)(host ?? null);
  const vars = {
    min: hasBound(min) ? (0,_decimal_js__WEBPACK_IMPORTED_MODULE_12__.formatDecimal)(min, locale) : '',
    max: hasBound(max) ? (0,_decimal_js__WEBPACK_IMPORTED_MODULE_12__.formatDecimal)(max, locale) : ''
  };
  if (hasBound(min) && hasBound(max)) return setWord(host, 'boundBetween', vars);
  return low ? setWord(host, 'boundAtLeast', vars) : setWord(host, 'boundAtMost', vars);
} // The value goes to the host with what is wrong with it: a value that is not
// one yet is written as typed while setFieldError holds the save.


function writeDecimal(field, host, value, message) {
  if (message) {
    if (typeof host.setFieldError === 'function') {
      host.setFieldError(field, message);
      host.setFieldValue(field, value);
    } else {
      host.setFieldValue(field, undefined);
    }

    return;
  }

  host.setFieldError?.(field, null);
  host.setFieldValue(field, value);
}

function decimalInput(field, value, host, {
  key,
  check,
  write,
  currency = null,
  minDigits = 0,
  textStart = '',
  textEnd = '',
  rootClass = ''
}) {
  const own = EDIT_ERROR;
  const locale = (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageLocale)(host ?? null);

  const typed = (event, left) => {
    const input = event.currentTarget ?? event.target;
    const text = String(input?.value ?? '');
    keepDraft(host, key, left ? undefined : text);
    const message = check(text);

    if (input && !own) {
      if (message && left) {
        input.setAttribute('error-message', message);
        input.toggleAttribute('invalid', true);
      } else if (!message && input.hasAttribute?.('invalid') && !input.hasAttribute('data-sf-form-invalid')) {
        input.toggleAttribute('invalid', false);
        input.removeAttribute('error-message');
      }
    }

    const read = (0,_decimal_js__WEBPACK_IMPORTED_MODULE_12__.readTypedDecimal)(text, {
      locale,
      currency
    });
    write(read.ok ? read.value : text, message);
  };

  const rootClasses = [rootClass, EDIT_ALIGN_END ? 'text-end num-tabular' : ''].filter(Boolean).join(' ');
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-input
                size=${EDIT_SIZE}
                appearance="bordered"
                name=${fieldName(field)}
                value=${decimalShown(host, key, value, {
    currency,
    minDigits
  })}
                inputmode="decimal"
                text-start=${isolatedSign(textStart, locale) || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                text-end=${isolatedSign(textEnd, locale) || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                placeholder=${field.placeholder || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                root-class=${rootClasses || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ?required=${Boolean(field.required)}
                ?invalid=${Boolean(own)}
                error-message=${own || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                aria-label=${field.label || field.key || ''}
                @input=${event => typed(event, false)}
                @change=${event => typed(event, true)}
        ></sf-input>
    `;
} // A currency sign inside the field on a right-to-left page (C294 follow-up):
// «US$» or «CA$» ends in a neutral mark, and the browser drew «$US» in the
// field's affix while the display text, isolated by decimal.js, read right.
// The sign is isolated left to right (U+2066 .. U+2069) there too.


function isolatedSign(sign, locale) {
  if (!sign || !(0,_decimal_js__WEBPACK_IMPORTED_MODULE_12__.isRtlLocale)(locale) || !/[A-Za-z]/u.test(sign)) return sign;
  return `\u2066${sign}\u2069`;
}

function fixedCurrency(field) {
  return typeof field?.currency === 'string' && /^[A-Z]{3}$/u.test(field.currency) ? field.currency : null;
} // A percent's digits after the point: `precision`, else the digits its
// `step` has («0.1» is one), else as many as typed.


function percentDigits(field) {
  const {
    decimals
  } = (0,_templates_js__WEBPACK_IMPORTED_MODULE_7__.resolveField)(field);
  if (decimals !== null) return decimals;
  const step = (0,_decimal_js__WEBPACK_IMPORTED_MODULE_12__.readDecimal)(field.step);
  return step.ok && step.value !== null && Number(step.value) > 0 ? (0,_decimal_js__WEBPACK_IMPORTED_MODULE_12__.fractionDigits)(step.value) : null;
} // A percent is the percent itself, «12.5» is 12,5 % (C294); it is bounded
// only by the field's min and max -- a growth of 150 % or a change of −5 % is
// a percent too (MP-11: the View set bounded it 0..100 without saying why).


function renderPercentEdit(field, value, host) {
  if (isStepperField(field)) return renderStepperEdit(field, value, host, {
    percent: true
  });
  const key = String(field.key ?? '');
  const min = hasBound(field.min) ? field.min : null;
  const max = hasBound(field.max) ? field.max : null;
  const digits = percentDigits(field);
  return decimalInput(field, scalarValue(value), host, {
    key,
    textEnd: '%',
    check: text => decimalError(host, text, {
      digits,
      min,
      max
    }),
    write: (next, message) => writeDecimal(field, host, next, message)
  });
}

function renderMoneyEdit(field, value, host) {
  const locale = (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageLocale)(host ?? null);
  const key = String(field.key ?? '');
  const fixed = fixedCurrency(field);
  const display = (0,_decimal_js__WEBPACK_IMPORTED_MODULE_12__.currencyDisplayOf)(field);
  const parts = (0,_decimal_js__WEBPACK_IMPORTED_MODULE_12__.moneyParts)(scalarValue(value), fixed); // A currency chosen before an amount is typed waits here: a value is an
  // amount and its currency, never a currency alone.

  const currencyKey = `${key}#currency`;
  const currency = parts.currency || draftOf(host, currencyKey) || null;
  const min = hasBound(field.min) ? field.min : null;
  const max = hasBound(field.max) ? field.max : null;

  const check = (text, code) => {
    const message = decimalError(host, text, {
      digits: code ? (0,_decimal_js__WEBPACK_IMPORTED_MODULE_12__.currencyOf)(code, locale).minor : null,
      min,
      max,
      currency: code
    });
    if (message) return message;
    return (0,_decimal_js__WEBPACK_IMPORTED_MODULE_12__.readTypedDecimal)(text, {
      locale,
      currency: code
    }).value !== null && !code ? setText(host, 'chooseCurrency') : '';
  };

  const write = (amount, message, code) => writeDecimal(field, host, amount === null || amount === '' ? null : {
    amount,
    currency: code ?? null
  }, message);

  const sign = fixed ? (0,_decimal_js__WEBPACK_IMPORTED_MODULE_12__.currencyOf)(fixed, locale, display) : null;
  const amount = decimalInput(field, parts.amount, host, {
    key,
    currency,
    minDigits: currency ? (0,_decimal_js__WEBPACK_IMPORTED_MODULE_12__.currencyOf)(currency, locale).minor : 0,
    textStart: sign?.before ? sign.sign : '',
    textEnd: sign && !sign.before ? sign.sign : '',
    rootClass: fixed ? '' : 'flex-1 min-w-0',
    check: text => check(text, currency),
    write: (next, message) => write(next, message, currency)
  });
  if (fixed) return amount; // The field's `currencies`, the value's own currency first when the list
  // lacks it; without a list, every ISO 4217 code with a search.

  const listed = fieldCurrencies(field);
  const offered = [...new Set([...(currency ? [currency] : []), ...listed])];
  const name = setText(host, 'currency');

  const optionText = code => {
    const {
      sign: mark
    } = (0,_decimal_js__WEBPACK_IMPORTED_MODULE_12__.currencyOf)(code, locale, display);
    return mark === code ? code : `${code} ${mark}`;
  }; // C294 (b): the choice is a third of the row but never narrower than its
  // longest option and the field's own chrome -- the chevron's square (the
  // control height of the size) and the insets (space-1). A third of a narrow
  // row cut «USD US$» on an ar page and «USD $» in a form column at 390.


  const longest = Math.max(3, ...offered.map(code => [...optionText(code)].length));
  const sizeName = String(EDIT_SIZE).replace('/', '\\/');
  const currencyMin = `min-inline-size: calc(${longest + 1}ch + var(--sf-ui-${sizeName}--control-height) + var(--sf-space-1))`;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="flex gap-1/3 items-cross-start min-w-0 w-full">
            ${amount}
            <sf-dropdown
                    size=${EDIT_SIZE}
                    appearance="bordered"
                    mode="select"
                    search=${offered.length > 12 ? 'true' : 'false'}
                    root-class="basis-1/3"
                    root-style=${currencyMin}
                    name=${`${fieldName(field)}_currency`}
                    value=${currency ?? ''}
                    placeholder=${name}
                    aria-label=${name}
                    .options=${offered.map(code => ({
    type: 'text',
    size: '1',
    value: code,
    text: optionText(code),
    selected: code === currency
  }))}
                    @change=${event => {
    const code = event.detail?.values?.[0] || event.detail?.value || null;
    keepDraft(host, currencyKey, code ?? undefined);
    const typed = parts.amount; // The dropdown shows the code itself; a value is written
    // only with an amount.
    // The stored amount is checked as the page would show it.

    if (typed !== null && typed !== undefined && typed !== '') write(typed, check((0,_decimal_js__WEBPACK_IMPORTED_MODULE_12__.restingDecimal)(typed, locale), code), code);
  }}
            ></sf-dropdown>
        </div>
    `;
}

function renderPercentView(field, value, host) {
  const level = levelView(field, value);
  if (level) return level;
  const formatted = host?.formatFieldValue?.(field, value);
  const text = typeof formatted === 'string' ? formatted : carriesText(value) ? value.text : (0,_decimal_js__WEBPACK_IMPORTED_MODULE_12__.formatPercent)(scalarValue(value), (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageLocale)(host ?? null)) || viewText(field, value, null);
  return text ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-field-view">${text}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
}

function renderMoneyView(field, value, host) {
  const formatted = host?.formatFieldValue?.(field, value);
  const text = typeof formatted === 'string' ? formatted : carriesText(value) ? value.text : (0,_decimal_js__WEBPACK_IMPORTED_MODULE_12__.formatMoney)(scalarValue(value), field, (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageLocale)(host ?? null));
  return text ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-field-view">${text}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
} // A date control has no clock. `sf-input-date` declares a format and a date,
// and its parser is anchored (`^\d{4}-\d{2}-\d{2}$`), so a datetime value
// falls through to a loose digit scan that reads `2026-11-27T13:26:00` as day
// 2026 of month 11 in year 27 -- an impossible date, which renders as an empty
// input. Split the value instead: the control edits the day, and the time the
// record already held is put back on the way out. Without that, editing the day
// of a datetime would write a value with the clock silently zeroed, which is
// worse than the empty control, because it looks like it worked. A `datetime`
// field has its own editor now (renderDateTimeEdit); this keeps the clock of a
// `date` field whose value carries one.


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
} // min and max bound the day (PD-2, as a datetime's do): an ISO date, or the
// day of an ISO date and time; the calendar disables the days outside them
// and a typed day outside them is put back. The host still validates.


function dayBound(bound) {
  const match = typeof bound === 'string' ? bound.trim().match(/^\d{4}-\d{2}-\d{2}/u) : null;
  return match ? match[0] : '';
}

function renderDateEdit(field, value, host) {
  value = scalarValue(value);
  const {
    date,
    suffix
  } = splitDateTime(value);
  const min = dayBound(field.min);
  const max = dayBound(field.max);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-input-date
                size=${EDIT_SIZE}
                name=${fieldName(field)}
                value=${date ?? ''}
                min-date=${min || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                max-date=${max || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                aria-label=${field.label || field.key || ''}
                ?required=${Boolean(field.required)}
                ?invalid=${Boolean(EDIT_ERROR)}
                error-message=${EDIT_ERROR || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                @change=${event => {
    const next = event.detail?.value ?? event.target?.value ?? null;
    host.setFieldValue(field, next && suffix ? `${next}${suffix}` : next);
  }}
        ></sf-input-date>
    `;
} // A datetime is edited as what it is: a day and a time of day. The date
// editor above edits the day alone and puts the record's clock back, so a new
// record could not get a time and «15.11.2026 10:30» typed nowhere was saved
// as «15.11.2026» (Larena acceptance, 2026-10-22). The set then drew a pair --
// sf-input-date for the day and an sf-input masked to hh:mm for the time --
// because the picker had no clock, and sf-view-properties drew the same pair
// itself (duplication audit A-14). sf-input-date has a time now (1.4.0,
// mode="datetime"), so a datetime is one control: the calendar with the time
// row under it, typed as «15.11.2026 10:30», at the field's size, named by the
// label.
//
// The value round trip (datetime.js): ISO 8601 with the time; an untouched
// field writes nothing; a changed day keeps the stored time below the minute
// and the zone; a changed time keeps the zone; a new value has no zone (the
// host's local time); a cleared field writes null; coming back to what was
// stored writes undefined -- no change. The control writes only whole values
// (a day always has a time, a typed text that is not one is put back), so no
// partial entry reaches the host. The day is bound as a property, so a
// re-render with the same value does not put back what the person cleared.
//
// min and max (an ISO date, or a date and a time) are the control's min-date
// and max-date; step is its minute step (1 to 60).


function minuteStepOf(field) {
  const step = Number(field.step);
  return Number.isInteger(step) && step >= 1 && step <= 60 ? String(step) : '';
}

function renderDateTimeEdit(field, value, host) {
  const stored = (0,_datetime_js__WEBPACK_IMPORTED_MODULE_8__.splitDateTime)(value);
  const shown = stored.date ? `${stored.date}${stored.time ? `T${stored.time}` : ''}` : '';
  const min = typeof field.min === 'string' ? field.min : '';
  const max = typeof field.max === 'string' ? field.max : '';
  const step = minuteStepOf(field);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-input-date
                class="sf-field-datetime"
                mode="datetime"
                size=${EDIT_SIZE}
                name=${fieldName(field)}
                .value=${shown}
                min-date=${min || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                max-date=${max || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                minute-step=${step || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                aria-label=${field.label || field.key || ''}
                ?required=${Boolean(field.required)}
                ?invalid=${Boolean(EDIT_ERROR)}
                error-message=${EDIT_ERROR || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                @change=${event => {
    // The picker's own change, not a native one from its field.
    if (event.target !== event.currentTarget) return;
    const [date = '', time = ''] = String(event.detail?.value ?? '').split('T');
    const result = (0,_datetime_js__WEBPACK_IMPORTED_MODULE_8__.composeDateTime)(stored, {
      date,
      time
    });
    if (result.error) return;
    const same = result.value === null ? stored.known && !stored.date : result.value === stored.raw;
    host.setFieldValue(field, same ? undefined : result.value);
  }}
        ></sf-input-date>
    `;
} // A time of day (hh:mm, or hh:mm:ss as a host stores it) is sf-input-date in
// time mode: the time row alone, typed as «10:30». An unchanged minute writes
// nothing and keeps the stored seconds; min and max (hh:mm) are the control's
// min-time and max-time; step is its minute step.


function renderTimeEdit(field, value, host) {
  const stored = (0,_datetime_js__WEBPACK_IMPORTED_MODULE_8__.splitTime)(value);
  const min = typeof field.min === 'string' ? field.min : '';
  const max = typeof field.max === 'string' ? field.max : '';
  const step = minuteStepOf(field);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-input-date
                class="sf-field-time"
                mode="time"
                size=${EDIT_SIZE}
                name=${fieldName(field)}
                .value=${stored.time}
                min-time=${min || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                max-time=${max || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                minute-step=${step || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                aria-label=${field.label || field.key || ''}
                ?required=${Boolean(field.required)}
                ?invalid=${Boolean(EDIT_ERROR)}
                error-message=${EDIT_ERROR || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                @change=${event => {
    if (event.target !== event.currentTarget) return;
    const result = (0,_datetime_js__WEBPACK_IMPORTED_MODULE_8__.composeTime)(stored, String(event.detail?.value ?? ''));
    if (result.error) return;
    const same = result.value === null ? stored.known && !stored.time : result.value === stored.raw;
    host.setFieldValue(field, same ? undefined : result.value);
  }}
        ></sf-input-date>
    `;
} // A yes/no is drawn by its template (owner decision C303 (4), 2026-11-17): the
// switch is the default for every field; the checkbox and the buttons «Да» |
// «Нет» are templates the administrator picks -- the buttons where «not set»
// differs from «no», since neither a switch nor a checkbox can say «не
// задано». The Framework no longer picks the control from `required` and the
// apply mode (the rule of C165 (4) and of 2026-10-06 goes; FW-4): a field
// draws the template it names. A switch or a checkbox over an absent value
// writes nothing until it is pressed. Neither carries `required`: a yes/no
// with a value is answered, and an unticked box is «Нет».
// The buttons are the one template that can say «не задано», so they are the
// one that reads `required` (GB13 note 1): an optional field clears on a
// second press of the chosen button, as the choice buttons do, and writes
// null; a required one keeps its answer once given, and sf-form asks for
// one while it has none (value-missing, the required mark and note).


function renderBooleanEdit(field, value, host) {
  const template = templateOf(field);

  if (template === 'switch') {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
            <sf-switch
                    size=${EDIT_SIZE}
                    name=${fieldName(field)}
                    ?checked=${value === true}
                    aria-label=${field.label || field.key || ''}
                    ?invalid=${Boolean(EDIT_ERROR)}
                    error-message=${EDIT_ERROR || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    @change=${event => host.setFieldValue(field, Boolean(event.target?.checked))}
            ></sf-switch>
        `;
  }

  if (template === 'checkbox') {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
            <sf-checkbox
                    size=${EDIT_SIZE}
                    name=${fieldName(field)}
                    ?checked=${value === true}
                    aria-label=${field.label || field.key || ''}
                    ?invalid=${Boolean(EDIT_ERROR)}
                    error-message=${EDIT_ERROR || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    @change=${event => host.setFieldValue(field, Boolean(event.target?.checked ?? event.detail?.checked))}
            ></sf-checkbox>
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
  const clearable = field.required !== true && field.readonly !== true && !EDIT_DISABLED;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-segmented
                appearance="buttons"
                size=${EDIT_SIZE}
                items=${items}
                value=${value === true ? 'yes' : value === false ? 'no' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                aria-label=${field.label || field.key || ''}
                ?invalid=${Boolean(EDIT_ERROR)}
                error-message=${EDIT_ERROR || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                @click=${pressAgainClears({
    clearable
  })}
                @change=${event => {
    const next = event.detail?.value;
    host.setFieldValue(field, next === 'yes' ? true : next === 'no' ? false : null);
  }}
        ></sf-segmented>
    `;
} // An option's colour by its one data word (C302): color; scheme and swatch
// are its former names (FO4-2).


function optionColorOf(option = {}) {
  const raw = option?.color ?? option?.scheme ?? option?.swatch;
  return typeof raw === 'string' ? raw.trim() : '';
}

function editOptions(field, value, multiple) {
  const options = field.options || field.filter?.options || field.constraints?.options || [];
  const chosen = multiple ? new Set((Array.isArray(value) ? value : []).map(item => String(item))) : new Set([String(value ?? '')]); // An option's picture or icon is drawn in the dropdown too (FO4-1, FO4-3):
  // sf-dropdown's avatar and icon rows. Its colour (C308 FO-4) is the
  // name as a tonal badge in that colour, the dropdown's color word.

  return options.map(option => {
    const text = option.label ?? option.text ?? String(option.value);
    const avatar = typeof option.avatar === 'string' ? {
      image: option.avatar
    } : option.avatar;
    const picture = avatar?.image || avatar?.src || option.imageUrl || '';
    const initials = avatar?.text || option.avatarText || '';
    const visual = picture || initials ? {
      type: 'avatar',
      avatarImageUrl: picture,
      avatarTitle: text
    } : option.icon ? {
      type: 'icon',
      icon: String(option.icon)
    } : {
      type: 'text'
    };
    return { ...visual,
      size: '1',
      text,
      ...(optionColorOf(option) ? {
        color: optionColorOf(option)
      } : {}),
      value: String(option.value),
      selected: chosen.has(String(option.value))
    };
  });
} // A choice as buttons (simai.property-view-port 1.16.0, variant `buttons`;
// consumer simai.main, agreed contract q-b0de123841): one segmented
// sf-button-group, a button per option, for a short list a person reads at a
// glance -- a kind, a tier, a yes-no-maybe. The group is the stock one: Tab
// enters it, the arrows move and choose, Space and Enter choose, and it is a
// radiogroup to assistive technology. It wraps when it does not fit and is
// never replaced by a dropdown: a field that changes its control with the
// width of a window is two fields.
//
// `size` is the field's own step on the ladder ("1/2", "1", "2"), absent the
// panel's: the track of a segmented group is exactly as tall as an sf-button of
// the same size, so the buttons stand on the line the fields beside them do.
//
// The value is the option's own, in its own type -- the group speaks strings,
// so a chosen "2" is written back as the 2 the option carries -- or null.
// Pressing the chosen button again clears it when the field is not required;
// the group itself keeps a chosen button chosen (its select answers
// unchanged), so the press is read in the capture phase, before the group's
// own listener, where the value it is about to be compared with is still the
// one shown. A required field keeps the stock behaviour: the chosen button
// stays chosen.
//
// Read-only shows the chosen button chosen, in its own colours, and lets none
// be pressed: pointer events are off on the track and a key that would choose
// is stopped before the group hears it. Disabled is the group's own disabled,
// in the on-disable colours. The two are different facts -- «not yours to
// change» and «not available now» -- and drawn as the group draws them.


const CHOICE_BUTTON_SIZES = new Set(['1/2', '1', '2']);
const CHOOSING_KEYS = new Set(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', ' ', 'Enter']);

function isChoiceButtons(field) {
  return templateOf(field) === 'buttons';
} // The capture-phase press of a button group drawn for a field: read-only
// stops every press; a clearable field clears on a press of the chosen
// button (the choice buttons, and the boolean's «Да» | «Нет»).


function pressAgainClears({
  locked = false,
  clearable = false
} = {}) {
  return {
    capture: true,

    handleEvent(event) {
      const group = event.currentTarget;
      const segment = event.target?.closest?.('[data-sf-button-group-value]');
      if (!group || !segment || !group.contains(segment)) return;

      if (locked) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      if (!clearable || segment.disabled) return;
      if (segment.getAttribute('data-sf-button-group-value') !== group.value) return;
      event.preventDefault();
      event.stopPropagation();
      group.clear?.();
    }

  };
}

function renderChoiceButtons(field, value, host) {
  value = scalarValue(value);
  const options = (field.options || field.filter?.options || field.constraints?.options || []).filter(option => option && option.value !== null && option.value !== undefined && String(option.value) !== '');
  const items = options.map(option => ({
    value: String(option.value),
    label: String(option.label ?? option.text ?? option.value),
    ...(option.icon ? {
      icon: String(option.icon)
    } : {}),
    // One data word for colour (C302, C308 FO-4): the segment's name a tonal badge.
    ...(optionColorOf(option) ? {
      color: optionColorOf(option)
    } : {}),
    ...(option.disabled ? {
      disabled: true
    } : {})
  }));
  const asked = String((0,_templates_js__WEBPACK_IMPORTED_MODULE_7__.templateParam)(field, 'size') ?? '');
  const size = CHOICE_BUTTON_SIZES.has(asked) ? asked : EDIT_SIZE;
  const disabled = EDIT_DISABLED;
  const locked = !disabled && field.readonly === true;
  const clearable = field.required !== true && !locked && !disabled;
  const chosen = value === null || value === undefined ? '' : String(value);

  const optionValue = text => options.find(option => String(option.value) === text)?.value ?? text;

  const press = pressAgainClears({
    locked,
    clearable
  });
  const keys = {
    capture: true,

    handleEvent(event) {
      if (!locked || !CHOOSING_KEYS.has(event.key)) return;
      event.preventDefault();
      event.stopPropagation();
    }

  };
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-segmented
                class="sf-field-choice-buttons"
                appearance="track"
                size=${size}
                root-class=${locked ? 'flex-wrap pointer-events-none' : 'flex-wrap'}
                name=${fieldName(field)}
                items=${JSON.stringify(items)}
                value=${chosen || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ?disabled=${disabled}
                data-readonly=${locked ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                aria-label=${field.label || field.key || ''}
                @click=${press}
                @keydown=${keys}
                @change=${event => {
    const next = String(event.detail?.value ?? '');
    host.setFieldValue(field, next === '' ? null : optionValue(next));
  }}
        ></sf-segmented>
    `;
}

function renderChoiceEdit(field, value, host) {
  if (isChoiceButtons(field)) return renderChoiceButtons(field, value, host);
  value = scalarValue(value);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-dropdown
                size=${EDIT_SIZE}
                appearance="bordered"
                mode="select"
                search="false"
                name=${fieldName(field)}
                ?required=${Boolean(field.required)}
                value=${value ?? ''}
                placeholder=${field.placeholder || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                aria-label=${field.label || field.key || ''}
                .options=${editOptions(field, value, false)}
                @change=${event => host.setFieldValue(field, event.detail?.value ?? null)}
        ></sf-dropdown>
    `;
} // A long list is chosen from as a checklist, not from a dropdown: a custom
// role's 137 rights in one dropdown were a scroll inside a scroll, and what was
// chosen could not be seen at once (Larena, 2026-10-17). The list stands in
// two columns where the field has the room for them and in one where it does
// not. `variant: 'checklist'` asks for it at any length; `variant: 'select'`
// keeps the dropdown at any length.


const CHECKLIST_FROM = 13;

function renderChoicesChecklist(field, value, host) {
  const options = field.options || field.filter?.options || field.constraints?.options || [];
  const chosen = new Set((Array.isArray(value) ? value : []).map(item => String(item)));

  const toggle = (option, on) => {
    const next = options.filter(candidate => String(candidate.value) === String(option.value) ? on : chosen.has(String(candidate.value))).map(candidate => candidate.value);
    host.setFieldValue(field, next);
  };

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-field-checklist grid gap-1/3 w-full min-w-0" role="group" aria-label=${field.label || field.key || ''}
             style="grid-template-columns: repeat(auto-fill, minmax(min(100%, 14rem), 1fr))">
            ${options.map(option => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-checkbox size=${EDIT_SIZE}
                    name=${fieldName(field)} value=${String(option.value)}
                    label=${option.label ?? option.text ?? String(option.value)}
                    .checked=${chosen.has(String(option.value))}
                    @change=${event => toggle(option, Boolean(event.target?.checked ?? event.detail?.checked))}></sf-checkbox>`)}
        </div>
    `;
}

function renderChoicesEdit(field, value, host) {
  const options = field.options || field.filter?.options || field.constraints?.options || []; // The dropdown is the default; from 13 options it is a checklist, unless
  // the field asked for the dropdown by its former name select, which kept
  // it at any length (until 2027-01-01).

  const {
    template,
    former
  } = (0,_templates_js__WEBPACK_IMPORTED_MODULE_7__.resolveField)(field);

  if (template === 'checklist' || former !== 'select' && options.length >= CHECKLIST_FROM) {
    return renderChoicesChecklist(field, value, host);
  }

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-dropdown
                size=${EDIT_SIZE}
                appearance="bordered"
                mode="select"
                multiple
                search="false"
                name=${fieldName(field)}
                ?required=${Boolean(field.required)}
                placeholder=${field.placeholder || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
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


const SET_TEXT = _lang_index_mjs__WEBPACK_IMPORTED_MODULE_17__["default"]; // The host's word wins, as it always did; the set's own fallback now follows
// the page's language instead of being Russian whatever the page is. `host` is
// the component that called the set, which is the node the rule reads from.
// The set is not an element, so it is named here rather than taken from the
// node: `host` is whichever component called it, and words registered for the
// set should apply wherever it draws rather than once per host.

const SET_NAME = 'sf-field-renderers';

function setText(host, key) {
  return host?.getFieldText?.(key) ?? (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageText)(SET_TEXT, key, host ?? null, SET_NAME);
} // A word with places in it ({zone}, {n}): the host's word wins, as setText's.


function setWord(host, key, vars) {
  const own = host?.getFieldText?.(key);

  if (own !== undefined && own !== null) {
    return String(own).replace(/\{([a-z][\w-]*)\}/giu, (whole, name) => vars && name in vars ? String(vars[name]) : whole);
  }

  return (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageWord)(SET_TEXT, key, host ?? null, {
    component: SET_NAME,
    vars
  });
} // One job, one component (owner decision C139 (1), 2026-11-14): a record, a
// relation, a user and a paged lookup are chosen with sf-input-lookup -- the
// search the host answers, its rows with a picture and a caption, its states
// and its chips -- where they were a searchable sf-dropdown beside a status
// line of the set's own. sf-dropdown stays for a short list given whole (an
// inline lookup). The dropdown path is kept until 2027-01-01 for a host that
// asks renderEditField(…, {picker: 'dropdown'}); it is noted as deprecated.


const DROPDOWN_PICKER_UNTIL = '2027-01-01';
let EDIT_PICKER = '';

function dropdownPicker() {
  if (EDIT_PICKER !== 'dropdown') return false;
  (0,_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_11__.noteDeprecated)({
    component: 'sf-field-renderers',
    kind: 'value',
    attribute: 'picker',
    from: 'dropdown',
    to: null,
    since: '2026-11-14',
    remove_after: DROPDOWN_PICKER_UNTIL
  });
  return true;
} // An item the lookup shows, from what the host's page holds: a user's
// avatarText is the avatar's initials, an item's own avatar ({src} or
// {initials}), icon, caption and match ranges travel as they are.


function lookupItem(item) {
  if (!item || typeof item !== 'object') return null;
  const avatar = item.avatar && typeof item.avatar === 'object' ? item.avatar : item.avatarText ? {
    initials: String(item.avatarText)
  } : undefined;
  return {
    value: item.value,
    label: String(item.label ?? item.text ?? item.value ?? ''),
    ...(item.caption ? {
      caption: String(item.caption)
    } : {}),
    ...(avatar ? {
      avatar
    } : {}),
    ...(item.icon ? {
      icon: String(item.icon)
    } : {}),
    ...(item.match ? {
      match: item.match
    } : {})
  };
} // The lookup's provider over the host's page interface (getFieldOptionsPage,
// loadFieldOptions, getFieldOptionSearch, setFieldOptionSearch): a query is
// one host search, a cursor its next page. The page the host already holds
// for the same query answers at once (a record view asks the first page as
// its group opens). A host that loads without answering a promise answers on
// its next drawing: the page is read again until it is no longer loading.


function hostProvider(field, host) {
  return async (query, {
    cursor = null,
    signal
  } = {}) => {
    const text = String(query ?? '');
    const held = host.getFieldOptionsPage(field) || null;
    const sameSearch = (host.getFieldOptionSearch?.(field) ?? '') === text;
    let page = held;
    let from = 0;
    let before = [];

    if (cursor === null && sameSearch && held?.status === 'ready') {
      page = held;
    } else {
      before = cursor === null || !Array.isArray(held?.items) ? [] : held.items;
      host.setFieldOptionSearch?.(field, text);
      await host.loadFieldOptions(field, {
        cursor,
        search: text
      });
      page = host.getFieldOptionsPage(field) || null;

      for (let wait = 0; page?.status === 'loading' && wait < 100 && !signal?.aborted; wait += 1) {
        await new Promise(done => setTimeout(done, 50));
        page = host.getFieldOptionsPage(field) || null;
      }
    }

    if (signal?.aborted) return {
      items: []
    }; // A host may join the next page to the ones it holds, or replace them
    // with it: only what is new is answered.

    const now = Array.isArray(page?.items) ? page.items : [];
    if (before.length && now.length > before.length && now[0]?.value === before[0]?.value) from = before.length;
    if (page?.status === 'unsupported') return {
      status: 'unavailable'
    };
    if (!page || page.status === 'error' || page.status === 'loading') throw new Error(setText(host, 'recordsError'));
    const items = (Array.isArray(page.items) ? page.items : []).slice(from).map(lookupItem).filter(Boolean);
    return {
      items,
      nextCursor: page.nextCursor ?? null
    };
  };
} // The page a host pages answers a hundred at most: the lookup cuts an answer
// to max-results, and a host page is the host's own size.


const HOST_PAGE_MOST = 100;

function renderHostLookup(field, value, host, {
  multiple,
  placeholder
}) {
  // What the lookup says it chose, in the shape the set writes: {value,
  // label}, or a list of them when multiple.
  const resolved = item => ({
    value: item.value,
    label: String(item.label ?? item.value)
  });

  const write = event => {
    if (event.target !== event.currentTarget) return;
    const next = event.detail?.value ?? event.target?.value;

    if (multiple) {
      host.setFieldValue(field, (Array.isArray(next) ? next : []).map(resolved));
      return;
    }

    host.setFieldValue(field, next && typeof next === 'object' ? resolved(next) : null);
  };

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-field-picker flex flex-col gap-1/3" data-field-picker=${field.key || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
            <sf-input-lookup
                    size=${EDIT_SIZE}
                    ?multiple=${multiple}
                    suggest
                    min-length="1"
                    max-results=${String(HOST_PAGE_MOST)}
                    name=${fieldName(field)}
                    ?required=${Boolean(field.required)}
                    ?disabled=${EDIT_DISABLED}
                    placeholder=${field.placeholder || placeholder}
                    aria-label=${field.label || field.key || ''}
                    .value=${value ?? (multiple ? [] : null)}
                    .provider=${hostProvider(field, host)}
                    @change=${write}
            ></sf-input-lookup>
        </div>
    `;
} // The record picker: a record, a relation or a user, one value, searched and
// paged by the host (C139 (1)).


function renderRecordLookup(field, value, host) {
  if (dropdownPicker()) return renderRecordPicker(field, value, host);
  if (!host.loadFieldOptions || !host.getFieldOptionsPage) return null;
  const page = host.getFieldOptionsPage(field) || null; // A host that refused this field's candidates has none to give: the field
  // falls back to its value, read-only, as the dropdown path did.

  if (page?.status === 'unsupported') return null;
  const chosen = value && typeof value === 'object' ? value : null;
  return renderHostLookup(field, chosen, host, {
    multiple: false,
    placeholder: setText(host, 'pickRecord')
  });
} // DEPRECATED until 2027-01-01 (C139 (1)): the record picker as a searchable
// sf-dropdown, for a host that asks {picker: 'dropdown'}.


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
                    appearance="bordered"
                    mode="select"
                    search="true"
                    name=${fieldName(field)}
                    ?required=${Boolean(field.required)}
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
} // The lookup: a value chosen from a reference list the host keeps (Larena,
// 2026-10-23). It is the record picker's arrangement -- the host pages and
// searches, what is chosen stays shown whether or not the page holds it -- with
// the two things a reference list has that a record does not:
//
//   options   a short list arrives whole, as the field's own `options`, and is
//             chosen from in place: no page is asked for and the dropdown's own
//             search is right here, because the list in hand is the whole set.
//             A page is never searched in place -- it is not the whole set.
//   multiple  several values, each {value, label}, written back as a list.
//
// The value is {value, label}, or a list of them, and the control writes the
// same shape back: the label travels with the value so the host never resolves
// what it already knew, and a view of the value needs no second read.


function lookupItems(field, value) {
  const list = Array.isArray(value) ? value : [value];
  const options = Array.isArray(field.options) ? field.options : [];
  return list.filter(item => item !== null && typeof item !== 'undefined' && item !== '').map(item => {
    if (typeof item === 'object') return {
      value: item.value,
      label: String(item.label ?? item.value ?? '')
    }; // A bare value is read against the field's own list, so a host that
    // sends the inline options and the value alone is still shown a name.

    const option = options.find(candidate => String(candidate?.value) === String(item));
    return {
      value: item,
      label: String(option?.label ?? option?.text ?? item)
    };
  });
}

function renderLookupEdit(field, value, host) {
  const multiple = field.multiple === true;
  const inline = Array.isArray(field.options) && field.options.length > 0; // A list the host pages needs a host that pages; without one the field falls
  // back to its value, read-only, as a record does.

  if (!inline && (!host.loadFieldOptions || !host.getFieldOptionsPage)) return null; // A paged list is the lookup's (C139 (1)); a short list given whole stays
  // the dropdown's, and so does the deprecated dropdown path.

  if (!inline && !dropdownPicker()) {
    if (host.getFieldOptionsPage(field)?.status === 'unsupported') return null;
    return renderHostLookup(field, value, host, {
      multiple,
      placeholder: setText(host, 'pickFromList')
    });
  }

  const page = inline ? null : host.getFieldOptionsPage(field) || null;
  if (page?.status === 'unsupported') return null;
  const search = inline ? '' : host.getFieldOptionSearch?.(field) ?? '';
  const chosen = lookupItems(field, value);
  const candidates = (inline ? field.options : Array.isArray(page?.items) ? page.items : []).filter(item => item && typeof item === 'object').map(item => ({
    value: item.value,
    label: String(item.label ?? item.text ?? item.value)
  }));

  const isChosen = item => chosen.some(one => String(one.value) === String(item.value));

  const options = [...chosen.filter(item => !candidates.some(candidate => String(candidate.value) === String(item.value))), ...candidates].map(item => ({
    type: 'text',
    size: '1',
    text: item.label,
    value: String(item.value),
    selected: isChosen(item)
  })); // What the dropdown reports is the value as a string; the label and the
  // value's own type are taken back from what was offered.

  const known = [...chosen, ...candidates];

  const resolve = raw => {
    const found = known.find(item => String(item.value) === String(raw));
    return found ? {
      value: found.value,
      label: found.label
    } : {
      value: raw,
      label: String(raw)
    };
  };

  const write = event => {
    if (multiple) {
      const next = event.detail?.values ?? event.detail?.value;
      const values = (Array.isArray(next) ? next : next ? [next] : []).filter(item => item !== '');
      host.setFieldValue(field, values.map(resolve));
      return;
    }

    const next = event.detail?.value ?? null;
    host.setFieldValue(field, next === null || next === '' ? null : resolve(next));
  };

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-field-picker flex flex-col gap-1/3" data-field-picker=${field.key || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
            <sf-dropdown
                    size=${EDIT_SIZE}
                    appearance="bordered"
                    mode="select"
                    ?multiple=${multiple}
                    search="true"
                    name=${fieldName(field)}
                    ?required=${Boolean(field.required)}
                    value=${multiple ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : chosen[0] ? String(chosen[0].value) : ''}
                    placeholder=${field.placeholder || setText(host, 'pickFromList')}
                    search-placeholder=${field.searchPlaceholder || setText(host, 'searchInList')}
                    aria-label=${field.label || field.key || ''}
                    .options=${options}
                    @change=${write}
                    @input=${inline ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : event => {
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
                        ${page.status === 'loading' && !page.quiet ? setText(host, 'loadingOptions') : page.status === 'error' ? setText(host, 'optionsError') : ''}
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
} // One image, edited in place (simai/ui-source#27). A `file` field whose
// variant is `image` and which holds one file -- a logo, a cover, the picture
// of a block -- is what sf-image-field is for: the thumbnail with the name and
// size, «Заменить…», «Убрать», and a file dropped on it replaces the image. The
// preview-and-zone pair below stays for everything else: a field the host
// declares `multiple`, a list that already holds several, the card and list
// variants, and a file that is not an image. Which fields are images is the
// host's to say through the variant, as in the view and the cell.
//
// sf-image-field transfers no bytes either. Its change carries the value in the
// file shape -- a chosen file with the File in `file` and an object URL in
// `href`, null after «Убрать» -- and that goes through setFieldValue as every
// other control's value does, so the record the host holds is what the person
// sees. A host that uploads (startFieldUpload) is handed the File as well, in
// an item carrying it in `.file` as the file control's selection does, and
// writes the stored value with its lasting address when the file lands. A
// value that came as a list of one goes back as a list, so a host reads back
// the shape it sent.
//
// The value is bound as a property, never as the attribute: the attribute is
// JSON, which a File does not survive, and a changed attribute releases the
// object URL the thumbnail is showing. The panel prints the label, so the field
// takes it as its accessible name only.


function isSingleImageField(field, value) {
  return templateOf(field) === 'image' && field.multiple !== true && storedFiles(value).length <= 1;
}

function renderImageEdit(field, value, host) {
  const stored = storedFiles(value)[0] ?? null;
  const asList = Array.isArray(value);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-input-image
                size=${EDIT_SIZE}
                name=${fieldName(field)}
                accept=${field.accept ? String(field.accept) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                hint=${field.uploadSupportingText || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                .value=${stored}
                aria-label=${field.label || field.key || ''}
                ?required=${Boolean(field.required)}
                ?readonly=${field.readonly === true}
                ?invalid=${Boolean(EDIT_ERROR)}
                error-message=${EDIT_ERROR || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                @change=${event => {
    const next = event.detail?.value ?? null;
    host.setFieldValue(field, asList ? next ? [next] : [] : next);
    const file = event.detail?.file;

    if (file && host.startFieldUpload) {
      host.startFieldUpload(field, [{
        name: file.name,
        state: 'process',
        progress: 0,
        file
      }]);
    }
  }}
        ></sf-input-image>
    `;
}

function renderFileEdit(field, value, host) {
  if (isSingleImageField(field, value)) return renderImageEdit(field, value, host);
  const files = storedFiles(value);
  const multiple = field.multiple === true || Array.isArray(value);
  const canUpload = Boolean(host.startFieldUpload && host.getFieldUploads);
  const uploads = canUpload ? host.getFieldUploads(field) : null;
  const items = Array.isArray(uploads) ? uploads : []; // «×» takes a file out of the field at once, and the notice gives it back
  // with «Вернуть» (decisions C25, C149 (8)): the field's value before the
  // removal is set again.

  const drop = index => {
    const before = value;
    const next = files.filter((_, position) => position !== index);
    host.setFieldValue(field, multiple ? next : next[0] ?? null);
    const removed = files[index];
    globalThis.SF?.notify?.({
      status: 'neutral',
      title: setText(host, 'fileRemoved'),
      text: String(removed?.label ?? removed?.name ?? ''),
      source: 'sf-file-preview',
      action: {
        label: setText(host, 'undo'),
        onSelect: () => host.setFieldValue(field, before)
      }
    });
  };

  const readonly = field.readonly === true; // download-action and remove-action both read true when the attribute is
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
                        remove-action=${readonly ? 'false' : 'true'}
                        remove-label=${`${setText(host, 'removeFile')} ${file.label ?? file.name ?? ''}`.trim()}
                        @sf-file-preview-detach=${() => drop(index)}
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
                                ?invalid=${Boolean(EDIT_ERROR)}
                                error-message=${EDIT_ERROR || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
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


const sizeOption = options => options?.size === '1/2' ? '1/2' : '1'; // `options.density`: 'compact' or 'normal', the density the control is drawn in
// (owner decision C22; form study FM-5). Without it the control follows the
// region it stands in, as every component does; with it the host sets the
// region for this field alone -- a compact panel asks for 'compact' instead of
// shrinking the field with size '1/2', which C22 forbids. Anything else is no
// density at all.


const DENSITIES = new Set(['compact', 'normal']);

const densityOption = options => DENSITIES.has(options?.density) ? options.density : ''; // `options.apply` ('instant' when a change acts at once) chose the yes/no
// control until C303 (4); the field's template chooses it now, and the option
// is accepted and not read.
//
// `options.align`: 'end' for a number edited where numbers stand at the end of
// the line -- a table cell edited in place (C294: a form starts the digits, a
// table ends them). A number, a money amount and a percent are then typed at
// the end of the field with figures of one width, as the column shows them.


let EDIT_ALIGN_END = false; // A control that stays a control when it may not be changed: a choice as
// buttons shows which button is chosen, which is what it is for, where the
// view's badge would show a different thing (port 1.16.0).

const keepsControlWhenLocked = (asked, field) => asked === 'choice' && isChoiceButtons(field); // `options.disabled`: the control is drawn disabled, not read-only -- a field a
// condition turns off for now (port 1.14.0 `when.enabled`), which the host
// knows and the field does not carry. Read by the controls that draw the two
// differently; for every other one a disabled field is a read-only one.


let EDIT_DISABLED = false; // `options.error`: what is wrong with the field now, a sentence, or empty (PD-1,
// property type study «Дата»). A control that says its own error (sf-input-date
// for a date, a datetime and a time; since 1.22.0 the yes/no -- sf-switch,
// sf-checkbox, the «Да» | «Нет» sf-segmented -- and the file's sf-file-upload
// and sf-input-image, field orders FO-1) is drawn invalid with the sentence
// under it, the error-message of the field family, so a host that is not sf-form --
// a record card -- marks the field itself instead of writing a line under a
// field with a normal border. sf-form keeps setting invalid on the controls it
// draws, as before.

let EDIT_ERROR = ''; // The controls the set draws that say `options.error` themselves, invalid and
// the sentence under them (read by sf-form, which gives them its errors and
// draws no line of its own under them): the field family's, and since 1.22.0
// the yes/no and file ones (FO-1).

const OWN_ERROR_CONTROLS = Object.freeze(['sf-input-date', 'sf-input-image', 'sf-switch', 'sf-checkbox', 'sf-segmented', 'sf-file-upload']);
function renderEditField(field = {}, value, host, options = {}) {
  // A single-field edit (a table cell, a card's quick edit) gives the
  // record's values (options.values): the field's conditions decide it
  // there as in a form (FO3-4) -- hidden, nothing is drawn; not enabled,
  // its value as text; required as they say.
  if (field?.when && options?.values && typeof options.values === "object") {
    const decided = (0,_conditions_js__WEBPACK_IMPORTED_MODULE_14__.fieldConditions)(field, options.values);
    if (!decided.visible) return null;
    field = { ...field,
      required: decided.required,
      readonly: field.readonly === true || !decided.enabled
    };
  }

  const asked = (0,_templates_js__WEBPACK_IMPORTED_MODULE_7__.resolveField)(field).type;
  const disabled = options?.disabled === true; // A field the person may not change is shown, not offered as a control that
  // refuses: the same rule for every type, so `readonly` means one thing
  // wherever the registry lists it.

  if ((field.readonly === true || disabled) && VIEW_RENDERERS[asked] && !keepsControlWhenLocked(asked, field)) {
    return renderViewField(field, value, host, options);
  }

  const renderer = EDIT_RENDERERS[asked];
  if (!renderer || !host?.setFieldValue) return null;
  const outer = EDIT_SIZE;
  const outerDisabled = EDIT_DISABLED;
  const outerPicker = EDIT_PICKER;
  const outerAlign = EDIT_ALIGN_END;
  const outerError = EDIT_ERROR;
  EDIT_SIZE = sizeOption(options);
  EDIT_ERROR = typeof options?.error === 'string' ? options.error.trim() : '';
  EDIT_DISABLED = disabled; // `options.picker: 'dropdown'`: the record, relation, user and paged lookup
  // fields drawn as before C139, a searchable sf-dropdown (until 2027-01-01).

  EDIT_PICKER = options?.picker === 'dropdown' ? 'dropdown' : '';
  EDIT_ALIGN_END = options?.align === 'end';

  try {
    return inDensity(renderer(field, value, host), densityOption(options));
  } finally {
    EDIT_SIZE = outer;
    EDIT_DISABLED = outerDisabled;
    EDIT_PICKER = outerPicker;
    EDIT_ALIGN_END = outerAlign;
    EDIT_ERROR = outerError;
  }
} // A density asked for one field is a region around it that draws no box of its
// own: the variables of the density rules (core/scss/_sf_css__density.scss)
// stand on it and every part of the control inherits them, the popups it opens
// read it (core/js/density.js densityOf), and the control lays out in the
// host's flex or grid as if the wrapper were not there. No density, no wrapper:
// what a host had is unchanged.

function inDensity(content, density) {
  if (!density || content == null) return content;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-field-density" style="display: contents" data-sf-density=${density}>${content}</div>`;
} // The view template: a field shown and not edited, which is the fourth of the
// four the assignment names and the last one the set was missing.
//
// It renders lit templates rather than the host-shaped values the cell template
// returns, because its consumer is a record view rendering into its own layout,
// exactly as the edit template's is. The cell template returns host shapes only
// because sf-view-table already had a path for those.
//
// `line` and not `size` for everything that sits beside a label on one text
// line -- a badge, a tag, an avatar, a reference link. A size would give those a
// control's height and stand them taller than the words next to them, which is
// the mistake the cell template already avoids one rung down. The two that are
// not inline keep their own scale: a scale bar is a control, and a file preview
// has no visual size at all, its `size` being a legacy name for the file's size
// as text.
// The line a viewed value is drawn on: 1, or 1/2 with {size: '1/2'}, as above.


let VIEW_LINE = '1'; // A scalar may arrive as the value itself or as {value, text}: the data and the
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
} // Formatted text shown: the value cleaned by sf-input-rich's own rule first,
// and only that cleaned string drawn as markup -- never the value as it came,
// which a host may have stored from anywhere. What is left is the subset:
// paragraphs, headings, emphasis, lists, quotes and links with a safe address.


function renderHtmlView(field, value) {
  const clean = (0,_html_js__WEBPACK_IMPORTED_MODULE_10__.cleanHtml)(value);
  return clean ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-field-view sf-field-html">${(0,lit_directives_unsafe_html_js__WEBPACK_IMPORTED_MODULE_1__.unsafeHTML)(clean)}</div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
} // A number in the page's language (set boundary study, 2026-11-17): «12,5 кг»
// on a Russian page, «12.5 kg» on an English one, through Intl with every
// digit the value has (decimal.js formatDecimal, never through a float on the
// way). The host's formatFieldValue and a value's own text still win; what is
// not a number is shown as it came.


function numberText(field, value, host) {
  const formatted = host?.formatFieldValue?.(field, value);
  if (typeof formatted === 'string') return formatted;
  if (carriesText(value)) return value.text;
  return (0,_decimal_js__WEBPACK_IMPORTED_MODULE_12__.formatDecimal)(scalarValue(value), (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageLocale)(host ?? null)) || viewText(field, value, null);
} // A percent as the number's scale or meter (step 5), 0..100; else null.


function levelView(field, value) {
  const variant = templateOf(field);
  if (variant !== 'scale' && variant !== 'meter') return null;
  const raw = scalarValue(value);
  const number = Number(raw);
  if (raw === null || raw === undefined || raw === '' || !Number.isFinite(number) || number < 0 || number > 100) return null;
  if (variant === 'scale') return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-progress-scale size="1" value=${String(number)}></sf-progress-scale>`;
  const {
    label
  } = meterProps(field, number);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-progress-bar inline meter value=${String(number)} label=${label || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}></sf-progress-bar>`;
} // A number carries its unit when the field declares one, and nothing when it
// does not -- the set does not guess at a unit, and «42» with an invented «шт»
// beside it is a worse answer than «42».


function renderNumberView(field, value, host) {
  if (value === null || typeof value === 'undefined' || value === '') return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const variant = templateOf(field); // The scale needs the number, not the host's text for it.

  const number = Number(scalarValue(value));

  if (variant === 'scale' && Number.isFinite(number) && number >= 0 && number <= 100) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-progress-scale size="1" value=${String(number)}></sf-progress-scale>`;
  }

  if (variant === 'meter' && Number.isFinite(number) && number >= 0 && number <= 100) {
    const {
      label,
      status
    } = meterProps(field, number);
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-progress-bar inline meter value=${String(number)} label=${label || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} status=${status || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}></sf-progress-bar>`;
  }

  const text = numberText(field, value, host);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-field-view">${field.unit ? `${text} ${field.unit}` : text}</span>`;
} // A date is the host's to format first: formatFieldValue wins, and so does a
// value that carries its own text. Without it the set used to print the stored
// form -- «2026-10-25T10:30:00+03:00» (simai/ui-source#34) -- so a host that
// formats nothing gets the page's medium reading through core format-date:
// «2 нояб. 2026 г.» / «Nov 2, 2026» for a date, «15 нояб. 2026 г., 10:30» /
// «Nov 15, 2026, 10:30 AM» for a datetime, the form the View set's table
// printed before the renderers formatted dates (C19: the set formats, the
// table inherits). The day and the clock are the record's own (datetime.js
// reads them as written, in the host's zone): nothing is moved to the reader's
// time zone, which would show a different day near midnight. A value that is
// not a date at all is shown as it came, never guessed at.
//
// `format` is the field's display setting (PD-3): the length of the date,
// Intl's dateStyle in the page's language -- short «17.11.2026» / «11/17/26»,
// medium (the default) «17 нояб. 2026 г.» / «Nov 17, 2026», long «17 ноября
// 2026 г.» / «November 17, 2026», full with the weekday. A datetime keeps its
// clock beside it. It is read by the view and the cell; the edit control
// types the locale's digits whatever it says. Any other value is medium, and
// the host's formatFieldValue or text still wins.


const DATE_FORMATS = new Set(['short', 'medium', 'long', 'full']);

function dateFormatOf(field) {
  const format = String(field?.format ?? '').trim();
  return DATE_FORMATS.has(format) ? format : 'medium';
}

function defaultDateText(field, value, host) {
  if (carriesText(value)) return null;
  const parts = (0,_datetime_js__WEBPACK_IMPORTED_MODULE_8__.splitDateTime)(value);
  if (!parts.known || !parts.date) return null;
  const [year, month, day] = parts.date.split('-').map(Number);
  const locale = (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageLocale)(host ?? null);

  try {
    const date = new Date(0);
    date.setUTCFullYear(year, month - 1, day);
    const type = field?.propertyType || field?.type || field?.dataType;
    const dateStyle = dateFormatOf(field);
    if (type !== 'datetime' || !parts.time) return (0,_core_js_format_date_js__WEBPACK_IMPORTED_MODULE_4__.formatDate)(date, {
      intl: {
        dateStyle,
        timeZone: 'UTC'
      },
      locale
    }) || null;
    const [hours, minutes] = parts.time.split(':').map(Number);
    date.setUTCHours(hours, minutes, 0, 0);
    return (0,_core_js_format_date_js__WEBPACK_IMPORTED_MODULE_4__.formatDate)(date, {
      intl: {
        dateStyle,
        timeStyle: 'short',
        timeZone: 'UTC'
      },
      locale
    }) || null;
  } catch {
    return null;
  }
}

function dateText(field, value, host) {
  const formatted = host?.formatFieldValue?.(field, value);
  if (typeof formatted === 'string') return formatted;
  return defaultDateText(field, value, host) ?? viewText(field, value, null);
} // The machine reading of a date (C40: every moment the Framework prints is a
// time element): the record's own day and clock as written, «2026-11-15» or
// «2026-11-15T10:30», with no zone, because the view never moves a record to
// the reader's zone. That is also why the view is not sf-time, which reads a
// moment in the reader's zone: a date near midnight would show another day.
// '' when the value is no date.


function dateTimeAttribute(field, value) {
  const parts = (0,_datetime_js__WEBPACK_IMPORTED_MODULE_8__.splitDateTime)(value);
  if (!parts.known || !parts.date) return '';
  const type = field?.propertyType || field?.type || field?.dataType;
  return type === 'datetime' && parts.time ? `${parts.date}T${parts.time}` : parts.date;
}

function renderDateView(field, value, host) {
  const text = dateText(field, value, host);
  if (!text) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const datetime = dateTimeAttribute(field, value);
  return datetime ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<time class="sf-field-view" datetime=${datetime}>${text}</time>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-field-view">${text}</span>`;
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
  const badge = (0,_helpers_option_badge_js__WEBPACK_IMPORTED_MODULE_2__.optionBadgeProps)(option); // A table cell is a dense place: the badge keeps the tight side room
  // (sf-badge tight), as it had before sf-badge 1.3.0 widened the default.

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-badge
                line=${VIEW_LINE}
                tight
                appearance=${badgeAppearanceOf(field)}
                scheme=${badge.scheme}
                style=${badge.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                text=${String(option.label ?? option.text ?? value)}
        ></sf-badge>
    `;
} // The values wrap, each tag as wide as its text: on one unwrapping line a
// role's 137 rights shrank every tag to a letter and the text ran down the
// panel (Larena, 2026-10-17). The tag's painted root is the flex item (the
// host is display: contents), so it is told not to shrink through root-class.
// No disclosure for a long list here: a record's
// field in view is the button that opens its group, and a control inside a
// button is not one.
// Tags and badges of one value stand 4 apart (C105 H5 tags, --sf-space-1/4;
// FW-3: they stood 8, the buttons' gap). The badges template draws each value
// as its option's badge, in the option's colour, as the cell does.


function renderChoicesView(field, value) {
  if (!Array.isArray(value) || !value.length) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const options = field.options || field.filter?.options || field.constraints?.options;

  const optionOf = item => Array.isArray(options) ? options.find(candidate => String(candidate?.value) === String(item && typeof item === 'object' ? item.value : item)) : null;

  const label = item => {
    const option = optionOf(item);
    if (item && typeof item === 'object' && item.text !== undefined) return String(item.text);
    return String(option?.label ?? option?.text ?? (item && typeof item === 'object' ? item.value : item));
  };

  const badges = templateOf(field) === 'badges';
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <span class="sf-field-view flex flex-wrap items-cross-center gap-1/4 min-w-0">
            ${value.map(item => {
    if (!badges) return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-tag root-class="flex-none" line=${VIEW_LINE} kind="default" text=${label(item)}></sf-tag>`;
    const option = optionOf(item);
    const badge = option ? (0,_helpers_option_badge_js__WEBPACK_IMPORTED_MODULE_2__.optionBadgeProps)(option) : null;
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-badge line=${VIEW_LINE} tight appearance=${badgeAppearanceOf(field)}
                        scheme=${badge?.scheme || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} style=${badge?.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} text=${label(item)}></sf-badge>`;
  })}
        </span>
    `;
} // A person, as in a cell: the name links to the person when the host gives
// the href -- every value that points at a record opens it (owner,
// 2026-10-14). Plain, as a reference read in a record's field is.


function renderUserView(field, value) {
  if (!value || typeof value !== 'object' || !value.label) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <span class="sf-field-view flex items-cross-center gap-1/3">
            <sf-avatar line=${VIEW_LINE} text=${value.avatarText || ''} heading=${String(value.label)}></sf-avatar>
            ${value.href ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-reference-link appearance="plain" icon="" line=${VIEW_LINE}
                        label=${String(value.label)} href=${String(value.href)}></sf-reference-link>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span>${String(value.label)}</span>`}
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
} // A value from a reference list reads as its label; several read as their
// labels, each a tag as a list of choices does. Not a link: nothing opens from a
// country or a status.


function renderLookupView(field, value) {
  const items = lookupItems(field, value);
  if (!items.length) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  if (items.length === 1 && field.multiple !== true) return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-field-view">${items[0].label}</span>`;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <span class="sf-field-view flex flex-wrap items-cross-center gap-1/3 min-w-0">
            ${items.map(item => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-tag root-class="flex-none" line=${VIEW_LINE} kind="default" text=${item.label}></sf-tag>`)}
        </span>
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
  const card = templateOf(field) === 'image_card';
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
  string: renderStringView,
  phone: renderPhoneView,
  password: renderPasswordView,
  url: renderUrlView,
  link: renderLinkView,
  'ru.inn': renderInnView,
  text: renderTextView,
  html: renderHtmlView,
  number: renderNumberView,
  date: renderDateView,
  datetime: renderDateView,
  time: renderDateView,
  boolean: renderBooleanView,
  choice: renderChoiceView,
  choices: renderChoicesView,
  user: renderUserView,
  record: renderReferenceView,
  relation: renderReferenceView,
  lookup: renderLookupView,
  file: renderFileView,
  color: renderColorView,
  include: renderIncludeView,
  money: renderMoneyView,
  percent: renderPercentView
}; // A field shown rather than edited. `host` is optional and used for one thing
// only -- formatFieldValue, where a consumer's own formatting of a number or a
// date belongs. Null when the set has no view for that type.
// A column total (owner decision C294, MP-12): the table owns its totals
// row, the set gives the sum by the digits and its display. Money is summed
// per currency -- a column of dollars and euros is two lines, never one
// number -- and a number or an integer is one sum; a percent, a choice or a
// text has no total (null). `values` are the column's stored values; what is
// not a number is left out.

function renderTotalField(field = {}, values = [], host) {
  const type = (0,_templates_js__WEBPACK_IMPORTED_MODULE_7__.resolveField)(field).type;
  const locale = (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageLocale)(host ?? null);
  const list = (Array.isArray(values) ? values : []).map(value => scalarValue(value));

  if (type === 'money') {
    const totals = (0,_decimal_js__WEBPACK_IMPORTED_MODULE_12__.moneyTotals)(list, field, locale);
    return totals.length ? totals.map(total => total.text) : null;
  }

  if (type !== 'number') return null;
  const numbers = list.filter(value => value !== null && value !== undefined && value !== '' && (0,_decimal_js__WEBPACK_IMPORTED_MODULE_12__.readTypedDecimal)(value).ok);
  if (!numbers.length) return null;
  const sum = (0,_decimal_js__WEBPACK_IMPORTED_MODULE_12__.addDecimal)(numbers);
  if (sum === null) return null; // The total keeps the field's unit as the cells print it («13 шт»): a
  // number keeps its unit in every place (cards study CV-7; DEV, group build
  // 12 acceptance: the table footer printed a bare «26»).

  const text = (0,_decimal_js__WEBPACK_IMPORTED_MODULE_12__.formatDecimal)(sum, locale);
  const unit = fieldUnit(field);
  return [unit ? `${text} ${unit}` : text];
} // Whether a type is a number a table aligns to the end of the line with
// figures of one width (the registry's `numeric`, C294 MP-12).

function isNumericType(type) {
  return Boolean((0,_templates_js__WEBPACK_IMPORTED_MODULE_7__.typeEntry)(type)?.numeric);
} // A former type name (integer, compound) has the modes of the type it reads as.

function propertyModes(type) {
  const own = _registry_js__WEBPACK_IMPORTED_MODULE_5__.TYPE_ALIASES[type]?.type ?? type;
  return (0,_registry_js__WEBPACK_IMPORTED_MODULE_5__.modesOf)(own, {
    view: VIEW_RENDERERS,
    edit: EDIT_RENDERERS,
    cell: CELL_RENDERERS,
    filter: FILTER_RENDERERS
  });
} // What a field is drawn with (C302): {type, template, params} -- the type
// after its former names, the template the field names when the type has it
// and the field fits it (else the default), and the templateParams. A host
// that offers a template switch reads it to show the template drawn.

function fieldTemplate(field = {}) {
  const {
    type,
    template,
    params
  } = (0,_templates_js__WEBPACK_IMPORTED_MODULE_7__.resolveField)(field);
  return {
    type,
    template,
    params
  };
}

 // The window's content per property type (owner decision C310): the
// condition first (C293), then only what the condition needs -- the list of
// a list property, one field of a string, one or two of a number; nothing
// for не задано / задано. A boolean is three rows, one choice, no condition.
// A type with a window of its own (a date) keeps its filter control.
//
// The top of the window (owner decision C313, variant В4): the condition is
// sf-dropdown's band (appearance band, FF-11) -- grey edge to edge, the
// height of the search row, its text at the rows' edge, the chevron at the
// end, a hairline under it -- opening its menu at exactly its own width
// (list-width trigger, FF-10) in rows of the window's size; a long list (ten
// and more) keeps its search. Under it the search on the window background,
// as in sf-dropdown's open list (sf-input-choice panel), or, without a
// search, the value row in its place. The band is the dropdown's own field:
// one control, one Tab stop (FF-9).
// The colour (owner decision C314): only an unusual condition tints the band
// -- excluding error red, presence tertiary purple, the scheme's -container
// (the fill family, 12 % light, 24 % dark) through the band's public
// variable; the text keeps the text ink. Every menu item carries an 8 px dot
// of its condition's colour, grey for the rest.

function renderConditionControl(field, host, conditions, selected) {
  if (conditions.length < 2) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const tone = (0,_filter_conditions_js__WEBPACK_IMPORTED_MODULE_16__.filterConditionTone)(selected);
  const style = tone ? `--sf-dropdown-background-color: var(--sf-${tone}-container)` : '';
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-dropdown class="sf-filter-window-condition" size=${filterSize(host)} appearance="band" mode="select"
            search=${conditions.length >= 10 ? 'true' : 'false'} list-width="trigger" aria-label=${setText(host, 'filterCondition')}
            data-tone=${tone || 'neutral'} style=${style || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            .options=${conditions.map(operator => ({
    value: operator,
    text: host.getFilterOperatorLabel(operator),
    label: host.getFilterOperatorLabel(operator),
    dot: (0,_filter_conditions_js__WEBPACK_IMPORTED_MODULE_16__.filterConditionTone)(operator) || 'neutral'
  }))}
            value=${selected}
            @change=${event => {
    const operator = event.detail?.values?.[0] || event.detail?.value || selected;
    if (operator !== selected) host.patchTempFilterValue(field.key, {
      operator
    });
  }}></sf-dropdown>`;
}

function currencySign(field, host) {
  const code = typeof field.currency === 'string' ? field.currency : field.currency?.code;
  if (!code) return '';

  try {
    return new Intl.NumberFormat((0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageLocale)(host ?? null) || 'ru-RU', {
      style: 'currency',
      currency: code
    }).formatToParts(0).find(part => part.type === 'currency')?.value || code;
  } catch {
    return code;
  }
} // The value row (C313 (4)): where the search would stand, at its height, on
// the window background with no frame -- one field, or two read as words,
// «от … до …». The row's line turns primary while a field in it has the focus,
// as the search's does.


const VALUE_ROW_STYLE = 'min-block-size: calc(var(--sf-ui-1--control-height) + 2 * var(--sf-space-1\\/4)); padding: var(--sf-space-1\\/4) calc(var(--sf-space-1\\/4) + var(--sf-space-1\\/2)); box-sizing: border-box; color: var(--sf-on-surface-variant)';

function valueRow(content) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-filter-window-value flex items-cross-center gap-1/3" style=${VALUE_ROW_STYLE}>${content}</div>`;
}

function renderStringWindow(field, host, value, operator) {
  return valueRow((0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-input size=${filterSize(host)} appearance="plain" root-class="flex-1 min-w-0" aria-label=${`${field.label || field.key}: ${host.getFilterOperatorLabel(operator)}`}
            placeholder=${setText(host, 'filterTextPlaceholder')}
            value=${typeof value.value === 'string' ? value.value : ''} name="sf_filter_${field.key || 'text'}"
            @change=${event => host.patchTempFilterValue(field.key, {
    operator,
    value: event.target?.value || ''
  })}></sf-input>`);
} // A number or an amount (C294: an amount is compared inside its currency,
// whose sign the fields carry): «от … до …», or one field.


function renderNumberWindow(field, host, value, operator) {
  const sign = currencySign(field, host);

  const named = text => sign ? `${text}, ${sign}` : text;

  const label = field.label || field.key;

  if (operator !== 'between') {
    const one = Array.isArray(value.value) ? value.value[0] : value.value;
    return valueRow((0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-input size=${filterSize(host)} appearance="plain" root-class="flex-1 min-w-0" inputmode="decimal"
                aria-label=${named(`${label}: ${host.getFilterOperatorLabel(operator)}`)} placeholder=${sign || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                value=${one ?? ''} name="sf_filter_${field.key || 'number'}"
                @change=${event => host.patchTempFilterValue(field.key, {
      operator,
      value: event.target?.value || ''
    })}></sf-input>`);
  }

  const range = Array.isArray(value.value) ? value.value : [value.value ?? '', ''];

  const patch = (index, next) => {
    const both = [range[0] ?? '', range[1] ?? ''];
    both[index] = next || '';
    host.patchTempFilterValue(field.key, {
      operator,
      value: both
    });
  };

  const from = setText(host, 'rangeFromWord');
  const to = setText(host, 'rangeToWord');
  return valueRow((0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-filter-window-word" aria-hidden="true">${from}</span>
        <sf-input size=${filterSize(host)} appearance="plain" root-class="flex-1 min-w-0" inputmode="decimal" placeholder=${sign || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                  aria-label=${named(`${label}: ${from}`)} value=${range[0] ?? ''} name="sf_filter_${field.key || 'number'}" @change=${event => patch(0, event.target?.value)}></sf-input>
        <span class="sf-filter-window-word" aria-hidden="true">${to}</span>
        <sf-input size=${filterSize(host)} appearance="plain" root-class="flex-1 min-w-0" inputmode="decimal" placeholder=${sign || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                  aria-label=${named(`${label}: ${to}`)} value=${range[1] ?? ''} name="sf_filter_${field.key || 'number'}_second" @change=${event => patch(1, event.target?.value)}></sf-input>`);
} // A boolean (C310, C312 (2), C313 (5)): Да / Нет / Не задано, one choice, no
// condition band and no search; a press applies, as a menu item does, with
// no footer. While a condition is set, «Снять условие» is the last row.


function renderBooleanWindow(field, host, value) {
  const words = {
    yes: field.trueText ?? field.labels?.true ?? setText(host, 'yes'),
    no: field.falseText ?? field.labels?.false ?? setText(host, 'no')
  };
  const operator = (0,_filter_conditions_js__WEBPACK_IMPORTED_MODULE_16__.filterCondition)(field, value);
  const one = Array.isArray(value.values) ? value.values[0] : value.value;
  const chosen = operator === 'empty' ? 'empty' : one === true || String(one) === 'true' ? 'true' : one === false || String(one) === 'false' ? 'false' : '';
  const items = [{
    value: 'true',
    label: words.yes
  }, {
    value: 'false',
    label: words.no
  }, {
    value: 'empty',
    label: setText(host, 'filterNotSet')
  }];
  if (chosen) items.push({
    value: 'reset',
    label: setText(host, 'filterRemoveCondition')
  });
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-input-choice appearance="list" flow="column" panel aria-label=${field.label || field.key || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            control-position="end"
            .items=${items}
            .value=${chosen}
            @change=${event => {
    const next = event.detail?.value ?? event.detail?.values?.[0] ?? '';
    const patch = next === 'empty' ? {
      operator: 'empty',
      value: undefined,
      values: undefined
    } : {
      operator: 'eq',
      value: next === 'true',
      values: undefined
    };
    if (next === 'reset') host.resetFilter?.();else if (typeof host.applyTempFilterValue === 'function') host.applyTempFilterValue(field.key, patch);else host.patchTempFilterValue(field.key, patch);
  }}></sf-input-choice>`;
}
/** A filter field's window content (C310, C313): the condition band, then what it needs. */


function renderFilterWindowField(field = {}, host) {
  const kind = (0,_filter_conditions_js__WEBPACK_IMPORTED_MODULE_16__.filterKindOf)(field);
  if (kind === 'own') return renderFilterField(field, host);
  const value = host.getFilterControlValue(field.key) || {};
  if (kind === 'boolean') return windowFields(host, renderBooleanWindow(field, host, value));
  const conditions = (0,_filter_conditions_js__WEBPACK_IMPORTED_MODULE_16__.filterConditions)(field);
  const operator = (0,_filter_conditions_js__WEBPACK_IMPORTED_MODULE_16__.filterCondition)(field, value);
  const control = (0,_filter_conditions_js__WEBPACK_IMPORTED_MODULE_16__.filterValueless)(operator) ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : kind === 'string' ? renderStringWindow(field, host, value, operator) : kind === 'number' ? renderNumberWindow(field, host, value, operator) : renderChoiceFilterControl(field, host);
  return windowFields(host, (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${renderConditionControl(field, host, conditions, operator)}${control}`);
} // The window's parts reach its edges (C313): the band, the search's and the
// list's hairlines. A phone's sheet pads its body; there they reach past that
// inset to the sheet's edges, as the popover's do to its own, and the rows
// stand at the panel's inset from the sheet's edge. The list scrolls inside
// (min-block-size 0 down to it).

function windowFields(host, content) {
  const style = host.sheet ? 'min-block-size: 0; margin-inline: calc(-1 * var(--sf-drawer--inset-start)) calc(-1 * var(--sf-drawer--inset-end))' : 'min-block-size: 0';
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-filter-window-fields flex flex-col" style=${style}>${content}</div>`;
}
/** A filter field's window opened from any control (FO-5, filter-window.js): settles {action: 'apply' | 'reset', value} or null. */


function openFilterWindow(options = {}) {
  const field = options.field || {};
  return (0,_filter_window_js__WEBPACK_IMPORTED_MODULE_15__.filterWindowOpen)({
    width: (0,_filter_conditions_js__WEBPACK_IMPORTED_MODULE_16__.filterWidth)(field),
    kind: (0,_filter_conditions_js__WEBPACK_IMPORTED_MODULE_16__.filterKindOf)(field),
    ...options,
    renderControl: renderFilterWindowField,
    // A boolean applies on a press and has no footer (C312 (2)).
    footer: (0,_filter_conditions_js__WEBPACK_IMPORTED_MODULE_16__.filterKindOf)(field) !== 'boolean',
    // «Применить (N)»: the chosen values of a list condition only (C310).
    count: value => (0,_filter_conditions_js__WEBPACK_IMPORTED_MODULE_16__.filterKindOf)(field) === 'own' ? Array.isArray(value?.values) ? value.values.length : 0 : (0,_filter_conditions_js__WEBPACK_IMPORTED_MODULE_16__.filterCount)(field, value)
  });
}
/**
 * What a filter field button shows after applying (C300, C310), for the
 * list head that draws it: {active, count, words} -- the colour while
 * active, the number only for a list condition, the words for its tooltip.
 */

function filterFieldSummary(field = {}, value = {}, node = null) {
  const options = Array.isArray(field.filter?.options) ? field.filter.options : [];
  const names = new Map(options.map(option => [String(option.value ?? option.id ?? option.key ?? option.label), option.label || option.title || String(option.value ?? '')]));
  return (0,_filter_conditions_js__WEBPACK_IMPORTED_MODULE_16__.filterSummary)(field, value, {
    label: operator => (0,_filter_window_js__WEBPACK_IMPORTED_MODULE_15__.filterOperatorLabel)(operator, node, (0,_filter_conditions_js__WEBPACK_IMPORTED_MODULE_16__.filterKindOf)(field)),
    name: one => names.get(one) ?? one,
    yes: field.trueText ?? (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageText)(SET_TEXT, 'yes', node, SET_NAME),
    no: field.falseText ?? (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageText)(SET_TEXT, 'no', node, SET_NAME)
  });
}

function renderViewField(field = {}, value, host, options = {}) {
  const asked = (0,_templates_js__WEBPACK_IMPORTED_MODULE_7__.resolveField)(field).type;
  const renderer = VIEW_RENDERERS[asked];
  if (!renderer) return null;
  const outer = VIEW_LINE;
  VIEW_LINE = sizeOption(options);

  try {
    return inDensity(renderer(field, value, host), densityOption(options));
  } finally {
    VIEW_LINE = outer;
  }
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
    renderTotalField,
    FILTER_RENDERERS,
    // The nine number conditions in the filter's order (C294).
    NUMBER_FILTER_OPERATORS: _registry_js__WEBPACK_IMPORTED_MODULE_5__.NUMBER_FILTER_OPERATORS,
    isNumericType,
    // Decimal strings as the set reads and shows them (C294): the View
    // set's items, compound and ru.requisites call these instead of
    // keeping a copy. format(value), money(value, field), percent(value)
    // take a locale (the page's when absent); read(text, {locale,
    // currency}) reads what a person typed or pasted; add(...values) and
    // compare(a, b) work by the digits; totals(values, field) sums money
    // per currency; currency(code, locale, display) is {sign, before, minor}.
    decimal: {
      format: (value, locale) => (0,_decimal_js__WEBPACK_IMPORTED_MODULE_12__.formatDecimal)(value, locale || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageLocale)(null)),
      money: (value, field = {}, locale) => (0,_decimal_js__WEBPACK_IMPORTED_MODULE_12__.formatMoney)(value, field, locale || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageLocale)(null)),
      percent: (value, locale) => (0,_decimal_js__WEBPACK_IMPORTED_MODULE_12__.formatPercent)(value, locale || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageLocale)(null)),
      read: (text, options = {}) => (0,_decimal_js__WEBPACK_IMPORTED_MODULE_12__.readTypedDecimal)(text, {
        locale: (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageLocale)(null),
        ...options
      }),
      add: _decimal_js__WEBPACK_IMPORTED_MODULE_12__.addDecimal,
      compare: _decimal_js__WEBPACK_IMPORTED_MODULE_12__.compareDecimal,
      totals: (values, field = {}, locale) => (0,_decimal_js__WEBPACK_IMPORTED_MODULE_12__.moneyTotals)(values, field, locale || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageLocale)(null)),
      currency: (code, locale, display) => (0,_decimal_js__WEBPACK_IMPORTED_MODULE_12__.currencyOf)(code, locale || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageLocale)(null), display)
    },
    // The date filter's rules (C293): the chip's words, when an entry is
    // empty, the request with its context, a period's days.
    dateFilter: {
      conditions: _date_filter_js__WEBPACK_IMPORTED_MODULE_18__.dateFilterConditions,
      chipText: _date_filter_js__WEBPACK_IMPORTED_MODULE_18__.dateFilterChipText,
      isEmptyEntry: _date_filter_js__WEBPACK_IMPORTED_MODULE_18__.isEmptyFilterEntry,
      normalizeEntry: _date_filter_js__WEBPACK_IMPORTED_MODULE_18__.normalizeFilterEntry,
      requestContext: _date_filter_js__WEBPACK_IMPORTED_MODULE_18__.filterRequestContext,
      buildRequest: _date_filter_js__WEBPACK_IMPORTED_MODULE_18__.buildFilterRequest,
      resolvePeriod: _date_filter_js__WEBPACK_IMPORTED_MODULE_18__.resolveDatePeriod,
      periods: _date_filter_js__WEBPACK_IMPORTED_MODULE_18__.DATE_PERIODS,
      futurePeriods: _date_filter_js__WEBPACK_IMPORTED_MODULE_18__.DATE_FUTURE_PERIODS
    },
    // A datetime's value read and written back, for a host that draws its
    // own control: split(value), compose(stored, {date, time}),
    // normalizeTime(text); and a time of day's: splitTime(value),
    // composeTime(stored, text).
    dateTime: {
      split: _datetime_js__WEBPACK_IMPORTED_MODULE_8__.splitDateTime,
      compose: _datetime_js__WEBPACK_IMPORTED_MODULE_8__.composeDateTime,
      normalizeTime: _datetime_js__WEBPACK_IMPORTED_MODULE_8__.normalizeTime,
      splitTime: _datetime_js__WEBPACK_IMPORTED_MODULE_8__.splitTime,
      composeTime: _datetime_js__WEBPACK_IMPORTED_MODULE_8__.composeTime
    },
    // A field's when (FO-3): fieldConditions(field, values) answers
    // {visible, required, enabled} over the values on screen;
    // editable(field, values) whether a single-field edit opens (FO3-4).
    conditions: {
      evaluate: _conditions_js__WEBPACK_IMPORTED_MODULE_14__.evaluateCondition,
      field: _conditions_js__WEBPACK_IMPORTED_MODULE_14__.fieldConditions,
      fields: _conditions_js__WEBPACK_IMPORTED_MODULE_14__.conditionFields,
      ops: _conditions_js__WEBPACK_IMPORTED_MODULE_14__.CONDITION_OPS,
      editable: _conditions_js__WEBPACK_IMPORTED_MODULE_14__.fieldEditable
    },
    // A filter field's window from any control (FO-5): open({anchor,
    // field, value, size, placement}) settles {action, value} or null.
    // summary(field, value) {active, count, words} is what the filter
    // field button shows (C300, C310); conditions(field) what a window offers.
    filterWindow: {
      open: openFilterWindow,
      operatorLabel: _filter_window_js__WEBPACK_IMPORTED_MODULE_15__.filterOperatorLabel,
      summary: filterFieldSummary,
      conditions: _filter_conditions_js__WEBPACK_IMPORTED_MODULE_16__.filterConditions,
      count: _filter_conditions_js__WEBPACK_IMPORTED_MODULE_16__.filterCount,
      tone: _filter_conditions_js__WEBPACK_IMPORTED_MODULE_16__.filterConditionTone
    },
    // The universal properties, each with the modes the set draws for it
    // and its templates, the default first (C302).
    registry: _registry_js__WEBPACK_IMPORTED_MODULE_5__.PROPERTY_TYPES.map(entry => ({ ...entry,
      modes: propertyModes(entry.type)
    })),
    // C302, C303: the four places a template draws in; the former type and
    // template names read until 2027-01-01; what a field is drawn with.
    places: _registry_js__WEBPACK_IMPORTED_MODULE_5__.PLACES,
    aliases: {
      types: _registry_js__WEBPACK_IMPORTED_MODULE_5__.TYPE_ALIASES,
      templates: _registry_js__WEBPACK_IMPORTED_MODULE_5__.TEMPLATE_ALIASES
    },
    fieldTemplate
  }; // The set's words in the page's language are asked for now, not at the
  // first word a host draws (field orders FO-4): the set is a module, not an
  // element, so nothing drew a filter again when its words arrived, and a
  // Russian page that lets core fetch its language (no core/lang/ru.js)
  // showed «Contains…», «From», «To» until the host redrew by chance.
  // SF.whenFieldRenderers() waits for them (core.runtime, at most
  // SF_BOOT_CONFIG.languageWait ms).

  (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageText)(SET_TEXT, 'containsText', null, SET_NAME); // SF.whenFieldRenderers() settles on this, whichever bundle published the set.

  globalThis.document?.dispatchEvent?.(new CustomEvent('sf-field-renderers-ready'));
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "dd6973f77245"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   maskPattern: () => (/* binding */ maskPattern),
/* harmony export */   maskState: () => (/* binding */ maskState)
/* harmony export */ });
// Whether a masked string is complete (simai.property-view-port 1.16.0,
// field.mask). sf-input formats what a person types through the Framework's
// mask (core/js/mask.js) and reports the text as shown; what the set still has
// to know is whether that text fills every place of the pattern, because an
// incomplete value is not a value -- «+7 (912) 3» is neither a phone nor
// nothing -- and a panel must not send it.
//
// The grammar is core/js/mask.js's, read the same way: `0` a digit, `a` a
// letter, `*` any character, `\` escapes the next character, `{` `}` mark a
// fixed part that belongs to the value and `[` `]` an optional tail, both
// dropped from what is shown, and every other character is a fixed part shown
// in the field. The pattern is compiled into one expression over the shown
// text rather than re-running the formatter: the formatter's job is to make a
// valid prefix out of anything typed, which is exactly the question it cannot
// answer -- every prefix is valid while it is typed. A pattern's optional tail
// is not optional here: the contract names no optional places, and a tail
// that may be left empty would make «complete» mean two lengths.
//
// The text is compared as shown, fixed parts included, because that is the
// value the host receives. A text with the template's placeholders (a
// mask-lazy="false" field shows «+7 (___) ___-__-__») is incomplete, and a
// template with nothing typed into it is empty.
const SLOT = {
  0: '\\d',
  a: '\\p{L}',
  '*': '[\\s\\S]'
};
const TEST = {
  0: character => /\d/u.test(character),
  a: character => /\p{L}/u.test(character),
  '*': () => true
}; // Unicode mode refuses an escaped character that is not syntax, so only these.

const escape = character => character.replace(/[\\^$.*+?()[\]{}|/]/gu, '\\$&');

function compile(pattern) {
  let source = '';
  const tokens = [];

  for (let index = 0; index < pattern.length; index += 1) {
    const character = pattern[index];

    if (character === '\\') {
      index += 1;

      if (index < pattern.length) {
        source += escape(pattern[index]);
        tokens.push({
          fixed: pattern[index]
        });
      }
    } else if (character === '{' || character === '}' || character === '[' || character === ']') {// Markers of the grammar, never shown.
    } else if (SLOT[character]) {
      source += SLOT[character];
      tokens.push({
        test: TEST[character]
      });
    } else {
      source += escape(character);
      tokens.push({
        fixed: character
      });
    }
  }

  return {
    complete: new RegExp(`^${source}$`, 'u'),
    tokens
  };
} // How many places the text fills, read as core/js/mask.js reads it: a
// character that is the fixed part expected there is that fixed part, a
// placeholder in a place is an empty place, anything else fills the next place
// that takes it. A «7» typed into «+7 (000)» is a digit, not the fixed 7.


function filled(value, tokens, placeholder) {
  let count = 0;
  let pointer = 0;

  for (const character of value) {
    while (pointer < tokens.length && tokens[pointer].fixed !== undefined && tokens[pointer].fixed !== character) pointer += 1;

    if (pointer >= tokens.length) break;
    const token = tokens[pointer];
    if (token.fixed !== undefined) pointer += 1;else if (character === placeholder) pointer += 1;else if (token.test(character)) {
      count += 1;
      pointer += 1;
    }
  }

  return count;
}

const COMPILED = new Map();
function maskPattern(field) {
  const mask = field?.mask;
  return typeof mask === 'string' && mask !== '' ? mask : null;
} // 'empty', 'complete' or 'incomplete'. Empty is a text with nothing typed into
// it: no text, or only the pattern's fixed parts and placeholders.

function maskState(text, pattern, placeholder = '_') {
  const value = String(text ?? '');
  if (!COMPILED.has(pattern)) COMPILED.set(pattern, compile(pattern));
  const {
    complete,
    tokens
  } = COMPILED.get(pattern);
  if (complete.test(value)) return 'complete';
  return filled(value, tokens, placeholder) === 0 ? 'empty' : 'incomplete';
}

/***/ },

/***/ "25be1c2df717"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   formatPhone: () => (/* binding */ formatPhone),
/* harmony export */   phoneDialCode: () => (/* binding */ phoneDialCode),
/* harmony export */   phoneE164: () => (/* binding */ phoneE164),
/* harmony export */   phoneSearchText: () => (/* binding */ phoneSearchText),
/* harmony export */   splitPhone: () => (/* binding */ splitPhone)
/* harmony export */ });
// A telephone number, stored and shown (FL-1, FL-7 of the property page study,
// 2026-11-17). Larena keeps a phone in E.164 -- `+79161234567`, a plus and the
// digits, nothing else (Larena decision 2026-10-24) -- and so does every form
// that submits sf-input-country (standard simai.smart-component §17.1 item 2).
// The edit control used to write the text as the box showed it,
// `+7 916 123-45-67`, so opening a record and saving it changed the stored
// value. Edit writes E.164 now; view and cell lay the number out by its
// country, as the box does, and read the formatted strings stored before.
// The national part of each dial code's number, laid out as sf-input-country
// lays it out (its `formatByPattern`): `0` is a digit, anything else is
// written as it stands. Derived from src/component/country-code/data/countries.json
// -- each dial code's pattern without its own code; where countries share a
// code, the country the code means (+7 Russia, +1 the United States, +44
// Britain) -- and held equal to it by tests/phone-e164-fl.contract.test.mjs,
// so the set carries 2 KB instead of the 54 KB table.
const PATTERNS = [['0 00 00 00', '46'], ['0 00 00 00 00', '33 212 237'], ['0 000 00 00', '386'], ['0 000 000', '95 248 265 291 359 961 967 975'], ['0 000 0000', '36 64 66 389 599 850 962 964 970 971'], ['0 0000 000', '385'], ['0 0000 0000', '61 63 886'], ['0 000000', '252'], ['0 0000000', '51 53 591'], ['0 00000000', '20'], ['0 000000000', '43'], ['0-000-0000', '82 593 972'], ['0-0000 0000', '60'], ['0-0000-0000', '81'], ['0-0000000', '880 977'], ['0/000 000 00', '421'], ['00 00 0 00000', '225'], ['00 00 00', '299 508 681'], ['00 00 00 00', '32 45 47 213 222 223 224 226 227 228 235 236 241 253 257 352 377 689'], ['00 00 00 00 00', '229'], ['00 00 000 00', '261'], ['00 00 0000', '509'], ['00 00-00-00', '993'], ['00 000', '682 688'], ['00 000 00 00', '41 48 221 994 995 998'], ['00 000 000', '216 231 258 264 355 371 373 382 383 855 856'], ['00 000 0000', '27 31 40 93 233 242 249 251 255 351 595 963 966'], ['00 000-000', '387'], ['00 0000', '672'], ['00 0000 0000', '30 39 86 98'], ['00 0000-0000', '54 55'], ['00 00000', '243 263 353'], ['00 000000', '49 232 357 374 381 968'], ['00 0000000', '62 254 256 358'], ['00 00000000', '92'], ['00-000', '676'], ['00-0000000', '218'], ['00.00.00', '687'], ['000 00 00', '238 269 423'], ['000 00 00 00', '34 262 590 594 596'], ['000 00 0000', '992'], ['000 00-00-00', '375'], ['000 000', '376'], ['000 000 00 00', '90'], ['000 000 000', '56 94 211 240 244 245 250 260 420 996'], ['000 000 0000', '44 52'], ['000 000-00-00', '7'], ['000 0000', '220 239 246 267 297 354 372 592 670 673 674 675 679 680 691'], ['000 0000 000', '84'], ['000 00000', '350 370'], ['000 0000000', '57'], ['000-000', '597'], ['000-000-0000', '1'], ['000-0000', '501 507 692 960'], ['000-0000000', '58'], ['0000', '683 690'], ['0000 00 0000', '234'], ['0000 0000', '65 230 266 268 356 502 503 505 506 598 852 853 965 973 974 976'], ['0000 00000', '380'], ['0000 000000', '378'], ['0000-0000', '504'], ['00000', '290 500 677 678 685 686'], ['00000 00000', '91'], ['000000', '298']];
const NATIONAL = new Map();

for (const [pattern, codes] of PATTERNS) for (const code of codes.split(' ')) NATIONAL.set(code, pattern);

const digitsOf = text => String(text ?? '').replace(/\D/gu, ''); // An extension rides after the number: Larena writes `+73472468500;ext=12`
// (RFC 3966), and a person may have typed «доб. 12» or «ext. 12». Its digits
// are not the number's: read into the number they made `+7347246850012`.


const EXTENSION = /\s*(?:;\s*ext\s*=\s*|,?\s*(?:ext|доб)\.?\s*)(\d+)\s*$/iu;
/** The number and its extension apart: {number, extension}; extension '' for none. */

function splitPhone(value) {
  const text = String(value ?? '').trim();
  const match = text.match(EXTENSION);
  if (!match || !/\d/u.test(text.slice(0, match.index))) return {
    number: text,
    extension: ''
  };
  return {
    number: text.slice(0, match.index).trim(),
    extension: match[1]
  };
}

function numberE164(text) {
  const digits = digitsOf(text);
  if (!digits) return '';
  if (text.startsWith('+')) return `+${digits}`;
  if (/^00[1-9]/u.test(text.replace(/[\s\-().]/gu, ''))) return `+${digits.slice(2)}`;
  return text;
}
/**
 * The number in E.164: `+` and the digits. A text that starts with `+` (or the
 * international `00`) is a full number, laid out however it was:
 * `+7 916 123-45-67`, `+7 (916) 123 45 67` and `+79161234567` are one number.
 * A text without a country code is returned as it came, trimmed: which country
 * it belongs to is not the renderer's to guess. Empty for no digits. An
 * extension is kept as `;ext=<digits>`: `+7 347 246-85-00 доб. 12` is
 * `+73472468500;ext=12`.
 */


function phoneE164(value) {
  const {
    number,
    extension
  } = splitPhone(value);
  const e164 = numberE164(number);
  return extension && e164.startsWith('+') ? `${e164};ext=${extension}` : extension ? String(value ?? '').trim() : e164;
}
/**
 * What a phone filter searches for (field orders FO-3): the stored form, so a
 * number typed however it is laid out finds the E.164 it is kept as -- a full
 * number is its E.164 (`+7 (916) 123-45-67` is `+79161234567`), a part of
 * one its digits (`916 123-45` is `91612345`). Empty for no digits.
 */

function phoneSearchText(value) {
  const {
    number
  } = splitPhone(value);
  const e164 = numberE164(number);
  return e164.startsWith('+') ? e164 : digitsOf(number);
}
/** The dial code (digits) an E.164 number starts with: the longest one known. */

function phoneDialCode(e164) {
  const digits = digitsOf(e164);

  for (let length = Math.min(4, digits.length); length > 0; length -= 1) {
    if (NATIONAL.has(digits.slice(0, length))) return digits.slice(0, length);
  }

  return '';
}
/**
 * The number as a person reads it: `+79161234567` reads `+7 916 123-45-67`,
 * by the country its code names. Digits beyond the pattern stay at the end, a
 * number is never cut; an unknown code reads `+<digits>`; a number without a
 * country code is shown as it came. An extension follows the number after the
 * page language's word for it (`extensionWord`, «доб.» on a Russian page).
 */

function formatPhone(value, extensionWord = 'ext.') {
  const {
    number,
    extension
  } = splitPhone(value);
  const main = formatNumber(number);
  if (!extension || !main.startsWith('+')) return extension && !main.startsWith('+') ? String(value ?? '').trim() : main;
  return `${main} ${extensionWord} ${extension}`;
}

function formatNumber(value) {
  const e164 = numberE164(String(value ?? '').trim());
  if (!e164.startsWith('+')) return e164;
  const digits = e164.slice(1);
  const code = phoneDialCode(e164);
  if (!code) return e164;
  const rest = digits.slice(code.length);
  if (!rest) return `+${code}`;
  let out = '',
      index = 0;

  for (const char of NATIONAL.get(code)) {
    if (index >= rest.length) break;
    out += char === '0' ? rest[index++] : char;
  }

  return `+${code} ${out}${rest.slice(index)}`.trimEnd();
}

/***/ },

/***/ "fc654eb7fab0"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ALIASES_UNTIL: () => (/* binding */ ALIASES_UNTIL),
/* harmony export */   DATE_FILTER_OPERATORS: () => (/* binding */ DATE_FILTER_OPERATORS),
/* harmony export */   DATE_FUTURE_OPERATORS: () => (/* binding */ DATE_FUTURE_OPERATORS),
/* harmony export */   NUMBER_FILTER_OPERATORS: () => (/* binding */ NUMBER_FILTER_OPERATORS),
/* harmony export */   PLACES: () => (/* binding */ PLACES),
/* harmony export */   PROPERTY_TYPES: () => (/* binding */ PROPERTY_TYPES),
/* harmony export */   STRING_VARIANT_TYPES: () => (/* binding */ STRING_VARIANT_TYPES),
/* harmony export */   TEMPLATE_ALIASES: () => (/* binding */ TEMPLATE_ALIASES),
/* harmony export */   TIME_FILTER_OPERATORS: () => (/* binding */ TIME_FILTER_OPERATORS),
/* harmony export */   TYPE_ALIASES: () => (/* binding */ TYPE_ALIASES),
/* harmony export */   modesOf: () => (/* binding */ modesOf)
/* harmony export */ });
/* harmony import */ var _lang_index_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("354525e80715");
// The registry of universal properties (owner, 2026-10-15): every property
// type the Framework renders, or a component set renders beside it (`set`),
// its variants and the parameters a field of it reads -- one list a host
// (Larena's fields and settings), the property workbench and the documentation
// read, instead of each learning the types from the renderers' source. Which
// modes a type has is not written here: it is read from the renderer maps
// themselves (modesOf), so the registry cannot claim a mode the set does not
// draw. A contract keeps the two the same.
//
// `params` are the field keys the type's renderers read -- each one, and no
// other (the probe field-renderer-params calls them with a field that records
// what is read). A record, a relation and a user hold one value and take their
// candidates from the host, not from `options`; a constraint other than a
// choice's options is the host's to enforce, not a renderer's.
// The names of the types and variants live in the set's language files
// (localization study LC-5); `label` keeps its {ru, en} shape for the hosts
// that read it. English is built in; the Russian name is read from the words
// the ru language file registered for sf-field-renderers (owner decision
// C282), English until it is on the page.


const registeredName = (code, key) => globalThis.__sfPageLanguage?.registered?.get?.('sf-field-renderers')?.get?.(code)?.[key];

const typeLabel = key => Object.freeze(Object.defineProperties({}, {
  ru: {
    enumerable: true,
    get: () => _lang_index_mjs__WEBPACK_IMPORTED_MODULE_0__["default"].ru?.[key] ?? registeredName('ru', key) ?? _lang_index_mjs__WEBPACK_IMPORTED_MODULE_0__["default"].en[key]
  },
  en: {
    enumerable: true,
    value: _lang_index_mjs__WEBPACK_IMPORTED_MODULE_0__["default"].en[key]
  }
})); // Owner decisions C302 and C303 (2026-11-17; catalogue: ui-control research
// 2026-11-17-type-template-catalogue): a type stores and checks the value, a
// template only draws it and never changes the data. Each type lists the
// templates the Framework draws, the default first; a template says which of
// the four places it changes -- view (Показ), compact (Кратко, the table cell
// and the cards), edit (Правка), filter (Фильтр) -- and the template
// parameters (`templateParams`) it reads. A field names one template with
// `template`; without it, or with one the type does not have, the default
// draws (templates.js resolveField). `variants` is the former list of the
// non-default templates under their former ids, kept for hosts that read it
// until 2027-01-01.
//
// C303: a type of its own only where storage, checking or filter conditions
// differ; a setting fixed when the field is created is part of the type
// (`decimals` of a number, 0 for a whole one; `multiple`). integer is read as
// number with decimals 0, compound as complex, a string with variant phone or
// password as the phone or password type, until 2027-01-01 (TYPE_ALIASES).


const PLACES = Object.freeze(['view', 'compact', 'edit', 'filter']);
const ALL_PLACES = PLACES; // The filter place's conditions (step 4 of the catalogue): a type whose
// filter is a condition first and then what the condition needs lists the
// operators in the list's order and the one shown before any is chosen.
// What travels is {operator, value}. A type without `conditions` is filtered
// by its options (a choice, a user) or searched as text.
//
//   date, datetime   owner decision C293 (date-filter.js): a day, two days,
//                    a period by name, a number of days, empty / not empty;
//                    a deadline field (filter.future: true) adds `future`
//   time             a time of day «hh:mm», two of them (both ends in),
//                    earlier, later, empty / not empty
//   number, money, percent   owner decision C294: the nine number conditions
//   password         set (not-empty) or not set (empty), value true

const DATE_FILTER_OPERATORS = Object.freeze(['eq', 'between', 'lt', 'gt', 'gte', 'lte', 'period', 'last-days', 'empty', 'not-empty']);
const DATE_FUTURE_OPERATORS = Object.freeze(['next-days']);
const TIME_FILTER_OPERATORS = Object.freeze(['eq', 'between', 'lt', 'gt', 'empty', 'not-empty']);
const NUMBER_FILTER_OPERATORS = Object.freeze(['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'between', 'empty', 'not-empty']);

const conditions = (operators, byDefault, extra = {}) => Object.freeze({
  operators,
  default: byDefault,
  ...extra
});

const DATE_CONDITIONS = conditions(DATE_FILTER_OPERATORS, 'between', {
  future: DATE_FUTURE_OPERATORS
});
const NUMBER_CONDITIONS = conditions(NUMBER_FILTER_OPERATORS, 'eq');

const template = (type, id, {
  places = ALL_PLACES,
  params = [],
  fits = '',
  legacy = null,
  isDefault = false
} = {}) => Object.freeze({
  id,
  label: typeLabel(`template-${type}-${id}`),
  default: isDefault,
  places: Object.freeze([...places]),
  params: Object.freeze([...params]),
  ...(fits ? {
    fits
  } : {}),
  ...(legacy ? {
    legacy
  } : {})
});

const byDefault = (type, id, options = {}) => template(type, id, { ...options,
  isDefault: true
}); // The former variant list: the non-default templates under the id a host sent
// as `variant` (image-card for image_card), until 2027-01-01.


const variantsOf = (type, templates) => templates.filter(one => !one.default).map(one => Object.freeze({
  id: one.legacy ?? one.id,
  label: typeLabel(`variant-${type}-${one.legacy ?? one.id}`)
}));

const entry = spec => {
  const templates = Object.freeze(spec.templates);
  return Object.freeze({ ...spec,
    templates,
    variants: Object.freeze(spec.variants ?? variantsOf(spec.type, templates))
  });
};

const PROPERTY_TYPES = Object.freeze([// mask (property-view port 1.16.0): the Framework mask grammar of
// sf-input's mask-pattern; the value is the text as shown, fixed parts
// included, and an incomplete one is reported, not written as a value.
// nullable: false makes a cleared masked field write "" instead of null.
entry({
  type: 'string',
  label: typeLabel('type-string'),
  templates: [byDefault('string', 'input')],
  params: ['placeholder', 'mask', 'nullable', 'required', 'readonly']
}), // phone (C302 (1)): the number in E.164, «+79161234567», an extension
// after «;ext=». defaultCountry (FL-7): the country an empty field starts
// on, ISO 3166 alpha-2; without it, the page's.
entry({
  type: 'phone',
  label: typeLabel('type-phone'),
  templates: [byDefault('phone', 'phone_input')],
  params: ['defaultCountry', 'required', 'readonly']
}), // password (C302 (1)): write-only. The host never sends the password; the
// value it sends is {set: true} or {set: false} (null reads as not set),
// and the set shows only «задан»/«не задан». An edit writes the typed text
// through setFieldValue and writes nothing for a field nobody typed in.
entry({
  type: 'password',
  label: typeLabel('type-password'),
  writeOnly: true,
  templates: [byDefault('password', 'input')],
  conditions: conditions(Object.freeze(['not-empty', 'empty']), 'not-empty'),
  params: ['placeholder', 'required', 'readonly']
}), // url, link and ru.inn (catalogue step 3): types Larena stores and checks
// (url@1, link@1, ru.inn@1) that the Framework drew as strings. url is an
// absolute http(s) address, at most 2048 bytes, without a login in it;
// link is {href, text?}, href an http(s) address, a path from the site's
// root or an #anchor; ru.inn is 10 digits (an organisation) or 12 (a
// person) with the tax service's check digits, `holder` (any,
// organization, person) fixed when the field is created. The rules are
// text-types.js; each is searched as text in the filter.
entry({
  type: 'url',
  label: typeLabel('type-url'),
  templates: [byDefault('url', 'input')],
  params: ['placeholder', 'required', 'readonly']
}), entry({
  type: 'link',
  label: typeLabel('type-link'),
  templates: [byDefault('link', 'link')],
  params: ['required', 'readonly']
}), entry({
  type: 'ru.inn',
  label: typeLabel('type-ru.inn'),
  templates: [byDefault('ru.inn', 'input')],
  params: ['holder', 'placeholder', 'required', 'readonly']
}), entry({
  type: 'text',
  label: typeLabel('type-text'),
  templates: [byDefault('text', 'textarea', {
    params: ['rows']
  })],
  params: ['placeholder', 'required', 'readonly']
}), // html (property-view port 1.17.0): formatted text, an HTML string of
// sf-input-rich's subset. Edited with sf-input-rich, shown cleaned by that
// component's own rule, a cell its text on one line, filtered as text.
entry({
  type: 'html',
  label: typeLabel('type-html'),
  templates: [byDefault('html', 'editor')],
  params: ['placeholder', 'required', 'readonly']
}), // number (C303 (2)): one type; `decimals` is fixed when the field is
// created, 0 for a whole number (integer reads as number with decimals 0).
// stepper: sf-input-quantity, «−» and «+» and the arrow keys; min, max and
// step are read by it. scale and meter: a value 0..100, the level scale
// and the share of a limit (C203 (5)); they fit a field whose bounds, when
// it declares them, are 0 and 100.
// numeric (C294, MP-12): a number a table aligns to the end of the line
// with figures of one width -- number, money and percent.
entry({
  type: 'number',
  label: typeLabel('type-number'),
  numeric: true,
  templates: [byDefault('number', 'input'), template('number', 'stepper', {
    places: ['edit']
  }), template('number', 'scale', {
    places: ['view', 'compact'],
    fits: 'bounds-0-100'
  }), template('number', 'meter', {
    places: ['view', 'compact'],
    fits: 'bounds-0-100'
  })],
  conditions: NUMBER_CONDITIONS,
  // The meter's thresholds low, high and optimum are the HTML meter's
  // (msg-bc1702eb), read by that template alone.
  params: ['decimals', 'unit', 'min', 'max', 'step', 'precision', 'low', 'high', 'optimum', 'required', 'readonly']
}), // date (PD-2, PD-3): min and max bound the day, an ISO date (the day of a
// date and time is read); format is the length the view and the cell print
// the date in, Intl's dateStyle: short, medium (the default), long, full.
entry({
  type: 'date',
  label: typeLabel('type-date'),
  templates: [byDefault('date', 'datepicker')],
  conditions: DATE_CONDITIONS,
  params: ['min', 'max', 'format', 'required', 'readonly']
}), // datetime and time: sf-input-date in mode datetime and time (1.4.0). min
// and max bound the value -- an ISO date or date and time for a datetime,
// hh:mm for a time -- and step is the minute step, 1 to 60. A datetime's
// format is its date's length, as a date's; the clock stays short.
entry({
  type: 'datetime',
  label: typeLabel('type-datetime'),
  templates: [byDefault('datetime', 'datepicker')],
  conditions: DATE_CONDITIONS,
  params: ['min', 'max', 'step', 'format', 'required', 'readonly']
}), // time (step 4): its own conditions, not a text search -- «Равно»,
// «Между» (both ends in), «Раньше», «Позже», «Пусто», «Не пусто».
entry({
  type: 'time',
  label: typeLabel('type-time'),
  templates: [byDefault('time', 'timepicker')],
  conditions: conditions(TIME_FILTER_OPERATORS, 'between'),
  params: ['min', 'max', 'step', 'required', 'readonly']
}), // boolean (C303 (4)): the switch is the default; the checkbox, and the
// buttons «Да» | «Нет» where «not set» differs from «no», are templates
// the administrator picks. trueText and falseText are the words of every
// template's view, cell and buttons.
entry({
  type: 'boolean',
  label: typeLabel('type-boolean'),
  templates: [byDefault('boolean', 'switch', {
    params: ['trueText', 'falseText']
  }), template('boolean', 'checkbox', {
    places: ['edit']
  }), template('boolean', 'buttons', {
    places: ['edit']
  })],
  variants: [],
  params: ['trueText', 'falseText', 'required', 'readonly']
}), // buttons (property-view port 1.16.0): one segmented button group, a
// button per option, sized by `size` on the ladder ("1/2", "1", "2"; absent,
// the field's); it wraps when the buttons do not fit; pressing the chosen
// one again clears a field that is not required. badge: the look of the
// value's badge, tonal (default) or outline.
entry({
  type: 'choice',
  label: typeLabel('type-choice'),
  templates: [byDefault('choice', 'dropdown', {
    params: ['badge']
  }), template('choice', 'buttons', {
    places: ['edit'],
    params: ['size']
  })],
  params: ['options', 'required', 'readonly']
}), // choices: the dropdown is the default, and a list of 13 options or more
// is a checklist under it; checklist asks for the checklist at any length;
// badges draws the values as badges in their options' colours.
entry({
  type: 'choices',
  label: typeLabel('type-choices'),
  templates: [byDefault('choices', 'dropdown', {
    params: ['badge'],
    legacy: 'select'
  }), template('choices', 'checklist', {
    places: ['edit']
  }), template('choices', 'badges', {
    places: ['view', 'compact'],
    params: ['badge']
  })],
  variants: [{
    id: 'badges',
    label: typeLabel('variant-choices-badges')
  }, {
    id: 'checklist',
    label: typeLabel('variant-choices-checklist')
  }, {
    id: 'select',
    label: typeLabel('variant-choices-select')
  }],
  params: ['options', 'required', 'readonly']
}), entry({
  type: 'user',
  label: typeLabel('type-user'),
  templates: [byDefault('user', 'reference_picker')],
  params: ['placeholder', 'searchPlaceholder', 'required', 'readonly']
}), entry({
  type: 'record',
  label: typeLabel('type-record'),
  templates: [byDefault('record', 'reference_picker')],
  params: ['placeholder', 'searchPlaceholder', 'required', 'readonly']
}), entry({
  type: 'relation',
  label: typeLabel('type-relation'),
  templates: [byDefault('relation', 'reference_picker')],
  params: ['placeholder', 'searchPlaceholder', 'required', 'readonly']
}), // lookup: a value chosen from a reference list the host keeps -- a country,
// a status, a contract type (Larena, 2026-10-23). It is not a record: the
// value is {value, label} and nothing opens from it. Small lists arrive as
// `options` and are chosen from in place; anything larger is paged and
// searched by the host, from the source the field names (`source`, which the
// host reads and no renderer does).
entry({
  type: 'lookup',
  label: typeLabel('type-lookup'),
  templates: [byDefault('lookup', 'source_picker')],
  params: ['options', 'multiple', 'placeholder', 'searchPlaceholder', 'required', 'readonly']
}), // file: image, image_card and image_list are the same stored file drawn as
// a picture (image-card and image-list are their former ids until
// 2027-01-01). required: read by the image template alone, whose control
// is sf-input-image -- a required, empty one keeps its form from submitting.
entry({
  type: 'file',
  label: typeLabel('type-file'),
  templates: [byDefault('file', 'upload'), template('file', 'image', {
    places: ['view', 'compact', 'edit']
  }), template('file', 'image_card', {
    places: ['view', 'compact'],
    legacy: 'image-card'
  }), template('file', 'image_list', {
    places: ['view', 'compact'],
    legacy: 'image-list'
  })],
  params: ['accept', 'multiple', 'formats', 'uploadText', 'uploadSupportingText', 'uploadHint', 'required', 'readonly']
}), entry({
  type: 'color',
  label: typeLabel('type-color'),
  templates: [byDefault('color', 'color_picker', {
    params: ['swatches']
  })],
  params: ['required', 'readonly']
}), // include: code the host keeps in a file; `script` is the default (the
// catalogue's decision), language and rows its template parameters.
entry({
  type: 'include',
  label: typeLabel('type-include'),
  templates: [byDefault('include', 'script', {
    params: ['language', 'rows']
  })],
  params: ['required', 'readonly']
}), // money and percent (owner decisions C291 (2) and C294, 2026-11-17): the
// Framework's in every mode -- view, cell, edit and filter. Every number
// is a decimal string, never a float. money is {amount, currency}:
// `currency` fixes an ISO 4217 code (a bare amount is then read in it, and
// no currency is offered); `currencies` lists the codes a value may carry
// (absent: every ISO 4217 code, with a search); `currencyDisplay` is how
// the currency is written -- symbol (default: «₽», «$», «CA$»), code or
// name; the digits after the point are at most the currency's minor units
// (more is a field error, never rounded); min and max bound the amount.
// percent is the percent ("12.5" is 12,5 %), bounded only by min and max;
// its digits after the point are `decimals` (`precision`, its former
// name), else those of `step`.
entry({
  type: 'money',
  label: typeLabel('type-money'),
  numeric: true,
  templates: [byDefault('money', 'money_input')],
  conditions: NUMBER_CONDITIONS,
  params: ['currency', 'currencies', 'currencyDisplay', 'min', 'max', 'placeholder', 'required', 'readonly']
}), // percent (step 5): the number's templates -- stepper, scale and meter,
// the last two for a percent 0..100 (a growth of 150 % keeps the input).
// It had no former variants.
entry({
  type: 'percent',
  label: typeLabel('type-percent'),
  numeric: true,
  templates: [byDefault('percent', 'input'), template('percent', 'stepper', {
    places: ['edit']
  }), template('percent', 'scale', {
    places: ['view', 'compact'],
    fits: 'bounds-0-100'
  }), template('percent', 'meter', {
    places: ['view', 'compact'],
    fits: 'bounds-0-100'
  })],
  variants: [],
  conditions: NUMBER_CONDITIONS,
  params: ['decimals', 'min', 'max', 'step', 'precision', 'placeholder', 'required', 'readonly']
}), // The types a component set draws (property-view port 1.18.0; Larena
// property types standard, notes of 2026-11-03): `set` names the set whose
// components show and edit them -- the View set's sf-view-properties -- and
// the Framework draws their table cells and filters (items by its number
// of rows). `params` are the keys the type reads, in the set's renderers
// and in these. complex is the former compound (the Bitrix name, C302
// catalogue), read under that name until 2027-01-01.
entry({
  type: 'items',
  label: typeLabel('type-items'),
  set: 'view',
  templates: [byDefault('items', 'rows')],
  params: ['columns', 'minRows', 'maxRows', 'required', 'readonly']
}), entry({
  type: 'complex',
  label: typeLabel('type-complex'),
  set: 'view',
  templates: [byDefault('complex', 'parts')],
  params: ['parts', 'required', 'readonly']
}), entry({
  type: 'ru.requisites',
  label: typeLabel('type-ru.requisites'),
  set: 'view',
  templates: [byDefault('ru.requisites', 'requisites')],
  params: ['parts', 'required', 'readonly']
})]); // Former names, read until 2027-01-01 with one console warning each (C302
// (3), C303 (2)). A type alias may carry the settings it stands for.

const ALIASES_UNTIL = '2027-01-01';
const TYPE_ALIASES = Object.freeze({
  integer: Object.freeze({
    type: 'number',
    settings: Object.freeze({
      decimals: 0
    })
  }),
  compound: Object.freeze({
    type: 'complex',
    settings: Object.freeze({})
  })
}); // A string with one of these variants is that type.

const STRING_VARIANT_TYPES = Object.freeze({
  phone: 'phone',
  password: 'password'
}); // Former template ids per type: the variant names hosts sent.

const TEMPLATE_ALIASES = Object.freeze(Object.fromEntries(PROPERTY_TYPES.map(one => [one.type, Object.fromEntries(one.templates.filter(item => item.legacy).map(item => [item.legacy, item.id]))]).filter(([, map]) => Object.keys(map).length))); // The modes a type has, read from the renderer maps: view and edit (a record),
// cell (a table) and filter -- `own` when the set has a filter control for the
// type, `text` when a filter falls back to a text search.

function modesOf(type, maps) {
  return {
    view: Boolean(maps.view?.[type]),
    edit: Boolean(maps.edit?.[type]),
    cell: maps.cell?.[type] ? 'own' : 'text',
    filter: maps.filter?.[type] ? 'own' : 'text'
  };
}

/***/ },

/***/ "22825a8607d0"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   askedType: () => (/* binding */ askedType),
/* harmony export */   resolveField: () => (/* binding */ resolveField),
/* harmony export */   templateParam: () => (/* binding */ templateParam),
/* harmony export */   typeEntry: () => (/* binding */ typeEntry)
/* harmony export */ });
/* harmony import */ var _registry_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("fc654eb7fab0");
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("d3818183b14c");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_1__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_1__);
// A field's type and template as the renderers draw them (owner decisions C302
// and C303, 2026-11-17). The field description names a type (`propertyType`,
// or `type`, `dataType`) and one template (`template`) with its parameters
// (`templateParams`); this reads the former names on the way and settles what
// a renderer draws:
//
//   variant              read as `template` until 2027-01-01
//   string + variant phone / password      the phone / password type
//   integer              number with decimals 0
//   compound             complex
//   select, image-card, image-list         dropdown, image_card, image_list
//
// Each former name is said once per page in the console and noted in
// SF.deprecations (sf-field-renderers). A template the type does not have, or
// one that does not fit the field, draws as the type's default and is said
// once per type and template: `template_fallback:<type>.<template>` (C302 (2);
// the common property types standard §3). Larena decides which templates fit
// a field; the Framework checks only what it can read off the field.
//
// Nothing here changes the field: the host keeps the object it passed, and
// setFieldValue and getFieldValue are called with it.


const SET_NAME = 'sf-field-renderers';
const BY_TYPE = new Map(_registry_js__WEBPACK_IMPORTED_MODULE_0__.PROPERTY_TYPES.map(entry => [entry.type, entry])); // Every bundle carries its own copy of this module; the page hears each
// warning once whichever copy draws (memory: bundles each carry their own
// module copy), so the said keys live on one shared global.

function saidOnce(key) {
  const root = globalThis.SF = globalThis.SF || {};

  if (!(root.__fieldTemplateNotes instanceof Set)) {
    Object.defineProperty(root, '__fieldTemplateNotes', {
      value: new Set(),
      configurable: true
    });
  }

  if (root.__fieldTemplateNotes.has(key)) return false;

  root.__fieldTemplateNotes.add(key);

  return true;
}

function sayFormer(key, from, to, message) {
  (0,_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_1__.noteDeprecated)({
    component: SET_NAME,
    kind: 'value',
    attribute: key,
    from,
    to,
    since: '2026-11-17',
    remove_after: _registry_js__WEBPACK_IMPORTED_MODULE_0__.ALIASES_UNTIL
  });

  if (saidOnce(`former|${key}|${from}`)) {
    globalThis.console?.warn?.(`[SIMAI Framework] sf-field-renderers: ${message} until ${_registry_js__WEBPACK_IMPORTED_MODULE_0__.ALIASES_UNTIL}.`);
  }
}

function sayFallback(type, asked, fallback, why) {
  if (!saidOnce(`fallback|${type}|${asked}`)) return;
  globalThis.console?.warn?.(`[SIMAI Framework] template_fallback:${type}.${asked} -- ${why}; drawn as ${type}.${fallback}.`);
}
/** The type a field asks for, as written: propertyType, type, dataType. */


function askedType(field = {}) {
  return field?.propertyType || field?.type || field?.dataType;
}

const text = value => value === null || value === undefined ? '' : String(value).trim(); // What a template needs of a field that the Framework can read (the rest of
// a fit rule is Larena's): a scale or a meter draws a value 0..100, so it
// fits a field that does not bound itself otherwise.


const FITS = {
  'bounds-0-100': field => {
    const bound = value => value === null || value === undefined || value === '' ? null : Number(value);

    const min = bound(field.min);
    const max = bound(field.max);
    return (min === null || min === 0) && (max === null || max === 100);
  }
};
/**
 * The type, the template and the template parameters a field is drawn with.
 * `type` is the registered type (or the asked one when it is not registered:
 * a filter control, a host's own); `template` is a template of that type,
 * never empty for a registered type; `decimals` is a number's digits after
 * the point when the field fixes them (an integer: 0); `former` names the
 * former spelling it came in (for a choices `select`, which keeps the
 * dropdown at any length).
 */

function resolveField(field = {}, {
  quiet = false
} = {}) {
  field = field || {};
  const asked = askedType(field);
  let type = asked;
  let decimals = null;
  let former = '';
  const variant = text(field.variant ?? field.filter?.variant);
  let wanted = text(field.template);

  if (_registry_js__WEBPACK_IMPORTED_MODULE_0__.TYPE_ALIASES[type]) {
    const alias = _registry_js__WEBPACK_IMPORTED_MODULE_0__.TYPE_ALIASES[type];
    if (!quiet) sayFormer('type', type, alias.type, `type "${type}" is read as ${alias.type}${type === 'integer' ? ' with decimals 0' : ''}; write propertyType "${alias.type}"${type === 'integer' ? ' and decimals: 0' : ''}`);
    if (Number.isInteger(alias.settings.decimals)) decimals = alias.settings.decimals;
    type = alias.type;
  }

  if (type === 'string' && _registry_js__WEBPACK_IMPORTED_MODULE_0__.STRING_VARIANT_TYPES[variant] && !wanted) {
    if (!quiet) sayFormer('type', `string.${variant}`, _registry_js__WEBPACK_IMPORTED_MODULE_0__.STRING_VARIANT_TYPES[variant], `a string with variant "${variant}" is read as the ${_registry_js__WEBPACK_IMPORTED_MODULE_0__.STRING_VARIANT_TYPES[variant]} type; write propertyType "${_registry_js__WEBPACK_IMPORTED_MODULE_0__.STRING_VARIANT_TYPES[variant]}"`);
    return {
      type: _registry_js__WEBPACK_IMPORTED_MODULE_0__.STRING_VARIANT_TYPES[variant],
      template: BY_TYPE.get(_registry_js__WEBPACK_IMPORTED_MODULE_0__.STRING_VARIANT_TYPES[variant]).templates[0].id,
      params: paramsOf(field),
      decimals: null,
      former: variant,
      asked
    };
  }

  if (!wanted && variant) {
    if (!quiet) sayFormer('field', 'variant', 'template', 'the field key "variant" is read as "template"; write template and templateParams');
    wanted = variant;
    former = variant;
  }

  const aliases = _registry_js__WEBPACK_IMPORTED_MODULE_0__.TEMPLATE_ALIASES[type];

  if (wanted && aliases?.[wanted]) {
    if (!quiet) sayFormer('template', `${type}.${wanted}`, `${type}.${aliases[wanted]}`, `template "${wanted}" of ${type} is read as "${aliases[wanted]}"`);
    former = former || wanted;
    wanted = aliases[wanted];
  }

  if (type === 'number' || type === 'percent') {
    const own = Number.isInteger(field.decimals) ? field.decimals : Number.isInteger(field.precision) ? field.precision : null;
    if (own !== null) decimals = own;
  }

  const entry = BY_TYPE.get(type);
  if (!entry) return {
    type,
    template: wanted,
    params: paramsOf(field),
    decimals,
    former,
    asked
  };
  const fallback = entry.templates[0].id;
  let template = fallback;

  if (wanted) {
    const known = entry.templates.find(one => one.id === wanted);

    if (!known) {
      if (!quiet) sayFallback(type, wanted, fallback, `${type} has no template "${wanted}" in SIMAI Framework`);
    } else if (known.fits && FITS[known.fits] && !FITS[known.fits](field)) {
      if (!quiet) sayFallback(type, wanted, fallback, `the field does not fit "${wanted}" (${known.fits})`);
    } else {
      template = known.id;
    }
  }

  return {
    type,
    template,
    params: paramsOf(field),
    decimals,
    former,
    asked
  };
} // templateParams, with the former field keys a template parameter had:
// badgeAppearance is badge; trueText, falseText, size, language, swatches
// stood on the field itself.

const FORMER_PARAMS = {
  badge: 'badgeAppearance',
  trueText: 'trueText',
  falseText: 'falseText',
  size: 'size',
  language: 'language',
  swatches: 'swatches',
  rows: 'rows'
};

function paramsOf(field) {
  const own = field.templateParams && typeof field.templateParams === 'object' && !Array.isArray(field.templateParams) ? field.templateParams : {};
  return own;
}
/** A template parameter: templateParams first, then the field key it was before. */


function templateParam(field, name) {
  const own = paramsOf(field || {});
  if (own[name] !== undefined && own[name] !== null) return own[name];
  const former = FORMER_PARAMS[name];
  return former ? field?.[former] : undefined;
}
/** The registered entry of a type (after its aliases), or null. */

function typeEntry(type) {
  const alias = _registry_js__WEBPACK_IMPORTED_MODULE_0__.TYPE_ALIASES[type];
  return BY_TYPE.get(alias ? alias.type : type) ?? null;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "f8901823ea4f"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   INN_HOLDERS: () => (/* binding */ INN_HOLDERS),
/* harmony export */   LINK_TEXT_MOST: () => (/* binding */ LINK_TEXT_MOST),
/* harmony export */   URL_MOST_BYTES: () => (/* binding */ URL_MOST_BYTES),
/* harmony export */   completeWebAddress: () => (/* binding */ completeWebAddress),
/* harmony export */   composeLink: () => (/* binding */ composeLink),
/* harmony export */   innError: () => (/* binding */ innError),
/* harmony export */   innHolder: () => (/* binding */ innHolder),
/* harmony export */   isLinkAddress: () => (/* binding */ isLinkAddress),
/* harmony export */   isWebAddress: () => (/* binding */ isWebAddress),
/* harmony export */   readLink: () => (/* binding */ readLink),
/* harmony export */   shortAddress: () => (/* binding */ shortAddress)
/* harmony export */ });
// The text types Larena stores and the Framework drew as plain strings until
// step 3 of the type-template catalogue (owner decisions C302, C303,
// 2026-11-17; ui-control research 2026-11-17-type-template-catalogue): a web
// address (`url`), a link with its text (`link`) and a Russian taxpayer number
// (`ru.inn`). Each checks its value; the renderers in index.js draw them.
//
// No DOM and no Lit: a host's server test reads the same rules.
// url: an absolute http or https address, at most 2048 bytes, without a login
// or a password in it (Larena url@1).
const URL_MOST_BYTES = 2048;

function byteLength(text) {
  try {
    return new TextEncoder().encode(text).length;
  } catch {
    return text.length;
  }
}

function parsedUrl(text) {
  try {
    return new URL(text);
  } catch {
    return null;
  }
}
/** Whether a text is a web address this type stores. */


function isWebAddress(value) {
  if (typeof value !== 'string') return false;
  const text = value.trim();
  if (!text || text !== value || /\s/u.test(text) || byteLength(text) > URL_MOST_BYTES) return false;
  if (!/^https?:\/\//iu.test(text)) return false;
  const url = parsedUrl(text);
  return Boolean(url && (url.protocol === 'http:' || url.protocol === 'https:') && url.hostname && !url.username && !url.password);
} // A bare domain is an address (dispatcher decision, field orders FO-5,
// 2026-11-18): «simai.io» or «simai.io/docs» typed without a scheme is read as
// https://simai.io/…, and the field shows and writes that. Only a text with no
// scheme at all is completed -- «javascript:…», «mailto:…», «ftp://…» keep
// theirs and are refused -- and only when it starts with a host name that has
// a dot («localhost» or «/path» are not addresses of this type). A port after
// the host («simai.io:8080») is not a scheme.

const SCHEME = /^[a-z][a-z0-9+.-]*:(?!\d)/iu;
const BARE_HOST = /^(?:[\p{L}\p{N}](?:[\p{L}\p{N}-]*[\p{L}\p{N}])?\.)+[\p{L}\p{N}-]{2,}(?::\d{1,5})?(?:[/?#]|$)/u;
/**
 * The address a typed text stands for: the text itself when it has a scheme
 * or is not a bare domain, else https:// before it. Trimmed; isWebAddress()
 * still decides whether the result is one.
 */

function completeWebAddress(value) {
  if (typeof value !== 'string') return value;
  const text = value.trim();
  if (!text || SCHEME.test(text) || text.startsWith('/') || !BARE_HOST.test(text)) return text;
  return `https://${text}`;
}
/**
 * An address as a row shows it: the host and the start of the path, without
 * the scheme, a trailing slash or «www.», cut with «…» past `most` characters.
 */

function shortAddress(value, most = 40) {
  const url = isWebAddress(value) ? parsedUrl(value) : null;
  if (!url) return typeof value === 'string' ? value : '';
  const host = url.hostname.replace(/^www\./u, '');
  const rest = `${url.pathname === '/' ? '' : url.pathname}${url.search}${url.hash}`;
  const text = `${host}${url.port ? `:${url.port}` : ''}${rest}`;
  return text.length > most ? `${text.slice(0, most - 1)}…` : text;
} // link: {href, text?}. href is an http(s) address, a path from the site's
// root («/about», never «//host») or an anchor («#prices»); text is at most
// 255 characters (Larena link@1).

const LINK_TEXT_MOST = 255;
function isLinkAddress(value) {
  if (typeof value !== 'string' || !value || value !== value.trim() || /\s/u.test(value)) return false;
  if (value.startsWith('#')) return value.length > 1;
  if (value.startsWith('/')) return !value.startsWith('//') && !value.startsWith('/\\');
  return isWebAddress(value);
}
/** A stored link read: {href, text}, or null for none; a bare string is its href. */

function readLink(value) {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value === 'string') return {
    href: value,
    text: ''
  };
  if (typeof value !== 'object' || Array.isArray(value)) return null;
  const href = typeof value.href === 'string' ? value.href : '';
  const text = typeof value.text === 'string' ? value.text : '';
  return href || text ? {
    href,
    text
  } : null;
}
/**
 * What an edit of the two parts writes: {value} -- {href, text} without an
 * empty text, null when both are empty -- or {error}: linkNeedsAddress,
 * linkInvalid, linkTextLong (the set's words).
 */

function composeLink(href, text) {
  const address = String(href ?? '').trim();
  const words = String(text ?? '').trim();
  if (!address && !words) return {
    value: null
  };
  if (!address) return {
    error: 'linkNeedsAddress'
  };
  if (!isLinkAddress(address)) return {
    error: 'linkInvalid'
  };
  if ([...words].length > LINK_TEXT_MOST) return {
    error: 'linkTextLong'
  };
  return {
    value: words ? {
      href: address,
      text: words
    } : {
      href: address
    }
  };
} // ru.inn: 10 digits for an organisation, 12 for a person, with the check
// digits of the Federal Tax Service. `holder` -- any (default),
// organization, person -- is fixed when the field is created.

const INN_WEIGHTS_10 = [2, 4, 10, 3, 5, 9, 4, 6, 8];
const INN_WEIGHTS_11 = [7, 2, 4, 10, 3, 5, 9, 4, 6, 8];
const INN_WEIGHTS_12 = [3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8];
const INN_HOLDERS = Object.freeze(['any', 'organization', 'person']);

function checkDigit(digits, weights) {
  const sum = weights.reduce((total, weight, index) => total + weight * Number(digits[index]), 0);
  return sum % 11 % 10;
}

function innHolder(field = {}) {
  const asked = String(field?.holder ?? '').trim();
  return INN_HOLDERS.includes(asked) ? asked : 'any';
}
/**
 * Why a text is not an INN of the field, or null when it is one (an empty
 * text is null too: no value). The reasons are the set's words: innDigits,
 * innOrganization, innPerson, innChecksum.
 */

function innError(value, holder = 'any') {
  const text = String(value ?? '').trim();
  if (!text) return null;

  if (!/^\d+$/u.test(text) || text.length !== 10 && text.length !== 12) {
    return holder === 'organization' ? 'innOrganization' : holder === 'person' ? 'innPerson' : 'innDigits';
  }

  if (holder === 'organization' && text.length !== 10) return 'innOrganization';
  if (holder === 'person' && text.length !== 12) return 'innPerson';
  if (text.length === 10) return checkDigit(text, INN_WEIGHTS_10) === Number(text[9]) ? null : 'innChecksum';
  return checkDigit(text, INN_WEIGHTS_11) === Number(text[10]) && checkDigit(text, INN_WEIGHTS_12) === Number(text[11]) ? null : 'innChecksum';
}

/***/ },

/***/ "b30ec5bc0edb"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   OPTION_BADGE_HUES: () => (/* binding */ OPTION_BADGE_HUES),
/* harmony export */   OPTION_BADGE_PALETTE: () => (/* binding */ OPTION_BADGE_PALETTE),
/* harmony export */   nearestPaletteHue: () => (/* binding */ nearestPaletteHue),
/* harmony export */   optionBadgeProps: () => (/* binding */ optionBadgeProps),
/* harmony export */   optionDotColor: () => (/* binding */ optionDotColor)
/* harmony export */ });
/* harmony import */ var _component_badges_js_contract_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("a2a9d3c2841e");

const HEX_COLOR = /^#(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i; // The hues of the static palette (owner decision C17), each with the OKLCH hue
// angle of its tone 50 (src/core/scss/_sf_static_palette.scss, rounded to the
// degree; tests/option-badge-palette.contract.test.mjs holds the two equal).
// Brown and gray are not reached from a hex: brown sits between orange and
// amber and differs from them by chroma alone, which a light or a dark hex
// does not keep; a colour with less chroma than GREY_CHROMA is gray. Both are
// reached by name.

const OPTION_BADGE_HUES = Object.freeze({
  red: 28,
  orange: 47,
  amber: 60,
  yellow: 89,
  lime: 119,
  green: 144,
  teal: 173,
  cyan: 203,
  sky: 232,
  blue: 259,
  indigo: 279,
  violet: 299,
  purple: 320,
  pink: 347
});
const OPTION_BADGE_PALETTE = Object.freeze([...Object.keys(OPTION_BADGE_HUES), "brown", "gray"]);
const GREY_CHROMA = 0.03;

const linear = channel => {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}; // {chroma, hue} in OKLCH of a #rgb[a] / #rrggbb[aa]; the alpha is not read.


function oklchOf(hex) {
  let digits = hex.slice(1);
  if (digits.length < 6) digits = [...digits].map(digit => digit + digit).join("");
  const [r, g, b] = [0, 2, 4].map(at => linear(parseInt(digits.slice(at, at + 2), 16)));
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return {
    chroma: Math.hypot(a, bb),
    hue: (Math.atan2(bb, a) * 180 / Math.PI + 360) % 360
  };
}
/** The static palette hue nearest a hex colour: gray when it has no hue to speak of. */


function nearestPaletteHue(hex) {
  const {
    chroma,
    hue
  } = oklchOf(hex);
  if (chroma < GREY_CHROMA) return "gray";
  let best = "gray";
  let distance = Infinity;

  for (const [name, angle] of Object.entries(OPTION_BADGE_HUES)) {
    const apart = Math.abs((hue - angle + 540) % 360 - 180);

    if (apart < distance) {
      best = name;
      distance = apart;
    }
  }

  return best;
} // The fill of a hue: tone 50 at the fill step 24 (C43: no new tones or steps;
// the alpha scale's fill family), over the place in both themes, as the 24 %
// mix of the data's hex was. The text stays on the surface colour, so the
// label reads the same in both themes. Written to the badge's public
// variables, --sf-badge-background-color and --sf-badge-color (owner decision
// C140 (2), BG-7): a colour from data reaches the badge only through them and
// only as a palette step, never the author's hex.

const paletteStyle = hue => `--sf-badge-background-color: var(--sf-${hue}-50--alfa-24); --sf-badge-color: var(--sf-on-surface)`;
/**
 * Badge look for a filter option with optionRenderer 'badge'. option.color is
 * a Framework badge scheme (success, error, info...), a hue of the static
 * palette (red, teal, gray...; C17) or a hex colour. A hue tints the badge with
 * its own palette step; a hex is drawn in the palette hue nearest it, never as
 * the raw colour (C18, C43; badges study BG-7), so the label stays readable in
 * both themes. Anything else is neutral.
 */
// The data view port names the badge look `scheme` on a column's options; a
// filter option has always said `color`. Both are read: reading only `color`
// left every port column's scheme unread and its badges neutral.


function optionBadgeProps(option = {}) {
  const raw = option?.scheme ?? option?.color;
  const color = typeof raw === "string" ? raw.trim() : ""; // A former name (danger) reads as its canonical scheme (error).

  const scheme = (0,_component_badges_js_contract_js__WEBPACK_IMPORTED_MODULE_0__.canonicalBadgeScheme)(color);
  if (scheme) return {
    scheme,
    rootStyle: ""
  };
  const name = color.toLowerCase();
  if (OPTION_BADGE_PALETTE.includes(name)) return {
    scheme: "neutral",
    rootStyle: paletteStyle(name)
  };
  if (HEX_COLOR.test(color)) return {
    scheme: "neutral",
    rootStyle: paletteStyle(nearestPaletteHue(color))
  };
  return {
    scheme: "neutral",
    rootStyle: ""
  };
} // The colour of an option drawn as a circle (FO4-1, FO4-2: option-look dot):
// a scheme its role colour, a hue of the static palette its tone 50, a hex or
// a CSS colour itself (the circle is a sample of the colour, not text on it);
// neutral the outline colour. '' when nothing is given.

const SCHEME_INK = Object.freeze({
  neutral: "--sf-outline",
  "on-surface": "--sf-on-surface-variant"
});
function optionDotColor(option = {}) {
  const raw = option?.color ?? option?.scheme ?? option?.swatch;
  const color = typeof raw === "string" ? raw.trim() : "";
  if (!color) return "";
  const scheme = (0,_component_badges_js_contract_js__WEBPACK_IMPORTED_MODULE_0__.canonicalBadgeScheme)(color);
  if (scheme) return `var(${SCHEME_INK[scheme] ?? `--sf-${scheme}`})`;
  const name = color.toLowerCase();
  if (OPTION_BADGE_PALETTE.includes(name)) return `var(--sf-${name}-50)`;
  return color;
}

/***/ },

/***/ "c4779e51fee1"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   formatPlaceholder: () => (/* binding */ formatPlaceholder),
/* harmony export */   localeDateFormat: () => (/* binding */ localeDateFormat),
/* harmony export */   localeWeekStart: () => (/* binding */ localeWeekStart),
/* harmony export */   localeWeekend: () => (/* binding */ localeWeekend),
/* harmony export */   weekendDays: () => (/* binding */ weekendDays)
/* harmony export */ });
// What a locale says about its calendar, read from Intl once per locale: the
// first day of the week and the days off (Intl.Locale#getWeekInfo, the older
// weekInfo getter where a browser still has that). No DOM, so the rules are
// unit-tested as they are (tests/datepicker-c62.contract.test.mjs).
//
// Days are numbered as Date#getDay numbers them, 0 Sunday to 6 Saturday; Intl
// numbers them 1 Monday to 7 Sunday, so 7 is read as Sunday too.
const weekInfos = new Map();

function weekInfo(code) {
  if (weekInfos.has(code)) return weekInfos.get(code);
  let info = null;

  try {
    const locale = new Intl.Locale(code);
    info = (typeof locale.getWeekInfo === 'function' ? locale.getWeekInfo() : locale.weekInfo) || null;
  } catch {// An unknown locale keeps the defaults below.
  }

  weekInfos.set(code, info);
  return info;
} // The first day of the locale's week, read once per locale: the grid asks it
// several times a render. Monday where the locale does not say.


function localeWeekStart(code) {
  const first = weekInfo(code)?.firstDay;
  return Number.isInteger(first) ? first % 7 : 1;
}
const SATURDAY_SUNDAY = Object.freeze([6, 0]); // The locale's days off: Saturday and Sunday in ru, de and en-US, Friday and
// Saturday in ar-EG and he-IL. Saturday and Sunday where the locale does not say.

function localeWeekend(code) {
  const days = weekInfo(code)?.weekend;
  if (!Array.isArray(days) || !days.length) return SATURDAY_SUNDAY;
  return Object.freeze(days.map(day => day % 7));
} // The `weekend` setting (owner decision C62: days off are red, and a product
// whose weekends are working days says so). Empty: the locale's days off.
// "none": no day is a day off. Otherwise the days, comma or space separated,
// 0 or 7 Sunday, 1 Monday to 6 Saturday ("6,7" as Intl writes Saturday and
// Sunday, "5,6" for Friday and Saturday). Anything else in the list is left
// out; a list with nothing left falls back to the locale.

function weekendDays(setting, code) {
  const text = String(setting ?? '').trim().toLowerCase();
  if (!text) return new Set(localeWeekend(code));
  if (text === 'none') return new Set();
  const days = text.split(/[\s,]+/u).filter(part => /^[0-7]$/u.test(part)).map(part => Number(part) % 7);
  return new Set(days.length ? days : localeWeekend(code));
} // The date format of a locale, in the component's tokens (owner decision C62:
// typing follows the language and the country, not a fixed «ДД.ММ.ГГГГ»). The
// parts' order and the signs between them come from Intl alone:
// formatToParts of a two-digit day and month and a numeric year gives
// DD.MM.YYYY for ru and de, MM/DD/YYYY for en-US, DD/MM/YYYY for en-GB and fr,
// YYYY-MM-DD for sv-SE and en-CA. A sign before the first part or after the
// last («12.11.2026 г.» in bg, the closing dot of hu and ko) is left out: it is
// not between two numbers, and a person does not type it. Right-to-left marks
// are left out of the signs too. A locale Intl refuses, or a sign that is not
// one a date is typed with (. / - , or a space), keeps DD.MM.YYYY.

const DEFAULT_DATE_FORMAT = 'DD.MM.YYYY';
const PART_TOKENS = {
  day: 'DD',
  month: 'MM',
  year: 'YYYY'
};
const dateFormats = new Map();
function localeDateFormat(code) {
  if (dateFormats.has(code)) return dateFormats.get(code);
  let format = DEFAULT_DATE_FORMAT;

  try {
    const parts = new Intl.DateTimeFormat(code, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).formatToParts(new Date(2026, 10, 12));
    const tokens = [];
    const signs = [];
    let sign = '';

    for (const part of parts) {
      if (part.type === 'literal') {
        sign += part.value.replace(/[\u200e\u200f\u061c]/gu, '');
      } else if (PART_TOKENS[part.type]) {
        if (tokens.length) signs.push(sign);
        tokens.push(PART_TOKENS[part.type]);
        sign = '';
      }
    }

    const whole = tokens.length === 3 && new Set(tokens).size === 3 && signs.every(one => /^[\s./,-]+$/u.test(one));
    if (whole) format = tokens.reduce((text, token, index) => text + (index ? signs[index - 1] : '') + token, '');
  } catch {// An unknown locale keeps the default.
  }

  dateFormats.set(code, format);
  return format;
} // The hint in an empty field: the format written with the letters of the
// locale's own names for the parts (Intl.DisplayNames, type dateTimeField):
// ДД.ММ.ГГГГ in ru, MM/DD/YYYY in en-US, TT.MM.JJJJ in de, JJ/MM/AAAA in fr.
// A name in a script without letter case or initials (日, 年) gives the Latin
// D, M, Y, H instead.

const LATIN_LETTERS = {
  DD: 'D',
  MM: 'M',
  YYYY: 'Y',
  YY: 'Y',
  HH: 'H',
  mm: 'M'
};
const FIELD_NAMES = {
  DD: 'day',
  MM: 'month',
  YYYY: 'year',
  YY: 'year',
  HH: 'hour',
  mm: 'minute'
};
const INITIAL_RE = /^[\p{Script=Latin}\p{Script=Cyrillic}\p{Script=Greek}]/u;
const placeholders = new Map();

function letterOf(token, code) {
  try {
    const name = new Intl.DisplayNames(code, {
      type: 'dateTimeField'
    }).of(FIELD_NAMES[token]) || '';
    const first = name.trim().charAt(0);
    if (INITIAL_RE.test(first)) return first.toLocaleUpperCase(code);
  } catch {// No names for this locale: the Latin letter below.
  }

  return LATIN_LETTERS[token];
}

function formatPlaceholder(format, code) {
  const key = `${code}|${format}`;
  if (placeholders.has(key)) return placeholders.get(key);
  const text = String(format || '').replace(/YYYY|YY|MM|DD|HH|mm/gu, token => letterOf(token, code).repeat(token.length));
  placeholders.set(key, text);
  return text;
}

/***/ },

/***/ "d3818183b14c"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("deprecations", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("deprecations", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "073f05ff1a81"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit/directives/unsafe-html.js", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("lit/directives/unsafe-html.js", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "2a080a730149"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("lit", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "43090d1c8307"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("page-language", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("page-language", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "e19611ff78cb"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PASTE_BLOCKS: () => (/* binding */ PASTE_BLOCKS),
/* harmony export */   RICH_TEXT_BLOCKS: () => (/* binding */ RICH_TEXT_BLOCKS),
/* harmony export */   RICH_TEXT_ELEMENTS: () => (/* binding */ RICH_TEXT_ELEMENTS),
/* harmony export */   RICH_TEXT_PROFILES: () => (/* binding */ RICH_TEXT_PROFILES),
/* harmony export */   RICH_TEXT_SCHEMES: () => (/* binding */ RICH_TEXT_SCHEMES),
/* harmony export */   cleanTree: () => (/* binding */ cleanTree),
/* harmony export */   decodeEntities: () => (/* binding */ decodeEntities),
/* harmony export */   parseHtml: () => (/* binding */ parseHtml),
/* harmony export */   plainText: () => (/* binding */ plainText),
/* harmony export */   richTextFromPlainText: () => (/* binding */ richTextFromPlainText),
/* harmony export */   richTextHref: () => (/* binding */ richTextHref),
/* harmony export */   sanitizeRichText: () => (/* binding */ sanitizeRichText),
/* harmony export */   serialize: () => (/* binding */ serialize),
/* harmony export */   treeFromDom: () => (/* binding */ treeFromDom)
/* harmony export */ });
// The HTML subset of sf-rich-text: what the value may hold, and how anything
// else is brought into it. Larena stores page text as a property of type
// html@1, and this module is that type's rule in the browser: the editor
// cleans the value it is given, every paste and drop, and its own DOM after
// every edit and command, through the one function here.
//
// The subset:
//
//   p  h2  h3  h4  strong  em  a[href]  ul  ol  li  blockquote  br
//
// - no attribute is kept but href on <a>;
// - href is kept for https:, mailto: and tel: URLs and for a site path
//   ("/docs/a"), judged after removing control characters and white space, so
//   "java\tscript:" does not pass; "//host" and "/\host" leave the site and
//   are not kept; a link whose href is not kept becomes its text;
// - script, style and the other containers whose content is not text for a
//   reader (DROPPED) go with their content; any other element is unwrapped,
//   and its text stays; one that stands as a block (div, section, table, a
//   cell, h1, pre) still separates its text from its neighbours';
// - b and i are strong and em, and a span whose style is bold or italic is
//   too (a word processor's paste); a b whose style says normal is not;
// - text outside a block is wrapped in p, a block inside a paragraph splits
//   it, a block inside a list item becomes a line of it (br), a list holds
//   only items, adjacent lists of one kind are one list;
// - the value has no empty block, no line break at a block's edge and no
//   white space between blocks; an editor with no text is "".
//
// Two readers feed one cleaner: `treeFromDom` reads a DOM (the editor, or a
// paste parsed by the browser in an inert <template>), `parseHtml` reads a
// string without a DOM (a server, a test). Neither ever assigns the input to
// a live element. What comes out is written by `serialize` from the cleaned
// model, every text escaped, so it holds nothing the subset does not allow
// whatever the reader understood.
//
// No imports and no state: the element and the contract tests use the same
// functions.
//
// The paste profile (simai/ui-source#66). html@1 is a stored type, so it does
// not grow: a value never holds pre or table. A structured-content editor
// reads a paste with cleanTree(tree, {profile: 'paste'}), which is html@1
// plus two blocks the profile maps to its own types instead of flattening
// them into paragraphs:
//
//   {type: 'pre', text}            a code block: its text with its line
//                                  breaks and indentation (-> content.code)
//   {type: 'table', caption, rows} a simple table: rows of {head, cells},
//                                  each cell {header, leaves} with the
//                                  subset's inline leaves (-> content.table)
//
// Everything inside them is cleaned by the same rule: the same marks, the
// same href check, DROPPED goes with its content. A pre or a table inside a
// list item, and a table inside a cell, are read as html@1 reads them.
// serialize writes the two in html@1 terms (lines of a paragraph, a
// paragraph per cell), so whatever comes out of it is still the subset.
//
// The module lives in the core runtime since content.html 1.0.0: the
// Composition renderer sanitises a content.html block through it at render,
// so a page that only renders a Document needs no Smart component.
// src/smart/input-rich/js/rich-text-html.mjs re-exports it for sf-rich-text and
// the field renderers; there is one rule, here.

const RICH_TEXT_ELEMENTS = Object.freeze(['p', 'h2', 'h3', 'h4', 'strong', 'em', 'a', 'ul', 'ol', 'li', 'blockquote', 'br']);
const RICH_TEXT_BLOCKS = Object.freeze(['p', 'h2', 'h3', 'h4']);
const RICH_TEXT_SCHEMES = Object.freeze(['https:', 'mailto:', 'tel:']);
// The profiles cleanTree reads by: html@1 itself, and the paste profile of a
// structured-content editor, which keeps PASTE_BLOCKS as blocks of their own.
const RICH_TEXT_PROFILES = Object.freeze(['html', 'paste']);
const PASTE_BLOCKS = Object.freeze(['pre', 'table']);

// Dropped with everything inside: their content is code, a document's head,
// a drawing, or a control's own data, not text for a reader.
const DROPPED = new Set([
  'script', 'style', 'template', 'head', 'title', 'meta', 'link', 'base', 'noscript',
  'iframe', 'frame', 'frameset', 'noembed', 'noframes', 'object', 'embed', 'applet',
  'svg', 'math', 'canvas', 'video', 'audio', 'img', 'picture', 'source', 'track',
  'input', 'select', 'textarea', 'xmp', 'plaintext',
]);

// Elements off the subset that stand as blocks: unwrapped, but their text is
// not run together with the text around them.
const BREAKING = new Set([
  'address', 'article', 'aside', 'body', 'caption', 'center', 'dd', 'details', 'dialog', 'dir', 'div',
  'dl', 'dt', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h5', 'h6', 'header',
  'hgroup', 'hr', 'html', 'legend', 'listing', 'main', 'menu', 'nav', 'optgroup', 'option', 'pre',
  'section', 'summary', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr',
]);

const LISTS = new Set(['ul', 'ol']);
const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
// Raw text: what follows the start tag up to its end tag is not markup.
const RAW = new Set(['script', 'style', 'textarea', 'title', 'xmp', 'iframe', 'noembed', 'noframes', 'noscript']);
// Where an implied </p> stops looking for the paragraph (the parser's button scope).
const P_SCOPE = new Set(['td', 'th', 'table', 'caption', 'button']);

// C0 controls, DEL and C1 controls: a browser ignores them inside a scheme.
// eslint-disable-next-line no-control-regex -- matching control characters is the point
const CONTROLS = /[\u0000-\u001f\u007f-\u009f]/gu;
// ...and white space, which a browser also skips around and inside a scheme.
// eslint-disable-next-line no-control-regex -- matching control characters is the point
const CONTROLS_AND_SPACE = /[\u0000- \u007f-\u009f\u00a0\u1680\u2000-\u200b\u2028\u2029\u202f\u205f\u3000\ufeff]/gu;
const HREF_MAX = 2048;

/**
 * The href sf-rich-text keeps, or null: https:, mailto: and tel: URLs and a
 * path on the site ("/docs/a", "/docs?q=1#a"). "//host", "/\host", http:,
 * javascript:, data: and anything else are not kept.
 * @param {unknown} value
 * @returns {string|null}
 */
function richTextHref(value) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > HREF_MAX) return null;
  const compact = trimmed.replace(CONTROLS_AND_SPACE, '');
  if (!compact) return null;
  if (compact.startsWith('/')) {
    // A site path, but not "//host" or "/\host", which leave the site.
    if (/^\/[/\\]/u.test(compact)) return null;
    const path = trimmed.replace(CONTROLS, '');
    return /^\/[/\\]/u.test(path) ? null : path;
  }
  const scheme = /^([a-z][a-z0-9+.-]*):/iu.exec(compact)?.[1]?.toLowerCase();
  if (!scheme || !RICH_TEXT_SCHEMES.includes(`${scheme}:`)) return null;
  let url;
  try {
    url = new globalThis.URL(trimmed.replace(CONTROLS, ''));
  } catch {
    return null;
  }
  if (url.protocol !== `${scheme}:`) return null;
  if (url.protocol === 'https:' && !url.hostname) return null;
  if (url.protocol !== 'https:' && url.href.length <= url.protocol.length) return null;
  return url.href;
}

// ---------------------------------------------------------------- entities

const NAMED = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: '\u00a0', shy: '\u00ad',
  hellip: '\u2026', mdash: '\u2014', ndash: '\u2013', minus: '\u2212', laquo: '\u00ab', raquo: '\u00bb',
  lsquo: '\u2018', rsquo: '\u2019', sbquo: '\u201a', ldquo: '\u201c', rdquo: '\u201d', bdquo: '\u201e',
  bull: '\u2022', middot: '\u00b7', copy: '\u00a9', reg: '\u00ae', trade: '\u2122', deg: '\u00b0',
  times: '\u00d7', divide: '\u00f7', plusmn: '\u00b1', euro: '\u20ac', pound: '\u00a3', yen: '\u00a5',
  cent: '\u00a2', sect: '\u00a7', para: '\u00b6', thinsp: '\u2009', ensp: '\u2002', emsp: '\u2003',
  zwj: '\u200d', zwnj: '\u200c', larr: '\u2190', rarr: '\u2192', uarr: '\u2191', darr: '\u2193',
  numero: '\u2116', prime: '\u2032', Prime: '\u2033',
};

function decodeEntities(text) {
  return String(text).replace(/&(#x[0-9a-f]+|#[0-9]+|[a-z][a-z0-9]*);?/giu, (whole, body) => {
    if (body[0] === '#') {
      const code = body[1] === 'x' || body[1] === 'X' ? Number.parseInt(body.slice(2), 16) : Number.parseInt(body.slice(1), 10);
      if (!Number.isFinite(code) || code <= 0 || code > 0x10ffff || (code >= 0xd800 && code <= 0xdfff)) return '\ufffd';
      return String.fromCodePoint(code);
    }
    return Object.hasOwn(NAMED, body) && whole.endsWith(';') ? NAMED[body] : whole;
  });
}

// ---------------------------------------------------------------- readers

// The raw tree both readers give: {type: 'element', name, attrs, children}
// and {type: 'text', value}. Only href and style are read from attributes.

/**
 * Reads an HTML string into the raw tree, without a DOM. Tolerant the way a
 * browser is for what matters here: implied ends of p and li, void elements,
 * raw-text elements, comments, entities in text and attributes.
 * @param {string} html
 */
function parseHtml(html) {
  const source = typeof html === 'string' ? html : '';
  const root = {type: 'element', name: '#root', attrs: {}, children: []};
  const stack = [root];
  const top = () => stack[stack.length - 1];
  const append = (node) => top().children.push(node);
  const appendText = (value) => {
    if (!value) return;
    const last = top().children.at(-1);
    if (last?.type === 'text') last.value += value;
    else append({type: 'text', value});
  };
  const closeTo = (name, stopAt = null) => {
    for (let index = stack.length - 1; index > 0; index -= 1) {
      const open = stack[index].name;
      if (stopAt && stopAt.has(open)) return false;
      if (open === name) {
        stack.length = index;
        return true;
      }
    }
    return false;
  };
  let at = 0;
  const length = source.length;
  while (at < length) {
    const lt = source.indexOf('<', at);
    if (lt < 0) {
      appendText(decodeEntities(source.slice(at)));
      break;
    }
    if (lt > at) appendText(decodeEntities(source.slice(at, lt)));
    at = lt;
    if (source.startsWith('<!--', at)) {
      const end = source.indexOf('-->', at + 4);
      at = end < 0 ? length : end + 3;
      continue;
    }
    const next = source[at + 1] ?? '';
    if (next === '!' || next === '?') {
      const end = source.indexOf('>', at + 2);
      at = end < 0 ? length : end + 1;
      continue;
    }
    if (next === '/') {
      const match = /^<\/([a-z][a-z0-9-]*)[^>]*>?/iu.exec(source.slice(at));
      if (!match) {
        // "</" not followed by a name is a bogus comment.
        const end = source.indexOf('>', at + 2);
        at = end < 0 ? length : end + 1;
        continue;
      }
      at += match[0].length;
      const name = match[1].toLowerCase();
      if (name === 'br') append({type: 'element', name: 'br', attrs: {}, children: []});
      else if (name === 'p' && !closeTo('p', P_SCOPE)) {
        // A </p> without a <p> is an empty paragraph, as a browser reads it.
        append({type: 'element', name: 'p', attrs: {}, children: []});
      } else closeTo(name);
      continue;
    }
    const tag = /^<([a-z][a-z0-9-]*)/iu.exec(source.slice(at));
    if (!tag) {
      appendText('<');
      at += 1;
      continue;
    }
    at += tag[0].length;
    const name = tag[1].toLowerCase();
    const attrs = {};
    let selfClosing = false;
    // Attributes, up to the closing ">".
    while (at < length) {
      const space = /^[\s/]+/u.exec(source.slice(at));
      if (space) {
        if (space[0].includes('/') && source[at + space[0].length] === '>') selfClosing = true;
        at += space[0].length;
        continue;
      }
      if (source[at] === '>') {
        at += 1;
        break;
      }
      const attr = /^([^\s/>"'=][^\s/>"'=]*)(?:\s*=\s*(?:"([^"]*)"?|'([^']*)'?|([^\s>]*)))?/u.exec(source.slice(at));
      if (!attr) {
        at += 1;
        continue;
      }
      at += attr[0].length;
      const key = attr[1].toLowerCase();
      if (!Object.hasOwn(attrs, key)) attrs[key] = decodeEntities(attr[2] ?? attr[3] ?? attr[4] ?? '');
    }
    const element = {type: 'element', name, attrs, children: []};
    if (name === 'li') closeTo('li', LISTS);
    // A block start ends an open paragraph (the browser's implied </p>).
    if (RICH_TEXT_BLOCKS.includes(name) || LISTS.has(name) || name === 'blockquote' || BREAKING.has(name)) closeTo('p', P_SCOPE);
    append(element);
    if (name === 'plaintext') {
      at = length;
      break;
    }
    if (RAW.has(name)) {
      const close = new RegExp(`</${name}[\\s/>]`, 'iu').exec(source.slice(at));
      const end = close ? at + close.index : length;
      if (name === 'textarea' || name === 'title') element.children.push({type: 'text', value: decodeEntities(source.slice(at, end))});
      else element.children.push({type: 'text', value: source.slice(at, end)});
      const gt = close ? source.indexOf('>', end) : -1;
      at = gt < 0 ? length : gt + 1;
      continue;
    }
    if (!VOID.has(name) && !selfClosing) stack.push(element);
  }
  return root;
}

const HTML_NS = 'http://www.w3.org/1999/xhtml';

/**
 * Reads a DOM subtree (an element, a fragment, a template's content) into the
 * raw tree. Elements outside the HTML namespace are dropped.
 * @param {Node} node
 */
function treeFromDom(node) {
  const read = (current) => {
    if (current.nodeType === 3) return {type: 'text', value: current.data};
    if (current.nodeType === 11) return {type: 'element', name: '#root', attrs: {}, children: [...current.childNodes].map(read).filter(Boolean)};
    if (current.nodeType !== 1) return null;
    if (current.namespaceURI && current.namespaceURI !== HTML_NS) return null;
    const name = current.localName;
    if (DROPPED.has(name)) return null;
    const attrs = {};
    const href = current.getAttribute('href');
    if (href !== null) attrs.href = href;
    const style = current.getAttribute('style');
    if (style !== null) attrs.style = style;
    const children = name === 'template' ? [] : [...current.childNodes].map(read).filter(Boolean);
    return {type: 'element', name, attrs, children};
  };
  const tree = read(node);
  if (!tree || tree.type !== 'element') return {type: 'element', name: '#root', attrs: {}, children: tree ? [tree] : []};
  return {...tree, name: '#root'};
}

// ---------------------------------------------------------------- the cleaner

// What a style says of the marks: {strong: true|false|undefined, em: ...}.
function styleMarks(style) {
  const out = {};
  if (!style) return out;
  const weight = /(?:^|;)\s*font-weight\s*:\s*([^;!]+)/iu.exec(style)?.[1]?.trim().toLowerCase();
  if (weight) {
    if (weight === 'bold' || weight === 'bolder' || Number(weight) >= 600) out.strong = true;
    else if (weight === 'normal' || weight === 'lighter' || Number(weight) < 600) out.strong = false;
  }
  const fontStyle = /(?:^|;)\s*font-style\s*:\s*([^;!]+)/iu.exec(style)?.[1]?.trim().toLowerCase();
  if (fontStyle) {
    if (fontStyle === 'italic' || fontStyle.startsWith('oblique')) out.em = true;
    else if (fontStyle === 'normal') out.em = false;
  }
  return out;
}

function marksOf(element, marks) {
  const next = {...marks};
  if (element.name === 'strong' || element.name === 'b') next.strong = true;
  if (element.name === 'em' || element.name === 'i') next.em = true;
  const styled = styleMarks(element.attrs?.style);
  if (styled.strong !== undefined) next.strong = styled.strong;
  if (styled.em !== undefined) next.em = styled.em;
  return next;
}

// A leaf of inline content: {kind: 'text', value, strong, em, href} or
// {kind: 'br', strong, em, href}.
const leaf = (kind, value, context) => ({kind, value, strong: Boolean(context.marks.strong), em: Boolean(context.marks.em), href: context.href || null});

// A flow (the root, a quote) collects blocks; a list item collects its own
// content. Text comes in as leaves into the current run; a block ends the
// run.
class Flow {
  constructor(kind) {
    this.kind = kind;
    this.blocks = [];
    this.run = [];
    this.types = ['p'];
    this.starts = [0];
    this.needBreak = false;
  }

  inline(item) {
    if (this.kind === 'item' && this.needBreak && this.run.length > 0) {
      if (!(item.kind === 'text' && !item.value.trim())) {
        this.run.push({kind: 'br', strong: false, em: false, href: null});
        this.needBreak = false;
      }
    }
    this.run.push(item);
  }

  flush() {
    if (!this.run.length) return;
    if (this.kind === 'item') {
      this.blocks.push({type: 'inline', leaves: this.run});
    } else {
      this.blocks.push({type: this.types[this.types.length - 1], leaves: this.run});
    }
    this.run = [];
  }

  // A paragraph or heading starts (or a block off the subset): the text so
  // far is one block, and what follows belongs to the new one.
  open(type) {
    if (this.kind === 'item') {
      this.needBreak = true;
      return;
    }
    this.flush();
    this.types.push(type);
    this.starts.push(this.blocks.length);
  }

  // keepEmpty: a paragraph or heading of the subset that held nothing is
  // still a block (the editing surface keeps it; the value drops it).
  close(keepEmpty = false) {
    if (this.kind === 'item') {
      this.needBreak = true;
      return;
    }
    const start = this.starts[this.starts.length - 1];
    if (keepEmpty && !this.run.length && this.blocks.length === start) this.blocks.push({type: this.types[this.types.length - 1], leaves: []});
    this.flush();
    if (this.types.length > 1) {
      this.types.pop();
      this.starts.pop();
    }
  }

  block(block) {
    this.flush();
    this.blocks.push(block);
    this.needBreak = false;
  }
}

function walkText(value, flow, context) {
  if (context.pre) {
    const lines = value.replace(/\r\n?/gu, '\n').split('\n');
    lines.forEach((line, index) => {
      if (index > 0) flow.inline(leaf('br', '', context));
      if (line) flow.inline(leaf('text', line.replace(/[\t\f]/gu, ' '), context));
    });
    return;
  }
  const text = value.replace(/[\t\n\r\f ]+/gu, ' ');
  if (!text) return;
  // White space between blocks is formatting of the source, not text.
  if (text === ' ' && !flow.run.length) return;
  flow.inline(leaf('text', text, context));
}

function walkChildren(children, flow, context) {
  for (const child of children) walk(child, flow, context);
}

function walk(node, flow, context) {
  if (node.type === 'text') {
    walkText(node.value, flow, context);
    return;
  }
  const name = node.name;
  if (DROPPED.has(name)) return;
  if (name === 'br') {
    flow.inline(leaf('br', '', context));
    return;
  }
  const inner = {...context, marks: marksOf(node, context.marks)};
  if (name === 'a') {
    const href = richTextHref(node.attrs?.href);
    walkChildren(node.children, flow, href && !context.href ? {...inner, href} : inner);
    return;
  }
  if (RICH_TEXT_BLOCKS.includes(name)) {
    flow.open(name);
    walkChildren(node.children, flow, inner);
    flow.close(true);
    return;
  }
  if (LISTS.has(name)) {
    const list = readList(node, inner, name);
    if (list.items.length) flow.block(list);
    return;
  }
  if (name === 'blockquote') {
    if (flow.kind === 'item') {
      flow.open('p');
      walkChildren(node.children, flow, inner);
      flow.close();
      return;
    }
    const quote = new Flow('flow');
    walkChildren(node.children, quote, inner);
    quote.flush();
    flow.block({type: 'blockquote', blocks: quote.blocks});
    return;
  }
  if (name === 'li') {
    // An item outside a list is a paragraph of its own.
    flow.open('p');
    walkChildren(node.children, flow, inner);
    flow.close();
    return;
  }
  if (context.paste && flow.kind !== 'item' && (name === 'pre' || name === 'listing')) {
    flow.block({type: 'pre', text: preText(node)});
    return;
  }
  if (context.paste && flow.kind !== 'item' && name === 'table') {
    flow.block(readTable(node, inner));
    return;
  }
  if (BREAKING.has(name)) {
    flow.open('p');
    walkChildren(node.children, flow, name === 'pre' || name === 'listing' ? {...inner, pre: true} : inner);
    flow.close();
    return;
  }
  // Any other element: its text, in place.
  walkChildren(node.children, flow, inner);
}

// The text of a pre as it stands: line breaks and indentation kept, a <br> a
// line break, what DROPPED names gone. The newline right after <pre> is the
// markup's, as a browser reads it; trailing blank lines are not code.
function preText(node) {
  const read = (current) => {
    if (current.type === 'text') return current.value;
    if (DROPPED.has(current.name)) return '';
    if (current.name === 'br') return '\n';
    return current.children.map(read).join('');
  };
  return node.children.map(read).join('')
    .replace(/\r\n?/gu, '\n')
    .replace(/\u00a0/gu, ' ')
    .replace(/^\n/u, '')
    .replace(/\s+$/u, '');
}

// A simple table: thead, tbody, tfoot and rows straight in the table, cells
// th and td; a cell's content is inline leaves, its paragraphs and list items
// lines of it. colspan and rowspan are not read: a cell is one cell.
function readTable(node, context) {
  const table = {type: 'table', caption: [], rows: []};
  const readRow = (row, head) => {
    const cells = [];
    for (const cell of row.children) {
      if (cell.type !== 'element' || (cell.name !== 'td' && cell.name !== 'th')) continue;
      const flow = new Flow('item');
      walkChildren(cell.children, flow, {...context, marks: marksOf(cell, context.marks)});
      flow.flush();
      cells.push({header: cell.name === 'th', leaves: flatLeaves(flow.blocks)});
    }
    if (cells.length) table.rows.push({head, cells});
  };
  const readSection = (section, head) => {
    for (const child of section.children) {
      if (child.type === 'element' && child.name === 'tr') readRow(child, head);
    }
  };
  for (const child of node.children) {
    if (child.type !== 'element') continue;
    if (child.name === 'caption') {
      const flow = new Flow('item');
      walkChildren(child.children, flow, context);
      flow.flush();
      table.caption = flatLeaves(flow.blocks);
    } else if (child.name === 'thead') readSection(child, true);
    else if (child.name === 'tbody' || child.name === 'tfoot') readSection(child, false);
    else if (child.name === 'tr') readRow(child, false);
  }
  return table;
}

// An item's parts as one line of leaves: a nested list's items are lines too.
function flatLeaves(parts) {
  const out = [];
  const add = (leaves) => {
    if (!leaves.length) return;
    if (out.length) out.push({kind: 'br', strong: false, em: false, href: null});
    out.push(...leaves);
  };
  const visit = (part) => {
    if (part.type === 'inline') add(part.leaves);
    else for (const item of part.items) item.children.forEach(visit);
  };
  parts.forEach(visit);
  return out;
}

function readItem(node, context) {
  const flow = new Flow('item');
  walkChildren(node.children, flow, context);
  flow.flush();
  return {children: flow.blocks};
}

function readList(node, context, type) {
  const list = {type, items: []};
  let loose = null;
  const endLoose = () => {
    if (loose) {
      loose.flush();
      list.items.push({children: loose.blocks});
      loose = null;
    }
  };
  for (const child of node.children) {
    if (child.type === 'element' && child.name === 'li') {
      endLoose();
      list.items.push(readItem(child, context));
      continue;
    }
    if (child.type === 'element' && LISTS.has(child.name)) {
      endLoose();
      // A list right inside a list (what an indent command leaves) belongs to
      // the item before it.
      const nested = readList(child, {...context, marks: marksOf(child, context.marks)}, child.name);
      if (!nested.items.length) continue;
      const previous = list.items.at(-1);
      if (previous) previous.children.push(nested);
      else list.items.push({children: [nested]});
      continue;
    }
    if (child.type === 'text' && !child.value.trim()) continue;
    if (child.type === 'element' && DROPPED.has(child.name)) continue;
    // Loose content in a list is an item.
    loose ??= new Flow('item');
    walk(child, loose, context);
  }
  endLoose();
  return list;
}

// ---------------------------------------------------------------- tidying

const SPACE = ' ';
const sameFormat = (a, b) => a.strong === b.strong && a.em === b.em && a.href === b.href;

// Inline leaves made canonical: adjacent text of one format joined, runs of
// spaces made one, spaces at the edges and around a line break removed, a link
// with nothing but spaces made text.
//
// The steps run again until a pass changes nothing (2026-11-11 acceptance,
// M2): dropping a space or an empty run makes new neighbours, so one pass left
// "<p>a <em><br>n</em></p>" for the next load-and-save to make
// "<p>a<em><br>n</em></p>". The stored value is the fixed point at once.
function tidyLeaves(leaves, mode) {
  let current = leaves;
  let key = null;
  for (let pass = 0; pass < 64; pass += 1) {
    current = tidyLeavesOnce(current, mode);
    const next = JSON.stringify(current);
    if (next === key) break;
    key = next;
  }
  return current;
}

function tidyLeavesOnce(leaves, mode) {
  const out = [];
  for (const item of leaves) {
    if (item.kind === 'text' && !item.value) continue;
    const last = out.at(-1);
    if (item.kind === 'text' && last?.kind === 'text' && sameFormat(last, item)) {
      last.value += item.value;
    } else {
      out.push({...item});
    }
  }
  // One space between words, whatever the leaves.
  for (let index = 0; index < out.length; index += 1) {
    const item = out[index];
    if (item.kind !== 'text') continue;
    item.value = item.value.replace(/ {2,}/gu, SPACE);
    const previous = out[index - 1];
    if (item.value.startsWith(SPACE) && (!previous || previous.kind === 'br' || (previous.kind === 'text' && previous.value.endsWith(SPACE)))) {
      item.value = item.value.slice(1);
    }
    const next = out[index + 1];
    if (item.value.endsWith(SPACE) && (!next || next.kind === 'br')) item.value = item.value.slice(0, -1);
  }
  let kept = out.filter((item) => item.kind === 'br' || item.value);
  if (mode === 'value') {
    // Edge breaks and edge white space go together, until neither is left: a
    // run of only white space (&nbsp;) at an edge hid the break behind it, so
    // the first pass kept "<p>&nbsp;<br>a</p>" as "<p><br>a</p>" and only the
    // next load-and-save gave "<p>a</p>" (2026-11-10 review, Q6). The value is
    // now what that second pass gave, at once, and cleaning it again keeps it.
    let length = -1;
    while (length !== kept.length) {
      length = kept.length;
      while (kept[0]?.kind === 'br') kept.shift();
      while (kept.at(-1)?.kind === 'br') kept.pop();
      if (kept[0]?.kind === 'text') kept[0].value = kept[0].value.replace(/^[\s\u00a0]+/u, '');
      const end = kept.at(-1);
      if (end?.kind === 'text') end.value = end.value.replace(/[\s\u00a0]+$/u, '');
      kept = kept.filter((item) => item.kind === 'br' || item.value);
    }
  }
  // A link of nothing but spaces is not a link.
  const groups = new Map();
  for (const item of kept) {
    if (!item.href) continue;
    groups.set(item.href, (groups.get(item.href) || '') + (item.kind === 'text' ? item.value : 'x'));
  }
  for (const item of kept) if (item.href && !groups.get(item.href).trim()) item.href = null;
  // Join again: dropping spaces and links may have made neighbours alike.
  const joined = [];
  for (const item of kept) {
    const last = joined.at(-1);
    if (item.kind === 'text' && last?.kind === 'text' && sameFormat(last, item)) last.value += item.value;
    else joined.push(item);
  }
  return joined;
}

const hasText = (leaves) => leaves.some((item) => item.kind === 'text' && item.value.replace(/[\s\u00a0]+/gu, '') !== '');

function tidyItem(item, mode) {
  const children = [];
  for (const part of item.children) {
    if (part.type === 'inline') {
      const leaves = tidyLeaves(part.leaves, mode);
      if (!leaves.length) continue;
      const last = children.at(-1);
      if (last?.type === 'inline') last.leaves = tidyLeaves([...last.leaves, {kind: 'br', strong: false, em: false, href: null}, ...leaves], mode);
      else children.push({type: 'inline', leaves});
    } else {
      const list = tidyList(part, mode);
      if (!list) continue;
      const last = children.at(-1);
      if (last && last.type === list.type) last.items.push(...list.items);
      else children.push(list);
    }
  }
  if (mode === 'value') {
    const filtered = children.filter((part) => part.type !== 'inline' || hasText(part.leaves));
    return filtered.length ? {children: filtered} : null;
  }
  if (!children.length || children[0].type !== 'inline') children.unshift({type: 'inline', leaves: [{kind: 'br', strong: false, em: false, href: null}]});
  return {children};
}

function tidyList(list, mode) {
  const items = list.items.map((item) => tidyItem(item, mode)).filter(Boolean);
  return items.length ? {type: list.type, items} : null;
}

function tidyBlocks(blocks, mode) {
  const out = [];
  for (const block of blocks) {
    let tidy = null;
    if (block.type === 'blockquote') {
      const inner = tidyBlocks(block.blocks, mode);
      if (inner.length) tidy = {type: 'blockquote', blocks: inner};
      else if (mode === 'editor') tidy = {type: 'blockquote', blocks: [{type: 'p', leaves: [{kind: 'br', strong: false, em: false, href: null}]}]};
    } else if (LISTS.has(block.type)) {
      tidy = tidyList(block, mode);
    } else if (block.type === 'pre') {
      if (block.text.trim()) tidy = {type: 'pre', text: block.text};
    } else if (block.type === 'table') {
      // A row with no text in any cell is not kept, as an empty paragraph is not.
      const rows = block.rows.map((row) => ({head: row.head, cells: row.cells.map((cell) => ({header: cell.header, leaves: tidyLeaves(cell.leaves, 'value')}))}))
        .filter((row) => row.cells.some((cell) => hasText(cell.leaves)));
      if (rows.length) tidy = {type: 'table', caption: tidyLeaves(block.caption, 'value'), rows};
    } else {
      const leaves = tidyLeaves(block.leaves, mode);
      if (mode === 'value') {
        if (hasText(leaves)) tidy = {type: block.type, leaves};
      } else {
        tidy = {type: block.type, leaves: leaves.length ? leaves : [{kind: 'br', strong: false, em: false, href: null}]};
      }
    }
    if (!tidy) continue;
    const last = out.at(-1);
    // Adjacent lists of one kind are one list.
    if (last && LISTS.has(tidy.type) && last.type === tidy.type) last.items.push(...tidy.items);
    else out.push(tidy);
  }
  return out;
}

/**
 * The raw tree cleaned into blocks.
 * mode "value": the stored form -- no empty block, no break at an edge.
 * mode "editor": what the editing surface holds -- an empty block keeps a
 *   <br> so the caret has a line, breaks the person typed stay.
 */
function cleanTree(tree, {mode = 'value', profile = 'html'} = {}) {
  if (!RICH_TEXT_PROFILES.includes(profile)) throw new TypeError(`rich_text_profile_unknown: ${profile}`);
  const flow = new Flow('flow');
  walkChildren(tree.children ?? [], flow, {marks: {}, href: null, pre: false, paste: profile === 'paste'});
  flow.flush();
  const blocks = tidyBlocks(flow.blocks, mode);
  if (mode === 'editor' && !blocks.length) return [{type: 'p', leaves: [{kind: 'br', strong: false, em: false, href: null}]}];
  return blocks;
}

// ---------------------------------------------------------------- writing

const escapeText = (text) => text.replace(/&/gu, '&amp;').replace(/</gu, '&lt;').replace(/>/gu, '&gt;').replace(/\u00a0/gu, '&nbsp;');
const escapeAttribute = (text) => text.replace(/&/gu, '&amp;').replace(/"/gu, '&quot;').replace(/</gu, '&lt;').replace(/>/gu, '&gt;').replace(/\u00a0/gu, '&nbsp;');

// Leaves to markup, nested a > strong > em, each run of one format once.
function writeLeaves(leaves) {
  const writeGroup = (items, level) => {
    let out = '';
    let at = 0;
    const key = ['href', 'strong', 'em'][level];
    while (at < items.length) {
      const value = key ? items[at][key] : null;
      let end = at + 1;
      while (end < items.length && key && items[end][key] === value) end += 1;
      const group = items.slice(at, end);
      if (!key) {
        out += group.map((item) => (item.kind === 'br' ? '<br>' : escapeText(item.value))).join('');
      } else if (key === 'href' && value) {
        out += `<a href="${escapeAttribute(value)}">${writeGroup(group, level + 1)}</a>`;
      } else if (key !== 'href' && value) {
        out += `<${key}>${writeGroup(group, level + 1)}</${key}>`;
      } else {
        out += writeGroup(group, level + 1);
      }
      at = end;
    }
    return out;
  };
  return writeGroup(leaves, 0);
}

function writeList(list) {
  return `<${list.type}>${list.items.map((item) => `<li>${item.children.map((part) => (part.type === 'inline' ? writeLeaves(part.leaves) : writeList(part))).join('')}</li>`).join('')}</${list.type}>`;
}

/** Cleaned blocks to the HTML string. */
function serialize(blocks) {
  return blocks.map((block) => {
    if (block.type === 'blockquote') return `<blockquote>${serialize(block.blocks)}</blockquote>`;
    if (LISTS.has(block.type)) return writeList(block);
    // The paste profile's blocks in html@1 terms: never a pre or a table.
    if (block.type === 'pre') {
      const leaves = block.text.split('\n').flatMap((line, index) => [
        ...(index ? [{kind: 'br', strong: false, em: false, href: null}] : []),
        {kind: 'text', value: line.replace(/[\t\f]/gu, ' '), strong: false, em: false, href: null},
      ]);
      return `<p>${writeLeaves(tidyLeaves(leaves, 'value'))}</p>`;
    }
    if (block.type === 'table') {
      const cells = [{leaves: block.caption}, ...block.rows.flatMap((row) => row.cells)];
      return cells.filter((cell) => hasText(cell.leaves)).map((cell) => `<p>${writeLeaves(cell.leaves)}</p>`).join('');
    }
    return `<${block.type}>${writeLeaves(block.leaves)}</${block.type}>`;
  }).join('');
}

/** The text of cleaned blocks, for counting and emptiness. */
function plainText(html) {
  const blocks = cleanTree(parseHtml(html), {mode: 'value'});
  const text = (leaves) => leaves.map((item) => (item.kind === 'br' ? '\n' : item.value)).join('');
  const list = (block) => block.items.map((item) => item.children.map((part) => (part.type === 'inline' ? text(part.leaves) : list(part))).join('\n')).join('\n');
  const all = (items) => items.map((block) => (block.type === 'blockquote' ? all(block.blocks) : LISTS.has(block.type) ? list(block) : text(block.leaves))).join('\n\n');
  return all(blocks);
}

/**
 * Untrusted HTML into the subset. With a document (the browser) the string
 * is parsed by the browser in an inert <template>; without one, by
 * parseHtml. A DOM node may be given instead of a string.
 * @param {string|Node|null|undefined} input
 * @param {{mode?: 'value'|'editor', document?: Document|null}} [options]
 * @returns {string}
 */
function sanitizeRichText(input, {mode = 'value', document: documentRef} = {}) {
  let tree;
  if (input && typeof input === 'object' && typeof input.nodeType === 'number') {
    tree = treeFromDom(input);
  } else {
    const html = typeof input === 'string' ? input : '';
    const doc = documentRef === undefined ? globalThis.document : documentRef;
    if (html && doc?.createElement) {
      const template = doc.createElement('template');
      template.innerHTML = html;
      tree = treeFromDom(template.content);
    } else {
      tree = parseHtml(html);
    }
  }
  return serialize(cleanTree(tree, {mode}));
}

/**
 * Plain text into the subset: paragraphs split on blank lines, a single line
 * break a <br>.
 * @param {string} text
 * @param {{mode?: 'value'|'editor'}} [options]
 */
function richTextFromPlainText(text, {mode = 'value'} = {}) {
  const source = String(text ?? '').replace(/\r\n?/gu, '\n');
  const blocks = source.split(/\n[ \t\f\v\u00a0]*\n+/u).map((paragraph) => {
    const leaves = [];
    paragraph.split('\n').forEach((line, index) => {
      if (index > 0) leaves.push({kind: 'br', strong: false, em: false, href: null});
      const value = line.replace(/[\t\f\v ]+/gu, ' ');
      if (value) leaves.push({kind: 'text', value, strong: false, em: false, href: null});
    });
    return {type: 'p', leaves};
  });
  return serialize(tidyBlocks(blocks, mode));
}


/***/ },

/***/ "354525e80715"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   files: () => (/* binding */ files)
/* harmony export */ });
/* harmony import */ var _en_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("f050502c25f8");
// Written by scripts/build-language-packs.mjs from src/core/lang/built-in.json
// (owner decision C282); do not edit. The words this bundle carries: the
// built-in languages' (en); every other language comes from
// a language file (core/lang/<code>.js or its parts).


const files = { en: { runtime: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime } };

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ en: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime });


/***/ },

/***/ "4f56033a1eae"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PASTE_BLOCKS: () => (/* reexport safe */ _core_js_composition_html_subset_mjs__WEBPACK_IMPORTED_MODULE_0__.PASTE_BLOCKS),
/* harmony export */   RICH_TEXT_BLOCKS: () => (/* reexport safe */ _core_js_composition_html_subset_mjs__WEBPACK_IMPORTED_MODULE_0__.RICH_TEXT_BLOCKS),
/* harmony export */   RICH_TEXT_ELEMENTS: () => (/* reexport safe */ _core_js_composition_html_subset_mjs__WEBPACK_IMPORTED_MODULE_0__.RICH_TEXT_ELEMENTS),
/* harmony export */   RICH_TEXT_PROFILES: () => (/* reexport safe */ _core_js_composition_html_subset_mjs__WEBPACK_IMPORTED_MODULE_0__.RICH_TEXT_PROFILES),
/* harmony export */   RICH_TEXT_SCHEMES: () => (/* reexport safe */ _core_js_composition_html_subset_mjs__WEBPACK_IMPORTED_MODULE_0__.RICH_TEXT_SCHEMES),
/* harmony export */   cleanTree: () => (/* reexport safe */ _core_js_composition_html_subset_mjs__WEBPACK_IMPORTED_MODULE_0__.cleanTree),
/* harmony export */   decodeEntities: () => (/* reexport safe */ _core_js_composition_html_subset_mjs__WEBPACK_IMPORTED_MODULE_0__.decodeEntities),
/* harmony export */   parseHtml: () => (/* reexport safe */ _core_js_composition_html_subset_mjs__WEBPACK_IMPORTED_MODULE_0__.parseHtml),
/* harmony export */   plainText: () => (/* reexport safe */ _core_js_composition_html_subset_mjs__WEBPACK_IMPORTED_MODULE_0__.plainText),
/* harmony export */   richTextFromPlainText: () => (/* reexport safe */ _core_js_composition_html_subset_mjs__WEBPACK_IMPORTED_MODULE_0__.richTextFromPlainText),
/* harmony export */   richTextHref: () => (/* reexport safe */ _core_js_composition_html_subset_mjs__WEBPACK_IMPORTED_MODULE_0__.richTextHref),
/* harmony export */   sanitizeRichText: () => (/* reexport safe */ _core_js_composition_html_subset_mjs__WEBPACK_IMPORTED_MODULE_0__.sanitizeRichText),
/* harmony export */   serialize: () => (/* reexport safe */ _core_js_composition_html_subset_mjs__WEBPACK_IMPORTED_MODULE_0__.serialize),
/* harmony export */   treeFromDom: () => (/* reexport safe */ _core_js_composition_html_subset_mjs__WEBPACK_IMPORTED_MODULE_0__.treeFromDom)
/* harmony export */ });
/* harmony import */ var _core_js_composition_html_subset_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("e19611ff78cb");
// The html@1 subset of sf-input-rich. The rule moved to the core runtime with
// content.html 1.0.0, so the Composition renderer and this element share one
// cleaner: src/core/js/composition/html-subset.mjs.



/***/ },

/***/ "f050502c25f8"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"runtime":{"yes":"Yes","no":"No","searchInList":"Find in the list","containsText":"Contains…","fileKind_image":"Images","fileKind_document":"Documents","fileKind_archive":"Archives","fileKind_other":"Other files","operator":"Operator","rangeFrom":"From","rangeTo":"To","condition":"Condition","numberOperator_eq":"Equals","numberOperator_neq":"Not equal","numberOperator_gt":"Greater than","numberOperator_gte":"At least","numberOperator_lt":"Less than","numberOperator_lte":"At most","numberOperator_between":"Between","numberOperator_empty":"Empty","numberOperator_not-empty":"Not empty","filterNumber":"Number","filterAmount":"Amount","filterPercent":"Percent","dateCondition":"Condition","dateByDayIn":"Compared by day, time zone {zone}","dateGroup_date":"Date","dateGroup_period":"Period","dateGroup_filled":"Filled","dateGroup_range":"The record\'s period","dateCondition_eq":"Exact date","dateCondition_between":"Between","dateCondition_lt":"Before","dateCondition_gt":"After","dateCondition_gte":"On or after","dateCondition_lte":"On or before","dateCondition_lastDays":"Last N days","dateCondition_nextDays":"Next N days","dateCondition_empty":"Empty","dateCondition_notEmpty":"Not empty","dateCondition_overlaps":"Runs in","dateCondition_within":"Entirely in","dateCondition_starts":"Starts in","dateCondition_ends":"Ends in","dateCondition_contains":"Runs on the day","datePeriod_today":"Today","datePeriod_yesterday":"Yesterday","datePeriod_thisWeek":"This week","datePeriod_lastWeek":"Last week","datePeriod_last7Days":"Last 7 days","datePeriod_thisMonth":"This month","datePeriod_lastMonth":"Last month","datePeriod_thisYear":"This year","datePeriod_tomorrow":"Tomorrow","datePeriod_nextWeek":"Next week","datePeriod_nextMonth":"Next month","datePeriodIn_today":"today","datePeriodIn_yesterday":"yesterday","datePeriodIn_thisWeek":"this week","datePeriodIn_lastWeek":"last week","datePeriodIn_last7Days":"in the last 7 days","datePeriodIn_thisMonth":"this month","datePeriodIn_lastMonth":"last month","datePeriodIn_thisYear":"this year","datePeriodIn_tomorrow":"tomorrow","datePeriodIn_nextWeek":"next week","datePeriodIn_nextMonth":"next month","dateChip":"{field}: {condition}","dateChip_lt":"before {date}","dateChip_gt":"after {date}","dateChip_gte":"on or after {date}","dateChip_lte":"on or before {date}","dateChip_lastDays":{"one":"in the last day","other":"in the last {n} days"},"dateChip_nextDays":{"one":"in the next day","other":"in the next {n} days"},"dateChip_empty":"empty","dateChip_notEmpty":"not empty","dateChip_overlaps":"runs {when}","dateChip_within":"entirely {when}","dateChip_withinDays":"entirely within {when}","dateChip_starts":"starts {when}","dateChip_ends":"ends {when}","dateChip_contains":"runs on {date}","dateCountLast":"Days, today included","dateCountNext":"Days ahead, today included","dateCountUnit":"days","dateValueDate":"Date","dateValueDay":"Day","dateValuePeriod":"Period","dateWhen":"When","dateOwnDays":"Own dates","loadingOptions":"Loading the options","optionsError":"The options could not be loaded","pickRecord":"Choose a record","pickFromList":"Choose from the list","searchRecords":"Find a record","loadingRecords":"Loading records","recordsError":"The records could not be loaded","retry":"Try again","loadMore":"Load more","removeFile":"Remove","fileRemoved":"File removed","undo":"Undo","passwordSet":"Set","passwordUnset":"Not set","phoneExtension":"ext.","passwordKeep":"Set; type a new one to replace it","maskIncomplete":"Complete the field","notNumber":"Enter a number","precisionMax":{"one":"At most {n} digit after the point","other":"At most {n} digits after the point"},"fractionNone":"A whole amount, no digits after the point","boundBetween":"From {min} to {max}","boundAtLeast":"At least {min}","boundAtMost":"At most {max}","currency":"Currency","chooseCurrency":"Choose a currency","rowCount":{"one":"{n} row","other":"{n} rows"},"filterApply":"Apply","filterReset":"Reset","operatorAny":"Any date","operatorBetween":"Range","operatorContains":"Contains","operatorEq":"Exactly","operatorGt":"Greater than","operatorGte":"Greater or equal","operatorIn":"In the list","operatorLt":"Less than","operatorLte":"Less or equal","operatorMonth":"This month","operatorStartsWith":"Starts with","operatorToday":"Today","operatorWeek":"This week","type-string":"String","variant-string-phone":"Phone","variant-string-password":"Password","type-text":"Text","type-html":"Formatted text","type-integer":"Integer","variant-integer-stepper":"With steppers","type-number":"Number","variant-number-scale":"Scale 0–100","variant-number-meter":"Share of a limit","variant-number-stepper":"With steppers","type-date":"Date","type-datetime":"Date and time","type-time":"Time","type-boolean":"Yes or no","type-choice":"One of a list","variant-choice-buttons":"As buttons","type-choices":"Several of a list","variant-choices-badges":"As badges","variant-choices-checklist":"As a checklist","variant-choices-select":"As a dropdown","type-user":"User","type-record":"Record","type-relation":"Relation","type-lookup":"From a reference list","type-file":"File","variant-file-image":"Image","variant-file-image-card":"Image card","variant-file-image-list":"Image list","type-color":"Colour","type-include":"Code","type-money":"Money","type-percent":"Percent","type-items":"Rows","type-compound":"Compound","type-ru.requisites":"Requisites (Russia)","type-phone":"Phone","type-password":"Password","type-complex":"Compound","wholeNumber":"A whole number, no digits after the point","template-string-input":"Input","template-phone-phone_input":"Phone with country code","template-password-input":"Hidden input","template-text-textarea":"Multiline input","template-html-editor":"Editor","template-number-input":"Number input","template-number-stepper":"«−» and «+» buttons","template-number-scale":"Level scale","template-number-meter":"Share of a limit","template-date-datepicker":"Date with a calendar","template-datetime-datepicker":"Date and time","template-time-timepicker":"Time","template-boolean-switch":"Switch","template-boolean-checkbox":"Checkbox","template-boolean-buttons":"«Yes / No» buttons","template-choice-dropdown":"Dropdown","template-choice-buttons":"Buttons","template-choices-dropdown":"Dropdown","template-choices-checklist":"Checklist","template-choices-badges":"Badges","template-user-reference_picker":"User picker","template-record-reference_picker":"Record picker","template-relation-reference_picker":"Record picker","template-lookup-source_picker":"Reference list picker","template-file-upload":"File upload","template-file-image":"Image","template-file-image_card":"Image card","template-file-image_list":"Image list","template-color-color_picker":"Colour picker","template-include-script":"Code","template-money-money_input":"Amount with currency","template-percent-input":"Number input","template-items-rows":"Rows table","template-complex-parts":"Parts","template-ru.requisites-requisites":"Requisites block","type-url":"Web address","type-link":"Link with text","type-ru.inn":"INN (Russian taxpayer number)","template-url-input":"Address input","template-link-link":"Link","template-ru.inn-input":"Digits input","template-percent-stepper":"«−» and «+» buttons","template-percent-scale":"Level scale","template-percent-meter":"Share of a limit","urlInvalid":"Enter a full address: https://…","linkAddress":"Address","linkText":"Link text","linkNeedsAddress":"Enter the address","linkInvalid":"An address is https://…, a site path /… or #anchor","linkTextLong":"No more than 255 characters","innDigits":"An INN is 10 digits (an organisation) or 12 (a person)","innOrganization":"An organisation’s INN is 10 digits","innPerson":"A person’s INN is 12 digits","innChecksum":"The INN check digit does not match","dateGroup_time":"Time","timeCondition_eq":"Equals","timeValue":"Time","operatorAnyOf":"any of","operatorAllOf":"all of","operatorNoneOf":"none of","operatorEmpty":"not set","operatorFilled":"set","filterNotSet":"Not set","filterCondition":"Condition","operatorContainsWord":"contains","operatorStartsWithWord":"starts with","operatorEqualWord":"equals","operatorMoreWord":"more than","operatorLessWord":"less than","operatorFromTo":"from – to","operatorMoreOrEqualWord":"at least","operatorLessOrEqualWord":"at most","rangeFromWord":"from","rangeToWord":"to","filterTextPlaceholder":"Text","filterRemoveCondition":"Remove condition"}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("e5483002f3ea");
/******/
/******/ })()
;