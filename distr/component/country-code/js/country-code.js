/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "c0450586011d"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

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
    const name = root.__sfCountryConfig?.locale === 'en' ? 'Phone number' : 'Телефон';
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
  const message = missing ? config.locale === 'en' ? 'Enter a phone number.' : 'Введите номер телефона.' : '';
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
  const countryName = config.locale === 'en' ? 'Country code' : 'Код страны';
  syncCountryFieldReferences(root, input);
  root.querySelectorAll('.sf-country-code-required, .sf-country-code-left .sf-icon').forEach(node => node.setAttribute('aria-hidden', 'true'));

  if (toggle) {
    setCountryName(toggle, `${countryName}${selected ? `: ${getCountryLabel(selected, config.locale)}` : ''}`);

    if (config.multiCountry && config.showCode && list) {
      toggle.setAttribute('aria-haspopup', 'listbox');
      toggle.setAttribute('aria-controls', ensureCountryId(list));
      toggle.setAttribute('aria-expanded', String(open));
    } else {
      toggle.removeAttribute('aria-haspopup');
      toggle.removeAttribute('aria-controls');
      toggle.removeAttribute('aria-expanded');
      toggle.removeAttribute('role');
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

function resolveDefaultFlagBase() {
  return '';
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
  if (open) root.classList.add('open');else root.classList.remove('open');
  syncCountryAccessibility(root);
  root.__sfCountryViewport?.(open);
}

function resolveConfig(root, input) {
  const locale = String(root.dataset.locale || input?.dataset.locale || 'ru').toLowerCase();
  const rawMaskStyle = String(root.dataset.maskStyle ?? input?.dataset.maskStyle ?? 'native').toLowerCase();
  const maskStyle = rawMaskStyle === 'brackets' ? 'brackets' : 'native';
  return {
    locale: locale === 'en' ? 'en' : 'ru',
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
}

function applyDropdownViewport(root, visibleItems = 8) {
  const {
    list,
    itemsWrap
  } = getNodes(root);
  if (!list || !itemsWrap || visibleItems <= 0 || !root.classList.contains('open')) return;
  const items = Array.from(itemsWrap.querySelectorAll('.sf-country-code-item'));
  if (!items.length) return;
  const rootBox = root.getBoundingClientRect();
  if (!rootBox.height || !root.offsetHeight) return;
  const scale = rootBox.height / root.offsetHeight;
  const itemHeights = items.slice(0, visibleItems).map(item => item.getBoundingClientRect().height / scale);
  if (!itemHeights.some(Boolean)) return;
  const wrapStyle = window.getComputedStyle(itemsWrap);
  const gap = Number.parseFloat(wrapStyle.rowGap || '') || Number.parseFloat(wrapStyle.gap || '') || 0;
  const paddingTop = Number.parseFloat(wrapStyle.paddingTop || '') || 0;
  const paddingBottom = Number.parseFloat(wrapStyle.paddingBottom || '') || 0;
  const visibleCount = Math.min(visibleItems, items.length);
  const totalHeight = itemHeights.reduce((sum, height) => sum + height, 0) + (visibleCount - 1) * gap + paddingTop + paddingBottom;
  const style = getComputedStyle(list);
  const chrome = ['paddingTop', 'paddingBottom', 'borderTopWidth', 'borderBottomWidth'].reduce((sum, name) => sum + (parseFloat(style[name]) || 0), 0); // Reuse the panel's semantic padding as clearance from the viewport edge.

  const margin = Math.max(parseFloat(style.paddingTop) || 0, parseFloat(style.paddingBottom) || 0) * scale;
  const viewport = window.visualViewport;
  const top = (viewport?.offsetTop || 0) + margin;
  const bottom = (viewport?.offsetTop || 0) + (viewport?.height || document.documentElement.clientHeight) - margin;

  if (rootBox.bottom <= top || rootBox.top >= bottom) {
    setOpenState(root, false);
    return;
  }

  const below = Math.max(0, bottom - rootBox.bottom);
  const above = Math.max(0, rootBox.top - top);
  const up = (totalHeight + chrome) * scale > below && above > below;
  const available = Math.max(0, (up ? above : below) / scale - chrome);
  list.style.overflow = 'hidden';
  itemsWrap.style.maxHeight = `${Math.min(totalHeight, available)}px`;
  itemsWrap.style.overflowY = 'auto';
  itemsWrap.style.overflowX = 'hidden';
  list.style.insetBlockStart = up ? `${-list.getBoundingClientRect().height / scale}px` : '100%';
}

function bindCountryViewport(root) {
  const {
    list,
    itemsWrap
  } = getNodes(root);
  if (!list || !itemsWrap) return;
  let active = false,
      frame = 0,
      saved = null;

  const position = () => {
    if (active && root.isConnected) applyDropdownViewport(root);
  };

  const schedule = () => {
    if (active && !frame) frame = requestAnimationFrame(() => {
      frame = 0;
      position();
    });
  };

  const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(schedule) : null;

  root.__sfCountryViewport = open => {
    if (open && !active) {
      active = true;
      saved = [list.style.getPropertyValue('inset-block-start'), list.style.getPropertyPriority('inset-block-start')];
      window.addEventListener('resize', schedule);
      document.addEventListener('scroll', schedule, true);
      window.visualViewport?.addEventListener('resize', schedule);
      window.visualViewport?.addEventListener('scroll', schedule);
      observer?.observe(root);
      observer?.observe(itemsWrap);
    } else if (!open && active) {
      active = false;
      window.removeEventListener('resize', schedule);
      document.removeEventListener('scroll', schedule, true);
      window.visualViewport?.removeEventListener('resize', schedule);
      window.visualViewport?.removeEventListener('scroll', schedule);
      observer?.disconnect();
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      if (saved[0]) list.style.setProperty('inset-block-start', saved[0], saved[1]);else list.style.removeProperty('inset-block-start');
    }

    if (open) position();
  };
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
  if (!window.SF?.Mask?.create) return;
  const current = input.value;

  try {
    const resolvedConfig = config || root.__sfCountryConfig || resolveConfig(root, input);
    const hasInitialValue = String(current || '').trim() !== '';
    const showMaskTemplate = resolvedConfig.showMaskPlaceholder && hasInitialValue;

    if (!hasInitialValue && maskPattern) {
      const dialCode = root?.dataset?.dialCode || resolvedConfig.fixedDialCode || '';
      input.placeholder = buildPlaceholderFromMask(maskPattern, resolvedConfig.maskPlaceholderChar || '_', dialCode);
    }

    const instance = await window.SF.Mask.create(input, {
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

      if (digitsOnly && Object.prototype.hasOwnProperty.call(instance, 'unmaskedValue')) {
        instance.unmaskedValue = digitsOnly;
      } else if (Object.prototype.hasOwnProperty.call(instance, 'value')) {
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
    }

    if (event.key === 'Escape') {
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
  delete root.__sfCountryViewport;
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
      label = 'Label',
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
    this.template.classList.add('sf-country-code', `sf-country-code--size-${size}`);
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
  constructor(props) {
    this.props = props;
    this.id = props?.id;
    this.params = props?.param;
    this.attrs = props?.attrs || {};
    this.template = null;
    window.dispatchEvent(new CustomEvent(`${this.componentName}:beforeRender`, {
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
      window.dispatchEvent(new CustomEvent(`${this.componentName}:render`, {
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

    window.dispatchEvent(new CustomEvent(`${this.componentName}:destroy`, {
      detail: this
    }));
  }

  destroyInternal() {}

}

/***/ },

/***/ "57cf5fca5804"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "c614c5e30b0d"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"generatedAt":"2026-03-05T11:52:50.322Z","source":["google-libphonenumber","i18n-iso-countries"],"total":243,"items":[{"iso2":"AU","dialCode":"+61","nameRu":"Австралия","nameEn":"Australia","flagEmoji":"🇦🇺","maskPattern":"+00 0 0000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"AT","dialCode":"+43","nameRu":"Австрия","nameEn":"Austria","flagEmoji":"🇦🇹","maskPattern":"+00 0 000000000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"AZ","dialCode":"+994","nameRu":"Азербайджан","nameEn":"Azerbaijan","flagEmoji":"🇦🇿","maskPattern":"+000 00 000 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"AX","dialCode":"+358","nameRu":"Аландские острова","nameEn":"Åland Islands","flagEmoji":"🇦🇽","maskPattern":"+000 00 0000000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"AL","dialCode":"+355","nameRu":"Албания","nameEn":"Albania","flagEmoji":"🇦🇱","maskPattern":"+000 00 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"DZ","dialCode":"+213","nameRu":"Алжир","nameEn":"Algeria","flagEmoji":"🇩🇿","maskPattern":"+000 00 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"AS","dialCode":"+1","nameRu":"Американское Самоа","nameEn":"American Samoa","flagEmoji":"🇦🇸","maskPattern":"+0 000-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"AI","dialCode":"+1","nameRu":"Ангилья","nameEn":"Anguilla","flagEmoji":"🇦🇮","maskPattern":"+0 000-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"AO","dialCode":"+244","nameRu":"Ангола","nameEn":"Angola","flagEmoji":"🇦🇴","maskPattern":"+000 000 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"AD","dialCode":"+376","nameRu":"Андорра","nameEn":"Andorra","flagEmoji":"🇦🇩","maskPattern":"+000 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"AG","dialCode":"+1","nameRu":"Антигуа и Барбуда","nameEn":"Antigua and Barbuda","flagEmoji":"🇦🇬","maskPattern":"+0 000-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"AR","dialCode":"+54","nameRu":"Аргентина","nameEn":"Argentina","flagEmoji":"🇦🇷","maskPattern":"+00 00 0000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"AM","dialCode":"+374","nameRu":"Армения","nameEn":"Armenia","flagEmoji":"🇦🇲","maskPattern":"+000 00 000000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"AW","dialCode":"+297","nameRu":"Аруба","nameEn":"Aruba","flagEmoji":"🇦🇼","maskPattern":"+000 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"AF","dialCode":"+93","nameRu":"Афганистан","nameEn":"Afghanistan","flagEmoji":"🇦🇫","maskPattern":"+00 00 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"BS","dialCode":"+1","nameRu":"Багамы","nameEn":"Bahamas","flagEmoji":"🇧🇸","maskPattern":"+0 000-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"BD","dialCode":"+880","nameRu":"Бангладеш","nameEn":"Bangladesh","flagEmoji":"🇧🇩","maskPattern":"+000 0-0000000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"BB","dialCode":"+1","nameRu":"Барбадос","nameEn":"Barbados","flagEmoji":"🇧🇧","maskPattern":"+0 000-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"BH","dialCode":"+973","nameRu":"Бахрейн","nameEn":"Bahrain","flagEmoji":"🇧🇭","maskPattern":"+000 0000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"BY","dialCode":"+375","nameRu":"Беларусь","nameEn":"Belarus","flagEmoji":"🇧🇾","maskPattern":"+000 000 00-00-00","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"BZ","dialCode":"+501","nameRu":"Белиз","nameEn":"Belize","flagEmoji":"🇧🇿","maskPattern":"+000 000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"BE","dialCode":"+32","nameRu":"Бельгия","nameEn":"Belgium","flagEmoji":"🇧🇪","maskPattern":"+00 00 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"BJ","dialCode":"+229","nameRu":"Бенин","nameEn":"Benin","flagEmoji":"🇧🇯","maskPattern":"+000 00 00 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"BM","dialCode":"+1","nameRu":"Бермуды","nameEn":"Bermuda","flagEmoji":"🇧🇲","maskPattern":"+0 000-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"BG","dialCode":"+359","nameRu":"Болгария","nameEn":"Bulgaria","flagEmoji":"🇧🇬","maskPattern":"+000 0 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"BO","dialCode":"+591","nameRu":"Боливия","nameEn":"Bolivia","flagEmoji":"🇧🇴","maskPattern":"+000 0 0000000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"BQ","dialCode":"+599","nameRu":"Бонэйр, Синт-Эстатиус и Саба","nameEn":"Bonaire, Sint Eustatius and Saba","flagEmoji":"🇧🇶","maskPattern":"+000 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"BA","dialCode":"+387","nameRu":"Босния и Герцеговина","nameEn":"Bosnia and Herzegovina","flagEmoji":"🇧🇦","maskPattern":"+000 00 000-000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"BW","dialCode":"+267","nameRu":"Ботсвана","nameEn":"Botswana","flagEmoji":"🇧🇼","maskPattern":"+000 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"BR","dialCode":"+55","nameRu":"Бразилия","nameEn":"Brazil","flagEmoji":"🇧🇷","maskPattern":"+00 00 0000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"IO","dialCode":"+246","nameRu":"Британская территория в Индийском океане","nameEn":"British Indian Ocean Territory","flagEmoji":"🇮🇴","maskPattern":"+000 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"BN","dialCode":"+673","nameRu":"Бруней","nameEn":"Brunei Darussalam","flagEmoji":"🇧🇳","maskPattern":"+000 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"BF","dialCode":"+226","nameRu":"Буркина-Фасо","nameEn":"Burkina Faso","flagEmoji":"🇧🇫","maskPattern":"+000 00 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"BI","dialCode":"+257","nameRu":"Бурунди","nameEn":"Burundi","flagEmoji":"🇧🇮","maskPattern":"+000 00 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"BT","dialCode":"+975","nameRu":"Бутан","nameEn":"Bhutan","flagEmoji":"🇧🇹","maskPattern":"+000 0 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"VU","dialCode":"+678","nameRu":"Вануату","nameEn":"Vanuatu","flagEmoji":"🇻🇺","maskPattern":"+000 00000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"VA","dialCode":"+39","nameRu":"Ватикан","nameEn":"Holy See (Vatican City State)","flagEmoji":"🇻🇦","maskPattern":"+00 00 0000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"GB","dialCode":"+44","nameRu":"Великобритания","nameEn":"United Kingdom","flagEmoji":"🇬🇧","maskPattern":"+00 000 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"HU","dialCode":"+36","nameRu":"Венгрия","nameEn":"Hungary","flagEmoji":"🇭🇺","maskPattern":"+00 0 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"VE","dialCode":"+58","nameRu":"Венесуэла","nameEn":"Venezuela","flagEmoji":"🇻🇪","maskPattern":"+00 000-0000000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"VG","dialCode":"+1","nameRu":"Виргинские Острова (Великобритания)","nameEn":"Virgin Islands, British","flagEmoji":"🇻🇬","maskPattern":"+0 000-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"VI","dialCode":"+1","nameRu":"Виргинские Острова (США)","nameEn":"Virgin Islands, U.S.","flagEmoji":"🇻🇮","maskPattern":"+0 000-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"TL","dialCode":"+670","nameRu":"Восточный Тимор","nameEn":"Timor-Leste","flagEmoji":"🇹🇱","maskPattern":"+000 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"VN","dialCode":"+84","nameRu":"Вьетнам","nameEn":"Vietnam","flagEmoji":"🇻🇳","maskPattern":"+00 000 0000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"GA","dialCode":"+241","nameRu":"Габон","nameEn":"Gabon","flagEmoji":"🇬🇦","maskPattern":"+000 00 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"HT","dialCode":"+509","nameRu":"Гаити","nameEn":"Haiti","flagEmoji":"🇭🇹","maskPattern":"+000 00 00 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"GY","dialCode":"+592","nameRu":"Гайана","nameEn":"Guyana","flagEmoji":"🇬🇾","maskPattern":"+000 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"GM","dialCode":"+220","nameRu":"Гамбия","nameEn":"Republic of The Gambia","flagEmoji":"🇬🇲","maskPattern":"+000 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"GH","dialCode":"+233","nameRu":"Гана","nameEn":"Ghana","flagEmoji":"🇬🇭","maskPattern":"+000 00 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"GP","dialCode":"+590","nameRu":"Гваделупа","nameEn":"Guadeloupe","flagEmoji":"🇬🇵","maskPattern":"+000 000 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"GT","dialCode":"+502","nameRu":"Гватемала","nameEn":"Guatemala","flagEmoji":"🇬🇹","maskPattern":"+000 0000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"GF","dialCode":"+594","nameRu":"Гвиана","nameEn":"French Guiana","flagEmoji":"🇬🇫","maskPattern":"+000 000 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"GN","dialCode":"+224","nameRu":"Гвинея","nameEn":"Guinea","flagEmoji":"🇬🇳","maskPattern":"+000 00 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"GW","dialCode":"+245","nameRu":"Гвинея-Бисау","nameEn":"Guinea-Bissau","flagEmoji":"🇬🇼","maskPattern":"+000 000 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"DE","dialCode":"+49","nameRu":"Германия","nameEn":"Germany","flagEmoji":"🇩🇪","maskPattern":"+00 00 000000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"GG","dialCode":"+44","nameRu":"Гернси","nameEn":"Guernsey","flagEmoji":"🇬🇬","maskPattern":"+00 0000 000000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"GI","dialCode":"+350","nameRu":"Гибралтар","nameEn":"Gibraltar","flagEmoji":"🇬🇮","maskPattern":"+000 000 00000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"HN","dialCode":"+504","nameRu":"Гондурас","nameEn":"Honduras","flagEmoji":"🇭🇳","maskPattern":"+000 0000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"HK","dialCode":"+852","nameRu":"Гонконг","nameEn":"Hong Kong","flagEmoji":"🇭🇰","maskPattern":"+000 0000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"PS","dialCode":"+970","nameRu":"Государство Палестина","nameEn":"State of Palestine","flagEmoji":"🇵🇸","maskPattern":"+000 0 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"GD","dialCode":"+1","nameRu":"Гренада","nameEn":"Grenada","flagEmoji":"🇬🇩","maskPattern":"+0 000-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"GL","dialCode":"+299","nameRu":"Гренландия","nameEn":"Greenland","flagEmoji":"🇬🇱","maskPattern":"+000 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"GR","dialCode":"+30","nameRu":"Греция","nameEn":"Greece","flagEmoji":"🇬🇷","maskPattern":"+00 00 0000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"GE","dialCode":"+995","nameRu":"Грузия","nameEn":"Georgia","flagEmoji":"🇬🇪","maskPattern":"+000 00 000 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"GU","dialCode":"+1","nameRu":"Гуам","nameEn":"Guam","flagEmoji":"🇬🇺","maskPattern":"+0 000-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"DK","dialCode":"+45","nameRu":"Дания","nameEn":"Denmark","flagEmoji":"🇩🇰","maskPattern":"+00 00 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"CD","dialCode":"+243","nameRu":"Демократическая Республика Конго","nameEn":"Democratic Republic of the Congo","flagEmoji":"🇨🇩","maskPattern":"+000 00 00000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"JE","dialCode":"+44","nameRu":"Джерси","nameEn":"Jersey","flagEmoji":"🇯🇪","maskPattern":"+00 0000 000000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"DJ","dialCode":"+253","nameRu":"Джибути","nameEn":"Djibouti","flagEmoji":"🇩🇯","maskPattern":"+000 00 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"DM","dialCode":"+1","nameRu":"Доминика","nameEn":"Dominica","flagEmoji":"🇩🇲","maskPattern":"+0 000-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"DO","dialCode":"+1","nameRu":"Доминиканская Республика","nameEn":"Dominican Republic","flagEmoji":"🇩🇴","maskPattern":"+0 000-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"EG","dialCode":"+20","nameRu":"Египет","nameEn":"Egypt","flagEmoji":"🇪🇬","maskPattern":"+00 0 00000000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"ZM","dialCode":"+260","nameRu":"Замбия","nameEn":"Zambia","flagEmoji":"🇿🇲","maskPattern":"+000 000 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"ZW","dialCode":"+263","nameRu":"Зимбабве","nameEn":"Zimbabwe","flagEmoji":"🇿🇼","maskPattern":"+000 00 00000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"IL","dialCode":"+972","nameRu":"Израиль","nameEn":"Israel","flagEmoji":"🇮🇱","maskPattern":"+000 0-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"IN","dialCode":"+91","nameRu":"Индия","nameEn":"India","flagEmoji":"🇮🇳","maskPattern":"+00 00000 00000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"ID","dialCode":"+62","nameRu":"Индонезия","nameEn":"Indonesia","flagEmoji":"🇮🇩","maskPattern":"+00 00 0000000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"JO","dialCode":"+962","nameRu":"Иордания","nameEn":"Jordan","flagEmoji":"🇯🇴","maskPattern":"+000 0 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"IQ","dialCode":"+964","nameRu":"Ирак","nameEn":"Iraq","flagEmoji":"🇮🇶","maskPattern":"+000 0 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"IR","dialCode":"+98","nameRu":"Иран","nameEn":"Islamic Republic of Iran","flagEmoji":"🇮🇷","maskPattern":"+00 00 0000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"IE","dialCode":"+353","nameRu":"Ирландия","nameEn":"Ireland","flagEmoji":"🇮🇪","maskPattern":"+000 00 00000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"IS","dialCode":"+354","nameRu":"Исландия","nameEn":"Iceland","flagEmoji":"🇮🇸","maskPattern":"+000 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"ES","dialCode":"+34","nameRu":"Испания","nameEn":"Spain","flagEmoji":"🇪🇸","maskPattern":"+00 000 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"IT","dialCode":"+39","nameRu":"Италия","nameEn":"Italy","flagEmoji":"🇮🇹","maskPattern":"+00 00 0000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"YE","dialCode":"+967","nameRu":"Йемен","nameEn":"Yemen","flagEmoji":"🇾🇪","maskPattern":"+000 0 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"CV","dialCode":"+238","nameRu":"Кабо-Верде","nameEn":"Cape Verde","flagEmoji":"🇨🇻","maskPattern":"+000 000 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"KZ","dialCode":"+7","nameRu":"Казахстан","nameEn":"Kazakhstan","flagEmoji":"🇰🇿","maskPattern":"+0 00000 0 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"KH","dialCode":"+855","nameRu":"Камбоджа","nameEn":"Cambodia","flagEmoji":"🇰🇭","maskPattern":"+000 00 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"CM","dialCode":"+237","nameRu":"Камерун","nameEn":"Cameroon","flagEmoji":"🇨🇲","maskPattern":"+000 0 00 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"CA","dialCode":"+1","nameRu":"Канада","nameEn":"Canada","flagEmoji":"🇨🇦","maskPattern":"+0 000-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"QA","dialCode":"+974","nameRu":"Катар","nameEn":"Qatar","flagEmoji":"🇶🇦","maskPattern":"+000 0000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"KE","dialCode":"+254","nameRu":"Кения","nameEn":"Kenya","flagEmoji":"🇰🇪","maskPattern":"+000 00 0000000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"CY","dialCode":"+357","nameRu":"Кипр","nameEn":"Cyprus","flagEmoji":"🇨🇾","maskPattern":"+000 00 000000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"KG","dialCode":"+996","nameRu":"Киргизия","nameEn":"Kyrgyzstan","flagEmoji":"🇰🇬","maskPattern":"+000 000 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"KI","dialCode":"+686","nameRu":"Кирибати","nameEn":"Kiribati","flagEmoji":"🇰🇮","maskPattern":"+000 00000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"KP","dialCode":"+850","nameRu":"КНДР (Корейская Народно-Демократическая Республика)","nameEn":"North Korea","flagEmoji":"🇰🇵","maskPattern":"+000 0 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"CN","dialCode":"+86","nameRu":"КНР (Китайская Народная Республика)","nameEn":"People\'s Republic of China","flagEmoji":"🇨🇳","maskPattern":"+00 00 0000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"CC","dialCode":"+61","nameRu":"Кокосовые острова","nameEn":"Cocos (Keeling) Islands","flagEmoji":"🇨🇨","maskPattern":"+00 0 0000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"CO","dialCode":"+57","nameRu":"Колумбия","nameEn":"Colombia","flagEmoji":"🇨🇴","maskPattern":"+00 000 0000000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"KM","dialCode":"+269","nameRu":"Коморы","nameEn":"Comoros","flagEmoji":"🇰🇲","maskPattern":"+000 000 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"XK","dialCode":"+383","nameRu":"Косово","nameEn":"Kosovo","flagEmoji":"🇽🇰","maskPattern":"+000 00 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"CR","dialCode":"+506","nameRu":"Коста-Рика","nameEn":"Costa Rica","flagEmoji":"🇨🇷","maskPattern":"+000 0000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"CI","dialCode":"+225","nameRu":"Кот-д’Ивуар","nameEn":"Cote d\'Ivoire","flagEmoji":"🇨🇮","maskPattern":"+000 00 00 0 00000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"CU","dialCode":"+53","nameRu":"Куба","nameEn":"Cuba","flagEmoji":"🇨🇺","maskPattern":"+00 0 0000000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"KW","dialCode":"+965","nameRu":"Кувейт","nameEn":"Kuwait","flagEmoji":"🇰🇼","maskPattern":"+000 0000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"CW","dialCode":"+599","nameRu":"Кюрасао","nameEn":"Curaçao","flagEmoji":"🇨🇼","maskPattern":"+000 0 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"LA","dialCode":"+856","nameRu":"Лаос","nameEn":"Lao People\'s Democratic Republic","flagEmoji":"🇱🇦","maskPattern":"+000 00 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"LV","dialCode":"+371","nameRu":"Латвия","nameEn":"Latvia","flagEmoji":"🇱🇻","maskPattern":"+000 00 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"LS","dialCode":"+266","nameRu":"Лесото","nameEn":"Lesotho","flagEmoji":"🇱🇸","maskPattern":"+000 0000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"LR","dialCode":"+231","nameRu":"Либерия","nameEn":"Liberia","flagEmoji":"🇱🇷","maskPattern":"+000 00 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"LB","dialCode":"+961","nameRu":"Ливан","nameEn":"Lebanon","flagEmoji":"🇱🇧","maskPattern":"+000 0 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"LY","dialCode":"+218","nameRu":"Ливия","nameEn":"Libya","flagEmoji":"🇱🇾","maskPattern":"+000 00-0000000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"LT","dialCode":"+370","nameRu":"Литва","nameEn":"Lithuania","flagEmoji":"🇱🇹","maskPattern":"+000 000 00000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"LI","dialCode":"+423","nameRu":"Лихтенштейн","nameEn":"Liechtenstein","flagEmoji":"🇱🇮","maskPattern":"+000 000 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"LU","dialCode":"+352","nameRu":"Люксембург","nameEn":"Luxembourg","flagEmoji":"🇱🇺","maskPattern":"+000 00 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"MU","dialCode":"+230","nameRu":"Маврикий","nameEn":"Mauritius","flagEmoji":"🇲🇺","maskPattern":"+000 0000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"MR","dialCode":"+222","nameRu":"Мавритания","nameEn":"Mauritania","flagEmoji":"🇲🇷","maskPattern":"+000 00 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"MG","dialCode":"+261","nameRu":"Мадагаскар","nameEn":"Madagascar","flagEmoji":"🇲🇬","maskPattern":"+000 00 00 000 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"YT","dialCode":"+262","nameRu":"Майотта","nameEn":"Mayotte","flagEmoji":"🇾🇹","maskPattern":"+000 000 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"MO","dialCode":"+853","nameRu":"Макао","nameEn":"Macao","flagEmoji":"🇲🇴","maskPattern":"+000 0000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"MW","dialCode":"+265","nameRu":"Малави","nameEn":"Malawi","flagEmoji":"🇲🇼","maskPattern":"+000 0 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"MY","dialCode":"+60","nameRu":"Малайзия","nameEn":"Malaysia","flagEmoji":"🇲🇾","maskPattern":"+00 0-0000 0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"ML","dialCode":"+223","nameRu":"Мали","nameEn":"Mali","flagEmoji":"🇲🇱","maskPattern":"+000 00 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"MV","dialCode":"+960","nameRu":"Мальдивы","nameEn":"Maldives","flagEmoji":"🇲🇻","maskPattern":"+000 000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"MT","dialCode":"+356","nameRu":"Мальта","nameEn":"Malta","flagEmoji":"🇲🇹","maskPattern":"+000 0000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"MA","dialCode":"+212","nameRu":"Марокко","nameEn":"Morocco","flagEmoji":"🇲🇦","maskPattern":"+000 0 00 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"MQ","dialCode":"+596","nameRu":"Мартиника","nameEn":"Martinique","flagEmoji":"🇲🇶","maskPattern":"+000 000 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"MH","dialCode":"+692","nameRu":"Маршалловы Острова","nameEn":"Marshall Islands","flagEmoji":"🇲🇭","maskPattern":"+000 000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"MX","dialCode":"+52","nameRu":"Мексика","nameEn":"Mexico","flagEmoji":"🇲🇽","maskPattern":"+00 000 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"FM","dialCode":"+691","nameRu":"Микронезия","nameEn":"Micronesia, Federated States of","flagEmoji":"🇫🇲","maskPattern":"+000 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"MZ","dialCode":"+258","nameRu":"Мозамбик","nameEn":"Mozambique","flagEmoji":"🇲🇿","maskPattern":"+000 00 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"MD","dialCode":"+373","nameRu":"Молдавия","nameEn":"Moldova, Republic of","flagEmoji":"🇲🇩","maskPattern":"+000 00 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"MC","dialCode":"+377","nameRu":"Монако","nameEn":"Monaco","flagEmoji":"🇲🇨","maskPattern":"+000 00 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"MN","dialCode":"+976","nameRu":"Монголия","nameEn":"Mongolia","flagEmoji":"🇲🇳","maskPattern":"+000 0000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"MS","dialCode":"+1","nameRu":"Монтсеррат","nameEn":"Montserrat","flagEmoji":"🇲🇸","maskPattern":"+0 000-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"MM","dialCode":"+95","nameRu":"Мьянма","nameEn":"Myanmar","flagEmoji":"🇲🇲","maskPattern":"+00 0 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"NA","dialCode":"+264","nameRu":"Намибия","nameEn":"Namibia","flagEmoji":"🇳🇦","maskPattern":"+000 00 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"NR","dialCode":"+674","nameRu":"Науру","nameEn":"Nauru","flagEmoji":"🇳🇷","maskPattern":"+000 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"NP","dialCode":"+977","nameRu":"Непал","nameEn":"Nepal","flagEmoji":"🇳🇵","maskPattern":"+000 0-0000000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"NE","dialCode":"+227","nameRu":"Нигер","nameEn":"Niger","flagEmoji":"🇳🇪","maskPattern":"+000 00 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"NG","dialCode":"+234","nameRu":"Нигерия","nameEn":"Nigeria","flagEmoji":"🇳🇬","maskPattern":"+000 0000 00 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"NL","dialCode":"+31","nameRu":"Нидерланды","nameEn":"Netherlands","flagEmoji":"🇳🇱","maskPattern":"+00 00 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"NI","dialCode":"+505","nameRu":"Никарагуа","nameEn":"Nicaragua","flagEmoji":"🇳🇮","maskPattern":"+000 0000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"NU","dialCode":"+683","nameRu":"Ниуэ","nameEn":"Niue","flagEmoji":"🇳🇺","maskPattern":"+000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"NZ","dialCode":"+64","nameRu":"Новая Зеландия","nameEn":"New Zealand","flagEmoji":"🇳🇿","maskPattern":"+00 0 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"NC","dialCode":"+687","nameRu":"Новая Каледония","nameEn":"New Caledonia","flagEmoji":"🇳🇨","maskPattern":"+000 00.00.00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"NO","dialCode":"+47","nameRu":"Норвегия","nameEn":"Norway","flagEmoji":"🇳🇴","maskPattern":"+00 00 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"AE","dialCode":"+971","nameRu":"ОАЭ","nameEn":"United Arab Emirates","flagEmoji":"🇦🇪","maskPattern":"+000 0 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"OM","dialCode":"+968","nameRu":"Оман","nameEn":"Oman","flagEmoji":"🇴🇲","maskPattern":"+000 00 000000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"IM","dialCode":"+44","nameRu":"Остров Мэн","nameEn":"Isle of Man","flagEmoji":"🇮🇲","maskPattern":"+00 0000 000000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"NF","dialCode":"+672","nameRu":"Остров Норфолк","nameEn":"Norfolk Island","flagEmoji":"🇳🇫","maskPattern":"+000 00 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"CX","dialCode":"+61","nameRu":"Остров Рождества","nameEn":"Christmas Island","flagEmoji":"🇨🇽","maskPattern":"+00 0 0000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"KY","dialCode":"+1","nameRu":"Острова Кайман","nameEn":"Cayman Islands","flagEmoji":"🇰🇾","maskPattern":"+0 000-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"CK","dialCode":"+682","nameRu":"Острова Кука","nameEn":"Cook Islands","flagEmoji":"🇨🇰","maskPattern":"+000 00 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"SH","dialCode":"+290","nameRu":"Острова Святой Елены, Вознесения и Тристан-да-Кунья","nameEn":"Saint Helena","flagEmoji":"🇸🇭","maskPattern":"+000 00000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"PK","dialCode":"+92","nameRu":"Пакистан","nameEn":"Pakistan","flagEmoji":"🇵🇰","maskPattern":"+00 00 00000000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"PW","dialCode":"+680","nameRu":"Палау","nameEn":"Palau","flagEmoji":"🇵🇼","maskPattern":"+000 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"PA","dialCode":"+507","nameRu":"Панама","nameEn":"Panama","flagEmoji":"🇵🇦","maskPattern":"+000 000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"PG","dialCode":"+675","nameRu":"Папуа — Новая Гвинея","nameEn":"Papua New Guinea","flagEmoji":"🇵🇬","maskPattern":"+000 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"PY","dialCode":"+595","nameRu":"Парагвай","nameEn":"Paraguay","flagEmoji":"🇵🇾","maskPattern":"+000 00 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"PE","dialCode":"+51","nameRu":"Перу","nameEn":"Peru","flagEmoji":"🇵🇪","maskPattern":"+00 0 0000000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"PL","dialCode":"+48","nameRu":"Польша","nameEn":"Poland","flagEmoji":"🇵🇱","maskPattern":"+00 00 000 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"PT","dialCode":"+351","nameRu":"Португалия","nameEn":"Portugal","flagEmoji":"🇵🇹","maskPattern":"+000 00 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"PR","dialCode":"+1","nameRu":"Пуэрто-Рико","nameEn":"Puerto Rico","flagEmoji":"🇵🇷","maskPattern":"+0 000-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"CG","dialCode":"+242","nameRu":"Республика Конго","nameEn":"Republic of the Congo","flagEmoji":"🇨🇬","maskPattern":"+000 00 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"KR","dialCode":"+82","nameRu":"Республика Корея","nameEn":"South Korea","flagEmoji":"🇰🇷","maskPattern":"+00 0-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"RE","dialCode":"+262","nameRu":"Реюньон","nameEn":"Reunion","flagEmoji":"🇷🇪","maskPattern":"+000 000 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"RU","dialCode":"+7","nameRu":"Российская Федерация","nameEn":"Russian Federation","flagEmoji":"🇷🇺","maskPattern":"+0 000 000-00-00","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"RW","dialCode":"+250","nameRu":"Руанда","nameEn":"Rwanda","flagEmoji":"🇷🇼","maskPattern":"+000 000 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"RO","dialCode":"+40","nameRu":"Румыния","nameEn":"Romania","flagEmoji":"🇷🇴","maskPattern":"+00 00 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"EH","dialCode":"+212","nameRu":"САДР","nameEn":"Western Sahara","flagEmoji":"🇪🇭","maskPattern":"+000 0 00 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"SV","dialCode":"+503","nameRu":"Сальвадор","nameEn":"El Salvador","flagEmoji":"🇸🇻","maskPattern":"+000 0000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"WS","dialCode":"+685","nameRu":"Самоа","nameEn":"Samoa","flagEmoji":"🇼🇸","maskPattern":"+000 00000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"SM","dialCode":"+378","nameRu":"Сан-Марино","nameEn":"San Marino","flagEmoji":"🇸🇲","maskPattern":"+000 0000 000000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"ST","dialCode":"+239","nameRu":"Сан-Томе и Принсипи","nameEn":"Sao Tome and Principe","flagEmoji":"🇸🇹","maskPattern":"+000 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"SA","dialCode":"+966","nameRu":"Саудовская Аравия","nameEn":"Saudi Arabia","flagEmoji":"🇸🇦","maskPattern":"+000 00 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"MK","dialCode":"+389","nameRu":"Северная Македония","nameEn":"The Republic of North Macedonia","flagEmoji":"🇲🇰","maskPattern":"+000 0 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"MP","dialCode":"+1","nameRu":"Северные Марианские Острова","nameEn":"Northern Mariana Islands","flagEmoji":"🇲🇵","maskPattern":"+0 000-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"SC","dialCode":"+248","nameRu":"Сейшельские Острова","nameEn":"Seychelles","flagEmoji":"🇸🇨","maskPattern":"+000 0 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"BL","dialCode":"+590","nameRu":"Сен-Бартелеми","nameEn":"Saint Barthélemy","flagEmoji":"🇧🇱","maskPattern":"+000 000 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"MF","dialCode":"+590","nameRu":"Сен-Мартен","nameEn":"Saint Martin (French part)","flagEmoji":"🇲🇫","maskPattern":"+000 000 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"PM","dialCode":"+508","nameRu":"Сен-Пьер и Микелон","nameEn":"Saint Pierre and Miquelon","flagEmoji":"🇵🇲","maskPattern":"+000 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"SN","dialCode":"+221","nameRu":"Сенегал","nameEn":"Senegal","flagEmoji":"🇸🇳","maskPattern":"+000 00 000 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"VC","dialCode":"+1","nameRu":"Сент-Винсент и Гренадины","nameEn":"Saint Vincent and the Grenadines","flagEmoji":"🇻🇨","maskPattern":"+0 000-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"KN","dialCode":"+1","nameRu":"Сент-Китс и Невис","nameEn":"Saint Kitts and Nevis","flagEmoji":"🇰🇳","maskPattern":"+0 000-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"LC","dialCode":"+1","nameRu":"Сент-Люсия","nameEn":"Saint Lucia","flagEmoji":"🇱🇨","maskPattern":"+0 000-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"RS","dialCode":"+381","nameRu":"Сербия","nameEn":"Serbia","flagEmoji":"🇷🇸","maskPattern":"+000 00 000000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"SG","dialCode":"+65","nameRu":"Сингапур","nameEn":"Singapore","flagEmoji":"🇸🇬","maskPattern":"+00 0000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"SX","dialCode":"+1","nameRu":"Синт-Мартен","nameEn":"Sint Maarten (Dutch part)","flagEmoji":"🇸🇽","maskPattern":"+0 000-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"SY","dialCode":"+963","nameRu":"Сирия","nameEn":"Syrian Arab Republic","flagEmoji":"🇸🇾","maskPattern":"+000 00 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"SK","dialCode":"+421","nameRu":"Словакия","nameEn":"Slovakia","flagEmoji":"🇸🇰","maskPattern":"+000 0/000 000 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"SI","dialCode":"+386","nameRu":"Словения","nameEn":"Slovenia","flagEmoji":"🇸🇮","maskPattern":"+000 0 000 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"SB","dialCode":"+677","nameRu":"Соломоновы Острова","nameEn":"Solomon Islands","flagEmoji":"🇸🇧","maskPattern":"+000 00000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"SO","dialCode":"+252","nameRu":"Сомали","nameEn":"Somalia","flagEmoji":"🇸🇴","maskPattern":"+000 0 000000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"SD","dialCode":"+249","nameRu":"Судан","nameEn":"Sudan","flagEmoji":"🇸🇩","maskPattern":"+000 00 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"SR","dialCode":"+597","nameRu":"Суринам","nameEn":"Suriname","flagEmoji":"🇸🇷","maskPattern":"+000 000-000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"US","dialCode":"+1","nameRu":"США","nameEn":"United States of America","flagEmoji":"🇺🇸","maskPattern":"+0 000-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"SL","dialCode":"+232","nameRu":"Сьерра-Леоне","nameEn":"Sierra Leone","flagEmoji":"🇸🇱","maskPattern":"+000 00 000000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"TJ","dialCode":"+992","nameRu":"Таджикистан","nameEn":"Tajikistan","flagEmoji":"🇹🇯","maskPattern":"+000 000 00 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"TH","dialCode":"+66","nameRu":"Таиланд","nameEn":"Thailand","flagEmoji":"🇹🇭","maskPattern":"+00 0 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"TW","dialCode":"+886","nameRu":"Тайвань","nameEn":"Taiwan, Province of China","flagEmoji":"🇹🇼","maskPattern":"+000 0 0000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"TZ","dialCode":"+255","nameRu":"Танзания","nameEn":"United Republic of Tanzania","flagEmoji":"🇹🇿","maskPattern":"+000 00 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"TC","dialCode":"+1","nameRu":"Теркс и Кайкос","nameEn":"Turks and Caicos Islands","flagEmoji":"🇹🇨","maskPattern":"+0 000-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"TG","dialCode":"+228","nameRu":"Того","nameEn":"Togo","flagEmoji":"🇹🇬","maskPattern":"+000 00 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"TK","dialCode":"+690","nameRu":"Токелау","nameEn":"Tokelau","flagEmoji":"🇹🇰","maskPattern":"+000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"TO","dialCode":"+676","nameRu":"Тонга","nameEn":"Tonga","flagEmoji":"🇹🇴","maskPattern":"+000 00-000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"TT","dialCode":"+1","nameRu":"Тринидад и Тобаго","nameEn":"Trinidad and Tobago","flagEmoji":"🇹🇹","maskPattern":"+0 000-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"TV","dialCode":"+688","nameRu":"Тувалу","nameEn":"Tuvalu","flagEmoji":"🇹🇻","maskPattern":"+000 00 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"TN","dialCode":"+216","nameRu":"Тунис","nameEn":"Tunisia","flagEmoji":"🇹🇳","maskPattern":"+000 00 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"TM","dialCode":"+993","nameRu":"Туркмения","nameEn":"Turkmenistan","flagEmoji":"🇹🇲","maskPattern":"+000 00 00-00-00","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"TR","dialCode":"+90","nameRu":"Турция","nameEn":"Türkiye","flagEmoji":"🇹🇷","maskPattern":"+00 000 000 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"UG","dialCode":"+256","nameRu":"Уганда","nameEn":"Uganda","flagEmoji":"🇺🇬","maskPattern":"+000 00 0000000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"UZ","dialCode":"+998","nameRu":"Узбекистан","nameEn":"Uzbekistan","flagEmoji":"🇺🇿","maskPattern":"+000 00 000 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"UA","dialCode":"+380","nameRu":"Украина","nameEn":"Ukraine","flagEmoji":"🇺🇦","maskPattern":"+000 0000 00000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"WF","dialCode":"+681","nameRu":"Уоллис и Футуна","nameEn":"Wallis and Futuna","flagEmoji":"🇼🇫","maskPattern":"+000 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"UY","dialCode":"+598","nameRu":"Уругвай","nameEn":"Uruguay","flagEmoji":"🇺🇾","maskPattern":"+000 0000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"FO","dialCode":"+298","nameRu":"Фареры","nameEn":"Faroe Islands","flagEmoji":"🇫🇴","maskPattern":"+000 000000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"FJ","dialCode":"+679","nameRu":"Фиджи","nameEn":"Fiji","flagEmoji":"🇫🇯","maskPattern":"+000 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"PH","dialCode":"+63","nameRu":"Филиппины","nameEn":"Philippines","flagEmoji":"🇵🇭","maskPattern":"+00 0 0000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"FI","dialCode":"+358","nameRu":"Финляндия","nameEn":"Finland","flagEmoji":"🇫🇮","maskPattern":"+000 00 0000000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"FK","dialCode":"+500","nameRu":"Фолклендские острова","nameEn":"Falkland Islands (Malvinas)","flagEmoji":"🇫🇰","maskPattern":"+000 00000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"FR","dialCode":"+33","nameRu":"Франция","nameEn":"France","flagEmoji":"🇫🇷","maskPattern":"+00 0 00 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"PF","dialCode":"+689","nameRu":"Французская Полинезия","nameEn":"French Polynesia","flagEmoji":"🇵🇫","maskPattern":"+000 00 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"HR","dialCode":"+385","nameRu":"Хорватия","nameEn":"Croatia","flagEmoji":"🇭🇷","maskPattern":"+000 0 0000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"CF","dialCode":"+236","nameRu":"ЦАР","nameEn":"Central African Republic","flagEmoji":"🇨🇫","maskPattern":"+000 00 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"TD","dialCode":"+235","nameRu":"Чад","nameEn":"Chad","flagEmoji":"🇹🇩","maskPattern":"+000 00 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"ME","dialCode":"+382","nameRu":"Черногория","nameEn":"Montenegro","flagEmoji":"🇲🇪","maskPattern":"+000 00 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"CZ","dialCode":"+420","nameRu":"Чехия","nameEn":"Czech Republic","flagEmoji":"🇨🇿","maskPattern":"+000 000 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"CL","dialCode":"+56","nameRu":"Чили","nameEn":"Chile","flagEmoji":"🇨🇱","maskPattern":"+00 000 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"CH","dialCode":"+41","nameRu":"Швейцария","nameEn":"Switzerland","flagEmoji":"🇨🇭","maskPattern":"+00 00 000 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"SE","dialCode":"+46","nameRu":"Швеция","nameEn":"Sweden","flagEmoji":"🇸🇪","maskPattern":"+00 0 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"SJ","dialCode":"+47","nameRu":"Шпицберген и Ян-Майен","nameEn":"Svalbard and Jan Mayen","flagEmoji":"🇸🇯","maskPattern":"+00 00 00 00 00","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"LK","dialCode":"+94","nameRu":"Шри-Ланка","nameEn":"Sri Lanka","flagEmoji":"🇱🇰","maskPattern":"+00 000 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"EC","dialCode":"+593","nameRu":"Эквадор","nameEn":"Ecuador","flagEmoji":"🇪🇨","maskPattern":"+000 0-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"GQ","dialCode":"+240","nameRu":"Экваториальная Гвинея","nameEn":"Equatorial Guinea","flagEmoji":"🇬🇶","maskPattern":"+000 000 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"ER","dialCode":"+291","nameRu":"Эритрея","nameEn":"Eritrea","flagEmoji":"🇪🇷","maskPattern":"+000 0 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"SZ","dialCode":"+268","nameRu":"Эсватини","nameEn":"Eswatini","flagEmoji":"🇸🇿","maskPattern":"+000 0000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"EE","dialCode":"+372","nameRu":"Эстония","nameEn":"Estonia","flagEmoji":"🇪🇪","maskPattern":"+000 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"ET","dialCode":"+251","nameRu":"Эфиопия","nameEn":"Ethiopia","flagEmoji":"🇪🇹","maskPattern":"+000 00 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"ZA","dialCode":"+27","nameRu":"ЮАР","nameEn":"South Africa","flagEmoji":"🇿🇦","maskPattern":"+00 00 000 0000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"SS","dialCode":"+211","nameRu":"Южный Судан","nameEn":"South Sudan","flagEmoji":"🇸🇸","maskPattern":"+000 000 000 000","maskHasParentheses":false,"maskHasHyphen":false},{"iso2":"JM","dialCode":"+1","nameRu":"Ямайка","nameEn":"Jamaica","flagEmoji":"🇯🇲","maskPattern":"+0 000-000-0000","maskHasParentheses":false,"maskHasHyphen":true},{"iso2":"JP","dialCode":"+81","nameRu":"Япония","nameEn":"Japan","flagEmoji":"🇯🇵","maskPattern":"+00 0-0000-0000","maskHasParentheses":false,"maskHasHyphen":true}]}');

/***/ },

/***/ "8c672a55a76a"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{".sf-country-code":["display/flex (.flex)","flex-direction/column (.flex-col)","flex-wrap/nowrap (.flex-nowrap)","gap/var(--sf-space-1\\\\/4)","justify-content/flex-start (.justify-start)"],".sf-country-code .sf-country-code-label":["display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","gap/var(--sf-space-1\\\\/4)","justify-content/flex-start (.justify-start)","align-items/flex-start (.items-start)"],".sf-country-code .sf-country-code-field":["display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","justify-content/flex-start (.justify-start)","align-items/center (.items-center)"],".sf-country-code .sf-country-code-left":["display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","justify-content/flex-start (.justify-start)","align-items/center (.items-center)"],".sf-country-code .sf-country-code-field input":["flex/1 (.flex-1)","display/flex (.flex)"],".sf-country-code .sf-country-code-items":["gap/var(--sf-country-code-items--gap)"],".sf-country-code .sf-country-code-item":["display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","gap/var(--sf-space-1\\\\/3)","justify-content/flex-start (.justify-start)","align-items/center (.items-center)"],".sf-country-code .sf-country-code-flag":["display/flex (.flex)","justify-content/flex-start (.justify-start)","align-items/center (.items-center)"],".sf-country-code.open .sf-country-code-list":["flex/1 (.flex-1)","display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","justify-content/flex-start (.justify-start)","align-items/flex-start (.items-start)"],".sf-country-code.open .sf-country-code-items":["flex/1 (.flex-1)","display/flex (.flex)","flex-direction/column (.flex-col)","flex-wrap/nowrap (.flex-nowrap)","justify-content/flex-start (.justify-start)","align-items/flex-start (.items-start)"],".sf-country-code.sf-country-code--size-1.open .sf-country-code-list":["flex/1 (.flex-1)","display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","justify-content/flex-start (.justify-start)","align-items/flex-start (.items-start)"],".sf-country-code.sf-country-code--size-1.open .sf-country-code-items":["flex/1 (.flex-1)","display/flex (.flex)","flex-direction/column (.flex-col)","flex-wrap/nowrap (.flex-nowrap)","justify-content/flex-start (.justify-start)","align-items/flex-start (.items-start)"],".sf-country-code.sf-country-code--size-2.open .sf-country-code-list":["flex/1 (.flex-1)","display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","justify-content/flex-start (.justify-start)","align-items/flex-start (.items-start)"],".sf-country-code.sf-country-code--size-2.open .sf-country-code-items":["flex/1 (.flex-1)","display/flex (.flex)","flex-direction/column (.flex-col)","flex-wrap/nowrap (.flex-nowrap)","justify-content/flex-start (.justify-start)","align-items/flex-start (.items-start)"],".sf-country-code.sf-country-code--size-3.open .sf-country-code-list":["flex/1 (.flex-1)","display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","justify-content/flex-start (.justify-start)","align-items/flex-start (.items-start)"],".sf-country-code.sf-country-code--size-3.open .sf-country-code-items":["flex/1 (.flex-1)","display/flex (.flex)","flex-direction/column (.flex-col)","flex-wrap/nowrap (.flex-nowrap)","justify-content/flex-start (.justify-start)","align-items/flex-start (.items-start)"],".sf-country-code.sf-country-code--size-1\\\\/3.open .sf-country-code-list":["flex/1 (.flex-1)","display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","justify-content/flex-start (.justify-start)","align-items/flex-start (.items-start)"],".sf-country-code.sf-country-code--size-1\\\\/3.open .sf-country-code-items":["flex/1 (.flex-1)","display/flex (.flex)","flex-direction/column (.flex-col)","flex-wrap/nowrap (.flex-nowrap)","justify-content/flex-start (.justify-start)","align-items/flex-start (.items-start)"],".sf-country-code.sf-country-code--size-1\\\\/2.open .sf-country-code-list":["flex/1 (.flex-1)","display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","justify-content/flex-start (.justify-start)","align-items/flex-start (.items-start)"],".sf-country-code.sf-country-code--size-1\\\\/2.open .sf-country-code-items":["flex/1 (.flex-1)","display/flex (.flex)","flex-direction/column (.flex-col)","flex-wrap/nowrap (.flex-nowrap)","justify-content/flex-start (.justify-start)","align-items/flex-start (.items-start)"]}');

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