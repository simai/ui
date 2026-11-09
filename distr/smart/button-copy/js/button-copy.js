/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "e081a020262e"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   copyText: () => (/* binding */ copyText),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// Copying text, with the fallback (reuse audit 2026-11-02, finding 11). The
// clipboard class component and sf-copy-button each wrote this, and
// chat-message a third time; the order is theirs: the Clipboard API on a
// secure page, and execCommand('copy') over a hidden field where the API is
// absent or refused. A secure page whose clipboard permission is denied -- a
// policy, an embedded frame, a browser that asked and was answered no -- has
// the API and still refuses it; reading "present" as "allowed" left the
// fallback that exists for exactly this unreached (component/clipboard,
// 2026-10).

/**
 * Copies `text`. Settles with how it was copied, 'native' or 'legacy', or
 * rejects: Error('copy_unsupported') when the fallback copied nothing, or the
 * platform's own error (NotAllowedError, SecurityError) when it threw.
 * `document` is the document whose body holds the fallback field: the
 * element's own, for a component in another frame.
 */
async function copyText(text, {
  document: documentRef = globalThis.document
} = {}) {
  const value = String(text ?? '');
  const view = documentRef?.defaultView ?? globalThis;

  if (view.isSecureContext && view.navigator?.clipboard?.writeText) {
    try {
      await view.navigator.clipboard.writeText(value);
      return 'native';
    } catch {// Refused: the fallback is for exactly this.
    }
  }

  if (!documentRef?.body || typeof documentRef.execCommand !== 'function') throw new Error('copy_unsupported');
  const area = documentRef.createElement('textarea'); // The class is the clipboard component's (its sheet hides it); the inline
  // style keeps the field out of sight on a page without that sheet.

  area.className = 'sf-clipboard-fallback';
  area.value = value;
  area.setAttribute('readonly', '');
  area.setAttribute('aria-hidden', 'true');
  area.style.cssText = 'position:fixed;inset-inline-start:-9999px;inset-block-start:0;opacity:0';
  documentRef.body.append(area);
  area.select(); // iOS selects nothing on select() alone.

  area.setSelectionRange?.(0, value.length);
  let copied = false;

  try {
    copied = documentRef.execCommand('copy');
  } finally {
    area.remove();
  }

  if (!copied) throw new Error('copy_unsupported');
  return 'legacy';
} // Core publishes the helper; component bundles that carry their own copy reuse
// an already published one instead of replacing it. SF.Clipboard (capital C)
// is the clipboard component's script API; this is the bare function.

if (typeof globalThis !== 'undefined') {
  globalThis.SF = globalThis.SF || {};
  if (!globalThis.SF.copyText) globalThis.SF.copyText = copyText;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (copyText);

/***/ },

/***/ "604c3ec2da2d"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _core_js_clipboard_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("e081a020262e");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("4a6d31f10418");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("7eee0ce1da86");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("95fd5a964f9f");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("6cfb20b5910e");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("f4e4ea0915ae");
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("0276298b5863");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_3__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_3__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
// sf-button-copy: copies a value and says so (owner-approved assignment,
// 2026-10-14). The icon turns to a check for a moment and the result is
// announced politely; when the browser refuses the clipboard (an embedded
// frame, a policy), the source is selected instead and the person is told to
// press Ctrl+C, so the copy is never simply lost.
//
// From its component.json (standard simai.smart-component 1.3.8 §3, §4, §8):
// the settings are made by core/js/element-manifest.js; copy is the action
// and answers an outcome; the facts are sf-button-copy-copied and
// sf-button-copy-copy-failed (sf-copy-button-* until 2027-01-01), the old sf-copy and sf-copy-error their dated
// aliases (aliases.json); the words are the language files'.

 // The copy and its fallback are core's (core/js/clipboard.js, SF.copyText;
// reuse audit 2026-11-02, finding 11), shared with the clipboard class.









function isMac() {
  return /Mac|iPhone|iPad/u.test(globalThis.navigator?.platform ?? globalThis.navigator?.userAgent ?? '');
}

const CopyButtonElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_4__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_6__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_7__
  },
  source: 'ru',
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_5__,
  actions: {
    copy() {
      return this.runCopy();
    }

  }
});

class SfCopyButton extends CopyButtonElement {
  constructor() {
    super();
    this.state = {
      phase: 'idle',
      message: ''
    };
    this._timer = null;
    this._pending = false;
  } // An absent duration is two seconds: read as Number(null) it was zero, and
  // the result was gone before anyone could hear it. A negative one is too.


  get duration() {
    const raw = this.getAttribute('duration');
    const value = Number(raw);
    return raw !== null && raw !== '' && Number.isFinite(value) && value >= 0 ? value : 2000;
  }

  set duration(next) {
    super.duration = next;
  }

  words(key, vars) {
    return this.sfWord(key, vars ? {
      vars
    } : {});
  }

  sourceElement() {
    const id = this.target.trim();
    if (!/^#[A-Za-z][\w:.-]*$/u.test(id)) return null;
    return this.ownerDocument.getElementById(id.slice(1));
  } // What is copied: the value, or the target's -- an input's value, an
  // element's text, a numbered code block's code without its numbers.


  source() {
    const hasValue = this.hasAttribute('value');
    const hasTarget = Boolean(this.target.trim());
    if (hasValue && hasTarget) throw new Error('ambiguous_source');
    if (hasValue) return this.value;
    if (!hasTarget) throw new Error('empty_source');
    const element = this.sourceElement();
    if (!element) throw new Error('missing_target');
    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) return element.value;
    const rows = element.querySelectorAll(':scope .sf-code-lines > .sf-code-line > .sf-code-line__content');
    if (rows.length) return Array.from(rows, row => row.textContent === ' ' ? '' : row.textContent).join('\n');
    return element.textContent ?? '';
  } // Refused by the browser: the text is selected so the person can copy it.


  selectSource(text) {
    const element = this.sourceElement();

    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
      element.focus();
      element.select();
      return;
    }

    const selection = globalThis.getSelection?.();
    if (!selection) return;
    selection.removeAllRanges();

    if (element) {
      const range = this.ownerDocument.createRange();
      range.selectNodeContents(element);
      selection.addRange(range);
      return;
    } // A value with no element on the page: a hidden field holds it to select.


    let holder = this.querySelector('.sf-copy-button-holder');

    if (!holder) {
      holder = this.ownerDocument.createElement('span');
      holder.className = 'sf-copy-button-holder';
      this.append(holder);
    }

    holder.textContent = text;
    const range = this.ownerDocument.createRange();
    range.selectNodeContents(holder);
    selection.addRange(range);
  } // The action copy (component.json): the generated method calls this and
  // answers its outcome; the press of the template calls the method.


  async runCopy() {
    if (this._pending) return {
      outcome: 'refused',
      reason: 'busy'
    };
    this._pending = true;
    this.setPhase('pending', '');

    try {
      const text = this.source();
      if (!text) throw new Error('empty_source');
      const method = await (0,_core_js_clipboard_js__WEBPACK_IMPORTED_MODULE_2__.copyText)(text, {
        document: this.ownerDocument
      });
      this.setPhase('success', this.successText || this.words('copied'));
      this.sfEmit('copied', {
        text,
        method
      });
      return {
        outcome: 'applied',
        text,
        method
      };
    } catch (error) {
      const code = ['empty_source', 'missing_target', 'ambiguous_source'].includes(error?.message) ? error.message : 'denied';

      if (code === 'denied') {
        let text = '';

        try {
          text = this.source();
        } catch {
          /* nothing to select */
        }

        this.selectSource(text);
        const keys = isMac() ? '⌘C' : 'Ctrl+C';
        this.setPhase('error', this.words('selected', {
          keys
        }));
      } else {
        this.setPhase('error', this.errorText || this.words('failed'));
      }

      this.sfEmit('copy-failed', {
        code
      });
      return {
        outcome: 'refused',
        reason: code
      };
    } finally {
      this._pending = false;
    }
  }

  setPhase(phase, message) {
    clearTimeout(this._timer);
    this.state = {
      phase,
      message
    };
    this.requestComponentUpdate('phase');

    if (phase === 'success' || phase === 'error') {
      this._timer = setTimeout(() => {
        this.state = {
          phase: 'idle',
          message: ''
        };
        this.requestComponentUpdate('phase');
      }, this.duration);
    }
  }

  disconnectedCallback() {
    clearTimeout(this._timer);
    super.disconnectedCallback?.();
  }

  templateContext() {
    return this.createTemplateContext({ ...this.getPropsContext(),
      component: this,
      size: this.size,
      appearance: this.appearance,
      text: this.text,
      icon: this.icon,
      successIcon: this.successIcon,
      // The name says what is copied when the host says so.
      name: this.label || this.text || this.words('copy'),
      phase: this.state.phase,
      message: this.state.message,
      rootClass: this.getRootClass()
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_3__.renderCopyButtonTemplate)(this.templateContext());
  }

}

SfCopyButton.define('sf-button-copy');
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "4a6d31f10418"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderCopyButtonTemplate: () => (/* binding */ renderCopyButtonTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);

function renderCopyButtonTemplate(context) {
  const icon = {
    success: context.successIcon,
    error: 'error'
  }[context.phase] ?? context.icon; // The glyph is the quiet neutral (decision C15): on-surface-variant, which
  // darkens under the pointer. ghost is the look without a fill; link, its
  // former name, reaches here as ghost (the alias shim rewrites it).

  const common = {
    size: context.size,
    appearance: context.appearance === 'link' ? 'ghost' : context.appearance,
    scheme: 'on-surface-variant'
  }; // The root style is the control's: the wrapper only frames the control and
  // its status, so a host styling the button reaches it.

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <span class=${['sf-copy-button', `sf-copy-button--${context.phase}`, context.rootClass].filter(Boolean).join(' ')}>
      ${context.text ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button size=${common.size} appearance=${common.appearance} scheme=${common.scheme}
                 icon-start=${icon} text=${context.text} aria-label=${context.name}
                 root-style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                 aria-disabled=${context.phase === 'pending' ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                 @click=${() => context.component.copy()}></sf-button>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button-icon size=${common.size} appearance=${common.appearance} scheme=${common.scheme}
                 icon=${icon} aria-label=${context.name} title=${context.name}
                 root-style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                 aria-disabled=${context.phase === 'pending' ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                 @click=${() => context.component.copy()}></sf-button-icon>`}
      <span class="sf-copy-button-status" role="status" aria-live="polite" aria-atomic="true">${context.message}</span>
    </span>
  `;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "0276298b5863"
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

/***/ "95fd5a964f9f"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-button-copy for the shim (stands/18-aliases-ci/alias.mjs, standard §16 item 20). mode: same-detail (the shim sends the new and the old name), split / detail-adds (a detail adapter, refused by the shim), attribute-and-property, method, property, manifest-only (the DOM name does not change), host-attribute (no shim), retired.","component":"sf-button-copy","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"sf-copy","to":"sf-copy-button-copied","kind":"event","component":"sf-button-copy","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","cancelable":false,"manifest":{"from":"sf-copy","to":"sf-copy-button-copied"},"section":"§8, vocabulary 1.1.5 §5.1"},{"from":"sf-copy-error","to":"sf-copy-button-copy-failed","kind":"event","component":"sf-button-copy","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","cancelable":false,"manifest":{"from":"sf-copy-error","to":"sf-copy-button-copy-failed"},"section":"§8, vocabulary 1.1.5 §5.1"},{"from":"sf-copy-button","to":"sf-button-copy","kind":"tag","component":"sf-button-copy","since":"2026-11-03","remove_after":"2027-01-01","section":"rename plan R0 (ui-control RENAME-PLAN-2026-11-03), naming decision 2026-11-02","note":"the element is sf-button-copy; sf-copy-button is a subclass defined beside it until the date"},{"from":"sf-copy-button-copied","to":"sf-button-copy-copied","kind":"event","component":"sf-button-copy","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-copy-button-copy-failed","to":"sf-button-copy-copy-failed","kind":"event","component":"sf-button-copy","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"link","to":"ghost","kind":"value","setting":"appearance","component":"sf-button-copy","since":"2026-11-09","remove_after":"2027-01-01","section":"§16 item 20","note":"journal value-button-copy-link-to-ghost (decision C15): ghost is the name, link its former one; they drew the same"}]}');

/***/ },

/***/ "7eee0ce1da86"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.button-copy","tag":"sf-button-copy","version":"1.3.0","kind":"leaf","settings":{"value":{"type":"string","default":""},"target":{"type":"string","default":""},"text":{"type":"string","default":""},"label":{"type":"string","default":""},"size":{"type":"enum","values":["1/3","1/2","1","2"],"default":"1","x-scale":"control"},"appearance":{"type":"enum","values":["ghost","outline","tonal"],"default":"ghost"},"icon":{"type":"icon","default":"content_copy"},"success-icon":{"type":"icon","default":"check"},"success-text":{"type":"string","default":""},"error-text":{"type":"string","default":""},"duration":{"type":"number","integer":true,"min":0,"default":2000}},"values":{},"events":{"copied":{"carries":{"text":"string","method":{"type":"enum","values":["native","legacy"]}},"own-verb":true},"copy-failed":{"carries":{"code":{"type":"enum","values":["empty_source","missing_target","ambiguous_source","denied"]}},"own-verb":true}},"actions":{"copy":{"waits":true}},"css-variables":{"--sf-copy-button-display":{"type":"keyword","state":"default"},"--sf-copy-button-vertical-align":{"type":"keyword","state":"default"},"--sf-copy-button-pending-opacity":{"type":"number","state":"pending"},"--sf-copy-button-success-color":{"type":"color","state":"success"},"--sf-copy-button-error-color":{"type":"color","state":"error"}}}');

/***/ },

/***/ "6cfb20b5910e"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Copy button","runtime":{"copied":"Copied","copy":"Copy","failed":"Could not copy","selected":"Selected — press {keys}"},"events":{"copied":{"label":"Copied"},"copy-failed":{"label":"Could not copy"}}}');

/***/ },

/***/ "f4e4ea0915ae"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Кнопка копирования","runtime":{"copied":"Скопировано","copy":"Копировать","failed":"Не удалось скопировать","selected":"Выделено — нажмите {keys}"},"events":{"copied":{"label":"Скопировано"},"copy-failed":{"label":"Не удалось скопировать"}}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("604c3ec2da2d");
/******/
/******/ })()
;