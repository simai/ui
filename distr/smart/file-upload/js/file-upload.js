/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "e6d86f2cd058"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FIELD_SIZES: () => (/* binding */ FIELD_SIZES),
/* harmony export */   RETIRED_FIELD_SIZES: () => (/* binding */ RETIRED_FIELD_SIZES),
/* harmony export */   fieldSize: () => (/* binding */ fieldSize),
/* harmony export */   nearestFieldSize: () => (/* binding */ nearestFieldSize),
/* harmony export */   retireFieldSizeClass: () => (/* binding */ retireFieldSizeClass)
/* harmony export */ });
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("06e8cd089f28");
// Form fields come in three sizes. 1/3 and 3 were retired: no consumer used
// them, and they could not hold a field's own pictures, tags and targets. A
// page written for a retired size keeps rendering at the nearest kept size, and
// says so once in the console so the markup can be updated.

const FIELD_SIZES = Object.freeze(['1/2', '1', '2']);
const RETIRED_FIELD_SIZES = Object.freeze({
  '1/3': '1/2',
  '3': '2'
});
const warned = new Set(); // A control placed inside something with the whole scale (a list item, say)
// takes the nearest form size, quietly: the list is not wrong to be 1/3.

function nearestFieldSize(value) {
  const size = String(value ?? '').trim().toLowerCase();
  if (FIELD_SIZES.includes(size)) return size;
  return Object.hasOwn(RETIRED_FIELD_SIZES, size) ? RETIRED_FIELD_SIZES[size] : '1';
}
function fieldSize(value, component = 'field', fallback = '1') {
  const size = String(value ?? '').trim().toLowerCase();
  if (FIELD_SIZES.includes(size)) return size;

  if (Object.hasOwn(RETIRED_FIELD_SIZES, size)) {
    const kept = RETIRED_FIELD_SIZES[size];
    (0,_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_0__.noteDeprecated)({
      component,
      kind: 'value',
      attribute: 'size',
      from: size,
      to: kept
    });
    const key = `${component}:${size}`;

    if (!warned.has(key) && typeof console !== 'undefined') {
      warned.add(key);
      console.warn(`[SIMAI Framework] ${component}: size ${size} is retired for form fields; rendering size ${kept}.`);
    }

    return kept;
  }

  return fallback;
} // Markup written by hand carries its size as a class, so the binder moves a
// retired size class to the kept one before anything measures the field.

function retireFieldSizeClass(root, block) {
  if (!root?.classList) return;

  for (const [retired, kept] of Object.entries(RETIRED_FIELD_SIZES)) {
    const name = `${block}--size-${retired}`;
    if (!root.classList.contains(name)) continue;
    root.classList.replace(name, `${block}--size-${fieldSize(retired, block)}`);
  }
}

/***/ },

/***/ "c43efa1014a6"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
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
/* harmony import */ var _field_size__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("e6d86f2cd058");
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("0d662e4d7d63");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__);



 // Every word this part says. A product adds a language with
// SF.language.register('sf-file-upload', code, words); a ternary on «ru» allowed two
// and no more.

const FILE_UPLOAD_ITEM_TEXT = {
  en: {
    remove: 'Remove',
    uploading: 'Uploading',
    retry: 'Try again',
    linkText: 'Click to upload',
    text: 'or drag and drop'
  },
  ru: {
    remove: 'Удалить',
    uploading: 'Загрузка',
    retry: 'Повторить',
    linkText: 'Выберите файл',
    text: 'или перетащите его сюда'
  }
};
const FILE_UPLOAD_SELECTOR = '.sf-file-upload';
const FILE_UPLOAD_BOUND_FLAG = 'sfFileUploadBound';

function toBoolean(value, fallback = false) {
  if (value === undefined || value === null || value === '') return fallback;
  if (typeof value === 'boolean') return value;
  return ['1', 'true', 'yes', 'on', 'disabled', 'multiple'].includes(String(value).toLowerCase());
}

function normalizeSize(value) {
  return (0,_field_size__WEBPACK_IMPORTED_MODULE_2__.fieldSize)(value, 'sf-file-upload');
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

function syncFileUploadInteraction(root) {
  const state = root.__sfFileUploadInteractionState ||= {
    tabIndex: root.getAttribute('tabindex') ?? '0',
    disabled: false,
    buttons: new WeakMap()
  };
  const disabled = isDisabledRoot(root);
  if (!state.disabled) state.tabIndex = root.getAttribute('tabindex') ?? '0';
  const tabIndex = disabled ? '-1' : state.tabIndex;
  if (root.getAttribute('tabindex') !== tabIndex) root.setAttribute('tabindex', tabIndex);
  if (root.getAttribute('aria-disabled') !== String(disabled)) root.setAttribute('aria-disabled', String(disabled));
  state.disabled = disabled;
  syncInputConfig(root, getInput(root));
  if (disabled && root.classList.contains('dragover')) root.classList.remove('dragover');
  const files = getFilesContainer(root);
  files?.querySelectorAll('button[data-action="remove"], button[data-action="retry"]').forEach(button => {
    let previous = state.buttons.get(button);

    if (!previous) {
      previous = {
        disabled: button.disabled,
        managedDisabled: false,
        label: null
      };
      state.buttons.set(button, previous);
    }

    if (!previous.managedDisabled) previous.disabled = button.disabled;
    const nextDisabled = disabled || previous.disabled;
    if (button.disabled !== nextDisabled) button.disabled = nextDisabled;
    previous.managedDisabled = disabled;
    if (button.dataset.action !== 'remove') return;
    const currentLabel = button.getAttribute('aria-label');

    if (!button.hasAttribute('aria-labelledby') && (!currentLabel || currentLabel === previous.label)) {
      const name = button.closest('.sf-upload-progress')?.querySelector('.sf-upload-progress-name')?.textContent?.trim() || '';
      const label = `${(0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageText)(FILE_UPLOAD_ITEM_TEXT, 'remove', root, 'sf-file-upload')} ${name}`.trim();
      if (currentLabel !== label) button.setAttribute('aria-label', label);
      previous.label = label;
    }

    button.querySelectorAll('.sf-icon').forEach(icon => {
      if (icon.getAttribute('aria-hidden') !== 'true') icon.setAttribute('aria-hidden', 'true');
    });
  }); // Each file's progress bar is a progressbar, and a progressbar without a name
  // is announced as a bare percentage: with three files uploading, the reader
  // hears three numbers and no way to tell them apart. It takes the file's name
  // the way the remove button does, unless the author named it.

  files?.querySelectorAll('.sf-upload-progress').forEach(item => {
    const name = item.querySelector('.sf-upload-progress-name')?.textContent?.trim() || '';
    const label = `${(0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageText)(FILE_UPLOAD_ITEM_TEXT, 'uploading', root, 'sf-file-upload')} ${name}`.trim();
    const host = item.querySelector('sf-progress-bar');

    if (host) {
      const managed = host.dataset.sfUploadLabel;

      if (!host.hasAttribute('label') || host.getAttribute('label') === managed) {
        if (host.getAttribute('label') !== label) host.setAttribute('label', label);
        host.dataset.sfUploadLabel = label;
      }

      return;
    }

    const bar = item.querySelector('.sf-progress-bar');
    if (!bar || bar.hasAttribute('aria-labelledby')) return;
    const current = bar.getAttribute('aria-label');

    if (!current || current === bar.dataset.sfUploadLabel) {
      if (current !== label) bar.setAttribute('aria-label', label);
      bar.dataset.label = label;
      bar.dataset.sfUploadLabel = label;
    }
  });
}

function createUploadProgressItem(item, size = '1', owner = null) {
  const normalizedSize = normalizeSize(size);
  const state = String(item.state || item.status || 'done').toLowerCase();
  const fileName = String(item.name || item.fileName || 'File');
  const fileSize = String(item.fileSize || item.sizeText || '');
  const progress = Math.max(0, Math.min(100, Number(item.progress ?? 100) || 0));
  const iconName = String(item.icon || 'cloud_upload');
  const errorMessage = String(item.errorMessage || item.retryText || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageText)(FILE_UPLOAD_ITEM_TEXT, 'retry', owner, 'sf-file-upload'));
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
    removeButton.className = `sf-icon-button sf-icon-button--icon sf-icon-button--on-surface sf-icon-button--link sf-icon-button--size-${normalizedSize} flex items-cross-center content-main-center self-cross-start`;
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
    removeButton.className = `sf-icon-button sf-icon-button--icon sf-icon-button--on-surface sf-icon-button--link sf-icon-button--size-${normalizedSize} flex items-cross-center content-main-center self-cross-start`;
    removeButton.dataset.action = 'remove';
    const removeIcon = document.createElement('i');
    removeIcon.className = 'sf-icon';
    removeIcon.textContent = 'delete';
    removeButton.append(removeIcon);
    top.append(removeButton);
  }

  const progressBar = document.createElement('div');
  progressBar.className = `sf-progress-bar sf-progress-bar--size-${normalizedSize} flex flex-row items-cross-center`;
  progressBar.dataset.value = String(progress);
  progressBar.dataset.textPosition = 'inline-end';
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

  if (!container || isManagedRenderRoot(root)) {
    if (root) syncFileUploadInteraction(root);
    return;
  }

  container.innerHTML = '';
  const size = normalizeSize(Array.from(root.classList).find(cls => cls.startsWith('sf-file-upload--size-'))?.replace('sf-file-upload--size-', '') || '1');
  items.forEach((item, index) => {
    const node = createUploadProgressItem(item, size, root);
    node.dataset.index = String(index);
    container.append(node);
  });
  syncFileUploadInteraction(root);
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
} // Whether a file is one the accept list names: `.ext`, `type/*` or `type/sub`,
// as the platform dialog reads it. The dialog filters what a person may pick; a
// drop went past it and took any file at all.


function acceptsFile(accept, file) {
  const tokens = String(accept || '').split(',').map(token => token.trim().toLowerCase()).filter(Boolean);
  if (!tokens.length) return true;
  const name = String(file?.name || '').toLowerCase();
  const type = String(file?.type || '').toLowerCase();
  return tokens.some(token => {
    if (token.startsWith('.')) return name.endsWith(token);
    if (token.endsWith('/*')) return type.startsWith(token.slice(0, -1));
    return type === token;
  });
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
  (0,_field_size__WEBPACK_IMPORTED_MODULE_2__.retireFieldSizeClass)(root, 'sf-file-upload');
  if (!root) return;
  const input = ensureInput(root);
  const filesContainer = getFilesContainer(root); // DOM markers survive cloneNode; listeners and selected File objects do not.

  if (typeof root.__sfFileUploadOnClick === 'function') {
    if (root.__sfFileUploadBoundInput === input && root.__sfFileUploadBoundFiles === filesContainer) return;
    unbindFileUpload(root);
  } else if (root.dataset[FILE_UPLOAD_BOUND_FLAG] === '1' && !root.__sfFileUploadItems && !isManagedRenderRoot(root)) {
    root.__sfFileUploadItems = [];

    if (root.classList.contains('has-files') && !root.hasAttribute('data-target')) {
      renderFileUploadItems(root, []);
    }

    root.classList.remove('has-files', 'dragover');
  }

  syncFileUploadInteraction(root);

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
    if (event.target !== root || event.repeat || root.matches('button, input, a[href]')) return;
    if (isDisabledRoot(root)) return;
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    openInput();
  };

  const onInputChange = event => {
    if (isDisabledRoot(root)) return;
    const files = Array.from(event.target?.files || []);
    if (!files.length) return;
    applySelectedFiles(root, files, 'input');
    event.target.value = '';
  };

  const onDragOver = event => {
    if (!Array.from(event.dataTransfer?.types || []).includes('Files')) return;
    event.preventDefault();

    if (isDisabledRoot(root)) {
      event.dataTransfer.dropEffect = 'none';
      return;
    }

    event.dataTransfer.dropEffect = 'copy';
    root.classList.add('dragover');
  };

  const onDragLeave = event => {
    if (!root.contains(event.relatedTarget)) {
      root.classList.remove('dragover');
    }
  };

  const onDrop = event => {
    root.classList.remove('dragover');
    const files = Array.from(event.dataTransfer?.files || []);
    if (!files.length && !Array.from(event.dataTransfer?.types || []).includes('Files')) return;
    event.preventDefault();
    if (isDisabledRoot(root) || !files.length) return;
    const accepted = files.filter(file => acceptsFile(getAccept(root), file));
    const rejected = files.filter(file => !accepted.includes(file));

    if (rejected.length) {
      root.dispatchEvent(new CustomEvent('sf-file-upload:reject', {
        bubbles: true,
        detail: {
          files: rejected,
          accept: getAccept(root),
          source: 'drop'
        }
      }));
    }

    if (!accepted.length) return;
    const normalized = getMultiple(root) ? accepted : accepted.slice(0, 1);
    applySelectedFiles(root, normalized, 'drop'); // A pick sends change from the native input; a drop sent none, so a form
    // listening for change never heard of a dropped file.

    root.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      detail: {
        files: normalized,
        source: 'drop'
      }
    }));
  };

  const onFilesClick = event => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const removeButton = target.closest('[data-action="remove"]');
    const retryButton = target.closest('[data-action="retry"]');
    if (!removeButton && !retryButton) return;

    if (isDisabledRoot(root) || (removeButton || retryButton).disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

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
  root.__sfFileUploadBoundInput = input;
  root.__sfFileUploadBoundFiles = filesContainer;
  const interactionObserver = new MutationObserver(() => syncFileUploadInteraction(root));
  interactionObserver.observe(root, {
    attributes: true,
    attributeFilter: ['disabled', 'class', 'accept', 'multiple', 'data-accept', 'data-multiple']
  });
  if (filesContainer) interactionObserver.observe(filesContainer, {
    childList: true,
    subtree: true,
    characterData: true
  });
  root.__sfFileUploadInteractionObserver = interactionObserver;
  root.dataset[FILE_UPLOAD_BOUND_FLAG] = '1';
}

function unbindFileUpload(root) {
  if (!root) return;
  const input = root.__sfFileUploadBoundInput || getInput(root);
  root.__sfFileUploadInteractionObserver?.disconnect();
  delete root.__sfFileUploadInteractionObserver;

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

  const filesContainer = root.__sfFileUploadBoundFiles || getFilesContainer(root);

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
  delete root.__sfFileUploadBoundInput;
  delete root.__sfFileUploadBoundFiles;
  delete root.dataset[FILE_UPLOAD_BOUND_FLAG];
}

function initExistingFileUploads(target = document) {
  target.querySelectorAll(FILE_UPLOAD_SELECTOR).forEach(bindOrdinaryFileUpload);
}

function bindOrdinaryFileUpload(root) {
  // Smart owns its render timing and teardown, even when both bundles load.
  if (root.isConnected && !root.closest('sf-file-upload')) bindFileUpload(root);
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
} // The class built nothing: template stayed null and render() returned null. It
// builds the drop area and its list now, the markup the Smart template draws.


class FileUpload extends _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__.ComponentObserver {
  static componentName = 'FileUpload';

  constructor(props) {
    super(props);
    const {
      size = '1',
      accept = '',
      multiple = false,
      disabled = false,
      icon = 'cloud_upload',
      linkText,
      text,
      supportingText = '',
      label = ''
    } = this.params || {};
    const step = normalizeSize(size);
    const wrapper = document.createElement('div');
    wrapper.className = 'sf-file-upload-wrap flex flex-col gap-1';
    const root = document.createElement('div');
    if (this.id) root.id = this.id;
    root.className = `sf-file-upload sf-file-upload--size-${step} flex flex-col items-cross-center cursor-pointer`;
    const className = this.attrs.class || this.attrs.className;
    if (className) root.classList.add(...String(className).split(' ').filter(Boolean));
    if (accept) root.dataset.accept = accept;
    root.dataset.multiple = toBoolean(multiple) ? 'true' : 'false';
    if (toBoolean(multiple)) root.setAttribute('multiple', '');
    if (toBoolean(disabled)) root.setAttribute('disabled', '');
    if (label) root.setAttribute('aria-label', label);
    root.tabIndex = 0;
    const featured = document.createElement('div');
    featured.className = `sf-featured-icon sf-featured-icon--size-${step} sf-featured-icon--soft sf-featured-icon--circle sf-featured-icon--neutral`;
    const glyph = document.createElement('i');
    glyph.className = 'sf-icon';
    glyph.textContent = icon;
    featured.append(glyph);
    const bottom = document.createElement('div');
    bottom.className = 'sf-file-upload-bottom flex flex-col items-cross-center';
    const block = document.createElement('div');
    block.className = 'sf-file-upload-block flex';
    const blockText = document.createElement('div');
    blockText.className = 'sf-file-upload-block-text';
    const link = document.createElement('span');
    link.className = 'sf-file-upload-link';
    link.textContent = linkText ?? (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageText)(FILE_UPLOAD_ITEM_TEXT, 'linkText', root, 'sf-file-upload');
    blockText.append(link, ` ${text ?? (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageText)(FILE_UPLOAD_ITEM_TEXT, 'text', root, 'sf-file-upload')}`);
    block.append(blockText);
    bottom.append(block);

    if (supportingText) {
      const support = document.createElement('span');
      support.className = 'sf-file-upload-text';
      support.textContent = supportingText;
      bottom.append(support);
    }

    root.append(featured, bottom);
    const files = document.createElement('div');
    files.className = 'sf-file-upload-files grid grid-col-1 gap-1 w-full';
    wrapper.append(root, files);
    this.root = root;
    this.template = wrapper;
  }

  init() {
    bindFileUpload(this.root);
  }

  destroyInternal() {
    unbindFileUpload(this.root);
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
        bindOrdinaryFileUpload(node);
      }

      initExistingFileUploads(node);
    });
    mutation.removedNodes.forEach(node => {
      if (!(node instanceof Element) || node.isConnected) return;
      const roots = [...node.querySelectorAll(FILE_UPLOAD_SELECTOR)];
      if (node.matches(FILE_UPLOAD_SELECTOR)) roots.push(node);
      roots.forEach(root => {
        if (!root.isConnected && !root.closest('sf-file-upload')) unbindFileUpload(root);
      });
    });
  });
});
fileUploadObserver.observe(document.documentElement, {
  childList: true,
  subtree: true
});

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

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
  // Components name themselves with a static field (static componentName =
  // 'Modal'), and the Loader writes the name on the prototype only when it
  // registers the class; the lifecycle events read the instance, so an
  // instance made before that announced itself as `undefined:render`. Not a
  // getter: the Loader assigns the prototype property, and an accessor
  // without a setter made that assignment throw.
  lifecycleName() {
    return this.componentName ?? this.constructor.componentName;
  }

  constructor(props) {
    this.props = props;
    this.id = props?.id;
    this.params = props?.param;
    this.attrs = props?.attrs || {};
    this.template = null;
    window.dispatchEvent(new CustomEvent(`${this.lifecycleName()}:beforeRender`, {
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
          // Only explicit (.class) annotations are classes; the
          // parentheses in var(--token) are CSS values, not markup.
          if (cls.startsWith('.') && cls.length > 1) classes.add(cls.slice(1));
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
      window.dispatchEvent(new CustomEvent(`${this.lifecycleName()}:render`, {
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

    window.dispatchEvent(new CustomEvent(`${this.lifecycleName()}:destroy`, {
      detail: this
    }));
  }

  destroyInternal() {}

}

/***/ },

/***/ "06e8cd089f28"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   clearDeprecations: () => (/* binding */ clearDeprecations),
/* harmony export */   listDeprecations: () => (/* binding */ listDeprecations),
/* harmony export */   noteDeprecated: () => (/* binding */ noteDeprecated)
/* harmony export */ });
// What a page still uses that the Framework keeps only for compatibility. Every
// legacy attribute, value or name a component resolves is noted here once, so a
// person, a probe or an AI upgrading a product can read the list off a running
// page (SF.deprecations.list()) instead of searching the source for it. The
// records behind the names are in contracts/changes/journal.json.
//
// Nothing is printed by default: a page opts in to console warnings with
// <html data-sf-deprecations="warn"> or SF.deprecations.warn = true.
//
// Every bundle carries its own copy of this module, so a Map of its own made one
// list per bundle, and SF.deprecations.list() answered with whichever bundle set
// it last -- [] on a page printing seven warnings from others. The notes live on
// one shared global instead, whichever copy writes or reads them.
function sharedNotes() {
  const root = globalThis.SF = globalThis.SF || {};

  if (!(root.__deprecationNotes instanceof Map)) {
    Object.defineProperty(root, '__deprecationNotes', {
      value: new Map(),
      configurable: true
    });
  }

  return root.__deprecationNotes;
}

function warnEnabled() {
  const root = globalThis.document?.documentElement;
  return root?.dataset?.sfDeprecations === 'warn' || globalThis.SF?.deprecations?.warn === true;
}

function noteDeprecated({
  component = '',
  kind = 'attribute',
  attribute = '',
  from,
  to = null
} = {}) {
  if (!from) return;
  const key = [component, kind, attribute, from].join('|');
  const notes = sharedNotes();
  const existing = notes.get(key);

  if (existing) {
    existing.count += 1;
    return;
  }

  notes.set(key, {
    component,
    kind,
    attribute,
    from,
    to,
    count: 1
  });

  if (warnEnabled()) {
    const where = component ? `${component}: ` : '';
    const what = kind === 'value' ? `${attribute}="${from}"` : `${kind} ${from}`;
    globalThis.console?.warn?.(`[SIMAI Framework] ${where}${what} is a legacy name${to ? `; write ${to}` : ''}. See contracts/changes/journal.json.`);
  }
}
function listDeprecations() {
  return [...sharedNotes().values()].map(note => ({ ...note
  }));
}
function clearDeprecations() {
  sharedNotes().clear();
}

if (typeof globalThis !== 'undefined') {
  globalThis.SF = globalThis.SF || {};
  const api = globalThis.SF.deprecations || {};
  api.list = listDeprecations;
  api.clear = clearDeprecations;
  api.note = noteDeprecated;
  globalThis.SF.deprecations = api;
}

/***/ },

/***/ "4a441273c368"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _component_file_upload_js_file_upload__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("c43efa1014a6");
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("fbe0570fcc69");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("a0ca4643a85f");
/* harmony import */ var _component_field_size__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("e6d86f2cd058");
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("0d662e4d7d63");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_component_file_upload_js_file_upload__WEBPACK_IMPORTED_MODULE_0__, _core_js_smart_base__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_2__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_4__]);
([_component_file_upload_js_file_upload__WEBPACK_IMPORTED_MODULE_0__, _core_js_smart_base__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_2__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_4__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_core_js_page_language__WEBPACK_IMPORTED_MODULE_4__);




 // Every word this component says, in the languages it ships with. A product
// adds any other through SF.language.register("sf-file-upload", code, words).

const FILE_UPLOAD_TEXT = {
  en: {
    linkText: 'Click to upload',
    text: 'or drag and drop',
    retry: 'Try again'
  },
  ru: {
    linkText: 'Выберите файл',
    text: 'или перетащите его сюда',
    retry: 'Повторить'
  }
};

function formatAcceptValue(value) {
  const parts = String(value || '').split(',').map(part => part.trim()).filter(Boolean).map(part => part.replace(/^\./, '')).map(part => {
    if (part.includes('/')) {
      return part.split('/').pop() || part;
    }

    return part;
  }).map(part => part.toUpperCase());
  return parts.join(', ');
}

class SfFileUpload extends (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_1___default()) {
  static get props() {
    return {
      templateName: {
        attribute: 'template',
        default: 'default'
      },
      size: {
        default: '1',
        values: _component_field_size__WEBPACK_IMPORTED_MODULE_3__.FIELD_SIZES
      },
      icon: {
        default: 'upload_file'
      },
      linkText: {
        default: ''
      },
      text: {
        default: 'or drag and drop'
      },
      formats: {
        default: ''
      },
      supportingText: {
        default: ''
      },
      accept: {
        default: ''
      },
      multiple: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      ariaLabel: {
        default: ''
      }
    };
  }

  constructor() {
    super();
    this._items = [];
    this._boundRoot = null;
    this._onSelect = null;
    this._onRemove = null;
    this._onRetry = null;
  }

  get componentName() {
    return 'file-upload';
  }

  shouldClearLightDomBeforeFirstRender() {
    return super.shouldClearLightDomBeforeFirstRender() || this.templateName === 'default' && !!this.querySelector(':scope > .sf-file-upload[data-render-managed="1"]');
  }

  get templateName() {
    return this.getAttribute('template') || 'default';
  }

  get size() {
    return (0,_component_field_size__WEBPACK_IMPORTED_MODULE_3__.fieldSize)(this.getAttribute('size') || '1', 'sf-file-upload');
  }

  get icon() {
    return this.getAttribute('icon') || 'upload_file';
  }

  get linkText() {
    return this.getAttribute('link-text') || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_4__.pageText)(FILE_UPLOAD_TEXT, "linkText", this);
  }

  get text() {
    return this.getAttribute('text') || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_4__.pageText)(FILE_UPLOAD_TEXT, "text", this);
  }

  get formats() {
    return this.getAttribute('formats') || formatAcceptValue(this.accept) || // The component cannot know what a field accepts: it names formats only
    // when the host gives them or an accept list says so.
    '';
  }

  get supportingText() {
    return this.getAttribute('supporting-text') || this.formats;
  }

  get accept() {
    return this.getAttribute('accept') || '';
  }

  get multiple() {
    return this.getBooleanAttr('multiple', false);
  }

  get disabled() {
    return this.getBooleanAttr('disabled', false);
  }

  get ariaLabel() {
    return this.getAttribute('aria-label') || '';
  }

  get items() {
    return Array.isArray(this._items) ? this._items : [];
  }

  set items(value) {
    this._items = Array.isArray(value) ? value : [];
    this.syncRuntimeItems();
    this.requestComponentUpdate('items');
  }

  templateContext() {
    const props = this.getPropsContext();
    return this.createTemplateContext({ ...props,
      linkText: this.getAttribute("link-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_4__.pageText)(FILE_UPLOAD_TEXT, "linkText", this),
      text: this.getAttribute("text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_4__.pageText)(FILE_UPLOAD_TEXT, "text", this),
      retryText: (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_4__.pageText)(FILE_UPLOAD_TEXT, "retry", this),
      component: this,
      formats: this.formats,
      supportingText: this.supportingText,
      items: this.items
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_2__.renderFileUploadTemplate)(this.templateContext());
  }

  get state() {
    return {
      size: this.size,
      icon: this.icon,
      linkText: this.linkText,
      text: this.text,
      formats: this.formats,
      supportingText: this.supportingText,
      accept: this.accept,
      multiple: this.multiple,
      disabled: this.disabled,
      items: this.items
    };
  }

  getItems() {
    return this.items;
  }

  onFileAdd(handler, options) {
    if (typeof handler === 'function') {
      this.addEventListener('sf-file-upload:file-add', handler, options);
    }

    return this;
  }

  onFileError(handler, options) {
    if (typeof handler === 'function') {
      this.addEventListener('sf-file-upload:file-error', handler, options);
    }

    return this;
  }

  onFileComplete(handler, options) {
    if (typeof handler === 'function') {
      this.addEventListener('sf-file-upload:file-complete', handler, options);
    }

    return this;
  }

  onFileRemove(handler, options) {
    if (typeof handler === 'function') {
      this.addEventListener('sf-file-upload:remove', handler, options);
    }

    return this;
  }

  onFileRetry(handler, options) {
    if (typeof handler === 'function') {
      this.addEventListener('sf-file-upload:retry', handler, options);
    }

    return this;
  }

  onComplete(handler, options) {
    if (typeof handler === 'function') {
      this.addEventListener('sf-file-upload:complete', handler, options);
    }

    return this;
  }

  setItems(nextItems = []) {
    this.items = nextItems;
    return this;
  }

  clear() {
    this.items = [];
    return this;
  }

  removeItem(index) {
    const nextItems = Array.from(this.items);
    const normalizedIndex = Number(index);

    if (!Number.isInteger(normalizedIndex) || normalizedIndex < 0 || normalizedIndex >= nextItems.length) {
      return this;
    }

    nextItems.splice(normalizedIndex, 1);
    this.items = nextItems;
    return this;
  }

  setState(nextState = {}) {
    if (!nextState || typeof nextState !== 'object') {
      return this;
    }

    const attributeState = { ...nextState
    };

    if ('items' in attributeState) {
      this._items = Array.isArray(attributeState.items) ? attributeState.items : [];
      delete attributeState.items;
    }

    super.setState(attributeState);
    this.syncRuntimeItems();
    this.requestComponentUpdate('state');
    return this;
  }

  beforeRender() {
    this.teardownRuntime();
  }

  afterRender(callback) {
    if (typeof callback === 'function') return super.afterRender(callback);
    this._boundRoot = this.querySelector('.sf-file-upload');

    if (!this._boundRoot) {
      return;
    }

    (0,_component_file_upload_js_file_upload__WEBPACK_IMPORTED_MODULE_0__.bindFileUpload)(this._boundRoot);
    this.syncRuntimeItems();

    this._onSelect = () => {
      this._items = Array.from(this._boundRoot?.__sfFileUploadItems || []);
      this.requestComponentUpdate('items');
    };

    this._onRemove = () => {
      this._items = Array.from(this._boundRoot?.__sfFileUploadItems || []);
      this.requestComponentUpdate('items');
    };

    this._onRetry = () => {
      this._items = Array.from(this._boundRoot?.__sfFileUploadItems || []);
      this.requestComponentUpdate('items');
    };

    this._boundRoot.addEventListener('sf-file-upload:select', this._onSelect);

    this._boundRoot.addEventListener('sf-file-upload:remove', this._onRemove);

    this._boundRoot.addEventListener('sf-file-upload:retry', this._onRetry);
  }

  onDisconnected() {
    this.teardownRuntime();
  }

  syncRuntimeItems() {
    if (!this._boundRoot) {
      return;
    }

    (0,_component_file_upload_js_file_upload__WEBPACK_IMPORTED_MODULE_0__.setFileUploadItems)(this._boundRoot, this.items);
  }

  teardownRuntime() {
    if (this._boundRoot && this._onSelect) {
      this._boundRoot.removeEventListener('sf-file-upload:select', this._onSelect);
    }

    if (this._boundRoot && this._onRemove) {
      this._boundRoot.removeEventListener('sf-file-upload:remove', this._onRemove);
    }

    if (this._boundRoot && this._onRetry) {
      this._boundRoot.removeEventListener('sf-file-upload:retry', this._onRetry);
    }

    if (this._boundRoot) {
      (0,_component_file_upload_js_file_upload__WEBPACK_IMPORTED_MODULE_0__.unbindFileUpload)(this._boundRoot);
      this._boundRoot = null;
    }

    this._onSelect = null;
    this._onRemove = null;
    this._onRetry = null;
  }

}

SfFileUpload.define('sf-file-upload');
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "a0ca4643a85f"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderFileUploadTemplate: () => (/* binding */ renderFileUploadTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ddf1cdb42ecc");
/* harmony import */ var _component_field_size__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("e6d86f2cd058");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);



function normalizeSize(value) {
  return (0,_component_field_size__WEBPACK_IMPORTED_MODULE_1__.fieldSize)(value, 'sf-file-upload');
}

function normalizeState(value) {
  const normalized = String(value || '').toLowerCase();
  const supported = ['process', 'done', 'error'];
  return supported.includes(normalized) ? normalized : 'process';
}

function normalizeProgress(value) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return 0;
  }

  return Math.max(0, Math.min(100, parsed));
}

function renderUploadItem(item, size, index, retryText) {
  const state = normalizeState(item.state || item.status);
  const progress = normalizeProgress(item.progress ?? (state === 'done' ? 100 : 0));
  const icon = item.icon || 'cloud_upload';
  const name = item.name || item.fileName || 'File';
  const fileSize = item.fileSize || item.sizeText || '';
  const errorMessage = item.errorMessage || item.retryText || retryText;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div
                class="sf-upload-progress sf-upload-progress--size-${size} sf-upload-progress--${state} flex items-main-start items-cross-start"
                data-index=${String(index)}
        >
            <i class="sf-icon">${icon}</i>
            <div class="sf-upload-progress-content flex flex-col flex-1">
                <div class="sf-upload-progress-top flex content-main-between">
                    <div class="sf-upload-progress-left flex flex-col">
                        <div class="sf-upload-progress-name">${name}</div>
                        <div class="sf-upload-progress-text">${fileSize}</div>
                    </div>

                    ${state === 'done' ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class="sf-icon sf-icon-solid">check_circle</i>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                                <button
                                        type="button"
                                        class="sf-icon-button sf-icon-button--icon sf-icon-button--on-surface sf-icon-button--link sf-icon-button--size-${size} flex items-cross-center content-main-center self-cross-start"
                                        data-action="remove"
                                >
                                    <i class="sf-icon">delete</i>
                                </button>
                            `}
                </div>

                ${state === 'error' ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                            <button
                                    type="button"
                                    class="sf-upload-progress-repeat self-cross-start"
                                    data-action="retry"
                            >
                                ${errorMessage}
                            </button>
                        ` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                            <sf-progress-bar
                                    size=${size}
                                    value=${String(progress)}
                                    text-position="inline-end"
                            ></sf-progress-bar>
                        `}
            </div>
        </div>
    `;
}

function renderFileUploadTemplate(context) {
  const size = normalizeSize(context.size);
  const rootClasses = ['sf-file-upload', `sf-file-upload--size-${size}`, context.disabled ? 'disabled' : '', 'flex', 'flex-col', 'items-cross-center', 'cursor-pointer', context.rootClass].filter(Boolean);
  const featuredIconClasses = ['sf-featured-icon', `sf-featured-icon--size-${size}`, 'sf-featured-icon--soft', 'sf-featured-icon--circle', 'sf-featured-icon--neutral'].join(' ');
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div
                class=${rootClasses.join(' ')}
                style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                data-render-managed="1"
                data-accept=${context.accept || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                data-multiple=${context.multiple ? 'true' : 'false'}
                ?multiple=${context.multiple}
                ?disabled=${context.disabled}
                aria-label=${context.ariaLabel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        >
            <div class=${featuredIconClasses}>
                <i class="sf-icon">${context.icon}</i>
            </div>

            <div class="sf-file-upload-bottom flex flex-col items-cross-center">
                <div class="sf-file-upload-block flex">
                    <div class="sf-file-upload-block-text">
                        <span class="sf-file-upload-link">${context.linkText}</span>
                        ${context.text ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)` ${context.text}` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    </div>
                </div>

                ${context.supportingText ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-file-upload-text">${context.supportingText}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            </div>
        </div>

        <div class="sf-file-upload-files grid grid-col-1 gap-1 w-full">
            ${Array.isArray(context.items) ? context.items.map((item, index) => renderUploadItem(item, size, index, context.retryText)) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
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
/******/ 	let __webpack_exports__ = __webpack_require__("4a441273c368");
/******/
/******/ })()
;