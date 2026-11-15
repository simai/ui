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
/* harmony import */ var _lang_file_size_index_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("4294700087dc");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_format_intl_js__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
_format_intl_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
// File sizes in the page's language («1,4 МБ»), with no top-level side
// effects (format-intl.js). The same functions as core/js/format.js,
// composition/file-size.mjs and SF.format.fileSize.
 // The four words of a size live in core's language files
// (core/js/lang/file-size, localization study LC-3): ru and en ship; any
// other language takes the words a product registers for `sf-file-size`
// (SF.language.register('sf-file-size', 'de', {b, kb, mb, gb})), else the
// English words with its own digits. A component with words of its own passes
// them as `units`. The registry is read from the shared global the page
// language keeps (core/js/page-language.js), so this module still runs
// nothing on load.


const UNIT_KEYS = /* @__PURE__ */Object.freeze(['b', 'kb', 'mb', 'gb']);

function unitsOf(words) {
  return Object.freeze(UNIT_KEYS.map(key => words[key]));
}

const FILE_SIZE_UNITS = /* @__PURE__ */Object.freeze({
  en: /* @__PURE__ */unitsOf(_lang_file_size_index_mjs__WEBPACK_IMPORTED_MODULE_1__["default"].en),
  ru: /* @__PURE__ */unitsOf(_lang_file_size_index_mjs__WEBPACK_IMPORTED_MODULE_1__["default"].ru)
});

function registeredUnits(code) {
  const words = globalThis.__sfPageLanguage?.registered?.get?.('sf-file-size')?.get?.(code);
  return words && UNIT_KEYS.every(key => typeof words[key] === 'string') ? unitsOf(words) : null;
}
/** The unit words for a locale: registered for it, its own, its language's, else English. */


function fileSizeUnits(locale = 'en') {
  const wanted = String(locale || 'en').trim().toLowerCase().replace('_', '-');

  for (const code of [...new Set([wanted, wanted.split('-')[0]])]) {
    const units = registeredUnits(code) ?? (Object.hasOwn(FILE_SIZE_UNITS, code) ? FILE_SIZE_UNITS[code] : null);
    if (units) return units;
  }

  return registeredUnits('en') ?? FILE_SIZE_UNITS.en;
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
 * `timeZone` counts the days and writes them on that zone's clock.
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
  timeZone = '',
  gap = '',
  ...where
} = {}) {
  const moment = (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.toDate)(value);
  if (!moment) return gap;
  const locale = (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.formatLocale)(where);
  const offset = (0,_format_date_js__WEBPACK_IMPORTED_MODULE_1__.calendarDayOffset)(moment, {
    now,
    timeZone
  });
  const zone = (0,_format_date_js__WEBPACK_IMPORTED_MODULE_1__.knownTimeZone)(timeZone) ? {
    timeZone
  } : {};
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
      weekday: 'long',
      ...zone
    }).format(moment);
  } else {
    const year = moment.getFullYear() === (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.toDate)(now).getFullYear() ? {} : {
      year: 'numeric'
    };
    text = (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.intlFormatter)('DateTimeFormat', locale, {
      day: 'numeric',
      month: 'long',
      ...year,
      ...zone
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
/* harmony export */   COLLAPSE_ICON: () => (/* binding */ COLLAPSE_ICON),
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
/* harmony import */ var _helpers_cycle__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("64feefebb417");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("677c9e2dc7c8");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("528216f76e58");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("2a4d264285b5");
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("ba9bcf2fbdc4");
/* harmony import */ var _core_js_deprecations__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("d3818183b14c");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_format__WEBPACK_IMPORTED_MODULE_2__, _js_templates_default__WEBPACK_IMPORTED_MODULE_3__, _core_js_deprecations__WEBPACK_IMPORTED_MODULE_9__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_format__WEBPACK_IMPORTED_MODULE_2__, _js_templates_default__WEBPACK_IMPORTED_MODULE_3__, _core_js_deprecations__WEBPACK_IMPORTED_MODULE_9__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_deprecations__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_core_js_deprecations__WEBPACK_IMPORTED_MODULE_9__);
// sf-alert-bar: the full-width bar above a page or admin header for the
// conditions that need action now -- a disk nearly full, a failed backup, a
// site that does not answer, an update. One bar for all of them:
//
//   <sf-alert-bar><script type="application/json" data-sf-settings>
//     {"items": [{"id": "backup", "level": "warning", "text": "…",
//       "action": {"label": "Открыть копии", "href": "/backups/"}}]}
//   </script></sf-alert-bar>
//
// The items are sorted error, warning, info, the newest first; the bar takes
// the colour of the first and shows it, without paging arrows (owner decision
// C114 (3)); «Ещё N» lists the others under the bar (NS-12). A warning closes for a day, an info item
// for good; an error item is never closed, its button minimizes the bar to a
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







 // Only the words on screen ship in the bundle; the title, settings and events
// stay in the language files for the Studio and the docs (localization study LC-2).

const en = {
  runtime: _lang_en_json__WEBPACK_IMPORTED_MODULE_6__.runtime
};
const ru = {
  runtime: _lang_ru_json__WEBPACK_IMPORTED_MODULE_7__.runtime
};

 // The list's id, one per bar on the page (the same on every render, so a
// first-paint snapshot is stable).

let sequence = 0; // The levels say what happened (decision C13, docs review R031): error is the
// most serious, as on every message; danger is its former word here.

const LEVELS = ['error', 'warning', 'info'];
const RANK = {
  error: 0,
  warning: 1,
  info: 2
}; // How a closed item is kept by the host: a warning for a day, info for good.

const HIDE = {
  warning: 'day',
  info: 'always'
}; // sf-alert's status icons, by the theme's status words.

const ICONS = {
  error: 'error',
  warning: 'warning',
  info: 'info'
}; // The open toggle's glyph on a narrow bar (1.6.1): the list collapses.

const COLLAPSE_ICON = 'unfold_less';

const text = value => value === undefined || value === null ? '' : String(value).trim();
/** An item's level: error, warning or info; the former danger is read as error (noted once), anything else as info. */


function levelOf(value) {
  const word = text(value).toLowerCase();

  if (word === 'danger') {
    (0,_core_js_deprecations__WEBPACK_IMPORTED_MODULE_9__.noteDeprecated)({
      component: 'sf-alert-bar',
      tag: 'sf-alert-bar',
      kind: 'value',
      attribute: 'items.level',
      from: 'danger',
      to: 'error',
      since: '2026-11-08',
      remove_after: '2027-01-01'
    });
    return 'error';
  }

  return LEVELS.includes(word) ? word : 'info';
}
/**
 * The items as given, made safe and sorted: error, warning, info; inside a
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
      // An error item is never closed; the others unless the host says no.
      dismissible: level !== 'error' && item.dismissible !== false,
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
const AlertBarElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_5__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: {
    en,
    ru
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
  } // Only an error bar is minimized.


  get isMinimized() {
    return Boolean(this.minimized) && this.level === 'error';
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
      const danger = fresh.filter(item => item.level === 'error');
      const other = fresh.filter(item => item.level !== 'error'); // A new error item is the one thing that is read out at once (role
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
  } // ---------------------------------------------------------------- presses


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
    if (!item) return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.refused)('missing'); // The reason keeps its former word: an outcome has no alias to carry a
    // rename (change journal value-alert-bar-level-danger-to-error).

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
  } // An item leaves: the control that had focus hands it on (§19.2: focus
  // never falls to the page). From a row of the open list it goes to the
  // row that takes its place -- the next one, or from the last row the one
  // before it (NS-12); with no row left, to the bar. From the bar, to the
  // bar's first control.


  leave(id) {
    const active = this.ownerDocument.activeElement;
    const focused = Boolean(active && this.contains(active));
    const row = active?.closest?.('.sf-alert-bar-item');
    const rows = row ? [...this.querySelectorAll('.sf-alert-bar-item')] : [];
    const place = row ? rows.indexOf(row) : -1;

    this._gone.add(id);

    const count = this.list.length;
    this._index = wrapIndex(this._index, count);
    if (count < 2) this._listOpen = false;
    this.requestComponentUpdate('leave');
    if (!focused) return;

    const first = scope => scope?.querySelector('a[href], button:not([disabled])');

    this.whenDrawn(() => {
      const left = this._listOpen ? [...this.querySelectorAll('.sf-alert-bar-item')] : [];
      const target = (place >= 0 && left.length ? first(left[Math.min(place, left.length - 1)]) : null) ?? first(this.querySelector('.sf-alert-bar-row')) ?? this.querySelector('.sf-alert-bar a[href], .sf-alert-bar button:not([disabled])');
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
    this._shownId = current?.id; // The open list holds the others: every item but the one the bar shows.

    const others = list.filter(item => item !== current);
    const level = list[0]?.level ?? ''; // The raw value stays under its own name; the template reads this one.

    const isMinimized = Boolean(this.minimized) && level === 'error';

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
        levelWord: word(`level-${item.level}`)
      })),
      others: others.map(item => ({ ...item,
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
      collapseIcon: COLLAPSE_ICON,
      words: {
        more: word('more', {
          count: others.length
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
    const context = this.templateContext(); // The open toggle's collapse glyph (narrow bar, 1.6.1) is drawn only
    // after a press: asked for with the bar's first drawing, so the page's
    // icon request carries it and the glyph does not wait for a subset of
    // its own (R074, as sf-toast asks for its status glyph).

    if (context.count > 1) (0,_helpers_cycle__WEBPACK_IMPORTED_MODULE_4__.preloadControlIcons)(this, [{
      icon: COLLAPSE_ICON,
      filled: false
    }]);
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_3__.renderAlertBarTemplate)(context);
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
//   inside it speak what appears after the first list: a new error item in
//   role alert, any other new item in role status. The bar itself is no live
//   region, so a bar printed with the page is not read out.
// - Minimized (an error bar only): one button, the strip, that keeps the
//   colour, the icon and the count and expands the bar on a press.
// - Otherwise one row: the shown item's icon, its text with source and time,
//   its action link (sf-button href), acknowledge, «Ещё N» when there are
//   several, and at the end close (a warning or an info item) or minimize (an
//   error item). The bar shows the most serious item; it has no paging
//   arrows (owner decision C114 (3)).
// - With several items, «Ещё N» (the others, not the shown one) opens the
//   list of the others under the bar, in the page flow (C114 (3) as shown
//   expanded, layout Р1, NS-12); open, the button reads «Свернуть список».
//   On a narrow bar (40rem) the open button keeps the place of «Ещё N» at
//   the end of the action line: it shows the collapse glyph only, its name
//   still «Свернуть список» (aria-label, title), so the longer label never
//   wraps to a line of its own. Wide, the glyph is not drawn (scss/).
//   Each row is the bar row's composition on the list's surface: the level
//   icon in the level's colour (its word for a screen reader), the text with
//   the source and time on the line below, the action and acknowledge, and
//   the close for a warning or an info item; an error row keeps the close's
//   place empty, so the columns line up. No level badge.
//
// One button family (AA-15): the action is tonal surface and every other
// button (acknowledge, «Ещё N», hide) ghost, as on sf-alert and sf-toast
// (owner decision C110 as amended 2026-11-12, variant E). Every button of
// the bar and of its list is height="low" (owner decision C117, C27), the
// family's one button height; the sheet's rung control is that height. The controls are sf-button and sf-button-icon of scheme on-surface: inside
// the coloured bar the sheet sets the surface roles they read to the fill's
// on- role, so they draw on it without a scheme of their own. The close is
// the close glyph on an icon button, not kind="close": the drawn close mark
// is 30 px at rung 1/2 on a phone where the rung's control is 28 px.

const icon = (name, extra = '') => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class=${['sf-icon', 'sf-alert-bar-icon', extra].filter(Boolean).join(' ')} aria-hidden="true">${name}</i>`; // The time is sf-time (C40): relative within a day (threshold P1D, as 1.x
// read it), else sf-time's auto («вчера, 19:40», «5 ноября»), the full
// moment in its tooltip.
//
// In a row of the open list the time has no tooltip and is no Tab stop
// (tooltip="none"): the row's stops are its buttons, and the time stays text
// a screen reader reads in the row. The bar's own time keeps its tooltip.


function meta(item, extra = '', tooltip = 'auto') {
  if (!item.source && !item.time) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class=${['sf-alert-bar-meta', extra].filter(Boolean).join(' ')}>${item.source}${item.source && item.time ? ' · ' : ''}${item.time ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-time class="sf-alert-bar-time" datetime=${item.time} threshold="P1D" tooltip=${tooltip === 'auto' ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : tooltip}></sf-time>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}</span>`;
}

function actionLink(context, item, appearance) {
  if (!item.action) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button class="sf-alert-bar-action" size=${context.size} height="low" appearance=${appearance} scheme="on-surface"
    text=${item.action.label} href=${item.action.href || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    @click=${event => context.component.onNavigate(event, item)}></sf-button>`;
}

function acknowledgeButton(context, item, appearance) {
  if (!item.acknowledge) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button class="sf-alert-bar-acknowledge" size=${context.size} height="low" appearance=${appearance} scheme="on-surface"
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
    end = (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button-icon class="sf-alert-bar-close" icon="close" size=${size} height="low" appearance="ghost" scheme="on-surface"
      aria-label=${label} title=${label} @click=${() => component.closeItem(item.id)}></sf-button-icon>`;
  } else if (item.level === 'error') {
    end = (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button-icon class="sf-alert-bar-minimize" icon="expand_less" size=${size} height="low" appearance="ghost" scheme="on-surface"
      aria-label=${words.minimize} title=${words.minimize} @click=${() => component.setMinimized(true)}></sf-button-icon>`;
  }

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-alert-bar-row" data-level=${item.level}>
    ${icon(icons[item.level])}
    <div class="sf-alert-bar-text">
      <span class="sf-alert-bar-message">${prefix ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-alert-bar-prefix">${prefix}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}${item.text}</span>
      ${meta(item)}
    </div>
    ${item.action || item.acknowledge || many ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-alert-bar-actions">
      ${actionLink(context, item, 'tonal')}
      ${acknowledgeButton(context, item, 'ghost')}
      ${many ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button class="sf-alert-bar-all" size=${size} height="low" appearance="ghost" scheme="on-surface"
        text=${listOpen ? words.collapseList : words.more} icon-start=${listOpen ? context.collapseIcon : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        aria-label=${listOpen ? words.collapseList : lit__WEBPACK_IMPORTED_MODULE_0__.nothing} title=${listOpen ? words.collapseList : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        expanded=${listOpen ? 'true' : 'false'} aria-controls=${listId}
        @click=${() => component.toggleList()}></sf-button>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    </div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    ${end}
  </div>`;
} // The list of the others (Р1, NS-12): one row per item, as the bar row.


function listOfOthers(context) {
  const {
    component,
    others,
    size,
    words,
    icons,
    listId
  } = context;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<ul class="sf-alert-bar-list" id=${listId} aria-label=${words.list}>
    ${others.map(item => {
    const label = hideWord(context, item);
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<li class="sf-alert-bar-item" data-level=${item.level} data-id=${item.id}>
      ${icon(icons[item.level], 'sf-alert-bar-item-icon')}
      <div class="sf-alert-bar-item-text">
        <span class="sf-alert-bar-item-message"><span class="sr-only">${item.levelWord}: </span>${item.text}</span>
        ${meta(item, 'sf-alert-bar-item-meta', 'none')}
      </div>
      ${item.action || item.acknowledge ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-alert-bar-item-actions">
        ${actionLink(context, item, 'tonal')}
        ${acknowledgeButton(context, item, 'ghost')}
      </div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      ${item.dismissible ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button-icon class="sf-alert-bar-item-close" icon="close" size=${size} height="low" appearance="ghost" scheme="on-surface"
          aria-label=${label} title=${label} @click=${() => component.closeItem(item.id)}></sf-button-icon>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-alert-bar-item-end" aria-hidden="true"></span>`}
    </li>`;
  })}
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
    ${count === 0 ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : isMinimized ? strip(context) : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${row(context)}${listOpen ? listOfOthers(context) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}`}
  </div>`;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "64feefebb417"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   THEME_ICONS: () => (/* binding */ THEME_ICONS),
/* harmony export */   cycleItems: () => (/* binding */ cycleItems),
/* harmony export */   cycleState: () => (/* binding */ cycleState),
/* harmony export */   hasCycle: () => (/* binding */ hasCycle),
/* harmony export */   loaderOwnsTheme: () => (/* binding */ loaderOwnsTheme),
/* harmony export */   nextTheme: () => (/* binding */ nextTheme),
/* harmony export */   parseCycle: () => (/* binding */ parseCycle),
/* harmony export */   preloadControlIcons: () => (/* binding */ preloadControlIcons),
/* harmony export */   preloadSwitchIcons: () => (/* binding */ preloadSwitchIcons),
/* harmony export */   pressCycle: () => (/* binding */ pressCycle),
/* harmony export */   switchIconEntries: () => (/* binding */ switchIconEntries),
/* harmony export */   themeCycleFollow: () => (/* binding */ themeCycleFollow),
/* harmony export */   themeCycleValues: () => (/* binding */ themeCycleValues),
/* harmony export */   themePreference: () => (/* binding */ themePreference),
/* harmony export */   visibleTheme: () => (/* binding */ visibleTheme),
/* harmony export */   warnCycleToggle: () => (/* binding */ warnCycleToggle),
/* harmony export */   warnThemeNotOwned: () => (/* binding */ warnThemeNotOwned)
/* harmony export */ });
// One button, several values (docs review R039, owner decision D11d;
// research ui-control control/research/2026-11-08-cycle-button.md).
//
// sf-button and sf-button-icon share this: the `cycle` setting is a list of
// items shaped like sf-segmented's items ({value, label, icon} and an
// optional `pressed`, which draws the item with the pressed look), `value`
// is the current item, and a press moves to the next item and wraps. The
// `theme-cycle` setting draws a ready theme switch over SF.Loader's theme
// (the same contract as sf-segmented's theme-switch: themePreference,
// setTheme, sf-theme-change).
//
// The name and the icon say the current value («Тема: тёмная»), the tooltip
// says the current and the next («Тема: тёмная. Нажмите — как в системе»),
// and a polite live region says the new value after a press. A cycle is a
// plain button: it carries no aria-pressed, so pressed, label-pressed and
// text-pressed are ignored beside it (with one console warning).
const THEME_VALUES = ['system', 'light', 'dark']; // «Как в системе» in a cycle is the half-dark, half-light circle (D11d): a
// monitor alone does not say a theme.

const THEME_ICONS = Object.freeze({
  system: 'contrast',
  light: 'light_mode',
  dark: 'dark_mode'
});

function parseList(source) {
  if (Array.isArray(source)) return source;
  const text = String(source ?? '').trim();
  if (!text) return [];

  if (text.startsWith('[')) {
    try {
      const parsed = JSON.parse(text);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  } // value::label::flags|… as sf-segmented's items take it; a flag icon=<name>
  // names the icon, pressed draws the pressed look.


  return text.split('|').map(entry => {
    const [value, label = value, flags = ''] = entry.split('::');
    const list = flags.split(',').map(flag => flag.trim()).filter(Boolean);
    const icon = list.find(flag => flag.startsWith('icon='));
    return {
      value: value.trim(),
      label: label.trim(),
      icon: icon ? icon.slice(5) : '',
      pressed: list.includes('pressed')
    };
  });
}
/** The cycle's items, normalised: a value each, once, in the given order. */

/** Reads the attribute's JSON or value::label::flags form; a list stays a list. */


function parseCycle(value) {
  return parseList(value);
}
function cycleItems(source) {
  const seen = new Set();
  return parseList(source).map((item, index) => {
    const one = typeof item === 'string' ? {
      value: item,
      label: item
    } : item;
    if (!one || typeof one !== 'object') return null;
    const value = String(one.value ?? one.id ?? index).trim();
    if (!value || seen.has(value)) return null;
    seen.add(value);
    return {
      value,
      label: String(one.label ?? one.text ?? value),
      icon: String(one.icon || ''),
      lang: String(one.lang || '').trim(),
      pressed: Boolean(one.pressed)
    };
  }).filter(Boolean);
}
/** The themes a theme-cycle offers: all three, or the two it names. */

function themeCycleValues(attribute) {
  const named = String(attribute ?? '').trim().toLowerCase().split(/[\s,]+/u).map(word => word === 'auto' ? 'system' : word).filter(word => THEME_VALUES.includes(word));
  const unique = [...new Set(named)]; // Two themes without «as the system» flip the visible theme; anything else
  // (empty, one word, all three) is the full cycle.

  if (unique.length === 2 && !unique.includes('system')) return ['light', 'dark'];
  return THEME_VALUES;
}

const opposite = theme => theme === 'dark' ? 'light' : 'dark';

function loader() {
  return globalThis.SF?.Loader;
}
/**
 * False when the page's host draws the theme itself and started the Loader
 * with `theme: false` (SF_BOOT_CONFIG.theme): the Loader then neither reads
 * nor sets a theme, and its `theme` stays at the value it began with.
 */


function loaderOwnsTheme() {
  return loader()?.themeEnabled !== false;
}
/**
 * The theme drawn now (light or dark), whatever the preference. The Loader's
 * own value counts only while the Loader owns the theme; under a host that
 * owns it (R076: a Docara example frame) the document says what is drawn.
 */

function visibleTheme() {
  const theme = loaderOwnsTheme() ? loader()?.theme : undefined;
  if (theme === 'dark' || theme === 'light') return theme;
  const root = globalThis.document?.documentElement;
  if (root?.classList?.contains('theme-dark')) return 'dark';
  if (root?.classList?.contains('theme-light')) return 'light';
  return globalThis.matchMedia?.('(prefers-color-scheme: dark)')?.matches ? 'dark' : 'light';
}
/** What the person chose: system, light or dark. */

function themePreference() {
  const preference = loader()?.themePreference;
  return THEME_VALUES.includes(preference) ? preference : 'system';
}
/**
 * The owner's order (D11d): first the theme opposite to the visible one,
 * then the other, then «as the system». It needs the value before the
 * current one: from an explicit theme reached from the other explicit theme
 * the next is system; from system, or from a theme the page loaded with, the
 * opposite theme. Two themes: always the opposite of the visible theme.
 */

function nextTheme({
  values,
  current,
  previous
}) {
  if (!values.includes('system')) return opposite(visibleTheme());
  if (current === 'system') return opposite(visibleTheme());
  if (previous && previous !== 'system' && previous === opposite(current)) return 'system';
  return opposite(current);
}
/**
 * The cycle state the template reads: {items, item, next, index, name,
 * tooltip}. `words(key, vars)` gives the element's words; `base` is the
 * button's own name (aria-label, or the text of an sf-button).
 */

function hasCycle(host) {
  if (host.hasAttribute('theme-cycle')) return true;
  const own = host.getProp?.('cycle');
  return Boolean(host.hasAttribute('cycle') || Array.isArray(own) && own.length);
}
function cycleState(host, {
  base = '',
  words
}) {
  if (host.hasAttribute('theme-cycle')) {
    const values = themeCycleValues(host.getAttribute('theme-cycle'));
    const two = !values.includes('system');
    const current = two ? visibleTheme() : themePreference();

    const label = value => words(`theme-${value}`);

    const items = values.map(value => ({
      value,
      label: label(value),
      icon: THEME_ICONS[value],
      lang: '',
      pressed: false
    }));
    const item = items.find(one => one.value === current) ?? items[0];
    const nextValue = nextTheme({
      values,
      current: item.value,
      previous: host.__sfCyclePrevious
    });
    const next = items.find(one => one.value === nextValue) ?? items[0];
    const title = base || words('theme');
    const now = item.value === 'system' ? words('theme-system-now', {
      vars: {
        theme: label(visibleTheme())
      }
    }) : item.label;
    const name = `${title}: ${now}`;
    return {
      theme: true,
      items,
      item,
      next,
      name,
      tooltip: words('cycle-next', {
        vars: {
          name,
          next: next.label
        }
      })
    };
  }

  const items = cycleItems(host.getProp?.('cycle') ?? host.getAttribute('cycle'));
  if (!items.length) return null;
  const at = Math.max(0, items.findIndex(one => one.value === (host.getAttribute('value') ?? '')));
  const item = items[at];
  const next = items[(at + 1) % items.length];
  const name = base ? `${base}: ${item.label}` : item.label;
  return {
    theme: false,
    items,
    item,
    next,
    name,
    tooltip: words('cycle-next', {
      vars: {
        name,
        next: next.label
      }
    })
  };
}
/** A cycle beside a toggle's settings: the toggle's are ignored, said once. */

function warnCycleToggle(host, names) {
  const given = names.filter(name => host.hasAttribute(name));
  if (!given.length || host.__sfCycleWarned) return;
  host.__sfCycleWarned = true;
  globalThis.console?.warn?.(`[SIMAI Framework] ${host.localName}: cycle and theme-cycle are not toggles; ${given.join(', ')} ignored.`);
}
/**
 * A theme cycle whose press cannot move the theme says why, once per
 * element (R076): a host that owns the theme (the Loader started with
 * `theme: false`), or no Loader at all. The button stays where it is and
 * sends no change.
 */

function warnThemeNotOwned(host) {
  if (host.__sfThemeWarned) return;
  host.__sfThemeWarned = true;
  const reason = loader() ? 'the page\'s theme belongs to its host (the Loader runs with theme: false); a host that hands the theme to the Loader makes it work (a Docara example: theme_switch=true)' : 'SF.Loader is absent';
  globalThis.console?.warn?.(`[SIMAI Framework] ${host.localName} theme-cycle: the press changes nothing: ${reason}.`);
}
/**
 * A person's press of a cycle: the next value, the change event and the
 * announcement. Answers true when it moved.
 */

function pressCycle(host, state) {
  if (!state) return false;
  const previous = state.item.value;
  const value = state.next.value; // Said after the drawing that follows: the flag first, as the drawing may
  // come at once.

  const before = host.__sfCyclePrevious;
  host.__sfCycleAnnounce = true;
  host.__sfCyclePrevious = previous;

  if (state.theme) {
    // The Loader moves the page first, so a listener of change finds the
    // page in the theme it chose; a Loader that cannot (absent, or the
    // theme switched off) leaves the cycle where it is.
    host.__sfCycleExpect = value;

    if (loader()?.setTheme?.(value) !== true) {
      warnThemeNotOwned(host);
      host.__sfCycleAnnounce = false;
      host.__sfCyclePrevious = before;
      host.__sfCycleExpect = undefined;
      return false;
    }
  } else {
    host.setAttribute('value', value);
  }

  host.requestComponentUpdate?.('value');
  const item = state.items.find(one => one.value === value) ?? null;
  host.sfEmit('change', {
    previous,
    value,
    item: item ? { ...item
    } : null
  });
  return true;
}
/**
 * sf-theme-change for a theme cycle: a theme set elsewhere (another switch,
 * SF.Loader.setTheme) starts the order afresh from what is shown.
 */

function themeCycleFollow(host) {
  if (!host.hasAttribute('theme-cycle')) return;
  const values = themeCycleValues(host.getAttribute('theme-cycle'));
  const now = values.includes('system') ? themePreference() : visibleTheme();
  if (host.__sfCycleExpect !== now) host.__sfCyclePrevious = undefined;
  host.__sfCycleExpect = undefined;
  host.requestComponentUpdate?.('theme-cycle');
} // The icons a control can switch to, asked for before it switches (R074).
// Only the icon on screen was tracked, so the first press that showed another
// one asked the subset service for a grown font on the click, and the new
// icon stayed blank while the service built it (up to ~30 s when it was busy).
// Asked for when the control is drawn, the names join the page's first icon
// request (held until the Loader is ready); a control added later costs one
// grown font off the click.

/**
 * The icon entries ({icon, filled}) a cycle, a theme cycle or a toggle can
 * show. `icons` are a toggle's own icon names: with `pressed` present they
 * are drawn filled while on, so both forms are asked for. `filled` is the
 * control's own filled setting (every form filled).
 */

function switchIconEntries(host, {
  icons = [],
  filled = false
} = {}) {
  const entries = [];

  const add = (icon, fill) => {
    const name = String(icon || '').trim();
    if (name) entries.push({
      icon: name,
      filled: Boolean(fill || filled)
    });
  };

  if (host.hasAttribute('theme-cycle')) {
    themeCycleValues(host.getAttribute('theme-cycle')).forEach(value => add(THEME_ICONS[value], false));
  } else if (hasCycle(host)) {
    cycleItems(host.getProp?.('cycle') ?? host.getAttribute('cycle')).forEach(item => add(item.icon, item.pressed));
  } else if (host.hasAttribute('pressed')) {
    icons.forEach(icon => {
      add(icon, false);
      add(icon, true);
    });
  }

  const seen = new Set();
  return entries.filter(entry => {
    const key = `${entry.icon}|${entry.filled}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
/**
 * Asks the Loader for these icon entries once per distinct list (a render
 * that draws the same items asks nothing). Answers the number of new names.
 */

function preloadControlIcons(host, entries) {
  if (!Array.isArray(entries) || !entries.length) return 0;
  const key = JSON.stringify(entries);
  if (host.__sfPreloadedIcons === key) return 0;
  const preload = loader()?.preloadIcons;
  if (typeof preload !== 'function') return 0;
  host.__sfPreloadedIcons = key;
  return preload.call(loader(), entries) || 0;
}
/** switchIconEntries, asked for. */

function preloadSwitchIcons(host, options = {}) {
  return preloadControlIcons(host, switchIconEntries(host, options));
}

/***/ },

/***/ "ba9bcf2fbdc4"
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

/***/ "4294700087dc"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _en_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("3694b5e2bf39");
/* harmony import */ var _ru_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("220979cc98c6");
// The unit words of a file size (localization study LC-3), for the bundle and
// for Node alike: the runtime words of the language files, by language.



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ en: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime, ru: _ru_json__WEBPACK_IMPORTED_MODULE_1__.runtime });


/***/ },

/***/ "3694b5e2bf39"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"runtime":{"b":"B","kb":"KB","mb":"MB","gb":"GB"}}');

/***/ },

/***/ "220979cc98c6"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"runtime":{"b":"Б","kb":"КБ","mb":"МБ","gb":"ГБ"}}');

/***/ },

/***/ "677c9e2dc7c8"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.alert-bar","tag":"sf-alert-bar","version":"1.6.4","kind":"leaf","settings":{"items":{"type":"list","schema":{"items":{"type":"object","properties":{"id":{"type":"string"},"level":{"type":"string","enum":["error","warning","info"]},"text":{"type":"string"},"source":{"type":"string"},"time":{"type":"string"},"action":{"type":"object","properties":{"label":{"type":"string"},"href":{"type":"string"}}},"acknowledge":{"type":"object","properties":{"label":{"type":"string"}}},"dismissible":{"type":"boolean"}},"required":["id","level","text"]}},"default":[]},"size":{"type":"enum","values":["1/2","1"],"default":"1/2"},"label":{"type":"string","default-from":"runtime.label"}},"values":{"minimized":{"type":"boolean","default":false}},"events":{"navigate":{"carries":{"id":"string","level":"string","href":"string"},"cancelable":true},"acknowledge":{"carries":{"id":"string","level":"string"},"cancelable":true,"own-verb":true},"close":{"carries":{"id":"string","level":"string","hide":{"type":"enum","values":["day","always"]},"reason":{"type":"enum","values":["close","api"]}},"cancelable":true},"minimize":{"carries":{"minimized":"boolean"}}},"actions":{"close":{"with":{"id":"string"}}},"host-states":{"data-level":"string","data-minimized":"boolean","data-empty":"boolean"},"css-variables":{"--sf-alert-bar-error-background-color":{"type":"color","state":"default"},"--sf-alert-bar-warning-background-color":{"type":"color","state":"default"},"--sf-alert-bar-info-background-color":{"type":"color","state":"default"},"--sf-alert-bar-padding-inline":{"type":"length","state":"default"},"--sf-alert-bar-list-background-color":{"type":"color","state":"default"},"--sf-alert-bar-gap":{"type":"length","state":"default"}}}');

/***/ },

/***/ "528216f76e58"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Alert bar","runtime":{"label":"Important notices","level-error":"Error","level-warning":"Warning","level-info":"Info","more":"{count} more","collapse-list":"Hide the list","list":"All notices","hide-day":"Hide for a day","hide":"Hide","acknowledge":"Mark as read","minimize":"Minimize the bar","expand":"expand","expand-label":"Expand the important notices","count":"Important notices: {count}"},"events":{"acknowledge":{"label":"Mark as read"}}}');

/***/ },

/***/ "2a4d264285b5"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Плашка уведомлений","runtime":{"label":"Важные уведомления","level-error":"Ошибка","level-warning":"Предупреждение","level-info":"Сведения","more":"Ещё {count}","collapse-list":"Свернуть список","list":"Все уведомления","hide-day":"Скрыть на сутки","hide":"Скрыть","acknowledge":"Прочитано","minimize":"Свернуть плашку","expand":"развернуть","expand-label":"Развернуть важные уведомления","count":"Важных уведомлений: {count}"},"events":{"acknowledge":{"label":"Прочитано"}}}');

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