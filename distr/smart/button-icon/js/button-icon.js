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

/***/ "d0aecec474fa"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   repeatsName: () => (/* binding */ repeatsName),
/* harmony export */   spokenText: () => (/* binding */ spokenText),
/* harmony export */   tooltipText: () => (/* binding */ tooltipText),
/* harmony export */   triggerName: () => (/* binding */ triggerName)
/* harmony export */ });
// A tooltip that only says what the trigger's name already says is not the
// trigger's description too, or a screen reader says it twice: an icon button
// named «Повторить Отчёт.xlsx» with the tooltip «Повторить» was heard as
// «Повторить Отчёт.xlsx, Повторить» (sf-file-download, file rows, 2026-11-16).
// Before, only a tooltip equal to the name was left out (docs trial 4,
// 2026-10-15); now a tooltip whose words stand whole inside the name is too.
// The tooltip is still drawn; only the link for assistive technology goes.
// Pure functions over the DOM, no imports: the tooltip controller and
// sf-button-icon's name tooltip read the same rule.
const squash = text => String(text ?? '').replace(/\s+/gu, ' ').trim().toLocaleLowerCase();

const escape = text => text.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&'); // Parts a reader does not hear as words of the tooltip: the keys of its
// shortcut (said on the trigger by aria-keyshortcuts, KB-4) and the tail.


const UNSAID = '.sf-tooltip-shortcut, .sf-tooltip-tail'; // The words a node says: text of its descendants, without hidden or
// aria-hidden ones (an icon's ligature, a status seen only) and without the
// parts named by skip.

function spokenText(node, skip = '') {
  if (!node) return '';
  let words = '';

  for (const child of node.childNodes ?? []) {
    if (child.nodeType === 3) {
      words += child.data;
    } else if (child.nodeType === 1) {
      if (child.hidden || child.getAttribute?.('aria-hidden') === 'true') continue;
      if (skip && child.matches?.(skip)) continue;
      words += ` ${spokenText(child, skip)} `;
    }
  }

  return words;
} // The trigger's accessible name, as near as a page can read it: the elements
// aria-labelledby names, else aria-label, else its own words (without a
// tooltip surface standing inside it), else its title.

function triggerName(trigger, surface = null) {
  if (!trigger?.getAttribute) return '';
  const doc = trigger.ownerDocument;
  const ids = String(trigger.getAttribute('aria-labelledby') || '').split(/\s+/u).filter(Boolean);

  if (ids.length && doc) {
    const labelled = ids.map(id => doc.getElementById(id)?.textContent || '').join(' ');
    if (squash(labelled)) return labelled;
  }

  const label = trigger.getAttribute('aria-label');
  if (squash(label)) return label;
  const surfaceSelector = surface?.id ? `#${globalThis.CSS?.escape ? CSS.escape(surface.id) : surface.id}` : '';
  const own = spokenText(trigger, [UNSAID, surfaceSelector, '.sf-tooltip', 'sf-tooltip'].filter(Boolean).join(', '));
  if (squash(own)) return own;
  return trigger.getAttribute('title') || '';
} // What the tooltip says: its text and supporting text, without the keys. A
// Smart <sf-tooltip> not drawn yet says its text and supporting-text settings.

function tooltipText(surface) {
  if (!surface) return '';
  const drawn = spokenText(surface, UNSAID);
  if (squash(drawn)) return drawn;

  if (surface.localName === 'sf-tooltip') {
    return [surface.getAttribute('text'), surface.getAttribute('supporting-text')].filter(Boolean).join(' ');
  }

  return '';
} // Whether the tooltip's words stand whole inside the name: equal, or a run of
// whole words of it («Повторить» in «Повторить Отчёт.xlsx», not «Ред» in
// «Редактировать»). An empty tooltip or name repeats nothing.

function repeatsName(name, said) {
  const whole = squash(name);
  const part = squash(said);
  if (!whole || !part) return false;
  if (whole === part) return true;
  return new RegExp(`(?:^|[^\\p{L}\\p{N}])${escape(part)}(?:$|[^\\p{L}\\p{N}])`, 'u').test(whole);
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
/* harmony import */ var _component_tooltip_js_name_repeat_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("d0aecec474fa");
/* harmony import */ var _helpers_cycle__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("64feefebb417");
/* harmony import */ var _core_js_deprecations__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("d3818183b14c");
/* harmony import */ var _helpers_control_status__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("60a3f9a6662c");
/* harmony import */ var _helpers_button_set__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("d9c5a43b5214");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("79f8b9b70d88");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("c402762d3a76");
/* harmony import */ var _lang_index_mjs__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__("a2fbabeb2195");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_2__, _core_js_control_spacing__WEBPACK_IMPORTED_MODULE_3__, _helpers_anchored_badge__WEBPACK_IMPORTED_MODULE_4__, _core_js_deprecations__WEBPACK_IMPORTED_MODULE_7__, _helpers_button_set__WEBPACK_IMPORTED_MODULE_9__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_2__, _core_js_control_spacing__WEBPACK_IMPORTED_MODULE_3__, _helpers_anchored_badge__WEBPACK_IMPORTED_MODULE_4__, _core_js_deprecations__WEBPACK_IMPORTED_MODULE_7__, _helpers_button_set__WEBPACK_IMPORTED_MODULE_9__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_control_spacing__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_core_js_control_spacing__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _core_js_deprecations__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_core_js_deprecations__WEBPACK_IMPORTED_MODULE_7__);












 // Only the words on screen ship in the bundle, English only (owner decision
// C282): Russian and every other language come from a language file. The
// title, settings and events stay in the language files for the Studio and the
// docs (localization study LC-2).

const COMPONENT_ATTRIBUTES = new Set(['template', 'kind', 'variant', 'size', 'height', 'appearance', 'type', 'scheme', 'status', 'icon', 'filled', 'spacing', 'tightness', 'radius', 'segment', 'root-class', 'loading', 'disabled', 'native-type', 'href', 'target', 'rel', 'download', 'pressed', 'label-pressed', 'tooltip', // The host's title is the name tooltip's text (C160 (1)), not forwarded.
'title', 'cycle', 'theme-cycle', 'value', 'button-attributes', 'aria-label', ..._helpers_anchored_badge__WEBPACK_IMPORTED_MODULE_4__.ANCHORED_BADGE_ATTRIBUTES, 'class', 'style', 'id', 'slot']);

function applyButtonAttributes(host, button) {
  host?.forwardHostAttributes(button, {
    exclude: COMPONENT_ATTRIBUTES,
    transferDataAttributes: true,
    storageKey: '__sfIconButtonForwardedDataAttributes',
    targetStorageKey: '__sfIconButtonAttributeKeys'
  });
} // href (1.9.0) takes sf-button's addresses: a relative one, a fragment,
// http(s), mailto and tel. Any other scheme (javascript:, data:) draws the
// icon button as a button.


const SAFE_HREF = /^(?:[^:/?#]*(?:[/?#]|$)|https?:|mailto:|tel:)/iu;

function linkAddress(value) {
  const href = String(value || '').trim();
  return href && SAFE_HREF.test(href) ? href : '';
} // A link that opens a new tab says noopener noreferrer unless the page wrote
// its own rel, as sf-button's.


function linkRelation(target, rel) {
  const own = String(rel || '').trim();
  if (own) return own;
  return String(target || '').trim().toLowerCase() === '_blank' ? 'noopener noreferrer' : '';
} // sf-button-icon from its component.json (standard simai.smart-component
// 1.3.8 §3, §4): the settings are the attributes and properties
// core/js/element-manifest.js makes from the manifest. The legacy names type,
// variant and tightness, and tightness's words, are dated aliases
// (aliases.json, until 2026-12-01); a value outside a list reads as the
// default, as sf-button's does.


const IconButtonElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_10__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: _lang_index_mjs__WEBPACK_IMPORTED_MODULE_12__.files,
  source: 'ru',
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_11__
}); // The name tooltip (owner decision C160 (1)): the icon button shows its name
// as the Framework's tooltip by itself. The surface is the tooltip
// composition (a .sf-tooltip the button names by data-tooltip), linked by the
// tooltip controller (component.tooltip); it is made on the first hover,
// keyboard focus or long press, so nothing is drawn or fetched before -- the
// first-paint markup is unchanged -- and the event that woke it is handed to
// the controller once it has linked the button.

const NAME_TIP = 'sf-icon-button-tooltip';
let nameTips = 0;

function tooltipController() {
  return globalThis.SF?.ComponentRegistry?.Tooltip || globalThis.SF?.Loader?.ComponentRegistry?.Tooltip || null;
} // The controller is there: run now; else ask the Loader for it (a lazy
// relation) and run once it registered.


function whenTooltipReady(run) {
  if (tooltipController()) {
    run();
    return;
  }

  const loader = globalThis.SF?.Loader;
  loader?.ensurePlugin?.('tooltip');
  if (typeof loader?.ready === 'function') loader.ready('Tooltip', () => run());else globalThis.addEventListener?.('Tooltip:ready', () => run(), {
    once: true
  });
} // The looks C15 retired (docs review R033): surface is drawn as tonal with
// the on-surface scheme, secondary as on-surface-variant. surface changes two
// settings, which a value alias cannot do, so the component reads the word
// itself and notes the use (change journal value-icon-button-looks-c15).


const RETIRED_APPEARANCE = 'surface'; // Density on an icon button (owner decision C213, 2026-11-16): size and
// height change it and keep it square, so spacing and tightness draw nothing.
// Read until 2027-01-01, noted in SF.deprecations and said once per button.

function noteIconButtonDensity(element) {
  const said = [['spacing', element.getAttribute('spacing')], ['tightness', element.getAttribute('tightness')]].filter(([, value]) => value && value !== 'normal');
  if (!said.length) return;

  for (const [attribute, from] of said) {
    (0,_core_js_deprecations__WEBPACK_IMPORTED_MODULE_7__.noteDeprecated)({
      component: 'sf-button-icon',
      tag: 'sf-button-icon',
      kind: 'setting',
      attribute,
      from: attribute,
      to: null,
      since: '2026-11-16',
      remove_after: '2027-01-01'
    });
  }

  if (element.__sfDensitySaid) return;
  element.__sfDensitySaid = true;
  globalThis.console?.warn?.(`[SIMAI Framework] sf-button-icon: ${said.map(([a, v]) => `${a}="${v}"`).join(' ')} draws nothing: an icon button has no density (owner decision C213); size and height="low|high|highest" change it and keep it square. Remove it before 2027-01-01.`, element);
}

class SfIconButton extends IconButtonElement {
  // aria-label is the host's (§3.1), not a setting, so the manifest makes no
  // attribute of it; it is watched here, or a name changed after the first
  // drawing never reached the button (sf-language's «Язык: Русский» stayed
  // after a choice, 2026-11-06). updateDom patches it.
  static get observedAttributes() {
    return [...new Set([...super.observedAttributes, 'aria-label', 'title'])];
  }

  constructor() {
    super();
    this._attributeObserver = null;
  } // appearance: the retired surface reads as tonal; link, the former name of
  // ghost, is mapped by the dated alias before it gets here.


  get retiredSurface() {
    return (this.getAttribute('appearance') ?? this.getAttribute('type')) === RETIRED_APPEARANCE;
  } // A danger icon button is filled, outline or ghost (decision C116,
  // #q-danger-looks): tonal, and the retired surface, with status danger draw
  // as outline until 2027-01-01 (helpers/button-set.js, change journal
  // value-button-set-c116).


  get dangerFormer() {
    return (0,_helpers_button_set__WEBPACK_IMPORTED_MODULE_9__.dangerLook)(this.getAttribute('appearance') ?? this.getAttribute('type'), this.getAttribute('status')).former;
  }

  get appearance() {
    if (this.dangerFormer) return 'outline';

    if (this.retiredSurface) {
      (0,_core_js_deprecations__WEBPACK_IMPORTED_MODULE_7__.noteDeprecated)({
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
    if (!(0,_helpers_cycle__WEBPACK_IMPORTED_MODULE_6__.hasCycle)(this)) return null;
    return (0,_helpers_cycle__WEBPACK_IMPORTED_MODULE_6__.cycleState)(this, {
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
        parser: _helpers_cycle__WEBPACK_IMPORTED_MODULE_6__.parseCycle
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
    if ((0,_helpers_cycle__WEBPACK_IMPORTED_MODULE_6__.hasCycle)(this)) return undefined;
    return this.hasAttribute('pressed') ? super.pressed : undefined;
  }

  set pressed(value) {
    if (value === undefined || value === null) this.removeAttribute('pressed');else this.setAttribute('pressed', value ? '' : 'false');
  }

  templateContext() {
    const props = this.getPropsContext();
    const cycle = this.cycleState();
    if (cycle) (0,_helpers_cycle__WEBPACK_IMPORTED_MODULE_6__.warnCycleToggle)(this, ['pressed', 'label-pressed']); // success, warning, info: no such icon buttons (C13, BS-1); said once per page.

    (0,_helpers_control_status__WEBPACK_IMPORTED_MODULE_8__.warnUnknownControlStatus)('sf-button-icon', this.getAttribute('status')); // An icon button has no density (owner decision C213): spacing (and its
    // former name tightness) draws nothing; noted, and said once per button.

    noteIconButtonDensity(this); // A danger tonal or surface (C116); said once per page.

    const dangerFormer = this.dangerFormer;
    if (dangerFormer) (0,_helpers_button_set__WEBPACK_IMPORTED_MODULE_9__.sayButtonSetFormers)('sf-button-icon', [{
      attribute: 'appearance',
      from: dangerFormer,
      to: 'outline',
      danger: true,
      drawn: 'appearance="outline" status="danger" (a danger icon button is filled, outline or ghost)'
    }]);
    const announce = Boolean(cycle && this.__sfCycleAnnounce);
    this.__sfCycleAnnounce = false; // The icons a press can show, asked for before the press (R074).

    (0,_helpers_cycle__WEBPACK_IMPORTED_MODULE_6__.preloadSwitchIcons)(this, {
      icons: [this.getAttribute('icon')],
      filled: Boolean(this.filled)
    });
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
      // The control height (1.8.0, decisions C27 and C35): the size's
      // tightness step; a value outside the list reads as default.
      height: this.height,
      badge: this.badgeState?.(),
      // href (1.9.0): a link with the icon button's look; null download is
      // none, '' the server's name.
      href: linkAddress(this.getAttribute('href')),
      linkTarget: this.getAttribute('target') || '',
      linkRel: linkRelation(this.getAttribute('target'), this.getAttribute('rel')),
      linkDownload: this.hasAttribute('download') ? this.getAttribute('download') : null,
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
    const directPatchAttributes = ['disabled', 'aria-label', 'icon', 'title', 'tooltip']; // A cycle's name and icon come from its item: drawn, not patched; a link
    // is drawn too (disabled takes its href away).

    if (this.cycleState() || this.hasAttribute('href')) return 'lit';

    if (changedAttributes.length > 0 && changedAttributes.every(attr => directPatchAttributes.includes(attr))) {
      return 'dom';
    }

    return 'lit';
  }

  updateDom(changedAttributes = []) {
    const button = this.querySelector('.sf-icon-button');
    if (!button) return false;

    if (changedAttributes.includes('disabled')) {
      button.disabled = this.disabled || this.loading; // A loading one that is disabled as well wears the disabled look (C36
      // follow-up); the template writes the same class.

      if (this.loading) button.classList.toggle('disabled', Boolean(this.disabled));
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
    this.syncNameTooltip();
    return true;
  } // The name tooltip's text: the host's title when the page wrote one, a
  // cycle's current and next value, the pressed name of a toggle that is on,
  // else the name.


  nameTooltipText() {
    const title = (this.getAttribute('title') || '').trim();
    if (title) return title;
    const cycle = this.cycleState();
    if (cycle) return cycle.tooltip;
    return String(this.pressed === true && this.labelPressed || this.getAttribute('aria-label') || '').trim();
  } // The button and whether the name tooltip is its: off, no text, or a
  // tooltip the page linked itself (data-tooltip naming another surface).


  nameTooltipTarget() {
    const button = this.querySelector('.sf-icon-button');
    if (!button || this.getAttribute('tooltip') === 'off' || !this.nameTooltipText()) return null;
    const linked = button.getAttribute('data-tooltip');
    if (linked && linked !== this._nameTip?.id) return null;
    return button;
  } // After every drawing: the title stands back, and a tooltip made already
  // keeps its text and its link to the button lit drew this time.


  syncNameTooltip() {
    const button = this.querySelector('.sf-icon-button');
    if (!button) return;
    const target = this.nameTooltipTarget();
    const tip = this._nameTip;

    if (!target) {
      button.removeAttribute('aria-description');

      if (tip) {
        if (button.getAttribute('data-tooltip') === tip.id) button.removeAttribute('data-tooltip');
        tip.remove();
        this._nameTip = null;
      } // Off: the host's title and a cycle's value stay the browser's title,
      // as before 1.11.0.


      const cycle = this.cycleState();
      const title = this.getAttribute('title');
      if (cycle) button.setAttribute('title', cycle.tooltip);else if (title !== null) button.setAttribute('title', title);else if (button.getAttribute('title') === '') button.removeAttribute('title');
      return;
    } // An empty title on the button: the host's title (the button's ancestor)
    // draws no browser tooltip over the Framework one.


    if (this.hasAttribute('title')) button.setAttribute('title', '');else button.removeAttribute('title'); // A text other than the name describes the button (as the title did)
    // before the tooltip is made; once made, the controller links it by
    // aria-describedby instead.

    const cycle = this.cycleState(); // A text whose words the name already says (equal, or whole words of it)
    // is no description: the shared rule of the tooltip controller.

    const name = String(cycle ? cycle.name : this.pressed === true && this.labelPressed || this.getAttribute('aria-label') || '');
    const said = this.nameTooltipText();
    if (!tip && !(0,_component_tooltip_js_name_repeat_js__WEBPACK_IMPORTED_MODULE_5__.repeatsName)(name, said)) button.setAttribute('aria-description', said);else button.removeAttribute('aria-description');
    if (!tip) return;
    const text = tip.querySelector('.sf-tooltip-text');
    if (text && text.textContent !== this.nameTooltipText()) text.textContent = this.nameTooltipText();
    if (tip.previousElementSibling !== button || !tip.isConnected) button.after(tip);
    if (button.getAttribute('data-tooltip') !== tip.id) button.setAttribute('data-tooltip', tip.id);
  } // The first hover, keyboard focus or long press makes the tooltip and hands
  // that event to the controller, which shows it by its own rules (C59).


  wakeNameTooltip(event) {
    if (this._nameTip) return;
    const button = this.nameTooltipTarget();
    if (!button) return; // A pointer entering is told to the host itself; a focus and a press come
    // from inside, and must come from the button.

    if (event.type !== 'pointerenter' && !(event.target instanceof Node && button.contains(event.target))) return;
    const tip = document.createElement('span');
    tip.className = `sf-tooltip sf-tooltip--dark ${NAME_TIP}`;
    tip.id = this.id ? `${this.id}--tooltip` : `${NAME_TIP}-${++nameTips}`;
    tip.hidden = true;
    const content = document.createElement('span');
    content.className = 'sf-tooltip-content';
    const text = document.createElement('span');
    text.className = 'sf-tooltip-text';
    text.textContent = this.nameTooltipText();
    content.append(text);
    tip.append(content);
    this._nameTip = tip;
    button.after(tip);
    button.removeAttribute('aria-description');
    button.setAttribute('data-tooltip', tip.id);
    const kind = event.type;
    const pointerType = event.pointerType;
    let released = false;
    if (kind === 'pointerdown') button.addEventListener('pointerup', () => {
      released = true;
    }, {
      once: true
    });
    whenTooltipReady(() => setTimeout(() => {
      const now = this.querySelector('.sf-icon-button');
      if (!now || now.getAttribute('data-tooltip') !== tip.id) return; // The controller links the button on its own (its observer); the event
      // is handed over only while it still holds.

      if (kind === 'pointerenter' && now.matches(':hover')) {
        now.dispatchEvent(new PointerEvent('pointerenter', {
          pointerType
        }));
      } else if (kind === 'focusin' && document.activeElement === now) {
        now.dispatchEvent(new FocusEvent('focusin'));
      } else if (kind === 'pointerdown' && !released) {
        now.dispatchEvent(new PointerEvent('pointerdown', {
          pointerType
        }));
      }
    }, 0));
  }

  afterRender() {
    const button = this.querySelector('.sf-icon-button');
    applyButtonAttributes(this, button); // The name tooltip (C160 (1)): a cycle's value and the host's title are
    // its text, not a browser title; off, they stay the title.

    this.syncNameTooltip();

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
      height: this.height,
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
    if (!this._nameTipWake) {
      // Pointer enter does not bubble, but the host is the button's ancestor
      // and hears it; a finger counts only once it is a long press (the
      // controller times it), so a touch is handed over from pointerdown.
      this._nameTipWake = event => {
        if (event.type === 'pointerenter' && event.pointerType === 'touch') return;
        if (event.type === 'pointerdown' && event.pointerType !== 'touch') return;

        if (event.type === 'focusin') {
          try {
            if (!event.target?.matches?.(':focus-visible')) return;
          } catch {
            /* the selector unknown: a focus counts */
          }
        }

        this.wakeNameTooltip(event);
      };

      this.addEventListener('pointerenter', this._nameTipWake);
      this.addEventListener('focusin', this._nameTipWake);
      this.addEventListener('pointerdown', this._nameTipWake);
    }

    if (!this._cyclePress) {
      // A person's press moves the cycle: the click of the native button.
      this._cyclePress = event => {
        const button = this.querySelector('.sf-icon-button');
        if (!button || !(event.target instanceof Node) || !button.contains(event.target) || button.disabled) return;
        (0,_helpers_cycle__WEBPACK_IMPORTED_MODULE_6__.pressCycle)(this, this.cycleState());
      };

      this.addEventListener('click', this._cyclePress);
    }

    if (!this._cycleTheme) {
      // A theme cycle follows the theme wherever it was set.
      this._cycleTheme = () => (0,_helpers_cycle__WEBPACK_IMPORTED_MODULE_6__.themeCycleFollow)(this);

      globalThis.addEventListener?.('sf-theme-change', this._cycleTheme);
    }

    super.onConnected?.();
  }

  onDisconnected() {
    if (this._nameTipWake) {
      this.removeEventListener('pointerenter', this._nameTipWake);
      this.removeEventListener('focusin', this._nameTipWake);
      this.removeEventListener('pointerdown', this._nameTipWake);
      this._nameTipWake = null;
    }

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
// element (C15), a value off the list draws the default. Ghost is drawn by
// sf-icon-button--ghost (component.icon-buttons 1.14.0, RG-IB-2); plain is
// the plate-less look (C201). The former
// --link is an alias the runtime notes, so the element never writes it.

const ICON_BUTTON_LOOK = {
  default: 'default',
  tonal: 'tonal',
  outline: 'outline',
  ghost: 'ghost',
  link: 'ghost',
  surface: 'tonal',
  plain: 'plain'
};

function statusClasses(status, scheme) {
  if (status === 'danger' || status === 'error') return ['sf-icon-button--danger', 'sf-icon-button--error']; // secondary was retired (C15): drawn as on-surface-variant.

  const colour = scheme === 'secondary' ? 'on-surface-variant' : scheme || 'primary'; // on-surface-variant is the on-surface family one step quieter, one class
  // (SM-CPY-2): the class sheet lists it with every on-surface rule
  // (component.icon-buttons), so on-surface is not written beside it.

  return colour === 'on-surface-variant' ? ['sf-icon-button--on-surface-variant'] : [`sf-icon-button--${colour}`];
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
  ICON_BUTTON_SIZES.has(size || '1') ? `sf-icon-button--size-${size || '1'}` : '', `sf-icon-button--${kind ?? variant ?? 'icon'}`, // ghost is drawn by the ghost class (C15 made ghost the name; the
  // link class is its former twin, RG-IB-2).
  `sf-icon-button--${ICON_BUTTON_LOOK[appearance || type] || 'default'}`, 'flex', 'items-cross-center', segment ? `segment-${segment}` : '', // One colour name, as the styles expect: the status when one is set, the
  // scheme otherwise. A status says what the control is about -- an error
  // for something destructive -- and a scheme says which colour family it
  // takes; they cannot both paint it.
  // danger is a control's status (C13), drawn with the error roles: the
  // class is the danger one and the error one the sheets also select.
  ...statusClasses(status, scheme), // No density class (owner decision C213): an icon button is sized by
  // size and height only; spacing / tightness are noted by the element.
  // The height (decisions C27, C35): the class of the size's tightness
  // step, declared after the density classes; default draws none.
  ['low', 'high', 'highest'].includes(context.height) ? `sf-icon-button--height-${context.height}` : '', radius ? `radius-${radius}` : '', rootClass, loading ? 'loading sf-icon-button-state-loading' : '', // A loading icon button keeps its scheme colour (C36 follow-up); one
  // that is disabled as well wears the disabled look, so it says so.
  loading && disabled ? 'disabled' : '', // A toggle that is on wears the pressed look (component.icon-buttons
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
                            <sf-button-close root-class="pointer-events-none" size="${size || '1'}"></sf-button-close>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                            <sf-icon filled="${filled || context.pressed === true || Boolean(context.cycleView?.pressedLook)}" root-class="pointer-events-none" icon="${context.cycleView?.icon || icon}" weight="400" aria-hidden="true"></sf-icon>`; // href (1.9.0, decision C51): a link with the icon button's look, as
  // sf-button's -- the quiet «Скачать <name>» of a table row. Disabled or
  // loading, the link has no href, so it is not reached or followed, and
  // says aria-disabled; pressed and native-type do not apply to a link.

  if (context.href) {
    const inactive = Boolean(disabled || loading);
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <a
                href=${inactive ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : context.href}
                target=${context.linkTarget || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                rel=${context.linkRel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                download=${context.linkDownload === null || inactive ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : context.linkDownload}
                class=${(inactive && !rootClasses.includes('disabled') ? [...rootClasses, 'disabled'] : rootClasses).join(' ')}
                style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                role=${inactive ? 'link' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                aria-disabled=${inactive ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                aria-label=${name ? (0,_helpers_anchored_badge__WEBPACK_IMPORTED_MODULE_3__.nameWithBadge)(name, badge?.phrase) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                aria-busy=${loading ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        >
            ${iconContent}${(0,_helpers_anchored_badge__WEBPACK_IMPORTED_MODULE_3__.renderAnchoredBadge)(badge)}${name ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : (0,_helpers_anchored_badge__WEBPACK_IMPORTED_MODULE_3__.renderAnchoredBadgeText)(badge, false)}
        </a>
    `;
  }

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

/***/ "d9c5a43b5214"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BUTTON_SET_REMOVE_AFTER: () => (/* binding */ BUTTON_SET_REMOVE_AFTER),
/* harmony export */   BUTTON_SET_SINCE: () => (/* binding */ BUTTON_SET_SINCE),
/* harmony export */   buttonSetLook: () => (/* binding */ buttonSetLook),
/* harmony export */   dangerLook: () => (/* binding */ dangerLook),
/* harmony export */   isDangerStatus: () => (/* binding */ isDangerStatus),
/* harmony export */   sayButtonSetFormers: () => (/* binding */ sayButtonSetFormers)
/* harmony export */ });
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d3818183b14c");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_0__);
// The button set (owner decision C116, 2026-11-13; ui-control research
// 2026-11-13-buttons-system, prototype buttons-system.html). Three words of a
// button become former names until 2027-01-01 and draw as their successors:
//
// - scheme="secondary" on sf-button draws as on-surface (#q-secondary). The
//   secondary colour stays in core for badges, tabs and segments; the icon
//   button already reads it as on-surface-variant (C15, 2026-11-08).
// - appearance="surface" on sf-button draws as the soft grey button, tonal
//   with the on-surface scheme (#q-surface, C113).
// - a danger button keeps three looks -- filled (the last confirmation),
//   outline (opens a confirmation) and the fill-less icon in a row
//   (#q-danger-looks); tonal or surface with status danger draws as outline,
//   on sf-button and sf-button-icon alike.
//
// Each word is noted in SF.deprecations and said once per page in the console
// for each component and word, whether or not the page opted in to the notes,
// as sf-button's spacing and the BS-1 status warning are. Every bundle carries
// its own copy of this module, so the words already said live on one shared
// global.

const BUTTON_SET_SINCE = '2026-11-13';
const BUTTON_SET_REMOVE_AFTER = '2027-01-01';
const DANGER = new Set(['danger', 'error', 'critical']);

function saidWords() {
  const root = globalThis.SF = globalThis.SF || {};

  if (!(root.__sfButtonSetWarned instanceof Set)) {
    Object.defineProperty(root, '__sfButtonSetWarned', {
      value: new Set(),
      configurable: true
    });
  }

  return root.__sfButtonSetWarned;
} // Whether a status word paints the control as danger (C13: error and critical
// are danger's former names on a control).


function isDangerStatus(status) {
  return DANGER.has(String(status ?? ''));
} // A danger control's look: tonal and surface draw as outline. Answers the look
// drawn and the former word, or '' when the look is one of danger's own.

function dangerLook(appearance, status) {
  if (!isDangerStatus(status)) return {
    appearance,
    former: ''
  };
  if (appearance === 'tonal' || appearance === 'surface') return {
    appearance: 'outline',
    former: appearance
  };
  return {
    appearance,
    former: ''
  };
} // sf-button's look under C116. `appearance` and `scheme` are the words the page
// wrote (after the dated aliases: link is already ghost); answers the look and
// the colour the template draws and the former words met, each
// {attribute, from, to, drawn, danger?}.

function buttonSetLook({
  appearance,
  scheme,
  status
} = {}) {
  const formers = [];
  let look = appearance;
  let colour = scheme;
  const danger = dangerLook(look, status);

  if (danger.former) {
    formers.push({
      attribute: 'appearance',
      from: danger.former,
      to: 'outline',
      danger: true,
      drawn: 'appearance="outline" status="danger" (a danger button is filled, outline or a fill-less icon)'
    });
    look = danger.appearance;
  } else if (look === 'surface') {
    formers.push({
      attribute: 'appearance',
      from: 'surface',
      to: 'tonal',
      drawn: 'appearance="tonal" scheme="on-surface"'
    });
    look = 'tonal';
    colour = 'on-surface';
  }

  if (scheme === 'secondary') {
    formers.push({
      attribute: 'scheme',
      from: 'secondary',
      to: 'on-surface',
      drawn: 'scheme="on-surface"'
    });
    colour = 'on-surface';
  }

  return {
    appearance: look,
    scheme: colour,
    formers
  };
}

function sentence(component, former) {
  return `[SIMAI Framework] ${component}: ${former.attribute}="${former.from}"${former.danger ? ' with status="danger"' : ''} is a former name until ${BUTTON_SET_REMOVE_AFTER} and draws as ${former.drawn}; write that instead (rule C116). See contracts/changes/journal.json (value-button-set-c116).`;
} // Notes each former word in SF.deprecations and says it once per page.


function sayButtonSetFormers(component, formers = []) {
  for (const former of formers) {
    (0,_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_0__.noteDeprecated)({
      component,
      tag: component,
      kind: 'value',
      attribute: former.attribute,
      from: former.danger ? `${former.from} (status danger)` : former.from,
      to: former.to,
      since: BUTTON_SET_SINCE,
      remove_after: BUTTON_SET_REMOVE_AFTER
    });
    const said = saidWords();
    const key = `${component}|${former.attribute}|${former.from}|${former.to}`;
    if (said.has(key)) continue;
    said.add(key);
    globalThis.console?.warn?.(sentence(component, former));
  }
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "60a3f9a6662c"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   warnUnknownControlStatus: () => (/* binding */ warnUnknownControlStatus)
/* harmony export */ });
// A control's status is danger alone (rule C13): a button, an icon button or
// a menu item that deletes, discards or cannot be undone. error is its former
// name (until 2027-01-01) and critical an older one. There are no success,
// warning or info controls -- a result's colour belongs to a notice or a
// badge (ui-control research 2026-11-13-button-schemes, R202, defect BS-1).
// Such a word used to be dropped without a sound and the scheme colour drawn;
// it still draws so, and the console now says it once per page for each
// component and word.
//
// Every bundle carries its own copy of this module, so the words already said
// live on one shared global, as SF.deprecations keeps its notes.
const CONTROL_STATUSES = Object.freeze(['', 'danger', 'error', 'critical']);

function saidWords() {
  const root = globalThis.SF = globalThis.SF || {};

  if (!(root.__sfUnknownStatusWarned instanceof Set)) {
    Object.defineProperty(root, '__sfUnknownStatusWarned', {
      value: new Set(),
      configurable: true
    });
  }

  return root.__sfUnknownStatusWarned;
} // Answers whether `value` is a status the control does not know, and says so
// once per page. `allowed` narrows the words a component reads; `label` is how
// the message names the setting (status="…" on a host, an item's status).


function warnUnknownControlStatus(component, value, {
  allowed = CONTROL_STATUSES,
  label = 'status'
} = {}) {
  if (value === null || value === undefined) return false;
  const word = String(value);
  if (allowed.includes(word)) return false;
  const said = saidWords();
  const key = `${component}|${label}|${word}`;
  if (said.has(key)) return true;
  said.add(key);
  globalThis.console?.warn?.(`[SIMAI Framework] ${component}: ${label}="${word}" is not a status of a control; a control's status is danger (rule C13), and there are no success, warning or info controls. Drawn without a status.`);
  return true;
}

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

/***/ "a2fbabeb2195"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   files: () => (/* binding */ files)
/* harmony export */ });
/* harmony import */ var _en_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("65ba19e2ea5c");
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

/***/ "c402762d3a76"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-button-icon for the shim (stands/18-aliases-ci/alias.mjs, standard §16 item 20). mode: same-detail (the shim sends the new and the old name), split / detail-adds (a detail adapter, refused by the shim), attribute-and-property, method, property, manifest-only (the DOM name does not change), host-attribute (no shim), retired.","component":"sf-button-icon","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"aria-label","to":null,"kind":"attribute","component":"sf-button-icon","since":"2026-10-27","remove_after":"2026-12-01","mode":"host-attribute","section":"§3.1","note":"stays a host attribute, read by the base (§3.1, §4.8); no shim"},{"from":"type","to":"appearance","kind":"setting","component":"sf-button-icon","since":"2026-10-27","remove_after":"2026-12-01","section":"§16 item 20, contracts/public-api-axes.json","note":"the legacy axis name; the shim maps the attribute and the property"},{"from":"variant","to":"kind","kind":"setting","component":"sf-button-icon","since":"2026-10-27","remove_after":"2026-12-01","section":"§16 item 20, contracts/public-api-axes.json","note":"the legacy axis name; the shim maps the attribute and the property"},{"from":"tightness","to":"spacing","kind":"setting","component":"sf-button-icon","since":"2026-10-27","remove_after":"2026-12-01","section":"§16 item 20","note":"journal attribute-tightness-to-spacing; its words are spacing\'s value aliases below, spacing wins when both are given"},{"from":"low","to":"compact","kind":"value","setting":"spacing","component":"sf-button-icon","since":"2026-10-27","remove_after":"2026-12-01","section":"§16 item 20","note":"tightness\'s word, journal attribute-tightness-to-spacing"},{"from":"high","to":"comfortable","kind":"value","setting":"spacing","component":"sf-button-icon","since":"2026-10-27","remove_after":"2026-12-01","section":"§16 item 20","note":"tightness\'s word, journal attribute-tightness-to-spacing"},{"from":"highest","to":"spacious","kind":"value","setting":"spacing","component":"sf-button-icon","since":"2026-10-27","remove_after":"2026-12-01","section":"§16 item 20","note":"tightness\'s word, journal attribute-tightness-to-spacing"},{"from":"link","to":"ghost","kind":"value","setting":"appearance","component":"sf-button-icon","since":"2026-11-08","remove_after":"2027-01-01","section":"§16 item 20","note":"journal value-icon-button-looks-c15 (rule C15): link and ghost drew the same; ghost is the name"},{"from":"secondary","to":"on-surface-variant","kind":"value","setting":"scheme","component":"sf-button-icon","since":"2026-11-08","remove_after":"2027-01-01","section":"§16 item 20","note":"journal value-icon-button-looks-c15 (rule C15): secondary was drawn only in the tonal look and read as the quiet neutral elsewhere"},{"from":"error","to":"danger","kind":"value","setting":"status","component":"sf-button-icon","since":"2026-11-08","remove_after":"2027-01-01","section":"§16 item 20","note":"journal value-control-status-error-to-danger (rule C13): a control\'s destructive status is danger; messages keep error"},{"from":"sf-icon-button","to":"sf-button-icon","kind":"tag","component":"sf-button-icon","since":"2026-11-03","remove_after":"2027-01-01","section":"rename plan R0 (ui-control RENAME-PLAN-2026-11-03), naming decision 2026-11-02","note":"the element is sf-button-icon; sf-icon-button is a subclass defined beside it until the date"},{"from":"spacing","to":null,"kind":"setting","component":"sf-button-icon","since":"2026-11-16","remove_after":"2027-01-01","mode":"retired","section":"owner decision C213","note":"an icon button has no density (size and height keep it square); read and noted, said once per button in the console, it draws nothing"}]}');

/***/ },

/***/ "79f8b9b70d88"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.button-icon","tag":"sf-button-icon","version":"1.13.8","kind":"leaf","settings":{"kind":{"type":"enum","values":["icon","close"],"default":"icon"},"size":{"type":"enum","values":["1/3","1/2","1","2","3"],"default":"1"},"height":{"type":"enum","values":["low","default","high","highest"],"default":"default"},"appearance":{"type":"enum","values":["default","tonal","outline","ghost","plain"],"default":"default"},"scheme":{"type":"enum","values":["primary","on-surface","on-surface-variant"],"default":"primary"},"status":{"type":"enum","values":["","danger"],"default":""},"segment":{"type":"enum","values":["","start","middle","end"],"default":""},"icon":{"type":"icon","default":"add"},"filled":{"type":"boolean","default":false},"spacing":{"type":"enum","values":["compact","normal","comfortable","spacious"],"default":"normal"},"radius":{"type":"enum","values":["","default","square","rounded"],"default":""},"loading":{"type":"boolean","default":false},"disabled":{"type":"boolean","default":false},"native-type":{"type":"enum","values":["button","submit","reset"],"default":"button"},"href":{"type":"string","default":""},"target":{"type":"string","default":""},"rel":{"type":"string","default":""},"download":{"type":"string","default":""},"badge-count":{"type":"string","default":""},"badge-dot":{"type":"boolean","default":false},"badge-cap":{"type":"number","integer":true,"min":1,"default":99},"badge-label":{"type":"string","default":""},"button-attributes":{"type":"object"},"pressed":{"type":"boolean","optional":true},"label-pressed":{"type":"string","default":""},"tooltip":{"type":"string","default":""},"cycle":{"type":"list","default":[],"of":{"value":"string","label":"string","icon":{"type":"icon","optional":true},"lang":{"type":"string","optional":true},"pressed":{"type":"boolean","optional":true}}},"theme-cycle":{"type":"string","optional":true},"value":{"type":"string","default":""}},"values":{},"events":{"change":{"carries":{"previous":"string","value":"string","item":{"type":"object","nullable":true}}}},"actions":{},"css-variables":{"--sf-icon-button-background-color":{"type":"color","state":"default"},"--sf-icon-button-color":{"type":"color","state":"default"},"--sf-icon-button-border-color":{"type":"color","state":"default"},"--sf-icon-button-border-width":{"type":"length","state":"default"},"--sf-icon-button-radius":{"type":"length","state":"default"},"--sf-icon-button-padding-inline":{"type":"length","state":"default"},"--sf-icon-button-padding-block":{"type":"length","state":"default"},"--sf-icon-button-pressed-background-color":{"type":"color","state":"pressed"},"--sf-icon-button-pressed-color":{"type":"color","state":"pressed"}}}');

/***/ },

/***/ "65ba19e2ea5c"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Icon Buttons","runtime":{"theme":"Theme","theme-system":"system","theme-light":"light","theme-dark":"dark","theme-system-now":"system (now {theme})","cycle-next":"{name}. Press for {next}"}}');

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