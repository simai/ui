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
 * Anything that is not a date is `gap`, '' by default. A marker after the year
 * («2026 г.», «2026 р.») is held to it by a no-break space, so it never starts
 * a line alone.
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
  }; // The year keeps its marker («2026 г.» never wraps before «г.»): format-intl.js.

  return (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.formatDateText)((0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.intlFormatter)('DateTimeFormat', (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.formatLocale)(where), options), moment);
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

/***/ "ee5c3aad2640"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   formatRelativeDay: () => (/* binding */ formatRelativeDay),
/* harmony export */   formatRelativeTime: () => (/* binding */ formatRelativeTime),
/* harmony export */   intlSpeaks: () => (/* binding */ intlSpeaks)
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
} // «сегодня», «вчера», «завтра» are the platform's words, except where the
// platform has no words of the language: a browser without a language's
// relative-time data says «yesterday» on a page in it. Then the words come
// from core's language files (core/js/lang/relative-day, registered as
// `sf-relative-day`), which a language pack or a product brings
// (SF.language.register('sf-relative-day', 'de', {today, yesterday,
// tomorrow})). ru and en are never looked up: every platform speaks them.


const DAY_KEYS = /* @__PURE__ */Object.freeze({
  0: 'today',
  [-1]: 'yesterday',
  1: 'tomorrow'
});
/** Whether Intl's relative-time words are those of the locale's language, not a fallback's. */

function intlSpeaks(locale) {
  const wanted = String(locale || '').trim().toLowerCase().replace('_', '-').split('-')[0];
  if (!wanted) return true;
  if (wanted === 'en') return true;

  try {
    const own = (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.intlFormatter)('RelativeTimeFormat', locale, {
      numeric: 'auto'
    });
    if (String(own.resolvedOptions().locale).toLowerCase().split('-')[0] !== wanted) return false; // A platform may answer the locale's name over English data (a trimmed
    // ICU): its «yesterday» is then English's.

    return own.format(-1, 'day') !== (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.intlFormatter)('RelativeTimeFormat', 'en', {
      numeric: 'auto'
    }).format(-1, 'day');
  } catch {
    return false;
  }
}

function packDayWord(offset, locale) {
  if (intlSpeaks(locale)) return null;
  const words = globalThis.__sfPageLanguage?.registered?.get?.('sf-relative-day');
  const wanted = String(locale || '').trim().toLowerCase().replace('_', '-'); // A registry alias takes its pack's words (zh-cn: zh-hans, pt: pt-br).

  const pack = code => globalThis.__sfPageLanguage?.packs?.aliases?.[code] ?? code;

  const base = wanted.split('-')[0];

  for (const code of [...new Set([wanted, pack(wanted), base, pack(base)])]) {
    const word = words?.get?.(code)?.[DAY_KEYS[offset]];
    if (typeof word === 'string' && word.trim()) return word;
  }

  return null;
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
    text = packDayWord(offset, locale) ?? (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.intlFormatter)('RelativeTimeFormat', locale, {
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
    text = (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.formatDateText)((0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.intlFormatter)('DateTimeFormat', locale, {
      day: 'numeric',
      month: 'long',
      ...year,
      ...zone
    }), moment);
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

/***/ "1cc7452687fa"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FORMATS: () => (/* binding */ FORMATS),
/* harmony export */   IN_LIST: () => (/* binding */ IN_LIST),
/* harmony export */   SfTime: () => (/* binding */ SfTime),
/* harmony export */   describeTime: () => (/* binding */ describeTime),
/* harmony export */   durationMs: () => (/* binding */ durationMs),
/* harmony export */   momentOf: () => (/* binding */ momentOf),
/* harmony export */   msUntilRelativeChange: () => (/* binding */ msUntilRelativeChange),
/* harmony export */   msUntilWordsChange: () => (/* binding */ msUntilWordsChange),
/* harmony export */   relativeWords: () => (/* binding */ relativeWords),
/* harmony export */   zoneId: () => (/* binding */ zoneId),
/* harmony export */   zoneLabel: () => (/* binding */ zoneLabel),
/* harmony export */   zoneWordKey: () => (/* binding */ zoneWordKey)
/* harmony export */ });
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _core_js_format_date_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("e577837dd70a");
/* harmony import */ var _core_js_format_relative_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("ee5c3aad2640");
/* harmony import */ var _core_js_format_intl_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("15b4e93ff6ed");
/* harmony import */ var _core_js_page_language_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("43090d1c8307");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("33668afeb99d");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("b033fb83f193");
/* harmony import */ var _lang_index_mjs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("fb9cc1c3591e");
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("a0991f4f93d4");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_format_date_js__WEBPACK_IMPORTED_MODULE_2__, _core_js_format_relative_js__WEBPACK_IMPORTED_MODULE_3__, _core_js_format_intl_js__WEBPACK_IMPORTED_MODULE_4__, _core_js_page_language_js__WEBPACK_IMPORTED_MODULE_5__, _js_templates_default__WEBPACK_IMPORTED_MODULE_6__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_format_date_js__WEBPACK_IMPORTED_MODULE_2__, _core_js_format_relative_js__WEBPACK_IMPORTED_MODULE_3__, _core_js_format_intl_js__WEBPACK_IMPORTED_MODULE_4__, _core_js_page_language_js__WEBPACK_IMPORTED_MODULE_5__, _js_templates_default__WEBPACK_IMPORTED_MODULE_6__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_page_language_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_core_js_page_language_js__WEBPACK_IMPORTED_MODULE_5__);
// sf-time: a moment as the place needs it (owner decision C40, 2026-11-09):
//
//   <sf-time datetime="2026-11-09T14:32:00+03:00"></sf-time>              auto
//   <sf-time datetime="…" format="time"></sf-time>                        14:32
//   <sf-time datetime="…" format="relative"></sf-time>                    28 минут назад
//
// It draws a <time datetime> with the words of core's SF.format in the page
// language: auto says the first hour relative, today the time, yesterday
// «вчера, 19:40», this year the day and month, older the date with the year
// in one long form («30 декабря 2025 г.»), a later day its date and its time
// («15 ноября, 10:00»). Every word is the platform's (Intl.DateTimeFormat,
// Intl.RelativeTimeFormat) in the page language: «gestern, 19:40» on a German
// page; the language file only joins the day and the time. When the text is
// not the full moment, the full date and time are a tooltip (the Framework's
// tooltip composition: hover, keyboard focus, Escape). With the reader's clock
// it draws itself again when its words change («1 минуту назад» becomes
// «2 минуты назад» on the half minute the words round at), on one timer for
// every sf-time on the page, which waits while the page is hidden.
//
// First paint (DEV change-time study CT-7): text the server printed inside
// the host -- «<sf-time datetime="…">14:32</sf-time>», or the static markup
// of §5.4 -- holds the line until the code draws the same words in the same
// task, so the line does not move; an empty host gets a time's width from
// core's first-paint sheet.
//
// From its component.json (standard simai.smart-component 1.3.15 §3, §4,
// §8): the settings are made by core/js/element-manifest.js, the words are
// the language files' and SF.format's.








 // Only the words on screen ship in the bundle, English only (owner decision
// C282): Russian and every other language come from a language file. The
// title, settings and events stay in the language files for the Studio and the
// docs (localization study LC-2).


const FORMATS = ['auto', 'time', 'date', 'datetime', 'relative'];
const MINUTE = 60000;
const HOUR = 60 * MINUTE; // A timer longer than this is not one setTimeout keeps (2^31-1 ms fires at
// once); a moment that will not change its words for longer is looked at again.

const LONGEST_WAIT = 24 * 24 * HOUR; // A wake a little after the change, so the words read on waking are the new ones.

const MARGIN = 50;
const DURATION = /^P(?:(\d+(?:[.,]\d+)?)W)?(?:(\d+(?:[.,]\d+)?)D)?(?:T(?:(\d+(?:[.,]\d+)?)H)?(?:(\d+(?:[.,]\d+)?)M)?(?:(\d+(?:[.,]\d+)?)S)?)?$/iu; // Where a time is one of many (C183 (2)): a list's item, a feed or a log of
// entries (sf-list, sf-list-timeline, sf-list-attention, sf-alert-bar,
// sf-list-feed).
// A table's cell is one of many too (C204, C183 (2) for tables): a column of
// fifty times is not fifty more stops.

const IN_LIST = 'li, [role="listitem"], [role="feed"], [role="log"], td, th, [role="cell"], [role="gridcell"], [role="rowheader"], [role="columnheader"]'; // The tooltips' ids, one per element on the page (stable across renders).

let sequence = 0;

const text = value => value === undefined || value === null ? '' : String(value).trim();
/** An ISO 8601 duration (PnW, PnDTnHnMnS) in milliseconds; null when it is not one. */


function durationMs(value) {
  const source = text(value);
  const match = DURATION.exec(source);
  if (!match || source === 'P' || source.endsWith('T')) return null;
  const [weeks, days, hours, minutes, seconds] = match.slice(1).map(part => Number(String(part ?? '0').replace(',', '.')));
  const ms = ((((weeks * 7 + days) * 24 + hours) * 60 + minutes) * 60 + seconds) * 1000;
  return Number.isFinite(ms) ? ms : null;
}
/** A moment: an ISO string, milliseconds (a number or digits) or a Date; null when it is none. */

function momentOf(value) {
  if (value instanceof Date) return (0,_core_js_format_date_js__WEBPACK_IMPORTED_MODULE_2__.toDate)(value);
  if (typeof value === 'number') return (0,_core_js_format_date_js__WEBPACK_IMPORTED_MODULE_2__.toDate)(value);
  const source = text(value);
  if (!source) return null;
  return (0,_core_js_format_date_js__WEBPACK_IMPORTED_MODULE_2__.toDate)(/^-?\d+$/u.test(source) ? Number(source) : source);
} // The words formatRelativeTime gives for a span, as a key: [unit, value].
// The same steps and rounding (format-relative.js), so the key changes
// exactly when the words do.
// Under a minute there are no seconds (owner decision C183 (1)): a moment
// that has just passed is «только что», one about to come the language's
// «сейчас»; neither changes until the minute.

const RELATIVE_STEPS = [['year', 31536000], ['month', 2592000], ['week', 604800], ['day', 86400], ['hour', 3600], ['minute', 60]];

function relativeKey(spanMs) {
  const seconds = Math.round(spanMs / 1000);

  for (const [unit, size] of RELATIVE_STEPS) {
    if (Math.abs(seconds) >= size) return `${unit}:${Math.round(seconds / size)}`;
  }

  return seconds > 0 ? 'soon' : 'just';
}
/**
 * Relative words for a moment from `now`: «только что» under a minute past
 * (`justNow`, the component's word; null where the page language has none,
 * and then the language's own «now»), the language's «now» under a minute
 * ahead, else formatRelativeTime's («5 минут назад», «через 20 минут»).
 */


function relativeWords(at, {
  now = new Date(),
  node = null,
  justNow = null
} = {}) {
  const moment = momentOf(at);
  const base = momentOf(now);
  if (!moment || !base) return '';
  const key = relativeKey(moment.getTime() - base.getTime());

  if (key === 'just' || key === 'soon') {
    const own = key === 'just' && typeof justNow === 'function' ? justNow() : justNow;
    if (key === 'just' && own) return String(own);
    return (0,_core_js_format_intl_js__WEBPACK_IMPORTED_MODULE_4__.intlFormatter)('RelativeTimeFormat', (0,_core_js_format_intl_js__WEBPACK_IMPORTED_MODULE_4__.formatLocale)({
      node
    }), {
      numeric: 'auto'
    }).format(0, 'second');
  }

  return (0,_core_js_format_relative_js__WEBPACK_IMPORTED_MODULE_3__.formatRelativeTime)(moment, {
    now: base,
    node
  });
}
/** The IANA name of a zone: `timeZone` when the platform knows it, else the reader's. */

function zoneId(timeZone = '') {
  if ((0,_core_js_format_date_js__WEBPACK_IMPORTED_MODULE_2__.knownTimeZone)(timeZone)) return String(timeZone).trim();

  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || '';
  } catch {
    return '';
  }
}
/** The language-file key of a zone's own name: zone-europe-moscow. */

const zoneWordKey = id => `zone-${String(id).toLowerCase().replace(/[/_]/gu, '-')}`;
/**
 * The zone a moment is written in, as its tooltip names it (owner decision
 * C183 (3)): the zone's name and its offset from UTC -- «Москва (UTC+3)»,
 * «Центральная Европа (UTC+1)», «Индия (UTC+5:30)»; only the offset where
 * there is no name («UTC»). The name is `name(id)` when it gives one (the
 * component's words for the zones of Russia: browsers carry no city names in
 * other languages, Chrome says «Moscow» on a Russian page), else the
 * platform's generic name in the page language (Intl, longGeneric).
 * `timeZone` is an IANA name; empty or unknown, the reader's own.
 */

function zoneLabel(at, {
  timeZone = '',
  node = null,
  name = null
} = {}) {
  const moment = momentOf(at);
  if (!moment) return '';
  const minutes = (0,_core_js_format_date_js__WEBPACK_IMPORTED_MODULE_2__.timeZoneOffset)(moment, {
    timeZone
  });
  const hours = Math.trunc(Math.abs(minutes) / 60);
  const rest = Math.abs(minutes) % 60;
  const offset = minutes === 0 ? 'UTC' : `UTC${minutes > 0 ? '+' : '\u2212'}${hours}${rest ? `:${String(rest).padStart(2, '0')}` : ''}`;
  let said = typeof name === 'function' ? name(zoneId(timeZone)) : null;

  if (!said) {
    try {
      const options = {
        timeZoneName: 'longGeneric',
        ...((0,_core_js_format_date_js__WEBPACK_IMPORTED_MODULE_2__.knownTimeZone)(timeZone) ? {
          timeZone
        } : {})
      };
      said = (0,_core_js_format_intl_js__WEBPACK_IMPORTED_MODULE_4__.intlFormatter)('DateTimeFormat', (0,_core_js_format_intl_js__WEBPACK_IMPORTED_MODULE_4__.formatLocale)({
        node
      }), options).formatToParts(moment).find(part => part.type === 'timeZoneName')?.value ?? '';
    } catch {
      said = '';
    }
  }

  return !said || /^(?:GMT|UTC)/u.test(said) ? offset : `${said} (${offset})`;
}
/**
 * Milliseconds from `now` until relative words for `at` change («1 минуту
 * назад» → «2 минуты назад» at 1 min 30 s, «59 секунд» → «1 минуту» at a
 * minute), looked for up to `limit`; `limit` when they do not change before.
 * Each set of words holds for one unbroken stretch of time, so the first
 * change is found by halving.
 */

function msUntilRelativeChange(at, now = Date.now(), limit = LONGEST_WAIT) {
  const moment = momentOf(at)?.getTime();
  const base = momentOf(now)?.getTime();
  if (!Number.isFinite(moment) || !Number.isFinite(base)) return limit;
  const key = relativeKey(moment - base);
  if (relativeKey(moment - base - limit) === key) return limit;
  let low = 0;
  let high = limit;

  while (high - low > 1) {
    const middle = Math.floor((low + high) / 2);
    if (relativeKey(moment - base - middle) === key) low = middle;else high = middle;
  }

  return high;
}

const joinWords = (said, day, time) => typeof said === 'function' ? said(day, time) : String(said ?? '{day}, {time}').replace(/\{(?:day|date)\}/u, day).replace('{time}', time);
/**
 * What the element says: {iso, shown, full, tip, relative, kind} for a
 * moment, or null. `node` gives the page language, `timeZone` (IANA) the
 * clock the moment is written on, the reader's own when empty. The words are
 * Intl's; `words.yesterdayAt` and `words.dateAt` only join a day and a time:
 * a pattern «{day}, {time}» or a function (day, time). A pattern without
 * {day} (a product's own «вчера в {time}») is used as it is.
 * `words.justNow` is the word under a minute past (C183 (1)). `tip` is the
 * full moment with its zone named (C183 (3)): «13 ноября 2026 г. в 19:40,
 * Москва (UTC+3)».
 */


function describeTime(value, {
  format = 'auto',
  now = new Date(),
  threshold = HOUR,
  node = null,
  words = {},
  timeZone = ''
} = {}) {
  const at = momentOf(value);
  if (!at) return null;
  const kind = FORMATS.includes(format) ? format : 'auto';
  const base = momentOf(now) ?? new Date();
  const zone = (0,_core_js_format_date_js__WEBPACK_IMPORTED_MODULE_2__.knownTimeZone)(timeZone) ? timeZone : '';

  const time = () => (0,_core_js_format_date_js__WEBPACK_IMPORTED_MODULE_2__.formatDate)(at, {
    date: null,
    time: 'short',
    timeZone: zone,
    node
  }); // One form of a date in every format (CT-10): the day and the long month,
  // the year when it is not this one.


  const dayAndMonth = () => (0,_core_js_format_date_js__WEBPACK_IMPORTED_MODULE_2__.formatDate)(at, {
    intl: {
      day: 'numeric',
      month: 'long',
      ...(at.getFullYear() === base.getFullYear() ? {} : {
        year: 'numeric'
      })
    },
    timeZone: zone,
    node
  });

  const full = (0,_core_js_format_date_js__WEBPACK_IMPORTED_MODULE_2__.formatDate)(at, {
    date: 'long',
    time: 'short',
    timeZone: zone,
    node
  });

  const relativeNow = () => relativeWords(at, {
    now: base,
    node,
    justNow: words.justNow
  });

  let shown;
  let relative = false;
  if (kind === 'time') shown = time();else if (kind === 'date') shown = dayAndMonth();else if (kind === 'datetime') shown = full;else if (kind === 'relative') {
    shown = relativeNow();
    relative = true;
  } else if (Math.abs(base.getTime() - at.getTime()) < threshold) {
    shown = relativeNow();
    relative = true;
  } else {
    const day = (0,_core_js_format_date_js__WEBPACK_IMPORTED_MODULE_2__.calendarDayOffset)(at, {
      now: base,
      timeZone: zone
    });
    const ahead = at.getTime() > base.getTime(); // The future mirrors the past (owner decision C183 (4)): later today is
    // «сегодня, 14:00» (the past of today stays «09:05»), tomorrow «завтра,
    // 10:00», then the date and the time. «сегодня», «завтра» and «вчера» are
    // the language's own (Intl.RelativeTimeFormat, numeric auto): «gestern»,
    // «morgen», «أمس» (CT-9).

    const relativeDay = () => (0,_core_js_format_relative_js__WEBPACK_IMPORTED_MODULE_3__.formatRelativeDay)(at, {
      now: base,
      weekday: false,
      timeZone: zone,
      node
    });

    if (day === 0) shown = ahead ? joinWords(words.dateAt, relativeDay(), time()) : time();else if (day === -1) shown = joinWords(words.yesterdayAt, relativeDay(), time());else if (day === 1) shown = joinWords(words.dateAt, relativeDay(), time()); // A later day keeps its time: «17 ноября, 10:00» (CT-11).
    else if (day > 1) shown = joinWords(words.dateAt, dayAndMonth(), time());else shown = dayAndMonth();
  }
  const where = zoneLabel(at, {
    timeZone: zone,
    node,
    name: words.zoneName
  });
  return {
    iso: at.toISOString(),
    shown,
    full,
    tip: where ? `${full}, ${where}` : full,
    relative,
    kind
  };
} // One timer for every sf-time on the page (CT-5): each element says when its
// words change next (due), and the clock wakes once, at the earliest. While
// the page is hidden it does not run at all; when it shows again every
// element draws once with the clock as it is.

const clock = {
  elements: new Set(),
  timer: 0,
  pending: false,
  listening: false,
  hidden: () => globalThis.document?.visibilityState === 'hidden',

  watch(element) {
    this.elements.add(element);

    if (!this.listening && globalThis.document?.addEventListener) {
      this.listening = true;
      globalThis.document.addEventListener('visibilitychange', () => this.onVisibility());
    }

    this.schedule();
  },

  forget(element) {
    if (this.elements.delete(element)) this.schedule();
  },

  // Many elements say their due in one task (a list drawn at once): the
  // timer is set once, after them.
  schedule() {
    if (this.pending) return;
    this.pending = true;
    queueMicrotask(() => {
      this.pending = false;
      this.arm();
    });
  },

  arm() {
    if (this.timer) clearTimeout(this.timer);
    this.timer = 0;
    if (this.hidden()) return;
    let next = Infinity;

    for (const element of this.elements) next = Math.min(next, element._due);

    if (!Number.isFinite(next)) return;
    this.timer = setTimeout(() => this.tick(), Math.min(Math.max(0, next - Date.now()), LONGEST_WAIT));
  },

  tick() {
    this.timer = 0;
    if (this.hidden()) return;
    const now = Date.now();

    for (const element of this.elements) {
      if (element._due <= now) {
        element._due = Infinity;
        element.requestComponentUpdate('time');
      }
    }

    this.arm();
  },

  onVisibility() {
    if (this.hidden()) {
      if (this.timer) clearTimeout(this.timer);
      this.timer = 0;
      return;
    }

    for (const element of this.elements) {
      element._due = Infinity;
      element.requestComponentUpdate('time');
    }

    this.arm();
  }

};
/** Milliseconds until the words of a said moment change, with the reader's clock; Infinity when they never do. */

function msUntilWordsChange(said, {
  now = Date.now(),
  threshold = HOUR,
  timeZone = ''
} = {}) {
  if (!said || said.kind !== 'auto' && said.kind !== 'relative') return Infinity;
  const at = Date.parse(said.iso);
  const base = momentOf(now)?.getTime() ?? Date.now();
  if (said.kind === 'relative') return msUntilRelativeChange(at, base);
  const midnight = (0,_core_js_format_date_js__WEBPACK_IMPORTED_MODULE_2__.msUntilNextDay)(new Date(base), {
    timeZone
  }) + 1000;

  if (said.relative) {
    // Past moments leave the relative words at the threshold; a coming one
    // stays relative until it is past by the threshold.
    const leaves = at + threshold - base;
    return Math.min(msUntilRelativeChange(at, base, Math.max(1, Math.min(leaves, LONGEST_WAIT))), Math.max(1, leaves), midnight);
  } // A coming moment becomes relative when it is the threshold away.


  const enters = at - threshold - base;
  return enters > 0 ? Math.min(enters, midnight) : midnight;
}
const TimeElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_7__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: _lang_index_mjs__WEBPACK_IMPORTED_MODULE_8__.files,
  source: 'ru'
});

class SfTime extends TimeElement {
  // The host's own text is the server's first paint (CT-7): it stands until
  // the first render, which replaces it in the same task.
  static clearLightDomBeforeFirstRender = true;

  constructor() {
    super();
    this._uid = `sf-time-${++sequence}`;
    this._due = Infinity;
  }

  onConnected() {
    super.onConnected?.();
    this.syncTimer();
  }

  onDisconnected() {
    super.onDisconnected?.();
    this.stopTimer();
  } // The moment auto and relative count from: the page's now, else the clock.


  get moment() {
    return momentOf(this.now) ?? new Date();
  }

  get thresholdMs() {
    return durationMs(this.threshold) ?? HOUR;
  } // The zone the moment is written on (C183 (3)): the time-zone setting when
  // the platform knows it, else the reader's own.


  get zone() {
    return (0,_core_js_format_date_js__WEBPACK_IMPORTED_MODULE_2__.knownTimeZone)(this.timeZone) ? String(this.timeZone).trim() : '';
  } // «только что» is the component's word, in the languages it has words for
  // (its files and what a product registered); another page language says its
  // own «now» (Intl) rather than a Russian or an English word.


  justNow() {
    const wanted = (0,_core_js_format_intl_js__WEBPACK_IMPORTED_MODULE_4__.formatLocale)({
      node: this
    }).toLowerCase();
    const known = ['ru', 'en', ..._core_js_page_language_js__WEBPACK_IMPORTED_MODULE_5__.language.known('sf-time')]; // A registry alias counts as its pack's language (zh-cn: zh-hans, pt: pt-br).

    const pack = code => globalThis.__sfPageLanguage?.packs?.aliases?.[code] ?? code;

    const base = wanted.split('-')[0];
    const has = [wanted, pack(wanted), base, pack(base)].some(code => known.includes(code));
    return has ? this.sfWord('just-now') : null;
  } // A zone's own name where the component has one in the page language: the
  // zones of Russia in its files (ru, en) and in any language a pack or a
  // product gave words for, else null and the platform names it. Until
  // 1.7.1 only ru and en were read, and a pack's zone words were never said.


  zoneName(id) {
    if (!id) return null;
    const key = zoneWordKey(id);
    const wanted = (0,_core_js_format_intl_js__WEBPACK_IMPORTED_MODULE_4__.formatLocale)({
      node: this
    }).toLowerCase().replace('_', '-');
    const registered = globalThis.__sfPageLanguage?.registered?.get?.('sf-time'); // A registry alias takes its pack's words (zh-cn: zh-hans, pt: pt-br).

    const pack = code => globalThis.__sfPageLanguage?.packs?.aliases?.[code] ?? code;

    const base = wanted.split('-')[0];

    for (const code of [...new Set([wanted, pack(wanted), base, pack(base)])]) {
      const own = registered?.get?.(code)?.[key] ?? _lang_index_mjs__WEBPACK_IMPORTED_MODULE_8__.files[code]?.runtime?.[key];
      if (typeof own === 'string' && own.trim()) return this.sfWord(key);
    }

    return null;
  }

  describe() {
    return describeTime(this.datetime, {
      format: this.format,
      now: this.moment,
      threshold: this.thresholdMs,
      node: this,
      timeZone: this.zone,
      words: {
        yesterdayAt: (day, time) => this.sfWord('yesterday-at', {
          vars: {
            day,
            time
          }
        }),
        dateAt: (date, time) => this.sfWord('date-at', {
          vars: {
            date,
            time
          }
        }),
        justNow: () => this.justNow(),
        zoneName: id => this.zoneName(id)
      }
    });
  } // With the reader's clock, what moves says when it changes next and the
  // page's one clock wakes it then: relative words when they round to new
  // ones, auto also at its threshold and at the reader's midnight. Nothing
  // for time, date and datetime, with a fixed now, or off the page.


  syncTimer(said = this._said) {
    if (!this.isConnected || momentOf(this.now) || !said) {
      this.stopTimer();
      return;
    }

    const wait = msUntilWordsChange(said, {
      threshold: this.thresholdMs,
      timeZone: this.zone
    });

    if (!Number.isFinite(wait)) {
      this.stopTimer();
      return;
    }

    this._due = Date.now() + wait + MARGIN;
    clock.watch(this);
  }

  stopTimer() {
    this._due = Infinity;
    clock.forget(this);
  }

  templateContext() {
    const said = this.describe();
    this._said = said;
    this.sfHostState('data-empty', !said);
    this.sfHostState('data-relative', Boolean(said?.relative)); // hasTip, not tooltip: the tooltip prop keeps its own value (auto) in the context.

    const hasTip = Boolean(said) && this.tooltip !== 'none' && said.kind !== 'datetime';
    const nested = Boolean(this.parentElement?.closest?.('a[href], button, summary, [role="button"], [role="link"]')); // In a list or a feed the time is no Tab stop (owner decision C183 (2)):
    // fifty rows are not fifty more stops. The row's own text carries the
    // exact moment (a visually hidden line), the tooltip still shows on
    // hover. A time that stands alone stays a stop.

    const inList = Boolean(this.parentElement?.closest?.(IN_LIST));
    return this.createTemplateContext({ ...this.getPropsContext(),
      component: this,
      said,
      hasTip,
      focusable: hasTip && !nested && !inList,
      spoken: hasTip && (nested || inList),
      tipId: `${this._uid}-tip`,
      rootClass: this.getRootClass()
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_6__.renderTimeTemplate)(this.templateContext());
  }

  afterRender() {
    super.afterRender?.();
    this.syncTimer();
  }

}

SfTime.define('sf-time');

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "33668afeb99d"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderTimeTemplate: () => (/* binding */ renderTimeTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
 // sf-time's markup (scss/ draws it).
//
// - A time element: datetime the exact moment (ISO), its text the words the
//   format gives. Nothing for a value that is no date.
// - With a tooltip: the Framework's tooltip composition -- an anchor holding
//   the time element (the trigger, data-tooltip naming the surface) and the
//   surface, the dark tooltip without a tail: it opens below the time and
//   flips above at the window's bottom edge, one size whatever the density
//   (owner decision C160 (3), (4); C59: no arrow by default). The tooltip
//   controller (component.tooltip) links them: hover and
//   keyboard focus show it, Escape and a press hide it, aria-describedby
//   names it. The surface is hidden in the markup and only the controller
//   shows it, so a redraw never fights it.
// - The time element is a Tab stop only with a tooltip, outside a link or a
//   button and outside a list or a feed (index.js focusable; owner decision
//   C183 (2)). Where it is no stop, the full moment with its zone is a
//   visually hidden line after it (spoken), so the row's text carries it.
// - The tooltip names the zone: «13 ноября 2026 г. в 19:40, Москва (UTC+3)»
//   (said.tip, C183 (3)).

function renderTimeTemplate(context) {
  const {
    said
  } = context;
  if (!said) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const classes = ['sf-time', said.relative ? 'sf-time--relative' : '', context.rootClass].filter(Boolean).join(' ');

  if (!context.hasTip) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<time class=${classes} datetime=${said.iso}>${said.shown}</time>`;
  }

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-time-anchor sf-tooltip-anchor"><time class=${classes} datetime=${said.iso}
      tabindex=${context.focusable ? '0' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing} data-tooltip=${context.tipId}>${said.shown}</time><span
      class="sf-tooltip sf-tooltip--dark sf-tooltip--size-1/3 sf-time-tooltip"
      id=${context.tipId} hidden><span class="sf-tooltip-content"><span class="sf-tooltip-text">${said.tip}</span></span></span>${context.spoken ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sr-only">, ${said.tip}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}</span>`;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "a0991f4f93d4"
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

/***/ "fb9cc1c3591e"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   files: () => (/* binding */ files)
/* harmony export */ });
/* harmony import */ var _en_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d3960b774f21");
// Written by scripts/build-language-packs.mjs from src/core/lang/built-in.json
// (owner decision C282); do not edit. The words this bundle carries: the
// built-in languages' (en); every other language comes from
// a language file (core/lang/<code>.js or its parts).


const files = { en: { runtime: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime } };

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ en: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime });


/***/ },

/***/ "b033fb83f193"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.time","tag":"sf-time","version":"1.8.4","kind":"leaf","settings":{"datetime":{"type":"string","default":""},"format":{"type":"enum","values":["auto","time","date","datetime","relative"],"default":"auto"},"now":{"type":"string","default":""},"threshold":{"type":"string","default":"PT1H"},"time-zone":{"type":"string","default":""},"tooltip":{"type":"enum","values":["auto","none"],"default":"auto"}},"values":{},"events":{},"actions":{},"host-states":{"data-empty":"boolean","data-relative":"boolean"},"css-variables":{"--sf-time-color":{"type":"color","state":"default"},"--sf-time-focus-ring-color":{"type":"color","state":"default"},"--sf-time-radius":{"type":"length","state":"default"},"--sf-time-font-variant-numeric":{"type":"keyword","state":"default"},"--sf-time-white-space":{"type":"keyword","state":"default"}}}');

/***/ },

/***/ "d3960b774f21"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Time","runtime":{"date-at":"{date}, {time}","just-now":"just now","yesterday-at":"{day}, {time}","zone-asia-anadyr":"Anadyr","zone-asia-barnaul":"Barnaul","zone-asia-chita":"Chita","zone-asia-irkutsk":"Irkutsk","zone-asia-kamchatka":"Petropavlovsk-Kamchatsky","zone-asia-khandyga":"Khandyga","zone-asia-krasnoyarsk":"Krasnoyarsk","zone-asia-magadan":"Magadan","zone-asia-novokuznetsk":"Novokuznetsk","zone-asia-novosibirsk":"Novosibirsk","zone-asia-omsk":"Omsk","zone-asia-sakhalin":"Sakhalin","zone-asia-srednekolymsk":"Srednekolymsk","zone-asia-tomsk":"Tomsk","zone-asia-ust-nera":"Ust-Nera","zone-asia-vladivostok":"Vladivostok","zone-asia-yakutsk":"Yakutsk","zone-asia-yekaterinburg":"Yekaterinburg","zone-europe-astrakhan":"Astrakhan","zone-europe-kaliningrad":"Kaliningrad","zone-europe-kirov":"Kirov","zone-europe-moscow":"Moscow","zone-europe-samara":"Samara","zone-europe-saratov":"Saratov","zone-europe-ulyanovsk":"Ulyanovsk","zone-europe-volgograd":"Volgograd"}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("1cc7452687fa");
/******/
/******/ })()
;