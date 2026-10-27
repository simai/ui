/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "5256f7956871"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("8489d1f5bab4");

const SCROLLBAR_TEXT = {
  en: {
    scroll: 'Scroll'
  },
  ru: {
    scroll: 'Прокрутка'
  }
};
const ROOT_SELECTOR = '.sf-scrollbar';
const VIEWPORT_SELECTOR = '.sf-scrollbar__viewport';
const TRACK_CLASS = 'sf-scrollbar__track';
const THUMB_CLASS = 'sf-scrollbar__thumb';
const MANAGED_PRESETS = new Set(['overlay', 'persistent']);
const VALID_PRESETS = new Set(['overlay', 'standard', 'persistent', 'hidden']);
const VALID_AXES = new Set(['vertical', 'horizontal']);
const IDLE_DELAY = 900;
const controllers = new WeakMap();
let viewportId = 0;

function getPreset(root) {
  const value = String(root.getAttribute('data-mode') || root.getAttribute('data-sf-scrollbar') || 'overlay').trim().toLowerCase();
  return VALID_PRESETS.has(value) ? value : 'overlay';
}

function getAxis(root) {
  const value = String(root.getAttribute('data-axis') || root.getAttribute('data-sf-scrollbar-axis') || 'vertical').trim().toLowerCase();
  return VALID_AXES.has(value) ? value : 'vertical';
}

function createTrack(viewport, axis) {
  const track = document.createElement('div');
  const thumb = document.createElement('button');
  track.className = `${TRACK_CLASS} ${TRACK_CLASS}--${axis}`;
  thumb.className = `${THUMB_CLASS} ${THUMB_CLASS}--${axis}`;
  thumb.type = 'button';
  thumb.setAttribute('role', 'scrollbar');
  thumb.setAttribute('aria-orientation', axis);
  thumb.setAttribute('aria-valuemin', '0');
  thumb.setAttribute('aria-valuemax', '100');
  thumb.setAttribute('aria-valuenow', '0');
  const labelledBy = viewport.getAttribute('aria-labelledby');
  const label = viewport.getAttribute('aria-label');
  if (labelledBy) thumb.setAttribute('aria-labelledby', labelledBy);else thumb.setAttribute('aria-label', label || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_0__.pageText)(SCROLLBAR_TEXT, 'scroll', viewport));

  if (!viewport.id) {
    viewportId += 1;
    viewport.id = `sf-scrollbar-viewport-${viewportId}`;
  }

  thumb.setAttribute('aria-controls', viewport.id);
  track.append(thumb);
  return {
    track,
    thumb
  };
}

function measureTokenLength(root, propertyName) {
  const probe = document.createElement('span');
  probe.setAttribute('aria-hidden', 'true');
  probe.style.position = 'absolute';
  probe.style.blockSize = `var(${propertyName})`;
  probe.style.pointerEvents = 'none';
  probe.style.visibility = 'hidden';
  root.append(probe);
  const value = probe.offsetHeight;
  probe.remove();
  return value;
}

class ScrollbarController {
  constructor(root, viewport, preset, axis) {
    this.root = root;
    this.viewport = viewport;
    this.preset = preset;
    this.axis = axis;
    this.idleTimer = 0;
    this.dragging = false;
    this.pointerOverTrack = false;
    this.dragPointerOffset = 0;
    this.cleanup = [];
    this.keyboardStep = measureTokenLength(root, '--sf-scrollbar-keyboard-step');
    const {
      track,
      thumb
    } = createTrack(viewport, axis);
    this.track = track;
    this.thumb = thumb;
    root.append(track); // The keyboard stop is the scrolling area, not the thumb: a focused region
    // scrolls with the arrow keys natively, the way every scrolling area in a
    // browser does, and one stop per area is enough. The thumb stays for the
    // pointer. A labelled area becomes a region so its label is announced.

    thumb.tabIndex = -1;
    if (!viewport.hasAttribute('tabindex')) viewport.tabIndex = 0;

    if (!viewport.hasAttribute('role') && (viewport.hasAttribute('aria-label') || viewport.hasAttribute('aria-labelledby'))) {
      viewport.setAttribute('role', 'region');
    }

    this.bind();
    this.sync();
    this.setIdle();
  }

  listen(target, type, listener, options) {
    target.addEventListener(type, listener, options);
    this.cleanup.push(() => target.removeEventListener(type, listener, options));
  }

  isHorizontalRtl() {
    return this.axis === 'horizontal' && getComputedStyle(this.viewport).direction === 'rtl';
  }

  getLogicalScrollPosition(maxScroll) {
    if (this.axis === 'vertical') return this.viewport.scrollTop;
    const position = this.isHorizontalRtl() ? -this.viewport.scrollLeft : this.viewport.scrollLeft;
    return Math.min(maxScroll, Math.max(0, position));
  }

  setLogicalScrollPosition(position, maxScroll) {
    const boundedPosition = Math.min(maxScroll, Math.max(0, position));

    if (this.axis === 'vertical') {
      this.viewport.scrollTop = boundedPosition;
      return;
    }

    this.viewport.scrollLeft = this.isHorizontalRtl() ? -boundedPosition : boundedPosition;
  }

  getKeyboardStep() {
    return this.keyboardStep > 0 ? this.keyboardStep : this.thumb.offsetHeight;
  }

  bind() {
    this.listen(this.viewport, 'scroll', () => {
      this.sync();
      this.activate();
    }, {
      passive: true
    });
    this.listen(this.track, 'pointerenter', () => {
      this.pointerOverTrack = true;
      this.activate();
    });
    this.listen(this.track, 'pointerleave', () => {
      this.pointerOverTrack = false;
      this.scheduleIdle();
    });
    this.listen(this.track, 'pointerdown', event => {
      if (event.target !== this.track) return;
      event.preventDefault();
      const thumbRect = this.thumb.getBoundingClientRect();
      const pointer = this.axis === 'horizontal' ? event.clientX : event.clientY;
      const thumbStart = this.axis === 'horizontal' ? thumbRect.left : thumbRect.top;
      const direction = pointer < thumbStart ? -1 : 1;
      const viewportSize = this.axis === 'horizontal' ? this.viewport.clientWidth : this.viewport.clientHeight;
      const step = this.getKeyboardStep();
      const page = Math.max(step, viewportSize - step);
      this.viewport.scrollBy(this.axis === 'horizontal' ? {
        left: direction * page
      } : {
        top: direction * page
      });
      this.activate();
    });
    this.listen(this.thumb, 'pointerdown', event => {
      event.preventDefault();
      const thumbRect = this.thumb.getBoundingClientRect();
      this.dragging = true;
      this.dragPointerOffset = this.axis === 'horizontal' ? event.clientX - thumbRect.left : event.clientY - thumbRect.top;
      this.root.dataset.sfScrollbarDragging = 'true';
      this.thumb.setPointerCapture?.(event.pointerId);
      this.activate();
    });
    this.listen(this.thumb, 'pointermove', event => {
      if (!this.dragging) return;
      const trackRect = this.track.getBoundingClientRect();
      const trackSize = this.axis === 'horizontal' ? this.track.clientWidth : this.track.clientHeight;
      const thumbSize = this.axis === 'horizontal' ? this.thumb.offsetWidth : this.thumb.offsetHeight;
      const viewportSize = this.axis === 'horizontal' ? this.viewport.clientWidth : this.viewport.clientHeight;
      const contentSize = this.axis === 'horizontal' ? this.viewport.scrollWidth : this.viewport.scrollHeight;
      const pointer = this.axis === 'horizontal' ? event.clientX : event.clientY;
      const trackStart = this.axis === 'horizontal' ? trackRect.left : trackRect.top;
      const maxThumbOffset = Math.max(1, trackSize - thumbSize);
      const maxScroll = Math.max(0, contentSize - viewportSize);
      const pointerOffset = pointer - trackStart - this.dragPointerOffset;
      const thumbOffset = Math.min(maxThumbOffset, Math.max(0, pointerOffset));
      const ratio = this.isHorizontalRtl() ? 1 - thumbOffset / maxThumbOffset : thumbOffset / maxThumbOffset;
      this.setLogicalScrollPosition(ratio * maxScroll, maxScroll);
    });

    const endDrag = event => {
      if (!this.dragging) return;
      this.dragging = false;
      this.root.dataset.sfScrollbarDragging = 'false';

      if (this.thumb.hasPointerCapture?.(event.pointerId)) {
        this.thumb.releasePointerCapture(event.pointerId);
      }

      this.scheduleIdle();
    };

    this.listen(this.thumb, 'pointerup', endDrag);
    this.listen(this.thumb, 'pointercancel', endDrag);
    this.listen(this.thumb, 'lostpointercapture', endDrag);
    this.listen(this.thumb, 'focus', () => this.activate());
    this.listen(this.thumb, 'blur', () => this.scheduleIdle());
    this.listen(this.viewport, 'focus', () => this.activate());
    this.listen(this.viewport, 'blur', () => this.scheduleIdle());
    this.listen(this.thumb, 'keydown', event => {
      const line = this.getKeyboardStep();
      const viewportSize = this.axis === 'horizontal' ? this.viewport.clientWidth : this.viewport.clientHeight;
      const page = Math.max(line, viewportSize - line);
      const verticalCommands = {
        ArrowUp: () => this.viewport.scrollBy({
          top: -line
        }),
        ArrowDown: () => this.viewport.scrollBy({
          top: line
        }),
        PageUp: () => this.viewport.scrollBy({
          top: -page
        }),
        PageDown: () => this.viewport.scrollBy({
          top: page
        })
      };
      const horizontalCommands = {
        ArrowLeft: () => this.viewport.scrollBy({
          left: -line
        }),
        ArrowRight: () => this.viewport.scrollBy({
          left: line
        }),
        PageUp: () => this.viewport.scrollBy({
          left: -page
        }),
        PageDown: () => this.viewport.scrollBy({
          left: page
        })
      };
      const commands = { ...(this.axis === 'horizontal' ? horizontalCommands : verticalCommands),
        Home: () => {
          const contentSize = this.axis === 'horizontal' ? this.viewport.scrollWidth : this.viewport.scrollHeight;
          this.setLogicalScrollPosition(0, Math.max(0, contentSize - viewportSize));
        },
        End: () => {
          const contentSize = this.axis === 'horizontal' ? this.viewport.scrollWidth : this.viewport.scrollHeight;
          const maxScroll = Math.max(0, contentSize - viewportSize);
          this.setLogicalScrollPosition(maxScroll, maxScroll);
        }
      };
      if (!commands[event.key]) return;
      event.preventDefault();
      commands[event.key]();
      this.activate();
    });

    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => this.sync());
      this.resizeObserver.observe(this.viewport);
      Array.from(this.viewport.children).forEach(child => {
        if (child instanceof HTMLElement) this.resizeObserver.observe(child);
      });
    } else {
      this.listen(window, 'resize', () => this.sync(), {
        passive: true
      });
    }

    if (typeof MutationObserver !== 'undefined') {
      this.contentObserver = new MutationObserver(() => {
        if (this.resizeObserver) {
          Array.from(this.viewport.children).forEach(child => {
            if (child instanceof HTMLElement) this.resizeObserver.observe(child);
          });
        }

        this.sync();
      });
      this.contentObserver.observe(this.viewport, {
        attributes: true,
        attributeFilter: ['class', 'hidden', 'style'],
        characterData: true,
        childList: true,
        subtree: true
      });
    }
  }

  sync() {
    const viewportSize = this.axis === 'horizontal' ? this.viewport.clientWidth : this.viewport.clientHeight;
    const contentSize = this.axis === 'horizontal' ? this.viewport.scrollWidth : this.viewport.scrollHeight;
    const maxScroll = Math.max(0, contentSize - viewportSize);
    const hasOverflow = maxScroll > 1;
    const requestedThumbSize = hasOverflow ? Math.round(viewportSize * viewportSize / contentSize) : viewportSize;
    this.root.dataset.sfScrollbarOverflow = String(hasOverflow);

    if (this.axis === 'horizontal') {
      this.thumb.style.inlineSize = `${requestedThumbSize}px`;
    } else {
      this.thumb.style.blockSize = `${requestedThumbSize}px`;
    }

    const thumbSize = this.axis === 'horizontal' ? this.thumb.offsetWidth : this.thumb.offsetHeight;
    const maxThumbOffset = Math.max(0, viewportSize - thumbSize);
    const ratio = maxScroll ? this.getLogicalScrollPosition(maxScroll) / maxScroll : 0;
    const physicalOffset = Math.round(maxThumbOffset * ratio) * (this.isHorizontalRtl() ? -1 : 1);
    this.thumb.style.setProperty('--sf-scrollbar-thumb-offset', `${physicalOffset}px`);
    this.thumb.setAttribute('aria-valuenow', String(Math.round(ratio * 100)));
    this.thumb.disabled = !hasOverflow;
  }

  activate() {
    window.clearTimeout(this.idleTimer);
    this.root.dataset.sfScrollbarState = 'active';

    if (this.preset === 'overlay') {
      this.scheduleIdle();
    }
  }

  scheduleIdle() {
    window.clearTimeout(this.idleTimer);

    if (this.preset === 'persistent' || this.dragging || this.pointerOverTrack || document.activeElement === this.thumb) {
      return;
    }

    this.idleTimer = window.setTimeout(() => this.setIdle(), IDLE_DELAY);
  }

  setIdle() {
    this.root.dataset.sfScrollbarState = this.preset === 'persistent' ? 'active' : 'idle';
  }

  destroy() {
    window.clearTimeout(this.idleTimer);
    this.resizeObserver?.disconnect();
    this.contentObserver?.disconnect();
    this.cleanup.forEach(remove => remove());
    this.track.remove();
    delete this.root.dataset.sfScrollbarState;
    delete this.root.dataset.sfScrollbarDragging;
    delete this.root.dataset.sfScrollbarOverflow;
    delete this.root.dataset.sfScrollbarReady;
  }

}

function destroyScrollbar(root) {
  const controller = controllers.get(root);
  if (!controller) return;
  controller.destroy();
  controllers.delete(root);
}

function initScrollbar(root) {
  if (!(root instanceof HTMLElement) || !root.matches(ROOT_SELECTOR)) return;
  const preset = getPreset(root);
  const axis = getAxis(root);
  const canonicalPreset = root.getAttribute('data-mode');
  const legacyPreset = root.getAttribute('data-sf-scrollbar');
  const requestedPreset = String(canonicalPreset || legacyPreset || '').trim().toLowerCase();

  if (requestedPreset && !VALID_PRESETS.has(requestedPreset)) {
    root.setAttribute(canonicalPreset !== null ? 'data-mode' : 'data-sf-scrollbar', preset);
  }

  const existing = controllers.get(root);
  if (existing?.preset === preset && existing?.axis === axis) return;
  if (existing) destroyScrollbar(root);
  root.dataset.sfScrollbarReady = 'true';
  if (!MANAGED_PRESETS.has(preset)) return;
  const viewport = root.querySelector(`:scope > ${VIEWPORT_SELECTOR}`);
  if (!(viewport instanceof HTMLElement)) return;
  controllers.set(root, new ScrollbarController(root, viewport, preset, axis));
}

function initScrollbars(target = document) {
  if (target instanceof HTMLElement && target.matches(ROOT_SELECTOR)) {
    initScrollbar(target);
  }

  target.querySelectorAll?.(ROOT_SELECTOR).forEach(initScrollbar);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initScrollbars(document));
} else {
  initScrollbars(document);
}

if (typeof MutationObserver !== 'undefined') {
  new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.type === 'attributes' && mutation.target instanceof HTMLElement && mutation.target.matches(ROOT_SELECTOR)) {
        initScrollbar(mutation.target);
        return;
      }

      mutation.removedNodes.forEach(node => {
        if (!(node instanceof HTMLElement)) return;
        if (node.matches(ROOT_SELECTOR)) destroyScrollbar(node);
        node.querySelectorAll?.(ROOT_SELECTOR).forEach(destroyScrollbar);
      });
      mutation.addedNodes.forEach(node => {
        if (node instanceof HTMLElement) initScrollbars(node);
      });
    });
  }).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-mode', 'data-axis', 'data-sf-scrollbar', 'data-sf-scrollbar-axis'],
    childList: true,
    subtree: true
  });
}

globalThis.SF = globalThis.SF || {};
globalThis.SF.Scrollbar = {
  destroy: destroyScrollbar,
  init: initScrollbars
};

/***/ },

/***/ "435019e7ed9c"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _scrollbar__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("5256f7956871");
/*
* Main JS file for including JS for component.
*
* Imports:
* - Base function component (_component_name.js)
*/


/***/ },

/***/ "8489d1f5bab4"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   followLanguage: () => (/* binding */ followLanguage),
/* harmony export */   isRussianPage: () => (/* binding */ isRussianPage),
/* harmony export */   language: () => (/* binding */ language),
/* harmony export */   pageLanguage: () => (/* binding */ pageLanguage),
/* harmony export */   pageLocale: () => (/* binding */ pageLocale),
/* harmony export */   pageText: () => (/* binding */ pageText),
/* harmony export */   pageWord: () => (/* binding */ pageWord)
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
}; // The nearest element that says its language, looking past shadow roots: a
// pagination drawn inside a data view's shadow root found no [lang] there,
// fell back to <html lang> and spoke English inside a Russian admin whose
// language was set on the shell around it.


function langOwner(node) {
  let current = node;

  while (current) {
    const owner = typeof current.closest === 'function' ? current.closest('[lang]') : null;
    if (owner) return owner;
    const root = typeof current.getRootNode === 'function' ? current.getRootNode() : null;
    current = root && root !== current && root.host ? root.host : null;
  }

  return null;
} // The language of a part of the page wins over the language chosen for the
// whole page (owner, 2026-10-26; standard simai.smart-component 1.3.8 §11.1):
//   1. a word given on the element itself (the component's own attribute);
//   2. the nearest [lang] below <html>;
//   3. the page's choice, SF.language.use(), which also sets <html lang>;
//   4. <html lang>;
//   5. English.
// Until 2026-10-27 the choice won over a section's [lang], so an English
// section inside a Russian page that had called use('ru') spoke Russian.


function languageSource(node) {
  const owner = langOwner(node);
  const root = globalThis.document?.documentElement ?? null;
  if (owner && owner !== root) return owner.getAttribute('lang');
  if (STORE.chosen) return STORE.chosen;
  return owner?.getAttribute('lang') || root?.lang || 'en';
}
/**
 * The page's language for this node: the nearest [lang] below <html>, else
 * the language the page chose, else <html lang>, else English.
 */


function pageLanguage(node) {
  // The language without its region, whichever way it was set: a page that
  // chose 'pt-BR' is a Portuguese page, as a page whose markup says
  // lang="pt-BR" is. The chosen value kept its region and answered 'pt-br',
  // which matched no dictionary keyed by language and made isRussianPage false
  // on a page that chose 'ru-RU'. The region stays in pageLocale.
  return normalise(languageSource(node)).split('-')[0] || 'en';
}
/** The page's language with its region kept, which is what formatting wants. */

function pageLocale(node) {
  return normalise(languageSource(node)) || 'en';
}
/**
 * Follows `lang` in the document (§11.1 «changes are followed»): one observer
 * for the page, whichever bundle starts it, and the elements under a changed
 * [lang] draw again. `element.requestComponentUpdate('language')` is what a
 * Smart element does; anything else passes its own `redraw`. Returns the way
 * to stop following.
 */

function followLanguage(element, redraw = () => element.requestComponentUpdate?.('language')) {
  const root = typeof globalThis !== 'undefined' ? globalThis : {};
  const doc = element?.ownerDocument ?? root.document;
  const Observer = doc?.defaultView?.MutationObserver ?? root.MutationObserver;
  if (!doc?.documentElement || typeof Observer !== 'function') return () => {};

  if (!root.__sfLanguageWatch || root.__sfLanguageWatch.document !== doc) {
    const watch = {
      document: doc,
      elements: new Map(),
      observer: null
    };
    watch.observer = new Observer(records => {
      const changed = [...new Set(records.map(record => record.target))];

      for (const [one, again] of [...watch.elements]) {
        if (changed.some(target => within(target, one))) {
          try {
            again();
          } catch {// One element that fails to draw does not keep the others in the
            // old language.
          }
        }
      }
    });
    watch.observer.observe(doc.documentElement, {
      attributes: true,
      attributeFilter: ['lang'],
      subtree: true
    });
    root.__sfLanguageWatch = watch;
  }

  const watch = root.__sfLanguageWatch;
  watch.elements.set(element, redraw);
  return () => watch.elements.delete(element);
} // Whether `node` is `target` or below it, across shadow roots.

function within(target, node) {
  for (let current = node; current;) {
    if (current === target) return true;
    current = current.parentNode || current.host || null;
  }

  return false;
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
} // Missing words are said once per component, word and language: a page that
// draws a hundred rows must not print a hundred warnings. The marks are kept on
// the shared global, because every bundle carries this module.

function warnWord(owner, key, locale, said) {
  const root = typeof globalThis !== 'undefined' ? globalThis : {};
  if (!(root.__sfWordWarnings instanceof Set)) root.__sfWordWarnings = new Set();
  const mark = `${owner}|${key}|${locale}|${said}`;
  if (root.__sfWordWarnings.has(mark)) return;

  root.__sfWordWarnings.add(mark);

  globalThis.console?.warn?.(`[SIMAI Framework] ${owner || 'component'}: no word "${key}" for ${locale}${said === 'key' ? '; the key is shown' : `; said in ${said}`}`);
}

function fill(text, locale, count, vars) {
  return String(text).replace(/\{([a-z][\w-]*)\}/giu, (whole, name) => {
    if (name === 'n' && count !== undefined) {
      try {
        return new Intl.NumberFormat(locale).format(count);
      } catch {
        return String(count);
      }
    }

    return vars && Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name]) : whole;
  });
}
/**
 * A component's own word (standard simai.smart-component 1.3.8 §11, §11.1).
 *
 * `dictionary` is `{<locale>: {<key>: word}}` from the component's language
 * files. A word given on the element itself is the caller's to prefer; this
 * resolves the rest: words registered for the element's language, then the
 * shipped ones, the language without its region, English, the component's
 * source language and, last, the key. The last two warn once. A word that
 * takes a number is an object of plural forms chosen by Intl.PluralRules of
 * the language the word was found in; `{n}` is the number in that language's
 * format and `{name}` takes `vars.name`.
 *
 * `former` names the key the same word had before a rename (one key or a
 * list): a product that registered its words under the old key keeps them
 * until the alias's day. For each language the word registered under the new
 * key wins, then one registered under an old key, then the shipped one; a
 * word taken by an old key is reported to `onFormer(oldKey)`, which notes the
 * deprecation.
 */


function pageWord(dictionary, key, node, {
  component,
  source = '',
  count,
  vars,
  former,
  onFormer
} = {}) {
  const owner = component ?? componentOf(node);
  const locale = pageLocale(node);
  const order = chain(locale);
  const sourceLanguage = normalise(source);
  if (sourceLanguage && !order.includes(sourceLanguage)) order.push(sourceLanguage);
  const formerKeys = former === undefined || former === null ? [] : [].concat(former);

  for (const candidate of order) {
    const registered = owner ? REGISTERED.get(owner)?.get(candidate) : undefined;
    let added = registered?.[key];

    if (added === undefined && registered) {
      const old = formerKeys.find(name => registered[name] !== undefined && registered[name] !== null);

      if (old !== undefined) {
        added = registered[old];
        onFormer?.(old);
      }
    }

    const word = added !== undefined ? added : dictionary?.[candidate]?.[key];
    if (word === undefined || word === null) continue;
    if (candidate === sourceLanguage && !chain(locale).includes(candidate)) warnWord(owner, key, locale, candidate);

    if (typeof word === 'object') {
      let form = 'other';

      if (count !== undefined) {
        try {
          form = new Intl.PluralRules(candidate).select(Number(count));
        } catch {
          form = 'other';
        }
      }

      const picked = word[form] ?? word.other;
      if (picked === undefined) continue;
      return fill(picked, candidate, count, vars);
    }

    return fill(word, candidate, count, vars);
  }

  warnWord(owner, key, locale, 'key');
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
    STORE.chosen = next; // The choice is the page's language: <html lang> says it too (§11.1), so
    // the browser, a screen reader and CSS :lang() agree with the words.
    // use(null) gives the markup's own language back.

    const root = globalThis.document?.documentElement;

    if (root) {
      const holder = globalThis;

      if (next) {
        if (holder.__sfMarkupLanguage === undefined) holder.__sfMarkupLanguage = root.getAttribute('lang');
        if (root.getAttribute('lang') !== next) root.setAttribute('lang', next);
      } else if (holder.__sfMarkupLanguage !== undefined) {
        if (holder.__sfMarkupLanguage === null) root.removeAttribute('lang');else root.setAttribute('lang', holder.__sfMarkupLanguage);
        holder.__sfMarkupLanguage = undefined;
      }
    }

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

/***/ "a22ce96bf26f"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


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
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("a22ce96bf26f");
/* harmony import */ var _js_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("435019e7ed9c");
/**
* SIMAI Framework
* Copyright 2008-2026 SIMAI Ltd
* http://simai.studio
* Read the license: http://framework.simai.studio/license/
* Documentation: http://framework.simai.studio/
* Support: http://simai.studio/support/
*
* SCROLLBAR
*
* Entry point for importing components from this directory.
* Simplifies the import process in other parts of the project.
* Instead of importing individual files, all component can be imported through this file.
*/


})();

/******/ })()
;