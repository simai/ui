/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "c0450586011d"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

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
/* harmony import */ var _core_js_position_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("2e9112dbdda9");
/* harmony import */ var _field_size__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("e6d86f2cd058");
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("8489d1f5bab4");
/* harmony import */ var _core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("421676f72963");
/* harmony import */ var _core_js_tag_aliases_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("4a85acfb05c1");
/* harmony import */ var _icon_buttons_js_name_tooltip_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("2abe37330ca5");
/* harmony import */ var _lang_index_mjs__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__("b0314d85fd3a");










 // The flag button shows its name as the Framework's tooltip (FS-11, C144).

 // The words live in the component's language files (localization study LC-4):
// one place for every language, as the Smart components keep them.

 // Every word this part says. A product adds a language with
// SF.language.register('sf-input-country', code, words); the locale here is
// also what the number itself is formatted by, which is why it stays.

const COUNTRY_CODE_TEXT = _lang_index_mjs__WEBPACK_IMPORTED_MODULE_12__["default"]; // Prefer the helper Core published; an isolated bundle uses its own copy.

const positioning = () => globalThis.SF?.Position || _core_js_position_js__WEBPACK_IMPORTED_MODULE_6__["default"];

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


/***/ },

/***/ "4157111e8609"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _country_code__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("c0450586011d");
/*
* Main JS file for including JS for component.
*
* Imports:
* - Base function component (_component_name.js)
*/


/***/ },

/***/ "e6d86f2cd058"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

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
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("06e8cd089f28");
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
}

function nameOf(button) {
  return String(button.getAttribute('data-sf-shrink-tip') || button.getAttribute('aria-label') || '').replace(/\s+/gu, ' ').trim();
} // An sf-button drawn as its glyph by its bar (shrink="icon", data-shrunk;
// owner decision C370): its words are hidden, so it shows its text and keys
// as this tooltip, «Поиск ⌘K» (data-sf-shrink-tip), as an icon button shows
// its name. Whole again, it shows none.


const SHRUNK = 'sf-button[shrink="icon"][data-shrunk="true"] > .sf-button[data-sf-shrink-tip]'; // A control a component draws with no words of its own and marks with
// data-sf-name-tip (a role=button part, not an .sf-icon-button: the phone
// field's country flag, sf-input-country, FS-11) shows its name the same way.

const MARKED = '[data-sf-name-tip]'; // The button a name tooltip is for, or null.

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
  tip.className = `sf-tooltip sf-tooltip--dark ${NAME_TIP}`;
  tip.id = button.id ? `${button.id}--tooltip` : nextTipId(doc);
  tip.hidden = true;
  const content = doc.createElement('span');
  content.className = 'sf-tooltip-content';
  const text = doc.createElement('span');
  text.className = 'sf-tooltip-text';
  text.textContent = nameOf(button);
  content.append(text);
  tip.append(content);
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

/***/ "f49a716b86bd"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ALIAS_KINDS: () => (/* binding */ ALIAS_KINDS),
/* harmony export */   ALIAS_MODES: () => (/* binding */ ALIAS_MODES),
/* harmony export */   TAG_ALIAS_KIND: () => (/* binding */ TAG_ALIAS_KIND),
/* harmony export */   aliasExpired: () => (/* binding */ aliasExpired),
/* harmony export */   propertyOf: () => (/* binding */ propertyOf),
/* harmony export */   readAliasTable: () => (/* binding */ readAliasTable),
/* harmony export */   readTagAliases: () => (/* binding */ readTagAliases)
/* harmony export */ });
// The dated alias table of one component (standard simai.smart-component
// 1.3.8 §16.20, vocabulary 1.1.5 §9): what the migration converter writes as
// <component>/aliases.json, read and checked here before core/js/aliases.js
// installs it on an element. Pure data, no DOM, so a build, a lint and the
// runtime share one reading of it.
//
// A table is a list of rows, or {tag, aliases: [rows]}. A row:
//
//   {from, to, kind, since, remove_after, mode?, when?, setting?, tag?}
//
//   kind      event | setting | attribute | action | value
//   since     the first day the new name exists, YYYY-MM-DD
//   remove_after
//             the last day the old name is promised, YYYY-MM-DD
//   mode      events only: same-detail (default) | detail-adds | split
//   when      events only, optional: {<detail field>: <value>}; the old name
//             is sent only for a new event whose detail matches (two old
//             names folded into one new name, as modal:after-hide and
//             modal:after-show into change)
//   setting   values only: the attribute the value belongs to
//
// A row that does not hold is refused with a reason, never thrown: the rest of
// the table still installs, and the refusals are reported.
//
// A `tag` row renames the element itself ({from: 'sf-close', to:
// 'sf-button-close', kind: 'tag', since, remove_after}). It is not installed on
// an element: the Smart base defines the old tag as a subclass when it defines
// the new one (core/js/tag-aliases.js), so readAliasTable leaves it out and
// readTagAliases reads it.
const ALIAS_KINDS = Object.freeze(['event', 'setting', 'attribute', 'action', 'value']);
const ALIAS_MODES = Object.freeze(['same-detail', 'detail-adds', 'split']);
const DAY = 86400000;
const DATE = /^\d{4}-\d{2}-\d{2}$/u;
const ATTRIBUTE = /^[a-z][a-z0-9-]*$/u;
const MEMBER = /^[A-Za-z_$][\w$]*$/u;

function dateOf(text) {
  if (typeof text !== 'string' || !DATE.test(text)) return NaN;
  const time = Date.parse(`${text}T00:00:00Z`); // 2026-02-30 parses in some engines; it must print back as itself.

  return Number.isNaN(time) || new Date(time).toISOString().slice(0, 10) !== text ? NaN : time;
} // `remove_after` is the last promised day, whole, in UTC: the old name is
// open until the end of it and expired from the next midnight.


function aliasExpired(row, now = Date.now()) {
  const last = dateOf(row?.remove_after);
  return Number.isFinite(last) && now >= last + DAY;
} // kebab-case attribute -> camelCase property: backdrop-blur -> backdropBlur.

function propertyOf(attribute) {
  return String(attribute).replace(/-([a-z0-9])/gu, (_, letter) => letter.toUpperCase());
}
const TAG_ALIAS_KIND = 'tag'; // A custom element name of the Framework or of a package: lower case, a hyphen.

const ELEMENT = /^[a-z][a-z0-9]*-[a-z0-9-]+$/u;

function primitive(value) {
  return value === null || ['string', 'number', 'boolean'].includes(typeof value);
}

function checkRow(row) {
  if (!row || typeof row !== 'object' || Array.isArray(row)) return 'not-an-object';
  const {
    from,
    to,
    kind,
    since,
    mode = 'same-detail',
    when,
    setting
  } = row;
  if (!ALIAS_KINDS.includes(kind)) return 'unknown-kind';
  if (typeof from !== 'string' || !from) return 'no-from';
  if (to === null || to === undefined || to === '') return 'no-new-name';
  if (typeof to !== 'string') return 'no-to';
  if (from === to) return 'same-name';
  const start = dateOf(since);
  const end = dateOf(row.remove_after);
  if (Number.isNaN(start)) return 'bad-since';
  if (Number.isNaN(end)) return 'bad-remove-after';
  if (end < start) return 'remove-after-before-since';
  if (!ALIAS_MODES.includes(mode)) return 'unknown-mode';
  if (kind !== 'event' && mode !== 'same-detail') return 'mode-on-non-event';

  if (when !== undefined) {
    if (kind !== 'event') return 'when-on-non-event';
    if (!when || typeof when !== 'object' || Array.isArray(when) || !Object.values(when).every(primitive)) return 'bad-when';
  }

  if (kind === 'setting' || kind === 'attribute') {
    if (!ATTRIBUTE.test(from) || !ATTRIBUTE.test(to)) return 'bad-attribute-name';
  }

  if (kind === 'action' && (!MEMBER.test(from) || !MEMBER.test(to))) return 'bad-member-name';

  if (kind === 'value') {
    if (typeof setting !== 'string' || !ATTRIBUTE.test(setting)) return 'value-needs-setting';
  } else if (setting !== undefined) {
    return 'setting-on-non-value';
  }

  return null;
}

function normal(row, tag) {
  const out = {
    kind: row.kind,
    from: row.from,
    to: row.to,
    since: row.since,
    remove_after: row.remove_after,
    tag: typeof row.tag === 'string' && row.tag ? row.tag : tag
  };

  if (row.kind === 'event') {
    out.mode = row.mode || 'same-detail';
    if (row.when) out.when = { ...row.when
    };
  }

  if (row.kind === 'value') out.setting = row.setting;
  return Object.freeze(out);
} // -> {tag, rows: [frozen rows], refused: [{index, from, to, kind, reason}]}


function readAliasTable(table, {
  tag = ''
} = {}) {
  const list = Array.isArray(table) ? table : table?.aliases;
  const owner = !Array.isArray(table) && typeof table?.tag === 'string' && table.tag || tag || '';
  const rows = [];
  const refused = [];

  if (!Array.isArray(list)) {
    refused.push({
      index: -1,
      from: null,
      to: null,
      kind: null,
      reason: 'not-a-table'
    });
    return {
      tag: owner,
      rows,
      refused
    };
  }

  const refuse = (index, row, reason) => refused.push({
    index,
    from: row?.from ?? null,
    to: row?.to ?? null,
    kind: row?.kind ?? null,
    reason
  });

  const seen = new Map();
  list.forEach((row, index) => {
    if (row?.kind === TAG_ALIAS_KIND) return;
    const reason = checkRow(row);
    if (reason) return refuse(index, row, reason);
    const one = normal(row, owner); // An attribute, a property or a method has one new name; an event's old
    // name may be sent beside several new ones (split, folded names).

    const identity = one.kind === 'event' ? `event|${one.from}|${one.to}|${JSON.stringify(one.when ?? null)}` : one.kind === 'value' ? `value|${one.setting}|${one.from}` : `${one.kind === 'action' ? 'action' : 'name'}|${one.from}`;
    const before = seen.get(identity);
    if (before) return refuse(index, row, before.to === one.to ? 'duplicate' : 'conflict');
    seen.set(identity, one);
    rows.push({
      index,
      row: one
    });
  }); // Two old names folded into one new name by their detail: without `when`
  // each would be sent on every new event, the wrong one among them.

  const folded = new Map();

  for (const entry of rows) {
    const {
      row
    } = entry;
    if (row.kind !== 'event' || row.mode === 'same-detail' || row.when) continue;
    folded.set(row.to, [...(folded.get(row.to) ?? []), entry]);
  }

  const ambiguous = new Set();

  for (const group of folded.values()) if (group.length > 1) for (const entry of group) ambiguous.add(entry);

  const kept = [];

  for (const entry of rows) {
    if (ambiguous.has(entry)) refuse(entry.index, entry.row, 'needs-when');else kept.push(entry.row);
  }

  refused.sort((a, b) => a.index - b.index);
  return {
    tag: owner,
    rows: kept,
    refused
  };
} // The `tag` rows of a table: -> {tag, rows: [{from, to, since, remove_after}],
// refused: [{index, from, to, reason}]}. A row renames the table's own tag:
// its `to` is that tag when the table names one.

function readTagAliases(table, {
  tag = ''
} = {}) {
  const list = Array.isArray(table) ? table : table?.aliases;
  const owner = !Array.isArray(table) && typeof table?.component === 'string' && table.component || !Array.isArray(table) && typeof table?.tag === 'string' && table.tag || tag || '';
  const rows = [];
  const refused = [];
  if (!Array.isArray(list)) return {
    tag: owner,
    rows,
    refused
  };
  const seen = new Set();
  list.forEach((row, index) => {
    if (row?.kind !== TAG_ALIAS_KIND) return;

    const refuse = reason => refused.push({
      index,
      from: row.from ?? null,
      to: row.to ?? null,
      reason
    });

    if (typeof row.from !== 'string' || !ELEMENT.test(row.from)) return refuse('bad-old-tag');
    if (typeof row.to !== 'string' || !ELEMENT.test(row.to)) return refuse('bad-new-tag');
    if (row.from === row.to) return refuse('same-name');
    if (owner && row.to !== owner) return refuse('not-this-tag');
    const start = dateOf(row.since);
    const end = dateOf(row.remove_after);
    if (Number.isNaN(start)) return refuse('bad-since');
    if (Number.isNaN(end)) return refuse('bad-remove-after');
    if (end < start) return refuse('remove-after-before-since');
    if (seen.has(row.from)) return refuse('duplicate');
    seen.add(row.from);
    rows.push(Object.freeze({
      from: row.from,
      to: row.to,
      since: row.since,
      remove_after: row.remove_after
    }));
  });
  return {
    tag: owner,
    rows,
    refused
  };
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

/***/ "78628e837a32"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FOCUSABLE: () => (/* binding */ FOCUSABLE),
/* harmony export */   carryLayerOrigin: () => (/* binding */ carryLayerOrigin),
/* harmony export */   closeLayer: () => (/* binding */ closeLayer),
/* harmony export */   focusablesIn: () => (/* binding */ focusablesIn),
/* harmony export */   hasLayer: () => (/* binding */ hasLayer),
/* harmony export */   hasLayerAbove: () => (/* binding */ hasLayerAbove),
/* harmony export */   isOutsideTopLayer: () => (/* binding */ isOutsideTopLayer),
/* harmony export */   isTopLayer: () => (/* binding */ isTopLayer),
/* harmony export */   landmarksAround: () => (/* binding */ landmarksAround),
/* harmony export */   layerIndex: () => (/* binding */ layerIndex),
/* harmony export */   layerZIndex: () => (/* binding */ layerZIndex),
/* harmony export */   layerZIndexAt: () => (/* binding */ layerZIndexAt),
/* harmony export */   lockPageScroll: () => (/* binding */ lockPageScroll),
/* harmony export */   openLayer: () => (/* binding */ openLayer),
/* harmony export */   openLayers: () => (/* binding */ openLayers),
/* harmony export */   pressInLayerAbove: () => (/* binding */ pressInLayerAbove),
/* harmony export */   raiseLayer: () => (/* binding */ raiseLayer),
/* harmony export */   returnLayerFocus: () => (/* binding */ returnLayerFocus),
/* harmony export */   startClosedLayerContent: () => (/* binding */ startClosedLayerContent),
/* harmony export */   topLayer: () => (/* binding */ topLayer),
/* harmony export */   tryFocus: () => (/* binding */ tryFocus),
/* harmony export */   updateLayer: () => (/* binding */ updateLayer),
/* harmony export */   whenClosedLayerOpens: () => (/* binding */ whenClosedLayerOpens)
/* harmony export */ });
// The one document layer stack (standard simai.smart-component 1.3.8 §19).
//
// Everything that draws above the page -- a modal, a drawer, a popover, a
// dropdown list, a menu, a calendar, the toast area -- registers here when it
// opens and leaves when it closes. The stack answers three questions the
// components used to answer each for itself, from three lists and two z-index
// bases:
//
//   - which layer is on top: the one opened last. Only that layer acts on
//     Escape, an outside press and Tab; a layer below stands back
//     (simai/ui-source#36: Escape over a modal opened from a drawer closed the
//     drawer, because each kept its own stack and the drawer listened first);
//   - how high each layer is drawn: one z-index scale in opening order, read
//     from the tokens --sf-z-index-layer and --sf-z-index-layer-step
//     (simai/ui-source#37: a drawer opened from a modal was drawn under it,
//     at 90 + 2i against the modal's 9000 + 2i);
//   - where focus goes when a layer closes: back to what was active when it
//     opened; if that is gone or outside the new top layer, into the new top
//     layer; else the nearest landmark; else the body. A layer that closes
//     while another stands above it moves no focus.
//
// It also keeps what every layer did with a copy of its own: one listener for
// a press outside the top layer (onOutsidePress), one page lock (lockPageScroll,
// taken for a layer that locks the page and brings no lock of its own) and one
// list of what can take focus (FOCUSABLE). A popover, a menu and a context menu
// each bound a document listener for the outside press, and a drawer, a site
// header, a search window and a modal each wrote the page lock again, three of
// them without the modal's care for the page's own padding (reuse audit
// 2026-11-02, findings 1 and 2).
//
// Kept on a shared global, not in module scope: every Smart bundle carries its
// own copy of this module, and the modal's bundle has to see the drawer the
// drawer's bundle opened. Each document (an iframe too) has its own stack.
//
// A layer is any object: a custom element, or the root element of a component
// without one. One whose `isConnected` is false is passed over, so a layer
// removed without closing cannot hold every key on the page.
const STACK_KEY = Symbol.for('sf.layerStack'); // The scale's defaults, the same as core's tokens: 9000 is where the modal
// stack always started, so nothing a page draws below it changes place.

const LAYER_BASE = 9000;
const LAYER_STEP = 2;
const LANDMARKS = 'main, section, article, [role="main"], [role="region"]';
/**
 * What a person can move focus to: the one list a layer keeps Tab inside and
 * moves focus into. A hidden input is not a stop; an editable region is. Each
 * component kept a list of its own, and they had drifted apart.
 */

const FOCUSABLE = ['a[href]', 'button:not([disabled])', 'input:not([disabled]):not([type="hidden"])', 'select:not([disabled])', 'textarea:not([disabled])', '[contenteditable="true"]', '[tabindex]:not([tabindex="-1"])'].join(',');
/**
 * The focusable nodes inside these roots that are drawn and not inert, in
 * order. A control taken out of the Tab order (tabindex -1: the other
 * segments of a roving group such as sf-segmented, a menu's rows) is no Tab
 * stop: counted, it was the trap's last stop that Tab never reaches, and Tab
 * from the group's current segment left the layer (sf-header-site's panel
 * with the theme switch in its settings group, owner decision C161 (8)).
 */

function focusablesIn(...roots) {
  return roots.flatMap(root => Array.from(root?.querySelectorAll?.(FOCUSABLE) ?? [])).filter(node => node.getClientRects().length > 0 && !node.closest('[inert]') && node.tabIndex >= 0);
}

function stack() {
  const scope = globalThis;

  if (!scope[STACK_KEY]) {
    Object.defineProperty(scope, STACK_KEY, {
      value: {
        layers: [],
        bound: false,
        pressBound: false,
        lease: null,
        pressTop: new WeakMap()
      },
      configurable: true
    });
  }

  return scope[STACK_KEY];
}

const isLive = entry => entry?.owner?.isConnected !== false; // A toast does not take keys or presses: the window under it keeps them.


const takesInput = entry => entry.kind !== 'toast';

function find(owner) {
  return stack().layers.find(entry => entry.owner === owner) || null;
}

function readToken(name, fallback) {
  const root = globalThis.document?.documentElement;
  if (!root || typeof globalThis.getComputedStyle !== 'function') return fallback;
  const value = parseInt(globalThis.getComputedStyle(root).getPropertyValue(name), 10);
  return Number.isFinite(value) ? value : fallback;
}
/** The z-index of the layer at a place in the stack, as a number. */


function layerZIndexAt(index) {
  if (index < 0) return '';
  return readToken('--sf-z-index-layer', LAYER_BASE) + index * readToken('--sf-z-index-layer-step', LAYER_STEP);
} // The class the modal's lock always added, kept so a page that reads it (and
// the modal's probes, which do) still sees a locked page.

const LOCK_CLASS = 'overflow-hidden';
/**
 * The default page lock (§19.1): the document stops scrolling, and the body
 * takes the scrollbar's width as padding so the page does not jump sideways
 * when the bar goes. Answers the function that gives it back.
 *
 * It was the modal's: it adds the gap to the padding the body already has, and
 * gives back only what it set -- a class or an overflow the page had before
 * stays, and a padding the page changed meanwhile is the page's. The overflow
 * is also written inline, as the drawer, the site header and the search window
 * wrote it, so the lock holds before the utility sheet with the class arrives.
 */

function lockPageScroll({
  preserveScrollGap = true
} = {}) {
  const doc = globalThis.document;
  const html = doc?.documentElement;
  const body = doc?.body;
  if (!html || !body) return () => {};
  const view = doc.defaultView || globalThis.window || globalThis;
  const gap = Math.max(0, (view.innerWidth || 0) - html.clientWidth);
  const kept = [html, body].map(node => ({
    node,
    locked: node.classList.contains(LOCK_CLASS),
    overflow: node.style.getPropertyValue('overflow'),
    overflowPriority: node.style.getPropertyPriority('overflow')
  }));

  for (const {
    node
  } of kept) {
    node.classList.add(LOCK_CLASS);
    node.style.setProperty('overflow', 'hidden');
  }

  const padding = {
    value: body.style.getPropertyValue('padding-inline-end'),
    priority: body.style.getPropertyPriority('padding-inline-end'),
    applied: null
  };

  if (preserveScrollGap && gap > 0) {
    const current = parseFloat(view.getComputedStyle?.(body).paddingInlineEnd) || 0;
    body.style.setProperty('padding-inline-end', `${current + gap}px`, padding.priority);
    padding.applied = body.style.getPropertyValue('padding-inline-end');
  }

  return () => {
    for (const {
      node,
      locked,
      overflow,
      overflowPriority
    } of kept) {
      if (!locked) node.classList.remove(LOCK_CLASS); // Only the overflow this lock wrote: one the page set meanwhile stays.

      if (node.style.getPropertyValue('overflow') !== 'hidden' || node.style.getPropertyPriority('overflow')) continue;
      if (overflow) node.style.setProperty('overflow', overflow, overflowPriority);else node.style.removeProperty('overflow');
    }

    if (padding.applied === null || body.style.getPropertyValue('padding-inline-end') !== padding.applied || body.style.getPropertyPriority('padding-inline-end') !== padding.priority) return;
    if (padding.value) body.style.setProperty('padding-inline-end', padding.value, padding.priority);else body.style.removeProperty('padding-inline-end');
  };
} // The page lock is one lease for the whole stack, taken by the first layer
// that locks the page and given back when no such layer is left -- whichever
// kind opened first and whichever closes last. A modal and a drawer held two
// locks before, and closing them out of order unlocked the page under an open
// window. A layer that brings no lockPage of its own takes the default one.

function syncPageLock() {
  const state = stack();
  const locker = state.layers.find(entry => entry.locksPage && isLive(entry));

  if (locker && !state.lease) {
    const release = locker.lockPage ? locker.lockPage() : lockPageScroll({
      preserveScrollGap: locker.preserveScrollGap !== false
    });
    state.lease = typeof release === 'function' ? release : () => {};
  } else if (!locker && state.lease) {
    const release = state.lease;
    state.lease = null;
    release();
  }
}

function sync() {
  const state = stack();
  const top = topLayer();
  state.layers.forEach((entry, index) => {
    entry.place?.({
      index,
      zIndex: layerZIndexAt(index),
      top: entry === top
    });
  });
  syncPageLock();
}
/** The layer on top: the last opened that takes keys and presses. */


function topLayer() {
  const {
    layers
  } = stack();

  for (let at = layers.length - 1; at >= 0; at -= 1) {
    if (isLive(layers[at]) && takesInput(layers[at])) return layers[at];
  }

  return null;
}
/** Whether this owner is the top layer. One that is not open is top only when nothing is. */

function isTopLayer(owner) {
  const top = topLayer();
  return top ? top.owner === owner : !find(owner);
}
function hasLayer(owner) {
  return Boolean(find(owner));
}
/** Whether a layer of one of these kinds stands above this owner. */

function hasLayerAbove(owner, kinds = ['modal', 'panel']) {
  const {
    layers
  } = stack();
  const at = layers.findIndex(entry => entry.owner === owner);
  if (at < 0) return false;
  return layers.slice(at + 1).some(entry => isLive(entry) && kinds.includes(entry.kind));
}
/**
 * Whether a press lands in a layer that stands above this owner, of any kind:
 * a menu, a list or a calendar opened from a popover is drawn beside the page
 * (SF.menu.open's one menu on the body, a portalled list), so the press on
 * its row is outside the popover's own box, and the popover must not take it
 * as an outside press (GB17 Y1: a saved-set menu in a filter window closed the
 * window on its row's press). A press outside every layer is still outside.
 */

function pressInLayerAbove(owner, event) {
  const {
    layers
  } = stack();
  const at = layers.findIndex(entry => entry.owner === owner);
  if (at < 0) return false;
  return layers.slice(at + 1).some(entry => isLive(entry) && takesInput(entry) && !pressedOutside(entry, event));
}
/** The place of this owner in the stack, -1 when it is not open. */

function layerIndex(owner) {
  return stack().layers.findIndex(entry => entry.owner === owner);
}
/** This owner's z-index, '' when it is not open. */

function layerZIndex(owner) {
  return layerZIndexAt(layerIndex(owner));
}
/** The open layers, bottom first; of one kind when `kind` is given. */

function openLayers(kind = '') {
  return stack().layers.filter(entry => !kind || entry.kind === kind).map(entry => entry.owner);
}
/**
 * Registers a layer, or raises it to the top when it is already open.
 *
 * options:
 *   kind        'modal' | 'panel' | 'surface' | 'toast'
 *   locksPage   true to hold the page lock while open; lockPage() takes it and
 *               returns the function that gives it back, and without one the
 *               stack takes lockPageScroll({preserveScrollGap})
 *   preserveScrollGap  false to let the page widen when its scrollbar goes
 *   trapsFocus  true to keep Tab inside and to return focus on close
 *   root()      the element the layer draws, for focus and outside presses
 *   onEscape(event)  closes the layer and answers true when it took the press
 *   onTab(event)     keeps focus inside
 *   onOutsidePress(event)  a press began outside root() and the owner while
 *               this is the top layer; the layer decides what it closes
 *   focusIn()        moves focus inside
 *   place({index, zIndex, top})  draws the layer at its height
 *   returnTo    what was active at open (default: the active element now)
 */

function openLayer(owner, options = {}) {
  if (!owner) return null;
  const state = stack();
  bindKeys();
  bindPresses();
  let entry = find(owner);

  if (entry) {
    state.layers.splice(state.layers.indexOf(entry), 1);
    Object.assign(entry, options);
  } else {
    const returnTo = options.returnTo !== undefined ? options.returnTo : globalThis.document?.activeElement ?? null;
    entry = {
      kind: 'surface',
      locksPage: false,
      trapsFocus: false,
      ...options,
      owner,
      returnTo,
      returnAncestors: landmarksAround(returnTo)
    };
  }

  state.layers.push(entry);
  sync();
  return entry;
}
/** Changes what a layer declares without moving it in the stack. */

function updateLayer(owner, options = {}) {
  const entry = find(owner);
  if (!entry) return null;
  Object.assign(entry, options);
  sync();
  return entry;
}
/** Raises an open layer to the top. */

function raiseLayer(owner) {
  const entry = find(owner);
  if (!entry) return;
  const {
    layers
  } = stack();
  layers.splice(layers.indexOf(entry), 1);
  layers.push(entry);
  sync();
}
/**
 * Removes a layer. Answers whether it was the top one. With `restoreFocus`
 * (the default) a top layer that traps focus gives focus back by §19.2.
 */

function closeLayer(owner, {
  restoreFocus = true
} = {}) {
  const entry = find(owner);
  if (!entry) return false;
  const wasTop = topLayer() === entry;
  const {
    layers
  } = stack();
  layers.splice(layers.indexOf(entry), 1);
  sync();

  if (restoreFocus && wasTop && entry.trapsFocus) {
    returnLayerFocus(true, entry.returnTo, entry.returnAncestors);
  }

  return wasTop;
}
/** The landmarks around a node, nearest first: where focus falls back to. */

function landmarksAround(node) {
  const found = [];

  for (let parent = node?.parentElement; parent; parent = parent.parentElement) {
    if (parent.matches?.(LANDMARKS)) found.push(parent);
  }

  return found;
}
/** Focuses a node if a person could reach it; answers whether it took focus. */

function tryFocus(node, temporaryTabIndex = false) {
  if (!node?.isConnected || typeof node.focus !== 'function' || node.matches?.(':disabled') || node.closest?.('[inert], [hidden], [aria-hidden="true"]') || !node.getClientRects?.().length || node.ownerDocument.defaultView.getComputedStyle(node).visibility !== 'visible') {
    return false;
  }

  const addTabIndex = temporaryTabIndex && !node.hasAttribute('tabindex');
  let observer;

  const cleanup = () => {
    observer?.disconnect();
    node.removeEventListener('blur', cleanup); // Keep an author's own change to the temporary attribute.

    if (addTabIndex && node.getAttribute('tabindex') === '-1') node.removeAttribute('tabindex');
  };

  if (addTabIndex) {
    node.setAttribute('tabindex', '-1');
    node.addEventListener('blur', cleanup, {
      once: true
    });
    observer = new node.ownerDocument.defaultView.MutationObserver(() => {
      if (!node.isConnected) cleanup();
    });
    observer.observe(node.ownerDocument.documentElement, {
      childList: true,
      subtree: true
    });
  }

  let focused = false;

  try {
    node.focus({
      preventScroll: true
    });
    focused = node.ownerDocument.activeElement === node;
    return focused;
  } catch {
    return false;
  } finally {
    // Removing tabindex while a non-native target is focused blurs it.
    if (addTabIndex && !focused) cleanup();
  }
} // The layer that owns focus now: the topmost one that traps it. A docked
// panel or an open list under the window does not.

function focusOwner() {
  const {
    layers
  } = stack();

  for (let at = layers.length - 1; at >= 0; at -= 1) {
    if (isLive(layers[at]) && layers[at].trapsFocus) return layers[at];
  }

  return null;
}
/**
 * Gives focus back after a layer closed (§19.2): to `target` when it is still
 * there and inside the layer that now owns focus (or nothing does); else into
 * that layer; else the nearest landmark; else the body. Nothing moves when the
 * closed layer was not the top one.
 */


function returnLayerFocus(wasTop, target, ancestors = []) {
  if (!wasTop) return;
  const owner = focusOwner();
  const root = owner?.root?.();
  if ((!owner || root?.contains(target)) && tryFocus(target)) return;

  if (owner) {
    owner.focusIn?.();
    return;
  }

  const doc = globalThis.document;
  if (!doc) return; // Nothing had focus when the layer opened (the body was active): that is
  // the element to give it back to, and it is still there (§19.2). The body
  // takes no focus() call, so the focus left inside the closed layer is let
  // go and the body is active again. A landmark here took a focus the page
  // never gave and wrote a temporary tabindex on the page's own <main> -- in
  // an editor that <main> is the canvas being edited (lab composition-overlay).

  if (target && (target === doc.body || target === doc.documentElement)) {
    const active = doc.activeElement;
    if (active && active !== doc.body && active !== doc.documentElement) active.blur?.();
    return;
  }

  const candidates = new Set([...ancestors, ...doc.querySelectorAll('main, [role="main"]'), doc.body]);

  for (const candidate of candidates) {
    if (tryFocus(candidate, true)) return;
  }
} // One listener pair for the whole document, whichever bundle binds it first.
// The top layer is read when the press starts (window, capture -- before any
// component's listener) and acted on when it has passed through the page
// (window, bubble): a control inside that handled Escape keeps it, and a
// surface that closed itself on the way down does not hand the same press to
// the layer under it.

function bindKeys() {
  const state = stack();
  if (state.bound || typeof globalThis.addEventListener !== 'function') return;
  state.bound = true;
  globalThis.addEventListener('keydown', event => {
    if (event.key === 'Escape' || event.key === 'Tab') state.pressTop.set(event, topLayer());
  }, true);
  globalThis.addEventListener('keydown', event => {
    if (event.key !== 'Escape' && event.key !== 'Tab' || event.defaultPrevented) return;
    const top = state.pressTop.has(event) ? state.pressTop.get(event) : topLayer();
    if (!top || top !== topLayer()) return;

    if (event.key === 'Escape') {
      if (top.onEscape?.(event)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }

      return;
    }

    top.onTab?.(event);
  });
} // Outside a layer: in the composed path of neither what it draws nor its
// owner, so a press inside a shadow root or a portal of its own is inside.


function pressedOutside(entry, event) {
  const path = event.composedPath?.() ?? [];
  const root = entry.root?.();
  return !path.includes(entry.owner) && !(root && path.includes(root));
} // One pointerdown listener pair for the whole document, as for the keys: the
// top layer is read in capture, before any component sees the press, and acts
// in bubble, once the press has passed through the page. Only the top layer
// hears it, so a list over a popover closes and the popover stays, and a layer
// that opened or closed on the way down (a trigger's own press) does not hand
// the press to another. Each surface bound a document listener of its own
// before, and the first one bound acted whatever lay above it.


function bindPresses() {
  const state = stack();
  if (state.pressBound || typeof globalThis.addEventListener !== 'function') return;
  state.pressBound = true;
  globalThis.addEventListener('pointerdown', event => {
    state.pressTop.set(event, topLayer());
  }, true);
  globalThis.addEventListener('pointerdown', event => {
    const top = state.pressTop.has(event) ? state.pressTop.get(event) : topLayer();
    if (!top?.onOutsidePress || top !== topLayer() || !pressedOutside(top, event)) return;
    top.onOutsidePress(event);
  });
} // A press outside the top layer, read in capture: what a layer below would
// call outside is ignored there.


function isOutsideTopLayer(event) {
  const top = topLayer();
  const root = top?.root?.();
  if (!root) return false;
  const path = event.composedPath?.() ?? [];
  return !path.includes(root) && !path.includes(top.owner);
}
const THEMES = ['theme-dark', 'theme-light'];
/**
 * A layer drawn outside its host (a portal) keeps where it came from (§19.1):
 * the host's resolved lang and dir, the theme of its nearest themed ancestor,
 * and the computed values of the host's variables that differ from those
 * where the portal stands -- `variables` by name, `prefixes` by the start of
 * the name. It looks and speaks as if it stood where its host stands.
 *
 * With `area`, every custom property whose value at the host differs from the
 * portal's is carried as well (simai/ui-source#46 item 1): a block's retuned
 * role (--sf-primary), a part's public variable (--sf-button-background-color)
 * and a page's own name reach the layer's content. `except` names the layer's
 * own prefixes (--sf-modal-) that the area does not carry: its public names
 * still travel in `variables`, and the private ones an outer window sets on
 * its panel never reach a window opened from it. A name carried before and no
 * longer different is taken back, so a host moved to another area takes that
 * area's values.
 */
// The density a host stands in (C22, C79; core/js/density.js says the same):
// the nearest region's -- an explicit size follows its region since C79.
// Written here, not imported: this module is loaded on its own (shared
// runtime, tests).

function densityOf(from) {
  for (let node = from; node?.nodeType === 1; node = node.parentElement) {
    if (node.hasAttribute('data-sf-density')) return node.getAttribute('data-sf-density');
  }

  return null;
}

function carryLayerOrigin(portal, host, {
  variables = [],
  prefixes = [],
  area = false,
  except = []
} = {}) {
  if (!portal || !host?.isConnected) return;
  const doc = host.ownerDocument;
  const view = doc.defaultView;
  const nearest = host.closest('[lang]');
  const lang = nearest?.getAttribute('lang') ?? doc.documentElement.getAttribute('lang') ?? '';
  if (lang) portal.setAttribute('lang', lang);else portal.removeAttribute('lang'); // Where the copy came from: the page itself, or a section that names its own
  // language. Only the first follows SF.language.use(), which the page language
  // does before it announces the change (simai/ui-source#55).

  if (!nearest || nearest === doc.documentElement) portal.dataset.sfLayerLang = 'page';else delete portal.dataset.sfLayerLang; // The density (C22): the ladder the host stands on, so a window or a drawer
  // at the end of the body is as dense as the page region that opened it.

  const density = densityOf(host);
  if (density) portal.setAttribute('data-sf-density', density);else portal.removeAttribute('data-sf-density');
  const declared = host.closest('[dir]')?.getAttribute('dir');
  const dir = declared && declared !== 'auto' ? declared : view.getComputedStyle(host).direction;
  if (dir) portal.setAttribute('dir', dir); // The theme only when the host's differs from the portal's place: a page
  // that retunes tokens on html.theme-dark keeps them, as the class would
  // otherwise declare the core's values again on the portal.

  const parent = portal.parentElement;

  const theme = node => {
    const area = node?.closest?.(THEMES.map(name => `.${name}`).join(', '));
    return area ? THEMES.find(name => area.classList.contains(name)) : '';
  };

  const carried = portal.dataset.sfLayerTheme || '';
  const wanted = theme(host) !== theme(parent) ? theme(host) : '';
  if (carried && carried !== wanted) portal.classList.remove(carried);
  if (wanted) portal.classList.add(wanted);
  if (wanted) portal.dataset.sfLayerTheme = wanted;else delete portal.dataset.sfLayerTheme;
  const previous = (portal.dataset.sfLayerVariables || '').split(' ').filter(Boolean);

  if (!variables.length && !prefixes.length && !area) {
    for (const name of previous) portal.style.removeProperty(name);

    delete portal.dataset.sfLayerVariables;
    return;
  }

  const own = view.getComputedStyle(host);
  const names = new Set(variables);

  if (prefixes.length || area) {
    for (const name of own) {
      if (!name.startsWith('--')) continue;
      if (prefixes.some(prefix => name.startsWith(prefix))) names.add(name);else if (area && !except.some(prefix => name.startsWith(prefix))) names.add(name);
    }
  } // Compared with the portal as it stands without what was carried before,
  // its theme class already applied: what the theme gives it again is not
  // written twice.


  for (const name of previous) portal.style.removeProperty(name);

  const there = view.getComputedStyle(portal);
  const kept = [];

  for (const name of names) {
    const value = own.getPropertyValue(name).trim();
    if (value && value !== there.getPropertyValue(name).trim()) kept.push([name, value]);
  }

  for (const [name, value] of kept) portal.style.setProperty(name, value);

  if (kept.length) portal.dataset.sfLayerVariables = kept.map(([name]) => name).join(' ');else delete portal.dataset.sfLayerVariables;
} // A closed layer's content starts while the layer is closed, after the page's
// first paint, without being shown. The Loader leaves a Smart element inside a
// closed container for later and fetches its code when the container opens
// (standard 1.3.8 §7.2.1, simai/ui-source#47); a closed window's or drawer's
// root is such a container (inert, out of view). So a page that waited for a
// tag in a closed window before opening it -- customElements.whenDefined
// ('sf-menu'), then fill the menu, then open() -- waited for ever (ui-control
// evidence 2026-11-11-modal-followups). The layer asks for those tags itself,
// as a component asks for an element it draws (SF.Loader.ensure), once the
// page has loaded and the browser is idle: the first paint fetches nothing
// more than before, and the content is drawn where it stands, inside the
// closed root, which shows nothing.
//
// The layer's own closed root is the one container this passes over. A closed
// container inside it (a tab panel, a closed <details>, an unstarted part)
// keeps its own deferral, and an element inside a Smart parent that has not
// taken its source yet waits for it (the Loader's rule), so the walk runs
// again when what it asked for has drawn: a few rounds, each for the tags
// the previous one uncovered.

const CLOSED_INSIDE = '[hidden], [inert], details:not([open]), dialog:not([open]), [data-sf-start]:not([data-sf-started])';
const UNSTARTED = '[data-sf-start]:not([data-sf-started])';
const CONTENT_ROUNDS = 4;

function closedInside(element, root) {
  if (element.matches(UNSTARTED)) return true;

  for (let node = element.parentElement; node && node !== root; node = node.parentElement) {
    if (!node.matches(CLOSED_INSIDE)) continue; // A closed <details> still shows its summary.

    if (node.localName === 'details' && element.closest('summary')?.parentElement === node) continue;
    return true;
  }

  return false;
}

function contentTags(root, loader) {
  const registry = globalThis.customElements;
  const tags = new Set();

  for (const element of root.querySelectorAll('*')) {
    const tag = element.localName;
    if (!tag.includes('-') || tags.has(tag) || registry?.get?.(tag)) continue;
    if (!loader.getSmartElementRuleName(element)) continue;
    if (closedInside(element, root) || loader.shouldDeferNestedSmartElement?.(element)) continue;
    tags.add(tag);
  }

  return [...tags];
}

function whenPageIdle(fn) {
  const view = globalThis.window;

  const idle = () => {
    // requestIdleCallback is throttled in a hidden tab; a timer still runs.
    if (typeof view.requestIdleCallback === 'function' && !view.document?.hidden) view.requestIdleCallback(fn, {
      timeout: 2000
    });else view.setTimeout(fn, 200);
  };

  if (view.document?.readyState === 'complete') idle();else view.addEventListener('load', idle, {
    once: true
  });
} //
// A page may keep the old timing, the content fetched when the layer opens:
// SF_BOOT_CONFIG.startClosedLayerContent = false. The first-paint snapshots do
// (scripts/first-paint-lib.mjs): a closed layer's first paint is the layer as
// it rests before anything in it starts, and a start at idle time made the
// picture and its sheet list depend on how soon the browser was idle.
//
// Content the page puts into the closed layer later (a list filled from its
// data, a part loaded into it) starts the same way: the layer watches its
// closed root and walks it again, a few rounds, once the page is idle after
// an addition (ui-control evidence 2026-11-11-modal-followups-2-accept, L2).
// An open root is the Loader's, as any part of the page.


function startClosedLayerContent(rootOf) {
  const view = globalThis.window;
  if (!view?.document || view.SF_BOOT_CONFIG?.startClosedLayerContent === false) return;
  let round = 0;
  let walking = false;
  let again = false;
  let watched = null;
  let watcher = null;

  const next = () => {
    const loader = view.SF?.Loader;
    const root = rootOf();
    walking = false;
    if (!root?.isConnected || !loader?.ensure || !loader.getSmartElementRuleName) return;
    watch(root);
    if (!root.matches(CLOSED_LAYER)) return;
    const tags = contentTags(root, loader);

    if (!tags.length || ++round > CONTENT_ROUNDS) {
      if (again) walk();
      return;
    }

    walking = true;
    loader.ensure(tags, {
      timeout: 10000
    }).then(() => whenPageIdle(next));
  };

  const walk = () => {
    again = false;

    if (walking) {
      again = true;
      return;
    }

    round = 0;
    walking = true;
    whenPageIdle(next);
  };

  const watch = root => {
    if (watched === root || typeof view.MutationObserver !== 'function') return;
    watcher?.disconnect();
    watched = root;
    watcher = new view.MutationObserver(records => {
      if (!watched.isConnected) {
        watcher.disconnect();
        watcher = null;
        watched = null;
        return;
      }

      if (watched.matches(CLOSED_LAYER) && records.some(record => record.addedNodes.length)) walk();
    });
    watcher.observe(root, {
      childList: true,
      subtree: true
    });
  };

  walking = true;
  whenPageIdle(next);
} // A closed window's root or drawer's panel: inert while closed (and while a
// window is minimised).

const CLOSED_LAYER = '.sf-modal[inert], [data-sf-drawer-panel][inert]'; // A component that fetches its own data (sf-include) and stands in a closed
// window or drawer fetches it once the layer opens, not at page load: the
// layer starts its content early so the page can reach its code
// (startClosedLayerContent), but a part, a list's rows or a user's data the
// page never opens should not cost the server a request (ui-control
// evidence 2026-11-11-modal-followups-2-accept, M2). Null when the element is
// not in a closed layer, or when the page keeps the old timing
// (SF_BOOT_CONFIG.startClosedLayerContent = false: then nothing in a closed
// layer starts before it opens); otherwise a promise that settles when the
// layer opens, or never once `signal` aborts.

function whenClosedLayerOpens(element, signal) {
  const view = globalThis.window;
  if (!view?.document || view.SF_BOOT_CONFIG?.startClosedLayerContent === false) return null;
  const layer = element?.closest?.(CLOSED_LAYER);
  if (!layer || typeof view.MutationObserver !== 'function') return null;
  return new Promise(resolve => {
    const watcher = new view.MutationObserver(() => {
      if (layer.matches(CLOSED_LAYER) && layer.isConnected) return;
      watcher.disconnect();
      resolve();
    });
    watcher.observe(layer, {
      attributes: true,
      attributeFilter: ['inert']
    });
    signal?.addEventListener('abort', () => watcher.disconnect(), {
      once: true
    });
  });
}

/***/ },

/***/ "421676f72963"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   OPEN_SURFACE_MARK: () => (/* binding */ OPEN_SURFACE_MARK),
/* harmony export */   holdOpenSurfaceMark: () => (/* binding */ holdOpenSurfaceMark),
/* harmony export */   isOpenSurfaceMarked: () => (/* binding */ isOpenSurfaceMarked),
/* harmony export */   isTopOpenSurface: () => (/* binding */ isTopOpenSurface)
/* harmony export */ });
/* harmony import */ var _layer_stack_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("78628e837a32");
// While a transient surface is open the root says so, and a component whose own
// Escape closes something larger -- a drawer, a modal, a record panel -- stands
// back. They all listen on the document in capture, where stopPropagation
// cannot reach a listener on the same node and the one registered first wins
// whatever it is: without a shared mark, one press closed the surface and the
// window behind it together.
//
// The mark started inside sf-popover, which made it that component's state
// instead of the protocol it is: a dropdown list is the same kind of surface and
// raised nothing, so Escape over an open list closed the record panel behind it
// (Larena storage QA, 2026-10-22) -- and a drawer and a modal read the same mark,
// so the same press closed those too. It lives here now, raised by every surface
// that owns Escape while it is open and read by every component that owns Escape
// for something larger.
//
// The attribute name is unchanged, because it is already the published protocol:
// `document.documentElement.dataset.sfPopoverOpen`.

const OPEN_MARK = 'sfPopoverOpen'; // A count, not a flag: two surfaces can be open at once -- a dropdown inside a
// popover -- and the first to close must not clear the mark the second needs.

const held = new WeakSet(); // The same holders are layers of the one document stack (layer-stack.js,
// standard 1.3.8 §19.1): the mark answers "is anything open", the stack answers
// "is it me" -- for a surface, and for the drawer and the modal under it. Two
// surfaces that both listen on the document in capture cannot settle it with
// stopPropagation, which does not reach a listener on the same node: a calendar
// opened inside a popover closed together with the popover, and a popover closed
// over a dropdown list it held and left the list open.
//
// The list a bundle of an older pair reads (sf.openSurfaceLayers) is kept as
// well, so a package built against it still sees the surfaces this one opens.

const LAYERS_KEY = Symbol.for('sf.openSurfaceLayers');

function legacyLayers() {
  const scope = globalThis;
  if (!Array.isArray(scope[LAYERS_KEY])) scope[LAYERS_KEY] = [];
  return scope[LAYERS_KEY];
}

function step(delta) {
  const root = globalThis.document?.documentElement;
  if (!root) return;
  const next = Math.max(0, Number(root.dataset[OPEN_MARK] || 0) + delta);
  if (next) root.dataset[OPEN_MARK] = String(next);else delete root.dataset[OPEN_MARK];
} // Idempotent for one owner, so a component can call it from every update with
// its own open state and only a change moves the count. An owner that is removed
// while open releases it the same way, from wherever it tears down.
//
// `layer` is what the surface declares to the stack when it opens: root() when
// it draws outside its owner, and onOutsidePress(event) when a press outside it
// closes it -- the stack's one document listener calls it while the surface is
// the top layer, in place of a listener the surface binds itself.


function holdOpenSurfaceMark(owner, open, layer = {}) {
  if (!owner) return;
  const wanted = Boolean(open);
  if (wanted === held.has(owner)) return;
  const layers = legacyLayers();

  if (wanted) {
    held.add(owner);
    layers.push(owner);
    (0,_layer_stack_js__WEBPACK_IMPORTED_MODULE_0__.openLayer)(owner, { ...layer,
      kind: 'surface'
    });
  } else {
    held.delete(owner);
    const at = layers.lastIndexOf(owner);
    if (at >= 0) layers.splice(at, 1); // A surface returns focus itself, to its own trigger.

    (0,_layer_stack_js__WEBPACK_IMPORTED_MODULE_0__.closeLayer)(owner, {
      restoreFocus: false
    });
  }

  step(wanted ? 1 : -1);
} // What a surface asks before its own Escape closes it: whether it is the top
// layer of the document -- above a modal or a drawer as well as above another
// surface. A holder that left the document without releasing is passed over
// rather than allowed to hold every Escape on the page. An owner that holds
// nothing is the top only when nothing else is open.

function isTopOpenSurface(owner) {
  if (!(0,_layer_stack_js__WEBPACK_IMPORTED_MODULE_0__.isTopLayer)(owner)) return false; // A holder that only a bundle of an older pair registered -- it is in the
  // old list and not in the stack -- stands above whatever opened before it.

  const layers = legacyLayers();

  for (let at = layers.length - 1; at >= 0; at -= 1) {
    const layer = layers[at];
    if (layer?.isConnected === false) continue;
    return layer === owner || (0,_layer_stack_js__WEBPACK_IMPORTED_MODULE_0__.hasLayer)(layer);
  }

  return true;
} // What a component asks before its own Escape closes something larger.

function isOpenSurfaceMarked() {
  return Boolean(globalThis.document?.documentElement?.dataset?.[OPEN_MARK]);
}
const OPEN_SURFACE_MARK = OPEN_MARK;

/***/ },

/***/ "8489d1f5bab4"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   followLanguage: () => (/* binding */ followLanguage),
/* harmony export */   isRussianPage: () => (/* binding */ isRussianPage),
/* harmony export */   language: () => (/* binding */ language),
/* harmony export */   localeText: () => (/* binding */ localeText),
/* harmony export */   pageLanguage: () => (/* binding */ pageLanguage),
/* harmony export */   pageLocale: () => (/* binding */ pageLocale),
/* harmony export */   pageText: () => (/* binding */ pageText),
/* harmony export */   pageWord: () => (/* binding */ pageWord),
/* harmony export */   refreshLanguage: () => (/* binding */ refreshLanguage),
/* harmony export */   registeredWord: () => (/* binding */ registeredWord)
/* harmony export */ });
/* harmony import */ var _tag_aliases_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("4a85acfb05c1");
/* harmony import */ var _lang_built_in_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("feccc97e5d7d");
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
 // The languages built into the bundles (owner decision C282): English; every
// other language, Russian too, is a language file (core/js/language-packs.js).



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
const REGISTERED = STORE.registered; // Language packs (owner decision C177, 2026-11-14; C282, 2026-11-17): every
// language but English, the one built in, is one file per language and
// delivery, fetched only by a page that speaks it (or included before core as
// its script form, core/lang/<code>.js). A pack's words go into the same registry as words registered one
// by one -- so a bundle built before packs existed reads them too -- a
// Framework pack's beneath what is there, any other pack's over it: a product
// overrides a Framework word whichever arrived first. The fetching is core's
// (core/js/language-packs.js); each bundle only asks for a language. A STORE
// made by an older bundle has no packs yet: they are added here.

const PACKS = STORE.packs ??= {
  loaded: new Map(),
  pending: new Map(),
  request: null
}; // The languages built into the bundles: English, and in a rollback build Russian
// too (src/core/lang/built-in.json, C282).
// Which registered words came from a Framework pack and nothing has said over
// since: name -> code -> Set of keys. A Framework pack is the Framework's own
// words in a file, so for a component that names itself by a dated alias of
// its record's tag (sf-message-log, the heir of sf-list-feed, both under
// sf-list-feed's record) they are the successor's words, not its own: the
// words that component ships win over them (ui-control evidence
// 2026-11-18-pro-over-1ed6: «Лента» instead of «Переписка» once the ru pack
// was fetched). A word a product registers, or a product pack, is still over
// everything. Kept beside the words, not instead of them, so a copy of this
// module from before it reads the registry as it did. A STORE made by an older
// bundle has none yet: added here.

const FLOOR = STORE.floor ??= new Map();

const floorOf = (name, code) => {
  if (!FLOOR.has(name)) FLOOR.set(name, new Map());
  const byLanguage = FLOOR.get(name);
  if (!byLanguage.has(code)) byLanguage.set(code, new Set());
  return byLanguage.get(code);
};

const notFloor = (name, code, keys) => {
  const marked = FLOOR.get(name)?.get(code);
  if (!marked) return;

  for (const key of keys) marked.delete(key);
}; // Whether the word registered for `key` stands for the successor of the
// component asking, so that its own shipped word is said instead: the asker
// names a dated alias (its tag is not its record's), and the registered word
// is a Framework pack's that no product has said over.


function successorWord(owner, candidate, key) {
  if (!owner) return false;
  const name = normalise(owner);
  const record = (0,_tag_aliases_js__WEBPACK_IMPORTED_MODULE_0__.canonicalTag)(name);
  return record !== name && Boolean(FLOOR.get(record)?.get(candidate)?.has(key));
}

const isBuiltIn = code => code === 'en' || (_lang_built_in_mjs__WEBPACK_IMPORTED_MODULE_1__["default"]?.built_in ?? []).includes(code);
/**
 * Ask core for the pack of a language this page speaks (nothing for a
 * built-in language), and for the part that holds `component`'s words: the Framework's pack
 * comes in parts by family (core/js/language-packs.js). A core from before
 * parts takes the language alone.
 */


function needPack(code, component) {
  const wanted = normalise(code);
  const base = wanted.split('-')[0];
  if (!base || isBuiltIn(base)) return;
  const name = component ? (0,_tag_aliases_js__WEBPACK_IMPORTED_MODULE_0__.canonicalTag)(component) : undefined;

  if (typeof PACKS.request !== 'function') {
    // Core has not run yet: a Smart bundle placed before core.js (a Docara
    // page and its example frames load core last) draws before anyone can
    // fetch. The ask is kept and core makes it when it starts
    // (core/js/language-packs.js), so the family's part still comes.
    const early = PACKS.early ??= new Map();
    const named = aliasOf(wanted);

    for (const one of new Set([base, wanted, ...(named ? [named] : [])])) {
      if (!early.has(one)) early.set(one, new Set());
      early.get(one).add(name ?? '');
    }

    return;
  }

  PACKS.request(base, name);
  if (wanted !== base) PACKS.request(wanted, name);
  const named = aliasOf(wanted);
  if (named && named !== wanted && named !== base) PACKS.request(named, name);
} // Words are kept under a component's current tag: a product that registered
// them for a renamed tag (sf-datepicker, now sf-input-date) keeps its words
// while the old tag is a dated alias, whichever name the element was written
// with (core/js/tag-aliases.js).


const wordsOf = component => REGISTERED.get((0,_tag_aliases_js__WEBPACK_IMPORTED_MODULE_0__.canonicalTag)(component));

function normalise(value) {
  return String(value ?? '').trim().toLowerCase().replace('_', '-');
} // The pack a page language takes. Two tables, both from the localization
// registry (C278) and both on the shared store, so a bundle carries neither:
// core/lang/index.json `aliases` (the shipped packs: zh-cn, zh-sg and zh take
// zh-hans, pt takes pt-br; PACKS.aliases, set by core) and the registry's
// second names of every language (STORE.aliases, core/js/language-packs.js).
// A word registered for the alias itself still comes first; any other code
// is its own.


function packOf(code) {
  const one = PACKS?.aliases?.[code] ?? STORE?.aliases?.[code];
  return typeof one === 'string' && one ? one : code;
}

function aliasOf(code) {
  const named = packOf(code);
  return named !== code ? named : null;
}
/**
 * The languages to try, most specific first, English last: the language, the
 * pack it is an alias of, the language without its region and that one's
 * pack. zh-CN: zh-cn, zh-hans, zh, en; zh-TW: zh-tw, zh, zh-hans, en; pt-PT:
 * pt-pt, pt, pt-br, en. Until 2026-11-18 a zh-CN or pt page found no pack and
 * spoke English.
 */


const chain = language => {
  const wanted = normalise(language);
  const base = wanted.split('-')[0];
  const order = [];

  for (const candidate of [wanted, packOf(wanted), base, packOf(base), 'en']) {
    if (candidate && !order.includes(candidate)) order.push(candidate);
  }

  return order;
};
/** Which component a node belongs to, for words registered against one. */


const componentOf = node => {
  const tag = node?.tagName;
  return typeof tag === 'string' ? tag.toLowerCase() : null;
}; // A layer drawn in a portal carries a copy of its host's language, stamped by
// carryLayerOrigin (§19.1). When that copy came from the page itself, it has
// to follow the page before the listeners draw: a word read inside a drawer
// during SF.language.use() answered the language the page had just left, and
// the portal was carried again only later, with nothing to draw it again
// (simai/ui-source#55, found by ui-mail). A portal whose host sits in a
// section with a language of its own is not touched: that section means it.


const carryPageLanguage = () => {
  const doc = globalThis.document;
  if (!doc?.querySelectorAll) return;
  const lang = doc.documentElement?.getAttribute('lang') || '';

  for (const portal of doc.querySelectorAll('[data-sf-layer-lang="page"]')) {
    if (lang) portal.setAttribute('lang', lang);else portal.removeAttribute('lang');
  }
};

const announce = () => {
  carryPageLanguage();

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
} // The language of a part of the page wins over the language chosen for the
// whole page (owner, 2026-10-26; standard simai.smart-component 1.3.8 §11.1):
//   1. a word given on the element itself (the component's own attribute);
//   2. the nearest [lang] below <html>;
//   3. the page's choice, SF.language.use(), which also sets <html lang>;
//   4. <html lang>;
//   5. English.
// Until 2026-10-27 the choice won over a section's [lang], so an English
// section inside a Russian page that had called use('ru') spoke Russian.


function languageSource(node) {
  const owner = langOwner(node);
  const root = globalThis.document?.documentElement ?? null;
  if (owner && owner !== root) return owner.getAttribute('lang');
  if (STORE.chosen) return STORE.chosen;
  return owner?.getAttribute('lang') || root?.lang || 'en';
}
/**
 * The page's language for this node: the nearest [lang] below <html>, else
 * the language the page chose, else <html lang>, else English.
 */


function pageLanguage(node) {
  // The language without its region, whichever way it was set: a page that
  // chose 'pt-BR' is a Portuguese page, as a page whose markup says
  // lang="pt-BR" is. The chosen value kept its region and answered 'pt-br',
  // which matched no dictionary keyed by language and made isRussianPage false
  // on a page that chose 'ru-RU'. The region stays in pageLocale.
  return normalise(languageSource(node)).split('-')[0] || 'en';
}
/** The page's language with its region kept, which is what formatting wants. */

function pageLocale(node) {
  return normalise(languageSource(node)) || 'en';
}
/**
 * Follows `lang` in the document (§11.1 «changes are followed»): one observer
 * for the page, whichever bundle starts it, and the elements under a changed
 * [lang] draw again. `element.requestComponentUpdate('language')` is what a
 * Smart element does; anything else passes its own `redraw`. Returns the way
 * to stop following.
 */

function followLanguage(element, redraw = () => element.requestComponentUpdate?.('language')) {
  const root = typeof globalThis !== 'undefined' ? globalThis : {};
  const doc = element?.ownerDocument ?? root.document;
  const Observer = doc?.defaultView?.MutationObserver ?? root.MutationObserver;
  if (!doc?.documentElement || typeof Observer !== 'function') return () => {};

  if (!root.__sfLanguageWatch || root.__sfLanguageWatch.document !== doc) {
    const watch = {
      document: doc,
      elements: new Map(),
      observer: null
    };
    watch.observer = new Observer(records => {
      const changed = [...new Set(records.map(record => record.target))];

      for (const [one, again] of [...watch.elements]) {
        if (changed.some(target => within(target, one))) {
          try {
            again();
          } catch {// One element that fails to draw does not keep the others in the
            // old language.
          }
        }
      }
    });
    watch.observer.observe(doc.documentElement, {
      attributes: true,
      attributeFilter: ['lang'],
      subtree: true
    });
    root.__sfLanguageWatch = watch;
  }

  const watch = root.__sfLanguageWatch;
  watch.elements.set(element, redraw);
  return () => watch.elements.delete(element);
} // Whether `node` is `target` or below it, across shadow roots.

function within(target, node) {
  for (let current = node; current;) {
    if (current === target) return true;
    current = current.parentNode || current.host || null;
  }

  return false;
}
/**
 * Tell the page's components that words changed without a registration: the
 * composition editor words arrive in a chunk of their own (LC-1) and the
 * forms drawn before them draw again.
 */


function refreshLanguage() {
  announce();
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
  return localeText(dictionary, key, pageLocale(node), component ?? componentOf(node));
}
/**
 * Text for `key` in a named language, with no node to read it from: a server
 * fallback or a form drawn before it is placed. The same order as pageText --
 * words registered for `component`, then the shipped ones, for the language,
 * the language without its region and English -- and the key last.
 */

function localeText(dictionary, key, locale, component) {
  const order = chain(locale || 'en');
  needPack(order[0], component);

  for (const candidate of order) {
    let added = component ? wordsOf(component)?.get(candidate)?.[key] : undefined;
    if (added !== undefined && dictionary?.[candidate]?.[key] !== undefined && successorWord(component, candidate, key)) added = undefined;

    if (added !== undefined) {
      if (candidate === 'en' && added !== '') warnFallback(order, component, key);
      return added;
    }

    const shipped = dictionary?.[candidate]?.[key];

    if (shipped !== undefined) {
      if (candidate === 'en' && shipped !== '') warnFallback(order, component, key);
      return shipped;
    }
  }

  return key;
} // A language the Framework does not ship (owner decision C177 (4)) may come
// partly translated: a word it lacks is said in the fallback language,
// English, and that is shown, not silent (localization study LC-6). One
// warning per page and language (de-AT and de are one), naming the first word
// missed; every word missed is kept by language for SF.language.missing(),
// and the language files' coverage is scripts/language-coverage.mjs. Kept on
// the shared global, because every bundle carries this module.

function warnFallback(order, owner, key) {
  const wanted = packOf(String(order[0] || '').split('-')[0]); // While its pack is on its way the English is a moment, not a gap (the
  // registry name's pack too: zh-hans for a zh-CN page). Before core runs
  // nothing can be on its way yet: the word is asked again when the pack core
  // fetches arrives, and only a word still missing then is one (ui-view
  // example frames reported sf-pagination "of-pages", which the ru pack holds,
  // on loads where the bundle ran before core).

  if (!wanted || wanted === 'en' || typeof PACKS.request !== 'function' || order.some(code => code !== 'en' && PACKS.pending.has(code))) return;
  const root = globalThis;
  if (!(root.__sfMissingWords instanceof Map)) root.__sfMissingWords = new Map();
  const seen = root.__sfMissingWords;

  if (!seen.has(wanted)) {
    seen.set(wanted, new Set());
    root.console?.warn?.(`[SIMAI Framework] "${wanted}": words missing, said in English (first: ${owner || 'component'} "${key}"); SF.language.missing('${wanted}') lists them`);
  }

  seen.get(wanted).add(`${owner || 'component'}|${key}`);
} // Missing words are said once per component, word and language: a page that
// draws a hundred rows must not print a hundred warnings. The marks are kept on
// the shared global, because every bundle carries this module.


function warnWord(owner, key, locale, said) {
  const root = typeof globalThis !== 'undefined' ? globalThis : {};
  if (!(root.__sfWordWarnings instanceof Set)) root.__sfWordWarnings = new Set();
  const mark = `${owner}|${key}|${locale}|${said}`;
  if (root.__sfWordWarnings.has(mark)) return;

  root.__sfWordWarnings.add(mark);

  globalThis.console?.warn?.(`[SIMAI Framework] ${owner || 'component'}: no word "${key}" for ${locale}${said === 'key' ? '; the key is shown' : `; said in ${said}`}`);
}

function fill(text, locale, count, vars) {
  return String(text).replace(/\{([a-z][\w-]*)\}/giu, (whole, name) => {
    if (name === 'n' && count !== undefined) {
      try {
        return new Intl.NumberFormat(locale).format(count);
      } catch {
        return String(count);
      }
    }

    return vars && Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name]) : whole;
  });
}
/**
 * A component's own word (standard simai.smart-component 1.3.8 §11, §11.1).
 *
 * `dictionary` is `{<locale>: {<key>: word}}` from the component's language
 * files. A word given on the element itself is the caller's to prefer; this
 * resolves the rest: words registered for the element's language, then the
 * shipped ones, the language without its region, English, the component's
 * source language and, last, the key. The last two warn once. A word that
 * takes a number is an object of plural forms chosen by Intl.PluralRules of
 * the language the word was found in; `{n}` is the number in that language's
 * format and `{name}` takes `vars.name`.
 *
 * `former` names the key the same word had before a rename (one key or a
 * list): a product that registered its words under the old key keeps them
 * until the alias's day. For each language the word registered under the new
 * key wins, then one registered under an old key, then the shipped one; a
 * word taken by an old key is reported to `onFormer(oldKey)`, which notes the
 * deprecation.
 */


function pageWord(dictionary, key, node, {
  component,
  source = '',
  count,
  vars,
  former,
  onFormer
} = {}) {
  const owner = component ?? componentOf(node);
  const locale = pageLocale(node);
  const order = chain(locale);
  const sourceLanguage = normalise(source);
  if (sourceLanguage && !order.includes(sourceLanguage)) order.push(sourceLanguage);
  const formerKeys = former === undefined || former === null ? [] : [].concat(former);
  needPack(locale, owner);

  for (const candidate of order) {
    const registered = owner ? wordsOf(owner)?.get(candidate) : undefined;
    let added = registered?.[key];
    if (added !== undefined && dictionary?.[candidate]?.[key] !== undefined && successorWord(owner, candidate, key)) added = undefined;

    if (added === undefined && registered) {
      const old = formerKeys.find(name => registered[name] !== undefined && registered[name] !== null);

      if (old !== undefined) {
        added = registered[old];
        onFormer?.(old);
      }
    }

    const word = added !== undefined ? added : dictionary?.[candidate]?.[key];
    if (word === undefined || word === null) continue;
    if (candidate === sourceLanguage && !chain(locale).includes(candidate)) warnWord(owner, key, locale, candidate);
    if (candidate === 'en' && word !== '') warnFallback(chain(locale), owner, key);

    if (typeof word === 'object') {
      let form = 'other';

      if (count !== undefined) {
        try {
          form = new Intl.PluralRules(candidate).select(Number(count));
        } catch {
          form = 'other';
        }
      }

      const picked = word[form] ?? word.other;
      if (picked === undefined) continue;
      return fill(picked, candidate, count, vars);
    }

    return fill(word, candidate, count, vars);
  }

  warnWord(owner, key, locale, 'key');
  return key;
}
/**
 * The word a product registered (SF.language.register, or a product pack)
 * under `key` for the node's language, its base language or English; the
 * words a component ships are not read. Undefined when none is registered.
 * A removed word key kept as a dated alias reads this: the old phrase is
 * said only while a product still writes the old key.
 */

function registeredWord(component, key, node) {
  const byLanguage = wordsOf(component ?? componentOf(node));
  if (!byLanguage) return undefined;

  for (const candidate of chain(pageLocale(node))) {
    const word = byLanguage.get(candidate)?.[key];
    if (word !== undefined && word !== null) return word;
  }

  return undefined;
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
    if (next) needPack(next); // The choice is the page's language: <html lang> says it too (§11.1), so
    // the browser, a screen reader and CSS :lang() agree with the words.
    // use(null) gives the markup's own language back.

    const root = globalThis.document?.documentElement;

    if (root) {
      const holder = globalThis;

      if (next) {
        if (holder.__sfMarkupLanguage === undefined) holder.__sfMarkupLanguage = root.getAttribute('lang');
        if (root.getAttribute('lang') !== next) root.setAttribute('lang', next);
      } else if (holder.__sfMarkupLanguage !== undefined) {
        if (holder.__sfMarkupLanguage === null) root.removeAttribute('lang');else root.setAttribute('lang', holder.__sfMarkupLanguage);
        holder.__sfMarkupLanguage = undefined;
      }
    }

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
    const name = (0,_tag_aliases_js__WEBPACK_IMPORTED_MODULE_0__.canonicalTag)(component ?? '');
    const code = normalise(value);
    if (!name || !code) throw new TypeError('a component and a language are required');
    if (!REGISTERED.has(name)) REGISTERED.set(name, new Map());
    const byLanguage = REGISTERED.get(name);

    if (words === null) {
      byLanguage.delete(code);
      FLOOR.get(name)?.delete(code);
    } else {
      byLanguage.set(code, { ...(byLanguage.get(code) ?? {}),
        ...words
      });
      notFloor(name, code, Object.keys(words ?? {}));
    }

    announce();
    return this;
  },

  /**
   * A language pack (schema simai.language-pack, schema_version 1; schema
   * core/contracts/language-pack.v1.schema.json): every word of one language
   * for one delivery, by component. A Framework pack's words go beneath the
   * words already registered, any other pack's over them, as register() does.
   * The page draws again once. Answers what was taken, or null for something
   * that is not a pack.
   */
  registerPack(pack, url = null) {
    const code = normalise(pack?.lang);

    if (pack?.schema !== 'simai.language-pack' || pack.schema_version !== 1 || !code || !pack.words || typeof pack.words !== 'object') {
      globalThis.console?.warn?.(`[SIMAI Framework] not a language pack (simai.language-pack, schema_version 1)${url ? `: ${url}` : ''}`);
      return null;
    }

    const under = (pack.delivery ?? 'framework') === 'framework';
    let words = 0;

    for (const [component, byKey] of Object.entries(pack.words)) {
      if (!byKey || typeof byKey !== 'object') continue;
      const name = (0,_tag_aliases_js__WEBPACK_IMPORTED_MODULE_0__.canonicalTag)(component);
      if (!REGISTERED.has(name)) REGISTERED.set(name, new Map());
      const byLanguage = REGISTERED.get(name);
      const now = byLanguage.get(code) ?? {};
      byLanguage.set(code, under ? { ...byKey,
        ...now
      } : { ...now,
        ...byKey
      });

      if (under) {
        const marked = floorOf(name, code);

        for (const key of Object.keys(byKey)) if (!Object.prototype.hasOwnProperty.call(now, key) || marked.has(key)) marked.add(key);
      } else {
        notFloor(name, code, Object.keys(byKey));
      }

      words += Object.keys(byKey).length;
    }

    const info = {
      lang: code,
      delivery: pack.delivery ?? 'framework',
      status: pack.status ?? null,
      coverage: pack.coverage ?? null,
      words,
      url
    };
    PACKS.loaded.set(code, [...(PACKS.loaded.get(code) ?? []), info]); // Core registers the parts that arrived together and draws once
    // (PACKS.quiet while it does).

    if (!PACKS.quiet) announce();
    return info;
  },

  /**
   * Name a pack file to fetch when the page needs its language: one line for
   * a product or a page (also SF_BOOT_CONFIG.languages = {code: url}). Core
   * fetches it once, with the Framework's own pack of that language.
   */
  addPack(value, url) {
    return PACKS.add ? PACKS.add(normalise(value), url) : false;
  },

  /** Fetch the packs of a language now; resolves when they are registered. */
  load(value) {
    return PACKS.load ? PACKS.load(normalise(value)) : Promise.resolve([]);
  },

  /** The packs on the page: {code: [{lang, delivery, status, coverage, words, url}]}. */
  packs() {
    return Object.fromEntries([...PACKS.loaded].map(([code, list]) => [code, list.map(info => ({ ...info
    }))]));
  },

  /** One language across many components: `{ 'sf-input-date': {...}, ... }`. */
  registerAll(value, byComponent = {}) {
    for (const [component, words] of Object.entries(byComponent)) {
      this.register(component, value, words);
    }

    return this;
  },

  /** The languages something has registered words for. */
  known(component) {
    return [...(wordsOf(component ?? '')?.keys() ?? [])];
  },

  /**
   * The words the page has said in English so far for want of one in
   * `value` (C177 (4): a language may ship partly; what it lacks is visible).
   * `['sf-pagination|pages-label', ...]`; every language's when none is named.
   */
  missing(value) {
    const seen = globalThis.__sfMissingWords instanceof Map ? globalThis.__sfMissingWords : new Map();
    if (value === undefined) return Object.fromEntries([...seen].map(([code, words]) => [code, [...words]]));
    return [...(seen.get(packOf(normalise(value).split('-')[0])) ?? [])];
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
    FLOOR.clear();
    PACKS.loaded.clear(); // The asks kept before core ran go too: they were for the words forgotten.

    PACKS.early?.clear?.();
    STORE.chosen = null;
    announce();
    return this;
  }

}; // Reachable by a consumer, which it was not: `sf-admin-menu` had written its
// own reading of the rule because the shared one was an internal module, and
// the two then disagreed about a region that names its own language. A product
// composing its own elements gets the same rule here.

if (typeof window !== 'undefined') {
  window.SF = window.SF || {}; // Every bundle publishes its copy; they share one store, so any copy
  // answers alike -- except that a bundle built before language packs
  // (an older package on the page) has no registerPack, addPack, load or
  // packs. Once a copy with them is published, an older one does not
  // replace it (C177).

  const holder = window.SF;

  if (!Object.getOwnPropertyDescriptor(holder, 'language')?.set) {
    let published = holder.language;
    Object.defineProperty(holder, 'language', {
      configurable: true,
      enumerable: true,
      get: () => published,
      set: value => {
        if (typeof value?.registerPack === 'function' || typeof published?.registerPack !== 'function') published = value;
      }
    });
  }

  holder.language = language;
  window.SF.pageLanguage = pageLanguage;
  window.SF.pageText = pageText;
}

/***/ },

/***/ "14baf2d02711"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   logicalSide: () => (/* binding */ logicalSide),
/* harmony export */   physicalPlacement: () => (/* binding */ physicalPlacement)
/* harmony export */ });
// Pure logical ⇄ physical placement mapping for SF.Position. No DOM and no
// dependencies, so it is testable without Floating UI installed.
const SIDES = ['block-start', 'block-end', 'inline-start', 'inline-end'];
const ALIGNS = ['start', 'center', 'end'];
/** Maps a logical side and alignment to a Floating UI placement. */

function physicalPlacement(side = 'block-end', align = 'start', rtl = false) {
  if (!SIDES.includes(side)) throw new TypeError(`Unknown placement side: ${side}`);
  if (!ALIGNS.includes(align)) throw new TypeError(`Unknown placement alignment: ${align}`);
  const physical = side === 'block-start' ? 'top' : side === 'block-end' ? 'bottom' : side === 'inline-start' ? rtl ? 'right' : 'left' : rtl ? 'left' : 'right'; // Floating UI mirrors start/end alignment itself for right-to-left elements.

  return align === 'center' ? physical : `${physical}-${align}`;
}
/** Maps a Floating UI placement back to the logical side. */

function logicalSide(placement, rtl = false) {
  const physical = String(placement).split('-')[0];
  if (physical === 'top') return 'block-start';
  if (physical === 'bottom') return 'block-end';
  if (physical === 'left') return rtl ? 'inline-end' : 'inline-start';
  return rtl ? 'inline-start' : 'inline-end';
}

/***/ },

/***/ "2e9112dbdda9"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   anchor: () => (/* binding */ anchor),
/* harmony export */   anchorReference: () => (/* binding */ anchorReference),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   liftToTopLayer: () => (/* binding */ liftToTopLayer),
/* harmony export */   referenceRect: () => (/* binding */ referenceRect),
/* harmony export */   resolveLength: () => (/* binding */ resolveLength)
/* harmony export */ });
/* harmony import */ var _floating_ui_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("6d338aa773af");
/* harmony import */ var _position_placement_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("14baf2d02711");
// One anchored-positioning contract for Framework floating surfaces (dropdown
// lists, date panels, menus, tooltips). Geometry comes from Floating UI; this
// module adds logical placements, Framework token lengths and the author's
// size caps, so every component opens, flips and shifts the same way.



function isRtl(element) {
  return getComputedStyle(element).direction === 'rtl';
} // A plain pixel length needs no probe.


const PIXELS = /^\s*(-?(?:\d+\.?\d*|\.\d+))(?:px)?\s*$/u;
/**
 * Resolves a number or CSS length (tokens included) to pixels in context.
 * Anything but a number or a plain pixel length is measured by a probe span,
 * which restyles the document: call it once per anchor, never per frame.
 */

function resolveLength(value, context = document.body) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  if (typeof value !== 'string' || value.trim() === '') return 0;
  const plain = PIXELS.exec(value);
  if (plain && (value.includes('px') || Number(plain[1]) === 0)) return parseFloat(plain[1]) || 0;
  const probe = document.createElement('span');
  probe.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none;block-size:0;padding:0;border:0';
  probe.style.inlineSize = value;
  (context?.isConnected ? context : document.body).append(probe);
  const pixels = parseFloat(getComputedStyle(probe).width) || 0;
  probe.remove();
  return pixels;
} // A host that draws no box of its own -- every Smart element is
// `display: contents`, sf-button-icon and sf-button among them -- measures as a
// zero rectangle at 0,0, and a menu opened for it stood at the window's left
// edge (simai/ui-source#68). Such a host is measured by what it draws: the
// union of its children's boxes. The first of them stands in for it where an
// element is needed (scroll ancestors, resize).

function drawsNoBox(element) {
  return element instanceof Element && getComputedStyle(element).display === 'contents';
}

function boxesOf(element, found = []) {
  for (const child of element.children) {
    if (drawsNoBox(child)) boxesOf(child, found);else if (child.getClientRects().length) found.push(child);
  }

  return found;
} // The box a fixed panel is placed in: the nearest ancestor that contains
// fixed descendants -- a transform or one of its parts, a filter, will-change
// naming one, contain: layout or paint (as [data-sf-overlay-container] has),
// a container query box -- or the viewport. Floating UI asks the same
// question but counts an element that draws no box: every Smart host is
// display: contents, and the tooltip sheet gives a placed sf-tooltip its
// translate. A box-less element contains nothing, so the browser placed the
// panel in the overlay container while Floating UI measured from the host's
// empty rectangle at 0,0 -- viewport coordinates, taken from the container:
// sf-composition-overlay's tooltips stood 48px low under a 48px bar
// (simai/ui-source#63).


const CONTAINS_FIXED = /paint|layout|strict|content/u;
const WILL_CONTAIN = /transform|translate|scale|rotate|perspective|filter/u;

const given = value => Boolean(value) && value !== 'none';

function containsFixed(element) {
  const css = getComputedStyle(element);
  if (css.display === 'contents') return false;
  if (given(css.transform) || given(css.translate) || given(css.scale) || given(css.rotate) || given(css.perspective) || given(css.filter) || given(css.backdropFilter) || WILL_CONTAIN.test(css.willChange || '') || CONTAINS_FIXED.test(css.contain || '')) return true; // A container query box is asked, not assumed. The containment it once
  // implied made it the containing block of fixed descendants, and Floating UI
  // still counts it so; current Chromium no longer does. Counting it placed
  // every panel in the docs' content column (main.docara-content is
  // container-type: inline-size) by the column's offset a second time: the
  // calendar of a field at y 516 opened at y 1336 (docs pre-check DP-01,
  // 2026-11-09). A fixed probe at 0,0 inside the box says which it is.

  return Boolean(css.containerType) && css.containerType !== 'normal' && probesFixedOrigin(element);
}

function probesFixedOrigin(element) {
  const probe = element.ownerDocument.createElement('span');
  probe.style.cssText = 'position:fixed;left:0;top:0;inline-size:0;block-size:0;padding:0;border:0;margin:0;visibility:hidden;pointer-events:none';
  element.append(probe);
  const at = probe.getBoundingClientRect();
  probe.remove();
  return Math.abs(at.left) > 0.5 || Math.abs(at.top) > 0.5;
}

function inTopLayer(element) {
  try {
    return element.matches(':popover-open') || element.matches(':modal');
  } catch {
    return false;
  }
} // A floating surface is lifted into the top layer while it is anchored (a
// manual popover), so no ancestor can displace or clip it: a transform, a
// filter, will-change, contain: layout or paint, an overflow box, a stacking
// context under a sticky header. It stays where it is in the DOM, so it keeps
// the host's variables, theme, lang, dir and density by plain inheritance --
// what a body portal has to carry by hand (carryLayerOrigin). A surface the
// component already lifted (sf-menu-context, sf-help-mark, sf-profile-picker,
// sf-input-lookup, dropdown lists) is left as it is; a browser without
// popovers keeps the fixed panel in place, placed against its containing block.
//
// A surface inside another top-layer surface -- a tooltip, a dropdown or a
// nested popover in an open sf-popover, a modal dialog -- is lifted too, and
// so stands above its parent. Left inside it, it was a fixed box in the
// parent's stacking context, painted under the parent's later content: a
// tooltip in an open popover hid under the next field's label (C59 S1
// acceptance D1). Shown after its parent, it is drawn over it.
//
// The user-agent popover rule (inset 0, margin auto, a border, padding, Canvas
// and CanvasText, overflow auto) is taken back by a rule of no specificity in
// the lowest Framework layer, sf.reset, so the component's own sheet still
// decides each of those: unlayered, the rule outranked every layered component
// rule and took the calendar's fill, padding and border away.


const LIFTED = 'data-sf-position-layer';
const LIFTED_RULE = `@layer sf.reset{:where([${LIFTED}]){inset:auto;margin:0;padding:0;border:0 none;inline-size:auto;block-size:auto;overflow:visible;color:inherit;background-color:transparent}}`;
const sheets = new WeakMap();

function adoptLiftedRule(floating) {
  const root = floating.getRootNode();
  const target = root instanceof ShadowRoot ? root : floating.ownerDocument;
  if (sheets.has(target)) return;
  const view = floating.ownerDocument.defaultView;

  try {
    const sheet = new view.CSSStyleSheet();
    sheet.replaceSync(LIFTED_RULE);
    target.adoptedStyleSheets = [...target.adoptedStyleSheets, sheet];
    sheets.set(target, sheet);
  } catch {
    const style = floating.ownerDocument.createElement('style');
    style.dataset.sfPositionLayer = '';
    style.textContent = LIFTED_RULE;
    (target === floating.ownerDocument ? target.head || target.documentElement : target).append(style);
    sheets.set(target, style);
  }
}

function liftable(floating) {
  if (typeof floating.showPopover !== 'function' || !floating.isConnected) return false;
  return !floating.hasAttribute('popover') && !inTopLayer(floating);
}
/** Lifts a floating surface into the top layer; returns a function that puts it back, or null. */


function liftToTopLayer(floating) {
  if (!liftable(floating)) return null;
  adoptLiftedRule(floating);
  floating.setAttribute(LIFTED, '');
  floating.setAttribute('popover', 'manual');

  try {
    floating.showPopover();
  } catch {
    floating.removeAttribute('popover');
    floating.removeAttribute(LIFTED);
    return null;
  }

  return () => {
    if (floating.hasAttribute(LIFTED)) {
      try {
        if (floating.matches(':popover-open')) floating.hidePopover();
      } catch {
        /* already gone from the document */
      }

      floating.removeAttribute('popover');
      floating.removeAttribute(LIFTED);
    }
  };
} // The scroll positions inside a floating surface (the surface itself and every
// box in it that is scrolled), to be put back after a measurement that lifted
// its height cap. Only boxes away from their start are kept.

function scrollOffsets(floating) {
  const found = [];

  const keep = element => {
    if (element.scrollTop || element.scrollLeft) found.push([element, element.scrollTop, element.scrollLeft]);
  };

  keep(floating);

  for (const element of floating.querySelectorAll('*')) keep(element);

  return found;
} // Put back at once: the Framework sheet makes every box scroll smoothly
// (* {scroll-behavior: smooth}, core scroll), and an assigned scrollTop glided
// from the start the measurement threw it to. After a page scroll the list ran
// 0 -> 800 over half a second and read 784 when the probe looked; a reposition
// during the glide kept the value it had reached (R171 follow-up, 2026-11-12).


function restoreScrollOffsets(found) {
  for (const [element, top, left] of found) {
    if (!element.isConnected) continue;
    if (element.scrollTop !== top || element.scrollLeft !== left) element.scrollTo({
      top,
      left,
      behavior: 'instant'
    });
  }
}

function fixedContainingBlock(element) {
  const view = element.ownerDocument.defaultView;
  if (inTopLayer(element)) return view;

  for (let node = element.parentElement; node && node !== node.ownerDocument.body && node !== node.ownerDocument.documentElement; node = node.parentElement) {
    if (containsFixed(node)) return node;
    if (inTopLayer(node)) return view;
  }

  return view;
}
/** The rectangle a reference occupies: its own, or what it draws when it has none. */


function referenceRect(element) {
  if (!drawsNoBox(element)) return element.getBoundingClientRect();
  const boxes = boxesOf(element).map(box => box.getBoundingClientRect());
  if (!boxes.length) return element.getBoundingClientRect();
  const left = Math.min(...boxes.map(box => box.left));
  const top = Math.min(...boxes.map(box => box.top));
  const right = Math.max(...boxes.map(box => box.right));
  const bottom = Math.max(...boxes.map(box => box.bottom));
  return new DOMRect(left, top, right - left, bottom - top);
}
/** The element positioning measures: the reference itself, or for a host that draws no box a stand-in that measures what it draws. */

function anchorReference(element) {
  if (!drawsNoBox(element)) return element;
  return {
    getBoundingClientRect: () => referenceRect(element),
    getClientRects: () => [referenceRect(element)],

    get contextElement() {
      return boxesOf(element)[0] || element.parentElement || element;
    }

  };
} // data-sf-density on the root or on a region restates the space tokens; one
// attribute filter, so nothing else on the page wakes it.

function watchDensity(doc, run) {
  const view = doc?.defaultView;
  if (typeof view?.MutationObserver !== 'function') return () => {};
  const observer = new view.MutationObserver(() => run());
  observer.observe(doc.documentElement, {
    attributes: true,
    subtree: true,
    attributeFilter: ['data-sf-density']
  });
  return () => observer.disconnect();
}
/**
 * Keeps `floating` anchored to `reference`.
 * options: {side, align, offset, alignmentOffset, padding, flip, shift,
 *           matchWidth, fitHeight, autoUpdate, topLayer, onPosition({side, placement, x, y})}
 * matchWidth: true makes the panel exactly as wide as the reference; "min"
 * makes it at least as wide (a list at a field, decision C32: it may grow with
 * its longest option up to its own cap, never narrower than the field).
 * topLayer (default true) lifts the floating element into the top layer while
 * it is anchored (see liftToTopLayer); false keeps it where it stands.
 * Returns {update(): Promise, stop(), side}.
 */


function anchor(reference, floating, options = {}) {
  if (!(reference instanceof Element) || !(floating instanceof HTMLElement)) {
    throw new TypeError('Anchored positioning needs a reference element and a floating element');
  } // Measured through what it draws when the reference draws no box (#68).


  const measured = anchorReference(reference);
  const settings = {
    side: 'block-end',
    align: 'start',
    offset: 'var(--sf-space-1\\/4)',
    alignmentOffset: 0,
    padding: 'var(--sf-space-1\\/2)',
    flip: true,
    shift: true,
    matchWidth: false,
    fitHeight: true,
    autoUpdate: true,
    topLayer: true,
    onPosition: null,
    ...options
  }; // Inline styles this helper writes are restored on stop(); the author's caps
  // are kept, so viewport fitting may only tighten them.

  const written = ['position', 'left', 'top', 'right', 'bottom', 'margin', 'max-height', 'max-width', ...(settings.matchWidth === 'min' ? ['min-width'] : settings.matchWidth ? ['width'] : [])];
  const saved = written.map(name => [name, floating.style.getPropertyValue(name), floating.style.getPropertyPriority(name)]);
  const authored = {
    maxHeight: floating.style.getPropertyValue('max-height')
  }; // Stylesheet caps (max-height, max-width) are read before this helper writes
  // inline values, so fitting the viewport never loosens them.
  // A percentage cap is kept as written by getComputedStyle; read as pixels,
  // max-inline-size: 100% made every tooltip 100px wide. The panel is fixed, so
  // a percentage is of the viewport.
  // Lifted before its caps are read: the panel is measured where it is drawn.

  const lower = settings.topLayer ? liftToTopLayer(floating) : null;
  const floatingStyle = getComputedStyle(floating);

  const cap = (value, whole) => {
    const number = parseFloat(value);
    if (!Number.isFinite(number)) return Infinity;
    return String(value).trim().endsWith('%') ? number / 100 * whole : number;
  };

  const heightCap = cap(floatingStyle.maxHeight, document.documentElement.clientHeight);
  const widthCap = cap(floatingStyle.maxWidth, document.documentElement.clientWidth); // A point -- a reference that draws a box of no size: a fixed span where a
  // right-click or a long press was (sf-menu-context, C164 (1)) -- is not a
  // control the panel hangs from but a corner, as system menus open: the panel
  // flips to the other side of the point on both axes when it does not fit,
  // left of it at the right edge (right of it in RTL), above it at the bottom.
  // Shifted, it covered the point and stood 36 px off it on a phone (ui-view
  // K1 follow-ups, 2026-11-15). Only when it fits on neither side is it
  // shifted, to the viewport's edge less the padding (--sf-space-1/2), on the
  // side with more room. A box of any size keeps its alignment and is shifted.

  const pointBox = reference.getBoundingClientRect();
  const atPoint = pointBox.width === 0 && pointBox.height === 0 && reference.getClientRects().length > 0;
  const controller = {
    side: settings.side,
    stopped: false
  };
  let running = null;
  let pending = false;
  let pendingFull = false; // The cost of a position (datepicker audit P1/P2, 2026-11-11). Each
  // resolveLength of a token inserts a probe span and restyles the whole
  // document (about 9 ms on a docs page), and resetting max-height to read
  // the natural height forces another; per scroll event that made 800 px of
  // scrolling with a panel open cost 1.8-2.3 s of style recalculation. So:
  // - the lengths (offset, padding, alignmentOffset) are resolved once per
  //   anchor, and again only when the window's size changed;
  // - a full fit -- the first, a resize, the panel or its reference changing
  //   size, or update() from the component -- measures as before: direction,
  //   viewport width, containing block, natural height;
  // - a scroll or a layout shift asks for a light fit, at most once per
  //   frame: it reuses those measurements and only places the panel again.
  //   Flip, shift and the size caps run exactly as in a full fit; flipping
  //   compares the natural height measured by the last full fit (the panel's
  //   content does not change by scrolling; when it does, its size changes
  //   and that is a full fit), and max-height is not reset to read it.
  // - Inline styles and data-sf-side are written only when they change.
  // A density change (data-sf-density on the root or a region) restates
  // the space tokens without resizing the window, and the gap stayed the old
  // one until the panel was opened again (C59 S1 acceptance M1). The key also
  // carries the computed values of the tokens the lengths are written with: a
  // read of a clean style, no probe and no restyle.

  const tokens = [...new Set([settings.offset, settings.padding, settings.alignmentOffset].filter(value => typeof value === 'string').flatMap(value => [...value.matchAll(/var\(\s*(--(?:\\.|[^\s,)\\])+)/gu)].map(match => match[1].replace(/\\(.)/gu, '$1'))))];
  let lengths = null;

  const lengthsNow = () => {
    const context = reference.parentElement;
    const values = tokens.length && context?.isConnected ? tokens.map(name => getComputedStyle(context).getPropertyValue(name).trim()).join('|') : '';
    const key = `${window.innerWidth}x${window.innerHeight}|${values}`;

    if (!lengths || lengths.key !== key) {
      lengths = {
        key,
        gap: resolveLength(settings.offset, context),
        padding: resolveLength(settings.padding, context),
        alignment: resolveLength(settings.alignmentOffset, context)
      };
    }

    return lengths;
  };

  let measures = null;

  const put = (style, name, value) => {
    if (style[name] !== value) style[name] = value;
  };

  const run = async full => {
    // Measuring the natural height takes the cap off for a moment: a list
    // that scrolls inside the panel stops overflowing, and the browser puts
    // its scroll back to the start. Every reposition that measured -- one per
    // wheel step for a dropdown that follows the page's scroll in capture --
    // threw the list back to its top, so it never moved and shook in place
    // (owner R171, 2026-11-12), and a list scrolled to a keyboard-focused
    // option jumped back to its first row (keyboard reveal). Only a fit that
    // takes the cap off (a full fit, or the first) can clamp the scroll; a
    // light fit keeps the cap and needs nothing put back. What was scrolled
    // is put back once the cap is, and before onPosition, so a component that
    // scrolls there has the last word.
    let scrolled = settings.fitHeight && (full || !measures) ? scrollOffsets(floating) : null;

    const putBack = () => {
      if (scrolled) restoreScrollOffsets(scrolled);
      scrolled = null;
    };

    try {
      return await place(full, putBack);
    } finally {
      putBack();
    }
  };

  const place = async (full, putBack) => {
    // The panel is fixed before it is measured, so it is measured in the box
    // it will be placed in: left absolute by the stylesheet (a tooltip in its
    // anchor), its first position was taken from the anchor and written as
    // the viewport's.
    if (floating.style.position !== 'fixed') floating.style.position = 'fixed';

    if (full || !measures) {
      measures = {
        rtl: isRtl(reference),
        clientWidth: document.documentElement.clientWidth,
        container: null,
        natural: 0
      }; // Measure the natural size so flipping compares the real panel height.

      if (settings.fitHeight) {
        put(floating.style, 'maxHeight', authored.maxHeight || '');
        measures.natural = floating.getBoundingClientRect().height;
      }
    }

    const {
      rtl,
      clientWidth,
      natural
    } = measures;
    const {
      gap,
      padding,
      alignment
    } = lengthsNow(); // A light fit starts from the natural height, as a full fit does after
    // its reset; once the size middleware has written the cap, the panel is
    // measured as it is (Floating UI's own second pass).

    let naturalPass = !full && settings.fitHeight; // alignmentOffset moves a start/end-aligned panel along its edge (mirrored
    // for end), e.g. so a tail points at the middle of a small trigger.
    // The panel keeps its distance from the viewport's inline edges, but never
    // more than its field keeps. With a flat padding a field closer to the edge
    // than the padding -- every field in a documentation example, which starts
    // at the frame's edge -- had its panel pushed inward by the difference and
    // hanging past the field on the other side. The edge a field reaches is an
    // edge its own panel may reach too.

    const box = referenceRect(reference); // A point is not a field at a frame's edge: it keeps the whole padding.

    const edges = {
      top: padding,
      bottom: padding,
      left: atPoint ? padding : Math.min(padding, Math.max(0, box.left)),
      right: atPoint ? padding : Math.min(padding, Math.max(0, clientWidth - box.right))
    };
    const middleware = [(0,_floating_ui_dom__WEBPACK_IMPORTED_MODULE_0__.offset)({
      mainAxis: gap,
      alignmentAxis: alignment
    })]; // crossAxis: a point also flips its alignment (start <-> end) when the
    // panel overflows the inline edge; a box only flips its side.

    if (settings.flip) middleware.push((0,_floating_ui_dom__WEBPACK_IMPORTED_MODULE_0__.flip)({
      padding,
      crossAxis: atPoint
    })); // Shift before size: a panel near the inline edge moves inside the viewport
    // instead of being squeezed to the space left of its field.

    if (settings.shift) middleware.push((0,_floating_ui_dom__WEBPACK_IMPORTED_MODULE_0__.shift)({
      padding: edges,
      crossAxis: false
    }));
    middleware.push((0,_floating_ui_dom__WEBPACK_IMPORTED_MODULE_0__.size)({
      padding: edges,

      apply({
        availableWidth,
        availableHeight,
        rects,
        elements
      }) {
        naturalPass = false;
        if (controller.stopped) return;
        const viewportWidth = clientWidth - edges.left - edges.right;
        const fieldWidth = `${Math.max(0, Math.min(rects.reference.width, viewportWidth))}px`;
        if (settings.matchWidth === 'min') put(elements.floating.style, 'minWidth', fieldWidth);else if (settings.matchWidth) put(elements.floating.style, 'width', fieldWidth);
        put(elements.floating.style, 'maxWidth', `${Math.max(0, Math.min(availableWidth, viewportWidth, widthCap))}px`);

        if (settings.fitHeight) {
          // A panel that misses its room by less than the edge's padding takes
          // its whole height, rounded up, and stands that much nearer the edge:
          // clamped half a pixel or a few pixels short, every row showed and a
          // scrollbar still stood beside them, its thumb the whole track
          // (owner R018, 2026-11-07, a five-language menu at DPR 1).
          const room = Math.min(availableHeight, heightCap);
          const whole = Math.ceil(natural);
          const fits = whole > room && whole <= availableHeight + padding && whole <= heightCap;
          put(elements.floating.style, 'maxHeight', `${Math.max(0, fits ? whole : room)}px`);
        }
      }

    }));
    const result = await (0,_floating_ui_dom__WEBPACK_IMPORTED_MODULE_0__.computePosition)(measured, floating, {
      strategy: 'fixed',
      // The panel is fixed: its offset parent is the box it is placed in.
      platform: { ..._floating_ui_dom__WEBPACK_IMPORTED_MODULE_0__.platform,
        getOffsetParent: (element, polyfill) => element === floating ? measures.container ??= fixedContainingBlock(floating) : _floating_ui_dom__WEBPACK_IMPORTED_MODULE_0__.platform.getOffsetParent(element, polyfill),
        getDimensions: element => {
          const dimensions = _floating_ui_dom__WEBPACK_IMPORTED_MODULE_0__.platform.getDimensions(element);
          return element === floating && naturalPass ? { ...dimensions,
            height: natural
          } : dimensions;
        }
      },
      placement: (0,_position_placement_js__WEBPACK_IMPORTED_MODULE_1__.physicalPlacement)(settings.side, settings.align, rtl),
      middleware
    });
    if (controller.stopped) return result; // right/bottom are cleared so logical insets from the component stylesheet
    // (for example inset-inline-start in RTL) cannot over-constrain the box.

    const placed = {
      position: 'fixed',
      left: `${result.x}px`,
      top: `${result.y}px`,
      right: 'auto',
      bottom: 'auto',
      margin: '0px'
    };

    for (const [name, value] of Object.entries(placed)) put(floating.style, name, value);

    controller.side = (0,_position_placement_js__WEBPACK_IMPORTED_MODULE_1__.logicalSide)(result.placement, rtl);
    if (floating.dataset.sfSide !== controller.side) floating.dataset.sfSide = controller.side;
    putBack();
    settings.onPosition?.({
      side: controller.side,
      placement: result.placement,
      x: result.x,
      y: result.y
    });
    return result;
  }; // Coalesce bursts (scroll, resize, observers) into one computation at a
  // time; a full fit asked for while one runs is not lost to a light one.


  const request = full => {
    if (controller.stopped) return Promise.resolve(null);

    if (running) {
      pending = true;
      pendingFull ||= full;
      return running;
    }

    running = run(full).finally(() => {
      running = null;

      if (pending && !controller.stopped) {
        const again = pendingFull;
        pending = false;
        pendingFull = false;
        request(again);
      }
    });
    return running;
  };
  /** A full fit: measures again (the component calls it after it changed the panel). */


  controller.update = () => request(true); // Scroll and layout shift: a light fit, at most once per frame.


  let frame = 0;
  let armed = false;

  const follow = () => {
    if (!armed || frame || controller.stopped) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      request(false);
    });
  };

  const cleanups = settings.autoUpdate ? [// Resize of the window or an overflow ancestor, and of the panel or its
  // reference: a full fit (also the first one).
  (0,_floating_ui_dom__WEBPACK_IMPORTED_MODULE_0__.autoUpdate)(measured, floating, controller.update, {
    ancestorScroll: false,
    layoutShift: false
  }), // Scroll of any overflow ancestor and a moved reference: a light fit.
  (0,_floating_ui_dom__WEBPACK_IMPORTED_MODULE_0__.autoUpdate)(measured, floating, follow, {
    ancestorResize: false,
    elementResize: false
  }), // A density switch that moves no box still restates the gap: a full fit.
  ...(tokens.length ? [watchDensity(floating.ownerDocument, controller.update)] : [])] : [];
  armed = true;

  controller.stop = () => {
    controller.stopped = true;
    if (frame) cancelAnimationFrame(frame);
    frame = 0;

    for (const cleanup of cleanups) cleanup();

    delete floating.dataset.sfSide;
    lower?.();

    for (const [name, value, priority] of saved) {
      if (value) floating.style.setProperty(name, value, priority);else floating.style.removeProperty(name);
    }
  };

  if (!settings.autoUpdate) controller.update();
  return controller;
}
const Position = Object.freeze({
  anchor,
  anchorReference,
  referenceRect,
  liftToTopLayer,
  logicalSide: _position_placement_js__WEBPACK_IMPORTED_MODULE_1__.logicalSide,
  physicalPlacement: _position_placement_js__WEBPACK_IMPORTED_MODULE_1__.physicalPlacement,
  resolveLength
}); // Core publishes the helper; component bundles that carry their own copy reuse
// an already published one instead of replacing it.

if (typeof globalThis !== 'undefined') {
  globalThis.SF = globalThis.SF || {};
  if (!globalThis.SF.Position) globalThis.SF.Position = Position;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Position);

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
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

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
/* harmony import */ var _deprecations_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("06e8cd089f28");
/* harmony import */ var _alias_table_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("f49a716b86bd");
/* harmony import */ var _tag_aliases_generated_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("f28a9d913ce0");
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

/***/ },

/***/ "57cf5fca5804"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "b4b2e395e4eb"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   arrow: () => (/* binding */ arrow),
/* harmony export */   autoPlacement: () => (/* binding */ autoPlacement),
/* harmony export */   computePosition: () => (/* binding */ computePosition),
/* harmony export */   detectOverflow: () => (/* binding */ detectOverflow),
/* harmony export */   flip: () => (/* binding */ flip),
/* harmony export */   hide: () => (/* binding */ hide),
/* harmony export */   inline: () => (/* binding */ inline),
/* harmony export */   limitShift: () => (/* binding */ limitShift),
/* harmony export */   offset: () => (/* binding */ offset),
/* harmony export */   rectToClientRect: () => (/* reexport safe */ _floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.rectToClientRect),
/* harmony export */   shift: () => (/* binding */ shift),
/* harmony export */   size: () => (/* binding */ size)
/* harmony export */ });
/* harmony import */ var _floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("56345afd9e11");



function computeCoordsFromPlacement(_ref, placement, rtl) {
  let {
    reference,
    floating
  } = _ref;
  const sideAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(placement);
  const alignmentAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignmentAxis)(placement);
  const alignLength = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAxisLength)(alignmentAxis);
  const side = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement);
  const isVertical = sideAxis === 'y';
  const commonX = reference.x + reference.width / 2 - floating.width / 2;
  const commonY = reference.y + reference.height / 2 - floating.height / 2;
  const commonAlign = reference[alignLength] / 2 - floating[alignLength] / 2;
  let coords;
  switch (side) {
    case 'top':
      coords = {
        x: commonX,
        y: reference.y - floating.height
      };
      break;
    case 'bottom':
      coords = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;
    case 'right':
      coords = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;
    case 'left':
      coords = {
        x: reference.x - floating.width,
        y: commonY
      };
      break;
    default:
      coords = {
        x: reference.x,
        y: reference.y
      };
  }
  const alignment = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(placement);
  if (alignment) {
    coords[alignmentAxis] += commonAlign * (alignment === 'end' ? 1 : -1) * (rtl && isVertical ? -1 : 1);
  }
  return coords;
}

/**
 * Resolves with an object of overflow side offsets that determine how much the
 * element is overflowing a given clipping boundary on each side.
 * - positive = overflowing the boundary by that number of pixels
 * - negative = how many pixels left before it will overflow
 * - 0 = lies flush with the boundary
 * @see https://floating-ui.com/docs/detectOverflow
 */
async function detectOverflow(state, options) {
  var _await$platform$isEle;
  if (options === void 0) {
    options = {};
  }
  const {
    x,
    y,
    platform,
    rects,
    elements,
    strategy
  } = state;
  const {
    boundary = 'clippingAncestors',
    rootBoundary = 'viewport',
    elementContext = 'floating',
    altBoundary = false,
    padding = 0
  } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);
  const paddingObject = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getPaddingObject)(padding);
  const altContext = elementContext === 'floating' ? 'reference' : 'floating';
  const element = elements[altBoundary ? altContext : elementContext];
  const clippingClientRect = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.rectToClientRect)(await platform.getClippingRect({
    element: ((_await$platform$isEle = await (platform.isElement == null ? void 0 : platform.isElement(element))) != null ? _await$platform$isEle : true) ? element : element.contextElement || (await (platform.getDocumentElement == null ? void 0 : platform.getDocumentElement(elements.floating))),
    boundary,
    rootBoundary,
    strategy
  }));
  const rect = elementContext === 'floating' ? {
    x,
    y,
    width: rects.floating.width,
    height: rects.floating.height
  } : rects.reference;
  const offsetParent = await (platform.getOffsetParent == null ? void 0 : platform.getOffsetParent(elements.floating));
  const offsetScale = (await (platform.isElement == null ? void 0 : platform.isElement(offsetParent))) && (await (platform.getScale == null ? void 0 : platform.getScale(offsetParent))) || {
    x: 1,
    y: 1
  };
  const elementClientRect = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.rectToClientRect)(platform.convertOffsetParentRelativeRectToViewportRelativeRect ? await platform.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements,
    rect,
    offsetParent,
    strategy
  }) : rect);
  return {
    top: (clippingClientRect.top - elementClientRect.top + paddingObject.top) / offsetScale.y,
    bottom: (elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom) / offsetScale.y,
    left: (clippingClientRect.left - elementClientRect.left + paddingObject.left) / offsetScale.x,
    right: (elementClientRect.right - clippingClientRect.right + paddingObject.right) / offsetScale.x
  };
}

// Maximum number of resets that can occur before bailing to avoid infinite reset loops.
const MAX_RESET_COUNT = 50;

/**
 * Computes the `x` and `y` coordinates that will place the floating element
 * next to a given reference element.
 *
 * This export does not have any `platform` interface logic. You will need to
 * write one for the platform you are using Floating UI with.
 */
const computePosition = async (reference, floating, config) => {
  const {
    placement = 'bottom',
    strategy = 'absolute',
    middleware = [],
    platform
  } = config;
  const platformWithDetectOverflow = platform.detectOverflow ? platform : {
    ...platform,
    detectOverflow
  };
  const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(floating));
  let rects = await platform.getElementRects({
    reference,
    floating,
    strategy
  });
  let {
    x,
    y
  } = computeCoordsFromPlacement(rects, placement, rtl);
  let statefulPlacement = placement;
  let resetCount = 0;
  const middlewareData = {};
  for (let i = 0; i < middleware.length; i++) {
    const currentMiddleware = middleware[i];
    if (!currentMiddleware) {
      continue;
    }
    const {
      name,
      fn
    } = currentMiddleware;
    const {
      x: nextX,
      y: nextY,
      data,
      reset
    } = await fn({
      x,
      y,
      initialPlacement: placement,
      placement: statefulPlacement,
      strategy,
      middlewareData,
      rects,
      platform: platformWithDetectOverflow,
      elements: {
        reference,
        floating
      }
    });
    x = nextX != null ? nextX : x;
    y = nextY != null ? nextY : y;
    middlewareData[name] = {
      ...middlewareData[name],
      ...data
    };
    if (reset && resetCount < MAX_RESET_COUNT) {
      resetCount++;
      if (typeof reset === 'object') {
        if (reset.placement) {
          statefulPlacement = reset.placement;
        }
        if (reset.rects) {
          rects = reset.rects === true ? await platform.getElementRects({
            reference,
            floating,
            strategy
          }) : reset.rects;
        }
        ({
          x,
          y
        } = computeCoordsFromPlacement(rects, statefulPlacement, rtl));
      }
      i = -1;
    }
  }
  return {
    x,
    y,
    placement: statefulPlacement,
    strategy,
    middlewareData
  };
};

/**
 * Provides data to position an inner element of the floating element so that it
 * appears centered to the reference element.
 * @see https://floating-ui.com/docs/arrow
 */
const arrow = options => ({
  name: 'arrow',
  options,
  async fn(state) {
    const {
      x,
      y,
      placement,
      rects,
      platform,
      elements,
      middlewareData
    } = state;
    // Since `element` is required, we don't Partial<> the type.
    const {
      element,
      padding = 0
    } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state) || {};
    if (element == null) {
      return {};
    }
    const paddingObject = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getPaddingObject)(padding);
    const coords = {
      x,
      y
    };
    const axis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignmentAxis)(placement);
    const length = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAxisLength)(axis);
    const arrowDimensions = await platform.getDimensions(element);
    const isYAxis = axis === 'y';
    const minProp = isYAxis ? 'top' : 'left';
    const maxProp = isYAxis ? 'bottom' : 'right';
    const clientProp = isYAxis ? 'clientHeight' : 'clientWidth';
    const endDiff = rects.reference[length] + rects.reference[axis] - coords[axis] - rects.floating[length];
    const startDiff = coords[axis] - rects.reference[axis];
    const arrowOffsetParent = await (platform.getOffsetParent == null ? void 0 : platform.getOffsetParent(element));
    let clientSize = arrowOffsetParent ? arrowOffsetParent[clientProp] : 0;

    // DOM platform can return `window` as the `offsetParent`.
    if (!clientSize || !(await (platform.isElement == null ? void 0 : platform.isElement(arrowOffsetParent)))) {
      clientSize = elements.floating[clientProp] || rects.floating[length];
    }
    const centerToReference = endDiff / 2 - startDiff / 2;

    // If the padding is large enough that it causes the arrow to no longer be
    // centered, modify the padding so that it is centered.
    const largestPossiblePadding = clientSize / 2 - arrowDimensions[length] / 2 - 1;
    const minPadding = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.min)(paddingObject[minProp], largestPossiblePadding);
    const maxPadding = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.min)(paddingObject[maxProp], largestPossiblePadding);

    // Make sure the arrow doesn't overflow the floating element if the center
    // point is outside the floating element's bounds.
    const max = clientSize - arrowDimensions[length] - maxPadding;
    const center = clientSize / 2 - arrowDimensions[length] / 2 + centerToReference;
    const offset = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.clamp)(minPadding, center, max);

    // If the reference is small enough that the arrow's padding causes it to
    // to point to nothing for an aligned placement, adjust the offset of the
    // floating element itself. To ensure `shift()` continues to take action,
    // a single reset is performed when this is true.
    const shouldAddOffset = !middlewareData.arrow && (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(placement) != null && center !== offset && rects.reference[length] / 2 - (center < minPadding ? minPadding : maxPadding) - arrowDimensions[length] / 2 < 0;
    const alignmentOffset = shouldAddOffset ? center < minPadding ? center - minPadding : center - max : 0;
    return {
      [axis]: coords[axis] + alignmentOffset,
      data: {
        [axis]: offset,
        centerOffset: center - offset - alignmentOffset,
        ...(shouldAddOffset && {
          alignmentOffset
        })
      },
      reset: shouldAddOffset
    };
  }
});

function getPlacementList(alignment, autoAlignment, allowedPlacements) {
  const allowedPlacementsSortedByAlignment = alignment ? [...allowedPlacements.filter(placement => (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(placement) === alignment), ...allowedPlacements.filter(placement => (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(placement) !== alignment)] : allowedPlacements.filter(placement => (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement) === placement);
  return allowedPlacementsSortedByAlignment.filter(placement => {
    if (alignment) {
      return (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(placement) === alignment || (autoAlignment ? (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getOppositeAlignmentPlacement)(placement) !== placement : false);
    }
    return true;
  });
}
/**
 * Optimizes the visibility of the floating element by choosing the placement
 * that has the most space available automatically, without needing to specify a
 * preferred placement. Alternative to `flip`.
 * @see https://floating-ui.com/docs/autoPlacement
 */
const autoPlacement = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'autoPlacement',
    options,
    async fn(state) {
      var _middlewareData$autoP, _middlewareData$autoP2, _placementsThatFitOnE;
      const {
        rects,
        middlewareData,
        placement,
        platform,
        elements
      } = state;
      const {
        crossAxis = false,
        alignment,
        allowedPlacements = _floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.placements,
        autoAlignment = true,
        ...detectOverflowOptions
      } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);
      const placements$1 = alignment !== undefined || allowedPlacements === _floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.placements ? getPlacementList(alignment || null, autoAlignment, allowedPlacements) : allowedPlacements;
      const currentIndex = ((_middlewareData$autoP = middlewareData.autoPlacement) == null ? void 0 : _middlewareData$autoP.index) || 0;
      const currentPlacement = placements$1[currentIndex];
      if (currentPlacement == null) {
        return {};
      }

      // Make `computeCoords` start from the right place.
      if (placement !== currentPlacement) {
        return {
          reset: {
            placement: placements$1[0]
          }
        };
      }
      const overflow = await platform.detectOverflow(state, detectOverflowOptions);
      const alignmentSides = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignmentSides)(currentPlacement, rects, await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating)));
      const currentOverflows = [overflow[(0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(currentPlacement)], overflow[alignmentSides[0]], overflow[alignmentSides[1]]];
      const allOverflows = [...(((_middlewareData$autoP2 = middlewareData.autoPlacement) == null ? void 0 : _middlewareData$autoP2.overflows) || []), {
        placement: currentPlacement,
        overflows: currentOverflows
      }];
      const nextPlacement = placements$1[currentIndex + 1];

      // There are more placements to check.
      if (nextPlacement) {
        return {
          data: {
            index: currentIndex + 1,
            overflows: allOverflows
          },
          reset: {
            placement: nextPlacement
          }
        };
      }
      const placementsSortedByMostSpace = allOverflows.map(d => {
        const alignment = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(d.placement);
        return [d.placement, alignment && crossAxis ?
        // Check along the mainAxis and main crossAxis side.
        d.overflows.slice(0, 2).reduce((acc, v) => acc + v, 0) :
        // Check only the mainAxis.
        d.overflows[0], d.overflows];
      }).sort((a, b) => a[1] - b[1]);
      const placementsThatFitOnEachSide = placementsSortedByMostSpace.filter(d => d[2].slice(0,
      // Aligned placements should not check their opposite crossAxis
      // side.
      (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(d[0]) ? 2 : 3).every(v => v <= 0));
      const resetPlacement = ((_placementsThatFitOnE = placementsThatFitOnEachSide[0]) == null ? void 0 : _placementsThatFitOnE[0]) || placementsSortedByMostSpace[0][0];
      if (resetPlacement !== placement) {
        return {
          data: {
            index: currentIndex + 1,
            overflows: allOverflows
          },
          reset: {
            placement: resetPlacement
          }
        };
      }
      return {};
    }
  };
};

/**
 * Optimizes the visibility of the floating element by flipping the `placement`
 * in order to keep it in view when the preferred placement(s) will overflow the
 * clipping boundary. Alternative to `autoPlacement`.
 * @see https://floating-ui.com/docs/flip
 */
const flip = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'flip',
    options,
    async fn(state) {
      var _middlewareData$arrow, _middlewareData$flip;
      const {
        placement,
        middlewareData,
        rects,
        initialPlacement,
        platform,
        elements
      } = state;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = true,
        fallbackPlacements: specifiedFallbackPlacements,
        fallbackStrategy = 'bestFit',
        fallbackAxisSideDirection = 'none',
        flipAlignment = true,
        ...detectOverflowOptions
      } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);

      // If a reset by the arrow was caused due to an alignment offset being
      // added, we should skip any logic now since `flip()` has already done its
      // work.
      // https://github.com/floating-ui/floating-ui/issues/2549#issuecomment-1719601643
      if ((_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
        return {};
      }
      const side = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement);
      const initialSideAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(initialPlacement);
      const isBasePlacement = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(initialPlacement) === initialPlacement;
      const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating));
      const fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipAlignment ? [(0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getOppositePlacement)(initialPlacement)] : (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getExpandedPlacements)(initialPlacement));
      const hasFallbackAxisSideDirection = fallbackAxisSideDirection !== 'none';
      if (!specifiedFallbackPlacements && hasFallbackAxisSideDirection) {
        fallbackPlacements.push(...(0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getOppositeAxisPlacements)(initialPlacement, flipAlignment, fallbackAxisSideDirection, rtl));
      }
      const placements = [initialPlacement, ...fallbackPlacements];
      const overflow = await platform.detectOverflow(state, detectOverflowOptions);
      const overflows = [];
      let overflowsData = ((_middlewareData$flip = middlewareData.flip) == null ? void 0 : _middlewareData$flip.overflows) || [];
      if (checkMainAxis) {
        overflows.push(overflow[side]);
      }
      if (checkCrossAxis) {
        const sides = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignmentSides)(placement, rects, rtl);
        overflows.push(overflow[sides[0]], overflow[sides[1]]);
      }
      overflowsData = [...overflowsData, {
        placement,
        overflows
      }];

      // One or more sides is overflowing.
      if (!overflows.every(side => side <= 0)) {
        var _middlewareData$flip2, _overflowsData$filter;
        const nextIndex = (((_middlewareData$flip2 = middlewareData.flip) == null ? void 0 : _middlewareData$flip2.index) || 0) + 1;
        const nextPlacement = placements[nextIndex];
        if (nextPlacement) {
          const ignoreCrossAxisOverflow = checkCrossAxis === 'alignment' ? initialSideAxis !== (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(nextPlacement) : false;
          if (!ignoreCrossAxisOverflow ||
          // We leave the current main axis only if every placement on that axis
          // overflows the main axis.
          overflowsData.every(d => (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(d.placement) === initialSideAxis ? d.overflows[0] > 0 : true)) {
            // Try next placement and re-run the lifecycle.
            return {
              data: {
                index: nextIndex,
                overflows: overflowsData
              },
              reset: {
                placement: nextPlacement
              }
            };
          }
        }

        // First, find the candidates that fit on the mainAxis side of overflow,
        // then find the placement that fits the best on the main crossAxis side.
        let resetPlacement = (_overflowsData$filter = overflowsData.filter(d => d.overflows[0] <= 0).sort((a, b) => a.overflows[1] - b.overflows[1])[0]) == null ? void 0 : _overflowsData$filter.placement;

        // Otherwise fallback.
        if (!resetPlacement) {
          switch (fallbackStrategy) {
            case 'bestFit':
              {
                var _overflowsData$filter2;
                const placement = (_overflowsData$filter2 = overflowsData.filter(d => {
                  if (hasFallbackAxisSideDirection) {
                    const currentSideAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(d.placement);
                    return currentSideAxis === initialSideAxis ||
                    // Create a bias to the `y` side axis due to horizontal
                    // reading directions favoring greater width.
                    currentSideAxis === 'y';
                  }
                  return true;
                }).map(d => [d.placement, d.overflows.filter(overflow => overflow > 0).reduce((acc, overflow) => acc + overflow, 0)]).sort((a, b) => a[1] - b[1])[0]) == null ? void 0 : _overflowsData$filter2[0];
                if (placement) {
                  resetPlacement = placement;
                }
                break;
              }
            case 'initialPlacement':
              resetPlacement = initialPlacement;
              break;
          }
        }
        if (placement !== resetPlacement) {
          return {
            reset: {
              placement: resetPlacement
            }
          };
        }
      }
      return {};
    }
  };
};

function getSideOffsets(overflow, rect) {
  return {
    top: overflow.top - rect.height,
    right: overflow.right - rect.width,
    bottom: overflow.bottom - rect.height,
    left: overflow.left - rect.width
  };
}
function isAnySideFullyClipped(overflow) {
  return _floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.sides.some(side => overflow[side] >= 0);
}
/**
 * Provides data to hide the floating element in applicable situations, such as
 * when it is not in the same clipping context as the reference element.
 * @see https://floating-ui.com/docs/hide
 */
const hide = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'hide',
    options,
    async fn(state) {
      const {
        rects,
        platform
      } = state;
      const {
        strategy = 'referenceHidden',
        ...detectOverflowOptions
      } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);
      switch (strategy) {
        case 'referenceHidden':
          {
            const overflow = await platform.detectOverflow(state, {
              ...detectOverflowOptions,
              elementContext: 'reference'
            });
            const offsets = getSideOffsets(overflow, rects.reference);
            return {
              data: {
                referenceHiddenOffsets: offsets,
                referenceHidden: isAnySideFullyClipped(offsets)
              }
            };
          }
        case 'escaped':
          {
            const overflow = await platform.detectOverflow(state, {
              ...detectOverflowOptions,
              altBoundary: true
            });
            const offsets = getSideOffsets(overflow, rects.floating);
            return {
              data: {
                escapedOffsets: offsets,
                escaped: isAnySideFullyClipped(offsets)
              }
            };
          }
        default:
          {
            return {};
          }
      }
    }
  };
};

function getBoundingRect(rects) {
  const minX = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.min)(...rects.map(rect => rect.left));
  const minY = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.min)(...rects.map(rect => rect.top));
  const maxX = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.max)(...rects.map(rect => rect.right));
  const maxY = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.max)(...rects.map(rect => rect.bottom));
  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY
  };
}
function getRectsByLine(rects) {
  const sortedRects = rects.slice().sort((a, b) => a.y - b.y);
  const groups = [];
  let prevRect = null;
  for (let i = 0; i < sortedRects.length; i++) {
    const rect = sortedRects[i];
    if (!prevRect || rect.y - prevRect.y > prevRect.height / 2) {
      groups.push([rect]);
    } else {
      groups[groups.length - 1].push(rect);
    }
    prevRect = rect;
  }
  return groups.map(rect => (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.rectToClientRect)(getBoundingRect(rect)));
}
/**
 * Provides improved positioning for inline reference elements that can span
 * over multiple lines, such as hyperlinks or range selections.
 * @see https://floating-ui.com/docs/inline
 */
const inline = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'inline',
    options,
    async fn(state) {
      const {
        placement,
        elements,
        rects,
        platform,
        strategy
      } = state;
      // A MouseEvent's client{X,Y} coords can be up to 2 pixels off a
      // ClientRect's bounds, despite the event listener being triggered. A
      // padding of 2 seems to handle this issue.
      const {
        padding = 2,
        x,
        y
      } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);
      const nativeClientRects = Array.from((await (platform.getClientRects == null ? void 0 : platform.getClientRects(elements.reference))) || []);

      // No rects (e.g. a hidden or detached reference, or a collapsed range) —
      // keep the existing reference rect rather than resetting to an invalid
      // one with non-finite values.
      if (!nativeClientRects.length) {
        return {};
      }
      const clientRects = getRectsByLine(nativeClientRects);
      const fallback = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.rectToClientRect)(getBoundingRect(nativeClientRects));
      const paddingObject = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getPaddingObject)(padding);
      function getBoundingClientRect() {
        // There are two rects and they are disjoined.
        if (clientRects.length === 2 && (clientRects[0].left > clientRects[1].right || clientRects[1].left > clientRects[0].right) && x != null && y != null) {
          // Find the first rect in which the point is fully inside.
          return clientRects.find(rect => x > rect.left - paddingObject.left && x < rect.right + paddingObject.right && y > rect.top - paddingObject.top && y < rect.bottom + paddingObject.bottom) || fallback;
        }

        // There are 2 or more connected rects.
        if (clientRects.length >= 2) {
          if ((0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(placement) === 'y') {
            const firstRect = clientRects[0];
            const lastRect = clientRects[clientRects.length - 1];
            const isTop = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement) === 'top';
            const top = firstRect.top;
            const bottom = lastRect.bottom;
            const left = isTop ? firstRect.left : lastRect.left;
            const right = isTop ? firstRect.right : lastRect.right;
            return (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.rectToClientRect)({
              x: left,
              y: top,
              width: right - left,
              height: bottom - top
            });
          }
          const isLeftSide = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement) === 'left';
          const maxRight = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.max)(...clientRects.map(rect => rect.right));
          const minLeft = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.min)(...clientRects.map(rect => rect.left));
          const measureRects = clientRects.filter(rect => isLeftSide ? rect.left === minLeft : rect.right === maxRight);
          const top = measureRects[0].top;
          const bottom = measureRects[measureRects.length - 1].bottom;
          return (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.rectToClientRect)({
            x: minLeft,
            y: top,
            width: maxRight - minLeft,
            height: bottom - top
          });
        }
        return fallback;
      }
      const resetRects = await platform.getElementRects({
        reference: {
          getBoundingClientRect
        },
        floating: elements.floating,
        strategy
      });
      if (rects.reference.x !== resetRects.reference.x || rects.reference.y !== resetRects.reference.y || rects.reference.width !== resetRects.reference.width || rects.reference.height !== resetRects.reference.height) {
        return {
          reset: {
            rects: resetRects
          }
        };
      }
      return {};
    }
  };
};

const originSides = /*#__PURE__*/new Set(['left', 'top']);

// For type backwards-compatibility, the `OffsetOptions` type was also
// Derivable.

async function convertValueToCoords(state, options) {
  const {
    placement,
    platform,
    elements
  } = state;
  const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating));
  const side = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement);
  const alignment = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(placement);
  const isVertical = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(placement) === 'y';
  const mainAxisMulti = originSides.has(side) ? -1 : 1;
  const crossAxisMulti = rtl && isVertical ? -1 : 1;
  const rawValue = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);

  // eslint-disable-next-line prefer-const
  let {
    mainAxis,
    crossAxis,
    alignmentAxis
  } = typeof rawValue === 'number' ? {
    mainAxis: rawValue,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: rawValue.mainAxis || 0,
    crossAxis: rawValue.crossAxis || 0,
    alignmentAxis: rawValue.alignmentAxis
  };
  if (alignment && typeof alignmentAxis === 'number') {
    crossAxis = alignment === 'end' ? alignmentAxis * -1 : alignmentAxis;
  }
  return isVertical ? {
    x: crossAxis * crossAxisMulti,
    y: mainAxis * mainAxisMulti
  } : {
    x: mainAxis * mainAxisMulti,
    y: crossAxis * crossAxisMulti
  };
}

/**
 * Modifies the placement by translating the floating element along the
 * specified axes.
 * A number (shorthand for `mainAxis` or distance), or an axes configuration
 * object may be passed.
 * @see https://floating-ui.com/docs/offset
 */
const offset = function (options) {
  if (options === void 0) {
    options = 0;
  }
  return {
    name: 'offset',
    options,
    async fn(state) {
      var _middlewareData$offse, _middlewareData$arrow;
      const {
        x,
        y,
        placement,
        middlewareData
      } = state;
      const diffCoords = await convertValueToCoords(state, options);

      // If the placement is the same and the arrow caused an alignment offset
      // then we don't need to change the positioning coordinates.
      if (placement === ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse.placement) && (_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
        return {};
      }
      return {
        x: x + diffCoords.x,
        y: y + diffCoords.y,
        data: {
          ...diffCoords,
          placement
        }
      };
    }
  };
};

/**
 * Optimizes the visibility of the floating element by shifting it in order to
 * keep it in view when it will overflow the clipping boundary.
 * @see https://floating-ui.com/docs/shift
 */
const shift = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'shift',
    options,
    async fn(state) {
      const {
        x,
        y,
        placement,
        platform
      } = state;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = false,
        limiter = {
          fn: _ref => {
            let {
              x,
              y
            } = _ref;
            return {
              x,
              y
            };
          }
        },
        ...detectOverflowOptions
      } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);
      const coords = {
        x,
        y
      };
      const overflow = await platform.detectOverflow(state, detectOverflowOptions);
      const crossAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(placement);
      const mainAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getOppositeAxis)(crossAxis);
      let mainAxisCoord = coords[mainAxis];
      let crossAxisCoord = coords[crossAxis];
      const clampCoord = (axis, coord) => (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.clamp)(coord + overflow[axis === 'y' ? 'top' : 'left'], coord, coord - overflow[axis === 'y' ? 'bottom' : 'right']);
      if (checkMainAxis) {
        mainAxisCoord = clampCoord(mainAxis, mainAxisCoord);
      }
      if (checkCrossAxis) {
        crossAxisCoord = clampCoord(crossAxis, crossAxisCoord);
      }
      const limitedCoords = limiter.fn({
        ...state,
        [mainAxis]: mainAxisCoord,
        [crossAxis]: crossAxisCoord
      });
      return {
        ...limitedCoords,
        data: {
          x: limitedCoords.x - x,
          y: limitedCoords.y - y,
          enabled: {
            [mainAxis]: checkMainAxis,
            [crossAxis]: checkCrossAxis
          }
        }
      };
    }
  };
};
/**
 * Built-in `limiter` that will stop `shift()` at a certain point.
 */
const limitShift = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    options,
    fn(state) {
      var _rawOffset$mainAxis, _rawOffset$crossAxis;
      const {
        x,
        y,
        placement,
        rects,
        middlewareData
      } = state;
      const {
        offset = 0,
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = true
      } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);
      const coords = {
        x,
        y
      };
      const crossAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(placement);
      const mainAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getOppositeAxis)(crossAxis);
      let mainAxisCoord = coords[mainAxis];
      let crossAxisCoord = coords[crossAxis];
      const rawOffset = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(offset, state);
      const computedOffset = typeof rawOffset === 'number' ? {
        mainAxis: rawOffset,
        crossAxis: 0
      } : {
        mainAxis: (_rawOffset$mainAxis = rawOffset.mainAxis) != null ? _rawOffset$mainAxis : 0,
        crossAxis: (_rawOffset$crossAxis = rawOffset.crossAxis) != null ? _rawOffset$crossAxis : 0
      };
      if (checkMainAxis) {
        const len = mainAxis === 'y' ? 'height' : 'width';
        const limitMin = rects.reference[mainAxis] - rects.floating[len] + computedOffset.mainAxis;
        const limitMax = rects.reference[mainAxis] + rects.reference[len] - computedOffset.mainAxis;
        if (mainAxisCoord < limitMin) {
          mainAxisCoord = limitMin;
        } else if (mainAxisCoord > limitMax) {
          mainAxisCoord = limitMax;
        }
      }
      if (checkCrossAxis) {
        var _middlewareData$offse, _middlewareData$offse2;
        const len = mainAxis === 'y' ? 'width' : 'height';
        const isOriginSide = originSides.has((0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement));
        const limitMin = rects.reference[crossAxis] - rects.floating[len] + (isOriginSide ? ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse[crossAxis]) || 0 : 0) + (isOriginSide ? 0 : computedOffset.crossAxis);
        const limitMax = rects.reference[crossAxis] + rects.reference[len] + (isOriginSide ? 0 : ((_middlewareData$offse2 = middlewareData.offset) == null ? void 0 : _middlewareData$offse2[crossAxis]) || 0) - (isOriginSide ? computedOffset.crossAxis : 0);
        if (crossAxisCoord < limitMin) {
          crossAxisCoord = limitMin;
        } else if (crossAxisCoord > limitMax) {
          crossAxisCoord = limitMax;
        }
      }
      return {
        [mainAxis]: mainAxisCoord,
        [crossAxis]: crossAxisCoord
      };
    }
  };
};

// Method syntax keeps callback parameters bivariant, but expressing the
// explicit `| undefined` required by `exactOptionalPropertyTypes` needs
// property syntax, which is contravariant under `strictFunctionTypes`.
// Extracting the function from a method position restores that bivariance so
// consumers can still assign callbacks with narrower parameter types.

/**
 * Provides data that allows you to change the size of the floating element —
 * for instance, prevent it from overflowing the clipping boundary or match the
 * width of the reference element.
 * @see https://floating-ui.com/docs/size
 */
const size = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'size',
    options,
    async fn(state) {
      const {
        placement,
        rects,
        platform,
        elements
      } = state;
      const {
        apply = () => {},
        ...detectOverflowOptions
      } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);
      const overflow = await platform.detectOverflow(state, detectOverflowOptions);
      const side = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement);
      const alignment = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(placement);
      const isYAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(placement) === 'y';
      const {
        width,
        height
      } = rects.floating;
      let heightSide;
      let widthSide;
      if (side === 'top' || side === 'bottom') {
        heightSide = side;
        widthSide = alignment === ((await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating))) ? 'start' : 'end') ? 'left' : 'right';
      } else {
        widthSide = side;
        heightSide = alignment === 'end' ? 'top' : 'bottom';
      }
      const maximumClippingHeight = height - overflow.top - overflow.bottom;
      const maximumClippingWidth = width - overflow.left - overflow.right;
      const overflowAvailableHeight = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.min)(height - overflow[heightSide], maximumClippingHeight);
      const overflowAvailableWidth = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.min)(width - overflow[widthSide], maximumClippingWidth);
      const shiftData = state.middlewareData.shift;
      const noShift = !shiftData;
      let availableHeight = overflowAvailableHeight;
      let availableWidth = overflowAvailableWidth;
      if (shiftData != null && shiftData.enabled.x) {
        availableWidth = maximumClippingWidth;
      }
      if (shiftData != null && shiftData.enabled.y) {
        availableHeight = maximumClippingHeight;
      }
      if (noShift && !alignment) {
        if (isYAxis) {
          availableWidth = width - 2 * (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.max)(overflow.left, overflow.right);
        } else {
          availableHeight = height - 2 * (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.max)(overflow.top, overflow.bottom);
        }
      }
      await apply({
        ...state,
        availableWidth,
        availableHeight
      });
      const nextDimensions = await platform.getDimensions(elements.floating);
      if (width !== nextDimensions.width || height !== nextDimensions.height) {
        return {
          reset: {
            rects: true
          }
        };
      }
      return {};
    }
  };
};




/***/ },

/***/ "6d338aa773af"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* empty/unused harmony star reexport */
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   arrow: () => (/* binding */ arrow),
/* harmony export */   autoPlacement: () => (/* binding */ autoPlacement),
/* harmony export */   autoUpdate: () => (/* binding */ autoUpdate),
/* harmony export */   computePosition: () => (/* binding */ computePosition),
/* harmony export */   detectOverflow: () => (/* binding */ detectOverflow),
/* harmony export */   flip: () => (/* binding */ flip),
/* harmony export */   hide: () => (/* binding */ hide),
/* harmony export */   inline: () => (/* binding */ inline),
/* harmony export */   limitShift: () => (/* binding */ limitShift),
/* harmony export */   offset: () => (/* binding */ offset),
/* harmony export */   platform: () => (/* binding */ platform),
/* harmony export */   shift: () => (/* binding */ shift),
/* harmony export */   size: () => (/* binding */ size)
/* harmony export */ });
/* harmony import */ var _floating_ui_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("b4b2e395e4eb");
/* harmony import */ var _floating_ui_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("56345afd9e11");
/* harmony import */ var _floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("d7f28916ed76");





function getCssDimensions(element) {
  const css = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getComputedStyle)(element);
  // In testing environments, the `width` and `height` properties are empty
  // strings for SVG elements, returning NaN. Fallback to `0` in this case.
  let width = parseFloat(css.width) || 0;
  let height = parseFloat(css.height) || 0;
  const hasOffset = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isHTMLElement)(element);
  const offsetWidth = hasOffset ? element.offsetWidth : width;
  const offsetHeight = hasOffset ? element.offsetHeight : height;
  const shouldFallback = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.round)(width) !== offsetWidth || (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.round)(height) !== offsetHeight;
  if (shouldFallback) {
    width = offsetWidth;
    height = offsetHeight;
  }
  return {
    width,
    height,
    $: shouldFallback
  };
}

function unwrapElement(element) {
  return !(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isElement)(element) ? element.contextElement : element;
}

function getScale(element) {
  const domElement = unwrapElement(element);
  if (!(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isHTMLElement)(domElement)) {
    return (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.createCoords)(1);
  }
  const rect = domElement.getBoundingClientRect();
  const {
    width,
    height,
    $
  } = getCssDimensions(domElement);
  let x = ($ ? (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.round)(rect.width) : rect.width) / width;
  let y = ($ ? (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.round)(rect.height) : rect.height) / height;

  // 0, NaN, or Infinity should always fallback to 1.

  if (!x || !Number.isFinite(x)) {
    x = 1;
  }
  if (!y || !Number.isFinite(y)) {
    y = 1;
  }
  return {
    x,
    y
  };
}

const noOffsets = /*#__PURE__*/(0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.createCoords)(0);
function getVisualOffsets(element) {
  const win = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getWindow)(element);
  if (!(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isWebKit)() || !win.visualViewport) {
    return noOffsets;
  }
  return {
    x: win.visualViewport.offsetLeft,
    y: win.visualViewport.offsetTop
  };
}
function shouldAddVisualOffsets(element, isFixed, floatingOffsetParent) {
  if (isFixed === void 0) {
    isFixed = false;
  }
  return !!floatingOffsetParent && isFixed && floatingOffsetParent === (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getWindow)(element);
}

function getBoundingClientRect(element, includeScale, isFixedStrategy, offsetParent) {
  if (includeScale === void 0) {
    includeScale = false;
  }
  if (isFixedStrategy === void 0) {
    isFixedStrategy = false;
  }
  const clientRect = element.getBoundingClientRect();
  const domElement = unwrapElement(element);
  let scale = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.createCoords)(1);
  if (includeScale) {
    if (offsetParent) {
      if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isElement)(offsetParent)) {
        scale = getScale(offsetParent);
      }
    } else {
      scale = getScale(element);
    }
  }
  const visualOffsets = shouldAddVisualOffsets(domElement, isFixedStrategy, offsetParent) ? getVisualOffsets(domElement) : (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.createCoords)(0);
  let x = (clientRect.left + visualOffsets.x) / scale.x;
  let y = (clientRect.top + visualOffsets.y) / scale.y;
  let width = clientRect.width / scale.x;
  let height = clientRect.height / scale.y;
  if (domElement && offsetParent) {
    const win = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getWindow)(domElement);
    const offsetWin = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isElement)(offsetParent) ? (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getWindow)(offsetParent) : offsetParent;
    let currentWin = win;
    let currentIFrame = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getFrameElement)(currentWin);
    while (currentIFrame && offsetWin !== currentWin) {
      const iframeScale = getScale(currentIFrame);
      const iframeRect = currentIFrame.getBoundingClientRect();
      const css = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getComputedStyle)(currentIFrame);
      const left = iframeRect.left + (currentIFrame.clientLeft + parseFloat(css.paddingLeft)) * iframeScale.x;
      const top = iframeRect.top + (currentIFrame.clientTop + parseFloat(css.paddingTop)) * iframeScale.y;
      x *= iframeScale.x;
      y *= iframeScale.y;
      width *= iframeScale.x;
      height *= iframeScale.y;
      x += left;
      y += top;
      currentWin = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getWindow)(currentIFrame);
      currentIFrame = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getFrameElement)(currentWin);
    }
  }
  return (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.rectToClientRect)({
    width,
    height,
    x,
    y
  });
}

// If <html> has a CSS width greater than the viewport, then this will be
// incorrect for RTL.
function getWindowScrollBarX(element, rect) {
  const leftScroll = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getNodeScroll)(element).scrollLeft;
  if (!rect) {
    return getBoundingClientRect((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getDocumentElement)(element)).left + leftScroll;
  }
  return rect.left + leftScroll;
}

function getHTMLOffset(documentElement, scroll) {
  const htmlRect = documentElement.getBoundingClientRect();
  const x = htmlRect.left + scroll.scrollLeft - getWindowScrollBarX(documentElement, htmlRect);
  const y = htmlRect.top + scroll.scrollTop;
  return {
    x,
    y
  };
}

function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
  let {
    elements,
    rect,
    offsetParent,
    strategy
  } = _ref;
  const isFixed = strategy === 'fixed';
  const documentElement = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getDocumentElement)(offsetParent);
  const topLayer = elements ? (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isTopLayer)(elements.floating) : false;
  if (offsetParent === documentElement || topLayer && isFixed) {
    return rect;
  }
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  let scale = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.createCoords)(1);
  const offsets = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.createCoords)(0);
  const isOffsetParentAnElement = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isHTMLElement)(offsetParent);
  if (isOffsetParentAnElement || !isFixed) {
    if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getNodeName)(offsetParent) !== 'body' || (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isOverflowElement)(documentElement)) {
      scroll = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getNodeScroll)(offsetParent);
    }
    if (isOffsetParentAnElement) {
      const offsetRect = getBoundingClientRect(offsetParent);
      scale = getScale(offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    }
  }
  const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.createCoords)(0);
  return {
    width: rect.width * scale.x,
    height: rect.height * scale.y,
    x: rect.x * scale.x - scroll.scrollLeft * scale.x + offsets.x + htmlOffset.x,
    y: rect.y * scale.y - scroll.scrollTop * scale.y + offsets.y + htmlOffset.y
  };
}

function getClientRects(element) {
  return element.getClientRects ? Array.from(element.getClientRects()) : [];
}

// Gets the entire size of the scrollable document area, even extending outside
// of the `<html>` and `<body>` rect bounds if horizontally scrollable.
function getDocumentRect(html) {
  const scroll = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getNodeScroll)(html);
  const body = html.ownerDocument.body;
  const width = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.max)(html.scrollWidth, html.clientWidth, body.scrollWidth, body.clientWidth);
  const height = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.max)(html.scrollHeight, html.clientHeight, body.scrollHeight, body.clientHeight);
  let x = -scroll.scrollLeft + getWindowScrollBarX(html);
  const y = -scroll.scrollTop;
  if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getComputedStyle)(body).direction === 'rtl') {
    x += (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.max)(html.clientWidth, body.clientWidth) - width;
  }
  return {
    width,
    height,
    x,
    y
  };
}

// Safety check: ensure the scrollbar space is reasonable in case this
// calculation is affected by unusual styles.
// Most scrollbars leave 15-18px of space.
const SCROLLBAR_MAX = 25;
function getViewportRect(element, strategy, rootBoundary) {
  if (rootBoundary === void 0) {
    rootBoundary = 'viewport';
  }
  const isLayoutViewport = rootBoundary === 'layoutViewport';
  const win = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getWindow)(element);
  const html = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getDocumentElement)(element);
  const visualViewport = win.visualViewport;
  let width = html.clientWidth;
  let height = html.clientHeight;
  let x = 0;
  let y = 0;
  if (visualViewport) {
    // Client coordinates are relative to the layout viewport, except in
    // WebKit with an `absolute` strategy, where they are relative to the
    // visual viewport.
    const layoutRelativeClientCoords = !(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isWebKit)() || strategy === 'fixed';
    if (isLayoutViewport) {
      if (!layoutRelativeClientCoords) {
        x = -visualViewport.offsetLeft;
        y = -visualViewport.offsetTop;
      }
    } else {
      width = visualViewport.width;
      height = visualViewport.height;
      if (layoutRelativeClientCoords) {
        x = visualViewport.offsetLeft;
        y = visualViewport.offsetTop;
      }
    }
  }
  const windowScrollbarX = getWindowScrollBarX(html);
  // `scrollbar-gutter: stable` on the <html> reserves gutter space that shrinks
  // the visual width but isn't reflected in `html.clientWidth`, so subtract it.
  // Only the inline-end (right) gutter can hold the scrollbar; `both-edges` also
  // reserves an empty inline-start gutter that clips nothing, so exclude just
  // the one scrollbar-side gutter — halve the measured (two-gutter) total. A
  // left-side scrollbar (`windowScrollbarX > 0`) is already handled by
  // `getHTMLOffset`/`visualViewport.width`; skip it here.
  if (windowScrollbarX <= 0) {
    const doc = html.ownerDocument;
    const body = doc.body;
    const bodyStyles = getComputedStyle(body);
    const bodyMarginInline = doc.compatMode === 'CSS1Compat' ? parseFloat(bodyStyles.marginLeft) + parseFloat(bodyStyles.marginRight) || 0 : 0;
    const reservedWidth = Math.abs(html.clientWidth - body.clientWidth - bodyMarginInline);
    const gutter = getComputedStyle(html).scrollbarGutter === 'stable both-edges' ? reservedWidth / 2 : reservedWidth;
    if (gutter <= SCROLLBAR_MAX) {
      width -= gutter;
    }
  }
  return {
    width,
    height,
    x,
    y
  };
}

// Returns the inner client rect, subtracting scrollbars if present.
function getInnerBoundingClientRect(element, strategy) {
  const clientRect = getBoundingClientRect(element, true, strategy === 'fixed');
  const top = clientRect.top + element.clientTop;
  const left = clientRect.left + element.clientLeft;
  const scale = getScale(element);
  const width = element.clientWidth * scale.x;
  const height = element.clientHeight * scale.y;
  const x = left * scale.x;
  const y = top * scale.y;
  return {
    width,
    height,
    x,
    y
  };
}
function getClientRectFromClippingAncestor(element, clippingAncestor, strategy) {
  let rect;
  if (clippingAncestor === 'viewport' || clippingAncestor === 'layoutViewport') {
    rect = getViewportRect(element, strategy, clippingAncestor);
  } else if (clippingAncestor === 'document') {
    rect = getDocumentRect((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getDocumentElement)(element));
  } else if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isElement)(clippingAncestor)) {
    rect = getInnerBoundingClientRect(clippingAncestor, strategy);
  } else {
    const visualOffsets = getVisualOffsets(element);
    rect = {
      x: clippingAncestor.x - visualOffsets.x,
      y: clippingAncestor.y - visualOffsets.y,
      width: clippingAncestor.width,
      height: clippingAncestor.height
    };
  }
  return (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.rectToClientRect)(rect);
}

// A "clipping ancestor" is an `overflow` element with the characteristic of
// clipping (or hiding) child elements. This returns all clipping ancestors
// of the given element up the tree.
function getClippingElementAncestors(element, cache) {
  const cachedResult = cache.get(element);
  if (cachedResult) {
    return cachedResult;
  }
  let result = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getOverflowAncestors)(element, [], false).filter(el => (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isElement)(el) && (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getNodeName)(el) !== 'body');
  let lastKeptComputedStyle = null;
  const elementIsFixed = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getComputedStyle)(element).position === 'fixed';
  let currentNode = elementIsFixed ? (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getParentNode)(element) : element;

  // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block
  while ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isElement)(currentNode) && !(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isLastTraversableNode)(currentNode)) {
    const computedStyle = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getComputedStyle)(currentNode);
    const currentNodeIsContaining = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isContainingBlock)(currentNode);
    // Position of the containing block chain below the current node. A fixed
    // element whose containing block hasn't been found yet is a fixed chain.
    const lastPosition = lastKeptComputedStyle ? lastKeptComputedStyle.position : elementIsFixed ? 'fixed' : '';

    // A non-containing ancestor does not clip the element when the chain
    // below it escapes it: a fixed chain escapes all ancestors up to the
    // next containing block, an absolute chain escapes static ancestors.
    const shouldDropCurrentNode = !currentNodeIsContaining && (lastPosition === 'fixed' || lastPosition === 'absolute' && computedStyle.position === 'static');
    if (shouldDropCurrentNode) {
      // Drop non-containing blocks.
      result = result.filter(ancestor => ancestor !== currentNode);
    } else {
      // The kept node carries the chain position for the next iteration.
      lastKeptComputedStyle = computedStyle;
    }
    currentNode = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getParentNode)(currentNode);
  }
  cache.set(element, result);
  return result;
}

// Gets the maximum area that the element is visible in due to any number of
// clipping ancestors.
function getClippingRect(_ref) {
  let {
    element,
    boundary,
    rootBoundary,
    strategy
  } = _ref;
  const elementClippingAncestors = boundary === 'clippingAncestors' ? (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isTopLayer)(element) ? [] : getClippingElementAncestors(element, this._c) : [].concat(boundary);
  const clippingAncestors = [...elementClippingAncestors, rootBoundary];
  const firstRect = getClientRectFromClippingAncestor(element, clippingAncestors[0], strategy);
  let top = firstRect.top;
  let right = firstRect.right;
  let bottom = firstRect.bottom;
  let left = firstRect.left;
  for (let i = 1; i < clippingAncestors.length; i++) {
    const rect = getClientRectFromClippingAncestor(element, clippingAncestors[i], strategy);
    top = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.max)(rect.top, top);
    right = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.min)(rect.right, right);
    bottom = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.min)(rect.bottom, bottom);
    left = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.max)(rect.left, left);
  }
  return {
    width: right - left,
    height: bottom - top,
    x: left,
    y: top
  };
}

function getDimensions(element) {
  const {
    width,
    height
  } = getCssDimensions(element);
  return {
    width,
    height
  };
}

function getRectRelativeToOffsetParent(element, offsetParent, strategy) {
  const isOffsetParentAnElement = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isHTMLElement)(offsetParent);
  const documentElement = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getDocumentElement)(offsetParent);
  const isFixed = strategy === 'fixed';
  const rect = getBoundingClientRect(element, true, isFixed, offsetParent);
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const offsets = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.createCoords)(0);
  if (isOffsetParentAnElement || !isFixed) {
    if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getNodeName)(offsetParent) !== 'body' || (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isOverflowElement)(documentElement)) {
      scroll = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getNodeScroll)(offsetParent);
    }
    if (isOffsetParentAnElement) {
      const offsetRect = getBoundingClientRect(offsetParent, true, isFixed, offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    }
  }

  // If the <body> scrollbar appears on the left (e.g. RTL systems). Use
  // Firefox with layout.scrollbar.side = 3 in about:config to test this.
  if (!isOffsetParentAnElement && documentElement) {
    offsets.x = getWindowScrollBarX(documentElement);
  }
  const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.createCoords)(0);
  const x = rect.left + scroll.scrollLeft - offsets.x - htmlOffset.x;
  const y = rect.top + scroll.scrollTop - offsets.y - htmlOffset.y;
  return {
    x,
    y,
    width: rect.width,
    height: rect.height
  };
}

function isStaticPositioned(element) {
  return (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getComputedStyle)(element).position === 'static';
}

function getTrueOffsetParent(element, polyfill) {
  if (!(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isHTMLElement)(element) || (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getComputedStyle)(element).position === 'fixed') {
    return null;
  }
  if (polyfill) {
    return polyfill(element);
  }
  let rawOffsetParent = element.offsetParent;

  // Firefox returns the <html> element as the offsetParent if it's non-static,
  // while Chrome and Safari return the <body> element. The <body> element must
  // be used to perform the correct calculations even if the <html> element is
  // non-static.
  if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getDocumentElement)(element) === rawOffsetParent) {
    rawOffsetParent = rawOffsetParent.ownerDocument.body;
  }
  return rawOffsetParent;
}

// Gets the closest ancestor positioned element. Handles some edge cases,
// such as table ancestors and cross browser bugs.
function getOffsetParent(element, polyfill) {
  const win = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getWindow)(element);
  if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isTopLayer)(element)) {
    return win;
  }
  if (!(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isHTMLElement)(element)) {
    let svgOffsetParent = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getParentNode)(element);
    while (svgOffsetParent && !(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isLastTraversableNode)(svgOffsetParent)) {
      if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isElement)(svgOffsetParent) && !isStaticPositioned(svgOffsetParent)) {
        return svgOffsetParent;
      }
      svgOffsetParent = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getParentNode)(svgOffsetParent);
    }
    return win;
  }
  let offsetParent = getTrueOffsetParent(element, polyfill);
  while (offsetParent && (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isTableElement)(offsetParent) && isStaticPositioned(offsetParent)) {
    offsetParent = getTrueOffsetParent(offsetParent, polyfill);
  }
  if (offsetParent && (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isLastTraversableNode)(offsetParent) && isStaticPositioned(offsetParent) && !(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isContainingBlock)(offsetParent)) {
    return win;
  }
  return offsetParent || (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getContainingBlock)(element) || win;
}

const getElementRects = async function (data) {
  const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
  const getDimensionsFn = this.getDimensions;
  const floatingDimensions = await getDimensionsFn(data.floating);
  return {
    reference: getRectRelativeToOffsetParent(data.reference, await getOffsetParentFn(data.floating), data.strategy),
    floating: {
      x: 0,
      y: 0,
      width: floatingDimensions.width,
      height: floatingDimensions.height
    }
  };
};

function isRTL(element) {
  return (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getComputedStyle)(element).direction === 'rtl';
}

const platform = {
  convertOffsetParentRelativeRectToViewportRelativeRect,
  getDocumentElement: _floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getDocumentElement,
  getClippingRect,
  getOffsetParent,
  getElementRects,
  getClientRects,
  getDimensions,
  getScale,
  isElement: _floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isElement,
  isRTL
};

function rectsAreEqual(a, b) {
  return a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height;
}

// https://samthor.au/2021/observing-dom/
function observeMove(element, onMove, ancestorResize) {
  let io = null;
  let timeoutId;
  const root = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getDocumentElement)(element);
  function cleanup() {
    var _io;
    clearTimeout(timeoutId);
    (_io = io) == null || _io.disconnect();
    io = null;
  }
  function refresh(skip, threshold) {
    if (skip === void 0) {
      skip = false;
    }
    if (threshold === void 0) {
      threshold = 1;
    }
    cleanup();
    const elementRectForRootMargin = element.getBoundingClientRect();
    const {
      left,
      top,
      width,
      height
    } = elementRectForRootMargin;
    if (!skip) {
      onMove();
    }
    if (!width || !height) {
      return;
    }
    const insetTop = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.floor)(top);
    const insetRight = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.floor)(root.clientWidth - (left + width));
    const insetBottom = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.floor)(root.clientHeight - (top + height));
    const insetLeft = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.floor)(left);
    const rootMargin = -insetTop + "px " + -insetRight + "px " + -insetBottom + "px " + -insetLeft + "px";
    const options = {
      rootMargin,
      threshold: (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.max)(0, (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.min)(1, threshold)) || 1
    };
    let isFirstUpdate = true;
    function handleObserve(entries) {
      const ratio = entries[0].intersectionRatio;

      // The entry is a snapshot, so the reference may have moved since the
      // intersection was computed (under performance constraints, or between
      // consecutive frames of a multi-frame layout shift). The reported ratio
      // and the observed area are stale in that case and cannot be trusted to
      // detect subsequent movement, so refresh regardless of the ratio.
      if (!rectsAreEqual(elementRectForRootMargin, element.getBoundingClientRect())) {
        return refresh();
      }
      if (ratio !== threshold) {
        if (!isFirstUpdate) {
          return refresh();
        }
        if (!ratio) {
          // If the reference is clipped in place, the ratio is 0. Throttle
          // the refresh to prevent an infinite loop of updates.
          timeoutId = setTimeout(() => {
            refresh(false, 1e-7);
          }, 1000);
        } else {
          refresh(false, ratio);
        }
      }
      isFirstUpdate = false;
    }

    // Older browsers don't support a `document` as the root and will throw an
    // error.
    try {
      io = new IntersectionObserver(handleObserve, {
        ...options,
        // Handle <iframe>s
        root: root.ownerDocument
      });
    } catch (_e) {
      io = new IntersectionObserver(handleObserve, options);
    }
    io.observe(element);
  }
  const win = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getWindow)(element);
  // The window is a resize ancestor, so when `ancestorResize` is enabled its
  // listener already runs the update on resize. Here we only need to rebuild
  // the `IntersectionObserver` for the new root size, skipping a redundant
  // update. When `ancestorResize` is disabled, this becomes the sole update.
  const handleResize = () => refresh(ancestorResize);
  win.addEventListener('resize', handleResize);
  refresh(true);
  return () => {
    win.removeEventListener('resize', handleResize);
    cleanup();
  };
}

/**
 * Automatically updates the position of the floating element when necessary.
 * Should only be called when the floating element is mounted on the DOM or
 * visible on the screen.
 * @returns cleanup function that should be invoked when the floating element is
 * removed from the DOM or hidden from the screen.
 * @see https://floating-ui.com/docs/autoUpdate
 */
function autoUpdate(reference, floating, update, options) {
  if (options === void 0) {
    options = {};
  }
  const {
    ancestorScroll = true,
    ancestorResize = true,
    elementResize = typeof ResizeObserver === 'function',
    layoutShift = typeof IntersectionObserver === 'function',
    animationFrame = false
  } = options;
  const referenceEl = unwrapElement(reference);
  const ancestors = ancestorScroll || ancestorResize ? [...(referenceEl ? (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getOverflowAncestors)(referenceEl) : []), ...(floating ? (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getOverflowAncestors)(floating) : [])] : [];
  ancestors.forEach(ancestor => {
    ancestorScroll && ancestor.addEventListener('scroll', update);
    ancestorResize && ancestor.addEventListener('resize', update);
  });
  const cleanupIo = referenceEl && layoutShift ? observeMove(referenceEl, update, ancestorResize) : null;
  let reobserveFrame = -1;
  let resizeObserver = null;
  if (elementResize) {
    resizeObserver = new ResizeObserver(_ref => {
      let [firstEntry] = _ref;
      if (firstEntry && firstEntry.target === referenceEl && resizeObserver && floating) {
        // Prevent update loops when using the `size` middleware.
        // https://github.com/floating-ui/floating-ui/issues/1740
        resizeObserver.unobserve(floating);
        cancelAnimationFrame(reobserveFrame);
        reobserveFrame = requestAnimationFrame(() => {
          var _resizeObserver;
          (_resizeObserver = resizeObserver) == null || _resizeObserver.observe(floating);
        });
      }
      update();
    });
    if (referenceEl && !animationFrame) {
      resizeObserver.observe(referenceEl);
    }
    if (floating) {
      resizeObserver.observe(floating);
    }
  }
  let frameId;
  let prevRefRect = animationFrame ? getBoundingClientRect(reference) : null;
  if (animationFrame) {
    frameLoop();
  }
  function frameLoop() {
    const nextRefRect = getBoundingClientRect(reference);
    if (prevRefRect && !rectsAreEqual(prevRefRect, nextRefRect)) {
      update();
    }
    prevRefRect = nextRefRect;
    frameId = requestAnimationFrame(frameLoop);
  }
  update();
  return () => {
    var _resizeObserver2;
    ancestors.forEach(ancestor => {
      ancestorScroll && ancestor.removeEventListener('scroll', update);
      ancestorResize && ancestor.removeEventListener('resize', update);
    });
    cleanupIo == null || cleanupIo();
    (_resizeObserver2 = resizeObserver) == null || _resizeObserver2.disconnect();
    resizeObserver = null;
    if (animationFrame) {
      cancelAnimationFrame(frameId);
    }
  };
}

/**
 * Resolves with an object of overflow side offsets that determine how much the
 * element is overflowing a given clipping boundary on each side.
 * - positive = overflowing the boundary by that number of pixels
 * - negative = how many pixels left before it will overflow
 * - 0 = lies flush with the boundary
 * @see https://floating-ui.com/docs/detectOverflow
 */
const detectOverflow = _floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.detectOverflow;

/**
 * Modifies the placement by translating the floating element along the
 * specified axes.
 * A number (shorthand for `mainAxis` or distance), or an axes configuration
 * object may be passed.
 * @see https://floating-ui.com/docs/offset
 */
const offset = _floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.offset;

/**
 * Optimizes the visibility of the floating element by choosing the placement
 * that has the most space available automatically, without needing to specify a
 * preferred placement. Alternative to `flip`.
 * @see https://floating-ui.com/docs/autoPlacement
 */
const autoPlacement = _floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.autoPlacement;

/**
 * Optimizes the visibility of the floating element by shifting it in order to
 * keep it in view when it will overflow the clipping boundary.
 * @see https://floating-ui.com/docs/shift
 */
const shift = _floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.shift;

/**
 * Optimizes the visibility of the floating element by flipping the `placement`
 * in order to keep it in view when the preferred placement(s) will overflow the
 * clipping boundary. Alternative to `autoPlacement`.
 * @see https://floating-ui.com/docs/flip
 */
const flip = _floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.flip;

/**
 * Provides data that allows you to change the size of the floating element —
 * for instance, prevent it from overflowing the clipping boundary or match the
 * width of the reference element.
 * @see https://floating-ui.com/docs/size
 */
const size = _floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.size;

/**
 * Provides data to hide the floating element in applicable situations, such as
 * when it is not in the same clipping context as the reference element.
 * @see https://floating-ui.com/docs/hide
 */
const hide = _floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.hide;

/**
 * Provides data to position an inner element of the floating element so that it
 * appears centered to the reference element.
 * @see https://floating-ui.com/docs/arrow
 */
const arrow = _floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.arrow;

/**
 * Provides improved positioning for inline reference elements that can span
 * over multiple lines, such as hyperlinks or range selections.
 * @see https://floating-ui.com/docs/inline
 */
const inline = _floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.inline;

/**
 * Built-in `limiter` that will stop `shift()` at a certain point.
 */
const limitShift = _floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.limitShift;

/**
 * Computes the `x` and `y` coordinates that will place the floating element
 * next to a given reference element.
 */
const computePosition = (reference, floating, options) => {
  // This caches the expensive `getClippingElementAncestors` function so that
  // multiple lifecycle resets re-use the same result. It only lives for a
  // single call. If other functions become expensive, we can add them as well.
  const cache = new Map();
  const mergedOptions = options != null ? options : {};
  const platformWithCache = {
    ...platform,
    ...mergedOptions.platform,
    _c: cache
  };
  return (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.computePosition)(reference, floating, {
    ...mergedOptions,
    platform: platformWithCache
  });
};




/***/ },

/***/ "d7f28916ed76"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getComputedStyle: () => (/* binding */ getComputedStyle),
/* harmony export */   getContainingBlock: () => (/* binding */ getContainingBlock),
/* harmony export */   getDocumentElement: () => (/* binding */ getDocumentElement),
/* harmony export */   getFrameElement: () => (/* binding */ getFrameElement),
/* harmony export */   getNearestOverflowAncestor: () => (/* binding */ getNearestOverflowAncestor),
/* harmony export */   getNodeName: () => (/* binding */ getNodeName),
/* harmony export */   getNodeScroll: () => (/* binding */ getNodeScroll),
/* harmony export */   getOverflowAncestors: () => (/* binding */ getOverflowAncestors),
/* harmony export */   getParentNode: () => (/* binding */ getParentNode),
/* harmony export */   getWindow: () => (/* binding */ getWindow),
/* harmony export */   isContainingBlock: () => (/* binding */ isContainingBlock),
/* harmony export */   isElement: () => (/* binding */ isElement),
/* harmony export */   isHTMLElement: () => (/* binding */ isHTMLElement),
/* harmony export */   isLastTraversableNode: () => (/* binding */ isLastTraversableNode),
/* harmony export */   isNode: () => (/* binding */ isNode),
/* harmony export */   isOverflowElement: () => (/* binding */ isOverflowElement),
/* harmony export */   isShadowRoot: () => (/* binding */ isShadowRoot),
/* harmony export */   isTableElement: () => (/* binding */ isTableElement),
/* harmony export */   isTopLayer: () => (/* binding */ isTopLayer),
/* harmony export */   isWebKit: () => (/* binding */ isWebKit)
/* harmony export */ });
function hasWindow() {
  return typeof window !== 'undefined';
}
function getNodeName(node) {
  if (isNode(node)) {
    return (node.nodeName || '').toLowerCase();
  }
  // Mocked nodes in testing environments may not be instances of Node. By
  // returning `#document` an infinite loop won't occur.
  // https://github.com/floating-ui/floating-ui/issues/2317
  return '#document';
}
function getWindow(node) {
  var _node$ownerDocument;
  return (node == null || (_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.defaultView) || window;
}
function getDocumentElement(node) {
  var _ref;
  return (_ref = (isNode(node) ? node.ownerDocument : node.document) || window.document) == null ? void 0 : _ref.documentElement;
}
function isNode(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof Node || value instanceof getWindow(value).Node;
}
function isElement(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof Element || value instanceof getWindow(value).Element;
}
function isHTMLElement(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof HTMLElement || value instanceof getWindow(value).HTMLElement;
}
function isShadowRoot(value) {
  if (!hasWindow() || typeof ShadowRoot === 'undefined') {
    return false;
  }
  return value instanceof ShadowRoot || value instanceof getWindow(value).ShadowRoot;
}
function isOverflowElement(element) {
  const {
    overflow,
    overflowX,
    overflowY,
    display
  } = getComputedStyle(element);
  return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && display !== 'inline' && display !== 'contents';
}
function isTableElement(element) {
  return /^(table|td|th)$/.test(getNodeName(element));
}
function isTopLayer(element) {
  try {
    if (element.matches(':popover-open')) {
      return true;
    }
  } catch (_e) {
    // no-op
  }
  try {
    return element.matches(':modal');
  } catch (_e) {
    return false;
  }
}
const willChangeRe = /transform|translate|scale|rotate|perspective|filter/;
const containRe = /paint|layout|strict|content/;
const isNotNone = value => !!value && value !== 'none';
let isWebKitValue;
function isContainingBlock(elementOrCss) {
  const css = isElement(elementOrCss) ? getComputedStyle(elementOrCss) : elementOrCss;

  // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block
  // https://drafts.csswg.org/css-transforms-2/#individual-transforms
  return isNotNone(css.transform) || isNotNone(css.translate) || isNotNone(css.scale) || isNotNone(css.rotate) || isNotNone(css.perspective) || !isWebKit() && (isNotNone(css.backdropFilter) || isNotNone(css.filter)) || willChangeRe.test(css.willChange || '') || containRe.test(css.contain || '');
}
function getContainingBlock(element) {
  let currentNode = getParentNode(element);
  while (isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)) {
    if (isContainingBlock(currentNode)) {
      return currentNode;
    } else if (isTopLayer(currentNode)) {
      return null;
    }
    currentNode = getParentNode(currentNode);
  }
  return null;
}
function isWebKit() {
  if (isWebKitValue == null) {
    isWebKitValue = typeof CSS !== 'undefined' && CSS.supports && CSS.supports('-webkit-backdrop-filter', 'none');
  }
  return isWebKitValue;
}
function isLastTraversableNode(node) {
  return /^(html|body|#document)$/.test(getNodeName(node));
}
function getComputedStyle(element) {
  return getWindow(element).getComputedStyle(element);
}
function getNodeScroll(element) {
  if (isElement(element)) {
    return {
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop
    };
  }
  return {
    scrollLeft: element.scrollX,
    scrollTop: element.scrollY
  };
}
function getParentNode(node) {
  if (getNodeName(node) === 'html') {
    return node;
  }
  const result =
  // Step into the shadow DOM of the parent of a slotted node.
  node.assignedSlot ||
  // DOM Element detected.
  node.parentNode ||
  // ShadowRoot detected.
  isShadowRoot(node) && node.host ||
  // Fallback.
  getDocumentElement(node);
  return isShadowRoot(result) ? result.host : result;
}
function getNearestOverflowAncestor(node) {
  const parentNode = getParentNode(node);
  if (isLastTraversableNode(parentNode)) {
    return (node.ownerDocument || node).body;
  }
  if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) {
    return parentNode;
  }
  return getNearestOverflowAncestor(parentNode);
}
function getOverflowAncestors(node, list, traverseIframes) {
  var _node$ownerDocument2;
  if (list === void 0) {
    list = [];
  }
  if (traverseIframes === void 0) {
    traverseIframes = true;
  }
  const scrollableAncestor = getNearestOverflowAncestor(node);
  const isBody = scrollableAncestor === ((_node$ownerDocument2 = node.ownerDocument) == null ? void 0 : _node$ownerDocument2.body);
  const win = getWindow(scrollableAncestor);
  if (isBody) {
    const frameElement = getFrameElement(win);
    return list.concat(win, win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : [], frameElement && traverseIframes ? getOverflowAncestors(frameElement) : []);
  } else {
    return list.concat(scrollableAncestor, getOverflowAncestors(scrollableAncestor, [], traverseIframes));
  }
}
function getFrameElement(win) {
  return win.parent && Object.getPrototypeOf(win.parent) ? win.frameElement : null;
}




/***/ },

/***/ "56345afd9e11"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   alignments: () => (/* binding */ alignments),
/* harmony export */   clamp: () => (/* binding */ clamp),
/* harmony export */   createCoords: () => (/* binding */ createCoords),
/* harmony export */   evaluate: () => (/* binding */ evaluate),
/* harmony export */   expandPaddingObject: () => (/* binding */ expandPaddingObject),
/* harmony export */   floor: () => (/* binding */ floor),
/* harmony export */   getAlignment: () => (/* binding */ getAlignment),
/* harmony export */   getAlignmentAxis: () => (/* binding */ getAlignmentAxis),
/* harmony export */   getAlignmentSides: () => (/* binding */ getAlignmentSides),
/* harmony export */   getAxisLength: () => (/* binding */ getAxisLength),
/* harmony export */   getExpandedPlacements: () => (/* binding */ getExpandedPlacements),
/* harmony export */   getOppositeAlignmentPlacement: () => (/* binding */ getOppositeAlignmentPlacement),
/* harmony export */   getOppositeAxis: () => (/* binding */ getOppositeAxis),
/* harmony export */   getOppositeAxisPlacements: () => (/* binding */ getOppositeAxisPlacements),
/* harmony export */   getOppositePlacement: () => (/* binding */ getOppositePlacement),
/* harmony export */   getPaddingObject: () => (/* binding */ getPaddingObject),
/* harmony export */   getSide: () => (/* binding */ getSide),
/* harmony export */   getSideAxis: () => (/* binding */ getSideAxis),
/* harmony export */   max: () => (/* binding */ max),
/* harmony export */   min: () => (/* binding */ min),
/* harmony export */   placements: () => (/* binding */ placements),
/* harmony export */   rectToClientRect: () => (/* binding */ rectToClientRect),
/* harmony export */   round: () => (/* binding */ round),
/* harmony export */   sides: () => (/* binding */ sides)
/* harmony export */ });
/**
 * Custom positioning reference element.
 * @see https://floating-ui.com/docs/virtual-elements
 */

const sides = ['top', 'right', 'bottom', 'left'];
const alignments = ['start', 'end'];
const placements = /*#__PURE__*/sides.reduce((acc, side) => acc.concat(side, side + "-" + alignments[0], side + "-" + alignments[1]), []);
const min = Math.min;
const max = Math.max;
const round = Math.round;
const floor = Math.floor;
const createCoords = v => ({
  x: v,
  y: v
});
const oppositeSideMap = {
  left: 'right',
  right: 'left',
  bottom: 'top',
  top: 'bottom'
};
function clamp(start, value, end) {
  return max(start, min(value, end));
}
function evaluate(value, param) {
  return typeof value === 'function' ? value(param) : value;
}
function getSide(placement) {
  return placement.split('-')[0];
}
function getAlignment(placement) {
  return placement.split('-')[1];
}
function getOppositeAxis(axis) {
  return axis === 'x' ? 'y' : 'x';
}
function getAxisLength(axis) {
  return axis === 'y' ? 'height' : 'width';
}
function getSideAxis(placement) {
  const firstChar = placement[0];
  return firstChar === 't' || firstChar === 'b' ? 'y' : 'x';
}
function getAlignmentAxis(placement) {
  return getOppositeAxis(getSideAxis(placement));
}
function getAlignmentSides(placement, rects, rtl) {
  if (rtl === void 0) {
    rtl = false;
  }
  const alignment = getAlignment(placement);
  const alignmentAxis = getAlignmentAxis(placement);
  const length = getAxisLength(alignmentAxis);
  let mainAlignmentSide = alignmentAxis === 'x' ? alignment === (rtl ? 'end' : 'start') ? 'right' : 'left' : alignment === 'start' ? 'bottom' : 'top';
  if (rects.reference[length] > rects.floating[length]) {
    mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
  }
  return [mainAlignmentSide, getOppositePlacement(mainAlignmentSide)];
}
function getExpandedPlacements(placement) {
  const oppositePlacement = getOppositePlacement(placement);
  return [getOppositeAlignmentPlacement(placement), oppositePlacement, getOppositeAlignmentPlacement(oppositePlacement)];
}
function getOppositeAlignmentPlacement(placement) {
  return placement.includes('start') ? placement.replace('start', 'end') : placement.replace('end', 'start');
}
const lrPlacement = ['left', 'right'];
const rlPlacement = ['right', 'left'];
const tbPlacement = ['top', 'bottom'];
const btPlacement = ['bottom', 'top'];
function getSideList(side, isStart, rtl) {
  switch (side) {
    case 'top':
    case 'bottom':
      if (rtl) return isStart ? rlPlacement : lrPlacement;
      return isStart ? lrPlacement : rlPlacement;
    case 'left':
    case 'right':
      return isStart ? tbPlacement : btPlacement;
    default:
      return [];
  }
}
function getOppositeAxisPlacements(placement, flipAlignment, direction, rtl) {
  const alignment = getAlignment(placement);
  let list = getSideList(getSide(placement), direction === 'start', rtl);
  if (alignment) {
    list = list.map(side => side + "-" + alignment);
    if (flipAlignment) {
      list = list.concat(list.map(getOppositeAlignmentPlacement));
    }
  }
  return list;
}
function getOppositePlacement(placement) {
  const side = getSide(placement);
  return oppositeSideMap[side] + placement.slice(side.length);
}
function expandPaddingObject(padding) {
  var _padding$top, _padding$right, _padding$bottom, _padding$left;
  return {
    top: (_padding$top = padding.top) != null ? _padding$top : 0,
    right: (_padding$right = padding.right) != null ? _padding$right : 0,
    bottom: (_padding$bottom = padding.bottom) != null ? _padding$bottom : 0,
    left: (_padding$left = padding.left) != null ? _padding$left : 0
  };
}
function getPaddingObject(padding) {
  return typeof padding !== 'number' ? expandPaddingObject(padding) : {
    top: padding,
    right: padding,
    bottom: padding,
    left: padding
  };
}
function rectToClientRect(rect) {
  const {
    x,
    y,
    width,
    height
  } = rect;
  return {
    width,
    height,
    top: y,
    left: x,
    right: x + width,
    bottom: y + height,
    x,
    y
  };
}




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

/***/ "feccc97e5d7d"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _built_in_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("6a56aa4367e4");
// The languages built into the component bundles (owner decision C282),
// for page-language.js: built-in.json, the build switch
// scripts/build-language-packs.mjs reads too. A module, as lang/index.mjs, so
// the bundle and Node read the JSON alike.


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_built_in_json__WEBPACK_IMPORTED_MODULE_0__);


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

/***/ "6a56aa4367e4"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"schema":"simai.language-built-in","schema_version":1,"$comment":"The languages built into the component bundles (owner decision C282, 2026-11-17): English only. Russian and every other language ship as language files (core/lang/<code>.js before core.js, or the parts core/lang/<code>/<family>.json core fetches). complete: the languages that must say every word (scripts/language-coverage.mjs exits 1 on a gap). Rollback: built_in [\\"en\\", \\"ru\\"], then node scripts/build-language-packs.mjs and a rebuild put Russian back into the bundles (the language files still ship, so a page that includes ru.js stays right).","built_in":["en"],"complete":["en","ru"]}');

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
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("57cf5fca5804");
/* harmony import */ var _js_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("4157111e8609");
/**
 * SIMAI Framework
 * Copyright 2008-2026 SIMAI Ltd
 * http://simai.studio
 * Read the license: http://framework.simai.studio/license/
 * Documentation: http://framework.simai.studio/
 * Support: http://simai.studio/support/
 *
 * INPUTS
 *
 * Entry point for importing components from this directory.
 * Simplifies the import process in other parts of the project.
 * Instead of importing individual files, all component can be imported through this file.
 */


})();

/******/ })()
;