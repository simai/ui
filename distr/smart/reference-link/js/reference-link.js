/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "e6d86f2cd058"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FIELD_LADDER: () => (/* binding */ FIELD_LADDER),
/* harmony export */   FIELD_SIZES: () => (/* binding */ FIELD_SIZES),
/* harmony export */   FIELD_WIDTHS: () => (/* binding */ FIELD_WIDTHS),
/* harmony export */   INPUT_SIZES: () => (/* binding */ INPUT_SIZES),
/* harmony export */   RETIRED_FIELD_SIZES: () => (/* binding */ RETIRED_FIELD_SIZES),
/* harmony export */   fieldSize: () => (/* binding */ fieldSize),
/* harmony export */   fieldWidth: () => (/* binding */ fieldWidth),
/* harmony export */   fieldWidthClass: () => (/* binding */ fieldWidthClass),
/* harmony export */   inputSize: () => (/* binding */ inputSize),
/* harmony export */   ladderSize: () => (/* binding */ ladderSize),
/* harmony export */   nearestFieldSize: () => (/* binding */ nearestFieldSize),
/* harmony export */   retireFieldSizeClass: () => (/* binding */ retireFieldSizeClass)
/* harmony export */ });
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d3818183b14c");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_0__);
// Form fields come in three sizes. 1/3 and 3 were retired: no consumer used
// them, and they could not hold a field's own pictures, tags and targets. A
// page written for a retired size keeps rendering at the nearest kept size, and
// says so once in the console so the markup can be updated.
//
// The fields of the field ladder below are the exception: they stand on all
// five steps, as sf-input does.

const FIELD_SIZES = Object.freeze(['1/2', '1', '2']);
const RETIRED_FIELD_SIZES = Object.freeze({
  '1/3': '1/2',
  '3': '2'
});
const warned = new Set(); // A control placed inside something with the whole scale (a list item, say)
// takes the nearest form size, quietly: the list is not wrong to be 1/3.

function nearestFieldSize(value) {
  const size = String(value ?? '').trim().toLowerCase();
  if (FIELD_SIZES.includes(size)) return size;
  return Object.hasOwn(RETIRED_FIELD_SIZES, size) ? RETIRED_FIELD_SIZES[size] : '1';
}
function fieldSize(value, component = 'field', fallback = '1') {
  const size = String(value ?? '').trim().toLowerCase();
  if (FIELD_SIZES.includes(size)) return size;

  if (Object.hasOwn(RETIRED_FIELD_SIZES, size)) {
    const kept = RETIRED_FIELD_SIZES[size];
    (0,_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_0__.noteDeprecated)({
      component,
      kind: 'value',
      attribute: 'size',
      from: size,
      to: kept
    });
    const key = `${component}:${size}`;

    if (!warned.has(key) && typeof console !== 'undefined') {
      warned.add(key);
      console.warn(`[SIMAI Framework] ${component}: size ${size} is retired for form fields; rendering size ${kept}.`);
    }

    return kept;
  }

  return fallback;
} // The field ladder (fields ladder, 2026-11-14): one height per step for every
// field that stands on it, the control ladder sf-button and sf-button-icon
// stand on (--sf-ui-<size>--control-height: 28 / 32 / 40 / 48 / 56 on a
// desktop). A text field kept the outer steps first (actions block item 4,
// 2026-11-08: a toolbar search or a hero search stands beside buttons of 1/3
// and 3); sf-input-lookup, -quantity, -date, -code, -color and -country drew
// 32 / 48 or 40 at 1/3 and 3 beside it, so they take the same five steps and
// the stylesheets size their parts from the same steps
// (component/inputs/scss/_field-ladder.scss). The textarea and the rich text
// followed (2026-11-14), then the dropdown, the file upload area and the image
// field (queue #70, 2026-11-16): every field of the family stands on the
// ladder. FIELD_SIZES, fieldSize and retireFieldSizeClass stay for the lines
// of tags, badges and avatars and for a file's row, which keep three sizes.

const FIELD_LADDER = Object.freeze(['1/3', ...FIELD_SIZES, '3']);
const INPUT_SIZES = FIELD_LADDER;
/** A size on the field ladder: one of the five steps, else the fallback. */

function ladderSize(value, fallback = '1') {
  const size = String(value ?? '').trim().toLowerCase();
  return FIELD_LADDER.includes(size) ? size : fallback;
}
function inputSize(value, fallback = '1') {
  return ladderSize(value, fallback);
} // Markup written by hand carries its size as a class, so the binder moves a
// retired size class to the kept one before anything measures the field.

function retireFieldSizeClass(root, block) {
  if (!root?.classList) return;

  for (const [retired, kept] of Object.entries(RETIRED_FIELD_SIZES)) {
    const name = `${block}--size-${retired}`;
    if (!root.classList.contains(name)) continue;
    root.classList.replace(name, `${block}--size-${fieldSize(retired, block)}`);
  }
} // How wide a field is (owner decision C396, WM-4): the value it is made for,
// in characters of the width ladder, read from the field's width setting --
// short (20: a date, a number, a code), medium (28: a name, a phone) and long
// (44: a path, an e-mail, an address); the roles --sf-field--width-short,
// -medium and -long stand on the steps --sf-measure-20, -28 and -44 (core
// figma_measure.scss) and follow the text size, the density and the phone.
// It is the field's widest: in a narrower container the field is the
// container's width, as without it. Empty or any other value: the whole
// width, as every field drew before. The class is core's
// (core/scss/_sf_css__field_width.scss), so a field whose own sheet has not
// come yet already stands at its width.

const FIELD_WIDTHS = Object.freeze(['short', 'medium', 'long']);
/** A field width: short, medium or long, else '' (the whole width). */

function fieldWidth(value) {
  const width = String(value ?? '').trim().toLowerCase();
  return FIELD_WIDTHS.includes(width) ? width : '';
}
/** The root class of a field width, or '' for the whole width. */

function fieldWidthClass(value) {
  const width = fieldWidth(value);
  return width ? `sf-field--width-${width}` : '';
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "b15eca80760b"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _component_field_size__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("e6d86f2cd058");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("fe7168bbc2ad");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("02ab397b5f7e");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("468c96d6446a");
/* harmony import */ var _lang_index_mjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("2efb33eae70b");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _component_field_size__WEBPACK_IMPORTED_MODULE_2__, _js_templates_default__WEBPACK_IMPORTED_MODULE_3__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _component_field_size__WEBPACK_IMPORTED_MODULE_2__, _js_templates_default__WEBPACK_IMPORTED_MODULE_3__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);






 // Only the words on screen ship in the bundle, English only (owner decision
// C282): Russian and every other language come from a language file. The
// title, settings and events stay in the language files for the Studio and the
// docs (localization study LC-2).
// sf-reference-link from its component.json (standard simai.smart-component
// 1.3.8 §3, §4): the settings are the attributes and properties
// core/js/element-manifest.js makes from the manifest. size and line keep
// their getters (a form size mapped onto the field ladder), icon its own
// (absent is the arrow, empty is none).

const ReferenceLinkElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_4__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: _lang_index_mjs__WEBPACK_IMPORTED_MODULE_6__.files,
  source: 'ru',
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_5__
});

class SfReferenceLink extends ReferenceLinkElement {
  get templateName() {
    return this.getAttribute('template') || 'default';
  } // Without a size the reference keeps its card spacing; with one it is a
  // control of that form size.


  get size() {
    const size = this.getAttribute('size') || '';
    return size ? (0,_component_field_size__WEBPACK_IMPORTED_MODULE_2__.fieldSize)(size, 'sf-reference-link') : '';
  }

  set size(value) {
    super.size = value;
  } // On a text line the reference is a link on the line rather than a card.


  get line() {
    const line = this.getAttribute('line') || '';
    return line ? (0,_component_field_size__WEBPACK_IMPORTED_MODULE_2__.fieldSize)(line, 'sf-reference-link line') : '';
  }

  set line(value) {
    super.line = value;
  } // An absent attribute is the default icon; an empty one is no icon at all.
  // Read as `|| default` the two were the same answer, so a reference drawn
  // beside its own label could not drop the arrow it does not need.
  // An absent icon is the arrow in a card, a size or on a line; a reference
  // in text (appearance inline) has no arrow unless one is named -- a link
  // in a sentence is told by its colour and line, the icon there says the
  // record's type (C147 (1), (2)).


  get icon() {
    const icon = this.getAttribute('icon');
    if (icon === null) return this.getAttribute('appearance') === 'inline' ? '' : 'arrow_forward';
    return icon;
  }

  set icon(value) {
    super.icon = value;
  } // What the copy button copies (C147 (8)): the address in full, as the
  // browser's own «copy link address» gives it, not the href as written.


  get copyValue() {
    const href = this.getAttribute('href') || '';
    if (!href) return '';

    try {
      return new URL(href, this.ownerDocument?.baseURI || globalThis.location?.href).href;
    } catch {
      return href;
    }
  }

  templateContext() {
    const props = this.getPropsContext();
    return this.createTemplateContext({ ...props,
      component: this,
      size: this.size,
      line: this.line,
      icon: this.icon,
      appearance: this.appearance,
      state: this.state,
      copy: this.copy,
      copyValue: this.copyValue,
      words: {
        // Said after the name (C147 (4)), as sf-file-download says it (C25).
        newTab: this.sfWord('new-tab-text'),
        copy: this.sfWord('copy-label'),
        missing: this.sfWord('missing-text'),
        forbidden: this.sfWord('forbidden-text')
      },
      ariaLabel: this.getAttribute('aria-label') || '',
      rootClass: this.getRootClass()
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_3__.renderReferenceLinkTemplate)(this.templateContext());
  } // A card is in a place of its own (C181 (2), dispatcher decision
  // 2026-11-15): its host draws a block, the container sf-reference-link its
  // card stacks in by the place's width (the component sheet). Every other
  // form -- in text, plain, a size, a line -- is a run or a control in a row
  // or a cell: its host stays display: contents, as every Smart host. What
  // the page set inline that a child inherits stays on the host before it.


  get isCard() {
    const appearance = this.appearance || 'card';
    return appearance !== 'inline' && appearance !== 'plain' && !this.size && !this.line;
  }

  applyHostDisplayStyle() {
    const next = [this.hostInheritedStyle(), `display: ${this.isCard ? 'block' : 'contents'};`].filter(Boolean).join(' ');
    return this.writeHostStyle(next);
  }

  afterRender(callback) {
    if (typeof callback === 'function') return super.afterRender(callback); // appearance, size or line may have changed the form since connect;
    // the host's style is written only when it differs.

    this.applyHostDisplayStyle();
    this.markCutName();
    this.observeRoom();
    return undefined;
  }

  disconnectedCallback() {
    this._roomObserver?.disconnect();
    this._roomObserver = null;
    this._roomRoot = null;
    super.disconnectedCallback();
  } // A long name (C147 (9)): a card shows two lines, a sized reference or one
  // on a line (a table cell, a field) one; past that an ellipsis. A name cut
  // that way has its whole text in the Framework tooltip on hover and
  // keyboard focus (as the breadcrumbs, C93 (6)), through the tooltip
  // component's controller (data-tooltip). Text that wraps in a sentence is
  // never cut, so an inline reference has none.


  markCutName() {
    const root = this.querySelector(':scope > .sf-reference-link');
    const link = root && !root.classList.contains('sf-reference-link--inline') ? root.querySelector('a.sf-reference-link__link') : null;
    const label = link?.querySelector('.sf-reference-link__label');
    const cut = Boolean(link && label) && (link.scrollWidth > link.clientWidth + 1 || link.scrollHeight > link.clientHeight + 1);
    let surface = this._cutTooltip;

    if (!cut) {
      if (surface) {
        if (this._cutLink?.getAttribute('data-tooltip') === surface.id) this._cutLink.removeAttribute('data-tooltip');
        surface.remove();
        this._cutTooltip = null;
        this._cutLink = null;
      }

      return;
    }

    const doc = this.ownerDocument;
    const words = label.textContent.replace(/\s+/gu, ' ').trim();

    if (!surface) {
      // The Framework's plain tooltip in class markup, as the clipboard
      // component writes it for an icon button's name.
      surface = doc.createElement('span');
      surface.className = 'sf-tooltip sf-tooltip--dark sf-tooltip--size-1/3 sf-reference-link__name-tooltip flex';
      surface.hidden = true;
      const content = doc.createElement('span'); // A name is long by definition: the plate is a block (the utility
      // hint of the tooltip sheet), so a second line keeps its fill.

      content.className = 'sf-tooltip-content flex flex-col items-start';
      const text = doc.createElement('span');
      text.className = 'sf-tooltip-text';
      content.append(text);
      surface.append(content);
      const base = `${this.id ? `page/${this.id}` : 'sf-reference-link'}/name`;
      let id = base.replace(/[^\w:./-]/gu, '-');

      for (let index = 2; doc.getElementById(id); index++) id = `${base}-${index}`;

      surface.id = id;
      this._cutTooltip = surface;
    }

    surface.querySelector('.sf-tooltip-text').textContent = words;
    if (!surface.isConnected) this.append(surface);
    if (this._cutLink && this._cutLink !== link) this._cutLink.removeAttribute('data-tooltip');
    this._cutLink = link;
    if (link.getAttribute('data-tooltip') !== surface.id) link.setAttribute('data-tooltip', surface.id);
  } // The host is display: contents, so the box watched is the root it draws.


  observeRoom() {
    const root = this.querySelector(':scope > .sf-reference-link');
    if (typeof ResizeObserver === 'undefined' || !root || root === this._roomRoot) return;
    this._roomObserver?.disconnect();
    this._roomRoot = root;
    this._roomObserver = new ResizeObserver(() => {
      if (this._roomFrame) return;
      this._roomFrame = requestAnimationFrame(() => {
        this._roomFrame = 0;
        this.markCutName();
      });
    });

    this._roomObserver.observe(root);
  }

  handleRootClick = event => {
    if (!this.disabled) {
      this.followFromRoute(event);
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    if (typeof event.stopImmediatePropagation === 'function') {
      event.stopImmediatePropagation();
    }
  }; // The route stands above the link's overlay so it can be selected (RL-11).
  // A press on it still follows the link, unless the reader has just selected
  // text: then the press was a selection, not a choice.

  followFromRoute(event) {
    const route = event.target?.closest?.('.sf-reference-link__meta');
    const link = route?.closest('.sf-reference-link')?.querySelector('.sf-reference-link__link');

    if (!route || !link || event.defaultPrevented) {
      return;
    }

    const selection = globalThis.getSelection?.();

    if (selection && !selection.isCollapsed && String(selection).trim()) {
      return;
    } // One click reaches the page: the link's, as if the press had been on it.


    event.preventDefault();
    event.stopPropagation();
    link.dispatchEvent(new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      composed: true,
      view: globalThis,
      button: event.button,
      ctrlKey: event.ctrlKey,
      metaKey: event.metaKey,
      shiftKey: event.shiftKey,
      altKey: event.altKey
    }));
  }

  onClick(handler, options) {
    if (typeof handler === 'function') {
      this.addEventListener('click', handler, options);
    }

    return this;
  }

}

SfReferenceLink.define('sf-reference-link');
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "fe7168bbc2ad"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderReferenceLinkTemplate: () => (/* binding */ renderReferenceLinkTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
 // The icon a target that is gone shows in place of its own (C147 (6)): the
// broken link, whatever the reason.

const GONE_ICON = 'link_off';
function renderReferenceLinkTemplate(context) {
  const {
    component,
    appearance,
    icon,
    label,
    text,
    href,
    target,
    disabled,
    ariaLabel,
    rootClass,
    size,
    line,
    state,
    copy,
    copyValue,
    words = {}
  } = context;
  const inline = appearance === 'inline'; // A target that is gone (C147 (6)): no link, the words dimmed, the broken
  // link icon and the reason after the name. href is not followed then.

  const gone = state === 'missing' || state === 'forbidden';
  const newTab = !gone && !disabled && Boolean(href) && target === '_blank'; // The copy button is the card's (C147 (8)): a card with an address to copy.

  const copyButton = copy && !inline && !size && !line && appearance !== 'plain' && !gone && !disabled && Boolean(href);
  const rootClasses = ['sf-reference-link', inline ? 'sf-reference-link--inline' : '', !inline && size ? `sf-reference-link--size-${size}` : '', !inline && line ? `sf-reference-link--line-${line}` : '', !inline && appearance === 'plain' ? 'sf-reference-link--plain' : '', gone ? `sf-reference-link--gone sf-reference-link--${state}` : '', copyButton ? 'sf-reference-link--copy' : '', inline ? '' : 'flex', inline ? '' : 'items-cross-center', disabled ? 'disabled' : '', rootClass].filter(Boolean).join(' ');
  const labelContent = component?.hasSlotContent?.('label') ? component.getSlotContent('label') : label;
  const textContent = component?.hasSlotContent?.('text') ? component.getSlotContent('text') : text;
  const shownIcon = gone ? GONE_ICON : icon;
  const iconPart = shownIcon ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class="sf-reference-link__icon sf-icon" aria-hidden="true">${shownIcon}</i>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing; // A new tab says so (C147 (4)): the sign after the words and, for a screen
  // reader, the words in the link's name -- in the page's language, the
  // words sf-file-download says for a file opened to view (C25). The sign is
  // the Framework's one new-tab sign, arrow_outward, as sf-link and core's
  // link in text (C186 (3); content study C5, it was open_in_new).

  const tabPart = newTab ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class="sf-reference-link__tab sf-icon" aria-hidden="true">arrow_outward</i><span class="sf-reference-link__tab-words">${words.newTab}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const name = ariaLabel && newTab ? `${ariaLabel} ${words.newTab}` : ariaLabel;
  const reasonPart = gone ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-reference-link__reason">${state === 'forbidden' ? words.forbidden : words.missing}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;

  if (inline) {
    // In text (C147 (1), (2)): one inline run that wraps with the sentence --
    // the type icon, the name, the record's number in a quiet ink, the new
    // tab sign. The icon is an atomic inline, which the browser breaks after
    // even with no space between (a word joiner does not hold it): on a
    // narrow line it stood alone at the line end with the name on the next
    // (content study C6). So the icon and the name's first word stand in one
    // run that does not break, inside the label (the icon is a box, so the
    // name's underline does not run under it).
    const numberPart = textContent ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)` <span class="sf-reference-link__number">${textContent}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
    const split = shownIcon && typeof labelContent === 'string' ? labelContent.match(/^(\s*\S+)([\s\S]*)$/u) : null;
    const labelPart = split ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-reference-link__label"><span class="sf-reference-link__start">${iconPart}${split[1]}</span>${split[2]}</span>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${iconPart}<span class="sf-reference-link__label">${labelContent}</span>`;
    const body = (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${labelPart}${numberPart}${reasonPart}${tabPart}`;
    const run = href && !disabled && !gone ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<a class="sf-reference-link__link"
          href=${href}
          target=${target || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          rel=${target && target !== '_self' ? 'noopener noreferrer' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          aria-label=${name || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        >${body}</a>` : disabled ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-reference-link__link" role="link" aria-disabled="true" aria-label=${ariaLabel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>${body}</span>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-reference-link__link">${body}</span>`;
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class=${rootClasses} style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>${run}</span>`;
  }

  const linkContent = href && !disabled && !gone ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
          <a class="sf-reference-link__link"
            href=${href}
            target=${target || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            rel=${target && target !== '_self' ? 'noopener noreferrer' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            aria-label=${name || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          ><span class="sf-reference-link__label">${labelContent}</span>${tabPart}</a>
        ` : disabled ? // A disabled reference is a link the reader cannot follow: the label
  // says so as a link that is unavailable (RL-16), not as plain text.
  // No href and no tabindex, so it takes no focus and goes nowhere.
  (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span role="link" aria-disabled="true" aria-label=${ariaLabel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>${labelContent}</span>` : // No address, or a target that is gone: the name as text; the
  // reason follows it in the same run, not as a card's row item.
  (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-reference-link__label">${labelContent}${reasonPart}</span>`; // Copy the address (C147 (8)): the clipboard component's attribute route
  // (data-sf-copy, decision C48) on an icon button of the Framework's class
  // markup; its feedback, name tooltip and words are that route's.

  const copyPart = copyButton ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<button type="button"
        class="sf-reference-link__copy sf-icon-button sf-icon-button--icon sf-icon-button--ghost sf-icon-button--on-surface sf-icon-button--size-1/2 flex items-cross-center content-main-center"
        data-sf-copy=${copyValue}
        aria-label=${words.copy}
      ><i class="sf-icon" aria-hidden="true">content_copy</i></button>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div
      class=${rootClasses}
      style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      @click=${component?.handleRootClick}
    >
      <div class="sf-reference-link__main sf-reference-link-left">
        ${iconPart}
        ${linkContent}
      </div>
      <div class="sf-reference-link__meta sf-reference-link-text">${textContent}</div>
      ${copyPart}
    </div>
  `;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "d3818183b14c"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("deprecations", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("deprecations", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "5b7d7695b41b"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("element-manifest", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("element-manifest", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "2a080a730149"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("lit", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "deb1a4d61565"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("smart-base", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("smart-base", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "2efb33eae70b"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   files: () => (/* binding */ files)
/* harmony export */ });
/* harmony import */ var _en_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ab85d2329834");
// Written by scripts/build-language-packs.mjs from src/core/lang/built-in.json
// (owner decision C282); do not edit. The words this bundle carries: the
// built-in languages' (en); every other language comes from
// a language file (core/lang/<code>.js or its parts).


const files = { en: { runtime: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime } };

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ en: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime });


/***/ },

/***/ "468c96d6446a"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-reference-link for the shim (stands/18-aliases-ci/alias.mjs, standard §16 item 20). mode: same-detail (the shim sends the new and the old name), split / detail-adds (a detail adapter, refused by the shim), attribute-and-property, method, property, manifest-only (the DOM name does not change), host-attribute (no shim), retired.","component":"sf-reference-link","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"aria-label","to":null,"kind":"attribute","component":"sf-reference-link","since":"2026-10-27","remove_after":"2026-12-01","mode":"host-attribute","section":"§3.1","note":"stays a host attribute, read by the base (§3.1, §4.8); no shim"}]}');

/***/ },

/***/ "02ab397b5f7e"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.reference-link","tag":"sf-reference-link","version":"1.3.4","kind":"leaf","settings":{"appearance":{"type":"enum","values":["card","inline","plain"],"default":"card"},"copy":{"type":"boolean","default":false},"disabled":{"type":"boolean","default":false},"href":{"type":"string","default":""},"icon":{"type":"icon","optional":true,"default":"arrow_forward"},"label":{"type":"string","default":""},"line":{"type":"enum","values":["","1/2","1","2"],"default":""},"size":{"type":"enum","values":["","1/2","1","2"],"default":""},"state":{"type":"enum","values":["","missing","forbidden"],"default":""},"target":{"type":"string","default":"_self"},"text":{"type":"string","default":""}},"values":{},"events":{},"actions":{},"css-variables":{"--sf-reference-link-background-color":{"type":"color","state":"default"},"--sf-reference-link-border-color":{"type":"color","state":"default"},"--sf-reference-link-radius":{"type":"length","state":"default"},"--sf-reference-link-link-color":{"type":"color","state":"default"},"--sf-reference-link-padding-inline":{"type":"length","state":"default"},"--sf-reference-link-padding-block":{"type":"length","state":"default"},"--sf-reference-link-gap":{"type":"length","state":"default"}}}');

/***/ },

/***/ "ab85d2329834"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Reference Link","runtime":{"new-tab-text":"(opens in a new tab)","copy-label":"Copy link","missing-text":"deleted","forbidden-text":"no access"}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("b15eca80760b");
/******/
/******/ })()
;