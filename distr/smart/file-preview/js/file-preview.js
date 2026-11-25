/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "f3cba14ced8a"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FILE_KINDS: () => (/* binding */ FILE_KINDS),
/* harmony export */   fileKind: () => (/* binding */ fileKind),
/* harmony export */   fileKindIcon: () => (/* binding */ fileKindIcon),
/* harmony export */   fileKindOfName: () => (/* binding */ fileKindOfName),
/* harmony export */   fileType: () => (/* binding */ fileType)
/* harmony export */ });
/* harmony import */ var _file_types_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("9bbeb11fb966");
// The type of an entry -- a file, a page, a folder -- and its icon, from one
// map (file-types.json; owner decision C102, 2026-11-12). Who chooses the icon,
// first word wins:
//
//   icon        a name the host gives (or false: no icon)
//   kind        one of the twelve words of the map (page, image, code, ...)
//   extension   of the name, when names say their type (file-types="name")
//   place       a folder (it has children, or kind="folder"), else a file
//
// No top-level side effects: a bundle that imports one function carries the
// map and nothing else. sf-tree draws its rows with it; sf-file-upload,
// sf-file-download and sf-view's file cells are to follow (C102 item 2).

const KINDS = _file_types_json__WEBPACK_IMPORTED_MODULE_0__.kinds;
/** The twelve kinds, in the map's order. */

const FILE_KINDS = /* @__PURE__ */Object.freeze(Object.keys(KINDS));

const BY_EXTENSION = /* @__PURE__ */(() => {
  const found = new Map();

  for (const [kind, spec] of Object.entries(KINDS)) for (const extension of spec.extensions ?? []) found.set(extension, kind);

  return found;
})();
/** A word of the map, or '' for anything else (an old or unknown word). */


function fileKind(word) {
  const kind = String(word ?? '').trim().toLowerCase();
  return Object.hasOwn(KINDS, kind) ? kind : '';
}
/** The kind a name's extension says («Смета.xlsx» → table), or ''. */

function fileKindOfName(name) {
  const found = /\.([a-z0-9]+)$/iu.exec(String(name ?? '').trim());
  return found ? BY_EXTENSION.get(found[1].toLowerCase()) ?? '' : '';
}
/** The icon of a kind; a folder open shows its open icon. */

function fileKindIcon(kind, {
  open = false
} = {}) {
  const spec = KINDS[fileKind(kind)];
  if (!spec) return KINDS.file.icon;
  return open && spec['open-icon'] ? spec['open-icon'] : spec.icon;
}
/**
 * The kind an entry is shown as and its icon.
 *
 *   fileType({icon, kind, name, folder, open, byName})
 *     icon     a name, or false for none ('' / true: choose)
 *     kind     a word of the map, or ''
 *     name     the entry's name, read for its extension when byName
 *     folder   the entry has children (or says it will have them)
 *     open     a folder that is open
 *     byName   the extension may say the kind (default true)
 *   → {kind, icon}   icon '' when the host said false
 */

function fileType({
  icon,
  kind,
  name,
  folder = false,
  open = false,
  byName = true
} = {}) {
  let shown = fileKind(kind); // A folder is a folder by its place; file is the word for "some file", which
  // the name may say more about.

  if (!shown || shown === 'file') {
    if (folder && !shown) shown = 'folder';else shown = byName && fileKindOfName(name) || shown || 'file';
  }

  if (icon === false || icon === 'false') return {
    kind: shown,
    icon: ''
  };
  if (typeof icon === 'string' && icon.trim() && icon !== 'true') return {
    kind: shown,
    icon: icon.trim()
  };
  return {
    kind: shown,
    icon: fileKindIcon(shown, {
      open
    })
  };
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
// (core/js/lang/file-size, localization study LC-3): English ships in the
// bundle; Russian and any other language take the words their language file
// or a product registers for `sf-file-size` (owner decision C282;
// SF.language.register('sf-file-size', 'de', {b, kb, mb, gb})), else the
// English words with its own digits. A component with words of its own passes
// them as `units`. The registry is read from the shared global the page
// language keeps (core/js/page-language.js), so this module still runs
// nothing on load.


const UNIT_KEYS = /* @__PURE__ */Object.freeze(['b', 'kb', 'mb', 'gb']);

function unitsOf(words) {
  return Object.freeze(UNIT_KEYS.map(key => words[key]));
}

function registeredUnits(code) {
  const words = globalThis.__sfPageLanguage?.registered?.get?.('sf-file-size')?.get?.(code);
  return words && UNIT_KEYS.every(key => typeof words[key] === 'string') ? unitsOf(words) : null;
} // The built-in languages' units (English; owner decision C282), and `ru` as
// before for a reader of SF.format.FILE_SIZE_UNITS.ru: the units the ru
// language file registered, null until it is on the page.


function unitTable(words) {
  const table = {};

  for (const [code, own] of Object.entries(words)) table[code] = unitsOf(own);

  if (!table.ru) Object.defineProperty(table, 'ru', {
    enumerable: true,
    get: () => registeredUnits('ru')
  });
  return Object.freeze(table);
}

const FILE_SIZE_UNITS = /* @__PURE__ */unitTable(_lang_file_size_index_mjs__WEBPACK_IMPORTED_MODULE_1__["default"]);
/** The unit words for a locale: registered for it, its own, its language's, else English. */

function fileSizeUnits(locale = 'en') {
  const wanted = String(locale || 'en').trim().toLowerCase().replace('_', '-'); // A registry alias takes its pack's words (zh-cn: zh-hans, pt: pt-br;
  // core/lang/index.json aliases, kept on the shared store by core).

  const pack = code => globalThis.__sfPageLanguage?.packs?.aliases?.[code] ?? code;

  const base = wanted.split('-')[0];

  for (const code of [...new Set([wanted, pack(wanted), base, pack(base)])]) {
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

/***/ "781dfa6013bf"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _core_js_deprecations__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("d3818183b14c");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("d4eb2cc82833");
/* harmony import */ var _core_js_file_types_index_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("f3cba14ced8a");
/* harmony import */ var _core_js_composition_file_size_mjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("fb0bdf7719f0");
/* harmony import */ var _core_js_format_intl_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("15b4e93ff6ed");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("f3f4ec5c87ca");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("49343ffee6b1");
/* harmony import */ var _lang_index_mjs__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("c9af6094a160");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_deprecations__WEBPACK_IMPORTED_MODULE_2__, _js_templates_default__WEBPACK_IMPORTED_MODULE_3__, _core_js_composition_file_size_mjs__WEBPACK_IMPORTED_MODULE_5__, _core_js_format_intl_js__WEBPACK_IMPORTED_MODULE_6__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_deprecations__WEBPACK_IMPORTED_MODULE_2__, _js_templates_default__WEBPACK_IMPORTED_MODULE_3__, _core_js_composition_file_size_mjs__WEBPACK_IMPORTED_MODULE_5__, _core_js_format_intl_js__WEBPACK_IMPORTED_MODULE_6__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_deprecations__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_core_js_deprecations__WEBPACK_IMPORTED_MODULE_2__);









 // Only the words on screen ship in the bundle, English only (owner decision
// C282): Russian and every other language come from a language file. The
// title, settings and events stay in the language files for the Studio and the
// docs (localization study LC-2).
// sf-file-preview from its component.json (standard simai.smart-component
// 1.3.8 §3, §4, §8; vocabulary 1.1.5 §5 download and detach): its settings
// are attributes and properties made by core/js/element-manifest.js, its words
// are lang/<locale>.json (a product adds a language through
// SF.language.register("sf-file-preview", code, words)), and the old names --
// name, size, type, sf-file-preview:download, sf-file-preview:remove, open,
// setOpen(), toggleOpen() -- are dated rows of aliases.json.

const FilePreviewElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_7__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: _lang_index_mjs__WEBPACK_IMPORTED_MODULE_9__.files,
  source: 'ru',
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_8__
});
const IMAGE_EXTENSION = /\.(?:avif|bmp|gif|jpe?g|png|svg|webp)(?:[?#].*)?$/i;
const VIDEO_EXTENSION = /\.(?:mp4|m4v|webm|ogv|mov)(?:[?#].*)?$/i;
const PDF_EXTENSION = /\.pdf(?:[?#].*)?$/i;
const STATES = ['ready', 'uploading', 'error'];
const VIEWS = ['row', 'chip', 'tile']; // The kinds the page's viewer shows in place (C149 (5), (6)): the rest download.

const VIEWABLE = new Set(['image', 'video', 'pdf']); // The tail a cut name always keeps (C149 (2)): the extension and the end of
// the name before it.

const KEPT_TAIL = 10; // The joints a name breaks after (C34), as nameParts in the template.

const JOINT = /(?<=[_\-–—/+])/u; // The media type a name's extension says, for the formats the core's file
// icons tell apart (core/js/composition/file-size.mjs FILE_ICONS, the icons
// sf-file-upload's rows draw): PDF, a sheet and slides each get their own
// glyph (C81: «значок с типом у остальных»). Other names take the kind of the
// file-type map (core/js/file-types, C102): code, data, image, video, audio.

const EXTENSION_MEDIA = Object.freeze({
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  odt: 'application/vnd.oasis.opendocument.text',
  rtf: 'application/rtf',
  txt: 'text/plain',
  md: 'text/markdown',
  csv: 'text/csv',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ods: 'application/vnd.oasis.opendocument.spreadsheet',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  odp: 'application/vnd.oasis.opendocument.presentation',
  zip: 'application/zip',
  rar: 'application/vnd.rar',
  '7z': 'application/x-7z-compressed',
  tar: 'application/x-tar',
  gz: 'application/gzip'
});
const SIZE_STEPS = ['byte', 'kilobyte', 'megabyte', 'gigabyte']; // What retires without a new name (aliases.json rows with `to: null`): kept
// until the date, and each call is noted with it.

function noteRetired(from) {
  (0,_core_js_deprecations__WEBPACK_IMPORTED_MODULE_2__.noteDeprecated)({
    component: 'sf-file-preview',
    tag: 'sf-file-preview',
    kind: 'action',
    from,
    to: null,
    since: _aliases_json__WEBPACK_IMPORTED_MODULE_8__.since,
    remove_after: _aliases_json__WEBPACK_IMPORTED_MODULE_8__.remove_after
  });
}

class SfFilePreview extends FilePreviewElement {
  static get props() {
    return { ...super.props,
      // The axis is called kind, because that is the question it answers.
      // `type` keeps working: see contracts/public-api-axes.json.
      kind: {
        default: 'auto',
        values: ['auto', 'icon', 'image'],
        aliases: ['type'],
        valueAliases: {
          auto: ['default']
        }
      }
    };
  }

  get componentName() {
    return 'file-preview';
  }

  shouldClearLightDomBeforeFirstRender() {
    return super.shouldClearLightDomBeforeFirstRender() || !!this.querySelector(':scope > .sf-file-preview[data-render-managed="1"]');
  }

  get kind() {
    return this.getProp('kind');
  }

  set kind(value) {
    if (value === null || value === undefined || value === '') this.removeAttribute('kind');else this.setAttribute('kind', String(value));
  } // The group's name (§3.1, §4.8): the host's aria-label, else the file name.


  get accessibleName() {
    return this.getAttribute('aria-label') || this.fileName || this.sfWord('aria-label');
  }

  get extension() {
    const match = /\.([a-z0-9]{1,5})$/iu.exec(String(this.fileName || '').trim());
    return match ? match[1].toUpperCase() : '';
  } // The glyph of the file's type (C81, C51): the host's icon when it names one,
  // else the media type's, else the name's extension's, else the default.


  get typeIcon() {
    if (this.hasAttribute('icon') && this.icon) return this.icon;
    const byMedia = (0,_core_js_composition_file_size_mjs__WEBPACK_IMPORTED_MODULE_5__.fileIcon)(String(this.mimeType || '').toLowerCase());
    if (byMedia !== 'download') return byMedia;
    const byExtension = (0,_core_js_composition_file_size_mjs__WEBPACK_IMPORTED_MODULE_5__.fileIcon)(EXTENSION_MEDIA[this.extension.toLowerCase()] || '');
    if (byExtension !== 'download') return byExtension;
    const {
      kind,
      icon
    } = (0,_core_js_file_types_index_js__WEBPACK_IMPORTED_MODULE_4__.fileType)({
      name: this.fileName
    });
    return kind !== 'file' && icon ? icon : this.icon;
  } // The state of the file (C81, the upload core's rows): ready, uploading or
  // error; anything else reads as ready.


  get shownState() {
    const state = String(this.getAttribute('state') || '').trim().toLowerCase();
    return STATES.includes(state) ? state : 'ready';
  } // The upload's share, per cent (0 to 100), or null: not known yet.


  get shownProgress() {
    const raw = this.getAttribute('value');
    if (raw === null || String(raw).trim() === '') return null;
    const value = Number(raw);
    return Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : null;
  } // A size in bytes («2457600») is drawn in the page's units («2,3 МБ», C25,
  // core formatFileSize); a size the host wrote as text stays as written.


  get bytes() {
    const raw = this.fileSize;
    if (typeof raw === 'number') return Number.isFinite(raw) && raw >= 0 ? raw : null;
    return /^\s*\d+\s*$/u.test(String(raw ?? '')) ? Number(raw) : null;
  }

  get shownSize() {
    const bytes = this.bytes;
    return bytes === null ? String(this.fileSize ?? '').trim() : (0,_core_js_composition_file_size_mjs__WEBPACK_IMPORTED_MODULE_5__.formatFileSize)(bytes, {
      node: this
    });
  } // The size as it is said (C51: the unit as a word): «2,3 мегабайта».


  get spokenSize() {
    const bytes = this.bytes;
    if (bytes === null) return this.shownSize;
    let amount = bytes;
    let index = 0;

    while (amount >= 1024 && index < SIZE_STEPS.length - 1) {
      amount /= 1024;
      index += 1;
    }

    const digits = index === 0 || amount >= 10 ? 0 : 1;

    try {
      return (0,_core_js_format_intl_js__WEBPACK_IMPORTED_MODULE_6__.intlFormatter)('NumberFormat', (0,_core_js_format_intl_js__WEBPACK_IMPORTED_MODULE_6__.formatLocale)({
        node: this
      }), {
        style: 'unit',
        unit: SIZE_STEPS[index],
        unitDisplay: 'long',
        maximumFractionDigits: digits
      }).format(amount);
    } catch {
      return this.shownSize;
    }
  } // What a screen reader hears after the name (C51, C149 (7)): «, PDF,
  // 2,3 мегабайта, 12 ноября».


  get said() {
    const ready = this.shownState === 'ready';
    const parts = [this.extension, ready ? this.spokenSize : '', ready ? this.dateText('long') : ''].filter(Boolean);
    return parts.length ? `, ${parts.join(', ')}` : '';
  }

  get isImage() {
    return this.fileKind === 'image';
  } // The file's kind for the viewer and the picture (C149 (4), (5)): image,
  // video, pdf or file, from kind, the media type, then the name's or the
  // address's extension. A picture the host gave (image-url) does not make a
  // PDF an image: it is the PDF's first page.


  get fileKind() {
    if (this.kind === 'image') return 'image';
    const mime = String(this.mimeType || '').toLowerCase();
    if (mime.startsWith('image/')) return 'image';
    if (mime.startsWith('video/')) return 'video';
    if (mime === 'application/pdf') return 'pdf';
    if (mime) return 'file';
    const named = String(this.fileName || '');
    const address = String(this.href || '').split(/[?#]/u)[0];

    for (const text of [named, address]) {
      if (IMAGE_EXTENSION.test(text)) return 'image';
      if (VIDEO_EXTENSION.test(text)) return 'video';
      if (PDF_EXTENSION.test(text)) return 'pdf';
    }

    return 'file';
  } // The picture in the holder (C149 (4)): the one the host gave, for any file;
  // an image's own address when it gave none. kind="icon" draws the glyph.


  get picture() {
    if (this.kind === 'icon') return '';
    if (this.imageUrl) return this.imageUrl;
    return this.fileKind === 'image' ? this.href || '' : '';
  } // Opens in the page's viewer (C149 (5)): a picture, a PDF or a video that
  // is there.


  get viewable() {
    return VIEWABLE.has(this.fileKind) && Boolean(this.viewSource) && this.shownState === 'ready' && !this.disabled;
  }

  get viewSource() {
    return this.href || (this.fileKind === 'image' ? this.imageUrl : '') || '';
  }

  get shownView() {
    const view = String(this.getAttribute('appearance') || '').trim().toLowerCase();
    return VIEWS.includes(view) ? view : 'row';
  } // The date under the name (C149 (7)): «12 нояб.», with the year when it is
  // not this year; nothing when the page gives none or it is not a date.


  get fileMoment() {
    const raw = this.fileDate;
    if (raw === null || raw === undefined || String(raw).trim() === '') return null;
    return (0,_core_js_format_intl_js__WEBPACK_IMPORTED_MODULE_6__.toDate)(raw);
  }

  dateText(month) {
    const moment = this.fileMoment;
    if (!moment) return '';
    const options = {
      day: 'numeric',
      month
    };
    if (moment.getFullYear() !== new Date().getFullYear()) options.year = 'numeric';

    try {
      return (0,_core_js_format_intl_js__WEBPACK_IMPORTED_MODULE_6__.intlFormatter)('DateTimeFormat', (0,_core_js_format_intl_js__WEBPACK_IMPORTED_MODULE_6__.formatLocale)({
        node: this
      }), options).format(moment);
    } catch {
      return '';
    }
  }

  get shownDate() {
    return this.dateText('short');
  } // A video's length (C149 (4)): seconds (84) drawn as 1:24, text as written.


  get shownDuration() {
    const raw = String(this.duration ?? '').trim();
    if (!raw) return '';
    if (!/^\d+(?:\.\d+)?$/u.test(raw)) return raw;
    const total = Math.round(Number(raw));
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor(total % 3600 / 60);
    const seconds = String(total % 60).padStart(2, '0');
    return hours ? `${hours}:${String(minutes).padStart(2, '0')}:${seconds}` : `${minutes}:${seconds}`;
  } // Under the name (C149 (7)): the type, the size and the date when the page
  // gives it, «PDF · 2,4 МБ · 12 нояб.»; a chip keeps type and size.


  get meta() {
    const parts = [this.extension, this.shownSize];
    if (this.shownView !== 'chip') parts.push(this.shownDate);
    return parts.filter(Boolean).join(' · ');
  }

  templateContext() {
    const props = this.getPropsContext();
    const name = this.fileName;
    const state = this.shownState;
    const errorText = String(this.getAttribute('error-text') || '').trim();
    const view = this.shownView;
    const stored = Boolean(this.stored);
    return this.createTemplateContext({ ...props,
      component: this,
      fileName: name,
      fileId: String(this.fileId ?? ''),
      fileSize: this.shownSize,
      fileKind: this.fileKind,
      view,
      lines: view === 'row' ? 2 : 1,
      meta: this.meta,
      duration: this.shownDuration,
      picture: this.picture,
      viewable: this.viewable,
      stored,
      asking: Boolean(this._asking) && stored,
      said: this.said,
      state,
      progress: this.shownProgress,
      // The name is a link to the file while the file is there (C51).
      linked: Boolean(this.href) && state === 'ready' && !this.disabled,
      icon: this.typeIcon,
      href: this.href,
      type: this.kind,
      mimeType: this.mimeType,
      imageUrl: this.imageUrl,
      isImage: this.isImage,
      compact: this.compact,
      extension: this.extension,
      surface: this.surface,
      download: this.download,
      target: this.target,
      actions: this.actions,
      downloadAction: this.downloadAction,
      removeAction: this.removeAction,
      disabled: this.disabled,
      ariaLabel: this.accessibleName,
      // The reason of a failure is said by role alert (defects-d12), unless
      // the host says it itself (data-said-by="host": an upload list says
      // «<имя> не загрузился» in its own status line, and the reader would
      // hear it twice).
      announced: this.getAttribute('data-said-by') !== 'host',
      // «Скачать <имя>», «Убрать <имя>» or, for a stored file, «Удалить <имя>»
      // (C51, C149 (8)): a page's own label is kept.
      downloadLabel: this.getAttribute('download-label') || this.sfWord('download-label', {
        vars: {
          name
        }
      }),
      removeLabel: this.getAttribute('remove-label') || this.sfWord(stored ? 'delete-label' : 'remove-label', {
        vars: {
          name
        }
      }),
      words: {
        uploading: this.sfWord('uploading-label', {
          vars: {
            name
          }
        }),
        failed: errorText ? this.sfWord('error-line', {
          vars: {
            message: errorText
          }
        }) : this.sfWord('error-text'),
        retry: this.sfWord('retry-text'),
        retryLabel: this.sfWord('retry-label', {
          vars: {
            name
          }
        }),
        deleteQuestion: this.sfWord('delete-question', {
          vars: {
            name
          }
        }),
        deleteText: this.sfWord('delete-text')
      },
      onOpen: event => this.handleOpen(event),
      onDownload: event => this.handleDownload(event),
      onRemove: event => this.handleRemove(event),
      onRetry: event => this.handleRetry(event),
      onAnswer: event => this.handleAnswer(event)
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_3__.renderFilePreviewTemplate)(this.templateContext());
  } // The file as data (§8): what download and detach carry in `value`.


  get data() {
    return this.getValue();
  }

  getValue() {
    return {
      fileName: this.fileName,
      fileSize: this.fileSize,
      icon: this.icon,
      href: this.href,
      kind: this.kind,
      // The field's former name, until 2027-01-01 (docs precheck smart content
      // FP-05; journal event-file-preview-value-type-to-kind): the same value.
      type: this.kind,
      mimeType: this.mimeType,
      imageUrl: this.imageUrl,
      target: this.target
    };
  } // The file's id in a detail (vocabulary §5 {id}): the host's id, else its
  // address, else its name.


  get fileId() {
    return this.id || this.href || this.fileName;
  } // §4.4 and compatibility.deprecations: open did nothing since 1.0.0.


  setOpen(value) {
    noteRetired('setOpen');
    this.toggleAttribute('open', Boolean(value));
    return this;
  }

  toggleOpen() {
    noteRetired('toggleOpen');
    this.toggleAttribute('open', !this.hasAttribute('open'));
    return this;
  }

  onDownload(handler, options) {
    if (typeof handler === 'function') {
      this.addEventListener('sf-file-preview-download', handler, options);
    }

    return this;
  }

  onRemove(handler, options) {
    if (typeof handler === 'function') {
      this.addEventListener('sf-file-preview-detach', handler, options);
    }

    return this;
  } // download {id}: a request a page may refuse; unrefused, the browser opens
  // or downloads the file.


  handleDownload(event) {
    event?.preventDefault?.();
    if (this.disabled || !this.request('download', 'download') || !this.href) return;
    const anchor = document.createElement('a');
    anchor.href = this.href;

    if (this.download) {
      anchor.download = this.fileName;
    } else {
      anchor.target = this.target;
      anchor.rel = 'noopener noreferrer';
    }

    anchor.click();
  } // The name is the file's link (C51): the browser follows it as any link
  // (a middle click, «copy address» work). A picture, a PDF or a video opens
  // in the page's viewer (C149 (5)); any other file downloads, after the same
  // cancelable download request, and a page that refuses it keeps the press.


  handleOpen(event) {
    if (this.disabled) {
      event?.preventDefault?.();
      return;
    }

    const plain = event && event.button === 0 && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey;

    if (this.viewable && (plain || !event)) {
      event?.preventDefault?.();
      this.openViewer();
      return;
    }

    if (!this.request('download', 'download')) event?.preventDefault?.();
  } // The files a viewer pages through (C149 (6)): the viewable files of this
  // one's list -- the nearest parent holding more than one sf-file-preview,
  // three levels up at most -- in their order; else this file alone.


  viewerFiles() {
    let scope = this.parentElement;

    for (let level = 0; scope && level < 3; level += 1, scope = scope.parentElement) {
      const files = [...scope.querySelectorAll('sf-file-preview')];

      if (files.length > 1) {
        const shown = files.filter(file => file.viewable && !file.hidden && !file.compact);
        if (shown.includes(this)) return shown;
        break;
      }
    }

    return [this];
  }

  viewerItem() {
    return {
      src: this.viewSource,
      type: this.fileKind,
      mime: this.mimeType || undefined,
      name: this.fileName,
      alt: this.fileKind === 'image' ? this.fileName : '',
      meta: [this.extension, this.shownSize].filter(Boolean).join(' · '),
      download: this.download ? this.fileName : false,
      open: true
    };
  } // Opens this file in the page's full-screen viewer, sf-gallery's
  // SF.Gallery.view (C149 (6), C150 (7)): name, «N из M», download, open in a
  // tab, close, arrows, keys and a swipe; Escape gives the focus back to the
  // name of the file now shown. Answers false when the file cannot be viewed.


  async openViewer() {
    if (!this.viewable) return false;
    const files = this.viewerFiles();
    const start = files.indexOf(this) + 1;

    const nameOf = file => file?.querySelector?.('.sf-file-preview-name') || file;

    try {
      if (!globalThis.SF?.Gallery?.view) await globalThis.SF?.Loader?.ensure?.(['sf-gallery'], {
        press: true
      });
    } catch {// Without the viewer the browser opens the file.
    }

    const gallery = globalThis.SF?.Gallery;

    if (!gallery?.view || !this.isConnected) {
      globalThis.location?.assign?.(this.viewSource);
      return false;
    }

    gallery.view(files.map(file => file.viewerItem()), {
      start,
      counter: 'words',
      opener: current => nameOf(files[current - 1] || this),
      labels: {
        previous: this.sfWord('viewer-previous'),
        next: this.sfWord('viewer-next')
      }
    });
    return true;
  } // retry {id}: the host sends the file again and sets the state.


  handleRetry(event) {
    event?.preventDefault?.();
    if (!this.disabled) this.request('retry', 'retry');
  } // detach {id}: the host removes the file; the preview only asks. «×» takes
  // a file out of a draft or a field at once -- the page offers «Вернуть» in
  // its notice (C25); the trash of a stored file asks first (C149 (8)).


  handleRemove(event) {
    event?.preventDefault?.();
    if (this.disabled) return;

    if (!this.stored) {
      this.request('detach', 'remove');
      return;
    }

    this._asking = true;
    this.requestComponentUpdate('ask');
    this.whenRendered?.(() => {
      const answer = this.querySelector('.sf-file-preview-question');
      customElements.whenDefined('sf-confirm').then(() => requestAnimationFrame(() => {
        (answer?.querySelector('button') || answer)?.focus?.({
          preventScroll: true
        });
      }));
    }, {
      next: true
    });
  } // The answer to «Удалить «<имя>»?»: yes asks the page to erase the file
  // (detach with action delete); either way the question goes and the focus
  // comes back to the trash button.


  handleAnswer(event) {
    event?.stopPropagation?.();
    const accepted = Boolean(event?.detail?.accepted);
    event?.preventDefault?.();
    this._asking = false;
    if (accepted) this.request('detach', 'delete');
    this.requestComponentUpdate('answer');
    this.whenRendered?.(() => {
      this.querySelector('[data-action="delete"]')?.focus?.({
        preventScroll: true
      });
    }, {
      next: true
    });
  } // ── the name cut in the middle (C149 (2)) ──


  afterRender() {
    this.fitName();

    if (typeof ResizeObserver === 'function' && !this._fitObserver) {
      this._fitObserver = new ResizeObserver(() => this.fitName()); // A face that arrives later changes the name's width, not its box.

      globalThis.document?.fonts?.ready?.then?.(() => this.fitName(true));
    }

    const name = this.querySelector('.sf-file-preview-name');

    if (this._fitObserver && name !== this._fitObserved) {
      if (this._fitObserved) this._fitObserver.unobserve(this._fitObserved);
      if (name) this._fitObserver.observe(name);
      this._fitObserved = name;
    }
  }

  onDisconnected() {
    super.onDisconnected?.();
    this._fitObserver?.disconnect();
    this._fitObserver = null;
    this._fitObserved = null;
  } // Draws the whole name; when it needs more lines than its view gives (two in
  // a row, one in a chip or a tile), draws the longest head that fits, an
  // ellipsis and the tail with the extension, broken by words as the whole.


  fitName(force = false) {
    const name = this.querySelector('.sf-file-preview-name');
    const fit = name?.querySelector('.sf-file-preview-fit');
    if (!name || !fit || !name.isConnected) return;
    const full = String(this.fileName ?? '');
    const width = name.clientWidth;
    if (!force && this._fitKey === `${full}|${width}` && name.hasAttribute('data-fitted') === Boolean(this._fitCut)) return;
    name.removeAttribute('data-fitted');
    fit.replaceChildren();
    this._fitKey = `${full}|${width}`;
    this._fitCut = false;
    if (!width || this.overflows(name) === false) return;
    const tail = full.slice(-KEPT_TAIL);
    const head = full.slice(0, -KEPT_TAIL);
    if (!head) return;
    name.setAttribute('data-fitted', '');

    const draw = length => {
      const shown = `${head.slice(0, length).replace(/[\s_.\-–—/+]+$/u, '')}…${tail}`;
      fit.replaceChildren(...shown.split(JOINT).flatMap((part, index) => index ? [document.createElement('wbr'), document.createTextNode(part)] : [document.createTextNode(part)]));
    };

    let low = 0;
    let high = head.length;

    while (low < high) {
      const middle = Math.ceil((low + high) / 2);
      draw(middle);
      if (this.overflows(name)) high = middle - 1;else low = middle;
    }

    draw(low);
    this._fitCut = true;
  } // The name takes more room than its lines (the clamp hides the rest).


  overflows(name) {
    return name.scrollHeight > name.clientHeight + 1 || name.scrollWidth > name.clientWidth + 1;
  } // The detail is data only (§8): the id, and for the old names' listeners
  // the action and the file (detail-adds rows of aliases.json).


  request(verb, action) {
    return this.sfEmit(verb, {
      id: String(this.fileId ?? ''),
      action,
      value: this.getValue()
    }, {
      cancelable: true
    });
  }

}

SfFilePreview.define('sf-file-preview');
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "d4eb2cc82833"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   nameParts: () => (/* binding */ nameParts),
/* harmony export */   renderFilePreviewTemplate: () => (/* binding */ renderFilePreviewTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
 // The actions stand on the step of the name beside them (C103: one line, one
// step): size 1 (40, icon 24) in a row; size 1/2 (32) in a chip and a tile,
// whose name is a step smaller (C149 (1)). Removing a file from a draft or a
// form field is «×» «Убрать <имя>»; erasing a stored file is the trash
// «Удалить <имя>», asked first (C149 (8)).

function renderAction({
  icon,
  label,
  disabled,
  action,
  size,
  onClick
}) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <button
      type="button"
      class="sf-icon-button sf-icon-button--icon sf-icon-button--ghost sf-icon-button--on-surface sf-icon-button--size-${size}"
      data-action=${action}
      ?disabled=${disabled}
      aria-label=${label}
      @click=${onClick}
    >
      <i class="sf-icon" aria-hidden="true">${icon}</i>
    </button>
  `;
} // «Повторить» as the icon alone (owner decision C260): a row too narrow for
// the button with its words draws this one in its place -- the sheet shows
// one of the two by the row's width -- instead of moving the words under the
// text (C88). The same ghost primary refresh on the rung of its neighbours,
// named «Повторить <имя>», and «Повторить» in the Framework's plain tooltip
// on hover, keyboard focus and a long press. The anchor links the tooltip to
// its button, so no id is written here.


function renderRetryIcon(context, size) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-file-preview-retry-icon sf-tooltip-anchor">
    <button
      type="button"
      class="sf-icon-button sf-icon-button--icon sf-icon-button--ghost sf-icon-button--primary sf-icon-button--size-${size}"
      data-action="retry"
      data-tooltip=""
      aria-label=${context.words.retryLabel}
      @click=${context.onRetry}
    ><i class="sf-icon" aria-hidden="true">refresh</i></button><span
      class="sf-tooltip sf-tooltip--dark sf-tooltip--size-1/3" aria-hidden="true" hidden><span
      class="sf-tooltip-content"><span class="sf-tooltip-text">${context.words.retry}</span></span></span>
  </span>`;
} // A file name breaks between its words only (C34): spaces, and after the
// joints names use instead of spaces -- «_», «-», «–», «—», «/», «+» -- where
// a <wbr> lets the line end. Never inside a word, never before the extension's
// dot. The text itself (copy, a screen reader, the tooltip) is unchanged.


function nameParts(name) {
  const parts = String(name ?? '').split(/(?<=[_\-–—/+])/u);
  return parts.map((part, index) => index ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<wbr>${part}` : part);
} // Only the leading visual, named by the file: the image, or the extension in a
// tile (the type's icon when the name has none). A link when the file has an
// address, so a list row opens it the way the record does. For a table cell.

function renderCompact(context) {
  const visual = context.picture ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<img class="sf-file-preview-thumbnail" src=${context.picture} alt=${context.fileName}>` : context.extension ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-file-preview-extension" aria-hidden="true">${context.extension}</span>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class="sf-icon" aria-hidden="true">${context.icon}</i>`;
  const classes = ['sf-file-preview', 'sf-file-preview--compact', context.rootClass].filter(Boolean).join(' ');
  const name = context.picture ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : context.fileName;
  return context.href ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<a class=${classes} href=${context.href} target=${context.target || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} title=${context.fileName}
              aria-label=${name} data-render-managed="1"><span class="sf-file-preview-holder">${visual}</span></a>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class=${classes} title=${context.fileName} role=${context.picture ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : 'img'}
              aria-label=${name} data-render-managed="1"><span class="sf-file-preview-holder">${visual}</span></span>`;
} // The leading visual (C149 (3), (4)): the picture the host gave (image-url,
// for any file; an image's own address), else the glyph of the file's kind in
// the grey tile. Over a picture of a file that is not an image the type
// stands in a small corner badge; a video adds the play sign and its length.


function renderHolder(context) {
  if (!context.picture) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-file-preview-holder"><i class="sf-icon" aria-hidden="true">${context.icon}</i></span>`;
  }

  const badge = context.fileKind === 'video' ? context.duration : context.fileKind === 'image' ? '' : context.extension;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-file-preview-holder sf-file-preview-holder--picture">
    <img class="sf-file-preview-thumbnail" src=${context.picture} alt="" decoding="async">
    ${context.fileKind === 'video' ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-file-preview-play" aria-hidden="true"><i class="sf-icon">play_circle</i></span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    ${badge ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-file-preview-badge" aria-hidden="true">${badge}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
  </span>`;
} // The name: a link to the file when it is there (C51; C149 (5): a picture, a
// PDF or a video opens the viewer, anything else downloads), a line of text
// while it uploads or after it failed. Its whole text breaks by words; when it
// does not fit its lines (two in a row, one in a chip or a tile) the element
// cuts it in the middle and keeps the tail with the extension (C149 (2)): the
// cut text is drawn in the fit span, the whole name stays in the tooltip and,
// with the type, the size and the date, for a screen reader (C88, C51).


function renderName(context) {
  const inner = (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-file-preview-full" aria-hidden="true">${nameParts(context.fileName)}</span><span
    class="sf-file-preview-fit" aria-hidden="true"></span><span class="sf-file-preview-said">${context.fileName}${context.said}</span>`;

  if (context.linked) {
    const viewing = context.viewable;
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<a
      class="sf-file-preview-name"
      href=${context.href}
      download=${!viewing && context.download ? context.fileName : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      target=${!viewing && !context.download && context.target ? context.target : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      rel=${!viewing && !context.download && context.target === '_blank' ? 'noopener noreferrer' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      title=${context.fileName}
      data-lines=${context.lines}
      @click=${context.onOpen}
    >${inner}</a>`;
  }

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-file-preview-name" title=${context.fileName} data-lines=${context.lines}>${inner}</span>`;
} // The line under the name, by the state (C81: one family with the upload
// core's rows): type, size and date (C149 (7)); while uploading the upload
// row's bar with its per cent at the end; after a failure the reason in the
// error colour.


function renderLine(context) {
  if (context.state === 'uploading') {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-progress-bar
      class="sf-file-preview-progress"
      size="1/2"
      value=${context.progress === null ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : String(context.progress)}
      ?indeterminate=${context.progress === null}
      text-position="inline-end"
      label=${context.words.uploading}
    ></sf-progress-bar>`;
  }

  if (context.state === 'error') {
    // The reason is said when it appears (role alert, as sf-form's summary
    // and sf-alert-bar's live line; defects-d12): the row drew it in silence.
    // Not when the host says it in its own status line (data-said-by).
    // A chip cuts it to one line, so the whole reason is its title as well.
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-file-preview-error" role=${context.announced ? 'alert' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      title=${context.view === 'chip' ? context.words.failed : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>${context.words.failed}</span>`;
  }

  return context.meta ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-file-preview-meta sf-file-preview-size" aria-hidden="true" title=${context.view === 'tile' ? context.meta : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>${context.meta}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
} // Erasing a stored file is asked in place (C149 (8), C25: a question where
// the removal cannot be taken back): sf-confirm under the row, the danger
// answer «Удалить», «Отмена» quiet.


function renderQuestion(context) {
  if (!context.asking) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-confirm
    class="sf-file-preview-question"
    question=${context.words.deleteQuestion}
    accept-text=${context.words.deleteText}
    status="danger"
    size="1/2"
    confirm-id=${context.fileId}
    @sf-confirm-answer=${context.onAnswer}
  ></sf-confirm>`;
}

function renderFilePreviewTemplate(context) {
  if (context.compact) return renderCompact(context);
  const state = context.state;
  const view = context.view;
  const rootClasses = ['sf-file-preview', `sf-file-preview--${view}`, context.surface && view === 'row' ? 'sf-file-preview--surface' : '', state !== 'ready' ? `sf-file-preview--${state}` : '', context.disabled ? 'disabled' : '', context.rootClass].filter(Boolean); // A file not there yet (uploading) or not there at all (failed) has nothing
  // to download; it can still be taken away. A chip is an attachment: it
  // offers only «×» (C149 (1)).

  const download = context.downloadAction && state === 'ready' && view !== 'chip';
  const hasActions = context.actions && (download || context.removeAction);
  const retry = state === 'error' && !context.disabled;
  const grouped = hasActions || retry;
  const size = view === 'row' ? '1' : '1/2';
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div
      class=${rootClasses.join(' ')}
      style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      data-render-managed="1"
      role=${grouped ? 'group' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      aria-label=${grouped ? context.ariaLabel : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      aria-disabled=${context.disabled ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      aria-busy=${state === 'uploading' ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    >
      ${renderHolder(context)}
      <span class="sf-file-preview-main">
        ${renderName(context)}
        ${renderLine(context)}
      </span>
      ${grouped ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
          <span class="sf-file-preview-actions">
            ${retry ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button
                class="sf-file-preview-retry"
                size=${size}
                appearance="ghost"
                scheme="primary"
                icon-start="refresh"
                text=${context.words.retry}
                aria-label=${context.words.retryLabel}
                @click=${context.onRetry}
              ></sf-button>${renderRetryIcon(context, size)}` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ${hasActions && download ? renderAction({
    // A file opened in a new tab shows the sign of it (C25): the
    // download glyph promised a download the browser never made.
    icon: !context.download && context.target === '_blank' ? 'open_in_new' : 'download',
    label: context.downloadLabel,
    disabled: context.disabled,
    action: 'download',
    size,
    onClick: context.onDownload
  }) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ${hasActions && context.removeAction ? renderAction({
    icon: context.stored ? 'delete' : 'close',
    label: context.removeLabel,
    disabled: context.disabled || context.asking,
    action: context.stored ? 'delete' : 'remove',
    size,
    onClick: context.onRemove
  }) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          </span>
        ` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      ${renderQuestion(context)}
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

/***/ "fb0bdf7719f0"
(__webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FILE_ICONS: () => (/* binding */ FILE_ICONS),
/* harmony export */   FILE_SIZE_UNITS: () => (/* reexport safe */ _format_js__WEBPACK_IMPORTED_MODULE_0__.FILE_SIZE_UNITS),
/* harmony export */   fileIcon: () => (/* binding */ fileIcon),
/* harmony export */   fileNameFromAddress: () => (/* binding */ fileNameFromAddress),
/* harmony export */   fileSizeUnits: () => (/* reexport safe */ _format_js__WEBPACK_IMPORTED_MODULE_0__.fileSizeUnits),
/* harmony export */   formatFileSize: () => (/* reexport safe */ _format_js__WEBPACK_IMPORTED_MODULE_0__.formatFileSize)
/* harmony export */ });
/* harmony import */ var _format_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("5b8371b87515");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_format_js__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
_format_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
// How a stored file reads to people: its size in the page's language and its
// name when nobody gave it one. sf-image-field wrote these first (its
// value.mjs re-exports them); the Composition renderer draws content.file with
// the same rule, so a size reads the same in a field and on a page. No DOM.

// The size rule is core's number format (core/js/format.js, reuse audit
// 2026-11-02 finding 7), re-exported under the names this module published:
// formatFileSize(size, units, locale) still reads as it did. Imported through
// format.js on purpose: the builder ships a source module's relative imports
// beside it, and this import is what lays core/js/format.js and its parts
// (format-*.js) in the distribution for products that import them. None of
// them has a top-level side effect, so a bundle keeps only what it calls.


// The last part of an address, decoded, without its query and fragment: the
// name a file is shown under when it has no label. A data: or blob: address
// has no name in it -- the last «/» of `data:image/svg+xml,<svg …>` falls
// inside the content, and the name read «>» (image field study IF-14) -- so it
// gives none, and the caller says what the file is instead.
function fileNameFromAddress(href) {
  if (/^\s*(?:data|blob):/iu.test(String(href ?? ''))) return '';
  const tail = String(href).split(/[?#]/u)[0].split('/').pop() || '';
  try {
    return decodeURIComponent(tail);
  } catch {
    return tail;
  }
}

// The icon of a file's kind, by its media type: sf-download-file's own glyph
// (download) when the type says nothing a reader would recognise. The
// Composition renderer draws content.file with it; an editor that draws the
// same row (sf-content-editor) imports it from here rather than keeping a copy.
// Each entry is [pattern, icon]; the first pattern that matches wins.
const FILE_ICONS = Object.freeze([
  [/^application\/pdf$/u, 'picture_as_pdf'],
  [/^image\//u, 'image'],
  [/^video\//u, 'movie'],
  [/^audio\//u, 'audio_file'],
  [/^application\/(?:zip|x-zip-compressed|x-7z-compressed|x-rar-compressed|vnd\.rar|x-tar|gzip|x-gzip)$/u, 'folder_zip'],
  [/^(?:text\/csv|application\/vnd\.ms-excel|application\/vnd\.openxmlformats-officedocument\.spreadsheetml\.[a-z.]+|application\/vnd\.oasis\.opendocument\.spreadsheet)$/u, 'table_chart'],
  [/^(?:application\/vnd\.ms-powerpoint|application\/vnd\.openxmlformats-officedocument\.presentationml\.[a-z.]+|application\/vnd\.oasis\.opendocument\.presentation)$/u, 'slideshow'],
  [/^(?:text\/|application\/msword$|application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.[a-z.]+$|application\/vnd\.oasis\.opendocument\.text$|application\/rtf$)/u, 'description'],
].map((entry) => Object.freeze(entry)));

// The icon name for a media type; download when there is none or nothing matches.
function fileIcon(mime) {
  if (typeof mime !== 'string' || !mime) return 'download';
  return FILE_ICONS.find(([pattern]) => pattern.test(mime))?.[1] ?? 'download';
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "4294700087dc"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   files: () => (/* binding */ files)
/* harmony export */ });
/* harmony import */ var _en_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("3694b5e2bf39");
// Written by scripts/build-language-packs.mjs from src/core/lang/built-in.json
// (owner decision C282); do not edit. The words this bundle carries: the
// built-in languages' (en); every other language comes from
// a language file (core/lang/<code>.js or its parts).


const files = { en: { runtime: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime } };

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ en: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime });


/***/ },

/***/ "c9af6094a160"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   files: () => (/* binding */ files)
/* harmony export */ });
/* harmony import */ var _en_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ba7a8d52b29c");
// Written by scripts/build-language-packs.mjs from src/core/lang/built-in.json
// (owner decision C282); do not edit. The words this bundle carries: the
// built-in languages' (en); every other language comes from
// a language file (core/lang/<code>.js or its parts).


const files = { en: { runtime: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime } };

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ en: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime });


/***/ },

/***/ "9bbeb11fb966"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"The kinds of an entry and the extensions of a name that say them: one map for every SIMAI Framework part that shows a file or a page by its type -- sf-tree\'s rows today; sf-file-upload, sf-file-download and sf-view\'s file cells to follow; Docara\'s static tree, Larena\'s files and ui-mail read the same words (owner decision C102, 2026-11-12; research ui-control control/research/2026-11-12-tree.md section 7 items 2-3). A kind is one of twelve words; its icon is a Material Symbols name of the Framework\'s icon font. An extension is matched on the name\'s last dot, in lower case. A kind without extensions is said by the host (kind) or by the entry\'s place (folder: it has children). Keep the words: they are public (an entry\'s kind).","schema":"simai.framework.file-types","version":1,"kinds":{"folder":{"icon":"folder","open-icon":"folder_open","extensions":[]},"file":{"icon":"draft","extensions":[]},"page":{"icon":"article","extensions":[]},"document":{"icon":"description","extensions":["md","txt","doc","docx","pdf","rtf","odt"]},"image":{"icon":"image","extensions":["png","jpg","jpeg","gif","svg","webp","ico","avif"]},"code":{"icon":"code","extensions":["js","mjs","ts","css","scss","html","php","py","sh","vue"]},"data":{"icon":"data_object","extensions":["json","yml","yaml","xml","toml","lock","ini","env"]},"table":{"icon":"table_chart","extensions":["csv","xls","xlsx","ods"]},"archive":{"icon":"folder_zip","extensions":["zip","tar","gz","rar","7z"]},"video":{"icon":"movie","extensions":["mp4","mov","webm"]},"audio":{"icon":"audio_file","extensions":["mp3","wav","ogg","m4a"]},"link":{"icon":"link","extensions":[]}}}');

/***/ },

/***/ "3694b5e2bf39"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"runtime":{"b":"B","kb":"KB","mb":"MB","gb":"GB"}}');

/***/ },

/***/ "49343ffee6b1"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-file-preview for the shim (core/js/aliases.js, standard §16 item 20). mode: same-detail (the shim sends the new and the old name), detail-adds (the new detail holds the old fields), attribute-and-property, host-attribute (no shim), manifest-only (the DOM name does not change), retired (no new name; kept and noted by the component until the date).","component":"sf-file-preview","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"name","to":"file-name","kind":"setting","component":"sf-file-preview","since":"2026-10-27","remove_after":"2026-12-01","section":"compatibility.aliases"},{"from":"size","to":"file-size","kind":"setting","component":"sf-file-preview","since":"2026-10-27","remove_after":"2026-12-01","section":"compatibility.aliases"},{"from":"type","to":"kind","kind":"setting","component":"sf-file-preview","since":"2026-10-27","remove_after":"2026-12-01","section":"the axis\'s old name (contracts/public-api-axes.json); its value default reads auto"},{"from":"aria-label","to":null,"kind":"attribute","component":"sf-file-preview","since":"2026-10-27","remove_after":"2026-12-01","mode":"host-attribute","section":"§3.1, §4.8","note":"stays a host attribute, read by the element for the group\'s name; no shim"},{"from":"sf-file-preview:download","to":"sf-file-preview-download","kind":"event","component":"sf-file-preview","since":"2026-10-27","remove_after":"2026-12-01","mode":"detail-adds","section":"vocabulary 1.1.5 §5 download","note":"the new detail {id, action, value} holds the old fields"},{"from":"sf-file-preview:remove","to":"sf-file-preview-detach","kind":"event","component":"sf-file-preview","since":"2026-10-27","remove_after":"2026-12-01","mode":"detail-adds","section":"vocabulary 1.1.5 §5 detach, §5.1","note":"the new detail {id, action, value} holds the old fields; bx-simai.property listens to the old name (vocabulary §9.2)"},{"from":"avatar-size","to":null,"kind":"attribute","component":"sf-file-preview","since":"2026-10-27","remove_after":"2026-12-01","mode":"retired","section":"compatibility.aliases","note":"read by nothing since 1.0.0"},{"from":"open","to":null,"kind":"attribute","component":"sf-file-preview","since":"2026-10-27","remove_after":"2026-12-01","mode":"retired","section":"compatibility.deprecations","note":"the actions are no longer hidden in a floating layer; the attribute does nothing"},{"from":"setOpen","to":null,"kind":"action","component":"sf-file-preview","since":"2026-10-27","remove_after":"2026-12-01","mode":"retired","section":"compatibility.deprecations, §4.4","note":"kept until the date and noted on each call; it writes the attribute open, which does nothing"},{"from":"toggleOpen","to":null,"kind":"action","component":"sf-file-preview","since":"2026-10-27","remove_after":"2026-12-01","mode":"retired","section":"compatibility.deprecations, §4.4","note":"kept until the date and noted on each call"}]}');

/***/ },

/***/ "f3f4ec5c87ca"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.file-preview","tag":"sf-file-preview","version":"1.5.6","kind":"leaf","settings":{"file-name":{"type":"string","default":"File"},"file-size":{"type":"string","default":""},"file-date":{"type":"string","default":""},"icon":{"type":"icon","default":"description"},"href":{"type":"string","default":""},"kind":{"type":"enum","values":["auto","icon","image"],"default":"auto"},"mime-type":{"type":"string","default":""},"image-url":{"type":"string","default":""},"duration":{"type":"string","default":""},"surface":{"type":"boolean","default":false},"appearance":{"type":"enum","values":["row","chip","tile"],"default":"row"},"download":{"type":"boolean","default":true},"target":{"type":"string","default":""},"actions":{"type":"boolean","default":true},"download-action":{"type":"boolean","default":true},"remove-action":{"type":"boolean","default":true},"stored":{"type":"boolean","default":false},"disabled":{"type":"boolean","default":false},"state":{"type":"enum","values":["ready","uploading","error"],"default":"ready"},"value":{"type":"number","optional":true,"min":0,"max":100},"error-text":{"type":"string","default":""},"download-label":{"type":"string","default-from":"runtime.download-label"},"remove-label":{"type":"string","default-from":"runtime.remove-label"},"compact":{"type":"boolean","default":false}},"values":{},"events":{"download":{"carries":{"id":"string","action":"string","value":"object"},"cancelable":true},"detach":{"carries":{"id":"string","action":"string","value":"object"},"cancelable":true},"retry":{"carries":{"id":"string","action":"string","value":"object"}}},"actions":{},"css-variables":{"--sf-file-preview-background-color":{"type":"color","state":"default"},"--sf-file-preview-padding":{"type":"length","state":"default"},"--sf-file-preview-radius":{"type":"length","state":"default"},"--sf-file-preview-gap":{"type":"length","state":"default"},"--sf-file-preview-holder-size":{"type":"length","state":"default"},"--sf-file-preview-holder-background-color":{"type":"color","state":"default"},"--sf-file-preview-holder-color":{"type":"color","state":"default"}}}');

/***/ },

/***/ "ba7a8d52b29c"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"File Preview","runtime":{"aria-label":"File","download-label":"Download {name}","remove-label":"Remove {name}","uploading-label":"Uploading {name}","error-text":"Not uploaded","error-line":"Not uploaded: {message}","retry-text":"Retry","retry-label":"Retry {name}","delete-label":"Delete {name}","delete-question":"Delete “{name}”?","delete-text":"Delete","viewer-previous":"Previous file","viewer-next":"Next file"}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("781dfa6013bf");
/******/
/******/ })()
;