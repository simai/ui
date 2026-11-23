/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "e138a730fd7c"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createFieldContract: () => (/* binding */ createFieldContract),
/* harmony export */   syncFieldContract: () => (/* binding */ syncFieldContract)
/* harmony export */ });
/* harmony import */ var _core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("e92fd2d1a38c");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var _core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_0__);
 // A field's ids come from its instance's role path (standard 1.3.8 §7.1.1;
// simai/ui-source#41), never from a counter: core/js/instance-path.js.

const fieldIdentities = new WeakMap();

function nextIdentity(owner, prefix) {
  if (owner && fieldIdentities.has(owner)) return fieldIdentities.get(owner);
  const base = (0,_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_0__.partId)((0,_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_0__.instancePath)(owner, {
    kind: prefix
  }));
  const identity = {
    base,
    controlId: `${base}--control`,
    messageId: `${base}--message`
  }; // An instance not yet in the page has no place in it: its path is settled
  // when it is, so it is not kept before.

  if (owner && (typeof owner === 'object' || typeof owner === 'function') && (0,_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_0__.pathIsSettled)(owner)) {
    fieldIdentities.set(owner, identity);
  }

  return identity;
}

function mergeIdRefs(existing, additions) {
  return [...new Set([...String(existing || '').split(/\s+/).filter(Boolean), ...additions.filter(Boolean)])].join(' ');
}

function createFieldContract(owner, {
  prefix = 'sf-field',
  required = false,
  invalid = false,
  hint = '',
  errorMessage = ''
} = {}) {
  const identity = nextIdentity(owner, prefix);
  const normalizedInvalid = Boolean(invalid);
  const message = normalizedInvalid && errorMessage ? errorMessage : hint;
  return { ...identity,
    required: Boolean(required),
    invalid: normalizedInvalid,
    message,
    describedBy: message ? identity.messageId : '',
    errorMessageId: normalizedInvalid && errorMessage ? identity.messageId : ''
  };
}
function syncFieldContract(root, control, {
  prefix = 'sf-field',
  required = false,
  invalid = false,
  messageNode = null,
  labelNode = null,
  errorMessage = ''
} = {}) {
  if (!root || !control) return null;
  const hint = messageNode?.textContent?.trim() || '';
  const contract = createFieldContract(root, {
    prefix,
    required,
    invalid,
    hint,
    errorMessage
  });
  if (!control.id) control.id = contract.controlId;

  if (root.tagName === 'LABEL' && !root.hasAttribute('for')) {
    root.setAttribute('for', control.id);
  } // A root that is not a label carries its label text as a <label> of its
  // own (div.sf-input, 1.13.0): it points at the control too.


  if (labelNode?.tagName === 'LABEL' && !labelNode.hasAttribute('for')) {
    labelNode.setAttribute('for', control.id);
  } // Name the field by its visible label, not every hint or adjacent button.
  // Author-provided accessible names remain authoritative.


  if (labelNode?.textContent?.trim() && !control.hasAttribute('aria-label') && !control.hasAttribute('aria-labelledby')) {
    // An id of its own: «<control>-label» may already name another element
    // (a page that gave the field's root that id), and aria-labelledby would
    // then read that element's whole text, the hint with it (DF-3).
    if (!labelNode.id) {
      const doc = labelNode.ownerDocument;
      let id = `${control.id}-label`;

      for (let n = 2; doc?.getElementById?.(id); n += 1) id = `${control.id}-label-${n}`;

      labelNode.id = id;
    }

    control.setAttribute('aria-labelledby', labelNode.id);
  }

  control.required = contract.required;
  root.classList.toggle('error', contract.invalid);
  control.classList.toggle('error', contract.invalid);
  if (contract.invalid) control.setAttribute('aria-invalid', 'true');else control.removeAttribute('aria-invalid');

  if (messageNode) {
    if (!messageNode.id) messageNode.id = contract.messageId;
    control.setAttribute('aria-describedby', mergeIdRefs(control.getAttribute('aria-describedby'), [messageNode.id]));
  }

  if (contract.errorMessageId && messageNode) {
    control.setAttribute('aria-errormessage', messageNode.id);
  } else {
    control.removeAttribute('aria-errormessage');
  }

  return contract;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "e6d86f2cd058"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FIELD_LADDER: () => (/* binding */ FIELD_LADDER),
/* harmony export */   FIELD_SIZES: () => (/* binding */ FIELD_SIZES),
/* harmony export */   FIELD_WIDTHS: () => (/* binding */ FIELD_WIDTHS),
/* harmony export */   INPUT_SIZES: () => (/* binding */ INPUT_SIZES),
/* harmony export */   RETIRED_FIELD_SIZES: () => (/* binding */ RETIRED_FIELD_SIZES),
/* harmony export */   fieldSize: () => (/* binding */ fieldSize),
/* harmony export */   fieldWidth: () => (/* binding */ fieldWidth),
/* harmony export */   fieldWidthClass: () => (/* binding */ fieldWidthClass),
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
} // How wide a field is (owner decision C396, WM-4): the value it is made for,
// in characters of the width ladder, read from the field's width setting --
// short (20: a date, a number, a code), medium (28: a name, a phone) and long
// (44: a path, an e-mail, an address); the roles --sf-field--width-short,
// -medium and -long stand on the steps --sf-measure-20, -28 and -44 (core
// figma_measure.scss) and follow the text size, the density and the phone.
// It is the field's widest: in a narrower container the field is the
// container's width, as without it. Empty or any other value: the whole
// width, as every field drew before. The class is core's
// (core/scss/_sf_css__field_width.scss), so a field whose own sheet has not
// come yet already stands at its width.

const FIELD_WIDTHS = Object.freeze(['short', 'medium', 'long']);
/** A field width: short, medium or long, else '' (the whole width). */

function fieldWidth(value) {
  const width = String(value ?? '').trim().toLowerCase();
  return FIELD_WIDTHS.includes(width) ? width : '';
}
/** The root class of a field width, or '' for the whole width. */

function fieldWidthClass(value) {
  const width = fieldWidth(value);
  return width ? `sf-field--width-${width}` : '';
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "1373e294ec38"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BREAKPOINTS: () => (/* binding */ BREAKPOINTS),
/* harmony export */   breakpointMedia: () => (/* binding */ breakpointMedia),
/* harmony export */   breakpointQuery: () => (/* binding */ breakpointQuery),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   matchesBreakpoint: () => (/* binding */ matchesBreakpoint)
/* harmony export */ });
// The Framework's breakpoints for scripts (reuse audit 2026-11-02, finding 6).
// The sheets switch at the steps of core/scss/vars/_sf_var__breakpoint.scss;
// a component that also decides in script (sf-contents, sf-site-header,
// sf-search) had copied the steps by hand, word for word, and nine such
// constants (48rem, 60rem, 1023px, 1024) had drifted apart elsewhere, so one
// admin screen switched at two points. The same values here, and
// tests/breakpoint-ladder.contract.test.mjs holds the two files equal.

/** The ladder: each name is the width it starts at, in rem as the sheets write it. */
const BREAKPOINTS = Object.freeze({
  xs: '0rem',
  sm: '32rem',
  // g6, 512px
  md: '44rem',
  // h1, 704px
  lg: '60rem',
  // h5, 960px
  xl: '72rem',
  // h8, 1152px
  xxl: '80rem' // i0, 1280px

}); // The step under a threshold, as the sheets' media-breakpoint-down writes it:
// one pixel less, in rem (_mix__breakpoint.scss breakpoint-max).

const PIXEL_REM = 1 / 16;
/**
 * The media query of a breakpoint: from its width up, or with `below: true`
 * the widths under it -- the two sides the sheets switch on. An unknown name
 * is null, so a typo is not a query that always matches.
 *
 *   breakpointQuery('md')                  (min-width: 44rem)
 *   breakpointQuery('md', {below: true})   (max-width: 43.9375rem)
 */

function breakpointQuery(name, {
  below = false
} = {}) {
  if (!Object.hasOwn(BREAKPOINTS, name)) return null;
  const rem = Number.parseFloat(BREAKPOINTS[name]);
  if (below) return rem > 0 ? `(max-width: ${rem - PIXEL_REM}rem)` : 'not all';
  return `(min-width: ${rem}rem)`;
}
/** The page's MediaQueryList for a breakpoint, to read and to follow; null without matchMedia or for an unknown name. */

function breakpointMedia(name, {
  below = false,
  view = globalThis
} = {}) {
  const query = breakpointQuery(name, {
    below
  });
  return query && typeof view?.matchMedia === 'function' ? view.matchMedia(query) : null;
}
/** Whether the page is at least as wide as the breakpoint now (or under it, with `below`). */

function matchesBreakpoint(name, options = {}) {
  return breakpointMedia(name, options)?.matches === true;
}
const Breakpoints = Object.freeze({
  ladder: BREAKPOINTS,
  query: breakpointQuery,
  media: breakpointMedia,
  matches: matchesBreakpoint
}); // Core publishes the helper; component bundles that carry their own copy reuse
// an already published one instead of replacing it.

if (typeof globalThis !== 'undefined') {
  globalThis.SF = globalThis.SF || {};
  if (!globalThis.SF.breakpoints) globalThis.SF.breakpoints = Breakpoints;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Breakpoints);

/***/ },

/***/ "3180ca98c567"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FILES_OVER_ATTRIBUTE: () => (/* binding */ FILES_OVER_ATTRIBUTE),
/* harmony export */   NO_DRAG_QUERY: () => (/* binding */ NO_DRAG_QUERY),
/* harmony export */   carriesFiles: () => (/* binding */ carriesFiles),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   filesDragWords: () => (/* binding */ filesDragWords),
/* harmony export */   filesDrop: () => (/* binding */ filesDrop)
/* harmony export */ });
// Files from the computer dropped on an element (Framework order FO-1 of the
// view set study, ui-control control/research/2026-11-17-view-round-1/
// framework-orders.md; returns FO1-1..FO1-6 of the component study,
// control/research/2026-11-18-framework-parts-fo). sf-file-upload,
// sf-input-image, sf-tree, sf-input-rich and the set's sf-view each read
// dataTransfer on their own: which drag carries files, the copy cursor, the
// state while a file is held over the element, the files of a drop. This is
// that reading, once:
//
//   const drop = filesDrop(element, {
//     onFiles: (files, {event, target, skipped}) => {},
//                                      once per drop that carries files
//     onOver: (over, target) => {},    a file is held over the element (over
//                                      the target), or no longer
//     disabled: () => false,           the element takes nothing now: the cursor
//                                      says no and no files are given
//     target: (event) => node | null,  what under the pointer takes the files
//                                      (a folder row of a tree); null takes
//                                      nothing there. Given back with the files.
//     folders: 'open' | 'skip',        a dropped folder: its files, read
//                                      through the entries (open, the default),
//                                      or left out and named in skipped
//     mark: true,                      data-sf-files-over on the element
//     overlay: () => text | null,      the one drop overlay of the page over the
//                                      element while files are held over it,
//                                      saying the text (C308 FO-1: «Отпустите,
//                                      чтобы загрузить в «…»» from the
//                                      component's language pack)
//     follow: false,                   a host around its own zone (sf-file-upload
//                                      and its area): it only follows the drag
//                                      -- the over state while files are held
//                                      over it, wherever inside they are taken
//                                      -- and takes no files
//   });
//   drop.stop();
//
// While files are held over it the element carries data-sf-files-over (a
// host state its sheet draws the drop zone by). Only a drag that carries
// files is taken, so text or a row dragged across the element passes on to
// whoever takes it. A drop that carries files is the element's even while it
// is disabled (the browser would otherwise open the file in place of the
// page), and gives nothing.
//
// Zones inside zones (FO1-1): the innermost zone under the pointer takes the
// drop; an outer one sees it taken by a zone (a mark on the event, shared by
// every bundle's copy) and gives nothing. A handler that only cancels the
// event (a component's own area inside the zone) takes nothing from it. A
// file dropped beside every zone (FO1-2) does not open in the tab while a zone
// is on the page: the document cancels a drop of files nobody took. The over
// state counts the enters and leaves of the element (FO1-6): a leave for a
// child is matched by the child's enter, which Safari's leave without a
// relatedTarget cannot say. A dropped folder (FO1-5) arrives as an empty File
// in dataTransfer.files; its entries are read instead.
//
// What the zone says (owner decision C223): a screen that cannot drag -- a
// touch screen with no fine pointer at all -- is not asked to; filesDragWords()
// answers whether the words about dragging belong on this screen, the same
// media query the file field's sheet hides them by.
//
// Where files may be dropped and what the page shows (owner decision C308
// FO-1): a whole list (a folder, a chat, attachments) takes them when its
// owner turns it on; one drop overlay for the page stands on top of the zone
// the files are held over, with the words of the zone's component; zones
// inside zones, the innermost wins. A component that draws its own zone (the
// file field's area) keeps drawing it by the over state.
//
// Every bundle carries its own copy of this module: the zones on a page are
// counted on one shared global, so the document guard is one for them all.
const FILES_OVER_ATTRIBUTE = 'data-sf-files-over';
const NO_DRAG_QUERY = '(pointer: coarse) and (not (any-pointer: fine))';
const ZONES = '__sfFilesDropZones'; // The zone that took a drag event, on the event (FO1-1).

const TAKEN = Symbol.for('sf.filesDrop.taken');

const takenByOther = (event, element) => Boolean(event[TAKEN]) && event[TAKEN] !== element;

const take = (event, element) => {
  try {
    if (!event[TAKEN]) Object.defineProperty(event, TAKEN, {
      value: element,
      configurable: true
    });
  } catch {
    /* a frozen event is read as not taken */
  }
};
/** Whether a drag event carries files from the computer. */


function carriesFiles(event) {
  return [...(event?.dataTransfer?.types ?? [])].includes('Files');
}
/** Whether the words about dragging belong on this screen (C223): false on a touch screen with no fine pointer. */

function filesDragWords(view = globalThis) {
  try {
    return !view?.matchMedia?.(NO_DRAG_QUERY)?.matches;
  } catch {
    return true;
  }
} // The one drop overlay of a page (C308 FO-1): an element on the body, over
// the zone the files are held over (the part of it on screen), the words in
// a label in its middle; it takes no pointer, so the drop reaches the zone
// under it. Found by its attribute, so every bundle's copy draws the same one.

const OVERLAY_ATTRIBUTE = 'data-sf-files-overlay';
let overlayOwner = null;

function showOverlay(element, text) {
  const doc = element.ownerDocument;
  const view = doc?.defaultView;
  if (!doc?.body || !view) return;
  let layer = doc.body.querySelector(`:scope > [${OVERLAY_ATTRIBUTE}]`);

  if (!layer) {
    layer = doc.createElement('div');
    layer.setAttribute(OVERLAY_ATTRIBUTE, '');
    layer.setAttribute('aria-hidden', 'true');
    layer.style.cssText = ['position: fixed', 'z-index: 2147483000', 'pointer-events: none', 'box-sizing: border-box', 'display: flex', 'align-items: center', 'justify-content: center', 'border: var(--sf-px) dashed var(--sf-primary-outline)', 'border-radius: var(--sf-radius--surface)', 'background: var(--sf-primary-state-select)', 'padding: var(--sf-space-1)'].join(';');
    const words = doc.createElement('span');
    words.style.cssText = ['background: var(--sf-surface)', 'color: var(--sf-primary)', 'border-radius: var(--sf-radius--surface)', 'padding: var(--sf-space-1\\/2) var(--sf-space-1)', 'font: inherit', 'max-inline-size: 100%', 'text-align: center'].join(';');
    layer.append(words);
    doc.body.append(layer);
  }

  const box = element.getBoundingClientRect();
  const top = Math.max(0, box.top);
  const left = Math.max(0, box.left);
  const bottom = Math.min(view.innerHeight, box.bottom);
  const right = Math.min(view.innerWidth, box.right);
  Object.assign(layer.style, {
    top: `${top}px`,
    left: `${left}px`,
    width: `${Math.max(0, right - left)}px`,
    height: `${Math.max(0, bottom - top)}px`
  });
  layer.firstElementChild.textContent = text;
  layer.hidden = false;
  overlayOwner = element;
}

function hideOverlay(element) {
  const doc = element.ownerDocument;
  if (overlayOwner !== element && overlayOwner !== null) return;
  overlayOwner = null;
  const layer = doc?.body?.querySelector(`:scope > [${OVERLAY_ATTRIBUTE}]`);
  if (layer) layer.hidden = true;
} // The document guard (FO1-2): one per document, on while a zone is on it.


function guard(doc, change) {
  if (!doc?.addEventListener) return;
  const zones = globalThis[ZONES] ??= new WeakMap();
  const held = zones.get(doc) ?? {
    count: 0,
    stop: null
  };
  held.count = Math.max(0, held.count + change);

  if (held.count && !held.stop) {
    const refuse = event => {
      if (event.defaultPrevented || !carriesFiles(event)) return;
      event.preventDefault();
      if (event.dataTransfer) event.dataTransfer.dropEffect = 'none';
    };

    doc.addEventListener('dragover', refuse);
    doc.addEventListener('drop', refuse);

    held.stop = () => {
      doc.removeEventListener('dragover', refuse);
      doc.removeEventListener('drop', refuse);
    };
  } else if (!held.count && held.stop) {
    held.stop();
    held.stop = null;
  }

  zones.set(doc, held);
} // A folder's files, read through its entries (FO1-5), each with its path.


function readEntry(entry, path = '') {
  if (!entry) return Promise.resolve([]);

  if (entry.isFile) {
    return new Promise(settle => entry.file(file => {
      try {
        if (path && !file.webkitRelativePath) Object.defineProperty(file, 'sfPath', {
          value: `${path}${file.name}`
        });
      } catch {
        /* a read-only File keeps its name */
      }

      settle([file]);
    }, () => settle([])));
  }

  if (!entry.isDirectory) return Promise.resolve([]);
  const reader = entry.createReader();
  const all = [];
  return new Promise(settle => {
    // readEntries answers a batch at a time until it answers none.
    const next = () => reader.readEntries(batch => {
      if (!batch.length) {
        Promise.all(all.map(one => readEntry(one, `${path}${entry.name}/`))).then(lists => settle(lists.flat()));
        return;
      }

      all.push(...batch);
      next();
    }, () => settle([]));

    next();
  });
} // What a drop gives: the files, and the folders read or skipped. The items
// are read in the drop's own turn (they are empty after it).


function droppedOf(event, folders) {
  const items = [...(event.dataTransfer?.items ?? [])].filter(item => item.kind === 'file');
  const entries = items.map(item => typeof item.webkitGetAsEntry === 'function' ? item.webkitGetAsEntry() : null);

  if (!entries.some(entry => entry?.isDirectory)) {
    return {
      files: Promise.resolve([...(event.dataTransfer?.files ?? [])]),
      skipped: []
    };
  }

  const plain = [...(event.dataTransfer?.files ?? [])];
  const skipped = [];
  const reads = entries.map((entry, index) => {
    if (!entry?.isDirectory) return Promise.resolve(plain[index] ? [plain[index]] : items[index]?.getAsFile() ? [items[index].getAsFile()] : []);

    if (folders === 'skip') {
      skipped.push(entry.name);
      return Promise.resolve([]);
    }

    return readEntry(entry);
  });
  return {
    files: Promise.all(reads).then(lists => lists.flat()),
    skipped
  };
}

function filesDrop(element, {
  onFiles = null,
  onOver = null,
  disabled = null,
  target = null,
  folders = 'open',
  mark = true,
  follow = false,
  overlay = null
} = {}) {
  if (!element?.addEventListener) return {
    stop() {},

    get over() {
      return false;
    }

  };
  let over = false;
  let depth = 0;
  let place = null;
  const doc = element.ownerDocument;

  const isDisabled = () => typeof disabled === 'function' ? Boolean(disabled()) : Boolean(disabled);

  const targetOf = event => typeof target === 'function' ? target(event) ?? null : element;

  const setOver = (next, node = null) => {
    if (next === over && node === place) return;
    over = next;
    place = next ? node : null;
    if (mark) element.toggleAttribute(FILES_OVER_ATTRIBUTE, over);

    if (typeof overlay === 'function') {
      const text = over ? overlay(place) : null;
      if (text) showOverlay(element, String(text));else hideOverlay(element);
    }

    if (typeof onOver === 'function') onOver(over, place);
  };

  const onDragEnter = event => {
    if (!carriesFiles(event)) return;
    depth += 1;
  };

  const onDragOver = event => {
    if (!carriesFiles(event)) return;

    if (follow) {
      setOver(!isDisabled(), element);
      return;
    } // An inner zone took it (FO1-1): it is that zone's.


    if (takenByOther(event, element)) {
      setOver(false);
      return;
    }

    const node = targetOf(event);

    if (!node) {
      setOver(false);
      return;
    }

    take(event, element);
    event.preventDefault();

    if (isDisabled()) {
      event.dataTransfer.dropEffect = 'none';
      setOver(false);
      return;
    }

    event.dataTransfer.dropEffect = 'copy';
    setOver(true, node);
  };

  const onDragLeave = event => {
    if (!carriesFiles(event)) return;
    depth = Math.max(0, depth - 1);
    if (!depth) setOver(false);
  };

  const onDrop = event => {
    depth = 0;
    if (!carriesFiles(event) && !event.dataTransfer?.files?.length) return;

    if (follow) {
      setOver(false);
      return;
    }

    if (takenByOther(event, element)) {
      setOver(false);
      return;
    }

    const node = targetOf(event);
    setOver(false);
    if (!node) return;
    take(event, element);
    event.preventDefault();
    if (isDisabled()) return;
    const dropped = droppedOf(event, folders);
    dropped.files.then(files => {
      if ((files.length || dropped.skipped.length) && typeof onFiles === 'function') onFiles(files, {
        event,
        target: node,
        skipped: dropped.skipped
      });
    });
  }; // The drag ended somewhere else (Escape, a drop outside): nothing is held.


  const onDragEnd = () => {
    depth = 0;
    setOver(false);
  };

  element.addEventListener('dragenter', onDragEnter);
  element.addEventListener('dragover', onDragOver);
  element.addEventListener('dragleave', onDragLeave);
  element.addEventListener('drop', onDrop);
  doc?.addEventListener?.('dragend', onDragEnd, true);
  doc?.addEventListener?.('drop', onDragEnd, true);
  guard(doc, 1);
  let stopped = false;
  return {
    stop() {
      if (stopped) return;
      stopped = true;
      element.removeEventListener('dragenter', onDragEnter);
      element.removeEventListener('dragover', onDragOver);
      element.removeEventListener('dragleave', onDragLeave);
      element.removeEventListener('drop', onDrop);
      doc?.removeEventListener?.('dragend', onDragEnd, true);
      doc?.removeEventListener?.('drop', onDragEnd, true);
      guard(doc, -1);
      setOver(false);
    },

    get over() {
      return over;
    }

  };
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (filesDrop);

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
 * Anything that is not a date is `gap`, '' by default. A marker after the year
 * («2026 г.», «2026 р.») is held to it by a no-break space, so it never starts
 * a line alone.
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
  }; // The year keeps its marker («2026 г.» never wraps before «г.»): format-intl.js.

  return (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.formatDateText)((0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.intlFormatter)('DateTimeFormat', (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.formatLocale)(where), options), moment);
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
  const wanted = String(locale || 'en').trim().toLowerCase().replace('_', '-'); // A registry alias takes its pack's words (zh-cn: zh-hans, pt: pt-br;
  // core/lang/index.json aliases, kept on the shared store by core).

  const pack = code => globalThis.__sfPageLanguage?.packs?.aliases?.[code] ?? code;

  const base = wanted.split('-')[0];

  for (const code of [...new Set([wanted, pack(wanted), base, pack(base)])]) {
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
/* harmony export */   formatDateText: () => (/* binding */ formatDateText),
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
} // A date's year keeps the abbreviation that follows it (A4, group build 15):
// Russian, Ukrainian, Bulgarian, Belarusian, Kazakh, Lithuanian, Macedonian
// and Armenian write one after the year -- «19 нояб. 2026 г.», «2026 р.»,
// «2026 m.», «2026 թ.» -- and the platform joins it with an ordinary space, so
// a narrow cell or a wrapped line printed «2026» at the end of one line and
// «г.» alone at the start of the next. Only the space before an abbreviation
// (letters closed by a full stop: г., гг., m.) becomes a no-break space; a word
// such as English «at» or German «um», a comma, a slash or a time after the
// year is left as the platform writes it (DEV answer msg-e6758728).

/** A DateTimeFormat's text of a moment with the year's marker held to the year. */

function formatDateText(formatter, moment) {
  if (typeof formatter?.formatToParts !== 'function') return formatter.format(moment); // A module-level regular expression is a statement a bundler keeps (core-format test): made here.

  const gap = /^[\s\u00a0\u202f]+(?=\p{L}+\.)/u;
  let text = '';
  let afterYear = false;

  for (const part of formatter.formatToParts(moment)) {
    text += afterYear && part.type === 'literal' ? part.value.replace(gap, '\u00a0') : part.value;
    afterYear = part.type === 'year';
  }

  return text;
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
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "ee5c3aad2640"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   formatRelativeDay: () => (/* binding */ formatRelativeDay),
/* harmony export */   formatRelativeTime: () => (/* binding */ formatRelativeTime),
/* harmony export */   intlSpeaks: () => (/* binding */ intlSpeaks)
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
  const wanted = String(locale || '').trim().toLowerCase().replace('_', '-'); // A registry alias takes its pack's words (zh-cn: zh-hans, pt: pt-br).

  const pack = code => globalThis.__sfPageLanguage?.packs?.aliases?.[code] ?? code;

  const base = wanted.split('-')[0];

  for (const code of [...new Set([wanted, pack(wanted), base, pack(base)])]) {
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
    text = (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.formatDateText)((0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.intlFormatter)('DateTimeFormat', locale, {
      day: 'numeric',
      month: 'long',
      ...year,
      ...zone
    }), moment);
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
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
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
/* harmony import */ var _deprecations_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d3818183b14c");
/* harmony import */ var _alias_table_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5dcef5de40cf");
/* harmony import */ var _tag_aliases_generated_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("f28a9d913ce0");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_deprecations_js__WEBPACK_IMPORTED_MODULE_0__, _alias_table_js__WEBPACK_IMPORTED_MODULE_1__]);
([_deprecations_js__WEBPACK_IMPORTED_MODULE_0__, _alias_table_js__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _deprecations_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_deprecations_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _alias_table_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_alias_table_js__WEBPACK_IMPORTED_MODULE_1__);
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
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "f39dc444b059"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fieldHelpLabel: () => (/* binding */ fieldHelpLabel),
/* harmony export */   fieldHelpSize: () => (/* binding */ fieldHelpSize),
/* harmony export */   renderFieldHelp: () => (/* binding */ renderFieldHelp)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
 // The «?» after a field's label (owner decision C153 (8), C133's look): the
// `help` setting of every member of the field family draws sf-help-mark after
// the label text and its required mark. The mark stands a step below the
// value, as the label does -- 1/3 under the small steps, 1/2 from size 1 up --
// and each sheet holds it to the label's line, so the label row keeps its
// height. Its button is named by its subject (the component's word `help`,
// «Подробнее: {label}»). A press on it opens the explanation and never reaches
// the label row, whose own press focuses the field.

const HELP_SIZE = Object.freeze({
  '1/3': '1/3',
  '1/2': '1/3',
  1: '1/2',
  2: '1/2',
  3: '1/2'
});
/** The help mark's step for a field of `size`. */

function fieldHelpSize(size) {
  return HELP_SIZE[size] || '1/2';
}
/** The mark's name: the component's `help` word with the label, or the mark's own default. */

function fieldHelpLabel(component, label) {
  if (!label || typeof component?.sfWord !== 'function') return '';
  return component.sfWord('help', {
    vars: {
      label
    }
  });
}
/** sf-help-mark for `help`, or nothing without one. */

function renderFieldHelp({
  help,
  label = '',
  size = '1',
  className = '',
  component = null
} = {}) {
  if (!help) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-help-mark
    class=${className || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    size=${fieldHelpSize(size)}
    text=${help}
    label=${fieldHelpLabel(component, label) || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    @click=${event => event.stopPropagation()}
  ></sf-help-mark>`;
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
/* harmony export */   afterPress: () => (/* binding */ afterPress),
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
} // A pointer pressed on the page (FO-4, module.smart-helpers 1.20.0): a field
// it leaves holds its leave check until the press is over and a task after
// it, so the error line drawn under that field does not move the button the
// pointer is on before the click lands (at 390 a cleared required field's
// line moved «Сохранить» 20 px down and the save was lost). The press's own
// click checks every field when it submits. A release the page never hears
// ends the hold after PRESS_HOLD_MS. One record for every bundle's copy.


const PRESS_KEY = Symbol.for('simai.framework.field-press');
const PRESS_HOLD_MS = 4000;

function fieldPress() {
  const shared = globalThis[PRESS_KEY] || (globalThis[PRESS_KEY] = {
    down: false,
    queue: [],
    timer: 0
  });

  if (!shared.listening && typeof document !== 'undefined') {
    shared.listening = true;

    const end = () => {
      if (!shared.down) return;
      shared.down = false;
      clearTimeout(shared.timer);
      setTimeout(() => {
        if (shared.down) return;

        for (const run of shared.queue.splice(0)) {
          try {
            run();
          } catch {
            /* a field taken out of the page while the press lasted */
          }
        }
      }, 0);
    };

    const start = () => {
      if (shared.down) return;
      shared.down = true;
      clearTimeout(shared.timer);
      shared.timer = setTimeout(end, PRESS_HOLD_MS);
    };

    document.addEventListener('pointerdown', start, true);
    document.addEventListener('mousedown', start, true);

    for (const type of ['pointerup', 'pointercancel', 'mouseup', 'dragend']) document.addEventListener(type, end, true);
  }

  return shared;
}
/** Runs `check` now, or once a pointer press in progress is over (FO-4). */


function afterPress(check) {
  const shared = fieldPress();
  if (shared.down) shared.queue.push(check);else check();
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
    // submits is seen before the check it starts; so does the press record.

    fieldCheck();
    fieldPress(); // Capture: the host's own `invalid` and its native control's, which
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
      if (!this.__sfTouched && !formTried(this)) return; // A press that left the field holds the check until it is over (FO-4);
      // what the press did meanwhile (a reset, a submit) is read then.

      afterPress(() => {
        if (!this.isConnected || !this.__sfTouched && !formTried(this)) return;
        this.sfSyncValidity?.();
        const wrong = this.validity ? !this.validity.valid : false;

        if (wrong !== this.__sfErrorShown) {
          this.__sfErrorShown = wrong;
          this.requestComponentUpdate?.('validity');
        } else if (wrong) {
          this.requestComponentUpdate?.('validity');
        }
      });
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

/***/ "f99166b49d53"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SfImageField: () => (/* binding */ SfImageField)
/* harmony export */ });
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _core_js_page_language_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("43090d1c8307");
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("d3818183b14c");
/* harmony import */ var _core_js_instance_path__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("e92fd2d1a38c");
/* harmony import */ var _core_js_tag_aliases_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("4a85acfb05c1");
/* harmony import */ var _core_js_breakpoints_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("1373e294ec38");
/* harmony import */ var _core_js_files_drop_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("3180ca98c567");
/* harmony import */ var _component_field_contract__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("e138a730fd7c");
/* harmony import */ var _component_field_size__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("e6d86f2cd058");
/* harmony import */ var _helpers_form_field__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("38ea8d53f301");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("15360766166a");
/* harmony import */ var _value_mjs__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__("a5c6bf6ad612");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__("1a493783d3b8");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__("8278668e929b");
/* harmony import */ var _lang_index_mjs__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__("5157836d86e8");
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__("8ddd5798abe5");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_page_language_js__WEBPACK_IMPORTED_MODULE_2__, _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_3__, _core_js_instance_path__WEBPACK_IMPORTED_MODULE_4__, _core_js_tag_aliases_js__WEBPACK_IMPORTED_MODULE_5__, _component_field_contract__WEBPACK_IMPORTED_MODULE_8__, _component_field_size__WEBPACK_IMPORTED_MODULE_9__, _js_templates_default__WEBPACK_IMPORTED_MODULE_11__, _value_mjs__WEBPACK_IMPORTED_MODULE_12__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_page_language_js__WEBPACK_IMPORTED_MODULE_2__, _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_3__, _core_js_instance_path__WEBPACK_IMPORTED_MODULE_4__, _core_js_tag_aliases_js__WEBPACK_IMPORTED_MODULE_5__, _component_field_contract__WEBPACK_IMPORTED_MODULE_8__, _component_field_size__WEBPACK_IMPORTED_MODULE_9__, _js_templates_default__WEBPACK_IMPORTED_MODULE_11__, _value_mjs__WEBPACK_IMPORTED_MODULE_12__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_page_language_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_core_js_page_language_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _core_js_instance_path__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_core_js_instance_path__WEBPACK_IMPORTED_MODULE_4__);
// sf-input-image: a form field that holds one image (simai/ui-source#27; the
// single-file view of the upload family, C81; its looks and parts, C94). It
// shows the image -- as a row (thumbnail, name and size, the buttons) or as a
// preview (the picture in its frame, the row under it) -- and takes a file the
// person chooses, drops or pastes on it, or a picture from the page's library
// or an address. ui-mail's polish audit (2026-10-22, B1) found the only part
// the Framework had for it was sf-file-upload, a drop zone with a list of
// transfers.
//
// What a file must be is the upload core's rule (component/file-upload/js/
// intake.mjs): the type accept names, not empty, not past max-size; and, for a
// picture, at least min-width × min-height pixels. A file that fails is said
// under the field, in words that name the file and the reason (C81: the
// message under the field), and in `rejected`. Of several files dropped at
// once the first image is taken and the field says so (IF-3).
//
// It transfers nothing itself. Without `uploader` it raises the File, in the
// events, and the host uploads it and writes back the stored value; until then
// the thumbnail shows the chosen file from an object URL. With `uploader` --
// the page's async (file, {signal, onProgress}) => {value, href} | id, the
// contract sf-file-upload's uploader has -- the field sends the file itself and
// shows the transfer on the picture: a ring with the share, «Отменить», and on
// a failure the reason, «Повторить» (IF-12).
//
// The picture's description (alt) and «Декоративная» are inside the field when
// the page asks for them (`alt`); the frame and the focal point are edited in
// a window over the page (`edit`, C125: sf-modal, the whole screen on a
// phone), never the pixels: they go in the value, and the server or CDN cuts
// the sizes (C94 points 3, 4).
//
// The field half -- label, help text, error, required, disabled, read-only --
// is the one every Framework field has (component/field-contract.js), so the
// field reads, sizes and announces itself as sf-input and sf-textarea do.















 // Only the words on screen ship in the bundle, English only (owner decision
// C282): Russian and every other language come from a language file. The
// title, settings and events stay in the language files for the Studio and the
// docs (localization study LC-2).

const en = _lang_index_mjs__WEBPACK_IMPORTED_MODULE_15__.files.en;
 // Every word this component says is lang/<locale>.json runtime (standard
// 1.3.8 §11). A word that names a file says where the name goes and how the
// language quotes it: «{name}» in Russian, “{name}” in English.

const WORD_KEYS = Object.keys(en.runtime).filter(key => typeof en.runtime[key] === 'string');

const camel = key => key.replace(/-([a-z])/gu, (_, letter) => letter.toUpperCase());

const kebab = key => key.replace(/[A-Z]/gu, letter => `-${letter.toLowerCase()}`);

const DEFAULT_ACCEPT = 'image/*';
const SOURCES = ['device', 'library', 'url'];
const EDITS = ['crop', 'focus'];
const MENU = `:scope .sf-image-field-parts > ${(0,_core_js_tag_aliases_js__WEBPACK_IMPORTED_MODULE_5__.tagSelector)('sf-menu-context')}`;
const EDITOR_WINDOW = ':scope > .sf-image-field > .sf-image-field-window'; // Whether the pointer is a finger: no hover, no drag words (IF-1).

const coarseQuery = () => {
  try {
    return globalThis.matchMedia?.('(pointer: coarse)') ?? null;
  } catch {
    return null;
  }
}; // The pixels of a picture at an address, or null when it does not load.


function readDimensions(href) {
  return new Promise(resolve => {
    if (!href || typeof Image !== 'function') {
      resolve(null);
      return;
    }

    const image = new Image();

    image.onload = () => resolve(image.naturalWidth ? {
      width: image.naturalWidth,
      height: image.naturalHeight
    } : null);

    image.onerror = () => resolve(null);

    image.src = href;
  });
}

const FORMER_FILE_LEADS = {
  'chosen-file': 'chosen-file',
  'replace-file': 'replace-name',
  'remove-file': 'remove-name',
  'edit-file': 'edit-name',
  'cancel-upload-file': 'cancel-upload-name',
  'retry-file': 'retry-name'
}; // sf-input-image from its component.json (standard simai.smart-component
// 1.3.8 §3, §4, §4.4, §8, §16.20, §17.1, §17.2): the settings are attributes
// and properties made by core/js/element-manifest.js, the actions answer an
// outcome, the events have their vocabulary names (the shim sends the colon
// names after them), and the host is the form control through
// ElementInternals.

const ImageFieldElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_13__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: _lang_index_mjs__WEBPACK_IMPORTED_MODULE_15__.files,
  source: 'ru',
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_14__,
  actions: {
    // Opens the platform's file dialog, as «Заменить…» and «Выбрать…» do.
    choose() {
      if (!this.interactive) return 'inactive';
      const input = this.input();
      if (!input) return 'not-drawn';
      input.click();
      return 'applied';
    },

    'take-file'({
      file,
      source = 'input'
    } = {}) {
      return this._takeFiles(file ? [file] : [], source || 'input');
    },

    'remove-image'() {
      return this._removeImage();
    },

    clear() {
      if (!this.value) return 'unchanged';
      this.setValue(null);
      return 'applied';
    },

    // §17.2: the message shows in place of the hint and the form does not
    // submit until it is cleared. It is the error-message and invalid
    // attributes, which is what a host writing them by hand gets too.
    'set-error'({
      message = ''
    } = {}) {
      const text = String(message ?? '');

      if (text) {
        this.setAttribute('error-message', text);
        this.setAttribute('invalid', '');
      } else {
        this.removeAttribute('error-message');
        this.removeAttribute('invalid');
      }

      this.setCustomValidity(text);
      return 'applied';
    }

  }
}); // The word each file word was built from before languages-g1 (the
// quoted / chosen aliases, fileWord).

class SfImageField extends (0,_helpers_form_field__WEBPACK_IMPORTED_MODULE_10__.FormField)(ImageFieldElement) {
  static get props() {
    return { ...super.props,
      templateName: {
        attribute: 'template',
        default: 'default'
      },
      // The value is an object (§4.2); its attribute -- an address, or the
      // shape as JSON -- stays as the field had it.
      value: {
        default: ''
      },
      // The field ladder's five steps (field-size.js FIELD_LADDER; queue #70).
      size: {
        default: '1',
        values: _component_field_size__WEBPACK_IMPORTED_MODULE_9__.FIELD_LADDER
      },
      // The group's name when no label is drawn: a field renderer's panel
      // prints the label beside the field, and a second, visible one inside it
      // would say it twice (the rule tests/field-control-accessible-name holds
      // for sf-input, sf-switch and the rest).
      ariaLabel: {
        attribute: 'aria-label',
        default: ''
      },
      rootClass: {
        default: ''
      }
    };
  }

  constructor() {
    super(); // undefined: follow the attribute. Set by the property, a chosen file or a
    // removal; an attribute written later takes over again.

    this._value = undefined; // A value set as a property before the element was defined -- a lit
    // `.value` binding on a tag the loader had not upgraded yet, which is how
    // the field renderers draw it -- is an own property that would hide the
    // accessor for good and skip the normalising. It is taken through it.

    if (Object.prototype.hasOwnProperty.call(this, 'value')) {
      const early = this.value;
      delete this.value;
      this._value = (0,_value_mjs__WEBPACK_IMPORTED_MODULE_12__.normaliseImageValue)(early);
    } // The page's transfer, a property like sf-file-upload's.


    this._uploader = null;

    if (Object.prototype.hasOwnProperty.call(this, 'uploader')) {
      const early = this.uploader;
      delete this.uploader;
      this._uploader = typeof early === 'function' ? early : null;
    }

    this._objectUrl = '';
    this._dimensions = new Map();
    this._failed = new Set();
    this.dragging = false;
    this.announcement = '';
    this._focusAfterRender = ''; // What the field says under itself apart from the hint and the page's
    // error: a refused file (error) or what it did with extra files (info).

    this._notice = null; // A required field left empty says so when focus leaves it or the form
    // checks it, not only on submit (IF-6).

    this._missingShown = false; // The transfer the uploader runs: {state: process|error, progress,
    // controller, previous, message}.

    this._upload = null;
    this._urlOpen = false;
    this._urlError = ''; // The editor's working copy: {mode, crop, focus}, or null while closed.

    this._editor = null;
    this._coarse = Boolean(coarseQuery()?.matches);

    this._onCoarse = event => {
      this._coarse = Boolean(event.matches);
      this.requestComponentUpdate('pointer');
    }; // Under md the editor's window is the whole screen (C125; the forms in
    // popups are sheets there, C32).


    this._phone = false;

    this._onPhone = event => {
      this._phone = Boolean(event.matches);
      if (this._editor) this.requestComponentUpdate('phone');
    };

    this._onInvalid = () => this._showMissing();

    this._onFocusOut = event => {
      if (event.relatedTarget && this.contains(event.relatedTarget)) return;

      this._showMissing();
    };
  }

  attributeChangedCallback(name, previous, next) {
    if (name === 'value' && previous !== next && !this._writingValue) {
      this._value = undefined;

      this._releaseObjectUrl();
    }

    super.attributeChangedCallback(name, previous, next);
  }

  onConnected() {
    const query = coarseQuery();
    this._coarse = Boolean(query?.matches);
    query?.addEventListener?.('change', this._onCoarse);
    this._phoneQuery = (0,_core_js_breakpoints_js__WEBPACK_IMPORTED_MODULE_6__.breakpointMedia)('md', {
      below: true
    });
    this._phone = Boolean(this._phoneQuery?.matches);
    this._phoneQuery?.addEventListener?.('change', this._onPhone); // C153 (3): never the browser's bubble; the first wrong field of a
    // submit takes the focus (helpers/form-field.js ownInvalid).

    this._invalidListener = (0,_helpers_form_field__WEBPACK_IMPORTED_MODULE_10__.ownInvalid)(this, this._onInvalid);
    this.addEventListener('focusout', this._onFocusOut);

    this._bindFilesDrop();
  }

  onDisconnected() {
    this._filesDrop?.stop();
    this._filesDrop = null;
    clearTimeout(this._announceTimer);
    coarseQuery()?.removeEventListener?.('change', this._onCoarse);
    this._phoneQuery?.removeEventListener?.('change', this._onPhone);
    this._phoneQuery = null;
    this.removeEventListener('invalid', this._invalidListener, true);
    this.removeEventListener('focusout', this._onFocusOut);
    this._upload?.controller?.abort();
  }

  get size() {
    return (0,_component_field_size__WEBPACK_IMPORTED_MODULE_9__.ladderSize)(this.getAttribute('size'));
  }

  get accept() {
    return this.hasAttribute('accept') ? this.getAttribute('accept') || '' : DEFAULT_ACCEPT;
  }

  get ariaLabel() {
    return this.getProp('ariaLabel') || '';
  }

  get layoutName() {
    return this.getAttribute('layout') === 'preview' ? 'preview' : 'row';
  }

  get shapeName() {
    return this.getAttribute('shape') === 'circle' ? 'circle' : 'square';
  }

  get fitName() {
    return this.getAttribute('fit') === 'contain' ? 'contain' : 'cover';
  }

  get sourceList() {
    const list = (0,_value_mjs__WEBPACK_IMPORTED_MODULE_12__.listOf)(this.hasAttribute('sources') ? this.getAttribute('sources') : 'device', SOURCES);
    return list.length ? list : ['device'];
  }

  get editList() {
    return (0,_value_mjs__WEBPACK_IMPORTED_MODULE_12__.listOf)(this.getAttribute('edit'), EDITS);
  }

  get altMode() {
    const mode = this.getAttribute('alt');
    return mode === 'field' || mode === 'required' ? mode : 'none';
  }

  get limits() {
    return {
      maxSize: (0,_value_mjs__WEBPACK_IMPORTED_MODULE_12__.positiveLimit)(this.getAttribute('max-size')),
      minWidth: (0,_value_mjs__WEBPACK_IMPORTED_MODULE_12__.positiveLimit)(this.getAttribute('min-width')),
      minHeight: (0,_value_mjs__WEBPACK_IMPORTED_MODULE_12__.positiveLimit)(this.getAttribute('min-height'))
    };
  } // The ids the template writes come from the instance path (§7.1.1), never
  // from a counter.


  get _id() {
    return (0,_core_js_instance_path__WEBPACK_IMPORTED_MODULE_4__.partId)((0,_core_js_instance_path__WEBPACK_IMPORTED_MODULE_4__.instancePath)(this, {
      kind: 'sf-input-image'
    }));
  } // The image the field holds, in the file shape, or null when it is empty.


  get value() {
    if (this._value !== undefined) return this._value;
    return (0,_value_mjs__WEBPACK_IMPORTED_MODULE_12__.normaliseImageValue)(this.getAttribute('value'));
  } // Set from code, the value is not a change: no event, as for a native field.


  set value(next) {
    this.setValue(next);
  }

  setValue(next) {
    const value = (0,_value_mjs__WEBPACK_IMPORTED_MODULE_12__.normaliseImageValue)(next);
    if (value?.href !== this._objectUrl) this._releaseObjectUrl();
    this._value = value;
    if (value) this._missingShown = false;
    this.requestComponentUpdate('value');
    this.sfSyncFormState();
    return this;
  } // The page's transfer (IF-12): async (file, {signal, onProgress, value}) =>
  // the stored value ({value, href} or an id). With it the field sends each
  // file it takes and shows the transfer; without it the host uploads the File
  // the events carry and calls setValue().


  get uploader() {
    return this._uploader;
  }

  set uploader(value) {
    this._uploader = typeof value === 'function' ? value : null;
  } // What the form gets (§17.1): the File the person chose, or the stored
  // image's id (else its address); nothing while empty or disabled. Read-only
  // still submits.


  sfFormValue() {
    if (this.disabled) return null;
    const value = this.value;
    if (!value) return null;
    if (value.file && typeof File === 'function' && value.file instanceof File) return value.file;
    return String(value.value || value.href || '') || null;
  }

  fieldValidity() {
    return {
      valueMissing: this.required && !this.disabled && !this.value,
      message: this.sfWord('value-missing'),
      anchor: this.focusDelegate()
    };
  } // Beside value-missing, what keeps the form from submitting: a transfer
  // still going or failed, and a description the page requires (alt
  // required) that is neither written nor waived as decorative.


  fieldCustomError() {
    if (this.disabled) return '';
    if (this._upload?.state === 'process') return this.sfWord('wait-for-upload');
    if (this._upload?.state === 'error') return this.sfWord('upload-failed-validity');
    return this._altMissing() ? this.sfWord('alt-missing') : '';
  }

  sfSyncValidity() {
    const internals = this.sfInternals;
    const own = this.fieldCustomError();

    if (!internals || !own || this.sfCustomError) {
      super.sfSyncValidity();
      return;
    }

    try {
      const anchor = this.focusDelegate();
      internals.setValidity({
        customError: true
      }, own, anchor && this.contains(anchor) ? anchor : undefined);
    } catch (error) {
      this.reportComponentError?.(error, 'validity');
    }
  } // form.reset(): back to the image the field was written with, without
  // events (§17.1 item 4).


  fieldReset() {
    this._upload?.controller?.abort();
    this._upload = null;

    this._releaseObjectUrl();

    this._value = undefined;
    this._notice = null;
    this._missingShown = false;
    this._urlOpen = false;
    this._editor = null;
    const input = this.input();
    if (input) input.value = '';
    this.requestComponentUpdate('value');
  }

  get interactive() {
    return !this.disabled && !this.readonly;
  }

  text(key) {
    return this.sfWord(kebab(key));
  } // A word that names the file: the name has its place in the word ({name},
  // quotes and all), so a language may put it first (C177 follow-up).
  //
  // quoted («%s») and chosen, the words once glued around the name, are dated
  // aliases until 2027-01-01 (languages-g1): a product that registered them
  // and not the new key keeps the old phrase («Заменить «logo.png»»), noted
  // once in SF.deprecations.


  fileWord(key, name) {
    const lead = FORMER_FILE_LEADS[key];

    if (lead && (0,_core_js_page_language_js__WEBPACK_IMPORTED_MODULE_2__.registeredWord)(this.localName, key, this) === undefined) {
      const quoted = (0,_core_js_page_language_js__WEBPACK_IMPORTED_MODULE_2__.registeredWord)(this.localName, 'quoted', this);
      const chosen = key === 'chosen-file' ? (0,_core_js_page_language_js__WEBPACK_IMPORTED_MODULE_2__.registeredWord)(this.localName, 'chosen', this) : undefined;

      if (chosen !== undefined || quoted !== undefined && key !== 'chosen-file') {
        for (const [from, word] of [['quoted', quoted], ['chosen', chosen]]) {
          if (word !== undefined) {
            (0,_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_3__.noteDeprecated)({
              component: this.localName,
              tag: this.localName,
              kind: 'word',
              from,
              to: key,
              since: '2026-11-16',
              remove_after: '2027-01-01'
            });
          }
        }

        const shown = quoted !== undefined ? String(quoted).replace('%s', name) : `«${name}»`;
        return `${chosen ?? this.sfWord(lead)} ${shown}`;
      }
    }

    return this.sfWord(key, {
      vars: {
        name
      }
    });
  } // A size as people read it, in the page's language: «2 КБ», «1,4 МБ». Text
  // the host already formatted is shown as it came.


  formatSize(size) {
    const units = ['bytes', 'kilobytes', 'megabytes', 'gigabytes'].map(key => this.text(key));
    return (0,_value_mjs__WEBPACK_IMPORTED_MODULE_12__.formatFileSize)(size, {
      units,
      node: this
    });
  } // The image's pixels: the value's own, else what the picture said once it
  // loaded.


  dimensionsOf(value) {
    if (!value) return null;
    if (value.width && value.height) return {
      width: value.width,
      height: value.height
    };
    return value.href ? this._dimensions.get(value.href) || null : null;
  } // «450×300 · 2 КБ»: the image's own dimensions once it has loaded, then its
  // size. The host's `meta` replaces the line when it knows better. While a
  // transfer runs it is the share, and after a failure the failure.


  metaText(value) {
    if (this._upload?.state === 'process') {
      const share = this._upload.progress;
      return share === null || share === undefined ? this.sfWord('uploading-plain') : this.sfWord('uploading', {
        vars: {
          n: share
        }
      });
    }

    if (this._upload?.state === 'error') return this.sfWord('upload-failed-plain');
    if (this.meta) return this.meta;
    if (!value) return '';
    const dimensions = this.dimensionsOf(value);
    return [dimensions ? `${dimensions.width}×${dimensions.height}` : '', this.formatSize(value.size)].filter(Boolean).join(' · ');
  }

  input() {
    return this.querySelector(':scope .sf-image-field-input');
  }

  get menu() {
    return this.querySelector(MENU);
  }

  focusDelegate() {
    return this.querySelector(':scope .sf-image-field-actions button:not([disabled])');
  } // Shown once focus leaves the field or the form checks it: an empty
  // required field, or a description the page requires and nobody wrote.


  _showMissing() {
    if (this.disabled || this._missingShown) return;
    if (!(this.required && !this.value) && !this._altMissing()) return;
    this._missingShown = true;
    this.requestComponentUpdate('missing');
  }

  _altMissing() {
    const value = this.value;
    return this.altMode === 'required' && Boolean(value) && !value.decorative && !String(value.alt || '').trim();
  }

  _say(kind, text) {
    this._notice = text ? {
      kind,
      text
    } : null;
  } // The person gave files: from the dialog (input), a drop, a paste, or the
  // host's take-file. One image is taken: the first that passes the checks.
  // The rest are refused with their reason (rejected, under the field), and
  // extra images are said as an information line (IF-2, IF-3). With a minimum
  // width or height the picture is read first, so the action answers a
  // promise of its outcome there (§4.4).


  _takeFiles(files, source = 'input') {
    const list = Array.from(files || []).filter(Boolean);
    if (!list.length) return 'no-file';
    if (!this.interactive) return 'inactive';
    const {
      maxSize,
      minWidth,
      minHeight
    } = this.limits;
    const rejected = [];
    let chosen = null;

    for (const file of list) {
      if (chosen) {
        rejected.push(this._rejection(file, 'count'));
        continue;
      }

      const reason = (0,_value_mjs__WEBPACK_IMPORTED_MODULE_12__.fileRejection)(file, {
        accept: this.accept,
        maxSize
      });
      if (reason) rejected.push(this._rejection(file, reason, {
        max: maxSize
      }));else chosen = file;
    }

    const extra = chosen ? rejected.filter(entry => entry.reason === 'count').length : 0;

    const finish = taken => {
      const refused = taken ? rejected.filter(entry => entry.reason !== 'count') : rejected;
      const shown = refused.length ? refused : [];
      if (shown.length) this._say('error', shown.length === 1 ? shown[0].message : shown.map(entry => entry.message).join('. '));else if (taken && extra) this._say('info', this.sfWord('taken-first', {
        vars: {
          n: list.length
        }
      }));else this._say('', '');
      if (rejected.length) this._reject(rejected, source);
      this.requestComponentUpdate('notice');
      return taken ? 'applied' : 'rejected';
    };

    if (!chosen) return finish(false);

    if (!minWidth && !minHeight) {
      this._take(chosen, source, null);

      return finish(true);
    } // The picture is read before it is taken: a too-small image never shows.


    let href = '';

    try {
      href = URL.createObjectURL(chosen);
    } catch {
      href = '';
    }

    return readDimensions(href).then(dimensions => {
      const small = !dimensions ? 'unreadable' : minWidth && dimensions.width < minWidth ? 'min-width' : minHeight && dimensions.height < minHeight ? 'min-height' : '';

      if (small) {
        try {
          URL.revokeObjectURL(href);
        } catch {// Nothing to release.
        }

        rejected.unshift(this._rejection(chosen, small, {
          dimensions,
          min: small === 'min-height' ? minHeight : minWidth
        }));
        return finish(false);
      }

      this._take(chosen, source, {
        href,
        dimensions
      });

      return finish(true);
    });
  }

  _rejection(file, reason, {
    max = 0,
    min = 0,
    dimensions = null
  } = {}) {
    const name = String(file?.name || '');
    const vars = {
      name
    };
    if (reason === 'type') vars.formats = (0,_value_mjs__WEBPACK_IMPORTED_MODULE_12__.acceptFormats)(this.accept, kind => this.sfWord(`formats-${kind}`));
    if (reason === 'size') Object.assign(vars, {
      size: this.formatSize(file?.size),
      max: this.formatSize(max)
    });

    if (reason === 'min-width' || reason === 'min-height') {
      Object.assign(vars, {
        width: dimensions?.width ?? 0,
        height: dimensions?.height ?? 0,
        min
      });
    }

    return {
      file,
      name,
      reason,
      message: this.sfWord(`reject-${reason}`, {
        vars
      })
    };
  }

  _take(file, source, read) {
    this._upload?.controller?.abort();
    this._upload = null;
    const previous = this.value && !this.value.file ? this.value : null;

    this._releaseObjectUrl();

    let href = read?.href || '';

    if (!href) {
      try {
        href = URL.createObjectURL(file);
      } catch {
        href = '';
      }
    }

    this._objectUrl = href;
    const value = {
      value: '',
      label: file.name,
      mime: file.type || '',
      size: file.size,
      href,
      file
    };

    if (read?.dimensions) {
      value.width = read.dimensions.width;
      value.height = read.dimensions.height;
    } // A new picture needs its own description; the old one's does not fit it.


    this._value = value;
    this._missingShown = false;
    this._urlOpen = false;
    this._editor = null;
    this.announce(this.fileWord('chosen-file', file.name));
    this.requestComponentUpdate('value');

    this._emitValue({
      value,
      file,
      source
    });

    this.sfEmit('attach', {
      files: [file],
      file,
      source,
      value,
      name: this.name
    });
    if (this._uploader) this._send(file, previous);
  } // The transfer through the page's uploader: the share it reports, then the
  // stored value (done) or the reason (error). Cancel aborts it and puts the
  // stored image back.


  _send(file, previous = this._upload?.previous ?? null) {
    const send = this._uploader;
    if (!send || !file) return;
    this._upload?.controller?.abort();
    const controller = new AbortController();
    const upload = {
      state: 'process',
      progress: null,
      controller,
      previous,
      message: ''
    };
    this._upload = upload;
    this.requestComponentUpdate('upload');
    this.sfSyncFormState();
    const {
      signal
    } = controller;

    const onProgress = (done, total) => {
      if (signal.aborted || this._upload !== upload) return;
      const share = Number(total) > 0 ? Math.round(Number(done) / Number(total) * 100) : null;
      upload.progress = share === null ? null : Math.max(0, Math.min(100, share));
      this.requestComponentUpdate('upload-progress');
    };

    Promise.resolve().then(() => send.call(null, file, {
      signal,
      onProgress,
      value: this.value
    })).then(answer => {
      if (signal.aborted || this._upload !== upload) return;
      this._upload = null;
      const stored = answer !== null && typeof answer === 'object' ? answer : {
        value: answer
      };
      const current = this.value || {};
      const next = { ...current,
        value: stored.value === undefined || stored.value === null ? '' : String(stored.value)
      };

      if (stored.href) {
        this._releaseObjectUrl();

        next.href = String(stored.href);
      }

      delete next.file;
      this._value = (0,_value_mjs__WEBPACK_IMPORTED_MODULE_12__.normaliseImageValue)(next);
      this.announce(this.sfWord('uploaded'));
      this.requestComponentUpdate('upload-done');

      this._emitValue({
        value: this._value,
        file: null,
        source: 'upload'
      }, ['change']);
    }).catch(error => {
      if (signal.aborted || this._upload !== upload) return;
      upload.state = 'error';
      upload.message = String(error?.message || '');
      const message = upload.message ? this.sfWord('upload-failed-line', {
        vars: {
          message: upload.message
        }
      }) : this.sfWord('upload-failed-plain');

      this._say('error', message);

      this.announce(message);
      this.requestComponentUpdate('upload-failed');
      this.sfSyncFormState();
    });
  }

  _retryUpload() {
    const file = this.value?.file;
    if (!file || this._upload?.state !== 'error') return 'unchanged';

    this._say('', '');

    this._send(file, this._upload.previous);

    return 'applied';
  } // Cancel a transfer, or give up on a failed one: the stored image comes
  // back (or the field is empty again), as before the choice.


  _cancelUpload() {
    const upload = this._upload;
    if (!upload) return 'unchanged';
    upload.controller?.abort();
    this._upload = null;

    this._releaseObjectUrl();

    this._value = upload.previous;

    this._say('', '');

    this._focusAfterRender = 'choose';
    this.announce(this.sfWord('upload-cancelled'));
    this.requestComponentUpdate('upload-cancelled');

    this._emitValue({
      value: this._value,
      file: null,
      source: 'cancel'
    });

    return 'applied';
  } // The person removed the image. Focus goes to «Выбрать…», which is where the
  // removed button stood, so the keyboard does not fall back to the page. Not
  // called remove(): that is the element's own removal from the document.


  _removeImage() {
    const previous = this.value;
    if (!previous) return 'empty';
    if (!this.interactive) return 'inactive';
    this._upload?.controller?.abort();
    this._upload = null;

    this._releaseObjectUrl();

    this._value = null;

    this._say('', '');

    this._editor = null;
    const input = this.input();
    if (input) input.value = '';
    this._focusAfterRender = 'choose'; // A required field emptied from code says so at once.

    if (this.required) this._missingShown = true;
    this.announce(this.text('removed'));
    this.requestComponentUpdate('value');

    this._emitValue({
      value: null,
      file: null,
      source: 'remove'
    });

    this.sfEmit('detach', {
      value: previous,
      name: this.name
    });
    return 'applied';
  }

  _reject(rejected, source) {
    const files = rejected.map(entry => entry.file);
    this.announce(rejected.map(entry => entry.message).join('. '));
    this.sfEmit('rejected', {
      files,
      rejected,
      accept: this.accept,
      source
    });
  } // Said in the polite status, as sf-help-mark and sf-copy-button say theirs.
  // Cleared first, so the same words twice are heard twice.


  announce(message) {
    this.announcement = '';
    this.requestComponentUpdate('announce-clear');
    clearTimeout(this._announceTimer);
    this._announceTimer = setTimeout(() => {
      this.announcement = message;
      this.requestComponentUpdate('announce');
    }, 50);
  } // `input` and `change` once each per choice or removal, as a native file
  // input sends them, on the host with the value, the File and the form name.
  // A transfer that ends (source upload) sends change alone: the form value
  // moved from the File to the stored id.


  _emitValue({
    value,
    file,
    source
  }, types = ['input', 'change']) {
    this.sfSyncFormState();

    for (const type of types) this.sfEmit(type, {
      value,
      file,
      source,
      name: this.name
    });
  }

  _releaseObjectUrl() {
    if (!this._objectUrl) return;

    try {
      URL.revokeObjectURL(this._objectUrl);
    } catch {// Nothing to release.
    }

    this._dimensions.delete(this._objectUrl);

    this._objectUrl = '';
  } // The dialog's own change. It also bubbles out of the host as a plain Event
  // with no detail -- a second change for the one this dispatches -- so it
  // stops here, as sf-color's does.


  onInputChange(event) {
    event.stopPropagation();
    const files = Array.from(event.target?.files || []);
    if (files.length) this._takeFiles(files, 'input'); // The same file chosen again is a choice again.

    if (event.target && !this._uploader) event.target.value = '';
  }

  onInputEvent(event) {
    event.stopPropagation();
  } // The inner sf-input and sf-switch (description, decorative, address) send
  // their native input and change; they are this field's parts, so they stop
  // here and the field says its own.


  stopInner(event) {
    event.stopPropagation();
  } // «Выбрать…» / «Заменить…»: the dialog when the page gave one source, the
  // menu of sources when it gave more (C94 point 5).


  onChoosePress(event) {
    if (!this.interactive) return;
    const sources = this.sourceList;

    if (sources.length > 1) {
      const menu = this.menu;
      const trigger = event?.currentTarget?.querySelector?.('button') ?? event?.currentTarget;
      if (menu && trigger) customElements.whenDefined('sf-menu-context').then(() => menu.toggleFor(trigger, {
        side: 'block-end',
        align: 'start'
      }));
      return;
    }

    this._useSource(sources[0]);
  }

  onMenuSelect(event) {
    event.stopPropagation();
    const id = event.detail?.id;
    if (id) this._useSource(id);
  }

  _useSource(source) {
    if (!this.interactive) return;

    if (source === 'device') {
      this.choose();
      return;
    }

    if (source === 'library') {
      // The library is the page's (Larena «Файлы», the letter's images): it
      // opens its own and calls setValue() with the picture.
      this.sfEmit('library', {
        value: this.value,
        name: this.name
      });
      return;
    }

    if (source === 'url') {
      this._urlOpen = true;
      this._urlError = '';
      this._focusAfterRender = 'url';
      this.requestComponentUpdate('url');
    }
  }

  _closeUrl() {
    this._urlOpen = false;
    this._urlError = '';
    this._focusAfterRender = 'choose';
    this.requestComponentUpdate('url');
  } // An address: the picture is read, checked against the minimum pixels and
  // taken as the value (change, source url). Nothing is uploaded: the address
  // is the stored image.


  async _takeUrl() {
    const field = this.querySelector(':scope .sf-image-field-url-input');
    const address = String(field?.value ?? '').trim();
    if (!address) return 'no-address';
    const dimensions = await readDimensions(address);
    const {
      minWidth,
      minHeight
    } = this.limits;
    let problem = '';
    if (!dimensions) problem = this.sfWord('url-failed');else if (minWidth && dimensions.width < minWidth || minHeight && dimensions.height < minHeight) {
      problem = this._rejection({
        name: address
      }, minWidth && dimensions.width < minWidth ? 'min-width' : 'min-height', {
        dimensions,
        min: minWidth && dimensions.width < minWidth ? minWidth : minHeight
      }).message;
    }

    if (problem) {
      this._urlError = problem;
      this.requestComponentUpdate('url');
      return 'rejected';
    }

    this._upload?.controller?.abort();
    this._upload = null;

    this._releaseObjectUrl();

    this._value = (0,_value_mjs__WEBPACK_IMPORTED_MODULE_12__.normaliseImageValue)({
      value: '',
      href: address,
      width: dimensions.width,
      height: dimensions.height
    });
    this._urlOpen = false;
    this._urlError = '';

    this._say('', '');

    this._missingShown = false;
    this._focusAfterRender = 'choose';
    this.requestComponentUpdate('value');

    this._emitValue({
      value: this._value,
      file: null,
      source: 'url'
    });

    return 'applied';
  }

  onUrlKey(event) {
    if (event.key === 'Enter') {
      event.preventDefault();

      this._takeUrl();
    } else if (event.key === 'Escape') {
      event.preventDefault();

      this._closeUrl();
    }
  } // The description and «Декоративная» (C94 point 4): written into the value
  // as the person types; input on each key, change when it is committed.


  onAltInput(event, type) {
    event.stopPropagation();
    const value = this.value;
    if (!value) return;
    const text = String(event.target?.value ?? event.currentTarget?.value ?? '');
    this._value = { ...value,
      alt: text
    };
    this.sfSyncFormState();

    this._emitValue({
      value: this._value,
      file: value.file ?? null,
      source: 'alt'
    }, [type]);
  }

  onDecorative(event) {
    event.stopPropagation();
    const value = this.value;
    if (!value) return;
    const host = event.currentTarget;
    const on = Boolean(host?.checked ?? event.target?.checked);
    const next = { ...value
    };
    if (on) next.decorative = true;else delete next.decorative;
    this._value = next;
    this.requestComponentUpdate('alt');

    this._emitValue({
      value: next,
      file: value.file ?? null,
      source: 'alt'
    });
  } // --------------------------------------------------------------- editor
  // The frame (crop) and the focal point (C94 point 3): edited on the picture
  // itself, never cut, in a window over the page (C125: the field no longer
  // grows under the picture). The working copy is kept until «Готово»; the
  // window gives focus back to «Изменить» however it closes.


  get cropAspect() {
    const own = (0,_value_mjs__WEBPACK_IMPORTED_MODULE_12__.aspectRatio)(this.getAttribute('aspect'));
    if (own) return own;
    if (this.shapeName === 'circle') return '1 / 1';
    return this.layoutName === 'row' ? '1 / 1' : '16 / 9';
  }

  _openEditor() {
    const value = this.value;
    const modes = this.editList;
    if (!value?.href || !modes.length || !this.interactive) return 'unchanged';
    this._editor = {
      mode: modes[0],
      crop: (0,_value_mjs__WEBPACK_IMPORTED_MODULE_12__.normaliseCrop)(value.crop) || {
        aspect: this.cropAspect.replace(/\s/gu, ''),
        zoom: 1,
        x: 0.5,
        y: 0.5
      },
      focus: (0,_value_mjs__WEBPACK_IMPORTED_MODULE_12__.normaliseFocus)(value.focus) || {
        x: 0.5,
        y: 0.5
      }
    }; // The window opens as it is drawn and puts focus on the picture (its
    // autofocus), and remembers «Изменить» to give it back.

    this.requestComponentUpdate('editor');
    return 'applied';
  }

  _setEditorMode(mode) {
    if (!this._editor || !EDITS.includes(mode)) return;
    this._editor.mode = mode;
    this.requestComponentUpdate('editor');
  } // «Готово» (save) writes the working copy into the value; «Отмена» leaves
  // it. Either way the window closes, and its sf-modal-closed drops the copy
  // (onEditorClosed), as Escape, the scrim and the × do.


  _closeEditor(save) {
    const editor = this._editor;
    if (!editor || this._editorClosing) return;

    if (save && this.value) {
      const next = { ...this.value
      };
      const modes = this.editList;
      if (modes.includes('crop')) next.crop = { ...editor.crop
      };
      if (modes.includes('focus')) next.focus = { ...editor.focus
      };
      this._value = next;

      this._emitValue({
        value: next,
        file: next.file ?? null,
        source: 'edit'
      });
    }

    const editorWindow = this.querySelector?.(EDITOR_WINDOW);

    if (editorWindow && typeof editorWindow.close === 'function' && editorWindow.openState) {
      this._editorClosing = true;
      const outcome = save ? editorWindow.confirm?.() : editorWindow.close({
        reason: 'cancelled'
      });
      if (outcome?.outcome !== 'refused') return;
      this._editorClosing = false;
    }

    this._dropEditor();
  } // The window has closed, by «Готово», «Отмена», Escape, the scrim or its ×:
  // the working copy goes and the window leaves the field. The window put
  // focus back on «Изменить»; if it could not (the page moved it), the field
  // does.


  onEditorClosed(event) {
    event?.stopPropagation?.();
    if (event && event.target !== event.currentTarget) return;

    this._dropEditor();
  }

  _dropEditor() {
    this._editorClosing = false;
    if (!this._editor) return;
    this._editor = null;
    this._drag = null;
    const active = globalThis.document?.activeElement;
    if (!active || !this.contains?.(active)) this._focusAfterRender = 'edit';
    this.requestComponentUpdate('editor');
  }

  _zoomBy(step) {
    const editor = this._editor;
    if (!editor) return;
    const zoom = Math.round((editor.crop.zoom + step) * 100) / 100;
    editor.crop.zoom = Math.max(_value_mjs__WEBPACK_IMPORTED_MODULE_12__.ZOOM_MIN, Math.min(_value_mjs__WEBPACK_IMPORTED_MODULE_12__.ZOOM_MAX, zoom));
    this.requestComponentUpdate('editor');
  }

  _moveEditor(dx, dy) {
    const editor = this._editor;
    if (!editor) return;

    const clamp = number => Math.max(0, Math.min(1, number));

    const point = editor.mode === 'focus' ? editor.focus : editor.crop;
    point.x = Math.round(clamp(point.x + dx) * 1000) / 1000;
    point.y = Math.round(clamp(point.y + dy) * 1000) / 1000;
    this.requestComponentUpdate('editor');
  }

  onStageKey(event) {
    const step = event.shiftKey ? 0.1 : 0.02;
    const moves = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step]
    };
    const move = moves[event.key];

    if (move) {
      event.preventDefault(); // The frame moves the other way from the picture under it: an arrow to
      // the right shows more of the right.

      this._moveEditor(move[0], move[1]);

      return;
    }

    if (this._editor?.mode === 'crop' && ['+', '=', '-'].includes(event.key)) {
      event.preventDefault();

      this._zoomBy(event.key === '-' ? -0.1 : 0.1);

      return;
    } // Enter is «Готово»; Escape is the window's own (close-on-esc), which
    // leaves the value as «Отмена» does.


    if (event.key === 'Enter') {
      event.preventDefault();

      this._closeEditor(true);
    }
  }

  onStagePointer(event) {
    const editor = this._editor;
    const stage = event.currentTarget;
    if (!editor || !stage) return;
    const box = stage.getBoundingClientRect();
    if (!box.width || !box.height) return;

    const clamp = number => Math.max(0, Math.min(1, number));

    if (event.type === 'pointerdown') {
      stage.setPointerCapture?.(event.pointerId);
      this._drag = {
        x: event.clientX,
        y: event.clientY,
        crop: { ...editor.crop
        }
      };
    }

    if (!this._drag) return;

    if (event.type === 'pointerup' || event.type === 'pointercancel') {
      this._drag = null;
      return;
    }

    if (editor.mode === 'focus') {
      editor.focus = {
        x: clamp((event.clientX - box.left) / box.width),
        y: clamp((event.clientY - box.top) / box.height)
      };
    } else if (event.type === 'pointermove') {
      const k = 1 / Math.max(1, editor.crop.zoom);
      editor.crop.x = clamp(this._drag.crop.x - (event.clientX - this._drag.x) / box.width * k);
      editor.crop.y = clamp(this._drag.crop.y - (event.clientY - this._drag.y) / box.height * k);
    }

    this.requestComponentUpdate('editor');
  }

  _editorState() {
    const editor = this._editor;
    if (!editor) return '';

    const pct = number => Math.round(number * 100);

    if (editor.mode === 'focus') return this.sfWord('focus-state', {
      vars: {
        x: pct(editor.focus.x),
        y: pct(editor.focus.y)
      }
    });
    return this.sfWord('crop-state', {
      vars: {
        aspect: String(editor.crop.aspect || '').replace('/', ':'),
        zoom: pct(editor.crop.zoom),
        x: pct(editor.crop.x),
        y: pct(editor.crop.y)
      }
    });
  } // ------------------------------------------------------- drop and paste
  // A file held over the field: the whole field is the target, and says so --
  // the border and fill of a selection and the words «Отпустите файл…». Core's
  // files drop (FO-1, core/js/files-drop.js) reads the drag: only one that
  // carries files is taken, so text dragged across a form is not; the cursor
  // says no while the field takes nothing, and a drop gives its files once.


  _bindFilesDrop() {
    if (this._filesDrop) return;
    this._filesDrop = (0,_core_js_files_drop_js__WEBPACK_IMPORTED_MODULE_7__.filesDrop)(this, {
      mark: false,
      disabled: () => !this.interactive,
      onOver: over => {
        if (this.dragging === over) return;
        this.dragging = over;
        this.sfHostState('data-dragged-over', over);
        this.requestComponentUpdate('drag');
      },
      onFiles: files => this._takeFiles(files, 'drop')
    });
  } // A picture pasted while the field has focus (IF-5): the files the
  // clipboard holds, as a drop's. Text pasted elsewhere -- the description,
  // the address -- is not this.


  onPaste(event) {
    if (!this.interactive) return;
    const files = Array.from(event.clipboardData?.files || []);
    if (!files.length) return;
    event.preventDefault();

    this._takeFiles(files, 'paste');
  }

  onImageLoad(event, href) {
    const image = event.target;
    if (!href || !image?.naturalWidth) return;

    const known = this._dimensions.get(href);

    if (known && known.width === image.naturalWidth && known.height === image.naturalHeight) return;

    this._dimensions.set(href, {
      width: image.naturalWidth,
      height: image.naturalHeight
    });

    this.requestComponentUpdate('dimensions');
  }

  onImageError(href) {
    if (!href || this._failed.has(href)) return;

    this._failed.add(href);

    this.requestComponentUpdate('image-error');
  }

  afterRender(callback) {
    if (typeof callback === 'function') return super.afterRender(callback);

    if (this._focusAfterRender) {
      const target = this._focusAfterRender;
      this._focusAfterRender = ''; // The sf-button host, not its inner button: a button drawn in this
      // render has not drawn its own yet, and the host's focus() waits for it.

      const selector = {
        choose: ':scope .sf-image-field-actions :is(sf-button, sf-button-icon):not([disabled])',
        url: ':scope .sf-image-field-url-input',
        edit: ':scope .sf-image-field-edit'
      }[target];
      this.querySelector(selector || '')?.focus?.({
        preventScroll: true
      });
    }

    this.sfSyncFormState();
    return undefined;
  }

  templateContext() {
    const props = this.getPropsContext();
    const value = this.value;
    const upload = this._upload;
    const notice = this._notice;
    const missing = this._missingShown && this.required && !value && !this.disabled;
    const field = (0,_component_field_contract__WEBPACK_IMPORTED_MODULE_8__.createFieldContract)(this, {
      prefix: 'sf-image-field',
      required: this.required,
      // error is a dated alias of invalid (§17.2, aliases.json).
      invalid: this.invalid || this.hasAttribute('error') || missing || notice?.kind === 'error',
      hint: this.hint,
      errorMessage: this.errorMessage
    });
    const pageError = this.invalid || this.hasAttribute('error') ? this.hasSlotContent?.('error') ? this.getSlotContent('error') : this.errorMessage : '';
    const hintContent = this.hasSlotContent?.('hint') ? this.getSlotContent('hint') : this.hint; // The page's error first, then what the field says itself, then the hint.

    let message = hintContent;
    let messageKind = 'hint';

    if (pageError) {
      message = pageError;
      messageKind = 'error';
    } else if (notice) {
      message = notice.text;
      messageKind = notice.kind;
    } else if (missing) {
      message = this.sfWord('value-missing');
      messageKind = 'error';
    }

    const fileName = value?.label || '';
    const shownName = fileName || (value ? this.sfWord('group') : '');
    const words = Object.fromEntries(WORD_KEYS.map(key => [camel(key), this.sfWord(key)]));
    const sources = this.sourceList;
    const editor = this._editor;
    const dimensions = this.dimensionsOf(value);
    return this.createTemplateContext({ ...props,
      component: this,
      id: this._id,
      field,
      value,
      size: this.size,
      layout: this.layoutName,
      shape: this.shapeName,
      fit: this.fitName,
      // The frame of the preview: the page's aspect, else a circle's square,
      // else the picture's own proportion once known.
      frameAspect: (0,_value_mjs__WEBPACK_IMPORTED_MODULE_12__.aspectRatio)(this.getAttribute('aspect')) || (this.shapeName === 'circle' ? '1 / 1' : dimensions ? `${dimensions.width} / ${dimensions.height}` : '16 / 9'),
      transparent: (0,_value_mjs__WEBPACK_IMPORTED_MODULE_12__.mayBeTransparent)(value),
      accept: this.accept,
      fileName: shownName,
      metaText: this.metaText(value),
      broken: Boolean(value?.href && this._failed.has(value.href)),
      dragging: this.dragging && this.interactive,
      interactive: this.interactive,
      coarse: this._coarse,
      required: this.required,
      removable: !this.required,
      upload,
      sources,
      menuEntries: sources.length > 1 ? sources.map(source => ({
        id: source,
        text: source === 'library' ? this.getAttribute('library-label') || words.sourceLibrary : source === 'device' ? this._coarse ? words.sourceDeviceCoarse : words.sourceDevice : words.sourceUrl,
        icon: {
          device: 'upload',
          library: 'photo_library',
          url: 'link'
        }[source]
      })) : [],
      menuSize: this.size === '1/2' || this.size === '1/3' ? '1/2' : '1',
      edits: this.editList,
      editor,
      editorState: this._editorState(),
      phone: this._phone,
      altMode: this.altMode,
      altMissing: this._missingShown && this._altMissing(),
      urlOpen: this._urlOpen,
      urlError: this._urlError,
      announcement: this.announcement,
      message,
      messageKind,
      words,
      names: {
        group: this.label || this.ariaLabel || words.group,
        choose: words.chooseName,
        replace: fileName ? this.fileWord('replace-file', fileName) : words.replaceName,
        remove: fileName ? this.fileWord('remove-file', fileName) : words.removeName,
        edit: fileName ? this.fileWord('edit-file', fileName) : words.editName,
        cancel: fileName ? this.fileWord('cancel-upload-file', fileName) : words.cancelUploadName,
        retry: fileName ? this.fileWord('retry-file', fileName) : words.retryName,
        upload: this.sfWord('upload-name', {
          vars: {
            name: fileName || words.group
          }
        })
      },
      rootClass: this.getRootClass(),
      // The host is the form control where the browser has ElementInternals,
      // so the native file input carries no name (§17.1 item 6).
      controlName: this.sfInternals ? '' : this.name
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_11__.renderImageFieldTemplate)(this.templateContext());
  }

}

SfImageField.define('sf-input-image');

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "15360766166a"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderImageFieldTemplate: () => (/* binding */ renderImageFieldTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var _helpers_field_help__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("f39dc444b059");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, _helpers_field_help__WEBPACK_IMPORTED_MODULE_1__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, _helpers_field_help__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);

 // The buttons are one rung below the field, as a field's own trailing controls
// are: a size 1 field (a 40px control row) carries size 1/2 buttons. 1/3 has
// no rung below it: its buttons are the ladder's smallest, 1/3.

const BUTTON_SIZE = {
  '1/3': '1/3',
  '1/2': '1/3',
  '1': '1/2',
  '2': '1',
  '3': '2'
}; // The ring over a thumbnail is the smallest; over a preview one rung up.

const RING_SIZE = {
  row: '1/2',
  preview: '1'
}; // The inner fields (description, address) are the field's own size, at most 1.

const INNER_SIZE = {
  '1/3': '1/3',
  '1/2': '1/2',
  '1': '1',
  '2': '1',
  '3': '1'
}; // What stands in the thumbnail when there is no picture to show: an invitation
// while the field is empty, a broken image when the address did not load, and
// a plain image glyph for a value the host gave without an address.

function thumbIcon(context) {
  if (!context.value) return context.shape === 'circle' ? 'add_a_photo' : 'add_photo_alternate';
  if (context.broken) return 'broken_image';
  return 'image';
} // Where the picture stands in its box: the frame's centre and zoom when the
// person cut one (preview), else the focal point, else the middle. The
// original is never cut: the frame is drawn by position and scale.


function imageStyle(context) {
  const {
    value,
    layout
  } = context;
  const crop = value?.crop;
  const focus = value?.focus;

  const pct = number => `${Math.round(number * 1000) / 10}%`;

  if (crop && layout === 'preview' && context.fit === 'cover') {
    return `object-position: ${pct(crop.x)} ${pct(crop.y)}; transform: scale(${crop.zoom}); transform-origin: ${pct(crop.x)} ${pct(crop.y)}`;
  }

  if (focus && context.fit === 'cover') return `object-position: ${pct(focus.x)} ${pct(focus.y)}`;
  return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
}

function renderPicture(context) {
  const {
    value,
    component
  } = context;
  const href = value?.href || '';

  if (href && !context.broken) {
    // The description is the person's (alt), empty for a decorative picture
    // and while none is written: the name beside it is read anyway, and the
    // file name is not a description (IF-11).
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<img class="sf-image-field-image" src=${href} alt=${value.decorative ? '' : value.alt || ''}
                     style=${imageStyle(context)} draggable="false"
                     @load=${event => component.onImageLoad(event, href)}
                     @error=${() => component.onImageError(href)}>`;
  }

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class="sf-icon" aria-hidden="true">${thumbIcon(context)}</i>`;
}

function renderRing(context) {
  const {
    upload,
    names
  } = context;
  if (upload?.state !== 'process') return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const known = upload.progress !== null && upload.progress !== undefined;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-image-field-ring">
    <sf-progress-ring size=${RING_SIZE[context.layout]} label=${names.upload}
                      value=${known ? upload.progress : lit__WEBPACK_IMPORTED_MODULE_0__.nothing} ?indeterminate=${!known}></sf-progress-ring>
  </span>`;
}

function renderChoose(context, {
  replace
}) {
  const {
    component,
    words,
    names,
    field
  } = context;
  const size = BUTTON_SIZE[context.size] ?? '1/2';
  const many = context.sources.length > 1;
  const describedBy = context.message ? field.messageId : lit__WEBPACK_IMPORTED_MODULE_0__.nothing; // «Заменить ▾» opens the menu of sources the page enabled; with one source
  // it is a plain button that goes there («Заменить…», C94 point 5).

  const text = replace ? many ? words.replaceMenu : words.replace : many ? words.chooseMenu : words.choose;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button class=${replace ? 'sf-image-field-replace' : 'sf-image-field-choose'} size=${size}
                         appearance="outline" scheme="on-surface"
                         text=${text} icon-end=${many ? 'expand_more' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                         aria-haspopup=${many ? 'menu' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                         aria-label=${replace ? names.replace : names.choose} aria-describedby=${describedBy}
                         ?disabled=${context.disabled}
                         @click=${event => component.onChoosePress(event)}></sf-button>`;
}

function renderActions(context) {
  const {
    component,
    value,
    words,
    names,
    upload
  } = context;
  if (context.readonly) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const size = BUTTON_SIZE[context.size] ?? '1/2';
  let buttons;

  if (upload?.state === 'process') {
    buttons = (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button class="sf-image-field-cancel" size=${size} appearance="outline" scheme="on-surface"
                              text=${words.cancelUpload} aria-label=${names.cancel}
                              @click=${() => component._cancelUpload()}></sf-button>`;
  } else if (upload?.state === 'error') {
    buttons = (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
      <sf-button class="sf-image-field-retry" size=${size} appearance="outline" scheme="on-surface"
                 text=${words.retry} aria-label=${names.retry}
                 @click=${() => component._retryUpload()}></sf-button>
      <sf-button-icon class="sf-image-field-cancel" size=${size} appearance="ghost" scheme="on-surface-variant"
                      icon="close" aria-label=${names.cancel} title=${words.cancelUpload}
                      @click=${() => component._cancelUpload()}></sf-button-icon>`;
  } else if (value) {
    // Real buttons with names that say what they act on: «Заменить изображение
    // «logo.png»», each beginning with its visible words so a voice command
    // naming what is seen still reaches it. Remove is the icon (IF-9), so the
    // size line keeps its room, and a required field has none (IF-6).
    buttons = (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
      ${renderChoose(context, {
      replace: true
    })}
      ${context.edits.length && value.href && !context.broken ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button class="sf-image-field-edit" size=${size} appearance="ghost" scheme="on-surface"
                          text=${words.edit} aria-label=${names.edit} aria-haspopup="dialog"
                          ?disabled=${context.disabled}
                          @click=${() => component._openEditor()}></sf-button>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      ${context.removable ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button-icon class="sf-image-field-remove" size=${size} appearance="ghost" scheme="on-surface-variant"
                               icon="delete" aria-label=${names.remove} title=${words.remove}
                               ?disabled=${context.disabled}
                               @click=${() => component.removeImage()}></sf-button-icon>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}`;
  } else {
    buttons = renderChoose(context, {
      replace: false
    });
  }

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-image-field-actions">${buttons}</span>`;
} // The words of the line under the name: the file's while it holds one; when
// empty, how to put one -- with a mouse drag or paste, on a phone take a
// photo or choose (IF-1: no drag words where there is nothing to drag with).


function emptyWords(context) {
  if (!context.interactive) return '';
  return context.coarse ? context.words.emptyHintCoarse : context.words.emptyHint;
}

function renderBody(context) {
  const {
    value,
    words
  } = context;
  const title = context.dragging ? words.drop : value ? context.fileName : context.emptyText || words.empty;
  const meta = context.dragging ? '' : value ? context.metaText : emptyWords(context);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-image-field-body">
    <span class="sf-image-field-name">${title}</span>
    ${meta ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-image-field-meta">${meta}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
  </span>`;
} // The group the drop and the paste land on: the row, or the frame of the
// preview.


function groupAttributes(context) {
  const {
    field,
    component
  } = context;
  return {
    labelledby: context.label ? `${context.id}-label` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing,
    label: context.label ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : context.names.group,
    describedby: context.message ? field.messageId : lit__WEBPACK_IMPORTED_MODULE_0__.nothing,
    invalid: field.invalid ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing,
    handlers: {
      paste: event => component.onPaste(event)
    }
  };
}

function renderRow(context) {
  const group = groupAttributes(context);
  const thumbClasses = ['sf-image-field-thumb', context.value && context.transparent ? 'sf-image-field-thumb--transparent' : ''];
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div class="sf-image-field-well"
         role="group"
         aria-labelledby=${group.labelledby}
         aria-label=${group.label}
         aria-describedby=${group.describedby}
         aria-invalid=${group.invalid}
         @paste=${group.handlers.paste}>
      <span class=${thumbClasses.filter(Boolean).join(' ')}>${renderPicture(context)}${renderRing(context)}</span>
      ${renderBody(context)}
      ${renderActions(context)}
    </div>`;
} // The preview (C94 point 1): the picture is the field, in its frame; the row
// under it -- name, size, the buttons -- keeps to the picture's width, with a
// floor that leaves room for a name and the buttons, and its buttons wrap
// under the name from the picture's start edge, never pushed to the field's
// far edge (owner's layout rule, as C88). The buttons are never laid over the
// picture (C94 point 2).


function renderPreview(context) {
  const group = groupAttributes(context);
  const {
    value,
    words
  } = context;
  const frameClasses = ['sf-image-field-frame', value && context.transparent ? 'sf-image-field-frame--transparent' : ''];
  const circleEmpty = !value && context.shape === 'circle';
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div class=${frameClasses.filter(Boolean).join(' ')}
         role="group"
         style=${`--sf-image-field--aspect: ${context.frameAspect}`}
         aria-labelledby=${group.labelledby}
         aria-label=${group.label}
         aria-describedby=${group.describedby}
         aria-invalid=${group.invalid}
         @paste=${group.handlers.paste}>
      ${value ? renderPicture(context) : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class="sf-icon" aria-hidden="true">${thumbIcon(context)}</i>
          ${circleEmpty ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-image-field-frame-text">${context.dragging ? words.drop : emptyWords(context)}</span>`}
          ${circleEmpty ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : renderActions(context)}`}
      ${renderRing(context)}
    </div>
    ${value || circleEmpty ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-image-field-under">${renderBody(context)}${renderActions(context)}</div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}`;
} // The address (source url): a text field, «Взять» and a close button, under
// the picture; Enter takes, Escape closes.


function renderUrl(context) {
  if (!context.urlOpen || !context.interactive) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const {
    component,
    words
  } = context;
  const size = INNER_SIZE[context.size] ?? '1';
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-image-field-url">
    <sf-input class="sf-image-field-url-input" size=${size} input-type="url" label=${words.urlLabel}
              placeholder="https://…" ?invalid=${Boolean(context.urlError)} error-message=${context.urlError || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
              @input=${event => component.stopInner(event)} @change=${event => component.stopInner(event)}
              @keydown=${event => component.onUrlKey(event)}></sf-input>
    <sf-button class="sf-image-field-url-take" size=${size} text=${words.urlTake}
               @click=${() => component._takeUrl()}></sf-button>
    <sf-button-icon class="sf-image-field-url-close" size=${size} appearance="ghost" scheme="on-surface-variant"
                    icon="close" aria-label=${words.urlClose} title=${words.urlClose}
                    @click=${() => component._closeUrl()}></sf-button-icon>
  </div>`;
} // The editor (C94 point 3) in its own window over the page (C125): the frame
// or the focal point, on the picture, with the mouse, a finger or the arrows,
// in an sf-modal -- a centred window on a wide screen, the whole screen under
// md (the forms in popups are sheets there, C32). Nothing is cut: «Готово»
// writes crop {aspect, zoom, x, y} and focus {x, y} into the value, «Отмена»,
// Escape, the scrim and the × leave it. The window says nothing to the page:
// its own sf-modal-* events stop at it, so a page that listens to its own
// window does not hear this one.


const EDITOR_PART = '1/2';
const EDITOR_ANSWER = '1';

const stopWindowEvent = event => event.stopPropagation();

function renderEditor(context) {
  const {
    editor,
    value,
    component,
    words
  } = context;
  if (!editor || !value?.href) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const crop = editor.mode === 'crop';

  const pct = number => `${Math.round(number * 1000) / 10}%`;

  const imageStyleText = crop ? `object-fit: cover; object-position: ${pct(editor.crop.x)} ${pct(editor.crop.y)}; transform: scale(${editor.crop.zoom}); transform-origin: ${pct(editor.crop.x)} ${pct(editor.crop.y)}` : 'object-fit: contain';
  const stageAspect = crop ? String(editor.crop.aspect || '1/1').replace('/', ' / ') : context.frameAspect;

  const pointer = event => component.onStagePointer(event);

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-modal class="sf-image-field-window" open heading=${words.editTitle}
                        width="var(--sf-h0)" fullscreen=${context.phone ? 'true' : 'false'}
                        @sf-modal-open=${stopWindowEvent} @sf-modal-opened=${stopWindowEvent}
                        @sf-modal-close=${stopWindowEvent}
                        @sf-modal-closed=${event => component.onEditorClosed(event)}>
    <div slot="content" class="sf-image-field-editor">
      ${context.edits.length > 1 ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-image-field-editor-modes" role="group" aria-label=${words.editName}>
            ${context.edits.map(mode => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button size=${EDITOR_PART} appearance=${editor.mode === mode ? 'tonal' : 'ghost'}
                scheme="on-surface" text=${mode === 'crop' ? words.crop : words.focus}
                icon-start=${mode === 'crop' ? 'crop' : 'center_focus_strong'}
                aria-pressed=${editor.mode === mode ? 'true' : 'false'}
                @click=${() => component._setEditorMode(mode)}></sf-button>`)}
          </span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      <div class=${['sf-image-field-stage', context.shape === 'circle' && crop ? 'sf-image-field-stage--circle' : ''].filter(Boolean).join(' ')}
           tabindex="0" role="application" aria-roledescription=${words.stageName} autofocus
           aria-label=${context.editorState} aria-describedby=${`${context.id}-editor-hint`}
           style=${`--sf-image-field--aspect: ${stageAspect}`}
           @keydown=${event => component.onStageKey(event)}
           @pointerdown=${pointer} @pointermove=${pointer} @pointerup=${pointer} @pointercancel=${pointer}>
        <img src=${value.href} alt="" draggable="false" style=${imageStyleText}>
        ${crop ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-image-field-stage-grid" aria-hidden="true"></span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        ${crop && context.shape === 'circle' ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-image-field-stage-mask" aria-hidden="true"></span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        ${crop ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-image-field-focus-dot" aria-hidden="true"
                                      style=${`inset-inline-start: ${pct(editor.focus.x)}; inset-block-start: ${pct(editor.focus.y)}`}></span>`}
      </div>
      <span class="sf-image-field-editor-hint" id=${`${context.id}-editor-hint`}>${crop ? words.cropHint : words.focusHint}</span>
      ${crop ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-image-field-editor-zoom">
            <sf-button-icon class="sf-image-field-zoom-out" size=${EDITOR_PART} appearance="ghost" scheme="on-surface-variant" icon="zoom_out"
                            aria-label=${words.zoomOut} title=${words.zoomOut}
                            @click=${() => component._zoomBy(-0.1)}></sf-button-icon>
            <sf-button-icon class="sf-image-field-zoom-in" size=${EDITOR_PART} appearance="ghost" scheme="on-surface-variant" icon="zoom_in"
                            aria-label=${words.zoomIn} title=${words.zoomIn}
                            @click=${() => component._zoomBy(0.1)}></sf-button-icon>
          </span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    </div>
    <sf-button slot="footer" class="sf-image-field-editor-cancel" size=${EDITOR_ANSWER} appearance="ghost" scheme="on-surface"
               text=${words.editCancel} @click=${() => component._closeEditor(false)}></sf-button>
    <sf-button slot="footer" class="sf-image-field-editor-done" size=${EDITOR_ANSWER} text=${words.editDone}
               @click=${() => component._closeEditor(true)}></sf-button>
  </sf-modal>`;
} // The description and «Декоративная» (C94 point 4), when the page asks for
// them (alt field | required): inside the field, under the picture.


function renderAlt(context) {
  const {
    value,
    component,
    words
  } = context;
  if (context.altMode === 'none' || !value || !context.interactive || context.upload?.state === 'process') return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const size = INNER_SIZE[context.size] ?? '1';
  const required = context.altMode === 'required';
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-image-field-alt">
    <sf-input class="sf-image-field-alt-input" size=${size} label=${words.altLabel}
              placeholder=${words.altPlaceholder} .value=${value.alt || ''}
              hint=${required ? words.altHintRequired : words.altHint}
              ?disabled=${Boolean(value.decorative) || context.disabled}
              ?invalid=${context.altMissing} error-message=${context.altMissing ? words.altMissing : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
              @input=${event => component.onAltInput(event, 'input')}
              @change=${event => component.onAltInput(event, 'change')}></sf-input>
    <sf-switch class="sf-image-field-decorative" size=${size} label=${words.decorative}
               ?checked=${Boolean(value.decorative)} ?disabled=${context.disabled}
               @input=${event => component.stopInner(event)}
               @change=${event => component.onDecorative(event)}></sf-switch>
  </div>`;
}

function renderImageFieldTemplate(context) {
  const {
    component,
    field,
    value
  } = context;
  const labelId = `${context.id}-label`;
  const rootClasses = ['sf-image-field', `sf-image-field--size-${context.size}`, `sf-image-field--${context.layout}`, value ? 'sf-image-field--filled' : 'sf-image-field--empty', field.invalid ? 'error' : '', context.dragging ? 'dragover' : '', context.disabled ? 'disabled' : '', context.readonly ? 'readonly' : '', context.upload ? `sf-image-field--upload-${context.upload.state}` : '', context.rootClass].filter(Boolean);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div class=${rootClasses.join(' ')} style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
         data-shape=${context.shape} data-fit=${context.fit}>
      ${context.label ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
          <span class="sf-image-field-label" id=${labelId}>
            <span class="sf-image-field-label-text">${context.label}</span>
            ${field.required ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-image-field-required">*</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ${(0,_helpers_field_help__WEBPACK_IMPORTED_MODULE_1__.renderFieldHelp)({
    help: context.help,
    label: context.label,
    size: context.size,
    className: 'sf-image-field-help',
    component
  })}
          </span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}

      ${context.layout === 'preview' ? renderPreview(context) : renderRow(context)}
      ${renderUrl(context)}
      ${renderEditor(context)}

      <input type="file"
             class="sf-image-field-input"
             id=${field.controlId}
             name=${context.controlName || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
             accept=${context.accept || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
             tabindex="-1"
             aria-hidden="true"
             ?required=${field.required && !value}
             ?disabled=${context.disabled || context.readonly}
             @change=${event => component.onInputChange(event)}
             @input=${event => component.onInputEvent(event)}>

      ${context.message ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span id=${field.messageId} class="sf-image-field-message"
                     data-field-message=${context.messageKind}>${context.message}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}

      ${renderAlt(context)}

      ${context.menuEntries.length ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-image-field-parts" style="display: contents">
            <sf-menu-context popup size=${context.menuSize} aria-label=${context.words.sourcesName}
                             .entries=${context.menuEntries}
                             @sf-menu-context-select=${event => component.onMenuSelect(event)}
                             @sf-context-menu-select=${event => event.stopPropagation()}></sf-menu-context>
          </span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}

      <span class="sf-image-field-live" role="status" aria-live="polite" aria-atomic="true">${context.announcement}</span>
    </div>
  `;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "8ddd5798abe5"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "5dcef5de40cf"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("alias-table", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("alias-table", 1).then(resolve, reject), { once: true })));

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

/***/ "5157836d86e8"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   files: () => (/* binding */ files)
/* harmony export */ });
/* harmony import */ var _en_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("6e7f9092a98a");
// Written by scripts/build-language-packs.mjs from src/core/lang/built-in.json
// (owner decision C282); do not edit. The words this bundle carries: the
// built-in languages' (en); every other language comes from
// a language file (core/lang/<code>.js or its parts).


const files = { en: { runtime: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime } };

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ en: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime });


/***/ },

/***/ "a5c6bf6ad612"
(__webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ZOOM_MAX: () => (/* binding */ ZOOM_MAX),
/* harmony export */   ZOOM_MIN: () => (/* binding */ ZOOM_MIN),
/* harmony export */   acceptFormats: () => (/* reexport safe */ _component_file_upload_js_intake_mjs__WEBPACK_IMPORTED_MODULE_2__.acceptFormats),
/* harmony export */   acceptsFile: () => (/* reexport safe */ _component_file_upload_js_intake_mjs__WEBPACK_IMPORTED_MODULE_2__.acceptsFile),
/* harmony export */   aspectRatio: () => (/* binding */ aspectRatio),
/* harmony export */   fileRejection: () => (/* reexport safe */ _component_file_upload_js_intake_mjs__WEBPACK_IMPORTED_MODULE_2__.fileRejection),
/* harmony export */   formatFileSize: () => (/* reexport safe */ _core_js_format_file_size_js__WEBPACK_IMPORTED_MODULE_1__.formatFileSize),
/* harmony export */   listOf: () => (/* binding */ listOf),
/* harmony export */   mayBeTransparent: () => (/* binding */ mayBeTransparent),
/* harmony export */   normaliseCrop: () => (/* binding */ normaliseCrop),
/* harmony export */   normaliseFocus: () => (/* binding */ normaliseFocus),
/* harmony export */   normaliseImageValue: () => (/* binding */ normaliseImageValue),
/* harmony export */   positiveLimit: () => (/* reexport safe */ _component_file_upload_js_intake_mjs__WEBPACK_IMPORTED_MODULE_2__.positiveLimit)
/* harmony export */ });
/* harmony import */ var _core_js_composition_file_size_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("fb0bdf7719f0");
/* harmony import */ var _core_js_format_file_size_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("c016c43b1452");
/* harmony import */ var _component_file_upload_js_intake_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("ab7ec7cd175d");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_composition_file_size_mjs__WEBPACK_IMPORTED_MODULE_0__, _core_js_format_file_size_js__WEBPACK_IMPORTED_MODULE_1__]);
([_core_js_composition_file_size_mjs__WEBPACK_IMPORTED_MODULE_0__, _core_js_format_file_size_js__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
// The parts of sf-input-image that are about data, not the page: which files
// the field accepts, the shape its value takes and how a size reads. Kept
// apart from the element so the contract tests can run them in Node, as
// sf-resizer's engine.mjs is.

// The size rule is core's format module (core/js/format-file-size.js, SF.format.fileSize;
// reuse audit 2026-11-02, finding 7) and the name rule the Composition
// renderer's (composition/file-size.mjs), so a size reads the same in a field,
// on a page and in a Pro list; this module re-exports the formatter.





// Whether a file is one the accept list names, and why one is refused: the
// upload core's own rules (component/file-upload/js/intake.mjs, C81), the
// ones sf-file-upload applies, so a list and an image field refuse a file for
// the same reasons. Written here once before; the core module binds nothing,
// so a page with only an image field loads no file area with it.


// The kinds of image that can hold transparent pixels: the field draws the
// checkerboard under them (C86), so a white logo is seen. A JPEG cannot, and
// letterboxing around it is not the picture's.
const MAY_BE_TRANSPARENT = /^image\/(?:png|apng|gif|webp|avif|svg\+xml|x-icon|vnd\.microsoft\.icon)$/u;
const TRANSPARENT_EXTENSION = /\.(?:png|apng|gif|webp|avif|svg|ico)(?:[?#]|$)/iu;

function mayBeTransparent(value) {
  if (!value) return false;
  const mime = String(value.mime || '').toLowerCase();
  if (mime) return MAY_BE_TRANSPARENT.test(mime);
  const href = String(value.href || '');
  const svgData = /^data:image\/svg\+xml[,;]/iu.test(href);
  const pngData = /^data:image\/(?:png|gif|webp|avif)[,;]/iu.test(href);
  return svgData || pngData || TRANSPARENT_EXTENSION.test(String(value.label || '')) || TRANSPARENT_EXTENSION.test(href);
}

const unit = (number) => {
  const value = Number(number);
  return Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0.5;
};

// Reads a list of names (sources, edit) against the names it may hold, in
// their order there. Commas, spaces or both separate them: the docs write
// `device,library,url`, a page may write `device library url` or
// `crop, focus`, and each reads the same.
function listOf(text, known) {
  const asked = String(text ?? '').split(/[\s,]+/u).filter(Boolean);
  return known.filter((name) => asked.includes(name));
}

// A point on the picture, 0..1 across and down: the focal point (C94 point 3).
function normaliseFocus(input) {
  if (!input || typeof input !== 'object') return null;
  return {x: unit(input.x), y: unit(input.y)};
}

// The frame: the aspect it is cut in, the zoom (1..3) and the centre, 0..1.
// The original is kept; the frame is a parameter the server or CDN applies.
const ZOOM_MIN = 1;
const ZOOM_MAX = 3;

function normaliseCrop(input) {
  if (!input || typeof input !== 'object') return null;
  const zoom = Number(input.zoom);
  return {
    aspect: String(input.aspect || ''),
    zoom: Number.isFinite(zoom) ? Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, zoom)) : 1,
    x: unit(input.x),
    y: unit(input.y),
  };
}

// An aspect as CSS writes it, from «16/9», «16:9», «1.91/1» or «1»: «16 / 9».
// Anything else is none.
function aspectRatio(text) {
  const match = /^\s*(\d+(?:\.\d+)?)\s*(?:[/:]\s*(\d+(?:\.\d+)?))?\s*$/u.exec(String(text ?? ''));
  if (!match) return '';
  const width = Number(match[1]);
  const height = match[2] === undefined ? 1 : Number(match[2]);
  return width > 0 && height > 0 ? `${width} / ${height}` : '';
}

// The value is the file shape the Framework already uses for a stored file --
// the property-view `file` type and the field renderers' file cell:
// {value, label, mime, size, href}. `value` is the host's id for the file,
// `label` its name, `size` bytes (a number) or text the host already
// formatted, `href` the address the image is shown from. A string is taken as
// the address alone, which is what a page with nothing but a URL has; JSON in
// the attribute is the whole shape. Anything else is no image: null.
function normaliseImageValue(input) {
  if (input === null || input === undefined || input === '') return null;
  let source = input;
  if (typeof source === 'string') {
    const text = source.trim();
    if (!text) return null;
    if (text.startsWith('{')) {
      try {
        source = JSON.parse(text);
      } catch {
        return null;
      }
    } else {
      source = {href: text};
    }
  }
  if (typeof source !== 'object' || Array.isArray(source)) return null;
  const href = source.href ? String(source.href) : '';
  const label = String(source.label ?? source.name ?? (href ? (0,_core_js_composition_file_size_mjs__WEBPACK_IMPORTED_MODULE_0__.fileNameFromAddress)(href) : ''));
  const id = source.value === undefined || source.value === null ? '' : String(source.value);
  if (!href && !label && !id) return null;
  const value = {
    value: id,
    label,
    mime: String(source.mime ?? source.mimeType ?? ''),
    size: typeof source.size === 'number' ? source.size : String(source.size ?? ''),
    href,
  };
  // What the field knows of the picture beyond the file (C94): its pixels,
  // its description -- or that it is decorative and needs none -- and the
  // focal point and frame chosen in the editor. Each only when it is there,
  // so a value without them reads exactly as it did.
  const width = Number(source.width);
  const height = Number(source.height);
  if (Number.isFinite(width) && width > 0 && Number.isFinite(height) && height > 0) {
    value.width = width;
    value.height = height;
  }
  if (source.alt !== undefined && source.alt !== null) value.alt = String(source.alt);
  if (source.decorative === true) value.decorative = true;
  const focus = normaliseFocus(source.focus);
  if (focus) value.focus = focus;
  const crop = normaliseCrop(source.crop);
  if (crop) value.crop = crop;
  // A file chosen in this page and not stored yet carries the File itself.
  if (source.file) value.file = source.file;
  return value;
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "3694b5e2bf39"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"runtime":{"b":"B","kb":"KB","mb":"MB","gb":"GB"}}');

/***/ },

/***/ "8278668e929b"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases for the shim (core/js/aliases.js, standard simai.smart-component 1.3.8 §16.20). Event rows send the new name first, then the old one, with one detail; setting rows map the old attribute and property to the new; host-attribute rows (no \\"to\\") stay host attributes read by the browser or the base and are listed, refused by the shim on purpose; documentary rows (\\"shim\\": \\"none\\") record a rename the shim cannot serve.","component":"sf-input-image","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"aria-label","to":null,"kind":"attribute","component":"sf-input-image","since":"2026-10-27","remove_after":"2026-12-01","mode":"host-attribute","section":"§3.1","note":"stays a host attribute, read by the base (§3.1, §4.8); no shim"},{"from":"sf-image-field:select","to":"sf-image-field-attach","kind":"event","component":"sf-input-image","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","cancelable":false,"section":"§8, vocabulary 1.1.5 §9.1","note":"the detail keeps file, source, value and name and adds files: the old fields are all there"},{"from":"sf-image-field:remove","to":"sf-image-field-detach","kind":"event","component":"sf-input-image","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","cancelable":false,"section":"§8, vocabulary 1.1.5 §9.1","note":"same detail"},{"from":"sf-image-field:reject","to":"sf-image-field-rejected","kind":"event","component":"sf-input-image","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","cancelable":false,"section":"§8, vocabulary 1.1.5 §9.1","note":"same detail"},{"from":"error","to":"invalid","kind":"setting","component":"sf-input-image","since":"2026-10-27","remove_after":"2026-12-01","section":"§17.2","note":"error is a dated alias of invalid; the attribute and the property write invalid"},{"from":"sf-image-field","to":"sf-input-image","kind":"tag","component":"sf-input-image","since":"2026-11-03","remove_after":"2027-01-01","section":"rename plan R0 (ui-control RENAME-PLAN-2026-11-03), naming decision 2026-11-02","note":"the element is sf-input-image; sf-image-field is a subclass defined beside it until the date"},{"from":"sf-image-field-attach","to":"sf-input-image-attach","kind":"event","component":"sf-input-image","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-image-field-detach","to":"sf-input-image-detach","kind":"event","component":"sf-input-image","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-image-field-library","to":"sf-input-image-library","kind":"event","component":"sf-input-image","since":"2026-11-12","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag; new in 1.4.0, sent under the dated tag too so a page on sf-image-field hears it"},{"from":"sf-image-field-rejected","to":"sf-input-image-rejected","kind":"event","component":"sf-input-image","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"}]}');

/***/ },

/***/ "1a493783d3b8"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.input-image","tag":"sf-input-image","version":"1.10.6","kind":"leaf","settings":{"name":{"type":"string","default":""},"label":{"type":"string","default":""},"hint":{"type":"string","default":""},"help":{"type":"string","default":""},"accept":{"type":"string","default":"image/*"},"max-size":{"type":"number","default":0},"min-width":{"type":"number","default":0},"min-height":{"type":"number","default":0},"size":{"type":"enum","values":["1/3","1/2","1","2","3"],"default":"1"},"layout":{"type":"enum","values":["row","preview"],"default":"row"},"shape":{"type":"enum","values":["square","circle"],"default":"square"},"aspect":{"type":"string","default":""},"fit":{"type":"enum","values":["cover","contain"],"default":"cover"},"sources":{"type":"string","default":"device"},"library-label":{"type":"string","default":""},"edit":{"type":"string","default":""},"alt":{"type":"enum","values":["none","field","required"],"default":"none"},"meta":{"type":"string","default":""},"empty-text":{"type":"string","default":""},"required":{"type":"boolean","default":false},"disabled":{"type":"boolean","default":false},"readonly":{"type":"boolean","default":false},"invalid":{"type":"boolean","default":false},"error-message":{"type":"string","default":""},"uploader":{"type":"object","default":null}},"values":{"value":{"type":"object","nullable":true,"default":null}},"events":{"change":{"carries":{"value":{"type":"object","nullable":true},"file":{"type":"object","nullable":true},"source":{"type":"enum","values":["input","drop","paste","url","alt","edit","remove","upload","cancel"]},"name":"string"}},"input":{"carries":{"value":{"type":"object","nullable":true},"file":{"type":"object","nullable":true},"source":{"type":"enum","values":["input","drop","paste","url","alt","edit","remove","upload","cancel"]},"name":"string"}},"attach":{"carries":{"files":"list","file":"object","source":{"type":"enum","values":["input","drop","paste"]},"value":"object","name":"string"}},"detach":{"carries":{"value":"object","name":"string"}},"rejected":{"carries":{"files":"list","rejected":"list","accept":"string","source":"string"}},"library":{"carries":{"value":{"type":"object","nullable":true},"name":"string"}}},"actions":{"clear":{},"choose":{},"remove-image":{},"take-file":{"with":{"file":"object","source":{"type":"string","optional":true}}},"set-error":{"with":{"message":"string"}}},"form":{"value":"value","name":"name","default":"value","submits":"value","reset":"default","required":"required","disabled":"disabled","readonly":"readonly","validity":["value-missing","custom-error"]},"host-states":{"data-dragged-over":"boolean"},"css-variables":{"--sf-image-field-background-color":{"type":"color","state":"rest"},"--sf-image-field-border-color":{"type":"color","state":"rest"},"--sf-image-field-border-width":{"type":"length"},"--sf-image-field-radius":{"type":"length"},"--sf-image-field-padding-inline":{"type":"length"},"--sf-image-field-padding-block":{"type":"length"},"--sf-image-field-gap":{"type":"length"},"--sf-image-field-thumbnail-size":{"type":"length"},"--sf-image-field-thumbnail-radius":{"type":"length"},"--sf-image-field-thumbnail-background-color":{"type":"color","state":"rest"}}}');

/***/ },

/***/ "6e7f9092a98a"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Image field","runtime":{"alt-hint":"For screen readers and search engines.","alt-hint-required":"A screen reader reads it, and mail shows it when images are off.","alt-label":"Image description","alt-missing":"Describe the image or mark it decorative.","alt-placeholder":"What the picture shows","bytes":"B","cancel-upload":"Cancel","cancel-upload-name":"Cancel the upload","choose":"Choose…","choose-menu":"Choose","choose-name":"Choose an image","chosen-file":"Image chosen: “{name}”","replace-file":"Replace the image “{name}”","remove-file":"Remove the image “{name}”","edit-file":"Edit the frame of “{name}”","cancel-upload-file":"Cancel the upload of “{name}”","retry-file":"Try the upload of “{name}” again","crop":"Frame","crop-hint":"Drag the picture or use the arrows; zoom with the buttons or + and −. Enter to finish, Esc to cancel.","crop-state":"Frame {aspect}, zoom {zoom} %, centre {x} % across, {y} % down","decorative":"Decorative — no description needed","drop":"Drop the file to use it","edit":"Edit","edit-cancel":"Cancel","edit-done":"Done","edit-name":"Edit the frame","edit-title":"Edit the image","empty":"No image chosen","empty-hint":"Drop or paste an image","empty-hint-coarse":"Take a photo or choose one","focus":"Focal point","focus-hint":"Click the main part of the picture or move the point with the arrows: it stays in the frame at any width.","focus-state":"Focal point: {x} % across, {y} % down","formats-audio":"audio","formats-image":"images","formats-video":"video","gigabytes":"GB","group":"Image","kilobytes":"KB","megabytes":"MB","reject-count":"“{name}” was not added: this field holds one image","reject-empty":"“{name}” is empty","reject-min-height":"“{name}” is {width}×{height} px; it must be at least {min} px high","reject-min-width":"“{name}” is {width}×{height} px; it must be at least {min} px wide","reject-size":"“{name}” is {size}; the limit is {max}","reject-type":"“{name}” is not accepted: allowed {formats}","reject-unreadable":"“{name}” does not open as an image","rejected":"This file is not accepted","remove":"Remove","remove-name":"Remove the image","removed":"Image removed","replace":"Replace…","replace-menu":"Replace","replace-name":"Replace the image","retry":"Try again","retry-name":"Try the upload again","source-device":"From this computer","source-device-coarse":"From this device","source-library":"From the library","source-url":"By address","sources-name":"Where to take the image from","stage-name":"frame","taken-first":"The first image of {n} was taken: this field holds one","upload-cancelled":"Upload cancelled","upload-failed-line":"Not uploaded: {message}","upload-failed-plain":"Not uploaded","upload-failed-validity":"The image was not uploaded: try again or choose another","upload-name":"Uploading {name}","uploaded":"Image uploaded","uploading":"Uploading · {n} %","uploading-plain":"Uploading…","url-close":"Close the address field","url-failed":"The image at this address could not be opened. Check the address.","url-label":"Image address","url-take":"Use","value-missing":"Choose an image.","wait-for-upload":"Wait until the image is uploaded","zoom-in":"Zoom in","zoom-out":"Zoom out","help":"More about: {label}"}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("f99166b49d53");
/******/
/******/ })()
;