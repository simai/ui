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
/* harmony import */ var _core_js_page_language_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("43090d1c8307");
/* harmony import */ var _lang_index_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("4c90c9c3f57e");
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
 // The words live in the component's language files (localization study LC-4):
// one place for every language, as the Smart components keep them.

 // The words, by language. A count is a plural word, one phrase per plural
// category of the language as Intl.PluralRules names them ({one, few, many,
// other} in Russian, {one, other} in English), with {count} where
// the number goes: the form every language file and pack uses (C177). A
// product adds a language with SF.language.register('sf-badge', code,
// {count, dot}); a count written as «a|b|c» (an author's label, a product's
// word from before) still reads in the order of the categories.

const ANCHORED_BADGE_TEXT = _lang_index_mjs__WEBPACK_IMPORTED_MODULE_1__["default"];
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
 * The form of `forms` for `count` in `locale`. A plural word
 * ({one, few, many, other}) answers the category Intl.PluralRules gives,
 * else its `other`. A string "a|b|c": one form is used for every number; with
 * several, the n-th form answers the n-th plural category the language has,
 * and a category past the last form takes the last one.
 */

function pluralForm(forms, count, locale = 'en') {
  if (forms && typeof forms === 'object') {
    let category = 'other';

    try {
      category = new Intl.PluralRules(locale).select(count);
    } catch {
      category = 'other';
    }

    return String(forms[category] ?? forms.other ?? '');
  }

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
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FIELD_LADDER: () => (/* binding */ FIELD_LADDER),
/* harmony export */   FIELD_SIZES: () => (/* binding */ FIELD_SIZES),
/* harmony export */   INPUT_SIZES: () => (/* binding */ INPUT_SIZES),
/* harmony export */   RETIRED_FIELD_SIZES: () => (/* binding */ RETIRED_FIELD_SIZES),
/* harmony export */   fieldSize: () => (/* binding */ fieldSize),
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
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "f92e47b164fa"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _component_field_size__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("e6d86f2cd058");
/* harmony import */ var _js_templates_card__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("c0c2069e1237");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("602783801435");
/* harmony import */ var _js_templates_label__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("63cd440fc8e3");
/* harmony import */ var _helpers_text__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("cbce4a5232a6");
/* harmony import */ var _js_tone_mjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("a6b3ed0c1589");
/* harmony import */ var _helpers_anchored_badge__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("34addf781b5b");
/* harmony import */ var _helpers_cycle__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("64feefebb417");
/* harmony import */ var _js_picture__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("c69a3dc158df");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("488a9707ea64");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__("f2cb53b98f17");
/* harmony import */ var _lang_index_mjs__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__("93adbb2e2934");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _component_field_size__WEBPACK_IMPORTED_MODULE_2__, _js_templates_card__WEBPACK_IMPORTED_MODULE_3__, _js_templates_default__WEBPACK_IMPORTED_MODULE_4__, _js_templates_label__WEBPACK_IMPORTED_MODULE_5__, _helpers_anchored_badge__WEBPACK_IMPORTED_MODULE_8__, _js_picture__WEBPACK_IMPORTED_MODULE_10__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _component_field_size__WEBPACK_IMPORTED_MODULE_2__, _js_templates_card__WEBPACK_IMPORTED_MODULE_3__, _js_templates_default__WEBPACK_IMPORTED_MODULE_4__, _js_templates_label__WEBPACK_IMPORTED_MODULE_5__, _helpers_anchored_badge__WEBPACK_IMPORTED_MODULE_8__, _js_picture__WEBPACK_IMPORTED_MODULE_10__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);













 // Only the words on screen ship in the bundle, English only (owner decision
// C282): Russian and every other language come from a language file. The
// title, settings and events stay in the language files for the Studio and the
// docs (localization study LC-2).
// sf-avatar from its component.json (standard simai.smart-component 1.3.8 §3,
// §4, §11): the settings are the attributes and properties
// core/js/element-manifest.js makes from the manifest; title is heading's
// dated alias (aliases.json, §3.1); the default name is the language files'
// runtime aria-label.

const AvatarElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_11__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: _lang_index_mjs__WEBPACK_IMPORTED_MODULE_13__.files,
  source: "ru",
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_12__
}); // The tooltips' ids, one per element on the page (stable across renders).

let sequence = 0;
const TEMPLATE_RENDERERS = {
  default: _js_templates_default__WEBPACK_IMPORTED_MODULE_4__.renderDefaultTemplate,
  label: _js_templates_label__WEBPACK_IMPORTED_MODULE_5__.renderLabelTemplate,
  card: _js_templates_card__WEBPACK_IMPORTED_MODULE_3__.renderCardTemplate
};

class SfAvatar extends AvatarElement {
  get templateName() {
    return this.getAttribute("template") || "default";
  }

  set templateName(value) {
    this.setAttribute("template", value || "default");
  } // Beside a label the avatar takes the label's text line of a form size
  // rather than a control height: an avatar's own sizes are control heights,
  // and none of them is a size 1 line on both desktop and mobile.


  get line() {
    const line = this.getAttribute("line") || "";
    return line ? (0,_component_field_size__WEBPACK_IMPORTED_MODULE_2__.fieldSize)(line, "sf-avatar line") : "";
  }

  set line(value) {
    super.line = value;
  } // The browser's own ariaLabel answers the attribute; the avatar answers its
  // default word too, as it always did.


  get ariaLabel() {
    return this.getAttribute("aria-label") || this.sfWord("aria-label");
  }

  set ariaLabel(value) {
    if (!value) {
      this.removeAttribute("aria-label");
      return;
    }

    this.setAttribute("aria-label", value);
  } // The name the avatar is read by (avatar study AV-2, 2026-11-14): the
  // host's aria-label, else the heading the author gave, else the initials of
  // text, else the language file's word («Аватар»). heading named nobody: it
  // gave the initials and the hue, and the button still read «Аватар» (10 of
  // 36 avatars on the docs page). el.ariaLabel keeps answering the attribute
  // or the word, as it did.


  get accessibleName() {
    return this.getAttribute("aria-label") || String(this.heading ?? "").trim() || String(this.text ?? "").trim() || this.sfWord("aria-label");
  } // The presence word (AV-4): online and offline join the name as the count
  // does -- «Анна Белова, в сети, 3 непрочитанных» -- in the page's language
  // (lang runtime status-online / status-offline). The company and verified
  // marks are not presence and add nothing.


  get presenceWord() {
    if (this.status === "online") return this.sfWord("status-online");
    if (this.status === "away") return this.sfWord("status-away");
    if (this.status === "offline") return this.sfWord("status-offline");
    return "";
  } // What the avatar is (owner decision C152 (1), 2026-11-14): a link with
  // href; a button where it has an action of its own -- the trigger of a
  // popover or a menu (slot="trigger"), or a host that says it opens one
  // (aria-haspopup); otherwise a picture, role img with the name, no Tab
  // stop and no hover ring. It was always a button: five avatars in a row
  // were five Tab stops, and products hid them with aria-hidden and inert.


  get mode() {
    if (String(this.href ?? "").trim()) return "link";

    if (this.getAttribute("slot") === "trigger" || this.hasAttribute("aria-haspopup")) {
      return "button";
    }

    return "picture";
  } // The name over an avatar whose name is not printed (C152 (7)): a link or
  // a button of the default template -- the user menu in a header, a link to
  // a profile. A picture's name is printed beside it in a row, a card or a
  // label, so it takes none; a group shows its members' names itself.


  get tooltipText() {
    if (this.templateName !== "default" || this.mode === "picture") return "";
    return String(this.heading ?? "").trim() || this.getAttribute("aria-label") || "";
  }

  get spokenName() {
    const presence = this.presenceWord;
    const name = presence ? `${this.accessibleName}, ${presence}` : this.accessibleName;
    return (0,_helpers_anchored_badge__WEBPACK_IMPORTED_MODULE_8__.nameWithBadge)(name, (0,_helpers_anchored_badge__WEBPACK_IMPORTED_MODULE_8__.elementBadge)(this).phrase);
  }

  connectedCallback() {
    super.connectedCallback(); // The placeholder's glyph is asked for before the avatar draws, as the
    // tag's is (R074 F3): one request with the page's first icons.

    if (this.isConnected) this.preloadIcons();
  }

  preloadIcons() {
    const icons = (0,_js_picture__WEBPACK_IMPORTED_MODULE_10__.avatarPictureIcons)({
      imageUrl: this.imageUrl,
      text: this.displayText,
      icon: this.icon
    });
    (0,_helpers_cycle__WEBPACK_IMPORTED_MODULE_9__.preloadControlIcons)(this, icons.map(icon => ({
      icon,
      filled: false
    })));
  } // The text attribute as given; the template draws displayText (the text,
  // else initials), an exemption of contracts/template-context.json.


  get text() {
    return super.text;
  }

  set text(value) {
    super.text = value;
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
    } // A glyph the author names (a bot, a system) stands in for the initials
    // of the name, which still names the avatar (AV-8).


    if (String(this.icon ?? "").trim()) {
      return "";
    }

    return (0,_helpers_text__WEBPACK_IMPORTED_MODULE_6__.getInitials)(this.heading || (this.hasAttribute("aria-label") ? this.ariaLabel : ""));
  } // The letters drawn: the initials with a photo too (they stand under it
  // until it comes and when it fails, C152 (2)), one letter at 1/4 (C152 (3)).


  get drawnText() {
    if (String(this.icon ?? "").trim() && !this.text) return "";
    const own = this.text || (0,_helpers_text__WEBPACK_IMPORTED_MODULE_6__.getInitials)(this.heading || (this.hasAttribute("aria-label") ? this.ariaLabel : ""));
    return (0,_js_picture__WEBPACK_IMPORTED_MODULE_10__.avatarStepText)(own, this.size);
  } // The hue the initials are drawn in (C17): the named one, or for auto the
  // one of the name, the words the initials stand for rather than the two
  // letters, so two people with the same initials differ. Only initials take a
  // hue: a picture covers the fill and the placeholder stays neutral. The
  // former tone setting is read when hue is empty (rose is pink). A card
  // without a photo draws the initials on the hue of the name when no hue is
  // set (owner decision C124): auto is the card's default.


  get resolvedHue() {
    if (!this.drawnText) {
      return "";
    }

    const cardDefault = this.templateName === "card" && !this.hue && !this.tone ? "auto" : "";
    return (0,_js_tone_mjs__WEBPACK_IMPORTED_MODULE_7__.resolveAvatarHue)(this.hue || cardDefault, this.heading || this.getAttribute("aria-label") || this.text, this.tone);
  }

  templateContext() {
    const props = this.getPropsContext();
    const badge = (0,_helpers_anchored_badge__WEBPACK_IMPORTED_MODULE_8__.elementBadge)(this);
    if (!this._uid) this._uid = `sf-avatar-${++sequence}`;
    const tipText = this.tooltipText; // The tooltip relation is lazy: asked for when such an avatar draws.

    if (tipText) globalThis.SF?.Loader?.ensurePlugin?.("tooltip");
    return this.createTemplateContext({ ...props,
      ariaLabel: this.ariaLabel,
      // The name, the presence and the count: «Анна Белова, в сети,
      // 3 непрочитанных».
      buttonLabel: this.spokenName,
      icon: this.icon,
      size: this.size,
      line: this.line,
      shape: this.shape,
      status: this.status,
      heading: this.heading,
      // An external project template written before the rename reads title.
      title: this.heading,
      badge,
      component: this,
      isImage: this.isImage,
      // The initials are drawn alone or under the photo (C152 (2)); the card
      // keeps its own photo-or-placeholder media (isCardText).
      isText: Boolean(this.drawnText),
      isCardText: this.isText,
      resolvedHue: this.resolvedHue,
      text: this.templateName === "card" ? this.displayText : this.drawnText,
      mode: this.mode,
      href: String(this.href ?? "").trim(),
      tipText,
      tipId: tipText ? `${this._uid}-tip` : "",
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
    this.preloadIcons();
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
    const button = this.querySelector(".sf-avatar"); // Only a button takes disabled in place; a link or a picture draws again.

    if (!button || button.localName !== "button") {
      return false;
    }

    if (changedAttributes.includes("aria-label")) {
      button.setAttribute("aria-label", this.spokenName);
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
      hue: this.hue,
      tone: this.tone,
      status: this.status,
      icon: this.icon,
      href: this.href,
      ariaLabel: this.ariaLabel,
      heading: this.heading,
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

/***/ "c69a3dc158df"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AVATAR_PLACEHOLDER_ICON: () => (/* binding */ AVATAR_PLACEHOLDER_ICON),
/* harmony export */   AVATAR_SIZES: () => (/* binding */ AVATAR_SIZES),
/* harmony export */   avatarClasses: () => (/* binding */ avatarClasses),
/* harmony export */   avatarContent: () => (/* binding */ avatarContent),
/* harmony export */   avatarPicture: () => (/* binding */ avatarPicture),
/* harmony export */   avatarPictureContext: () => (/* binding */ avatarPictureContext),
/* harmony export */   avatarPictureIcons: () => (/* binding */ avatarPictureIcons),
/* harmony export */   avatarStepText: () => (/* binding */ avatarStepText)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var lit_directives_keyed_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("9d9903b87148");
/* harmony import */ var _helpers_text__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("cbce4a5232a6");
/* harmony import */ var _tone_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("a6b3ed0c1589");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, lit_directives_keyed_js__WEBPACK_IMPORTED_MODULE_1__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, lit_directives_keyed_js__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lit_directives_keyed_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lit_directives_keyed_js__WEBPACK_IMPORTED_MODULE_1__);



 // One avatar drawing (avatar study AV-8, 2026-11-14). sf-avatar and every
// component that shows a person beside its own content -- sf-avatar-group,
// sf-tag, sf-list-item, sf-dropdown, sf-input-lookup, sf-menu-context, the
// signs of sf-list -- draw the picture with these functions and the avatars
// sheet's classes: a photo is an <img> filling the circle, initials stand on
// the neutral plate (or the hue the host names, C17), and with neither the
// placeholder is a glyph on the neutral plate -- person by default, the
// host's icon for a bot, a system or a service. Before, five copies drew it
// five ways: the photo as a background image in the tag, the list row and the
// dropdown, an empty transparent circle in a row with no photo, and the
// context menu's own classes on the secondary container.

/** The sizes of the avatar ladder. */

const AVATAR_SIZES = Object.freeze(["1/4", "1/3", "1/2", "1", "2", "3"]);
/** The glyph of a placeholder: a person, unless the host names another. */

const AVATAR_PLACEHOLDER_ICON = "person"; // The letters a step holds (owner decision C152 (3), 2026-11-14): two from
// 1/3 up, one at 1/4 (16 px holds one letter of a readable size, two were
// 10 px each). Only letters are cut: «+5» or a number stays whole.

function avatarStepText(text, size) {
  const value = String(text ?? "");
  if (String(size ?? "") !== "1/4") return value;
  const letters = value.match(/^(\p{L}\p{M}*)\p{L}/u);
  return letters ? letters[1] : value;
}
/**
 * The drawing context of one avatar picture, from what a host knows: the photo,
 * the initials or the name they are taken from, the hue, the placeholder's
 * glyph, the size (or the text line of a form size) and the shape.
 */

function avatarPictureContext(options = {}) {
  const imageUrl = String(options.imageUrl ?? "").trim();
  const name = String(options.name ?? "").trim();
  const explicitText = String(options.text ?? "").trim();
  const namedIcon = String(options.icon ?? "").trim();
  const size = AVATAR_SIZES.includes(String(options.size ?? "")) ? String(options.size) : ""; // The initials: the host's own, else those of the name -- unless the host
  // names a glyph (a bot, a system), which stands in for them. With a photo
  // they stand under it until it comes and when it fails (C152 (2)).

  const text = avatarStepText(namedIcon ? explicitText : explicitText || (0,_helpers_text__WEBPACK_IMPORTED_MODULE_2__.getInitials)(name), size);
  const isImage = Boolean(imageUrl); // isText: the initials are drawn (alone, or under the photo).

  const isText = Boolean(text);
  const icon = namedIcon || AVATAR_PLACEHOLDER_ICON;
  return {
    size,
    line: String(options.line ?? ""),
    shape: options.shape === "square" ? "square" : "circle",
    imageUrl,
    isImage,
    isText,
    text,
    icon,
    status: options.status || "none",
    expressive: Boolean(options.expressive),
    resolvedHue: isText && options.hue ? (0,_tone_mjs__WEBPACK_IMPORTED_MODULE_3__.resolveAvatarHue)(options.hue, name || text, "") : "",
    rootClass: options.rootClass || "",
    rootStyle: options.rootStyle || "",
    disabled: Boolean(options.disabled),
    // A long list's rows load their photos as they scroll in.
    lazy: Boolean(options.lazy),
    component: options.component
  };
}
/**
 * The classes of the avatar picture. The avatars sheet answers every class
 * this file writes. sf-avatar's own templates hand it their utility classes
 * for the box (options.layout, src/smart/avatar/js/templates/shared.js), as
 * they wrote them before; a host's picture writes none -- sf-avatar--picture
 * gives it the same box from the avatars sheet -- so a host asks the Loader
 * for no utility it did not ask for before (a menu, a tag, a list row).
 */

function avatarClasses(context, options = {}) {
  const includeRootClass = options.includeRootClass !== false;
  const layout = options.layout ?? null;
  const classes = ["sf-avatar", layout ? layout.box : "sf-avatar--picture", context.size ? `sf-avatar--size-${context.size}` : "", context.line ? `sf-avatar--line-${context.line}` : "", layout ? layout.inline : ""].filter(Boolean);

  if (context.isText) {
    classes.push("sf-avatar--text");
    if (layout) classes.push(layout.center); // The hue's role set (core .sf-hue-<name>, C17); the class sheet
    // draws the plate and the ink from it.

    if (context.resolvedHue) {
      classes.push(`sf-hue-${context.resolvedHue}`);
    }
  }

  if (!context.isText) {
    classes.push("sf-avatar--placeholder");
    if (layout) classes.push(layout.center);
  } // The decorative level (C91 level 2): the sheet turns the initials'
  // plate of the largest size into a cover of its hue.


  if (context.expressive) {
    classes.push("sf-avatar--expressive");
  }

  if (context.status && context.status !== "none" && layout) {
    classes.push(layout.anchor);
  }

  if (context.shape === "square") {
    classes.push("sf-avatar--square");
  }

  if (context.status === "online") {
    classes.push("sf-avatar--status-icon-online-indicator");
  }

  if (options.disabled) {
    classes.push("disabled");
  }

  if (includeRootClass && context.rootClass) {
    classes.push(context.rootClass);
  }

  if (options.extraClass) {
    classes.push(options.extraClass);
  }

  return classes.join(" ");
} // The photo says when it has come or failed (C152 (2)): the sheet fades it
// in over the initials when loaded and drops it on an error, so the avatar is
// never an empty circle or the browser's broken-image glyph. The state is
// the runtime mark data-sf-loaded ("true" or "error"), which the template
// does not bind, so a redraw keeps it, and which a first-paint snapshot
// leaves out (it depends on the network); a new address is a new element
// (keyed), which starts transparent again.

function onImageLoad(event) {
  event.currentTarget.dataset.sfLoaded = "true";
}

function onImageError(event) {
  event.currentTarget.dataset.sfLoaded = "error";
}
/**
 * What the circle holds: the initials, or the placeholder glyph as an sf-icon
 * element, so its name reaches the icon font request (a bare <i class="sf-icon">
 * drawn after the page's scan stayed blank: buttons review 2026-11-09); with a
 * photo, the photo over them (owner decision C152 (2)).
 */


function avatarContent(context) {
  const under = context.isText ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-avatar-text">${context.text}</span>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-icon icon=${context.icon || AVATAR_PLACEHOLDER_ICON} aria-hidden="true"></sf-icon>`;
  if (!context.isImage) return under;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${under}${(0,lit_directives_keyed_js__WEBPACK_IMPORTED_MODULE_1__.keyed)(context.imageUrl, (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<img class="sf-avatar-image" src=${context.imageUrl} alt="" loading=${context.lazy ? "lazy" : lit__WEBPACK_IMPORTED_MODULE_0__.nothing} decoding=${context.lazy ? "async" : lit__WEBPACK_IMPORTED_MODULE_0__.nothing} @load=${onImageLoad} @error=${onImageError} />`)}`;
}
/** The icon names a picture draws (for a host's icon preload). */

function avatarPictureIcons(options = {}) {
  const context = avatarPictureContext(options);
  return context.isText ? [] : [context.icon];
}
/**
 * One avatar picture beside a host's own content: a span hidden from
 * assistive technology (the host's visible text names the person), drawn with
 * the avatars sheet. extraClass adds the host's own geometry class.
 */

function avatarPicture(options = {}) {
  const context = avatarPictureContext(options);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span
        class=${avatarClasses(context, {
    extraClass: options.extraClass,
    disabled: context.disabled
  })}
        style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        aria-hidden="true"
    >${avatarContent(context)}</span>`;
}
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
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
 // The media box without a photo (owner decision C124, 2026-11-13; research
// control/research/2026-11-13-avatar-placeholder.md): the initials of the
// name on the person's hue (the round avatar's hue="auto" rule), and with no
// name a person glyph on the neutral fill. The heading beside it already
// names the person, so the box is decoration for assistive technology.

function cardPlaceholder(context) {
  if (context.isCardText) {
    const hue = context.resolvedHue ? ` sf-hue-${context.resolvedHue}` : "";
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div
      class="sf-avatar-card-placeholder sf-avatar-card-placeholder--text${hue} flex items-center justify-center w-full h-full"
      aria-hidden="true"
    ><span class="sf-avatar-card-initials">${context.text}</span></div>`;
  }

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div
    class="sf-avatar-card-placeholder sf-avatar-card-placeholder--icon flex items-center justify-center w-full h-full"
    aria-hidden="true"
  ><i class="sf-icon" aria-hidden="true">${context.icon || "person"}</i></div>`;
}

function renderCardTemplate(context) {
  const variant = context.cardVariant || "square";
  const imageAlt = context.imageAlt || "";
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div
      class="sf-avatar-card sf-avatar-card--${variant} sf-avatar-card-${variant} flex flex-col ${context.rootClass || ""}"
      style=${context.rootStyle || ""}
    >
      <div class="sf-avatar-card-image flex flex-col">
        ${context.imageUrl ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<img src=${context.imageUrl} alt=${imageAlt} />` : cardPlaceholder(context)}
      </div>
      <div class="sf-avatar-card-content flex-1 flex flex-col">
        ${context.heading ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-avatar-card-title">${context.heading}</div>` : ""}
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
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var _shared__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("4f7ae7ea9e1c");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, _shared__WEBPACK_IMPORTED_MODULE_1__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, _shared__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);

 // The name and the role wrap (owner decision C152 (7): a printed name is
// read whole, the class sheet breaks a word longer than the line); with
// no-wrap they end in an ellipsis and the full text is the line's title
// (register RG-S1-24, 2026-11-16).

function renderLabelTemplate(context) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div
      class="sf-avatar-label-group sf-avatar-label-group--size-${context.size} flex items-cross-center ${context.rootClass || ""}"
      style=${context.rootStyle || ""}
    >
      ${(0,_shared__WEBPACK_IMPORTED_MODULE_1__.avatarButton)(context, {
    includeRootClass: false,
    includeRootStyle: false,
    // The heading is printed beside the picture: the name is read once,
    // from the text (C152 (1)).
    nameShown: Boolean(context.heading)
  })}
      <div class="sf-avatar-label-group-container flex flex-col">
        ${context.heading ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-avatar-label-group-title${context.noWrap ? ' overflow-hidden wrap-none t-ellipsis' : ''}" title=${context.noWrap ? context.heading : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
              ${context.heading}
            </div>` : ""}
        ${context.description ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-avatar-label-group-text${context.noWrap ? ' overflow-hidden wrap-none t-ellipsis' : ''}" title=${context.noWrap ? context.description : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
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
/* harmony export */   avatarContent: () => (/* reexport safe */ _picture__WEBPACK_IMPORTED_MODULE_2__.avatarContent),
/* harmony export */   onlineIndicator: () => (/* binding */ onlineIndicator),
/* harmony export */   statusBadge: () => (/* binding */ statusBadge),
/* harmony export */   withNameTooltip: () => (/* binding */ withNameTooltip)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var _helpers_anchored_badge__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("34addf781b5b");
/* harmony import */ var _picture__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("c69a3dc158df");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, _helpers_anchored_badge__WEBPACK_IMPORTED_MODULE_1__, _picture__WEBPACK_IMPORTED_MODULE_2__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, _helpers_anchored_badge__WEBPACK_IMPORTED_MODULE_1__, _picture__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);


 // sf-avatar's box in utility classes, as its templates have always written
// it (their words stay here, where the Loader's template-utilities table
// reads them); a host's picture takes the same box from the avatars sheet.

const AVATAR_LAYOUT = Object.freeze({
  box: "transition flex-none",
  inline: "inline-flex",
  center: "items-cross-center content-main-center",
  anchor: "relative"
});
/** The classes of sf-avatar's own picture: the sheet's and its utilities. */

function avatarClasses(context, options = {}) {
  return (0,_picture__WEBPACK_IMPORTED_MODULE_2__.avatarClasses)(context, { ...options,
    layout: AVATAR_LAYOUT
  });
}

function getCompanyBadge(context) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span aria-hidden="true"
            class="sf-avatar-badge sf-avatar-badge--size-${context.size} sf-avatar-badge--company overflow-hidden flex absolute bottom-0 inline-end-0"
    >
    <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M56 0H0V55.9998H56V0Z" class="sf-avatar-badge-plate"></path>
      <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M8.12891 28.0004L23.1261 12.9463L27.9999 17.8386L17.8754 28.0016L27.998 38.1627L23.1254 43.0538L8.12891 28.0004Z"
              class="sf-avatar-badge-glyph"
      ></path>
      <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M47.8706 28.0004L32.8735 12.9463L27.9996 17.8386L38.1241 28.0016L28.0015 38.1627L32.8741 43.0538L47.8706 28.0004Z"
              class="sf-avatar-badge-glyph"
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
                  class="sf-avatar-badge-plate"
          ></path>
          <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M13.9166 7.37864C14.0502 7.16879 14.0949 6.91446 14.041 6.6716C13.9871 6.42874 13.8389 6.21724 13.6291 6.08364C13.4192 5.95004 13.1649 5.90527 12.922 5.95919C12.6792 6.0131 12.4677 6.16129 12.3341 6.37114L8.66283 12.1399L6.98283 10.0399C6.82751 9.84562 6.60138 9.72101 6.35418 9.69346C6.10699 9.66592 5.85897 9.7377 5.6647 9.89302C5.47043 10.0483 5.34582 10.2745 5.31827 10.5217C5.29073 10.7689 5.36251 11.0169 5.51783 11.2111L8.01783 14.3361C8.111 14.4528 8.23066 14.5454 8.36687 14.6065C8.50308 14.6675 8.65189 14.6951 8.80093 14.6871C8.94998 14.679 9.09494 14.6355 9.22376 14.5601C9.35258 14.4847 9.46154 14.3796 9.54158 14.2536L13.9166 7.37864V7.37864Z"
                  class="sf-avatar-badge-glyph"
          ></path>
        </g>
        <defs>
          <clipPath id="sf-avatar-verified-badge">
            <rect width="20" height="20"></rect>
          </clipPath>
        </defs>
      </svg>
    </span>
    `;
} // The picture's classes and content are the one avatar drawing every host
// shares (js/picture.js, avatar study AV-8).



function onlineIndicator(context) {
  if (context.component?.hasSlotContent?.("online-indicator")) {
    return context.component.getSlotContent("online-indicator");
  } // Only «online» is drawn, and «away» as a hollow ring when the host
  // asks for it (owner decision C152 (5), 2026-11-14): grey offline dots in
  // a long list read as «something here». Offline draws nothing; its word
  // still joins the name (index.js presenceWord).


  if (!["online", "away"].includes(context.status)) {
    return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  }

  const sizeMap = {
    "1/4": "sf-online-indicator--size-1/4",
    "1/3": "sf-online-indicator--size-1/3",
    "1/2": "sf-online-indicator--size-1/2",
    1: "sf-online-indicator--size-1",
    2: "sf-online-indicator--size-2",
    3: "sf-online-indicator--size-3"
  }; // The point is the Framework's one dot (owner decision C185 (8)): the
  // .sf-dot of the shared vocabulary draws the disc -- online the solid
  // success dot, away the hollow neutral one --, and .sf-online-indicator
  // only places it on the avatar and cuts it out with the place's ring.

  const dot = context.status === "away" ? "sf-dot sf-dot--hollow sf-dot--neutral" : "sf-dot sf-dot--success";
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <span aria-hidden="true"
                class="sf-online-indicator sf-online-indicator--${context.status} ${sizeMap[context.size] || ""} flex absolute bottom-0 inline-end-0"
        ><span class=${dot}><span class="sf-dot-item"></span></span></span>
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
} // The name in a tooltip where no name is visible (owner decision C152 (7)):
// the Framework's tooltip composition (component.tooltip) -- an anchor holding
// the avatar (data-tooltip naming the surface) and a dark tooltip of size 1/3
// with its tail pointing down. The controller shows it on hover and keyboard
// focus and hides it on Escape and a press. The surface is hidden in the
// markup and only the controller shows it, so a redraw never fights it.

function withNameTooltip(trigger, tipText, tipId) {
  if (!tipText || !tipId) return trigger;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-avatar-anchor sf-tooltip-anchor">${trigger}<span
        class="sf-tooltip sf-tooltip--dark sf-tooltip--size-1/3 sf-tooltip--arrow-bottom-center sf-avatar-tooltip"
        id=${tipId} hidden><span class="sf-tooltip-content"><span class="sf-tooltip-text">${tipText}</span><span
        class="sf-tooltip-tail" aria-hidden="true"></span></span></span></span>`;
} // What the avatar is (owner decision C152 (1), 2026-11-14): a picture by
// default -- role img named by the person, no Tab stop, no hover ring --,
// a link with href, a button only where it has an action of its own (the
// trigger of a menu: slot="trigger" or aria-haspopup on the host). Beside
// a printed name (options.nameShown) the picture is hidden from assistive
// technology: the name is read once, from the text.

function avatarButton(context, options = {}) {
  const style = options.includeRootStyle === false ? "" : context.rootStyle || "";
  const label = context.buttonLabel ?? context.ariaLabel;
  const inner = (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${(0,_picture__WEBPACK_IMPORTED_MODULE_2__.avatarContent)(context)} ${statusBadge(context)} ${(0,_helpers_anchored_badge__WEBPACK_IMPORTED_MODULE_1__.renderAnchoredBadge)(context.badge)}`;
  const mode = context.mode || "button";

  if (mode === "link") {
    const link = (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<a
                class="${avatarClasses(context, { ...options,
      disabled: context.disabled
    })}"
                style=${style || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                href=${context.disabled ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : context.href}
                aria-disabled=${context.disabled ? "true" : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                aria-label=${label}
                data-tooltip=${context.tipId && context.tipText ? context.tipId : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        >${inner}</a>`;
    return withNameTooltip(link, context.tipText, context.tipId);
  }

  if (mode === "picture") {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span
                class="${avatarClasses(context, { ...options,
      disabled: context.disabled
    })}"
                style=${style || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                role=${options.nameShown ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : "img"}
                aria-label=${options.nameShown ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : label}
                aria-hidden=${options.nameShown ? "true" : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        >${inner}</span>`;
  }

  const button = (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <button
                class="${avatarClasses(context, options)}"
                style=${style}
                aria-label=${label}
                ?disabled=${context.disabled}
                type="button"
                data-tooltip=${context.tipId && context.tipText ? context.tipId : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        >
            ${inner}
        </button>
    `;
  return withNameTooltip(button, context.tipText, context.tipId);
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
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
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

  if (state.visible) {
    globalThis.SF?.Loader?.ensurePlugin?.('badges'); // The dot it draws is the Framework's one dot (C185 (8)): its sheet.

    globalThis.SF?.Loader?.ensurePlugin?.('dot');
  }

  return state;
}
/** Whether there is a badge to draw. */

function hasBadge(badge) {
  return Boolean(badge?.visible);
}
/** The badge itself: the digits and the dot hidden from assistive technology. */
// The dot is the Framework's one dot (owner decision C185 (8)): an .sf-dot
// stands in every anchored badge after the digits, and the badge sheet shows
// it wherever the badge is a dot -- asked for, or a count on an anchor too
// small for figures --, in the badge's colour and the step's point size; the
// badge keeps the place and the ring that cuts it out.

function renderAnchoredBadge(badge) {
  if (!badge?.visible) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span
        class="sf-badge sf-badge--anchored${badge.dot ? ' sf-badge--dot' : ''}"
        aria-hidden="true"
        title=${badge.phrase || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    >${badge.text}<span class="sf-dot"><span class="sf-dot-item"></span></span></span>`;
}
/** The phrase for a name read from content, out of sight. */

function renderAnchoredBadgeText(badge, after = true) {
  if (!badge?.visible || !badge.phrase) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-badge-anchored-text">${after ? ', ' : ''}${badge.phrase}</span>`;
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "64feefebb417"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   THEME_ICONS: () => (/* binding */ THEME_ICONS),
/* harmony export */   cycleItems: () => (/* binding */ cycleItems),
/* harmony export */   cycleState: () => (/* binding */ cycleState),
/* harmony export */   hasCycle: () => (/* binding */ hasCycle),
/* harmony export */   loaderOwnsTheme: () => (/* binding */ loaderOwnsTheme),
/* harmony export */   nextTheme: () => (/* binding */ nextTheme),
/* harmony export */   parseCycle: () => (/* binding */ parseCycle),
/* harmony export */   preloadControlIcons: () => (/* binding */ preloadControlIcons),
/* harmony export */   preloadSwitchIcons: () => (/* binding */ preloadSwitchIcons),
/* harmony export */   pressCycle: () => (/* binding */ pressCycle),
/* harmony export */   switchIconEntries: () => (/* binding */ switchIconEntries),
/* harmony export */   themeCycleFollow: () => (/* binding */ themeCycleFollow),
/* harmony export */   themeCycleValues: () => (/* binding */ themeCycleValues),
/* harmony export */   themePreference: () => (/* binding */ themePreference),
/* harmony export */   visibleTheme: () => (/* binding */ visibleTheme),
/* harmony export */   warnCycleToggle: () => (/* binding */ warnCycleToggle),
/* harmony export */   warnThemeNotOwned: () => (/* binding */ warnThemeNotOwned)
/* harmony export */ });
// One button, several values (docs review R039, owner decision D11d;
// research ui-control control/research/2026-11-08-cycle-button.md).
//
// sf-button and sf-button-icon share this: the `cycle` setting is a list of
// items shaped like sf-segmented's items ({value, label, icon} and an
// optional `pressed`, which draws the item with the pressed look), `value`
// is the current item, and a press moves to the next item and wraps. The
// `theme-cycle` setting draws a ready theme switch over SF.Loader's theme
// (the same contract as sf-segmented's theme-switch: themePreference,
// setTheme, sf-theme-change).
//
// The name and the icon say the current value («Тема: тёмная»), the tooltip
// says the current and the next («Тема: тёмная. Нажмите — как в системе»),
// and a polite live region says the new value after a press. A cycle is a
// plain button: it carries no aria-pressed, so pressed, label-pressed and
// text-pressed are ignored beside it (with one console warning).
const THEME_VALUES = ['system', 'light', 'dark']; // «Как в системе» in a cycle is the half-dark, half-light circle (D11d): a
// monitor alone does not say a theme.

const THEME_ICONS = Object.freeze({
  system: 'contrast',
  light: 'light_mode',
  dark: 'dark_mode'
});

function parseList(source) {
  if (Array.isArray(source)) return source;
  const text = String(source ?? '').trim();
  if (!text) return [];

  if (text.startsWith('[')) {
    try {
      const parsed = JSON.parse(text);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  } // value::label::flags|… as sf-segmented's items take it; a flag icon=<name>
  // names the icon, pressed draws the pressed look.


  return text.split('|').map(entry => {
    const [value, label = value, flags = ''] = entry.split('::');
    const list = flags.split(',').map(flag => flag.trim()).filter(Boolean);
    const icon = list.find(flag => flag.startsWith('icon='));
    return {
      value: value.trim(),
      label: label.trim(),
      icon: icon ? icon.slice(5) : '',
      pressed: list.includes('pressed')
    };
  });
}
/** The cycle's items, normalised: a value each, once, in the given order. */

/** Reads the attribute's JSON or value::label::flags form; a list stays a list. */


function parseCycle(value) {
  return parseList(value);
}
function cycleItems(source) {
  const seen = new Set();
  return parseList(source).map((item, index) => {
    const one = typeof item === 'string' ? {
      value: item,
      label: item
    } : item;
    if (!one || typeof one !== 'object') return null;
    const value = String(one.value ?? one.id ?? index).trim();
    if (!value || seen.has(value)) return null;
    seen.add(value);
    return {
      value,
      label: String(one.label ?? one.text ?? value),
      icon: String(one.icon || ''),
      lang: String(one.lang || '').trim(),
      pressed: Boolean(one.pressed)
    };
  }).filter(Boolean);
}
/** The themes a theme-cycle offers: all three, or the two it names. */

function themeCycleValues(attribute) {
  const named = String(attribute ?? '').trim().toLowerCase().split(/[\s,]+/u).map(word => word === 'auto' ? 'system' : word).filter(word => THEME_VALUES.includes(word));
  const unique = [...new Set(named)]; // Two themes without «as the system» flip the visible theme; anything else
  // (empty, one word, all three) is the full cycle.

  if (unique.length === 2 && !unique.includes('system')) return ['light', 'dark'];
  return THEME_VALUES;
}

const opposite = theme => theme === 'dark' ? 'light' : 'dark';

function loader() {
  return globalThis.SF?.Loader;
}
/**
 * False when the page's host draws the theme itself and started the Loader
 * with `theme: false` (SF_BOOT_CONFIG.theme): the Loader then neither reads
 * nor sets a theme, and its `theme` stays at the value it began with.
 */


function loaderOwnsTheme() {
  return loader()?.themeEnabled !== false;
}
/**
 * The theme drawn now (light or dark), whatever the preference. The Loader's
 * own value counts only while the Loader owns the theme; under a host that
 * owns it (R076: a Docara example frame) the document says what is drawn.
 */

function visibleTheme() {
  const theme = loaderOwnsTheme() ? loader()?.theme : undefined;
  if (theme === 'dark' || theme === 'light') return theme;
  const root = globalThis.document?.documentElement;
  if (root?.classList?.contains('theme-dark')) return 'dark';
  if (root?.classList?.contains('theme-light')) return 'light';
  return globalThis.matchMedia?.('(prefers-color-scheme: dark)')?.matches ? 'dark' : 'light';
}
/** What the person chose: system, light or dark. */

function themePreference() {
  const preference = loader()?.themePreference;
  return THEME_VALUES.includes(preference) ? preference : 'system';
}
/**
 * The owner's order (D11d): first the theme opposite to the visible one,
 * then the other, then «as the system». It needs the value before the
 * current one: from an explicit theme reached from the other explicit theme
 * the next is system; from system, or from a theme the page loaded with, the
 * opposite theme. Two themes: always the opposite of the visible theme.
 */

function nextTheme({
  values,
  current,
  previous
}) {
  if (!values.includes('system')) return opposite(visibleTheme());
  if (current === 'system') return opposite(visibleTheme());
  if (previous && previous !== 'system' && previous === opposite(current)) return 'system';
  return opposite(current);
}
/**
 * The cycle state the template reads: {items, item, next, index, name,
 * tooltip}. `words(key, vars)` gives the element's words; `base` is the
 * button's own name (aria-label, or the text of an sf-button).
 */

function hasCycle(host) {
  if (host.hasAttribute('theme-cycle')) return true;
  const own = host.getProp?.('cycle');
  return Boolean(host.hasAttribute('cycle') || Array.isArray(own) && own.length);
}
function cycleState(host, {
  base = '',
  words
}) {
  if (host.hasAttribute('theme-cycle')) {
    const values = themeCycleValues(host.getAttribute('theme-cycle'));
    const two = !values.includes('system');
    const current = two ? visibleTheme() : themePreference();

    const label = value => words(`theme-${value}`);

    const items = values.map(value => ({
      value,
      label: label(value),
      icon: THEME_ICONS[value],
      lang: '',
      pressed: false
    }));
    const item = items.find(one => one.value === current) ?? items[0];
    const nextValue = nextTheme({
      values,
      current: item.value,
      previous: host.__sfCyclePrevious
    });
    const next = items.find(one => one.value === nextValue) ?? items[0];
    const title = base || words('theme');
    const now = item.value === 'system' ? words('theme-system-now', {
      vars: {
        theme: label(visibleTheme())
      }
    }) : item.label;
    const name = `${title}: ${now}`;
    return {
      theme: true,
      items,
      item,
      next,
      name,
      tooltip: words('cycle-next', {
        vars: {
          name,
          next: next.label
        }
      })
    };
  }

  const items = cycleItems(host.getProp?.('cycle') ?? host.getAttribute('cycle'));
  if (!items.length) return null;
  const at = Math.max(0, items.findIndex(one => one.value === (host.getAttribute('value') ?? '')));
  const item = items[at];
  const next = items[(at + 1) % items.length];
  const name = base ? `${base}: ${item.label}` : item.label;
  return {
    theme: false,
    items,
    item,
    next,
    name,
    tooltip: words('cycle-next', {
      vars: {
        name,
        next: next.label
      }
    })
  };
}
/** A cycle beside a toggle's settings: the toggle's are ignored, said once. */

function warnCycleToggle(host, names) {
  const given = names.filter(name => host.hasAttribute(name));
  if (!given.length || host.__sfCycleWarned) return;
  host.__sfCycleWarned = true;
  globalThis.console?.warn?.(`[SIMAI Framework] ${host.localName}: cycle and theme-cycle are not toggles; ${given.join(', ')} ignored.`);
}
/**
 * A theme cycle whose press cannot move the theme says why, once per
 * element (R076): a host that owns the theme (the Loader started with
 * `theme: false`), or no Loader at all. The button stays where it is and
 * sends no change.
 */

function warnThemeNotOwned(host) {
  if (host.__sfThemeWarned) return;
  host.__sfThemeWarned = true;
  const reason = loader() ? 'the page\'s theme belongs to its host (the Loader runs with theme: false); a host that hands the theme to the Loader makes it work (a Docara example: theme_switch=true)' : 'SF.Loader is absent';
  globalThis.console?.warn?.(`[SIMAI Framework] ${host.localName} theme-cycle: the press changes nothing: ${reason}.`);
}
/**
 * A person's press of a cycle: the next value, the change event and the
 * announcement. Answers true when it moved.
 */

function pressCycle(host, state) {
  if (!state) return false;
  const previous = state.item.value;
  const value = state.next.value; // Said after the drawing that follows: the flag first, as the drawing may
  // come at once.

  const before = host.__sfCyclePrevious;
  host.__sfCycleAnnounce = true;
  host.__sfCyclePrevious = previous;

  if (state.theme) {
    // The Loader moves the page first, so a listener of change finds the
    // page in the theme it chose; a Loader that cannot (absent, or the
    // theme switched off) leaves the cycle where it is.
    host.__sfCycleExpect = value;

    if (loader()?.setTheme?.(value) !== true) {
      warnThemeNotOwned(host);
      host.__sfCycleAnnounce = false;
      host.__sfCyclePrevious = before;
      host.__sfCycleExpect = undefined;
      return false;
    }
  } else {
    host.setAttribute('value', value);
  }

  host.requestComponentUpdate?.('value');
  const item = state.items.find(one => one.value === value) ?? null;
  host.sfEmit('change', {
    previous,
    value,
    item: item ? { ...item
    } : null
  });
  return true;
}
/**
 * sf-theme-change for a theme cycle: a theme set elsewhere (another switch,
 * SF.Loader.setTheme) starts the order afresh from what is shown.
 */

function themeCycleFollow(host) {
  if (!host.hasAttribute('theme-cycle')) return;
  const values = themeCycleValues(host.getAttribute('theme-cycle'));
  const now = values.includes('system') ? themePreference() : visibleTheme();
  if (host.__sfCycleExpect !== now) host.__sfCyclePrevious = undefined;
  host.__sfCycleExpect = undefined;
  host.requestComponentUpdate?.('theme-cycle');
} // The icons a control can switch to, asked for before it switches (R074).
// Only the icon on screen was tracked, so the first press that showed another
// one asked the subset service for a grown font on the click, and the new
// icon stayed blank while the service built it (up to ~30 s when it was busy).
// Asked for when the control is drawn, the names join the page's first icon
// request (held until the Loader is ready); a control added later costs one
// grown font off the click.

/**
 * The icon entries ({icon, filled}) a cycle, a theme cycle or a toggle can
 * show. `icons` are a toggle's own icon names: with `pressed` present they
 * are drawn filled while on, so both forms are asked for. `filled` is the
 * control's own filled setting (every form filled).
 */

function switchIconEntries(host, {
  icons = [],
  filled = false
} = {}) {
  const entries = [];

  const add = (icon, fill) => {
    const name = String(icon || '').trim();
    if (name) entries.push({
      icon: name,
      filled: Boolean(fill || filled)
    });
  };

  if (host.hasAttribute('theme-cycle')) {
    themeCycleValues(host.getAttribute('theme-cycle')).forEach(value => add(THEME_ICONS[value], false));
  } else if (hasCycle(host)) {
    cycleItems(host.getProp?.('cycle') ?? host.getAttribute('cycle')).forEach(item => add(item.icon, item.pressed));
  } else if (host.hasAttribute('pressed')) {
    icons.forEach(icon => {
      add(icon, false);
      add(icon, true);
    });
  }

  const seen = new Set();
  return entries.filter(entry => {
    const key = `${entry.icon}|${entry.filled}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
/**
 * Asks the Loader for these icon entries once per distinct list (a render
 * that draws the same items asks nothing). Answers the number of new names.
 */

function preloadControlIcons(host, entries) {
  if (!Array.isArray(entries) || !entries.length) return 0;
  const key = JSON.stringify(entries);
  if (host.__sfPreloadedIcons === key) return 0;
  const preload = loader()?.preloadIcons;
  if (typeof preload !== 'function') return 0;
  host.__sfPreloadedIcons = key;
  return preload.call(loader(), entries) || 0;
}
/** switchIconEntries, asked for. */

function preloadSwitchIcons(host, options = {}) {
  return preloadControlIcons(host, switchIconEntries(host, options));
}

/***/ },

/***/ "cbce4a5232a6"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getInitials: () => (/* binding */ getInitials),
/* harmony export */   normalizeInitialsWords: () => (/* binding */ normalizeInitialsWords)
/* harmony export */ });
// c282-allow-start: input parsing (initials read from Russian names, C152)
const INITIALS_SKIP_WORDS = new Set(["а", "без", "в", "во", "для", "до", "за", "из", "из-за", "из-под", "и", "к", "ко", "между", "на", "над", "о", "об", "от", "по", "под", "при", "про", "с", "со", "у", "через", "the", "a", "an", "and", "for", "from", "in", "of", "on", "to"]); // Words a name carries that are not the person's or the organisation's own
// (owner decision C152 (3), 2026-11-14): legal forms (ООО «Ромашка» → Р),
// titles (Dr. John Smith → JS) and name particles (Мария фон Штейн → МШ) are
// skipped wherever they stand. Compared without case and without the dots
// around them (normalizeInitialsWords strips those).

const INITIALS_SERVICE_WORDS = new Set([// legal forms
"ооо", "оао", "зао", "пао", "ао", "нао", "ип", "нко", "ано", "гуп", "муп", "фгуп", "гбу", "мбу", "чоп", "llc", "inc", "ltd", "gmbh", "ag", "corp", "co", "llp", "plc", "lp", "bv", "oy", "ab", "srl", "sarl", // titles
"dr", "prof", "mr", "mrs", "ms", "mx", "miss", "sir", "jr", "sr", "phd", "д-р", "проф", "акад", "г-н", "г-жа", "доц", // particles
"фон", "ван", "дер", "де", "ди", "да", "дю", "ла", "ле", "ибн", "бен", "оглы", "кызы", "von", "van", "der", "den", "de", "di", "da", "du", "del", "della", "la", "le", "ten", "ter", "bin", "ibn"]); // c282-allow-end

function normalizeInitialsWords(value = "") {
  return String(value || "").trim().split(/[\s/|]+/).map(word => word.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "")).filter(Boolean);
} // The first character a reader sees: a whole grapheme, so a letter written
// with a combining accent («E» + U+0301) or outside the basic plane keeps all
// of its code points. Array.from alone splits surrogate pairs correctly but
// not combining marks; Intl.Segmenter does both where the platform has it.

function firstGrapheme(word) {
  const Segmenter = globalThis.Intl?.Segmenter;

  if (typeof Segmenter === "function") {
    for (const {
      segment
    } of new Segmenter(undefined, {
      granularity: "grapheme"
    }).segment(word)) {
      return segment;
    }

    return "";
  }

  return Array.from(word)[0] || "";
} // The one rule for initials (reuse audit 2026-11-02, finding 10): sf-avatar,
// the context menu, the admin menu and the chat drew them by five rules that
// disagreed on a hyphen, an empty name and a letter outside the basic plane.
//
//   «Анна Смирнова»        → «АС»   the first letters of the first two words
//   «Отдел по работе»      → «ОР»   a preposition after the first word is skipped
//   «Жан-Поль»             → «ЖП»   one hyphenated word reads as its parts
//   «Анна-Мария Смирнова»  → «АС»   ...but a name of several words by its words
//   «Анна»                 → «А»
//   «ООО «Ромашка»»        → «Р»    legal forms, titles, particles skipped (C152)
//   «Мария фон Штейн»      → «МШ»
//   «Dr. John Smith»       → «JS»
//   «anna@simai.ru»        → «A»    an address: the first letter before «@»
//   «»                     → ''     or `fallback`: '?' where text must stand
//
// `maxLetters` caps the letters (two), `skipWords` replaces the skipped words,
// `locale` capitalises by a locale's rule.


function getInitials(value = "", options = {}) {
  const {
    maxLetters = 2,
    skipWords = INITIALS_SKIP_WORDS,
    fallback = "",
    locale
  } = options;
  let source = String(value ?? "").trim(); // An address reads by the name before «@»: one letter (C152 (3)),
  // anna@simai.ru → A, not the letters of its parts.

  if (/^[^\s@]+@[^\s@]+$/u.test(source)) {
    const local = normalizeInitialsWords(source.slice(0, source.indexOf("@")).replace(/[._+-]+/gu, " "));
    if (!local.length) return String(fallback);
    const letter = firstGrapheme(local[0]);
    return (locale ? letter.toLocaleUpperCase(locale) : letter.toUpperCase()) || String(fallback);
  }

  const allWords = normalizeInitialsWords(source); // Legal forms, titles and particles go first; a name made of them alone
  // keeps them, so it still has initials.

  const ownWords = allWords.filter(word => !INITIALS_SERVICE_WORDS.has(String(word).toLowerCase()));
  const words = ownWords.length ? ownWords : allWords;
  let significantWords = words.filter((word, index) => index === 0 || !skipWords.has(String(word).toLowerCase())); // One word written with a hyphen or a dash is a compound name: its parts
  // are its words. Split before the skip list, «из-за» would be two words.

  if (significantWords.length === 1) {
    const parts = significantWords[0].split(/[-\u2010-\u2015]+/u).filter(Boolean);
    if (parts.length > 1) significantWords = parts;
  }

  if (!significantWords.length) {
    return String(fallback);
  }

  const letters = significantWords.length > 1 ? significantWords.slice(0, Math.max(1, maxLetters)).map(firstGrapheme).join("") : firstGrapheme(significantWords[0]);
  return (locale ? letters.toLocaleUpperCase(locale) : letters.toUpperCase()) || String(fallback);
}

/***/ },

/***/ "d3818183b14c"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("deprecations", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("deprecations", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "5b7d7695b41b"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("element-manifest", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("element-manifest", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "9d9903b87148"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit/directives/keyed.js", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("lit/directives/keyed.js", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "2a080a730149"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("lit", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "43090d1c8307"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("page-language", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("page-language", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "deb1a4d61565"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("smart-base", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("smart-base", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "4c90c9c3f57e"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   files: () => (/* binding */ files)
/* harmony export */ });
/* harmony import */ var _en_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("7f9642eacf1b");
// Written by scripts/build-language-packs.mjs from src/core/lang/built-in.json
// (owner decision C282); do not edit. The words this bundle carries: the
// built-in languages' (en); every other language comes from
// a language file (core/lang/<code>.js or its parts).


const files = { en: { runtime: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime } };

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ en: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime });


/***/ },

/***/ "a6b3ed0c1589"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AVATAR_HUES: () => (/* binding */ AVATAR_HUES),
/* harmony export */   AVATAR_TONES: () => (/* binding */ AVATAR_TONES),
/* harmony export */   STATIC_HUES: () => (/* binding */ STATIC_HUES),
/* harmony export */   TONE_HUES: () => (/* binding */ TONE_HUES),
/* harmony export */   avatarHue: () => (/* binding */ avatarHue),
/* harmony export */   avatarTone: () => (/* binding */ avatarTone),
/* harmony export */   avatarToneHash: () => (/* binding */ avatarToneHash),
/* harmony export */   resolveAvatarHue: () => (/* binding */ resolveAvatarHue),
/* harmony export */   resolveAvatarTone: () => (/* binding */ resolveAvatarTone)
/* harmony export */ });
// sf-avatar's hue from a name, without a document: a plain function of its
// argument, so tests/avatar-tones.contract.test.mjs runs it in Node and a server
// can print the same class in the first paint. docs/docs.md gives the algorithm
// for a server in another language.
//
// Owner decision C17 (2026-11-08): avatars have no colours of their own. The
// initials take a hue of the static palette (the hue setting, the class
// sf-hue-<name>); the eight tones of initials are gone, and `auto` picks among
// eight static hues in the old order, so a name keeps its slot: rose is pink,
// the former violet (HCT hue 325) is purple, the other six keep their names.
// A former tone moves at most 15 degrees (dispatcher, 2026-11-09).
//
// FNV-1a, 32 bits, over the UTF-8 bytes of the string exactly as given (no
// trimming, no case folding, no normalisation), its high half folded onto the
// low one, because the low bits of FNV-1a alone follow the low bits of the
// input; the remainder by the length of the list picks the tone.
//
// The list and its order are part of the algorithm: a name keeps its tone only
// while they stay. A later named tone does not join `auto`.
const AVATAR_HUES = Object.freeze(['pink', 'amber', 'lime', 'green', 'teal', 'sky', 'indigo', 'purple']);

// Every hue a setting may name: the static palette (theme-palette.js
// STATIC_HUES, tests/avatar-tones.contract.test.mjs holds the two equal).
const STATIC_HUES = Object.freeze(['red', 'orange', 'amber', 'yellow', 'lime', 'green', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'pink', 'brown', 'gray']);

// The former tone setting and its names, until 2027-01-01 (journal
// attribute-c17-avatar-tone-to-hue, value-c17-avatar-rose-to-pink, which
// also carries violet to purple).
const AVATAR_TONES = Object.freeze(['rose', 'amber', 'lime', 'green', 'teal', 'sky', 'indigo', 'violet']);
const TONE_HUES = Object.freeze({rose: 'pink', violet: 'purple'});

const FNV_OFFSET = 0x811c9dc5;
const FNV_PRIME = 0x01000193;

function avatarToneHash(name) {
  let hash = FNV_OFFSET;
  for (const byte of new TextEncoder().encode(String(name))) {
    hash = Math.imul(hash ^ byte, FNV_PRIME) >>> 0;
  }
  return (hash ^ (hash >>> 16)) >>> 0;
}

// No name, no hue: the neutral look.
function avatarHue(name) {
  const text = name === undefined || name === null ? '' : String(name);
  return text ? AVATAR_HUES[avatarToneHash(text) % AVATAR_HUES.length] : '';
}

// The hue a setting asks for: a named one as it is, auto the one of the name,
// empty (or a name the palette does not have) the neutral look. The former
// tone setting is read when hue is empty, its rose as pink and its violet as purple.
function resolveAvatarHue(hue, name, tone = '') {
  const setting = hue || TONE_HUES[tone] || tone || '';
  if (setting === 'auto') return avatarHue(name);
  return STATIC_HUES.includes(setting) ? setting : '';
}

// The former names (2027-01-01): the tone of a name in the old words.
function avatarTone(name) {
  const text = name === undefined || name === null ? '' : String(name);
  return text ? AVATAR_TONES[avatarToneHash(text) % AVATAR_TONES.length] : '';
}

function resolveAvatarTone(setting, name) {
  return setting === 'auto' ? avatarTone(name) : setting || '';
}


/***/ },

/***/ "93adbb2e2934"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   files: () => (/* binding */ files)
/* harmony export */ });
/* harmony import */ var _en_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("7ebc02c41719");
// Written by scripts/build-language-packs.mjs from src/core/lang/built-in.json
// (owner decision C282); do not edit. The words this bundle carries: the
// built-in languages' (en); every other language comes from
// a language file (core/lang/<code>.js or its parts).


const files = { en: { runtime: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime } };

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ en: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime });


/***/ },

/***/ "7f9642eacf1b"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"runtime":{"count":{"one":"{count} unread","other":"{count} unread"},"dot":"new"}}');

/***/ },

/***/ "f2cb53b98f17"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-avatar for the shim (stands/18-aliases-ci/alias.mjs, standard §16 item 20). mode: same-detail (the shim sends the new and the old name), split / detail-adds (a detail adapter, refused by the shim), attribute-and-property, method, property, manifest-only (the DOM name does not change), host-attribute (no shim), retired.","component":"sf-avatar","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"aria-label","to":null,"kind":"attribute","component":"sf-avatar","since":"2026-10-27","remove_after":"2026-12-01","mode":"host-attribute","section":"§3.1","note":"stays a host attribute, read by the base (§3.1, §4.8); no shim"},{"from":"title","to":"heading","kind":"setting","component":"sf-avatar","since":"2026-10-27","remove_after":"2026-12-01","section":"§3.1, §16 item 26","note":"title is a property of every element (§3.1); the shim maps the attribute, the browser keeps its title property"}]}');

/***/ },

/***/ "488a9707ea64"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.avatar","tag":"sf-avatar","version":"1.8.5","kind":"leaf","settings":{"size":{"type":"enum","values":["1/4","1/3","1/2","1","2","3"],"default":"1"},"line":{"type":"enum","values":["","1/2","1","2"],"default":""},"shape":{"type":"enum","values":["circle","square"],"default":"circle"},"href":{"type":"string","default":""},"image-url":{"type":"string","default":""},"image-alt":{"type":"string","default":""},"no-wrap":{"type":"boolean","default":false},"text":{"type":"string","default":""},"icon":{"type":"icon","default":""},"hue":{"type":"enum","values":["","auto","red","orange","amber","yellow","lime","green","teal","cyan","sky","blue","indigo","violet","purple","pink","brown","gray"],"default":""},"expressive":{"type":"boolean","default":false},"tone":{"type":"enum","values":["","auto","rose","amber","lime","green","teal","sky","indigo","violet"],"default":""},"status":{"type":"enum","values":["none","online","away","offline","company","verified"],"default":"none"},"heading":{"type":"string","default":""},"description":{"type":"string","default":""},"meta":{"type":"string","default":""},"meta-icon":{"type":"icon","default":""},"card-variant":{"type":"enum","values":["square","portrait"],"default":"square"},"disabled":{"type":"boolean","default":false},"badge-count":{"type":"string","default":""},"badge-dot":{"type":"boolean","default":false},"badge-cap":{"type":"number","integer":true,"min":1,"default":99},"badge-label":{"type":"string","default":""}},"values":{},"events":{},"actions":{},"css-variables":{"--sf-avatar-background-color":{"type":"color","state":"default"},"--sf-avatar-color":{"type":"color","state":"default"},"--sf-avatar-border-color":{"type":"color","state":"default"},"--sf-avatar-border-width":{"type":"length","state":"default"},"--sf-avatar-radius":{"type":"length","state":"default"},"--sf-avatar-offline-background-color":{"type":"color","state":"default"},"--sf-avatar-offline-overlay":{"type":"image","state":"default"}}}');

/***/ },

/***/ "7ebc02c41719"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Avatar","runtime":{"aria-label":"Avatar","status-online":"online","status-away":"away","status-offline":"offline"}}');

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