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

/***/ "d1e2388bb47f"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Modal: () => (/* binding */ Modal)
/* harmony export */ });
/* harmony import */ var _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d7f974466839");
/* harmony import */ var _register_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("58661bec99a6");
/* harmony import */ var _focus__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("c8d66dd2c299");
/* harmony import */ var _closing__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("3f3a6e2680d5");
/* harmony import */ var _motion__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("201fd0b17b8b");
/* harmony import */ var _scroll__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("ed3ae3576d0a");
/* harmony import */ var _stack__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("93025a68d8ab");








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
}

class Modal extends _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__.ComponentObserver {
  static componentName = 'Modal';
  static registry = new Map();
  static globalBound = false;
  static stack = [];
  static openCount = 0;
  static uid = 0;
  static lockState = null;
  static baseZIndex = 9000;

  static getTopModal() {
    return (0,_stack__WEBPACK_IMPORTED_MODULE_6__.getTopModalLayer)();
  }

  static isTopModal(modal) {
    return Modal.getTopModal() === modal;
  }

  static addToStack(modal) {
    if (!modal || modal.display === 'inline') {
      return;
    }

    Modal.stack = Modal.stack.filter(item => item !== modal);
    Modal.stack.push(modal);
    Modal.openCount = Modal.stack.length;
    (0,_stack__WEBPACK_IMPORTED_MODULE_6__.addModalLayer)(modal, Modal);
  }

  static removeFromStack(modal) {
    if (!modal || modal.display === 'inline') {
      return;
    }

    Modal.stack = Modal.stack.filter(item => item !== modal);
    Modal.openCount = Modal.stack.length;
    (0,_stack__WEBPACK_IMPORTED_MODULE_6__.removeModalLayer)(modal);
  }

  static bringToFront(modal) {
    if (!modal || modal.display === 'inline' || !Modal.stack.includes(modal)) {
      return;
    }

    Modal.stack = Modal.stack.filter(item => item !== modal);
    Modal.stack.push(modal);
    (0,_stack__WEBPACK_IMPORTED_MODULE_6__.raiseModalLayer)(modal);
  }

  static updateStackStyles() {
    (0,_stack__WEBPACK_IMPORTED_MODULE_6__.updateModalLayers)();
  }

  constructor(props) {
    super(props);
    const params = this.params || {};
    this.modalId = this.id || params.id || `sf-modal-${++Modal.uid}`;
    this.isOpen = false;
    this.lastActive = null;
    this.root = params.root || null;
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
    const root = document.createElement('div');
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
    surface.className = joinClasses(isInline ? 'bg-surface border border-outline-variant radius-default p-2 flex flex-col gap-1 min-w-0' : 'bg-surface border border-outline-variant radius-default shadow-3 p-2 flex flex-col gap-1 min-w-0', params.surfaceClass);
    surface.setAttribute('data-sf-modal-surface', '');
    const header = document.createElement('header');
    header.className = joinClasses('sf-modal-header flex items-start min-w-0 border-b border-outline-variant gap-1', params.headerClass);

    if (Array.isArray(params.headerNodes) && params.headerNodes.length) {
      root.setAttribute('aria-label', params.title || 'Modal');
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
      title.textContent = params.title || 'Modal';
      header.append(title);

      if (this.showClose) {
        const closeButton = document.createElement('button');
        closeButton.type = 'button';
        closeButton.className = joinClasses('sf-icon-button sf-modal-header-action sf-modal-close-button sf-icon-button--close sf-icon-button--link sf-icon-button--on-surface sf-icon-button--size-1/3 m-0', params.closeClass);
        closeButton.setAttribute('aria-label', 'Close modal');
        closeButton.setAttribute('data-sf-modal-close', this.modalId);
        closeButton.innerHTML = '            <span\n' + '              class="sf-close sf-close--size-1/3 flex justify-center items-center"\n' + '              aria-label="Close size 1/4"\n' + '            >\n' + '              <span class="sf-close-icon"></span>\n' + '            </span>';
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
    bodyScroll.className = joinClasses('sf-modal-body-scroll h-full max-h-80 min-w-0 overflow-y-auto flex flex-col gap-1 p-1/4', params.bodyClass);
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
      footer.className = joinClasses('sf-modal-footer flex flex-wrap gap-2', params.footerClass);
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
    loading.innerHTML = `
      <div class="sf-modal-spinner animate-spin border-2 border-t-transparent border-outline-variant rounded-full w-8 h-8"></div>
      <p class="m-0 text-2 color-on-surface-variant">Loading...</p>
    `;
    container.append(loading);
  }

  _showError(container, message) {
    container.innerHTML = '';
    const error = document.createElement('div');
    error.className = 'sf-modal-error flex flex-col gap-2 items-cross-center content-main-center p-4';
    error.setAttribute('data-sf-modal-state', 'error');
    error.innerHTML = `
      <div class="sf-modal-error-icon text-4 color-error">⚠</div>
      <p class="sf-modal-error-text m-0 text-2 color-error">${this.escapeHtml(message || 'Failed to load content')}</p>
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

    this._fetchController = new AbortController();

    try {
      this._emitBeforeContentUpload();

      const response = await fetch(this.src, {
        signal: this._fetchController.signal
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
        this._finishLoading();

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
    iframe.className = 'sf-modal-iframe w-full border-0 radius-default';
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
      this._contentError = 'Failed to load iframe content';

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
      <p class="sf-modal-error-text m-0 text-2 color-error">${this.escapeHtml(this._contentError || 'Failed to load content')}</p>
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

    if (!document.body.contains(this.template)) {
      document.body.append(this.template);
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
    }

    this.template.addEventListener('click', this.onOverlayClick);
    document.addEventListener('keydown', this.onKeyDown);
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
    document.removeEventListener('keydown', this.onKeyDown);
    Modal.registry.delete(this.modalId);
  }

  onOverlayClick(event) {
    const isOverlay = event.target === this.template.querySelector('[data-sf-modal-overlay]');

    if (isOverlay && this.closeOnOverlay) {
      this.close();
    }
  }

  onKeyDown(event) {
    if (!this.isOpen && this._modalState !== 'closing') {
      return;
    }

    if (!Modal.isTopModal(this)) {
      return;
    }

    if (event.key === 'Escape' && this.closeOnEsc && this._modalState !== 'closing') {
      event.preventDefault();
      event.stopImmediatePropagation();
      this.close();
      return;
    }

    if (event.key === 'Tab') {
      this.trapFocus(event);
    }
  }

  trapFocus(event) {
    if (!Modal.isTopModal(this)) {
      return;
    }

    const panel = this.template.querySelector('[data-sf-modal-panel]');
    (0,_focus__WEBPACK_IMPORTED_MODULE_2__.trapModalFocus)(panel, event);
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

  applyStackPosition(index = (0,_stack__WEBPACK_IMPORTED_MODULE_6__.getModalLayerIndex)(this)) {
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
    this.template.style.zIndex = String(Modal.baseZIndex + index * 2);
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
      this._focusReturnAncestors = (0,_stack__WEBPACK_IMPORTED_MODULE_6__.captureModalFocusAncestors)(this.lastActive);
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

    (0,_motion__WEBPACK_IMPORTED_MODULE_4__.scheduleModalFrame)(() => {
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
    this._releaseClosingContent = (0,_closing__WEBPACK_IMPORTED_MODULE_3__.freezeModalContent)(panel, Modal.isTopModal(this));
    this._closeTransitionAbort = (0,_motion__WEBPACK_IMPORTED_MODULE_4__.scheduleModalClose)(() => this.template, () => this.finishClose());
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
    (0,_stack__WEBPACK_IMPORTED_MODULE_6__.restoreModalLayerFocus)(wasTop, this.lastActive, this._focusReturnAncestors);
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
  }

  static lockPage(preserveScrollGap = true) {
    if (!Modal.lockState) Modal.lockState = (0,_scroll__WEBPACK_IMPORTED_MODULE_5__.lockModalScroll)(preserveScrollGap);
  }

  static unlockPage() {
    (0,_scroll__WEBPACK_IMPORTED_MODULE_5__.unlockModalScroll)(Modal.lockState);
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
}

function addModalLayer(modal, owner) {
  const stack = state();
  if (stack.items.includes(modal)) return;

  if (!stack.items.length) {
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

  if (!stack.items.length) {
    stack.lockOwner?.unlockPage();
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

/***/ "d7f974466839"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ComponentObserver: () => (/* binding */ ComponentObserver)
/* harmony export */ });
class ComponentObserver {
  constructor(props) {
    this.props = props;
    this.id = props?.id;
    this.params = props?.param;
    this.attrs = props?.attrs || {};
    this.template = null;
    window.dispatchEvent(new CustomEvent(`${this.componentName}:beforeRender`, {
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
      window.dispatchEvent(new CustomEvent(`${this.componentName}:render`, {
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

    window.dispatchEvent(new CustomEvent(`${this.componentName}:destroy`, {
      detail: this
    }));
  }

  destroyInternal() {}

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