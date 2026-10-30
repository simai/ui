/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "fea62563f6ac"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SfContents: () => (/* binding */ SfContents),
/* harmony export */   parseLevels: () => (/* binding */ parseLevels),
/* harmony export */   slugOf: () => (/* binding */ slugOf)
/* harmony export */ });
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("cd89fc8cb241");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("98e539eba4a2");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("c7309b7d2b47");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("8555c8fedc29");
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("39f7a04bb258");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_2__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
// sf-contents: the table of contents of one page («Оглавление») -- its
// sections as in-page links, the current one marked while the page scrolls.
//
// One list, four views (the sheet's): a side column with the current
// section's bar, a compact button with the reading progress that opens the
// list, strokes at the edge with the names on hover and focus, and a sticky
// row of anchor tabs; auto is the column on a wide screen and the compact
// button below the collapse step, by a media rule, so the printed markup is
// right before this code arrives.
//
// The sections are the items a server gives (the JSON island, or the
// property), else links written inside the element, else the headings of the
// target in the levels range. The printed list is plain links: without the
// script the browser jumps to the section.
//
// The current section is the last one whose top is at or above the top of the
// scroll area -- the container's scroll-padding-top, where a page with a
// sticky header says how much of the top is covered -- asked by an
// IntersectionObserver over the sections and a frame-throttled scroll
// listener, which also gives the reading progress.
//
// From its component.json (§3, §4, §8): the settings are made by
// core/js/element-manifest.js, refresh and toggle are the actions and answer
// outcomes, change is the fact sf-contents-change, the words are the language
// files'.






 // The Framework's breakpoints (core/scss/vars/_sf_var__breakpoint.scss), as
// the sheet's media rules read them: compact below the step.

const STEPS = {
  sm: '32rem',
  md: '44rem',
  lg: '60rem',
  xl: '72rem'
}; // A chosen section holds the answer while its scroll moves -- each scroll
// event extends the hold by this long, so a long smooth scroll keeps it and a
// section already in place lets it go at once -- and, once the scroll ended,
// while the section is in view and the person has not scrolled again: a
// section near the end of the page that cannot reach the top stays chosen.

const HOLD_MS = 300;
let sequence = 0;

const applied = () => ({
  outcome: 'applied'
});

const refused = reason => ({
  outcome: 'refused',
  reason
});

const ContentsElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_3__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_4__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_5__
  },
  source: 'ru',
  actions: {
    refresh() {
      this.collect();
      return applied();
    },

    toggle() {
      return this.isOpen ? this.closeList({
        restoreFocus: false
      }) : this.openList();
    }

  }
}); // The heading levels of a levels setting: "2-3", "2", "2,3".

function parseLevels(value) {
  const text = String(value ?? '').trim();
  const range = text.match(/^([1-6])\s*-\s*([1-6])$/u);

  if (range) {
    const [from, to] = [Number(range[1]), Number(range[2])].sort((a, b) => a - b);
    return Array.from({
      length: to - from + 1
    }, (_, at) => from + at);
  }

  const list = text.split(/[\s,]+/u).map(Number).filter(level => Number.isInteger(level) && level >= 1 && level <= 6);
  return list.length ? [...new Set(list)].sort((a, b) => a - b) : [2, 3];
} // An id for a heading that has none: its words, lower case, joined by -.

function slugOf(text) {
  return String(text ?? '').toLowerCase().trim().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-+|-+$/gu, '') || 'section';
} // What a heading says, without what it hides from assistive technology (an
// anchor mark, a permalink glyph).

function headingText(element) {
  const copy = element.cloneNode(true);
  copy.querySelectorAll('[aria-hidden="true"], .sf-sr-only-skip, script, style').forEach(node => node.remove());
  return copy.textContent.replace(/\s+/gu, ' ').trim();
}

const isScrollable = element => {
  const style = getComputedStyle(element);
  return /(auto|scroll|overlay)/u.test(style.overflowY) && element.scrollHeight > element.clientHeight + 1;
};

const reducedMotion = () => globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;

class SfContents extends ContentsElement {
  constructor() {
    super();
    this._id = `sf-contents-${++sequence}`;
    this.isOpen = false;
    this._sections = [];
    this._childItems = [];
    this._current = '';
    this._progress = 0;
    this._answered = false;
    this._hold = null;
    this._media = null;
    this._observer = null;
    this._scroller = null;
    this._frame = 0;
    this._revealCurrent = false;

    this._onMedia = () => this.syncCompact();

    this._onScroll = event => {
      if (this._hold && event?.type === 'scroll') {
        if (this._hold.settled || Date.now() > this._hold.until) this._hold = null;else this._hold.until = Date.now() + HOLD_MS;
      }

      this.scheduleSpy();
    };

    this._onScrollEnd = () => {
      if (this._hold) this._hold.settled = true;
      this.scheduleSpy();
    };

    this._onOutside = event => {
      if (!this.isOpen) return;
      const path = event.composedPath?.() ?? [];
      if (!path.includes(this)) this.closeList({
        restoreFocus: false
      });
    };

    this._onReady = () => this.collect();
  } // The read-only value current (component.json values).


  get current() {
    return this._current;
  } // A list set by the page or read from the island collects again.


  get items() {
    return super.items;
  }

  set items(value) {
    super.items = value;
    if (this._isMounted) this.collect();
  }

  get compact() {
    if (this.layout === 'compact') return true;
    if (this.layout !== 'auto') return false;
    return this._media ? !this._media.matches : false;
  } // The links written inside the element are its items (the default slot):
  // read once, taken out, and drawn as the list.


  onConnected() {
    super.onConnected?.();
    const nodes = Array.from(this.children).filter(child => !child.hasAttribute('slot') && !child.hasAttribute('data-sf-static') && child.localName !== 'script' && child.localName !== 'template');
    const links = nodes.flatMap(node => node.matches?.('a[href^="#"]') ? [node] : Array.from(node.querySelectorAll?.('a[href^="#"]') ?? []));

    if (links.length) {
      this._childItems = links.map(link => ({
        id: decodeURIComponent(link.getAttribute('href').slice(1)),
        text: link.textContent.replace(/\s+/gu, ' ').trim(),
        level: Number(link.dataset.level || link.getAttribute('aria-level')) || 2
      })).filter(item => item.id);
      nodes.forEach(node => node.remove());
    }

    this.watchMedia();
    this.collect();
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', this._onReady, {
      once: true
    });
  }

  onDisconnected() {
    this.stopSpy();
    this._media?.removeEventListener?.('change', this._onMedia);
    this._media = null;
    document.removeEventListener('DOMContentLoaded', this._onReady);
    document.removeEventListener('pointerdown', this._onOutside, true);
    this.isOpen = false;
    super.onDisconnected?.();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (oldValue === newValue || !this._isMounted) return;
    if (name === 'layout' || name === 'collapse') this.watchMedia();
    if (name === 'target' || name === 'levels') this.collect();
  }

  watchMedia() {
    this._media?.removeEventListener?.('change', this._onMedia);
    const step = STEPS[this.collapse];
    this._media = this.layout === 'auto' && step && typeof globalThis.matchMedia === 'function' ? globalThis.matchMedia(`(min-width: ${step})`) : null;
    this._media?.addEventListener?.('change', this._onMedia);
    this.syncCompact();
  } // The window crossed the step: the host says so, and a list the column no
  // longer opens closes.


  syncCompact() {
    this.sfHostState('data-compact', this.compact);
    if (!this.compact && this.isOpen) this.closeList({
      restoreFocus: false
    });
    this.requestComponentUpdate('compact');
  } // The content the headings are collected from.


  targetElement() {
    const selector = this.target;

    if (selector) {
      try {
        const found = document.querySelector(selector);
        if (found) return found;
      } catch {
        globalThis.console?.warn?.(`[SIMAI Framework] sf-contents: target "${selector}" is not a selector`);
      }

      return null;
    }

    return document.querySelector('main') ?? document.body;
  } // The sections: the items, else the links written inside, else the
  // headings of the target. A heading without an id is given one.


  collect() {
    const given = (Array.isArray(this.items) && this.items.length ? this.items : this._childItems).filter(item => item && item.id).map(item => ({
      id: String(item.id),
      text: String(item.text ?? item.label ?? item.id),
      level: Number(item.level) || 2
    }));
    let sections;

    if (given.length) {
      sections = given.map(item => ({ ...item,
        element: document.getElementById(item.id)
      }));
    } else {
      const root = this.targetElement();
      const levels = parseLevels(this.levels);
      const selector = levels.map(level => `h${level}`).join(', ');
      const headings = root ? Array.from(root.querySelectorAll(selector)) : [];
      const taken = new Set();
      sections = headings.filter(heading => !this.contains(heading) && !heading.closest('[hidden], sf-contents, [data-sf-contents-skip]')).map(heading => {
        const text = headingText(heading);

        if (!heading.id) {
          const base = slugOf(text);
          let id = base;

          for (let n = 2; document.getElementById(id) || taken.has(id); n += 1) id = `${base}-${n}`;

          heading.id = id;
        }

        taken.add(heading.id);
        return {
          id: heading.id,
          text,
          level: Number(heading.localName.slice(1)),
          element: heading
        };
      }).filter(section => section.text);
    }

    this._sections = sections;
    this.startSpy();
    this.spy({
      emit: false
    });
    this.requestComponentUpdate('sections');
  } // The element that scrolls the sections: the nearest scrolling ancestor of
  // the first one, else the window (null).


  scroller() {
    const first = this._sections.find(section => section.element)?.element;

    for (let node = first?.parentElement; node && node !== document.body && node !== document.documentElement; node = node.parentElement) {
      if (isScrollable(node)) return node;
    }

    return null;
  } // How much of the top of the scroll area is covered: its scroll-padding-top.


  coveredTop() {
    const element = this._scroller ?? document.documentElement;
    const value = parseFloat(getComputedStyle(element).scrollPaddingTop);
    return Number.isFinite(value) ? value : 0;
  }

  startSpy() {
    this.stopSpy();
    this._scroller = this.scroller();
    const source = this._scroller ?? globalThis;
    source.addEventListener('scroll', this._onScroll, {
      passive: true
    });
    source.addEventListener('scrollend', this._onScrollEnd, {
      passive: true
    });
    globalThis.addEventListener('resize', this._onScroll, {
      passive: true
    });
    this._source = source;

    if (typeof globalThis.IntersectionObserver === 'function') {
      this._observer = new IntersectionObserver(() => this.scheduleSpy(), {
        root: this._scroller,
        rootMargin: `-${Math.round(this.coveredTop())}px 0px 0px 0px`,
        threshold: [0, 1]
      });

      this._sections.forEach(section => section.element && this._observer.observe(section.element));
    }
  }

  stopSpy() {
    this._observer?.disconnect();
    this._observer = null;
    this._source?.removeEventListener('scroll', this._onScroll);
    this._source?.removeEventListener('scrollend', this._onScrollEnd);
    globalThis.removeEventListener('resize', this._onScroll);
    this._source = null;
    if (this._frame) globalThis.cancelAnimationFrame?.(this._frame);
    this._frame = 0;
  }

  scheduleSpy() {
    if (this._frame) return;

    const run = () => {
      this._frame = 0;
      this.spy();
    };

    this._frame = typeof globalThis.requestAnimationFrame === 'function' ? globalThis.requestAnimationFrame(run) : (Promise.resolve().then(run), 1);
  } // The current section and the reading progress, from the geometry now.


  spy({
    emit = true
  } = {}) {
    const sections = this._sections;
    const scroller = this._scroller;
    const area = scroller ? scroller.getBoundingClientRect() : {
      top: 0,
      bottom: globalThis.innerHeight || 0
    };
    const scrolling = scroller ?? document.scrollingElement ?? document.documentElement;
    const room = scrolling.scrollHeight - scrolling.clientHeight; // Nothing to scroll is nothing read yet: the printed line starts empty.

    const progress = room > 1 ? Math.min(1, Math.max(0, scrolling.scrollTop / room)) : 0;
    this.setProgress(progress);

    if (!sections.length) {
      this.setCurrent('', {
        emit
      });
      return;
    }

    const line = area.top + this.coveredTop();
    let id = sections[0].id;

    for (const section of sections) {
      if (!section.element) continue;
      const margin = parseFloat(getComputedStyle(section.element).scrollMarginTop) || 0;
      if (section.element.getBoundingClientRect().top - margin <= line + 1) id = section.id;
    }

    if (room > 1 && scrolling.scrollTop >= room - 2) {
      const shown = sections.filter(section => section.element && section.element.getBoundingClientRect().top < area.bottom);
      if (shown.length) id = shown.at(-1).id;
    }

    const held = this._hold && sections.find(section => section.id === this._hold.id);
    const inView = held?.element && held.element.getBoundingClientRect().top < area.bottom && held.element.getBoundingClientRect().bottom > area.top;
    if (held && (this._hold.settled ? inView : Date.now() < this._hold.until)) id = held.id;else this._hold = null;
    this.setCurrent(id, {
      emit
    });
  }

  setProgress(progress) {
    if (Math.abs(progress - this._progress) < 0.001) return;
    this._progress = progress; // The line follows every frame without a redraw of the list.

    this.querySelector(':scope .sf-contents-progress-value')?.style.setProperty('--sf-contents--progress', String(progress));
  }

  setCurrent(id, {
    emit = true,
    hash = true
  } = {}) {
    const previous = this._current;
    const first = !this._answered;
    this._answered = true;
    if (id === previous) return;
    this._current = id;
    this._revealCurrent = true;
    this.requestComponentUpdate('current');
    if (first || !emit || !id) return;

    if (hash && this.hash && globalThis.location?.hash !== `#${id}`) {
      try {
        globalThis.history?.replaceState(globalThis.history.state, '', `#${encodeURIComponent(id)}`);
      } catch {// A sandboxed frame may refuse; the address is a convenience.
      }
    }

    this.sfEmit('change', {
      id,
      previous: previous || null
    });
  } // A link chosen: its section, smoothly unless the person asked for less
  // motion, focus there, the address and the answer at once.


  choose(event, id) {
    if (event.defaultPrevented || event.button > 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const section = this._sections.find(one => one.id === id);

    const element = section?.element ?? document.getElementById(id);
    if (this.isOpen) this.closeList({
      restoreFocus: false
    });
    if (!element) return;
    event.preventDefault();
    this._hold = {
      id,
      until: Date.now() + HOLD_MS
    }; // instant, not auto: auto is the page's scroll-behavior, which may be smooth.

    element.scrollIntoView({
      behavior: reducedMotion() ? 'instant' : 'smooth',
      block: 'start'
    });
    if (!element.matches('a[href], button, input, select, textarea, [tabindex]')) element.setAttribute('tabindex', '-1');
    element.focus({
      preventScroll: true
    });
    this.setCurrent(id, {
      emit: true
    });
  } // The action toggle opens the compact view's list.


  openList() {
    if (this.isOpen) return applied();
    if (!this.compact) return refused('not-compact');
    this.isOpen = true;
    this.sfHostState('data-open', true);
    document.addEventListener('pointerdown', this._onOutside, true);
    this.requestComponentUpdate('open');
    return applied();
  }

  closeList({
    restoreFocus = true
  } = {}) {
    if (!this.isOpen) return refused('closed');
    this.isOpen = false;
    this.sfHostState('data-open', false);
    document.removeEventListener('pointerdown', this._onOutside, true);
    this.requestComponentUpdate('close');
    if (restoreFocus) this.toggleButton()?.focus({
      preventScroll: true
    });
    return applied();
  }

  toggleButton() {
    return this.querySelector(':scope .sf-contents-toggle button');
  }

  onKeydown(event) {
    if (event.key !== 'Escape' || !this.isOpen || event.defaultPrevented) return;
    event.preventDefault();
    event.stopPropagation();
    this.closeList({
      restoreFocus: true
    });
  } // The compact button is what the host's focus() reaches in the compact
  // view (the host is display: contents and has no box).


  focusDelegate() {
    return this.compact ? this.toggleButton() : this.querySelector(':scope .sf-contents-link');
  } // The bar keeps the current tab in view by scrolling itself, never the page.


  afterRender(changed) {
    const result = super.afterRender?.(changed);

    if (this._revealCurrent && this.layout === 'bar') {
      this._revealCurrent = false;
      const list = this.querySelector(':scope .sf-contents-list');
      const link = list?.querySelector('[aria-current="location"]');

      if (list && link && list.scrollWidth > list.clientWidth) {
        const box = list.getBoundingClientRect();
        const at = link.getBoundingClientRect();
        let left = list.scrollLeft;
        if (at.left < box.left) left -= box.left - at.left;else if (at.right > box.right) left += at.right - box.right;
        if (left !== list.scrollLeft) list.scrollTo({
          left,
          behavior: reducedMotion() ? 'instant' : 'smooth'
        });
      }
    }

    return result;
  }

  templateContext() {
    return this.createTemplateContext({ ...this.getPropsContext(),
      component: this,
      id: this._id,
      layout: this.layout,
      collapse: this.collapse,
      size: this.size,
      sticky: this.sticky,
      open: this.isOpen,
      compact: this.compact,
      label: this.label,
      sections: this._sections.map(({
        id,
        text,
        level
      }) => ({
        id,
        text,
        level
      })),
      current: this._current,
      progress: this._progress,
      rootClass: this.getRootClass()
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_2__.renderContentsTemplate)(this.templateContext());
  }

}

SfContents.define('sf-contents');

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "cd89fc8cb241"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderContentsTemplate: () => (/* binding */ renderContentsTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
 // One list drawn four ways. The root is a <nav> named by the label: a heading
// line, the compact view's button and progress line, and an ordered list of
// in-page links, the current one aria-current="location". Which parts show is
// the sheet's (scss/): column shows the heading and the list; compact the
// button and the progress, and the list as a raised panel while open; rail the
// list as strokes; bar the list as a row. layout auto is column or compact by a
// media rule, so the printed markup is right before the script arrives.

function renderContentsTemplate(context) {
  const {
    component,
    id,
    layout,
    collapse,
    size,
    sticky,
    open,
    compact,
    label,
    sections,
    current,
    progress,
    rootClass
  } = context;
  const listId = `${id}-list`;
  const currentSection = sections.find(section => section.id === current) ?? sections[0];
  const currentText = currentSection?.text ?? '';
  const top = sections.reduce((lowest, section) => Math.min(lowest, section.level), Infinity);
  const classes = ['sf-contents', `sf-contents--layout-${layout}`, layout === 'auto' ? `sf-contents--collapse-${collapse}` : '', `sf-contents--size-${size === '1' ? '1' : 'half'}`, sticky ? 'sf-contents--sticky' : '', open ? 'sf-contents--open' : '', rootClass].filter(Boolean).join(' ');
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<nav class=${classes} style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} aria-label=${label}
      @keydown=${event => component.onKeydown(event)}>
    <div class="sf-contents-head">
      <sf-button class="sf-contents-toggle" appearance="outline" scheme="on-surface" size=${size}
        icon-start="toc" icon-end="expand_more" text=${currentText || label} text-position="start" root-class="w-full"
        aria-label=${currentText ? `${label}: ${currentText}` : label} aria-controls=${listId}
        expanded=${compact && open ? '' : 'false'}
        @click=${() => component.toggle()}></sf-button>
      <span class="sf-contents-progress" aria-hidden="true"><span class="sf-contents-progress-value"
        style=${`--sf-contents--progress: ${progress}`}></span></span>
    </div>
    <span class="sf-contents-label" aria-hidden="true">${label}</span>
    <ol class="sf-contents-list" id=${listId} role="list">
      ${sections.map(section => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<li class="sf-contents-item" data-depth=${Math.max(0, section.level - (Number.isFinite(top) ? top : section.level))}>
        <a class="sf-contents-link" href=${`#${section.id}`} aria-current=${section.id === current ? 'location' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          @click=${event => component.choose(event, section.id)}><span class="sf-contents-mark" aria-hidden="true"></span><span class="sf-contents-text">${section.text}</span></a>
      </li>`)}
    </ol>
  </nav>`;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "39f7a04bb258"
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

/***/ "98e539eba4a2"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.contents","tag":"sf-contents","version":"1.0.0","kind":"leaf","settings":{"layout":{"type":"enum","values":["auto","column","compact","rail","bar"],"default":"auto"},"collapse":{"type":"enum","values":["sm","md","lg","xl"],"default":"lg"},"target":{"type":"string","default":""},"levels":{"type":"string","default":"2-3"},"items":{"type":"list","default":[],"of":{"id":"id","text":"string","level":{"type":"number","optional":true}}},"size":{"type":"enum","values":["1/2","1"],"default":"1/2"},"sticky":{"type":"boolean","default":true},"hash":{"type":"boolean","default":true},"label":{"type":"string","default-from":"runtime.label"}},"values":{"current":{"type":"id"}},"events":{"change":{"x-native":false,"carries":{"id":"id","previous":{"type":"id","nullable":true}}}},"actions":{"refresh":{},"toggle":{}},"host-states":{"data-open":"boolean","data-compact":"boolean"},"css-variables":{"--sf-contents-color":{"type":"color","state":"default"},"--sf-contents-current-color":{"type":"color","state":"current"},"--sf-contents-line-color":{"type":"color","state":"default"},"--sf-contents-background":{"type":"color","state":"default"},"--sf-contents-indent":{"type":"length","state":"default"},"--sf-contents-gap":{"type":"length","state":"default"},"--sf-contents-inset-block-start":{"type":"length","state":"default"},"--sf-contents-z-index":{"type":"number","state":"default"}}}');

/***/ },

/***/ "c7309b7d2b47"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Contents","runtime":{"label":"On this page"}}');

/***/ },

/***/ "8555c8fedc29"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Оглавление","runtime":{"label":"На этой странице"}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("fea62563f6ac");
/******/
/******/ })()
;