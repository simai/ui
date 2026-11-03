/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "e138a730fd7c"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createFieldContract: () => (/* binding */ createFieldContract),
/* harmony export */   syncFieldContract: () => (/* binding */ syncFieldContract)
/* harmony export */ });
/* harmony import */ var _core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("e92fd2d1a38c");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var _core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_0__);
 // A field's ids come from its instance's role path (standard 1.3.8 §7.1.1;
// simai/ui-source#41), never from a counter: core/js/instance-path.js.

const fieldIdentities = new WeakMap();

function nextIdentity(owner, prefix) {
  if (owner && fieldIdentities.has(owner)) return fieldIdentities.get(owner);
  const base = (0,_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_0__.partId)((0,_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_0__.instancePath)(owner, {
    kind: prefix
  }));
  const identity = {
    base,
    controlId: `${base}--control`,
    messageId: `${base}--message`
  }; // An instance not yet in the page has no place in it: its path is settled
  // when it is, so it is not kept before.

  if (owner && (typeof owner === 'object' || typeof owner === 'function') && (0,_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_0__.pathIsSettled)(owner)) {
    fieldIdentities.set(owner, identity);
  }

  return identity;
}

function mergeIdRefs(existing, additions) {
  return [...new Set([...String(existing || '').split(/\s+/).filter(Boolean), ...additions.filter(Boolean)])].join(' ');
}

function createFieldContract(owner, {
  prefix = 'sf-field',
  required = false,
  invalid = false,
  hint = '',
  errorMessage = ''
} = {}) {
  const identity = nextIdentity(owner, prefix);
  const normalizedInvalid = Boolean(invalid);
  const message = normalizedInvalid && errorMessage ? errorMessage : hint;
  return { ...identity,
    required: Boolean(required),
    invalid: normalizedInvalid,
    message,
    describedBy: message ? identity.messageId : '',
    errorMessageId: normalizedInvalid && errorMessage ? identity.messageId : ''
  };
}
function syncFieldContract(root, control, {
  prefix = 'sf-field',
  required = false,
  invalid = false,
  messageNode = null,
  labelNode = null,
  errorMessage = ''
} = {}) {
  if (!root || !control) return null;
  const hint = messageNode?.textContent?.trim() || '';
  const contract = createFieldContract(root, {
    prefix,
    required,
    invalid,
    hint,
    errorMessage
  });
  if (!control.id) control.id = contract.controlId;

  if (root.tagName === 'LABEL' && !root.hasAttribute('for')) {
    root.setAttribute('for', control.id);
  } // Name the field by its visible label, not every hint or adjacent button.
  // Author-provided accessible names remain authoritative.


  if (labelNode?.textContent?.trim() && !control.hasAttribute('aria-label') && !control.hasAttribute('aria-labelledby')) {
    if (!labelNode.id) labelNode.id = `${control.id}-label`;
    control.setAttribute('aria-labelledby', labelNode.id);
  }

  control.required = contract.required;
  root.classList.toggle('error', contract.invalid);
  control.classList.toggle('error', contract.invalid);
  if (contract.invalid) control.setAttribute('aria-invalid', 'true');else control.removeAttribute('aria-invalid');

  if (messageNode) {
    if (!messageNode.id) messageNode.id = contract.messageId;
    control.setAttribute('aria-describedby', mergeIdRefs(control.getAttribute('aria-describedby'), [messageNode.id]));
  }

  if (contract.errorMessageId && messageNode) {
    control.setAttribute('aria-errormessage', messageNode.id);
  } else {
    control.removeAttribute('aria-errormessage');
  }

  return contract;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "e6d86f2cd058"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FIELD_SIZES: () => (/* binding */ FIELD_SIZES),
/* harmony export */   RETIRED_FIELD_SIZES: () => (/* binding */ RETIRED_FIELD_SIZES),
/* harmony export */   fieldSize: () => (/* binding */ fieldSize),
/* harmony export */   nearestFieldSize: () => (/* binding */ nearestFieldSize),
/* harmony export */   retireFieldSizeClass: () => (/* binding */ retireFieldSizeClass)
/* harmony export */ });
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d3818183b14c");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_0__);
// Form fields come in three sizes. 1/3 and 3 were retired: no consumer used
// them, and they could not hold a field's own pictures, tags and targets. A
// page written for a retired size keeps rendering at the nearest kept size, and
// says so once in the console so the markup can be updated.

const FIELD_SIZES = Object.freeze(['1/2', '1', '2']);
const RETIRED_FIELD_SIZES = Object.freeze({
  '1/3': '1/2',
  '3': '2'
});
const warned = new Set(); // A control placed inside something with the whole scale (a list item, say)
// takes the nearest form size, quietly: the list is not wrong to be 1/3.

function nearestFieldSize(value) {
  const size = String(value ?? '').trim().toLowerCase();
  if (FIELD_SIZES.includes(size)) return size;
  return Object.hasOwn(RETIRED_FIELD_SIZES, size) ? RETIRED_FIELD_SIZES[size] : '1';
}
function fieldSize(value, component = 'field', fallback = '1') {
  const size = String(value ?? '').trim().toLowerCase();
  if (FIELD_SIZES.includes(size)) return size;

  if (Object.hasOwn(RETIRED_FIELD_SIZES, size)) {
    const kept = RETIRED_FIELD_SIZES[size];
    (0,_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_0__.noteDeprecated)({
      component,
      kind: 'value',
      attribute: 'size',
      from: size,
      to: kept
    });
    const key = `${component}:${size}`;

    if (!warned.has(key) && typeof console !== 'undefined') {
      warned.add(key);
      console.warn(`[SIMAI Framework] ${component}: size ${size} is retired for form fields; rendering size ${kept}.`);
    }

    return kept;
  }

  return fallback;
} // Markup written by hand carries its size as a class, so the binder moves a
// retired size class to the kept one before anything measures the field.

function retireFieldSizeClass(root, block) {
  if (!root?.classList) return;

  for (const [retired, kept] of Object.entries(RETIRED_FIELD_SIZES)) {
    const name = `${block}--size-${retired}`;
    if (!root.classList.contains(name)) continue;
    root.classList.replace(name, `${block}--size-${fieldSize(retired, block)}`);
  }
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "5b8371b87515"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FILE_SIZE_UNITS: () => (/* binding */ FILE_SIZE_UNITS),
/* harmony export */   calendarDayOffset: () => (/* binding */ calendarDayOffset),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   fileSizeUnits: () => (/* binding */ fileSizeUnits),
/* harmony export */   formatDate: () => (/* binding */ formatDate),
/* harmony export */   formatFileSize: () => (/* binding */ formatFileSize),
/* harmony export */   formatLocale: () => (/* binding */ formatLocale),
/* harmony export */   formatNumber: () => (/* binding */ formatNumber),
/* harmony export */   formatRelativeDay: () => (/* binding */ formatRelativeDay),
/* harmony export */   formatRelativeTime: () => (/* binding */ formatRelativeTime),
/* harmony export */   msUntilNextDay: () => (/* binding */ msUntilNextDay),
/* harmony export */   numberOptions: () => (/* binding */ numberOptions),
/* harmony export */   toDate: () => (/* binding */ toDate)
/* harmony export */ });
/* harmony import */ var _page_language_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("43090d1c8307");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_page_language_js__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
_page_language_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var _page_language_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_page_language_js__WEBPACK_IMPORTED_MODULE_0__);
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
// Nothing here holds state of its own: the Intl formatters are kept on a
// global shared by every copy of this module, which each bundle carries
// (bundles each carry their own module copy; page-language.js says why).


const STORE = (() => {
  const root = typeof globalThis !== 'undefined' ? globalThis : {};
  const key = '__sfFormat';
  if (!root[key]) root[key] = {
    formatters: new Map()
  };
  return root[key];
})();

const DAY_MS = 86400000;
/** The locale a call formats in: the one it names, else its node's page language. */

function formatLocale({
  locale,
  node
} = {}) {
  return String(locale || '').trim() || (0,_page_language_js__WEBPACK_IMPORTED_MODULE_0__.pageLocale)(node);
} // One formatter per kind, locale and options. An unknown locale falls back to
// the browser's, and options the platform refuses (an unknown unit or
// currency) to a plain number, so a typo in a page never throws at a reader.

function formatter(kind, locale, options) {
  const key = `${kind}|${locale}|${JSON.stringify(options)}`;
  const cache = STORE.formatters;
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
/** A Date from a Date, a time in milliseconds or a date string; null when it is none. */


function toDate(value) {
  if (value === null || value === undefined || value === '') return null;
  const date = value instanceof Date ? new Date(value.getTime()) : new Date(typeof value === 'string' && /^\d+$/u.test(value) ? Number(value) : value);
  return Number.isNaN(date.getTime()) ? null : date;
} // The first letter in capitals, by the locale's rule («вчера» → «Вчера»).

function capitalise(text, locale) {
  const first = Array.from(text)[0] ?? '';
  return first ? first.toLocaleUpperCase(locale || undefined) + text.slice(first.length) : text;
} // ── dates ────────────────────────────────────────────────────────────────────


const DATE_STYLES = new Set(['short', 'medium', 'long', 'full']);
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
  const moment = toDate(value);
  if (!moment) return gap;
  let options = intl;

  if (!options) {
    options = {};
    if (DATE_STYLES.has(date)) options.dateStyle = date;
    if (DATE_STYLES.has(time)) options.timeStyle = time;
    if (!options.dateStyle && !options.timeStyle) options.dateStyle = 'medium';
  }

  return formatter('DateTimeFormat', formatLocale(where), options).format(moment);
} // ── days ─────────────────────────────────────────────────────────────────────

/**
 * Calendar days from `now` to the value in the reader's time zone: 0 today,
 * -1 yesterday, 1 tomorrow; NaN when the value is no date. Counted on
 * calendar dates, not 24-hour spans, so 23:59 yesterday is -1 at 00:01 and a
 * day of a clock change is still one day.
 */

function calendarDayOffset(value, {
  now = new Date()
} = {}) {
  const moment = toDate(value);
  const today = toDate(now);
  if (!moment || !today) return Number.NaN;
  const day = Date.UTC(moment.getFullYear(), moment.getMonth(), moment.getDate());
  const base = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.round((day - base) / DAY_MS);
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
 * The answer changes at the reader's midnight: msUntilNextDay says when.
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
  const moment = toDate(value);
  if (!moment) return gap;
  const locale = formatLocale(where);
  const offset = calendarDayOffset(moment, {
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
    text = formatter('RelativeTimeFormat', locale, {
      numeric: 'auto'
    }).format(offset, 'day');
  } else if (weekday && offset < -1 && offset > -7) {
    text = formatter('DateTimeFormat', locale, {
      weekday: 'long'
    }).format(moment);
  } else {
    const year = moment.getFullYear() === toDate(now).getFullYear() ? {} : {
      year: 'numeric'
    };
    text = formatter('DateTimeFormat', locale, {
      day: 'numeric',
      month: 'long',
      ...year
    }).format(moment);
  }

  return capital ? capitalise(text, locale) : text;
}
/**
 * Milliseconds from `now` to the reader's next midnight, when every relative
 * day on the screen moves by one. A component that shows them sets a timer
 * for this long (plus a second's margin, so it wakes in the new day) and
 * draws them again; «сегодня» said yesterday is wrong by morning.
 */

function msUntilNextDay(now = new Date()) {
  const today = toDate(now) ?? new Date();
  const next = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  return next.getTime() - today.getTime();
} // The largest unit a span reaches is the one it is said in (mail-letters'
// steps, 2026-10): 90 seconds is «2 минуты назад», 40 days «в прошлом месяце».

const RELATIVE_STEPS = [['year', 31536000], ['month', 2592000], ['week', 604800], ['day', 86400], ['hour', 3600], ['minute', 60]];
/** «5 минут назад», «через 2 часа»: a moment from `now`, in the locale. */

function formatRelativeTime(value, {
  now = new Date(),
  gap = '',
  ...where
} = {}) {
  const moment = toDate(value);
  const base = toDate(now);
  if (!moment || !base) return gap;
  const seconds = Math.round((moment.getTime() - base.getTime()) / 1000);
  const format = formatter('RelativeTimeFormat', formatLocale(where), {
    numeric: 'auto'
  });

  for (const [unit, size] of RELATIVE_STEPS) {
    if (Math.abs(seconds) >= size) return format.format(Math.round(seconds / size), unit);
  }

  return format.format(seconds, 'second');
} // ── numbers ──────────────────────────────────────────────────────────────────

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
  return formatter('NumberFormat', formatLocale(where), options).format(number);
} // ── file sizes ───────────────────────────────────────────────────────────────
// The four words of a size, in the languages the SIMAI Framework ships; any
// other language reads the English words with its own digits. A component
// with words of its own passes them as `units`.

const FILE_SIZE_UNITS = Object.freeze({
  en: Object.freeze(['B', 'KB', 'MB', 'GB']),
  ru: Object.freeze(['Б', 'КБ', 'МБ', 'ГБ'])
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
  const locale = formatLocale(where);
  const units = where.units?.length ? where.units : fileSizeUnits(locale);
  let amount = bytes;
  let index = 0;

  while (amount >= 1024 && index < units.length - 1) {
    amount /= 1024;
    index += 1;
  }

  const digits = index === 0 || amount >= 10 ? 0 : 1;
  return `${formatter('NumberFormat', locale, {
    maximumFractionDigits: digits
  }).format(amount)} ${units[index]}`;
}
const Format = Object.freeze({
  locale: formatLocale,
  date: formatDate,
  relativeDay: formatRelativeDay,
  relativeTime: formatRelativeTime,
  dayOffset: calendarDayOffset,
  msUntilNextDay,
  number: formatNumber,
  numberOptions,
  fileSize: formatFileSize
}); // Core publishes the helper; component bundles that carry their own copy reuse
// an already published one instead of replacing it.

if (typeof globalThis !== 'undefined') {
  globalThis.SF = globalThis.SF || {};
  if (!globalThis.SF.format) globalThis.SF.format = Format;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Format);
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "38ea8d53f301"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FormField: () => (/* binding */ FormField),
/* harmony export */   VALIDITY_FLAGS: () => (/* binding */ VALIDITY_FLAGS),
/* harmony export */   innerControlName: () => (/* binding */ innerControlName),
/* harmony export */   syncFieldValidity: () => (/* binding */ syncFieldValidity),
/* harmony export */   syncOwnValidity: () => (/* binding */ syncOwnValidity)
/* harmony export */ });
// The form-control half of a field built from its component.json (standard
// simai.smart-component 1.3.8 §17.1, §17.2), shared by the field family.
//
// core/js/element-manifest.js makes the host form-associated and gives it
// ElementInternals, sfFormValue() and sfSyncForm(). What a field adds is the
// same in every member, so it is written once here:
//
// - validity (§17.2): the host reports what its inner native control knows
//   (value-missing, too-short, pattern-mismatch, ...) with the control as the
//   anchor, so reportValidity() points at the box the person types in; a
//   custom error set with setCustomValidity() or the action set-error wins
//   until it is cleared;
// - the inner controls stay out of the page's form (§17.1 item 6): they carry
//   no name while the host is the form control;
// - a field with no inner native control to read (a list of buttons, a
//   picker, a file area) says what it knows itself with `fieldValidity()`:
//   value-missing while `required` and the form value is empty by default,
//   and where the browser points;
// - form reset and fieldset[disabled] (§17.1 items 3, 4): `form.reset()`
//   calls the component's `fieldReset()` when it has one (its default back,
//   without events), and the host syncs its form value and validity after the
//   browser has reset its parts;
// - restore: `formStateRestoreCallback` hands the saved form value to
//   `fieldRestore(state)` when the component has one.
//
// Usage, over the element core/js/element-manifest.js gives:
//
//   const Element = elementFromManifest(manifest, {base: SfBaseElement, ...});
//   class SfThing extends FormField(Element) { ... }
//
// Without ElementInternals nothing here runs, and the named inner control
// submits as it always did (§16 item 11).
// ValidityState's own flags, in the order of §17.2's list.
const VALIDITY_FLAGS = Object.freeze(['valueMissing', 'typeMismatch', 'patternMismatch', 'tooShort', 'tooLong', 'rangeUnderflow', 'rangeOverflow', 'stepMismatch', 'badInput']);
/** The name an inner native control carries: none while the host submits (§17.1 item 6). */

function innerControlName(component, name) {
  return component?.sfInternals ? '' : String(name || '');
}
/**
 * The host's validity from its inner control: the control's failed flags and
 * message, or the custom error the page set, or valid. `own` adds flags the
 * component reads itself, {flag: message} (a number field's range and step,
 * which its text box cannot know).
 */

function syncFieldValidity(component, control, own = {}) {
  const internals = component?.sfInternals;
  if (!internals) return;

  try {
    const custom = component.sfCustomError || '';

    if (custom) {
      internals.setValidity({
        customError: true
      }, custom, control || undefined);
      return;
    }

    const validity = control?.validity;
    const flags = {};
    let message = '';

    if (validity && !validity.valid && control.willValidate !== false) {
      for (const flag of VALIDITY_FLAGS) if (validity[flag]) flags[flag] = true;

      message = control.validationMessage;
    }

    for (const [flag, text] of Object.entries(own || {})) {
      flags[flag] = true;
      message ||= String(text || '');
    }

    if (Object.keys(flags).length) internals.setValidity(flags, message || ' ', control || undefined);else internals.setValidity({});
  } catch (error) {
    component.reportComponentError?.(error, 'validity');
  }
}
/**
 * The host's validity from what the component says itself (fieldValidity()):
 * value-missing and the custom error the page set; `anchor`, when it is a part
 * of the host, is where the browser points.
 */

function syncOwnValidity(component, {
  valueMissing = false,
  message = '',
  anchor = null
} = {}) {
  const internals = component?.sfInternals;
  if (!internals) return;
  const custom = component.sfCustomError || '';
  const flags = {};
  let text = '';

  if (custom) {
    flags.customError = true;
    text = custom;
  }

  if (valueMissing) {
    flags.valueMissing = true;
    text ||= message || 'value-missing';
  }

  try {
    if (Object.keys(flags).length) {
      const target = anchor && component.contains?.(anchor) ? anchor : undefined;
      internals.setValidity(flags, text, target);
    } else {
      internals.setValidity({});
    }
  } catch (error) {
    component.reportComponentError?.(error, 'validity');
  }
}
/**
 * The field family's form plumbing over a manifest element. A component
 * names the control its validity comes from with `sfValidityAnchor()`
 * (default: getInputElement()).
 */

const FormField = Base => class extends Base {
  constructor() {
    super(); // A person's edit reaches the host as input/change; the form value and
    // validity follow it without a redraw.

    this.__sfFormSync = () => this.sfSyncFormState();

    this.addEventListener('input', this.__sfFormSync);
    this.addEventListener('change', this.__sfFormSync);
  }

  sfValidityAnchor() {
    return this.getInputElement?.() || null;
  }
  /**
   * What the component knows of its validity itself, {valueMissing, message,
   * anchor}, or null when an inner native control's ValidityState is the
   * answer (sfValidityAnchor()). With no such control: value-missing while
   * `required` and the form value is empty. A component overrides it.
   */


  fieldValidity() {
    if (this.sfValidityAnchor()) return null;
    const required = this.hasAttribute('required') && this.getAttribute('required') !== 'false';
    const value = this.sfFormValue?.();
    const valueMissing = required && !this.disabled && (value === null || value === undefined || value === ''); // The word only when it is said: asked on every sync, a component without
    // it warned «no word value-missing» on each optional field (simai.main,
    // sf-button-group in property-view's choice field, 2026-10-28).

    return {
      valueMissing,
      message: valueMissing ? this.sfWord?.('value-missing') || 'value-missing' : '',
      anchor: null
    };
  }
  /** The validity, now: the component's own account, or its inner control's. */


  sfSyncValidity() {
    const own = this.fieldValidity();
    if (own) syncOwnValidity(this, own);else syncFieldValidity(this, this.sfValidityAnchor());
  }
  /** The form value and the validity, now. */


  sfSyncFormState() {
    this.sfSyncForm?.();
    this.sfSyncValidity();
  }
  /** §17.2: a custom error keeps the form from submitting until it is cleared. */


  setCustomValidity(message = '') {
    this.sfCustomError = String(message ?? '');
    this.sfSyncValidity();
  } // fieldReset() puts the component's default back, without events. The
  // browser resets the parts after it calls this: the sync waits for them,
  // and once more for the parts that put their own default back a task later
  // (component/form-reset-helper.js: masks, the checkables' attributes).


  formResetCallback() {
    if (typeof this.fieldReset === 'function') {
      try {
        this.fieldReset();
      } catch (error) {
        this.reportComponentError?.(error, 'form reset');
      }
    }

    this.sfSyncFormState();
    Promise.resolve().then(() => this.sfSyncFormState());
    setTimeout(() => this.sfSyncFormState(), 0);
  }

  formStateRestoreCallback(state) {
    if (typeof this.fieldRestore === 'function') this.fieldRestore(state);
    this.sfSyncFormState();
  }

};

/***/ },

/***/ "f99166b49d53"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SfImageField: () => (/* binding */ SfImageField)
/* harmony export */ });
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _core_js_instance_path__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("e92fd2d1a38c");
/* harmony import */ var _component_field_contract__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("e138a730fd7c");
/* harmony import */ var _component_field_size__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("e6d86f2cd058");
/* harmony import */ var _helpers_form_field__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("38ea8d53f301");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("15360766166a");
/* harmony import */ var _value_mjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("a5c6bf6ad612");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("1a493783d3b8");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("8278668e929b");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("6e7f9092a98a");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("c317333b88f8");
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__("8ddd5798abe5");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_instance_path__WEBPACK_IMPORTED_MODULE_2__, _component_field_contract__WEBPACK_IMPORTED_MODULE_3__, _component_field_size__WEBPACK_IMPORTED_MODULE_4__, _js_templates_default__WEBPACK_IMPORTED_MODULE_6__, _value_mjs__WEBPACK_IMPORTED_MODULE_7__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_instance_path__WEBPACK_IMPORTED_MODULE_2__, _component_field_contract__WEBPACK_IMPORTED_MODULE_3__, _component_field_size__WEBPACK_IMPORTED_MODULE_4__, _js_templates_default__WEBPACK_IMPORTED_MODULE_6__, _value_mjs__WEBPACK_IMPORTED_MODULE_7__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_instance_path__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_core_js_instance_path__WEBPACK_IMPORTED_MODULE_2__);
// sf-input-image: a form field that holds one image (simai/ui-source#27). It
// shows the image as a thumbnail with its file name and size, offers
// «Заменить…» and «Убрать», and takes a file dropped anywhere on it -- the image
// well a page editor, a brand logo or an admin media field needs. ui-mail's
// polish audit (2026-10-22, B1) found the only part the Framework had for it was
// sf-file-upload, which is a drop zone with a list of transfers: after a choice
// it kept its whole zone, showed no image and had no way to replace one.
//
// It does what sf-file-upload does with a file and no more: it raises the File
// the person chose, in the events, and transfers no bytes. The host uploads it
// and writes back the stored value, with the address the image now has. Until
// then the thumbnail shows the chosen file from an object URL, so the person
// sees what they picked at once rather than after a round trip.
//
// The field half -- label, help text, error, required, disabled, read-only --
// is the one every Framework field has (component/field-contract.js), so the
// field reads, sizes and announces itself as sf-input and sf-textarea do.












 // Every word this component says is lang/<locale>.json runtime (standard
// 1.3.8 §11). `quoted` wraps a file name the way the language quotes: «…» in
// Russian, “…” in English.

const WORD_KEYS = Object.keys(_lang_en_json__WEBPACK_IMPORTED_MODULE_10__.runtime);

const camel = key => key.replace(/-([a-z])/gu, (_, letter) => letter.toUpperCase());

const kebab = key => key.replace(/[A-Z]/gu, letter => `-${letter.toLowerCase()}`);

const DEFAULT_ACCEPT = 'image/*'; // sf-input-image from its component.json (standard simai.smart-component
// 1.3.8 §3, §4, §4.4, §8, §16.20, §17.1, §17.2): the settings are attributes
// and properties made by core/js/element-manifest.js, the actions answer an
// outcome, the events have their vocabulary names (the shim sends the colon
// names after them), and the host is the form control through
// ElementInternals.

const ImageFieldElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_8__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_10__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_11__
  },
  source: 'ru',
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_9__,
  actions: {
    // Opens the platform's file dialog, as «Заменить…» and «Выбрать…» do.
    choose() {
      if (!this.interactive) return 'inactive';
      const input = this.input();
      if (!input) return 'not-drawn';
      input.click();
      return 'applied';
    },

    'take-file'({
      file,
      source = 'input'
    } = {}) {
      return this._takeFile(file, source || 'input');
    },

    'remove-image'() {
      return this._removeImage();
    },

    clear() {
      if (!this.value) return 'unchanged';
      this.setValue(null);
      return 'applied';
    },

    // §17.2: the message shows in place of the hint and the form does not
    // submit until it is cleared. It is the error-message and invalid
    // attributes, which is what a host writing them by hand gets too.
    'set-error'({
      message = ''
    } = {}) {
      const text = String(message ?? '');

      if (text) {
        this.setAttribute('error-message', text);
        this.setAttribute('invalid', '');
      } else {
        this.removeAttribute('error-message');
        this.removeAttribute('invalid');
      }

      this.setCustomValidity(text);
      return 'applied';
    }

  }
});

class SfImageField extends (0,_helpers_form_field__WEBPACK_IMPORTED_MODULE_5__.FormField)(ImageFieldElement) {
  static get props() {
    return { ...super.props,
      templateName: {
        attribute: 'template',
        default: 'default'
      },
      // The value is an object (§4.2); its attribute -- an address, or the
      // shape as JSON -- stays as the field had it.
      value: {
        default: ''
      },
      size: {
        default: '1',
        values: _component_field_size__WEBPACK_IMPORTED_MODULE_4__.FIELD_SIZES
      },
      // The group's name when no label is drawn: a field renderer's panel
      // prints the label beside the field, and a second, visible one inside it
      // would say it twice (the rule tests/field-control-accessible-name holds
      // for sf-input, sf-switch and the rest).
      ariaLabel: {
        attribute: 'aria-label',
        default: ''
      },
      rootClass: {
        default: ''
      }
    };
  }

  constructor() {
    super(); // undefined: follow the attribute. Set by the property, a chosen file or a
    // removal; an attribute written later takes over again.

    this._value = undefined; // A value set as a property before the element was defined -- a lit
    // `.value` binding on a tag the loader had not upgraded yet, which is how
    // the field renderers draw it -- is an own property that would hide the
    // accessor for good and skip the normalising. It is taken through it.

    if (Object.prototype.hasOwnProperty.call(this, 'value')) {
      const early = this.value;
      delete this.value;
      this._value = (0,_value_mjs__WEBPACK_IMPORTED_MODULE_7__.normaliseImageValue)(early);
    }

    this._objectUrl = '';
    this._dimensions = new Map();
    this._failed = new Set();
    this.dragging = false;
    this.announcement = '';
    this._focusAfterRender = '';
  }

  attributeChangedCallback(name, previous, next) {
    if (name === 'value' && previous !== next && !this._writingValue) {
      this._value = undefined;

      this._releaseObjectUrl();
    }

    super.attributeChangedCallback(name, previous, next);
  }

  get size() {
    return (0,_component_field_size__WEBPACK_IMPORTED_MODULE_4__.fieldSize)(this.getAttribute('size') || '1', 'sf-input-image');
  }

  get accept() {
    return this.hasAttribute('accept') ? this.getAttribute('accept') || '' : DEFAULT_ACCEPT;
  }

  get ariaLabel() {
    return this.getProp('ariaLabel') || '';
  } // The ids the template writes come from the instance path (§7.1.1), never
  // from a counter.


  get _id() {
    return (0,_core_js_instance_path__WEBPACK_IMPORTED_MODULE_2__.partId)((0,_core_js_instance_path__WEBPACK_IMPORTED_MODULE_2__.instancePath)(this, {
      kind: 'sf-input-image'
    }));
  } // The image the field holds, in the file shape, or null when it is empty.


  get value() {
    if (this._value !== undefined) return this._value;
    return (0,_value_mjs__WEBPACK_IMPORTED_MODULE_7__.normaliseImageValue)(this.getAttribute('value'));
  } // Set from code, the value is not a change: no event, as for a native field.


  set value(next) {
    this.setValue(next);
  }

  setValue(next) {
    const value = (0,_value_mjs__WEBPACK_IMPORTED_MODULE_7__.normaliseImageValue)(next);
    if (value?.href !== this._objectUrl) this._releaseObjectUrl();
    this._value = value;
    this.requestComponentUpdate('value');
    this.sfSyncFormState();
    return this;
  } // What the form gets (§17.1): the File the person chose, or the stored
  // image's id (else its address); nothing while empty or disabled. Read-only
  // still submits.


  sfFormValue() {
    if (this.disabled) return null;
    const value = this.value;
    if (!value) return null;
    if (value.file && typeof File === 'function' && value.file instanceof File) return value.file;
    return String(value.value || value.href || '') || null;
  }

  fieldValidity() {
    return {
      valueMissing: this.required && !this.disabled && !this.value,
      message: this.sfWord('value-missing'),
      anchor: this.focusDelegate()
    };
  } // form.reset(): back to the image the field was written with, without
  // events (§17.1 item 4).


  fieldReset() {
    this._releaseObjectUrl();

    this._value = undefined;
    const input = this.input();
    if (input) input.value = '';
    this.requestComponentUpdate('value');
  }

  get interactive() {
    return !this.disabled && !this.readonly;
  }

  text(key) {
    return this.sfWord(kebab(key));
  }

  quote(name) {
    return this.text('quoted').replace('%s', name);
  } // A size as people read it, in the page's language: «2 КБ», «1,4 МБ». Text
  // the host already formatted is shown as it came.


  formatSize(size) {
    const units = ['bytes', 'kilobytes', 'megabytes', 'gigabytes'].map(key => this.text(key));
    return (0,_value_mjs__WEBPACK_IMPORTED_MODULE_7__.formatFileSize)(size, {
      units,
      node: this
    });
  } // «450×300 · 2 КБ»: the image's own dimensions once it has loaded, then its
  // size. The host's `meta` replaces the line when it knows better.


  metaText(value) {
    if (this.meta) return this.meta;
    if (!value) return '';
    const dimensions = value.href ? this._dimensions.get(value.href) : null;
    return [dimensions ? `${dimensions.width}×${dimensions.height}` : '', this.formatSize(value.size)].filter(Boolean).join(' · ');
  }

  input() {
    return this.querySelector(':scope .sf-image-field-input');
  }

  focusDelegate() {
    return this.querySelector(':scope .sf-image-field-actions button:not([disabled])');
  } // The person chose a file: from the dialog (source input) or by dropping it
  // (source drop). The thumbnail shows it at once from an object URL; the host
  // hears of it in input, change and attach (sf-image-field:select after it),
  // each carrying the File, and uploads it. The action take-file answers
  // its outcome (§4.4).


  _takeFile(file, source = 'input') {
    if (!file) return 'no-file';
    if (!this.interactive) return 'inactive';

    if (!(0,_value_mjs__WEBPACK_IMPORTED_MODULE_7__.acceptsFile)(this.accept, file)) {
      this.reject([file], source);
      return 'rejected';
    }

    this._releaseObjectUrl();

    let href = '';

    try {
      href = URL.createObjectURL(file);
      this._objectUrl = href;
    } catch {
      href = '';
    }

    const value = {
      value: '',
      label: file.name,
      mime: file.type || '',
      size: file.size,
      href,
      file
    };
    this._value = value;
    this.announce(`${this.text('chosen')} ${this.quote(file.name)}`);
    this.requestComponentUpdate('value');

    this._emitValue({
      value,
      file,
      source
    });

    this.sfEmit('attach', {
      files: [file],
      file,
      source,
      value,
      name: this.name
    });
    return 'applied';
  } // The person removed the image. Focus goes to «Выбрать…», which is where the
  // removed button stood, so the keyboard does not fall back to the page. Not
  // called remove(): that is the element's own removal from the document.


  _removeImage() {
    const previous = this.value;
    if (!previous) return 'empty';
    if (!this.interactive) return 'inactive';

    this._releaseObjectUrl();

    this._value = null;
    const input = this.input();
    if (input) input.value = '';
    this._focusAfterRender = 'choose';
    this.announce(this.text('removed'));
    this.requestComponentUpdate('value');

    this._emitValue({
      value: null,
      file: null,
      source: 'remove'
    });

    this.sfEmit('detach', {
      value: previous,
      name: this.name
    });
    return 'applied';
  }

  reject(files, source) {
    const names = files.map(file => this.quote(file.name)).join(', ');
    this.announce(`${this.text('rejected')}: ${names}`);
    this.sfEmit('rejected', {
      files,
      accept: this.accept,
      source
    });
  } // Said in the polite status, as sf-help-mark and sf-copy-button say theirs.
  // Cleared first, so the same words twice are heard twice.


  announce(message) {
    this.announcement = '';
    this.requestComponentUpdate('announce-clear');
    clearTimeout(this._announceTimer);
    this._announceTimer = setTimeout(() => {
      this.announcement = message;
      this.requestComponentUpdate('announce');
    }, 50);
  } // `input` and `change` once each per choice or removal, as a native file
  // input sends them, on the host with the value, the File and the form name.


  _emitValue({
    value,
    file,
    source
  }) {
    this.sfSyncFormState();

    for (const type of ['input', 'change']) this.sfEmit(type, {
      value,
      file,
      source,
      name: this.name
    });
  }

  _releaseObjectUrl() {
    if (!this._objectUrl) return;

    try {
      URL.revokeObjectURL(this._objectUrl);
    } catch {// Nothing to release.
    }

    this._dimensions.delete(this._objectUrl);

    this._objectUrl = '';
  } // The dialog's own change. It also bubbles out of the host as a plain Event
  // with no detail -- a second change for the one this dispatches -- so it
  // stops here, as sf-color's does.


  onInputChange(event) {
    event.stopPropagation();
    const file = event.target?.files?.[0];
    if (file) this._takeFile(file, 'input');
  }

  onInputEvent(event) {
    event.stopPropagation();
  } // A file held over the field: the whole field is the target, and says so --
  // the border and fill of a selection and the words «Отпустите файл…». Only a
  // drag that carries files is taken, so text dragged across a form is not.


  onDragOver(event) {
    if (!Array.from(event.dataTransfer?.types || []).includes('Files')) return;
    event.preventDefault();

    if (!this.interactive) {
      event.dataTransfer.dropEffect = 'none';
      return;
    }

    event.dataTransfer.dropEffect = 'copy';

    if (!this.dragging) {
      this.dragging = true;
      this.sfHostState('data-dragged-over', true);
      this.requestComponentUpdate('drag');
    }
  }

  onDragLeave(event) {
    const well = event.currentTarget;
    if (event.relatedTarget && well.contains(event.relatedTarget)) return;
    if (!this.dragging) return;
    this.dragging = false;
    this.sfHostState('data-dragged-over', false);
    this.requestComponentUpdate('drag');
  }

  onDrop(event) {
    const types = Array.from(event.dataTransfer?.types || []);
    const files = Array.from(event.dataTransfer?.files || []);
    if (!files.length && !types.includes('Files')) return;
    event.preventDefault();

    if (this.dragging) {
      this.dragging = false;
      this.sfHostState('data-dragged-over', false);
      this.requestComponentUpdate('drag');
    }

    if (!this.interactive || !files.length) return; // One image: the first file the field accepts. The rest are reported, as
    // sf-file-upload reports a drop the accept list leaves out.

    const accepted = files.find(file => (0,_value_mjs__WEBPACK_IMPORTED_MODULE_7__.acceptsFile)(this.accept, file));
    const rejected = files.filter(file => !(0,_value_mjs__WEBPACK_IMPORTED_MODULE_7__.acceptsFile)(this.accept, file));
    if (rejected.length) this.reject(rejected, 'drop');
    if (!accepted) return; // The native input holds the dropped file too, so a form that submits
    // this field sends it under `name` as it sends a picked one.

    const input = this.input();

    if (input && typeof DataTransfer === 'function') {
      try {
        const transfer = new DataTransfer();
        transfer.items.add(accepted);
        input.files = transfer.files;
      } catch {// A browser without a settable FileList still raises the File.
      }
    }

    this._takeFile(accepted, 'drop');
  }

  onImageLoad(event, href) {
    const image = event.target;
    if (!href || !image?.naturalWidth) return;

    const known = this._dimensions.get(href);

    if (known && known.width === image.naturalWidth && known.height === image.naturalHeight) return;

    this._dimensions.set(href, {
      width: image.naturalWidth,
      height: image.naturalHeight
    });

    this.requestComponentUpdate('dimensions');
  }

  onImageError(href) {
    if (!href || this._failed.has(href)) return;

    this._failed.add(href);

    this.requestComponentUpdate('image-error');
  }

  afterRender(callback) {
    if (typeof callback === 'function') return super.afterRender(callback);

    if (this._focusAfterRender) {
      this._focusAfterRender = ''; // The sf-button host, not its inner button: a button drawn in this
      // render has not drawn its own yet, and the host's focus() waits for it.

      this.querySelector(':scope .sf-image-field-actions sf-button:not([disabled])')?.focus({
        preventScroll: true
      });
    }

    this.sfSyncFormState();
    return undefined;
  }

  onDisconnected() {
    clearTimeout(this._announceTimer);
  }

  templateContext() {
    const props = this.getPropsContext();
    const value = this.value;
    const field = (0,_component_field_contract__WEBPACK_IMPORTED_MODULE_3__.createFieldContract)(this, {
      prefix: 'sf-image-field',
      required: this.required,
      // error is a dated alias of invalid (§17.2, aliases.json).
      invalid: this.invalid || this.hasAttribute('error'),
      hint: this.hint,
      errorMessage: this.errorMessage
    });
    const errorContent = this.hasSlotContent?.('error') ? this.getSlotContent('error') : this.errorMessage;
    const hintContent = this.hasSlotContent?.('hint') ? this.getSlotContent('hint') : this.hint;
    const fileName = value?.label || '';
    const words = Object.fromEntries(WORD_KEYS.map(key => [camel(key), this.sfWord(key)]));
    return this.createTemplateContext({ ...props,
      component: this,
      id: this._id,
      field,
      value,
      size: this.size,
      accept: this.accept,
      fileName,
      metaText: this.metaText(value),
      broken: Boolean(value?.href && this._failed.has(value.href)),
      dragging: this.dragging && this.interactive,
      interactive: this.interactive,
      announcement: this.announcement,
      message: field.invalid && errorContent ? errorContent : hintContent,
      messageKind: field.invalid && errorContent ? 'error' : 'hint',
      words,
      names: {
        group: this.label || this.ariaLabel || words.group,
        choose: words.chooseName,
        replace: fileName ? `${words.replaceName} ${this.quote(fileName)}` : words.replaceName,
        remove: fileName ? `${words.removeName} ${this.quote(fileName)}` : words.removeName
      },
      rootClass: this.getRootClass(),
      // The host is the form control where the browser has ElementInternals,
      // so the native file input carries no name (§17.1 item 6).
      controlName: this.sfInternals ? '' : this.name
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_6__.renderImageFieldTemplate)(this.templateContext());
  }

}

SfImageField.define('sf-input-image');

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "15360766166a"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderImageFieldTemplate: () => (/* binding */ renderImageFieldTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
 // The buttons are one rung below the field, as a field's own trailing controls
// are: a size 1 field (a 40px control row) carries size 1/2 buttons.

const BUTTON_SIZE = {
  '1/2': '1/3',
  '1': '1/2',
  '2': '1'
}; // What stands in the thumbnail when there is no picture to show: an invitation
// while the field is empty, a broken image when the address did not load, and
// a plain image glyph for a value the host gave without an address.

function thumbIcon(context) {
  if (!context.value) return 'add_photo_alternate';
  if (context.broken) return 'broken_image';
  return 'image';
}

function renderThumb(context) {
  const {
    value,
    component
  } = context;
  const href = value?.href || '';

  if (href && !context.broken) {
    // The image is fitted, never stretched or cropped: a logo 900×300 stays a
    // logo. alt is the file's name, the one thing the field knows about it.
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<img class="sf-image-field-image" src=${href} alt=${context.fileName}
                     @load=${event => component.onImageLoad(event, href)}
                     @error=${() => component.onImageError(href)}>`;
  }

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class="sf-icon" aria-hidden="true">${thumbIcon(context)}</i>`;
}

function renderActions(context) {
  const {
    component,
    value,
    words,
    names,
    field
  } = context;
  if (context.readonly) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const size = BUTTON_SIZE[context.size] ?? '1/2';
  const describedBy = context.message ? field.messageId : lit__WEBPACK_IMPORTED_MODULE_0__.nothing; // Real buttons with names that say what they act on: «Заменить изображение
  // «logo.png»», each beginning with its visible words so a voice command
  // naming what is seen still reaches it.

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <span class="sf-image-field-actions">
      ${value ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
          <sf-button class="sf-image-field-replace" size=${size} appearance="outline" scheme="on-surface"
                     text=${words.replace} aria-label=${names.replace} aria-describedby=${describedBy}
                     ?disabled=${context.disabled}
                     @click=${() => component.choose()}></sf-button>
          <sf-button class="sf-image-field-remove" size=${size} appearance="link" scheme="on-surface"
                     text=${words.remove} aria-label=${names.remove}
                     ?disabled=${context.disabled}
                     @click=${() => component.removeImage()}></sf-button>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
          <sf-button class="sf-image-field-choose" size=${size} appearance="outline" scheme="on-surface"
                     text=${words.choose} aria-label=${names.choose} aria-describedby=${describedBy}
                     ?disabled=${context.disabled}
                     @click=${() => component.choose()}></sf-button>`}
    </span>
  `;
}

function renderImageFieldTemplate(context) {
  const {
    component,
    field,
    value,
    words
  } = context;
  const labelId = `${context.id}-label`;
  const rootClasses = ['sf-image-field', `sf-image-field--size-${context.size}`, value ? 'sf-image-field--filled' : 'sf-image-field--empty', field.invalid ? 'error' : '', context.dragging ? 'dragover' : '', context.disabled ? 'disabled' : '', context.readonly ? 'readonly' : '', context.rootClass].filter(Boolean);
  const title = context.dragging ? words.drop : value ? context.fileName || words.group : context.emptyText || words.empty;
  const meta = context.dragging ? '' : value ? context.metaText : context.interactive ? words.emptyHint : '';
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div class=${rootClasses.join(' ')} style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
      ${context.label ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
          <span class="sf-image-field-label" id=${labelId}>
            <span class="sf-image-field-label-text">${context.label}</span>
            ${field.required ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-image-field-required">*</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          </span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}

      <div class="sf-image-field-well"
           role="group"
           aria-labelledby=${context.label ? labelId : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
           aria-label=${context.label ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : context.names.group}
           aria-describedby=${context.message ? field.messageId : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
           aria-invalid=${field.invalid ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
           @dragenter=${event => component.onDragOver(event)}
           @dragover=${event => component.onDragOver(event)}
           @dragleave=${event => component.onDragLeave(event)}
           @drop=${event => component.onDrop(event)}>
        <span class="sf-image-field-thumb">${renderThumb(context)}</span>
        <span class="sf-image-field-body">
          <span class="sf-image-field-name">${title}</span>
          ${meta ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-image-field-meta">${meta}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        </span>
        ${renderActions(context)}
      </div>

      <input type="file"
             class="sf-image-field-input"
             id=${field.controlId}
             name=${context.controlName || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
             accept=${context.accept || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
             tabindex="-1"
             aria-hidden="true"
             ?required=${field.required && !value}
             ?disabled=${context.disabled || context.readonly}
             @change=${event => component.onInputChange(event)}
             @input=${event => component.onInputEvent(event)}>

      ${context.message ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span id=${field.messageId} class="sf-image-field-message"
                     data-field-message=${context.messageKind}>${context.message}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}

      <span class="sf-image-field-live" role="status" aria-live="polite" aria-atomic="true">${context.announcement}</span>
    </div>
  `;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "8ddd5798abe5"
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

/***/ "e92fd2d1a38c"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("instance-path", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("instance-path", 1).then(resolve, reject), { once: true })));

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
/* harmony export */   FILE_SIZE_UNITS: () => (/* reexport safe */ _format_js__WEBPACK_IMPORTED_MODULE_0__.FILE_SIZE_UNITS),
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
// formatFileSize(size, units, locale) still reads as it did.


// The last part of an address, decoded, without its query and fragment: the
// name a file is shown under when it has no label.
function fileNameFromAddress(href) {
  const tail = String(href).split(/[?#]/u)[0].split('/').pop() || '';
  try {
    return decodeURIComponent(tail);
  } catch {
    return tail;
  }
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "a5c6bf6ad612"
(__webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   acceptsFile: () => (/* binding */ acceptsFile),
/* harmony export */   formatFileSize: () => (/* reexport safe */ _core_js_format_js__WEBPACK_IMPORTED_MODULE_1__.formatFileSize),
/* harmony export */   normaliseImageValue: () => (/* binding */ normaliseImageValue)
/* harmony export */ });
/* harmony import */ var _core_js_composition_file_size_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("fb0bdf7719f0");
/* harmony import */ var _core_js_format_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b8371b87515");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_composition_file_size_mjs__WEBPACK_IMPORTED_MODULE_0__, _core_js_format_js__WEBPACK_IMPORTED_MODULE_1__]);
([_core_js_composition_file_size_mjs__WEBPACK_IMPORTED_MODULE_0__, _core_js_format_js__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
// The parts of sf-input-image that are about data, not the page: which files
// the field accepts, the shape its value takes and how a size reads. Kept
// apart from the element so the contract tests can run them in Node, as
// sf-resizer's engine.mjs is.

// The size rule is core's format module (core/js/format.js, SF.format.fileSize;
// reuse audit 2026-11-02, finding 7) and the name rule the Composition
// renderer's (composition/file-size.mjs), so a size reads the same in a field,
// on a page and in a Pro list; this module re-exports the formatter.





// Whether a file is one the accept list names: `.ext`, `type/*` or `type/sub`,
// as the platform dialog reads it. The dialog filters what a person may pick;
// a drop goes past it and would take any file at all. It is the rule
// sf-file-upload applies to a drop, written again here rather than imported:
// that module binds every .sf-file-upload on the page as it loads, which a
// page with only an image field has no use for.
function acceptsFile(accept, file) {
  const tokens = String(accept || '').split(',').map((token) => token.trim().toLowerCase()).filter(Boolean);
  if (!tokens.length) return true;
  const name = String(file?.name || '').toLowerCase();
  const type = String(file?.type || '').toLowerCase();
  return tokens.some((token) => {
    if (token.startsWith('.')) return name.endsWith(token);
    if (token.endsWith('/*')) return type.startsWith(token.slice(0, -1));
    return type === token;
  });
}

// The value is the file shape the Framework already uses for a stored file --
// the property-view `file` type and the field renderers' file cell:
// {value, label, mime, size, href}. `value` is the host's id for the file,
// `label` its name, `size` bytes (a number) or text the host already
// formatted, `href` the address the image is shown from. A string is taken as
// the address alone, which is what a page with nothing but a URL has; JSON in
// the attribute is the whole shape. Anything else is no image: null.
function normaliseImageValue(input) {
  if (input === null || input === undefined || input === '') return null;
  let source = input;
  if (typeof source === 'string') {
    const text = source.trim();
    if (!text) return null;
    if (text.startsWith('{')) {
      try {
        source = JSON.parse(text);
      } catch {
        return null;
      }
    } else {
      source = {href: text};
    }
  }
  if (typeof source !== 'object' || Array.isArray(source)) return null;
  const href = source.href ? String(source.href) : '';
  const label = String(source.label ?? source.name ?? (href ? (0,_core_js_composition_file_size_mjs__WEBPACK_IMPORTED_MODULE_0__.fileNameFromAddress)(href) : ''));
  const id = source.value === undefined || source.value === null ? '' : String(source.value);
  if (!href && !label && !id) return null;
  const value = {
    value: id,
    label,
    mime: String(source.mime ?? source.mimeType ?? ''),
    size: typeof source.size === 'number' ? source.size : String(source.size ?? ''),
    href,
  };
  // A file chosen in this page and not stored yet carries the File itself.
  if (source.file) value.file = source.file;
  return value;
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "8278668e929b"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases for the shim (core/js/aliases.js, standard simai.smart-component 1.3.8 §16.20). Event rows send the new name first, then the old one, with one detail; setting rows map the old attribute and property to the new; host-attribute rows (no \\"to\\") stay host attributes read by the browser or the base and are listed, refused by the shim on purpose; documentary rows (\\"shim\\": \\"none\\") record a rename the shim cannot serve.","component":"sf-input-image","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"aria-label","to":null,"kind":"attribute","component":"sf-input-image","since":"2026-10-27","remove_after":"2026-12-01","mode":"host-attribute","section":"§3.1","note":"stays a host attribute, read by the base (§3.1, §4.8); no shim"},{"from":"sf-image-field:select","to":"sf-image-field-attach","kind":"event","component":"sf-input-image","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","cancelable":false,"section":"§8, vocabulary 1.1.5 §9.1","note":"the detail keeps file, source, value and name and adds files: the old fields are all there"},{"from":"sf-image-field:remove","to":"sf-image-field-detach","kind":"event","component":"sf-input-image","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","cancelable":false,"section":"§8, vocabulary 1.1.5 §9.1","note":"same detail"},{"from":"sf-image-field:reject","to":"sf-image-field-rejected","kind":"event","component":"sf-input-image","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","cancelable":false,"section":"§8, vocabulary 1.1.5 §9.1","note":"same detail"},{"from":"error","to":"invalid","kind":"setting","component":"sf-input-image","since":"2026-10-27","remove_after":"2026-12-01","section":"§17.2","note":"error is a dated alias of invalid; the attribute and the property write invalid"},{"from":"sf-image-field","to":"sf-input-image","kind":"tag","component":"sf-input-image","since":"2026-11-03","remove_after":"2027-01-01","section":"rename plan R0 (ui-control RENAME-PLAN-2026-11-03), naming decision 2026-11-02","note":"the element is sf-input-image; sf-image-field is a subclass defined beside it until the date"},{"from":"sf-image-field-attach","to":"sf-input-image-attach","kind":"event","component":"sf-input-image","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-image-field-detach","to":"sf-input-image-detach","kind":"event","component":"sf-input-image","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-image-field-rejected","to":"sf-input-image-rejected","kind":"event","component":"sf-input-image","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"}]}');

/***/ },

/***/ "1a493783d3b8"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.input-image","tag":"sf-input-image","version":"1.2.0","kind":"leaf","settings":{"name":{"type":"string","default":""},"label":{"type":"string","default":""},"hint":{"type":"string","default":""},"accept":{"type":"string","default":"image/*"},"size":{"type":"enum","values":["1/2","1","2"],"default":"1"},"meta":{"type":"string","default":""},"empty-text":{"type":"string","default":""},"required":{"type":"boolean","default":false},"disabled":{"type":"boolean","default":false},"readonly":{"type":"boolean","default":false},"invalid":{"type":"boolean","default":false},"error-message":{"type":"string","default":""}},"values":{"value":{"type":"object","nullable":true,"default":null}},"events":{"change":{"carries":{"value":{"type":"object","nullable":true},"file":{"type":"object","nullable":true},"source":{"type":"enum","values":["input","drop","remove"]},"name":"string"}},"input":{"carries":{"value":{"type":"object","nullable":true},"file":{"type":"object","nullable":true},"source":{"type":"enum","values":["input","drop","remove"]},"name":"string"}},"attach":{"carries":{"files":"list","file":"object","source":{"type":"enum","values":["input","drop"]},"value":"object","name":"string"}},"detach":{"carries":{"value":"object","name":"string"}},"rejected":{"carries":{"files":"list","accept":"string","source":"string"}}},"actions":{"clear":{},"choose":{},"remove-image":{},"take-file":{"with":{"file":"object","source":{"type":"string","optional":true}}},"set-error":{"with":{"message":"string"}}},"form":{"value":"value","name":"name","default":"value","submits":"value","reset":"default","required":"required","disabled":"disabled","readonly":"readonly","validity":["value-missing","custom-error"]},"host-states":{"data-dragged-over":"boolean"},"css-variables":{"--sf-image-field-background-color":{"type":"color","state":"rest"},"--sf-image-field-border-color":{"type":"color","state":"rest"},"--sf-image-field-border-width":{"type":"length"},"--sf-image-field-radius":{"type":"length"},"--sf-image-field-padding-inline":{"type":"length"},"--sf-image-field-padding-block":{"type":"length"},"--sf-image-field-gap":{"type":"length"},"--sf-image-field-thumbnail-size":{"type":"length"},"--sf-image-field-thumbnail-radius":{"type":"length"},"--sf-image-field-thumbnail-background-color":{"type":"color","state":"rest"}}}');

/***/ },

/***/ "6e7f9092a98a"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Image field","runtime":{"bytes":"B","choose":"Choose…","choose-name":"Choose an image","chosen":"Image chosen","drop":"Drop the file to use it","empty":"No image chosen","empty-hint":"Drop a file here or choose one","gigabytes":"GB","group":"Image","kilobytes":"KB","megabytes":"MB","quoted":"“%s”","rejected":"This file is not accepted","remove":"Remove","remove-name":"Remove the image","removed":"Image removed","replace":"Replace…","replace-name":"Replace the image","value-missing":"Choose an image."}}');

/***/ },

/***/ "c317333b88f8"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Поле изображения","runtime":{"bytes":"Б","choose":"Выбрать…","choose-name":"Выбрать изображение","chosen":"Выбрано изображение","drop":"Отпустите файл, чтобы поставить его","empty":"Изображение не выбрано","empty-hint":"Перетащите файл сюда или выберите его","gigabytes":"ГБ","group":"Изображение","kilobytes":"КБ","megabytes":"МБ","quoted":"«%s»","rejected":"Этот файл не подходит","remove":"Убрать","remove-name":"Убрать изображение","removed":"Изображение убрано","replace":"Заменить…","replace-name":"Заменить изображение","value-missing":"Выберите изображение."}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("f99166b49d53");
/******/
/******/ })()
;