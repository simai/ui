/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "92b137c03f44"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bindDownloadFile: () => (/* binding */ bindDownloadFile),
/* harmony export */   initExistingDownloadFiles: () => (/* binding */ initExistingDownloadFiles),
/* harmony export */   unbindDownloadFile: () => (/* binding */ unbindDownloadFile)
/* harmony export */ });
/* harmony import */ var _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d7f974466839");
/* harmony import */ var _register_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("58661bec99a6");
/* harmony import */ var _json_download_file_utility_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("8ea1dd3302c4");



const DOWNLOAD_FILE_SELECTOR = '.sf-download-file';
const DOWNLOAD_FILE_BOUND_FLAG = 'sfDownloadFileBound';

function toBoolean(value, fallback = false) {
  if (value === undefined || value === null || value === '') return fallback;
  if (typeof value === 'boolean') return value;
  return ['1', 'true', 'yes', 'on', 'disabled', 'download'].includes(String(value).toLowerCase());
}

function normalizeSize(value) {
  const normalized = String(value || '').toLowerCase();
  const supported = ['1/3', '1/2', '1', '2', '3'];
  return supported.includes(normalized) ? normalized : '1';
}

function buildAnchorDownload(href, filename = '') {
  if (!href) return;
  const anchor = document.createElement('a');
  anchor.href = href;

  if (filename) {
    anchor.download = filename;
  }

  anchor.target = '_blank';
  anchor.rel = 'noopener noreferrer';
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
}

function formatFileSize(bytes) {
  const size = Number(bytes);
  if (!Number.isFinite(size) || size < 0) return '';
  if (size < 1024) return `${size} B`;
  const units = ['KB', 'MB', 'GB', 'TB'];
  let value = size / 1024;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  const formatted = value >= 10 ? value.toFixed(0) : value.toFixed(1);
  return `${formatted}${units[unitIndex]}`;
}

async function resolveRemoteFileSize(href) {
  if (!href) return '';

  try {
    const response = await fetch(href, {
      method: 'HEAD',
      credentials: 'same-origin'
    });

    if (!response.ok) {
      return '';
    }

    const contentLength = response.headers.get('content-length');

    if (!contentLength) {
      return '';
    }

    return formatFileSize(contentLength);
  } catch {
    return '';
  }
}

function getRootLink(root) {
  if (!root || !(root instanceof HTMLElement)) return null;
  return root.tagName.toLowerCase() === 'a' ? root : root.querySelector('a.sf-download-file');
}

function getSizeNode(root) {
  return root?.querySelector?.('.sf-download-file-file-size') || null;
}

function getRootHref(root) {
  const href = root?.getAttribute?.('href');
  if (href) return href;
  const link = getRootLink(root);
  return link?.getAttribute?.('href') || '';
}

function isDisabledRoot(root) {
  if (!root) return false;
  return root.classList.contains('disabled') || root.hasAttribute('disabled') || root.getAttribute('aria-disabled') === 'true';
}

async function resolveAndApplyFileSize(root) {
  if (!root || isDisabledRoot(root)) return;
  const sizeNode = getSizeNode(root);
  if (!sizeNode) return;
  if (String(sizeNode.textContent || '').trim()) return;
  const href = getRootHref(root);
  if (!href) return;
  const resolvedSize = await resolveRemoteFileSize(href);
  if (!resolvedSize || !sizeNode.isConnected) return;
  sizeNode.textContent = resolvedSize;
}

function emitDownloadFileClick(root, href, fileName, download) {
  root?.dispatchEvent(new CustomEvent('sf-download-file:click', {
    bubbles: true,
    detail: {
      href,
      fileName,
      download
    }
  }));
}

function bindDownloadFile(root) {
  if (!root || root.dataset[DOWNLOAD_FILE_BOUND_FLAG] === '1') return;
  const href = getRootHref(root);
  const fileName = root.getAttribute('download') || root.dataset.fileName || root.querySelector('.sf-download-file-file-name')?.textContent?.trim() || '';
  const download = root.hasAttribute('download') || root.dataset.download === 'true';

  const handleClick = event => {
    if (isDisabledRoot(root)) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    emitDownloadFileClick(root, href, fileName, download);

    if (root.tagName.toLowerCase() === 'a') {
      return;
    }

    if (!href) {
      return;
    }

    event.preventDefault();
    buildAnchorDownload(href, download ? fileName : '');
  };

  root.addEventListener('click', handleClick);
  root.__sfDownloadFileClick = handleClick;
  root.dataset[DOWNLOAD_FILE_BOUND_FLAG] = '1';
  console;
  resolveAndApplyFileSize(root);
}

function unbindDownloadFile(root) {
  if (!root || root.dataset[DOWNLOAD_FILE_BOUND_FLAG] !== '1') return;

  if (root.__sfDownloadFileClick) {
    root.removeEventListener('click', root.__sfDownloadFileClick);
  }

  delete root.__sfDownloadFileClick;
  delete root.dataset[DOWNLOAD_FILE_BOUND_FLAG];
}

function initExistingDownloadFiles(target = document) {
  target.querySelectorAll(DOWNLOAD_FILE_SELECTOR).forEach(bindDownloadFile);
}

class DownloadFile extends _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__.ComponentObserver {
  static componentName = 'DownloadFile';
  static utilityMap = _json_download_file_utility_json__WEBPACK_IMPORTED_MODULE_2__;
  html = null;

  constructor(props) {
    super(props);
    const {
      size = '1',
      fileName = 'File.pdf',
      fileSize = '36MB',
      icon = 'download',
      href = '',
      download = false,
      disabled = false,
      target = '_blank'
    } = this.params || {};
    const className = this.attrs.class || this.attrs.className;
    const isDisabled = toBoolean(disabled, false);
    const canLink = Boolean(href) && !isDisabled;
    const root = document.createElement(canLink ? 'a' : 'button');

    if (this.id) {
      root.id = this.id;
    }

    if (canLink) {
      root.href = String(href);
      root.target = String(target || '_blank');
      root.rel = 'noopener noreferrer';

      if (toBoolean(download, false)) {
        root.download = String(fileName || '');
      }
    } else {
      root.type = 'button';
    }

    root.classList.add('sf-download-file', `sf-download-file--size-${normalizeSize(size)}`);

    if (!isDisabled) {
      root.classList.add('cursor-pointer', 'transition');
    } else {
      root.classList.add('disabled');
      root.setAttribute('aria-disabled', 'true');
      root.tabIndex = -1;
    }

    if (className) {
      root.classList.add(...String(className).split(' ').filter(Boolean));
    }

    const wrap = document.createElement('div');
    wrap.classList.add('sf-download-file-wrap');
    const iconNode = document.createElement('i');
    iconNode.classList.add('sf-icon');
    iconNode.textContent = String(icon || 'download');
    const fileNameNode = document.createElement('span');
    fileNameNode.classList.add('sf-download-file-file-name');
    fileNameNode.textContent = String(fileName || '');
    wrap.append(iconNode, fileNameNode);
    const fileSizeNode = document.createElement('span');
    fileSizeNode.classList.add('sf-download-file-file-size');
    fileSizeNode.textContent = String(fileSize || '');
    root.append(wrap, fileSizeNode);
    this.href = String(href || '');
    this.download = toBoolean(download, false);
    this.fileName = String(fileName || '');
    this.fileSize = String(fileSize || '');
    this.disabled = isDisabled;
    this.fileSizeNode = fileSizeNode;
    this.template = root;
    this.applyLayoutUtilities(root, '.sf-download-file');
    this.applyLayoutUtilities(wrap, '.sf-download-file .sf-download-file-wrap');
  }

  init() {
    bindDownloadFile(this.template);
  }

  handleClick = event => {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    if (this.template?.tagName?.toLowerCase() === 'a') {
      this.template.dispatchEvent(new CustomEvent('sf-download-file:click', {
        bubbles: true,
        detail: {
          href: this.href,
          fileName: this.fileName,
          download: this.download
        }
      }));
      return;
    }

    if (this.href) {
      event.preventDefault();
      buildAnchorDownload(this.href, this.download ? this.fileName : '');
    }

    this.template?.dispatchEvent(new CustomEvent('sf-download-file:click', {
      bubbles: true,
      detail: {
        href: this.href,
        fileName: this.fileName,
        download: this.download
      }
    }));
  };

  destroyInternal() {
    unbindDownloadFile(this.template);
  }

}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initExistingDownloadFiles(), {
      once: true
    });
  } else {
    initExistingDownloadFiles();
  }
}


(0,_register_helper__WEBPACK_IMPORTED_MODULE_1__["default"])('DownloadFile', DownloadFile);

/***/ },

/***/ "6268ef3b5ed9"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _download_file__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("92b137c03f44");
/*
* Main JS file for including JS for component.
*
* Imports:
* - Base function component (_component_name.js)
*/


/***/ },

/***/ "58661bec99a6"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   registerComponent: () => (/* binding */ registerComponent)
/* harmony export */ });
// Simple helper to register a component in one call.
// Usage inside component bundle:
//   import register from './register-helper';
//   register('Buttons', Buttons);
function registerComponent(name, cls) {
  if (!name || !cls) return;

  if (typeof window !== 'undefined' && typeof window.registerSfComponent === 'function') {
    window.registerSfComponent(name, cls);
    return;
  }

  if (typeof window !== 'undefined' && window.SF?.Loader?.registerComponent) {
    window.SF.Loader.registerComponent(name, cls);
    return;
  }

  if (typeof window !== 'undefined') {
    const pending = window.SF_PENDING_COMPONENTS = window.SF_PENDING_COMPONENTS || [];
    pending.push([name, cls]);
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (registerComponent);

/***/ },

/***/ "d7f974466839"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ComponentObserver: () => (/* binding */ ComponentObserver)
/* harmony export */ });
class ComponentObserver {
  constructor(props) {
    this.props = props;
    this.id = props?.id;
    this.params = props?.param;
    this.attrs = props?.attrs || {};
    this.template = null;
    window.dispatchEvent(new CustomEvent(`${this.componentName}:beforeRender`, {
      detail: this
    }));
  }

  getUtilityMap() {
    return this.constructor.utilityMap || null;
  }

  extractUtilityClasses(values) {
    if (!Array.isArray(values)) {
      return [];
    }

    const classes = new Set();
    values.forEach(value => {
      if (typeof value !== 'string') {
        return;
      }

      const matches = value.match(/\(([^)]+)\)/g);

      if (!matches) {
        return;
      }

      matches.forEach(match => {
        const raw = match.slice(1, -1);
        raw.split(/\s+/).filter(Boolean).forEach(cls => {
          classes.add(cls.replace(/^\./, ''));
        });
      });
    });
    return Array.from(classes);
  }

  applyLayoutUtilities(target, selector) {
    if (!target || !selector) {
      return;
    }

    const map = this.getUtilityMap();

    if (!map || !map[selector]) {
      return;
    }

    const classes = this.extractUtilityClasses(map[selector]);
    classes.forEach(cls => target.classList.add(cls));
  }

  render() {
    this.html = this.template;

    if (typeof this.init === 'function') {
      this.init();
    }

    if (this.html) {
      window.dispatchEvent(new CustomEvent(`${this.componentName}:render`, {
        detail: this
      }));
    }

    return this.html;
  }

  destroy() {
    this.destroyInternal?.();
    this.props = null;
    this.id = null;
    this.params = null;
    this.template = null;

    if (this.html) {
      this.html.remove();
      this.html = null;
    }

    window.dispatchEvent(new CustomEvent(`${this.componentName}:destroy`, {
      detail: this
    }));
  }

  destroyInternal() {}

}

/***/ },

/***/ "fadc616d6a49"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "8ea1dd3302c4"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{".sf-download-file":["display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","gap/var(--sf-e5)","justify-content/space-between (.justify-between)","align-items/center (.items-center)"],".sf-download-file .sf-download-file-wrap":["display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","gap/var(--sf-download-file-wrap--gap)","justify-content/flex-start (.justify-start)","align-items/center (.items-center)"]}');

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
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("fadc616d6a49");
/* harmony import */ var _js_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("6268ef3b5ed9");
/**
 * SIMAI Framework
 * Copyright 2008-2026 SIMAI Ltd
 * http://simai.studio
 * Read the license: http://framework.simai.studio/license/
 * Documentation: http://framework.simai.studio/
 * Support: http://simai.studio/support/
 *
 * INPUTS
 *
 * Entry point for importing components from this directory.
 * Simplifies the import process in other parts of the project.
 * Instead of importing individual files, all component can be imported through this file.
 */


})();

/******/ })()
;