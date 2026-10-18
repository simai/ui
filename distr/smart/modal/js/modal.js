/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "3f3a6e2680d5"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   freezeModalContent: () => (/* binding */ freezeModalContent)
/* harmony export */ });
// Keep the closing dialog itself meaningful while its visible content becomes
// non-interactive. Restore only temporary inert attributes owned by this lease.
function freezeModalContent(panel, focusPanel = false) {
  if (!panel) return () => {};
  const owned = new Set();

  const freeze = () => {
    for (const child of panel.children) {
      if (!child.hasAttribute('inert')) {
        child.setAttribute('inert', '');
        owned.add(child);
      }
    }
  };

  if (focusPanel) panel.focus({
    preventScroll: true
  });
  freeze();
  const observer = new panel.ownerDocument.defaultView.MutationObserver(freeze);
  observer.observe(panel, {
    childList: true
  });
  return () => {
    observer.disconnect();

    for (const child of owned) {
      if (child.getAttribute('inert') === '') child.removeAttribute('inert');
    }

    owned.clear();
  };
}



/***/ },

/***/ "c8d66dd2c299"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getModalTabStops: () => (/* binding */ getModalTabStops),
/* harmony export */   syncModalFocusGuards: () => (/* binding */ syncModalFocusGuards),
/* harmony export */   trapModalFocus: () => (/* binding */ trapModalFocus)
/* harmony export */ });
const FOCUSABLE_SELECTOR = ['a[href]', 'area[href]', 'button', 'input', 'select', 'textarea', 'iframe', 'summary', 'audio[controls]', 'video[controls]', '[contenteditable]', '[tabindex]'].join(',');
const GUARDS_KEY = Symbol.for('simai.modal.focus-guards');

function syncModalFocusGuards(modal) {
  const root = modal?.getModalRoot?.() || modal?.template;
  const panel = root?.querySelector?.('[data-sf-modal-panel]');
  const previous = document[GUARDS_KEY];
  if (previous && previous.panel === panel && previous.before.isConnected && previous.after.isConnected) return;
  previous?.before.remove();
  previous?.after.remove();
  delete document[GUARDS_KEY];
  if (!panel?.parentNode) return;
  const guards = {
    panel,
    relaying: false
  };

  for (const edge of ['before', 'after']) {
    const guard = panel.ownerDocument.createElement('span');
    guard.tabIndex = 0;
    guard.className = 'sf-modal-focus-guard';
    guard.setAttribute('aria-hidden', 'true');
    guard.addEventListener('focus', () => {
      if (guards.relaying || !panel.isConnected || root.inert || root.getAttribute('aria-hidden') === 'true') return;
      const backward = edge === 'before';
      const stops = getModalTabStops(panel, backward);
      const destination = backward ? stops.at(-1) : stops[0]; // A frame's child document owns the outgoing key event. If both edges are
      // frames, return to the meaningful dialog boundary; the next native Tab
      // enters the requested end of the document without inspecting its origin.

      if (!destination || destination.tagName === 'IFRAME') panel.focus({
        preventScroll: true
      });else destination.focus({
        preventScroll: true
      });
    });
    guards[edge] = guard;
  }

  panel.before(guards.before);
  panel.after(guards.after);
  document[GUARDS_KEY] = guards;
}

function sameRadioGroup(a, b) {
  return a?.tagName === 'INPUT' && b?.tagName === 'INPUT' && a.type === 'radio' && b.type === 'radio' && !!a.name && a.name === b.name && a.form === b.form && a.getRootNode() === b.getRootNode();
} // Shared by ordinary and Smart Modal. Read the current DOM on each Tab so
// hidden, inert or disabled controls never become stale focus boundaries.


function getModalTabStops(panel, backward = false) {
  const view = panel.ownerDocument.defaultView;
  const candidates = Array.from(panel.querySelectorAll(FOCUSABLE_SELECTOR)).filter(node => node.tabIndex >= 0 && !node.matches(':disabled') && !node.closest('[inert]') && node.getClientRects().length > 0 && view.getComputedStyle(node).visibility === 'visible').sort((a, b) => (a.tabIndex || Infinity) - (b.tabIndex || Infinity)); // Native radio groups contribute one sequential stop, not every input.
  // Do not rewrite checked/tabindex or intercept their native arrow-key handling.

  return candidates.filter(node => {
    if (!sameRadioGroup(node, node)) return true;
    const group = candidates.filter(candidate => sameRadioGroup(node, candidate));
    const selected = group.find(candidate => candidate.checked);
    return node === (selected || group.at(backward ? -1 : 0));
  });
}

function trapModalFocus(panel, event) {
  if (!panel) return;
  const nodes = getModalTabStops(panel, event.shiftKey);
  const active = panel.ownerDocument.activeElement;

  if (!nodes.length) {
    event.preventDefault();
    panel.focus();
    return;
  }

  const first = nodes[0];
  const last = nodes[nodes.length - 1];
  const boundary = event.shiftKey ? first : last;

  if (!panel.contains(active) || active === panel || active === boundary || sameRadioGroup(active, boundary)) {
    const destination = event.shiftKey ? last : first;
    const guards = panel.ownerDocument[GUARDS_KEY];

    if (destination.tagName === 'IFRAME' && guards?.panel === panel) {
      // Let the trusted browser Tab action traverse the iframe itself. Calling
      // iframe.focus() cannot choose its last child in an opaque document.
      guards.relaying = true;

      try {
        (event.shiftKey ? guards.after : guards.before).focus({
          preventScroll: true
        });
      } finally {
        guards.relaying = false;
      }

      return;
    }

    event.preventDefault();
    destination.focus();
  }
}



/***/ },

/***/ "201fd0b17b8b"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   modalTransitionDuration: () => (/* binding */ modalTransitionDuration),
/* harmony export */   scheduleModalClose: () => (/* binding */ scheduleModalClose),
/* harmony export */   scheduleModalFrame: () => (/* binding */ scheduleModalFrame)
/* harmony export */ });
const timeInMs = value => {
  const number = Number.parseFloat(value);
  return Number.isFinite(number) ? number * (value.trim().endsWith('ms') ? 1 : 1000) : 0;
}; // Hidden/offscreen documents may throttle requestAnimationFrame indefinitely.
// Modal state changes must still complete, so the first scheduled channel wins.


function scheduleModalFrame(callback, view = window) {
  let complete = false;
  let frame = null;
  let timer = null;

  const run = () => {
    if (complete) return;
    complete = true;

    if (frame !== null) {
      view.cancelAnimationFrame(frame);
      frame = null;
    }

    if (timer !== null) {
      view.clearTimeout(timer);
      timer = null;
    }

    callback();
  };

  frame = view.requestAnimationFrame(run);
  timer = view.setTimeout(run, 50);
  if (typeof view.queueMicrotask === 'function') view.queueMicrotask(run);
  return () => {
    complete = true;
    if (frame !== null) view.cancelAnimationFrame(frame);
    if (timer !== null) view.clearTimeout(timer);
  };
} // CSS lists repeat to match transition-property, not the longest input list.

function modalTransitionDuration(style) {
  const properties = style.transitionProperty.split(',').map(value => value.trim());
  const durations = style.transitionDuration.split(',').map(timeInMs);
  const delays = style.transitionDelay.split(',').map(timeInMs);
  return Math.max(0, ...properties.map((property, index) => {
    if (!['all', 'opacity', 'transform', '-webkit-transform'].includes(property)) return 0;
    return Math.max(0, durations[index % durations.length]) + delays[index % delays.length];
  }));
} // Measure after the Smart projection has applied the closing state. A bounded
// timer also completes when no transitionend fires (unchanged or hidden panel).
// Never finish on the first property/descendant transitionend.

function scheduleModalClose(getRoot, finalize, view = window) {
  let timer = null,
      cancelled = false;
  const cancelFrame = scheduleModalFrame(() => {
    if (cancelled) return;
    const root = getRoot();
    const nodes = root?.querySelectorAll('[data-sf-modal-panel], [data-sf-modal-overlay]') || [];
    const duration = Math.max(0, ...Array.from(nodes, node => {
      const style = view.getComputedStyle(node);
      return style.display === 'none' ? 0 : modalTransitionDuration(style);
    }));
    timer = view.setTimeout(() => {
      if (!cancelled) finalize();
    }, duration);
  }, view);
  return () => {
    cancelled = true;
    cancelFrame();
    if (timer !== null) view.clearTimeout(timer);
  };
}

/***/ },

/***/ "ed3ae3576d0a"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   lockModalScroll: () => (/* binding */ lockModalScroll),
/* harmony export */   unlockModalScroll: () => (/* binding */ unlockModalScroll)
/* harmony export */ });
// One lease is held by the first visible layer in the shared Modal stack.
// Restore only changes that this lease owns, not pre-existing page styling.
function lockModalScroll(preserveScrollGap = true) {
  const docEl = document.documentElement;
  const body = document.body;
  if (!docEl || !body) return null;
  const gap = Math.max(0, window.innerWidth - docEl.clientWidth);
  const padding = parseFloat(window.getComputedStyle(body).paddingInlineEnd) || 0;
  const saved = {
    docEl,
    body,
    htmlLocked: docEl.classList.contains('overflow-hidden'),
    bodyLocked: body.classList.contains('overflow-hidden'),
    bodyPaddingInlineEnd: body.style.getPropertyValue('padding-inline-end'),
    paddingPriority: body.style.getPropertyPriority('padding-inline-end'),
    appliedPadding: null
  };
  docEl.classList.add('overflow-hidden');
  body.classList.add('overflow-hidden');

  if (preserveScrollGap && gap > 0) {
    body.style.setProperty('padding-inline-end', `${padding + gap}px`, saved.paddingPriority);
    saved.appliedPadding = body.style.getPropertyValue('padding-inline-end');
  }

  return saved;
}

function unlockModalScroll(saved) {
  if (!saved) return;
  const {
    docEl,
    body
  } = saved;
  if (!saved.htmlLocked) docEl.classList.remove('overflow-hidden');
  if (!saved.bodyLocked) body.classList.remove('overflow-hidden');

  if (saved.appliedPadding !== null && body.style.getPropertyValue('padding-inline-end') === saved.appliedPadding && body.style.getPropertyPriority('padding-inline-end') === saved.paddingPriority) {
    if (saved.bodyPaddingInlineEnd) {
      body.style.setProperty('padding-inline-end', saved.bodyPaddingInlineEnd, saved.paddingPriority);
    } else {
      body.style.removeProperty('padding-inline-end');
    }
  }
}



/***/ },

/***/ "93025a68d8ab"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addModalLayer: () => (/* binding */ addModalLayer),
/* harmony export */   captureModalFocusAncestors: () => (/* binding */ captureModalFocusAncestors),
/* harmony export */   getModalLayerIndex: () => (/* binding */ getModalLayerIndex),
/* harmony export */   getTopModalLayer: () => (/* binding */ getTopModalLayer),
/* harmony export */   raiseModalLayer: () => (/* binding */ raiseModalLayer),
/* harmony export */   removeModalLayer: () => (/* binding */ removeModalLayer),
/* harmony export */   restoreModalLayerFocus: () => (/* binding */ restoreModalLayerFocus),
/* harmony export */   updateModalLayers: () => (/* binding */ updateModalLayers)
/* harmony export */ });
/* harmony import */ var _focus__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("c8d66dd2c299");
// Ordinary and Smart Modal are separate bundles. Share only document-local
// coordination, not their registries, public instance APIs or rendering.

const STACK_KEY = Symbol.for('simai.modal.document-stack');

function state() {
  if (!document[STACK_KEY]) {
    Object.defineProperty(document, STACK_KEY, {
      value: {
        items: [],
        lockOwner: null
      },
      configurable: true
    });
  }

  return document[STACK_KEY];
}

function getTopModalLayer() {
  return state().items.at(-1) || null;
}

function getModalLayerIndex(modal) {
  return state().items.indexOf(modal);
}

function updateModalLayers() {
  state().items.forEach((modal, index) => modal.applyStackPosition(index));
  (0,_focus__WEBPACK_IMPORTED_MODULE_0__.syncModalFocusGuards)(getTopModalLayer());
} // A modal inside an overlay container covers that box, not the page, so the
// page stays scrollable while it is open.


const locksPage = modal => !modal.inContainer;

function addModalLayer(modal, owner) {
  const stack = state();
  if (stack.items.includes(modal)) return;

  if (locksPage(modal) && !stack.lockOwner) {
    stack.lockOwner = owner;
    owner.lockPage(modal.preserveScrollGap);
  }

  stack.items.push(modal);
  updateModalLayers();
}

function removeModalLayer(modal) {
  const stack = state();
  const index = stack.items.indexOf(modal);
  if (index < 0) return;
  stack.items.splice(index, 1);

  if (stack.lockOwner && !stack.items.some(locksPage)) {
    stack.lockOwner.unlockPage();
    stack.lockOwner = null;
  }

  updateModalLayers();
}

function raiseModalLayer(modal) {
  const stack = state();
  const index = stack.items.indexOf(modal);
  if (index < 0) return;
  stack.items.splice(index, 1);
  stack.items.push(modal);
  updateModalLayers();
}

function captureModalFocusAncestors(node) {
  const ancestors = [];

  for (let parent = node?.parentElement; parent; parent = parent.parentElement) {
    if (parent.matches('main, section, article, [role="main"], [role="region"]')) {
      ancestors.push(parent);
    }
  }

  return ancestors;
}

function tryReturnFocus(node, temporaryTabIndex = false) {
  if (!node?.isConnected || typeof node.focus !== 'function' || node.matches(':disabled') || node.closest('[inert], [hidden], [aria-hidden="true"]') || !node.getClientRects().length || node.ownerDocument.defaultView.getComputedStyle(node).visibility !== 'visible') {
    return false;
  }

  const addTabIndex = temporaryTabIndex && !node.hasAttribute('tabindex');
  let observer;

  const cleanup = () => {
    observer?.disconnect();
    node.removeEventListener('blur', cleanup); // Preserve synchronous author changes to the temporary attribute.

    if (addTabIndex && node.getAttribute('tabindex') === '-1') node.removeAttribute('tabindex');
  };

  if (addTabIndex) {
    node.setAttribute('tabindex', '-1');
    node.addEventListener('blur', cleanup, {
      once: true
    });
    observer = new node.ownerDocument.defaultView.MutationObserver(() => {
      if (!node.isConnected) cleanup();
    });
    observer.observe(node.ownerDocument.documentElement, {
      childList: true,
      subtree: true
    });
  }

  let focused = false;

  try {
    node.focus({
      preventScroll: true
    });
    focused = node.ownerDocument.activeElement === node;
    return focused;
  } catch {
    return false;
  } finally {
    // Removing tabindex while a non-native target is focused blurs it in browsers.
    if (addTabIndex && !focused) cleanup();
  }
}

function restoreModalLayerFocus(wasTop, lastActive, ancestors = []) {
  if (!wasTop) return;
  const top = getTopModalLayer();
  const root = top?.getModalRoot?.() || top?.template;

  if ((!top || root?.contains(lastActive)) && tryReturnFocus(lastActive)) {
    return;
  }

  if (top) {
    top.focusFirst();
    return;
  }

  const candidates = new Set([...ancestors, ...document.querySelectorAll('main, [role="main"]'), document.body]);

  for (const candidate of candidates) {
    if (tryReturnFocus(candidate, true)) return;
  }
}



/***/ },

/***/ "f98b7a216869"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ddf1cdb42ecc");
/* harmony import */ var lit_directives_unsafe_html_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("7b69af8ef2e5");
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("fbe0570fcc69");
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("0d662e4d7d63");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("e45eac6c719d");
/* harmony import */ var _component_modal_js_focus__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("c8d66dd2c299");
/* harmony import */ var _component_modal_js_closing__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("3f3a6e2680d5");
/* harmony import */ var _component_modal_js_motion__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("201fd0b17b8b");
/* harmony import */ var _component_modal_js_scroll__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("ed3ae3576d0a");
/* harmony import */ var _component_modal_js_stack__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("93025a68d8ab");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, lit_directives_unsafe_html_js__WEBPACK_IMPORTED_MODULE_1__, _core_js_smart_base__WEBPACK_IMPORTED_MODULE_2__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_3__, _js_templates_default__WEBPACK_IMPORTED_MODULE_4__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, lit_directives_unsafe_html_js__WEBPACK_IMPORTED_MODULE_1__, _core_js_smart_base__WEBPACK_IMPORTED_MODULE_2__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_3__, _js_templates_default__WEBPACK_IMPORTED_MODULE_4__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lit_directives_unsafe_html_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lit_directives_unsafe_html_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__);








 // A box that holds its own overlays (sf-modal, sf-drawer); the drawer's own
// name came first and is read until the change journal retires it.

const OVERLAY_CONTAINER = "[data-sf-overlay-container], [data-sf-drawer-container]";
 // The header's two actions, named in the page's language: they were English on
// every page (documentation trial, 2026-10-12).

const MODAL_TEXT = {
  en: {
    close: "Close",
    minimize: "Minimize",
    title: "Dialog"
  },
  ru: {
    close: "Закрыть",
    minimize: "Свернуть",
    title: "Окно"
  }
};
let modalUid = 0;

function isBlurTypeValue(value) {
  return ["none", "small", "medium", "large"].includes(String(value || "").trim().toLowerCase());
}

class SfModal extends (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_2___default()) {
  static registry = new Map();
  static globalBound = false;
  static stack = [];
  static openCount = 0;
  static lockState = null;
  static baseZIndex = 9000;
  static defaultTrueAttributes = new Set(["overlay", "show-close", "show-footer", "close-on-esc", "close-on-overlay", "preserve-scroll-gap", "preload"]);

  static getTopModal() {
    return (0,_component_modal_js_stack__WEBPACK_IMPORTED_MODULE_9__.getTopModalLayer)();
  }

  static isTopModal(modal) {
    return SfModal.getTopModal() === modal;
  }

  static getStackIndex(modal) {
    return (0,_component_modal_js_stack__WEBPACK_IMPORTED_MODULE_9__.getModalLayerIndex)(modal);
  }

  static addToStack(modal) {
    if (!modal || modal.display === "inline") {
      return;
    }

    SfModal.stack = SfModal.stack.filter(item => item !== modal);
    SfModal.stack.push(modal);
    SfModal.openCount = SfModal.stack.length; // Keep the open-instance registry, but only visible dialogs own page focus
    // and the document scroll lock.

    if (!modal.hiddenState) {
      (0,_component_modal_js_stack__WEBPACK_IMPORTED_MODULE_9__.addModalLayer)(modal, SfModal);
    }
  }

  static removeFromStack(modal) {
    if (!modal || modal.display === "inline") {
      return;
    }

    SfModal.stack = SfModal.stack.filter(item => item !== modal);
    SfModal.openCount = SfModal.stack.length;
    (0,_component_modal_js_stack__WEBPACK_IMPORTED_MODULE_9__.removeModalLayer)(modal);
  }

  static bringToFront(modal) {
    if (!modal || modal.display === "inline" || !SfModal.stack.includes(modal)) {
      return;
    }

    SfModal.stack = SfModal.stack.filter(item => item !== modal);
    SfModal.stack.push(modal);
    (0,_component_modal_js_stack__WEBPACK_IMPORTED_MODULE_9__.raiseModalLayer)(modal);
  }

  static updateStackStyles() {
    (0,_component_modal_js_stack__WEBPACK_IMPORTED_MODULE_9__.updateModalLayers)();
  }

  static get props() {
    return {
      templateName: {
        attribute: "template",
        default: "default"
      },
      modalId: {
        default: ""
      },
      title: {
        default: ""
      },
      ariaLabel: {
        attribute: "aria-label",
        default: ""
      },
      text: {
        default: ""
      },
      open: {
        type: Boolean,
        default: false
      },
      autoload: {
        type: Boolean,
        default: false
      },
      unclose: {
        type: Boolean,
        default: false
      },
      hide: {
        type: Boolean,
        default: false
      },
      hideModifier: {
        default: ""
      },
      minimized: {
        type: Boolean,
        default: false
      },
      overlay: {
        type: Boolean,
        default: true
      },
      showHeader: {
        type: Boolean,
        default: true
      },
      showClose: {
        type: Boolean,
        default: true
      },
      showFooter: {
        type: Boolean,
        default: true
      },
      closeOnEsc: {
        type: Boolean,
        default: true
      },
      closeOnOverlay: {
        type: Boolean,
        default: true
      },
      preserveScrollGap: {
        type: Boolean,
        default: true
      },
      position: {
        default: "center",
        values: ["center", "left", "right", "inline-start", "inline-end", "top", "bottom"]
      },
      mode: {
        default: "inline",
        values: ["inline", "ajax", "iframe"]
      },
      display: {
        default: "modal",
        values: ["modal", "inline"]
      },
      src: {
        default: ""
      },
      rootClass: {
        default: ""
      },
      preload: {
        type: Boolean,
        default: true
      },
      fullscreen: {
        type: Boolean,
        default: false
      },
      width: {
        default: ""
      },
      height: {
        default: ""
      },
      blur: {
        default: ""
      },
      blurType: {
        default: "medium",
        values: ["none", "small", "medium", "large"]
      },
      overlayPreset: {
        default: "default",
        values: ["default", "focus"]
      },
      overlayClass: {
        default: ""
      },
      closeClass: {
        default: ""
      },
      surfaceClass: {
        default: ""
      },
      surfacePadding: {
        default: ""
      },
      panelClass: {
        default: ""
      },
      headerClass: {
        default: ""
      },
      bodyClass: {
        default: ""
      },
      contentClass: {
        default: ""
      },
      footerClass: {
        default: ""
      }
    };
  }

  constructor() {
    super();
    this._modalId = "";
    this._syncingOpenAttribute = false;
    this._portalRoot = null;
    this._renderTarget = null;
    this._hostClearedForPortal = false;
    this._slotEventHandlers = new Map();
    this._slotEventId = 0;
    this._readyDetail = null;
    this._hasEmittedReady = false;
    this._hasAutoloaded = false;
    this._isOpen = false;
    this._isHidden = false;
    this._modalState = "closed";
    this._animatePanel = false;
    this._stackIndex = -1;
    this._closeTimer = null;
    this._closeTransitionAbort = null;
    this._lastActive = null;
    this._fetchController = null;
    this._remoteHtml = "";
    this._remoteError = "";
    this._isLoadingRemote = false;
    this._remoteLoaded = false;
    this.onKeyDown = this.onKeyDown.bind(this);
    this.handleOverlayClick = this.handleOverlayClick.bind(this);
    this.handleCloseClick = this.handleCloseClick.bind(this);
    this.handleHideClick = this.handleHideClick.bind(this);
  }

  connectedCallback() {
    if (!this._modalId) {
      this._modalId = this.getAttribute("modal-id") || this.id || `sf-modal-${++modalUid}`;
    }

    super.connectedCallback();
    SfModal.registry.set(this.modalId, this);
    SfModal.bindGlobalEvents();
  } // What the author writes inside <sf-modal> without a slot is the window's
  // content, after anything slotted as content -- as sf-drawer takes it. It
  // used to be dropped without a word: an unslotted paragraph gave an empty
  // window (owner, 2026-10-18).


  captureSlotTemplates() {
    const first = !this._slotTemplatesCaptured;
    super.captureSlotTemplates();
    if (!first) return;
    const loose = Array.from(this.childNodes).filter(node => node.nodeType === Node.ELEMENT_NODE ? node.tagName.toLowerCase() !== "template" : node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== "");
    if (!loose.length) return;
    if (!this._liveSlotNodes.has("content")) this._liveSlotNodes.set("content", []);

    this._liveSlotNodes.get("content").push(...loose);

    loose.forEach(node => node.remove());
  }

  disconnectedCallback() {
    this.teardownModal();
    SfModal.registry.delete(this.modalId);
    super.disconnectedCallback();
  }

  get templateName() {
    return this.getAttribute("template") || "default";
  }

  get modalId() {
    return this.getAttribute("modal-id") || this._modalId || this.id || "";
  }

  get title() {
    // An untitled window was headed and named «Modal» on every page; it
    // takes the page language's word instead.
    return this.getAttribute("title") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageText)(MODAL_TEXT, "title", this);
  }

  get ariaLabel() {
    return this.getAttribute("aria-label") || "";
  }

  get text() {
    return this.getAttribute("text") || "";
  }

  get openState() {
    return this._isOpen || this.hasAttribute("open");
  }

  get autoload() {
    return this.getBooleanAttr("autoload", false);
  }

  get unclose() {
    return this.getBooleanAttr("unclose", false);
  }

  get hideButton() {
    return this.getBooleanAttr("hide", false);
  }

  get hideModifier() {
    return this.getAttribute("hide-modifier") || "";
  }

  get hiddenState() {
    return this.display !== "inline" && (this._isHidden || this.hasAttribute("minimized"));
  }

  get overlay() {
    return this.getBooleanAttr("overlay", true);
  }

  get closeOnEsc() {
    return this.getBooleanAttr("close-on-esc", true);
  }

  get showClose() {
    const showClose = this.getBooleanAttr("show-close", true);
    return showClose && !this.unclose;
  }

  get showHeader() {
    return this.getBooleanAttr("show-header", true);
  }

  get showFooter() {
    return this.getBooleanAttr("show-footer", true);
  }

  get closeOnOverlay() {
    return this.getBooleanAttr("close-on-overlay", true);
  }

  get preserveScrollGap() {
    return this.getBooleanAttr("preserve-scroll-gap", true);
  }

  get position() {
    return this.getEnumAttr("position", ["center", "left", "right", "inline-start", "inline-end", "top", "bottom"], "center");
  }

  get mode() {
    return this.getEnumAttr("mode", ["inline", "ajax", "iframe"], "inline");
  }

  get display() {
    return this.getEnumAttr("display", ["modal", "inline"], "modal");
  }

  get src() {
    return this.getAttribute("src") || "";
  }

  get preload() {
    return this.getBooleanAttr("preload", true);
  }

  get fullscreen() {
    return this.getBooleanAttr("fullscreen", false);
  }

  get width() {
    return this.getAttribute("width") || "";
  }

  get height() {
    return this.getAttribute("height") || "";
  } // blur="small" turns the blur on and names its type; blur="false" turns it
  // off. The template used to read the raw attribute, so any value, "false"
  // included, turned the blur on.


  get blur() {
    return isBlurTypeValue(this.getAttribute("blur")) || this.getBooleanAttr("blur", false);
  }

  get blurType() {
    const blurValue = this.getAttribute("blur");
    const value = this.getAttribute("blur-type") || (isBlurTypeValue(blurValue) ? blurValue : "medium");
    return this.normalizeEnum(value, ["none", "small", "medium", "large"], "medium");
  }

  get hasCustomBlurType() {
    return this.hasAttribute("blur-type") || isBlurTypeValue(this.getAttribute("blur"));
  }

  get overlayPreset() {
    return this.normalizeEnum(this.getAttribute("overlay-preset") || "default", ["default", "focus"], "default");
  }

  get headerClass() {
    return this.getAttribute("header-class") || "";
  }

  get overlayClass() {
    return this.getAttribute("overlay-class") || "";
  }

  get closeClass() {
    return this.getAttribute("close-class") || "";
  }

  get surfaceClass() {
    return this.getAttribute("surface-class") || "";
  }

  get surfacePadding() {
    return this.getAttribute("surface-padding") || "";
  }

  get panelClass() {
    return this.getAttribute("panel-class") || "";
  }

  get bodyClass() {
    return this.getAttribute("body-class") || "";
  }

  get contentClass() {
    return this.getAttribute("content-class") || "";
  }

  get footerClass() {
    return this.getAttribute("footer-class") || "";
  }

  get modalRoot() {
    return this._renderTarget?.querySelector?.(".sf-modal") || null;
  }

  get state() {
    return {
      modalId: this.modalId,
      title: this.title,
      ariaLabel: this.ariaLabel,
      text: this.text,
      open: this.openState,
      autoload: this.autoload,
      unclose: this.unclose,
      hide: this.hideButton,
      hideModifier: this.hideModifier,
      minimized: this.hiddenState,
      overlay: this.overlay,
      showHeader: this.showHeader,
      showClose: this.showClose,
      showFooter: this.showFooter,
      closeOnEsc: this.closeOnEsc,
      closeOnOverlay: this.closeOnOverlay,
      preserveScrollGap: this.preserveScrollGap,
      position: this.position,
      mode: this.mode,
      display: this.display,
      src: this.src,
      preload: this.preload,
      fullscreen: this.fullscreen,
      width: this.width,
      height: this.height,
      blur: this.blur,
      blurType: this.blurType,
      overlayPreset: this.overlayPreset,
      overlayClass: this.overlayClass,
      closeClass: this.closeClass,
      surfaceClass: this.surfaceClass,
      surfacePadding: this.surfacePadding,
      panelClass: this.panelClass,
      headerClass: this.headerClass,
      bodyClass: this.bodyClass,
      contentClass: this.contentClass,
      footerClass: this.footerClass,
      lifecycle: this.renderModalState,
      remote: {
        error: this._remoteError,
        status: this._isLoadingRemote ? "loading" : this._remoteError ? "error" : this._remoteLoaded ? "success" : "idle"
      },
      stackIndex: this._stackIndex
    };
  }

  get renderOpenState() {
    return this.openState || this._modalState === "closing";
  }

  get renderModalState() {
    if (this.display === "inline") {
      return this.openState ? "open" : "closed";
    }

    if (this.renderOpenState && this._modalState === "closed") {
      return "open";
    }

    return this._modalState;
  }

  get modalZIndex() {
    if (this.display === "inline" || this._stackIndex < 0) {
      return "";
    }

    return SfModal.baseZIndex + this._stackIndex * 2;
  }

  get remoteContent() {
    if (this.mode === "iframe" && this.src) {
      return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <iframe
          class="sf-modal-iframe w-full border-0 radius-surface"
          src=${this.src}
          data-sf-modal-iframe
          allowfullscreen
          style="min-height:var(--sf-modal-iframe-min-height);height:100%;"
          @load=${this.handleIframeLoad}
          @error=${this.handleIframeError}
        ></iframe>
      `;
    }

    if (this._remoteError) {
      return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div
          class="sf-modal-error flex flex-col gap-2 items-cross-center content-main-center p-4"
          data-sf-modal-state="error"
        >
          <div class="sf-modal-error-icon text-4 color-error">!</div>
          <p class="sf-modal-error-text m-0 text-2 color-error">
            ${this._remoteError}
          </p>
        </div>
      `;
    }

    if (this._remoteHtml) {
      return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-modal-content flex flex-col gap-2">
        ${(0,lit_directives_unsafe_html_js__WEBPACK_IMPORTED_MODULE_1__.unsafeHTML)(this._remoteHtml)}
      </div>`;
    }

    if (this._isLoadingRemote) {
      return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div
          class="sf-modal-loading flex flex-col gap-2 items-cross-center content-main-center p-4"
          data-sf-modal-state="loading"
        >
          <div
            class="sf-modal-spinner animate-spin border-2 border-t-transparent border-outline-variant rounded-full w-8 h-8"
          ></div>
          <p class="m-0 text-2 color-on-surface-variant">Loading...</p>
        </div>
      `;
    }

    return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  }

  templateContext() {
    this._slotEventHandlers.clear();

    this._slotEventId = 0;
    const props = this.getPropsContext();
    return this.createTemplateContext({ ...props,
      component: this,
      closeText: (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageText)(MODAL_TEXT, "close", this),
      minimizeText: (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageText)(MODAL_TEXT, "minimize", this),
      // The props context holds the declared default; the getter holds the
      // page language's word for an untitled window.
      title: this.title,
      modalId: this.modalId,
      open: this.renderOpenState,
      modalState: this.renderModalState,
      animate: this._animatePanel && this.display !== "inline",
      modalZIndex: this.modalZIndex,
      hide: this.hideButton,
      minimized: this.hiddenState,
      showClose: this.showClose,
      blur: this.blur,
      blurType: this.blurType,
      hasCustomBlurType: this.hasCustomBlurType,
      hasHeaderContent: this.hasSlotContent("header"),
      hasContentContent: this.hasSlotContent("content"),
      hasFooterContent: this.hasSlotContent("footer"),
      headerContent: (0,lit_directives_unsafe_html_js__WEBPACK_IMPORTED_MODULE_1__.unsafeHTML)(this.getSlotHtml("header")),
      contentContent: (0,lit_directives_unsafe_html_js__WEBPACK_IMPORTED_MODULE_1__.unsafeHTML)(this.getSlotHtml("content")),
      footerContent: (0,lit_directives_unsafe_html_js__WEBPACK_IMPORTED_MODULE_1__.unsafeHTML)(this.getSlotHtml("footer")),
      remoteContent: this.remoteContent,
      onCloseClick: this.handleCloseClick,
      onHideClick: this.handleHideClick
    });
  }

  getSlotHtml(name) {
    const slotContent = [...(this._liveSlotNodes.get(name) || []), ...(this._slotTemplates.get(name) || [])];
    return slotContent.map(node => {
      if (node instanceof HTMLElement) {
        const clone = node.cloneNode(true);
        this.copyRuntimeData(node, clone);
        this.assignSlotEventIds(clone);
        this.cleanNestedSmartComponentRender(clone);
        return clone.outerHTML;
      }

      return node.textContent || "";
    }).join("");
  }

  assignSlotEventIds(root) {
    const nodes = [root, ...Array.from(root.querySelectorAll?.("*") || [])];
    nodes.forEach(node => {
      if (!node.__sfCreateEventHandlers?.length) {
        return;
      }

      const id = `sf-modal-slot-event-${++this._slotEventId}`;
      node.setAttribute("data-sf-runtime-event-id", id);

      this._slotEventHandlers.set(id, node.__sfCreateEventHandlers.slice());
    });
  }

  cleanNestedSmartComponentRender(root) {
    const nodes = [root, ...Array.from(root.querySelectorAll?.("*") || [])];
    nodes.forEach(node => {
      const tagName = node.tagName?.toLowerCase?.() || "";

      if (!tagName.startsWith("sf-")) {
        return;
      }

      Array.from(node.childNodes).forEach(child => {
        if (child instanceof HTMLElement && (child.hasAttribute("slot") || child.tagName.toLowerCase() === "slot" || child.tagName.toLowerCase().startsWith("sf-"))) {
          return;
        }

        child.remove();
      });
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_4__.renderModalTemplate)(this.templateContext());
  }

  async renderComponent(changedAttributes = []) {
    const renderToken = ++this._renderToken;

    if (!this._isMounted) {
      return;
    }

    this.beforeRender(changedAttributes);
    this.emitComponentEvent("before-render", {
      changedAttributes
    });
    this.runExternalHook("beforeRender", {
      changedAttributes,
      root: this
    });
    const templateResult = await this.resolveTemplateResult(changedAttributes);

    if (!this._isMounted || renderToken !== this._renderToken) {
      return;
    }

    (0,lit__WEBPACK_IMPORTED_MODULE_0__.render)(templateResult, this.resolveRenderTarget());
    this.afterRender(changedAttributes);
    this.runExternalHook("afterRender", {
      changedAttributes,
      root: this
    });
    this.emitComponentEvent("after-render", {
      changedAttributes
    });
  }

  resolveRenderTarget() {
    if (this.display === "inline") {
      this.clearPortal();
      this._hostClearedForPortal = false;
      this._renderTarget = this;
      return this;
    }

    if (!this._hostClearedForPortal) {
      (0,lit__WEBPACK_IMPORTED_MODULE_0__.render)(lit__WEBPACK_IMPORTED_MODULE_0__.nothing, this);
      this._hostClearedForPortal = true;
    }

    if (!this._portalRoot) {
      this._portalRoot = this.resolvePortalRoot();
    }

    this.dedupePortalRoots();
    this._renderTarget = this._portalRoot;
    return this._portalRoot;
  } // The box the modal is rendered into: the end of the body, above the page --
  // or, when the modal stands inside a [data-sf-overlay-container], the end of
  // that box, which then frames its backdrop and surface (contain: layout makes
  // it their containing block) and whose page is not locked: a documentation
  // example or an editor pane holds its own modal (DEV, 2026-10-18).


  get overlayHome() {
    return this.closest(OVERLAY_CONTAINER) || document.body;
  }

  get inContainer() {
    return this.overlayHome !== document.body;
  }

  resolvePortalRoot() {
    const home = this.overlayHome;
    const existingPortal = home.querySelector(`[data-sf-modal-portal="${this.modalId}"]`);

    if (existingPortal) {
      return existingPortal;
    }

    const portal = document.createElement("div");
    portal.setAttribute("data-sf-modal-portal", this.modalId);
    home.append(portal);
    return portal;
  }

  dedupePortalRoots() {
    const portals = Array.from(document.querySelectorAll(`[data-sf-modal-portal="${this.modalId}"]`));
    portals.forEach(portal => {
      if (portal === this._portalRoot) {
        return;
      }

      (0,lit__WEBPACK_IMPORTED_MODULE_0__.render)(lit__WEBPACK_IMPORTED_MODULE_0__.nothing, portal);
      portal.remove();
    });

    if (!this._portalRoot.isConnected) {
      this._portalRoot.setAttribute("data-sf-modal-portal", this.modalId);

      this.overlayHome.append(this._portalRoot);
    }
  }

  applyStackPosition(index = SfModal.getStackIndex(this)) {
    this._stackIndex = index;
    const root = this.getModalRoot();

    if (!root || this.display === "inline") {
      return this;
    }

    if (index < 0) {
      root.style.removeProperty("z-index");
      root.style.removeProperty("--sf-modal-stack-index");
      return this;
    }

    root.style.setProperty("--sf-modal-stack-index", String(index));
    root.style.zIndex = String(this.modalZIndex);
    return this;
  }

  open(options = {}) {
    const {
      animate = true
    } = typeof options === "boolean" ? {
      animate: options
    } : options;
    const wasClosing = this._modalState === "closing";

    if (this._isOpen && !wasClosing) {
      this.cancelCloseTransition();
      SfModal.bringToFront(this);
      return this;
    }

    if (!this.emitBeforeOpen()) {
      return this;
    }

    if (!wasClosing) {
      this._lastActive = document.activeElement;
      this._focusReturnAncestors = (0,_component_modal_js_stack__WEBPACK_IMPORTED_MODULE_9__.captureModalFocusAncestors)(this._lastActive);
    }

    if (wasClosing) {
      this.cancelCloseTransition();
      this._releaseClosingContent?.();
      this._releaseClosingContent = null;
    }

    this._isOpen = true;
    this._animatePanel = Boolean(animate);
    this._modalState = animate && this.display !== "inline" ? "opening" : "open";
    this.syncOpenAttribute(true);

    if (this.display !== "inline" && !wasClosing) {
      SfModal.addToStack(this);
    } else if (this.display !== "inline") {
      SfModal.bringToFront(this);
    }

    this.requestComponentUpdate("open");
    (0,_component_modal_js_motion__WEBPACK_IMPORTED_MODULE_7__.scheduleModalFrame)(() => {
      if (!this._isOpen || this._modalState === "closing") {
        return;
      }

      this._modalState = "open";
      const projected = new Promise(resolve => {
        const onUpdated = event => {
          if (!event.detail?.changedAttributes?.includes("open-state")) {
            return;
          }

          this.removeEventListener("sf-updated", onUpdated);
          resolve();
        };

        this.addEventListener("sf-updated", onUpdated);
      });
      this.requestComponentUpdate("open-state");
      void projected.then(() => {
        if (!this._isOpen || this._modalState !== "open") {
          return;
        }

        this.focusFirst();
        this.emitAfterOpen();
        this.loadRemoteContentIfNeeded();
      });
    });
    return this;
  }

  close() {
    if (!this.openState || this._modalState === "closing") {
      return this;
    }

    if (!this.emitBeforeClose()) {
      return this;
    }

    if (this.display === "inline") {
      this.finishClose();
      return this;
    }

    this._modalState = "closing";
    this._isOpen = false;
    this.requestComponentUpdate("close");
    const panel = this.getModalRoot()?.querySelector("[data-sf-modal-panel]");
    this._releaseClosingContent = (0,_component_modal_js_closing__WEBPACK_IMPORTED_MODULE_6__.freezeModalContent)(panel, SfModal.isTopModal(this));
    this._closeTransitionAbort = (0,_component_modal_js_motion__WEBPACK_IMPORTED_MODULE_7__.scheduleModalClose)(() => this.getModalRoot(), () => this.finishClose());
    return this;
  }

  hide() {
    if (!this.openState || this.display === "inline" || this.hiddenState) {
      return this;
    }

    if (!this.emitBeforeHide()) {
      return this;
    }

    this._isHidden = true;
    this.setAttribute("minimized", "");
    this.requestComponentUpdate("hide");
    this.emitAfterHide();
    return this;
  }

  show() {
    if (!this.openState || this.display === "inline" || !this.hiddenState) {
      return this;
    }

    if (!this.emitBeforeShow()) {
      return this;
    }

    this._isHidden = false;
    this.removeAttribute("minimized");
    this.requestComponentUpdate("show");
    this.emitAfterShow();
    return this;
  }

  syncMinimizedLayer() {
    if (!this._isMounted || !this.openState || this.display === "inline" || this._modalState === "closed" || this._modalState === "closing") {
      return;
    }

    const root = this.getModalRoot();

    if (this.hiddenState) {
      const wasTop = SfModal.isTopModal(this);
      (0,_component_modal_js_stack__WEBPACK_IMPORTED_MODULE_9__.removeModalLayer)(this);
      this.applyStackPosition();
      (0,_component_modal_js_stack__WEBPACK_IMPORTED_MODULE_9__.restoreModalLayerFocus)(wasTop, this._lastActive, this._focusReturnAncestors);

      if (root) {
        root.inert = true;
        root.setAttribute("aria-hidden", "true");
      }
    } else {
      if (root) {
        root.inert = false;
        root.setAttribute("aria-hidden", "false");
      }

      (0,_component_modal_js_stack__WEBPACK_IMPORTED_MODULE_9__.addModalLayer)(this, SfModal);
      SfModal.bringToFront(this);
      requestAnimationFrame(() => this.focusFirst());
    }
  }

  toggle() {
    return this.openState ? this.close() : this.open();
  }

  finishClose() {
    if (this.display !== "inline" && this._modalState !== "closing") {
      return this;
    }

    const wasTop = SfModal.isTopModal(this);
    this.cancelCloseTransition();
    this._isOpen = false;
    this._isHidden = false;
    this._modalState = "closed";
    this.removeAttribute("minimized");
    this.syncOpenAttribute(false);
    const root = this.getModalRoot();

    if (root) {
      root.inert = true;
      root.setAttribute("aria-hidden", "true");
    }

    this._releaseClosingContent?.();
    this._releaseClosingContent = null;

    if (this.display !== "inline") {
      SfModal.removeFromStack(this);
    }

    if (this.display !== "inline") {
      (0,_component_modal_js_stack__WEBPACK_IMPORTED_MODULE_9__.restoreModalLayerFocus)(wasTop, this._lastActive, this._focusReturnAncestors);
    }

    this.requestComponentUpdate("after-close");
    this.emitAfterClose();
    return this;
  }

  cancelCloseTransition() {
    if (this._closeTimer) {
      clearTimeout(this._closeTimer);
      this._closeTimer = null;
    }

    if (this._closeTransitionAbort) {
      this._closeTransitionAbort();

      this._closeTransitionAbort = null;
    }
  }

  setSrc(newSrc) {
    this.setAttribute("src", newSrc || "");
    this.resetRemoteContent();
    this.loadRemoteContentIfNeeded();
    return this;
  }

  reloadContent() {
    this.resetRemoteContent();
    this.loadRemoteContentIfNeeded(true);
    return this;
  }

  getModalRoot() {
    return this.modalRoot;
  }

  afterRender() {
    this.bindRenderedEvents();
    this.bindSlotEventHandlers();

    if (this._modalState === "closing") {
      this._releaseClosingContent?.();
      this._releaseClosingContent = (0,_component_modal_js_closing__WEBPACK_IMPORTED_MODULE_6__.freezeModalContent)(this.getModalRoot()?.querySelector("[data-sf-modal-panel]"), SfModal.isTopModal(this));
    }

    this._readyDetail = {
      component: this,
      modal: this,
      modalId: this.modalId,
      root: this.getModalRoot()
    };

    if (!this._hasEmittedReady) {
      this._hasEmittedReady = true;
      this.dispatchEvent(new CustomEvent("modal:ready", {
        bubbles: true,
        composed: true,
        detail: this._readyDetail
      }));
    } else {
      this.dispatchEvent(new CustomEvent("modal:update", {
        bubbles: true,
        composed: true,
        detail: this._readyDetail
      }));
    }

    if (this.hasAttribute("open") && !this._isOpen && this._modalState !== "closing") {
      this._isOpen = true;
      this._modalState = "open";

      if (this.display !== "inline") {
        SfModal.addToStack(this);
      }

      this.focusFirst();
      this.loadRemoteContentIfNeeded();
    }

    this.applyStackPosition(); // Projection can replace the panel while an existing layer remains open.

    (0,_component_modal_js_stack__WEBPACK_IMPORTED_MODULE_9__.updateModalLayers)();

    if (this.autoload && !this.openState && !this._hasAutoloaded) {
      this._hasAutoloaded = true;
      requestAnimationFrame(() => this.open({
        animate: false
      }));
    }
  }

  bindRenderedEvents() {
    const root = this.getModalRoot();

    if (!root) {
      return;
    }

    root.removeEventListener("click", this.handleOverlayClick);
    root.addEventListener("click", this.handleOverlayClick);
    document.removeEventListener("keydown", this.onKeyDown);
    document.addEventListener("keydown", this.onKeyDown);
  }

  bindSlotEventHandlers() {
    const root = this.getModalRoot();

    if (!root || !this._slotEventHandlers.size) {
      return;
    }

    this._slotEventHandlers.forEach((handlers, id) => {
      const node = root.querySelector(`[data-sf-runtime-event-id="${id}"]`);

      if (!node) {
        return;
      }

      handlers.forEach(({
        eventName,
        handler
      }) => {
        node.addEventListener(eventName, handler);
      });
    });
  }

  handleOverlayClick(event) {
    const isOverlay = event.target === this.getModalRoot()?.querySelector("[data-sf-modal-overlay]");

    if (isOverlay && this.closeOnOverlay && !this.unclose) {
      this.close();
    }
  }

  handleCloseClick(event) {
    event.preventDefault();

    if (!this.unclose) {
      this.close();
    }
  }

  handleHideClick(event) {
    event.preventDefault();
    this.hide();
  }

  onKeyDown(event) {
    if (!this.openState && this._modalState !== "closing" || this.display === "inline") {
      return;
    }

    if (!SfModal.isTopModal(this)) {
      return;
    }

    if (this.hiddenState) {
      return;
    } // An open popover takes Escape first; the window behind it stays.


    if (event.key === "Escape" && this.closeOnEsc && !this.unclose && this._modalState !== "closing" && !event.defaultPrevented && !document.documentElement?.dataset?.sfPopoverOpen) {
      event.preventDefault();
      event.stopImmediatePropagation();
      this.close();
      return;
    }

    if (event.key === "Tab") {
      this.trapFocus(event);
    }
  }

  trapFocus(event) {
    if (!SfModal.isTopModal(this)) {
      return;
    }

    if (this.hiddenState) {
      return;
    }

    const panel = this.getModalRoot()?.querySelector("[data-sf-modal-panel]");
    (0,_component_modal_js_focus__WEBPACK_IMPORTED_MODULE_5__.trapModalFocus)(panel, event);
  }

  focusFirst() {
    if (this.display === "inline") {
      return;
    }

    if (this.display !== "inline" && !SfModal.isTopModal(this)) {
      return;
    }

    if (this.hiddenState) {
      return;
    }

    const panel = this.getModalRoot()?.querySelector("[data-sf-modal-panel]");

    if (panel) {
      panel.focus();
    }
  }

  resetRemoteContent() {
    this._remoteHtml = "";
    this._remoteError = "";
    this._remoteLoaded = false;
    this._isLoadingRemote = false;
    this.abortRemoteContent();
  }

  abortRemoteContent() {
    if (this._fetchController) {
      this._fetchController.abort();

      this._fetchController = null;
    }
  }

  loadRemoteContentIfNeeded(force = false) {
    if (!this.src || this.mode !== "ajax" && this.mode !== "iframe") {
      return;
    }

    if (!this.preload && !this.openState && !force) {
      return;
    }

    if (this.mode === "iframe") {
      this._remoteLoaded = true;
      this.requestComponentUpdate("remote-content");
      return;
    }

    if (this._remoteLoaded && !force) {
      return;
    }

    void this.loadAjaxContent();
  }

  async loadAjaxContent() {
    this.abortRemoteContent();
    this._isLoadingRemote = true;
    this._remoteError = "";
    let aborted = false;
    this.requestComponentUpdate("remote-loading");
    this.emitContentEvent("modal:before-content-upload");
    this._fetchController = new AbortController();

    try {
      if (this.src.startsWith("#")) {
        const source = document.querySelector(this.src);

        if (!source) {
          throw new Error(`Element not found: ${this.src}`);
        }

        this._remoteHtml = source.innerHTML;
      } else {
        const response = await fetch(this.src, {
          signal: this._fetchController.signal
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        this._remoteHtml = await response.text();
      }

      this._remoteLoaded = true;
    } catch (error) {
      if (error.name === "AbortError") {
        aborted = true;
      } else {
        this._remoteError = error.message || "Failed to load content";
      }
    } finally {
      this._fetchController = null;
      this._isLoadingRemote = false;
      this.requestComponentUpdate("remote-content");

      if (!aborted) {
        this.emitContentEvent("modal:after-content-upload");
      }
    }
  }

  handleIframeLoad = () => {
    this._remoteLoaded = true;
    this.emitContentEvent("modal:after-content-upload");
  };
  handleIframeError = () => {
    this._remoteError = "Failed to load iframe content";
    this.requestComponentUpdate("remote-content");
  };

  emitContentEvent(eventName) {
    this.dispatchEvent(new CustomEvent(eventName, {
      bubbles: true,
      composed: true,
      detail: {
        component: this,
        modal: this,
        modalId: this.modalId,
        src: this.src,
        remote: this.state.remote
      }
    }));
  }

  emitModalEvent(eventName, {
    cancelable = false,
    detail = {}
  } = {}) {
    const event = new CustomEvent(eventName, {
      bubbles: true,
      composed: true,
      cancelable,
      detail: {
        component: this,
        modal: this,
        modalId: this.modalId,
        root: this.getModalRoot(),
        ...detail
      }
    });
    this.dispatchEvent(event);
    return !event.defaultPrevented;
  }

  emitBeforeOpen() {
    return this.emitModalEvent("modal:before-open", {
      cancelable: true,
      detail: {
        phase: "before-open"
      }
    });
  }

  emitAfterOpen() {
    this.emitModalEvent("modal:after-open", {
      detail: {
        phase: "after-open"
      }
    });
  }

  emitBeforeClose() {
    return this.emitModalEvent("modal:before-close", {
      cancelable: true,
      detail: {
        phase: "before-close"
      }
    });
  }

  emitAfterClose() {
    this.emitModalEvent("modal:after-close", {
      detail: {
        phase: "after-close"
      }
    });
  }

  emitBeforeHide() {
    return this.emitModalEvent("modal:before-hide", {
      cancelable: true,
      detail: {
        phase: "before-hide"
      }
    });
  }

  emitAfterHide() {
    this.emitModalEvent("modal:after-hide", {
      detail: {
        phase: "after-hide"
      }
    });
  }

  emitBeforeShow() {
    return this.emitModalEvent("modal:before-show", {
      cancelable: true,
      detail: {
        phase: "before-show"
      }
    });
  }

  emitAfterShow() {
    this.emitModalEvent("modal:after-show", {
      detail: {
        phase: "after-show"
      }
    });
  }

  syncOpenAttribute(isOpen) {
    this._syncingOpenAttribute = true;

    if (isOpen) {
      this.setAttribute("open", "");
    } else {
      this.removeAttribute("open");
    }

    this._syncingOpenAttribute = false;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (this._syncingOpenAttribute && name === "open") {
      return;
    }

    if (name === "open" && oldValue !== newValue) {
      if (!this._isMounted) {
        super.attributeChangedCallback(name, oldValue, newValue);
        return;
      }

      if (newValue === null) {
        this.close(); // close() may be a no-op before an asynchronous render is committed.
        // Removing the attribute still invalidates the pending open snapshot.

        this.requestComponentUpdate("open-attribute");
      } else {
        this.open();
      }

      return;
    }

    if (["src", "mode", "preload"].includes(name) && oldValue !== newValue) {
      this.resetRemoteContent();
    }

    if (name === "minimized" && oldValue !== newValue) {
      this._isHidden = newValue !== null;
      this.syncMinimizedLayer();
    }

    super.attributeChangedCallback(name, oldValue, newValue);
  }

  teardownModal() {
    const wasTop = SfModal.isTopModal(this);
    this.abortRemoteContent();
    this.cancelCloseTransition();
    document.removeEventListener("keydown", this.onKeyDown);

    if (this.display !== "inline") {
      SfModal.removeFromStack(this);
    }

    this._isOpen = false;
    this._modalState = "closed";
    this.clearPortal();
    this._releaseClosingContent?.();
    this._releaseClosingContent = null;
    (0,_component_modal_js_stack__WEBPACK_IMPORTED_MODULE_9__.restoreModalLayerFocus)(wasTop, this._lastActive, this._focusReturnAncestors);
  }

  clearPortal() {
    if (!this._portalRoot) {
      return;
    }

    (0,lit__WEBPACK_IMPORTED_MODULE_0__.render)(lit__WEBPACK_IMPORTED_MODULE_0__.nothing, this._portalRoot);

    this._portalRoot.remove();

    this._portalRoot = null;
  } // Modal events bubble like the base modal component and sf-drawer; the on*
  // helpers keep their meaning and receive only this modal's own events.


  ownModalHandler(handler) {
    return event => {
      if (event.detail?.modal === this) handler.call(this, event);
    };
  }

  onBeforeOpen(handler, options) {
    if (typeof handler === "function") {
      this.addEventListener("modal:before-open", this.ownModalHandler(handler), options);
    }

    return this;
  }

  onAfterOpen(handler, options) {
    if (typeof handler === "function") {
      this.addEventListener("modal:after-open", this.ownModalHandler(handler), options);
    }

    return this;
  }

  onBeforeClose(handler, options) {
    if (typeof handler === "function") {
      this.addEventListener("modal:before-close", this.ownModalHandler(handler), options);
    }

    return this;
  }

  onAfterClose(handler, options) {
    if (typeof handler === "function") {
      this.addEventListener("modal:after-close", this.ownModalHandler(handler), options);
    }

    return this;
  }

  onBeforeHide(handler, options) {
    if (typeof handler === "function") {
      this.addEventListener("modal:before-hide", this.ownModalHandler(handler), options);
    }

    return this;
  }

  onAfterHide(handler, options) {
    if (typeof handler === "function") {
      this.addEventListener("modal:after-hide", this.ownModalHandler(handler), options);
    }

    return this;
  }

  onBeforeShow(handler, options) {
    if (typeof handler === "function") {
      this.addEventListener("modal:before-show", this.ownModalHandler(handler), options);
    }

    return this;
  }

  onAfterShow(handler, options) {
    if (typeof handler === "function") {
      this.addEventListener("modal:after-show", this.ownModalHandler(handler), options);
    }

    return this;
  }

  onModalReady(handler, options) {
    if (typeof handler !== "function") {
      return this;
    }

    if (this._readyDetail) {
      handler(new CustomEvent("modal:ready", {
        detail: this._readyDetail
      }));
      return this;
    }

    this.addEventListener("modal:ready", this.ownModalHandler(handler), options);
    return this;
  }

  onModalUpdate(handler, options) {
    if (typeof handler === "function") {
      this.addEventListener("modal:update", this.ownModalHandler(handler), options);
    }

    return this;
  }

  static bindGlobalEvents() {
    if (SfModal.globalBound || typeof document === "undefined") {
      return;
    }

    document.addEventListener("click", event => {
      const openEl = event.target.closest("[data-sf-modal-open]");

      if (openEl) {
        SfModal.registry.get(openEl.getAttribute("data-sf-modal-open"))?.open();
        return;
      }

      const showEl = event.target.closest("[data-sf-modal-show]");

      if (showEl) {
        SfModal.registry.get(showEl.getAttribute("data-sf-modal-show"))?.show();
        return;
      }

      const hideEl = event.target.closest("[data-sf-modal-hide]");

      if (hideEl) {
        SfModal.registry.get(hideEl.getAttribute("data-sf-modal-hide"))?.hide();
        return;
      }

      const closeEl = event.target.closest("[data-sf-modal-close]");

      if (!closeEl) {
        return;
      }

      const id = closeEl.getAttribute("data-sf-modal-close") || closeEl.closest(".sf-modal")?.getAttribute("data-sf-modal-id");
      SfModal.registry.get(id)?.close();
    });
    SfModal.globalBound = true;
  }

  static lockPage(preserveScrollGap = true) {
    if (!SfModal.lockState) SfModal.lockState = (0,_component_modal_js_scroll__WEBPACK_IMPORTED_MODULE_8__.lockModalScroll)(preserveScrollGap);
  }

  static unlockPage() {
    (0,_component_modal_js_scroll__WEBPACK_IMPORTED_MODULE_8__.unlockModalScroll)(SfModal.lockState);
    SfModal.lockState = null;
  }

}

SfModal.define("sf-modal");
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "e45eac6c719d"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderModalTemplate: () => (/* binding */ renderModalTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ddf1cdb42ecc");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);


function joinClasses(...parts) {
  return parts.filter(Boolean).join(' ').trim();
}

function overlayClasses(context) {
  const blurClass = context.blur ? `backdrop-blur-${context.blurType}` : context.overlayPreset === 'focus' ? 'backdrop-blur-small' : '';
  return joinClasses(`sf-modal-overlay--${context.overlayPreset}`, blurClass);
}

function renderModalTemplate(context) {
  const isInline = context.display === 'inline';
  const hasRemoteContent = Boolean(context.src) && (context.mode === 'ajax' || context.mode === 'iframe');
  const showHeader = context.showHeader !== false;
  const hasHeaderSlot = context.hasHeaderContent;
  const titleId = `${context.modalId}-title`;
  const accessibleLabel = context.ariaLabel || (hasHeaderSlot || !showHeader ? context.title : '');
  const hasContentSlot = context.hasContentContent;
  const hasFooterSlot = context.hasFooterContent && context.showFooter;
  const panelStyle = [context.width ? `--sf-modal-width:${context.width}` : '', context.height ? `--sf-modal-height:${context.height}` : ''].filter(Boolean).join(';');
  const surfaceStyle = [context.surfacePadding ? `--sf-modal-surface-padding:${context.surfacePadding}` : ''].filter(Boolean).join(';');
  const modalStyle = [context.modalZIndex ? `z-index:${context.modalZIndex}` : ''].filter(Boolean).join(';');
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div
                id=${context.modalId}
                class=${joinClasses('sf-modal', `sf-modal--position-${context.position}`, // Legacy alias: the misspelt class the modal wrote before;
  // kept until contracts/changes/journal.json removes it.
  `sf-modal--positon-${context.position}`, isInline ? 'sf-modal--inline inline-block w-full' : 'fixed top-0 inline-start-0 w-full h-full z-9 p-3 items-cross-center content-main-center', context.open ? 'flex' : 'hidden', !isInline && context.animate && 'animate', context.rootClass)}
                style=${modalStyle}
                role=${isInline ? 'region' : 'dialog'}
                aria-modal=${isInline || context.minimized ? 'false' : 'true'}
                aria-hidden=${context.open && !context.minimized ? 'false' : 'true'}
                ?inert=${!context.open || context.minimized}
                aria-label=${accessibleLabel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                aria-labelledby=${accessibleLabel ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : titleId}
                data-sf-modal-id=${context.modalId}
                data-sf-modal-position=${context.position}
                data-sf-modal-fullscreen=${String(context.fullscreen)}
                data-sf-modal-display=${context.display}
                data-sf-modal-state=${isInline ? 'inline' : context.modalState}
                data-sf-modal-hidden=${String(context.minimized)}
                data-sf-modal-overlay-preset=${context.overlayPreset}
        >
            <div
                    class=${joinClasses('absolute top-0 inline-start-0 w-full h-full', overlayClasses(context), context.overlayClass, (!context.overlay || isInline) && 'hidden')}
                    data-sf-modal-overlay
                    data-sf-modal-overlay-preset=${context.overlayPreset}
            ></div>

            <section
                    class=${joinClasses('relative overflow-visible', context.panelClass)}
                    style=${panelStyle}
                    data-sf-modal-panel
                    ?data-sf-modal-has-width=${Boolean(context.width)}
                    ?data-sf-modal-has-height=${Boolean(context.height)}
                    tabindex="-1"
            >
                <div
                        class=${joinClasses('sf-modal-surface flex flex-col', !isInline && 'sf-modal-surface--elevated', context.surfaceClass)}
                        style=${surfaceStyle}
                        data-sf-modal-surface
                >
                    ${showHeader ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                                <header
                                        class=${joinClasses('sf-modal-header flex items-start min-w-0', context.headerClass)}
                                >
                                    <div class="sf-modal-header-content">${hasHeaderSlot ? context.headerContent : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<h2 id=${titleId} class="title-3 m-0">${context.title}</h2>`}</div>
                                    ${context.hide && !isInline ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                                                <button
                                                        type="button"
                                                        class=${joinClasses('sf-icon-button sf-icon-button--icon sf-modal-header-action sf-modal-hide-button sf-modal-hide-button--inline-end sf-icon-button--link sf-icon-button--on-surface sf-icon-button--size-1/3 m-0', context.hideModifier)}
                                                        aria-label=${context.minimizeText}
                                                        data-sf-modal-hide=${context.modalId}
                                                        @click=${context.onHideClick}
                                                >
                                                    <span class="sf-modal-hide-icon" aria-hidden="true"></span>
                                                </button>
                                            ` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                                    ${context.showClose ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                                                <button
                                                        type="button"
                                                        class=${joinClasses('sf-icon-button sf-modal-header-action sf-modal-close-button sf-modal-close-button--inline-end sf-icon-button--close sf-icon-button--link sf-icon-button--on-surface sf-icon-button--size-1/3 m-0', context.closeClass)}
                                                        aria-label=${context.closeText}
                                                        data-sf-modal-close=${context.modalId}
                                                        @click=${context.onCloseClick}
                                                >
                          <span
                                  class="sf-close sf-close--size-1/3 flex justify-center items-center"
                                  aria-hidden="true"
                          >
                            <span class="sf-close-icon"></span>
                          </span>
                                                </button>
                                            ` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                                </header>
                            ` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}

                    <div
                            class="sf-modal-body flex flex-col gap-1 min-w-0 overflow-visible"
                            data-sf-modal-body
                    >
                        <div
                                class="sf-modal-body-viewport min-w-0 overflow-visible"
                                data-sf-modal-body-viewport
                        >
                            <div
                                    class=${joinClasses('sf-modal-body-scroll h-full min-w-0 overflow-y-auto flex flex-col gap-1 p-1/4', context.bodyClass)}
                                    data-sf-modal-body-scroll
                            >
                                ${hasRemoteContent ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                                            <div
                                                    class="sf-modal-content-placeholder flex flex-col gap-2 min-h-8 items-cross-center content-main-center"
                                                    data-sf-modal-content-placeholder
                                            >
                                                ${context.remoteContent}
                                            </div>
                                        ` : hasContentSlot ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                                                    <div
                                                            class=${joinClasses('sf-modal-content flex flex-col gap-2', context.contentClass)}
                                                    >
                                                        ${context.contentContent}
                                                    </div>
                                                ` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<p class="m-0 text-2">${context.text}</p>`}
                            </div>
                        </div>

                        ${hasFooterSlot ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                                    <div
                                            class=${joinClasses('sf-modal-footer flex flex-wrap gap-2', context.footerClass)}
                                    >
                                        ${context.footerContent}
                                    </div>
                                ` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    </div>
                </div>
            </section>
        </div>
    `;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "7b69af8ef2e5"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit/directives/unsafe-html.js") : new Promise((resolve) => globalThis.addEventListener("sf-runtime-ready", () => resolve(globalThis.SF.runtimeModule("lit/directives/unsafe-html.js")), { once: true })));

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
/******/ 	let __webpack_exports__ = __webpack_require__("f98b7a216869");
/******/
/******/ })()
;