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
/* harmony export */   initExistingDownloadFiles: () => (/* binding */ initExistingDownloadFiles),
/* harmony export */   nameFromHref: () => (/* binding */ nameFromHref),
/* harmony export */   unbindDownloadFile: () => (/* binding */ unbindDownloadFile)
/* harmony export */ });
/* harmony import */ var _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d7f974466839");
/* harmony import */ var _register_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("58661bec99a6");
/* harmony import */ var _json_download_file_utility_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("8ea1dd3302c4");
/* harmony import */ var _core_js_format_file_size_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("c016c43b1452");
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("43090d1c8307");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_format_file_size_js__WEBPACK_IMPORTED_MODULE_3__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_4__]);
([_core_js_format_file_size_js__WEBPACK_IMPORTED_MODULE_3__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_4__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_core_js_page_language__WEBPACK_IMPORTED_MODULE_4__);





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
}

async function resolveRemoteFileSize(href, node = null) {
  if (!href || LOCAL_ADDRESS.test(href) || isSameDocument(href)) return '';

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
  ru: {
    'new-tab': '(откроется в новой вкладке)'
  },
  en: {
    'new-tab': '(opens in a new tab)'
  }
}; // A file's name when the markup gives none: the link's last part, decoded.

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
  const resolvedSize = await resolveRemoteFileSize(href, root);
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
} // `onActivate(detail)` takes the place of the class event: sf-download-file
// sends its own cancelable `sf-download-file-download` (standard 1.3.8 §8,
// vocabulary 1.1.5 §5.1), and the old `sf-download-file:click` follows it as a
// dated alias. Answering false cancels the download.


function bindDownloadFile(root, {
  onActivate
} = {}) {
  if (!root || root.dataset[DOWNLOAD_FILE_BOUND_FLAG] === '1') return;

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
    const fileName = root.getAttribute('download') || root.dataset.fileName || root.querySelector('.sf-download-file__name, .sf-download-file-file-name')?.textContent?.trim() || '';
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
      target = ''
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
    if (normalizeSize(size) !== '1') root.classList.add(`sf-download-file--size-${normalizeSize(size)}`);

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
    iconNode.textContent = String(icon || 'download');
    const fileNameNode = document.createElement('span');
    fileNameNode.classList.add('sf-download-file__name', 'sf-download-file-file-name');
    fileNameNode.textContent = shownName; // The name is one line cut with an ellipsis (component.download-file
    // 1.1.0): the title shows the whole of it.

    if (shownName) fileNameNode.title = shownName;
    container.append(iconNode, fileNameNode);

    if (opensTab) {
      const tabNode = document.createElement('i');
      tabNode.classList.add('sf-download-file__tab', 'sf-icon');
      tabNode.setAttribute('aria-hidden', 'true');
      tabNode.textContent = 'open_in_new';
      const tabWords = document.createElement('span');
      tabWords.classList.add('sf-download-file__tab-words');
      tabWords.textContent = (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_4__.pageText)(NEW_TAB_WORDS, 'new-tab', document.documentElement, 'download-file');
      container.append(tabNode, tabWords);
    } // The type and the size are two facts (decision C25): «PDF · 2,4 МБ».


    const metaNode = document.createElement('span');
    metaNode.classList.add('sf-download-file__meta');

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
    wrap.append(container, metaNode);
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
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_format_intl_js__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
_format_intl_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
// File sizes in the page's language («1,4 МБ»), with no top-level side
// effects (format-intl.js). The same functions as core/js/format.js,
// composition/file-size.mjs and SF.format.fileSize.
 // The four words of a size, in the languages the SIMAI Framework ships; any
// other language reads the English words with its own digits. A component
// with words of its own passes them as `units`.

const FILE_SIZE_UNITS = /* @__PURE__ */Object.freeze({
  en: /* @__PURE__ */Object.freeze(['B', 'KB', 'MB', 'GB']),
  ru: /* @__PURE__ */Object.freeze(['Б', 'КБ', 'МБ', 'ГБ'])
});
/** The unit words for a locale: its language's, else English. */

function fileSizeUnits(locale = 'en') {
  const language = String(locale || 'en').toLowerCase().split('-')[0];
  return Object.hasOwn(FILE_SIZE_UNITS, language) ? FILE_SIZE_UNITS[language] : FILE_SIZE_UNITS.en;
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

/***/ "a811123e77b0"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _component_download_file_js_download_file__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("92b137c03f44");
/* harmony import */ var _core_js_deprecations__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("d3818183b14c");
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("f61e7676b0d2");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("312445577dad");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("9288cedb5bb5");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("6da9b5d8b341");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("25a776704bf3");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_component_download_file_js_download_file__WEBPACK_IMPORTED_MODULE_0__, _core_js_deprecations__WEBPACK_IMPORTED_MODULE_1__, _core_js_smart_base__WEBPACK_IMPORTED_MODULE_2__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_3__, _js_templates_default__WEBPACK_IMPORTED_MODULE_4__]);
([_component_download_file_js_download_file__WEBPACK_IMPORTED_MODULE_0__, _core_js_deprecations__WEBPACK_IMPORTED_MODULE_1__, _core_js_smart_base__WEBPACK_IMPORTED_MODULE_2__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_3__, _js_templates_default__WEBPACK_IMPORTED_MODULE_4__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_deprecations__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_deprecations__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_3__);








 // sf-file-download from its component.json (standard simai.smart-component
// 1.3.8 §3, §4, §8): the settings are the attributes and properties
// core/js/element-manifest.js makes from the manifest. A press sends the
// cancelable request sf-download-file-download {href, fileName, download}
// (vocabulary 1.1.5 §5.1) on the host; the old sf-download-file:click follows
// it as a dated alias (aliases.json), and a refused request stops the download.

const DownloadFileElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_3__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_5__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_2___default()),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_7__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_8__
  },
  source: 'ru',
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_6__
});
const STATES = ['ready', 'preparing', 'error']; // The settings that can draw the file as another element (a button or a link).

const REDRAWN_BY = new Set(['href', 'disabled', 'state', 'target']);

class SfDownloadFile extends DownloadFileElement {
  constructor() {
    super();
    this._boundRoot = null; // A press the host answered by preparing the file: when the file is ready
    // (state back to ready with an href) it is fetched once, as the person
    // asked (decision C25). A file prepared before anyone pressed is not.

    this._awaiting = false;
    this._refocus = false;

    this._onAlertAction = event => this.onAlertAction(event);
  }

  get shownState() {
    const value = this.getAttribute('state');
    return STATES.includes(value) ? value : 'ready';
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

  templateContext() {
    const props = this.getPropsContext();
    const href = this.getAttribute('href') || '';
    const opensTab = Boolean(href) && this.getAttribute('target') === '_blank';
    return this.createTemplateContext({ ...props,
      size: this.size,
      state: this.shownState,
      // No invented file: an absent name is the link's last part, else «Файл».
      fileName: this.fileName,
      fileType: this.getAttribute('file-type') || '',
      icon: this.signIcon,
      opensTab,
      // A file link downloads where the person is (decision C25): the
      // download semantics are the default, a tab opened to view has none.
      download: this.download,
      errorText: this.getAttribute('error-text') || '',
      words: {
        preparing: this.sfWord('preparing-text'),
        errorHeading: this.sfWord('error-heading'),
        retry: this.sfWord('retry-text'),
        newTab: this.sfWord('new-tab-text')
      },
      ariaLabel: this.getAttribute('aria-label') || '',
      component: this
    });
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // The file is a button until it has an address and a link after (a host
    // that prepares the file sets href when it is ready): the new element
    // takes the focus the old one held, so a keyboard user is not dropped to
    // the page's body. Only when the focus was on the file; read before the
    // change draws anything.
    if (oldValue !== newValue && REDRAWN_BY.has(name) && this._boundRoot && this.ownerDocument.activeElement === this._boundRoot) {
      this._refocus = true;
    }

    super.attributeChangedCallback?.(name, oldValue, newValue);
    if (name !== 'state' || oldValue === newValue) return;
    const next = STATES.includes(newValue) ? newValue : 'ready';
    if (next === 'error') return;

    if (next === 'ready' && this._awaiting && oldValue === 'preparing') {
      this._awaiting = false;
      const href = this.getAttribute('href');

      if (href && !this.hasAttribute('disabled')) {
        (0,_component_download_file_js_download_file__WEBPACK_IMPORTED_MODULE_0__.buildAnchorDownload)(href, this.getAttribute('file-name') || (0,_component_download_file_js_download_file__WEBPACK_IMPORTED_MODULE_0__.nameFromHref)(href));
      }
    }
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_4__.renderDownloadFileTemplate)(this.templateContext());
  } // The class binder's activation, as the element's request: false when a
  // listener refused it. A refused request is the host taking the download
  // over -- preparing the file, perhaps -- so the press is remembered.


  requestDownload = detail => {
    const delivered = this.sfEmit('download', detail, {
      cancelable: true
    });
    this._awaiting = !delivered;
    return delivered;
  }; // «Повторить» under a file that could not be prepared: the host is asked to
  // make it again (vocabulary §5 retry); the press counts as the person's.

  onAlertAction(event) {
    if (event.detail?.action !== 'retry' || !event.target?.closest?.('.sf-download-file__error')) return;
    event.stopPropagation();
    this._awaiting = true; // The notice and its button go away when the host starts preparing the
    // file again; focus would fall to the page's body (docs acceptance
    // 2026-11-10, L1). It is kept on the file the person asked for.

    this._refocus = true;
    this.sfEmit('retry', {
      href: this.getAttribute('href') || '',
      fileName: this.getAttribute('file-name') || ''
    });
  }

  onConnected() {
    super.onConnected?.();
    this.addEventListener('sf-alert-action', this._onAlertAction);
  }

  afterRender() {
    if (this._boundRoot) {
      (0,_component_download_file_js_download_file__WEBPACK_IMPORTED_MODULE_0__.unbindDownloadFile)(this._boundRoot);
      this._boundRoot = null;
    }

    this._boundRoot = this.querySelector('.sf-download-file');

    if (this._boundRoot) {
      // The class script binds every .sf-download-file it finds on the page; a
      // root it reached first is bound again with the element's request.
      (0,_component_download_file_js_download_file__WEBPACK_IMPORTED_MODULE_0__.unbindDownloadFile)(this._boundRoot);
      (0,_component_download_file_js_download_file__WEBPACK_IMPORTED_MODULE_0__.bindDownloadFile)(this._boundRoot, {
        onActivate: this.requestDownload
      });
    } // After «Повторить», or when the file was redrawn as another element
    // while it held the focus (the button became the link): once the notice
    // is gone, the file takes the focus back -- only if the focus was lost
    // with it, never taken from where the person has moved since.


    if (this._refocus && !this.querySelector('.sf-download-file__error')) {
      this._refocus = false;
      const active = document.activeElement;

      if (this._boundRoot && (!active || active === document.body)) {
        this._boundRoot.focus({
          preventScroll: true
        });
      }
    }
  }

  onDisconnected() {
    this.removeEventListener('sf-alert-action', this._onAlertAction);

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

 // One file to fetch (decision C25, 2026-11-09):
//   ready      the download sign, the name, the type and the size;
//   preparing  the Framework's spinner in the sign's place, «Готовим файл…»
//              in place of the type and the size, aria-busy, no second press;
//   error      the file as when ready, and under it an error notice
//              «Не удалось подготовить файл» with «Повторить».
// A file link downloads in the same tab; target="_blank" is a file opened to
// view, and says so with a sign after the name and words for a screen reader.

function renderDownloadFileTemplate(context) {
  const {
    size,
    fileName,
    fileType,
    fileSize,
    icon,
    href,
    download,
    disabled,
    opensTab,
    ariaLabel,
    state,
    words
  } = context;
  const preparing = state === 'preparing';
  const tagName = href && !disabled ? 'a' : 'button';
  const rootClasses = ['sf-download-file', `sf-download-file--size-${size}`, `sf-download-file--${state}`, context.rootClass, disabled ? 'disabled' : 'cursor-pointer transition'].filter(Boolean);
  const sign = preparing ? (0,_component_spinner_js_spinner_draw__WEBPACK_IMPORTED_MODULE_1__.createInlineSpinner)({
    className: 'sf-download-file__spinner'
  }) : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class="sf-download-file__icon sf-icon" aria-hidden="true">${icon}</i>`;
  const meta = preparing ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-download-file__meta"><span class="sf-download-file__status">${words.preparing}</span></span>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-download-file__meta">${fileType ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-download-file__type">${fileType}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}<span class="sf-download-file__size sf-download-file-file-size">${fileSize}</span></span>`;
  const content = (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <span class="sf-download-file__body sf-download-file-wrap">
      <span class="sf-download-file__main sf-download-file-container">
        ${sign}
        <span class="sf-download-file__name sf-download-file-file-name" title=${fileName || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>${fileName}</span>
        ${opensTab ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class="sf-download-file__tab sf-icon" aria-hidden="true">open_in_new</i><span class="sf-download-file__tab-words">${words.newTab}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      </span>
      ${meta}
    </span>
  `;
  const notice = state === 'error' ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-alert
        class="sf-download-file__error"
        status="error"
        appearance="outlined"
        icon="error"
        heading=${words.errorHeading}
        supporting-text=${context.errorText || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        action-text=${words.retry}
        action="retry"
      ></sf-alert>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing; // The host is display: contents, so whatever it draws is laid out by the
  // page's container. The file and its notice are one column of their own: as
  // two siblings, a flex row put the notice beside the file (docs pre-check
  // 2026-11-10 DF-13). Ready and preparing draw the file alone, as before.

  const withNotice = file => notice === lit__WEBPACK_IMPORTED_MODULE_0__.nothing ? file : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-download-file__stack">${file}${notice}</div>`;

  if (tagName === 'a') {
    return withNotice((0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
      <a
        class=${rootClasses.join(' ')}
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
    `);
  }

  return withNotice((0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <button
      type="button"
      class=${rootClasses.join(' ')}
      style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      ?disabled=${disabled}
      aria-disabled=${disabled ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      aria-label=${ariaLabel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      aria-busy=${preparing ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    >
      ${content}
    </button>
  `);
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

/***/ "43090d1c8307"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("page-language", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("page-language", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "deb1a4d61565"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("smart-base", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("smart-base", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "8ea1dd3302c4"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{".sf-download-file":["display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","gap/var(--sf-e5)","justify-content/space-between (.justify-between)","align-items/center (.items-center)"],".sf-download-file .sf-download-file-wrap":["display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","gap/var(--sf-download-file-wrap--gap)","justify-content/flex-start (.justify-start)","align-items/center (.items-center)"]}');

/***/ },

/***/ "9288cedb5bb5"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-file-download for the shim (stands/18-aliases-ci/alias.mjs, standard §16 item 20). mode: same-detail (the shim sends the new and the old name), split / detail-adds (a detail adapter, refused by the shim), attribute-and-property, method, property, manifest-only (the DOM name does not change), host-attribute (no shim), retired.","component":"sf-file-download","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"aria-label","to":null,"kind":"attribute","component":"sf-file-download","since":"2026-10-27","remove_after":"2026-12-01","mode":"host-attribute","section":"§3.1","note":"stays a host attribute, read by the base (§3.1, §4.8); no shim"},{"from":"sf-download-file:click","to":"sf-download-file-download","kind":"event","component":"sf-file-download","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","cancelable":true,"manifest":{"from":"sf-download-file:click","to":"sf-download-file-download"},"section":"§8, vocabulary 1.1.5 §5.1","note":"the class event\'s name; bx-simai.main listens to it (vocabulary §9.2). The shim sends it after sf-download-file-download, one detail, one cancel"},{"from":"sf-download-file","to":"sf-file-download","kind":"tag","component":"sf-file-download","since":"2026-11-03","remove_after":"2027-01-01","section":"rename plan R0 (ui-control RENAME-PLAN-2026-11-03), naming decision 2026-11-02","note":"the element is sf-file-download; sf-download-file is a subclass defined beside it until the date"},{"from":"sf-download-file-download","to":"sf-file-download-download","kind":"event","component":"sf-file-download","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-download-file-retry","to":"sf-file-download-retry","kind":"event","component":"sf-file-download","since":"2026-11-09","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag; the former tag sf-download-file sends its own name until the tag alias goes"}]}');

/***/ },

/***/ "312445577dad"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.file-download","tag":"sf-file-download","version":"1.4.1","kind":"leaf","settings":{"size":{"type":"enum","values":["1/3","1/2","1","2","3"],"default":"1"},"file-name":{"type":"string","default":""},"file-size":{"type":"string","default":""},"file-type":{"type":"string","default":""},"icon":{"type":"icon","default":"download"},"href":{"type":"string","default":""},"download":{"type":"boolean","default":false},"disabled":{"type":"boolean","default":false},"state":{"type":"enum","values":["ready","preparing","error"],"default":"ready"},"error-text":{"type":"string","default":""},"target":{"type":"string","default":""}},"values":{},"events":{"download":{"carries":{"href":"string","file-name":"string","download":"boolean"},"cancelable":true},"retry":{"carries":{"href":"string","file-name":"string"}}},"actions":{},"css-variables":{"--sf-file-download-background-color":{"type":"color","state":"default"},"--sf-file-download-border-color":{"type":"color","state":"default"},"--sf-file-download-radius":{"type":"length","state":"default"},"--sf-file-download-padding":{"type":"length","state":"default"},"--sf-file-download-gap":{"type":"length","state":"default"},"--sf-file-download-icon-size":{"type":"length","state":"default"},"--sf-file-download-icon-color":{"type":"color","state":"default"}}}');

/***/ },

/***/ "6da9b5d8b341"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Download File","runtime":{"file":"File","preparing-text":"Preparing the file…","error-heading":"Could not prepare the file","retry-text":"Retry","new-tab-text":"(opens in a new tab)"},"events":{"retry":{"label":"Retry"}}}');

/***/ },

/***/ "25a776704bf3"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Скачивание файла","runtime":{"file":"Файл","preparing-text":"Готовим файл…","error-heading":"Не удалось подготовить файл","retry-text":"Повторить","new-tab-text":"(откроется в новой вкладке)"},"events":{"retry":{"label":"Повторить"}}}');

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