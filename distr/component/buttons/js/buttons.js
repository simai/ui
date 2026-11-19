/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "176a9b5b7b35"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d7f974466839");
/* harmony import */ var _json_button_utility_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("c71a77b9cdfb");
/* harmony import */ var _register_helper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("58661bec99a6");
/* harmony import */ var _button_checks_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("01473540635d");
/* harmony import */ var _spinner_js_spinner_draw__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("50d2a204ba4c");
/* harmony import */ var _link_alias__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("b995e1476acd");
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("06e8cd089f28");








class Buttons extends _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__.ComponentObserver {
  static componentName = 'Buttons';
  html = null;

  constructor(props) {
    super(props);
    const {
      size = '1',
      type = 'default',
      scheme = 'primary',
      text = '',
      icon,
      iconLeft,
      iconRight,
      iconPosition = 'start',
      tightness,
      spacing,
      height,
      radius,
      fullWidth = false,
      loading = false,
      disabled = false,
      utilities = {}
    } = this.params || {};
    const className = this.attrs.class || this.attrs.className; // type 'link' is ghost's former name (C15): the button gets both classes
    // until 2027-01-01, as the Smart sf-button draws it, and the option is noted.

    const look = type === 'link' ? 'ghost' : type;

    if (type === 'link') {
      (0,_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_6__.noteDeprecated)({ ..._link_alias__WEBPACK_IMPORTED_MODULE_5__.BUTTON_LINK_ALIAS,
        kind: 'option',
        attribute: 'type',
        from: 'link',
        to: 'ghost'
      });
    }

    this.button = document.createElement('button');

    if (this.id) {
      this.button.id = this.id;
    }

    this.button.classList.add('sf-button', `sf-button--size-${size}`, `sf-button--${look}`, `sf-button--${scheme}`);

    if (look === 'ghost') {
      this.button.classList.add('sf-button--link');
    } // The readable names for the same steps: compact, comfortable, spacious.
    // `normal` is the default and needs no class. When both options are given,
    // `spacing` wins, as it does on the Smart element (control-spacing.js), so
    // one control never carries two different steps.


    const hasSpacing = ['normal', 'compact', 'comfortable', 'spacious'].includes(spacing);

    if (hasSpacing && spacing !== 'normal') {
      this.button.classList.add(`spacing-${spacing}`);
    } else if (!hasSpacing && tightness) {
      this.button.classList.add(`tightness-${tightness}`);
    } // The control height (1.8.0, decision C27): the size's tightness step;
    // default needs no class.


    if (['low', 'high', 'highest'].includes(height)) {
      this.button.classList.add(`sf-button--height-${height}`);
    }

    if (radius) {
      this.button.classList.add(`radius-${radius}`);
    } // full-width (owner decision C36): the control fills its container.


    if (fullWidth) {
      this.button.classList.add('sf-button--full-width');
    }

    if (loading) {
      this.button.classList.add('loading', 'sf-button-state-loading');
      this.button.setAttribute('aria-busy', 'true');
      this.button.disabled = true;
    }

    if (disabled) {
      this.button.disabled = true; // Loading keeps the scheme colour (owner decision C36); disabled and
      // loading wears the disabled look.

      if (loading) this.button.classList.add('disabled');
    }

    if (className) {
      this.button.classList.add(...`${className}`.split(' ').filter(Boolean));
    }

    Object.entries(this.attrs).filter(([attr]) => !['class', 'className'].includes(attr)).forEach(([attr, value]) => {
      if (value === undefined || value === null) {
        return;
      }

      this.button.setAttribute(attr, value);
    }); // Avoid implicit "submit" behavior inside forms unless explicitly overridden.

    if (!this.button.hasAttribute('type')) {
      this.button.setAttribute('type', 'button');
    }

    const normalizedIconPosition = `${iconPosition}`.toLowerCase();
    const isIconEnd = ['right', 'end'].includes(normalizedIconPosition);
    const leftIconName = iconLeft ?? (icon && !isIconEnd ? icon : null);
    const rightIconName = iconRight ?? (icon && isIconEnd ? icon : null);
    this.iconLeft = this.createIcon(leftIconName);
    this.iconRight = this.createIcon(rightIconName);
    this.textContainer = document.createElement('span');
    this.textContainer.classList.add('sf-button-text-container');
    this.textElement = document.createElement('span');
    this.textElement.classList.add('sf-button-text');
    this.textContainer.textContent = text;
    this.applyLayoutUtilities(this.button, '.sf-button');
    this.applyLayoutUtilities(this.iconLeft, '.sf-button .sf-icon');
    this.applyLayoutUtilities(this.iconRight, '.sf-button .sf-icon');
    this.applyLayoutUtilities(this.textContainer, '.sf-button .sf-button-text-container');
    this.applyUtilities(this.button, utilities.button ?? utilities);
    this.applyUtilities(this.iconLeft, utilities.icon);
    this.applyUtilities(this.iconRight, utilities.icon);
    this.applyUtilities(this.textContainer, utilities.textContainer); // Loading shows the spinner at the icon's size (simai/ui-source#10): in
    // place of the start icon, else of the end icon; without an icon it lies
    // over the label, which keeps its place and stays the accessible name.

    let startNode = this.iconLeft;
    let endNode = this.iconRight;

    if (loading) {
      const overlay = !startNode && !endNode;
      this.spinner = (0,_spinner_js_spinner_draw__WEBPACK_IMPORTED_MODULE_4__.createInlineSpinner)({
        className: 'sf-button-spinner',
        overlay
      });
      if (startNode) startNode = this.spinner;else if (endNode) endNode = this.spinner;else this.button.append(this.spinner);
    }

    if (startNode) {
      this.button.append(startNode);
    }

    this.button.append(this.textContainer);

    if (endNode) {
      this.button.append(endNode);
    }

    this.template = this.button;
  }

  createIcon(name) {
    if (!name) {
      return null;
    }

    const icon = document.createElement('i');
    icon.classList.add('sf-icon');
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = name;
    return icon;
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
      if (Array.isArray(value?.button)) return value.button;
      if (typeof value?.button === 'string') return value.button.split(' ');
      return [];
    };

    normalize(utilities).filter(Boolean).forEach(cls => target.classList.add(cls));
  }

}

Buttons.utilityMap = _json_button_utility_json__WEBPACK_IMPORTED_MODULE_1__;
(0,_register_helper__WEBPACK_IMPORTED_MODULE_2__["default"])('Buttons', Buttons); // The pressed look on a toggle only, a square icon-only button with a name,
// the set's former classes (C116, C211): said once in the console.

(0,_button_checks_js__WEBPACK_IMPORTED_MODULE_3__.watchButtons)();

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => (0,_link_alias__WEBPACK_IMPORTED_MODULE_5__.watchButtonLinks)(document), {
      once: true
    });
  } else {
    (0,_link_alias__WEBPACK_IMPORTED_MODULE_5__.watchButtonLinks)(document);
  }
}

/***/ },

/***/ "01473540635d"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BUTTON_CLASS_ALIASES: () => (/* binding */ BUTTON_CLASS_ALIASES),
/* harmony export */   BUTTON_ICON_ONLY: () => (/* binding */ BUTTON_ICON_ONLY),
/* harmony export */   BUTTON_TOGGLE: () => (/* binding */ BUTTON_TOGGLE),
/* harmony export */   ICON_BUTTON_CLASS_ALIASES: () => (/* binding */ ICON_BUTTON_CLASS_ALIASES),
/* harmony export */   ICON_BUTTON_CLOSE_LOOKS: () => (/* binding */ ICON_BUTTON_CLOSE_LOOKS),
/* harmony export */   ICON_BUTTON_DENSITY_CLASSES: () => (/* binding */ ICON_BUTTON_DENSITY_CLASSES),
/* harmony export */   ICON_BUTTON_TOGGLE: () => (/* binding */ ICON_BUTTON_TOGGLE),
/* harmony export */   checkButton: () => (/* binding */ checkButton),
/* harmony export */   watchButtons: () => (/* binding */ watchButtons)
/* harmony export */ });
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("06e8cd089f28");
 // What the button sheets draw only on their own terms, said once in the
// console so a page author sees why a look is missing (owner decisions C116,
// C211, 2026-11-16). Shared by the buttons and icon-buttons runtimes: each
// bundle carries its own copy of this module, so what was said lives on one
// shared global and a button is named once whichever copy sees it first.
//
// - aria-pressed (or the --pressed class) on a button that is no toggle: the
//   pressed look is drawn on outline or ghost in the neutral scheme (C211 (1))
//   and on a filled button of any scheme (C309 (2), 2026-11-18); a tonal
//   one, or an outline or ghost one in another scheme, keeps its own look.
// - an sf-button with an icon and no label: square, as an icon button, and it
//   needs aria-label (C211 (2)).
// - the set's former classes sf-button--secondary and sf-button--surface
//   (C116 (3), (6)): drawn as on-surface and as tonal on-surface until
//   2027-01-01, noted in SF.deprecations (journal class-button-set-c116).
// - the icon button's former looks sf-icon-button--surface and
//   sf-icon-button--link (component.icon-buttons 1.14.0, RG-IB-2): drawn
//   exactly as tonal and ghost until 2027-01-01, said once per button in the
//   console and noted in SF.deprecations (journals
//   class-icon-button-retired-looks-c15, class-icon-button-link-to-ghost).
// - density on an icon button (owner decision C213): spacing-compact,
//   -comfortable, -spacious and the older tightness-low, -high, -highest draw
//   nothing on sf-icon-button; said once per button, noted until 2027-01-01
//   (journal class-icon-button-density-c213).
// - a close in a look of the icon button (component.icon-buttons 1.15.0,
//   RG-CL-3; owner decision C14: no squares, no solid plate under a cross):
//   sf-icon-button--close with --default, --tonal, --outline or --surface is
//   drawn as ghost until 2027-01-01, said once per button and noted in
//   SF.deprecations (journal class-icon-button-close-looks-c14). A close of
//   its own is sf-button-close.

const DEPRECATED = Object.freeze({
  since: '2026-11-16',
  remove_after: '2027-01-01'
});
const BUTTON_CLASS_ALIASES = Object.freeze({
  'sf-button--secondary': 'sf-button--on-surface',
  'sf-button--surface': 'sf-button--tonal sf-button--on-surface'
});
const ICON_DEPRECATED = Object.freeze({
  since: '2026-11-16',
  remove_after: '2027-01-01'
});
const ICON_BUTTON_CLASS_ALIASES = Object.freeze({
  'sf-icon-button--surface': 'sf-icon-button--tonal',
  'sf-icon-button--link': 'sf-icon-button--ghost'
});
const ICON_BUTTON_CLOSE_LOOKS = Object.freeze(['sf-icon-button--default', 'sf-icon-button--tonal', 'sf-icon-button--outline', 'sf-icon-button--surface']);
const ICON_BUTTON_DENSITY_CLASSES = Object.freeze(['spacing-compact', 'spacing-comfortable', 'spacing-spacious', 'tightness-low', 'tightness-high', 'tightness-highest']);
const BUTTON_TOGGLE = ':is(.sf-button--outline, .sf-button--ghost, .sf-button--link):is(.sf-button--on-surface, .sf-button--secondary), .sf-button--default';
const ICON_BUTTON_TOGGLE = ':is(.sf-icon-button--outline, .sf-icon-button--ghost, .sf-icon-button--link):is(.sf-icon-button--on-surface, .sf-icon-button--on-surface-variant, .sf-icon-button--secondary), .sf-icon-button--default';
const BUTTON_ICON_ONLY = ':has(> :is(.sf-icon, sf-icon, .sf-button-spinner)):not(:has(> .sf-button-text-container:not(:empty)))';
const KINDS = {
  'sf-button': {
    pressedClass: 'sf-button--pressed',
    toggle: BUTTON_TOGGLE,
    iconOnly: BUTTON_ICON_ONLY
  },
  // The plain look draws a pressed glyph too (C232: sf-highlight's wrap toggle).
  'sf-icon-button': {
    pressedClass: 'sf-icon-button--pressed',
    toggle: `${ICON_BUTTON_TOGGLE}, .sf-icon-button--plain`,
    iconOnly: null
  }
};

function said() {
  const root = globalThis.SF = globalThis.SF || {};

  if (!(root.__buttonChecks instanceof WeakMap)) {
    Object.defineProperty(root, '__buttonChecks', {
      value: new WeakMap(),
      configurable: true
    });
  }

  return root.__buttonChecks;
}

function sayOnce(element, topic, message) {
  const map = said();
  let topics = map.get(element);

  if (!topics) {
    topics = new Set();
    map.set(element, topics);
  }

  if (topics.has(topic)) return;
  topics.add(topic);
  globalThis.console?.warn?.(message, element);
}

function nameOf(element) {
  const label = element.getAttribute('aria-label') || element.querySelector('.sf-button-text-container')?.textContent?.trim() || element.textContent?.trim() || '';
  const classes = [...element.classList].filter(name => /^sf-(icon-)?button--/u.test(name)).join(' ');
  return `<${element.localName}${element.id ? `#${element.id}` : ''} class="${classes}">${label ? ` «${label.slice(0, 40)}»` : ''}`;
}

function hasName(element) {
  return Boolean(element.getAttribute('aria-label')?.trim() || element.getAttribute('aria-labelledby')?.trim() || element.getAttribute('title')?.trim());
}

function matches(element, selector) {
  try {
    return element.matches(selector);
  } catch {
    return false;
  }
}

function checkButton(element, block) {
  const kind = KINDS[block];
  if (!kind || !element?.classList?.contains(block)) return;
  const pressedSaid = element.hasAttribute('aria-pressed') || element.classList.contains(kind.pressedClass);

  if (pressedSaid && !matches(element, kind.toggle)) {
    sayOnce(element, 'pressed', `[SIMAI Framework] ${block}: ${nameOf(element)} says aria-pressed, but the pressed look is drawn only on a toggle -- a filled button, or outline or ghost in on-surface (owner decisions C211, C309); this button keeps its own look. A choice of one among several (a view, a width, a theme) is sf-segmented.`);
  }

  if (kind.iconOnly && matches(element, kind.iconOnly) && !hasName(element)) {
    sayOnce(element, 'name', `[SIMAI Framework] ${block}: ${nameOf(element)} has an icon and no label; it is drawn square and needs aria-label (owner decision C211).`);
  }

  if (block === 'sf-button') {
    for (const [from, to] of Object.entries(BUTTON_CLASS_ALIASES)) {
      if (element.classList.contains(from)) (0,_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_0__.noteDeprecated)({
        component: 'buttons',
        kind: 'class',
        from,
        to,
        ...DEPRECATED
      });
    }
  }

  if (block === 'sf-icon-button') {
    for (const [from, to] of Object.entries(ICON_BUTTON_CLASS_ALIASES)) {
      if (!element.classList.contains(from)) continue;
      (0,_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_0__.noteDeprecated)({
        component: 'icon-buttons',
        kind: 'class',
        from,
        to,
        ...ICON_DEPRECATED
      });
      sayOnce(element, from, `[SIMAI Framework] ${block}: ${nameOf(element)} writes ${from}, a former look drawn exactly as ${to} until ${ICON_DEPRECATED.remove_after}; write ${to} (component.icon-buttons 1.14.0).`);
    }

    if (element.classList.contains('sf-icon-button--close') && !element.classList.contains('sf-button-close')) {
      const looks = ICON_BUTTON_CLOSE_LOOKS.filter(name => element.classList.contains(name));

      for (const from of looks) {
        (0,_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_0__.noteDeprecated)({
          component: 'icon-buttons',
          kind: 'class',
          from: `sf-icon-button--close ${from}`,
          to: 'sf-icon-button--close sf-icon-button--ghost',
          ...ICON_DEPRECATED
        });
      }

      if (looks.length) {
        sayOnce(element, 'close-look', `[SIMAI Framework] ${block}: ${nameOf(element)} draws a close in ${looks.join(' ')}: a cross has no square and no solid plate (owner decision C14), so it is drawn as ghost until ${ICON_DEPRECATED.remove_after}; write sf-button-close (sf-button-close--ghost, --plain or --media) or sf-icon-button--ghost (component.icon-buttons 1.15.0).`);
      }
    }

    const density = ICON_BUTTON_DENSITY_CLASSES.filter(name => element.classList.contains(name));

    for (const from of density) {
      (0,_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_0__.noteDeprecated)({
        component: 'icon-buttons',
        kind: 'class',
        from,
        to: null,
        ...ICON_DEPRECATED
      });
    }

    if (density.length) {
      sayOnce(element, 'density', `[SIMAI Framework] ${block}: ${nameOf(element)} writes ${density.join(' ')}: an icon button has no density (owner decision C213) and these classes draw nothing; size and height (sf-icon-button--height-low|high|highest) change it and keep it square. Remove them before ${ICON_DEPRECATED.remove_after}.`);
    }
  }
}
let pending = null;
const queue = new Set();

function flush() {
  pending = null;
  const elements = [...queue];
  queue.clear();

  for (const element of elements) {
    if (!element.isConnected) continue;
    checkButton(element, 'sf-button');
    checkButton(element, 'sf-icon-button');
  }
}

function enqueue(node) {
  if (!(node instanceof Element)) return;
  if (node.matches('.sf-button, .sf-icon-button')) queue.add(node);
  node.querySelectorAll?.('.sf-button, .sf-icon-button').forEach(element => queue.add(element)); // After the current task: a Smart host writes the name and the state on the
  // button it draws in the same turn.

  if (!pending) pending = setTimeout(flush, 0);
}

function watchButtons() {
  if (typeof document === 'undefined') return;
  const root = globalThis.SF = globalThis.SF || {};
  if (root.__buttonChecksWatching) return;
  Object.defineProperty(root, '__buttonChecksWatching', {
    value: true,
    configurable: true
  });

  const start = () => {
    enqueue(document.documentElement);
    new MutationObserver(mutations => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes') {
          if (mutation.target.matches?.('.sf-button, .sf-icon-button')) {
            queue.add(mutation.target);
            if (!pending) pending = setTimeout(flush, 0);
          }
        } else mutation.addedNodes.forEach(enqueue);
      }
    }).observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'aria-pressed', 'aria-label', 'aria-labelledby', 'title']
    });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {
    once: true
  });else start();
}

/***/ },

/***/ "757f80eca5ff"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _buttons__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("176a9b5b7b35");
/*
* Main JS file for including JS for component.
*
* Imports:
* - Base function component (_component_name.js)
*/


/***/ },

/***/ "b995e1476acd"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BUTTON_LINK_ALIAS: () => (/* binding */ BUTTON_LINK_ALIAS),
/* harmony export */   isFormerLinkOnly: () => (/* binding */ isFormerLinkOnly),
/* harmony export */   noteButtonLink: () => (/* binding */ noteButtonLink),
/* harmony export */   watchButtonLinks: () => (/* binding */ watchButtonLinks)
/* harmony export */ });
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("06e8cd089f28");
 // sf-button--link is the former name of sf-button--ghost (decision C15,
// journal class-button-link-to-ghost): the sheets draw both the same until
// 2027-01-01, and a page that still writes the former name alone is noted in
// SF.deprecations (with a console line when data-sf-deprecations="warn").
// The Smart sf-button, sf-segmented and sf-alert write both classes until the
// date, so a button that carries ghost as well is not the page's spelling and
// is not noted. noteDeprecated keeps one record per name, so one note is
// enough: the watch stops after it.

const BUTTON_LINK_ALIAS = Object.freeze({
  component: 'buttons',
  kind: 'class',
  from: 'sf-button--link',
  to: 'sf-button--ghost',
  since: '2026-11-11',
  remove_after: '2027-01-01'
});
const FORMER_ONLY = '.sf-button.sf-button--link:not(.sf-button--ghost)';
function isFormerLinkOnly(element) {
  return Boolean(element?.classList?.contains('sf-button') && element.classList.contains('sf-button--link') && !element.classList.contains('sf-button--ghost'));
}
function noteButtonLink() {
  (0,_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_0__.noteDeprecated)(BUTTON_LINK_ALIAS);
}

function found(root) {
  if (!root) return false;
  if (root.nodeType === 1 && isFormerLinkOnly(root)) return true;
  return Boolean(root.querySelector?.(FORMER_ONLY));
}

function watchButtonLinks(doc = globalThis.document) {
  const view = doc?.defaultView || globalThis;
  if (!doc?.documentElement || view.__sfButtonLinkWatch) return;
  Object.defineProperty(view, '__sfButtonLinkWatch', {
    value: true,
    configurable: true
  });
  let observer = null;

  const done = () => {
    noteButtonLink();
    observer?.disconnect();
    observer = null;
  };

  if (found(doc.documentElement)) {
    done();
    return;
  }

  if (typeof view.MutationObserver !== 'function') return;
  observer = new view.MutationObserver(records => {
    for (const record of records) {
      if (record.type === 'attributes' ? isFormerLinkOnly(record.target) : [...record.addedNodes].some(found)) {
        done();
        return;
      }
    }
  });
  observer.observe(doc.documentElement, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ['class']
  });
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

/***/ "50d2a204ba4c"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SPINNER_DEFAULT_LOOK: () => (/* binding */ SPINNER_DEFAULT_LOOK),
/* harmony export */   SPINNER_DOTS: () => (/* binding */ SPINNER_DOTS),
/* harmony export */   SPINNER_DOTS_FILLED: () => (/* binding */ SPINNER_DOTS_FILLED),
/* harmony export */   SPINNER_GRID: () => (/* binding */ SPINNER_GRID),
/* harmony export */   SPINNER_LIVE_AREA: () => (/* binding */ SPINNER_LIVE_AREA),
/* harmony export */   SPINNER_LOOKS: () => (/* binding */ SPINNER_LOOKS),
/* harmony export */   SPINNER_STROKE: () => (/* binding */ SPINNER_STROKE),
/* harmony export */   createInlineSpinner: () => (/* binding */ createInlineSpinner),
/* harmony export */   createLadderSpinnerSvg: () => (/* binding */ createLadderSpinnerSvg),
/* harmony export */   createSpinnerSvg: () => (/* binding */ createSpinnerSvg),
/* harmony export */   createSvgNode: () => (/* binding */ createSvgNode),
/* harmony export */   normalizeSpinnerLook: () => (/* binding */ normalizeSpinnerLook)
/* harmony export */ });
// The spinner's drawing, without the component's side effects (no registry, no
// observer), so a control that shows work in place of its icon -- a button, an
// icon button, a group's segment, a modal waiting for its content -- draws the
// one spinner of the Framework without loading or binding the spinner
// component (simai/ui-source#10).
//
// The ladder: a spinner is drawn on the icon grid. Material Symbols are drawn on
// 24 units and, at the regular weight the Framework's controls use, stroke 2 of
// them; a spinner on the same grid, scaled to the icon box of a step, strokes as
// the icons of that step do, and needs no stroke of its own per step.
//
// The ring is drawn inside the icon's live area, not across its box (docs
// review R027, owner decision C11, 2026-11-07): Material Symbols draw in 20 of
// their 24 units and leave 2 of air on every side, so a ring that filled the
// box stood larger than the icon beside it. On the grid the ring's outer edge
// is the live area -- radius 9 at stroke 2, 20 units across -- and the box
// stays the icon's box, so a control that swaps its icon for the spinner moves
// nothing. The proportion is the grid's, the same at every step.
//
// The looks (simai/ui-source#11): every spinner carries the four looks on the
// same ring -- the arc and the breathing arc (one circle, two motions), the
// comet and the dots -- and the spinner sheet shows the one the page asks for:
// data-sf-spinner on html, body or any block (the nearest wins), data-variant on
// the spinner itself above both. The choice is CSS alone, so a page that
// changes the attribute changes every spinner at once, drawn or not yet drawn.
// Without the spinner sheet only the arc is shown, still.
const SVG_NS = 'http://www.w3.org/2000/svg';
const SPINNER_GRID = 24;
const SPINNER_STROKE = 2;
const SPINNER_LIVE_AREA = 20;
const SPINNER_LOOKS = ['arc', 'breathing', 'comet', 'dots'];
const SPINNER_DEFAULT_LOOK = 'arc'; // The dots look on the grid: a ring of dots as big as the stroke allows, so at
// every step the dots are the step's and no attribute sizes them.

const SPINNER_DOTS = 8;
const SPINNER_DOTS_FILLED = 3; // The comet: a head and a tail a little under half the ring, in segments whose
// opacity falls towards the end of the tail. Segments rather than a gradient,
// because an SVG gradient cannot follow a circle and a CSS one would leave the
// ring and its stroke; each segment strokes in the current ink.

const COMET_SEGMENTS = 10;
const COMET_LENGTH = 40;
function normalizeSpinnerLook(value, fallback = SPINNER_DEFAULT_LOOK) {
  const look = String(value ?? '').trim().toLowerCase();
  return SPINNER_LOOKS.includes(look) ? look : fallback;
}
function createSvgNode(tagName, attributes = {}) {
  const node = document.createElementNS(SVG_NS, tagName);
  Object.entries(attributes).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return;
    }

    node.setAttribute(key, String(value));
  });
  return node;
}

const round = value => Math.round(value * 1000) / 1000; // The four looks in one drawing. On the ladder it is the 24-unit grid with
// stroke 2, every look on the ring of the live area (`inset` 2 units from the
// edge of the box); a spinner still drawn in pixels (the deprecated attributes) passes
// its own width, height and stroke. The circles carry presentation attributes
// as well as their classes: the spinner sheet styles them (track colour, the
// motion of each look, the still frame under reduced motion), and until that
// sheet has arrived they draw a faint ring and the arc in the current ink
// rather than a filled black disc; the comet and the dots wait hidden. The arc
// is a fixed 30% of the ring (simai/ui-source#13): the sheet turns the drawing,
// the arc itself never changes length.


function createSpinnerSvg({
  width = SPINNER_GRID,
  height = SPINNER_GRID,
  stroke = SPINNER_STROKE,
  dots = SPINNER_DOTS,
  filled = SPINNER_DOTS_FILLED,
  dotRadius = null,
  direction = 'clockwise',
  pixel = false,
  inset = 0
} = {}) {
  const cx = width / 2;
  const cy = height / 2; // The outer edge of every look: the track, the arc, the comet and the dots.

  const half = Math.max(stroke, Math.min(width, height) / 2 - inset);
  const radius = Math.max(1, half - stroke / 2);
  const svg = createSvgNode('svg', {
    class: 'sf-loader-svg',
    viewBox: `0 0 ${width} ${height}`,
    width: pixel ? width : null,
    height: pixel ? height : null,
    'aria-hidden': 'true',
    focusable: 'false'
  });
  const ring = {
    cx,
    cy,
    r: round(radius),
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': stroke
  };
  const track = createSvgNode('circle', {
    class: 'sf-loader-ring-filled',
    ...ring,
    opacity: '0.3'
  });
  const accent = createSvgNode('circle', {
    class: 'sf-loader-ring-accent',
    ...ring,
    'stroke-linecap': 'round',
    pathLength: 100,
    'stroke-dasharray': '30 70',
    transform: `rotate(90 ${cx} ${cy})`
  }); // The comet starts at the top and runs clockwise: segment 0 is the end of the
  // tail, the last one the head, drawn last and with a round cap.

  const comet = createSvgNode('g', {
    class: 'sf-loader-comet',
    display: 'none',
    transform: `rotate(-90 ${cx} ${cy})`
  });
  const segment = COMET_LENGTH / COMET_SEGMENTS;

  for (let index = 0; index < COMET_SEGMENTS; index += 1) {
    const head = index === COMET_SEGMENTS - 1;
    comet.append(createSvgNode('circle', {
      class: `sf-loader-comet-segment${head ? ' sf-loader-comet-head' : ''}`,
      ...ring,
      'stroke-linecap': head ? 'round' : 'butt',
      pathLength: 100,
      'stroke-dasharray': `${round(segment)} ${round(100 - segment)}`,
      'stroke-dashoffset': round(-segment * index),
      opacity: round(((index + 1) / COMET_SEGMENTS) ** 1.6)
    }));
  } // The dots sit on the same ring: a dot as wide as the stroke allows without
  // touching its neighbours, so fewer dots are bigger ones.


  const count = Math.max(3, Math.min(32, Math.floor(Number(dots) || SPINNER_DOTS)));
  const active = Math.max(1, Math.min(count, Math.floor(Number(filled) || SPINNER_DOTS_FILLED)));
  const fitted = Math.min(stroke, 0.7 * Math.PI * (half - stroke) / count);
  const dotR = dotRadius === null || dotRadius === undefined || dotRadius === '' ? fitted : Math.max(1, Math.min(Number(dotRadius) || fitted, half / 4));
  const orbit = Math.max(dotR, half - dotR);
  const dotsGroup = createSvgNode('g', {
    class: 'sf-loader-dots',
    display: 'none',
    style: `--sf-loader-dot-count:${count}; --sf-loader-dot-filled:${active};`
  });

  for (let index = 0; index < count; index += 1) {
    const angle = Math.PI * 2 / count * index - Math.PI / 2;
    const step = direction === 'counterclockwise' ? index : (count - index) % count;
    dotsGroup.append(createSvgNode('circle', {
      class: `sf-loader-dot${index < active ? ' sf-loader-dot--active' : ''}`,
      cx: round(cx + orbit * Math.cos(angle)),
      cy: round(cy + orbit * Math.sin(angle)),
      r: round(dotR),
      fill: 'currentColor',
      style: `--sf-loader-dot-index:${index}; --sf-loader-dot-step:${step};`
    }));
  }

  svg.append(track, accent, comet, dotsGroup);
  return svg;
} // The drawing on the icon grid, the one every spinner on the ladder uses: the
// ring in the icon's live area, 20 of the 24 units.

function createLadderSpinnerSvg(options = {}) {
  return createSpinnerSvg({ ...options,
    width: SPINNER_GRID,
    height: SPINNER_GRID,
    stroke: SPINNER_STROKE,
    dotRadius: null,
    pixel: false,
    inset: (SPINNER_GRID - SPINNER_LIVE_AREA) / 2
  });
} // A spinner that stands in a control: endless, decorative (the control keeps
// its label and says aria-busy), and marked bound so the spinner component,
// when it is on the page, leaves it as drawn. `className` names the control's
// slot for it; `overlay` lays it over the control's hidden label instead of in
// the place of an icon. Its look is the page's, as every spinner's.

function createInlineSpinner({
  className = '',
  overlay = false
} = {}) {
  const root = document.createElement('span');
  root.className = ['sf-loader-container', 'sf-loader--infinite', className, className && overlay ? `${className}--overlay` : ''].filter(Boolean).join(' ');
  root.dataset.sfSpinnerBound = '1';
  root.dataset.infinite = 'true';
  root.setAttribute('aria-hidden', 'true');
  const indicator = document.createElement('span');
  indicator.className = 'sf-loader--loading-indicator';
  indicator.append(createLadderSpinnerSvg());
  root.append(indicator);
  return root;
}

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
  expired,
  package: pkg
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
  if (removeAfter !== undefined) note.remove_after = removeAfter; // The component package that ships the new name, for a package's element.

  if (pkg) note.package = pkg;
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

/***/ "bef9a721ac58"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "c71a77b9cdfb"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{".sf-button":["display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","justify-content/center (.justify-center)","align-items/center (.items-center)"],".sf-button .sf-icon":["display/flex (.flex)","justify-content/center (.justify-center)","align-items/center (.items-center)"],".sf-button .sf-button-text-container":["display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","justify-content/center (.justify-center)","align-items/center (.items-center)"]}');

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
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("bef9a721ac58");
/* harmony import */ var _js_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("757f80eca5ff");
/**
* SIMAI Framework
* Copyright 2008-2026 SIMAI Ltd
* http://simai.studio
* Read the license: http://framework.simai.studio/license/
* Documentation: http://framework.simai.studio/
* Support: http://simai.studio/support/
*
* BUTTONS
*
* Entry point for importing components from this directory.
* Simplifies the import process in other parts of the project.
* Instead of importing individual files, all component can be imported through this file.
*/


})();

/******/ })()
;