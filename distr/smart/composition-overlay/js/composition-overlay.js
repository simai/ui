/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "cae046a8699f"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_composition_overlay_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("dd1616d485c7");
/* harmony import */ var _core_js_composition_manifest_host_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("6b629b4c1b7e");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("323a38a1c20d");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("4fe3d0c72eda");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("339c075524d7");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("d8e3a01243dc");
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("6c735f321fd9");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_composition_overlay_mjs__WEBPACK_IMPORTED_MODULE_0__, _core_js_composition_manifest_host_mjs__WEBPACK_IMPORTED_MODULE_1__]);
([_core_js_composition_overlay_mjs__WEBPACK_IMPORTED_MODULE_0__, _core_js_composition_manifest_host_mjs__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
// Smart entry for sf-composition-overlay, the editor canvas overlay. Library
// drags from sf-sortable land here through the shared drag session. A framed
// canvas (a same-origin iframe fed a flat node list) uses attachFrame and setNodes.
//
// From its component.json (standard simai.smart-component 1.3.8 §3, §4, §8):
// the overlay is defined over the class core/js/composition/manifest-host.mjs
// makes from it; it sends select, apply, insert, move and change by the
// vocabulary, the former -action and -edit following until 2026-12-01.







globalThis.SF = globalThis.SF || {};
globalThis.SF.CompositionOverlay = Object.freeze({
  OVERLAY_EVENTS: _core_js_composition_overlay_mjs__WEBPACK_IMPORTED_MODULE_0__.OVERLAY_EVENTS,
  OVERLAY_EVENTS_LEGACY: _core_js_composition_overlay_mjs__WEBPACK_IMPORTED_MODULE_0__.OVERLAY_EVENTS_LEGACY,
  checkOverlayActions: _core_js_composition_overlay_mjs__WEBPACK_IMPORTED_MODULE_0__.checkOverlayActions,
  checkOverlayNodes: _core_js_composition_overlay_mjs__WEBPACK_IMPORTED_MODULE_0__.checkOverlayNodes,
  overlayNodes: _core_js_composition_overlay_mjs__WEBPACK_IMPORTED_MODULE_0__.overlayNodes
});
(0,_core_js_composition_overlay_mjs__WEBPACK_IMPORTED_MODULE_0__.defineCompositionOverlay)(globalThis.customElements, {
  base: (0,_core_js_composition_manifest_host_mjs__WEBPACK_IMPORTED_MODULE_1__.manifestHost)(_component_json__WEBPACK_IMPORTED_MODULE_2__, {
    lang: {
      en: _lang_en_json__WEBPACK_IMPORTED_MODULE_4__,
      ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_5__
    },
    source: 'ru',
    aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_3__
  })
});
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "6c735f321fd9"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "892a0da25239"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("aliases", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("aliases", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "5b7d7695b41b"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("element-manifest", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("element-manifest", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "bf0cea966575"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("open-surface-mark", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("open-surface-mark", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "43090d1c8307"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("page-language", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("page-language", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "6f489cc65b77"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   canonical: () => (/* binding */ canonical),
/* harmony export */   isPlainObject: () => (/* binding */ isPlainObject),
/* harmony export */   stableStringify: () => (/* binding */ stableStringify)
/* harmony export */ });
function isPlainObject(value) {
  if (!value || Object.prototype.toString.call(value) !== '[object Object]') return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (isPlainObject(value)) {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonical(value[key])]));
  }
  return value;
}

function stableStringify(value) {
  return JSON.stringify(canonical(value));
}




/***/ },

/***/ "6b629b4c1b7e"
(__webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   manifestHost: () => (/* binding */ manifestHost)
/* harmony export */ });
/* harmony import */ var _element_manifest_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _aliases_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("892a0da25239");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_element_manifest_js__WEBPACK_IMPORTED_MODULE_0__, _aliases_js__WEBPACK_IMPORTED_MODULE_1__]);
([_element_manifest_js__WEBPACK_IMPORTED_MODULE_0__, _aliases_js__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
// The editors' elements from their manifests (standard simai.smart-component
// 1.3.8 §3, §4, §8, §16.20).
//
// sf-sortable, sf-inline-editor and sf-composition-overlay are plain custom
// elements defined by the composition modules (core/js/composition): the
// overlay's bundle carries the drag module too, and a page may define them
// before any Smart base is loaded. They draw nothing through the Smart base
// and keep their own lifecycle. What the manifest gives every component --
// the settings' attributes and properties, sfEmit through the dated aliases,
// sfWord, the declared actions -- they take from elementFromManifest over a
// plain base that answers the two callbacks the generated class calls and
// installs the component's aliases.json once the element is placed.
//
//   const base = manifestHost(manifest, {lang: {en, ru}, source: 'ru', aliases});
//   defineSortable(registry, {base});



function manifestHost(manifest, options = {}) {
  const Html = globalThis.HTMLElement;
  if (typeof Html !== 'function') return null;

  class PlainHost extends Html {
    connectedCallback() {
      // Static markup printed for the first paint (standard 1.3.8 §5.4) goes
      // as the element connects: these elements draw in the same task.
      if (!this.__sfFirstPaintEnded) {
        this.__sfFirstPaintEnded = true;
        for (const child of Array.from(this.children)) {
          if (child.hasAttribute('data-sf-static') && !child.hasAttribute('slot')) child.remove();
          else child.removeAttribute('data-sf-held');
        }
        this.removeAttribute('data-sf-first-paint');
      }
      // Installed once and kept while the element is detached, as the Smart
      // base does: a page that moves the element keeps its old names.
      if (this.constructor.aliases && !this.__sfAliases) {
        this.__sfAliases = (0,_aliases_js__WEBPACK_IMPORTED_MODULE_1__.installAliases)(this, this.constructor.aliases, {
          tag: this.localName,
          adapters: this.sfAliasAdapters?.() ?? {},
        });
      }
    }

    disconnectedCallback() {}

    // The generated actions read the instance's scope (§7.7); a plain host's
    // ends when the page removes it.
    get sfScope() {
      if (!this.__sfScope || (this.__sfScope.signal.aborted && this.isConnected)) this.__sfScope = new AbortController();
      return this.__sfScope.signal;
    }
  }

  return (0,_element_manifest_js__WEBPACK_IMPORTED_MODULE_0__.elementFromManifest)(manifest, { ...options, base: PlainHost });
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ manifestHost });

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "dd1616d485c7"
(__webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   OVERLAY_EVENTS: () => (/* binding */ OVERLAY_EVENTS),
/* harmony export */   OVERLAY_EVENTS_LEGACY: () => (/* binding */ OVERLAY_EVENTS_LEGACY),
/* harmony export */   checkOverlayActions: () => (/* binding */ checkOverlayActions),
/* harmony export */   checkOverlayNodes: () => (/* binding */ checkOverlayNodes),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   defineCompositionOverlay: () => (/* binding */ defineCompositionOverlay),
/* harmony export */   flatOverlayNodes: () => (/* binding */ flatOverlayNodes),
/* harmony export */   frameRectToHost: () => (/* binding */ frameRectToHost),
/* harmony export */   frameViewport: () => (/* binding */ frameViewport),
/* harmony export */   overlayNodes: () => (/* binding */ overlayNodes)
/* harmony export */ });
/* harmony import */ var _canonical_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("6f489cc65b77");
/* harmony import */ var _page_language_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("43090d1c8307");
/* harmony import */ var _sortable_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("7c1f9c2b36da");
/* harmony import */ var _open_surface_mark_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("bf0cea966575");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_page_language_js__WEBPACK_IMPORTED_MODULE_1__, _sortable_mjs__WEBPACK_IMPORTED_MODULE_2__, _open_surface_mark_js__WEBPACK_IMPORTED_MODULE_3__]);
([_page_language_js__WEBPACK_IMPORTED_MODULE_1__, _sortable_mjs__WEBPACK_IMPORTED_MODULE_2__, _open_surface_mark_js__WEBPACK_IMPORTED_MODULE_3__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);





// Editor canvas overlay. It draws hover and selection frames, a floating
// action toolbar and insertion points over a rendered Composition Document
// without touching the canvas DOM: the published HTML stays byte-identical.
// The host supplies node descriptions and actions and performs every change.
//
// Framed mode (attachFrame + setNodes) draws the same chrome over a same-origin
// iframe fed a flat node list: frame coordinates are mapped to the host page
// through the iframe's position, borders, padding, scale and the frame's own
// scroll, and a plain-string inline edit happens on the element inside the frame.

// The names sf-composition-overlay's component.json declares (standard 1.3.8
// §8, vocabulary 1.1.5): select {ids, id}, apply {action, scope: entry, ids}
// (one entry's own action, §18.3), insert, move {ids, id, parent, position}
// (one manual move) and change {id, value, previous} for a plain-string edit.
// select, move and insert keep their names and add the vocabulary's fields to
// the former ones (node_id, parent_id stay for the composition host); apply
// and change are new names, followed by sf-composition-overlay-action and
// -edit with their former details until 2026-12-01 (aliases.json).
const OVERLAY_EVENTS = Object.freeze({
  select: 'sf-composition-overlay-select',
  action: 'sf-composition-overlay-apply',
  insert: 'sf-composition-overlay-insert',
  move: 'sf-composition-overlay-move',
  edit: 'sf-composition-overlay-change',
});

const OVERLAY_EVENTS_LEGACY = Object.freeze({
  action: 'sf-composition-overlay-action',
  edit: 'sf-composition-overlay-edit',
});

const LEGACY_DETAIL = {
  action: (detail) => ({ action_id: detail.action, node_id: detail.ids[0] ?? null }),
  edit: (detail) => ({ node_id: detail.id, value: detail.value, previous: detail.previous }),
};

const MESSAGES = {
  ru: { picked: 'Перемещение: {label}. Стрелки выбирают место, Enter — положить, Escape — отменить.', cancelled: 'Перемещение отменено.', tree: 'Структура страницы', toolbar: 'Действия', insert: 'Вставить', insertAt: 'Вставить в «{slot}», позиция {index}', position: '{index} из {total}', selected: 'Выбрано: {label}', editing: 'Редактирование: {label}. Enter — сохранить, Escape — отменить.' },
  en: { picked: 'Moving {label}. Arrows choose a place, Enter drops, Escape cancels.', cancelled: 'Move cancelled.', tree: 'Page structure', toolbar: 'Actions', insert: 'Insert', insertAt: 'Insert into “{slot}”, position {index}', position: '{index} of {total}', selected: 'Selected: {label}', editing: 'Editing {label}. Enter saves, Escape cancels.' },
};

const ACTION_ID = /^[a-z][a-z0-9-]{0,63}$/u;
const format = (template, values) => template.replace(/\{(\w+)\}/gu, (_, key) => String(values[key] ?? ''));

/** Flattens a Document into overlay nodes in document order. */
function overlayNodes(document) {
  const nodes = [];
  const visit = (node, parent, slot, index, level) => {
    if (!(0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(node) || typeof node.id !== 'string') return;
    const entry = { id: node.id, type: node.type, parent, slot, index, level, slots: {} };
    nodes.push(entry);
    for (const [name, children] of Object.entries((0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(node.slots) ? node.slots : {})) {
      if (!Array.isArray(children)) continue;
      entry.slots[name] = children.map((child) => child?.id).filter((id) => typeof id === 'string');
      children.forEach((child, childIndex) => visit(child, node.id, name, childIndex, level + 1));
    }
  };
  visit(document?.root, null, null, 0, 1);
  return nodes;
}

function checkOverlayActions(actions) {
  if (!Array.isArray(actions) || actions.length > 16) throw new TypeError('Overlay actions must be a list of up to 16 entries');
  return actions.map((action) => {
    if (!(0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(action) || !ACTION_ID.test(action.id || '') || typeof action.label !== 'string' || !action.label.trim()
      || Object.keys(action).some((key) => key !== 'id' && key !== 'label')) {
      throw new TypeError('Overlay actions have an opaque id and a label only');
    }
    return Object.freeze({ id: action.id, label: action.label });
  });
}

const NODE_KEYS = new Set(['id', 'kind', 'rect', 'element', 'label', 'parent', 'editable']);
const finite = (value) => typeof value === 'number' && Number.isFinite(value);
// Elements of the frame belong to another realm, so `instanceof Element` is false for them.
const isElement = (value) => Boolean(value) && typeof value === 'object' && value.nodeType === 1 && typeof value.getBoundingClientRect === 'function';

/**
 * Checks a framed canvas's flat node list: [{id, kind, rect? | element?, label?,
 * parent?, editable?}]. rect is in frame-document coordinates {x, y, width,
 * height}; element is a node inside the frame. Returns frozen entries.
 */
function checkOverlayNodes(nodes) {
  if (!Array.isArray(nodes)) throw new TypeError('Overlay nodes must be a list');
  const seen = new Set();
  const list = nodes.map((node) => {
    if (!(0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(node) || Object.keys(node).some((key) => !NODE_KEYS.has(key))) {
      throw new TypeError('Overlay nodes have id, kind, rect or element, label, parent and editable only');
    }
    if (typeof node.id !== 'string' || !node.id || seen.has(node.id)) throw new TypeError('Overlay nodes have unique non-empty string ids');
    if (typeof node.kind !== 'string' || !node.kind) throw new TypeError(`Overlay node ${node.id} names its kind`);
    const { rect, element } = node;
    if (rect !== undefined && (!(0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(rect) || !['x', 'y', 'width', 'height'].every((key) => finite(rect[key])) || rect.width < 0 || rect.height < 0)) {
      throw new TypeError(`Overlay node ${node.id} has a rect {x, y, width, height} of finite numbers`);
    }
    if (element !== undefined && !isElement(element)) throw new TypeError(`Overlay node ${node.id} has an element`);
    if (rect === undefined && element === undefined) throw new TypeError(`Overlay node ${node.id} has a rect or an element`);
    if (node.label !== undefined && typeof node.label !== 'string') throw new TypeError(`Overlay node ${node.id} has a string label`);
    if (node.parent !== undefined && node.parent !== null && (typeof node.parent !== 'string' || node.parent === node.id)) {
      throw new TypeError(`Overlay node ${node.id} names another node as its parent`);
    }
    if (node.editable !== undefined && typeof node.editable !== 'boolean') throw new TypeError(`Overlay node ${node.id} has a boolean editable`);
    if (node.editable && element === undefined) throw new TypeError(`Overlay node ${node.id} is editable only with an element`);
    seen.add(node.id);
    return Object.freeze({
      id: node.id,
      kind: node.kind,
      rect: rect === undefined ? null : Object.freeze({ x: rect.x, y: rect.y, width: rect.width, height: rect.height }),
      element: element ?? null,
      label: node.label ?? null,
      parent: node.parent ?? null,
      editable: node.editable === true,
    });
  });
  const byId = new Map(list.map((node) => [node.id, node]));
  for (const node of list) {
    const visited = new Set([node.id]);
    for (let parent = node.parent; parent !== null; parent = byId.get(parent).parent) {
      if (!byId.has(parent)) throw new TypeError(`Overlay node ${node.id} names a parent that is not in the list`);
      if (visited.has(parent)) throw new TypeError(`Overlay node ${node.id} is its own ancestor`);
      visited.add(parent);
    }
  }
  return Object.freeze(list);
}

/** Overlay entries for a checked flat list, in list order; the top level is parent null, slot "default". */
function flatOverlayNodes(list) {
  const entries = list.map((node) => ({ id: node.id, type: node.kind, kind: node.kind, label: node.label, parent: node.parent, slot: 'default', index: 0, level: 1, slots: {}, flat: node }));
  const byId = new Map(entries.map((entry) => [entry.id, entry]));
  const counts = new Map();
  for (const entry of entries) {
    const key = entry.parent ?? '';
    entry.index = counts.get(key) || 0;
    counts.set(key, entry.index + 1);
    if (entry.parent) (byId.get(entry.parent).slots.default ||= []).push(entry.id);
    for (let parent = entry.parent; parent; parent = byId.get(parent).parent) entry.level += 1;
  }
  return entries;
}

/**
 * Where a frame's viewport lies on the host page. rect is the iframe's border box
 * on the host (after any transform or zoom), layout its untransformed border box
 * size (offsetWidth/offsetHeight), border and padding its own {top, right,
 * bottom, left} in CSS px, inner the frame's viewport size in its own px and
 * scroll the frame's scroll position. The scale is rect over layout; without a
 * layout size it is taken from the parts, which the viewport's whole-pixel size
 * makes less exact under zoom.
 */
function frameViewport({ rect, layout = null, border, padding, inner, scroll = { x: 0, y: 0 } }) {
  const outerWidth = layout?.width > 0 ? layout.width : border.left + padding.left + inner.width + padding.right + border.right;
  const outerHeight = layout?.height > 0 ? layout.height : border.top + padding.top + inner.height + padding.bottom + border.bottom;
  const scaleX = outerWidth > 0 && rect.width > 0 ? rect.width / outerWidth : 1;
  const scaleY = outerHeight > 0 && rect.height > 0 ? rect.height / outerHeight : 1;
  return {
    left: rect.left + (border.left + padding.left) * scaleX,
    top: rect.top + (border.top + padding.top) * scaleY,
    width: inner.width * scaleX,
    height: inner.height * scaleY,
    scaleX,
    scaleY,
    scrollX: scroll.x,
    scrollY: scroll.y,
  };
}

/** A box in the frame's viewport coordinates {x, y, width, height}, mapped to the host page. */
function frameRectToHost(box, view) {
  const left = view.left + box.x * view.scaleX;
  const top = view.top + box.y * view.scaleY;
  const width = box.width * view.scaleX;
  const height = box.height * view.scaleY;
  return { x: left, y: top, left, top, width, height, right: left + width, bottom: top + height };
}

const plainText = (element) => (element.textContent || '').replace(/\s+/gu, ' ').trim();
const px = (value) => Number.parseFloat(value) || 0;
const intersect = (a, b) => ({ left: Math.max(a.left, b.left), top: Math.max(a.top, b.top), right: Math.min(a.right, b.right), bottom: Math.min(a.bottom, b.bottom) });

// One manual move (vocabulary 1.1.5 §5 move, {id, parent, position}) in the
// vocabulary's words beside the composition host's.
function moveDetail(id, descriptor) {
  return { node_id: id, ...descriptor, ids: [id], id, parent: descriptor.parent_id ?? null, position: descriptor.index };
}

// base: the class made from sf-composition-overlay's component.json
// (manifest-host.mjs); without it the overlay is a plain element.
function defineCompositionOverlay(registry = globalThis.customElements, { base = null } = {}) {
  if (!registry || typeof globalThis.HTMLElement !== 'function') return null;
  const existing = registry.get('sf-composition-overlay');
  if (existing) return existing;

  class SfCompositionOverlay extends (base || globalThis.HTMLElement) {
    constructor() {
      super();
      this.canvas = null;
      this.nodes = [];
      this.byId = new Map();
      this.describe = () => ({});
      this._actions = [];
      this.selectedId = null;
      this.hoverId = null;
      this._insertionTarget = null;
      this.connection = null;
      this.frameRequest = 0;
      this.resizeObserver = null;
      this.layer = null;
      this.dropFilter = () => true;
      this.moving = null;
      this.unregisterDrop = null;
      this.dropHint = null;
      this.iframe = null;
      this.frameDoc = null;
      this.frameConnection = null;
      this.view = null;
      this.elementIds = new Map();
      this.rectNodes = [];
      this.editing = null;
    }

    // actions, messages and insertion-target are settings of the manifest
    // (properties); a write goes through the same checks as the host port's
    // setActions, setMessages and setInsertionTarget, which stay.
    get actions() {
      return this._actions;
    }

    set actions(value) {
      this.setActions(value ?? []);
    }

    get insertionTarget() {
      return this._insertionTarget;
    }

    set insertionTarget(value) {
      this.setInsertionTarget(value ?? null);
    }

    set messages(value) {
      this.setMessages(value);
    }

    get messages() {
      // In the page's language through pageText, as every component's words are.
      const words = Object.fromEntries(Object.keys(MESSAGES.en).map((key) => [key, (0,_page_language_js__WEBPACK_IMPORTED_MODULE_1__.pageText)(MESSAGES, key, this, 'sf-composition-overlay')]));
      return { ...words, ...(this.customMessages || {}) };
    }

    connectedCallback() {
      super.connectedCallback?.();
      if (!this.layer) this.buildLayer();
      const canvasId = this.getAttribute('for');
      const frameId = this.getAttribute('frame');
      if (frameId && !this.canvas && !this.iframe) {
        const iframe = globalThis.document.getElementById(frameId);
        if (iframe) this.attachFrame(iframe);
      } else if (canvasId && !this.canvas && !this.iframe) {
        const canvas = globalThis.document.getElementById(canvasId);
        if (canvas) this.attach(canvas);
      } else if (this.canvas || this.iframe) {
        this.bind();
      }
    }

    disconnectedCallback() {
      super.disconnectedCallback?.();
      this.unbind();
    }

    buildLayer() {
      const doc = globalThis.document;
      this.classList.add('sf-composition-overlay');
      this.layer = doc.createElement('div');
      this.layer.className = 'sf-composition-overlay-layer';
      this.layer.setAttribute('aria-hidden', 'true');
      this.hoverFrame = this.frame('hover');
      this.selectedFrame = this.frame('selected');
      this.insertionLayer = doc.createElement('div');
      this.insertionLayer.className = 'sf-composition-overlay-insertions';
      this.toolbar = doc.createElement('div');
      this.toolbar.className = 'sf-composition-overlay-toolbar';
      this.toolbar.setAttribute('role', 'toolbar');
      this.toolbar.hidden = true;
      this.tree = doc.createElement('div');
      this.tree.className = 'sf-composition-overlay-tree';
      this.tree.setAttribute('role', 'tree');
      this.tree.tabIndex = 0;
      this.live = doc.createElement('div');
      this.live.className = 'sf-composition-overlay-live';
      this.live.setAttribute('aria-live', 'polite');
      this.append(this.tree, this.toolbar, this.insertionLayer, this.layer, this.live);
      this.layer.append(this.hoverFrame, this.selectedFrame);
    }

    frame(kind) {
      const frame = globalThis.document.createElement('div');
      frame.className = `sf-composition-overlay-frame sf-composition-overlay-frame--${kind}`;
      frame.hidden = true;
      const label = globalThis.document.createElement('span');
      label.className = 'sf-composition-overlay-label';
      frame.append(label);
      return frame;
    }

    /** Binds the overlay to a rendered canvas; the canvas is never modified. */
    attach(canvas) {
      if (!(canvas instanceof globalThis.Element)) throw new TypeError('Overlay canvas must be an element');
      if (!this.layer) this.buildLayer();
      this.unbind();
      this.canvas = canvas;
      this.iframe = null;
      this.removeAttribute('data-sf-overlay-mode');
      this.layer.style.clipPath = '';
      this.insertionLayer.style.clipPath = '';
      if (this.isConnected) this.bind();
      return this;
    }

    /** Binds the overlay to a same-origin iframe canvas fed by setNodes; the frame's HTML is never modified by the overlay. */
    attachFrame(iframe) {
      if (!isElement(iframe) || iframe.localName !== 'iframe') throw new TypeError('Overlay frame must be an iframe element');
      if (!this.layer) this.buildLayer();
      this.unbind();
      this.canvas = null;
      this.iframe = iframe;
      this.setAttribute('data-sf-overlay-mode', 'frame');
      if (this.isConnected) this.bind();
      return this;
    }

    bind() {
      if (this.connection || (!this.canvas && !this.iframe)) return;
      this.connection = new AbortController();
      const options = { signal: this.connection.signal };
      const passive = { ...options, passive: true };
      if (this.iframe) {
        // A new letter (srcdoc, navigation) is a new document: listen to it again.
        this.iframe.addEventListener('load', () => this.bindFrameDocument(), options);
        this.iframe.addEventListener('pointerleave', () => this.setHover(null), passive);
      } else {
        this.canvas.addEventListener('pointermove', (event) => this.onPointerMove(event), passive);
        this.canvas.addEventListener('pointerleave', () => this.setHover(null), passive);
        this.canvas.addEventListener('click', (event) => this.onCanvasClick(event), { ...options, capture: true });
      }
      this.tree.addEventListener('keydown', (event) => this.onTreeKey(event), options);
      this.tree.addEventListener('focus', () => {
        this.setAttribute('data-sf-overlay-focus', '');
        if (!this.selectedId && this.nodes.length) this.select(this.nodes[0].id);
      }, options);
      this.tree.addEventListener('blur', () => this.removeAttribute('data-sf-overlay-focus'), options);
      this.toolbar.addEventListener('click', (event) => this.onToolbarClick(event), options);
      this.toolbar.addEventListener('keydown', (event) => this.onToolbarKey(event), options);
      this.insertionLayer.addEventListener('click', (event) => this.onInsertionClick(event), options);
      globalThis.addEventListener('scroll', () => this.schedule(), { ...passive, capture: true });
      globalThis.addEventListener('resize', () => this.schedule(), passive);
      if (typeof globalThis.ResizeObserver === 'function') {
        this.resizeObserver = new globalThis.ResizeObserver(() => this.schedule());
        this.resizeObserver.observe(this.canvas || this.iframe);
      }
      this.unregisterDrop = (0,_sortable_mjs__WEBPACK_IMPORTED_MODULE_2__.registerSortableDropTarget)({
        resolve: (x, y, dragSession) => (this.acceptsDrag(dragSession) ? this.resolveDrop(x, y, null) : null),
        keyboardTargets: (dragSession) => (this.acceptsDrag(dragSession) ? this.dropTargets(null) : []),
        drop: (dragSession, descriptor) => this.emit(OVERLAY_EVENTS.insert, { ...descriptor, parent: descriptor.parent_id ?? null, item: dragSession.item, from: dragSession.from, mode: dragSession.mode }),
        leave: () => this.showDropHint(null),
      });
      this.selectedFrame.firstChild.addEventListener('pointerdown', (event) => this.onHandleDown(event), options);
      this.setAttribute('data-sf-overlay', 'connected');
      this.renderTree();
      if (this.iframe) this.bindFrameDocument();
      this.schedule();
    }

    /** Listens to the frame's current document and window; called on bind and on every frame load. */
    bindFrameDocument() {
      if (this.editing) this.finishEdit(false);
      this.frameConnection?.abort();
      this.frameConnection = null;
      let doc = null;
      try {
        doc = this.iframe.contentDocument;
      } catch {
        doc = null;
      }
      const win = doc?.defaultView || null;
      this.frameDoc = win ? doc : null;
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
        this.resizeObserver.observe(this.iframe);
      }
      if (!this.frameDoc) {
        // A cross-origin or not yet available frame: nothing is drawn over it.
        this.setAttribute('data-sf-overlay-frame', 'unreachable');
        this.schedule();
        return;
      }
      this.removeAttribute('data-sf-overlay-frame');
      this.frameConnection = new AbortController();
      const options = { signal: this.frameConnection.signal };
      const passive = { ...options, passive: true };
      doc.addEventListener('pointermove', (event) => this.setHover(this.frameNodeAt(event)), passive);
      doc.addEventListener('pointerout', (event) => { if (!event.relatedTarget) this.setHover(null); }, passive);
      doc.addEventListener('click', (event) => this.onFrameClick(event), { ...options, capture: true });
      doc.addEventListener('dblclick', (event) => this.onFrameDoubleClick(event), { ...options, capture: true });
      doc.addEventListener('keydown', (event) => this.onFrameKey(event), { ...options, capture: true });
      win.addEventListener('scroll', () => this.schedule(), { ...passive, capture: true });
      win.addEventListener('resize', () => this.schedule(), passive);
      if (this.resizeObserver) {
        if (doc.documentElement) this.resizeObserver.observe(doc.documentElement);
        if (doc.body) this.resizeObserver.observe(doc.body);
      }
      this.schedule();
    }

    unbind() {
      this.finishEdit(false);
      this.frameConnection?.abort();
      this.frameConnection = null;
      this.frameDoc = null;
      this.pointerDrag?.abort();
      this.pointerDrag = null;
      this.unregisterDrop?.();
      this.unregisterDrop = null;
      this.moving = null;
      this.connection?.abort();
      this.connection = null;
      this.resizeObserver?.disconnect();
      this.resizeObserver = null;
      if (this.frameRequest) globalThis.cancelAnimationFrame(this.frameRequest);
      this.frameRequest = 0;
      if (this.canvas || this.iframe) this.setAttribute('data-sf-overlay', 'disposed');
    }

    /** Supplies the Document structure and a describe(node) → {label, badges}. */
    setDocument(document, { describe } = {}) {
      this.elementIds = new Map();
      this.rectNodes = [];
      this.replaceNodes(overlayNodes(document), describe);
      return this;
    }

    /**
     * Supplies a framed canvas's flat node list [{id, kind, rect? | element?,
     * label?, parent?, editable?}] in selection order, and an optional
     * describe(node) → {label, badges}; without it the label is node.label or its kind.
     */
    setNodes(nodes, { describe } = {}) {
      const list = checkOverlayNodes(nodes);
      this.elementIds = new Map(list.filter((node) => node.element).map((node) => [node.element, node.id]));
      const entries = flatOverlayNodes(list);
      this.rectNodes = entries.filter((entry) => entry.flat.rect && !entry.flat.element);
      if (this.editing) {
        const next = list.find((node) => node.id === this.editing.id);
        if (!next || next.element !== this.editing.element || !next.editable) this.finishEdit(false);
      }
      this.replaceNodes(entries, typeof describe === 'function' ? describe : (node) => ({ label: node.label || node.kind }));
      return this;
    }

    replaceNodes(nodes, describe) {
      const previous = this.selectedId ? this.byId.get(this.selectedId) : null;
      const active = globalThis.document.activeElement;
      const focused = Boolean(active) && (this.toolbar?.contains(active) || this.insertionLayer?.contains(active));
      this.nodes = nodes;
      this.byId = new Map(this.nodes.map((node) => [node.id, node]));
      if (typeof describe === 'function') this.describe = describe;
      this.renderTree();
      // A selected node the host removed is deselected (and announced), so its
      // toolbar and insertion places do not stay on screen. When keyboard focus
      // was on a disappearing button, the parent (or first node) is selected and
      // focus moves to the tree instead of dropping onto the page body.
      if (this.selectedId !== null && !this.byId.has(this.selectedId)) {
        const fallback = previous?.parent && this.byId.has(previous.parent) ? previous.parent : this.nodes[0]?.id ?? null;
        this.select(focused ? fallback : null, { focus: focused });
      }
      this.schedule();
    }

    /** Re-measures on the next frame, after a change no observer reports (a transform on an ancestor of the canvas). */
    refresh() {
      this.schedule();
      return this;
    }

    setActions(actions) {
      this._actions = checkOverlayActions(actions);
      this.renderToolbar();
      this.schedule();
      return this;
    }

    setMessages(messages) {
      this.customMessages = (0,_canonical_mjs__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(messages) ? { ...messages } : null;
      this.renderTree();
      return this;
    }

    /** filter({parent_id, slot, index}, item) → boolean hides invalid places. */
    setDropFilter(filter) {
      this.dropFilter = typeof filter === 'function' ? filter : () => true;
      return this;
    }

    // Named so, not accepts: that is the setting's property (component.json).
    acceptsDrag(dragSession) {
      const groups = (this.getAttribute('accepts') || '').split(/\s+/u).filter(Boolean);
      return Boolean(dragSession && groups.includes(dragSession.group));
    }

    emit(type, detail) {
      this.dispatchEvent(new globalThis.CustomEvent(type, { bubbles: true, composed: true, detail: Object.freeze(detail) }));
    }

    // A renamed event: the overlay's aliases.json sends the former name after
    // it (the adapters below); an overlay defined without its manifest sends
    // both here. Answers false when a listener cancelled either.
    sendRenamed(key, detail, cancelable = false) {
      const event = new globalThis.CustomEvent(OVERLAY_EVENTS[key], { bubbles: true, composed: true, cancelable, detail: Object.freeze(detail) });
      let allowed = this.dispatchEvent(event);
      if (!this.__sfAliases) {
        const legacy = new globalThis.CustomEvent(OVERLAY_EVENTS_LEGACY[key], { bubbles: true, composed: true, cancelable, detail: Object.freeze(LEGACY_DETAIL[key](detail)) });
        allowed = this.dispatchEvent(legacy) && allowed;
      }
      return allowed && !event.defaultPrevented;
    }

    sfAliasAdapters() {
      return {
        [OVERLAY_EVENTS_LEGACY.action]: LEGACY_DETAIL.action,
        [OVERLAY_EVENTS_LEGACY.edit]: LEGACY_DETAIL.edit,
      };
    }

    /** Every valid insertion place in document order; moving excludes its own subtree and no-op places. */
    dropTargets(moving) {
      const excluded = new Set();
      if (moving) {
        const stack = [moving];
        while (stack.length) {
          const id = stack.pop();
          excluded.add(id);
          for (const children of Object.values(this.byId.get(id)?.slots || {})) stack.push(...children);
        }
      }
      const places = [];
      for (const node of this.nodes) {
        if (excluded.has(node.id)) continue;
        for (const [slot, children] of Object.entries(node.slots)) {
          const remaining = moving ? children.filter((id) => id !== moving) : children;
          for (let index = 0; index <= remaining.length; index += 1) {
            if (moving) {
              const source = this.byId.get(moving);
              if (source.parent === node.id && source.slot === slot && index === source.index) continue;
            }
            const descriptor = { parent_id: node.id, slot, index };
            if (!this.dropFilter(descriptor, moving ? { node_id: moving } : (0,_sortable_mjs__WEBPACK_IMPORTED_MODULE_2__.activeSortableSession)())) continue;
            const rect = this.placeRect(node.id, slot, index, remaining);
            if (rect) places.push({ descriptor, rect, label: format(this.messages.insertAt, { slot, index: index + 1 }) });
          }
        }
      }
      return places;
    }

    placeRect(parentId, slot, index, children) {
      const before = this.element(children[index]);
      const after = this.element(children[index - 1]);
      const parent = this.element(parentId);
      const anchor = before || after || parent;
      if (!anchor) return null;
      const box = anchor.getBoundingClientRect();
      const y = before ? box.top : box.bottom;
      return { left: box.left, top: y - 1, width: box.width, height: 3 };
    }

    resolveDrop(x, y, moving) {
      if (!this.canvas) return null;
      const under = globalThis.document.elementsFromPoint(x, y).find((element) => this.canvas.contains(element));
      let id = under ? this.nodeAt(under) : null;
      const allowedPlaces = moving ? this.dropTargets(moving) : null;
      const allowed = (descriptor) => (moving
        ? allowedPlaces.some((place) => JSON.stringify(place.descriptor) === JSON.stringify(descriptor))
        : this.dropFilter(descriptor, (0,_sortable_mjs__WEBPACK_IMPORTED_MODULE_2__.activeSortableSession)()));
      // Over the moving node or its subtree there is no target.
      if (moving) {
        for (let cursor = id; cursor; cursor = this.byId.get(cursor)?.parent) {
          if (cursor === moving) {
            this.showDropHint(null);
            return null;
          }
        }
      }
      while (id) {
        const node = this.byId.get(id);
        // An empty slot of the container under the pointer is a target too.
        for (const [slot, children] of Object.entries(node.slots)) {
          const remaining = moving ? children.filter((entry) => entry !== moving) : children;
          const descriptor = { parent_id: node.id, slot, index: 0 };
          if (remaining.length === 0 && allowed(descriptor)) {
            const rect = this.placeRect(node.id, slot, 0, remaining);
            this.showDropHint(rect);
            return { descriptor, rect, label: format(this.messages.insertAt, { slot, index: 1 }) };
          }
        }
        if (!node.parent) break;
        const element = this.element(id);
        const box = element.getBoundingClientRect();
        const siblings = this.byId.get(node.parent).slots[node.slot];
        const remaining = moving ? siblings.filter((entry) => entry !== moving) : siblings;
        const position = remaining.indexOf(id);
        if (position >= 0) {
          const index = y > box.top + box.height / 2 ? position + 1 : position;
          const descriptor = { parent_id: node.parent, slot: node.slot, index };
          if (allowed(descriptor)) {
            const rect = this.placeRect(node.parent, node.slot, index, remaining);
            this.showDropHint(rect);
            return { descriptor, rect, label: format(this.messages.insertAt, { slot: node.slot, index: index + 1 }) };
          }
        }
        id = node.parent;
      }
      this.showDropHint(null);
      return null;
    }

    showDropHint(rect) {
      if (!this.dropHint) {
        this.dropHint = globalThis.document.createElement('div');
        this.dropHint.className = 'sf-composition-overlay-drop';
        this.layer?.append(this.dropHint);
      }
      this.dropHint.hidden = !rect;
      if (!rect) return;
      const origin = this.layerOrigin();
      Object.assign(this.dropHint.style, { left: `${rect.left - origin.left}px`, top: `${rect.top - origin.top}px`, width: `${rect.width}px`, height: `${rect.height}px` });
    }

    // Moving a canvas node: pointer via the selected label, keyboard via the tree.
    onHandleDown(event) {
      if (this.iframe) return;
      if (event.button !== 0 || !this.selectedId || !this.byId.get(this.selectedId)?.parent) return;
      event.preventDefault();
      const moving = this.selectedId;
      this.pointerDrag?.abort();
      const pending = new AbortController();
      this.pointerDrag = pending;
      let place = null;
      globalThis.addEventListener('keydown', (keyEvent) => {
        if (keyEvent.key !== 'Escape') return;
        keyEvent.preventDefault();
        pending.abort();
        this.showDropHint(null);
      }, { signal: pending.signal, capture: true });
      globalThis.addEventListener('pointermove', (moveEvent) => {
        place = this.resolveDrop(moveEvent.clientX, moveEvent.clientY, moving);
      }, { signal: pending.signal });
      globalThis.addEventListener('pointerup', () => {
        pending.abort();
        this.showDropHint(null);
        if (place) this.emit(OVERLAY_EVENTS.move, moveDetail(moving, place.descriptor));
      }, { signal: pending.signal });
      globalThis.addEventListener('pointercancel', () => { pending.abort(); this.showDropHint(null); }, { signal: pending.signal });
    }

    startKeyboardMove() {
      const node = this.byId.get(this.selectedId);
      if (!node?.parent) return;
      const places = this.dropTargets(node.id);
      if (!places.length) return;
      this.moving = { node: node.id, places, index: 0 };
      this.live.textContent = format(this.messages.picked, { label: this.info(node).label });
      this.showKeyboardPlace();
    }

    showKeyboardPlace() {
      const place = this.moving.places[this.moving.index];
      this.showDropHint(place.rect);
      this.live.textContent = place.label;
    }

    onMoveKey(event) {
      const moving = this.moving;
      if (event.key === 'Escape' || event.key === 'Tab') {
        if (event.key === 'Escape') event.preventDefault();
        this.moving = null;
        this.showDropHint(null);
        this.live.textContent = this.messages.cancelled;
        return true;
      }
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        const place = moving.places[moving.index];
        this.moving = null;
        this.showDropHint(null);
        this.emit(OVERLAY_EVENTS.move, moveDetail(moving.node, place.descriptor));
        return true;
      }
      const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[event.key];
      if (step === undefined) return true;
      event.preventDefault();
      moving.index = Math.max(0, Math.min(moving.places.length - 1, moving.index + step));
      this.showKeyboardPlace();
      return true;
    }

    setInsertionTarget(target) {
      this._insertionTarget = target && typeof target.parent_id === 'string' && typeof target.slot === 'string' && Number.isSafeInteger(target.index)
        ? Object.freeze({ parent_id: target.parent_id, slot: target.slot, index: target.index }) : null;
      this.schedule();
      return this;
    }

    element(id) {
      if (!this.canvas || typeof id !== 'string') return null;
      for (const element of this.canvas.querySelectorAll('[data-sf-composition-id]')) {
        if (element.getAttribute('data-sf-composition-id') === id) return element;
      }
      return null;
    }

    info(node) {
      const described = this.describe(node) || {};
      const label = typeof described.label === 'string' && described.label.trim() ? described.label : node.id;
      const badges = Array.isArray(described.badges) ? described.badges.filter((badge) => typeof badge === 'string' && badge.trim()).slice(0, 4) : [];
      return { label, badges };
    }

    select(id, { focus = false, emit = true } = {}) {
      if (id !== null && !this.byId.has(id)) return this;
      if (this.editing && this.editing.id !== id) this.finishEdit(true);
      if (this.selectedId === id) return this;
      this.selectedId = id;
      this.renderTreeSelection();
      this.renderToolbar();
      this.schedule();
      if (id !== null) {
        const node = this.byId.get(id);
        const siblings = this.nodes.filter((entry) => entry.parent === node.parent && entry.slot === node.slot);
        const { label } = this.info(node);
        this.live.textContent = `${format(this.messages.selected, { label })}, ${format(this.messages.position, { index: siblings.indexOf(node) + 1, total: siblings.length })}`;
      }
      if (focus) this.tree.focus();
      if (emit) this.dispatchEvent(new globalThis.CustomEvent(OVERLAY_EVENTS.select, { bubbles: true, composed: true, detail: Object.freeze({ ids: id === null ? [] : [id], id, node_id: id }) }));
      return this;
    }

    setHover(id) {
      if (this.hoverId === id) return;
      this.hoverId = id;
      this.schedule();
    }

    nodeAt(target) {
      let element = target instanceof globalThis.Element ? target.closest('[data-sf-composition-id]') : null;
      while (element && this.canvas.contains(element)) {
        const id = element.getAttribute('data-sf-composition-id');
        if (this.byId.has(id)) return id;
        element = element.parentElement?.closest('[data-sf-composition-id]') || null;
      }
      return null;
    }

    onPointerMove(event) {
      this.setHover(this.nodeAt(event.target));
    }

    onCanvasClick(event) {
      const id = this.nodeAt(event.target);
      if (!id) return;
      // In the editor a click selects; it never follows links or submits.
      event.preventDefault();
      event.stopPropagation();
      this.select(id);
    }

    onTreeKey(event) {
      if (this.moving && this.onMoveKey(event)) return;
      if (event.key === ' ' && this.selectedId && !this.iframe) {
        event.preventDefault();
        this.startKeyboardMove();
        return;
      }
      const index = this.nodes.findIndex((node) => node.id === this.selectedId);
      const current = this.nodes[index];
      let next = null;
      if (event.key === 'ArrowDown') next = this.nodes[Math.min(this.nodes.length - 1, index + 1)];
      else if (event.key === 'ArrowUp') next = this.nodes[Math.max(0, index - 1)];
      else if (event.key === 'Home') next = this.nodes[0];
      else if (event.key === 'End') next = this.nodes.at(-1);
      else if (event.key === 'ArrowLeft' && current?.parent) next = this.byId.get(current.parent);
      else if (event.key === 'ArrowRight' && current) next = this.nodes.find((node) => node.parent === current.id) || null;
      else if (event.key === 'Escape' && this.selectedId !== null && (!this.iframe || (0,_open_surface_mark_js__WEBPACK_IMPORTED_MODULE_3__.isTopOpenSurface)(this))) {
        event.preventDefault();
        this.select(null);
        return;
      } else if (event.key === 'Enter' && this.iframe && current?.flat?.editable) {
        event.preventDefault();
        this.edit(current.id);
        return;
      } else if (event.key === 'Enter' && this.toolbar.querySelector('button')) {
        event.preventDefault();
        this.toolbar.querySelector('button').focus();
        return;
      } else return;
      event.preventDefault();
      if (next) this.select(next.id);
    }

    onToolbarKey(event) {
      const buttons = [...this.toolbar.querySelectorAll('button')];
      const index = buttons.indexOf(globalThis.document.activeElement);
      if (event.key === 'Escape') {
        event.preventDefault();
        this.tree.focus();
      } else if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault();
        const step = (event.key === 'ArrowRight') === (globalThis.getComputedStyle(this).direction !== 'rtl') ? 1 : -1;
        buttons[(index + step + buttons.length) % buttons.length]?.focus();
      }
    }

    onToolbarClick(event) {
      const button = event.target instanceof globalThis.Element ? event.target.closest('button[data-action]') : null;
      if (!button || !this.selectedId) return;
      this.sendRenamed('action', { action: button.dataset.action, scope: 'entry', ids: [this.selectedId] });
    }

    onInsertionClick(event) {
      const button = event.target instanceof globalThis.Element ? event.target.closest('button[data-parent]') : null;
      if (!button) return;
      const target = { parent_id: button.dataset.parent, slot: button.dataset.slot, index: Number(button.dataset.index) };
      this.setInsertionTarget(target);
      this.positionInsertions();
      this.dispatchEvent(new globalThis.CustomEvent(OVERLAY_EVENTS.insert, { bubbles: true, composed: true, detail: Object.freeze({ ...target, parent: target.parent_id }) }));
    }

    renderTree() {
      if (!this.tree) return;
      this.tree.setAttribute('aria-label', this.getAttribute('label') || this.messages.tree);
      this.tree.replaceChildren(...this.nodes.map((node) => {
        const item = globalThis.document.createElement('div');
        const siblings = this.nodes.filter((entry) => entry.parent === node.parent && entry.slot === node.slot);
        const { label, badges } = this.info(node);
        item.id = `${this.id || 'sf-overlay'}-item-${node.id}`.replace(/[^A-Za-z0-9_-]/gu, '-');
        item.setAttribute('role', 'treeitem');
        item.setAttribute('aria-level', String(node.level));
        item.setAttribute('aria-setsize', String(siblings.length));
        item.setAttribute('aria-posinset', String(siblings.indexOf(node) + 1));
        item.setAttribute('aria-label', badges.length ? `${label} (${badges.join(', ')})` : label);
        item.dataset.nodeId = node.id;
        return item;
      }));
      this.renderTreeSelection();
    }

    renderTreeSelection() {
      let active = null;
      for (const item of this.tree?.children || []) {
        const selected = item.dataset.nodeId === this.selectedId;
        item.setAttribute('aria-selected', selected ? 'true' : 'false');
        if (selected) active = item.id;
      }
      if (active) this.tree.setAttribute('aria-activedescendant', active);
      else this.tree?.removeAttribute('aria-activedescendant');
    }

    renderToolbar() {
      if (!this.toolbar) return;
      this.toolbar.setAttribute('aria-label', this.messages.toolbar);
      this.toolbar.replaceChildren(...this.actions.map((action) => {
        const button = globalThis.document.createElement('button');
        button.type = 'button';
        button.className = 'sf-composition-overlay-action';
        button.dataset.action = action.id;
        button.textContent = action.label;
        return button;
      }));
      this.toolbar.hidden = !this.selectedId || this.actions.length === 0;
    }

    schedule() {
      if (this.frameRequest || !this.connection) return;
      this.frameRequest = globalThis.requestAnimationFrame(() => {
        this.frameRequest = 0;
        this.position();
      });
    }

    /** A node's box on the host page: its element's rect, or in framed mode its frame box mapped out of the frame. */
    nodeBox(id) {
      const node = typeof id === 'string' ? this.byId.get(id) : null;
      if (!node) return null;
      if (!node.flat) return this.element(id)?.getBoundingClientRect() ?? null;
      const view = this.view;
      if (!view || !this.frameDoc) return null;
      const { element, rect } = node.flat;
      if (element) {
        if (!element.isConnected || element.ownerDocument !== this.frameDoc) return null;
        const box = element.getBoundingClientRect();
        if (!box.width && !box.height) return null;
        return frameRectToHost({ x: box.left, y: box.top, width: box.width, height: box.height }, view);
      }
      return frameRectToHost({ x: rect.x - view.scrollX, y: rect.y - view.scrollY, width: rect.width, height: rect.height }, view);
    }

    place(frame, id) {
      const box = id ? this.nodeBox(id) : null;
      if (!box) {
        frame.hidden = true;
        return null;
      }
      frame.hidden = false;
      frame.style.insetInlineStart = '';
      const origin = this.layerOrigin();
      Object.assign(frame.style, { left: `${box.left - origin.left}px`, top: `${box.top - origin.top}px`, width: `${box.width}px`, height: `${box.height}px` });
      const { label, badges } = this.info(this.byId.get(id));
      frame.firstChild.textContent = badges.length ? `${label} · ${badges.join(' · ')}` : label;
      return box;
    }

    position() {
      if (!this.canvas && !this.iframe) return;
      if (this.iframe) {
        this.view = this.frameMetrics();
        this.applyClip(this.view?.clip ?? null);
      }
      this.place(this.hoverFrame, this.hoverId && this.hoverId !== this.selectedId ? this.hoverId : null);
      const box = this.place(this.selectedFrame, this.selectedId);
      if (this.iframe) {
        this.positionFrameToolbar(box);
        this.positionInsertions();
        return;
      }
      // No toolbar without a drawn selection, e.g. while the host re-renders,
      // unless it holds keyboard focus.
      if (box) this.toolbar.hidden = this.actions.length === 0;
      else if (!this.toolbar.contains(globalThis.document.activeElement)) this.toolbar.hidden = true;
      if (box && !this.toolbar.hidden) {
        const bar = this.toolbar.getBoundingClientRect();
        const above = box.top - bar.height - 4;
        const top = above >= 0 ? above : Math.min(globalThis.innerHeight - bar.height, box.bottom + 4);
        const rtl = globalThis.getComputedStyle(this).direction === 'rtl';
        const start = rtl ? box.right - bar.width : box.left;
        const left = Math.max(0, Math.min(start, globalThis.innerWidth - bar.width));
        const origin = this.layerOrigin();
        Object.assign(this.toolbar.style, { top: `${top - origin.top}px`, left: `${left - origin.left}px` });
      }
      this.positionInsertions();
    }

    positionInsertions() {
      const selected = this.selectedId ? this.byId.get(this.selectedId) : null;
      const points = selected?.flat ? this.flatInsertionPoints(selected) : [];
      if (selected?.parent && !selected.flat) {
        const parent = this.byId.get(selected.parent);
        const siblings = parent.slots[selected.slot] || [];
        for (let index = 0; index <= siblings.length; index += 1) points.push({ parent: parent.id, slot: selected.slot, index, before: siblings[index], after: siblings[index - 1] });
      }
      if (selected && !selected.flat) {
        for (const [slot, children] of Object.entries(selected.slots)) points.push({ parent: selected.id, slot, index: children.length, after: children.at(-1), end: true });
      }
      const target = this.insertionTarget;
      // Buttons are reused by key so keyboard focus and marks survive repositioning.
      const existing = new Map([...this.insertionLayer.children].map((button) => [button.dataset.key, button]));
      const keep = new Set();
      for (const point of points) {
        const box = this.nodeBox(point.before) || this.nodeBox(point.after) || this.nodeBox(point.parent);
        if (!box) continue;
        const key = `${point.parent}|${point.slot}|${point.index}`;
        keep.add(key);
        let button = existing.get(key);
        if (!button) {
          button = globalThis.document.createElement('button');
          button.type = 'button';
          button.className = 'sf-composition-overlay-insert';
          button.dataset.key = key;
          button.dataset.parent = point.parent;
          button.dataset.slot = point.slot;
          button.dataset.index = String(point.index);
          const mark = globalThis.document.createElement('span');
          mark.className = 'sf-composition-overlay-insert-mark';
          mark.setAttribute('aria-hidden', 'true');
          mark.textContent = '+';
          button.append(mark);
          this.insertionLayer.append(button);
        }
        const top = point.before && !point.end ? box.top : box.bottom;
        const marked = Boolean(target && target.parent_id === point.parent && target.slot === point.slot && target.index === point.index);
        button.setAttribute('aria-pressed', marked ? 'true' : 'false');
        button.setAttribute('aria-label', format(this.messages.insertAt, { slot: point.slot, index: point.index + 1 }));
        const origin = this.layerOrigin();
        Object.assign(button.style, { left: `${box.left - origin.left}px`, top: `${top - origin.top}px`, width: `${box.width}px` });
      }
      for (const [key, button] of existing) if (!keep.has(key)) button.remove();
    }

    // Framed mode: insertion places among the selected node's siblings (the top
    // level is parent_id ""), and at the end of its own children; setDropFilter hides places.
    flatInsertionPoints(selected) {
      const siblings = this.nodes.filter((node) => node.parent === selected.parent).map((node) => node.id);
      const parent = selected.parent ?? '';
      const points = [];
      for (let index = 0; index <= siblings.length; index += 1) points.push({ parent, slot: 'default', index, before: siblings[index], after: siblings[index - 1] });
      const children = selected.slots.default || [];
      if (children.length) points.push({ parent: selected.id, slot: 'default', index: children.length, after: children.at(-1), end: true });
      return points.filter((point) => this.dropFilter({ parent_id: point.parent, slot: point.slot, index: point.index }, null));
    }

    /** The frame's viewport on the host page and the part of it that is visible (clip). */
    frameMetrics() {
      const iframe = this.iframe;
      const win = this.frameDoc?.defaultView;
      if (!iframe?.isConnected || !win) return null;
      const rect = iframe.getBoundingClientRect();
      if (!rect.width && !rect.height) return null;
      const style = globalThis.getComputedStyle(iframe);
      const sides = (name, suffix = '') => ({ top: px(style[`${name}Top${suffix}`]), right: px(style[`${name}Right${suffix}`]), bottom: px(style[`${name}Bottom${suffix}`]), left: px(style[`${name}Left${suffix}`]) });
      const view = frameViewport({ rect, layout: { width: iframe.offsetWidth, height: iframe.offsetHeight }, border: sides('border', 'Width'), padding: sides('padding'), inner: { width: win.innerWidth, height: win.innerHeight }, scroll: { x: win.scrollX, y: win.scrollY } });
      let clip = { left: view.left, top: view.top, right: view.left + view.width, bottom: view.top + view.height };
      // Scrolling ancestors hide what lies outside them, and so does the window.
      const root = globalThis.document.documentElement;
      for (let element = iframe.parentElement; element && element !== root && element !== globalThis.document.body; element = element.parentElement) {
        const own = globalThis.getComputedStyle(element);
        if (own.overflowX === 'visible' && own.overflowY === 'visible') continue;
        const box = element.getBoundingClientRect();
        const left = box.left + element.clientLeft;
        const top = box.top + element.clientTop;
        clip = intersect(clip, { left, top, right: left + element.clientWidth, bottom: top + element.clientHeight });
      }
      view.clip = intersect(clip, { left: 0, top: 0, right: root.clientWidth, bottom: root.clientHeight });
      return view;
    }

    /**
     * Where the layer's own box starts. Everything the overlay draws is
     * `position: fixed` and placed from page coordinates, which is right
     * while the viewport is the containing block. An ancestor with
     * `contain: layout` becomes that containing block instead -- the
     * Framework's own drawer gives it to [data-sf-drawer-container] -- and
     * every frame then sat the ancestor's corner away from its node (48 px
     * under an app bar: simai/ui-source#58, found by ui-mail). The layer is
     * `inset: 0` of the same containing block, so its corner is exactly that
     * error: zero on an ordinary page, the ancestor's corner inside one.
     */
    layerOrigin() {
      const box = this.layer?.getBoundingClientRect?.();
      return box ? { left: box.left, top: box.top } : { left: 0, top: 0 };
    }

    applyClip(clip) {
      const layer = this.layer.getBoundingClientRect();
      const value = !clip || clip.right <= clip.left || clip.bottom <= clip.top
        ? 'inset(50%)'
        : `inset(${Math.max(0, clip.top - layer.top)}px ${Math.max(0, layer.right - clip.right)}px ${Math.max(0, layer.bottom - clip.bottom)}px ${Math.max(0, clip.left - layer.left)}px)`;
      this.layer.style.clipPath = value;
      this.insertionLayer.style.clipPath = value;
    }

    positionFrameToolbar(box) {
      const clip = this.view?.clip;
      const visible = Boolean(box && clip && box.right > clip.left && box.left < clip.right && box.bottom > clip.top && box.top < clip.bottom);
      if (visible) this.toolbar.hidden = this.actions.length === 0;
      else if (!this.toolbar.contains(globalThis.document.activeElement)) this.toolbar.hidden = true;
      if (!visible || this.toolbar.hidden) return;
      const bar = this.toolbar.getBoundingClientRect();
      // Above the node, else below it, and always inside the visible part of the frame.
      const above = box.top - bar.height - 4;
      let top = above >= clip.top ? above : box.bottom + 4;
      top = Math.max(clip.top, Math.min(top, clip.bottom - bar.height));
      const rtl = globalThis.getComputedStyle(this).direction === 'rtl';
      const start = rtl ? box.right - bar.width : box.left;
      const left = Math.max(0, Math.min(start, globalThis.document.documentElement.clientWidth - bar.width));
      const origin = this.layerOrigin();
      Object.assign(this.toolbar.style, { top: `${top - origin.top}px`, left: `${left - origin.left}px` });
    }

    /** The innermost node under a pointer event in the frame: the smallest element or rect node that holds it. */
    frameNodeAt(event) {
      let best = null;
      let area = Infinity;
      const consider = (id, width, height) => {
        if (width * height < area) {
          best = id;
          area = width * height;
        }
      };
      for (let element = isElement(event.target) ? event.target : event.target?.parentElement; element; element = element.parentElement) {
        const id = this.elementIds.get(element);
        if (id === undefined || !this.byId.has(id)) continue;
        const box = element.getBoundingClientRect();
        consider(id, box.width, box.height);
      }
      const win = this.frameDoc?.defaultView;
      if (win && this.rectNodes.length && finite(event.clientX)) {
        const x = event.clientX + win.scrollX;
        const y = event.clientY + win.scrollY;
        for (const { id, flat: { rect } } of this.rectNodes) {
          if (x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height) consider(id, rect.width, rect.height);
        }
      }
      return best;
    }

    onFrameClick(event) {
      if (this.editing && this.editing.element.contains(event.target)) return;
      // In the editor a click selects; it never follows links or submits. A
      // click on no node goes back to no selection (the letter itself).
      event.preventDefault();
      const id = this.frameNodeAt(event);
      if (id) event.stopPropagation();
      this.select(id);
    }

    onFrameDoubleClick(event) {
      if (this.editing) return;
      const id = this.frameNodeAt(event);
      if (!id || !this.byId.get(id).flat?.editable) return;
      event.preventDefault();
      this.edit(id);
    }

    onFrameKey(event) {
      if (this.editing) {
        if (event.isComposing) return;
        if (event.key === 'Enter' || event.key === 'Escape') {
          event.preventDefault();
          event.stopPropagation();
          this.finishEdit(event.key === 'Enter');
        }
        return;
      }
      if (!event.defaultPrevented) this.onTreeKey(event);
    }

    /** Starts plain-string editing of an editable node inside the frame; returns whether it started. */
    edit(id) {
      const node = typeof id === 'string' ? this.byId.get(id) : null;
      const element = node?.flat?.editable ? node.flat.element : null;
      if (!element || !this.frameDoc || !element.isConnected || element.ownerDocument !== this.frameDoc) return false;
      if (this.editing?.id === id) return true;
      if (this.editing) this.finishEdit(true);
      const returnFocus = globalThis.document.activeElement === this.tree;
      this.select(id);
      const doc = element.ownerDocument;
      const attribute = element.getAttribute('contenteditable');
      element.setAttribute('contenteditable', 'plaintext-only');
      // Where plaintext-only is unknown, rich editing is narrowed to plain text by hand.
      const plain = element.contentEditable === 'plaintext-only';
      if (!plain) element.setAttribute('contenteditable', 'true');
      const connection = new AbortController();
      const options = { signal: connection.signal };
      element.addEventListener('blur', () => this.finishEdit(true), options);
      element.addEventListener('input', () => this.schedule(), options);
      element.addEventListener('beforeinput', (event) => {
        const type = event.inputType || '';
        if (type === 'insertParagraph' || type === 'insertLineBreak' || (!plain && type.startsWith('format'))) event.preventDefault();
      }, options);
      if (!plain) {
        element.addEventListener('paste', (event) => {
          event.preventDefault();
          doc.execCommand('insertText', false, (event.clipboardData?.getData('text/plain') || '').replace(/\s+/gu, ' '));
        }, options);
      }
      this.editing = { id, element, saved: element.cloneNode(true), previous: plainText(element), attribute, connection, returnFocus };
      (0,_open_surface_mark_js__WEBPACK_IMPORTED_MODULE_3__.holdOpenSurfaceMark)(this, true);
      this.setAttribute('data-sf-overlay-editing', '');
      element.focus({ preventScroll: true });
      const selection = doc.defaultView?.getSelection();
      if (selection) {
        const range = doc.createRange();
        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      this.live.textContent = format(this.messages.editing, { label: this.info(node).label });
      this.schedule();
      return true;
    }

    /** Ends the inline edit: commit emits sf-composition-overlay-edit (cancelable) when the text changed; cancel restores it. */
    finishEdit(commit) {
      const editing = this.editing;
      if (!editing) return;
      this.editing = null;
      editing.connection.abort();
      (0,_open_surface_mark_js__WEBPACK_IMPORTED_MODULE_3__.holdOpenSurfaceMark)(this, false);
      this.removeAttribute('data-sf-overlay-editing');
      const { element } = editing;
      if (editing.attribute === null) element.removeAttribute('contenteditable');
      else element.setAttribute('contenteditable', editing.attribute);
      const restore = () => {
        if (element.isConnected) element.replaceChildren(...editing.saved.childNodes);
      };
      const value = plainText(element);
      if (!commit) restore();
      else if (value !== editing.previous) {
        // The host refused the value: the letter shows what it showed before.
        if (!this.sendRenamed('edit', { id: editing.id, value, previous: editing.previous }, true)) restore();
      }
      if (editing.returnFocus && this.isConnected) this.tree.focus({ preventScroll: true });
      this.schedule();
    }
  }

  registry.define('sf-composition-overlay', SfCompositionOverlay);
  return SfCompositionOverlay;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ OVERLAY_EVENTS, OVERLAY_EVENTS_LEGACY, checkOverlayActions, checkOverlayNodes, defineCompositionOverlay, flatOverlayNodes, frameRectToHost, frameViewport, overlayNodes });

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "7c1f9c2b36da"
(__webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SORTABLE_INTENT_EVENT: () => (/* binding */ SORTABLE_INTENT_EVENT),
/* harmony export */   SORTABLE_MOVE_EVENT: () => (/* binding */ SORTABLE_MOVE_EVENT),
/* harmony export */   SORTABLE_STATE_EVENT: () => (/* binding */ SORTABLE_STATE_EVENT),
/* harmony export */   activeSortableSession: () => (/* binding */ activeSortableSession),
/* harmony export */   attachSortable: () => (/* binding */ attachSortable),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   defineSortable: () => (/* binding */ defineSortable),
/* harmony export */   registerSortableDropTarget: () => (/* binding */ registerSortableDropTarget),
/* harmony export */   sortableIndexAt: () => (/* binding */ sortableIndexAt)
/* harmony export */ });
/* harmony import */ var _page_language_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("43090d1c8307");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_page_language_js__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
_page_language_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
// Sortable drag-and-drop primitive. <sf-sortable> lists and registered
// external drop targets share one drag session. Pointer (mouse, pen, touch via
// handles), keyboard and screen-reader paths all end in the same intent event;
// the component never moves host DOM or data. The host applies the change.


// The request to move an item (simai.smart-vocabulary 1.1.5 §5 move): the
// name sf-sortable's component.json declares. The former sf-sortable-intent
// follows it with the same detail until 2026-12-01.
const SORTABLE_MOVE_EVENT = 'sf-sortable-move';
const SORTABLE_INTENT_EVENT = 'sf-sortable-intent';
const SORTABLE_STATE_EVENT = 'sf-sortable-state';

const ITEM = '[data-sf-sortable-item]';
const HANDLE = '[data-sf-sortable-handle]';
const INTERACTIVE = 'a[href],button,input,select,textarea,summary,[contenteditable]:not([contenteditable="false"])';
const NAME = /^[a-z][a-z0-9-]{0,31}$/u;
const DRAG_THRESHOLD = 4;
const EDGE = 32;

const MESSAGES = {
  ru: {
    instructions: 'Пробел или Enter — взять, стрелки — переместить, Пробел или Enter — положить, Escape — отменить.',
    picked: 'Взято: {item}. Позиция {index} из {total} в «{list}».',
    moved: 'Позиция {index} из {total} в «{list}».',
    dropped: 'Положено: {item}, позиция {index} в «{list}».',
    cancelled: 'Перемещение отменено.',
    target: 'Цель: {target}.',
  },
  en: {
    instructions: 'Space or Enter to pick up, arrows to move, Space or Enter to drop, Escape to cancel.',
    picked: 'Picked up {item}. Position {index} of {total} in “{list}”.',
    moved: 'Position {index} of {total} in “{list}”.',
    dropped: 'Dropped {item} at position {index} in “{list}”.',
    cancelled: 'Move cancelled.',
    target: 'Target: {target}.',
  },
};

const format = (template, values) => template.replace(/\{(\w+)\}/gu, (_, key) => String(values[key] ?? ''));
// In the page's language through pageText, as every component's words are;
// <html lang> alone left SF.language.use() unheard (documentation trial).
const messages = () => Object.fromEntries(Object.keys(MESSAGES.en).map((key) => [key, (0,_page_language_js__WEBPACK_IMPORTED_MODULE_0__.pageText)(MESSAGES, key, undefined, 'sf-sortable')]));
// Separate Smart bundles (sf-sortable, sf-composition-overlay) each carry a copy
// of this module; the drag session and external targets live on one global
// record so a library drag can land on the overlay. The key carries the record
// version, so bundles with another record shape never share it.
const shared = globalThis.__sfSortableSharedV1 || (globalThis.__sfSortableSharedV1 = { targets: new Set(), session: null });
const externalTargets = shared.targets;

/** The active drag session (read-only view), or null. */
function activeSortableSession() {
  return shared.session ? Object.freeze({ item: shared.session.item, from: shared.session.from, group: shared.session.group, mode: shared.session.mode, input: shared.session.input }) : null;
}

/**
 * Registers a non-list drop target such as the editor overlay.
 * resolve(x, y, session) returns {descriptor, rect, label} or null;
 * drop(session, descriptor) performs the intent emission.
 */
function registerSortableDropTarget(target) {
  if (!target || typeof target.resolve !== 'function' || typeof target.drop !== 'function') throw new TypeError('Drop target needs resolve and drop');
  externalTargets.add(target);
  return () => externalTargets.delete(target);
}

// Visible text of an item without decorative (aria-hidden) parts.
function itemLabel(item) {
  if (item.getAttribute('aria-label')) return item.getAttribute('aria-label');
  const clone = item.cloneNode(true);
  for (const hidden of clone.querySelectorAll('[aria-hidden="true"]')) hidden.remove();
  return clone.textContent.replace(/\s+/gu, ' ').trim();
}

function listName(list) {
  return list.getAttribute('label') || list.getAttribute('aria-label') || list.getAttribute('group') || '';
}

function items(list) {
  return [...list.querySelectorAll(ITEM)].filter((item) => item.closest('sf-sortable') === list);
}

function accepts(list, group) {
  if (!list || list.getAttribute('mode') === 'copy') return false;
  const own = list.getAttribute('group');
  const extra = (list.getAttribute('accepts') || '').split(/\s+/u).filter(Boolean);
  return group === own || extra.includes(group);
}

function scrollContainer(element) {
  for (let node = element?.parentElement; node; node = node.parentElement) {
    const style = globalThis.getComputedStyle(node);
    if (/(auto|scroll)/u.test(style.overflowY) && node.scrollHeight > node.clientHeight) return node;
  }
  return globalThis.document.scrollingElement;
}

function indicator() {
  let line = globalThis.document.querySelector('.sf-sortable-indicator');
  if (!line) {
    line = globalThis.document.createElement('div');
    line.className = 'sf-sortable-indicator';
    line.setAttribute('aria-hidden', 'true');
    globalThis.document.body.append(line);
  }
  return line;
}

function showIndicator(rect) {
  const line = indicator();
  if (!rect) {
    line.hidden = true;
    return;
  }
  line.hidden = false;
  Object.assign(line.style, { left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px` });
}

// The silhouette: while a pointer drags, the place the item would take opens in
// the list as an empty outline of its size, and the list moves to make room --
// a line two pixels thick said where, but not how the list would look, and the
// owner could not tell where a row would land before letting go (2026-10-13).
// The item itself leaves the flow while it is dragged; its copy follows the
// pointer. A list that wraps into a grid opens the place among its cells, in
// reading order (owner, 2026-10-14: the fields of a record view arranged in two
// columns moved with a line nobody could follow). Keyboard moves, external
// targets and a list written preview="line" keep the line.
function silhouetteFor(list) {
  return list.getAttribute('preview') !== 'line';
}

function placeholder(session) {
  if (session.placeholder) return session.placeholder;
  const box = session.sourceBox;
  const element = globalThis.document.createElement('div');
  element.className = 'sf-sortable-placeholder';
  element.setAttribute('aria-hidden', 'true');
  Object.assign(element.style, { inlineSize: `${box.width}px`, blockSize: `${box.height}px` });
  session.placeholder = element;
  return element;
}

// Where the outline goes, and the final index it stands for: counted among the
// items still in the flow -- not the dragged one -- so it is the index the item
// will have once it is moved.
function placeSilhouette(session, list, x, y) {
  const horizontal = list.getAttribute('orientation') === 'horizontal';
  const visible = items(list).filter((item) => item !== session.source);
  // A grid is read row by row; the outline is one of its cells. Whether the
  // list wraps is asked of the items left in the flow, the dragged one being
  // out of it, or remembered from when the drag began.
  const wrapped = !horizontal && (isWrapped(visible) || session.wrappedLists?.has(list));
  let index;
  if (wrapped) {
    index = wrappedIndexAt(visible, x, y);
  } else {
    const boxes = visible.map((item) => {
      const box = item.getBoundingClientRect();
      return horizontal ? { start: box.left, end: box.right } : { start: box.top, end: box.bottom };
    });
    index = sortableIndexAt(boxes, horizontal ? x : y);
  }
  const element = placeholder(session);
  const before = visible[index];
  if (before) {
    if (element.nextElementSibling !== before) before.before(element);
  } else if (visible.length) {
    const last = visible[visible.length - 1];
    if (last.nextElementSibling !== element) last.after(element);
  } else if (element.parentElement !== list) {
    list.append(element);
  }
  return index;
}

/** Index where an item would land in a list for a pointer position. */
function sortableIndexAt(boxes, coordinate, exclude = -1) {
  let index = 0;
  for (let position = 0; position < boxes.length; position += 1) {
    if (position === exclude) continue;
    const box = boxes[position];
    if (coordinate > box.start + (box.end - box.start) / 2) index = position + 1;
  }
  return index;
}

/**
 * Whether the list flows in both axes -- two items standing side by side on one
 * row. A list like that is neither vertical nor horizontal, and asking only the
 * vertical axis cannot tell the left half of a row from the right half.
 */
function isWrapped(all) {
  for (let position = 1; position < all.length; position += 1) {
    const previous = all[position - 1].getBoundingClientRect();
    const current = all[position].getBoundingClientRect();
    if (current.top < previous.bottom - 1 && current.left >= previous.right - 1) return true;
  }
  return false;
}

/** Index where an item would land in a list that wraps, in reading order. */
function wrappedIndexAt(all, x, y) {
  let index = 0;
  for (let position = 0; position < all.length; position += 1) {
    const box = all[position].getBoundingClientRect();
    const past = y > box.bottom ? true : y < box.top ? false : x > box.left + box.width / 2;
    if (past) index = position + 1;
  }
  return index;
}

function listTarget(list, x, y) {
  const all = items(list);
  const horizontal = list.getAttribute('orientation') === 'horizontal';
  if (!horizontal && isWrapped(all)) {
    const index = wrappedIndexAt(all, x, y);
    return { list, index, rect: wrappedIndicatorRect(list, all, index) };
  }
  const boxes = all.map((item) => {
    const box = item.getBoundingClientRect();
    return horizontal ? { start: box.left, end: box.right } : { start: box.top, end: box.bottom };
  });
  const index = sortableIndexAt(boxes, horizontal ? x : y);
  return { list, index, rect: listIndicatorRect(list, all, index, horizontal) };
}

/**
 * A line down the side of the place the item would take, not across the whole
 * row: in a two-column list a full-width line cannot say which of the two halves
 * the item is about to land in.
 */
function wrappedIndicatorRect(list, all, index) {
  const box = list.getBoundingClientRect();
  const before = all[index];
  const after = all[index - 1];
  if (before) {
    const target = before.getBoundingClientRect();
    return { left: target.left - 1, top: target.top, width: 2, height: target.height };
  }
  if (after) {
    const target = after.getBoundingClientRect();
    return { left: target.right - 1, top: target.top, width: 2, height: target.height };
  }
  return { left: box.left, top: box.top, width: 2, height: box.height };
}

function listIndicatorRect(list, all, index, horizontal) {
  const box = list.getBoundingClientRect();
  const before = all[index];
  const after = all[index - 1];
  if (horizontal) {
    const x = before ? before.getBoundingClientRect().left : after ? after.getBoundingClientRect().right : box.left;
    return { left: x - 1, top: box.top, width: 2, height: box.height };
  }
  const y = before ? before.getBoundingClientRect().top : after ? after.getBoundingClientRect().bottom : box.top;
  return { left: box.left, top: y - 1, width: box.width, height: 2 };
}

// An sf-sortable list sends the new name and its aliases.json sends the old
// one after it; a container the column mode attached to, or a list defined
// without its manifest, sends both here.
function emitIntent(target, detail) {
  const frozen = Object.freeze(detail);
  target.dispatchEvent(new globalThis.CustomEvent(SORTABLE_MOVE_EVENT, { bubbles: true, composed: true, detail: frozen }));
  if (!target.__sfAliases) target.dispatchEvent(new globalThis.CustomEvent(SORTABLE_INTENT_EVENT, { bubbles: true, composed: true, detail: frozen }));
}

// A keyboard move ends with the person's focus on the item they moved. The
// host applies the intent by redrawing its list, and a redraw that replaces
// the dragged element drops focus to the body: the keyboard user lost their
// place in the page and had to tab back from the top (consumer case
// ui-mail.sortable-editor-recipe, 2026-10-21). Two frames after the drop --
// the host has redrawn by then -- the item with the same id takes focus back,
// in whichever list it landed. A host that restores focus itself keeps it:
// focus is only moved when it fell to the body or out of the document.
function restoreFocusAfterDrop(ended) {
  const document_ = globalThis.document;
  const id = ended.item;
  if (!id || !document_) return;
  const place = () => {
    const active = document_.activeElement;
    if (active && active !== document_.body && document_.contains(active)) return;
    const scope = ended.list && document_.contains(ended.list) ? ended.list : document_;
    const item = scope.querySelector(`[data-sf-sortable-item="${globalThis.CSS?.escape ? globalThis.CSS.escape(id) : id}"]`);
    item?.focus?.({ preventScroll: false });
  };
  if (typeof globalThis.requestAnimationFrame !== 'function') { place(); return; }
  globalThis.requestAnimationFrame(() => globalThis.requestAnimationFrame(place));
}

function finish(list, reason) {
  if (!shared.session) return;
  const ended = shared.session;
  shared.session = null;
  ended.cleanup?.abort();
  if (ended.scrollFrame) globalThis.cancelAnimationFrame(ended.scrollFrame);
  ended.source?.removeAttribute('data-sf-sortable-dragging');
  ended.source?.removeAttribute('data-sf-sortable-lifted');
  ended.placeholder?.remove();
  ended.ghost?.remove();
  showIndicator(null);
  for (const target of externalTargets) target.leave?.();
  globalThis.document.documentElement.removeAttribute('data-sf-sortable-active');
  list.dispatchEvent(new globalThis.CustomEvent(SORTABLE_STATE_EVENT, { bubbles: true, composed: true, detail: Object.freeze({ state: reason, item: ended.item }) }));
  if (reason === 'dropped' && ended.input === 'keyboard') restoreFocusAfterDrop(ended);
}

// base: the class made from sf-sortable's component.json (manifest-host.mjs);
// without it the list is a plain element, as the overlay's bundle defines it.
function defineSortable(registry = globalThis.customElements, { base = null } = {}) {
  if (!registry || typeof globalThis.HTMLElement !== 'function') return null;
  const existing = registry.get('sf-sortable');
  if (existing) return existing;

  class SfSortable extends (base || globalThis.HTMLElement) {
    constructor() {
      super();
      this.connection = null;
      this.live = null;
      this.instructions = null;
    }

    connectedCallback() {
      super.connectedCallback?.();
      if (this.connection) return;
      this.connection = new AbortController();
      const options = { signal: this.connection.signal };
      if (!this.live) {
        this.live = globalThis.document.createElement('div');
        this.live.className = 'sf-sortable-live';
        // Pick-up, move and drop are routine steps the person caused; polite
        // waits for the reader instead of cutting across what it was saying.
        this.live.setAttribute('aria-live', 'polite');
        this.instructions = globalThis.document.createElement('div');
        this.instructions.className = 'sf-sortable-live';
        this.instructions.id = `sf-sortable-help-${Math.random().toString(36).slice(2, 10)}`;
      }
      this.instructions.textContent = messages().instructions;
      this.append(this.live, this.instructions);
      this.addEventListener('pointerdown', (event) => this.onPointerDown(event), options);
      this.addEventListener('keydown', (event) => this.onKeyDown(event), options);
      this.addEventListener('focusin', (event) => this.prepareItem(event.target.closest?.(ITEM)), options);
      for (const item of items(this)) this.prepareItem(item);
      // Items the host adds later become focusable and draggable as well.
      this.observer = new globalThis.MutationObserver(() => { this.ensureAccessibilityNodes(); for (const item of items(this)) this.prepareItem(item); });
      this.observer.observe(this, { childList: true, subtree: true });
      this.setAttribute('data-sf-sortable', 'connected');
    }

    disconnectedCallback() {
      super.disconnectedCallback?.();
      this.observer?.disconnect();
      this.observer = null;
      this.connection?.abort();
      this.connection = null;
      if (shared.session?.fromList === this || shared.session?.list === this) finish(this, 'cancelled');
      this.setAttribute('data-sf-sortable', 'disposed');
    }

    prepareItem(item) {
      if (!item || item.closest('sf-sortable') !== this) return;
      if (!item.hasAttribute('tabindex') && !item.matches(INTERACTIVE)) item.tabIndex = 0;
      const described = (item.getAttribute('aria-describedby') || '').split(/\s+/u);
      if (this.instructions && !described.includes(this.instructions.id)) item.setAttribute('aria-describedby', [...described.filter(Boolean), this.instructions.id].join(' '));
      if (!item.querySelector(HANDLE)) item.style.touchAction = 'none';
    }

    // The list keeps its live region and its instructions among its own
    // children, so a host that redraws the list with replaceChildren() takes
    // them out: announcements then went to a detached node, and items said
    // nothing (consumer case ui-mail.sortable-editor-recipe, 2026-10-21). The
    // component owns these two nodes and puts them back, with the same
    // instructions id the items point at through aria-describedby.
    ensureAccessibilityNodes() {
      if (!this.live || !this.instructions) return;
      if (this.live.parentNode === this && this.instructions.parentNode === this) return;
      this.instructions.textContent = messages().instructions;
      this.append(this.live, this.instructions);
    }

    announce(text) {
      this.ensureAccessibilityNodes();
      if (this.live) this.live.textContent = text;
    }

    get group() {
      const value = this.getAttribute('group') || '';
      return NAME.test(value) ? value : '';
    }

    get mode() {
      return this.getAttribute('mode') === 'copy' ? 'copy' : 'move';
    }

    begin(item, input) {
      const id = item.getAttribute('data-sf-sortable-item');
      if (!id || !this.group || shared.session) return false;
      const all = items(this);
      const sourceBox = item.getBoundingClientRect();
      shared.session = {
        sourceBox,
        item: id, from: this.getAttribute('id') || this.group, group: this.group, mode: this.mode, input,
        source: item, fromList: this, sourceIndex: all.indexOf(item), list: this.mode === 'copy' ? null : this,
        index: all.indexOf(item), external: null, cleanup: new AbortController(),
      };
      item.setAttribute('data-sf-sortable-dragging', '');
      globalThis.document.documentElement.setAttribute('data-sf-sortable-active', '');
      this.dispatchEvent(new globalThis.CustomEvent(SORTABLE_STATE_EVENT, { bubbles: true, composed: true, detail: Object.freeze({ state: 'picked', item: id }) }));
      return true;
    }

    // Pointer path ---------------------------------------------------------
    onPointerDown(event) {
      if (event.button !== 0 || shared.session) return;
      const item = event.target.closest?.(ITEM);
      if (!item || item.closest('sf-sortable') !== this) return;
      const handle = item.querySelector(HANDLE);
      if (handle && !handle.contains(event.target)) return;
      if (!handle && event.target.closest(INTERACTIVE) && event.target.closest(INTERACTIVE) !== item) return;
      const start = { x: event.clientX, y: event.clientY };
      const pointer = event.pointerId;
      let started = false;
      const pending = new AbortController();
      const move = (moveEvent) => {
        if (moveEvent.pointerId !== pointer) return;
        if (!started) {
          if (Math.hypot(moveEvent.clientX - start.x, moveEvent.clientY - start.y) < DRAG_THRESHOLD) return;
          if (!this.begin(item, moveEvent.pointerType || 'mouse')) { pending.abort(); return; }
          started = true;
          item.setPointerCapture?.(pointer);
          shared.session.ghost = this.ghost(item, moveEvent);
          // The item leaves the flow only once its copy is on screen; a copy
          // library (mode copy) keeps its item where it is.
          if (silhouetteFor(this) && this.mode !== 'copy') {
            shared.session.silhouette = true;
            // Asked before the item leaves the flow: with it gone, a grid of
            // two cells is one cell and does not look like a grid.
            shared.session.wrappedLists = new Set(isWrapped(items(this)) ? [this] : []);
            item.setAttribute('data-sf-sortable-lifted', '');
            this.retarget(moveEvent.clientX, moveEvent.clientY);
          }
        }
        moveEvent.preventDefault();
        this.track(moveEvent.clientX, moveEvent.clientY);
      };
      const up = (upEvent) => {
        if (upEvent.pointerId !== pointer) return;
        pending.abort();
        if (started) this.drop();
      };
      const cancel = () => {
        pending.abort();
        if (started) finish(this, 'cancelled');
      };
      globalThis.addEventListener('pointermove', move, { signal: pending.signal, passive: false });
      globalThis.addEventListener('pointerup', up, { signal: pending.signal });
      globalThis.addEventListener('pointercancel', cancel, { signal: pending.signal });
      // Capture phase: cancel the drag before page-level Escape handlers run.
      globalThis.addEventListener('keydown', (keyEvent) => { if (keyEvent.key === 'Escape' && started) { keyEvent.preventDefault(); keyEvent.stopPropagation(); cancel(); } }, { signal: pending.signal, capture: true });
    }

    ghost(item, event) {
      const box = item.getBoundingClientRect();
      const ghost = item.cloneNode(true);
      ghost.removeAttribute('id');
      for (const element of ghost.querySelectorAll('[id]')) element.removeAttribute('id');
      ghost.classList.add('sf-sortable-ghost');
      ghost.setAttribute('aria-hidden', 'true');
      ghost.inert = true;
      Object.assign(ghost.style, { width: `${box.width}px`, left: `${box.left}px`, top: `${box.top}px` });
      shared.session.offset = { x: event.clientX - box.left, y: event.clientY - box.top };
      globalThis.document.body.append(ghost);
      return ghost;
    }

    track(x, y) {
      if (!shared.session) return;
      shared.session.pointer = { x, y };
      if (shared.session.ghost) Object.assign(shared.session.ghost.style, { left: `${x - shared.session.offset.x}px`, top: `${y - shared.session.offset.y}px` });
      this.retarget(x, y);
      this.startAutoScroll();
    }

    retarget(x, y) {
      const under = globalThis.document.elementFromPoint(x, y);
      const list = under?.closest?.('sf-sortable');
      for (const target of externalTargets) {
        const resolved = target.resolve(x, y, activeSortableSession());
        if (resolved) {
          shared.session.list = null;
          shared.session.external = { target, ...resolved };
          showIndicator(resolved.rect);
          return;
        }
      }
      shared.session.external = null;
      if (list && accepts(list, shared.session.group)
          && shared.session.silhouette && silhouetteFor(list)) {
        shared.session.list = list;
        shared.session.index = placeSilhouette(shared.session, list, x, y);
        showIndicator(null);
        return;
      }
      shared.session.placeholder?.remove();
      if (list && accepts(list, shared.session.group)) {
        const resolved = listTarget(list, x, y);
        shared.session.list = list;
        // Store the final index: positions after the source shift by one.
        shared.session.index = list === shared.session.fromList && shared.session.mode === 'move' && resolved.index > shared.session.sourceIndex ? resolved.index - 1 : resolved.index;
        showIndicator(resolved.rect);
      } else {
        shared.session.list = null;
        showIndicator(null);
      }
    }

    // Scrolls the nearest scroll container every frame while the pointer
    // stays in its edge zone, including when the pointer is held still.
    startAutoScroll() {
      if (!shared.session || shared.session.scrollFrame) return;
      const step = () => {
        if (!shared.session?.pointer) return;
        shared.session.scrollFrame = 0;
        const { x, y } = shared.session.pointer;
        const container = scrollContainer(globalThis.document.elementFromPoint(x, y));
        if (!container) return;
        const box = container === globalThis.document.scrollingElement
          ? { top: 0, bottom: globalThis.innerHeight }
          : container.getBoundingClientRect();
        const max = container.scrollHeight - container.clientHeight;
        let delta = 0;
        if (y < box.top + EDGE && container.scrollTop > 0) delta = -Math.ceil((box.top + EDGE - y) / 4);
        else if (y > box.bottom - EDGE && container.scrollTop < max) delta = Math.ceil((y - box.bottom + EDGE) / 4);
        if (delta) {
          // Instant even under scroll-behavior: smooth, so every frame advances.
          container.scrollBy({ top: delta, behavior: 'instant' });
          this.retarget(x, y);
          shared.session.scrollFrame = globalThis.requestAnimationFrame(step);
        }
      };
      shared.session.scrollFrame = globalThis.requestAnimationFrame(step);
    }

    drop() {
      if (!shared.session) return;
      const current = shared.session;
      if (current.external) {
        current.external.target.drop(activeSortableSession(), current.external.descriptor);
        finish(this, 'dropped');
        return;
      }
      if (current.list) {
        const index = current.index;
        const unchanged = current.list === current.fromList && index === current.sourceIndex;
        if (!unchanged) {
          emitIntent(current.list, {
            item: current.item, from: current.from, to: current.list.getAttribute('id') || current.list.group,
            index, mode: current.mode,
          });
          current.list.announce?.(format(messages().dropped, { item: itemLabel(current.source), index: index + 1, list: listName(current.list) }));
          finish(this, 'dropped');
          return;
        }
      }
      finish(this, 'cancelled');
    }

    // Keyboard path --------------------------------------------------------
    keyboardTargets() {
      return [...globalThis.document.querySelectorAll('sf-sortable')].filter((list) => list === shared.session?.fromList ? shared.session.mode === 'move' : accepts(list, shared.session?.group));
    }

    describeKeyboard(announce = true) {
      if (!shared.session) return;
      if (shared.session.external) {
        showIndicator(shared.session.external.rect);
        if (announce) this.announce(format(messages().target, { target: shared.session.external.label || '' }));
        return;
      }
      const list = shared.session.list;
      const full = items(list);
      const sameList = list === shared.session.fromList && shared.session.mode === 'move';
      const positions = full.length + (sameList ? 0 : 1);
      const physical = sameList && shared.session.index > shared.session.sourceIndex ? shared.session.index + 1 : shared.session.index;
      showIndicator(listIndicatorRect(list, full, Math.min(physical, full.length), list.getAttribute('orientation') === 'horizontal'));
      if (announce) this.announce(format(messages().moved, { index: shared.session.index + 1, total: positions, list: listName(list) }));
    }

    onKeyDown(event) {
      const item = event.target.closest?.(ITEM);
      if (!shared.session) {
        if (!item || item.closest('sf-sortable') !== this || event.target !== item) return;
        if (event.key !== ' ' && event.key !== 'Enter') return;
        event.preventDefault();
        if (!this.begin(item, 'keyboard')) return;
        // An abandoned keyboard move is cancelled when focus or a click leaves the list.
        const abandon = () => { if (shared.session?.fromList === this) { this.announce(messages().cancelled); finish(this, 'cancelled'); } };
        const cleanup = { signal: shared.session.cleanup.signal };
        this.addEventListener('focusout', (focusEvent) => {
          if (focusEvent.relatedTarget && this.contains(focusEvent.relatedTarget)) return;
          globalThis.setTimeout(() => { if (!this.contains(globalThis.document.activeElement)) abandon(); }, 0);
        }, cleanup);
        globalThis.document.addEventListener('pointerdown', (pointerEvent) => { if (!this.contains(pointerEvent.target)) abandon(); }, { ...cleanup, capture: true });
        if (shared.session.mode === 'copy') {
          const [first] = this.keyboardTargets();
          const external = [...externalTargets].flatMap((target) => (target.keyboardTargets?.(activeSortableSession()) || []).map((entry) => ({ target, ...entry })));
          if (first) {
            shared.session.list = first;
            shared.session.index = items(first).length;
          } else if (external.length) {
            shared.session.external = external[0];
          } else {
            finish(this, 'cancelled');
            return;
          }
        }
        if (shared.session.external) {
          this.describeKeyboard(false);
          this.announce(`${format(messages().picked, { item: itemLabel(item), index: 1, total: 1, list: '' }).split('.')[0]}. ${format(messages().target, { target: shared.session.external.label || '' })}`);
          return;
        }
        const all = items(shared.session.list);
        this.describeKeyboard(false);
        this.announce(format(messages().picked, { item: itemLabel(item), index: shared.session.index + 1, total: all.length, list: listName(shared.session.list) }));
        return;
      }
      if (shared.session.input !== 'keyboard' || shared.session.fromList !== this) return;
      const lists = this.keyboardTargets();
      const external = [...externalTargets].flatMap((target) => (target.keyboardTargets?.(activeSortableSession()) || []).map((entry) => ({ target, ...entry })));
      if (event.key === 'Escape' || event.key === 'Tab') {
        if (event.key === 'Escape') event.preventDefault();
        this.announce(messages().cancelled);
        finish(this, 'cancelled');
        return;
      }
      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();
        this.drop();
        return;
      }
      const vertical = { ArrowUp: -1, ArrowDown: 1 }[event.key];
      const across = { ArrowLeft: -1, ArrowRight: 1 }[event.key];
      if (vertical === undefined && across === undefined) return;
      event.preventDefault();
      if (shared.session.external) {
        const position = external.findIndex((entry) => entry.target === shared.session.external.target && JSON.stringify(entry.descriptor) === JSON.stringify(shared.session.external.descriptor));
        const next = external[position + (vertical ?? across)];
        if (next) shared.session.external = next;
        else if ((vertical ?? across) < 0 && lists.length) {
          shared.session.external = null;
          shared.session.list = lists.at(-1);
          shared.session.index = items(shared.session.list).length - (shared.session.list === shared.session.fromList && shared.session.mode === 'move' ? 1 : 0);
        }
        this.describeKeyboard();
        return;
      }
      const list = shared.session.list;
      const count = items(list).length - (list === shared.session.fromList && shared.session.mode === 'move' ? 1 : 0);
      if (vertical !== undefined) {
        const next = shared.session.index + vertical;
        if (next >= 0 && next <= count) shared.session.index = next;
        else if (next > count && across === undefined && external.length && lists.indexOf(list) === lists.length - 1) shared.session.external = external[0];
      } else {
        const next = lists[lists.indexOf(list) + across];
        if (next) {
          shared.session.list = next;
          shared.session.index = Math.min(shared.session.index, items(next).length - (next === shared.session.fromList && shared.session.mode === 'move' ? 1 : 0));
        } else if (across > 0 && external.length) {
          shared.session.external = external[0];
        }
      }
      this.describeKeyboard();
    }
  }

  registry.define('sf-sortable', SfSortable);
  return SfSortable;
}

/**
 * sf-sortable's pointer behaviour on any container, without the element: a
 * table's head row cannot hold a custom element around its cells, and its
 * columns move with every cell under them (owner, 2026-10-13). The container
 * keeps its markup; the controller listens on it.
 *
 * options:
 *   items        selector of the movable children (required)
 *   canStart     (event, item) => boolean -- a press that may begin a drag
 *   groupOf      (item) => string -- an item moves among items of its group
 *   preview      'column' (default) | 'line'
 *   extent       the element a column spans (a table); default the container
 *   cellsOf      (item) => elements to mark as the moving column (its cells)
 *   label        the list's name for the announcement
 *   onIntent     ({item, from, index, group}) -- index among the group's items
 *                without the dragged one, the place it is to take
 * Returns detach().
 *
 * Keyboard reordering stays where a list is: a table's column settings are an
 * sf-sortable list with every key path. A click that ends a drag is swallowed,
 * so a heading that sorts on click does not sort on a drop.
 */
function attachSortable(container, options = {}) {
  if (!(container instanceof globalThis.Element) || typeof options.items !== 'string') {
    throw new TypeError('attachSortable needs a container and an items selector');
  }
  const doc = globalThis.document;
  const preview = options.preview === 'line' ? 'line' : 'column';
  const groupOf = typeof options.groupOf === 'function' ? options.groupOf : () => '';
  const canStart = typeof options.canStart === 'function' ? options.canStart : () => true;
  const cellsOf = typeof options.cellsOf === 'function' ? options.cellsOf : (item) => [item];
  const extentOf = () => options.extent?.isConnected ? options.extent : container;
  const live = doc.createElement('div');
  live.className = 'sf-sortable-live';
  live.setAttribute('aria-live', 'polite');
  doc.body.append(live);
  const abort = new AbortController();
  let session = null;

  const members = (group) => [...container.querySelectorAll(options.items)].filter((item) => groupOf(item) === group);
  const outline = () => {
    if (session.outline) return session.outline;
    const box = doc.createElement('div');
    box.className = preview === 'column' ? 'sf-sortable-column-outline' : 'sf-sortable-indicator';
    box.setAttribute('aria-hidden', 'true');
    doc.body.append(box);
    session.outline = box;
    return box;
  };

  const place = (x) => {
    const peers = members(session.group).filter((item) => item !== session.item);
    const boxes = peers.map((item) => item.getBoundingClientRect());
    let index = boxes.length;
    for (let at = 0; at < boxes.length; at += 1) {
      if (x < boxes[at].left + boxes[at].width / 2) { index = at; break; }
    }
    session.index = index;
    const extent = extentOf().getBoundingClientRect();
    const width = session.width;
    const before = boxes[index];
    const after = boxes[index - 1];
    let left;
    if (preview === 'column') {
      // The outline stands where the column will be. Moving towards the start
      // it takes the place of the column it goes before (that one moves on);
      // moving towards the end it ends where the column it goes after ends.
      if (index > session.originalIndex && after) left = after.right - width;
      else left = before ? before.left : (after ? after.right - width : extent.left);
    } else {
      left = (before ? before.left : after ? after.right : extent.left) - 1;
    }
    Object.assign(outline().style, {
      left: `${left}px`, top: `${extent.top}px`,
      width: preview === 'column' ? `${width}px` : '2px', height: `${extent.height}px`,
    });
  };

  const autoScroll = (x) => {
    for (let node = container.parentElement; node; node = node.parentElement) {
      const style = globalThis.getComputedStyle(node);
      if (!/(auto|scroll)/u.test(style.overflowX) || node.scrollWidth <= node.clientWidth) continue;
      const box = node.getBoundingClientRect();
      if (x < box.left + EDGE) node.scrollBy({left: -Math.ceil((box.left + EDGE - x) / 4), behavior: 'instant'});
      else if (x > box.right - EDGE) node.scrollBy({left: Math.ceil((x - box.right + EDGE) / 4), behavior: 'instant'});
      return;
    }
  };

  const end = (dropped) => {
    const ended = session;
    session = null;
    if (!ended) return;
    ended.pending.abort();
    ended.ghost?.remove();
    ended.outline?.remove();
    for (const cell of ended.cells) cell.removeAttribute('data-sf-sortable-column-source');
    doc.documentElement.removeAttribute('data-sf-sortable-active');
    if (!ended.started) return;
    // The click a drop ends with is not a click on the heading. It comes in the
    // same task as the pointerup, so the guard is gone by the next one and a
    // later click is a click again.
    const swallow = (event) => { event.preventDefault(); event.stopImmediatePropagation(); };
    container.addEventListener('click', swallow, {capture: true, once: true});
    globalThis.setTimeout(() => container.removeEventListener('click', swallow, {capture: true}), 0);
    if (!dropped) {
      live.textContent = messages().cancelled;
      return;
    }
    if (ended.index === undefined || ended.index === ended.originalIndex) return;
    const id = ended.item.getAttribute('data-sf-sortable-item') || ended.item.dataset.key || '';
    live.textContent = format(messages().dropped, {item: itemLabel(ended.item), index: ended.index + 1, list: options.label || ''});
    options.onIntent?.({item: id, from: ended.group, index: ended.index, group: ended.group});
  };

  container.addEventListener('pointerdown', (event) => {
    if (event.button !== 0 || session || shared.session) return;
    const item = event.target.closest?.(options.items);
    if (!item || !container.contains(item) || !canStart(event, item)) return;
    const group = groupOf(item);
    const peers = members(group);
    if (peers.length < 2) return;
    const start = {x: event.clientX, y: event.clientY};
    const pending = new AbortController();
    const box = item.getBoundingClientRect();
    session = {item, group, pending, started: false, cells: [], width: box.width, originalIndex: peers.indexOf(item)};
    const move = (moveEvent) => {
      if (moveEvent.pointerId !== event.pointerId || !session) return;
      if (!session.started) {
        if (Math.hypot(moveEvent.clientX - start.x, moveEvent.clientY - start.y) < DRAG_THRESHOLD) return;
        session.started = true;
        doc.documentElement.setAttribute('data-sf-sortable-active', '');
        const ghost = item.cloneNode(true);
        ghost.removeAttribute('id');
        for (const element of ghost.querySelectorAll('[id]')) element.removeAttribute('id');
        ghost.classList.add('sf-sortable-ghost');
        ghost.setAttribute('aria-hidden', 'true');
        ghost.inert = true;
        Object.assign(ghost.style, {width: `${box.width}px`, height: `${box.height}px`, left: `${box.left}px`, top: `${box.top}px`});
        doc.body.append(ghost);
        session.ghost = ghost;
        session.offset = {x: start.x - box.left, y: start.y - box.top};
        session.cells = cellsOf(item).filter(Boolean);
        for (const cell of session.cells) cell.setAttribute('data-sf-sortable-column-source', '');
      }
      moveEvent.preventDefault();
      Object.assign(session.ghost.style, {left: `${moveEvent.clientX - session.offset.x}px`, top: `${moveEvent.clientY - session.offset.y}px`});
      autoScroll(moveEvent.clientX);
      place(moveEvent.clientX);
    };
    globalThis.addEventListener('pointermove', move, {signal: pending.signal, passive: false});
    globalThis.addEventListener('pointerup', (upEvent) => { if (upEvent.pointerId === event.pointerId) end(true); }, {signal: pending.signal});
    globalThis.addEventListener('pointercancel', () => end(false), {signal: pending.signal});
    globalThis.addEventListener('keydown', (keyEvent) => {
      if (keyEvent.key === 'Escape' && session?.started) { keyEvent.preventDefault(); keyEvent.stopPropagation(); end(false); }
    }, {signal: pending.signal, capture: true});
  }, {signal: abort.signal});

  return () => {
    end(false);
    abort.abort();
    live.remove();
  };
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ SORTABLE_MOVE_EVENT, activeSortableSession, attachSortable, defineSortable, registerSortableDropTarget, sortableIndexAt });

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "4fe3d0c72eda"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-composition-overlay for the shim (stands/18-aliases-ci/alias.mjs, standard §16 item 20). mode: same-detail (the shim sends the new and the old name), split / detail-adds (a detail adapter, refused by the shim), attribute-and-property, method, property, manifest-only (the DOM name does not change), host-attribute (no shim), retired.","component":"sf-composition-overlay","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"sf-composition-overlay-action","to":"sf-composition-overlay-apply","kind":"event","component":"sf-composition-overlay","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":false,"manifest":{"from":"sf-composition-overlay-action","to":"apply"},"section":"§8, vocabulary 1.1.5","note":"the old detail {action_id, node_id} is made by the element\'s adapter"},{"from":"sf-composition-overlay-edit","to":"sf-composition-overlay-change","kind":"event","component":"sf-composition-overlay","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":true,"manifest":{"from":"sf-composition-overlay-edit","to":"change"},"section":"§8, vocabulary 1.1.5","note":"the old detail {node_id, value, previous} is made by the element\'s adapter; the cancel is shared"},{"from":"sf-composition-overlay-select","to":"select","kind":"event","component":"sf-composition-overlay","since":"2026-10-27","remove_after":"2026-12-01","mode":"manifest-only","note":"the DOM name is unchanged; the detail adds ids and id beside node_id"},{"from":"sf-composition-overlay-move","to":"move","kind":"event","component":"sf-composition-overlay","since":"2026-10-27","remove_after":"2026-12-01","mode":"manifest-only","note":"the DOM name is unchanged; the detail adds ids, id, parent and position beside node_id, parent_id and index"},{"from":"sf-composition-overlay-insert","to":"insert","kind":"event","component":"sf-composition-overlay","since":"2026-10-27","remove_after":"2026-12-01","mode":"manifest-only","note":"the manifest declares the verb; the DOM name is unchanged; the detail adds parent beside parent_id"}]}');

/***/ },

/***/ "323a38a1c20d"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.composition-overlay","tag":"sf-composition-overlay","version":"1.2.5","kind":"leaf","settings":{"for":{"type":"string","default":""},"frame":{"type":"string","default":""},"accepts":{"type":"string","default":""},"label":{"type":"string","default":""},"actions":{"type":"list","default":[],"of":{"id":"string","label":"string"}},"messages":{"type":"object","default":{}},"insertion-target":{"type":"object","default":{}}},"values":{},"events":{"select":{"carries":{"ids":"list","id":{"type":"id","nullable":true},"node_id":{"type":"id","nullable":true}}},"apply":{"carries":{"action":"string","scope":{"type":"enum","values":["entry"]},"ids":{"type":"list","schema":{"items":{"type":"string"}}}}},"insert":{"carries":{"parent":"id","slot":"string","index":{"type":"number","integer":true},"item":{"type":"string","optional":true},"from":{"type":"string","optional":true},"mode":{"type":"enum","values":["move","copy"],"optional":true},"parent_id":{"type":"id"}},"own-verb":true},"move":{"carries":{"ids":"list","id":"id","parent":"id","position":"number","slot":"string","node_id":{"type":"id"},"parent_id":{"type":"id"},"index":{"type":"number","integer":true}}},"change":{"carries":{"id":"id","value":"string","previous":"string"},"cancelable":true,"x-native":false}},"actions":{"attach":{"with":{"canvas":"object"}},"attach-frame":{"with":{"iframe":"object"}},"set-document":{"with":{"document":"object","options":"object"}},"set-nodes":{"with":{"nodes":{"type":"list","of":{"id":"id","kind":"string","label":"string","parent":"id","editable":"boolean","rect":"object","element":"object"}},"options":"object"}},"set-drop-filter":{"with":{"filter":{"type":"object"}}},"set-actions":{"with":{"actions":"list"}},"set-messages":{"with":{"messages":"object"}},"set-insertion-target":{"with":{"target":{"type":"object","nullable":true}}},"select":{"with":{"id":{"type":"id","nullable":true},"options":"object"}},"edit":{"with":{"id":"string"}},"refresh":{}},"css-variables":{"--sf-composition-overlay-frame-color":{"type":"color","state":"default"},"--sf-composition-overlay-z-index":{"type":"number","state":"default"},"--sf-composition-overlay-toolbar-background-color":{"type":"color","state":"selected"},"--sf-composition-overlay-toolbar-radius":{"type":"length","state":"selected"},"--sf-composition-overlay-toolbar-gap":{"type":"length","state":"selected"}}}');

/***/ },

/***/ "339c075524d7"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Composition overlay","runtime":{"cancelled":"Move cancelled.","editing":"Editing {label}. Enter saves, Escape cancels.","insert":"Insert","insert-at":"Insert into “{slot}”, position {index}","picked":"Moving {label}. Arrows choose a place, Enter drops, Escape cancels.","position":"{index} of {total}","selected":"Selected: {label}","toolbar":"Actions","tree":"Page structure"},"events":{"insert":{"label":"Insert"}}}');

/***/ },

/***/ "d8e3a01243dc"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Слой редактора","runtime":{"cancelled":"Перемещение отменено.","editing":"Редактирование: {label}. Enter — сохранить, Escape — отменить.","insert":"Вставить","insert-at":"Вставить в «{slot}», позиция {index}","picked":"Перемещение: {label}. Стрелки выбирают место, Enter — положить, Escape — отменить.","position":"{index} из {total}","selected":"Выбрано: {label}","toolbar":"Действия","tree":"Структура страницы"},"events":{"insert":{"label":"Вставить"}}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("cae046a8699f");
/******/
/******/ })()
;