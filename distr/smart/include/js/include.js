/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "533f85ff6db1"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SfInclude: () => (/* binding */ SfInclude),
/* harmony export */   VIEW_MARGIN: () => (/* binding */ VIEW_MARGIN),
/* harmony export */   lineCount: () => (/* binding */ lineCount),
/* harmony export */   partFrom: () => (/* binding */ partFrom)
/* harmony export */ });
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("70c2f395a2af");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("a35a5057e1f9");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("d97de4199bbc");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("c4bf739d2198");
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("8759b3d1f68e");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_2__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
// sf-include: a part of the page loaded from an address -- the successor of
// the retired class units ajax, ajaxload and lazy-load (ui-control
// control/LEGACY-UNITS-RETIREMENT-AND-NEW-PARTS-2026-11-02.md step 3). The old
// ajaxload polled every element once a second and filled it through
// BX.ajax.post, so it worked on Bitrix alone; this is fetch, and for
// load="view" one IntersectionObserver per element, gone after its sighting.
//
//   <sf-include src="/parts/news/" load="view"></sf-include>
//
// While the part loads the element shows a placeholder (an sf-skeleton, or
// the page's slot="placeholder"); when it arrives, the server's HTML in its
// place, cleaned of scripts (partFrom), and the Loader starts the components
// in it; when it does not, a polite error with Retry. Facts:
// sf-include-loaded, sf-include-load-failed. Action: refresh.
//
// From its component.json (standard simai.smart-component 1.3.14 §3, §4,
// §8): the settings are made by core/js/element-manifest.js, refresh is the
// action and answers an outcome, the words are the language files'.






 // How near the viewport a load="view" part starts loading.

const VIEW_MARGIN = '200px'; // A <script> stays only as a data block (a JSON island such as
// data-sf-settings, which the components of the part read); any other type,
// or none, is code and is taken out.

const DATA_BLOCK = /(?:^|[/+])json$/u; // Attributes that take an address: a javascript: one is code.

const ADDRESS = new Set(['href', 'src', 'action', 'formaction', 'xlink:href', 'poster', 'data']); // eslint-disable-next-line no-control-regex -- matching control characters is the point

const CONTROLS = /[\u0000- \u007f-\u009f]/gu;

function clean(root) {
  for (const script of root.querySelectorAll('script')) {
    const type = (script.getAttribute('type') || '').trim().toLowerCase();
    if (!DATA_BLOCK.test(type)) script.remove();
  }

  for (const element of root.querySelectorAll('*')) {
    for (const {
      name,
      value
    } of [...element.attributes]) {
      const lower = name.toLowerCase();
      if (lower.startsWith('on')) element.removeAttribute(name);else if (ADDRESS.has(lower) && value.replace(CONTROLS, '').toLowerCase().startsWith('javascript:')) element.removeAttribute(name);
    } // A nested <template>'s content is a document of its own.


    if (element.localName === 'template' && element.content) clean(element.content);
  }

  return root;
}
/**
 * The part a server answered, as markup the element can draw: parsed inert
 * (a <template>, or for a whole document its body), its executable scripts,
 * inline event handlers and javascript: addresses taken out. Not a sanitizer:
 * the part is the site's own markup (SF.sanitizeHtml is for untrusted HTML).
 */


function partFrom(text, doc = globalThis.document) {
  const source = String(text ?? '');

  if (/<(?:html|body)[\s>]/iu.test(source) && typeof globalThis.DOMParser === 'function') {
    const body = new globalThis.DOMParser().parseFromString(source, 'text/html').body;
    return clean(body).innerHTML;
  }

  const template = doc.createElement('template');
  template.innerHTML = source;
  clean(template.content);
  return template.innerHTML;
} // The placeholder's line count, clamped to the setting's range.

function lineCount(value) {
  const number = Math.trunc(Number(value));
  return Number.isFinite(number) ? Math.min(20, Math.max(1, number)) : 3;
}
const IncludeElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_3__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_4__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_5__
  },
  source: 'ru',
  actions: {
    refresh() {
      return this.fetchPart();
    }

  }
});

class SfInclude extends IncludeElement {
  constructor() {
    super(); // idle | loading | ready | error (vocabulary §3, without empty).

    this._phase = 'idle';
    this._part = '';
    this._run = 0;
    this._request = null;
    this._sight = null;
    this._sightTarget = null; // The first load has settled (arrived or failed): a printed picture is
    // kept until then (sfAwaitingData).

    this._settled = false;
    this._connected = false;
  }

  get address() {
    return String(this.src ?? '').trim();
  }

  onConnected() {
    super.onConnected?.();
    this._connected = true; // Taken out while loading, its request was aborted with its scope: it
    // loads again now that it is back.

    if (this._phase === 'loading' && !this._request) this._phase = 'idle';
    this.sfHostState('data-loading', this._phase === 'loading');
    this.sfHostState('data-failed', this._phase === 'error');
    this.arm();
  }

  onDisconnected() {
    super.onDisconnected?.();
    this.unwatch();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (!this._connected || oldValue === newValue) return;
    if (name === 'src') this.restart();else if (name === 'load' && this._phase === 'idle') {
      this.unwatch();
      this.arm();
    }
  } // A printed first paint stays until the first load settles, then the
  // element draws once: the server's picture never turns into the skeleton
  // and back (§5.4).


  sfAwaitingData() {
    return !this._settled && Boolean(this.address) && this.staticMarkup().length > 0;
  }

  afterRender(changedAttributes) {
    super.afterRender?.(changedAttributes); // load="view" watches the region, which exists once drawn (or printed).

    if (this._sight && !this._sightTarget?.isConnected) this.unwatch();
    this.arm();
  } // Starts the first load: now, or once the region nears the viewport.


  arm() {
    if (!this.isConnected || this._phase !== 'idle' || !this.address) return;
    const Sight = globalThis.IntersectionObserver;

    if (this.load !== 'view' || typeof Sight !== 'function') {
      void this.fetchPart();
      return;
    }

    if (this._sight) return;
    const target = this.querySelector(':scope > .sf-include');
    if (!target) return;
    this._sightTarget = target;
    this._sight = new Sight(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      this.unwatch();
      void this.fetchPart();
    }, {
      rootMargin: `${VIEW_MARGIN} 0px`
    });

    this._sight.observe(target);
  }

  unwatch() {
    this._sight?.disconnect();
    this._sight = null;
    this._sightTarget = null;
  } // A new src: the old part and any load in flight are dropped, and the new
  // one is loaded by the same rule as the first (load now or view).


  restart() {
    this._request?.abort();
    this._request = null;
    this._run += 1;
    this.unwatch();
    this._part = '';
    this.setPhase('idle');
    this.arm();
  }

  setPhase(phase) {
    this._phase = phase;
    this.sfHostState('data-loading', phase === 'loading');
    this.sfHostState('data-failed', phase === 'error');
    this.requestComponentUpdate('phase');
  } // Resolves once the element itself has drawn (not a part inside it: their
  // sf-after-render bubbles here too), or when the instance ends.


  drawn(signal) {
    return new Promise(resolve => {
      const done = event => {
        if (event?.type === 'sf-after-render' && event.target !== this) return;
        this.removeEventListener('sf-after-render', done);
        signal.removeEventListener('abort', done);
        resolve();
      };

      this.addEventListener('sf-after-render', done);
      signal.addEventListener('abort', done, {
        once: true
      });
    });
  } // The action refresh, and every load: one request at a time, the newest
  // wins; the instance's scope (§7.7) aborts it when the element is removed.


  async fetchPart() {
    const src = this.address;
    this.unwatch();
    if (!src) return {
      outcome: 'refused',
      reason: 'no-src'
    };
    this._request?.abort();
    const request = new AbortController();
    this._request = request;
    const run = ++this._run;
    const scope = this.sfScope;

    const end = () => request.abort();

    scope.addEventListener('abort', end, {
      once: true
    });
    this.setPhase('loading');
    let response = null;
    let text = '';
    let failure = null;

    try {
      response = await globalThis.fetch(src, {
        credentials: 'same-origin',
        headers: {
          Accept: 'text/html'
        },
        signal: request.signal
      });
      if (response.ok) text = await response.text();else failure = {
        reason: 'http',
        status: response.status
      };
    } catch (error) {
      if (request.signal.aborted || run !== this._run) failure = {
        reason: 'cancelled'
      };else failure = {
        reason: 'network',
        status: null,
        error
      };
    } finally {
      scope.removeEventListener('abort', end);
      if (this._request === request) this._request = null;
    }

    if (run !== this._run || request.signal.aborted) return {
      outcome: 'cancelled'
    };
    this._settled = true;

    if (failure) {
      this.setPhase('error');
      await this.drawn(scope);
      if (run !== this._run) return {
        outcome: 'cancelled'
      };
      this.sfEmit('load-failed', {
        src,
        status: failure.status ?? null,
        reason: failure.reason
      });
      return {
        outcome: 'refused',
        reason: failure.reason,
        status: failure.status ?? null
      };
    }

    this._part = partFrom(text, this.ownerDocument);
    this.setPhase('ready');
    await this.drawn(scope);
    if (run !== this._run) return {
      outcome: 'cancelled'
    };
    this.startParts();
    this.sfEmit('loaded', {
      src,
      status: response.status
    });
    return {
      outcome: 'applied',
      status: response.status
    };
  } // The Loader's MutationObserver scans the inserted markup (utilities,
  // class components, Smart tags) after its debounce; the Smart tags of the
  // part are asked for at once, so they draw without waiting it out.


  startParts() {
    const loader = globalThis.SF?.Loader;
    const rules = loader?.getCustomElementRules?.() ?? {};
    const root = this.querySelector(':scope > .sf-include');
    if (!root || typeof loader?.ensureSmartElementLoaded !== 'function') return;
    const tags = new Set();

    for (const element of root.querySelectorAll('*')) {
      const tag = element.localName;
      if (tag.includes('-') && rules[tag] && !globalThis.customElements?.get(tag)) tags.add(tag);
    }

    for (const tag of tags) loader.ensureSmartElementLoaded(tag);
  } // Retry: the region holds focus while the part loads again, so it never
  // falls to the page; a new failure hands it to the new Retry.


  async retry() {
    const root = this.querySelector(':scope > .sf-include');
    const focused = Boolean(root && root.contains(this.ownerDocument.activeElement));
    if (focused) root.focus({
      preventScroll: true
    });
    const outcome = await this.refresh();

    if (focused && outcome.outcome === 'refused') {
      this.querySelector(':scope > .sf-include .sf-include-retry button')?.focus({
        preventScroll: true
      });
    }

    return outcome;
  }

  templateContext() {
    return this.createTemplateContext({ ...this.getPropsContext(),
      component: this,
      phase: this._phase,
      part: this._part,
      lines: lineCount(this.lines),
      ownPlaceholder: this.getSlotContent('placeholder'),
      words: {
        failed: this.sfWord('failed'),
        retry: this.sfWord('retry')
      },
      rootClass: this.getRootClass()
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_2__.renderIncludeTemplate)(this.templateContext());
  }

}

SfInclude.define('sf-include');

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "70c2f395a2af"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderIncludeTemplate: () => (/* binding */ renderIncludeTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var lit_directives_unsafe_html_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("073f05ff1a81");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, lit_directives_unsafe_html_js__WEBPACK_IMPORTED_MODULE_1__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, lit_directives_unsafe_html_js__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lit_directives_unsafe_html_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lit_directives_unsafe_html_js__WEBPACK_IMPORTED_MODULE_1__);

 // sf-include's markup: one region, drawn in one of three states.
//
// - loading (and idle, before the first load): the placeholder -- the page's
//   slot placeholder, else an sf-skeleton of `lines` text lines, aria-hidden;
//   while loading the region is aria-busy.
// - ready: the part the server answered, cleaned of scripts by the element
//   (index.js partFrom) and drawn as markup; the Loader starts what is in it.
// - error: an icon, the message in a polite status and Retry, an outline
//   on-surface sf-button at rung 1 of the ladder that calls refresh().
//
// The region is the element's box (the host lays out as display: contents),
// so load="view" watches it, and tabindex -1 lets focus land on it after a
// retry instead of falling to the page.

function placeholder(context) {
  if (context.ownPlaceholder !== lit__WEBPACK_IMPORTED_MODULE_0__.nothing) return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-include-placeholder">${context.ownPlaceholder}</div>`;
  const widths = Array.from({
    length: context.lines
  }, (_, index) => index === context.lines - 1 && context.lines > 1 ? '60%' : '100%').join(',');
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-include-placeholder" aria-hidden="true">
    <sf-skeleton class="sf-include-skeleton" count=${String(context.lines)} width=${widths}></sf-skeleton>
  </div>`;
}

function failure(context) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-include-error">
    <i class="sf-icon sf-include-error-icon" aria-hidden="true">error</i>
    <span class="sf-include-message" role="status">${context.words.failed}</span>
    <sf-button class="sf-include-retry" size="1" appearance="outline" scheme="on-surface" icon-start="refresh"
      text=${context.words.retry} @click=${() => context.component.retry()}></sf-button>
  </div>`;
}

function renderIncludeTemplate(context) {
  const {
    phase,
    part,
    rootClass
  } = context;
  const classes = ['sf-include', `sf-include--${phase}`, rootClass].filter(Boolean).join(' '); // idle (no src yet, or load="view" not yet near the viewport) shows the
  // placeholder too, but nothing is on its way, so it is not busy.

  const busy = phase === 'loading'; // The host's own style (a public variable set on it) is the region's: the
  // host lays out as display: contents and keeps none (smart-base rootStyle).

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class=${classes} style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} aria-busy=${busy ? 'true' : 'false'} tabindex="-1">${phase === 'ready' ? (0,lit_directives_unsafe_html_js__WEBPACK_IMPORTED_MODULE_1__.unsafeHTML)(part) : phase === 'error' ? failure(context) : placeholder(context)}</div>`;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "8759b3d1f68e"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "5b7d7695b41b"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("element-manifest", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("element-manifest", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "073f05ff1a81"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit/directives/unsafe-html.js", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("lit/directives/unsafe-html.js", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "2a080a730149"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("lit", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "deb1a4d61565"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("smart-base", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("smart-base", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "a35a5057e1f9"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.include","tag":"sf-include","version":"1.0.4","kind":"leaf","settings":{"src":{"type":"string","default":""},"load":{"type":"enum","values":["now","view"],"default":"now"},"lines":{"type":"number","integer":true,"min":1,"max":20,"default":3}},"values":{},"events":{"loaded":{"carries":{"src":"string","status":"number"},"own-verb":true},"load-failed":{"carries":{"src":"string","status":{"type":"number","nullable":true},"reason":{"type":"enum","values":["network","http"]}},"own-verb":true}},"actions":{"refresh":{"waits":true}},"host-states":{"data-loading":"boolean","data-failed":"boolean"},"css-variables":{"--sf-include-min-block-size":{"type":"length","state":"default"},"--sf-include-gap":{"type":"length","state":"default"},"--sf-include-padding":{"type":"length","state":"default"},"--sf-include-border-color":{"type":"color","state":"default"},"--sf-include-radius":{"type":"length","state":"default"},"--sf-include-message-color":{"type":"color","state":"default"}}}');

/***/ },

/***/ "d97de4199bbc"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Include","runtime":{"failed":"Could not load this part of the page.","retry":"Retry"},"events":{"loaded":{"label":"Loaded"},"load-failed":{"label":"Could not load"}}}');

/***/ },

/***/ "c4bf739d2198"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Вставка с адреса","runtime":{"failed":"Не удалось загрузить эту часть страницы.","retry":"Повторить"},"events":{"loaded":{"label":"Загружено"},"load-failed":{"label":"Не удалось загрузить"}}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("533f85ff6db1");
/******/
/******/ })()
;