/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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

/***/ "d8d23d4adc43"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ICONS: () => (/* binding */ ICONS),
/* harmony export */   OUTPUT_LIMIT: () => (/* binding */ OUTPUT_LIMIT),
/* harmony export */   RUN_STATES: () => (/* binding */ RUN_STATES),
/* harmony export */   STEP_STATES: () => (/* binding */ STEP_STATES),
/* harmony export */   SfProgressRun: () => (/* binding */ SfProgressRun),
/* harmony export */   appendOutput: () => (/* binding */ appendOutput),
/* harmony export */   formatTime: () => (/* binding */ formatTime),
/* harmony export */   normalizeSteps: () => (/* binding */ normalizeSteps),
/* harmony export */   runState: () => (/* binding */ runState),
/* harmony export */   stepState: () => (/* binding */ stepState),
/* harmony export */   stepTime: () => (/* binding */ stepTime)
/* harmony export */ });
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _core_js_format_intl_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("15b4e93ff6ed");
/* harmony import */ var _core_js_reading_position__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("6978f1cc153b");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("3bb2b1c9d41d");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("d092c5059e25");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("bb540c15b990");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("7e1b23a85a40");
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("533b90592c77");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_format_intl_js__WEBPACK_IMPORTED_MODULE_2__, _js_templates_default__WEBPACK_IMPORTED_MODULE_4__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_format_intl_js__WEBPACK_IMPORTED_MODULE_2__, _js_templates_default__WEBPACK_IMPORTED_MODULE_4__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
// sf-progress-run: a long job as a person sees it -- creating a site, an
// update, a backup or a restore, an import, a package install:
//
//   <sf-progress-run label="Создание сайта demo.test" cancelable retryable hideable>
//     <script type="application/json" data-sf-settings>
//       {"steps": [{"id": "dns", "title": "Адрес", "state": "done", "duration": 1200},
//                  {"id": "files", "title": "Файлы", "state": "running", "started": "…"}]}
//     </script>
//   </sf-progress-run>
//
//   run.step({id: 'files', state: 'done', duration: 5300});
//   run.chunk({text: 'Copying 120 files…\n'});
//
// The steps with their states and times, a collapsible output pane that
// follows the newest line only while the reader is at its end (core's reading
// position), copy and download, the result once the job ended, and Cancel,
// Retry and Hide as requests to the host. The host drives it: it sets the
// steps (or changes one with step) and appends the output (chunk); the
// component polls nothing and does none of the actions itself.
//
// From its component.json (standard simai.smart-component 1.3.14 §3, §4,
// §8): the settings, values and actions are made by
// core/js/element-manifest.js, the words are the language files'.








 // The ids of a run's parts, one set per run on the page (the same on every
// render, so a first-paint snapshot is stable).

let sequence = 0;
const STEP_STATES = ['waiting', 'running', 'done', 'failed', 'skipped'];
const RUN_STATES = ['waiting', 'running', 'done', 'failed', 'cancelled']; // sf-steps' state glyphs (sf-steps 1.2.0, sf-wizard); waiting is an empty ring.

const ICONS = {
  waiting: 'radio_button_unchecked',
  running: 'progress_activity',
  done: 'check_circle',
  failed: 'error',
  skipped: 'do_not_disturb_on',
  cancelled: 'cancel'
}; // The output a run keeps: the oldest lines leave past this many characters.

const OUTPUT_LIMIT = 500000;

const text = value => value === undefined || value === null ? '' : String(value).trim();
/** A step's state: the five words; anything else is waiting. */


function stepState(value) {
  const word = text(value).toLowerCase();
  return STEP_STATES.includes(word) ? word : 'waiting';
}
/** The steps as given, made safe: an id and a title each, an id once. */

function normalizeSteps(value) {
  const list = Array.isArray(value) ? value : [];
  const seen = new Set();
  const steps = [];

  for (const step of list) {
    if (!step || typeof step !== 'object') continue;
    const id = text(step.id);
    const title = text(step.title);
    if (!id || !title || seen.has(id)) continue;
    seen.add(id);
    const duration = Number(step.duration);
    steps.push({
      id,
      title,
      state: stepState(step.state),
      text: text(step.text),
      started: text(step.started),
      finished: text(step.finished),
      duration: step.duration !== undefined && step.duration !== null && step.duration !== '' && Number.isFinite(duration) && duration >= 0 ? duration : null
    });
  }

  return steps;
}
/** The job's state from its steps: failed, running, done, else waiting. */

function runState(steps) {
  if (steps.some(step => step.state === 'failed')) return 'failed';
  if (steps.some(step => step.state === 'running')) return 'running';
  if (steps.length && steps.every(step => step.state === 'done' || step.state === 'skipped')) return 'done';
  return 'waiting';
}
/** A step's time in milliseconds: its duration, else finished − started; a running step counts to `now`. */

function stepTime(step, now = Date.now()) {
  if (step.duration !== null && step.duration !== undefined) return step.duration;
  const start = (0,_core_js_format_intl_js__WEBPACK_IMPORTED_MODULE_2__.toDate)(step.started);
  if (!start) return null;
  const end = (0,_core_js_format_intl_js__WEBPACK_IMPORTED_MODULE_2__.toDate)(step.finished);
  if (end) return Math.max(0, end.getTime() - start.getTime());
  return step.state === 'running' ? Math.max(0, now - start.getTime()) : null;
}
/** Milliseconds as m:ss, or h:mm:ss over an hour. */

function formatTime(ms) {
  if (ms === null || ms === undefined || !Number.isFinite(ms)) return '';
  const total = Math.floor(ms / 1000);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor(total % 3600 / 60);
  const seconds = String(total % 60).padStart(2, '0');
  return hours ? `${hours}:${String(minutes).padStart(2, '0')}:${seconds}` : `${minutes}:${seconds}`;
}
/** The output with `more` appended, the oldest whole lines dropped past `limit`. */

function appendOutput(output, more, limit = OUTPUT_LIMIT) {
  let next = `${output}${more}`;
  if (next.length <= limit) return next;
  next = next.slice(next.length - limit);
  const line = next.indexOf('\n');
  return line >= 0 && line < next.length - 1 ? next.slice(line + 1) : next;
}
const ProgressRunElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_5__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_6__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_7__
  },
  source: 'ru',
  actions: {
    chunk(args = {}) {
      const more = typeof args === 'string' ? args : args?.text;
      if (more === undefined || more === null || String(more) === '') return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.refused)('invalid');
      this.appendText(String(more));
      return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.applied)();
    },

    clear() {
      this._output = '';
      this.requestComponentUpdate('output');
      return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.applied)();
    },

    step(args = {}) {
      const id = text(args?.id);
      if (!this.steps.some(step => text(step?.id) === id)) return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.refused)('missing'); // The changes belong to the host's current list: one the run has not
      // read yet starts them afresh now, not at the next read (which dropped a
      // change made before the first render).

      this.syncStepsSource();
      const change = {};

      for (const key of ['state', 'text', 'started', 'finished', 'duration']) {
        if (Object.prototype.hasOwnProperty.call(args, key)) change[key] = args[key];
      }

      this._changes.set(id, { ...(this._changes.get(id) ?? {}),
        ...change
      });

      this.requestComponentUpdate('step');
      return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.applied)();
    }

  }
});

class SfProgressRun extends ProgressRunElement {
  constructor() {
    super();
    const n = ++sequence;
    this._ids = {
      heading: `sf-progress-run-heading-${n}`,
      output: `sf-progress-run-output-${n}`
    }; // Changes made with the action step, over the host's list until it sets
    // a new one.

    this._changes = new Map();
    this._stepsSource = undefined;
    this._output = '';
    this._outputSource = undefined;
    this._follow = true;
    this._reading = (0,_core_js_reading_position__WEBPACK_IMPORTED_MODULE_3__.readingPosition)(null);
    this._timer = 0;
  }

  onConnected() {
    super.onConnected?.();
    this.syncTimer();
  }

  onDisconnected() {
    super.onDisconnected?.();
    this.stopTimer();
  } // A new list from the host clears the changes made over the old one.


  syncStepsSource() {
    if (this.steps === this._stepsSource) return;
    this._stepsSource = this.steps;

    this._changes.clear();
  } // The steps the run shows: the host's list with the step changes on it.


  get list() {
    this.syncStepsSource();
    const changed = (Array.isArray(this.steps) ? this.steps : []).map(step => {
      const change = step && typeof step === 'object' ? this._changes.get(text(step.id)) : null;
      return change ? { ...step,
        ...change
      } : step;
    });
    return normalizeSteps(changed);
  } // The job's state: the host's run-state, else worked out from the steps.


  get drawnState() {
    const given = this.runState;
    if (given && given !== 'auto' && RUN_STATES.includes(given)) return given;
    return runState(this.list);
  } // The output: the host's setting, then what chunk appended. A new setting
  // starts it afresh.


  get outputText() {
    const source = this.output ?? '';

    if (source !== this._outputSource) {
      this._outputSource = source;
      this._output = String(source);
    }

    return this._output;
  }

  appendText(more) {
    // Follow the newest line only while the reader is at the end.
    this._follow = !this.outputOpen || this._reading.atEnd();
    this._output = appendOutput(this.outputText, more);
    this.requestComponentUpdate('output');
  }

  toggleOutput(force) {
    const open = force === undefined ? !this.outputOpen : Boolean(force);
    if (open === Boolean(this.outputOpen)) return;
    this._follow = true;
    this.outputOpen = open;
    this.sfEmit('toggle', {
      open
    });
  } // ---------------------------------------------------------------- presses


  onCancel() {
    this.sfEmit('cancel', {}, {
      cancelable: true
    });
  }

  onRetry() {
    this.sfEmit('retry', {});
  }

  onHide() {
    this.sfEmit('close', {
      reason: 'close'
    }, {
      cancelable: true
    });
  }

  onDownload() {
    const name = text(this.fileName) || 'output.txt';
    if (!this.sfEmit('download', {
      'file-name': name
    }, {
      cancelable: true
    })) return;
    const doc = this.ownerDocument;
    const url = URL.createObjectURL(new Blob([this.outputText], {
      type: 'text/plain;charset=utf-8'
    }));
    const link = doc.createElement('a');
    link.href = url;
    link.download = name;
    link.hidden = true;
    doc.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  } // ---------------------------------------------------------------- time
  // One timer per run, only while a step runs with a start: its time counts up.


  syncTimer() {
    const counting = this.isConnected && this.list.some(step => step.state === 'running' && step.started && step.duration === null && !step.finished);
    if (counting && !this._timer) this._timer = setInterval(() => this.requestComponentUpdate('time'), 1000);else if (!counting) this.stopTimer();
  }

  stopTimer() {
    if (this._timer) clearInterval(this._timer);
    this._timer = 0;
  } // ---------------------------------------------------------------- drawing


  templateContext() {
    const list = this.list;
    const state = this.drawnState;
    const ended = state === 'done' || state === 'failed' || state === 'cancelled';

    const word = key => this.sfWord(key);

    this.sfHostState('data-state', state);
    const now = Date.now();
    return this.createTemplateContext({ ...this.getPropsContext(),
      component: this,
      ids: this._ids,
      size: this.size === '1/2' ? '1/2' : '1',
      label: this.label,
      regionLabel: this.label || word('label'),
      steps: list.map(step => ({ ...step,
        time: formatTime(stepTime(step, now)),
        stateWord: word(`state-${step.state}`)
      })),
      state,
      ended,
      resultShown: ended ? this.resultText || word(`result-${state}`) : '',
      outputShown: this.outputText,
      outputOpen: Boolean(this.outputOpen),
      outputLabel: this.outputLabel,
      showCancel: Boolean(this.cancelable) && state === 'running',
      showRetry: Boolean(this.retryable) && (state === 'failed' || state === 'cancelled'),
      showHide: Boolean(this.hideable) && ended,
      icons: ICONS,
      words: {
        steps: word('steps'),
        cancel: word('cancel'),
        retry: word('retry'),
        hide: word('hide'),
        copy: word('copy'),
        download: word('download'),
        emptyOutput: word('empty-output')
      },
      rootClass: this.getRootClass()
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_4__.renderProgressRunTemplate)(this.templateContext());
  }

  afterRender() {
    super.afterRender?.();
    this.syncTimer();
    const pane = this.querySelector('.sf-progress-run-output');
    this._reading.element = pane; // Instant: the page's smooth scrolling would leave a log behind its end
    // while lines arrive faster than the animation.

    if (pane && this._follow) pane.scrollTo({
      top: pane.scrollHeight,
      behavior: 'instant'
    });
  }

}

SfProgressRun.define('sf-progress-run');

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "3bb2b1c9d41d"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderProgressRunTemplate: () => (/* binding */ renderProgressRunTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
 // sf-progress-run's markup (scss/ draws it on one rung of the ladder).
//
// - The root is a region named by label; with a label the label is its
//   heading line.
// - The steps are an ordered list: the state glyph (sf-steps' set, running
//   turning), the title with its state said in words (visually hidden), a
//   line of text, and the time at the end. The running step is aria-current.
// - The result line is a status live region that is always there, so the
//   result is read when the job ends; it holds text only then.
// - The output: a toggle (sf-button, aria-expanded, aria-controls); open, a
//   pre in a scroller of role log (not live, focusable to scroll), with copy
//   (sf-button-copy, the pre as its target) and download.
// - The actions Cancel, Retry and Hide, as their states allow.
// The rung below the run's: texts, times, the output and the buttons.

const BELOW = {
  '1/2': '1/3',
  1: '1/2'
};

const icon = (name, extra = '') => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class=${['sf-icon', 'sf-progress-run-icon', extra].filter(Boolean).join(' ')} aria-hidden="true">${name}</i>`;

function step(context, item) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<li class=${`sf-progress-run-step sf-progress-run-step--${item.state}`} data-id=${item.id} data-state=${item.state}
      aria-current=${item.state === 'running' ? 'step' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
    ${icon(context.icons[item.state], `sf-progress-run-icon--${item.state}`)}
    <div class="sf-progress-run-step-text">
      <span class="sf-progress-run-step-title">${item.title}<span class="sr-only">, ${item.stateWord}</span></span>
      ${item.text ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-progress-run-step-supporting">${item.text}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    </div>
    ${item.time ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-progress-run-time">${item.time}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
  </li>`;
}

function output(context) {
  const {
    component,
    ids,
    size,
    outputOpen,
    words
  } = context;
  const below = BELOW[size];
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-progress-run-output-block">
    <div class="sf-progress-run-output-bar">
      <sf-button class="sf-progress-run-toggle" size=${below} appearance="ghost" text=${context.outputLabel}
        icon-end=${outputOpen ? 'expand_less' : 'expand_more'} expanded=${outputOpen ? 'true' : 'false'} aria-controls=${ids.output}
        @click=${() => component.toggleOutput()}></sf-button>
      ${outputOpen ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-progress-run-output-tools">
        <sf-button-copy class="sf-progress-run-copy" size=${below} appearance="ghost" target=${`#${ids.output}-text`} label=${words.copy}></sf-button-copy>
        <sf-button-icon class="sf-progress-run-download" size=${below} appearance="ghost" icon="download"
          aria-label=${words.download} title=${words.download} @click=${() => component.onDownload()}></sf-button-icon>
      </span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    </div>
    ${outputOpen ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-progress-run-output" id=${ids.output} role="log" aria-live="off" aria-label=${context.outputLabel} tabindex="0">
      <pre class="sf-progress-run-output-text" id=${`${ids.output}-text`}>${context.outputShown}</pre>
      ${context.outputShown ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-progress-run-output-empty">${words.emptyOutput}</span>`}
    </div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
  </div>`;
}

function actions(context) {
  const {
    component,
    size,
    words,
    showCancel,
    showRetry,
    showHide
  } = context;
  if (!showCancel && !showRetry && !showHide) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const below = BELOW[size];
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-progress-run-actions">
    ${showCancel ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button class="sf-progress-run-cancel" size=${below} appearance="outline" text=${words.cancel}
      @click=${() => component.onCancel()}></sf-button>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    ${showRetry ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button class="sf-progress-run-retry" size=${below} appearance="outline" text=${words.retry}
      @click=${() => component.onRetry()}></sf-button>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    ${showHide ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button class="sf-progress-run-hide" size=${below} appearance="ghost" text=${words.hide}
      @click=${() => component.onHide()}></sf-button>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
  </div>`;
}

function renderProgressRunTemplate(context) {
  const {
    size,
    state,
    ended,
    ids,
    label,
    icons
  } = context;
  const classes = ['sf-progress-run', `sf-progress-run--size-${size === '1/2' ? 'half' : '1'}`, `sf-progress-run--${state}`, context.rootClass].filter(Boolean).join(' ');
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<section class=${classes} style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      aria-labelledby=${label ? ids.heading : lit__WEBPACK_IMPORTED_MODULE_0__.nothing} aria-label=${label ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : context.regionLabel}>
    ${label ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-progress-run-heading" id=${ids.heading}>${label}</div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    ${context.steps.length ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<ol class="sf-progress-run-steps" aria-label=${context.words.steps}>${context.steps.map(item => step(context, item))}</ol>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    <div class=${`sf-progress-run-result sf-progress-run-result--${state}`} role="status">
      ${ended ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${icon(icons[state], `sf-progress-run-icon--${state}`)}<span class="sf-progress-run-result-text">${context.resultShown}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    </div>
    ${output(context)}
    ${actions(context)}
  </section>`;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "533b90592c77"
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

/***/ "d092c5059e25"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.progress-run","tag":"sf-progress-run","version":"1.2.2","kind":"leaf","settings":{"label":{"type":"string","default":""},"steps":{"type":"list","schema":{"items":{"type":"object","properties":{"id":{"type":"string"},"title":{"type":"string"},"state":{"type":"string","enum":["waiting","running","done","failed","skipped"]},"text":{"type":"string"},"started":{"type":"string"},"finished":{"type":"string"},"duration":{"type":"number"}},"required":["id","title"]}},"default":[]},"run-state":{"type":"enum","values":["auto","running","done","failed","cancelled"],"default":"auto"},"result-text":{"type":"string","default":""},"output":{"type":"string","default":""},"output-label":{"type":"string","default-from":"runtime.output-label"},"file-name":{"type":"string","default":"output.txt"},"cancelable":{"type":"boolean","default":false},"retryable":{"type":"boolean","default":false},"hideable":{"type":"boolean","default":false},"size":{"type":"enum","values":["1/2","1"],"default":"1"}},"values":{"output-open":{"type":"boolean","default":false}},"events":{"cancel":{"carries":{},"cancelable":true},"retry":{"carries":{}},"close":{"carries":{"reason":{"type":"enum","values":["close"]}},"cancelable":true},"download":{"carries":{"file-name":"string"},"cancelable":true},"toggle":{"carries":{"open":"boolean"}}},"actions":{"chunk":{"with":{"text":"string"}},"clear":{"with":{}},"step":{"with":{"id":"string","state":"string","text":"string","started":"string","finished":"string","duration":"number"}}},"host-states":{"data-state":"string"},"css-variables":{"--sf-progress-run-background-color":{"type":"color","state":"default"},"--sf-progress-run-divider-color":{"type":"color","state":"default"},"--sf-progress-run-output-background-color":{"type":"color","state":"default"},"--sf-progress-run-output-color":{"type":"color","state":"default"},"--sf-progress-run-output-max-height":{"type":"length","state":"default"},"--sf-progress-run-padding-inline":{"type":"length","state":"default"}}}');

/***/ },

/***/ "bb540c15b990"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Progress","runtime":{"label":"Progress","output-label":"Output","steps":"Steps","state-waiting":"waiting","state-running":"running","state-done":"done","state-failed":"failed","state-skipped":"skipped","result-done":"Done","result-failed":"Failed","result-cancelled":"Cancelled","cancel":"Cancel","retry":"Retry","hide":"Hide","copy":"Copy the output","download":"Download the output","empty-output":"No output yet"},"events":{"cancel":{"label":"Cancel"},"retry":{"label":"Retry"},"close":{"label":"Hide"},"download":{"label":"Download the output"}}}');

/***/ },

/***/ "7e1b23a85a40"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Ход выполнения","runtime":{"label":"Ход выполнения","output-label":"Вывод","steps":"Шаги","state-waiting":"ожидает","state-running":"выполняется","state-done":"готово","state-failed":"не удалось","state-skipped":"пропущен","result-done":"Готово","result-failed":"Не удалось","result-cancelled":"Отменено","cancel":"Отменить","retry":"Повторить","hide":"Скрыть","copy":"Скопировать вывод","download":"Скачать вывод","empty-output":"Вывода пока нет"},"events":{"cancel":{"label":"Отменить"},"retry":{"label":"Повторить"},"close":{"label":"Скрыть"},"download":{"label":"Скачать вывод"}}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("d8d23d4adc43");
/******/
/******/ })()
;