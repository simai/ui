/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "7cd0e63a3ed6"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

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
/* harmony import */ var _core_js_page_language_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("8489d1f5bab4");
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

/***/ },

/***/ "0ce42e50253a"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   initAnchoredBadges: () => (/* binding */ initAnchoredBadges),
/* harmony export */   updateAnchoredBadge: () => (/* binding */ updateAnchoredBadge)
/* harmony export */ });
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("8489d1f5bab4");
/* harmony import */ var _anchored_state__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("7cd0e63a3ed6");
// The ordinary runtime of counts and dots (simai/ui-source#12).
//
// Markup alone is enough: a `.sf-badge` with `data-count` or `data-dot` is kept
// by this file wherever it is -- on an anchor (`sf-badge--anchored` inside an
// avatar, an icon button or a `.sf-badge-anchor`) or as a counter in a row --
// and a package component writes nothing but the attributes:
//
//   <span class="sf-badge sf-badge--anchored" data-count="3"></span>
//   <span class="sf-badge sf-badge--anchored" data-dot data-label="есть новое"></span>
//
// For each one it draws the number (capped, «99+» by default, `data-cap` to
// change it), hides the badge at 0, hides the digits from assistive technology,
// sets the phrase as the tooltip and joins it to the accessible name:
//
//   - an owner with an aria-label -- the badge's parent, or the link or button
//     around it -- gets «<its label>, <phrase>», and gets its own label back when
//     the badge hides; a label the owner rewrites later is taken as the new one;
//   - otherwise visually hidden words «, <phrase>» close the link or button
//     around the badge (or its parent, when there is none), so a name read from
//     content -- a link, a button, a row -- ends with it.
//
// The Smart sf-avatar, sf-icon and sf-icon-button draw their badges themselves
// (no data-count on them) and are not touched here. The words follow the page
// language and change with it.


const SELECTOR = '.sf-badge[data-count], .sf-badge[data-dot]';
const TEXT_CLASS = 'sf-badge-anchored-text';
const OWNER_SELECTOR = 'a[href], button, [role="button"], [role="link"], [role="img"], [role="menuitem"], [role="tab"], [role="option"], [role="treeitem"]';
const OBSERVED = ['data-count', 'data-dot', 'data-cap', 'data-label', 'aria-label']; // The owners whose aria-label this file has written: the label the author gave
// and the one written, so a label rewritten by its owner is recognised.

const OWNERS = new WeakMap(); // The hidden words of each badge whose name is read from content.

const TEXTS = new WeakMap();

function isElement(value) {
  return typeof Element !== 'undefined' && value instanceof Element;
}

function nameOwner(badge) {
  const parent = badge.parentElement;
  if (!parent) return null;
  if (parent.hasAttribute('aria-label') || OWNERS.has(parent)) return parent;
  const control = parent.closest(OWNER_SELECTOR);
  if (control && (control.hasAttribute('aria-label') || OWNERS.has(control))) return control;
  return null;
}

function stateOf(badge) {
  return (0,_anchored_state__WEBPACK_IMPORTED_MODULE_1__.anchoredBadgeState)({
    count: badge.getAttribute('data-count'),
    dot: badge.hasAttribute('data-dot') ? (0,_anchored_state__WEBPACK_IMPORTED_MODULE_1__.badgeFlag)(badge.getAttribute('data-dot')) : false,
    cap: badge.getAttribute('data-cap'),
    label: badge.getAttribute('data-label')
  }, badge);
} // Text a reader takes from a node, roughly: what is not hidden from it, the
// alternative text of images, and none of the badges' own parts.


function readableText(node, skip) {
  if (node.nodeType === 3) return node.textContent;
  if (!isElement(node) || node === skip) return '';
  if (node.getAttribute('aria-hidden') === 'true' || node.hidden) return '';
  if (getComputedStyle(node).display === 'none') return '';
  if (node.matches(`${SELECTOR}, .${TEXT_CLASS}`)) return '';
  if (node.matches('img')) return node.getAttribute('alt') || '';
  if (node.hasAttribute('aria-label')) return node.getAttribute('aria-label');
  return [...node.childNodes].map(child => readableText(child, skip)).join(' ');
}

function updateOwner(owner) {
  const entry = OWNERS.get(owner) ?? {
    base: owner.getAttribute('aria-label') ?? '',
    written: null
  };
  const current = owner.getAttribute('aria-label') ?? '';
  if (entry.written !== null && current !== entry.written) entry.base = current;
  const phrases = [...owner.querySelectorAll(SELECTOR)].filter(badge => nameOwner(badge) === owner).map(badge => stateOf(badge)).filter(state => state.visible).map(state => state.phrase);
  const next = phrases.reduce((name, phrase) => (0,_anchored_state__WEBPACK_IMPORTED_MODULE_1__.nameWithBadge)(name, phrase), entry.base);
  entry.written = next;
  OWNERS.set(owner, entry);
  if (current !== next) owner.setAttribute('aria-label', next);
} // Where a badge's hidden words go: at the end of the link or button around
// it, so they close its name, else at the end of the badge's parent.


function textNode(badge) {
  const host = badge.parentElement.closest(OWNER_SELECTOR) || badge.parentElement;
  let node = TEXTS.get(badge);

  if (!node) {
    node = document.createElement('span');
    node.className = TEXT_CLASS;
    TEXTS.set(badge, node);
  }

  if (node.parentElement !== host || node !== host.lastElementChild) host.append(node);
  return node;
}

function dropText(badge) {
  TEXTS.get(badge)?.remove();
  TEXTS.delete(badge);
}

function updateAnchoredBadge(badge) {
  if (!isElement(badge) || !badge.matches(SELECTOR)) return;
  const state = stateOf(badge);
  const explicitDot = badge.hasAttribute('data-dot') && (0,_anchored_state__WEBPACK_IMPORTED_MODULE_1__.badgeFlag)(badge.getAttribute('data-dot'));
  badge.hidden = !state.visible;
  badge.classList.toggle('sf-badge--dot', explicitDot);
  if (badge.textContent !== state.text) badge.textContent = state.text;
  if (badge.getAttribute('aria-hidden') !== 'true') badge.setAttribute('aria-hidden', 'true');
  if (state.visible && state.phrase) badge.setAttribute('title', state.phrase);else badge.removeAttribute('title');
  const owner = nameOwner(badge);

  if (owner) {
    dropText(badge);
    updateOwner(owner);
    return;
  }

  if (!badge.parentElement) return;
  const words = state.visible ? state.phrase : '';

  if (!words) {
    dropText(badge);
    return;
  }

  const node = textNode(badge);
  const said = readableText(node.parentElement, badge).trim() ? `, ${words}` : words;
  if (node.textContent !== said) node.textContent = said;
}
function initAnchoredBadges(scope = document) {
  if (!scope) return;
  if (isElement(scope) && scope.matches(SELECTOR)) updateAnchoredBadge(scope);
  scope.querySelectorAll?.(SELECTOR).forEach(updateAnchoredBadge);
}
let observer = null;

function boot() {
  if (observer || typeof MutationObserver === 'undefined') return;
  initAnchoredBadges(document);
  observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      if (mutation.type === 'attributes') {
        const target = mutation.target;

        if (mutation.attributeName === 'aria-label') {
          const entry = OWNERS.get(target);
          if (entry && target.getAttribute('aria-label') !== entry.written) updateOwner(target);
          continue;
        }

        if (target.matches?.(SELECTOR)) updateAnchoredBadge(target);else if (target.matches?.('.sf-badge')) {
          // The last attribute went: the badge is no longer kept here.
          target.hidden = false;
          dropText(target);
          const owner = target.parentElement && (OWNERS.has(target.parentElement) ? target.parentElement : target.parentElement.closest(OWNER_SELECTOR));
          if (owner && OWNERS.has(owner)) updateOwner(owner);
        }
        continue;
      }

      mutation.removedNodes.forEach(node => {
        if (!isElement(node) || node.classList.contains(TEXT_CLASS)) return; // A badge taken out of the page takes its hidden words with it.

        const gone = node.matches(SELECTOR) ? [node] : [...node.querySelectorAll(SELECTOR)];
        gone.forEach(badge => {
          if (!badge.isConnected) dropText(badge);
        });
      });
      mutation.addedNodes.forEach(node => {
        if (isElement(node) && !node.classList.contains(TEXT_CLASS)) initAnchoredBadges(node);
      });
    }
  });
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: OBSERVED
  });
  _core_js_page_language__WEBPACK_IMPORTED_MODULE_0__.language.onChange?.(() => initAnchoredBadges(document));
}

if (typeof window !== 'undefined') {
  window.SF = window.SF || {};
  window.SF.AnchoredBadge = window.SF.AnchoredBadge || {
    init: initAnchoredBadges,
    update: updateAnchoredBadge,
    state: _anchored_state__WEBPACK_IMPORTED_MODULE_1__.anchoredBadgeState
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, {
      once: true
    });
  } else {
    boot();
  }
}

/***/ },

/***/ "c117564a8b72"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d7f974466839");
/* harmony import */ var _json_badge_utility_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("22cb9d3aeb2b");
/* harmony import */ var _register_helper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("58661bec99a6");
/* harmony import */ var _contract__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("a2a9d3c2841e");





class Badges extends _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__.ComponentObserver {
  static componentName = 'Badges';
  html = null;

  constructor(props) {
    super(props);
    const {
      text = '',
      icon,
      iconLeft,
      iconRight,
      iconPosition = 'start'
    } = this.params || {};
    const {
      size,
      type,
      scheme
    } = (0,_contract__WEBPACK_IMPORTED_MODULE_3__.normalizeBadgeContract)(this.params);
    const className = this.attrs.class || this.attrs.className;
    const accessibleLabel = this.attrs['aria-label'] || '';
    this.badge = document.createElement('span');

    if (this.id) {
      this.badge.id = this.id;
    }

    this.badge.classList.add('sf-badge', `sf-badge--size-${size}`, `sf-badge--${type}`, `sf-badge--${scheme}`);

    if (className) {
      this.badge.classList.add(...`${className}`.split(' ').filter(Boolean));
    }

    Object.entries(this.attrs).filter(([attr]) => !['class', 'className', 'aria-label'].includes(attr)).forEach(([attr, value]) => {
      if (value === undefined || value === null) {
        return;
      }

      this.badge.setAttribute(attr, value);
    });
    const startIcon = iconLeft ?? (icon && iconPosition !== 'end' ? icon : null);
    const endIcon = iconRight ?? (icon && iconPosition === 'end' ? icon : null);
    this.iconContainerLeft = this.createIcon(startIcon);
    this.iconContainerRight = this.createIcon(endIcon);
    this.accessibleText = null;

    if (accessibleLabel) {
      this.accessibleText = document.createElement('span');
      this.accessibleText.classList.add('sr-only');
      this.accessibleText.textContent = accessibleLabel;
    }

    this.textContainer = null;
    this.textElement = null;

    if (text !== undefined && text !== null && String(text).length > 0) {
      this.textContainer = document.createElement('span');
      this.textContainer.classList.add('sf-badge-text-container');
      this.textElement = document.createElement('span');
      this.textElement.classList.add('sf-badge-text');
      this.textElement.textContent = text;
      this.textContainer.append(this.textElement);

      if (accessibleLabel) {
        this.textContainer.setAttribute('aria-hidden', 'true');
      }
    }

    if (!accessibleLabel && !this.textContainer) {
      this.badge.setAttribute('aria-hidden', 'true');
    }

    this.applyLayoutUtilities(this.badge, '.sf-badge');
    this.applyLayoutUtilities(this.iconContainerLeft, '.sf-badge .sf-badge-icon-container');
    this.applyLayoutUtilities(this.iconContainerRight, '.sf-badge .sf-badge-icon-container');
    this.applyLayoutUtilities(this.textContainer, '.sf-badge .sf-badge-text-container');
    this.applyLayoutUtilities(this.textElement, '.sf-badge .sf-badge-text');
    this.applyUtilities(this.badge, this.params?.utilities?.badge ?? this.params?.utilities);
    this.applyUtilities(this.iconContainerLeft, this.params?.utilities?.iconContainer ?? this.params?.utilities?.icon);
    this.applyUtilities(this.iconContainerRight, this.params?.utilities?.iconContainer ?? this.params?.utilities?.icon);
    this.applyUtilities(this.textContainer, this.params?.utilities?.textContainer);
    this.applyUtilities(this.textElement, this.params?.utilities?.text);

    if (this.accessibleText) {
      this.badge.append(this.accessibleText);
    }

    if (this.iconContainerLeft) {
      this.badge.append(this.iconContainerLeft);
    }

    if (this.textContainer) {
      this.badge.append(this.textContainer);
    }

    if (this.iconContainerRight) {
      this.badge.append(this.iconContainerRight);
    }

    this.template = this.badge;
  }

  createIcon(iconName) {
    if (!iconName) {
      return null;
    }

    const container = document.createElement('span');
    container.classList.add('sf-badge-icon-container');
    const icon = document.createElement('i');
    icon.classList.add('sf-icon');
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = iconName;
    container.append(icon);
    return container;
  }

  applyUtilities(target, utilities) {
    if (!target || !utilities) {
      return;
    }

    const normalize = value => {
      if (Array.isArray(value)) return value;
      if (typeof value === 'string') return value.split(' ');
      if (Array.isArray(value?.classes)) return value.classes;
      if (typeof value?.classes === 'string') return value.classes.split(' ');
      if (Array.isArray(value?.badge)) return value.badge;
      if (typeof value?.badge === 'string') return value.badge.split(' ');
      return [];
    };

    normalize(utilities).filter(Boolean).forEach(cls => target.classList.add(cls));
  }

  init() {}

}

Badges.utilityMap = _json_badge_utility_json__WEBPACK_IMPORTED_MODULE_1__;
(0,_register_helper__WEBPACK_IMPORTED_MODULE_2__["default"])('Badges', Badges);

/***/ },

/***/ "a2a9d3c2841e"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BADGE_SCHEMES: () => (/* binding */ BADGE_SCHEMES),
/* harmony export */   BADGE_SIZES: () => (/* binding */ BADGE_SIZES),
/* harmony export */   BADGE_TYPES: () => (/* binding */ BADGE_TYPES),
/* harmony export */   BADGE_VARIANTS: () => (/* binding */ BADGE_VARIANTS),
/* harmony export */   normalizeBadgeContract: () => (/* binding */ normalizeBadgeContract)
/* harmony export */ });
const BADGE_TYPES = Object.freeze(['main', 'tonal', 'outline']);
const BADGE_SCHEMES = Object.freeze(['neutral', 'primary', 'secondary', 'tertiary', 'info', 'success', 'warning', 'danger', 'on-surface']);
const BADGE_SIZES = Object.freeze(['1/3', '1/2', '1']);
const DEFAULT_BADGE_TYPE = 'main';
const DEFAULT_BADGE_SCHEME = 'neutral';
const DEFAULT_BADGE_SIZE = '1/3';

const normalizeEnum = (value, allowed, fallback) => {
  const normalized = String(value ?? fallback).trim().toLowerCase();
  return allowed.includes(normalized) ? normalized : fallback;
};

const BADGE_VARIANTS = Object.freeze(BADGE_SCHEMES.flatMap(scheme => BADGE_TYPES.filter(type => !(scheme === 'on-surface' && type === 'tonal')).flatMap(type => BADGE_SIZES.map(size => Object.freeze({
  type,
  scheme,
  size
})))));
function normalizeBadgeContract({
  type,
  scheme,
  size
} = {}) {
  let normalizedType = normalizeEnum(type, BADGE_TYPES, DEFAULT_BADGE_TYPE);
  const normalizedScheme = normalizeEnum(scheme, BADGE_SCHEMES, DEFAULT_BADGE_SCHEME);
  const normalizedSize = normalizeEnum(size, BADGE_SIZES, DEFAULT_BADGE_SIZE);

  if (normalizedType === 'tonal' && normalizedScheme === 'on-surface') {
    normalizedType = 'main';
  }

  return {
    type: normalizedType,
    scheme: normalizedScheme,
    size: normalizedSize
  };
}

/***/ },

/***/ "986d3a6db62b"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _badges__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("c117564a8b72");
/* harmony import */ var _anchored__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("0ce42e50253a");
/*
* Main JS file for including JS for component.
*
* Imports:
* - Base function component (_component_name.js)
*/
 // Counts and dots kept from markup alone (simai/ui-source#12).



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

/***/ "d7f974466839"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ComponentObserver: () => (/* binding */ ComponentObserver)
/* harmony export */ });
class ComponentObserver {
  // Components name themselves with a static field (static componentName =
  // 'Modal'), and the Loader writes the name on the prototype only when it
  // registers the class; the lifecycle events read the instance, so an
  // instance made before that announced itself as `undefined:render`. Not a
  // getter: the Loader assigns the prototype property, and an accessor
  // without a setter made that assignment throw.
  lifecycleName() {
    return this.componentName ?? this.constructor.componentName;
  }

  constructor(props) {
    this.props = props;
    this.id = props?.id;
    this.params = props?.param;
    this.attrs = props?.attrs || {};
    this.template = null;
    window.dispatchEvent(new CustomEvent(`${this.lifecycleName()}:beforeRender`, {
      detail: this
    }));
  }

  getUtilityMap() {
    return this.constructor.utilityMap || null;
  }

  extractUtilityClasses(values) {
    if (!Array.isArray(values)) {
      return [];
    }

    const classes = new Set();
    values.forEach(value => {
      if (typeof value !== 'string') {
        return;
      }

      const matches = value.match(/\(([^)]+)\)/g);

      if (!matches) {
        return;
      }

      matches.forEach(match => {
        const raw = match.slice(1, -1);
        raw.split(/\s+/).filter(Boolean).forEach(cls => {
          // Only explicit (.class) annotations are classes; the
          // parentheses in var(--token) are CSS values, not markup.
          if (cls.startsWith('.') && cls.length > 1) classes.add(cls.slice(1));
        });
      });
    });
    return Array.from(classes);
  }

  applyLayoutUtilities(target, selector) {
    if (!target || !selector) {
      return;
    }

    const map = this.getUtilityMap();

    if (!map || !map[selector]) {
      return;
    }

    const classes = this.extractUtilityClasses(map[selector]);
    classes.forEach(cls => target.classList.add(cls));
  }

  render() {
    this.html = this.template;

    if (typeof this.init === 'function') {
      this.init();
    }

    if (this.html) {
      window.dispatchEvent(new CustomEvent(`${this.lifecycleName()}:render`, {
        detail: this
      }));
    }

    return this.html;
  }

  destroy() {
    this.destroyInternal?.();
    this.props = null;
    this.id = null;
    this.params = null;
    this.template = null;

    if (this.html) {
      this.html.remove();
      this.html = null;
    }

    window.dispatchEvent(new CustomEvent(`${this.lifecycleName()}:destroy`, {
      detail: this
    }));
  }

  destroyInternal() {}

}

/***/ },

/***/ "8489d1f5bab4"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isRussianPage: () => (/* binding */ isRussianPage),
/* harmony export */   language: () => (/* binding */ language),
/* harmony export */   pageLanguage: () => (/* binding */ pageLanguage),
/* harmony export */   pageLocale: () => (/* binding */ pageLocale),
/* harmony export */   pageText: () => (/* binding */ pageText)
/* harmony export */ });
// What language a component speaks, and how a product adds one.
//
// The Framework speaks English by default and whatever the page says otherwise:
// the language is the nearest [lang] above the node, else the document's, else
// English. One rule for every component, so a page never mixes two because two
// components looked in different places.
//
// Until 2026-10-10 that was the whole of it, and every component carried a
// dictionary of exactly two languages written into its source. Adding a third
// meant editing sixteen files, and a product that needed one could not add it
// at all. There will be many more than two (owner, 2026-10-11), so the
// dictionaries a component ships are now a FLOOR rather than the whole set:
// anything can be registered beside them, for any language, including one the
// Framework has never heard of.
//
// Where a word comes from, in order:
//
//   1. the component's own attribute — a consumer who names a word has named
//      it, and no language changes it;
//   2. a word registered for the resolved language;
//   3. the word the component ships for that language;
//   4. the same two again for the language without its region (`pt-BR` → `pt`);
//   5. the same two again for English;
//   6. the key itself, which is a visible defect rather than a blank.
//
// Registering is additive and reversible, and it does not require the
// Framework to know the language exists.
// The state is shared between every copy of this module, which there are
// several of: core, each smart component and each composite are separate
// bundles, and each one carries its own copy of this file. With the registry
// in module scope the page had as many registries as bundles -- `SF.language`
// was published from core's copy, the table read its own, and registering a
// language changed nothing on screen. Only a browser shows that, and it did
// (2026-10-11).
const STORE = (() => {
  const root = typeof globalThis !== 'undefined' ? globalThis : {};
  const key = '__sfPageLanguage';

  if (!root[key]) {
    root[key] = {
      listeners: new Set(),
      registered: new Map(),
      chosen: null
    };
  }

  return root[key];
})();

const LISTENERS = STORE.listeners;
const REGISTERED = STORE.registered;

const normalise = value => String(value ?? '').trim().toLowerCase().replace('_', '-');
/** The languages to try, most specific first, English last. */


const chain = language => {
  const wanted = normalise(language);
  const base = wanted.split('-')[0];
  const order = [];

  for (const candidate of [wanted, base, 'en']) {
    if (candidate && !order.includes(candidate)) order.push(candidate);
  }

  return order;
};
/** Which component a node belongs to, for words registered against one. */


const componentOf = node => {
  const tag = node?.tagName;
  return typeof tag === 'string' ? tag.toLowerCase() : null;
};

const announce = () => {
  for (const listener of [...LISTENERS]) {
    try {
      listener();
    } catch {// A listener that throws is not allowed to stop the others: a page that
      // half-changed language would be worse than one that did not change.
    }
  }
}; // The nearest element that says its language, looking past shadow roots: a
// pagination drawn inside a data view's shadow root found no [lang] there,
// fell back to <html lang> and spoke English inside a Russian admin whose
// language was set on the shell around it.


function langOwner(node) {
  let current = node;

  while (current) {
    const owner = typeof current.closest === 'function' ? current.closest('[lang]') : null;
    if (owner) return owner;
    const root = typeof current.getRootNode === 'function' ? current.getRootNode() : null;
    current = root && root !== current && root.host ? root.host : null;
  }

  return null;
}
/**
 * The page's language for this node: the nearest [lang], else the document's,
 * else English — unless a product has chosen one explicitly.
 */


function pageLanguage(node) {
  // The language without its region, whichever way it was set: a page that
  // chose 'pt-BR' is a Portuguese page, as a page whose markup says
  // lang="pt-BR" is. The chosen value kept its region and answered 'pt-br',
  // which matched no dictionary keyed by language and made isRussianPage false
  // on a page that chose 'ru-RU'. The region stays in pageLocale.
  if (STORE.chosen) return STORE.chosen.split('-')[0];
  const owner = langOwner(node);
  const value = owner?.getAttribute('lang') || globalThis.document?.documentElement?.lang || 'en';
  return normalise(value).split('-')[0] || 'en';
}
/** The page's language with its region kept, which is what formatting wants. */

function pageLocale(node) {
  if (STORE.chosen) return STORE.chosen;
  const owner = langOwner(node);
  return normalise(owner?.getAttribute('lang') || globalThis.document?.documentElement?.lang || 'en');
}
function isRussianPage(node) {
  return pageLanguage(node) === 'ru';
}
/**
 * Text for `key` in the page's language.
 *
 * `dictionary` is what the component ships; `component` names it for the
 * registry and defaults to the node's own tag, so a component calling with
 * `this` identifies itself without saying so twice.
 */

function pageText(dictionary, key, node, component) {
  const owner = component ?? componentOf(node);

  for (const candidate of chain(pageLocale(node))) {
    const added = owner ? REGISTERED.get(owner)?.get(candidate)?.[key] : undefined;
    if (added !== undefined) return added;
    const shipped = dictionary?.[candidate]?.[key];
    if (shipped !== undefined) return shipped;
  }

  return key;
}
const language = {
  /** What the page resolves to for this node, region and all. */
  current(node = globalThis.document?.documentElement ?? null) {
    return pageLocale(node);
  },

  /**
   * Choose a language for the whole page, whatever its markup says. `null`
   * returns to following the document, which is the default and what a
   * server-rendered page wants.
   */
  use(value) {
    const next = value === null || value === undefined ? null : normalise(value);
    if (next === STORE.chosen) return STORE.chosen;
    STORE.chosen = next;
    announce();
    return STORE.chosen;
  },

  /**
   * Add or replace one component's words for one language.
   *
   * The words are merged, so a product can correct a single label without
   * restating the rest, and `null` removes what it added.
   */
  register(component, value, words) {
    const name = String(component ?? '').toLowerCase();
    const code = normalise(value);
    if (!name || !code) throw new TypeError('a component and a language are required');
    if (!REGISTERED.has(name)) REGISTERED.set(name, new Map());
    const byLanguage = REGISTERED.get(name);
    if (words === null) byLanguage.delete(code);else byLanguage.set(code, { ...(byLanguage.get(code) ?? {}),
      ...words
    });
    announce();
    return this;
  },

  /** One language across many components: `{ 'sf-datepicker': {...}, ... }`. */
  registerAll(value, byComponent = {}) {
    for (const [component, words] of Object.entries(byComponent)) {
      this.register(component, value, words);
    }

    return this;
  },

  /** The languages something has registered words for. */
  known(component) {
    const name = String(component ?? '').toLowerCase();
    return [...(REGISTERED.get(name)?.keys() ?? [])];
  },

  /** Every component something has been registered for. */
  components() {
    return [...REGISTERED.keys()];
  },

  /**
   * Called whenever the chosen language or the registered words change, so a
   * component can draw itself again. Returns the way to stop listening.
   */
  onChange(listener) {
    if (typeof listener !== 'function') return () => {};
    LISTENERS.add(listener);
    return () => LISTENERS.delete(listener);
  },

  /** Everything registered is forgotten. For tests, and for a product reset. */
  forget() {
    REGISTERED.clear();
    STORE.chosen = null;
    announce();
    return this;
  }

}; // Reachable by a consumer, which it was not: `sf-admin-menu` had written its
// own reading of the rule because the shared one was an internal module, and
// the two then disagreed about a region that names its own language. A product
// composing its own elements gets the same rule here.

if (typeof window !== 'undefined') {
  window.SF = window.SF || {};
  window.SF.language = language;
  window.SF.pageLanguage = pageLanguage;
  window.SF.pageText = pageText;
}

/***/ },

/***/ "0c7667d4c371"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "22cb9d3aeb2b"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{".sf-badge":["display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","gap/var(--sf-a0)","justify-content/center (.justify-center)","align-items/center (.items-center)"],".sf-badge .sf-badge-icon-container":["display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","justify-content/center (.justify-center)","align-items/center (.items-center)"],".sf-badge .sf-badge-icon-container .sf-icon":["display/flex (.flex)","justify-content/center (.justify-center)","align-items/center (.items-center)"],".sf-badge .sf-badge-text-container":["display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","justify-content/center (.justify-center)","align-items/center (.items-center)"]}');

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
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("0c7667d4c371");
/* harmony import */ var _js_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("986d3a6db62b");
/**
* SIMAI Framework
* Copyright 2008-2026 SIMAI Ltd
* http://simai.studio
* Read the license: http://framework.simai.studio/license/
* Documentation: http://framework.simai.studio/
* Support: http://simai.studio/support/
*
* BADGES
*
* Entry point for importing components from this directory.
* Simplifies the import process in other parts of the project.
* Instead of importing individual files, all component can be imported through this file.
*/


})();

/******/ })()
;