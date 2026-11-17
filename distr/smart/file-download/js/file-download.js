/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "92b137c03f44"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NEW_TAB_WORDS: () => (/* binding */ NEW_TAB_WORDS),
/* harmony export */   bindDownloadFile: () => (/* binding */ bindDownloadFile),
/* harmony export */   buildAnchorDownload: () => (/* binding */ buildAnchorDownload),
/* harmony export */   fileSaid: () => (/* binding */ fileSaid),
/* harmony export */   initExistingDownloadFiles: () => (/* binding */ initExistingDownloadFiles),
/* harmony export */   nameFromHref: () => (/* binding */ nameFromHref),
/* harmony export */   spokenFileSize: () => (/* binding */ spokenFileSize),
/* harmony export */   unbindDownloadFile: () => (/* binding */ unbindDownloadFile)
/* harmony export */ });
/* harmony import */ var _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d7f974466839");
/* harmony import */ var _register_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("58661bec99a6");
/* harmony import */ var _json_download_file_utility_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("8ea1dd3302c4");
/* harmony import */ var _core_js_format_file_size_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("c016c43b1452");
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("43090d1c8307");
/* harmony import */ var _lang_index_mjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("d0b5a0385ddc");
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("d3818183b14c");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_format_file_size_js__WEBPACK_IMPORTED_MODULE_3__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_4__, _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_6__]);
([_core_js_format_file_size_js__WEBPACK_IMPORTED_MODULE_3__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_4__, _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_6__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_core_js_page_language__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_6__);




 // The words live in the component's language files (localization study LC-4):
// one place for every language, as the Smart components keep them.



const pick = (words, keys) => Object.fromEntries(keys.map(key => [key, words[key]]));


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
} // A file is fetched where the person is (decision C25, 2026-11-09): in the
// same tab, as a download. A new tab is for a file opened to view, and the
// control that does that says so with its sign.


function buildAnchorDownload(href, filename = '') {
  if (!href) return;
  const anchor = document.createElement('a');
  anchor.href = href;
  anchor.download = filename || '';
  anchor.rel = 'noopener';
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
} // The size in the page's language (decision C25; the core formatter, the one
// SF.format.fileSize is): «2,4 МБ» on a Russian page, «2.4 MB» on an English
// one. It printed «2.4MB» in English units on every page.
// A data: or blob: address is the page's own bytes, not a file on a server:
// there is no one to ask, and a HEAD to it is refused by the browser
// (net::ERR_METHOD_NOT_SUPPORTED, docs pre-check 2026-11-10 DF-15). The page
// that made the bytes knows their size and passes file-size, as it passes
// file-name (nameFromHref skips these addresses too).


const LOCAL_ADDRESS = /^\s*(?:data|blob):/iu; // An address that leads back to this very page -- «#», «#part» or the
// page's own URL -- is no file either: a HEAD to it asks the page for its own
// length (docs acceptance 2026-11-10, L2). It is compared without the
// fragment, against the document's base, as the browser resolves the link.

function isSameDocument(href) {
  if (typeof document === 'undefined' || typeof URL !== 'function') return false;

  try {
    const target = new URL(href, document.baseURI);
    const page = new URL(document.URL);
    target.hash = '';
    page.hash = '';
    return target.href === page.href;
  } catch {
    return false;
  }
} // Only a file on this page's own server is asked for its size (decision
// C51, docs pre-check 2026-11-10 DF-15): a HEAD to another origin fails
// without CORS and prints an error, and a server that does not answer HEAD
// is asked for nothing. An opaque origin (a sandboxed frame) is never this
// page's own. Everywhere else the page passes file-size.


function isSameOriginHttp(href) {
  if (typeof document === 'undefined' || typeof URL !== 'function') return false;

  try {
    const target = new URL(href, document.baseURI);
    const own = globalThis.origin ?? new URL(document.URL).origin;
    return /^https?:$/u.test(target.protocol) && target.origin === own;
  } catch {
    return false;
  }
}

async function resolveRemoteFileSize(href, node = null) {
  if (!href || LOCAL_ADDRESS.test(href) || isSameDocument(href)) return '';
  if (!isSameOriginHttp(href)) return '';

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

    return (0,_core_js_format_file_size_js__WEBPACK_IMPORTED_MODULE_3__.formatFileSize)(Number(contentLength), {
      node
    });
  } catch {
    return '';
  }
} // The words a screen reader hears after a link that opens a tab.


const NEW_TAB_WORDS = {
  en: pick(_lang_index_mjs__WEBPACK_IMPORTED_MODULE_5__["default"].en, ["new-tab"]),
  ru: pick(_lang_index_mjs__WEBPACK_IMPORTED_MODULE_5__["default"].ru, ["new-tab"])
}; // The size as it is said (decision C51): the unit in words, in the page's
// language and in the number's form -- «112 байт», «2,4 мегабайта», «1 KB» is
// «1 kilobyte». The visible «CSV · 112 Б» is hidden from a screen reader,
// which hears «Смета.csv, CSV, 112 байт», the commas its pauses.

const SIZE_WORDS = {
  en: pick(_lang_index_mjs__WEBPACK_IMPORTED_MODULE_5__["default"].en, ["byte", "kilobyte", "megabyte", "gigabyte", "terabyte"]),
  ru: pick(_lang_index_mjs__WEBPACK_IMPORTED_MODULE_5__["default"].ru, ["byte", "kilobyte", "megabyte", "gigabyte", "terabyte"])
};
const SIZE_UNIT_WORDS = {
  'б': 'byte',
  b: 'byte',
  'байт': 'byte',
  'байта': 'byte',
  byte: 'byte',
  bytes: 'byte',
  'кб': 'kilobyte',
  kb: 'kilobyte',
  kib: 'kilobyte',
  'мб': 'megabyte',
  mb: 'megabyte',
  mib: 'megabyte',
  'гб': 'gigabyte',
  gb: 'gigabyte',
  gib: 'gigabyte',
  'тб': 'terabyte',
  tb: 'terabyte',
  tib: 'terabyte'
};
const SIZE_TEXT = /^\s*(\d[\d\s\u00a0\u202f.,]*?)\s*([^\d\s.,]+)\.?\s*$/u;
/** A size text as a screen reader should say it: «2,4 МБ» -> «2,4 мегабайта». */

function spokenFileSize(text, node = null) {
  const value = String(text || '').trim();
  const match = SIZE_TEXT.exec(value);
  if (!match) return value;
  const key = SIZE_UNIT_WORDS[match[2].toLowerCase()];
  if (!key) return value;
  const count = Number(match[1].replace(/[\s\u00a0\u202f]/gu, '').replace(',', '.'));
  const word = (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_4__.pageWord)(SIZE_WORDS, key, node, {
    component: 'download-file',
    count: Number.isFinite(count) ? count : undefined
  });
  return `${match[1].trim()} ${word}`;
}
/** The hidden words after the name: «, CSV, 112 байт» -- empty with neither. */


function fileSaid(fileType, fileSize, node = null) {
  const parts = [String(fileType || '').trim(), spokenFileSize(fileSize, node)].filter(Boolean);
  return parts.length ? `, ${parts.join(', ')}` : '';
} // A file's name when the markup gives none: the link's last part, decoded.


function nameFromHref(href) {
  const path = String(href || '').split(/[?#]/u)[0];
  const last = path.slice(path.lastIndexOf('/') + 1);
  if (!last || LOCAL_ADDRESS.test(path)) return '';

  try {
    return decodeURIComponent(last);
  } catch {
    return last;
  }
}

function getRootLink(root) {
  if (!root || !(root instanceof HTMLElement)) return null;
  return root.tagName.toLowerCase() === 'a' ? root : root.querySelector('a.sf-download-file');
}

function getSizeNode(root) {
  return root?.querySelector?.('.sf-download-file-file-size') || null;
} // A file's own row, the link or the button: a row that cannot be pressed (a
// file that could not be made, or one ready to be fetched by its «Скачать»)
// is a group or a plain line, and is not bound.
// The name as shown: the name element less the words a screen reader hears
// inside it («, CSV, 112 байт»).


function shownFileName(node) {
  if (!node) return '';
  const copy = node.cloneNode(true);
  copy.querySelectorAll('.sf-download-file__said').forEach(said => said.remove());
  return String(copy.textContent || '').trim();
}

function isPressableRoot(root) {
  return Boolean(root?.matches?.('a, button'));
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

async function resolveAndApplyFileSize(root, onSize = null) {
  if (!root || isDisabledRoot(root)) return;
  const sizeNode = getSizeNode(root);
  if (!sizeNode) return;
  if (String(sizeNode.textContent || '').trim()) return;
  const href = getRootHref(root);
  if (!href) return;
  const resolvedSize = await resolveRemoteFileSize(href, root);
  if (!resolvedSize || !sizeNode.isConnected) return; // An element that draws the row itself takes the size and draws it (a
  // text written under its template would be lost on the next drawing).

  if (typeof onSize === 'function') {
    onSize(resolvedSize);
    return;
  }

  sizeNode.textContent = resolvedSize;
  const saidNode = root.querySelector('.sf-download-file__said');

  if (saidNode) {
    saidNode.textContent = fileSaid(root.querySelector('.sf-download-file__type')?.textContent || '', resolvedSize, root);
  }
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
} // `onActivate(detail)` takes the place of the class event: sf-download-file
// sends its own cancelable `sf-download-file-download` (standard 1.3.8 §8,
// vocabulary 1.1.5 §5.1), and the old `sf-download-file:click` follows it as a
// dated alias. Answering false cancels the download.
// The plain markup's parts the class does not build (the docs taught them:
// sf-download-file-wrap, -container, -file-name, -file-size with no BEM part
// beside them) are deprecated until 2027-01-01 (dispatcher decision
// 2026-11-16, journal class-download-file-plain-parts): they keep their look,
// but the type and the size never go under the name and a screen reader hears
// the name and the size run together. The class markup carries both names.


const PLAIN_PARTS = [['sf-download-file-wrap', 'sf-download-file__body'], ['sf-download-file-container', 'sf-download-file__main'], ['sf-download-file-file-name', 'sf-download-file__name'], ['sf-download-file-file-size', 'sf-download-file__size']];
const PLAIN_PARTS_DEPRECATED = {
  since: '2026-11-16',
  remove_after: '2027-01-01'
};

function notePlainParts(root) {
  for (const [from, to] of PLAIN_PARTS) {
    if (root.querySelector?.(`.${from}:not(.${to})`)) {
      (0,_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_6__.noteDeprecated)({
        component: 'download-file',
        kind: 'class',
        from,
        to: `${to} (the DownloadFile class markup)`,
        ...PLAIN_PARTS_DEPRECATED
      });
    }
  }
}

function bindDownloadFile(root, {
  onActivate,
  onSize
} = {}) {
  if (!root || root.dataset[DOWNLOAD_FILE_BOUND_FLAG] === '1' || !isPressableRoot(root)) return;
  notePlainParts(root);

  const handleClick = event => {
    // A file being prepared (aria-busy) takes no second press: the first one
    // is on its way (decision C25).
    if (root.getAttribute('aria-busy') === 'true') {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    if (isDisabledRoot(root)) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    const href = getRootHref(root);
    const fileName = root.getAttribute('download') || root.dataset.fileName || shownFileName(root.querySelector('.sf-download-file__name, .sf-download-file-file-name')) || '';
    const download = root.hasAttribute('download') || root.dataset.download === 'true';

    if (typeof onActivate === 'function') {
      if (onActivate({
        href,
        fileName,
        download
      }) === false) {
        event.preventDefault();
        return;
      }
    } else {
      emitDownloadFileClick(root, href, fileName, download);
    }

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
  resolveAndApplyFileSize(root, onSize);
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
    super(props); // No invented file: an absent name is the link's own last part, an absent
    // size is asked of the file (one HEAD request). They were «File.pdf» and
    // «36MB» on any markup that left them out.

    const {
      size = '1',
      fileName = '',
      fileSize = '',
      fileType = '',
      icon = 'download',
      href = '',
      download = true,
      disabled = false,
      target = '',
      fullWidth = false
    } = this.params || {};
    const className = this.attrs.class || this.attrs.className;
    const isDisabled = toBoolean(disabled, false);
    const canLink = Boolean(href) && !isDisabled;
    const root = document.createElement(canLink ? 'a' : 'button');

    if (this.id) {
      root.id = this.id;
    }

    const shownName = String(fileName || nameFromHref(href)); // A file link downloads in the same tab (decision C25); target="_blank" is
    // a file opened to view, and the link says so: a sign after the name and
    // words for a screen reader.

    const opensTab = canLink && String(target || '') === '_blank';

    if (canLink) {
      root.href = String(href);

      if (opensTab) {
        root.target = '_blank';
        root.rel = 'noopener noreferrer';
      } else {
        if (target) root.target = String(target);
        if (toBoolean(download, true)) root.download = shownName;
      }
    } else {
      root.type = 'button';
    } // Size 1 is the block's own rule; there is no --size-1 class to write, and
    // writing one left a class no sheet answers.


    root.classList.add('sf-download-file');
    if (normalizeSize(size) !== '1') root.classList.add(`sf-download-file--size-${normalizeSize(size)}`); // The row is as wide as its text (decision C51); full-width stretches it.

    if (toBoolean(fullWidth, false)) root.classList.add('sf-download-file--full-width');

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

    const wrap = document.createElement('span');
    wrap.classList.add('sf-download-file__body', 'sf-download-file-wrap');
    const container = document.createElement('span');
    container.classList.add('sf-download-file__main', 'sf-download-file-container');
    const iconNode = document.createElement('i');
    iconNode.classList.add('sf-download-file__icon', 'sf-icon');
    iconNode.setAttribute('aria-hidden', 'true');
    iconNode.textContent = String(icon || 'download'); // The name, then the type and the size right after it (decision C51); on
    // a phone the two go under the name. The name is never cut.

    const textNode = document.createElement('span');
    textNode.classList.add('sf-download-file__text');
    const fileNameNode = document.createElement('span');
    fileNameNode.classList.add('sf-download-file__name', 'sf-download-file-file-name');
    fileNameNode.textContent = shownName;
    container.append(iconNode, textNode);
    textNode.append(fileNameNode);

    if (opensTab) {
      const tabNode = document.createElement('i');
      tabNode.classList.add('sf-download-file__tab', 'sf-icon');
      tabNode.setAttribute('aria-hidden', 'true');
      tabNode.textContent = 'open_in_new';
      const tabWords = document.createElement('span');
      tabWords.classList.add('sf-download-file__tab-words');
      tabWords.textContent = (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_4__.pageText)(NEW_TAB_WORDS, 'new-tab', document.documentElement, 'download-file');
      textNode.append(tabNode, tabWords);
    } // What a screen reader hears after the name: «, CSV, 112 байт» -- inside
    // the name, so it is heard as one line with it (after the tab words when
    // the link opens a tab).


    const saidNode = document.createElement('span');
    saidNode.classList.add('sf-download-file__said');
    saidNode.textContent = fileSaid(fileType, fileSize, document.documentElement);
    (opensTab ? textNode : fileNameNode).append(saidNode); // The type and the size are two facts (decision C25): «PDF · 2,4 МБ»,
    // seen; the words above are what is heard.

    const metaNode = document.createElement('span');
    metaNode.classList.add('sf-download-file__meta');
    metaNode.setAttribute('aria-hidden', 'true');

    if (fileType) {
      const fileTypeNode = document.createElement('span');
      fileTypeNode.classList.add('sf-download-file__type');
      fileTypeNode.textContent = String(fileType);
      metaNode.append(fileTypeNode);
    }

    const fileSizeNode = document.createElement('span');
    fileSizeNode.classList.add('sf-download-file__size', 'sf-download-file-file-size');
    fileSizeNode.textContent = String(fileSize || '');
    metaNode.append(fileSizeNode);
    textNode.append(metaNode);
    wrap.append(container);
    root.append(wrap);
    this.href = String(href || '');
    this.download = canLink && !opensTab && toBoolean(download, true);
    this.fileName = shownName;
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
} // A public bind, as the other bound components have: markup added by a script
// that the observer has not reached yet, or a root rebound after a change. The
// binders were exported for bundles only, so a page had none.


if (typeof window !== 'undefined') {
  window.SF = window.SF || {};
  window.SF.DownloadFile = window.SF.DownloadFile || {};
  window.SF.DownloadFile.bind = bindDownloadFile;
  window.SF.DownloadFile.unbind = unbindDownloadFile;
  window.SF.DownloadFile.initAll = initExistingDownloadFiles;
}


(0,_register_helper__WEBPACK_IMPORTED_MODULE_1__["default"])('DownloadFile', DownloadFile);
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

/***/ "50d2a204ba4c"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SPINNER_DEFAULT_LOOK: () => (/* binding */ SPINNER_DEFAULT_LOOK),
/* harmony export */   SPINNER_DOTS: () => (/* binding */ SPINNER_DOTS),
/* harmony export */   SPINNER_DOTS_FILLED: () => (/* binding */ SPINNER_DOTS_FILLED),
/* harmony export */   SPINNER_GRID: () => (/* binding */ SPINNER_GRID),
/* harmony export */   SPINNER_LIVE_AREA: () => (/* binding */ SPINNER_LIVE_AREA),
/* harmony export */   SPINNER_LOOKS: () => (/* binding */ SPINNER_LOOKS),
/* harmony export */   SPINNER_STROKE: () => (/* binding */ SPINNER_STROKE),
/* harmony export */   createInlineSpinner: () => (/* binding */ createInlineSpinner),
/* harmony export */   createLadderSpinnerSvg: () => (/* binding */ createLadderSpinnerSvg),
/* harmony export */   createSpinnerSvg: () => (/* binding */ createSpinnerSvg),
/* harmony export */   createSvgNode: () => (/* binding */ createSvgNode),
/* harmony export */   normalizeSpinnerLook: () => (/* binding */ normalizeSpinnerLook)
/* harmony export */ });
// The spinner's drawing, without the component's side effects (no registry, no
// observer), so a control that shows work in place of its icon -- a button, an
// icon button, a group's segment, a modal waiting for its content -- draws the
// one spinner of the Framework without loading or binding the spinner
// component (simai/ui-source#10).
//
// The ladder: a spinner is drawn on the icon grid. Material Symbols are drawn on
// 24 units and, at the regular weight the Framework's controls use, stroke 2 of
// them; a spinner on the same grid, scaled to the icon box of a step, strokes as
// the icons of that step do, and needs no stroke of its own per step.
//
// The ring is drawn inside the icon's live area, not across its box (docs
// review R027, owner decision C11, 2026-11-07): Material Symbols draw in 20 of
// their 24 units and leave 2 of air on every side, so a ring that filled the
// box stood larger than the icon beside it. On the grid the ring's outer edge
// is the live area -- radius 9 at stroke 2, 20 units across -- and the box
// stays the icon's box, so a control that swaps its icon for the spinner moves
// nothing. The proportion is the grid's, the same at every step.
//
// The looks (simai/ui-source#11): every spinner carries the four looks on the
// same ring -- the arc and the breathing arc (one circle, two motions), the
// comet and the dots -- and the spinner sheet shows the one the page asks for:
// data-sf-spinner on html, body or any block (the nearest wins), data-variant on
// the spinner itself above both. The choice is CSS alone, so a page that
// changes the attribute changes every spinner at once, drawn or not yet drawn.
// Without the spinner sheet only the arc is shown, still.
const SVG_NS = 'http://www.w3.org/2000/svg';
const SPINNER_GRID = 24;
const SPINNER_STROKE = 2;
const SPINNER_LIVE_AREA = 20;
const SPINNER_LOOKS = ['arc', 'breathing', 'comet', 'dots'];
const SPINNER_DEFAULT_LOOK = 'arc'; // The dots look on the grid: a ring of dots as big as the stroke allows, so at
// every step the dots are the step's and no attribute sizes them.

const SPINNER_DOTS = 8;
const SPINNER_DOTS_FILLED = 3; // The comet: a head and a tail a little under half the ring, in segments whose
// opacity falls towards the end of the tail. Segments rather than a gradient,
// because an SVG gradient cannot follow a circle and a CSS one would leave the
// ring and its stroke; each segment strokes in the current ink.

const COMET_SEGMENTS = 10;
const COMET_LENGTH = 40;
function normalizeSpinnerLook(value, fallback = SPINNER_DEFAULT_LOOK) {
  const look = String(value ?? '').trim().toLowerCase();
  return SPINNER_LOOKS.includes(look) ? look : fallback;
}
function createSvgNode(tagName, attributes = {}) {
  const node = document.createElementNS(SVG_NS, tagName);
  Object.entries(attributes).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return;
    }

    node.setAttribute(key, String(value));
  });
  return node;
}

const round = value => Math.round(value * 1000) / 1000; // The four looks in one drawing. On the ladder it is the 24-unit grid with
// stroke 2, every look on the ring of the live area (`inset` 2 units from the
// edge of the box); a spinner still drawn in pixels (the deprecated attributes) passes
// its own width, height and stroke. The circles carry presentation attributes
// as well as their classes: the spinner sheet styles them (track colour, the
// motion of each look, the still frame under reduced motion), and until that
// sheet has arrived they draw a faint ring and the arc in the current ink
// rather than a filled black disc; the comet and the dots wait hidden. The arc
// is a fixed 30% of the ring (simai/ui-source#13): the sheet turns the drawing,
// the arc itself never changes length.


function createSpinnerSvg({
  width = SPINNER_GRID,
  height = SPINNER_GRID,
  stroke = SPINNER_STROKE,
  dots = SPINNER_DOTS,
  filled = SPINNER_DOTS_FILLED,
  dotRadius = null,
  direction = 'clockwise',
  pixel = false,
  inset = 0
} = {}) {
  const cx = width / 2;
  const cy = height / 2; // The outer edge of every look: the track, the arc, the comet and the dots.

  const half = Math.max(stroke, Math.min(width, height) / 2 - inset);
  const radius = Math.max(1, half - stroke / 2);
  const svg = createSvgNode('svg', {
    class: 'sf-loader-svg',
    viewBox: `0 0 ${width} ${height}`,
    width: pixel ? width : null,
    height: pixel ? height : null,
    'aria-hidden': 'true',
    focusable: 'false'
  });
  const ring = {
    cx,
    cy,
    r: round(radius),
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': stroke
  };
  const track = createSvgNode('circle', {
    class: 'sf-loader-ring-filled',
    ...ring,
    opacity: '0.3'
  });
  const accent = createSvgNode('circle', {
    class: 'sf-loader-ring-accent',
    ...ring,
    'stroke-linecap': 'round',
    pathLength: 100,
    'stroke-dasharray': '30 70',
    transform: `rotate(90 ${cx} ${cy})`
  }); // The comet starts at the top and runs clockwise: segment 0 is the end of the
  // tail, the last one the head, drawn last and with a round cap.

  const comet = createSvgNode('g', {
    class: 'sf-loader-comet',
    display: 'none',
    transform: `rotate(-90 ${cx} ${cy})`
  });
  const segment = COMET_LENGTH / COMET_SEGMENTS;

  for (let index = 0; index < COMET_SEGMENTS; index += 1) {
    const head = index === COMET_SEGMENTS - 1;
    comet.append(createSvgNode('circle', {
      class: `sf-loader-comet-segment${head ? ' sf-loader-comet-head' : ''}`,
      ...ring,
      'stroke-linecap': head ? 'round' : 'butt',
      pathLength: 100,
      'stroke-dasharray': `${round(segment)} ${round(100 - segment)}`,
      'stroke-dashoffset': round(-segment * index),
      opacity: round(((index + 1) / COMET_SEGMENTS) ** 1.6)
    }));
  } // The dots sit on the same ring: a dot as wide as the stroke allows without
  // touching its neighbours, so fewer dots are bigger ones.


  const count = Math.max(3, Math.min(32, Math.floor(Number(dots) || SPINNER_DOTS)));
  const active = Math.max(1, Math.min(count, Math.floor(Number(filled) || SPINNER_DOTS_FILLED)));
  const fitted = Math.min(stroke, 0.7 * Math.PI * (half - stroke) / count);
  const dotR = dotRadius === null || dotRadius === undefined || dotRadius === '' ? fitted : Math.max(1, Math.min(Number(dotRadius) || fitted, half / 4));
  const orbit = Math.max(dotR, half - dotR);
  const dotsGroup = createSvgNode('g', {
    class: 'sf-loader-dots',
    display: 'none',
    style: `--sf-loader-dot-count:${count}; --sf-loader-dot-filled:${active};`
  });

  for (let index = 0; index < count; index += 1) {
    const angle = Math.PI * 2 / count * index - Math.PI / 2;
    const step = direction === 'counterclockwise' ? index : (count - index) % count;
    dotsGroup.append(createSvgNode('circle', {
      class: `sf-loader-dot${index < active ? ' sf-loader-dot--active' : ''}`,
      cx: round(cx + orbit * Math.cos(angle)),
      cy: round(cy + orbit * Math.sin(angle)),
      r: round(dotR),
      fill: 'currentColor',
      style: `--sf-loader-dot-index:${index}; --sf-loader-dot-step:${step};`
    }));
  }

  svg.append(track, accent, comet, dotsGroup);
  return svg;
} // The drawing on the icon grid, the one every spinner on the ladder uses: the
// ring in the icon's live area, 20 of the 24 units.

function createLadderSpinnerSvg(options = {}) {
  return createSpinnerSvg({ ...options,
    width: SPINNER_GRID,
    height: SPINNER_GRID,
    stroke: SPINNER_STROKE,
    dotRadius: null,
    pixel: false,
    inset: (SPINNER_GRID - SPINNER_LIVE_AREA) / 2
  });
} // A spinner that stands in a control: endless, decorative (the control keeps
// its label and says aria-busy), and marked bound so the spinner component,
// when it is on the page, leaves it as drawn. `className` names the control's
// slot for it; `overlay` lays it over the control's hidden label instead of in
// the place of an icon. Its look is the page's, as every spinner's.

function createInlineSpinner({
  className = '',
  overlay = false
} = {}) {
  const root = document.createElement('span');
  root.className = ['sf-loader-container', 'sf-loader--infinite', className, className && overlay ? `${className}--overlay` : ''].filter(Boolean).join(' ');
  root.dataset.sfSpinnerBound = '1';
  root.dataset.infinite = 'true';
  root.setAttribute('aria-hidden', 'true');
  const indicator = document.createElement('span');
  indicator.className = 'sf-loader--loading-indicator';
  indicator.append(createLadderSpinnerSvg());
  root.append(indicator);
  return root;
}

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
/* harmony export */   numberOptions: () => (/* binding */ numberOptions),
/* harmony export */   percentSign: () => (/* binding */ percentSign),
/* harmony export */   percentText: () => (/* binding */ percentText)
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
  return String(text).replace(/[\s\u00a0\u202f]*%$/u, '\u00a0%');
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
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "a811123e77b0"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _component_download_file_js_download_file__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("92b137c03f44");
/* harmony import */ var _core_js_deprecations__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("d3818183b14c");
/* harmony import */ var _core_js_format_number_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("c9ce0852ac73");
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("e92fd2d1a38c");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("f61e7676b0d2");
/* harmony import */ var _js_error_fit_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("5a234b6890bd");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("312445577dad");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("9288cedb5bb5");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("6da9b5d8b341");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("25a776704bf3");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_component_download_file_js_download_file__WEBPACK_IMPORTED_MODULE_0__, _core_js_deprecations__WEBPACK_IMPORTED_MODULE_1__, _core_js_format_number_js__WEBPACK_IMPORTED_MODULE_2__, _core_js_smart_base__WEBPACK_IMPORTED_MODULE_3__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_4__, _core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_5__, _js_templates_default__WEBPACK_IMPORTED_MODULE_6__]);
([_component_download_file_js_download_file__WEBPACK_IMPORTED_MODULE_0__, _core_js_deprecations__WEBPACK_IMPORTED_MODULE_1__, _core_js_format_number_js__WEBPACK_IMPORTED_MODULE_2__, _core_js_smart_base__WEBPACK_IMPORTED_MODULE_3__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_4__, _core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_5__, _js_templates_default__WEBPACK_IMPORTED_MODULE_6__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_deprecations__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_deprecations__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_5__);











 // Only the words on screen ship in the bundle; the title, settings and events
// stay in the language files for the Studio and the docs (localization study LC-2).

const en = {
  runtime: _lang_en_json__WEBPACK_IMPORTED_MODULE_10__.runtime
};
const ru = {
  runtime: _lang_ru_json__WEBPACK_IMPORTED_MODULE_11__.runtime
}; // sf-file-download from its component.json (standard simai.smart-component
// 1.3.8 §3, §4, §8): the settings are the attributes and properties
// core/js/element-manifest.js makes from the manifest. A press sends the
// cancelable request sf-file-download-request {href, fileName, download}
// (vocabulary 1.1.5 §5.1) on the host; its former names --
// sf-file-download-download, sf-download-file-download and the class event
// sf-download-file:click -- follow it as dated aliases (aliases.json), and a
// refused request stops the download.

const DownloadFileElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_4__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_8__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_3___default()),
  lang: {
    en,
    ru
  },
  source: 'ru',
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_9__,
  // «Не удалось подготовить файл» was the heading of the notice under the
  // file; the row now says «Не удалось собрать» itself (decision C51). A word
  // a page registered under the old key is still said until the day.
  formerWords: {
    since: '2026-11-11',
    remove_after: '2027-01-01',
    words: {
      'failed-text': 'error-heading'
    }
  }
});
const STATES = ['ready', 'preparing', 'error']; // The settings that can draw the file as another element (a button or a link).

const REDRAWN_BY = new Set(['href', 'disabled', 'state', 'target']); // A file that comes within this long after the press, while the page is in
// sight, is fetched by itself; later, or on a hidden page, it waits for
// «Скачать» (decision C51): a download that arrives unasked surprises, and a
// phone may ask first.

const FETCH_ITSELF_WITHIN = 10000; // The box that holds the row: the first ancestor that draws one (the host is
// display: contents).

function layoutParent(node) {
  for (let current = node.parentElement; current; current = current.parentElement) {
    if (getComputedStyle(current).display !== 'contents') return current;
  }

  return null;
} // An element's max-content width, read with its inline size freed for one
// layout and given back.


function maxContentWidth(element) {
  const {
    style
  } = element;
  const saved = [style.getPropertyValue('inline-size'), style.getPropertyPriority('inline-size'), style.getPropertyValue('max-inline-size'), style.getPropertyPriority('max-inline-size')];
  style.setProperty('inline-size', 'max-content', 'important');
  style.setProperty('max-inline-size', 'none', 'important');
  const width = element.getBoundingClientRect().width;
  if (saved[0]) style.setProperty('inline-size', saved[0], saved[1]);else style.removeProperty('inline-size');
  if (saved[2]) style.setProperty('max-inline-size', saved[2], saved[3]);else style.removeProperty('max-inline-size');
  return width;
} // The width of `count` characters (ch) in an element's own font: ch is the
// advance of the digit zero, read from a canvas in the element's font -- no
// probe in the page.


let charsContext = null;

function charsWidth(element, count) {
  const style = getComputedStyle(element);
  charsContext ??= element.ownerDocument.createElement('canvas').getContext('2d');
  if (!charsContext) return 0;
  charsContext.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  return charsContext.measureText('0').width * count;
}

function contentWidth(element) {
  const style = getComputedStyle(element);
  return element.clientWidth - (parseFloat(style.paddingInlineStart) || 0) - (parseFloat(style.paddingInlineEnd) || 0);
}

class SfDownloadFile extends DownloadFileElement {
  constructor() {
    super();
    this._boundRoot = null; // A press the host answered by preparing the file: when the file is ready
    // (state back to ready with an href) it is fetched, as the person asked
    // (decision C25) -- by itself within ten seconds on a page in sight, else
    // by «Скачать» (C51). A file prepared before anyone pressed is not.

    this._awaiting = false;
    this._pressedAt = 0;
    this._offer = false;
    this._cancelAsked = false;
    this._refocus = false;
    this._resolvedSize = '';
    this._live = {
      polite: '',
      assertive: ''
    }; // A failed row's fit (decision C88): narrow puts «Повторить» under the
    // text, retryIcon draws it as the icon alone; retryWidth is the width of
    // the button with its words, measured while it had them.

    this._narrow = false;
    this._retryIcon = false;
    this._retryWidth = 0;
    this._retryReach = 0;
    this._fitObserver = null;
    this._fitFrame = 0;

    this._onPress = event => this.onPress(event);
  }

  get shownState() {
    const value = this.getAttribute('state');
    return STATES.includes(value) ? value : 'ready';
  } // What the row shows: the state, and offer for a ready file that waits for
  // its «Скачать».


  get view() {
    const state = this.shownState;
    if (state === 'ready' && this._offer && this.getAttribute('href') && !this.hasAttribute('disabled')) return 'offer';
    return state;
  } // What the template draws is what the component answers (template-context):
  // an absent name is the link's last part, else «Файл»; a file link
  // downloads in the same tab unless target="_blank" opens it to view
  // (decision C25), whether or not the download attribute is given.


  get fileName() {
    return this.getAttribute('file-name') || (0,_component_download_file_js_download_file__WEBPACK_IMPORTED_MODULE_0__.nameFromHref)(this.getAttribute('href') || '') || this.sfWord('file');
  }

  get download() {
    return Boolean(this.getAttribute('href')) && this.getAttribute('target') !== '_blank';
  }

  get templateName() {
    return this.getAttribute('template') || 'default';
  } // The share made so far, 0 to 100, or null when the host does not know it
  // (the spinner then stands in the sign's place).


  get shownValue() {
    const raw = this.getAttribute('value');
    if (raw === null || raw.trim() === '') return null;
    const number = Number(raw);
    if (!Number.isFinite(number)) return null;
    return Math.min(100, Math.max(0, Math.round(number)));
  }

  get shownSize() {
    return this.getAttribute('file-size') || this._resolvedSize || '';
  } // The sign is the download sign (decision C25): a file-type glyph in its
  // place read as «open a document». icon is still drawn until 2027-01-01 and
  // noted once; the type is file-type, in words.


  get signIcon() {
    const icon = this.getAttribute('icon');
    if (!icon || icon === 'download') return 'download';

    if (!this._iconNoted) {
      this._iconNoted = true;
      (0,_core_js_deprecations__WEBPACK_IMPORTED_MODULE_1__.noteDeprecated)({
        component: 'sf-file-download',
        tag: 'sf-file-download',
        kind: 'setting',
        attribute: 'icon',
        from: 'icon',
        to: 'file-type',
        since: '2026-11-09',
        remove_after: '2027-01-01'
      });
    }

    return icon;
  }

  percentText(value) {
    return (0,_core_js_format_number_js__WEBPACK_IMPORTED_MODULE_2__.percentText)(Math.round(Number(value)), this);
  }

  templateContext() {
    const props = this.getPropsContext();
    const href = this.getAttribute('href') || '';
    const opensTab = Boolean(href) && this.getAttribute('target') === '_blank';
    const name = this.fileName;
    const fileType = this.getAttribute('file-type') || '';
    const fileSize = this.shownSize;
    const value = this.shownValue;
    return this.createTemplateContext({ ...props,
      size: this.size,
      state: this.shownState,
      view: this.view,
      // No invented file: an absent name is the link's last part, else «Файл».
      fileName: name,
      fileType,
      fileSize,
      // «, CSV, 112 байт»: what a screen reader hears after the name.
      said: (0,_component_download_file_js_download_file__WEBPACK_IMPORTED_MODULE_0__.fileSaid)(fileType, fileSize, this),
      icon: this.signIcon,
      opensTab,
      // A file link downloads where the person is (decision C25): the
      // download semantics are the default, a tab opened to view has none.
      download: this.download,
      fullWidth: this.hasAttribute('full-width') && this.getAttribute('full-width') !== 'false',
      value,
      cancelable: this.hasAttribute('cancelable') && this.getAttribute('cancelable') !== 'false',
      errorText: this.getAttribute('error-text') || '',
      narrow: this._narrow,
      retryIcon: this._retryIcon,
      tipIds: this.view === 'error' ? {
        name: (0,_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_5__.partId)((0,_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_5__.instancePath)(this, {
          kind: 'sf-file-download'
        }), 'name'),
        retry: this._retryIcon ? (0,_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_5__.partId)((0,_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_5__.instancePath)(this, {
          kind: 'sf-file-download'
        }), 'retry') : ''
      } : {},
      words: {
        preparing: this.sfWord('preparing-text'),
        preparingValue: value === null ? '' : this.sfWord('preparing-value-text', {
          vars: {
            percent: this.percentText(value)
          }
        }),
        failed: this.sfWord('failed-text'),
        retry: this.sfWord('retry-text'),
        retryLabel: this.sfWord('retry-label', {
          vars: {
            name
          }
        }),
        cancel: this.sfWord('cancel-text'),
        cancelLabel: this.sfWord('cancel-label', {
          vars: {
            name
          }
        }),
        ready: this.sfWord('ready-text'),
        get: this.sfWord('get-text'),
        getLabel: this.sfWord('get-label', {
          vars: {
            name
          }
        }),
        newTab: this.sfWord('new-tab-text')
      },
      live: this._live,
      ariaLabel: this.getAttribute('aria-label') || '',
      component: this
    });
  } // A line for the live regions: polite for the start, the end and a cancel,
  // assertive for an error (decision C51). The other region is emptied, so a
  // later line of the same words is said again.


  say(text, {
    urgent = false
  } = {}) {
    this._live = urgent ? {
      polite: '',
      assertive: text
    } : {
      polite: text,
      assertive: ''
    };
    this.requestComponentUpdate?.('live');
  } // Did the focus sit on what this element drew (read before a change draws
  // anything)?


  holdsFocus() {
    const active = this.ownerDocument.activeElement;
    return Boolean(active && active !== this.ownerDocument.body && this.contains(active));
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // The file is a button until it has an address and a link after (a host
    // that prepares the file sets href when it is ready), and a row that
    // cannot be pressed when it failed or waits for «Скачать»: the new element
    // takes the focus the old one held, so a keyboard user is not dropped to
    // the page's body. Only when the focus was on the file; read before the
    // change draws anything.
    if (oldValue !== newValue && REDRAWN_BY.has(name) && this.holdsFocus()) {
      this._refocus = true;
    }

    if (name === 'href' && oldValue !== newValue) this._resolvedSize = ''; // Another size or another state draws «Повторить» anew: its width with
    // its words is measured again.

    if ((name === 'size' || name === 'state' || name === 'lang') && oldValue !== newValue) {
      this._retryIcon = false;
      this._retryWidth = 0;
    }

    super.attributeChangedCallback?.(name, oldValue, newValue);
    if (name !== 'state' || oldValue === newValue) return;
    const next = STATES.includes(newValue) ? newValue : 'ready';
    const previous = STATES.includes(oldValue) ? oldValue : 'ready';
    const file = this.fileName; // A state the page was written with is shown, not said: only a change
    // while the file is on the page is announced.

    const shown = this.isRendered;

    if (next === 'preparing') {
      this._offer = false;
      this._cancelAsked = false;
      if (shown) this.say(this.sfWord('said-preparing', {
        vars: {
          name: file
        }
      }));
      return;
    }

    if (next === 'error') {
      this._offer = false;
      this._awaiting = false;
      this._cancelAsked = false;
      const reason = this.getAttribute('error-text') || '';
      if (shown) this.say(`${this.sfWord('said-failed', {
        vars: {
          name: file
        }
      })}${reason ? ` ${reason}` : ''}`, {
        urgent: true
      });
      return;
    }

    if (previous !== 'preparing') return; // Back to ready after «Отменить»: the file was not made.

    if (this._cancelAsked) {
      this._cancelAsked = false;
      this._awaiting = false;
      if (shown) this.say(this.sfWord('said-cancelled', {
        vars: {
          name: file
        }
      }));
      return;
    }

    if (!shown) return;
    const href = this.getAttribute('href');

    if (!href || this.hasAttribute('disabled')) {
      this._awaiting = false;
      return;
    }

    const said = (0,_component_download_file_js_download_file__WEBPACK_IMPORTED_MODULE_0__.fileSaid)(this.getAttribute('file-type') || '', this.shownSize, this);

    if (!this._awaiting) {
      this.say(this.sfWord('said-ready', {
        vars: {
          name: file,
          said
        }
      }));
      return;
    }

    this._awaiting = false;
    const inTime = Date.now() - this._pressedAt <= FETCH_ITSELF_WITHIN;
    const inSight = this.ownerDocument.visibilityState !== 'hidden';

    if (inTime && inSight) {
      (0,_component_download_file_js_download_file__WEBPACK_IMPORTED_MODULE_0__.buildAnchorDownload)(href, this.getAttribute('file-name') || (0,_component_download_file_js_download_file__WEBPACK_IMPORTED_MODULE_0__.nameFromHref)(href));
      this.say(this.sfWord('said-fetched', {
        vars: {
          name: file,
          said
        }
      }));
      return;
    }

    this._offer = true;
    this.say(this.sfWord('said-offer', {
      vars: {
        name: file,
        said
      }
    }));
    this.requestComponentUpdate?.('state');
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_6__.renderDownloadFileTemplate)(this.templateContext());
  } // The class binder's activation, as the element's request: false when a
  // listener refused it. A refused request is the host taking the download
  // over -- preparing the file, perhaps -- so the press is remembered.


  requestDownload = detail => {
    const delivered = this.sfEmit('request', detail, {
      cancelable: true
    });
    this._awaiting = !delivered;
    if (!delivered) this._pressedAt = Date.now();
    return delivered;
  }; // The size the class binder asked of the file (one HEAD to this page's own
  // server): drawn by the template, which also says it.

  takeResolvedSize = text => {
    if (this.getAttribute('file-size') || this._resolvedSize === text) return;
    this._resolvedSize = text;
    this.requestComponentUpdate?.('file-size');
  }; // The buttons the row draws (decision C51): «Повторить» in a row that
  // failed, «Отменить» beside one being made, «Скачать» beside one ready.

  onPress(event) {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const control = target.closest('.sf-download-file__retry, .sf-download-file__cancel, .sf-download-file__get');
    if (!control || !this.contains(control)) return;
    const href = this.getAttribute('href') || '';
    const fileName = this.getAttribute('file-name') || '';

    if (control.classList.contains('sf-download-file__retry')) {
      if (this.shownState !== 'error') return; // The press counts as the person's: the file is fetched when it is made.

      this._awaiting = true;
      this._pressedAt = Date.now(); // The row and its button are drawn again when the host starts preparing
      // the file; the focus is kept on the file the person asked for (docs
      // acceptance 2026-11-10, L1).

      this._refocus = true;
      this.sfEmit('retry', {
        href,
        fileName
      });
      return;
    }

    if (control.classList.contains('sf-download-file__cancel')) {
      if (this.shownState !== 'preparing') return;
      this._refocus = true; // A cancelable request: a host that answers it itself prevents it;
      // otherwise the file is back as it was before the press.
      // The host that prevents it sets ready itself when the work stopped;
      // either way the return to ready is said as a cancel.

      this._cancelAsked = true;
      this._awaiting = false;
      const goes = this.sfEmit('cancel', {
        href,
        fileName
      }, {
        cancelable: true
      });
      if (goes) this.setAttribute('state', 'ready');
      return;
    } // «Скачать»: the person's fresh press fetches the file; the row is the
    // file's link again and takes the focus.


    if (this.view !== 'offer' || !href) return;
    this._offer = false;
    this._refocus = true;
    (0,_component_download_file_js_download_file__WEBPACK_IMPORTED_MODULE_0__.buildAnchorDownload)(href, fileName || (0,_component_download_file_js_download_file__WEBPACK_IMPORTED_MODULE_0__.nameFromHref)(href));
    this.requestComponentUpdate?.('state');
  }

  onConnected() {
    super.onConnected?.();
    this.addEventListener('click', this._onPress);
  } // Where the focus goes when what held it was drawn away: the button the
  // row now offers, else the row.


  focusTarget() {
    const view = this.view;
    const host = view === 'error' ? this.querySelector('.sf-download-file__retry') : view === 'offer' ? this.querySelector('.sf-download-file__get') : null;
    return host || this._boundRoot;
  }

  afterRender() {
    if (this._boundRoot) {
      (0,_component_download_file_js_download_file__WEBPACK_IMPORTED_MODULE_0__.unbindDownloadFile)(this._boundRoot);
      this._boundRoot = null;
    }

    const root = this.querySelector('.sf-download-file');
    this._boundRoot = root?.matches('a, button') ? root : null;

    if (this._boundRoot) {
      // The class script binds every .sf-download-file it finds on the page; a
      // root it reached first is bound again with the element's request.
      (0,_component_download_file_js_download_file__WEBPACK_IMPORTED_MODULE_0__.unbindDownloadFile)(this._boundRoot);
      (0,_component_download_file_js_download_file__WEBPACK_IMPORTED_MODULE_0__.bindDownloadFile)(this._boundRoot, {
        onActivate: this.requestDownload,
        onSize: this.takeResolvedSize
      });
    }

    this.watchFit(); // After «Повторить», «Отменить» or «Скачать», or when the file was drawn
    // as another element while it held the focus (the button became the link,
    // the row failed): the file, or the button it now offers, takes the focus
    // back -- only if the focus was lost with it, never taken from where the
    // person has moved since.

    if (this._refocus) {
      this._refocus = false;
      const active = document.activeElement;

      if (!active || active === document.body) {
        const target = this.focusTarget();

        if (target === this._boundRoot && this._boundRoot) {
          this._boundRoot.focus({
            preventScroll: true
          });
        } else if (target) {
          // An sf-button draws its own button and shows it once its sheets
          // are applied: before that the button takes no focus (the probe of
          // 2026-11-11 found the focus left on the body). Focus it when it has
          // rendered.
          const place = () => {
            const now = document.activeElement;
            if (target.isConnected && (!now || now === document.body)) target.focus({
              preventScroll: true
            });
          };

          customElements.whenDefined(target.localName).then(() => {
            if (target.isRendered === false && typeof target.whenRendered === 'function') target.whenRendered(place);else place();
          });
        }
      }
    }
  } // A failed row's fit (decision C88; the rule is js/error-fit.js), measured
  // after it is drawn and again when its column or the row changes size.


  fitError() {
    const row = this.view === 'error' ? this.querySelector('.sf-download-file--error') : null;

    if (!row) {
      this._fitObserver?.disconnect();
      return;
    }

    const column = layoutParent(this);
    const rem = parseFloat(getComputedStyle(this.ownerDocument.documentElement).fontSize) || 16;
    const width = column ? contentWidth(column) : 0; // The button's own width with its words (max-content): under the text a
    // button wider than its column is squeezed to it, so its drawn width
    // cannot tell whether the words fit.

    const button = row.querySelector('.sf-download-file__retry > button');

    if (!this._retryIcon && button) {
      const measured = maxContentWidth(button);

      if (measured > 0) {
        this._retryWidth = measured;
        this._retryReach = parseFloat(getComputedStyle(button).paddingInlineStart) || 0;
      }
    }

    const text = row.querySelector('.sf-download-file__text');
    const name = row.querySelector('.sf-download-file__name'); // Until the button has drawn with its words there is nothing to weigh:
    // the button's first size calls the fit again.

    if (!(width > 0) || !text || !name || !(this._retryWidth > 0)) return; // The text column at the column's whole width, the same in both layouts:
    // the column less the row's border and padding, the sign and the gap
    // before the text, and the border and padding after it.

    const rowBox = row.getBoundingClientRect();
    const textBox = text.getBoundingClientRect();
    const rowStyle = getComputedStyle(row);
    const rtl = rowStyle.direction === 'rtl';
    const lead = rtl ? rowBox.right - textBox.right : textBox.left - rowBox.left;
    const padEnd = parseFloat(rowStyle.paddingInlineEnd) || 0;
    const trail = padEnd + (parseFloat(rowStyle.borderInlineEndWidth) || 0);
    const textColumn = width - lead - trail;
    const body = row.querySelector('.sf-download-file__body');
    const gap = body ? parseFloat(getComputedStyle(body).columnGap) || 0 : 0;
    const {
      narrow,
      retryIcon
    } = (0,_js_error_fit_js__WEBPACK_IMPORTED_MODULE_7__.errorFit)({
      width,
      rem,
      textColumn,
      gap,
      retryWidth: this._retryWidth,
      reach: this._retryReach,
      padEnd,
      chars: charsWidth(name, _js_error_fit_js__WEBPACK_IMPORTED_MODULE_7__.NAME_KEEPS_CHARS)
    });
    if (narrow === this._narrow && retryIcon === this._retryIcon) return;
    if (retryIcon !== this._retryIcon && this.holdsFocus()) this._refocus = true;
    this._narrow = narrow;
    this._retryIcon = retryIcon;
    this.requestComponentUpdate?.('fit');
  }

  watchFit() {
    if (this.view !== 'error') {
      this._fitObserver?.disconnect();
      return;
    }

    if (typeof ResizeObserver === 'undefined') return;

    if (!this._fitObserver) {
      this._fitObserver = new ResizeObserver(() => {
        if (this._fitFrame) return;
        this._fitFrame = requestAnimationFrame(() => {
          this._fitFrame = 0;
          this.fitError();
        });
      });
      globalThis.document?.fonts?.ready?.then?.(() => this.fitError());
    }

    this._fitObserver.disconnect();

    const column = layoutParent(this);
    const row = this.querySelector('.sf-download-file--error');
    const retry = this.querySelector('.sf-download-file__retry');
    if (column) this._fitObserver.observe(column);
    if (row) this._fitObserver.observe(row); // The button draws itself after the row (its host is display: contents
    // and has no size of its own): its first drawn size starts the fit.

    if (retry) customElements.whenDefined(retry.localName).then(() => {
      const drawn = () => {
        const inner = retry.querySelector(':scope > button');
        if (inner && this._fitObserver) this._fitObserver.observe(inner);
        this.fitError();
      };

      if (retry.isRendered === false && typeof retry.whenRendered === 'function') retry.whenRendered(drawn);else drawn();
    });
    this.fitError();
  }

  onDisconnected() {
    this._fitObserver?.disconnect();
    this._fitObserver = null;
    if (this._fitFrame) cancelAnimationFrame(this._fitFrame);
    this._fitFrame = 0;
    this.removeEventListener('click', this._onPress);

    if (this._boundRoot) {
      (0,_component_download_file_js_download_file__WEBPACK_IMPORTED_MODULE_0__.unbindDownloadFile)(this._boundRoot);
      this._boundRoot = null;
    }
  }

}

SfDownloadFile.define('sf-file-download');
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "5a234b6890bd"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NAME_KEEPS_CHARS: () => (/* binding */ NAME_KEEPS_CHARS),
/* harmony export */   NARROW_BELOW_REM: () => (/* binding */ NARROW_BELOW_REM),
/* harmony export */   errorFit: () => (/* binding */ errorFit)
/* harmony export */ });
// Where a failed row draws «Повторить» (owner decision C88, prototype
// prototypes/file-download-row-composition.html variant B, dispatcher rules
// F1 and F2 of 2026-11-12). The element measures the row and asks this; a pure
// module, so a contract reads it.
//
// narrow -- «Повторить» goes under the text, from the text's edge: in a
//   column narrower than 24rem (384 px; C88, on the container step g2 of
//   C181 as sf-file-preview's failed row; it was 22.5rem), and also wherever the name's
//   column beside the button with its words would hold fewer than 16
//   characters (ch) at the name's own text size (F2). The width alone did not
//   fit sizes 2 and 3: at 360 px their wide button left the name 90.7 and
//   41.6 px, and it broke letter by letter.
// retryIcon -- the icon alone, its name in aria-label and a tooltip: only
//   while narrow, and only when the button with its words is wider than the
//   room under the text. That room is the text column, plus the button's own
//   padding before it (the plate reaches into the gap, so its words line up
//   with the text), plus the same again after it as prototype B allows (F1),
//   but never past the row's own padding there: on the phone ladder at sizes 2
//   and 3 the button's padding is the wider one, and the plate would cross the
//   frame (0.8 px past a 200 px box at 390, measured).
const NARROW_BELOW_REM = 24;
const NAME_KEEPS_CHARS = 16;
/**
 * @param {object} row
 * @param {number} row.width      the column's content width
 * @param {number} row.rem        the root font size
 * @param {number} row.textColumn the text column at the column's whole width
 * @param {number} row.gap        the row's column gap
 * @param {number} row.retryWidth the button with its words (max-content)
 * @param {number} row.reach      the button's inline padding
 * @param {number} row.padEnd     the row's inline-end padding
 * @param {number} row.chars      NAME_KEEPS_CHARS characters (ch) at the name's size
 * @returns {{narrow: boolean, retryIcon: boolean}}
 */

function errorFit({
  width,
  rem,
  textColumn,
  gap,
  retryWidth,
  reach,
  padEnd,
  chars
}) {
  const nameBeside = textColumn - gap - retryWidth;
  const narrow = width < NARROW_BELOW_REM * rem || nameBeside < chars - 0.5;
  const room = textColumn + reach + Math.min(reach, padEnd);
  return {
    narrow,
    retryIcon: narrow && retryWidth > room + 0.5
  };
}

/***/ },

/***/ "f61e7676b0d2"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderDownloadFileTemplate: () => (/* binding */ renderDownloadFileTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var _component_spinner_js_spinner_draw__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("50d2a204ba4c");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);

 // One file to fetch (decisions C25, C51):
//   ready      the download sign, the name, and right after it the type and
//              the size (under it on a phone); the row is as wide as its text
//              unless full-width. A screen reader hears «name, type, size»,
//              the unit in words.
//   preparing  the Framework's spinner in the sign's place -- the progress
//              ring with value -- and «Готовим файл…» or «Готовим… N %» in
//              place of the type and the size, aria-busy, no second press;
//              «Отменить» beside the row while cancelable.
//   offer      ready after a long wait, or while the page was hidden: the
//              success sign, «Готово · type · size» and «Скачать» beside it.
//   error      the row itself says so (decision C88): one grid of the
//              error sign, the text and «Повторить». The sign stands on the
//              name's first line, the name takes two lines at most (the whole
//              name in its tooltip and for a screen reader), «Не удалось
//              собрать» and error-text a step smaller under it, inside the
//              frame. «Повторить» ends the first line; in a column narrower
//              than 360 px, or where the name beside it would keep fewer than
//              16 characters, it goes under the text, and only when its words do
//              not fit there either is it the icon alone, its name in
//              aria-label and a tooltip.
// A file link downloads in the same tab; target="_blank" is a file opened to
// view, and says so with a sign after the name and words for a screen reader.
// Two hidden live regions follow the file: the start, the end and a cancel
// are said politely, an error at once.

function renderDownloadFileTemplate(context) {
  const {
    live = {}
  } = context;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${renderFile(context)}<span class="sf-download-file__live" role="status">${live.polite || ''}</span><span class="sf-download-file__live" role="alert">${live.assertive || ''}</span>`;
}

function rowClasses(context, view) {
  const {
    size,
    disabled,
    fullWidth
  } = context;
  return ['sf-download-file', `sf-download-file--size-${size}`, `sf-download-file--${view}`, fullWidth ? 'sf-download-file--full-width' : '', context.rootClass, view === 'ready' || view === 'preparing' ? disabled ? 'disabled' : 'cursor-pointer transition' : ''].filter(Boolean).join(' ');
} // The Framework's plain tooltip (component.tooltip, class markup), hidden
// until the tooltip controller shows it on hover or keyboard focus of the
// trigger that names it. aria-hidden: what it says is already the trigger's
// name.


function tip(id, text) {
  if (!id) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span id=${id} class="sf-tooltip sf-tooltip--dark sf-tooltip--size-1/3 sf-download-file__tip" aria-hidden="true" hidden><span class="sf-tooltip-content"><span class="sf-tooltip-text">${text}</span></span></span>`;
}

function sizeMeta(fileType, fileSize, lead = lit__WEBPACK_IMPORTED_MODULE_0__.nothing) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-download-file__meta" aria-hidden="true">${lead}${fileType ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-download-file__type">${fileType}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}<span class="sf-download-file__size sf-download-file-file-size">${fileSize}</span></span>`;
}

function body(sign, text, end = lit__WEBPACK_IMPORTED_MODULE_0__.nothing) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <span class="sf-download-file__body sf-download-file-wrap">
      <span class="sf-download-file__main sf-download-file-container">
        ${sign}
        <span class="sf-download-file__text">${text}</span>
      </span>
      ${end}
    </span>
  `;
}

function renderFile(context) {
  const {
    view,
    size,
    fileName,
    fileType,
    fileSize,
    said,
    words,
    fullWidth
  } = context;

  const stack = content => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class=${fullWidth ? 'sf-download-file__stack sf-download-file__stack--full-width' : 'sf-download-file__stack'}>${content}</div>`; // The hidden words stand inside the name, so a screen reader hears them as
  // one line with it: «Смета.csv, CSV, 112 байт».


  const name = (words = '') => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-download-file__name sf-download-file-file-name">${fileName}${words ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-download-file__said">${words}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}</span>`;

  if (view === 'error') {
    const {
      narrow,
      retryIcon,
      tipIds = {}
    } = context;
    const retry = retryIcon ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button-icon
          class="sf-download-file__retry"
          size=${size}
          height="low"
          appearance="ghost"
          scheme="primary"
          icon="refresh"
          aria-label=${words.retryLabel}
          data-tooltip=${tipIds.retry || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        ></sf-button-icon>${tip(tipIds.retry, words.retry)}` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button
          class="sf-download-file__retry"
          size=${size}
          height="low"
          appearance="ghost"
          scheme="primary"
          icon-start="refresh"
          text=${words.retry}
          aria-label=${words.retryLabel}
        ></sf-button>`;
    const classes = [rowClasses(context, 'error'), narrow ? 'sf-download-file--narrow' : '', retryIcon ? 'sf-download-file--retry-icon' : ''].filter(Boolean).join(' '); // The name is cut after two lines: its tooltip shows it whole, and the
    // words stay whole in the markup, so a screen reader hears all of them.

    const row = (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
      <div class=${classes} style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} role="group" aria-label=${fileName}>
        ${body((0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class="sf-download-file__icon sf-icon" aria-hidden="true">error</i>`, (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-download-file__name sf-download-file-file-name" data-tooltip=${tipIds.name || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>${fileName}<span class="sf-download-file__said">, ${words.failed}</span></span><span class="sf-download-file__meta" aria-hidden="true"><span class="sf-download-file__status">${words.failed}</span></span>${context.errorText ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-download-file__reason">${context.errorText}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}`, (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-download-file__end">${retry}</span>`)}
        ${tip(tipIds.name, fileName)}
      </div>
    `;
    return stack(row);
  }

  if (view === 'offer') {
    const row = (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
      <span class=${rowClasses(context, 'offer')} style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
        ${body((0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class="sf-download-file__icon sf-icon" aria-hidden="true">check_circle</i>`, (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${name(`, ${words.ready}${said}`)}${sizeMeta(fileType, fileSize, (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-download-file__status">${words.ready}</span>`)}`)}
      </span>
    `;
    return stack((0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-download-file__line">${row}<sf-button
      class="sf-download-file__get"
      size=${size}
      height="low"
      appearance="default"
      scheme="primary"
      icon-start="download"
      text=${words.get}
      aria-label=${words.getLabel}
    ></sf-button></div>`);
  }

  const preparing = view === 'preparing';
  const {
    href,
    download,
    disabled,
    opensTab,
    ariaLabel
  } = context;
  const hasValue = preparing && context.value !== null;
  const sign = !preparing ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class="sf-download-file__icon sf-icon" aria-hidden="true">${context.icon}</i>` : hasValue ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-download-file__ring" aria-hidden="true"><span class="sf-progress-ring" style=${`--sf-progress-ring--value:${context.value}`}><span class="sf-progress-ring-indicator"></span></span></span>` : (0,_component_spinner_js_spinner_draw__WEBPACK_IMPORTED_MODULE_1__.createInlineSpinner)({
    className: 'sf-download-file__spinner'
  });
  const tab = opensTab ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class="sf-download-file__tab sf-icon" aria-hidden="true">open_in_new</i><span class="sf-download-file__tab-words">${words.newTab}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const text = preparing ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${name(', ')}<span class="sf-download-file__meta"><span class="sf-download-file__status">${hasValue ? words.preparingValue : words.preparing}</span></span>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${name(opensTab ? '' : said)}${tab}${opensTab && said ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-download-file__said">${said}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}${sizeMeta(fileType, fileSize)}`;
  const content = body(sign, text);
  const classes = rowClasses(context, preparing ? 'preparing' : 'ready');
  const row = href && !disabled ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
      <a
        class=${classes}
        style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        href=${href}
        target=${opensTab ? '_blank' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        rel=${opensTab ? 'noopener noreferrer' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        download=${download ? fileName || '' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        aria-label=${ariaLabel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        aria-busy=${preparing ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      >
        ${content}
      </a>
    ` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
      <button
        type="button"
        class=${classes}
        style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        ?disabled=${disabled}
        aria-disabled=${disabled ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        aria-label=${ariaLabel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        aria-busy=${preparing ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      >
        ${content}
      </button>
    `; // «Отменить» stands beside the row while the file is made and the host
  // can stop it (cancelable).

  if (preparing && context.cancelable) {
    return stack((0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-download-file__line">${row}<sf-button
      class="sf-download-file__cancel"
      size=${size}
      height="low"
      appearance="ghost"
      scheme="on-surface"
      text=${words.cancel}
      aria-label=${words.cancelLabel}
    ></sf-button></div>`);
  }

  return row;
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

/***/ "e92fd2d1a38c"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("instance-path", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("instance-path", 1).then(resolve, reject), { once: true })));

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

/***/ "d0b5a0385ddc"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _en_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("6505fad144dc");
/* harmony import */ var _ru_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("ec79d273e58f");
// The component's words for the bundle and for Node alike (localization study
// LC-4/LC-5): the runtime words of its language files, by language.



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ en: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime, ru: _ru_json__WEBPACK_IMPORTED_MODULE_1__.runtime });


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

/***/ "8ea1dd3302c4"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{".sf-download-file":["display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","gap/var(--sf-e5)","justify-content/space-between (.justify-between)","align-items/center (.items-center)"],".sf-download-file .sf-download-file-wrap":["display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","gap/var(--sf-download-file-wrap--gap)","justify-content/flex-start (.justify-start)","align-items/center (.items-center)"]}');

/***/ },

/***/ "6505fad144dc"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"runtime":{"new-tab":"(opens in a new tab)","byte":{"one":"byte","other":"bytes"},"kilobyte":{"one":"kilobyte","other":"kilobytes"},"megabyte":{"one":"megabyte","other":"megabytes"},"gigabyte":{"one":"gigabyte","other":"gigabytes"},"terabyte":{"one":"terabyte","other":"terabytes"}}}');

/***/ },

/***/ "ec79d273e58f"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"runtime":{"new-tab":"(откроется в новой вкладке)","byte":{"one":"байт","few":"байта","many":"байт","other":"байта"},"kilobyte":{"one":"килобайт","few":"килобайта","many":"килобайт","other":"килобайта"},"megabyte":{"one":"мегабайт","few":"мегабайта","many":"мегабайт","other":"мегабайта"},"gigabyte":{"one":"гигабайт","few":"гигабайта","many":"гигабайт","other":"гигабайта"},"terabyte":{"one":"терабайт","few":"терабайта","many":"терабайт","other":"терабайта"}}}');

/***/ },

/***/ "3694b5e2bf39"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"runtime":{"b":"B","kb":"KB","mb":"MB","gb":"GB"}}');

/***/ },

/***/ "220979cc98c6"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"runtime":{"b":"Б","kb":"КБ","mb":"МБ","gb":"ГБ"}}');

/***/ },

/***/ "9288cedb5bb5"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-file-download for the shim (stands/18-aliases-ci/alias.mjs, standard §16 item 20). mode: same-detail (the shim sends the new and the old name), split / detail-adds (a detail adapter, refused by the shim), attribute-and-property, method, property, manifest-only (the DOM name does not change), host-attribute (no shim), retired.","component":"sf-file-download","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"aria-label","to":null,"kind":"attribute","component":"sf-file-download","since":"2026-10-27","remove_after":"2026-12-01","mode":"host-attribute","section":"§3.1","note":"stays a host attribute, read by the base (§3.1, §4.8); no shim"},{"from":"sf-download-file:click","to":"sf-download-file-download","kind":"event","component":"sf-file-download","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","cancelable":true,"manifest":{"from":"sf-download-file:click","to":"sf-download-file-download"},"section":"§8, vocabulary 1.1.5 §5.1","note":"the class event\'s name; bx-simai.main listens to it (vocabulary §9.2). The shim sends it after sf-download-file-download, one detail, one cancel"},{"from":"sf-download-file","to":"sf-file-download","kind":"tag","component":"sf-file-download","since":"2026-11-03","remove_after":"2027-01-01","section":"rename plan R0 (ui-control RENAME-PLAN-2026-11-03), naming decision 2026-11-02","note":"the element is sf-file-download; sf-download-file is a subclass defined beside it until the date"},{"from":"sf-download-file-download","to":"sf-file-download-download","kind":"event","component":"sf-file-download","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-download-file-retry","to":"sf-file-download-retry","kind":"event","component":"sf-file-download","since":"2026-11-09","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag; the former tag sf-download-file sends its own name until the tag alias goes"},{"from":"sf-file-download-download","to":"sf-file-download-request","kind":"event","component":"sf-file-download","since":"2026-11-11","remove_after":"2027-01-01","mode":"same-detail","cancelable":true,"section":"§8, vocabulary 1.1.5 §5.1","note":"the request doubled the word in its name (owner decision C51, docs pre-check DF-11); the shim sends the old name after sf-file-download-request, one detail, one cancel, and the older names after it"},{"from":"sf-download-file-request","to":"sf-file-download-request","kind":"event","component":"sf-file-download","since":"2026-11-11","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag; the former tag sf-download-file sends its own name until the tag alias goes"},{"from":"sf-download-file-cancel","to":"sf-file-download-cancel","kind":"event","component":"sf-file-download","since":"2026-11-11","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag; the former tag sf-download-file sends its own name until the tag alias goes"}]}');

/***/ },

/***/ "312445577dad"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.file-download","tag":"sf-file-download","version":"1.5.5","kind":"leaf","settings":{"size":{"type":"enum","values":["1/3","1/2","1","2","3"],"default":"1"},"full-width":{"type":"boolean","default":false},"file-name":{"type":"string","default":""},"file-size":{"type":"string","default":""},"file-type":{"type":"string","default":""},"icon":{"type":"icon","default":"download"},"href":{"type":"string","default":""},"download":{"type":"boolean","default":false},"disabled":{"type":"boolean","default":false},"state":{"type":"enum","values":["ready","preparing","error"],"default":"ready"},"error-text":{"type":"string","default":""},"target":{"type":"string","default":""},"value":{"type":"number","optional":true,"min":0,"max":100},"cancelable":{"type":"boolean","default":false}},"values":{},"events":{"request":{"carries":{"href":"string","file-name":"string","download":"boolean"},"cancelable":true},"retry":{"carries":{"href":"string","file-name":"string"}},"cancel":{"carries":{"href":"string","file-name":"string"},"cancelable":true}},"actions":{},"css-variables":{"--sf-file-download-background-color":{"type":"color","state":"default"},"--sf-file-download-border-color":{"type":"color","state":"default"},"--sf-file-download-radius":{"type":"length","state":"default"},"--sf-file-download-padding":{"type":"length","state":"default"},"--sf-file-download-gap":{"type":"length","state":"default"},"--sf-file-download-icon-size":{"type":"length","state":"default"},"--sf-file-download-icon-color":{"type":"color","state":"default"}}}');

/***/ },

/***/ "6da9b5d8b341"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Download File","runtime":{"file":"File","preparing-text":"Preparing the file…","preparing-value-text":"Preparing… {percent}","failed-text":"Could not be made","retry-text":"Retry","retry-label":"Retry: {name}","cancel-text":"Cancel","cancel-label":"Cancel: {name}","ready-text":"Ready","get-text":"Download","get-label":"Download {name}","new-tab-text":"(opens in a new tab)","said-preparing":"Preparing the file “{name}”","said-ready":"The file is ready: “{name}”{said}","said-fetched":"The file is ready and downloaded: “{name}”{said}","said-offer":"The file is ready: “{name}”{said}. Button “Download”","said-cancelled":"Preparation cancelled: “{name}”","said-failed":"Error: could not make “{name}”."},"events":{"retry":{"label":"Retry"},"cancel":{"label":"Cancel"}}}');

/***/ },

/***/ "25a776704bf3"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Скачивание файла","runtime":{"file":"Файл","preparing-text":"Готовим файл…","preparing-value-text":"Готовим… {percent}","failed-text":"Не удалось собрать","retry-text":"Повторить","retry-label":"Повторить: {name}","cancel-text":"Отменить","cancel-label":"Отменить: {name}","ready-text":"Готово","get-text":"Скачать","get-label":"Скачать {name}","new-tab-text":"(откроется в новой вкладке)","said-preparing":"Готовим файл «{name}»","said-ready":"Файл готов: «{name}»{said}","said-fetched":"Файл готов и скачан: «{name}»{said}","said-offer":"Файл готов: «{name}»{said}. Кнопка «Скачать»","said-cancelled":"Подготовка отменена: «{name}»","said-failed":"Ошибка: не удалось собрать «{name}»."},"events":{"retry":{"label":"Повторить"},"cancel":{"label":"Отменить"}}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("a811123e77b0");
/******/
/******/ })()
;