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




const COUNTRY_CODE_SELECTOR = '.sf-country-code';
const COUNTRY_CODE_BOUND_FLAG = 'sfCountryCodeBound';
const COUNTRY_ITEMS = Array.isArray(_data_countries_json__WEBPACK_IMPORTED_MODULE_3__?.items) ? _data_countries_json__WEBPACK_IMPORTED_MODULE_3__.items : [];
let flagObserver = null;

function toBoolean(value, fallback = false) {
  if (value === undefined || value === null || value === '') return fallback;
  if (typeof value === 'boolean') return value;
  return ['1', 'true', 'yes', 'on', 'active', 'open', 'disabled'].includes(String(value).toLowerCase());
}

function normalizeIso2(value) {
  return String(value || '').trim().toUpperCase();
}

function resolveDefaultFlagBase() {
  const base = String(window.sfPath || '').replace(/\/$/, '');
  if (!base) return '';
  return `${base}/component/country-code/flags/svg`;
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
    node.classList.remove('open');
  });
}

function setOpenState(root, open) {
  if (!root) return;
  if (open) root.classList.add('open');else root.classList.remove('open');
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
  const name = locale === 'en' ? country.nameEn : country.nameRu || country.nameEn;
  return `${name} (${country.dialCode})`;
}

function normalizeCountriesList(countries, locale = 'ru', maxItems = 0) {
  let items = Array.isArray(countries) && countries.length ? countries : COUNTRY_ITEMS;

  if (Number(maxItems) > 0) {
    items = items.slice(0, Number(maxItems));
  }

  return items.map(country => ({ ...country,
    iso2: normalizeIso2(country.iso2),
    dialCode: String(country.dialCode || country.code || '').trim(),
    label: country.label || getCountryLabel(country, locale)
  }));
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
    item.classList.add('sf-country-code-item', 'flex', 'items-center', 'transition', 'radius-default');
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
  if (!list || !itemsWrap || visibleItems <= 0) return;
  const items = Array.from(itemsWrap.querySelectorAll('.sf-country-code-item'));
  if (!items.length) return;
  const firstItem = items[0];
  const itemHeight = firstItem.getBoundingClientRect().height;
  if (!itemHeight) return;
  const wrapStyle = window.getComputedStyle(itemsWrap);
  const gap = Number.parseFloat(wrapStyle.rowGap || '') || Number.parseFloat(wrapStyle.gap || '') || 0;
  const paddingTop = Number.parseFloat(wrapStyle.paddingTop || '') || 0;
  const paddingBottom = Number.parseFloat(wrapStyle.paddingBottom || '') || 0;
  const visibleCount = Math.min(visibleItems, items.length);
  const totalHeight = visibleCount * itemHeight + (visibleCount - 1) * gap + paddingTop + paddingBottom;
  list.style.overflow = 'hidden';
  itemsWrap.style.maxHeight = `${Math.ceil(totalHeight)}px`;
  itemsWrap.style.overflowY = 'auto';
  itemsWrap.style.overflowX = 'hidden';
}

async function applyMaskForRoot(root, input, maskPattern, config = null) {
  if (!input) return;

  if (root.__sfCountryMask) {
    window.SF?.Mask?.destroy?.(root.__sfCountryMask);
    delete root.__sfCountryMask;
  }

  if (!maskPattern) return;
  if (!window.SF?.Mask?.create) return;
  const current = input.value;
  root.__sfCountryMaskToken = (root.__sfCountryMaskToken || 0) + 1;
  const token = root.__sfCountryMaskToken;

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
  } catch (error) {
    console.warn('SF.CountryCode mask init failed', error);
  }
}

function resolveInitialCountry(config) {
  if (config.defaultIso2) {
    const byIso = getCountryByIso2(config.defaultIso2);
    if (byIso) return byIso;
  }

  if (config.fixedDialCode) {
    const byDial = getCountryByDialCode(config.fixedDialCode);
    if (byDial) return byDial;
  }

  return COUNTRY_ITEMS[0] || null;
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
    const localPart = extractLocalPart(input.value, previousDialCode);
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
}

function bindCountryCode(root) {
  if (!root || root.dataset[COUNTRY_CODE_BOUND_FLAG] === '1') return;
  const {
    input,
    toggle,
    leftFlag
  } = getNodes(root);
  if (!input) return;
  const config = resolveConfig(root, input);
  root.__sfCountryConfig = config;
  renderDatasetItems(root, config);
  applyDropdownViewport(root, 8);
  const nodes = getNodes(root);
  const items = nodes.items;

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

  const initialCountry = resolveInitialCountry(config);

  if (initialCountry) {
    applyCountrySelection(root, initialCountry, 'init');
  } else if (leftFlag) {
    leftFlag.textContent = '';
  }

  const onToggleClick = event => {
    event.preventDefault();
    if (!config.multiCountry || root.classList.contains('disabled')) return;
    const willOpen = !root.classList.contains('open');
    closeAllCountryCodes(root);
    setOpenState(root, willOpen);

    if (willOpen) {
      applyDropdownViewport(root, 8);
      prefetchVisibleFlags(root);
    }
  };

  const onToggleKeydown = event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onToggleClick(event);
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
    const item = event.currentTarget;
    const iso2 = item.dataset.iso2 || '';
    const byIso = getCountryByIso2(iso2);
    const byDial = getCountryByDialCode(item.dataset.code || '');
    const selected = byIso || byDial;
    if (!selected) return;
    applyCountrySelection(root, selected, 'item');
    setOpenState(root, false);
  };

  const onInput = () => {
    enforceDialCodePrefix(root, input, config);
    keepCaretAfterPrefix(input, getLockedPrefix(root, config));
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
  items.forEach(item => item.addEventListener('click', onItemClick));
  document.addEventListener('click', onDocumentClick);
  root.__sfCountryCodeToggleClick = onToggleClick;
  root.__sfCountryCodeToggleKeydown = onToggleKeydown;
  root.__sfCountryCodeDocClick = onDocumentClick;
  root.__sfCountryCodeItemClick = onItemClick;
  root.__sfCountryCodeInput = onInput;
  root.__sfCountryCodePaste = onPaste;
  root.__sfCountryCodeInputKeydown = onKeydownInput;
  root.dataset[COUNTRY_CODE_BOUND_FLAG] = '1';
  syncDisabledState(root);
}

function unbindCountryCode(root) {
  if (!root || root.dataset[COUNTRY_CODE_BOUND_FLAG] !== '1') return;
  const {
    input,
    toggle,
    items
  } = getNodes(root);

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
    if (root.__sfCountryCodeItemClick) {
      item.removeEventListener('click', root.__sfCountryCodeItemClick);
    }
  });

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
  delete root.__sfCountryCodeInput;
  delete root.__sfCountryCodePaste;
  delete root.__sfCountryCodeInputKeydown;
  delete root.__sfCountryMask;
  delete root.__sfCountryMaskToken;
  delete root.__sfCountrySelected;
  delete root.__sfCountryConfig;
  delete root.dataset[COUNTRY_CODE_BOUND_FLAG];
}

function initExistingCountryCodes(target = document) {
  target.querySelectorAll(COUNTRY_CODE_SELECTOR).forEach(bindCountryCode);
}

function setCountryCodeState(target, state = {}) {
  const root = target instanceof HTMLElement ? target.closest(COUNTRY_CODE_SELECTOR) || target : null;
  if (!root) return false;
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
    const country = getCountryByIso2(state.iso2);
    if (country) applyCountrySelection(root, country, 'state');
  }

  if (Object.prototype.hasOwnProperty.call(state, 'dialCode')) {
    const country = getCountryByDialCode(state.dialCode);
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
    input.type = 'text';
    input.value = String(value ?? '');
    input.placeholder = String(placeholder ?? '');
    input.disabled = toBoolean(disabled, false);
    field.append(left, input);
    this.template.append(labelWrap, field);
    const sourceCountries = Array.isArray(countries) && countries.length ? countries : COUNTRY_ITEMS.slice(0, Number(maxItems) > 0 ? Number(maxItems) : undefined);

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

        if (country?.maskPattern) item.dataset.maskPattern = String(country.maskPattern);
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
    bindCountryCode(this.template);
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
    mutation.addedNodes.forEach(node => {
      if (!(node instanceof Element)) return;

      if (node.matches?.(COUNTRY_CODE_SELECTOR)) {
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
          classes.add(cls.replace(/^\./, ''));
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

module.exports = /*#__PURE__*/JSON.parse('{".sf-country-code":["display/flex (.flex)","flex-direction/column (.flex-col)","flex-wrap/nowrap (.flex-nowrap)","gap/var(--sf-space-1\\\\/4)","justify-content/flex-start (.justify-start)","align-items/flex-start (.items-start)"],".sf-country-code .sf-country-code-label":["flex/1 (.flex-1)","display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","gap/var(--sf-space-1\\\\/4)","justify-content/flex-start (.justify-start)","align-items/flex-start (.items-start)"],".sf-country-code .sf-country-code-field":["flex/1 (.flex-1)","display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","justify-content/flex-start (.justify-start)","align-items/center (.items-center)"],".sf-country-code .sf-country-code-left":["display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","justify-content/flex-start (.justify-start)","align-items/center (.items-center)"],".sf-country-code .sf-country-code-field input":["flex/1 (.flex-1)","display/flex (.flex)"],".sf-country-code .sf-country-code-items":["gap/var(--sf-country-code-items--gap)"],".sf-country-code .sf-country-code-item":["flex/1 (.flex-1)","display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","gap/var(--sf-space-1\\\\/3)","justify-content/flex-start (.justify-start)","align-items/center (.items-center)"],".sf-country-code .sf-country-code-flag":["display/flex (.flex)","justify-content/flex-start (.justify-start)","align-items/center (.items-center)"],".sf-country-code.open .sf-country-code-list":["flex/1 (.flex-1)","display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","justify-content/flex-start (.justify-start)","align-items/flex-start (.items-start)"],".sf-country-code.open .sf-country-code-items":["flex/1 (.flex-1)","display/flex (.flex)","flex-direction/column (.flex-col)","flex-wrap/nowrap (.flex-nowrap)","justify-content/flex-start (.justify-start)","align-items/flex-start (.items-start)"],".sf-country-code.sf-country-code--size-1.open .sf-country-code-list":["flex/1 (.flex-1)","display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","justify-content/flex-start (.justify-start)","align-items/flex-start (.items-start)"],".sf-country-code.sf-country-code--size-1.open .sf-country-code-items":["flex/1 (.flex-1)","display/flex (.flex)","flex-direction/column (.flex-col)","flex-wrap/nowrap (.flex-nowrap)","justify-content/flex-start (.justify-start)","align-items/flex-start (.items-start)"],".sf-country-code.sf-country-code--size-2.open .sf-country-code-list":["flex/1 (.flex-1)","display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","justify-content/flex-start (.justify-start)","align-items/flex-start (.items-start)"],".sf-country-code.sf-country-code--size-2.open .sf-country-code-items":["flex/1 (.flex-1)","display/flex (.flex)","flex-direction/column (.flex-col)","flex-wrap/nowrap (.flex-nowrap)","justify-content/flex-start (.justify-start)","align-items/flex-start (.items-start)"],".sf-country-code.sf-country-code--size-3.open .sf-country-code-list":["flex/1 (.flex-1)","display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","justify-content/flex-start (.justify-start)","align-items/flex-start (.items-start)"],".sf-country-code.sf-country-code--size-3.open .sf-country-code-items":["flex/1 (.flex-1)","display/flex (.flex)","flex-direction/column (.flex-col)","flex-wrap/nowrap (.flex-nowrap)","justify-content/flex-start (.justify-start)","align-items/flex-start (.items-start)"],".sf-country-code.sf-country-code--size-1\\\\/3.open .sf-country-code-list":["flex/1 (.flex-1)","display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","justify-content/flex-start (.justify-start)","align-items/flex-start (.items-start)"],".sf-country-code.sf-country-code--size-1\\\\/3.open .sf-country-code-items":["flex/1 (.flex-1)","display/flex (.flex)","flex-direction/column (.flex-col)","flex-wrap/nowrap (.flex-nowrap)","justify-content/flex-start (.justify-start)","align-items/flex-start (.items-start)"],".sf-country-code.sf-country-code--size-1\\\\/2.open .sf-country-code-list":["flex/1 (.flex-1)","display/flex (.flex)","flex-direction/row (.flex-row)","flex-wrap/nowrap (.flex-nowrap)","justify-content/flex-start (.justify-start)","align-items/flex-start (.items-start)"],".sf-country-code.sf-country-code--size-1\\\\/2.open .sf-country-code-items":["flex/1 (.flex-1)","display/flex (.flex)","flex-direction/column (.flex-col)","flex-wrap/nowrap (.flex-nowrap)","justify-content/flex-start (.justify-start)","align-items/flex-start (.items-start)"]}');

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