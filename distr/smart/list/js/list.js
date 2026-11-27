/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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

/***/ "cbcfcde04d12"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   COARSE_QUERY: () => (/* binding */ COARSE_QUERY),
/* harmony export */   LAYOUTS: () => (/* binding */ LAYOUTS),
/* harmony export */   PHONE_BELOW: () => (/* binding */ PHONE_BELOW),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   devicesOf: () => (/* binding */ devicesOf),
/* harmony export */   inLayout: () => (/* binding */ inLayout),
/* harmony export */   itemsInLayout: () => (/* binding */ itemsInLayout),
/* harmony export */   layoutOf: () => (/* binding */ layoutOf),
/* harmony export */   layoutOfWidth: () => (/* binding */ layoutOfWidth),
/* harmony export */   layoutPlace: () => (/* binding */ layoutPlace),
/* harmony export */   markDevices: () => (/* binding */ markDevices),
/* harmony export */   markPageLayout: () => (/* binding */ markPageLayout),
/* harmony export */   pointerKind: () => (/* binding */ pointerKind),
/* harmony export */   watchLayout: () => (/* binding */ watchLayout),
/* harmony export */   watchPointer: () => (/* binding */ watchPointer)
/* harmony export */ });
// Device scope (study S-A, decision q-7097831f9f option 2, 2026-11-24; the
// Touch screens page, docs/foundation-touch-screens.md). Two separate facts,
// one word each, so no component measures them in a copy of its own:
//
//   layout   'phone' when the component's place is narrower than
//            PHONE_BELOW (600 px), else 'desktop'. It decides which items a
//            component shows: an item that carries `devices` is shown only in
//            the layouts it names, and hidden -- not disabled -- in the other.
//   pointer  'coarse' when the page has a touch pointer and no fine one,
//            else 'fine'. It decides gestures and what replaces hover (a
//            check box always shown, a hit area of 44).
//
// A tablet with a keyboard is a coarse pointer in a desktop layout; a narrow
// desktop window a fine pointer in a phone layout. The two words never stand
// for each other.
//
// The place is the nearest size container (an ancestor with a
// `container-type`), as a container query reads it; without one, the page.
// 600 is the width the View layouts already switch at (sf-view-board,
// sf-view-calendar, the view head); it is not a step of the size scale
// (C181 (2) pending), recorded on the page as a known gap.
//
// Marks: an author marks any item -- a setting, a menu item, a tab, a column
// -- with `devices: ['phone']` or `devices: ['desktop']`; a component marks
// its own items it knows are bound to a layout (markDevices). The author's
// mark wins: a component's mark fills only an item that has none.

/** Below this width (px) of its place a component draws its phone layout. */
const PHONE_BELOW = 600;
/** The layouts an item may name in `devices`. */

const LAYOUTS = Object.freeze(['phone', 'desktop']);
/** The coarse-pointer media query: a touch pointer and no fine one. */

const COARSE_QUERY = '(pointer: coarse) and (not (any-pointer: fine))';
const KNOWN = new Set(LAYOUTS);
/** The layout of a width: 'phone' below PHONE_BELOW, else 'desktop'. */

function layoutOfWidth(width) {
  return Number.isFinite(width) && width > 0 && width < PHONE_BELOW ? 'phone' : 'desktop';
}
/**
 * The box whose width decides an element's layout: the element itself or its
 * nearest ancestor that is a size container, else null (the page).
 */

function layoutPlace(element) {
  const view = element?.ownerDocument?.defaultView ?? globalThis;

  for (let node = element instanceof Element ? element : null; node; node = node.parentElement ?? node.getRootNode?.()?.host ?? null) {
    const type = view.getComputedStyle?.(node)?.containerType ?? '';
    if (type && type !== 'normal') return node;
  }

  return null;
}

function placeWidth(element) {
  const place = layoutPlace(element);
  if (place) return place.getBoundingClientRect().width;
  const doc = element?.ownerDocument ?? globalThis.document;
  return doc?.documentElement?.clientWidth || globalThis.innerWidth || 0;
}
/**
 * The layout an element is drawn in: 'phone' or 'desktop'. A number is read
 * as a width; a written word ('phone' | 'desktop') is taken as given, so a
 * host that knows its own layout says it.
 */


function layoutOf(target) {
  if (KNOWN.has(target)) return target;
  if (typeof target === 'number') return layoutOfWidth(target);
  return layoutOfWidth(placeWidth(target));
}
/**
 * Follows an element's layout: calls back with the new word when it changes
 * (not at once). Returns stop(). Without ResizeObserver it follows the page.
 */

function watchLayout(element, callback) {
  let last = layoutOf(element);

  const check = () => {
    const now = layoutOf(element);
    if (now === last) return;
    last = now;
    callback(now);
  };

  const place = layoutPlace(element);
  const view = element?.ownerDocument?.defaultView ?? globalThis;

  if (place && typeof view.ResizeObserver === 'function') {
    const observer = new view.ResizeObserver(check);
    observer.observe(place);
    return () => observer.disconnect();
  }

  view.addEventListener?.('resize', check);
  return () => view.removeEventListener?.('resize', check);
}
/** The page's pointer: 'coarse' (touch, no fine pointer) or 'fine'. */

function pointerKind(view = globalThis) {
  return typeof view?.matchMedia === 'function' && view.matchMedia(COARSE_QUERY).matches ? 'coarse' : 'fine';
}
/** Follows the page's pointer word; returns stop(). */

function watchPointer(callback, view = globalThis) {
  const media = typeof view?.matchMedia === 'function' ? view.matchMedia(COARSE_QUERY) : null;
  if (!media) return () => {};

  const listener = () => callback(media.matches ? 'coarse' : 'fine');

  media.addEventListener?.('change', listener);
  return () => media.removeEventListener?.('change', listener);
}
/**
 * The layouts an item is scoped to, or null (every layout). Unknown words are
 * dropped; a list with no known word is no scope.
 */

function devicesOf(item) {
  const list = Array.isArray(item?.devices) ? item.devices : typeof item?.devices === 'string' ? item.devices.split(/[\s,]+/u) : null;
  if (!list) return null;
  const known = [...new Set(list.filter(word => KNOWN.has(word)))];
  return known.length ? known : null;
}
/** Whether an item is shown in a layout: unscoped, or scoped to it. */

function inLayout(item, layout) {
  const scope = devicesOf(item);
  return !scope || scope.includes(KNOWN.has(layout) ? layout : 'desktop');
}
/**
 * The items shown in a layout, nested lists (`items`, and `options` when
 * `options: true`) filtered the same way. The items are not copied unless a
 * nested list changes.
 */

function itemsInLayout(items, layout, {
  options = false
} = {}) {
  if (!Array.isArray(items)) return [];
  const out = [];

  for (const item of items) {
    if (!inLayout(item, layout)) continue;

    if (!item || typeof item !== 'object') {
      out.push(item);
      continue;
    }

    let next = item;

    if (Array.isArray(item.items)) {
      const inner = itemsInLayout(item.items, layout, {
        options
      });
      if (inner.length !== item.items.length || inner.some((one, at) => one !== item.items[at])) next = { ...next,
        items: inner
      };
    }

    if (options && Array.isArray(item.options)) {
      const inner = item.options.filter(option => inLayout(option, layout));
      if (inner.length !== item.options.length) next = { ...next,
        options: inner
      };
    }

    out.push(next);
  }

  return out;
}
/**
 * A component's own marks over an author's items: `marks` maps an item id to
 * its layouts (['desktop'] for a table-only setting). An item that carries
 * its own `devices` keeps it -- the author's mark wins; nested `items` are
 * marked the same way. Returns new items; the given ones are not changed.
 */

function markDevices(items, marks = {}) {
  if (!Array.isArray(items)) return [];
  const table = marks instanceof Map ? marks : new Map(Object.entries(marks ?? {}));
  return items.map(item => {
    if (!item || typeof item !== 'object') return item;
    let next = item;
    const own = Object.hasOwn(item, 'devices') && item.devices !== undefined && item.devices !== null;
    if (!own && item.id !== undefined && table.has(String(item.id))) next = { ...next,
      devices: [...table.get(String(item.id))]
    };
    if (Array.isArray(item.items)) next = { ...next,
      items: markDevices(item.items, table)
    };
    return next;
  });
}
const Device = Object.freeze({
  PHONE_BELOW,
  LAYOUTS,
  COARSE_QUERY,
  layoutOf,
  layoutOfWidth,
  layoutPlace,
  watchLayout,
  pointer: pointerKind,
  watchPointer,
  devicesOf,
  inLayout,
  itemsInLayout,
  markDevices
}); // Core publishes the helper; a component bundle that carries its own copy
// reuses an already published one instead of replacing it.

if (typeof globalThis !== 'undefined') {
  globalThis.SF = globalThis.SF || {};
  if (!globalThis.SF.device) globalThis.SF.device = Device;
} // The page's layout word on <html> (data-sf-layout="phone" | "desktop"),
// written while core boots and followed on resize (DEV answer 3 on group
// build 20): static first-paint markup printed at one width carries its
// items' scope (data-sf-devices), and core.styles hides the other layout's
// items by this word until their element draws -- the signal's own width,
// PHONE_BELOW of the page, not a width rule of the sheets. One mark per
// page: a second copy of this module finds it and leaves it.


const LAYOUT_MARK = Symbol.for('sf.device.page-layout');
function markPageLayout(doc = globalThis.document) {
  const root = doc?.documentElement;
  const view = doc?.defaultView; // One mark per page, kept on the document under a registry symbol: every
  // bundle carries its own copy of this module, the document is shared.

  if (!root || !view || doc[LAYOUT_MARK]) return;
  doc[LAYOUT_MARK] = true;

  const write = () => {
    const word = layoutOfWidth(root.clientWidth || view.innerWidth || 0);
    if (root.getAttribute('data-sf-layout') !== word) root.setAttribute('data-sf-layout', word);
  };

  write();
  view.addEventListener?.('resize', write, {
    passive: true
  });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Device);

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

/***/ "9cf638c721f7"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LONG_PRESS_MS: () => (/* binding */ LONG_PRESS_MS),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   watchLongPress: () => (/* binding */ watchLongPress)
/* harmony export */ });
// A long press under a finger (owner decision C148 (6), list item study
// prototypes/list-item-study.html #q-swipe): held 0.5 s on a row, it opens the
// same menu as the row's «⋯» and Shift+F10. No swipe: it is hidden and fights
// the platform's back gesture. The press time is the tooltip's long press
// (component tooltip, C59): times, not lengths -- the Framework has no delay
// tokens. A touch the browser takes for a scroll ends in pointercancel and
// opens nothing. The click the release sends afterwards is the press's, not a
// press of the row: swallowed() answers it once.
//
// A core helper since group build 19 (study S-A, decision q-7097831f9f
// (4); docs/foundation-touch-screens.md): cards and boards share it with the
// list. On a surface with multiple selection a long press chooses the item
// (sf-list selection="many", C150 (9)); without selection it opens the item's
// «⋯» menu (C148 (6)). The caller's press() decides which.
//
// Stateless module: core publishes it as SF.longPress, and a component bundle
// that imports it carries a copy; every watch keeps its state in its own
// closure.
const LONG_PRESS_MS = 500;
/**
 * Watches a held touch on `target`: press(event) after `ms` (500) when
 * accepts(event) took the pointerdown. Returns {swallowed(), stop()}:
 * swallowed() answers once, true, for the click that follows a fired press.
 */

function watchLongPress(target, {
  accepts = () => true,
  press,
  ms = LONG_PRESS_MS
} = {}) {
  let timer = 0;
  let pointer = null;
  let fired = false;

  const clear = () => {
    clearTimeout(timer);
    timer = 0;
    pointer = null;
  };

  const onDown = event => {
    fired = false;
    if (event.pointerType !== 'touch' || !event.isPrimary || !accepts(event)) return;
    clear();
    pointer = event.pointerId;
    timer = setTimeout(() => {
      timer = 0;
      press(event); // After the press: a click press() sends itself is not the release.

      fired = true;
    }, Number.isFinite(ms) && ms > 0 ? ms : LONG_PRESS_MS);
  };

  const onEnd = event => {
    if (pointer === event.pointerId) clear();
  }; // The browser's own long-press menu (text selection, «copy») would cover
  // the row's menu.


  const onContextMenu = event => {
    if (pointer !== null || fired) event.preventDefault();
  };

  target.addEventListener('pointerdown', onDown);
  target.addEventListener('pointerup', onEnd);
  target.addEventListener('pointercancel', onEnd);
  target.addEventListener('contextmenu', onContextMenu);
  return {
    swallowed() {
      if (!fired) return false;
      fired = false;
      return true;
    },

    stop() {
      clear();
      target.removeEventListener('pointerdown', onDown);
      target.removeEventListener('pointerup', onEnd);
      target.removeEventListener('pointercancel', onEnd);
      target.removeEventListener('contextmenu', onContextMenu);
    }

  };
}
const LongPress = Object.freeze({
  ms: LONG_PRESS_MS,
  watch: watchLongPress
});

if (typeof globalThis !== 'undefined') {
  globalThis.SF = globalThis.SF || {};
  if (!globalThis.SF.longPress) globalThis.SF.longPress = LongPress;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (LongPress);

/***/ },

/***/ "8d229b7c92e9"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   menuOpen: () => (/* binding */ menuOpen),
/* harmony export */   publishMenu: () => (/* binding */ publishMenu)
/* harmony export */ });
/* harmony import */ var _density_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("1412c5875b4d");
// SF.menu.open: the page's one menu of actions (owner decision C184 (4),
// 2026-11-14; the public name is the owner's; study control/research/
// 2026-11-14-toolbar-menu-open.md, K-03).
//
// A row's «⋯», a toolbar's «Ещё», the right button and the menu key on a row
// all open the standard menu -- sf-menu-context -- and every component used to
// place its own and wait for it (nine in SIMAI Pro, more in the Framework).
// Now one call opens the one menu of the page:
//
//   const choice = await SF.menu.open({anchor, entries, label});
//   const choice = await SF.menu.open({x, y, entries, label, returnTo: row});
//   // choice: {id, entry} of the row chosen, or null (closed without one)
//
// - anchor: the control the menu hangs from (a press on the same control
//   while its menu is open closes it, as a toggle); or x, y: a point in the
//   window -- where a right-click was, or a row's corner for Shift+F10 -- the
//   menu's corner exactly there;
// - entries: the rows, as sf-menu-context takes them;
// - label: the menu's name, read by a screen reader;
// - size: the menu's size step, as sf-menu-context's size attribute; left
//   out, the step of what opens it (the anchor's, its component's or the
//   Smart component holding it: a row menu of a table of size 1 is size 1);
// - returnTo: where the focus goes when the menu closes (the row it acted
//   on); left out, the menu gives the focus back to where it was, or to the
//   anchor;
// - align: 'start' (the default) lines the menu's start edge up with the
//   anchor's, 'end' its end edge -- for a control at the end of a toolbar,
//   whose menu would otherwise run past it towards the window's edge (view
//   round 1, table group). Start and end follow the page's direction (in a
//   right-to-left page 'end' is the left edge), and a menu that does not fit
//   still flips to the other side and is shifted inside the window. At a
//   point, 'end' puts the menu's end corner at the point.
//
// The menu is fetched by the Loader the first time (SF.Loader.ensure), one on
// the page -- on the body, or in the open modal dialog the anchor is in, since
// a modal dialog makes the rest of the page inert. A second opening while one
// is open closes the first, which answers null. The answer never rejects:
// without a menu (no Loader, no sf-menu-context) it is null.
//
// Every bundle may carry a copy of this module (bundles each carry their own
// module copy), so the one menu and its pending answer live behind the shared
// global: the first copy to run publishes SF.menu.open and every other copy
// calls the published one.

const SHARED = 'data-sf-menu-shared';
const ALIGNS = new Set(['start', 'end']);

function installMenuOpen() {
  let pending = null;
  let point = null; // The opening the menu belongs to now, kept past its answer: a choice
  // answers before the menu closes, and the focus goes back on closing.

  let shown = null;

  const settle = value => {
    const waiting = pending;
    pending = null;
    waiting?.resolve(value);
    return waiting;
  };

  function sharedMenu(anchor) {
    const doc = globalThis.document;
    let menu = doc.querySelector(`[${SHARED}]`);

    if (!menu) {
      menu = doc.createElement('sf-menu-context');
      menu.setAttribute('popup', '');
      menu.setAttribute(SHARED, '');
      menu.addEventListener('sf-menu-context-select', event => {
        if (event.target !== menu) return;
        settle({
          id: event.detail?.id ?? null,
          entry: event.detail?.entry ?? null
        });
      });
      menu.addEventListener('sf-menu-context-closed', event => {
        if (event.target !== menu) return;
        settle(null);
        const opening = shown;
        shown = null;
        const back = opening?.returnTo;
        if (!back?.isConnected) return; // After the menu's own return: the row the person acted on, when the
        // focus fell to the page, stayed in the closed menu or went back to
        // the «⋯» that opened it (a pointer's control, not a Tab stop).

        const anchor = opening.anchor;
        setTimeout(() => {
          const active = doc.activeElement;

          if (!active || active === doc.body || active === doc.documentElement || menu.contains(active) || anchor && (active === anchor || anchor.contains?.(active))) {
            back.focus?.({
              preventScroll: true
            });
          }
        }, 0);
      });
    } // In the open modal dialog the opener is in, or on the body.


    const home = anchor?.closest?.('dialog[open]') || doc.body;
    if (menu.parentNode !== home && !menu.isOpen) home.append(menu);
    return menu;
  } // A point in the window as an anchor of no size: sf-menu-context hangs its
  // corner exactly there and reads the page under it (density, focus back).


  function pointAnchor(x, y, near) {
    const doc = globalThis.document;

    if (!point?.isConnected) {
      point = doc.createElement('span');
      point.setAttribute('aria-hidden', 'true');
      point.setAttribute('data-sf-menu-point', '');
    }

    const home = near?.closest?.('dialog[open]') || doc.body;
    if (point.parentNode !== home) home.append(point);
    point.style.cssText = `position:fixed;left:${x}px;top:${y}px;inline-size:0;block-size:0;pointer-events:none;overflow:hidden`;
    return point;
  }

  return async function open(options = {}) {
    const {
      anchor = null,
      x,
      y,
      entries = [],
      label = '',
      size = '',
      returnTo = null
    } = options || {}; // Logical, so a right-to-left page mirrors it; anything else is start.

    const align = ALIGNS.has(options?.align) ? options.align : 'start';
    const atPoint = !(anchor instanceof Element);
    if (atPoint && !(Number.isFinite(Number(x)) && Number.isFinite(Number(y)))) return null;
    const doc = globalThis.document;
    if (!doc) return null; // A press opens it: the wait does not give up while the menu's code is
    // on its way (SF.Loader.ensure press, GB18 L2; GB19).

    await globalThis.SF?.Loader?.ensure?.(['sf-menu-context'], {
      press: true
    });
    if (!globalThis.customElements?.get('sf-menu-context')) return null;
    const menu = sharedMenu(atPoint ? returnTo : anchor); // The same control again: its open menu closes (a toggle).

    if (!atPoint && menu.isOpen && pending?.anchor === anchor) {
      menu.close({
        reason: 'api'
      });
      return null;
    }

    if (menu.isOpen) {
      settle(null);
      shown = null;
      menu.close({
        restoreFocus: false,
        reason: 'api',
        ask: false
      });
    }

    if (label) menu.setAttribute('aria-label', label);else menu.removeAttribute('aria-label');
    if (size) menu.setAttribute('size', String(size));else {
      menu.removeAttribute('size');
      menu.removeAttribute(_density_js__WEBPACK_IMPORTED_MODULE_0__.RELATIVE);
    } // In the density of the control or the row it opens from (C22, C79), not
    // of the body it stands on.

    (0,_density_js__WEBPACK_IMPORTED_MODULE_0__.followDensity)(menu, atPoint ? returnTo : anchor);
    menu.search = null;
    menu.entries = Array.isArray(entries) ? entries : [];
    return new Promise(resolve => {
      pending = {
        resolve,
        anchor,
        returnTo: returnTo instanceof Element ? returnTo : null
      };
      shown = pending;
      const mine = pending;
      const opening = atPoint ? typeof menu.openAt === 'function' ? menu.openAt(Number(x), Number(y), {
        target: returnTo ?? undefined,
        align
      }) : menu.openFor(pointAnchor(Number(x), Number(y), returnTo), {
        side: 'block-end',
        align,
        focus: 'first'
      }) : menu.openFor(anchor, {
        side: 'block-end',
        align,
        focus: 'first'
      });
      Promise.resolve(opening).then(answer => {
        // Refused (a listener kept it closed) or no surface: nothing chosen.
        if (pending === mine && answer && answer !== true && answer.outcome !== 'applied') settle(null);
      }, () => {
        if (pending === mine) settle(null);
      });
    });
  };
} // The published one, or this copy published.


function publishMenu() {
  const SF = globalThis.SF = globalThis.SF || {};
  SF.menu = SF.menu || {};
  if (typeof SF.menu.open !== 'function') SF.menu.open = installMenuOpen();
  return SF.menu;
}
function menuOpen(options) {
  return publishMenu().open(options);
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (menuOpen);

/***/ },

/***/ "2ee7a47e9b10"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MOTION_ATTRIBUTE: () => (/* binding */ MOTION_ATTRIBUTE),
/* harmony export */   MOTION_CHANGE: () => (/* binding */ MOTION_CHANGE),
/* harmony export */   reducedMotion: () => (/* binding */ reducedMotion),
/* harmony export */   watchMotion: () => (/* binding */ watchMotion)
/* harmony export */ });
// Whether to keep things still: the device asks for less motion
// (prefers-reduced-motion: reduce), or the person stopped motion on this site
// (<html data-sf-motion="reduce">, written by the sf-display-settings panel
// through SF.displaySettings; owner decision C196, 2026-11-15). Core's own
// scripts read this one function; the core sheet stops CSS animations and
// transitions under the same mark (core/scss/_sf_css__display.scss).
//
// No state and no side effect, so every bundle may carry it.
const MOTION_ATTRIBUTE = 'data-sf-motion';
const MOTION_CHANGE = 'sf-display-change';
function reducedMotion(root = globalThis.document?.documentElement, win = globalThis) {
  try {
    if (win.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return true;
  } catch {// No media queries here: only the page's own mark.
  }

  return root?.getAttribute?.(MOTION_ATTRIBUTE) === 'reduce';
} // Calls `listener` when either source changes; returns the stop.

function watchMotion(listener, win = globalThis) {
  const media = win.matchMedia?.('(prefers-reduced-motion: reduce)') ?? null;
  const doc = win.document;
  media?.addEventListener?.('change', listener);
  doc?.addEventListener?.(MOTION_CHANGE, listener);
  return () => {
    media?.removeEventListener?.('change', listener);
    doc?.removeEventListener?.(MOTION_CHANGE, listener);
  };
}

/***/ },

/***/ "6978f1cc153b"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EDGE_MARGIN: () => (/* binding */ EDGE_MARGIN),
/* harmony export */   NEAR_END: () => (/* binding */ NEAR_END),
/* harmony export */   NEAR_START: () => (/* binding */ NEAR_START),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   readingPosition: () => (/* binding */ readingPosition),
/* harmony export */   scrollerOf: () => (/* binding */ scrollerOf),
/* harmony export */   watchEdge: () => (/* binding */ watchEdge)
/* harmony export */ });
/* harmony import */ var _motion_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2ee7a47e9b10");
// The reading position of a scrolling column (duplication audit 2026-11-03,
// A-6): what a feed, a log, a conversation or a long list does to keep a
// person's place while its content changes under them. It was written in
// ui-pro's sf-message-log (keep the place while history is added above,
// follow the end only when the reader is there, «to the latest», ask once
// when the top is reached), and the end-of-list loading again in
// sf-chat-threads and the ui-chat pilot. One rule now, for every column:
//
//   const position = readingPosition(scroller, {onStart: () => askEarlier()});
//   position.keep(() => column.prepend(fragment));  // the place does not move
//   const follow = position.atEnd();                  // before an append
//   column.append(node);
//   if (follow) position.toEnd();
//   scroller.addEventListener('scroll', () => position.check());
//
//   const stop = watchEdge(sentinel, () => askMore()); // the end came into reach
//
// It owns no content and fetches nothing: it measures one element and says
// when an edge is reached. The element is the scroller -- the box with
// overflow that a person scrolls.
//
// Nothing here keeps state at module scope: each column gets its own
// controller, so the copies of this module that every bundle carries cannot
// disagree (bundles each carry their own module copy).
// The device's reduced motion or the site's «остановить движение» (C196).
 // Within this distance of the end counts as being there. 96px is about two
// lines of text and an entry's action row: closer than that, a person reading
// the end of a column is reading the end.

const NEAR_END = 96; // The start is "reached" a little before it is reached, so an earlier page is
// usually there by the time the person scrolls into it.

const NEAR_START = 240; // The end of a list asks for its next page this far before it is in view.

const EDGE_MARGIN = '200px';

const frame = callback => typeof globalThis.requestAnimationFrame === 'function' ? globalThis.requestAnimationFrame(callback) : setTimeout(callback, 16);
/**
 * A controller of one scroller's reading position.
 *
 * options:
 *   nearEnd    px from the end that count as being at it (NEAR_END);
 *   nearStart  px from the start that count as reaching it (NEAR_START);
 *   onStart    () => void, called from check() when the start is reached and
 *              the position is not settling (an earlier page is wanted).
 */


function readingPosition(scroller, {
  nearEnd = NEAR_END,
  nearStart = NEAR_START,
  onStart = null
} = {}) {
  let settling = false;
  let element = scroller ?? null;
  const controller = {
    /** The scroller this controller measures; set it again when the box is drawn anew. */
    get element() {
      return element;
    },

    set element(next) {
      element = next ?? null;
    },

    /** Is the end of the column in view (within nearEnd)? A column not drawn yet is at its end. */
    atEnd() {
      if (!element) return true;
      return element.scrollHeight - element.scrollTop - element.clientHeight < nearEnd;
    },

    /** Is the start within reach (within nearStart)? */
    atStart() {
      if (!element) return false;
      return element.scrollTop < nearStart;
    },

    /**
     * Change the content above what is read without moving it: the distance
     * from the end is measured before `mutate` and restored after. What was
     * under the reader's eyes is the same distance from the end before and
     * after the history above it grew.
     */
    keep(mutate) {
      if (!element) return mutate?.();
      const fromEnd = element.scrollHeight - element.scrollTop;
      const result = mutate?.();
      element.scrollTop = element.scrollHeight - fromEnd;
      return result;
    },

    /**
     * Go to the end in the next frame: smoothly, unless `instant` or the
     * reader asked for reduced motion. `then` runs after the jump. With
     * `settle`, reaching the start is not reported until the frame after:
     * a column that opens at its start for one frame does not ask for a page
     * nobody wanted.
     */
    toEnd({
      instant = false,
      settle = false,
      then = null
    } = {}) {
      if (settle) settling = true;
      frame(() => {
        if (element) element.scrollTo({
          top: element.scrollHeight,
          behavior: instant || (0,_motion_js__WEBPACK_IMPORTED_MODULE_0__.reducedMotion)() ? 'instant' : 'smooth'
        });
        then?.();
        if (settle) frame(() => {
          settling = false;
        });
      });
    },

    /** Hold reports of the start (while a column is replaced). */
    hold() {
      settling = true;
    },

    release() {
      settling = false;
    },

    get settling() {
      return settling;
    },

    /** Call on scroll: reports onStart once the start is in reach and the position is not settling. */
    check() {
      if (settling || !onStart || !controller.atStart()) return false;
      onStart();
      return true;
    }

  };
  return controller;
}
/**
 * Report when `sentinel` comes within `margin` of the scroller it sits in --
 * the end of a list in reach, the start of a feed. Never from a scroll handler
 * that fires sixty times a second. `root` is the scroller; null (the default)
 * is the viewport, which still sees the clipping of every scroller around the
 * sentinel. Answers the way to stop watching. A watch that starts on an edge
 * already in reach reports it at once.
 */

function watchEdge(sentinel, callback, {
  root = null,
  margin = EDGE_MARGIN
} = {}) {
  if (!sentinel || typeof callback !== 'function' || typeof globalThis.IntersectionObserver !== 'function') return () => {};
  const observer = new globalThis.IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) callback();
  }, {
    root,
    rootMargin: margin
  });
  observer.observe(sentinel);
  return () => observer.disconnect();
}
/**
 * The box that scrolls `node`: the nearest ancestor whose block overflow is
 * auto or scroll, or null for the page. watchEdge takes it as `root`, so its
 * margin reaches ahead inside that box; measured against the viewport, the
 * margin would stop at the box's clipped edge.
 */

function scrollerOf(node) {
  const view = node?.ownerDocument?.defaultView;

  for (let at = node?.parentElement; at && view; at = at.parentElement) {
    if (at === node.ownerDocument.documentElement || at === node.ownerDocument.body) return null;
    if (/^(auto|scroll|overlay)$/u.test(view.getComputedStyle(at).overflowY)) return at;
  }

  return null;
}
const ReadingPosition = Object.freeze({
  create: readingPosition,
  watchEdge,
  scrollerOf,
  NEAR_END,
  NEAR_START,
  EDGE_MARGIN
}); // Core publishes the helper; component bundles that carry their own copy reuse
// an already published one instead of replacing it.

if (typeof globalThis !== 'undefined') {
  globalThis.SF = globalThis.SF || {};
  if (!globalThis.SF.readingPosition) globalThis.SF.readingPosition = ReadingPosition;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ReadingPosition);

/***/ },

/***/ "d3f52a822348"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ROWS_VISIBILITY_FROM: () => (/* binding */ ROWS_VISIBILITY_FROM),
/* harmony export */   ROWS_WINDOW_FROM: () => (/* binding */ ROWS_WINDOW_FROM),
/* harmony export */   ROWS_WINDOW_INITIAL: () => (/* binding */ ROWS_WINDOW_INITIAL),
/* harmony export */   ROWS_WINDOW_MARGIN: () => (/* binding */ ROWS_WINDOW_MARGIN),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   rowsWindow: () => (/* binding */ rowsWindow)
/* harmony export */ });
/* harmony import */ var _reading_position_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("6978f1cc153b");
// The rows of a long list drawn by the window a person can see (standard
// simai.smart-component §18.4, gate 17: a component with many entries draws
// the ones in view; Framework order FO-2 of the view set study, ui-control
// control/research/2026-11-17-view-round-1/framework-orders.md). sf-view-table
// had the only copy (windowSlice / syncWindow); this is that copy made one
// helper for every list -- sf-list draws by it, the set's table calls it.
//
// The component keeps drawing its own rows: the helper says which ones, and
// how tall the two spacers are that stand for the rest above and below, so
// the scroll bar, the scroll position and the page's height are those of the
// whole list.
//
//   const win = rowsWindow({
//     body: () => element,         the box the rows (and the spacers) stand in
//     rows: () => [elements],      the entries drawn now, in order (rows, and
//                                  the headings of a grouped list)
//     onMove: (range) => {},       the range moved: draw again (range {first, last})
//     key: (index) => id,          the entry's id: its measured height is kept
//                                  by it (FO2-4), so a tall row (a picture in
//                                  a feed) is tall in the spacers too
//     snap: (index) => index,      where a range starting at index must start
//                                  (a grouped list: its group's heading, FO2-1)
//     from: 200,                   the length from which the list is windowed;
//                                  Infinity never windows (a host's off, FO2-3)
//     place: (element) => top,     where an entry stands in the flow, in
//                                  viewport px (default its box's top): a
//                                  sticky heading is read where it stuck, so
//                                  a grouped list gives its group's top
//   });
//   win.slice(count)  -> null (draw every row) | {first, last, before, after}
//   win.sync()        after a drawing: measure the entries drawn, move the
//                     range if the entries in view came near its edge;
//                     answers whether it moved
//   win.reveal(index) put an entry in the range (a key that goes to it, Home, End)
//   win.start() / win.stop()   follow scrolling and resizing (any scroll box
//                     between the rows and the page, one listener per list)
//                     and the rows' box growing or shrinking
//
// The box the rows stand in must not be a scroll anchor (overflow-anchor:
// none): when the range moves, the browser's scroll anchoring keeps a drawn
// row in place by moving the scroll position, which moves the range again.
//
// What is in view is read against the window and the nearest box that
// scrolls the rows. Each drawn entry's height (from its top to the next
// one's, so the gaps count) is kept by its key; an entry not drawn yet is the
// average of those measured, and until one is measured the guess (FO2-4: the
// average alone threw the spacers off in a feed of pictures and the scroll
// jumped). Without a key the average stands for every entry. Nothing here
// draws, and nothing is kept outside the controller it returns, so every
// bundle may carry its own copy.
//
// The length from which a list is windowed (owner decision C308 FO-2): up to
// 1 000 entries every row stays in the document, drawn with content-visibility
// (the rows off screen skip their layout and paint), so the browser's find
// and printing reach them all (DEV measured 1 000 rows 0.42 s against 0.70-
// 0.88 s); from 1 000 the window of the rows in view. A list may set its own
// length or turn the window off (from).
 // A list shorter than this draws every row (C308 FO-2).

const ROWS_WINDOW_FROM = 1000; // From this length a list drawn whole draws its rows with content-visibility
// (C308 FO-2): a short list keeps its rows as they are.

const ROWS_VISIBILITY_FROM = 100; // The first range, before anything is measured, and the rows kept beyond the
// visible ones on each side, so a key or a quick scroll finds rows drawn.

const ROWS_WINDOW_INITIAL = 60;
const ROWS_WINDOW_MARGIN = 20;

const clamp = ({
  first = 0,
  last = 0
} = {}, count = 0) => {
  const lastIndex = Math.max(0, count - 1);
  const from = Math.min(Math.max(0, Math.floor(first)), lastIndex);
  const to = Math.min(Math.max(from, Math.floor(last)), lastIndex);
  return {
    first: from,
    last: to
  };
};

function rowsWindow({
  body,
  rows,
  onMove = null,
  from = ROWS_WINDOW_FROM,
  initial = ROWS_WINDOW_INITIAL,
  margin = ROWS_WINDOW_MARGIN,
  guess = 40,
  clip = null,
  key = null,
  snap = null,
  place = null
} = {}) {
  let windowed = false;
  let count = 0;
  let height = 0;
  let range = null;
  let frame = 0;
  let abort = null; // The entry a key went to (reveal): the range stays around it until the page
  // scrolls -- the focus that follows scrolls the row into view. Without it,
  // the drawing after reveal measured the window still showing the old rows
  // and put the range back there, and the row the key went to was gone.

  let held = null; // The rows' box is watched for its size: rows that draw themselves after
  // the list measured them (a row's own element, a late font) change the row
  // height, and the spacers follow without waiting for a scroll.

  let observer = null;
  let observed = null; // Measured heights by entry key (FO2-4), and the sums of heights before
  // each entry, made again when a height or the length changed.

  const heights = new Map();
  let measuredTotal = 0;
  let sums = null;
  let threshold = from; // An entry not measured yet: the average of every entry measured so far
  // (it settles as more are measured), else of the rows drawn, else the guess.

  const rowHeight = () => heights.size ? measuredTotal / heights.size : height || guess;

  const keyOf = index => typeof key === 'function' ? key(index) : undefined;

  const topOf = (element, box) => {
    if (typeof place !== 'function') return box.top;
    const at = Number(place(element));
    return Number.isFinite(at) ? at : box.top;
  };

  const heightOf = index => {
    const id = keyOf(index);
    return id !== undefined && heights.has(id) ? heights.get(id) : rowHeight();
  };

  function offsets() {
    if (sums && sums.length === count + 1) return sums;
    sums = new Float64Array(count + 1);

    for (let index = 0; index < count; index += 1) sums[index + 1] = sums[index] + heightOf(index);

    return sums;
  } // The first entry whose bottom is below the place (px from the body's top).


  function indexAt(place) {
    const at = offsets();
    let low = 0;
    let high = count - 1;

    while (low < high) {
      const middle = low + high >> 1;
      if (at[middle + 1] > place) high = middle;else low = middle + 1;
    }

    return low;
  }

  const snapped = next => {
    if (typeof snap !== 'function') return next;
    const first = Math.max(0, Math.min(next.first, Math.floor(Number(snap(next.first)) || 0)));
    return {
      first,
      last: next.last
    };
  };

  function slice(total = 0) {
    const length = Math.max(0, Math.floor(Number(total) || 0));
    if (length !== count) sums = null;
    count = length;

    if (count < threshold) {
      windowed = false;
      range = null;
      return null;
    }

    windowed = true;
    range = clamp(snapped(clamp(range ?? {
      first: 0,
      last: initial - 1
    }, count)), count);
    const at = offsets();
    return {
      first: range.first,
      last: range.last,
      before: at[range.first],
      after: Math.max(0, at[count] - at[range.last + 1])
    };
  } // Which rows a person can see: the body's place against the window and the
  // box that scrolls it, in row heights. null when nothing can be read.


  function seen() {
    const box = body?.();
    if (!box || !count) return null;
    const place = box.getBoundingClientRect();
    const view = box.ownerDocument?.defaultView ?? globalThis;
    let top = 0;
    let bottom = view.innerHeight || box.ownerDocument?.documentElement?.clientHeight || 0;
    const scroller = typeof clip === 'function' ? clip() : (0,_reading_position_js__WEBPACK_IMPORTED_MODULE_0__.scrollerOf)(box);

    if (scroller) {
      const edge = scroller.getBoundingClientRect();
      top = Math.max(top, edge.top);
      bottom = Math.min(bottom, edge.bottom);
    }

    const first = indexAt(top - place.top);
    const last = Math.max(first, indexAt(bottom - place.top));
    return {
      first,
      last
    };
  }

  function moved() {
    if (typeof onMove === 'function') onMove({ ...range
    });
    return true;
  }

  function sync() {
    if (!windowed) return false;
    let changed = false;
    const drawn = rows?.() ?? [];

    if (drawn.length) {
      const boxes = drawn.map(one => {
        const box = one.getBoundingClientRect();
        const top = topOf(one, box);
        return {
          top,
          bottom: top + box.height,
          height: box.height
        };
      });
      const total = boxes[boxes.length - 1].bottom - boxes[0].top;
      const measured = total / drawn.length; // With keys the entries measured stand for the rest (rowHeight), so the
      // average of the rows drawn now moves nothing.

      if (measured > 0 && Math.abs(measured - height) > 0.5) {
        height = measured;

        if (typeof key !== 'function') {
          sums = null;
          changed = true;
        }
      } // Each entry by its key (FO2-4): from its top to the next one's, the
      // last its own height and the gap the others keep.


      const base = range?.first ?? 0;

      if (typeof key === 'function' && range && drawn.length === range.last - range.first + 1) {
        let gaps = 0;

        for (let index = 0; index < boxes.length - 1; index += 1) gaps += Math.max(0, boxes[index + 1].top - boxes[index].bottom);

        const gap = boxes.length > 1 ? gaps / (boxes.length - 1) : 0;
        boxes.forEach((box, index) => {
          const next = boxes[index + 1];
          const own = next ? next.top - box.top : box.height + gap;
          const id = keyOf(base + index);
          if (id === undefined || !(own > 0)) return;

          if (Math.abs((heights.get(id) ?? -1) - own) > 0.5) {
            measuredTotal += own - (heights.get(id) ?? 0);
            heights.set(id, own);
            sums = null;
            changed = true;
          }
        });
      }
    }

    const view = seen();
    if (!view) return changed ? moved() : false;
    if (held !== null && (held < view.first || held > view.last)) return changed ? moved() : false;
    held = null;
    const now = range ?? {
      first: 0,
      last: initial - 1
    };
    const low = now.first > 0 ? now.first + margin / 2 : 0;
    const high = now.last < count - 1 ? now.last - margin / 2 : count - 1;

    if (view.first < low || view.last > high) {
      const next = clamp(snapped(clamp({
        first: view.first - margin,
        last: view.last + margin
      }, count)), count);

      if (next.first !== now.first || next.last !== now.last) {
        range = next;
        changed = true;
      }
    }

    return changed ? moved() : false;
  } // A row reached by a key (Home, End, the next row past the drawn ones):
  // the range is put around it. Answers whether the range moved.


  function reveal(index) {
    if (!windowed) return false;
    const at = Math.min(Math.max(0, Math.floor(Number(index) || 0)), count - 1);
    held = at;
    const now = range ?? {
      first: 0,
      last: initial - 1
    };
    if (at >= now.first && at <= now.last) return false;
    const span = Math.max(initial, now.last - now.first + 1);
    const first = Math.max(0, Math.min(at - margin, count - span));
    range = clamp(snapped({
      first,
      last: first + span - 1
    }), count);
    return moved();
  }

  function schedule() {
    if (!windowed || frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      sync();
    });
  }

  function watchSize() {
    const box = body?.();
    if (box === observed) return;
    observer?.disconnect();
    observed = box ?? null;
    const Observer = box?.ownerDocument?.defaultView?.ResizeObserver ?? globalThis.ResizeObserver;
    if (!box || typeof Observer !== 'function') return;
    observer ??= new Observer(schedule);
    observer.observe(box);
  }

  function start() {
    watchSize();
    if (abort) return;
    abort = new AbortController();
    const {
      signal
    } = abort;

    const onScroll = () => {
      held = null;
      schedule();
    }; // Any scroll box between the rows and the page moves them: listened once,
    // in the capture phase, on the document.


    const doc = body?.()?.ownerDocument ?? globalThis.document;
    doc?.addEventListener('scroll', onScroll, {
      capture: true,
      passive: true,
      signal
    });
    doc?.defaultView?.addEventListener('resize', onScroll, {
      passive: true,
      signal
    });
  }

  function stop() {
    observer?.disconnect();
    observed = null;
    abort?.abort();
    abort = null;
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
  }

  return {
    slice,
    sync,
    reveal,
    start,
    stop,

    get windowed() {
      return windowed;
    },

    get count() {
      return count;
    },

    get range() {
      return range ? { ...range
      } : null;
    },

    get rowHeight() {
      return rowHeight();
    },

    // The length from which the list is windowed; Infinity turns the window
    // off (sf-list rows-window="off", FO2-3).
    get from() {
      return threshold;
    },

    set from(value) {
      const next = Number(value);
      threshold = Number.isNaN(next) ? ROWS_WINDOW_FROM : Math.max(1, next);
    }

  };
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (rowsWindow);

/***/ },

/***/ "c69a3dc158df"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AVATAR_PLACEHOLDER_ICON: () => (/* binding */ AVATAR_PLACEHOLDER_ICON),
/* harmony export */   AVATAR_SIZES: () => (/* binding */ AVATAR_SIZES),
/* harmony export */   avatarClasses: () => (/* binding */ avatarClasses),
/* harmony export */   avatarContent: () => (/* binding */ avatarContent),
/* harmony export */   avatarPicture: () => (/* binding */ avatarPicture),
/* harmony export */   avatarPictureContext: () => (/* binding */ avatarPictureContext),
/* harmony export */   avatarPictureIcons: () => (/* binding */ avatarPictureIcons),
/* harmony export */   avatarStepText: () => (/* binding */ avatarStepText)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var lit_directives_keyed_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("9d9903b87148");
/* harmony import */ var _helpers_text__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("cbce4a5232a6");
/* harmony import */ var _tone_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("a6b3ed0c1589");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, lit_directives_keyed_js__WEBPACK_IMPORTED_MODULE_1__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, lit_directives_keyed_js__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lit_directives_keyed_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lit_directives_keyed_js__WEBPACK_IMPORTED_MODULE_1__);



 // One avatar drawing (avatar study AV-8, 2026-11-14). sf-avatar and every
// component that shows a person beside its own content -- sf-avatar-group,
// sf-tag, sf-list-item, sf-dropdown, sf-input-lookup, sf-menu-context, the
// signs of sf-list -- draw the picture with these functions and the avatars
// sheet's classes: a photo is an <img> filling the circle, initials stand on
// the neutral plate (or the hue the host names, C17), and with neither the
// placeholder is a glyph on the neutral plate -- person by default, the
// host's icon for a bot, a system or a service. Before, five copies drew it
// five ways: the photo as a background image in the tag, the list row and the
// dropdown, an empty transparent circle in a row with no photo, and the
// context menu's own classes on the secondary container.

/** The sizes of the avatar ladder. */

const AVATAR_SIZES = Object.freeze(["1/4", "1/3", "1/2", "1", "2", "3"]);
/** The glyph of a placeholder: a person, unless the host names another. */

const AVATAR_PLACEHOLDER_ICON = "person"; // The letters a step holds (owner decision C152 (3), 2026-11-14): two from
// 1/3 up, one at 1/4 (16 px holds one letter of a readable size, two were
// 10 px each). Only letters are cut: «+5» or a number stays whole.

function avatarStepText(text, size) {
  const value = String(text ?? "");
  if (String(size ?? "") !== "1/4") return value;
  const letters = value.match(/^(\p{L}\p{M}*)\p{L}/u);
  return letters ? letters[1] : value;
}
/**
 * The drawing context of one avatar picture, from what a host knows: the photo,
 * the initials or the name they are taken from, the hue, the placeholder's
 * glyph, the size (or the text line of a form size) and the shape.
 */

function avatarPictureContext(options = {}) {
  const imageUrl = String(options.imageUrl ?? "").trim();
  const name = String(options.name ?? "").trim();
  const explicitText = String(options.text ?? "").trim();
  const namedIcon = String(options.icon ?? "").trim();
  const size = AVATAR_SIZES.includes(String(options.size ?? "")) ? String(options.size) : ""; // The initials: the host's own, else those of the name -- unless the host
  // names a glyph (a bot, a system), which stands in for them. With a photo
  // they stand under it until it comes and when it fails (C152 (2)).

  const text = avatarStepText(namedIcon ? explicitText : explicitText || (0,_helpers_text__WEBPACK_IMPORTED_MODULE_2__.getInitials)(name), size);
  const isImage = Boolean(imageUrl); // isText: the initials are drawn (alone, or under the photo).

  const isText = Boolean(text);
  const icon = namedIcon || AVATAR_PLACEHOLDER_ICON;
  return {
    size,
    line: String(options.line ?? ""),
    shape: options.shape === "square" ? "square" : "circle",
    imageUrl,
    isImage,
    isText,
    text,
    icon,
    status: options.status || "none",
    expressive: Boolean(options.expressive),
    resolvedHue: isText && options.hue ? (0,_tone_mjs__WEBPACK_IMPORTED_MODULE_3__.resolveAvatarHue)(options.hue, name || text, "") : "",
    rootClass: options.rootClass || "",
    rootStyle: options.rootStyle || "",
    disabled: Boolean(options.disabled),
    // A long list's rows load their photos as they scroll in.
    lazy: Boolean(options.lazy),
    component: options.component
  };
}
/**
 * The classes of the avatar picture. The avatars sheet answers every class
 * this file writes. sf-avatar's own templates hand it their utility classes
 * for the box (options.layout, src/smart/avatar/js/templates/shared.js), as
 * they wrote them before; a host's picture writes none -- sf-avatar--picture
 * gives it the same box from the avatars sheet -- so a host asks the Loader
 * for no utility it did not ask for before (a menu, a tag, a list row).
 */

function avatarClasses(context, options = {}) {
  const includeRootClass = options.includeRootClass !== false;
  const layout = options.layout ?? null;
  const classes = ["sf-avatar", layout ? layout.box : "sf-avatar--picture", context.size ? `sf-avatar--size-${context.size}` : "", context.line ? `sf-avatar--line-${context.line}` : "", layout ? layout.inline : ""].filter(Boolean);

  if (context.isText) {
    classes.push("sf-avatar--text");
    if (layout) classes.push(layout.center); // The hue's role set (core .sf-hue-<name>, C17); the class sheet
    // draws the plate and the ink from it.

    if (context.resolvedHue) {
      classes.push(`sf-hue-${context.resolvedHue}`);
    }
  }

  if (!context.isText) {
    classes.push("sf-avatar--placeholder");
    if (layout) classes.push(layout.center);
  } // The decorative level (C91 level 2): the sheet turns the initials'
  // plate of the largest size into a cover of its hue.


  if (context.expressive) {
    classes.push("sf-avatar--expressive");
  }

  if (context.status && context.status !== "none" && layout) {
    classes.push(layout.anchor);
  }

  if (context.shape === "square") {
    classes.push("sf-avatar--square");
  }

  if (context.status === "online") {
    classes.push("sf-avatar--status-icon-online-indicator");
  }

  if (options.disabled) {
    classes.push("disabled");
  }

  if (includeRootClass && context.rootClass) {
    classes.push(context.rootClass);
  }

  if (options.extraClass) {
    classes.push(options.extraClass);
  }

  return classes.join(" ");
} // The photo says when it has come or failed (C152 (2)): the sheet fades it
// in over the initials when loaded and drops it on an error, so the avatar is
// never an empty circle or the browser's broken-image glyph. The state is
// the runtime mark data-sf-loaded ("true" or "error"), which the template
// does not bind, so a redraw keeps it, and which a first-paint snapshot
// leaves out (it depends on the network); a new address is a new element
// (keyed), which starts transparent again.

function onImageLoad(event) {
  event.currentTarget.dataset.sfLoaded = "true";
}

function onImageError(event) {
  event.currentTarget.dataset.sfLoaded = "error";
}
/**
 * What the circle holds: the initials, or the placeholder glyph as an sf-icon
 * element, so its name reaches the icon font request (a bare <i class="sf-icon">
 * drawn after the page's scan stayed blank: buttons review 2026-11-09); with a
 * photo, the photo over them (owner decision C152 (2)).
 */


function avatarContent(context) {
  const under = context.isText ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-avatar-text">${context.text}</span>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-icon icon=${context.icon || AVATAR_PLACEHOLDER_ICON} aria-hidden="true"></sf-icon>`;
  if (!context.isImage) return under;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${under}${(0,lit_directives_keyed_js__WEBPACK_IMPORTED_MODULE_1__.keyed)(context.imageUrl, (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<img class="sf-avatar-image" src=${context.imageUrl} alt="" loading=${context.lazy ? "lazy" : lit__WEBPACK_IMPORTED_MODULE_0__.nothing} decoding=${context.lazy ? "async" : lit__WEBPACK_IMPORTED_MODULE_0__.nothing} @load=${onImageLoad} @error=${onImageError} />`)}`;
}
/** The icon names a picture draws (for a host's icon preload). */

function avatarPictureIcons(options = {}) {
  const context = avatarPictureContext(options);
  return context.isText ? [] : [context.icon];
}
/**
 * One avatar picture beside a host's own content: a span hidden from
 * assistive technology (the host's visible text names the person), drawn with
 * the avatars sheet. extraClass adds the host's own geometry class.
 */

function avatarPicture(options = {}) {
  const context = avatarPictureContext(options);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span
        class=${avatarClasses(context, {
    extraClass: options.extraClass,
    disabled: context.disabled
  })}
        style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        aria-hidden="true"
    >${avatarContent(context)}</span>`;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "cbce4a5232a6"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getInitials: () => (/* binding */ getInitials),
/* harmony export */   normalizeInitialsWords: () => (/* binding */ normalizeInitialsWords)
/* harmony export */ });
// c282-allow-start: input parsing (initials read from Russian names, C152)
const INITIALS_SKIP_WORDS = new Set(["а", "без", "в", "во", "для", "до", "за", "из", "из-за", "из-под", "и", "к", "ко", "между", "на", "над", "о", "об", "от", "по", "под", "при", "про", "с", "со", "у", "через", "the", "a", "an", "and", "for", "from", "in", "of", "on", "to"]); // Words a name carries that are not the person's or the organisation's own
// (owner decision C152 (3), 2026-11-14): legal forms (ООО «Ромашка» → Р),
// titles (Dr. John Smith → JS) and name particles (Мария фон Штейн → МШ) are
// skipped wherever they stand. Compared without case and without the dots
// around them (normalizeInitialsWords strips those).

const INITIALS_SERVICE_WORDS = new Set([// legal forms
"ооо", "оао", "зао", "пао", "ао", "нао", "ип", "нко", "ано", "гуп", "муп", "фгуп", "гбу", "мбу", "чоп", "llc", "inc", "ltd", "gmbh", "ag", "corp", "co", "llp", "plc", "lp", "bv", "oy", "ab", "srl", "sarl", // titles
"dr", "prof", "mr", "mrs", "ms", "mx", "miss", "sir", "jr", "sr", "phd", "д-р", "проф", "акад", "г-н", "г-жа", "доц", // particles
"фон", "ван", "дер", "де", "ди", "да", "дю", "ла", "ле", "ибн", "бен", "оглы", "кызы", "von", "van", "der", "den", "de", "di", "da", "du", "del", "della", "la", "le", "ten", "ter", "bin", "ibn"]); // c282-allow-end

function normalizeInitialsWords(value = "") {
  return String(value || "").trim().split(/[\s/|]+/).map(word => word.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "")).filter(Boolean);
} // The first character a reader sees: a whole grapheme, so a letter written
// with a combining accent («E» + U+0301) or outside the basic plane keeps all
// of its code points. Array.from alone splits surrogate pairs correctly but
// not combining marks; Intl.Segmenter does both where the platform has it.

function firstGrapheme(word) {
  const Segmenter = globalThis.Intl?.Segmenter;

  if (typeof Segmenter === "function") {
    for (const {
      segment
    } of new Segmenter(undefined, {
      granularity: "grapheme"
    }).segment(word)) {
      return segment;
    }

    return "";
  }

  return Array.from(word)[0] || "";
} // The one rule for initials (reuse audit 2026-11-02, finding 10): sf-avatar,
// the context menu, the admin menu and the chat drew them by five rules that
// disagreed on a hyphen, an empty name and a letter outside the basic plane.
//
//   «Анна Смирнова»        → «АС»   the first letters of the first two words
//   «Отдел по работе»      → «ОР»   a preposition after the first word is skipped
//   «Жан-Поль»             → «ЖП»   one hyphenated word reads as its parts
//   «Анна-Мария Смирнова»  → «АС»   ...but a name of several words by its words
//   «Анна»                 → «А»
//   «ООО «Ромашка»»        → «Р»    legal forms, titles, particles skipped (C152)
//   «Мария фон Штейн»      → «МШ»
//   «Dr. John Smith»       → «JS»
//   «anna@simai.ru»        → «A»    an address: the first letter before «@»
//   «»                     → ''     or `fallback`: '?' where text must stand
//
// `maxLetters` caps the letters (two), `skipWords` replaces the skipped words,
// `locale` capitalises by a locale's rule.


function getInitials(value = "", options = {}) {
  const {
    maxLetters = 2,
    skipWords = INITIALS_SKIP_WORDS,
    fallback = "",
    locale
  } = options;
  let source = String(value ?? "").trim(); // An address reads by the name before «@»: one letter (C152 (3)),
  // anna@simai.ru → A, not the letters of its parts.

  if (/^[^\s@]+@[^\s@]+$/u.test(source)) {
    const local = normalizeInitialsWords(source.slice(0, source.indexOf("@")).replace(/[._+-]+/gu, " "));
    if (!local.length) return String(fallback);
    const letter = firstGrapheme(local[0]);
    return (locale ? letter.toLocaleUpperCase(locale) : letter.toUpperCase()) || String(fallback);
  }

  const allWords = normalizeInitialsWords(source); // Legal forms, titles and particles go first; a name made of them alone
  // keeps them, so it still has initials.

  const ownWords = allWords.filter(word => !INITIALS_SERVICE_WORDS.has(String(word).toLowerCase()));
  const words = ownWords.length ? ownWords : allWords;
  let significantWords = words.filter((word, index) => index === 0 || !skipWords.has(String(word).toLowerCase())); // One word written with a hyphen or a dash is a compound name: its parts
  // are its words. Split before the skip list, «из-за» would be two words.

  if (significantWords.length === 1) {
    const parts = significantWords[0].split(/[-\u2010-\u2015]+/u).filter(Boolean);
    if (parts.length > 1) significantWords = parts;
  }

  if (!significantWords.length) {
    return String(fallback);
  }

  const letters = significantWords.length > 1 ? significantWords.slice(0, Math.max(1, maxLetters)).map(firstGrapheme).join("") : firstGrapheme(significantWords[0]);
  return (locale ? letters.toLocaleUpperCase(locale) : letters.toUpperCase()) || String(fallback);
}

/***/ },

/***/ "50e7fd61ac57"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LONG_PRESS_MS: () => (/* reexport safe */ _core_js_long_press_js__WEBPACK_IMPORTED_MODULE_0__.LONG_PRESS_MS),
/* harmony export */   watchLongPress: () => (/* reexport safe */ _core_js_long_press_js__WEBPACK_IMPORTED_MODULE_0__.watchLongPress)
/* harmony export */ });
/* harmony import */ var _core_js_long_press_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("9cf638c721f7");
// The long press moved to core (core/js/long-press.js, group build 19,
// study S-A): sf-list-item and sf-list import it from here as before.


/***/ },

/***/ "6cfd28b331a1"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _core_js_format_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("5b8371b87515");
/* harmony import */ var _core_js_reading_position_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("6978f1cc153b");
/* harmony import */ var _core_js_menu_open_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("8d229b7c92e9");
/* harmony import */ var _core_js_device_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("cbcfcde04d12");
/* harmony import */ var _core_js_rows_window_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("d3f52a822348");
/* harmony import */ var _core_js_files_drop_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("3180ca98c567");
/* harmony import */ var _core_js_deprecations__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("d3818183b14c");
/* harmony import */ var _js_templates_default_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("1c69b52a2c3c");
/* harmony import */ var _list_item_js_long_press_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("50e7fd61ac57");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("2677706b5ec9");
/* harmony import */ var _lang_index_mjs__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__("31dd7f648272");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_format_js__WEBPACK_IMPORTED_MODULE_2__, _core_js_deprecations__WEBPACK_IMPORTED_MODULE_8__, _js_templates_default_js__WEBPACK_IMPORTED_MODULE_9__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_format_js__WEBPACK_IMPORTED_MODULE_2__, _core_js_deprecations__WEBPACK_IMPORTED_MODULE_8__, _js_templates_default_js__WEBPACK_IMPORTED_MODULE_9__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_deprecations__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_core_js_deprecations__WEBPACK_IMPORTED_MODULE_8__);
// A list a person acts on: a person's conversations, letters, templates,
// files, members, versions -- rows from data, each one a title and a quiet
// second line, which one is open, a few things one can do to a row. The block
// list of SIMAI Framework (duplication audit 2026-11-03, A-7; owner decision
// 2026-11-03, component sets, point 13): sf-chat-threads, sf-mail-letters,
// sf-mail-library, the chat window's files and members and ui-mail's versions
// each wrote the same row model again. sf-list-feed is the block's feed
// variant, for a column a person reads.
//
// What a row *is* stays with the host. An item is data: an id, a text, and
// optionally a supporting line, an icon, a date or a group key, a picture
// (avatar), a count, a badge and pinned. The list draws each one as the
// Framework's row, sf-list-item, with the Framework's own parts in its leading
// and trailing places -- sf-avatar, sf-badge -- and interprets none of it: it
// has no renderer a host could hand it (1.1.0, owner decision q-3b313e2246,
// 2026-11-06: sf-chat-threads becomes a thin wrapper of this list).
//
// It owns the arrangement and nothing else:
//   - groups by the calendar day of each item's date in the reader's time
//     zone («Сегодня», «Вчера», a weekday, the date -- core's
//     formatRelativeDay), or by a key the host names, or none; pinned items
//     lead, under their own heading «Закреплённые» when the list is grouped;
//   - which row is open (`selected`), told by more than a tint;
//   - one Tab stop for the whole list, arrows between rows, across groups
//     (the row's own roving, sf-list-item);
//   - the row's actions in one menu the whole list shares, renaming in place;
//   - asking for the next page when its end comes into reach (core's
//     watchEdge), with a «Show more» button for the keyboard and for a page
//     without IntersectionObserver;
//   - sf-empty-state when there is nothing.
// It never fetches anything: every request leaves as an event.
//
// Keyboard: arrows, Home and End move between rows, Enter opens, F2 renames,
// Shift+F10 or the menu key opens the row's actions; so does a right click,
// at the pointer (1.19.0, C164 (1)).
//
// From its component.json (standard simai.smart-component 1.3.8 §3, §4, §8,
// §11, §18): the settings are attributes and properties made by
// core/js/element-manifest.js, its words are lang/<locale>.json, the actions
// answer outcomes, and the events take the vocabulary's verbs (open, apply,
// rename, load-more).








 // Is the end within watchEdge's margin of the box that scrolls the list (or
// of the window)? Read once, on the scroll that arms the watch.

const EDGE_REACH = parseFloat(_core_js_reading_position_js__WEBPACK_IMPORTED_MODULE_3__.EDGE_MARGIN) || 0;

function endInReach(sentinel, root) {
  const end = sentinel.getBoundingClientRect();
  const view = sentinel.ownerDocument.defaultView;
  const box = root ? root.getBoundingClientRect() : {
    top: 0,
    bottom: view?.innerHeight ?? 0
  };
  return end.top <= box.bottom + EDGE_REACH && end.bottom >= box.top - EDGE_REACH;
}




 // Only the words on screen ship in the bundle, English only (owner decision
// C282): Russian and every other language come from a language file. The
// title, settings and events stay in the language files for the Studio and the
// docs (localization study LC-2).
// A text longer than this is not a name; the rename field stops there, as the
// server that stores it most likely does.

const TEXT_LIMIT = 200;

const applied = () => ({
  outcome: "applied"
});

const refused = reason => ({
  outcome: "refused",
  reason
}); // One item as the list holds it: id a string, the rest as given.


const normalItem = item => ({ ...item,
  id: String(item.id)
});

const word = value => typeof value === "string" ? value.trim() : "";

const SHAPES = new Set(["circle", "square"]); // The skeleton's leading place by the setting leading (1.17.0).

const LEADING = new Set(["auto", "none", "icon", "avatar"]); // The skeleton rows' line count by the setting lines (1.18.0).

const LINES = new Set(["auto", "1", "2"]); // The badge's tone is a word of the Framework's status set
// (contracts/public-api-axes.json status_vocabulary); neutral is no status.

const TONES = new Set(["neutral", "info", "success", "warning", "error"]); // The largest count drawn as a number; a larger one reads «99+», as
// sf-avatar's badge-cap does by default.

const COUNT_CAP = 99; // Below this many rem of the list's own width a row's badge and count stand
// under its text (C47; the width the owner's prototype drew it at).

const NARROW_REM = 20; // A wider list goes narrow too when a row's title would keep less than half
// of the row's text column, or less than this many rem (C47 follow-up: a
// long badge on a 366 px phone column left the title 55 px, «Порта…»).

const TITLE_MIN_REM = 10;
const NARROW = "data-sf-list-narrow"; // 1.14.0: a frame in a shrink-to-fit place, taken out of the container query.

const FIT = "data-sf-list-fit"; // The frame's content box width: what the container query reads.

const contentWidth = (frame, style) => frame.clientWidth - (parseFloat(style.paddingLeft) || 0) - (parseFloat(style.paddingRight) || 0);
/**
 * The item's picture, or null: {image-url?, text?, shape?, icon?}. A sign
 * (icon without an image) is a glyph in the avatar's place -- a channel, an
 * agent, a bot; an image or initials are sf-avatar's.
 */


function avatarOf(item) {
  const avatar = item?.avatar;
  if (!avatar || typeof avatar !== "object" || Array.isArray(avatar)) return null;
  const imageUrl = word(avatar["image-url"]);
  const icon = word(avatar.icon);
  return {
    kind: icon && !imageUrl ? "sign" : "avatar",
    shape: SHAPES.has(avatar.shape) ? avatar.shape : "circle",
    imageUrl,
    text: word(avatar.text),
    icon
  };
}
/** The item's count as a whole number above 0, else 0. */


function countOf(item) {
  const count = Number(item?.count);
  return Number.isFinite(count) && count >= 1 ? Math.floor(count) : 0;
}
/**
 * Is the row unread? A count says so (owner decision C167 (3)); a letter
 * without one says it with unread: true (1.15.0, C189 (8)). A number above 0
 * is read as true -- sf-chat-threads spells its unread count unread -- and
 * draws no number: the number is count's.
 */


function unreadOf(item) {
  if (countOf(item)) return true;
  const unread = item?.unread;
  return unread === true || typeof unread === "number" && unread > 0;
}
/** The item's date as an ISO moment for sf-time, or "" when it has none. */


function momentOf(item) {
  const moment = item?.date == null || item.date === "" ? null : (0,_core_js_format_js__WEBPACK_IMPORTED_MODULE_2__.toDate)(item.date);
  return moment && Number.isFinite(moment.getTime()) ? moment.toISOString() : "";
}
/** The item's badge, {text, tone}, or null: a badge with no text draws nothing. */


function badgeOf(item) {
  const badge = item?.badge;
  if (!badge || typeof badge !== "object" || Array.isArray(badge)) return null;
  const text = word(badge.text);
  if (!text) return null;
  return {
    text,
    tone: TONES.has(badge.tone) ? badge.tone : "neutral"
  };
} // set-items(list, {hasMore}) or set-items({items, has-more}) (§4.4: one object
// in declared order).


const pageArguments = (first, second) => {
  if (first && !Array.isArray(first) && typeof first === "object" && Array.isArray(first.items)) {
    return {
      items: first.items,
      hasMore: Boolean(first["has-more"] ?? first.hasMore ?? first.options?.hasMore)
    };
  }

  return {
    items: Array.isArray(first) ? first : [],
    hasMore: Boolean(second?.hasMore ?? second?.["has-more"])
  };
};

const ListElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_11__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: _lang_index_mjs__WEBPACK_IMPORTED_MODULE_12__.files,
  source: "ru"
});
let listCount = 0;

class SfList extends ListElement {
  static get props() {
    return { ...super.props,
      templateName: {
        attribute: "template",
        default: "default"
      }
    };
  }

  constructor() {
    super();
    this._items = []; // The shape of the rows last shown, for the skeleton (skeletonShape()).

    this._shownShape = null;
    this._actions = [];
    this._groups = [];
    this._loadingMore = false;
    this._editing = null;
    this._menuFor = null;
    this._focusAfter = null;
    this._stopEdge = null;
    this._edge = null;
    this._dayTimer = 0; // A long list draws the rows in view (FO-2, core/js/rows-window.js):
    // a list of 1 000 entries or more (C308), the entries a person can see and 20
    // on each side, two spacers standing for the rest. A grouped list is
    // one run of «heading, its rows» (FO2-1); a range never starts inside
    // a group without its heading. Each entry's height is kept by its id
    // (FO2-4). rows-window="off" draws every row (FO2-3).

    this._entries = [];
    this._rowsWindow = (0,_core_js_rows_window_js__WEBPACK_IMPORTED_MODULE_6__.rowsWindow)({
      body: () => this.querySelector(":scope > .sf-list__frame [data-sf-rows-window]"),
      rows: () => [...this.querySelectorAll([":scope > .sf-list__frame .sf-list__rows[data-sf-rows-window] > .sf-list__row", ":scope > .sf-list__frame .sf-list__body[data-sf-rows-window] > .sf-list__group > .sf-list__heading", ":scope > .sf-list__frame .sf-list__body[data-sf-rows-window] > .sf-list__group > .sf-list__rows > .sf-list__row"].join(", "))],
      onMove: () => this.requestComponentUpdate("window"),
      key: index => this._entries[index]?.key,
      snap: index => this._entries[index]?.head ?? index,
      // A sticky heading reads where it stuck (sticky-headings): its
      // place in the flow is the top of its group's content box.
      place: element => {
        if (!element.classList.contains("sf-list__heading")) return element.getBoundingClientRect().top;
        const group = element.parentElement;
        const style = getComputedStyle(group);
        return group.getBoundingClientRect().top + (parseFloat(style.borderTopWidth) || 0) + (parseFloat(style.paddingTop) || 0) + (parseFloat(getComputedStyle(element).marginTop) || 0);
      },
      guess: 40
    }); // The rows chosen (selection many, 1.22.0): ids, and the row a Shift
    // range starts from.

    this._chosen = new Set();
    this._lastPicked = null;
    this._shiftPress = false;
    this._selectionActions = [];
    listCount += 1;
    this._uid = `sf-list-${listCount}`; // A value set as a property before the element was defined is an own
    // property that would hide the accessor; it is taken through it.

    for (const name of ["items", "actions", "groups", "chosen", "selectionActions"]) {
      if (!Object.prototype.hasOwnProperty.call(this, name)) continue;
      const early = this[name];
      delete this[name];
      this[name] = early;
    }
  } // ── state the host sets ──────────────────────────────────────────────────
  // A printed skeleton (data-sf-first-paint="skeleton") stays until the host
  // gives the items (standard 1.3.8 §5.4): the first render then draws them
  // over it in one frame. An empty list given is an answer too -- the empty
  // state draws -- where the base's test counts it as not yet given.


  sfAwaitingData() {
    return this.getAttribute("data-sf-first-paint") === "skeleton" && !this._sfDataGiven;
  }
  /** The items shown, in the host's order (§18.4: entries by id). */


  get items() {
    return this._items.map(item => ({ ...item
    }));
  }

  set items(value) {
    this._sfDataGiven = true;
    const seen = new Set();
    this._items = (Array.isArray(value) ? value : []).filter(item => item && item.id != null && !seen.has(String(item.id)) && seen.add(String(item.id))).map(normalItem);
    if (this._editing && !seen.has(this._editing)) this._editing = null;
    this.keepChosen();
    this.requestComponentUpdate("items");
  } // ── choosing several rows (1.22.0; C167 (5), C150 (9), Larena LF-10) ────

  /** The ids of the rows chosen, in the list's order (selection many). */


  get chosen() {
    return this._items.filter(item => this._chosen.has(item.id)).map(item => item.id);
  }
  /** A page may choose rows: a list of ids, or ids separated by commas or spaces. */


  set chosen(value) {
    const list = Array.isArray(value) ? value : String(value ?? "").split(/[\s,]+/u);
    this._chosen = new Set(list.map(one => String(one)).filter(Boolean));
    this._lastPicked = null;
    this.keepChosen();
    this.requestComponentUpdate("chosen");
  }
  /** The actions of the choice's bar, sf-bulk-actions' own shape: [{id, text, icon?, status?, confirm?, undo?}]. */


  get selectionActions() {
    return this._selectionActions.map(action => ({ ...action
    }));
  }

  set selectionActions(value) {
    let list = value;

    if (typeof list === "string") {
      try {
        list = JSON.parse(list);
      } catch {
        list = [];
      }
    }

    this._selectionActions = Array.isArray(list) ? list.filter(action => action && action.id && action.text).map(action => ({ ...action,
      id: String(action.id)
    })) : [];
    this.requestComponentUpdate("selection-actions");
  }

  get selecting() {
    return this.getAttribute("selection") === "many";
  } // A chosen row that left the list is no longer chosen: the ids kept are
  // the rows the list holds (items not yet given keep the page's choice).


  keepChosen() {
    if (!this._chosen.size || !this._sfDataGiven) return;
    const ids = new Set(this._items.map(item => item.id));
    const before = this._chosen.size;

    for (const id of [...this._chosen]) if (!ids.has(id)) this._chosen.delete(id);

    if (this._chosen.size !== before) this.choiceChanged();
  } // A press, Space or the check box on a row: the row is chosen or let go;
  // with Shift every row from the last one pressed to this one is chosen.
  // A disabled row is never chosen.


  toggleChosen(id, range = false) {
    // As an action it takes {id, range} too (data-sf-action, §4.4).
    if (id && typeof id === "object") ({
      id,
      range = false
    } = id);
    if (!this.selecting) return refused("selection");
    const key = String(id);

    const order = this._items.filter(item => item.disabled !== true).map(item => item.id);

    if (!order.includes(key)) return refused("unknown");

    if (range && this._lastPicked !== null && order.includes(this._lastPicked)) {
      const [from, to] = [order.indexOf(this._lastPicked), order.indexOf(key)].sort((a, b) => a - b);

      for (const one of order.slice(from, to + 1)) this._chosen.add(one);
    } else if (this._chosen.has(key)) {
      this._chosen.delete(key);
    } else {
      this._chosen.add(key);
    }

    this._lastPicked = key;
    this.choiceChanged();
    return applied();
  }
  /** Lets every row go (the bar's ×, Escape, or the page). */


  clearSelection() {
    if (!this._chosen.size) return refused("empty");

    this._chosen.clear();

    this._lastPicked = null;
    this.choiceChanged();
    return applied();
  } // The choice is the host's to act on: select {chosen, count, total}.


  choiceChanged() {
    this.requestComponentUpdate("chosen");
    this.sfEmit("select", {
      chosen: this.chosen,
      count: this._chosen.size,
      total: this._items.length
    });
  } // Whether the press that is being answered held Shift (a click, or the
  // check box's change after it), read once.


  takeShift() {
    const shift = this._shiftPress;
    this._shiftPress = false;
    return shift;
  } // The bar's action is the list's apply over the chosen rows; a page that
  // cancels it keeps the bar's own handling (the question, the undo).


  onBulkAction(event) {
    event.stopPropagation();
    const id = String(event.detail?.id ?? "");
    if (!id) return;
    const delivered = this.sfEmit("apply", {
      action: id,
      scope: "selection",
      ids: this.chosen
    });
    if (!delivered) event.preventDefault();
  }

  onBulkClear(event) {
    event.stopPropagation();
    this.clearSelection();
    this.focusRow(this._lastPicked ?? this.chosen[0] ?? null);
  }
  /**
   * The row actions, in the shared menu after «Rename»: [{id, text, icon?,
   * destructive?}]. Chosen, one leaves as sf-list-apply {action, scope:
   * entry, ids}. An item narrows them with `actions: [ids]`, or takes them
   * away with `actions: false`.
   */


  get actions() {
    return this._actions.map(action => ({ ...action
    }));
  }

  set actions(value) {
    this._actions = Array.isArray(value) ? value.filter(action => action && action.id && action.text).map(action => ({ ...action,
      id: String(action.id)
    })) : [];
    this.requestComponentUpdate("actions");
  }
  /** The groups of group-by="key", in order: [{key, text}]. A key not listed follows, its key as its heading. */


  get groups() {
    return this._groups.map(group => ({ ...group
    }));
  }

  set groups(value) {
    this._groups = Array.isArray(value) ? value.filter(group => group && group.key != null).map(group => ({
      key: String(group.key),
      text: String(group.text ?? group.key)
    })) : [];
    this.requestComponentUpdate("groups");
  } // ── actions (§4.4) ───────────────────────────────────────────────────────

  /** The whole list and whether more follows, together; ends a page request. */


  setItems(first = [], second = {}) {
    const {
      items,
      hasMore
    } = pageArguments(first, second);
    this.items = items;
    this._loadingMore = false;
    if (this.loading) this.loading = false;
    this.hasMore = hasMore; // A new end is watched again: a watch that starts on an end in reach
    // reports it at once, which is the next page when there is one.

    this.unwatchEnd();
    this.requestComponentUpdate("page");
    return applied();
  }
  /** The next page after what is shown; ends the page request. */


  appendItems(first = [], second = {}) {
    const {
      items,
      hasMore
    } = pageArguments(first, second);
    const known = new Set(this._items.map(item => item.id));
    return this.setItems([...this._items, ...items.filter(item => item && item.id != null && !known.has(String(item.id)))], {
      hasMore
    });
  }
  /** A new item at the start, or a changed one in its place. */


  upsert(params) {
    const item = params?.item && typeof params.item === "object" && params.id === undefined ? params.item : params;
    if (!item || item.id == null) return refused("no-id");
    const next = normalItem(item);

    const at = this._items.findIndex(one => one.id === next.id);

    const list = [...this._items];
    if (at >= 0) list[at] = next;else list.unshift(next);
    this._items = list;
    this._sfDataGiven = true;
    this.requestComponentUpdate("upsert");
    return applied();
  }
  /** Take one item off. */


  detach(params) {
    const id = String(params && typeof params === "object" ? params.id : params ?? "");
    if (!this._items.some(item => item.id === id)) return refused("unknown");
    const rows = this.rows();
    const at = rows.findIndex(row => this.idOf(row) === id); // The focus that was on the row goes to its neighbour, not to the page.

    if (at >= 0 && rows[at].contains(this.ownerDocument.activeElement)) {
      this._focusAfter = this.idOf(rows[at + 1] ?? rows[at - 1] ?? null);
    }

    this._items = this._items.filter(item => item.id !== id);
    if (this._editing === id) this._editing = null;
    this.requestComponentUpdate("detach");
    return applied();
  } // The list's own «Показать ещё» and its scroll request (has-more) are
  // retired in favour of sf-pagination appearance="more" after the list
  // (owner decision C167 (1): the end of a list is that button, with «Показано
  // X из Y»). They still work until 2027-01-01, noted once per element in
  // SF.deprecations (journal attribute-list-has-more-to-pagination-more).


  ownMore() {
    if (!this.hasMore) return false;

    if (!this._ownMoreNoted) {
      this._ownMoreNoted = true;
      (0,_core_js_deprecations__WEBPACK_IMPORTED_MODULE_8__.noteDeprecated)({
        component: "sf-list",
        tag: "sf-list",
        kind: "attribute",
        from: "has-more",
        to: "sf-pagination appearance=\"more\"",
        since: "2026-11-16",
        remove_after: "2027-01-01"
      });
    }

    return true;
  }
  /** The next page could not be loaded: reaching the end, or «Show more», asks again. */


  moreFailed() {
    this._loadingMore = false;
    this.unwatchEnd();
    this.requestComponentUpdate("more");
    return applied();
  }
  /** Ask the host for the next page, as reaching the end and «Show more» do. */


  requestMore() {
    if (this._loadingMore) return refused("loading");
    if (this.loading) return refused("loading");
    if (!this.hasMore) return refused("no-more");
    this._loadingMore = true;
    this.requestComponentUpdate("more");

    if (!this.sfEmit("load-more", {
      direction: "after",
      after: this._items.at(-1)?.id ?? null
    })) {
      this._loadingMore = false;
      this.requestComponentUpdate("more");
      return refused("prevented");
    }

    return applied();
  }
  /** Rename in place: Enter keeps, Escape gives up, leaving the field keeps. */


  rename(params) {
    const id = String(params?.id ?? params ?? "");
    if (!this.renamable) return refused("not-renamable");

    const item = this._items.find(one => one.id === id);

    if (!item) return refused("unknown");
    if (item.disabled === true) return refused("disabled");
    this.closeMenu();
    this._editing = id;
    this.requestComponentUpdate("rename");
    return applied();
  }
  /** Open the row's actions, as the «⋯» button and Shift+F10 do. */


  openMenu(params, anchorGiven = null) {
    const id = String(params?.id ?? params ?? "");

    const item = this._items.find(one => one.id === id);

    if (!item) return refused("unknown");
    const entries = this.menuEntries(item);
    if (!entries.length) return refused("no-actions");
    const row = this.rowFor(id); // A point {x, y} in the window: where a right click was (C164 (1)).

    const point = anchorGiven && !(anchorGiven instanceof Element) && Number.isFinite(Number(anchorGiven.x)) && Number.isFinite(Number(anchorGiven.y)) ? {
      x: Number(anchorGiven.x),
      y: Number(anchorGiven.y)
    } : null;
    const anchor = anchorGiven instanceof Element ? anchorGiven : row?.closest(".sf-list__row")?.querySelector(".sf-list__actions") ?? row ?? this;
    this._menuFor = id; // The page's one menu (core SF.menu.open, owner decision C184 (4)),
    // fetched by the Loader the first time: the «⋯», Shift+F10 and a right
    // click open the same list, and the focus goes back to the row.

    const opening = (0,_core_js_menu_open_js__WEBPACK_IMPORTED_MODULE_4__.menuOpen)({ ...(point ?? {
        anchor
      }),
      entries,
      label: this.sfWord("actions-label", {
        vars: {
          text: item.text || this.sfWord("untitled-text")
        }
      }),
      returnTo: row ?? null
    });
    this._menuOpening = opening;
    opening.then(choice => {
      if (this._menuOpening === opening) this._menuOpening = null;
      if (choice) this.onMenu({
        id: choice.id,
        entry: choice.entry
      }, id);
    });
    return applied();
  } // ── words and what is drawn ──────────────────────────────────────────────
  // The page's one menu while it holds this list's actions (C184 (4)).


  get menu() {
    return this.ownerDocument.querySelector("[data-sf-menu-shared]");
  } // The menu of one row: «Rename» when the list renames, then the host's
  // actions the item allows. An action that carries `devices` (study S-A,
  // Touch screens rule 4) is offered only in the layouts it names, the
  // layout of the list's place (core SF.device.layoutOf, phone below 600).


  menuEntries(item) {
    if (item.disabled === true) return [];
    const allowed = item.actions === false ? [] : Array.isArray(item.actions) ? new Set(item.actions.map(String)) : null;

    const scoped = this._actions.some(action => action.devices !== undefined && action.devices !== null);

    const layout = scoped && this.isConnected ? (0,_core_js_device_js__WEBPACK_IMPORTED_MODULE_5__.layoutOf)(this) : "desktop";

    const own = this._actions.filter(action => (!allowed || allowed.has(action.id)) && (0,_core_js_device_js__WEBPACK_IMPORTED_MODULE_5__.inLayout)(action, layout));

    return [...(this.renamable ? [{
      id: "rename",
      text: this.sfWord("rename-text"),
      icon: "edit",
      shortcut: "F2"
    }] : []), ...own.map(action => ({
      id: `action:${action.id}`,
      text: action.text,
      ...(action.icon ? {
        icon: action.icon
      } : {}),
      ...(action.destructive ? {
        status: "error"
      } : {})
    }))];
  }

  hasMenu(item) {
    return this.menuEntries(item).length > 0;
  }

  keyShortcuts(item) {
    return [this.hasMenu(item) ? "Shift+F10" : "", this.renamable && item.disabled !== true ? "F2" : ""].filter(Boolean).join(" ");
  } // The groups in the order their first item comes: the host sorts, the list
  // does not. By day, each item's calendar day in the reader's time zone, an
  // unreadable date its own last group; by key, the order of `groups`, then
  // any key it does not list.
  //
  // Pinned items lead, in the host's order: under their own heading
  // («Закреплённые») before the day or key groups; ungrouped, first in the
  // one list.


  arranged() {
    const by = this.groupBy;

    const pinned = this._items.filter(item => item.pinned === true);

    const rest = pinned.length ? this._items.filter(item => item.pinned !== true) : this._items;
    if (by !== "day" && by !== "key") return [{
      key: "all",
      heading: "",
      items: [...pinned, ...rest]
    }];
    const groups = new Map();
    const now = new Date();

    for (const item of rest) {
      let key;
      let heading;
      let date = "";

      if (by === "day") {
        const moment = (0,_core_js_format_js__WEBPACK_IMPORTED_MODULE_2__.toDate)(item.date);
        const offset = moment ? (0,_core_js_format_js__WEBPACK_IMPORTED_MODULE_2__.calendarDayOffset)(moment, {
          now
        }) : NaN;
        key = Number.isFinite(offset) ? `day:${offset}` : "day:none";
        heading = Number.isFinite(offset) ? (0,_core_js_format_js__WEBPACK_IMPORTED_MODULE_2__.formatRelativeDay)(moment, {
          now,
          capital: true,
          node: this
        }) : this.sfWord("undated-text"); // Today and yesterday say the date beside the word (C40).

        date = offset === 0 || offset === -1 ? moment.toISOString() : "";
      } else {
        key = `key:${item.group ?? ""}`;

        const declared = this._groups.find(group => group.key === String(item.group ?? ""));

        heading = declared?.text ?? (item.group == null || item.group === "" ? this.sfWord("ungrouped-text") : String(item.group));
      }

      if (!groups.has(key)) groups.set(key, {
        key,
        heading,
        date,
        items: []
      });
      groups.get(key).items.push(item);
    }

    const list = [...groups.values()];

    if (by === "key" && this._groups.length) {
      const order = this._groups.map(group => `key:${group.key}`);

      const rank = key => order.includes(key) ? order.indexOf(key) : order.length;

      list.sort((a, b) => rank(a.key) - rank(b.key));
    }

    if (by === "day") {
      const undated = list.findIndex(group => group.key === "day:none");
      if (undated >= 0) list.push(...list.splice(undated, 1));
    }

    if (pinned.length) list.unshift({
      key: "pinned",
      heading: this.sfWord("pinned-text"),
      items: pinned
    });
    return list;
  } // The leading place of the rows: none when no item has an avatar and the
  // rows are all with an icon or all without. When one has an avatar, every
  // row keeps the place, so the titles start at one line; a row without an
  // avatar shows its icon there, or nothing. Its width is the avatar of a
  // two-line row when any row of the list has a second line, else the row's
  // line: a one-line row keeps its control height. A row without an icon
  // among rows with one keeps the icon's place too (owner C105), at the
  // row's line. (1.17.0: named leadingPlace(), the setting leading is the
  // skeleton's.)


  leadingPlace() {
    if (this._items.some(item => avatarOf(item))) {
      return {
        wide: this._items.some(item => Boolean(item.supporting))
      };
    }

    const icon = item => typeof item?.icon === "string" && item.icon.trim() !== "";

    if (this._items.some(icon) && !this._items.every(icon)) return {
      wide: false
    };
    return null;
  } // The format of a row's time (1.15.0), as sf-list-timeline's time-format
  // reads: under a day heading the clock time, since the heading names the
  // day; elsewhere -- ungrouped, by key, the pinned group -- the moment in
  // full. null: time-format none, no time.


  timeFormatFor(group) {
    const asked = this.timeFormat;
    if (asked !== "auto" && asked !== "relative" && asked !== "exact") return null;
    if (asked === "relative") return "relative";
    const underDay = this.groupBy === "day" && typeof group?.key === "string" && group.key.startsWith("day:");
    if (asked === "exact") return underDay ? "time" : "datetime";
    return underDay ? "time" : "auto";
  } // The shape of the skeleton rows (1.16.0, C130, C148 (1)): the shape of
  // the rows the list has shown -- one line or the caption row, and the
  // leading place they draw: an avatar's (wide when a row has a second
  // line, its shape), an icon's, or none. It is kept when the rows are
  // taken away for a reload (items = [] and loading), so the rows that come
  // back find their place; until the list has shown rows it is the caption
  // row with no leading place -- the list does not guess one.
  //
  // 1.17.0: the setting leading says the place instead of the rows shown
  // (C130, C148 (1)): icon, avatar or none hold from the first frame, so a
  // list whose rows will carry icons or avatars has its title bar start
  // where the title will before it has shown any; auto is the shape of the
  // rows shown. The line count, and an avatar's shape and width, still
  // come from the rows shown; before any, the caption row's: an avatar of
  // the control height, a circle.
  //
  // 1.18.0: the setting lines says the line count instead of the rows shown
  // (C130): 1 or 2 hold from the first frame, so a one-line list's first
  // skeleton row is as tall as its rows (40, not the caption row's 48 at
  // 1440) and an avatar's box is the one-line box; auto is the line count
  // of the rows shown, the caption row before any. A declared count also
  // gives the avatar its width: the control height with a second line,
  // else the row's line.


  skeletonShape() {
    const items = this._items;

    if (items.length) {
      const avatar = items.map(item => avatarOf(item)).find(Boolean);
      const icon = items.some(item => typeof item?.icon === "string" && item.icon.trim() !== "");
      this._shownShape = {
        twoLine: items.some(item => Boolean(item.supporting)),
        lead: avatar ? {
          kind: "avatar",
          wide: items.some(item => Boolean(item.supporting)),
          shape: avatar.shape
        } : icon ? {
          kind: "icon"
        } : null
      };
    }

    const shown = this._shownShape ?? {
      twoLine: true,
      lead: null
    };
    const lines = LINES.has(this.lines) ? this.lines : "auto";
    const twoLine = lines === "auto" ? shown.twoLine : lines === "2";
    const declared = LEADING.has(this.leading) ? this.leading : "auto";
    const learned = shown.lead?.kind === "avatar" ? shown.lead : null;
    const wide = learned && lines === "auto" ? learned.wide : twoLine;
    if (declared === "none") return {
      twoLine,
      lead: null
    };
    if (declared === "icon") return {
      twoLine,
      lead: {
        kind: "icon"
      }
    };
    if (declared === "auto") return {
      twoLine,
      lead: learned ? { ...learned,
        wide
      } : shown.lead
    };
    return {
      twoLine,
      lead: {
        kind: "avatar",
        wide,
        shape: learned ? learned.shape : "circle"
      }
    };
  } // The range a long list draws, or null (FO-2): a list that is not
  // loading and has no row being renamed. An ungrouped list is its rows; a
  // grouped one is one run of each group's heading and rows (FO2-1), and the
  // range says, per group, the rows it draws (parts: group key -> [from,
  // to], rows of the group). rows-window="off" draws every row (FO2-3).


  windowOf(sections, loading) {
    // C308 FO-2: from 1 000 entries, or the list's own rows-window-from;
    // rows-window="off" never.
    const own = Number.parseInt(this.getAttribute("rows-window-from") ?? "", 10);
    this._rowsWindow.from = this.getAttribute("rows-window") === "off" ? Infinity : own > 0 ? own : _core_js_rows_window_js__WEBPACK_IMPORTED_MODULE_6__.ROWS_WINDOW_FROM;
    const flat = sections.length === 1 && sections[0].key === "all";
    const entries = [];

    for (const group of sections) {
      const head = entries.length;
      if (!flat) entries.push({
        key: `head:${group.key}`,
        head,
        group: group.key,
        row: -1
      });
      group.items.forEach((item, row) => entries.push({
        key: `row:${item.id}`,
        head: flat ? entries.length : head,
        group: group.key,
        row
      }));
    }

    this._entries = entries;

    if (loading || this._editing) {
      this._rowsWindow.slice(0);

      return null;
    }

    const slice = this._rowsWindow.slice(entries.length);

    if (!slice) return null;
    const parts = new Map();

    for (let index = slice.first; index <= slice.last; index += 1) {
      const entry = entries[index];
      if (!entry) continue;
      const part = parts.get(entry.group) ?? [Infinity, -1];
      if (entry.row >= 0) parts.set(entry.group, [Math.min(part[0], entry.row), Math.max(part[1], entry.row)]);else parts.set(entry.group, part);
    }

    return { ...slice,
      flat,
      parts
    };
  } // Home and End in a long list go to the whole list's first and last row,
  // which may not be drawn: the range is put there first (FO-2). The
  // arrows find the next row drawn, since the range keeps rows beyond the
  // visible ones and moves as the focused row scrolls into view.


  onWindowKey = event => {
    if (!this._rowsWindow.windowed || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key !== "Home" && event.key !== "End") return;
    const row = event.target?.closest?.(".sf-list-item[data-sf-list-roving]");
    if (!row || event.target !== row || !this.contains(row)) return;
    const sections = this.arranged();
    const items = sections.flatMap(group => group.items);
    const item = event.key === "Home" ? items[0] : items.at(-1);
    if (!item) return;
    event.preventDefault();
    event.stopPropagation();

    const at = this._entries.findIndex(entry => entry.key === `row:${item.id}`);

    this._rowsWindow.reveal(event.key === "Home" ? 0 : Math.max(0, at)); // The row is drawn with the moved range and draws itself a frame or
    // more later: it is waited for longer than a renamed row.


    this.focusRow(item.id, 30);
  };

  templateContext() {
    const loading = this.loading;
    const sections = this.arranged();
    const empty = !loading && this._items.length === 0;
    const range = this.windowOf(sections, loading);
    return {
      component: this,
      uid: this._uid,
      label: this.label,
      headingLevel: this.headingLevel,
      stickyHeadings: this.stickyHeadings === true,
      size: this.size,
      noWrap: this.noWrap === true,
      divided: this.divided === true,
      sections,
      window: range,
      // Drawn whole, a long list's rows skip layout and paint off
      // screen (content-visibility, C308 FO-2); find and print reach them.
      rowsAll: !range && !loading && this._entries.length >= _core_js_rows_window_js__WEBPACK_IMPORTED_MODULE_6__.ROWS_VISIBILITY_FROM,
      leading: this.leadingPlace(),
      avatarOf,
      countOf,
      unreadOf,
      momentOf,
      // The row's time (1.15.0): sf-time's format for the rows of a
      // group, or null when the list draws no time (timeFormatFor).
      timeFormat: group => this.timeFormatFor(group),
      unreadText: this.sfWord("unread-text"),
      badgeOf,
      countCap: COUNT_CAP,
      countLabel: count => this.sfWord("count-label", {
        count
      }),
      grouped: this.groupBy === "day" || this.groupBy === "key",
      selected: this.selected,
      selecting: this.selecting,
      chosen: this.selecting ? this._chosen : new Set(),
      pickLabel: text => this.sfWord("pick-label", {
        vars: {
          text
        }
      }),
      rowCount: this._items.length,
      selectionActions: this._selectionActions,
      editing: this._editing,
      loading,
      // The skeleton's rows take the shape of the rows the list has
      // shown, else the caption row with no leading place (template
      // skeleton()).
      skeleton: this.skeletonShape(),
      loadingText: this.sfWord("loading-text"),
      empty,
      emptyHeading: this.emptyText,
      emptyContent: this.hasSlotContent("empty") ? this.getSlotContent("empty") : null,
      showMore: this.ownMore() && !loading,
      loadingMore: this._loadingMore,
      // The label stays while the page is on its way, so the button keeps
      // its width; the wait is said by the status beside it.
      moreText: this.sfWord("more-text"),
      loadingMoreText: this.sfWord("loading-more-text"),
      renameLabel: this.sfWord("rename-label"),
      untitledText: this.sfWord("untitled-text"),
      actionsLabel: text => this.sfWord("actions-label", {
        vars: {
          text
        }
      }),
      hasMenu: item => this.hasMenu(item),
      textLimit: TEXT_LIMIT
    };
  }

  template() {
    return (0,_js_templates_default_js__WEBPACK_IMPORTED_MODULE_9__.renderListTemplate)(this.templateContext());
  } // The rows are drawn; the list's sheets may still be on their way. The
  // width is watched from now (C47): when the sheet comes, the observer
  // measures the frame before it is painted with it, so no frame of a
  // squeezed title is shown first.


  whenRenderedStylesReady(target) {
    this.watchWidth();
    return super.whenRenderedStylesReady(target);
  }

  afterRender(changed) {
    super.afterRender?.(changed);

    if (this._rowsWindow.windowed) {
      this._rowsWindow.start();

      this._rowsWindow.sync();
    } else {
      this._rowsWindow.stop();
    }

    this.watchEnd();
    this.watchWidth(); // The keys a row answers, said to assistive technology on the row itself
    // (sf-list-item draws the row; an attribute it does not bind stays).

    for (const row of this.rows()) {
      const item = this._items.find(one => one.id === this.idOf(row));

      const keys = item ? this.keyShortcuts(item) : "";
      if (keys) row.setAttribute("aria-keyshortcuts", keys);else row.removeAttribute("aria-keyshortcuts");
    }

    if (this._editing) {
      const input = this.querySelector(".sf-list__rename");

      if (input && !input.dataset.focused) {
        input.dataset.focused = "true";
        input.focus();
        input.select();
      }

      return;
    }

    if (this._focusAfter !== null) {
      const id = this._focusAfter;
      this._focusAfter = null;
      this.focusRow(id);
    }
  } // A row drawn again (the rename field gave its place back) is a new
  // sf-list-item that draws itself a frame later: wait for it a few frames.


  focusRow(id, frames = 4) {
    const row = this.rowFor(id);
    if (row) this.moveTo(row);else if (frames > 0 && this.isConnected) requestAnimationFrame(() => this.focusRow(id, frames - 1));
  }

  onConnected() {
    super.onConnected?.();
    this.watchDay(); // Files from the computer on the whole list (owner decision C308
    // FO-1): a folder, a chat, attachments, when the list's owner turns it
    // on (accept-files); the one drop overlay of the page says where they
    // go; a zone inside the list (a row's own) wins. The list uploads
    // nothing itself: attach asks the host.

    this._filesDrop ??= (0,_core_js_files_drop_js__WEBPACK_IMPORTED_MODULE_7__.filesDrop)(this, {
      target: () => this.acceptFiles === true || this.hasAttribute("accept-files") ? this : null,
      overlay: () => this.sfWord("files-drop-text", {
        vars: {
          target: this.label || this.sfWord("label")
        }
      }),
      onFiles: (files, {
        skipped
      }) => {
        if (files.length || skipped.length) this.sfEmit("attach", {
          files,
          skipped
        });
      }
    });
    this.addEventListener("keydown", this.onWindowKey, true); // A long press on a row under a finger opens its menu, as its «⋯»
    // does (owner decision C148 (6)); the click its release sends opens
    // nothing. No swipe.

    if (!this._longPress) {
      this._longPress = (0,_list_item_js_long_press_js__WEBPACK_IMPORTED_MODULE_10__.watchLongPress)(this, {
        // With selection many a long press chooses the row (C150 (9),
        // a phone has no hover); its menu stays on its «⋯».
        accepts: event => {
          const row = event.target.closest?.(".sf-list-item[data-sf-list-roving]");
          if (!row || !this.contains(row) || event.target.closest(".sf-list__actions, .sf-list__rename")) return false;

          const item = this._items.find(one => one.id === this.idOf(row));

          if (item && this.selecting) return item.disabled !== true;
          return Boolean(item) && this.hasMenu(item);
        },
        press: event => {
          const row = event.target.closest?.(".sf-list-item[data-sf-list-roving]");
          const id = this.idOf(row);
          if (id == null) return;
          if (this.selecting) this.toggleChosen(id);else this.openMenu(id);
        }
      }); // Whether a press held Shift, for the row's open and the check
      // box's change that follow it (a range, C150 (9)).

      this.addEventListener("click", event => {
        this._shiftPress = event.shiftKey === true;
      }, true);
      this.addEventListener("click", event => {
        if (!this._longPress.swallowed()) return;
        event.preventDefault();
        event.stopPropagation();
      }, true); // A right click on a row opens its menu at the pointer, the same
      // list as its «⋯» (owner decision C164 (1), defect TL-2).

      this.addEventListener("contextmenu", event => this.onRowContextMenu(event));
    }
  } // The right button on a row with a menu: the row's menu where the pointer
  // is. Shift with it leaves the browser's own menu; a finger's long press
  // is the long-press watch's (it has opened the menu already); the menu key
  // and Shift+F10 are onKey's (their keydown opened it at the row's «⋯»).


  onRowContextMenu(event) {
    if (event.shiftKey || event.defaultPrevented) return;
    const row = event.target.closest?.(".sf-list-item[data-sf-list-roving]");
    if (!row || !this.contains(row) || event.target.closest(".sf-list__rename")) return;
    const id = this.idOf(row);

    const item = this._items.find(one => one.id === id);

    if (!item || !this.hasMenu(item)) return;
    event.preventDefault();
    if (event.button !== 2 || event.pointerType === "touch") return;
    this.moveTo(row);
    this.openMenu(id, {
      x: event.clientX,
      y: event.clientY
    });
  }

  onDisconnected() {
    this._filesDrop?.stop();
    this._filesDrop = null;
    this.unwatchEnd();

    this._rowsWindow.stop();

    this.removeEventListener("keydown", this.onWindowKey, true);
    this._widthObserver?.disconnect();
    this._widthObserver = null;
    cancelAnimationFrame(this._fitFrame);
    this._fitFrame = 0;
    this._widthFrame = null;
    this._widthMetas = null;
    clearTimeout(this._dayTimer);
    this._dayTimer = 0;
    super.onDisconnected?.();
  } // «Сегодня» said yesterday is wrong by morning: at the reader's midnight
  // the day groups are drawn again.


  watchDay() {
    clearTimeout(this._dayTimer);
    this._dayTimer = 0;
    if (!this.isConnected) return;
    this._dayTimer = setTimeout(() => {
      this.watchDay();
      if (this.groupBy === "day") this.requestComponentUpdate("day");
    }, (0,_core_js_format_js__WEBPACK_IMPORTED_MODULE_2__.msUntilNextDay)() + 1000);
  } // A narrow list (owner decision C47, 2026-11-10): below 20rem of its own
  // width a row's badge and count go under its second line, at the text's
  // start, so the title keeps the row's width and the badge stays whole. A
  // wider list is narrow too when, laid out on one line, a row's title would
  // keep less than half of the row's text column or less than 10rem (a long
  // badge in a phone column). No page breakpoint and no setting.
  // 1.14.0: the 20rem is a container query on the frame (the sheet's
  // container sf-list), so a printed first paint is narrow before any
  // script (DEV, ui-chat chat-threads at 390: CLS 0.09 when the code
  // adopted). The code marks the frame (data-sf-list-narrow) only for what
  // the sheet cannot know: a squeezed title; and, for a frame in a
  // shrink-to-fit place (a popover, an auto-width flex item), whose
  // inline-size container would take no width from its rows and fold to
  // nothing, it takes the frame out of the query (data-sf-list-fit) and
  // marks it below 20rem by measuring, as before. It watches the frame's
  // width and every row's badge and count, and is started as soon as the
  // rows are drawn, before the list's sheet is in: the observer reports
  // before the frame is painted, so the frame painted with the sheet is
  // already laid out narrow or wide. The marks are attributes the template
  // does not bind, so a redraw keeps them.
  // 1.5.1: the frame's width is read from .sf-list__width, a box of no
  // height across the frame, not from the frame. The narrow layout changes
  // the frame's height; a frame observed itself then changed size inside the
  // observer's own callback, at the shallowest depth it reports, and the
  // browser raised «ResizeObserver loop completed with undelivered
  // notifications» on every page with a narrow list. The width box keeps its
  // size whatever the layout; the badges and counts sit deeper and are
  // reported in the same frame.


  watchWidth() {
    const frame = this.querySelector(":scope > .sf-list__frame");
    if (!frame) return;
    const width = frame.querySelector(":scope > .sf-list__width") ?? frame;

    if (this._widthFrame !== frame) {
      this._widthObserver?.disconnect();
      this._widthObserver = null;
      this._widthFrame = frame;
      this._widthMetas = new Set();
      if (typeof ResizeObserver !== "function") return;
      this._widthObserver = new ResizeObserver(() => {
        this.watchMetas();
        this.measureNarrow();
      });

      this._widthObserver.observe(width);
    }

    this.watchMetas();
  } // The badges and counts drawn now are watched, the ones gone are let go:
  // a row drawn later, or a badge whose sheet came late, measures again.


  watchMetas() {
    const observer = this._widthObserver;
    const frame = this._widthFrame;
    if (!observer || !frame) return;
    const now = new Set(frame.querySelectorAll(".sf-list__row .sf-list__meta"));

    for (const meta of this._widthMetas) {
      if (!now.has(meta)) observer.unobserve(meta);
    }

    for (const meta of now) {
      if (!this._widthMetas.has(meta)) observer.observe(meta);
    }

    this._widthMetas = now;
  } // Narrow below 20rem of the frame's content width, or when a row's title
  // would keep less than half of its text column (or 10rem) beside its
  // badge and count. The one-line layout is measured with the mark taken
  // off and put back in the same task, so nothing of it is painted and the
  // answer does not depend on the layout it chooses. Below 20rem the
  // sheet's container query lays the rows out narrow; the mark is written
  // only where the query does not answer (no sheet yet, or a fitted frame).


  measureNarrow() {
    const frame = this._widthFrame;
    if (!frame?.isConnected) return;
    this.checkFit(frame);
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    const style = getComputedStyle(frame);
    const width = contentWidth(frame, style);

    if (!(width > 0)) {
      frame.removeAttribute(NARROW);
      return;
    }

    const queried = style.containerType === "inline-size";
    let narrow = width < NARROW_REM * rem;

    if (narrow && queried) {
      frame.removeAttribute(NARROW);
      return;
    }

    if (!narrow) {
      const was = frame.hasAttribute(NARROW);
      if (was) frame.removeAttribute(NARROW); // A two-line row keeps its badge and count in its end column
      // (owner decision C148 (2)): only one-line rows are measured.

      narrow = [...frame.querySelectorAll(".sf-list__row .sf-list-item:not(.sf-list-item--two-line) > .sf-list-item-wrap > .sf-list__meta:not(:empty)")].some(meta => this.titleSqueezed(meta, rem));
      if (was && !narrow) return;
    }

    frame.toggleAttribute(NARROW, narrow);
  } // A frame whose inline-size container folds it: in a shrink-to-fit place
  // the contained frame is narrower than its rows would make it (no content
  // width at all), and it is taken out of the query. Measured with the mark
  // flipped and put back in the same task, so the observer's callback ends
  // on the layout it began with (a size changed inside it would be a
  // ResizeObserver loop); the change itself is made in the next frame.


  checkFit(frame) {
    const had = frame.hasAttribute(FIT);
    const style = getComputedStyle(frame);
    if (!had && (style.containerType !== "inline-size" || contentWidth(frame, style) >= 1)) return;
    const now = frame.getBoundingClientRect().width;
    frame.toggleAttribute(FIT, !had);
    const other = frame.getBoundingClientRect().width;
    frame.toggleAttribute(FIT, had);
    const fit = (had ? now : other) > (had ? other : now) + 0.5;
    if (fit === had) return;
    cancelAnimationFrame(this._fitFrame);
    this._fitFrame = requestAnimationFrame(() => {
      this._fitFrame = 0;
      if (!frame.isConnected || frame !== this._widthFrame) return;
      frame.toggleAttribute(FIT, fit);
      this.measureNarrow();
    });
  } // On one line: the title's room is what the badge and count leave of the
  // text column, the row's gap before them kept (their own start padding is
  // in their box).


  titleSqueezed(meta, rem) {
    const wrap = meta.parentElement;
    const text = wrap?.querySelector(":scope > .sf-list-item-container");
    if (!text) return false;
    const wrapStyle = getComputedStyle(wrap);
    const textStyle = getComputedStyle(text);
    const rtl = wrapStyle.direction === "rtl";
    const box = wrap.getBoundingClientRect();
    const textBox = text.getBoundingClientRect();
    const metaBox = meta.getBoundingClientRect(); // An end part with only the screen-reader word takes no place (1.15.0).

    if (!(metaBox.width > 0)) return false;
    const gap = parseFloat(wrapStyle.columnGap) || 0;
    const inset = (parseFloat(textStyle.paddingLeft) || 0) + (parseFloat(textStyle.paddingRight) || 0);
    const end = rtl ? box.left + (parseFloat(wrapStyle.borderLeftWidth) || 0) + (parseFloat(wrapStyle.paddingLeft) || 0) : box.right - (parseFloat(wrapStyle.borderRightWidth) || 0) - (parseFloat(wrapStyle.paddingRight) || 0);
    const column = (rtl ? textBox.right - end : end - textBox.left) - inset;
    const title = (rtl ? textBox.right - metaBox.right : metaBox.left - textBox.left) - gap - inset;
    if (!(column > 0)) return false;
    return title < Math.max(column / 2, TITLE_MIN_REM * rem);
  } // The end of the list asks for the next page when a person brings it
  // within reach (core/js/reading-position.js watchEdge), not when it is
  // there already: a list whose end shows on load waits for «Show more» or
  // for the first scroll (list and feed study LF-8: the next page was asked
  // for on load, with «Show more» on screen as well -- two answers to one
  // question). The first scroll of the box that scrolls the list, after a
  // page is drawn, arms the watch; if the end is in reach then, that scroll
  // brought it there. The scroll is listened to once, to arm, never to
  // measure the edge on every move.


  watchEnd() {
    const sentinel = this.querySelector(":scope > .sf-list__frame .sf-list__end");

    if (!this.hasMore || this.loading || !sentinel) {
      this.unwatchEnd();
      return;
    }

    if (this._edge === sentinel && this._stopEdge) return;
    this.unwatchEnd();
    this._edge = sentinel; // Inside the box that scrolls the list, so the margin reaches ahead there.
    // watchEdge reports the end coming into reach; its first report, before
    // any scroll, says only that it is there already (reached). The first
    // scroll then asks if the end is still in reach -- no new report comes
    // for an end that never left; an end that comes into reach later is
    // the watch's own report, asked once.

    const root = (0,_core_js_reading_position_js__WEBPACK_IMPORTED_MODULE_3__.scrollerOf)(sentinel);
    const scroller = root ?? this.ownerDocument;
    let moved = false;
    let reached = false;

    const onScroll = () => {
      moved = true;
      scroller.removeEventListener("scroll", onScroll);
      if (reached && endInReach(sentinel, root)) this.requestMore();
    };

    scroller.addEventListener("scroll", onScroll, {
      passive: true
    });
    const stopEdge = (0,_core_js_reading_position_js__WEBPACK_IMPORTED_MODULE_3__.watchEdge)(sentinel, () => {
      if (moved) this.requestMore();else reached = true;
    }, {
      root
    });

    this._stopEdge = () => {
      stopEdge();
      scroller.removeEventListener("scroll", onScroll);
    };
  }

  unwatchEnd() {
    this._stopEdge?.();
    this._stopEdge = null;
    this._edge = null;
  } // ── rows ─────────────────────────────────────────────────────────────────


  rows() {
    return [...this.querySelectorAll(":scope > .sf-list__frame .sf-list-item[data-sf-list-roving]")];
  }

  idOf(row) {
    return row?.closest?.(".sf-list__row")?.dataset.id ?? null;
  }

  rowFor(id) {
    if (id == null) return null;
    return this.rows().find(row => this.idOf(row) === String(id)) ?? null;
  } // The row's own roving keeps one Tab stop (sf-list-item); a row the list
  // moves the focus to is marked the current one there.


  moveTo(row) {
    for (const other of this.rows()) delete other.dataset.sfListCurrent;

    row.dataset.sfListCurrent = "true";

    for (const other of this.rows()) other.tabIndex = other === row ? 0 : -1;

    row.focus();
  } // ── what a person does ───────────────────────────────────────────────────
  // A press or Enter on a row: sf-list-item asks open {id, trigger}; the
  // list says it as its own (selected is controlled, §4.3: the host opens
  // the item and writes selected back).


  onRowOpen(event) {
    event.stopPropagation();
    const id = String(event.detail?.id ?? "");
    if (!id || !this._items.some(item => item.id === id)) return; // Once a row is chosen a press chooses (C150 (9)); Shift chooses a
    // range from the last row pressed. Enter still opens the row.

    const trigger = event.detail?.trigger ?? "pointer";
    const shift = this.takeShift();

    if (this.selecting && trigger !== "keyboard" && (this._chosen.size || shift)) {
      this.toggleChosen(id, shift);
      return;
    }

    this.sfEmit("open", {
      id,
      trigger
    });
  }

  onKey(event) {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return; // The «⋯» of a row is reached from the row (owner decision C148 (3),
    // as the APG layout grid): ArrowRight (ArrowLeft right to left) from
    // the row to it, the other arrow, Escape, ArrowUp or ArrowDown back.
    // It is no Tab stop of its own.

    const rtl = getComputedStyle(this.querySelector(":scope > .sf-list__frame") ?? this).direction === "rtl";
    const forward = rtl ? "ArrowLeft" : "ArrowRight";
    const actions = event.target.closest?.(".sf-list__actions");

    if (actions) {
      if (event.shiftKey || ![rtl ? "ArrowRight" : "ArrowLeft", "Escape", "ArrowUp", "ArrowDown"].includes(event.key)) return;
      const back = actions.closest(".sf-list__row")?.querySelector(".sf-list-item[data-sf-list-roving]");
      if (!back) return;
      event.preventDefault(); // The Escape is the row's: a panel around the list stays open.

      event.stopPropagation();
      back.focus();
      return;
    }

    const row = event.target.closest?.(".sf-list-item[data-sf-list-roving]"); // Escape lets the choice go (C295); the key goes no further, so a
    // panel around the list stays open.

    if (event.key === "Escape" && this.selecting && this._chosen.size && !event.shiftKey) {
      event.preventDefault();
      event.stopPropagation();
      this.clearSelection();
      return;
    }

    if (!row || event.target !== row) return; // Space chooses the row, Shift+Space a range (selection many).

    if (event.key === " " && this.selecting) {
      event.preventDefault();
      this.toggleChosen(this.idOf(row), event.shiftKey);
      return;
    }

    if (event.key === forward && !event.shiftKey) {
      const button = row.closest(".sf-list__row")?.querySelector(":scope > .sf-list__actions");

      if (button) {
        event.preventDefault();
        button.focus();
      }

      return;
    }

    const id = this.idOf(row);

    const item = this._items.find(one => one.id === id);

    if (!item) return;

    if (event.key === "F2" && !event.shiftKey && !event.altKey && !event.ctrlKey && !event.metaKey) {
      if (this.rename(id).outcome === "applied") event.preventDefault();
      return;
    }

    if (event.key === "F10" && event.shiftKey || event.key === "ContextMenu") {
      event.preventDefault();
      this.openMenu(id);
    }
  }

  onMenu(detail = {}, forId = null) {
    const id = forId ?? this._menuFor;
    const choice = String(detail.id ?? detail.entry?.id ?? "");
    if (!id || !choice) return;
    if (choice === "rename") setTimeout(() => this.rename(id), 0); // A row's action is apply {action, scope: entry, ids} (vocabulary §5, §18.3).
    else if (choice.startsWith("action:")) this.sfEmit("apply", {
      action: choice.slice("action:".length),
      scope: "entry",
      ids: [id]
    });
  }

  closeMenu() {
    const menu = this.menu;
    if (this._menuOpening && menu?.isOpen) menu.close({
      restoreFocus: false,
      reason: "api"
    });
  }

  finishRename(keep, input) {
    const id = this._editing;
    if (!id) return;
    this._editing = null;

    const item = this._items.find(one => one.id === id);

    const text = String(input?.value ?? "").trim().slice(0, TEXT_LIMIT);
    this._focusAfter = id;

    if (keep && item && text && text !== item.text) {
      // Shown at once; a host that refuses it cancels the event (the old
      // text comes back) or upserts the item with the text it kept.
      const before = item.text;
      item.text = text;
      if (!this.sfEmit("rename", {
        id,
        text
      })) item.text = before;
    }

    this.requestComponentUpdate("rename");
  }

}

SfList.define("sf-list");
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "1c69b52a2c3c"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderListTemplate: () => (/* binding */ renderListTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("efa66f8927d1");
/* harmony import */ var _default_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("001507727cfa");
/* harmony import */ var _avatar_js_picture__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("c69a3dc158df");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__, _avatar_js_picture__WEBPACK_IMPORTED_MODULE_3__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__, _avatar_js_picture__WEBPACK_IMPORTED_MODULE_3__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__);



 // The list, drawn in the component's light DOM on the Framework's plain list
// surface (the class unit .sf-list): the rows in their groups, the end of the
// list («Show more» and the sentinel the next page is asked by), the empty
// state. The row actions open in the page's one menu (core SF.menu.open,
// owner decision C184 (4)), not in a menu of the list's own.
//
// A row is the Framework's row, sf-list-item, interactive: the rows of the
// whole list -- every group -- are one Tab stop, the arrows move between them
// (the row's own roving: [data-sf-list] marks the list). When the row has
// actions, a «⋯» stands beside it; it is not a Tab stop of its own (tabindex
// -1): a list of forty rows would be eighty stops. It is reached from its row
// with Shift+F10 or the menu key, and by pointer.
//
// Grouped, the frame is a group named by the list's label and each group's
// rows a list named by its heading; ungrouped, the one list takes the label.
// A group's heading is block list's shared heading (.sf-group-heading, C40):
// the words at the list's text size, medium; for today and yesterday the date
// beside them in sf-time; sticky with sticky-headings.
//
// The rows are keyed by id, so a row that moves keeps its node and a redraw
// does not take the focus from the row a person is on.
//
// A row's own parts (1.1.0) stand in sf-list-item's leading and trailing
// places: the avatar (sf-avatar, or a sign -- a glyph in sf-avatar's class
// markup, as sf-chat-window draws its members' signs), the badge and the
// count (sf-badge). The row takes its slot elements once, when it connects,
// and draws those very nodes in its own markup. So the slot elements are
// fixed in the row's template and only what is inside them changes: a count
// that comes and goes keeps the row, and the focus on it. A list that gains
// its first avatar draws its rows from the other template, anew.
// The steps of a row's parts beside a row of each size: a one-line row's
// avatar takes the row's line, as its icon does, and a two-line row's avatar
// the control height of the row's step (sf-avatar size) -- a one-line row
// in that list keeps the line, centred in the wider place; the count and the
// badge take the row's line (sf-badge line), so they never make a row taller.

const BADGE_STATUS = {
  neutral: lit__WEBPACK_IMPORTED_MODULE_0__.nothing,
  info: "info",
  success: "success",
  warning: "warning",
  error: "error"
}; // hue auto picks the initials' hue from the row's title, so a conversation
// keeps its colour whatever its initials.
//
// The avatar is a picture of the row, not a control of its own (list item
// study LI-10): sf-avatar's one drawing (avatar js/picture.js) in a span
// hidden from assistive technology, the row's title naming the person. It was
// an sf-avatar element, which draws a button: hidden from a screen reader but
// still a Tab stop, so a list of conversations was one stop per avatar plus
// the list's own. An avatar with its own action is the page's to place.

const leadContent = (context, item) => {
  const avatar = context.avatarOf(item);
  const size = context.size;
  const wide = Boolean(context.leading?.wide) && Boolean(item.supporting);

  if (avatar?.kind === "avatar") {
    return (0,_avatar_js_picture__WEBPACK_IMPORTED_MODULE_3__.avatarPicture)({
      size: wide ? size : "1",
      line: wide ? "" : size,
      shape: avatar.shape,
      imageUrl: avatar.imageUrl,
      text: avatar.text,
      name: String(item.text ?? ""),
      hue: "auto",
      lazy: true,
      disabled: item.disabled === true
    });
  }

  if (avatar?.kind === "sign") {
    // sf-avatar's placeholder with the sign's glyph (avatar js/picture.js,
    // the one avatar drawing; avatar study AV-8).
    return (0,_avatar_js_picture__WEBPACK_IMPORTED_MODULE_3__.avatarPicture)({
      size: wide ? size : "1",
      line: wide ? "" : size,
      shape: avatar.shape,
      icon: avatar.icon,
      extraClass: "sf-list__sign"
    });
  }

  const icon = typeof item.icon === "string" && item.icon.trim() ? item.icon.trim() : "";
  return icon ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-icon class="sf-list__glyph" icon=${icon} aria-hidden="true"></sf-icon>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
}; // The row's time (1.15.0, time-format; C189 (8)) leads the end part: in a
// two-line row it stands on the title's line, above the badge and the count
// (sf-list-item's end column, C148 (2)), and reads first. It is sf-time (C40)
// without a tooltip: the row is the list's one Tab stop (C148 (3)), and a
// time with a tooltip outside a button would be a stop of its own. A row
// unread without a count says so to a screen reader at its end (the count's
// own words say it where there is one); the word is the only thing it adds,
// so the end part of a row with nothing else stays out of the layout (CSS).


const metaContent = (context, item, group) => {
  const count = context.countOf(item);
  const badge = context.badgeOf(item);
  const format = context.timeFormat(group);
  const moment = format ? context.momentOf(item) : "";
  const unreadWord = !count && context.unreadOf(item); // A two-line row's badge and count stand on its caption's line, in the
  // row's end column (owner decision C148 (2)): the line of the text they
  // stand in. A one-line row's take the row's line.

  const line = item.supporting ? "text" : context.size; // A row is a dense place: its badge and count keep the tight side room
  // (sf-badge tight), so the wider default of sf-badge 1.3.0 does not push
  // the row's text aside. The count is a quantity: sf-badge tonal, grey
  // (owner decision C140 (3); list item study LI-8). It was sf-badge scheme
  // primary, the filled blue count; the filled look is the attention
  // count's alone (red), which a list row does not draw.

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${moment ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-time class="sf-list__time" datetime=${moment} format=${format} tooltip="none"></sf-time>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}${badge ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-badge class="sf-list__badge" line=${line} appearance="tonal" tight
                         status=${BADGE_STATUS[badge.tone]} text=${badge.text}></sf-badge>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}${count ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-badge class="sf-list__count" line=${line} appearance="tonal" tight
                         text=${count > context.countCap ? `${context.countCap}+` : String(count)}
                         aria-label=${context.countLabel(count)}></sf-badge>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}${unreadWord ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-list__unread sr-only">${context.unreadText}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}`;
}; // Choosing several rows (1.22.0, owner decision C167 (5) by the rule of
// C150 (9), Larena LF-10): with selection="many" each row has a check box at
// its start, shown under the pointer and on the focused row, and on every row
// once anything is chosen. It is the class checkbox, not a Tab stop of its own
// (the rows stay one stop; Space on a row chooses it). Its change is the
// list's, never the page's change.


const pick = (context, item, text) => {
  if (!context.selecting) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const {
    component
  } = context;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<label class="sf-list__pick sf-checkbox sf-checkbox--size-${context.size === "1/2" ? "1/2" : "1"} flex"
            @click=${event => event.stopPropagation()}>
        <span class="sf-checkbox-box flex">
            <input type="checkbox" tabindex="-1" .checked=${context.chosen.has(item.id)}
                   ?disabled=${item.disabled === true}
                   aria-label=${context.pickLabel(text)}
                   @change=${event => {
    event.stopPropagation();
    component.toggleChosen(item.id, component.takeShift());
  }}>
            <span class="sf-icon" aria-hidden="true"></span>
        </span>
    </label>`;
};

const row = (context, item, group, place = null) => {
  const {
    component
  } = context;
  const text = String(item.text ?? "") || context.untitledText;
  const supporting = item.supporting ? String(item.supporting) : "";
  const current = item.id === context.selected;
  const disabled = item.disabled === true;
  const icon = typeof item.icon === "string" && item.icon.trim() ? item.icon.trim() : "";

  if (context.editing === item.id) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
            <li class="sf-list__row sf-list__row--editing" data-id=${item.id}>
                <input
                        class="sf-list__rename"
                        .value=${text === context.untitledText ? "" : text}
                        maxlength=${context.textLimit}
                        aria-label=${context.renameLabel}
                        @keydown=${event => {
      if (event.key === "Enter") {
        event.preventDefault();
        component.finishRename(true, event.currentTarget);
      }

      if (event.key === "Escape") {
        // The Escape is the field's: a panel around the
        // list must not close on it as well.
        event.preventDefault();
        event.stopPropagation();
        component.finishRename(false, event.currentTarget);
      }
    }}
                        @blur=${event => component.finishRename(true, event.currentTarget)}
                />
            </li>
        `;
  }

  const menu = context.hasMenu(item); // no-wrap (1.2.0): the row's text may be cut, so the whole of it is the
  // row's tooltip. It stands on the row's host, an ancestor of everything
  // the pointer can rest on but the «⋯», which has its own; the text itself
  // stays in the row for a screen reader, so the tooltip is not its name.

  const tip = context.noWrap ? supporting ? `${text} · ${supporting}` : text : ""; // Two templates, with the leading place and without; the slot elements
  // are the template's own, never a value of it (see above).

  const listItem = context.leading ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-list-item
                    interactive
                    kind="icon"
                    size=${context.size}
                    value=${item.id}
                    text=${text}
                    supporting=${supporting || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    title=${tip || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    ?selected=${current}
                    ?disabled=${disabled}
                    ?divided=${context.divided}
            ><span slot="leading" class="sf-list__lead">${leadContent(context, item)}</span><span
                    slot="trailing" class="sf-list__meta">${metaContent(context, item, group)}</span></sf-list-item>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-list-item
                    interactive
                    kind=${icon ? "icon" : "text"}
                    icon=${icon || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    size=${context.size}
                    value=${item.id}
                    text=${text}
                    supporting=${supporting || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    title=${tip || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    ?selected=${current}
                    ?disabled=${disabled}
                    ?divided=${context.divided}
            ><span slot="trailing" class="sf-list__meta">${metaContent(context, item, group)}</span></sf-list-item>`;
  const chosen = context.selecting && context.chosen.has(item.id);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <li class="sf-list__row ${current ? "sf-list__row--current" : ""} ${context.unreadOf(item) ? "sf-list__row--unread" : ""} ${chosen ? "sf-list__row--chosen" : ""}" data-id=${item.id}
            aria-posinset=${place ? place.at : lit__WEBPACK_IMPORTED_MODULE_0__.nothing} aria-setsize=${place ? place.of : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
            ${pick(context, item, text)}
            ${listItem}
            ${menu ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<button
                        type="button"
                        class="sf-list__actions sf-icon-button sf-icon-button--icon sf-icon-button--ghost sf-icon-button--on-surface sf-icon-button--size-${context.size} flex items-cross-center content-main-center flex-none"
                        tabindex="-1"
                        aria-haspopup="menu"
                        aria-label=${context.actionsLabel(text)}
                        title=${context.actionsLabel(text)}
                        @click=${event => component.openMenu(item.id, event.currentTarget)}
                ><sf-icon icon="more_horiz" aria-hidden="true"></sf-icon></button>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        </li>
    `;
}; // A long list draws the rows in view (FO-2, core/js/rows-window.js): the
// range, and two spacers standing for the rows above and below it, so the
// scroll bar and the scroll position are the whole list's. A drawn row says
// its place in its list (aria-posinset, aria-setsize); the spacers are not
// read. An ungrouped list's spacers stand in its rows; a grouped list
// (FO2-1) draws the groups the range reaches, each with its heading and the
// rows of it in the range, between two spacers in the list's body.


const spacer = (height, edge, tag = "li") => tag === "li" ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<li class="sf-list__spacer" data-sf-rows-spacer=${edge} aria-hidden="true"
        style=${`block-size: ${Math.max(0, Math.round(height))}px`}></li>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-list__spacer" data-sf-rows-spacer=${edge} aria-hidden="true"
        style=${`block-size: ${Math.max(0, Math.round(height))}px`}></div>`;

const rows = (context, group, labelled) => {
  const win = context.window?.flat && group.key === "all" ? context.window : null;
  const part = context.window && !context.window.flat ? context.window.parts.get(group.key) : null;
  const from = win ? win.first : part ? part[0] : 0;
  const items = win ? group.items.slice(win.first, win.last + 1) : part ? part[1] < 0 ? [] : group.items.slice(part[0], part[1] + 1) : group.items;
  const placed = Boolean(win || part);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <ul class="sf-list__rows" aria-labelledby=${labelled ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing} aria-label=${labelled ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : context.label}
        data-sf-rows-window=${win ? `${win.first}-${win.last}` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
        ${win ? spacer(win.before, "before") : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        ${(0,lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__.repeat)(items, item => item.id, (item, index) => row(context, item, group, placed ? {
    at: from + index + 1,
    of: group.items.length
  } : null))}
        ${win ? spacer(win.after, "after") : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    </ul>
`;
}; // The rows on their way (owner decision C130; list and feed study LF-2): the
// list's own rows, sf-list-item of the list's size, so a skeleton row is as
// tall as the row that replaces it -- one line, or the caption row (C49: 48,
// compact 44, 60 under a finger) -- and nothing moves when the rows arrive.
// The words are core's first-paint bars (C136: as tall as the capitals, in the
// middle of the line, the control radius at the ends, the skeleton fill and
// its pulse, C130 (3), (4)); the title a shorter bar than its caption line.
// Until a page has shown rows the list draws the caption row, the shape of
// the lists it serves (conversations, letters, files, versions); a list that
// has shown rows keeps their shape. aria-hidden: the status beside it says
// the wait.
//
// 1.16.0 (C130, C148 (1)): the skeleton row keeps the leading place of the
// rows it stands for, so its title bar starts where the title will. The
// place is the one the rows draw (leadingPlace() and the row's own icon): an icon
// is the row's line square with the control radius (C130 (1)); an avatar is
// sf-avatar's own box of the step the rows give it -- the control height in a
// list with a second line, else the row's line -- and its shape; a list with
// neither keeps no place. The shape is read from the rows the list has shown
// (context.skeleton.lead), never guessed: with none shown yet there is no
// place (a printed first paint, data-sf-first-paint="skeleton", carries the
// rows' own picture) -- unless the list's setting leading says it (1.17.0:
// icon, avatar or none, from the first frame).


const SKELETON_ROWS = 3;

const skeletonLead = context => {
  const lead = context.skeleton.lead;
  if (!lead) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;

  if (lead.kind === "avatar") {
    const wide = lead.wide && context.skeleton.twoLine;
    const box = wide ? `sf-avatar--size-${context.size}` : `sf-avatar--size-1 sf-avatar--line-${context.size}`;
    const shape = lead.shape === "square" ? " sf-avatar--square" : "";
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span slot="leading" class="sf-list__lead"><span
                class=${`sf-avatar sf-avatar--picture ${box}${shape} sf-first-paint-fill sf-list__lead-skeleton`}></span></span>`;
  }

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span slot="leading" class="sf-list__lead"><span
            class="sf-first-paint-fill sf-list__lead-skeleton sf-list__lead-skeleton--icon"></span></span>`;
};

const skeleton = context => {
  const {
    twoLine,
    lead
  } = context.skeleton;

  const bar = part => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class=${`sf-first-paint-bar sf-list__bar sf-list__bar--${part}`}>\u00a0</span>`;

  const wide = lead?.kind === "avatar" && lead.wide && twoLine;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <ul class="sf-list__rows sf-list__skeleton${wide ? " sf-list__skeleton--lead-wide" : ""}" aria-hidden="true">
            ${Array.from({
    length: SKELETON_ROWS
  }, () => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                <li class="sf-list__row sf-list__row--skeleton">
                    <sf-list-item
                            kind=${lead ? "icon" : "text"}
                            size=${context.size}
                            text="\u00a0"
                            supporting=${twoLine ? "\u00a0" : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    >${skeletonLead(context)}<span slot="text">${bar("title")}</span>${twoLine ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span slot="supporting">${bar("supporting")}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}</sf-list-item>
                </li>`)}
        </ul>`;
};

function renderListTemplate(context) {
  const {
    component
  } = context;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-list sf-list__frame sf-list--size-${context.size}${context.leading?.wide ? " sf-list--lead-wide" : ""}${context.noWrap ? " sf-list--no-wrap" : ""} ${context.empty ? "sf-list--empty" : ""}${context.selecting ? " sf-list--selecting" : ""}${context.chosen.size ? " sf-list--choosing" : ""}"
             role=${context.grouped ? "group" : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
             aria-label=${context.grouped ? context.label : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
             aria-busy=${context.loading ? "true" : "false"}>
            <span class="sf-list__width" aria-hidden="true"></span>
            ${context.loading ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${skeleton(context)}<p class="sr-only" role="status">${context.loadingText}</p>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            <div class="sf-list__body"
                 data-sf-list
                 data-sf-rows-window=${context.window && !context.window.flat ? `${context.window.first}-${context.window.last}` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                 ?data-sf-rows-all=${context.rowsAll === true}
                 ?hidden=${context.empty || context.loading}
                 @keydown=${event => component.onKey(event)}
                 @sf-list-item-open=${event => component.onRowOpen(event)}>
                ${context.window && !context.window.flat && context.window.before > 0 ? spacer(context.window.before, "before", "div") : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ${(0,lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__.repeat)(context.window && !context.window.flat ? context.sections.filter(group => context.window.parts.has(group.key)) : context.sections, group => group.key, group => context.grouped ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                        <section class="sf-list__group" data-group=${group.key}>
                            <div class=${`sf-group-heading sf-list__heading${context.size === "1" ? "" : ` sf-group-heading--size-${context.size}`}${context.stickyHeadings ? " sf-group-heading--sticky" : ""}`}
                                 role="heading" aria-level=${context.headingLevel}
                                 id=${`${context.uid}-${group.key.replace(/[^\w-]/gu, "_")}`}>${group.heading}${group.date ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)` <sf-time class="sf-group-heading-date" format="date" tooltip="none" datetime=${group.date}></sf-time>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}</div>
                            ${rows(context, group, `${context.uid}-${group.key.replace(/[^\w-]/gu, "_")}`)}
                        </section>` : rows(context, group, null))}
                ${context.window && !context.window.flat && context.window.after > 0 ? spacer(context.window.after, "after", "div") : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            </div>
            ${context.emptyContent // The page's own empty state stays in the document while the
  // list has rows, hidden: a page that looks it up by id to give
  // it its actions finds it whatever the list shows (ui-doc
  // «Рецепты», 2026-11-10). The list's own is drawn only when empty.
  ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-list__empty" ?hidden=${!context.empty}>${context.emptyContent}</div>` : context.empty ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-list__empty"><sf-empty-state kind="no-data" size="1/2" heading=${context.emptyHeading}></sf-empty-state></div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            <div class="sf-list__next" ?hidden=${!context.showMore}>
                <sf-button
                        appearance="ghost"
                        scheme="on-surface"
                        size="1/2"
                        icon="expand_more"
                        text=${context.moreText}
                        ?disabled=${context.loadingMore}
                        aria-busy=${context.loadingMore ? "true" : "false"}
                        data-action="more"
                        @click=${() => component.requestMore()}
                ></sf-button>
                <span class="sr-only" role="status">${context.loadingMore ? context.loadingMoreText : ""}</span>
                <span class="sf-list__end" aria-hidden="true"></span>
            </div>
            ${context.selecting // The bar of the choice is sf-bulk-actions (C295): at the
  // list's bottom, at its width, sticking to the bottom of the
  // scroll; hidden while nothing is chosen. Its action is the
  // list's apply {action, scope: selection, ids}; its × and
  // Escape clear the choice.
  ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-bulk-actions
                        class="sf-list__bulk"
                        place="dock"
                        size=${context.size}
                        count=${String(context.chosen.size)}
                        page-count=${String(context.rowCount)}
                        .actions=${context.selectionActions}
                        @sf-bulk-actions-action=${event => component.onBulkAction(event)}
                        @sf-bulk-actions-clear=${event => component.onBulkClear(event)}
                ></sf-bulk-actions>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        </div>
    `;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "001507727cfa"
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

/***/ "9d9903b87148"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit/directives/keyed.js", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("lit/directives/keyed.js", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "efa66f8927d1"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit/directives/repeat.js", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("lit/directives/repeat.js", 1).then(resolve, reject), { once: true })));

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

/***/ "a6b3ed0c1589"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AVATAR_HUES: () => (/* binding */ AVATAR_HUES),
/* harmony export */   AVATAR_TONES: () => (/* binding */ AVATAR_TONES),
/* harmony export */   STATIC_HUES: () => (/* binding */ STATIC_HUES),
/* harmony export */   TONE_HUES: () => (/* binding */ TONE_HUES),
/* harmony export */   avatarHue: () => (/* binding */ avatarHue),
/* harmony export */   avatarTone: () => (/* binding */ avatarTone),
/* harmony export */   avatarToneHash: () => (/* binding */ avatarToneHash),
/* harmony export */   resolveAvatarHue: () => (/* binding */ resolveAvatarHue),
/* harmony export */   resolveAvatarTone: () => (/* binding */ resolveAvatarTone)
/* harmony export */ });
// sf-avatar's hue from a name, without a document: a plain function of its
// argument, so tests/avatar-tones.contract.test.mjs runs it in Node and a server
// can print the same class in the first paint. docs/docs.md gives the algorithm
// for a server in another language.
//
// Owner decision C17 (2026-11-08): avatars have no colours of their own. The
// initials take a hue of the static palette (the hue setting, the class
// sf-hue-<name>); the eight tones of initials are gone, and `auto` picks among
// eight static hues in the old order, so a name keeps its slot: rose is pink,
// the former violet (HCT hue 325) is purple, the other six keep their names.
// A former tone moves at most 15 degrees (dispatcher, 2026-11-09).
//
// FNV-1a, 32 bits, over the UTF-8 bytes of the string exactly as given (no
// trimming, no case folding, no normalisation), its high half folded onto the
// low one, because the low bits of FNV-1a alone follow the low bits of the
// input; the remainder by the length of the list picks the tone.
//
// The list and its order are part of the algorithm: a name keeps its tone only
// while they stay. A later named tone does not join `auto`.
const AVATAR_HUES = Object.freeze(['pink', 'amber', 'lime', 'green', 'teal', 'sky', 'indigo', 'purple']);

// Every hue a setting may name: the static palette (theme-palette.js
// STATIC_HUES, tests/avatar-tones.contract.test.mjs holds the two equal).
const STATIC_HUES = Object.freeze(['red', 'orange', 'amber', 'yellow', 'lime', 'green', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'pink', 'brown', 'gray']);

// The former tone setting and its names, until 2027-01-01 (journal
// attribute-c17-avatar-tone-to-hue, value-c17-avatar-rose-to-pink, which
// also carries violet to purple).
const AVATAR_TONES = Object.freeze(['rose', 'amber', 'lime', 'green', 'teal', 'sky', 'indigo', 'violet']);
const TONE_HUES = Object.freeze({rose: 'pink', violet: 'purple'});

const FNV_OFFSET = 0x811c9dc5;
const FNV_PRIME = 0x01000193;

function avatarToneHash(name) {
  let hash = FNV_OFFSET;
  for (const byte of new TextEncoder().encode(String(name))) {
    hash = Math.imul(hash ^ byte, FNV_PRIME) >>> 0;
  }
  return (hash ^ (hash >>> 16)) >>> 0;
}

// No name, no hue: the neutral look.
function avatarHue(name) {
  const text = name === undefined || name === null ? '' : String(name);
  return text ? AVATAR_HUES[avatarToneHash(text) % AVATAR_HUES.length] : '';
}

// The hue a setting asks for: a named one as it is, auto the one of the name,
// empty (or a name the palette does not have) the neutral look. The former
// tone setting is read when hue is empty, its rose as pink and its violet as purple.
function resolveAvatarHue(hue, name, tone = '') {
  const setting = hue || TONE_HUES[tone] || tone || '';
  if (setting === 'auto') return avatarHue(name);
  return STATIC_HUES.includes(setting) ? setting : '';
}

// The former names (2027-01-01): the tone of a name in the old words.
function avatarTone(name) {
  const text = name === undefined || name === null ? '' : String(name);
  return text ? AVATAR_TONES[avatarToneHash(text) % AVATAR_TONES.length] : '';
}

function resolveAvatarTone(setting, name) {
  return setting === 'auto' ? avatarTone(name) : setting || '';
}


/***/ },

/***/ "31dd7f648272"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   files: () => (/* binding */ files)
/* harmony export */ });
/* harmony import */ var _en_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("c1c5abcf20ed");
// Written by scripts/build-language-packs.mjs from src/core/lang/built-in.json
// (owner decision C282); do not edit. The words this bundle carries: the
// built-in languages' (en); every other language comes from
// a language file (core/lang/<code>.js or its parts).


const files = { en: { runtime: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime } };

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ en: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime });


/***/ },

/***/ "3694b5e2bf39"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"runtime":{"b":"B","kb":"KB","mb":"MB","gb":"GB"}}');

/***/ },

/***/ "2677706b5ec9"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.list","tag":"sf-list","version":"1.26.0","kind":"leaf","settings":{"items":{"type":"list","default":[],"of":{"id":"id","text":{"type":"string","optional":true},"supporting":{"type":"string","optional":true},"icon":{"type":"icon","optional":true},"avatar":{"type":"object","optional":true},"date":{"type":"date","optional":true},"group":{"type":"string","optional":true},"disabled":{"type":"boolean","optional":true},"actions":{"type":"list","optional":true},"count":{"type":"number","integer":true,"min":0,"optional":true},"unread":{"type":"boolean","optional":true},"badge":{"type":"object","optional":true},"pinned":{"type":"boolean","optional":true}},"entries":{"key":"id","changes":"content"}},"selected":{"type":"id","default":""},"group-by":{"type":"enum","values":["none","day","key"],"default":"none"},"groups":{"type":"list","default":[],"of":{"key":"string","text":"string"}},"actions":{"type":"list","default":[],"of":{"id":"id","text":"string","icon":{"type":"icon","optional":true},"destructive":{"type":"boolean","optional":true},"devices":{"type":"list","optional":true}}},"selection":{"type":"enum","values":["none","many"],"default":"none"},"selection-actions":{"type":"list","default":[],"of":{"id":"id","text":"string","icon":{"type":"icon","optional":true},"status":{"type":"enum","values":["","danger"],"optional":true}}},"renamable":{"type":"boolean","default":false},"has-more":{"type":"boolean","default":false},"loading":{"type":"boolean","default":false},"leading":{"type":"enum","values":["auto","none","icon","avatar"],"default":"auto"},"lines":{"type":"enum","values":["auto","1","2"],"default":"auto"},"size":{"type":"enum","values":["1/2","1","2"],"default":"1"},"no-wrap":{"type":"boolean","default":false},"divided":{"type":"boolean","default":false},"time-format":{"type":"enum","values":["none","auto","relative","exact"],"default":"none"},"label":{"type":"string","default-from":"runtime.label"},"heading-level":{"type":"number","integer":true,"min":2,"max":6,"default":3},"sticky-headings":{"type":"boolean","default":false},"rows-window":{"type":"enum","values":["auto","off"],"default":"auto"},"rows-window-from":{"type":"number","default":1000},"accept-files":{"type":"boolean","default":false},"empty-text":{"type":"string","default-from":"runtime.empty-text"}},"values":{"chosen":{"type":"list","default":[],"of":"id"}},"events":{"open":{"carries":{"id":"id","trigger":{"type":"enum","values":["pointer","keyboard"]}}},"apply":{"carries":{"action":"string","scope":{"type":"enum","values":["entry","selection"]},"ids":{"type":"list","schema":{"items":{"type":"string"}}}}},"rename":{"carries":{"id":"id","text":{"type":"string","schema":{"minLength":1,"maxLength":200}}},"cancelable":true},"load-more":{"carries":{"direction":{"type":"enum","values":["after"]},"after":{"type":"id","nullable":true}},"cancelable":true},"attach":{"carries":{"files":"list","skipped":"list"}},"select":{"carries":{"chosen":{"type":"list","of":"id"},"count":"number","total":"number"}}},"actions":{"set-items":{"with":{"items":{"type":"list","schema":{"items":{"type":"object","properties":{"id":{"type":["string","number"]},"text":{"type":"string"},"supporting":{"type":"string"},"icon":{"type":"string"},"date":{"type":"string"},"group":{"type":"string"},"disabled":{"type":"boolean"},"actions":{}},"required":["id"]}}},"options":{"type":"object","optional":true,"schema":{"properties":{"hasMore":{"type":"boolean","default":false}}}}}},"append-items":{"with":{"items":{"type":"list","schema":{"items":{"type":"object","properties":{"id":{"type":["string","number"]},"text":{"type":"string"},"supporting":{"type":"string"},"icon":{"type":"string"},"date":{"type":"string"},"group":{"type":"string"},"disabled":{"type":"boolean"},"actions":{}},"required":["id"]}}},"options":{"type":"object","optional":true,"schema":{"properties":{"hasMore":{"type":"boolean","default":false}}}}}},"upsert":{"with":{"item":{"type":"object","schema":{"type":"object","properties":{"id":{"type":["string","number"]},"text":{"type":"string"},"supporting":{"type":"string"},"icon":{"type":"string"},"date":{"type":"string"},"group":{"type":"string"},"disabled":{"type":"boolean"},"actions":{}},"required":["id"]}}}},"detach":{"with":{"id":"id"}},"rename":{"with":{"id":"id"}},"open-menu":{"with":{"id":"id"}},"request-more":{},"more-failed":{},"clear-selection":{},"toggle-chosen":{"with":{"id":"id","range":{"type":"boolean","optional":true}}}},"presentation":{"skeleton":{"late":["items"]}},"host-states":{},"css-variables":{"--sf-list-gap":{"type":"length","state":"default"},"--sf-list-radius":{"type":"length","state":"default"},"--sf-list-hover-background-color":{"type":"color","state":"hover"},"--sf-list-current-background-color":{"type":"color","state":"selected"},"--sf-list-heading-color":{"type":"color","state":"default"}}}');

/***/ },

/***/ "c1c5abcf20ed"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"List","runtime":{"actions-label":"Actions: {text}","count-label":{"one":"{n} unread","other":"{n} unread"},"empty-text":"Nothing here yet","files-drop-text":"Release to upload to “{target}”","label":"List","loading-more-text":"Loading…","loading-text":"Loading the list","more-text":"Show more","pick-label":"Choose {text}","pinned-text":"Pinned","rename-label":"New name","rename-text":"Rename","undated-text":"No date","ungrouped-text":"Other","unread-text":"unread","untitled-text":"Untitled"}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("6cfd28b331a1");
/******/
/******/ })()
;