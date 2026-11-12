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

/***/ "19a41ad6f9ed"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   KINDS: () => (/* binding */ KINDS),
/* harmony export */   KIND_ICONS: () => (/* binding */ KIND_ICONS),
/* harmony export */   STATES: () => (/* binding */ STATES),
/* harmony export */   STATUSES: () => (/* binding */ STATUSES),
/* harmony export */   SfListTimeline: () => (/* binding */ SfListTimeline),
/* harmony export */   TONES: () => (/* binding */ TONES),
/* harmony export */   actorOf: () => (/* binding */ actorOf),
/* harmony export */   changesOf: () => (/* binding */ changesOf),
/* harmony export */   foldRuns: () => (/* reexport safe */ _js_fold_runs_mjs__WEBPACK_IMPORTED_MODULE_6__.foldRuns),
/* harmony export */   groupByDay: () => (/* binding */ groupByDay),
/* harmony export */   normalizeItems: () => (/* binding */ normalizeItems),
/* harmony export */   statusOf: () => (/* binding */ statusOf)
/* harmony export */ });
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _core_js_format_date_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("e577837dd70a");
/* harmony import */ var _core_js_format_relative_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("ee5c3aad2640");
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("d3818183b14c");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("f63c448cb532");
/* harmony import */ var _js_fold_runs_mjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("70dca54ae5b2");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("39829f681e1c");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("aa092a01f635");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("fce330adc7bb");
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("daf6e145e31a");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_format_date_js__WEBPACK_IMPORTED_MODULE_2__, _core_js_format_relative_js__WEBPACK_IMPORTED_MODULE_3__, _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_4__, _js_templates_default__WEBPACK_IMPORTED_MODULE_5__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_format_date_js__WEBPACK_IMPORTED_MODULE_2__, _core_js_format_relative_js__WEBPACK_IMPORTED_MODULE_3__, _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_4__, _js_templates_default__WEBPACK_IMPORTED_MODULE_5__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_4__);
// sf-list-timeline: a short history read from the top -- recent server
// actions, an audit, a record's history, a notifications page, a job's
// history:
//
//   <sf-list-timeline><script type="application/json" data-sf-settings>
//     {"items": [{"id": "e1", "time": "2026-11-09T14:30:00+03:00", "icon": "swap_horiz",
//       "actor": {"name": "Анна Котова", "hue": "teal"}, "title": "изменила статус",
//       "change": {"label": "Статус", "before": "Собран", "after": "Передан в доставку"}}]}
//   </script></sf-list-timeline>
//
// 1.1 (owner decision C40, R092 option 1) builds the event from the
// Framework's shared parts: the marker on the line is .sf-featured-icon (its
// tone the status; a dot when the event has no icon), the actor sf-avatar
// line and a bold name at the start of the sentence, a field change
// sf-change, the time sf-time in one quiet line «time · text», a comment the
// text in an outline, and the day headings block list's .sf-group-heading.
// Runs of one actor and kind longer than collapse keep their first collapse
// events and fold the rest into «Ещё N», revealed in place; state done|current|upcoming draws steps. The list keeps the
// host's order, and stores and loads nothing.
//
// From its component.json (standard simai.smart-component 1.3.15 §3, §4,
// §8): the settings are made by core/js/element-manifest.js, the words are
// the language files'.










 // The day headings' ids, one set per list on the page (stable across renders).

let sequence = 0;
const STATUSES = ['neutral', 'success', 'warning', 'error', 'info'];
const KINDS = ['event', 'comment', 'sms'];
const STATES = ['done', 'current', 'upcoming']; // The glyph a kind puts on the marker when the event names none.

const KIND_ICONS = {
  comment: 'chat_bubble',
  sms: 'phone_iphone'
}; // The marker's tone: only error, warning and success colour it (C40); info
// is said in words and drawn neutral.

const TONES = {
  error: 'error',
  warning: 'warning',
  success: 'success'
};
const DENSITY_REMOVE_AFTER = '2027-01-01';

const text = value => value === undefined || value === null ? '' : String(value).trim();
/** An event's status: the five words; danger is read as error, anything else as neutral. */


function statusOf(value) {
  const word = text(value).toLowerCase();
  if (word === 'danger') return 'error';
  return STATUSES.includes(word) ? word : 'neutral';
}
/** Who did it: {name, avatar, hue, system}, from a string (1.0) or an object (1.1); null when nobody. */

function actorOf(value) {
  if (value && typeof value === 'object') {
    const name = text(value.name);
    if (!name) return null;
    return {
      name,
      avatar: text(value.avatar),
      hue: text(value.hue),
      system: value.system === true
    };
  }

  const name = text(value);
  return name ? {
    name,
    avatar: '',
    hue: '',
    system: false
  } : null;
}
/** A field change: [{label, before, after}] from one object or a list; [] when none. */

function changesOf(value) {
  const list = Array.isArray(value) ? value : value && typeof value === 'object' ? [value] : [];
  return list.filter(one => one && typeof one === 'object').map(one => ({
    label: text(one.label),
    before: one.before ?? null,
    after: one.after ?? null
  }));
}
/**
 * The events as given, made safe, in the host's order: an event without an
 * id or a title, or with an id seen before, is left out; a time that is no
 * date is none.
 */

function normalizeItems(value) {
  const list = Array.isArray(value) ? value : [];
  const seen = new Set();
  const items = [];

  for (const item of list) {
    if (!item || typeof item !== 'object') continue;
    const id = text(item.id);
    const title = text(item.title);
    if (!id || !title || seen.has(id)) continue;
    seen.add(id);
    const kind = KINDS.includes(text(item.kind)) ? text(item.kind) : 'event';
    const state = STATES.includes(text(item.state)) ? text(item.state) : '';
    items.push({
      id,
      title,
      kind,
      state,
      at: (0,_core_js_format_date_js__WEBPACK_IMPORTED_MODULE_2__.toDate)(typeof item.time === 'number' ? item.time : text(item.time)),
      text: text(item.text),
      actor: actorOf(item.actor),
      status: statusOf(item.status),
      icon: text(item.icon) || KIND_ICONS[kind] || '',
      href: text(item.href),
      changes: changesOf(item.changes ?? item.change)
    });
  }

  return items;
}
/**
 * The events in runs of one calendar day (in the reader's time zone), in
 * their order: [{day, at, items}]. An event without a time joins the run
 * before it; grouping none is one run with no day.
 */

function groupByDay(items, {
  group = 'day',
  now = new Date()
} = {}) {
  if (group !== 'day') return items.length ? [{
    day: null,
    at: null,
    items
  }] : [];
  const runs = [];

  for (const item of items) {
    const day = item.at ? (0,_core_js_format_date_js__WEBPACK_IMPORTED_MODULE_2__.calendarDayOffset)(item.at, {
      now
    }) : null;
    const last = runs[runs.length - 1];
    if (last && (day === null || day === last.day)) last.items.push(item);else runs.push({
      day,
      at: item.at,
      items: [item]
    });
  }

  return runs;
}
const ListTimelineElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_7__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_8__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_9__
  },
  source: 'ru'
});

class SfListTimeline extends ListTimelineElement {
  constructor() {
    super();
    this._uid = `sf-list-timeline-${++sequence}`;
    this._timer = 0;
    this._opened = new Set();
    this._focusRun = null;
  }

  onConnected() {
    super.onConnected?.();
    this.syncTimer();
  }

  onDisconnected() {
    super.onDisconnected?.();
    this.stopTimer();
  } // The moment the day headings count from: the page's now, else the clock.


  get moment() {
    return (0,_core_js_format_date_js__WEBPACK_IMPORTED_MODULE_2__.toDate)(text(this.now)) ?? new Date();
  }

  get list() {
    return normalizeItems(this.items);
  } // The days move at the reader's midnight: one timer to it, with the
  // reader's clock and day headings. The times are sf-time's, which keeps its
  // own clock.


  syncTimer() {
    this.stopTimer();
    if (!this.isConnected || (0,_core_js_format_date_js__WEBPACK_IMPORTED_MODULE_2__.toDate)(text(this.now)) || this.group !== 'day' || !this.list.some(item => item.at)) return;
    this._timer = setTimeout(() => {
      this._timer = 0;
      this.requestComponentUpdate('day');
    }, (0,_core_js_format_date_js__WEBPACK_IMPORTED_MODULE_2__.msUntilNextDay)(new Date()) + 1000);
  }

  stopTimer() {
    if (this._timer) clearTimeout(this._timer);
    this._timer = 0;
  } // density is the page's since 1.1.0 (C22): compact still draws compact
  // until 2027-01-01, noted once in SF.deprecations.


  get compact() {
    if (this.density !== 'compact') return false;

    if (!this._densityNoted) {
      this._densityNoted = true;
      (0,_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_4__.noteDeprecated)({
        component: 'sf-list-timeline',
        kind: 'attribute',
        from: 'density',
        to: 'data-sf-density',
        since: '2026-11-10',
        remove_after: DENSITY_REMOVE_AFTER
      });
    }

    return true;
  } // A title link: the request first; not cancelled, the browser follows it.


  onNavigate(event, item) {
    if (event.defaultPrevented || event.button > 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const allowed = this.sfEmit('navigate', {
      id: item.id,
      href: item.href
    }, {
      cancelable: true
    });
    if (!allowed) event.preventDefault();
  } // «Показать ещё»: the request for the page after the last event shown.


  onMore() {
    if (this.loading) return;
    const list = this.list;
    this.sfEmit('load-more', {
      direction: 'after',
      after: list[list.length - 1]?.id ?? ''
    });
  } // «Ещё N»: the folded events shown in place, the focus on the first of them;
  // expand tells a host that loads a run lazily which run was opened.


  expand(fold) {
    this._opened.add(fold.key);

    this._focusRun = fold.key;
    this.sfEmit('expand', {
      run: fold.key,
      ids: fold.items.map(item => item.id),
      count: fold.items.length
    });
    this.requestComponentUpdate('expand');
  } // What sf-time is asked for: the time under a day heading, auto without.


  timeFormatFor(grouped) {
    const asked = this.timeFormat;
    if (asked === 'relative') return 'relative';
    if (asked === 'exact') return grouped ? 'time' : 'datetime';
    return grouped ? 'time' : 'auto';
  }

  templateContext() {
    const now = this.moment;
    const list = this.list;
    const group = this.group === 'none' ? 'none' : 'day';
    const loading = Boolean(this.loading);
    const level = Math.min(6, Math.max(2, Math.trunc(Number(this.headingLevel)) || 3));
    const collapse = Math.max(0, Math.trunc(Number(this.collapse)));
    this.sfHostState('data-empty', list.length === 0);
    this.sfHostState('data-loading', loading);

    const decorate = item => ({ ...item,
      iso: item.at ? item.at.toISOString() : '',
      tone: TONES[item.status] ?? 'neutral',
      statusWord: item.state ? this.sfWord(`state-${item.state}`) : item.status === 'neutral' ? '' : this.sfWord(`status-${item.status}`)
    });

    const runs = groupByDay(list, {
      group,
      now
    }).map((run, at) => ({
      id: `${this._uid}-day-${at}`,
      day: run.day === null || !run.at ? '' : (0,_core_js_format_relative_js__WEBPACK_IMPORTED_MODULE_3__.formatRelativeDay)(run.at, {
        now,
        capital: true,
        node: this,
        today: this.sfWord('today'),
        yesterday: this.sfWord('yesterday'),
        tomorrow: this.sfWord('tomorrow')
      }),
      date: run.day === 0 || run.day === -1 ? run.at.toISOString() : '',
      entries: (0,_js_fold_runs_mjs__WEBPACK_IMPORTED_MODULE_6__.foldRuns)(run.items, {
        collapse,
        opened: this._opened
      }).map(entry => entry.fold ? {
        fold: { ...entry.fold,
          text: this.sfWord(entry.fold.items.every(item => item.changes.length) ? 'run-changes' : 'run-events', {
            count: entry.fold.items.length,
            vars: {
              n: entry.fold.items.length
            }
          })
        }
      } : {
        item: decorate(entry.item)
      })
    }));
    return this.createTemplateContext({ ...this.getPropsContext(),
      component: this,
      size: ['1/2', '1', '2'].includes(this.size) ? this.size : '1',
      compact: this.compact,
      group,
      level,
      label: this.label,
      runs,
      now: text(this.now),
      // itemFormat, not timeFormat: the time-format prop keeps its own value (auto) in the context.
      itemFormat: this.timeFormatFor(group === 'day'),
      sticky: Boolean(this.stickyHeadings),
      steps: list.some(item => item.state),
      count: list.length,
      hasMore: Boolean(this.hasMore),
      loading,
      moreText: this.sfWord(loading ? 'loading' : 'more'),
      emptyText: this.emptyText,
      rootClass: this.getRootClass()
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_5__.renderListTimelineTemplate)(this.templateContext());
  }

  afterRender() {
    super.afterRender?.();
    this.syncTimer();

    if (this._focusRun) {
      const key = this._focusRun;
      this._focusRun = null;
      const first = [...this.querySelectorAll('.sf-list-timeline-item')].find(li => li.dataset.id === key);

      if (first) {
        first.setAttribute('tabindex', '-1');
        first.focus({
          preventScroll: false
        });
      }
    }
  }

}

SfListTimeline.define('sf-list-timeline');

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "f63c448cb532"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderListTimelineTemplate: () => (/* binding */ renderListTimelineTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
 // sf-list-timeline's markup (scss/ draws it on one rung of the ladder).
//
// 1.1 (owner decision C40, R092 option 1): the event is made of the
// Framework's shared parts.
//
// - The root holds one run per calendar day: block list's heading
//   (.sf-group-heading, role heading at heading-level; the date beside today
//   and yesterday in sf-time) and an ordered list named by it; ungrouped, one
//   list named by label.
// - An event: the rail with its marker (a picture) -- .sf-featured-icon
//   (circle, soft, the rung below's size; neutral, or the tone of error,
//   warning and success) when the event has an icon, else a dot -- on the
//   place's solid surface, so the line does not show through; then the
//   sentence: the status (or step) in words, visually hidden; the actor as
//   sf-avatar line and a bold name (a system actor: the name only); the title
//   (a link with href); a field change as sf-change inline, several as an
//   sf-change list under it. Then one quiet line: sf-time · text. A comment's
//   text stands in an outline under that line.
// - A folded run: a button «Ещё N» on the rail, revealed in place.
// - has-more: an sf-button «Показать ещё» after the last event; with no
//   events, one quiet line.
// The rung below the list's: the marker, the avatar line and the button.

const BELOW = {
  '1/2': '1/3',
  1: '1/2',
  2: '1'
};
const SIZE_CLASS = {
  '1/2': 'half',
  1: '1',
  2: '2'
}; // A step's marker: done is the solid primary circle, current the soft one
// with its ring, upcoming an empty one (list-timeline.html scene B).

const STEP_TONE = {
  done: 'primary sf-featured-icon--solid',
  current: 'primary sf-featured-icon--soft',
  upcoming: 'neutral sf-featured-icon--soft'
};

function marker(context, item) {
  if (!item.icon) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class=${`sf-list-timeline-marker sf-list-timeline-marker--dot sf-list-timeline-marker--${item.status}`}><span class="sf-list-timeline-dot"></span></span>`;
  }

  const tone = item.state ? STEP_TONE[item.state] : `${item.tone} sf-featured-icon--soft`;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class=${`sf-list-timeline-marker sf-list-timeline-marker--${item.state || item.tone}`}><span
    class=${`sf-featured-icon sf-featured-icon--circle sf-featured-icon--size-${BELOW[context.size]} sf-featured-icon--${tone}`}><i
    class="sf-icon sf-list-timeline-icon">${item.icon}</i></span></span>`;
}

function actor(context, item) {
  const who = item.actor;
  if (!who) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const avatar = who.system ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-list-timeline-avatar"><sf-avatar inert aria-hidden="true"
    line=${context.size} aria-label=${who.name} hue=${who.hue || 'auto'} image-url=${who.avatar || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}></sf-avatar></span>`;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${avatar}<b class="sf-list-timeline-actor">${who.name}</b> `;
}

function title(context, item) {
  if (item.href) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<a class="sf-list-timeline-title sf-list-timeline-link" href=${item.href}
      @click=${event => context.component.onNavigate(event, item)}>${item.title}</a>`;
  }

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-list-timeline-title">${item.title}</span>`;
}

function meta(context, item) {
  const time = item.iso ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-time class="sf-list-timeline-time" datetime=${item.iso} format=${context.itemFormat} now=${context.now || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}></sf-time>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const words = item.kind === 'comment' ? '' : item.text;
  if (!item.iso && !words) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<p class="sf-list-timeline-meta">${time}${item.iso && words ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span aria-hidden="true"> · </span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}${words ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-list-timeline-text">${words}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}</p>`;
}

function event(context, item) {
  const said = item.statusWord ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sr-only">${item.statusWord}: </span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const inline = item.changes.length === 1;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<li class="sf-list-timeline-item" data-id=${item.id} data-status=${item.status} data-kind=${item.kind}
      data-state=${item.state || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} aria-current=${item.state === 'current' ? 'step' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
    <span class="sf-list-timeline-rail" aria-hidden="true">${marker(context, item)}</span>
    <div class="sf-list-timeline-body">
      <p class="sf-list-timeline-head">${said}${actor(context, item)}${title(context, item)}${inline ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)` <sf-change class="sf-list-timeline-change" label=${item.changes[0].label}
            before=${item.changes[0].before ?? ''} after=${item.changes[0].after ?? ''}></sf-change>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}</p>
      ${item.changes.length > 1 ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-change class="sf-list-timeline-changes" layout="list" .changes=${item.changes}></sf-change>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      ${meta(context, item)}
      ${item.kind === 'comment' && item.text ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<p class="sf-list-timeline-comment">${item.text}</p>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    </div>
  </li>`;
}

function fold(context, entry) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<li class="sf-list-timeline-item sf-list-timeline-item--fold" data-run=${entry.key}>
    <button type="button" class="sf-list-timeline-run" aria-expanded="false" @click=${() => context.component.expand(entry)}>
      <span class="sf-list-timeline-rail" aria-hidden="true"><span class="sf-list-timeline-marker sf-list-timeline-marker--run"><span
        class=${`sf-featured-icon sf-featured-icon--circle sf-featured-icon--size-${BELOW[context.size]} sf-featured-icon--neutral sf-featured-icon--soft`}><i
        class="sf-icon sf-list-timeline-icon">unfold_more</i></span></span></span>
      <span class="sf-list-timeline-run-text">${entry.text}</span>
    </button>
  </li>`;
}

const entries = (context, list) => list.map(entry => entry.fold ? fold(context, entry.fold) : event(context, entry.item));

function run(context, day) {
  const classes = `sf-list-timeline-list${context.steps ? ' sf-list-timeline-list--steps' : ''}`;

  if (!day.day) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<ol class=${classes} aria-label=${context.label || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>${entries(context, day.entries)}</ol>`;
  }

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-list-timeline-group">
    <div class=${`sf-group-heading sf-list-timeline-day${context.size === '1' ? '' : ` sf-group-heading--size-${context.size}`}${context.sticky ? ' sf-group-heading--sticky' : ''}`}
      role="heading" aria-level=${String(context.level)} id=${day.id}>${day.day}${day.date ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)` <sf-time class="sf-group-heading-date" format="date" tooltip="none" datetime=${day.date}
            now=${context.now || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}></sf-time>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}</div>
    <ol class=${classes} aria-labelledby=${day.id}>${entries(context, day.entries)}</ol>
  </div>`;
}

function renderListTimelineTemplate(context) {
  const {
    size,
    count,
    hasMore,
    loading,
    component
  } = context;
  const classes = ['sf-list-timeline', `sf-list-timeline--size-${SIZE_CLASS[size] ?? '1'}`, count === 0 ? 'sf-list-timeline--empty' : '', context.rootClass].filter(Boolean).join(' ');
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class=${classes} style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} data-sf-density=${context.compact ? 'compact' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
    ${count === 0 ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<p class="sf-list-timeline-quiet">${context.emptyText}</p>` : context.runs.map(day => run(context, day))}
    ${hasMore ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-list-timeline-more">
      <sf-button class="sf-list-timeline-more-button" size=${BELOW[size]} appearance="outline" scheme="on-surface"
        text=${context.moreText} ?loading=${loading} @click=${() => component.onMore()}></sf-button>
    </div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
  </div>`;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "daf6e145e31a"
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

/***/ "70dca54ae5b2"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   foldRuns: () => (/* binding */ foldRuns)
/* harmony export */ });
// sf-list-timeline's collapse rule, on its own so a node test can hold it
// (no element, no sheet).

/**
 * Runs inside one day: consecutive events of one actor and one kind. A run
 * longer than `collapse` keeps its first `collapse` events and folds the rest
 * into one «Ещё N» row (list-timeline.html R092), unless the run was opened;
 * a rest of one event is drawn, since the row would only take its place.
 * Events without an actor (a system log) and steps never make a run: each
 * stands alone, so a list is never folded whole. [{fold: null, item}] for an
 * event, [{fold: {key, items}}] for the folded rest, in order; the key is the
 * first folded id. collapse 0 folds nothing.
 */
function foldRuns(items, {collapse = 5, opened = new Set()} = {}) {
  const out = [];
  const who = (item) => (item.state ? '' : item.actor?.name ?? '');
  let at = 0;
  while (at < items.length) {
    const first = items[at];
    let end = at + 1;
    if (who(first)) {
      while (end < items.length && who(items[end]) === who(first) && items[end].kind === first.kind) end += 1;
    }
    const run = items.slice(at, end);
    const rest = collapse > 0 ? run.slice(collapse) : [];
    if (rest.length > 1 && !opened.has(rest[0].id)) {
      for (const item of run.slice(0, collapse)) out.push({fold: null, item});
      out.push({fold: {key: rest[0].id, items: rest}, item: null});
    } else {
      for (const item of run) out.push({fold: null, item});
    }
    at = end;
  }
  return out;
}


/***/ },

/***/ "39829f681e1c"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.list-timeline","tag":"sf-list-timeline","version":"1.1.1","kind":"leaf","settings":{"items":{"type":"list","schema":{"items":{"type":"object","properties":{"id":{"type":"string"},"time":{"type":"string"},"title":{"type":"string"},"text":{"type":"string"},"actor":{"anyOf":[{"type":"string"},{"type":"object","properties":{"name":{"type":"string"},"avatar":{"type":"string"},"hue":{"type":"string"},"system":{"type":"boolean"}},"required":["name"]}]},"status":{"type":"string","enum":["neutral","success","warning","error","info"]},"icon":{"type":"string"},"href":{"type":"string"},"kind":{"type":"string","enum":["event","comment","sms"]},"state":{"type":"string","enum":["done","current","upcoming"]},"change":{"type":"object","properties":{"label":{"type":"string"},"before":{"type":["string","number","null"]},"after":{"type":["string","number","null"]}}},"changes":{"type":"array","items":{"type":"object","properties":{"label":{"type":"string"},"before":{"type":["string","number","null"]},"after":{"type":["string","number","null"]}}}}},"required":["id","title"]}},"default":[]},"label":{"type":"string","default":""},"group":{"type":"enum","values":["day","none"],"default":"day"},"time-format":{"type":"enum","values":["auto","relative","exact"],"default":"auto"},"now":{"type":"string","default":""},"collapse":{"type":"number","integer":true,"min":0,"default":5},"sticky-headings":{"type":"boolean","default":false},"density":{"type":"enum","values":["normal","compact"],"default":"normal"},"size":{"type":"enum","values":["1/2","1","2"],"default":"1"},"heading-level":{"type":"number","integer":true,"min":2,"max":6,"default":3},"has-more":{"type":"boolean","default":false},"loading":{"type":"boolean","default":false},"empty-text":{"type":"string","default-from":"runtime.empty-text"}},"values":{},"events":{"navigate":{"carries":{"id":"string","href":"string"},"cancelable":true},"load-more":{"carries":{"direction":"string","after":"string"}},"expand":{"carries":{"run":"string","ids":"array","count":"number"}}},"actions":{},"host-states":{"data-empty":"boolean","data-loading":"boolean"},"css-variables":{"--sf-list-timeline-line-color":{"type":"color","state":"default"},"--sf-list-timeline-marker-color":{"type":"color","state":"default"},"--sf-list-timeline-time-color":{"type":"color","state":"default"},"--sf-list-timeline-day-color":{"type":"color","state":"default"},"--sf-list-timeline-gap":{"type":"length","state":"default"},"--sf-list-timeline-padding-inline":{"type":"length","state":"default"}}}');

/***/ },

/***/ "aa092a01f635"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Timeline","runtime":{"empty-text":"No events yet","more":"Show more","loading":"Loading…","today":"Today","yesterday":"Yesterday","tomorrow":"Tomorrow","status-success":"Done","status-warning":"Warning","status-error":"Error","status-info":"Info","state-done":"Done","state-current":"Now","state-upcoming":"Next","run-changes":{"one":"{n} more change","other":"{n} more changes"},"run-events":{"one":"{n} more event","other":"{n} more events"}},"events":{"navigate":{"label":"Go"},"load-more":{"label":"Show more"},"expand":{"label":"Show folded"}}}');

/***/ },

/***/ "fce330adc7bb"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Хронология","runtime":{"empty-text":"Событий пока нет","more":"Показать ещё","loading":"Загружаем…","today":"Сегодня","yesterday":"Вчера","tomorrow":"Завтра","status-success":"Готово","status-warning":"Предупреждение","status-error":"Ошибка","status-info":"Сведения","state-done":"Пройдено","state-current":"Сейчас","state-upcoming":"Впереди","run-changes":{"one":"Ещё {n} изменение","few":"Ещё {n} изменения","many":"Ещё {n} изменений","other":"Ещё {n} изменения"},"run-events":{"one":"Ещё {n} событие","few":"Ещё {n} события","many":"Ещё {n} событий","other":"Ещё {n} события"}},"events":{"navigate":{"label":"Перейти"},"load-more":{"label":"Показать ещё"},"expand":{"label":"Показать свёрнутые"}}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("19a41ad6f9ed");
/******/
/******/ })()
;