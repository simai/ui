/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "e577837dd70a"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   calendarDayOffset: () => (/* binding */ calendarDayOffset),
/* harmony export */   formatDate: () => (/* binding */ formatDate),
/* harmony export */   msUntilNextDay: () => (/* binding */ msUntilNextDay),
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
 * chart's tick, «14:05» with two-digit hours). Anything that is not a date is
 * `gap`, '' by default.
 */


function formatDate(value, {
  date = 'medium',
  time = null,
  intl = null,
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

  return (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.intlFormatter)('DateTimeFormat', (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.formatLocale)(where), options).format(moment);
}
/**
 * Calendar days from `now` to the value in the reader's time zone: 0 today,
 * -1 yesterday, 1 tomorrow; NaN when the value is no date. Counted on
 * calendar dates, not 24-hour spans, so 23:59 yesterday is -1 at 00:01 and a
 * day of a clock change is still one day.
 */

function calendarDayOffset(value, {
  now = new Date()
} = {}) {
  const moment = (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.toDate)(value);
  const today = (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.toDate)(now);
  if (!moment || !today) return Number.NaN;
  const day = Date.UTC(moment.getFullYear(), moment.getMonth(), moment.getDate());
  const base = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.round((day - base) / DAY_MS);
}
/**
 * Milliseconds from `now` to the reader's next midnight, when every relative
 * day on the screen moves by one. A component that shows them sets a timer
 * for this long (plus a second's margin, so it wakes in the new day) and
 * draws them again; «сегодня» said yesterday is wrong by morning.
 */

function msUntilNextDay(now = new Date()) {
  const today = (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.toDate)(now) ?? new Date();
  const next = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  return next.getTime() - today.getTime();
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "c016c43b1452"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FILE_SIZE_UNITS: () => (/* binding */ FILE_SIZE_UNITS),
/* harmony export */   fileSizeUnits: () => (/* binding */ fileSizeUnits),
/* harmony export */   formatFileSize: () => (/* binding */ formatFileSize)
/* harmony export */ });
/* harmony import */ var _format_intl_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("15b4e93ff6ed");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_format_intl_js__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
_format_intl_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
// File sizes in the page's language («1,4 МБ»), with no top-level side
// effects (format-intl.js). The same functions as core/js/format.js,
// composition/file-size.mjs and SF.format.fileSize.
 // The four words of a size, in the languages the SIMAI Framework ships; any
// other language reads the English words with its own digits. A component
// with words of its own passes them as `units`.

const FILE_SIZE_UNITS = /* @__PURE__ */Object.freeze({
  en: /* @__PURE__ */Object.freeze(['B', 'KB', 'MB', 'GB']),
  ru: /* @__PURE__ */Object.freeze(['Б', 'КБ', 'МБ', 'ГБ'])
});
/** The unit words for a locale: its language's, else English. */

function fileSizeUnits(locale = 'en') {
  const language = String(locale || 'en').toLowerCase().split('-')[0];
  return Object.hasOwn(FILE_SIZE_UNITS, language) ? FILE_SIZE_UNITS[language] : FILE_SIZE_UNITS.en;
}
/**
 * A size as people read it: «512 Б», «2 КБ», «1,4 МБ», «12 GB». Binary steps
 * of 1024; one digit after the point under ten of a unit, none above it or in
 * bytes. Text a host already formatted is returned as it came; anything that
 * is not a size is ''.
 *
 *   formatFileSize(size, {node, units?, locale?})
 *   formatFileSize(size, units, locale)   -- the form composition/file-size.mjs
 *                                            and sf-image-field 1.x published
 */

function formatFileSize(size, options = {}, legacyLocale) {
  const where = Array.isArray(options) ? {
    units: options,
    locale: legacyLocale ?? 'en'
  } : options ?? {};
  if (typeof size === 'string') return size;
  const bytes = Number(size);
  if (size === null || size === undefined || !Number.isFinite(bytes) || bytes < 0) return '';
  const locale = (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.formatLocale)(where);
  const units = where.units?.length ? where.units : fileSizeUnits(locale);
  let amount = bytes;
  let index = 0;

  while (amount >= 1024 && index < units.length - 1) {
    amount /= 1024;
    index += 1;
  }

  const digits = index === 0 || amount >= 10 ? 0 : 1;
  return `${(0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.intlFormatter)('NumberFormat', locale, {
    maximumFractionDigits: digits
  }).format(amount)} ${units[index]}`;
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
/* harmony export */   numberOptions: () => (/* binding */ numberOptions)
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
 *   percent           a share 0..1 as 12 %
 *   compact           1,2 тыс.  /  1.2K
 *   currency-<CODE>   1 234,50 ₽ (an ISO 4217 code)
 *   unit-<unit>       45,3 ГБ (an Intl unit: gigabyte, megabit-per-second)
 *
 * Anything else reads as number.
 */

function numberOptions(format = 'number', step = 0) {
  const word = String(format || 'number').trim();
  if (word === 'integer') return {
    maximumFractionDigits: 0
  };
  if (word === 'percent') return {
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
  return (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.intlFormatter)('NumberFormat', (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.formatLocale)(where), options).format(number);
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "ee5c3aad2640"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   formatRelativeDay: () => (/* binding */ formatRelativeDay),
/* harmony export */   formatRelativeTime: () => (/* binding */ formatRelativeTime)
/* harmony export */ });
/* harmony import */ var _format_intl_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("15b4e93ff6ed");
/* harmony import */ var _format_date_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("e577837dd70a");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_format_intl_js__WEBPACK_IMPORTED_MODULE_0__, _format_date_js__WEBPACK_IMPORTED_MODULE_1__]);
([_format_intl_js__WEBPACK_IMPORTED_MODULE_0__, _format_date_js__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
// Relative days and times in the page's language («вчера», «5 минут назад»),
// with no top-level side effects (format-intl.js). The same functions as
// core/js/format.js and SF.format.relativeDay / relativeTime.

 // The first letter in capitals, by the locale's rule («вчера» → «Вчера»).

function capitalise(text, locale) {
  const first = Array.from(text)[0] ?? '';
  return first ? first.toLocaleUpperCase(locale || undefined) + text.slice(first.length) : text;
}
/**
 * The day a moment fell on, as a list says it: «сегодня», «вчера», «завтра»,
 * the weekday within the last week («понедельник»), else the date («3 ноября»,
 * with the year when it is not this one). The words are the platform's for
 * the locale (Intl.RelativeTimeFormat, numeric auto); a component that ships
 * its own passes them (`today`, `yesterday`, `tomorrow`) and they win.
 * `weekday: false` goes from yesterday straight to the date; `capital: true`
 * starts the word with a capital, as a heading or a divider does.
 *
 * The answer changes at the reader's midnight: msUntilNextDay (format-date.js)
 * says when.
 */


function formatRelativeDay(value, {
  now = new Date(),
  today,
  yesterday,
  tomorrow,
  weekday = true,
  capital = false,
  gap = '',
  ...where
} = {}) {
  const moment = (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.toDate)(value);
  if (!moment) return gap;
  const locale = (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.formatLocale)(where);
  const offset = (0,_format_date_js__WEBPACK_IMPORTED_MODULE_1__.calendarDayOffset)(moment, {
    now
  });
  const own = {
    0: today,
    [-1]: yesterday,
    1: tomorrow
  }[offset];
  let text;

  if (own) {
    text = String(own);
  } else if (offset >= -1 && offset <= 1) {
    text = (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.intlFormatter)('RelativeTimeFormat', locale, {
      numeric: 'auto'
    }).format(offset, 'day');
  } else if (weekday && offset < -1 && offset > -7) {
    text = (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.intlFormatter)('DateTimeFormat', locale, {
      weekday: 'long'
    }).format(moment);
  } else {
    const year = moment.getFullYear() === (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.toDate)(now).getFullYear() ? {} : {
      year: 'numeric'
    };
    text = (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.intlFormatter)('DateTimeFormat', locale, {
      day: 'numeric',
      month: 'long',
      ...year
    }).format(moment);
  }

  return capital ? capitalise(text, locale) : text;
} // The largest unit a span reaches is the one it is said in (mail-letters'
// steps, 2026-10): 90 seconds is «2 минуты назад», 40 days «в прошлом месяце».

const RELATIVE_STEPS = [['year', 31536000], ['month', 2592000], ['week', 604800], ['day', 86400], ['hour', 3600], ['minute', 60]];
/** «5 минут назад», «через 2 часа»: a moment from `now`, in the locale. */

function formatRelativeTime(value, {
  now = new Date(),
  gap = '',
  ...where
} = {}) {
  const moment = (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.toDate)(value);
  const base = (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.toDate)(now);
  if (!moment || !base) return gap;
  const seconds = Math.round((moment.getTime() - base.getTime()) / 1000);
  const format = (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.intlFormatter)('RelativeTimeFormat', (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.formatLocale)(where), {
    numeric: 'auto'
  });

  for (const [unit, size] of RELATIVE_STEPS) {
    if (Math.abs(seconds) >= size) return format.format(Math.round(seconds / size), unit);
  }

  return format.format(seconds, 'second');
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "5b8371b87515"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FILE_SIZE_UNITS: () => (/* reexport safe */ _format_file_size_js__WEBPACK_IMPORTED_MODULE_4__.FILE_SIZE_UNITS),
/* harmony export */   calendarDayOffset: () => (/* reexport safe */ _format_date_js__WEBPACK_IMPORTED_MODULE_1__.calendarDayOffset),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   fileSizeUnits: () => (/* reexport safe */ _format_file_size_js__WEBPACK_IMPORTED_MODULE_4__.fileSizeUnits),
/* harmony export */   formatDate: () => (/* reexport safe */ _format_date_js__WEBPACK_IMPORTED_MODULE_1__.formatDate),
/* harmony export */   formatFileSize: () => (/* reexport safe */ _format_file_size_js__WEBPACK_IMPORTED_MODULE_4__.formatFileSize),
/* harmony export */   formatLocale: () => (/* reexport safe */ _format_intl_js__WEBPACK_IMPORTED_MODULE_0__.formatLocale),
/* harmony export */   formatNumber: () => (/* reexport safe */ _format_number_js__WEBPACK_IMPORTED_MODULE_3__.formatNumber),
/* harmony export */   formatRelativeDay: () => (/* reexport safe */ _format_relative_js__WEBPACK_IMPORTED_MODULE_2__.formatRelativeDay),
/* harmony export */   formatRelativeTime: () => (/* reexport safe */ _format_relative_js__WEBPACK_IMPORTED_MODULE_2__.formatRelativeTime),
/* harmony export */   msUntilNextDay: () => (/* reexport safe */ _format_date_js__WEBPACK_IMPORTED_MODULE_1__.msUntilNextDay),
/* harmony export */   numberOptions: () => (/* reexport safe */ _format_number_js__WEBPACK_IMPORTED_MODULE_3__.numberOptions),
/* harmony export */   publishFormat: () => (/* binding */ publishFormat),
/* harmony export */   toDate: () => (/* reexport safe */ _format_intl_js__WEBPACK_IMPORTED_MODULE_0__.toDate)
/* harmony export */ });
/* harmony import */ var _format_intl_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("15b4e93ff6ed");
/* harmony import */ var _format_date_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("e577837dd70a");
/* harmony import */ var _format_relative_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("ee5c3aad2640");
/* harmony import */ var _format_number_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("c9ce0852ac73");
/* harmony import */ var _format_file_size_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("c016c43b1452");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_format_intl_js__WEBPACK_IMPORTED_MODULE_0__, _format_date_js__WEBPACK_IMPORTED_MODULE_1__, _format_relative_js__WEBPACK_IMPORTED_MODULE_2__, _format_number_js__WEBPACK_IMPORTED_MODULE_3__, _format_file_size_js__WEBPACK_IMPORTED_MODULE_4__]);
([_format_intl_js__WEBPACK_IMPORTED_MODULE_0__, _format_date_js__WEBPACK_IMPORTED_MODULE_1__, _format_relative_js__WEBPACK_IMPORTED_MODULE_2__, _format_number_js__WEBPACK_IMPORTED_MODULE_3__, _format_file_size_js__WEBPACK_IMPORTED_MODULE_4__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
// Dates, days, numbers and file sizes as people read them, in the page's
// language (reuse audit 2026-11-02, finding 7). About fourteen components
// wrote these themselves -- three relative-day rules (thread-list, chat-window
// with its own midnight refresh, mail-letters), file sizes in four places,
// numbers in the chart and the quantity -- and they disagreed: «Вчера» in one
// list, «вчера» in the next, «1.4MB» beside «1,4 МБ». One rule now, through
// Intl only; the most complete copy was ui-chart's chart-core/format.js, whose
// number words are kept as they were.
//
// The locale is the page's (page-language.js pageLocale): an explicit
// `locale`, else the language of `node` -- the nearest [lang] above it, the
// page's choice, <html lang>, English. Never a fixed ru-RU.
//
// This module gathers the helpers and the SF.format object; the helpers live
// in modules of their own with no top-level side effects (core.runtime 1.28.0;
// ui-chart, 2026-11-05), and a bundle imports what it calls from those:
//
//   format-number.js     formatNumber, numberOptions
//   format-date.js       formatDate, calendarDayOffset, msUntilNextDay, toDate
//   format-relative.js   formatRelativeDay, formatRelativeTime
//   format-file-size.js  formatFileSize, fileSizeUnits, FILE_SIZE_UNITS
//   format-intl.js       formatLocale, toDate (and the shared Intl formatters)
//
// Until 1.28.0 this module published SF.format on load, from whichever bundle
// ran it first; that kept every helper in every bundle that imported one (each
// chart bundle grew by 1.3-1.4 KB gzip). Core's entry publishes it now
// (index.js calls publishFormat), and importing this module changes nothing on
// the page. Its exports are as they were.






const Format = /* @__PURE__ */Object.freeze({
  locale: _format_intl_js__WEBPACK_IMPORTED_MODULE_0__.formatLocale,
  date: _format_date_js__WEBPACK_IMPORTED_MODULE_1__.formatDate,
  relativeDay: _format_relative_js__WEBPACK_IMPORTED_MODULE_2__.formatRelativeDay,
  relativeTime: _format_relative_js__WEBPACK_IMPORTED_MODULE_2__.formatRelativeTime,
  dayOffset: _format_date_js__WEBPACK_IMPORTED_MODULE_1__.calendarDayOffset,
  msUntilNextDay: _format_date_js__WEBPACK_IMPORTED_MODULE_1__.msUntilNextDay,
  number: _format_number_js__WEBPACK_IMPORTED_MODULE_3__.formatNumber,
  numberOptions: _format_number_js__WEBPACK_IMPORTED_MODULE_3__.numberOptions,
  fileSize: _format_file_size_js__WEBPACK_IMPORTED_MODULE_4__.formatFileSize
});
/**
 * Publishes SF.format on `root` (the page's global), unless something is there
 * already: core's entry calls it once; a component bundle never does.
 */

function publishFormat(root = typeof globalThis !== 'undefined' ? globalThis : undefined) {
  if (!root) return undefined;
  root.SF = root.SF || {};
  if (!root.SF.format) root.SF.format = Format;
  return root.SF.format;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Format);
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "277cae13a64b"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HIDE: () => (/* binding */ HIDE),
/* harmony export */   ICONS: () => (/* binding */ ICONS),
/* harmony export */   LEVELS: () => (/* binding */ LEVELS),
/* harmony export */   SfAlertBar: () => (/* binding */ SfAlertBar),
/* harmony export */   levelOf: () => (/* binding */ levelOf),
/* harmony export */   normalizeItems: () => (/* binding */ normalizeItems),
/* harmony export */   wrapIndex: () => (/* binding */ wrapIndex)
/* harmony export */ });
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _core_js_format__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("5b8371b87515");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("d302c3bc5424");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("677c9e2dc7c8");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("528216f76e58");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("2a4d264285b5");
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("ba9bcf2fbdc4");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_format__WEBPACK_IMPORTED_MODULE_2__, _js_templates_default__WEBPACK_IMPORTED_MODULE_3__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_format__WEBPACK_IMPORTED_MODULE_2__, _js_templates_default__WEBPACK_IMPORTED_MODULE_3__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
// sf-alert-bar: the full-width bar above a page or admin header for the
// conditions that need action now -- a disk nearly full, a failed backup, a
// site that does not answer, an update. One bar for all of them:
//
//   <sf-alert-bar><script type="application/json" data-sf-settings>
//     {"items": [{"id": "backup", "level": "warning", "text": "…",
//       "action": {"label": "Открыть копии", "href": "/backups/"}}]}
//   </script></sf-alert-bar>
//
// The items are sorted danger, warning, info, the newest first; the bar takes
// the colour of the first and shows it. Several are paged «‹ 1 из N ›» and
// listed under the bar with «Все N». A warning closes for a day, an info item
// for good; a danger item is never closed, its button minimizes the bar to a
// strip that keeps the count.
//
// The bar stores nothing. A close, an acknowledge and an action link are
// events with the item's id (sf-alert-bar-close, -acknowledge, -navigate);
// the host keeps the choice and sets the list again. A closed or acknowledged
// item leaves the bar at once, until the host's next list.
//
// From its component.json (standard simai.smart-component 1.3.14 §3, §4,
// §8): the settings and values are made by core/js/element-manifest.js, close
// is the action and answers an outcome, the words are the language files'.







 // The list's id, one per bar on the page (the same on every render, so a
// first-paint snapshot is stable).

let sequence = 0;
const LEVELS = ['danger', 'warning', 'info'];
const RANK = {
  danger: 0,
  warning: 1,
  info: 2
}; // How a closed item is kept by the host: a warning for a day, info for good.

const HIDE = {
  warning: 'day',
  info: 'always'
}; // sf-alert's status icons, by the theme's status words.

const ICONS = {
  danger: 'error',
  warning: 'warning',
  info: 'info'
}; // Within a day a time reads «5 минут назад»; older, as a date and a time.

const RELATIVE_SPAN = 86400000;

const text = value => value === undefined || value === null ? '' : String(value).trim();
/** An item's level: the owner's three words; error is read as danger, anything else as info. */


function levelOf(value) {
  const word = text(value).toLowerCase();
  if (word === 'error') return 'danger';
  return LEVELS.includes(word) ? word : 'info';
}
/**
 * The items as given, made safe and sorted: danger, warning, info; inside a
 * level the newest first by time. An item without an id or a text is left
 * out; one without a readable time keeps the host's order after the timed
 * ones of its level.
 */

function normalizeItems(value) {
  const list = Array.isArray(value) ? value : [];
  const seen = new Set();
  const items = [];
  list.forEach((item, order) => {
    if (!item || typeof item !== 'object') return;
    const id = text(item.id);
    const body = text(item.text);
    if (!id || !body || seen.has(id)) return;
    seen.add(id);
    const level = levelOf(item.level);
    const moment = (0,_core_js_format__WEBPACK_IMPORTED_MODULE_2__.toDate)(item.time);
    const action = item.action && typeof item.action === 'object' && text(item.action.label) ? {
      label: text(item.action.label),
      href: text(item.action.href)
    } : null;
    const acknowledge = item.acknowledge && typeof item.acknowledge === 'object' ? {
      label: text(item.acknowledge.label)
    } : item.acknowledge === true ? {
      label: ''
    } : null;
    items.push({
      id,
      level,
      text: body,
      source: text(item.source),
      time: moment ? moment.toISOString() : '',
      at: moment ? moment.getTime() : null,
      action,
      acknowledge,
      // A danger item is never closed; the others unless the host says no.
      dismissible: level !== 'danger' && item.dismissible !== false,
      order
    });
  });
  return items.sort((a, b) => {
    if (RANK[a.level] !== RANK[b.level]) return RANK[a.level] - RANK[b.level];
    if (a.at !== null && b.at !== null && a.at !== b.at) return b.at - a.at;
    if (a.at === null !== (b.at === null)) return a.at === null ? 1 : -1;
    return a.order - b.order;
  });
}
/** A place in a list of `length`, wrapped: one before the first is the last. */

function wrapIndex(value, length) {
  if (length <= 0) return 0;
  const number = Math.trunc(Number(value)) || 0;
  return (number % length + length) % length;
}
const AlertBarElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_4__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_5__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_6__
  },
  source: 'ru',
  actions: {
    close(args = {}) {
      const id = typeof args === 'string' ? args : args?.id;
      return this.closeItem(text(id), 'api');
    }

  }
});

class SfAlertBar extends AlertBarElement {
  constructor() {
    super(); // The place of the shown item in the sorted list, and the list's state.

    this._index = 0;
    this._listOpen = false; // Items a person closed or acknowledged in this list; the host's next
    // list starts afresh (the bar stores nothing).

    this._gone = new Set();
    this._source = undefined; // What the bar knew at its last drawing, to tell a new item from one that
    // was there: the first list is the page's, never announced.

    this._known = null;
    this._announce = {
      alert: '',
      status: ''
    };
    this._listId = `sf-alert-bar-list-${++sequence}`;

    this._onKey = event => this.onKey(event);
  }

  onConnected() {
    super.onConnected?.();
    this.addEventListener('keydown', this._onKey);
  }

  onDisconnected() {
    super.onDisconnected?.();
    this.removeEventListener('keydown', this._onKey);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === 'minimized' && oldValue !== newValue) this.sfHostState('data-minimized', this.isMinimized);
  } // The items the bar shows: the host's list, sorted, less what a person
  // closed or acknowledged since the host set it.


  get list() {
    return normalizeItems(this.items).filter(item => !this._gone.has(item.id));
  } // The most serious level shown; the bar's colour.


  get level() {
    return this.list[0]?.level ?? '';
  } // Only a danger bar is minimized.


  get isMinimized() {
    return Boolean(this.minimized) && this.level === 'danger';
  } // A new list from the host: forget what was closed in the old one, find
  // what is new, keep the shown item in view when it is still there.


  syncList() {
    const source = this.items;
    if (source === this._source) return;
    const shownId = this._shownId;
    this._source = source;

    this._gone.clear();

    const list = this.list;
    const ids = new Set(list.map(item => item.id));

    if (this._known) {
      const fresh = list.filter(item => !this._known.has(item.id));
      const danger = fresh.filter(item => item.level === 'danger');
      const other = fresh.filter(item => item.level !== 'danger'); // A new danger item is the one thing that is read out at once (role
      // alert); the rest politely (role status). A minimized bar opens again
      // for it.

      this._announce = {
        alert: danger.map(item => this.spoken(item)).join(' '),
        status: other.map(item => this.spoken(item)).join(' ')
      };

      if (danger.length) {
        this._index = 0; // The page that keeps the minimized state hears that it ended.

        if (this.minimized) {
          this.minimized = false;
          this.sfEmit('minimize', {
            minimized: false
          });
        }
      }
    }

    this._known = ids;
    const kept = list.findIndex(item => item.id === shownId);
    if (kept >= 0 && !this._announce.alert) this._index = kept;else if (!this._announce.alert) this._index = wrapIndex(this._index, list.length);
    if (list.length < 2) this._listOpen = false;
  }

  spoken(item) {
    return `${this.sfWord(`level-${item.level}`)}: ${item.text}`;
  } // A time as a person reads it: «5 минут назад» within a day, else a date
  // and a time, in the page language.


  timeText(item) {
    if (!item.time) return '';
    const now = Date.now();
    return Math.abs(now - item.at) < RELATIVE_SPAN ? (0,_core_js_format__WEBPACK_IMPORTED_MODULE_2__.formatRelativeTime)(item.time, {
      node: this,
      now: new Date(now)
    }) : (0,_core_js_format__WEBPACK_IMPORTED_MODULE_2__.formatDate)(item.time, {
      date: 'medium',
      time: 'short',
      node: this
    });
  } // ---------------------------------------------------------------- presses


  page(step) {
    const count = this.list.length;
    if (count < 2) return;
    this._index = wrapIndex(this._index + step, count);
    this.requestComponentUpdate('page');
  }

  toggleList(force) {
    const open = force === undefined ? !this._listOpen : Boolean(force);
    if (open === this._listOpen) return;
    this._listOpen = open;
    this.requestComponentUpdate('list');
  }

  setMinimized(minimized) {
    const next = Boolean(minimized);
    if (next === this.isMinimized) return;
    const restore = this.contains(this.ownerDocument.activeElement);
    this.minimized = next;
    this._listOpen = false;
    this.sfHostState('data-minimized', this.isMinimized);
    this.sfEmit('minimize', {
      minimized: next
    }); // The press's own control is replaced by the strip or the bar: focus moves
    // to what took its place, never to the page.

    if (restore) this.whenDrawn(() => this.querySelector(next ? '.sf-alert-bar-strip' : '.sf-alert-bar-minimize button, .sf-alert-bar-minimize')?.focus({
      preventScroll: true
    }));
  } // An action link: the request first; not cancelled, the browser follows it.


  onNavigate(event, item) {
    if (event.defaultPrevented || event.button > 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const allowed = this.sfEmit('navigate', {
      id: item.id,
      level: item.level,
      href: item.action?.href ?? ''
    }, {
      cancelable: true
    });
    if (!allowed) event.preventDefault();
  }

  acknowledgeItem(id) {
    const item = this.list.find(entry => entry.id === id);
    if (!item?.acknowledge) return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.refused)('missing');
    if (!this.sfEmit('acknowledge', {
      id: item.id,
      level: item.level
    }, {
      cancelable: true
    })) return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.refused)('prevented');
    this.leave(item.id);
    return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.applied)();
  } // close: the request with how long the host keeps it; not cancelled, the
  // item leaves the bar at once.


  closeItem(id, reason = 'close') {
    const item = this.list.find(entry => entry.id === id);
    if (!item) return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.refused)('missing');
    if (!item.dismissible) return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.refused)('danger');
    if (!this.sfEmit('close', {
      id: item.id,
      level: item.level,
      hide: HIDE[item.level] ?? 'always',
      reason
    }, {
      cancelable: true
    })) return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.refused)('prevented');
    this.leave(item.id);
    return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.applied)();
  } // An item leaves: the control that had focus hands it to the next control
  // of the bar (§19.2: focus never falls to the page).


  leave(id) {
    const active = this.ownerDocument.activeElement;
    const focused = Boolean(active && this.contains(active));
    const where = active?.closest?.('.sf-alert-bar-item') ? 'list' : 'bar';

    this._gone.add(id);

    const count = this.list.length;
    this._index = wrapIndex(this._index, count);
    if (count < 2) this._listOpen = false;
    this.requestComponentUpdate('leave');
    if (!focused) return;
    this.whenDrawn(() => {
      const scope = where === 'list' && this._listOpen ? '.sf-alert-bar-list' : '.sf-alert-bar-row';
      const target = this.querySelector(`${scope} a[href], ${scope} button:not([disabled])`) ?? this.querySelector('.sf-alert-bar a[href], .sf-alert-bar button:not([disabled])');
      target?.focus({
        preventScroll: true
      });
    });
  } // Runs after the element's next drawing (and its buttons' own).


  whenDrawn(callback) {
    const done = event => {
      if (event.target !== this) return;
      this.removeEventListener('sf-after-render', done);

      const settle = () => callback();

      if (typeof globalThis.requestAnimationFrame === 'function') globalThis.requestAnimationFrame(settle);else Promise.resolve().then(settle);
    };

    this.addEventListener('sf-after-render', done);
  } // Escape closes the open list and returns focus to its toggle.


  onKey(event) {
    if (event.key !== 'Escape' || !this._listOpen || event.defaultPrevented) return;
    event.preventDefault();
    this.toggleList(false);
    this.whenDrawn(() => this.querySelector('.sf-alert-bar-all button, .sf-alert-bar-all')?.focus({
      preventScroll: true
    }));
  } // ---------------------------------------------------------------- drawing


  templateContext() {
    const list = this.list;
    const count = list.length;
    const index = wrapIndex(this._index, count);
    const current = list[index] ?? null;
    this._shownId = current?.id;
    const level = list[0]?.level ?? ''; // The raw value stays under its own name; the template reads this one.

    const isMinimized = Boolean(this.minimized) && level === 'danger';

    const word = (key, vars) => this.sfWord(key, vars ? {
      vars
    } : {});

    this.sfHostState('data-level', level);
    this.sfHostState('data-empty', count === 0);
    this.sfHostState('data-minimized', isMinimized);
    return this.createTemplateContext({ ...this.getPropsContext(),
      component: this,
      size: this.size === '1' ? '1' : '1/2',
      label: this.label,
      list: list.map(item => ({ ...item,
        timeText: this.timeText(item),
        levelWord: word(`level-${item.level}`)
      })),
      count,
      index,
      level,
      isMinimized,
      listOpen: this._listOpen && count > 1,
      listId: this._listId,
      announce: this._announce,
      icons: ICONS,
      words: {
        position: word('position', {
          n: index + 1,
          count
        }),
        prev: word('prev'),
        next: word('next'),
        all: word('all', {
          count
        }),
        collapseList: word('collapse-list'),
        list: word('list'),
        hideDay: word('hide-day'),
        hide: word('hide'),
        acknowledge: word('acknowledge'),
        minimize: word('minimize'),
        expand: word('expand'),
        expandLabel: word('expand-label'),
        strip: count === 1 && current ? `${word(`level-${level}`)}: ${list[0].text}` : word('count', {
          count
        })
      },
      rootClass: this.getRootClass()
    });
  }

  template() {
    // The live regions keep their text until the host's next list, so a
    // drawing in between (a page, a minimize) does not speak it again.
    this.syncList();
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_3__.renderAlertBarTemplate)(this.templateContext());
  }

}

SfAlertBar.define('sf-alert-bar');

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "d302c3bc5424"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderAlertBarTemplate: () => (/* binding */ renderAlertBarTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
 // sf-alert-bar's markup (scss/ draws it on one rung of the ladder).
//
// - The root is a region named by label. Two visually hidden live regions
//   inside it speak what appears after the first list: a new danger item in
//   role alert, any other new item in role status. The bar itself is no live
//   region, so a bar printed with the page is not read out.
// - Minimized (a danger bar only): one button, the strip, that keeps the
//   colour, the icon and the count and expands the bar on a press.
// - Otherwise one row: the shown item's icon, its text with source and time,
//   its action link (sf-button href), acknowledge, the pager «‹ 1 из N ›» and
//   «Все N» when there are several, and at the end close (a warning or an
//   info item) or minimize (a danger item). With several items the list of
//   all opens under the bar, each with its own action, acknowledge and close.
//
// The controls are sf-button and sf-button-icon of scheme on-surface: inside
// the coloured bar the sheet sets the surface roles they read to the fill's
// on- role, so they draw on it without a scheme of their own. The close is
// the close glyph on an icon button, not kind="close": the drawn close mark
// is 30 px at rung 1/2 on a phone where the rung's control is 28 px.

const icon = (name, extra = '') => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class=${['sf-icon', 'sf-alert-bar-icon', extra].filter(Boolean).join(' ')} aria-hidden="true">${name}</i>`;

function meta(item, extra = '') {
  if (!item.source && !item.timeText) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class=${['sf-alert-bar-meta', extra].filter(Boolean).join(' ')}>${item.source}${item.source && item.timeText ? ' · ' : ''}${item.timeText ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<time datetime=${item.time}>${item.timeText}</time>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}</span>`;
}

function actionLink(context, item, appearance) {
  if (!item.action) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button class="sf-alert-bar-action" size=${context.size} appearance=${appearance} scheme="on-surface"
    text=${item.action.label} href=${item.action.href || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    @click=${event => context.component.onNavigate(event, item)}></sf-button>`;
}

function acknowledgeButton(context, item, appearance) {
  if (!item.acknowledge) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button class="sf-alert-bar-acknowledge" size=${context.size} appearance=${appearance} scheme="on-surface"
    text=${item.acknowledge.label || context.words.acknowledge}
    @click=${() => context.component.acknowledgeItem(item.id)}></sf-button>`;
}

const hideWord = (context, item) => item.level === 'warning' ? context.words.hideDay : context.words.hide;

function strip(context) {
  const {
    words,
    level,
    icons,
    component
  } = context;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<button class="sf-alert-bar-strip" type="button" aria-expanded="false" aria-label=${`${words.strip}. ${words.expandLabel}`}
    @click=${() => component.setMinimized(false)}>
    ${icon(icons[level])}<span class="sf-alert-bar-strip-text">${words.strip}</span><span class="sf-alert-bar-strip-expand">${words.expand}</span>${icon('expand_more', 'sf-alert-bar-strip-chevron')}
  </button>`;
}

function row(context) {
  const {
    component,
    list,
    index,
    count,
    level,
    size,
    words,
    icons,
    listOpen,
    listId
  } = context;
  const item = list[index];
  const many = count > 1;
  const prefix = many && item.level !== level ? `${item.levelWord}: ` : '';
  let end = lit__WEBPACK_IMPORTED_MODULE_0__.nothing;

  if (item.dismissible) {
    const label = hideWord(context, item);
    end = (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button-icon class="sf-alert-bar-close" icon="close" size=${size} appearance="ghost" scheme="on-surface"
      aria-label=${label} title=${label} @click=${() => component.closeItem(item.id)}></sf-button-icon>`;
  } else if (item.level === 'danger') {
    end = (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button-icon class="sf-alert-bar-minimize" icon="expand_less" size=${size} appearance="ghost" scheme="on-surface"
      aria-label=${words.minimize} title=${words.minimize} @click=${() => component.setMinimized(true)}></sf-button-icon>`;
  }

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-alert-bar-row" data-level=${item.level}>
    ${icon(icons[item.level])}
    <div class="sf-alert-bar-text">
      <span class="sf-alert-bar-message">${prefix ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-alert-bar-prefix">${prefix}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}${item.text}</span>
      ${meta(item)}
    </div>
    ${item.action || item.acknowledge || many ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-alert-bar-actions">
      ${actionLink(context, item, 'outline')}
      ${acknowledgeButton(context, item, 'ghost')}
      ${many ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-alert-bar-pager">
        <sf-button-icon class="sf-alert-bar-prev" icon="chevron_left" size=${size} appearance="ghost" scheme="on-surface"
          aria-label=${words.prev} @click=${() => component.page(-1)}></sf-button-icon>
        <span class="sf-alert-bar-position">${words.position}</span>
        <sf-button-icon class="sf-alert-bar-next" icon="chevron_right" size=${size} appearance="ghost" scheme="on-surface"
          aria-label=${words.next} @click=${() => component.page(1)}></sf-button-icon>
      </span>
      <sf-button class="sf-alert-bar-all" size=${size} appearance="tonal" scheme="on-surface"
        text=${listOpen ? words.collapseList : words.all} expanded=${listOpen ? 'true' : 'false'} aria-controls=${listId}
        @click=${() => component.toggleList()}></sf-button>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    </div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    ${end}
  </div>`;
}

function listOfAll(context) {
  const {
    component,
    list,
    size,
    words,
    listId
  } = context;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<ul class="sf-alert-bar-list" id=${listId} aria-label=${words.list}>
    ${list.map(item => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<li class="sf-alert-bar-item" data-level=${item.level} data-id=${item.id}>
      <sf-badge class="sf-alert-bar-badge" status=${item.level === 'danger' ? 'error' : item.level} appearance="tonal" size="1/3" text=${item.levelWord}></sf-badge>
      <div class="sf-alert-bar-item-text">
        <span class="sf-alert-bar-item-message">${item.text}</span>
        ${meta(item, 'sf-alert-bar-item-meta')}
      </div>
      <div class="sf-alert-bar-item-actions">
        ${actionLink(context, item, 'outline')}
        ${acknowledgeButton(context, item, 'outline')}
        ${item.dismissible ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button class="sf-alert-bar-item-close" size=${size} appearance="outline" scheme="on-surface"
          text=${hideWord(context, item)} @click=${() => component.closeItem(item.id)}></sf-button>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      </div>
    </li>`)}
  </ul>`;
}

function renderAlertBarTemplate(context) {
  const {
    count,
    level,
    isMinimized,
    listOpen,
    size,
    announce,
    label
  } = context;
  const classes = ['sf-alert-bar', level ? `sf-alert-bar--${level}` : 'sf-alert-bar--empty', `sf-alert-bar--size-${size === '1' ? '1' : 'half'}`, count > 1 ? 'sf-alert-bar--many' : '', isMinimized ? 'sf-alert-bar--minimized' : '', listOpen ? 'sf-alert-bar--open' : '', context.rootClass].filter(Boolean).join(' ');
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class=${classes} style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} role="region" aria-label=${label || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
    <div class="sf-alert-bar-live sr-only" role="alert">${announce.alert}</div>
    <div class="sf-alert-bar-live sr-only" role="status">${announce.status}</div>
    ${count === 0 ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : isMinimized ? strip(context) : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${row(context)}${listOpen ? listOfAll(context) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}`}
  </div>`;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "ba9bcf2fbdc4"
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

/***/ "677c9e2dc7c8"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.alert-bar","tag":"sf-alert-bar","version":"1.0.1","kind":"leaf","settings":{"items":{"type":"list","schema":{"items":{"type":"object","properties":{"id":{"type":"string"},"level":{"type":"string","enum":["danger","warning","info"]},"text":{"type":"string"},"source":{"type":"string"},"time":{"type":"string"},"action":{"type":"object","properties":{"label":{"type":"string"},"href":{"type":"string"}}},"acknowledge":{"type":"object","properties":{"label":{"type":"string"}}},"dismissible":{"type":"boolean"}},"required":["id","level","text"]}},"default":[]},"size":{"type":"enum","values":["1/2","1"],"default":"1/2"},"label":{"type":"string","default-from":"runtime.label"}},"values":{"minimized":{"type":"boolean","default":false}},"events":{"navigate":{"carries":{"id":"string","level":"string","href":"string"},"cancelable":true},"acknowledge":{"carries":{"id":"string","level":"string"},"cancelable":true,"own-verb":true},"close":{"carries":{"id":"string","level":"string","hide":{"type":"enum","values":["day","always"]},"reason":{"type":"enum","values":["close","api"]}},"cancelable":true},"minimize":{"carries":{"minimized":"boolean"}}},"actions":{"close":{"with":{"id":"string"}}},"host-states":{"data-level":"string","data-minimized":"boolean","data-empty":"boolean"},"css-variables":{"--sf-alert-bar-danger-background":{"type":"color","state":"default"},"--sf-alert-bar-warning-background":{"type":"color","state":"default"},"--sf-alert-bar-info-background":{"type":"color","state":"default"},"--sf-alert-bar-padding-inline":{"type":"length","state":"default"},"--sf-alert-bar-list-background":{"type":"color","state":"default"},"--sf-alert-bar-gap":{"type":"length","state":"default"}}}');

/***/ },

/***/ "528216f76e58"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Alert bar","runtime":{"label":"Important notices","level-danger":"Danger","level-warning":"Warning","level-info":"Info","position":"{n} of {count}","prev":"Previous notice","next":"Next notice","all":"All {count}","collapse-list":"Hide the list","list":"All notices","hide-day":"Hide for a day","hide":"Hide","acknowledge":"Mark as seen","minimize":"Minimize the bar","expand":"expand","expand-label":"Expand the important notices","count":"Important notices: {count}"},"events":{"acknowledge":{"label":"Mark as seen"}}}');

/***/ },

/***/ "2a4d264285b5"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Плашка уведомлений","runtime":{"label":"Важные уведомления","level-danger":"Опасность","level-warning":"Предупреждение","level-info":"Сведения","position":"{n} из {count}","prev":"Предыдущее уведомление","next":"Следующее уведомление","all":"Все {count}","collapse-list":"Свернуть список","list":"Все уведомления","hide-day":"Скрыть на сутки","hide":"Скрыть","acknowledge":"Отметить, что видели","minimize":"Свернуть плашку","expand":"развернуть","expand-label":"Развернуть важные уведомления","count":"Важных уведомлений: {count}"},"events":{"acknowledge":{"label":"Отметить, что видели"}}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("277cae13a64b");
/******/
/******/ })()
;