/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "7cd0e63a3ed6"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ANCHORED_BADGE_COMPONENT: () => (/* binding */ ANCHORED_BADGE_COMPONENT),
/* harmony export */   ANCHORED_BADGE_TEXT: () => (/* binding */ ANCHORED_BADGE_TEXT),
/* harmony export */   DEFAULT_BADGE_CAP: () => (/* binding */ DEFAULT_BADGE_CAP),
/* harmony export */   anchoredBadgeState: () => (/* binding */ anchoredBadgeState),
/* harmony export */   badgeCap: () => (/* binding */ badgeCap),
/* harmony export */   badgeCount: () => (/* binding */ badgeCount),
/* harmony export */   badgeFlag: () => (/* binding */ badgeFlag),
/* harmony export */   iconBadgeStep: () => (/* binding */ iconBadgeStep),
/* harmony export */   nameWithBadge: () => (/* binding */ nameWithBadge),
/* harmony export */   pluralForm: () => (/* binding */ pluralForm)
/* harmony export */ });
/* harmony import */ var _core_js_page_language_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("0d662e4d7d63");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_page_language_js__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
_core_js_page_language_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var _core_js_page_language_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_page_language_js__WEBPACK_IMPORTED_MODULE_0__);
// What an anchored badge shows and what it says (simai/ui-source#12).
//
// A count or a dot sits on an avatar, an icon or an icon button. What it shows
// is decided here, once, for the ordinary runtime (_anchored.js, markup with
// data-count / data-dot) and for the Smart templates of sf-avatar, sf-icon and
// sf-icon-button, which import this file into their own bundles:
//
//   - a count above zero shows; 0 (or nothing, or a negative) hides the badge;
//   - a count above the cap shows as «<cap>+», 99+ by default; the cap is
//     configurable and the accessible name keeps the exact number;
//   - a dot shows when asked for and no count says otherwise;
//   - the phrase -- «3 непрочитанных», «есть новое» -- joins the anchor's
//     accessible name and is the badge's tooltip; the digits themselves are
//     hidden from assistive technology, so a number is never read on its own.
//
// Whether a count is drawn as a number or as a dot is the stylesheet's
// decision: on an anchor of 1/3 or 1/2 a count is a dot, whatever it says, and
// the number lives in the name and the tooltip alone.
 // The words, by language. A count is one phrase per plural form, separated by
// «|» in the order of CLDR's categories -- one|few|many|other in Russian,
// one|other in English -- with {count} where the number goes. A product adds a
// language with SF.language.register('sf-badge', code, {count, dot}).

const ANCHORED_BADGE_TEXT = {
  en: {
    count: '{count} unread',
    dot: 'new'
  },
  ru: {
    count: '{count} непрочитанное|{count} непрочитанных|{count} непрочитанных|{count} непрочитанного',
    dot: 'есть новое'
  }
};
const ANCHORED_BADGE_COMPONENT = 'sf-badge';
const DEFAULT_BADGE_CAP = 99;
const CATEGORIES = ['zero', 'one', 'two', 'few', 'many', 'other'];
/** A count as an integer, or null when nothing countable was given. */

function badgeCount(value) {
  if (value === null || value === undefined) return null;
  const text = String(value).trim();
  if (text === '') return null;
  const number = Number(text);
  return Number.isFinite(number) ? Math.trunc(number) : null;
}
/** The cap: a whole number of at least 1, else 99. */

function badgeCap(value) {
  const number = badgeCount(value);
  return number !== null && number >= 1 ? number : DEFAULT_BADGE_CAP;
}
/** A boolean attribute as written in markup: present, '', 'true' -- not 'false'. */

function badgeFlag(value) {
  if (value === true) return true;
  if (value === false || value === null || value === undefined) return false;
  return String(value).trim().toLowerCase() !== 'false';
}
/**
 * The form of `forms` ("a|b|c") for `count` in `locale`. One form is used for
 * every number; with several, the n-th form answers the n-th plural category
 * the language has, and a category past the last form takes the last one.
 */

function pluralForm(forms, count, locale = 'en') {
  const list = String(forms ?? '').split('|');
  if (list.length === 1) return list[0];

  try {
    const rules = new Intl.PluralRules(locale);
    const has = new Set(rules.resolvedOptions().pluralCategories);
    const categories = CATEGORIES.filter(category => has.has(category));
    const index = categories.indexOf(rules.select(count));
    return list[Math.min(Math.max(index, 0), list.length - 1)];
  } catch {
    return list[list.length - 1];
  }
}

function formatNumber(count, locale) {
  try {
    return new Intl.NumberFormat(locale).format(count);
  } catch {
    return String(count);
  }
}
/**
 * The state of one anchored badge.
 *
 * `count`, `dot`, `cap` and `label` are what the author wrote; `node` is where
 * the badge is, for the page language. `label` replaces the default phrase: for
 * a dot it is the whole text equivalent («есть новое»), for a count it is the
 * phrase in the same «|»-separated plural forms, with {count} where the number
 * goes (a label without {count} is read after the number).
 *
 * Returns {visible, dot, text, phrase, count}: `text` is what the badge draws
 * (empty for a dot), `phrase` what joins the accessible name and the tooltip.
 */


function anchoredBadgeState({
  count,
  dot,
  cap,
  label
} = {}, node = null) {
  const number = badgeCount(count);
  const isDot = badgeFlag(dot);
  const locale = (0,_core_js_page_language_js__WEBPACK_IMPORTED_MODULE_0__.pageLocale)(node);
  const custom = String(label ?? '').trim();

  if (number !== null) {
    if (number <= 0) {
      return {
        visible: false,
        dot: isDot,
        text: '',
        phrase: '',
        count: number
      };
    }

    const limit = badgeCap(cap);
    const forms = custom || (0,_core_js_page_language_js__WEBPACK_IMPORTED_MODULE_0__.pageText)(ANCHORED_BADGE_TEXT, 'count', node, ANCHORED_BADGE_COMPONENT);
    const form = pluralForm(forms, number, locale);
    const formatted = formatNumber(number, locale);
    const phrase = form.includes('{count}') ? form.replaceAll('{count}', formatted) : `${formatted} ${form}`.trim();
    return {
      visible: true,
      dot: isDot,
      text: isDot ? '' : number > limit ? `${limit}+` : String(number),
      phrase,
      count: number
    };
  }

  if (isDot) {
    return {
      visible: true,
      dot: true,
      text: '',
      phrase: custom || (0,_core_js_page_language_js__WEBPACK_IMPORTED_MODULE_0__.pageText)(ANCHORED_BADGE_TEXT, 'dot', node, ANCHORED_BADGE_COMPONENT),
      count: null
    };
  }

  return {
    visible: false,
    dot: false,
    text: '',
    phrase: '',
    count: null
  };
}
/** A name with the badge's phrase after it: «Анна Белова, 3 непрочитанных». */

function nameWithBadge(name, phrase) {
  const base = String(name ?? '').trim();
  const extra = String(phrase ?? '').trim();
  if (!extra) return base;
  return base ? `${base}, ${extra}` : extra;
} // The ladder step of a Smart sf-icon's anchor, from its icon size: the icon
// scale is not the control ladder. An icon of the scale's step 3 (the default,
// the 24-unit glyph) carries the small count, as a Material icon does; the
// smaller glyphs of rows and lines carry a dot; the large ones the larger counts.

const ICON_SIZE_STEP = {
  '1/4': '1/3',
  '1/3': '1/3',
  '1/2': '1/3',
  1: '1/3',
  2: '1/2',
  3: '1',
  4: '2',
  5: '2',
  6: '3',
  7: '3'
};
function iconBadgeStep(size) {
  return ICON_SIZE_STEP[String(size ?? '').trim()] || '1';
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "e6d86f2cd058"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FIELD_SIZES: () => (/* binding */ FIELD_SIZES),
/* harmony export */   RETIRED_FIELD_SIZES: () => (/* binding */ RETIRED_FIELD_SIZES),
/* harmony export */   fieldSize: () => (/* binding */ fieldSize),
/* harmony export */   nearestFieldSize: () => (/* binding */ nearestFieldSize),
/* harmony export */   retireFieldSizeClass: () => (/* binding */ retireFieldSizeClass)
/* harmony export */ });
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("06e8cd089f28");
// Form fields come in three sizes. 1/3 and 3 were retired: no consumer used
// them, and they could not hold a field's own pictures, tags and targets. A
// page written for a retired size keeps rendering at the nearest kept size, and
// says so once in the console so the markup can be updated.

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
} // Markup written by hand carries its size as a class, so the binder moves a
// retired size class to the kept one before anything measures the field.

function retireFieldSizeClass(root, block) {
  if (!root?.classList) return;

  for (const [retired, kept] of Object.entries(RETIRED_FIELD_SIZES)) {
    const name = `${block}--size-${retired}`;
    if (!root.classList.contains(name)) continue;
    root.classList.replace(name, `${block}--size-${fieldSize(retired, block)}`);
  }
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

/***/ "f92e47b164fa"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("fbe0570fcc69");
/* harmony import */ var _component_field_size__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("e6d86f2cd058");
/* harmony import */ var _js_templates_card__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("c0c2069e1237");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("602783801435");
/* harmony import */ var _js_templates_label__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("63cd440fc8e3");
/* harmony import */ var _helpers_text__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("cbce4a5232a6");
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("0d662e4d7d63");
/* harmony import */ var _helpers_anchored_badge__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("34addf781b5b");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _js_templates_card__WEBPACK_IMPORTED_MODULE_2__, _js_templates_default__WEBPACK_IMPORTED_MODULE_3__, _js_templates_label__WEBPACK_IMPORTED_MODULE_4__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_6__, _helpers_anchored_badge__WEBPACK_IMPORTED_MODULE_7__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _js_templates_card__WEBPACK_IMPORTED_MODULE_2__, _js_templates_default__WEBPACK_IMPORTED_MODULE_3__, _js_templates_label__WEBPACK_IMPORTED_MODULE_4__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_6__, _helpers_anchored_badge__WEBPACK_IMPORTED_MODULE_7__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_core_js_page_language__WEBPACK_IMPORTED_MODULE_6__);







 // Every word this component says, in the languages it ships with. A product
// adds any other through SF.language.register("sf-avatar", code, words).

const AVATAR_TEXT = {
  en: {
    ariaLabel: 'Avatar'
  },
  ru: {
    ariaLabel: 'Аватар'
  }
};
const TEMPLATE_RENDERERS = {
  default: _js_templates_default__WEBPACK_IMPORTED_MODULE_3__.renderDefaultTemplate,
  label: _js_templates_label__WEBPACK_IMPORTED_MODULE_4__.renderLabelTemplate,
  card: _js_templates_card__WEBPACK_IMPORTED_MODULE_2__.renderCardTemplate
};

class SfAvatar extends (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()) {
  static get props() {
    return {
      templateName: {
        attribute: "template",
        default: "default"
      },
      size: {
        default: "1"
      },
      line: {
        default: ""
      },
      shape: {
        default: "circle"
      },
      imageUrl: {
        default: ""
      },
      imageAlt: {
        default: ""
      },
      noWrap: {
        type: Boolean,
        default: false
      },
      text: {
        default: ""
      },
      status: {
        default: "none"
      },
      ariaLabel: {
        default: ''
      },
      title: {
        default: ""
      },
      description: {
        default: ""
      },
      meta: {
        default: ""
      },
      metaIcon: {
        default: ""
      },
      cardVariant: {
        default: "square"
      },
      disabled: {
        type: Boolean,
        default: false
      },
      // A count or a dot on the avatar (simai/ui-source#12).
      badgeCount: {
        default: ""
      },
      badgeDot: {
        type: Boolean,
        default: false
      },
      badgeCap: {
        type: Number,
        default: 99
      },
      badgeLabel: {
        default: ""
      }
    };
  }

  constructor() {
    super();
  }

  get templateName() {
    return this.getAttribute("template") || "default";
  }

  set templateName(value) {
    this.setAttribute("template", value || "default");
  }

  get size() {
    return this.getAttribute("size") || "1";
  } // Beside a label the avatar takes the label's text line of a form size
  // rather than a control height: an avatar's own sizes are control heights,
  // and none of them is a size 1 line on both desktop and mobile.


  get line() {
    const line = this.getAttribute("line") || "";
    return line ? (0,_component_field_size__WEBPACK_IMPORTED_MODULE_1__.fieldSize)(line, "sf-avatar line") : "";
  }

  set size(value) {
    this.setAttribute("size", value);
  }

  get shape() {
    return this.getAttribute("shape") || "circle";
  }

  set shape(value) {
    this.setAttribute("shape", value || "circle");
  }

  get imageUrl() {
    return this.getAttribute("image-url") || "";
  }

  set imageUrl(value) {
    if (value === null || value === undefined || value === "") {
      this.removeAttribute("image-url");
      return;
    }

    this.setAttribute("image-url", value);
  }

  get imageAlt() {
    return this.getAttribute("image-alt") || "";
  }

  set imageAlt(value) {
    if (value === null || value === undefined || value === "") {
      this.removeAttribute("image-alt");
      return;
    }

    this.setAttribute("image-alt", value);
  }

  get text() {
    return this.getAttribute("text") || "";
  }

  set text(value) {
    if (value === null || value === undefined || value === "") {
      this.removeAttribute("text");
      return;
    }

    this.setAttribute("text", value);
  }

  get status() {
    return this.getAttribute("status") || "none";
  }

  set status(value) {
    this.setAttribute("status", value || "none");
  }

  get ariaLabel() {
    return this.getAttribute("aria-label") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_6__.pageText)(AVATAR_TEXT, "ariaLabel", this);
  }

  set ariaLabel(value) {
    if (!value) {
      this.removeAttribute("aria-label");
      return;
    }

    this.setAttribute("aria-label", value);
  }

  get title() {
    return this.getAttribute("title") || "";
  }

  set title(value) {
    if (!value) {
      this.removeAttribute("title");
      return;
    }

    this.setAttribute("title", value);
  }

  get description() {
    return this.getAttribute("description") || "";
  }

  set description(value) {
    if (!value) {
      this.removeAttribute("description");
      return;
    }

    this.setAttribute("description", value);
  }

  get meta() {
    return this.getAttribute("meta") || "";
  }

  set meta(value) {
    if (!value) {
      this.removeAttribute("meta");
      return;
    }

    this.setAttribute("meta", value);
  }

  get metaIcon() {
    return this.getAttribute("meta-icon") || "";
  }

  set metaIcon(value) {
    if (!value) {
      this.removeAttribute("meta-icon");
      return;
    }

    this.setAttribute("meta-icon", value);
  }

  get cardVariant() {
    return this.getAttribute("card-variant") || "square";
  }

  set cardVariant(value) {
    this.setAttribute("card-variant", value || "square");
  }

  get disabled() {
    return this.getBooleanAttr("disabled", false);
  }

  set disabled(value) {
    if (value) {
      this.setAttribute("disabled", "");
      return;
    }

    this.removeAttribute("disabled");
  }

  get isImage() {
    return !!this.imageUrl;
  }

  get isText() {
    return !this.isImage && !!this.displayText;
  }

  get displayText() {
    if (this.text) {
      return this.text;
    }

    if (this.isImage) {
      return "";
    }

    return (0,_helpers_text__WEBPACK_IMPORTED_MODULE_5__.getInitials)(this.title || (this.hasAttribute("aria-label") ? this.ariaLabel : ""));
  }

  templateContext() {
    const props = this.getPropsContext();
    const badge = (0,_helpers_anchored_badge__WEBPACK_IMPORTED_MODULE_7__.elementBadge)(this);
    return this.createTemplateContext({ ...props,
      ariaLabel: this.getAttribute("aria-label") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_6__.pageText)(AVATAR_TEXT, "ariaLabel", this),
      // The count joins the name: «Анна Белова, 3 непрочитанных».
      buttonLabel: (0,_helpers_anchored_badge__WEBPACK_IMPORTED_MODULE_7__.nameWithBadge)(this.getAttribute("aria-label") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_6__.pageText)(AVATAR_TEXT, "ariaLabel", this), badge.phrase),
      badge,
      component: this,
      isImage: this.isImage,
      isText: this.isText,
      text: this.displayText,
      rootClass: this.getRootClass(),
      rootStyle: this.getRootStyle()
    });
  }

  hasBuiltInTemplate(templateName = this.templateName) {
    return Object.prototype.hasOwnProperty.call(TEMPLATE_RENDERERS, templateName);
  }

  templateRenderer() {
    return TEMPLATE_RENDERERS[this.templateName] || TEMPLATE_RENDERERS.default;
  }

  template() {
    return this.templateRenderer()(this.templateContext());
  }

  resolveUpdateMode(changedAttributes = []) {
    const directPatchAttributes = ["disabled"];

    if (changedAttributes.length > 0 && changedAttributes.every(attr => directPatchAttributes.includes(attr))) {
      return "dom";
    }

    return "lit";
  }

  updateDom(changedAttributes = []) {
    const button = this.querySelector(".sf-avatar");

    if (!button) {
      return false;
    }

    if (changedAttributes.includes("aria-label")) {
      button.setAttribute("aria-label", (0,_helpers_anchored_badge__WEBPACK_IMPORTED_MODULE_7__.nameWithBadge)(this.ariaLabel, (0,_helpers_anchored_badge__WEBPACK_IMPORTED_MODULE_7__.elementBadge)(this).phrase));
    }

    if (changedAttributes.includes("disabled")) {
      button.disabled = this.disabled;
    }

    return true;
  }

  get value() {
    return {
      template: this.templateName,
      size: this.size,
      line: this.line,
      shape: this.shape,
      imageUrl: this.imageUrl,
      imageAlt: this.imageAlt,
      text: this.text,
      status: this.status,
      ariaLabel: this.ariaLabel,
      title: this.title,
      description: this.description,
      meta: this.meta,
      metaIcon: this.metaIcon,
      cardVariant: this.cardVariant,
      disabled: this.disabled,
      badgeCount: this.getProp("badgeCount"),
      badgeDot: this.getProp("badgeDot"),
      badgeCap: this.getProp("badgeCap"),
      badgeLabel: this.getProp("badgeLabel")
    };
  }

  set value(nextValue) {
    this.setValueAttributes(nextValue);
  }

}

SfAvatar.define("sf-avatar");
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "c0c2069e1237"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderCardTemplate: () => (/* binding */ renderCardTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ddf1cdb42ecc");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);

function renderCardTemplate(context) {
  const variant = context.cardVariant || "square";
  const imageAlt = context.imageAlt || "";
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div
      class="sf-avatar-card sf-avatar-card--${variant} sf-avatar-card-${variant} flex flex-col ${context.rootClass || ""}"
      style=${context.rootStyle || ""}
    >
      <div class="sf-avatar-card-image flex flex-col">
        ${context.imageUrl ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<img src=${context.imageUrl} alt=${imageAlt} />` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div
              class="sf-avatar-card-placeholder bg-surface-container w-full h-full"
              aria-hidden="true"
            ></div>`}
      </div>
      <div class="sf-avatar-card-content flex-1 flex flex-col">
        ${context.title ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-avatar-card-title">${context.title}</div>` : ""}
        ${context.meta || context.description ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
              <div class="sf-avatar-card-row flex flex-row items-center">
                ${context.metaIcon ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class="sf-icon">${context.metaIcon}</i>` : ""}
                <span>${context.meta || context.description}</span>
              </div>
            ` : ""}
      </div>
    </div>
  `;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "602783801435"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderDefaultTemplate: () => (/* binding */ renderDefaultTemplate)
/* harmony export */ });
/* harmony import */ var _shared__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("4f7ae7ea9e1c");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_shared__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
_shared__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];

function renderDefaultTemplate(context) {
  return (0,_shared__WEBPACK_IMPORTED_MODULE_0__.avatarButton)(context);
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "63cd440fc8e3"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderLabelTemplate: () => (/* binding */ renderLabelTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ddf1cdb42ecc");
/* harmony import */ var _shared__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("4f7ae7ea9e1c");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, _shared__WEBPACK_IMPORTED_MODULE_1__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, _shared__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);


function renderLabelTemplate(context) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div
      class="sf-avatar-label-group sf-avatar-label-group--size-${context.size} flex items-cross-center ${context.rootClass || ""}"
      style=${context.rootStyle || ""}
    >
      ${(0,_shared__WEBPACK_IMPORTED_MODULE_1__.avatarButton)(context, {
    includeRootClass: false,
    includeRootStyle: false
  })}
      <div class="sf-avatar-label-group-container flex flex-col">
        ${context.title ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-avatar-label-group-title${context.noWrap ? ' overflow-hidden wrap-none t-ellipsis' : ''}">
              ${context.title}
            </div>` : ""}
        ${context.description ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-avatar-label-group-text${context.noWrap ? ' overflow-hidden wrap-none t-ellipsis' : ''}">
              ${context.description}
            </div>` : ""}
      </div>
    </div>
  `;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "4f7ae7ea9e1c"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   avatarButton: () => (/* binding */ avatarButton),
/* harmony export */   avatarClasses: () => (/* binding */ avatarClasses),
/* harmony export */   avatarContent: () => (/* binding */ avatarContent),
/* harmony export */   onlineIndicator: () => (/* binding */ onlineIndicator),
/* harmony export */   statusBadge: () => (/* binding */ statusBadge)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ddf1cdb42ecc");
/* harmony import */ var _helpers_anchored_badge__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("34addf781b5b");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, _helpers_anchored_badge__WEBPACK_IMPORTED_MODULE_1__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, _helpers_anchored_badge__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);



function getCompanyBadge(context) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span aria-hidden="true"
            class="sf-avatar-badge sf-avatar-badge--size-${context.size} sf-avatar-badge--company overflow-hidden flex absolute bottom-0 inline-end-0"
    >
    <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M56 0H0V55.9998H56V0Z" fill="#E81123"></path>
      <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M8.12891 28.0004L23.1261 12.9463L27.9999 17.8386L17.8754 28.0016L27.998 38.1627L23.1254 43.0538L8.12891 28.0004Z"
              fill="#F7F7F7"
      ></path>
      <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M47.8706 28.0004L32.8735 12.9463L27.9996 17.8386L38.1241 28.0016L28.0015 38.1627L32.8741 43.0538L47.8706 28.0004Z"
              fill="#F7F7F7"
      ></path>
    </svg>
  </span>`;
}

function getVerifiedBadge(context) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <span aria-hidden="true"
                class="sf-avatar-badge sf-avatar-badge--size-${context.size} sf-avatar-badge--verified overflow-hidden flex absolute bottom-0 inline-end-0"
        >
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#sf-avatar-verified-badge)">
          <path
                  d="M15.4447 3.54197C15.6347 4.00136 15.9993 4.36651 16.4584 4.55716L18.0683 5.22398C18.5277 5.41428 18.8927 5.7793 19.083 6.23872C19.2733 6.69815 19.2733 7.21436 19.083 7.67379L18.4167 9.28249C18.2263 9.74212 18.226 10.2589 18.4173 10.7183L19.0824 12.3265C19.1768 12.554 19.2254 12.7979 19.2254 13.0443C19.2254 13.2906 19.1769 13.5345 19.0827 13.7621C18.9884 13.9897 18.8502 14.1965 18.676 14.3706C18.5018 14.5448 18.295 14.6829 18.0674 14.7771L16.4587 15.4434C15.9993 15.6334 15.6341 15.998 15.4435 16.4571L14.7767 18.067C14.5864 18.5264 14.2213 18.8914 13.7619 19.0817C13.3025 19.272 12.7863 19.272 12.3269 19.0817L10.7181 18.4153C10.2587 18.2255 9.74268 18.2259 9.28353 18.4164L7.67367 19.0823C7.2145 19.2722 6.69874 19.272 6.23969 19.0818C5.78063 18.8917 5.41582 18.5271 5.22539 18.0682L4.55837 16.4578C4.36841 15.9985 4.00381 15.6333 3.5447 15.4427L1.93484 14.7758C1.47561 14.5856 1.11071 14.2208 0.920338 13.7617C0.729967 13.3025 0.729708 12.7865 0.91962 12.3272L1.58597 10.7185C1.7758 10.259 1.77541 9.74301 1.58489 9.28386L0.919499 7.67284C0.82516 7.44529 0.776583 7.20139 0.776543 6.95506C0.776504 6.70873 0.825003 6.4648 0.919269 6.23723C1.01354 6.00965 1.15172 5.80287 1.32593 5.62872C1.50014 5.45457 1.70696 5.31645 1.93457 5.22225L3.54327 4.55591C4.00226 4.36612 4.3672 4.00197 4.55798 3.5434L5.22481 1.93354C5.41511 1.47411 5.78012 1.10909 6.23955 0.918793C6.69898 0.728492 7.21519 0.728492 7.67461 0.918793L9.28332 1.58514C9.74276 1.77497 10.2588 1.77459 10.7179 1.58406L12.3285 0.919827C12.7878 0.729632 13.3039 0.729671 13.7633 0.919935C14.2226 1.1102 14.5876 1.47511 14.7779 1.93442L15.4449 3.54475L15.4447 3.54197Z"
                  fill="#005BBE"
          ></path>
          <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M13.9166 7.37864C14.0502 7.16879 14.0949 6.91446 14.041 6.6716C13.9871 6.42874 13.8389 6.21724 13.6291 6.08364C13.4192 5.95004 13.1649 5.90527 12.922 5.95919C12.6792 6.0131 12.4677 6.16129 12.3341 6.37114L8.66283 12.1399L6.98283 10.0399C6.82751 9.84562 6.60138 9.72101 6.35418 9.69346C6.10699 9.66592 5.85897 9.7377 5.6647 9.89302C5.47043 10.0483 5.34582 10.2745 5.31827 10.5217C5.29073 10.7689 5.36251 11.0169 5.51783 11.2111L8.01783 14.3361C8.111 14.4528 8.23066 14.5454 8.36687 14.6065C8.50308 14.6675 8.65189 14.6951 8.80093 14.6871C8.94998 14.679 9.09494 14.6355 9.22376 14.5601C9.35258 14.4847 9.46154 14.3796 9.54158 14.2536L13.9166 7.37864V7.37864Z"
                  fill="white"
          ></path>
        </g>
        <defs>
          <clipPath id="sf-avatar-verified-badge">
            <rect width="20" height="20" fill="white"></rect>
          </clipPath>
        </defs>
      </svg>
    </span>
    `;
}

function avatarClasses(context, options = {}) {
  const includeRootClass = options.includeRootClass !== false;
  const classes = ["sf-avatar", "transition", 'flex-none', `sf-avatar--size-${context.size}`, context.line ? `sf-avatar--line-${context.line}` : "", "inline-flex"].filter(Boolean);

  if (context.isImage) {
    classes.push("items-cross-center", "content-main-center");
  }

  if (context.isText) {
    classes.push("sf-avatar--text", "items-cross-center", "content-main-center");
  }

  if (!context.isImage && !context.isText) {
    classes.push("sf-avatar--placeholder", "items-cross-center", "content-main-center");
  }

  if (context.status !== "none") {
    classes.push("relative");
  }

  if (context.shape === "square") {
    classes.push("sf-avatar--square");
  }

  if (context.status === "online") {
    classes.push("sf-avatar--status-icon-online-indicator");
  }

  if (includeRootClass && context.rootClass) {
    classes.push(context.rootClass);
  }

  return classes.join(" ");
}
function avatarContent(context) {
  if (context.isText) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-avatar-text">${context.text}</span>`;
  }

  if (context.isImage) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<img class="sf-avatar-image" src=${context.imageUrl} alt="" />`;
  }

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class="sf-icon" aria-hidden="true">person</i>`;
}
function onlineIndicator(context) {
  if (context.component?.hasSlotContent?.("online-indicator")) {
    return context.component.getSlotContent("online-indicator");
  }

  if (!["online", "offline"].includes(context.status)) {
    return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  }

  const sizeMap = {
    "1/4": "sf-online-indicator--size-1/4",
    "1/3": "sf-online-indicator--size-1/3",
    "1/2": "sf-online-indicator--size-1/2",
    1: "sf-online-indicator--size-1",
    2: "sf-online-indicator--size-2",
    3: "sf-online-indicator--size-3"
  };
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <span aria-hidden="true"
                class="sf-online-indicator sf-online-indicator--${context.status} ${sizeMap[context.size] || ""} flex absolute bottom-0 inline-end-0"
        ></span>
    `;
}
function statusBadge(context) {
  switch (context.status) {
    case "company":
      if (context.component?.hasSlotContent?.("company-badge")) {
        return context.component.getSlotContent("company-badge");
      }

      return getCompanyBadge(context);

    case "verified":
      if (context.component?.hasSlotContent?.("verified-badge")) {
        return context.component.getSlotContent("verified-badge");
      }

      return getVerifiedBadge(context);

    default:
      return onlineIndicator(context);
  }
}
function avatarButton(context, options = {}) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <button
                class="${avatarClasses(context, options)}"
                style=${options.includeRootStyle === false ? "" : context.rootStyle || ""}
                aria-label=${context.buttonLabel ?? context.ariaLabel}
                ?disabled=${context.disabled}
                type="button"
        >
            ${avatarContent(context)} ${statusBadge(context)} ${(0,_helpers_anchored_badge__WEBPACK_IMPORTED_MODULE_1__.renderAnchoredBadge)(context.badge)}
        </button>
    `;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "34addf781b5b"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ANCHORED_BADGE_ATTRIBUTES: () => (/* binding */ ANCHORED_BADGE_ATTRIBUTES),
/* harmony export */   elementBadge: () => (/* binding */ elementBadge),
/* harmony export */   hasBadge: () => (/* binding */ hasBadge),
/* harmony export */   nameWithBadge: () => (/* reexport safe */ _component_badges_js_anchored_state__WEBPACK_IMPORTED_MODULE_1__.nameWithBadge),
/* harmony export */   renderAnchoredBadge: () => (/* binding */ renderAnchoredBadge),
/* harmony export */   renderAnchoredBadgeText: () => (/* binding */ renderAnchoredBadgeText)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ddf1cdb42ecc");
/* harmony import */ var _component_badges_js_anchored_state__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("7cd0e63a3ed6");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, _component_badges_js_anchored_state__WEBPACK_IMPORTED_MODULE_1__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, _component_badges_js_anchored_state__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
// The anchored badge of sf-avatar, sf-icon and sf-icon-button
// (simai/ui-source#12): the badge inputs read the same way on each, the same
// state as the ordinary runtime's, and the same markup, which the badge sheet
// (component/badges) places on the anchor. The element draws its badge
// itself, so the badge carries no data-count and the runtime leaves it alone.

 // Every anchor declares the same four props -- badgeCount, badgeDot, badgeCap
// (99) and badgeLabel -- read from badge-count, badge-dot, badge-cap and
// badge-label.

const ANCHORED_BADGE_ATTRIBUTES = Object.freeze(['badge-count', 'badge-dot', 'badge-cap', 'badge-label']);
/** What the element's badge shows and says, from its badge inputs. */

function elementBadge(element) {
  const state = (0,_component_badges_js_anchored_state__WEBPACK_IMPORTED_MODULE_1__.anchoredBadgeState)({
    count: element.getProp?.('badgeCount'),
    dot: element.getProp?.('badgeDot'),
    cap: element.getProp?.('badgeCap'),
    label: element.getProp?.('badgeLabel')
  }, element); // The sheet that places it comes with the badges component; an element
  // whose rule fetches it lazily asks for it when there is a badge to show.

  if (state.visible) globalThis.SF?.Loader?.ensurePlugin?.('badges');
  return state;
}
/** Whether there is a badge to draw. */

function hasBadge(badge) {
  return Boolean(badge?.visible);
}
/** The badge itself: the digits and the dot hidden from assistive technology. */

function renderAnchoredBadge(badge) {
  if (!badge?.visible) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span
        class="sf-badge sf-badge--anchored${badge.dot ? ' sf-badge--dot' : ''}"
        aria-hidden="true"
        title=${badge.phrase || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    >${badge.text}</span>`;
}
/** The phrase for a name read from content, out of sight. */

function renderAnchoredBadgeText(badge, after = true) {
  if (!badge?.visible || !badge.phrase) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-badge-anchored-text">${after ? ', ' : ''}${badge.phrase}</span>`;
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "cbce4a5232a6"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getInitials: () => (/* binding */ getInitials),
/* harmony export */   normalizeInitialsWords: () => (/* binding */ normalizeInitialsWords)
/* harmony export */ });
const INITIALS_SKIP_WORDS = new Set(["а", "без", "в", "во", "для", "до", "за", "из", "из-за", "из-под", "и", "к", "ко", "между", "на", "над", "о", "об", "от", "по", "под", "при", "про", "с", "со", "у", "через", "the", "a", "an", "and", "for", "from", "in", "of", "on", "to"]);
function normalizeInitialsWords(value = "") {
  return String(value || "").trim().split(/[\s/|]+/).map(word => word.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "")).filter(Boolean);
}
function getInitials(value = "", options = {}) {
  const {
    maxLetters = 2,
    skipWords = INITIALS_SKIP_WORDS
  } = options;
  const words = normalizeInitialsWords(value);
  const significantWords = words.filter((word, index) => index === 0 || !skipWords.has(String(word).toLowerCase()));

  if (!significantWords.length) {
    return "";
  }

  if (significantWords.length > 1) {
    return significantWords.slice(0, maxLetters).map(word => Array.from(word)[0] || "").join("").toUpperCase();
  }

  return Array.from(significantWords[0]).slice(0, 1).join("").toUpperCase();
}

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
/******/ 	let __webpack_exports__ = __webpack_require__("f92e47b164fa");
/******/
/******/ })()
;