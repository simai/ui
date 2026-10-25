/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "0eb897441700"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SfSmartAccordion: () => (/* binding */ SfSmartAccordion)
/* harmony export */ });
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("fbe0570fcc69");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("0f6c0abdc39e");
/* harmony import */ var _sections_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("bb3926f81811");
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("c8becad87ee8");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _js_templates_default__WEBPACK_IMPORTED_MODULE_1__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _js_templates_default__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
// sf-accordion: sections built from data -- a record's groups, a settings
// panel, an FAQ -- drawn as the class accordion (src/component/accordion), so
// its styles apply and nothing of them is forked (owner, 2026-10-25). The
// sections come from `items` (an array, or the same as JSON) or from <details>
// written inside the element; a section's markup can come from a slot.
//
// The element draws the class markup and keeps its state itself: open
// sections, single mode, the single section that is a plain section. Each
// section it draws carries data-sf-accordion-init, the class runtime's own
// mark of a section already set up, so that runtime -- loaded beside it for
// the sheet -- leaves the element's sections alone and two owners never toggle
// one section.




const HEADING_LEVELS = ['2', '3', '4', '5', '6'];
let sequence = 0;

class SfSmartAccordion extends (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()) {
  static get props() {
    return {
      templateName: {
        attribute: 'template',
        default: 'default'
      },
      items: {
        default: []
      },
      single: {
        type: Boolean,
        default: false
      },
      size: {
        default: '',
        values: _sections_mjs__WEBPACK_IMPORTED_MODULE_2__.ACCORDION_SIZES
      },
      appearance: {
        default: 'default',
        values: _sections_mjs__WEBPACK_IMPORTED_MODULE_2__.ACCORDION_APPEARANCES
      },
      marker: {
        default: 'chevron',
        values: _sections_mjs__WEBPACK_IMPORTED_MODULE_2__.ACCORDION_MARKERS
      },
      // One section is a plain section (simai/ui-source#19, #29); `toggle`
      // keeps it a disclosure -- a list that fills in later.
      singleSection: {
        attribute: 'single-section',
        default: 'static',
        values: ['static', 'toggle']
      },
      headingLevel: {
        attribute: 'heading-level',
        default: '3',
        values: HEADING_LEVELS
      },
      rootClass: {
        default: ''
      }
    };
  }

  constructor() {
    super();
    this._id = `sf-smart-accordion-${++sequence}`; // undefined: follow the attribute. Set by the property; an attribute
    // written later takes over again.

    this._items = undefined; // What the person or the host opened and closed, by section id, over the
    // open flag each section carries.

    this._openState = new Map();
    this._childSections = []; // A value set as a property before the element was defined -- a lit
    // `.items` binding on a tag the loader had not upgraded yet -- is an own
    // property that would hide the accessor; it is taken through it.

    if (Object.prototype.hasOwnProperty.call(this, 'items')) {
      const early = this.items;
      delete this.items;
      this._items = (0,_sections_mjs__WEBPACK_IMPORTED_MODULE_2__.normaliseSections)(early);
    }

    this.addEventListener('click', this.onClick);
    this.addEventListener('keydown', this.onKeydown);
  }

  attributeChangedCallback(name, previous, next) {
    if (name === 'items' && previous !== next) this._items = undefined;
    super.attributeChangedCallback(name, previous, next);
  } // The <details> written inside the element are sections too: the summary
  // is the title, everything else the content, which stays the same live
  // nodes. Read once, as slots are, and taken out of the light DOM.


  captureSlotTemplates() {
    const first = !this._slotTemplatesCaptured;
    super.captureSlotTemplates();
    if (!first) return;
    Array.from(this.children).filter(child => child.localName === 'details').forEach((details, index) => {
      const summary = details.querySelector(':scope > summary');
      const section = (0,_sections_mjs__WEBPACK_IMPORTED_MODULE_2__.normaliseSection)({
        id: details.dataset.id || details.id,
        title: summary?.textContent.replace(/\s+/gu, ' ').trim() || '',
        open: details.open,
        disabled: details.hasAttribute('data-disabled'),
        icon: details.dataset.icon,
        badge: details.dataset.badge
      }, index);
      section.slot = `${this._id}-child-${index}`;
      const nodes = Array.from(details.childNodes).filter(node => node !== summary);
      if (nodes.length) this._liveSlotNodes.set(section.slot, nodes);

      this._childSections.push(section);

      details.remove();
    });
  } // The sections, from the property or the attribute, else from the markup.


  get items() {
    if (this._items !== undefined) return this._items;
    return (0,_sections_mjs__WEBPACK_IMPORTED_MODULE_2__.normaliseSections)(this.getAttribute('items'));
  }

  set items(next) {
    this._items = (0,_sections_mjs__WEBPACK_IMPORTED_MODULE_2__.normaliseSections)(next);
    this.requestComponentUpdate('items');
  }

  get sections() {
    const items = this.items;
    return items.length ? items : this._childSections;
  }

  get single() {
    return this.getBooleanAttr('single', false);
  }

  get size() {
    return this.getProp('size');
  }

  get appearance() {
    return this.getProp('appearance');
  }

  get marker() {
    return this.getProp('marker');
  }

  get headingLevel() {
    return this.getProp('headingLevel');
  } // The one section that stands alone is a plain section: no toggle.


  get isStatic() {
    return this.sections.length === 1 && this.getProp('singleSection') !== 'toggle';
  } // The ids of the open sections, in order. A single section is always open.


  get openIds() {
    const sections = this.sections;
    if (this.isStatic) return sections.map(section => section.id);
    return [...(0,_sections_mjs__WEBPACK_IMPORTED_MODULE_2__.openSections)(sections, this._openState, this.single)];
  }

  isOpen(id) {
    return this.openIds.includes(String(id));
  }

  section(id) {
    return this.sections.find(section => section.id === String(id)) || null;
  }

  open(id) {
    return this.setOpen(id, true, 'method');
  }

  close(id) {
    return this.setOpen(id, false, 'method');
  }

  toggle(id) {
    return this.setOpen(id, !this.isOpen(id), 'method');
  } // Opens or closes one section. In single mode opening one closes the one
  // that was open, and each change is reported, as a native <details name>
  // group reports the one it closes. A disabled section, a section that is
  // already so, and the single section do nothing. Returns whether anything
  // changed.


  setOpen(id, open, source = 'method') {
    const section = this.section(id);
    if (!section || this.isStatic) return false;
    if (section.disabled && source === 'user') return false;
    const before = new Set(this.openIds);
    if (before.has(section.id) === Boolean(open)) return false;

    if (open && this.single) {
      for (const other of before) this._openState.set(other, false);
    }

    this._openState.set(section.id, Boolean(open));

    const after = new Set(this.openIds);
    this.requestComponentUpdate('open');
    const changed = this.sections.filter(one => before.has(one.id) !== after.has(one.id)); // The section asked for first, then the one single mode closed.

    changed.sort((a, b) => a.id === section.id ? -1 : b.id === section.id ? 1 : 0);

    for (const one of changed) {
      this.dispatchEvent(new CustomEvent('sf-accordion:toggle', {
        bubbles: true,
        composed: true,
        detail: {
          id: one.id,
          open: after.has(one.id),
          source,
          section: one
        }
      }));
    }

    return true;
  } // The header buttons of this element, not of an accordion nested inside it.


  triggers() {
    return Array.from(this.querySelectorAll('.sf-accordion-trigger[data-sf-accordion-section]')).filter(trigger => trigger.closest('sf-accordion') === this && trigger.localName === 'button');
  }

  ownTrigger(target) {
    const trigger = target?.closest?.('button.sf-accordion-trigger[data-sf-accordion-section]');
    return trigger && trigger.closest('sf-accordion') === this ? trigger : null;
  }

  focusDelegate() {
    return this.triggers().find(trigger => !trigger.disabled) || null;
  }

  onClick = event => {
    const trigger = this.ownTrigger(event.target);
    if (!trigger || trigger.disabled) return;
    const id = trigger.dataset.sfAccordionSection;
    this.setOpen(id, !this.isOpen(id), 'user');
  }; // Enter and Space are the button's own. The arrows walk the headers, Home
  // and End go to the first and the last (WAI-ARIA accordion pattern); a
  // disabled header is passed over, as it takes no focus.

  onKeydown = event => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
    const trigger = this.ownTrigger(event.target);
    if (!trigger || event.target !== trigger) return;
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
    const triggers = this.triggers().filter(one => !one.disabled);
    if (!triggers.length) return;
    const at = triggers.indexOf(trigger);
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? triggers.length - 1 : (at + (event.key === 'ArrowDown' ? 1 : -1) + triggers.length) % triggers.length;
    event.preventDefault();
    triggers[next].focus();
  };

  templateContext() {
    const props = this.getPropsContext();
    const sections = this.sections;
    const open = new Set(this.openIds);
    return this.createTemplateContext({ ...props,
      component: this,
      id: this._id,
      sections,
      open,
      single: this.single,
      isStatic: this.isStatic,
      size: this.size,
      appearance: this.appearance,
      marker: this.marker,
      headingLevel: this.headingLevel,
      rootClass: this.getRootClass()
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_1__.renderAccordionTemplate)(this.templateContext());
  }

}

SfSmartAccordion.define('sf-accordion');

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "0f6c0abdc39e"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderAccordionTemplate: () => (/* binding */ renderAccordionTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ddf1cdb42ecc");
/* harmony import */ var lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("0d9131aa10ba");
/* harmony import */ var _sections_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("bb3926f81811");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__);




function joinClasses(...tokens) {
  return tokens.flat().filter(Boolean).join(' ');
} // The class accordion's own classes: the size on the ladder, the appearance,
// the marker, and the states its runtime writes (active, static).


function sectionClasses(context, section, open) {
  return joinClasses('sf-accordion', context.size ? `sf-accordion--size-${context.size}` : '', context.appearance && context.appearance !== 'default' ? `sf-accordion--${context.appearance}` : '', context.marker === 'plus-minus' ? 'sf-accordion--plus-minus' : '', context.isStatic ? 'sf-accordion--static' : '', section.disabled && !context.isStatic ? 'sf-accordion--disabled' : '', open ? 'active' : '');
} // The content: the host's markup from the slot the section names, else its
// text. Text is never parsed as markup.


function renderContent(context, section) {
  const {
    component
  } = context;
  if (section.slot && component?.hasSlotContent?.(section.slot)) return component.getSlotContent(section.slot);
  return section.content || lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
} // What stands in the header: an icon before the title, the title, a badge
// after it, then the class accordion's marker.


function renderHeaderContent(context, section, open) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    ${section.icon ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class="sf-icon sf-accordion-lead" aria-hidden="true">${section.icon}</i>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    <span class="sf-accordion-title">${section.title}</span>
    ${section.badge ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-badge class="sf-accordion-badge" size=${_sections_mjs__WEBPACK_IMPORTED_MODULE_2__.BADGE_SIZE[context.size] || '1/3'} text=${section.badge}></sf-badge>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    ${context.isStatic ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class="sf-icon" aria-hidden="true">${(0,_sections_mjs__WEBPACK_IMPORTED_MODULE_2__.markerGlyph)(context.marker, open)}</i>`}
  `;
}

function renderSection(context, section, index) {
  const open = context.open.has(section.id);
  const triggerId = `${context.id}-trigger-${index}`;
  const panelId = `${context.id}-panel-${index}`; // A landmark for each panel only while there are few of them.

  const region = context.sections.length <= _sections_mjs__WEBPACK_IMPORTED_MODULE_2__.REGION_LIMIT; // The single section is a plain section, as the class runtime draws it: a
  // plain element holding the title in the button's place, the content shown.

  const header = context.isStatic ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-accordion-trigger" id=${triggerId} data-sf-accordion-static>${renderHeaderContent(context, section, true)}</span>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<button class="sf-accordion-trigger" type="button" id=${triggerId}
                   data-sf-accordion-section=${section.id}
                   aria-expanded=${open ? 'true' : 'false'} aria-controls=${panelId}
                   ?disabled=${section.disabled}>${renderHeaderContent(context, section, open)}</button>`;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <article class=${sectionClasses(context, section, open)} data-sf-accordion-init="1" data-sf-accordion-id=${section.id}>
      <div class="sf-accordion-heading" role="heading" aria-level=${context.headingLevel}>${header}</div>
      <div class="sf-accordion-content" id=${panelId}
           role=${region ? 'region' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing} aria-labelledby=${region ? triggerId : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
           ?hidden=${!open}>${renderContent(context, section)}</div>
    </article>
  `;
} // The sections stand in a column as wide as the element: a flex column, not a
// grid, whose auto track would widen to a long word and push the page
// sideways. Filled and outlined sections stand apart, flush ones meet.


function renderAccordionTemplate(context) {
  const flush = context.appearance === 'flush';
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div class=${joinClasses('sf-accordion-group', 'sf-smart-accordion', 'flex', 'flex-col', flush ? '' : 'gap-2', context.rootClass)}
         style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
         data-mode=${context.single ? 'single' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
         data-single-section=${context.isStatic ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : context.sections.length === 1 ? 'toggle' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
      ${(0,lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__.repeat)(context.sections, section => section.id, (section, index) => renderSection(context, section, index))}
    </div>
  `;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "c8becad87ee8"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "0d9131aa10ba"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit/directives/repeat.js") : new Promise((resolve) => globalThis.addEventListener("sf-runtime-ready", () => resolve(globalThis.SF.runtimeModule("lit/directives/repeat.js")), { once: true })));

/***/ },

/***/ "ddf1cdb42ecc"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit") : new Promise((resolve) => globalThis.addEventListener("sf-runtime-ready", () => resolve(globalThis.SF.runtimeModule("lit")), { once: true })));

/***/ },

/***/ "fbe0570fcc69"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("smart-base") : new Promise((resolve) => globalThis.addEventListener("sf-runtime-ready", () => resolve(globalThis.SF.runtimeModule("smart-base")), { once: true })));

/***/ },

/***/ "bb3926f81811"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ACCORDION_APPEARANCES: () => (/* binding */ ACCORDION_APPEARANCES),
/* harmony export */   ACCORDION_MARKERS: () => (/* binding */ ACCORDION_MARKERS),
/* harmony export */   ACCORDION_SIZES: () => (/* binding */ ACCORDION_SIZES),
/* harmony export */   BADGE_SIZE: () => (/* binding */ BADGE_SIZE),
/* harmony export */   REGION_LIMIT: () => (/* binding */ REGION_LIMIT),
/* harmony export */   markerGlyph: () => (/* binding */ markerGlyph),
/* harmony export */   normaliseSection: () => (/* binding */ normaliseSection),
/* harmony export */   normaliseSections: () => (/* binding */ normaliseSections),
/* harmony export */   openSections: () => (/* binding */ openSections)
/* harmony export */ });
// The parts of sf-accordion that are about data, not the page: the shape a
// section takes, from the items a host gives or from a <details> written in
// the markup, and which sections are open. Kept apart from the element so the
// contract tests can run them in Node, as sf-image-field's value.mjs is.

// The sizes of the class accordion's control ladder; '' keeps its roomy
// default header, the look of a content page.
const ACCORDION_SIZES = Object.freeze(['', '1/3', '1/2', '1', '2', '3']);
// The class accordion's appearances: a filled surface, a hairline border, or
// no fill and no radius with a line between sections.
const ACCORDION_APPEARANCES = Object.freeze(['default', 'outline', 'flush']);
// What marks a section open or closed: the class accordion's chevron, or its
// plus and minus.
const ACCORDION_MARKERS = Object.freeze(['chevron', 'plus-minus']);
// More open panels than this, and a landmark for each would crowd the page
// (WAI-ARIA accordion pattern): the panels stop being regions.
const REGION_LIMIT = 6;

const text = (value) => (value === null || value === undefined ? '' : String(value));

// An id a section can be named by in open(id), in the events and in an
// element id: the host's own, or its place.
function sectionId(raw, index) {
  const id = text(raw).trim();
  return id || `section-${index + 1}`;
}

// One section, as the element draws it. `content` is text, never markup: the
// host's markup goes in a slot (`slot` names it), so nothing a record holds
// is parsed as HTML.
function normaliseSection(item, index = 0) {
  if (typeof item === 'string') item = {title: item};
  if (!item || typeof item !== 'object' || Array.isArray(item)) return null;
  return {
    id: sectionId(item.id ?? item.key, index),
    title: text(item.title ?? item.label ?? item.text),
    content: text(item.content),
    slot: text(item.slot).trim(),
    open: Boolean(item.open),
    disabled: Boolean(item.disabled),
    icon: text(item.icon).trim(),
    badge: text(item.badge).trim(),
  };
}

// The sections from what a host gave: an array, or the same array as JSON in
// the `items` attribute. A section whose id repeats an earlier one is left
// out, as one id must name one section.
function normaliseSections(items) {
  let list = items;
  if (typeof list === 'string') {
    const raw = list.trim();
    if (!raw) return [];
    try {
      list = JSON.parse(raw);
    } catch {
      return [];
    }
  }
  if (!Array.isArray(list)) return [];
  const seen = new Set();
  const sections = [];
  list.forEach((item, index) => {
    const section = normaliseSection(item, index);
    if (!section || seen.has(section.id)) return;
    seen.add(section.id);
    sections.push(section);
  });
  return sections;
}

// Which sections are open: what the person or the host set, else what the
// section says. In single mode only the first of them stays open.
function openSections(sections, overrides = new Map(), single = false) {
  const open = new Set();
  for (const section of sections) {
    const state = overrides.has(section.id) ? overrides.get(section.id) : section.open;
    if (!state) continue;
    if (single && open.size) break;
    open.add(section.id);
  }
  return open;
}

// The chevron's glyph, or plus and minus: the words the class accordion's
// runtime writes.
function markerGlyph(marker, open) {
  if (marker === 'plus-minus') return open ? 'remove' : 'add';
  return 'chevron_right';
}

// The badge is a size the header carries: 1/3 up to a size 1 header, then one
// rung below the header (sf-badge has 1/3, 1/2 and 1).
const BADGE_SIZE = Object.freeze({'': '1/3', '1/3': '1/3', '1/2': '1/3', 1: '1/3', 2: '1/2', 3: '1'});


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
/******/ 	let __webpack_exports__ = __webpack_require__("0eb897441700");
/******/
/******/ })()
;