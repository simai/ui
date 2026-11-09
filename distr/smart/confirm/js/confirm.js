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

/***/ "a34f3823bd50"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _helpers_confirm_surface_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("adbddb2f4d35");
/* harmony import */ var _core_js_deprecations__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("d3818183b14c");
/* harmony import */ var _js_templates_default_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("386ef0670247");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("f70b067ace85");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("2382ba7a3e18");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("f357767ed4d2");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _helpers_confirm_surface_js__WEBPACK_IMPORTED_MODULE_2__, _core_js_deprecations__WEBPACK_IMPORTED_MODULE_3__, _js_templates_default_js__WEBPACK_IMPORTED_MODULE_4__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _helpers_confirm_surface_js__WEBPACK_IMPORTED_MODULE_2__, _core_js_deprecations__WEBPACK_IMPORTED_MODULE_3__, _js_templates_default_js__WEBPACK_IMPORTED_MODULE_4__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_deprecations__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_core_js_deprecations__WEBPACK_IMPORTED_MODULE_3__);
// A question put to a person in place, before something happens: a delete
// asked in its row, a member removed from a conversation, a view reset to the
// host's. What will happen, two answers, a pending state while the answer is
// applied, the outcome, and an optional time the question runs out.
//
// The block confirm of SIMAI Framework (owner decision 2026-11-03, component
// sets, point 13; duplication audit 2026-11-03 A-5): the chat and view
// components asked this five times by hand, each with its own buttons, busy
// state and focus. sf-confirm is the block's main member; sf-confirm-change is
// the same surface over values as they were and as they will be. Both take
// their behaviour from ../helpers/confirm-surface.js: the element never
// applies anything, a press moves it to pending and reports the answer, the
// host sets the outcome. An assembly's `ask` opens it and waits (§19.4).
//
// From its component.json (standard simai.smart-component 1.3.8 §3, §4, §8,
// §11): the settings are attributes and properties made by
// core/js/element-manifest.js, its words are lang/<locale>.json, the actions
// answer outcomes, and the answer is the vocabulary's `answer {id, accepted}`.
// It renders into its own light DOM, like every Smart component.








const ConfirmElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_5__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_6__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_7__
  },
  source: "ru"
});
const ConfirmSurface = (0,_helpers_confirm_surface_js__WEBPACK_IMPORTED_MODULE_2__.confirmSurface)(ConfirmElement, {
  kind: "sf-confirm",
  block: "sf-confirm",
  answerId: "confirmId"
});

class SfConfirm extends ConfirmSurface {
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

    this._onKeydown = event => this.onKeydown(event);
  } // What the acceptance does (decision C13): status="danger" for a delete or
  // anything that cannot be undone. destructive is its former name: read as
  // danger and noted once, until 2027-01-01 (change journal
  // setting-confirm-destructive-to-status-danger).


  get danger() {
    if (this.getAttribute("status") === "danger") return true;
    if (!this.getProp("destructive")) return false;

    if (!this._destructiveNoted) {
      this._destructiveNoted = true;
      (0,_core_js_deprecations__WEBPACK_IMPORTED_MODULE_3__.noteDeprecated)({
        component: "sf-confirm",
        tag: "sf-confirm",
        kind: "setting",
        attribute: "destructive",
        from: "destructive",
        to: "status=\"danger\"",
        since: "2026-11-09",
        remove_after: "2027-01-01"
      });
    }

    return true;
  }

  templateContext() {
    const question = this.getProp("question") || "";
    return { ...this.confirmContext(),
      question,
      questionLabel: this.sfWord("question-label"),
      appearance: this.getProp("appearance") === "card" ? "card" : "inline",
      danger: this.danger
    };
  }

  template() {
    return (0,_js_templates_default_js__WEBPACK_IMPORTED_MODULE_4__.renderConfirmTemplate)(this.templateContext());
  }

  onConnected() {
    super.onConnected?.();
    this.addEventListener("keydown", this._onKeydown); // The question put in place of what was pressed (a row's delete): the
    // pressed control is gone, so the focus fell to the page. It goes to
    // the safe answer once the answers are drawn (decision C25). A
    // question printed with the page, before the person did anything,
    // takes nothing.

    if (this.shownState === "open" && focusWasLost(this.ownerDocument)) {
      this.whenRendered(() => {
        if (focusWasLost(this.ownerDocument)) this.focusSafeAnswer();
      });
    }
  }

  onDisconnected() {
    this.removeEventListener("keydown", this._onKeydown);
    super.onDisconnected?.();
  } // Escape takes the question back, as the declining answer does; the key
  // goes no further, so a drawer or a window around the row stays open.


  onKeydown(event) {
    if (event.key !== "Escape" || event.defaultPrevented) return;
    if (this.shownState !== "open" || this.getProp("disabled")) return;
    event.preventDefault();
    event.stopPropagation();
    this.cancel();
  }

} // The focus is nowhere -- on the page itself -- after the person has acted on
// it: the control they pressed left the page.


function focusWasLost(document) {
  const active = document?.activeElement;
  const nowhere = !active || active === document.body || active === document.documentElement;
  return nowhere && globalThis.navigator?.userActivation?.hasBeenActive === true;
}

SfConfirm.define("sf-confirm");
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "386ef0670247"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderConfirmTemplate: () => (/* binding */ renderConfirmTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var _default_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("60eaedaa9073");
/* harmony import */ var _helpers_confirm_surface_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("adbddb2f4d35");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, _helpers_confirm_surface_js__WEBPACK_IMPORTED_MODULE_2__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, _helpers_confirm_surface_js__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);


 // The question, then the status line and the two answers (the confirm
// surface's footer, shared with sf-confirm-change).
//
// The surface is a group named by the question's paragraph: an in-place
// question sits in a row of a list or a panel, where a heading would break the
// page's outline. The question is text, never markup; the description slot
// says more when the question alone does not (what stays, what goes).
//
// The answers call the actions confirm and cancel, which a page reaches as
// data-sf-action="<id>.confirm" and "<id>.cancel" (§8, §19.4). A dangerous
// acceptance (status="danger") is a filled danger answer beside a quiet
// declining one (decision C25); a plain question has two outlined answers.

function renderConfirmTemplate(context) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <section
                class="sf-confirm sf-confirm--${context.appearance} sf-confirm--${context.state}"
                role="group"
                aria-labelledby=${context.question ? context.headingId : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                aria-label=${context.question ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : context.questionLabel}
                data-state=${context.state}
        >
            ${context.question ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<p class="sf-confirm__question" id=${context.headingId}>${context.question}</p>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ${context.hasDescription ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-confirm__description">${context.descriptionContent}</div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ${(0,_helpers_confirm_surface_js__WEBPACK_IMPORTED_MODULE_2__.renderConfirmFooter)(context, "sf-confirm", {
    acceptStatus: context.danger ? "danger" : ""
  })}
        </section>
    `;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "adbddb2f4d35"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CONFIRM_ICON: () => (/* binding */ CONFIRM_ICON),
/* harmony export */   CONFIRM_SIZES: () => (/* binding */ CONFIRM_SIZES),
/* harmony export */   CONFIRM_STATES: () => (/* binding */ CONFIRM_STATES),
/* harmony export */   confirmSurface: () => (/* binding */ confirmSurface),
/* harmony export */   renderConfirmFooter: () => (/* binding */ renderConfirmFooter)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _core_js_instance_path__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("e92fd2d1a38c");
/* harmony import */ var _core_js_format_date_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("e577837dd70a");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_instance_path__WEBPACK_IMPORTED_MODULE_2__, _core_js_format_date_js__WEBPACK_IMPORTED_MODULE_3__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_instance_path__WEBPACK_IMPORTED_MODULE_2__, _core_js_format_date_js__WEBPACK_IMPORTED_MODULE_3__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_instance_path__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_core_js_instance_path__WEBPACK_IMPORTED_MODULE_2__);
// The behaviour of a question put to a person in place: two answers, a
// pending state while the answer is applied, the outcome, and an optional time
// the offer runs out. sf-confirm (the plain question) and
// sf-confirm-change (the same question over values as they were and as they
// will be) are this one surface (duplication audit 2026-11-03, A-5): it was
// written once in sf-confirm-change and five more times by hand in the chat
// and view components (a delete asked in its row, a member removed, a view
// reset).
//
// The element never applies anything. A press moves it to `pending`, which
// takes both answers away so that nothing is pressed twice, and says what is
// happening; the host then sets the outcome -- `accepted`, `declined`, or back
// to `open` when the answer could not be delivered. It is a confirm surface in
// the §19.4 sense: an assembly's `ask` opens it and waits for the answer.
//
// confirmSurface(Base, {kind, block, answerId}) gives a class built from a
// manifest with the settings state, expires-at and disabled, the events
// answer and expired, and the actions open, answer, confirm and cancel:
//   kind      the element's tag, for the heading's instance path (§7.1.1);
//   block     the class of the drawn surface (its __status and __actions);
//   answerId  the setting the host names the question with (carried back).




const CONFIRM_STATES = Object.freeze(["open", "pending", "accepted", "declined", "expired"]); // A timer longer than this is not a timer setTimeout keeps: past 2^31-1 ms it
// fires at once. An offer valid for longer than 24 days is checked again daily.

const LONGEST_WAIT = 24 * 60 * 60 * 1000; // The steps of the control ladder the answers stand on (C22): the element's
// size, else 1, the size of a field and a button beside it. Compactness is
// the region's density (data-sf-density), never a smaller size by hand.

const CONFIRM_SIZES = Object.freeze(["1/3", "1/2", "1", "2", "3"]); // The glyph the status line shows beside its words, per state.

const CONFIRM_ICON = Object.freeze({
  open: "schedule",
  pending: "schedule",
  accepted: "check_circle",
  declined: "cancel",
  expired: "timer_off"
});
function confirmSurface(Base, {
  kind,
  block,
  answerId = "answerId"
} = {}) {
  return class ConfirmSurface extends Base {
    constructor() {
      super();
      this._pressed = null;
      this._timer = null;
      this._expiredSaid = false;
      this._asks = [];
    }

    get state() {
      const value = this.getAttribute("state");
      return CONFIRM_STATES.includes(value) ? value : "open";
    }

    set state(value) {
      this.setAttribute("state", CONFIRM_STATES.includes(value) ? value : "open");
    } // An open offer past its time is expired whatever the attribute says:
    // the host may not have heard yet, and a button that can no longer work
    // must not be pressable in the meantime.


    get expired() {
      if (this.state === "expired") return true;
      if (this.state !== "open") return false;
      const until = Date.parse(this.getAttribute("expires-at") || "");
      return Number.isFinite(until) && Date.now() >= until;
    }

    get shownState() {
      return this.expired ? "expired" : this.state;
    } // The heading's id is the surface's path (§7.1.1), never a counter.


    get headingId() {
      return (0,_core_js_instance_path__WEBPACK_IMPORTED_MODULE_2__.partId)((0,_core_js_instance_path__WEBPACK_IMPORTED_MODULE_2__.instancePath)(this, {
        kind
      }), "heading");
    } // The host's name for the question, carried back in every event. Not
    // named after any setting: sf-confirm's own setting is confirmId.


    get questionKey() {
      return this[answerId] ?? "";
    }

    formatTime(value) {
      const sameDay = (0,_core_js_format_date_js__WEBPACK_IMPORTED_MODULE_3__.calendarDayOffset)(value) === 0;
      return (0,_core_js_format_date_js__WEBPACK_IMPORTED_MODULE_3__.formatDate)(value, {
        node: this,
        intl: sameDay ? {
          hour: "2-digit",
          minute: "2-digit"
        } : {
          day: "numeric",
          month: "long",
          hour: "2-digit",
          minute: "2-digit"
        }
      });
    }

    statusText(shown) {
      if (shown === "pending") return this.sfWord(this._pressed === false ? "declining-text" : "accepting-text");
      if (shown === "accepted") return this.sfWord("accepted-text");
      if (shown === "declined") return this.sfWord("declined-text");
      if (shown === "expired") return this.sfWord("expired-text");
      const until = this.getAttribute("expires-at");
      const time = until ? this.formatTime(until) : "";
      return time ? this.sfWord("until-text", {
        vars: {
          time
        }
      }) : "";
    } // What every template of the surface reads: the state shown, the
    // heading, the status line and the two answers.


    confirmContext() {
      const shown = this.shownState;
      return {
        component: this,
        state: shown,
        headingId: this.headingId,
        heading: this.getProp("heading"),
        headingLevel: this.getProp("headingLevel"),
        hasDescription: this.hasSlotContent("description"),
        descriptionContent: this.hasSlotContent("description") ? this.getSlotContent("description") : null,
        acceptText: this.getProp("acceptText") || this.sfWord("accept-text"),
        declineText: this.getProp("declineText") || this.sfWord("decline-text"),
        statusText: this.statusText(shown),
        statusIcon: CONFIRM_ICON[shown] ?? "schedule",
        open: shown === "open",
        pending: shown === "pending",
        // Which answer is on its way: true, false, or null when the
        // host set pending itself.
        pressed: shown === "pending" ? this._pressed : null,
        // Not named `disabled`: that is the setting, and this is more --
        // the setting, or any state but open.
        answersLocked: this.getProp("disabled") || shown !== "open",
        // The step the answers stand on: a page's size, else 1 (C22).
        size: CONFIRM_SIZES.includes(this.getAttribute("size")) ? this.getAttribute("size") : "1"
      };
    }

    onConnected() {
      super.onConnected?.();
      this.schedule();
    }

    onDisconnected() {
      clearTimeout(this._timer);
      this._timer = null;
      super.onDisconnected?.();
    }

    attributeChangedCallback(name, oldValue, newValue) {
      super.attributeChangedCallback?.(name, oldValue, newValue);
      if (name === "state" && newValue !== "pending") this._pressed = null;

      if (name === "state" || name === "expires-at") {
        // A new time, or the host reopening the offer, is a new chance
        // to run out; the last expiry was about the last time.
        if (name === "expires-at" || newValue === "open") this._expiredSaid = false;
        this.schedule();
      }
    } // One timer, for the moment the offer runs out; nothing polls. When it
    // fires the surface redraws as expired and the host hears it once.


    schedule() {
      clearTimeout(this._timer);
      this._timer = null;
      if (!this.isConnected || this.state !== "open") return;
      const until = Date.parse(this.getAttribute("expires-at") || "");
      if (!Number.isFinite(until)) return;
      const wait = until - Date.now();

      if (wait <= 0) {
        this.expire();
        return;
      }

      this._timer = setTimeout(() => {
        this._timer = null;
        if (Date.now() >= until) this.expire();else this.schedule();
      }, Math.min(wait + 50, LONGEST_WAIT));
    }

    expire() {
      this.requestComponentUpdate("expired");
      this.settleAsks({
        accepted: false,
        reason: "expired"
      });
      if (this._expiredSaid) return;
      this._expiredSaid = true;
      this.sfEmit("expired", {
        id: this.questionKey
      });
    } // ── actions (§4.4) ──────────────────────────────────────────────────

    /**
     * Puts the question again. Asked by an assembly -- a call that hands a
     * signal -- it answers when the person answers or the time runs out,
     * with {accepted, reason, value} (§19.4).
     */


    open(...args) {
      // (params, {signal}): the parameters are none; the second is the ask's.
      const {
        signal
      } = args[1] ?? {};
      const reopened = this.state !== "open";
      if (reopened) this.state = "open"; // The question is put to the person now: focus waits on the safe
      // answer (decision C25), so a stray Enter or Space only takes the
      // question back.

      this.whenRendered(() => this.focusSafeAnswer(), {
        next: reopened
      });
      return signal ? this.waitForAnswer(signal) : (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.applied)();
    }
    /** The person's answer as a call: {accepted: true} confirms, false declines. */


    answer(params = {}) {
      const accepted = this.readAnswer(params);
      if (accepted === null) return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.refused)("unknown");
      if (this.shownState !== "open") return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.refused)("closed");
      if (this.getProp("disabled")) return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.refused)("disabled");
      const focusWasInside = this.contains(this.ownerDocument.activeElement);
      this._pressed = accepted;
      this.setAttribute("state", "pending");
      const delivered = this.sfEmit("answer", {
        id: this.questionKey,
        accepted
      }); // A cancelled event is a host that did not take the answer: the
      // question stands, and the person may answer again.

      if (!delivered) {
        this._pressed = null;
        this.setAttribute("state", "open");
      } else {
        this.settleAsks({
          accepted,
          reason: accepted ? "close" : "cancelled"
        });
      } // The pressed button is gone with the answers; focus moves to the
      // sentence that says what happened rather than falling to the page.


      if (focusWasInside) this.whenRendered(() => this.focusStatus(), {
        next: true
      });
      return delivered ? (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.applied)() : (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.refused)("prevented");
    }
    /** The acceptance (§19.4): data-sf-action="<id>.confirm". */


    confirm() {
      return this.answer({
        accepted: true
      });
    }
    /** The declining answer (vocabulary §5 cancel): data-sf-action="<id>.cancel". */


    cancel() {
      return this.answer({
        accepted: false
      });
    }

    readAnswer(params) {
      if (params && typeof params === "object" && typeof params.accepted === "boolean") return params.accepted;
      return null;
    }

    waitForAnswer(signal) {
      return new Promise(resolve => {
        const ask = {
          resolve
        };

        this._asks.push(ask);

        signal?.addEventListener?.("abort", () => {
          this._asks = this._asks.filter(one => one !== ask);
          resolve({
            outcome: "cancelled"
          });
        }, {
          once: true
        });
      });
    }

    settleAsks({
      accepted,
      reason
    }) {
      const asks = this._asks;
      this._asks = [];

      for (const ask of asks) ask.resolve({
        outcome: "applied",
        value: {
          accepted,
          reason,
          value: null
        }
      });
    }

    focusStatus() {
      const target = this.querySelector(`.${block}__status`);
      if (!target) return;
      if (this.state === "open" && this.focusSafeAnswer()) return;
      target.focus({
        preventScroll: true
      });
    } // The answer that changes nothing -- the declining one -- takes the
    // focus whenever the question is put (decision C25, as Primer's
    // ConfirmationDialog does for a dangerous one): Enter or Space pressed
    // by habit closes the question, and the accepting answer needs a
    // pointer or Tab. Answers false when there is no answer to focus.
    // The surface's after-render can come before the answer can take the
    // focus (its sf-button is drawn, or its region shown, a frame later):
    // the focus then tries again for a few frames, unless the person has
    // moved it meanwhile.


    focusSafeAnswer(frames = 10) {
      if (this.shownState !== "open" || this.getProp("disabled")) return false;
      const host = this.querySelector(`.${block}__actions:not([hidden]) [data-action="decline"]`);
      const button = host?.matches("button") ? host : host?.querySelector("button");
      button?.focus({
        preventScroll: true
      });
      const doc = this.ownerDocument;
      if (button && doc.activeElement === button) return true;
      const view = doc.defaultView;

      if (host && frames > 0 && view?.requestAnimationFrame) {
        view.requestAnimationFrame(() => {
          const active = doc.activeElement;
          if (!active || active === doc.body || this.contains(active)) this.focusSafeAnswer(frames - 1);
        });
      }

      return false;
    }

  };
} // The surface's footer, the same in every template: the status line, then the
// two answers. `block` is the drawn surface's class; `acceptStatus` "danger"
// marks a destructive acceptance (a delete, decision C13).
//
// The answers (decision C25): a plain question offers two outlined answers of
// one weight. A dangerous one fills the accepting answer with the danger
// colour and leaves the declining one quiet (ghost, no frame), so the two are
// told apart by more than the red of a word. Both stand on the element's size
// (context.size, 1 unless the page gives one); a size a template gives is
// relative, so a compact region (data-sf-density, C22) moves them down a step.

function renderConfirmFooter(context, block, {
  acceptStatus = ""
} = {}) {
  const {
    component
  } = context;
  const danger = acceptStatus === "danger" || acceptStatus === "error";
  const size = context.size || "1";
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
            <footer class="${block}__footer">
                <!-- Always in the page, empty while there is nothing to say: a live
                     region that appears together with its words is not heard. -->
                <p class="${block}__status" role="status" tabindex="-1">
                    ${context.statusText ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-icon icon=${context.statusIcon} size="1" aria-hidden="true"></sf-icon>
                            <span>${context.statusText}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                </p>
                <!-- While the answer is applied (pending) the answers stay where they
                     were: the pressed one busy, with the button's own spinner and
                     aria-busy, the other disabled, so the card does not jump and
                     the person sees which answer is on its way. -->
                <div class="${block}__actions" ?hidden=${!context.open && !context.pending}>
                    <sf-button
                            appearance=${danger ? "default" : "outline"}
                            scheme="primary"
                            status=${danger ? "danger" : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                            size=${size}
                            text=${context.acceptText}
                            data-action="accept"
                            ?loading=${context.pressed === true}
                            ?disabled=${context.answersLocked && context.pressed !== true}
                            @click=${() => component.confirm()}
                    ></sf-button>
                    <sf-button
                            appearance=${danger ? "ghost" : "outline"}
                            scheme="on-surface"
                            size=${size}
                            text=${context.declineText}
                            data-action="decline"
                            ?loading=${context.pressed === false}
                            ?disabled=${context.answersLocked && context.pressed !== false}
                            @click=${() => component.cancel()}
                    ></sf-button>
                </div>
            </footer>`;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "60eaedaa9073"
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

/***/ "f70b067ace85"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.confirm","tag":"sf-confirm","version":"1.1.1","kind":"leaf","settings":{"question":{"type":"string","default":""},"state":{"type":"enum","values":["open","pending","accepted","declined","expired"],"default":"open"},"expires-at":{"type":"date","optional":true},"confirm-id":{"type":"id","default":""},"disabled":{"type":"boolean","default":false},"status":{"type":"enum","values":["","danger"],"default":""},"destructive":{"type":"boolean","default":false},"appearance":{"type":"enum","values":["inline","card"],"default":"inline"},"size":{"type":"enum","values":["1/3","1/2","1","2","3"],"default":"1","x-scale":"control"},"accept-text":{"type":"string","default-from":"runtime.accept-text"},"decline-text":{"type":"string","default-from":"runtime.decline-text"}},"values":{},"events":{"answer":{"carries":{"id":{"type":"id"},"accepted":"boolean"},"cancelable":true},"expired":{"carries":{"id":{"type":"id"}},"own-verb":true}},"actions":{"open":{},"answer":{"with":{"accepted":"boolean"},"emits":"answer"},"confirm":{},"cancel":{}},"layer":{"kind":"surface","locks-page":false,"traps-focus":false},"host-states":{},"css-variables":{"--sf-confirm-gap":{"type":"length","state":"default"},"--sf-confirm-inset":{"type":"length","state":"default"},"--sf-confirm-radius":{"type":"length","state":"default"},"--sf-confirm-background-color":{"type":"color","state":"default"},"--sf-confirm-border-color":{"type":"color","state":"default"}}}');

/***/ },

/***/ "2382ba7a3e18"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Confirmation","runtime":{"accept-text":"Confirm","accepted-text":"Done","accepting-text":"Working…","decline-text":"Cancel","declined-text":"Cancelled","declining-text":"Cancelling…","expired-text":"The time to answer has passed","question-label":"Confirmation","until-text":"Answer by {time}"},"events":{"expired":{"label":"Expired"}}}');

/***/ },

/***/ "f357767ed4d2"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Подтверждение","runtime":{"accept-text":"Подтвердить","accepted-text":"Готово","accepting-text":"Выполняется…","decline-text":"Отмена","declined-text":"Отменено","declining-text":"Отменяется…","expired-text":"Время ответа истекло","question-label":"Подтверждение","until-text":"Ответить можно до {time}"},"events":{"expired":{"label":"Время истекло"}}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("a34f3823bd50");
/******/
/******/ })()
;