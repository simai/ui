/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "781dfa6013bf"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _core_js_deprecations__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("d3818183b14c");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("d4eb2cc82833");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("f3f4ec5c87ca");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("49343ffee6b1");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("ba7a8d52b29c");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("66b9acf74a27");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_deprecations__WEBPACK_IMPORTED_MODULE_2__, _js_templates_default__WEBPACK_IMPORTED_MODULE_3__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_deprecations__WEBPACK_IMPORTED_MODULE_2__, _js_templates_default__WEBPACK_IMPORTED_MODULE_3__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_deprecations__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_core_js_deprecations__WEBPACK_IMPORTED_MODULE_2__);







 // sf-file-preview from its component.json (standard simai.smart-component
// 1.3.8 §3, §4, §8; vocabulary 1.1.5 §5 download and detach): its settings
// are attributes and properties made by core/js/element-manifest.js, its words
// are lang/<locale>.json (a product adds a language through
// SF.language.register("sf-file-preview", code, words)), and the old names --
// name, size, type, sf-file-preview:download, sf-file-preview:remove, open,
// setOpen(), toggleOpen() -- are dated rows of aliases.json.

const FilePreviewElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_4__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_6__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_7__
  },
  source: 'ru',
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_5__
});
const IMAGE_EXTENSION = /\.(?:avif|bmp|gif|jpe?g|png|svg|webp)(?:[?#].*)?$/i; // What retires without a new name (aliases.json rows with `to: null`): kept
// until the date, and each call is noted with it.

function noteRetired(from) {
  (0,_core_js_deprecations__WEBPACK_IMPORTED_MODULE_2__.noteDeprecated)({
    component: 'sf-file-preview',
    tag: 'sf-file-preview',
    kind: 'action',
    from,
    to: null,
    since: _aliases_json__WEBPACK_IMPORTED_MODULE_5__.since,
    remove_after: _aliases_json__WEBPACK_IMPORTED_MODULE_5__.remove_after
  });
}

class SfFilePreview extends FilePreviewElement {
  static get props() {
    return { ...super.props,
      // The axis is called kind, because that is the question it answers.
      // `type` keeps working: see contracts/public-api-axes.json.
      kind: {
        default: 'auto',
        values: ['auto', 'icon', 'image'],
        aliases: ['type'],
        valueAliases: {
          auto: ['default']
        }
      }
    };
  }

  get componentName() {
    return 'file-preview';
  }

  shouldClearLightDomBeforeFirstRender() {
    return super.shouldClearLightDomBeforeFirstRender() || !!this.querySelector(':scope > .sf-file-preview[data-render-managed="1"]');
  }

  get kind() {
    return this.getProp('kind');
  }

  set kind(value) {
    if (value === null || value === undefined || value === '') this.removeAttribute('kind');else this.setAttribute('kind', String(value));
  } // The group's name (§3.1, §4.8): the host's aria-label, else the file name.


  get accessibleName() {
    return this.getAttribute('aria-label') || this.fileName || this.sfWord('aria-label');
  }

  get extension() {
    const match = /\.([a-z0-9]{1,5})$/iu.exec(String(this.fileName || '').trim());
    return match ? match[1].toUpperCase() : '';
  }

  get isImage() {
    if (this.kind === 'image') return true;
    if (this.kind === 'icon') return false;
    return this.mimeType.toLowerCase().startsWith('image/') || IMAGE_EXTENSION.test(this.imageUrl || this.href || this.fileName);
  }

  templateContext() {
    const props = this.getPropsContext();
    return this.createTemplateContext({ ...props,
      component: this,
      fileName: this.fileName,
      fileSize: this.fileSize,
      icon: this.icon,
      href: this.href,
      type: this.kind,
      mimeType: this.mimeType,
      imageUrl: this.imageUrl,
      isImage: this.isImage,
      compact: this.compact,
      extension: this.extension,
      surface: this.surface,
      download: this.download,
      target: this.target,
      actions: this.actions,
      downloadAction: this.downloadAction,
      removeAction: this.removeAction,
      disabled: this.disabled,
      ariaLabel: this.accessibleName,
      downloadLabel: this.downloadLabel,
      removeLabel: this.removeLabel,
      onDownload: event => this.handleDownload(event),
      onRemove: event => this.handleRemove(event)
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_3__.renderFilePreviewTemplate)(this.templateContext());
  } // The file as data (§8): what download and detach carry in `value`.


  get data() {
    return this.getValue();
  }

  getValue() {
    return {
      fileName: this.fileName,
      fileSize: this.fileSize,
      icon: this.icon,
      href: this.href,
      type: this.kind,
      mimeType: this.mimeType,
      imageUrl: this.imageUrl,
      target: this.target
    };
  } // The file's id in a detail (vocabulary §5 {id}): the host's id, else its
  // address, else its name.


  get fileId() {
    return this.id || this.href || this.fileName;
  } // §4.4 and compatibility.deprecations: open did nothing since 1.0.0.


  setOpen(value) {
    noteRetired('setOpen');
    this.toggleAttribute('open', Boolean(value));
    return this;
  }

  toggleOpen() {
    noteRetired('toggleOpen');
    this.toggleAttribute('open', !this.hasAttribute('open'));
    return this;
  }

  onDownload(handler, options) {
    if (typeof handler === 'function') {
      this.addEventListener('sf-file-preview-download', handler, options);
    }

    return this;
  }

  onRemove(handler, options) {
    if (typeof handler === 'function') {
      this.addEventListener('sf-file-preview-detach', handler, options);
    }

    return this;
  } // download {id}: a request a page may refuse; unrefused, the browser opens
  // or downloads the file.


  handleDownload(event) {
    event?.preventDefault?.();
    if (this.disabled || !this.request('download', 'download') || !this.href) return;
    const anchor = document.createElement('a');
    anchor.href = this.href;

    if (this.download) {
      anchor.download = this.fileName;
    } else {
      anchor.target = this.target;
      anchor.rel = 'noopener noreferrer';
    }

    anchor.click();
  } // detach {id}: the host removes the file; the preview only asks.


  handleRemove(event) {
    event?.preventDefault?.();
    if (!this.disabled) this.request('detach', 'remove');
  } // The detail is data only (§8): the id, and for the old names' listeners
  // the action and the file (detail-adds rows of aliases.json).


  request(verb, action) {
    return this.sfEmit(verb, {
      id: String(this.fileId ?? ''),
      action,
      value: this.getValue()
    }, {
      cancelable: true
    });
  }

}

SfFilePreview.define('sf-file-preview');
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "d4eb2cc82833"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderFilePreviewTemplate: () => (/* binding */ renderFilePreviewTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);


function renderAction({
  icon,
  label,
  disabled,
  action,
  onClick
}) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <button
      type="button"
      class="sf-icon-button sf-icon-button--icon sf-icon-button--link sf-icon-button--on-surface sf-icon-button--size-1/2"
      data-action=${action}
      ?disabled=${disabled}
      aria-label=${label}
      @click=${onClick}
    >
      <i class="sf-icon" aria-hidden="true">${icon}</i>
    </button>
  `;
} // Only the leading visual, named by the file: the image, or the extension in a
// tile (the type's icon when the name has none). A link when the file has an
// address, so a list row opens it the way the record does.


function renderCompact(context) {
  const visual = context.isImage ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<img class="sf-file-preview-thumbnail" src=${context.imageUrl || context.href} alt=${context.fileName}>` : context.extension ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-file-preview-extension" aria-hidden="true">${context.extension}</span>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class="sf-icon" aria-hidden="true">${context.icon}</i>`;
  const classes = ['sf-file-preview', 'sf-file-preview--compact', context.rootClass].filter(Boolean).join(' ');
  const name = context.isImage ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : context.fileName;
  return context.href ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<a class=${classes} href=${context.href} target=${context.target || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} title=${context.fileName}
              aria-label=${name} data-render-managed="1"><span class="sf-file-preview-holder">${visual}</span></a>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class=${classes} title=${context.fileName} role=${context.isImage ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : 'img'}
              aria-label=${name} data-render-managed="1"><span class="sf-file-preview-holder">${visual}</span></span>`;
}

function renderFilePreviewTemplate(context) {
  if (context.compact) return renderCompact(context);
  const rootClasses = ['sf-file-preview', context.surface ? 'sf-file-preview--surface' : '', context.disabled ? 'disabled' : '', context.rootClass].filter(Boolean);
  const hasActions = context.actions && (context.downloadAction || context.removeAction);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div
      class=${rootClasses.join(' ')}
      style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      data-render-managed="1"
      role=${hasActions ? 'group' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      aria-label=${hasActions ? context.ariaLabel : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      aria-disabled=${context.disabled ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    >
      <span class="sf-file-preview-holder">
        ${context.isImage ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<img class="sf-file-preview-thumbnail" src=${context.imageUrl || context.href} alt="">` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class="sf-icon" aria-hidden="true">${context.icon}</i>`}
      </span>
      <span class="sf-file-preview-main">
        <span class="sf-file-preview-name">${context.fileName}</span>
        ${context.fileSize ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-file-preview-size">${context.fileSize}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      </span>
      ${hasActions ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
          <span class="sf-file-preview-actions">
            ${context.downloadAction ? renderAction({
    icon: 'download',
    label: context.downloadLabel,
    disabled: context.disabled,
    action: 'download',
    onClick: context.onDownload
  }) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ${context.removeAction ? renderAction({
    icon: 'delete',
    label: context.removeLabel,
    disabled: context.disabled,
    action: 'remove',
    onClick: context.onRemove
  }) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          </span>
        ` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    </div>
  `;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "d3818183b14c"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("deprecations", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("deprecations", 1).then(resolve, reject), { once: true })));

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

/***/ "49343ffee6b1"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-file-preview for the shim (core/js/aliases.js, standard §16 item 20). mode: same-detail (the shim sends the new and the old name), detail-adds (the new detail holds the old fields), attribute-and-property, host-attribute (no shim), manifest-only (the DOM name does not change), retired (no new name; kept and noted by the component until the date).","component":"sf-file-preview","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"name","to":"file-name","kind":"setting","component":"sf-file-preview","since":"2026-10-27","remove_after":"2026-12-01","section":"compatibility.aliases"},{"from":"size","to":"file-size","kind":"setting","component":"sf-file-preview","since":"2026-10-27","remove_after":"2026-12-01","section":"compatibility.aliases"},{"from":"type","to":"kind","kind":"setting","component":"sf-file-preview","since":"2026-10-27","remove_after":"2026-12-01","section":"the axis\'s old name (contracts/public-api-axes.json); its value default reads auto"},{"from":"aria-label","to":null,"kind":"attribute","component":"sf-file-preview","since":"2026-10-27","remove_after":"2026-12-01","mode":"host-attribute","section":"§3.1, §4.8","note":"stays a host attribute, read by the element for the group\'s name; no shim"},{"from":"sf-file-preview:download","to":"sf-file-preview-download","kind":"event","component":"sf-file-preview","since":"2026-10-27","remove_after":"2026-12-01","mode":"detail-adds","section":"vocabulary 1.1.5 §5 download","note":"the new detail {id, action, value} holds the old fields"},{"from":"sf-file-preview:remove","to":"sf-file-preview-detach","kind":"event","component":"sf-file-preview","since":"2026-10-27","remove_after":"2026-12-01","mode":"detail-adds","section":"vocabulary 1.1.5 §5 detach, §5.1","note":"the new detail {id, action, value} holds the old fields; bx-simai.property listens to the old name (vocabulary §9.2)"},{"from":"avatar-size","to":null,"kind":"attribute","component":"sf-file-preview","since":"2026-10-27","remove_after":"2026-12-01","mode":"retired","section":"compatibility.aliases","note":"read by nothing since 1.0.0"},{"from":"open","to":null,"kind":"attribute","component":"sf-file-preview","since":"2026-10-27","remove_after":"2026-12-01","mode":"retired","section":"compatibility.deprecations","note":"the actions are no longer hidden in a floating layer; the attribute does nothing"},{"from":"setOpen","to":null,"kind":"action","component":"sf-file-preview","since":"2026-10-27","remove_after":"2026-12-01","mode":"retired","section":"compatibility.deprecations, §4.4","note":"kept until the date and noted on each call; it writes the attribute open, which does nothing"},{"from":"toggleOpen","to":null,"kind":"action","component":"sf-file-preview","since":"2026-10-27","remove_after":"2026-12-01","mode":"retired","section":"compatibility.deprecations, §4.4","note":"kept until the date and noted on each call"}]}');

/***/ },

/***/ "f3f4ec5c87ca"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.file-preview","tag":"sf-file-preview","version":"1.1.4","kind":"leaf","settings":{"file-name":{"type":"string","default":"File"},"file-size":{"type":"string","default":""},"icon":{"type":"icon","default":"description"},"href":{"type":"string","default":""},"kind":{"type":"enum","values":["auto","icon","image"],"default":"auto"},"mime-type":{"type":"string","default":""},"image-url":{"type":"string","default":""},"surface":{"type":"boolean","default":false},"download":{"type":"boolean","default":true},"target":{"type":"string","default":"_blank"},"actions":{"type":"boolean","default":true},"download-action":{"type":"boolean","default":true},"remove-action":{"type":"boolean","default":true},"disabled":{"type":"boolean","default":false},"download-label":{"type":"string","default-from":"runtime.download-label"},"remove-label":{"type":"string","default-from":"runtime.remove-label"},"compact":{"type":"boolean","default":false}},"values":{},"events":{"download":{"carries":{"id":"string","action":"string","value":"object"},"cancelable":true},"detach":{"carries":{"id":"string","action":"string","value":"object"},"cancelable":true}},"actions":{},"css-variables":{"--sf-file-preview-background-color":{"type":"color","state":"default"},"--sf-file-preview-padding":{"type":"length","state":"default"},"--sf-file-preview-radius":{"type":"length","state":"default"},"--sf-file-preview-gap":{"type":"length","state":"default"},"--sf-file-preview-holder-size":{"type":"length","state":"default"},"--sf-file-preview-holder-background-color":{"type":"color","state":"default"},"--sf-file-preview-holder-color":{"type":"color","state":"default"}}}');

/***/ },

/***/ "ba7a8d52b29c"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"File Preview","runtime":{"aria-label":"File","download-label":"Download file","remove-label":"Remove file"}}');

/***/ },

/***/ "66b9acf74a27"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Предпросмотр файла","runtime":{"aria-label":"Файл","download-label":"Скачать файл","remove-label":"Удалить файл"}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("781dfa6013bf");
/******/
/******/ })()
;