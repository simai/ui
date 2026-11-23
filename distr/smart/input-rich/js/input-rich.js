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

/***/ "1412c5875b4d"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RELATIVE: () => (/* binding */ RELATIVE),
/* harmony export */   densityOf: () => (/* binding */ densityOf),
/* harmony export */   drawing: () => (/* binding */ drawing),
/* harmony export */   followDensity: () => (/* binding */ followDensity),
/* harmony export */   markRelativeSizes: () => (/* binding */ markRelativeSizes),
/* harmony export */   noteAuthored: () => (/* binding */ noteAuthored),
/* harmony export */   sizeOf: () => (/* binding */ sizeOf),
/* harmony export */   sizeStep: () => (/* binding */ sizeStep),
/* harmony export */   sizedBefore: () => (/* binding */ sizedBefore)
/* harmony export */ });
// Density (owner decision C22, 2026-11-09). data-sf-density="compact" on the
// root or on a container moves every component one ladder step down; the CSS
// does it (core/scss/_sf_css__density.scss): each step variable holds the step
// below. An explicit size is a step on the region's ladder (owner decision
// C79, 2026-11-12, changing C22): it comes down with the region, and only
// data-sf-density="normal" takes the normal ladder back.
//
// A size a component's template gives an element it draws (sf-input's clear
// button, a pager's buttons, a submenu) is relative to the component's own
// size; those are still marked data-sf-size-relative once the component has
// drawn. Since C79 the density CSS treats both alike; the mark stays a
// published runtime mark (host-runtime-marks) for hosts that read it.
//
// What a component holds of the page's own (captured slot content, children
// left in place) keeps its size explicit. The store is on the shared global:
// every bundle carries its own copy of this module.
const store = () => {
  const SF = globalThis.SF = globalThis.SF || {};
  const internal = SF.__internal || (SF.__internal = {});
  return internal.density ||= {
    authored: new WeakSet(),
    depth: 0
  };
};

const RELATIVE = 'data-sf-size-relative'; // Page content a component captured to place in its own drawing. Content a
// template hands to a child while it draws is the template's, not the page's.

function noteAuthored(nodes) {
  const state = store();
  if (state.depth > 0) return;

  for (const node of nodes) if (node && typeof node === 'object') state.authored.add(node);
}
function drawing(callback) {
  const state = store();
  state.depth += 1;

  try {
    return callback();
  } finally {
    state.depth -= 1;
  }
} // The sized elements present before a host first draws are the page's.
// A printed first-paint picture is the drawing's, not the page's.

function sizedBefore(host) {
  return new Set(Array.from(host.querySelectorAll?.('[size]') ?? []).filter(element => {
    const picture = element.closest('[data-sf-static]');
    return !picture || !host.contains(picture);
  }));
} // After a host drew: every sized element its drawing holds that is not the
// page's is relative to the host.

function markRelativeSizes(host, before = null) {
  const {
    authored
  } = store();

  for (const element of host.querySelectorAll?.('[size]') ?? []) {
    if (element.hasAttribute(RELATIVE) || before?.has(element)) continue;
    let node = element;
    let page = false;

    while (node && node !== host) {
      if (authored.has(node)) {
        page = true;
        break;
      }

      node = node.parentNode;
    }

    if (!page) element.setAttribute(RELATIVE, '');
  }
} // A popup a component builds itself and places outside its own box (a menu on
// <body>, in an open dialog): sized from the component, so relative, and in
// the component's density, not the density of where it was placed.

function followDensity(element, from) {
  if (!element?.setAttribute) return element;
  if (element.hasAttribute('size')) element.setAttribute(RELATIVE, '');
  const density = densityOf(from);
  if (density) element.setAttribute('data-sf-density', density);else element.removeAttribute('data-sf-density');
  return element;
} // The density an element stands in: the nearest region's (an explicit size
// follows its region since C79); null outside any.

function densityOf(from) {
  for (let node = from; node?.nodeType === 1; node = node.parentElement) {
    if (node.hasAttribute('data-sf-density')) return node.getAttribute('data-sf-density');
  }

  return null;
} // The size step of the control a popup opens from (owner remark 2026-11-15:
// the row menu of a table of size 1 opened at 1/2). A popup a component
// builds outside itself -- a menu on <body> or in the open dialog -- stood on
// the default step whatever opened it. The step is the first size written
// from the opener up: the opener's own (a row's «⋯», the native button an
// sf-button draws), else its component's, else the Smart component that
// holds it (sf-view-table size="1"). A size a template gave a part it draws
// (data-sf-size-relative) follows its host, so the walk goes on past it. It
// ends on the default step (null) at the second custom element without a
// size: the opener's own component may stand on its default, the host
// holding it decides.

function sizeOf(from) {
  let own = true;

  for (let node = from; node?.nodeType === 1; node = node.parentElement) {
    if (node.hasAttribute('size')) {
      if (!node.hasAttribute(RELATIVE)) return node.getAttribute('size');
      continue;
    }

    if (!node.localName.includes('-')) continue;
    if (!own) return null;
    own = false;
  }

  return null;
} // A size step as a number of the ladder ("1/2" is 0.5, "2" is 2); NaN for
// anything else.

function sizeStep(size) {
  const [top, bottom = '1'] = String(size ?? '').trim().split('/');
  const step = Number(top) / Number(bottom);
  return top !== '' && Number.isFinite(step) && step > 0 ? step : Number.NaN;
}

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

/***/ "2db3a835ac11"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   actionEntry: () => (/* binding */ actionEntry),
/* harmony export */   chooseBeside: () => (/* binding */ chooseBeside),
/* harmony export */   controlOf: () => (/* binding */ controlOf),
/* harmony export */   drawnBox: () => (/* binding */ drawnBox),
/* harmony export */   fitBesideMore: () => (/* binding */ fitBesideMore),
/* harmony export */   fitByPriority: () => (/* binding */ fitByPriority),
/* harmony export */   fitInOrder: () => (/* binding */ fitInOrder),
/* harmony export */   isMainAction: () => (/* binding */ isMainAction),
/* harmony export */   isPressed: () => (/* binding */ isPressed),
/* harmony export */   layoutActionRow: () => (/* binding */ layoutActionRow),
/* harmony export */   layoutHeight: () => (/* binding */ layoutHeight),
/* harmony export */   layoutRowRoom: () => (/* binding */ layoutRowRoom),
/* harmony export */   layoutWidth: () => (/* binding */ layoutWidth),
/* harmony export */   measureShown: () => (/* binding */ measureShown),
/* harmony export */   openRowMenu: () => (/* binding */ openRowMenu),
/* harmony export */   readPriority: () => (/* binding */ readPriority),
/* harmony export */   rowRoom: () => (/* binding */ rowRoom),
/* harmony export */   spanOf: () => (/* binding */ spanOf),
/* harmony export */   spanOfUnits: () => (/* binding */ spanOfUnits),
/* harmony export */   squeezeStep: () => (/* binding */ squeezeStep),
/* harmony export */   standardMenu: () => (/* binding */ standardMenu),
/* harmony export */   textWidth: () => (/* binding */ textWidth),
/* harmony export */   triggerExtra: () => (/* binding */ triggerExtra)
/* harmony export */ });
/* harmony import */ var _density_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("1412c5875b4d");
// One row of items that do not all fit, and a trailing «Ещё (n)» that holds
// the rest (owner decision C54): the items in their order up to the first
// that does not fit, each whole in the row or in «Ещё»; the items that must
// stay (the current one, the pinned ones) stay, the last kept others giving
// way to them; the room is taken with the width «Ещё (n)» will have with its
// own count. Only the arithmetic and the measuring are here -- the element
// keeps its markup, its classes and its menu entries.
//
// Taken out of sf-tabs (fix/tabs-overflow-more, C54 and its returns D1, D2)
// so a second row (sf-contents layout="bar", CT-05) lays out by the same
// rules instead of a copy of them. Every number is a width in CSS pixels,
// fractional; half a pixel is the tolerance, as the tabs measured it.

const TOLERANCE = 0.5; // The items in their order up to the first that does not fit in available:
// their indices, or null when every item fits.

function fitInOrder(widths, gap, available) {
  const kept = [];
  let used = 0;

  for (let at = 0; at < widths.length; at += 1) {
    const next = used + (kept.length ? gap : 0) + widths[at];
    if (next > available + TOLERANCE) break;
    kept.push(at);
    used = next;
  }

  return kept.length === widths.length ? null : kept;
} // The width of some items laid side by side.

function spanOf(widths, gap, indices) {
  return indices.reduce((sum, at, n) => sum + widths[at] + (n ? gap : 0), 0);
} // The row beside «Ещё», in available: the items in order, then the items that
// must stay put back in -- the last kept items that need not stay give way to
// them, and when the must-stay items alone do not fit, they give way too, the
// last first, but never the current one.

function chooseBeside({
  widths,
  gap = 0,
  available,
  must = [],
  current = -1
}) {
  let chosen = fitInOrder(widths, gap, available) ?? widths.map((_, at) => at);
  const missing = must.filter(at => !chosen.includes(at));
  if (!missing.length) return chosen;
  const next = [...chosen, ...missing];

  while (spanOf(widths, gap, next) > available + TOLERANCE) {
    const dropAt = next.slice().reverse().find(at => !must.includes(at)) ?? next.slice().reverse().find(at => at !== current);
    if (dropAt === undefined) break;
    next.splice(next.indexOf(dropAt), 1);
  }

  chosen = next.sort((a, b) => a - b);
  return chosen;
} // The row beside «Ещё (n)»: room is the row's room with the trigger standing
// as it is drawn now; extra(count) is how much wider (or narrower) the
// trigger will be with count in it. Of the rows that fit beside their own
// count, the one with the most items; when no count agrees with its row, the
// row that fits beside the widest. squeezed is the current item when it alone
// is left and still wider than the room (it alone may be shortened), else -1.

function fitBesideMore({
  widths,
  gap = 0,
  room,
  must = [],
  current = -1,
  extra = null
}) {
  let kept = null;

  if (typeof extra === 'function') {
    const besides = [];

    for (let count = 1; count < widths.length && !kept; count += 1) {
      const more = extra(count);
      besides.push(more);
      const chosen = chooseBeside({
        widths,
        gap,
        available: room - more,
        must,
        current
      });
      if (widths.length - chosen.length === count) kept = chosen;
    }

    if (!kept && besides.length) kept = chooseBeside({
      widths,
      gap,
      available: room - Math.max(...besides),
      must,
      current
    });
  }

  kept ??= chooseBeside({
    widths,
    gap,
    available: room,
    must,
    current
  });
  const squeezed = kept.length === 1 && kept[0] === current && spanOf(widths, gap, kept) > room + TOLERANCE ? current : -1;
  return {
    kept,
    squeezed
  };
} // The current tab alone beside «Ещё» and still wider than the row (squeezed
// above): how it gives way (group build 16 returns GB16-1 and GB16-2, DEV's
// answer to question 1, 2026-11-22). It is shortened with an ellipsis while at
// least two letters stay before it; below that a tab with an icon draws its
// icon alone -- the whole glyph and the tab's padding, never a cut glyph or a
// one-letter stub -- and a tab of words keeps two letters and the ellipsis.
// When even that does not stand beside «Ещё (n)», the trigger gives way: it
// draws its glyph alone as a square (its words stay its name, as shrink="icon"
// does, C370). The current tab never goes into «Ещё».
//   tabRoom: the width the tab can have beside the trigger as it will be;
//   textRoom: the label's own width there; twoLetters: the label's width with
//   two letters and the ellipsis; iconOnly: the tab's width with its icon
//   alone, or null for a tab without one; moreGain: how much narrower the
//   trigger is with its glyph alone; compactTextRoom: the label's width
//   beside the trigger drawn as its glyph alone (measured; else textRoom and
//   the gain).
// The label is decided again beside the glyph-alone trigger before the tab
// gives up its words (group build 16 return GB16-5, 2026-11-22): the trigger
// keeps its name out of sight and as a tooltip, the current tab's name is the
// row's content -- an icon beside a bare chevron with 40-96 px empty and the
// whole name fitting there read as a fault. So: two letters or more beside
// «Ещё (n)»; else two letters or more (up to the whole word) beside the
// glyph alone; else the icon alone, the trigger keeping its words while the
// icon stands beside them; a tab of words keeps two letters.
// Answers {icon, compact}: the tab draws its icon alone; the trigger its glyph.

function squeezeStep({
  tabRoom,
  textRoom,
  twoLetters,
  iconOnly = null,
  moreGain = 0,
  compactTextRoom = null
}) {
  if (textRoom + TOLERANCE >= twoLetters) return {
    icon: false,
    compact: false
  };
  const besideGlyph = compactTextRoom ?? textRoom + moreGain;
  if (moreGain > 0 && besideGlyph + TOLERANCE >= twoLetters) return {
    icon: false,
    compact: true
  };
  if (iconOnly !== null) return {
    icon: true,
    compact: tabRoom + TOLERANCE < iconOnly && moreGain > 0
  };
  return {
    icon: false,
    compact: moreGain > 0
  };
} // The content box of a row that clips and has no scrollbar, in fractional
// pixels: clientWidth is a whole pixel, and a row 383.6 px wide read as 383 or
// 384 laid out differently (C54 return).

function rowRoom(list) {
  const style = getComputedStyle(list);
  const edges = ['borderInlineStartWidth', 'borderInlineEndWidth', 'paddingInlineStart', 'paddingInlineEnd'];
  return list.getBoundingClientRect().width - edges.reduce((sum, edge) => sum + (parseFloat(style[edge]) || 0), 0);
} // The width an element is laid out at, in fractional CSS pixels, before any
// transform of it or of an ancestor (its border box). getBoundingClientRect is
// a screen box: inside scale(.7) a 90 px tab reads 63, inside rotate() it reads
// the width of its rotated bounding box, and a row that compares such widths
// with its padding, a text measured in canvas or a ResizeObserver size mixes
// screen and layout pixels (docs hero study 2026-11-19, section 9). The used
// width of the computed style is the layout's own, with its fractions; a box
// without one (an inline box, an element not drawn) gives offsetWidth.

function layoutWidth(element) {
  if (!element) return 0;
  const style = getComputedStyle(element);
  const width = parseFloat(style.width);
  if (!Number.isFinite(width)) return element.offsetWidth || 0;
  if (style.boxSizing === 'border-box') return width;
  return ['paddingLeft', 'paddingRight', 'borderLeftWidth', 'borderRightWidth'].reduce((sum, edge) => sum + (parseFloat(style[edge]) || 0), width);
} // The block size of the same box (layoutWidth's other axis).

function layoutHeight(element) {
  if (!element) return 0;
  const style = getComputedStyle(element);
  const height = parseFloat(style.height);
  if (!Number.isFinite(height)) return element.offsetHeight || 0;
  if (style.boxSizing === 'border-box') return height;
  return ['paddingTop', 'paddingBottom', 'borderTopWidth', 'borderBottomWidth'].reduce((sum, edge) => sum + (parseFloat(style[edge]) || 0), height);
} // rowRoom in layout pixels: the row's content box before any transform, for a
// row whose items are measured with layoutWidth.

function layoutRowRoom(list) {
  const style = getComputedStyle(list);
  const edges = ['borderInlineStartWidth', 'borderInlineEndWidth', 'paddingInlineStart', 'paddingInlineEnd'];
  return layoutWidth(list) - edges.reduce((sum, edge) => sum + (parseFloat(style[edge]) || 0), 0);
} // A text measurer in an element's own face, or null without a canvas: the
// width «Ещё (7)» will have before its button draws it.

let measureCanvas = null;
function textWidth(element) {
  const style = getComputedStyle(element);
  measureCanvas ??= globalThis.document?.createElement('canvas') ?? null;
  const context = measureCanvas?.getContext?.('2d');
  if (!context) return null;
  context.font = style.font;
  if ('letterSpacing' in context) context.letterSpacing = style.letterSpacing === 'normal' ? '0px' : style.letterSpacing;
  return text => context.measureText(text).width;
} // extra(count) for a trigger whose text box shows label(count) now.

function triggerExtra(textBox, label) {
  const measure = textBox ? textWidth(textBox) : null;
  if (!measure) return null;
  const drawn = measure(textBox.textContent.trim());
  return count => measure(label(count)) - drawn;
} // The standard menu «Ещё» opens: sf-menu-context, a relation fetched when
// first used (SF.Loader.ensure: asked for, waited for up to 3 s, never
// thrown), one per owner and field, on the body or in the open dialog. The
// one copy in core (defect TL-8): the sortable inserter and the handle's move
// menu place theirs through it too. null when no sf-menu-context came (no
// Loader, or the relation failed): an element that never upgrades opens
// nothing. setup(menu) runs once on a new menu, for the listeners an owner
// adds beside select.

async function standardMenu(owner, field, select, {
  setup
} = {}) {
  await globalThis.SF?.Loader?.ensure?.(['sf-menu-context']);
  if (owner[field]?.isConnected) return owner[field];
  if (!globalThis.customElements?.get('sf-menu-context')) return null;
  const doc = owner.ownerDocument || globalThis.document;
  const menu = doc.createElement('sf-menu-context');
  menu.setAttribute('popup', '');
  if (select) menu.addEventListener('sf-menu-context-select', event => select(event.detail?.id, event));
  setup?.(menu);
  (owner.closest('dialog[open]') || doc.body).append(menu);
  owner[field] = menu;
  return menu;
} // ─── Rows of actions and tools (owner decision C155, 2026-11-14) ─────────────
// The one row engine of the Framework: the navigation rows above (sf-tabs,
// sf-contents, sf-menu) and the action and tool rows below (sf-header-page's
// actions, sf-input-rich's toolbar, .sf-button-group) share the measuring and
// the rule. What does not fit leaves for «Ещё»: from the end by default, by
// an author's priority where one is given (priority="1" is the most important,
// a bigger number leaves sooner, an item without one before every numbered
// item); the main action, a pressed or current item and priority="pin" never
// leave (C155 (3)). A toolbar's units are its groups: a group leaves whole and
// takes its separator with it (C155 (4)).
// An author's priority as the engine reads it: a whole number from 1, pin, or
// nothing (leaves first, the last first).

function readPriority(value) {
  if (value === null || value === undefined) return {
    rank: Infinity,
    pin: false
  };
  const text = String(value).trim().toLowerCase();
  if (text === 'pin') return {
    rank: 0,
    pin: true
  };
  const number = Number(text);
  return Number.isFinite(number) && text !== '' ? {
    rank: number,
    pin: false
  } : {
    rank: Infinity,
    pin: false
  };
} // The span of some units laid side by side: their widths, the row's gap
// between neighbours and, where two neighbours belong to different groups, a
// separator with the gap on each of its sides.

function spanOfUnits(units, gap, separator, indices) {
  let span = 0;
  indices.forEach((at, n) => {
    if (n) {
      span += gap;
      if (separator && units[indices[n - 1]].group !== units[at].group) span += separator + gap;
    }

    span += units[at].width;
  });
  return span;
} // Which units stay in a row that is room wide. units: [{width, rank, pin,
// group}] in the row's order; more: the width «Ещё» adds when it shows (its
// own width, the gap before it and, in a toolbar, its separator). Answers the
// indices that stay, in order, and the ones that left; every unit stays when
// all fit. The units that leave go by rank, the biggest first, and among equal
// ranks the last first; a pinned unit never leaves, even when the pinned ones
// alone do not fit (the row then clips, as a current tab is squeezed).

function fitByPriority({
  units,
  gap = 0,
  separator = 0,
  room,
  more = 0
}) {
  const all = units.map((_, at) => at);
  const whole = spanOfUnits(units, gap, separator, all);
  if (whole <= room + TOLERANCE) return {
    kept: all,
    out: [],
    span: whole,
    fits: true
  };
  const order = all.filter(at => !units[at].pin).sort((a, b) => units[b].rank - units[a].rank || b - a);
  const kept = all.slice();
  const out = [];

  const used = () => spanOfUnits(units, gap, separator, kept) + (kept.length ? more : more - gap);

  while (order.length && used() > room + TOLERANCE) {
    const at = order.shift();
    kept.splice(kept.indexOf(at), 1);
    out.push(at);
  }

  const span = used();
  return {
    kept,
    out: out.sort((a, b) => a - b),
    span,
    fits: span <= room + TOLERANCE
  };
} // The box an element draws: a Framework host with display: contents (sf-button,
// sf-button-icon) has none of its own, so its first drawn child's.

function drawnBox(element) {
  let box = element;

  while (box && getComputedStyle(box).display === 'contents') box = box.firstElementChild;

  return box ? box.getBoundingClientRect() : {
    width: 0,
    height: 0,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  };
} // Every element's drawn width with all of them shown, in one task: the class
// that takes an element out of the row is lifted for the measure and put back
// before anything is painted (the row never draws all its items at once).

function measureShown(elements, outClass) {
  const was = elements.map(element => element.classList.contains(outClass));

  for (const element of elements) element.classList.remove(outClass);

  const widths = elements.map(element => drawnBox(element).width);
  elements.forEach((element, at) => element.classList.toggle(outClass, was[at]));
  return widths;
} // A row of actions or tools laid out by the rule above, in one task.
// row: the flex row; units: [{element, rank, pin, group}]; more: the «Ещё»
// element (inside the row, last); moreSeparator: a separator before it (a
// toolbar's), separators: [{element, after: group}] -- a separator standing
// after a group, shown only between two groups that keep something; outClass:
// the row's own class that takes an element out (display: none); room: the
// room the row has, when it is not the row's own content box (a row sized by
// its content). Answers {out: the indices that left, fits: whether what
// stays fits the room}.

function layoutActionRow({
  row,
  units,
  more,
  moreSeparator = null,
  separators = [],
  outClass,
  room = null
}) {
  const style = getComputedStyle(row);
  const gap = parseFloat(style.columnGap) || 0;
  const elements = units.map(unit => unit.element);
  const extra = [more, moreSeparator, ...separators.map(one => one.element)].filter(Boolean);
  const widths = measureShown([...elements, ...extra], outClass);
  const moreWidth = widths[elements.length];
  const separatorWidth = separators.length || moreSeparator ? Math.max(0, ...widths.slice(elements.length + 1)) : 0;
  const measured = units.map((unit, at) => ({ ...unit,
    width: widths[at]
  }));
  const {
    out,
    fits
  } = fitByPriority({
    units: measured,
    gap,
    separator: separatorWidth,
    room: room ?? rowRoom(row),
    more: moreWidth + gap + (moreSeparator ? separatorWidth + gap : 0)
  });
  const gone = new Set(out);
  elements.forEach((element, at) => element.classList.toggle(outClass, gone.has(at))); // A separator stands after its group only while that group and a group
  // after it both keep something: an emptied group leaves with its separator,
  // and none stands first or last.

  const keeps = group => units.some((unit, at) => unit.group === group && !gone.has(at));

  const groups = [...new Set(units.map(unit => unit.group))];

  for (const {
    element,
    after
  } of separators) {
    const later = groups.slice(groups.indexOf(after) + 1);
    element.classList.toggle(outClass, !(keeps(after) && later.some(keeps)));
  }

  more?.classList.toggle(outClass, !out.length);
  moreSeparator?.classList.toggle(outClass, !out.length || gone.size === units.length);
  return {
    out,
    fits
  };
} // ─── «Ещё» of an action or tool row ──────────────────────────────────────────
// Whether an action is the row's main one: a filled sf-button (no appearance,
// or default) -- one per row (C116, C161 (3)).

function isMainAction(element) {
  if (!element?.matches?.('sf-button, .sf-button')) return false;
  const look = element.getAttribute('appearance') ?? element.getAttribute('variant');
  return look === null || look === '' || look === 'default' || look === 'filled';
} // Whether a toggle in a row is on: a pressed sf-button or icon button, or a
// button saying aria-pressed="true".

function isPressed(element) {
  if (!element) return false;
  const value = element.getAttribute('pressed');
  if (value !== null && value !== 'false') return true;
  return element.getAttribute('aria-pressed') === 'true' || element.querySelector?.(':scope > button[aria-pressed="true"]') != null;
} // The control a row item is pressed through: its own button or link.

function controlOf(element) {
  if (!element) return null;
  if (element.matches('button, a[href]')) return element;
  return element.querySelector(':scope > button, :scope > a[href], button, a[href]') || element;
} // The menu row an action of a row becomes in «Ещё»: its words, its icon, and
// a check when it is a pressed toggle (C155 (6), (7)).

function actionEntry(element, id) {
  const control = controlOf(element);
  const text = (element.getAttribute('text') || element.getAttribute('aria-label') || element.getAttribute('title') || control?.getAttribute('aria-label') || element.textContent || '').trim();
  const icon = element.getAttribute('icon-start') || element.getAttribute('icon') || element.getAttribute('icon-end') || control?.querySelector?.('.sf-icon')?.textContent.trim() || undefined;
  const entry = {
    id: String(id),
    text,
    icon: icon || undefined
  };
  const toggle = element.hasAttribute('pressed') || control?.hasAttribute?.('aria-pressed');

  if (toggle) {
    entry.kind = 'check';
    entry.checked = isPressed(element);
  }

  if (element.hasAttribute('disabled') || control?.disabled || control?.getAttribute?.('aria-disabled') === 'true') entry.disabled = true;
  return entry;
} // The «Ещё» menu of a row: the standard sf-menu-context (standardMenu), named
// «Ещё», on the row's size and density, listing entries; toggled from anchor.

async function openRowMenu(owner, {
  anchor,
  entries,
  select,
  label,
  size = '1'
}) {
  if (!entries.length) return null;
  const menu = await standardMenu(owner, '_sfRowMoreMenu', (id, event) => owner._sfRowMoreSelect?.(id, event));
  if (!menu) return null;
  owner._sfRowMoreSelect = select;
  if (label) menu.setAttribute('aria-label', label);
  menu.setAttribute('size', size);
  (0,_density_js__WEBPACK_IMPORTED_MODULE_0__.followDensity)(menu, owner);
  menu.entries = entries;
  menu.toggleFor(anchor);
  return menu;
}

/***/ },

/***/ "557c99eb8f3a"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   focusTarget: () => (/* binding */ focusTarget),
/* harmony export */   roving: () => (/* binding */ roving)
/* harmony export */ });
// One Tab stop for a row of controls, and the arrows between them (owner
// decision C184 (1)-(3), 2026-11-14; study control/research/2026-11-14-
// toolbar-menu-open.md, K-02). A toolbar is not a component of its own
// (C155 (8): no sf-toolbar): it is ordinary sf-button-icon groups, 4 apart
// inside a group and a separator between groups (C144), and this helper gives
// them the keyboard of the WAI-ARIA toolbar pattern:
//
// - the row is one Tab stop; Tab comes back to the control the person left
//   (memory, C184 (3)), or to the first one (memory: false);
// - the arrows of the row's orientation move between the controls, in the
//   row's direction (right-to-left reverses ← and →), Home and End go to the
//   ends, and the walk wraps;
// - a control that cannot be used now (aria-disabled) stays in the walk,
//   dimmed by its component, with its reason as a tooltip (C184 (2), as
//   C164 (4) does for a menu row); disabled: 'skip' leaves it out. A control
//   with the native disabled attribute cannot take the focus and is skipped;
// - a control inside «Ещё» (the C155 row engine marks the part that left the
//   row with .out or [hidden]) is not in the walk;
// - ↓ (↑) on a menu button of a horizontal row opens its menu, as the
//   pattern's menu button does.
//
// It is also the list's keyboard (C184 (5)): a list is one Tab stop and ↑ ↓
// move between its rows (orientation 'vertical').
//
// roving(container, options) -> {refresh, set, current, items, destroy}.
// The look stays with the components; this module holds no state of its own
// outside the controller it returns, so every bundle may carry its own copy.
const NATIVE_FOCUSABLE = 'button, a[href], input, select, textarea, [tabindex], [contenteditable=""], [contenteditable="true"]';
const OUT = '.out, [hidden], [data-sf-out], [inert]'; // The element that takes the focus for an item: the item itself when it can
// (a <button>, a row with a tabindex), else the control inside it -- an
// sf-button-icon host draws a <button> and is display: contents.

function focusTarget(item) {
  if (!item) return null;
  if (item.matches?.(NATIVE_FOCUSABLE)) return item;
  return item.querySelector?.('button, a[href], [role="button"], [tabindex]') ?? item;
}

const isUnavailable = target => target.getAttribute?.('aria-disabled') === 'true';

const isDisabled = target => Boolean(target.disabled) || target.matches?.(':disabled');

function roving(container, {
  items: itemsOf = 'button',
  orientation = 'horizontal',
  wrap = true,
  disabled = 'focusable',
  memory = true,
  out = OUT,
  onMove = null,
  observe = true
} = {}) {
  let current = null; // Every item of the row, in order, as the targets that take the focus.

  const all = () => {
    const found = typeof itemsOf === 'function' ? itemsOf() : [...container.querySelectorAll(itemsOf)];
    const targets = [];

    for (const item of found) {
      const target = focusTarget(item);
      if (!target || !container.contains(target) || targets.includes(target)) continue; // Out of the row: a part inside it that left (into «Ещё») or is
      // hidden. The row itself being hidden for now does not count.

      const away = target.closest(out);
      if (away && away !== container && container.contains(away)) continue;
      targets.push(target);
    }

    return targets;
  }; // The items the walk stops on.


  const items = () => all().filter(target => !isDisabled(target) && (disabled === 'focusable' || !isUnavailable(target)));

  function set(element) {
    const target = focusTarget(element);
    const every = all();
    if (!target || !every.includes(target)) return;
    current = target;

    for (const other of every) {
      const next = other === target ? '0' : '-1';
      if (other.getAttribute('tabindex') !== next) other.setAttribute('tabindex', next);
    }
  } // After a drawing or a change of the row: the one Tab stop is the item
  // remembered, or the first one when it is gone (or the row forgets).


  function refresh() {
    const list = items();

    if (!list.length) {
      // Nothing to stop on: no item keeps a stop either (a disabled field's
      // toolbar is not a Tab stop).
      for (const other of all()) if (other.getAttribute('tabindex') !== '-1') other.setAttribute('tabindex', '-1');

      current = null;
      return;
    }

    set(current && list.includes(current) ? current : list[0]);
  }

  const vertical = orientation === 'vertical';
  const both = orientation === 'both';

  function onKeydown(event) {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
    const list = items();
    const target = list.find(one => one === event.target || one.contains(event.target));
    if (!target) return; // A field inside an item (a link's address) keeps its own keys.

    if (event.target !== target && event.target.matches?.('input, textarea, select, [contenteditable="true"], [contenteditable=""]')) return;
    const rtl = getComputedStyle(container).direction === 'rtl';
    const forward = vertical ? ['ArrowDown'] : both ? ['ArrowDown', rtl ? 'ArrowLeft' : 'ArrowRight'] : [rtl ? 'ArrowLeft' : 'ArrowRight'];
    const back = vertical ? ['ArrowUp'] : both ? ['ArrowUp', rtl ? 'ArrowRight' : 'ArrowLeft'] : [rtl ? 'ArrowRight' : 'ArrowLeft'];
    const at = list.indexOf(target);
    let next = null;

    if (!vertical && !both && (event.key === 'ArrowDown' || event.key === 'ArrowUp') && target.getAttribute('aria-haspopup') === 'menu' && !isUnavailable(target)) {
      event.preventDefault();
      target.click();
      return;
    }

    if (forward.includes(event.key)) next = at + 1 < list.length ? list[at + 1] : wrap ? list[0] : null;else if (back.includes(event.key)) next = at > 0 ? list[at - 1] : wrap ? list[list.length - 1] : null;else if (event.key === 'Home') next = list[0];else if (event.key === 'End') next = list[list.length - 1];else return;
    event.preventDefault();
    if (!next || next === target) return;
    set(next);
    next.focus();
    onMove?.(next, event.key);
  }

  function onFocusIn(event) {
    const target = all().find(one => one === event.target);
    if (!target || target === current) return;
    set(target);
    onMove?.(target, 'focus');
  }

  function onFocusOut(event) {
    if (memory || container.contains(event.relatedTarget)) return;
    const list = items();
    if (list.length) set(list[0]);
  }

  container.addEventListener('keydown', onKeydown);
  container.addEventListener('focusin', onFocusIn);
  container.addEventListener('focusout', onFocusOut); // Items drawn later -- a host that draws its <button> on its own schedule
  // (sf-button-icon), a row added -- join the walk with tabindex -1 at once:
  // the row stays one Tab stop whatever draws when.

  let queued = false;
  const watcher = observe && typeof MutationObserver === 'function' ? new MutationObserver(() => {
    if (queued) return;
    queued = true;
    queueMicrotask(() => {
      queued = false;
      refresh();
    });
  }) : null;
  watcher?.observe(container, {
    childList: true,
    subtree: true
  });
  refresh();
  return {
    refresh,
    set,
    items,

    get current() {
      return current;
    },

    destroy() {
      watcher?.disconnect();
      container.removeEventListener('keydown', onKeydown);
      container.removeEventListener('focusin', onFocusIn);
      container.removeEventListener('focusout', onFocusOut);
    }

  };
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (roving);

/***/ },

/***/ "76b2d9a8d7c6"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   COUNT_FROM: () => (/* binding */ COUNT_FROM),
/* harmony export */   charCount: () => (/* binding */ charCount),
/* harmony export */   countAnnouncement: () => (/* binding */ countAnnouncement),
/* harmony export */   countLimit: () => (/* binding */ countLimit)
/* harmony export */ });
// The character count of a text field with a limit (owner decision C141 (1),
// the rule sf-chat-composer keeps in ui-pro): one rule for every field that
// counts, so the message box, the multi-line field and the formatted text
// say the same thing at the same moment.
//
// - The count shows from 80 % of the limit (0.8 x limit characters and
//   more: at 80 of 100), or always when the field asks for it (`counter`).
// - Past the limit the count and the field's frame are the error colour and
//   the field is invalid (too-long), so its form is not sent; the text is
//   never cut: the person decides what to take out.
// - A polite line speaks only when a threshold is crossed (near, over, back
//   under), never on every key.
//
// The field draws the count at the end of its message line (the hint's or
// the error's), in the message's text and colour with digits of one width.

/** The share of the limit from which the count shows. */
const COUNT_FROM = 0.8;
/** A limit as a positive whole number, or null when there is none. */

function countLimit(value) {
  const number = Math.trunc(Number(value));
  return Number.isFinite(number) && number > 0 ? number : null;
}
/**
 * Where a text of `length` characters stands against `limit`:
 * {limit, length, near, over, shown, level}. `level` is '', 'near' or
 * 'over'; `shown` says whether the count is drawn (near, over, or `always`).
 * Without a limit nothing is counted.
 */

function charCount(length, limit, {
  always = false
} = {}) {
  const max = countLimit(limit);
  const count = Math.max(0, Number(length) || 0);
  if (max === null) return {
    limit: null,
    length: count,
    near: false,
    over: false,
    shown: false,
    level: ''
  };
  const near = count >= max * COUNT_FROM;
  const over = count > max;
  return {
    limit: max,
    length: count,
    near,
    over,
    shown: Boolean(always) || near,
    level: over ? 'over' : near ? 'near' : ''
  };
}
/**
 * What the polite line says now: the count's words when its level changed
 * since `lastLevel`, else `lastSaid` as it was. Returns {level, said}; the
 * component keeps both for the next call.
 */

function countAnnouncement(state, lastLevel, lastSaid, words) {
  if (state.level === (lastLevel || '')) return {
    level: state.level,
    said: lastSaid || ''
  };
  return {
    level: state.level,
    said: state.level ? words(state) : ''
  };
}

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

/***/ "a07d0671bd60"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _component_field_size__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("e6d86f2cd058");
/* harmony import */ var _core_js_files_drop_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("3180ca98c567");
/* harmony import */ var _helpers_form_field__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("38ea8d53f301");
/* harmony import */ var _helpers_char_count__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("76b2d9a8d7c6");
/* harmony import */ var _core_js_overflow_row_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("2db3a835ac11");
/* harmony import */ var _core_js_roving_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("557c99eb8f3a");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("ed57c006afc1");
/* harmony import */ var _js_rich_text_html_mjs__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("4f56033a1eae");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("d41b3b9112e6");
/* harmony import */ var _lang_index_mjs__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("77f77c47e0a8");
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__("2369556fe449");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _component_field_size__WEBPACK_IMPORTED_MODULE_2__, _js_templates_default__WEBPACK_IMPORTED_MODULE_8__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _component_field_size__WEBPACK_IMPORTED_MODULE_2__, _js_templates_default__WEBPACK_IMPORTED_MODULE_8__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);











 // Only the words on screen ship in the bundle, English only (owner decision
// C282): Russian and every other language come from a language file. The
// title, settings and events stay in the language files for the Studio and the
// docs (localization study LC-2).

 // The marks the toolbar sets: the elements that say them, and the style of
// a run that says the mark is off (the cleaner splits a mark around it).

const MARKS = {
  strong: {
    selector: 'strong, b',
    off: ['fontWeight', 'normal']
  },
  em: {
    selector: 'em, i',
    off: ['fontStyle', 'normal']
  }
};

const markElement = (doc, tag, on) => {
  const element = doc.createElement(on ? tag : 'span');
  if (!on) element.style[MARKS[tag].off[0]] = MARKS[tag].off[1];
  return element;
}; // Content inside the pending marks ({strong?, em?}), strong outside em.


const wrapMarks = (doc, marks, content) => {
  let wrap = content;

  for (const tag of Object.keys(MARKS)) {
    if (marks[tag] === undefined) continue;
    const element = markElement(doc, tag, marks[tag]);
    element.append(wrap);
    wrap = element;
  }

  return wrap;
}; // On a phone -- below the md breakpoint, where core declares
// --sf-breakpoint-md -- a form in a popup is a sheet at the bottom of the
// screen (decision C32), as sf-menu-context reads it.


const onPhone = doc => !doc.defaultView?.getComputedStyle(doc.documentElement).getPropertyValue('--sf-breakpoint-md').trim(); // sf-input-rich: a form field whose value is HTML of a small subset -- p, h2,
// h3, h4, strong, em, a[href], ul, ol, li, blockquote, br -- the text type
// html@1 of Larena's properties (js/rich-text-html.mjs is the subset's rule).
//
// From its component.json (standard simai.smart-component 1.3.11 §3, §4, §8,
// §17): the settings are made by core/js/element-manifest.js; the field is
// the form control through ElementInternals, as sf-textarea is, and says
// input while the text changes and change when the person leaves it with a
// changed value. A value set from code, a form reset and a restore say
// nothing.
//
// The value is never trusted: what the page gives, what is pasted or dropped,
// and the editing surface after every keystroke and command go through the
// one cleaner. Every command is the component's own DOM operation (Bold and
// Italic too: the browser's command reads the computed style as the mark),
// its result is cleaned the same way, and undo and redo are the component's
// own history of cleaned states.


const RichTextElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_10__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: _lang_index_mjs__WEBPACK_IMPORTED_MODULE_11__.files,
  source: 'en'
});
const BLOCK_TAGS = {
  paragraph: 'p',
  'heading-2': 'h2',
  'heading-3': 'h3',
  'heading-4': 'h4'
};
const LEAF_BLOCKS = 'p, h2, h3, h4, li, div';
const HISTORY_LIMIT = 100;
const TYPING_GROUP_MS = 1000; // The toolbar, in its order. `pressed` names the state that presses it;
// `unavailable` greys it out (aria-disabled, still reachable by the arrows)
// and `reason` is the word that says why, as its tooltip (owner decision
// C184 (2)).
//
// The four block levels are drawn as text, not glyphs: the Framework's icon
// font is Material Icons, which has no paragraph or heading-level icon
// (format_paragraph and format_h2..h6 are Material Symbols only), and a
// missing ligature prints its own name on the button. P, H2, H3 and H4 are
// read in both page languages; the button's name is the word, as everywhere.

const TOOLS = Object.freeze([{
  id: 'paragraph',
  word: 'paragraph',
  text: 'P',
  pressed: 'p',
  unavailable: state => state.inList,
  reason: 'not-in-list'
}, {
  id: 'heading-2',
  word: 'heading-2',
  text: 'H2',
  pressed: 'h2',
  unavailable: state => state.inList,
  reason: 'not-in-list'
}, {
  id: 'heading-3',
  word: 'heading-3',
  text: 'H3',
  pressed: 'h3',
  unavailable: state => state.inList,
  reason: 'not-in-list'
}, {
  id: 'heading-4',
  word: 'heading-4',
  text: 'H4',
  pressed: 'h4',
  unavailable: state => state.inList,
  reason: 'not-in-list'
}, {
  id: 'bold',
  word: 'bold',
  icon: 'format_bold',
  pressed: 'strong',
  key: 'B',
  shortcut: 'Control+B Meta+B'
}, {
  id: 'italic',
  word: 'italic',
  icon: 'format_italic',
  pressed: 'em',
  key: 'I',
  shortcut: 'Control+I Meta+I'
}, {
  id: 'link',
  word: 'link',
  icon: 'link',
  pressed: 'link',
  key: 'K',
  shortcut: 'Control+K Meta+K',
  popup: 'dialog'
}, {
  id: 'bulleted-list',
  word: 'bulleted-list',
  icon: 'format_list_bulleted',
  pressed: 'ul'
}, {
  id: 'numbered-list',
  word: 'numbered-list',
  icon: 'format_list_numbered',
  pressed: 'ol'
}, {
  id: 'quote',
  word: 'quote',
  icon: 'format_quote',
  pressed: 'blockquote'
}, {
  id: 'undo',
  word: 'undo',
  icon: 'undo',
  key: 'Z',
  shortcut: 'Control+Z Meta+Z',
  unavailable: state => !state.canUndo,
  reason: 'nothing-to-undo'
}, {
  id: 'redo',
  word: 'redo',
  icon: 'redo',
  key: 'Shift+Z',
  shortcut: 'Control+Shift+Z Meta+Shift+Z Control+Y',
  unavailable: state => !state.canRedo,
  reason: 'nothing-to-redo'
}]); // ------------------------------------------------------------ the caret
//
// A place in the editor as a count of units -- characters, line breaks and
// block starts (each leaf block after the first) -- so it survives the
// cleaner rewriting the surface: cleaning never changes the text, the
// breaks or the blocks a person sees.

function units(root, visit) {
  let first = true;

  const walk = node => {
    for (const child of node.childNodes) {
      if (child.nodeType === 3) {
        if (visit({
          kind: 'text',
          node: child,
          length: child.data.length
        }) === false) return false;
      } else if (child.nodeType === 1) {
        if (child.matches(LEAF_BLOCKS)) {
          if (!first && visit({
            kind: 'block',
            node: child
          }) === false) return false;
          first = false;
        }

        if (child.localName === 'br') {
          if (visit({
            kind: 'br',
            node: child
          }) === false) return false;
        } else if (walk(child) === false) return false;
      }
    }

    return true;
  };

  walk(root);
}

function offsetOf(root, container, offset) {
  if (!root.contains(container)) return null;
  const doc = root.ownerDocument;
  const point = doc.createRange();
  point.setStart(container, offset);
  point.collapse(true);
  let count = 0;
  units(root, unit => {
    if (unit.kind === 'text') {
      if (unit.node === container) {
        count += offset;
        return false;
      }

      if (point.comparePoint(unit.node, unit.length) <= 0) count += unit.length;else return false;
    } else if (unit.kind === 'br') {
      const parent = unit.node.parentNode;
      const index = Array.prototype.indexOf.call(parent.childNodes, unit.node);
      if (point.comparePoint(parent, index + 1) <= 0) count += 1;else return false;
    } else if (point.comparePoint(unit.node, 0) <= 0) {
      count += 1;
    } else {
      return false;
    }

    return true;
  });
  return count;
}

function pointAt(root, target) {
  let count = 0;
  let found = null;
  let last = null;
  units(root, unit => {
    if (unit.kind === 'text') {
      if (target <= count + unit.length) {
        found = [unit.node, target - count];
        return false;
      }

      count += unit.length;
      last = [unit.node, unit.length];
    } else if (unit.kind === 'br') {
      const parent = unit.node.parentNode;
      const index = Array.prototype.indexOf.call(parent.childNodes, unit.node);

      if (target === count) {
        found = [parent, index];
        return false;
      }

      count += 1;
      last = [parent, index + 1];
    } else {
      count += 1;
      last = [unit.node, 0];
    }

    return true;
  });
  return found || last || [root, 0];
} // ------------------------------------------------------------ the element


class SfRichText extends (0,_helpers_form_field__WEBPACK_IMPORTED_MODULE_4__.ShownRequired)((0,_helpers_form_field__WEBPACK_IMPORTED_MODULE_4__.FormField)(RichTextElement)) {
  static get props() {
    return { ...super.props,
      rootClass: {
        attribute: 'root-class',
        default: ''
      }
    };
  }

  constructor() {
    super();
    this._loaded = false;
    this._loadedAttribute = null;
    this._history = [];
    this._historyIndex = -1;
    this._lastTyping = 0;
    this._muted = false;
    this._dispatching = false;
    this._roving = 'levels';
    this._toolsOut = [];
    this._state = {
      canUndo: false,
      canRedo: false
    };
    this._lastSelection = null;
    this._committed = '';
    this._link = {
      value: '',
      error: '',
      existing: false,
      selection: null,
      pending: null,
      placement: 'bottom-start'
    };
    this._dragFromSelf = false;
    this._sheet = null;
    this._countLevel = '';
    this._countSaid = '';
    this._countDrawn = null; // The count follows the text (C141 (1)): with a limit, an edit redraws
    // the count and, at a threshold, the frame. The editing surface is never
    // drawn by the template, so the redraw leaves the text and the caret.

    this.addEventListener('input', () => {
      if (this.maxlength) this.requestComponentUpdate('count');
    });
  } // ---------------------------------------------------------- settings


  get size() {
    return (0,_component_field_size__WEBPACK_IMPORTED_MODULE_2__.ladderSize)(this.getAttribute('size'));
  }

  get effectiveDisabled() {
    return Boolean(this.disabled || this.sfFormDisabled);
  }

  get editor() {
    return this.querySelector('.sf-rich-text-editor');
  }
  /** The value: the subset's HTML, "" when there is no text. */


  get value() {
    const editor = this.editor;
    if (editor && this._loaded) return (0,_js_rich_text_html_mjs__WEBPACK_IMPORTED_MODULE_9__.sanitizeRichText)(editor, {
      mode: 'value'
    });
    return (0,_js_rich_text_html_mjs__WEBPACK_IMPORTED_MODULE_9__.sanitizeRichText)(this.getAttribute('value') || '', {
      mode: 'value'
    });
  }

  set value(next) {
    const clean = (0,_js_rich_text_html_mjs__WEBPACK_IMPORTED_MODULE_9__.sanitizeRichText)(next === null || next === undefined ? '' : String(next), {
      mode: 'value'
    });
    if (next === null || next === undefined) this.removeAttribute('value');else this.setAttribute('value', clean);

    this._load(clean);

    this.sfSyncFormState();
  }

  focusDelegate() {
    return this.editor;
  } // ---------------------------------------------------------- form


  fieldValidity() {
    const missing = Boolean(this.required) && !this.effectiveDisabled && this.value === ''; // Past the limit the field is too long (C141 (1)): the form is not sent,
    // and the text is kept whole.

    const count = this.sfCount();
    const over = !missing && count.over && !this.effectiveDisabled;
    const message = missing ? this.sfWord('value-missing') : over ? this.sfTooLongMessage(count) : '';
    return {
      valueMissing: missing,
      tooLong: over,
      message,
      anchor: this.editor
    };
  } // ---------------------------------------------------------- the count

  /** The characters of the text a person reads: the value without its markup. */


  textLength() {
    const editor = this.editor;
    if (editor && this._loaded) return editor.textContent.length;
    const source = this.getAttribute('value') || '';
    if (!source) return 0;
    const template = this.ownerDocument.createElement('template');
    template.innerHTML = (0,_js_rich_text_html_mjs__WEBPACK_IMPORTED_MODULE_9__.sanitizeRichText)(source, {
      mode: 'value'
    });
    return template.content.textContent.length;
  } // The count against maxlength (helpers/char-count.js, sf-chat-composer's
  // rule): shown from 80 % of the limit or always with `counter`.


  sfCount() {
    return (0,_helpers_char_count__WEBPACK_IMPORTED_MODULE_5__.charCount)(this.textLength(), this.maxlength, {
      always: Boolean(this.counter)
    });
  }

  sfTooLongMessage(count) {
    return this.sfWord('too-long', {
      vars: {
        max: count.limit
      }
    });
  } // form.reset(): the default back, without events.


  fieldReset() {
    this._load(this.getAttribute('value') || '');
  }

  fieldRestore(state) {
    if (typeof state === 'string') this.value = state;
  } // ---------------------------------------------------------- drawing


  templateContext() {
    const props = this.getPropsContext();
    const count = this.sfCount();
    this._countDrawn = count.length;
    const said = (0,_helpers_char_count__WEBPACK_IMPORTED_MODULE_5__.countAnnouncement)(count, this._countLevel, this._countSaid, state => state.over ? this.sfTooLongMessage(state) : this.sfWord('count-text', {
      vars: {
        count: state.length,
        max: state.limit
      }
    }));
    this._countLevel = said.level;
    this._countSaid = said.said;
    return this.createTemplateContext({ ...props,
      size: this.size,
      appearance: this.appearance,
      // The form's disabled fieldset counts too, so the drawn state is not the
      // `disabled` getter's: it travels under its own name.
      fieldDisabled: this.effectiveDisabled,
      value: this.value,
      readonly: Boolean(this.readonly),
      required: Boolean(this.required),
      // The page's error, or the required one a failed form check shows
      // (ShownRequired, C55 F1 / TR-15: as sf-input-textarea 1.8.0).
      invalid: this.sfShownInvalid(this.invalid) || count.over,
      errorMessage: this.sfShownMessage(this.invalid, props.errorMessage),
      rows: this.rows,
      maxRows: this.maxRows,
      tools: this.toolList(),
      state: this._state,
      overflow: this.overflowMore ? 'more' : 'wrap',
      level: Object.keys(BLOCK_TAGS).find(id => this._state[BLOCK_TAGS[id]]) || 'paragraph',
      roving: this._roving,
      linkValue: this._link.value,
      linkError: this._link.error,
      linkExisting: this._link.existing,
      linkPlacement: this._link.placement,
      ariaLabel: this.getAttribute('aria-label') || '',
      count: count.shown ? this.sfWord('count-text', {
        vars: {
          count: count.length,
          max: count.limit
        }
      }) : '',
      countOver: count.over,
      countSaid: this._countSaid,
      counted: Boolean(count.limit),
      component: this
    });
  }

  get rows() {
    const value = Math.trunc(this.getNumberAttr('rows', 6));
    return value > 0 ? value : 6;
  }

  get maxRows() {
    const value = Math.trunc(this.getNumberAttr('maxRows', 0));
    return value > 0 ? Math.max(value, this.rows) : null;
  } // The shortcut in the tooltip names both keyboards, so the markup is the
  // same on every platform (and in the first-paint snapshot).


  toolList() {
    return TOOLS.map(tool => ({ ...tool,
      keys: tool.key ? `Ctrl+${tool.key} / \u2318${tool.key}` : ''
    }));
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_8__.renderRichTextTemplate)(this.templateContext());
  }

  onConnected() {
    const signal = this.sfScope;
    this.ownerDocument.addEventListener('selectionchange', () => this._onSelectionChange(), {
      signal
    });
    this.addEventListener('sf-popover-open', event => this._onLinkOpen(event), {
      signal
    });
    this.addEventListener('sf-popover-opened', () => this._onLinkOpened(), {
      signal
    });
    this.addEventListener('sf-popover-closed', event => this._onLinkClosed(event), {
      signal
    }); // A link editor open while the window crosses the breakpoint becomes
    // what the screen makes it: the sheet on a phone, anchored again wider.

    this.ownerDocument.defaultView?.addEventListener('resize', () => {
      if (this._popover()?.open) this._placeLinkPanel();
    }, {
      signal
    });
  }

  onDisconnected() {
    this._lowerLinkPanel();

    this._toolbarObserver?.disconnect();
    this._toolbarObserver = null;
    this._toolbarObserved = null;
  } // ─── «Ещё» (owner decision C155, R233) ────────────────────────────────────
  // overflow="more" (the default): the toolbar keeps one row and its groups
  // leave for ⋯ at its end when they do not fit -- whole, with their
  // separator, the highest data-sf-priority first (undo and redo, then the
  // lists and the quote); the text levels and bold, italic, link stay. ⋯
  // lists the tools that left with their icons, names and shortcuts, a
  // pressed one checked (C155 (6)); ⋯ itself is never pressed.


  get overflowMore() {
    return this.getAttribute('overflow') !== 'wrap';
  }

  _observeToolbar(bar) {
    if (!bar || !this.overflowMore || typeof ResizeObserver === 'undefined') {
      this._toolbarObserver?.disconnect();
      this._toolbarObserved = null;
      return;
    }

    if (this._toolbarObserved === bar) return;
    this._toolbarObserver ??= new ResizeObserver(() => this._layoutToolbar());

    this._toolbarObserver.disconnect(); // The frame's width is the row's room; the groups' boxes widen when the
    // icon face or the sheet arrives later.


    this._toolbarObserver.observe(bar.parentElement);

    for (const group of bar.querySelectorAll(':scope > .sf-rich-text-group')) this._toolbarObserver.observe(group);

    this._toolbarObserved = bar;
  }

  _layoutToolbar() {
    const bar = this.querySelector('.sf-rich-text-toolbar');
    const more = bar?.querySelector(':scope > .sf-rich-text-more');
    if (!bar || !more) return;
    const groups = [...bar.querySelectorAll(':scope > .sf-rich-text-group')];
    const separators = [...bar.querySelectorAll(':scope > .sf-rich-text-separator:not(.sf-rich-text-more-separator)')];
    const units = groups.map((element, at) => {
      const rank = Number(element.dataset.sfPriority) || at + 1;
      return {
        element,
        rank,
        pin: rank <= 1,
        group: at
      };
    });
    const {
      out
    } = (0,_core_js_overflow_row_js__WEBPACK_IMPORTED_MODULE_6__.layoutActionRow)({
      row: bar,
      units,
      more,
      moreSeparator: bar.querySelector(':scope > .sf-rich-text-more-separator'),
      separators: separators.map((element, at) => ({
        element,
        after: at
      })),
      outClass: 'sf-rich-text-out'
    });
    this._toolsOut = out.flatMap(at => [...groups[at].querySelectorAll('button.sf-rich-text-tool')].map(button => button.dataset.sfTool));
    bar.setAttribute('data-sf-row-laid', ''); // The roving stop stays on a tool the row shows.

    const shown = this._tools();

    if (!shown.some(button => button.dataset.sfTool === this._roving)) this._setRoving(shown[0]);
  } // A menu button of the toolbar (the levels, ⋯): the standard menu under it.


  _openToolMenu(button) {
    const id = button.dataset.sfTool;
    const state = this._state;
    const size = {
      '1/3': '1/2',
      '1/2': '1/2'
    }[this.size] || '1';

    if (id === 'levels') {
      const current = Object.keys(BLOCK_TAGS).find(level => state[BLOCK_TAGS[level]]) || 'paragraph';
      const entries = Object.keys(BLOCK_TAGS).map(level => ({
        id: level,
        text: this.sfWord(level),
        kind: 'radio',
        checked: level === current,
        disabled: Boolean(state.inList) || undefined
      }));
      return (0,_core_js_overflow_row_js__WEBPACK_IMPORTED_MODULE_6__.openRowMenu)(this, {
        anchor: button,
        entries,
        label: this.sfWord('text-level'),
        size,
        select: level => this.runCommand(level)
      });
    }

    const tools = this.toolList();
    const entries = [];
    let lastGroup = null;

    for (const toolId of this._toolsOut) {
      const tool = tools.find(one => one.id === toolId);
      const element = this.querySelector(`.sf-rich-text-toolbar button.sf-rich-text-tool[data-sf-tool="${toolId}"]`);
      if (!tool || !element) continue;
      const group = element.closest('.sf-rich-text-group');
      if (lastGroup && group !== lastGroup) entries.push({
        type: 'separator'
      });
      lastGroup = group;
      const entry = {
        id: tool.id,
        text: this.sfWord(tool.word),
        icon: tool.icon
      };
      if (tool.key) entry.shortcut = `mod+${tool.key.toLowerCase()}`;

      if (tool.pressed) {
        entry.kind = 'check';
        entry.checked = Boolean(state[tool.pressed]);
      }

      if (tool.unavailable?.(state)) entry.disabled = true;
      entries.push(entry);
    }

    return (0,_core_js_overflow_row_js__WEBPACK_IMPORTED_MODULE_6__.openRowMenu)(this, {
      anchor: button,
      entries,
      label: this.sfWord('more'),
      size,
      select: toolId => this.runCommand(toolId)
    });
  }

  afterRender() {
    const bar = this.querySelector('.sf-rich-text-toolbar');

    this._observeToolbar(bar);

    if (bar && this.overflowMore) this._layoutToolbar();
    this._toolbarKeys()?.refresh();
    const editor = this.editor;
    if (!editor) return;
    if (editor.__sfRichText !== this) this._bindEditor(editor);
    const attribute = this.getAttribute('value') ?? '';
    if (!this._loaded || attribute !== this._loadedAttribute) this._load(attribute);

    this._syncEmpty();

    this.sfSyncFormState();
  }

  _bindEditor(editor) {
    editor.__sfRichText = this;
    const signal = this.sfScope;

    const on = (type, handler) => editor.addEventListener(type, handler, {
      signal
    });

    on('beforeinput', event => this._onBeforeInput(event));
    on('input', event => this._onInput(event));
    on('compositionstart', () => this._onCompositionStart());
    on('compositionend', event => this._onCompositionEnd(event));
    on('keydown', event => this._onKeydown(event));
    on('paste', event => this._onPaste(event));
    on('dragstart', () => {
      this._dragFromSelf = true;
    });
    on('dragend', () => {
      this._dragFromSelf = false;
    });
    on('drop', event => this._onDrop(event)); // Files from the computer (FO1-4): the editor takes no files, so a file
    // dropped on it is refused through the one files-drop reading (the no
    // cursor, and the browser does not open the file in place of the page).
    // Text and markup dropped keep _onDrop.

    const files = (0,_core_js_files_drop_js__WEBPACK_IMPORTED_MODULE_3__.filesDrop)(editor, {
      mark: false,
      disabled: () => true
    });
    signal?.addEventListener?.('abort', () => files.stop(), {
      once: true
    });
    on('focus', () => {
      try {
        this.ownerDocument.execCommand('defaultParagraphSeparator', false, 'p');
      } catch {// A browser without the command keeps its own; the cleaner wraps it.
      }
    });
  } // ---------------------------------------------------------- loading
  // Puts a value on the surface, cleaned, and starts the history there. Says
  // nothing: a value set from code, a reset and a restore are not edits.


  _load(html) {
    const editor = this.editor;
    if (!editor) return;
    editor.innerHTML = (0,_js_rich_text_html_mjs__WEBPACK_IMPORTED_MODULE_9__.sanitizeRichText)(String(html ?? ''), {
      mode: 'editor'
    });
    this._loaded = true;
    this._loadedAttribute = this.getAttribute('value') ?? '';
    this._history = [{
      html: editor.innerHTML,
      selection: null
    }];
    this._historyIndex = 0;
    this._lastTyping = 0;
    this._pending = null;
    this._committed = this.value;

    this._syncEmpty();

    this._updateState(); // A value from code or a reset says no input: the count follows it here.


    if (this.maxlength && this._countDrawn !== editor.textContent.length) this.requestComponentUpdate('count');
  }

  _syncEmpty() {
    const editor = this.editor;
    if (!editor) return;
    const empty = editor.textContent === '' && editor.children.length <= 1 && !editor.querySelector('li, blockquote, h2, h3, h4');
    editor.toggleAttribute('data-empty', empty);
  } // ---------------------------------------------------------- selection


  _range() {
    const selection = this.ownerDocument.getSelection();
    const editor = this.editor;
    if (!selection?.rangeCount || !editor) return null;
    const range = selection.getRangeAt(0);
    return editor.contains(range.startContainer) && editor.contains(range.endContainer) ? range : null;
  }

  _saveSelection() {
    const range = this._range();

    const editor = this.editor;
    if (!range || !editor) return null;
    return {
      start: offsetOf(editor, range.startContainer, range.startOffset),
      end: offsetOf(editor, range.endContainer, range.endOffset)
    };
  }

  _restoreSelection(saved) {
    const editor = this.editor;
    if (!saved || !editor) return;
    const doc = this.ownerDocument;
    const range = doc.createRange();
    const [startNode, startOffset] = pointAt(editor, saved.start);
    const [endNode, endOffset] = pointAt(editor, saved.end ?? saved.start);
    range.setStart(startNode, startOffset);
    range.setEnd(endNode, endOffset);
    const selection = doc.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }

  _onSelectionChange() {
    const range = this._range();

    if (!range) return;
    if (!this._inComposition) this._caretIntoMark(range);
    this._lastSelection = this._saveSelection();

    this._updateState();
  } // A caret on a mark's end edge -- at the block's level right after a bold
  // run, or at the start of the text after it -- is a place the browser types
  // into the mark, while the state read there said plain (E1; C12: the state
  // is the one aria-pressed says). It is put at the end of the mark's text,
  // the same character, so Bold reads the place the text goes.


  _caretIntoMark(range) {
    if (!range.collapsed) return;
    const {
      startContainer: node,
      startOffset: offset
    } = range;
    let before = null;
    if (node.nodeType === 1) before = node.childNodes[offset - 1] ?? null;else if (node.nodeType === 3 && offset === 0) before = node.previousSibling;
    if (!before || before.nodeType !== 1 || !before.matches?.('strong, b, em, i, span')) return;
    const doc = this.ownerDocument;
    const walker = doc.createTreeWalker(before, 4);
    let last = null;

    for (let text = walker.nextNode(); text; text = walker.nextNode()) last = text;

    if (!last?.data.length) return;
    const caret = doc.createRange();
    caret.setStart(last, last.data.length);
    caret.collapse(true);
    const selection = doc.getSelection();
    selection.removeAllRanges();
    selection.addRange(caret);
  }

  _within(node, selector) {
    const editor = this.editor;
    const element = node?.nodeType === 1 ? node : node?.parentElement;
    const found = element?.closest?.(selector);
    return found && found !== editor && editor?.contains(found) ? found : null;
  } // The node the selection's format is read from: where a caret stands, or
  // the first text a selection covers (a selection that starts at the end of
  // one text node is about the next).


  _startNode(range) {
    if (!range) return null;
    const container = range.startContainer;

    if (!range.collapsed) {
      const walker = this.ownerDocument.createTreeWalker(range.commonAncestorContainer, 4);
      let node = range.commonAncestorContainer.nodeType === 3 ? range.commonAncestorContainer : walker.nextNode();

      for (; node; node = walker.nextNode()) {
        if (!range.intersectsNode(node)) continue;
        if (node === range.startContainer && range.startOffset >= node.data.length) continue;
        if (node === range.endContainer && range.endOffset === 0) continue;
        if (node.data.length) return node;
      }
    }

    if (container.nodeType === 1) return container.childNodes[range.startOffset] || container;
    return container;
  }

  _updateState() {
    const range = this._range();

    const node = this._startNode(range);

    const block = node ? this._within(node, 'p, h2, h3, h4, li') : null;
    const item = node ? this._within(node, 'li') : null; // Bold and Italic say the marks alone, or the marks the next typing
    // takes at a caret: never the computed style, which in a heading (bold
    // by its type) said bold on every word.

    const mark = tag => this._pendingMark(tag, range) ?? Boolean(node && this._within(node, MARKS[tag].selector));

    const next = {
      p: block?.localName === 'p',
      h2: block?.localName === 'h2',
      h3: block?.localName === 'h3',
      h4: block?.localName === 'h4',
      strong: mark('strong'),
      em: mark('em'),
      link: Boolean(node && this._within(node, 'a')),
      ul: item?.parentElement?.localName === 'ul',
      ol: item?.parentElement?.localName === 'ol',
      blockquote: Boolean(node && this._within(node, 'blockquote')),
      inList: Boolean(item),
      canUndo: this._historyIndex > 0,
      canRedo: this._historyIndex < this._history.length - 1
    };
    const changed = Object.keys(next).some(key => next[key] !== this._state[key]);
    this._state = next;
    if (changed) this.requestComponentUpdate('selection');
  } // The marks the next typing takes at a caret where Bold or Italic was
  // pressed ({at, strong?, em?}); forgotten once the caret moves.


  _pendingMarks(range = this._range()) {
    if (!this._pending) return null; // A composition moves the caret with its text: the marks stand until it
    // ends, and Bold and Italic stay pressed meanwhile (M1, M2).

    if (this._inComposition) return this._pending;

    if (!range?.collapsed || this._saveSelection()?.start !== this._pending.at) {
      this._pending = null;
      return null;
    }

    return this._pending;
  }

  _pendingMark(tag, range) {
    return this._pendingMarks(range)?.[tag];
  } // ---------------------------------------------------------- cleaning
  // The surface through the cleaner; rewritten only when cleaning changed
  // it, with the caret kept in its place.


  _clean(selection = this._saveSelection()) {
    const editor = this.editor;
    if (!editor) return;
    const clean = (0,_js_rich_text_html_mjs__WEBPACK_IMPORTED_MODULE_9__.sanitizeRichText)(editor, {
      mode: 'editor'
    });

    if (clean !== editor.innerHTML) {
      editor.innerHTML = clean;
      if (selection) this._restoreSelection(selection);
    }

    this._syncEmpty();
  }

  _record({
    typing = false
  } = {}) {
    const editor = this.editor;
    if (!editor) return;
    const html = editor.innerHTML;

    const selection = this._saveSelection();

    const now = Date.now();
    const top = this._history[this._historyIndex];

    if (top && top.html === html) {
      top.selection = selection;
      return;
    }

    const grouped = typing && this._lastTyping && now - this._lastTyping < TYPING_GROUP_MS && this._historyIndex > 0 && this._historyIndex === this._history.length - 1;

    if (grouped) {
      this._history[this._historyIndex] = {
        html,
        selection
      };
    } else {
      this._history.splice(this._historyIndex + 1);

      this._history.push({
        html,
        selection
      });

      if (this._history.length > HISTORY_LIMIT) this._history.shift();
      this._historyIndex = this._history.length - 1;
    }

    this._lastTyping = typing ? now : 0;
  }

  _say(inputType) {
    const editor = this.editor;
    if (!editor) return;
    this._dispatching = true;

    try {
      const InputEventClass = globalThis.InputEvent || globalThis.Event;
      editor.dispatchEvent(new InputEventClass('input', {
        bubbles: true,
        composed: true,
        inputType
      }));
    } finally {
      this._dispatching = false;
    }
  } // An edit the component makes: run it on the person's selection, clean the
  // result, keep the caret, record it and say input once.


  _edit(change, inputType, {
    selection = 'before'
  } = {}) {
    const editor = this.editor;
    if (!editor || this.effectiveDisabled || this.readonly) return false;
    const doc = this.ownerDocument;
    const returnTo = doc.activeElement && doc.activeElement !== editor && this.contains(doc.activeElement) ? doc.activeElement : null; // From the toolbar by the keyboard: the text takes focus for the command
    // and the selection the person left in it comes back.

    if (doc.activeElement !== editor) {
      editor.focus({
        preventScroll: true
      });
      if (this._lastSelection) this._restoreSelection(this._lastSelection);
    }

    if (!this._range()) this._restoreSelection(this._lastSelection ?? {
      start: 0,
      end: 0
    });
    const before = editor.innerHTML;
    const saved = selection === 'before' ? this._saveSelection() : null;
    this._muted = true;

    try {
      change();
    } catch (error) {
      this.reportComponentError(error, `edit ${inputType}`);
    } finally {
      this._muted = false;
    }

    this._clean(selection === 'before' ? saved : this._saveSelection());

    if (selection === 'before' && saved) this._restoreSelection(saved);
    this._lastSelection = this._saveSelection();

    if (editor.innerHTML !== before) {
      this._record();

      this._say(inputType);
    }

    this._updateState();

    returnTo?.focus?.({
      preventScroll: true
    });
    return true;
  } // ---------------------------------------------------------- typing


  _onBeforeInput(event) {
    if (this._muted) return;

    switch (event.inputType) {
      case 'historyUndo':
        event.preventDefault();
        this.undo();
        return;

      case 'historyRedo':
        event.preventDefault();
        this.redo();
        return;

      case 'formatBold':
        event.preventDefault();
        this.runCommand('bold');
        return;

      case 'insertText':
        if (this._pending && event.data) this._typePending(event);
        return;

      case 'formatItalic':
        event.preventDefault();
        this.runCommand('italic');
        return;

      default:
        // No other format is in the subset: underline, strike, colours,
        // alignment and indent are refused rather than cleaned away later.
        if (String(event.inputType).startsWith('format')) event.preventDefault();
    }
  } // Text typed at a caret where Bold or Italic was pressed: it takes the
  // pending marks (a mark off is a run of normal style the cleaner splits
  // the mark around).


  _typePending(event) {
    const range = this._range();

    const pending = this._pendingMarks(range);

    this._pending = null;
    if (!pending || !range) return;
    event.preventDefault();
    const doc = this.ownerDocument;
    const text = doc.createTextNode(event.data);
    range.insertNode(wrapMarks(doc, pending, text));
    const caret = doc.createRange();
    caret.setStart(text, text.data.length);
    caret.collapse(true);
    const selection = doc.getSelection();
    selection.removeAllRanges();
    selection.addRange(caret);

    this._afterTyping('insertText');

    this._say('insertText');
  }

  _onCompositionStart() {
    this._composing = this._pendingMarks();
    this._inComposition = true;
    this._composedFrom = this.editor?.innerHTML ?? '';
  } // Composed text (an IME) cannot be inserted by hand: the browser writes
  // it. The marks pending when the composition started go round it once it
  // ends, as typed text takes them; a composition that did not end at the
  // pending caret plus its text keeps the text plain. A cancelled one (no
  // text, the caret back where it began) keeps the marks pending (M1).


  _onCompositionEnd(event) {
    const pending = this._composing;
    const before = this._composedFrom;
    this._composing = null;
    this._inComposition = false;
    this._composedFrom = null;
    this._pending = null;
    const text = String(event.data ?? '');
    const editor = this.editor;

    const end = this._saveSelection();

    const collapsed = Boolean(end && end.start === end.end);
    if (pending && !text && collapsed && end.start === pending.at) this._pending = pending;

    if (!pending || !text || !editor || !collapsed || end.start - text.length !== pending.at) {
      this._afterTyping('insertCompositionText');

      this._sayComposed(before);

      return;
    }

    const doc = this.ownerDocument;
    const range = doc.createRange();
    const [startNode, startOffset] = pointAt(editor, pending.at);
    const [endNode, endOffset] = pointAt(editor, end.start);
    range.setStart(startNode, startOffset);
    range.setEnd(endNode, endOffset);

    if (range.toString() !== text) {
      this._afterTyping('insertCompositionText');

      this._sayComposed(before);

      return;
    }

    range.insertNode(wrapMarks(doc, pending, range.extractContents()));

    this._clean(end);

    this._restoreSelection(end);

    this._afterTyping('insertCompositionText');

    this._sayComposed(before);
  } // One input that is not composing after every composition that changed
  // the text, marks or none (M3): a listener that skips composing inputs, as
  // many do, still hears an IME's edit. It waits one task: a browser that
  // says the commit itself after compositionend (WebKit) is that input, and
  // the component's is not sent. A cancel that left the text as it was says
  // nothing, as nothing changed.


  _sayComposed(before) {
    const editor = this.editor;
    if (!editor || editor.innerHTML === before) return;
    const turn = {
      said: false
    };
    this._composedSay = turn;
    setTimeout(() => {
      if (this._composedSay !== turn) return;
      this._composedSay = null;
      if (!turn.said) this._say('insertCompositionText');
    }, 0);
  }

  _onInput(event) {
    // The browser's own input while a command runs: the command says input
    // once, after cleaning.
    if (this._muted) {
      event.stopImmediatePropagation();
      return;
    }

    if (this._dispatching) return;
    if (event.isComposing) return;
    if (this._composedSay) this._composedSay.said = true;

    this._afterTyping(event.inputType);
  }

  _afterTyping(inputType = '') {
    this._clean();

    this._record({
      typing: /^(insertText|insertCompositionText|deleteContentBackward|deleteContentForward)$/u.test(inputType)
    });

    this._lastSelection = this._saveSelection();

    this._updateState();
  }

  _onKeydown(event) {
    if (!(event.ctrlKey || event.metaKey) || event.altKey) return;
    const key = String(event.key || '').toLowerCase();

    const run = command => {
      event.preventDefault();
      this.runCommand(command);
    };

    if (key === 'b' && !event.shiftKey) run('bold');else if (key === 'i' && !event.shiftKey) run('italic');else if (key === 'k' && !event.shiftKey) run('link');else if (key === 'z' && event.shiftKey) run('redo');else if (key === 'z') run('undo');else if (key === 'y') run('redo');
  } // ---------------------------------------------------------- paste and drop


  _cleanTransfer(data) {
    const html = data?.getData?.('text/html') || '';
    if (html) return (0,_js_rich_text_html_mjs__WEBPACK_IMPORTED_MODULE_9__.sanitizeRichText)(html, {
      mode: 'value'
    });
    return (0,_js_rich_text_html_mjs__WEBPACK_IMPORTED_MODULE_9__.richTextFromPlainText)(data?.getData?.('text/plain') || '', {
      mode: 'value'
    });
  } // Cleaned HTML in place of the selection: the first paragraph joins the
  // text at the caret, what follows stands as blocks (the cleaner splits the
  // paragraph around them, so the text after the caret follows the last).


  _insertClean(clean, inputType, marks = null) {
    if (!clean) return;

    this._edit(() => {
      const range = this._range();

      if (!range) return;
      const doc = this.ownerDocument;
      range.deleteContents(); // An empty line's <br> is the caret's place holder, not content.

      const block = this._within(range.startContainer, 'p, h2, h3, h4, li');

      if (block && block.textContent === '' && !block.querySelector('ul, ol')) {
        block.replaceChildren();
        range.setStart(block, 0);
        range.collapse(true);
      }

      const template = doc.createElement('template'); // The string is the subset's own output: nothing in it runs or loads.

      template.innerHTML = clean; // Plain text pasted at a caret with pending marks takes them, as typed
      // text does (M4): each paragraph's text inside the marks.

      if (marks) {
        for (const block of [...template.content.children]) {
          if (block.localName !== 'p' || !block.firstChild) continue;
          const content = doc.createDocumentFragment();
          content.append(...block.childNodes);
          block.append(wrapMarks(doc, marks, content));
        }
      }

      const nodes = [...template.content.childNodes];
      const fragment = doc.createDocumentFragment();
      nodes.forEach((node, index) => {
        if (index === 0 && node.localName === 'p') fragment.append(...node.childNodes);else fragment.append(node);
      });
      const last = fragment.lastChild;
      if (!last) return;
      range.insertNode(fragment);
      const after = doc.createRange();
      after.setStartAfter(last);
      after.collapse(true);
      const selection = doc.getSelection();
      selection.removeAllRanges();
      selection.addRange(after);
    }, inputType, {
      selection: 'after'
    });
  }

  _onPaste(event) {
    event.preventDefault();
    if (this.effectiveDisabled || this.readonly) return;
    const data = event.clipboardData; // Rich paste keeps its own marks; plain text takes the pending ones.

    const marks = data?.getData?.('text/html') ? null : this._pendingMarks();

    this._insertClean(this._cleanTransfer(data), 'insertFromPaste', marks);
  }

  _onDrop(event) {
    // A move inside the editor is the browser's; its result is cleaned as
    // typing is.
    if (this._dragFromSelf || (0,_core_js_files_drop_js__WEBPACK_IMPORTED_MODULE_3__.carriesFiles)(event)) return;
    event.preventDefault();
    if (this.effectiveDisabled || this.readonly) return;
    const doc = this.ownerDocument;
    const editor = this.editor;
    let range = null;
    if (doc.caretRangeFromPoint) range = doc.caretRangeFromPoint(event.clientX, event.clientY);else if (doc.caretPositionFromPoint) {
      const position = doc.caretPositionFromPoint(event.clientX, event.clientY);

      if (position) {
        range = doc.createRange();
        range.setStart(position.offsetNode, position.offset);
        range.collapse(true);
      }
    }
    editor.focus({
      preventScroll: true
    });

    if (range && editor.contains(range.startContainer)) {
      const selection = doc.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }

    this._insertClean(this._cleanTransfer(event.dataTransfer), 'insertFromDrop');
  } // ---------------------------------------------------------- commands

  /**
   * Runs a toolbar command on the current selection: paragraph, heading-2,
   * heading-3, heading-4, bold, italic, link, bulleted-list, numbered-list,
   * quote, undo, redo. Answers whether it ran.
   */


  runCommand(id) {
    if (this.effectiveDisabled || this.readonly) return false;
    if (BLOCK_TAGS[id]) return this._edit(() => this._setBlock(BLOCK_TAGS[id]), 'formatBlock');
    if (id === 'bold') return this._edit(() => this._toggleMark('strong'), 'formatBold');
    if (id === 'italic') return this._edit(() => this._toggleMark('em'), 'formatItalic');
    if (id === 'bulleted-list') return this._edit(() => this._toggleList('ul'), 'insertUnorderedList');
    if (id === 'numbered-list') return this._edit(() => this._toggleList('ol'), 'insertOrderedList');
    if (id === 'quote') return this._edit(() => this._toggleQuote(), 'formatBlock');
    if (id === 'undo') return this.undo();
    if (id === 'redo') return this.redo();
    if (id === 'link') return this.openLink();
    return false;
  }

  undo() {
    if (this._historyIndex <= 0) return false;
    this._historyIndex -= 1;

    this._applyHistory('historyUndo');

    return true;
  }

  redo() {
    if (this._historyIndex >= this._history.length - 1) return false;
    this._historyIndex += 1;

    this._applyHistory('historyRedo');

    return true;
  }

  _applyHistory(inputType) {
    this._pending = null;
    const editor = this.editor;
    const entry = this._history[this._historyIndex];
    if (!editor || !entry) return;
    editor.innerHTML = entry.html;
    if (this.ownerDocument.activeElement !== editor && !this.contains(this.ownerDocument.activeElement)) editor.focus({
      preventScroll: true
    });
    if (entry.selection) this._restoreSelection(entry.selection);
    this._lastTyping = 0;
    this._lastSelection = entry.selection;

    this._syncEmpty();

    this._say(inputType);

    this._updateState();
  }

  _selectedBlocks() {
    const editor = this.editor;

    const range = this._range();

    if (!editor || !range) return [];
    const all = [...editor.querySelectorAll('p, h2, h3, h4, li')].filter(block => range.intersectsNode(block));
    return all.filter(block => !all.some(other => other !== block && block.contains(other)));
  }

  _setBlock(tag) {
    const blocks = this._selectedBlocks().filter(block => block.localName !== 'li');

    const target = tag !== 'p' && blocks.length && blocks.every(block => block.localName === tag) ? 'p' : tag;

    for (const block of blocks) {
      if (block.localName === target) continue;
      const next = this.ownerDocument.createElement(target);
      next.append(...block.childNodes);
      block.replaceWith(next);
    }
  } // Bold and Italic set the mark themselves. The browser's command reads
  // the computed style as the mark: in a heading (bold by its type) it saw
  // bold everywhere and took no mark, and at a caret its typing style was
  // lost when the edit put the caret back. All the selected text marked: the
  // mark comes off; otherwise it goes on. At a caret the mark waits for the
  // typed text.


  _toggleMark(tag) {
    const range = this._range();

    if (!range) return;
    const doc = this.ownerDocument;
    const {
      selector
    } = MARKS[tag];

    if (range.collapsed) {
      const pending = this._pendingMarks(range);

      const marked = pending?.[tag] ?? Boolean(this._within(this._startNode(range), selector));
      this._pending = { ...pending,
        at: this._saveSelection().start,
        [tag]: !marked
      };
      return;
    }

    this._pending = null;
    const root = range.commonAncestorContainer;
    const texts = [];
    if (root.nodeType === 3) texts.push(root);else {
      const walker = doc.createTreeWalker(root, 4);

      for (let node = walker.nextNode(); node; node = walker.nextNode()) if (range.intersectsNode(node)) texts.push(node);
    }
    const {
      startContainer,
      startOffset,
      endContainer,
      endOffset
    } = range;
    const parts = [];

    for (const text of texts) {
      const from = text === startContainer ? startOffset : 0;
      const to = text === endContainer ? endOffset : text.data.length;
      if (to > from) parts.push({
        text,
        from,
        to
      });
    }

    if (!parts.length) return;
    const on = !parts.every(({
      text
    }) => this._within(text, selector));

    for (const part of parts) {
      let {
        text
      } = part;
      if (part.to < text.data.length) text.splitText(part.to);
      if (part.from > 0) text = text.splitText(part.from);
      const wrap = markElement(doc, tag, on);
      text.replaceWith(wrap);
      wrap.append(text);
    }
  }

  _toggleList(type) {
    const doc = this.ownerDocument;

    const blocks = this._selectedBlocks();

    if (!blocks.length) return;
    const items = blocks.filter(block => block.localName === 'li');

    if (items.length === blocks.length && items.every(item => item.parentElement?.localName === type)) {
      // Off: the items become paragraphs, the list split around them.
      for (const item of items) {
        const list = item.parentElement;
        const after = [];

        for (let next = item.nextSibling; next; next = next.nextSibling) after.push(next);

        if (after.length) {
          const tail = doc.createElement(list.localName);
          tail.append(...after);
          list.after(tail);
        }

        const paragraph = doc.createElement('p');
        const nested = [...item.children].filter(child => child.localName === 'ul' || child.localName === 'ol');
        nested.forEach(child => child.remove());
        paragraph.append(...item.childNodes);
        list.after(paragraph, ...nested);
        item.remove();
        if (!list.children.length) list.remove();
      }

      return;
    }

    if (items.length === blocks.length) {
      // The other kind of list: the lists change kind.
      for (const list of new Set(items.map(item => item.parentElement))) {
        if (list.localName === type) continue;
        const next = doc.createElement(type);
        next.append(...list.childNodes);
        list.replaceWith(next);
      }

      return;
    }

    for (const block of blocks) {
      if (block.localName === 'li') continue;
      const item = doc.createElement('li');
      item.append(...block.childNodes);
      const previous = block.previousElementSibling;

      if (previous?.localName === type) {
        previous.append(item);
      } else {
        const list = doc.createElement(type);
        list.append(item);
        block.before(list);
      }

      block.remove();
    }
  }

  _toggleQuote() {
    const editor = this.editor;

    const blocks = this._selectedBlocks();

    if (!blocks.length) return;
    const quotes = blocks.map(block => this._within(block, 'blockquote'));

    if (quotes.every(Boolean)) {
      for (const quote of new Set(quotes)) quote.replaceWith(...quote.childNodes);

      return;
    }

    const top = node => {
      let current = node;

      while (current.parentElement && current.parentElement !== editor) current = current.parentElement;

      return current;
    };

    const first = top(blocks[0]);
    const last = top(blocks[blocks.length - 1]);
    const quote = this.ownerDocument.createElement('blockquote');
    first.before(quote);

    for (let node = first; node;) {
      const next = node.nextSibling;
      quote.append(node);
      if (node === last) break;
      node = next;
    }
  } // ---------------------------------------------------------- links


  _popover() {
    return this.querySelector('.sf-rich-text-link');
  }
  /** Opens the link editor on the selection (Mod+K, the link button). */


  openLink() {
    if (this.effectiveDisabled || this.readonly) return false;

    const popover = this._popover();

    if (!popover?.show) return false;
    popover.show();
    return true;
  }

  _onLinkOpen(event) {
    if (event.target !== this._popover()) return;

    if (this.effectiveDisabled || this.readonly) {
      event.preventDefault();
      return;
    }

    if (!this._range() && this._lastSelection) {
      this.editor?.focus({
        preventScroll: true
      });

      this._restoreSelection(this._lastSelection);
    }

    const range = this._range();

    const anchor = range ? this._within(range.startContainer, 'a') : null; // The editor hangs from the side of the button with room for it: the
    // popover places, it does not move a surface back into the window.

    const popover = this._popover();

    const button = popover?.querySelector('[data-sf-tool="link"]');
    const box = button?.getBoundingClientRect();
    const width = this.ownerDocument.documentElement.clientWidth;
    const surface = popover?.querySelector(':scope > [slot="content"]'); // The wide form's step (C32): the field, its hint and two buttons of the
    // field's size stand in one row (R121). The token is in rem; it was read
    // as a bare number, 24 px of room, so the editor never turned to the end.

    const rem = parseFloat(globalThis.getComputedStyle?.(this.ownerDocument.documentElement).fontSize || '16') || 16;
    const token = surface && globalThis.getComputedStyle?.(surface).getPropertyValue('--sf-popup-form-wide-width').trim() || '';
    const room = (token.endsWith('rem') ? parseFloat(token) * rem : parseFloat(token)) || rem * 24;
    const placement = box && box.left + room > width && box.right - room >= 0 ? 'bottom-end' : 'bottom-start';
    popover?.setAttribute('placement', placement);
    this._link = {
      value: anchor?.getAttribute('href') || '',
      error: '',
      existing: Boolean(anchor),
      selection: this._saveSelection() ?? this._lastSelection,
      pending: null,
      placement
    };
    this.requestComponentUpdate('link');
  }
  /**
   * The link editor on a phone is a sheet at the bottom of the screen (C32,
   * RT-02): the surface says data-sf-sheet, which the field's sheet draws,
   * and goes into the top layer through core's positioning, so no box of the
   * page clips it or becomes its containing block. Wider, it hangs from the
   * link button again.
   */


  _placeLinkPanel() {
    const surface = this._popover()?.querySelector(':scope > [slot="content"]');
    if (!surface) return;
    const sheet = onPhone(this.ownerDocument);
    if (sheet === Boolean(this._sheet) && this._sheet?.surface === surface) return;

    this._lowerLinkPanel();

    if (!sheet) return;
    surface.setAttribute('data-sf-sheet', '');
    const lower = globalThis.SF?.Position?.liftToTopLayer?.(surface) ?? null;
    this._sheet = {
      surface,
      lower
    };
  }

  _lowerLinkPanel() {
    const sheet = this._sheet;
    if (!sheet) return;
    this._sheet = null;
    sheet.lower?.();
    sheet.surface.removeAttribute('data-sf-sheet');
  }

  _onLinkOpened() {
    this._placeLinkPanel(); // After the popover shows its content and this element drew the field.


    requestAnimationFrame(() => {
      const input = this.querySelector('.sf-rich-text-link-input');
      const control = input?.querySelector('input') || input;
      control?.focus?.();
      control?.select?.();
    });
  }

  _linkInputValue() {
    const input = this.querySelector('.sf-rich-text-link-input');
    const control = input?.querySelector('input');
    return String(control?.value ?? input?.value ?? '');
  }

  applyLinkFromPanel() {
    const raw = this._linkInputValue().trim();

    const href = (0,_js_rich_text_html_mjs__WEBPACK_IMPORTED_MODULE_9__.richTextHref)(raw);

    if (!href) {
      this._link = { ...this._link,
        value: raw,
        error: this.sfWord('link-invalid')
      };
      this.requestComponentUpdate('link');
      return false;
    }

    this._link = { ...this._link,
      value: href,
      error: '',
      pending: {
        href
      }
    };
    this._popover()?.close?.({
      reason: 'api'
    });
    return true;
  }

  removeLinkFromPanel() {
    this._link = { ...this._link,
      error: '',
      pending: {
        remove: true
      }
    };
    this._popover()?.close?.({
      reason: 'api'
    });
    return true;
  }

  onLinkPanelEvent(event) {
    // The address field's own input and change are not the field's.
    event.stopPropagation();

    if (event.type === 'input' && this._link.error) {
      this._link = { ...this._link,
        error: ''
      };
      this.requestComponentUpdate('link');
    }
  }

  onLinkPanelKeydown(event) {
    event.stopPropagation();

    if (event.key === 'Enter' && !event.isComposing) {
      event.preventDefault();
      this.applyLinkFromPanel();
    }
  }

  _onLinkClosed(event) {
    if (event.target !== this._popover()) return;
    const reason = event.detail?.reason;

    this._lowerLinkPanel();

    const {
      pending,
      selection
    } = this._link;
    this._link = {
      value: '',
      error: '',
      existing: false,
      selection: null,
      pending: null,
      placement: this._link.placement
    };
    this.requestComponentUpdate('link'); // A press outside belongs to wherever it landed.

    if (reason === 'outside') return; // The popover gives focus back to its trigger as it closes; the person
    // goes on typing, so the caret goes back to the text after that.

    setTimeout(() => {
      const editor = this.editor;
      if (!editor) return;
      editor.focus({
        preventScroll: true
      });
      if (selection) this._restoreSelection(selection);
      if (pending?.href) this._edit(() => this._setLink(pending.href), 'insertLink', {
        selection: 'after'
      });else if (pending?.remove) this._edit(() => this._removeLink(), 'insertLink');
    }, 0);
  }

  _setLink(href) {
    const doc = this.ownerDocument;

    const range = this._range();

    if (!range) return;

    const anchor = this._within(range.startContainer, 'a');

    if (anchor) {
      anchor.setAttribute('href', href);
      const after = doc.createRange();
      after.selectNodeContents(anchor);
      after.collapse(false);
      doc.getSelection().removeAllRanges();
      doc.getSelection().addRange(after);
      return;
    }

    const link = doc.createElement('a');
    link.setAttribute('href', href);

    if (range.collapsed) {
      link.textContent = href.replace(/^(mailto|tel):/u, '');
    } else {
      const fragment = range.extractContents();
      fragment.querySelectorAll('a').forEach(inner => inner.replaceWith(...inner.childNodes));
      link.append(fragment);
    }

    range.insertNode(link);
    const after = doc.createRange();
    after.setStartAfter(link);
    after.collapse(true);
    doc.getSelection().removeAllRanges();
    doc.getSelection().addRange(after);
  }

  _removeLink() {
    const range = this._range();

    const anchor = range ? this._within(range.startContainer, 'a') : null;
    if (anchor) anchor.replaceWith(...anchor.childNodes);
  } // ---------------------------------------------------------- toolbar
  // The tools a person reaches: not disabled, not out of the row (C155).


  _tools() {
    return [...this.querySelectorAll('.sf-rich-text-toolbar button.sf-rich-text-tool:not([disabled])')].filter(button => !button.closest('.sf-rich-text-out'));
  } // The toolbar's keys are core's roving helper (owner decision C184 (1)-(3)):
  // one Tab stop that comes back to the tool the person left, the arrows in
  // the row's direction (right-to-left too), Home and End, the walk wrapping;
  // an unavailable tool stays in the walk with its reason.


  _toolbarKeys() {
    const bar = this.querySelector('.sf-rich-text-toolbar');
    if (!bar) return null;

    if (this._toolbarRow?.bar !== bar) {
      this._toolbarRow?.keys.destroy();
      const keys = (0,_core_js_roving_js__WEBPACK_IMPORTED_MODULE_7__.roving)(bar, {
        items: 'button.sf-rich-text-tool',
        out: '.sf-rich-text-out, [hidden], [inert]',
        onMove: button => {
          this._roving = button.dataset.sfTool;
        }
      });
      const remembered = bar.querySelector(`button.sf-rich-text-tool[data-sf-tool="${this._roving}"]`);
      if (remembered && !remembered.disabled) keys.set(remembered);
      this._toolbarRow = {
        bar,
        keys
      };
    }

    return this._toolbarRow.keys;
  }

  _setRoving(button) {
    if (!button) return;
    this._roving = button.dataset.sfTool;
    this._toolbarKeys()?.set(button);
  } // A press on a tool keeps the caret and the selection in the text.


  onToolbarMouseDown(event) {
    if (event.target?.closest?.('button.sf-rich-text-tool')) event.preventDefault();
  }

  onToolbarClick(event) {
    const button = event.target?.closest?.('button.sf-rich-text-tool');
    if (!button || button.disabled) return;
    const id = button.dataset.sfTool;

    this._setRoving(button); // The link button is the popover's trigger: the popover opens itself.


    if (id === 'link') return;
    if (button.getAttribute('aria-disabled') === 'true') return;

    if (id === 'levels' || id === 'more') {
      this._openToolMenu(button);

      return;
    }

    this.runCommand(id);
  } // ---------------------------------------------------------- focus and change


  onRootPointerDown(event) {
    if (event.target?.closest?.('.sf-rich-text-editor')) this.querySelector('.sf-rich-text')?.classList.add('sf-rich-text--pointer-focus');
  } // Leaving the field with a changed value is change, once, as a textarea
  // says it; moving between the toolbar, the link editor and the text is not.


  onRootFocusOut(event) {
    const next = event.relatedTarget;
    if (next && this.contains(next)) return;
    this.querySelector('.sf-rich-text')?.classList.remove('sf-rich-text--pointer-focus');
    const value = this.value;
    if (value === this._committed) return;
    this._committed = value;
    this.editor?.dispatchEvent(new Event('change', {
      bubbles: true,
      composed: true
    }));
  }

}

SfRichText.define('sf-input-rich');
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SfRichText);
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "ed57c006afc1"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderRichTextTemplate: () => (/* binding */ renderRichTextTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var _helpers_field_help__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("f39dc444b059");
/* harmony import */ var _component_field_contract__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("e138a730fd7c");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, _helpers_field_help__WEBPACK_IMPORTED_MODULE_1__, _component_field_contract__WEBPACK_IMPORTED_MODULE_2__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, _helpers_field_help__WEBPACK_IMPORTED_MODULE_1__, _component_field_contract__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);


 // The field: a label row, one frame holding the toolbar over the editing
// surface, and the hint or error line -- sf-textarea's parts, in its places.
//
// The toolbar is the class markup of icon buttons (.sf-icon-button, the
// sheet sf-dropdown and the inherited-value reset draw with), so the
// component owns their tabindex, aria-pressed and disabled outright: a roving
// toolbar has to, and an sf-icon-button host copies its attributes onto its
// own button on its own schedule. A tool with no glyph in the icon font --
// the four block levels -- holds its short text instead, in the same square.
// The link editor is an sf-popover whose
// trigger is the link button and whose content holds an sf-input and two
// sf-button, all of one size.
//
// The editing surface carries no binding inside: lit draws the element and
// never its children, which are the person's text and are written only by
// the component, always through the subset's cleaner.
// Icon button size one step below the field's, so the toolbar sits inside the
// frame on the same ladder. The look is the editor toolbar's of decision C15:
// ghost on-surface (RT-06; link is ghost's old name). The field ladder's outer
// steps (fields ladder, 2026-11-14): size 3 takes size 2 buttons; 1/3 has no
// button rung below and takes 1/3, as the 1/2 field does.

const BUTTON_SIZE = {
  '1/3': '1/3',
  '1/2': '1/3',
  '1': '1/2',
  '2': '1',
  '3': '2'
};

function toolButton(context, tool) {
  const {
    component,
    buttonSize,
    fieldDisabled: disabled,
    readonly,
    state,
    roving
  } = context;
  const pressed = tool.pressed === undefined ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : String(Boolean(state[tool.pressed])); // Unavailable (undo with nothing to undo, a heading in a list): said and
  // greyed, still reached by the arrows; the whole toolbar is disabled with
  // the field.

  const unavailable = Boolean(tool.unavailable?.(state)); // Why it is unavailable, as its tooltip and its description (C184 (2)).

  const reason = unavailable && tool.reason ? component.sfWord(tool.reason) : '';
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<button
      type="button"
      class="sf-rich-text-tool sf-icon-button sf-icon-button--icon sf-icon-button--ghost sf-icon-button--on-surface sf-icon-button--size-${buttonSize} flex items-cross-center"
      data-sf-tool=${tool.id}
      tabindex=${roving === tool.id ? '0' : '-1'}
      aria-label=${component.sfWord(tool.word)}
      title=${reason || (tool.keys ? `${component.sfWord(tool.word)} (${tool.keys})` : component.sfWord(tool.word))}
      aria-description=${reason || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      aria-pressed=${pressed}
      aria-keyshortcuts=${tool.shortcut || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      aria-haspopup=${tool.popup || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      aria-disabled=${unavailable ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      ?disabled=${disabled || readonly}
    >${tool.icon ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class="sf-icon" aria-hidden="true">${tool.icon}</i>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-rich-text-tool-text" aria-hidden="true">${tool.text}</span>`}</button>`;
}

function renderRichTextTemplate(context) {
  const {
    component,
    size,
    appearance,
    label,
    required,
    hint,
    errorMessage,
    invalid,
    fieldDisabled: disabled,
    readonly,
    placeholder,
    tools,
    linkValue,
    linkError,
    linkExisting,
    rows,
    maxRows,
    ariaLabel,
    count = '',
    countOver = false,
    countSaid = '',
    counted = false
  } = context;
  const field = (0,_component_field_contract__WEBPACK_IMPORTED_MODULE_2__.createFieldContract)(component, {
    prefix: 'sf-rich-text',
    required,
    invalid,
    hint,
    errorMessage
  });
  const labelId = `${field.base}--label`;
  const toolbarId = `${field.base}--toolbar`;
  const linkId = `${field.base}--link`;
  const message = field.invalid && errorMessage ? errorMessage : hint;
  const countId = `${field.messageId}-count`;
  const describedBy = [message ? field.messageId : '', count ? countId : ''].filter(Boolean).join(' ');
  const buttonSize = BUTTON_SIZE[size] || '1/2'; // The link editor is one small form on one rung (R121; owner decision
  // C141 (6)): its address field, with its label and hint, and both buttons
  // are size 1/2 whatever the field's size -- the toolbar's rung of the
  // ordinary field.

  const linkSize = '1/2';
  const rootClasses = ['sf-rich-text', `sf-rich-text--size-${size}`, `sf-rich-text--${appearance}`, field.invalid ? 'error' : '', disabled ? 'sf-rich-text--disabled' : '', readonly ? 'sf-rich-text--readonly' : '', countOver ? 'sf-rich-text--over' : '', 'flex', 'flex-col', context.rootClass].filter(Boolean);
  const toolContext = { ...context,
    buttonSize
  };

  const group = ids => tools.filter(tool => ids.includes(tool.id)).map(tool => {
    if (tool.id !== 'link') return toolButton(toolContext, tool); // The link button opens the link editor: the popover's trigger.

    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-popover class="sf-rich-text-link" placement=${context.linkPlacement || 'bottom-start'} width="var(--sf-popup-form-wide-width, 24rem)" label=${component.sfWord('link-dialog')}>
        <span slot="trigger" class="sf-rich-text-link-trigger">${toolButton(toolContext, tool)}</span>
        <div slot="content" class="sf-rich-text-link-panel flex flex-col" id=${linkId}
          @input=${event => component.onLinkPanelEvent(event)}
          @change=${event => component.onLinkPanelEvent(event)}
          @keydown=${event => component.onLinkPanelKeydown(event)}>
          <sf-input class="sf-rich-text-link-input" size=${linkSize} label=${component.sfWord('link-address')}
            hint=${component.sfWord('link-hint')} .value=${linkValue} ?invalid=${Boolean(linkError)}
            error-message=${linkError || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} autocomplete="url" inputmode="url"></sf-input>
          <div class="sf-rich-text-link-actions flex items-cross-center">
            <sf-button class="sf-rich-text-link-apply" size=${linkSize} @click=${() => component.applyLinkFromPanel()}>${component.sfWord('link-apply')}</sf-button>
            ${linkExisting ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button class="sf-rich-text-link-remove" size=${linkSize} appearance="outline" @click=${() => component.removeLinkFromPanel()}>${component.sfWord('link-remove')}</sf-button>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          </div>
        </div>
      </sf-popover>`;
  }); // The toolbar's groups stand in the order of importance (owner decision
  // C141 (4)): the text levels, then bold, italic and link (priority 1), then
  // the lists and the quote (2), then undo and redo (3). What does not fit one
  // row leaves for ⋯ «Ещё» at its end -- everywhere, not only on a phone
  // (R233, owner decision C155): whole groups with their separator, the
  // highest data-sf-priority first; the groups of priority 1 stay
  // (core/js/overflow-row.js, laid out by the element). overflow="wrap" keeps
  // the row that wraps.


  const separator = (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-rich-text-separator" aria-hidden="true"></span>`;
  const more = context.overflow === 'more'; // The text levels are one menu button with the current level and a radio
  // menu (owner decision C155 (5)): «Абзац ▾», first in the row.

  const level = context.level || 'paragraph';
  const levelsUnavailable = Boolean(context.state?.inList);
  const levels = (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<button
      type="button"
      class="sf-rich-text-tool sf-rich-text-levels sf-button sf-button--size-${buttonSize} sf-button--ghost sf-button--on-surface flex items-cross-center"
      data-sf-tool="levels"
      tabindex=${context.roving === 'levels' ? '0' : '-1'}
      aria-haspopup="menu"
      aria-expanded="false"
      aria-label=${`${component.sfWord('text-level')}: ${component.sfWord(level)}`}
      title=${component.sfWord('text-level')}
      aria-disabled=${levelsUnavailable ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      ?disabled=${disabled || readonly}
    ><span class="sf-button-text-container" aria-hidden="true">${component.sfWord(level)}</span><i class="sf-icon" aria-hidden="true">expand_more</i></button>`;
  const moreTool = more ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-rich-text-separator sf-rich-text-more-separator sf-rich-text-out" aria-hidden="true"></span><button
        type="button"
        class="sf-rich-text-tool sf-rich-text-more sf-icon-button sf-icon-button--icon sf-icon-button--ghost sf-icon-button--on-surface sf-icon-button--size-${buttonSize} flex items-cross-center sf-rich-text-out"
        data-sf-tool="more"
        tabindex=${context.roving === 'more' ? '0' : '-1'}
        aria-haspopup="menu"
        aria-expanded="false"
        aria-label=${component.sfWord('more')}
        title=${component.sfWord('more')}
        ?disabled=${disabled || readonly}
      ><i class="sf-icon" aria-hidden="true">more_horiz</i></button>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing; // The message line: the hint, or the error in its place; with the count
  // (C141 (1)) they share one row, the count at the end.

  const messageNode = message ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span id=${field.messageId} class="sf-rich-text-hint-text-wrap"
        data-field-message=${field.invalid && errorMessage ? 'error' : 'hint'}>${message}</span>` : '';
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div class=${rootClasses.join(' ')} style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      @pointerdown=${event => component.onRootPointerDown(event)}
      @focusout=${event => component.onRootFocusOut(event)}>
      ${label ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-rich-text-label flex" id=${labelId} @click=${() => component.focus()}>
            <span class="sf-rich-text-text">${label}</span>
            ${required ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-rich-text-required" aria-hidden="true">*</span>` : ''}
            ${(0,_helpers_field_help__WEBPACK_IMPORTED_MODULE_1__.renderFieldHelp)({
    help: context.help,
    label,
    size,
    className: 'sf-rich-text-help',
    component
  })}
          </span>` : ''}
      <div class="sf-rich-text-frame flex flex-col"
        style=${`--sf-rich-text--rows: ${rows};${maxRows ? ` --sf-rich-text--max-rows: ${maxRows};` : ''}`}>
        ${readonly ? '' : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class=${more ? 'sf-rich-text-toolbar sf-rich-text-toolbar--more flex items-cross-center' : 'sf-rich-text-toolbar flex flex-wrap items-cross-center'} role="toolbar" id=${toolbarId}
          aria-label=${component.sfWord('toolbar')} aria-controls=${field.controlId}
          aria-disabled=${disabled || readonly ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          @mousedown=${event => component.onToolbarMouseDown(event)}
          @click=${event => component.onToolbarClick(event)}
>
          <div class="sf-rich-text-group flex items-cross-center" role="group" data-sf-priority="1">${levels}</div>
          ${separator}
          <div class="sf-rich-text-group flex items-cross-center" role="group" data-sf-priority="1">${group(['bold', 'italic', 'link'])}</div>
          ${separator}
          <div class="sf-rich-text-group flex items-cross-center" role="group" data-sf-priority="2">${group(['bulleted-list', 'numbered-list', 'quote'])}</div>
          ${separator}
          <div class="sf-rich-text-group flex items-cross-center" role="group" data-sf-priority="3">${group(['undo', 'redo'])}</div>
          ${moreTool}
        </div>`}
        <div
          class="sf-rich-text-editor"
          id=${field.controlId}
          role="textbox"
          aria-multiline="true"
          contenteditable=${disabled || readonly ? 'false' : 'true'}
          tabindex=${disabled ? '-1' : '0'}
          spellcheck="true"
          translate="no"
          aria-labelledby=${label ? labelId : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          aria-label=${!label && ariaLabel ? ariaLabel : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          aria-placeholder=${placeholder || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          data-placeholder=${placeholder || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          aria-required=${field.required ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          aria-readonly=${readonly ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          aria-disabled=${disabled ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          aria-invalid=${field.invalid ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          aria-describedby=${describedBy || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          aria-errormessage=${field.invalid && errorMessage ? field.messageId : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        ></div>
      </div>
      ${count ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-rich-text-message flex">${messageNode}<span id=${countId} class="sf-rich-text-count">${count}</span></span>` : messageNode}${counted ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-rich-text-count-said" aria-live="polite">${countSaid}</span>` : ''}
    </div>
  `;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "2369556fe449"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


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

/***/ "deb1a4d61565"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("smart-base", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("smart-base", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "e19611ff78cb"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PASTE_BLOCKS: () => (/* binding */ PASTE_BLOCKS),
/* harmony export */   RICH_TEXT_BLOCKS: () => (/* binding */ RICH_TEXT_BLOCKS),
/* harmony export */   RICH_TEXT_ELEMENTS: () => (/* binding */ RICH_TEXT_ELEMENTS),
/* harmony export */   RICH_TEXT_PROFILES: () => (/* binding */ RICH_TEXT_PROFILES),
/* harmony export */   RICH_TEXT_SCHEMES: () => (/* binding */ RICH_TEXT_SCHEMES),
/* harmony export */   cleanTree: () => (/* binding */ cleanTree),
/* harmony export */   decodeEntities: () => (/* binding */ decodeEntities),
/* harmony export */   parseHtml: () => (/* binding */ parseHtml),
/* harmony export */   plainText: () => (/* binding */ plainText),
/* harmony export */   richTextFromPlainText: () => (/* binding */ richTextFromPlainText),
/* harmony export */   richTextHref: () => (/* binding */ richTextHref),
/* harmony export */   sanitizeRichText: () => (/* binding */ sanitizeRichText),
/* harmony export */   serialize: () => (/* binding */ serialize),
/* harmony export */   treeFromDom: () => (/* binding */ treeFromDom)
/* harmony export */ });
// The HTML subset of sf-rich-text: what the value may hold, and how anything
// else is brought into it. Larena stores page text as a property of type
// html@1, and this module is that type's rule in the browser: the editor
// cleans the value it is given, every paste and drop, and its own DOM after
// every edit and command, through the one function here.
//
// The subset:
//
//   p  h2  h3  h4  strong  em  a[href]  ul  ol  li  blockquote  br
//
// - no attribute is kept but href on <a>;
// - href is kept for https:, mailto: and tel: URLs and for a site path
//   ("/docs/a"), judged after removing control characters and white space, so
//   "java\tscript:" does not pass; "//host" and "/\host" leave the site and
//   are not kept; a link whose href is not kept becomes its text;
// - script, style and the other containers whose content is not text for a
//   reader (DROPPED) go with their content; any other element is unwrapped,
//   and its text stays; one that stands as a block (div, section, table, a
//   cell, h1, pre) still separates its text from its neighbours';
// - b and i are strong and em, and a span whose style is bold or italic is
//   too (a word processor's paste); a b whose style says normal is not;
// - text outside a block is wrapped in p, a block inside a paragraph splits
//   it, a block inside a list item becomes a line of it (br), a list holds
//   only items, adjacent lists of one kind are one list;
// - the value has no empty block, no line break at a block's edge and no
//   white space between blocks; an editor with no text is "".
//
// Two readers feed one cleaner: `treeFromDom` reads a DOM (the editor, or a
// paste parsed by the browser in an inert <template>), `parseHtml` reads a
// string without a DOM (a server, a test). Neither ever assigns the input to
// a live element. What comes out is written by `serialize` from the cleaned
// model, every text escaped, so it holds nothing the subset does not allow
// whatever the reader understood.
//
// No imports and no state: the element and the contract tests use the same
// functions.
//
// The paste profile (simai/ui-source#66). html@1 is a stored type, so it does
// not grow: a value never holds pre or table. A structured-content editor
// reads a paste with cleanTree(tree, {profile: 'paste'}), which is html@1
// plus two blocks the profile maps to its own types instead of flattening
// them into paragraphs:
//
//   {type: 'pre', text}            a code block: its text with its line
//                                  breaks and indentation (-> content.code)
//   {type: 'table', caption, rows} a simple table: rows of {head, cells},
//                                  each cell {header, leaves} with the
//                                  subset's inline leaves (-> content.table)
//
// Everything inside them is cleaned by the same rule: the same marks, the
// same href check, DROPPED goes with its content. A pre or a table inside a
// list item, and a table inside a cell, are read as html@1 reads them.
// serialize writes the two in html@1 terms (lines of a paragraph, a
// paragraph per cell), so whatever comes out of it is still the subset.
//
// The module lives in the core runtime since content.html 1.0.0: the
// Composition renderer sanitises a content.html block through it at render,
// so a page that only renders a Document needs no Smart component.
// src/smart/input-rich/js/rich-text-html.mjs re-exports it for sf-rich-text and
// the field renderers; there is one rule, here.

const RICH_TEXT_ELEMENTS = Object.freeze(['p', 'h2', 'h3', 'h4', 'strong', 'em', 'a', 'ul', 'ol', 'li', 'blockquote', 'br']);
const RICH_TEXT_BLOCKS = Object.freeze(['p', 'h2', 'h3', 'h4']);
const RICH_TEXT_SCHEMES = Object.freeze(['https:', 'mailto:', 'tel:']);
// The profiles cleanTree reads by: html@1 itself, and the paste profile of a
// structured-content editor, which keeps PASTE_BLOCKS as blocks of their own.
const RICH_TEXT_PROFILES = Object.freeze(['html', 'paste']);
const PASTE_BLOCKS = Object.freeze(['pre', 'table']);

// Dropped with everything inside: their content is code, a document's head,
// a drawing, or a control's own data, not text for a reader.
const DROPPED = new Set([
  'script', 'style', 'template', 'head', 'title', 'meta', 'link', 'base', 'noscript',
  'iframe', 'frame', 'frameset', 'noembed', 'noframes', 'object', 'embed', 'applet',
  'svg', 'math', 'canvas', 'video', 'audio', 'img', 'picture', 'source', 'track',
  'input', 'select', 'textarea', 'xmp', 'plaintext',
]);

// Elements off the subset that stand as blocks: unwrapped, but their text is
// not run together with the text around them.
const BREAKING = new Set([
  'address', 'article', 'aside', 'body', 'caption', 'center', 'dd', 'details', 'dialog', 'dir', 'div',
  'dl', 'dt', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h5', 'h6', 'header',
  'hgroup', 'hr', 'html', 'legend', 'listing', 'main', 'menu', 'nav', 'optgroup', 'option', 'pre',
  'section', 'summary', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr',
]);

const LISTS = new Set(['ul', 'ol']);
const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
// Raw text: what follows the start tag up to its end tag is not markup.
const RAW = new Set(['script', 'style', 'textarea', 'title', 'xmp', 'iframe', 'noembed', 'noframes', 'noscript']);
// Where an implied </p> stops looking for the paragraph (the parser's button scope).
const P_SCOPE = new Set(['td', 'th', 'table', 'caption', 'button']);

// C0 controls, DEL and C1 controls: a browser ignores them inside a scheme.
// eslint-disable-next-line no-control-regex -- matching control characters is the point
const CONTROLS = /[\u0000-\u001f\u007f-\u009f]/gu;
// ...and white space, which a browser also skips around and inside a scheme.
// eslint-disable-next-line no-control-regex -- matching control characters is the point
const CONTROLS_AND_SPACE = /[\u0000- \u007f-\u009f\u00a0\u1680\u2000-\u200b\u2028\u2029\u202f\u205f\u3000\ufeff]/gu;
const HREF_MAX = 2048;

/**
 * The href sf-rich-text keeps, or null: https:, mailto: and tel: URLs and a
 * path on the site ("/docs/a", "/docs?q=1#a"). "//host", "/\host", http:,
 * javascript:, data: and anything else are not kept.
 * @param {unknown} value
 * @returns {string|null}
 */
function richTextHref(value) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > HREF_MAX) return null;
  const compact = trimmed.replace(CONTROLS_AND_SPACE, '');
  if (!compact) return null;
  if (compact.startsWith('/')) {
    // A site path, but not "//host" or "/\host", which leave the site.
    if (/^\/[/\\]/u.test(compact)) return null;
    const path = trimmed.replace(CONTROLS, '');
    return /^\/[/\\]/u.test(path) ? null : path;
  }
  const scheme = /^([a-z][a-z0-9+.-]*):/iu.exec(compact)?.[1]?.toLowerCase();
  if (!scheme || !RICH_TEXT_SCHEMES.includes(`${scheme}:`)) return null;
  let url;
  try {
    url = new globalThis.URL(trimmed.replace(CONTROLS, ''));
  } catch {
    return null;
  }
  if (url.protocol !== `${scheme}:`) return null;
  if (url.protocol === 'https:' && !url.hostname) return null;
  if (url.protocol !== 'https:' && url.href.length <= url.protocol.length) return null;
  return url.href;
}

// ---------------------------------------------------------------- entities

const NAMED = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: '\u00a0', shy: '\u00ad',
  hellip: '\u2026', mdash: '\u2014', ndash: '\u2013', minus: '\u2212', laquo: '\u00ab', raquo: '\u00bb',
  lsquo: '\u2018', rsquo: '\u2019', sbquo: '\u201a', ldquo: '\u201c', rdquo: '\u201d', bdquo: '\u201e',
  bull: '\u2022', middot: '\u00b7', copy: '\u00a9', reg: '\u00ae', trade: '\u2122', deg: '\u00b0',
  times: '\u00d7', divide: '\u00f7', plusmn: '\u00b1', euro: '\u20ac', pound: '\u00a3', yen: '\u00a5',
  cent: '\u00a2', sect: '\u00a7', para: '\u00b6', thinsp: '\u2009', ensp: '\u2002', emsp: '\u2003',
  zwj: '\u200d', zwnj: '\u200c', larr: '\u2190', rarr: '\u2192', uarr: '\u2191', darr: '\u2193',
  numero: '\u2116', prime: '\u2032', Prime: '\u2033',
};

function decodeEntities(text) {
  return String(text).replace(/&(#x[0-9a-f]+|#[0-9]+|[a-z][a-z0-9]*);?/giu, (whole, body) => {
    if (body[0] === '#') {
      const code = body[1] === 'x' || body[1] === 'X' ? Number.parseInt(body.slice(2), 16) : Number.parseInt(body.slice(1), 10);
      if (!Number.isFinite(code) || code <= 0 || code > 0x10ffff || (code >= 0xd800 && code <= 0xdfff)) return '\ufffd';
      return String.fromCodePoint(code);
    }
    return Object.hasOwn(NAMED, body) && whole.endsWith(';') ? NAMED[body] : whole;
  });
}

// ---------------------------------------------------------------- readers

// The raw tree both readers give: {type: 'element', name, attrs, children}
// and {type: 'text', value}. Only href and style are read from attributes.

/**
 * Reads an HTML string into the raw tree, without a DOM. Tolerant the way a
 * browser is for what matters here: implied ends of p and li, void elements,
 * raw-text elements, comments, entities in text and attributes.
 * @param {string} html
 */
function parseHtml(html) {
  const source = typeof html === 'string' ? html : '';
  const root = {type: 'element', name: '#root', attrs: {}, children: []};
  const stack = [root];
  const top = () => stack[stack.length - 1];
  const append = (node) => top().children.push(node);
  const appendText = (value) => {
    if (!value) return;
    const last = top().children.at(-1);
    if (last?.type === 'text') last.value += value;
    else append({type: 'text', value});
  };
  const closeTo = (name, stopAt = null) => {
    for (let index = stack.length - 1; index > 0; index -= 1) {
      const open = stack[index].name;
      if (stopAt && stopAt.has(open)) return false;
      if (open === name) {
        stack.length = index;
        return true;
      }
    }
    return false;
  };
  let at = 0;
  const length = source.length;
  while (at < length) {
    const lt = source.indexOf('<', at);
    if (lt < 0) {
      appendText(decodeEntities(source.slice(at)));
      break;
    }
    if (lt > at) appendText(decodeEntities(source.slice(at, lt)));
    at = lt;
    if (source.startsWith('<!--', at)) {
      const end = source.indexOf('-->', at + 4);
      at = end < 0 ? length : end + 3;
      continue;
    }
    const next = source[at + 1] ?? '';
    if (next === '!' || next === '?') {
      const end = source.indexOf('>', at + 2);
      at = end < 0 ? length : end + 1;
      continue;
    }
    if (next === '/') {
      const match = /^<\/([a-z][a-z0-9-]*)[^>]*>?/iu.exec(source.slice(at));
      if (!match) {
        // "</" not followed by a name is a bogus comment.
        const end = source.indexOf('>', at + 2);
        at = end < 0 ? length : end + 1;
        continue;
      }
      at += match[0].length;
      const name = match[1].toLowerCase();
      if (name === 'br') append({type: 'element', name: 'br', attrs: {}, children: []});
      else if (name === 'p' && !closeTo('p', P_SCOPE)) {
        // A </p> without a <p> is an empty paragraph, as a browser reads it.
        append({type: 'element', name: 'p', attrs: {}, children: []});
      } else closeTo(name);
      continue;
    }
    const tag = /^<([a-z][a-z0-9-]*)/iu.exec(source.slice(at));
    if (!tag) {
      appendText('<');
      at += 1;
      continue;
    }
    at += tag[0].length;
    const name = tag[1].toLowerCase();
    const attrs = {};
    let selfClosing = false;
    // Attributes, up to the closing ">".
    while (at < length) {
      const space = /^[\s/]+/u.exec(source.slice(at));
      if (space) {
        if (space[0].includes('/') && source[at + space[0].length] === '>') selfClosing = true;
        at += space[0].length;
        continue;
      }
      if (source[at] === '>') {
        at += 1;
        break;
      }
      const attr = /^([^\s/>"'=][^\s/>"'=]*)(?:\s*=\s*(?:"([^"]*)"?|'([^']*)'?|([^\s>]*)))?/u.exec(source.slice(at));
      if (!attr) {
        at += 1;
        continue;
      }
      at += attr[0].length;
      const key = attr[1].toLowerCase();
      if (!Object.hasOwn(attrs, key)) attrs[key] = decodeEntities(attr[2] ?? attr[3] ?? attr[4] ?? '');
    }
    const element = {type: 'element', name, attrs, children: []};
    if (name === 'li') closeTo('li', LISTS);
    // A block start ends an open paragraph (the browser's implied </p>).
    if (RICH_TEXT_BLOCKS.includes(name) || LISTS.has(name) || name === 'blockquote' || BREAKING.has(name)) closeTo('p', P_SCOPE);
    append(element);
    if (name === 'plaintext') {
      at = length;
      break;
    }
    if (RAW.has(name)) {
      const close = new RegExp(`</${name}[\\s/>]`, 'iu').exec(source.slice(at));
      const end = close ? at + close.index : length;
      if (name === 'textarea' || name === 'title') element.children.push({type: 'text', value: decodeEntities(source.slice(at, end))});
      else element.children.push({type: 'text', value: source.slice(at, end)});
      const gt = close ? source.indexOf('>', end) : -1;
      at = gt < 0 ? length : gt + 1;
      continue;
    }
    if (!VOID.has(name) && !selfClosing) stack.push(element);
  }
  return root;
}

const HTML_NS = 'http://www.w3.org/1999/xhtml';

/**
 * Reads a DOM subtree (an element, a fragment, a template's content) into the
 * raw tree. Elements outside the HTML namespace are dropped.
 * @param {Node} node
 */
function treeFromDom(node) {
  const read = (current) => {
    if (current.nodeType === 3) return {type: 'text', value: current.data};
    if (current.nodeType === 11) return {type: 'element', name: '#root', attrs: {}, children: [...current.childNodes].map(read).filter(Boolean)};
    if (current.nodeType !== 1) return null;
    if (current.namespaceURI && current.namespaceURI !== HTML_NS) return null;
    const name = current.localName;
    if (DROPPED.has(name)) return null;
    const attrs = {};
    const href = current.getAttribute('href');
    if (href !== null) attrs.href = href;
    const style = current.getAttribute('style');
    if (style !== null) attrs.style = style;
    const children = name === 'template' ? [] : [...current.childNodes].map(read).filter(Boolean);
    return {type: 'element', name, attrs, children};
  };
  const tree = read(node);
  if (!tree || tree.type !== 'element') return {type: 'element', name: '#root', attrs: {}, children: tree ? [tree] : []};
  return {...tree, name: '#root'};
}

// ---------------------------------------------------------------- the cleaner

// What a style says of the marks: {strong: true|false|undefined, em: ...}.
function styleMarks(style) {
  const out = {};
  if (!style) return out;
  const weight = /(?:^|;)\s*font-weight\s*:\s*([^;!]+)/iu.exec(style)?.[1]?.trim().toLowerCase();
  if (weight) {
    if (weight === 'bold' || weight === 'bolder' || Number(weight) >= 600) out.strong = true;
    else if (weight === 'normal' || weight === 'lighter' || Number(weight) < 600) out.strong = false;
  }
  const fontStyle = /(?:^|;)\s*font-style\s*:\s*([^;!]+)/iu.exec(style)?.[1]?.trim().toLowerCase();
  if (fontStyle) {
    if (fontStyle === 'italic' || fontStyle.startsWith('oblique')) out.em = true;
    else if (fontStyle === 'normal') out.em = false;
  }
  return out;
}

function marksOf(element, marks) {
  const next = {...marks};
  if (element.name === 'strong' || element.name === 'b') next.strong = true;
  if (element.name === 'em' || element.name === 'i') next.em = true;
  const styled = styleMarks(element.attrs?.style);
  if (styled.strong !== undefined) next.strong = styled.strong;
  if (styled.em !== undefined) next.em = styled.em;
  return next;
}

// A leaf of inline content: {kind: 'text', value, strong, em, href} or
// {kind: 'br', strong, em, href}.
const leaf = (kind, value, context) => ({kind, value, strong: Boolean(context.marks.strong), em: Boolean(context.marks.em), href: context.href || null});

// A flow (the root, a quote) collects blocks; a list item collects its own
// content. Text comes in as leaves into the current run; a block ends the
// run.
class Flow {
  constructor(kind) {
    this.kind = kind;
    this.blocks = [];
    this.run = [];
    this.types = ['p'];
    this.starts = [0];
    this.needBreak = false;
  }

  inline(item) {
    if (this.kind === 'item' && this.needBreak && this.run.length > 0) {
      if (!(item.kind === 'text' && !item.value.trim())) {
        this.run.push({kind: 'br', strong: false, em: false, href: null});
        this.needBreak = false;
      }
    }
    this.run.push(item);
  }

  flush() {
    if (!this.run.length) return;
    if (this.kind === 'item') {
      this.blocks.push({type: 'inline', leaves: this.run});
    } else {
      this.blocks.push({type: this.types[this.types.length - 1], leaves: this.run});
    }
    this.run = [];
  }

  // A paragraph or heading starts (or a block off the subset): the text so
  // far is one block, and what follows belongs to the new one.
  open(type) {
    if (this.kind === 'item') {
      this.needBreak = true;
      return;
    }
    this.flush();
    this.types.push(type);
    this.starts.push(this.blocks.length);
  }

  // keepEmpty: a paragraph or heading of the subset that held nothing is
  // still a block (the editing surface keeps it; the value drops it).
  close(keepEmpty = false) {
    if (this.kind === 'item') {
      this.needBreak = true;
      return;
    }
    const start = this.starts[this.starts.length - 1];
    if (keepEmpty && !this.run.length && this.blocks.length === start) this.blocks.push({type: this.types[this.types.length - 1], leaves: []});
    this.flush();
    if (this.types.length > 1) {
      this.types.pop();
      this.starts.pop();
    }
  }

  block(block) {
    this.flush();
    this.blocks.push(block);
    this.needBreak = false;
  }
}

function walkText(value, flow, context) {
  if (context.pre) {
    const lines = value.replace(/\r\n?/gu, '\n').split('\n');
    lines.forEach((line, index) => {
      if (index > 0) flow.inline(leaf('br', '', context));
      if (line) flow.inline(leaf('text', line.replace(/[\t\f]/gu, ' '), context));
    });
    return;
  }
  const text = value.replace(/[\t\n\r\f ]+/gu, ' ');
  if (!text) return;
  // White space between blocks is formatting of the source, not text.
  if (text === ' ' && !flow.run.length) return;
  flow.inline(leaf('text', text, context));
}

function walkChildren(children, flow, context) {
  for (const child of children) walk(child, flow, context);
}

function walk(node, flow, context) {
  if (node.type === 'text') {
    walkText(node.value, flow, context);
    return;
  }
  const name = node.name;
  if (DROPPED.has(name)) return;
  if (name === 'br') {
    flow.inline(leaf('br', '', context));
    return;
  }
  const inner = {...context, marks: marksOf(node, context.marks)};
  if (name === 'a') {
    const href = richTextHref(node.attrs?.href);
    walkChildren(node.children, flow, href && !context.href ? {...inner, href} : inner);
    return;
  }
  if (RICH_TEXT_BLOCKS.includes(name)) {
    flow.open(name);
    walkChildren(node.children, flow, inner);
    flow.close(true);
    return;
  }
  if (LISTS.has(name)) {
    const list = readList(node, inner, name);
    if (list.items.length) flow.block(list);
    return;
  }
  if (name === 'blockquote') {
    if (flow.kind === 'item') {
      flow.open('p');
      walkChildren(node.children, flow, inner);
      flow.close();
      return;
    }
    const quote = new Flow('flow');
    walkChildren(node.children, quote, inner);
    quote.flush();
    flow.block({type: 'blockquote', blocks: quote.blocks});
    return;
  }
  if (name === 'li') {
    // An item outside a list is a paragraph of its own.
    flow.open('p');
    walkChildren(node.children, flow, inner);
    flow.close();
    return;
  }
  if (context.paste && flow.kind !== 'item' && (name === 'pre' || name === 'listing')) {
    flow.block({type: 'pre', text: preText(node)});
    return;
  }
  if (context.paste && flow.kind !== 'item' && name === 'table') {
    flow.block(readTable(node, inner));
    return;
  }
  if (BREAKING.has(name)) {
    flow.open('p');
    walkChildren(node.children, flow, name === 'pre' || name === 'listing' ? {...inner, pre: true} : inner);
    flow.close();
    return;
  }
  // Any other element: its text, in place.
  walkChildren(node.children, flow, inner);
}

// The text of a pre as it stands: line breaks and indentation kept, a <br> a
// line break, what DROPPED names gone. The newline right after <pre> is the
// markup's, as a browser reads it; trailing blank lines are not code.
function preText(node) {
  const read = (current) => {
    if (current.type === 'text') return current.value;
    if (DROPPED.has(current.name)) return '';
    if (current.name === 'br') return '\n';
    return current.children.map(read).join('');
  };
  return node.children.map(read).join('')
    .replace(/\r\n?/gu, '\n')
    .replace(/\u00a0/gu, ' ')
    .replace(/^\n/u, '')
    .replace(/\s+$/u, '');
}

// A simple table: thead, tbody, tfoot and rows straight in the table, cells
// th and td; a cell's content is inline leaves, its paragraphs and list items
// lines of it. colspan and rowspan are not read: a cell is one cell.
function readTable(node, context) {
  const table = {type: 'table', caption: [], rows: []};
  const readRow = (row, head) => {
    const cells = [];
    for (const cell of row.children) {
      if (cell.type !== 'element' || (cell.name !== 'td' && cell.name !== 'th')) continue;
      const flow = new Flow('item');
      walkChildren(cell.children, flow, {...context, marks: marksOf(cell, context.marks)});
      flow.flush();
      cells.push({header: cell.name === 'th', leaves: flatLeaves(flow.blocks)});
    }
    if (cells.length) table.rows.push({head, cells});
  };
  const readSection = (section, head) => {
    for (const child of section.children) {
      if (child.type === 'element' && child.name === 'tr') readRow(child, head);
    }
  };
  for (const child of node.children) {
    if (child.type !== 'element') continue;
    if (child.name === 'caption') {
      const flow = new Flow('item');
      walkChildren(child.children, flow, context);
      flow.flush();
      table.caption = flatLeaves(flow.blocks);
    } else if (child.name === 'thead') readSection(child, true);
    else if (child.name === 'tbody' || child.name === 'tfoot') readSection(child, false);
    else if (child.name === 'tr') readRow(child, false);
  }
  return table;
}

// An item's parts as one line of leaves: a nested list's items are lines too.
function flatLeaves(parts) {
  const out = [];
  const add = (leaves) => {
    if (!leaves.length) return;
    if (out.length) out.push({kind: 'br', strong: false, em: false, href: null});
    out.push(...leaves);
  };
  const visit = (part) => {
    if (part.type === 'inline') add(part.leaves);
    else for (const item of part.items) item.children.forEach(visit);
  };
  parts.forEach(visit);
  return out;
}

function readItem(node, context) {
  const flow = new Flow('item');
  walkChildren(node.children, flow, context);
  flow.flush();
  return {children: flow.blocks};
}

function readList(node, context, type) {
  const list = {type, items: []};
  let loose = null;
  const endLoose = () => {
    if (loose) {
      loose.flush();
      list.items.push({children: loose.blocks});
      loose = null;
    }
  };
  for (const child of node.children) {
    if (child.type === 'element' && child.name === 'li') {
      endLoose();
      list.items.push(readItem(child, context));
      continue;
    }
    if (child.type === 'element' && LISTS.has(child.name)) {
      endLoose();
      // A list right inside a list (what an indent command leaves) belongs to
      // the item before it.
      const nested = readList(child, {...context, marks: marksOf(child, context.marks)}, child.name);
      if (!nested.items.length) continue;
      const previous = list.items.at(-1);
      if (previous) previous.children.push(nested);
      else list.items.push({children: [nested]});
      continue;
    }
    if (child.type === 'text' && !child.value.trim()) continue;
    if (child.type === 'element' && DROPPED.has(child.name)) continue;
    // Loose content in a list is an item.
    loose ??= new Flow('item');
    walk(child, loose, context);
  }
  endLoose();
  return list;
}

// ---------------------------------------------------------------- tidying

const SPACE = ' ';
const sameFormat = (a, b) => a.strong === b.strong && a.em === b.em && a.href === b.href;

// Inline leaves made canonical: adjacent text of one format joined, runs of
// spaces made one, spaces at the edges and around a line break removed, a link
// with nothing but spaces made text.
//
// The steps run again until a pass changes nothing (2026-11-11 acceptance,
// M2): dropping a space or an empty run makes new neighbours, so one pass left
// "<p>a <em><br>n</em></p>" for the next load-and-save to make
// "<p>a<em><br>n</em></p>". The stored value is the fixed point at once.
function tidyLeaves(leaves, mode) {
  let current = leaves;
  let key = null;
  for (let pass = 0; pass < 64; pass += 1) {
    current = tidyLeavesOnce(current, mode);
    const next = JSON.stringify(current);
    if (next === key) break;
    key = next;
  }
  return current;
}

function tidyLeavesOnce(leaves, mode) {
  const out = [];
  for (const item of leaves) {
    if (item.kind === 'text' && !item.value) continue;
    const last = out.at(-1);
    if (item.kind === 'text' && last?.kind === 'text' && sameFormat(last, item)) {
      last.value += item.value;
    } else {
      out.push({...item});
    }
  }
  // One space between words, whatever the leaves.
  for (let index = 0; index < out.length; index += 1) {
    const item = out[index];
    if (item.kind !== 'text') continue;
    item.value = item.value.replace(/ {2,}/gu, SPACE);
    const previous = out[index - 1];
    if (item.value.startsWith(SPACE) && (!previous || previous.kind === 'br' || (previous.kind === 'text' && previous.value.endsWith(SPACE)))) {
      item.value = item.value.slice(1);
    }
    const next = out[index + 1];
    if (item.value.endsWith(SPACE) && (!next || next.kind === 'br')) item.value = item.value.slice(0, -1);
  }
  let kept = out.filter((item) => item.kind === 'br' || item.value);
  if (mode === 'value') {
    // Edge breaks and edge white space go together, until neither is left: a
    // run of only white space (&nbsp;) at an edge hid the break behind it, so
    // the first pass kept "<p>&nbsp;<br>a</p>" as "<p><br>a</p>" and only the
    // next load-and-save gave "<p>a</p>" (2026-11-10 review, Q6). The value is
    // now what that second pass gave, at once, and cleaning it again keeps it.
    let length = -1;
    while (length !== kept.length) {
      length = kept.length;
      while (kept[0]?.kind === 'br') kept.shift();
      while (kept.at(-1)?.kind === 'br') kept.pop();
      if (kept[0]?.kind === 'text') kept[0].value = kept[0].value.replace(/^[\s\u00a0]+/u, '');
      const end = kept.at(-1);
      if (end?.kind === 'text') end.value = end.value.replace(/[\s\u00a0]+$/u, '');
      kept = kept.filter((item) => item.kind === 'br' || item.value);
    }
  }
  // A link of nothing but spaces is not a link.
  const groups = new Map();
  for (const item of kept) {
    if (!item.href) continue;
    groups.set(item.href, (groups.get(item.href) || '') + (item.kind === 'text' ? item.value : 'x'));
  }
  for (const item of kept) if (item.href && !groups.get(item.href).trim()) item.href = null;
  // Join again: dropping spaces and links may have made neighbours alike.
  const joined = [];
  for (const item of kept) {
    const last = joined.at(-1);
    if (item.kind === 'text' && last?.kind === 'text' && sameFormat(last, item)) last.value += item.value;
    else joined.push(item);
  }
  return joined;
}

const hasText = (leaves) => leaves.some((item) => item.kind === 'text' && item.value.replace(/[\s\u00a0]+/gu, '') !== '');

function tidyItem(item, mode) {
  const children = [];
  for (const part of item.children) {
    if (part.type === 'inline') {
      const leaves = tidyLeaves(part.leaves, mode);
      if (!leaves.length) continue;
      const last = children.at(-1);
      if (last?.type === 'inline') last.leaves = tidyLeaves([...last.leaves, {kind: 'br', strong: false, em: false, href: null}, ...leaves], mode);
      else children.push({type: 'inline', leaves});
    } else {
      const list = tidyList(part, mode);
      if (!list) continue;
      const last = children.at(-1);
      if (last && last.type === list.type) last.items.push(...list.items);
      else children.push(list);
    }
  }
  if (mode === 'value') {
    const filtered = children.filter((part) => part.type !== 'inline' || hasText(part.leaves));
    return filtered.length ? {children: filtered} : null;
  }
  if (!children.length || children[0].type !== 'inline') children.unshift({type: 'inline', leaves: [{kind: 'br', strong: false, em: false, href: null}]});
  return {children};
}

function tidyList(list, mode) {
  const items = list.items.map((item) => tidyItem(item, mode)).filter(Boolean);
  return items.length ? {type: list.type, items} : null;
}

function tidyBlocks(blocks, mode) {
  const out = [];
  for (const block of blocks) {
    let tidy = null;
    if (block.type === 'blockquote') {
      const inner = tidyBlocks(block.blocks, mode);
      if (inner.length) tidy = {type: 'blockquote', blocks: inner};
      else if (mode === 'editor') tidy = {type: 'blockquote', blocks: [{type: 'p', leaves: [{kind: 'br', strong: false, em: false, href: null}]}]};
    } else if (LISTS.has(block.type)) {
      tidy = tidyList(block, mode);
    } else if (block.type === 'pre') {
      if (block.text.trim()) tidy = {type: 'pre', text: block.text};
    } else if (block.type === 'table') {
      // A row with no text in any cell is not kept, as an empty paragraph is not.
      const rows = block.rows.map((row) => ({head: row.head, cells: row.cells.map((cell) => ({header: cell.header, leaves: tidyLeaves(cell.leaves, 'value')}))}))
        .filter((row) => row.cells.some((cell) => hasText(cell.leaves)));
      if (rows.length) tidy = {type: 'table', caption: tidyLeaves(block.caption, 'value'), rows};
    } else {
      const leaves = tidyLeaves(block.leaves, mode);
      if (mode === 'value') {
        if (hasText(leaves)) tidy = {type: block.type, leaves};
      } else {
        tidy = {type: block.type, leaves: leaves.length ? leaves : [{kind: 'br', strong: false, em: false, href: null}]};
      }
    }
    if (!tidy) continue;
    const last = out.at(-1);
    // Adjacent lists of one kind are one list.
    if (last && LISTS.has(tidy.type) && last.type === tidy.type) last.items.push(...tidy.items);
    else out.push(tidy);
  }
  return out;
}

/**
 * The raw tree cleaned into blocks.
 * mode "value": the stored form -- no empty block, no break at an edge.
 * mode "editor": what the editing surface holds -- an empty block keeps a
 *   <br> so the caret has a line, breaks the person typed stay.
 */
function cleanTree(tree, {mode = 'value', profile = 'html'} = {}) {
  if (!RICH_TEXT_PROFILES.includes(profile)) throw new TypeError(`rich_text_profile_unknown: ${profile}`);
  const flow = new Flow('flow');
  walkChildren(tree.children ?? [], flow, {marks: {}, href: null, pre: false, paste: profile === 'paste'});
  flow.flush();
  const blocks = tidyBlocks(flow.blocks, mode);
  if (mode === 'editor' && !blocks.length) return [{type: 'p', leaves: [{kind: 'br', strong: false, em: false, href: null}]}];
  return blocks;
}

// ---------------------------------------------------------------- writing

const escapeText = (text) => text.replace(/&/gu, '&amp;').replace(/</gu, '&lt;').replace(/>/gu, '&gt;').replace(/\u00a0/gu, '&nbsp;');
const escapeAttribute = (text) => text.replace(/&/gu, '&amp;').replace(/"/gu, '&quot;').replace(/</gu, '&lt;').replace(/>/gu, '&gt;').replace(/\u00a0/gu, '&nbsp;');

// Leaves to markup, nested a > strong > em, each run of one format once.
function writeLeaves(leaves) {
  const writeGroup = (items, level) => {
    let out = '';
    let at = 0;
    const key = ['href', 'strong', 'em'][level];
    while (at < items.length) {
      const value = key ? items[at][key] : null;
      let end = at + 1;
      while (end < items.length && key && items[end][key] === value) end += 1;
      const group = items.slice(at, end);
      if (!key) {
        out += group.map((item) => (item.kind === 'br' ? '<br>' : escapeText(item.value))).join('');
      } else if (key === 'href' && value) {
        out += `<a href="${escapeAttribute(value)}">${writeGroup(group, level + 1)}</a>`;
      } else if (key !== 'href' && value) {
        out += `<${key}>${writeGroup(group, level + 1)}</${key}>`;
      } else {
        out += writeGroup(group, level + 1);
      }
      at = end;
    }
    return out;
  };
  return writeGroup(leaves, 0);
}

function writeList(list) {
  return `<${list.type}>${list.items.map((item) => `<li>${item.children.map((part) => (part.type === 'inline' ? writeLeaves(part.leaves) : writeList(part))).join('')}</li>`).join('')}</${list.type}>`;
}

/** Cleaned blocks to the HTML string. */
function serialize(blocks) {
  return blocks.map((block) => {
    if (block.type === 'blockquote') return `<blockquote>${serialize(block.blocks)}</blockquote>`;
    if (LISTS.has(block.type)) return writeList(block);
    // The paste profile's blocks in html@1 terms: never a pre or a table.
    if (block.type === 'pre') {
      const leaves = block.text.split('\n').flatMap((line, index) => [
        ...(index ? [{kind: 'br', strong: false, em: false, href: null}] : []),
        {kind: 'text', value: line.replace(/[\t\f]/gu, ' '), strong: false, em: false, href: null},
      ]);
      return `<p>${writeLeaves(tidyLeaves(leaves, 'value'))}</p>`;
    }
    if (block.type === 'table') {
      const cells = [{leaves: block.caption}, ...block.rows.flatMap((row) => row.cells)];
      return cells.filter((cell) => hasText(cell.leaves)).map((cell) => `<p>${writeLeaves(cell.leaves)}</p>`).join('');
    }
    return `<${block.type}>${writeLeaves(block.leaves)}</${block.type}>`;
  }).join('');
}

/** The text of cleaned blocks, for counting and emptiness. */
function plainText(html) {
  const blocks = cleanTree(parseHtml(html), {mode: 'value'});
  const text = (leaves) => leaves.map((item) => (item.kind === 'br' ? '\n' : item.value)).join('');
  const list = (block) => block.items.map((item) => item.children.map((part) => (part.type === 'inline' ? text(part.leaves) : list(part))).join('\n')).join('\n');
  const all = (items) => items.map((block) => (block.type === 'blockquote' ? all(block.blocks) : LISTS.has(block.type) ? list(block) : text(block.leaves))).join('\n\n');
  return all(blocks);
}

/**
 * Untrusted HTML into the subset. With a document (the browser) the string
 * is parsed by the browser in an inert <template>; without one, by
 * parseHtml. A DOM node may be given instead of a string.
 * @param {string|Node|null|undefined} input
 * @param {{mode?: 'value'|'editor', document?: Document|null}} [options]
 * @returns {string}
 */
function sanitizeRichText(input, {mode = 'value', document: documentRef} = {}) {
  let tree;
  if (input && typeof input === 'object' && typeof input.nodeType === 'number') {
    tree = treeFromDom(input);
  } else {
    const html = typeof input === 'string' ? input : '';
    const doc = documentRef === undefined ? globalThis.document : documentRef;
    if (html && doc?.createElement) {
      const template = doc.createElement('template');
      template.innerHTML = html;
      tree = treeFromDom(template.content);
    } else {
      tree = parseHtml(html);
    }
  }
  return serialize(cleanTree(tree, {mode}));
}

/**
 * Plain text into the subset: paragraphs split on blank lines, a single line
 * break a <br>.
 * @param {string} text
 * @param {{mode?: 'value'|'editor'}} [options]
 */
function richTextFromPlainText(text, {mode = 'value'} = {}) {
  const source = String(text ?? '').replace(/\r\n?/gu, '\n');
  const blocks = source.split(/\n[ \t\f\v\u00a0]*\n+/u).map((paragraph) => {
    const leaves = [];
    paragraph.split('\n').forEach((line, index) => {
      if (index > 0) leaves.push({kind: 'br', strong: false, em: false, href: null});
      const value = line.replace(/[\t\f\v ]+/gu, ' ');
      if (value) leaves.push({kind: 'text', value, strong: false, em: false, href: null});
    });
    return {type: 'p', leaves};
  });
  return serialize(tidyBlocks(blocks, mode));
}


/***/ },

/***/ "4f56033a1eae"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PASTE_BLOCKS: () => (/* reexport safe */ _core_js_composition_html_subset_mjs__WEBPACK_IMPORTED_MODULE_0__.PASTE_BLOCKS),
/* harmony export */   RICH_TEXT_BLOCKS: () => (/* reexport safe */ _core_js_composition_html_subset_mjs__WEBPACK_IMPORTED_MODULE_0__.RICH_TEXT_BLOCKS),
/* harmony export */   RICH_TEXT_ELEMENTS: () => (/* reexport safe */ _core_js_composition_html_subset_mjs__WEBPACK_IMPORTED_MODULE_0__.RICH_TEXT_ELEMENTS),
/* harmony export */   RICH_TEXT_PROFILES: () => (/* reexport safe */ _core_js_composition_html_subset_mjs__WEBPACK_IMPORTED_MODULE_0__.RICH_TEXT_PROFILES),
/* harmony export */   RICH_TEXT_SCHEMES: () => (/* reexport safe */ _core_js_composition_html_subset_mjs__WEBPACK_IMPORTED_MODULE_0__.RICH_TEXT_SCHEMES),
/* harmony export */   cleanTree: () => (/* reexport safe */ _core_js_composition_html_subset_mjs__WEBPACK_IMPORTED_MODULE_0__.cleanTree),
/* harmony export */   decodeEntities: () => (/* reexport safe */ _core_js_composition_html_subset_mjs__WEBPACK_IMPORTED_MODULE_0__.decodeEntities),
/* harmony export */   parseHtml: () => (/* reexport safe */ _core_js_composition_html_subset_mjs__WEBPACK_IMPORTED_MODULE_0__.parseHtml),
/* harmony export */   plainText: () => (/* reexport safe */ _core_js_composition_html_subset_mjs__WEBPACK_IMPORTED_MODULE_0__.plainText),
/* harmony export */   richTextFromPlainText: () => (/* reexport safe */ _core_js_composition_html_subset_mjs__WEBPACK_IMPORTED_MODULE_0__.richTextFromPlainText),
/* harmony export */   richTextHref: () => (/* reexport safe */ _core_js_composition_html_subset_mjs__WEBPACK_IMPORTED_MODULE_0__.richTextHref),
/* harmony export */   sanitizeRichText: () => (/* reexport safe */ _core_js_composition_html_subset_mjs__WEBPACK_IMPORTED_MODULE_0__.sanitizeRichText),
/* harmony export */   serialize: () => (/* reexport safe */ _core_js_composition_html_subset_mjs__WEBPACK_IMPORTED_MODULE_0__.serialize),
/* harmony export */   treeFromDom: () => (/* reexport safe */ _core_js_composition_html_subset_mjs__WEBPACK_IMPORTED_MODULE_0__.treeFromDom)
/* harmony export */ });
/* harmony import */ var _core_js_composition_html_subset_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("e19611ff78cb");
// The html@1 subset of sf-input-rich. The rule moved to the core runtime with
// content.html 1.0.0, so the Composition renderer and this element share one
// cleaner: src/core/js/composition/html-subset.mjs.



/***/ },

/***/ "77f77c47e0a8"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   files: () => (/* binding */ files)
/* harmony export */ });
/* harmony import */ var _en_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("194659de6d72");
// Written by scripts/build-language-packs.mjs from src/core/lang/built-in.json
// (owner decision C282); do not edit. The words this bundle carries: the
// built-in languages' (en); every other language comes from
// a language file (core/lang/<code>.js or its parts).


const files = { en: { runtime: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime } };

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ en: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime });


/***/ },

/***/ "d41b3b9112e6"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.input-rich","tag":"sf-input-rich","version":"1.11.0","kind":"leaf","settings":{"size":{"type":"enum","values":["1/3","1/2","1","2","3"],"default":"1"},"appearance":{"type":"enum","values":["bordered","filled"],"default":"bordered"},"overflow":{"type":"enum","values":["more","wrap"],"default":"more"},"label":{"type":"string","default":""},"required":{"type":"boolean","default":false},"placeholder":{"type":"string","default":""},"hint":{"type":"string","default":""},"help":{"type":"string","default":""},"name":{"type":"string","default":""},"rows":{"type":"number","default":6},"max-rows":{"type":"number","optional":true},"maxlength":{"type":"number","optional":true},"counter":{"type":"boolean","default":false},"disabled":{"type":"boolean","default":false},"readonly":{"type":"boolean","default":false},"invalid":{"type":"boolean","default":false},"error-message":{"type":"string","default":""}},"values":{"value":{"type":"string","default":""}},"events":{"input":{"carries":"native"},"change":{"carries":"native"}},"actions":{},"form":{"value":"value","name":"name","default":"value","submits":"value","reset":"default","required":"required","disabled":"disabled","readonly":"readonly","validity":["value-missing","too-long","custom-error"]},"css-variables":{"--sf-rich-text-background-color":{"type":"color","state":"default"},"--sf-rich-text-border-color":{"type":"color","state":"default"},"--sf-rich-text-color":{"type":"color","state":"default"},"--sf-rich-text-radius":{"type":"length","state":"default"},"--sf-rich-text-padding-inline":{"type":"length","state":"default"},"--sf-rich-text-padding-block":{"type":"length","state":"default"},"--sf-rich-text-invalid-border-color":{"type":"color","state":"invalid"},"--sf-rich-text-sticky-top":{"type":"length","state":"default"}}}');

/***/ },

/***/ "194659de6d72"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Rich text","runtime":{"toolbar":"Formatting","paragraph":"Paragraph","heading-2":"Heading 2","heading-3":"Heading 3","heading-4":"Heading 4","bold":"Bold","italic":"Italic","link":"Link","bulleted-list":"Bulleted list","numbered-list":"Numbered list","quote":"Quote","undo":"Undo","redo":"Redo","not-in-list":"Not available in a list","nothing-to-undo":"Nothing to undo","nothing-to-redo":"Nothing to redo","link-dialog":"Link","link-address":"Link address","link-hint":"https://…, mailto:, tel: or a path on this site such as /about","link-invalid":"Use an https:, mailto: or tel: address, or a path on this site that starts with /.","link-apply":"Apply","link-remove":"Remove link","value-missing":"Fill in this field","count-text":"{count} / {max}","too-long":"At most {max} characters","help":"More about: {label}","text-level":"Text level","more":"More"}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("a07d0671bd60");
/******/
/******/ })()
;