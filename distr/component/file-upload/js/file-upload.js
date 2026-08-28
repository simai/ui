/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "c43efa1014a6"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bindFileUpload: () => (/* binding */ bindFileUpload),
/* harmony export */   clearFileUpload: () => (/* binding */ clearFileUpload),
/* harmony export */   getFileUploadItems: () => (/* binding */ getFileUploadItems),
/* harmony export */   initExistingFileUploads: () => (/* binding */ initExistingFileUploads),
/* harmony export */   retryFileUploadItem: () => (/* binding */ retryFileUploadItem),
/* harmony export */   setFileUploadItems: () => (/* binding */ setFileUploadItems),
/* harmony export */   unbindFileUpload: () => (/* binding */ unbindFileUpload)
/* harmony export */ });
/* harmony import */ var _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d7f974466839");
/* harmony import */ var _register_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("58661bec99a6");


const FILE_UPLOAD_SELECTOR = '.sf-file-upload';
const FILE_UPLOAD_BOUND_FLAG = 'sfFileUploadBound';

function toBoolean(value, fallback = false) {
  if (value === undefined || value === null || value === '') return fallback;
  if (typeof value === 'boolean') return value;
  return ['1', 'true', 'yes', 'on', 'disabled', 'multiple'].includes(String(value).toLowerCase());
}

function normalizeSize(value) {
  const normalized = String(value || '').toLowerCase();
  const supported = ['1/3', '1/2', '1', '2', '3'];
  return supported.includes(normalized) ? normalized : '1';
}

function formatFileSize(bytes) {
  const size = Number(bytes);
  if (!Number.isFinite(size) || size < 0) return '';
  if (size < 1024) return `${size} B`;
  const units = ['KB', 'MB', 'GB', 'TB'];
  let value = size / 1024;
  let index = 0;

  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index += 1;
  }

  const formatted = value >= 10 ? value.toFixed(0) : value.toFixed(1);
  return `${formatted}${units[index]}`;
}

function normalizeItemState(item) {
  const state = String(item?.state || item?.status || 'process').toLowerCase();
  return ['process', 'done', 'error'].includes(state) ? state : 'process';
}

function getItemEventKey(item, index) {
  if (item?.id) return String(item.id);

  if (item?.file && item.file.name) {
    return `${item.file.name}-${item.file.size}-${item.file.lastModified}`;
  }

  if (item?.name || item?.fileName) {
    return `${item.name || item.fileName}-${index}`;
  }

  return `item-${index}`;
}

function isDisabledRoot(root) {
  if (!root) return false;
  return root.classList.contains('disabled') || root.hasAttribute('disabled');
}

function getInput(root) {
  return root?.querySelector?.('input[type="file"].sf-file-upload-input') || null;
}

function getFilesContainer(root) {
  if (!root) return null;
  const targetSelector = root.dataset.target || root.getAttribute('data-target') || '';

  if (targetSelector) {
    try {
      const external = document.querySelector(targetSelector);
      if (external) return external;
    } catch {// Ignore invalid selectors and fallback to structural lookup.
    }
  }

  const next = root.nextElementSibling;

  if (next?.classList?.contains('sf-file-upload-files')) {
    return next;
  }

  return root.querySelector('.sf-file-upload-files') || null;
}

function isManagedRenderRoot(root) {
  if (!root) return false;
  return root.dataset.renderManaged === '1' || root.hasAttribute('data-render-managed');
}

function getMultiple(root) {
  return root.hasAttribute('multiple') || toBoolean(root.dataset.multiple ?? root.getAttribute('multiple'), false);
}

function getAccept(root) {
  return root.dataset.accept || root.getAttribute('accept') || '';
} // function getTriggerLink(root) {
//   return root?.querySelector?.('.sf-file-upload-link') || null;
// }


function ensureInput(root) {
  let input = getInput(root);
  if (input) return input;
  input = document.createElement('input');
  input.type = 'file';
  input.classList.add('sf-file-upload-input');
  input.hidden = true;
  input.tabIndex = -1;
  input.setAttribute('aria-hidden', 'true');
  root.append(input);
  return input;
}

function syncInputConfig(root, input) {
  if (!root || !input) return;
  input.multiple = getMultiple(root);
  const accept = getAccept(root);
  if (accept) input.setAttribute('accept', accept);else input.removeAttribute('accept');
  input.disabled = isDisabledRoot(root);
}

function createUploadProgressItem(item, size = '1') {
  const normalizedSize = normalizeSize(size);
  const state = String(item.state || item.status || 'done').toLowerCase();
  const fileName = String(item.name || item.fileName || 'File');
  const fileSize = String(item.fileSize || item.sizeText || '');
  const progress = Math.max(0, Math.min(100, Number(item.progress ?? 100) || 0));
  const iconName = String(item.icon || 'cloud_upload');
  const errorMessage = String(item.errorMessage || item.retryText || 'Try again');
  const root = document.createElement('div');
  root.className = ['sf-upload-progress', `sf-upload-progress--size-${normalizedSize}`, `sf-upload-progress--${state}`, 'flex', 'items-main-start', 'items-cross-start'].join(' ');
  const leftIcon = document.createElement('i');
  leftIcon.classList.add('sf-icon');
  leftIcon.textContent = iconName;
  const content = document.createElement('div');
  content.className = 'sf-upload-progress-content flex flex-col flex-1';
  const top = document.createElement('div');
  top.className = 'sf-upload-progress-top flex content-main-between';
  const left = document.createElement('div');
  left.className = 'sf-upload-progress-left flex flex-col';
  const nameNode = document.createElement('div');
  nameNode.className = 'sf-upload-progress-name';
  nameNode.textContent = fileName;
  const textNode = document.createElement('div');
  textNode.className = 'sf-upload-progress-text';
  textNode.textContent = fileSize;
  left.append(nameNode, textNode);
  top.append(left);

  if (state === 'done') {
    const doneIcon = document.createElement('i');
    doneIcon.className = 'sf-icon sf-icon-solid';
    doneIcon.textContent = 'check_circle';
    top.append(doneIcon);
  } else if (state === 'error') {
    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.className = `sf-icon-button sf-icon-button--on-surface sf-icon-button--link sf-icon-button--size-${normalizedSize} radius-default`;
    removeButton.dataset.action = 'remove';
    const removeIcon = document.createElement('i');
    removeIcon.className = 'sf-icon';
    removeIcon.textContent = 'delete';
    removeButton.append(removeIcon);
    top.append(removeButton);
    const retry = document.createElement('button');
    retry.type = 'button';
    retry.className = 'sf-upload-progress-repeat self-cross-start';
    retry.dataset.action = 'retry';
    retry.textContent = errorMessage;
    content.append(top, retry);
    root.append(leftIcon, content);
    return root;
  } else {
    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.className = `sf-icon-button sf-icon-button--on-surface sf-icon-button--link sf-icon-button--size-${normalizedSize} radius-default`;
    removeButton.dataset.action = 'remove';
    const removeIcon = document.createElement('i');
    removeIcon.className = 'sf-icon';
    removeIcon.textContent = 'delete';
    removeButton.append(removeIcon);
    top.append(removeButton);
  }

  const progressBar = document.createElement('div');
  progressBar.className = `sf-progress-bar sf-progress-bar--size-${normalizedSize} flex flex-row items-cross-center`;
  const progressMain = document.createElement('div');
  progressMain.className = 'sf-progress-bar-main';
  const progressValue = document.createElement('div');
  progressValue.className = 'sf-progress-bar-progress transition';
  progressValue.style.width = `${progress}%`;
  const progressText = document.createElement('div');
  progressText.className = 'sf-progress-bar-text';
  progressText.textContent = `${progress}%`;
  progressMain.append(progressValue);
  progressBar.append(progressMain, progressText);
  content.append(top, progressBar);
  root.append(leftIcon, content);
  return root;
}

function renderFileUploadItems(root, items = []) {
  root?.classList?.toggle?.('has-files', items.length > 0);
  const container = getFilesContainer(root);
  if (!container || isManagedRenderRoot(root)) return;
  container.innerHTML = '';
  const size = normalizeSize(Array.from(root.classList).find(cls => cls.startsWith('sf-file-upload--size-'))?.replace('sf-file-upload--size-', '') || '1');
  items.forEach((item, index) => {
    const node = createUploadProgressItem(item, size);
    node.dataset.index = String(index);
    container.append(node);
  });
}

function emitFileUploadItemAdd(root, item, index, items, source = 'input') {
  root.dispatchEvent(new CustomEvent('sf-file-upload:file-add', {
    bubbles: true,
    detail: {
      item,
      index,
      items,
      source,
      multiple: getMultiple(root)
    }
  }));
}

function emitFileUploadItemError(root, item, index, items) {
  root.dispatchEvent(new CustomEvent('sf-file-upload:file-error', {
    bubbles: true,
    detail: {
      item,
      index,
      items
    }
  }));
}

function emitFileUploadItemComplete(root, item, index, items) {
  root.dispatchEvent(new CustomEvent('sf-file-upload:file-complete', {
    bubbles: true,
    detail: {
      item,
      index,
      items
    }
  }));
}

function emitFileUploadComplete(root, items) {
  root.dispatchEvent(new CustomEvent('sf-file-upload:complete', {
    bubbles: true,
    detail: {
      items
    }
  }));
}

function syncFileUploadStateEvents(root, nextItems = [], previousItems = []) {
  const previousMap = new Map(previousItems.map((item, index) => [getItemEventKey(item, index), normalizeItemState(item)]));
  nextItems.forEach((item, index) => {
    const key = getItemEventKey(item, index);
    const nextState = normalizeItemState(item);
    const prevState = previousMap.get(key);

    if (nextState === 'error' && prevState !== 'error') {
      emitFileUploadItemError(root, item, index, nextItems);
    }

    if (nextState === 'done' && prevState !== 'done') {
      emitFileUploadItemComplete(root, item, index, nextItems);
    }
  });
  const hasItems = nextItems.length > 0;
  const isAllDone = hasItems && nextItems.every(item => normalizeItemState(item) === 'done');
  const wasAllDone = previousItems.length > 0 && previousItems.every(item => normalizeItemState(item) === 'done');

  if (isAllDone && !wasAllDone) {
    emitFileUploadComplete(root, nextItems);
  }
}

function normalizeFileItems(files = []) {
  return Array.from(files).map(file => ({
    id: `${file.name}-${file.size}-${file.lastModified}`,
    name: file.name,
    fileSize: formatFileSize(file.size),
    progress: 0,
    state: 'process',
    file
  }));
}

function removeFileUploadItem(root, index) {
  if (!root) return false;
  const currentItems = Array.from(root.__sfFileUploadItems || []);
  if (!currentItems.length) return false;
  const normalizedIndex = Number(index);

  if (!Number.isInteger(normalizedIndex) || normalizedIndex < 0 || normalizedIndex >= currentItems.length) {
    return false;
  }

  const [removed] = currentItems.splice(normalizedIndex, 1);
  root.__sfFileUploadItems = currentItems;
  renderFileUploadItems(root, currentItems);
  root.dispatchEvent(new CustomEvent('sf-file-upload:remove', {
    bubbles: true,
    detail: {
      item: removed || null,
      index: normalizedIndex,
      items: currentItems
    }
  }));
  return true;
}

function retryFileUploadItem(root, index) {
  if (!root) return false;
  const currentItems = Array.from(root.__sfFileUploadItems || []);
  if (!currentItems.length) return false;
  const normalizedIndex = Number(index);

  if (!Number.isInteger(normalizedIndex) || normalizedIndex < 0 || normalizedIndex >= currentItems.length) {
    return false;
  }

  const nextItems = currentItems.map(item => ({ ...item
  }));
  const currentItem = nextItems[normalizedIndex];
  currentItem.state = 'process';
  currentItem.progress = 0;
  delete currentItem.errorMessage;
  delete currentItem.retryText;
  const previousItems = Array.from(root.__sfFileUploadItems || []);
  root.__sfFileUploadItems = nextItems;
  renderFileUploadItems(root, nextItems);
  syncFileUploadStateEvents(root, nextItems, previousItems);
  root.dispatchEvent(new CustomEvent('sf-file-upload:retry', {
    bubbles: true,
    detail: {
      item: currentItem,
      index: normalizedIndex,
      items: nextItems
    }
  }));
  return true;
}

function emitSelect(root, files, source = 'input') {
  root.dispatchEvent(new CustomEvent('sf-file-upload:select', {
    bubbles: true,
    detail: {
      files,
      source,
      multiple: getMultiple(root)
    }
  }));
}

function applySelectedFiles(root, files = [], source = 'input') {
  const nextFiles = normalizeFileItems(files);
  const previousItems = Array.from(root.__sfFileUploadItems || []);
  root.__sfFileUploadItems = nextFiles;
  renderFileUploadItems(root, nextFiles);
  syncFileUploadStateEvents(root, nextFiles, previousItems);
  nextFiles.forEach((item, index) => {
    emitFileUploadItemAdd(root, item, index, nextFiles, source);
  });
  emitSelect(root, nextFiles, source);
}

function bindFileUpload(root) {
  if (!root || root.dataset[FILE_UPLOAD_BOUND_FLAG] === '1') return;
  const input = ensureInput(root);
  const filesContainer = getFilesContainer(root);
  syncInputConfig(root, input);

  if (!root.hasAttribute('tabindex') && !isDisabledRoot(root)) {
    root.tabIndex = 0;
  }

  if (!root.hasAttribute('role')) {
    root.setAttribute('role', 'button');
  }

  const openInput = () => {
    if (isDisabledRoot(root)) return;
    syncInputConfig(root, input);
    input.click();
  };

  const onRootClick = event => {
    if (isDisabledRoot(root)) {
      event.preventDefault();
      return;
    }

    const target = event.target;
    if (!(target instanceof Element)) return;
    if (target.closest('.sf-upload-progress-repeat')) return;
    if (target.closest('input[type="file"]')) return;
    if (target.closest('[data-action="remove"]')) return;
    openInput();
  };

  const onKeydown = event => {
    if (isDisabledRoot(root)) return;
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    openInput();
  };

  const onInputChange = event => {
    const files = Array.from(event.target?.files || []);
    if (!files.length) return;
    applySelectedFiles(root, files, 'input');
    event.target.value = '';
  };

  const onDragOver = event => {
    if (isDisabledRoot(root)) return;
    event.preventDefault();
    root.classList.add('dragover');
  };

  const onDragLeave = event => {
    if (!root.contains(event.relatedTarget)) {
      root.classList.remove('dragover');
    }
  };

  const onDrop = event => {
    if (isDisabledRoot(root)) return;
    event.preventDefault();
    root.classList.remove('dragover');
    const files = Array.from(event.dataTransfer?.files || []);
    if (!files.length) return;
    const normalized = getMultiple(root) ? files : files.slice(0, 1);
    applySelectedFiles(root, normalized, 'drop');
  };

  const onFilesClick = event => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const removeButton = target.closest('[data-action="remove"]');
    const retryButton = target.closest('[data-action="retry"]');
    if (!removeButton && !retryButton) return;
    const itemNode = (removeButton || retryButton).closest('.sf-upload-progress');
    if (!itemNode) return;
    event.preventDefault();
    event.stopPropagation();

    if (removeButton) {
      removeFileUploadItem(root, itemNode.dataset.index);
      return;
    }

    retryFileUploadItem(root, itemNode.dataset.index);
  };

  root.addEventListener('click', onRootClick);
  root.addEventListener('keydown', onKeydown);
  root.addEventListener('dragover', onDragOver);
  root.addEventListener('dragleave', onDragLeave);
  root.addEventListener('drop', onDrop);
  input.addEventListener('change', onInputChange);
  filesContainer?.addEventListener('click', onFilesClick);
  root.__sfFileUploadOnClick = onRootClick;
  root.__sfFileUploadOnKeydown = onKeydown;
  root.__sfFileUploadOnDragOver = onDragOver;
  root.__sfFileUploadOnDragLeave = onDragLeave;
  root.__sfFileUploadOnDrop = onDrop;
  root.__sfFileUploadOnChange = onInputChange;
  root.__sfFileUploadOnFilesClick = onFilesClick;
  root.dataset[FILE_UPLOAD_BOUND_FLAG] = '1';
}

function unbindFileUpload(root) {
  if (!root || root.dataset[FILE_UPLOAD_BOUND_FLAG] !== '1') return;
  const input = getInput(root);

  if (root.__sfFileUploadOnClick) {
    root.removeEventListener('click', root.__sfFileUploadOnClick);
  }

  if (root.__sfFileUploadOnKeydown) {
    root.removeEventListener('keydown', root.__sfFileUploadOnKeydown);
  }

  if (root.__sfFileUploadOnDragOver) {
    root.removeEventListener('dragover', root.__sfFileUploadOnDragOver);
  }

  if (root.__sfFileUploadOnDragLeave) {
    root.removeEventListener('dragleave', root.__sfFileUploadOnDragLeave);
  }

  if (root.__sfFileUploadOnDrop) {
    root.removeEventListener('drop', root.__sfFileUploadOnDrop);
  }

  if (input && root.__sfFileUploadOnChange) {
    input.removeEventListener('change', root.__sfFileUploadOnChange);
  }

  const filesContainer = getFilesContainer(root);

  if (filesContainer && root.__sfFileUploadOnFilesClick) {
    filesContainer.removeEventListener('click', root.__sfFileUploadOnFilesClick);
  }

  delete root.__sfFileUploadOnClick;
  delete root.__sfFileUploadOnKeydown;
  delete root.__sfFileUploadOnDragOver;
  delete root.__sfFileUploadOnDragLeave;
  delete root.__sfFileUploadOnDrop;
  delete root.__sfFileUploadOnChange;
  delete root.__sfFileUploadOnFilesClick;
  delete root.dataset[FILE_UPLOAD_BOUND_FLAG];
}

function initExistingFileUploads(target = document) {
  target.querySelectorAll(FILE_UPLOAD_SELECTOR).forEach(bindFileUpload);
}

function getFileUploadItems(target) {
  const root = target instanceof HTMLElement ? target.closest(FILE_UPLOAD_SELECTOR) || target : null;
  if (!root) return [];
  return Array.from(root.__sfFileUploadItems || []);
}

function setFileUploadItems(target, items = []) {
  const root = target instanceof HTMLElement ? target.closest(FILE_UPLOAD_SELECTOR) || target : null;
  if (!root) return false;
  const previousItems = Array.from(root.__sfFileUploadItems || []);
  root.__sfFileUploadItems = Array.isArray(items) ? items : [];
  renderFileUploadItems(root, root.__sfFileUploadItems);
  syncFileUploadStateEvents(root, root.__sfFileUploadItems, previousItems);
  return true;
}

function clearFileUpload(target) {
  return setFileUploadItems(target, []);
}

class FileUpload extends _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__.ComponentObserver {
  static componentName = 'FileUpload';
  html = null;

  init() {
    bindFileUpload(this.template);
  }

  destroyInternal() {
    unbindFileUpload(this.template);
  }

}

(0,_register_helper__WEBPACK_IMPORTED_MODULE_1__["default"])('FileUpload', FileUpload);

if (typeof window !== 'undefined') {
  window.SF = window.SF || {};
  window.SF.FileUpload = window.SF.FileUpload || {};
  window.SF.FileUpload.getItems = getFileUploadItems;
  window.SF.FileUpload.setItems = setFileUploadItems;
  window.SF.FileUpload.clear = clearFileUpload;
  window.SF.FileUpload.removeItem = removeFileUploadItem;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initExistingFileUploads(), {
    once: true
  });
} else {
  initExistingFileUploads();
}

const fileUploadObserver = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (!(node instanceof Element)) return;

      if (node.matches?.(FILE_UPLOAD_SELECTOR)) {
        bindFileUpload(node);
      }

      initExistingFileUploads(node);
    });
  });
});
fileUploadObserver.observe(document.documentElement, {
  childList: true,
  subtree: true
});


/***/ },

/***/ "0c39c584acf3"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _file_upload__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("c43efa1014a6");
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

/***/ "1b5cf325ddb6"
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
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("1b5cf325ddb6");
/* harmony import */ var _js_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("0c39c584acf3");
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