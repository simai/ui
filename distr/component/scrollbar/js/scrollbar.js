/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "5256f7956871"
() {

const ROOT_SELECTOR = '.sf-scrollbar';
const VIEWPORT_SELECTOR = '.sf-scrollbar__viewport';
const TRACK_CLASS = 'sf-scrollbar__track';
const THUMB_CLASS = 'sf-scrollbar__thumb';
const MANAGED_PRESETS = new Set(['overlay', 'persistent']);
const VALID_PRESETS = new Set(['overlay', 'standard', 'persistent', 'hidden']);
const VALID_AXES = new Set(['vertical', 'horizontal']);
const IDLE_DELAY = 900;
const controllers = new WeakMap();
let viewportId = 0;

function getPreset(root) {
  const value = String(root.getAttribute('data-sf-scrollbar') || 'overlay').trim().toLowerCase();
  return VALID_PRESETS.has(value) ? value : 'overlay';
}

function getAxis(root) {
  const value = String(root.getAttribute('data-sf-scrollbar-axis') || 'vertical').trim().toLowerCase();
  return VALID_AXES.has(value) ? value : 'vertical';
}

function createTrack(viewport, axis) {
  const track = document.createElement('div');
  const thumb = document.createElement('button');
  track.className = `${TRACK_CLASS} ${TRACK_CLASS}--${axis}`;
  thumb.className = `${THUMB_CLASS} ${THUMB_CLASS}--${axis}`;
  thumb.type = 'button';
  thumb.setAttribute('role', 'scrollbar');
  thumb.setAttribute('aria-orientation', axis);
  thumb.setAttribute('aria-valuemin', '0');
  thumb.setAttribute('aria-valuemax', '100');
  thumb.setAttribute('aria-valuenow', '0');
  thumb.setAttribute('aria-label', viewport.getAttribute('aria-label') || 'Scroll');

  if (!viewport.id) {
    viewportId += 1;
    viewport.id = `sf-scrollbar-viewport-${viewportId}`;
  }

  thumb.setAttribute('aria-controls', viewport.id);
  track.append(thumb);
  return {
    track,
    thumb
  };
}

class ScrollbarController {
  constructor(root, viewport, preset, axis) {
    this.root = root;
    this.viewport = viewport;
    this.preset = preset;
    this.axis = axis;
    this.idleTimer = 0;
    this.dragging = false;
    this.pointerOverTrack = false;
    this.dragPointerOffset = 0;
    this.cleanup = [];
    const {
      track,
      thumb
    } = createTrack(viewport, axis);
    this.track = track;
    this.thumb = thumb;
    root.append(track);
    this.bind();
    this.sync();
    this.setIdle();
  }

  listen(target, type, listener, options) {
    target.addEventListener(type, listener, options);
    this.cleanup.push(() => target.removeEventListener(type, listener, options));
  }

  bind() {
    this.listen(this.viewport, 'scroll', () => {
      this.sync();
      this.activate();
    }, {
      passive: true
    });
    this.listen(this.track, 'pointerenter', () => {
      this.pointerOverTrack = true;
      this.activate();
    });
    this.listen(this.track, 'pointerleave', () => {
      this.pointerOverTrack = false;
      this.scheduleIdle();
    });
    this.listen(this.track, 'pointerdown', event => {
      if (event.target !== this.track) return;
      event.preventDefault();
      const thumbRect = this.thumb.getBoundingClientRect();
      const pointer = this.axis === 'horizontal' ? event.clientX : event.clientY;
      const thumbStart = this.axis === 'horizontal' ? thumbRect.left : thumbRect.top;
      const direction = pointer < thumbStart ? -1 : 1;
      const viewportSize = this.axis === 'horizontal' ? this.viewport.clientWidth : this.viewport.clientHeight;
      const page = Math.max(40, viewportSize - 40);
      this.viewport.scrollBy(this.axis === 'horizontal' ? {
        left: direction * page
      } : {
        top: direction * page
      });
      this.activate();
    });
    this.listen(this.thumb, 'pointerdown', event => {
      event.preventDefault();
      const thumbRect = this.thumb.getBoundingClientRect();
      this.dragging = true;
      this.dragPointerOffset = this.axis === 'horizontal' ? event.clientX - thumbRect.left : event.clientY - thumbRect.top;
      this.root.dataset.sfScrollbarDragging = 'true';
      this.thumb.setPointerCapture?.(event.pointerId);
      this.activate();
    });
    this.listen(this.thumb, 'pointermove', event => {
      if (!this.dragging) return;
      const trackRect = this.track.getBoundingClientRect();
      const trackSize = this.axis === 'horizontal' ? this.track.clientWidth : this.track.clientHeight;
      const thumbSize = this.axis === 'horizontal' ? this.thumb.offsetWidth : this.thumb.offsetHeight;
      const viewportSize = this.axis === 'horizontal' ? this.viewport.clientWidth : this.viewport.clientHeight;
      const contentSize = this.axis === 'horizontal' ? this.viewport.scrollWidth : this.viewport.scrollHeight;
      const pointer = this.axis === 'horizontal' ? event.clientX : event.clientY;
      const trackStart = this.axis === 'horizontal' ? trackRect.left : trackRect.top;
      const maxThumbOffset = Math.max(1, trackSize - thumbSize);
      const maxScroll = Math.max(0, contentSize - viewportSize);
      const pointerOffset = pointer - trackStart - this.dragPointerOffset;
      const thumbOffset = Math.min(maxThumbOffset, Math.max(0, pointerOffset));

      if (this.axis === 'horizontal') {
        this.viewport.scrollLeft = thumbOffset / maxThumbOffset * maxScroll;
      } else {
        this.viewport.scrollTop = thumbOffset / maxThumbOffset * maxScroll;
      }
    });

    const endDrag = event => {
      if (!this.dragging) return;
      this.dragging = false;
      this.root.dataset.sfScrollbarDragging = 'false';

      if (this.thumb.hasPointerCapture?.(event.pointerId)) {
        this.thumb.releasePointerCapture(event.pointerId);
      }

      this.scheduleIdle();
    };

    this.listen(this.thumb, 'pointerup', endDrag);
    this.listen(this.thumb, 'pointercancel', endDrag);
    this.listen(this.thumb, 'lostpointercapture', endDrag);
    this.listen(this.thumb, 'focus', () => this.activate());
    this.listen(this.thumb, 'blur', () => this.scheduleIdle());
    this.listen(this.thumb, 'keydown', event => {
      const line = 40;
      const viewportSize = this.axis === 'horizontal' ? this.viewport.clientWidth : this.viewport.clientHeight;
      const page = Math.max(line, viewportSize - line);
      const verticalCommands = {
        ArrowUp: () => this.viewport.scrollBy({
          top: -line
        }),
        ArrowDown: () => this.viewport.scrollBy({
          top: line
        }),
        PageUp: () => this.viewport.scrollBy({
          top: -page
        }),
        PageDown: () => this.viewport.scrollBy({
          top: page
        })
      };
      const horizontalCommands = {
        ArrowLeft: () => this.viewport.scrollBy({
          left: -line
        }),
        ArrowRight: () => this.viewport.scrollBy({
          left: line
        }),
        PageUp: () => this.viewport.scrollBy({
          left: -page
        }),
        PageDown: () => this.viewport.scrollBy({
          left: page
        })
      };
      const commands = { ...(this.axis === 'horizontal' ? horizontalCommands : verticalCommands),
        Home: () => {
          if (this.axis === 'horizontal') this.viewport.scrollLeft = 0;else this.viewport.scrollTop = 0;
        },
        End: () => {
          if (this.axis === 'horizontal') this.viewport.scrollLeft = this.viewport.scrollWidth;else this.viewport.scrollTop = this.viewport.scrollHeight;
        }
      };
      if (!commands[event.key]) return;
      event.preventDefault();
      commands[event.key]();
      this.activate();
    });

    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => this.sync());
      this.resizeObserver.observe(this.viewport);
    } else {
      this.listen(window, 'resize', () => this.sync(), {
        passive: true
      });
    }
  }

  sync() {
    const viewportSize = this.axis === 'horizontal' ? this.viewport.clientWidth : this.viewport.clientHeight;
    const contentSize = this.axis === 'horizontal' ? this.viewport.scrollWidth : this.viewport.scrollHeight;
    const scrollPosition = this.axis === 'horizontal' ? this.viewport.scrollLeft : this.viewport.scrollTop;
    const maxScroll = Math.max(0, contentSize - viewportSize);
    const hasOverflow = maxScroll > 1;
    const thumbSize = hasOverflow ? Math.max(44, Math.round(viewportSize * viewportSize / contentSize)) : viewportSize;
    const maxThumbOffset = Math.max(0, viewportSize - thumbSize);
    const ratio = maxScroll ? scrollPosition / maxScroll : 0;
    this.root.dataset.sfScrollbarOverflow = String(hasOverflow);

    if (this.axis === 'horizontal') {
      this.thumb.style.inlineSize = `${thumbSize}px`;
    } else {
      this.thumb.style.blockSize = `${thumbSize}px`;
    }

    this.thumb.style.setProperty('--sf-scrollbar-thumb-offset', `${Math.round(maxThumbOffset * ratio)}px`);
    this.thumb.setAttribute('aria-valuenow', String(Math.round(ratio * 100)));
    this.thumb.disabled = !hasOverflow;
  }

  activate() {
    window.clearTimeout(this.idleTimer);
    this.root.dataset.sfScrollbarState = 'active';

    if (this.preset === 'overlay') {
      this.scheduleIdle();
    }
  }

  scheduleIdle() {
    window.clearTimeout(this.idleTimer);

    if (this.preset === 'persistent' || this.dragging || this.pointerOverTrack || document.activeElement === this.thumb) {
      return;
    }

    this.idleTimer = window.setTimeout(() => this.setIdle(), IDLE_DELAY);
  }

  setIdle() {
    this.root.dataset.sfScrollbarState = this.preset === 'persistent' ? 'active' : 'idle';
  }

  destroy() {
    window.clearTimeout(this.idleTimer);
    this.resizeObserver?.disconnect();
    this.cleanup.forEach(remove => remove());
    this.track.remove();
    delete this.root.dataset.sfScrollbarState;
    delete this.root.dataset.sfScrollbarDragging;
    delete this.root.dataset.sfScrollbarOverflow;
    delete this.root.dataset.sfScrollbarReady;
  }

}

function destroyScrollbar(root) {
  const controller = controllers.get(root);
  if (!controller) return;
  controller.destroy();
  controllers.delete(root);
}

function initScrollbar(root) {
  if (!(root instanceof HTMLElement) || !root.matches(ROOT_SELECTOR)) return;
  const preset = getPreset(root);
  const axis = getAxis(root);
  const requestedPreset = String(root.getAttribute('data-sf-scrollbar') || '').trim().toLowerCase();

  if (requestedPreset && !VALID_PRESETS.has(requestedPreset)) {
    root.setAttribute('data-sf-scrollbar', preset);
  }

  const existing = controllers.get(root);
  if (existing?.preset === preset && existing?.axis === axis) return;
  if (existing) destroyScrollbar(root);
  root.dataset.sfScrollbarReady = 'true';
  if (!MANAGED_PRESETS.has(preset)) return;
  const viewport = root.querySelector(`:scope > ${VIEWPORT_SELECTOR}`);
  if (!(viewport instanceof HTMLElement)) return;
  controllers.set(root, new ScrollbarController(root, viewport, preset, axis));
}

function initScrollbars(target = document) {
  if (target instanceof HTMLElement && target.matches(ROOT_SELECTOR)) {
    initScrollbar(target);
  }

  target.querySelectorAll?.(ROOT_SELECTOR).forEach(initScrollbar);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initScrollbars(document));
} else {
  initScrollbars(document);
}

if (typeof MutationObserver !== 'undefined') {
  new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.type === 'attributes' && mutation.target instanceof HTMLElement && mutation.target.matches(ROOT_SELECTOR)) {
        initScrollbar(mutation.target);
        return;
      }

      mutation.removedNodes.forEach(node => {
        if (!(node instanceof HTMLElement)) return;
        if (node.matches(ROOT_SELECTOR)) destroyScrollbar(node);
        node.querySelectorAll?.(ROOT_SELECTOR).forEach(destroyScrollbar);
      });
      mutation.addedNodes.forEach(node => {
        if (node instanceof HTMLElement) initScrollbars(node);
      });
    });
  }).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-sf-scrollbar', 'data-sf-scrollbar-axis'],
    childList: true,
    subtree: true
  });
}

globalThis.SF = globalThis.SF || {};
globalThis.SF.Scrollbar = {
  destroy: destroyScrollbar,
  init: initScrollbars
};

/***/ },

/***/ "435019e7ed9c"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _scrollbar__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("5256f7956871");
/* harmony import */ var _scrollbar__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_scrollbar__WEBPACK_IMPORTED_MODULE_0__);
/*
* Main JS file for including JS for component.
*
* Imports:
* - Base function component (_component_name.js)
*/


/***/ },

/***/ "a22ce96bf26f"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
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
let __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("a22ce96bf26f");
/* harmony import */ var _js_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("435019e7ed9c");
/**
* SIMAI Framework
* Copyright 2008-2026 SIMAI Ltd
* http://simai.studio
* Read the license: http://framework.simai.studio/license/
* Documentation: http://framework.simai.studio/
* Support: http://simai.studio/support/
*
* SCROLLBAR
*
* Entry point for importing components from this directory.
* Simplifies the import process in other parts of the project.
* Instead of importing individual files, all component can be imported through this file.
*/


})();

/******/ })()
;