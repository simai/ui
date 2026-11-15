/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "e6d86f2cd058"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FIELD_LADDER: () => (/* binding */ FIELD_LADDER),
/* harmony export */   FIELD_SIZES: () => (/* binding */ FIELD_SIZES),
/* harmony export */   INPUT_SIZES: () => (/* binding */ INPUT_SIZES),
/* harmony export */   RETIRED_FIELD_SIZES: () => (/* binding */ RETIRED_FIELD_SIZES),
/* harmony export */   fieldSize: () => (/* binding */ fieldSize),
/* harmony export */   inputSize: () => (/* binding */ inputSize),
/* harmony export */   ladderSize: () => (/* binding */ ladderSize),
/* harmony export */   nearestFieldSize: () => (/* binding */ nearestFieldSize),
/* harmony export */   retireFieldSizeClass: () => (/* binding */ retireFieldSizeClass)
/* harmony export */ });
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d3818183b14c");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_0__);
// Form fields come in three sizes. 1/3 and 3 were retired: no consumer used
// them, and they could not hold a field's own pictures, tags and targets. A
// page written for a retired size keeps rendering at the nearest kept size, and
// says so once in the console so the markup can be updated.
//
// The fields of the field ladder below are the exception: they stand on all
// five steps, as sf-input does.

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
} // The field ladder (fields ladder, 2026-11-14): one height per step for every
// field that stands on it, the control ladder sf-button and sf-button-icon
// stand on (--sf-ui-<size>--control-height: 28 / 32 / 40 / 48 / 56 on a
// desktop). A text field kept the outer steps first (actions block item 4,
// 2026-11-08: a toolbar search or a hero search stands beside buttons of 1/3
// and 3); sf-input-lookup, -quantity, -date, -code, -color and -country drew
// 32 / 48 or 40 at 1/3 and 3 beside it, so they take the same five steps and
// the stylesheets size their parts from the same steps
// (component/inputs/scss/_field-ladder.scss). The other fields (textarea,
// dropdown, file upload, image, rich text) keep the three sizes for now.

const FIELD_LADDER = Object.freeze(['1/3', ...FIELD_SIZES, '3']);
const INPUT_SIZES = FIELD_LADDER;
/** A size on the field ladder: one of the five steps, else the fallback. */

function ladderSize(value, fallback = '1') {
  const size = String(value ?? '').trim().toLowerCase();
  return FIELD_LADDER.includes(size) ? size : fallback;
}
function inputSize(value, fallback = '1') {
  return ladderSize(value, fallback);
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
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "c43efa1014a6"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ITEM_STATES: () => (/* binding */ ITEM_STATES),
/* harmony export */   bindFileUpload: () => (/* binding */ bindFileUpload),
/* harmony export */   clearFileUpload: () => (/* binding */ clearFileUpload),
/* harmony export */   describeUploadItem: () => (/* binding */ describeUploadItem),
/* harmony export */   formatAcceptWords: () => (/* binding */ formatAcceptWords),
/* harmony export */   getFileUploadItems: () => (/* binding */ getFileUploadItems),
/* harmony export */   initExistingFileUploads: () => (/* binding */ initExistingFileUploads),
/* harmony export */   normalizeItemState: () => (/* binding */ normalizeItemState),
/* harmony export */   retryFileUploadItem: () => (/* binding */ retryFileUploadItem),
/* harmony export */   setFileUploadItems: () => (/* binding */ setFileUploadItems),
/* harmony export */   takeFiles: () => (/* binding */ takeFiles),
/* harmony export */   unbindFileUpload: () => (/* binding */ unbindFileUpload)
/* harmony export */ });
/* harmony import */ var _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d7f974466839");
/* harmony import */ var _register_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("58661bec99a6");
/* harmony import */ var _field_size__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("e6d86f2cd058");
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("43090d1c8307");
/* harmony import */ var _core_js_format_file_size_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("c016c43b1452");
/* harmony import */ var _core_js_composition_file_size_mjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("fb0bdf7719f0");
/* harmony import */ var _intake_mjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("ab7ec7cd175d");
/* harmony import */ var _lang_index_mjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("a5334b2b6512");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_field_size__WEBPACK_IMPORTED_MODULE_2__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_3__, _core_js_format_file_size_js__WEBPACK_IMPORTED_MODULE_4__, _core_js_composition_file_size_mjs__WEBPACK_IMPORTED_MODULE_5__]);
([_field_size__WEBPACK_IMPORTED_MODULE_2__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_3__, _core_js_format_file_size_js__WEBPACK_IMPORTED_MODULE_4__, _core_js_composition_file_size_mjs__WEBPACK_IMPORTED_MODULE_5__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__);






 // The words live in the component's language files (localization study LC-4):
// one place for every language, as the Smart components keep them.

 // Every word this part says. A product adds a language with
// SF.language.register('sf-file-upload', code, words); a ternary on «ru» allowed two
// and no more.

const FILE_UPLOAD_ITEM_TEXT = {
  en: _lang_index_mjs__WEBPACK_IMPORTED_MODULE_7__["default"].en,
  ru: _lang_index_mjs__WEBPACK_IMPORTED_MODULE_7__["default"].ru
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
} // An entry's state: ready (chosen, not sent), process (being sent), done,
// error. A chosen file was process at 0 % at once and looked like an upload
// that had stuck (FU-3); it is ready until the host or the uploader sends it.


const ITEM_STATES = Object.freeze(['ready', 'process', 'done', 'error']);

function normalizeItemState(item, fallback = 'process') {
  const state = String(item?.state || item?.status || fallback).toLowerCase();
  return ITEM_STATES.includes(state) ? state : 'process';
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

  let next = root.nextElementSibling;
  if (next?.classList?.contains('sf-file-upload-message')) next = next.nextElementSibling;

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
} // A limit in bytes or files, from data-<name> or <name>: a positive number, or
// none (FU-8). Each page wrote its own check (sf-chat-composer in ui-pro too).


function getLimit(root, name) {
  const key = name.replace(/-([a-z])/gu, (_, letter) => letter.toUpperCase());
  return (0,_intake_mjs__WEBPACK_IMPORTED_MODULE_6__.positiveLimit)(root.dataset[key] ?? root.getAttribute(name));
}

function itemBytes(item) {
  const bytes = Number(item?.file?.size ?? item?.size);
  return Number.isFinite(bytes) && bytes > 0 ? bytes : 0;
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
    previous.managedDisabled = disabled; // Remove and Retry are named with their file: three rows said «Удалить»
    // three times, and the retry button said only its word (FU-10).

    const currentLabel = button.getAttribute('aria-label');

    if (!button.hasAttribute('aria-labelledby') && (!currentLabel || currentLabel === previous.label)) {
      const name = button.closest('.sf-upload-progress')?.querySelector('.sf-upload-progress-name')?.textContent?.trim() || '';
      const word = button.dataset.action === 'retry' ? button.textContent.trim() || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageText)(FILE_UPLOAD_ITEM_TEXT, 'retry', root, 'sf-file-upload') : (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageText)(FILE_UPLOAD_ITEM_TEXT, 'remove', root, 'sf-file-upload');
      const label = `${word} ${name}`.trim();
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
    const name = item.querySelector('.sf-upload-progress-name')?.textContent?.trim() || ''; // The name has its place in the words ({name}), so a language that puts
    // it first can (C177 (9)).

    const label = name ? (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageText)(FILE_UPLOAD_ITEM_TEXT, 'uploading-name', root, 'sf-file-upload').replace('{name}', name) : (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageText)(FILE_UPLOAD_ITEM_TEXT, 'uploading', root, 'sf-file-upload');
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
} // What a row says, from its item: the same for the class row and the Smart
// template, so the two draw one row.
//   ready    name, size; Remove                      (FU-3)
//   process  name, size; Remove; the bar
//   done     name, «size · загружен», the check; Remove   (FU-4: it had no
//            way out and kept its 100 % bar)
//   error    name, «Не загрузился: <message>»; Remove; «Повторить»   (FU-5:
//            the message was the retry button's label, so the reason was the
//            thing a person pressed to send the same file again)
// `progress: null` is a transfer whose share is not known yet: the bar runs
// without a number. A missing progress reads 100 on done and 0 otherwise.


function describeUploadItem(item, owner = null, fallbackState = 'process') {
  const state = normalizeItemState(item, fallbackState);
  const name = String(item?.name || item?.fileName || 'File');
  const size = String(item?.fileSize || item?.sizeText || '');
  const raw = item?.progress;
  const progress = raw === null ? null : Math.max(0, Math.min(100, Number(raw ?? (state === 'done' ? 100 : 0)) || 0));
  const message = String(item?.errorMessage || item?.error || '');
  let line = size;
  if (state === 'done') line = size ? fileUploadWord(owner, 'done-line', {
    vars: {
      size
    }
  }) : fileUploadWord(owner, 'done');else if (state === 'error') line = message ? fileUploadWord(owner, 'error-line', {
    vars: {
      message
    }
  }) : fileUploadWord(owner, 'error');
  return {
    state,
    name,
    size,
    line,
    message,
    progress,
    icon: uploadItemIcon(item, state),
    retryText: String(item?.retryText || fileUploadWord(owner, 'retry'))
  };
} // A row's glyph says what the file is (C81: a type icon where there is no
// thumbnail): the core file icons by media type, the type guessed from the
// extension when the item has none, a plain file otherwise; an error row
// shows the error glyph. It was cloud_upload in every state, in the primary
// colour, outside the three icon roles (FU-12).


const EXTENSION_TYPES = Object.freeze({
  pdf: 'application/pdf',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
  svg: 'image/svg+xml',
  heic: 'image/heic',
  avif: 'image/avif',
  mp4: 'video/mp4',
  mov: 'video/quicktime',
  webm: 'video/webm',
  mkv: 'video/x-matroska',
  mp3: 'audio/mpeg',
  wav: 'audio/wav',
  ogg: 'audio/ogg',
  m4a: 'audio/mp4',
  zip: 'application/zip',
  rar: 'application/vnd.rar',
  '7z': 'application/x-7z-compressed',
  gz: 'application/gzip',
  tar: 'application/x-tar',
  csv: 'text/csv',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ods: 'application/vnd.oasis.opendocument.spreadsheet',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  odp: 'application/vnd.oasis.opendocument.presentation',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  odt: 'application/vnd.oasis.opendocument.text',
  rtf: 'application/rtf',
  txt: 'text/plain',
  md: 'text/markdown'
});

function uploadItemIcon(item, state) {
  if (item?.icon) return String(item.icon);
  if (state === 'error') return 'error';
  const name = String(item?.name || item?.fileName || item?.file?.name || '');
  const extension = name.includes('.') ? name.split('.').pop().toLowerCase() : '';
  const type = String(item?.file?.type || item?.mime || EXTENSION_TYPES[extension] || '');
  const icon = (0,_core_js_composition_file_size_mjs__WEBPACK_IMPORTED_MODULE_5__.fileIcon)(type);
  return icon === 'download' ? 'draft' : icon;
}

function createUploadProgressItem(item, size = '1', owner = null) {
  const normalizedSize = normalizeSize(size);
  const row = describeUploadItem(item, owner, 'done');
  const {
    state,
    progress
  } = row;
  const root = document.createElement('div');
  root.className = ['sf-upload-progress', `sf-upload-progress--size-${normalizedSize}`, `sf-upload-progress--${state}`, 'flex', 'items-main-start', 'items-cross-start'].join(' ');
  const leftIcon = document.createElement('i');
  leftIcon.classList.add('sf-icon'); // The glyphs are pictures: their ligature names («cloud_upload», «check_circle»,
  // «delete») were read as text (docs pre-check 2026-11-10 FU-03).

  leftIcon.setAttribute('aria-hidden', 'true');
  leftIcon.textContent = row.icon;
  const content = document.createElement('div');
  content.className = 'sf-upload-progress-content flex flex-col flex-1';
  const top = document.createElement('div');
  top.className = 'sf-upload-progress-top flex content-main-between';
  const left = document.createElement('div');
  left.className = 'sf-upload-progress-left flex flex-col';
  const nameNode = document.createElement('div');
  nameNode.className = 'sf-upload-progress-name';
  nameNode.textContent = row.name;
  const textNode = document.createElement('div');
  textNode.className = 'sf-upload-progress-text';
  textNode.textContent = row.line;
  left.append(nameNode, textNode);
  top.append(left);

  if (state === 'done') {
    const doneIcon = document.createElement('i');
    doneIcon.className = 'sf-icon sf-icon-solid sf-upload-progress-mark';
    doneIcon.setAttribute('aria-hidden', 'true');
    doneIcon.textContent = 'check_circle';
    top.append(doneIcon);
  } // Every state can be taken out of the list.


  const removeButton = document.createElement('button');
  removeButton.type = 'button';
  removeButton.className = `sf-icon-button sf-icon-button--icon sf-icon-button--on-surface sf-icon-button--link sf-icon-button--size-${normalizedSize} flex items-cross-center content-main-center self-cross-start`;
  removeButton.dataset.action = 'remove';
  const removeIcon = document.createElement('i');
  removeIcon.className = 'sf-icon';
  removeIcon.setAttribute('aria-hidden', 'true');
  removeIcon.textContent = 'delete';
  removeButton.append(removeIcon);
  top.append(removeButton);
  content.append(top);

  if (state === 'error') {
    const retry = document.createElement('button');
    retry.type = 'button';
    retry.className = 'sf-upload-progress-repeat self-cross-start';
    retry.dataset.action = 'retry';
    retry.textContent = row.retryText;
    content.append(retry);
  } // A chosen file that is not being sent, and a sent one, have no bar: there
  // is no transfer to show (FU-3, FU-4).


  if (state === 'process') {
    const progressBar = document.createElement('div');
    progressBar.className = `sf-progress-bar sf-progress-bar--size-${normalizedSize} flex flex-row items-cross-center`;
    if (progress === null) progressBar.dataset.indeterminate = 'true';else progressBar.dataset.value = String(progress);
    progressBar.dataset.textPosition = 'inline-end';
    const progressMain = document.createElement('div');
    progressMain.className = 'sf-progress-bar-main';
    const progressValue = document.createElement('div');
    progressValue.className = 'sf-progress-bar-progress transition';
    if (progress !== null) progressValue.style.width = `${progress}%`;
    const progressText = document.createElement('div');
    progressText.className = 'sf-progress-bar-text';
    progressText.textContent = progress === null ? '' : `${progress}%`;
    progressMain.append(progressValue);
    progressBar.append(progressMain, progressText);
    content.append(progressBar);
  }

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
} // A chosen file's size is written by the core formatter in the page's
// language: «342 КБ» on a Russian page, «342 KB» on an English one (C25,
// docs pre-check 2026-11-10 FU-01). The part's own formatter wrote «342KB»
// in English units with no space on every page.


function normalizeFileItems(files = [], root = null) {
  return Array.from(files).map(file => ({
    id: `${file.name}-${file.size}-${file.lastModified}`,
    name: file.name,
    fileSize: (0,_core_js_format_file_size_js__WEBPACK_IMPORTED_MODULE_4__.formatFileSize)(file.size, {
      node: root
    }),
    state: 'ready',
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
  const currentItem = nextItems[normalizedIndex]; // Back in process with its share not known yet: the bar runs without a
  // number until the transfer reports one. It went to 0 % and stood there,
  // which read as a second failure when nothing sent the file again (FU-11);
  // sf-file-upload's uploader sends it, an ordinary area's page answers
  // retry.

  currentItem.state = 'process';
  currentItem.progress = null;
  delete currentItem.errorMessage;
  delete currentItem.error;
  delete currentItem.reason;
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
} // A choice adds to the list on a multiple area, so files can be added in
// portions; a file already listed (same name, size and time) is not listed
// twice. A single area keeps one file: a new choice replaces it, and the
// replaced entry leaves with remove {reason: 'replaced'}. The choice assigned
// the new files over the list, so a second pick wiped the first (study
// 2026-11-11 FU-1). Returns the entries that entered the list.


function applySelectedFiles(root, files = [], source = 'input') {
  const chosen = normalizeFileItems(files, root);
  const previousItems = Array.from(root.__sfFileUploadItems || []);
  const multiple = getMultiple(root);
  const listed = new Set(previousItems.map((item, index) => getItemEventKey(item, index)));
  const added = multiple ? chosen.filter((item, index) => !listed.has(item.id) && chosen.findIndex(other => other.id === item.id) === index) : chosen.slice(0, 1);
  if (!added.length) return [];
  const replaced = multiple ? [] : previousItems;
  const nextFiles = multiple ? [...previousItems, ...added] : added;
  root.__sfFileUploadItems = nextFiles;
  renderFileUploadItems(root, nextFiles);
  syncFileUploadStateEvents(root, nextFiles, previousItems);
  replaced.forEach((item, index) => {
    root.dispatchEvent(new CustomEvent('sf-file-upload:remove', {
      bubbles: true,
      detail: {
        item,
        index,
        items: nextFiles,
        reason: 'replaced'
      }
    }));
  });
  added.forEach(item => {
    emitFileUploadItemAdd(root, item, nextFiles.indexOf(item), nextFiles, source);
  });
  emitSelect(root, added, source);
  return added;
}

function fileUploadWord(root, key, options = {}) {
  return (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageWord)(FILE_UPLOAD_ITEM_TEXT, key, root, {
    component: 'sf-file-upload',
    ...options
  });
} // The formats an accept list names, as people read them: «PDF, DOCX»,
// «изображения». `type/*` is the kind's word; it wrote «*» before.
// The names are the core's (intake.mjs): image/jpeg reads «JPG», image/svg+xml
// «SVG».


function formatAcceptWords(accept, root = null) {
  return (0,_intake_mjs__WEBPACK_IMPORTED_MODULE_6__.acceptFormats)(accept, kind => fileUploadWord(root, `formats-${kind}`));
} // Where a file that was not added is said: the line under the area (C81: the
// message under the field, not a row in the list), a polite status a screen
// reader announces. The Smart template draws it; an ordinary area gets one
// after it on the first rejection.


function getMessage(root, create = false) {
  if (!root) return null;
  const next = root.nextElementSibling;
  if (next?.classList?.contains('sf-file-upload-message')) return next;
  if (!create || isManagedRenderRoot(root) || typeof document === 'undefined' || typeof root.after !== 'function') return null;
  const message = document.createElement('div');
  message.className = 'sf-file-upload-message';
  message.setAttribute('role', 'status');
  message.hidden = true;
  root.after(message);
  return message;
}

function showFileUploadRejections(root, rejected = []) {
  const message = getMessage(root, rejected.length > 0);
  root.__sfFileUploadRejected = rejected;
  if (!message) return;
  message.replaceChildren();
  message.hidden = !rejected.length;
  if (!rejected.length) return;

  if (rejected.length === 1) {
    message.textContent = rejected[0].message;
    return;
  }

  const head = document.createElement('span');
  head.textContent = fileUploadWord(root, 'not-added', {
    count: rejected.length
  });
  const list = document.createElement('ul');
  rejected.forEach(entry => {
    const line = document.createElement('li');
    line.textContent = entry.message;
    list.append(line);
  });
  message.append(head, list);
} // What a choice or a drop leaves out, and why: a type the accept list does
// not name (on a pick too: the dialog's «All files» skipped the filter), a
// second file on a single area, a file already listed. The drop took the
// first file and said nothing of the rest (FU-6); a wrong type sent
// rejected and showed nothing (FU-7). Each one is said under the area and in
// reject {files, rejected: [{file, name, reason, message}], accept, source}.


function takeFiles(root, files = [], source = 'input') {
  const accept = getAccept(root);
  const multiple = getMultiple(root);
  const kept = multiple ? Array.from(root.__sfFileUploadItems || []) : [];
  const listed = new Set(kept.map((item, index) => getItemEventKey(item, index)));
  const maxSize = getLimit(root, 'max-size');
  const minSize = getLimit(root, 'min-size');
  const maxFiles = multiple ? getLimit(root, 'max-files') : 0;
  const maxTotal = getLimit(root, 'max-total-size');

  const size = bytes => (0,_core_js_format_file_size_js__WEBPACK_IMPORTED_MODULE_4__.formatFileSize)(bytes, {
    node: root
  });

  let count = kept.length;
  let total = kept.reduce((sum, item) => sum + itemBytes(item), 0);
  const accepted = [];
  const rejected = [];
  Array.from(files).forEach(file => {
    const name = String(file?.name || '');
    const key = `${file?.name}-${file?.size}-${file?.lastModified}`;
    const bytes = Number(file?.size) || 0;
    let reason = '';
    let vars = {
      name
    };
    let words = {};
    const own = (0,_intake_mjs__WEBPACK_IMPORTED_MODULE_6__.fileRejection)(file, {
      accept,
      maxSize,
      minSize
    });
    if (!multiple && accepted.length) reason = 'one';else if (listed.has(key)) reason = 'duplicate';else if (own === 'type') {
      reason = 'type';
      vars = {
        name,
        formats: formatAcceptWords(accept, root)
      };
    } else if (own === 'empty') reason = 'empty';else if (own === 'size') {
      reason = 'size';
      vars = {
        name,
        size: size(bytes),
        max: size(maxSize)
      };
    } else if (own === 'min-size') {
      reason = 'min-size';
      vars = {
        name,
        size: size(bytes),
        min: size(minSize)
      };
    } else if (maxFiles && count >= maxFiles) {
      reason = 'count';
      words = {
        count: maxFiles
      };
    } else if (maxTotal && total + bytes > maxTotal) {
      reason = 'total';
      vars = {
        name,
        max: size(maxTotal)
      };
    }

    if (reason) {
      rejected.push({
        file,
        name,
        reason: reason === 'one' ? 'count' : reason,
        message: fileUploadWord(root, `reject-${reason}`, {
          vars,
          ...words
        })
      });
      return;
    }

    listed.add(key);
    count += 1;
    total += bytes;
    accepted.push(file);
  });
  showFileUploadRejections(root, rejected);

  if (rejected.length) {
    root.dispatchEvent(new CustomEvent('sf-file-upload:reject', {
      bubbles: true,
      detail: {
        files: rejected.map(entry => entry.file),
        rejected,
        accept,
        source
      }
    }));
  }

  return accepted.length ? applySelectedFiles(root, accepted, source) : [];
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
    takeFiles(root, files, 'input');
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
    const added = takeFiles(root, files, 'drop');
    if (!added.length) return; // A pick sends change from the native input; a drop sent none, so a form
    // listening for change never heard of a dropped file.

    root.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      detail: {
        files: added.map(item => item.file),
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
  const root = target instanceof HTMLElement ? target.closest(FILE_UPLOAD_SELECTOR) || target : null;
  if (root) showFileUploadRejections(root, []);
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
    const wrapper = document.createElement('div'); // The list keeps its distance from the area itself (FU-12), the same
    // inside this wrapper and under a Smart host.

    wrapper.className = 'sf-file-upload-wrap flex flex-col';
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
    glyph.setAttribute('aria-hidden', 'true');
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
    const message = document.createElement('div');
    message.className = 'sf-file-upload-message';
    message.setAttribute('role', 'status');
    message.hidden = true;
    const files = document.createElement('div');
    files.className = 'sf-file-upload-files grid grid-col-1 gap-1 w-full';
    wrapper.append(root, message, files);
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

/***/ "e577837dd70a"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   calendarDayOffset: () => (/* binding */ calendarDayOffset),
/* harmony export */   formatDate: () => (/* binding */ formatDate),
/* harmony export */   knownTimeZone: () => (/* binding */ knownTimeZone),
/* harmony export */   msUntilNextDay: () => (/* binding */ msUntilNextDay),
/* harmony export */   timeZoneOffset: () => (/* binding */ timeZoneOffset),
/* harmony export */   toDate: () => (/* reexport safe */ _format_intl_js__WEBPACK_IMPORTED_MODULE_0__.toDate)
/* harmony export */ });
/* harmony import */ var _format_intl_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("15b4e93ff6ed");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_format_intl_js__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
_format_intl_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
// Dates in the page's language: formatDate, the calendar day offset and the
// next midnight, with no top-level side effects (format-intl.js). The same
// functions as core/js/format.js and SF.format; relative days and times are
// format-relative.js, so a bundle that writes a date does not carry them.


const DAY_MS = 86400000;

function hasDateStyle(style) {
  return style === 'short' || style === 'medium' || style === 'long' || style === 'full';
}
/**
 * A date, a time or both in the locale.
 *
 *   formatDate(at)                          3 нояб. 2026 г.  /  Nov 3, 2026
 *   formatDate(at, {date: 'short'})         03.11.2026       /  11/3/26
 *   formatDate(at, {date: 'long'})          3 ноября 2026 г. /  November 3, 2026
 *   formatDate(at, {time: 'short'})         3 нояб. 2026 г., 14:05
 *   formatDate(at, {date: null, time: 'short'})   14:05   /  2:05 PM
 *
 * `date` and `time` are Intl styles (short, medium, long, full); `intl` gives
 * Intl.DateTimeFormat options outright, for a form the styles do not name (a
 * chart's tick, «14:05» with two-digit hours). `timeZone` (an IANA name,
 * Europe/Moscow) writes the moment on that zone's clock instead of the
 * reader's (owner decision C183 (3): a product that knows the person's zone).
 * Anything that is not a date is `gap`, '' by default.
 */


function formatDate(value, {
  date = 'medium',
  time = null,
  intl = null,
  timeZone = '',
  gap = '',
  ...where
} = {}) {
  const moment = (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.toDate)(value);
  if (!moment) return gap;
  let options = intl;

  if (!options) {
    options = {};
    if (hasDateStyle(date)) options.dateStyle = date;
    if (hasDateStyle(time)) options.timeStyle = time;
    if (!options.dateStyle && !options.timeStyle) options.dateStyle = 'medium';
  }

  if (knownTimeZone(timeZone)) options = { ...options,
    timeZone
  };
  return (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.intlFormatter)('DateTimeFormat', (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.formatLocale)(where), options).format(moment);
}
/**
 * Whether the platform knows an IANA time zone name (Europe/Moscow, UTC). An
 * empty or unknown name is the reader's own zone everywhere here.
 */

function knownTimeZone(timeZone) {
  const name = String(timeZone ?? '').trim();
  if (!name) return false;
  const root = typeof globalThis !== 'undefined' ? globalThis : {};
  if (!(root.__sfTimeZones instanceof Map)) root.__sfTimeZones = new Map();
  if (root.__sfTimeZones.has(name)) return root.__sfTimeZones.get(name);
  let known = true;

  try {
    new Intl.DateTimeFormat('en', {
      timeZone: name
    });
  } catch {
    known = false;
  }

  if (root.__sfTimeZones.size < 64) root.__sfTimeZones.set(name, known);
  return known;
} // The calendar date and the clock of a moment in a zone, as numbers: the
// reader's own when the zone is none.

function wallClock(moment, timeZone) {
  if (!knownTimeZone(timeZone)) {
    return {
      year: moment.getFullYear(),
      month: moment.getMonth(),
      day: moment.getDate(),
      hour: moment.getHours(),
      minute: moment.getMinutes(),
      second: moment.getSeconds()
    };
  }

  const parts = {};

  for (const part of (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.intlFormatter)('DateTimeFormat', 'en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  }).formatToParts(moment)) {
    if (part.type !== 'literal') parts[part.type] = Number(part.value);
  }

  return {
    year: parts.year,
    month: parts.month - 1,
    day: parts.day,
    hour: parts.hour % 24,
    minute: parts.minute,
    second: parts.second
  };
}
/**
 * The zone's offset from UTC at a moment, in minutes (Moscow +180, New York
 * -300 in winter); the reader's own when the zone is none.
 */


function timeZoneOffset(value, {
  timeZone = ''
} = {}) {
  const moment = (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.toDate)(value);
  if (!moment) return Number.NaN;
  if (!knownTimeZone(timeZone)) return -moment.getTimezoneOffset();
  const clock = wallClock(moment, timeZone);
  const asUtc = Date.UTC(clock.year, clock.month, clock.day, clock.hour, clock.minute, clock.second);
  return Math.round((asUtc - Math.floor(moment.getTime() / 1000) * 1000) / 60000);
}
/**
 * Calendar days from `now` to the value in the reader's time zone (or
 * `timeZone`'s): 0 today, -1 yesterday, 1 tomorrow; NaN when the value is no
 * date. Counted on calendar dates, not 24-hour spans, so 23:59 yesterday is
 * -1 at 00:01 and a day of a clock change is still one day.
 */

function calendarDayOffset(value, {
  now = new Date(),
  timeZone = ''
} = {}) {
  const moment = (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.toDate)(value);
  const today = (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.toDate)(now);
  if (!moment || !today) return Number.NaN;
  const at = wallClock(moment, timeZone);
  const from = wallClock(today, timeZone);
  const day = Date.UTC(at.year, at.month, at.day);
  const base = Date.UTC(from.year, from.month, from.day);
  return Math.round((day - base) / DAY_MS);
}
/**
 * Milliseconds from `now` to the reader's next midnight, when every relative
 * day on the screen moves by one. A component that shows them sets a timer
 * for this long (plus a second's margin, so it wakes in the new day) and
 * draws them again; «сегодня» said yesterday is wrong by morning.
 */

function msUntilNextDay(now = new Date(), {
  timeZone = ''
} = {}) {
  const today = (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.toDate)(now) ?? new Date();

  if (!knownTimeZone(timeZone)) {
    const next = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    return next.getTime() - today.getTime();
  } // In a named zone: the time left on its clock until 24:00, corrected by a
  // change of its offset before then (a clock change at night).


  const clock = wallClock(today, timeZone);
  const left = DAY_MS - ((clock.hour * 60 + clock.minute) * 60 + clock.second) * 1000 - today.getMilliseconds();
  const shift = timeZoneOffset(today, {
    timeZone
  }) - timeZoneOffset(new Date(today.getTime() + left), {
    timeZone
  });
  return Math.max(1, left + shift * 60000);
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "c016c43b1452"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FILE_SIZE_UNITS: () => (/* binding */ FILE_SIZE_UNITS),
/* harmony export */   fileSizeUnits: () => (/* binding */ fileSizeUnits),
/* harmony export */   formatFileSize: () => (/* binding */ formatFileSize)
/* harmony export */ });
/* harmony import */ var _format_intl_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("15b4e93ff6ed");
/* harmony import */ var _lang_file_size_index_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("4294700087dc");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_format_intl_js__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
_format_intl_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
// File sizes in the page's language («1,4 МБ»), with no top-level side
// effects (format-intl.js). The same functions as core/js/format.js,
// composition/file-size.mjs and SF.format.fileSize.
 // The four words of a size live in core's language files
// (core/js/lang/file-size, localization study LC-3): ru and en ship; any
// other language takes the words a product registers for `sf-file-size`
// (SF.language.register('sf-file-size', 'de', {b, kb, mb, gb})), else the
// English words with its own digits. A component with words of its own passes
// them as `units`. The registry is read from the shared global the page
// language keeps (core/js/page-language.js), so this module still runs
// nothing on load.


const UNIT_KEYS = /* @__PURE__ */Object.freeze(['b', 'kb', 'mb', 'gb']);

function unitsOf(words) {
  return Object.freeze(UNIT_KEYS.map(key => words[key]));
}

const FILE_SIZE_UNITS = /* @__PURE__ */Object.freeze({
  en: /* @__PURE__ */unitsOf(_lang_file_size_index_mjs__WEBPACK_IMPORTED_MODULE_1__["default"].en),
  ru: /* @__PURE__ */unitsOf(_lang_file_size_index_mjs__WEBPACK_IMPORTED_MODULE_1__["default"].ru)
});

function registeredUnits(code) {
  const words = globalThis.__sfPageLanguage?.registered?.get?.('sf-file-size')?.get?.(code);
  return words && UNIT_KEYS.every(key => typeof words[key] === 'string') ? unitsOf(words) : null;
}
/** The unit words for a locale: registered for it, its own, its language's, else English. */


function fileSizeUnits(locale = 'en') {
  const wanted = String(locale || 'en').trim().toLowerCase().replace('_', '-');

  for (const code of [...new Set([wanted, wanted.split('-')[0]])]) {
    const units = registeredUnits(code) ?? (Object.hasOwn(FILE_SIZE_UNITS, code) ? FILE_SIZE_UNITS[code] : null);
    if (units) return units;
  }

  return registeredUnits('en') ?? FILE_SIZE_UNITS.en;
}
/**
 * A size as people read it: «512 Б», «2 КБ», «1,4 МБ», «12 GB». Binary steps
 * of 1024; one digit after the point under ten of a unit, none above it or in
 * bytes. Text a host already formatted is returned as it came; anything that
 * is not a size is ''.
 *
 *   formatFileSize(size, {node, units?, locale?})
 *   formatFileSize(size, units, locale)   -- the form composition/file-size.mjs
 *                                            and sf-image-field 1.x published
 */

function formatFileSize(size, options = {}, legacyLocale) {
  const where = Array.isArray(options) ? {
    units: options,
    locale: legacyLocale ?? 'en'
  } : options ?? {};
  if (typeof size === 'string') return size;
  const bytes = Number(size);
  if (size === null || size === undefined || !Number.isFinite(bytes) || bytes < 0) return '';
  const locale = (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.formatLocale)(where);
  const units = where.units?.length ? where.units : fileSizeUnits(locale);
  let amount = bytes;
  let index = 0;

  while (amount >= 1024 && index < units.length - 1) {
    amount /= 1024;
    index += 1;
  }

  const digits = index === 0 || amount >= 10 ? 0 : 1;
  return `${(0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.intlFormatter)('NumberFormat', locale, {
    maximumFractionDigits: digits
  }).format(amount)} ${units[index]}`;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "15b4e93ff6ed"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   formatLocale: () => (/* binding */ formatLocale),
/* harmony export */   intlFormatter: () => (/* binding */ intlFormatter),
/* harmony export */   toDate: () => (/* binding */ toDate)
/* harmony export */ });
/* harmony import */ var _page_language_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("43090d1c8307");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_page_language_js__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
_page_language_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var _page_language_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_page_language_js__WEBPACK_IMPORTED_MODULE_0__);
// The part every format module shares (core/js/format.js says what the
// helpers are): the locale a call formats in, a Date from what a host gives,
// and the Intl formatters, kept on a global every copy of these modules shares
// (bundles each carry their own module copy; page-language.js says why).
//
// No top-level side effects, here or in format-number.js, format-date.js,
// format-relative.js and format-file-size.js (ui-chart, 2026-11-05): a bundle
// that imports one function carries that function and what it calls, nothing
// else. The global is made on the first format, not on load, and SF.format is
// published by core's entry (index.js, publishFormat in format.js).

/** The locale a call formats in: the one it names, else its node's page language. */

function formatLocale({
  locale,
  node
} = {}) {
  return String(locale || '').trim() || (0,_page_language_js__WEBPACK_IMPORTED_MODULE_0__.pageLocale)(node);
}
/** A Date from a Date, a time in milliseconds or a date string; null when it is none. */

function toDate(value) {
  if (value === null || value === undefined || value === '') return null;
  const date = value instanceof Date ? new Date(value.getTime()) : new Date(typeof value === 'string' && /^\d+$/u.test(value) ? Number(value) : value);
  return Number.isNaN(date.getTime()) ? null : date;
} // The formatters every copy shares, made on the first call.

function formatterCache() {
  const root = typeof globalThis !== 'undefined' ? globalThis : {};
  if (!root.__sfFormat) root.__sfFormat = {
    formatters: new Map()
  };
  return root.__sfFormat.formatters;
} // One formatter per kind, locale and options. An unknown locale falls back to
// the browser's, and options the platform refuses (an unknown unit or
// currency) to a plain number, so a typo in a page never throws at a reader.


function intlFormatter(kind, locale, options) {
  const key = `${kind}|${locale}|${JSON.stringify(options)}`;
  const cache = formatterCache();
  if (cache.has(key)) return cache.get(key);
  const Make = Intl[kind];
  let made;

  try {
    made = new Make(locale || undefined, options);
  } catch {
    try {
      made = new Make(undefined, options);
    } catch {
      made = new Make(locale || undefined, kind === 'NumberFormat' ? {
        maximumFractionDigits: 2
      } : {});
    }
  } // A page that formats in many locales does not grow the cache for ever.


  if (cache.size >= 256) cache.delete(cache.keys().next().value);
  cache.set(key, made);
  return made;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "c9ce0852ac73"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   formatNumber: () => (/* binding */ formatNumber),
/* harmony export */   numberOptions: () => (/* binding */ numberOptions)
/* harmony export */ });
/* harmony import */ var _format_intl_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("15b4e93ff6ed");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_format_intl_js__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
_format_intl_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
// Numbers in the page's language by a format word: formatNumber and
// numberOptions alone, with no top-level side effects (format-intl.js). The
// same functions as core/js/format.js and SF.format.number; a bundle that
// formats numbers only imports them from here.

/**
 * The Intl options of a number format word (ui-chart's words, kept so a page
 * writes a format as an attribute):
 *
 *   number (default)  1 234,5   as many digits as `step` needs, at most 6; 2 without one
 *   integer           1 235
 *   decimal-<n>       n digits after the point, always (0 to 20)
 *   percent           a share 0..1 as 12 %
 *   compact           1,2 тыс.  /  1.2K
 *   currency-<CODE>   1 234,50 ₽ (an ISO 4217 code)
 *   unit-<unit>       45,3 ГБ (an Intl unit: gigabyte, megabit-per-second)
 *
 * Anything else reads as number. Words join with a space: a kind (currency-,
 * unit-, percent) and a precision (integer, decimal-<n>, compact), so
 * «currency-RUB integer» is 1 235 ₽, «currency-RUB decimal-2» 1 234,50 ₽ and
 * «currency-RUB compact» 1,1 млн ₽. The precision wins whatever the order.
 */

function numberOptions(format = 'number', step = 0) {
  const words = String(format || 'number').trim().split(/\s+/u).filter(Boolean);

  if (words.length > 1) {
    const PRECISION = /^(?:integer|compact|decimal-\d{1,2})$/u;
    const kinds = words.filter(one => !PRECISION.test(one));
    const precision = words.filter(one => PRECISION.test(one));
    return [...kinds, ...precision].reduce((options, one) => ({ ...options,
      ...numberOptions(one, step)
    }), {});
  }

  const word = words[0] ?? 'number';
  if (word === 'integer') return {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  };
  if (word === 'percent') return {
    style: 'percent',
    maximumFractionDigits: 1
  };
  if (word === 'compact') return {
    notation: 'compact',
    maximumFractionDigits: 1
  };
  const decimal = /^decimal-(\d{1,2})$/u.exec(word);

  if (decimal) {
    const digits = Math.min(20, Number(decimal[1]));
    return {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits
    };
  }

  const unit = /^unit-([a-z]+(?:-per-[a-z]+)?)$/u.exec(word);
  if (unit) return {
    style: 'unit',
    unit: unit[1],
    unitDisplay: 'short',
    maximumFractionDigits: 1
  };
  const currency = /^currency-([A-Z]{3})$/u.exec(word);
  if (currency) return {
    style: 'currency',
    currency: currency[1]
  };
  const digits = step > 0 && step < 1 ? Math.min(6, Math.ceil(-Math.log10(step) - 1e-9)) : 2;
  return {
    maximumFractionDigits: digits
  };
}
/**
 * A number in the locale by a format word (numberOptions). `grouping: false`
 * writes it without thousands marks («2026»), `step` sets the digits of
 * `number`, and a value that is not a finite number is `gap`, '' by default
 * (a chart passes '—').
 */

function formatNumber(value, format = 'number', {
  step = 0,
  gap = '',
  grouping = true,
  ...where
} = {}) {
  const number = typeof value === 'string' && value.trim() !== '' ? Number(value) : value;
  if (typeof number !== 'number' || !Number.isFinite(number)) return gap;
  const options = numberOptions(format, step);
  if (grouping === false) options.useGrouping = false;
  return (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.intlFormatter)('NumberFormat', (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.formatLocale)(where), options).format(number);
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "ee5c3aad2640"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   formatRelativeDay: () => (/* binding */ formatRelativeDay),
/* harmony export */   formatRelativeTime: () => (/* binding */ formatRelativeTime)
/* harmony export */ });
/* harmony import */ var _format_intl_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("15b4e93ff6ed");
/* harmony import */ var _format_date_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("e577837dd70a");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_format_intl_js__WEBPACK_IMPORTED_MODULE_0__, _format_date_js__WEBPACK_IMPORTED_MODULE_1__]);
([_format_intl_js__WEBPACK_IMPORTED_MODULE_0__, _format_date_js__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
// Relative days and times in the page's language («вчера», «5 минут назад»),
// with no top-level side effects (format-intl.js). The same functions as
// core/js/format.js and SF.format.relativeDay / relativeTime.

 // The first letter in capitals, by the locale's rule («вчера» → «Вчера»).

function capitalise(text, locale) {
  const first = Array.from(text)[0] ?? '';
  return first ? first.toLocaleUpperCase(locale || undefined) + text.slice(first.length) : text;
}
/**
 * The day a moment fell on, as a list says it: «сегодня», «вчера», «завтра»,
 * the weekday within the last week («понедельник»), else the date («3 ноября»,
 * with the year when it is not this one). The words are the platform's for
 * the locale (Intl.RelativeTimeFormat, numeric auto); a component that ships
 * its own passes them (`today`, `yesterday`, `tomorrow`) and they win.
 * `weekday: false` goes from yesterday straight to the date; `capital: true`
 * starts the word with a capital, as a heading or a divider does.
 *
 * `timeZone` counts the days and writes them on that zone's clock.
 *
 * The answer changes at the reader's midnight: msUntilNextDay (format-date.js)
 * says when.
 */


function formatRelativeDay(value, {
  now = new Date(),
  today,
  yesterday,
  tomorrow,
  weekday = true,
  capital = false,
  timeZone = '',
  gap = '',
  ...where
} = {}) {
  const moment = (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.toDate)(value);
  if (!moment) return gap;
  const locale = (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.formatLocale)(where);
  const offset = (0,_format_date_js__WEBPACK_IMPORTED_MODULE_1__.calendarDayOffset)(moment, {
    now,
    timeZone
  });
  const zone = (0,_format_date_js__WEBPACK_IMPORTED_MODULE_1__.knownTimeZone)(timeZone) ? {
    timeZone
  } : {};
  const own = {
    0: today,
    [-1]: yesterday,
    1: tomorrow
  }[offset];
  let text;

  if (own) {
    text = String(own);
  } else if (offset >= -1 && offset <= 1) {
    text = (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.intlFormatter)('RelativeTimeFormat', locale, {
      numeric: 'auto'
    }).format(offset, 'day');
  } else if (weekday && offset < -1 && offset > -7) {
    text = (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.intlFormatter)('DateTimeFormat', locale, {
      weekday: 'long',
      ...zone
    }).format(moment);
  } else {
    const year = moment.getFullYear() === (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.toDate)(now).getFullYear() ? {} : {
      year: 'numeric'
    };
    text = (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.intlFormatter)('DateTimeFormat', locale, {
      day: 'numeric',
      month: 'long',
      ...year,
      ...zone
    }).format(moment);
  }

  return capital ? capitalise(text, locale) : text;
} // The largest unit a span reaches is the one it is said in (mail-letters'
// steps, 2026-10): 90 seconds is «2 минуты назад», 40 days «в прошлом месяце».

const RELATIVE_STEPS = [['year', 31536000], ['month', 2592000], ['week', 604800], ['day', 86400], ['hour', 3600], ['minute', 60]];
/** «5 минут назад», «через 2 часа»: a moment from `now`, in the locale. */

function formatRelativeTime(value, {
  now = new Date(),
  gap = '',
  ...where
} = {}) {
  const moment = (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.toDate)(value);
  const base = (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.toDate)(now);
  if (!moment || !base) return gap;
  const seconds = Math.round((moment.getTime() - base.getTime()) / 1000);
  const format = (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.intlFormatter)('RelativeTimeFormat', (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.formatLocale)(where), {
    numeric: 'auto'
  });

  for (const [unit, size] of RELATIVE_STEPS) {
    if (Math.abs(seconds) >= size) return format.format(Math.round(seconds / size), unit);
  }

  return format.format(seconds, 'second');
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "5b8371b87515"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FILE_SIZE_UNITS: () => (/* reexport safe */ _format_file_size_js__WEBPACK_IMPORTED_MODULE_4__.FILE_SIZE_UNITS),
/* harmony export */   calendarDayOffset: () => (/* reexport safe */ _format_date_js__WEBPACK_IMPORTED_MODULE_1__.calendarDayOffset),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   fileSizeUnits: () => (/* reexport safe */ _format_file_size_js__WEBPACK_IMPORTED_MODULE_4__.fileSizeUnits),
/* harmony export */   formatDate: () => (/* reexport safe */ _format_date_js__WEBPACK_IMPORTED_MODULE_1__.formatDate),
/* harmony export */   formatFileSize: () => (/* reexport safe */ _format_file_size_js__WEBPACK_IMPORTED_MODULE_4__.formatFileSize),
/* harmony export */   formatLocale: () => (/* reexport safe */ _format_intl_js__WEBPACK_IMPORTED_MODULE_0__.formatLocale),
/* harmony export */   formatNumber: () => (/* reexport safe */ _format_number_js__WEBPACK_IMPORTED_MODULE_3__.formatNumber),
/* harmony export */   formatRelativeDay: () => (/* reexport safe */ _format_relative_js__WEBPACK_IMPORTED_MODULE_2__.formatRelativeDay),
/* harmony export */   formatRelativeTime: () => (/* reexport safe */ _format_relative_js__WEBPACK_IMPORTED_MODULE_2__.formatRelativeTime),
/* harmony export */   msUntilNextDay: () => (/* reexport safe */ _format_date_js__WEBPACK_IMPORTED_MODULE_1__.msUntilNextDay),
/* harmony export */   numberOptions: () => (/* reexport safe */ _format_number_js__WEBPACK_IMPORTED_MODULE_3__.numberOptions),
/* harmony export */   publishFormat: () => (/* binding */ publishFormat),
/* harmony export */   toDate: () => (/* reexport safe */ _format_intl_js__WEBPACK_IMPORTED_MODULE_0__.toDate)
/* harmony export */ });
/* harmony import */ var _format_intl_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("15b4e93ff6ed");
/* harmony import */ var _format_date_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("e577837dd70a");
/* harmony import */ var _format_relative_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("ee5c3aad2640");
/* harmony import */ var _format_number_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("c9ce0852ac73");
/* harmony import */ var _format_file_size_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("c016c43b1452");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_format_intl_js__WEBPACK_IMPORTED_MODULE_0__, _format_date_js__WEBPACK_IMPORTED_MODULE_1__, _format_relative_js__WEBPACK_IMPORTED_MODULE_2__, _format_number_js__WEBPACK_IMPORTED_MODULE_3__, _format_file_size_js__WEBPACK_IMPORTED_MODULE_4__]);
([_format_intl_js__WEBPACK_IMPORTED_MODULE_0__, _format_date_js__WEBPACK_IMPORTED_MODULE_1__, _format_relative_js__WEBPACK_IMPORTED_MODULE_2__, _format_number_js__WEBPACK_IMPORTED_MODULE_3__, _format_file_size_js__WEBPACK_IMPORTED_MODULE_4__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
// Dates, days, numbers and file sizes as people read them, in the page's
// language (reuse audit 2026-11-02, finding 7). About fourteen components
// wrote these themselves -- three relative-day rules (thread-list, chat-window
// with its own midnight refresh, mail-letters), file sizes in four places,
// numbers in the chart and the quantity -- and they disagreed: «Вчера» in one
// list, «вчера» in the next, «1.4MB» beside «1,4 МБ». One rule now, through
// Intl only; the most complete copy was ui-chart's chart-core/format.js, whose
// number words are kept as they were.
//
// The locale is the page's (page-language.js pageLocale): an explicit
// `locale`, else the language of `node` -- the nearest [lang] above it, the
// page's choice, <html lang>, English. Never a fixed ru-RU.
//
// This module gathers the helpers and the SF.format object; the helpers live
// in modules of their own with no top-level side effects (core.runtime 1.28.0;
// ui-chart, 2026-11-05), and a bundle imports what it calls from those:
//
//   format-number.js     formatNumber, numberOptions
//   format-date.js       formatDate, calendarDayOffset, msUntilNextDay, toDate
//   format-relative.js   formatRelativeDay, formatRelativeTime
//   format-file-size.js  formatFileSize, fileSizeUnits, FILE_SIZE_UNITS
//   format-intl.js       formatLocale, toDate (and the shared Intl formatters)
//
// Until 1.28.0 this module published SF.format on load, from whichever bundle
// ran it first; that kept every helper in every bundle that imported one (each
// chart bundle grew by 1.3-1.4 KB gzip). Core's entry publishes it now
// (index.js calls publishFormat), and importing this module changes nothing on
// the page. Its exports are as they were.






const Format = /* @__PURE__ */Object.freeze({
  locale: _format_intl_js__WEBPACK_IMPORTED_MODULE_0__.formatLocale,
  date: _format_date_js__WEBPACK_IMPORTED_MODULE_1__.formatDate,
  relativeDay: _format_relative_js__WEBPACK_IMPORTED_MODULE_2__.formatRelativeDay,
  relativeTime: _format_relative_js__WEBPACK_IMPORTED_MODULE_2__.formatRelativeTime,
  dayOffset: _format_date_js__WEBPACK_IMPORTED_MODULE_1__.calendarDayOffset,
  msUntilNextDay: _format_date_js__WEBPACK_IMPORTED_MODULE_1__.msUntilNextDay,
  number: _format_number_js__WEBPACK_IMPORTED_MODULE_3__.formatNumber,
  numberOptions: _format_number_js__WEBPACK_IMPORTED_MODULE_3__.numberOptions,
  fileSize: _format_file_size_js__WEBPACK_IMPORTED_MODULE_4__.formatFileSize
});
/**
 * Publishes SF.format on `root` (the page's global), unless something is there
 * already: core's entry calls it once; a component bundle never does.
 */

function publishFormat(root = typeof globalThis !== 'undefined' ? globalThis : undefined) {
  if (!root) return undefined;
  root.SF = root.SF || {};
  if (!root.SF.format) root.SF.format = Format;
  return root.SF.format;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Format);
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "4a441273c368"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _component_file_upload_js_file_upload__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("c43efa1014a6");
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("a0ca4643a85f");
/* harmony import */ var _component_field_size__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("e6d86f2cd058");
/* harmony import */ var _helpers_form_field__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("38ea8d53f301");
/* harmony import */ var _core_js_composition_file_size_mjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("fb0bdf7719f0");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("35944d444d78");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("3cdda2d4c43b");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("8623c4e59417");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("d49e89d651d7");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_component_file_upload_js_file_upload__WEBPACK_IMPORTED_MODULE_0__, _core_js_smart_base__WEBPACK_IMPORTED_MODULE_1__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2__, _js_templates_default__WEBPACK_IMPORTED_MODULE_3__, _component_field_size__WEBPACK_IMPORTED_MODULE_4__, _core_js_composition_file_size_mjs__WEBPACK_IMPORTED_MODULE_6__]);
([_component_file_upload_js_file_upload__WEBPACK_IMPORTED_MODULE_0__, _core_js_smart_base__WEBPACK_IMPORTED_MODULE_1__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2__, _js_templates_default__WEBPACK_IMPORTED_MODULE_3__, _component_field_size__WEBPACK_IMPORTED_MODULE_4__, _core_js_composition_file_size_mjs__WEBPACK_IMPORTED_MODULE_6__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2__);










 // Only the words on screen ship in the bundle; the title, settings and events
// stay in the language files for the Studio and the docs (localization study LC-2).

const en = {
  runtime: _lang_en_json__WEBPACK_IMPORTED_MODULE_9__.runtime
};
const ru = {
  runtime: _lang_ru_json__WEBPACK_IMPORTED_MODULE_10__.runtime
}; // Every word this component says is lang/<locale>.json runtime (standard
// 1.3.8 §11); a product adds any other language through
// SF.language.register("sf-file-upload", code, words).
// The class component's events, each with the name the host sends it by
// (vocabulary 1.1.5 §9.1). They stop at the host, which sends them through
// sfEmit with the entry's id; the shim sends the old name after each one.

const INNER_EVENTS = {
  'sf-file-upload:select': 'attach',
  'sf-file-upload:file-add': 'attached',
  'sf-file-upload:remove': 'detach',
  'sf-file-upload:reject': 'rejected',
  'sf-file-upload:retry': 'retry',
  'sf-file-upload:file-complete': 'completed',
  'sf-file-upload:file-error': 'failed',
  'sf-file-upload:complete': 'finished'
};

const itemState = item => (0,_component_file_upload_js_file_upload__WEBPACK_IMPORTED_MODULE_0__.normalizeItemState)(item); // An entry's id, as the class component keys its events.


const itemId = (item, index) => {
  if (item?.id) return String(item.id);
  if (item?.file?.name) return `${item.file.name}-${item.file.size}-${item.file.lastModified}`;
  if (item?.name || item?.fileName) return `${item.name || item.fileName}-${index}`;
  return `item-${index}`;
};

const itemProgress = item => Math.max(0, Math.min(100, Number(item?.progress ?? 0) || 0)); // sf-file-upload from its component.json (standard simai.smart-component
// 1.3.8 §3, §4, §4.4, §8, §10.8, §16.20): the settings are attributes and
// properties made by core/js/element-manifest.js, the actions answer an
// outcome, and each entry is a stream the host drives through items.


const FileUploadElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_2__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_7__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_1___default()),
  lang: {
    en,
    ru
  },
  source: 'ru',
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_8__,
  actions: {
    'remove-item'({
      index
    } = {}) {
      const nextItems = Array.from(this.items);
      const normalizedIndex = Number(index);

      if (!Number.isInteger(normalizedIndex) || normalizedIndex < 0 || normalizedIndex >= nextItems.length) {
        return 'no-item';
      }

      nextItems.splice(normalizedIndex, 1);
      this.items = nextItems;
      return 'applied';
    },

    clear() {
      if (!this.items.length) return 'unchanged';
      this.items = [];
      return 'applied';
    }

  }
}); // A stored file in the sf-input-image shape {value, label, mime, size, href}
// as a done row.

function storedItem(entry, index, node) {
  const shape = entry && typeof entry === 'object' ? entry : {
    value: entry
  };
  const href = shape.href ? String(shape.href) : '';
  const name = String(shape.label || shape.name || (href ? (0,_core_js_composition_file_size_mjs__WEBPACK_IMPORTED_MODULE_6__.fileNameFromAddress)(href) : '') || shape.value || 'File');
  return {
    id: String(shape.value || href || `${name}-${index}`),
    name,
    fileSize: shape.size === undefined || shape.size === null ? '' : (0,_core_js_composition_file_size_mjs__WEBPACK_IMPORTED_MODULE_6__.formatFileSize)(shape.size, {
      node
    }),
    state: 'done',
    value: shape.value === undefined || shape.value === null ? '' : String(shape.value),
    ...(href ? {
      href
    } : {}),
    ...(shape.mime ? {
      mime: String(shape.mime)
    } : {}),
    ...(Number.isFinite(Number(shape.size)) && shape.size !== '' && shape.size !== null ? {
      size: Number(shape.size)
    } : {})
  };
}

function readValueAttribute(raw) {
  if (raw === null || raw === undefined || raw === '') return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    return String(raw).split(',').map(part => part.trim()).filter(Boolean).map(href => ({
      href
    }));
  }
}

class SfFileUpload extends (0,_helpers_form_field__WEBPACK_IMPORTED_MODULE_5__.FormField)(FileUploadElement) {
  static get props() {
    return { ...super.props,
      templateName: {
        attribute: 'template',
        default: 'default'
      },
      size: {
        default: '1',
        values: _component_field_size__WEBPACK_IMPORTED_MODULE_4__.FIELD_SIZES
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
    this._onRetry = null; // The streams the entries are (§10.8): id -> {state, progress}.

    this._streams = new Map(); // The transfers the uploader runs: id -> AbortController.

    this._uploads = new Map();
    this._uploader = null;
    this._lastAttach = null; // A file held over the area is said on the host (§5.3).

    this.addEventListener('dragover', this._onDragState);
    this.addEventListener('dragleave', this._onDragState);
    this.addEventListener('drop', this._onDragState);
  }

  _onDragState = event => {
    if (event.type === 'dragover') {
      const files = Array.from(event.dataTransfer?.types || []).includes('Files');
      this.sfHostState('data-dragged-over', files && !this.disabled);
      return;
    }

    if (event.type === 'dragleave' && event.relatedTarget && this.contains(event.relatedTarget)) return;
    this.sfHostState('data-dragged-over', false);
  };

  get componentName() {
    return 'file-upload';
  } // Stored files written in the markup (value="[...]") are listed once, when
  // the page set no items first.


  connectedCallback() {
    super.connectedCallback();

    if (!this._valueRead) {
      this._valueRead = true;
      if (this.hasAttribute('value') && !this._items.length) this.value = this.getAttribute('value');
    }
  }

  shouldClearLightDomBeforeFirstRender() {
    return super.shouldClearLightDomBeforeFirstRender() || this.templateName === 'default' && !!this.querySelector(':scope > .sf-file-upload[data-render-managed="1"]');
  }

  get templateName() {
    return this.getAttribute('template') || 'default';
  }

  get size() {
    return (0,_component_field_size__WEBPACK_IMPORTED_MODULE_4__.fieldSize)(this.getAttribute('size') || '1', 'sf-file-upload');
  }

  get formats() {
    return this.getAttribute('formats') || (0,_component_file_upload_js_file_upload__WEBPACK_IMPORTED_MODULE_0__.formatAcceptWords)(this.accept, this) || // The component cannot know what a field accepts: it names formats only
    // when the host gives them or an accept list says so.
    '';
  }

  get supportingText() {
    return this.getAttribute('supporting-text') || this.formats;
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

    this._trackStreams(this._items);

    this._abortGone();

    this.requestComponentUpdate('items');

    this._pumpUploads();

    this.sfSyncFormState?.();
  } // The files the form gets, in the sf-input-image shape (FU-9): a chosen file
  // that is sent with the form ({label, mime, size, file}) and a stored one
  // ({value, label, mime, size, href}). Written, it lists stored files as done
  // rows; the attribute takes the list as JSON or addresses separated by
  // commas.


  get value() {
    return this.items.map(item => {
      const state = itemState(item);
      const label = String(item?.name || item?.fileName || '');
      const mime = String(item?.file?.type || item?.mime || '');
      const size = Number(item?.file?.size ?? item?.size);
      const shape = {
        label,
        mime,
        ...(Number.isFinite(size) ? {
          size
        } : {})
      };

      if (state === 'done' && (item?.value || item?.href)) {
        return {
          value: String(item.value || ''),
          ...shape,
          ...(item.href ? {
            href: String(item.href)
          } : {})
        };
      }

      if (state === 'ready' && item?.file) return {
        value: '',
        ...shape,
        file: item.file
      };
      return null;
    }).filter(Boolean);
  }

  set value(list) {
    const entries = Array.isArray(list) ? list : readValueAttribute(list);
    this.items = entries.map((entry, index) => storedItem(entry, index, this));
  } // What the form gets (§17.1): under name, one entry per file -- the File
  // for a chosen one (sent with the form), the stored id for a sent one;
  // nothing while disabled. The files did not reach the form at all: no name,
  // no form association, the native input cleared after each choice.


  sfFormValue() {
    const name = this.getAttribute('name') || '';
    if (!name || this.disabled || this.sfFormDisabled) return null;
    const data = new FormData();

    for (const entry of this.value) {
      if (entry.file) data.append(name, entry.file, entry.file.name);else if (entry.value) data.append(name, entry.value);
    }

    return [...data.keys()].length ? data : null;
  } // The field's own validity (§17.2): required and nothing to send; a file
  // still going (the form would leave without it); a file that failed. The
  // browser points at the area.


  sfSyncValidity() {
    const internals = this.sfInternals;
    if (!internals) return;
    const states = this.items.map(item => itemState(item));
    const required = this.hasAttribute('required') && this.getAttribute('required') !== 'false';
    const anchor = this._boundRoot && this.contains(this._boundRoot) ? this._boundRoot : undefined;
    let flags = {};
    let message = '';

    if (this.sfCustomError) {
      flags = {
        customError: true
      };
      message = this.sfCustomError;
    } else if (!this.disabled && states.includes('process')) {
      flags = {
        customError: true
      };
      message = this.sfWord('wait-for-uploads');
    } else if (!this.disabled && states.includes('error')) {
      flags = {
        customError: true
      };
      message = this.sfWord('remove-failed');
    } else if (required && !this.disabled && !this.value.length) {
      flags = {
        valueMissing: true
      };
      message = this.sfWord(this.multiple ? 'value-missing-many' : 'value-missing');
    }

    try {
      if (Object.keys(flags).length) internals.setValidity(flags, message, anchor);else internals.setValidity({});
    } catch (error) {
      this.reportComponentError?.(error, 'validity');
    }
  } // form.reset(): back to the stored files the field was written with.


  fieldReset() {
    for (const controller of this._uploads.values()) controller.abort();

    this._uploads.clear();

    this.items = readValueAttribute(this.getAttribute('value')).map((entry, index) => storedItem(entry, index, this));
  } // The page's transfer (FU-11): async (file, {signal, onProgress, item}) =>
  // the stored value ({value, href} or an id). With it the component sends
  // each file it lists, ready or retried, and moves the row itself: process
  // with the share onProgress(done, total) reports, done with the value, error
  // with the thrown error's message (and its reason when it has one). Remove
  // aborts the transfer through the signal. Without it the host drives the
  // rows through items, and Retry is a retry event the page answers.


  get uploader() {
    return this._uploader;
  }

  set uploader(value) {
    this._uploader = typeof value === 'function' ? value : null;

    this._pumpUploads();
  }

  _patchItem(id, changes) {
    const index = this.items.findIndex((item, at) => itemId(item, at) === id);
    if (index < 0) return;
    const next = Array.from(this.items);
    next[index] = { ...next[index],
      ...changes
    };
    this.items = next;
  }

  _abortGone() {
    if (!this._uploads.size) return;
    const listed = new Set(this.items.map((item, index) => itemId(item, index)));

    for (const [id, controller] of [...this._uploads]) {
      if (listed.has(id)) continue;

      this._uploads.delete(id);

      controller.abort();
    }
  } // Starts every listed file that is ready, or in process with no transfer (a
  // retry), when the page gave an uploader.


  _pumpUploads() {
    const send = this._uploader;
    if (!send || this._pumping) return;
    const due = this.items.map((item, index) => ({
      item,
      id: itemId(item, index),
      state: itemState(item)
    })).filter(({
      item,
      id,
      state
    }) => item?.file && !this._uploads.has(id) && (state === 'ready' || state === 'process'));
    if (!due.length) return;
    due.forEach(({
      id
    }) => this._uploads.set(id, new AbortController()));
    this._pumping = true;

    try {
      const starting = new Set(due.map(({
        id
      }) => id));
      this.items = this.items.map((item, index) => starting.has(itemId(item, index)) ? { ...item,
        state: 'process',
        progress: null,
        errorMessage: undefined,
        reason: undefined
      } : item);
    } finally {
      this._pumping = false;
    }

    due.forEach(({
      item,
      id
    }) => this._send(send, item, id));
  }

  _send(send, item, id) {
    const controller = this._uploads.get(id);

    if (!controller) return;
    const {
      signal
    } = controller;

    const onProgress = (done, total) => {
      if (signal.aborted) return;
      const share = Number(total) > 0 ? Math.round(Number(done) / Number(total) * 100) : null;

      this._patchItem(id, {
        progress: share === null ? null : Math.max(0, Math.min(100, share))
      });
    };

    Promise.resolve().then(() => send.call(null, item.file, {
      signal,
      onProgress,
      item
    })).then(answer => {
      if (signal.aborted || this._uploads.get(id) !== controller) return;

      this._uploads.delete(id);

      const stored = answer !== null && typeof answer === 'object' ? answer : {
        value: answer
      };

      this._patchItem(id, {
        state: 'done',
        progress: 100,
        value: stored.value === undefined || stored.value === null ? '' : String(stored.value),
        ...(stored.href ? {
          href: String(stored.href)
        } : {})
      });
    }).catch(error => {
      if (signal.aborted || this._uploads.get(id) !== controller) return;

      this._uploads.delete(id);

      this._patchItem(id, {
        state: 'error',
        errorMessage: String(error?.message || ''),
        reason: String(error?.reason || 'network')
      });
    });
  } // The stream facts of §10.8 that the class component does not send: begun
  // when an entry enters process, chunk when the host moves its progress,
  // cancelled when it leaves while in process. completed and failed are the
  // class component's file-complete and file-error, sent on by the host.


  _trackStreams(items = []) {
    const seen = new Set();
    items.forEach((item, index) => {
      const id = itemId(item, index);
      seen.add(id);
      const state = itemState(item);
      const progress = itemProgress(item);

      const before = this._streams.get(id);

      this._streams.set(id, {
        state,
        progress,
        item
      });

      if (state !== 'process') return;

      if (!before || before.state !== 'process') {
        this.sfEmit('begun', {
          id,
          item
        });
        if (progress > 0) this.sfEmit('chunk', {
          id,
          done: progress,
          total: 100,
          item
        });
      } else if (progress !== before.progress) {
        this.sfEmit('chunk', {
          id,
          done: progress,
          total: 100,
          item
        });
      }
    });

    for (const [id, stream] of [...this._streams]) {
      if (seen.has(id)) continue;

      this._streams.delete(id);

      if (stream.state === 'process') this.sfEmit('cancelled', {
        id,
        item: stream.item
      });
    }
  } // The class component's events stop at the host and leave it by their
  // vocabulary names, with the entry's id (§8, §10.8). Its change -- the file
  // input's own, or the one it sends for a drop -- stops too: the host sends
  // change once per choice, after the streams began, with the files chosen.


  _onInnerEvent = event => {
    if (event.target !== this._boundRoot && event.type !== 'change') return;
    event.stopPropagation();
    if (event.type === 'change') return;
    const verb = INNER_EVENTS[event.type];
    if (!verb) return;
    const detail = { ...(event.detail || {})
    };
    if (detail.item) detail.id = itemId(detail.item, detail.index);

    if (verb === 'failed') {
      detail.reason = String(detail.item?.reason || 'error');
      detail.message = String(detail.item?.errorMessage || detail.item?.error || '');
    }

    if (verb === 'attach') this._lastAttach = {
      files: detail.files,
      source: detail.source
    };
    this.sfEmit(verb, detail);
  };

  templateContext() {
    const props = this.getPropsContext();
    return this.createTemplateContext({ ...props,
      linkText: this.linkText,
      text: this.text,
      component: this,
      formats: this.formats,
      supportingText: this.supportingText,
      items: this.items
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_3__.renderFileUploadTemplate)(this.templateContext());
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
  } // items is a writable setting (§4.4); setItems stays for the pages that
  // call it, outside the interface.


  setItems(nextItems = []) {
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

    this._trackStreams(this.items);

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

    const refresh = () => {
      this._items = Array.from(this._boundRoot?.__sfFileUploadItems || []);

      this._trackStreams(this._items);

      this._abortGone();

      if (this._lastAttach) {
        const chosen = this._lastAttach;
        this._lastAttach = null; // change keeps its native name (§8, §17.3).

        this.sfEmit('change', chosen);
      }

      this.requestComponentUpdate('items');

      this._pumpUploads();

      this.sfSyncFormState?.();
    };

    this._onSelect = refresh;
    this._onRemove = refresh;
    this._onRetry = refresh;

    for (const type of [...Object.keys(INNER_EVENTS), 'change']) {
      this._boundRoot.addEventListener(type, this._onInnerEvent);
    }

    this._boundRoot.addEventListener('sf-file-upload:select', this._onSelect);

    this._boundRoot.addEventListener('sf-file-upload:remove', this._onRemove);

    this._boundRoot.addEventListener('sf-file-upload:retry', this._onRetry);

    this.sfSyncFormState?.();
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
      for (const type of [...Object.keys(INNER_EVENTS), 'change']) {
        this._boundRoot.removeEventListener(type, this._onInnerEvent);
      }
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
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var _component_field_size__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("e6d86f2cd058");
/* harmony import */ var _component_file_upload_js_file_upload__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("c43efa1014a6");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, _component_field_size__WEBPACK_IMPORTED_MODULE_1__, _component_file_upload_js_file_upload__WEBPACK_IMPORTED_MODULE_2__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, _component_field_size__WEBPACK_IMPORTED_MODULE_1__, _component_file_upload_js_file_upload__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);




function normalizeSize(value) {
  return (0,_component_field_size__WEBPACK_IMPORTED_MODULE_1__.fieldSize)(value, 'sf-file-upload');
} // The row is the class row (describeUploadItem): ready, process, done and
// error say the same words and offer the same buttons in both.


function renderUploadItem(item, size, index, owner) {
  const row = (0,_component_file_upload_js_file_upload__WEBPACK_IMPORTED_MODULE_2__.describeUploadItem)(item, owner, 'process');
  const {
    state
  } = row;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div
                class="sf-upload-progress sf-upload-progress--size-${size} sf-upload-progress--${state} flex items-main-start items-cross-start"
                data-index=${String(index)}
        >
            <i class="sf-icon" aria-hidden="true">${row.icon}</i>
            <div class="sf-upload-progress-content flex flex-col flex-1">
                <div class="sf-upload-progress-top flex content-main-between">
                    <div class="sf-upload-progress-left flex flex-col">
                        <div class="sf-upload-progress-name">${row.name}</div>
                        <div class="sf-upload-progress-text">${row.line}</div>
                    </div>

                    ${state === 'done' ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class="sf-icon sf-icon-solid sf-upload-progress-mark" aria-hidden="true">check_circle</i>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    <button
                            type="button"
                            class="sf-icon-button sf-icon-button--icon sf-icon-button--on-surface sf-icon-button--link sf-icon-button--size-${size} flex items-cross-center content-main-center self-cross-start"
                            data-action="remove"
                    >
                        <i class="sf-icon" aria-hidden="true">delete</i>
                    </button>
                </div>

                ${state === 'error' ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                            <button
                                    type="button"
                                    class="sf-upload-progress-repeat self-cross-start"
                                    data-action="retry"
                            >
                                ${row.retryText}
                            </button>
                        ` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ${state === 'process' ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                            <sf-progress-bar
                                    size=${size}
                                    value=${row.progress === null ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : String(row.progress)}
                                    ?indeterminate=${row.progress === null}
                                    text-position="inline-end"
                            ></sf-progress-bar>
                        ` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
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
                data-max-size=${context.maxSize > 0 ? String(context.maxSize) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                data-min-size=${context.minSize > 0 ? String(context.minSize) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                data-max-files=${context.maxFiles > 0 ? String(context.maxFiles) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                data-max-total-size=${context.maxTotalSize > 0 ? String(context.maxTotalSize) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ?multiple=${context.multiple}
                ?disabled=${context.disabled}
                aria-label=${context.ariaLabel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        >
            <div class=${featuredIconClasses}>
                <i class="sf-icon" aria-hidden="true">${context.icon}</i>
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

        <div class="sf-file-upload-message" role="status" hidden></div>

        <div class="sf-file-upload-files grid grid-col-1 gap-1 w-full">
            ${Array.isArray(context.items) ? context.items.map((item, index) => renderUploadItem(item, size, index, context.component)) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        </div>
    `;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "38ea8d53f301"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FormField: () => (/* binding */ FormField),
/* harmony export */   ShownRequired: () => (/* binding */ ShownRequired),
/* harmony export */   ShownValidity: () => (/* binding */ ShownValidity),
/* harmony export */   VALIDITY_FLAGS: () => (/* binding */ VALIDITY_FLAGS),
/* harmony export */   VALIDITY_WORDS: () => (/* binding */ VALIDITY_WORDS),
/* harmony export */   claimFirstInvalid: () => (/* binding */ claimFirstInvalid),
/* harmony export */   forgetFormTried: () => (/* binding */ forgetFormTried),
/* harmony export */   formTried: () => (/* binding */ formTried),
/* harmony export */   hasFieldWord: () => (/* binding */ hasFieldWord),
/* harmony export */   innerControlName: () => (/* binding */ innerControlName),
/* harmony export */   ownInvalid: () => (/* binding */ ownInvalid),
/* harmony export */   syncFieldValidity: () => (/* binding */ syncFieldValidity),
/* harmony export */   syncOwnValidity: () => (/* binding */ syncOwnValidity),
/* harmony export */   validityWords: () => (/* binding */ validityWords)
/* harmony export */ });
// The form-control half of a field built from its component.json (standard
// simai.smart-component 1.3.8 §17.1, §17.2), shared by the field family.
//
// core/js/element-manifest.js makes the host form-associated and gives it
// ElementInternals, sfFormValue() and sfSyncForm(). What a field adds is the
// same in every member, so it is written once here:
//
// - validity (§17.2): the host reports what its inner native control knows
//   (value-missing, too-short, pattern-mismatch, ...) with the control as the
//   anchor, so reportValidity() points at the box the person types in; a
//   custom error set with setCustomValidity() or the action set-error wins
//   until it is cleared;
// - the inner controls stay out of the page's form (§17.1 item 6): they carry
//   no name while the host is the form control;
// - a field with no inner native control to read (a list of buttons, a
//   picker, a file area) says what it knows itself with `fieldValidity()`:
//   value-missing while `required` and the form value is empty by default,
//   and where the browser points;
// - form reset and fieldset[disabled] (§17.1 items 3, 4): `form.reset()`
//   calls the component's `fieldReset()` when it has one (its default back,
//   without events), and the host syncs its form value and validity after the
//   browser has reset its parts;
// - restore: `formStateRestoreCallback` hands the saved form value to
//   `fieldRestore(state)` when the component has one.
//
// Usage, over the element core/js/element-manifest.js gives:
//
//   const Element = elementFromManifest(manifest, {base: SfBaseElement, ...});
//   class SfThing extends FormField(Element) { ... }
//
// Without ElementInternals nothing here runs, and the named inner control
// submits as it always did (§16 item 11).
// ValidityState's own flags, in the order of §17.2's list.
const VALIDITY_FLAGS = Object.freeze(['valueMissing', 'typeMismatch', 'patternMismatch', 'tooShort', 'tooLong', 'rangeUnderflow', 'rangeOverflow', 'stepMismatch', 'badInput']);
/** The name an inner native control carries: none while the host submits (§17.1 item 6). */

function innerControlName(component, name) {
  return component?.sfInternals ? '' : String(name || '');
}
/**
 * The host's validity from its inner control: the control's failed flags and
 * message, or the custom error the page set, or valid. `own` adds flags the
 * component reads itself, {flag: message} (a number field's range and step,
 * which its text box cannot know).
 */

function syncFieldValidity(component, control, own = {}) {
  const internals = component?.sfInternals;
  if (!internals) return;

  try {
    const custom = component.sfCustomError || '';

    if (custom) {
      internals.setValidity({
        customError: true
      }, custom, control || undefined);
      return;
    }

    const validity = control?.validity;
    const flags = {};
    let message = '';

    if (validity && !validity.valid && control.willValidate !== false) {
      for (const flag of VALIDITY_FLAGS) if (validity[flag]) flags[flag] = true;

      message = control.validationMessage;
    }

    for (const [flag, text] of Object.entries(own || {})) {
      flags[flag] = true;
      message ||= String(text || '');
    }

    if (Object.keys(flags).length) internals.setValidity(flags, message || ' ', control || undefined);else internals.setValidity({});
  } catch (error) {
    component.reportComponentError?.(error, 'validity');
  }
}
/**
 * The host's validity from what the component says itself (fieldValidity()):
 * value-missing, too-long (a counted field past its limit, helpers/char-count.js)
 * and the custom error the page set; `anchor`, when it is a part of the host,
 * is where the browser points.
 */

function syncOwnValidity(component, {
  valueMissing = false,
  tooLong = false,
  message = '',
  anchor = null
} = {}) {
  const internals = component?.sfInternals;
  if (!internals) return;
  const custom = component.sfCustomError || '';
  const flags = {};
  let text = '';

  if (custom) {
    flags.customError = true;
    text = custom;
  }

  if (valueMissing) {
    flags.valueMissing = true;
    text ||= message || 'value-missing';
  }

  if (tooLong) {
    flags.tooLong = true;
    text ||= message || 'too-long';
  }

  try {
    if (Object.keys(flags).length) {
      const target = anchor && component.contains?.(anchor) ? anchor : undefined;
      internals.setValidity(flags, text, target);
    } else {
      internals.setValidity({});
    }
  } catch (error) {
    component.reportComponentError?.(error, 'validity');
  }
}
/**
 * The field family's form plumbing over a manifest element. A component
 * names the control its validity comes from with `sfValidityAnchor()`
 * (default: getInputElement()).
 */

const FormField = Base => class extends Base {
  constructor() {
    super(); // A person's edit reaches the host as input/change; the form value and
    // validity follow it without a redraw.

    this.__sfFormSync = () => this.sfSyncFormState();

    this.addEventListener('input', this.__sfFormSync);
    this.addEventListener('change', this.__sfFormSync);
  }

  sfValidityAnchor() {
    return this.getInputElement?.() || null;
  }
  /**
   * What the component knows of its validity itself, {valueMissing, message,
   * anchor}, or null when an inner native control's ValidityState is the
   * answer (sfValidityAnchor()). With no such control: value-missing while
   * `required` and the form value is empty. A component overrides it.
   */


  fieldValidity() {
    if (this.sfValidityAnchor()) return null;
    const required = this.hasAttribute('required') && this.getAttribute('required') !== 'false';
    const value = this.sfFormValue?.();
    const valueMissing = required && !this.disabled && (value === null || value === undefined || value === ''); // The word only when it is said: asked on every sync, a component without
    // it warned «no word value-missing» on each optional field (simai.main,
    // sf-button-group in property-view's choice field, 2026-10-28).

    return {
      valueMissing,
      message: valueMissing ? this.sfWord?.('value-missing') || 'value-missing' : '',
      anchor: null
    };
  }
  /** The validity, now: the component's own account, or its inner control's. */


  sfSyncValidity() {
    const own = this.fieldValidity();
    if (own) syncOwnValidity(this, own);else syncFieldValidity(this, this.sfValidityAnchor());
  }
  /** The form value and the validity, now. */


  sfSyncFormState() {
    this.sfSyncForm?.();
    this.sfSyncValidity();
  }
  /** §17.2: a custom error keeps the form from submitting until it is cleared. */


  setCustomValidity(message = '') {
    this.sfCustomError = String(message ?? '');
    this.sfSyncValidity();
  } // fieldReset() puts the component's default back, without events. The
  // browser resets the parts after it calls this: the sync waits for them,
  // and once more for the parts that put their own default back a task later
  // (component/form-reset-helper.js: masks, the checkables' attributes).


  formResetCallback() {
    if (typeof this.fieldReset === 'function') {
      try {
        this.fieldReset();
      } catch (error) {
        this.reportComponentError?.(error, 'form reset');
      }
    }

    this.sfSyncFormState();
    Promise.resolve().then(() => this.sfSyncFormState());
    setTimeout(() => this.sfSyncFormState(), 0);
  }

  formStateRestoreCallback(state) {
    if (typeof this.fieldRestore === 'function') this.fieldRestore(state);
    this.sfSyncFormState();
  }

}; // The word key a failed validity flag is said with (owner decision C153 (3)):
// each component carries these words in its lang/<locale>.json runtime
// words, in the page's language (LC-9), never the browser's.

const VALIDITY_WORDS = Object.freeze({
  valueMissing: 'value-missing',
  typeMismatch: 'type-mismatch',
  patternMismatch: 'pattern-mismatch',
  tooShort: 'too-short',
  tooLong: 'too-long',
  rangeUnderflow: 'range-underflow',
  rangeOverflow: 'range-overflow',
  stepMismatch: 'step-mismatch',
  badInput: 'bad-input'
}); // One check pass across every field of a page (C153 (3)): a submit attempt,
// reportValidity() or checkValidity() fires `invalid` on every wrong field
// in tree order, synchronously. The first wrong field of a pass the person
// started (a press or Enter in this task) takes the focus; the rest show
// their errors and keep still. The fields are separate bundles, each with its
// own copy of this module, so the pass lives on a shared global.

const CHECK_KEY = Symbol.for('simai.framework.field-check');

function fieldCheck() {
  const shared = globalThis[CHECK_KEY] || (globalThis[CHECK_KEY] = {
    activated: false,
    focused: false,
    tried: new WeakSet()
  });

  if (!shared.listening && typeof document !== 'undefined') {
    shared.listening = true;

    const mark = event => {
      if (event.type === 'keydown' && event.key !== 'Enter') return;
      shared.activated = true;
      setTimeout(() => {
        shared.activated = false;
      }, 0);
    };

    document.addEventListener('click', mark, true);
    document.addEventListener('keydown', mark, true);
  }

  return shared;
}
/**
 * Says that `element` failed a check now. Returns true when it is the first
 * wrong field of a pass the person started, the one that takes the focus.
 * Every member of the field family calls it from its `invalid` listener.
 */


function claimFirstInvalid(element) {
  const check = fieldCheck();
  const form = element?.form || element?.closest?.('form') || null;
  if (form) check.tried.add(form);
  if (!check.activated || check.focused) return false;
  check.focused = true;
  setTimeout(() => {
    check.focused = false;
  }, 0);
  return true;
}
/**
 * For a member that draws its own errors on `invalid` (C153 (3)): the
 * browser's bubble is cancelled on the host and on every native control
 * inside it, `show` runs for the host's own event, and the first wrong field
 * of a submit the person made takes the focus. Returns the listener, to
 * remove with removeEventListener('invalid', listener, true).
 */

function ownInvalid(component, show) {
  fieldCheck();

  const listener = event => {
    event.preventDefault();
    if (event.target !== component) return;
    const first = claimFirstInvalid(component);
    show?.(event);

    if (first) {
      const target = component.focusDelegate?.() || component.sfValidityAnchor?.() || component;

      try {
        target.focus?.();
      } catch {
        /* a field taken out of the page while the check ran */
      }
    }
  };

  component.addEventListener('invalid', listener, true);
  return listener;
}
/** A submit attempt has failed on this field's form since its last reset. */

function formTried(element) {
  const form = element?.form || element?.closest?.('form') || null;
  return Boolean(form && fieldCheck().tried.has(form));
}
/** Forgets the failed attempt of a form (form.reset()). */

function forgetFormTried(element) {
  const form = element?.form || element?.closest?.('form') || null;
  if (form) fieldCheck().tried.delete(form);
}
/** Whether the component's dictionaries hold a word, in any language. */

function hasFieldWord(component, key) {
  const words = component?.constructor?.sfWords || {};
  return Object.values(words).some(dictionary => dictionary && dictionary[key] !== undefined && dictionary[key] !== null);
}
/**
 * The words a field says for its validity now (C153 (3)): the page's custom
 * error as written; else the first failed flag in the component's own words,
 * with the limit it broke ({min}, {max}, {step}); a type mismatch of an
 * e-mail or a web address has its own word (type-mismatch-email,
 * type-mismatch-url). A flag the component has no word for says what the
 * component itself set (its own count, range or file words), never the
 * browser's. '' while valid.
 */

function validityWords(component, control = component?.sfValidityAnchor?.()) {
  const validity = component?.validity;
  if (!validity || validity.valid) return '';
  if (validity.customError) return component.validationMessage || '';

  const read = name => control?.getAttribute?.(name) ?? component.getAttribute?.(name) ?? '';

  for (const flag of VALIDITY_FLAGS) {
    if (!validity[flag]) continue;
    let key = VALIDITY_WORDS[flag];

    if (flag === 'typeMismatch') {
      const type = String(control?.type || '').toLowerCase();
      if ((type === 'email' || type === 'url') && hasFieldWord(component, `${key}-${type}`)) key = `${key}-${type}`;
    }

    if (hasFieldWord(component, key)) {
      return component.sfWord(key, {
        vars: {
          min: read(flag === 'tooShort' ? 'minlength' : 'min'),
          max: flag === 'tooLong' ? component.maxlength ?? read('maxlength') : read('max'),
          step: read('step')
        }
      });
    }

    return component.validationMessage || '';
  }

  return component.validationMessage || '';
}
/**
 * The errors a field shows itself (owner decision C153 (3), for the whole
 * field family as C55): never the browser's bubble, always the component's
 * words in the page's language.
 *
 * - A failed check of the form -- a submit attempt, reportValidity(),
 *   checkValidity() -- shows the error on every wrong field at once, and the
 *   first wrong field of a submit the person made takes the focus
 *   (claimFirstInvalid). The browser's bubble, on the host and on the native
 *   control inside it, is cancelled.
 * - After that, or once the person has changed the value, leaving the field
 *   checks it: a wrong value shows its error, a right one clears it.
 * - While the person types, a shown error goes the moment the value is right;
 *   a still-wrong value keeps it, in the words of what is wrong now. Nothing
 *   is shown while typing into a field that showed no error.
 * - form.reset() takes every shown error away.
 *
 * The page's invalid / error-message win over it. Usage, over FormField:
 * `class SfThing extends ShownValidity(FormField(Element))`; the template
 * reads `sfShownInvalid(invalid)` and `sfShownMessage(invalid, errorMessage)`
 * instead of the bare settings. ShownRequired, its name before C153, stays
 * the same mixin.
 */

const ShownValidity = Base => class extends Base {
  constructor() {
    super();
    this.__sfErrorShown = false;
    this.__sfTouched = false; // The page-wide pass listens from the first field on, so the press that
    // submits is seen before the check it starts.

    fieldCheck(); // Capture: the host's own `invalid` and its native control's, which
    // would draw a second bubble; neither bubbles, so only capture sees both.

    this.addEventListener('invalid', event => {
      event.preventDefault();
      if (event.target !== this) return;
      const first = claimFirstInvalid(this);

      if (!this.__sfErrorShown) {
        this.__sfErrorShown = true;
        this.requestComponentUpdate?.('invalid');
      } else {
        this.requestComponentUpdate?.('validity');
      }

      if (first) this.sfFocusFirstInvalid();
    }, true);
    this.addEventListener('input', () => {
      this.__sfTouched = true;
    });
    this.addEventListener('change', () => {
      this.__sfTouched = true;
    });
    this.addEventListener('focusout', event => {
      if (event.relatedTarget && this.contains(event.relatedTarget)) return; // A layer of the field (a list, a picker) holds the focus for it.

      if (this.matches?.(':focus-within')) return;
      if (!this.__sfTouched && !formTried(this)) return;
      this.sfSyncValidity?.();
      const wrong = this.validity ? !this.validity.valid : false;

      if (wrong !== this.__sfErrorShown) {
        this.__sfErrorShown = wrong;
        this.requestComponentUpdate?.('validity');
      } else if (wrong) {
        this.requestComponentUpdate?.('validity');
      }
    });
  }
  /** The first wrong field of a submit takes the focus, as the browser's check did. */


  sfFocusFirstInvalid() {
    const target = this.focusDelegate?.() || this.sfValidityAnchor?.() || this;

    try {
      target.focus?.();
    } catch {
      /* a field taken out of the page while the check ran */
    }
  } // A shown error goes the moment the value is right, whatever made it right:
  // the person's input or change, a value set from script, a value attribute
  // (C55 acceptance F1 R2, D1). A still-wrong value redraws its words.


  sfSyncFormState() {
    super.sfSyncFormState?.();
    if (!this.__sfErrorShown) return;

    if (this.validity && !this.validity.valid) {
      const words = validityWords(this);

      if (words !== this.__sfShownWords) {
        this.__sfShownWords = words;
        this.requestComponentUpdate?.('validity');
      }

      return;
    }

    this.__sfErrorShown = false;
    this.__sfShownWords = '';
    this.requestComponentUpdate?.('value');
  }
  /** An error is shown now (the page's own invalid aside). */


  get sfErrorShown() {
    return this.__sfErrorShown;
  }
  /** The name before C153, kept for the components that read it. */


  get sfMissingShown() {
    return this.__sfErrorShown;
  }
  /** The invalid state the field draws: the page's, or the one it shows itself. */


  sfShownInvalid(invalid) {
    return Boolean(invalid) || this.__sfErrorShown;
  }
  /** The message under the field: the page's while it says invalid, else the shown error's words. */


  sfShownMessage(invalid, errorMessage) {
    if (invalid) return errorMessage || '';
    if (!this.__sfErrorShown) return '';
    const words = validityWords(this);
    this.__sfShownWords = words;
    return words;
  }

  formResetCallback() {
    const shown = this.__sfErrorShown;
    this.__sfErrorShown = false;
    this.__sfTouched = false;
    this.__sfShownWords = '';
    forgetFormTried(this);
    super.formResetCallback?.();
    if (shown) this.requestComponentUpdate?.('reset');
  }

};
/** The mixin's name before owner decision C153 (C55 acceptance F1). */

const ShownRequired = ShownValidity;

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

/***/ "43090d1c8307"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("page-language", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("page-language", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "deb1a4d61565"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("smart-base", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("smart-base", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "ab7ec7cd175d"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FORMAT_NAMES: () => (/* binding */ FORMAT_NAMES),
/* harmony export */   acceptFormats: () => (/* binding */ acceptFormats),
/* harmony export */   acceptsFile: () => (/* binding */ acceptsFile),
/* harmony export */   fileRejection: () => (/* binding */ fileRejection),
/* harmony export */   positiveLimit: () => (/* binding */ positiveLimit)
/* harmony export */ });
// The upload core's checks (C81: one core, five views), as pure functions:
// which files an accept list names, why one file is refused before any count
// is taken, and how the formats read in a message. sf-file-upload's intake
// (_file_upload.js takeFiles) and sf-input-image (src/smart/input-image) both
// read them from here, so a file is refused for the same reasons and in the
// same words in a list and in an image field. This module binds nothing and
// reads no page: _file_upload.js binds every .sf-file-upload as it loads,
// which a page with only an image field has no use for, so the field imports
// these and not that.

// Whether a file is one the accept list names: `.ext`, `type/*` or `type/sub`,
// as the platform dialog reads it. The dialog filters what a person may pick;
// a drop (or a paste, or the dialog's «All files») goes past it.
function acceptsFile(accept, file) {
  const tokens = String(accept || '').split(',').map((token) => token.trim().toLowerCase()).filter(Boolean);
  if (!tokens.length) return true;
  const name = String(file?.name || '').toLowerCase();
  const type = String(file?.type || '').toLowerCase();
  return tokens.some((token) => {
    if (token.startsWith('.')) return name.endsWith(token);
    if (token.endsWith('/*')) return type.startsWith(token.slice(0, -1));
    return type === token;
  });
}

// A limit in bytes, pixels or files: a positive number, else none (0).
function positiveLimit(value) {
  const number = Number(value ?? '');
  return Number.isFinite(number) && number > 0 ? number : 0;
}

// Why one file is refused on its own, before the list's counts: '' when it
// passes; else 'type' (accept does not name it), 'empty' (no bytes), 'size'
// (past maxSize) or 'min-size' (under minSize). The order is the order a
// person fixes them in: the kind of file first, then its size.
function fileRejection(file, {accept = '', maxSize = 0, minSize = 0} = {}) {
  if (!acceptsFile(accept, file)) return 'type';
  const bytes = Number(file?.size) || 0;
  if (bytes === 0) return 'empty';
  if (maxSize && bytes > maxSize) return 'size';
  if (minSize && bytes < minSize) return 'min-size';
  return '';
}

// The names people know a format by, where its media subtype is not one:
// image/jpeg is a JPG, image/svg+xml an SVG.
const FORMAT_NAMES = Object.freeze({
  jpeg: 'JPG',
  pjpeg: 'JPG',
  'svg+xml': 'SVG',
  webp: 'WebP',
  'x-icon': 'ICO',
  'vnd.microsoft.icon': 'ICO',
});

// The formats an accept list names, as people read them: «PDF, DOCX»,
// «JPG, PNG», «изображения». `kindWord(kind)` gives the word of a whole kind
// (`image/*`, `video/*`, `audio/*`) in the page's language.
function acceptFormats(accept, kindWord = (kind) => kind) {
  const parts = String(accept || '')
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const wild = /^(image|video|audio)\/\*$/iu.exec(part);
      if (wild) return kindWord(wild[1].toLowerCase());
      const bare = part.replace(/^\./u, '');
      const sub = (bare.includes('/') ? bare.split('/').pop() || bare : bare).toLowerCase();
      return FORMAT_NAMES[sub] ?? sub.toUpperCase();
    });
  return [...new Set(parts)].join(', ');
}


/***/ },

/***/ "a5334b2b6512"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _en_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d4b3cd9346d9");
/* harmony import */ var _ru_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("6e4269348082");
// The component's words for the bundle and for Node alike (localization study
// LC-4/LC-5): the runtime words of its language files, by language.



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ en: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime, ru: _ru_json__WEBPACK_IMPORTED_MODULE_1__.runtime });


/***/ },

/***/ "fb0bdf7719f0"
(__webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FILE_ICONS: () => (/* binding */ FILE_ICONS),
/* harmony export */   FILE_SIZE_UNITS: () => (/* reexport safe */ _format_js__WEBPACK_IMPORTED_MODULE_0__.FILE_SIZE_UNITS),
/* harmony export */   fileIcon: () => (/* binding */ fileIcon),
/* harmony export */   fileNameFromAddress: () => (/* binding */ fileNameFromAddress),
/* harmony export */   fileSizeUnits: () => (/* reexport safe */ _format_js__WEBPACK_IMPORTED_MODULE_0__.fileSizeUnits),
/* harmony export */   formatFileSize: () => (/* reexport safe */ _format_js__WEBPACK_IMPORTED_MODULE_0__.formatFileSize)
/* harmony export */ });
/* harmony import */ var _format_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("5b8371b87515");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_format_js__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
_format_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
// How a stored file reads to people: its size in the page's language and its
// name when nobody gave it one. sf-image-field wrote these first (its
// value.mjs re-exports them); the Composition renderer draws content.file with
// the same rule, so a size reads the same in a field and on a page. No DOM.

// The size rule is core's number format (core/js/format.js, reuse audit
// 2026-11-02 finding 7), re-exported under the names this module published:
// formatFileSize(size, units, locale) still reads as it did. Imported through
// format.js on purpose: the builder ships a source module's relative imports
// beside it, and this import is what lays core/js/format.js and its parts
// (format-*.js) in the distribution for products that import them. None of
// them has a top-level side effect, so a bundle keeps only what it calls.


// The last part of an address, decoded, without its query and fragment: the
// name a file is shown under when it has no label. A data: or blob: address
// has no name in it -- the last «/» of `data:image/svg+xml,<svg …>` falls
// inside the content, and the name read «>» (image field study IF-14) -- so it
// gives none, and the caller says what the file is instead.
function fileNameFromAddress(href) {
  if (/^\s*(?:data|blob):/iu.test(String(href ?? ''))) return '';
  const tail = String(href).split(/[?#]/u)[0].split('/').pop() || '';
  try {
    return decodeURIComponent(tail);
  } catch {
    return tail;
  }
}

// The icon of a file's kind, by its media type: sf-download-file's own glyph
// (download) when the type says nothing a reader would recognise. The
// Composition renderer draws content.file with it; an editor that draws the
// same row (sf-content-editor) imports it from here rather than keeping a copy.
// Each entry is [pattern, icon]; the first pattern that matches wins.
const FILE_ICONS = Object.freeze([
  [/^application\/pdf$/u, 'picture_as_pdf'],
  [/^image\//u, 'image'],
  [/^video\//u, 'movie'],
  [/^audio\//u, 'audio_file'],
  [/^application\/(?:zip|x-zip-compressed|x-7z-compressed|x-rar-compressed|vnd\.rar|x-tar|gzip|x-gzip)$/u, 'folder_zip'],
  [/^(?:text\/csv|application\/vnd\.ms-excel|application\/vnd\.openxmlformats-officedocument\.spreadsheetml\.[a-z.]+|application\/vnd\.oasis\.opendocument\.spreadsheet)$/u, 'table_chart'],
  [/^(?:application\/vnd\.ms-powerpoint|application\/vnd\.openxmlformats-officedocument\.presentationml\.[a-z.]+|application\/vnd\.oasis\.opendocument\.presentation)$/u, 'slideshow'],
  [/^(?:text\/|application\/msword$|application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.[a-z.]+$|application\/vnd\.oasis\.opendocument\.text$|application\/rtf$)/u, 'description'],
].map((entry) => Object.freeze(entry)));

// The icon name for a media type; download when there is none or nothing matches.
function fileIcon(mime) {
  if (typeof mime !== 'string' || !mime) return 'download';
  return FILE_ICONS.find(([pattern]) => pattern.test(mime))?.[1] ?? 'download';
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "4294700087dc"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _en_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("3694b5e2bf39");
/* harmony import */ var _ru_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("220979cc98c6");
// The unit words of a file size (localization study LC-3), for the bundle and
// for Node alike: the runtime words of the language files, by language.



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ en: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime, ru: _ru_json__WEBPACK_IMPORTED_MODULE_1__.runtime });


/***/ },

/***/ "d4b3cd9346d9"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"runtime":{"remove":"Remove","uploading":"Uploading","uploading-name":"Uploading {name}","retry":"Try again","linkText":"Click to upload","text":"or drag and drop","not-added":"Not added: {n}","reject-type":"“{name}” is not accepted: allowed {formats}","reject-one":"“{name}” was not added: this field takes one file","reject-duplicate":"“{name}” is already in the list","reject-empty":"“{name}” is empty","reject-size":"“{name}” is {size}; the limit is {max}","reject-min-size":"“{name}” is {size}; it must be at least {min}","reject-count":{"one":"“{name}” was not added: up to {n} file","other":"“{name}” was not added: up to {n} files"},"reject-total":"“{name}” was not added: all files together up to {max}","formats-image":"images","formats-video":"video","formats-audio":"audio","done":"Uploaded","done-line":"{size} · uploaded","error":"Not uploaded","error-line":"Not uploaded: {message}"}}');

/***/ },

/***/ "6e4269348082"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"runtime":{"remove":"Удалить","uploading":"Загрузка","uploading-name":"Загрузка {name}","retry":"Повторить","linkText":"Выберите файл","text":"или перетащите его сюда","not-added":"Не добавлено {n}:","reject-type":"«{name}» не подходит: можно {formats}","reject-one":"«{name}» не добавлен: сюда можно только один файл","reject-duplicate":"«{name}» уже добавлен","reject-empty":"«{name}» пустой — в нём нет данных","reject-size":"«{name}» — {size}, а можно до {max}","reject-min-size":"«{name}» — {size}, а нужно от {min}","reject-count":{"one":"«{name}» не добавлен: можно не больше {n} файла","few":"«{name}» не добавлен: можно не больше {n} файлов","many":"«{name}» не добавлен: можно не больше {n} файлов","other":"«{name}» не добавлен: можно не больше {n} файла"},"reject-total":"«{name}» не добавлен: все файлы вместе — до {max}","formats-image":"изображения","formats-video":"видео","formats-audio":"аудио","done":"Загружен","done-line":"{size} · загружен","error":"Не загрузился","error-line":"Не загрузился: {message}"}}');

/***/ },

/***/ "3694b5e2bf39"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"runtime":{"b":"B","kb":"KB","mb":"MB","gb":"GB"}}');

/***/ },

/***/ "220979cc98c6"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"runtime":{"b":"Б","kb":"КБ","mb":"МБ","gb":"ГБ"}}');

/***/ },

/***/ "3cdda2d4c43b"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases for the shim (core/js/aliases.js, standard simai.smart-component 1.3.8 §16.20). Event rows send the new name first, then the old one, with one detail; setting rows map the old attribute and property to the new; host-attribute rows (no \\"to\\") stay host attributes read by the browser or the base and are listed, refused by the shim on purpose; documentary rows (\\"shim\\": \\"none\\") record a rename the shim cannot serve.","component":"sf-file-upload","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"aria-label","to":null,"kind":"attribute","component":"sf-file-upload","since":"2026-10-27","remove_after":"2026-12-01","mode":"host-attribute","section":"§3.1","note":"stays a host attribute, read by the base (§3.1, §4.8); no shim"},{"from":"sf-file-upload:select","to":"sf-file-upload-attach","kind":"event","component":"sf-file-upload","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","cancelable":false,"section":"§8, §10.8, vocabulary 1.1.5 §9.1","note":"same detail"},{"from":"sf-file-upload:file-add","to":"sf-file-upload-attached","kind":"event","component":"sf-file-upload","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","cancelable":false,"section":"§8, §10.8, vocabulary 1.1.5 §9.1","note":"the detail adds id; the old fields are all there"},{"from":"sf-file-upload:remove","to":"sf-file-upload-detach","kind":"event","component":"sf-file-upload","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","cancelable":false,"section":"§8, §10.8, vocabulary 1.1.5 §9.1","note":"the detail adds id"},{"from":"sf-file-upload:reject","to":"sf-file-upload-rejected","kind":"event","component":"sf-file-upload","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","cancelable":false,"section":"§8, §10.8, vocabulary 1.1.5 §9.1","note":"same detail"},{"from":"sf-file-upload:retry","to":"sf-file-upload-retry","kind":"event","component":"sf-file-upload","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","cancelable":false,"section":"§8, §10.8, vocabulary 1.1.5 §9.1","note":"the detail adds id"},{"from":"sf-file-upload:file-complete","to":"sf-file-upload-completed","kind":"event","component":"sf-file-upload","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","cancelable":false,"section":"§8, §10.8, vocabulary 1.1.5 §9.1","note":"the end of the stream; the detail adds id"},{"from":"sf-file-upload:file-error","to":"sf-file-upload-failed","kind":"event","component":"sf-file-upload","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","cancelable":false,"section":"§8, §10.8, vocabulary 1.1.5 §9.1","note":"the end of the stream; the detail adds id, reason and message"},{"from":"sf-file-upload:complete","to":"sf-file-upload-finished","kind":"event","component":"sf-file-upload","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","cancelable":false,"section":"§8, §10.8, vocabulary 1.1.5 §9.1","note":"same detail"}]}');

/***/ },

/***/ "35944d444d78"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.file-upload","tag":"sf-file-upload","version":"1.2.3","kind":"leaf","settings":{"name":{"type":"string","default":""},"size":{"type":"enum","values":["1/2","1","2"],"default":"1"},"icon":{"type":"icon","default":"upload_file"},"link-text":{"type":"string","default-from":"runtime.link-text"},"text":{"type":"string","default-from":"runtime.text"},"formats":{"type":"string","default":""},"supporting-text":{"type":"string","default":""},"accept":{"type":"string","default":""},"multiple":{"type":"boolean","default":false},"max-size":{"type":"number","default":0},"min-size":{"type":"number","default":0},"max-files":{"type":"number","default":0},"max-total-size":{"type":"number","default":0},"disabled":{"type":"boolean","default":false},"required":{"type":"boolean","default":false},"items":{"type":"list","default":[],"of":{"id":"id","name":"string","file-size":{"type":"string","optional":true},"progress":{"type":"number","optional":true},"state":{"type":"enum","values":["ready","process","done","error"]},"error-message":{"type":"string","optional":true},"retry-text":{"type":"string","optional":true},"file":{"type":"object","optional":true}}},"uploader":{"type":"object","default":null}},"values":{"value":{"type":"list","default":[]}},"events":{"change":{"carries":{"files":"list","source":{"type":"enum","values":["input","drop"]}}},"attach":{"carries":{"files":{"type":"list","schema":{"items":{"type":"object"}}},"source":{"type":"enum","values":["input","drop"]},"multiple":"boolean"}},"attached":{"carries":{"id":"id","item":{"type":"object"},"index":"number","items":{"type":"list","schema":{"items":{"type":"object"}}},"source":"string","multiple":"boolean"}},"detach":{"carries":{"id":"id","item":{"type":"object"},"index":"number","items":{"type":"list","schema":{"items":{"type":"object"}}}}},"rejected":{"carries":{"files":"list","rejected":{"type":"list"},"accept":"string","source":"string"}},"retry":{"carries":{"id":"id","item":{"type":"object"},"index":"number","items":{"type":"list","schema":{"items":{"type":"object"}}}}},"begun":{"carries":{"id":"id","item":"object"}},"chunk":{"carries":{"id":"id","done":"number","total":"number","item":"object"}},"completed":{"carries":{"id":"id","item":{"type":"object"},"index":"number","items":{"type":"list","schema":{"items":{"type":"object"}}}}},"failed":{"carries":{"id":"id","item":{"type":"object"},"index":"number","items":{"type":"list","schema":{"items":{"type":"object"}}},"reason":"string","message":"string"}},"cancelled":{"carries":{"id":"id","item":"object"}},"finished":{"carries":{"items":{"type":"list","schema":{"items":{"type":"object"}}}}}},"actions":{"remove-item":{"with":{"index":"number"}},"clear":{}},"presentation":{"skeleton":{"late":["items"]}},"host-states":{"data-dragged-over":"boolean"},"css-variables":{"--sf-file-upload-background-color":{"type":"color","state":"rest"},"--sf-file-upload-border-color":{"type":"color","state":"rest"},"--sf-file-upload-radius":{"type":"length"},"--sf-file-upload-link-color":{"type":"color","state":"rest"},"--sf-file-upload-text-color":{"type":"color","state":"rest"},"--sf-file-upload-dragged-over-background-color":{"type":"color","state":"dragged-over"},"--sf-file-upload-dragged-over-border-color":{"type":"color","state":"dragged-over"}},"form":{"value":"value","name":"name","default":"value","submits":"value","reset":"default","required":"required","disabled":"disabled","validity":["value-missing","custom-error"]}}');

/***/ },

/***/ "8623c4e59417"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"File Upload","runtime":{"done":"Uploaded","done-line":"{size} · uploaded","error":"Not uploaded","error-line":"Not uploaded: {message}","formats-audio":"audio","formats-image":"images","formats-video":"video","link-text":"Click to upload","not-added":"Not added: {n}","reject-count":{"one":"“{name}” was not added: up to {n} file","other":"“{name}” was not added: up to {n} files"},"reject-duplicate":"“{name}” is already in the list","reject-empty":"“{name}” is empty","reject-min-size":"“{name}” is {size}; it must be at least {min}","reject-one":"“{name}” was not added: this field takes one file","reject-size":"“{name}” is {size}; the limit is {max}","reject-total":"“{name}” was not added: all files together up to {max}","reject-type":"“{name}” is not accepted: allowed {formats}","remove":"Remove","remove-failed":"Remove or retry the files that failed","retry":"Try again","text":"or drag and drop","uploading":"Uploading","value-missing":"Add a file","value-missing-many":"Add at least one file","wait-for-uploads":"Wait until the files are uploaded"}}');

/***/ },

/***/ "d49e89d651d7"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Загрузка файлов","runtime":{"done":"Загружен","done-line":"{size} · загружен","error":"Не загрузился","error-line":"Не загрузился: {message}","formats-audio":"аудио","formats-image":"изображения","formats-video":"видео","link-text":"Выберите файл","not-added":"Не добавлено {n}:","reject-count":{"one":"«{name}» не добавлен: можно не больше {n} файла","few":"«{name}» не добавлен: можно не больше {n} файлов","many":"«{name}» не добавлен: можно не больше {n} файлов","other":"«{name}» не добавлен: можно не больше {n} файла"},"reject-duplicate":"«{name}» уже добавлен","reject-empty":"«{name}» пустой — в нём нет данных","reject-min-size":"«{name}» — {size}, а нужно от {min}","reject-one":"«{name}» не добавлен: сюда можно только один файл","reject-size":"«{name}» — {size}, а можно до {max}","reject-total":"«{name}» не добавлен: все файлы вместе — до {max}","reject-type":"«{name}» не подходит: можно {formats}","remove":"Удалить","remove-failed":"Уберите или повторите файлы с ошибкой","retry":"Повторить","text":"или перетащите его сюда","uploading":"Загрузка","value-missing":"Добавьте файл","value-missing-many":"Добавьте хотя бы один файл","wait-for-uploads":"Дождитесь, пока файлы загрузятся"}}');

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