/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "e6d86f2cd058"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

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
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("06e8cd089f28");
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
// (component/inputs/scss/_field-ladder.scss). The textarea and the rich text
// followed (2026-11-14), then the dropdown, the file upload area and the image
// field (queue #70, 2026-11-16): every field of the family stands on the
// ladder. FIELD_SIZES, fieldSize and retireFieldSizeClass stay for the lines
// of tags, badges and avatars and for a file's row, which keep three sizes.

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

/***/ },

/***/ "c43efa1014a6"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

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
/* harmony export */   removeFileUploadItem: () => (/* binding */ removeFileUploadItem),
/* harmony export */   retryFileUploadItem: () => (/* binding */ retryFileUploadItem),
/* harmony export */   setFileUploadItems: () => (/* binding */ setFileUploadItems),
/* harmony export */   takeFiles: () => (/* binding */ takeFiles),
/* harmony export */   unbindFileUpload: () => (/* binding */ unbindFileUpload)
/* harmony export */ });
/* harmony import */ var _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d7f974466839");
/* harmony import */ var _register_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("58661bec99a6");
/* harmony import */ var _field_size__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("e6d86f2cd058");
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("8489d1f5bab4");
/* harmony import */ var _core_js_format_file_size_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("c016c43b1452");
/* harmony import */ var _core_js_composition_file_size_mjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("fb0bdf7719f0");
/* harmony import */ var _intake_mjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("ab7ec7cd175d");
/* harmony import */ var _lang_index_mjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("a5334b2b6512");






 // The words live in the component's language files (localization study LC-4):
// one place for every language, as the Smart components keep them.

 // Every word this part says. A product adds a language with
// SF.language.register('sf-file-upload', code, words); a ternary on «ru» allowed two
// and no more.

const FILE_UPLOAD_ITEM_TEXT = _lang_index_mjs__WEBPACK_IMPORTED_MODULE_7__["default"];
const FILE_UPLOAD_SELECTOR = '.sf-file-upload';
const FILE_UPLOAD_BOUND_FLAG = 'sfFileUploadBound';

function toBoolean(value, fallback = false) {
  if (value === undefined || value === null || value === '') return fallback;
  if (typeof value === 'boolean') return value;
  return ['1', 'true', 'yes', 'on', 'disabled', 'multiple'].includes(String(value).toLowerCase());
} // The area stands on the field ladder's five steps (field-size.js
// FIELD_LADDER; queue #70). A file's row is the file family's row
// (sf-file-preview's markup, C81, C260): one height at every size of the
// area.


function normalizeSize(value) {
  return (0,_field_size__WEBPACK_IMPORTED_MODULE_2__.ladderSize)(value);
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

  while (next?.classList?.contains('sf-file-upload-message') || next?.classList?.contains('sf-file-upload-status')) next = next.nextElementSibling;

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
} // The rows this part names and switches off: its own (the family row's class
// markup) and hand-written .sf-upload-progress rows.


const CLASS_ROW = '.sf-upload-progress, .sf-file-upload-item > .sf-file-preview';
const CLASS_ROWS = ':is(.sf-upload-progress, .sf-file-upload-item > .sf-file-preview)';
const CLASS_ROW_NAME = '.sf-upload-progress-name, .sf-file-preview-name';

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
  const files = getFilesContainer(root); // The class rows only: the ones this part draws (the family row's class
  // markup, .sf-file-upload-item > .sf-file-preview) and hand-written
  // .sf-upload-progress rows. A Smart area's rows are sf-file-preview
  // elements, which name their own buttons («Убрать <имя>», «Повторить <имя>»).

  files?.querySelectorAll(':scope > .sf-file-upload-item > .sf-file-preview').forEach(row => {
    row.classList.toggle('disabled', disabled);
    if (disabled) row.setAttribute('aria-disabled', 'true');else row.removeAttribute('aria-disabled');
  });
  files?.querySelectorAll(`${CLASS_ROWS} button[data-action="remove"], ${CLASS_ROWS} button[data-action="retry"]`).forEach(button => {
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
      const name = button.closest(CLASS_ROW)?.querySelector(CLASS_ROW_NAME)?.textContent?.trim() || ''; // The name has its place in the word ({name}, remove-name / retry-name),
      // so a language that puts it first can (C177 follow-up). A retry button
      // the author wrote another word on keeps that word before the name; the
      // icon-only retry (C260) carries its word in data-word.

      const retry = button.dataset.action === 'retry';
      const word = retry ? (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageText)(FILE_UPLOAD_ITEM_TEXT, 'retry', root, 'sf-file-upload') : (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageText)(FILE_UPLOAD_ITEM_TEXT, 'remove', root, 'sf-file-upload');
      const named = retry ? (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageText)(FILE_UPLOAD_ITEM_TEXT, 'retry-name', root, 'sf-file-upload') : (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageText)(FILE_UPLOAD_ITEM_TEXT, 'remove-name', root, 'sf-file-upload');
      const text = retry ? (button.dataset.word || (button.querySelector?.('.sf-button-text-container') || button).textContent).trim() : '';
      const own = text && text !== word ? text : '';
      const label = own ? `${own} ${name}`.trim() : name ? named.replace('{name}', name) : word;
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

  files?.querySelectorAll(CLASS_ROWS).forEach(item => {
    const name = item.querySelector(CLASS_ROW_NAME)?.textContent?.trim() || ''; // The name has its place in the words ({name}), so a language that puts
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
} // The pictures a browser draws from a chosen file's own bytes (C81: a photo's
// thumbnail in its row), as the Smart area draws them. A video's frame and a
// PDF's page are the host's imageUrl: the component never decodes them.


const DRAWN_PICTURES = /^image\/(?:png|jpeg|gif|webp|avif|bmp|svg\+xml)$/u;

function rowPicture(root, item) {
  const given = item?.imageUrl ?? item?.['image-url'];
  if (given) return String(given);
  const file = item?.file;
  if (typeof Blob === 'undefined' || !(file instanceof Blob) || !DRAWN_PICTURES.test(String(file.type || ''))) return '';
  if (typeof URL?.createObjectURL !== 'function') return '';
  const pictures = root.__sfFileUploadPictures ||= new Map();
  if (!pictures.has(file)) pictures.set(file, URL.createObjectURL(file));
  return pictures.get(file);
} // A chosen photo's address lives while its file is listed.


function releaseRowPictures(root, items = []) {
  const pictures = root?.__sfFileUploadPictures;
  if (!pictures?.size) return;
  const listed = new Set(items.map(item => item?.file).filter(Boolean));

  for (const [file, address] of [...pictures]) {
    if (listed.has(file)) continue;
    pictures.delete(file);
    URL.revokeObjectURL?.(address);
  }
} // A row is the file family's row (owner decisions C81 and C149), the class
// markup of the sf-file-preview row the Smart area draws: the picture of a
// photo or the type's glyph in the grey holder, the name and under it one
// line -- the size (ready; «size · загружен» when sent), the bar (uploading)
// or the reason (error) -- and the actions at the end: «Повторить» on a
// failed file, «×» «Убрать <имя>» on every one. One height in every state
// and at every zone size: the class row stacked the bar and the retry under
// the text, so a list of four files was 44 / 68 / 44 / 84 and jumped at each
// change of state (RG-FU-1).
// «Повторить» as the icon alone, the Smart row's (owner decision C260): the
// sheet draws it in place of the button with words in a row too narrow for
// them (sf-file-preview, the container step g2). Named «Повторить <имя>» by
// the list's labelling, «Повторить» in the Framework's plain tooltip, which
// the anchor links to the button.


function createRetryIcon(word) {
  const anchor = document.createElement('span');
  anchor.className = 'sf-file-preview-retry-icon sf-tooltip-anchor';
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'sf-icon-button sf-icon-button--icon sf-icon-button--ghost sf-icon-button--primary sf-icon-button--size-1';
  button.dataset.action = 'retry';
  button.dataset.tooltip = '';
  button.dataset.word = word;
  const glyph = document.createElement('i');
  glyph.className = 'sf-icon';
  glyph.setAttribute('aria-hidden', 'true');
  glyph.textContent = 'refresh';
  button.append(glyph);
  const tip = document.createElement('span');
  tip.className = 'sf-tooltip sf-tooltip--dark sf-tooltip--size-1/3';
  tip.setAttribute('aria-hidden', 'true');
  tip.hidden = true;
  const content = document.createElement('span');
  content.className = 'sf-tooltip-content';
  const text = document.createElement('span');
  text.className = 'sf-tooltip-text';
  text.textContent = word;
  content.append(text);
  tip.append(content);
  anchor.append(button, tip);
  return anchor;
}

function createUploadProgressItem(item, owner = null) {
  const row = describeUploadItem(item, owner, 'done');
  const {
    state,
    progress
  } = row;
  const wrap = document.createElement('div');
  wrap.className = 'sf-file-upload-item';
  wrap.setAttribute('role', 'listitem');
  const root = document.createElement('div');
  root.className = ['sf-file-preview', 'sf-file-preview--row', state === 'process' ? 'sf-file-preview--uploading' : '', state === 'error' ? 'sf-file-preview--error' : ''].filter(Boolean).join(' ');
  root.dataset.state = state;
  root.setAttribute('role', 'group');
  root.setAttribute('aria-label', row.name);
  if (state === 'process') root.setAttribute('aria-busy', 'true');
  const holder = document.createElement('span');
  holder.className = 'sf-file-preview-holder';
  const picture = owner ? rowPicture(owner, item) : '';

  if (picture) {
    holder.classList.add('sf-file-preview-holder--picture');
    const image = document.createElement('img');
    image.className = 'sf-file-preview-thumbnail';
    image.src = picture;
    image.alt = '';
    image.decoding = 'async';
    holder.append(image);
  } else {
    const glyph = document.createElement('i');
    glyph.className = 'sf-icon'; // The glyphs are pictures: their ligature names were read as text (docs
    // pre-check 2026-11-10 FU-03).

    glyph.setAttribute('aria-hidden', 'true'); // The type's glyph in every state, as the Smart row: the error is said by
    // the reason line in the error colour.

    glyph.textContent = uploadItemIcon(item, 'ready');
    holder.append(glyph);
  }

  const main = document.createElement('span');
  main.className = 'sf-file-preview-main';
  const nameNode = document.createElement('span');
  nameNode.className = 'sf-file-preview-name';
  nameNode.title = row.name;
  nameNode.textContent = row.name;
  main.append(nameNode);

  if (state === 'process') {
    // A chosen file that is not being sent, and a sent one, have no bar: there
    // is no transfer to show (FU-3, FU-4). The bar stands in the size line's
    // place, the size 1/2 bar with its per cent at the end (C131 (4)).
    const holderBar = document.createElement('span');
    holderBar.className = 'sf-file-preview-progress';
    const progressBar = document.createElement('div');
    progressBar.className = 'sf-progress-bar sf-progress-bar--size-1/2 flex flex-row items-cross-center';
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
    holderBar.append(progressBar);
    main.append(holderBar);
  } else if (state === 'error') {
    const reason = document.createElement('span');
    reason.className = 'sf-file-preview-error';
    reason.textContent = row.line;
    main.append(reason);
  } else if (row.line) {
    const line = document.createElement('span');
    line.className = 'sf-file-preview-meta sf-file-preview-size';
    line.textContent = row.line;
    main.append(line);
  }

  const actions = document.createElement('span');
  actions.className = 'sf-file-preview-actions';

  if (state === 'error') {
    // «Повторить» ends the row, first of its buttons (C88), the button the
    // Smart row draws: ghost, primary, size 1, on the rung of «×» beside it
    // (C103; it was the low button, 32 beside 40).
    const retryHost = document.createElement('span');
    retryHost.className = 'sf-file-preview-retry';
    const retry = document.createElement('button');
    retry.type = 'button';
    retry.className = 'sf-button sf-button--size-1 sf-button--ghost sf-button--link sf-button--primary flex items-cross-center';
    retry.dataset.action = 'retry';
    const retryIcon = document.createElement('i');
    retryIcon.className = 'sf-icon pointer-events-none';
    retryIcon.setAttribute('aria-hidden', 'true');
    retryIcon.textContent = 'refresh';
    const retryText = document.createElement('span');
    retryText.className = 'sf-button-text-container text-center pointer-events-none';
    retryText.textContent = row.retryText;
    retry.append(retryIcon, retryText);
    retryHost.append(retry);
    actions.append(retryHost, createRetryIcon(row.retryText));
  } // Every state can be taken out of the list: «×» «Убрать <имя>», nothing is
  // erased (C149 (8)); the trash is a stored file's, in sf-file-preview.


  const removeButton = document.createElement('button');
  removeButton.type = 'button';
  removeButton.className = 'sf-icon-button sf-icon-button--icon sf-icon-button--ghost sf-icon-button--on-surface sf-icon-button--size-1';
  removeButton.dataset.action = 'remove';
  const removeIcon = document.createElement('i');
  removeIcon.className = 'sf-icon';
  removeIcon.setAttribute('aria-hidden', 'true');
  removeIcon.textContent = 'close';
  removeButton.append(removeIcon);
  actions.append(removeButton);
  root.append(holder, main, actions);
  wrap.append(root);
  return wrap;
} // The focus inside the list keeps its place when the rows are drawn again: a
// row taken out gives it to the row that took its place (the previous one
// when it was the last), the area when none is left (C81, accessibility). The
// list was rebuilt whole and the focus fell to the page's start (RG-FU-3).


function listFocus(container) {
  const active = container?.ownerDocument?.activeElement;
  if (!active || !container.contains(active)) return null;
  const row = active.closest('[data-index]');
  return {
    index: Number(row?.dataset.index) || 0,
    action: active.dataset?.action || ''
  };
}

function restoreListFocus(root, container, held) {
  if (!held) return;
  const rows = container.querySelectorAll(':scope > [data-index]');
  const row = rows[Math.min(held.index, rows.length - 1)]; // A failed row holds «Повторить» twice, with words and as the icon alone;
  // the sheet draws one of them (C260): the focus goes to the drawn one.

  const drawn = selector => [...(row?.querySelectorAll(selector) || [])].find(button => button.getClientRects().length > 0);

  const target = held.action && drawn(`button[data-action="${held.action}"]:not(:disabled)`) || drawn('button[data-action="remove"]:not(:disabled)') || root;
  target?.focus?.({
    preventScroll: true
  });
}

function renderFileUploadItems(root, items = []) {
  root?.classList?.toggle?.('has-files', items.length > 0);
  const container = getFilesContainer(root);

  if (!container || isManagedRenderRoot(root)) {
    if (root) syncFileUploadInteraction(root);
    return;
  }

  const held = listFocus(container);
  container.replaceChildren(); // The rows are a list (C81), as the Smart area's.

  if (items.length && !container.hasAttribute('role')) container.setAttribute('role', 'list');
  items.forEach((item, index) => {
    const node = createUploadProgressItem(item, root);
    node.dataset.index = String(index);
    container.append(node);
  });
  releaseRowPictures(root, items);
  syncFileUploadInteraction(root);
  restoreListFocus(root, container, held);
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
  const said = [];
  nextItems.forEach((item, index) => {
    const key = getItemEventKey(item, index);
    const nextState = normalizeItemState(item);
    const prevState = previousMap.get(key);

    if (nextState === 'error' && prevState !== 'error') {
      emitFileUploadItemError(root, item, index, nextItems); // A list set from scratch (a stored value) is not news.

      if (prevState !== undefined) {
        const message = String(item?.errorMessage || item?.error || '');
        said.push(fileUploadWord(root, message ? 'said-error-line' : 'said-error', {
          vars: {
            name: itemName(item),
            message
          }
        }));
      }
    }

    if (nextState === 'done' && prevState !== 'done') {
      emitFileUploadItemComplete(root, item, index, nextItems);
      if (prevState !== undefined) said.push(fileUploadWord(root, 'said-done', {
        vars: {
          name: itemName(item)
        }
      }));
    }
  });
  announceFileUpload(root, said);
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
} // options.action says how the file left: remove («×», taken out of the list)
// or delete (a stored file the person chose to erase; C149 (8)). detach
// carries it, so the page knows which one to answer.


function removeFileUploadItem(root, index, options = {}) {
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
      items: currentItems,
      action: options?.action === 'delete' ? 'delete' : 'remove'
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
  announceFileUpload(root, [added.length === 1 ? fileUploadWord(root, 'said-added', {
    vars: {
      name: itemName(added[0])
    }
  }) : fileUploadWord(root, 'said-added-many', {
    count: added.length
  })]);
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
// after it when it is bound: a live region made at the moment of its first
// words is often not heard (RG-FU-4).


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
} // What happened to the list, for a screen reader only (C81, accessibility):
// a file added, sent, or not sent, said politely; the per cent is not said.
// A region of its own beside the message, made with the area (the Smart
// template and the class draw it): the message is seen and says only what
// was left out.


function getStatus(root, create = false) {
  if (!root) return null;
  let next = root.nextElementSibling;
  if (next?.classList?.contains('sf-file-upload-message')) next = next.nextElementSibling;
  if (next?.classList?.contains('sf-file-upload-status')) return next;
  if (!create || isManagedRenderRoot(root) || typeof document === 'undefined') return null;
  const anchor = getMessage(root, true);
  if (!anchor) return null;
  const status = document.createElement('div');
  status.className = 'sf-file-upload-status';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-atomic', 'true');
  anchor.after(status);
  return status;
}

function announceFileUpload(root, lines = []) {
  const said = lines.filter(Boolean);
  if (!said.length) return;
  const status = getStatus(root);
  if (!status) return;
  const text = said.join('. '); // The same words again (a second file of one name) are said again: the
  // region is emptied first.

  if (status.textContent === text) status.textContent = '';
  status.textContent = text;
}

function itemName(item) {
  return String(item?.name || item?.fileName || item?.file?.name || '');
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
} // The words about dragging («или перетащите их сюда») are a part of their
// own, so a screen that cannot drag hides them (owner decision C223): the
// author's markup wrote them as bare text after the link; they are put in
// .sf-file-upload-drag when the zone is bound.


function wrapDragWords(root) {
  const block = root?.querySelector?.('.sf-file-upload-block-text');
  if (!block || block.querySelector('.sf-file-upload-drag')) return; // Only the words after the link: without a link the text is the zone's
  // whole call and stays.

  const link = block.querySelector('.sf-file-upload-link');
  if (!link) return;
  const loose = Array.from(block.childNodes).filter(node => node.nodeType === 3 && node.textContent.trim() && link.compareDocumentPosition(node) & 4);
  if (!loose.length) return;
  const drag = document.createElement('span');
  drag.className = 'sf-file-upload-drag';
  drag.textContent = loose.map(node => node.textContent).join('').trim();
  loose[0].before(' ', drag);
  loose.forEach(node => node.remove());
}

function bindFileUpload(root) {
  // The area stands on the field ladder: 1/3 and 3 are its own steps, no
  // class to move.
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
  } // The live regions stand from the start (RG-FU-4).


  getStatus(root, true);
  if (!isManagedRenderRoot(root)) wrapDragWords(root);

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
    if (target.closest('.sf-upload-progress-repeat, [data-action="retry"]')) return;
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

    const itemNode = (removeButton || retryButton).closest('[data-index], .sf-upload-progress');
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
    const drag = document.createElement('span');
    drag.className = 'sf-file-upload-drag';
    drag.textContent = text ?? (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageText)(FILE_UPLOAD_ITEM_TEXT, 'text', root, 'sf-file-upload');
    blockText.append(link, ' ', drag);
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
    const status = document.createElement('div');
    status.className = 'sf-file-upload-status';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-atomic', 'true');
    const files = document.createElement('div'); // The rows' list, as the Smart area's (C81).

    files.className = 'sf-file-upload-files grid grid-col-1 gap-1/2 w-full';
    files.setAttribute('role', 'list');
    wrapper.append(root, message, status, files);
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

/***/ "f49a716b86bd"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ALIAS_KINDS: () => (/* binding */ ALIAS_KINDS),
/* harmony export */   ALIAS_MODES: () => (/* binding */ ALIAS_MODES),
/* harmony export */   TAG_ALIAS_KIND: () => (/* binding */ TAG_ALIAS_KIND),
/* harmony export */   aliasExpired: () => (/* binding */ aliasExpired),
/* harmony export */   propertyOf: () => (/* binding */ propertyOf),
/* harmony export */   readAliasTable: () => (/* binding */ readAliasTable),
/* harmony export */   readTagAliases: () => (/* binding */ readTagAliases)
/* harmony export */ });
// The dated alias table of one component (standard simai.smart-component
// 1.3.8 §16.20, vocabulary 1.1.5 §9): what the migration converter writes as
// <component>/aliases.json, read and checked here before core/js/aliases.js
// installs it on an element. Pure data, no DOM, so a build, a lint and the
// runtime share one reading of it.
//
// A table is a list of rows, or {tag, aliases: [rows]}. A row:
//
//   {from, to, kind, since, remove_after, mode?, when?, setting?, tag?}
//
//   kind      event | setting | attribute | action | value
//   since     the first day the new name exists, YYYY-MM-DD
//   remove_after
//             the last day the old name is promised, YYYY-MM-DD
//   mode      events only: same-detail (default) | detail-adds | split
//   when      events only, optional: {<detail field>: <value>}; the old name
//             is sent only for a new event whose detail matches (two old
//             names folded into one new name, as modal:after-hide and
//             modal:after-show into change)
//   setting   values only: the attribute the value belongs to
//
// A row that does not hold is refused with a reason, never thrown: the rest of
// the table still installs, and the refusals are reported.
//
// A `tag` row renames the element itself ({from: 'sf-close', to:
// 'sf-button-close', kind: 'tag', since, remove_after}). It is not installed on
// an element: the Smart base defines the old tag as a subclass when it defines
// the new one (core/js/tag-aliases.js), so readAliasTable leaves it out and
// readTagAliases reads it.
const ALIAS_KINDS = Object.freeze(['event', 'setting', 'attribute', 'action', 'value']);
const ALIAS_MODES = Object.freeze(['same-detail', 'detail-adds', 'split']);
const DAY = 86400000;
const DATE = /^\d{4}-\d{2}-\d{2}$/u;
const ATTRIBUTE = /^[a-z][a-z0-9-]*$/u;
const MEMBER = /^[A-Za-z_$][\w$]*$/u;

function dateOf(text) {
  if (typeof text !== 'string' || !DATE.test(text)) return NaN;
  const time = Date.parse(`${text}T00:00:00Z`); // 2026-02-30 parses in some engines; it must print back as itself.

  return Number.isNaN(time) || new Date(time).toISOString().slice(0, 10) !== text ? NaN : time;
} // `remove_after` is the last promised day, whole, in UTC: the old name is
// open until the end of it and expired from the next midnight.


function aliasExpired(row, now = Date.now()) {
  const last = dateOf(row?.remove_after);
  return Number.isFinite(last) && now >= last + DAY;
} // kebab-case attribute -> camelCase property: backdrop-blur -> backdropBlur.

function propertyOf(attribute) {
  return String(attribute).replace(/-([a-z0-9])/gu, (_, letter) => letter.toUpperCase());
}
const TAG_ALIAS_KIND = 'tag'; // A custom element name of the Framework or of a package: lower case, a hyphen.

const ELEMENT = /^[a-z][a-z0-9]*-[a-z0-9-]+$/u;

function primitive(value) {
  return value === null || ['string', 'number', 'boolean'].includes(typeof value);
}

function checkRow(row) {
  if (!row || typeof row !== 'object' || Array.isArray(row)) return 'not-an-object';
  const {
    from,
    to,
    kind,
    since,
    mode = 'same-detail',
    when,
    setting
  } = row;
  if (!ALIAS_KINDS.includes(kind)) return 'unknown-kind';
  if (typeof from !== 'string' || !from) return 'no-from';
  if (to === null || to === undefined || to === '') return 'no-new-name';
  if (typeof to !== 'string') return 'no-to';
  if (from === to) return 'same-name';
  const start = dateOf(since);
  const end = dateOf(row.remove_after);
  if (Number.isNaN(start)) return 'bad-since';
  if (Number.isNaN(end)) return 'bad-remove-after';
  if (end < start) return 'remove-after-before-since';
  if (!ALIAS_MODES.includes(mode)) return 'unknown-mode';
  if (kind !== 'event' && mode !== 'same-detail') return 'mode-on-non-event';

  if (when !== undefined) {
    if (kind !== 'event') return 'when-on-non-event';
    if (!when || typeof when !== 'object' || Array.isArray(when) || !Object.values(when).every(primitive)) return 'bad-when';
  }

  if (kind === 'setting' || kind === 'attribute') {
    if (!ATTRIBUTE.test(from) || !ATTRIBUTE.test(to)) return 'bad-attribute-name';
  }

  if (kind === 'action' && (!MEMBER.test(from) || !MEMBER.test(to))) return 'bad-member-name';

  if (kind === 'value') {
    if (typeof setting !== 'string' || !ATTRIBUTE.test(setting)) return 'value-needs-setting';
  } else if (setting !== undefined) {
    return 'setting-on-non-value';
  }

  return null;
}

function normal(row, tag) {
  const out = {
    kind: row.kind,
    from: row.from,
    to: row.to,
    since: row.since,
    remove_after: row.remove_after,
    tag: typeof row.tag === 'string' && row.tag ? row.tag : tag
  };

  if (row.kind === 'event') {
    out.mode = row.mode || 'same-detail';
    if (row.when) out.when = { ...row.when
    };
  }

  if (row.kind === 'value') out.setting = row.setting;
  return Object.freeze(out);
} // -> {tag, rows: [frozen rows], refused: [{index, from, to, kind, reason}]}


function readAliasTable(table, {
  tag = ''
} = {}) {
  const list = Array.isArray(table) ? table : table?.aliases;
  const owner = !Array.isArray(table) && typeof table?.tag === 'string' && table.tag || tag || '';
  const rows = [];
  const refused = [];

  if (!Array.isArray(list)) {
    refused.push({
      index: -1,
      from: null,
      to: null,
      kind: null,
      reason: 'not-a-table'
    });
    return {
      tag: owner,
      rows,
      refused
    };
  }

  const refuse = (index, row, reason) => refused.push({
    index,
    from: row?.from ?? null,
    to: row?.to ?? null,
    kind: row?.kind ?? null,
    reason
  });

  const seen = new Map();
  list.forEach((row, index) => {
    if (row?.kind === TAG_ALIAS_KIND) return;
    const reason = checkRow(row);
    if (reason) return refuse(index, row, reason);
    const one = normal(row, owner); // An attribute, a property or a method has one new name; an event's old
    // name may be sent beside several new ones (split, folded names).

    const identity = one.kind === 'event' ? `event|${one.from}|${one.to}|${JSON.stringify(one.when ?? null)}` : one.kind === 'value' ? `value|${one.setting}|${one.from}` : `${one.kind === 'action' ? 'action' : 'name'}|${one.from}`;
    const before = seen.get(identity);
    if (before) return refuse(index, row, before.to === one.to ? 'duplicate' : 'conflict');
    seen.set(identity, one);
    rows.push({
      index,
      row: one
    });
  }); // Two old names folded into one new name by their detail: without `when`
  // each would be sent on every new event, the wrong one among them.

  const folded = new Map();

  for (const entry of rows) {
    const {
      row
    } = entry;
    if (row.kind !== 'event' || row.mode === 'same-detail' || row.when) continue;
    folded.set(row.to, [...(folded.get(row.to) ?? []), entry]);
  }

  const ambiguous = new Set();

  for (const group of folded.values()) if (group.length > 1) for (const entry of group) ambiguous.add(entry);

  const kept = [];

  for (const entry of rows) {
    if (ambiguous.has(entry)) refuse(entry.index, entry.row, 'needs-when');else kept.push(entry.row);
  }

  refused.sort((a, b) => a.index - b.index);
  return {
    tag: owner,
    rows: kept,
    refused
  };
} // The `tag` rows of a table: -> {tag, rows: [{from, to, since, remove_after}],
// refused: [{index, from, to, reason}]}. A row renames the table's own tag:
// its `to` is that tag when the table names one.

function readTagAliases(table, {
  tag = ''
} = {}) {
  const list = Array.isArray(table) ? table : table?.aliases;
  const owner = !Array.isArray(table) && typeof table?.component === 'string' && table.component || !Array.isArray(table) && typeof table?.tag === 'string' && table.tag || tag || '';
  const rows = [];
  const refused = [];
  if (!Array.isArray(list)) return {
    tag: owner,
    rows,
    refused
  };
  const seen = new Set();
  list.forEach((row, index) => {
    if (row?.kind !== TAG_ALIAS_KIND) return;

    const refuse = reason => refused.push({
      index,
      from: row.from ?? null,
      to: row.to ?? null,
      reason
    });

    if (typeof row.from !== 'string' || !ELEMENT.test(row.from)) return refuse('bad-old-tag');
    if (typeof row.to !== 'string' || !ELEMENT.test(row.to)) return refuse('bad-new-tag');
    if (row.from === row.to) return refuse('same-name');
    if (owner && row.to !== owner) return refuse('not-this-tag');
    const start = dateOf(row.since);
    const end = dateOf(row.remove_after);
    if (Number.isNaN(start)) return refuse('bad-since');
    if (Number.isNaN(end)) return refuse('bad-remove-after');
    if (end < start) return refuse('remove-after-before-since');
    if (seen.has(row.from)) return refuse('duplicate');
    seen.add(row.from);
    rows.push(Object.freeze({
      from: row.from,
      to: row.to,
      since: row.since,
      remove_after: row.remove_after
    }));
  });
  return {
    tag: owner,
    rows,
    refused
  };
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
// <html data-sf-deprecations="warn"> or SF.deprecations.warn = true. A dated
// alias (core/js/aliases.js, standard simai.smart-component §16.20) also
// records `tag`, `since` and `remove_after`; once its date has passed the
// record turns `expired` and that is printed once whatever the page opted
// into, because the name can leave with the next sweep.
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
  to = null,
  tag,
  since,
  remove_after: removeAfter,
  expired,
  package: pkg
} = {}) {
  if (!from) return;
  const key = [component, kind, attribute, from].join('|');
  const notes = sharedNotes();
  let note = notes.get(key);
  const firstExpiry = expired === true && note?.expired !== true;

  if (note) {
    note.count += 1;
  } else {
    note = {
      component,
      kind,
      attribute,
      from,
      to,
      count: 1
    };
    notes.set(key, note);
  } // The dated fields are kept only when a caller knows them, so the records of
  // the Framework's undated aliases keep their shape.


  if (tag !== undefined) note.tag = tag;
  if (since !== undefined) note.since = since;
  if (removeAfter !== undefined) note.remove_after = removeAfter; // The component package that ships the new name, for a package's element.

  if (pkg) note.package = pkg;
  if (expired === true) note.expired = true;

  if (firstExpiry) {
    globalThis.console?.warn?.(`[SIMAI Framework] ${describe(note)} was due to leave after ${note.remove_after || 'its date'}${to ? `; write ${to}` : ''}. See contracts/changes/journal.json.`);
  } else if (note.count === 1 && warnEnabled()) {
    globalThis.console?.warn?.(`[SIMAI Framework] ${describe(note)} is a legacy name${note.remove_after ? ` until ${note.remove_after}` : ''}${to ? `; write ${to}` : ''}. See contracts/changes/journal.json.`);
  }
}

function describe({
  component,
  kind,
  attribute,
  from
}) {
  const where = component ? `${component}: ` : '';
  const what = kind === 'value' ? `${attribute}="${from}"` : `${kind} ${from}`;
  return `${where}${what}`;
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

/***/ "e577837dd70a"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

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

/***/ },

/***/ "c016c43b1452"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FILE_SIZE_UNITS: () => (/* binding */ FILE_SIZE_UNITS),
/* harmony export */   fileSizeUnits: () => (/* binding */ fileSizeUnits),
/* harmony export */   formatFileSize: () => (/* binding */ formatFileSize)
/* harmony export */ });
/* harmony import */ var _format_intl_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("15b4e93ff6ed");
/* harmony import */ var _lang_file_size_index_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("4294700087dc");
// File sizes in the page's language («1,4 МБ»), with no top-level side
// effects (format-intl.js). The same functions as core/js/format.js,
// composition/file-size.mjs and SF.format.fileSize.
 // The four words of a size live in core's language files
// (core/js/lang/file-size, localization study LC-3): English ships in the
// bundle; Russian and any other language take the words their language file
// or a product registers for `sf-file-size` (owner decision C282;
// SF.language.register('sf-file-size', 'de', {b, kb, mb, gb})), else the
// English words with its own digits. A component with words of its own passes
// them as `units`. The registry is read from the shared global the page
// language keeps (core/js/page-language.js), so this module still runs
// nothing on load.


const UNIT_KEYS = /* @__PURE__ */Object.freeze(['b', 'kb', 'mb', 'gb']);

function unitsOf(words) {
  return Object.freeze(UNIT_KEYS.map(key => words[key]));
}

function registeredUnits(code) {
  const words = globalThis.__sfPageLanguage?.registered?.get?.('sf-file-size')?.get?.(code);
  return words && UNIT_KEYS.every(key => typeof words[key] === 'string') ? unitsOf(words) : null;
} // The built-in languages' units (English; owner decision C282), and `ru` as
// before for a reader of SF.format.FILE_SIZE_UNITS.ru: the units the ru
// language file registered, null until it is on the page.


function unitTable(words) {
  const table = {};

  for (const [code, own] of Object.entries(words)) table[code] = unitsOf(own);

  if (!table.ru) Object.defineProperty(table, 'ru', {
    enumerable: true,
    get: () => registeredUnits('ru')
  });
  return Object.freeze(table);
}

const FILE_SIZE_UNITS = /* @__PURE__ */unitTable(_lang_file_size_index_mjs__WEBPACK_IMPORTED_MODULE_1__["default"]);
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

/***/ },

/***/ "15b4e93ff6ed"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   formatLocale: () => (/* binding */ formatLocale),
/* harmony export */   intlFormatter: () => (/* binding */ intlFormatter),
/* harmony export */   toDate: () => (/* binding */ toDate)
/* harmony export */ });
/* harmony import */ var _page_language_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("8489d1f5bab4");
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

/***/ },

/***/ "c9ce0852ac73"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   formatNumber: () => (/* binding */ formatNumber),
/* harmony export */   numberOptions: () => (/* binding */ numberOptions),
/* harmony export */   percentSign: () => (/* binding */ percentSign),
/* harmony export */   percentText: () => (/* binding */ percentText)
/* harmony export */ });
/* harmony import */ var _format_intl_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("15b4e93ff6ed");
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
 *   share             a share 0..1 as 12 % (0.125 is 12,5 %)
 *   percent           the same share: the charts' word, kept
 *   unit-percent      a value that already is the percent (12.5 is 12,5 %),
 *                     as the property type `percent` stores it
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
  }; // Two meanings of «percent» met in the Framework (C294, MP-4): this word
  // multiplies a share by 100, while the property type `percent` holds the
  // percent itself. `share` says which one it is; `percent` stays its alias for
  // the charts that write it, and `unit-percent` is the percent itself.

  if (word === 'share' || word === 'percent') return {
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
  const text = (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.intlFormatter)('NumberFormat', (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.formatLocale)(where), options).format(number);
  return options.style === 'percent' || options.unit === 'percent' ? percentSign(text) : text;
}
/**
 * One spelling of a per cent in every language (owner decision C203 (3), DEV
 * msg-913fd9e4, 2026-11-15): the number, a no-break space (U+00A0) and «%» --
 * «72 %», «12,5 %», and «72 %» in English too, where Intl writes «72%». A
 * language that writes the sign first («%72») keeps its order.
 */

function percentSign(text) {
  // A right-to-left language writes direction marks around the sign («12.5‎%‎»
  // in Arabic); they go with the space it had, and the number keeps the mark
  // it starts with (C294).
  return String(text).replace(/[\s\u00a0\u202f\u200e\u200f\u061c]*%[\u200e\u200f\u061c]*$/u, '\u00a0%');
}
/**
 * A value that already is a per cent (0..100, «72», «72.5») as the progress
 * family shows and says it (owner decision C203 (3), IM-3): the number in the
 * language of the node's part of the page, as many digits as it has (up to
 * 2), a no-break space and «%» -- «72 %», «72,5 %».
 */

function percentText(value, node) {
  const number = Number(value);
  return percentSign(`${formatNumber(Number.isFinite(number) ? number : 0, 'number', {
    node,
    grouping: false
  })}%`);
}

/***/ },

/***/ "ee5c3aad2640"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   formatRelativeDay: () => (/* binding */ formatRelativeDay),
/* harmony export */   formatRelativeTime: () => (/* binding */ formatRelativeTime),
/* harmony export */   intlSpeaks: () => (/* binding */ intlSpeaks)
/* harmony export */ });
/* harmony import */ var _format_intl_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("15b4e93ff6ed");
/* harmony import */ var _format_date_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("e577837dd70a");
// Relative days and times in the page's language («вчера», «5 минут назад»),
// with no top-level side effects (format-intl.js). The same functions as
// core/js/format.js and SF.format.relativeDay / relativeTime.

 // The first letter in capitals, by the locale's rule («вчера» → «Вчера»).

function capitalise(text, locale) {
  const first = Array.from(text)[0] ?? '';
  return first ? first.toLocaleUpperCase(locale || undefined) + text.slice(first.length) : text;
} // «сегодня», «вчера», «завтра» are the platform's words, except where the
// platform has no words of the language: a browser without a language's
// relative-time data says «yesterday» on a page in it. Then the words come
// from core's language files (core/js/lang/relative-day, registered as
// `sf-relative-day`), which a language pack or a product brings
// (SF.language.register('sf-relative-day', 'de', {today, yesterday,
// tomorrow})). ru and en are never looked up: every platform speaks them.


const DAY_KEYS = /* @__PURE__ */Object.freeze({
  0: 'today',
  [-1]: 'yesterday',
  1: 'tomorrow'
});
/** Whether Intl's relative-time words are those of the locale's language, not a fallback's. */

function intlSpeaks(locale) {
  const wanted = String(locale || '').trim().toLowerCase().replace('_', '-').split('-')[0];
  if (!wanted) return true;
  if (wanted === 'en') return true;

  try {
    const own = (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.intlFormatter)('RelativeTimeFormat', locale, {
      numeric: 'auto'
    });
    if (String(own.resolvedOptions().locale).toLowerCase().split('-')[0] !== wanted) return false; // A platform may answer the locale's name over English data (a trimmed
    // ICU): its «yesterday» is then English's.

    return own.format(-1, 'day') !== (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.intlFormatter)('RelativeTimeFormat', 'en', {
      numeric: 'auto'
    }).format(-1, 'day');
  } catch {
    return false;
  }
}

function packDayWord(offset, locale) {
  if (intlSpeaks(locale)) return null;
  const words = globalThis.__sfPageLanguage?.registered?.get?.('sf-relative-day');
  const wanted = String(locale || '').trim().toLowerCase().replace('_', '-');

  for (const code of [...new Set([wanted, wanted.split('-')[0]])]) {
    const word = words?.get?.(code)?.[DAY_KEYS[offset]];
    if (typeof word === 'string' && word.trim()) return word;
  }

  return null;
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
    text = packDayWord(offset, locale) ?? (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.intlFormatter)('RelativeTimeFormat', locale, {
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

/***/ },

/***/ "5b8371b87515"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

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

/***/ },

/***/ "8489d1f5bab4"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   followLanguage: () => (/* binding */ followLanguage),
/* harmony export */   isRussianPage: () => (/* binding */ isRussianPage),
/* harmony export */   language: () => (/* binding */ language),
/* harmony export */   localeText: () => (/* binding */ localeText),
/* harmony export */   pageLanguage: () => (/* binding */ pageLanguage),
/* harmony export */   pageLocale: () => (/* binding */ pageLocale),
/* harmony export */   pageText: () => (/* binding */ pageText),
/* harmony export */   pageWord: () => (/* binding */ pageWord),
/* harmony export */   refreshLanguage: () => (/* binding */ refreshLanguage),
/* harmony export */   registeredWord: () => (/* binding */ registeredWord)
/* harmony export */ });
/* harmony import */ var _tag_aliases_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("4a85acfb05c1");
/* harmony import */ var _lang_built_in_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("feccc97e5d7d");
// What language a component speaks, and how a product adds one.
//
// The Framework speaks English by default and whatever the page says otherwise:
// the language is the nearest [lang] above the node, else the document's, else
// English. One rule for every component, so a page never mixes two because two
// components looked in different places.
//
// Until 2026-10-10 that was the whole of it, and every component carried a
// dictionary of exactly two languages written into its source. Adding a third
// meant editing sixteen files, and a product that needed one could not add it
// at all. There will be many more than two (owner, 2026-10-11), so the
// dictionaries a component ships are now a FLOOR rather than the whole set:
// anything can be registered beside them, for any language, including one the
// Framework has never heard of.
//
// Where a word comes from, in order:
//
//   1. the component's own attribute — a consumer who names a word has named
//      it, and no language changes it;
//   2. a word registered for the resolved language;
//   3. the word the component ships for that language;
//   4. the same two again for the language without its region (`pt-BR` → `pt`);
//   5. the same two again for English;
//   6. the key itself, which is a visible defect rather than a blank.
//
// Registering is additive and reversible, and it does not require the
// Framework to know the language exists.
// The state is shared between every copy of this module, which there are
// several of: core, each smart component and each composite are separate
// bundles, and each one carries its own copy of this file. With the registry
// in module scope the page had as many registries as bundles -- `SF.language`
// was published from core's copy, the table read its own, and registering a
// language changed nothing on screen. Only a browser shows that, and it did
// (2026-10-11).
 // The languages built into the bundles (owner decision C282): English; every
// other language, Russian too, is a language file (core/js/language-packs.js).



const STORE = (() => {
  const root = typeof globalThis !== 'undefined' ? globalThis : {};
  const key = '__sfPageLanguage';

  if (!root[key]) {
    root[key] = {
      listeners: new Set(),
      registered: new Map(),
      chosen: null
    };
  }

  return root[key];
})();

const LISTENERS = STORE.listeners;
const REGISTERED = STORE.registered; // Language packs (owner decision C177, 2026-11-14; C282, 2026-11-17): every
// language but English, the one built in, is one file per language and
// delivery, fetched only by a page that speaks it (or included before core as
// its script form, core/lang/<code>.js). A pack's words go into the same registry as words registered one
// by one -- so a bundle built before packs existed reads them too -- a
// Framework pack's beneath what is there, any other pack's over it: a product
// overrides a Framework word whichever arrived first. The fetching is core's
// (core/js/language-packs.js); each bundle only asks for a language. A STORE
// made by an older bundle has no packs yet: they are added here.

const PACKS = STORE.packs ??= {
  loaded: new Map(),
  pending: new Map(),
  request: null
}; // The languages built into the bundles: English, and in a rollback build Russian
// too (src/core/lang/built-in.json, C282).

const isBuiltIn = code => code === 'en' || (_lang_built_in_mjs__WEBPACK_IMPORTED_MODULE_1__["default"]?.built_in ?? []).includes(code);
/**
 * Ask core for the pack of a language this page speaks (nothing for a
 * built-in language), and for the part that holds `component`'s words: the Framework's pack
 * comes in parts by family (core/js/language-packs.js). A core from before
 * parts takes the language alone.
 */


function needPack(code, component) {
  const wanted = normalise(code);
  const base = wanted.split('-')[0];
  if (!base || isBuiltIn(base) || typeof PACKS.request !== 'function') return;
  const name = component ? (0,_tag_aliases_js__WEBPACK_IMPORTED_MODULE_0__.canonicalTag)(component) : undefined;
  PACKS.request(base, name);
  if (wanted !== base) PACKS.request(wanted, name);
} // Words are kept under a component's current tag: a product that registered
// them for a renamed tag (sf-datepicker, now sf-input-date) keeps its words
// while the old tag is a dated alias, whichever name the element was written
// with (core/js/tag-aliases.js).


const wordsOf = component => REGISTERED.get((0,_tag_aliases_js__WEBPACK_IMPORTED_MODULE_0__.canonicalTag)(component));

function normalise(value) {
  return String(value ?? '').trim().toLowerCase().replace('_', '-');
}
/** The languages to try, most specific first, English last. */


const chain = language => {
  const wanted = normalise(language);
  const base = wanted.split('-')[0];
  const order = [];

  for (const candidate of [wanted, base, 'en']) {
    if (candidate && !order.includes(candidate)) order.push(candidate);
  }

  return order;
};
/** Which component a node belongs to, for words registered against one. */


const componentOf = node => {
  const tag = node?.tagName;
  return typeof tag === 'string' ? tag.toLowerCase() : null;
}; // A layer drawn in a portal carries a copy of its host's language, stamped by
// carryLayerOrigin (§19.1). When that copy came from the page itself, it has
// to follow the page before the listeners draw: a word read inside a drawer
// during SF.language.use() answered the language the page had just left, and
// the portal was carried again only later, with nothing to draw it again
// (simai/ui-source#55, found by ui-mail). A portal whose host sits in a
// section with a language of its own is not touched: that section means it.


const carryPageLanguage = () => {
  const doc = globalThis.document;
  if (!doc?.querySelectorAll) return;
  const lang = doc.documentElement?.getAttribute('lang') || '';

  for (const portal of doc.querySelectorAll('[data-sf-layer-lang="page"]')) {
    if (lang) portal.setAttribute('lang', lang);else portal.removeAttribute('lang');
  }
};

const announce = () => {
  carryPageLanguage();

  for (const listener of [...LISTENERS]) {
    try {
      listener();
    } catch {// A listener that throws is not allowed to stop the others: a page that
      // half-changed language would be worse than one that did not change.
    }
  }
}; // The nearest element that says its language, looking past shadow roots: a
// pagination drawn inside a data view's shadow root found no [lang] there,
// fell back to <html lang> and spoke English inside a Russian admin whose
// language was set on the shell around it.


function langOwner(node) {
  let current = node;

  while (current) {
    const owner = typeof current.closest === 'function' ? current.closest('[lang]') : null;
    if (owner) return owner;
    const root = typeof current.getRootNode === 'function' ? current.getRootNode() : null;
    current = root && root !== current && root.host ? root.host : null;
  }

  return null;
} // The language of a part of the page wins over the language chosen for the
// whole page (owner, 2026-10-26; standard simai.smart-component 1.3.8 §11.1):
//   1. a word given on the element itself (the component's own attribute);
//   2. the nearest [lang] below <html>;
//   3. the page's choice, SF.language.use(), which also sets <html lang>;
//   4. <html lang>;
//   5. English.
// Until 2026-10-27 the choice won over a section's [lang], so an English
// section inside a Russian page that had called use('ru') spoke Russian.


function languageSource(node) {
  const owner = langOwner(node);
  const root = globalThis.document?.documentElement ?? null;
  if (owner && owner !== root) return owner.getAttribute('lang');
  if (STORE.chosen) return STORE.chosen;
  return owner?.getAttribute('lang') || root?.lang || 'en';
}
/**
 * The page's language for this node: the nearest [lang] below <html>, else
 * the language the page chose, else <html lang>, else English.
 */


function pageLanguage(node) {
  // The language without its region, whichever way it was set: a page that
  // chose 'pt-BR' is a Portuguese page, as a page whose markup says
  // lang="pt-BR" is. The chosen value kept its region and answered 'pt-br',
  // which matched no dictionary keyed by language and made isRussianPage false
  // on a page that chose 'ru-RU'. The region stays in pageLocale.
  return normalise(languageSource(node)).split('-')[0] || 'en';
}
/** The page's language with its region kept, which is what formatting wants. */

function pageLocale(node) {
  return normalise(languageSource(node)) || 'en';
}
/**
 * Follows `lang` in the document (§11.1 «changes are followed»): one observer
 * for the page, whichever bundle starts it, and the elements under a changed
 * [lang] draw again. `element.requestComponentUpdate('language')` is what a
 * Smart element does; anything else passes its own `redraw`. Returns the way
 * to stop following.
 */

function followLanguage(element, redraw = () => element.requestComponentUpdate?.('language')) {
  const root = typeof globalThis !== 'undefined' ? globalThis : {};
  const doc = element?.ownerDocument ?? root.document;
  const Observer = doc?.defaultView?.MutationObserver ?? root.MutationObserver;
  if (!doc?.documentElement || typeof Observer !== 'function') return () => {};

  if (!root.__sfLanguageWatch || root.__sfLanguageWatch.document !== doc) {
    const watch = {
      document: doc,
      elements: new Map(),
      observer: null
    };
    watch.observer = new Observer(records => {
      const changed = [...new Set(records.map(record => record.target))];

      for (const [one, again] of [...watch.elements]) {
        if (changed.some(target => within(target, one))) {
          try {
            again();
          } catch {// One element that fails to draw does not keep the others in the
            // old language.
          }
        }
      }
    });
    watch.observer.observe(doc.documentElement, {
      attributes: true,
      attributeFilter: ['lang'],
      subtree: true
    });
    root.__sfLanguageWatch = watch;
  }

  const watch = root.__sfLanguageWatch;
  watch.elements.set(element, redraw);
  return () => watch.elements.delete(element);
} // Whether `node` is `target` or below it, across shadow roots.

function within(target, node) {
  for (let current = node; current;) {
    if (current === target) return true;
    current = current.parentNode || current.host || null;
  }

  return false;
}
/**
 * Tell the page's components that words changed without a registration: the
 * composition editor words arrive in a chunk of their own (LC-1) and the
 * forms drawn before them draw again.
 */


function refreshLanguage() {
  announce();
}
function isRussianPage(node) {
  return pageLanguage(node) === 'ru';
}
/**
 * Text for `key` in the page's language.
 *
 * `dictionary` is what the component ships; `component` names it for the
 * registry and defaults to the node's own tag, so a component calling with
 * `this` identifies itself without saying so twice.
 */

function pageText(dictionary, key, node, component) {
  return localeText(dictionary, key, pageLocale(node), component ?? componentOf(node));
}
/**
 * Text for `key` in a named language, with no node to read it from: a server
 * fallback or a form drawn before it is placed. The same order as pageText --
 * words registered for `component`, then the shipped ones, for the language,
 * the language without its region and English -- and the key last.
 */

function localeText(dictionary, key, locale, component) {
  const order = chain(locale || 'en');
  needPack(order[0], component);

  for (const candidate of order) {
    const added = component ? wordsOf(component)?.get(candidate)?.[key] : undefined;

    if (added !== undefined) {
      if (candidate === 'en' && added !== '') warnFallback(order, component, key);
      return added;
    }

    const shipped = dictionary?.[candidate]?.[key];

    if (shipped !== undefined) {
      if (candidate === 'en' && shipped !== '') warnFallback(order, component, key);
      return shipped;
    }
  }

  return key;
} // A language the Framework does not ship (owner decision C177 (4)) may come
// partly translated: a word it lacks is said in the fallback language,
// English, and that is shown, not silent (localization study LC-6). One
// warning per page and language (de-AT and de are one), naming the first word
// missed; every word missed is kept by language for SF.language.missing(),
// and the language files' coverage is scripts/language-coverage.mjs. Kept on
// the shared global, because every bundle carries this module.

function warnFallback(order, owner, key) {
  const wanted = String(order[0] || '').split('-')[0]; // While its pack is on its way the English is a moment, not a gap.

  if (!wanted || wanted === 'en' || PACKS.pending.has(wanted)) return;
  const root = globalThis;
  if (!(root.__sfMissingWords instanceof Map)) root.__sfMissingWords = new Map();
  const seen = root.__sfMissingWords;

  if (!seen.has(wanted)) {
    seen.set(wanted, new Set());
    root.console?.warn?.(`[SIMAI Framework] "${wanted}": words missing, said in English (first: ${owner || 'component'} "${key}"); SF.language.missing('${wanted}') lists them`);
  }

  seen.get(wanted).add(`${owner || 'component'}|${key}`);
} // Missing words are said once per component, word and language: a page that
// draws a hundred rows must not print a hundred warnings. The marks are kept on
// the shared global, because every bundle carries this module.


function warnWord(owner, key, locale, said) {
  const root = typeof globalThis !== 'undefined' ? globalThis : {};
  if (!(root.__sfWordWarnings instanceof Set)) root.__sfWordWarnings = new Set();
  const mark = `${owner}|${key}|${locale}|${said}`;
  if (root.__sfWordWarnings.has(mark)) return;

  root.__sfWordWarnings.add(mark);

  globalThis.console?.warn?.(`[SIMAI Framework] ${owner || 'component'}: no word "${key}" for ${locale}${said === 'key' ? '; the key is shown' : `; said in ${said}`}`);
}

function fill(text, locale, count, vars) {
  return String(text).replace(/\{([a-z][\w-]*)\}/giu, (whole, name) => {
    if (name === 'n' && count !== undefined) {
      try {
        return new Intl.NumberFormat(locale).format(count);
      } catch {
        return String(count);
      }
    }

    return vars && Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name]) : whole;
  });
}
/**
 * A component's own word (standard simai.smart-component 1.3.8 §11, §11.1).
 *
 * `dictionary` is `{<locale>: {<key>: word}}` from the component's language
 * files. A word given on the element itself is the caller's to prefer; this
 * resolves the rest: words registered for the element's language, then the
 * shipped ones, the language without its region, English, the component's
 * source language and, last, the key. The last two warn once. A word that
 * takes a number is an object of plural forms chosen by Intl.PluralRules of
 * the language the word was found in; `{n}` is the number in that language's
 * format and `{name}` takes `vars.name`.
 *
 * `former` names the key the same word had before a rename (one key or a
 * list): a product that registered its words under the old key keeps them
 * until the alias's day. For each language the word registered under the new
 * key wins, then one registered under an old key, then the shipped one; a
 * word taken by an old key is reported to `onFormer(oldKey)`, which notes the
 * deprecation.
 */


function pageWord(dictionary, key, node, {
  component,
  source = '',
  count,
  vars,
  former,
  onFormer
} = {}) {
  const owner = component ?? componentOf(node);
  const locale = pageLocale(node);
  const order = chain(locale);
  const sourceLanguage = normalise(source);
  if (sourceLanguage && !order.includes(sourceLanguage)) order.push(sourceLanguage);
  const formerKeys = former === undefined || former === null ? [] : [].concat(former);
  needPack(locale, owner);

  for (const candidate of order) {
    const registered = owner ? wordsOf(owner)?.get(candidate) : undefined;
    let added = registered?.[key];

    if (added === undefined && registered) {
      const old = formerKeys.find(name => registered[name] !== undefined && registered[name] !== null);

      if (old !== undefined) {
        added = registered[old];
        onFormer?.(old);
      }
    }

    const word = added !== undefined ? added : dictionary?.[candidate]?.[key];
    if (word === undefined || word === null) continue;
    if (candidate === sourceLanguage && !chain(locale).includes(candidate)) warnWord(owner, key, locale, candidate);
    if (candidate === 'en' && word !== '') warnFallback(chain(locale), owner, key);

    if (typeof word === 'object') {
      let form = 'other';

      if (count !== undefined) {
        try {
          form = new Intl.PluralRules(candidate).select(Number(count));
        } catch {
          form = 'other';
        }
      }

      const picked = word[form] ?? word.other;
      if (picked === undefined) continue;
      return fill(picked, candidate, count, vars);
    }

    return fill(word, candidate, count, vars);
  }

  warnWord(owner, key, locale, 'key');
  return key;
}
/**
 * The word a product registered (SF.language.register, or a product pack)
 * under `key` for the node's language, its base language or English; the
 * words a component ships are not read. Undefined when none is registered.
 * A removed word key kept as a dated alias reads this: the old phrase is
 * said only while a product still writes the old key.
 */

function registeredWord(component, key, node) {
  const byLanguage = wordsOf(component ?? componentOf(node));
  if (!byLanguage) return undefined;

  for (const candidate of chain(pageLocale(node))) {
    const word = byLanguage.get(candidate)?.[key];
    if (word !== undefined && word !== null) return word;
  }

  return undefined;
}
const language = {
  /** What the page resolves to for this node, region and all. */
  current(node = globalThis.document?.documentElement ?? null) {
    return pageLocale(node);
  },

  /**
   * Choose a language for the whole page, whatever its markup says. `null`
   * returns to following the document, which is the default and what a
   * server-rendered page wants.
   */
  use(value) {
    const next = value === null || value === undefined ? null : normalise(value);
    if (next === STORE.chosen) return STORE.chosen;
    STORE.chosen = next;
    if (next) needPack(next); // The choice is the page's language: <html lang> says it too (§11.1), so
    // the browser, a screen reader and CSS :lang() agree with the words.
    // use(null) gives the markup's own language back.

    const root = globalThis.document?.documentElement;

    if (root) {
      const holder = globalThis;

      if (next) {
        if (holder.__sfMarkupLanguage === undefined) holder.__sfMarkupLanguage = root.getAttribute('lang');
        if (root.getAttribute('lang') !== next) root.setAttribute('lang', next);
      } else if (holder.__sfMarkupLanguage !== undefined) {
        if (holder.__sfMarkupLanguage === null) root.removeAttribute('lang');else root.setAttribute('lang', holder.__sfMarkupLanguage);
        holder.__sfMarkupLanguage = undefined;
      }
    }

    announce();
    return STORE.chosen;
  },

  /**
   * Add or replace one component's words for one language.
   *
   * The words are merged, so a product can correct a single label without
   * restating the rest, and `null` removes what it added.
   */
  register(component, value, words) {
    const name = (0,_tag_aliases_js__WEBPACK_IMPORTED_MODULE_0__.canonicalTag)(component ?? '');
    const code = normalise(value);
    if (!name || !code) throw new TypeError('a component and a language are required');
    if (!REGISTERED.has(name)) REGISTERED.set(name, new Map());
    const byLanguage = REGISTERED.get(name);
    if (words === null) byLanguage.delete(code);else byLanguage.set(code, { ...(byLanguage.get(code) ?? {}),
      ...words
    });
    announce();
    return this;
  },

  /**
   * A language pack (schema simai.language-pack, schema_version 1; schema
   * core/contracts/language-pack.v1.schema.json): every word of one language
   * for one delivery, by component. A Framework pack's words go beneath the
   * words already registered, any other pack's over them, as register() does.
   * The page draws again once. Answers what was taken, or null for something
   * that is not a pack.
   */
  registerPack(pack, url = null) {
    const code = normalise(pack?.lang);

    if (pack?.schema !== 'simai.language-pack' || pack.schema_version !== 1 || !code || !pack.words || typeof pack.words !== 'object') {
      globalThis.console?.warn?.(`[SIMAI Framework] not a language pack (simai.language-pack, schema_version 1)${url ? `: ${url}` : ''}`);
      return null;
    }

    const under = (pack.delivery ?? 'framework') === 'framework';
    let words = 0;

    for (const [component, byKey] of Object.entries(pack.words)) {
      if (!byKey || typeof byKey !== 'object') continue;
      const name = (0,_tag_aliases_js__WEBPACK_IMPORTED_MODULE_0__.canonicalTag)(component);
      if (!REGISTERED.has(name)) REGISTERED.set(name, new Map());
      const byLanguage = REGISTERED.get(name);
      const now = byLanguage.get(code) ?? {};
      byLanguage.set(code, under ? { ...byKey,
        ...now
      } : { ...now,
        ...byKey
      });
      words += Object.keys(byKey).length;
    }

    const info = {
      lang: code,
      delivery: pack.delivery ?? 'framework',
      status: pack.status ?? null,
      coverage: pack.coverage ?? null,
      words,
      url
    };
    PACKS.loaded.set(code, [...(PACKS.loaded.get(code) ?? []), info]); // Core registers the parts that arrived together and draws once
    // (PACKS.quiet while it does).

    if (!PACKS.quiet) announce();
    return info;
  },

  /**
   * Name a pack file to fetch when the page needs its language: one line for
   * a product or a page (also SF_BOOT_CONFIG.languages = {code: url}). Core
   * fetches it once, with the Framework's own pack of that language.
   */
  addPack(value, url) {
    return PACKS.add ? PACKS.add(normalise(value), url) : false;
  },

  /** Fetch the packs of a language now; resolves when they are registered. */
  load(value) {
    return PACKS.load ? PACKS.load(normalise(value)) : Promise.resolve([]);
  },

  /** The packs on the page: {code: [{lang, delivery, status, coverage, words, url}]}. */
  packs() {
    return Object.fromEntries([...PACKS.loaded].map(([code, list]) => [code, list.map(info => ({ ...info
    }))]));
  },

  /** One language across many components: `{ 'sf-input-date': {...}, ... }`. */
  registerAll(value, byComponent = {}) {
    for (const [component, words] of Object.entries(byComponent)) {
      this.register(component, value, words);
    }

    return this;
  },

  /** The languages something has registered words for. */
  known(component) {
    return [...(wordsOf(component ?? '')?.keys() ?? [])];
  },

  /**
   * The words the page has said in English so far for want of one in
   * `value` (C177 (4): a language may ship partly; what it lacks is visible).
   * `['sf-pagination|pages-label', ...]`; every language's when none is named.
   */
  missing(value) {
    const seen = globalThis.__sfMissingWords instanceof Map ? globalThis.__sfMissingWords : new Map();
    if (value === undefined) return Object.fromEntries([...seen].map(([code, words]) => [code, [...words]]));
    return [...(seen.get(normalise(value).split('-')[0]) ?? [])];
  },

  /** Every component something has been registered for. */
  components() {
    return [...REGISTERED.keys()];
  },

  /**
   * Called whenever the chosen language or the registered words change, so a
   * component can draw itself again. Returns the way to stop listening.
   */
  onChange(listener) {
    if (typeof listener !== 'function') return () => {};
    LISTENERS.add(listener);
    return () => LISTENERS.delete(listener);
  },

  /** Everything registered is forgotten. For tests, and for a product reset. */
  forget() {
    REGISTERED.clear();
    PACKS.loaded.clear();
    STORE.chosen = null;
    announce();
    return this;
  }

}; // Reachable by a consumer, which it was not: `sf-admin-menu` had written its
// own reading of the rule because the shared one was an internal module, and
// the two then disagreed about a region that names its own language. A product
// composing its own elements gets the same rule here.

if (typeof window !== 'undefined') {
  window.SF = window.SF || {}; // Every bundle publishes its copy; they share one store, so any copy
  // answers alike -- except that a bundle built before language packs
  // (an older package on the page) has no registerPack, addPack, load or
  // packs. Once a copy with them is published, an older one does not
  // replace it (C177).

  const holder = window.SF;

  if (!Object.getOwnPropertyDescriptor(holder, 'language')?.set) {
    let published = holder.language;
    Object.defineProperty(holder, 'language', {
      configurable: true,
      enumerable: true,
      get: () => published,
      set: value => {
        if (typeof value?.registerPack === 'function' || typeof published?.registerPack !== 'function') published = value;
      }
    });
  }

  holder.language = language;
  window.SF.pageLanguage = pageLanguage;
  window.SF.pageText = pageText;
}

/***/ },

/***/ "f28a9d913ce0"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// Generated from the `tag` rows of src/smart/*/aliases.json and the element_aliases of
// src/core/contracts/packages/*.package.json by scripts/tag-alias-table.mjs; do not edit.
// The dated tag aliases of the Framework and of its component packages, read by core/js/tag-aliases.js.
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Object.freeze([Object.freeze({
  from: 'sf-avatars',
  to: 'sf-avatar-group',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-button-group',
  to: 'sf-segmented',
  since: '2026-11-08',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-change-confirm',
  to: 'sf-confirm-change',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-close',
  to: 'sf-button-close',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-code-input',
  to: 'sf-input-code',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-color',
  to: 'sf-input-color',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-composition-overlay',
  to: 'sf-editor-overlay',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-content-editor',
  to: 'sf-editor-content',
  since: '2026-11-03',
  remove_after: '2027-01-01',
  package: 'pro'
}), Object.freeze({
  from: 'sf-context-menu',
  to: 'sf-menu-context',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-copy-button',
  to: 'sf-button-copy',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-country-code',
  to: 'sf-input-country',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-data-view',
  to: 'sf-view',
  since: '2026-11-03',
  remove_after: '2027-01-01',
  package: 'pro'
}), Object.freeze({
  from: 'sf-datepicker',
  to: 'sf-input-date',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-download-file',
  to: 'sf-file-download',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-icon-button',
  to: 'sf-button-icon',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-image-field',
  to: 'sf-input-image',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-inline-editor',
  to: 'sf-editor-inline',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-lookup',
  to: 'sf-input-lookup',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-page-header',
  to: 'sf-header-page',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-property-view',
  to: 'sf-view-properties',
  since: '2026-11-03',
  remove_after: '2027-01-01',
  package: 'pro'
}), Object.freeze({
  from: 'sf-quantity',
  to: 'sf-input-quantity',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-range-slider',
  to: 'sf-slider-range',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-rich-text',
  to: 'sf-input-rich',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-site-header',
  to: 'sf-header-site',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-table',
  to: 'sf-view-table',
  since: '2026-11-03',
  remove_after: '2027-01-01',
  package: 'pro'
}), Object.freeze({
  from: 'sf-textarea',
  to: 'sf-input-textarea',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-thread-list',
  to: 'sf-chat-threads',
  since: '2026-11-03',
  remove_after: '2027-01-01',
  package: 'pro'
})]));

/***/ },

/***/ "4a85acfb05c1"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   canonicalTag: () => (/* binding */ canonicalTag),
/* harmony export */   defineTagAliases: () => (/* binding */ defineTagAliases),
/* harmony export */   isTag: () => (/* binding */ isTag),
/* harmony export */   listTagAliases: () => (/* binding */ listTagAliases),
/* harmony export */   noteTagAlias: () => (/* binding */ noteTagAlias),
/* harmony export */   registerTagAliasRows: () => (/* binding */ registerTagAliasRows),
/* harmony export */   registerTagAliases: () => (/* binding */ registerTagAliases),
/* harmony export */   tagNames: () => (/* binding */ tagNames),
/* harmony export */   tagSelector: () => (/* binding */ tagSelector)
/* harmony export */ });
/* harmony import */ var _deprecations_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("06e8cd089f28");
/* harmony import */ var _alias_table_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("f49a716b86bd");
/* harmony import */ var _tag_aliases_generated_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("f28a9d913ce0");
// Dated tag aliases (rename plan R0, ui-control RENAME-PLAN-2026-11-03; change
// lifecycle: contracts/changes/journal.json, kind "tag"). When a Smart
// component takes a new tag, the old tag keeps working until its
// `remove_after` day:
//
// - Definition. defineTagAliases(Class, tag) defines each old tag as a trivial
//   subclass of the class that defines the new one (the Smart base calls it
//   from define()). The Loader's rule lists the old tag beside the new one, so
//   markup with the old tag alone loads the bundle.
// - Note. The first old-tag element a page connects is noted in
//   SF.deprecations (kind "tag") and named once on the console with the new tag
//   and the date, whatever the page opted into: an element name is the most
//   visible thing a page writes, and the old one is going.
// - Script. Code that finds a renamed element by name asks for both names
//   through one helper instead of a literal:
//
//     import {tagSelector, isTag} from '../../core/js/smart-base';
//     host.querySelector(`.sf-tag > ${tagSelector('sf-button-close')}`);
//     if (isTag(node, 'sf-button-close')) ...
//
// - Sheets. A selector that names the new tag names the old one beside it in
//   source, `:is(sf-button-close, sf-close)`, for as long as the alias lives
//   (scripts/rename-smart-tag.mjs writes it, --sweep takes it out; the
//   contract test tests/tag-aliases.contract.test.mjs holds both).
//
// The aliases are a static table (tag-aliases.generated.js, written by
// scripts/tag-alias-table.mjs from every component's aliases.json and from the
// element_aliases of the component package references,
// contracts/packages/*.package.json), so a lookup finds an old tag before the
// renamed component's bundle has run, a package's (sf-table, rename plan R2)
// as well as the Framework's. A package's component adds its rows again when it
// is defined, which matters only for a package the pair does not reference. Every copy of this
// module shares one state on the page (a global symbol); the Smart bundles
// reach it through the shared runtime (smart-base re-exports it).



const STATE = Symbol.for('simai.sf.tag-aliases');

function state() {
  if (!globalThis[STATE]) {
    const shared = {
      byOld: new Map(),
      byNew: new Map(),
      noted: new Set()
    };
    Object.defineProperty(globalThis, STATE, {
      value: shared,
      configurable: true
    });

    for (const row of _tag_aliases_generated_js__WEBPACK_IMPORTED_MODULE_2__["default"]) addRow(shared, row);
  }

  return globalThis[STATE];
}

function addRow(shared, row) {
  if (shared.byOld.has(row.from)) return;
  shared.byOld.set(row.from, row);
  shared.byNew.set(row.to, [...(shared.byNew.get(row.to) ?? []), row.from]);
} // Rows from a component's aliases.json (its `tag` rows); the Framework's are
// already known, a package's are added here.


function registerTagAliases(table, tag) {
  const {
    rows
  } = (0,_alias_table_js__WEBPACK_IMPORTED_MODULE_1__.readTagAliases)(table, {
    tag
  });
  const shared = state();

  for (const row of rows) addRow(shared, row);

  return rows;
} // Rows a component set gives at runtime (SF.RuleLoader.registerPackage(name,
// {aliases})): {from, to, since, remove_after}, the set's own former tags, so
// SIMAI Framework needs no table row for a set it does not know. Answers the
// rows taken; a row whose old tag is already known keeps the first.

function registerTagAliasRows(rows) {
  const shared = state();
  const taken = [];

  for (const row of Array.isArray(rows) ? rows : []) {
    if (!row || typeof row.from !== 'string' || typeof row.to !== 'string') continue;
    if (shared.byOld.has(row.from)) continue;
    const clean = Object.freeze({
      from: row.from,
      to: row.to,
      since: String(row.since ?? ''),
      remove_after: String(row.remove_after ?? ''),
      ...(typeof row.package === 'string' && row.package ? {
        package: row.package
      } : {})
    });
    addRow(shared, clean);
    taken.push(clean);
  }

  return taken;
} // The open old names of a tag, its own first: ['sf-button-close', 'sf-close'].

function tagNames(tag) {
  const name = String(tag || '').toLowerCase();
  return [name, ...(state().byNew.get(name) ?? [])];
} // A selector for the tag that matches its old names too:
// ':is(sf-button-close, sf-close)', or the tag itself when it has none.

function tagSelector(tag) {
  const names = tagNames(tag);
  return names.length > 1 ? `:is(${names.join(', ')})` : names[0];
} // Whether an element is the tag, under its own or an old name.

function isTag(element, tag) {
  const name = element?.localName;
  return Boolean(name) && tagNames(tag).includes(name);
} // The current name of a tag: 'sf-button-close' for 'sf-close'. An old tag the
// page still has as an element of its own stays itself: a component package
// built before its rename (rules naming sf-table alone) beside a pair whose
// table already knows the new name, where the new tag would never upgrade.

function canonicalTag(tag) {
  const name = String(tag || '').toLowerCase();
  const row = state().byOld.get(name);
  if (!row) return name;
  const own = globalThis.customElements?.get?.(name);
  if (own && !own.sfTagAliasOf) return name;
  let rules = null;

  try {
    rules = globalThis.SF?.Loader?.getCustomElementRules?.() ?? null;
  } catch {
    rules = null;
  }

  if (rules && rules[name] && !rules[row.to]) return name;
  return row.to;
} // Every open row: [{from, to, since, remove_after}].

function listTagAliases() {
  return [...state().byOld.values()].map(row => ({ ...row
  }));
} // The page met an element under an old name: once per old tag.

function noteTagAlias(row) {
  const shared = state();
  const expired = (0,_alias_table_js__WEBPACK_IMPORTED_MODULE_1__.aliasExpired)(row);
  (0,_deprecations_js__WEBPACK_IMPORTED_MODULE_0__.noteDeprecated)({
    component: row.to,
    kind: 'tag',
    from: row.from,
    to: row.to,
    tag: row.to,
    since: row.since,
    remove_after: row.remove_after,
    expired,
    package: row.package
  });
  if (shared.noted.has(row.from)) return;
  shared.noted.add(row.from); // deprecations.js prints an expired name itself, and every name when the
  // page opted in; the note here is for the rest.

  const optedIn = globalThis.document?.documentElement?.dataset?.sfDeprecations === 'warn' || globalThis.SF?.deprecations?.warn === true;
  if (expired || optedIn) return; // A package's element says which package ships it now (C174 NM-3).

  const where = row.package ? ` from the component package ${row.package}` : '';
  globalThis.console?.warn?.(`[SIMAI Framework] <${row.from}> is now <${row.to}>; the old tag works until ${row.remove_after}. Write <${row.to}>${where}. See contracts/changes/journal.json.`);
} // Defines each old tag of `tag` as a subclass of `Base` (the class that
// defines `tag`), through `define(name, Class)`: the Smart base passes its
// definition queue, so both names are defined in the same batch. Returns the
// rows defined.

function defineTagAliases(Base, tag, {
  table = Base?.aliases,
  define
} = {}) {
  if (table) registerTagAliases(table, tag);
  const rows = (state().byNew.get(tag) ?? []).map(from => state().byOld.get(from));
  const registry = globalThis.customElements;
  const defined = [];

  for (const row of rows) {
    if (!registry || registry.get(row.from)) continue;

    class TagAlias extends Base {
      connectedCallback() {
        noteTagAlias(row);
        super.connectedCallback?.();
      }

    }

    Object.defineProperty(TagAlias, 'sfTagAliasOf', {
      value: row.to
    });
    (define ?? ((name, Class) => registry.define(name, Class)))(row.from, TagAlias);
    defined.push(row);
  }

  return defined;
}

if (typeof globalThis !== 'undefined') {
  globalThis.SF = globalThis.SF || {}; // For scripts that are not Smart bundles (class components, a page):
  // SF.tags.selector('sf-button-close').

  if (!globalThis.SF.tags) {
    globalThis.SF.tags = Object.freeze({
      names: tagNames,
      selector: tagSelector,
      is: isTag,
      canonical: canonicalTag,
      list: listTagAliases
    });
  }
}

/***/ },

/***/ "1b5cf325ddb6"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


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
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   files: () => (/* binding */ files)
/* harmony export */ });
/* harmony import */ var _en_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d4b3cd9346d9");
// Written by scripts/build-language-packs.mjs from src/core/lang/built-in.json
// (owner decision C282); do not edit. The words this bundle carries: the
// built-in languages' (en); every other language comes from
// a language file (core/lang/<code>.js or its parts).


const files = { en: { runtime: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime } };

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ en: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime });


/***/ },

/***/ "fb0bdf7719f0"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

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


/***/ },

/***/ "4294700087dc"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   files: () => (/* binding */ files)
/* harmony export */ });
/* harmony import */ var _en_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("3694b5e2bf39");
// Written by scripts/build-language-packs.mjs from src/core/lang/built-in.json
// (owner decision C282); do not edit. The words this bundle carries: the
// built-in languages' (en); every other language comes from
// a language file (core/lang/<code>.js or its parts).


const files = { en: { runtime: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime } };

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ en: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime });


/***/ },

/***/ "feccc97e5d7d"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _built_in_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("6a56aa4367e4");
// The languages built into the component bundles (owner decision C282),
// for page-language.js: built-in.json, the build switch
// scripts/build-language-packs.mjs reads too. A module, as lang/index.mjs, so
// the bundle and Node read the JSON alike.


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_built_in_json__WEBPACK_IMPORTED_MODULE_0__);


/***/ },

/***/ "d4b3cd9346d9"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"runtime":{"remove":"Remove","uploading":"Uploading","uploading-name":"Uploading {name}","retry":"Try again","remove-name":"Remove {name}","retry-name":"Try {name} again","linkText":"Click to upload","text":"or drag and drop","not-added":"Not added: {n}","reject-type":"“{name}” is not accepted: allowed {formats}","reject-one":"“{name}” was not added: this field takes one file","reject-duplicate":"“{name}” is already in the list","reject-empty":"“{name}” is empty","reject-size":"“{name}” is {size}; the limit is {max}","reject-min-size":"“{name}” is {size}; it must be at least {min}","reject-count":{"one":"“{name}” was not added: up to {n} file","other":"“{name}” was not added: up to {n} files"},"reject-total":"“{name}” was not added: all files together up to {max}","formats-image":"images","formats-video":"video","formats-audio":"audio","done":"Uploaded","done-line":"{size} · uploaded","error":"Not uploaded","error-line":"Not uploaded: {message}","said-added":"“{name}” added","said-added-many":{"one":"{n} file added","other":"{n} files added"},"said-done":"“{name}” uploaded","said-error":"“{name}” was not uploaded","said-error-line":"“{name}” was not uploaded: {message}"}}');

/***/ },

/***/ "3694b5e2bf39"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"runtime":{"b":"B","kb":"KB","mb":"MB","gb":"GB"}}');

/***/ },

/***/ "6a56aa4367e4"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"schema":"simai.language-built-in","schema_version":1,"$comment":"The languages built into the component bundles (owner decision C282, 2026-11-17): English only. Russian and every other language ship as language files (core/lang/<code>.js before core.js, or the parts core/lang/<code>/<family>.json core fetches). complete: the languages that must say every word (scripts/language-coverage.mjs exits 1 on a gap). Rollback: built_in [\\"en\\", \\"ru\\"], then node scripts/build-language-packs.mjs and a rebuild put Russian back into the bundles (the language files still ship, so a page that includes ru.js stays right).","built_in":["en"],"complete":["en","ru"]}');

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