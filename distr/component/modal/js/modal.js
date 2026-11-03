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
  const root = (modal && 'modalRoot' in modal ? modal.modalRoot : modal?.getModalRoot?.()) || modal?.template;
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

/***/ "d1e2388bb47f"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Modal: () => (/* binding */ Modal)
/* harmony export */ });
/* harmony import */ var _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d7f974466839");
/* harmony import */ var _register_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("58661bec99a6");
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("8489d1f5bab4");
/* harmony import */ var _focus__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("c8d66dd2c299");
/* harmony import */ var _closing__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("3f3a6e2680d5");
/* harmony import */ var _motion__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("201fd0b17b8b");
/* harmony import */ var _spinner_js_spinner_draw__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("50d2a204ba4c");
/* harmony import */ var _stack__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("93025a68d8ab");
/* harmony import */ var _core_js_layer_stack__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("78628e837a32");






 // A box that holds its own overlays; a modal in it covers the box, not the
// viewport, and leaves the page scrollable (sf-modal and sf-drawer read the
// same attribute; the drawer's older name until 2026-12-01).

const OVERLAY_CONTAINER = '[data-sf-overlay-container], [data-sf-drawer-container]';



function joinClasses(...parts) {
  return parts.filter(Boolean).join(' ').trim();
}

function normalizePosition(value = 'center') {
  const normalized = String(value || 'center').trim().toLowerCase();
  return ['center', 'left', 'right', 'inline-start', 'inline-end', 'top', 'bottom'].includes(normalized) ? normalized : 'center';
}

function normalizeBlurType(value = 'medium') {
  const normalized = String(value || 'medium').trim().toLowerCase();
  return ['none', 'small', 'medium', 'large'].includes(normalized) ? normalized : 'medium';
}

function getBlurClass(type = 'medium') {
  return `backdrop-blur-${normalizeBlurType(type)}`;
}

function isBlurTypeValue(value) {
  return ['none', 'small', 'medium', 'large'].includes(String(value || '').trim().toLowerCase());
}

function normalizeCssValue(value) {
  return String(value || '').trim();
}

function normalizeMode(value) {
  const normalized = String(value || 'inline').trim().toLowerCase();
  return ['inline', 'ajax', 'iframe'].includes(normalized) ? normalized : 'inline';
}

function normalizeDisplay(value) {
  const normalized = String(value || 'modal').trim().toLowerCase();
  return ['modal', 'inline'].includes(normalized) ? normalized : 'modal';
} // An untitled window was headed and named «Modal» on every page; it takes the
// page language's word instead, as the Smart window does.
// The loading state and its failure speak the page's language too: they said
// "Loading..." and "Failed to load content" on every page (simai/ui-source#11
// follow-up). The words are sf-modal's, so one registration covers both.


const UNTITLED = {
  en: {
    title: 'Dialog',
    close: 'Close',
    loading: 'Loading…',
    loadFailed: 'Failed to load content',
    frameFailed: 'Failed to load iframe content'
  },
  ru: {
    title: 'Окно',
    close: 'Закрыть',
    loading: 'Загрузка…',
    loadFailed: 'Не удалось загрузить содержимое',
    frameFailed: 'Не удалось загрузить встроенную страницу'
  }
}; // The node the words are looked up from: the modal once it is on the page,
// else the document, which is where a modal not yet attached will be.

const modalText = (key, node) => (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_2__.pageText)(UNTITLED, key, node?.isConnected ? node : document.documentElement, 'sf-modal');

const untitled = root => (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_2__.pageText)(UNTITLED, 'title', root);

class Modal extends _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__.ComponentObserver {
  static componentName = 'Modal';
  static registry = new Map();
  static globalBound = false;
  static stack = [];
  static openCount = 0;
  static uid = 0;
  static lockState = null; // Kept for code that reads it; the z-index comes from the core's one layer
  // scale (--sf-z-index-layer, default 9000).

  static baseZIndex = 9000;

  static getTopModal() {
    return (0,_stack__WEBPACK_IMPORTED_MODULE_7__.getTopModalLayer)();
  } // Whether this modal is the top layer of the document (layer-stack.js): a
  // drawer or a list opened from it stands above it.


  static isTopModal(modal) {
    return (0,_stack__WEBPACK_IMPORTED_MODULE_7__.isTopModalLayer)(modal);
  }

  static addToStack(modal) {
    if (!modal || modal.display === 'inline') {
      return;
    }

    Modal.stack = Modal.stack.filter(item => item !== modal);
    Modal.stack.push(modal);
    Modal.openCount = Modal.stack.length;
    (0,_stack__WEBPACK_IMPORTED_MODULE_7__.addModalLayer)(modal);
  }

  static removeFromStack(modal) {
    if (!modal || modal.display === 'inline') {
      return;
    }

    Modal.stack = Modal.stack.filter(item => item !== modal);
    Modal.openCount = Modal.stack.length;
    (0,_stack__WEBPACK_IMPORTED_MODULE_7__.removeModalLayer)(modal);
  }

  static bringToFront(modal) {
    if (!modal || modal.display === 'inline' || !Modal.stack.includes(modal)) {
      return;
    }

    Modal.stack = Modal.stack.filter(item => item !== modal);
    Modal.stack.push(modal);
    (0,_stack__WEBPACK_IMPORTED_MODULE_7__.raiseModalLayer)(modal);
  }

  static updateStackStyles() {
    (0,_stack__WEBPACK_IMPORTED_MODULE_7__.updateModalLayers)();
  }

  constructor(props) {
    super(props);
    const params = this.params || {};
    this.modalId = this.id || params.id || `sf-modal-${++Modal.uid}`;
    this.isOpen = false;
    this.lastActive = null;
    this.root = params.root || null; // The box the modal covers: an element or a selector. Without one the
    // modal covers the viewport -- or, when it is opened from inside an
    // overlay container, that box (DEV, 2026-10-18).

    this.container = params.container || null;
    this.overlay = this.toBoolean(params.overlay, true);
    this.unclose = this.toBoolean(params.unclose, false);
    this.showClose = this.toBoolean(params.showClose, true) && !this.unclose;
    this.showFooter = this.toBoolean(params.showFooter, true);
    this.closeOnEsc = this.toBoolean(params.closeOnEsc, true) && !this.unclose;
    this.closeOnOverlay = this.toBoolean(params.closeOnOverlay, true) && !this.unclose;
    this.preserveScrollGap = this.toBoolean(params.preserveScrollGap, true);
    this.autoload = this.toBoolean(params.autoload, false);
    this.position = normalizePosition(params.position);
    this.fullscreen = this.toBoolean(params.fullscreen, false);
    this.mode = normalizeMode(params.mode);
    this.display = normalizeDisplay(params.display);
    this.src = params.src || '';
    this.preload = this.toBoolean(params.preload, true);
    this._fetchController = null;
    this._contentLoaded = false;
    this._contentError = null;
    this._loadingTimer = null;
    this._loadingShown = false;
    this._loadingDebounceMs = 500;
    this.blur = isBlurTypeValue(params.blur) ? true : this.toBoolean(params.blur, false);
    this.hasCustomBlurType = isBlurTypeValue(params.blurType) || isBlurTypeValue(params.blur);
    this.blurType = normalizeBlurType(params.blurType || (isBlurTypeValue(params.blur) ? params.blur : ''));
    this.onOverlayClick = this.onOverlayClick.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this._modalState = 'closed';
    this._stackIndex = -1;
    this._closeTimer = null;
    this._closeTransitionAbort = null;
    this.template = this.buildTemplate(params);
    this.template.id = this.modalId;
    this.template.setAttribute('data-sf-modal-id', this.modalId);
    this.template.setAttribute('aria-hidden', 'true');
    this.init();
  } // The box given as `container`, or the overlay container `opener` stands in,
  // or the body.


  overlayHomeFor(opener = null) {
    let box = this.container;
    if (typeof box === 'string') box = document.querySelector(box);

    if (box instanceof Element) {
      if (!box.matches(OVERLAY_CONTAINER)) box.setAttribute('data-sf-overlay-container', '');
      return box;
    }

    const from = opener instanceof Element ? opener.closest(OVERLAY_CONTAINER) : null;
    return from || document.body;
  }

  get overlayHome() {
    return this.overlayHomeFor();
  }

  get inContainer() {
    return Boolean(this.template?.parentElement?.closest(OVERLAY_CONTAINER));
  }

  placeIn(home) {
    if (this.display === 'inline' || this.root || !this.template || !home) return;
    if (this.template.parentElement !== home) home.append(this.template);
  }

  emitEvent(eventName, {
    cancelable = false,
    detail = {}
  } = {}) {
    const payload = {
      modal: this,
      id: this.modalId,
      isOpen: this.isOpen,
      ...detail
    };
    let prevented = false;

    if (this.template) {
      const event = new CustomEvent(eventName, {
        bubbles: true,
        cancelable,
        detail: payload
      });
      this.template.dispatchEvent(event);
      prevented = prevented || event.defaultPrevented;
    }

    if (typeof window !== 'undefined') {
      const windowEvent = new CustomEvent(eventName, {
        cancelable: false,
        detail: payload
      });
      window.dispatchEvent(windowEvent);
    }

    return !prevented;
  }

  runCallback(callbackName, payload = {}) {
    const handler = this.params?.[callbackName];

    if (typeof handler === 'function') {
      return handler({
        modal: this,
        id: this.modalId,
        isOpen: this.isOpen,
        ...payload
      });
    }

    return undefined;
  }

  emitBeforeOpen() {
    const modernAllowed = this.emitEvent('modal:before-open', {
      cancelable: true,
      detail: {
        phase: 'before-open'
      }
    });
    const legacyAllowed = this.emitEvent('SFModalBeforeOpenWindow', {
      cancelable: true,
      detail: {
        phase: 'before-open'
      }
    });

    if (!modernAllowed || !legacyAllowed) {
      return false;
    }

    const beforeOpenResult = this.runCallback('beforeOpen', {
      phase: 'before-open'
    });
    const beforeOpenWindowResult = this.runCallback('beforeOpenWindow', {
      phase: 'before-open'
    });
    return beforeOpenResult !== false && beforeOpenWindowResult !== false;
  }

  emitAfterOpen() {
    this.emitEvent('modal:after-open', {
      detail: {
        phase: 'after-open'
      }
    });
    this.emitEvent('SFModalAfterOpenWindow', {
      detail: {
        phase: 'after-open'
      }
    });
    this.runCallback('afterOpen', {
      phase: 'after-open'
    });
    this.runCallback('afterOpenWindow', {
      phase: 'after-open'
    });
  }

  emitBeforeClose() {
    const modernAllowed = this.emitEvent('modal:before-close', {
      cancelable: true,
      detail: {
        phase: 'before-close'
      }
    });
    const legacyAllowed = this.emitEvent('SFModalBeforeCloseWindow', {
      cancelable: true,
      detail: {
        phase: 'before-close'
      }
    });

    if (!modernAllowed || !legacyAllowed) {
      return false;
    }

    const beforeCloseResult = this.runCallback('beforeClose', {
      phase: 'before-close'
    });
    const beforeCloseWindowResult = this.runCallback('beforeCloseWindow', {
      phase: 'before-close'
    });
    return beforeCloseResult !== false && beforeCloseWindowResult !== false;
  }

  emitAfterClose() {
    this.emitEvent('modal:after-close', {
      detail: {
        phase: 'after-close'
      }
    });
    this.emitEvent('SFModalAfterCloseWindow', {
      detail: {
        phase: 'after-close'
      }
    });
    this.runCallback('afterClose', {
      phase: 'after-close'
    });
    this.runCallback('afterCloseWindow', {
      phase: 'after-close'
    });
  }

  toBoolean(value, fallback) {
    if (value === undefined || value === null) {
      return fallback;
    }

    if (typeof value === 'boolean') {
      return value;
    }

    const normalized = `${value}`.trim().toLowerCase();

    if (['1', 'true', 'yes', 'on'].includes(normalized)) {
      return true;
    }

    if (['0', 'false', 'no', 'off'].includes(normalized)) {
      return false;
    }

    return fallback;
  }

  getBlurClasses() {
    return this.hasCustomBlurType ? [getBlurClass(this.blurType)] : [];
  }

  setOverlay(nextValue) {
    this.overlay = this.toBoolean(nextValue, true);
    const overlay = this.template?.querySelector('[data-sf-modal-overlay]');

    if (!overlay) {
      return this;
    }

    overlay.classList.toggle('hidden', !this.overlay || this.display === 'inline');
    return this;
  }

  buildTemplate(params) {
    const isInline = this.display === 'inline';
    const root = document.createElement('div'); // sf-modal--positon-* is the legacy misspelt alias of sf-modal--position-*,
    // written beside it until contracts/changes/journal.json removes it.

    root.className = isInline ? `sf-modal sf-modal--inline sf-modal--position-${this.position} sf-modal--positon-${this.position} inline-block w-full` : `sf-modal sf-modal--position-${this.position} sf-modal--positon-${this.position} hidden fixed top-0 inline-start-0 w-full h-full z-9 p-3 items-cross-center content-main-center`;
    root.setAttribute('role', isInline ? 'region' : 'dialog');
    root.setAttribute('aria-modal', isInline ? 'false' : 'true');
    root.setAttribute('data-sf-modal-position', this.position);
    root.setAttribute('data-sf-modal-fullscreen', String(this.fullscreen));
    root.setAttribute('data-sf-modal-display', this.display);
    root.setAttribute('data-sf-modal-state', isInline ? 'inline' : 'closed');
    const overlay = document.createElement('div');
    overlay.className = joinClasses('absolute top-0 inline-start-0 w-full h-full', this.blur ? this.hasCustomBlurType ? this.getBlurClasses().join(' ') : 'bg-surface-overlay' : 'bg-black opacity-6', params.overlayClass);
    overlay.setAttribute('data-sf-modal-overlay', '');

    if (!this.overlay || isInline) {
      overlay.classList.add('hidden');
    }

    const panel = document.createElement('section');
    panel.className = joinClasses('relative overflow-visible', params.panelClass);
    panel.setAttribute('data-sf-modal-panel', '');
    const width = normalizeCssValue(params.width);
    const height = normalizeCssValue(params.height);

    if (width) {
      panel.style.setProperty('--sf-modal-width', width);
      panel.setAttribute('data-sf-modal-has-width', '');
    }

    if (height) {
      panel.style.setProperty('--sf-modal-height', height);
      panel.setAttribute('data-sf-modal-has-height', '');
    }

    const surface = document.createElement('div');
    surface.className = joinClasses(isInline ? 'bg-surface border border-outline-variant radius-surface p-2 flex flex-col gap-1 min-w-0' : 'bg-surface border border-outline-variant radius-surface shadow-3 p-2 flex flex-col gap-1 min-w-0', params.surfaceClass);
    surface.setAttribute('data-sf-modal-surface', '');
    const header = document.createElement('header');
    header.className = joinClasses('sf-modal-header flex items-start min-w-0 border-b border-outline-variant gap-1', params.headerClass);

    if (Array.isArray(params.headerNodes) && params.headerNodes.length) {
      root.setAttribute('aria-label', params.title || untitled(root));
      params.headerNodes.forEach(node => {
        if (node instanceof Node) {
          header.append(node);
        }
      });
    } else {
      const title = document.createElement('h2');
      title.id = `${this.modalId}-title`;
      root.setAttribute('aria-labelledby', title.id);
      title.className = 'sf-modal-header-content title-3 m-0';
      title.textContent = params.title || untitled(root);
      header.append(title);

      if (this.showClose) {
        const closeButton = document.createElement('button');
        closeButton.type = 'button';
        closeButton.className = joinClasses('sf-icon-button sf-modal-header-action sf-modal-close-button sf-icon-button--close sf-icon-button--link sf-icon-button--on-surface sf-icon-button--size-1/3 m-0', params.closeClass); // The page language's word, as the Smart window has; the glyph inside is
        // decoration and carries no name of its own.

        closeButton.setAttribute('aria-label', (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_2__.pageText)(UNTITLED, 'close', closeButton.isConnected ? closeButton : document.documentElement));
        closeButton.setAttribute('data-sf-modal-close', this.modalId);
        closeButton.innerHTML = '            <span\n' + '              class="sf-close sf-close--size-1/3 flex justify-center items-center"\n' + '              aria-hidden="true"\n' + '            >\n' + '              <span class="sf-close-icon"></span>\n' + '            </span>';
        header.append(closeButton);
      }
    }

    const body = document.createElement('div');
    body.className = 'sf-modal-body flex flex-col gap-1 min-w-0 overflow-visible';
    body.setAttribute('data-sf-modal-body', '');
    const bodyViewport = document.createElement('div');
    bodyViewport.className = 'sf-modal-body-viewport min-w-0 overflow-visible';
    bodyViewport.setAttribute('data-sf-modal-body-viewport', '');
    const bodyScroll = document.createElement('div');
    bodyScroll.className = joinClasses('sf-modal-body-scroll h-full min-w-0 overflow-y-auto flex flex-col gap-1 p-1/4', params.bodyClass);
    bodyScroll.setAttribute('data-sf-modal-body-scroll', ''); // Placeholder для ajax-контента (loading/error)

    const contentPlaceholder = document.createElement('div');
    contentPlaceholder.className = 'sf-modal-content-placeholder flex flex-col gap-2 min-h-8 items-cross-center content-main-center';
    contentPlaceholder.setAttribute('data-sf-modal-content-placeholder', '');

    if ((this.mode === 'ajax' || this.mode === 'iframe') && this.src) {
      // Ajax/iframe-режим: показываем loading с debounce, контент загрузится в init()
      this._scheduleLoading(contentPlaceholder);

      bodyScroll.append(contentPlaceholder);
    } else if (Array.isArray(params.contentNodes) && params.contentNodes.length) {
      const content = document.createElement('div');
      content.className = joinClasses('sf-modal-content flex flex-col gap-2', params.contentClass);
      params.contentNodes.forEach(node => {
        if (node instanceof Node) {
          content.append(node);
        }
      });
      bodyScroll.append(content);
    }

    if (Array.isArray(params.footerNodes) && params.footerNodes.length && this.showFooter) {
      const footer = document.createElement('div');
      footer.className = joinClasses('sf-modal-footer flex flex-wrap', params.footerClass);
      params.footerNodes.forEach(node => {
        if (node instanceof Node) {
          footer.append(node);
        }
      });
      body.append(footer);
    } else if (typeof params.html === 'string' && params.html.trim()) {
      bodyScroll.innerHTML = params.html;
    } else if (this.mode === 'ajax' && this.src || this.mode === 'iframe' && this.src) {// Для ajax/iframe-режима текст не показываем — там loading/error
    } else {
      const text = document.createElement('p');
      text.className = 'm-0 text-2';
      text.textContent = params.text || '';
      bodyScroll.append(text);
    }

    bodyViewport.append(bodyScroll);
    body.prepend(bodyViewport);
    surface.append(header, body);
    panel.append(surface);
    root.append(overlay, panel);
    return root;
  } // --- Ajax API ---


  _scheduleLoading(container) {
    this._cancelLoadingTimer();

    this._loadingShown = false;
    this._loadingTimer = setTimeout(() => {
      this._showLoading(container);

      this._loadingShown = true;
    }, this._loadingDebounceMs);
  }

  _cancelLoadingTimer() {
    if (this._loadingTimer) {
      clearTimeout(this._loadingTimer);
      this._loadingTimer = null;
    }
  }

  _finishLoading() {
    this._cancelLoadingTimer();
  }

  _showLoading(container) {
    container.innerHTML = '';
    const loading = document.createElement('div');
    loading.className = 'sf-modal-loading flex flex-col gap-2 items-cross-center content-main-center p-4';
    loading.setAttribute('data-sf-modal-state', 'loading');
    const words = modalText('loading', this.template);
    loading.setAttribute('role', 'status');
    loading.setAttribute('aria-label', words);
    const text = document.createElement('p');
    text.className = 'm-0 text-2 color-on-surface-variant';
    text.textContent = words;
    loading.append(text); // The Framework's one spinner, in the page's look (simai/ui-source#11);
    // the modal sheet draws its slot.

    loading.prepend((0,_spinner_js_spinner_draw__WEBPACK_IMPORTED_MODULE_6__.createInlineSpinner)({
      className: 'sf-modal-spinner'
    }));
    container.append(loading);
  }

  _showError(container, message) {
    container.innerHTML = '';
    const error = document.createElement('div');
    error.className = 'sf-modal-error flex flex-col gap-2 items-cross-center content-main-center p-4';
    error.setAttribute('data-sf-modal-state', 'error');
    error.innerHTML = `
      <div class="sf-modal-error-icon text-4 color-error">⚠</div>
      <p class="sf-modal-error-text m-0 text-2 color-error">${this.escapeHtml(message || modalText('loadFailed', this.template))}</p>
    `;
    container.append(error);
  }

  _abortFetch() {
    if (this._fetchController) {
      this._fetchController.abort();

      this._fetchController = null;
    }
  }

  async _loadContent() {
    if (!this.src) {
      return;
    }

    if (this.mode === 'iframe') {
      this._loadIframe();

      return;
    }

    if (this.mode === 'ajax') {
      this._loadAjax();
    }
  }

  async _loadAjax() {
    // Проверяем, является ли src DOM-селектором
    if (this.src.startsWith('#')) {
      const sourceEl = document.querySelector(this.src);

      if (sourceEl) {
        this._emitBeforeContentUpload();

        const cloned = sourceEl.cloneNode(true);
        cloned.removeAttribute('id');

        this._finishLoading();

        this._replaceContentWithNode(cloned);

        this._contentLoaded = true;

        this._emitAfterContentUpload();
      } else {
        this._contentError = `Element not found: ${this.src}`;

        this._finishLoading();

        this._showContentError();
      }

      return;
    } // Fetch по URL


    this._abortFetch();

    const controller = new AbortController();
    this._fetchController = controller;

    try {
      this._emitBeforeContentUpload();

      const response = await fetch(this.src, {
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const html = await response.text();
      this._contentLoaded = true;

      this._finishLoading();

      this._replaceContentWithHtml(html);

      this._fetchController = null;

      this._emitAfterContentUpload();
    } catch (error) {
      if (error.name === 'AbortError') {
        // Aborted by a newer load (open() reloads what the constructor began
        // to preload): the loading state is that load's, and cancelling its
        // timer here meant a modal opened during the preload never showed it.
        if (!this._fetchController || this._fetchController === controller) {
          this._finishLoading();
        }

        return; // Загрузка отменена — не показываем ошибку
      }

      this._contentError = error.message;

      this._finishLoading();

      this._showContentError();
    }
  }

  _loadIframe() {
    this._emitBeforeContentUpload();

    const bodyScroll = this.template?.querySelector('[data-sf-modal-body-scroll]');

    if (!bodyScroll) {
      return;
    } // Удаляем предыдущий контент (включая placeholder)


    bodyScroll.innerHTML = '';
    const iframe = document.createElement('iframe');
    iframe.className = 'sf-modal-iframe w-full border-0 radius-surface';
    iframe.src = this.src;
    iframe.setAttribute('data-sf-modal-iframe', '');
    iframe.setAttribute('allowfullscreen', '');
    iframe.style.minHeight = 'var(--sf-modal-iframe-min-height)';
    iframe.style.height = '100%';
    iframe.addEventListener('load', () => {
      this._contentLoaded = true;

      this._finishLoading();

      this._emitAfterContentUpload();
    });
    iframe.addEventListener('error', () => {
      this._contentError = modalText('frameFailed', this.template);

      this._finishLoading();

      this._showContentError();
    });
    bodyScroll.append(iframe);
  }

  _replaceContentWithNode(node) {
    const bodyScroll = this.template?.querySelector('[data-sf-modal-body-scroll]');

    if (!bodyScroll) {
      return;
    }

    bodyScroll.innerHTML = '';
    const wrapper = document.createElement('div');
    wrapper.className = 'sf-modal-content flex flex-col gap-2';
    wrapper.append(node);
    bodyScroll.append(wrapper);
  }

  _replaceContentWithHtml(html) {
    const bodyScroll = this.template?.querySelector('[data-sf-modal-body-scroll]');

    if (!bodyScroll) {
      return;
    }

    bodyScroll.innerHTML = '';
    const wrapper = document.createElement('div');
    wrapper.className = 'sf-modal-content flex flex-col gap-2';
    wrapper.innerHTML = html;
    bodyScroll.append(wrapper);
  }

  _showContentError() {
    const bodyScroll = this.template?.querySelector('[data-sf-modal-body-scroll]');

    if (!bodyScroll) {
      return;
    }

    bodyScroll.innerHTML = '';
    const error = document.createElement('div');
    error.className = 'sf-modal-error flex flex-col gap-2 items-cross-center content-main-center p-4';
    error.setAttribute('data-sf-modal-state', 'error');
    error.innerHTML = `
      <div class="sf-modal-error-icon text-4 color-error">⚠</div>
      <p class="sf-modal-error-text m-0 text-2 color-error">${this.escapeHtml(this._contentError || modalText('loadFailed', this.template))}</p>
    `;
    bodyScroll.append(error);
  }

  _emitBeforeContentUpload() {
    this.emitEvent('modal:before-content-upload', {
      detail: {
        src: this.src
      }
    });
    this.runCallback('beforeContentUpload', {
      src: this.src
    });
  }

  _emitAfterContentUpload() {
    this.emitEvent('modal:after-content-upload', {
      detail: {
        src: this.src
      }
    });
    this.runCallback('afterContentUpload', {
      src: this.src
    });
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  init() {
    // Inline mode — рендерим прямо в контейнер sf-modal, не переносим в body
    if (this.display === 'inline') {
      this._modalState = 'open';
      this.template.setAttribute('data-sf-modal-state', 'open');
      this.template.classList.remove('hidden'); // Если open="false" — скрываем сразу

      if (!this.toBoolean(this.params?.open, true)) {
        this.isOpen = false;
        this._modalState = 'closed';
        this.template.setAttribute('data-sf-modal-state', 'closed');
        this.template.classList.add('hidden');
      } else {
        this.isOpen = true;
      }

      this.template.setAttribute('aria-hidden', String(!this.isOpen));

      if (this.root) {
        this.root.append(this.template);
      }

      Modal.registry.set(this.modalId, this); // Загружаем контент если нужно

      if ((this.mode === 'ajax' || this.mode === 'iframe') && this.src && this.preload !== false) {
        this._loadContent();
      }

      return;
    }

    if (!this.template.isConnected) {
      this.overlayHome.append(this.template);
    } // Inline mode — не привязываем глобальные события, не добавляем в body


    if (this.display === 'inline') {
      this.isOpen = true;
      this._modalState = 'open';
      this.template.setAttribute('data-sf-modal-state', 'inline');
      this.template.classList.remove('hidden');
      Modal.registry.set(this.modalId, this); // Загружаем контент если нужно

      if ((this.mode === 'ajax' || this.mode === 'iframe') && this.src && this.preload !== false) {
        this._loadContent();
      }

      return;
    } // Escape and Tab come through the document layer stack, to the top layer.


    this.template.addEventListener('click', this.onOverlayClick);
    Modal.registry.set(this.modalId, this);
    Modal.bindGlobalEvents();
    const shouldOpen = this.toBoolean(this.params?.open, false) || this.autoload;

    if (shouldOpen) {
      requestAnimationFrame(() => {
        this.open({
          animate: false
        });
      });
    } // Загружаем ajax/iframe-контент только если preload !== false


    if ((this.mode === 'ajax' || this.mode === 'iframe') && this.src && this.preload !== false) {
      this._loadContent();
    }
  }

  destroyInternal() {
    this._abortFetch();

    this._cancelLoadingTimer();

    this.cancelCloseTransition(); // Inline mode — не делаем finishClose

    if (this.display !== 'inline' && (this.isOpen || this._modalState === 'closing')) {
      this._modalState = 'closing';
      this.finishClose();
    }

    Modal.removeFromStack(this);
    this.template.removeEventListener('click', this.onOverlayClick);
    Modal.registry.delete(this.modalId);
  }

  onOverlayClick(event) {
    const isOverlay = event.target === this.template.querySelector('[data-sf-modal-overlay]');

    if (isOverlay && this.closeOnOverlay && Modal.isTopModal(this)) {
      this.close();
    }
  } // Handed Escape and Tab by the layer stack while this is the top layer.
  // Answers true when it took Escape.


  onKeyDown(event) {
    if (!this.isOpen && this._modalState !== 'closing') {
      return false;
    }

    if (!Modal.isTopModal(this)) {
      return false;
    }

    if (event.key === 'Escape' && this.closeOnEsc && this._modalState !== 'closing' && !event.defaultPrevented) {
      this.close();
      return true;
    }

    if (event.key === 'Tab') {
      this.trapFocus(event);
    }

    return false;
  }

  trapFocus(event) {
    if (!Modal.isTopModal(this)) {
      return;
    }

    const panel = this.template.querySelector('[data-sf-modal-panel]');
    (0,_focus__WEBPACK_IMPORTED_MODULE_3__.trapModalFocus)(panel, event);
  }

  focusFirst() {
    if (this.display !== 'inline' && !Modal.isTopModal(this)) {
      return;
    }

    const panel = this.template.querySelector('[data-sf-modal-panel]');

    if (!panel) {
      return;
    }

    panel.setAttribute('tabindex', '-1');
    panel.focus();
  }

  applyStackPosition(index = (0,_stack__WEBPACK_IMPORTED_MODULE_7__.getModalLayerIndex)(this)) {
    this._stackIndex = index;

    if (!this.template || this.display === 'inline') {
      return this;
    }

    if (index < 0) {
      this.template.style.removeProperty('z-index');
      this.template.style.removeProperty('--sf-modal-stack-index');
      return this;
    }

    this.template.style.setProperty('--sf-modal-stack-index', String(index));
    this.template.style.zIndex = String((0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_8__.layerZIndexAt)(index));
    return this;
  }

  open(options = {}) {
    const {
      animate = true
    } = typeof options === 'boolean' ? {
      animate: options
    } : options; // Inline mode — не скрываем, не делаем scroll lock

    if (this.display === 'inline') {
      if (this.isOpen) {
        return;
      }

      if (!this.emitBeforeOpen()) {
        return;
      }

      this.isOpen = true;
      this._modalState = 'open';
      this.template.setAttribute('data-sf-modal-state', 'open');
      this.template.classList.remove('hidden');
      this.template.setAttribute('aria-hidden', 'false');
      this.emitAfterOpen();
      return;
    }

    if (this.isOpen) {
      Modal.bringToFront(this);
      this.cancelCloseTransition();
      return;
    }

    if (!this.emitBeforeOpen()) {
      return;
    } // Если src был изменён пока модалка была закрыта — загружаем контент


    if ((this.mode === 'ajax' || this.mode === 'iframe') && this.src && !this._contentLoaded && !this._contentError) {
      const bodyScroll = this.template?.querySelector('[data-sf-modal-body-scroll]');

      if (bodyScroll) {
        this._scheduleLoading(bodyScroll);
      }

      this._loadContent();
    } // Reopening cancels a pending close, not the original focus-return target.


    this._releaseClosingContent?.();
    this._releaseClosingContent = null;

    if (this._modalState !== 'closing') {
      this.lastActive = document.activeElement;
      this._focusReturnAncestors = (0,_stack__WEBPACK_IMPORTED_MODULE_7__.captureModalFocusAncestors)(this.lastActive);
      this.placeIn(this.overlayHomeFor(this.lastActive));
    }

    this.cancelCloseTransition();
    this.template.classList.remove('hidden');
    this.template.classList.add('flex');
    this.template.setAttribute('aria-hidden', 'false');
    this.template.classList.toggle('animate', Boolean(animate));
    this.template.setAttribute('data-sf-modal-state', 'opening');
    this.isOpen = true;
    Modal.addToStack(this);

    if (!animate) {
      this._modalState = 'open';
      this.template.setAttribute('data-sf-modal-state', 'open');
      this.focusFirst();
      this.emitAfterOpen();
      return;
    }

    (0,_motion__WEBPACK_IMPORTED_MODULE_5__.scheduleModalFrame)(() => {
      if (!this.isOpen || this._modalState === 'closing') {
        return;
      }

      this._modalState = 'open';
      this.template.setAttribute('data-sf-modal-state', 'open');
      this.focusFirst();
      this.emitAfterOpen();
    });
  }

  close() {
    // Inline mode — просто скрываем через hidden + события
    if (this.display === 'inline') {
      if (!this.emitBeforeClose()) {
        return;
      }

      this.isOpen = false;
      this._modalState = 'closed';
      this.template.setAttribute('data-sf-modal-state', 'closed');
      this.template.classList.add('hidden');
      this.template.setAttribute('aria-hidden', 'true');
      this.emitAfterClose();
      return;
    }

    if (!this.isOpen || this._modalState === 'closing') {
      return;
    }

    if (!this.emitBeforeClose()) {
      return;
    }

    this._modalState = 'closing';
    this.template.setAttribute('data-sf-modal-state', 'closing');
    this.isOpen = false;
    const panel = this.template.querySelector('[data-sf-modal-panel]');
    this._releaseClosingContent = (0,_closing__WEBPACK_IMPORTED_MODULE_4__.freezeModalContent)(panel, Modal.isTopModal(this));
    this._closeTransitionAbort = (0,_motion__WEBPACK_IMPORTED_MODULE_5__.scheduleModalClose)(() => this.template, () => this.finishClose());
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  setSrc(newSrc) {
    this.src = newSrc || '';
    this._contentLoaded = false;
    this._contentError = null;
    this._loadingShown = false;

    this._abortFetch(); // Если модалка не открыта — загрузка произойдёт при open()


    if (!this.template || !this.isOpen) {
      return this;
    } // Показываем loading в bodyScroll при повторной загрузке (с debounce)


    const bodyScroll = this.template?.querySelector('[data-sf-modal-body-scroll]');

    if (bodyScroll) {
      this._scheduleLoading(bodyScroll);
    }

    if ((this.mode === 'ajax' || this.mode === 'iframe') && this.src && this.preload !== false) {
      this._loadContent();
    }

    return this;
  }

  reloadContent() {
    if ((this.mode === 'ajax' || this.mode === 'iframe') && this.src) {
      this._contentLoaded = false;
      this._contentError = null;
      this._loadingShown = false;

      this._abortFetch();

      const bodyScroll = this.template?.querySelector('[data-sf-modal-body-scroll]');

      if (bodyScroll) {
        this._scheduleLoading(bodyScroll);
      }

      this._loadContent();
    }

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

    if (this._modalState === 'closing') {
      this._modalState = 'open';
      this.template.setAttribute('data-sf-modal-state', 'open');
    }
  }

  finishClose() {
    if (this._modalState !== 'closing') {
      return;
    }

    if (this._closeTimer) {
      clearTimeout(this._closeTimer);
      this._closeTimer = null;
    }

    if (this._closeTransitionAbort) {
      this._closeTransitionAbort();

      this._closeTransitionAbort = null;
    }

    this.template.classList.remove('flex');
    this.template.classList.add('hidden');
    this.template.setAttribute('data-sf-modal-state', 'closed');
    this.template.setAttribute('aria-hidden', 'true');
    this._releaseClosingContent?.();
    this._releaseClosingContent = null;
    this._modalState = 'closed';
    const wasTop = Modal.isTopModal(this);
    Modal.removeFromStack(this);
    (0,_stack__WEBPACK_IMPORTED_MODULE_7__.restoreModalLayerFocus)(wasTop, this.lastActive, this._focusReturnAncestors);
    this.emitAfterClose();
  }

  static bindGlobalEvents() {
    if (Modal.globalBound || typeof document === 'undefined') {
      return;
    }

    document.addEventListener('click', event => {
      const openEl = event.target.closest('[data-sf-modal-open]');

      if (openEl) {
        const id = openEl.getAttribute('data-sf-modal-open');
        const modal = Modal.registry.get(id);

        if (modal) {
          modal.open();
        }

        return;
      }

      const closeEl = event.target.closest('[data-sf-modal-close]');

      if (!closeEl) {
        return;
      }

      const id = closeEl.getAttribute('data-sf-modal-close');

      if (id) {
        const modal = Modal.registry.get(id);

        if (modal) {
          modal.close();
        }

        return;
      }

      const modalRoot = closeEl.closest('.sf-modal');

      if (!modalRoot) {
        return;
      }

      const modalId = modalRoot.getAttribute('data-sf-modal-id');
      const modal = Modal.registry.get(modalId);

      if (modal) {
        modal.close();
      }
    });
    Modal.globalBound = true;
  } // Kept for code that calls them: the layer stack takes the page lock itself
  // now, with its default lockPageScroll, while any layer that locks is open.


  static lockPage(preserveScrollGap = true) {
    if (!Modal.lockState) Modal.lockState = (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_8__.lockPageScroll)({
      preserveScrollGap
    });
  }

  static unlockPage() {
    Modal.lockState?.();
    Modal.lockState = null;
  }

}

(0,_register_helper__WEBPACK_IMPORTED_MODULE_1__["default"])('Modal', Modal);


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

/***/ "93025a68d8ab"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addModalLayer: () => (/* binding */ addModalLayer),
/* harmony export */   captureModalFocusAncestors: () => (/* binding */ captureModalFocusAncestors),
/* harmony export */   getModalLayerIndex: () => (/* binding */ getModalLayerIndex),
/* harmony export */   getTopModalLayer: () => (/* binding */ getTopModalLayer),
/* harmony export */   isTopModalLayer: () => (/* binding */ isTopModalLayer),
/* harmony export */   raiseModalLayer: () => (/* binding */ raiseModalLayer),
/* harmony export */   removeModalLayer: () => (/* binding */ removeModalLayer),
/* harmony export */   restoreModalLayerFocus: () => (/* binding */ restoreModalLayerFocus),
/* harmony export */   updateModalLayers: () => (/* binding */ updateModalLayers)
/* harmony export */ });
/* harmony import */ var _focus__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("c8d66dd2c299");
/* harmony import */ var _core_js_layer_stack__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("78628e837a32");
// Ordinary and Smart Modal are separate bundles. They share the one document
// layer stack of the core (layer-stack.js, standard 1.3.8 §19), with every
// other layer -- a drawer, a popover, a list -- not a list of their own: a
// modal opened from a drawer is above it, takes Escape and Tab while it is,
// and gives focus back into the drawer when it closes (simai/ui-source#36,
// #37). Registries, public instance APIs and rendering stay separate.

 // sf-modal's window is its modalRoot (its reader getModalRoot retires, standard
// 1.3.8 §16.13); the class Modal holds its markup in `template`.

const modalRoot = modal => (modal && 'modalRoot' in modal ? modal.modalRoot : modal?.getModalRoot?.()) || modal?.template || null; // The highest modal open: what Modal.getTopModal() names. A drawer or a list
// may stand above it; isTopLayer answers whether it is the top of everything.


function getTopModalLayer() {
  return (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_1__.openLayers)('modal').at(-1) || null;
}

function getModalLayerIndex(modal) {
  return (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_1__.layerIndex)(modal);
} // Focus guards stand around the panel of a modal only while it is the top
// layer; under a drawer or a list they would be tab stops of a layer below.


function syncGuards() {
  const top = (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_1__.topLayer)();
  (0,_focus__WEBPACK_IMPORTED_MODULE_0__.syncModalFocusGuards)(top?.kind === 'modal' ? top.owner : null);
}

function updateModalLayers() {
  for (const owner of (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_1__.openLayers)('modal')) owner.applyStackPosition((0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_1__.layerIndex)(owner));

  syncGuards();
} // A modal inside an overlay container covers that box, not the page, so the
// page stays scrollable while it is open.


const locksPage = modal => !modal.inContainer; // The page lock is the stack's default one (lockPageScroll), which is the
// lock this file's _scroll.js held before: the class, the page's own padding
// plus the gap, and only what it set given back.


function addModalLayer(modal) {
  if ((0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_1__.hasLayer)(modal)) return;
  (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_1__.openLayer)(modal, {
    kind: 'modal',
    locksPage: locksPage(modal),
    preserveScrollGap: modal.preserveScrollGap !== false,
    trapsFocus: true,
    returnTo: modal._lastActive ?? modal.lastActive ?? null,
    root: () => modalRoot(modal),
    focusIn: () => modal.focusFirst?.(),
    onEscape: event => Boolean(modal.onKeyDown?.(event)),
    onTab: event => modal.onKeyDown?.(event),
    // Called on every change of the stack, a drawer's or a list's too.
    place: ({
      index
    }) => {
      modal.applyStackPosition(index);
      syncGuards();
    }
  });
  syncGuards();
}

function removeModalLayer(modal) {
  if (!(0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_1__.hasLayer)(modal)) return; // The modal gives focus back itself, after its closing transition.

  (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_1__.closeLayer)(modal, {
    restoreFocus: false
  });
  modal.applyStackPosition?.(-1);
  syncGuards();
}

function raiseModalLayer(modal) {
  (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_1__.raiseLayer)(modal);
  syncGuards();
}

function captureModalFocusAncestors(node) {
  return (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_1__.landmarksAround)(node);
}

function restoreModalLayerFocus(wasTop, lastActive, ancestors = []) {
  (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_1__.returnLayerFocus)(wasTop, lastActive, ancestors);
}

function isTopModalLayer(modal) {
  return (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_1__.isTopLayer)(modal);
}



/***/ },

/***/ "05f95721a8a3"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d1e2388bb47f");


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
// stroke 2; a spinner still drawn in pixels (the deprecated attributes) passes
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
  pixel = false
} = {}) {
  const cx = width / 2;
  const cy = height / 2;
  const half = Math.min(width, height) / 2;
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
} // The drawing on the icon grid, the one every spinner on the ladder uses.

function createLadderSpinnerSvg(options = {}) {
  return createSpinnerSvg({ ...options,
    width: SPINNER_GRID,
    height: SPINNER_GRID,
    stroke: SPINNER_STROKE,
    dotRadius: null,
    pixel: false
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
  expired
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
  if (removeAfter !== undefined) note.remove_after = removeAfter;
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

/***/ "78628e837a32"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FOCUSABLE: () => (/* binding */ FOCUSABLE),
/* harmony export */   carryLayerOrigin: () => (/* binding */ carryLayerOrigin),
/* harmony export */   closeLayer: () => (/* binding */ closeLayer),
/* harmony export */   focusablesIn: () => (/* binding */ focusablesIn),
/* harmony export */   hasLayer: () => (/* binding */ hasLayer),
/* harmony export */   hasLayerAbove: () => (/* binding */ hasLayerAbove),
/* harmony export */   isOutsideTopLayer: () => (/* binding */ isOutsideTopLayer),
/* harmony export */   isTopLayer: () => (/* binding */ isTopLayer),
/* harmony export */   landmarksAround: () => (/* binding */ landmarksAround),
/* harmony export */   layerIndex: () => (/* binding */ layerIndex),
/* harmony export */   layerZIndex: () => (/* binding */ layerZIndex),
/* harmony export */   layerZIndexAt: () => (/* binding */ layerZIndexAt),
/* harmony export */   lockPageScroll: () => (/* binding */ lockPageScroll),
/* harmony export */   openLayer: () => (/* binding */ openLayer),
/* harmony export */   openLayers: () => (/* binding */ openLayers),
/* harmony export */   raiseLayer: () => (/* binding */ raiseLayer),
/* harmony export */   returnLayerFocus: () => (/* binding */ returnLayerFocus),
/* harmony export */   topLayer: () => (/* binding */ topLayer),
/* harmony export */   tryFocus: () => (/* binding */ tryFocus),
/* harmony export */   updateLayer: () => (/* binding */ updateLayer)
/* harmony export */ });
// The one document layer stack (standard simai.smart-component 1.3.8 §19).
//
// Everything that draws above the page -- a modal, a drawer, a popover, a
// dropdown list, a menu, a calendar, the toast area -- registers here when it
// opens and leaves when it closes. The stack answers three questions the
// components used to answer each for itself, from three lists and two z-index
// bases:
//
//   - which layer is on top: the one opened last. Only that layer acts on
//     Escape, an outside press and Tab; a layer below stands back
//     (simai/ui-source#36: Escape over a modal opened from a drawer closed the
//     drawer, because each kept its own stack and the drawer listened first);
//   - how high each layer is drawn: one z-index scale in opening order, read
//     from the tokens --sf-z-index-layer and --sf-z-index-layer-step
//     (simai/ui-source#37: a drawer opened from a modal was drawn under it,
//     at 90 + 2i against the modal's 9000 + 2i);
//   - where focus goes when a layer closes: back to what was active when it
//     opened; if that is gone or outside the new top layer, into the new top
//     layer; else the nearest landmark; else the body. A layer that closes
//     while another stands above it moves no focus.
//
// It also keeps what every layer did with a copy of its own: one listener for
// a press outside the top layer (onOutsidePress), one page lock (lockPageScroll,
// taken for a layer that locks the page and brings no lock of its own) and one
// list of what can take focus (FOCUSABLE). A popover, a menu and a context menu
// each bound a document listener for the outside press, and a drawer, a site
// header, a search window and a modal each wrote the page lock again, three of
// them without the modal's care for the page's own padding (reuse audit
// 2026-11-02, findings 1 and 2).
//
// Kept on a shared global, not in module scope: every Smart bundle carries its
// own copy of this module, and the modal's bundle has to see the drawer the
// drawer's bundle opened. Each document (an iframe too) has its own stack.
//
// A layer is any object: a custom element, or the root element of a component
// without one. One whose `isConnected` is false is passed over, so a layer
// removed without closing cannot hold every key on the page.
const STACK_KEY = Symbol.for('sf.layerStack'); // The scale's defaults, the same as core's tokens: 9000 is where the modal
// stack always started, so nothing a page draws below it changes place.

const LAYER_BASE = 9000;
const LAYER_STEP = 2;
const LANDMARKS = 'main, section, article, [role="main"], [role="region"]';
/**
 * What a person can move focus to: the one list a layer keeps Tab inside and
 * moves focus into. A hidden input is not a stop; an editable region is. Each
 * component kept a list of its own, and they had drifted apart.
 */

const FOCUSABLE = ['a[href]', 'button:not([disabled])', 'input:not([disabled]):not([type="hidden"])', 'select:not([disabled])', 'textarea:not([disabled])', '[contenteditable="true"]', '[tabindex]:not([tabindex="-1"])'].join(',');
/** The focusable nodes inside these roots that are drawn and not inert, in order. */

function focusablesIn(...roots) {
  return roots.flatMap(root => Array.from(root?.querySelectorAll?.(FOCUSABLE) ?? [])).filter(node => node.getClientRects().length > 0 && !node.closest('[inert]'));
}

function stack() {
  const scope = globalThis;

  if (!scope[STACK_KEY]) {
    Object.defineProperty(scope, STACK_KEY, {
      value: {
        layers: [],
        bound: false,
        pressBound: false,
        lease: null,
        pressTop: new WeakMap()
      },
      configurable: true
    });
  }

  return scope[STACK_KEY];
}

const isLive = entry => entry?.owner?.isConnected !== false; // A toast does not take keys or presses: the window under it keeps them.


const takesInput = entry => entry.kind !== 'toast';

function find(owner) {
  return stack().layers.find(entry => entry.owner === owner) || null;
}

function readToken(name, fallback) {
  const root = globalThis.document?.documentElement;
  if (!root || typeof globalThis.getComputedStyle !== 'function') return fallback;
  const value = parseInt(globalThis.getComputedStyle(root).getPropertyValue(name), 10);
  return Number.isFinite(value) ? value : fallback;
}
/** The z-index of the layer at a place in the stack, as a number. */


function layerZIndexAt(index) {
  if (index < 0) return '';
  return readToken('--sf-z-index-layer', LAYER_BASE) + index * readToken('--sf-z-index-layer-step', LAYER_STEP);
} // The class the modal's lock always added, kept so a page that reads it (and
// the modal's probes, which do) still sees a locked page.

const LOCK_CLASS = 'overflow-hidden';
/**
 * The default page lock (§19.1): the document stops scrolling, and the body
 * takes the scrollbar's width as padding so the page does not jump sideways
 * when the bar goes. Answers the function that gives it back.
 *
 * It was the modal's: it adds the gap to the padding the body already has, and
 * gives back only what it set -- a class or an overflow the page had before
 * stays, and a padding the page changed meanwhile is the page's. The overflow
 * is also written inline, as the drawer, the site header and the search window
 * wrote it, so the lock holds before the utility sheet with the class arrives.
 */

function lockPageScroll({
  preserveScrollGap = true
} = {}) {
  const doc = globalThis.document;
  const html = doc?.documentElement;
  const body = doc?.body;
  if (!html || !body) return () => {};
  const view = doc.defaultView || globalThis.window || globalThis;
  const gap = Math.max(0, (view.innerWidth || 0) - html.clientWidth);
  const kept = [html, body].map(node => ({
    node,
    locked: node.classList.contains(LOCK_CLASS),
    overflow: node.style.getPropertyValue('overflow'),
    overflowPriority: node.style.getPropertyPriority('overflow')
  }));

  for (const {
    node
  } of kept) {
    node.classList.add(LOCK_CLASS);
    node.style.setProperty('overflow', 'hidden');
  }

  const padding = {
    value: body.style.getPropertyValue('padding-inline-end'),
    priority: body.style.getPropertyPriority('padding-inline-end'),
    applied: null
  };

  if (preserveScrollGap && gap > 0) {
    const current = parseFloat(view.getComputedStyle?.(body).paddingInlineEnd) || 0;
    body.style.setProperty('padding-inline-end', `${current + gap}px`, padding.priority);
    padding.applied = body.style.getPropertyValue('padding-inline-end');
  }

  return () => {
    for (const {
      node,
      locked,
      overflow,
      overflowPriority
    } of kept) {
      if (!locked) node.classList.remove(LOCK_CLASS); // Only the overflow this lock wrote: one the page set meanwhile stays.

      if (node.style.getPropertyValue('overflow') !== 'hidden' || node.style.getPropertyPriority('overflow')) continue;
      if (overflow) node.style.setProperty('overflow', overflow, overflowPriority);else node.style.removeProperty('overflow');
    }

    if (padding.applied === null || body.style.getPropertyValue('padding-inline-end') !== padding.applied || body.style.getPropertyPriority('padding-inline-end') !== padding.priority) return;
    if (padding.value) body.style.setProperty('padding-inline-end', padding.value, padding.priority);else body.style.removeProperty('padding-inline-end');
  };
} // The page lock is one lease for the whole stack, taken by the first layer
// that locks the page and given back when no such layer is left -- whichever
// kind opened first and whichever closes last. A modal and a drawer held two
// locks before, and closing them out of order unlocked the page under an open
// window. A layer that brings no lockPage of its own takes the default one.

function syncPageLock() {
  const state = stack();
  const locker = state.layers.find(entry => entry.locksPage && isLive(entry));

  if (locker && !state.lease) {
    const release = locker.lockPage ? locker.lockPage() : lockPageScroll({
      preserveScrollGap: locker.preserveScrollGap !== false
    });
    state.lease = typeof release === 'function' ? release : () => {};
  } else if (!locker && state.lease) {
    const release = state.lease;
    state.lease = null;
    release();
  }
}

function sync() {
  const state = stack();
  const top = topLayer();
  state.layers.forEach((entry, index) => {
    entry.place?.({
      index,
      zIndex: layerZIndexAt(index),
      top: entry === top
    });
  });
  syncPageLock();
}
/** The layer on top: the last opened that takes keys and presses. */


function topLayer() {
  const {
    layers
  } = stack();

  for (let at = layers.length - 1; at >= 0; at -= 1) {
    if (isLive(layers[at]) && takesInput(layers[at])) return layers[at];
  }

  return null;
}
/** Whether this owner is the top layer. One that is not open is top only when nothing is. */

function isTopLayer(owner) {
  const top = topLayer();
  return top ? top.owner === owner : !find(owner);
}
function hasLayer(owner) {
  return Boolean(find(owner));
}
/** Whether a layer of one of these kinds stands above this owner. */

function hasLayerAbove(owner, kinds = ['modal', 'panel']) {
  const {
    layers
  } = stack();
  const at = layers.findIndex(entry => entry.owner === owner);
  if (at < 0) return false;
  return layers.slice(at + 1).some(entry => isLive(entry) && kinds.includes(entry.kind));
}
/** The place of this owner in the stack, -1 when it is not open. */

function layerIndex(owner) {
  return stack().layers.findIndex(entry => entry.owner === owner);
}
/** This owner's z-index, '' when it is not open. */

function layerZIndex(owner) {
  return layerZIndexAt(layerIndex(owner));
}
/** The open layers, bottom first; of one kind when `kind` is given. */

function openLayers(kind = '') {
  return stack().layers.filter(entry => !kind || entry.kind === kind).map(entry => entry.owner);
}
/**
 * Registers a layer, or raises it to the top when it is already open.
 *
 * options:
 *   kind        'modal' | 'panel' | 'surface' | 'toast'
 *   locksPage   true to hold the page lock while open; lockPage() takes it and
 *               returns the function that gives it back, and without one the
 *               stack takes lockPageScroll({preserveScrollGap})
 *   preserveScrollGap  false to let the page widen when its scrollbar goes
 *   trapsFocus  true to keep Tab inside and to return focus on close
 *   root()      the element the layer draws, for focus and outside presses
 *   onEscape(event)  closes the layer and answers true when it took the press
 *   onTab(event)     keeps focus inside
 *   onOutsidePress(event)  a press began outside root() and the owner while
 *               this is the top layer; the layer decides what it closes
 *   focusIn()        moves focus inside
 *   place({index, zIndex, top})  draws the layer at its height
 *   returnTo    what was active at open (default: the active element now)
 */

function openLayer(owner, options = {}) {
  if (!owner) return null;
  const state = stack();
  bindKeys();
  bindPresses();
  let entry = find(owner);

  if (entry) {
    state.layers.splice(state.layers.indexOf(entry), 1);
    Object.assign(entry, options);
  } else {
    const returnTo = options.returnTo !== undefined ? options.returnTo : globalThis.document?.activeElement ?? null;
    entry = {
      kind: 'surface',
      locksPage: false,
      trapsFocus: false,
      ...options,
      owner,
      returnTo,
      returnAncestors: landmarksAround(returnTo)
    };
  }

  state.layers.push(entry);
  sync();
  return entry;
}
/** Changes what a layer declares without moving it in the stack. */

function updateLayer(owner, options = {}) {
  const entry = find(owner);
  if (!entry) return null;
  Object.assign(entry, options);
  sync();
  return entry;
}
/** Raises an open layer to the top. */

function raiseLayer(owner) {
  const entry = find(owner);
  if (!entry) return;
  const {
    layers
  } = stack();
  layers.splice(layers.indexOf(entry), 1);
  layers.push(entry);
  sync();
}
/**
 * Removes a layer. Answers whether it was the top one. With `restoreFocus`
 * (the default) a top layer that traps focus gives focus back by §19.2.
 */

function closeLayer(owner, {
  restoreFocus = true
} = {}) {
  const entry = find(owner);
  if (!entry) return false;
  const wasTop = topLayer() === entry;
  const {
    layers
  } = stack();
  layers.splice(layers.indexOf(entry), 1);
  sync();

  if (restoreFocus && wasTop && entry.trapsFocus) {
    returnLayerFocus(true, entry.returnTo, entry.returnAncestors);
  }

  return wasTop;
}
/** The landmarks around a node, nearest first: where focus falls back to. */

function landmarksAround(node) {
  const found = [];

  for (let parent = node?.parentElement; parent; parent = parent.parentElement) {
    if (parent.matches?.(LANDMARKS)) found.push(parent);
  }

  return found;
}
/** Focuses a node if a person could reach it; answers whether it took focus. */

function tryFocus(node, temporaryTabIndex = false) {
  if (!node?.isConnected || typeof node.focus !== 'function' || node.matches?.(':disabled') || node.closest?.('[inert], [hidden], [aria-hidden="true"]') || !node.getClientRects?.().length || node.ownerDocument.defaultView.getComputedStyle(node).visibility !== 'visible') {
    return false;
  }

  const addTabIndex = temporaryTabIndex && !node.hasAttribute('tabindex');
  let observer;

  const cleanup = () => {
    observer?.disconnect();
    node.removeEventListener('blur', cleanup); // Keep an author's own change to the temporary attribute.

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
    // Removing tabindex while a non-native target is focused blurs it.
    if (addTabIndex && !focused) cleanup();
  }
} // The layer that owns focus now: the topmost one that traps it. A docked
// panel or an open list under the window does not.

function focusOwner() {
  const {
    layers
  } = stack();

  for (let at = layers.length - 1; at >= 0; at -= 1) {
    if (isLive(layers[at]) && layers[at].trapsFocus) return layers[at];
  }

  return null;
}
/**
 * Gives focus back after a layer closed (§19.2): to `target` when it is still
 * there and inside the layer that now owns focus (or nothing does); else into
 * that layer; else the nearest landmark; else the body. Nothing moves when the
 * closed layer was not the top one.
 */


function returnLayerFocus(wasTop, target, ancestors = []) {
  if (!wasTop) return;
  const owner = focusOwner();
  const root = owner?.root?.();
  if ((!owner || root?.contains(target)) && tryFocus(target)) return;

  if (owner) {
    owner.focusIn?.();
    return;
  }

  const doc = globalThis.document;
  if (!doc) return;
  const candidates = new Set([...ancestors, ...doc.querySelectorAll('main, [role="main"]'), doc.body]);

  for (const candidate of candidates) {
    if (tryFocus(candidate, true)) return;
  }
} // One listener pair for the whole document, whichever bundle binds it first.
// The top layer is read when the press starts (window, capture -- before any
// component's listener) and acted on when it has passed through the page
// (window, bubble): a control inside that handled Escape keeps it, and a
// surface that closed itself on the way down does not hand the same press to
// the layer under it.

function bindKeys() {
  const state = stack();
  if (state.bound || typeof globalThis.addEventListener !== 'function') return;
  state.bound = true;
  globalThis.addEventListener('keydown', event => {
    if (event.key === 'Escape' || event.key === 'Tab') state.pressTop.set(event, topLayer());
  }, true);
  globalThis.addEventListener('keydown', event => {
    if (event.key !== 'Escape' && event.key !== 'Tab' || event.defaultPrevented) return;
    const top = state.pressTop.has(event) ? state.pressTop.get(event) : topLayer();
    if (!top || top !== topLayer()) return;

    if (event.key === 'Escape') {
      if (top.onEscape?.(event)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }

      return;
    }

    top.onTab?.(event);
  });
} // Outside a layer: in the composed path of neither what it draws nor its
// owner, so a press inside a shadow root or a portal of its own is inside.


function pressedOutside(entry, event) {
  const path = event.composedPath?.() ?? [];
  const root = entry.root?.();
  return !path.includes(entry.owner) && !(root && path.includes(root));
} // One pointerdown listener pair for the whole document, as for the keys: the
// top layer is read in capture, before any component sees the press, and acts
// in bubble, once the press has passed through the page. Only the top layer
// hears it, so a list over a popover closes and the popover stays, and a layer
// that opened or closed on the way down (a trigger's own press) does not hand
// the press to another. Each surface bound a document listener of its own
// before, and the first one bound acted whatever lay above it.


function bindPresses() {
  const state = stack();
  if (state.pressBound || typeof globalThis.addEventListener !== 'function') return;
  state.pressBound = true;
  globalThis.addEventListener('pointerdown', event => {
    state.pressTop.set(event, topLayer());
  }, true);
  globalThis.addEventListener('pointerdown', event => {
    const top = state.pressTop.has(event) ? state.pressTop.get(event) : topLayer();
    if (!top?.onOutsidePress || top !== topLayer() || !pressedOutside(top, event)) return;
    top.onOutsidePress(event);
  });
} // A press outside the top layer, read in capture: what a layer below would
// call outside is ignored there.


function isOutsideTopLayer(event) {
  const top = topLayer();
  const root = top?.root?.();
  if (!root) return false;
  const path = event.composedPath?.() ?? [];
  return !path.includes(root) && !path.includes(top.owner);
}
const THEMES = ['theme-dark', 'theme-light'];
/**
 * A layer drawn outside its host (a portal) keeps where it came from (§19.1):
 * the host's resolved lang and dir, the theme of its nearest themed ancestor,
 * and the computed values of the host's variables that differ from those
 * where the portal stands -- `variables` by name, `prefixes` by the start of
 * the name. It looks and speaks as if it stood where its host stands.
 */

function carryLayerOrigin(portal, host, {
  variables = [],
  prefixes = []
} = {}) {
  if (!portal || !host?.isConnected) return;
  const doc = host.ownerDocument;
  const view = doc.defaultView;
  const nearest = host.closest('[lang]');
  const lang = nearest?.getAttribute('lang') ?? doc.documentElement.getAttribute('lang') ?? '';
  if (lang) portal.setAttribute('lang', lang);else portal.removeAttribute('lang'); // Where the copy came from: the page itself, or a section that names its own
  // language. Only the first follows SF.language.use(), which the page language
  // does before it announces the change (simai/ui-source#55).

  if (!nearest || nearest === doc.documentElement) portal.dataset.sfLayerLang = 'page';else delete portal.dataset.sfLayerLang;
  const declared = host.closest('[dir]')?.getAttribute('dir');
  const dir = declared && declared !== 'auto' ? declared : view.getComputedStyle(host).direction;
  if (dir) portal.setAttribute('dir', dir); // The theme only when the host's differs from the portal's place: a page
  // that retunes tokens on html.theme-dark keeps them, as the class would
  // otherwise declare the core's values again on the portal.

  const parent = portal.parentElement;

  const theme = node => {
    const area = node?.closest?.(THEMES.map(name => `.${name}`).join(', '));
    return area ? THEMES.find(name => area.classList.contains(name)) : '';
  };

  const carried = portal.dataset.sfLayerTheme || '';
  const wanted = theme(host) !== theme(parent) ? theme(host) : '';
  if (carried && carried !== wanted) portal.classList.remove(carried);
  if (wanted) portal.classList.add(wanted);
  if (wanted) portal.dataset.sfLayerTheme = wanted;else delete portal.dataset.sfLayerTheme;
  if (!variables.length && !prefixes.length) return;
  const own = view.getComputedStyle(host);
  const there = parent ? view.getComputedStyle(parent) : null;
  const names = new Set(variables);

  if (prefixes.length) {
    for (const name of own) {
      if (prefixes.some(prefix => name.startsWith(prefix))) names.add(name);
    }
  }

  const previous = (portal.dataset.sfLayerVariables || '').split(' ').filter(Boolean);
  const kept = [];

  for (const name of names) {
    const value = own.getPropertyValue(name).trim();

    if (value && value !== there?.getPropertyValue(name).trim()) {
      portal.style.setProperty(name, value);
      kept.push(name);
    }
  }

  for (const name of previous) if (!kept.includes(name)) portal.style.removeProperty(name);

  if (kept.length) portal.dataset.sfLayerVariables = kept.join(' ');else delete portal.dataset.sfLayerVariables;
}

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
/* harmony export */   pageWord: () => (/* binding */ pageWord)
/* harmony export */ });
/* harmony import */ var _tag_aliases_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("4a85acfb05c1");
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
const REGISTERED = STORE.registered; // Words are kept under a component's current tag: a product that registered
// them for a renamed tag (sf-datepicker, now sf-input-date) keeps its words
// while the old tag is a dated alias, whichever name the element was written
// with (core/js/tag-aliases.js).

const wordsOf = component => REGISTERED.get((0,_tag_aliases_js__WEBPACK_IMPORTED_MODULE_0__.canonicalTag)(component));

const normalise = value => String(value ?? '').trim().toLowerCase().replace('_', '-');
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
  for (const candidate of chain(locale || 'en')) {
    const added = component ? wordsOf(component)?.get(candidate)?.[key] : undefined;
    if (added !== undefined) return added;
    const shipped = dictionary?.[candidate]?.[key];
    if (shipped !== undefined) return shipped;
  }

  return key;
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
    STORE.chosen = next; // The choice is the page's language: <html lang> says it too (§11.1), so
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
    STORE.chosen = null;
    announce();
    return this;
  }

}; // Reachable by a consumer, which it was not: `sf-admin-menu` had written its
// own reading of the rule because the shared one was an internal module, and
// the two then disagreed about a region that names its own language. A product
// composing its own elements gets the same rule here.

if (typeof window !== 'undefined') {
  window.SF = window.SF || {};
  window.SF.language = language;
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
  remove_after: '2027-01-01'
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
  remove_after: '2027-01-01'
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
  remove_after: '2027-01-01'
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
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-textarea',
  to: 'sf-input-textarea',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-thread-list',
  to: 'sf-chat-threads',
  since: '2026-11-03',
  remove_after: '2027-01-01'
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
      remove_after: String(row.remove_after ?? '')
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
    expired
  });
  if (shared.noted.has(row.from)) return;
  shared.noted.add(row.from); // deprecations.js prints an expired name itself, and every name when the
  // page opted in; the note here is for the rest.

  const optedIn = globalThis.document?.documentElement?.dataset?.sfDeprecations === 'warn' || globalThis.SF?.deprecations?.warn === true;
  if (expired || optedIn) return;
  globalThis.console?.warn?.(`[SIMAI Framework] <${row.from}> is now <${row.to}>; the old tag works until ${row.remove_after}. Write <${row.to}>. See contracts/changes/journal.json.`);
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

/***/ "d2c7f5f33858"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


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
/* harmony import */ var _js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("05f95721a8a3");
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("d2c7f5f33858");


})();

/******/ })()
;