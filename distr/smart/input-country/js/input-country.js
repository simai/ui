/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "c0450586011d"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bindCountryCode: () => (/* binding */ bindCountryCode),
/* harmony export */   countryForLocale: () => (/* binding */ countryForLocale),
/* harmony export */   countryFormValue: () => (/* binding */ countryFormValue),
/* harmony export */   countryName: () => (/* binding */ countryName),
/* harmony export */   localeRegion: () => (/* binding */ localeRegion),
/* harmony export */   normalizeCountriesList: () => (/* binding */ normalizeCountriesList),
/* harmony export */   normalizeIso2: () => (/* binding */ normalizeIso2),
/* harmony export */   resolveDefaultFlagBase: () => (/* binding */ resolveDefaultFlagBase),
/* harmony export */   setCountryCodeState: () => (/* binding */ setCountryCodeState),
/* harmony export */   toBoolean: () => (/* binding */ toBoolean),
/* harmony export */   unbindCountryCode: () => (/* binding */ unbindCountryCode)
/* harmony export */ });
/* harmony import */ var _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d7f974466839");
/* harmony import */ var _register_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("58661bec99a6");
/* harmony import */ var _json_country_code_utility_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("8c672a55a76a");
/* harmony import */ var _data_countries_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("c614c5e30b0d");
/* harmony import */ var _form_reset_helper__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("67eed2647f47");
/* harmony import */ var _mask_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("0ab12d47912a");
/* harmony import */ var _core_js_position_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("116963e5e31b");
/* harmony import */ var _field_size__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("e6d86f2cd058");
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("43090d1c8307");
/* harmony import */ var _core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("bf0cea966575");
/* harmony import */ var _core_js_tag_aliases_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("4a85acfb05c1");
/* harmony import */ var _icon_buttons_js_name_tooltip_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("2abe37330ca5");
/* harmony import */ var _lang_index_mjs__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__("b0314d85fd3a");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_position_js__WEBPACK_IMPORTED_MODULE_6__, _field_size__WEBPACK_IMPORTED_MODULE_7__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_8__, _core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_9__, _core_js_tag_aliases_js__WEBPACK_IMPORTED_MODULE_10__]);
([_core_js_position_js__WEBPACK_IMPORTED_MODULE_6__, _field_size__WEBPACK_IMPORTED_MODULE_7__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_8__, _core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_9__, _core_js_tag_aliases_js__WEBPACK_IMPORTED_MODULE_10__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_position_js__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_core_js_position_js__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_9__);










 // The flag button shows its name as the Framework's tooltip (FS-11, C144).

 // The words live in the component's language files (localization study LC-4):
// one place for every language, as the Smart components keep them.

 // Every word this part says. A product adds a language with
// SF.language.register('sf-input-country', code, words); the locale here is
// also what the number itself is formatted by, which is why it stays.

const COUNTRY_CODE_TEXT = _lang_index_mjs__WEBPACK_IMPORTED_MODULE_12__["default"]; // Prefer the helper Core published; an isolated bundle uses its own copy.

const positioning = () => globalThis.SF?.Position || (_core_js_position_js__WEBPACK_IMPORTED_MODULE_6___default());

const COUNTRY_CODE_SELECTOR = '.sf-country-code';
const COUNTRY_CODE_BOUND_FLAG = 'sfCountryCodeBound';
const COUNTRY_ITEMS = Array.isArray(_data_countries_json__WEBPACK_IMPORTED_MODULE_3__?.items) ? _data_countries_json__WEBPACK_IMPORTED_MODULE_3__.items : [];
let countryId = 0;
const countryGeneratedNames = new WeakMap();
const countryResetDefaults = new WeakMap();
const countryRequiredMessages = new WeakMap();
const countryFieldReferences = new WeakMap();
const countryMaskConfiguration = new WeakMap();

function syncCountryFieldReferences(root, input) {
  if (!input) return;
  const refs = countryFieldReferences.get(input) || {};
  const label = root.querySelector('.sf-country-code-text');
  const hint = root.querySelector('.sf-country-code-hint');
  const generatedName = countryGeneratedNames.get(input);
  const authorName = input.hasAttribute('aria-label') && input.getAttribute('aria-label') !== generatedName;

  for (const [attribute, candidate] of [['aria-labelledby', label], ['aria-describedby', hint]]) {
    const node = candidate?.textContent.trim() ? candidate : null;
    let tokens = (input.getAttribute(attribute) || '').split(/\s+/).filter(Boolean); // A clone retains generated markup, not WeakMap entries. Recognize only the
    // framework-owned id of its own local label/hint before repairing duplicates.

    const copiedId = candidate && /^sf-country-\d+$/.test(candidate.id) && tokens.includes(candidate.id) ? candidate.id : '';
    const previous = refs[attribute] || copiedId;
    tokens = tokens.filter(id => id !== previous);
    const attach = node && (attribute === 'aria-describedby' || !authorName && tokens.length === 0);
    const next = attach ? ensureCountryId(node) : '';
    if (next) tokens.push(next);
    const value = [...new Set(tokens)].join(' ');

    if (value !== (input.getAttribute(attribute) || '')) {
      if (value) input.setAttribute(attribute, value);else input.removeAttribute(attribute);
    }

    refs[attribute] = next;
  }

  countryFieldReferences.set(input, refs);

  if (label?.textContent.trim() || input.hasAttribute('aria-labelledby')) {
    if (generatedName && input.getAttribute('aria-label') === generatedName) input.removeAttribute('aria-label');
  } else if (!authorName) {
    const name = (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(COUNTRY_CODE_TEXT, 'phoneLabel', root, 'sf-input-country');
    if (input.getAttribute('aria-label') !== name) input.setAttribute('aria-label', name);
    countryGeneratedNames.set(input, name);
  }
}

function syncCountryRequired(root, input) {
  const previous = countryRequiredMessages.get(input);
  if (input.validity.customError && input.validationMessage !== previous) return;
  const config = root.__sfCountryConfig || {};
  const value = String(input.value || '').trim();
  const local = config.showCode ? extractLocalPart(value, root.dataset.dialCode) : value;
  const missing = input.required && value !== '' && !/\d/.test(local);
  const message = missing ? (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(COUNTRY_CODE_TEXT, 'phoneRequired', root, 'sf-input-country') : '';
  input.setCustomValidity(message);
  countryRequiredMessages.set(input, message);
}

function ensureCountryId(node) {
  if (!node) return '';

  if (!node.id || document.getElementById(node.id) && document.getElementById(node.id) !== node) {
    do {
      node.id = `sf-country-${++countryId}`;
    } while (document.getElementById(node.id) && document.getElementById(node.id) !== node);
  }

  return node.id;
}

function setCountryName(node, value) {
  if (!node || node.hasAttribute('aria-labelledby')) return;
  const previous = countryGeneratedNames.get(node);

  if (!node.hasAttribute('aria-label') || node.getAttribute('aria-label') === previous) {
    node.setAttribute('aria-label', value);
    countryGeneratedNames.set(node, value);
  }
}

function syncCountryAccessibility(root) {
  const {
    input,
    toggle,
    list,
    itemsWrap,
    items
  } = getNodes(root);
  const config = root.__sfCountryConfig || {};
  const open = root.classList.contains('open');
  const selected = root.__sfCountrySelected;
  const countryName = (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(COUNTRY_CODE_TEXT, 'countryLabel', root, 'sf-input-country');
  syncCountryFieldReferences(root, input);
  root.querySelectorAll('.sf-country-code-required, .sf-country-code-left .sf-icon').forEach(node => node.setAttribute('aria-hidden', 'true'));

  if (toggle) {
    if (config.multiCountry && config.showCode && list) {
      // A code the text does not name (owner C87: the person erased or
      // retyped it) leaves the flag an empty frame; the button says so.
      const unknown = root.classList.contains('sf-country-code--unknown');
      setCountryName(toggle, unknown ? (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(COUNTRY_CODE_TEXT, 'countryUnknown', root, 'sf-input-country') : `${countryName}${selected ? `: ${getCountryLabel(selected, config.locale)}` : ''}`);
      toggle.setAttribute('role', 'button');
      toggle.setAttribute('aria-haspopup', 'listbox');
      toggle.setAttribute('aria-controls', ensureCountryId(itemsWrap || list));
      toggle.setAttribute('aria-expanded', String(open)); // A flag is no words (C144): the button's name -- «Код страны: Россия
      // (+7)», the chosen country in the page's language -- is its tooltip
      // too, as an icon button's is, and follows the choice (FS-11).

      toggle.setAttribute('data-sf-name-tip', '');
    } else {
      toggle.removeAttribute('data-sf-name-tip');
      (0,_icon_buttons_js_name_tooltip_js__WEBPACK_IMPORTED_MODULE_11__.unlinkNameTip)(toggle); // With one fixed country the flag and code are a picture, not a control.
      // A span without a role does not get a name: an aria-label or
      // aria-disabled left on it is not allowed there and is never read. The
      // dial code stays in the field's own value, which is what is read.

      toggle.removeAttribute('aria-haspopup');
      toggle.removeAttribute('aria-controls');
      toggle.removeAttribute('aria-expanded');
      toggle.removeAttribute('aria-disabled');
      toggle.removeAttribute('role');

      if (toggle.getAttribute('aria-label') === countryGeneratedNames.get(toggle)) {
        toggle.removeAttribute('aria-label');
        countryGeneratedNames.delete(toggle);
      }

      toggle.tabIndex = -1;
    }
  } // The panel holds the search and the list of countries (RG-CC-4, the
  // combobox pattern, as sf-dropdown's search): only the rows' wrap is the
  // listbox, so it holds options alone; the search field stands before it.
  // The panel itself has no role.


  if (list) {
    if (itemsWrap && list.getAttribute('role') === 'listbox') list.removeAttribute('role');

    if (itemsWrap && list.getAttribute('aria-label') === countryGeneratedNames.get(list)) {
      list.removeAttribute('aria-label');
      countryGeneratedNames.delete(list);
    }

    const box = itemsWrap || list;
    box.setAttribute('role', 'listbox');
    setCountryName(box, countryName);
    list.setAttribute('aria-hidden', String(!open));
    list.inert = !open;
  }

  let selectedFound = false;

  for (const item of items) {
    const matches = !selectedFound && !!selected && (selected.iso2 ? normalizeIso2(item.dataset.iso2) === selected.iso2 : item.dataset.code === selected.dialCode);
    selectedFound ||= matches;
    item.setAttribute('role', 'option');
    item.setAttribute('aria-selected', String(matches));
    item.tabIndex = open && item === document.activeElement ? 0 : -1;
  }
}

function toBoolean(value, fallback = false) {
  if (value === undefined || value === null || value === '') return fallback;
  if (typeof value === 'boolean') return value;
  return ['1', 'true', 'yes', 'on', 'active', 'open', 'disabled'].includes(String(value).toLowerCase());
}

function normalizeIso2(value) {
  return String(value || '').trim().toUpperCase();
}
/* The field has always been able to draw flags from an SVG set -- the whole
   data-flag-base path below is built for it -- and the default base was an empty
   string, so nothing ever used it. What was drawn instead was country.flagEmoji
   through the system font: a waving flag on macOS, a flat one on Android, and on
   Windows no flag at all, because Segoe UI Emoji carries no country glyphs and a
   regional indicator pair renders as the letters.

   The Framework now ships the set, so the default points at it. A project with
   its own flags still overrides this with data-flag-base, and the emoji stays as
   the fallback for a runtime that cannot resolve its own root. */


function resolveDefaultFlagBase() {
  const root = typeof window !== 'undefined' ? window.sfPath : '';
  if (!root) return '';

  try {
    // sfPath may be written without its closing slash ('/ui/distr'); a URL
    // base without it drops the last segment, so the flags were asked for
    // beside distr rather than inside it.
    return new URL('component/flag/flags/rect', String(root).replace(/\/?$/u, '/')).href.replace(/\/$/, '');
  } catch {
    return String(root).replace(/\/$/, '') + '/component/flag/flags/rect';
  }
}

function getFlagSrc(iso2, flagBase) {
  const code = normalizeIso2(iso2).toLowerCase();
  if (!code || !flagBase) return '';
  return `${flagBase}/${code}.svg`;
}

function loadFlagImage(img) {
  if (!img || img.dataset.loaded === '1') return;
  const src = img.dataset.flagSrc || '';
  if (!src) return;
  img.src = src;
  img.dataset.loaded = '1';
} // A flag of the list is the browser's own lazy image: its address is set when
// the row is built and `loading="lazy"` lets the browser fetch it when the row
// comes near the view, a closed list (display: none) fetching nothing. The
// field watched the rows with its own IntersectionObserver instead, and that
// never answered inside a sandboxed frame (an opaque origin): every flag of
// an open list stayed an empty image (docs pre-check 2026-11-10 CC-02).
// lazy-flags off (eager-flags) asks for every flag at once.


function observeFlagImage(img, lazy = true) {
  if (!img) return;
  img.loading = lazy ? 'lazy' : 'eager';
  loadFlagImage(img);
}

function createFlagNode(country, config, lazy = true) {
  const flag = document.createElement('div');
  flag.classList.add('sf-country-code-flag');
  flag.setAttribute('aria-hidden', 'true');
  const fallback = country?.flagEmoji || '';
  const src = getFlagSrc(country?.iso2, config.flagBase);

  if (!src) {
    flag.textContent = fallback;
    return flag;
  }

  const img = document.createElement('img');
  img.alt = country?.iso2 ? `${country.iso2} flag` : 'flag';
  img.decoding = 'async';
  img.loading = 'lazy';
  img.dataset.flagSrc = src;
  img.dataset.flagFallback = fallback;
  img.addEventListener('error', () => {
    flag.textContent = fallback;
  }, {
    once: true
  });
  observeFlagImage(img, lazy && config.lazyFlags);
  flag.append(img);
  return flag;
}

function getNodes(root) {
  const input = root?.querySelector?.('.sf-country-code-field input') || null;
  const toggle = root?.querySelector?.('.sf-country-code-left') || null;
  const list = root?.querySelector?.('.sf-country-code-list') || null;
  const itemsWrap = root?.querySelector?.('.sf-country-code-items') || null;
  const items = Array.from(root?.querySelectorAll?.('.sf-country-code-item') || []);
  const leftFlag = root?.querySelector?.('.sf-country-code-left .sf-country-code-flag-icon') || root?.querySelector?.('.sf-country-code-left .sf-country-code-flag') || null;
  return {
    input,
    toggle,
    list,
    itemsWrap,
    items,
    leftFlag
  };
}

function getCountryByIso2(iso2) {
  const code = normalizeIso2(iso2);
  if (!code) return null;
  return COUNTRY_ITEMS.find(item => item.iso2 === code) || null;
}

function getCountryByDialCode(dialCode) {
  const code = String(dialCode || '').trim();
  if (!code) return null;
  return COUNTRY_ITEMS.find(item => item.dialCode === code) || null;
}

function normalizeMaskPatternByStyle(pattern, style = 'native') {
  const value = String(pattern || '').trim();
  if (!value) return value;
  if (style !== 'brackets') return value;
  const normalized = value.replace(/[()]/g, '');
  const match = normalized.match(/^(\+\S+)\s+(.+)$/);
  if (!match) return normalized;
  const prefix = match[1];
  const tail = match[2].trim();
  if (!tail) return normalized;
  const firstSpaceIndex = tail.indexOf(' ');
  let firstToken = firstSpaceIndex >= 0 ? tail.slice(0, firstSpaceIndex) : tail;
  let rest = firstSpaceIndex >= 0 ? tail.slice(firstSpaceIndex + 1).trim() : '';
  let firstGroup = firstToken;

  if (firstToken.includes('-')) {
    const [firstChunk, ...nextChunks] = firstToken.split('-');
    firstGroup = firstChunk;
    const fromHyphen = nextChunks.join('-');
    rest = [fromHyphen, rest].filter(Boolean).join(' ');
  }

  if (!firstGroup) return normalized;
  return `${prefix} (${firstGroup})${rest ? ` ${rest}` : ''}`.trim();
}

function buildPlaceholderFromMask(maskPattern, placeholderChar, dialCode = '') {
  const pattern = String(maskPattern || '');
  if (!pattern) return '';
  const char = placeholderChar || '_';
  const dialDigits = String(dialCode || '').replace(/\D/g, '');
  let dialIndex = 0;
  return pattern.replace(/0/g, () => {
    if (dialIndex < dialDigits.length) {
      const next = dialDigits[dialIndex];
      dialIndex += 1;
      return next;
    }

    return char;
  });
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function extractLocalPart(fullValue, previousDialCode) {
  const value = String(fullValue || '').trim();
  if (!value) return '';

  if (previousDialCode) {
    const prev = escapeRegExp(previousDialCode.trim());
    const prevPattern = new RegExp(`^${prev}[\\s\\-()]*`, 'i');
    const stripped = value.replace(prevPattern, '').trim();
    if (stripped !== value) return stripped;
  } // Fallback: strip leading international prefix like +123 ... and keep user tail.
  // A bare «+» counts: the code the person erased (owner C87) leaves «+ 30…».


  return value.replace(/^\+\d*[\s\-()]*/, '').trim();
} // The number in its form format (standard simai.smart-component §17.1 item 2;
// the study's «в форму — E.164»): `+`, the dial code and the national digits,
// no spaces, dashes or brackets, whatever the box shows -- `+7 903 123-45-67`
// submits `+79031234567`. The code alone is no number and submits nothing. A
// text without its `+` (hide-code) is the national part of the chosen
// country's number.


function countryFormValue(text, dialCode = '') {
  const value = String(text ?? '').trim();
  const all = value.replace(/\D/gu, '');
  if (!all) return '';
  const code = String(dialCode || '').replace(/\D/gu, '');
  if (value.startsWith('+')) return code && all === code ? '' : `+${all}`;
  return code ? `+${code}${all}` : all;
}

function closeAllCountryCodes(except = null) {
  document.querySelectorAll(COUNTRY_CODE_SELECTOR).forEach(node => {
    if (except && node === except) return;
    setOpenState(node, false);
  });
}

function setOpenState(root, open) {
  if (!root) return;
  const {
    input
  } = getNodes(root);
  if (input?.disabled || root.classList.contains('disabled') || root.__sfCountryConfig?.multiCountry === false) open = false;
  if (open) root.classList.add('open');else root.classList.remove('open'); // An open list of countries owns Escape: the root says so, and a drawer, a
  // modal or a record panel behind it stands back.

  (0,_core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_9__.holdOpenSurfaceMark)(root, open);
  syncCountryAccessibility(root); // A closed list forgets its search; an open one is arranged before it is
  // placed, so the rows it is measured by are the rows it shows.

  if (!open && root.__sfCountryQuery) {
    root.__sfCountryQuery = '';
    const search = root.querySelector('.sf-country-code-search input');
    if (search) search.value = '';
  }

  arrangeCountryList(root);
  root.__sfCountryViewport?.(open);

  if (open) {
    // Every way a list opens -- a press, the keyboard, open at connect,
    // setState -- gives its rows their files. Only the press set them, so a
    // list drawn open kept empty images (DEV P1, owner R135).
    prefetchVisibleFlags(root);
    revealChosenCountry(root);
  }
}

function resolveConfig(root, input) {
  const locale = String(root.dataset.locale || input?.dataset.locale || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageLanguage)(root)).toLowerCase();
  const rawMaskStyle = String(root.dataset.maskStyle ?? input?.dataset.maskStyle ?? 'native').toLowerCase();
  const maskStyle = rawMaskStyle === 'brackets' ? 'brackets' : 'native';
  return {
    // The page's language as it is: ru and en name countries from the table,
    // any other language through Intl (C177 (9): a third language was English).
    locale: locale.split('-')[0] || 'en',
    // The same language with its region, for the country an empty field
    // starts on (countryForLocale).
    localeTag: countryLocaleTag(root, input),
    useMask: toBoolean(root.dataset.useMask ?? input?.dataset.useMask, false),
    useCountryMasks: toBoolean(root.dataset.useCountryMasks ?? input?.dataset.useCountryMasks, true),
    showCode: toBoolean(root.dataset.showCode ?? input?.dataset.showCode, true),
    maskStyle,
    multiCountry: toBoolean(root.dataset.multiCountry ?? input?.dataset.multiCountry, true),
    defaultIso2: normalizeIso2(root.dataset.iso2 ?? input?.dataset.iso2),
    fixedDialCode: String(root.dataset.dialCode ?? input?.dataset.dialCode ?? '').trim(),
    fixedMaskPattern: String(root.dataset.maskPattern ?? input?.dataset.maskPattern ?? '').trim(),
    flagBase: String(root.dataset.flagBase || input?.dataset.flagBase || '').trim() || resolveDefaultFlagBase(),
    lazyFlags: toBoolean(root.dataset.lazyFlags ?? input?.dataset.lazyFlags, true),
    showMaskPlaceholder: toBoolean(root.dataset.showMaskPlaceholder ?? input?.dataset.showMaskPlaceholder, false),
    maskPlaceholderChar: String(root.dataset.maskPlaceholderChar ?? input?.dataset.maskPlaceholderChar ?? '_'),
    maxItems: Number.parseInt(root.dataset.maxItems || input?.dataset.maxItems || '0', 10) || 0,
    // The countries on top of the list (owner C87): data-preferred="RU,KZ",
    // an empty one for the recent choices alone; without it no group at all.
    preferred: root.dataset.preferred === undefined ? undefined : String(root.dataset.preferred).split(/[\s,;]+/u).map(normalizeIso2).filter(Boolean)
  };
} // The locale with its region (en-GB is Britain): the Smart host's own
// `locale` setting as written, else the page's -- its template writes the
// language alone into data-locale. Plain markup: data-locale as authored,
// else the page's.


function countryLocaleTag(root, input) {
  const host = root.closest?.((0,_core_js_tag_aliases_js__WEBPACK_IMPORTED_MODULE_10__.tagSelector)('sf-input-country'));
  const own = host ? host.getAttribute('locale') : root.dataset.locale || input?.dataset.locale;
  return String(own || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageLocale)(root) || '').trim();
} // A country's name in a language the table does not carry, from Intl; null
// where Intl has no name for it (it answers the code back).


const REGION_NAMES = new Map();

function regionName(iso2, locale) {
  if (!iso2 || !locale) return null;

  try {
    if (!REGION_NAMES.has(locale)) REGION_NAMES.set(locale, new Intl.DisplayNames([locale], {
      type: 'region'
    }));
    const name = REGION_NAMES.get(locale).of(String(iso2).toUpperCase());
    return name && name.toUpperCase() !== String(iso2).toUpperCase() ? name : null;
  } catch {
    return null;
  }
} // A country's name in a language (owner decision C282: the Framework ships
// the names in English; any other language's are its language file's words):
// the name the item gives itself (a product's list may say nameEn and
// nameRu), else the word registered for sf-input-country in that language
// (country-<ISO2>, the ru language file's), else the browser's
// (Intl.DisplayNames), else the English name, else the code.


function countryName(country, locale) {
  if (!country) return '';
  const code = String(locale || 'en').toLowerCase().replace('_', '-').split('-')[0] || 'en';
  const own = code === 'en' ? country.nameEn : code === 'ru' ? country.nameRu : null;
  if (own) return own;
  const iso2 = normalizeIso2(country.iso2);

  if (code !== 'en' && iso2) {
    const key = `country-${iso2}`;
    const word = (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.localeText)(null, key, locale, 'sf-input-country');
    if (word && word !== key) return word;
    const named = regionName(iso2, locale);
    if (named) return named;
  }

  return country.nameEn || country.nameRu || iso2 || '';
}

function getCountryLabel(country, locale) {
  if (!country) return '';
  if (country.label) return String(country.label);
  const name = countryName(country, locale);
  return name ? `${name} (${country.dialCode})` : String(country.dialCode || '');
}

function normalizeCountriesList(countries, locale = 'ru', maxItems = 0) {
  let items = Array.isArray(countries) && countries.length ? countries : COUNTRY_ITEMS;

  if (Number(maxItems) > 0) {
    items = items.slice(0, Number(maxItems));
  }

  return items.filter(country => country && typeof country === 'object').map(country => {
    const iso2 = normalizeIso2(country.iso2);
    const dialCode = String(country.dialCode || country.code || '').trim();
    const known = getCountryByIso2(iso2) || !iso2 && getCountryByDialCode(dialCode) || {};
    const item = { ...known,
      ...country,
      iso2: iso2 || known.iso2 || '',
      dialCode: dialCode || known.dialCode || ''
    };
    item.label = getCountryLabel(item, locale);
    return item;
  });
}

function readCountryItem(item, locale) {
  const text = item.cloneNode(true);
  text.querySelectorAll('.sf-country-code-flag, [aria-hidden="true"]').forEach(node => node.remove());
  return normalizeCountriesList([{
    iso2: item.dataset.iso2,
    code: item.dataset.code,
    label: text.textContent.trim(),
    ...(item.hasAttribute('data-mask-pattern') ? {
      maskPattern: item.dataset.maskPattern
    } : {})
  }], locale)[0];
}

function resolveCountry(root, iso2 = '', dialCode = '') {
  const countries = root.__sfCountryOptions || [];
  const iso = normalizeIso2(iso2),
        code = String(dialCode || '').trim(); // Explicit known countries outside the visible list remain supported for
  // compatibility. Local descriptors take precedence over the shared dataset.

  return iso && countries.find(country => country.iso2 === iso) || code && countries.find(country => country.dialCode === code) || getCountryByIso2(iso) || getCountryByDialCode(code);
}

function ensureListMarkup(root, config) {
  const {
    list,
    itemsWrap
  } = getNodes(root);
  if (list && itemsWrap) return {
    list,
    itemsWrap
  };
  const newList = document.createElement('span');
  newList.classList.add('sf-country-code-list');
  const newItemsWrap = document.createElement('span');
  newItemsWrap.classList.add('sf-country-code-items', 'flex', 'flex-col');
  newList.append(newItemsWrap);
  const field = root.querySelector('.sf-country-code-field');

  if (field) {
    field.insertAdjacentElement('afterend', newList);
  } else {
    root.append(newList);
  }

  if (!config.multiCountry) {
    newList.classList.add('hidden');
  }

  return {
    list: newList,
    itemsWrap: newItemsWrap
  };
}

function renderDatasetItems(root, config) {
  if (!config.multiCountry) return;
  const {
    itemsWrap
  } = ensureListMarkup(root, config);
  if (!itemsWrap) return;
  if (itemsWrap.children.length > 0) return;
  const sliced = config.maxItems > 0 ? COUNTRY_ITEMS.slice(0, config.maxItems) : COUNTRY_ITEMS;
  const frag = document.createDocumentFragment();
  sliced.forEach(country => {
    const item = document.createElement('span');
    item.classList.add('sf-country-code-item', 'flex', 'items-center', 'transition');
    item.dataset.iso2 = country.iso2;
    item.dataset.code = country.dialCode;
    if (country.maskPattern) item.dataset.maskPattern = country.maskPattern;
    const flag = createFlagNode(country, config, true);
    const text = document.createElement('span');
    text.textContent = getCountryLabel(country, config.locale);
    item.append(flag, text);
    frag.append(item);
  });
  itemsWrap.append(frag);
}

function prefetchVisibleFlags(root) {
  const {
    list
  } = getNodes(root);
  if (!list) return;
  const lazy = root.__sfCountryConfig?.lazyFlags !== false;
  list.querySelectorAll('img[data-flag-src]').forEach(img => {
    // A file that does not come draws the emoji, as the field's own flag
    // does; a row image of the template or of authored markup had no
    // fallback and stayed a broken picture.
    if (!img.__sfFlagFallback) {
      img.__sfFlagFallback = true;
      img.addEventListener('error', () => {
        const fallback = img.dataset.flagFallback || '';
        const holder = img.parentElement;
        if (holder && fallback) holder.textContent = fallback;
      }, {
        once: true
      });
    }

    observeFlagImage(img, lazy);
  });
} // Caps the scrolling rows at `visibleItems` real rows (default 8). The list is
// a flex column while open, so when SF.Position limits the list to the free
// viewport height the rows shrink and scroll instead of overflowing.


function applyDropdownViewport(root, visibleItems = 8) {
  const {
    list,
    itemsWrap
  } = getNodes(root);
  if (!list || !itemsWrap || visibleItems <= 0 || !root.classList.contains('open')) return 0;
  const items = Array.from(itemsWrap.querySelectorAll('.sf-country-code-item')).slice(0, visibleItems);
  const heights = items.map(item => item.offsetHeight);
  if (!heights.some(Boolean)) return 0;
  const wrapStyle = window.getComputedStyle(itemsWrap);
  const gap = Number.parseFloat(wrapStyle.rowGap || '') || Number.parseFloat(wrapStyle.gap || '') || 0;
  const total = heights.reduce((sum, height) => sum + height, 0) + (items.length - 1) * gap + (Number.parseFloat(wrapStyle.paddingTop || '') || 0) + (Number.parseFloat(wrapStyle.paddingBottom || '') || 0);
  Object.assign(itemsWrap.style, {
    maxHeight: `${total}px`,
    minHeight: '0',
    overflowY: 'auto',
    overflowX: 'hidden'
  });
  return total;
}

function bindCountryViewport(root) {
  const {
    list,
    itemsWrap
  } = getNodes(root);
  if (!list || !itemsWrap) return;
  let anchor = null;
  let saved = null;
  let lower = null;

  root.__sfCountryViewport = open => {
    if (open && !anchor && !lower && root.isConnected && countryListOnPhone()) {
      // On a phone the list is a sheet at the bottom of the screen, the
      // screen's width, its rows the sheet's height (owner C87, V4; the
      // sheet of C32). It is lifted into the top layer and not anchored.
      saved = ['display', 'flex-direction', 'overflow'].map(name => [name, list.style.getPropertyValue(name), list.style.getPropertyPriority(name)]);
      Object.assign(list.style, {
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      });
      list.setAttribute('data-sf-sheet', '');

      for (const name of ['maxHeight', 'minHeight']) itemsWrap.style[name] = '';

      lower = positioning().liftToTopLayer?.(list) || (() => {});
    } else if (open && !anchor && !lower && root.isConnected) {
      saved = ['display', 'flex-direction', 'overflow'].map(name => [name, list.style.getPropertyValue(name), list.style.getPropertyPriority(name)]);
      Object.assign(list.style, {
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      });
      applyDropdownViewport(root); // Shared Framework geometry: below the field, flipped above when the
      // rows do not fit and there is more room, shifted inside the viewport.
      // The height is the list's own: eight rows (the stylesheet and
      // applyDropdownViewport), never the room left in the viewport. A frame
      // that grows with its document is that room: a list that took it
      // followed the frame and the frame followed the list -- 9.8k px in a
      // documentation example, or squeezed to 16 px with no row in a frame
      // that counts only the list's box (DEV acceptance 2026-11-11, CC-01).
      // At least the field's width; the list with its search is the panel
      // step (C32: 20rem) where the field is narrower.
      // The list hangs from the field itself, --sf-space-1/4 below it, as the
      // datepicker's popup does; anchored to the root it hung under the hint
      // (RG-CC-6).

      const field = root.querySelector('.sf-country-code-field') || root;
      anchor = positioning().anchor(field, list, {
        side: 'block-end',
        align: 'start',
        matchWidth: 'min',
        fitHeight: false,
        onPosition: () => {
          const box = root.getBoundingClientRect();
          if (box.bottom <= 0 || box.top >= window.innerHeight) setOpenState(root, false);
        }
      });
    } else if (!open && (anchor || lower)) {
      if (anchor) anchor.stop();
      anchor = null;
      lower?.();
      lower = null;
      list.removeAttribute('data-sf-sheet');

      for (const [name, value, priority] of saved) {
        if (value) list.style.setProperty(name, value, priority);else list.style.removeProperty(name);
      }
    } else if (open && anchor) {
      applyDropdownViewport(root);
      anchor.update();
    }
  };
} // A phone, by the rule sf-menu-context uses for its sheet: the md breakpoint
// variable is empty below md.


function countryListOnPhone() {
  if (typeof getComputedStyle !== 'function' || typeof document === 'undefined') return false;
  return !getComputedStyle(document.documentElement).getPropertyValue('--sf-breakpoint-md').trim();
}
/* Whether a property can be assigned, not merely whether it is there. The two
   differ: an accessor declared with a getter and no setter answers to
   hasOwnProperty and still throws when written, and an implementation may put
   the same property on a prototype instead of the instance, where
   hasOwnProperty does not see it at all. */


function writable(instance, name) {
  for (let node = instance; node; node = Object.getPrototypeOf(node)) {
    const descriptor = Object.getOwnPropertyDescriptor(node, name);
    if (descriptor) return typeof descriptor.set === 'function' || descriptor.writable === true;
  }

  return false;
}

async function applyMaskForRoot(root, input, maskPattern, config = null) {
  if (!input) return; // Requests can overlap across unbind/rebind or mask removal. A counter that
  // restarts on rebind lets an old request match a new one (the ABA problem).

  const token = Symbol('country-code-mask');
  root.__sfCountryMaskToken = token;

  if (root.__sfCountryMask) {
    window.SF?.Mask?.destroy?.(root.__sfCountryMask);
    delete root.__sfCountryMask;
  }

  root.__sfCountryMaskPattern = maskPattern || '';
  if (!maskPattern) return;
  const service = await (0,_mask_service__WEBPACK_IMPORTED_MODULE_5__.maskService)();
  if (token !== root.__sfCountryMaskToken) return;
  const current = input.value;

  try {
    const resolvedConfig = config || root.__sfCountryConfig || resolveConfig(root, input);
    const hasInitialValue = String(current || '').trim() !== '';
    const showMaskTemplate = resolvedConfig.showMaskPlaceholder && hasInitialValue;

    if (!hasInitialValue && maskPattern) {
      const dialCode = root?.dataset?.dialCode || resolvedConfig.fixedDialCode || '';
      const masked = buildPlaceholderFromMask(maskPattern, resolvedConfig.maskPlaceholderChar || '_', dialCode);
      if (root.__sfCountryOwnPlaceholder) writeCountryPlaceholder(input, masked);else input.placeholder = masked;
    }

    const instance = await service.create(input, {
      mask: maskPattern,
      lazy: !showMaskTemplate,
      placeholderChar: resolvedConfig.maskPlaceholderChar || '_'
    });

    if (!instance || token !== root.__sfCountryMaskToken) {
      window.SF?.Mask?.destroy?.(instance);
      return;
    }

    root.__sfCountryMask = instance;

    if (current) {
      const digitsOnly = String(current).replace(/\D+/g, '');

      if (digitsOnly && writable(instance, 'unmaskedValue')) {
        instance.unmaskedValue = digitsOnly;
      } else if (writable(instance, 'value')) {
        instance.value = String(current);
      }

      if (typeof instance.updateValue === 'function') {
        instance.updateValue();
      }

      input.value = instance.value || input.value;
    }

    syncCountryRequired(root, input); // The mask arrives after the input event of a country change and may lay
    // the number out again: the Smart host's form value follows the box.

    root.closest?.((0,_core_js_tag_aliases_js__WEBPACK_IMPORTED_MODULE_10__.tagSelector)('sf-input-country'))?.sfSyncFormState?.();
  } catch (error) {
    console.warn('SF.CountryCode mask init failed', error);
  }
}

function resolveInitialCountry(config, root, value = '') {
  return resolveCountry(root, config.defaultIso2) || resolveCountry(root, '', config.fixedDialCode) || countryFromNumber(root, value) || countryForLocale(root, config.localeTag) || root.__sfCountryOptions?.[0] || COUNTRY_ITEMS[0] || null;
} // The country an empty field starts on when nothing names one (FL-7, property
// page study 2026-11-17): the page's. An empty phone on a Russian page opened
// on the first row of the table, Australia and +61. The region the locale
// writes wins (en-GB is Britain, pt-BR Brazil); a bare language takes its
// likely region from Intl (ru is Russia, en the United States, ar Egypt); a
// language Intl cannot place, the United States. Only a country the field
// offers: a field given its own list starts on that list's first row. An
// iso2 or a dial code set on the field, or the number's own code, come first.


const LOCALE_FALLBACK_COUNTRY = 'US';

function localeRegion(tag) {
  const text = String(tag || '').trim().replace(/_/gu, '-');
  if (!text) return '';

  try {
    const locale = new Intl.Locale(text);
    return locale.region || locale.maximize().region || '';
  } catch {
    return text.split('-').slice(1).find(part => /^[a-z]{2}$/iu.test(part)) || '';
  }
}

function countryForLocale(root, tag) {
  const options = root?.__sfCountryOptions?.length ? root.__sfCountryOptions : COUNTRY_ITEMS;

  const offered = iso2 => {
    const iso = normalizeIso2(iso2);
    return iso && options.find(country => country.iso2 === iso) || null;
  };

  return offered(localeRegion(tag)) || offered(LOCALE_FALLBACK_COUNTRY);
} // Where several countries share a dial code, the one a number with that code
// means unless its next digits say otherwise (+7 6xx and +7 7xx are
// Kazakhstan).


const SHARED_DIAL_CODES = {
  '+1': 'US',
  '+7': 'RU',
  '+39': 'IT',
  '+44': 'GB',
  '+47': 'NO',
  '+61': 'AU',
  '+212': 'MA',
  '+262': 'RE',
  '+358': 'FI',
  '+590': 'GP',
  '+599': 'CW'
}; // The country a stored number names by its own dial code: the longest dial
// code its digits start with. A field that gets '+7 900 123-45-67' and no
// country used to take the first country of the list (Australia, +61) and
// read the number through its mask as '+79 0 0123 4567' (simai/ui-source#34).

function countryFromNumber(root, value) {
  const text = String(value || '').trim();
  if (!text.startsWith('+')) return null;
  const digits = text.replace(/\D/g, '');
  if (!digits) return null;
  const options = root.__sfCountryOptions?.length ? root.__sfCountryOptions : COUNTRY_ITEMS;

  for (let length = Math.min(4, digits.length); length > 0; length -= 1) {
    const code = `+${digits.slice(0, length)}`;
    const matches = options.filter(country => country.dialCode === code);
    if (!matches.length) continue;
    if (matches.length === 1) return matches[0];

    if (code === '+7' && /^[67]/u.test(digits.slice(1))) {
      const kazakhstan = matches.find(country => country.iso2 === 'KZ');
      if (kazakhstan) return kazakhstan;
    }

    return matches.find(country => country.iso2 === SHARED_DIAL_CODES[code]) || matches[0];
  }

  return null;
} // The national number laid out by the country's pattern (owner C87: «дальше
// просто номер по маске страны»): «+7 9031234567» reads «+7 903 123-45-67».
// The pattern's first group is the dial code; the rest places the national
// digits. The pattern stops where the digits stop, so no separator waits
// ahead of the caret, and digits beyond the pattern stay at the end: a
// number is never cut. Any spacing the person typed is laid out again, so a
// space typed after the code's own space is not doubled.


function formatByPattern(text, country, pattern = country?.maskPattern) {
  const code = String(country?.dialCode || '').replace(/\D/gu, '');
  const all = String(text || '').replace(/\D/gu, '');
  const rest = all.startsWith(code) ? all.slice(code.length) : all;
  const tail = String(pattern || '').trim().replace(/^\+0*\s*/u, '');
  if (!tail) return `${country.dialCode} ${rest}`.trimEnd();
  let out = '',
      index = 0;

  for (const char of tail) {
    if (index >= rest.length) break;
    out += char === '0' ? rest[index++] : char;
  }

  return `${country.dialCode} ${out}${rest.slice(index)}`.trimEnd();
} // Where the caret goes after the text is laid out again: after the same
// count of digits it followed before.


function caretAfterDigits(text, count) {
  if (count <= 0) return /^\s*\+/u.test(text) ? text.indexOf('+') + 1 : 0;
  let seen = 0;

  for (let index = 0; index < text.length; index += 1) {
    if (!/\d/u.test(text[index])) continue;
    seen += 1;
    if (seen === count) return index + 1;
  }

  return text.length;
} // The number text names its country (owner C87, variant V4 of ui-control
// prototypes/phone-country-study.html#r3-variant): the code is the first group
// of the text and the flag follows it.
//   «+49 30 123456»     Germany, by the first group;
//   «+374 50…»          asks for +374, never for +3745;
//   «+7 7…», «+7 6…»    Kazakhstan; +7 otherwise Russia (countryFromNumber);
//   «8 9…»              Russia from any country: the trunk 8 becomes +7; a
//                       lone «8» waits for the next digit;
//   «903 …» (no «+»)    the current country's code goes in front;
//   «+ 30 123456»       the code was erased: no country, the number is kept.
// A code the person has finished gets one space after it, unless a longer
// code starts with it (+1 and +1242 Bahamas); after the code the national
// digits follow the country's pattern (formatByPattern). Digits are never cut.
// `patternFor(country)` gives the pattern where the field has its own (a
// fixed mask, the brackets style); the country's pattern otherwise.
// Returns {text, country, wait}; country null is an unknown code.


function readTypedNumber(root, value, current = null, {
  deleting = false,
  patternFor = null
} = {}) {
  let text = String(value ?? '');
  const options = root?.__sfCountryOptions?.length ? root.__sfCountryOptions : COUNTRY_ITEMS;
  if (!text.trim()) return {
    text,
    country: current,
    wait: false
  };

  const digitsOf = part => String(part || '').replace(/\D/gu, '');

  let digits = digitsOf(text);

  if (!text.trim().startsWith('+')) {
    if (digits === '8') return {
      text,
      country: current,
      wait: true
    };
    const trunk = /^89/u.test(digits) || current?.dialCode === '+7' && digits.length === 11 && digits[0] === '8';
    if (trunk) text = text.replace(/^(\s*)8/u, '$1+7');else if (current?.dialCode) text = `${current.dialCode} ${text.trimStart()}`;else text = `+${text.trimStart()}`;
    digits = digitsOf(text);
  }

  if (/^\s*\+(\s|$)/u.test(text) && digits) return {
    text,
    country: null,
    wait: false
  };
  const group = text.match(/^\s*\+(\d{1,4})[\s\-()]/u);
  let country = null;

  if (group) {
    const code = `+${group[1]}`;
    const matches = options.filter(item => item.dialCode === code);
    if (current && current.dialCode === code && (digits.length === group[1].length || code !== '+7')) country = current;else if (code === '+7') country = countryFromNumber(root, text);else country = matches.find(item => item.iso2 === SHARED_DIAL_CODES[code]) || matches[0] || null;
  } else {
    country = countryFromNumber(root, text);
    if (country && current && current.dialCode === country.dialCode && digits.length === digitsOf(country.dialCode).length) country = current;
  }

  if (!country || deleting) return {
    text,
    country,
    wait: false
  };
  const code = digitsOf(country.dialCode);

  if (digits.length === code.length) {
    // One space after a finished code: «+49» and «+49  » both read «+49 ».
    const longer = options.some(item => item.dialCode !== country.dialCode && digitsOf(item.dialCode).startsWith(code));
    if (!longer) text = `${text.trim()} `;
  } else if (digits.length > code.length) {
    // «+79031234567» and «+7 903 123 45 67» read «+7 903 123-45-67».
    const pattern = typeof patternFor === 'function' ? patternFor(country) : country.maskPattern;
    text = formatByPattern(text, country, pattern);
  }

  return {
    text,
    country,
    wait: false
  };
} // A code the text does not name: the flag is an empty frame, no row is the
// chosen one, the number stays as typed (owner C87).


function markCountryUnknown(root) {
  if (root.classList.contains('sf-country-code--unknown')) return;
  root.classList.add('sf-country-code--unknown');
  root.dataset.iso2 = '';
  root.dataset.dialCode = '';
  root.__sfCountrySelected = null;
  syncCodePlaceholder(root, getNodes(root).input, null);
  syncCountryAccessibility(root);
}

function syncDisabledState(root) {
  const {
    input,
    toggle
  } = getNodes(root);
  if (!input) return;
  const disabledByClass = root.classList.contains('disabled');
  const disabledByAttr = toBoolean(input.disabled, false);
  const disabled = disabledByClass || disabledByAttr;
  root.classList.toggle('disabled', disabled);

  if (toggle) {
    toggle.setAttribute('aria-disabled', disabled ? 'true' : 'false');
    toggle.tabIndex = disabled ? -1 : 0;
  }

  if (disabled) setOpenState(root, false);
  syncCountryAccessibility(root);
} // The code is locked in the text only where the person cannot choose another
// country (fixed-country); in every other field, a masked one too, the code is
// the start of the text the person edits and names the country (owner C87,
// readTypedNumber). A masked field locked it as well, so a pasted
// «+49 30 123456» was read as Russian digits, «+7 301 234-56», and the code
// could not be erased and typed again (RG-CC-1).


function getLockedPrefix(root, config) {
  if (!config?.showCode) return '';
  if (config.multiCountry) return '';
  const dialCode = String(root?.dataset?.dialCode || '').trim();
  if (!dialCode) return '';
  return `${dialCode} `;
}

function enforceDialCodePrefix(root, input, config) {
  if (!input) return;
  const prefix = getLockedPrefix(root, config);
  if (!prefix) return;
  const current = String(input.value || '');
  if (current.startsWith(prefix)) return;
  const localPart = extractLocalPart(current, root?.dataset?.dialCode || '');
  input.value = `${prefix}${localPart}`.trimEnd();
}

function keepCaretAfterPrefix(input, prefix) {
  if (!input || !prefix) return;
  const start = input.selectionStart ?? 0;
  const end = input.selectionEnd ?? 0;
  if (start >= prefix.length && end >= prefix.length) return;
  const safePos = prefix.length;
  input.setSelectionRange(safePos, safePos);
} // The pattern the typed text is laid out by: the field's own where it fixes
// one (fixed-mask with mask-pattern), the country's otherwise, in the field's
// mask style.


function countryTextPattern(config, country) {
  const base = !config?.useCountryMasks && config?.fixedMaskPattern ? config.fixedMaskPattern : country?.maskPattern;
  return normalizeMaskPatternByStyle(base, config?.maskStyle);
} // Where the text names the country (a masked field with a choice of
// countries, RG-CC-1), the mask follows the text, never the other way round:
// the country's mask lays out the number while the number fits it; with no
// country named (the code erased, an unknown code) or more digits than the
// pattern holds (another country's number pasted or typed over), the mask
// stands back and the text stays as typed -- a mask reads every digit as a
// slot of its pattern, so it put a German number into the Russian slots and
// cut what did not fit. Called before the mask's own input listener runs:
// a mask dropped here does not see this input event.


function patternSlots(pattern) {
  return (String(pattern || '').replace(/\\./gu, '').replace(/\{[^}]*\}/gu, '').match(/0/gu) || []).length;
}

function syncTextMask(root, input, config, country) {
  if (!config?.useMask) return;
  const text = String(input.value || '').trim();
  const digits = text.replace(/\D/gu, '');
  const pattern = country ? countryTextPattern(config, country) : ''; // A text that starts with another code than the country's is not laid out
  // by this country's pattern either.

  const ownCode = !text.startsWith('+') || digits.startsWith(String(country?.dialCode || '').replace(/\D/gu, ''));
  const wanted = pattern && ownCode && digits.length <= patternSlots(pattern) ? pattern : ''; // Asked for already: the mask is there, or on its way.

  if (wanted === (root.__sfCountryMaskPattern || '')) return;
  applyMaskForRoot(root, input, wanted, config);
} // A field without a placeholder of its own hints the chosen country's code
// (owner C87: «код «+994» стоит в начале номера»): an empty Azerbaijan field
// shows «+994», never another country's pattern. An unknown code hints «+».
// The placeholder the field wrote is remembered, so a later bind tells it
// from one the author gave.


const countryWrittenPlaceholders = new WeakMap();

function placeholderIsOwn(input) {
  const current = input.getAttribute('placeholder') || '';
  return !current || current === countryWrittenPlaceholders.get(input);
}

function writeCountryPlaceholder(input, text) {
  if (!input) return;
  countryWrittenPlaceholders.set(input, text);
  if (input.placeholder !== text) input.placeholder = text;
}

function syncCodePlaceholder(root, input, country) {
  if (!input || !root.__sfCountryOwnPlaceholder) return;
  writeCountryPlaceholder(input, country?.dialCode || '+');
}

function applyCountrySelection(root, country, source = 'runtime') {
  if (!root || !country) return;
  const {
    input,
    leftFlag
  } = getNodes(root);
  if (!input) return;
  const config = root.__sfCountryConfig || resolveConfig(root, input);
  const previousDialCode = root.dataset.dialCode || '';
  root.dataset.iso2 = country.iso2;
  root.dataset.dialCode = country.dialCode;
  root.dataset.maskPattern = country.maskPattern || '';
  root.classList.remove('sf-country-code--unknown');
  root.__sfCountryLast = country;
  const maskConfiguration = countryMaskConfiguration.get(root);
  if (maskConfiguration) maskConfiguration.selected = root.dataset.maskPattern;
  root.__sfCountrySelected = country;
  syncCodePlaceholder(root, input, country);

  if (config.showCode && leftFlag) {
    const flagNode = createFlagNode(country, config, false);
    const img = flagNode.querySelector('img');
    leftFlag.textContent = '';

    if (img) {
      leftFlag.append(img);
    } else {
      leftFlag.textContent = flagNode.textContent || '';
    }
  }

  if (source === 'item' || source === 'state') {
    // The national digits stay when another country is chosen, also from an
    // erased or half-typed code («+ 30…», «+3 30…»).
    const localPart = extractLocalPart(input.value, previousDialCode); // The previous country's mask must not consume events for the new prefix.

    applyMaskForRoot(root, input, '', config);
    const prefix = country.dialCode ? `${country.dialCode} ` : '';
    input.value = `${prefix}${localPart}`.trim();
    input.dispatchEvent(new Event('input', {
      bubbles: true
    }));
    input.dispatchEvent(new Event('change', {
      bubbles: true
    }));
  }

  if (config.useMask && config.showCode && config.multiCountry) {
    // The text names the country here: the mask lays the number out only
    // where the number fits it, and never cuts a digit (syncTextMask).
    syncTextMask(root, input, config, country);
  } else if (config.useMask) {
    const basePattern = config.useCountryMasks ? country.maskPattern : config.fixedMaskPattern || country.maskPattern;
    const pattern = normalizeMaskPatternByStyle(basePattern, config.maskStyle);
    applyMaskForRoot(root, input, pattern, config);
  } else {
    applyMaskForRoot(root, input, '', config);
  }

  syncCountryAccessibility(root);
  syncCountryRequired(root, input);
} // ─── The list: search, «Часто выбирают», the chosen row (owner C87) ─────────
// The rows stay where the template or the markup put them -- a Lit list must
// not be reordered under it -- and the list is a flex column, so the order a
// person sees is the rows' `order`: the frequent ones first under their
// heading, then «Все страны»; while searching only the matches, best first.


const RECENT_KEY = 'sf-input-country:recent';
const RECENT_MAX = 2;
const FREQUENT_MAX = 6;

function readRecentCountries() {
  try {
    const list = JSON.parse(globalThis.localStorage?.getItem(RECENT_KEY) || '[]');
    return Array.isArray(list) ? list.map(normalizeIso2).filter(Boolean).slice(0, RECENT_MAX) : [];
  } catch {
    return [];
  }
}

function rememberCountry(iso2) {
  const iso = normalizeIso2(iso2);
  if (!iso) return;

  try {
    globalThis.localStorage?.setItem(RECENT_KEY, JSON.stringify([iso, ...readRecentCountries().filter(code => code !== iso)].slice(0, RECENT_MAX)));
  } catch {
    /* storage refused: a private window keeps no history */
  }
} // The group is optional (owner, q-8794872748): without `preferred` there is
// none, not even the recent choices, and no locale names one by default.
// With it: up to two of the person's last choices, then the product's list,
// six rows at most; only countries the list has, each once.


function frequentCountries(config, items) {
  if (config.preferred === undefined) return [];
  const present = new Set(items.map(item => normalizeIso2(item.dataset.iso2)).filter(Boolean));
  return [...new Set([...readRecentCountries(), ...config.preferred])].filter(iso => present.has(iso)).slice(0, FREQUENT_MAX);
} // How well a row answers a query: its ISO code or its whole dial code first,
// then a dial code it starts, a name it starts (Russian or English), a word
// of a name, any part of a name; null is no match.


function countryMatchRank(item, query) {
  const q = String(query || '').trim().toLocaleLowerCase();
  if (!q) return 0;
  const iso = normalizeIso2(item.dataset.iso2).toLowerCase();
  const code = String(item.dataset.code || '').replace(/\D/gu, '');
  const known = getCountryByIso2(iso) || {};
  const shown = (item.querySelector(':scope > span')?.textContent || item.textContent).trim().replace(/\s*\(\+?[\d\s-]*\)\s*$/u, '').toLocaleLowerCase();
  const names = [shown, known.nameRu, countryName(known, 'ru'), known.nameEn].filter(Boolean).map(name => String(name).toLocaleLowerCase());
  const digits = q.replace(/\D/gu, '');
  if (iso && q === iso) return 1;

  if (/^\+?[\d\s]+$/u.test(q) && digits) {
    if (code === digits) return 1;
    return code.startsWith(digits) ? 2 : null;
  }

  if (names.some(name => name.startsWith(q))) return 3;
  if (names.some(name => name.split(/[\s-]+/u).some(word => word.startsWith(q)))) return 4;
  if (names.some(name => name.includes(q))) return 5;
  return null;
}

function ensureCountryGroups(itemsWrap) {
  const heads = {};

  for (const kind of ['frequent', 'all']) {
    let head = itemsWrap.querySelector(`:scope > .sf-country-code-group[data-group="${kind}"]`);

    if (!head) {
      head = document.createElement('span');
      head.className = 'sf-country-code-group';
      head.dataset.group = kind;
      itemsWrap.append(head);
    } // A heading drawn between the rows; the listbox holds options only.


    head.setAttribute('aria-hidden', 'true');
    heads[kind] = head;
  }

  return heads;
} // A search that finds no country says so (decision C09, as sf-menu's
// search-empty): one line of plain text where the rows would be, in the
// page's words; the search field is described by it while it shows.


function syncCountryEmpty(root, itemsWrap, search, empty) {
  let row = itemsWrap.querySelector(':scope > .sf-country-code-empty');
  if (!row && !empty) return;

  if (!row) {
    row = document.createElement('span');
    row.className = 'sf-country-code-empty'; // Read through the search field's description, not as a row of the listbox.

    row.setAttribute('aria-hidden', 'true');
    itemsWrap.append(row);
  }

  row.textContent = (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(COUNTRY_CODE_TEXT, 'nothingFound', root, 'sf-input-country');
  row.hidden = !empty;
  if (!search) return;
  if (empty) search.setAttribute('aria-describedby', ensureCountryId(row));else if (search.getAttribute('aria-describedby') === row.id) search.removeAttribute('aria-describedby');
}

function arrangeCountryList(root) {
  const {
    itemsWrap,
    items
  } = getNodes(root);
  const config = root?.__sfCountryConfig;
  if (!itemsWrap || !config?.multiCountry || !config.showCode) return;
  const query = root.__sfCountryQuery || '';
  const frequent = query ? [] : frequentCountries(config, items);
  const heads = ensureCountryGroups(itemsWrap);
  heads.frequent.textContent = (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(COUNTRY_CODE_TEXT, 'frequent', root, 'sf-input-country');
  heads.all.textContent = (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(COUNTRY_CODE_TEXT, 'allCountries', root, 'sf-input-country');
  heads.frequent.hidden = heads.all.hidden = !frequent.length;
  heads.frequent.style.order = '0';
  heads.all.style.order = String(FREQUENT_MAX + 1);

  for (const item of items) {
    const at = frequent.indexOf(normalizeIso2(item.dataset.iso2));
    const rank = query ? countryMatchRank(item, query) : 0;
    item.hidden = rank === null;
    if (at >= 0) item.dataset.group = 'frequent';else delete item.dataset.group;
    item.style.order = query ? String(rank ?? 0) : String(at >= 0 ? at + 1 : FREQUENT_MAX + 2);
  }

  syncCountryEmpty(root, itemsWrap, root.querySelector('.sf-country-code-search input'), Boolean(query) && items.every(item => item.hidden));
} // The rows in the order a person sees them.


function visibleCountryItems(items) {
  return items.filter(item => !item.hidden).map((item, index) => [Number(item.style.order) || 0, index, item]).sort((a, b) => a[0] - b[0] || a[1] - b[1]).map(([,, item]) => item);
} // The list opens on the chosen country, not at its top.


function revealChosenCountry(root) {
  const {
    itemsWrap,
    items
  } = getNodes(root);
  const chosen = items.find(item => item.getAttribute('aria-selected') === 'true' && !item.hidden);
  if (!itemsWrap || !chosen) return;
  const box = itemsWrap.getBoundingClientRect(),
        row = chosen.getBoundingClientRect();
  if (row.top >= box.top && row.bottom <= box.bottom) return;
  itemsWrap.scrollTo({
    top: itemsWrap.scrollTop + row.top - box.top - (itemsWrap.clientHeight - row.height) / 2,
    behavior: 'instant'
  });
} // The search header of the list (C06, as sf-dropdown's): a span, not a label
// -- the root is the label of the phone input -- with the search glyph and
// the field.


function ensureCountrySearch(root, config) {
  const {
    list,
    itemsWrap
  } = getNodes(root);
  if (!list || !itemsWrap || !config.multiCountry || !config.showCode) return null;
  let head = list.querySelector(':scope > .sf-country-code-search');

  if (!head) {
    head = document.createElement('span');
    head.className = 'sf-country-code-search';
    const icon = document.createElement('i');
    icon.className = 'sf-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = 'search';
    const field = document.createElement('input');
    field.type = 'search';
    field.autocomplete = 'off';
    field.spellcheck = false;
    field.setAttribute('enterkeyhint', 'search');
    head.append(icon, field);
    list.insertBefore(head, list.firstChild);
  }

  const field = head.querySelector('input');
  const word = (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(COUNTRY_CODE_TEXT, 'searchPlaceholder', root, 'sf-input-country');
  field.placeholder = word;
  field.setAttribute('aria-label', word);
  field.setAttribute('aria-controls', ensureCountryId(itemsWrap));
  return field;
}

function bindCountryCode(root, {
  resetCountry = false,
  countries,
  maskPattern
} = {}) {
  // The phone field stands on the field ladder (field-size.js): 1/3 and 3 are
  // its own steps, no class to move.
  // Both ordinary and Smart bundles may contain this module. Keep reattachment
  // with the original owner of WeakMap defaults and authored configuration.
  if (root?.__sfCountryCodeBind && root.__sfCountryCodeBind !== bindCountryCode) {
    return root.__sfCountryCodeBind(root, {
      resetCountry,
      countries,
      maskPattern
    });
  }

  if (!root || typeof root.__sfCountryCodeInput === 'function') return;
  const {
    input,
    toggle,
    leftFlag
  } = getNodes(root);
  if (!input) return;
  root.__sfCountryCodeBind = bindCountryCode;
  root.__sfCountryCodeSetState = setCountryCodeState;
  const config = resolveConfig(root, input);
  const previousMask = countryMaskConfiguration.get(root);
  const fixedPattern = maskPattern !== undefined ? String(maskPattern).trim() : previousMask && config.fixedMaskPattern === previousMask.selected ? previousMask.fixed : config.fixedMaskPattern;
  config.fixedMaskPattern = fixedPattern;
  countryMaskConfiguration.set(root, {
    fixed: fixedPattern,
    selected: root.dataset.maskPattern
  });
  root.__sfCountryConfig = config;
  root.__sfCountryOwnPlaceholder = placeholderIsOwn(input);
  renderDatasetItems(root, config);
  applyDropdownViewport(root, 8);
  const nodes = getNodes(root);
  const items = nodes.items;
  bindCountryViewport(root);
  root.__sfCountryOptions = countries === undefined ? items.map(item => readCountryItem(item, config.locale)) : normalizeCountriesList(countries, config.locale, config.maxItems);
  const search = ensureCountrySearch(root, config);

  if (!config.showCode && toggle) {
    toggle.classList.add('hidden');
  } else if (toggle) {
    toggle.classList.remove('hidden');
  }

  if (!config.multiCountry) {
    root.classList.add('sf-country-code--fixed-dial-code');
    root.classList.remove('open');
    nodes.list?.classList?.add('hidden');
    const toggleIcon = toggle?.querySelector?.('.sf-icon');
    if (toggleIcon) toggleIcon.remove();
  } else {
    root.classList.remove('sf-country-code--fixed-dial-code');
    nodes.list?.classList?.remove('hidden');
  }

  const initialCountry = resolveInitialCountry(config, root, input.value || input.getAttribute('value') || '');
  if (resetCountry || !countryResetDefaults.has(input)) countryResetDefaults.set(input, initialCountry);

  if (initialCountry) {
    applyCountrySelection(root, initialCountry, 'init');
  } else if (leftFlag) {
    leftFlag.textContent = '';
  } // Opened by the person, the cursor goes to the search (owner C87); a list
  // opened by markup or from code takes no focus.


  const focusSearch = () => search?.focus({
    preventScroll: true
  });

  const onToggleClick = event => {
    event.preventDefault();
    if (!config.multiCountry || input.disabled || root.classList.contains('disabled')) return;
    const willOpen = !root.classList.contains('open');
    closeAllCountryCodes(root);
    setOpenState(root, willOpen);

    if (willOpen) {
      prefetchVisibleFlags(root);
      focusSearch();
    }
  };

  const onToggleKeydown = event => {
    if (event.altKey || event.ctrlKey || event.metaKey || input.disabled || root.classList.contains('disabled') || !config.multiCountry) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onToggleClick(event);
      if (root.classList.contains('open') && !search) focusItem();
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!root.classList.contains('open')) onToggleClick(event);
      if (search) focusSearch();else focusItem(event.key === 'ArrowUp' ? -1 : undefined);
    } // Escape over an open list closes the list and is consumed; it closed the
    // list and then, travelling on, the drawer the field sat in.


    if (event.key === 'Escape' && root.classList.contains('open')) {
      event.preventDefault();
      event.stopPropagation();
      setOpenState(root, false);
    }
  };

  const onDocumentClick = event => {
    if (!root.contains(event.target)) {
      setOpenState(root, false);
    }
  };

  const onItemClick = event => {
    event.preventDefault();
    if (input.disabled || root.classList.contains('disabled') || !config.multiCountry) return;
    const item = event.currentTarget;
    if (item.getAttribute('aria-disabled') === 'true' || item.classList.contains('disabled')) return;
    const selected = readCountryItem(item, config.locale);
    if (!selected) return;
    applyCountrySelection(root, selected, 'item');
    rememberCountry(selected.iso2);
    setOpenState(root, false); // Preserve pointer workflow: after choosing a code, continue typing the phone.
    // Keyboard confirmation returns to the selector instead.

    (event.type === 'keydown' ? toggle : input)?.focus({
      preventScroll: true
    });
  };

  const enabledItems = () => visibleCountryItems(items).filter(item => item.getAttribute('aria-disabled') !== 'true' && !item.classList.contains('disabled'));

  const focusItem = index => {
    const choices = enabledItems();
    const selectedIndex = choices.findIndex(item => item.getAttribute('aria-selected') === 'true');
    const next = index === undefined ? Math.max(0, selectedIndex) : index < 0 ? choices.length - 1 : Math.min(index, choices.length - 1);
    items.forEach(item => {
      item.tabIndex = -1;
    });
    const item = choices[next];
    if (!item) return;
    item.tabIndex = 0;
    item.focus({
      preventScroll: true
    }); // Scroll only the options viewport; focusing must not move the whole page.

    const wrap = nodes.itemsWrap;

    if (wrap) {
      const box = wrap.getBoundingClientRect(),
            option = item.getBoundingClientRect();
      if (option.top < box.top) wrap.scrollTo({
        top: wrap.scrollTop - (box.top - option.top),
        behavior: 'instant'
      });else if (option.bottom > box.bottom) wrap.scrollTo({
        top: wrap.scrollTop + (option.bottom - box.bottom),
        behavior: 'instant'
      });
    }
  };

  let typed = '',
      typedTime = 0;

  const onItemKeydown = event => {
    if (event.altKey || event.ctrlKey || event.metaKey || input.disabled || root.classList.contains('disabled')) return;
    const choices = enabledItems(),
          current = choices.indexOf(event.currentTarget);

    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      setOpenState(root, false);
      toggle?.focus({
        preventScroll: true
      });
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      onItemClick(event);
      return;
    }

    if (event.key === 'ArrowUp' && current === 0 && search) {
      event.preventDefault();
      focusSearch();
      return;
    }

    if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      const index = event.key === 'Home' ? 0 : event.key === 'End' ? choices.length - 1 : Math.max(0, current + (event.key === 'ArrowDown' ? 1 : -1));
      focusItem(index);
      return;
    }

    if (event.key.length === 1) {
      const now = performance.now();
      typed = now - typedTime > 700 ? event.key : typed + event.key;
      typedTime = now;
      const query = [...typed].every(char => char === typed[0]) ? typed[0] : typed;
      const ordered = [...choices.slice(current + 1), ...choices.slice(0, current + 1)];
      const found = ordered.find(item => (item.querySelector('span')?.textContent || item.textContent).trim().toLocaleLowerCase().startsWith(query.toLocaleLowerCase()));

      if (found) {
        event.preventDefault();
        focusItem(choices.indexOf(found));
      }
    }
  };

  const onFocusOut = event => {
    if (!root.contains(event.relatedTarget)) setOpenState(root, false);
  };

  const onInput = event => {
    if (getLockedPrefix(root, config) || !config.showCode || !config.multiCountry) {
      enforceDialCodePrefix(root, input, config);
      keepCaretAfterPrefix(input, getLockedPrefix(root, config));
      syncCountryRequired(root, input);
      return;
    } // The text decides the country (owner C87, readTypedNumber).


    const deleting = /^delete/u.test(event?.inputType || '');
    const before = input.value;
    const read = readTypedNumber(root, before, root.__sfCountryLast || root.__sfCountrySelected || null, {
      deleting,
      patternFor: country => countryTextPattern(config, country)
    });

    if (read.text !== before) {
      const caret = input.selectionStart ?? before.length;
      const atEnd = caret >= before.length;
      input.value = read.text; // Laid out again, the caret stays after the same digit it followed.

      const at = atEnd ? read.text.length : caretAfterDigits(read.text, before.slice(0, caret).replace(/\D/gu, '').length);
      if (document.activeElement === input) input.setSelectionRange(at, at);
    }

    if (!read.wait && before.trim()) {
      if (read.country) {
        if (read.country !== root.__sfCountrySelected) applyCountrySelection(root, read.country, 'text');else {
          root.classList.remove('sf-country-code--unknown'); // A live mask keeps its length: a digit past the pattern is refused,
          // as before. A mask that stood back comes again once the number fits.

          if (!root.__sfCountryMask) syncTextMask(root, input, config, read.country);
        }
      } else {
        // No country: the mask must not put the old code back (RG-CC-1).
        syncTextMask(root, input, config, null);
        markCountryUnknown(root);
      }
    }

    syncCountryRequired(root, input);
  };

  const onPaste = event => {
    if (!getLockedPrefix(root, config) && config.showCode && config.multiCountry) {
      // A whole number pasted -- «+49 30 123456», «8 903 123-45-67» -- takes
      // the field's place; digits alone go where the caret is. The input
      // event that follows reads it.
      const text = event.clipboardData?.getData('text') ?? '';
      if (!text.trim()) return;
      const whole = /^\s*\+/u.test(text) || text.replace(/\D/gu, '').length >= 10;

      if (whole) {
        event.preventDefault();
        input.value = text.trim();
        input.dispatchEvent(new Event('input', {
          bubbles: true
        }));
      }

      return;
    }

    requestAnimationFrame(() => {
      enforceDialCodePrefix(root, input, config);
      keepCaretAfterPrefix(input, getLockedPrefix(root, config));
    });
  }; // The locked code (fixed-country, use-mask) is not the person's to edit;
  // picking another country changes it. An edit that reaches into it applies
  // to the number after it only: a digit typed before it goes after it,
  // select-all and a digit keep the code and replace the number, select-all
  // and Backspace or Delete clear the number and leave the code. The mask
  // used to read the code's digits as slots, so a digit typed at the start
  // pushed the code's own digit into the number.


  const onKeydownInput = event => {
    const prefix = getLockedPrefix(root, config);
    if (!prefix) return;
    if (!['Backspace', 'Delete'].includes(event.key)) return;
    const start = input.selectionStart ?? 0;
    const end = input.selectionEnd ?? start;
    if (start !== end) return;

    if (event.key === 'Backspace' && start <= prefix.length || event.key === 'Delete' && start < prefix.length) {
      event.preventDefault();
      keepCaretAfterPrefix(input, prefix);
    }
  };

  const onBeforeInput = event => {
    const prefix = getLockedPrefix(root, config);
    if (!prefix || event.isComposing) return;
    const type = String(event.inputType || '');
    const start = input.selectionStart ?? 0;
    const end = input.selectionEnd ?? start;
    const at = Math.min(prefix.length, input.value.length);
    let text;

    if (type.startsWith('delete')) {
      const backward = /Backward/u.test(type);
      const [from, to] = start !== end ? [start, end] : backward ? [start - 1, start] : [start, start + 1];
      if (from >= prefix.length) return;
      event.preventDefault();

      if (to <= at) {
        keepCaretAfterPrefix(input, prefix);
        return;
      }

      text = '';
    } else if (type.startsWith('insert')) {
      if (start >= prefix.length) return;
      text = event.data ?? event.dataTransfer?.getData?.('text/plain') ?? null;
      if (text === null) return; // A whole number pasted over the code brings its own code: the number
      // after it is what goes in.

      if (/^\s*\+/u.test(text)) text = extractLocalPart(text, root.dataset.dialCode || '');
      event.preventDefault();
    } else {
      return;
    }

    input.setRangeText(text, at, Math.max(end, at), 'end');
    input.dispatchEvent(new InputEvent('input', {
      bubbles: true,
      inputType: type,
      data: text || null
    }));
  };

  if (toggle) {
    toggle.addEventListener('click', onToggleClick);
    toggle.addEventListener('keydown', onToggleKeydown);
    toggle.setAttribute('role', 'button');
  }

  const onSearchInput = () => {
    root.__sfCountryQuery = search.value;
    arrangeCountryList(root);
    nodes.itemsWrap?.scrollTo({
      top: 0,
      behavior: 'instant'
    });
  };

  const onSearchKeydown = event => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      focusItem(0);
      return;
    }

    if (event.key === 'Enter') {
      // Enter takes the best match, and never submits the form.
      event.preventDefault();
      const first = enabledItems()[0];
      if (root.__sfCountryQuery && first) onItemClick({
        type: 'keydown',
        currentTarget: first,

        preventDefault() {}

      });
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      setOpenState(root, false);
      toggle?.focus({
        preventScroll: true
      });
    }
  }; // The root is the phone input's label: a press on the search glyph would
  // move the cursor to the number.


  const onSearchHeadClick = event => {
    if (event.target !== search) {
      event.preventDefault();
      focusSearch();
    }
  };

  if (search) {
    search.addEventListener('input', onSearchInput);
    search.addEventListener('keydown', onSearchKeydown);
    search.parentElement?.addEventListener('click', onSearchHeadClick);

    root.__sfCountrySearchListeners = () => {
      search.removeEventListener('input', onSearchInput);
      search.removeEventListener('keydown', onSearchKeydown);
      search.parentElement?.removeEventListener('click', onSearchHeadClick);
    };
  }

  input.addEventListener('input', onInput);
  input.addEventListener('paste', onPaste);
  input.addEventListener('keydown', onKeydownInput);
  input.addEventListener('beforeinput', onBeforeInput);
  items.forEach(item => {
    item.addEventListener('click', onItemClick);
    item.addEventListener('keydown', onItemKeydown);
  });
  root.addEventListener('focusout', onFocusOut);
  document.addEventListener('click', onDocumentClick);
  root.__sfCountryCodeToggleClick = onToggleClick;
  root.__sfCountryCodeToggleKeydown = onToggleKeydown;
  root.__sfCountryCodeDocClick = onDocumentClick;
  root.__sfCountryCodeItemClick = onItemClick;
  root.__sfCountryCodeItemKeydown = onItemKeydown;
  root.__sfCountryCodeFocusOut = onFocusOut;
  root.__sfCountryCodeInput = onInput;
  root.__sfCountryCodePaste = onPaste;
  root.__sfCountryCodeInputKeydown = onKeydownInput;
  root.__sfCountryCodeBeforeInput = onBeforeInput;
  root.__sfCountryReleaseReset = (0,_form_reset_helper__WEBPACK_IMPORTED_MODULE_4__.bindFormReset)(input, () => {
    const country = countryResetDefaults.get(input);
    if (country) applyCountrySelection(root, country, 'reset');
    setOpenState(root, false);
    syncCountryRequired(root, input);
  });
  root.__sfCountryRequiredObserver = new MutationObserver(() => {
    syncCountryRequired(root, input);
    syncCountryFieldReferences(root, input);
  });

  root.__sfCountryRequiredObserver.observe(root, {
    attributes: true,
    attributeFilter: ['required', 'aria-label', 'aria-labelledby', 'aria-describedby', 'id'],
    childList: true,
    characterData: true,
    subtree: true
  });

  root.dataset[COUNTRY_CODE_BOUND_FLAG] = '1';
  syncDisabledState(root); // Drawn open (the class open, the element's open): the same open path as a
  // press, without the focus.

  if (root.classList.contains('open')) setOpenState(root, true);else root.__sfCountryViewport?.(false);
}

function unbindCountryCode(root) {
  if (!root || typeof root.__sfCountryCodeInput !== 'function') return;
  const {
    input,
    toggle,
    items
  } = getNodes(root);
  root.__sfCountryReleaseReset?.();
  delete root.__sfCountryReleaseReset;
  root.__sfCountryRequiredObserver?.disconnect();
  delete root.__sfCountryRequiredObserver;
  root.__sfCountryViewport?.(false);
  delete root.__sfCountryViewport; // Removed while open, it must not leave the mark raised for the whole page.

  (0,_core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_9__.holdOpenSurfaceMark)(root, false);

  if (toggle && root.__sfCountryCodeToggleClick) {
    toggle.removeEventListener('click', root.__sfCountryCodeToggleClick);
  }

  if (toggle && root.__sfCountryCodeToggleKeydown) {
    toggle.removeEventListener('keydown', root.__sfCountryCodeToggleKeydown);
  }

  if (root.__sfCountryCodeDocClick) {
    document.removeEventListener('click', root.__sfCountryCodeDocClick);
  }

  items.forEach(item => {
    if (root.__sfCountryCodeItemKeydown) item.removeEventListener('keydown', root.__sfCountryCodeItemKeydown);

    if (root.__sfCountryCodeItemClick) {
      item.removeEventListener('click', root.__sfCountryCodeItemClick);
    }
  });
  if (root.__sfCountryCodeFocusOut) root.removeEventListener('focusout', root.__sfCountryCodeFocusOut);

  if (input && root.__sfCountryCodeInput) {
    input.removeEventListener('input', root.__sfCountryCodeInput);
  }

  if (input && root.__sfCountryCodePaste) {
    input.removeEventListener('paste', root.__sfCountryCodePaste);
  }

  if (input && root.__sfCountryCodeInputKeydown) {
    input.removeEventListener('keydown', root.__sfCountryCodeInputKeydown);
  }

  if (input && root.__sfCountryCodeBeforeInput) {
    input.removeEventListener('beforeinput', root.__sfCountryCodeBeforeInput);
  }

  if (root.__sfCountryMask) {
    window.SF?.Mask?.destroy?.(root.__sfCountryMask);
  }

  root.__sfCountrySearchListeners?.();
  delete root.__sfCountrySearchListeners;
  delete root.__sfCountryQuery;
  delete root.__sfCountryLast;
  delete root.__sfCountryCodeToggleClick;
  delete root.__sfCountryCodeToggleKeydown;
  delete root.__sfCountryCodeDocClick;
  delete root.__sfCountryCodeItemClick;
  delete root.__sfCountryCodeItemKeydown;
  delete root.__sfCountryCodeFocusOut;
  delete root.__sfCountryCodeInput;
  delete root.__sfCountryCodePaste;
  delete root.__sfCountryCodeInputKeydown;
  delete root.__sfCountryCodeBeforeInput;
  delete root.__sfCountryMask;
  delete root.__sfCountryMaskToken;
  delete root.__sfCountryMaskPattern;
  delete root.__sfCountrySelected;
  delete root.__sfCountryConfig;
  delete root.__sfCountryOptions;
  delete root.dataset[COUNTRY_CODE_BOUND_FLAG];
}

function initExistingCountryCodes(target = document) {
  target.querySelectorAll(COUNTRY_CODE_SELECTOR).forEach(root => {
    // The Smart owner binds its own root after render. Ordinary auto-init must
    // not claim it first with a different bundled module's reset state.
    if (!root.closest((0,_core_js_tag_aliases_js__WEBPACK_IMPORTED_MODULE_10__.tagSelector)('sf-input-country'))) bindCountryCode(root);
  });
}

function setCountryCodeState(target, state = {}) {
  const root = target instanceof HTMLElement ? target.closest(COUNTRY_CODE_SELECTOR) || target : null;
  if (!root) return false;

  if (root.__sfCountryCodeSetState && root.__sfCountryCodeSetState !== setCountryCodeState) {
    return root.__sfCountryCodeSetState(root, state);
  }

  const {
    input
  } = getNodes(root);
  if (!input) return false;

  if (Object.prototype.hasOwnProperty.call(state, 'disabled')) {
    const disabled = toBoolean(state.disabled, false);
    input.disabled = disabled;
    root.classList.toggle('disabled', disabled);
    syncDisabledState(root);
  }

  if (Object.prototype.hasOwnProperty.call(state, 'active')) {
    setOpenState(root, toBoolean(state.active, false));
  }

  if (Object.prototype.hasOwnProperty.call(state, 'open')) {
    setOpenState(root, toBoolean(state.open, false));
  }

  if (Object.prototype.hasOwnProperty.call(state, 'value')) {
    input.value = String(state.value ?? '');
    input.dispatchEvent(new Event('input', {
      bubbles: true
    }));
    input.dispatchEvent(new Event('change', {
      bubbles: true
    }));
  }

  if (Object.prototype.hasOwnProperty.call(state, 'iso2')) {
    const country = resolveCountry(root, state.iso2);
    if (country) applyCountrySelection(root, country, 'state');
  }

  if (Object.prototype.hasOwnProperty.call(state, 'dialCode')) {
    const country = resolveCountry(root, '', state.dialCode);
    if (country) applyCountrySelection(root, country, 'state');
  }

  return true;
}

class CountryCode extends _core_js_ComponentObserver__WEBPACK_IMPORTED_MODULE_0__.ComponentObserver {
  static componentName = 'CountryCode';
  html = null;

  constructor(props) {
    super(props);
    const {
      size = '1',
      label = '',
      required = false,
      name = '',
      form = '',
      hint = '',
      value = '',
      placeholder = '',
      disabled = false,
      active = false,
      open = active,
      countries = [],
      locale = 'ru',
      useMask = false,
      useCountryMasks = true,
      showCode = true,
      maskStyle = 'native',
      multiCountry = true,
      iso2 = '',
      dialCode = '',
      maskPattern = '',
      flagBase = '',
      lazyFlags = true,
      showMaskPlaceholder = false,
      maskPlaceholderChar = '_',
      maxItems = 0,
      preferred
    } = this.params || {};
    const className = this.attrs.class || this.attrs.className;
    this.template = document.createElement('label');
    if (this.id) this.template.id = this.id;
    this.template.classList.add('sf-country-code', `sf-country-code--size-${(0,_field_size__WEBPACK_IMPORTED_MODULE_7__.ladderSize)(size)}`);
    if (toBoolean(disabled)) this.template.classList.add('disabled');
    if (toBoolean(open)) this.template.classList.add('open');

    if (className) {
      this.template.classList.add(...`${className}`.split(' ').filter(Boolean));
    }

    this.template.dataset.locale = String(locale);
    this.template.dataset.useMask = String(toBoolean(useMask, false));
    this.template.dataset.useCountryMasks = String(toBoolean(useCountryMasks, true));
    this.template.dataset.showCode = String(toBoolean(showCode, true));
    this.template.dataset.maskStyle = String(maskStyle).toLowerCase() === 'brackets' ? 'brackets' : 'native';
    this.template.dataset.multiCountry = String(toBoolean(multiCountry, true));
    this.template.dataset.lazyFlags = String(toBoolean(lazyFlags, true));
    this.template.dataset.showMaskPlaceholder = String(toBoolean(showMaskPlaceholder, false));
    this.template.dataset.maskPlaceholderChar = String(maskPlaceholderChar || '_');
    if (iso2) this.template.dataset.iso2 = normalizeIso2(iso2);
    if (dialCode) this.template.dataset.dialCode = String(dialCode);
    if (maskPattern) this.template.dataset.maskPattern = String(maskPattern);
    if (flagBase) this.template.dataset.flagBase = String(flagBase).replace(/\/$/, '');
    if (Number(maxItems) > 0) this.template.dataset.maxItems = String(Number(maxItems));
    if (preferred !== undefined) this.template.dataset.preferred = Array.isArray(preferred) ? preferred.join(',') : String(preferred);
    const labelWrap = document.createElement('span');
    labelWrap.classList.add('sf-country-code-label');
    const labelText = document.createElement('span');
    labelText.classList.add('sf-country-code-text');
    labelText.textContent = String(label);
    labelWrap.append(labelText);

    if (toBoolean(required, false)) {
      const requiredMark = document.createElement('span');
      requiredMark.classList.add('sf-country-code-required');
      requiredMark.textContent = '*';
      labelWrap.append(requiredMark);
    }

    const field = document.createElement('span');
    field.classList.add('sf-country-code-field');
    const left = document.createElement('span');
    left.classList.add('sf-country-code-left');
    const flag = document.createElement('div');
    flag.classList.add('sf-country-code-flag-icon');
    flag.setAttribute('aria-hidden', 'true');
    const icon = document.createElement('i');
    icon.classList.add('sf-icon', 'sf-country-code-caret');
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = 'arrow_drop_down';
    left.append(flag, icon);
    const input = document.createElement('input');
    input.type = 'tel';
    input.name = String(name);
    if (form) input.setAttribute('form', String(form));
    input.required = toBoolean(required, false);
    input.defaultValue = String(value ?? '');
    input.placeholder = String(placeholder ?? '');
    input.disabled = toBoolean(disabled, false);
    field.append(left, input);
    this.template.append(labelWrap, field);
    const sourceCountries = normalizeCountriesList(countries, locale, maxItems);

    if (sourceCountries.length) {
      const list = document.createElement('span');
      list.classList.add('sf-country-code-list');
      const itemsWrap = document.createElement('span');
      itemsWrap.classList.add('sf-country-code-items', 'flex', 'flex-col');
      sourceCountries.forEach(country => {
        const item = document.createElement('span');
        item.classList.add('sf-country-code-item');
        if (country?.iso2) item.dataset.iso2 = normalizeIso2(country.iso2);

        if (country?.dialCode || country?.code) {
          item.dataset.code = String(country.dialCode || country.code);
        }

        if (country?.maskPattern !== undefined) item.dataset.maskPattern = String(country.maskPattern || '');
        const itemFlag = createFlagNode({
          iso2: country?.iso2,
          flagEmoji: country?.flagEmoji || ''
        }, {
          flagBase: this.template.dataset.flagBase || resolveDefaultFlagBase(),
          lazyFlags: toBoolean(this.template.dataset.lazyFlags, true)
        }, true);
        const text = document.createElement('span');

        if (country?.label) {
          text.textContent = String(country.label);
        } else {
          const fallbackLabel = countryName(country, locale) || country?.dialCode || '';
          const fallbackDial = country?.dialCode || country?.code || '';
          text.textContent = fallbackDial ? `${fallbackLabel} (${fallbackDial})` : fallbackLabel;
        }

        item.append(itemFlag, text);
        this.applyLayoutUtilities(item, '.sf-country-code .sf-country-code-item');
        this.applyLayoutUtilities(itemFlag, '.sf-country-code .sf-country-code-flag');
        itemsWrap.append(item);
      });
      list.append(itemsWrap);
      this.template.append(list);
    }

    if (hint) {
      const hintWrap = document.createElement('span');
      hintWrap.classList.add('sf-country-code-hint');
      hintWrap.textContent = String(hint);
      this.template.append(hintWrap);
    }

    this.applyLayoutUtilities(this.template, '.sf-country-code');
    this.applyLayoutUtilities(labelWrap, '.sf-country-code .sf-country-code-label');
    this.applyLayoutUtilities(field, '.sf-country-code .sf-country-code-field');
    this.applyLayoutUtilities(left, '.sf-country-code .sf-country-code-left');
    this.applyLayoutUtilities(input, '.sf-country-code .sf-country-code-field input');
    this.applyLayoutUtilities(flag, '.sf-country-code .sf-country-code-flag-icon');
  }

  init() {
    bindCountryCode(this.template, {
      maskPattern: this.params?.maskPattern || ''
    });
  }

  destroyInternal() {
    unbindCountryCode(this.template);
  }

}

CountryCode.utilityMap = _json_country_code_utility_json__WEBPACK_IMPORTED_MODULE_2__;
(0,_register_helper__WEBPACK_IMPORTED_MODULE_1__["default"])('CountryCode', CountryCode);

if (typeof window !== 'undefined') {
  window.SF = window.SF || {};
  window.SF.CountryCode = window.SF.CountryCode || {};
  window.SF.CountryCode.setState = setCountryCodeState;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initExistingCountryCodes());
} else {
  initExistingCountryCodes();
}

const countryCodeObserver = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    mutation.removedNodes.forEach(node => {
      if (!(node instanceof Element)) return;
      const roots = [...node.querySelectorAll(COUNTRY_CODE_SELECTOR)];
      if (node.matches(COUNTRY_CODE_SELECTOR)) roots.unshift(node);

      for (const root of roots) if (!root.isConnected && !root.closest((0,_core_js_tag_aliases_js__WEBPACK_IMPORTED_MODULE_10__.tagSelector)('sf-input-country'))) unbindCountryCode(root);
    });
    mutation.addedNodes.forEach(node => {
      if (!(node instanceof Element)) return;

      if (node.matches?.(COUNTRY_CODE_SELECTOR) && !node.closest((0,_core_js_tag_aliases_js__WEBPACK_IMPORTED_MODULE_10__.tagSelector)('sf-input-country'))) {
        bindCountryCode(node);
      }

      initExistingCountryCodes(node);
    });
  });
});
countryCodeObserver.observe(document.documentElement, {
  childList: true,
  subtree: true
});

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "e138a730fd7c"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createFieldContract: () => (/* binding */ createFieldContract),
/* harmony export */   syncFieldContract: () => (/* binding */ syncFieldContract)
/* harmony export */ });
/* harmony import */ var _core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("e92fd2d1a38c");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var _core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_0__);
 // A field's ids come from its instance's role path (standard 1.3.8 §7.1.1;
// simai/ui-source#41), never from a counter: core/js/instance-path.js.

const fieldIdentities = new WeakMap(); // The bases the page's fields hold, on a page-wide table (SF.__fieldIds):
// every bundle that carries this file has its own module copy, so a table
// here would be one per bundle. An id is kept per instance, and a path in
// document order is read when the instance first settles, so an instance
// that settles later in front of it reads the same index: sf-mail-library's
// and sf-mail-letters' search fields were both sf-input-1--control (Mail set
// 1.0.0, GB20). A base another connected instance holds, or that an element
// outside this instance already carries, takes the next free «-<n>».

function claimedBases() {
  const sf = globalThis.SF ||= {};

  if (!(sf.__fieldIds instanceof Map)) {
    Object.defineProperty(sf, '__fieldIds', {
      value: new Map(),
      configurable: true
    });
  }

  return sf.__fieldIds;
}

function heldElsewhere(owner, base, claims) {
  const holder = claims.get(base)?.deref?.();
  if (holder && holder !== owner && holder.isConnected && holder.ownerDocument === owner.ownerDocument) return true;
  const taken = owner?.ownerDocument?.getElementById?.(`${base}--control`);
  return Boolean(taken && taken !== owner && !owner.contains?.(taken));
}

function freeBase(owner, path) {
  const base = (0,_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_0__.partId)(path);
  if (!(0,_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_0__.pathIsSettled)(owner) || typeof globalThis.WeakRef !== 'function') return base;
  const claims = claimedBases();
  let free = base;

  for (let n = 2; heldElsewhere(owner, free, claims); n += 1) free = `${base}-${n}`;

  claims.set(free, new globalThis.WeakRef(owner));
  return free;
}

function nextIdentity(owner, prefix) {
  if (owner && fieldIdentities.has(owner)) return fieldIdentities.get(owner);
  const base = freeBase(owner, (0,_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_0__.instancePath)(owner, {
    kind: prefix
  }));
  const identity = {
    base,
    controlId: `${base}--control`,
    messageId: `${base}--message`
  }; // An instance not yet in the page has no place in it: its path is settled
  // when it is, so it is not kept before.

  if (owner && (typeof owner === 'object' || typeof owner === 'function') && (0,_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_0__.pathIsSettled)(owner)) {
    fieldIdentities.set(owner, identity);
  }

  return identity;
}

function mergeIdRefs(existing, additions) {
  return [...new Set([...String(existing || '').split(/\s+/).filter(Boolean), ...additions.filter(Boolean)])].join(' ');
}

function createFieldContract(owner, {
  prefix = 'sf-field',
  required = false,
  invalid = false,
  hint = '',
  errorMessage = ''
} = {}) {
  const identity = nextIdentity(owner, prefix);
  const normalizedInvalid = Boolean(invalid);
  const message = normalizedInvalid && errorMessage ? errorMessage : hint;
  return { ...identity,
    required: Boolean(required),
    invalid: normalizedInvalid,
    message,
    describedBy: message ? identity.messageId : '',
    errorMessageId: normalizedInvalid && errorMessage ? identity.messageId : ''
  };
}
function syncFieldContract(root, control, {
  prefix = 'sf-field',
  required = false,
  invalid = false,
  messageNode = null,
  labelNode = null,
  errorMessage = ''
} = {}) {
  if (!root || !control) return null;
  const hint = messageNode?.textContent?.trim() || '';
  const contract = createFieldContract(root, {
    prefix,
    required,
    invalid,
    hint,
    errorMessage
  });
  if (!control.id) control.id = contract.controlId;

  if (root.tagName === 'LABEL' && !root.hasAttribute('for')) {
    root.setAttribute('for', control.id);
  } // A root that is not a label carries its label text as a <label> of its
  // own (div.sf-input, 1.13.0): it points at the control too.


  if (labelNode?.tagName === 'LABEL' && !labelNode.hasAttribute('for')) {
    labelNode.setAttribute('for', control.id);
  } // Name the field by its visible label, not every hint or adjacent button.
  // Author-provided accessible names remain authoritative.


  if (labelNode?.textContent?.trim() && !control.hasAttribute('aria-label') && !control.hasAttribute('aria-labelledby')) {
    // An id of its own: «<control>-label» may already name another element
    // (a page that gave the field's root that id), and aria-labelledby would
    // then read that element's whole text, the hint with it (DF-3).
    if (!labelNode.id) {
      const doc = labelNode.ownerDocument;
      let id = `${control.id}-label`;

      for (let n = 2; doc?.getElementById?.(id); n += 1) id = `${control.id}-label-${n}`;

      labelNode.id = id;
    }

    control.setAttribute('aria-labelledby', labelNode.id);
  }

  control.required = contract.required;
  root.classList.toggle('error', contract.invalid);
  control.classList.toggle('error', contract.invalid);
  if (contract.invalid) control.setAttribute('aria-invalid', 'true');else control.removeAttribute('aria-invalid');

  if (messageNode) {
    if (!messageNode.id) messageNode.id = contract.messageId;
    control.setAttribute('aria-describedby', mergeIdRefs(control.getAttribute('aria-describedby'), [messageNode.id]));
  }

  if (contract.errorMessageId && messageNode) {
    control.setAttribute('aria-errormessage', messageNode.id);
  } else {
    control.removeAttribute('aria-errormessage');
  }

  return contract;
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
/* harmony export */   FIELD_WIDTHS: () => (/* binding */ FIELD_WIDTHS),
/* harmony export */   INPUT_SIZES: () => (/* binding */ INPUT_SIZES),
/* harmony export */   RETIRED_FIELD_SIZES: () => (/* binding */ RETIRED_FIELD_SIZES),
/* harmony export */   fieldSize: () => (/* binding */ fieldSize),
/* harmony export */   fieldWidth: () => (/* binding */ fieldWidth),
/* harmony export */   fieldWidthClass: () => (/* binding */ fieldWidthClass),
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
} // How wide a field is (owner decision C396, WM-4): the value it is made for,
// in characters of the width ladder, read from the field's width setting --
// short (20: a date, a number, a code), medium (28: a name, a phone) and long
// (44: a path, an e-mail, an address); the roles --sf-field--width-short,
// -medium and -long stand on the steps --sf-measure-20, -28 and -44 (core
// figma_measure.scss) and follow the text size, the density and the phone.
// It is the field's widest: in a narrower container the field is the
// container's width, as without it. Empty or any other value: the whole
// width, as every field drew before. The class is core's
// (core/scss/_sf_css__field_width.scss), so a field whose own sheet has not
// come yet already stands at its width.

const FIELD_WIDTHS = Object.freeze(['short', 'medium', 'long']);
/** A field width: short, medium or long, else '' (the whole width). */

function fieldWidth(value) {
  const width = String(value ?? '').trim().toLowerCase();
  return FIELD_WIDTHS.includes(width) ? width : '';
}
/** The root class of a field width, or '' for the whole width. */

function fieldWidthClass(value) {
  const width = fieldWidth(value);
  return width ? `sf-field--width-${width}` : '';
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "67eed2647f47"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bindFormReset: () => (/* binding */ bindFormReset)
/* harmony export */ });
// Reset fires before the browser restores default values. Synchronize afterwards
// without synthesizing input/change events or retaining detached controls.
//
// One capture listener per document, while a control is bound to it: the first
// binding adds it and the last release takes it away, so a removed instance
// leaves nothing on the document. It used to stay for the page's life, added
// by whichever instance bound first; when that was an instance placed after
// the page settled (a closed layer's field starting late), the instance scope
// gate read it as that instance's leak (gate 36, 2026-11-11). Every bundle
// carries its own copy of this module, so the listener and the subscriptions
// live on the document, shared by the copies: one listener, not one per bundle.
const REGISTRY = Symbol.for('sf.formReset');

function registryOf(doc) {
  let registry = doc[REGISTRY];

  if (!registry) {
    registry = {
      subscriptions: new WeakMap(),
      bound: 0,
      listener: null
    };
    Object.defineProperty(doc, REGISTRY, {
      value: registry,
      configurable: true
    });
  }

  return registry;
}

function listen(doc, registry) {
  registry.listener = event => {
    const form = event.target;
    if (form?.tagName !== 'FORM') return;
    const controls = Array.from(form.elements);
    setTimeout(() => {
      if (event.defaultPrevented) return;

      for (const control of controls) {
        if (!control.isConnected || control.form !== form) continue;

        for (const callback of registry.subscriptions.get(control) || []) callback();
      }
    }, 0);
  };

  doc.addEventListener('reset', registry.listener, true);
}

function bindFormReset(input, synchronize) {
  const doc = input.ownerDocument;
  const registry = registryOf(doc);
  if (!registry.listener) listen(doc, registry);
  let callbacks = registry.subscriptions.get(input);
  if (!callbacks) registry.subscriptions.set(input, callbacks = new Set());
  callbacks.add(synchronize);
  registry.bound += 1;
  let released = false;
  return () => {
    if (released) return false;
    released = true;
    callbacks.delete(synchronize);
    registry.bound -= 1;

    if (registry.bound <= 0 && registry.listener) {
      doc.removeEventListener('reset', registry.listener, true);
      registry.listener = null;
      registry.bound = 0;
    }

    return true;
  };
}

/***/ },

/***/ "2abe37330ca5"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   nameTarget: () => (/* binding */ nameTarget),
/* harmony export */   unlinkNameTip: () => (/* binding */ unlinkNameTip)
/* harmony export */ });
// The name tooltip of the class icon button (owner decision C248,
// 2026-11-16; C160 (1), C224, C48): a .sf-icon-button the page wrote with an
// aria-label and no visible label shows that name as the Framework's tooltip
// by itself, as <sf-button-icon> does -- the same 0.5 s, the neighbours at
// once, keyboard focus at once, a long press on a touch screen, the flip at
// the edge (component.tooltip). It showed nothing: a page wrote fourteen
// lines of sf-tooltip-anchor + data-tooltip, or the browser's title.
//
// Nothing is drawn or fetched before the first hover, keyboard focus or long
// press on such a button, so the first paint is unchanged: then the tooltip
// surface (the tooltip composition, a .sf-tooltip the button names by
// data-tooltip) is made beside the button, the tooltip controller is asked
// for (the Loader's lazy plugin), and the event that woke it is handed over
// once the controller has linked the button.
//
// Left alone: data-tooltip="off" (the page's opt-out) and any data-tooltip of
// the page's own (its own link is stronger); a button with a title, its own
// or a host's around it (the page chose the browser's tooltip, or a component
// wrote its hint there -- the plain theme button, C244; drop the title for
// the Framework's): never a second tooltip; a button
// with visible words; a close button (sf-button-close, C14: it carries no
// name tooltip, as the Smart one does not); a button inside <sf-button-icon>,
// which shows its own; a disabled or hidden one.
const NAME_TIP = 'sf-icon-button-tooltip'; // What draws a glyph, not words: the icon (a ligature is text), the cross,
// an SVG, the loading spinner.

const GLYPHS = '.sf-icon, sf-icon, i, svg, .sf-close, sf-button-close, .sf-icon-button-spinner, [class*="sf-loader"]';
const SKIP_HOSTS = 'sf-button-icon, sf-icon-button, .sf-tooltip-anchor, [aria-hidden="true"], [inert]'; // A title on the button or on a host around it (the theme button writes its
// next-theme hint there, C244) is a tooltip of the page's own: the browser
// would draw it beside ours, so the button is left alone.

function hasTitle(button) {
  for (let node = button; node && node.nodeType === 1; node = node.parentElement) {
    if ((node.getAttribute('title') || '').trim()) return true;
  }

  return false;
} // The surfaces' numbers are counted on the page, not in this file, and under
// a name of their own: every bundle that carries this file has its own copy
// of it (sf-button since C370, the icon buttons), and <sf-button-icon>
// numbers its own tooltips «sf-icon-button-tooltip-N» from 1 too; two
// counters from 1 made a second «sf-icon-button-tooltip-1», and the language
// glyph in the docs header showed the shrunk search's «Поиск ⌘K».


const MADE = Symbol.for('sf.icon-button.name-tooltip.made');

function nextTipId(doc) {
  let id = '';

  do {
    globalThis[MADE] = (globalThis[MADE] || 0) + 1;
    id = `sf-name-tooltip-${globalThis[MADE]}`;
  } while (doc.getElementById(id));

  return id;
}

function tooltipController() {
  return globalThis.SF?.ComponentRegistry?.Tooltip || globalThis.SF?.Loader?.ComponentRegistry?.Tooltip || null;
} // The controller is there: run now; else ask the Loader for it (a lazy
// plugin) and run once it registered -- as <sf-button-icon> does.


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
} // Whether the button shows words of its own beside (or instead of) its icon.


function hasVisibleLabel(button) {
  const walker = button.ownerDocument.createTreeWalker(button, NodeFilter.SHOW_TEXT);

  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (!node.data.trim()) continue;
    if (node.parentElement?.closest(GLYPHS)) continue;
    return true;
  }

  return false;
} // What a reader takes from a control's content, roughly: its text, without
// what is hidden from assistive technology (a glyph, a badge's digits) and
// with the visually hidden words that close it (a status, a count's phrase).


function readableName(node) {
  if (node.nodeType === 3) return node.data;
  if (node.nodeType !== 1) return '';
  if (node.getAttribute('aria-hidden') === 'true' || node.hidden || node.localName === 'template') return '';
  if (node.hasAttribute('aria-label')) return ` ${node.getAttribute('aria-label')} `;
  return Array.from(node.childNodes).map(child => readableName(child)).join(' ');
}

function nameOf(button) {
  const own = button.getAttribute('data-sf-shrink-tip') || button.getAttribute('aria-label') || ''; // A marked control with no name of its own (a rail row of sf-menu: an
  // icon, its words out of sight) shows the name read from its content, its
  // status and count words included (group build 21).

  const name = own || (button.matches(MARKED) ? readableName(button) : '');
  return String(name).replace(/\s+/gu, ' ').replace(/\s+([,.;:])/gu, '$1').trim();
} // An sf-button drawn as its glyph by its bar (shrink="icon", data-shrunk;
// owner decision C370): its words are hidden, so it shows its text and keys
// as this tooltip, «Поиск ⌘K» (data-sf-shrink-tip), as an icon button shows
// its name. Whole again, it shows none.


const SHRUNK = 'sf-button[shrink="icon"][data-shrunk="true"] > .sf-button[data-sf-shrink-tip]'; // A control a component draws with no words of its own and marks with
// data-sf-name-tip (a role=button part, not an .sf-icon-button: the phone
// field's country flag, sf-input-country, FS-11) shows its name the same way.
// The value inline-end stands the tooltip beside the control, at its inline
// end, its tail pointing back at it: a vertical rail's rows (sf-menu
// appearance rail, group build 21), as sf-admin-menu's rail tooltips stand
// (arrow inline-start, C320), so the tooltip does not cover the next row.

const MARKED = '[data-sf-name-tip]';
const BESIDE = 'inline-end'; // The button a name tooltip is for, or null.

function nameTarget(node) {
  const marked = node instanceof Element ? node.closest(MARKED) : null;

  if (marked) {
    if (!nameOf(marked) || marked.hasAttribute('data-tooltip') || hasTitle(marked)) return null;
    if (marked.matches(':disabled, [aria-disabled="true"]') || marked.closest('[aria-hidden="true"], [inert]')) return null;
    return marked;
  }

  const shrunk = node instanceof Element ? node.closest(SHRUNK) : null;

  if (shrunk) {
    if (shrunk.hasAttribute('data-tooltip') || hasTitle(shrunk) || shrunk.matches(':disabled, [aria-disabled="true"]')) return null;
    return nameOf(shrunk) ? shrunk : null;
  }

  const button = node instanceof Element ? node.closest('.sf-icon-button') : null;
  if (!button || !nameOf(button)) return null;
  if (!(button.localName === 'button' || button.localName === 'a' && button.hasAttribute('href') || button.getAttribute('role') === 'button')) return null;
  if (button.hasAttribute('data-tooltip') || hasTitle(button)) return null;
  if (button.matches('.sf-button-close, .sf-icon-button--close, :disabled, [aria-disabled="true"]')) return null;
  if (button.parentElement?.closest(SKIP_HOSTS) || button.matches(SKIP_HOSTS)) return null;
  if (hasVisibleLabel(button)) return null;
  return button;
} // A tooltip this file made keeps the button's name: an aria-label changed
// later (a toggle's «Показать» / «Скрыть») is said on the next hover.


function syncMadeTip(button) {
  const id = button?.getAttribute?.('data-tooltip');
  if (!id) return;
  const tip = button.ownerDocument.getElementById(id);
  if (!tip?.classList.contains(NAME_TIP)) return;
  const text = tip.querySelector('.sf-tooltip-text');
  const name = nameOf(button);
  if (text && name && text.textContent !== name) text.textContent = name;
}

function wake(event) {
  const origin = event.target;
  if (origin instanceof Element) syncMadeTip(origin.closest(`.sf-icon-button[data-tooltip], .sf-button[data-sf-shrink-tip][data-tooltip], ${MARKED}[data-tooltip]`));
  if (event.type === 'pointerdown' && event.pointerType !== 'touch') return;
  if (event.type === 'pointerover' && event.pointerType === 'touch') return;
  const button = nameTarget(origin);
  if (!button) return;

  if (event.type === 'focusin') {
    let shown = true;

    try {
      shown = button.matches(':focus-visible');
    } catch {
      shown = true;
    }

    if (!shown) return;
  }

  const doc = button.ownerDocument;
  const tip = doc.createElement('span');
  const beside = button.matches(MARKED) && button.getAttribute('data-sf-name-tip') === BESIDE;
  tip.className = `sf-tooltip sf-tooltip--dark${beside ? ' sf-tooltip--arrow-inline-start' : ''} ${NAME_TIP}`;
  tip.id = button.id ? `${button.id}--tooltip` : nextTipId(doc);
  tip.hidden = true;
  const content = doc.createElement('span');
  content.className = 'sf-tooltip-content';
  const text = doc.createElement('span');
  text.className = 'sf-tooltip-text';
  text.textContent = nameOf(button);
  content.append(text);
  tip.append(content);

  if (beside) {
    const tail = doc.createElement('span');
    tail.className = 'sf-tooltip-tail';
    tail.setAttribute('aria-hidden', 'true');
    tip.append(tail);
  }

  button.after(tip);
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
    if (button.getAttribute('data-tooltip') !== tip.id) return; // The controller links the button on its own (its observer); the event
    // is handed over only while it still holds.

    if (kind === 'pointerover' && button.matches(':hover')) {
      button.dispatchEvent(new PointerEvent('pointerenter', {
        pointerType
      }));
    } else if (kind === 'focusin' && doc.activeElement === button) {
      button.dispatchEvent(new FocusEvent('focusin'));
    } else if (kind === 'pointerdown' && !released) {
      button.dispatchEvent(new PointerEvent('pointerdown', {
        pointerType
      }));
    }
  }, 0));
} // One listener set per page, shared by every bundle that carries this file.


const BOUND = Symbol.for('sf.icon-button.name-tooltip');

if (typeof document !== 'undefined' && !globalThis[BOUND]) {
  globalThis[BOUND] = true;

  for (const type of ['pointerover', 'focusin', 'pointerdown']) {
    document.addEventListener(type, wake, {
      capture: true,
      passive: true
    });
  }
} // A name tooltip this file made for a button is taken away (an sf-button
// whole again, shrink="icon"): the button no longer names it, and the
// surface goes.


function unlinkNameTip(button) {
  const id = button?.getAttribute?.('data-tooltip');
  if (!id) return;
  const tip = button.ownerDocument.getElementById(id);
  if (!tip?.classList.contains(NAME_TIP)) return;
  button.removeAttribute('data-tooltip');
  tip.remove();
}



/***/ },

/***/ "0ab12d47912a"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   maskService: () => (/* binding */ maskService)
/* harmony export */ });
// SF.Mask belongs to Core. A page may run a field's script before Core --
// SF_PRELOADED allows it, and Docara loads every page and example frame that
// way (smart-base, the component scripts, then core.js) -- and a field that
// found no SF.Mask at bind time gave up on its mask for good: the root was
// bound and the input stayed unmasked. The fields ask for the service here
// instead; it is there at once on an ordinary page, and otherwise arrives
// with Core's sf-mask-ready (or is found at the Loader's ready or the window's
// load, for a Core that predates the event). One promise per bundle.
let pending = null;
function maskService() {
  const current = () => window.SF?.Mask?.create ? window.SF.Mask : null;

  const service = current();
  if (service) return Promise.resolve(service);
  if (pending) return pending;
  pending = new Promise(resolve => {
    const events = [[window, 'sf-mask-ready'], [window, 'sf-loader-ready'], [window, 'load'], [document, 'DOMContentLoaded']];

    const check = () => {
      const found = current();
      if (!found) return;
      events.forEach(([target, type]) => target.removeEventListener(type, check));
      pending = null;
      resolve(found);
    };

    events.forEach(([target, type]) => target.addEventListener(type, check));
  });
  return pending;
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

/***/ "f28a9d913ce0"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// Generated from the `tag` rows of src/smart/*/aliases.json and the element_aliases of
// src/core/contracts/packages/*.package.json by scripts/tag-alias-table.mjs; do not edit.
// The dated tag aliases of the Framework and of its component packages, read by core/js/tag-aliases.js.
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Object.freeze([Object.freeze({
  from: 'sf-avatars',
  to: 'sf-avatar-group',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-button-group',
  to: 'sf-segmented',
  since: '2026-11-08',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-change-confirm',
  to: 'sf-confirm-change',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-close',
  to: 'sf-button-close',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-code-input',
  to: 'sf-input-code',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-color',
  to: 'sf-input-color',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-composition-overlay',
  to: 'sf-editor-overlay',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-content-editor',
  to: 'sf-editor-content',
  since: '2026-11-03',
  remove_after: '2027-01-01',
  package: 'pro'
}), Object.freeze({
  from: 'sf-context-menu',
  to: 'sf-menu-context',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-copy-button',
  to: 'sf-button-copy',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-country-code',
  to: 'sf-input-country',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-data-view',
  to: 'sf-view',
  since: '2026-11-03',
  remove_after: '2027-01-01',
  package: 'pro'
}), Object.freeze({
  from: 'sf-datepicker',
  to: 'sf-input-date',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-download-file',
  to: 'sf-file-download',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-icon-button',
  to: 'sf-button-icon',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-image-field',
  to: 'sf-input-image',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-inline-editor',
  to: 'sf-editor-inline',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-lookup',
  to: 'sf-input-lookup',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-page-header',
  to: 'sf-header-page',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-property-view',
  to: 'sf-view-properties',
  since: '2026-11-03',
  remove_after: '2027-01-01',
  package: 'pro'
}), Object.freeze({
  from: 'sf-quantity',
  to: 'sf-input-quantity',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-range-slider',
  to: 'sf-slider-range',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-rich-text',
  to: 'sf-input-rich',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-site-header',
  to: 'sf-header-site',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-table',
  to: 'sf-view-table',
  since: '2026-11-03',
  remove_after: '2027-01-01',
  package: 'pro'
}), Object.freeze({
  from: 'sf-textarea',
  to: 'sf-input-textarea',
  since: '2026-11-03',
  remove_after: '2027-01-01'
}), Object.freeze({
  from: 'sf-thread-list',
  to: 'sf-chat-threads',
  since: '2026-11-03',
  remove_after: '2027-01-01',
  package: 'pro'
})]));

/***/ },

/***/ "4a85acfb05c1"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   canonicalTag: () => (/* binding */ canonicalTag),
/* harmony export */   defineTagAliases: () => (/* binding */ defineTagAliases),
/* harmony export */   isTag: () => (/* binding */ isTag),
/* harmony export */   listTagAliases: () => (/* binding */ listTagAliases),
/* harmony export */   noteTagAlias: () => (/* binding */ noteTagAlias),
/* harmony export */   registerTagAliasRows: () => (/* binding */ registerTagAliasRows),
/* harmony export */   registerTagAliases: () => (/* binding */ registerTagAliases),
/* harmony export */   tagNames: () => (/* binding */ tagNames),
/* harmony export */   tagSelector: () => (/* binding */ tagSelector)
/* harmony export */ });
/* harmony import */ var _deprecations_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d3818183b14c");
/* harmony import */ var _alias_table_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5dcef5de40cf");
/* harmony import */ var _tag_aliases_generated_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("f28a9d913ce0");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_deprecations_js__WEBPACK_IMPORTED_MODULE_0__, _alias_table_js__WEBPACK_IMPORTED_MODULE_1__]);
([_deprecations_js__WEBPACK_IMPORTED_MODULE_0__, _alias_table_js__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _deprecations_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_deprecations_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _alias_table_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_alias_table_js__WEBPACK_IMPORTED_MODULE_1__);
// Dated tag aliases (rename plan R0, ui-control RENAME-PLAN-2026-11-03; change
// lifecycle: contracts/changes/journal.json, kind "tag"). When a Smart
// component takes a new tag, the old tag keeps working until its
// `remove_after` day:
//
// - Definition. defineTagAliases(Class, tag) defines each old tag as a trivial
//   subclass of the class that defines the new one (the Smart base calls it
//   from define()). The Loader's rule lists the old tag beside the new one, so
//   markup with the old tag alone loads the bundle.
// - Note. The first old-tag element a page connects is noted in
//   SF.deprecations (kind "tag") and named once on the console with the new tag
//   and the date, whatever the page opted into: an element name is the most
//   visible thing a page writes, and the old one is going.
// - Script. Code that finds a renamed element by name asks for both names
//   through one helper instead of a literal:
//
//     import {tagSelector, isTag} from '../../core/js/smart-base';
//     host.querySelector(`.sf-tag > ${tagSelector('sf-button-close')}`);
//     if (isTag(node, 'sf-button-close')) ...
//
// - Sheets. A selector that names the new tag names the old one beside it in
//   source, `:is(sf-button-close, sf-close)`, for as long as the alias lives
//   (scripts/rename-smart-tag.mjs writes it, --sweep takes it out; the
//   contract test tests/tag-aliases.contract.test.mjs holds both).
//
// The aliases are a static table (tag-aliases.generated.js, written by
// scripts/tag-alias-table.mjs from every component's aliases.json and from the
// element_aliases of the component package references,
// contracts/packages/*.package.json), so a lookup finds an old tag before the
// renamed component's bundle has run, a package's (sf-table, rename plan R2)
// as well as the Framework's. A package's component adds its rows again when it
// is defined, which matters only for a package the pair does not reference. Every copy of this
// module shares one state on the page (a global symbol); the Smart bundles
// reach it through the shared runtime (smart-base re-exports it).



const STATE = Symbol.for('simai.sf.tag-aliases');

function state() {
  if (!globalThis[STATE]) {
    const shared = {
      byOld: new Map(),
      byNew: new Map(),
      noted: new Set()
    };
    Object.defineProperty(globalThis, STATE, {
      value: shared,
      configurable: true
    });

    for (const row of _tag_aliases_generated_js__WEBPACK_IMPORTED_MODULE_2__["default"]) addRow(shared, row);
  }

  return globalThis[STATE];
}

function addRow(shared, row) {
  if (shared.byOld.has(row.from)) return;
  shared.byOld.set(row.from, row);
  shared.byNew.set(row.to, [...(shared.byNew.get(row.to) ?? []), row.from]);
} // Rows from a component's aliases.json (its `tag` rows); the Framework's are
// already known, a package's are added here.


function registerTagAliases(table, tag) {
  const {
    rows
  } = (0,_alias_table_js__WEBPACK_IMPORTED_MODULE_1__.readTagAliases)(table, {
    tag
  });
  const shared = state();

  for (const row of rows) addRow(shared, row);

  return rows;
} // Rows a component set gives at runtime (SF.RuleLoader.registerPackage(name,
// {aliases})): {from, to, since, remove_after}, the set's own former tags, so
// SIMAI Framework needs no table row for a set it does not know. Answers the
// rows taken; a row whose old tag is already known keeps the first.

function registerTagAliasRows(rows) {
  const shared = state();
  const taken = [];

  for (const row of Array.isArray(rows) ? rows : []) {
    if (!row || typeof row.from !== 'string' || typeof row.to !== 'string') continue;
    if (shared.byOld.has(row.from)) continue;
    const clean = Object.freeze({
      from: row.from,
      to: row.to,
      since: String(row.since ?? ''),
      remove_after: String(row.remove_after ?? ''),
      ...(typeof row.package === 'string' && row.package ? {
        package: row.package
      } : {})
    });
    addRow(shared, clean);
    taken.push(clean);
  }

  return taken;
} // The open old names of a tag, its own first: ['sf-button-close', 'sf-close'].

function tagNames(tag) {
  const name = String(tag || '').toLowerCase();
  return [name, ...(state().byNew.get(name) ?? [])];
} // A selector for the tag that matches its old names too:
// ':is(sf-button-close, sf-close)', or the tag itself when it has none.

function tagSelector(tag) {
  const names = tagNames(tag);
  return names.length > 1 ? `:is(${names.join(', ')})` : names[0];
} // Whether an element is the tag, under its own or an old name.

function isTag(element, tag) {
  const name = element?.localName;
  return Boolean(name) && tagNames(tag).includes(name);
} // The current name of a tag: 'sf-button-close' for 'sf-close'. An old tag the
// page still has as an element of its own stays itself: a component package
// built before its rename (rules naming sf-table alone) beside a pair whose
// table already knows the new name, where the new tag would never upgrade.

function canonicalTag(tag) {
  const name = String(tag || '').toLowerCase();
  const row = state().byOld.get(name);
  if (!row) return name;
  const own = globalThis.customElements?.get?.(name);
  if (own && !own.sfTagAliasOf) return name;
  let rules = null;

  try {
    rules = globalThis.SF?.Loader?.getCustomElementRules?.() ?? null;
  } catch {
    rules = null;
  }

  if (rules && rules[name] && !rules[row.to]) return name;
  return row.to;
} // Every open row: [{from, to, since, remove_after}].

function listTagAliases() {
  return [...state().byOld.values()].map(row => ({ ...row
  }));
} // The page met an element under an old name: once per old tag.

function noteTagAlias(row) {
  const shared = state();
  const expired = (0,_alias_table_js__WEBPACK_IMPORTED_MODULE_1__.aliasExpired)(row);
  (0,_deprecations_js__WEBPACK_IMPORTED_MODULE_0__.noteDeprecated)({
    component: row.to,
    kind: 'tag',
    from: row.from,
    to: row.to,
    tag: row.to,
    since: row.since,
    remove_after: row.remove_after,
    expired,
    package: row.package
  });
  if (shared.noted.has(row.from)) return;
  shared.noted.add(row.from); // deprecations.js prints an expired name itself, and every name when the
  // page opted in; the note here is for the rest.

  const optedIn = globalThis.document?.documentElement?.dataset?.sfDeprecations === 'warn' || globalThis.SF?.deprecations?.warn === true;
  if (expired || optedIn) return; // A package's element says which package ships it now (C174 NM-3).

  const where = row.package ? ` from the component package ${row.package}` : '';
  globalThis.console?.warn?.(`[SIMAI Framework] <${row.from}> is now <${row.to}>; the old tag works until ${row.remove_after}. Write <${row.to}>${where}. See contracts/changes/journal.json.`);
} // Defines each old tag of `tag` as a subclass of `Base` (the class that
// defines `tag`), through `define(name, Class)`: the Smart base passes its
// definition queue, so both names are defined in the same batch. Returns the
// rows defined.

function defineTagAliases(Base, tag, {
  table = Base?.aliases,
  define
} = {}) {
  if (table) registerTagAliases(table, tag);
  const rows = (state().byNew.get(tag) ?? []).map(from => state().byOld.get(from));
  const registry = globalThis.customElements;
  const defined = [];

  for (const row of rows) {
    if (!registry || registry.get(row.from)) continue;

    class TagAlias extends Base {
      connectedCallback() {
        noteTagAlias(row);
        super.connectedCallback?.();
      }

    }

    Object.defineProperty(TagAlias, 'sfTagAliasOf', {
      value: row.to
    });
    (define ?? ((name, Class) => registry.define(name, Class)))(row.from, TagAlias);
    defined.push(row);
  }

  return defined;
}

if (typeof globalThis !== 'undefined') {
  globalThis.SF = globalThis.SF || {}; // For scripts that are not Smart bundles (class components, a page):
  // SF.tags.selector('sf-button-close').

  if (!globalThis.SF.tags) {
    globalThis.SF.tags = Object.freeze({
      names: tagNames,
      selector: tagSelector,
      is: isTag,
      canonical: canonicalTag,
      list: listTagAliases
    });
  }
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "f39dc444b059"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fieldHelpLabel: () => (/* binding */ fieldHelpLabel),
/* harmony export */   fieldHelpSize: () => (/* binding */ fieldHelpSize),
/* harmony export */   renderFieldHelp: () => (/* binding */ renderFieldHelp)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
 // The «?» after a field's label (owner decision C153 (8), C133's look): the
// `help` setting of every member of the field family draws sf-help-mark after
// the label text and its required mark. The mark stands a step below the
// value, as the label does -- 1/3 under the small steps, 1/2 from size 1 up --
// and each sheet holds it to the label's line, so the label row keeps its
// height. Its button is named by its subject (the component's word `help`,
// «Подробнее: {label}»). A press on it opens the explanation and never reaches
// the label row, whose own press focuses the field.

const HELP_SIZE = Object.freeze({
  '1/3': '1/3',
  '1/2': '1/3',
  1: '1/2',
  2: '1/2',
  3: '1/2'
});
/** The help mark's step for a field of `size`. */

function fieldHelpSize(size) {
  return HELP_SIZE[size] || '1/2';
}
/** The mark's name: the component's `help` word with the label, or the mark's own default. */

function fieldHelpLabel(component, label) {
  if (!label || typeof component?.sfWord !== 'function') return '';
  return component.sfWord('help', {
    vars: {
      label
    }
  });
}
/** sf-help-mark for `help`, or nothing without one. */

function renderFieldHelp({
  help,
  label = '',
  size = '1',
  className = '',
  component = null
} = {}) {
  if (!help) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-help-mark
    class=${className || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    size=${fieldHelpSize(size)}
    text=${help}
    label=${fieldHelpLabel(component, label) || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    @click=${event => event.stopPropagation()}
  ></sf-help-mark>`;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "38ea8d53f301"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FormField: () => (/* binding */ FormField),
/* harmony export */   ShownRequired: () => (/* binding */ ShownRequired),
/* harmony export */   ShownValidity: () => (/* binding */ ShownValidity),
/* harmony export */   VALIDITY_FLAGS: () => (/* binding */ VALIDITY_FLAGS),
/* harmony export */   VALIDITY_WORDS: () => (/* binding */ VALIDITY_WORDS),
/* harmony export */   afterPress: () => (/* binding */ afterPress),
/* harmony export */   claimFirstInvalid: () => (/* binding */ claimFirstInvalid),
/* harmony export */   forgetFormTried: () => (/* binding */ forgetFormTried),
/* harmony export */   formTried: () => (/* binding */ formTried),
/* harmony export */   hasFieldWord: () => (/* binding */ hasFieldWord),
/* harmony export */   innerControlName: () => (/* binding */ innerControlName),
/* harmony export */   ownInvalid: () => (/* binding */ ownInvalid),
/* harmony export */   syncFieldValidity: () => (/* binding */ syncFieldValidity),
/* harmony export */   syncOwnValidity: () => (/* binding */ syncOwnValidity),
/* harmony export */   validityWords: () => (/* binding */ validityWords)
/* harmony export */ });
// The form-control half of a field built from its component.json (standard
// simai.smart-component 1.3.8 §17.1, §17.2), shared by the field family.
//
// core/js/element-manifest.js makes the host form-associated and gives it
// ElementInternals, sfFormValue() and sfSyncForm(). What a field adds is the
// same in every member, so it is written once here:
//
// - validity (§17.2): the host reports what its inner native control knows
//   (value-missing, too-short, pattern-mismatch, ...) with the control as the
//   anchor, so reportValidity() points at the box the person types in; a
//   custom error set with setCustomValidity() or the action set-error wins
//   until it is cleared;
// - the inner controls stay out of the page's form (§17.1 item 6): they carry
//   no name while the host is the form control;
// - a field with no inner native control to read (a list of buttons, a
//   picker, a file area) says what it knows itself with `fieldValidity()`:
//   value-missing while `required` and the form value is empty by default,
//   and where the browser points;
// - form reset and fieldset[disabled] (§17.1 items 3, 4): `form.reset()`
//   calls the component's `fieldReset()` when it has one (its default back,
//   without events), and the host syncs its form value and validity after the
//   browser has reset its parts;
// - restore: `formStateRestoreCallback` hands the saved form value to
//   `fieldRestore(state)` when the component has one.
//
// Usage, over the element core/js/element-manifest.js gives:
//
//   const Element = elementFromManifest(manifest, {base: SfBaseElement, ...});
//   class SfThing extends FormField(Element) { ... }
//
// Without ElementInternals nothing here runs, and the named inner control
// submits as it always did (§16 item 11).
// ValidityState's own flags, in the order of §17.2's list.
const VALIDITY_FLAGS = Object.freeze(['valueMissing', 'typeMismatch', 'patternMismatch', 'tooShort', 'tooLong', 'rangeUnderflow', 'rangeOverflow', 'stepMismatch', 'badInput']);
/** The name an inner native control carries: none while the host submits (§17.1 item 6). */

function innerControlName(component, name) {
  return component?.sfInternals ? '' : String(name || '');
}
/**
 * The host's validity from its inner control: the control's failed flags and
 * message, or the custom error the page set, or valid. `own` adds flags the
 * component reads itself, {flag: message} (a number field's range and step,
 * which its text box cannot know).
 */

function syncFieldValidity(component, control, own = {}) {
  const internals = component?.sfInternals;
  if (!internals) return;

  try {
    const custom = component.sfCustomError || '';

    if (custom) {
      internals.setValidity({
        customError: true
      }, custom, control || undefined);
      return;
    }

    const validity = control?.validity;
    const flags = {};
    let message = '';

    if (validity && !validity.valid && control.willValidate !== false) {
      for (const flag of VALIDITY_FLAGS) if (validity[flag]) flags[flag] = true;

      message = control.validationMessage;
    }

    for (const [flag, text] of Object.entries(own || {})) {
      flags[flag] = true;
      message ||= String(text || '');
    }

    if (Object.keys(flags).length) internals.setValidity(flags, message || ' ', control || undefined);else internals.setValidity({});
  } catch (error) {
    component.reportComponentError?.(error, 'validity');
  }
}
/**
 * The host's validity from what the component says itself (fieldValidity()):
 * value-missing, too-long (a counted field past its limit, helpers/char-count.js)
 * and the custom error the page set; `anchor`, when it is a part of the host,
 * is where the browser points.
 */

function syncOwnValidity(component, {
  valueMissing = false,
  tooLong = false,
  message = '',
  anchor = null
} = {}) {
  const internals = component?.sfInternals;
  if (!internals) return;
  const custom = component.sfCustomError || '';
  const flags = {};
  let text = '';

  if (custom) {
    flags.customError = true;
    text = custom;
  }

  if (valueMissing) {
    flags.valueMissing = true;
    text ||= message || 'value-missing';
  }

  if (tooLong) {
    flags.tooLong = true;
    text ||= message || 'too-long';
  }

  try {
    if (Object.keys(flags).length) {
      const target = anchor && component.contains?.(anchor) ? anchor : undefined;
      internals.setValidity(flags, text, target);
    } else {
      internals.setValidity({});
    }
  } catch (error) {
    component.reportComponentError?.(error, 'validity');
  }
}
/**
 * The field family's form plumbing over a manifest element. A component
 * names the control its validity comes from with `sfValidityAnchor()`
 * (default: getInputElement()).
 */

const FormField = Base => class extends Base {
  constructor() {
    super(); // A person's edit reaches the host as input/change; the form value and
    // validity follow it without a redraw.

    this.__sfFormSync = () => this.sfSyncFormState();

    this.addEventListener('input', this.__sfFormSync);
    this.addEventListener('change', this.__sfFormSync);
  }

  sfValidityAnchor() {
    return this.getInputElement?.() || null;
  }
  /**
   * What the component knows of its validity itself, {valueMissing, message,
   * anchor}, or null when an inner native control's ValidityState is the
   * answer (sfValidityAnchor()). With no such control: value-missing while
   * `required` and the form value is empty. A component overrides it.
   */


  fieldValidity() {
    if (this.sfValidityAnchor()) return null;
    const required = this.hasAttribute('required') && this.getAttribute('required') !== 'false';
    const value = this.sfFormValue?.();
    const valueMissing = required && !this.disabled && (value === null || value === undefined || value === ''); // The word only when it is said: asked on every sync, a component without
    // it warned «no word value-missing» on each optional field (simai.main,
    // sf-button-group in property-view's choice field, 2026-10-28).

    return {
      valueMissing,
      message: valueMissing ? this.sfWord?.('value-missing') || 'value-missing' : '',
      anchor: null
    };
  }
  /** The validity, now: the component's own account, or its inner control's. */


  sfSyncValidity() {
    const own = this.fieldValidity();
    if (own) syncOwnValidity(this, own);else syncFieldValidity(this, this.sfValidityAnchor());
  }
  /** The form value and the validity, now. */


  sfSyncFormState() {
    this.sfSyncForm?.();
    this.sfSyncValidity();
  }
  /** §17.2: a custom error keeps the form from submitting until it is cleared. */


  setCustomValidity(message = '') {
    this.sfCustomError = String(message ?? '');
    this.sfSyncValidity();
  } // fieldReset() puts the component's default back, without events. The
  // browser resets the parts after it calls this: the sync waits for them,
  // and once more for the parts that put their own default back a task later
  // (component/form-reset-helper.js: masks, the checkables' attributes).


  formResetCallback() {
    if (typeof this.fieldReset === 'function') {
      try {
        this.fieldReset();
      } catch (error) {
        this.reportComponentError?.(error, 'form reset');
      }
    }

    this.sfSyncFormState();
    Promise.resolve().then(() => this.sfSyncFormState());
    setTimeout(() => this.sfSyncFormState(), 0);
  }

  formStateRestoreCallback(state) {
    if (typeof this.fieldRestore === 'function') this.fieldRestore(state);
    this.sfSyncFormState();
  }

}; // The word key a failed validity flag is said with (owner decision C153 (3)):
// each component carries these words in its lang/<locale>.json runtime
// words, in the page's language (LC-9), never the browser's.

const VALIDITY_WORDS = Object.freeze({
  valueMissing: 'value-missing',
  typeMismatch: 'type-mismatch',
  patternMismatch: 'pattern-mismatch',
  tooShort: 'too-short',
  tooLong: 'too-long',
  rangeUnderflow: 'range-underflow',
  rangeOverflow: 'range-overflow',
  stepMismatch: 'step-mismatch',
  badInput: 'bad-input'
}); // One check pass across every field of a page (C153 (3)): a submit attempt,
// reportValidity() or checkValidity() fires `invalid` on every wrong field
// in tree order, synchronously. The first wrong field of a pass the person
// started (a press or Enter in this task) takes the focus; the rest show
// their errors and keep still. The fields are separate bundles, each with its
// own copy of this module, so the pass lives on a shared global.

const CHECK_KEY = Symbol.for('simai.framework.field-check');

function fieldCheck() {
  const shared = globalThis[CHECK_KEY] || (globalThis[CHECK_KEY] = {
    activated: false,
    focused: false,
    tried: new WeakSet()
  });

  if (!shared.listening && typeof document !== 'undefined') {
    shared.listening = true;

    const mark = event => {
      if (event.type === 'keydown' && event.key !== 'Enter') return;
      shared.activated = true;
      setTimeout(() => {
        shared.activated = false;
      }, 0);
    };

    document.addEventListener('click', mark, true);
    document.addEventListener('keydown', mark, true);
  }

  return shared;
} // A pointer pressed on the page (FO-4, module.smart-helpers 1.20.0): a field
// it leaves holds its leave check until the press is over and a task after
// it, so the error line drawn under that field does not move the button the
// pointer is on before the click lands (at 390 a cleared required field's
// line moved «Сохранить» 20 px down and the save was lost). The press's own
// click checks every field when it submits. A release the page never hears
// ends the hold after PRESS_HOLD_MS. One record for every bundle's copy.


const PRESS_KEY = Symbol.for('simai.framework.field-press');
const PRESS_HOLD_MS = 4000;

function fieldPress() {
  const shared = globalThis[PRESS_KEY] || (globalThis[PRESS_KEY] = {
    down: false,
    queue: [],
    timer: 0
  });

  if (!shared.listening && typeof document !== 'undefined') {
    shared.listening = true;

    const end = () => {
      if (!shared.down) return;
      shared.down = false;
      clearTimeout(shared.timer);
      setTimeout(() => {
        if (shared.down) return;

        for (const run of shared.queue.splice(0)) {
          try {
            run();
          } catch {
            /* a field taken out of the page while the press lasted */
          }
        }
      }, 0);
    };

    const start = () => {
      if (shared.down) return;
      shared.down = true;
      clearTimeout(shared.timer);
      shared.timer = setTimeout(end, PRESS_HOLD_MS);
    };

    document.addEventListener('pointerdown', start, true);
    document.addEventListener('mousedown', start, true);

    for (const type of ['pointerup', 'pointercancel', 'mouseup', 'dragend']) document.addEventListener(type, end, true);
  }

  return shared;
}
/** Runs `check` now, or once a pointer press in progress is over (FO-4). */


function afterPress(check) {
  const shared = fieldPress();
  if (shared.down) shared.queue.push(check);else check();
}
/**
 * Says that `element` failed a check now. Returns true when it is the first
 * wrong field of a pass the person started, the one that takes the focus.
 * Every member of the field family calls it from its `invalid` listener.
 */

function claimFirstInvalid(element) {
  const check = fieldCheck();
  const form = element?.form || element?.closest?.('form') || null;
  if (form) check.tried.add(form);
  if (!check.activated || check.focused) return false;
  check.focused = true;
  setTimeout(() => {
    check.focused = false;
  }, 0);
  return true;
}
/**
 * For a member that draws its own errors on `invalid` (C153 (3)): the
 * browser's bubble is cancelled on the host and on every native control
 * inside it, `show` runs for the host's own event, and the first wrong field
 * of a submit the person made takes the focus. Returns the listener, to
 * remove with removeEventListener('invalid', listener, true).
 */

function ownInvalid(component, show) {
  fieldCheck();

  const listener = event => {
    event.preventDefault();
    if (event.target !== component) return;
    const first = claimFirstInvalid(component);
    show?.(event);

    if (first) {
      const target = component.focusDelegate?.() || component.sfValidityAnchor?.() || component;

      try {
        target.focus?.();
      } catch {
        /* a field taken out of the page while the check ran */
      }
    }
  };

  component.addEventListener('invalid', listener, true);
  return listener;
}
/** A submit attempt has failed on this field's form since its last reset. */

function formTried(element) {
  const form = element?.form || element?.closest?.('form') || null;
  return Boolean(form && fieldCheck().tried.has(form));
}
/** Forgets the failed attempt of a form (form.reset()). */

function forgetFormTried(element) {
  const form = element?.form || element?.closest?.('form') || null;
  if (form) fieldCheck().tried.delete(form);
}
/** Whether the component's dictionaries hold a word, in any language. */

function hasFieldWord(component, key) {
  const words = component?.constructor?.sfWords || {};
  return Object.values(words).some(dictionary => dictionary && dictionary[key] !== undefined && dictionary[key] !== null);
}
/**
 * The words a field says for its validity now (C153 (3)): the page's custom
 * error as written; else the first failed flag in the component's own words,
 * with the limit it broke ({min}, {max}, {step}); a type mismatch of an
 * e-mail or a web address has its own word (type-mismatch-email,
 * type-mismatch-url). A flag the component has no word for says what the
 * component itself set (its own count, range or file words), never the
 * browser's. '' while valid.
 */

function validityWords(component, control = component?.sfValidityAnchor?.()) {
  const validity = component?.validity;
  if (!validity || validity.valid) return '';
  if (validity.customError) return component.validationMessage || '';

  const read = name => control?.getAttribute?.(name) ?? component.getAttribute?.(name) ?? '';

  for (const flag of VALIDITY_FLAGS) {
    if (!validity[flag]) continue;
    let key = VALIDITY_WORDS[flag];

    if (flag === 'typeMismatch') {
      const type = String(control?.type || '').toLowerCase();
      if ((type === 'email' || type === 'url') && hasFieldWord(component, `${key}-${type}`)) key = `${key}-${type}`;
    }

    if (hasFieldWord(component, key)) {
      return component.sfWord(key, {
        vars: {
          min: read(flag === 'tooShort' ? 'minlength' : 'min'),
          max: flag === 'tooLong' ? component.maxlength ?? read('maxlength') : read('max'),
          step: read('step')
        }
      });
    }

    return component.validationMessage || '';
  }

  return component.validationMessage || '';
}
/**
 * The errors a field shows itself (owner decision C153 (3), for the whole
 * field family as C55): never the browser's bubble, always the component's
 * words in the page's language.
 *
 * - A failed check of the form -- a submit attempt, reportValidity(),
 *   checkValidity() -- shows the error on every wrong field at once, and the
 *   first wrong field of a submit the person made takes the focus
 *   (claimFirstInvalid). The browser's bubble, on the host and on the native
 *   control inside it, is cancelled.
 * - After that, or once the person has changed the value, leaving the field
 *   checks it: a wrong value shows its error, a right one clears it.
 * - While the person types, a shown error goes the moment the value is right;
 *   a still-wrong value keeps it, in the words of what is wrong now. Nothing
 *   is shown while typing into a field that showed no error.
 * - form.reset() takes every shown error away.
 *
 * The page's invalid / error-message win over it. Usage, over FormField:
 * `class SfThing extends ShownValidity(FormField(Element))`; the template
 * reads `sfShownInvalid(invalid)` and `sfShownMessage(invalid, errorMessage)`
 * instead of the bare settings. ShownRequired, its name before C153, stays
 * the same mixin.
 */

const ShownValidity = Base => class extends Base {
  constructor() {
    super();
    this.__sfErrorShown = false;
    this.__sfTouched = false; // The page-wide pass listens from the first field on, so the press that
    // submits is seen before the check it starts; so does the press record.

    fieldCheck();
    fieldPress(); // Capture: the host's own `invalid` and its native control's, which
    // would draw a second bubble; neither bubbles, so only capture sees both.

    this.addEventListener('invalid', event => {
      event.preventDefault();
      if (event.target !== this) return;
      const first = claimFirstInvalid(this);

      if (!this.__sfErrorShown) {
        this.__sfErrorShown = true;
        this.requestComponentUpdate?.('invalid');
      } else {
        this.requestComponentUpdate?.('validity');
      }

      if (first) this.sfFocusFirstInvalid();
    }, true);
    this.addEventListener('input', () => {
      this.__sfTouched = true;
    });
    this.addEventListener('change', () => {
      this.__sfTouched = true;
    });
    this.addEventListener('focusout', event => {
      if (event.relatedTarget && this.contains(event.relatedTarget)) return; // A layer of the field (a list, a picker) holds the focus for it.

      if (this.matches?.(':focus-within')) return;
      if (!this.__sfTouched && !formTried(this)) return; // A press that left the field holds the check until it is over (FO-4);
      // what the press did meanwhile (a reset, a submit) is read then.

      afterPress(() => {
        if (!this.isConnected || !this.__sfTouched && !formTried(this)) return;
        this.sfSyncValidity?.();
        const wrong = this.validity ? !this.validity.valid : false;

        if (wrong !== this.__sfErrorShown) {
          this.__sfErrorShown = wrong;
          this.requestComponentUpdate?.('validity');
        } else if (wrong) {
          this.requestComponentUpdate?.('validity');
        }
      });
    });
  }
  /** The first wrong field of a submit takes the focus, as the browser's check did. */


  sfFocusFirstInvalid() {
    const target = this.focusDelegate?.() || this.sfValidityAnchor?.() || this;

    try {
      target.focus?.();
    } catch {
      /* a field taken out of the page while the check ran */
    }
  } // A shown error goes the moment the value is right, whatever made it right:
  // the person's input or change, a value set from script, a value attribute
  // (C55 acceptance F1 R2, D1). A still-wrong value redraws its words.


  sfSyncFormState() {
    super.sfSyncFormState?.();
    if (!this.__sfErrorShown) return;

    if (this.validity && !this.validity.valid) {
      const words = validityWords(this);

      if (words !== this.__sfShownWords) {
        this.__sfShownWords = words;
        this.requestComponentUpdate?.('validity');
      }

      return;
    }

    this.__sfErrorShown = false;
    this.__sfShownWords = '';
    this.requestComponentUpdate?.('value');
  }
  /** An error is shown now (the page's own invalid aside). */


  get sfErrorShown() {
    return this.__sfErrorShown;
  }
  /** The name before C153, kept for the components that read it. */


  get sfMissingShown() {
    return this.__sfErrorShown;
  }
  /** The invalid state the field draws: the page's, or the one it shows itself. */


  sfShownInvalid(invalid) {
    return Boolean(invalid) || this.__sfErrorShown;
  }
  /** The message under the field: the page's while it says invalid, else the shown error's words. */


  sfShownMessage(invalid, errorMessage) {
    if (invalid) return errorMessage || '';
    if (!this.__sfErrorShown) return '';
    const words = validityWords(this);
    this.__sfShownWords = words;
    return words;
  }

  formResetCallback() {
    const shown = this.__sfErrorShown;
    this.__sfErrorShown = false;
    this.__sfTouched = false;
    this.__sfShownWords = '';
    forgetFormTried(this);
    super.formResetCallback?.();
    if (shown) this.requestComponentUpdate?.('reset');
  }

};
/** The mixin's name before owner decision C153 (C55 acceptance F1). */

const ShownRequired = ShownValidity;

/***/ },

/***/ "9df4a30a8f95"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _component_country_code_data_countries_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("c614c5e30b0d");
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("43090d1c8307");
/* harmony import */ var _component_country_code_js_country_code__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("c0450586011d");
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _component_field_size__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("e6d86f2cd058");
/* harmony import */ var _helpers_form_field__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("38ea8d53f301");
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("d3818183b14c");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("5bb4aa3cb9d1");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("1870676d0d14");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("b847b178e9c4");
/* harmony import */ var _lang_index_mjs__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("312142d84db4");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__, _component_country_code_js_country_code__WEBPACK_IMPORTED_MODULE_2__, _core_js_smart_base__WEBPACK_IMPORTED_MODULE_3__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_4__, _component_field_size__WEBPACK_IMPORTED_MODULE_5__, _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_7__, _js_templates_default__WEBPACK_IMPORTED_MODULE_8__]);
([_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__, _component_country_code_js_country_code__WEBPACK_IMPORTED_MODULE_2__, _core_js_smart_base__WEBPACK_IMPORTED_MODULE_3__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_4__, _component_field_size__WEBPACK_IMPORTED_MODULE_5__, _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_7__, _js_templates_default__WEBPACK_IMPORTED_MODULE_8__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_7__);











 // Only the words on screen ship in the bundle, English only (owner decision
// C282): Russian and every other language come from a language file. The
// title, settings and events stay in the language files for the Studio and the
// docs (localization study LC-2).
// sf-input-country from its component.json (standard simai.smart-component
// 1.3.8 §3, §4, §11, §16.20, §17.1): the settings are attributes and properties
// made by core/js/element-manifest.js, the words are lang/<locale>.json and the
// host is the form control through ElementInternals. What stays here is
// behaviour: the countries, the mask and the list, drawn by the class script.

const CountryCodeElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_4__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_9__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_3___default()),
  lang: _lang_index_mjs__WEBPACK_IMPORTED_MODULE_11__.files,
  source: 'ru',
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_10__
});
const COUNTRY_CODE_SELECTOR = '.sf-country-code';
const COUNTRY_ITEMS = Array.isArray(_component_country_code_data_countries_json__WEBPACK_IMPORTED_MODULE_0__?.items) ? _component_country_code_data_countries_json__WEBPACK_IMPORTED_MODULE_0__.items : [];

class SfCountryCode extends (0,_helpers_form_field__WEBPACK_IMPORTED_MODULE_6__.ShownValidity)((0,_helpers_form_field__WEBPACK_IMPORTED_MODULE_6__.FormField)(CountryCodeElement)) {
  static get props() {
    return { ...super.props,
      ariaLabel: {
        attribute: 'aria-label',
        default: ''
      }
    };
  }

  constructor() {
    super();
    this._countries = null;
    this._boundRoot = null;
    this._renderAttributes = new Set(); // The number in E.164 is the value the form gets: every keystroke and
    // every country chosen tells the form (§17.1) -- FormField listens for them.
  }

  get size() {
    return (0,_component_field_size__WEBPACK_IMPORTED_MODULE_5__.ladderSize)(this.getAttribute('size'));
  } // A telephone inside a field that is already labelled -- a record panel draws
  // the label -- gets its name from the host instead of printing the label a
  // second time above the control.


  get ariaLabel() {
    return this.getProp('ariaLabel') || '';
  } // The current value is what the person typed (§4.3); the attribute is the
  // default, which a form reset returns to.


  get value() {
    const input = this._telInput();

    return input ? String(input.value ?? '') : this.getAttribute('value') || '';
  }

  set value(next) {
    const text = next === null || next === undefined ? '' : String(next);
    if (text) this.setAttribute('value', text);else this.removeAttribute('value');

    const input = this._telInput();

    if (input && input.value !== text) input.value = text;
    this.sfSyncFormState();
  }

  _telInput() {
    return this.querySelector(':scope .sf-country-code-field input') || null;
  } // What the form gets (§17.1 item 2, the form format): the number in E.164,
  // `+79031234567` for the `+7 903 123-45-67` the person sees; nothing for the
  // code alone, nothing while disabled.


  sfFormValue() {
    if (this.disabled) return null;
    const dial = this.querySelector(':scope .sf-country-code')?.dataset?.dialCode || '';
    return (0,_component_country_code_js_country_code__WEBPACK_IMPORTED_MODULE_2__.countryFormValue)(this.value, dial);
  } // §17.2: a required phone has digits after the dial code; the dial code
  // alone is no number.


  fieldValidity() {
    const input = this._telInput();

    const text = this.value.trim();
    const dial = String(this.querySelector(':scope .sf-country-code')?.dataset?.dialCode || '').trim();
    const local = this.showCode && dial && text.startsWith(dial) ? text.slice(dial.length) : text;
    return {
      valueMissing: this.required && !this.disabled && !/\d/u.test(local),
      message: this.sfWord('value-missing'),
      anchor: input
    };
  } // form.reset(): the class script puts the default text and country back
  // after the browser does; the form is told once it has.


  fieldReset() {
    setTimeout(() => this.sfSyncFormState(), 0);
  }

  get open() {
    return this.getBooleanAttr('open', false) || this.getBooleanAttr('active', false);
  }

  get locale() {
    // The country names and the field's own words follow the page unless a
    // locale is given: ru and en from the country table, any other language
    // through Intl (C177 (9): a third language was English).
    return String(this.getAttribute('locale') || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageLanguage)(this)).toLowerCase().split('-')[0] || 'en';
  }

  get useMask() {
    return this.getBooleanAttr('use-mask', false);
  } // Four settings are on by default. They were switched off by the string
  // "false" (multi-country="false"), which is no HTML boolean; each has a
  // presence form now, and the string form is read until 2027-01-01 (1.3.0,
  // change journal attribute-input-country-presence-booleans).


  _presenceOff(presence, former) {
    if (this.hasAttribute(presence) && this.getBooleanAttr(presence, true)) return true;
    if (!this.hasAttribute(former)) return false;
    const on = this.getBooleanAttr(former, true);

    if (!on) {
      (0,_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_7__.noteDeprecated)({
        component: 'sf-input-country',
        kind: 'attribute',
        from: `${former}="false"`,
        to: presence,
        since: '2026-11-11',
        remove_after: '2027-01-01'
      });
    }

    return !on;
  }

  get useCountryMasks() {
    return !this._presenceOff('fixed-mask', 'use-country-masks');
  }

  get showCode() {
    return !this._presenceOff('hide-code', 'show-code');
  }

  get maskStyle() {
    return String(this.getAttribute('mask-style') || 'native').toLowerCase() === 'brackets' ? 'brackets' : 'native';
  }

  get multiCountry() {
    return !this._presenceOff('fixed-country', 'multi-country');
  }

  get iso2() {
    return (0,_component_country_code_js_country_code__WEBPACK_IMPORTED_MODULE_2__.normalizeIso2)(this.getAttribute('iso2'));
  }

  get dialCode() {
    return String(this.getAttribute('dial-code') || '').trim();
  }

  get maskPattern() {
    return String(this.getAttribute('mask-pattern') || '').trim();
  }

  get flagBase() {
    return String(this.getAttribute('flag-base') || '').trim() || (0,_component_country_code_js_country_code__WEBPACK_IMPORTED_MODULE_2__.resolveDefaultFlagBase)();
  }

  get lazyFlags() {
    return !this._presenceOff('eager-flags', 'lazy-flags');
  }

  get showMaskPlaceholder() {
    return this.getBooleanAttr('show-mask-placeholder', false);
  }

  get maskPlaceholderChar() {
    return String(this.getAttribute('mask-placeholder-char') || '_');
  } // The countries on top of the list (owner C87): "RU,KZ,BY". Optional:
  // without the attribute no group at all; an empty one, recent choices alone.


  get preferred() {
    return this.hasAttribute('preferred') ? String(this.getAttribute('preferred') || '') : undefined;
  }

  get maxItems() {
    return Math.trunc(this.getNumberAttr('max-items', 0));
  }

  get countries() {
    return (0,_component_country_code_js_country_code__WEBPACK_IMPORTED_MODULE_2__.normalizeCountriesList)(this._countries, this.locale, this.maxItems);
  }

  set countries(value) {
    this._countries = Array.isArray(value) ? value : null;
    this.requestComponentUpdate('countries');
  }

  templateContext() {
    const props = this.getPropsContext();
    const root = this._boundRoot;
    const preserveOpen = root && !this._renderAttributes.has('open') && !this._renderAttributes.has('active');
    const preserveDisabled = root && !this._renderAttributes.has('disabled');
    return this.createTemplateContext({ ...props,
      // C153 (3): the page's error, or the one the field shows itself (ShownValidity).
      invalid: this.sfShownInvalid(props.invalid),
      errorMessage: this.sfShownMessage(props.invalid, props.errorMessage),
      open: preserveOpen ? root.classList.contains('open') : this.open,
      disabled: preserveDisabled ? !!root.querySelector('input')?.disabled || root.classList.contains('disabled') : this.disabled,
      countries: this.countries.length ? this.countries : (0,_component_country_code_js_country_code__WEBPACK_IMPORTED_MODULE_2__.normalizeCountriesList)(COUNTRY_ITEMS, this.locale, this.maxItems),
      locale: this.locale,
      multiCountry: this.multiCountry,
      useCountryMasks: this.useCountryMasks,
      showCode: this.showCode,
      lazyFlags: this.lazyFlags,
      maskStyle: this.maskStyle,
      iso2: this.iso2,
      flagBase: this.flagBase,
      maxItems: this.maxItems,
      preferred: this.preferred,
      // The host is the form control where the browser has ElementInternals,
      // so the inner tel input carries no name (§17.1 item 6); elsewhere it is
      // named and joins the form the host names, as before.
      controlName: this.sfInternals ? '' : this.name,
      controlForm: this.sfInternals ? '' : this.getAttribute('form') || ''
    });
  }

  onDisconnected() {
    if (this._boundRoot) {
      (0,_component_country_code_js_country_code__WEBPACK_IMPORTED_MODULE_2__.unbindCountryCode)(this._boundRoot);
      this._boundRoot = null;
    }
  }

  beforeRender(changedAttributes = []) {
    this._renderAttributes = new Set(changedAttributes);
  }

  afterRender(callback) {
    if (typeof callback === 'function') return super.afterRender(callback);

    if (this._boundRoot) {
      (0,_component_country_code_js_country_code__WEBPACK_IMPORTED_MODULE_2__.unbindCountryCode)(this._boundRoot);
      this._boundRoot = null;
    }

    this._boundRoot = this.querySelector(COUNTRY_CODE_SELECTOR);

    if (this._boundRoot) {
      (0,_component_country_code_js_country_code__WEBPACK_IMPORTED_MODULE_2__.bindCountryCode)(this._boundRoot, {
        resetCountry: this._renderAttributes.has('iso2') || this._renderAttributes.has('dial-code'),
        countries: this.countries,
        maskPattern: this.maskPattern
      });
    }

    this.sfSyncFormState();
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_8__.renderCountryCodeTemplate)(this.templateContext());
  }

  get state() {
    const root = this.querySelector(COUNTRY_CODE_SELECTOR);
    const input = root?.querySelector?.('.sf-country-code-field input') || null;
    return {
      value: input?.value || '',
      iso2: root?.dataset?.iso2 || '',
      dialCode: root?.dataset?.dialCode || '',
      open: root?.classList?.contains('open') || false,
      disabled: root?.classList?.contains('disabled') || false
    };
  }

  setState(nextState = {}) {
    const root = this.querySelector(COUNTRY_CODE_SELECTOR);
    return (0,_component_country_code_js_country_code__WEBPACK_IMPORTED_MODULE_2__.setCountryCodeState)(root, nextState);
  }

}

SfCountryCode.define('sf-input-country');
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "5bb4aa3cb9d1"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderCountryCodeTemplate: () => (/* binding */ renderCountryCodeTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var _helpers_field_help__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("f39dc444b059");
/* harmony import */ var _component_field_contract__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("e138a730fd7c");
/* harmony import */ var _component_field_size__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("e6d86f2cd058");
/* harmony import */ var _component_country_code_js_country_code__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("c0450586011d");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, _helpers_field_help__WEBPACK_IMPORTED_MODULE_1__, _component_field_contract__WEBPACK_IMPORTED_MODULE_2__, _component_field_size__WEBPACK_IMPORTED_MODULE_3__, _component_country_code_js_country_code__WEBPACK_IMPORTED_MODULE_4__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, _helpers_field_help__WEBPACK_IMPORTED_MODULE_1__, _component_field_contract__WEBPACK_IMPORTED_MODULE_2__, _component_field_size__WEBPACK_IMPORTED_MODULE_3__, _component_country_code_js_country_code__WEBPACK_IMPORTED_MODULE_4__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);




 // A flag of the list is the browser's own lazy image: the address is written
// with the row, and the browser fetches it when the row comes near the view (a
// closed list fetches nothing). The class script used to set the address only
// when a press opened the list, so a list drawn open (open) kept empty images
// (docs pre-check 2026-11-10 CC-02). eager-flags asks for every flag at once.
// A file that does not come draws the country's emoji in its place, as the
// field's own flag does.

function flagFallback(event) {
  const img = event.currentTarget;
  const holder = img?.parentElement;
  if (holder && img.dataset.flagFallback) holder.textContent = img.dataset.flagFallback;
}

function flagTemplate(country, flagBase = '', lazy = true) {
  const iso2 = String(country?.iso2 || '').trim().toLowerCase();
  const fallback = country?.flagEmoji || '';
  const src = iso2 && flagBase ? `${flagBase}/${iso2}.svg` : '';

  if (!src) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${fallback}`;
  }

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <img
      alt=${country?.iso2 ? `${country.iso2} flag` : 'flag'}
      decoding="async"
      loading=${lazy ? 'lazy' : 'eager'}
      src=${src}
      data-flag-src=${src}
      data-loaded="1"
      data-flag-fallback=${fallback}
      @error=${flagFallback}
    />
  `;
}

function renderCountryCodeTemplate(context) {
  const {
    size,
    label,
    required,
    hint,
    value,
    placeholder,
    disabled,
    open,
    countries,
    locale,
    multiCountry,
    showCode,
    maskStyle,
    useMask,
    useCountryMasks,
    iso2,
    dialCode,
    maskPattern,
    flagBase,
    lazyFlags,
    showMaskPlaceholder,
    maskPlaceholderChar,
    maxItems,
    ariaLabel
  } = context; // The line under the field is sf-input's (fields ladder, 2026-11-14): the
  // help, or the error in its place while the field is invalid and says why.

  const field = (0,_component_field_contract__WEBPACK_IMPORTED_MODULE_2__.createFieldContract)(context.component, {
    prefix: 'sf-input-country',
    invalid: context.invalid,
    hint,
    errorMessage: context.errorMessage
  });
  const messageIsError = Boolean(field.invalid && context.errorMessage);
  const rootClasses = ['sf-country-code', `sf-country-code--size-${size}`, 'flex', 'flex-col'];
  if (context.rootClass) rootClasses.push(context.rootClass); // The field's width (C396, WM-4); none without the setting.

  if ((0,_component_field_size__WEBPACK_IMPORTED_MODULE_3__.fieldWidthClass)(context.width)) rootClasses.push((0,_component_field_size__WEBPACK_IMPORTED_MODULE_3__.fieldWidthClass)(context.width));
  if (field.invalid) rootClasses.push('error');
  if (disabled) rootClasses.push('disabled');
  if (open) rootClasses.push('open');
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <label
      class=${rootClasses.join(' ')}
      style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      data-locale=${locale}
      data-use-mask=${String(useMask)}
      data-use-country-masks=${String(useCountryMasks)}
      data-show-code=${String(showCode)}
      data-mask-style=${maskStyle}
      data-multi-country=${String(multiCountry)}
      data-lazy-flags=${String(lazyFlags)}
      data-show-mask-placeholder=${String(showMaskPlaceholder)}
      data-mask-placeholder-char=${maskPlaceholderChar}
      data-iso2=${iso2 || ''}
      data-dial-code=${dialCode || ''}
      data-mask-pattern=${maskPattern || ''}
      data-flag-base=${flagBase || ''}
      data-max-items=${String(maxItems || 0)}
      data-preferred=${context.preferred === undefined ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : context.preferred}
    >
      ${label // No label, no label row: a lone star over a control names nothing, and
  // the row left an empty line above every phone field in a panel that
  // draws the labels itself.
  ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
          <span class="sf-country-code-label flex">
            <span class="sf-country-code-text">${label}</span>
            ${required ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-country-code-required" aria-hidden="true">*</span>` : ''}
            ${(0,_helpers_field_help__WEBPACK_IMPORTED_MODULE_1__.renderFieldHelp)({
    help: context.help,
    label,
    size,
    className: 'sf-country-code-help',
    component: context.component
  })}
          </span>` : ''}

      <span class="sf-country-code-field transition flex items-center">
        <span class="sf-country-code-left flex items-center">
          <div class="sf-country-code-flag-icon" aria-hidden="true"></div>
          ${multiCountry // The small caret after the flag says the flag opens the list
  // (owner C87, variant V4 with the caret).
  ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class="sf-icon sf-country-code-caret" aria-hidden="true">arrow_drop_down</i>` : ''}
        </span>
        <input
          type="tel"
          name=${context.controlName || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          form=${context.controlForm || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          ?required=${required}
          .defaultValue=${value}
          .value=${value}
          placeholder=${placeholder}
          ?disabled=${disabled}
          aria-label=${!label && ariaLabel ? ariaLabel : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          aria-invalid=${field.invalid ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
          aria-errormessage=${messageIsError ? field.messageId : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        />
      </span>

      ${multiCountry ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
            <span class="sf-country-code-list">
              <span class="sf-country-code-items flex flex-col">
                ${countries.map(country => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                    <span
                      class="sf-country-code-item flex items-center transition"
                      data-iso2=${country.iso2 || ''}
                      data-code=${country.dialCode || country.code || ''}
                      data-mask-pattern=${country.maskPattern || ''}
                    >
                      <div class="sf-country-code-flag" aria-hidden="true">
                        ${flagTemplate(country, flagBase, lazyFlags !== false)}
                      </div>
                      <span>
                        ${country.label || `${(0,_component_country_code_js_country_code__WEBPACK_IMPORTED_MODULE_4__.countryName)(country, locale)} (${country.dialCode || country.code || ''})`}
                      </span>
                    </span>
                  `)}
              </span>
            </span>
          ` : ''}

      ${field.message ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-country-code-hint" id=${field.messageId}
                     data-field-message=${messageIsError ? 'error' : 'hint'}>${field.message}</span>` : ''}
    </label>
  `;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "5dcef5de40cf"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("alias-table", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("alias-table", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "d3818183b14c"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("deprecations", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("deprecations", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "5b7d7695b41b"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("element-manifest", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("element-manifest", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "e92fd2d1a38c"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("instance-path", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("instance-path", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "2a080a730149"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("lit", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "bf0cea966575"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("open-surface-mark", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("open-surface-mark", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "43090d1c8307"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("page-language", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("page-language", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "116963e5e31b"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("position", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("position", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "deb1a4d61565"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("smart-base", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("smart-base", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "b0314d85fd3a"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   files: () => (/* binding */ files)
/* harmony export */ });
/* harmony import */ var _en_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("30e4802f0b2b");
// Written by scripts/build-language-packs.mjs from src/core/lang/built-in.json
// (owner decision C282); do not edit. The words this bundle carries: the
// built-in languages' (en); every other language comes from
// a language file (core/lang/<code>.js or its parts).


const files = { en: { runtime: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime } };

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ en: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime });


/***/ },

/***/ "312142d84db4"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   files: () => (/* binding */ files)
/* harmony export */ });
/* harmony import */ var _en_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("7aba30a6eb07");
// Written by scripts/build-language-packs.mjs from src/core/lang/built-in.json
// (owner decision C282); do not edit. The words this bundle carries: the
// built-in languages' (en); every other language comes from
// a language file (core/lang/<code>.js or its parts).


const files = { en: { runtime: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime } };

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ en: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime });


/***/ },

/***/ "c614c5e30b0d"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"generatedAt":"2026-03-05T11:52:50.322Z","source":["google-libphonenumber","i18n-iso-countries"],"total":243,"items":[{"iso2":"AU","dialCode":"+61","nameEn":"Australia","flagEmoji":"🇦🇺","maskPattern":"+00 0 0000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"AT","dialCode":"+43","nameEn":"Austria","flagEmoji":"🇦🇹","maskPattern":"+00 0 000000000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"AZ","dialCode":"+994","nameEn":"Azerbaijan","flagEmoji":"🇦🇿","maskPattern":"+000 00 000 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"AX","dialCode":"+358","nameEn":"Åland Islands","flagEmoji":"🇦🇽","maskPattern":"+000 00 0000000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"AL","dialCode":"+355","nameEn":"Albania","flagEmoji":"🇦🇱","maskPattern":"+000 00 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"DZ","dialCode":"+213","nameEn":"Algeria","flagEmoji":"🇩🇿","maskPattern":"+000 00 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"AS","dialCode":"+1","nameEn":"American Samoa","flagEmoji":"🇦🇸","maskPattern":"+0 000-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"AI","dialCode":"+1","nameEn":"Anguilla","flagEmoji":"🇦🇮","maskPattern":"+0 000-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"AO","dialCode":"+244","nameEn":"Angola","flagEmoji":"🇦🇴","maskPattern":"+000 000 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"AD","dialCode":"+376","nameEn":"Andorra","flagEmoji":"🇦🇩","maskPattern":"+000 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"AG","dialCode":"+1","nameEn":"Antigua and Barbuda","flagEmoji":"🇦🇬","maskPattern":"+0 000-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"AR","dialCode":"+54","nameEn":"Argentina","flagEmoji":"🇦🇷","maskPattern":"+00 00 0000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"AM","dialCode":"+374","nameEn":"Armenia","flagEmoji":"🇦🇲","maskPattern":"+000 00 000000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"AW","dialCode":"+297","nameEn":"Aruba","flagEmoji":"🇦🇼","maskPattern":"+000 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"AF","dialCode":"+93","nameEn":"Afghanistan","flagEmoji":"🇦🇫","maskPattern":"+00 00 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"BS","dialCode":"+1","nameEn":"Bahamas","flagEmoji":"🇧🇸","maskPattern":"+0 000-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"BD","dialCode":"+880","nameEn":"Bangladesh","flagEmoji":"🇧🇩","maskPattern":"+000 0-0000000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"BB","dialCode":"+1","nameEn":"Barbados","flagEmoji":"🇧🇧","maskPattern":"+0 000-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"BH","dialCode":"+973","nameEn":"Bahrain","flagEmoji":"🇧🇭","maskPattern":"+000 0000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"BY","dialCode":"+375","nameEn":"Belarus","flagEmoji":"🇧🇾","maskPattern":"+000 000 00-00-00","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"BZ","dialCode":"+501","nameEn":"Belize","flagEmoji":"🇧🇿","maskPattern":"+000 000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"BE","dialCode":"+32","nameEn":"Belgium","flagEmoji":"🇧🇪","maskPattern":"+00 00 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"BJ","dialCode":"+229","nameEn":"Benin","flagEmoji":"🇧🇯","maskPattern":"+000 00 00 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"BM","dialCode":"+1","nameEn":"Bermuda","flagEmoji":"🇧🇲","maskPattern":"+0 000-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"BG","dialCode":"+359","nameEn":"Bulgaria","flagEmoji":"🇧🇬","maskPattern":"+000 0 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"BO","dialCode":"+591","nameEn":"Bolivia","flagEmoji":"🇧🇴","maskPattern":"+000 0 0000000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"BQ","dialCode":"+599","nameEn":"Bonaire, Sint Eustatius and Saba","flagEmoji":"🇧🇶","maskPattern":"+000 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"BA","dialCode":"+387","nameEn":"Bosnia and Herzegovina","flagEmoji":"🇧🇦","maskPattern":"+000 00 000-000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"BW","dialCode":"+267","nameEn":"Botswana","flagEmoji":"🇧🇼","maskPattern":"+000 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"BR","dialCode":"+55","nameEn":"Brazil","flagEmoji":"🇧🇷","maskPattern":"+00 00 0000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"IO","dialCode":"+246","nameEn":"British Indian Ocean Territory","flagEmoji":"🇮🇴","maskPattern":"+000 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"BN","dialCode":"+673","nameEn":"Brunei Darussalam","flagEmoji":"🇧🇳","maskPattern":"+000 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"BF","dialCode":"+226","nameEn":"Burkina Faso","flagEmoji":"🇧🇫","maskPattern":"+000 00 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"BI","dialCode":"+257","nameEn":"Burundi","flagEmoji":"🇧🇮","maskPattern":"+000 00 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"BT","dialCode":"+975","nameEn":"Bhutan","flagEmoji":"🇧🇹","maskPattern":"+000 0 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"VU","dialCode":"+678","nameEn":"Vanuatu","flagEmoji":"🇻🇺","maskPattern":"+000 00000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"VA","dialCode":"+39","nameEn":"Holy See (Vatican City State)","flagEmoji":"🇻🇦","maskPattern":"+00 00 0000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"GB","dialCode":"+44","nameEn":"United Kingdom","flagEmoji":"🇬🇧","maskPattern":"+00 000 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"HU","dialCode":"+36","nameEn":"Hungary","flagEmoji":"🇭🇺","maskPattern":"+00 0 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"VE","dialCode":"+58","nameEn":"Venezuela","flagEmoji":"🇻🇪","maskPattern":"+00 000-0000000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"VG","dialCode":"+1","nameEn":"Virgin Islands, British","flagEmoji":"🇻🇬","maskPattern":"+0 000-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"VI","dialCode":"+1","nameEn":"Virgin Islands, U.S.","flagEmoji":"🇻🇮","maskPattern":"+0 000-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"TL","dialCode":"+670","nameEn":"Timor-Leste","flagEmoji":"🇹🇱","maskPattern":"+000 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"VN","dialCode":"+84","nameEn":"Vietnam","flagEmoji":"🇻🇳","maskPattern":"+00 000 0000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"GA","dialCode":"+241","nameEn":"Gabon","flagEmoji":"🇬🇦","maskPattern":"+000 00 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"HT","dialCode":"+509","nameEn":"Haiti","flagEmoji":"🇭🇹","maskPattern":"+000 00 00 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"GY","dialCode":"+592","nameEn":"Guyana","flagEmoji":"🇬🇾","maskPattern":"+000 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"GM","dialCode":"+220","nameEn":"Republic of The Gambia","flagEmoji":"🇬🇲","maskPattern":"+000 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"GH","dialCode":"+233","nameEn":"Ghana","flagEmoji":"🇬🇭","maskPattern":"+000 00 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"GP","dialCode":"+590","nameEn":"Guadeloupe","flagEmoji":"🇬🇵","maskPattern":"+000 000 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"GT","dialCode":"+502","nameEn":"Guatemala","flagEmoji":"🇬🇹","maskPattern":"+000 0000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"GF","dialCode":"+594","nameEn":"French Guiana","flagEmoji":"🇬🇫","maskPattern":"+000 000 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"GN","dialCode":"+224","nameEn":"Guinea","flagEmoji":"🇬🇳","maskPattern":"+000 00 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"GW","dialCode":"+245","nameEn":"Guinea-Bissau","flagEmoji":"🇬🇼","maskPattern":"+000 000 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"DE","dialCode":"+49","nameEn":"Germany","flagEmoji":"🇩🇪","maskPattern":"+00 00 000000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"GG","dialCode":"+44","nameEn":"Guernsey","flagEmoji":"🇬🇬","maskPattern":"+00 0000 000000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"GI","dialCode":"+350","nameEn":"Gibraltar","flagEmoji":"🇬🇮","maskPattern":"+000 000 00000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"HN","dialCode":"+504","nameEn":"Honduras","flagEmoji":"🇭🇳","maskPattern":"+000 0000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"HK","dialCode":"+852","nameEn":"Hong Kong","flagEmoji":"🇭🇰","maskPattern":"+000 0000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"PS","dialCode":"+970","nameEn":"State of Palestine","flagEmoji":"🇵🇸","maskPattern":"+000 0 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"GD","dialCode":"+1","nameEn":"Grenada","flagEmoji":"🇬🇩","maskPattern":"+0 000-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"GL","dialCode":"+299","nameEn":"Greenland","flagEmoji":"🇬🇱","maskPattern":"+000 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"GR","dialCode":"+30","nameEn":"Greece","flagEmoji":"🇬🇷","maskPattern":"+00 00 0000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"GE","dialCode":"+995","nameEn":"Georgia","flagEmoji":"🇬🇪","maskPattern":"+000 00 000 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"GU","dialCode":"+1","nameEn":"Guam","flagEmoji":"🇬🇺","maskPattern":"+0 000-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"DK","dialCode":"+45","nameEn":"Denmark","flagEmoji":"🇩🇰","maskPattern":"+00 00 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"CD","dialCode":"+243","nameEn":"Democratic Republic of the Congo","flagEmoji":"🇨🇩","maskPattern":"+000 00 00000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"JE","dialCode":"+44","nameEn":"Jersey","flagEmoji":"🇯🇪","maskPattern":"+00 0000 000000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"DJ","dialCode":"+253","nameEn":"Djibouti","flagEmoji":"🇩🇯","maskPattern":"+000 00 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"DM","dialCode":"+1","nameEn":"Dominica","flagEmoji":"🇩🇲","maskPattern":"+0 000-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"DO","dialCode":"+1","nameEn":"Dominican Republic","flagEmoji":"🇩🇴","maskPattern":"+0 000-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"EG","dialCode":"+20","nameEn":"Egypt","flagEmoji":"🇪🇬","maskPattern":"+00 0 00000000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"ZM","dialCode":"+260","nameEn":"Zambia","flagEmoji":"🇿🇲","maskPattern":"+000 000 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"ZW","dialCode":"+263","nameEn":"Zimbabwe","flagEmoji":"🇿🇼","maskPattern":"+000 00 00000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"IL","dialCode":"+972","nameEn":"Israel","flagEmoji":"🇮🇱","maskPattern":"+000 0-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"IN","dialCode":"+91","nameEn":"India","flagEmoji":"🇮🇳","maskPattern":"+00 00000 00000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"ID","dialCode":"+62","nameEn":"Indonesia","flagEmoji":"🇮🇩","maskPattern":"+00 00 0000000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"JO","dialCode":"+962","nameEn":"Jordan","flagEmoji":"🇯🇴","maskPattern":"+000 0 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"IQ","dialCode":"+964","nameEn":"Iraq","flagEmoji":"🇮🇶","maskPattern":"+000 0 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"IR","dialCode":"+98","nameEn":"Islamic Republic of Iran","flagEmoji":"🇮🇷","maskPattern":"+00 00 0000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"IE","dialCode":"+353","nameEn":"Ireland","flagEmoji":"🇮🇪","maskPattern":"+000 00 00000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"IS","dialCode":"+354","nameEn":"Iceland","flagEmoji":"🇮🇸","maskPattern":"+000 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"ES","dialCode":"+34","nameEn":"Spain","flagEmoji":"🇪🇸","maskPattern":"+00 000 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"IT","dialCode":"+39","nameEn":"Italy","flagEmoji":"🇮🇹","maskPattern":"+00 00 0000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"YE","dialCode":"+967","nameEn":"Yemen","flagEmoji":"🇾🇪","maskPattern":"+000 0 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"CV","dialCode":"+238","nameEn":"Cape Verde","flagEmoji":"🇨🇻","maskPattern":"+000 000 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"KZ","dialCode":"+7","nameEn":"Kazakhstan","flagEmoji":"🇰🇿","maskPattern":"+0 000 000-00-00","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"KH","dialCode":"+855","nameEn":"Cambodia","flagEmoji":"🇰🇭","maskPattern":"+000 00 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"CM","dialCode":"+237","nameEn":"Cameroon","flagEmoji":"🇨🇲","maskPattern":"+000 0 00 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"CA","dialCode":"+1","nameEn":"Canada","flagEmoji":"🇨🇦","maskPattern":"+0 000-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"QA","dialCode":"+974","nameEn":"Qatar","flagEmoji":"🇶🇦","maskPattern":"+000 0000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"KE","dialCode":"+254","nameEn":"Kenya","flagEmoji":"🇰🇪","maskPattern":"+000 00 0000000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"CY","dialCode":"+357","nameEn":"Cyprus","flagEmoji":"🇨🇾","maskPattern":"+000 00 000000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"KG","dialCode":"+996","nameEn":"Kyrgyzstan","flagEmoji":"🇰🇬","maskPattern":"+000 000 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"KI","dialCode":"+686","nameEn":"Kiribati","flagEmoji":"🇰🇮","maskPattern":"+000 00000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"KP","dialCode":"+850","nameEn":"North Korea","flagEmoji":"🇰🇵","maskPattern":"+000 0 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"CN","dialCode":"+86","nameEn":"People\'s Republic of China","flagEmoji":"🇨🇳","maskPattern":"+00 00 0000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"CC","dialCode":"+61","nameEn":"Cocos (Keeling) Islands","flagEmoji":"🇨🇨","maskPattern":"+00 0 0000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"CO","dialCode":"+57","nameEn":"Colombia","flagEmoji":"🇨🇴","maskPattern":"+00 000 0000000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"KM","dialCode":"+269","nameEn":"Comoros","flagEmoji":"🇰🇲","maskPattern":"+000 000 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"XK","dialCode":"+383","nameEn":"Kosovo","flagEmoji":"🇽🇰","maskPattern":"+000 00 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"CR","dialCode":"+506","nameEn":"Costa Rica","flagEmoji":"🇨🇷","maskPattern":"+000 0000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"CI","dialCode":"+225","nameEn":"Cote d\'Ivoire","flagEmoji":"🇨🇮","maskPattern":"+000 00 00 0 00000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"CU","dialCode":"+53","nameEn":"Cuba","flagEmoji":"🇨🇺","maskPattern":"+00 0 0000000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"KW","dialCode":"+965","nameEn":"Kuwait","flagEmoji":"🇰🇼","maskPattern":"+000 0000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"CW","dialCode":"+599","nameEn":"Curaçao","flagEmoji":"🇨🇼","maskPattern":"+000 0 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"LA","dialCode":"+856","nameEn":"Lao People\'s Democratic Republic","flagEmoji":"🇱🇦","maskPattern":"+000 00 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"LV","dialCode":"+371","nameEn":"Latvia","flagEmoji":"🇱🇻","maskPattern":"+000 00 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"LS","dialCode":"+266","nameEn":"Lesotho","flagEmoji":"🇱🇸","maskPattern":"+000 0000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"LR","dialCode":"+231","nameEn":"Liberia","flagEmoji":"🇱🇷","maskPattern":"+000 00 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"LB","dialCode":"+961","nameEn":"Lebanon","flagEmoji":"🇱🇧","maskPattern":"+000 0 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"LY","dialCode":"+218","nameEn":"Libya","flagEmoji":"🇱🇾","maskPattern":"+000 00-0000000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"LT","dialCode":"+370","nameEn":"Lithuania","flagEmoji":"🇱🇹","maskPattern":"+000 000 00000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"LI","dialCode":"+423","nameEn":"Liechtenstein","flagEmoji":"🇱🇮","maskPattern":"+000 000 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"LU","dialCode":"+352","nameEn":"Luxembourg","flagEmoji":"🇱🇺","maskPattern":"+000 00 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"MU","dialCode":"+230","nameEn":"Mauritius","flagEmoji":"🇲🇺","maskPattern":"+000 0000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"MR","dialCode":"+222","nameEn":"Mauritania","flagEmoji":"🇲🇷","maskPattern":"+000 00 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"MG","dialCode":"+261","nameEn":"Madagascar","flagEmoji":"🇲🇬","maskPattern":"+000 00 00 000 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"YT","dialCode":"+262","nameEn":"Mayotte","flagEmoji":"🇾🇹","maskPattern":"+000 000 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"MO","dialCode":"+853","nameEn":"Macao","flagEmoji":"🇲🇴","maskPattern":"+000 0000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"MW","dialCode":"+265","nameEn":"Malawi","flagEmoji":"🇲🇼","maskPattern":"+000 0 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"MY","dialCode":"+60","nameEn":"Malaysia","flagEmoji":"🇲🇾","maskPattern":"+00 0-0000 0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"ML","dialCode":"+223","nameEn":"Mali","flagEmoji":"🇲🇱","maskPattern":"+000 00 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"MV","dialCode":"+960","nameEn":"Maldives","flagEmoji":"🇲🇻","maskPattern":"+000 000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"MT","dialCode":"+356","nameEn":"Malta","flagEmoji":"🇲🇹","maskPattern":"+000 0000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"MA","dialCode":"+212","nameEn":"Morocco","flagEmoji":"🇲🇦","maskPattern":"+000 0 00 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"MQ","dialCode":"+596","nameEn":"Martinique","flagEmoji":"🇲🇶","maskPattern":"+000 000 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"MH","dialCode":"+692","nameEn":"Marshall Islands","flagEmoji":"🇲🇭","maskPattern":"+000 000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"MX","dialCode":"+52","nameEn":"Mexico","flagEmoji":"🇲🇽","maskPattern":"+00 000 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"FM","dialCode":"+691","nameEn":"Micronesia, Federated States of","flagEmoji":"🇫🇲","maskPattern":"+000 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"MZ","dialCode":"+258","nameEn":"Mozambique","flagEmoji":"🇲🇿","maskPattern":"+000 00 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"MD","dialCode":"+373","nameEn":"Moldova, Republic of","flagEmoji":"🇲🇩","maskPattern":"+000 00 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"MC","dialCode":"+377","nameEn":"Monaco","flagEmoji":"🇲🇨","maskPattern":"+000 00 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"MN","dialCode":"+976","nameEn":"Mongolia","flagEmoji":"🇲🇳","maskPattern":"+000 0000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"MS","dialCode":"+1","nameEn":"Montserrat","flagEmoji":"🇲🇸","maskPattern":"+0 000-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"MM","dialCode":"+95","nameEn":"Myanmar","flagEmoji":"🇲🇲","maskPattern":"+00 0 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"NA","dialCode":"+264","nameEn":"Namibia","flagEmoji":"🇳🇦","maskPattern":"+000 00 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"NR","dialCode":"+674","nameEn":"Nauru","flagEmoji":"🇳🇷","maskPattern":"+000 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"NP","dialCode":"+977","nameEn":"Nepal","flagEmoji":"🇳🇵","maskPattern":"+000 0-0000000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"NE","dialCode":"+227","nameEn":"Niger","flagEmoji":"🇳🇪","maskPattern":"+000 00 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"NG","dialCode":"+234","nameEn":"Nigeria","flagEmoji":"🇳🇬","maskPattern":"+000 0000 00 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"NL","dialCode":"+31","nameEn":"Netherlands","flagEmoji":"🇳🇱","maskPattern":"+00 00 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"NI","dialCode":"+505","nameEn":"Nicaragua","flagEmoji":"🇳🇮","maskPattern":"+000 0000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"NU","dialCode":"+683","nameEn":"Niue","flagEmoji":"🇳🇺","maskPattern":"+000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"NZ","dialCode":"+64","nameEn":"New Zealand","flagEmoji":"🇳🇿","maskPattern":"+00 0 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"NC","dialCode":"+687","nameEn":"New Caledonia","flagEmoji":"🇳🇨","maskPattern":"+000 00.00.00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"NO","dialCode":"+47","nameEn":"Norway","flagEmoji":"🇳🇴","maskPattern":"+00 00 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"AE","dialCode":"+971","nameEn":"United Arab Emirates","flagEmoji":"🇦🇪","maskPattern":"+000 0 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"OM","dialCode":"+968","nameEn":"Oman","flagEmoji":"🇴🇲","maskPattern":"+000 00 000000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"IM","dialCode":"+44","nameEn":"Isle of Man","flagEmoji":"🇮🇲","maskPattern":"+00 0000 000000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"NF","dialCode":"+672","nameEn":"Norfolk Island","flagEmoji":"🇳🇫","maskPattern":"+000 00 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"CX","dialCode":"+61","nameEn":"Christmas Island","flagEmoji":"🇨🇽","maskPattern":"+00 0 0000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"KY","dialCode":"+1","nameEn":"Cayman Islands","flagEmoji":"🇰🇾","maskPattern":"+0 000-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"CK","dialCode":"+682","nameEn":"Cook Islands","flagEmoji":"🇨🇰","maskPattern":"+000 00 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"SH","dialCode":"+290","nameEn":"Saint Helena","flagEmoji":"🇸🇭","maskPattern":"+000 00000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"PK","dialCode":"+92","nameEn":"Pakistan","flagEmoji":"🇵🇰","maskPattern":"+00 00 00000000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"PW","dialCode":"+680","nameEn":"Palau","flagEmoji":"🇵🇼","maskPattern":"+000 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"PA","dialCode":"+507","nameEn":"Panama","flagEmoji":"🇵🇦","maskPattern":"+000 000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"PG","dialCode":"+675","nameEn":"Papua New Guinea","flagEmoji":"🇵🇬","maskPattern":"+000 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"PY","dialCode":"+595","nameEn":"Paraguay","flagEmoji":"🇵🇾","maskPattern":"+000 00 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"PE","dialCode":"+51","nameEn":"Peru","flagEmoji":"🇵🇪","maskPattern":"+00 0 0000000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"PL","dialCode":"+48","nameEn":"Poland","flagEmoji":"🇵🇱","maskPattern":"+00 00 000 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"PT","dialCode":"+351","nameEn":"Portugal","flagEmoji":"🇵🇹","maskPattern":"+000 00 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"PR","dialCode":"+1","nameEn":"Puerto Rico","flagEmoji":"🇵🇷","maskPattern":"+0 000-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"CG","dialCode":"+242","nameEn":"Republic of the Congo","flagEmoji":"🇨🇬","maskPattern":"+000 00 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"KR","dialCode":"+82","nameEn":"South Korea","flagEmoji":"🇰🇷","maskPattern":"+00 0-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"RE","dialCode":"+262","nameEn":"Reunion","flagEmoji":"🇷🇪","maskPattern":"+000 000 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"RU","dialCode":"+7","nameEn":"Russian Federation","flagEmoji":"🇷🇺","maskPattern":"+0 000 000-00-00","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"RW","dialCode":"+250","nameEn":"Rwanda","flagEmoji":"🇷🇼","maskPattern":"+000 000 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"RO","dialCode":"+40","nameEn":"Romania","flagEmoji":"🇷🇴","maskPattern":"+00 00 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"EH","dialCode":"+212","nameEn":"Western Sahara","flagEmoji":"🇪🇭","maskPattern":"+000 0 00 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"SV","dialCode":"+503","nameEn":"El Salvador","flagEmoji":"🇸🇻","maskPattern":"+000 0000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"WS","dialCode":"+685","nameEn":"Samoa","flagEmoji":"🇼🇸","maskPattern":"+000 00000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"SM","dialCode":"+378","nameEn":"San Marino","flagEmoji":"🇸🇲","maskPattern":"+000 0000 000000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"ST","dialCode":"+239","nameEn":"Sao Tome and Principe","flagEmoji":"🇸🇹","maskPattern":"+000 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"SA","dialCode":"+966","nameEn":"Saudi Arabia","flagEmoji":"🇸🇦","maskPattern":"+000 00 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"MK","dialCode":"+389","nameEn":"The Republic of North Macedonia","flagEmoji":"🇲🇰","maskPattern":"+000 0 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"MP","dialCode":"+1","nameEn":"Northern Mariana Islands","flagEmoji":"🇲🇵","maskPattern":"+0 000-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"SC","dialCode":"+248","nameEn":"Seychelles","flagEmoji":"🇸🇨","maskPattern":"+000 0 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"BL","dialCode":"+590","nameEn":"Saint Barthélemy","flagEmoji":"🇧🇱","maskPattern":"+000 000 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"MF","dialCode":"+590","nameEn":"Saint Martin (French part)","flagEmoji":"🇲🇫","maskPattern":"+000 000 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"PM","dialCode":"+508","nameEn":"Saint Pierre and Miquelon","flagEmoji":"🇵🇲","maskPattern":"+000 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"SN","dialCode":"+221","nameEn":"Senegal","flagEmoji":"🇸🇳","maskPattern":"+000 00 000 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"VC","dialCode":"+1","nameEn":"Saint Vincent and the Grenadines","flagEmoji":"🇻🇨","maskPattern":"+0 000-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"KN","dialCode":"+1","nameEn":"Saint Kitts and Nevis","flagEmoji":"🇰🇳","maskPattern":"+0 000-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"LC","dialCode":"+1","nameEn":"Saint Lucia","flagEmoji":"🇱🇨","maskPattern":"+0 000-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"RS","dialCode":"+381","nameEn":"Serbia","flagEmoji":"🇷🇸","maskPattern":"+000 00 000000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"SG","dialCode":"+65","nameEn":"Singapore","flagEmoji":"🇸🇬","maskPattern":"+00 0000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"SX","dialCode":"+1","nameEn":"Sint Maarten (Dutch part)","flagEmoji":"🇸🇽","maskPattern":"+0 000-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"SY","dialCode":"+963","nameEn":"Syrian Arab Republic","flagEmoji":"🇸🇾","maskPattern":"+000 00 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"SK","dialCode":"+421","nameEn":"Slovakia","flagEmoji":"🇸🇰","maskPattern":"+000 0/000 000 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"SI","dialCode":"+386","nameEn":"Slovenia","flagEmoji":"🇸🇮","maskPattern":"+000 0 000 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"SB","dialCode":"+677","nameEn":"Solomon Islands","flagEmoji":"🇸🇧","maskPattern":"+000 00000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"SO","dialCode":"+252","nameEn":"Somalia","flagEmoji":"🇸🇴","maskPattern":"+000 0 000000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"SD","dialCode":"+249","nameEn":"Sudan","flagEmoji":"🇸🇩","maskPattern":"+000 00 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"SR","dialCode":"+597","nameEn":"Suriname","flagEmoji":"🇸🇷","maskPattern":"+000 000-000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"US","dialCode":"+1","nameEn":"United States of America","flagEmoji":"🇺🇸","maskPattern":"+0 000-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"SL","dialCode":"+232","nameEn":"Sierra Leone","flagEmoji":"🇸🇱","maskPattern":"+000 00 000000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"TJ","dialCode":"+992","nameEn":"Tajikistan","flagEmoji":"🇹🇯","maskPattern":"+000 000 00 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"TH","dialCode":"+66","nameEn":"Thailand","flagEmoji":"🇹🇭","maskPattern":"+00 0 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"TW","dialCode":"+886","nameEn":"Taiwan, Province of China","flagEmoji":"🇹🇼","maskPattern":"+000 0 0000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"TZ","dialCode":"+255","nameEn":"United Republic of Tanzania","flagEmoji":"🇹🇿","maskPattern":"+000 00 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"TC","dialCode":"+1","nameEn":"Turks and Caicos Islands","flagEmoji":"🇹🇨","maskPattern":"+0 000-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"TG","dialCode":"+228","nameEn":"Togo","flagEmoji":"🇹🇬","maskPattern":"+000 00 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"TK","dialCode":"+690","nameEn":"Tokelau","flagEmoji":"🇹🇰","maskPattern":"+000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"TO","dialCode":"+676","nameEn":"Tonga","flagEmoji":"🇹🇴","maskPattern":"+000 00-000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"TT","dialCode":"+1","nameEn":"Trinidad and Tobago","flagEmoji":"🇹🇹","maskPattern":"+0 000-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"TV","dialCode":"+688","nameEn":"Tuvalu","flagEmoji":"🇹🇻","maskPattern":"+000 00 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"TN","dialCode":"+216","nameEn":"Tunisia","flagEmoji":"🇹🇳","maskPattern":"+000 00 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"TM","dialCode":"+993","nameEn":"Turkmenistan","flagEmoji":"🇹🇲","maskPattern":"+000 00 00-00-00","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"TR","dialCode":"+90","nameEn":"Türkiye","flagEmoji":"🇹🇷","maskPattern":"+00 000 000 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"UG","dialCode":"+256","nameEn":"Uganda","flagEmoji":"🇺🇬","maskPattern":"+000 00 0000000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"UZ","dialCode":"+998","nameEn":"Uzbekistan","flagEmoji":"🇺🇿","maskPattern":"+000 00 000 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"UA","dialCode":"+380","nameEn":"Ukraine","flagEmoji":"🇺🇦","maskPattern":"+000 0000 00000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"WF","dialCode":"+681","nameEn":"Wallis and Futuna","flagEmoji":"🇼🇫","maskPattern":"+000 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"UY","dialCode":"+598","nameEn":"Uruguay","flagEmoji":"🇺🇾","maskPattern":"+000 0000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"FO","dialCode":"+298","nameEn":"Faroe Islands","flagEmoji":"🇫🇴","maskPattern":"+000 000000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"FJ","dialCode":"+679","nameEn":"Fiji","flagEmoji":"🇫🇯","maskPattern":"+000 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"PH","dialCode":"+63","nameEn":"Philippines","flagEmoji":"🇵🇭","maskPattern":"+00 0 0000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"FI","dialCode":"+358","nameEn":"Finland","flagEmoji":"🇫🇮","maskPattern":"+000 00 0000000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"FK","dialCode":"+500","nameEn":"Falkland Islands (Malvinas)","flagEmoji":"🇫🇰","maskPattern":"+000 00000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"FR","dialCode":"+33","nameEn":"France","flagEmoji":"🇫🇷","maskPattern":"+00 0 00 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"PF","dialCode":"+689","nameEn":"French Polynesia","flagEmoji":"🇵🇫","maskPattern":"+000 00 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"HR","dialCode":"+385","nameEn":"Croatia","flagEmoji":"🇭🇷","maskPattern":"+000 0 0000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"CF","dialCode":"+236","nameEn":"Central African Republic","flagEmoji":"🇨🇫","maskPattern":"+000 00 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"TD","dialCode":"+235","nameEn":"Chad","flagEmoji":"🇹🇩","maskPattern":"+000 00 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"ME","dialCode":"+382","nameEn":"Montenegro","flagEmoji":"🇲🇪","maskPattern":"+000 00 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"CZ","dialCode":"+420","nameEn":"Czech Republic","flagEmoji":"🇨🇿","maskPattern":"+000 000 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"CL","dialCode":"+56","nameEn":"Chile","flagEmoji":"🇨🇱","maskPattern":"+00 000 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"CH","dialCode":"+41","nameEn":"Switzerland","flagEmoji":"🇨🇭","maskPattern":"+00 00 000 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"SE","dialCode":"+46","nameEn":"Sweden","flagEmoji":"🇸🇪","maskPattern":"+00 0 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"SJ","dialCode":"+47","nameEn":"Svalbard and Jan Mayen","flagEmoji":"🇸🇯","maskPattern":"+00 00 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"LK","dialCode":"+94","nameEn":"Sri Lanka","flagEmoji":"🇱🇰","maskPattern":"+00 000 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"EC","dialCode":"+593","nameEn":"Ecuador","flagEmoji":"🇪🇨","maskPattern":"+000 0-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"GQ","dialCode":"+240","nameEn":"Equatorial Guinea","flagEmoji":"🇬🇶","maskPattern":"+000 000 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"ER","dialCode":"+291","nameEn":"Eritrea","flagEmoji":"🇪🇷","maskPattern":"+000 0 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"SZ","dialCode":"+268","nameEn":"Eswatini","flagEmoji":"🇸🇿","maskPattern":"+000 0000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"EE","dialCode":"+372","nameEn":"Estonia","flagEmoji":"🇪🇪","maskPattern":"+000 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"ET","dialCode":"+251","nameEn":"Ethiopia","flagEmoji":"🇪🇹","maskPattern":"+000 00 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"ZA","dialCode":"+27","nameEn":"South Africa","flagEmoji":"🇿🇦","maskPattern":"+00 00 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"SS","dialCode":"+211","nameEn":"South Sudan","flagEmoji":"🇸🇸","maskPattern":"+000 000 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"JM","dialCode":"+1","nameEn":"Jamaica","flagEmoji":"🇯🇲","maskPattern":"+0 000-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"JP","dialCode":"+81","nameEn":"Japan","flagEmoji":"🇯🇵","maskPattern":"+00 0-0000-0000","maskHasParentheses":false,"maskHasHyphen":true}]}');

/***/ },

/***/ "8c672a55a76a"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{".sf-country-code":["display/flex (.flex)","flex-direction/column (.flex-col)","flex-wrap/nowrap (.flex-nowrap)","gap/var(--sf-space-1\\\\/4)","justify-content/flex-start (.justify-start)"],".sf-country-code .sf-country-code-label":["display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","gap/var(--sf-space-1\\\\/4)","justify-content/flex-start (.justify-start)","align-items/flex-start (.items-start)"],".sf-country-code .sf-country-code-field":["display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","justify-content/flex-start (.justify-start)","align-items/center (.items-center)"],".sf-country-code .sf-country-code-left":["display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","justify-content/flex-start (.justify-start)","align-items/center (.items-center)"],".sf-country-code .sf-country-code-field input":["flex/1 (.flex-1)","display/flex (.flex)"],".sf-country-code .sf-country-code-items":["gap/var(--sf-country-code-items--gap)"],".sf-country-code .sf-country-code-item":["display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","gap/var(--sf-space-1\\\\/3)","justify-content/flex-start (.justify-start)","align-items/center (.items-center)"],".sf-country-code .sf-country-code-flag":["display/flex (.flex)","justify-content/flex-start (.justify-start)","align-items/center (.items-center)"],".sf-country-code.open .sf-country-code-list":["flex/1 (.flex-1)","display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","justify-content/flex-start (.justify-start)","align-items/flex-start (.items-start)"],".sf-country-code.open .sf-country-code-items":["flex/1 (.flex-1)","display/flex (.flex)","flex-direction/column (.flex-col)","flex-wrap/nowrap (.flex-nowrap)","justify-content/flex-start (.justify-start)","align-items/flex-start (.items-start)"],".sf-country-code.sf-country-code--size-1.open .sf-country-code-list":["flex/1 (.flex-1)","display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","justify-content/flex-start (.justify-start)","align-items/flex-start (.items-start)"],".sf-country-code.sf-country-code--size-1.open .sf-country-code-items":["flex/1 (.flex-1)","display/flex (.flex)","flex-direction/column (.flex-col)","flex-wrap/nowrap (.flex-nowrap)","justify-content/flex-start (.justify-start)","align-items/flex-start (.items-start)"],".sf-country-code.sf-country-code--size-2.open .sf-country-code-list":["flex/1 (.flex-1)","display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","justify-content/flex-start (.justify-start)","align-items/flex-start (.items-start)"],".sf-country-code.sf-country-code--size-2.open .sf-country-code-items":["flex/1 (.flex-1)","display/flex (.flex)","flex-direction/column (.flex-col)","flex-wrap/nowrap (.flex-nowrap)","justify-content/flex-start (.justify-start)","align-items/flex-start (.items-start)"],".sf-country-code.sf-country-code--size-3.open .sf-country-code-list":["flex/1 (.flex-1)","display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","justify-content/flex-start (.justify-start)","align-items/flex-start (.items-start)"],".sf-country-code.sf-country-code--size-3.open .sf-country-code-items":["flex/1 (.flex-1)","display/flex (.flex)","flex-direction/column (.flex-col)","flex-wrap/nowrap (.flex-nowrap)","justify-content/flex-start (.justify-start)","align-items/flex-start (.items-start)"],".sf-country-code.sf-country-code--size-1\\\\/3.open .sf-country-code-list":["flex/1 (.flex-1)","display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","justify-content/flex-start (.justify-start)","align-items/flex-start (.items-start)"],".sf-country-code.sf-country-code--size-1\\\\/3.open .sf-country-code-items":["flex/1 (.flex-1)","display/flex (.flex)","flex-direction/column (.flex-col)","flex-wrap/nowrap (.flex-nowrap)","justify-content/flex-start (.justify-start)","align-items/flex-start (.items-start)"],".sf-country-code.sf-country-code--size-1\\\\/2.open .sf-country-code-list":["flex/1 (.flex-1)","display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","justify-content/flex-start (.justify-start)","align-items/flex-start (.items-start)"],".sf-country-code.sf-country-code--size-1\\\\/2.open .sf-country-code-items":["flex/1 (.flex-1)","display/flex (.flex)","flex-direction/column (.flex-col)","flex-wrap/nowrap (.flex-nowrap)","justify-content/flex-start (.justify-start)","align-items/flex-start (.items-start)"]}');

/***/ },

/***/ "30e4802f0b2b"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"runtime":{"phoneLabel":"Phone number","phoneRequired":"Enter a phone number.","countryLabel":"Country code","countryUnknown":"Country code not recognised. Choose a country","searchPlaceholder":"Country or code","frequent":"Frequently chosen","allCountries":"All countries","nothingFound":"Nothing found"}}');

/***/ },

/***/ "b847b178e9c4"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases for the shim (core/js/aliases.js, standard simai.smart-component 1.3.8 §16.20). Event rows send the new name first, then the old one, with one detail; setting rows map the old attribute and property to the new; host-attribute rows (no \\"to\\") stay host attributes read by the browser or the base and are listed, refused by the shim on purpose; documentary rows (\\"shim\\": \\"none\\") record a rename the shim cannot serve.","component":"sf-input-country","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"aria-label","to":null,"kind":"attribute","component":"sf-input-country","since":"2026-10-27","remove_after":"2026-12-01","mode":"host-attribute","section":"§3.1","note":"stays a host attribute, read by the base (§3.1, §4.8); no shim"},{"from":"form","to":null,"kind":"attribute","component":"sf-input-country","since":"2026-10-27","remove_after":"2026-12-01","mode":"host-attribute","section":"§17.1","note":"stays a host attribute: the browser associates a form-associated element with the form it names; no shim"},{"from":"sf-country-code","to":"sf-input-country","kind":"tag","component":"sf-input-country","since":"2026-11-03","remove_after":"2027-01-01","section":"rename plan R0 (ui-control RENAME-PLAN-2026-11-03), naming decision 2026-11-02","note":"the element is sf-input-country; sf-country-code is a subclass defined beside it until the date"},{"from":"multi-country","to":"fixed-country","kind":"attribute","component":"sf-input-country","since":"2026-11-11","remove_after":"2027-01-01","mode":"manifest-only","section":"§4.2, change journal attribute-input-country-presence-booleans","note":"the string form switches the default-on multi-country off; the element reads it itself until the date (no shim: the value is inverted, not renamed)","value":"false","shim":"none"},{"from":"use-country-masks","to":"fixed-mask","kind":"attribute","component":"sf-input-country","since":"2026-11-11","remove_after":"2027-01-01","mode":"manifest-only","section":"§4.2, change journal attribute-input-country-presence-booleans","note":"the string form switches the default-on use-country-masks off; the element reads it itself until the date (no shim: the value is inverted, not renamed)","value":"false","shim":"none"},{"from":"show-code","to":"hide-code","kind":"attribute","component":"sf-input-country","since":"2026-11-11","remove_after":"2027-01-01","mode":"manifest-only","section":"§4.2, change journal attribute-input-country-presence-booleans","note":"the string form switches the default-on show-code off; the element reads it itself until the date (no shim: the value is inverted, not renamed)","value":"false","shim":"none"},{"from":"lazy-flags","to":"eager-flags","kind":"attribute","component":"sf-input-country","since":"2026-11-11","remove_after":"2027-01-01","mode":"manifest-only","section":"§4.2, change journal attribute-input-country-presence-booleans","note":"the string form switches the default-on lazy-flags off; the element reads it itself until the date (no shim: the value is inverted, not renamed)","value":"false","shim":"none"}]}');

/***/ },

/***/ "1870676d0d14"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.input-country","tag":"sf-input-country","version":"1.11.1","kind":"leaf","settings":{"size":{"type":"enum","values":["1/3","1/2","1","2","3"],"default":"1"},"width":{"type":"enum","values":["","short","medium","long"],"default":""},"label":{"type":"string","default":""},"required":{"type":"boolean","default":false},"name":{"type":"string","default":""},"hint":{"type":"string","default":""},"help":{"type":"string","default":""},"invalid":{"type":"boolean","default":false},"error-message":{"type":"string","default":""},"placeholder":{"type":"string","default-from":"runtime.placeholder"},"disabled":{"type":"boolean","default":false},"locale":{"type":"string","default":""},"use-mask":{"type":"boolean","default":false},"use-country-masks":{"type":"boolean","default":true},"fixed-mask":{"type":"boolean","default":false},"show-code":{"type":"boolean","default":true},"hide-code":{"type":"boolean","default":false},"mask-style":{"type":"string","default":"native"},"multi-country":{"type":"boolean","default":true},"fixed-country":{"type":"boolean","default":false},"iso2":{"type":"string","default":""},"dial-code":{"type":"string","default":""},"mask-pattern":{"type":"string","default":""},"flag-base":{"type":"string","default":""},"lazy-flags":{"type":"boolean","default":true},"eager-flags":{"type":"boolean","default":false},"show-mask-placeholder":{"type":"boolean","default":false},"mask-placeholder-char":{"type":"string","default":"_"},"max-items":{"type":"number","default":0},"preferred":{"type":"string","default":""}},"values":{"value":{"type":"string","default":""},"open":{"type":"boolean","default":false}},"events":{"change":{"carries":"native"},"input":{"carries":"native"}},"actions":{},"form":{"value":"value","name":"name","default":"value","submits":"value","reset":"default","required":"required","disabled":"disabled","validity":["value-missing","custom-error"]},"css-variables":{"--sf-country-code-background-color":{"type":"color","state":"rest"},"--sf-country-code-border-color":{"type":"color","state":"rest"},"--sf-country-code-radius":{"type":"length"},"--sf-country-code-color":{"type":"color","state":"rest"},"--sf-country-code-list-background-color":{"type":"color","state":"open"}}}');

/***/ },

/***/ "7aba30a6eb07"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Country Code","runtime":{"all-countries":"All countries","country-label":"Country code","country-unknown":"Country code not recognised. Choose a country","frequent":"Frequently chosen","nothing-found":"Nothing found","phone-label":"Phone number","phone-required":"Enter a phone number.","placeholder":"","search-placeholder":"Country or code","value-missing":"Enter a phone number.","pattern-mismatch":"Enter the whole number","too-short":"Enter the whole number","help":"More about: {label}"}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("9df4a30a8f95");
/******/
/******/ })()
;