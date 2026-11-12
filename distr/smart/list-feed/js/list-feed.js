/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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

/***/ "5dee09797137"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _core_js_reading_position_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("6978f1cc153b");
/* harmony import */ var _js_templates_default_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("93ae64e644ce");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("7595f2639ad9");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("22eb8f8fb40c");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("1002fcd319ac");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default_js__WEBPACK_IMPORTED_MODULE_3__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default_js__WEBPACK_IMPORTED_MODULE_3__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
// A feed: a scrolling column of entries read from the newest at the end --
// a conversation, the comments under a record, an activity history, an audit
// log, a run's activity. The feed variant of block list in SIMAI Framework
// (duplication audit 2026-11-03, A-6; owner decision 2026-11-03, component
// sets, point 13): it takes over the behaviour of ui-pro's sf-message-log,
// which was written for the chat and is needed by every column of the kind.
//
// What an entry *is* stays with the host. The feed draws each one through a
// render function the host gives it (`renderItem`), or, when none is given, as
// plain text with its author's name -- never as HTML. Who wrote an entry is
// data (`author`, `own`), not a role the component interprets: the feed only
// groups consecutive entries of one author into a run and tells the renderer
// where a run starts and ends, which is what an avatar beside the first entry
// and a tail on the last need.
//
// What the feed owns is the reading position, which is the hard part and the
// reason it is a component at all. The rule itself is core's
// (core/js/reading-position.js, SF.readingPosition):
//   - earlier history is prepended without moving what is being read;
//   - a new entry follows the end only if the person was already there, or if
//     it is their own;
//   - «To the latest» brings them back and can take focus there;
//   - reaching the top while there is more asks the host for it, once.
// It fetches nothing and decides nothing: every request leaves as an event.
//
// An entry that grows -- an assistant's reply arriving in parts -- is a stream
// (standard simai.smart-component 1.3.8 §10.8, vocabulary 1.1.5 §5.2): the
// entry carries `growing` while the other side writes it, and the feed reports
// begun, one chunk per change it draws, and exactly one of completed, failed or
// cancelled. cancel {id} stops drawing the growth at once and ends the stream
// cancelled; telling the other side to stop is the host's.
//
// The items are built by hand and kept, not diffed by lit. A changed entry is
// drawn again *in place* (§18.4): its item element stays, and while the focus
// or a selection is inside it the new drawing is laid over the old nodes
// instead of replacing them, so a button the person is on keeps the focus
// through every chunk. The frame (the earlier button, the jump button, the
// live region) is the template; the column of items is one node the template
// places and never replaces.
//
// From its component.json (§3, §4, §8, §11, §18.4): the settings are
// attributes and properties made by core/js/element-manifest.js, the words are
// lang/<locale>.json, the actions answer outcomes.






 // A finished entry is announced whole only up to this length; a screen
// reader reading a long answer in one breath is not a summary of it.

const ANNOUNCE_LIMIT = 240;

const applied = () => ({
  outcome: "applied"
});

const refused = reason => ({
  outcome: "refused",
  reason
}); // What decides whether an entry is drawn again. The host typically hands the
// feed a fresh object for every poll, so identity says nothing; the data does.
// An entry is plain data by contract (the renderer gets the nodes), so its JSON
// is its content. Keys are sorted so that the same entry serialised by two
// servers in two orders is one entry.


const stable = value => JSON.stringify(value, (key, item) => item && typeof item === "object" && !Array.isArray(item) ? Object.fromEntries(Object.keys(item).sort().map(name => [name, item[name]])) : item);

const keyOf = entry => String(entry?.id ?? ""); // Vocabulary 1.1.5 §2.2: `growing` -- the other side is still writing this entry.


const isGrowing = entry => entry?.growing === true;

const authorName = entry => String(entry?.["author-name"] ?? "");

const authorOf = entry => String(entry?.author ?? authorName(entry)); // `wait` (vocabulary §5.1): delayed | stopped | network | none; null is none.


const waitOf = (entry, view) => {
  const value = view?.wait ?? entry?.wait ?? null;
  return value === null || value === undefined || value === "" ? "none" : String(value);
}; // How a stream ended, read from the entry the host gave last: stopped is
// cancelled, an error is failed, anything else is completed.


const endOf = (entry, view) => {
  if (waitOf(entry, view) === "stopped") return {
    fact: "cancelled"
  };
  const error = entry?.error;

  if (error || entry?.status === "failed" || entry?.status === "error") {
    return {
      fact: "failed",
      reason: String((error && typeof error === "object" ? error.reason : error) || entry?.reason || "failed"),
      message: String((error && typeof error === "object" ? error.message : "") || entry?.message || "")
    };
  }

  return {
    fact: "completed"
  };
}; // set-items(list, {hasMore}) or set-items({items, has-more}) (§4.4: one object
// in declared order).


const pageArguments = (first, second) => {
  if (first && !Array.isArray(first) && typeof first === "object" && Array.isArray(first.items)) {
    return {
      items: first.items,
      options: first.options ?? first
    };
  }

  return {
    items: Array.isArray(first) ? first : [],
    options: second ?? {}
  };
};

const hasMoreOf = options => Boolean(options?.hasMore ?? options?.["has-more"]); // Lays a new drawing over the nodes already shown, keeping every node whose
// place and kind did not change -- the one with the focus among them. Text
// is written, attributes are brought level, extra nodes go, missing ones come.


function overlay(target, source) {
  if (target.nodeType !== source.nodeType || target.nodeName !== source.nodeName) {
    target.replaceWith(source);
    return;
  }

  if (target.nodeType === 3 || target.nodeType === 8) {
    if (target.data !== source.data) target.data = source.data;
    return;
  }

  if (target.nodeType === 1) {
    for (const {
      name
    } of [...target.attributes]) if (!source.hasAttribute(name)) target.removeAttribute(name);

    for (const {
      name,
      value
    } of [...source.attributes]) if (target.getAttribute(name) !== value) target.setAttribute(name, value);

    if ("value" in target && "value" in source && target.value !== source.value && target !== target.ownerDocument.activeElement) target.value = source.value;
  }

  const kept = [...target.childNodes];
  const given = [...source.childNodes];
  given.forEach((node, index) => {
    if (kept[index]) overlay(kept[index], node);else target.append(node);
  });

  for (const extra of kept.slice(given.length)) extra.remove();
}

const FeedElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_4__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_5__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_6__
  },
  source: "ru"
});

class SfListFeed extends FeedElement {
  static get props() {
    return { ...super.props,
      templateName: {
        attribute: "template",
        default: "default"
      }
    };
  }

  constructor() {
    super(); // id -> {entry, view, node, flags, fingerprint}. Insertion order is not
    // display order; the column's children are.

    this._items = new Map(); // id -> {cancelled}: the streams that have begun and not ended.

    this._streams = new Map();
    this._loadingEarlier = false;
    this._pendingLatest = null;
    this._announced = new Map();
    this._renderItem = null;
    this._announceItem = null;
    this._column = null;
    this._position = (0,_core_js_reading_position_js__WEBPACK_IMPORTED_MODULE_2__.readingPosition)(null, {
      onStart: () => this.requestEarlier()
    }); // A value set as a property before the element was defined is an own
    // property that would hide the accessor; it is taken through it.

    for (const name of ["items", "renderItem", "announceItem"]) {
      if (!Object.prototype.hasOwnProperty.call(this, name)) continue;
      const early = this[name];
      delete this[name];
      this[name] = early;
    }
  } // ── words ────────────────────────────────────────────────────────────────


  get regionLabel() {
    return this.getAttribute("label") || this.sfWord("region-label");
  } // ── host-provided rendering ──────────────────────────────────────────────

  /**
   * (entry, context) => Node | string | null. context: {view, previous,
   * next, first, last, own, growing, index, document, feed}. A string is
   * drawn as text, never parsed. Setting it redraws every entry.
   */


  get renderItem() {
    return this._renderItem;
  }

  set renderItem(value) {
    this._renderItem = typeof value === "function" ? value : null;
    this.redraw();
  }
  /**
   * (entry, context) => string | null: what a screen reader hears when this
   * entry is finished. Called when an entry arrives or changes; the same
   * words for the same entry are said once.
   */


  get announceItem() {
    return this._announceItem;
  }

  set announceItem(value) {
    this._announceItem = typeof value === "function" ? value : null;
  } // ── the stable column ────────────────────────────────────────────────────


  get column() {
    if (!this._column) {
      const column = this.ownerDocument.createElement("div");
      column.className = "sf-list-feed__column"; // The feed is a log; what is new is said once by the standing
      // announcer, so the log itself stays quiet. A log that spoke for
      // itself read a whole answer every time it was redrawn.

      column.setAttribute("role", "log");
      column.setAttribute("aria-live", "off");
      column.addEventListener("keydown", event => this.onItemKey(event));
      this._column = column;
    }

    return this._column;
  }

  get scroller() {
    return this.querySelector(":scope > .sf-list-feed");
  }

  get announcer() {
    return this.querySelector(":scope > .sf-list-feed .sf-list-feed__announcer");
  }

  templateContext() {
    return {
      component: this,
      column: this.column,
      regionLabel: this.regionLabel,
      logLabel: this.sfWord("log-label"),
      earlierText: this._loadingEarlier ? this.sfWord("loading-earlier-text") : this.sfWord("earlier-text"),
      latestLabel: this.sfWord("latest-label"),
      hasMore: this.hasMore,
      loadingEarlier: this._loadingEarlier,
      empty: this._items.size === 0,
      emptyContent: this.hasSlotContent("empty") ? this.getSlotContent("empty") : null
    };
  }

  template() {
    return (0,_js_templates_default_js__WEBPACK_IMPORTED_MODULE_3__.renderListFeedTemplate)(this.templateContext());
  }

  afterRender(changed) {
    super.afterRender?.(changed);
    this._position.element = this.scroller;
    this.column.setAttribute("aria-label", this.sfWord("log-label"));

    if (this._pendingLatest) {
      const options = this._pendingLatest;
      this._pendingLatest = null;
      this.scrollToLatest(options);
    }

    this.syncJump();
  } // ── the feed as a setting (§18.4) ────────────────────────────────────────

  /** The entries in display order, as the host gave them. */


  get items() {
    return [...this.column.children].map(node => this._items.get(node.dataset.id)?.entry).filter(Boolean);
  }
  /**
   * The whole feed, as a binding carries it. Compared by key with what is
   * shown: an entry that left is taken off, a new or changed one is drawn in
   * its place (changed by `changes`: revision or content), the rest keep
   * their nodes. An empty feed takes it as setItems does.
   */


  set items(value) {
    const list = (Array.isArray(value) ? value : []).filter(entry => keyOf(entry));

    if (!this._items.size) {
      this.setItems(list, {
        hasMore: this.hasMore
      });
      return;
    }

    this._sfDataGiven = true;
    const wanted = new Set(list.map(keyOf));

    for (const key of [...this._items.keys()]) if (!wanted.has(key)) this.detach({
      id: key
    });

    let previous = null;

    for (const entry of list) {
      const key = keyOf(entry);
      if (this._items.has(key)) this.upsert(entry);else this.insertAfter(entry, previous);
      previous = this._items.get(key)?.node ?? previous;
    }
  } // A new entry the setting carries in the middle of what is shown stands
  // where the list puts it, not at the end.


  insertAfter(entry, previousNode) {
    const atEnd = !previousNode || previousNode === this.column.lastElementChild;

    if (atEnd) {
      this.upsert(entry);
      return;
    }

    const node = this.place(entry, {});
    previousNode.after(node);
    this.syncRuns();
    this.track(this._items.get(keyOf(entry)), null);
    this.maybeAnnounce(this._items.get(keyOf(entry)));
    this.refreshFrame("insert");
  } // Two entries are the same by `changes` (§18.4): revision -- the host
  // raises it with every change, a growing entry with every chunk -- or
  // content, the entry's fields and its view. An entry without a revision
  // is compared by content either way.


  same(existing, entry, view) {
    // A stream's end is never an equal write, whatever the revision says.
    if (isGrowing(entry) !== isGrowing(existing.entry)) return false;

    if (this.changes === "revision" && entry?.revision !== undefined && existing.entry?.revision !== undefined) {
      return String(entry.revision) === String(existing.entry.revision) && stable(view) === stable(existing.view);
    }

    return existing.fingerprint === stable([entry, view]);
  } // ── actions (§4.4) ───────────────────────────────────────────────────────
  // A printed skeleton (data-sf-first-paint="skeleton") stays until the host
  // gives the entries (standard 1.3.8 §5.4): the first render then draws them
  // over it in one frame. An empty list given is an answer too -- the empty
  // state draws -- where the base's test counts it as not yet given.


  sfAwaitingData() {
    return this.getAttribute("data-sf-first-paint") === "skeleton" && !this._sfDataGiven;
  }
  /** Replace the whole feed and show its end. */


  setItems(first = [], second = {}) {
    const {
      items,
      options
    } = pageArguments(first, second);
    this._sfDataGiven = true; // Another feed: nothing said about the last one stays to be found, and
    // nothing said about it is said again.

    this._announced.clear();

    const announcer = this.announcer;
    if (announcer) announcer.textContent = "";

    for (const key of this._streams.keys()) this.endStream(key, {
      fact: "cancelled"
    });

    this._items.clear();

    this.column.replaceChildren();

    for (const entry of items) {
      if (!keyOf(entry) || this._items.has(keyOf(entry))) continue;
      this.column.append(this.place(entry, {}));
    } // What a feed holds when it opens has been said already, by whoever
    // wrote it; only what changes from now on is news.


    for (const item of this._items.values()) {
      this._announced.set(keyOf(item.entry), this.announcementOf(item));

      this.track(item, null);
    }

    this.syncRuns();
    this._loadingEarlier = false;
    this.hasMore = hasMoreOf(options);
    this.refreshFrame("items"); // Until the end of the new feed is in view, reaching the top is not a
    // request for earlier history: the column starts at the top for one
    // frame, and that frame used to ask for a page nobody wanted.

    this.scrollToLatest({
      instant: true,
      settle: true
    });
    return applied();
  }
  /** Earlier history above, without moving what is being read. Ends the earlier request. */


  prependItems(first = [], second = {}) {
    const {
      items,
      options
    } = pageArguments(first, second);
    const fragment = this.ownerDocument.createDocumentFragment();

    for (const entry of items) {
      const key = keyOf(entry);
      if (!key || this._items.has(key)) continue;
      fragment.append(this.place(entry, {}));

      this._announced.set(key, this.announcementOf(this._items.get(key)));
    }

    this._position.element = this.scroller;

    this._position.keep(() => {
      this.column.prepend(fragment);
      this.syncRuns();
    });

    this._loadingEarlier = false;
    this.hasMore = hasMoreOf(options);
    this.refreshFrame("prepend");
    return applied();
  }
  /**
   * Add or update one entry. `view` is what the host knows that the entry
   * does not (a wait it stopped, the person's own rating); it reaches the
   * renderer and is kept until replaced. `replaces` names the id the entry
   * had before -- one sent with a local key that the server has now numbered
   * -- so it keeps its place instead of moving to the end.
   */


  upsert(entry, view, {
    replaces = null
  } = {}) {
    if (entry && entry.item && typeof entry.item === "object" && entry.id === undefined) {
      ({
        item: entry,
        view,
        options: {
          replaces = null
        } = {}
      } = entry);
    }

    const key = keyOf(entry);
    if (!key) return refused("no-id");
    this._sfDataGiven = true;
    const previousKey = replaces != null && this._items.has(String(replaces)) ? String(replaces) : key;

    const existing = this._items.get(previousKey);

    const stream = this._streams.get(previousKey); // A stream the person cancelled draws nothing more of it, its end
    // included: what they stopped at stays (vocabulary §5.1, the server may
    // still finish the reply). A write after the end is drawn as any is.


    if (existing && stream?.cancelled) {
      if (!isGrowing(entry)) this._streams.delete(previousKey);
      return refused("cancelled");
    }

    const nextView = view ?? existing?.view ?? {};
    this._position.element = this.scroller;

    const atEnd = this._position.atEnd();

    if (existing && previousKey !== key) {
      this._items.delete(previousKey);

      this._announced.set(key, this._announced.get(previousKey));

      this._announced.delete(previousKey);

      if (stream) {
        this._streams.delete(previousKey);

        this._streams.set(key, stream);
      }

      existing.node.dataset.id = key;

      this._items.set(key, existing);
    }

    if (existing && this.same(existing, entry, nextView)) {
      existing.entry = entry;
      return applied();
    }

    const before = existing ? {
      entry: existing.entry,
      view: existing.view
    } : null;

    if (existing) {
      existing.entry = entry;
      existing.view = nextView;
      existing.fingerprint = stable([entry, nextView]);
      this.syncItem(existing); // In place (§18.4): the item element stays, only its drawing changes.

      this.draw(existing, ...this.neighbours(existing));
      this.syncRuns();
    } else {
      this.column.append(this.place(entry, nextView));
      this.syncRuns();
    }

    const item = this._items.get(key);

    this.track(item, before);
    this.maybeAnnounce(item);
    this.refreshFrame("upsert");
    const followed = atEnd || !existing && entry.own === true;
    if (followed) this.scrollToLatest();else this.syncJump();
    return applied();
  }
  /** Merge into the view of an entry already shown. */


  setView(id, view = {}) {
    if (id && typeof id === "object") ({
      id,
      view = {}
    } = id);

    const item = this._items.get(String(id));

    if (!item) return refused("unknown");
    return this.upsert(item.entry, { ...item.view,
      ...view
    });
  }
  /** Take one entry off. A stream it was ends cancelled. */


  detach(params) {
    const key = String(params && typeof params === "object" ? params.id : params);

    const item = this._items.get(key);

    if (!item) return refused("unknown");
    if (this._streams.has(key)) this.endStream(key, {
      fact: "cancelled"
    });
    item.node.remove();

    this._items.delete(key);

    this._announced.delete(key);

    this.syncRuns();
    this.refreshFrame("detach");
    return applied();
  }
  /**
   * Stop drawing a growing entry (vocabulary §5.2 cancel {id}): what the
   * person sees stays where it is, its busy mark goes, and the stream ends
   * cancelled now. Telling the other side to stop writing is the host's.
   */


  cancel(params) {
    const key = String(params && typeof params === "object" ? params.id : params ?? "");

    const stream = this._streams.get(key);

    if (!stream) return refused(this._items.has(key) ? "not-growing" : "unknown");
    if (stream.cancelled) return refused("cancelled");
    stream.cancelled = true;

    const item = this._items.get(key);

    if (item) {
      item.view = { ...item.view,
        wait: "stopped"
      };
      item.fingerprint = stable([item.entry, item.view]);
      item.node.removeAttribute("aria-busy");
      this.draw(item, ...this.neighbours(item));
    }

    this.sfEmit("cancelled", {
      id: key
    });
    return applied();
  }
  /** Draw one entry, or every one, again: after the renderer's own inputs changed. */


  redraw(params = null) {
    const id = params && typeof params === "object" ? params.id : params;
    const keys = id == null ? [...this._items.keys()] : [String(id)];

    for (const key of keys) {
      const item = this._items.get(key);

      if (item) this.draw(item, ...this.neighbours(item));
    }

    this.syncRuns();
    return applied();
  } // ── streams (§10.8, vocabulary §5.2) ─────────────────────────────────────
  // After an entry arrived or changed: a growing entry not yet followed has
  // begun; a followed one that changed is a chunk; one that stopped growing
  // has ended. A stream the person cancelled has ended already.


  track(item, before) {
    if (!item) return;
    const key = keyOf(item.entry);
    const growing = isGrowing(item.entry);

    const stream = this._streams.get(key);

    if (!stream) {
      if (!growing) return;

      this._streams.set(key, {
        cancelled: false,
        chunks: 0
      });

      this.sfEmit("begun", {
        id: key
      });
      return;
    }

    if (growing) {
      if (before && !stream.cancelled) {
        stream.chunks += 1;
        const detail = {
          id: key
        };
        if (item.entry.revision !== undefined) detail.revision = item.entry.revision;
        this.sfEmit("chunk", detail);
      }

      return;
    }

    if (stream.cancelled) {
      this._streams.delete(key);

      return;
    }

    this.endStream(key, endOf(item.entry, item.view));
  }

  endStream(key, {
    fact,
    reason,
    message
  }) {
    const stream = this._streams.get(key);

    if (!stream) return;

    this._streams.delete(key);

    if (stream.cancelled) return;
    if (fact === "failed") this.sfEmit("failed", {
      id: key,
      reason: reason || "failed",
      message: message || ""
    });else if (fact === "cancelled") this.sfEmit("cancelled", {
      id: key
    });else this.sfEmit("completed", {
      id: key
    });
  } // ── items ────────────────────────────────────────────────────────────────


  place(entry, view) {
    const key = keyOf(entry);
    const node = this.ownerDocument.createElement("div");
    node.className = "sf-list-feed__item";
    node.dataset.id = key;
    const item = {
      entry,
      view: view ?? {},
      node,
      flags: null,
      fingerprint: stable([entry, view ?? {}])
    };

    this._items.set(key, item);

    this.syncItem(item);
    return node;
  } // What the item element itself says: whose side it is on, and whether the
  // other side is still writing it (aria-busy, vocabulary §2.2 growing).


  syncItem(item) {
    item.node.classList.toggle("sf-list-feed__item--own", item.entry.own === true);
    const busy = isGrowing(item.entry) && !this._streams.get(keyOf(item.entry))?.cancelled;
    if (busy) item.node.setAttribute("aria-busy", "true");else item.node.removeAttribute("aria-busy");
  }

  neighbours(item) {
    return [this._items.get(item.node.previousElementSibling?.dataset.id)?.entry ?? null, this._items.get(item.node.nextElementSibling?.dataset.id)?.entry ?? null];
  } // Runs are consecutive entries of one author. They are computed over the
  // whole column after every change, because one entry arriving changes its
  // neighbour: the entry that was the last of a run is no longer. An entry
  // is drawn (or drawn again) here, when its place in its run is known --
  // the renderer is told first and last, and an avatar that belongs beside
  // the first entry of a run would otherwise be drawn beside every one until
  // the next redraw.


  syncRuns() {
    const nodes = [...this.column.children];
    const items = nodes.map(node => this._items.get(node.dataset.id)).filter(Boolean);
    items.forEach((item, index) => {
      const previous = items[index - 1]?.entry ?? null;
      const next = items[index + 1]?.entry ?? null;

      const sameAuthor = other => other && authorOf(other) === authorOf(item.entry) && other.own === true === (item.entry.own === true);

      const flags = {
        first: !sameAuthor(previous),
        last: !sameAuthor(next),
        index,
        end: index === items.length - 1
      };
      const changed = !item.flags || item.flags.first !== flags.first || item.flags.last !== flags.last;
      item.node.classList.toggle("sf-list-feed__item--first", flags.first);
      item.node.classList.toggle("sf-list-feed__item--last", flags.last);
      item.node.classList.toggle("sf-list-feed__item--end", flags.end);
      item.flags = flags;
      if (changed || !item.node.firstChild) this.draw(item, previous, next);
    });
  }

  draw(item, previous, next) {
    if (!item.flags) return;
    const context = {
      view: item.view,
      previous,
      next,
      first: item.flags.first,
      last: item.flags.last,
      own: item.entry.own === true,
      growing: isGrowing(item.entry),
      index: item.flags.index,
      document: this.ownerDocument,
      feed: this
    };
    let content = null;

    try {
      content = this._renderItem ? this._renderItem(item.entry, context) : this.renderDefault(item.entry, context);
    } catch (error) {
      // One entry the host's renderer cannot draw must not take the feed
      // down with it; it is reported and left as its text.
      this.reportComponentError?.(error, "render-item");
      content = this.renderDefault(item.entry, context);
    }

    const node = content instanceof Node ? content : this.ownerDocument.createTextNode(content == null ? "" : String(content));
    const shown = item.node.firstChild; // The person is inside this entry -- the focus on its button, a
    // selection in its text: the new drawing is laid over the old nodes,
    // which stay, and the focus and the selection with them (§18.4).

    const active = this.ownerDocument.activeElement;
    const selection = this.ownerDocument.getSelection?.();
    const inside = active && active !== item.node && item.node.contains(active) || selection && selection.rangeCount > 0 && !selection.isCollapsed && item.node.contains(selection.anchorNode);
    if (shown && inside && item.node.childNodes.length === 1 && !(node instanceof DocumentFragment)) overlay(shown, node);else item.node.replaceChildren(node);
  } // Without a renderer an entry is its author and its text: enough for a
  // feed of people, and the shape a renderer replaces. Text only; a host
  // that has markup draws it itself, with its own sanitiser.


  renderDefault(entry, {
    first,
    own
  }) {
    const doc = this.ownerDocument;
    const article = doc.createElement("article");
    article.className = "sf-list-feed__entry";
    const name = own ? this.sfWord("you-text") : authorName(entry);
    if (name) article.setAttribute("aria-label", name);

    if (first && name && !own) {
      const author = doc.createElement("p");
      author.className = "sf-list-feed__author";
      author.textContent = name;
      article.append(author);
    }

    const bubble = doc.createElement("p");
    bubble.className = "sf-list-feed__text";
    bubble.textContent = String(entry.text ?? "");
    article.append(bubble);
    return article;
  } // ── announcing ───────────────────────────────────────────────────────────


  announcementOf(item) {
    if (!item) return "";
    const context = {
      view: item.view,
      own: item.entry.own === true,
      feed: this
    };

    if (this._announceItem) {
      try {
        return String(this._announceItem(item.entry, context) ?? "");
      } catch {
        return "";
      }
    } // By default: a finished entry from someone else, its author and its
    // words. One's own entry is not news to oneself; a growing one is not
    // finished.


    if (item.entry.own === true || isGrowing(item.entry)) return "";
    const words = String(item.entry.text ?? "").replace(/\s+/g, " ").trim();
    if (!words) return "";
    const author = authorName(item.entry).trim();
    return author ? `${author}: ${words}` : words;
  }

  maybeAnnounce(item) {
    if (!item || this.live === "off") return;
    const key = keyOf(item.entry);
    const said = this.announcementOf(item);
    if (!said || this._announced.get(key) === said) return;

    this._announced.set(key, said);

    this.announce(said);
  }
  /** Say something once through the feed's polite live region. */


  announce(params) {
    const words = params && typeof params === "object" ? params.text : params;
    const announcer = this.announcer;
    if (!announcer) return refused("not-drawn");
    const whole = String(words ?? "").replace(/\s+/g, " ").trim();
    const said = whole.length > ANNOUNCE_LIMIT ? `${whole.slice(0, ANNOUNCE_LIMIT)}…` : whole; // A changed text is what a screen reader hears; clearing first makes a
    // second identical sentence heard as well.

    announcer.textContent = "";
    setTimeout(() => {
      announcer.textContent = said;
    }, 60);
    return applied();
  } // ── position (core/js/reading-position.js) ───────────────────────────────

  /** Is the end of the feed in view? */


  isAtLatest() {
    this._position.element = this.scroller;
    return this._position.atEnd();
  }

  syncJump() {
    const jump = this.scroller?.querySelector(".sf-list-feed__jump");
    if (jump) jump.hidden = this.isAtLatest();
  }

  onScroll() {
    this.syncJump();
    if (this.hasMore && !this._loadingEarlier) this._position.check();
  }
  /** Ask the host for earlier history; the earlier button and reaching the top do this. */


  requestEarlier() {
    if (this._loadingEarlier) return refused("loading");
    if (!this.hasMore) return refused("no-more");
    const before = this.column.firstElementChild?.dataset.id ?? null;
    this._loadingEarlier = true;
    this.refreshFrame("earlier"); // Vocabulary §5 load-more {direction: before}; `before` names the first
    // entry shown.

    if (!this.sfEmit("load-more", {
      direction: "before",
      before
    })) {
      this.earlierFailed();
      return refused("prevented");
    }

    return applied();
  }
  /** The host could not load earlier history: the button is pressable again. */


  earlierFailed() {
    this._loadingEarlier = false;
    this.refreshFrame("earlier");
    return applied();
  }

  scrollToLatest(params = {}) {
    const {
      instant = false,
      focus = false,
      settle = false
    } = params?.options ?? params ?? {};
    const scroller = this.scroller;

    if (!scroller) {
      this._pendingLatest = {
        instant,
        focus,
        settle
      };
      return applied();
    }

    this._position.element = scroller;

    this._position.toEnd({
      instant,
      settle,
      then: () => {
        const jump = scroller.querySelector(".sf-list-feed__jump");
        if (jump) jump.hidden = true;
        if (focus) this.focusItem(this.column.lastElementChild);
      }
    });

    return applied();
  } // ── keyboard ─────────────────────────────────────────────────────────────
  // What takes focus for an entry: the host's own article when it drew one,
  // else the item. It is reachable by script and by the arrows, not by Tab:
  // a feed of three hundred entries is not three hundred Tab stops.


  focusTarget(node) {
    if (!node) return null;
    const own = node.querySelector(":scope > article, :scope > [role='article']");
    const target = own ?? node;
    if (!target.hasAttribute("tabindex")) target.tabIndex = -1;
    return target;
  }

  focusItem(node) {
    const target = this.focusTarget(node);
    target?.focus({
      preventScroll: false
    });
    return target;
  } // From a focused entry: arrows go to the neighbour, Home and End to the
  // first and last entry loaded. Keys pressed inside an entry's own controls
  // are theirs, so only a key whose target is the entry counts.


  onItemKey(event) {
    const item = event.target.closest?.(".sf-list-feed__item");
    if (!item || this.focusTarget(item) !== event.target) return;
    let next = null;
    if (event.key === "ArrowUp") next = item.previousElementSibling;
    if (event.key === "ArrowDown") next = item.nextElementSibling;
    if (event.key === "Home") next = this.column.firstElementChild;
    if (event.key === "End") next = this.column.lastElementChild;

    if (!next) {
      // Up from the first loaded entry is a request for what is above.
      if (event.key === "ArrowUp" && !item.previousElementSibling && this.hasMore) {
        event.preventDefault();
        this.requestEarlier();
      }

      return;
    }

    event.preventDefault();
    this.focusItem(next);
  } // The frame is the template; the items are not in it, so a change to them
  // redraws only the buttons and the empty state around them.


  refreshFrame(reason) {
    this.requestComponentUpdate(reason);
  }

}

SfListFeed.define("sf-list-feed");
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "93ae64e644ce"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderListFeedTemplate: () => (/* binding */ renderListFeedTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var _default_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("f3067e7f14b1");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);

 // The frame of the feed, drawn in the component's light DOM like every Smart
// component: a document stylesheet does not cross a shadow boundary, and the
// entries a host draws carry their own classes from the page's sheets.
//
// Three names, deliberately different: the scrolling region («Лента», or the
// host's label), the log inside it («Записи») and the announcer, which has
// none. Two «Записи» in a row tell a screen reader nothing.
//
// The column is one node the component owns and keeps (see index.js); lit
// places it once and leaves it alone, so prepending history and redrawing an
// entry never move the scroll anchor.
//
// The two buttons sit in wrappers that are hidden instead of the buttons: a
// Smart button's host is display: contents, and `hidden` on it does nothing.

function renderListFeedTemplate(context) {
  const {
    component
  } = context;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div
                class="sf-list-feed ${context.empty ? "sf-list-feed--empty" : ""}"
                role="region"
                aria-label=${context.regionLabel}
                tabindex="0"
                @scroll=${() => component.onScroll()}
        >
            <div class="sf-list-feed__earlier" ?hidden=${!context.hasMore}>
                <sf-button
                        appearance="ghost"
                        scheme="on-surface"
                        size="1/2"
                        icon="expand_less"
                        text=${context.earlierText}
                        ?disabled=${context.loadingEarlier}
                        data-action="earlier"
                        @click=${() => component.requestEarlier()}
                ></sf-button>
            </div>
            <div class="sf-list-feed__empty" ?hidden=${!context.empty || !context.emptyContent}>
                ${context.emptyContent ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            </div>
            ${context.column}
            <div class="sf-list-feed__jump" hidden>
                <sf-button-icon
                        appearance="tonal"
                        scheme="on-surface"
                        size="1"
                        radius="rounded"
                        icon="arrow_downward"
                        data-action="latest"
                        title=${context.latestLabel}
                        aria-label=${context.latestLabel}
                        @click=${() => component.scrollToLatest({
    focus: true
  })}
                ></sf-button-icon>
            </div>
            <div class="sf-list-feed__announcer sr-only" aria-live="polite"></div>
        </div>
    `;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "f3067e7f14b1"
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

/***/ "deb1a4d61565"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("smart-base", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("smart-base", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "7595f2639ad9"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.list-feed","tag":"sf-list-feed","version":"1.1.2","kind":"leaf","settings":{"items":{"type":"list","default":[],"of":{"id":"id","author":{"type":"string","optional":true},"author-name":{"type":"string","optional":true},"own":{"type":"boolean","optional":true},"text":{"type":"string","optional":true},"revision":{"type":"string","optional":true},"growing":{"type":"boolean","optional":true},"wait":{"type":"enum","values":["delayed","stopped","network","none"],"nullable":true,"optional":true},"error":{"type":"object","optional":true}},"entries":{"key":"id","changes":"content"}},"changes":{"type":"enum","values":["content","revision"],"default":"content"},"has-more":{"type":"boolean","default":false},"label":{"type":"string","default-from":"runtime.region-label"},"live":{"type":"enum","values":["polite","off"],"default":"polite"}},"values":{},"events":{"load-more":{"carries":{"direction":{"type":"enum","values":["before"],"optional":true},"before":{"type":"id","nullable":true}},"cancelable":true},"begun":{"carries":{"id":"id"}},"chunk":{"carries":{"id":"id","revision":{"type":"string","optional":true}}},"completed":{"carries":{"id":"id"}},"failed":{"carries":{"id":"id","reason":"string","message":"string"}},"cancelled":{"carries":{"id":"id"}}},"actions":{"set-items":{"with":{"items":{"type":"list","schema":{"items":{"type":"object","properties":{"id":{"type":["string","number"]},"author":{"type":"string"},"author-name":{"type":"string"},"own":{"type":"boolean"},"growing":{"type":"boolean"},"text":{"type":"string"}},"required":["id"]}}},"options":{"type":"object","optional":true,"schema":{"properties":{"hasMore":{"type":"boolean","default":false}}}}}},"prepend-items":{"with":{"items":{"type":"list","schema":{"items":{"type":"object","properties":{"id":{"type":["string","number"]},"author":{"type":"string"},"author-name":{"type":"string"},"own":{"type":"boolean"},"growing":{"type":"boolean"},"text":{"type":"string"}},"required":["id"]}}},"options":{"type":"object","optional":true,"schema":{"properties":{"hasMore":{"type":"boolean","default":false}}}}}},"upsert":{"with":{"item":{"type":"object","schema":{"type":"object","properties":{"id":{"type":["string","number"]},"author":{"type":"string"},"author-name":{"type":"string"},"own":{"type":"boolean"},"growing":{"type":"boolean"},"text":{"type":"string"}},"required":["id"]}},"view":{"type":"object","optional":true},"options":{"type":"object","optional":true,"schema":{"properties":{"replaces":{"type":["string","number","null"]}}}}}},"set-view":{"with":{"id":"id","view":{"type":"object"}}},"detach":{"with":{"id":"id"}},"cancel":{"with":{"id":"id"}},"redraw":{"with":{"id":{"type":"id","optional":true,"nullable":true}}},"request-earlier":{},"earlier-failed":{},"scroll-to-latest":{"with":{"options":{"type":"object","optional":true,"schema":{"properties":{"instant":{"type":"boolean"},"focus":{"type":"boolean"},"settle":{"type":"boolean"}}}}}},"announce":{"with":{"text":"string"}}},"presentation":{"skeleton":{"late":["items"]}},"host-states":{},"css-variables":{"--sf-list-feed-column-width":{"type":"length","state":"default"},"--sf-list-feed-inset":{"type":"length","state":"default"},"--sf-list-feed-run-gap":{"type":"length","state":"default"},"--sf-list-feed-turn-gap":{"type":"length","state":"default"},"--sf-list-feed-fade-size":{"type":"length","state":"default"}}}');

/***/ },

/***/ "22eb8f8fb40c"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Feed","runtime":{"earlier-text":"Show earlier","latest-label":"To the latest","loading-earlier-text":"Loading earlier entries","log-label":"Entries","region-label":"Feed","you-text":"You"}}');

/***/ },

/***/ "1002fcd319ac"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Лента","runtime":{"earlier-text":"Показать предыдущие","latest-label":"К последней записи","loading-earlier-text":"Загружаю предыдущие записи","log-label":"Записи","region-label":"Лента","you-text":"Вы"}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("5dee09797137");
/******/
/******/ })()
;