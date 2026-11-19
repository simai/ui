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

/***/ "4feefdc0baef"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("7a5bfad2e591");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("6cbc1a3bd7e5");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("920b6920c2b6");
/* harmony import */ var _lang_index_mjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("9d93f45ce9cf");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_2__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);





 // Only the words on screen ship in the bundle, English only (owner decision
// C282): Russian and every other language come from a language file. The
// title, settings and events stay in the language files for the Studio and the
// docs (localization study LC-2).
// No sheet import: the rule has no css, so a sheet in this bundle never
// reached a page; the avatars class sheet comes by the rule's relation
// (audit 2026-11-11, dead Smart sheets).
// sf-avatar-group from its component.json (standard simai.smart-component 1.3.8 §3,
// §4): the settings are the attributes and properties
// core/js/element-manifest.js makes from the manifest. Each also falls back
// to its field in the JSON text of fields (data until 2026-12-01: data is a
// reserved name, §3.1) or, for the sizes, of property; the getters below say
// that.

const AvatarsElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_3__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: _lang_index_mjs__WEBPACK_IMPORTED_MODULE_5__.files,
  source: 'ru',
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_4__
}); // The tooltips' ids, one per element on the page (stable across renders).

let sequence = 0;

class SfAvatars extends AvatarsElement {
  static get props() {
    return { ...super.props,
      templateName: {
        attribute: 'template',
        default: 'default'
      },
      // The list also arrives as JSON text in the attribute, as it always did.
      avatars: {
        type: Array,
        default: [],
        attribute: 'avatars'
      }
    };
  }

  get templateName() {
    return this.getAttribute('template') || 'default';
  }

  get dataValue() {
    return (0,_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__.parseJsonAttribute)(this, 'fields', {});
  }

  get propertyValue() {
    return (0,_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__.parseJsonAttribute)(this, 'property', {});
  }

  get imageUrl() {
    return this.getAttribute('image-url') || this.dataValue.imageUrl || this.dataValue.image_url || '';
  }

  set imageUrl(value) {
    super.imageUrl = value;
  }

  get avatarUrl() {
    return this.getAttribute('avatar-url') || this.dataValue.avatarUrl || this.dataValue.avatar_url || this.imageUrl;
  }

  set avatarUrl(value) {
    super.avatarUrl = value;
  }

  get avatarSize() {
    return this.getAttribute('avatar-size') || this.dataValue.avatarSize || this.dataValue.avatar_size || this.roundSize;
  }

  set avatarSize(value) {
    super.avatarSize = value;
  }

  get active() {
    return this.hasAttribute('active') ? this.getBooleanAttr('active', true) : (0,_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__.toBoolean)(this.dataValue.active, false);
  }

  set active(value) {
    super.active = value;
  }

  get check() {
    return this.hasAttribute('check') ? this.getBooleanAttr('check', true) : (0,_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__.toBoolean)(this.dataValue.check, false);
  }

  set check(value) {
    super.check = value;
  }

  get name() {
    return this.getAttribute('name') || this.dataValue.name || '';
  }

  set name(value) {
    super.name = value;
  }

  get source() {
    return this.getAttribute('source') || this.dataValue.source || '';
  }

  set source(value) {
    super.source = value;
  }

  get labelText() {
    return this.getAttribute('label-text') || this.dataValue.labelText || this.dataValue.label_text || '';
  }

  set labelText(value) {
    super.labelText = value;
  }

  get labelSecondText() {
    return this.getAttribute('label-second-text') || this.dataValue.labelSecondText || this.dataValue.label_second_text || '';
  }

  set labelSecondText(value) {
    super.labelSecondText = value;
  }

  get avatars() {
    const attrValue = this.getAttribute('avatars');

    if (attrValue) {
      try {
        return JSON.parse(attrValue);
      } catch (error) {
        console.warn('sf-avatar-group: invalid avatars JSON', error);
      }
    }

    const own = super.avatars;
    if (Array.isArray(own) && own.length) return own;
    return Array.isArray(this.dataValue.avatars) ? this.dataValue.avatars : [];
  }

  set avatars(value) {
    super.avatars = value;
  }

  get avatarsMore() {
    return this.getAttribute('avatars-more') || this.dataValue.avatarsMore || this.dataValue.avatars_more || '';
  }

  set avatarsMore(value) {
    super.avatarsMore = value;
  }

  get roundSize() {
    return this.getAttribute('round-size') || this.propertyValue.round_size || this.propertyValue.roundSize || '';
  }

  set roundSize(value) {
    super.roundSize = value;
  }

  get labelSize() {
    return this.getAttribute('label-size') || this.propertyValue.label_size || this.propertyValue.labelSize || '';
  }

  set labelSize(value) {
    super.labelSize = value;
  }

  get profileSize() {
    return this.getAttribute('profile-size') || this.propertyValue.profile_size || this.propertyValue.profileSize || '';
  }

  set profileSize(value) {
    super.profileSize = value;
  }

  get rootClass() {
    return this.getAttribute('root-class') || '';
  }

  templateContext() {
    const props = this.getPropsContext();
    if (!this._uid) this._uid = `sf-avatar-group-${++sequence}`;
    return this.createTemplateContext({ ...props,
      component: this,
      uid: this._uid,
      // The group's name and the «+N» button's (C152 (6)), in the page's
      // language: «Участники: 9», «Ещё 5 участников».
      words: {
        group: count => this.sfWord('group-label', {
          count
        }),
        more: count => this.sfWord('more-label', {
          count
        })
      },
      imageUrl: this.imageUrl,
      avatarUrl: this.avatarUrl,
      avatarSize: this.avatarSize,
      active: this.active,
      check: this.check,
      name: this.name,
      source: this.source,
      labelText: this.labelText,
      labelSecondText: this.labelSecondText,
      avatars: this.avatars,
      avatarsMore: this.avatarsMore,
      roundSize: this.roundSize,
      labelSize: this.labelSize,
      profileSize: this.profileSize,
      rootClass: this.rootClass
    });
  }

  hasBuiltInTemplate(templateName = this.templateName) {
    return ['default', 'user', 'group', 'label', 'profile'].includes(templateName);
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_2__.renderAvatarsTemplate)(this.templateContext());
  }

  get value() {
    return this.templateContext();
  }

  set value(nextValue) {
    this.setValueAttributes(nextValue, {
      removeEmptyString: false
    });
  }

}

SfAvatars.define('sf-avatar-group');
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "7a5bfad2e591"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderAvatarsTemplate: () => (/* binding */ renderAvatarsTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var _avatar_js_templates_shared__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("4f7ae7ea9e1c");
/* harmony import */ var _avatar_js_picture__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("c69a3dc158df");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, _avatar_js_templates_shared__WEBPACK_IMPORTED_MODULE_1__, _avatar_js_picture__WEBPACK_IMPORTED_MODULE_2__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, _avatar_js_templates_shared__WEBPACK_IMPORTED_MODULE_1__, _avatar_js_picture__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);


 // The combinations are drawn from the avatar's own parts -- sf-avatar,
// sf-avatar-group, sf-avatar-label-group, the online indicator and the verified
// badge -- the classes the avatars sheet styles. The templates wrote an older
// set (sf-avatar-round, sf-avatar--image, sf-avatar-cir, sf-avatar-check,
// sf-avatar-profile) that no sheet in the release answered: every avatar was
// drawn with no shape and no size. Each avatar was also a button with no name
// and nothing to do; an avatar here is a picture, and the visible text names the
// person.

const SIZES = ['1/4', '1/3', '1/2', '1', '2', '3'];
const SIZE_NAMES = {
  tiny: '1/4',
  extra_small: '1/3',
  extraSmall: '1/3',
  small: '1/2',
  default: '1',
  big: '2',
  extra_big: '3',
  extraBig: '3'
};
const PROFILE_SIZES = {
  small: '2',
  big: '3'
};

function step(value, fallback = '1') {
  const text = String(value ?? '').trim();
  const named = SIZE_NAMES[text] ?? text;
  return SIZES.includes(named) ? named : fallback;
} // How far the avatars of a group overlap is the group sheet's, from the
// avatars' own size (component.avatars 1.11.0, owner decision C152 (6): 4 up
// to size 1, 8 at 2 and 3). The group prints no overlap modifier since 1.5.1;
// the sf-avatar-group--size-* modifiers are dated aliases (journal
// class-avatar-group-overlap-by-size).
// Up to four people are shown; the fifth place is «+N» (C152 (6)).


const SHOWN = 4;

function avatar(options) {
  // sf-avatar's drawing (js/picture.js): the photo over the initials, else
  // the initials, else the glyph.
  const context = (0,_avatar_js_picture__WEBPACK_IMPORTED_MODULE_2__.avatarPictureContext)({
    size: options.size,
    imageUrl: options.imageUrl || '',
    text: options.text || '',
    status: options.status || 'none',
    rootClass: options.rootClass || '',
    component: options.component
  });
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <span class=${(0,_avatar_js_templates_shared__WEBPACK_IMPORTED_MODULE_1__.avatarClasses)(context)} style=${options.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
      ${(0,_avatar_js_templates_shared__WEBPACK_IMPORTED_MODULE_1__.avatarContent)(context)} ${(0,_avatar_js_templates_shared__WEBPACK_IMPORTED_MODULE_1__.statusBadge)(context)}
    </span>
  `;
}

function status(context) {
  if (context.check) return 'verified';
  if (context.active) return 'online';
  return 'none';
}

function renderDefaultTemplate(context) {
  return avatar({
    size: step(context.roundSize || context.avatarSize),
    imageUrl: context.imageUrl,
    status: status(context),
    rootClass: context.rootClass,
    rootStyle: context.rootStyle,
    component: context.component
  });
}

function labelGroup(context, {
  size,
  imageUrl,
  title,
  text,
  icon
}) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div class=${['sf-avatar-label-group', `sf-avatar-label-group--size-${size}`, 'flex', 'items-cross-center', context.rootClass].filter(Boolean).join(' ')} style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
      ${avatar({
    size,
    imageUrl,
    component: context.component
  })}
      <div class="sf-avatar-label-group-container flex flex-col">
        ${title ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-avatar-label-group-title">${title}</div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        ${text ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-avatar-label-group-text">
              ${icon ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class="sf-icon" aria-hidden="true">${icon}</i>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
              <span>${text}</span>
            </div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      </div>
    </div>
  `;
}

function renderUserTemplate(context) {
  return labelGroup(context, {
    size: step(context.avatarSize),
    imageUrl: context.imageUrl,
    title: context.name,
    text: context.source,
    icon: context.source ? 'link' : ''
  });
}

function renderLabelTemplate(context) {
  return labelGroup(context, {
    size: step(context.labelSize || context.avatarSize),
    imageUrl: context.avatarUrl,
    title: context.labelText,
    text: context.labelSecondText
  });
} // One person of the group: the picture (photo over the initials, C152 (2)),
// role img named by the person, the hue of the name (C17, C152 (6)) and the
// name in a tooltip, since a group prints no names (C152 (7)).


function member(item, size, index, context) {
  const name = String(item.name ?? item.heading ?? '').trim();
  const picture = (0,_avatar_js_picture__WEBPACK_IMPORTED_MODULE_2__.avatarPictureContext)({
    size,
    imageUrl: item.imageUrl || item.image_url,
    name,
    text: item.text || item.initials,
    hue: item.hue || (name ? 'auto' : ''),
    status: item.status,
    component: context.component
  });
  const tipId = name && context.uid ? `${context.uid}-tip-${index}` : '';
  const face = (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class=${(0,_avatar_js_templates_shared__WEBPACK_IMPORTED_MODULE_1__.avatarClasses)(picture)} role="img" aria-label=${name || picture.text || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    data-tooltip=${tipId || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>${(0,_avatar_js_templates_shared__WEBPACK_IMPORTED_MODULE_1__.avatarContent)(picture)} ${(0,_avatar_js_templates_shared__WEBPACK_IMPORTED_MODULE_1__.statusBadge)(picture)}</span>`;
  return (0,_avatar_js_templates_shared__WEBPACK_IMPORTED_MODULE_1__.withNameTooltip)(face, name, tipId);
} // The row of the full list behind «+N»: the picture and the printed name.


function listRow(item) {
  const name = String(item.name ?? item.heading ?? '').trim();
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<li class="sf-avatar-group-list-item">${(0,_avatar_js_picture__WEBPACK_IMPORTED_MODULE_2__.avatarPicture)({
    size: '1/2',
    imageUrl: item.imageUrl || item.image_url,
    name,
    text: item.text || item.initials,
    hue: item.hue || (name ? 'auto' : '')
  })}<span class="sf-avatar-group-list-name">${name || item.text || item.initials || ''}</span></li>`;
} // The group (owner decision C152 (6), 2026-11-14): up to four people, the
// fifth place «+N» with the exact number of the others. When the host gives
// the whole list (more than four in avatars) «+N» is a button of the same
// size and shape that opens the list of everyone in an sf-popover; with only
// a number (avatars-more) it stays text. The group is named «Участники: N»,
// N everyone it stands for. Before: every avatar shown, «+N» a grey avatar
// with no action or name, the group nameless.


function renderGroupTemplate(context) {
  const size = step(context.roundSize, '1/2');
  const list = Array.isArray(context.avatars) ? context.avatars : [];
  const more = String(context.avatarsMore ?? '').trim();
  const extra = /^\d+$/u.test(more) ? Number(more) : 0;
  const shown = list.slice(0, SHOWN);
  const hidden = list.length - shown.length + extra;
  const total = list.length + extra;
  const words = context.words || {};
  const groupLabel = words.group ? words.group(total) : '';
  const moreLabel = words.more ? words.more(hidden) : '';
  const withList = list.length > SHOWN;

  if (withList) {
    globalThis.SF?.Loader?.ensurePlugin?.('cl-popover');
  }

  if (shown.some(item => String(item.name ?? item.heading ?? '').trim())) {
    globalThis.SF?.Loader?.ensurePlugin?.('tooltip');
  }

  let tail = lit__WEBPACK_IMPORTED_MODULE_0__.nothing;

  if (withList) {
    const plus = (0,_avatar_js_picture__WEBPACK_IMPORTED_MODULE_2__.avatarPictureContext)({
      size,
      text: `+${hidden}`
    });
    tail = (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-popover class="sf-avatar-group-more" placement="bottom-start" label=${moreLabel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
      <button slot="trigger" type="button" class=${(0,_avatar_js_templates_shared__WEBPACK_IMPORTED_MODULE_1__.avatarClasses)(plus)} aria-label=${moreLabel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>${(0,_avatar_js_templates_shared__WEBPACK_IMPORTED_MODULE_1__.avatarContent)(plus)}</button>
      <div slot="content"><ul class="sf-avatar-group-list">${list.map(item => listRow(item))}</ul></div>
    </sf-popover>`;
  } else if (hidden > 0 || more && !extra) {
    // No list from the host: «+N» (or the host's short text) is text.
    tail = avatar({
      size,
      text: extra ? `+${hidden}` : more,
      component: context.component
    });
  }

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div class=${['sf-avatar-group', 'flex', 'items-cross-center', context.rootClass].filter(Boolean).join(' ')} style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} role="group" aria-label=${groupLabel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
      <div class="sf-avatar-group-avatars flex">
        ${shown.map((item, index) => member(item, size, index, context))}
        ${tail}
      </div>
    </div>
  `;
}

function renderProfileTemplate(context) {
  return avatar({
    size: PROFILE_SIZES[context.profileSize] || step(context.profileSize, '3'),
    imageUrl: context.imageUrl,
    status: 'verified',
    rootClass: context.rootClass,
    rootStyle: context.rootStyle,
    component: context.component
  });
}

function renderAvatarsTemplate(context) {
  switch (context.templateName) {
    case 'user':
      return renderUserTemplate(context);

    case 'group':
      return renderGroupTemplate(context);

    case 'label':
      return renderLabelTemplate(context);

    case 'profile':
      return renderProfileTemplate(context);

    default:
      return renderDefaultTemplate(context);
  }
}
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

/***/ "9d93f45ce9cf"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   files: () => (/* binding */ files)
/* harmony export */ });
/* harmony import */ var _en_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d709c9845088");
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

/***/ "7f9642eacf1b"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"runtime":{"count":{"one":"{count} unread","other":"{count} unread"},"dot":"new"}}');

/***/ },

/***/ "920b6920c2b6"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-avatar-group for the shim (stands/18-aliases-ci/alias.mjs, standard §16 item 20). mode: same-detail (the shim sends the new and the old name), split / detail-adds (a detail adapter, refused by the shim), attribute-and-property, method, property, manifest-only (the DOM name does not change), host-attribute (no shim), retired.","component":"sf-avatar-group","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"data","to":"fields","kind":"setting","component":"sf-avatar-group","since":"2026-10-27","remove_after":"2026-12-01","section":"§3.1","note":"data is a reserved name; the shim maps the attribute and the property"},{"from":"sf-avatars","to":"sf-avatar-group","kind":"tag","component":"sf-avatar-group","since":"2026-11-03","remove_after":"2027-01-01","section":"rename plan R0 (ui-control RENAME-PLAN-2026-11-03), naming decision 2026-11-02","note":"the element is sf-avatar-group; sf-avatars is a subclass defined beside it until the date"}]}');

/***/ },

/***/ "6cbc1a3bd7e5"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.avatar-group","tag":"sf-avatar-group","version":"1.5.3","kind":"leaf","settings":{"fields":{"type":"string","default":""},"property":{"type":"string","default":""},"image-url":{"type":"string","default":""},"avatar-url":{"type":"string","default":""},"avatar-size":{"type":"string","default":""},"check":{"type":"boolean","default":false},"name":{"type":"string","default":""},"source":{"type":"string","default":""},"label-text":{"type":"string","default":""},"label-second-text":{"type":"string","default":""},"avatars":{"type":"list","of":{"image-url":"string","text":"string","name":"string","status":"string","hue":"string"},"default":[]},"avatars-more":{"type":"string","default":""},"round-size":{"type":"string","default":""},"label-size":{"type":"string","default":""},"profile-size":{"type":"string","default":""}},"values":{"active":{"type":"boolean","default":false}},"events":{},"actions":{},"presentation":{"skeleton":{"late":["avatars"]}},"css-variables":{"--sf-avatar-background-color":{"type":"color","state":"default"},"--sf-avatar-color":{"type":"color","state":"default"},"--sf-avatar-border-color":{"type":"color","state":"default"},"--sf-avatar-border-width":{"type":"length","state":"default"},"--sf-avatar-radius":{"type":"length","state":"default"},"--sf-avatar-offline-background-color":{"type":"color","state":"default"},"--sf-avatar-offline-overlay":{"type":"image","state":"default"}}}');

/***/ },

/***/ "d709c9845088"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Avatars","runtime":{"group-label":"Members: {n}","more-label":{"one":"{n} more member","other":"{n} more members"}}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("4feefdc0baef");
/******/
/******/ })()
;