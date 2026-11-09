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

/***/ "19011fe45e0a"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("a1821b2f45eb");
/* harmony import */ var _core_js_control_spacing__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("9abcb852f1cf");
/* harmony import */ var _helpers_anchored_badge__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("34addf781b5b");
/* harmony import */ var _helpers_cycle__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("64feefebb417");
/* harmony import */ var _core_js_deprecations__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("d3818183b14c");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("79f8b9b70d88");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("c402762d3a76");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("65ba19e2ea5c");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("78f638fb05ab");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_2__, _core_js_control_spacing__WEBPACK_IMPORTED_MODULE_3__, _helpers_anchored_badge__WEBPACK_IMPORTED_MODULE_4__, _core_js_deprecations__WEBPACK_IMPORTED_MODULE_6__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_2__, _core_js_control_spacing__WEBPACK_IMPORTED_MODULE_3__, _helpers_anchored_badge__WEBPACK_IMPORTED_MODULE_4__, _core_js_deprecations__WEBPACK_IMPORTED_MODULE_6__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_control_spacing__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_core_js_control_spacing__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _core_js_deprecations__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_core_js_deprecations__WEBPACK_IMPORTED_MODULE_6__);











const COMPONENT_ATTRIBUTES = new Set(['template', 'kind', 'variant', 'size', 'appearance', 'type', 'scheme', 'status', 'icon', 'filled', 'spacing', 'tightness', 'radius', 'segment', 'root-class', 'loading', 'disabled', 'native-type', 'pressed', 'label-pressed', 'cycle', 'theme-cycle', 'value', 'button-attributes', 'aria-label', ..._helpers_anchored_badge__WEBPACK_IMPORTED_MODULE_4__.ANCHORED_BADGE_ATTRIBUTES, 'class', 'style', 'id', 'slot']);

function applyButtonAttributes(host, button) {
  host?.forwardHostAttributes(button, {
    exclude: COMPONENT_ATTRIBUTES,
    transferDataAttributes: true,
    storageKey: '__sfIconButtonForwardedDataAttributes',
    targetStorageKey: '__sfIconButtonAttributeKeys'
  });
} // sf-button-icon from its component.json (standard simai.smart-component
// 1.3.8 §3, §4): the settings are the attributes and properties
// core/js/element-manifest.js makes from the manifest. The legacy names type,
// variant and tightness, and tightness's words, are dated aliases
// (aliases.json, until 2026-12-01); a value outside a list reads as the
// default, as sf-button's does.


const IconButtonElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_7__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_9__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_10__
  },
  source: 'ru',
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_8__
}); // The looks C15 retired (docs review R033): surface is drawn as tonal with
// the on-surface scheme, secondary as on-surface-variant. surface changes two
// settings, which a value alias cannot do, so the component reads the word
// itself and notes the use (change journal value-icon-button-looks-c15).

const RETIRED_APPEARANCE = 'surface';

class SfIconButton extends IconButtonElement {
  // aria-label is the host's (§3.1), not a setting, so the manifest makes no
  // attribute of it; it is watched here, or a name changed after the first
  // drawing never reached the button (sf-language's «Язык: Русский» stayed
  // after a choice, 2026-11-06). updateDom patches it.
  static get observedAttributes() {
    return [...new Set([...super.observedAttributes, 'aria-label'])];
  }

  constructor() {
    super();
    this._attributeObserver = null;
  } // appearance: the retired surface reads as tonal; link, the former name of
  // ghost, is mapped by the dated alias before it gets here.


  get retiredSurface() {
    return (this.getAttribute('appearance') ?? this.getAttribute('type')) === RETIRED_APPEARANCE;
  }

  get appearance() {
    if (this.retiredSurface) {
      (0,_core_js_deprecations__WEBPACK_IMPORTED_MODULE_6__.noteDeprecated)({
        component: 'sf-button-icon',
        tag: 'sf-button-icon',
        kind: 'value',
        attribute: 'appearance',
        from: 'surface',
        to: 'tonal',
        since: '2026-11-08',
        remove_after: '2027-01-01'
      });
      return 'tonal';
    }

    return super.appearance;
  }

  set appearance(value) {
    super.appearance = value;
  } // scheme: surface brings on-surface with it unless the page named a scheme.


  get scheme() {
    if (this.retiredSurface && !this.hasAttribute('scheme')) return 'on-surface';
    return super.scheme;
  }

  set scheme(value) {
    super.scheme = value;
  } // The cycle (D11d): null when the button is not one.


  cycleState() {
    if (!(0,_helpers_cycle__WEBPACK_IMPORTED_MODULE_5__.hasCycle)(this)) return null;
    return (0,_helpers_cycle__WEBPACK_IMPORTED_MODULE_5__.cycleState)(this, {
      base: this.getAttribute('aria-label') || '',
      words: (key, options) => this.sfWord(key, options)
    });
  }

  static get props() {
    return { ...super.props,
      // The attribute takes JSON or value::label::flags|…; the property a list.
      cycle: {
        type: Array,
        default: [],
        parser: _helpers_cycle__WEBPACK_IMPORTED_MODULE_5__.parseCycle
      }
    };
  } // cycle is a list setting (§4.2) whose attribute keeps its JSON form: a
  // list set as a property stays the instance's own, as sf-segmented's items.


  get cycle() {
    return this.getProp('cycle');
  }

  set cycle(value) {
    Object.defineProperty(this, 'cycle', {
      configurable: true,
      enumerable: true,
      writable: true,
      value
    });
    this.requestComponentUpdate?.('cycle');
  }

  get templateName() {
    return this.getAttribute('template') || 'default';
  }

  get rootClass() {
    return this.getAttribute('root-class') || '';
  } // pressed is optional: absent, the button is not a toggle and says nothing;
  // present, aria-pressed and the selected look follow it.


  get pressed() {
    // A cycle is not a toggle: pressed is ignored beside it.
    if ((0,_helpers_cycle__WEBPACK_IMPORTED_MODULE_5__.hasCycle)(this)) return undefined;
    return this.hasAttribute('pressed') ? super.pressed : undefined;
  }

  set pressed(value) {
    if (value === undefined || value === null) this.removeAttribute('pressed');else this.setAttribute('pressed', value ? '' : 'false');
  }

  templateContext() {
    const props = this.getPropsContext();
    const cycle = this.cycleState();
    if (cycle) (0,_helpers_cycle__WEBPACK_IMPORTED_MODULE_5__.warnCycleToggle)(this, ['pressed', 'label-pressed']);
    const announce = Boolean(cycle && this.__sfCycleAnnounce);
    this.__sfCycleAnnounce = false;
    return this.createTemplateContext({ ...props,
      // Resolved names the template reads (contracts/template-context.json):
      // the canonical axes under their legacy names too, never the dated
      // aliases themselves (reading them would note a use on every render).
      type: this.appearance,
      variant: this.kind,
      kind: this.kind,
      appearance: this.appearance,
      size: this.size,
      scheme: this.scheme,
      status: this.status,
      segment: this.segment,
      nativeType: this.nativeType,
      radius: this.radius,
      ariaLabel: this.getAttribute('aria-label') || '',
      pressed: cycle ? undefined : this.pressed,
      labelPressed: cycle ? '' : this.labelPressed,
      // The cycle's current item: its icon, its pressed look, its name and
      // the tooltip; the announcement after a press.
      // cycleView, not cycle: `cycle` is the setting (the list of items).
      cycleView: cycle ? {
        icon: cycle.item.icon,
        pressedLook: cycle.item.pressed,
        name: cycle.name,
        tooltip: cycle.tooltip,
        announcement: announce ? cycle.name : ''
      } : null,
      ...(0,_core_js_control_spacing__WEBPACK_IMPORTED_MODULE_3__.resolveControlSpacing)({
        spacing: this.getAttribute('spacing')
      }),
      badge: this.badgeState?.(),
      component: this
    });
  } // The count or dot on the button and what it says (simai/ui-source#12).


  badgeState() {
    return (0,_helpers_anchored_badge__WEBPACK_IMPORTED_MODULE_4__.elementBadge)(this);
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_2__.renderIconButtonTemplate)(this.templateContext());
  }

  resolveUpdateMode(changedAttributes = []) {
    // loading is drawn by the template, not patched: it puts the spinner in
    // place of the icon (simai/ui-source#10).
    const directPatchAttributes = ['disabled', 'aria-label', 'icon']; // A cycle's name and icon come from its item: drawn, not patched.

    if (this.cycleState()) return 'lit';

    if (changedAttributes.length > 0 && changedAttributes.every(attr => directPatchAttributes.includes(attr))) {
      return 'dom';
    }

    return 'lit';
  }

  updateDom(changedAttributes = []) {
    const button = this.querySelector('.sf-icon-button');
    if (!button) return false;

    if (changedAttributes.includes('disabled')) {
      button.disabled = this.disabled || this.loading;
    }

    if (changedAttributes.includes('aria-label')) {
      // While a toggle with label-pressed is on, its pressed name stands.
      const label = this.pressed === true && this.labelPressed || this.getAttribute('aria-label') || '';

      if (label) {
        button.setAttribute('aria-label', (0,_helpers_anchored_badge__WEBPACK_IMPORTED_MODULE_4__.nameWithBadge)(label, (0,_helpers_anchored_badge__WEBPACK_IMPORTED_MODULE_4__.elementBadge)(this).phrase));
      } else {
        button.removeAttribute('aria-label');
      }
    }

    if (changedAttributes.includes('icon')) {
      // The glyph is sf-icon's: its icon setting is changed, and it draws the
      // name and asks the Loader for it. Writing the glyph's text here took
      // lit's markers out of sf-icon's drawing and left its icon attribute on
      // the old name; moved afterwards (sf-drawer taking its column under
      // body), the icon drew again and threw "Cannot set properties of null
      // (setting 'data')".
      const iconElement = button.querySelector(':scope > sf-icon');

      if (iconElement) {
        iconElement.setAttribute('icon', this.icon);
      } else if (!this.loading) {
        return false;
      }
    }

    applyButtonAttributes(this, button);
    return true;
  }

  afterRender() {
    const button = this.querySelector('.sf-icon-button');
    applyButtonAttributes(this, button); // The cycle's tooltip names the current and the next value; it stands
    // over a title the page forwarded.

    const cycle = this.cycleState();
    if (button && cycle) button.setAttribute('title', cycle.tooltip);

    if (!this._attributeObserver) {
      this._attributeObserver = this.observeForwardedHostAttributes(() => this.querySelector('.sf-icon-button'), {
        exclude: COMPONENT_ATTRIBUTES,
        transferDataAttributes: true,
        storageKey: '__sfIconButtonForwardedDataAttributes',
        targetStorageKey: '__sfIconButtonAttributeKeys'
      })._forwardHostAttributeObserver;
    }
  } // The native button is what takes focus: the host lays out as
  // display:contents and takes none, so focus() on the host did nothing and
  // left document.activeElement where it was. A product that holds the host --
  // from a querySelector() of sf-button-icon, or from closest() on a data-* match --
  // focuses it and reaches the control through this.


  focusDelegate() {
    return this.querySelector('.sf-icon-button');
  }

  get value() {
    return {
      template: this.templateName,
      size: this.size,
      variant: this.kind,
      appearance: this.appearance,
      type: this.appearance,
      scheme: this.scheme,
      status: this.status,
      icon: this.icon,
      segment: this.segment,
      filled: this.filled,
      tightness: (0,_core_js_control_spacing__WEBPACK_IMPORTED_MODULE_3__.resolveControlSpacing)({
        spacing: this.getAttribute('spacing')
      }).tightness,
      spacing: this.spacing,
      radius: this.radius,
      rootClass: this.rootClass,
      loading: this.loading,
      disabled: this.disabled,
      nativeType: this.nativeType,
      ariaLabel: this.getAttribute('aria-label') || '',
      badgeCount: this.getProp('badgeCount'),
      badgeDot: this.getProp('badgeDot'),
      badgeCap: this.getProp('badgeCap'),
      badgeLabel: this.getProp('badgeLabel')
    };
  } // button-attributes is a writable object setting (component.json); this
  // helper writes it for an external project template, which reads it from
  // the props context. It is not an action (§4.4).


  setButtonAttributes(attributes = {}) {
    this.buttonAttributes = attributes;
    return this;
  }

  onClick(handler, options) {
    if (typeof handler === 'function') {
      this.addEventListener('click', handler, options);
    }

    return this;
  }

  onFocus(handler, options) {
    if (typeof handler === 'function') {
      this.addEventListener('focusin', handler, options);
    }

    return this;
  }

  onBlur(handler, options) {
    if (typeof handler === 'function') {
      this.addEventListener('focusout', handler, options);
    }

    return this;
  }

  onMouseEnter(handler, options) {
    if (typeof handler === 'function') {
      this.addEventListener('mouseenter', handler, options);
    }

    return this;
  }

  onMouseLeave(handler, options) {
    if (typeof handler === 'function') {
      this.addEventListener('mouseleave', handler, options);
    }

    return this;
  }

  setDisabled(nextValue = true) {
    if (nextValue) {
      this.setAttribute('disabled', '');
    } else {
      this.removeAttribute('disabled');
    }

    return this;
  }

  set value(nextValue) {
    this.setValueAttributes(nextValue);
  }

  onConnected() {
    if (!this._cyclePress) {
      // A person's press moves the cycle: the click of the native button.
      this._cyclePress = event => {
        const button = this.querySelector('.sf-icon-button');
        if (!button || !(event.target instanceof Node) || !button.contains(event.target) || button.disabled) return;
        (0,_helpers_cycle__WEBPACK_IMPORTED_MODULE_5__.pressCycle)(this, this.cycleState());
      };

      this.addEventListener('click', this._cyclePress);
    }

    if (!this._cycleTheme) {
      // A theme cycle follows the theme wherever it was set.
      this._cycleTheme = () => (0,_helpers_cycle__WEBPACK_IMPORTED_MODULE_5__.themeCycleFollow)(this);

      globalThis.addEventListener?.('sf-theme-change', this._cycleTheme);
    }

    super.onConnected?.();
  }

  onDisconnected() {
    if (this._cyclePress) {
      this.removeEventListener('click', this._cyclePress);
      this._cyclePress = null;
    }

    if (this._cycleTheme) {
      globalThis.removeEventListener?.('sf-theme-change', this._cycleTheme);
      this._cycleTheme = null;
    }

    this.disconnectForwardedHostAttributes();
    this._attributeObserver = null;
    super.onDisconnected?.();
  }

}

SfIconButton.define('sf-button-icon');
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "a1821b2f45eb"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderIconButtonTemplate: () => (/* binding */ renderIconButtonTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var _default_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("a31bb12777e0");
/* harmony import */ var _component_spinner_js_spinner_draw__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("50d2a204ba4c");
/* harmony import */ var _helpers_anchored_badge__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("34addf781b5b");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, _helpers_anchored_badge__WEBPACK_IMPORTED_MODULE_3__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, _helpers_anchored_badge__WEBPACK_IMPORTED_MODULE_3__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);




const ICON_BUTTON_SIZES = new Set(['1/3', '1/2', '1', '2', '3']); // The drawing class of each appearance; surface is resolved to tonal by the
// element (C15), a value off the list draws the default.

const ICON_BUTTON_LOOK = {
  default: 'default',
  tonal: 'tonal',
  outline: 'outline',
  ghost: 'link',
  link: 'link',
  surface: 'surface'
};

function statusClasses(status, scheme) {
  if (status === 'danger' || status === 'error') return ['sf-icon-button--danger', 'sf-icon-button--error']; // secondary was retired (C15): drawn as on-surface-variant.

  const colour = scheme === 'secondary' ? 'on-surface-variant' : scheme || 'primary'; // on-surface-variant is the on-surface family one step quieter: both
  // classes, so every on-surface rule holds and one rule quietens it.

  return colour === 'on-surface-variant' ? ['sf-icon-button--on-surface-variant', 'sf-icon-button--on-surface'] : [`sf-icon-button--${colour}`];
}

function renderIconButtonTemplate(context) {
  const {
    size,
    appearance,
    type,
    scheme,
    status,
    icon,
    segment,
    tightness,
    kind,
    variant,
    radius,
    filled,
    rootClass,
    loading,
    disabled,
    nativeType,
    ariaLabel,
    badge
  } = context;
  const rootClasses = ['sf-icon-button', // The sizes the icon button draws; a close may be smaller (1/4, the
  // closable tag's), and then sf-button-close sizes it alone: the class it got
  // here had no rule (documentation trial 6, 2026-10-18).
  ICON_BUTTON_SIZES.has(size || '1') ? `sf-icon-button--size-${size || '1'}` : '', `sf-icon-button--${kind ?? variant ?? 'icon'}`, // ghost is drawn by the link class, the one the sheets and their
  // consumers select (link was ghost's twin; C15 made ghost the name).
  `sf-icon-button--${ICON_BUTTON_LOOK[appearance || type] || 'default'}`, 'flex', 'items-cross-center', segment ? `segment-${segment}` : '', // One colour name, as the styles expect: the status when one is set, the
  // scheme otherwise. A status says what the control is about -- an error
  // for something destructive -- and a scheme says which colour family it
  // takes; they cannot both paint it.
  // danger is a control's status (C13), drawn with the error roles: the
  // class is the danger one and the error one the sheets also select.
  ...statusClasses(status, scheme), tightness ? `tightness-${tightness}` : '', radius ? `radius-${radius}` : '', rootClass, loading ? 'loading sf-icon-button-state-loading' : '', // A toggle that is on wears the pressed look (component.icon-buttons
  // 1.3.0, rule C12): the class carries it whether or not aria-pressed is said.
  context.pressed || context.cycleView?.pressedLook ? 'sf-icon-button--pressed' : ''].filter(Boolean); // A toggle whose name changes (label-pressed, 1.5.0): «Добавить в избранное»
  // at rest, «Убрать из избранного» while on. The name then says the state,
  // so aria-pressed is not written as well (docs review R028, rule C12).

  const name = context.cycleView ? context.cycleView.name : context.pressed === true && context.labelPressed ? context.labelPressed : ariaLabel;
  const announcesPressed = context.pressed !== undefined && !context.labelPressed; // Loading shows the spinner in place of the icon, at the icon's size
  // (simai/ui-source#10); the button keeps its name and says aria-busy.

  const iconContent = loading ? (0,_component_spinner_js_spinner_draw__WEBPACK_IMPORTED_MODULE_2__.createInlineSpinner)({
    className: 'sf-icon-button-spinner'
  }) : context.component?.hasSlotContent?.('icon') ? context.component.getSlotContent('icon') : (kind ?? variant) === 'close' ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                            <sf-button-close root-class="pointer-event-none" size="${size || '1'}"></sf-button-close>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                            <sf-icon filled="${filled || context.pressed === true || Boolean(context.cycleView?.pressedLook)}" root-class="pointer-event-none" icon="${context.cycleView?.icon || icon}" weight="400" aria-hidden="true"></sf-icon>`;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <button
                type=${nativeType}
                class=${rootClasses.join(' ')}
                style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ?disabled=${disabled || loading}
                aria-label=${name ? (0,_helpers_anchored_badge__WEBPACK_IMPORTED_MODULE_3__.nameWithBadge)(name, badge?.phrase) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                aria-busy=${loading ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                aria-pressed=${announcesPressed ? String(Boolean(context.pressed)) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        >
            ${iconContent}${(0,_helpers_anchored_badge__WEBPACK_IMPORTED_MODULE_3__.renderAnchoredBadge)(badge)}${name ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : (0,_helpers_anchored_badge__WEBPACK_IMPORTED_MODULE_3__.renderAnchoredBadgeText)(badge, false)}
        </button>${context.cycleView ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-icon-button-announce sr-only" role="status" aria-live="polite" aria-atomic="true">${context.cycleView.announcement}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
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

/***/ "64feefebb417"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   THEME_ICONS: () => (/* binding */ THEME_ICONS),
/* harmony export */   cycleItems: () => (/* binding */ cycleItems),
/* harmony export */   cycleState: () => (/* binding */ cycleState),
/* harmony export */   hasCycle: () => (/* binding */ hasCycle),
/* harmony export */   nextTheme: () => (/* binding */ nextTheme),
/* harmony export */   parseCycle: () => (/* binding */ parseCycle),
/* harmony export */   pressCycle: () => (/* binding */ pressCycle),
/* harmony export */   themeCycleFollow: () => (/* binding */ themeCycleFollow),
/* harmony export */   themeCycleValues: () => (/* binding */ themeCycleValues),
/* harmony export */   themePreference: () => (/* binding */ themePreference),
/* harmony export */   visibleTheme: () => (/* binding */ visibleTheme),
/* harmony export */   warnCycleToggle: () => (/* binding */ warnCycleToggle)
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
/** The theme drawn now (light or dark), whatever the preference. */


function visibleTheme() {
  const theme = loader()?.theme;
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
}

/***/ },

/***/ "a31bb12777e0"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "9abcb852f1cf"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("control-spacing", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("control-spacing", 1).then(resolve, reject), { once: true })));

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

/***/ "43090d1c8307"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("page-language", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("page-language", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "deb1a4d61565"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("smart-base", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("smart-base", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "c402762d3a76"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-button-icon for the shim (stands/18-aliases-ci/alias.mjs, standard §16 item 20). mode: same-detail (the shim sends the new and the old name), split / detail-adds (a detail adapter, refused by the shim), attribute-and-property, method, property, manifest-only (the DOM name does not change), host-attribute (no shim), retired.","component":"sf-button-icon","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"aria-label","to":null,"kind":"attribute","component":"sf-button-icon","since":"2026-10-27","remove_after":"2026-12-01","mode":"host-attribute","section":"§3.1","note":"stays a host attribute, read by the base (§3.1, §4.8); no shim"},{"from":"type","to":"appearance","kind":"setting","component":"sf-button-icon","since":"2026-10-27","remove_after":"2026-12-01","section":"§16 item 20, contracts/public-api-axes.json","note":"the legacy axis name; the shim maps the attribute and the property"},{"from":"variant","to":"kind","kind":"setting","component":"sf-button-icon","since":"2026-10-27","remove_after":"2026-12-01","section":"§16 item 20, contracts/public-api-axes.json","note":"the legacy axis name; the shim maps the attribute and the property"},{"from":"tightness","to":"spacing","kind":"setting","component":"sf-button-icon","since":"2026-10-27","remove_after":"2026-12-01","section":"§16 item 20","note":"journal attribute-tightness-to-spacing; its words are spacing\'s value aliases below, spacing wins when both are given"},{"from":"low","to":"compact","kind":"value","setting":"spacing","component":"sf-button-icon","since":"2026-10-27","remove_after":"2026-12-01","section":"§16 item 20","note":"tightness\'s word, journal attribute-tightness-to-spacing"},{"from":"high","to":"comfortable","kind":"value","setting":"spacing","component":"sf-button-icon","since":"2026-10-27","remove_after":"2026-12-01","section":"§16 item 20","note":"tightness\'s word, journal attribute-tightness-to-spacing"},{"from":"highest","to":"spacious","kind":"value","setting":"spacing","component":"sf-button-icon","since":"2026-10-27","remove_after":"2026-12-01","section":"§16 item 20","note":"tightness\'s word, journal attribute-tightness-to-spacing"},{"from":"link","to":"ghost","kind":"value","setting":"appearance","component":"sf-button-icon","since":"2026-11-08","remove_after":"2027-01-01","section":"§16 item 20","note":"journal value-icon-button-looks-c15 (rule C15): link and ghost drew the same; ghost is the name"},{"from":"secondary","to":"on-surface-variant","kind":"value","setting":"scheme","component":"sf-button-icon","since":"2026-11-08","remove_after":"2027-01-01","section":"§16 item 20","note":"journal value-icon-button-looks-c15 (rule C15): secondary was drawn only in the tonal look and read as the quiet neutral elsewhere"},{"from":"error","to":"danger","kind":"value","setting":"status","component":"sf-button-icon","since":"2026-11-08","remove_after":"2027-01-01","section":"§16 item 20","note":"journal value-control-status-error-to-danger (rule C13): a control\'s destructive status is danger; messages keep error"},{"from":"sf-icon-button","to":"sf-button-icon","kind":"tag","component":"sf-button-icon","since":"2026-11-03","remove_after":"2027-01-01","section":"rename plan R0 (ui-control RENAME-PLAN-2026-11-03), naming decision 2026-11-02","note":"the element is sf-button-icon; sf-icon-button is a subclass defined beside it until the date"}]}');

/***/ },

/***/ "79f8b9b70d88"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.button-icon","tag":"sf-button-icon","version":"1.7.1","kind":"leaf","settings":{"kind":{"type":"enum","values":["icon","close"],"default":"icon"},"size":{"type":"enum","values":["1/3","1/2","1","2","3"],"default":"1"},"appearance":{"type":"enum","values":["default","tonal","outline","ghost"],"default":"default"},"scheme":{"type":"enum","values":["primary","on-surface","on-surface-variant"],"default":"primary"},"status":{"type":"enum","values":["","danger"],"default":""},"segment":{"type":"enum","values":["","start","middle","end"],"default":""},"icon":{"type":"icon","default":"add"},"filled":{"type":"boolean","default":false},"spacing":{"type":"enum","values":["compact","normal","comfortable","spacious"],"default":"normal"},"radius":{"type":"enum","values":["","default","square","rounded"],"default":""},"loading":{"type":"boolean","default":false},"disabled":{"type":"boolean","default":false},"native-type":{"type":"enum","values":["button","submit","reset"],"default":"button"},"badge-count":{"type":"string","default":""},"badge-dot":{"type":"boolean","default":false},"badge-cap":{"type":"number","integer":true,"min":1,"default":99},"badge-label":{"type":"string","default":""},"button-attributes":{"type":"object"},"pressed":{"type":"boolean","optional":true},"label-pressed":{"type":"string","default":""},"cycle":{"type":"list","default":[],"of":{"value":"string","label":"string","icon":{"type":"icon","optional":true},"lang":{"type":"string","optional":true},"pressed":{"type":"boolean","optional":true}}},"theme-cycle":{"type":"string","optional":true},"value":{"type":"string","default":""}},"values":{},"events":{"change":{"carries":{"previous":"string","value":"string","item":{"type":"object","nullable":true}}}},"actions":{},"css-variables":{"--sf-icon-button-background-color":{"type":"color","state":"default"},"--sf-icon-button-color":{"type":"color","state":"default"},"--sf-icon-button-border-color":{"type":"color","state":"default"},"--sf-icon-button-border-width":{"type":"length","state":"default"},"--sf-icon-button-radius":{"type":"length","state":"default"},"--sf-icon-button-padding-inline":{"type":"length","state":"default"},"--sf-icon-button-padding-block":{"type":"length","state":"default"},"--sf-icon-button-pressed-background-color":{"type":"color","state":"pressed"},"--sf-icon-button-pressed-color":{"type":"color","state":"pressed"}}}');

/***/ },

/***/ "65ba19e2ea5c"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Icon Buttons","runtime":{"theme":"Theme","theme-system":"system","theme-light":"light","theme-dark":"dark","theme-system-now":"system (now {theme})","cycle-next":"{name}. Press for {next}"}}');

/***/ },

/***/ "78f638fb05ab"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Кнопки с иконкой","runtime":{"theme":"Тема","theme-system":"как в системе","theme-light":"светлая","theme-dark":"тёмная","theme-system-now":"как в системе (сейчас {theme})","cycle-next":"{name}. Нажмите — {next}"}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("19011fe45e0a");
/******/
/******/ })()
;