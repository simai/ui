/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "1373e294ec38"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BREAKPOINTS: () => (/* binding */ BREAKPOINTS),
/* harmony export */   breakpointMedia: () => (/* binding */ breakpointMedia),
/* harmony export */   breakpointQuery: () => (/* binding */ breakpointQuery),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   matchesBreakpoint: () => (/* binding */ matchesBreakpoint)
/* harmony export */ });
// The Framework's breakpoints for scripts (reuse audit 2026-11-02, finding 6).
// The sheets switch at the steps of core/scss/vars/_sf_var__breakpoint.scss;
// a component that also decides in script (sf-contents, sf-site-header,
// sf-search) had copied the steps by hand, word for word, and nine such
// constants (48rem, 60rem, 1023px, 1024) had drifted apart elsewhere, so one
// admin screen switched at two points. The same values here, and
// tests/breakpoint-ladder.contract.test.mjs holds the two files equal.

/** The ladder: each name is the width it starts at, in rem as the sheets write it. */
const BREAKPOINTS = Object.freeze({
  xs: '0rem',
  sm: '32rem',
  // g6, 512px
  md: '44rem',
  // h1, 704px
  lg: '60rem',
  // h5, 960px
  xl: '72rem',
  // h8, 1152px
  xxl: '80rem' // i0, 1280px

}); // The step under a threshold, as the sheets' media-breakpoint-down writes it:
// one pixel less, in rem (_mix__breakpoint.scss breakpoint-max).

const PIXEL_REM = 1 / 16;
/**
 * The media query of a breakpoint: from its width up, or with `below: true`
 * the widths under it -- the two sides the sheets switch on. An unknown name
 * is null, so a typo is not a query that always matches.
 *
 *   breakpointQuery('md')                  (min-width: 44rem)
 *   breakpointQuery('md', {below: true})   (max-width: 43.9375rem)
 */

function breakpointQuery(name, {
  below = false
} = {}) {
  if (!Object.hasOwn(BREAKPOINTS, name)) return null;
  const rem = Number.parseFloat(BREAKPOINTS[name]);
  if (below) return rem > 0 ? `(max-width: ${rem - PIXEL_REM}rem)` : 'not all';
  return `(min-width: ${rem}rem)`;
}
/** The page's MediaQueryList for a breakpoint, to read and to follow; null without matchMedia or for an unknown name. */

function breakpointMedia(name, {
  below = false,
  view = globalThis
} = {}) {
  const query = breakpointQuery(name, {
    below
  });
  return query && typeof view?.matchMedia === 'function' ? view.matchMedia(query) : null;
}
/** Whether the page is at least as wide as the breakpoint now (or under it, with `below`). */

function matchesBreakpoint(name, options = {}) {
  return breakpointMedia(name, options)?.matches === true;
}
const Breakpoints = Object.freeze({
  ladder: BREAKPOINTS,
  query: breakpointQuery,
  media: breakpointMedia,
  matches: matchesBreakpoint
}); // Core publishes the helper; component bundles that carry their own copy reuse
// an already published one instead of replacing it.

if (typeof globalThis !== 'undefined') {
  globalThis.SF = globalThis.SF || {};
  if (!globalThis.SF.breakpoints) globalThis.SF.breakpoints = Breakpoints;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Breakpoints);

/***/ },

/***/ "eb1d05b3e721"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SfBulkActions: () => (/* binding */ SfBulkActions),
/* harmony export */   actionsThatFit: () => (/* reexport safe */ _js_actions_js__WEBPACK_IMPORTED_MODULE_7__.actionsThatFit),
/* harmony export */   foldActions: () => (/* reexport safe */ _js_actions_js__WEBPACK_IMPORTED_MODULE_7__.foldActions),
/* harmony export */   isDestructiveAction: () => (/* reexport safe */ _js_danger_js__WEBPACK_IMPORTED_MODULE_6__.isDestructiveAction),
/* harmony export */   isLongAction: () => (/* reexport safe */ _js_actions_js__WEBPACK_IMPORTED_MODULE_7__.isLongAction),
/* harmony export */   normalizeAction: () => (/* reexport safe */ _js_actions_js__WEBPACK_IMPORTED_MODULE_7__.normalizeAction),
/* harmony export */   orderActions: () => (/* reexport safe */ _js_danger_js__WEBPACK_IMPORTED_MODULE_6__.orderActions),
/* harmony export */   resultRoute: () => (/* reexport safe */ _js_actions_js__WEBPACK_IMPORTED_MODULE_7__.resultRoute),
/* harmony export */   splitActions: () => (/* reexport safe */ _js_actions_js__WEBPACK_IMPORTED_MODULE_7__.splitActions)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _core_js_layer_stack__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("18003344cff0");
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("43090d1c8307");
/* harmony import */ var _core_js_breakpoints_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("1373e294ec38");
/* harmony import */ var _js_danger_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("d26573af0eef");
/* harmony import */ var _js_actions_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("c514a09893d4");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("d315dddde334");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("461b17ac357b");
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("c6b1d1c7bdb6");
/* harmony import */ var _lang_index_mjs__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("99dc9e122c01");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, _core_js_smart_base__WEBPACK_IMPORTED_MODULE_1__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2__, _core_js_layer_stack__WEBPACK_IMPORTED_MODULE_3__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_4__, _js_templates_default__WEBPACK_IMPORTED_MODULE_8__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, _core_js_smart_base__WEBPACK_IMPORTED_MODULE_1__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2__, _core_js_layer_stack__WEBPACK_IMPORTED_MODULE_3__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_4__, _js_templates_default__WEBPACK_IMPORTED_MODULE_8__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _core_js_layer_stack__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_core_js_page_language__WEBPACK_IMPORTED_MODULE_4__);
// sf-bulk-actions: the group actions bar of a list while items are selected
// (owner decisions C291 (1) and C295, 2026-11-17; study ui-control
// control/research/2026-11-17-sf-bulk-actions/README.md, prototype
// prototypes/sf-bulk-actions-study.html, variant A).
//
//   <sf-bulk-actions count="2" page-count="12" total="240"></sf-bulk-actions>
//   bar.actions = [{id: 'publish', text: 'Опубликовать', icon: 'public'},
//                  {id: 'archive', text: 'В архив', icon: 'archive', undo: true},
//                  {id: 'delete', text: 'Удалить', icon: 'delete'}];
//
// One bar instead of the four copies sf-pagination, sf-view, sf-view-table and
// sf-gallery drew. It is shown while count is above 0: «Выбрано N» and the
// clear cross at the end; up to three labelled actions, the rest in «⋯» (the
// page's one menu, SF.menu.open, C184 (4)), a dangerous action last in it
// after a line and asked about first in the question window (sf-modal
// size="question" with sf-confirm appearance="window", C39). A reversible
// action runs at once and the notice offers «Отменить» (SF.notify, C25).
// After the page is selected, «Выбрать все N» takes all under the filter
// (all-selected, «Только эта страница» back). A short run shows in the bar
// (progress()). Where a result goes (owner decision C387, 2026-11-19, refining
// C295 and C331): a fast action's result is said in the bar in place of the
// count («Удалено: 5», then back), or which failed; a long one (more than 100
// items, or long: true) goes in the background and ends with a notice
// (SF.notify); a failure is written to «Уведомления» too (the notice's
// sf-notification record). The focus is never moved into the bar; Esc in the
// list or the bar clears the selection.
//
// The host list owns the selection, what «all under the filter» means, doing
// an action, undoing it and which items failed: the bar only says and asks.
//
// From its component.json (standard simai.smart-component 1.3.16 §3, §4, §8):
// the settings are made by core/js/element-manifest.js, the words are the
// language files'.













const SIZES = ['1/2', '1', '2'];
const PLACES = ['dock', 'top', 'float', 'inline']; // A run longer than this many items is a job: the host's sf-progress-run (C34).

const SHORT_RUN = _js_actions_js__WEBPACK_IMPORTED_MODULE_7__.LONG_OVER; // How long a fast action's result stays in the bar before it goes back (C387).

const DONE_FOR = 4000; // The failed items a notice names before «и ещё N».

const NAMED_FAILURES = 3; // The live region speaks after the selection settles (Carbon, Shopify).

const SAY_AFTER = 300; // The «⋯» row of the folded offer (C309 (1)): an id no action of a host takes.

const OFFER_ENTRY = 'sf-bulk-actions-offer';
const BulkActionsElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_9__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_1___default()),
  lang: _lang_index_mjs__WEBPACK_IMPORTED_MODULE_11__.files,
  source: 'ru',
  actions: {
    progress({
      done,
      total,
      text
    } = {}) {
      return this.showProgress({
        done,
        total,
        text
      });
    },

    result({
      id,
      ok,
      failed,
      text
    } = {}) {
      return this.showResult({
        id,
        ok,
        failed,
        text
      });
    },

    clear() {
      this.clear();
      return undefined;
    }

  }
});

class SfBulkActions extends BulkActionsElement {
  constructor() {
    super();
    this._run = null;
    this._result = null; // A fast action's result said in place of the count, or a long one's
    // start (C387): {text, kind: done | background}, for DONE_FOR.

    this._done = null; // The actions sent and not answered yet, by id: what result() reports on.

    this._sent = new Map();
    this._announcement = '';
    this._compact = false; // C309 (1): on a phone the offer «Выбрать все N» goes into «⋯» when the
    // row would take a second line; _offerFold is the bar's width it was
    // folded at, so it comes back only on a wider bar (no flicker).

    this._offerFold = null; // LV3-27, LV4-23: the fold by width. _fit is how many of the visible
    // actions stand in the row (null: all of them), _fitAt the bar's width
    // it last folded or tried at, _widths each action button's measured
    // width (by id, words, size and phone), _fitSig what the row was made of.

    this._fit = null;
    this._fitAt = 0;
    this._widths = new Map();
    this._fitSig = '';

    this._onKey = event => this.onDocumentKey(event);
  }

  connectedCallback() {
    super.connectedCallback?.();
    this.ownerDocument.addEventListener('keydown', this._onKey);
    this.watchWidth();
  }

  disconnectedCallback() {
    this.ownerDocument.removeEventListener('keydown', this._onKey);
    this._widthObserver?.disconnect();
    this._widthObserver = null;
    this._rowObserver?.disconnect();
    this._rowObserver = null;
    cancelAnimationFrame(this._fitFrame);
    cancelAnimationFrame(this._compactFrame);
    clearTimeout(this._sayTimer);
    clearTimeout(this._doneTimer);
    super.disconnectedCallback?.();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback?.(name, oldValue, newValue);
    if (oldValue === newValue) return;
    if (name === 'count' || name === 'all-selected') this.selectionChanged(name, oldValue);
  } // The selection moved: «Выбрать все N» lasts while the page stays selected
  // (any other change resets it), a result lasts while its failed items are
  // what is selected, and the live region says the new count.


  selectionChanged(name, oldValue) {
    const count = this.selectedCount;

    if (name === 'count' && this.allSelected && this.pageCount && count !== this.pageCount) {
      this.removeAttribute('all-selected');
      return;
    }

    if (this._result && count !== this._result.failed.length) this._result = null; // A new selection takes the place of a said result; the selection going
    // to none after the action (the rows it deleted) leaves it said.

    if (this._done && count > 0 && name === 'count') this.endDone({
      update: false
    });
    if (this._run) return;
    const before = name === 'count' ? (0,_js_actions_js__WEBPACK_IMPORTED_MODULE_7__.number)(oldValue) : count;
    if (this._done && count === 0) return;
    const all = this.allSelected && this.total ? this.total : 0;
    if (count > 0) this.say(() => all ? this.word('all-text', all) : this.word('count-text', count));else if (before > 0) this.say(() => this.sfWord('cleared-text'));
  } // The size the host gives, or the nearest sized element's around it (the
  // list that places it), or 1.


  get size() {
    const own = this.getAttribute('size');
    if (SIZES.includes(own)) return own;
    const around = this.parentElement?.closest?.('[size]')?.getAttribute('size');
    return SIZES.includes(around) ? around : '1';
  }

  get place() {
    const value = this.getAttribute('place');
    return PLACES.includes(value) ? value : 'dock';
  }

  get selectedCount() {
    return (0,_js_actions_js__WEBPACK_IMPORTED_MODULE_7__.number)(this.getAttribute('count'));
  }

  get pageCount() {
    return (0,_js_actions_js__WEBPACK_IMPORTED_MODULE_7__.number)(this.getAttribute('page-count'));
  }

  get total() {
    return (0,_js_actions_js__WEBPACK_IMPORTED_MODULE_7__.number)(this.getAttribute('total'));
  }

  get allSelected() {
    const raw = this.getAttribute('all-selected');
    return raw !== null && raw !== 'false';
  }
  /** How many the next action goes to: all under the filter, or the selection. */


  get effectiveCount() {
    return this.allSelected && this.total ? this.total : this.selectedCount;
  }
  /** What the bar does now: idle, running a short run, showing a result or a done line. */


  get runState() {
    if (this._run) return 'running';
    if (this._result) return 'result';
    if (this._done) return 'done';
    return this.selectedCount > 0 ? 'shown' : 'hidden';
  }

  word(key, count, vars) {
    return this.sfWord(key, {
      count,
      vars
    });
  }

  formatNumber(value) {
    try {
      return new Intl.NumberFormat((0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_4__.pageLocale)(this) || undefined).format(value);
    } catch {
      return String(value);
    }
  } // The live region, after the selection settles. A line made of the
  // element's own words is passed as a function and made when it is spoken
  // and at every drawing after, so it is in the page's language even when the
  // language part arrives after the mark that asked for it (view round 10,
  // V10-1: the first mark spoke «1 selected» on a Russian page while the
  // part was 400 ms late). The function holds the numbers of its moment.


  say(text) {
    clearTimeout(this._sayTimer);
    this._sayTimer = setTimeout(() => {
      this._announcement = text;
      this.requestComponentUpdate('announcement');
    }, SAY_AFTER);
  }

  get announcement() {
    const said = this._announcement;
    if (typeof said !== 'function') return said ?? '';

    try {
      return String(said() ?? '');
    } catch {
      return '';
    }
  } // Compact below the Framework's sm step, measured on the box the bar
  // stands in (a narrow panel is a phone too).


  watchWidth() {
    const box = this.parentElement;
    if (!box || typeof ResizeObserver !== 'function') return;

    const measure = () => {
      const rem = Number.parseFloat(getComputedStyle(this.ownerDocument.documentElement).fontSize) || 16;
      const width = box.getBoundingClientRect().width || globalThis.innerWidth || 0;
      const compact = width > 0 && width < Number.parseFloat(_core_js_breakpoints_js__WEBPACK_IMPORTED_MODULE_5__.BREAKPOINTS.sm) * rem;
      if (compact === this._compact) return;
      this._compact = compact;
      this.requestComponentUpdate('compact');
    }; // From the observer the switch is made in the next frame (BB-2): drawn
    // inside its call, the new row resized the box it watches and the browser
    // reported a «ResizeObserver loop» on every widening past the sm step.


    this._widthObserver = new ResizeObserver(() => {
      cancelAnimationFrame(this._compactFrame);
      this._compactFrame = requestAnimationFrame(measure);
    });

    this._widthObserver.observe(box);

    measure();
  } // One line on a phone (owner decision C309 (1), 2026-11-18): the bar never
  // wraps under a finger. When its row would take a second line with the
  // offer «Выбрать все N» (or «Только эта страница») shown -- size 1 with a
  // count of hundreds, 90 px in two rows before -- the offer moves into «⋯»
  // as its first row, and comes back when the bar is wider than the width it
  // left at. Read after each draw and on every change of the bar's size.


  afterRender() {
    const root = this.querySelector(':scope > .sf-bulk-actions');

    if (root && typeof ResizeObserver === 'function' && this._rowRoot !== root) {
      this._rowObserver?.disconnect();
      this._rowRoot = root; // The fit is made in the next frame, not inside the observer's call: a
      // fold changes the bar's height, and a change made while the observer
      // delivers is reported as a «ResizeObserver loop» error (LV3-27).

      this._rowObserver = new ResizeObserver(() => {
        cancelAnimationFrame(this._fitFrame);
        this._fitFrame = requestAnimationFrame(() => this.fitRow());
      });

      this._rowObserver.observe(root);
    }

    this.fitRow(); // The held row keeps its size when a button comes in late (a new action
    // button draws after the bar, and clipped it moves no edge the observer
    // sees): the fit is read again in the next frame, once it has drawn.

    cancelAnimationFrame(this._fitFrame);
    this._fitFrame = requestAnimationFrame(() => this.fitRow());
  }

  rowWraps(root) {
    const parts = [...root.querySelectorAll('.sf-bulk-actions__count, .sf-bulk-actions__offer > button, .sf-bulk-actions__actions > * > button, .sf-bulk-actions__more > button, .sf-bulk-actions__clear > button')].map(part => part.getBoundingClientRect()).filter(box => box.height > 0);
    if (parts.length < 2) return false;
    const middles = parts.map(box => box.top + box.height / 2);
    return Math.max(...middles) - Math.min(...middles) > Math.min(...parts.map(box => box.height)) / 2;
  } // The width the row needs on one line (BB-1): the held row never wraps, its
  // parts shrink and overflow instead, so the need is the parts' own widths --
  // a group (the start, the end, the actions) is the sum of its items and its
  // gaps, a host drawn as display: contents is its button.


  rowNeed(element) {
    const items = [];

    const take = node => {
      for (const child of node.children) {
        const style = getComputedStyle(child);
        if (style.display === 'none') continue;
        if (style.display === 'contents') take(child);else items.push(child);
      }
    };

    take(element);
    const gap = Number.parseFloat(getComputedStyle(element).columnGap) || 0;
    const widths = items.map(item => item.matches('.sf-bulk-actions__lead, .sf-bulk-actions__end, .sf-bulk-actions__actions') ? this.rowNeed(item) : item.getBoundingClientRect().width).filter(width => width > 0);
    return widths.reduce((sum, width) => sum + width, 0) + Math.max(0, widths.length - 1) * gap;
  } // Whether the row does not fit: on the held row (sf-bulk-actions--held,
  // one line, clipped) by width; on a row that may wrap (a done line or a
  // result) by its parts' lines.


  rowOverflows(root) {
    if (!root.classList.contains('sf-bulk-actions--held')) return this.rowWraps(root);
    const style = getComputedStyle(root);
    const inner = root.clientWidth - (Number.parseFloat(style.paddingInlineStart) || 0) - (Number.parseFloat(style.paddingInlineEnd) || 0);
    return this.rowNeed(root) > inner + 0.5;
  }

  fitRow() {
    const root = this._rowRoot;
    if (!root || !root.isConnected || root.hidden) return;
    const width = root.getBoundingClientRect().width;
    if (!(width > 0)) return; // Nothing is measured before the bar's own sheet draws it as a row: an
    // unstyled bar stacks its parts and would fold every action (and keep
    // their unstyled widths). The sheet's arrival resizes the bar, and the
    // observer fits it then.

    if (getComputedStyle(root).display !== 'flex') return;
    this.measureActions(root);

    if (!this._compact) {
      if (this._offerFold !== null) {
        this._offerFold = null;
        this.requestComponentUpdate('offer-fold');
        return;
      }
    } else {
      // C309 (1): on a phone the offer goes first, then the actions.
      const offerShown = Boolean(root.querySelector('.sf-bulk-actions__offer'));

      if (this._offerFold === null) {
        if (offerShown && this.rowOverflows(root)) {
          this._offerFold = width;
          this.requestComponentUpdate('offer-fold');
          return;
        }
      } else if (width > this._offerFold + 1) {
        this._offerFold = null;
        this.requestComponentUpdate('offer-fold');
        return;
      }
    }

    this.fitActions(root, width);
  }

  widthKey(action) {
    return `${action.id}|${action.text}|${this.size}|${this._compact ? 'icon' : 'text'}`;
  } // The width of each action button drawn now, kept for when it is in «⋯».


  measureActions(root) {
    for (const host of root.querySelectorAll('.sf-bulk-actions__actions > .sf-bulk-actions__action')) {
      const id = host.getAttribute('data-sf-bulk-action') ?? host.querySelector('[data-sf-bulk-action]')?.getAttribute('data-sf-bulk-action');
      const button = host.localName === 'button' ? host : host.querySelector('button');
      const action = id ? this.findAction(id) : null;
      const box = button?.getBoundingClientRect(); // A button without its sheet yet is not a width to keep.

      const styled = button && getComputedStyle(button).display.includes('flex');
      if (action && styled && box.width > 0) this._widths.set(this.widthKey(action), box.width);
    }
  } // The free width of the row beside what stands in it: the start slot, the
  // count and the offer, and the end group (the actions, «⋯», ×).


  rowRoom(root) {
    const style = getComputedStyle(root);
    const inner = root.clientWidth - (Number.parseFloat(style.paddingInlineStart) || 0) - (Number.parseFloat(style.paddingInlineEnd) || 0);
    return inner - this.rowNeed(root);
  } // LV3-27, LV4-23: the actions fold by width. While the row wraps the last
  // visible action goes into «⋯», one by one (the words never wrap and
  // «Выбрано N» stays on the line); when the row has room for the next one
  // by its measured width it comes back. One not measured yet is tried once
  // the bar is wider than where it last folded.


  fitActions(root, width) {
    const actions = root.querySelector('.sf-bulk-actions__actions');
    if (!actions) return;
    const shown = actions.querySelectorAll(':scope > .sf-bulk-actions__action').length;

    if (this.rowOverflows(root)) {
      if (shown > 0) {
        this._fit = shown - 1;
        this._fitAt = width;
        this.requestComponentUpdate('fit');
      }

      return;
    }

    if (this._fit === null) return;
    const base = this.baseSplit();
    const next = base.visible.slice(this._fit);

    if (!next.length) {
      this._fit = null;
      return;
    }

    const widths = next.map(action => this._widths.get(this.widthKey(action)));
    if (!Number.isFinite(widths[0]) && width <= this._fitAt + 1) return;
    const gap = Number.parseFloat(getComputedStyle(actions).columnGap) || 0;
    const more = actions.querySelector(':scope > .sf-bulk-actions__more > button')?.getBoundingClientRect().width ?? 0;
    const freed = !base.rest.length && !this.offerFolded ? more + gap : 0; // A pixel of slack: a measured width that rounds over the edge is not
    // taken back to wrap and fold again.

    const take = (0,_js_actions_js__WEBPACK_IMPORTED_MODULE_7__.actionsThatFit)({
      room: this.rowRoom(root) - 1,
      widths,
      gap,
      freed
    });
    if (take <= 0) return;
    const fit = this._fit + take;
    this._fit = fit >= base.visible.length ? null : fit;
    this._fitAt = width;
    this.requestComponentUpdate('fit');
  }

  get offerFolded() {
    return this._compact && this._offerFold !== null;
  }

  get actionList() {
    const actions = this.actions;
    return Array.isArray(actions) ? actions : [];
  }

  findAction(id) {
    return this.actionList.map(_js_actions_js__WEBPACK_IMPORTED_MODULE_7__.normalizeAction).find(action => action?.id === id) ?? null;
  } // Why an action cannot go now: its own disabled, or a count outside its min
  // and max (C164 (4): pale, still reached, with its reason).


  unavailableReason(action, count = this.effectiveCount) {
    if (action.max && count > action.max) return action.reason || this.sfWord('max-reason', {
      vars: {
        max: this.formatNumber(action.max)
      }
    });
    if (action.min && count < action.min) return action.reason || this.sfWord('min-reason', {
      vars: {
        min: this.formatNumber(action.min)
      }
    });
    if (action.disabled) return action.reason || '';
    return null;
  } // Escape in the list or the bar clears the selection, unless a menu, a
  // window or a field took it first.


  onDocumentKey(event) {
    if (event.key !== 'Escape' || event.defaultPrevented || this.runState === 'hidden' || this._run) return;
    if ((0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_3__.openLayers)().length) return;
    const target = event.target;
    const editable = target?.isContentEditable || target?.localName === 'textarea' || target?.localName === 'input' && !['checkbox', 'radio', 'button'].includes(target.type);
    if (editable) return;
    const scope = this.parentElement;
    const inScope = target === this.ownerDocument.body || target === this.ownerDocument.documentElement || this.contains(target) || Boolean(scope?.contains?.(target));
    if (!inScope) return;
    event.preventDefault();
    this.clear('escape');
  }

  clear(reason = 'button') {
    this._result = null;
    this.endDone({
      update: false
    });
    const count = this.selectedCount;
    const all = this.allSelected;
    if (all) this.removeAttribute('all-selected');
    this.sfEmit('clear', {
      count,
      scope: all ? 'all' : 'selection',
      reason
    });
    this.requestComponentUpdate('clear');
  }

  selectAll() {
    if (!this.total) return;
    this.setAttribute('all-selected', '');
    this.sfEmit('select-all', {
      total: this.total,
      count: this.selectedCount
    });
    const total = this.total;
    this.say(() => this.word('all-text', total));
  }

  selectPage() {
    this.removeAttribute('all-selected');
    this.sfEmit('select-page', {
      count: this.selectedCount
    });
    const count = this.selectedCount;
    this.say(() => this.word('count-text', count));
  }

  pressAction(id, event) {
    const action = this.findAction(id);
    if (!action) return;

    if (this.unavailableReason(action) !== null) {
      event?.preventDefault?.();
      return;
    }

    this.runAction(action);
  }

  async openMore(anchor) {
    const {
      rest
    } = this.split();
    const count = this.effectiveCount;
    const entries = []; // C309 (1): the folded offer is the menu's first row.

    const offer = this.offerFolded ? this.currentOffer() : null;
    if (offer) entries.push({
      id: OFFER_ENTRY,
      text: offer.text,
      icon: offer.kind === 'all' ? 'select_all' : 'deselect'
    }); // The menu itself draws a destructive row last, after a line (C164 (5)).

    rest.forEach(action => {
      const reason = this.unavailableReason(action, count);
      entries.push({
        id: action.id,
        text: action.text,
        icon: action.icon || undefined,
        status: action.danger ? 'danger' : undefined,
        disabled: reason !== null,
        caption: reason || undefined
      });
    });
    const open = globalThis.SF?.menu?.open;
    if (typeof open !== 'function') return;
    const button = anchor?.querySelector?.('button') ?? anchor;
    const choice = await open({
      anchor: button,
      entries,
      label: this.sfWord('more-text'),
      size: this.size
    });

    if (offer && choice?.id === OFFER_ENTRY) {
      if (offer.kind === 'all') this.selectAll();else this.selectPage();
      return;
    }

    const action = choice?.id ? this.findAction(choice.id) : null;
    if (action && this.unavailableReason(action) === null) this.runAction(action);
  } // One action: the question first when it deletes or asks for one (C39),
  // then the event the host does it on; a reversible one offers «Отменить»
  // in the notice (C25).


  async runAction(action, {
    retry = false
  } = {}) {
    const scope = this.allSelected && this.total && !retry ? 'all' : 'selection';
    const count = retry && this._result ? this._result.failed.length : this.effectiveCount;
    if (!count) return {
      outcome: 'refused',
      reason: 'empty'
    };

    if (action.confirm) {
      const yes = await this.ask(action, count, scope);
      if (!yes) return {
        outcome: 'refused',
        reason: 'declined'
      };
    }

    this._result = null;
    this.endDone({
      update: false
    });
    this._lastAction = action.id; // C387: long (more than 100 items, or the author's long) goes in the
    // background and ends with a notice; the host reads it here too.

    const long = (0,_js_actions_js__WEBPACK_IMPORTED_MODULE_7__.isLongAction)(action, count);
    const detail = {
      id: action.id,
      scope,
      count,
      long
    };
    const allowed = this.sfEmit('action', detail);
    this.requestComponentUpdate('action');
    if (!allowed) return {
      outcome: 'refused',
      reason: 'prevented'
    };

    this._sent.set(action.id, {
      action,
      detail
    });

    if (action.undo) this.offerUndo(action, detail);else if (long) this.showDone(this.sfWord('background-text', {
      vars: {
        action: action.text
      }
    }), 'background');
    return {
      outcome: 'applied'
    };
  } // A line in place of the count for DONE_FOR, then back (C387): a fast
  // action's «Удалено: 5», or a long one's start in the background.


  showDone(text, kind = 'done') {
    clearTimeout(this._doneTimer);
    this._done = {
      text,
      kind
    };
    this.say(text);
    this.requestComponentUpdate('done');
    this._doneTimer = setTimeout(() => this.endDone(), DONE_FOR);
  }

  endDone({
    update = true
  } = {}) {
    clearTimeout(this._doneTimer);
    if (!this._done) return;
    this._done = null;
    if (update) this.requestComponentUpdate('done');
  } // What a done action says: its own word («Удалено: 5») or «Готово: 5».


  doneLine(action, ok) {
    const n = this.formatNumber(ok);
    return action?.doneText ? this.sfWord('done-own-text', {
      count: ok,
      vars: {
        done: action.doneText,
        n
      }
    }) : this.word('done-text', ok);
  } // «Опубликовать: не удалось 2 из 12».


  failureLine(action, shown) {
    return this.sfWord('failure-text', {
      count: shown.failed.length,
      vars: {
        action: action?.text ?? '',
        failed: this.formatNumber(shown.failed.length),
        total: this.formatNumber(shown.total)
      }
    });
  } // A failure for «Уведомления» (C331, C332, C341): one record with the
  // action, how many of how many, the first failed items and why. A long
  // action's is shown as an error notice that stays until closed (C339); a
  // fast one's only recorded (the bar shows it): SF.notify's sf-notification
  // event is what a notification centre writes down.


  noticeFailure({
    action,
    shown,
    show
  }) {
    const notify = globalThis.SF?.notify;
    if (typeof notify !== 'function') return;
    const fallback = this.sfWord('failed-reason');
    const named = shown.failed.slice(0, NAMED_FAILURES).map(item => `${item.text || item.id} — ${item.reason || fallback}`);
    const more = shown.failed.length - named.length;
    if (more > 0) named.push(this.word('more-failed-text', more));
    const title = show ? shown.text : this.failureLine(action, shown);
    notify({
      status: 'error',
      title,
      text: named.join('; '),
      source: 'sf-bulk-actions',
      key: `sf-bulk-actions|${action?.id ?? ''}|${title}`,
      silent: !show,
      actions: show ? [{
        label: this.sfWord('details-text'),
        onSelect: () => this.showDetails(shown)
      }] : undefined
    });
  }

  offerUndo(action, detail) {
    const notify = globalThis.SF?.notify;
    if (typeof notify !== 'function') return;
    notify({
      status: 'success',
      title: this.sfWord('notice-text', {
        vars: {
          action: action.text,
          n: this.formatNumber(detail.count)
        }
      }),
      source: 'sf-bulk-actions',
      actions: [{
        label: this.sfWord('undo-text'),
        onSelect: () => this.sfEmit('undo', detail)
      }]
    });
  } // The question window (C39): sf-modal size="question" holding sf-confirm
  // appearance="window", red, with what will be lost. Answers true for «yes».


  ask(action, count, scope) {
    const doc = this.ownerDocument;
    const own = action.confirm || {};
    const n = this.formatNumber(count);
    const heading = own.question || this.sfWord('question-text', {
      count,
      vars: {
        action: action.text
      }
    });
    const accept = own['accept-text'] || own.acceptText || this.sfWord('accept-text', {
      vars: {
        action: action.text,
        n
      }
    });
    const consequence = own.consequence ?? (action.danger ? this.sfWord('consequence-text') : '');
    const modal = doc.createElement('sf-modal');
    modal.setAttribute('size', 'question');
    modal.setAttribute('heading', heading);
    modal.setAttribute('data-sf-bulk-question', action.id);
    const confirm = doc.createElement('sf-confirm');
    confirm.setAttribute('slot', 'content');
    confirm.setAttribute('appearance', 'window');
    if (action.danger) confirm.setAttribute('status', 'danger');
    confirm.setAttribute('accept-text', accept);
    if (consequence) confirm.setAttribute('consequence', consequence);

    if (scope === 'all') {
      const description = doc.createElement('p');
      description.setAttribute('slot', 'description');
      description.textContent = this.sfWord('all-scope-text', {
        count,
        vars: {
          n
        }
      });
      confirm.append(description);
    }

    modal.append(confirm);
    doc.body.append(modal);
    return new Promise(resolve => {
      let answered = false;

      const finish = value => {
        if (answered) return;
        answered = true;
        doc.removeEventListener('sf-confirm-answer', onAnswer, true);
        if (value) modal.close?.({
          reason: 'api'
        });
        setTimeout(() => modal.remove(), 400);
        resolve(value);
      }; // The window moves its content to the top layer: the answer is heard
      // on the document, from this question only.


      const onAnswer = event => {
        const path = event.composedPath?.() ?? [];
        if (event.target === confirm || path.includes(confirm)) finish(Boolean(event.detail?.accepted));
      };

      doc.addEventListener('sf-confirm-answer', onAnswer, true);
      modal.addEventListener('sf-modal-closed', () => finish(false));
      customElements.whenDefined('sf-modal').then(() => modal.open?.());
      globalThis.SF?.Loader?.ensure?.([modal.localName, confirm.localName], {
        press: true
      });
    });
  } // A short run in the bar: «Выполняем: 4 из 12» over a bar. Over 100 items
  // it is a job for the host's sf-progress-run (C34): refused.


  showProgress({
    done = 0,
    total = 0,
    text = ''
  } = {}) {
    const all = (0,_js_actions_js__WEBPACK_IMPORTED_MODULE_7__.number)(total);
    if (all > SHORT_RUN) return 'long';
    if (!all) return 'invalid';
    const made = Math.min(all, (0,_js_actions_js__WEBPACK_IMPORTED_MODULE_7__.number)(done));
    this._result = null;
    this._run = made >= all ? null : {
      done: made,
      total: all,
      text: String(text || '')
    };
    this.say(() => this.progressText(made, all, text));
    this.requestComponentUpdate('progress');
    return undefined;
  }

  progressText(done, total, text) {
    const vars = {
      done: this.formatNumber(done),
      total: this.formatNumber(total)
    };
    return text ? `${text}: ${vars.done} / ${vars.total}` : this.sfWord('progress-text', {
      vars
    });
  } // How an action went (C387). id names the action (the last one sent when
  // not given). A fast one's result is in place: «Удалено: 5» for a while and
  // back, or «Готово 10 из 12 · 2 не удалось» with «Подробнее» and «Повторить
  // для 2» (the host keeps the failed items selected). A long one's is a
  // notice: success, or an error that stays with «Подробнее». A failure is
  // written to «Уведомления» either way.


  showResult({
    id,
    ok = 0,
    failed = [],
    text = ''
  } = {}) {
    const refusals = (Array.isArray(failed) ? failed : []).map(item => item && typeof item === 'object' ? item : {
      id: String(item ?? '')
    }).map(item => ({
      id: String(item.id ?? ''),
      text: String(item.text ?? item.id ?? ''),
      reason: String(item.reason ?? '')
    }));
    const done = (0,_js_actions_js__WEBPACK_IMPORTED_MODULE_7__.number)(ok);
    const total = done + refusals.length;
    const actionId = id === undefined || id === null || id === '' ? this._lastAction ?? null : String(id);
    const sent = actionId !== null ? this._sent.get(actionId) : null;
    if (sent) this._sent.delete(actionId);
    const action = sent?.action ?? (actionId !== null ? this.findAction(actionId) : null);
    const long = sent?.detail.long ?? false;
    const route = (0,_js_actions_js__WEBPACK_IMPORTED_MODULE_7__.resultRoute)({
      long,
      failed: refusals.length,
      undo: Boolean(action?.undo)
    });
    const line = refusals.length ? text || (long ? this.failureLine(action, {
      failed: refusals,
      total
    }) : [this.sfWord('result-text', {
      vars: {
        ok: this.formatNumber(done),
        total: this.formatNumber(total)
      }
    }), this.word('failed-text', refusals.length)].join(' · ')) : text || this.doneLine(action, done);
    const shown = {
      ok: done,
      total,
      failed: refusals,
      text: line,
      action: actionId
    };

    if (!long) {
      this._run = null;
      this._result = route.bar === 'failed' ? shown : null;
      if (route.bar === 'done') this.showDone(line, 'done');else {
        this.endDone({
          update: false
        });
        this.say(line);
      }
      this.requestComponentUpdate('result');
    } else if (route.notice === 'success') {
      globalThis.SF?.notify?.({
        status: 'success',
        title: line,
        source: 'sf-bulk-actions'
      });
    }

    if (route.record) this.noticeFailure({
      action,
      shown,
      show: long
    });
    return undefined;
  }

  showDetails(shown = this._result) {
    if (!shown) return;
    const doc = this.ownerDocument;
    const modal = doc.createElement('sf-modal');
    modal.setAttribute('size', 'question');
    modal.setAttribute('heading', this.sfWord('details-heading', {
      vars: {
        failed: this.formatNumber(shown.failed.length),
        total: this.formatNumber(shown.total)
      }
    }));
    modal.setAttribute('data-sf-bulk-details', '');
    const content = doc.createElement('div');
    content.setAttribute('slot', 'content');
    const list = doc.createElement('sf-list-description');
    content.append(list);
    modal.append(content);
    doc.body.append(modal);
    const fallback = this.sfWord('failed-reason');
    customElements.whenDefined('sf-list-description').then(() => {
      list.items = shown.failed.map(item => ({
        id: item.id,
        label: item.text || item.id,
        value: item.reason || fallback
      }));
    });
    modal.addEventListener('sf-modal-closed', () => setTimeout(() => modal.remove(), 400));
    customElements.whenDefined('sf-modal').then(() => modal.open?.());
    globalThis.SF?.Loader?.ensure?.([modal.localName, list.localName], {
      press: true
    });
  }

  retry() {
    const action = this._result?.action ? this.findAction(this._result.action) : null;
    if (action) this.runAction(action, {
      retry: true
    });
  } // Up to three labelled actions (one icon button on a phone), by priority.


  baseSplit() {
    return this._compact ? (0,_js_actions_js__WEBPACK_IMPORTED_MODULE_7__.splitActions)(this.actionList, _js_actions_js__WEBPACK_IMPORTED_MODULE_7__.VISIBLE_COMPACT, {
      iconOnly: true
    }) : (0,_js_actions_js__WEBPACK_IMPORTED_MODULE_7__.splitActions)(this.actionList, _js_actions_js__WEBPACK_IMPORTED_MODULE_7__.VISIBLE);
  } // What the row shows: the split, less what the width folds (LV3-27).


  split() {
    return (0,_js_actions_js__WEBPACK_IMPORTED_MODULE_7__.foldActions)(this.baseSplit(), this._fit);
  } // A new set of actions, another size or the phone's row is measured anew.


  resetFit() {
    const sig = [this.size, this._compact ? 'icon' : 'text', ...this.actionList.map((item, index) => (0,_js_actions_js__WEBPACK_IMPORTED_MODULE_7__.normalizeAction)(item, index)).filter(Boolean).map(action => `${action.id}:${action.text}`)].join('|');
    if (sig === this._fitSig) return;
    this._fitSig = sig;
    this._fit = null;
    this._fitAt = 0;
  } // «Выбрать все N» once the whole page is selected and the total is larger;
  // «Только эта страница (N)» while all are; nothing while a run or a result
  // holds the start (a done line keeps it beside it while items are selected).


  currentOffer() {
    if (this._run || this._result) return null;
    const count = this.selectedCount;
    const total = this.total;
    const pageCount = this.pageCount;
    if (this.allSelected && total > 0) return {
      kind: 'page',
      text: this.word('select-page-text', pageCount || count)
    };
    if (total && pageCount && count === pageCount && total > pageCount) return {
      kind: 'all',
      text: this.word('select-all-text', total)
    };
    return null;
  }

  templateContext() {
    this.resetFit();
    const count = this.selectedCount;
    const effective = this.effectiveCount;
    const total = this.total;
    const all = this.allSelected && total > 0;
    const {
      visible,
      rest
    } = this.split();

    const mark = action => {
      const reason = this.unavailableReason(action, effective);
      return { ...action,
        unavailable: reason !== null,
        reason: reason || ''
      };
    };

    const offer = this.currentOffer();
    const folded = Boolean(offer) && this.offerFolded;
    const countText = this.getAttribute('count-text') || (all ? this.word('all-text', total) : this.word('count-text', count));
    const run = this._run ? {
      text: this.progressText(this._run.done, this._run.total, this._run.text),
      percent: Math.round(this._run.done / this._run.total * 100)
    } : null;
    const result = this._result ? {
      text: this._result.text,
      failed: this._result.failed.length,
      details: this.sfWord('details-text'),
      retry: this._result.action ? this.word('retry-text', this._result.failed.length) : ''
    } : null; // A done line in place of the count (C387); the actions stay while items
    // are still selected (an action that keeps them, «В архив»).

    const done = this._done && !this._run && !this._result ? { ...this._done,
      actions: count > 0
    } : null;
    const shown = count > 0 || Boolean(this._run) || Boolean(this._result) || Boolean(done);
    this.sfHostState('data-state', this.runState);
    this.sfHostState('data-place', this.place);
    return this.createTemplateContext({ ...this.getPropsContext(),
      component: this,
      size: this.size,
      place: this.place,
      compact: this._compact,
      shown,
      label: this.label || this.sfWord('label-text'),
      countText,
      offer: folded ? null : offer,
      offerFolded: folded,
      visible: visible.map(mark),
      rest,
      run,
      result,
      done,
      start: this.hasSlotContent('start') ? this.getSlotContent('start') : lit__WEBPACK_IMPORTED_MODULE_0__.nothing,
      end: this.hasSlotContent('end') ? this.getSlotContent('end') : lit__WEBPACK_IMPORTED_MODULE_0__.nothing,
      announcement: this.announcement,
      words: {
        more: this.sfWord('more-text'),
        clear: this.sfWord('clear-text'),
        clearHint: this.sfWord('clear-hint')
      },
      rootClass: this.getRootClass()
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_8__.renderBulkActionsTemplate)(this.templateContext());
  }

}

SfBulkActions.define('sf-bulk-actions');

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "c514a09893d4"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LONG_OVER: () => (/* binding */ LONG_OVER),
/* harmony export */   VISIBLE: () => (/* binding */ VISIBLE),
/* harmony export */   VISIBLE_COMPACT: () => (/* binding */ VISIBLE_COMPACT),
/* harmony export */   actionsThatFit: () => (/* binding */ actionsThatFit),
/* harmony export */   foldActions: () => (/* binding */ foldActions),
/* harmony export */   isLongAction: () => (/* binding */ isLongAction),
/* harmony export */   normalizeAction: () => (/* binding */ normalizeAction),
/* harmony export */   number: () => (/* binding */ number),
/* harmony export */   resultRoute: () => (/* binding */ resultRoute),
/* harmony export */   splitActions: () => (/* binding */ splitActions)
/* harmony export */ });
/* harmony import */ var _danger_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d26573af0eef");
// The actions of the group actions bar as it reads and splits them (owner
// decision C295). Pure: no element, no lit, so the contract tests import it.
 // Visible labelled actions; the rest go to «⋯» (C155 (2)). A phone shows one,
// as an icon button with its name in the tooltip.

const VISIBLE = 3;
const VISIBLE_COMPACT = 1; // An action on more items than this is long (C34's limit, C387): it goes in
// the background and its result comes in a notice, not in the bar.

const LONG_OVER = 100;
const number = value => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.trunc(parsed) : 0;
};
/**
 * One action as the bar reads it. Takes the bar's own shape {id, text, icon,
 * status, confirm, undo, long, done-text, min, max, reason, priority,
 * disabled} and the shapes
 * of the copies it replaces: sf-pagination's {value, text, danger, disabled}
 * and sf-view-table's {id, name}.
 */

function normalizeAction(item, index = 0) {
  if (!item || typeof item !== 'object') return null;
  const id = String(item.id ?? item.value ?? `action-${index + 1}`).trim();
  const text = String(item.text ?? item.name ?? item.label ?? id).trim();
  if (!id && !text) return null;
  const danger = (0,_danger_js__WEBPACK_IMPORTED_MODULE_0__.isDestructiveAction)(item);
  const pinned = item.priority === 'pin';
  const priority = pinned ? 0 : Number.isFinite(Number(item.priority)) && item.priority !== null && item.priority !== '' ? Math.max(1, Math.trunc(Number(item.priority))) : Number.POSITIVE_INFINITY;
  let confirm = null;
  if (item.confirm && typeof item.confirm === 'object') confirm = { ...item.confirm
  };else if (item.confirm === true || danger && item.confirm !== false) confirm = {};
  return {
    id: id || `action-${index + 1}`,
    text: text || id,
    icon: String(item.icon ?? '').trim(),
    status: danger ? 'danger' : '',
    danger,
    confirm,
    undo: item.undo === true,
    // true or false as the author says; null: long over LONG_OVER items.
    long: typeof item.long === 'boolean' ? item.long : null,
    doneText: String(item['done-text'] ?? item.doneText ?? '').trim(),
    min: number(item.min),
    max: number(item.max),
    reason: String(item.reason ?? '').trim(),
    priority,
    pinned,
    disabled: item.disabled === true,
    order: index
  };
}
/**
 * The visible actions and the ones for «⋯»: by priority, the dangerous ones
 * always in «⋯», last. With iconOnly (a phone, where an action is an icon
 * button) an action without an icon never stands in the row: it would draw
 * as a second «⋯»; it goes in «⋯» with its label (GB15 A7).
 */

function splitActions(actions, cap = VISIBLE, {
  iconOnly = false
} = {}) {
  const list = (Array.isArray(actions) ? actions : []).map(normalizeAction).filter(Boolean);
  const safe = list.filter(action => !action.danger).sort((a, b) => a.priority - b.priority || a.order - b.order);
  const danger = list.filter(action => action.danger);
  const visible = (iconOnly ? safe.filter(action => action.icon) : safe).slice(0, cap);
  const rest = [...safe.filter(action => !visible.includes(action)), ...(0,_danger_js__WEBPACK_IMPORTED_MODULE_0__.orderActions)(danger)];
  return {
    visible,
    rest
  };
}
/**
 * Whether an action on count items is long (owner decision C387): what the
 * author says (long true or false), else more than LONG_OVER items. A long
 * one goes in the background and ends with a notice; a fast one says its
 * result in the bar.
 */

function isLongAction(action, count) {
  if (action?.long === true || action?.long === false) return action.long;
  return number(count) > LONG_OVER;
}
/**
 * Where a result goes (C387, C331, C332): a fast action's in the bar (done
 * or the failed ones), a long one's in a notice; a failure is also written to
 * «Уведомления» (the sf-notification record) -- a long one's shown as an
 * error notice that stays, a fast one's only recorded, the bar shows it.
 */

function resultRoute({
  long = false,
  failed = 0,
  undo = false
} = {}) {
  const failures = number(failed) > 0;
  if (long) return {
    bar: null,
    notice: failures ? 'error' : 'success',
    record: failures
  };
  if (failures) return {
    bar: 'failed',
    notice: null,
    record: true
  }; // A reversible action's notice already said it, with «Отменить» (C25).

  return {
    bar: undo ? null : 'done',
    notice: null,
    record: false
  };
}
/**
 * The fold by width (LV3-27, LV4-23): of the visible actions the first fit
 * stand in the row, the others go into «⋯» first, in their order, before the
 * ones that were already there (the dangerous ones stay last). fit null: as
 * split.
 */

function foldActions({
  visible = [],
  rest = []
} = {}, fit = null) {
  if (fit === null || fit === undefined || !Number.isFinite(Number(fit))) return {
    visible,
    rest
  };
  const keep = Math.max(0, Math.min(visible.length, Math.trunc(Number(fit))));
  if (keep >= visible.length) return {
    visible,
    rest
  };
  return {
    visible: visible.slice(0, keep),
    rest: [...visible.slice(keep), ...rest]
  };
}
/**
 * How many more actions fit the row (LV3-27): room is the free width beside
 * the count and the end group, widths the measured widths of the next folded
 * actions (undefined: not measured yet), gap the space before each one, and
 * freed what «⋯» gives back when the last one leaves it. An unmeasured action
 * is tried once (the next drawing measures it, and folds it again when the
 * row wraps). Answers the number of actions to take back.
 */

function actionsThatFit({
  room = 0,
  widths = [],
  gap = 0,
  freed = 0
} = {}) {
  let left = room;
  let taken = 0;

  for (let index = 0; index < widths.length; index += 1) {
    const width = widths[index];
    if (!Number.isFinite(width)) return taken + 1;
    const last = index === widths.length - 1;

    if (width + gap <= left + (last ? freed : 0)) {
      left -= width + gap;
      taken += 1;
    } else break;
  }

  return taken;
}

/***/ },

/***/ "d26573af0eef"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isDestructiveAction: () => (/* binding */ isDestructiveAction),
/* harmony export */   orderActions: () => (/* binding */ orderActions)
/* harmony export */ });
// The one danger rule of the group actions (owner decision C295, defect BA-1:
// sf-pagination, sf-view, sf-view-table and sf-gallery each had a rule of
// their own, or none). An action is dangerous when it says so -- status
// "danger" (C13), or the danger flag of sf-pagination's markup -- or when its
// id deletes: delete, remove, destroy, trash, as a word at the start
// ("remove-all"), never inside another one ("deleted-view").
//
// A dangerous action is red, stands last after a line in the more menu and is
// asked about first (C39) unless it says confirm: false. sf-pagination
// re-exports this file, so a host that imported isDestructiveAction from it
// keeps the same answer.
const DELETING = /^(delete|remove|destroy|trash)\b/iu;
/** Whether an action deletes or cannot be undone. */

function isDestructiveAction(item) {
  if (!item || typeof item !== 'object') return false;
  if (item.status === 'danger' || item.status === 'error' || item.danger === true) return true;
  return DELETING.test(String(item.id ?? item.value ?? ''));
}
/** The actions as listed: as written, the dangerous ones last. */

function orderActions(actions = []) {
  return [...actions].sort((a, b) => Number(isDestructiveAction(a)) - Number(isDestructiveAction(b)));
}

/***/ },

/***/ "d315dddde334"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderBulkActionsTemplate: () => (/* binding */ renderBulkActionsTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var lit_directives_keyed_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("9d9903b87148");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, lit_directives_keyed_js__WEBPACK_IMPORTED_MODULE_1__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, lit_directives_keyed_js__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lit_directives_keyed_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lit_directives_keyed_js__WEBPACK_IMPORTED_MODULE_1__);

 // sf-bulk-actions' markup (owner decision C295; study ui-control
// prototypes/sf-bulk-actions-study.html, variant A). scss/ draws it.
//
//   [start] Выбрано 2 · Выбрать все 240      [Опубликовать] [Переместить] [Экспорт] [⋯] [end] ×
//
// One row, a region named by label: the count (or the host's count-text) and
// the offer to take all under the filter at the start (on a phone, in «⋯»
// when the row would take a second line: C309 (1)); the actions, «⋯» and
// the clear cross at the end. While a short run goes the start says «Выполняем:
// 4 из 12» over a bar; a result with refusals says «Готово 10 из 12 · 2 не
// удалось» with «Подробнее» and «Повторить для 2»; a fast action's result
// says «Удалено: 5» in place of the count for a while, a long action's start
// «Экспорт: идёт в фоне» (C387). The row is a plain row of
// buttons in Tab order, 8 apart (C184: roving is for icon rows), the focus is
// never moved into it.
//
// A Smart button draws its look once, so a button whose look changes (a
// phone's icon button, a danger) is a new button: keyed by what it shows.

function actionButton(context, action) {
  const {
    component,
    size,
    compact
  } = context;

  const press = event => component.pressAction(action.id, event);

  const unavailable = action.unavailable ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const description = action.reason || lit__WEBPACK_IMPORTED_MODULE_0__.nothing;

  if (compact) {
    // A phone's action is an icon button: one without an icon never stands in
    // the row (splitActions iconOnly puts it in «⋯» with its label). Drawn
    // without one it would take a fallback glyph -- «⋯» before 1.2.1 -- and the
    // bar would show two identical «⋯» (View round 14, msg-afb6bff8).
    if (!action.icon) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
    return (0,lit_directives_keyed_js__WEBPACK_IMPORTED_MODULE_1__.keyed)(`${action.id}|icon|${action.status}`, (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button-icon class="sf-bulk-actions__action" data-sf-bulk-action=${action.id}
      size=${size} appearance="ghost" scheme="on-surface" status=${action.status || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} icon=${action.icon}
      aria-label=${action.text} title=${action.reason ? `${action.text} — ${action.reason}` : action.text}
      aria-disabled=${unavailable} aria-description=${description} @click=${press}></sf-button-icon>`);
  }

  return (0,lit_directives_keyed_js__WEBPACK_IMPORTED_MODULE_1__.keyed)(`${action.id}|text|${action.status}|${action.icon}`, (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button class="sf-bulk-actions__action" data-sf-bulk-action=${action.id}
    size=${size} appearance="outline" scheme="on-surface" status=${action.status || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} icon-start=${action.icon || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    text=${action.text} title=${action.reason || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} aria-disabled=${unavailable} aria-description=${description}
    @click=${press}></sf-button>`);
}

function moreButton(context) {
  const {
    component,
    size,
    words
  } = context;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button-icon class="sf-bulk-actions__more" data-sf-bulk-action="more" size=${size} appearance="ghost"
    scheme="on-surface" icon="more_horiz" aria-label=${words.more} aria-haspopup="menu"
    @click=${event => component.openMore(event.currentTarget)}></sf-button-icon>`;
}

function offer(context) {
  const {
    component,
    size
  } = context;
  if (!context.offer) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit_directives_keyed_js__WEBPACK_IMPORTED_MODULE_1__.keyed)(context.offer.kind, (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button class="sf-bulk-actions__offer" data-sf-bulk-offer=${context.offer.kind} size=${size}
    appearance="ghost" scheme="primary" text=${context.offer.text}
    @click=${() => context.offer.kind === 'all' ? component.selectAll() : component.selectPage()}></sf-button>`);
}

function run(context) {
  const {
    run: shown
  } = context;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-bulk-actions__run" data-sf-bulk-run>
    <span class="sf-bulk-actions__say">${shown.text}</span>
    <sf-progress-bar class="sf-bulk-actions__progress" size="1/2" value=${String(shown.percent)}
      label=${shown.text}></sf-progress-bar>
  </div>`;
}

function result(context) {
  const {
    result: shown,
    component,
    size
  } = context;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-bulk-actions__run" data-sf-bulk-result>
    <span class="sf-bulk-actions__say sf-bulk-actions__say--warning">${shown.failed ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-icon class="sf-bulk-actions__warning" icon="warning" size="1/2" aria-hidden="true"></sf-icon>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}<span class="sf-bulk-actions__text">${shown.text}</span></span>
    ${shown.failed ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-bulk-actions__answers">
      <sf-button data-sf-bulk-result-action="details" size=${size} appearance="outline" scheme="on-surface"
        text=${shown.details} @click=${() => component.showDetails()}></sf-button>
      ${shown.retry ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button data-sf-bulk-result-action="retry" size=${size} appearance="outline" scheme="on-surface"
        text=${shown.retry} @click=${() => component.retry()}></sf-button>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    </span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
  </div>`;
} // A fast action's result, or a long one's start, in place of the count (C387).


function done(context) {
  const {
    done: shown
  } = context;
  const icon = shown.kind === 'background' ? 'schedule' : 'check_circle';
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-bulk-actions__lead" data-sf-bulk-done=${shown.kind}>
    <span class="sf-bulk-actions__say sf-bulk-actions__say--done"><sf-icon class=${`sf-bulk-actions__done sf-bulk-actions__done--${shown.kind}`}
      icon=${icon} size="1/2" aria-hidden="true"></sf-icon><span class="sf-bulk-actions__text" title=${shown.text}>${shown.text}</span></span>
    ${shown.actions ? offer(context) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
  </div>`;
}

function renderBulkActionsTemplate(context) {
  const {
    words,
    component,
    size
  } = context;
  const busy = Boolean(context.run || context.result); // The count row is held on one line (BB-1): what does not fit yet is
  // clipped at the end until the code folds it, never a second line for a
  // frame. A run, a result or a done line may still wrap.

  const held = !busy && !context.done;
  const classes = ['sf-bulk-actions', `sf-bulk-actions--${context.place}`, `sf-bulk-actions--size-${size}`, context.compact ? 'sf-bulk-actions--compact' : '', held ? 'sf-bulk-actions--held' : '', context.rootClass].filter(Boolean).join(' ');
  const quiet = busy || Boolean(context.done && !context.done.actions);
  let lead;
  if (busy) lead = context.run ? run(context) : result(context);else if (context.done) lead = done(context);else {
    lead = (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-bulk-actions__lead">
            <span class="sf-bulk-actions__count">${context.countText}</span>
            ${offer(context)}
          </div>`;
  }
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class=${classes} role="region" aria-label=${context.label} ?hidden=${!context.shown}
      aria-busy=${context.run ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing} data-sf-bulk-actions>
      ${context.start}
      ${lead}
      <div class="sf-bulk-actions__end">
        ${quiet ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-bulk-actions__actions">
          ${context.visible.map(action => actionButton(context, action))}
          ${context.rest.length || context.offerFolded ? moreButton(context) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        </div>`}
        ${context.end}
        <sf-button-icon class="sf-bulk-actions__clear" data-sf-bulk-action="clear" size=${size} appearance="ghost"
          scheme="on-surface" icon="close" aria-label=${words.clear} title=${words.clearHint}
          @click=${() => component.clear()}></sf-button-icon>
      </div>
    </div><span class="sf-bulk-actions__status sr-only" role="status" aria-live="polite">${context.announcement}</span>`;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "c6b1d1c7bdb6"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "5b7d7695b41b"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("element-manifest", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("element-manifest", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "18003344cff0"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("layer-stack", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("layer-stack", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "9d9903b87148"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit/directives/keyed.js", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("lit/directives/keyed.js", 1).then(resolve, reject), { once: true })));

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

/***/ "99dc9e122c01"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   files: () => (/* binding */ files)
/* harmony export */ });
/* harmony import */ var _en_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("98c962f987cc");
// Written by scripts/build-language-packs.mjs from src/core/lang/built-in.json
// (owner decision C282); do not edit. The words this bundle carries: the
// built-in languages' (en); every other language comes from
// a language file (core/lang/<code>.js or its parts).


const files = { en: { runtime: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime } };

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ en: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime });


/***/ },

/***/ "461b17ac357b"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.bulk-actions","tag":"sf-bulk-actions","version":"1.3.2","kind":"leaf","settings":{"count":{"type":"number","integer":true,"min":0,"default":0},"page-count":{"type":"number","integer":true,"min":0,"default":0},"total":{"type":"number","optional":true,"min":0},"all-selected":{"type":"boolean","default":false},"count-text":{"type":"string","default":""},"place":{"type":"enum","values":["dock","top","float","inline"],"default":"dock"},"size":{"type":"enum","values":["1/2","1","2"],"default":"1"},"label":{"type":"string","default-from":"runtime.label-text"},"actions":{"type":"list","default":[],"of":{"id":"id","text":"string","icon":{"type":"icon","optional":true},"status":{"type":"enum","values":["","danger"],"optional":true},"confirm":{"type":"object","optional":true},"undo":{"type":"boolean","optional":true},"long":{"type":"boolean","optional":true},"done-text":{"type":"string","optional":true},"min":{"type":"number","optional":true},"max":{"type":"number","optional":true},"reason":{"type":"string","optional":true},"priority":{"type":"number|string","optional":true},"disabled":{"type":"boolean","optional":true}}}},"events":{"action":{"own-verb":true,"cancelable":true,"carries":{"id":{"type":"id"},"scope":{"type":"enum","values":["selection","all"]},"count":{"type":"number"},"long":{"type":"boolean"}}},"undo":{"own-verb":true,"carries":{"id":{"type":"id"},"scope":{"type":"enum","values":["selection","all"]},"count":"number"}},"select-all":{"own-verb":true,"carries":{"total":"number","count":"number"}},"select-page":{"own-verb":true,"carries":{"count":"number"}},"clear":{"own-verb":true,"carries":{"count":"number","scope":{"type":"enum","values":["selection","all"]},"reason":{"type":"enum","values":["button","escape","api"]}}}},"actions":{"progress":{"with":{"done":"number","total":"number","text":{"type":"string","optional":true}}},"result":{"with":{"id":{"type":"id","optional":true},"ok":"number","failed":"list","text":{"type":"string","optional":true}}},"clear":{"with":{}}},"host-states":{"data-state":"string","data-place":"string"},"css-variables":{"--sf-bulk-actions-background":{"type":"color","state":"default"},"--sf-bulk-actions-border-color":{"type":"color","state":"default"},"--sf-bulk-actions-color":{"type":"color","state":"default"},"--sf-bulk-actions-gap":{"type":"length","state":"default"},"--sf-bulk-actions-padding-block":{"type":"length","state":"default"},"--sf-bulk-actions-padding-inline":{"type":"length","state":"default"},"--sf-bulk-actions-radius":{"type":"length","state":"default"}}}');

/***/ },

/***/ "98c962f987cc"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Group actions","runtime":{"label-text":"Actions on the selected","count-text":{"one":"{n} selected","other":"{n} selected"},"all-text":"All {n} selected","select-all-text":"Select all {n}","select-page-text":"Only this page ({n})","more-text":"More actions","clear-text":"Clear selection","clear-hint":"Clear selection (Esc)","cleared-text":"Selection cleared","min-reason":"Select at least {min}","max-reason":"Select at most {max}","question-text":{"one":"{action} {n} item?","other":"{action} {n} items?"},"accept-text":"{action} {n}","consequence-text":"This cannot be undone.","all-scope-text":"All {n} under the current filter.","notice-text":"{action}: {n}","undo-text":"Undo","progress-text":"Working: {done} of {total}","result-text":"Done {ok} of {total}","failed-text":{"one":"{n} failed","other":"{n} failed"},"details-text":"Details","details-heading":"Failed: {failed} of {total}","retry-text":"Retry for {n}","failed-reason":"Refused by the server","done-text":"Done: {n}","done-own-text":"{done}: {n}","background-text":"{action}: running in the background","failure-text":"{action}: {failed} of {total} failed","more-failed-text":{"one":"{n} more","other":"{n} more"}}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("eb1d05b3e721");
/******/
/******/ })()
;