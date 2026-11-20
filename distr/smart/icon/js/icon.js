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

/***/ "a1e33ce15a5e"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DIRECTIONAL_ICONS: () => (/* binding */ DIRECTIONAL_ICONS),
/* harmony export */   checkIconGlyph: () => (/* binding */ checkIconGlyph),
/* harmony export */   markCustomGlyph: () => (/* binding */ markCustomGlyph),
/* harmony export */   markMirrorGlyph: () => (/* binding */ markMirrorGlyph),
/* harmony export */   mirrorsInRtl: () => (/* binding */ mirrorsInRtl),
/* harmony export */   nearestIconName: () => (/* binding */ nearestIconName),
/* harmony export */   registerIcon: () => (/* binding */ registerIcon),
/* harmony export */   registeredIcon: () => (/* binding */ registeredIcon)
/* harmony export */ });
// What every icon slot shares about a glyph beyond its font (owner decision
// C151, icons study control/research/2026-11-14-icons.md): the glyphs a
// product registers by name (point 6), the glyphs that turn over in a
// right-to-left part (point 3) and an unknown name, which keeps its box empty
// and is named once in the console with the nearest real name (point 2).
//
// One state per page, on the shared global: Core, the Loader and the Smart
// icon each carry a copy of this module (bundles each carry their own module
// copy), and a glyph registered through one copy has to draw in the slots the
// others render.
const NAME = /^[a-z0-9_][a-z0-9_-]*$/u;

function shared() {
  const root = globalThis.SF = globalThis.SF || {};
  const icons = root.icons = root.icons || {};

  if (!icons.__glyphs) {
    Object.defineProperty(icons, '__glyphs', {
      value: {
        registered: new Map(),
        warned: new Set(),
        names: null,
        pending: new Set(),
        frame: 0
      },
      configurable: true
    });
  }

  return icons.__glyphs;
} // ---------------------------------------------------------------- point 6
// SF.icons.register(name, svg): the product's own or a brand glyph, drawn in
// the current colour at the slot's size wherever an icon name is accepted --
// sf-icon, a button's icon-start, a menu row, a tab, the class markup
// <i class="sf-icon">name</i>. The SVG is a mask over the glyph's box, so one
// colour; the box and its size are the ladder's. The name never reaches the
// icon font request.


function styleSheet() {
  const doc = globalThis.document;
  if (!doc?.head) return null;
  let style = doc.head.querySelector('style[data-sf-icons-registered]');

  if (!style) {
    style = doc.createElement('style');
    style.setAttribute('data-sf-icons-registered', '');
    doc.head.appendChild(style);
  }

  return style;
}

function svgUrl(svg) {
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

function writeRegisteredSheet() {
  const style = styleSheet();
  if (!style) return;
  const rules = [];

  for (const [name, svg] of shared().registered) {
    rules.push(`.sf-icon[data-sf-icon-custom="${name}"]{--sf-icon--custom:${svgUrl(svg)}}`);
  }

  style.textContent = rules.join('\n');
}

function registeredIcon(name) {
  const key = String(name || '').trim();
  return key ? shared().registered.get(key) || null : null;
} // A glyph of the class markup takes its registered drawing from the attribute;
// one that stops being registered (its text changed) gives it back.

function markCustomGlyph(el, name) {
  if (!el?.setAttribute) return false;
  const key = String(name || '').trim();

  if (key && registeredIcon(key)) {
    if (el.getAttribute('data-sf-icon-custom') !== key) el.setAttribute('data-sf-icon-custom', key); // Drawn as letters before it was registered: it is no longer missing.

    el.removeAttribute('data-sf-icon-missing');
    return true;
  }

  if (el.hasAttribute?.('data-sf-icon-custom')) el.removeAttribute('data-sf-icon-custom');
  return false;
}
function registerIcon(name, svg) {
  const key = String(name || '').trim();
  const drawing = String(svg || '').trim();

  if (!NAME.test(key)) {
    globalThis.console?.warn?.(`[SIMAI Framework] SF.icons.register: "${key}" is not an icon name (lowercase letters, digits, _ and -).`);
    return false;
  }

  if (!/^<svg[\s>]/iu.test(drawing)) {
    globalThis.console?.warn?.(`[SIMAI Framework] SF.icons.register("${key}"): the drawing must be an <svg> element.`);
    return false;
  }

  shared().registered.set(key, drawing);
  writeRegisteredSheet();
  const doc = globalThis.document; // Class-markup glyphs already on the page take it now; sf-icon elements and
  // the Loader hear the event.

  doc?.querySelectorAll?.('.sf-icon').forEach(el => {
    if (el.closest?.('sf-icon')) return;
    const text = String(el.getAttribute('data-icon') || el.textContent || '').trim();
    if (text === key && markCustomGlyph(el, key)) el.classList.add('sf-icon-loaded');
  });

  try {
    globalThis.dispatchEvent?.(new CustomEvent('sf-icons:registered', {
      detail: {
        name: key
      }
    }));
  } catch {// A realm without CustomEvent (a unit test) has nothing listening.
  }

  return true;
} // ---------------------------------------------------------------- point 3
// The glyphs that point along the line (Material's bidirectionality guidance):
// arrows, chevrons, send, reply and forward, undo and redo, lists and
// indents, open in a new window, log in and out. Clocks, checks, media
// controls and logos never turn over.

const DIRECTIONAL_ICONS = Object.freeze(new Set(['arrow_back', 'arrow_forward', 'arrow_back_ios', 'arrow_back_ios_new', 'arrow_forward_ios', 'arrow_left', 'arrow_right', 'arrow_left_alt', 'arrow_right_alt', 'arrow_outward', 'chevron_left', 'chevron_right', 'keyboard_arrow_left', 'keyboard_arrow_right', 'keyboard_double_arrow_left', 'keyboard_double_arrow_right', 'double_arrow', 'navigate_before', 'navigate_next', 'first_page', 'last_page', 'trending_flat', 'subdirectory_arrow_left', 'subdirectory_arrow_right', 'call_made', 'call_received', 'keyboard_tab', 'keyboard_backspace', 'backspace', 'send', 'reply', 'reply_all', 'forward', 'undo', 'redo', 'format_list_bulleted', 'list', 'view_list', 'toc', 'notes', 'short_text', 'subject', 'wrap_text', 'format_indent_increase', 'format_indent_decrease', 'menu_open', 'read_more', 'open_in_new', 'launch', 'exit_to_app', 'logout', 'login', 'input', 'output', 'label', 'label_important'])); // mirror: auto (the glyph turns over in a right-to-left part when it points
// along the line), on (it turns over there whatever it is), off (never).

function mirrorsInRtl(name, mode = 'auto') {
  const value = String(mode || 'auto').trim().toLowerCase();
  if (value === 'off') return false;
  if (value === 'on') return true;
  return DIRECTIONAL_ICONS.has(String(name || '').trim());
} // The class markup <i class="sf-icon">arrow_forward</i> is marked the way the
// Smart icon marks its glyph, so the icons sheet turns it over in a
// right-to-left part. Before, only sf-icon did, and a class glyph pointed the
// wrong way in dir="rtl" (content study Z2, 2026-11-16). The author's mode is
// data-mirror="auto|on|off" (the Smart icon's mirror). The mark follows the
// name: a glyph renamed to a non-directional one gives it back.

function markMirrorGlyph(el, name) {
  if (!el?.setAttribute) return false;
  const mirrors = mirrorsInRtl(name, el.getAttribute('data-mirror') || 'auto');

  if (mirrors) {
    if (!el.hasAttribute('data-sf-icon-mirror')) el.setAttribute('data-sf-icon-mirror', '');
  } else if (el.hasAttribute('data-sf-icon-mirror')) {
    el.removeAttribute('data-sf-icon-mirror');
  }

  return mirrors;
} // ---------------------------------------------------------------- point 2
// An unknown or misspelt name is drawn by the icon font as its letters: wider
// than the glyph's box. The box clips them (the icons sheet), the glyph is
// marked missing (its letters unseen, the box kept) and the name is said once
// per page, with the nearest real name from the font's own list
// (core/contracts/icon-names.v1.json, fetched only when a name is missing).

function textWidth(el) {
  const doc = el.ownerDocument;
  const range = doc?.createRange?.();
  if (!range) return 0;
  range.selectNodeContents(el);
  return range.getBoundingClientRect?.().width || 0;
}

function namesUrl() {
  const base = String(globalThis.sfPath || '').replace(/\/+$/u, '');
  return base ? `${base}/core/contracts/icon-names.v1.json` : '';
} // The list answers null when it cannot be read: no sfPath, a server that
// refuses it, or a sandboxed example frame (origin null) whose server sends
// no Access-Control-Allow-Origin for JSON (DF-8). Unknown is not "no such
// icon": an empty list made every glyph checked before its face arrived a
// misspelling for good -- said in the console and never read again -- so
// arrows in the docs' example frames stayed empty boxes.


function loadNames() {
  const state = shared();

  if (!state.names) {
    const url = namesUrl();
    state.names = url && typeof fetch === 'function' ? fetch(url).then(response => response.ok ? response.json() : null).then(data => Array.isArray(data?.names) ? data.names : null).catch(() => null) : Promise.resolve(null);
  }

  return state.names;
}

function distance(a, b) {
  const row = Array.from({
    length: b.length + 1
  }, (_, index) => index);

  for (let i = 1; i <= a.length; i += 1) {
    let previous = row[0];
    row[0] = i;

    for (let j = 1; j <= b.length; j += 1) {
      const kept = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, previous + (a[i - 1] === b[j - 1] ? 0 : 1));
      previous = kept;
    }
  }

  return row[b.length];
}

function nearestIconName(name, names = []) {
  const wanted = String(name || '').trim().toLowerCase().replace(/[\s-]+/gu, '_');
  let best = '';
  let bestDistance = Infinity;

  for (const candidate of names) {
    if (Math.abs(candidate.length - wanted.length) >= bestDistance) continue;
    const d = distance(wanted, candidate);

    if (d < bestDistance) {
      best = candidate;
      bestDistance = d;
    }
  }

  return bestDistance <= Math.max(2, Math.ceil(wanted.length / 3)) ? best : '';
} // Only an unknown name is said (C151 (2)). A name the font's list holds is
// a face still on its way -- the subset that grows, a family whose face came
// later than the check -- not a misspelling: it is not said ("no icon
// "favorite"; nearest: "favorite"", content study Z1, 2026-11-16), it waits
// unseen and is read again when a face arrives (recheckMissing).

function warnMissing(name) {
  const state = shared();
  if (state.warned.has(name)) return;
  state.warned.add(name);
  loadNames().then(names => {
    // A name the list holds, or any name when the list cannot be read: a
    // face on its way, read again when one arrives; only a name the list
    // lacks is said.
    if (!names || names.includes(name)) {
      state.warned.delete(name);
      watchFaces(); // The face may have come in while the list was on its way: no event
      // is left to read the glyph again, and it stayed an empty box for good
      // (AM-21, one cold load in twelve). It is read again now.

      recheckSoon();
      return;
    }

    const near = nearestIconName(name, names);
    globalThis.console?.warn?.(`[SIMAI Framework] sf-icon: no icon "${name}"${near ? `; nearest: "${near}"` : ''}. The box stays empty.`);
  });
} // The glyphs marked missing are read again once a face has loaded (a subset
// swapped in, a family's own face): one that now draws leaves the state.


function recheckMissing() {
  const doc = globalThis.document;
  doc?.querySelectorAll?.('.sf-icon[data-sf-icon-missing]').forEach(el => checkIconGlyph(el));
}

function recheckSoon() {
  const raf = globalThis.requestAnimationFrame;
  if (typeof raf === 'function') raf(recheckMissing);else setTimeout(recheckMissing, 16);
} // Watched from the first glyph marked missing, not from the answer of the
// names list: a face that loaded between the two was never seen (AM-21).
// Besides a face loading and a subset answer, the page's subset-pending mark
// lifting changes the family every glyph draws in without loading anything
// (a face already in the cache), and the fonts settling ends a wait.


function watchFaces() {
  const state = shared();
  if (state.watching) return;
  state.watching = true;
  const doc = globalThis.document;
  doc?.fonts?.addEventListener?.('loadingdone', recheckSoon);
  globalThis.addEventListener?.('sf-icons-subset:ready', recheckSoon);
  Promise.resolve(doc?.fonts?.ready).then(recheckSoon, () => {});
  const Watch = globalThis.MutationObserver;

  if (typeof Watch === 'function' && doc?.documentElement) {
    new Watch(recheckSoon).observe(doc.documentElement, {
      attributes: true,
      attributeFilter: ['data-sf-icons']
    });
  }
} // A glyph is judged only once the face that draws it is in: marked loaded,
// its family can still be on its way (font-display: block draws the name
// unseen at the fallback's width, as wide as letters). Until then the check
// waits for the face, twice at most; a face that never comes is judged as it
// draws.


const fontWaits = new WeakMap();

function faceOnItsWay(glyph, name) {
  const fonts = glyph.ownerDocument?.fonts;
  const view = glyph.ownerDocument?.defaultView;
  if (!fonts?.check || !view?.getComputedStyle) return null;
  const waits = fontWaits.get(glyph) || 0;
  if (waits >= 2) return null;
  const style = view.getComputedStyle(glyph);
  const font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;

  try {
    if (fonts.check(font, name || 'a')) return null;
  } catch {
    return null;
  }

  fontWaits.set(glyph, waits + 1);
  return Promise.resolve(fonts.load(font, name || 'a')).catch(() => null);
} // Called when a glyph is marked loaded; the reads are taken together in one
// frame for every glyph that loaded since the last one.


function checkIconGlyph(el) {
  if (!el?.isConnected || el.hasAttribute('data-sf-icon-custom')) return;
  const state = shared();
  state.pending.add(el);
  if (state.frame) return;

  const run = () => {
    state.frame = 0;
    const glyphs = [...state.pending];
    state.pending.clear();
    const readings = glyphs.map(glyph => {
      if (!glyph.isConnected || glyph.hasAttribute('data-sf-icon-custom')) return null;
      const box = glyph.getBoundingClientRect(); // Not rendered (a closed panel): read again when it loads anew.

      if (!box.width || !box.height) return null; // The glyph's em, not its box alone: a box squeezed narrower than its
      // font size (a 12 px slot for a 16 px glyph, RG-CC-5) made one real
      // ligature look like letters and dropped it.

      const view = glyph.ownerDocument?.defaultView;
      const em = parseFloat(view?.getComputedStyle?.(glyph).fontSize) || 0;
      return {
        glyph,
        box: Math.max(box.width, em),
        text: textWidth(glyph)
      };
    });

    for (const reading of readings) {
      if (!reading) continue;
      const {
        glyph,
        box,
        text
      } = reading;
      const name = String(glyph.getAttribute('data-icon') || glyph.textContent || '').trim(); // A ligature is one glyph, one em (or one box) wide; letters are several.

      const missing = text > box * 1.5;

      if (missing) {
        const face = faceOnItsWay(glyph, name);

        if (face) {
          face.then(() => checkIconGlyph(glyph));
          continue;
        }

        if (!glyph.hasAttribute('data-sf-icon-missing')) glyph.setAttribute('data-sf-icon-missing', '');
        watchFaces();
        if (name) warnMissing(name);
      } else if (glyph.hasAttribute('data-sf-icon-missing')) {
        glyph.removeAttribute('data-sf-icon-missing');
      }
    }
  };

  const raf = globalThis.requestAnimationFrame;
  state.frame = typeof raf === 'function' ? raf(run) : (setTimeout(run, 16), 1);
}

if (typeof globalThis !== 'undefined') {
  const root = globalThis.SF = globalThis.SF || {};
  root.icons = root.icons || {};
  if (typeof root.icons.register !== 'function') root.icons.register = registerIcon;
}

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

/***/ "55e16638d2ac"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("07905d246432");
/* harmony import */ var _helpers_anchored_badge__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("34addf781b5b");
/* harmony import */ var _core_js_icon_glyphs_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("a1e33ce15a5e");
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("d3818183b14c");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("756bf22cb853");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("75949279fd27");
/* harmony import */ var _lang_index_mjs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("b15f8c9f99f2");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_2__, _helpers_anchored_badge__WEBPACK_IMPORTED_MODULE_3__, _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_5__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_2__, _helpers_anchored_badge__WEBPACK_IMPORTED_MODULE_3__, _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_5__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_5__);








 // Only the words on screen ship in the bundle, English only (owner decision
// C282): Russian and every other language come from a language file. The
// title, settings and events stay in the language files for the Studio and the
// docs (localization study LC-2).

const weightClasses = new Map([[100, "thin"], [200, "extra-light"], [300, "light"], [400, "regular"], [500, "medium"], [600, "semi-bold"], [700, "bold"]]);
const iconSizes = ["1/4", "1/3", "1/2", "1", "2", "3", "4", "5", "6", "7"]; // The size names (owner decision C151 point 1): a size is the UI ladder step
// of the host -- 1/3, 1/2, 1, 2, 3 draw 16, 20, 24, 28, 36, one step down on a
// phone and in a compact region, like the button, field or row of that size;
// 4 to 7 are the large glyphs of empty states. A region (or the icon itself)
// takes these names with data-sf-icon-scale="ladder". Elsewhere the old icon
// scale still answers until 2027-01-01 (journal value-icon-size-ladder): its
// 1/4 to 3 drew 12, 12, 14, 16, 20, 24, and each use is noted in
// SF.deprecations with the ladder name that draws the same.

const OLD_SCALE_LADDER = Object.freeze({
  "1/4": "",
  "1/3": "",
  "1/2": "",
  "1": "1/3",
  "2": "1/2",
  "3": "1"
});
const LADDER_REGION = '[data-sf-icon-scale="ladder"]';

function clampAxis(value, fallback, minimum, maximum) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return fallback;
  return Math.min(maximum, Math.max(minimum, numericValue));
} // sf-icon from its component.json (standard simai.smart-component 1.3.8 §3,
// §4): the settings are the attributes and properties core/js/element-manifest.js
// makes from the manifest, and `loaded` is the value the Loader reports. One
// family is drawn, outlined (1.2.0, icons study IC-4): rounded, sharp and the
// older shape are dated value aliases of outlined until 2027-01-01
// (aliases.json); their fonts were never shipped. What stays here is
// behaviour: the exact subset the glyph waits for, the axes' bounds and the
// badge.
// One IntersectionObserver for every icon that cannot draw yet: an icon in a
// copy that is not rendered (a closed panel, a display: none menu or header
// copy) checks again, and asks the Loader for its glyph, when the copy is
// shown. Whether it can draw is the font's readiness for its family and style
// (the Loader's sets), never whether it is rendered; this is the second
// chance for an icon that missed the ready event while it was hidden. A
// zero-size target in the viewport intersects, so the glyph held at
// font-size 0 is seen too. Only the change from not rendered to rendered
// counts: the first answer for an icon already in view says nothing new, and
// acting on it asked the Loader again while the page's first request was
// being put together. Larena read menu and star loaded: false 4 s after
// load in such a copy (pair ui-b4a77681f0a7, R074).


let renderedSight = null;

function sightForRendered() {
  const Sight = globalThis.IntersectionObserver;

  if (!renderedSight && typeof Sight === "function") {
    renderedSight = new Sight(entries => {
      for (const entry of entries) {
        const {
          target
        } = entry;
        const was = target._renderedSeen;
        target._renderedSeen = entry.isIntersecting;
        if (entry.isIntersecting && was === false) target.onRendered?.();
      }
    });
  }

  return renderedSight;
}

const IconElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_6__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: _lang_index_mjs__WEBPACK_IMPORTED_MODULE_8__.files,
  source: "ru",
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_7__
});

class SfIcon extends IconElement {
  static clearLightDomBeforeFirstRender = true;

  constructor() {
    super(); // Every subset answer, not only one that names this icon: an icon can
    // become drawable under an answer that does not name it -- a manifest
    // that already held it, its filled or weighted form loaded in a batch
    // named before the form was added, the full font taking over -- and it
    // then stayed at font-size 0 until something touched it (R074). The
    // check is a lookup in the Loader's sets.

    this.onIconSubsetReady = () => this.syncLoadedState(); // An icon connected before the Loader existed asked it for nothing; it
    // asks, and checks again, once the Loader is ready.


    this.onLoaderReady = () => {
      this.requestIconLoad();
      this.syncLoadedState();
    };

    this.onRendered = () => {
      this.requestIconLoad();
      this.syncLoadedState();
    }; // A glyph registered after this icon drew (SF.icons.register, C151 point 6).


    this.onIconRegistered = event => {
      if (event?.detail?.name !== String(this.getProp("icon") || "").trim()) return;
      this.syncLoadedState();
      this.refresh("icon-registered");
    };
  }

  watchRendered(watch) {
    if (watch === Boolean(this._watchingRendered)) return;
    const sight = sightForRendered();
    if (!sight) return;

    if (watch) {
      this._renderedSeen = undefined;
      sight.observe(this);
    } else sight.unobserve(this);

    this._watchingRendered = watch;
  }

  connectedCallback() {
    // An icon placed again that has no glyph -- its host emptied after it drew,
    // by whatever emptied it -- draws again instead of staying blank for good:
    // its first render, which clears the host and starts lit afresh, runs once
    // more. Taking such an icon out and putting it back did nothing before,
    // and ui-mail replaced the blank ones in its drawer portals with fresh
    // copies (redrawPortalIcons, simai/ui-source#56).
    if (this._hasRendered && !this.querySelector(":scope > i.sf-icon, :scope > .sf-badge-anchor")) {
      this._hasRendered = false;
    }

    super.connectedCallback();
    window.addEventListener("sf-icons-subset:ready", this.onIconSubsetReady);
    window.addEventListener("sf-loader-ready", this.onLoaderReady);
    window.addEventListener("sf-icons:registered", this.onIconRegistered);
    this.requestIconLoad();
    this.syncLoadedState();
  }

  disconnectedCallback() {
    window.removeEventListener("sf-icons-subset:ready", this.onIconSubsetReady);
    window.removeEventListener("sf-loader-ready", this.onLoaderReady);
    window.removeEventListener("sf-icons:registered", this.onIconRegistered);
    this.watchRendered(false);
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
    if (this.isRegisteredGlyph) return;
    const loader = window.SF?.Loader;
    const iconCount = loader?.trackIconElement?.(this) || 0;

    if (iconCount > 0) {
      loader.mutate?.(() => loader.loadFonts?.());
    }
  }

  syncLoadedState() {
    const loader = window.SF?.Loader;
    const tracked = loader?.getTrackedIconAttrs?.(this) || null;
    const loaded = this.isRegisteredGlyph || Boolean(tracked?.icon && loader?.isTrackedIconLoaded?.(tracked));

    if (loaded) {
      window.removeEventListener("sf-icons-subset:ready", this.onIconSubsetReady);
    } else {
      window.addEventListener("sf-icons-subset:ready", this.onIconSubsetReady);
    }

    this.watchRendered(!loaded && this.isConnected);
    if (this.getProp("loaded") === loaded) return;
    this.setState({
      loaded
    });
  } // A registered glyph (SF.icons.register) draws from its SVG, never the font.


  get isRegisteredGlyph() {
    return Boolean((0,_core_js_icon_glyphs_js__WEBPACK_IMPORTED_MODULE_4__.registeredIcon)(this.getProp("icon")));
  } // Unset, the weight is the label's beside it: the glyph inherits the
  // font-weight around it (C151 point 4), so no weight class is written. An
  // author's weight still wins.


  get weightClass() {
    if (!this.hasAttribute("weight")) return "";
    let weight = this.getProp("weight");
    weight = this.toNumber(weight, 400);
    return weightClasses.get(weight) || weightClasses.get(400);
  } // The one family sf-icon draws (IC-4). A page's default family
  // (SF_BOOT_CONFIG icons.type) no longer changes it: rounded and sharp fell
  // back to the old Material Icons font on every load.


  get iconType() {
    return "outlined";
  }

  get iconSize() {
    const size = String(this.getProp("size") || "").trim();
    if (!iconSizes.includes(size)) return ""; // An old-scale number outside a ladder region: noted once per value.

    if (Object.hasOwn(OLD_SCALE_LADDER, size) && !this.closest?.(LADDER_REGION)) {
      const ladder = OLD_SCALE_LADDER[size];
      (0,_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_5__.noteDeprecated)({
        component: "sf-icon",
        kind: "value",
        attribute: "size",
        from: size,
        to: ladder ? `data-sf-icon-scale="ladder" size="${ladder}"` : 'data-sf-icon-scale="ladder" size="1/3" (16, the smallest ladder step)',
        tag: "sf-icon",
        since: "2026-11-14",
        remove_after: "2027-01-01"
      });
    }

    return size;
  } // Unset (""), the sheet's: grade -25 on a dark theme, the optical size from
  // the glyph's size (C151 point 4).


  get iconGrade() {
    if (!this.hasAttribute("grade")) return "";
    return clampAxis(this.getProp("grade"), 0, -50, 200);
  }

  get iconOpticalSize() {
    if (!this.hasAttribute("optical-size")) return "";
    return clampAxis(this.getProp("opticalSize"), 24, 20, 48);
  } // Turns over in a right-to-left part (C151 point 3): a glyph that points
  // along the line, or any with mirror="on"; never with mirror="off".


  get iconMirrors() {
    return (0,_core_js_icon_glyphs_js__WEBPACK_IMPORTED_MODULE_4__.mirrorsInRtl)(this.getProp("icon"), this.getProp("mirror"));
  }

  get templateData() {
    return {
      icon: this.getProp("icon"),
      loaded: this.getProp("loaded"),
      filled: this.getProp("filled"),
      weightClass: this.weightClass,
      size: this.iconSize,
      grade: this.iconGrade,
      opticalSize: this.iconOpticalSize,
      label: String(this.getProp("label") || "").trim(),
      badge: (0,_helpers_anchored_badge__WEBPACK_IMPORTED_MODULE_3__.elementBadge)(this),
      custom: this.isRegisteredGlyph,
      mirror: this.iconMirrors
    };
  } // A loaded glyph that draws as letters is an unknown name (C151 point 2):
  // its box stays empty and the name is said once in the console.


  afterRender(changed) {
    const result = super.afterRender(changed);
    const glyph = this.querySelector(":scope > i.sf-icon, :scope > .sf-badge-anchor > i.sf-icon");
    if (glyph && this.isRegisteredGlyph) glyph.removeAttribute("data-sf-icon-missing");else if (glyph && this.getProp("loaded")) (0,_core_js_icon_glyphs_js__WEBPACK_IMPORTED_MODULE_4__.checkIconGlyph)(glyph);
    return result;
  } // Classes someone else put on the glyph stay through a re-render: the
  // template writes the whole class attribute, and Docara's icon runtime lost
  // the face class it had set (sf-icon-complete), so a name outside the fast
  // subset drew as broken ligatures (simai/docara#35). The glyph's classes
  // that the last render did not write are carried into the next.


  foreignGlyphClasses() {
    const glyph = this.querySelector(":scope > i.sf-icon, :scope > .sf-badge-anchor > i.sf-icon");
    if (!glyph) return "";
    const written = new Set(String(this.__sfIconWrittenClass || "").split(/\s+/).filter(Boolean)); // The element's own family is never foreign, so a first paint printed
    // before the element ran (its classes not yet recorded) hands over no
    // stale size or weight.

    const own = /^sf-icon(?:$|--)|^sf-icon-loaded$/;
    return [...glyph.classList].filter(name => !written.has(name) && !own.test(name)).join(" ");
  }

  template() {
    const result = (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_2__.renderIconTemplate)({ ...this.templateContext(),
      ...this.templateData,
      foreignClass: this.foreignGlyphClasses()
    });
    this.__sfIconWrittenClass = result.__sfIconClass;
    return result;
  }

}

SfIcon.define("sf-icon");
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "07905d246432"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderIconTemplate: () => (/* binding */ renderIconTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
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
    weightClass,
    loaded,
    rootClass,
    rootStyle,
    grade,
    opticalSize,
    label,
    foreignClass,
    custom,
    mirror
  } = context;
  const ownClass = ["sf-icon", size ? `sf-icon--size-${size}` : "", loaded ? "sf-icon-loaded" : "", weightClass ? `sf-icon--weight-${weightClass}` : "", filled ? "sf-icon--filled" : "", rootClass].filter(Boolean).join(" "); // What the element did not write itself (sf-icon's foreignGlyphClasses).

  const className = [ownClass, foreignClass].filter(Boolean).join(" "); // Grade and optical size are written only when the author set them: unset,
  // the icons sheet gives them -- the optical size from the glyph's size, the
  // grade from the theme (owner decision C151 point 4).

  const style = [rootStyle, grade !== "" && grade != null ? `--sf-icon--grade:${grade}` : "", opticalSize !== "" && opticalSize != null ? `--sf-icon--optical-size:${opticalSize}` : ""].filter(Boolean).join(";");
  return {
    icon,
    className,
    ownClass,
    style: style || lit__WEBPACK_IMPORTED_MODULE_0__.nothing,
    label,
    custom: custom ? icon : lit__WEBPACK_IMPORTED_MODULE_0__.nothing,
    mirror: mirror ? "" : lit__WEBPACK_IMPORTED_MODULE_0__.nothing
  };
}

function renderIconTemplate(context) {
  const {
    icon,
    className,
    ownClass,
    style,
    label,
    custom,
    mirror
  } = getIconData(context);
  const badge = context.badge;

  const mark = result => Object.assign(result, {
    __sfIconClass: ownClass
  }); // With a count or a dot the glyph stands in an anchor of its own box
  // (simai/ui-source#12): the glyph's text is its ligature, so the badge
  // cannot go inside it. A labelled icon is then named by the anchor, with the
  // count after the label; an unlabelled one says the count in hidden words.


  if ((0,_helpers_anchored_badge__WEBPACK_IMPORTED_MODULE_2__.hasBadge)(badge)) {
    return mark((0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span
      class="sf-badge-anchor sf-badge-anchor--size-${(0,_component_badges_js_anchored_state__WEBPACK_IMPORTED_MODULE_1__.iconBadgeStep)(context.size)} sf-badge-anchor--square"
      role=${label ? "img" : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      aria-label=${label ? (0,_helpers_anchored_badge__WEBPACK_IMPORTED_MODULE_2__.nameWithBadge)(label, badge.phrase) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      ><i class="${className}" style=${style} data-sf-icon-custom=${custom} data-sf-icon-mirror=${mirror} aria-hidden="true">${icon}</i
      >${(0,_helpers_anchored_badge__WEBPACK_IMPORTED_MODULE_2__.renderAnchoredBadge)(badge)}${label ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : (0,_helpers_anchored_badge__WEBPACK_IMPORTED_MODULE_2__.renderAnchoredBadgeText)(badge, false)}</span
    >`);
  }

  return mark((0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i
    class="${className}"
    style=${style}
    data-sf-icon-custom=${custom}
    data-sf-icon-mirror=${mirror}
    role=${label ? "img" : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    aria-label=${label || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    aria-hidden=${label ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : "true"}
    >${icon}</i
  >`);
}
renderIconTemplate.getIconData = getIconData;
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

/***/ "b15f8c9f99f2"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   files: () => (/* binding */ files)
/* harmony export */ });
/* harmony import */ var _en_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("5d30914d54d5");
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

/***/ "75949279fd27"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-icon for the shim (stands/18-aliases-ci/alias.mjs, standard §16 item 20). mode: same-detail (the shim sends the new and the old name), split / detail-adds (a detail adapter, refused by the shim), attribute-and-property, method, property, manifest-only (the DOM name does not change), host-attribute (no shim), retired.","component":"sf-icon","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"shape","to":"outlined","kind":"value","setting":"type","component":"sf-icon","since":"2026-10-27","remove_after":"2026-12-01","section":"§16 item 20","note":"the family\'s old name; sharp itself is a former value since 1.2.0, so shape draws outlined"},{"from":"rounded","to":"outlined","kind":"value","setting":"type","component":"sf-icon","since":"2026-11-14","remove_after":"2027-01-01","section":"§16 item 20; icons study IC-4","note":"journal value-icon-one-family: the family\'s font was never shipped; the value draws outlined until the date"},{"from":"sharp","to":"outlined","kind":"value","setting":"type","component":"sf-icon","since":"2026-11-14","remove_after":"2027-01-01","section":"§16 item 20; icons study IC-4","note":"journal value-icon-one-family: the family\'s font was never shipped; the value draws outlined until the date"}]}');

/***/ },

/***/ "756bf22cb853"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.icon","tag":"sf-icon","version":"1.4.4","kind":"leaf","settings":{"icon":{"type":"icon","default":""},"filled":{"type":"boolean","default":false},"weight":{"type":"number","integer":true,"min":100,"max":700,"step":100,"default":400},"size":{"type":"enum","values":["","1/4","1/3","1/2","1","2","3","4","5","6","7"],"default":""},"mirror":{"type":"enum","values":["auto","on","off"],"default":"auto"},"type":{"type":"enum","values":["","outlined"],"default":""},"grade":{"type":"number","integer":true,"min":-50,"max":200,"default":0},"optical-size":{"type":"number","min":20,"max":48,"default":24},"label":{"type":"string","default":""},"badge-count":{"type":"string","default":""},"badge-dot":{"type":"boolean","default":false},"badge-cap":{"type":"number","integer":true,"min":1,"default":99},"badge-label":{"type":"string","default":""}},"values":{"loaded":{"type":"boolean","default":false}},"events":{},"actions":{},"css-variables":{"--sf-icon-color":{"type":"color","state":"default"},"--sf-icon-glyph-size":{"type":"length","state":"default"},"--sf-icon-weight":{"type":"number","state":"default"},"--sf-icon-fill":{"type":"number","state":"default"},"--sf-icon-line-height":{"type":"number","state":"default"}}}');

/***/ },

/***/ "5d30914d54d5"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Icons","runtime":{"count":{"one":"{count} unread","other":"{count} unread"},"dot":"new"}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("55e16638d2ac");
/******/
/******/ })()
;