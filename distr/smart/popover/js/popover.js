/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "e470697f4c03"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _core_js_deprecations__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("d3818183b14c");
/* harmony import */ var _core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("bf0cea966575");
/* harmony import */ var _core_js_layer_stack__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("18003344cff0");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("18fc6da7e766");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("fcb18992f3bb");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("d8578a2cb338");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("0f5fc1613e82");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("947fffd789ac");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_deprecations__WEBPACK_IMPORTED_MODULE_2__, _core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_3__, _core_js_layer_stack__WEBPACK_IMPORTED_MODULE_4__, _js_templates_default__WEBPACK_IMPORTED_MODULE_5__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_deprecations__WEBPACK_IMPORTED_MODULE_2__, _core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_3__, _core_js_layer_stack__WEBPACK_IMPORTED_MODULE_4__, _js_templates_default__WEBPACK_IMPORTED_MODULE_5__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_deprecations__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_core_js_deprecations__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _core_js_layer_stack__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_4__);









 // sf-popover from its component.json (standard simai.smart-component 1.3.8
// §3, §4, §8, §19): placement, label, width, dismissible, surface-role and the
// value open are attributes and properties made by core/js/element-manifest.js;
// the old host attribute role is a dated alias of surface-role.

const PopoverElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_6__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_8__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_9__
  },
  source: 'ru',
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_7__
});

const applied = () => ({
  outcome: 'applied'
});

const refused = reason => ({
  outcome: 'refused',
  reason
}); // A surface anchored to a control the consumer supplies: a field's settings, a
// list of things to add, a filter, a colour picker's own panel. It exists
// because the Framework had the surface and not the behaviour -- sf-context-menu
// is positioned and takes any content and any role, but it has no open state, no
// trigger, no dismissal and no focus to return. Two composites built that by
// hand within a week of each other, the second copying the first, which is the
// moment a part belongs here instead.
//
// It claims nothing about the shape of the content: a menu of commands, a list
// of ticks, a form. The role it is given reaches the surface, and the arrow keys
// and roving focus of a menu stay where they already are -- in sf-context-menu,
// which this draws into.
// While any popover is open the root says so, and a component whose own Escape
// closes something -- a drawer, a modal, a panel -- stands back. The mark is a
// protocol shared with every other surface that owns Escape, so it is held
// through core (`core/js/open-surface-mark`) rather than written here.


class SfPopover extends PopoverElement {
  // The manifest's settings and value, and the base's template name.
  static get props() {
    return { ...super.props,
      templateName: {
        attribute: 'template',
        default: 'default'
      }
    };
  }

  constructor() {
    super();
    this._onDocumentPointerDown = null;
    this._onDocumentKeyDown = null;
    this._closeReason = 'api';
  }

  static get observedAttributes() {
    return [...new Set([...(super.observedAttributes ?? []), 'open'])];
  } // A role written on the host is the surface's: it is taken once into
  // surface-role and off the host, so the host is not a second menu or dialog
  // around the real one (a dated alias, aliases.json).


  _adoptLegacyRole() {
    if (!this.hasAttribute('role')) return;
    const role = String(this.getAttribute('role') || '').trim().toLowerCase();
    if (!this.hasAttribute('surface-role') && ['dialog', 'menu', 'listbox', 'group'].includes(role)) this.setAttribute('surface-role', role);
    this.removeAttribute('role');
    (0,_core_js_deprecations__WEBPACK_IMPORTED_MODULE_2__.noteDeprecated)({
      component: 'sf-popover',
      tag: 'sf-popover',
      kind: 'attribute',
      attribute: 'role',
      from: 'role',
      to: 'surface-role',
      since: _aliases_json__WEBPACK_IMPORTED_MODULE_7__.since,
      remove_after: _aliases_json__WEBPACK_IMPORTED_MODULE_7__.remove_after
    });
  } // The host is a box rather than a passthrough: the surface is positioned
  // against it and the trigger sits inside it. The base makes every Smart
  // element `display: contents`, which has no box to position against -- and
  // the alternative, moving the children into one this component renders, is
  // undone by the next render of whatever template engine put them there.
  // Nothing is moved: the children stay exactly where the consumer wrote them
  // and this says where they are.


  applyHostDisplayStyle() {
    const next = 'display: inline-flex; align-items: center; position: relative;';
    if (this.getAttribute('style') === next) return this;
    this._syncingHostStyle = true;
    this.setAttribute('style', next);
    this._syncingHostStyle = false;
    return this;
  } // The base lifts every `[slot]` child out of the document at connect, for a
  // template to place back where it decides. This component decides nothing
  // about where they go: the trigger and the surface stay exactly where the
  // consumer wrote them, and `slot` here names which of the two a node is.


  captureSlotTemplates() {
    this._slotTemplatesCaptured = true;
  }

  onConnected() {
    this._adoptLegacyRole();

    super.onConnected?.();

    this._bindDismissal();

    this.addEventListener('click', this._onTriggerClick);
  } // A press anywhere in the trigger opens it, or closes it with reason
  // close; a press in the content is the content's own.


  _onTriggerClick = event => {
    const path = event.composedPath?.() ?? [];
    const inTrigger = path.some(node => node?.getAttribute?.('slot') === 'trigger');
    if (!inTrigger) return;
    event.preventDefault();
    if (this.open) this.close({
      reason: 'close'
    });else this.show();
  };

  onDisconnected() {
    this.removeEventListener('click', this._onTriggerClick);

    this._releaseDismissal();

    super.onDisconnected?.();
  }

  attributeChangedCallback(name, previous, next) {
    super.attributeChangedCallback?.(name, previous, next);
    if (previous === next || name !== 'open') return;

    this._bindDismissal(); // The fact, after the state changed (vocabulary §4); a setting written
    // from outside is reported the same way, as the surface's own state.


    if (this.open) this.sfEmit('opened', {});else this.sfEmit('closed', {
      reason: this._closeReason || 'api'
    });
    this._closeReason = 'api';
    if (!this.open) this.returnFocus();
  } // Opens or closes the surface. Answers an outcome (§4.4): refused when a
  // listener prevents the request (sf-popover-open, sf-popover-close).


  toggle(force) {
    const given = force && typeof force === 'object' ? force.force : force;
    const next = typeof given === 'boolean' ? given : !this.open;
    if (next === this.open) return applied();
    return next ? this.show() : this.close();
  }

  show() {
    if (this.open) return applied();
    if (!this.sfEmit('open', {}, {
      cancelable: true
    })) return refused('prevented');
    this._opener = this.querySelector('[slot="trigger"]') ?? null;
    this.toggleAttribute('open', true);
    this.requestComponentUpdate('open');
    return applied();
  } // options.reason says why (standard 1.3.8 §19.3): escape, outside, close
  // (the trigger pressed again) or api, the default.


  close(options = {}) {
    if (!this.open) return refused('closed');
    const reason = typeof options?.reason === 'string' ? options.reason : 'api';
    if (!this.sfEmit('close', {
      reason,
      unsaved: Boolean(this.unsaved)
    }, {
      cancelable: true
    })) return refused('prevented');
    this._closeReason = reason;
    this.toggleAttribute('open', false);
    this.requestComponentUpdate('open');
    return applied();
  } // The control that opened it gets the focus back, because a surface that
  // closes leaving the focus on the document start makes a keyboard lose its
  // place entirely.


  returnFocus() {
    const trigger = this._opener?.isConnected ? this._opener : this.querySelector('[slot="trigger"]');
    const focusable = trigger?.matches?.('button, a[href], [tabindex]') ? trigger : trigger?.querySelector?.('button, a[href], [tabindex]');
    focusable?.focus?.();
    return applied();
  }

  _bindDismissal() {
    if (!this.open || !this.dismissible) {
      this._releaseDismissal();

      return;
    }

    if (this._onDocumentPointerDown) return;
    (0,_core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_3__.holdOpenSurfaceMark)(this, true);

    this._onDocumentPointerDown = event => {
      const path = event.composedPath?.() ?? [];
      if (path.includes(this)) return; // An outside press is the top layer's (standard 1.3.8 §19.3): a
      // press inside a drawer or a window opened from this popover is
      // theirs, and the popover under them stays. A list opened from it
      // closes with it, as before.

      if ((0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_4__.hasLayerAbove)(this)) return;
      this.close({
        reason: 'outside'
      });
    }; // Capture, and the press is stopped going further: a surface closing
    // under the pointer must not also activate what the pointer landed on.
    // Only as the innermost open layer: a calendar or a list opened inside
    // it takes the press first, and the popover the next one.


    this._onDocumentKeyDown = event => {
      if (event.key !== 'Escape' || event.defaultPrevented || !(0,_core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_3__.isTopOpenSurface)(this)) return;
      event.preventDefault();
      event.stopPropagation();
      this.close({
        reason: 'escape'
      });
    };

    document.addEventListener('pointerdown', this._onDocumentPointerDown, true);
    document.addEventListener('keydown', this._onDocumentKeyDown, true);
  }

  _releaseDismissal() {
    (0,_core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_3__.holdOpenSurfaceMark)(this, false);

    if (this._onDocumentPointerDown) {
      document.removeEventListener('pointerdown', this._onDocumentPointerDown, true);
    }

    if (this._onDocumentKeyDown) {
      document.removeEventListener('keydown', this._onDocumentKeyDown, true);
    }

    this._onDocumentPointerDown = null;
    this._onDocumentKeyDown = null;
  } // It draws no markup of its own, so it takes the base's own patch path and
  // never renders: lit owns the children of whatever it renders into, and this
  // element renders into itself. A template returning nothing would therefore
  // delete the trigger and the surface the consumer wrote -- which is the same
  // wound as moving them, taken from the other side.


  resolveUpdateMode() {
    return 'dom';
  } // What it owns is said in attributes the stylesheet reads: where the surface
  // sits, whether it is shown, how wide it is, and what it is to a reader.


  updateDom() {
    this.dataset.placement = this.placement;
    this.dataset.open = this.open ? 'true' : 'false';

    this._adoptLegacyRole(); // The control that opens it says that it does and whether it has.


    const trigger = this.querySelector('[slot="trigger"]');
    const control = trigger?.matches?.('button, a[href], [tabindex]') ? trigger : trigger?.querySelector?.('button, a[href], [tabindex], sf-button, sf-icon-button');

    if (control) {
      control.setAttribute('aria-expanded', this.open ? 'true' : 'false');
      control.setAttribute('aria-haspopup', this.surfaceRole === 'group' ? 'true' : this.surfaceRole);
    }

    const surface = this.querySelector('[slot="content"]');
    if (!surface) return true;
    surface.setAttribute('role', this.surfaceRole);
    if (this.label) surface.setAttribute('aria-label', this.label);else surface.removeAttribute('aria-label');
    surface.style.setProperty('--sf-popover--width', this.width || '');
    return true;
  }

  templateContext() {
    return this.createTemplateContext({ ...this.getPropsContext(),
      component: this
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_5__.renderPopoverTemplate)(this.templateContext());
  }

}

SfPopover.define('sf-popover');
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SfPopover);
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "18fc6da7e766"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderPopoverTemplate: () => (/* binding */ renderPopoverTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var _default_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("39f4699b9dcf");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);

 // Nothing. The trigger and the content are the consumer's own nodes, left where
// they were written; this component says where they are with attributes the
// stylesheet reads, and never moves them -- a node moved out from under a
// template engine comes back on its next render, in the wrong place and wired to
// nothing.

function renderPopoverTemplate() {
  return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "39f4699b9dcf"
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

/***/ "18003344cff0"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("layer-stack", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("layer-stack", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "2a080a730149"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("lit", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "bf0cea966575"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("open-surface-mark", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("open-surface-mark", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "deb1a4d61565"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("smart-base", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("smart-base", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "d8578a2cb338"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-popover for the shim (core/js/aliases.js, standard §16 item 20). mode: same-detail (attribute rows), manifest-only (the DOM name does not change; its meaning does, so no shim).","component":"sf-popover","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"role","to":"surface-role","kind":"attribute","component":"sf-popover","since":"2026-10-27","remove_after":"2026-12-01","mode":"host-attribute","section":"§3.1","note":"read by the popover, not the shim: role leaves the host once read (the shim would mirror that removal onto surface-role); each read is noted with these dates"},{"from":"sf-popover-open","to":null,"kind":"event","component":"sf-popover","since":"2026-10-27","remove_after":"2026-12-01","mode":"manifest-only","section":"§19.3, vocabulary §4","note":"the same DOM name is the cancelable request now (sent before opening); the fact is sf-popover-opened"},{"from":"sf-popover-close","to":null,"kind":"event","component":"sf-popover","since":"2026-10-27","remove_after":"2026-12-01","mode":"manifest-only","section":"§19.3, vocabulary §4","note":"the same DOM name is the cancelable request now (sent before closing, {reason, unsaved}); the fact is sf-popover-closed"}]}');

/***/ },

/***/ "fcb18992f3bb"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.popover","tag":"sf-popover","version":"1.1.2","kind":"leaf","settings":{"placement":{"type":"enum","values":["bottom-start","bottom-end","top-start","top-end","inline-start","inline-end"],"default":"bottom-end"},"label":{"type":"string","default":""},"width":{"type":"string","default":""},"dismissible":{"type":"boolean","default":true},"surface-role":{"type":"enum","values":["dialog","menu","listbox","group"],"default":"dialog"},"unsaved":{"type":"boolean","default":false}},"values":{"open":{"type":"boolean","default":false,"reflect":true}},"events":{"open":{"carries":{},"cancelable":true},"opened":{"carries":{}},"close":{"carries":{"reason":{"type":"enum","values":["close","escape","outside","cancelled","api"]},"unsaved":"boolean"},"cancelable":true},"closed":{"carries":{"reason":{"type":"enum","values":["close","escape","outside","cancelled","api"]}}}},"actions":{"toggle":{"with":{"force":{"type":"boolean","optional":true}}},"show":{"emits":"open"},"close":{"with":{"reason":{"type":"enum","values":["close","escape","outside","cancelled","api"]}},"emits":"close"},"return-focus":{}},"layer":{"kind":"surface","locks-page":false,"traps-focus":false},"css-variables":{"--sf-popover-background-color":{"type":"color","state":"default"},"--sf-popover-color":{"type":"color","state":"default"},"--sf-popover-radius":{"type":"length","state":"default"},"--sf-popover-shadow":{"type":"shadow","state":"default"},"--sf-popover-max-width":{"type":"length","state":"default"},"--sf-popover-max-height":{"type":"length","state":"default"}}}');

/***/ },

/***/ "0f5fc1613e82"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Popover","runtime":{}}');

/***/ },

/***/ "947fffd789ac"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Всплывающая панель","runtime":{}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("e470697f4c03");
/******/
/******/ })()
;