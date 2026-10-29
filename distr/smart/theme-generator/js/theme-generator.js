/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "e16a74b1f0e0"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DEFAULT_THEME_COLOR: () => (/* binding */ DEFAULT_THEME_COLOR),
/* harmony export */   THEME_ALPHA: () => (/* binding */ THEME_ALPHA),
/* harmony export */   THEME_PALETTES: () => (/* binding */ THEME_PALETTES),
/* harmony export */   THEME_RULES: () => (/* binding */ THEME_RULES),
/* harmony export */   THEME_TONES: () => (/* binding */ THEME_TONES),
/* harmony export */   VIVID_CHROMA: () => (/* binding */ VIVID_CHROMA),
/* harmony export */   applyTheme: () => (/* binding */ applyTheme),
/* harmony export */   colorToHct: () => (/* binding */ colorToHct),
/* harmony export */   isThemeColor: () => (/* binding */ isThemeColor),
/* harmony export */   themeFromColor: () => (/* binding */ themeFromColor),
/* harmony export */   themeFromHct: () => (/* binding */ themeFromHct),
/* harmony export */   themeToCss: () => (/* binding */ themeToCss),
/* harmony export */   themeVariables: () => (/* binding */ themeVariables)
/* harmony export */ });
/* harmony import */ var _vendor_material_color_utilities_hct_hct_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2bcd13326fc9");
/* harmony import */ var _vendor_material_color_utilities_palettes_tonal_palette_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("165b8320fb88");
/* harmony import */ var _vendor_material_color_utilities_utils_string_utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("4355ff5cca9a");
// A whole theme from one colour (owner, 2026-10-10: «a Smart component where
// you choose the main colour and it makes all the other variables»).
//
// The Framework's colours are eight tonal palettes of sixteen tones each --
// --sf-<palette>-<tone>, 98 down to 5 -- and every semantic token (--sf-primary,
// --sf-surface, --sf-outline, ...) reads them through light-dark(). So a theme
// is those 128 primitives, and nothing else needs to change.
//
// The palettes are made the way the SIMAI generator makes them (ui-doc,
// fundamentals/color/color-generator), on Google's HCT colour space: the chosen
// colour gives the primary palette its hue and chroma, and the others follow
// fixed rules. Fed the Framework's own primary (#005bbe: hue 265, chroma 85 as
// the generator's UI Kit values), these rules give back all 128 shipped
// primitives exactly -- tests/theme-palette.contract.test.mjs holds that.
//
// The generator's own inputs are a hue and a chroma in whole numbers
// (themeFromHct). A colour is read as them (themeFromColor): its hue to the
// degree, and its chroma -- unless the colour is as vivid as its hue can be at
// its tone, which a dark or a light brand colour always is. Then its own
// chroma is the gamut's limit, not the palette it stands for, and the
// generator's default vivid chroma is taken. #005bbe has chroma 59, the most
// hue 265 holds at tone 40; the palette it stands for is 85.
//
// HCT is Google's material-color-utilities 0.4.0 (Apache-2.0), the eight files
// it needs copied unchanged under ./vendor/material-color-utilities.



const THEME_TONES = Object.freeze([98, 95, 90, 85, 80, 70, 60, 50, 40, 35, 30, 25, 20, 15, 10, 5]); // The generator's defaults. `hue` and `chroma` are either a number or a
// function of the primary's; a caller may override any of them.

const THEME_RULES = Object.freeze({
  primary: {
    hue: source => source.hue,
    chroma: source => source.chroma
  },
  secondary: {
    hue: source => source.hue,
    chroma: 20
  },
  tertiary: {
    hue: source => (source.hue + 60) % 360,
    chroma: 40
  },
  neutral: {
    hue: source => source.hue,
    chroma: 5
  },
  error: {
    hue: 25,
    chroma: 85
  },
  warning: {
    hue: 60,
    chroma: 60
  },
  success: {
    hue: 145,
    chroma: 65
  },
  // Information is a status, not the brand (owner, 2026-10-21,
  // simai/ui-source#14): told in the brand's own colour, info turned red under
  // a red primary and read as danger. It is its own fixed palette of #005bbe,
  // like error, warning and success. #005bbe is HCT hue 265.1, chroma 58.5;
  // the chroma here is the nearest tenth above, the one whose palette is the
  // owner-approved list byte for byte -- it puts tone 40 on #005bbe itself,
  // where 58.5 lands a unit away on #015bbe.
  info: {
    hue: 265.1,
    chroma: 58.6
  }
});
const THEME_PALETTES = Object.freeze(Object.keys(THEME_RULES)); // The translucent steps core defines on a tone: --sf-<palette>-<tone>--alfa-<n>,
// the tone with n% opacity (the alpha scale: state 4/8/12, fill 12-32, ink
// 48/64/80). Core writes them as literal colours, so a theme that set the tones
// alone left every container fill and hover in the old hue (DEV, 2026-10-18:
// a tonal button stayed blue under a green theme). The theme writes them from
// its own tones; tests/theme-palette.contract.test.mjs holds this list to the
// one core declares.

const THEME_ALPHA = Object.freeze({
  primary: {
    50: [4, 8, 12, 16, 20, 24, 28, 32],
    90: [4, 8, 12, 24]
  },
  secondary: {
    50: [4, 8, 12, 16, 20, 24, 28, 32],
    90: [4, 8, 12, 24]
  },
  tertiary: {
    50: [4, 8, 12, 16, 20, 24, 28, 32],
    90: [4, 8, 12, 24]
  },
  neutral: {
    50: [4, 8, 12, 16, 20, 24, 32, 48, 80],
    60: [48, 64],
    80: [48],
    90: [4, 8, 12, 16, 20, 24, 32, 48]
  },
  error: {
    50: [4, 8, 12, 16, 20, 24, 28, 32],
    90: [4, 8, 12, 24]
  },
  warning: {
    50: [4, 8, 12, 16, 20, 24, 28, 32],
    90: [4, 8, 12, 24]
  },
  success: {
    50: [4, 8, 12, 16, 20, 24, 28, 32],
    90: [4, 8, 12, 24]
  },
  info: {
    50: [12, 16, 20, 24, 28, 32]
  }
});

const alphaHex = percent => Math.round(percent * 255 / 100).toString(16).padStart(2, '0'); // The Framework's own primary: the theme every page has until one is chosen.


const DEFAULT_THEME_COLOR = '#005bbe';
const HEX = /^#?(?:[0-9a-f]{3}|[0-9a-f]{6})$/iu;
function isThemeColor(value) {
  return typeof value === 'string' && HEX.test(value.trim());
}

const expand = value => {
  const text = value.trim().replace(/^#/u, '').toLowerCase();
  return `#${text.length === 3 ? [...text].map(digit => digit + digit).join('') : text}`;
};

const round = number => Math.round(number * 10) / 10; // The chroma the generator gives a vivid colour (UI Kit primary).


const VIVID_CHROMA = 85;
/**
 * The generator's inputs a colour stands for: {hue, chroma, hex, tone}.
 */

function colorToHct(color) {
  if (!isThemeColor(color)) throw new TypeError(`A theme colour is a hex colour, #rgb or #rrggbb: ${String(color)}`);
  const hex = expand(color);
  const hct = _vendor_material_color_utilities_hct_hct_js__WEBPACK_IMPORTED_MODULE_0__.Hct.fromInt((0,_vendor_material_color_utilities_utils_string_utils_js__WEBPACK_IMPORTED_MODULE_2__.argbFromHex)(hex)); // As vivid as the hue holds at this tone: asked for far more, the tone
  // comes back no more chromatic than the colour itself.

  const limit = _vendor_material_color_utilities_hct_hct_js__WEBPACK_IMPORTED_MODULE_0__.Hct.from(hct.hue, 200, hct.tone).chroma;
  const chroma = hct.chroma >= limit - 1 ? Math.max(VIVID_CHROMA, Math.round(hct.chroma)) : Math.round(hct.chroma);
  return {
    hex,
    hue: Math.round(hct.hue) % 360,
    chroma,
    tone: round(hct.tone)
  };
}
/**
 * The theme of a primary hue and chroma, the generator's own inputs: each
 * palette's hue, chroma and tones. `options[palette]` overrides that palette's
 * rule: {hue?, chroma?}.
 */

function themeFromHct({
  hue,
  chroma
} = {}, options = {}) {
  if (!Number.isFinite(hue) || !Number.isFinite(chroma)) throw new TypeError('A theme is made from a hue and a chroma');
  const source = {
    hue: (hue % 360 + 360) % 360,
    chroma: Math.max(0, chroma)
  };
  const palettes = {};

  for (const name of THEME_PALETTES) {
    const rule = { ...THEME_RULES[name],
      ...(options[name] ?? {})
    };
    const paletteHue = typeof rule.hue === 'function' ? rule.hue(source) : Number(rule.hue);
    const paletteChroma = typeof rule.chroma === 'function' ? rule.chroma(source) : Number(rule.chroma);
    if (!Number.isFinite(paletteHue) || !Number.isFinite(paletteChroma)) throw new TypeError(`${name}: hue and chroma are numbers`);
    const palette = _vendor_material_color_utilities_palettes_tonal_palette_js__WEBPACK_IMPORTED_MODULE_1__.TonalPalette.fromHueAndChroma((paletteHue % 360 + 360) % 360, Math.max(0, paletteChroma));
    palettes[name] = {
      hue: round(palette.hue),
      chroma: round(palette.chroma),
      tones: Object.fromEntries(THEME_TONES.map(tone => [tone, (0,_vendor_material_color_utilities_utils_string_utils_js__WEBPACK_IMPORTED_MODULE_2__.hexFromArgb)(palette.tone(tone))]))
    };
  }

  return {
    schema: 'simai.framework.theme',
    schema_version: 1,
    source,
    palettes
  };
}
/** The theme one colour makes (see colorToHct for how it is read). */

function themeFromColor(color = DEFAULT_THEME_COLOR, options = {}) {
  const read = colorToHct(color);
  const theme = themeFromHct(read, options);
  return { ...theme,
    source: { ...theme.source,
      hex: read.hex,
      tone: read.tone
    }
  };
}
/** The theme's CSS custom properties, {name: value}. */

function themeVariables(theme) {
  const variables = {};

  for (const [name, palette] of Object.entries(theme?.palettes ?? {})) {
    for (const [tone, value] of Object.entries(palette.tones ?? {})) variables[`--sf-${name}-${tone}`] = value;
  }

  for (const [name, palette] of Object.entries(theme?.palettes ?? {})) {
    for (const [tone, steps] of Object.entries(THEME_ALPHA[name] ?? {})) {
      const base = palette.tones?.[tone];
      if (!base) continue;

      for (const step of steps) variables[`--sf-${name}-${tone}--alfa-${step}`] = `${base}${alphaHex(step)}`;
    }
  }

  return variables;
}
/** The theme as a stylesheet rule, for a page's or a site's own CSS. */

function themeToCss(theme, selector = ':root') {
  const lines = Object.entries(themeVariables(theme)).map(([name, value]) => `  ${name}: ${value};`);
  return `${selector} {\n${lines.join('\n')}\n}\n`;
}
/**
 * Applies the theme to an element's inline style (the page by default) and
 * returns a function that takes it off again.
 */

function applyTheme(theme, target = globalThis.document?.documentElement) {
  if (!target?.style) return () => {};
  const variables = themeVariables(theme);
  const before = Object.fromEntries(Object.keys(variables).map(name => [name, target.style.getPropertyValue(name)]));

  for (const [name, value] of Object.entries(variables)) target.style.setProperty(name, value);

  return () => {
    for (const [name, value] of Object.entries(before)) {
      if (value) target.style.setProperty(name, value);else target.style.removeProperty(name);
    }
  };
}

if (typeof window !== 'undefined') {
  window.SF = window.SF || {};
  window.SF.ThemePalette = Object.freeze({
    themeFromColor,
    themeFromHct,
    colorToHct,
    themeToCss,
    themeVariables,
    applyTheme,
    isThemeColor,
    THEME_TONES,
    THEME_PALETTES,
    THEME_ALPHA,
    DEFAULT_THEME_COLOR
  });
}

/***/ },

/***/ "7596c29157bc"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SfThemeGenerator: () => (/* binding */ SfThemeGenerator)
/* harmony export */ });
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _core_js_theme_palette_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("e16a74b1f0e0");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("ef761541fe6e");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("bc9a73b2d5a7");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("365c1fe558c1");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("1ec50e997e9a");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("d7615363c74c");
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("b4c25f97bb99");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_3__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_3__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
// sf-theme-generator: a theme from one colour (owner, 2026-10-10: «a Smart
// component where a person chooses the main colour and it makes all the
// other variables»).
//
// The calculation is core's theme-palette: one colour gives the eight tonal
// palettes, the 128 primitives --sf-<palette>-<tone> every semantic token
// reads. This element is the choice around it: a colour, the generator's own
// hue and chroma for fine tuning, a preview of the palettes, and a way back to
// the Framework's own colour. It stores nothing -- the host keeps the choice
// (Docara settings, Larena site settings) -- and changes nothing on the page
// unless it is asked to with `apply`.
//
// From its component.json (standard simai.smart-component 1.3.8 §3, §4, §8):
// the settings are made by core/js/element-manifest.js, reset is the action,
// the words are the language files'; the choice is the browser's change and
// the commit sf-theme-generator-committed, the former -change, sf-theme-change,
// -apply and sf-theme-apply following until 2026-12-01 (aliases.json).








 // The tones the preview shows: light to dark, the brand tone (40) among them.

const PREVIEW_TONES = [90, 70, 50, 40, 30, 10];
const LIMITS = {
  hue: [0, 360],
  chroma: [0, 150]
}; // A hex the calculation accepts, as #rrggbb, or '' for none. The colour
// control also holds #rrggbbaa; a theme has no transparency, so it is dropped.

const normaliseColor = value => {
  let text = String(value ?? '').trim();
  if (/^#?[0-9a-f]{8}$/iu.test(text)) text = text.replace(/^#?/u, '#').slice(0, 7);
  return (0,_core_js_theme_palette_js__WEBPACK_IMPORTED_MODULE_2__.isThemeColor)(text) ? (0,_core_js_theme_palette_js__WEBPACK_IMPORTED_MODULE_2__.colorToHct)(text).hex : '';
}; // A whole number in the field's range, or null. `clamp` takes a number out of
// range to its edge (a committed field); without it such a number is not read
// at all (a field still being typed: «4» on the way to «45» is not 4 yet, but
// «400» on the way nowhere is not 360 either).


const readNumber = (value, [min, max], clamp = false) => {
  const text = String(value ?? '').trim();
  if (!/^-?\d+(?:[.,]\d+)?$/u.test(text)) return null;
  const number = Math.round(Number(text.replace(',', '.')));
  if (!Number.isFinite(number)) return null;
  if (number < min || number > max) return clamp ? Math.min(max, Math.max(min, number)) : null;
  return number;
};

const copy = value => JSON.parse(JSON.stringify(value));

const ThemeGeneratorElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_4__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_6__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_7__
  },
  source: 'ru',
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_5__,
  actions: {
    reset() {
      return this.runReset();
    }

  }
});

class SfThemeGenerator extends ThemeGeneratorElement {
  constructor() {
    super();
    this._themeKey = null;
    this._theme = null;
    this._undo = null;
    this._applied = {
      target: null,
      key: null
    };
    this._quiet = false;
    this._committedKey = null;
  } // The main colour, #rrggbb, or '' while the Framework's own one applies.


  get value() {
    return normaliseColor(this.getAttribute('value'));
  }

  set value(next) {
    const value = normaliseColor(next);
    if (value) this.setAttribute('value', value);else this.removeAttribute('value');
  } // The colour the theme is made from.


  get color() {
    return this.value || _core_js_theme_palette_js__WEBPACK_IMPORTED_MODULE_2__.DEFAULT_THEME_COLOR;
  } // Unset, the colour's own reading; out of range, the edge (§4.2 nullable).


  get hue() {
    return readNumber(this.getAttribute('hue'), LIMITS.hue, true) ?? (0,_core_js_theme_palette_js__WEBPACK_IMPORTED_MODULE_2__.colorToHct)(this.color).hue;
  }

  set hue(next) {
    super.hue = next;
  }

  get chroma() {
    return readNumber(this.getAttribute('chroma'), LIMITS.chroma, true) ?? (0,_core_js_theme_palette_js__WEBPACK_IMPORTED_MODULE_2__.colorToHct)(this.color).chroma;
  }

  set chroma(next) {
    super.chroma = next;
  }

  get selector() {
    return this.getAttribute('selector') || ':root';
  }

  set selector(next) {
    super.selector = next;
  }
  /** The theme shown now (a copy: changing it changes nothing). */


  get theme() {
    return copy(this._currentTheme());
  }
  /** The theme as one stylesheet rule of its 128 primitives. */


  toCSS(selector = this.selector) {
    return (0,_core_js_theme_palette_js__WEBPACK_IMPORTED_MODULE_2__.themeToCss)(this._currentTheme(), selector || ':root');
  }
  /** The theme object (simai.framework.theme.v1). */


  toJSON() {
    return copy(this._currentTheme());
  }
  /** The action reset: back to SIMAI Framework's own colour; a committed choice. */


  runReset() {
    this._batch(() => {
      this.removeAttribute('value');
      this.removeAttribute('hue');
      this.removeAttribute('chroma');
    });

    this._emitChange();

    this._commit(true);

    return {
      outcome: 'applied'
    };
  }

  _key() {
    const tuned = name => readNumber(this.getAttribute(name), LIMITS[name], true) ?? '';

    return `${this.color}|${tuned('hue')}|${tuned('chroma')}`;
  } // A hue or chroma set on the element is the generator's own input and wins
  // over the colour's reading; without them the colour is read as
  // themeFromColor reads it. The two give the same palettes for the same
  // numbers, so a host that stores all three gets back what it stored.


  _currentTheme() {
    const key = this._key();

    if (key !== this._themeKey) {
      const tuned = this.hasAttribute('hue') || this.hasAttribute('chroma');
      this._theme = tuned ? (0,_core_js_theme_palette_js__WEBPACK_IMPORTED_MODULE_2__.themeFromHct)({
        hue: this.hue,
        chroma: this.chroma
      }) : (0,_core_js_theme_palette_js__WEBPACK_IMPORTED_MODULE_2__.themeFromColor)(this.color);
      this._themeKey = key;
    }

    return this._theme;
  }

  _detail() {
    const theme = this._currentTheme();

    return {
      value: this.value,
      hue: this.hue,
      chroma: this.chroma,
      theme: copy(theme),
      variables: (0,_core_js_theme_palette_js__WEBPACK_IMPORTED_MODULE_2__.themeVariables)(theme),
      css: (0,_core_js_theme_palette_js__WEBPACK_IMPORTED_MODULE_2__.themeToCss)(theme, this.selector)
    };
  }

  _emitChange() {
    // The browser's change with the theme in the detail (vocabulary 1.1.5
    // §5.1); sf-theme-generator-change and its first name sf-theme-change,
    // which the Loader's own light/dark event also bears, follow it until
    // 2026-12-01 (aliases.json).
    this.sfEmit('change', this._detail());
  } // Committed once per distinct theme: Enter and the field's own change that
  // follows it are one commit, not two.


  _commit(force = false) {
    const key = this._key();

    if (!force && key === this._committedKey) return;
    this._committedKey = key; // sf-theme-generator-committed; -apply and sf-theme-apply follow.

    this.sfEmit('committed', this._detail());
  } // Several attributes as one change: the page is re-themed once.


  _batch(write) {
    this._quiet = true;

    try {
      write();
    } finally {
      this._quiet = false;
    }

    this._sync();

    this.requestComponentUpdate('theme');
  }

  _target() {
    if (!this.hasAttribute('apply') || this.getAttribute('apply') === 'false') return null;
    const selector = this.getAttribute('target');
    if (!selector) return document.documentElement;

    try {
      return document.querySelector(selector);
    } catch {
      return null;
    }
  } // With `apply`, the theme is on the target, and only the latest one: the
  // previous application is taken off first, so the target's own inline
  // values come back rather than a theme from two choices ago.


  _sync() {
    if (!this.isConnected) return;

    const target = this._target();

    const key = target ? this._key() : null;
    if (target === this._applied.target && key === this._applied.key) return;

    this._unapply();

    if (target) this._undo = (0,_core_js_theme_palette_js__WEBPACK_IMPORTED_MODULE_2__.applyTheme)(this._currentTheme(), target);
    this._applied = {
      target,
      key
    };
  }

  _unapply() {
    this._undo?.();
    this._undo = null;
    this._applied = {
      target: null,
      key: null
    };
  }

  attributeChangedCallback(name, previous, next) {
    super.attributeChangedCallback?.(name, previous, next);
    if (previous !== next && !this._quiet) this._sync();
  }

  connectedCallback() {
    super.connectedCallback?.();
    this._committedKey = this._key();

    this._sync();
  }

  disconnectedCallback() {
    this._unapply();

    super.disconnectedCallback?.();
  } // The colour control: its input moves the choice, its change commits it.
  // Its own events stop here; the generator's are the ones a host hears.


  _colorInput(event) {
    event.stopPropagation();
    const value = normaliseColor(event.detail?.value ?? event.target?.value);
    if (!value) return;
    const moved = value !== this.value || this.hasAttribute('hue') || this.hasAttribute('chroma');

    if (moved) {
      this._batch(() => {
        this.setAttribute('value', value);
        this.removeAttribute('hue');
        this.removeAttribute('chroma');
      });

      this._emitChange();
    }
  }

  _colorChange(event) {
    this._colorInput(event);

    this._commit();
  }

  _fieldInput(name, event) {
    event.stopPropagation();
    const number = readNumber(event.target?.value, LIMITS[name]);
    if (number === null || String(number) === this.getAttribute(name)) return;

    this._batch(() => this.setAttribute(name, String(number)));

    this._emitChange();
  }

  _fieldCommit(name, field) {
    const number = readNumber(field?.value, LIMITS[name], true);

    if (number !== null && String(number) !== this.getAttribute(name)) {
      this._batch(() => this.setAttribute(name, String(number)));

      this._emitChange();
    } // What the field shows is what the theme uses: «400» reads 360, and an
    // empty field shows the number it stands for again.


    if (field && String(field.value) !== String(this[name])) field.value = String(this[name]);

    this._commit();
  }

  _fieldChange(name, event) {
    event.stopPropagation();

    this._fieldCommit(name, event.currentTarget);
  }

  _fieldKey(name, event) {
    if (event.key !== 'Enter') return; // Enter commits the theme; it does not also submit a settings form the
    // generator stands in.

    event.preventDefault();

    this._fieldCommit(name, event.currentTarget);
  }

  templateContext() {
    const text = key => this.sfWord(key);

    const theme = this._currentTheme();

    return this.createTemplateContext({ ...this.getPropsContext(),
      component: this,
      size: this.size,
      value: this.value,
      inheritedValue: _core_js_theme_palette_js__WEBPACK_IMPORTED_MODULE_2__.DEFAULT_THEME_COLOR,
      hue: this.hue,
      chroma: this.chroma,
      swatches: this.swatches,
      text: {
        color: text('color'),
        inherited: text('inherited'),
        advanced: text('advanced'),
        hue: text('hue'),
        hueHint: text('hue-hint'),
        chroma: text('chroma'),
        chromaHint: text('chroma-hint'),
        reset: text('reset'),
        preview: text('preview')
      },
      palettes: _core_js_theme_palette_js__WEBPACK_IMPORTED_MODULE_2__.THEME_PALETTES.map(name => ({
        name,
        label: text(name),
        swatches: PREVIEW_TONES.map(tone => ({
          tone,
          hex: theme.palettes[name].tones[tone]
        }))
      })),
      rootClass: this.getRootClass(),
      // A group named by the host's aria-label, else the generator's title.
      label: this.getAttribute('aria-label') || text('title')
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_3__.renderThemeGeneratorTemplate)(this.templateContext());
  }

}

SfThemeGenerator.define('sf-theme-generator');

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "ef761541fe6e"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderThemeGeneratorTemplate: () => (/* binding */ renderThemeGeneratorTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
 // The choice above, the palettes below. The colour is sf-color: the
// platform's picker and the product's own swatches, unset while the
// Framework's colour applies. Hue and chroma, the generator's own inputs, are
// folded away: most people choose a colour and are done. The <details> is not
// bound to anything, so a redraw never folds it while somebody is typing.

function renderThemeGeneratorTemplate(context) {
  const {
    component,
    size,
    text
  } = context;

  const field = (name, value, hint) => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <sf-input class="sf-theme-generator-field" data-field=${name} size=${size}
              label=${text[name]} hint=${hint} value=${String(value)}
              inputmode="numeric" maxlength="3"
              @input=${event => component._fieldInput(name, event)}
              @change=${event => component._fieldChange(name, event)}
              @keydown=${event => component._fieldKey(name, event)}></sf-input>`;

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div class=${['sf-theme-generator', `sf-theme-generator--size-${size}`, context.rootClass].filter(Boolean).join(' ')}
         style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} role="group" aria-label=${context.label || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
      <div class="sf-theme-generator-choice">
        <div class="sf-theme-generator-color">
          <span class="sf-theme-generator-label" aria-hidden="true">${text.color}</span>
          <sf-color size=${size} label=${text.color}
                    value=${context.value || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    inherited-value=${context.inheritedValue}
                    inherited-text=${text.inherited}
                    swatches=${context.swatches || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    @input=${event => component._colorInput(event)}
                    @change=${event => component._colorChange(event)}></sf-color>
        </div>
        <sf-button class="sf-theme-generator-reset" size=${size} appearance="outline" scheme="on-surface"
                   icon-start="restart_alt" text=${text.reset}
                   @click=${() => component.reset()}></sf-button>
      </div>
      <details class="sf-theme-generator-advanced">
        <summary class="sf-theme-generator-summary">${text.advanced}</summary>
        <div class="sf-theme-generator-fields">
          ${field('hue', context.hue, text.hueHint)}
          ${field('chroma', context.chroma, text.chromaHint)}
        </div>
      </details>
      <section class="sf-theme-generator-preview" aria-label=${text.preview}>
        ${context.palettes.map(palette => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
          <div class="sf-theme-generator-row" data-palette=${palette.name}>
            <span class="sf-theme-generator-name">${palette.label}</span>
            <span class="sf-theme-generator-swatches">
              ${palette.swatches.map(swatch => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                <span class="sf-theme-generator-swatch" role="img"
                      data-tone=${swatch.tone} data-hex=${swatch.hex}
                      title=${`${swatch.tone} · ${swatch.hex}`}
                      aria-label=${`${palette.label} ${swatch.tone}: ${swatch.hex}`}
                      style=${`--sf-theme-generator--swatch: ${swatch.hex}`}></span>`)}
            </span>
          </div>`)}
      </section>
    </div>
  `;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "b4c25f97bb99"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


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

/***/ "b2aa8c3d1576"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Cam16: () => (/* binding */ Cam16)
/* harmony export */ });
/* harmony import */ var _utils_color_utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("5dc6cf71e7e6");
/* harmony import */ var _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("df26304b2f0d");
/* harmony import */ var _viewing_conditions_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("8440f1651740");
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */



/**
 * CAM16, a color appearance model. Colors are not just defined by their hex
 * code, but rather, a hex code and viewing conditions.
 *
 * CAM16 instances also have coordinates in the CAM16-UCS space, called J*, a*,
 * b*, or jstar, astar, bstar in code. CAM16-UCS is included in the CAM16
 * specification, and should be used when measuring distances between colors.
 *
 * In traditional color spaces, a color can be identified solely by the
 * observer's measurement of the color. Color appearance models such as CAM16
 * also use information about the environment where the color was
 * observed, known as the viewing conditions.
 *
 * For example, white under the traditional assumption of a midday sun white
 * point is accurately measured as a slightly chromatic blue by CAM16. (roughly,
 * hue 203, chroma 3, lightness 100)
 */

class Cam16 {
  /**
   * All of the CAM16 dimensions can be calculated from 3 of the dimensions, in
   * the following combinations:
   *      -  {j or q} and {c, m, or s} and hue
   *      - jstar, astar, bstar
   * Prefer using a static method that constructs from 3 of those dimensions.
   * This constructor is intended for those methods to use to return all
   * possible dimensions.
   *
   * @param hue
   * @param chroma informally, colorfulness / color intensity. like saturation
   *     in HSL, except perceptually accurate.
   * @param j lightness
   * @param q brightness; ratio of lightness to white point's lightness
   * @param m colorfulness
   * @param s saturation; ratio of chroma to white point's chroma
   * @param jstar CAM16-UCS J coordinate
   * @param astar CAM16-UCS a coordinate
   * @param bstar CAM16-UCS b coordinate
   */
  constructor(hue, chroma, j, q, m, s, jstar, astar, bstar) {
    this.hue = hue;
    this.chroma = chroma;
    this.j = j;
    this.q = q;
    this.m = m;
    this.s = s;
    this.jstar = jstar;
    this.astar = astar;
    this.bstar = bstar;
  }
  /**
   * CAM16 instances also have coordinates in the CAM16-UCS space, called J*,
   * a*, b*, or jstar, astar, bstar in code. CAM16-UCS is included in the CAM16
   * specification, and is used to measure distances between colors.
   */


  distance(other) {
    const dJ = this.jstar - other.jstar;
    const dA = this.astar - other.astar;
    const dB = this.bstar - other.bstar;
    const dEPrime = Math.sqrt(dJ * dJ + dA * dA + dB * dB);
    const dE = 1.41 * Math.pow(dEPrime, 0.63);
    return dE;
  }
  /**
   * @param argb ARGB representation of a color.
   * @return CAM16 color, assuming the color was viewed in default viewing
   *     conditions.
   */


  static fromInt(argb) {
    return Cam16.fromIntInViewingConditions(argb, _viewing_conditions_js__WEBPACK_IMPORTED_MODULE_2__.ViewingConditions.DEFAULT);
  }
  /**
   * @param argb ARGB representation of a color.
   * @param viewingConditions Information about the environment where the color
   *     was observed.
   * @return CAM16 color.
   */


  static fromIntInViewingConditions(argb, viewingConditions) {
    const red = (argb & 0x00ff0000) >> 16;
    const green = (argb & 0x0000ff00) >> 8;
    const blue = argb & 0x000000ff;
    const redL = _utils_color_utils_js__WEBPACK_IMPORTED_MODULE_0__.linearized(red);
    const greenL = _utils_color_utils_js__WEBPACK_IMPORTED_MODULE_0__.linearized(green);
    const blueL = _utils_color_utils_js__WEBPACK_IMPORTED_MODULE_0__.linearized(blue);
    const x = 0.41233895 * redL + 0.35762064 * greenL + 0.18051042 * blueL;
    const y = 0.2126 * redL + 0.7152 * greenL + 0.0722 * blueL;
    const z = 0.01932141 * redL + 0.11916382 * greenL + 0.95034478 * blueL;
    const rC = 0.401288 * x + 0.650173 * y - 0.051461 * z;
    const gC = -0.250268 * x + 1.204414 * y + 0.045854 * z;
    const bC = -0.002079 * x + 0.048952 * y + 0.953127 * z;
    const rD = viewingConditions.rgbD[0] * rC;
    const gD = viewingConditions.rgbD[1] * gC;
    const bD = viewingConditions.rgbD[2] * bC;
    const rAF = Math.pow(viewingConditions.fl * Math.abs(rD) / 100.0, 0.42);
    const gAF = Math.pow(viewingConditions.fl * Math.abs(gD) / 100.0, 0.42);
    const bAF = Math.pow(viewingConditions.fl * Math.abs(bD) / 100.0, 0.42);
    const rA = _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_1__.signum(rD) * 400.0 * rAF / (rAF + 27.13);
    const gA = _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_1__.signum(gD) * 400.0 * gAF / (gAF + 27.13);
    const bA = _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_1__.signum(bD) * 400.0 * bAF / (bAF + 27.13);
    const a = (11.0 * rA + -12.0 * gA + bA) / 11.0;
    const b = (rA + gA - 2.0 * bA) / 9.0;
    const u = (20.0 * rA + 20.0 * gA + 21.0 * bA) / 20.0;
    const p2 = (40.0 * rA + 20.0 * gA + bA) / 20.0;
    const atan2 = Math.atan2(b, a);
    const atanDegrees = atan2 * 180.0 / Math.PI;
    const hue = _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_1__.sanitizeDegreesDouble(atanDegrees);
    const hueRadians = hue * Math.PI / 180.0;
    const ac = p2 * viewingConditions.nbb;
    const j = 100.0 * Math.pow(ac / viewingConditions.aw, viewingConditions.c * viewingConditions.z);
    const q = 4.0 / viewingConditions.c * Math.sqrt(j / 100.0) * (viewingConditions.aw + 4.0) * viewingConditions.fLRoot;
    const huePrime = hue < 20.14 ? hue + 360 : hue;
    const eHue = 0.25 * (Math.cos(huePrime * Math.PI / 180.0 + 2.0) + 3.8);
    const p1 = 50000.0 / 13.0 * eHue * viewingConditions.nc * viewingConditions.ncb;
    const t = p1 * Math.sqrt(a * a + b * b) / (u + 0.305);
    const alpha = Math.pow(t, 0.9) * Math.pow(1.64 - Math.pow(0.29, viewingConditions.n), 0.73);
    const c = alpha * Math.sqrt(j / 100.0);
    const m = c * viewingConditions.fLRoot;
    const s = 50.0 * Math.sqrt(alpha * viewingConditions.c / (viewingConditions.aw + 4.0));
    const jstar = (1.0 + 100.0 * 0.007) * j / (1.0 + 0.007 * j);
    const mstar = 1.0 / 0.0228 * Math.log(1.0 + 0.0228 * m);
    const astar = mstar * Math.cos(hueRadians);
    const bstar = mstar * Math.sin(hueRadians);
    return new Cam16(hue, c, j, q, m, s, jstar, astar, bstar);
  }
  /**
   * @param j CAM16 lightness
   * @param c CAM16 chroma
   * @param h CAM16 hue
   */


  static fromJch(j, c, h) {
    return Cam16.fromJchInViewingConditions(j, c, h, _viewing_conditions_js__WEBPACK_IMPORTED_MODULE_2__.ViewingConditions.DEFAULT);
  }
  /**
   * @param j CAM16 lightness
   * @param c CAM16 chroma
   * @param h CAM16 hue
   * @param viewingConditions Information about the environment where the color
   *     was observed.
   */


  static fromJchInViewingConditions(j, c, h, viewingConditions) {
    const q = 4.0 / viewingConditions.c * Math.sqrt(j / 100.0) * (viewingConditions.aw + 4.0) * viewingConditions.fLRoot;
    const m = c * viewingConditions.fLRoot;
    const alpha = c / Math.sqrt(j / 100.0);
    const s = 50.0 * Math.sqrt(alpha * viewingConditions.c / (viewingConditions.aw + 4.0));
    const hueRadians = h * Math.PI / 180.0;
    const jstar = (1.0 + 100.0 * 0.007) * j / (1.0 + 0.007 * j);
    const mstar = 1.0 / 0.0228 * Math.log(1.0 + 0.0228 * m);
    const astar = mstar * Math.cos(hueRadians);
    const bstar = mstar * Math.sin(hueRadians);
    return new Cam16(h, c, j, q, m, s, jstar, astar, bstar);
  }
  /**
   * @param jstar CAM16-UCS lightness.
   * @param astar CAM16-UCS a dimension. Like a* in L*a*b*, it is a Cartesian
   *     coordinate on the Y axis.
   * @param bstar CAM16-UCS b dimension. Like a* in L*a*b*, it is a Cartesian
   *     coordinate on the X axis.
   */


  static fromUcs(jstar, astar, bstar) {
    return Cam16.fromUcsInViewingConditions(jstar, astar, bstar, _viewing_conditions_js__WEBPACK_IMPORTED_MODULE_2__.ViewingConditions.DEFAULT);
  }
  /**
   * @param jstar CAM16-UCS lightness.
   * @param astar CAM16-UCS a dimension. Like a* in L*a*b*, it is a Cartesian
   *     coordinate on the Y axis.
   * @param bstar CAM16-UCS b dimension. Like a* in L*a*b*, it is a Cartesian
   *     coordinate on the X axis.
   * @param viewingConditions Information about the environment where the color
   *     was observed.
   */


  static fromUcsInViewingConditions(jstar, astar, bstar, viewingConditions) {
    const a = astar;
    const b = bstar;
    const m = Math.sqrt(a * a + b * b);
    const M = (Math.exp(m * 0.0228) - 1.0) / 0.0228;
    const c = M / viewingConditions.fLRoot;
    let h = Math.atan2(b, a) * (180.0 / Math.PI);

    if (h < 0.0) {
      h += 360.0;
    }

    const j = jstar / (1 - (jstar - 100) * 0.007);
    return Cam16.fromJchInViewingConditions(j, c, h, viewingConditions);
  }
  /**
   *  @return ARGB representation of color, assuming the color was viewed in
   *     default viewing conditions, which are near-identical to the default
   *     viewing conditions for sRGB.
   */


  toInt() {
    return this.viewed(_viewing_conditions_js__WEBPACK_IMPORTED_MODULE_2__.ViewingConditions.DEFAULT);
  }
  /**
   * @param viewingConditions Information about the environment where the color
   *     will be viewed.
   * @return ARGB representation of color
   */


  viewed(viewingConditions) {
    const alpha = this.chroma === 0.0 || this.j === 0.0 ? 0.0 : this.chroma / Math.sqrt(this.j / 100.0);
    const t = Math.pow(alpha / Math.pow(1.64 - Math.pow(0.29, viewingConditions.n), 0.73), 1.0 / 0.9);
    const hRad = this.hue * Math.PI / 180.0;
    const eHue = 0.25 * (Math.cos(hRad + 2.0) + 3.8);
    const ac = viewingConditions.aw * Math.pow(this.j / 100.0, 1.0 / viewingConditions.c / viewingConditions.z);
    const p1 = eHue * (50000.0 / 13.0) * viewingConditions.nc * viewingConditions.ncb;
    const p2 = ac / viewingConditions.nbb;
    const hSin = Math.sin(hRad);
    const hCos = Math.cos(hRad);
    const gamma = 23.0 * (p2 + 0.305) * t / (23.0 * p1 + 11.0 * t * hCos + 108.0 * t * hSin);
    const a = gamma * hCos;
    const b = gamma * hSin;
    const rA = (460.0 * p2 + 451.0 * a + 288.0 * b) / 1403.0;
    const gA = (460.0 * p2 - 891.0 * a - 261.0 * b) / 1403.0;
    const bA = (460.0 * p2 - 220.0 * a - 6300.0 * b) / 1403.0;
    const rCBase = Math.max(0, 27.13 * Math.abs(rA) / (400.0 - Math.abs(rA)));
    const rC = _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_1__.signum(rA) * (100.0 / viewingConditions.fl) * Math.pow(rCBase, 1.0 / 0.42);
    const gCBase = Math.max(0, 27.13 * Math.abs(gA) / (400.0 - Math.abs(gA)));
    const gC = _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_1__.signum(gA) * (100.0 / viewingConditions.fl) * Math.pow(gCBase, 1.0 / 0.42);
    const bCBase = Math.max(0, 27.13 * Math.abs(bA) / (400.0 - Math.abs(bA)));
    const bC = _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_1__.signum(bA) * (100.0 / viewingConditions.fl) * Math.pow(bCBase, 1.0 / 0.42);
    const rF = rC / viewingConditions.rgbD[0];
    const gF = gC / viewingConditions.rgbD[1];
    const bF = bC / viewingConditions.rgbD[2];
    const x = 1.86206786 * rF - 1.01125463 * gF + 0.14918677 * bF;
    const y = 0.38752654 * rF + 0.62144744 * gF - 0.00897398 * bF;
    const z = -0.01584150 * rF - 0.03412294 * gF + 1.04996444 * bF;
    const argb = _utils_color_utils_js__WEBPACK_IMPORTED_MODULE_0__.argbFromXyz(x, y, z);
    return argb;
  } /// Given color expressed in XYZ and viewed in [viewingConditions], convert to
  /// CAM16.


  static fromXyzInViewingConditions(x, y, z, viewingConditions) {
    // Transform XYZ to 'cone'/'rgb' responses
    const rC = 0.401288 * x + 0.650173 * y - 0.051461 * z;
    const gC = -0.250268 * x + 1.204414 * y + 0.045854 * z;
    const bC = -0.002079 * x + 0.048952 * y + 0.953127 * z; // Discount illuminant

    const rD = viewingConditions.rgbD[0] * rC;
    const gD = viewingConditions.rgbD[1] * gC;
    const bD = viewingConditions.rgbD[2] * bC; // chromatic adaptation

    const rAF = Math.pow(viewingConditions.fl * Math.abs(rD) / 100.0, 0.42);
    const gAF = Math.pow(viewingConditions.fl * Math.abs(gD) / 100.0, 0.42);
    const bAF = Math.pow(viewingConditions.fl * Math.abs(bD) / 100.0, 0.42);
    const rA = _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_1__.signum(rD) * 400.0 * rAF / (rAF + 27.13);
    const gA = _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_1__.signum(gD) * 400.0 * gAF / (gAF + 27.13);
    const bA = _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_1__.signum(bD) * 400.0 * bAF / (bAF + 27.13); // redness-greenness

    const a = (11.0 * rA + -12.0 * gA + bA) / 11.0; // yellowness-blueness

    const b = (rA + gA - 2.0 * bA) / 9.0; // auxiliary components

    const u = (20.0 * rA + 20.0 * gA + 21.0 * bA) / 20.0;
    const p2 = (40.0 * rA + 20.0 * gA + bA) / 20.0; // hue

    const atan2 = Math.atan2(b, a);
    const atanDegrees = atan2 * 180.0 / Math.PI;
    const hue = atanDegrees < 0 ? atanDegrees + 360.0 : atanDegrees >= 360 ? atanDegrees - 360 : atanDegrees;
    const hueRadians = hue * Math.PI / 180.0; // achromatic response to color

    const ac = p2 * viewingConditions.nbb; // CAM16 lightness and brightness

    const J = 100.0 * Math.pow(ac / viewingConditions.aw, viewingConditions.c * viewingConditions.z);
    const Q = 4.0 / viewingConditions.c * Math.sqrt(J / 100.0) * (viewingConditions.aw + 4.0) * viewingConditions.fLRoot;
    const huePrime = hue < 20.14 ? hue + 360 : hue;
    const eHue = 1.0 / 4.0 * (Math.cos(huePrime * Math.PI / 180.0 + 2.0) + 3.8);
    const p1 = 50000.0 / 13.0 * eHue * viewingConditions.nc * viewingConditions.ncb;
    const t = p1 * Math.sqrt(a * a + b * b) / (u + 0.305);
    const alpha = Math.pow(t, 0.9) * Math.pow(1.64 - Math.pow(0.29, viewingConditions.n), 0.73); // CAM16 chroma, colorfulness, chroma

    const C = alpha * Math.sqrt(J / 100.0);
    const M = C * viewingConditions.fLRoot;
    const s = 50.0 * Math.sqrt(alpha * viewingConditions.c / (viewingConditions.aw + 4.0)); // CAM16-UCS components

    const jstar = (1.0 + 100.0 * 0.007) * J / (1.0 + 0.007 * J);
    const mstar = Math.log(1.0 + 0.0228 * M) / 0.0228;
    const astar = mstar * Math.cos(hueRadians);
    const bstar = mstar * Math.sin(hueRadians);
    return new Cam16(hue, C, J, Q, M, s, jstar, astar, bstar);
  } /// XYZ representation of CAM16 seen in [viewingConditions].


  xyzInViewingConditions(viewingConditions) {
    const alpha = this.chroma === 0.0 || this.j === 0.0 ? 0.0 : this.chroma / Math.sqrt(this.j / 100.0);
    const t = Math.pow(alpha / Math.pow(1.64 - Math.pow(0.29, viewingConditions.n), 0.73), 1.0 / 0.9);
    const hRad = this.hue * Math.PI / 180.0;
    const eHue = 0.25 * (Math.cos(hRad + 2.0) + 3.8);
    const ac = viewingConditions.aw * Math.pow(this.j / 100.0, 1.0 / viewingConditions.c / viewingConditions.z);
    const p1 = eHue * (50000.0 / 13.0) * viewingConditions.nc * viewingConditions.ncb;
    const p2 = ac / viewingConditions.nbb;
    const hSin = Math.sin(hRad);
    const hCos = Math.cos(hRad);
    const gamma = 23.0 * (p2 + 0.305) * t / (23.0 * p1 + 11 * t * hCos + 108.0 * t * hSin);
    const a = gamma * hCos;
    const b = gamma * hSin;
    const rA = (460.0 * p2 + 451.0 * a + 288.0 * b) / 1403.0;
    const gA = (460.0 * p2 - 891.0 * a - 261.0 * b) / 1403.0;
    const bA = (460.0 * p2 - 220.0 * a - 6300.0 * b) / 1403.0;
    const rCBase = Math.max(0, 27.13 * Math.abs(rA) / (400.0 - Math.abs(rA)));
    const rC = _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_1__.signum(rA) * (100.0 / viewingConditions.fl) * Math.pow(rCBase, 1.0 / 0.42);
    const gCBase = Math.max(0, 27.13 * Math.abs(gA) / (400.0 - Math.abs(gA)));
    const gC = _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_1__.signum(gA) * (100.0 / viewingConditions.fl) * Math.pow(gCBase, 1.0 / 0.42);
    const bCBase = Math.max(0, 27.13 * Math.abs(bA) / (400.0 - Math.abs(bA)));
    const bC = _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_1__.signum(bA) * (100.0 / viewingConditions.fl) * Math.pow(bCBase, 1.0 / 0.42);
    const rF = rC / viewingConditions.rgbD[0];
    const gF = gC / viewingConditions.rgbD[1];
    const bF = bC / viewingConditions.rgbD[2];
    const x = 1.86206786 * rF - 1.01125463 * gF + 0.14918677 * bF;
    const y = 0.38752654 * rF + 0.62144744 * gF - 0.00897398 * bF;
    const z = -0.01584150 * rF - 0.03412294 * gF + 1.04996444 * bF;
    return [x, y, z];
  }

}

/***/ },

/***/ "2bcd13326fc9"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Hct: () => (/* binding */ Hct)
/* harmony export */ });
/* harmony import */ var _utils_color_utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("5dc6cf71e7e6");
/* harmony import */ var _cam16_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("b2aa8c3d1576");
/* harmony import */ var _hct_solver_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("a9fe13ff5b88");
/* harmony import */ var _viewing_conditions_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("8440f1651740");
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * A color system built using CAM16 hue and chroma, and L* from
 * L*a*b*.
 *
 * Using L* creates a link between the color system, contrast, and thus
 * accessibility. Contrast ratio depends on relative luminance, or Y in the XYZ
 * color space. L*, or perceptual luminance can be calculated from Y.
 *
 * Unlike Y, L* is linear to human perception, allowing trivial creation of
 * accurate color tones.
 *
 * Unlike contrast ratio, measuring contrast in L* is linear, and simple to
 * calculate. A difference of 40 in HCT tone guarantees a contrast ratio >= 3.0,
 * and a difference of 50 guarantees a contrast ratio >= 4.5.
 */




/**
 * HCT, hue, chroma, and tone. A color system that provides a perceptually
 * accurate color measurement system that can also accurately render what colors
 * will appear as in different lighting environments.
 */

class Hct {
  static from(hue, chroma, tone) {
    return new Hct(_hct_solver_js__WEBPACK_IMPORTED_MODULE_2__.HctSolver.solveToInt(hue, chroma, tone));
  }
  /**
   * @param argb ARGB representation of a color.
   * @return HCT representation of a color in default viewing conditions
   */


  static fromInt(argb) {
    return new Hct(argb);
  }

  toInt() {
    return this.argb;
  }
  /**
   * A number, in degrees, representing ex. red, orange, yellow, etc.
   * Ranges from 0 <= hue < 360.
   */


  get hue() {
    return this.internalHue;
  }
  /**
   * @param newHue 0 <= newHue < 360; invalid values are corrected.
   * Chroma may decrease because chroma has a different maximum for any given
   * hue and tone.
   */


  set hue(newHue) {
    this.setInternalState(_hct_solver_js__WEBPACK_IMPORTED_MODULE_2__.HctSolver.solveToInt(newHue, this.internalChroma, this.internalTone));
  }

  get chroma() {
    return this.internalChroma;
  }
  /**
   * @param newChroma 0 <= newChroma < ?
   * Chroma may decrease because chroma has a different maximum for any given
   * hue and tone.
   */


  set chroma(newChroma) {
    this.setInternalState(_hct_solver_js__WEBPACK_IMPORTED_MODULE_2__.HctSolver.solveToInt(this.internalHue, newChroma, this.internalTone));
  }
  /** Lightness. Ranges from 0 to 100. */


  get tone() {
    return this.internalTone;
  }
  /**
   * @param newTone 0 <= newTone <= 100; invalid valids are corrected.
   * Chroma may decrease because chroma has a different maximum for any given
   * hue and tone.
   */


  set tone(newTone) {
    this.setInternalState(_hct_solver_js__WEBPACK_IMPORTED_MODULE_2__.HctSolver.solveToInt(this.internalHue, this.internalChroma, newTone));
  }
  /** Sets a property of the Hct object. */


  setValue(propertyName, value) {
    this[propertyName] = value;
  }

  toString() {
    return `HCT(${this.hue.toFixed(0)}, ${this.chroma.toFixed(0)}, ${this.tone.toFixed(0)})`;
  }

  static isBlue(hue) {
    return hue >= 250 && hue < 270;
  }

  static isYellow(hue) {
    return hue >= 105 && hue < 125;
  }

  static isCyan(hue) {
    return hue >= 170 && hue < 207;
  }

  constructor(argb) {
    this.argb = argb;
    const cam = _cam16_js__WEBPACK_IMPORTED_MODULE_1__.Cam16.fromInt(argb);
    this.internalHue = cam.hue;
    this.internalChroma = cam.chroma;
    this.internalTone = _utils_color_utils_js__WEBPACK_IMPORTED_MODULE_0__.lstarFromArgb(argb);
    this.argb = argb;
  }

  setInternalState(argb) {
    const cam = _cam16_js__WEBPACK_IMPORTED_MODULE_1__.Cam16.fromInt(argb);
    this.internalHue = cam.hue;
    this.internalChroma = cam.chroma;
    this.internalTone = _utils_color_utils_js__WEBPACK_IMPORTED_MODULE_0__.lstarFromArgb(argb);
    this.argb = argb;
  }
  /**
   * Translates a color into different [ViewingConditions].
   *
   * Colors change appearance. They look different with lights on versus off,
   * the same color, as in hex code, on white looks different when on black.
   * This is called color relativity, most famously explicated by Josef Albers
   * in Interaction of Color.
   *
   * In color science, color appearance models can account for this and
   * calculate the appearance of a color in different settings. HCT is based on
   * CAM16, a color appearance model, and uses it to make these calculations.
   *
   * See [ViewingConditions.make] for parameters affecting color appearance.
   */


  inViewingConditions(vc) {
    // 1. Use CAM16 to find XYZ coordinates of color in specified VC.
    const cam = _cam16_js__WEBPACK_IMPORTED_MODULE_1__.Cam16.fromInt(this.toInt());
    const viewedInVc = cam.xyzInViewingConditions(vc); // 2. Create CAM16 of those XYZ coordinates in default VC.

    const recastInVc = _cam16_js__WEBPACK_IMPORTED_MODULE_1__.Cam16.fromXyzInViewingConditions(viewedInVc[0], viewedInVc[1], viewedInVc[2], _viewing_conditions_js__WEBPACK_IMPORTED_MODULE_3__.ViewingConditions.make()); // 3. Create HCT from:
    // - CAM16 using default VC with XYZ coordinates in specified VC.
    // - L* converted from Y in XYZ coordinates in specified VC.

    const recastHct = Hct.from(recastInVc.hue, recastInVc.chroma, _utils_color_utils_js__WEBPACK_IMPORTED_MODULE_0__.lstarFromY(viewedInVc[1]));
    return recastHct;
  }

}

/***/ },

/***/ "a9fe13ff5b88"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HctSolver: () => (/* binding */ HctSolver)
/* harmony export */ });
/* harmony import */ var _utils_color_utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("5dc6cf71e7e6");
/* harmony import */ var _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("df26304b2f0d");
/* harmony import */ var _cam16_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("b2aa8c3d1576");
/* harmony import */ var _viewing_conditions_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("8440f1651740");
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// This file is automatically generated. Do not modify it.



 // material_color_utilities is designed to have a consistent API across
// platforms and modular components that can be moved around easily. Using a
// class as a namespace facilitates this.
//
// tslint:disable:class-as-namespace

/**
 * A class that solves the HCT equation.
 */

class HctSolver {
  /**
   * Sanitizes a small enough angle in radians.
   *
   * @param angle An angle in radians; must not deviate too much
   * from 0.
   * @return A coterminal angle between 0 and 2pi.
   */
  static sanitizeRadians(angle) {
    return (angle + Math.PI * 8) % (Math.PI * 2);
  }
  /**
   * Delinearizes an RGB component, returning a floating-point
   * number.
   *
   * @param rgbComponent 0.0 <= rgb_component <= 100.0, represents
   * linear R/G/B channel
   * @return 0.0 <= output <= 255.0, color channel converted to
   * regular RGB space
   */


  static trueDelinearized(rgbComponent) {
    const normalized = rgbComponent / 100.0;
    let delinearized = 0.0;

    if (normalized <= 0.0031308) {
      delinearized = normalized * 12.92;
    } else {
      delinearized = 1.055 * Math.pow(normalized, 1.0 / 2.4) - 0.055;
    }

    return delinearized * 255.0;
  }

  static chromaticAdaptation(component) {
    const af = Math.pow(Math.abs(component), 0.42);
    return _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_1__.signum(component) * 400.0 * af / (af + 27.13);
  }
  /**
   * Returns the hue of a linear RGB color in CAM16.
   *
   * @param linrgb The linear RGB coordinates of a color.
   * @return The hue of the color in CAM16, in radians.
   */


  static hueOf(linrgb) {
    const scaledDiscount = _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_1__.matrixMultiply(linrgb, HctSolver.SCALED_DISCOUNT_FROM_LINRGB);
    const rA = HctSolver.chromaticAdaptation(scaledDiscount[0]);
    const gA = HctSolver.chromaticAdaptation(scaledDiscount[1]);
    const bA = HctSolver.chromaticAdaptation(scaledDiscount[2]); // redness-greenness

    const a = (11.0 * rA + -12.0 * gA + bA) / 11.0; // yellowness-blueness

    const b = (rA + gA - 2.0 * bA) / 9.0;
    return Math.atan2(b, a);
  }

  static areInCyclicOrder(a, b, c) {
    const deltaAB = HctSolver.sanitizeRadians(b - a);
    const deltaAC = HctSolver.sanitizeRadians(c - a);
    return deltaAB < deltaAC;
  }
  /**
   * Solves the lerp equation.
   *
   * @param source The starting number.
   * @param mid The number in the middle.
   * @param target The ending number.
   * @return A number t such that lerp(source, target, t) = mid.
   */


  static intercept(source, mid, target) {
    return (mid - source) / (target - source);
  }

  static lerpPoint(source, t, target) {
    return [source[0] + (target[0] - source[0]) * t, source[1] + (target[1] - source[1]) * t, source[2] + (target[2] - source[2]) * t];
  }
  /**
   * Intersects a segment with a plane.
   *
   * @param source The coordinates of point A.
   * @param coordinate The R-, G-, or B-coordinate of the plane.
   * @param target The coordinates of point B.
   * @param axis The axis the plane is perpendicular with. (0: R, 1:
   * G, 2: B)
   * @return The intersection point of the segment AB with the plane
   * R=coordinate, G=coordinate, or B=coordinate
   */


  static setCoordinate(source, coordinate, target, axis) {
    const t = HctSolver.intercept(source[axis], coordinate, target[axis]);
    return HctSolver.lerpPoint(source, t, target);
  }

  static isBounded(x) {
    return 0.0 <= x && x <= 100.0;
  }
  /**
   * Returns the nth possible vertex of the polygonal intersection.
   *
   * @param y The Y value of the plane.
   * @param n The zero-based index of the point. 0 <= n <= 11.
   * @return The nth possible vertex of the polygonal intersection
   * of the y plane and the RGB cube, in linear RGB coordinates, if
   * it exists. If this possible vertex lies outside of the cube,
   * [-1.0, -1.0, -1.0] is returned.
   */


  static nthVertex(y, n) {
    const kR = HctSolver.Y_FROM_LINRGB[0];
    const kG = HctSolver.Y_FROM_LINRGB[1];
    const kB = HctSolver.Y_FROM_LINRGB[2];
    const coordA = n % 4 <= 1 ? 0.0 : 100.0;
    const coordB = n % 2 === 0 ? 0.0 : 100.0;

    if (n < 4) {
      const g = coordA;
      const b = coordB;
      const r = (y - g * kG - b * kB) / kR;

      if (HctSolver.isBounded(r)) {
        return [r, g, b];
      } else {
        return [-1.0, -1.0, -1.0];
      }
    } else if (n < 8) {
      const b = coordA;
      const r = coordB;
      const g = (y - r * kR - b * kB) / kG;

      if (HctSolver.isBounded(g)) {
        return [r, g, b];
      } else {
        return [-1.0, -1.0, -1.0];
      }
    } else {
      const r = coordA;
      const g = coordB;
      const b = (y - r * kR - g * kG) / kB;

      if (HctSolver.isBounded(b)) {
        return [r, g, b];
      } else {
        return [-1.0, -1.0, -1.0];
      }
    }
  }
  /**
   * Finds the segment containing the desired color.
   *
   * @param y The Y value of the color.
   * @param targetHue The hue of the color.
   * @return A list of two sets of linear RGB coordinates, each
   * corresponding to an endpoint of the segment containing the
   * desired color.
   */


  static bisectToSegment(y, targetHue) {
    let left = [-1.0, -1.0, -1.0];
    let right = left;
    let leftHue = 0.0;
    let rightHue = 0.0;
    let initialized = false;
    let uncut = true;

    for (let n = 0; n < 12; n++) {
      const mid = HctSolver.nthVertex(y, n);

      if (mid[0] < 0) {
        continue;
      }

      const midHue = HctSolver.hueOf(mid);

      if (!initialized) {
        left = mid;
        right = mid;
        leftHue = midHue;
        rightHue = midHue;
        initialized = true;
        continue;
      }

      if (uncut || HctSolver.areInCyclicOrder(leftHue, midHue, rightHue)) {
        uncut = false;

        if (HctSolver.areInCyclicOrder(leftHue, targetHue, midHue)) {
          right = mid;
          rightHue = midHue;
        } else {
          left = mid;
          leftHue = midHue;
        }
      }
    }

    return [left, right];
  }

  static midpoint(a, b) {
    return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];
  }

  static criticalPlaneBelow(x) {
    return Math.floor(x - 0.5);
  }

  static criticalPlaneAbove(x) {
    return Math.ceil(x - 0.5);
  }
  /**
   * Finds a color with the given Y and hue on the boundary of the
   * cube.
   *
   * @param y The Y value of the color.
   * @param targetHue The hue of the color.
   * @return The desired color, in linear RGB coordinates.
   */


  static bisectToLimit(y, targetHue) {
    const segment = HctSolver.bisectToSegment(y, targetHue);
    let left = segment[0];
    let leftHue = HctSolver.hueOf(left);
    let right = segment[1];

    for (let axis = 0; axis < 3; axis++) {
      if (left[axis] !== right[axis]) {
        let lPlane = -1;
        let rPlane = 255;

        if (left[axis] < right[axis]) {
          lPlane = HctSolver.criticalPlaneBelow(HctSolver.trueDelinearized(left[axis]));
          rPlane = HctSolver.criticalPlaneAbove(HctSolver.trueDelinearized(right[axis]));
        } else {
          lPlane = HctSolver.criticalPlaneAbove(HctSolver.trueDelinearized(left[axis]));
          rPlane = HctSolver.criticalPlaneBelow(HctSolver.trueDelinearized(right[axis]));
        }

        for (let i = 0; i < 8; i++) {
          if (Math.abs(rPlane - lPlane) <= 1) {
            break;
          } else {
            const mPlane = Math.floor((lPlane + rPlane) / 2.0);
            const midPlaneCoordinate = HctSolver.CRITICAL_PLANES[mPlane];
            const mid = HctSolver.setCoordinate(left, midPlaneCoordinate, right, axis);
            const midHue = HctSolver.hueOf(mid);

            if (HctSolver.areInCyclicOrder(leftHue, targetHue, midHue)) {
              right = mid;
              rPlane = mPlane;
            } else {
              left = mid;
              leftHue = midHue;
              lPlane = mPlane;
            }
          }
        }
      }
    }

    return HctSolver.midpoint(left, right);
  }

  static inverseChromaticAdaptation(adapted) {
    const adaptedAbs = Math.abs(adapted);
    const base = Math.max(0, 27.13 * adaptedAbs / (400.0 - adaptedAbs));
    return _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_1__.signum(adapted) * Math.pow(base, 1.0 / 0.42);
  }
  /**
   * Finds a color with the given hue, chroma, and Y.
   *
   * @param hueRadians The desired hue in radians.
   * @param chroma The desired chroma.
   * @param y The desired Y.
   * @return The desired color as a hexadecimal integer, if found; 0
   * otherwise.
   */


  static findResultByJ(hueRadians, chroma, y) {
    // Initial estimate of j.
    let j = Math.sqrt(y) * 11.0; // ===========================================================
    // Operations inlined from Cam16 to avoid repeated calculation
    // ===========================================================

    const viewingConditions = _viewing_conditions_js__WEBPACK_IMPORTED_MODULE_3__.ViewingConditions.DEFAULT;
    const tInnerCoeff = 1 / Math.pow(1.64 - Math.pow(0.29, viewingConditions.n), 0.73);
    const eHue = 0.25 * (Math.cos(hueRadians + 2.0) + 3.8);
    const p1 = eHue * (50000.0 / 13.0) * viewingConditions.nc * viewingConditions.ncb;
    const hSin = Math.sin(hueRadians);
    const hCos = Math.cos(hueRadians);

    for (let iterationRound = 0; iterationRound < 5; iterationRound++) {
      // ===========================================================
      // Operations inlined from Cam16 to avoid repeated calculation
      // ===========================================================
      const jNormalized = j / 100.0;
      const alpha = chroma === 0.0 || j === 0.0 ? 0.0 : chroma / Math.sqrt(jNormalized);
      const t = Math.pow(alpha * tInnerCoeff, 1.0 / 0.9);
      const ac = viewingConditions.aw * Math.pow(jNormalized, 1.0 / viewingConditions.c / viewingConditions.z);
      const p2 = ac / viewingConditions.nbb;
      const gamma = 23.0 * (p2 + 0.305) * t / (23.0 * p1 + 11 * t * hCos + 108.0 * t * hSin);
      const a = gamma * hCos;
      const b = gamma * hSin;
      const rA = (460.0 * p2 + 451.0 * a + 288.0 * b) / 1403.0;
      const gA = (460.0 * p2 - 891.0 * a - 261.0 * b) / 1403.0;
      const bA = (460.0 * p2 - 220.0 * a - 6300.0 * b) / 1403.0;
      const rCScaled = HctSolver.inverseChromaticAdaptation(rA);
      const gCScaled = HctSolver.inverseChromaticAdaptation(gA);
      const bCScaled = HctSolver.inverseChromaticAdaptation(bA);
      const linrgb = _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_1__.matrixMultiply([rCScaled, gCScaled, bCScaled], HctSolver.LINRGB_FROM_SCALED_DISCOUNT); // ===========================================================
      // Operations inlined from Cam16 to avoid repeated calculation
      // ===========================================================

      if (linrgb[0] < 0 || linrgb[1] < 0 || linrgb[2] < 0) {
        return 0;
      }

      const kR = HctSolver.Y_FROM_LINRGB[0];
      const kG = HctSolver.Y_FROM_LINRGB[1];
      const kB = HctSolver.Y_FROM_LINRGB[2];
      const fnj = kR * linrgb[0] + kG * linrgb[1] + kB * linrgb[2];

      if (fnj <= 0) {
        return 0;
      }

      if (iterationRound === 4 || Math.abs(fnj - y) < 0.002) {
        if (linrgb[0] > 100.01 || linrgb[1] > 100.01 || linrgb[2] > 100.01) {
          return 0;
        }

        return _utils_color_utils_js__WEBPACK_IMPORTED_MODULE_0__.argbFromLinrgb(linrgb);
      } // Iterates with Newton method,
      // Using 2 * fn(j) / j as the approximation of fn'(j)


      j = j - (fnj - y) * j / (2 * fnj);
    }

    return 0;
  }
  /**
   * Finds an sRGB color with the given hue, chroma, and L*, if
   * possible.
   *
   * @param hueDegrees The desired hue, in degrees.
   * @param chroma The desired chroma.
   * @param lstar The desired L*.
   * @return A hexadecimal representing the sRGB color. The color
   * has sufficiently close hue, chroma, and L* to the desired
   * values, if possible; otherwise, the hue and L* will be
   * sufficiently close, and chroma will be maximized.
   */


  static solveToInt(hueDegrees, chroma, lstar) {
    if (chroma < 0.0001 || lstar < 0.0001 || lstar > 99.9999) {
      return _utils_color_utils_js__WEBPACK_IMPORTED_MODULE_0__.argbFromLstar(lstar);
    }

    hueDegrees = _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_1__.sanitizeDegreesDouble(hueDegrees);
    const hueRadians = hueDegrees / 180 * Math.PI;
    const y = _utils_color_utils_js__WEBPACK_IMPORTED_MODULE_0__.yFromLstar(lstar);
    const exactAnswer = HctSolver.findResultByJ(hueRadians, chroma, y);

    if (exactAnswer !== 0) {
      return exactAnswer;
    }

    const linrgb = HctSolver.bisectToLimit(y, hueRadians);
    return _utils_color_utils_js__WEBPACK_IMPORTED_MODULE_0__.argbFromLinrgb(linrgb);
  }
  /**
   * Finds an sRGB color with the given hue, chroma, and L*, if
   * possible.
   *
   * @param hueDegrees The desired hue, in degrees.
   * @param chroma The desired chroma.
   * @param lstar The desired L*.
   * @return An CAM16 object representing the sRGB color. The color
   * has sufficiently close hue, chroma, and L* to the desired
   * values, if possible; otherwise, the hue and L* will be
   * sufficiently close, and chroma will be maximized.
   */


  static solveToCam(hueDegrees, chroma, lstar) {
    return _cam16_js__WEBPACK_IMPORTED_MODULE_2__.Cam16.fromInt(HctSolver.solveToInt(hueDegrees, chroma, lstar));
  }

}
HctSolver.SCALED_DISCOUNT_FROM_LINRGB = [[0.001200833568784504, 0.002389694492170889, 0.0002795742885861124], [0.0005891086651375999, 0.0029785502573438758, 0.0003270666104008398], [0.00010146692491640572, 0.0005364214359186694, 0.0032979401770712076]];
HctSolver.LINRGB_FROM_SCALED_DISCOUNT = [[1373.2198709594231, -1100.4251190754821, -7.278681089101213], [-271.815969077903, 559.6580465940733, -32.46047482791194], [1.9622899599665666, -57.173814538844006, 308.7233197812385]];
HctSolver.Y_FROM_LINRGB = [0.2126, 0.7152, 0.0722];
HctSolver.CRITICAL_PLANES = [0.015176349177441876, 0.045529047532325624, 0.07588174588720938, 0.10623444424209313, 0.13658714259697685, 0.16693984095186062, 0.19729253930674434, 0.2276452376616281, 0.2579979360165119, 0.28835063437139563, 0.3188300904430532, 0.350925934958123, 0.3848314933096426, 0.42057480301049466, 0.458183274052838, 0.4976837250274023, 0.5391024159806381, 0.5824650784040898, 0.6277969426914107, 0.6751227633498623, 0.7244668422128921, 0.775853049866786, 0.829304845476233, 0.8848452951698498, 0.942497089126609, 1.0022825574869039, 1.0642236851973577, 1.1283421258858297, 1.1946592148522128, 1.2631959812511864, 1.3339731595349034, 1.407011200216447, 1.4823302800086415, 1.5599503113873272, 1.6398909516233677, 1.7221716113234105, 1.8068114625156377, 1.8938294463134073, 1.9832442801866852, 2.075074464868551, 2.1693382909216234, 2.2660538449872063, 2.36523901573795, 2.4669114995532007, 2.5710888059345764, 2.6777882626779785, 2.7870270208169257, 2.898822059350997, 3.0131901897720907, 3.1301480604002863, 3.2497121605402226, 3.3718988244681087, 3.4967242352587946, 3.624204428461639, 3.754355295633311, 3.887192587735158, 4.022731918402185, 4.160988767090289, 4.301978482107941, 4.445716283538092, 4.592217266055746, 4.741496401646282, 4.893568542229298, 5.048448422192488, 5.20615066083972, 5.3666897647573375, 5.5300801301023865, 5.696336044816294, 5.865471690767354, 6.037501145825082, 6.212438385869475, 6.390297286737924, 6.571091626112461, 6.7548350853498045, 6.941541251256611, 7.131223617812143, 7.323895587840543, 7.5195704746346665, 7.7182615035334345, 7.919981813454504, 8.124744458384042, 8.332562408825165, 8.543448553206703, 8.757415699253682, 8.974476575321063, 9.194643831691977, 9.417930041841839, 9.644347703669503, 9.873909240696694, 10.106627003236781, 10.342513269534024, 10.58158024687427, 10.8238400726681, 11.069304815507364, 11.317986476196008, 11.569896988756009, 11.825048221409341, 12.083451977536606, 12.345119996613247, 12.610063955123938, 12.878295467455942, 13.149826086772048, 13.42466730586372, 13.702830557985108, 13.984327217668513, 14.269168601521828, 14.55736596900856, 14.848930523210871, 15.143873411576273, 15.44220572664832, 15.743938506781891, 16.04908273684337, 16.35764934889634, 16.66964922287304, 16.985093187232053, 17.30399201960269, 17.62635644741625, 17.95219714852476, 18.281524751807332, 18.614349837764564, 18.95068293910138, 19.290534541298456, 19.633915083172692, 19.98083495742689, 20.331304511189067, 20.685334046541502, 21.042933821039977, 21.404114048223256, 21.76888489811322, 22.137256497705877, 22.50923893145328, 22.884842241736916, 23.264076429332462, 23.6469514538663, 24.033477234264016, 24.42366364919083, 24.817520537484558, 25.21505769858089, 25.61628489293138, 26.021211842414342, 26.429848230738664, 26.842203703840827, 27.258287870275353, 27.678110301598522, 28.10168053274597, 28.529008062403893, 28.96010235337422, 29.39497283293396, 29.83362889318845, 30.276079891419332, 30.722335150426627, 31.172403958865512, 31.62629557157785, 32.08401920991837, 32.54558406207592, 33.010999283389665, 33.4802739966603, 33.953417292456834, 34.430438229418264, 34.911345834551085, 35.39614910352207, 35.88485700094671, 36.37747846067349, 36.87402238606382, 37.37449765026789, 37.87891309649659, 38.38727753828926, 38.89959975977785, 39.41588851594697, 39.93615253289054, 40.460400508064545, 40.98864111053629, 41.520882981230194, 42.05713473317016, 42.597404951718396, 43.141702194811224, 43.6900349931913, 44.24241185063697, 44.798841244188324, 45.35933162437017, 45.92389141541209, 46.49252901546552, 47.065252796817916, 47.64207110610409, 48.22299226451468, 48.808024568002054, 49.3971762874833, 49.9904556690408, 50.587870934119984, 51.189430279724725, 51.79514187861014, 52.40501387947288, 53.0190544071392, 53.637271562750364, 54.259673423945976, 54.88626804504493, 55.517063457223934, 56.15206766869424, 56.79128866487574, 57.43473440856916, 58.08241284012621, 58.734331877617365, 59.39049941699807, 60.05092333227251, 60.715611475655585, 61.38457167773311, 62.057811747619894, 62.7353394731159, 63.417162620860914, 64.10328893648692, 64.79372614476921, 65.48848194977529, 66.18756403501224, 66.89098006357258, 67.59873767827808, 68.31084450182222, 69.02730813691093, 69.74813616640164, 70.47333615344107, 71.20291564160104, 71.93688215501312, 72.67524319850172, 73.41800625771542, 74.16517879925733, 74.9167682708136, 75.67278210128072, 76.43322770089146, 77.1981124613393, 77.96744375590167, 78.74122893956174, 79.51947534912904, 80.30219030335869, 81.08938110306934, 81.88105503125999, 82.67721935322541, 83.4778813166706, 84.28304815182372, 85.09272707154808, 85.90692527145302, 86.72564993000343, 87.54890820862819, 88.3767072518277, 89.2090541872801, 90.04595612594655, 90.88742016217518, 91.73345337380438, 92.58406282226491, 93.43925555268066, 94.29903859396902, 95.16341895893969, 96.03240364439274, 96.9059996312159, 97.78421388448044, 98.6670533535366, 99.55452497210776];

/***/ },

/***/ "8440f1651740"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ViewingConditions: () => (/* binding */ ViewingConditions)
/* harmony export */ });
/* harmony import */ var _utils_color_utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("5dc6cf71e7e6");
/* harmony import */ var _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("df26304b2f0d");
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/**
 * In traditional color spaces, a color can be identified solely by the
 * observer's measurement of the color. Color appearance models such as CAM16
 * also use information about the environment where the color was
 * observed, known as the viewing conditions.
 *
 * For example, white under the traditional assumption of a midday sun white
 * point is accurately measured as a slightly chromatic blue by CAM16. (roughly,
 * hue 203, chroma 3, lightness 100)
 *
 * This class caches intermediate values of the CAM16 conversion process that
 * depend only on viewing conditions, enabling speed ups.
 */

class ViewingConditions {
  /**
   * Create ViewingConditions from a simple, physically relevant, set of
   * parameters.
   *
   * @param whitePoint White point, measured in the XYZ color space.
   *     default = D65, or sunny day afternoon
   * @param adaptingLuminance The luminance of the adapting field. Informally,
   *     how bright it is in the room where the color is viewed. Can be
   *     calculated from lux by multiplying lux by 0.0586. default = 11.72,
   *     or 200 lux.
   * @param backgroundLstar The lightness of the area surrounding the color.
   *     measured by L* in L*a*b*. default = 50.0
   * @param surround A general description of the lighting surrounding the
   *     color. 0 is pitch dark, like watching a movie in a theater. 1.0 is a
   *     dimly light room, like watching TV at home at night. 2.0 means there
   *     is no difference between the lighting on the color and around it.
   *     default = 2.0
   * @param discountingIlluminant Whether the eye accounts for the tint of the
   *     ambient lighting, such as knowing an apple is still red in green light.
   *     default = false, the eye does not perform this process on
   *       self-luminous objects like displays.
   */
  static make(whitePoint = _utils_color_utils_js__WEBPACK_IMPORTED_MODULE_0__.whitePointD65(), adaptingLuminance = 200.0 / Math.PI * _utils_color_utils_js__WEBPACK_IMPORTED_MODULE_0__.yFromLstar(50.0) / 100.0, backgroundLstar = 50.0, surround = 2.0, discountingIlluminant = false) {
    const xyz = whitePoint;
    const rW = xyz[0] * 0.401288 + xyz[1] * 0.650173 + xyz[2] * -0.051461;
    const gW = xyz[0] * -0.250268 + xyz[1] * 1.204414 + xyz[2] * 0.045854;
    const bW = xyz[0] * -0.002079 + xyz[1] * 0.048952 + xyz[2] * 0.953127;
    const f = 0.8 + surround / 10.0;
    const c = f >= 0.9 ? _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_1__.lerp(0.59, 0.69, (f - 0.9) * 10.0) : _utils_math_utils_js__WEBPACK_IMPORTED_MODULE_1__.lerp(0.525, 0.59, (f - 0.8) * 10.0);
    let d = discountingIlluminant ? 1.0 : f * (1.0 - 1.0 / 3.6 * Math.exp((-adaptingLuminance - 42.0) / 92.0));
    d = d > 1.0 ? 1.0 : d < 0.0 ? 0.0 : d;
    const nc = f;
    const rgbD = [d * (100.0 / rW) + 1.0 - d, d * (100.0 / gW) + 1.0 - d, d * (100.0 / bW) + 1.0 - d];
    const k = 1.0 / (5.0 * adaptingLuminance + 1.0);
    const k4 = k * k * k * k;
    const k4F = 1.0 - k4;
    const fl = k4 * adaptingLuminance + 0.1 * k4F * k4F * Math.cbrt(5.0 * adaptingLuminance);
    const n = _utils_color_utils_js__WEBPACK_IMPORTED_MODULE_0__.yFromLstar(backgroundLstar) / whitePoint[1];
    const z = 1.48 + Math.sqrt(n);
    const nbb = 0.725 / Math.pow(n, 0.2);
    const ncb = nbb;
    const rgbAFactors = [Math.pow(fl * rgbD[0] * rW / 100.0, 0.42), Math.pow(fl * rgbD[1] * gW / 100.0, 0.42), Math.pow(fl * rgbD[2] * bW / 100.0, 0.42)];
    const rgbA = [400.0 * rgbAFactors[0] / (rgbAFactors[0] + 27.13), 400.0 * rgbAFactors[1] / (rgbAFactors[1] + 27.13), 400.0 * rgbAFactors[2] / (rgbAFactors[2] + 27.13)];
    const aw = (2.0 * rgbA[0] + rgbA[1] + 0.05 * rgbA[2]) * nbb;
    return new ViewingConditions(n, aw, nbb, ncb, c, nc, rgbD, fl, Math.pow(fl, 0.25), z);
  }
  /**
   * Parameters are intermediate values of the CAM16 conversion process. Their
   * names are shorthand for technical color science terminology, this class
   * would not benefit from documenting them individually. A brief overview
   * is available in the CAM16 specification, and a complete overview requires
   * a color science textbook, such as Fairchild's Color Appearance Models.
   */


  constructor(n, aw, nbb, ncb, c, nc, rgbD, fl, fLRoot, z) {
    this.n = n;
    this.aw = aw;
    this.nbb = nbb;
    this.ncb = ncb;
    this.c = c;
    this.nc = nc;
    this.rgbD = rgbD;
    this.fl = fl;
    this.fLRoot = fLRoot;
    this.z = z;
  }

}
/** sRGB-like viewing conditions.  */

ViewingConditions.DEFAULT = ViewingConditions.make();

/***/ },

/***/ "165b8320fb88"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TonalPalette: () => (/* binding */ TonalPalette)
/* harmony export */ });
/* harmony import */ var _hct_hct_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2bcd13326fc9");
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 *  A convenience class for retrieving colors that are constant in hue and
 *  chroma, but vary in tone.
 */

class TonalPalette {
  /**
   * @param argb ARGB representation of a color
   * @return Tones matching that color's hue and chroma.
   */
  static fromInt(argb) {
    const hct = _hct_hct_js__WEBPACK_IMPORTED_MODULE_0__.Hct.fromInt(argb);
    return TonalPalette.fromHct(hct);
  }
  /**
   * @param hct Hct
   * @return Tones matching that color's hue and chroma.
   */


  static fromHct(hct) {
    return new TonalPalette(hct.hue, hct.chroma, hct);
  }
  /**
   * @param hue HCT hue
   * @param chroma HCT chroma
   * @return Tones matching hue and chroma.
   */


  static fromHueAndChroma(hue, chroma) {
    const keyColor = new KeyColor(hue, chroma).create();
    return new TonalPalette(hue, chroma, keyColor);
  }

  constructor(hue, chroma, keyColor) {
    this.hue = hue;
    this.chroma = chroma;
    this.keyColor = keyColor;
    this.cache = new Map();
  }
  /**
   * @param tone HCT tone, measured from 0 to 100.
   * @return ARGB representation of a color with that tone.
   */


  tone(tone) {
    let argb = this.cache.get(tone);

    if (argb === undefined) {
      if (tone == 99 && _hct_hct_js__WEBPACK_IMPORTED_MODULE_0__.Hct.isYellow(this.hue)) {
        argb = this.averageArgb(this.tone(98), this.tone(100));
      } else {
        argb = _hct_hct_js__WEBPACK_IMPORTED_MODULE_0__.Hct.from(this.hue, this.chroma, tone).toInt();
      }

      this.cache.set(tone, argb);
    }

    return argb;
  }
  /**
   * @param tone HCT tone.
   * @return HCT representation of a color with that tone.
   */


  getHct(tone) {
    return _hct_hct_js__WEBPACK_IMPORTED_MODULE_0__.Hct.fromInt(this.tone(tone));
  }

  averageArgb(argb1, argb2) {
    const red1 = argb1 >>> 16 & 0xff;
    const green1 = argb1 >>> 8 & 0xff;
    const blue1 = argb1 & 0xff;
    const red2 = argb2 >>> 16 & 0xff;
    const green2 = argb2 >>> 8 & 0xff;
    const blue2 = argb2 & 0xff;
    const red = Math.round((red1 + red2) / 2);
    const green = Math.round((green1 + green2) / 2);
    const blue = Math.round((blue1 + blue2) / 2);
    return (255 << 24 | (red & 255) << 16 | (green & 255) << 8 | blue & 255) >>> 0;
  }

}
/**
 * Key color is a color that represents the hue and chroma of a tonal palette
 */

class KeyColor {
  constructor(hue, requestedChroma) {
    this.hue = hue;
    this.requestedChroma = requestedChroma; // Cache that maps tone to max chroma to avoid duplicated HCT calculation.

    this.chromaCache = new Map();
    this.maxChromaValue = 200.0;
  }
  /**
   * Creates a key color from a [hue] and a [chroma].
   * The key color is the first tone, starting from T50, matching the given hue
   * and chroma.
   *
   * @return Key color [Hct]
   */


  create() {
    // Pivot around T50 because T50 has the most chroma available, on
    // average. Thus it is most likely to have a direct answer.
    const pivotTone = 50;
    const toneStepSize = 1; // Epsilon to accept values slightly higher than the requested chroma.

    const epsilon = 0.01; // Binary search to find the tone that can provide a chroma that is closest
    // to the requested chroma.

    let lowerTone = 0;
    let upperTone = 100;

    while (lowerTone < upperTone) {
      const midTone = Math.floor((lowerTone + upperTone) / 2);
      const isAscending = this.maxChroma(midTone) < this.maxChroma(midTone + toneStepSize);
      const sufficientChroma = this.maxChroma(midTone) >= this.requestedChroma - epsilon;

      if (sufficientChroma) {
        // Either range [lowerTone, midTone] or [midTone, upperTone] has
        // the answer, so search in the range that is closer the pivot tone.
        if (Math.abs(lowerTone - pivotTone) < Math.abs(upperTone - pivotTone)) {
          upperTone = midTone;
        } else {
          if (lowerTone === midTone) {
            return _hct_hct_js__WEBPACK_IMPORTED_MODULE_0__.Hct.from(this.hue, this.requestedChroma, lowerTone);
          }

          lowerTone = midTone;
        }
      } else {
        // As there is no sufficient chroma in the midTone, follow the direction
        // to the chroma peak.
        if (isAscending) {
          lowerTone = midTone + toneStepSize;
        } else {
          // Keep midTone for potential chroma peak.
          upperTone = midTone;
        }
      }
    }

    return _hct_hct_js__WEBPACK_IMPORTED_MODULE_0__.Hct.from(this.hue, this.requestedChroma, lowerTone);
  } // Find the maximum chroma for a given tone


  maxChroma(tone) {
    if (this.chromaCache.has(tone)) {
      return this.chromaCache.get(tone);
    }

    const chroma = _hct_hct_js__WEBPACK_IMPORTED_MODULE_0__.Hct.from(this.hue, this.maxChromaValue, tone).chroma;
    this.chromaCache.set(tone, chroma);
    return chroma;
  }

}

/***/ },

/***/ "5dc6cf71e7e6"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   alphaFromArgb: () => (/* binding */ alphaFromArgb),
/* harmony export */   argbFromLab: () => (/* binding */ argbFromLab),
/* harmony export */   argbFromLinrgb: () => (/* binding */ argbFromLinrgb),
/* harmony export */   argbFromLstar: () => (/* binding */ argbFromLstar),
/* harmony export */   argbFromRgb: () => (/* binding */ argbFromRgb),
/* harmony export */   argbFromXyz: () => (/* binding */ argbFromXyz),
/* harmony export */   blueFromArgb: () => (/* binding */ blueFromArgb),
/* harmony export */   delinearized: () => (/* binding */ delinearized),
/* harmony export */   greenFromArgb: () => (/* binding */ greenFromArgb),
/* harmony export */   isOpaque: () => (/* binding */ isOpaque),
/* harmony export */   labFromArgb: () => (/* binding */ labFromArgb),
/* harmony export */   linearized: () => (/* binding */ linearized),
/* harmony export */   lstarFromArgb: () => (/* binding */ lstarFromArgb),
/* harmony export */   lstarFromY: () => (/* binding */ lstarFromY),
/* harmony export */   redFromArgb: () => (/* binding */ redFromArgb),
/* harmony export */   whitePointD65: () => (/* binding */ whitePointD65),
/* harmony export */   xyzFromArgb: () => (/* binding */ xyzFromArgb),
/* harmony export */   yFromLstar: () => (/* binding */ yFromLstar)
/* harmony export */ });
/* harmony import */ var _math_utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("df26304b2f0d");
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// This file is automatically generated. Do not modify it.

/**
 * Color science utilities.
 *
 * Utility methods for color science constants and color space
 * conversions that aren't HCT or CAM16.
 */

const SRGB_TO_XYZ = [[0.41233895, 0.35762064, 0.18051042], [0.2126, 0.7152, 0.0722], [0.01932141, 0.11916382, 0.95034478]];
const XYZ_TO_SRGB = [[3.2413774792388685, -1.5376652402851851, -0.49885366846268053], [-0.9691452513005321, 1.8758853451067872, 0.04156585616912061], [0.05562093689691305, -0.20395524564742123, 1.0571799111220335]];
const WHITE_POINT_D65 = [95.047, 100.0, 108.883];
/**
 * Converts a color from RGB components to ARGB format.
 */

function argbFromRgb(red, green, blue) {
  return (255 << 24 | (red & 255) << 16 | (green & 255) << 8 | blue & 255) >>> 0;
}
/**
 * Converts a color from linear RGB components to ARGB format.
 */

function argbFromLinrgb(linrgb) {
  const r = delinearized(linrgb[0]);
  const g = delinearized(linrgb[1]);
  const b = delinearized(linrgb[2]);
  return argbFromRgb(r, g, b);
}
/**
 * Returns the alpha component of a color in ARGB format.
 */

function alphaFromArgb(argb) {
  return argb >> 24 & 255;
}
/**
 * Returns the red component of a color in ARGB format.
 */

function redFromArgb(argb) {
  return argb >> 16 & 255;
}
/**
 * Returns the green component of a color in ARGB format.
 */

function greenFromArgb(argb) {
  return argb >> 8 & 255;
}
/**
 * Returns the blue component of a color in ARGB format.
 */

function blueFromArgb(argb) {
  return argb & 255;
}
/**
 * Returns whether a color in ARGB format is opaque.
 */

function isOpaque(argb) {
  return alphaFromArgb(argb) >= 255;
}
/**
 * Converts a color from ARGB to XYZ.
 */

function argbFromXyz(x, y, z) {
  const matrix = XYZ_TO_SRGB;
  const linearR = matrix[0][0] * x + matrix[0][1] * y + matrix[0][2] * z;
  const linearG = matrix[1][0] * x + matrix[1][1] * y + matrix[1][2] * z;
  const linearB = matrix[2][0] * x + matrix[2][1] * y + matrix[2][2] * z;
  const r = delinearized(linearR);
  const g = delinearized(linearG);
  const b = delinearized(linearB);
  return argbFromRgb(r, g, b);
}
/**
 * Converts a color from XYZ to ARGB.
 */

function xyzFromArgb(argb) {
  const r = linearized(redFromArgb(argb));
  const g = linearized(greenFromArgb(argb));
  const b = linearized(blueFromArgb(argb));
  return _math_utils_js__WEBPACK_IMPORTED_MODULE_0__.matrixMultiply([r, g, b], SRGB_TO_XYZ);
}
/**
 * Converts a color represented in Lab color space into an ARGB
 * integer.
 */

function argbFromLab(l, a, b) {
  const whitePoint = WHITE_POINT_D65;
  const fy = (l + 16.0) / 116.0;
  const fx = a / 500.0 + fy;
  const fz = fy - b / 200.0;
  const xNormalized = labInvf(fx);
  const yNormalized = labInvf(fy);
  const zNormalized = labInvf(fz);
  const x = xNormalized * whitePoint[0];
  const y = yNormalized * whitePoint[1];
  const z = zNormalized * whitePoint[2];
  return argbFromXyz(x, y, z);
}
/**
 * Converts a color from ARGB representation to L*a*b*
 * representation.
 *
 * @param argb the ARGB representation of a color
 * @return a Lab object representing the color
 */

function labFromArgb(argb) {
  const linearR = linearized(redFromArgb(argb));
  const linearG = linearized(greenFromArgb(argb));
  const linearB = linearized(blueFromArgb(argb));
  const matrix = SRGB_TO_XYZ;
  const x = matrix[0][0] * linearR + matrix[0][1] * linearG + matrix[0][2] * linearB;
  const y = matrix[1][0] * linearR + matrix[1][1] * linearG + matrix[1][2] * linearB;
  const z = matrix[2][0] * linearR + matrix[2][1] * linearG + matrix[2][2] * linearB;
  const whitePoint = WHITE_POINT_D65;
  const xNormalized = x / whitePoint[0];
  const yNormalized = y / whitePoint[1];
  const zNormalized = z / whitePoint[2];
  const fx = labF(xNormalized);
  const fy = labF(yNormalized);
  const fz = labF(zNormalized);
  const l = 116.0 * fy - 16;
  const a = 500.0 * (fx - fy);
  const b = 200.0 * (fy - fz);
  return [l, a, b];
}
/**
 * Converts an L* value to an ARGB representation.
 *
 * @param lstar L* in L*a*b*
 * @return ARGB representation of grayscale color with lightness
 * matching L*
 */

function argbFromLstar(lstar) {
  const y = yFromLstar(lstar);
  const component = delinearized(y);
  return argbFromRgb(component, component, component);
}
/**
 * Computes the L* value of a color in ARGB representation.
 *
 * @param argb ARGB representation of a color
 * @return L*, from L*a*b*, coordinate of the color
 */

function lstarFromArgb(argb) {
  const y = xyzFromArgb(argb)[1];
  return 116.0 * labF(y / 100.0) - 16.0;
}
/**
 * Converts an L* value to a Y value.
 *
 * L* in L*a*b* and Y in XYZ measure the same quantity, luminance.
 *
 * L* measures perceptual luminance, a linear scale. Y in XYZ
 * measures relative luminance, a logarithmic scale.
 *
 * @param lstar L* in L*a*b*
 * @return Y in XYZ
 */

function yFromLstar(lstar) {
  return 100.0 * labInvf((lstar + 16.0) / 116.0);
}
/**
 * Converts a Y value to an L* value.
 *
 * L* in L*a*b* and Y in XYZ measure the same quantity, luminance.
 *
 * L* measures perceptual luminance, a linear scale. Y in XYZ
 * measures relative luminance, a logarithmic scale.
 *
 * @param y Y in XYZ
 * @return L* in L*a*b*
 */

function lstarFromY(y) {
  return labF(y / 100.0) * 116.0 - 16.0;
}
/**
 * Linearizes an RGB component.
 *
 * @param rgbComponent 0 <= rgb_component <= 255, represents R/G/B
 * channel
 * @return 0.0 <= output <= 100.0, color channel converted to
 * linear RGB space
 */

function linearized(rgbComponent) {
  const normalized = rgbComponent / 255.0;

  if (normalized <= 0.040449936) {
    return normalized / 12.92 * 100.0;
  } else {
    return Math.pow((normalized + 0.055) / 1.055, 2.4) * 100.0;
  }
}
/**
 * Delinearizes an RGB component.
 *
 * @param rgbComponent 0.0 <= rgb_component <= 100.0, represents
 * linear R/G/B channel
 * @return 0 <= output <= 255, color channel converted to regular
 * RGB space
 */

function delinearized(rgbComponent) {
  const normalized = rgbComponent / 100.0;
  let delinearized = 0.0;

  if (normalized <= 0.0031308) {
    delinearized = normalized * 12.92;
  } else {
    delinearized = 1.055 * Math.pow(normalized, 1.0 / 2.4) - 0.055;
  }

  return _math_utils_js__WEBPACK_IMPORTED_MODULE_0__.clampInt(0, 255, Math.round(delinearized * 255.0));
}
/**
 * Returns the standard white point; white on a sunny day.
 *
 * @return The white point
 */

function whitePointD65() {
  return WHITE_POINT_D65;
}

function labF(t) {
  const e = 216.0 / 24389.0;
  const kappa = 24389.0 / 27.0;

  if (t > e) {
    return Math.pow(t, 1.0 / 3.0);
  } else {
    return (kappa * t + 16) / 116;
  }
}

function labInvf(ft) {
  const e = 216.0 / 24389.0;
  const kappa = 24389.0 / 27.0;
  const ft3 = ft * ft * ft;

  if (ft3 > e) {
    return ft3;
  } else {
    return (116 * ft - 16) / kappa;
  }
}

/***/ },

/***/ "df26304b2f0d"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   clampDouble: () => (/* binding */ clampDouble),
/* harmony export */   clampInt: () => (/* binding */ clampInt),
/* harmony export */   differenceDegrees: () => (/* binding */ differenceDegrees),
/* harmony export */   lerp: () => (/* binding */ lerp),
/* harmony export */   matrixMultiply: () => (/* binding */ matrixMultiply),
/* harmony export */   rotationDirection: () => (/* binding */ rotationDirection),
/* harmony export */   sanitizeDegreesDouble: () => (/* binding */ sanitizeDegreesDouble),
/* harmony export */   sanitizeDegreesInt: () => (/* binding */ sanitizeDegreesInt),
/* harmony export */   signum: () => (/* binding */ signum)
/* harmony export */ });
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// This file is automatically generated. Do not modify it.

/**
 * Utility methods for mathematical operations.
 */

/**
 * The signum function.
 *
 * @return 1 if num > 0, -1 if num < 0, and 0 if num = 0
 */
function signum(num) {
  if (num < 0) {
    return -1;
  } else if (num === 0) {
    return 0;
  } else {
    return 1;
  }
}
/**
 * The linear interpolation function.
 *
 * @return start if amount = 0 and stop if amount = 1
 */

function lerp(start, stop, amount) {
  return (1.0 - amount) * start + amount * stop;
}
/**
 * Clamps an integer between two integers.
 *
 * @return input when min <= input <= max, and either min or max
 * otherwise.
 */

function clampInt(min, max, input) {
  if (input < min) {
    return min;
  } else if (input > max) {
    return max;
  }

  return input;
}
/**
 * Clamps an integer between two floating-point numbers.
 *
 * @return input when min <= input <= max, and either min or max
 * otherwise.
 */

function clampDouble(min, max, input) {
  if (input < min) {
    return min;
  } else if (input > max) {
    return max;
  }

  return input;
}
/**
 * Sanitizes a degree measure as an integer.
 *
 * @return a degree measure between 0 (inclusive) and 360
 * (exclusive).
 */

function sanitizeDegreesInt(degrees) {
  degrees = degrees % 360;

  if (degrees < 0) {
    degrees = degrees + 360;
  }

  return degrees;
}
/**
 * Sanitizes a degree measure as a floating-point number.
 *
 * @return a degree measure between 0.0 (inclusive) and 360.0
 * (exclusive).
 */

function sanitizeDegreesDouble(degrees) {
  degrees = degrees % 360.0;

  if (degrees < 0) {
    degrees = degrees + 360.0;
  }

  return degrees;
}
/**
 * Sign of direction change needed to travel from one angle to
 * another.
 *
 * For angles that are 180 degrees apart from each other, both
 * directions have the same travel distance, so either direction is
 * shortest. The value 1.0 is returned in this case.
 *
 * @param from The angle travel starts from, in degrees.
 * @param to The angle travel ends at, in degrees.
 * @return -1 if decreasing from leads to the shortest travel
 * distance, 1 if increasing from leads to the shortest travel
 * distance.
 */

function rotationDirection(from, to) {
  const increasingDifference = sanitizeDegreesDouble(to - from);
  return increasingDifference <= 180.0 ? 1.0 : -1.0;
}
/**
 * Distance of two points on a circle, represented using degrees.
 */

function differenceDegrees(a, b) {
  return 180.0 - Math.abs(Math.abs(a - b) - 180.0);
}
/**
 * Multiplies a 1x3 row vector with a 3x3 matrix.
 */

function matrixMultiply(row, matrix) {
  const a = row[0] * matrix[0][0] + row[1] * matrix[0][1] + row[2] * matrix[0][2];
  const b = row[0] * matrix[1][0] + row[1] * matrix[1][1] + row[2] * matrix[1][2];
  const c = row[0] * matrix[2][0] + row[1] * matrix[2][1] + row[2] * matrix[2][2];
  return [a, b, c];
}

/***/ },

/***/ "4355ff5cca9a"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   argbFromHex: () => (/* binding */ argbFromHex),
/* harmony export */   hexFromArgb: () => (/* binding */ hexFromArgb)
/* harmony export */ });
/* harmony import */ var _color_utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("5dc6cf71e7e6");
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Utility methods for hexadecimal representations of colors.
 */

/**
 * @param argb ARGB representation of a color.
 * @return Hex string representing color, ex. #ff0000 for red.
 */

function hexFromArgb(argb) {
  const r = _color_utils_js__WEBPACK_IMPORTED_MODULE_0__.redFromArgb(argb);
  const g = _color_utils_js__WEBPACK_IMPORTED_MODULE_0__.greenFromArgb(argb);
  const b = _color_utils_js__WEBPACK_IMPORTED_MODULE_0__.blueFromArgb(argb);
  const outParts = [r.toString(16), g.toString(16), b.toString(16)]; // Pad single-digit output values

  for (const [i, part] of outParts.entries()) {
    if (part.length === 1) {
      outParts[i] = '0' + part;
    }
  }

  return '#' + outParts.join('');
}
/**
 * @param hex String representing color as hex code. Accepts strings with or
 *     without leading #, and string representing the color using 3, 6, or 8
 *     hex characters.
 * @return ARGB representation of color.
 */

function argbFromHex(hex) {
  hex = hex.replace('#', '');
  const isThree = hex.length === 3;
  const isSix = hex.length === 6;
  const isEight = hex.length === 8;

  if (!isThree && !isSix && !isEight) {
    throw new Error('unexpected hex ' + hex);
  }

  let r = 0;
  let g = 0;
  let b = 0;

  if (isThree) {
    r = parseIntHex(hex.slice(0, 1).repeat(2));
    g = parseIntHex(hex.slice(1, 2).repeat(2));
    b = parseIntHex(hex.slice(2, 3).repeat(2));
  } else if (isSix) {
    r = parseIntHex(hex.slice(0, 2));
    g = parseIntHex(hex.slice(2, 4));
    b = parseIntHex(hex.slice(4, 6));
  } else if (isEight) {
    r = parseIntHex(hex.slice(2, 4));
    g = parseIntHex(hex.slice(4, 6));
    b = parseIntHex(hex.slice(6, 8));
  }

  return (255 << 24 | (r & 0x0ff) << 16 | (g & 0x0ff) << 8 | b & 0x0ff) >>> 0;
}

function parseIntHex(value) {
  // tslint:disable-next-line:ban
  return parseInt(value, 16);
}

/***/ },

/***/ "365c1fe558c1"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-theme-generator for the shim (stands/18-aliases-ci/alias.mjs, standard §16 item 20). mode: same-detail (the shim sends the new and the old name), split / detail-adds (a detail adapter, refused by the shim), attribute-and-property, method, property, manifest-only (the DOM name does not change), host-attribute (no shim), retired.","component":"sf-theme-generator","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"sf-theme-generator-change","to":"change","kind":"event","component":"sf-theme-generator","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","cancelable":false,"manifest":{"from":"sf-theme-generator-change","to":"change"},"section":"§8, vocabulary 1.1.5 §5.1","note":"the vocabulary\'s change; the alias table\'s sf-theme-generator-change (2026-10-18) is itself dated now"},{"from":"sf-theme-change","to":"change","kind":"event","component":"sf-theme-generator","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","cancelable":false,"manifest":{"from":"sf-theme-change","to":"change"},"section":"§8, vocabulary 1.1.5 §5.1","note":"the first name (journal event-theme-generator-names); the Loader\'s light/dark event bears the same name"},{"from":"sf-theme-generator-apply","to":"sf-theme-generator-committed","kind":"event","component":"sf-theme-generator","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","cancelable":false,"manifest":{"from":"sf-theme-generator-apply","to":"committed"},"section":"§8, vocabulary 1.1.5 §5.1","note":"the commit is a fact; apply is the vocabulary\'s action on entries"},{"from":"sf-theme-apply","to":"sf-theme-generator-committed","kind":"event","component":"sf-theme-generator","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","cancelable":false,"manifest":{"from":"sf-theme-apply","to":"committed"},"section":"§8, vocabulary 1.1.5 §5.1","note":"the first name (journal event-theme-generator-names)"}]}');

/***/ },

/***/ "bc9a73b2d5a7"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.theme-generator","tag":"sf-theme-generator","version":"1.1.5","kind":"leaf","settings":{"value":{"type":"string","default":""},"hue":{"type":"number","nullable":true,"integer":true,"min":0,"max":360,"default":null},"chroma":{"type":"number","nullable":true,"integer":true,"min":0,"max":150,"default":null},"size":{"type":"enum","values":["1/2","1","2"],"default":"1"},"swatches":{"type":"string","default":""},"apply":{"type":"boolean","default":false},"target":{"type":"string","default":""},"selector":{"type":"string","default":":root"}},"values":{"theme":{"type":"object"}},"events":{"change":{"carries":{"value":"string","hue":"number","chroma":"number","theme":"object","variables":"object","css":"string"}},"committed":{"carries":{"value":"string","hue":"number","chroma":"number","theme":"object","variables":"object","css":"string"},"own-verb":true}},"actions":{"reset":{}},"css-variables":{"--sf-theme-generator-gap":{"type":"length","state":"default"},"--sf-theme-generator-color":{"type":"color","state":"default"},"--sf-theme-generator-label-color":{"type":"color","state":"default"},"--sf-theme-generator-swatch-radius":{"type":"length","state":"default"},"--sf-theme-generator-swatch-border-color":{"type":"color","state":"default"}}}');

/***/ },

/***/ "1ec50e997e9a"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Theme generator","runtime":{"advanced":"Advanced","chroma":"Chroma","chroma-hint":"0 to 150","color":"Main colour","error":"Error","hue":"Hue","hue-hint":"0 to 360","info":"Information","inherited":"SIMAI Framework colour","neutral":"Neutral","preview":"Theme preview","primary":"Primary","reset":"Reset","secondary":"Secondary","success":"Success","tertiary":"Tertiary","title":"Theme generator","warning":"Warning"},"events":{"committed":{"label":"Theme committed"}}}');

/***/ },

/***/ "d7615363c74c"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Генератор темы","runtime":{"advanced":"Тонкая настройка","chroma":"Насыщенность","chroma-hint":"От 0 до 150","color":"Основной цвет","error":"Ошибка","hue":"Тон","hue-hint":"От 0 до 360","info":"Информация","inherited":"цвет SIMAI Framework","neutral":"Нейтральная","preview":"Предпросмотр темы","primary":"Основная","reset":"Сбросить","secondary":"Вторичная","success":"Успех","tertiary":"Дополнительная","title":"Генератор темы","warning":"Предупреждение"},"events":{"committed":{"label":"Тема выбрана"}}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("7596c29157bc");
/******/
/******/ })()
;