/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "8489d1f5bab4"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isRussianPage: () => (/* binding */ isRussianPage),
/* harmony export */   language: () => (/* binding */ language),
/* harmony export */   pageLanguage: () => (/* binding */ pageLanguage),
/* harmony export */   pageLocale: () => (/* binding */ pageLocale),
/* harmony export */   pageText: () => (/* binding */ pageText)
/* harmony export */ });
// What language a component speaks, and how a product adds one.
//
// The Framework speaks English by default and whatever the page says otherwise:
// the language is the nearest [lang] above the node, else the document's, else
// English. One rule for every component, so a page never mixes two because two
// components looked in different places.
//
// Until 2026-10-10 that was the whole of it, and every component carried a
// dictionary of exactly two languages written into its source. Adding a third
// meant editing sixteen files, and a product that needed one could not add it
// at all. There will be many more than two (owner, 2026-10-11), so the
// dictionaries a component ships are now a FLOOR rather than the whole set:
// anything can be registered beside them, for any language, including one the
// Framework has never heard of.
//
// Where a word comes from, in order:
//
//   1. the component's own attribute — a consumer who names a word has named
//      it, and no language changes it;
//   2. a word registered for the resolved language;
//   3. the word the component ships for that language;
//   4. the same two again for the language without its region (`pt-BR` → `pt`);
//   5. the same two again for English;
//   6. the key itself, which is a visible defect rather than a blank.
//
// Registering is additive and reversible, and it does not require the
// Framework to know the language exists.
// The state is shared between every copy of this module, which there are
// several of: core, each smart component and each composite are separate
// bundles, and each one carries its own copy of this file. With the registry
// in module scope the page had as many registries as bundles -- `SF.language`
// was published from core's copy, the table read its own, and registering a
// language changed nothing on screen. Only a browser shows that, and it did
// (2026-10-11).
const STORE = (() => {
  const root = typeof globalThis !== 'undefined' ? globalThis : {};
  const key = '__sfPageLanguage';

  if (!root[key]) {
    root[key] = {
      listeners: new Set(),
      registered: new Map(),
      chosen: null
    };
  }

  return root[key];
})();

const LISTENERS = STORE.listeners;
const REGISTERED = STORE.registered;

const normalise = value => String(value ?? '').trim().toLowerCase().replace('_', '-');
/** The languages to try, most specific first, English last. */


const chain = language => {
  const wanted = normalise(language);
  const base = wanted.split('-')[0];
  const order = [];

  for (const candidate of [wanted, base, 'en']) {
    if (candidate && !order.includes(candidate)) order.push(candidate);
  }

  return order;
};
/** Which component a node belongs to, for words registered against one. */


const componentOf = node => {
  const tag = node?.tagName;
  return typeof tag === 'string' ? tag.toLowerCase() : null;
};

const announce = () => {
  for (const listener of [...LISTENERS]) {
    try {
      listener();
    } catch {// A listener that throws is not allowed to stop the others: a page that
      // half-changed language would be worse than one that did not change.
    }
  }
};
/**
 * The page's language for this node: the nearest [lang], else the document's,
 * else English — unless a product has chosen one explicitly.
 */


function pageLanguage(node) {
  // The language without its region, whichever way it was set: a page that
  // chose 'pt-BR' is a Portuguese page, as a page whose markup says
  // lang="pt-BR" is. The chosen value kept its region and answered 'pt-br',
  // which matched no dictionary keyed by language and made isRussianPage false
  // on a page that chose 'ru-RU'. The region stays in pageLocale.
  if (STORE.chosen) return STORE.chosen.split('-')[0];
  const owner = node && typeof node.closest === 'function' ? node.closest('[lang]') : null;
  const value = owner?.getAttribute('lang') || globalThis.document?.documentElement?.lang || 'en';
  return normalise(value).split('-')[0] || 'en';
}
/** The page's language with its region kept, which is what formatting wants. */

function pageLocale(node) {
  if (STORE.chosen) return STORE.chosen;
  const owner = node && typeof node.closest === 'function' ? node.closest('[lang]') : null;
  return normalise(owner?.getAttribute('lang') || globalThis.document?.documentElement?.lang || 'en');
}
function isRussianPage(node) {
  return pageLanguage(node) === 'ru';
}
/**
 * Text for `key` in the page's language.
 *
 * `dictionary` is what the component ships; `component` names it for the
 * registry and defaults to the node's own tag, so a component calling with
 * `this` identifies itself without saying so twice.
 */

function pageText(dictionary, key, node, component) {
  const owner = component ?? componentOf(node);

  for (const candidate of chain(pageLocale(node))) {
    const added = owner ? REGISTERED.get(owner)?.get(candidate)?.[key] : undefined;
    if (added !== undefined) return added;
    const shipped = dictionary?.[candidate]?.[key];
    if (shipped !== undefined) return shipped;
  }

  return key;
}
const language = {
  /** What the page resolves to for this node, region and all. */
  current(node = globalThis.document?.documentElement ?? null) {
    return pageLocale(node);
  },

  /**
   * Choose a language for the whole page, whatever its markup says. `null`
   * returns to following the document, which is the default and what a
   * server-rendered page wants.
   */
  use(value) {
    const next = value === null || value === undefined ? null : normalise(value);
    if (next === STORE.chosen) return STORE.chosen;
    STORE.chosen = next;
    announce();
    return STORE.chosen;
  },

  /**
   * Add or replace one component's words for one language.
   *
   * The words are merged, so a product can correct a single label without
   * restating the rest, and `null` removes what it added.
   */
  register(component, value, words) {
    const name = String(component ?? '').toLowerCase();
    const code = normalise(value);
    if (!name || !code) throw new TypeError('a component and a language are required');
    if (!REGISTERED.has(name)) REGISTERED.set(name, new Map());
    const byLanguage = REGISTERED.get(name);
    if (words === null) byLanguage.delete(code);else byLanguage.set(code, { ...(byLanguage.get(code) ?? {}),
      ...words
    });
    announce();
    return this;
  },

  /** One language across many components: `{ 'sf-datepicker': {...}, ... }`. */
  registerAll(value, byComponent = {}) {
    for (const [component, words] of Object.entries(byComponent)) {
      this.register(component, value, words);
    }

    return this;
  },

  /** The languages something has registered words for. */
  known(component) {
    const name = String(component ?? '').toLowerCase();
    return [...(REGISTERED.get(name)?.keys() ?? [])];
  },

  /** Every component something has been registered for. */
  components() {
    return [...REGISTERED.keys()];
  },

  /**
   * Called whenever the chosen language or the registered words change, so a
   * component can draw itself again. Returns the way to stop listening.
   */
  onChange(listener) {
    if (typeof listener !== 'function') return () => {};
    LISTENERS.add(listener);
    return () => LISTENERS.delete(listener);
  },

  /** Everything registered is forgotten. For tests, and for a product reset. */
  forget() {
    REGISTERED.clear();
    STORE.chosen = null;
    announce();
    return this;
  }

}; // Reachable by a consumer, which it was not: `sf-admin-menu` had written its
// own reading of the rule because the shared one was an internal module, and
// the two then disagreed about a region that names its own language. A product
// composing its own elements gets the same rule here.

if (typeof window !== 'undefined') {
  window.SF = window.SF || {};
  window.SF.language = language;
  window.SF.pageLanguage = pageLanguage;
  window.SF.pageText = pageText;
}

/***/ },

/***/ "8185ae1e4765"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "7c1f9c2b36da"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SORTABLE_INTENT_EVENT: () => (/* binding */ SORTABLE_INTENT_EVENT),
/* harmony export */   SORTABLE_STATE_EVENT: () => (/* binding */ SORTABLE_STATE_EVENT),
/* harmony export */   activeSortableSession: () => (/* binding */ activeSortableSession),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   defineSortable: () => (/* binding */ defineSortable),
/* harmony export */   registerSortableDropTarget: () => (/* binding */ registerSortableDropTarget),
/* harmony export */   sortableIndexAt: () => (/* binding */ sortableIndexAt)
/* harmony export */ });
/* harmony import */ var _page_language_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("8489d1f5bab4");
// Sortable drag-and-drop primitive. <sf-sortable> lists and registered
// external drop targets share one drag session. Pointer (mouse, pen, touch via
// handles), keyboard and screen-reader paths all end in the same intent event;
// the component never moves host DOM or data. The host applies the change.


const SORTABLE_INTENT_EVENT = 'sf-sortable-intent';
const SORTABLE_STATE_EVENT = 'sf-sortable-state';

const ITEM = '[data-sf-sortable-item]';
const HANDLE = '[data-sf-sortable-handle]';
const INTERACTIVE = 'a[href],button,input,select,textarea,summary,[contenteditable]:not([contenteditable="false"])';
const NAME = /^[a-z][a-z0-9-]{0,31}$/u;
const DRAG_THRESHOLD = 4;
const EDGE = 32;

const MESSAGES = {
  ru: {
    instructions: 'Пробел или Enter — взять, стрелки — переместить, Пробел или Enter — положить, Escape — отменить.',
    picked: 'Взято: {item}. Позиция {index} из {total} в «{list}».',
    moved: 'Позиция {index} из {total} в «{list}».',
    dropped: 'Положено: {item}, позиция {index} в «{list}».',
    cancelled: 'Перемещение отменено.',
    target: 'Цель: {target}.',
  },
  en: {
    instructions: 'Space or Enter to pick up, arrows to move, Space or Enter to drop, Escape to cancel.',
    picked: 'Picked up {item}. Position {index} of {total} in “{list}”.',
    moved: 'Position {index} of {total} in “{list}”.',
    dropped: 'Dropped {item} at position {index} in “{list}”.',
    cancelled: 'Move cancelled.',
    target: 'Target: {target}.',
  },
};

const format = (template, values) => template.replace(/\{(\w+)\}/gu, (_, key) => String(values[key] ?? ''));
// In the page's language through pageText, as every component's words are;
// <html lang> alone left SF.language.use() unheard (documentation trial).
const messages = () => Object.fromEntries(Object.keys(MESSAGES.en).map((key) => [key, (0,_page_language_js__WEBPACK_IMPORTED_MODULE_0__.pageText)(MESSAGES, key, undefined, 'sf-sortable')]));
// Separate Smart bundles (sf-sortable, sf-composition-overlay) each carry a copy
// of this module; the drag session and external targets live on one global
// record so a library drag can land on the overlay. The key carries the record
// version, so bundles with another record shape never share it.
const shared = globalThis.__sfSortableSharedV1 || (globalThis.__sfSortableSharedV1 = { targets: new Set(), session: null });
const externalTargets = shared.targets;

/** The active drag session (read-only view), or null. */
function activeSortableSession() {
  return shared.session ? Object.freeze({ item: shared.session.item, from: shared.session.from, group: shared.session.group, mode: shared.session.mode, input: shared.session.input }) : null;
}

/**
 * Registers a non-list drop target such as the editor overlay.
 * resolve(x, y, session) returns {descriptor, rect, label} or null;
 * drop(session, descriptor) performs the intent emission.
 */
function registerSortableDropTarget(target) {
  if (!target || typeof target.resolve !== 'function' || typeof target.drop !== 'function') throw new TypeError('Drop target needs resolve and drop');
  externalTargets.add(target);
  return () => externalTargets.delete(target);
}

// Visible text of an item without decorative (aria-hidden) parts.
function itemLabel(item) {
  if (item.getAttribute('aria-label')) return item.getAttribute('aria-label');
  const clone = item.cloneNode(true);
  for (const hidden of clone.querySelectorAll('[aria-hidden="true"]')) hidden.remove();
  return clone.textContent.replace(/\s+/gu, ' ').trim();
}

function listName(list) {
  return list.getAttribute('label') || list.getAttribute('aria-label') || list.getAttribute('group') || '';
}

function items(list) {
  return [...list.querySelectorAll(ITEM)].filter((item) => item.closest('sf-sortable') === list);
}

function accepts(list, group) {
  if (!list || list.getAttribute('mode') === 'copy') return false;
  const own = list.getAttribute('group');
  const extra = (list.getAttribute('accepts') || '').split(/\s+/u).filter(Boolean);
  return group === own || extra.includes(group);
}

function scrollContainer(element) {
  for (let node = element?.parentElement; node; node = node.parentElement) {
    const style = globalThis.getComputedStyle(node);
    if (/(auto|scroll)/u.test(style.overflowY) && node.scrollHeight > node.clientHeight) return node;
  }
  return globalThis.document.scrollingElement;
}

function indicator() {
  let line = globalThis.document.querySelector('.sf-sortable-indicator');
  if (!line) {
    line = globalThis.document.createElement('div');
    line.className = 'sf-sortable-indicator';
    line.setAttribute('aria-hidden', 'true');
    globalThis.document.body.append(line);
  }
  return line;
}

function showIndicator(rect) {
  const line = indicator();
  if (!rect) {
    line.hidden = true;
    return;
  }
  line.hidden = false;
  Object.assign(line.style, { left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px` });
}

/** Index where an item would land in a list for a pointer position. */
function sortableIndexAt(boxes, coordinate, exclude = -1) {
  let index = 0;
  for (let position = 0; position < boxes.length; position += 1) {
    if (position === exclude) continue;
    const box = boxes[position];
    if (coordinate > box.start + (box.end - box.start) / 2) index = position + 1;
  }
  return index;
}

/**
 * Whether the list flows in both axes -- two items standing side by side on one
 * row. A list like that is neither vertical nor horizontal, and asking only the
 * vertical axis cannot tell the left half of a row from the right half.
 */
function isWrapped(all) {
  for (let position = 1; position < all.length; position += 1) {
    const previous = all[position - 1].getBoundingClientRect();
    const current = all[position].getBoundingClientRect();
    if (current.top < previous.bottom - 1 && current.left >= previous.right - 1) return true;
  }
  return false;
}

/** Index where an item would land in a list that wraps, in reading order. */
function wrappedIndexAt(all, x, y) {
  let index = 0;
  for (let position = 0; position < all.length; position += 1) {
    const box = all[position].getBoundingClientRect();
    const past = y > box.bottom ? true : y < box.top ? false : x > box.left + box.width / 2;
    if (past) index = position + 1;
  }
  return index;
}

function listTarget(list, x, y) {
  const all = items(list);
  const horizontal = list.getAttribute('orientation') === 'horizontal';
  if (!horizontal && isWrapped(all)) {
    const index = wrappedIndexAt(all, x, y);
    return { list, index, rect: wrappedIndicatorRect(list, all, index) };
  }
  const boxes = all.map((item) => {
    const box = item.getBoundingClientRect();
    return horizontal ? { start: box.left, end: box.right } : { start: box.top, end: box.bottom };
  });
  const index = sortableIndexAt(boxes, horizontal ? x : y);
  return { list, index, rect: listIndicatorRect(list, all, index, horizontal) };
}

/**
 * A line down the side of the place the item would take, not across the whole
 * row: in a two-column list a full-width line cannot say which of the two halves
 * the item is about to land in.
 */
function wrappedIndicatorRect(list, all, index) {
  const box = list.getBoundingClientRect();
  const before = all[index];
  const after = all[index - 1];
  if (before) {
    const target = before.getBoundingClientRect();
    return { left: target.left - 1, top: target.top, width: 2, height: target.height };
  }
  if (after) {
    const target = after.getBoundingClientRect();
    return { left: target.right - 1, top: target.top, width: 2, height: target.height };
  }
  return { left: box.left, top: box.top, width: 2, height: box.height };
}

function listIndicatorRect(list, all, index, horizontal) {
  const box = list.getBoundingClientRect();
  const before = all[index];
  const after = all[index - 1];
  if (horizontal) {
    const x = before ? before.getBoundingClientRect().left : after ? after.getBoundingClientRect().right : box.left;
    return { left: x - 1, top: box.top, width: 2, height: box.height };
  }
  const y = before ? before.getBoundingClientRect().top : after ? after.getBoundingClientRect().bottom : box.top;
  return { left: box.left, top: y - 1, width: box.width, height: 2 };
}

function emitIntent(target, detail) {
  target.dispatchEvent(new globalThis.CustomEvent(SORTABLE_INTENT_EVENT, { bubbles: true, composed: true, detail: Object.freeze(detail) }));
}

function finish(list, reason) {
  if (!shared.session) return;
  const ended = shared.session;
  shared.session = null;
  ended.cleanup?.abort();
  if (ended.scrollFrame) globalThis.cancelAnimationFrame(ended.scrollFrame);
  ended.source?.removeAttribute('data-sf-sortable-dragging');
  ended.ghost?.remove();
  showIndicator(null);
  for (const target of externalTargets) target.leave?.();
  globalThis.document.documentElement.removeAttribute('data-sf-sortable-active');
  list.dispatchEvent(new globalThis.CustomEvent(SORTABLE_STATE_EVENT, { bubbles: true, composed: true, detail: Object.freeze({ state: reason, item: ended.item }) }));
}

function defineSortable(registry = globalThis.customElements) {
  if (!registry || typeof globalThis.HTMLElement !== 'function') return null;
  const existing = registry.get('sf-sortable');
  if (existing) return existing;

  class SfSortable extends globalThis.HTMLElement {
    constructor() {
      super();
      this.connection = null;
      this.live = null;
      this.instructions = null;
    }

    connectedCallback() {
      if (this.connection) return;
      this.connection = new AbortController();
      const options = { signal: this.connection.signal };
      if (!this.live) {
        this.live = globalThis.document.createElement('div');
        this.live.className = 'sf-sortable-live';
        this.live.setAttribute('aria-live', 'assertive');
        this.instructions = globalThis.document.createElement('div');
        this.instructions.className = 'sf-sortable-live';
        this.instructions.id = `sf-sortable-help-${Math.random().toString(36).slice(2, 10)}`;
      }
      this.instructions.textContent = messages().instructions;
      this.append(this.live, this.instructions);
      this.addEventListener('pointerdown', (event) => this.onPointerDown(event), options);
      this.addEventListener('keydown', (event) => this.onKeyDown(event), options);
      this.addEventListener('focusin', (event) => this.prepareItem(event.target.closest?.(ITEM)), options);
      for (const item of items(this)) this.prepareItem(item);
      // Items the host adds later become focusable and draggable as well.
      this.observer = new globalThis.MutationObserver(() => { for (const item of items(this)) this.prepareItem(item); });
      this.observer.observe(this, { childList: true, subtree: true });
      this.setAttribute('data-sf-sortable', 'connected');
    }

    disconnectedCallback() {
      this.observer?.disconnect();
      this.observer = null;
      this.connection?.abort();
      this.connection = null;
      if (shared.session?.fromList === this || shared.session?.list === this) finish(this, 'cancelled');
      this.setAttribute('data-sf-sortable', 'disposed');
    }

    prepareItem(item) {
      if (!item || item.closest('sf-sortable') !== this) return;
      if (!item.hasAttribute('tabindex') && !item.matches(INTERACTIVE)) item.tabIndex = 0;
      const described = (item.getAttribute('aria-describedby') || '').split(/\s+/u);
      if (this.instructions && !described.includes(this.instructions.id)) item.setAttribute('aria-describedby', [...described.filter(Boolean), this.instructions.id].join(' '));
      if (!item.querySelector(HANDLE)) item.style.touchAction = 'none';
    }

    announce(text) {
      if (this.live) this.live.textContent = text;
    }

    get group() {
      const value = this.getAttribute('group') || '';
      return NAME.test(value) ? value : '';
    }

    get mode() {
      return this.getAttribute('mode') === 'copy' ? 'copy' : 'move';
    }

    begin(item, input) {
      const id = item.getAttribute('data-sf-sortable-item');
      if (!id || !this.group || shared.session) return false;
      const all = items(this);
      shared.session = {
        item: id, from: this.getAttribute('id') || this.group, group: this.group, mode: this.mode, input,
        source: item, fromList: this, sourceIndex: all.indexOf(item), list: this.mode === 'copy' ? null : this,
        index: all.indexOf(item), external: null, cleanup: new AbortController(),
      };
      item.setAttribute('data-sf-sortable-dragging', '');
      globalThis.document.documentElement.setAttribute('data-sf-sortable-active', '');
      this.dispatchEvent(new globalThis.CustomEvent(SORTABLE_STATE_EVENT, { bubbles: true, composed: true, detail: Object.freeze({ state: 'picked', item: id }) }));
      return true;
    }

    // Pointer path ---------------------------------------------------------
    onPointerDown(event) {
      if (event.button !== 0 || shared.session) return;
      const item = event.target.closest?.(ITEM);
      if (!item || item.closest('sf-sortable') !== this) return;
      const handle = item.querySelector(HANDLE);
      if (handle && !handle.contains(event.target)) return;
      if (!handle && event.target.closest(INTERACTIVE) && event.target.closest(INTERACTIVE) !== item) return;
      const start = { x: event.clientX, y: event.clientY };
      const pointer = event.pointerId;
      let started = false;
      const pending = new AbortController();
      const move = (moveEvent) => {
        if (moveEvent.pointerId !== pointer) return;
        if (!started) {
          if (Math.hypot(moveEvent.clientX - start.x, moveEvent.clientY - start.y) < DRAG_THRESHOLD) return;
          if (!this.begin(item, moveEvent.pointerType || 'mouse')) { pending.abort(); return; }
          started = true;
          item.setPointerCapture?.(pointer);
          shared.session.ghost = this.ghost(item, moveEvent);
        }
        moveEvent.preventDefault();
        this.track(moveEvent.clientX, moveEvent.clientY);
      };
      const up = (upEvent) => {
        if (upEvent.pointerId !== pointer) return;
        pending.abort();
        if (started) this.drop();
      };
      const cancel = () => {
        pending.abort();
        if (started) finish(this, 'cancelled');
      };
      globalThis.addEventListener('pointermove', move, { signal: pending.signal, passive: false });
      globalThis.addEventListener('pointerup', up, { signal: pending.signal });
      globalThis.addEventListener('pointercancel', cancel, { signal: pending.signal });
      // Capture phase: cancel the drag before page-level Escape handlers run.
      globalThis.addEventListener('keydown', (keyEvent) => { if (keyEvent.key === 'Escape' && started) { keyEvent.preventDefault(); keyEvent.stopPropagation(); cancel(); } }, { signal: pending.signal, capture: true });
    }

    ghost(item, event) {
      const box = item.getBoundingClientRect();
      const ghost = item.cloneNode(true);
      ghost.removeAttribute('id');
      for (const element of ghost.querySelectorAll('[id]')) element.removeAttribute('id');
      ghost.classList.add('sf-sortable-ghost');
      ghost.setAttribute('aria-hidden', 'true');
      ghost.inert = true;
      Object.assign(ghost.style, { width: `${box.width}px`, left: `${box.left}px`, top: `${box.top}px` });
      shared.session.offset = { x: event.clientX - box.left, y: event.clientY - box.top };
      globalThis.document.body.append(ghost);
      return ghost;
    }

    track(x, y) {
      if (!shared.session) return;
      shared.session.pointer = { x, y };
      if (shared.session.ghost) Object.assign(shared.session.ghost.style, { left: `${x - shared.session.offset.x}px`, top: `${y - shared.session.offset.y}px` });
      this.retarget(x, y);
      this.startAutoScroll();
    }

    retarget(x, y) {
      const under = globalThis.document.elementFromPoint(x, y);
      const list = under?.closest?.('sf-sortable');
      for (const target of externalTargets) {
        const resolved = target.resolve(x, y, activeSortableSession());
        if (resolved) {
          shared.session.list = null;
          shared.session.external = { target, ...resolved };
          showIndicator(resolved.rect);
          return;
        }
      }
      shared.session.external = null;
      if (list && accepts(list, shared.session.group)) {
        const resolved = listTarget(list, x, y);
        shared.session.list = list;
        // Store the final index: positions after the source shift by one.
        shared.session.index = list === shared.session.fromList && shared.session.mode === 'move' && resolved.index > shared.session.sourceIndex ? resolved.index - 1 : resolved.index;
        showIndicator(resolved.rect);
      } else {
        shared.session.list = null;
        showIndicator(null);
      }
    }

    // Scrolls the nearest scroll container every frame while the pointer
    // stays in its edge zone, including when the pointer is held still.
    startAutoScroll() {
      if (!shared.session || shared.session.scrollFrame) return;
      const step = () => {
        if (!shared.session?.pointer) return;
        shared.session.scrollFrame = 0;
        const { x, y } = shared.session.pointer;
        const container = scrollContainer(globalThis.document.elementFromPoint(x, y));
        if (!container) return;
        const box = container === globalThis.document.scrollingElement
          ? { top: 0, bottom: globalThis.innerHeight }
          : container.getBoundingClientRect();
        const max = container.scrollHeight - container.clientHeight;
        let delta = 0;
        if (y < box.top + EDGE && container.scrollTop > 0) delta = -Math.ceil((box.top + EDGE - y) / 4);
        else if (y > box.bottom - EDGE && container.scrollTop < max) delta = Math.ceil((y - box.bottom + EDGE) / 4);
        if (delta) {
          // Instant even under scroll-behavior: smooth, so every frame advances.
          container.scrollBy({ top: delta, behavior: 'instant' });
          this.retarget(x, y);
          shared.session.scrollFrame = globalThis.requestAnimationFrame(step);
        }
      };
      shared.session.scrollFrame = globalThis.requestAnimationFrame(step);
    }

    drop() {
      if (!shared.session) return;
      const current = shared.session;
      if (current.external) {
        current.external.target.drop(activeSortableSession(), current.external.descriptor);
        finish(this, 'dropped');
        return;
      }
      if (current.list) {
        const index = current.index;
        const unchanged = current.list === current.fromList && index === current.sourceIndex;
        if (!unchanged) {
          emitIntent(current.list, {
            item: current.item, from: current.from, to: current.list.getAttribute('id') || current.list.group,
            index, mode: current.mode,
          });
          current.list.announce?.(format(messages().dropped, { item: itemLabel(current.source), index: index + 1, list: listName(current.list) }));
          finish(this, 'dropped');
          return;
        }
      }
      finish(this, 'cancelled');
    }

    // Keyboard path --------------------------------------------------------
    keyboardTargets() {
      return [...globalThis.document.querySelectorAll('sf-sortable')].filter((list) => list === shared.session?.fromList ? shared.session.mode === 'move' : accepts(list, shared.session?.group));
    }

    describeKeyboard(announce = true) {
      if (!shared.session) return;
      if (shared.session.external) {
        showIndicator(shared.session.external.rect);
        if (announce) this.announce(format(messages().target, { target: shared.session.external.label || '' }));
        return;
      }
      const list = shared.session.list;
      const full = items(list);
      const sameList = list === shared.session.fromList && shared.session.mode === 'move';
      const positions = full.length + (sameList ? 0 : 1);
      const physical = sameList && shared.session.index > shared.session.sourceIndex ? shared.session.index + 1 : shared.session.index;
      showIndicator(listIndicatorRect(list, full, Math.min(physical, full.length), list.getAttribute('orientation') === 'horizontal'));
      if (announce) this.announce(format(messages().moved, { index: shared.session.index + 1, total: positions, list: listName(list) }));
    }

    onKeyDown(event) {
      const item = event.target.closest?.(ITEM);
      if (!shared.session) {
        if (!item || item.closest('sf-sortable') !== this || event.target !== item) return;
        if (event.key !== ' ' && event.key !== 'Enter') return;
        event.preventDefault();
        if (!this.begin(item, 'keyboard')) return;
        // An abandoned keyboard move is cancelled when focus or a click leaves the list.
        const abandon = () => { if (shared.session?.fromList === this) { this.announce(messages().cancelled); finish(this, 'cancelled'); } };
        const cleanup = { signal: shared.session.cleanup.signal };
        this.addEventListener('focusout', (focusEvent) => {
          if (focusEvent.relatedTarget && this.contains(focusEvent.relatedTarget)) return;
          globalThis.setTimeout(() => { if (!this.contains(globalThis.document.activeElement)) abandon(); }, 0);
        }, cleanup);
        globalThis.document.addEventListener('pointerdown', (pointerEvent) => { if (!this.contains(pointerEvent.target)) abandon(); }, { ...cleanup, capture: true });
        if (shared.session.mode === 'copy') {
          const [first] = this.keyboardTargets();
          const external = [...externalTargets].flatMap((target) => (target.keyboardTargets?.(activeSortableSession()) || []).map((entry) => ({ target, ...entry })));
          if (first) {
            shared.session.list = first;
            shared.session.index = items(first).length;
          } else if (external.length) {
            shared.session.external = external[0];
          } else {
            finish(this, 'cancelled');
            return;
          }
        }
        if (shared.session.external) {
          this.describeKeyboard(false);
          this.announce(`${format(messages().picked, { item: itemLabel(item), index: 1, total: 1, list: '' }).split('.')[0]}. ${format(messages().target, { target: shared.session.external.label || '' })}`);
          return;
        }
        const all = items(shared.session.list);
        this.describeKeyboard(false);
        this.announce(format(messages().picked, { item: itemLabel(item), index: shared.session.index + 1, total: all.length, list: listName(shared.session.list) }));
        return;
      }
      if (shared.session.input !== 'keyboard' || shared.session.fromList !== this) return;
      const lists = this.keyboardTargets();
      const external = [...externalTargets].flatMap((target) => (target.keyboardTargets?.(activeSortableSession()) || []).map((entry) => ({ target, ...entry })));
      if (event.key === 'Escape' || event.key === 'Tab') {
        if (event.key === 'Escape') event.preventDefault();
        this.announce(messages().cancelled);
        finish(this, 'cancelled');
        return;
      }
      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();
        this.drop();
        return;
      }
      const vertical = { ArrowUp: -1, ArrowDown: 1 }[event.key];
      const across = { ArrowLeft: -1, ArrowRight: 1 }[event.key];
      if (vertical === undefined && across === undefined) return;
      event.preventDefault();
      if (shared.session.external) {
        const position = external.findIndex((entry) => entry.target === shared.session.external.target && JSON.stringify(entry.descriptor) === JSON.stringify(shared.session.external.descriptor));
        const next = external[position + (vertical ?? across)];
        if (next) shared.session.external = next;
        else if ((vertical ?? across) < 0 && lists.length) {
          shared.session.external = null;
          shared.session.list = lists.at(-1);
          shared.session.index = items(shared.session.list).length - (shared.session.list === shared.session.fromList && shared.session.mode === 'move' ? 1 : 0);
        }
        this.describeKeyboard();
        return;
      }
      const list = shared.session.list;
      const count = items(list).length - (list === shared.session.fromList && shared.session.mode === 'move' ? 1 : 0);
      if (vertical !== undefined) {
        const next = shared.session.index + vertical;
        if (next >= 0 && next <= count) shared.session.index = next;
        else if (next > count && across === undefined && external.length && lists.indexOf(list) === lists.length - 1) shared.session.external = external[0];
      } else {
        const next = lists[lists.indexOf(list) + across];
        if (next) {
          shared.session.list = next;
          shared.session.index = Math.min(shared.session.index, items(next).length - (next === shared.session.fromList && shared.session.mode === 'move' ? 1 : 0));
        } else if (across > 0 && external.length) {
          shared.session.external = external[0];
        }
      }
      this.describeKeyboard();
    }
  }

  registry.define('sf-sortable', SfSortable);
  return SfSortable;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ activeSortableSession, defineSortable, registerSortableDropTarget, sortableIndexAt });


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
let __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_composition_sortable_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("7c1f9c2b36da");
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("8185ae1e4765");
// Smart entry for sf-sortable. The loader fetches this bundle only when the
// page has an <sf-sortable> list, so pages without an editor keep core.js small.


(0,_core_js_composition_sortable_mjs__WEBPACK_IMPORTED_MODULE_0__.defineSortable)();
globalThis.SF = globalThis.SF || {};
globalThis.SF.Sortable = Object.freeze({
  SORTABLE_INTENT_EVENT: _core_js_composition_sortable_mjs__WEBPACK_IMPORTED_MODULE_0__.SORTABLE_INTENT_EVENT,
  SORTABLE_STATE_EVENT: _core_js_composition_sortable_mjs__WEBPACK_IMPORTED_MODULE_0__.SORTABLE_STATE_EVENT,
  activeSortableSession: _core_js_composition_sortable_mjs__WEBPACK_IMPORTED_MODULE_0__.activeSortableSession,
  registerSortableDropTarget: _core_js_composition_sortable_mjs__WEBPACK_IMPORTED_MODULE_0__.registerSortableDropTarget,
  sortableIndexAt: _core_js_composition_sortable_mjs__WEBPACK_IMPORTED_MODULE_0__.sortableIndexAt
});
})();

/******/ })()
;