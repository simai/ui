/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "d4f7aa048f0e"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "bffb4b61998b"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   attachResizer: () => (/* binding */ attachResizer),
/* harmony export */   setResizerValue: () => (/* binding */ setValue)
/* harmony export */ });
// The width a person changes by an edge, as one behaviour: a drag, the arrow
// keys (Shift: four steps; Home and End: the limits; PageUp and PageDown: four
// steps), Enter or Space and a double click back to the default, a separator's
// role and value, the resize cursor over the whole page while it lasts. What
// the width is the width of -- a panel, a table's column -- and where it is
// kept is the caller's (owner, 2026-10-14: the admin menu's columns and a
// table's columns are the same gesture).
//
// attach(root, options) -> detach()
//   options.handles   a selector: the handles are root's descendants matching
//                     it, found when used (a table redraws its headers);
//                     without it, root is the one handle.
//   options.session(handle) -> {
//     measure(): the width now, in pixels
//     limits(): {min, max} in pixels
//     apply(width, phase): writes it, returns the width written
//     commit(width): the width a drag or a key ended at
//     reset(): back to the default (Enter, Space, a double click)
//     direction(): +1 when a pointer moving right widens, -1 otherwise
//     step: pixels an arrow moves (default 16)
//     start(), end(): around a drag
//   } -- or null, when this handle does not resize now.
const ACTIVE = 'data-sf-resizer-active';

function setValue(handle, session, width = session.measure()) {
  const {min, max} = session.limits();
  handle.setAttribute('aria-valuemin', String(Math.round(min)));
  handle.setAttribute('aria-valuemax', String(Math.round(max)));
  if (width) handle.setAttribute('aria-valuenow', String(Math.round(width)));
}

function clamp(session, width) {
  const {min, max} = session.limits();
  return Math.round(Math.min(Math.max(min, max), Math.max(min, width)));
}

function attachResizer(root, options = {}) {
  const handleOf = (target) => (options.handles ? target?.closest?.(options.handles) : root);
  const owns = (handle) => handle && (handle === root || root.contains(handle));
  const sessionOf = (handle) => (owns(handle) ? options.session?.(handle) ?? null : null);
  let drag = null;

  const finish = (commit) => {
    const current = drag;
    if (!current) return;
    drag = null;
    globalThis.removeEventListener('pointermove', current.move, true);
    globalThis.removeEventListener('pointerup', current.up, true);
    globalThis.removeEventListener('pointercancel', current.up, true);
    document.documentElement.removeAttribute(ACTIVE);
    delete current.handle.dataset.sfResizing;
    current.session.end?.();
    if (commit && current.width !== Math.round(current.from)) current.session.commit?.(current.width);
  };

  const onPointerDown = (event) => {
    if (event.button > 0 || drag) return;
    const handle = handleOf(event.target);
    const session = sessionOf(handle);
    if (!session) return;
    event.preventDefault();
    event.stopPropagation();
    handle.focus?.({preventScroll: true});
    const from = session.measure();
    const current = {handle, session, pointer: event.pointerId, x: event.clientX, from, width: Math.round(from)};
    current.move = (next) => {
      if (next.pointerId !== current.pointer) return;
      const width = clamp(session, current.from + (next.clientX - current.x) * (session.direction?.() ?? 1));
      if (width === current.width) return;
      current.width = session.apply(width, 'move') ?? width;
      setValue(handle, session, current.width);
    };
    current.up = (next) => {
      if (next.pointerId === current.pointer) finish(true);
    };
    drag = current;
    session.start?.();
    handle.dataset.sfResizing = '';
    document.documentElement.setAttribute(ACTIVE, '');
    globalThis.addEventListener('pointermove', current.move, true);
    globalThis.addEventListener('pointerup', current.up, true);
    globalThis.addEventListener('pointercancel', current.up, true);
  };

  const onKeyDown = (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const handle = handleOf(event.target);
    if (handle !== event.target) return;
    const session = sessionOf(handle);
    if (!session) return;
    const {min, max} = session.limits();
    const now = session.measure();
    const rtl = getComputedStyle(handle).direction === 'rtl';
    const sign = session.direction?.() ?? 1;
    const step = (session.step ?? 16) * (event.shiftKey ? 4 : 1);
    const right = (rtl ? -1 : 1) * sign;
    let next = null;
    if (event.key === 'ArrowRight') next = now + step * right;
    else if (event.key === 'ArrowLeft') next = now - step * right;
    else if (event.key === 'PageUp') next = now + step * 4;
    else if (event.key === 'PageDown') next = now - step * 4;
    else if (event.key === 'Home') next = min;
    else if (event.key === 'End') next = max;
    else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      event.stopPropagation();
      session.reset?.();
      return;
    }
    if (next === null) return;
    event.preventDefault();
    event.stopPropagation();
    const width = session.apply(clamp(session, next), 'end') ?? clamp(session, next);
    setValue(handle, session, width);
    session.commit?.(width);
  };

  const onDoubleClick = (event) => {
    const handle = handleOf(event.target);
    const session = sessionOf(handle);
    if (!session) return;
    event.preventDefault();
    event.stopPropagation();
    session.reset?.();
  };

  // The value is read when the handle is reached, so a redrawn handle says it.
  const onFocusIn = (event) => {
    const handle = handleOf(event.target);
    const session = sessionOf(handle);
    if (session) setValue(handle, session);
  };

  root.addEventListener('pointerdown', onPointerDown);
  root.addEventListener('keydown', onKeyDown);
  root.addEventListener('dblclick', onDoubleClick);
  root.addEventListener('focusin', onFocusIn);
  if (!options.handles) {
    root.setAttribute('role', 'separator');
    root.setAttribute('aria-orientation', 'vertical');
  }
  return () => {
    finish(false);
    root.removeEventListener('pointerdown', onPointerDown);
    root.removeEventListener('keydown', onKeyDown);
    root.removeEventListener('dblclick', onDoubleClick);
    root.removeEventListener('focusin', onFocusIn);
  };
}




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
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SfResizer: () => (/* binding */ SfResizer)
/* harmony export */ });
/* harmony import */ var _engine_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("bffb4b61998b");
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("d4f7aa048f0e");
// sf-resizer: a handle on the edge of a panel that changes its width by a
// drag, the keyboard or a double click back to the default (owner,
// 2026-10-14: the admin menu's columns are widened and narrowed by their
// edges). It is a separator in the accessibility sense -- role="separator",
// focusable, its value the width in pixels between min and max -- and it owns
// nothing but the width it writes: on its target (its parent, or the closest
// ancestor matching `target`), as a custom property when `property` names one,
// otherwise as inline-size. With `storage-key` the width is remembered in this
// browser and restored the next time.


const TEXT = {
  en: {
    label: 'Resize',
    hint: 'Drag, or use the arrow keys; a double click restores the width.'
  },
  ru: {
    label: 'Изменить ширину',
    hint: 'Тяните или нажимайте стрелки; двойной щелчок возвращает ширину.'
  }
};

function pageLanguage(element) {
  const lang = (element.closest('[lang]')?.getAttribute('lang') || document.documentElement.lang || 'en').slice(0, 2).toLowerCase();
  return TEXT[lang] ? lang : 'en';
} // A CSS length (tokens included) in pixels, read in the target's context.


function pixels(value, context) {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(value);
  if (Number.isFinite(number)) return number;
  const probe = document.createElement('span');
  probe.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none;block-size:0;padding:0;border:0';
  probe.style.inlineSize = String(value);
  (context?.isConnected ? context : document.body).append(probe);
  const width = parseFloat(getComputedStyle(probe).width);
  probe.remove();
  return Number.isFinite(width) ? width : null;
}

function readStored(key) {
  try {
    return key ? Number(globalThis.localStorage?.getItem(`sf-resizer:${key}`)) || null : null;
  } catch {
    return null;
  }
}

function writeStored(key, value) {
  try {
    if (!key) return;
    if (value === null) globalThis.localStorage?.removeItem(`sf-resizer:${key}`);else globalThis.localStorage?.setItem(`sf-resizer:${key}`, String(Math.round(value)));
  } catch {
    /* a private window keeps no width; the drag still works */
  }
}

class SfResizer extends HTMLElement {
  static get observedAttributes() {
    return ['min', 'max', 'label', 'disabled', 'value'];
  }

  constructor() {
    super();

    this._onWindowResize = () => this.clampToLimits();
  }

  connectedCallback() {
    if (!this.hasAttribute('tabindex')) this.tabIndex = 0;
    this.syncLabel(); // The gesture is the shared one (attachResizer): the element only says
    // what the width is the width of and where it is kept.

    this._detach = (0,_engine_mjs__WEBPACK_IMPORTED_MODULE_0__.attachResizer)(this, {
      session: () => this.disabled ? null : this.session()
    });
    globalThis.addEventListener('resize', this._onWindowResize); // Restored after the target has laid out, so a percentage limit is read
    // against a real width.

    requestAnimationFrame(() => {
      if (!this.isConnected) return;
      const target = this.target();
      if (target && getComputedStyle(target).position === 'static') target.style.position = 'relative'; // A width the host keeps for the person (value) wins over this
      // browser's memory of it.

      const kept = Number(this.getAttribute('value')) || readStored(this.storageKey);
      if (kept) this.apply(kept);
      this.syncValue();
    });
  }

  disconnectedCallback() {
    this._detach?.();
    this._detach = null;
    globalThis.removeEventListener('resize', this._onWindowResize);
  }

  attributeChangedCallback(name, before, after) {
    if (name === 'value' && after && after !== before && this.isConnected) {
      this.restore(after);
      return;
    }

    if (this.isConnected) {
      this.syncLabel();
      this.syncValue();
    }
  }

  get storageKey() {
    return this.getAttribute('storage-key') || '';
  }

  get property() {
    return this.getAttribute('property') || '';
  }

  get step() {
    return Math.max(1, Number(this.getAttribute('step')) || 16);
  }

  get disabled() {
    return this.hasAttribute('disabled');
  }

  target() {
    const selector = this.getAttribute('target');
    return (selector ? this.parentElement?.closest(selector) : this.parentElement) ?? null;
  }

  limits() {
    const context = this.target()?.parentElement ?? document.body;
    const min = pixels(this.getAttribute('min') || '12rem', context) ?? 0;
    const max = pixels(this.getAttribute('max') || '40rem', context) ?? Infinity;
    return {
      min,
      max: Math.max(min, max)
    };
  }

  width() {
    return this.target()?.getBoundingClientRect().width ?? 0;
  }

  session() {
    return {
      measure: () => this.width(),
      limits: () => this.limits(),
      apply: (width, phase) => {
        const written = this.apply(width);
        if (phase === 'move' && written !== null) this.announce(written, 'move');
        return written;
      },
      commit: width => this.commit(width),
      reset: () => this.reset(),
      // A handle on the inline end widens the panel rightwards in a
      // left-to-right page; on the start, leftwards.
      direction: () => {
        const rtl = getComputedStyle(this).direction === 'rtl';
        return (rtl ? -1 : 1) * (this.getAttribute('edge') === 'inline-start' ? -1 : 1);
      },
      step: this.step
    };
  }

  apply(value) {
    const target = this.target();
    if (!target) return null;
    const {
      min,
      max
    } = this.limits();
    const width = Math.round(Math.min(max, Math.max(min, value)));
    if (this.property) target.style.setProperty(this.property, `${width}px`);else target.style.inlineSize = `${width}px`;
    this.syncValue(width);
    return width;
  }

  announce(width, phase) {
    this.dispatchEvent(new CustomEvent('sf-resize', {
      bubbles: true,
      composed: true,
      detail: {
        width,
        phase
      }
    }));
  }

  commit(width) {
    writeStored(this.storageKey, width);
    this.announce(width, 'end');
  } // Back to the width the page's stylesheet gives, and forgotten.


  reset() {
    if (this.disabled) return;
    const target = this.target();
    if (!target) return;
    if (this.property) target.style.removeProperty(this.property);else target.style.removeProperty('inline-size');
    writeStored(this.storageKey, null);
    requestAnimationFrame(() => {
      const width = Math.round(this.width());
      this.syncValue(width);
      this.announce(width, 'reset');
    });
  } // A width the host keeps (a person's settings): written as if dragged,
  // within the limits, and remembered as the browser's too.


  restore(width) {
    const number = Number(width);
    if (!Number.isFinite(number) || number <= 0) return null;
    const written = this.apply(number);
    if (written !== null) writeStored(this.storageKey, written);
    return written;
  } // A window narrowed under a remembered width brings it back within limits.


  clampToLimits() {
    const target = this.target();
    if (!target) return;
    const written = this.property ? target.style.getPropertyValue(this.property) : target.style.inlineSize;
    if (!written) return;
    const {
      min,
      max
    } = this.limits();
    const now = this.width();
    if (now > max || now < min) this.apply(now);
  }

  syncLabel() {
    const text = TEXT[pageLanguage(this)];

    if (!this.getAttribute('aria-label') || this._ownLabel) {
      this.setAttribute('aria-label', this.getAttribute('label') || text.label);
      this._ownLabel = true;
    }

    this.title = this.getAttribute('label') ? `${this.getAttribute('label')}. ${text.hint}` : text.hint;
    if (this.disabled) this.setAttribute('aria-disabled', 'true');else this.removeAttribute('aria-disabled');
  }

  syncValue(width = this.width()) {
    (0,_engine_mjs__WEBPACK_IMPORTED_MODULE_0__.setResizerValue)(this, {
      limits: () => this.limits(),
      measure: () => width
    }, width);
  }

}
if (!customElements.get('sf-resizer')) customElements.define('sf-resizer', SfResizer);
globalThis.SF = globalThis.SF || {}; // attach: the same gesture on any handle -- a table's column edges use it.

globalThis.SF.Resizer = Object.freeze({
  SfResizer,
  attach: _engine_mjs__WEBPACK_IMPORTED_MODULE_0__.attachResizer,
  attachResizer: _engine_mjs__WEBPACK_IMPORTED_MODULE_0__.attachResizer
});
})();

/******/ })()
;