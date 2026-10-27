/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "c0450586011d"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bindCountryCode: () => (/* binding */ bindCountryCode),
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
/* harmony import */ var _core_js_position_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("5c1dc214bb5e");
/* harmony import */ var _field_size__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("e6d86f2cd058");
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("0d662e4d7d63");
/* harmony import */ var _core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("421676f72963");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_position_js__WEBPACK_IMPORTED_MODULE_6__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_8__]);
([_core_js_position_js__WEBPACK_IMPORTED_MODULE_6__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_8__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_position_js__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_core_js_position_js__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__);









 // Every word this part says. A product adds a language with
// SF.language.register('sf-country-code', code, words); the locale here is
// also what the number itself is formatted by, which is why it stays.

const COUNTRY_CODE_TEXT = {
  en: {
    phoneLabel: 'Phone number',
    phoneRequired: 'Enter a phone number.',
    countryLabel: 'Country code'
  },
  ru: {
    phoneLabel: 'Телефон',
    phoneRequired: 'Введите номер телефона.',
    countryLabel: 'Код страны'
  }
}; // Prefer the helper Core published; an isolated bundle uses its own copy.

const positioning = () => globalThis.SF?.Position || (_core_js_position_js__WEBPACK_IMPORTED_MODULE_6___default());

const COUNTRY_CODE_SELECTOR = '.sf-country-code';
const COUNTRY_CODE_BOUND_FLAG = 'sfCountryCodeBound';
const COUNTRY_ITEMS = Array.isArray(_data_countries_json__WEBPACK_IMPORTED_MODULE_3__?.items) ? _data_countries_json__WEBPACK_IMPORTED_MODULE_3__.items : [];
let flagObserver = null;
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
    const name = (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(COUNTRY_CODE_TEXT, 'phoneLabel', root, 'sf-country-code');
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
  const message = missing ? (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(COUNTRY_CODE_TEXT, 'phoneRequired', root, 'sf-country-code') : '';
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
    items
  } = getNodes(root);
  const config = root.__sfCountryConfig || {};
  const open = root.classList.contains('open');
  const selected = root.__sfCountrySelected;
  const countryName = (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(COUNTRY_CODE_TEXT, 'countryLabel', root, 'sf-country-code');
  syncCountryFieldReferences(root, input);
  root.querySelectorAll('.sf-country-code-required, .sf-country-code-left .sf-icon').forEach(node => node.setAttribute('aria-hidden', 'true'));

  if (toggle) {
    if (config.multiCountry && config.showCode && list) {
      setCountryName(toggle, `${countryName}${selected ? `: ${getCountryLabel(selected, config.locale)}` : ''}`);
      toggle.setAttribute('role', 'button');
      toggle.setAttribute('aria-haspopup', 'listbox');
      toggle.setAttribute('aria-controls', ensureCountryId(list));
      toggle.setAttribute('aria-expanded', String(open));
    } else {
      // With one fixed country the flag and code are a picture, not a control.
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
  }

  if (list) {
    list.setAttribute('role', 'listbox');
    setCountryName(list, countryName);
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
    return new URL('component/flag/flags/rect', root).href.replace(/\/$/, '');
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
}

function getFlagObserver() {
  if (flagObserver || !('IntersectionObserver' in window)) return flagObserver;
  flagObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const img = entry.target;
      loadFlagImage(img);
      flagObserver?.unobserve?.(img);
    });
  }, {
    rootMargin: '120px'
  });
  return flagObserver;
}

function observeFlagImage(img, lazy = true) {
  if (!img) return;

  if (!lazy) {
    loadFlagImage(img);
    return;
  }

  const observer = getFlagObserver();

  if (!observer) {
    loadFlagImage(img);
    return;
  }

  observer.observe(img);
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


  return value.replace(/^\+\d+[\s\-()]*/, '').trim();
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
  syncCountryAccessibility(root);
  root.__sfCountryViewport?.(open);
}

function resolveConfig(root, input) {
  const locale = String(root.dataset.locale || input?.dataset.locale || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageLanguage)(root)).toLowerCase();
  const rawMaskStyle = String(root.dataset.maskStyle ?? input?.dataset.maskStyle ?? 'native').toLowerCase();
  const maskStyle = rawMaskStyle === 'brackets' ? 'brackets' : 'native';
  return {
    locale: locale === 'ru' ? 'ru' : 'en',
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
    maxItems: Number.parseInt(root.dataset.maxItems || input?.dataset.maxItems || '0', 10) || 0
  };
}

function getCountryLabel(country, locale) {
  if (!country) return '';
  if (country.label) return String(country.label);
  const name = (locale === 'en' ? country.nameEn || country.nameRu : country.nameRu || country.nameEn) || country.iso2;
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
  list.querySelectorAll('img[data-flag-src]').forEach(img => observeFlagImage(img, true));
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

  root.__sfCountryViewport = open => {
    if (open && !anchor && root.isConnected) {
      saved = ['display', 'flex-direction', 'overflow'].map(name => [name, list.style.getPropertyValue(name), list.style.getPropertyPriority(name)]);
      Object.assign(list.style, {
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      });
      applyDropdownViewport(root); // Shared Framework geometry: below the field, flipped above when the
      // rows do not fit and there is more room, shifted inside the viewport.

      anchor = positioning().anchor(root, list, {
        side: 'block-end',
        align: 'start',
        matchWidth: true,
        fitHeight: true,
        onPosition: () => {
          const box = root.getBoundingClientRect();
          if (box.bottom <= 0 || box.top >= window.innerHeight) setOpenState(root, false);
        }
      });
    } else if (!open && anchor) {
      anchor.stop();
      anchor = null;

      for (const [name, value, priority] of saved) {
        if (value) list.style.setProperty(name, value, priority);else list.style.removeProperty(name);
      }
    } else if (open && anchor) {
      applyDropdownViewport(root);
      anchor.update();
    }
  };
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
      input.placeholder = buildPlaceholderFromMask(maskPattern, resolvedConfig.maskPlaceholderChar || '_', dialCode);
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

    syncCountryRequired(root, input);
  } catch (error) {
    console.warn('SF.CountryCode mask init failed', error);
  }
}

function resolveInitialCountry(config, root) {
  return resolveCountry(root, config.defaultIso2) || resolveCountry(root, '', config.fixedDialCode) || root.__sfCountryOptions?.[0] || COUNTRY_ITEMS[0] || null;
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
}

function getLockedPrefix(root, config) {
  if (!config?.showCode) return '';
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
  const maskConfiguration = countryMaskConfiguration.get(root);
  if (maskConfiguration) maskConfiguration.selected = root.dataset.maskPattern;
  root.__sfCountrySelected = country;

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

  if (config.useMask) {
    const basePattern = config.useCountryMasks ? country.maskPattern : config.fixedMaskPattern || country.maskPattern;
    const pattern = normalizeMaskPatternByStyle(basePattern, config.maskStyle);
    applyMaskForRoot(root, input, pattern, config);
  } else {
    applyMaskForRoot(root, input, '', config);
  }

  syncCountryAccessibility(root);
  syncCountryRequired(root, input);
}

function bindCountryCode(root, {
  resetCountry = false,
  countries,
  maskPattern
} = {}) {
  (0,_field_size__WEBPACK_IMPORTED_MODULE_7__.retireFieldSizeClass)(root, 'sf-country-code'); // Both ordinary and Smart bundles may contain this module. Keep reattachment
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
  renderDatasetItems(root, config);
  applyDropdownViewport(root, 8);
  const nodes = getNodes(root);
  const items = nodes.items;
  bindCountryViewport(root);
  root.__sfCountryOptions = countries === undefined ? items.map(item => readCountryItem(item, config.locale)) : normalizeCountriesList(countries, config.locale, config.maxItems);

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

  const initialCountry = resolveInitialCountry(config, root);
  if (resetCountry || !countryResetDefaults.has(input)) countryResetDefaults.set(input, initialCountry);

  if (initialCountry) {
    applyCountrySelection(root, initialCountry, 'init');
  } else if (leftFlag) {
    leftFlag.textContent = '';
  }

  const onToggleClick = event => {
    event.preventDefault();
    if (!config.multiCountry || input.disabled || root.classList.contains('disabled')) return;
    const willOpen = !root.classList.contains('open');
    closeAllCountryCodes(root);
    setOpenState(root, willOpen);

    if (willOpen) {
      prefetchVisibleFlags(root);
    }
  };

  const onToggleKeydown = event => {
    if (event.altKey || event.ctrlKey || event.metaKey || input.disabled || root.classList.contains('disabled') || !config.multiCountry) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onToggleClick(event);
      if (root.classList.contains('open')) focusItem();
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!root.classList.contains('open')) onToggleClick(event);
      focusItem(event.key === 'ArrowUp' ? -1 : undefined);
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
    setOpenState(root, false); // Preserve pointer workflow: after choosing a code, continue typing the phone.
    // Keyboard confirmation returns to the selector instead.

    (event.type === 'keydown' ? toggle : input)?.focus({
      preventScroll: true
    });
  };

  const enabledItems = () => items.filter(item => item.getAttribute('aria-disabled') !== 'true' && !item.classList.contains('disabled') && !item.hidden);

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

  let search = '',
      searchTime = 0;

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

    if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      const index = event.key === 'Home' ? 0 : event.key === 'End' ? choices.length - 1 : Math.max(0, current + (event.key === 'ArrowDown' ? 1 : -1));
      focusItem(index);
      return;
    }

    if (event.key.length === 1) {
      const now = performance.now();
      search = now - searchTime > 700 ? event.key : search + event.key;
      searchTime = now;
      const query = [...search].every(char => char === search[0]) ? search[0] : search;
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

  const onInput = () => {
    enforceDialCodePrefix(root, input, config);
    keepCaretAfterPrefix(input, getLockedPrefix(root, config));
    syncCountryRequired(root, input);
  };

  const onPaste = () => {
    requestAnimationFrame(() => {
      enforceDialCodePrefix(root, input, config);
      keepCaretAfterPrefix(input, getLockedPrefix(root, config));
    });
  };

  const onKeydownInput = event => {
    const prefix = getLockedPrefix(root, config);
    if (!prefix) return;
    if (!['Backspace', 'Delete'].includes(event.key)) return;
    const start = input.selectionStart ?? 0;
    const end = input.selectionEnd ?? start;

    if (event.key === 'Backspace' && start <= prefix.length) {
      event.preventDefault();
      keepCaretAfterPrefix(input, prefix);
      return;
    }

    if (event.key === 'Delete' && start < prefix.length) {
      event.preventDefault();
      keepCaretAfterPrefix(input, prefix);
      return;
    }

    if (start < prefix.length || end < prefix.length) {
      event.preventDefault();
      keepCaretAfterPrefix(input, prefix);
    }
  };

  if (toggle) {
    toggle.addEventListener('click', onToggleClick);
    toggle.addEventListener('keydown', onToggleKeydown);
    toggle.setAttribute('role', 'button');
  }

  input.addEventListener('input', onInput);
  input.addEventListener('paste', onPaste);
  input.addEventListener('keydown', onKeydownInput);
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
  syncDisabledState(root);
  root.__sfCountryViewport?.(root.classList.contains('open'));
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
  root.querySelectorAll('img[data-flag-src]').forEach(img => flagObserver?.unobserve(img));

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

  if (root.__sfCountryMask) {
    window.SF?.Mask?.destroy?.(root.__sfCountryMask);
  }

  delete root.__sfCountryCodeToggleClick;
  delete root.__sfCountryCodeToggleKeydown;
  delete root.__sfCountryCodeDocClick;
  delete root.__sfCountryCodeItemClick;
  delete root.__sfCountryCodeItemKeydown;
  delete root.__sfCountryCodeFocusOut;
  delete root.__sfCountryCodeInput;
  delete root.__sfCountryCodePaste;
  delete root.__sfCountryCodeInputKeydown;
  delete root.__sfCountryMask;
  delete root.__sfCountryMaskToken;
  delete root.__sfCountrySelected;
  delete root.__sfCountryConfig;
  delete root.__sfCountryOptions;
  delete root.dataset[COUNTRY_CODE_BOUND_FLAG];
}

function initExistingCountryCodes(target = document) {
  target.querySelectorAll(COUNTRY_CODE_SELECTOR).forEach(root => {
    // The Smart owner binds its own root after render. Ordinary auto-init must
    // not claim it first with a different bundled module's reset state.
    if (!root.closest('sf-country-code')) bindCountryCode(root);
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
      placeholder = '+7(___)___-__-__',
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
      maxItems = 0
    } = this.params || {};
    const className = this.attrs.class || this.attrs.className;
    this.template = document.createElement('label');
    if (this.id) this.template.id = this.id;
    this.template.classList.add('sf-country-code', `sf-country-code--size-${(0,_field_size__WEBPACK_IMPORTED_MODULE_7__.fieldSize)(size, 'sf-country-code')}`);
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
    icon.classList.add('sf-icon');
    icon.textContent = toBoolean(open) ? 'expand_less' : 'expand_more';
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
          const fallbackLabel = country?.nameRu || country?.nameEn || country?.dialCode || '';
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

      for (const root of roots) if (!root.isConnected && !root.closest('sf-country-code')) unbindCountryCode(root);
    });
    mutation.addedNodes.forEach(node => {
      if (!(node instanceof Element)) return;

      if (node.matches?.(COUNTRY_CODE_SELECTOR) && !node.closest('sf-country-code')) {
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

/***/ "e6d86f2cd058"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FIELD_SIZES: () => (/* binding */ FIELD_SIZES),
/* harmony export */   RETIRED_FIELD_SIZES: () => (/* binding */ RETIRED_FIELD_SIZES),
/* harmony export */   fieldSize: () => (/* binding */ fieldSize),
/* harmony export */   nearestFieldSize: () => (/* binding */ nearestFieldSize),
/* harmony export */   retireFieldSizeClass: () => (/* binding */ retireFieldSizeClass)
/* harmony export */ });
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("06e8cd089f28");
// Form fields come in three sizes. 1/3 and 3 were retired: no consumer used
// them, and they could not hold a field's own pictures, tags and targets. A
// page written for a retired size keeps rendering at the nearest kept size, and
// says so once in the console so the markup can be updated.

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
} // Markup written by hand carries its size as a class, so the binder moves a
// retired size class to the kept one before anything measures the field.

function retireFieldSizeClass(root, block) {
  if (!root?.classList) return;

  for (const [retired, kept] of Object.entries(RETIRED_FIELD_SIZES)) {
    const name = `${block}--size-${retired}`;
    if (!root.classList.contains(name)) continue;
    root.classList.replace(name, `${block}--size-${fieldSize(retired, block)}`);
  }
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
const subscriptions = new WeakMap();
const listeningDocuments = new WeakSet();
function bindFormReset(input, synchronize) {
  const doc = input.ownerDocument;

  if (!listeningDocuments.has(doc)) {
    doc.addEventListener('reset', event => {
      const form = event.target;
      if (form?.tagName !== 'FORM') return;
      const controls = Array.from(form.elements);
      setTimeout(() => {
        if (event.defaultPrevented) return;

        for (const control of controls) {
          if (!control.isConnected || control.form !== form) continue;

          for (const callback of subscriptions.get(control) || []) callback();
        }
      }, 0);
    }, true);
    listeningDocuments.add(doc);
  }

  let callbacks = subscriptions.get(input);
  if (!callbacks) subscriptions.set(input, callbacks = new Set());
  callbacks.add(synchronize);
  return () => callbacks.delete(synchronize);
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
/* harmony export */   aliasExpired: () => (/* binding */ aliasExpired),
/* harmony export */   propertyOf: () => (/* binding */ propertyOf),
/* harmony export */   readAliasTable: () => (/* binding */ readAliasTable)
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
}

/***/ },

/***/ "28b603686dcc"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   aliasExpired: () => (/* reexport safe */ _alias_table_js__WEBPACK_IMPORTED_MODULE_1__.aliasExpired),
/* harmony export */   aliasesOf: () => (/* binding */ aliasesOf),
/* harmony export */   aliasesStrict: () => (/* binding */ aliasesStrict),
/* harmony export */   dispatchAliased: () => (/* binding */ dispatchAliased),
/* harmony export */   installAliases: () => (/* binding */ installAliases),
/* harmony export */   readAliasTable: () => (/* reexport safe */ _alias_table_js__WEBPACK_IMPORTED_MODULE_1__.readAliasTable),
/* harmony export */   setAliasClock: () => (/* binding */ setAliasClock),
/* harmony export */   uninstallAliases: () => (/* binding */ uninstallAliases)
/* harmony export */ });
/* harmony import */ var _deprecations_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("06e8cd089f28");
/* harmony import */ var _alias_table_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("f49a716b86bd");
// Dated aliases on an element (standard simai.smart-component 1.3.8 §16.20,
// §8, §16 items 6, 7, 13, 26, 32, 41; vocabulary 1.1.5 §9). When a component
// renames an event, a setting, an attribute, an action or a value, the old
// name keeps working until its `remove_after` day, and each use of it is
// noted in SF.deprecations with its dates, so a person, a probe or an AI can
// read off a running page which old names it still leans on.
//
//   const handle = SF.aliases.install(element, table, {signal});
//   SF.aliases.dispatch(element, 'sf-menu-navigate', {detail, cancelable: true});
//   handle.uninstall();   // or abort `signal`
//
// The table is a component's aliases.json (core/js/alias-table.js reads it).
// What an installed element does:
//
// Events.
//   - One dispatch sends the new name first, then each open old name, with
//     the same `detail` object and the same bubbles / composed / cancelable.
//   - Cancel is shared: preventDefault() on any of them cancels all at once,
//     so a listener that runs later on the other name already sees
//     defaultPrevented, and the dispatch answers false.
//   - stopPropagation() is not shared: the names have different listeners.
//   - It works for today's components without a change in them: the element's
//     own dispatchEvent is wrapped, so a component that still sends the old
//     name (sf-accordion:toggle) sends the new one first through the shim, and
//     a component that sends the new name has the old ones follow. The event
//     object the component made is the one dispatched under its name, so a
//     component that reads its own event's defaultPrevented sees the shared
//     cancel.
//   - A use is a listener that touches the old event (its detail, target,
//     currentTarget, composedPath, preventDefault or the stop methods). It is
//     noted once per dispatch, into one record per name. An old event that
//     nobody listens to is not a use, so a page that moved is not reported.
//     No global prototype is patched to learn this.
//   - `detail-adds` sends the new, larger detail to the old name too: the old
//     fields are all there. `when` sends an old name only for a matching
//     detail (two old names folded into one new name). `split` needs an
//     adapter that makes the old detail from the new one; without it the row
//     is refused. A component that sends the old name of a `detail-adds` or
//     `split` row is not promoted: its old detail cannot make the new one.
//
// Settings and attributes. Writing the old attribute writes the new one (the
// component hears the new one); writing the new one updates the old one when
// the page still has it, so getAttribute(old) stays true. Equal values are
// never written again, which is what ends a round. A setting also gets its
// property: the old property reads and writes the new one.
//
// Actions. The old method calls the new one with the same arguments.
//
// Values. An attribute set to an old value is written with the new one.
//
// A name that the browser's own element owns (title, blur, spellcheck,
// remove, …) is not shadowed as a property or a method unless the component
// already overrides it: the attribute alias still works.
//
// Expiry (decision, §16.20 "after that date the old name is expired"). After
// `remove_after` an old name is `expired`: it is still delivered in 1.x, its
// record carries `expired: true` and a console warning is printed once
// whatever the page opted into. A date passing in a running page must not
// break it between two deploys, and dropping a name inside a major is the
// sweep's job: the release that deletes the row is the removal, under the
// change journal. A page or a host that wants to rehearse the sweep sets
// strict mode, <html data-sf-aliases="strict"> or SF.aliases.strict = true:
// an expired old name is then not delivered — its events are not sent, its
// attribute is not mapped, its property reads undefined, its method throws.
//
// Every bundle carries its own copy of this module, so all state lives on the
// shared global (SF.__aliases, not enumerable) and the first copy's API stays
// on SF.aliases; nothing else is added to the page. Per element state is in a
// WeakMap, the wrappers are own properties of the element and leave with
// uninstall(), and the only listener is on the caller's AbortSignal, itself
// removed by an AbortController of the install.



const VERSION = 1;
const WRAPPED = ['dispatchEvent', 'setAttribute', 'removeAttribute', 'toggleAttribute'];
const TOUCH_GETTERS = ['detail', 'target', 'currentTarget', 'srcElement'];
const TOUCH_METHODS = ['composedPath', 'preventDefault', 'stopPropagation', 'stopImmediatePropagation'];

function shared() {
  const SF = globalThis.SF = globalThis.SF || {};

  if (!SF.__aliases || typeof SF.__aliases !== 'object') {
    Object.defineProperty(SF, '__aliases', {
      configurable: true,
      enumerable: false,
      writable: false,
      value: {
        elements: new WeakMap(),
        ours: new WeakSet(),
        now: () => Date.now()
      }
    });
  }

  return SF.__aliases;
} // A test or a sweep rehearsal sets the clock; null puts the real one back.


function setAliasClock(clock) {
  shared().now = typeof clock === 'function' ? clock : () => Date.now();
}
function aliasesStrict() {
  return globalThis.document?.documentElement?.dataset?.sfAliases === 'strict' || globalThis.SF?.aliases?.strict === true;
}

function life(row) {
  const expired = (0,_alias_table_js__WEBPACK_IMPORTED_MODULE_1__.aliasExpired)(row, shared().now());
  return {
    expired,
    usable: !expired || !aliasesStrict()
  };
}

function note(row, expired) {
  const attribute = row.kind === 'value' ? row.setting : row.kind === 'setting' || row.kind === 'attribute' ? row.from : '';
  (0,_deprecations_js__WEBPACK_IMPORTED_MODULE_0__.noteDeprecated)({
    component: row.tag,
    tag: row.tag,
    kind: row.kind,
    attribute,
    from: row.from,
    to: row.to,
    since: row.since,
    remove_after: row.remove_after,
    ...(expired ? {
      expired: true
    } : {})
  });
} // --- events ---------------------------------------------------------------


const eventGet = name => Object.getOwnPropertyDescriptor(globalThis.Event.prototype, name)?.get;

const nativePrevent = () => globalThis.Event.prototype.preventDefault;

function flagsOf(event) {
  return {
    bubbles: eventGet('bubbles').call(event),
    cancelable: eventGet('cancelable').call(event),
    composed: eventGet('composed').call(event)
  };
}

function detailOf(event) {
  const get = globalThis.CustomEvent && Object.getOwnPropertyDescriptor(globalThis.CustomEvent.prototype, 'detail')?.get;
  return get && event instanceof globalThis.CustomEvent ? get.call(event) : null;
}

function matches(detail, when) {
  if (!when) return true;
  if (!detail || typeof detail !== 'object') return false;
  return Object.entries(when).every(([field, value]) => detail[field] === value);
}

function makeEvent(element, type, detail, flags) {
  const Custom = element.ownerDocument?.defaultView?.CustomEvent ?? globalThis.CustomEvent;
  return new Custom(type, { ...flags,
    detail
  });
} // The first touch of an old event by a listener is a use of the old name.


function instrument(event, row, expired, detail) {
  let used = false;

  const use = () => {
    if (used) return;
    used = true;
    note(row, expired);
  };

  for (const name of TOUCH_GETTERS) {
    const get = name === 'detail' ? () => detail : eventGet(name);
    if (!get) continue;
    Object.defineProperty(event, name, {
      configurable: true,

      get() {
        use();
        return get.call(this);
      }

    });
  }

  for (const name of TOUCH_METHODS) {
    const method = event[name];
    if (typeof method !== 'function') continue;
    Object.defineProperty(event, name, {
      configurable: true,
      writable: true,

      value(...args) {
        use();
        return method.apply(this, args);
      }

    });
  }
}

function shareCancel(events) {
  const cancel = nativePrevent();

  for (const event of events) {
    Object.defineProperty(event, 'preventDefault', {
      configurable: true,
      writable: true,

      value() {
        for (const one of events) cancel.call(one);
      }

    });
  }
} // The old events that go with one new event: open (or expired outside strict)
// rows whose `when` matches, made from the same detail, or from the adapter's
// detail for a split row. `own` is the component's own event when it sent an
// old name: it is reused under that name.


function oldEventsFor(state, element, newType, detail, flags, own) {
  const out = [];
  const names = new Set();

  for (const row of state.byNew.get(newType) ?? []) {
    if (names.has(row.from) || !matches(detail, row.when)) continue;
    const {
      expired,
      usable
    } = life(row);
    if (!usable) continue;
    let oldDetail = detail;

    if (row.mode === 'split') {
      oldDetail = state.adapters[row.from]?.(detail, newType);
      if (oldDetail === undefined) continue;
    }

    names.add(row.from);
    const event = own && own.type === row.from && oldDetail === detail ? own : makeEvent(element, row.from, oldDetail, flags);
    out.push({
      event,
      row,
      expired,
      detail: oldDetail
    });
  }

  return out;
} // Sends the new event, then the old ones, with one cancel. The cancel is
// shared first and the old events instrumented after, so a listener's
// preventDefault() on an old name both cancels all and counts as a use.


function deliver(state, element, first, olds, alsoCancel = []) {
  const ours = shared().ours;
  const events = [first, ...olds.map(one => one.event)];
  const all = [...events, ...alsoCancel.filter(event => !events.includes(event))];
  if (all.some(event => eventGet('cancelable').call(event))) shareCancel(all);

  for (const one of olds) instrument(one.event, one.row, one.expired, one.detail);

  for (const event of events) {
    ours.add(event);
    state.native.dispatchEvent.call(element, event);
  }

  const prevented = eventGet('defaultPrevented');
  return !all.some(event => prevented.call(event));
}

function wrappedDispatch(state, element, event) {
  const native = state.native.dispatchEvent;
  if (!event || shared().ours.has(event)) return native.call(element, event);
  const type = event.type;

  if (state.byNew.has(type)) {
    const detail = detailOf(event);
    return deliver(state, element, event, oldEventsFor(state, element, type, detail, flagsOf(event), null));
  }

  const rows = state.byOld.get(type);
  if (!rows) return native.call(element, event);
  const detail = detailOf(event);
  const flags = flagsOf(event); // An old name with one plain new name is promoted: the new name first.

  const targets = new Set(rows.filter(row => row.mode === 'same-detail' && !row.when).map(row => row.to));

  if (targets.size === 1 && rows.every(row => row.mode === 'same-detail' && !row.when)) {
    const [to] = targets;
    const fresh = makeEvent(element, to, detail, flags);
    const olds = oldEventsFor(state, element, to, detail, flags, event); // A strict page whose old name expired still has the component's own
    // event in the cancel group, though it is not sent.

    return deliver(state, element, fresh, olds, [event]);
  } // Not promotable (detail-adds, split, folded): delivered as it is, a use
  // noted when touched.


  const {
    expired,
    usable
  } = life(rows[0]);
  if (!usable) return true;
  instrument(event, rows[0], expired, detail);
  shared().ours.add(event);
  return native.call(element, event);
} // --- attributes, values -----------------------------------------------------


function mapValue(state, attribute, value, {
  quiet = false
} = {}) {
  const row = state.values.get(attribute)?.get(String(value));
  if (!row) return value;
  const {
    expired,
    usable
  } = life(row);
  if (!quiet) note(row, expired);
  return usable ? row.to : value;
}

function writeIfDifferent(state, element, name, value) {
  const text = String(value);
  if (state.native.getAttribute.call(element, name) !== text) state.native.setAttribute.call(element, name, text);
}

function removeIfPresent(state, element, name) {
  if (state.native.hasAttribute.call(element, name)) state.native.removeAttribute.call(element, name);
}

function wrappedSet(state, element, name, value) {
  const attribute = String(name).toLowerCase();
  const row = state.attrByOld.get(attribute);

  if (row) {
    const {
      expired,
      usable
    } = life(row);
    note(row, expired);
    state.native.setAttribute.call(element, attribute, value);
    if (usable) writeIfDifferent(state, element, row.to, mapValue(state, row.to, value));
    return;
  }

  const mapped = mapValue(state, attribute, value);
  state.native.setAttribute.call(element, attribute, mapped);

  for (const old of state.attrByNew.get(attribute) ?? []) {
    if (state.native.hasAttribute.call(element, old.from)) writeIfDifferent(state, element, old.from, mapped);
  }
}

function wrappedRemove(state, element, name) {
  const attribute = String(name).toLowerCase();
  const row = state.attrByOld.get(attribute);
  state.native.removeAttribute.call(element, attribute);

  if (row) {
    const {
      expired,
      usable
    } = life(row);
    note(row, expired);
    if (usable) removeIfPresent(state, element, row.to);
    return;
  }

  for (const old of state.attrByNew.get(attribute) ?? []) removeIfPresent(state, element, old.from);
}

function wrappedToggle(state, element, name, force) {
  const attribute = String(name).toLowerCase();
  const has = state.native.hasAttribute.call(element, attribute);
  const want = force === undefined ? !has : Boolean(force);
  if (want && !has) wrappedSet(state, element, attribute, '');
  if (!want && has) wrappedRemove(state, element, attribute);
  return want;
} // Changes that did not come through the element's own methods (the parser,
// an Attr node, a framework that calls the prototype): the later change of
// each name wins, and only differing values are written.


function reconcile(state, element, records) {
  const last = new Map();
  records.forEach((record, order) => last.set(record.attributeName, order));
  const names = [...last.keys()].sort((a, b) => last.get(a) - last.get(b));

  const has = name => state.native.hasAttribute.call(element, name);

  const get = name => state.native.getAttribute.call(element, name);

  for (const name of names) {
    const row = state.attrByOld.get(name);

    if (row) {
      const {
        expired,
        usable
      } = life(row);
      if (!usable) continue;

      if (has(name)) {
        if (get(row.to) !== mapValue(state, row.to, get(name), {
          quiet: true
        })) {
          note(row, expired);
          writeIfDifferent(state, element, row.to, mapValue(state, row.to, get(name)));
        }
      } else {
        removeIfPresent(state, element, row.to);
      }

      continue;
    }

    if (state.values.has(name) && has(name)) {
      const mapped = mapValue(state, name, get(name));
      if (mapped !== get(name)) writeIfDifferent(state, element, name, mapped);
    }

    for (const old of state.attrByNew.get(name) ?? []) {
      // The old name changed after this one: its own turn decides.
      if (!has(old.from) || (last.get(old.from) ?? -1) > last.get(name)) continue;
      if (has(name)) writeIfDifferent(state, element, old.from, get(name));else state.native.removeAttribute.call(element, old.from);
    }
  }
} // What the markup already holds: an old attribute is a use and fills the new
// one when that is absent (a new one the page also wrote wins); an old value
// is rewritten.


function adopt(state, element) {
  const has = name => state.native.hasAttribute.call(element, name);

  const get = name => state.native.getAttribute.call(element, name);

  for (const [name, row] of state.attrByOld) {
    if (!has(name)) continue;
    const {
      expired,
      usable
    } = life(row);
    note(row, expired);
    if (usable && !has(row.to)) writeIfDifferent(state, element, row.to, mapValue(state, row.to, get(name)));
  }

  for (const name of state.values.keys()) {
    if (has(name)) writeIfDifferent(state, element, name, mapValue(state, name, get(name)));
  }
} // --- members -----------------------------------------------------------------


function nativePrototypes() {
  const protos = new Set([Object.prototype]);

  for (let proto = globalThis.HTMLElement?.prototype; proto; proto = Object.getPrototypeOf(proto)) protos.add(proto);

  if (globalThis.EventTarget) protos.add(globalThis.EventTarget.prototype);
  return protos;
} // May `name` be defined on the element? Not when the browser's element owns
// it and the component does not override it.


function ownableMember(element, name) {
  const natives = nativePrototypes();

  for (let proto = Object.getPrototypeOf(element); proto; proto = Object.getPrototypeOf(proto)) {
    if (Object.prototype.hasOwnProperty.call(proto, name)) return !natives.has(proto);
  }

  return true;
}

function defineOwn(state, element, name, descriptor) {
  const before = Object.getOwnPropertyDescriptor(element, name);
  state.restore.push(() => {
    delete element[name];
    if (before) Object.defineProperty(element, name, before);
  });
  Object.defineProperty(element, name, {
    configurable: true,
    enumerable: false,
    ...descriptor
  });
  return before;
}

function writable(element, name) {
  for (let object = element; object; object = Object.getPrototypeOf(object)) {
    const own = Object.getOwnPropertyDescriptor(object, name);
    if (own) return Boolean(own.set) || own.writable === true;
  }

  return true;
} // Today's Smart base exposes a setting as a read-only property over its
// attribute; such a setting is written through the attribute.


function writeSetting(state, element, row, property, value) {
  if (writable(element, property)) {
    element[property] = value;
  } else if (value === null || value === undefined || value === false) {
    removeIfPresent(state, element, row.to);
  } else {
    writeIfDifferent(state, element, row.to, value === true ? '' : typeof value === 'object' ? JSON.stringify(value) : value);
  }
}

function installProperty(state, element, row, refuse) {
  const from = (0,_alias_table_js__WEBPACK_IMPORTED_MODULE_1__.propertyOf)(row.from);
  const to = (0,_alias_table_js__WEBPACK_IMPORTED_MODULE_1__.propertyOf)(row.to);
  if (!ownableMember(element, from)) return refuse(row, 'native-member');
  if (!(to in element)) return refuse(row, 'no-new-property');
  const before = defineOwn(state, element, from, {
    get() {
      const {
        expired,
        usable
      } = life(row);
      note(row, expired);
      return usable ? element[to] : undefined;
    },

    set(value) {
      const {
        expired,
        usable
      } = life(row);
      note(row, expired);
      if (usable) writeSetting(state, element, row, to, value);
    }

  }); // A value the page set before the element was installed moves to the new name.

  if (before && 'value' in before && before.value !== undefined) element[from] = before.value;
  return true;
}

function installAction(state, element, row, refuse) {
  if (!ownableMember(element, row.from)) return refuse(row, 'native-member');
  if (typeof element[row.to] !== 'function') return refuse(row, 'no-new-action');
  defineOwn(state, element, row.from, {
    writable: true,

    value(...args) {
      const {
        expired,
        usable
      } = life(row);
      note(row, expired);
      if (!usable) throw new TypeError(`[SIMAI Framework] ${row.tag || element.localName}: ${row.from}() was removed after ${row.remove_after}; call ${row.to}().`);
      return element[row.to](...args);
    }

  });
  return true;
} // --- install ----------------------------------------------------------------


function uninstallAliases(element) {
  const store = shared();
  const state = element && store.elements.get(element);
  if (!state) return false;
  store.elements.delete(element);
  state.observer?.disconnect();
  state.controller.abort();

  for (const restore of state.restore.reverse()) restore();

  return true;
}
function installAliases(element, table, {
  signal,
  adapters = {},
  tag
} = {}) {
  if (!element || typeof element.dispatchEvent !== 'function') throw new TypeError('[SIMAI Framework] SF.aliases.install needs an element');
  uninstallAliases(element);
  const read = (0,_alias_table_js__WEBPACK_IMPORTED_MODULE_1__.readAliasTable)(table, {
    tag: tag || element.localName || ''
  });
  const refused = [...read.refused];
  const handle = {
    installed: 0,
    refused,
    uninstall: () => uninstallAliases(element)
  };
  if (signal?.aborted) return handle;
  const state = {
    rows: read.rows,
    adapters,
    byNew: new Map(),
    byOld: new Map(),
    attrByOld: new Map(),
    attrByNew: new Map(),
    values: new Map(),
    restore: [],
    controller: new AbortController(),
    observer: null,
    native: {}
  };

  for (const name of [...WRAPPED, 'getAttribute', 'hasAttribute']) state.native[name] = element[name];

  const refuse = (row, reason) => {
    refused.push({
      index: -1,
      from: row.from,
      to: row.to,
      kind: row.kind,
      reason
    });
    return false;
  };

  const push = (map, key, row) => map.set(key, [...(map.get(key) ?? []), row]);

  for (const row of read.rows) {
    if (row.kind === 'event') {
      if (row.mode === 'split' && typeof adapters[row.from] !== 'function') {
        refuse(row, 'needs-adapter');
        continue;
      }

      push(state.byNew, row.to, row);
      push(state.byOld, row.from, row);
      handle.installed += 1;
    } else if (row.kind === 'setting' || row.kind === 'attribute') {
      if (typeof state.native.setAttribute !== 'function') {
        refuse(row, 'no-attributes');
        continue;
      }

      state.attrByOld.set(row.from, row);
      push(state.attrByNew, row.to, row);
      handle.installed += 1;
      if (row.kind === 'setting') installProperty(state, element, row, refuse);
    } else if (row.kind === 'value') {
      if (!state.values.has(row.setting)) state.values.set(row.setting, new Map());
      state.values.get(row.setting).set(row.from, row);
      handle.installed += 1;
    } else if (row.kind === 'action' && installAction(state, element, row, refuse)) {
      handle.installed += 1;
    }
  }

  if (state.byNew.size) {
    defineOwn(state, element, 'dispatchEvent', {
      writable: true,
      value: event => wrappedDispatch(state, element, event)
    });
  }

  const attributes = state.attrByOld.size || state.values.size;

  if (attributes) {
    defineOwn(state, element, 'setAttribute', {
      writable: true,
      value: (name, value) => wrappedSet(state, element, name, value)
    });
    defineOwn(state, element, 'removeAttribute', {
      writable: true,
      value: name => wrappedRemove(state, element, name)
    });

    if (typeof state.native.toggleAttribute === 'function') {
      defineOwn(state, element, 'toggleAttribute', {
        writable: true,
        value: (name, force) => wrappedToggle(state, element, name, force)
      });
    }

    adopt(state, element);
    const Observer = element.ownerDocument?.defaultView?.MutationObserver ?? globalThis.MutationObserver;

    if (typeof Observer === 'function') {
      const filter = [...new Set([...state.attrByOld.keys(), ...state.attrByNew.keys(), ...state.values.keys()])];
      state.observer = new Observer(records => reconcile(state, element, records));
      state.observer.observe(element, {
        attributes: true,
        attributeFilter: filter
      });
    }
  }

  shared().elements.set(element, state);
  signal?.addEventListener?.('abort', () => uninstallAliases(element), {
    once: true,
    signal: state.controller.signal
  });
  return handle;
} // For code that sends an event by name: through the element's aliases when
// it has them, a plain dispatch when it has none. Answers false when cancelled.

function dispatchAliased(element, name, {
  detail = null,
  bubbles = true,
  composed = true,
  cancelable = false
} = {}) {
  return element.dispatchEvent(makeEvent(element, name, detail, {
    bubbles,
    composed,
    cancelable
  }));
}
function aliasesOf(element) {
  return [...(shared().elements.get(element)?.rows ?? [])];
} // The first copy's API stays; every copy shares the state.

if (typeof globalThis !== 'undefined') {
  globalThis.SF = globalThis.SF || {};
  const current = globalThis.SF.aliases;

  if (!current || typeof current.install !== 'function') {
    globalThis.SF.aliases = {
      version: VERSION,
      strict: current?.strict === true,
      install: installAliases,
      uninstall: uninstallAliases,
      dispatch: dispatchAliased,
      of: aliasesOf,
      read: _alias_table_js__WEBPACK_IMPORTED_MODULE_1__.readAliasTable,
      expired: (row, now) => (0,_alias_table_js__WEBPACK_IMPORTED_MODULE_1__.aliasExpired)(row, now ?? shared().now())
    };
  }
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
  expired
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
  if (removeAfter !== undefined) note.remove_after = removeAfter;
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

/***/ "59da34819c8b"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   camelName: () => (/* binding */ camelName),
/* harmony export */   elementFromManifest: () => (/* binding */ elementFromManifest),
/* harmony export */   eventName: () => (/* binding */ eventName),
/* harmony export */   propsFromManifest: () => (/* binding */ propsFromManifest),
/* harmony export */   readManifest: () => (/* binding */ readManifest),
/* harmony export */   toOutcome: () => (/* binding */ toOutcome)
/* harmony export */ });
/* harmony import */ var _aliases_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("28b603686dcc");
/* harmony import */ var _page_language_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("0d662e4d7d63");
/* harmony import */ var _page_actions_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("51e3a200cf5f");
/* harmony import */ var _host_port_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("f171c5ece4b4");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_page_language_js__WEBPACK_IMPORTED_MODULE_1__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
_page_language_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var _page_language_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_page_language_js__WEBPACK_IMPORTED_MODULE_1__);
// An element from its manifest (standard simai.smart-component 1.3.8 §3, §4,
// §4.1, §4.4, §7.7, §8, §11, §17.1).
//
// A component folder holds component.json, its language files and its
// aliases.json; the element's attribute and property code, the methods of its
// actions and the names of its events are not written by hand but made from
// them here:
//
//   import manifest from './component.json';
//   import en from './lang/en.json';
//   import ru from './lang/ru.json';
//   import aliases from './aliases.json';
//   const Base = elementFromManifest(manifest, {base: SfBaseElement, lang: {en, ru}, aliases, actions: {...}});
//   class SfThing extends Base { ...behaviour only... }
//
// Why at load and not in the build: ui-builder compiles a Smart component's
// index.js with webpack and babel and transforms nothing of its own, so the
// JSON files are bundled as they are (webpack reads JSON imports) and the
// plumbing is made once per class when the bundle runs. A build step can take
// this over later without a change in the components: the input is the same
// manifest.
//
// What the class gets:
//
// - settings (§4): an attribute and a property per setting, typed (`string`,
//   `enum`, `boolean`, `number`, `icon`, `date`, `id`; `list`, `object` and
//   `state` are properties only); a setting with `"default-from":
//   "runtime.<word>"` defaults to that word in the element's language;
// - values (§4, §4.3): a value with a default is also a setting of the same
//   name; the others are read-only properties that a component overrides with
//   its own getter;
// - events (§8): `sfEmit(verb, detail)` sends `<tag>-<verb>`, or the native
//   name for `change`, `input` and `"carries": "native"` (with the detail
//   when one is given), through the dated aliases, so the old names follow;
// - actions (§4.4): one method per action that takes its `with` parameters as
//   one object or in declared order and answers an outcome, `{outcome:
//   'applied'}` or `{outcome: 'refused', reason}`; `"emits"` sends its event
//   once first, and a page that cancels it makes the action refused; a
//   waiting action whose instance is removed answers `cancelled`;
// - the base action `connect-port {port}` (§4.1, §4.9): `connectPort(port)`,
//   `setHostPort` its alias, the port kept on the instance's scope and read
//   as `sfPort`, the component's `onPortConnected(port, {signal})` its hook
//   (core/js/host-port.js; the Smart base has it, another base gets it here);
// - the base values `shown` and `started` (§4.1) and the host state
//   `data-sf-started`; `sfHostState(name, on)` writes the declared
//   `host-states` (§5.3);
// - static `aliases` from aliases.json (§16.20), installed by the base;
// - words (§11, §11.1): `sfWord(key, {count, vars})`, with the element's own
//   word first, then the nearest [lang], the page's choice, <html lang>,
//   English, the source language and the key;
// - a form control (§17.1): `formAssociated` and ElementInternals where the
//   browser has them; `sfFormValue()` is what the form gets.
//
// Members the runtime adds start with `sf`, which no manifest name may
// (§3.1), so a generated setting or action never collides with them.




const RESERVED = new Set(['props', 'api', 'view', 'scope', 'parts', 'receive', 'render', 'connected', 'disconnected', 'updated', 'outside', 'data', 'template', 'root-class', 'root-style', 'focus', 'blur', 'connect-port', 'shown', 'started']);
const PROPERTY_ONLY = new Set(['list', 'object', 'state']); // core/js/smart-base.js toBoolean: what an attribute value means as true.

const TRUE_WORDS = new Set(['1', 'true', 'yes', 'on', 'checked', 'disabled', 'download', 'indeterminate', 'multiple']);
const camelName = name => String(name).replace(/-([a-z0-9])/gu, (_, letter) => letter.toUpperCase());

const isPlainObject = value => value !== null && typeof value === 'object' && !Array.isArray(value) && Object.getPrototypeOf(value) === Object.prototype; // The browser's own members (§3.1): read from the prototype, never from a copy.


function isNativeMember(property) {
  let proto = globalThis.HTMLElement?.prototype;

  while (proto) {
    if (Object.prototype.hasOwnProperty.call(proto, property)) return true;
    proto = Object.getPrototypeOf(proto);
  }

  return false;
} // The browser's own names a field reports under (§8, §17.3): a page listens
// for `change` and `input` on any form control, ours included, so they keep
// those names whatever they carry -- a detail when the component gives one,
// never `<tag>-change`. A component that holds other content and is no value
// control (sf-tabs, sf-steps, sf-pagination) declares `"x-native": false` on
// the event: it sends `<tag>-change`, so a field's change bubbling out of a
// panel is never taken for its own.


const NATIVE_EVENTS = new Set(['change', 'input']);
/** The DOM name of an event the manifest declares by its verb (§8). */

function eventName(manifest, verb) {
  const declared = manifest?.events?.[verb];
  if (declared?.carries === 'native') return verb;
  if (NATIVE_EVENTS.has(verb) && declared?.['x-native'] !== false) return verb;
  return `${manifest.tag}-${verb}`;
}
/** An action's answer as an outcome (§4.4, vocabulary §3.1). */

function toOutcome(result) {
  if (result === undefined || result === null || result === true) return {
    outcome: 'applied'
  };
  if (result === false) return {
    outcome: 'refused',
    reason: 'refused'
  };

  if (typeof result === 'string') {
    return ['applied', 'cancelled', 'conflict', 'unavailable'].includes(result) ? {
      outcome: result
    } : {
      outcome: 'refused',
      reason: result
    };
  }

  if (typeof result === 'object' && typeof result.outcome === 'string') return result;
  return {
    outcome: 'applied',
    value: result
  };
}

function typedDefault(spec) {
  if (Object.prototype.hasOwnProperty.call(spec, 'default')) return spec.default;

  switch (spec.type) {
    case 'boolean':
      return false;

    case 'number':
      return 0;

    case 'list':
      return [];

    case 'object':
    case 'state':
      return {};

    case 'enum':
      return spec.values?.[0] ?? '';

    default:
      return '';
  }
}

function runtimeWordOf(spec) {
  const from = spec?.['default-from'];
  return typeof from === 'string' && from.startsWith('runtime.') ? from.slice('runtime.'.length) : '';
}
/**
 * The members a manifest declares, read once: what the element exposes and
 * how each name is spelled on it.
 */


function readManifest(manifest) {
  if (!manifest || typeof manifest !== 'object' || !manifest.tag) {
    throw new TypeError('elementFromManifest: a manifest with a tag is required');
  }

  const members = [];
  const refused = [];

  const take = (part, name, spec, writable) => {
    const property = camelName(name);

    if (RESERVED.has(name) || name.startsWith('_') || name.startsWith('sf')) {
      refused.push({
        part,
        name,
        reason: 'reserved'
      });
      return;
    }

    members.push({
      part,
      name,
      property,
      type: spec.type || 'string',
      values: Array.isArray(spec.values) ? spec.values : null,
      default: typedDefault(spec),
      optional: spec.optional === true,
      attribute: PROPERTY_ONLY.has(spec.type) ? '' : name,
      writable,
      word: runtimeWordOf(spec),
      native: isNativeMember(property)
    });
  };

  for (const [name, spec] of Object.entries(manifest.settings || {})) take('settings', name, spec || {}, true);

  for (const [name, spec] of Object.entries(manifest.values || {})) {
    // A value a person changes is also writable as a setting (§4); one that
    // only shows (effective-*) is read.
    const writable = Object.prototype.hasOwnProperty.call(spec || {}, 'default') || Boolean(spec?.['default-from']);
    take('values', name, spec || {}, writable && !name.startsWith('effective-'));
  }

  const events = Object.fromEntries(Object.entries(manifest.events || {}).map(([verb, spec]) => [verb, {
    verb,
    name: eventName(manifest, verb),
    cancelable: spec?.cancelable === true,
    native: NATIVE_EVENTS.has(verb) || spec?.carries === 'native'
  }]));
  const actions = Object.entries(manifest.actions || {}).map(([name, spec]) => ({
    name,
    method: camelName(name),
    with: Object.keys(spec?.with || {}),
    emits: spec?.emits || ''
  }));
  return {
    tag: manifest.tag,
    members,
    events,
    actions,
    refused,
    hostStates: { ...(manifest['host-states'] || {})
    },
    form: manifest.form || null
  };
}
/** The base's `props` for the members that live in attributes or properties. */

function propsFromManifest(manifest) {
  const {
    members
  } = readManifest(manifest);
  const props = {};

  for (const member of members) {
    if (!member.writable) continue;
    const config = {
      default: member.default,
      attribute: member.attribute || false
    };
    if (member.type === 'boolean') config.type = Boolean;else if (member.type === 'number') config.type = Number;else if (member.type === 'list') config.type = Array;else if (PROPERTY_ONLY.has(member.type)) config.type = Object;
    if (member.values) config.values = member.values;

    if (PROPERTY_ONLY.has(member.type)) {
      config.parser = function readProperty(raw, fallback, element) {
        const store = element?.__sfManifestData;
        return store && Object.prototype.hasOwnProperty.call(store, member.name) ? store[member.name] : fallback;
      };
    } else if (member.word) {
      config.parser = function readWord(raw, fallback, element) {
        return raw !== undefined && raw !== null ? raw : element.sfWord(member.word);
      };
    }

    props[member.property] = config;
  }

  return props;
}

function readAttribute(element, member) {
  const raw = element.getAttribute(member.attribute);

  if (member.type === 'boolean') {
    if (raw === null) return member.optional && member.default === undefined ? undefined : Boolean(member.default); // The base's reading, so the template and the property agree: present
    // and empty is true, then the words the base takes for true.

    return raw === '' || TRUE_WORDS.has(raw.toLowerCase());
  }

  if (raw === null) return member.word ? element.sfWord(member.word) : member.default;

  if (member.type === 'number') {
    const number = Number(raw);
    return raw.trim() !== '' && Number.isFinite(number) ? number : member.default;
  }

  if (member.values && !member.values.includes(raw)) return member.default;
  return raw;
}

function writeAttribute(element, member, value) {
  if (value === null || value === undefined) {
    element.removeAttribute(member.attribute);
    return;
  }

  if (member.type === 'boolean') {
    // An optional boolean keeps «off» as a value of its own (§4.2), and so
    // does one that is on by default: taking the attribute away would read
    // as the default, on (sf-pagination's count-known, total-exact).
    if (value) element.setAttribute(member.attribute, '');else if (member.optional || member.default === true) element.setAttribute(member.attribute, 'false');else element.removeAttribute(member.attribute);
    return;
  }

  element.setAttribute(member.attribute, String(value));
}

function defineMembers(target, members) {
  for (const member of members) {
    // The browser's own members stay the browser's (§3.1); a component that
    // must answer one writes its own accessor.
    if (member.native) continue;

    if (!member.writable) {
      Object.defineProperty(target, member.property, {
        configurable: true,

        get() {
          return member.default;
        }

      });
      continue;
    }

    if (!member.attribute) {
      Object.defineProperty(target, member.property, {
        configurable: true,

        get() {
          const store = this.__sfManifestData;
          return store && Object.prototype.hasOwnProperty.call(store, member.name) ? store[member.name] : member.default;
        },

        set(value) {
          if (!this.__sfManifestData) this.__sfManifestData = {};
          this.__sfManifestData[member.name] = value;
          this.requestComponentUpdate?.(member.name);
        }

      });
      continue;
    }

    Object.defineProperty(target, member.property, {
      configurable: true,

      get() {
        return readAttribute(this, member);
      },

      set(value) {
        writeAttribute(this, member, value);
      }

    });
  }
}

function parameters(action, args) {
  if (args.length === 1 && isPlainObject(args[0]) && (action.with.length !== 1 || Object.keys(args[0]).every(key => action.with.includes(key)))) {
    return { ...args[0]
    };
  }

  return Object.fromEntries(action.with.map((name, index) => [name, args[index]]));
}

function defineActions(target, actions, implementations, events) {
  for (const action of actions) {
    if (isNativeMember(action.method)) continue;
    const run = implementations?.[action.name];
    Object.defineProperty(target, action.method, {
      configurable: true,
      writable: true,
      value: function generatedAction(...args) {
        const params = parameters(action, args);

        if (action.emits) {
          const event = events[action.emits];
          const allowed = this.sfEmit(action.emits, params, {
            cancelable: event?.cancelable ?? true
          });
          if (!allowed) return {
            outcome: 'refused',
            reason: 'prevented'
          };
        }

        if (typeof run !== 'function') {
          globalThis.console?.warn?.(`[SIMAI Framework] ${this.localName}: action ${action.name} has no code`);
          return {
            outcome: 'refused',
            reason: 'not-implemented'
          };
        }

        let result;

        try {
          result = run.call(this, params, {
            signal: this.sfScope
          });
        } catch (error) {
          this.reportComponentError?.(error, `action ${action.name}`);
          return {
            outcome: 'refused',
            reason: 'error'
          };
        }

        if (result && typeof result.then === 'function') {
          const signal = this.sfScope;
          return Promise.resolve(result).then(value => signal?.aborted ? {
            outcome: 'cancelled'
          } : toOutcome(value), error => {
            if (signal?.aborted || error?.name === 'AbortError') return {
              outcome: 'cancelled'
            };
            this.reportComponentError?.(error, `action ${action.name}`);
            return {
              outcome: 'refused',
              reason: 'error'
            };
          });
        }

        return toOutcome(result);
      }
    });
  }
} // The nearest closed container (§7.2.1): `hidden`, a closed <details> or
// <dialog>. What has no box in an opened container is not shown.


function isShown(element) {
  if (!element.isConnected) return false;

  for (let node = element; node && node.nodeType === 1; node = node.parentElement || node.getRootNode?.()?.host) {
    if (node.hidden) return false;
    const tag = node.localName;
    if (node !== element && (tag === 'details' || tag === 'dialog') && !node.open) return false;
  }

  return true;
}
/**
 * The class a component extends: its manifest's plumbing over `base`.
 *
 * options:
 *   base      the class to extend (the Smart base, or a trait over it);
 *   lang      `{<locale>: <lang file>}`; the `runtime` words are the element's;
 *   source    the language the component was written in (the fallback before
 *             the key; default the first file that `lang` names);
 *   aliases   the component's aliases.json;
 *   actions   `{<action>(params, {signal}) => outcome}`, the actions' code.
 */


function elementFromManifest(manifest, {
  base,
  lang = {},
  source,
  aliases,
  actions = {}
} = {}) {
  const Base = base || globalThis.SF?.smart?.SfBaseElement;
  if (typeof Base !== 'function') throw new TypeError('elementFromManifest: a base class is required');
  const read = readManifest(manifest);
  const generatedProps = propsFromManifest(manifest);
  const words = Object.fromEntries(Object.entries(lang).map(([locale, file]) => [locale.toLowerCase(), { ...(file?.runtime || {})
  }]));
  const sourceLanguage = source || Object.keys(words)[0] || '';
  const formAssociated = Boolean(read.form) && typeof globalThis.ElementInternals === 'function' && typeof globalThis.ElementInternals.prototype?.setFormValue === 'function';

  class ManifestElement extends Base {
    static get manifest() {
      return manifest;
    } // What SF.Assembly reads of a part it places (assembly/definition.mjs
    // interfaces.of): the same manifest, so a rule can ask its actions.


    static get sfInterface() {
      return manifest;
    }

    static get sfManifest() {
      return read;
    }

    static get sfWords() {
      return words;
    }

    static get formAssociated() {
      return formAssociated;
    }

    static get props() {
      return { ...super.props,
        ...generatedProps
      };
    }

    constructor() {
      super();
      this.sfInternals = formAssociated && typeof this.attachInternals === 'function' ? this.attachInternals() : null;
    }

    connectedCallback() {
      super.connectedCallback(); // A leaf outside an assembly starts with the page (§7.2.1 `now`).

      this.toggleAttribute('data-sf-started', true);
    }
    /** §4.1: the element has a box in an opened container. */


    get shown() {
      return isShown(this);
    }
    /** §4.1: its assembly has started it (a leaf on a page, once connected). */


    get started() {
      return this.hasAttribute('data-sf-started');
    }
    /** The DOM name of a declared event (§8). */


    sfEventName(verb) {
      return read.events[verb]?.name ?? eventName(manifest, verb);
    }
    /**
     * Sends a declared event by its verb. Answers false when a listener
     * refused a cancelable one.
     */


    sfEmit(verb, detail = {}, {
      cancelable
    } = {}) {
      const event = read.events[verb];
      if (!event) globalThis.console?.warn?.(`[SIMAI Framework] ${this.localName}: event ${verb} is not declared`);
      return (0,_aliases_js__WEBPACK_IMPORTED_MODULE_0__.dispatchAliased)(this, this.sfEventName(verb), {
        detail,
        bubbles: true,
        composed: true,
        cancelable: cancelable ?? event?.cancelable ?? false
      });
    }
    /** A word of the element's own, in its language (§11, §11.1). */


    sfWord(key, {
      count,
      vars
    } = {}) {
      return (0,_page_language_js__WEBPACK_IMPORTED_MODULE_1__.pageWord)(words, key, this, {
        component: this.localName,
        source: sourceLanguage,
        count,
        vars
      });
    }
    /** Writes a declared host state (§5.3). */


    sfHostState(name, value) {
      const type = read.hostStates[name];

      if (!type) {
        globalThis.console?.warn?.(`[SIMAI Framework] ${this.localName}: host state ${name} is not declared`);
        return;
      }

      if (type === 'boolean') {
        if (value) this.setAttribute(name, 'true');else this.removeAttribute(name);
      } else if (value === null || value === undefined || value === '') {
        this.removeAttribute(name);
      } else {
        this.setAttribute(name, String(value));
      }
    }
    /**
     * What a form gets (§17.1): the value named by `form.submits` while the
     * value named by `form.value` holds, nothing while disabled. A boolean
     * value submits only when true. A component overrides it for a value of
     * its own shape.
     */


    sfFormValue() {
      const form = read.form;
      if (!form) return null;
      if (form.disabled && this[camelName(form.disabled)]) return null;
      const value = this[camelName(form.value)];

      if (form.submits && form.submits !== form.value) {
        if (!value) return null;
        const submitted = this[camelName(form.submits)];
        return submitted === undefined || submitted === null ? null : String(submitted);
      }

      if (value === undefined || value === null || value === false) return null;
      return typeof value === 'object' ? JSON.stringify(value) : String(value);
    }
    /** Tells the form what the element holds now. */


    sfSyncForm() {
      if (!this.sfInternals) return;

      try {
        this.sfInternals.setFormValue(this.sfFormValue());
      } catch (error) {
        this.reportComponentError?.(error, 'form');
      }
    }

    get form() {
      return this.sfInternals?.form ?? null;
    }

    get labels() {
      return this.sfInternals?.labels ?? null;
    }

    get validity() {
      return this.sfInternals?.validity;
    }

    get validationMessage() {
      return this.sfInternals?.validationMessage ?? '';
    }

    get willValidate() {
      return this.sfInternals?.willValidate ?? false;
    }

    checkValidity() {
      return this.sfInternals ? this.sfInternals.checkValidity() : true;
    }

    reportValidity() {
      return this.sfInternals ? this.sfInternals.reportValidity() : true;
    }

    setCustomValidity(message = '') {
      if (!this.sfInternals) return;
      if (message) this.sfInternals.setValidity({
        customError: true
      }, String(message));else this.sfInternals.setValidity({});
    }

    formDisabledCallback(disabled) {
      this.sfFormDisabled = Boolean(disabled);
      this.requestComponentUpdate?.('form-disabled');
    }

  }

  defineMembers(ManifestElement.prototype, read.members); // connect-port is the base's (§4.1): a base without it gets it here.

  (0,_host_port_js__WEBPACK_IMPORTED_MODULE_3__.installPortAction)(ManifestElement.prototype);
  defineActions(ManifestElement.prototype, read.actions, actions, read.events); // data-sf-action="<id>.<action>" runs a declared action (§8 one page trigger).

  if (read.actions.length) (0,_page_actions_js__WEBPACK_IMPORTED_MODULE_2__.bindPageActions)();
  if (aliases) ManifestElement.aliases = aliases;
  return ManifestElement;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "f171c5ece4b4"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   connectPort: () => (/* binding */ connectPort),
/* harmony export */   installPortAction: () => (/* binding */ installPortAction),
/* harmony export */   portFromParams: () => (/* binding */ portFromParams),
/* harmony export */   portIdOf: () => (/* binding */ portIdOf),
/* harmony export */   portOf: () => (/* binding */ portOf)
/* harmony export */ });
// The base action connect-port {port} (standard simai.smart-component 1.3.8
// §4.1, §4.9): every element takes the host port it is handed, from the page
// or from the assembly it is a part of, by one method, `connectPort(port)`;
// `setHostPort(port)` is its alias.
//
// The port is kept on the instance, for its scope (§7.7): it lasts while the
// instance does and is let go when its scope ends, so an element taken out of
// the page holds no host. A component reacts through an optional hook,
// `onPortConnected(port, {signal})`, run after the port is kept; a component
// written before the base action, which overrides `setHostPort(port)` itself,
// has that override run as the hook, so it needs no change to be reached.
//
// Answers an outcome (§4.4): `{outcome: 'applied'}`; `refused` with
// `no-port` when nothing was handed, `other-port` when the port names an id
// other than the one the manifest declares, and `port-unsupported` when the
// hook throws -- the port is then not kept.
// A host adapter names its port by `id` (SF.Assembly, the port contracts) or
// by `port` (`{port, version, capabilities, raise}`, ui-pro's adapters).
function portIdOf(port) {
  if (!port || typeof port !== 'object') return '';
  if (typeof port.id === 'string' && port.id) return port.id;
  if (typeof port.port === 'string' && port.port) return port.port;
  return '';
} // connect-port takes its parameters as one object, `{port}`, or the port
// itself. An adapter whose `port` is its id (a string) is the port.

function portFromParams(params) {
  if (params && typeof params === 'object' && params.port && typeof params.port === 'object') return params.port;
  return params;
} // The port id the element's manifest declares, if any (§4.9).

function declaredPortId(element) {
  const declared = element?.constructor?.manifest?.port ?? element?.constructor?.sfInterface?.port;
  return portIdOf(declared);
}
/** The port an element holds now, or null. */


function portOf(element) {
  return element?.__sfPortEntry?.port ?? null;
}
/** connect-port {port} on `element`, with `alias` the base's own setHostPort. */

function connectPort(element, params, alias) {
  const port = portFromParams(params);
  if (!port || typeof port !== 'object') return {
    outcome: 'refused',
    reason: 'no-port'
  };
  const declared = declaredPortId(element);
  const given = portIdOf(port);
  if (declared && given && declared !== given) return {
    outcome: 'refused',
    reason: 'other-port'
  };
  const previous = element.__sfPortEntry ?? null; // Kept on the element, not in a module map: every bundle carries its own
  // copy of this module, and the element is what they share.

  const signal = element.sfScope;
  const entry = {
    port,
    signal
  };
  element.__sfPortEntry = entry; // The port lives as long as the scope it was handed in (§7.7).

  if (signal && typeof signal.addEventListener === 'function' && !signal.aborted) {
    signal.addEventListener('abort', () => {
      if (element.__sfPortEntry === entry) element.__sfPortEntry = null;
    }, {
      once: true
    });
  } // The hook. A component's own setHostPort (written before the base action)
  // is the hook when there is no onPortConnected; the guard lets such an
  // override call super.setHostPort without running itself again.


  if (element.__sfConnectingPort) return {
    outcome: 'applied'
  };
  element.__sfConnectingPort = true;

  try {
    if (typeof element.onPortConnected === 'function') {
      element.onPortConnected(port, {
        signal
      });
    } else if (typeof element.setHostPort === 'function' && element.setHostPort !== alias) {
      element.setHostPort(port);
    }
  } catch (error) {
    element.__sfPortEntry = previous;
    return {
      outcome: 'refused',
      reason: 'port-unsupported'
    };
  } finally {
    element.__sfConnectingPort = false;
  }

  element.requestComponentUpdate?.('port');
  return {
    outcome: 'applied'
  };
}
/**
 * Gives a class the base action where its base has none: `connectPort`,
 * `setHostPort` and the read-only `sfPort`.
 */

function installPortAction(proto) {
  if (!proto || typeof proto.connectPort === 'function') return;

  function setHostPort(port) {
    return connectPort(this, port, setHostPort);
  }

  Object.defineProperty(proto, 'connectPort', {
    configurable: true,
    writable: true,
    value: function connectPortAction(port) {
      return connectPort(this, port, setHostPort);
    }
  });

  if (typeof proto.setHostPort !== 'function') {
    Object.defineProperty(proto, 'setHostPort', {
      configurable: true,
      writable: true,
      value: setHostPort
    });
  }

  if (!Object.prototype.hasOwnProperty.call(proto, 'sfPort')) {
    Object.defineProperty(proto, 'sfPort', {
      configurable: true,

      get() {
        return portOf(this);
      }

    });
  }
}

/***/ },

/***/ "78628e837a32"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   carryLayerOrigin: () => (/* binding */ carryLayerOrigin),
/* harmony export */   closeLayer: () => (/* binding */ closeLayer),
/* harmony export */   hasLayer: () => (/* binding */ hasLayer),
/* harmony export */   hasLayerAbove: () => (/* binding */ hasLayerAbove),
/* harmony export */   isOutsideTopLayer: () => (/* binding */ isOutsideTopLayer),
/* harmony export */   isTopLayer: () => (/* binding */ isTopLayer),
/* harmony export */   landmarksAround: () => (/* binding */ landmarksAround),
/* harmony export */   layerIndex: () => (/* binding */ layerIndex),
/* harmony export */   layerZIndex: () => (/* binding */ layerZIndex),
/* harmony export */   layerZIndexAt: () => (/* binding */ layerZIndexAt),
/* harmony export */   openLayer: () => (/* binding */ openLayer),
/* harmony export */   openLayers: () => (/* binding */ openLayers),
/* harmony export */   raiseLayer: () => (/* binding */ raiseLayer),
/* harmony export */   returnLayerFocus: () => (/* binding */ returnLayerFocus),
/* harmony export */   topLayer: () => (/* binding */ topLayer),
/* harmony export */   tryFocus: () => (/* binding */ tryFocus),
/* harmony export */   updateLayer: () => (/* binding */ updateLayer)
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

function stack() {
  const scope = globalThis;

  if (!scope[STACK_KEY]) {
    Object.defineProperty(scope, STACK_KEY, {
      value: {
        layers: [],
        bound: false,
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
} // The page lock is one lease for the whole stack, taken by the first layer
// that locks the page and given back when no such layer is left -- whichever
// kind opened first and whichever closes last. A modal and a drawer held two
// locks before, and closing them out of order unlocked the page under an open
// window.

function syncPageLock() {
  const state = stack();
  const locker = state.layers.find(entry => entry.locksPage && isLive(entry));

  if (locker && !state.lease) {
    const release = locker.lockPage?.();
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
 *               returns the function that gives it back
 *   trapsFocus  true to keep Tab inside and to return focus on close
 *   root()      the element the layer draws, for focus and outside presses
 *   onEscape(event)  closes the layer and answers true when it took the press
 *   onTab(event)     keeps focus inside
 *   focusIn()        moves focus inside
 *   place({index, zIndex, top})  draws the layer at its height
 *   returnTo    what was active at open (default: the active element now)
 */

function openLayer(owner, options = {}) {
  if (!owner) return null;
  const state = stack();
  bindKeys();
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
  if (!doc) return;
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
 */

function carryLayerOrigin(portal, host, {
  variables = [],
  prefixes = []
} = {}) {
  if (!portal || !host?.isConnected) return;
  const doc = host.ownerDocument;
  const view = doc.defaultView;
  const lang = host.closest('[lang]')?.getAttribute('lang') ?? doc.documentElement.getAttribute('lang') ?? '';
  if (lang) portal.setAttribute('lang', lang);else portal.removeAttribute('lang');
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
  if (!variables.length && !prefixes.length) return;
  const own = view.getComputedStyle(host);
  const there = parent ? view.getComputedStyle(parent) : null;
  const names = new Set(variables);

  if (prefixes.length) {
    for (const name of own) {
      if (prefixes.some(prefix => name.startsWith(prefix))) names.add(name);
    }
  }

  const previous = (portal.dataset.sfLayerVariables || '').split(' ').filter(Boolean);
  const kept = [];

  for (const name of names) {
    const value = own.getPropertyValue(name).trim();

    if (value && value !== there?.getPropertyValue(name).trim()) {
      portal.style.setProperty(name, value);
      kept.push(name);
    }
  }

  for (const name of previous) if (!kept.includes(name)) portal.style.removeProperty(name);

  if (kept.length) portal.dataset.sfLayerVariables = kept.join(' ');else delete portal.dataset.sfLayerVariables;
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


function holdOpenSurfaceMark(owner, open) {
  if (!owner) return;
  const wanted = Boolean(open);
  if (wanted === held.has(owner)) return;
  const layers = legacyLayers();

  if (wanted) {
    held.add(owner);
    layers.push(owner);
    (0,_layer_stack_js__WEBPACK_IMPORTED_MODULE_0__.openLayer)(owner, {
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

/***/ "51e3a200cf5f"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bindPageActions: () => (/* binding */ bindPageActions),
/* harmony export */   readPageAction: () => (/* binding */ readPageAction),
/* harmony export */   runPageAction: () => (/* binding */ runPageAction)
/* harmony export */ });
// One page trigger (standard simai.smart-component 1.3.8 §8, §16.10, §19.4):
// `data-sf-action="<element id>.<action>"` on a page control runs that action
// of the element, the same method a script or a rule calls. It replaces the
// per-component triggers (`data-sf-modal-open`, `data-sf-drawer-close`, …),
// which stay as their aliases.
//
//   <button data-sf-action="confirm-delete.open">Delete</button>
//   <sf-modal id="confirm-delete">… <button data-sf-action="confirm-delete.confirm">Yes</button></sf-modal>
//
// Only an action the element's manifest declares is run: a page trigger can
// not reach the element's other methods. The action gets no parameters; a
// trigger that needs some is a script.
//
// One click listener for the document, on a shared global: every Smart bundle
// carries its own copy of this module, and a second listener would run each
// action twice.
const KEY = Symbol.for('sf.pageActions');

const camel = name => String(name).replace(/-([a-z0-9])/gu, (_, letter) => letter.toUpperCase());
/** `<id>.<action>` -> {id, action}; the action is the part after the last dot. */


function readPageAction(text) {
  const value = String(text || '').trim();
  const at = value.lastIndexOf('.');
  if (at <= 0 || at === value.length - 1) return null;
  return {
    id: value.slice(0, at),
    action: value.slice(at + 1)
  };
}
/** Runs a page trigger; answers the action's outcome, or null when nothing ran. */

function runPageAction(trigger) {
  const read = readPageAction(trigger?.getAttribute?.('data-sf-action'));
  if (!read) return null; // The element's id, or its instance id: a part an assembly placed is named
  // by its role path (§7.1.1, data-sf-instance="page/form/dialog").

  const doc = trigger.ownerDocument;
  const element = doc?.getElementById(read.id) ?? [...(doc?.querySelectorAll('[data-sf-instance]') ?? [])].find(one => one.getAttribute('data-sf-instance') === read.id);
  const declared = element?.constructor?.sfManifest?.actions ?? [];
  if (!declared.some(action => action.name === read.action)) return null;
  const method = element[camel(read.action)];
  return typeof method === 'function' ? method.call(element, {}) : null;
}
function bindPageActions(doc = globalThis.document) {
  if (!doc || typeof doc.addEventListener !== 'function') return;
  const scope = globalThis;
  if (!scope[KEY]) Object.defineProperty(scope, KEY, {
    value: new WeakSet(),
    configurable: true
  });
  if (scope[KEY].has(doc)) return;
  scope[KEY].add(doc);
  doc.addEventListener('click', event => {
    const trigger = event.target?.closest?.('[data-sf-action]');
    if (!trigger || trigger.matches(':disabled, [aria-disabled="true"]')) return;
    runPageAction(trigger);
  });
}

/***/ },

/***/ "2a25b3f4fc15"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _component_country_code_data_countries_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("c614c5e30b0d");
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("0d662e4d7d63");
/* harmony import */ var _component_country_code_js_country_code__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("c0450586011d");
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("fbe0570fcc69");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("59da34819c8b");
/* harmony import */ var _component_field_size__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("e6d86f2cd058");
/* harmony import */ var _helpers_form_field__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("38ea8d53f301");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("788779012d8a");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("1be51764f8e0");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("5e73cffba91a");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("925e645e2765");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("c33216df2758");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__, _component_country_code_js_country_code__WEBPACK_IMPORTED_MODULE_2__, _core_js_smart_base__WEBPACK_IMPORTED_MODULE_3__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_4__, _js_templates_default__WEBPACK_IMPORTED_MODULE_7__]);
([_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__, _component_country_code_js_country_code__WEBPACK_IMPORTED_MODULE_2__, _core_js_smart_base__WEBPACK_IMPORTED_MODULE_3__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_4__, _js_templates_default__WEBPACK_IMPORTED_MODULE_7__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_3__);











 // sf-country-code from its component.json (standard simai.smart-component
// 1.3.8 §3, §4, §11, §16.20, §17.1): the settings are attributes and properties
// made by core/js/element-manifest.js, the words are lang/<locale>.json and the
// host is the form control through ElementInternals. What stays here is
// behaviour: the countries, the mask and the list, drawn by the class script.

const CountryCodeElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_4__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_8__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_3___default()),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_10__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_11__
  },
  source: 'ru',
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_9__
});
const COUNTRY_CODE_SELECTOR = '.sf-country-code';
const COUNTRY_ITEMS = Array.isArray(_component_country_code_data_countries_json__WEBPACK_IMPORTED_MODULE_0__?.items) ? _component_country_code_data_countries_json__WEBPACK_IMPORTED_MODULE_0__.items : [];

class SfCountryCode extends (0,_helpers_form_field__WEBPACK_IMPORTED_MODULE_6__.FormField)(CountryCodeElement) {
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
    this._renderAttributes = new Set(); // The tel text is the value the form gets: every keystroke and every
    // country chosen tells the form (§17.1) -- FormField listens for them.
  }

  get size() {
    return (0,_component_field_size__WEBPACK_IMPORTED_MODULE_5__.fieldSize)(this.getAttribute('size') || '1', 'sf-country-code');
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
  } // What the form gets (§17.1): the tel text as the person sees it, nothing
  // while disabled.


  sfFormValue() {
    if (this.disabled) return null;
    return this.value;
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
    // locale is given: Russian on a Russian page, English otherwise.
    return String(this.getAttribute('locale') || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageLanguage)(this)).toLowerCase() === 'ru' ? 'ru' : 'en';
  }

  get useMask() {
    return this.getBooleanAttr('use-mask', false);
  }

  get useCountryMasks() {
    return this.getBooleanAttr('use-country-masks', true);
  }

  get showCode() {
    return this.getBooleanAttr('show-code', true);
  }

  get maskStyle() {
    return String(this.getAttribute('mask-style') || 'native').toLowerCase() === 'brackets' ? 'brackets' : 'native';
  }

  get multiCountry() {
    return this.getBooleanAttr('multi-country', true);
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
    return this.getBooleanAttr('lazy-flags', true);
  }

  get showMaskPlaceholder() {
    return this.getBooleanAttr('show-mask-placeholder', false);
  }

  get maskPlaceholderChar() {
    return String(this.getAttribute('mask-placeholder-char') || '_');
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
      open: preserveOpen ? root.classList.contains('open') : this.open,
      disabled: preserveDisabled ? !!root.querySelector('input')?.disabled || root.classList.contains('disabled') : this.disabled,
      countries: this.countries.length ? this.countries : (0,_component_country_code_js_country_code__WEBPACK_IMPORTED_MODULE_2__.normalizeCountriesList)(COUNTRY_ITEMS, this.locale, this.maxItems),
      locale: this.locale,
      maskStyle: this.maskStyle,
      iso2: this.iso2,
      flagBase: this.flagBase,
      maxItems: this.maxItems,
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
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_7__.renderCountryCodeTemplate)(this.templateContext());
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

SfCountryCode.define('sf-country-code');
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "788779012d8a"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderCountryCodeTemplate: () => (/* binding */ renderCountryCodeTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ddf1cdb42ecc");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);


function flagTemplate(country, flagBase = '') {
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
      loading="lazy"
      data-flag-src=${src}
      data-flag-fallback=${fallback}
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
  } = context;
  const rootClasses = ['sf-country-code', `sf-country-code--size-${size}`, 'flex', 'flex-col'];
  if (context.rootClass) rootClasses.push(context.rootClass);
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
    >
      ${label // No label, no label row: a lone star over a control names nothing, and
  // the row left an empty line above every phone field in a panel that
  // draws the labels itself.
  ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
          <span class="sf-country-code-label flex">
            <span class="sf-country-code-text">${label}</span>
            ${required ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-country-code-required">*</span>` : ''}
          </span>` : ''}

      <span class="sf-country-code-field transition flex items-center">
        <span class="sf-country-code-left flex items-center">
          <div class="sf-country-code-flag-icon" aria-hidden="true"></div>
          ${multiCountry ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class="sf-icon">${open ? 'expand_less' : 'expand_more'}</i>` : ''}
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
                        ${flagTemplate(country, flagBase)}
                      </div>
                      <span>
                        ${country.label || `${locale === 'en' ? country.nameEn : country.nameRu || country.nameEn} (${country.dialCode || country.code || ''})`}
                      </span>
                    </span>
                  `)}
              </span>
            </span>
          ` : ''}

      ${hint ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-country-code-hint">${hint}</span>` : ''}
    </label>
  `;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "38ea8d53f301"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FormField: () => (/* binding */ FormField),
/* harmony export */   VALIDITY_FLAGS: () => (/* binding */ VALIDITY_FLAGS),
/* harmony export */   innerControlName: () => (/* binding */ innerControlName),
/* harmony export */   syncFieldValidity: () => (/* binding */ syncFieldValidity),
/* harmony export */   syncOwnValidity: () => (/* binding */ syncOwnValidity)
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
 * value-missing and the custom error the page set; `anchor`, when it is a part
 * of the host, is where the browser points.
 */

function syncOwnValidity(component, {
  valueMissing = false,
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
    return {
      valueMissing: required && !this.disabled && (value === null || value === undefined || value === ''),
      message: this.sfWord?.('value-missing') || 'value-missing',
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

};

/***/ },

/***/ "ddf1cdb42ecc"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit") : new Promise((resolve) => globalThis.addEventListener("sf-runtime-ready", () => resolve(globalThis.SF.runtimeModule("lit")), { once: true })));

/***/ },

/***/ "0d662e4d7d63"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("page-language") : new Promise((resolve) => globalThis.addEventListener("sf-runtime-ready", () => resolve(globalThis.SF.runtimeModule("page-language")), { once: true })));

/***/ },

/***/ "5c1dc214bb5e"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("position") : new Promise((resolve) => globalThis.addEventListener("sf-runtime-ready", () => resolve(globalThis.SF.runtimeModule("position")), { once: true })));

/***/ },

/***/ "fbe0570fcc69"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("smart-base") : new Promise((resolve) => globalThis.addEventListener("sf-runtime-ready", () => resolve(globalThis.SF.runtimeModule("smart-base")), { once: true })));

/***/ },

/***/ "c614c5e30b0d"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"generatedAt":"2026-03-05T11:52:50.322Z","source":["google-libphonenumber","i18n-iso-countries"],"total":243,"items":[{"iso2":"AU","dialCode":"+61","nameRu":"Австралия","nameEn":"Australia","flagEmoji":"🇦🇺","maskPattern":"+00 0 0000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"AT","dialCode":"+43","nameRu":"Австрия","nameEn":"Austria","flagEmoji":"🇦🇹","maskPattern":"+00 0 000000000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"AZ","dialCode":"+994","nameRu":"Азербайджан","nameEn":"Azerbaijan","flagEmoji":"🇦🇿","maskPattern":"+000 00 000 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"AX","dialCode":"+358","nameRu":"Аландские острова","nameEn":"Åland Islands","flagEmoji":"🇦🇽","maskPattern":"+000 00 0000000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"AL","dialCode":"+355","nameRu":"Албания","nameEn":"Albania","flagEmoji":"🇦🇱","maskPattern":"+000 00 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"DZ","dialCode":"+213","nameRu":"Алжир","nameEn":"Algeria","flagEmoji":"🇩🇿","maskPattern":"+000 00 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"AS","dialCode":"+1","nameRu":"Американское Самоа","nameEn":"American Samoa","flagEmoji":"🇦🇸","maskPattern":"+0 000-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"AI","dialCode":"+1","nameRu":"Ангилья","nameEn":"Anguilla","flagEmoji":"🇦🇮","maskPattern":"+0 000-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"AO","dialCode":"+244","nameRu":"Ангола","nameEn":"Angola","flagEmoji":"🇦🇴","maskPattern":"+000 000 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"AD","dialCode":"+376","nameRu":"Андорра","nameEn":"Andorra","flagEmoji":"🇦🇩","maskPattern":"+000 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"AG","dialCode":"+1","nameRu":"Антигуа и Барбуда","nameEn":"Antigua and Barbuda","flagEmoji":"🇦🇬","maskPattern":"+0 000-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"AR","dialCode":"+54","nameRu":"Аргентина","nameEn":"Argentina","flagEmoji":"🇦🇷","maskPattern":"+00 00 0000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"AM","dialCode":"+374","nameRu":"Армения","nameEn":"Armenia","flagEmoji":"🇦🇲","maskPattern":"+000 00 000000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"AW","dialCode":"+297","nameRu":"Аруба","nameEn":"Aruba","flagEmoji":"🇦🇼","maskPattern":"+000 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"AF","dialCode":"+93","nameRu":"Афганистан","nameEn":"Afghanistan","flagEmoji":"🇦🇫","maskPattern":"+00 00 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"BS","dialCode":"+1","nameRu":"Багамы","nameEn":"Bahamas","flagEmoji":"🇧🇸","maskPattern":"+0 000-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"BD","dialCode":"+880","nameRu":"Бангладеш","nameEn":"Bangladesh","flagEmoji":"🇧🇩","maskPattern":"+000 0-0000000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"BB","dialCode":"+1","nameRu":"Барбадос","nameEn":"Barbados","flagEmoji":"🇧🇧","maskPattern":"+0 000-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"BH","dialCode":"+973","nameRu":"Бахрейн","nameEn":"Bahrain","flagEmoji":"🇧🇭","maskPattern":"+000 0000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"BY","dialCode":"+375","nameRu":"Беларусь","nameEn":"Belarus","flagEmoji":"🇧🇾","maskPattern":"+000 000 00-00-00","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"BZ","dialCode":"+501","nameRu":"Белиз","nameEn":"Belize","flagEmoji":"🇧🇿","maskPattern":"+000 000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"BE","dialCode":"+32","nameRu":"Бельгия","nameEn":"Belgium","flagEmoji":"🇧🇪","maskPattern":"+00 00 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"BJ","dialCode":"+229","nameRu":"Бенин","nameEn":"Benin","flagEmoji":"🇧🇯","maskPattern":"+000 00 00 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"BM","dialCode":"+1","nameRu":"Бермуды","nameEn":"Bermuda","flagEmoji":"🇧🇲","maskPattern":"+0 000-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"BG","dialCode":"+359","nameRu":"Болгария","nameEn":"Bulgaria","flagEmoji":"🇧🇬","maskPattern":"+000 0 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"BO","dialCode":"+591","nameRu":"Боливия","nameEn":"Bolivia","flagEmoji":"🇧🇴","maskPattern":"+000 0 0000000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"BQ","dialCode":"+599","nameRu":"Бонэйр, Синт-Эстатиус и Саба","nameEn":"Bonaire, Sint Eustatius and Saba","flagEmoji":"🇧🇶","maskPattern":"+000 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"BA","dialCode":"+387","nameRu":"Босния и Герцеговина","nameEn":"Bosnia and Herzegovina","flagEmoji":"🇧🇦","maskPattern":"+000 00 000-000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"BW","dialCode":"+267","nameRu":"Ботсвана","nameEn":"Botswana","flagEmoji":"🇧🇼","maskPattern":"+000 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"BR","dialCode":"+55","nameRu":"Бразилия","nameEn":"Brazil","flagEmoji":"🇧🇷","maskPattern":"+00 00 0000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"IO","dialCode":"+246","nameRu":"Британская территория в Индийском океане","nameEn":"British Indian Ocean Territory","flagEmoji":"🇮🇴","maskPattern":"+000 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"BN","dialCode":"+673","nameRu":"Бруней","nameEn":"Brunei Darussalam","flagEmoji":"🇧🇳","maskPattern":"+000 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"BF","dialCode":"+226","nameRu":"Буркина-Фасо","nameEn":"Burkina Faso","flagEmoji":"🇧🇫","maskPattern":"+000 00 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"BI","dialCode":"+257","nameRu":"Бурунди","nameEn":"Burundi","flagEmoji":"🇧🇮","maskPattern":"+000 00 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"BT","dialCode":"+975","nameRu":"Бутан","nameEn":"Bhutan","flagEmoji":"🇧🇹","maskPattern":"+000 0 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"VU","dialCode":"+678","nameRu":"Вануату","nameEn":"Vanuatu","flagEmoji":"🇻🇺","maskPattern":"+000 00000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"VA","dialCode":"+39","nameRu":"Ватикан","nameEn":"Holy See (Vatican City State)","flagEmoji":"🇻🇦","maskPattern":"+00 00 0000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"GB","dialCode":"+44","nameRu":"Великобритания","nameEn":"United Kingdom","flagEmoji":"🇬🇧","maskPattern":"+00 000 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"HU","dialCode":"+36","nameRu":"Венгрия","nameEn":"Hungary","flagEmoji":"🇭🇺","maskPattern":"+00 0 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"VE","dialCode":"+58","nameRu":"Венесуэла","nameEn":"Venezuela","flagEmoji":"🇻🇪","maskPattern":"+00 000-0000000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"VG","dialCode":"+1","nameRu":"Виргинские Острова (Великобритания)","nameEn":"Virgin Islands, British","flagEmoji":"🇻🇬","maskPattern":"+0 000-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"VI","dialCode":"+1","nameRu":"Виргинские Острова (США)","nameEn":"Virgin Islands, U.S.","flagEmoji":"🇻🇮","maskPattern":"+0 000-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"TL","dialCode":"+670","nameRu":"Восточный Тимор","nameEn":"Timor-Leste","flagEmoji":"🇹🇱","maskPattern":"+000 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"VN","dialCode":"+84","nameRu":"Вьетнам","nameEn":"Vietnam","flagEmoji":"🇻🇳","maskPattern":"+00 000 0000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"GA","dialCode":"+241","nameRu":"Габон","nameEn":"Gabon","flagEmoji":"🇬🇦","maskPattern":"+000 00 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"HT","dialCode":"+509","nameRu":"Гаити","nameEn":"Haiti","flagEmoji":"🇭🇹","maskPattern":"+000 00 00 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"GY","dialCode":"+592","nameRu":"Гайана","nameEn":"Guyana","flagEmoji":"🇬🇾","maskPattern":"+000 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"GM","dialCode":"+220","nameRu":"Гамбия","nameEn":"Republic of The Gambia","flagEmoji":"🇬🇲","maskPattern":"+000 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"GH","dialCode":"+233","nameRu":"Гана","nameEn":"Ghana","flagEmoji":"🇬🇭","maskPattern":"+000 00 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"GP","dialCode":"+590","nameRu":"Гваделупа","nameEn":"Guadeloupe","flagEmoji":"🇬🇵","maskPattern":"+000 000 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"GT","dialCode":"+502","nameRu":"Гватемала","nameEn":"Guatemala","flagEmoji":"🇬🇹","maskPattern":"+000 0000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"GF","dialCode":"+594","nameRu":"Гвиана","nameEn":"French Guiana","flagEmoji":"🇬🇫","maskPattern":"+000 000 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"GN","dialCode":"+224","nameRu":"Гвинея","nameEn":"Guinea","flagEmoji":"🇬🇳","maskPattern":"+000 00 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"GW","dialCode":"+245","nameRu":"Гвинея-Бисау","nameEn":"Guinea-Bissau","flagEmoji":"🇬🇼","maskPattern":"+000 000 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"DE","dialCode":"+49","nameRu":"Германия","nameEn":"Germany","flagEmoji":"🇩🇪","maskPattern":"+00 00 000000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"GG","dialCode":"+44","nameRu":"Гернси","nameEn":"Guernsey","flagEmoji":"🇬🇬","maskPattern":"+00 0000 000000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"GI","dialCode":"+350","nameRu":"Гибралтар","nameEn":"Gibraltar","flagEmoji":"🇬🇮","maskPattern":"+000 000 00000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"HN","dialCode":"+504","nameRu":"Гондурас","nameEn":"Honduras","flagEmoji":"🇭🇳","maskPattern":"+000 0000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"HK","dialCode":"+852","nameRu":"Гонконг","nameEn":"Hong Kong","flagEmoji":"🇭🇰","maskPattern":"+000 0000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"PS","dialCode":"+970","nameRu":"Государство Палестина","nameEn":"State of Palestine","flagEmoji":"🇵🇸","maskPattern":"+000 0 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"GD","dialCode":"+1","nameRu":"Гренада","nameEn":"Grenada","flagEmoji":"🇬🇩","maskPattern":"+0 000-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"GL","dialCode":"+299","nameRu":"Гренландия","nameEn":"Greenland","flagEmoji":"🇬🇱","maskPattern":"+000 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"GR","dialCode":"+30","nameRu":"Греция","nameEn":"Greece","flagEmoji":"🇬🇷","maskPattern":"+00 00 0000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"GE","dialCode":"+995","nameRu":"Грузия","nameEn":"Georgia","flagEmoji":"🇬🇪","maskPattern":"+000 00 000 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"GU","dialCode":"+1","nameRu":"Гуам","nameEn":"Guam","flagEmoji":"🇬🇺","maskPattern":"+0 000-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"DK","dialCode":"+45","nameRu":"Дания","nameEn":"Denmark","flagEmoji":"🇩🇰","maskPattern":"+00 00 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"CD","dialCode":"+243","nameRu":"Демократическая Республика Конго","nameEn":"Democratic Republic of the Congo","flagEmoji":"🇨🇩","maskPattern":"+000 00 00000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"JE","dialCode":"+44","nameRu":"Джерси","nameEn":"Jersey","flagEmoji":"🇯🇪","maskPattern":"+00 0000 000000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"DJ","dialCode":"+253","nameRu":"Джибути","nameEn":"Djibouti","flagEmoji":"🇩🇯","maskPattern":"+000 00 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"DM","dialCode":"+1","nameRu":"Доминика","nameEn":"Dominica","flagEmoji":"🇩🇲","maskPattern":"+0 000-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"DO","dialCode":"+1","nameRu":"Доминиканская Республика","nameEn":"Dominican Republic","flagEmoji":"🇩🇴","maskPattern":"+0 000-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"EG","dialCode":"+20","nameRu":"Египет","nameEn":"Egypt","flagEmoji":"🇪🇬","maskPattern":"+00 0 00000000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"ZM","dialCode":"+260","nameRu":"Замбия","nameEn":"Zambia","flagEmoji":"🇿🇲","maskPattern":"+000 000 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"ZW","dialCode":"+263","nameRu":"Зимбабве","nameEn":"Zimbabwe","flagEmoji":"🇿🇼","maskPattern":"+000 00 00000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"IL","dialCode":"+972","nameRu":"Израиль","nameEn":"Israel","flagEmoji":"🇮🇱","maskPattern":"+000 0-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"IN","dialCode":"+91","nameRu":"Индия","nameEn":"India","flagEmoji":"🇮🇳","maskPattern":"+00 00000 00000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"ID","dialCode":"+62","nameRu":"Индонезия","nameEn":"Indonesia","flagEmoji":"🇮🇩","maskPattern":"+00 00 0000000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"JO","dialCode":"+962","nameRu":"Иордания","nameEn":"Jordan","flagEmoji":"🇯🇴","maskPattern":"+000 0 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"IQ","dialCode":"+964","nameRu":"Ирак","nameEn":"Iraq","flagEmoji":"🇮🇶","maskPattern":"+000 0 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"IR","dialCode":"+98","nameRu":"Иран","nameEn":"Islamic Republic of Iran","flagEmoji":"🇮🇷","maskPattern":"+00 00 0000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"IE","dialCode":"+353","nameRu":"Ирландия","nameEn":"Ireland","flagEmoji":"🇮🇪","maskPattern":"+000 00 00000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"IS","dialCode":"+354","nameRu":"Исландия","nameEn":"Iceland","flagEmoji":"🇮🇸","maskPattern":"+000 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"ES","dialCode":"+34","nameRu":"Испания","nameEn":"Spain","flagEmoji":"🇪🇸","maskPattern":"+00 000 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"IT","dialCode":"+39","nameRu":"Италия","nameEn":"Italy","flagEmoji":"🇮🇹","maskPattern":"+00 00 0000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"YE","dialCode":"+967","nameRu":"Йемен","nameEn":"Yemen","flagEmoji":"🇾🇪","maskPattern":"+000 0 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"CV","dialCode":"+238","nameRu":"Кабо-Верде","nameEn":"Cape Verde","flagEmoji":"🇨🇻","maskPattern":"+000 000 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"KZ","dialCode":"+7","nameRu":"Казахстан","nameEn":"Kazakhstan","flagEmoji":"🇰🇿","maskPattern":"+0 00000 0 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"KH","dialCode":"+855","nameRu":"Камбоджа","nameEn":"Cambodia","flagEmoji":"🇰🇭","maskPattern":"+000 00 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"CM","dialCode":"+237","nameRu":"Камерун","nameEn":"Cameroon","flagEmoji":"🇨🇲","maskPattern":"+000 0 00 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"CA","dialCode":"+1","nameRu":"Канада","nameEn":"Canada","flagEmoji":"🇨🇦","maskPattern":"+0 000-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"QA","dialCode":"+974","nameRu":"Катар","nameEn":"Qatar","flagEmoji":"🇶🇦","maskPattern":"+000 0000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"KE","dialCode":"+254","nameRu":"Кения","nameEn":"Kenya","flagEmoji":"🇰🇪","maskPattern":"+000 00 0000000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"CY","dialCode":"+357","nameRu":"Кипр","nameEn":"Cyprus","flagEmoji":"🇨🇾","maskPattern":"+000 00 000000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"KG","dialCode":"+996","nameRu":"Киргизия","nameEn":"Kyrgyzstan","flagEmoji":"🇰🇬","maskPattern":"+000 000 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"KI","dialCode":"+686","nameRu":"Кирибати","nameEn":"Kiribati","flagEmoji":"🇰🇮","maskPattern":"+000 00000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"KP","dialCode":"+850","nameRu":"КНДР (Корейская Народно-Демократическая Республика)","nameEn":"North Korea","flagEmoji":"🇰🇵","maskPattern":"+000 0 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"CN","dialCode":"+86","nameRu":"КНР (Китайская Народная Республика)","nameEn":"People\'s Republic of China","flagEmoji":"🇨🇳","maskPattern":"+00 00 0000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"CC","dialCode":"+61","nameRu":"Кокосовые острова","nameEn":"Cocos (Keeling) Islands","flagEmoji":"🇨🇨","maskPattern":"+00 0 0000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"CO","dialCode":"+57","nameRu":"Колумбия","nameEn":"Colombia","flagEmoji":"🇨🇴","maskPattern":"+00 000 0000000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"KM","dialCode":"+269","nameRu":"Коморы","nameEn":"Comoros","flagEmoji":"🇰🇲","maskPattern":"+000 000 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"XK","dialCode":"+383","nameRu":"Косово","nameEn":"Kosovo","flagEmoji":"🇽🇰","maskPattern":"+000 00 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"CR","dialCode":"+506","nameRu":"Коста-Рика","nameEn":"Costa Rica","flagEmoji":"🇨🇷","maskPattern":"+000 0000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"CI","dialCode":"+225","nameRu":"Кот-д’Ивуар","nameEn":"Cote d\'Ivoire","flagEmoji":"🇨🇮","maskPattern":"+000 00 00 0 00000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"CU","dialCode":"+53","nameRu":"Куба","nameEn":"Cuba","flagEmoji":"🇨🇺","maskPattern":"+00 0 0000000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"KW","dialCode":"+965","nameRu":"Кувейт","nameEn":"Kuwait","flagEmoji":"🇰🇼","maskPattern":"+000 0000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"CW","dialCode":"+599","nameRu":"Кюрасао","nameEn":"Curaçao","flagEmoji":"🇨🇼","maskPattern":"+000 0 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"LA","dialCode":"+856","nameRu":"Лаос","nameEn":"Lao People\'s Democratic Republic","flagEmoji":"🇱🇦","maskPattern":"+000 00 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"LV","dialCode":"+371","nameRu":"Латвия","nameEn":"Latvia","flagEmoji":"🇱🇻","maskPattern":"+000 00 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"LS","dialCode":"+266","nameRu":"Лесото","nameEn":"Lesotho","flagEmoji":"🇱🇸","maskPattern":"+000 0000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"LR","dialCode":"+231","nameRu":"Либерия","nameEn":"Liberia","flagEmoji":"🇱🇷","maskPattern":"+000 00 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"LB","dialCode":"+961","nameRu":"Ливан","nameEn":"Lebanon","flagEmoji":"🇱🇧","maskPattern":"+000 0 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"LY","dialCode":"+218","nameRu":"Ливия","nameEn":"Libya","flagEmoji":"🇱🇾","maskPattern":"+000 00-0000000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"LT","dialCode":"+370","nameRu":"Литва","nameEn":"Lithuania","flagEmoji":"🇱🇹","maskPattern":"+000 000 00000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"LI","dialCode":"+423","nameRu":"Лихтенштейн","nameEn":"Liechtenstein","flagEmoji":"🇱🇮","maskPattern":"+000 000 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"LU","dialCode":"+352","nameRu":"Люксембург","nameEn":"Luxembourg","flagEmoji":"🇱🇺","maskPattern":"+000 00 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"MU","dialCode":"+230","nameRu":"Маврикий","nameEn":"Mauritius","flagEmoji":"🇲🇺","maskPattern":"+000 0000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"MR","dialCode":"+222","nameRu":"Мавритания","nameEn":"Mauritania","flagEmoji":"🇲🇷","maskPattern":"+000 00 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"MG","dialCode":"+261","nameRu":"Мадагаскар","nameEn":"Madagascar","flagEmoji":"🇲🇬","maskPattern":"+000 00 00 000 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"YT","dialCode":"+262","nameRu":"Майотта","nameEn":"Mayotte","flagEmoji":"🇾🇹","maskPattern":"+000 000 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"MO","dialCode":"+853","nameRu":"Макао","nameEn":"Macao","flagEmoji":"🇲🇴","maskPattern":"+000 0000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"MW","dialCode":"+265","nameRu":"Малави","nameEn":"Malawi","flagEmoji":"🇲🇼","maskPattern":"+000 0 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"MY","dialCode":"+60","nameRu":"Малайзия","nameEn":"Malaysia","flagEmoji":"🇲🇾","maskPattern":"+00 0-0000 0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"ML","dialCode":"+223","nameRu":"Мали","nameEn":"Mali","flagEmoji":"🇲🇱","maskPattern":"+000 00 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"MV","dialCode":"+960","nameRu":"Мальдивы","nameEn":"Maldives","flagEmoji":"🇲🇻","maskPattern":"+000 000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"MT","dialCode":"+356","nameRu":"Мальта","nameEn":"Malta","flagEmoji":"🇲🇹","maskPattern":"+000 0000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"MA","dialCode":"+212","nameRu":"Марокко","nameEn":"Morocco","flagEmoji":"🇲🇦","maskPattern":"+000 0 00 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"MQ","dialCode":"+596","nameRu":"Мартиника","nameEn":"Martinique","flagEmoji":"🇲🇶","maskPattern":"+000 000 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"MH","dialCode":"+692","nameRu":"Маршалловы Острова","nameEn":"Marshall Islands","flagEmoji":"🇲🇭","maskPattern":"+000 000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"MX","dialCode":"+52","nameRu":"Мексика","nameEn":"Mexico","flagEmoji":"🇲🇽","maskPattern":"+00 000 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"FM","dialCode":"+691","nameRu":"Микронезия","nameEn":"Micronesia, Federated States of","flagEmoji":"🇫🇲","maskPattern":"+000 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"MZ","dialCode":"+258","nameRu":"Мозамбик","nameEn":"Mozambique","flagEmoji":"🇲🇿","maskPattern":"+000 00 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"MD","dialCode":"+373","nameRu":"Молдавия","nameEn":"Moldova, Republic of","flagEmoji":"🇲🇩","maskPattern":"+000 00 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"MC","dialCode":"+377","nameRu":"Монако","nameEn":"Monaco","flagEmoji":"🇲🇨","maskPattern":"+000 00 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"MN","dialCode":"+976","nameRu":"Монголия","nameEn":"Mongolia","flagEmoji":"🇲🇳","maskPattern":"+000 0000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"MS","dialCode":"+1","nameRu":"Монтсеррат","nameEn":"Montserrat","flagEmoji":"🇲🇸","maskPattern":"+0 000-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"MM","dialCode":"+95","nameRu":"Мьянма","nameEn":"Myanmar","flagEmoji":"🇲🇲","maskPattern":"+00 0 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"NA","dialCode":"+264","nameRu":"Намибия","nameEn":"Namibia","flagEmoji":"🇳🇦","maskPattern":"+000 00 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"NR","dialCode":"+674","nameRu":"Науру","nameEn":"Nauru","flagEmoji":"🇳🇷","maskPattern":"+000 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"NP","dialCode":"+977","nameRu":"Непал","nameEn":"Nepal","flagEmoji":"🇳🇵","maskPattern":"+000 0-0000000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"NE","dialCode":"+227","nameRu":"Нигер","nameEn":"Niger","flagEmoji":"🇳🇪","maskPattern":"+000 00 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"NG","dialCode":"+234","nameRu":"Нигерия","nameEn":"Nigeria","flagEmoji":"🇳🇬","maskPattern":"+000 0000 00 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"NL","dialCode":"+31","nameRu":"Нидерланды","nameEn":"Netherlands","flagEmoji":"🇳🇱","maskPattern":"+00 00 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"NI","dialCode":"+505","nameRu":"Никарагуа","nameEn":"Nicaragua","flagEmoji":"🇳🇮","maskPattern":"+000 0000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"NU","dialCode":"+683","nameRu":"Ниуэ","nameEn":"Niue","flagEmoji":"🇳🇺","maskPattern":"+000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"NZ","dialCode":"+64","nameRu":"Новая Зеландия","nameEn":"New Zealand","flagEmoji":"🇳🇿","maskPattern":"+00 0 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"NC","dialCode":"+687","nameRu":"Новая Каледония","nameEn":"New Caledonia","flagEmoji":"🇳🇨","maskPattern":"+000 00.00.00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"NO","dialCode":"+47","nameRu":"Норвегия","nameEn":"Norway","flagEmoji":"🇳🇴","maskPattern":"+00 00 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"AE","dialCode":"+971","nameRu":"ОАЭ","nameEn":"United Arab Emirates","flagEmoji":"🇦🇪","maskPattern":"+000 0 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"OM","dialCode":"+968","nameRu":"Оман","nameEn":"Oman","flagEmoji":"🇴🇲","maskPattern":"+000 00 000000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"IM","dialCode":"+44","nameRu":"Остров Мэн","nameEn":"Isle of Man","flagEmoji":"🇮🇲","maskPattern":"+00 0000 000000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"NF","dialCode":"+672","nameRu":"Остров Норфолк","nameEn":"Norfolk Island","flagEmoji":"🇳🇫","maskPattern":"+000 00 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"CX","dialCode":"+61","nameRu":"Остров Рождества","nameEn":"Christmas Island","flagEmoji":"🇨🇽","maskPattern":"+00 0 0000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"KY","dialCode":"+1","nameRu":"Острова Кайман","nameEn":"Cayman Islands","flagEmoji":"🇰🇾","maskPattern":"+0 000-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"CK","dialCode":"+682","nameRu":"Острова Кука","nameEn":"Cook Islands","flagEmoji":"🇨🇰","maskPattern":"+000 00 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"SH","dialCode":"+290","nameRu":"Острова Святой Елены, Вознесения и Тристан-да-Кунья","nameEn":"Saint Helena","flagEmoji":"🇸🇭","maskPattern":"+000 00000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"PK","dialCode":"+92","nameRu":"Пакистан","nameEn":"Pakistan","flagEmoji":"🇵🇰","maskPattern":"+00 00 00000000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"PW","dialCode":"+680","nameRu":"Палау","nameEn":"Palau","flagEmoji":"🇵🇼","maskPattern":"+000 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"PA","dialCode":"+507","nameRu":"Панама","nameEn":"Panama","flagEmoji":"🇵🇦","maskPattern":"+000 000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"PG","dialCode":"+675","nameRu":"Папуа — Новая Гвинея","nameEn":"Papua New Guinea","flagEmoji":"🇵🇬","maskPattern":"+000 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"PY","dialCode":"+595","nameRu":"Парагвай","nameEn":"Paraguay","flagEmoji":"🇵🇾","maskPattern":"+000 00 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"PE","dialCode":"+51","nameRu":"Перу","nameEn":"Peru","flagEmoji":"🇵🇪","maskPattern":"+00 0 0000000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"PL","dialCode":"+48","nameRu":"Польша","nameEn":"Poland","flagEmoji":"🇵🇱","maskPattern":"+00 00 000 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"PT","dialCode":"+351","nameRu":"Португалия","nameEn":"Portugal","flagEmoji":"🇵🇹","maskPattern":"+000 00 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"PR","dialCode":"+1","nameRu":"Пуэрто-Рико","nameEn":"Puerto Rico","flagEmoji":"🇵🇷","maskPattern":"+0 000-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"CG","dialCode":"+242","nameRu":"Республика Конго","nameEn":"Republic of the Congo","flagEmoji":"🇨🇬","maskPattern":"+000 00 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"KR","dialCode":"+82","nameRu":"Республика Корея","nameEn":"South Korea","flagEmoji":"🇰🇷","maskPattern":"+00 0-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"RE","dialCode":"+262","nameRu":"Реюньон","nameEn":"Reunion","flagEmoji":"🇷🇪","maskPattern":"+000 000 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"RU","dialCode":"+7","nameRu":"Российская Федерация","nameEn":"Russian Federation","flagEmoji":"🇷🇺","maskPattern":"+0 000 000-00-00","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"RW","dialCode":"+250","nameRu":"Руанда","nameEn":"Rwanda","flagEmoji":"🇷🇼","maskPattern":"+000 000 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"RO","dialCode":"+40","nameRu":"Румыния","nameEn":"Romania","flagEmoji":"🇷🇴","maskPattern":"+00 00 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"EH","dialCode":"+212","nameRu":"САДР","nameEn":"Western Sahara","flagEmoji":"🇪🇭","maskPattern":"+000 0 00 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"SV","dialCode":"+503","nameRu":"Сальвадор","nameEn":"El Salvador","flagEmoji":"🇸🇻","maskPattern":"+000 0000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"WS","dialCode":"+685","nameRu":"Самоа","nameEn":"Samoa","flagEmoji":"🇼🇸","maskPattern":"+000 00000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"SM","dialCode":"+378","nameRu":"Сан-Марино","nameEn":"San Marino","flagEmoji":"🇸🇲","maskPattern":"+000 0000 000000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"ST","dialCode":"+239","nameRu":"Сан-Томе и Принсипи","nameEn":"Sao Tome and Principe","flagEmoji":"🇸🇹","maskPattern":"+000 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"SA","dialCode":"+966","nameRu":"Саудовская Аравия","nameEn":"Saudi Arabia","flagEmoji":"🇸🇦","maskPattern":"+000 00 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"MK","dialCode":"+389","nameRu":"Северная Македония","nameEn":"The Republic of North Macedonia","flagEmoji":"🇲🇰","maskPattern":"+000 0 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"MP","dialCode":"+1","nameRu":"Северные Марианские Острова","nameEn":"Northern Mariana Islands","flagEmoji":"🇲🇵","maskPattern":"+0 000-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"SC","dialCode":"+248","nameRu":"Сейшельские Острова","nameEn":"Seychelles","flagEmoji":"🇸🇨","maskPattern":"+000 0 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"BL","dialCode":"+590","nameRu":"Сен-Бартелеми","nameEn":"Saint Barthélemy","flagEmoji":"🇧🇱","maskPattern":"+000 000 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"MF","dialCode":"+590","nameRu":"Сен-Мартен","nameEn":"Saint Martin (French part)","flagEmoji":"🇲🇫","maskPattern":"+000 000 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"PM","dialCode":"+508","nameRu":"Сен-Пьер и Микелон","nameEn":"Saint Pierre and Miquelon","flagEmoji":"🇵🇲","maskPattern":"+000 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"SN","dialCode":"+221","nameRu":"Сенегал","nameEn":"Senegal","flagEmoji":"🇸🇳","maskPattern":"+000 00 000 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"VC","dialCode":"+1","nameRu":"Сент-Винсент и Гренадины","nameEn":"Saint Vincent and the Grenadines","flagEmoji":"🇻🇨","maskPattern":"+0 000-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"KN","dialCode":"+1","nameRu":"Сент-Китс и Невис","nameEn":"Saint Kitts and Nevis","flagEmoji":"🇰🇳","maskPattern":"+0 000-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"LC","dialCode":"+1","nameRu":"Сент-Люсия","nameEn":"Saint Lucia","flagEmoji":"🇱🇨","maskPattern":"+0 000-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"RS","dialCode":"+381","nameRu":"Сербия","nameEn":"Serbia","flagEmoji":"🇷🇸","maskPattern":"+000 00 000000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"SG","dialCode":"+65","nameRu":"Сингапур","nameEn":"Singapore","flagEmoji":"🇸🇬","maskPattern":"+00 0000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"SX","dialCode":"+1","nameRu":"Синт-Мартен","nameEn":"Sint Maarten (Dutch part)","flagEmoji":"🇸🇽","maskPattern":"+0 000-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"SY","dialCode":"+963","nameRu":"Сирия","nameEn":"Syrian Arab Republic","flagEmoji":"🇸🇾","maskPattern":"+000 00 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"SK","dialCode":"+421","nameRu":"Словакия","nameEn":"Slovakia","flagEmoji":"🇸🇰","maskPattern":"+000 0/000 000 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"SI","dialCode":"+386","nameRu":"Словения","nameEn":"Slovenia","flagEmoji":"🇸🇮","maskPattern":"+000 0 000 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"SB","dialCode":"+677","nameRu":"Соломоновы Острова","nameEn":"Solomon Islands","flagEmoji":"🇸🇧","maskPattern":"+000 00000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"SO","dialCode":"+252","nameRu":"Сомали","nameEn":"Somalia","flagEmoji":"🇸🇴","maskPattern":"+000 0 000000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"SD","dialCode":"+249","nameRu":"Судан","nameEn":"Sudan","flagEmoji":"🇸🇩","maskPattern":"+000 00 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"SR","dialCode":"+597","nameRu":"Суринам","nameEn":"Suriname","flagEmoji":"🇸🇷","maskPattern":"+000 000-000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"US","dialCode":"+1","nameRu":"США","nameEn":"United States of America","flagEmoji":"🇺🇸","maskPattern":"+0 000-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"SL","dialCode":"+232","nameRu":"Сьерра-Леоне","nameEn":"Sierra Leone","flagEmoji":"🇸🇱","maskPattern":"+000 00 000000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"TJ","dialCode":"+992","nameRu":"Таджикистан","nameEn":"Tajikistan","flagEmoji":"🇹🇯","maskPattern":"+000 000 00 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"TH","dialCode":"+66","nameRu":"Таиланд","nameEn":"Thailand","flagEmoji":"🇹🇭","maskPattern":"+00 0 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"TW","dialCode":"+886","nameRu":"Тайвань","nameEn":"Taiwan, Province of China","flagEmoji":"🇹🇼","maskPattern":"+000 0 0000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"TZ","dialCode":"+255","nameRu":"Танзания","nameEn":"United Republic of Tanzania","flagEmoji":"🇹🇿","maskPattern":"+000 00 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"TC","dialCode":"+1","nameRu":"Теркс и Кайкос","nameEn":"Turks and Caicos Islands","flagEmoji":"🇹🇨","maskPattern":"+0 000-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"TG","dialCode":"+228","nameRu":"Того","nameEn":"Togo","flagEmoji":"🇹🇬","maskPattern":"+000 00 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"TK","dialCode":"+690","nameRu":"Токелау","nameEn":"Tokelau","flagEmoji":"🇹🇰","maskPattern":"+000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"TO","dialCode":"+676","nameRu":"Тонга","nameEn":"Tonga","flagEmoji":"🇹🇴","maskPattern":"+000 00-000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"TT","dialCode":"+1","nameRu":"Тринидад и Тобаго","nameEn":"Trinidad and Tobago","flagEmoji":"🇹🇹","maskPattern":"+0 000-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"TV","dialCode":"+688","nameRu":"Тувалу","nameEn":"Tuvalu","flagEmoji":"🇹🇻","maskPattern":"+000 00 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"TN","dialCode":"+216","nameRu":"Тунис","nameEn":"Tunisia","flagEmoji":"🇹🇳","maskPattern":"+000 00 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"TM","dialCode":"+993","nameRu":"Туркмения","nameEn":"Turkmenistan","flagEmoji":"🇹🇲","maskPattern":"+000 00 00-00-00","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"TR","dialCode":"+90","nameRu":"Турция","nameEn":"Türkiye","flagEmoji":"🇹🇷","maskPattern":"+00 000 000 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"UG","dialCode":"+256","nameRu":"Уганда","nameEn":"Uganda","flagEmoji":"🇺🇬","maskPattern":"+000 00 0000000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"UZ","dialCode":"+998","nameRu":"Узбекистан","nameEn":"Uzbekistan","flagEmoji":"🇺🇿","maskPattern":"+000 00 000 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"UA","dialCode":"+380","nameRu":"Украина","nameEn":"Ukraine","flagEmoji":"🇺🇦","maskPattern":"+000 0000 00000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"WF","dialCode":"+681","nameRu":"Уоллис и Футуна","nameEn":"Wallis and Futuna","flagEmoji":"🇼🇫","maskPattern":"+000 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"UY","dialCode":"+598","nameRu":"Уругвай","nameEn":"Uruguay","flagEmoji":"🇺🇾","maskPattern":"+000 0000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"FO","dialCode":"+298","nameRu":"Фареры","nameEn":"Faroe Islands","flagEmoji":"🇫🇴","maskPattern":"+000 000000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"FJ","dialCode":"+679","nameRu":"Фиджи","nameEn":"Fiji","flagEmoji":"🇫🇯","maskPattern":"+000 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"PH","dialCode":"+63","nameRu":"Филиппины","nameEn":"Philippines","flagEmoji":"🇵🇭","maskPattern":"+00 0 0000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"FI","dialCode":"+358","nameRu":"Финляндия","nameEn":"Finland","flagEmoji":"🇫🇮","maskPattern":"+000 00 0000000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"FK","dialCode":"+500","nameRu":"Фолклендские острова","nameEn":"Falkland Islands (Malvinas)","flagEmoji":"🇫🇰","maskPattern":"+000 00000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"FR","dialCode":"+33","nameRu":"Франция","nameEn":"France","flagEmoji":"🇫🇷","maskPattern":"+00 0 00 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"PF","dialCode":"+689","nameRu":"Французская Полинезия","nameEn":"French Polynesia","flagEmoji":"🇵🇫","maskPattern":"+000 00 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"HR","dialCode":"+385","nameRu":"Хорватия","nameEn":"Croatia","flagEmoji":"🇭🇷","maskPattern":"+000 0 0000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"CF","dialCode":"+236","nameRu":"ЦАР","nameEn":"Central African Republic","flagEmoji":"🇨🇫","maskPattern":"+000 00 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"TD","dialCode":"+235","nameRu":"Чад","nameEn":"Chad","flagEmoji":"🇹🇩","maskPattern":"+000 00 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"ME","dialCode":"+382","nameRu":"Черногория","nameEn":"Montenegro","flagEmoji":"🇲🇪","maskPattern":"+000 00 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"CZ","dialCode":"+420","nameRu":"Чехия","nameEn":"Czech Republic","flagEmoji":"🇨🇿","maskPattern":"+000 000 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"CL","dialCode":"+56","nameRu":"Чили","nameEn":"Chile","flagEmoji":"🇨🇱","maskPattern":"+00 000 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"CH","dialCode":"+41","nameRu":"Швейцария","nameEn":"Switzerland","flagEmoji":"🇨🇭","maskPattern":"+00 00 000 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"SE","dialCode":"+46","nameRu":"Швеция","nameEn":"Sweden","flagEmoji":"🇸🇪","maskPattern":"+00 0 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"SJ","dialCode":"+47","nameRu":"Шпицберген и Ян-Майен","nameEn":"Svalbard and Jan Mayen","flagEmoji":"🇸🇯","maskPattern":"+00 00 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"LK","dialCode":"+94","nameRu":"Шри-Ланка","nameEn":"Sri Lanka","flagEmoji":"🇱🇰","maskPattern":"+00 000 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"EC","dialCode":"+593","nameRu":"Эквадор","nameEn":"Ecuador","flagEmoji":"🇪🇨","maskPattern":"+000 0-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"GQ","dialCode":"+240","nameRu":"Экваториальная Гвинея","nameEn":"Equatorial Guinea","flagEmoji":"🇬🇶","maskPattern":"+000 000 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"ER","dialCode":"+291","nameRu":"Эритрея","nameEn":"Eritrea","flagEmoji":"🇪🇷","maskPattern":"+000 0 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"SZ","dialCode":"+268","nameRu":"Эсватини","nameEn":"Eswatini","flagEmoji":"🇸🇿","maskPattern":"+000 0000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"EE","dialCode":"+372","nameRu":"Эстония","nameEn":"Estonia","flagEmoji":"🇪🇪","maskPattern":"+000 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"ET","dialCode":"+251","nameRu":"Эфиопия","nameEn":"Ethiopia","flagEmoji":"🇪🇹","maskPattern":"+000 00 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"ZA","dialCode":"+27","nameRu":"ЮАР","nameEn":"South Africa","flagEmoji":"🇿🇦","maskPattern":"+00 00 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"SS","dialCode":"+211","nameRu":"Южный Судан","nameEn":"South Sudan","flagEmoji":"🇸🇸","maskPattern":"+000 000 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"JM","dialCode":"+1","nameRu":"Ямайка","nameEn":"Jamaica","flagEmoji":"🇯🇲","maskPattern":"+0 000-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"JP","dialCode":"+81","nameRu":"Япония","nameEn":"Japan","flagEmoji":"🇯🇵","maskPattern":"+00 0-0000-0000","maskHasParentheses":false,"maskHasHyphen":true}]}');

/***/ },

/***/ "8c672a55a76a"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{".sf-country-code":["display/flex (.flex)","flex-direction/column (.flex-col)","flex-wrap/nowrap (.flex-nowrap)","gap/var(--sf-space-1\\\\/4)","justify-content/flex-start (.justify-start)"],".sf-country-code .sf-country-code-label":["display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","gap/var(--sf-space-1\\\\/4)","justify-content/flex-start (.justify-start)","align-items/flex-start (.items-start)"],".sf-country-code .sf-country-code-field":["display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","justify-content/flex-start (.justify-start)","align-items/center (.items-center)"],".sf-country-code .sf-country-code-left":["display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","justify-content/flex-start (.justify-start)","align-items/center (.items-center)"],".sf-country-code .sf-country-code-field input":["flex/1 (.flex-1)","display/flex (.flex)"],".sf-country-code .sf-country-code-items":["gap/var(--sf-country-code-items--gap)"],".sf-country-code .sf-country-code-item":["display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","gap/var(--sf-space-1\\\\/3)","justify-content/flex-start (.justify-start)","align-items/center (.items-center)"],".sf-country-code .sf-country-code-flag":["display/flex (.flex)","justify-content/flex-start (.justify-start)","align-items/center (.items-center)"],".sf-country-code.open .sf-country-code-list":["flex/1 (.flex-1)","display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","justify-content/flex-start (.justify-start)","align-items/flex-start (.items-start)"],".sf-country-code.open .sf-country-code-items":["flex/1 (.flex-1)","display/flex (.flex)","flex-direction/column (.flex-col)","flex-wrap/nowrap (.flex-nowrap)","justify-content/flex-start (.justify-start)","align-items/flex-start (.items-start)"],".sf-country-code.sf-country-code--size-1.open .sf-country-code-list":["flex/1 (.flex-1)","display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","justify-content/flex-start (.justify-start)","align-items/flex-start (.items-start)"],".sf-country-code.sf-country-code--size-1.open .sf-country-code-items":["flex/1 (.flex-1)","display/flex (.flex)","flex-direction/column (.flex-col)","flex-wrap/nowrap (.flex-nowrap)","justify-content/flex-start (.justify-start)","align-items/flex-start (.items-start)"],".sf-country-code.sf-country-code--size-2.open .sf-country-code-list":["flex/1 (.flex-1)","display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","justify-content/flex-start (.justify-start)","align-items/flex-start (.items-start)"],".sf-country-code.sf-country-code--size-2.open .sf-country-code-items":["flex/1 (.flex-1)","display/flex (.flex)","flex-direction/column (.flex-col)","flex-wrap/nowrap (.flex-nowrap)","justify-content/flex-start (.justify-start)","align-items/flex-start (.items-start)"],".sf-country-code.sf-country-code--size-3.open .sf-country-code-list":["flex/1 (.flex-1)","display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","justify-content/flex-start (.justify-start)","align-items/flex-start (.items-start)"],".sf-country-code.sf-country-code--size-3.open .sf-country-code-items":["flex/1 (.flex-1)","display/flex (.flex)","flex-direction/column (.flex-col)","flex-wrap/nowrap (.flex-nowrap)","justify-content/flex-start (.justify-start)","align-items/flex-start (.items-start)"],".sf-country-code.sf-country-code--size-1\\\\/3.open .sf-country-code-list":["flex/1 (.flex-1)","display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","justify-content/flex-start (.justify-start)","align-items/flex-start (.items-start)"],".sf-country-code.sf-country-code--size-1\\\\/3.open .sf-country-code-items":["flex/1 (.flex-1)","display/flex (.flex)","flex-direction/column (.flex-col)","flex-wrap/nowrap (.flex-nowrap)","justify-content/flex-start (.justify-start)","align-items/flex-start (.items-start)"],".sf-country-code.sf-country-code--size-1\\\\/2.open .sf-country-code-list":["flex/1 (.flex-1)","display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","justify-content/flex-start (.justify-start)","align-items/flex-start (.items-start)"],".sf-country-code.sf-country-code--size-1\\\\/2.open .sf-country-code-items":["flex/1 (.flex-1)","display/flex (.flex)","flex-direction/column (.flex-col)","flex-wrap/nowrap (.flex-nowrap)","justify-content/flex-start (.justify-start)","align-items/flex-start (.items-start)"]}');

/***/ },

/***/ "5e73cffba91a"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases for the shim (core/js/aliases.js, standard simai.smart-component 1.3.8 §16.20). Event rows send the new name first, then the old one, with one detail; setting rows map the old attribute and property to the new; host-attribute rows (no \\"to\\") stay host attributes read by the browser or the base and are listed, refused by the shim on purpose; documentary rows (\\"shim\\": \\"none\\") record a rename the shim cannot serve.","component":"sf-country-code","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"aria-label","to":null,"kind":"attribute","component":"sf-country-code","since":"2026-10-27","remove_after":"2026-12-01","mode":"host-attribute","section":"§3.1","note":"stays a host attribute, read by the base (§3.1, §4.8); no shim"},{"from":"form","to":null,"kind":"attribute","component":"sf-country-code","since":"2026-10-27","remove_after":"2026-12-01","mode":"host-attribute","section":"§17.1","note":"stays a host attribute: the browser associates a form-associated element with the form it names; no shim"}]}');

/***/ },

/***/ "1be51764f8e0"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"The source of sf-country-code\'s element plumbing (core/js/element-manifest.js). Taken from simai/ui-control control/smart-architecture/migration/out/country-code (migration/convert-1.3.8.mjs from simai/ui-source@5100227 src/smart/country-code/smart.manifest.json); standard simai.smart-component 1.3.8, vocabulary 1.1.5. Its x-todo are decided in x-decisions.","id":"smart.country-code","tag":"sf-country-code","version":"1.1.0","kind":"leaf","family":"field","settings":{"size":{"type":"enum","values":["1/2","1","2"],"default":"1"},"label":{"type":"string","default":""},"required":{"type":"boolean","default":false},"name":{"type":"string","default":""},"hint":{"type":"string","default":""},"placeholder":{"type":"string","default-from":"runtime.placeholder"},"disabled":{"type":"boolean","default":false},"locale":{"type":"string","default":""},"use-mask":{"type":"boolean","default":false},"use-country-masks":{"type":"boolean","default":true},"show-code":{"type":"boolean","default":true},"mask-style":{"type":"string","default":"native"},"multi-country":{"type":"boolean","default":true},"iso2":{"type":"string","default":""},"dial-code":{"type":"string","default":""},"mask-pattern":{"type":"string","default":""},"flag-base":{"type":"string","default":""},"lazy-flags":{"type":"boolean","default":true},"show-mask-placeholder":{"type":"boolean","default":false},"mask-placeholder-char":{"type":"string","default":"_"},"max-items":{"type":"number","default":0}},"values":{"value":{"type":"string","default":""},"open":{"type":"boolean","default":false}},"events":{"change":{"carries":"native"},"input":{"carries":"native"}},"actions":{},"form":{"value":"value","name":"name","default":"value","submits":"value","reset":"default","required":"required","disabled":"disabled","validity":["value-missing","custom-error"]},"keyboard":{"host":{"Tab":"reach","Enter":"open","Space":"open","ArrowDown":"open","ArrowUp":"open","Escape":"close"},"panel":{"ArrowDown":"focus:next","ArrowUp":"focus:prev","Home":"focus:first","End":"focus:last","Enter":"select","Space":"select","Escape":"close"}},"templates":{"default":{"file":"js/templates/default.js"}},"examples":"examples.json","docs":"docs.md","lang":"lang/","accessibility":{"role":"textbox","name":{"from":["label","aria-label"]},"keys":{"Tab":"reach","Enter":"open","Space":"open","ArrowDown":"focus:next","ArrowUp":"focus:prev","Home":"focus:first","End":"focus:last","Escape":"close"}},"css-variables":{"--sf-country-code-background-color":{"type":"color","state":"rest"},"--sf-country-code-border-color":{"type":"color","state":"rest"},"--sf-country-code-radius":{"type":"length"},"--sf-country-code-color":{"type":"color","state":"rest"},"--sf-country-code-list-background-color":{"type":"color","state":"open"}},"x-summary":"A telephone field with a country picker: a button opens a searchable listbox of countries, and the chosen country sets the dial code, flag and, optionally, the input mask of the native tel input.","x-source":{"package":"framework","folder":"country-code","manifest":"simai/ui-source@5100227 src/smart/country-code/smart.manifest.json","converted":"control/smart-architecture/stands/17-ports-migration/out/country-code.component.json"},"x-words":["label","hint","placeholder"],"x-renamed":["settings.aria-label: a host attribute, read by the base, never a setting (§3.1)","lang runtime also holds the words of COUNTRY_CODE_TEXT (ui-source/src/component/country-code/js/_country_code.js): a shared script this component draws with (§11: no word lives only inside a bundle)","settings.placeholder: its default words move to lang/en.json runtime.placeholder (§11, §16 item 44)","settings.form: a host attribute the browser reads for a form-associated element (§17.1); the host joins the form it names, the inner tel input no longer does"],"x-kept":{"security":{"permissions_owner":"none","untrusted_inputs":["props","children"],"network_policy":"deny"},"ownership":{"source":"simai/ui-source","data":"fixture","effects":"component","forbidden_client_responsibilities":["backend access decisions","host route invention"]},"presentation":{"themes":["light","dark"],"locales":["ru","en"],"responsive":["desktop","mobile"],"skeleton":{"shape":"block","while_loading":"none"}},"ai_guidance":{"use_when":"Use sf-country-code when the interface needs the country code behavior.","do_not":["Do not copy generated ui-smart code","Do not move host data or access decisions into the component"],"required_reads":["inputs","methods","events","ownership","provenance"],"minimal_example":"<sf-country-code></sf-country-code>","owner_commands":["npm run contract:verify","npm test"]}},"x-decisions":["lang-ru: runtime.placeholder in Russian is the same mask, +7(___)___-__-__; value-missing says «Введите номер телефона.» as the class script did","a11y-role: textbox -- the native tel input carries the role and the name; the country toggle is a button with a listbox popup inside it (keyboard.panel)","key-effects: host Enter/Space/ArrowDown/ArrowUp open the list, Escape closes it; in the list (panel) arrows, Home and End move focus, Enter and Space select, Escape closes","template: the default template stays the Lit module js/templates/default.js, the migration form §5.2 allows; template.html follows when the build compiles HTML templates (one source of markup, not two)","examples: examples.json from studio.fixture.json and studio.scenario.json","css-variables: five public variables read by the class sheet src/component/country-code/scss with the role token as fallback (§6); a state the public-variables probe cannot draw at rest (hover, an outline) takes no variable of its own yet","version: 1.1.0 -- the setting form leaves for the host attribute behind a dated alias row; a minor while the alias holds (§4.10)","form: the host is the form control through ElementInternals (§17.1); it submits the tel text as the person sees it, required asks for digits after the dial code","host-states: none -- the open list and the disabled look are classes the class script writes on its own root (shared with the class component); moving them to host states is left for the class script"]}');

/***/ },

/***/ "925e645e2765"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Country Code","runtime":{"country-label":"Country code","phone-label":"Phone number","phone-required":"Enter a phone number.","placeholder":"+7(___)___-__-__","value-missing":"Enter a phone number."}}');

/***/ },

/***/ "c33216df2758"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Код страны","runtime":{"country-label":"Код страны","phone-label":"Телефон","phone-required":"Введите номер телефона.","placeholder":"+7(___)___-__-__","value-missing":"Введите номер телефона."}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("2a25b3f4fc15");
/******/
/******/ })()
;