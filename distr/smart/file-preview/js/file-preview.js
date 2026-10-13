/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "781dfa6013bf"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("fbe0570fcc69");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("d4eb2cc82833");
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("0d662e4d7d63");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _js_templates_default__WEBPACK_IMPORTED_MODULE_1__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_2__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _js_templates_default__WEBPACK_IMPORTED_MODULE_1__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_core_js_page_language__WEBPACK_IMPORTED_MODULE_2__);


 // Every word this component says, in the languages it ships with. A product
// adds any other through SF.language.register("sf-file-preview", code, words).

const FILE_PREVIEW_TEXT = {
  en: {
    ariaLabel: 'File',
    downloadLabel: 'Download file',
    removeLabel: 'Remove file'
  },
  ru: {
    ariaLabel: 'Файл',
    downloadLabel: 'Скачать файл',
    removeLabel: 'Удалить файл'
  }
};
const IMAGE_EXTENSION = /\.(?:avif|bmp|gif|jpe?g|png|svg|webp)(?:[?#].*)?$/i;

class SfFilePreview extends (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()) {
  static get props() {
    return {
      templateName: {
        attribute: 'template',
        default: 'default'
      },
      name: {
        default: 'File'
      },
      fileName: {
        attribute: 'file-name',
        default: 'File'
      },
      size: {
        default: ''
      },
      fileSize: {
        attribute: 'file-size',
        default: ''
      },
      icon: {
        default: 'description'
      },
      href: {
        default: ''
      },
      // The axis is called kind, because that is the question it answers.
      // `type` keeps working: see contracts/public-api-axes.json.
      kind: {
        default: 'auto',
        values: ['auto', 'icon', 'image'],
        aliases: ['type'],
        valueAliases: {
          auto: ['default']
        }
      },
      mimeType: {
        attribute: 'mime-type',
        default: ''
      },
      imageUrl: {
        attribute: 'image-url',
        default: ''
      },
      avatarSize: {
        attribute: 'avatar-size',
        default: ''
      },
      open: {
        type: Boolean,
        default: false
      },
      surface: {
        type: Boolean,
        default: false
      },
      download: {
        type: Boolean,
        default: true
      },
      target: {
        default: '_blank'
      },
      actions: {
        type: Boolean,
        default: true
      },
      downloadAction: {
        attribute: 'download-action',
        type: Boolean,
        default: true
      },
      removeAction: {
        attribute: 'remove-action',
        type: Boolean,
        default: true
      },
      disabled: {
        type: Boolean,
        default: false
      },
      compact: {
        type: Boolean,
        default: false
      },
      ariaLabel: {
        attribute: 'aria-label',
        default: ''
      },
      downloadLabel: {
        attribute: 'download-label',
        default: ''
      },
      removeLabel: {
        attribute: 'remove-label',
        default: ''
      }
    };
  }

  get componentName() {
    return 'file-preview';
  }

  shouldClearLightDomBeforeFirstRender() {
    return super.shouldClearLightDomBeforeFirstRender() || !!this.querySelector(':scope > .sf-file-preview[data-render-managed="1"]');
  }

  get templateName() {
    return this.getAttribute('template') || 'default';
  }

  get name() {
    return this.getAttribute('name') || this.getAttribute('file-name') || 'File';
  }

  get fileName() {
    return this.getAttribute('file-name') || this.getAttribute('name') || 'File';
  }

  get size() {
    return this.getAttribute('size') || this.fileSize;
  }

  get fileSize() {
    return this.getAttribute('file-size') || this.getAttribute('size') || '';
  }

  get icon() {
    return this.getAttribute('icon') || 'description';
  }

  get href() {
    return this.getAttribute('href') || '';
  }

  get kind() {
    return this.getProp('kind');
  } // The legacy name, kept so a consumer reading el.type still gets an answer.


  get type() {
    return this.kind;
  }

  get mimeType() {
    return this.getAttribute('mime-type') || '';
  }

  get imageUrl() {
    return this.getAttribute('image-url') || '';
  }

  get avatarSize() {
    return this.getAttribute('avatar-size') || '';
  }

  get open() {
    return this.getBooleanAttr('open', false);
  }

  get surface() {
    return this.getBooleanAttr('surface', false);
  }

  get download() {
    return this.getBooleanAttr('download', true);
  }

  get target() {
    return this.getAttribute('target') || '_blank';
  }

  get actions() {
    return this.getBooleanAttr('actions', true);
  }

  get downloadAction() {
    return this.getBooleanAttr('download-action', true);
  }

  get removeAction() {
    return this.getBooleanAttr('remove-action', true);
  }

  get disabled() {
    return this.getBooleanAttr('disabled', false);
  }

  get ariaLabel() {
    return this.getAttribute('aria-label') || this.fileName;
  }

  get downloadLabel() {
    return this.getAttribute('download-label') || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_2__.pageText)(FILE_PREVIEW_TEXT, "downloadLabel", this);
  }

  get removeLabel() {
    return this.getAttribute('remove-label') || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_2__.pageText)(FILE_PREVIEW_TEXT, "removeLabel", this);
  } // Only the leading visual, on a row's line: a list of files shows each as a
  // thumbnail or as its extension, and the record shows the rest.


  get compact() {
    return this.getBooleanAttr('compact', false);
  }

  get extension() {
    const match = /\.([a-z0-9]{1,5})$/iu.exec(String(this.fileName || '').trim());
    return match ? match[1].toUpperCase() : '';
  }

  get isImage() {
    if (this.type === 'image') return true;
    if (this.type === 'icon') return false;
    return this.mimeType.toLowerCase().startsWith('image/') || IMAGE_EXTENSION.test(this.imageUrl || this.href || this.fileName);
  }

  templateContext() {
    const props = this.getPropsContext();
    return this.createTemplateContext({ ...props,
      ariaLabel: this.getAttribute("aria-label") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_2__.pageText)(FILE_PREVIEW_TEXT, "ariaLabel", this),
      downloadLabel: this.getAttribute("download-label") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_2__.pageText)(FILE_PREVIEW_TEXT, "downloadLabel", this),
      removeLabel: this.getAttribute("remove-label") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_2__.pageText)(FILE_PREVIEW_TEXT, "removeLabel", this),
      component: this,
      fileName: this.fileName,
      fileSize: this.fileSize,
      icon: this.icon,
      href: this.href,
      type: this.type,
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
      ariaLabel: this.ariaLabel,
      downloadLabel: this.downloadLabel,
      removeLabel: this.removeLabel,
      onDownload: event => this.handleDownload(event),
      onRemove: event => this.handleRemove(event)
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_1__.renderFilePreviewTemplate)(this.templateContext());
  }

  get data() {
    return this.getValue();
  }

  getValue() {
    return {
      fileName: this.fileName,
      fileSize: this.fileSize,
      icon: this.icon,
      href: this.href,
      type: this.type,
      mimeType: this.mimeType,
      imageUrl: this.imageUrl,
      target: this.target
    };
  }

  setOpen(value) {
    this.toggleAttribute('open', Boolean(value));
    return this;
  }

  toggleOpen() {
    return this.setOpen(!this.open);
  }

  onDownload(handler, options) {
    if (typeof handler === 'function') {
      this.addEventListener('sf-file-preview:download', handler, options);
    }

    return this;
  }

  onRemove(handler, options) {
    if (typeof handler === 'function') {
      this.addEventListener('sf-file-preview:remove', handler, options);
    }

    return this;
  }

  handleDownload(event) {
    event?.preventDefault?.();
    if (this.disabled || !this.dispatchFilePreviewEvent('download') || !this.href) return;
    const anchor = document.createElement('a');
    anchor.href = this.href;

    if (this.download) {
      anchor.download = this.fileName;
    } else {
      anchor.target = this.target;
      anchor.rel = 'noopener noreferrer';
    }

    anchor.click();
  }

  handleRemove(event) {
    event?.preventDefault?.();
    if (!this.disabled) this.dispatchFilePreviewEvent('remove');
  }

  dispatchFilePreviewEvent(action) {
    return this.dispatchEvent(new CustomEvent(`sf-file-preview:${action}`, {
      bubbles: true,
      cancelable: true,
      composed: true,
      detail: {
        action,
        value: this.getValue()
      }
    }));
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
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ddf1cdb42ecc");
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

/***/ "ddf1cdb42ecc"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit") : new Promise((resolve) => globalThis.addEventListener("sf-runtime-ready", () => resolve(globalThis.SF.runtimeModule("lit")), { once: true })));

/***/ },

/***/ "0d662e4d7d63"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("page-language") : new Promise((resolve) => globalThis.addEventListener("sf-runtime-ready", () => resolve(globalThis.SF.runtimeModule("page-language")), { once: true })));

/***/ },

/***/ "fbe0570fcc69"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("smart-base") : new Promise((resolve) => globalThis.addEventListener("sf-runtime-ready", () => resolve(globalThis.SF.runtimeModule("smart-base")), { once: true })));

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