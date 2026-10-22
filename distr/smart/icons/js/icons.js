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

/***/ "c24fff940cd9"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("fbe0570fcc69");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("dc7d6ce8f484");
/* harmony import */ var _helpers_anchored_badge__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("34addf781b5b");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _js_templates_default__WEBPACK_IMPORTED_MODULE_1__, _helpers_anchored_badge__WEBPACK_IMPORTED_MODULE_2__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _js_templates_default__WEBPACK_IMPORTED_MODULE_1__, _helpers_anchored_badge__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);



const weightClasses = new Map([[100, "thin"], [200, "extra-light"], [300, "light"], [400, "regular"], [500, "medium"], [600, "semi-bold"], [700, "bold"]]);
const iconTypes = ["outlined", "rounded", "sharp"];
const iconSizes = ["1/4", "1/3", "1/2", "1", "2", "3", "4", "5", "6", "7"];

function clampAxis(value, fallback, minimum, maximum) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return fallback;
  return Math.min(maximum, Math.max(minimum, numericValue));
}

class SfIcon extends (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()) {
  static clearLightDomBeforeFirstRender = true;

  constructor() {
    super();

    this.onIconSubsetReady = event => {
      const icon = this.getProp("icon");
      const icons = event.detail?.icons || [];
      const hasIcon = icons instanceof Set ? icons.has(icon) : Array.isArray(icons) && icons.includes(icon); // The local full font (icons.enabled = false) draws every icon at once.

      if (icon && !hasIcon && !event.detail?.all) return;
      this.syncLoadedState();
    };
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("sf-icons-subset:ready", this.onIconSubsetReady);
    this.requestIconLoad();
    this.syncLoadedState();
  }

  disconnectedCallback() {
    window.removeEventListener("sf-icons-subset:ready", this.onIconSubsetReady);
    super.disconnectedCallback();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);

    if (["icon", "filled", "weight", "grade", "optical-size", "type"].includes(name) && oldValue !== newValue) {
      window.addEventListener("sf-icons-subset:ready", this.onIconSubsetReady);
      this.requestIconLoad();
      this.syncLoadedState();
    }
  }

  requestIconLoad() {
    const loader = window.SF?.Loader;
    const iconCount = loader?.trackIconElement?.(this) || 0;

    if (iconCount > 0) {
      loader.mutate?.(() => loader.loadFonts?.());
    }
  }

  syncLoadedState() {
    const loader = window.SF?.Loader;
    const tracked = loader?.getTrackedIconAttrs?.(this) || null;
    const loaded = Boolean(tracked?.icon && loader?.isTrackedIconLoaded?.(tracked));

    if (loaded) {
      window.removeEventListener("sf-icons-subset:ready", this.onIconSubsetReady);
    } else {
      window.addEventListener("sf-icons-subset:ready", this.onIconSubsetReady);
    }

    if (this.getProp("loaded") === loaded) return;
    this.setState({
      loaded
    });
  }

  static get props() {
    return {
      icon: "",
      loaded: {
        type: Boolean,
        default: false
      },
      filled: {
        type: Boolean,
        default: false
      },
      weight: {
        type: Number,
        default: 400
      },
      size: {
        type: String,
        default: ""
      },
      type: {
        type: String,
        default: ""
      },
      grade: {
        type: Number,
        default: 0
      },
      opticalSize: {
        type: Number,
        default: 24
      },
      label: {
        type: String,
        default: ""
      },
      // A count or a dot on the icon (simai/ui-source#12).
      badgeCount: {
        type: String,
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
        type: String,
        default: ""
      }
    };
  }

  static get observedAttributes() {
    return Array.from(new Set([...super.observedAttributes, "icon", "size", "weight", "filled", "loaded", "type", "grade", "optical-size", "label", "badge-count", "badge-dot", "badge-cap", "badge-label"]));
  }

  get weightClass() {
    let weight = this.getProp("weight");
    weight = this.toNumber(weight, 400);
    return weightClasses.get(weight) || weightClasses.get(400);
  }

  get iconType() {
    const requestedType = String(this.getProp("type") || "").trim().toLowerCase();
    const type = requestedType || window.SF?.Loader?.getDefaultIconType?.() || window.SF_BOOT_CONFIG?.icons?.type || window.SF_ICON_TYPE || "outlined";
    const normalizedType = type === "shape" ? "sharp" : type;
    return iconTypes.includes(normalizedType) ? normalizedType : "outlined";
  }

  get iconSize() {
    const size = String(this.getProp("size") || "").trim();
    return iconSizes.includes(size) ? size : "";
  }

  get iconGrade() {
    return clampAxis(this.getProp("grade"), 0, -50, 200);
  }

  get iconOpticalSize() {
    return clampAxis(this.getProp("opticalSize"), 24, 20, 48);
  }

  get templateData() {
    return {
      icon: this.getProp("icon"),
      loaded: this.getProp("loaded"),
      filled: this.getProp("filled"),
      rounded: this.iconType === "rounded",
      sharp: this.iconType === "sharp",
      weightClass: this.weightClass,
      size: this.iconSize,
      grade: this.iconGrade,
      opticalSize: this.iconOpticalSize,
      label: String(this.getProp("label") || "").trim(),
      badge: (0,_helpers_anchored_badge__WEBPACK_IMPORTED_MODULE_2__.elementBadge)(this)
    };
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_1__.renderIconTemplate)({ ...this.templateContext(),
      ...this.templateData
    });
  }

}

SfIcon.define("sf-icon");
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "dc7d6ce8f484"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderIconTemplate: () => (/* binding */ renderIconTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ddf1cdb42ecc");
/* harmony import */ var _component_badges_js_anchored_state__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("7cd0e63a3ed6");
/* harmony import */ var _helpers_anchored_badge__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("34addf781b5b");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, _component_badges_js_anchored_state__WEBPACK_IMPORTED_MODULE_1__, _helpers_anchored_badge__WEBPACK_IMPORTED_MODULE_2__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, _component_badges_js_anchored_state__WEBPACK_IMPORTED_MODULE_1__, _helpers_anchored_badge__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);




function getIconData(context) {
  const {
    icon,
    size,
    filled,
    rounded,
    sharp,
    weightClass,
    loaded,
    rootClass,
    rootStyle,
    grade,
    opticalSize,
    label
  } = context;
  const className = ["sf-icon", size ? `sf-icon--size-${size}` : "", loaded ? "sf-icon-loaded" : "", weightClass ? `sf-icon--weight-${weightClass}` : "", rounded ? "sf-icon--rounded" : "", sharp ? "sf-icon--sharp" : "", filled ? "sf-icon--filled" : "", rootClass].filter(Boolean).join(" ");
  const style = [rootStyle, `--sf-icon--grade:${grade}`, `--sf-icon--optical-size:${opticalSize}`].filter(Boolean).join(";");
  return {
    icon,
    className,
    style,
    label
  };
}

function renderIconTemplate(context) {
  const {
    icon,
    className,
    style,
    label
  } = getIconData(context);
  const badge = context.badge; // With a count or a dot the glyph stands in an anchor of its own box
  // (simai/ui-source#12): the glyph's text is its ligature, so the badge
  // cannot go inside it. A labelled icon is then named by the anchor, with the
  // count after the label; an unlabelled one says the count in hidden words.

  if ((0,_helpers_anchored_badge__WEBPACK_IMPORTED_MODULE_2__.hasBadge)(badge)) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span
      class="sf-badge-anchor sf-badge-anchor--size-${(0,_component_badges_js_anchored_state__WEBPACK_IMPORTED_MODULE_1__.iconBadgeStep)(context.size)} sf-badge-anchor--square"
      role=${label ? "img" : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      aria-label=${label ? (0,_helpers_anchored_badge__WEBPACK_IMPORTED_MODULE_2__.nameWithBadge)(label, badge.phrase) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      ><i class="${className}" style=${style} aria-hidden="true">${icon}</i
      >${(0,_helpers_anchored_badge__WEBPACK_IMPORTED_MODULE_2__.renderAnchoredBadge)(badge)}${label ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : (0,_helpers_anchored_badge__WEBPACK_IMPORTED_MODULE_2__.renderAnchoredBadgeText)(badge, false)}</span
    >`;
  }

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i
    class="${className}"
    style=${style}
    role=${label ? "img" : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    aria-label=${label || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    aria-hidden=${label ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : "true"}
    >${icon}</i
  >`;
}
renderIconTemplate.getIconData = getIconData;
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

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
/******/ 	let __webpack_exports__ = __webpack_require__("c24fff940cd9");
/******/
/******/ })()
;