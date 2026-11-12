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

/***/ "6978f1cc153b"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EDGE_MARGIN: () => (/* binding */ EDGE_MARGIN),
/* harmony export */   NEAR_END: () => (/* binding */ NEAR_END),
/* harmony export */   NEAR_START: () => (/* binding */ NEAR_START),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   readingPosition: () => (/* binding */ readingPosition),
/* harmony export */   scrollerOf: () => (/* binding */ scrollerOf),
/* harmony export */   watchEdge: () => (/* binding */ watchEdge)
/* harmony export */ });
// The reading position of a scrolling column (duplication audit 2026-11-03,
// A-6): what a feed, a log, a conversation or a long list does to keep a
// person's place while its content changes under them. It was written in
// ui-pro's sf-message-log (keep the place while history is added above,
// follow the end only when the reader is there, «to the latest», ask once
// when the top is reached), and the end-of-list loading again in
// sf-chat-threads and the ui-chat pilot. One rule now, for every column:
//
//   const position = readingPosition(scroller, {onStart: () => askEarlier()});
//   position.keep(() => column.prepend(fragment));  // the place does not move
//   const follow = position.atEnd();                  // before an append
//   column.append(node);
//   if (follow) position.toEnd();
//   scroller.addEventListener('scroll', () => position.check());
//
//   const stop = watchEdge(sentinel, () => askMore()); // the end came into reach
//
// It owns no content and fetches nothing: it measures one element and says
// when an edge is reached. The element is the scroller -- the box with
// overflow that a person scrolls.
//
// Nothing here keeps state at module scope: each column gets its own
// controller, so the copies of this module that every bundle carries cannot
// disagree (bundles each carry their own module copy).
// Within this distance of the end counts as being there. 96px is about two
// lines of text and an entry's action row: closer than that, a person reading
// the end of a column is reading the end.
const NEAR_END = 96; // The start is "reached" a little before it is reached, so an earlier page is
// usually there by the time the person scrolls into it.

const NEAR_START = 240; // The end of a list asks for its next page this far before it is in view.

const EDGE_MARGIN = '200px';

const reducedMotion = () => globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

const frame = callback => typeof globalThis.requestAnimationFrame === 'function' ? globalThis.requestAnimationFrame(callback) : setTimeout(callback, 16);
/**
 * A controller of one scroller's reading position.
 *
 * options:
 *   nearEnd    px from the end that count as being at it (NEAR_END);
 *   nearStart  px from the start that count as reaching it (NEAR_START);
 *   onStart    () => void, called from check() when the start is reached and
 *              the position is not settling (an earlier page is wanted).
 */


function readingPosition(scroller, {
  nearEnd = NEAR_END,
  nearStart = NEAR_START,
  onStart = null
} = {}) {
  let settling = false;
  let element = scroller ?? null;
  const controller = {
    /** The scroller this controller measures; set it again when the box is drawn anew. */
    get element() {
      return element;
    },

    set element(next) {
      element = next ?? null;
    },

    /** Is the end of the column in view (within nearEnd)? A column not drawn yet is at its end. */
    atEnd() {
      if (!element) return true;
      return element.scrollHeight - element.scrollTop - element.clientHeight < nearEnd;
    },

    /** Is the start within reach (within nearStart)? */
    atStart() {
      if (!element) return false;
      return element.scrollTop < nearStart;
    },

    /**
     * Change the content above what is read without moving it: the distance
     * from the end is measured before `mutate` and restored after. What was
     * under the reader's eyes is the same distance from the end before and
     * after the history above it grew.
     */
    keep(mutate) {
      if (!element) return mutate?.();
      const fromEnd = element.scrollHeight - element.scrollTop;
      const result = mutate?.();
      element.scrollTop = element.scrollHeight - fromEnd;
      return result;
    },

    /**
     * Go to the end in the next frame: smoothly, unless `instant` or the
     * reader asked for reduced motion. `then` runs after the jump. With
     * `settle`, reaching the start is not reported until the frame after:
     * a column that opens at its start for one frame does not ask for a page
     * nobody wanted.
     */
    toEnd({
      instant = false,
      settle = false,
      then = null
    } = {}) {
      if (settle) settling = true;
      frame(() => {
        if (element) element.scrollTo({
          top: element.scrollHeight,
          behavior: instant || reducedMotion() ? 'instant' : 'smooth'
        });
        then?.();
        if (settle) frame(() => {
          settling = false;
        });
      });
    },

    /** Hold reports of the start (while a column is replaced). */
    hold() {
      settling = true;
    },

    release() {
      settling = false;
    },

    get settling() {
      return settling;
    },

    /** Call on scroll: reports onStart once the start is in reach and the position is not settling. */
    check() {
      if (settling || !onStart || !controller.atStart()) return false;
      onStart();
      return true;
    }

  };
  return controller;
}
/**
 * Report when `sentinel` comes within `margin` of the scroller it sits in --
 * the end of a list in reach, the start of a feed. Never from a scroll handler
 * that fires sixty times a second. `root` is the scroller; null (the default)
 * is the viewport, which still sees the clipping of every scroller around the
 * sentinel. Answers the way to stop watching. A watch that starts on an edge
 * already in reach reports it at once.
 */

function watchEdge(sentinel, callback, {
  root = null,
  margin = EDGE_MARGIN
} = {}) {
  if (!sentinel || typeof callback !== 'function' || typeof globalThis.IntersectionObserver !== 'function') return () => {};
  const observer = new globalThis.IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) callback();
  }, {
    root,
    rootMargin: margin
  });
  observer.observe(sentinel);
  return () => observer.disconnect();
}
/**
 * The box that scrolls `node`: the nearest ancestor whose block overflow is
 * auto or scroll, or null for the page. watchEdge takes it as `root`, so its
 * margin reaches ahead inside that box; measured against the viewport, the
 * margin would stop at the box's clipped edge.
 */

function scrollerOf(node) {
  const view = node?.ownerDocument?.defaultView;

  for (let at = node?.parentElement; at && view; at = at.parentElement) {
    if (at === node.ownerDocument.documentElement || at === node.ownerDocument.body) return null;
    if (/^(auto|scroll|overlay)$/u.test(view.getComputedStyle(at).overflowY)) return at;
  }

  return null;
}
const ReadingPosition = Object.freeze({
  create: readingPosition,
  watchEdge,
  scrollerOf,
  NEAR_END,
  NEAR_START,
  EDGE_MARGIN
}); // Core publishes the helper; component bundles that carry their own copy reuse
// an already published one instead of replacing it.

if (typeof globalThis !== 'undefined') {
  globalThis.SF = globalThis.SF || {};
  if (!globalThis.SF.readingPosition) globalThis.SF.readingPosition = ReadingPosition;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ReadingPosition);

/***/ },

/***/ "6cfd28b331a1"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _core_js_format_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("5b8371b87515");
/* harmony import */ var _core_js_reading_position_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("6978f1cc153b");
/* harmony import */ var _js_templates_default_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("1c69b52a2c3c");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("2677706b5ec9");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("c1c5abcf20ed");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("0c29db1e15d7");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_format_js__WEBPACK_IMPORTED_MODULE_2__, _js_templates_default_js__WEBPACK_IMPORTED_MODULE_4__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_format_js__WEBPACK_IMPORTED_MODULE_2__, _js_templates_default_js__WEBPACK_IMPORTED_MODULE_4__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
// A list a person acts on: a person's conversations, letters, templates,
// files, members, versions -- rows from data, each one a title and a quiet
// second line, which one is open, a few things one can do to a row. The block
// list of SIMAI Framework (duplication audit 2026-11-03, A-7; owner decision
// 2026-11-03, component sets, point 13): sf-chat-threads, sf-mail-letters,
// sf-mail-library, the chat window's files and members and ui-mail's versions
// each wrote the same row model again. sf-list-feed is the block's feed
// variant, for a column a person reads.
//
// What a row *is* stays with the host. An item is data: an id, a text, and
// optionally a supporting line, an icon, a date or a group key, a picture
// (avatar), a count, a badge and pinned. The list draws each one as the
// Framework's row, sf-list-item, with the Framework's own parts in its leading
// and trailing places -- sf-avatar, sf-badge -- and interprets none of it: it
// has no renderer a host could hand it (1.1.0, owner decision q-3b313e2246,
// 2026-11-06: sf-chat-threads becomes a thin wrapper of this list).
//
// It owns the arrangement and nothing else:
//   - groups by the calendar day of each item's date in the reader's time
//     zone («Сегодня», «Вчера», a weekday, the date -- core's
//     formatRelativeDay), or by a key the host names, or none; pinned items
//     lead, under their own heading «Закреплённые» when the list is grouped;
//   - which row is open (`selected`), told by more than a tint;
//   - one Tab stop for the whole list, arrows between rows, across groups
//     (the row's own roving, sf-list-item);
//   - the row's actions in one menu the whole list shares, renaming in place;
//   - asking for the next page when its end comes into reach (core's
//     watchEdge), with a «Show more» button for the keyboard and for a page
//     without IntersectionObserver;
//   - sf-empty-state when there is nothing.
// It never fetches anything: every request leaves as an event.
//
// Keyboard: arrows, Home and End move between rows, Enter opens, F2 renames,
// Shift+F10 or the menu key opens the row's actions.
//
// From its component.json (standard simai.smart-component 1.3.8 §3, §4, §8,
// §11, §18): the settings are attributes and properties made by
// core/js/element-manifest.js, its words are lang/<locale>.json, the actions
// answer outcomes, and the events take the vocabulary's verbs (open, apply,
// rename, load-more).







 // A text longer than this is not a name; the rename field stops there, as the
// server that stores it most likely does.

const TEXT_LIMIT = 200;

const applied = () => ({
  outcome: "applied"
});

const refused = reason => ({
  outcome: "refused",
  reason
}); // One item as the list holds it: id a string, the rest as given.


const normalItem = item => ({ ...item,
  id: String(item.id)
});

const word = value => typeof value === "string" ? value.trim() : "";

const SHAPES = new Set(["circle", "square"]); // The badge's tone is a word of the Framework's status set
// (contracts/public-api-axes.json status_vocabulary); neutral is no status.

const TONES = new Set(["neutral", "info", "success", "warning", "error"]); // The largest count drawn as a number; a larger one reads «99+», as
// sf-avatar's badge-cap does by default.

const COUNT_CAP = 99; // Below this many rem of the list's own width a row's badge and count stand
// under its text (C47; the width the owner's prototype drew it at).

const NARROW_REM = 20; // A wider list goes narrow too when a row's title would keep less than half
// of the row's text column, or less than this many rem (C47 follow-up: a
// long badge on a 366 px phone column left the title 55 px, «Порта…»).

const TITLE_MIN_REM = 10;
const NARROW = "data-sf-list-narrow";
/**
 * The item's picture, or null: {image-url?, text?, shape?, icon?}. A sign
 * (icon without an image) is a glyph in the avatar's place -- a channel, an
 * agent, a bot; an image or initials are sf-avatar's.
 */

function avatarOf(item) {
  const avatar = item?.avatar;
  if (!avatar || typeof avatar !== "object" || Array.isArray(avatar)) return null;
  const imageUrl = word(avatar["image-url"]);
  const icon = word(avatar.icon);
  return {
    kind: icon && !imageUrl ? "sign" : "avatar",
    shape: SHAPES.has(avatar.shape) ? avatar.shape : "circle",
    imageUrl,
    text: word(avatar.text),
    icon
  };
}
/** The item's count as a whole number above 0, else 0. */


function countOf(item) {
  const count = Number(item?.count);
  return Number.isFinite(count) && count >= 1 ? Math.floor(count) : 0;
}
/** The item's badge, {text, tone}, or null: a badge with no text draws nothing. */


function badgeOf(item) {
  const badge = item?.badge;
  if (!badge || typeof badge !== "object" || Array.isArray(badge)) return null;
  const text = word(badge.text);
  if (!text) return null;
  return {
    text,
    tone: TONES.has(badge.tone) ? badge.tone : "neutral"
  };
} // set-items(list, {hasMore}) or set-items({items, has-more}) (§4.4: one object
// in declared order).


const pageArguments = (first, second) => {
  if (first && !Array.isArray(first) && typeof first === "object" && Array.isArray(first.items)) {
    return {
      items: first.items,
      hasMore: Boolean(first["has-more"] ?? first.hasMore ?? first.options?.hasMore)
    };
  }

  return {
    items: Array.isArray(first) ? first : [],
    hasMore: Boolean(second?.hasMore ?? second?.["has-more"])
  };
};

const ListElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_5__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_6__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_7__
  },
  source: "ru"
});
let listCount = 0;

class SfList extends ListElement {
  static get props() {
    return { ...super.props,
      templateName: {
        attribute: "template",
        default: "default"
      }
    };
  }

  constructor() {
    super();
    this._items = [];
    this._actions = [];
    this._groups = [];
    this._loadingMore = false;
    this._editing = null;
    this._menuFor = null;
    this._focusAfter = null;
    this._stopEdge = null;
    this._edge = null;
    this._dayTimer = 0;
    listCount += 1;
    this._uid = `sf-list-${listCount}`; // A value set as a property before the element was defined is an own
    // property that would hide the accessor; it is taken through it.

    for (const name of ["items", "actions", "groups"]) {
      if (!Object.prototype.hasOwnProperty.call(this, name)) continue;
      const early = this[name];
      delete this[name];
      this[name] = early;
    }
  } // ── state the host sets ──────────────────────────────────────────────────
  // A printed skeleton (data-sf-first-paint="skeleton") stays until the host
  // gives the items (standard 1.3.8 §5.4): the first render then draws them
  // over it in one frame. An empty list given is an answer too -- the empty
  // state draws -- where the base's test counts it as not yet given.


  sfAwaitingData() {
    return this.getAttribute("data-sf-first-paint") === "skeleton" && !this._sfDataGiven;
  }
  /** The items shown, in the host's order (§18.4: entries by id). */


  get items() {
    return this._items.map(item => ({ ...item
    }));
  }

  set items(value) {
    this._sfDataGiven = true;
    const seen = new Set();
    this._items = (Array.isArray(value) ? value : []).filter(item => item && item.id != null && !seen.has(String(item.id)) && seen.add(String(item.id))).map(normalItem);
    if (this._editing && !seen.has(this._editing)) this._editing = null;
    this.requestComponentUpdate("items");
  }
  /**
   * The row actions, in the shared menu after «Rename»: [{id, text, icon?,
   * destructive?}]. Chosen, one leaves as sf-list-apply {action, scope:
   * entry, ids}. An item narrows them with `actions: [ids]`, or takes them
   * away with `actions: false`.
   */


  get actions() {
    return this._actions.map(action => ({ ...action
    }));
  }

  set actions(value) {
    this._actions = Array.isArray(value) ? value.filter(action => action && action.id && action.text).map(action => ({ ...action,
      id: String(action.id)
    })) : [];
    this.requestComponentUpdate("actions");
  }
  /** The groups of group-by="key", in order: [{key, text}]. A key not listed follows, its key as its heading. */


  get groups() {
    return this._groups.map(group => ({ ...group
    }));
  }

  set groups(value) {
    this._groups = Array.isArray(value) ? value.filter(group => group && group.key != null).map(group => ({
      key: String(group.key),
      text: String(group.text ?? group.key)
    })) : [];
    this.requestComponentUpdate("groups");
  } // ── actions (§4.4) ───────────────────────────────────────────────────────

  /** The whole list and whether more follows, together; ends a page request. */


  setItems(first = [], second = {}) {
    const {
      items,
      hasMore
    } = pageArguments(first, second);
    this.items = items;
    this._loadingMore = false;
    if (this.loading) this.loading = false;
    this.hasMore = hasMore; // A new end is watched again: a watch that starts on an end in reach
    // reports it at once, which is the next page when there is one.

    this.unwatchEnd();
    this.requestComponentUpdate("page");
    return applied();
  }
  /** The next page after what is shown; ends the page request. */


  appendItems(first = [], second = {}) {
    const {
      items,
      hasMore
    } = pageArguments(first, second);
    const known = new Set(this._items.map(item => item.id));
    return this.setItems([...this._items, ...items.filter(item => item && item.id != null && !known.has(String(item.id)))], {
      hasMore
    });
  }
  /** A new item at the start, or a changed one in its place. */


  upsert(params) {
    const item = params?.item && typeof params.item === "object" && params.id === undefined ? params.item : params;
    if (!item || item.id == null) return refused("no-id");
    const next = normalItem(item);

    const at = this._items.findIndex(one => one.id === next.id);

    const list = [...this._items];
    if (at >= 0) list[at] = next;else list.unshift(next);
    this._items = list;
    this._sfDataGiven = true;
    this.requestComponentUpdate("upsert");
    return applied();
  }
  /** Take one item off. */


  detach(params) {
    const id = String(params && typeof params === "object" ? params.id : params ?? "");
    if (!this._items.some(item => item.id === id)) return refused("unknown");
    const rows = this.rows();
    const at = rows.findIndex(row => this.idOf(row) === id); // The focus that was on the row goes to its neighbour, not to the page.

    if (at >= 0 && rows[at].contains(this.ownerDocument.activeElement)) {
      this._focusAfter = this.idOf(rows[at + 1] ?? rows[at - 1] ?? null);
    }

    this._items = this._items.filter(item => item.id !== id);
    if (this._editing === id) this._editing = null;
    this.requestComponentUpdate("detach");
    return applied();
  }
  /** The next page could not be loaded: reaching the end, or «Show more», asks again. */


  moreFailed() {
    this._loadingMore = false;
    this.unwatchEnd();
    this.requestComponentUpdate("more");
    return applied();
  }
  /** Ask the host for the next page, as reaching the end and «Show more» do. */


  requestMore() {
    if (this._loadingMore) return refused("loading");
    if (this.loading) return refused("loading");
    if (!this.hasMore) return refused("no-more");
    this._loadingMore = true;
    this.requestComponentUpdate("more");

    if (!this.sfEmit("load-more", {
      direction: "after",
      after: this._items.at(-1)?.id ?? null
    })) {
      this._loadingMore = false;
      this.requestComponentUpdate("more");
      return refused("prevented");
    }

    return applied();
  }
  /** Rename in place: Enter keeps, Escape gives up, leaving the field keeps. */


  rename(params) {
    const id = String(params?.id ?? params ?? "");
    if (!this.renamable) return refused("not-renamable");

    const item = this._items.find(one => one.id === id);

    if (!item) return refused("unknown");
    if (item.disabled === true) return refused("disabled");
    this.closeMenu();
    this._editing = id;
    this.requestComponentUpdate("rename");
    return applied();
  }
  /** Open the row's actions, as the «⋯» button and Shift+F10 do. */


  openMenu(params, anchorGiven = null) {
    const id = String(params?.id ?? params ?? "");

    const item = this._items.find(one => one.id === id);

    const menu = this.menu;
    if (!item || !menu) return refused("unknown");
    const entries = this.menuEntries(item);
    if (!entries.length) return refused("no-actions");
    const row = this.rowFor(id);
    const anchor = anchorGiven instanceof Element ? anchorGiven : row?.closest(".sf-list__row")?.querySelector(".sf-list__actions") ?? row ?? this;
    this._menuFor = id;
    menu.setAttribute("aria-label", this.sfWord("actions-label", {
      vars: {
        text: item.text || this.sfWord("untitled-text")
      }
    }));
    menu.entries = entries; // The Loader brings sf-menu-context when it is first needed (a lazy
    // relation); a press before that waits for it.

    customElements.whenDefined("sf-menu-context").then(() => menu.toggleFor(anchor));
    return applied();
  } // ── words and what is drawn ──────────────────────────────────────────────


  get menu() {
    return this.querySelector(":scope > .sf-list__frame > .sf-list__menu");
  } // The menu of one row: «Rename» when the list renames, then the host's
  // actions the item allows.


  menuEntries(item) {
    if (item.disabled === true) return [];
    const allowed = item.actions === false ? [] : Array.isArray(item.actions) ? new Set(item.actions.map(String)) : null;

    const own = this._actions.filter(action => !allowed || allowed.has(action.id));

    return [...(this.renamable ? [{
      id: "rename",
      text: this.sfWord("rename-text"),
      icon: "edit",
      shortcut: "F2"
    }] : []), ...own.map(action => ({
      id: `action:${action.id}`,
      text: action.text,
      ...(action.icon ? {
        icon: action.icon
      } : {}),
      ...(action.destructive ? {
        status: "error"
      } : {})
    }))];
  }

  hasMenu(item) {
    return this.menuEntries(item).length > 0;
  }

  keyShortcuts(item) {
    return [this.hasMenu(item) ? "Shift+F10" : "", this.renamable && item.disabled !== true ? "F2" : ""].filter(Boolean).join(" ");
  } // The groups in the order their first item comes: the host sorts, the list
  // does not. By day, each item's calendar day in the reader's time zone, an
  // unreadable date its own last group; by key, the order of `groups`, then
  // any key it does not list.
  //
  // Pinned items lead, in the host's order: under their own heading
  // («Закреплённые») before the day or key groups; ungrouped, first in the
  // one list.


  arranged() {
    const by = this.groupBy;

    const pinned = this._items.filter(item => item.pinned === true);

    const rest = pinned.length ? this._items.filter(item => item.pinned !== true) : this._items;
    if (by !== "day" && by !== "key") return [{
      key: "all",
      heading: "",
      items: [...pinned, ...rest]
    }];
    const groups = new Map();
    const now = new Date();

    for (const item of rest) {
      let key;
      let heading;
      let date = "";

      if (by === "day") {
        const moment = (0,_core_js_format_js__WEBPACK_IMPORTED_MODULE_2__.toDate)(item.date);
        const offset = moment ? (0,_core_js_format_js__WEBPACK_IMPORTED_MODULE_2__.calendarDayOffset)(moment, {
          now
        }) : NaN;
        key = Number.isFinite(offset) ? `day:${offset}` : "day:none";
        heading = Number.isFinite(offset) ? (0,_core_js_format_js__WEBPACK_IMPORTED_MODULE_2__.formatRelativeDay)(moment, {
          now,
          capital: true,
          node: this
        }) : this.sfWord("undated-text"); // Today and yesterday say the date beside the word (C40).

        date = offset === 0 || offset === -1 ? moment.toISOString() : "";
      } else {
        key = `key:${item.group ?? ""}`;

        const declared = this._groups.find(group => group.key === String(item.group ?? ""));

        heading = declared?.text ?? (item.group == null || item.group === "" ? this.sfWord("ungrouped-text") : String(item.group));
      }

      if (!groups.has(key)) groups.set(key, {
        key,
        heading,
        date,
        items: []
      });
      groups.get(key).items.push(item);
    }

    const list = [...groups.values()];

    if (by === "key" && this._groups.length) {
      const order = this._groups.map(group => `key:${group.key}`);

      const rank = key => order.includes(key) ? order.indexOf(key) : order.length;

      list.sort((a, b) => rank(a.key) - rank(b.key));
    }

    if (by === "day") {
      const undated = list.findIndex(group => group.key === "day:none");
      if (undated >= 0) list.push(...list.splice(undated, 1));
    }

    if (pinned.length) list.unshift({
      key: "pinned",
      heading: this.sfWord("pinned-text"),
      items: pinned
    });
    return list;
  } // The leading place of the rows: none when no item has an avatar. When one
  // has, every row keeps it, so the titles start at one line; a row without
  // an avatar shows its icon there, or nothing. Its width is the avatar of a
  // two-line row when any row of the list has a second line, else the row's
  // line: a one-line row keeps its control height.


  leading() {
    if (!this._items.some(item => avatarOf(item))) return null;
    return {
      wide: this._items.some(item => Boolean(item.supporting))
    };
  }

  templateContext() {
    const loading = this.loading;
    const empty = !loading && this._items.length === 0;
    return {
      component: this,
      uid: this._uid,
      label: this.label,
      headingLevel: this.headingLevel,
      stickyHeadings: this.stickyHeadings === true,
      size: this.size,
      noWrap: this.noWrap === true,
      sections: this.arranged(),
      leading: this.leading(),
      avatarOf,
      countOf,
      badgeOf,
      countCap: COUNT_CAP,
      countLabel: count => this.sfWord("count-label", {
        count
      }),
      grouped: this.groupBy === "day" || this.groupBy === "key",
      selected: this.selected,
      editing: this._editing,
      loading,
      loadingText: this.sfWord("loading-text"),
      empty,
      emptyHeading: this.emptyText,
      emptyContent: this.hasSlotContent("empty") ? this.getSlotContent("empty") : null,
      showMore: this.hasMore && !loading,
      loadingMore: this._loadingMore,
      // The label stays while the page is on its way, so the button keeps
      // its width; the wait is said by the status beside it.
      moreText: this.sfWord("more-text"),
      loadingMoreText: this.sfWord("loading-more-text"),
      renameLabel: this.sfWord("rename-label"),
      untitledText: this.sfWord("untitled-text"),
      actionsLabel: text => this.sfWord("actions-label", {
        vars: {
          text
        }
      }),
      hasMenu: item => this.hasMenu(item),
      textLimit: TEXT_LIMIT
    };
  }

  template() {
    return (0,_js_templates_default_js__WEBPACK_IMPORTED_MODULE_4__.renderListTemplate)(this.templateContext());
  } // The rows are drawn; the list's sheets may still be on their way. The
  // width is watched from now (C47): when the sheet comes, the observer
  // measures the frame before it is painted with it, so no frame of a
  // squeezed title is shown first.


  whenRenderedStylesReady(target) {
    this.watchWidth();
    return super.whenRenderedStylesReady(target);
  }

  afterRender(changed) {
    super.afterRender?.(changed);
    this.watchEnd();
    this.watchWidth(); // The keys a row answers, said to assistive technology on the row itself
    // (sf-list-item draws the row; an attribute it does not bind stays).

    for (const row of this.rows()) {
      const item = this._items.find(one => one.id === this.idOf(row));

      const keys = item ? this.keyShortcuts(item) : "";
      if (keys) row.setAttribute("aria-keyshortcuts", keys);else row.removeAttribute("aria-keyshortcuts");
    }

    if (this._editing) {
      const input = this.querySelector(".sf-list__rename");

      if (input && !input.dataset.focused) {
        input.dataset.focused = "true";
        input.focus();
        input.select();
      }

      return;
    }

    if (this._focusAfter !== null) {
      const id = this._focusAfter;
      this._focusAfter = null;
      this.focusRow(id);
    }
  } // A row drawn again (the rename field gave its place back) is a new
  // sf-list-item that draws itself a frame later: wait for it a few frames.


  focusRow(id, frames = 4) {
    const row = this.rowFor(id);
    if (row) this.moveTo(row);else if (frames > 0 && this.isConnected) requestAnimationFrame(() => this.focusRow(id, frames - 1));
  }

  onConnected() {
    super.onConnected?.();
    this.watchDay();
  }

  onDisconnected() {
    this.unwatchEnd();
    this._widthObserver?.disconnect();
    this._widthObserver = null;
    this._widthFrame = null;
    this._widthMetas = null;
    clearTimeout(this._dayTimer);
    this._dayTimer = 0;
    super.onDisconnected?.();
  } // «Сегодня» said yesterday is wrong by morning: at the reader's midnight
  // the day groups are drawn again.


  watchDay() {
    clearTimeout(this._dayTimer);
    this._dayTimer = 0;
    if (!this.isConnected) return;
    this._dayTimer = setTimeout(() => {
      this.watchDay();
      if (this.groupBy === "day") this.requestComponentUpdate("day");
    }, (0,_core_js_format_js__WEBPACK_IMPORTED_MODULE_2__.msUntilNextDay)() + 1000);
  } // A narrow list (owner decision C47, 2026-11-10): below 20rem of its own
  // width the list marks its frame, and a row's badge and count go under
  // its second line, at the text's start, so the title keeps the row's
  // width and the badge stays whole. A wider list is narrow too when, laid
  // out on one line, a row's title would keep less than half of the row's
  // text column or less than 10rem (a long badge in a phone column). The
  // list measures itself: no page breakpoint and no setting. A
  // ResizeObserver, not a container query: an inline-size container takes
  // no width from its rows, and a list in a shrink-to-fit place (a popover,
  // an auto-width flex item) would fold to nothing. It watches the frame's
  // width and every row's badge and count, and is started as soon as the
  // rows are drawn, before the list's sheet is in: the observer reports
  // before the frame is painted, so the frame painted with the sheet is
  // already laid out narrow or wide. The mark is an attribute the template
  // does not bind, so a redraw keeps it.
  // 1.5.1: the frame's width is read from .sf-list__width, a box of no
  // height across the frame, not from the frame. The narrow layout changes
  // the frame's height; a frame observed itself then changed size inside the
  // observer's own callback, at the shallowest depth it reports, and the
  // browser raised «ResizeObserver loop completed with undelivered
  // notifications» on every page with a narrow list. The width box keeps its
  // size whatever the layout; the badges and counts sit deeper and are
  // reported in the same frame.


  watchWidth() {
    const frame = this.querySelector(":scope > .sf-list__frame");
    if (!frame) return;
    const width = frame.querySelector(":scope > .sf-list__width") ?? frame;

    if (this._widthFrame !== frame) {
      this._widthObserver?.disconnect();
      this._widthObserver = null;
      this._widthFrame = frame;
      this._widthMetas = new Set();
      if (typeof ResizeObserver !== "function") return;
      this._widthObserver = new ResizeObserver(() => {
        this.watchMetas();
        this.measureNarrow();
      });

      this._widthObserver.observe(width);
    }

    this.watchMetas();
  } // The badges and counts drawn now are watched, the ones gone are let go:
  // a row drawn later, or a badge whose sheet came late, measures again.


  watchMetas() {
    const observer = this._widthObserver;
    const frame = this._widthFrame;
    if (!observer || !frame) return;
    const now = new Set(frame.querySelectorAll(".sf-list__row .sf-list__meta"));

    for (const meta of this._widthMetas) {
      if (!now.has(meta)) observer.unobserve(meta);
    }

    for (const meta of now) {
      if (!this._widthMetas.has(meta)) observer.observe(meta);
    }

    this._widthMetas = now;
  } // Narrow below 20rem of the frame's content width, or when a row's title
  // would keep less than half of its text column (or 10rem) beside its
  // badge and count. The one-line layout is measured with the mark taken
  // off and put back in the same task, so nothing of it is painted and the
  // answer does not depend on the layout it chooses.


  measureNarrow() {
    const frame = this._widthFrame;
    if (!frame?.isConnected) return;
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    const style = getComputedStyle(frame);
    const width = frame.clientWidth - (parseFloat(style.paddingLeft) || 0) - (parseFloat(style.paddingRight) || 0);

    if (!(width > 0)) {
      frame.removeAttribute(NARROW);
      return;
    }

    let narrow = width < NARROW_REM * rem;

    if (!narrow) {
      const was = frame.hasAttribute(NARROW);
      if (was) frame.removeAttribute(NARROW);
      narrow = [...frame.querySelectorAll(".sf-list__row .sf-list-item-wrap > .sf-list__meta:not(:empty)")].some(meta => this.titleSqueezed(meta, rem));
      if (was && !narrow) return;
    }

    frame.toggleAttribute(NARROW, narrow);
  } // On one line: the title's room is what the badge and count leave of the
  // text column, the row's gap before them kept (their own start padding is
  // in their box).


  titleSqueezed(meta, rem) {
    const wrap = meta.parentElement;
    const text = wrap?.querySelector(":scope > .sf-list-item-container");
    if (!text) return false;
    const wrapStyle = getComputedStyle(wrap);
    const textStyle = getComputedStyle(text);
    const rtl = wrapStyle.direction === "rtl";
    const box = wrap.getBoundingClientRect();
    const textBox = text.getBoundingClientRect();
    const metaBox = meta.getBoundingClientRect();
    const gap = parseFloat(wrapStyle.columnGap) || 0;
    const inset = (parseFloat(textStyle.paddingLeft) || 0) + (parseFloat(textStyle.paddingRight) || 0);
    const end = rtl ? box.left + (parseFloat(wrapStyle.borderLeftWidth) || 0) + (parseFloat(wrapStyle.paddingLeft) || 0) : box.right - (parseFloat(wrapStyle.borderRightWidth) || 0) - (parseFloat(wrapStyle.paddingRight) || 0);
    const column = (rtl ? textBox.right - end : end - textBox.left) - inset;
    const title = (rtl ? textBox.right - metaBox.right : metaBox.left - textBox.left) - gap - inset;
    if (!(column > 0)) return false;
    return title < Math.max(column / 2, TITLE_MIN_REM * rem);
  } // The end of the list asks for the next page when it comes within reach,
  // never from a scroll handler (core/js/reading-position.js watchEdge).


  watchEnd() {
    const sentinel = this.querySelector(":scope > .sf-list__frame .sf-list__end");

    if (!this.hasMore || this.loading || !sentinel) {
      this.unwatchEnd();
      return;
    }

    if (this._edge === sentinel && this._stopEdge) return;
    this.unwatchEnd();
    this._edge = sentinel; // Inside the box that scrolls the list, so the margin reaches ahead there.

    this._stopEdge = (0,_core_js_reading_position_js__WEBPACK_IMPORTED_MODULE_3__.watchEdge)(sentinel, () => this.requestMore(), {
      root: (0,_core_js_reading_position_js__WEBPACK_IMPORTED_MODULE_3__.scrollerOf)(sentinel)
    });
  }

  unwatchEnd() {
    this._stopEdge?.();
    this._stopEdge = null;
    this._edge = null;
  } // ── rows ─────────────────────────────────────────────────────────────────


  rows() {
    return [...this.querySelectorAll(":scope > .sf-list__frame .sf-list-item[data-sf-list-roving]")];
  }

  idOf(row) {
    return row?.closest?.(".sf-list__row")?.dataset.id ?? null;
  }

  rowFor(id) {
    if (id == null) return null;
    return this.rows().find(row => this.idOf(row) === String(id)) ?? null;
  } // The row's own roving keeps one Tab stop (sf-list-item); a row the list
  // moves the focus to is marked the current one there.


  moveTo(row) {
    for (const other of this.rows()) delete other.dataset.sfListCurrent;

    row.dataset.sfListCurrent = "true";

    for (const other of this.rows()) other.tabIndex = other === row ? 0 : -1;

    row.focus();
  } // ── what a person does ───────────────────────────────────────────────────
  // A press or Enter on a row: sf-list-item asks open {id, trigger}; the
  // list says it as its own (selected is controlled, §4.3: the host opens
  // the item and writes selected back).


  onRowOpen(event) {
    event.stopPropagation();
    const id = String(event.detail?.id ?? "");
    if (!id || !this._items.some(item => item.id === id)) return;
    this.sfEmit("open", {
      id,
      trigger: event.detail?.trigger ?? "pointer"
    });
  }

  onKey(event) {
    const row = event.target.closest?.(".sf-list-item[data-sf-list-roving]");
    if (!row || event.target !== row || event.defaultPrevented) return;
    const id = this.idOf(row);

    const item = this._items.find(one => one.id === id);

    if (!item) return;

    if (event.key === "F2" && !event.shiftKey && !event.altKey && !event.ctrlKey && !event.metaKey) {
      if (this.rename(id).outcome === "applied") event.preventDefault();
      return;
    }

    if (event.key === "F10" && event.shiftKey || event.key === "ContextMenu") {
      event.preventDefault();
      this.openMenu(id);
    }
  }

  onMenu(detail = {}) {
    const id = this._menuFor;
    const choice = String(detail.id ?? detail.entry?.id ?? "");
    if (!id || !choice) return;
    if (choice === "rename") setTimeout(() => this.rename(id), 0); // A row's action is apply {action, scope: entry, ids} (vocabulary §5, §18.3).
    else if (choice.startsWith("action:")) this.sfEmit("apply", {
      action: choice.slice("action:".length),
      scope: "entry",
      ids: [id]
    });
  }

  closeMenu() {
    const menu = this.menu;
    if (menu?.isOpen) menu.close({
      restoreFocus: false,
      reason: "api"
    });
  }

  finishRename(keep, input) {
    const id = this._editing;
    if (!id) return;
    this._editing = null;

    const item = this._items.find(one => one.id === id);

    const text = String(input?.value ?? "").trim().slice(0, TEXT_LIMIT);
    this._focusAfter = id;

    if (keep && item && text && text !== item.text) {
      // Shown at once; a host that refuses it cancels the event (the old
      // text comes back) or upserts the item with the text it kept.
      const before = item.text;
      item.text = text;
      if (!this.sfEmit("rename", {
        id,
        text
      })) item.text = before;
    }

    this.requestComponentUpdate("rename");
  }

}

SfList.define("sf-list");
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "1c69b52a2c3c"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderListTemplate: () => (/* binding */ renderListTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("efa66f8927d1");
/* harmony import */ var _default_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("001507727cfa");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__);


 // The list, drawn in the component's light DOM on the Framework's plain list
// surface (the class unit .sf-list): the rows in their groups, the end of the
// list («Show more» and the sentinel the next page is asked by), the empty
// state, and one context menu shared by every row.
//
// A row is the Framework's row, sf-list-item, interactive: the rows of the
// whole list -- every group -- are one Tab stop, the arrows move between them
// (the row's own roving: [data-sf-list] marks the list). When the row has
// actions, a «⋯» stands beside it; it is not a Tab stop of its own (tabindex
// -1): a list of forty rows would be eighty stops. It is reached from its row
// with Shift+F10 or the menu key, and by pointer.
//
// Grouped, the frame is a group named by the list's label and each group's
// rows a list named by its heading; ungrouped, the one list takes the label.
// A group's heading is block list's shared heading (.sf-group-heading, C40):
// the words at the list's text size, medium; for today and yesterday the date
// beside them in sf-time; sticky with sticky-headings.
//
// The rows are keyed by id, so a row that moves keeps its node and a redraw
// does not take the focus from the row a person is on.
//
// A row's own parts (1.1.0) stand in sf-list-item's leading and trailing
// places: the avatar (sf-avatar, or a sign -- a glyph in sf-avatar's class
// markup, as sf-chat-window draws its members' signs), the badge and the
// count (sf-badge). The row takes its slot elements once, when it connects,
// and draws those very nodes in its own markup. So the slot elements are
// fixed in the row's template and only what is inside them changes: a count
// that comes and goes keeps the row, and the focus on it. A list that gains
// its first avatar draws its rows from the other template, anew.
// The steps of a row's parts beside a row of each size: a one-line row's
// avatar takes the row's line, as its icon does, and a two-line row's avatar
// the control height of the row's step (sf-avatar size) -- a one-line row
// in that list keeps the line, centred in the wider place; the count and the
// badge take the row's line (sf-badge line), so they never make a row taller.

const BADGE_STATUS = {
  neutral: lit__WEBPACK_IMPORTED_MODULE_0__.nothing,
  info: "info",
  success: "success",
  warning: "warning",
  error: "error"
}; // hue auto picks the initials' hue from the row's title (sf-avatar reads its
// aria-label), so a conversation keeps its colour whatever its initials.

const leadContent = (context, item) => {
  const avatar = context.avatarOf(item);
  const size = context.size;
  const wide = Boolean(context.leading?.wide) && Boolean(item.supporting);

  if (avatar?.kind === "avatar") {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-avatar
                aria-hidden="true"
                aria-label=${String(item.text ?? "") || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                hue="auto"
                size=${wide ? size : "1"}
                line=${wide ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : size}
                shape=${avatar.shape}
                image-url=${avatar.imageUrl || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                text=${avatar.text || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ?disabled=${item.disabled === true}
        ></sf-avatar>`;
  }

  if (avatar?.kind === "sign") {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-list__sign sf-avatar ${wide ? `sf-avatar--size-${size}` : `sf-avatar--size-1 sf-avatar--line-${size}`} sf-avatar--placeholder ${avatar.shape === "square" ? "sf-avatar--square" : ""} inline-flex flex-none items-cross-center content-main-center"
                          aria-hidden="true"><sf-icon icon=${avatar.icon} aria-hidden="true"></sf-icon></span>`;
  }

  const icon = typeof item.icon === "string" && item.icon.trim() ? item.icon.trim() : "";
  return icon ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-icon class="sf-list__glyph" icon=${icon} aria-hidden="true"></sf-icon>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
};

const metaContent = (context, item) => {
  const count = context.countOf(item);
  const badge = context.badgeOf(item);
  const line = context.size; // A row is a dense place: its badge and count keep the tight side room
  // (sf-badge tight), so the wider default of sf-badge 1.3.0 does not push
  // the row's text aside.

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${badge ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-badge class="sf-list__badge" line=${line} appearance="tonal" tight
                         status=${BADGE_STATUS[badge.tone]} text=${badge.text}></sf-badge>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}${count ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-badge class="sf-list__count" line=${line} scheme="primary" tight
                         text=${count > context.countCap ? `${context.countCap}+` : String(count)}
                         aria-label=${context.countLabel(count)}></sf-badge>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}`;
};

const row = (context, item) => {
  const {
    component
  } = context;
  const text = String(item.text ?? "") || context.untitledText;
  const supporting = item.supporting ? String(item.supporting) : "";
  const current = item.id === context.selected;
  const disabled = item.disabled === true;
  const icon = typeof item.icon === "string" && item.icon.trim() ? item.icon.trim() : "";

  if (context.editing === item.id) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
            <li class="sf-list__row sf-list__row--editing" data-id=${item.id}>
                <input
                        class="sf-list__rename"
                        .value=${text === context.untitledText ? "" : text}
                        maxlength=${context.textLimit}
                        aria-label=${context.renameLabel}
                        @keydown=${event => {
      if (event.key === "Enter") {
        event.preventDefault();
        component.finishRename(true, event.currentTarget);
      }

      if (event.key === "Escape") {
        // The Escape is the field's: a panel around the
        // list must not close on it as well.
        event.preventDefault();
        event.stopPropagation();
        component.finishRename(false, event.currentTarget);
      }
    }}
                        @blur=${event => component.finishRename(true, event.currentTarget)}
                />
            </li>
        `;
  }

  const menu = context.hasMenu(item); // no-wrap (1.2.0): the row's text may be cut, so the whole of it is the
  // row's tooltip. It stands on the row's host, an ancestor of everything
  // the pointer can rest on but the «⋯», which has its own; the text itself
  // stays in the row for a screen reader, so the tooltip is not its name.

  const tip = context.noWrap ? supporting ? `${text} · ${supporting}` : text : ""; // Two templates, with the leading place and without; the slot elements
  // are the template's own, never a value of it (see above).

  const listItem = context.leading ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-list-item
                    interactive
                    kind="icon"
                    size=${context.size}
                    value=${item.id}
                    text=${text}
                    supporting=${supporting || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    title=${tip || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    ?selected=${current}
                    ?disabled=${disabled}
            ><span slot="leading" class="sf-list__lead">${leadContent(context, item)}</span><span
                    slot="trailing" class="sf-list__meta">${metaContent(context, item)}</span></sf-list-item>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-list-item
                    interactive
                    kind=${icon ? "icon" : "text"}
                    icon=${icon || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    size=${context.size}
                    value=${item.id}
                    text=${text}
                    supporting=${supporting || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    title=${tip || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    ?selected=${current}
                    ?disabled=${disabled}
            ><span slot="trailing" class="sf-list__meta">${metaContent(context, item)}</span></sf-list-item>`;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <li class="sf-list__row ${current ? "sf-list__row--current" : ""}" data-id=${item.id}>
            ${listItem}
            ${menu ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<button
                        type="button"
                        class="sf-list__actions sf-icon-button sf-icon-button--icon sf-icon-button--link sf-icon-button--on-surface sf-icon-button--size-${context.size} flex items-cross-center content-main-center flex-none"
                        tabindex="-1"
                        aria-haspopup="menu"
                        aria-label=${context.actionsLabel(text)}
                        title=${context.actionsLabel(text)}
                        @click=${event => component.openMenu(item.id, event.currentTarget)}
                ><sf-icon icon="more_horiz" aria-hidden="true"></sf-icon></button>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        </li>
    `;
};

const rows = (context, items, labelled) => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <ul class="sf-list__rows" aria-labelledby=${labelled ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing} aria-label=${labelled ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : context.label}>
        ${(0,lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__.repeat)(items, item => item.id, item => row(context, item))}
    </ul>
`;

function renderListTemplate(context) {
  const {
    component
  } = context;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-list sf-list__frame sf-list--size-${context.size}${context.leading?.wide ? " sf-list--lead-wide" : ""}${context.noWrap ? " sf-list--no-wrap" : ""} ${context.empty ? "sf-list--empty" : ""}"
             role=${context.grouped ? "group" : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
             aria-label=${context.grouped ? context.label : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
             aria-busy=${context.loading ? "true" : "false"}>
            <span class="sf-list__width" aria-hidden="true"></span>
            ${context.loading ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-list__skeleton" aria-hidden="true"><span></span><span></span><span></span></div>
                       <p class="sr-only" role="status">${context.loadingText}</p>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            <div class="sf-list__body"
                 data-sf-list
                 ?hidden=${context.empty || context.loading}
                 @keydown=${event => component.onKey(event)}
                 @sf-list-item-open=${event => component.onRowOpen(event)}>
                ${(0,lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__.repeat)(context.sections, group => group.key, group => context.grouped ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                        <section class="sf-list__group" data-group=${group.key}>
                            <div class=${`sf-group-heading sf-list__heading${context.size === "1" ? "" : ` sf-group-heading--size-${context.size}`}${context.stickyHeadings ? " sf-group-heading--sticky" : ""}`}
                                 role="heading" aria-level=${context.headingLevel}
                                 id=${`${context.uid}-${group.key.replace(/[^\w-]/gu, "_")}`}>${group.heading}${group.date ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)` <sf-time class="sf-group-heading-date" format="date" tooltip="none" datetime=${group.date}></sf-time>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}</div>
                            ${rows(context, group.items, `${context.uid}-${group.key.replace(/[^\w-]/gu, "_")}`)}
                        </section>` : rows(context, group.items, null))}
            </div>
            ${context.emptyContent // The page's own empty state stays in the document while the
  // list has rows, hidden: a page that looks it up by id to give
  // it its actions finds it whatever the list shows (ui-doc
  // «Рецепты», 2026-11-10). The list's own is drawn only when empty.
  ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-list__empty" ?hidden=${!context.empty}>${context.emptyContent}</div>` : context.empty ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-list__empty"><sf-empty-state kind="no-data" size="1/2" heading=${context.emptyHeading}></sf-empty-state></div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            <div class="sf-list__next" ?hidden=${!context.showMore}>
                <sf-button
                        appearance="ghost"
                        scheme="on-surface"
                        size="1/2"
                        icon="expand_more"
                        text=${context.moreText}
                        ?disabled=${context.loadingMore}
                        aria-busy=${context.loadingMore ? "true" : "false"}
                        data-action="more"
                        @click=${() => component.requestMore()}
                ></sf-button>
                <span class="sr-only" role="status">${context.loadingMore ? context.loadingMoreText : ""}</span>
                <span class="sf-list__end" aria-hidden="true"></span>
            </div>
            <sf-menu-context
                    class="sf-list__menu"
                    popup
                    @sf-menu-context-select=${event => {
    event.stopPropagation();
    component.onMenu(event.detail);
  }}
            ></sf-menu-context>
        </div>
    `;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "001507727cfa"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "5b7d7695b41b"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("element-manifest", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("element-manifest", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "efa66f8927d1"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit/directives/repeat.js", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("lit/directives/repeat.js", 1).then(resolve, reject), { once: true })));

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

/***/ "2677706b5ec9"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.list","tag":"sf-list","version":"1.5.1","kind":"leaf","settings":{"items":{"type":"list","default":[],"of":{"id":"id","text":{"type":"string","optional":true},"supporting":{"type":"string","optional":true},"icon":{"type":"icon","optional":true},"avatar":{"type":"object","optional":true},"date":{"type":"date","optional":true},"group":{"type":"string","optional":true},"disabled":{"type":"boolean","optional":true},"actions":{"type":"list","optional":true},"count":{"type":"number","integer":true,"min":0,"optional":true},"badge":{"type":"object","optional":true},"pinned":{"type":"boolean","optional":true}},"entries":{"key":"id","changes":"content"}},"selected":{"type":"id","default":""},"group-by":{"type":"enum","values":["none","day","key"],"default":"none"},"groups":{"type":"list","default":[],"of":{"key":"string","text":"string"}},"actions":{"type":"list","default":[],"of":{"id":"id","text":"string","icon":{"type":"icon","optional":true},"destructive":{"type":"boolean","optional":true}}},"renamable":{"type":"boolean","default":false},"has-more":{"type":"boolean","default":false},"loading":{"type":"boolean","default":false},"size":{"type":"enum","values":["1/2","1","2"],"default":"1"},"no-wrap":{"type":"boolean","default":false},"label":{"type":"string","default-from":"runtime.label"},"heading-level":{"type":"number","integer":true,"min":2,"max":6,"default":3},"sticky-headings":{"type":"boolean","default":false},"empty-text":{"type":"string","default-from":"runtime.empty-text"}},"values":{},"events":{"open":{"carries":{"id":"id","trigger":{"type":"enum","values":["pointer","keyboard"]}}},"apply":{"carries":{"action":"string","scope":{"type":"enum","values":["entry"]},"ids":{"type":"list","schema":{"items":{"type":"string"}}}}},"rename":{"carries":{"id":"id","text":{"type":"string","schema":{"minLength":1,"maxLength":200}}},"cancelable":true},"load-more":{"carries":{"direction":{"type":"enum","values":["after"]},"after":{"type":"id","nullable":true}},"cancelable":true}},"actions":{"set-items":{"with":{"items":{"type":"list","schema":{"items":{"type":"object","properties":{"id":{"type":["string","number"]},"text":{"type":"string"},"supporting":{"type":"string"},"icon":{"type":"string"},"date":{"type":"string"},"group":{"type":"string"},"disabled":{"type":"boolean"},"actions":{}},"required":["id"]}}},"options":{"type":"object","optional":true,"schema":{"properties":{"hasMore":{"type":"boolean","default":false}}}}}},"append-items":{"with":{"items":{"type":"list","schema":{"items":{"type":"object","properties":{"id":{"type":["string","number"]},"text":{"type":"string"},"supporting":{"type":"string"},"icon":{"type":"string"},"date":{"type":"string"},"group":{"type":"string"},"disabled":{"type":"boolean"},"actions":{}},"required":["id"]}}},"options":{"type":"object","optional":true,"schema":{"properties":{"hasMore":{"type":"boolean","default":false}}}}}},"upsert":{"with":{"item":{"type":"object","schema":{"type":"object","properties":{"id":{"type":["string","number"]},"text":{"type":"string"},"supporting":{"type":"string"},"icon":{"type":"string"},"date":{"type":"string"},"group":{"type":"string"},"disabled":{"type":"boolean"},"actions":{}},"required":["id"]}}}},"detach":{"with":{"id":"id"}},"rename":{"with":{"id":"id"}},"open-menu":{"with":{"id":"id"}},"request-more":{},"more-failed":{}},"presentation":{"skeleton":{"late":["items"]}},"host-states":{},"css-variables":{"--sf-list-gap":{"type":"length","state":"default"},"--sf-list-radius":{"type":"length","state":"default"},"--sf-list-hover-background-color":{"type":"color","state":"hover"},"--sf-list-current-background-color":{"type":"color","state":"selected"},"--sf-list-heading-color":{"type":"color","state":"default"}}}');

/***/ },

/***/ "c1c5abcf20ed"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"List","runtime":{"actions-label":"Actions: {text}","count-label":{"one":"{n} unread","other":"{n} unread"},"empty-text":"Nothing here yet","label":"List","loading-more-text":"Loading…","loading-text":"Loading the list","more-text":"Show more","pinned-text":"Pinned","rename-label":"New name","rename-text":"Rename","undated-text":"No date","ungrouped-text":"Other","untitled-text":"Untitled"}}');

/***/ },

/***/ "0c29db1e15d7"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Список","runtime":{"actions-label":"Действия: {text}","count-label":{"one":"{n} непрочитанное","few":"{n} непрочитанных","many":"{n} непрочитанных","other":"{n} непрочитанного"},"empty-text":"Здесь пока пусто","label":"Список","loading-more-text":"Загружаю…","loading-text":"Загружаю список","more-text":"Показать ещё","pinned-text":"Закреплённые","rename-label":"Новое название","rename-text":"Переименовать","undated-text":"Без даты","ungrouped-text":"Другое","untitled-text":"Без названия"}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("6cfd28b331a1");
/******/
/******/ })()
;