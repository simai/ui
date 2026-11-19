/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "6014669ceac6"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _register_helper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("58661bec99a6");
/* harmony import */ var _core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("695f21e50358");
/* harmony import */ var _motion_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("524cdaa09638");



const accordionInstances = new WeakMap();
const ACCORDION_GROUP_SELECTOR = '.sf-accordion-group';
const LEGACY_SINGLE_GROUP_SELECTOR = '[data-sf-accordion-mode="single"]';
const PLUS_MINUS_MODIFIER = 'sf-accordion--plus-minus'; // One section needs no disclosure (simai/ui-source#19, #29; ui-mail P-07): a
// section marked single, or the only section of a group, is a plain section --
// its content always shown, its heading a heading and not a toggle.

const SINGLE_MODIFIER = 'sf-accordion--single'; // A group that keeps its one section a toggle says so.

const SINGLE_TOGGLE_ATTRIBUTE = 'data-single-section'; // Every closed panel is findable (owner decision C154 (6)): it is closed
// with hidden="until-found", so the browser's find-in-page searches it and
// opens it, firing beforematch first, and the section follows (aria-expanded,
// the active mark, the marker). A panel the page closed with the hidden
// attribute or the hidden class becomes findable when the runtime takes it;
// the hidden class is never left on a closed panel, as its display: none
// would take the text out of the search (accordion study AC-8). A browser
// without until-found hides such a panel as it hides any hidden one.

const UNTIL_FOUND = 'until-found'; // The marker is the header's last icon; an icon before the title
// (.sf-accordion-lead) is not the marker and keeps its glyph.

const MARKER_SELECTOR = '.sf-icon:not(.sf-accordion-lead)';

class SfAccordion {
  static componentName = 'Accordion';

  constructor(el) {
    this.el = el;
    this.content = el?.querySelector?.('.sf-accordion-content') || null;
    this.title = el?.querySelector?.('.sf-accordion-title') || null;
    this.trigger = el?.querySelector?.('.sf-accordion-trigger') || el;
    const markers = this.trigger?.querySelectorAll?.(MARKER_SELECTOR);
    this.icon = (markers?.length ? markers[markers.length - 1] : null) || el?.querySelector?.(`:scope > ${MARKER_SELECTOR}`) || el?.querySelector?.(MARKER_SELECTOR);
    this.onClick = this.handleClick.bind(this);
    this.onKeydown = this.handleKeydown.bind(this);
    this.onBeforeMatch = this.handleBeforeMatch.bind(this);
  }

  init() {
    if (!this.el || this.el.dataset.sfAccordionInit === '1') return;
    this.el.dataset.sfAccordionInit = '1';
    accordionInstances.set(this.el, this);
    const usesLegacyTrigger = this.trigger === this.el;

    if (usesLegacyTrigger) {
      this.el.classList.add('sf-accordion--legacy');

      if (!this.trigger.hasAttribute('role')) {
        this.trigger.setAttribute('role', 'button');
      }

      if (!this.trigger.hasAttribute('tabindex')) {
        this.trigger.setAttribute('tabindex', '0');
      }
    }

    this.bindRelationship(); // A closed panel is hidden for everyone from the first paint, not only to
    // the eye: markup that closes it with the `hidden` class alone (a utility
    // that may not have arrived yet) gets the `hidden` attribute too, so its
    // content is out of the tab order and the accessibility tree before the
    // first toggle (simai/ui-source#30).
    // A closed panel is findable from here on: hidden="until-found".

    if (this.content && !this.isOpen()) {
      this.hideContent();
    }

    this.syncState();
    this.trigger.addEventListener('click', this.onClick);
    this.content?.addEventListener('beforematch', this.onBeforeMatch);

    if (usesLegacyTrigger) {
      this.trigger.addEventListener('keydown', this.onKeydown);
    }

    syncSingleSections(this.el.parentElement);
    this.syncSingle();
  } // Whether this section is alone: marked single, or the only section of a
  // group that does not keep its one section a toggle. The legacy markup,
  // where the section itself is the control, keeps its toggle.


  isSingle() {
    if (!this.el || this.trigger === this.el || !this.content) return false;
    if (this.el.classList.contains(SINGLE_MODIFIER)) return true;
    const group = this.el.parentElement;
    if (!group?.matches?.(ACCORDION_GROUP_SELECTOR)) return false;
    if (group.getAttribute(SINGLE_TOGGLE_ATTRIBUTE) === 'toggle') return false;
    return group.querySelectorAll(':scope > .sf-accordion').length === 1;
  } // A single section: the button gives way to a plain element holding the
  // same title (a heading with nothing to press), and the content is shown.
  // When a second section joins the group the button comes back, open: the
  // content the reader sees does not vanish under them.


  syncSingle() {
    if (!this.el || this.trigger === this.el) return;
    const single = this.isSingle();
    if (single === Boolean(this.staticHeader)) return;

    if (single) {
      const header = document.createElement('span');
      header.className = this.trigger.className;
      header.id = this.trigger.id;
      header.setAttribute('data-sf-accordion-static', '');
      header.append(...this.trigger.childNodes);
      this.trigger.removeAttribute('id');
      this.trigger.replaceWith(header);
      this.staticHeader = header;
      this.el.classList.add('sf-accordion--static');
      this.content.hidden = false;
      this.content.classList.remove('hidden');
      this.el.classList.add('active');
      return;
    }

    const header = this.staticHeader;
    this.trigger.id = header.id;
    this.trigger.append(...header.childNodes);
    header.replaceWith(this.trigger);
    this.staticHeader = null;
    this.el.classList.remove('sf-accordion--static');
    this.setOpen(true);
  }

  destroy() {
    if (!this.el) return;
    this.trigger?.removeEventListener('click', this.onClick);
    this.trigger?.removeEventListener('keydown', this.onKeydown);
    this.content?.removeEventListener('beforematch', this.onBeforeMatch);
    accordionInstances.delete(this.el);
    this.el.classList.remove('sf-accordion--legacy');
    delete this.el.dataset.sfAccordionInit;
  }

  bindRelationship() {
    if (!this.trigger || !this.content) return; // A section's path id and a local name (standard 1.3.8 §7.1.1,
    // simai/ui-source#41): <path>--trigger and <path>--panel, the same in every
    // bundle and in server markup. A module counter numbered them in creation
    // order, once per bundle that carries this code.

    const path = (0,_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_1__.instancePath)(this.el, {
      kind: 'sf-accordion'
    });

    if (!this.trigger.id) {
      this.trigger.id = (0,_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_1__.partId)(path, 'trigger');
    }

    if (!this.content.id) {
      this.content.id = (0,_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_1__.partId)(path, 'panel');
    }

    this.trigger.setAttribute('aria-controls', this.content.id);

    if (this.content.getAttribute('role') === 'region') {
      this.content.setAttribute('aria-labelledby', this.trigger.id);
    }
  }

  handleClick() {
    this.toggle();
  } // Find-in-page found text in a closed panel: the browser is about to show
  // it, so the section opens as a click would open it -- aria-expanded, the
  // active mark, the chevron, and in single mode the other section closes.
  // The browser shows the text at once, so the section does not move.


  handleBeforeMatch() {
    if (this.staticHeader) return;
    this.setOpen(true, {
      motion: false
    });
  } // Closes the panel: hidden="until-found", findable, never the hidden class.


  hideContent() {
    this.content.setAttribute('hidden', UNTIL_FOUND);
    this.content.classList.remove('hidden');
  }

  handleKeydown(event) {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    this.toggle();
  }

  isOpen() {
    if (!this.content) return false;
    return !this.content.hidden && !this.content.classList.contains('hidden');
  }

  toggle() {
    if (!this.content) return;
    this.setOpen(!this.isOpen());
  } // Opens or closes the panel. The section moves to its new height on the
  // sheet's clock (C154 (4)); a closing panel stays drawn until the section
  // has shrunk to its header. No motion under reduced motion.


  setOpen(open, {
    motion = true
  } = {}) {
    if (!this.content || this.staticHeader) return;
    const from = (0,_motion_js__WEBPACK_IMPORTED_MODULE_2__.sectionHeight)(this.el);
    (0,_motion_js__WEBPACK_IMPORTED_MODULE_2__.stopSectionMotion)(this.el);
    (0,_motion_js__WEBPACK_IMPORTED_MODULE_2__.markClosing)(this.el, false);

    if (open) {
      this.closeSingleModeSiblings();
      this.content.hidden = false;
      this.content.classList.remove('hidden');
    } else {
      this.hideContent();
    }

    this.syncState();
    if (!motion) return;
    const moving = (0,_motion_js__WEBPACK_IMPORTED_MODULE_2__.moveSection)(this.el, from, () => (0,_motion_js__WEBPACK_IMPORTED_MODULE_2__.markClosing)(this.el, false));
    if (moving && !open) (0,_motion_js__WEBPACK_IMPORTED_MODULE_2__.markClosing)(this.el, true);
  }

  closeSingleModeSiblings() {
    const group = this.singleModeGroup();
    if (!group) return;
    group.querySelectorAll(':scope > .sf-accordion').forEach(item => {
      if (item === this.el) return;
      const instance = accordionInstances.get(item);

      if (instance?.isOpen()) {
        instance.setOpen(false);
      }
    });
  }

  singleModeGroup() {
    const canonicalGroup = this.el.closest?.(ACCORDION_GROUP_SELECTOR);

    if (canonicalGroup) {
      return canonicalGroup.getAttribute('data-mode') === 'single' ? canonicalGroup : null;
    }

    return this.el.closest?.(LEGACY_SINGLE_GROUP_SELECTOR) || null;
  }

  syncState() {
    const open = this.isOpen();
    this.trigger?.setAttribute('aria-expanded', open ? 'true' : 'false');
    this.el?.classList.toggle('active', open);

    if (this.icon) {
      this.icon.textContent = this.el.classList.contains(PLUS_MINUS_MODIFIER) ? open ? 'remove' : 'add' : 'chevron_right';
      this.icon.setAttribute('aria-hidden', 'true');
    }
  }

} // Re-reads whether the sections of a group are single, after a section joined
// or left it.


function syncSingleSections(group) {
  if (!group?.matches?.(ACCORDION_GROUP_SELECTOR)) return;
  group.querySelectorAll(':scope > .sf-accordion').forEach(item => {
    accordionInstances.get(item)?.syncSingle();
  });
}

function initAccordions(root = document) {
  if (!root?.querySelectorAll) return;
  root.querySelectorAll('.sf-accordion').forEach(el => {
    const inst = accordionInstances.get(el) || new SfAccordion(el);
    inst.init();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initAccordions(), {
    once: true
  });
} else {
  initAccordions();
}

if (typeof MutationObserver !== 'undefined') {
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if ([...mutation.removedNodes].some(node => node instanceof HTMLElement && node.matches('.sf-accordion'))) {
        syncSingleSections(mutation.target);
      }

      mutation.addedNodes.forEach(node => {
        if (!(node instanceof HTMLElement)) return;

        if (node.matches('.sf-accordion')) {
          const inst = accordionInstances.get(node) || new SfAccordion(node);
          inst.init();
          return;
        }

        if (node.querySelector?.('.sf-accordion')) {
          initAccordions(node);
        }
      });
    });
  });
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
}

(0,_register_helper__WEBPACK_IMPORTED_MODULE_0__["default"])('Accordion', SfAccordion);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SfAccordion);

/***/ },

/***/ "5383c575ac1a"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _accordion__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("6014669ceac6");
/*
* Main JS file for including JS for component.
*
* Imports:
* - Base function component (_component_name.js)
*/


/***/ },

/***/ "524cdaa09638"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CLOSING_ATTRIBUTE: () => (/* binding */ CLOSING_ATTRIBUTE),
/* harmony export */   markClosing: () => (/* binding */ markClosing),
/* harmony export */   moveSection: () => (/* binding */ moveSection),
/* harmony export */   sectionClock: () => (/* binding */ sectionClock),
/* harmony export */   sectionHeight: () => (/* binding */ sectionHeight),
/* harmony export */   stopSectionMotion: () => (/* binding */ stopSectionMotion)
/* harmony export */ });
// The height motion of an accordion section (owner decision C154 (4)): the
// section grows or shrinks to its new height on the clock of the toggle and
// the check box (C66, C121) -- 200 ms, --sf-ease-move -- and its marker
// turns on the same clock. The clock is the class sheet's: the section's
// transition on block-size, which nothing else animates, so a page that
// changes --sf-accordion--duration or asks for reduced motion (the sheet
// sets it to none) changes the motion here too. Shared by the class runtime
// and sf-accordion; stateless, so each bundle may carry its own copy.
const running = new WeakMap(); // The mark of a section that shrinks to its header: its closed panel stays
// drawn (the class sheet), so the text leaves with the motion.

const CLOSING_ATTRIBUTE = 'data-sf-accordion-closing'; // Panels made inert here, so only those are given back.

const madeInert = new WeakSet(); // Marks a section closing or not. A closing panel is drawn but closed: from
// the start of the close nothing in it takes focus, Tab or a click (inert),
// as after the motion, when the sheet no longer draws it; it is given back
// when the motion ends or the section opens again.

function markClosing(section, closing) {
  if (!section) return;
  if (closing) section.setAttribute(CLOSING_ATTRIBUTE, '');else section.removeAttribute(CLOSING_ATTRIBUTE);
  const panel = Array.from(section.children ?? []).find(child => child.classList?.contains('sf-accordion-content'));
  if (!panel) return;

  if (closing) {
    if (panel.hasAttribute('inert')) return;
    panel.setAttribute('inert', '');
    madeInert.add(panel);
  } else if (madeInert.has(panel)) {
    madeInert.delete(panel);
    panel.removeAttribute('inert');
  }
}

function seconds(value) {
  const first = String(value || '').split(',')[0].trim();
  if (!first) return 0;
  const number = parseFloat(first);
  if (!Number.isFinite(number)) return 0;
  return first.endsWith('ms') ? number : number * 1000;
} // The section's clock: [duration in ms, easing], or null when it does not
// move -- reduced motion, a zero duration, or no layout (a hidden page).


function sectionClock(section) {
  if (!section || typeof getComputedStyle !== 'function' || typeof section.animate !== 'function') return null;
  if (globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return null;
  const style = getComputedStyle(section);
  const properties = String(style.transitionProperty || '').split(',').map(one => one.trim());
  const at = properties.findIndex(one => one === 'block-size' || one === 'height' || one === 'all');
  if (at < 0) return null;
  const durations = String(style.transitionDuration || '').split(',');
  const easings = String(style.transitionTimingFunction || '').split(/,(?![^(]*\))/u);
  const duration = seconds(durations[at] ?? durations[0]);
  if (!(duration > 0)) return null;
  return [duration, (easings[at] ?? easings[0] ?? 'ease').trim()];
} // The height the section stands at now, mid-motion included.

function sectionHeight(section) {
  return section?.getBoundingClientRect?.().height ?? 0;
} // Stops a motion still running on the section (a second press before the
// first ended): the next one starts from where this one stood.

function stopSectionMotion(section) {
  const animation = running.get(section);
  if (!animation) return;
  running.delete(section);
  animation.onfinish = null;
  animation.cancel();
} // Moves the section from the height it stood at to the one it stands at now.
// `done` runs when the motion ends (not when a newer one replaces it); it is
// how a closing section keeps its content in view until it has shrunk.
// Answers whether anything moves; without motion `done` runs at once.

function moveSection(section, from, done) {
  const clock = sectionClock(section);
  const to = sectionHeight(section);

  if (!clock || !(from >= 0) || Math.abs(to - from) < 1) {
    done?.();
    return false;
  }

  const [duration, easing] = clock;
  const animation = section.animate({
    blockSize: [`${from}px`, `${to}px`]
  }, {
    duration,
    easing
  });
  running.set(section, animation);

  animation.onfinish = () => {
    if (running.get(section) === animation) running.delete(section);
    done?.();
  };

  return true;
}

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

/***/ "695f21e50358"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   instancePath: () => (/* binding */ instancePath),
/* harmony export */   partId: () => (/* binding */ partId),
/* harmony export */   pathIsSettled: () => (/* binding */ pathIsSettled)
/* harmony export */ });
// An instance's id is its role path (standard simai.smart-component 1.3.8
// §7.1.1; simai/ui-source#41).
//
//   - at the top of the page: `page/<host id or data-sf-role>`;
//   - a part with `data-sf-role` inside another instance:
//     `<parent path>/<role>`;
//   - neither: `<kind>[<n>]`, n counted in document order among the
//     instances of the same kind that have neither.
//
// Ids that templates write (`for`, `aria-controls`, `aria-labelledby`) are
// `<path with every non-word run as ->--<local name>`. A counter is never an
// id: the field ids used to come from a module-scope counter, and every
// bundle that carries the field code (eight of them) had its own, so a class
// sf-quantity and an <sf-input-quantity> on one page both took
// `sf-quantity-1-control` and a label pointed at the other field. Ids that
// follow creation order also swap when two instances swap, and server markup
// (§5.4) cannot repeat them. A path is read from the page, so every bundle
// gives the same answer.
//
// `kind` is the element's tag for a Smart element; class markup passes its
// root class and is told apart as `class.<root class>`.
const isElement = node => node && node.nodeType === 1 && typeof node.getAttribute === 'function';

const isCustom = node => isElement(node) && String(node.localName || '').includes('-');

function parentInstance(node) {
  for (let current = node.parentNode || node.host || null; current; current = current.parentNode || current.host || null) {
    if (isCustom(current)) return current;
  }

  return null;
}

function kindOf(owner, kind) {
  const tag = String(owner?.localName || '').toLowerCase();
  if (tag && tag.includes('-')) return tag;
  return `class.${kind || tag || 'element'}`;
}

function documentIndex(owner, kind) {
  const doc = owner?.ownerDocument;
  if (!owner?.isConnected || typeof doc?.querySelectorAll !== 'function') return 0;
  const selector = kind.startsWith('class.') ? `.${kind.slice('class.'.length)}` : kind;
  let index = 0;

  for (const one of doc.querySelectorAll(selector)) {
    if (kind.startsWith('class.') && isCustom(one)) continue;
    if (one.id || one.getAttribute('data-sf-role')) continue;
    index += 1;
    if (one === owner) return index;
  }

  return 0;
}
/** The role path of an instance (§7.1.1). */


function instancePath(owner, {
  kind = ''
} = {}) {
  const id = isElement(owner) ? String(owner.id || '').trim() : String(owner?.id || '').trim();
  if (id) return `page/${id}`;
  const role = isElement(owner) ? String(owner.getAttribute('data-sf-role') || '').trim() : '';

  if (role) {
    const parent = parentInstance(owner);
    return parent ? `${instancePath(parent, {
      kind: parent.localName
    })}/${role}` : `page/${role}`;
  }

  const resolved = kindOf(owner, kind);
  return `${resolved}[${documentIndex(owner, resolved)}]`;
}
/** An id a template writes for one of its parts: `<path as a word>--<local name>`. */

function partId(path, local) {
  const base = String(path).replace(/\W+/gu, '-').replace(/^-+|-+$/gu, '');
  return local ? `${base}--${local}` : base;
}
/** Whether the path is final: an instance in the page, or one with an id. */

function pathIsSettled(owner) {
  return Boolean(owner?.isConnected || String(owner?.id || '').trim());
}

/***/ },

/***/ "cee052b3ccee"
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
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("cee052b3ccee");
/* harmony import */ var _js_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5383c575ac1a");
/**
* SIMAI Framework
* Copyright 2008-2026 SIMAI Ltd
* http://simai.studio
* Read the license: http://framework.simai.studio/license/
* Documentation: http://framework.simai.studio/
* Support: http://simai.studio/support/
*
* ACCORDION
*
* Entry point for importing components from this directory.
* Simplifies the import process in other parts of the project.
* Instead of importing individual files, all component can be imported through this file.
*/


})();

/******/ })()
;