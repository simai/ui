/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "b1f4795ad092"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SfPager: () => (/* binding */ SfPager),
/* harmony export */   clampIndex: () => (/* binding */ clampIndex),
/* harmony export */   normalizeItems: () => (/* binding */ normalizeItems)
/* harmony export */ });
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("a64ab46d3d8c");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("4e5307ab3b30");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("4c231960a2ad");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("3d07c6617401");
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("ca9340e29756");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_2__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
// sf-pager: navigation to the neighbouring page or step by meaning -- the
// previous and the next documentation page, a wizard's steps, a course's
// lessons, a record counter. Not list paging: sf-pagination keeps 1, 2, 3 ….
//
// One input, two forms. cards and row take two sides from string settings
// (prev-href, prev-title, next-href, next-title), so a server prints plain
// links that work without the script; without them a side is the neighbour
// in items. steps, course and counter read items and current.
//
// Every move a person makes is first the cancelable request
// sf-pager-navigate (vocabulary 1.1.5 §5 navigate {id, href}, with direction
// and index): a page cancels it to keep a step that is not valid yet, or to
// go there itself. A move in items is then the fact sf-pager-change. A
// link's request is followed by the browser, not by a change.
//
// From its component.json (standard simai.smart-component 1.3.13 §3, §4,
// §8): the settings and values are made by core/js/element-manifest.js,
// prev, next and go-to are the actions and answer outcomes, the words are
// the language files'.








const applied = () => ({
  outcome: 'applied'
});

const refused = reason => ({
  outcome: 'refused',
  reason
}); // A key pressed in a field is the field's: the keys setting never takes it.


const EDITABLE = 'input, textarea, select, [contenteditable=""], [contenteditable="true"], [role="textbox"], [role="combobox"], [role="spinbutton"], [role="slider"]';

const text = value => value === undefined || value === null ? '' : String(value); // items as given: a list of objects with a title; anything else is left out.


function normalizeItems(value) {
  const list = Array.isArray(value) ? value : [];
  return list.filter(item => item && typeof item === 'object').map((item, index) => ({
    id: text(item.id) || String(index),
    title: text(item.title),
    href: text(item.href),
    meta: text(item.meta)
  }));
} // current clamped to items (0 with no items).

function clampIndex(value, length) {
  const number = Math.trunc(Number(value));
  if (!Number.isFinite(number) || length <= 0) return 0;
  return Math.max(0, Math.min(length - 1, number));
}
const PagerElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_3__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_4__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_5__
  },
  source: 'ru',
  actions: {
    prev() {
      return this.move('prev');
    },

    next() {
      return this.move('next');
    },

    'go-to'({
      index
    } = {}) {
      return this.move('go-to', index);
    }

  }
});

class SfPager extends PagerElement {
  constructor() {
    super();

    this._onKey = event => this.onKey(event);

    this._keysBound = false;
  }

  static get observedAttributes() {
    return [...new Set([...super.observedAttributes, 'dir'])];
  }

  onConnected() {
    super.onConnected?.();
    this.sfHostState('data-complete', this.complete);
    this.bindKeys();
  }

  disconnectedCallback() {
    this.unbindKeys();
    super.disconnectedCallback?.();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === 'keys' && oldValue !== newValue && this.isConnected) this.bindKeys();
    if (name === 'complete' && oldValue !== newValue) this.sfHostState('data-complete', this.complete);
  }

  get list() {
    return normalizeItems(this.items);
  } // The current place clamped to items; the template reads it as `at`.


  get at() {
    return clampIndex(this.current, this.list.length);
  } // One side of cards or row: the settings first, else the neighbour in items.


  sideOf(which) {
    const href = which === 'prev' ? this.prevHref : this.nextHref;
    const title = which === 'prev' ? this.prevTitle : this.nextTitle;
    if (href || title) return {
      href: text(href),
      title: text(title) || text(href),
      index: null,
      id: null
    };
    const list = this.list;
    if (!list.length) return null;
    const index = this.at + (which === 'prev' ? -1 : 1);
    const item = list[index];
    return item ? {
      href: item.href,
      title: item.title,
      index,
      id: item.id
    } : null;
  } // A press on a side of cards or row.


  onSide(event, which) {
    const target = this.sideOf(which);
    if (!target) return; // A link opened in a new tab or window: the page stays, nothing is asked.

    if (target.href && (event.defaultPrevented || event.button > 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)) return;
    const allowed = this.sfEmit('navigate', {
      direction: which,
      index: target.index,
      id: target.id,
      href: target.href || null
    }, {
      cancelable: true
    });

    if (!allowed) {
      event.preventDefault();
      return;
    } // A link: the browser follows it. A side from items with no address
    // moves the place.


    if (!target.href && target.index !== null) this.apply(target.index, false, true);
  } // A move in items: the request, then the place, then the fact.
  //
  // person: a press, a key or a side of cards and row, reported by change;
  // an action called by a page asks the same request and moves silently (§8:
  // a value set from outside is not reported back).


  move(direction, wanted, {
    person = false
  } = {}) {
    const list = this.list;
    if (!list.length) return refused('empty');
    const from = this.at;
    const finishing = this.appearance === 'steps' || this.appearance === 'course';
    let index;
    let complete = false;

    if (direction === 'prev') {
      if (from <= 0) return refused('first');
      index = from - 1;
    } else if (direction === 'next') {
      if (from >= list.length - 1) {
        if (!finishing || this.complete) return refused('last');
        index = from;
        complete = true;
        direction = 'finish';
      } else {
        index = from + 1;
      }
    } else if (direction === 'restart') {
      index = 0;
    } else {
      index = clampIndex(wanted, list.length);
      if (index === from && !this.complete) return refused('current');
    }

    const item = list[index];
    const allowed = this.sfEmit('navigate', {
      direction,
      index,
      id: item.id,
      href: item.href || null
    }, {
      cancelable: true
    });
    if (!allowed) return refused('prevented');
    this.apply(index, complete, person); // An item with an address is a page of its own: go there.

    if (item.href && direction !== 'finish') globalThis.location?.assign?.(item.href);
    return applied();
  }

  apply(index, complete, person) {
    const previous = this.at;
    const focused = this.focusedControl();
    this.current = index;
    this.complete = complete;
    this.sfHostState('data-complete', complete);
    if (person) this.sfEmit('change', {
      previous,
      current: index,
      complete,
      item: { ...this.list[index]
      }
    });
    this.keepFocus(focused);
  } // A press on a control of steps, course or counter.


  press(direction) {
    return this.move(direction, undefined, {
      person: true
    });
  } // Which of the pager's two controls had focus before a move.


  focusedControl() {
    const active = document.activeElement;
    if (!active || !this.contains(active)) return '';
    if (active.closest('.sf-pager-back')) return 'back';
    if (active.closest('.sf-pager-forward')) return 'forward';
    if (active.closest('.sf-pager-lesson-action')) return 'lesson';
    return '';
  } // A control that became disabled, or was drawn anew, hands focus on: the
  // same control while it can take it, else the other one (§19.2's rule that
  // focus never falls to the page).


  keepFocus(was) {
    if (!was) return;

    const settle = () => {
      const pick = name => {
        const host = this.querySelector(`:scope .sf-pager-${name}`);
        const button = host?.querySelector('button') ?? host;
        return button && !button.disabled && button.getClientRects().length ? button : null;
      };

      const order = was === 'back' ? ['back', 'forward'] : was === 'forward' ? ['forward', 'back', 'lesson-action'] : ['lesson-action', 'forward'];
      const target = order.map(pick).find(Boolean);
      if (target && document.activeElement !== target) target.focus({
        preventScroll: true
      });
    }; // Lit draws in a microtask and the buttons theirs after it.


    if (typeof globalThis.requestAnimationFrame === 'function') globalThis.requestAnimationFrame(settle);else Promise.resolve().then(settle);
  }

  bindKeys() {
    const want = Boolean(this.keys) && this.isConnected;

    if (want && !this._keysBound) {
      document.addEventListener('keydown', this._onKey);
      this._keysBound = true;
    } else if (!want) {
      this.unbindKeys();
    }
  }

  unbindKeys() {
    if (!this._keysBound) return;
    document.removeEventListener('keydown', this._onKey);
    this._keysBound = false;
  } // ArrowLeft / ArrowRight on the page (keys set): never in a field, never a
  // key another component took, never while the pager is not shown.


  onKey(event) {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    const target = event.target instanceof Element ? event.target : null;
    if (target?.closest(EDITABLE) || target?.isContentEditable) return;
    if (!this.shown || !this.querySelector(':scope > nav')?.getClientRects().length) return;
    const rtl = getComputedStyle(this).direction === 'rtl';
    const forward = event.key === 'ArrowRight' !== rtl;
    const outcome = this.press(forward ? 'next' : 'prev');
    if (outcome.outcome === 'applied') event.preventDefault();
  }

  templateContext() {
    const list = this.list;
    const current = clampIndex(this.current, list.length);
    const count = list.length;
    const n = count ? current + 1 : 0;
    const appearance = this.appearance;

    const word = (key, vars) => this.sfWord(key, vars ? {
      vars
    } : {});

    const place = appearance === 'steps' ? word('step', {
      n,
      count
    }) : appearance === 'course' ? word('lesson', {
      n,
      count
    }) : appearance === 'counter' ? word('position', {
      n,
      count
    }) : '';
    return this.createTemplateContext({ ...this.getPropsContext(),
      component: this,
      appearance,
      size: this.size,
      label: this.label,
      prevLabel: this.prevLabel,
      nextLabel: this.nextLabel,
      doneLabel: this.doneLabel,
      prev: appearance === 'cards' || appearance === 'row' ? this.sideOf('prev') : null,
      next: appearance === 'cards' || appearance === 'row' ? this.sideOf('next') : null,
      list,
      at: current,
      complete: Boolean(this.complete),
      placeText: place,
      words: {
        nextLesson: word('next-lesson'),
        lastLesson: word('last-lesson'),
        start: word('start'),
        finished: word('finished'),
        restart: word('restart'),
        prevItem: word('prev-item'),
        nextItem: word('next-item')
      },
      rootClass: this.getRootClass()
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_2__.renderPagerTemplate)(this.templateContext());
  }

}

SfPager.define('sf-pager');

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "a64ab46d3d8c"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderPagerTemplate: () => (/* binding */ renderPagerTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
 // sf-pager's markup, one <nav> per appearance (scss/ draws them on the one
// ladder). cards and row are plain links from string settings, so the build
// snapshot of them is the markup a server prints and it works without the
// script; a side with no address is a button that moves in items. steps,
// course and counter are drawn with sf-button and sf-icon-button of the
// pager's size. Every place line («Шаг 2 из 5») is text in a polite live
// region; the track and the dots beside it are aria-hidden pictures of it.

const icon = (name, extra = '') => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class=${['sf-icon', 'sf-pager-icon', extra].filter(Boolean).join(' ')} aria-hidden="true">${name}</i>`; // One side of cards or row: a link with its address, else a button that
// moves in items; nothing when the side is empty (its place is kept by the
// grid or by the next side holding the inline end).


function side(context, which, body) {
  const target = context[which];
  if (!target) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const classes = `sf-pager-side sf-pager-side--${which}`;

  const onClick = event => context.component.onSide(event, which);

  if (target.href) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<a class=${classes} href=${target.href} rel=${which} @click=${onClick}>${body}</a>`;
  }

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<button class=${classes} type="button" @click=${onClick}>${body}</button>`;
}

function renderCards(context) {
  const {
    prev,
    next,
    prevLabel,
    nextLabel
  } = context;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    ${side(context, 'prev', (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-pager-direction">${icon('chevron_left')}<span>${prevLabel}</span></span><span class="sf-pager-title">${prev?.title}</span>`)}
    ${side(context, 'next', (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-pager-direction"><span>${nextLabel}</span>${icon('chevron_right')}</span><span class="sf-pager-title">${next?.title}</span>`)}
  `;
}

function renderRow(context) {
  const {
    prev,
    next,
    prevLabel,
    nextLabel
  } = context;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    ${side(context, 'prev', (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${icon('arrow_back')}<span class="sr-only">${prevLabel}: </span><span class="sf-pager-title">${prev?.title}</span>`)}
    ${side(context, 'next', (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sr-only">${nextLabel}: </span><span class="sf-pager-title">${next?.title}</span>${icon('arrow_forward')}`)}
  `;
}

function renderSteps(context) {
  const {
    component,
    list: items,
    at: current,
    complete,
    size,
    prevLabel,
    nextLabel,
    doneLabel,
    placeText: place
  } = context;
  const last = current >= items.length - 1;
  const item = items[current];
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <sf-button class="sf-pager-back" size=${size} appearance="outline" scheme="on-surface" text=${prevLabel}
      icon-start="chevron_left" ?disabled=${current <= 0} @click=${() => component.press('prev')}></sf-button>
    <div class="sf-pager-middle">
      <span class="sf-pager-place" role="status">${place}${item?.title ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-pager-place-title"> · ${item.title}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}</span>
      <span class="sf-pager-track" aria-hidden="true">${items.map((_, index) => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class=${`sf-pager-segment${complete || index <= current ? ' sf-pager-segment--done' : ''}`}></span>`)}</span>
    </div>
    <sf-button class="sf-pager-forward" size=${size} text=${last ? doneLabel : nextLabel}
      icon-end=${last ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : 'chevron_right'} ?disabled=${!items.length || last && complete} @click=${() => component.press('next')}></sf-button>
  `;
}

function lessonCard(context) {
  const {
    component,
    list: items,
    at: current,
    complete,
    size,
    doneLabel,
    words
  } = context;

  if (complete) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-pager-lesson sf-pager-lesson--finished">
      ${icon('check_circle', 'sf-pager-lesson-mark')}
      <span class="sf-pager-lesson-text"><span class="sf-pager-title">${words.finished}</span></span>
      <sf-button class="sf-pager-lesson-action" size=${size} appearance="outline" scheme="on-surface" text=${words.restart}
        @click=${() => component.press('restart')}></sf-button>
    </div>`;
  }

  const last = current >= items.length - 1;
  const index = last ? current : current + 1;
  const lesson = items[index];
  if (!lesson) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const note = [last ? words.lastLesson : words.nextLesson, lesson.meta].filter(Boolean).join(' · ');
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-pager-lesson">
    <span class="sf-pager-lesson-number" aria-hidden="true">${index + 1}</span>
    <span class="sf-pager-lesson-text"><span class="sf-pager-meta">${note}</span><span class="sf-pager-title">${lesson.title}</span></span>
    <sf-button class="sf-pager-lesson-action" size=${size} text=${last ? doneLabel : words.start}
      icon-end=${last ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : 'arrow_forward'} @click=${() => component.press('next')}></sf-button>
  </div>`;
}

function renderCourse(context) {
  const {
    list: items,
    at: current,
    complete,
    placeText: place
  } = context;

  const stage = index => complete || index < current ? 'done' : index === current ? 'current' : 'ahead';

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div class="sf-pager-progress">
      <span class="sf-pager-dots" aria-hidden="true">${items.map((item, index) => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class=${`sf-pager-dot sf-pager-dot--${stage(index)}`} title=${item.title || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}></span>`)}</span>
      <span class="sf-pager-place" role="status">${place}</span>
    </div>
    ${lessonCard(context)}
  `;
}

function renderCounter(context) {
  const {
    component,
    list: items,
    at: current,
    size,
    placeText: place,
    words
  } = context;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <sf-icon-button class="sf-pager-back" size=${size} appearance="outline" scheme="on-surface" icon="chevron_left"
      aria-label=${words.prevItem} ?disabled=${current <= 0} @click=${() => component.press('prev')}></sf-icon-button>
    <span class="sf-pager-place" role="status">${place}</span>
    <sf-icon-button class="sf-pager-forward" size=${size} appearance="outline" scheme="on-surface" icon="chevron_right"
      aria-label=${words.nextItem} ?disabled=${current >= items.length - 1} @click=${() => component.press('next')}></sf-icon-button>
  `;
}

const VIEWS = {
  cards: renderCards,
  row: renderRow,
  steps: renderSteps,
  course: renderCourse,
  counter: renderCounter
};
function renderPagerTemplate(context) {
  const appearance = VIEWS[context.appearance] ? context.appearance : 'cards';
  const classes = ['sf-pager', `sf-pager--${appearance}`, `sf-pager--size-${context.size === '1/2' ? 'half' : '1'}`, context.complete ? 'sf-pager--complete' : '', context.rootClass].filter(Boolean).join(' ');
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<nav class=${classes} style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} aria-label=${context.label || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>${VIEWS[appearance](context)}</nav>`;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "ca9340e29756"
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

/***/ "4e5307ab3b30"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.pager","tag":"sf-pager","version":"1.0.1","kind":"leaf","settings":{"appearance":{"type":"enum","values":["cards","row","steps","course","counter"],"default":"cards"},"size":{"type":"enum","values":["1/2","1"],"default":"1"},"prev-href":{"type":"string","default":""},"prev-title":{"type":"string","default":""},"next-href":{"type":"string","default":""},"next-title":{"type":"string","default":""},"items":{"type":"list","schema":{"items":{"type":"object","properties":{"id":{"type":"string"},"title":{"type":"string"},"href":{"type":"string"},"meta":{"type":"string"}},"required":["title"]}},"default":[]},"label":{"type":"string","default-from":"runtime.label"},"prev-label":{"type":"string","default-from":"runtime.prev"},"next-label":{"type":"string","default-from":"runtime.next"},"done-label":{"type":"string","default-from":"runtime.done"},"keys":{"type":"boolean","default":false}},"values":{"current":{"type":"number","integer":true,"min":0,"default":0},"complete":{"type":"boolean","default":false}},"events":{"navigate":{"carries":{"direction":{"type":"enum","values":["prev","next","finish","restart","go-to"]},"index":{"type":"number","nullable":true},"id":{"type":"string","nullable":true},"href":{"type":"string","nullable":true}},"cancelable":true},"change":{"x-native":false,"carries":{"previous":"number","current":"number","complete":"boolean","item":{"type":"object","nullable":true}}}},"actions":{"prev":{},"next":{},"go-to":{"with":{"index":"number"}}},"host-states":{"data-complete":"boolean"},"css-variables":{"--sf-pager-gap":{"type":"length","state":"default"},"--sf-pager-card-background":{"type":"color","state":"default"},"--sf-pager-card-border-color":{"type":"color","state":"default"},"--sf-pager-card-radius":{"type":"length","state":"default"},"--sf-pager-link-color":{"type":"color","state":"default"},"--sf-pager-meta-color":{"type":"color","state":"default"},"--sf-pager-track-color":{"type":"color","state":"default"},"--sf-pager-fill-color":{"type":"color","state":"default"}}}');

/***/ },

/***/ "4c231960a2ad"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Pager","runtime":{"label":"Adjacent pages","prev":"Back","next":"Next","done":"Done","step":"Step {n} of {count}","lesson":"Lesson {n} of {count}","position":"{n} of {count}","next-lesson":"Next lesson","last-lesson":"Last lesson","start":"Start","finished":"Course complete","restart":"Start over","prev-item":"Previous record","next-item":"Next record"}}');

/***/ },

/***/ "3d07c6617401"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Листалка страниц","runtime":{"label":"Соседние страницы","prev":"Назад","next":"Далее","done":"Готово","step":"Шаг {n} из {count}","lesson":"Урок {n} из {count}","position":"{n} из {count}","next-lesson":"Следующий урок","last-lesson":"Последний урок","start":"Начать","finished":"Курс пройден","restart":"Сначала","prev-item":"Предыдущая запись","next-item":"Следующая запись"}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("b1f4795ad092");
/******/
/******/ })()
;