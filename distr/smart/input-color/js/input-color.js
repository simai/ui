/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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

/***/ "15b4e93ff6ed"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   formatDateText: () => (/* binding */ formatDateText),
/* harmony export */   formatLocale: () => (/* binding */ formatLocale),
/* harmony export */   intlFormatter: () => (/* binding */ intlFormatter),
/* harmony export */   toDate: () => (/* binding */ toDate)
/* harmony export */ });
/* harmony import */ var _page_language_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("43090d1c8307");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_page_language_js__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
_page_language_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var _page_language_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_page_language_js__WEBPACK_IMPORTED_MODULE_0__);
// The part every format module shares (core/js/format.js says what the
// helpers are): the locale a call formats in, a Date from what a host gives,
// and the Intl formatters, kept on a global every copy of these modules shares
// (bundles each carry their own module copy; page-language.js says why).
//
// No top-level side effects, here or in format-number.js, format-date.js,
// format-relative.js and format-file-size.js (ui-chart, 2026-11-05): a bundle
// that imports one function carries that function and what it calls, nothing
// else. The global is made on the first format, not on load, and SF.format is
// published by core's entry (index.js, publishFormat in format.js).

/** The locale a call formats in: the one it names, else its node's page language. */

function formatLocale({
  locale,
  node
} = {}) {
  return String(locale || '').trim() || (0,_page_language_js__WEBPACK_IMPORTED_MODULE_0__.pageLocale)(node);
}
/** A Date from a Date, a time in milliseconds or a date string; null when it is none. */

function toDate(value) {
  if (value === null || value === undefined || value === '') return null;
  const date = value instanceof Date ? new Date(value.getTime()) : new Date(typeof value === 'string' && /^\d+$/u.test(value) ? Number(value) : value);
  return Number.isNaN(date.getTime()) ? null : date;
} // The formatters every copy shares, made on the first call.

function formatterCache() {
  const root = typeof globalThis !== 'undefined' ? globalThis : {};
  if (!root.__sfFormat) root.__sfFormat = {
    formatters: new Map()
  };
  return root.__sfFormat.formatters;
} // One formatter per kind, locale and options. An unknown locale falls back to
// the browser's, and options the platform refuses (an unknown unit or
// currency) to a plain number, so a typo in a page never throws at a reader.


function intlFormatter(kind, locale, options) {
  const key = `${kind}|${locale}|${JSON.stringify(options)}`;
  const cache = formatterCache();
  if (cache.has(key)) return cache.get(key);
  const Make = Intl[kind];
  let made;

  try {
    made = new Make(locale || undefined, options);
  } catch {
    try {
      made = new Make(undefined, options);
    } catch {
      made = new Make(locale || undefined, kind === 'NumberFormat' ? {
        maximumFractionDigits: 2
      } : {});
    }
  } // A page that formats in many locales does not grow the cache for ever.


  if (cache.size >= 256) cache.delete(cache.keys().next().value);
  cache.set(key, made);
  return made;
} // A date's year keeps the abbreviation that follows it (A4, group build 15):
// Russian, Ukrainian, Bulgarian, Belarusian, Kazakh, Lithuanian, Macedonian
// and Armenian write one after the year -- «19 нояб. 2026 г.», «2026 р.»,
// «2026 m.», «2026 թ.» -- and the platform joins it with an ordinary space, so
// a narrow cell or a wrapped line printed «2026» at the end of one line and
// «г.» alone at the start of the next. Only the space before an abbreviation
// (letters closed by a full stop: г., гг., m.) becomes a no-break space; a word
// such as English «at» or German «um», a comma, a slash or a time after the
// year is left as the platform writes it (DEV answer msg-e6758728).

/** A DateTimeFormat's text of a moment with the year's marker held to the year. */

function formatDateText(formatter, moment) {
  if (typeof formatter?.formatToParts !== 'function') return formatter.format(moment); // A module-level regular expression is a statement a bundler keeps (core-format test): made here.

  const gap = /^[\s\u00a0\u202f]+(?=\p{L}+\.)/u;
  let text = '';
  let afterYear = false;

  for (const part of formatter.formatToParts(moment)) {
    text += afterYear && part.type === 'literal' ? part.value.replace(gap, '\u00a0') : part.value;
    afterYear = part.type === 'year';
  }

  return text;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "c9ce0852ac73"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   formatNumber: () => (/* binding */ formatNumber),
/* harmony export */   numberOptions: () => (/* binding */ numberOptions),
/* harmony export */   percentSign: () => (/* binding */ percentSign),
/* harmony export */   percentText: () => (/* binding */ percentText)
/* harmony export */ });
/* harmony import */ var _format_intl_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("15b4e93ff6ed");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_format_intl_js__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
_format_intl_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
// Numbers in the page's language by a format word: formatNumber and
// numberOptions alone, with no top-level side effects (format-intl.js). The
// same functions as core/js/format.js and SF.format.number; a bundle that
// formats numbers only imports them from here.

/**
 * The Intl options of a number format word (ui-chart's words, kept so a page
 * writes a format as an attribute):
 *
 *   number (default)  1 234,5   as many digits as `step` needs, at most 6; 2 without one
 *   integer           1 235
 *   decimal-<n>       n digits after the point, always (0 to 20)
 *   share             a share 0..1 as 12 % (0.125 is 12,5 %)
 *   percent           the same share: the charts' word, kept
 *   unit-percent      a value that already is the percent (12.5 is 12,5 %),
 *                     as the property type `percent` stores it
 *   compact           1,2 тыс.  /  1.2K
 *   currency-<CODE>   1 234,50 ₽ (an ISO 4217 code)
 *   unit-<unit>       45,3 ГБ (an Intl unit: gigabyte, megabit-per-second)
 *
 * Anything else reads as number. Words join with a space: a kind (currency-,
 * unit-, percent) and a precision (integer, decimal-<n>, compact), so
 * «currency-RUB integer» is 1 235 ₽, «currency-RUB decimal-2» 1 234,50 ₽ and
 * «currency-RUB compact» 1,1 млн ₽. The precision wins whatever the order.
 */

function numberOptions(format = 'number', step = 0) {
  const words = String(format || 'number').trim().split(/\s+/u).filter(Boolean);

  if (words.length > 1) {
    const PRECISION = /^(?:integer|compact|decimal-\d{1,2})$/u;
    const kinds = words.filter(one => !PRECISION.test(one));
    const precision = words.filter(one => PRECISION.test(one));
    return [...kinds, ...precision].reduce((options, one) => ({ ...options,
      ...numberOptions(one, step)
    }), {});
  }

  const word = words[0] ?? 'number';
  if (word === 'integer') return {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }; // Two meanings of «percent» met in the Framework (C294, MP-4): this word
  // multiplies a share by 100, while the property type `percent` holds the
  // percent itself. `share` says which one it is; `percent` stays its alias for
  // the charts that write it, and `unit-percent` is the percent itself.

  if (word === 'share' || word === 'percent') return {
    style: 'percent',
    maximumFractionDigits: 1
  };
  if (word === 'compact') return {
    notation: 'compact',
    maximumFractionDigits: 1
  };
  const decimal = /^decimal-(\d{1,2})$/u.exec(word);

  if (decimal) {
    const digits = Math.min(20, Number(decimal[1]));
    return {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits
    };
  }

  const unit = /^unit-([a-z]+(?:-per-[a-z]+)?)$/u.exec(word);
  if (unit) return {
    style: 'unit',
    unit: unit[1],
    unitDisplay: 'short',
    maximumFractionDigits: 1
  };
  const currency = /^currency-([A-Z]{3})$/u.exec(word);
  if (currency) return {
    style: 'currency',
    currency: currency[1]
  };
  const digits = step > 0 && step < 1 ? Math.min(6, Math.ceil(-Math.log10(step) - 1e-9)) : 2;
  return {
    maximumFractionDigits: digits
  };
}
/**
 * A number in the locale by a format word (numberOptions). `grouping: false`
 * writes it without thousands marks («2026»), `step` sets the digits of
 * `number`, and a value that is not a finite number is `gap`, '' by default
 * (a chart passes '—').
 */

function formatNumber(value, format = 'number', {
  step = 0,
  gap = '',
  grouping = true,
  ...where
} = {}) {
  const number = typeof value === 'string' && value.trim() !== '' ? Number(value) : value;
  if (typeof number !== 'number' || !Number.isFinite(number)) return gap;
  const options = numberOptions(format, step);
  if (grouping === false) options.useGrouping = false;
  const text = (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.intlFormatter)('NumberFormat', (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.formatLocale)(where), options).format(number);
  return options.style === 'percent' || options.unit === 'percent' ? percentSign(text) : text;
}
/**
 * One spelling of a per cent in every language (owner decision C203 (3), DEV
 * msg-913fd9e4, 2026-11-15): the number, a no-break space (U+00A0) and «%» --
 * «72 %», «12,5 %», and «72 %» in English too, where Intl writes «72%». A
 * language that writes the sign first («%72») keeps its order.
 */

function percentSign(text) {
  // A right-to-left language writes direction marks around the sign («12.5‎%‎»
  // in Arabic); they go with the space it had, and the number keeps the mark
  // it starts with (C294).
  return String(text).replace(/[\s\u00a0\u202f\u200e\u200f\u061c]*%[\u200e\u200f\u061c]*$/u, '\u00a0%');
}
/**
 * A value that already is a per cent (0..100, «72», «72.5») as the progress
 * family shows and says it (owner decision C203 (3), IM-3): the number in the
 * language of the node's part of the page, as many digits as it has (up to
 * 2), a no-break space and «%» -- «72 %», «72,5 %».
 */

function percentText(value, node) {
  const number = Number(value);
  return percentSign(`${formatNumber(Number.isFinite(number) ? number : 0, 'number', {
    node,
    grouping: false
  })}%`);
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "51250bf01ab0"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PREPAINT_READER: () => (/* binding */ PREPAINT_READER),
/* harmony export */   STORAGE_PREFIX: () => (/* binding */ STORAGE_PREFIX),
/* harmony export */   createPreferences: () => (/* binding */ createPreferences),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// SF.Preferences: what a person changes about how a thing looks -- column
// order, widths, sort, density, a menu's column widths -- kept one way for
// every component (owner, 2026-10-14; ui-control
// control/designs/2026-10-14-view-preferences.md).
//
// - A preference is a plain JSON value under a key `<component>/<instance>`,
//   e.g. `sf-table/cms.solutions`. No key, nothing is kept.
// - It is read synchronously, so a component applies it before its first
//   paint: the skeleton is already in the person's order.
// - The browser keeps a copy always (localStorage `sf-pref:<key>`), the cache
//   a first paint can read. A host that keeps preferences for its user
//   (Larena) plugs in with useHost(); its values win over the cache, and every
//   write goes to it as well, debounced per key.
// - A page can preload the host's values: preload({key: value}), or a
//   <script type="application/json" data-sf-preferences> (or id
//   "sf-preferences") in the page, read before the first value is.
//
// The registry lives on globalThis.SF: every bundle carries its own copy of
// this module, and two copies with two caches would disagree.
const PREFIX = 'sf-pref:';
const DELAY = 400;
const KEY = /^[\w.*:-]+(?:\/[\w.*:/-]+)?$/u;

function storage() {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

function validKey(key) {
  return typeof key === 'string' && key.length > 0 && key.length <= 200 && KEY.test(key);
}

function same(a, b) {
  try {
    return JSON.stringify(a) === JSON.stringify(b);
  } catch {
    return false;
  }
}

function plain(value) {
  return value === null || value === undefined ? null : JSON.parse(JSON.stringify(value));
}

function createPreferences() {
  const host = {
    adapter: null,
    values: new Map()
  };
  const listeners = new Map();
  const timers = new Map(); // The page's own block of the host's values, read once, before the first
  // read: a component may connect before this module's start-up ran.

  let inlineRead = false;

  const readInline = () => {
    if (inlineRead) return;
    const node = globalThis.document?.querySelector?.('script[type="application/json"][data-sf-preferences], script#sf-preferences[type="application/json"]');
    if (!node) return;
    inlineRead = true;

    try {
      api.preload(JSON.parse(node.textContent || '{}'));
    } catch {
      /* not JSON: ignored */
    }
  };

  const notify = (key, value) => {
    for (const listener of listeners.get(key) ?? []) {
      try {
        listener(plain(value), key);
      } catch (error) {
        console.error('SF.Preferences listener failed', key, error);
      }
    }
  };

  const readCache = key => {
    const store = storage();
    if (!store) return null;

    try {
      const raw = store.getItem(PREFIX + key);
      return raw === null ? null : JSON.parse(raw);
    } catch {
      return null;
    }
  };

  const writeCache = (key, value) => {
    const store = storage();
    if (!store) return;

    try {
      if (value === null) store.removeItem(PREFIX + key);else store.setItem(PREFIX + key, JSON.stringify(value));
    } catch {// A full or refused storage keeps the value for this page only.
    }
  };

  const saveToHost = key => {
    clearTimeout(timers.get(key));
    timers.delete(key);
    const adapter = host.adapter;
    if (!adapter) return;
    const value = host.values.has(key) ? host.values.get(key) : readCache(key);

    try {
      const answer = value === null ? adapter.remove?.(key) : adapter.save?.(key, plain(value));
      Promise.resolve(answer).catch(error => console.warn('SF.Preferences: the host did not keep', key, error));
    } catch (error) {
      console.warn('SF.Preferences: the host did not keep', key, error);
    }
  };

  const schedule = key => {
    if (!host.adapter) return;
    clearTimeout(timers.get(key));
    timers.set(key, setTimeout(() => saveToHost(key), DELAY));
  };

  const api = {
    // The value for a key: the host's when it gave one, else this browser's.
    read(key) {
      if (!validKey(key)) return null;
      readInline();
      if (host.values.has(key)) return plain(host.values.get(key));
      return plain(readCache(key));
    },

    // Several keys from the most general to the most particular, merged field
    // by field: `sf-table/*` (the person's tables) under `sf-table/<instance>`.
    readMerged(...keys) {
      const merged = {};
      let found = false;

      for (const key of keys.flat()) {
        const value = api.read(key);

        if (value && typeof value === 'object' && !Array.isArray(value)) {
          Object.assign(merged, value);
          found = true;
        }
      }

      return found ? merged : null;
    },

    write(key, value) {
      if (!validKey(key)) return false;
      const next = plain(value); // The value already kept is not written again: a component restoring
      // what the host gave it (sf-resizer's value) sent it back to the host on
      // every load (docs trial 5).

      if (JSON.stringify(api.read(key)) === JSON.stringify(next)) return true;
      if (host.values.has(key)) host.values.set(key, next);
      writeCache(key, next);
      schedule(key);
      return true;
    },

    // «Сбросить вид»: gone from both.
    remove(key) {
      if (!validKey(key)) return false;
      if (host.values.has(key)) host.values.set(key, null);
      writeCache(key, null);
      schedule(key);
      notify(key, null);
      return true;
    },

    subscribe(key, listener) {
      if (!validKey(key) || typeof listener !== 'function') return () => {};
      if (!listeners.has(key)) listeners.set(key, new Set());
      listeners.get(key).add(listener);
      return () => listeners.get(key)?.delete(listener);
    },

    // The host's values for this person. Each that differs from this
    // browser's copy replaces it and is announced, so a component re-applies.
    preload(values) {
      if (!values || typeof values !== 'object') return;

      for (const [key, value] of Object.entries(values)) {
        if (!validKey(key)) continue;
        const next = plain(value);
        const before = api.read(key);
        host.values.set(key, next);
        writeCache(key, next);
        if (!same(before, next)) notify(key, next);
      }
    },

    // {save(key, value), remove(key), load?(keys) → Promise<{key: value}>}.
    useHost(adapter) {
      if (!adapter || typeof adapter.save !== 'function') throw new TypeError('A preferences host saves: {save(key, value)}');
      host.adapter = adapter;
      return api;
    },

    // Asks the host for keys it has not given yet (a component that appears
    // after the page loaded).
    async load(keys) {
      const wanted = [].concat(keys).filter(key => validKey(key) && !host.values.has(key));
      if (!wanted.length || typeof host.adapter?.load !== 'function') return;

      try {
        api.preload(await host.adapter.load(wanted));
      } catch (error) {
        console.warn('SF.Preferences: the host did not answer', wanted, error);
      }
    },

    get hosted() {
      return Boolean(host.adapter);
    },

    // Writes still waiting go now (a page that is leaving).
    flush() {
      for (const key of [...timers.keys()]) saveToHost(key);
    }

  }; // Another tab changed a preference.

  globalThis.addEventListener?.('storage', event => {
    if (!event.key?.startsWith(PREFIX) || event.storageArea !== storage()) return;
    const key = event.key.slice(PREFIX.length);
    if (host.values.has(key)) return;
    let value = null;

    try {
      value = event.newValue === null ? null : JSON.parse(event.newValue);
    } catch {
      value = null;
    }

    notify(key, value);
  });
  globalThis.addEventListener?.('pagehide', () => api.flush());
  readInline();
  return Object.freeze(api);
}

if (typeof globalThis !== 'undefined') {
  globalThis.SF = globalThis.SF || {};
  if (!globalThis.SF.Preferences) globalThis.SF.Preferences = createPreferences();
}

const Preferences = globalThis.SF?.Preferences;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Preferences);
 // Before the first paint (GB21, Docara K-13, decision C438): the browser's
// copy of a preference is a public format -- localStorage `sf-pref:<key>`,
// the JSON of its value -- so a page reads it in <head>, before the Framework
// has run, and applies it without a copy of its own (the theme-first-paint
// pattern). PREPAINT_READER is the reader to print there, word for word (ES5,
// no module): sfPreference(key) answers the kept value or null. It reads the
// browser's copy only: a host that keeps preferences for its user prints them
// with the page (preload, the data-sf-preferences block).

const STORAGE_PREFIX = PREFIX;
const PREPAINT_READER = "function sfPreference(key){try{return JSON.parse(localStorage.getItem('sf-pref:'+key)||'null')}catch(e){return null}}";

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

/***/ "778671c79fa6"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   INHERITED_RESET_EVENT: () => (/* binding */ INHERITED_RESET_EVENT),
/* harmony export */   INHERITED_TEXT: () => (/* binding */ INHERITED_TEXT),
/* harmony export */   InheritedValueField: () => (/* binding */ InheritedValueField),
/* harmony export */   inheritedStepDown: () => (/* binding */ inheritedStepDown),
/* harmony export */   renderInheritedSlot: () => (/* binding */ renderInheritedSlot)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("43090d1c8307");
/* harmony import */ var _core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("e92fd2d1a38c");
/* harmony import */ var _inherited_value_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("c6c9dfe31af4");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_1__, _core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_2__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_1__, _core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_2__);



 // An inherited value, for every field of the input family (simai/ui-source#28).
//
// A setting whose empty value means «use what the parent says» -- a letter's
// colour from the brand, a page's font from the theme -- has two states a field
// must tell apart: «not set, so the parent's value applies» and «set, to
// something that may even equal it». Only the first follows the parent when the
// parent changes. A placeholder alone draws the first as if it were a value
// (ui-mail polish audit B2, P-15), and there was no way back to it once a
// person had typed.
//
// So a field that opts in takes `inherited-value`: while it holds no value of
// its own it shows that value in the placeholder ink with a small «inherited»
// marker, and the form gets an empty value. Once it holds a value of its own,
// the marker gives way to a reset button that empties the field again. The
// record views of package larena already draw a field's `inheritedValue` this
// way (property-view port 1.8.0 and later); this is the same state on the
// controls themselves, so a record view can hand it down rather than draw it
// beside them.
//
// Written once here and opted into by each control, which says only what its
// own value is, how to empty it and what takes focus: sf-input, sf-textarea,
// sf-dropdown, sf-color and sf-switch.
// The trait's event, one name for the whole family (§8, §20.2). The field
// sends this name; the dated `sf-field:reset` follows it, with the same detail
// and one cancel, from the alias shim (aliases.json, §16 item 20).

const INHERITED_RESET_EVENT = 'sf-field-reset'; // The marker and the reset, in the page's language. A product names its own
// words with `inherited-text` and `reset-label`, or registers a language.

const INHERITED_TEXT = {
  en: {
    inherited: 'inherited',
    reset: 'Reset to inherited',
    described: 'Inherited: {value}'
  }
}; // Each control declares the three in its own props -- inherited-value,
// inherited-text and reset-label -- written out rather than spread from here, so
// the manifest check that reads a component's props sees them.
// The marker is one step down the ladder from the field it sits in, so it
// reads as a note about the value. (The reset was a button of that step too,
// a 32px button in a 40px field; since C123 it is the field's own action at
// the field's glyph size, see renderInheritedSlot.)
// sf-input's outer steps: a 3 field's marker is a 2; 1/3 is the ladder's
// foot, so its marker stays at 1/3.

const STEP_DOWN = Object.freeze({
  '1/3': '1/3',
  '1/2': '1/3',
  '1': '1/2',
  '2': '1',
  '3': '2'
});
const inheritedStepDown = size => STEP_DOWN[String(size)] || '1/2';
/**
 * The mixin a control opts in with. The control supplies:
 *   - `inheritedOwnValue()` -- its own value as a string, '' when it has none;
 *   - `clearOwnValue()` -- empties it, firing the control's own input/change;
 *   - `inheritedFocusTarget()` -- the element that takes focus after a reset;
 * and may override `inheritedDisplayValue()` (what the inherited value reads
 * as -- a dropdown shows the option's label, not its machine value).
 */

const InheritedValueField = Base => class extends Base {
  constructor() {
    super(); // Typing changes the state without a redraw: the native field holds the
    // text, and redrawing on every key would fight it.

    this.__sfInheritedSync = () => this.syncInheritedState();

    this.addEventListener('input', this.__sfInheritedSync);
    this.addEventListener('change', this.__sfInheritedSync);
  }

  get inheritedValue() {
    return this.getAttribute('inherited-value') || '';
  }

  set inheritedValue(next) {
    if (next === null || next === undefined || next === '') this.removeAttribute('inherited-value');else this.setAttribute('inherited-value', String(next));
  }

  get inheritedText() {
    return this.getAttribute('inherited-text') || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(INHERITED_TEXT, 'inherited', this);
  }

  get resetLabel() {
    return this.getAttribute('reset-label') || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(INHERITED_TEXT, 'reset', this);
  }

  get hasInheritedValue() {
    return this.inheritedValue !== '';
  } // True while the field holds nothing of its own and the inherited value
  // applies. False without an inherited value: an empty field is then empty.


  get isInherited() {
    return this.hasInheritedValue && this.inheritedOwnValue() === '';
  }

  inheritedOwnValue() {
    return String(this.value ?? '');
  }

  inheritedDisplayValue() {
    return this.inheritedValue;
  }

  inheritedFocusTarget() {
    return null;
  }

  clearOwnValue() {
    this.value = '';
  } // What a screen reader hears beside the name while the value is inherited.


  inheritedDescription() {
    return (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_1__.pageText)(INHERITED_TEXT, 'described', this).replace('{value}', this.inheritedDisplayValue());
  }
  /**
   * Back to the inherited value. Fires `sf-field-reset` first, cancellable:
   * a host that must confirm or refuse calls preventDefault and nothing
   * changes. Returns whether the field was reset. The detail names the
   * element (`tag`), as a trait event does (standard 1.3.8 §20, trait
   * field-inherit@1: sf-field-reset {tag, value, inherited-value, name}): the
   * event comes from every field of the family, and a listener on a form
   * tells them apart by it.
   */


  resetToInherited() {
    if (!this.hasInheritedValue || this.inheritedOwnValue() === '') return false;
    if (this.hasAttribute('disabled') || this.hasAttribute('readonly')) return false;
    const event = new CustomEvent(INHERITED_RESET_EVENT, {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: {
        tag: this.localName,
        value: this.inheritedOwnValue(),
        inheritedValue: this.inheritedValue,
        name: this.getAttribute('name') || ''
      }
    });
    if (!this.dispatchEvent(event)) return false;
    this.clearOwnValue();
    this.syncInheritedState(); // The button that was pressed is gone, so focus goes where the person
    // works: the control itself. Left on a hidden button, it would fall to the
    // page and a keyboard user would start over from the top.

    const focus = () => this.inheritedFocusTarget()?.focus?.({
      preventScroll: true
    });

    focus();
    if (!this.contains(document.activeElement)) requestAnimationFrame(focus);
    return true;
  } // The state, drawn without a redraw: the host says it, the marker and the
  // reset swap, and the control carries the description. Each control calls it
  // at the end of its own afterRender, which the controls override without
  // calling up, so the mixin cannot hook it for them.


  syncInheritedState() {
    if (!this.hasInheritedValue && !this.__sfInheritedDescribed) {
      this.removeAttribute('data-inherited');
      return;
    }

    const inherited = this.isInherited;
    const own = this.hasInheritedValue && !inherited;
    if (inherited) this.setAttribute('data-inherited', 'true');else this.removeAttribute('data-inherited');
    this.querySelectorAll(':scope [data-inherited-marker]').forEach(node => {
      node.hidden = !inherited;
    });
    this.querySelectorAll(':scope [data-inherited-reset]').forEach(node => {
      node.hidden = !own;
    });
    const control = this.inheritedFocusTarget();
    if (!control) return;

    if (inherited) {
      control.setAttribute('aria-description', this.inheritedDescription());
      this.__sfInheritedDescribed = control;
    } else if (this.__sfInheritedDescribed === control) {
      control.removeAttribute('aria-description');
      this.__sfInheritedDescribed = null;
    }

    this.syncInheritedNote(control, inherited);
  } // A browser reads aria-describedby instead of aria-description, so a field
  // that also has a hint, an error or a description (aria-describedby) would
  // say those and drop the inherited sentence. While the inherited state
  // applies and something else describes the control, the sentence is also a
  // hidden note in the host that aria-describedby names after the ids already
  // there. Written once here for the whole family (sf-input, sf-textarea,
  // sf-quantity, sf-dropdown, sf-color, sf-switch); the id comes from the
  // instance path, never a counter.


  syncInheritedNote(control, inherited) {
    let note = this.querySelector(':scope > [data-sf-inherited-note]');
    const others = String(control.getAttribute('aria-describedby') || '').split(/\s+/u).filter(id => id && id !== note?.id);

    if (inherited && others.length && this.isConnected) {
      if (!note) {
        note = document.createElement('span');
        note.hidden = true;
        note.setAttribute('data-sf-inherited-note', '');
        this.append(note);
      }

      if (!note.id) note.id = (0,_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_2__.partId)((0,_core_js_instance_path_js__WEBPACK_IMPORTED_MODULE_2__.instancePath)(this, {
        kind: this.localName
      }), 'inherited');
      note.textContent = this.inheritedDescription();
      const ids = [...others, note.id].join(' ');
      if (control.getAttribute('aria-describedby') !== ids) control.setAttribute('aria-describedby', ids);
    } else if (note) {
      note.remove();
      if (others.length) control.setAttribute('aria-describedby', others.join(' '));else control.removeAttribute('aria-describedby');
    }
  }

};
/**
 * The marker and the reset, for a control's trailing slot. Nothing at all
 * without an inherited value, so a field that does not use it is unchanged.
 *
 * The reset is an action of the field (owner decision C123, variant A): the
 * field layer's .sf-field-action (component.inputs), the glyph sf-input's
 * clear and reveal draw -- no plate in any state, the quiet ink at rest and the
 * text's ink under the pointer and on a press, the keyboard ring round the
 * glyph, an invisible hit area. Its glyph is the field's leading-icon size
 * (the field's text line), not a step down; the marker keeps the step down.
 * Each field says its step through --sf-field-action--glyph, --height and
 * --inset (inherited-value.css). It was a link icon button of the step below.
 */

function renderInheritedSlot(component, {
  size = '1',
  disabled = false,
  className = ''
} = {}) {
  if (!component?.hasInheritedValue) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const step = inheritedStepDown(size);
  const inherited = component.isInherited;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <span class="sf-field-inherited-slot sf-field-inherited-slot--size-${size} flex items-cross-center ${className}">
      <span class="sf-field-inherited sf-field-inherited--size-${step}"
            data-inherited-marker
            aria-hidden="true"
            ?hidden=${!inherited}>${component.inheritedText}</span>
      <button
        type="button"
        class="sf-field-action sf-field-reset"
        data-inherited-reset
        aria-label=${component.resetLabel}
        title=${component.resetLabel}
        ?hidden=${inherited}
        ?disabled=${disabled}
        @click=${event => {
    // Inside a field's <label>, a press would also reach the control the
    // label is for -- a dropdown would open, a switch would flip.
    event.preventDefault();
    event.stopPropagation();
    component.resetToInherited();
  }}
      ><i class="sf-icon" aria-hidden="true">restart_alt</i></button>
    </span>
  `;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "486422991550"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SfColor: () => (/* binding */ SfColor)
/* harmony export */ });
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("bf0cea966575");
/* harmony import */ var _core_js_position_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("116963e5e31b");
/* harmony import */ var _helpers_inherited_value__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("778671c79fa6");
/* harmony import */ var _helpers_form_field__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("38ea8d53f301");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("479baedb8be6");
/* harmony import */ var _js_color_math_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("487aa4186372");
/* harmony import */ var _js_recent_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("d26fa9fee686");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("8a9b84fc1bd6");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("865ba3b0c2c6");
/* harmony import */ var _lang_index_mjs__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("66c1d5ac920d");
/* harmony import */ var _core_js_format_number_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__("c9ce0852ac73");
/* harmony import */ var _core_js_page_language_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__("43090d1c8307");
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__("d3818183b14c");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_2__, _core_js_position_js__WEBPACK_IMPORTED_MODULE_3__, _helpers_inherited_value__WEBPACK_IMPORTED_MODULE_4__, _js_templates_default__WEBPACK_IMPORTED_MODULE_6__, _core_js_format_number_js__WEBPACK_IMPORTED_MODULE_12__, _core_js_page_language_js__WEBPACK_IMPORTED_MODULE_13__, _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_14__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_2__, _core_js_position_js__WEBPACK_IMPORTED_MODULE_3__, _helpers_inherited_value__WEBPACK_IMPORTED_MODULE_4__, _js_templates_default__WEBPACK_IMPORTED_MODULE_6__, _core_js_format_number_js__WEBPACK_IMPORTED_MODULE_12__, _core_js_page_language_js__WEBPACK_IMPORTED_MODULE_13__, _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_14__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _core_js_position_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_core_js_position_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _core_js_page_language_js__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(_core_js_page_language_js__WEBPACK_IMPORTED_MODULE_13__);
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_14___default = /*#__PURE__*/__webpack_require__.n(_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_14__);














 // Only the words on screen ship in the bundle, English only (owner decision
// C282): Russian and every other language come from a language file. The
// title, settings and events stay in the language files for the Studio and the
// docs (localization study LC-2).
// A colour, for anywhere a colour is set: a theme, a site's own look, a label, a
// chart series. It was built because the property set had no colour at all while a
// running Larena site declares fourteen of them, but nothing here is about a
// property view -- it is a control like a switch or a date.
//
// Since 1.7.0 (owner decision C83, 2026-11-12) it is a field of the control
// ladder -- a swatch, the value and a chevron -- that opens the Framework's own
// compact window, never the browser's colour dialog, which looked different in
// every browser (R130). The window shows the static palette first («Палитра»)
// and, unless `custom` is off, «Своё»: a shade area, an eyedropper where the
// browser has one, the hue and alpha strips and, at the bottom, one row: the
// code with its copy action (and the % with `alpha`) and «Применить» (owner
// decision C209, 2026-11-15: the code is always hex, the format menu is gone).
// On a phone it is a sheet at the bottom of the screen.
//
// The value is a palette name (`blue`: one word in every language, painted in
// the tone the theme picks) or the code of an own colour (`#rrggbb`, or
// `#rrggbbaa` with `alpha`). It can be **unset**, which is the state a site
// actually uses: a colour inherited from the theme until somebody chooses one.
//
// Built from its component.json (standard simai.smart-component 1.3.8 §3, §4,
// §11, §16.20, §17.1): the settings are attributes and properties made by
// core/js/element-manifest.js, the words are lang/<locale>.json (the trait's
// words with them), and the host is the form control through ElementInternals.

const ColorElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_9__, {
  base: (0,_helpers_inherited_value__WEBPACK_IMPORTED_MODULE_4__.InheritedValueField)((_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default())),
  lang: _lang_index_mjs__WEBPACK_IMPORTED_MODULE_11__.files,
  source: "ru",
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_10__,
  actions: {
    // §4.4: an outcome. Nothing to clear is refused, not an error.
    clear() {
      return this.setValue("") ? "applied" : "unchanged";
    }

  }
}); // Core publishes the helper; a bundle loaded without core.js positions with
// its own copy.

const position = () => globalThis.SF?.Position || (_core_js_position_js__WEBPACK_IMPORTED_MODULE_3___default()); // On a phone -- below the md breakpoint, where core declares
// --sf-breakpoint-md -- the window is a sheet at the bottom of the screen, as
// a form of sf-menu-context and the link editor of sf-input-rich are (C32).


const onPhone = doc => !doc.defaultView?.getComputedStyle(doc.documentElement).getPropertyValue('--sf-breakpoint-md').trim(); // How long a moving colour rests before the page theme follows it.


const THEME_DEBOUNCE = 120; // How long a key held on a strip or in a number field rests before it commits.

const KEY_COMMIT = 400; // How long the copy action shows its check after the code is copied (C209 (4)).

const COPY_SHOWN = 1200; // The value: a palette name, or a hex (#rgb and #rgba are read and stored long,
// lowercase; an opaque #rrggbbff is #rrggbb). Anything else is not a colour
// this control will claim to hold.

const normalise = value => {
  const text = String(value ?? "").trim();
  if (!text) return "";
  const lower = text.toLowerCase();
  if ((0,_js_color_math_js__WEBPACK_IMPORTED_MODULE_7__.isPaletteName)(lower)) return lower;
  return (0,_js_color_math_js__WEBPACK_IMPORTED_MODULE_7__.normaliseHex)(text.startsWith("#") ? text : `#${text}`);
};

class SfColor extends (0,_helpers_form_field__WEBPACK_IMPORTED_MODULE_5__.ShownValidity)((0,_helpers_form_field__WEBPACK_IMPORTED_MODULE_5__.FormField)(ColorElement)) {
  static get props() {
    return { ...super.props,
      templateName: {
        attribute: "template",
        default: "default"
      },
      // The trait field-inherit@1 (§20.2): its settings until the build
      // merges a trait's interface.
      inheritedValue: {
        attribute: "inherited-value",
        default: ""
      },
      inheritedText: {
        attribute: "inherited-text",
        default: ""
      },
      resetLabel: {
        attribute: "reset-label",
        default: ""
      }
    };
  }

  static get observedAttributes() {
    return [...(super.observedAttributes ?? []), "value", "inherited-value", "swatches", "disabled", "readonly", "aria-label", "palette", "custom", "alpha", "variant", "target"];
  }

  attributeChangedCallback(name, previous, next) {
    super.attributeChangedCallback?.(name, previous, next);
    if (previous === next) return; // Another place for the theme, or no theme any more: the page is given
    // back what it had, and the theme goes where it is asked for now.

    if ((name === "target" || name === "variant") && this._restoreTheme) {
      this._restoreTheme();

      this._restoreTheme = null;
      this._appliedColor = undefined;
    }

    if (this.isConnected) this.requestComponentUpdate("attribute");
  }

  get value() {
    return this._accept(normalise(this.getAttribute("value")));
  } // Written from code, the value is not a change: no event, as for a native
  // field (§8).


  set value(next) {
    const value = this._accept(normalise(next));

    if (value) this.setAttribute("value", value);else this.removeAttribute("value");
    this._committed = value;
    this.requestComponentUpdate("value");
    this.sfSyncFormState();
  } // A value the field cannot hold is not its value: without `alpha` a
  // translucent code keeps its colour and drops the alpha, as the window
  // would have drawn it.


  _accept(value) {
    if (!value || (0,_js_color_math_js__WEBPACK_IMPORTED_MODULE_7__.isPaletteName)(value)) return value;
    return this.takesAlpha ? value : value.slice(0, 7);
  } // What the colour falls back to while nothing is chosen. Shown rather than
  // guessed: a control that drew the inherited colour as if it were the value
  // would make «not set» and «set to the same colour» look identical, and only
  // one of them follows the theme when the theme changes.


  get inheritedValue() {
    return normalise(this.getAttribute("inherited-value"));
  }

  get inheritedText() {
    return this.getAttribute("inherited-text") || this.sfWord("inherited");
  } // The reset back to the inherited colour is the shared one (simai/ui-source#28):
  // `reset-label` names it, and `clear-label`, its first name, still does.


  get resetLabel() {
    return this.getAttribute("reset-label") || this.getAttribute("clear-label") || this.sfWord("reset");
  } // What a screen reader hears beside the name while the value is inherited,
  // in the element's language (§11.1).


  inheritedDescription() {
    return this.sfWord("described", {
      vars: {
        value: this.inheritedDisplayValue()
      }
    });
  } // A palette colour reads as its word, an own colour as its code.


  inheritedDisplayValue() {
    return this.colourName(this.inheritedValue);
  }
  /** What a value reads as: the palette colour's word in the element's language, or the code. */


  colourName(value) {
    if (!value) return "";
    return (0,_js_color_math_js__WEBPACK_IMPORTED_MODULE_7__.isPaletteName)(value) ? this.sfWord(`hue-${value}`) : value;
  } // The inherited-value seam: the colour is the value, the field's trigger
  // takes focus and carries the description.


  inheritedOwnValue() {
    return this.value;
  }

  inheritedFocusTarget() {
    return this.querySelector(".sf-color-trigger");
  } // clear() says it as input and change, the way a swatch does.


  clearOwnValue() {
    this.clear();
  }

  afterRender() {
    this.syncInheritedState();
    this.sfSyncFormState(); // A value written from code (a page restoring the colour it kept) takes
    // the theme silently; a drag waits for its debounce.

    if (this.buildsTheme && this._themeTimer == null) this._applyTheme();
    if (this._open) this._placeWindow();
  } // ------------------------------------------------- variants theme and brand
  //
  // The theme from the colour (owner decision by delegation, 2026-10-28:
  // a variant of sf-input-color, not a separate component; C84, 2026-11-12:
  // the brand colour is a mode of this field, and sf-theme-generator leaves).
  // Two variants build it:
  // - theme: only a circle of the current colour, as a site header holds it;
  //   it opens the same window as the field at its normal size, with no text
  //   and no theme row;
  // - brand: the field itself, for a settings screen («Оформление»), with
  //   the checks of the colour as lines under it.
  // Both store a code (the theme is computed from it), take no alpha, and
  // put the theme -- the four dynamic palettes, never a status (TG-01, C90)
  // -- and the brand fill of a header and a cover (--sf-brand,
  // --sf-on-brand) on `target`, the document's root when it is empty. The
  // theme is SF.ThemePalette, fetched through the Loader the first time such
  // a control draws: it is larger than this control and a field-variant
  // colour has no use for it.


  get isTheme() {
    return this.variant === "theme";
  }

  get isBrand() {
    return this.variant === "brand";
  }

  get buildsTheme() {
    return this.isTheme || this.isBrand;
  } // A theme colour is a code with no alpha: a translucent seed is not a theme.


  get takesAlpha() {
    return Boolean(this.alpha) && !this.buildsTheme;
  }

  get themeLabel() {
    return this.label || this.getAttribute("aria-label") || this.sfWord("theme");
  }

  get themeResetLabel() {
    return this.getAttribute("clear-label") || this.sfWord("theme-reset");
  } // The brand field's clear returns the product's own colour, SIMAI's,
  // not an inherited one: «Вернуть цвет SIMAI» (DEV, recipe brand-theme,
  // 2026-11-15). clear-label still names it.


  get brandResetLabel() {
    return this.getAttribute("clear-label") || this.sfWord("brand-reset");
  }

  _palette() {
    const palette = globalThis.SF?.ThemePalette;
    if (palette?.applyTheme) return palette;

    if (!this._paletteAsked) {
      this._paletteAsked = true;

      const ready = () => {
        this._applyTheme();

        this.requestComponentUpdate("palette");
      };

      globalThis.addEventListener?.("theme-palette:ready", ready, {
        once: true
      });
      globalThis.SF?.Loader?.ensurePlugin?.("theme-palette");
    }

    return null;
  } // Where the theme goes: the element `target` names, else the document's
  // root. A selector that names nothing puts the theme nowhere.


  _themeTarget() {
    const doc = this.ownerDocument;
    const selector = String(this.getAttribute("target") || "").trim();
    if (!selector) return doc.documentElement;

    try {
      return doc.querySelector(selector);
    } catch {
      return null;
    }
  } // The colour a theme is built from: the value, or -- while nothing is
  // chosen -- the inherited colour or the Framework's own; a palette name
  // written from code is its tone's code.


  _themeSeed(color = this.value) {
    return (0,_js_color_math_js__WEBPACK_IMPORTED_MODULE_7__.isPaletteName)(color) ? this._paletteHex(color, {
      seed: true
    }) : color;
  }
  /** The theme the colour makes now (simai.framework.theme), or null before SF.ThemePalette is there. */


  get theme() {
    const palette = globalThis.SF?.ThemePalette;

    const seed = this._themeSeed(this.themeColor);

    if (!palette?.themeFromColor || !seed || !palette.isThemeColor(seed)) return null;

    if (this._themeOf !== seed) {
      this._themeOf = seed;
      this._theme = palette.themeFromColor(seed);
    }

    return this._theme;
  }
  /** What a person should know about the colour (core themeChecks: contrast, adjusted, close-to-status, grey). */


  get checks() {
    const theme = this.theme;
    return theme && globalThis.SF?.ThemePalette?.themeChecks ? globalThis.SF.ThemePalette.themeChecks(theme) : [];
  } // The checks in words, as the brand field draws them under itself.


  checkLines() {
    return this.checks.map(check => ({ ...check,
      text: this._checkText(check)
    }));
  } // The contrast ratio in the page's language (Intl). decimal, the word once
  // put for the decimal point, is a dated alias until 2027-01-01
  // (languages-g1): a product that registered it keeps its sign, noted once.


  _ratioText(ratio) {
    const decimal = (0,_core_js_page_language_js__WEBPACK_IMPORTED_MODULE_13__.registeredWord)(this.localName, "decimal", this);
    if (decimal === undefined) return (0,_core_js_format_number_js__WEBPACK_IMPORTED_MODULE_12__.formatNumber)(ratio, "number", {
      node: this
    });
    (0,_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_14__.noteDeprecated)({
      component: this.localName,
      tag: this.localName,
      kind: "word",
      from: "decimal",
      to: "Intl.NumberFormat",
      since: "2026-11-16",
      remove_after: "2027-01-01"
    });
    return String(ratio).replace(".", decimal);
  }

  _checkText(check) {
    switch (check.code) {
      case "contrast":
        return this.sfWord("check-contrast", {
          vars: {
            scheme: this.sfWord(`scheme-${check.scheme}`),
            ratio: this._ratioText(check.ratio)
          }
        });

      case "adjusted":
        return this.sfWord(check.lighter ? "check-adjusted-light" : "check-adjusted-dark", {
          vars: {
            from: check.from,
            to: check.to
          }
        });

      case "close-to-status":
        return this.sfWord(`check-status-${check.status}`);

      default:
        return this.sfWord(`check-${check.code}`);
    }
  } // The theme's variables and the brand fill, {name: value}.


  _themeVariables(theme) {
    const palette = globalThis.SF?.ThemePalette;
    return { ...palette.themeVariables(theme),
      ...(palette.brandVariables?.(theme) ?? {})
    };
  } // The colour on the target: the previous application is taken off first,
  // so the restore that is kept always returns the target to what it had
  // before this control touched it. An empty value is that restore.


  _applyTheme() {
    const palette = this._palette();

    if (!palette) return;
    const color = this.value;
    if (color === this._appliedColor) return;
    this._restoreTheme?.();
    this._restoreTheme = null;

    const seed = this._themeSeed(color);

    const target = this._themeTarget();

    if (seed && palette.isThemeColor(seed) && target?.style) {
      // The theme through core's applyTheme: an area below the page
      // takes the scheme around it and follows it (C84, RG-S3-31); the
      // brand fill beside it.
      const theme = palette.themeFromColor(seed);
      const undoTheme = palette.applyTheme(theme, target);
      const undoBrand = setVariables(target, palette.brandVariables?.(theme) ?? {});

      this._restoreTheme = () => {
        undoBrand();
        undoTheme();
      };
    }

    this._appliedColor = color;
  }

  _scheduleTheme(delay) {
    if (!this.buildsTheme) return;
    clearTimeout(this._themeTimer);
    this._themeTimer = null;

    if (!delay) {
      this._applyTheme();

      return;
    }

    this._themeTimer = setTimeout(() => {
      this._themeTimer = null;

      this._applyTheme();
    }, delay);
  }

  get themeColor() {
    return this.value || this.inheritedValue || globalThis.SF?.ThemePalette?.DEFAULT_THEME_COLOR || "";
  }

  disconnectedCallback() {
    super.disconnectedCallback?.(); // The theme stays: the page chose it. Only the pending work goes.

    clearTimeout(this._themeTimer);
    this._themeTimer = null;

    this._closeQuietly();

    this._recentOff?.();
    this._recentOff = null;
  } // The colours a product already has. A comma separated list, each one a hex,
  // optionally `#hex|Name` so a swatch can say what it is. A name may hold
  // spaces («#1f6feb|Brand blue»): splitting on spaces too cut it into a swatch
  // named «Brand» and a word that is not a colour. A piece without a name may
  // still list several colours by spaces, as the first lists did. A palette
  // name is a swatch of its own too (`blue|Фирменный`).


  get swatchList() {
    return String(this.getAttribute("swatches") || "").split(",").flatMap(piece => piece.includes("|") ? [piece.trim()] : piece.trim().split(/\s+/u)).filter(Boolean).map(entry => {
      const [color, ...rest] = entry.split("|");

      const value = this._accept(normalise(color));

      const name = rest.join("|").trim();
      return value ? {
        value,
        name: name || this.colourName(value)
      } : null;
    }).filter(Boolean);
  } // What is painted now: the value when there is one, the inherited colour when
  // there is not (§4.3). It was `shown`, which is the base value of every
  // element now (§4.1): whether it has a box in an opened container.


  get effectiveValue() {
    return this.value || this.inheritedValue || "";
  } // What the form gets (§17.1): the name or the code, empty while the
  // inherited colour applies (§20.2), nothing while disabled.


  sfFormValue() {
    if (this.disabled) return null;
    return this.value;
  } // form.reset(): back to the colour the element was written with, without
  // events (§17.1 item 4).


  fieldReset() {
    const initial = this._accept(normalise(this._initialValue));

    if (initial) this.setAttribute("value", initial);else this.removeAttribute("value");
    this._committed = initial;
    this.requestComponentUpdate("value");
    this.syncInheritedState();
  }

  get isSet() {
    return Boolean(this.value);
  }

  setValue(next) {
    const changed = this._write(next);

    this._commit();

    return changed;
  } // `input` while the value moves (a drag across the shade area), `change`
  // once when it is committed: a change per input was a change per pixel.


  _write(next) {
    const value = this._accept(normalise(next));

    if (value === this.value) return false;
    if (value) this.setAttribute("value", value);else this.removeAttribute("value");
    this.requestComponentUpdate("value");
    this.sfSyncFormState();

    this._emit("input");

    this._scheduleTheme(THEME_DEBOUNCE);

    return true;
  }

  _commit() {
    const value = this.value;

    this._scheduleTheme(0);

    if (value === (this._committed ?? this._accept(normalise(this._initialValue)))) return;
    this._committed = value;

    this._emit("change");
  } // The theme variants say what the colour makes as well: the theme, its
  // variables and its CSS (the brand fill with them, for a site's stored
  // stylesheet) and the checks -- the detail sf-theme-generator's events
  // carried, so a page that listened to the generator reads the same names.


  _emit(type) {
    const detail = {
      value: this.value,
      name: this.name
    };
    const theme = this.buildsTheme && this.value ? this.theme : null;

    if (theme) {
      const variables = this._themeVariables(theme);

      const lines = Object.entries(variables).map(([name, value]) => `  ${name}: ${value};`);
      Object.assign(detail, {
        theme: JSON.parse(JSON.stringify(theme)),
        variables,
        css: `:root {\n${lines.join("\n")}\n}\n`,
        checks: globalThis.SF.ThemePalette.themeChecks?.(theme) ?? []
      });
    }

    this.sfEmit(type, detail);
  }

  connectedCallback() {
    if (this._initialValue === undefined) this._initialValue = this.getAttribute("value") ?? "";
    super.connectedCallback?.();
    this._recentOff ??= (0,_js_recent_js__WEBPACK_IMPORTED_MODULE_8__.onRecentChange)(() => {
      if (this._open) this.requestComponentUpdate("recent");
    });
  } // ---------------------------------------------------------------- the window
  // The sixteen hues, unless `palette="false"`.


  get showsHues() {
    return this.palette !== false;
  } // «Палитра» is there while it has something to choose from: the hues or
  // the product's own colours.


  get offersPalette() {
    return this.showsHues || this.swatchList.length > 0;
  } // «Своё» is there unless the product turned it off -- and always when there
  // is no palette to choose from.


  get offersCustom() {
    return this.custom !== false || !this.offersPalette;
  } // A palette colour's code, read from the page's own token (the tone the
  // theme paints it in), for «Своё» to start from and for the theme variant,
  // whose value is a code.


  _resolveColour(css) {
    const doc = this.ownerDocument;
    const probe = doc.createElement("span");
    probe.style.cssText = "display:none";
    probe.style.color = css;
    this.append(probe);
    const read = doc.defaultView?.getComputedStyle(probe).color || "";
    probe.remove();
    return cssRgb(read) || this._canvasRgb(read);
  } // A computed colour the page keeps in its own space -- oklch(), lab(),
  // color(display-p3 …) stay so in a computed style -- read back as sRGB
  // through a one-pixel canvas, which clips it to the screen's gamut as the
  // page paints it (C209 (1): oklch() typed into the code became nothing).


  _canvasRgb(text) {
    if (!text) return null;

    try {
      const canvas = this.ownerDocument.createElement("canvas");
      canvas.width = 1;
      canvas.height = 1;
      const paint = canvas.getContext("2d", {
        willReadFrequently: true
      });
      if (!paint) return null;
      paint.fillStyle = text;
      paint.fillRect(0, 0, 1, 1);
      const [r, g, b, a] = paint.getImageData(0, 0, 1, 1).data;
      return {
        rgb: [r, g, b],
        a: a / 255
      };
    } catch {
      return null;
    }
  } // The tone the field paints (50 light, 70 dark), or with `seed` tone 50 in
  // either theme: the seed of a page theme must not depend on the theme the
  // page happens to show.


  _paletteHex(name, {
    seed = false
  } = {}) {
    // A seed is the static palette's own tone 50 when core's calculation is
    // there: the same hex on every page, whatever its sheets declare (a page
    // whose sheet lacks the hue token would read the probe's inherited text
    // colour instead).
    const fixed = seed ? globalThis.SF?.ThemePalette?.staticPalette?.()?.[name]?.tones?.[50] : "";
    if (fixed) return fixed;

    const rgb = !seed && this._resolveColour(`light-dark(var(--sf-${name}-50), var(--sf-${name}-70))`) || this._resolveColour(`var(--sf-${name}-50)`);

    return rgb ? (0,_js_color_math_js__WEBPACK_IMPORTED_MODULE_7__.toHex)(rgb.rgb) : "";
  } // Any CSS colour a developer pastes (oklch(), a name), asked of the page.


  _cssColour(text) {
    if (!globalThis.CSS?.supports?.("color", text)) return null;
    return this._resolveColour(text);
  } // The own colour the window edits: hue, saturation, brightness and alpha.


  _seed(value) {
    let parsed = (0,_js_color_math_js__WEBPACK_IMPORTED_MODULE_7__.parseHex)(value);
    if (!parsed && (0,_js_color_math_js__WEBPACK_IMPORTED_MODULE_7__.isPaletteName)(value)) parsed = (0,_js_color_math_js__WEBPACK_IMPORTED_MODULE_7__.parseHex)(this._paletteHex(value));
    if (!parsed) parsed = (0,_js_color_math_js__WEBPACK_IMPORTED_MODULE_7__.parseHex)(this._paletteHex("blue")) || {
      rgb: [0, 91, 190],
      a: 1
    };
    const [h, s, v] = (0,_js_color_math_js__WEBPACK_IMPORTED_MODULE_7__.rgbToHsv)(parsed.rgb); // A grey has no hue of its own: the strip keeps the hue it had.

    this._hsv = [s > 0 ? h : this._hsv?.[0] ?? h, s, v];
    this._alphaValue = this.takesAlpha ? parsed.a : 1;
  }

  get ownColour() {
    const [h, s, v] = this._hsv || [0, 0, 0];
    return (0,_js_color_math_js__WEBPACK_IMPORTED_MODULE_7__.toHex)((0,_js_color_math_js__WEBPACK_IMPORTED_MODULE_7__.hsvToRgb)(h, s, v), this.takesAlpha ? this._alphaValue ?? 1 : 1);
  }

  get isOpen() {
    return Boolean(this._open);
  }
  /**
   * Opens the window, on the view the value comes from, or on `view`
   * ('palette' or 'own') when the caller names one. `anchor` is an element of
   * the page the window is placed against and gives focus back to -- a row of
   * a settings menu (C85) -- instead of the field. Returns whether it is open.
   */


  openPicker({
    anchor = null,
    view = ""
  } = {}) {
    if (this.disabled || this.readonly || this._open) return Boolean(this._open);
    const value = this.value || this.inheritedValue;

    this._seed(value);

    this._codeError = "";
    this._typing = false;
    this._anchor = anchor && typeof anchor.getBoundingClientRect === "function" ? anchor : null;
    const own = this.offersCustom && (!this.offersPalette || value && !(0,_js_color_math_js__WEBPACK_IMPORTED_MODULE_7__.isPaletteName)(value) && !this.swatchList.some(swatch => swatch.value === value));
    this._view = view === "own" && this.offersCustom ? "own" : view === "palette" && this.offersPalette ? "palette" : own ? "own" : "palette";
    this._open = true;
    (0,_core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_2__.holdOpenSurfaceMark)(this, true, {
      root: () => this.querySelector(".sf-color-window"),
      onOutsidePress: () => this.closePicker({
        reason: "outside",
        restoreFocus: false
      }),
      onEscape: () => {
        if (!(0,_core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_2__.isTopOpenSurface)(this)) return false;
        this.closePicker({
          reason: "escape",
          restoreFocus: true
        });
        return true;
      }
    }); // CF-1: a non-modal window under its field. Tab moves through the field
    // and the window; the focus going anywhere else closes it, as a press
    // outside does, and stays where Tab took it (sf-input-date's calendar,
    // sf-dropdown's list). It stayed open behind the next control. A focus
    // that goes nowhere (the browser window losing focus, the eyedropper)
    // keeps it.

    this._onFocusOut ??= event => {
      const next = event.relatedTarget;
      if (!this._open || !next || this.contains(next) || this._anchor?.contains?.(next)) return;
      this.closePicker({
        reason: "focus",
        restoreFocus: false
      });
    };

    this.addEventListener("focusout", this._onFocusOut);

    this._onViewport ??= () => {
      if (this._open && this._sheetMode !== onPhone(this.ownerDocument)) this._placeWindow(true);
    };

    globalThis.addEventListener("resize", this._onViewport);
    this.requestComponentUpdate("open");
    this.whenRendered?.(() => this._focusWindow(), {
      next: true
    });
    return true;
  }
  /** Closes the window. Returns whether it is closed. */


  closePicker({
    reason = "api",
    restoreFocus = true
  } = {}) {
    if (!this._open) return true;

    this._closeQuietly();

    this.requestComponentUpdate("open");
    const back = this._anchor?.isConnected ? this._anchor : this.querySelector(".sf-color-trigger");
    this._anchor = null;
    if (restoreFocus) back?.focus?.({
      preventScroll: true
    });
    this._lastClose = {
      reason,
      at: Date.now()
    };
    return true;
  }

  togglePicker() {
    return this._open ? !this.closePicker({
      reason: "close"
    }) : this.openPicker();
  }

  _closeQuietly() {
    if (!this._open) return;
    this._open = false;
    clearTimeout(this._keyTimer);
    this.removeEventListener("focusout", this._onFocusOut);
    if (this._pendingCommit) this._commitOwn();
    (0,_core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_2__.holdOpenSurfaceMark)(this, false);
    globalThis.removeEventListener("resize", this._onViewport);

    this._stopPlacing();
  } // Anchored under the field on a desktop (core's one positioning contract:
  // flip, shift, never taller than the room it has), lifted into the top
  // layer so no box of the page clips it; on a phone a sheet at the bottom.


  _placeWindow(force = false) {
    const panel = this.querySelector(".sf-color-window");
    const anchor = this._anchor?.isConnected ? this._anchor : this.querySelector(".sf-color-frame, .sf-color-dot");
    if (!panel || !anchor) return;
    const sheet = onPhone(this.ownerDocument);

    if (!force && this._placed?.panel === panel && this._sheetMode === sheet) {
      this._placed.update?.();
      return;
    }

    this._stopPlacing();

    this._sheetMode = sheet;

    if (sheet) {
      panel.setAttribute("data-sf-sheet", "");
      const lower = position().liftToTopLayer?.(panel) ?? null;
      this._placed = {
        panel,
        stop: () => lower?.()
      };
      return;
    }

    panel.removeAttribute("data-sf-sheet");
    const placed = position().anchor(anchor, panel, {
      side: "block-end",
      align: "start",
      fitHeight: true,
      autoUpdate: true
    });
    this._placed = {
      panel,
      stop: () => placed.stop(),
      update: () => placed.update()
    };
  }

  _stopPlacing() {
    const placed = this._placed;
    this._placed = null;
    placed?.stop?.();
    placed?.panel?.removeAttribute("data-sf-sheet");
    this._sheetMode = undefined;
  }

  _focusWindow() {
    if (!this._open) return;
    const panel = this.querySelector(".sf-color-window");
    const target = this._view === "own" ? panel?.querySelector(".sf-color-area") : panel?.querySelector('.sf-color-option[aria-checked="true"]') || panel?.querySelector('.sf-color-option[tabindex="0"]');
    (target || panel)?.focus?.({
      preventScroll: true
    });
  }

  showView(view) {
    if (!this._open || view === this._view || view === "own" && !this.offersCustom || view === "palette" && !this.offersPalette) return;
    this._view = view;
    if (view === "own") this._seed(this.value || this.inheritedValue);
    this.requestComponentUpdate("view");
    this.whenRendered?.(() => {
      if (view === "own") this.querySelector(".sf-color-area")?.focus({
        preventScroll: true
      });
    }, {
      next: true
    });
  } // A palette colour, a product colour or a recent one: chosen and committed
  // at once. A press closes the window; an arrow key moves the choice and
  // keeps it open, as a radio group does.


  pick(value, {
    close = true,
    own = false
  } = {}) {
    let next = normalise(value);
    if (this.buildsTheme && (0,_js_color_math_js__WEBPACK_IMPORTED_MODULE_7__.isPaletteName)(next)) next = this._paletteHex(next, {
      seed: true
    });
    if (own) (0,_js_recent_js__WEBPACK_IMPORTED_MODULE_8__.rememberColour)(next);
    this.setValue(next);
    if (close) this.closePicker({
      reason: "select"
    });
  } // ------------------------------------------------------------ «Своё»


  _moved() {
    this._codeError = "";
    if (this.ownerDocument.activeElement?.classList?.contains("sf-color-code") !== true) this._typing = false;

    this._write(this.ownColour);

    this._pendingCommit = true;
  }

  _commitOwn() {
    this._pendingCommit = false;
    (0,_js_recent_js__WEBPACK_IMPORTED_MODULE_8__.rememberColour)(this.value);

    this._commit();
  } // The shade area and the strips follow the pointer from the press to the
  // release; the release commits.


  dragOn(event, kind) {
    if (this.disabled || this.readonly || event.button > 0) return;
    const target = event.currentTarget;
    event.preventDefault();
    target.setPointerCapture?.(event.pointerId);
    target.focus?.({
      preventScroll: true
    });

    const move = moved => {
      const box = target.getBoundingClientRect();
      const x = (0,_js_color_math_js__WEBPACK_IMPORTED_MODULE_7__.clamp)((moved.clientX - box.left) / (box.width || 1), 0, 1);
      const y = (0,_js_color_math_js__WEBPACK_IMPORTED_MODULE_7__.clamp)((moved.clientY - box.top) / (box.height || 1), 0, 1);
      const [h, s, v] = this._hsv;
      if (kind === "area") this._hsv = [h, x, 1 - y];else if (kind === "hue") this._hsv = [x * 360, s, v];else this._alphaValue = Math.round(x * 100) / 100;

      this._moved();
    };

    const up = () => {
      target.removeEventListener("pointermove", move);
      target.removeEventListener("pointerup", up);
      target.removeEventListener("pointercancel", up);

      this._commitOwn();
    };

    move(event);
    target.addEventListener("pointermove", move);
    target.addEventListener("pointerup", up);
    target.addEventListener("pointercancel", up);
  } // Arrows move by one, Shift by ten; the colour commits once the key rests.


  keyOn(event, kind) {
    const step = event.shiftKey ? 10 : 1;
    const delta = {
      ArrowRight: [step, 0],
      ArrowLeft: [-step, 0],
      ArrowUp: [0, step],
      ArrowDown: [0, -step],
      PageUp: [0, 10],
      PageDown: [0, -10]
    }[event.key];
    if (!delta) return;
    event.preventDefault();
    const [dx, dy] = delta;
    const [h, s, v] = this._hsv;
    if (kind === "area") this._hsv = [h, (0,_js_color_math_js__WEBPACK_IMPORTED_MODULE_7__.clamp)(s + dx / 100, 0, 1), (0,_js_color_math_js__WEBPACK_IMPORTED_MODULE_7__.clamp)(v + dy / 100, 0, 1)];else if (kind === "hue") this._hsv = [(0,_js_color_math_js__WEBPACK_IMPORTED_MODULE_7__.clamp)(h + dx + dy, 0, 360), s, v];else this._alphaValue = (0,_js_color_math_js__WEBPACK_IMPORTED_MODULE_7__.clamp)(Math.round(((this._alphaValue ?? 1) + (dx + dy) / 100) * 100) / 100, 0, 1);

    this._moved();

    clearTimeout(this._keyTimer);
    this._keyTimer = setTimeout(() => this._commitOwn(), KEY_COMMIT);
  } // The code field (C209 (1)): a hex, or any CSS colour typed or pasted --
  // rgb(), hsl(), oklch(), a name. A colour it reads is the field's at once,
  // as hex, while the text stays as typed; it is committed on Enter, on
  // «Применить» or when the field is left. A colour the field cannot read
  // says so under the row and changes nothing.


  codeOn(event, commit) {
    return this._takeCode(event.currentTarget.value, commit);
  }

  _takeCode(text, commit) {
    const parsed = (0,_js_color_math_js__WEBPACK_IMPORTED_MODULE_7__.parseColour)(text, "hex", css => this._cssColour(css));
    this._codeDraft = text;
    this._typing = !commit || !parsed;

    if (!parsed) {
      this._codeError = String(text ?? "").trim() ? this.sfWord("not-a-colour") : "";
      this.requestComponentUpdate("code");
      return false;
    }

    const [h, s, v] = (0,_js_color_math_js__WEBPACK_IMPORTED_MODULE_7__.rgbToHsv)(parsed.rgb);
    this._hsv = [s > 0 ? h : this._hsv[0], s, v];
    if (this.takesAlpha && (0,_js_color_math_js__WEBPACK_IMPORTED_MODULE_7__.statesAlpha)(text)) this._alphaValue = parsed.a;

    this._moved();

    if (commit) this._commitOwn();
    return true;
  }
  /**
   * «Применить» (C209 (2)): the code in the field is applied and the window
   * closes, the focus back on the field. A colour moved by the pointer is
   * already the value, so the press only closes. A code the field cannot
   * read keeps the window open and says so. Returns whether it closed.
   */


  applyCode() {
    if (!this._open) return true;
    const field = this.querySelector(".sf-color-code");

    if (field && this._typing && !this._takeCode(field.value, true)) {
      field.focus({
        preventScroll: true
      });
      return false;
    }

    if (this._pendingCommit) this._commitOwn();
    this._typing = false;
    return this.closePicker({
      reason: "apply",
      restoreFocus: true
    });
  } // What the copy action copies (C209 (4)): the colour's code as the field
  // shows it, upper case, with its alpha pair while the colour is
  // translucent.


  get copyText() {
    return this.ownColour.toUpperCase();
  }

  alphaOn(event, commit) {
    const field = event.currentTarget;
    const number = parseInt(field.value, 10);

    if (!Number.isFinite(number)) {
      if (commit) field.value = String(Math.round((this._alphaValue ?? 1) * 100));
      return;
    }

    this._alphaValue = (0,_js_color_math_js__WEBPACK_IMPORTED_MODULE_7__.clamp)(number, 0, 100) / 100;

    this._moved();

    if (commit) {
      field.value = String(Math.round(this._alphaValue * 100));

      this._commitOwn();
    }
  }

  alphaKeyOn(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      this.alphaOn(event, true);
      return;
    }

    const direction = {
      ArrowUp: 1,
      ArrowDown: -1
    }[event.key];
    if (!direction) return;
    event.preventDefault();
    const next = (0,_js_color_math_js__WEBPACK_IMPORTED_MODULE_7__.clamp)(Math.round((this._alphaValue ?? 1) * 100) + direction * (event.shiftKey ? 10 : 1), 0, 100);
    this._alphaValue = next / 100;
    event.currentTarget.value = String(next);

    this._moved();

    clearTimeout(this._keyTimer);
    this._keyTimer = setTimeout(() => this._commitOwn(), KEY_COMMIT);
  } // While a person types, the field keeps what they typed: redrawn from the
  // colour on every key, «#1f» became «#1F0000» under the caret.


  get codeText() {
    if (this._typing) return this._codeDraft ?? "";
    return (0,_js_color_math_js__WEBPACK_IMPORTED_MODULE_7__.formatColour)(this._hsv || [0, 0, 0], "hex");
  }

  get hasEyeDropper() {
    return typeof globalThis.EyeDropper === "function";
  }

  async eyedrop() {
    if (!this.hasEyeDropper) return;

    try {
      const result = await new globalThis.EyeDropper().open();

      const parsed = (0,_js_color_math_js__WEBPACK_IMPORTED_MODULE_7__.parseHex)(result.sRGBHex) || this._cssColour(result.sRGBHex);

      if (!parsed) return;
      const [h, s, v] = (0,_js_color_math_js__WEBPACK_IMPORTED_MODULE_7__.rgbToHsv)(parsed.rgb);
      this._hsv = [s > 0 ? h : this._hsv[0], s, v];

      this._moved();

      this._commitOwn();
    } catch {// The person cancelled the eyedropper.
    }
  } // ------------------------------------------------------------ palette keys
  // A radio group with one tab stop: arrows move and choose, Home and End go
  // to the ends, the grid's columns are its rows' length.


  optionKey(event) {
    const group = event.currentTarget;
    const items = [...group.querySelectorAll(".sf-color-option")];
    const at = items.indexOf(this.ownerDocument.activeElement);
    if (at < 0) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      items[at].click();
      return;
    }

    const columns = getComputedStyle(group).gridTemplateColumns.split(" ").filter(Boolean).length || items.length;
    const step = {
      ArrowRight: 1,
      ArrowLeft: -1,
      ArrowDown: columns,
      ArrowUp: -columns,
      Home: -at,
      End: items.length - 1 - at
    }[event.key];
    if (step === undefined) return;
    event.preventDefault();
    const next = items[(0,_js_color_math_js__WEBPACK_IMPORTED_MODULE_7__.clamp)(at + step, 0, items.length - 1)];
    next.focus();
    if (next.dataset.value) this.pick(next.dataset.value, {
      close: false,
      own: next.dataset.own === "true"
    });
  } // The check inside a chosen swatch: black or white, whichever reads.


  inkFor(value) {
    const parsed = (0,_js_color_math_js__WEBPACK_IMPORTED_MODULE_7__.parseHex)(value) || ((0,_js_color_math_js__WEBPACK_IMPORTED_MODULE_7__.isPaletteName)(value) ? (0,_js_color_math_js__WEBPACK_IMPORTED_MODULE_7__.parseHex)(this._paletteHex(value)) : null);
    if (!parsed) return "";
    return (0,_js_color_math_js__WEBPACK_IMPORTED_MODULE_7__.darkInk)(parsed.rgb) ? "var(--sf-black)" : "var(--sf-white)";
  } // The recent own colours of the window's palette view: the current own
  // colour first and chosen, then the rest, one row of the grid (R153, R168).


  get recentRow() {
    if (!this.offersCustom) return [];
    const own = this.value && !(0,_js_color_math_js__WEBPACK_IMPORTED_MODULE_7__.isPaletteName)(this.value) && !this.swatchList.some(swatch => swatch.value === this.value) ? [this.value] : [];
    const list = (0,_js_recent_js__WEBPACK_IMPORTED_MODULE_8__.recentColours)({
      alpha: this.takesAlpha
    }).filter(hex => hex !== this.value);
    return [...own, ...list].slice(0, _js_recent_js__WEBPACK_IMPORTED_MODULE_8__.RECENT_SHOW);
  }

  templateContext() {
    const open = Boolean(this._open);
    return this.createTemplateContext({ ...this.getPropsContext(),
      // C153 (3): the page's error, or the one the field shows itself (ShownValidity).
      invalid: this.sfShownInvalid(this.invalid),
      errorMessage: this.sfShownMessage(this.invalid, this.errorMessage),
      component: this,
      value: this.value,
      painted: this.effectiveValue,
      paintedName: this.colourName(this.effectiveValue),
      isSet: this.isSet,
      inheritedValue: this.inheritedValue,
      inheritedText: this.inheritedText,
      hasInheritedValue: this.hasInheritedValue,
      chooseLabel: this.chooseLabel,
      clearLabel: this.isBrand ? this.brandResetLabel : this.clearLabel,
      swatchList: this.swatchList,
      clearable: this.clearable,
      disabled: this.disabled,
      readonly: Boolean(this.readonly),
      size: this.size,
      appearance: this.appearance,
      name: this.name,
      // The host is the form control where the browser has
      // ElementInternals; the hidden input is drawn only without them.
      hiddenName: this.sfInternals ? "" : this.name,
      label: this.label,
      // aria-label stays a host attribute read here, never a setting (§3.1).
      ariaLabel: this.getAttribute("aria-label") || "",
      variant: this.variant,
      themeLabel: this.themeLabel,
      themeResetLabel: this.themeResetLabel,
      themeColor: this.themeColor,
      open,
      view: this._view || "palette",
      offersPalette: this.offersPalette,
      offersCustom: this.offersCustom,
      // The sixteen hues of the static palette (C17). Named hues, not
      // palette: the setting palette (a boolean) keeps its own name in the
      // context's readers (GB20 triage, manifest defaults).
      hues: _js_color_math_js__WEBPACK_IMPORTED_MODULE_7__.PALETTE,
      alpha: this.takesAlpha,
      brand: this.isBrand,
      checks: this.isBrand ? this.checkLines() : [],
      checksLabel: this.sfWord("checks"),
      brandLabel: this.sfWord("brand"),
      recentRow: open ? this.recentRow : [],
      hsv: this._hsv || [0, 0, 0],
      alphaValue: this._alphaValue ?? 1,
      ownColour: open ? this.ownColour : "",
      codeText: open ? this.codeText : "",
      typing: Boolean(this._typing),
      copyText: open ? this.copyText : "",
      copyShown: COPY_SHOWN,
      codeError: this._codeError || "",
      hasEyeDropper: this.hasEyeDropper,
      word: (key, vars) => this.sfWord(key, vars ? {
        vars
      } : undefined)
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_6__.renderColorTemplate)(this.templateContext());
  }

} // rgb(r g b / a) or rgba(r, g, b, a), as a computed style gives it.


function cssRgb(text) {
  const match = /rgba?\(([^)]+)\)/u.exec(String(text));
  if (!match) return null;
  const parts = match[1].split(/[\s,/]+/u).filter(Boolean).map(part => parseFloat(part));
  if (parts.length < 3 || parts.slice(0, 3).some(part => !Number.isFinite(part))) return null;
  return {
    rgb: parts.slice(0, 3),
    a: Number.isFinite(parts[3]) ? parts[3] : 1
  };
} // Writes variables on an element's inline style and returns what takes them
// off again, back to the values it had.


function setVariables(target, variables) {
  const before = Object.fromEntries(Object.keys(variables).map(name => [name, target.style.getPropertyValue(name)]));

  for (const [name, value] of Object.entries(variables)) target.style.setProperty(name, value);

  return () => {
    for (const [name, value] of Object.entries(before)) {
      if (value) target.style.setProperty(name, value);else target.style.removeProperty(name);
    }
  };
}

SfColor.define("sf-input-color");

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "487aa4186372"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FORMATS: () => (/* binding */ FORMATS),
/* harmony export */   FORMAT_LABELS: () => (/* binding */ FORMAT_LABELS),
/* harmony export */   PALETTE: () => (/* binding */ PALETTE),
/* harmony export */   alphaOf: () => (/* binding */ alphaOf),
/* harmony export */   clamp: () => (/* binding */ clamp),
/* harmony export */   contrast: () => (/* binding */ contrast),
/* harmony export */   darkInk: () => (/* binding */ darkInk),
/* harmony export */   formatColour: () => (/* binding */ formatColour),
/* harmony export */   hslToRgb: () => (/* binding */ hslToRgb),
/* harmony export */   hsvToRgb: () => (/* binding */ hsvToRgb),
/* harmony export */   isPaletteName: () => (/* binding */ isPaletteName),
/* harmony export */   normaliseHex: () => (/* binding */ normaliseHex),
/* harmony export */   paletteFill: () => (/* binding */ paletteFill),
/* harmony export */   parseColour: () => (/* binding */ parseColour),
/* harmony export */   parseHex: () => (/* binding */ parseHex),
/* harmony export */   rgbToHsl: () => (/* binding */ rgbToHsl),
/* harmony export */   rgbToHsv: () => (/* binding */ rgbToHsv),
/* harmony export */   solidOf: () => (/* binding */ solidOf),
/* harmony export */   statesAlpha: () => (/* binding */ statesAlpha),
/* harmony export */   toHex: () => (/* binding */ toHex)
/* harmony export */ });
// The colour arithmetic of sf-input-color's own picker (owner decision C83):
// reading what a person types or pastes, and the four ways the code field
// shows a colour (Hex, RGB, HSL, HSB -- R170, Figma's set). Pure functions, no
// DOM, so the unit suite reads them directly.
const clamp = (value, low, high) => Math.min(high, Math.max(low, value)); // The sixteen hues of the static palette (owner decision C17), in the
// palette's own order. A palette colour is stored by this name, one in every
// language (C83); the screen shows the translated word and the theme picks
// the tone. tests/input-color-c83.contract.test.mjs holds the list equal to
// core/js/theme-palette.js STATIC_HUE_NAMES, which this bundle does not import
// (the HCT solver behind it is larger than the control).

const PALETTE = Object.freeze(['red', 'orange', 'amber', 'yellow', 'lime', 'green', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'pink', 'brown', 'gray']); // The tone a palette colour is painted in: the graphic tone of C17's charts and
// markers, 50 on a light page and 70 on a dark one, picked by the page's own
// colour scheme.

const paletteFill = name => `light-dark(var(--sf-${name}-50), var(--sf-${name}-70))`;
const isPaletteName = value => PALETTE.includes(value); // #rgb, #rgba, #rrggbb and #rrggbbaa.

const HEX = /^#?([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/iu;
/** {rgb: [r, g, b] 0..255, a: 0..1} of a hex, or null. */

function parseHex(text) {
  const match = HEX.exec(String(text ?? '').trim());
  if (!match) return null;
  let digits = match[1];
  if (digits.length < 5) digits = [...digits].map(digit => digit + digit).join('');
  const channels = [0, 2, 4, 6].map(at => parseInt(digits.slice(at, at + 2) || 'ff', 16));
  return {
    rgb: channels.slice(0, 3),
    a: channels[3] / 255
  };
}

const hex2 = number => Math.round(clamp(number, 0, 255)).toString(16).padStart(2, '0');
/** Lowercase #rrggbb, or #rrggbbaa when the colour is translucent. */


function toHex([r, g, b], alpha = 1) {
  const a = Math.round(clamp(alpha, 0, 1) * 255);
  return `#${hex2(r)}${hex2(g)}${hex2(b)}${a < 255 ? hex2(a) : ''}`;
}
/**
 * The value form of a hex: lowercase #rrggbb, #rrggbbaa below full alpha (an
 * opaque #rrggbbff is #rrggbb), or '' for anything that is not a hex.
 */

function normaliseHex(text) {
  const parsed = parseHex(text);
  return parsed ? toHex(parsed.rgb, parsed.a) : '';
}
const alphaOf = value => parseHex(value)?.a ?? 1;
const solidOf = value => {
  const parsed = parseHex(value);
  return parsed ? toHex(parsed.rgb) : '';
};
function hsvToRgb(h, s, v) {
  const f = n => {
    const k = (n + h / 60) % 6;
    return v - v * s * Math.max(0, Math.min(k, 4 - k, 1));
  };

  return [f(5) * 255, f(3) * 255, f(1) * 255];
}
function rgbToHsv([r, g, b]) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;

  if (d) {
    h = max === r ? (g - b) / d % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }

  return [h, max ? d / max : 0, max];
}
function rgbToHsl([r, g, b]) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  let h = 0;
  let s = 0;

  if (d) {
    s = d / (1 - Math.abs(2 * l - 1));
    h = max === r ? (g - b) / d % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }

  return [h, s, l];
}
function hslToRgb(h, s, l) {
  const k = n => (n + h / 30) % 12;

  const a = s * Math.min(l, 1 - l);

  const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));

  return [f(0) * 255, f(8) * 255, f(4) * 255];
} // Relative luminance and the WCAG ratio, for the ink of the check drawn inside
// a chosen swatch: black or white, whichever reads better on it.

const linear = channel => {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};

const luminance = rgb => {
  const [r, g, b] = rgb.map(linear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrast = (one, two) => {
  const x = luminance(one);
  const y = luminance(two);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};
const darkInk = rgb => contrast(rgb, [0, 0, 0]) >= contrast(rgb, [255, 255, 255]);
const FORMATS = Object.freeze(['hex', 'rgb', 'hsl', 'hsb']);
const FORMAT_LABELS = Object.freeze({
  hex: 'Hex',
  rgb: 'RGB',
  hsl: 'HSL',
  hsb: 'HSB'
});
/** The code field's text for the colour [h, s, v] in a format. */

function formatColour([h, s, v], format) {
  const rgb = hsvToRgb(h, s, v);
  if (format === 'rgb') return rgb.map(Math.round).join(', ');

  if (format === 'hsl') {
    const [hue, sat, light] = rgbToHsl(rgb);
    return `${Math.round(hue)}°, ${Math.round(sat * 100)}%, ${Math.round(light * 100)}%`;
  }

  if (format === 'hsb') return `${Math.round(h)}°, ${Math.round(s * 100)}%, ${Math.round(v * 100)}%`;
  return toHex(rgb).toUpperCase();
}
const FUNCTION = /^(rgba?|hsla?|hsb|hsv)\(|\)$/giu;
/**
 * What the code field holds, read in the chosen format: {rgb, a} or null. A hex
 * is a hex in every format; three numbers are the format's channels; anything
 * else the browser calls a colour (oklch(), a name) is asked of `cssColour`,
 * which the element answers through the page (CSS.supports and a computed
 * style), so a developer may paste any CSS colour (R170).
 */

function parseColour(text, format, cssColour = () => null) {
  const value = String(text ?? '').trim();
  if (!value) return null;
  const hex = parseHex(value);
  if (hex && (format === 'hex' || value.startsWith('#'))) return hex;
  const body = value.replace(FUNCTION, '');
  const numbers = body.split(/[\s,/]+/u).filter(Boolean).map(part => parseFloat(part));
  const plain = !/[a-z(]/iu.test(body.replace(/[°%]/gu, ''));

  if (plain && numbers.length >= 3 && numbers.slice(0, 3).every(n => Number.isFinite(n))) {
    const [one, two, three] = numbers;
    const hue = (one % 360 + 360) % 360;
    if (format === 'rgb' && [one, two, three].every(n => n >= 0 && n <= 255)) return {
      rgb: [one, two, three],
      a: 1
    };
    if (format === 'hsl' && two >= 0 && two <= 100 && three >= 0 && three <= 100) return {
      rgb: hslToRgb(hue, two / 100, three / 100),
      a: 1
    };
    if (format === 'hsb' && two >= 0 && two <= 100 && three >= 0 && three <= 100) return {
      rgb: hsvToRgb(hue, two / 100, three / 100),
      a: 1
    };
  }

  if (hex) return hex;
  return cssColour(value);
}
/** Whether a typed colour names its own alpha (#rgba, #rrggbbaa). */

const statesAlpha = text => /^#?(?:[0-9a-f]{4}|[0-9a-f]{8})$/iu.test(String(text ?? '').trim());

/***/ },

/***/ "d26fa9fee686"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RECENT_KEEP: () => (/* binding */ RECENT_KEEP),
/* harmony export */   RECENT_KEY: () => (/* binding */ RECENT_KEY),
/* harmony export */   RECENT_SHOW: () => (/* binding */ RECENT_SHOW),
/* harmony export */   forgetRecentColours: () => (/* binding */ forgetRecentColours),
/* harmony export */   onRecentChange: () => (/* binding */ onRecentChange),
/* harmony export */   recentColours: () => (/* binding */ recentColours),
/* harmony export */   rememberColour: () => (/* binding */ rememberColour)
/* harmony export */ });
/* harmony import */ var _core_js_preferences_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("51250bf01ab0");
/* harmony import */ var _color_math_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("487aa4186372");

 // The recent own colours (owner decision C83, round 4 R168). One list for every
// colour field of the site, kept as a view preference under the key R168
// decided, sf-color-recent (SF.Preferences: the browser's copy is
// sf-pref:sf-color-recent, as for every preference, and the host's when one
// keeps preferences for its user), holding own colours only (a palette colour
// is always in the grid): lowercase #rrggbb, or #rrggbbaa below full alpha (the
// same hue at another alpha is another colour), newest first, a repeat moved
// to the top, sixteen kept and eight shown. Picking a recent colour counts as
// using it.
//
// Every bundle carries its own copy of this module, so the list and its
// listeners live on one shared global: two fields drawn by two bundles of the
// page still show the same row.

const RECENT_KEY = 'sf-color-recent';
const RECENT_KEEP = 16;
const RECENT_SHOW = 8;
const SHARED = Symbol.for('sf.input-color.recent');

const preferences = () => globalThis.SF?.Preferences || _core_js_preferences_js__WEBPACK_IMPORTED_MODULE_0__["default"];

function cleaned(saved) {
  const list = [];

  if (Array.isArray(saved)) {
    for (const item of saved) {
      const hex = (0,_color_math_js__WEBPACK_IMPORTED_MODULE_1__.normaliseHex)(item);
      if (hex && !list.includes(hex)) list.push(hex);
    }
  }

  return list.slice(0, RECENT_KEEP);
}

function store() {
  const scope = globalThis;

  if (!scope[SHARED]) {
    const shared = {
      list: cleaned(preferences()?.read(RECENT_KEY)),
      listeners: new Set()
    };
    scope[SHARED] = shared; // Another tab, or the host's values arriving after the first paint.

    preferences()?.subscribe(RECENT_KEY, value => {
      shared.list.splice(0, shared.list.length, ...cleaned(value));
      tell();
    });
  }

  return scope[SHARED];
}

function save(list) {
  if (list.length) preferences()?.write(RECENT_KEY, list);else preferences()?.remove(RECENT_KEY);
}

function tell() {
  for (const listener of store().listeners) {
    try {
      listener();
    } catch (error) {
      console.error(error);
    }
  }
}
/** Puts an own colour at the top of the list. A palette name or a non-hex is ignored. */


function rememberColour(value) {
  const hex = (0,_color_math_js__WEBPACK_IMPORTED_MODULE_1__.normaliseHex)(value);
  if (!hex) return;
  const {
    list
  } = store();
  const at = list.indexOf(hex);
  if (at >= 0) list.splice(at, 1);
  list.unshift(hex);
  list.length = Math.min(list.length, RECENT_KEEP);
  save(list);
  tell();
}
function forgetRecentColours() {
  store().list.length = 0;
  save([]);
  tell();
}
/**
 * The colours a field shows: without alpha it hides translucent ones -- it
 * cannot take that value, and a flattened lookalike would be another colour
 * than the one shown.
 */

function recentColours({
  alpha = false
} = {}) {
  return store().list.filter(hex => alpha || hex.length === 7);
}
function onRecentChange(listener) {
  const {
    listeners
  } = store();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/***/ },

/***/ "479baedb8be6"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   paintStyle: () => (/* binding */ paintStyle),
/* harmony export */   renderColorTemplate: () => (/* binding */ renderColorTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var _component_field_contract__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("e138a730fd7c");
/* harmony import */ var _helpers_inherited_value__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("778671c79fa6");
/* harmony import */ var _helpers_field_help__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("f39dc444b059");
/* harmony import */ var _color_math_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("487aa4186372");
/* harmony import */ var _default_css__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("4c914f7d071c");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, _component_field_contract__WEBPACK_IMPORTED_MODULE_1__, _helpers_inherited_value__WEBPACK_IMPORTED_MODULE_2__, _helpers_field_help__WEBPACK_IMPORTED_MODULE_3__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, _component_field_contract__WEBPACK_IMPORTED_MODULE_1__, _helpers_inherited_value__WEBPACK_IMPORTED_MODULE_2__, _helpers_field_help__WEBPACK_IMPORTED_MODULE_3__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);





 // sf-input-color draws a field of the control ladder -- a swatch, the value and a
// chevron -- that opens the Framework's own compact window (owner decision C83,
// prototype ui-control prototypes/color-picker-study.html rounds 3 and 4). The
// browser's colour dialog is not used: it was a different window in every
// browser, with no palette and no alpha (R130). The theme variant is only a
// circle of the current colour that opens the same window; the brand variant
// is the field with the colour's checks under it (C84).
// One painter for every swatch (R167, C86): an opaque colour is a plain fill;
// a translucent one is split -- its left half the same colour without alpha,
// its right half the colour as it is over the checkerboard (the prototype's
// round 4 sides, C86 as corrected on 2026-11-12) -- so a 20 % colour still
// shows its hue. The paint stays inside the 1 px border (R169).

function paintStyle(value) {
  if (!value) return '';
  if ((0,_color_math_js__WEBPACK_IMPORTED_MODULE_4__.isPaletteName)(value)) return `--sf-color-fill: ${(0,_color_math_js__WEBPACK_IMPORTED_MODULE_4__.paletteFill)(value)}; --sf-color-solid: ${(0,_color_math_js__WEBPACK_IMPORTED_MODULE_4__.paletteFill)(value)}`;
  return `--sf-color-fill: ${value}; --sf-color-solid: ${(0,_color_math_js__WEBPACK_IMPORTED_MODULE_4__.solidOf)(value) || value}`;
}

const translucent = value => Boolean(value) && !(0,_color_math_js__WEBPACK_IMPORTED_MODULE_4__.isPaletteName)(value) && (0,_color_math_js__WEBPACK_IMPORTED_MODULE_4__.alphaOf)(value) < 1;

function renderChip(value, className = 'sf-color-chip') {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class=${className}
                      style=${paintStyle(value) || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                      ?data-alpha=${translucent(value)}
                      ?data-empty=${!value}
                      aria-hidden="true"></span>`;
}

function renderColorTemplate(context) {
  if (context.variant === 'theme') return renderThemeTemplate(context);
  const {
    painted,
    isSet,
    disabled,
    readonly,
    size,
    appearance,
    open
  } = context;
  const component = context.component;
  const name = context.label || context.ariaLabel || (context.brand ? context.brandLabel : context.chooseLabel);
  const shown = context.paintedName; // The value is read with the name: «Цвет метки: Синий». While the
  // inherited colour applies the name is the label alone: the inherited
  // sentence in the description says the colour (GB20 triage,
  // inherited-description), so it is not heard twice.

  const spoken = shown && isSet ? `${name}: ${shown}` : name; // The line under the field is sf-input's (fields ladder, 2026-11-14): the
  // help, or the error in its place while the field is invalid and says why.

  const field = (0,_component_field_contract__WEBPACK_IMPORTED_MODULE_1__.createFieldContract)(component, {
    prefix: 'sf-input-color',
    invalid: context.invalid,
    hint: context.hint,
    errorMessage: context.errorMessage
  });
  const messageIsError = Boolean(field.invalid && context.errorMessage); // What the field says. A chosen palette colour is its word, an own colour
  // its code; while the inherited colour applies the field shows it in the
  // same place, with the shared «наследуется» marker at the end (CO-07: the
  // marker stood 16 px after where the code starts).

  const text = painted ? (0,_color_math_js__WEBPACK_IMPORTED_MODULE_4__.isPaletteName)(painted) ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-color-name">${shown}</span>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<code>${painted}</code>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-color-empty">${context.hasInheritedValue ? '' : context.inheritedText}</span>`;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-color-field sf-color-field--size-${size}${field.invalid ? ' error' : ''}">
            ${context.label // One field label look for every field (FB-10, CO-04):
  // the trigger carries the same words as its name, so the
  // visible copy is hidden from the accessibility tree.
  // The «?» of help (C153 (8), helpers/field-help.js) stands
  // after the label in one row, outside the hidden copy so
  // it is reached and read; without help the label is the
  // row, as before.
  ? context.help ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-color-label-row"><span class="sf-color-label" aria-hidden="true">${context.label}</span>${(0,_helpers_field_help__WEBPACK_IMPORTED_MODULE_3__.renderFieldHelp)({
    help: context.help,
    label: context.label,
    size,
    className: 'sf-color-help',
    component
  })}</span>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-color-label" aria-hidden="true">${context.label}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            <div class="sf-color sf-color--${appearance} sf-color--size-${size}"
                 data-set=${isSet ? 'true' : 'false'}
                 data-open=${open ? 'true' : 'false'}>
                <div class="sf-color-frame"
                     ?data-disabled=${disabled}
                     ?data-readonly=${readonly && !disabled}
                     @click=${event => {
    if (disabled || readonly || event.target.closest?.('[data-inherited-reset], [data-action="clear"]')) return;
    component.togglePicker();
  }}>
                    ${readonly && !disabled // Read-only (as sf-input's readonly): the value to
  // read, not a control -- no popup, no Tab stop of its
  // own; «name: value» is what a screen reader hears.
  ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-color-trigger" role="img" aria-label=${spoken}
                                         aria-describedby=${field.describedBy || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
                                    ${renderChip(painted)}
                                    <span class="sf-color-text">${text}</span>
                                </span>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<button type="button"
                            class="sf-color-trigger"
                            title=${context.chooseLabel}
                            aria-haspopup="dialog"
                            aria-expanded=${open ? 'true' : 'false'}
                            aria-label=${spoken}
                            aria-describedby=${field.describedBy || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                            ?disabled=${disabled}>
                        ${renderChip(painted)}
                        <span class="sf-color-text">${text}</span>
                    </button>`}
                    ${context.hasInheritedValue // The marker while the inherited colour applies,
  // the reset once a colour is chosen: the slot every
  // field uses.
  ? (0,_helpers_inherited_value__WEBPACK_IMPORTED_MODULE_2__.renderInheritedSlot)(context.component, {
    size,
    disabled: disabled || readonly,
    className: 'sf-color-inherited-slot'
  }) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    ${context.clearable && isSet && !context.hasInheritedValue && !readonly // The reset is an action inside the field (owner
  // decision C123): the field layer's .sf-field-action
  // (component.inputs), the glyph sf-input's clear and
  // reveal draw -- no plate in any state, the quiet ink
  // at rest and the text's ink under the pointer, the
  // ring round the glyph, an invisible hit area the
  // field's inner height. Its name is the variant's
  // reset words (clearLabel).
  ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                                <button type="button"
                                        class="sf-field-action sf-color-reset"
                                        data-action="clear"
                                        aria-label=${context.clearLabel}
                                        title=${context.clearLabel}
                                        ?disabled=${disabled}
                                        @click=${event => {
    event.stopPropagation();
    component.clear();
  }}
                                ><sf-icon icon="restart_alt" aria-hidden="true"></sf-icon></button>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    ${readonly && !disabled ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-icon icon=${open ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                             root-class="sf-color-chevron"
                             aria-hidden="true"></sf-icon>`}
                </div>
                ${context.hiddenName // Without ElementInternals the form gets the value from
  // a hidden input, empty while the inherited colour applies.
  ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<input type="hidden" name=${context.hiddenName} .value=${context.value}>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            </div>
            ${field.message ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-color-hint" id=${field.messageId}
                                 data-field-message=${messageIsError ? 'error' : 'hint'}>${field.message}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ${context.brand ? renderChecks(context) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ${open ? renderWindow(context, name) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        </div>
    `;
} // variant brand (C84): what a person should know about the colour, one line
// each under the field (core themeChecks: contrast, a colour its buttons do
// not get, a colour near a status, a grey), as the accepted settings screen
// shows them. A polite status region that is always in the tree, so a check
// that appears is announced; empty, it takes no room.

function renderChecks(context) {
  const {
    checks
  } = context;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-color-checks" role="status" aria-label=${context.checksLabel} data-count=${checks.length}>
            ${checks.length ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                        <ul class="sf-color-check-list">
                            ${checks.map(check => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                                <li class="sf-color-check" data-check=${check.code} data-level=${check.level}
                                    data-status=${check.status || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
                                    <sf-icon icon=${check.level === 'notice' ? 'info' : check.level} size="1/2" aria-hidden="true"></sf-icon>
                                    <span class="sf-color-check-text">${check.text}</span>
                                </li>`)}
                        </ul>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        </div>
    `;
} // variant theme (C84): only a circle of the current colour, as a site header
// holds it; a press opens the same window as the field, at its normal size,
// with no text and no theme row. The button is what a keyboard reaches and
// what a screen reader names («Цвет темы», «Theme colour»).


function renderThemeTemplate(context) {
  const {
    isSet,
    disabled,
    size,
    open
  } = context;
  const component = context.component;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-color sf-color--theme sf-color--size-${size}"
             data-set=${isSet ? 'true' : 'false'}
             data-open=${open ? 'true' : 'false'}>
            <button type="button"
                    class="sf-color-dot sf-color-trigger"
                    data-action="theme"
                    aria-haspopup="dialog"
                    aria-expanded=${open ? 'true' : 'false'}
                    aria-label=${context.themeLabel}
                    title=${context.themeLabel}
                    ?disabled=${disabled}
                    @click=${() => component.togglePicker()}>
                ${renderChip(context.themeColor, 'sf-color-chip sf-color-chip--round')}
            </button>
            ${context.hiddenName ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<input type="hidden" name=${context.hiddenName} .value=${context.value}>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ${context.clearable && isSet ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                        <sf-button-icon
                                appearance="ghost"
                                scheme="on-surface"
                                size=${size}
                                icon="restart_alt"
                                data-action="clear"
                                aria-label=${context.themeResetLabel}
                                title=${context.themeResetLabel}
                                ?disabled=${disabled}
                                @click=${() => component.clear()}
                        ></sf-button-icon>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ${open ? renderWindow(context, context.themeLabel) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        </div>
    `;
} // The window's own fields (the code, the %) send the browser's input and
// change, with no detail; they stop at the window, so the host's input and
// change are only its own, with {value, name}.


const stopNative = event => event.stopPropagation(); // The window: 304 wide on a desktop (eight 28 px swatches, 8 apart, 12 inside),
// anchored under the field and never taller than the room it has; a sheet at
// the bottom of the screen on a phone. «Палитра» and «Своё» replace each other
// in place under the standard segmented control (R147, R149, R151).


function renderWindow(context, name) {
  const {
    component,
    word
  } = context;
  const both = context.offersPalette && context.offersCustom;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-color-window"
             role="dialog"
             aria-label=${name}
             tabindex="-1"
             @input=${stopNative}
             @change=${stopNative}>
            ${both ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                        <div class="sf-color-views">
                            <sf-segmented size="1/2"
                                          full-width
                                          aria-label=${word('how')}
                                          items=${JSON.stringify([{
    value: 'palette',
    label: word('palette')
  }, {
    value: 'own',
    label: word('own')
  }])}
                                          value=${context.view}
                                          @change=${event => {
    event.stopPropagation();
    const view = event.detail?.value;
    if (view) component.showView(view);
  }}></sf-segmented>
                        </div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ${context.view === 'own' ? renderOwn(context) : renderPalette(context)}
        </div>
    `;
}

function renderOptions(context, list, {
  label,
  own = false,
  className = ''
}) {
  const {
    component,
    value
  } = context;
  const chosen = list.findIndex(item => item.value === value);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-color-options ${className}"
             role="radiogroup"
             aria-label=${label}
             @keydown=${event => component.optionKey(event)}>
            ${list.map((item, index) => {
    const checked = item.value === value;
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                    <button type="button"
                            class="sf-color-option"
                            role="radio"
                            aria-checked=${checked ? 'true' : 'false'}
                            tabindex=${index === (chosen < 0 ? 0 : chosen) ? '0' : '-1'}
                            data-value=${item.value}
                            data-own=${own ? 'true' : 'false'}
                            aria-label=${item.name}
                            title=${item.name}
                            ?data-alpha=${translucent(item.value)}
                            style=${`${paintStyle(item.value)}${checked ? `; --sf-color-ink: ${component.inkFor(item.value)}` : ''}`}
                            ?disabled=${context.disabled}
                            @click=${() => component.pick(item.value, {
      own
    })}>
                        ${checked ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-icon icon="check" root-class="sf-color-check" aria-hidden="true"></sf-icon>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    </button>`;
  })}
        </div>
    `;
} // «Палитра»: the product's own colours first, then the sixteen palette hues,
// then -- after a thin divider, with no caption -- the recent own colours, the
// current own colour first and chosen (R153, R168).


function renderPalette(context) {
  const {
    component,
    word
  } = context;
  const hues = (context.hues ?? []).map(hue => ({
    value: hue,
    name: component.colourName(hue)
  }));
  const recent = context.recentRow.map(hex => ({
    value: hex,
    name: (0,_color_math_js__WEBPACK_IMPORTED_MODULE_4__.alphaOf)(hex) < 1 ? word('recent-alpha', {
      value: hex,
      alpha: Math.round((0,_color_math_js__WEBPACK_IMPORTED_MODULE_4__.alphaOf)(hex) * 100)
    }) : word('recent-one', {
      value: hex
    })
  }));
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-color-palette">
            ${context.swatchList.length ? renderOptions(context, context.swatchList, {
    label: word('product'),
    className: 'sf-color-options--product'
  }) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ${component.showsHues ? renderOptions(context, hues, {
    label: word('palette')
  }) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ${recent.length ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-color-recent">${renderOptions(context, recent, {
    label: word('recent'),
    own: true
  })}</div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        </div>
    `;
} // «Своё», laid out as Figma's (R154): the shade area; the eyedropper left of
// the stacked hue and alpha strips; at the bottom one row (owner decision
// C209, prototype colour-field-study #q-cf-simple B): the code field -- always
// hex, any CSS colour may be typed or pasted, the copy action at its end
// (C123), the % after it with `alpha` -- and «Применить» on its right. The
// format menu is gone. Without `alpha` the alpha strip and the % field are
// not drawn.


function renderOwn(context) {
  const {
    component,
    word
  } = context;
  const [h, s, v] = context.hsv;
  const alpha = context.alphaValue;
  const percent = Math.round(alpha * 100);
  const solid = (0,_color_math_js__WEBPACK_IMPORTED_MODULE_4__.solidOf)(context.ownColour);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-color-own">
            <div class="sf-color-area"
                 role="slider"
                 tabindex="0"
                 aria-label=${word('shade')}
                 aria-valuemin="0"
                 aria-valuemax="100"
                 aria-valuenow=${Math.round(s * 100)}
                 aria-valuetext=${word('shade-value', {
    saturation: Math.round(s * 100),
    brightness: Math.round(v * 100)
  })}
                 style=${`--sf-color-hue: ${Math.round(h * 10) / 10}`}
                 @pointerdown=${event => component.dragOn(event, 'area')}
                 @keydown=${event => component.keyOn(event, 'area')}>
                <span class="sf-color-thumb"
                      style=${`inset-inline-start: ${s * 100}%; inset-block-start: ${(1 - v) * 100}%; --sf-color-fill: ${solid}; --sf-color-solid: ${solid}`}></span>
            </div>
            <div class="sf-color-tools">
                <sf-button-icon size="1/2"
                                appearance="ghost"
                                scheme="on-surface"
                                icon="colorize"
                                data-action="eyedropper"
                                aria-label=${word('eyedropper')}
                                title=${context.hasEyeDropper ? word('eyedropper') : word('eyedropper-missing')}
                                ?disabled=${!context.hasEyeDropper || context.disabled}
                                @click=${() => component.eyedrop()}></sf-button-icon>
                <div class="sf-color-strips">
                    <div class="sf-color-strip sf-color-strip--hue"
                         role="slider"
                         tabindex="0"
                         aria-label=${word('hue')}
                         aria-valuemin="0"
                         aria-valuemax="360"
                         aria-valuenow=${Math.round(h)}
                         aria-valuetext=${word('hue-value', {
    hue: Math.round(h)
  })}
                         @pointerdown=${event => component.dragOn(event, 'hue')}
                         @keydown=${event => component.keyOn(event, 'hue')}>
                        <span class="sf-color-thumb"
                              style=${`inset-inline-start: ${h / 360 * 100}%; --sf-color-fill: hsl(${Math.round(h)} 100% 50%); --sf-color-solid: hsl(${Math.round(h)} 100% 50%)`}></span>
                    </div>
                    ${context.alpha ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                                <div class="sf-color-strip sf-color-strip--alpha"
                                     role="slider"
                                     tabindex="0"
                                     aria-label=${word('alpha')}
                                     aria-valuemin="0"
                                     aria-valuemax="100"
                                     aria-valuenow=${percent}
                                     aria-valuetext=${word('alpha-value', {
    alpha: percent
  })}
                                     style=${`--sf-color-solid: ${solid}`}
                                     @pointerdown=${event => component.dragOn(event, 'alpha')}
                                     @keydown=${event => component.keyOn(event, 'alpha')}>
                                    <span class="sf-color-thumb"
                                          ?data-alpha=${alpha < 1}
                                          style=${`inset-inline-start: ${percent}%; ${paintStyle(context.ownColour)}`}></span>
                                </div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                </div>
            </div>
            <div class="sf-color-bottom">
                <div class="sf-color-code-row sf-input-field" role="group" aria-label=${word('code')}>
                    <input type="text"
                           class="sf-color-code"
                           spellcheck="false"
                           autocomplete="off"
                           aria-label=${word('code')}
                           aria-invalid=${context.codeError ? 'true' : 'false'}
                           .value=${context.codeText}
                           @input=${event => component.codeOn(event, false)}
                           @change=${event => component.codeOn(event, true)}
                           @keydown=${event => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    component.codeOn(event, true);
  }}>
                    <sf-button-copy class="sf-color-copy"
                                    size="1/2"
                                    value=${context.copyText}
                                    duration=${String(context.copyShown)}
                                    label=${word('copy')}></sf-button-copy>
                    ${context.alpha ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                                <span class="sf-color-percent">
                                    <input type="text"
                                           class="sf-color-alpha-input"
                                           inputmode="numeric"
                                           maxlength="3"
                                           aria-label=${word('opacity')}
                                           .value=${String(percent)}
                                           @input=${event => component.alphaOn(event, false)}
                                           @change=${event => component.alphaOn(event, true)}
                                           @keydown=${event => component.alphaKeyOn(event)}>
                                    <span aria-hidden="true">%</span>
                                </span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                </div>
                <sf-button class="sf-color-apply"
                           size="1/2"
                           text=${word('apply')}
                           data-action="apply"
                           ?disabled=${context.disabled}
                           @click=${() => component.applyCode()}></sf-button>
            </div>
            <div class="sf-color-error" aria-live="polite">${context.codeError}</div>
        </div>
    `;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "c6c9dfe31af4"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "4c914f7d071c"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


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

/***/ "66c1d5ac920d"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   files: () => (/* binding */ files)
/* harmony export */ });
/* harmony import */ var _en_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("068ec0d4d41c");
// Written by scripts/build-language-packs.mjs from src/core/lang/built-in.json
// (owner decision C282); do not edit. The words this bundle carries: the
// built-in languages' (en); every other language comes from
// a language file (core/lang/<code>.js or its parts).


const files = { en: { runtime: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime } };

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ en: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime });


/***/ },

/***/ "865ba3b0c2c6"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases for the shim (core/js/aliases.js, standard simai.smart-component 1.3.8 §16.20). Event rows send the new name first, then the old one, with one detail; setting rows map the old attribute and property to the new; host-attribute rows (no \\"to\\") stay host attributes read by the browser or the base and are listed, refused by the shim on purpose; documentary rows (\\"shim\\": \\"none\\") record a rename the shim cannot serve.","component":"sf-input-color","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"sf-field:reset","to":"sf-field-reset","kind":"event","component":"sf-input-color","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","section":"§8, §20.2","note":"the event of the trait field-inherit@1, declared in component.json as the shared event field-reset; the field sends sf-field-reset and the shim follows it with this dated name, same detail, one cancel"},{"from":"shown","to":"effective-value","kind":"value","component":"sf-input-color","since":"2026-10-27","remove_after":"2026-12-01","section":"§4.1, §4.3","note":"the getter shown returned the painted colour; shown is now the base value (a boolean) on every element, so the old meaning cannot be served beside it: read effectiveValue","shim":"none"},{"from":"sf-color","to":"sf-input-color","kind":"tag","component":"sf-input-color","since":"2026-11-03","remove_after":"2027-01-01","section":"rename plan R0 (ui-control RENAME-PLAN-2026-11-03), naming decision 2026-11-02","note":"the element is sf-input-color; sf-color is a subclass defined beside it until the date"}]}');

/***/ },

/***/ "8a9b84fc1bd6"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.input-color","tag":"sf-input-color","version":"1.20.1","kind":"leaf","traits":["field-inherit@1"],"settings":{"size":{"type":"enum","values":["1/3","1/2","1","2","3"],"default":"1"},"appearance":{"type":"enum","values":["bordered","outlined","plain"],"default":"bordered"},"variant":{"type":"enum","values":["field","theme","brand"],"default":"field"},"target":{"type":"string","default":""},"swatches":{"type":"string","default":""},"palette":{"type":"boolean","default":true},"custom":{"type":"boolean","default":true},"alpha":{"type":"boolean","default":false},"clearable":{"type":"boolean","default":false},"disabled":{"type":"boolean","default":false},"readonly":{"type":"boolean","default":false},"name":{"type":"string","default":""},"label":{"type":"string","default":""},"hint":{"type":"string","default":""},"help":{"type":"string","default":""},"invalid":{"type":"boolean","default":false},"error-message":{"type":"string","default":""},"choose-label":{"type":"string","default-from":"runtime.choose"},"clear-label":{"type":"string","default-from":"runtime.clear"}},"values":{"value":{"type":"string","default":""},"effective-value":{"type":"string"},"theme":{"type":"object"},"checks":{"type":"list"}},"events":{"change":{"carries":{"value":"string","name":"string","theme":"object","variables":"object","css":"string","checks":"list"}},"input":{"carries":{"value":"string","name":"string","theme":"object","variables":"object","css":"string","checks":"list"}},"field-reset":{"shared":"field-inherit@1","cancelable":true,"carries":{"tag":{"type":"string"},"value":{"type":"string"},"inherited-value":{"type":"string"},"name":{"type":"string"}}}},"actions":{"clear":{}},"form":{"value":"value","name":"name","default":"value","submits":"value","reset":"default","disabled":"disabled","validity":["custom-error"]},"host-states":{"data-inherited":"boolean"},"css-variables":{"--sf-color-gap":{"type":"length"},"--sf-color-chip-radius":{"type":"length"},"--sf-color-chip-border-color":{"type":"color","state":"rest"},"--sf-color-swatches-gap":{"type":"length"},"--sf-color-inherited-color":{"type":"color","state":"inherited"}}}');

/***/ },

/***/ "068ec0d4d41c"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Color","runtime":{"choose":"Choose a colour","clear":"Use the inherited colour","inherited":"inherited","reset":"Reset to inherited","described":"Inherited: {value}","value-missing":"Choose a colour.","theme":"Theme colour","theme-reset":"Use the original theme colour","brand-reset":"Restore SIMAI colour","how":"How to choose the colour","palette":"Palette","own":"Custom","product":"Product colours","recent":"Recent custom colours","recent-one":"Custom colour {value}","recent-alpha":"Custom colour {value}, opacity {alpha} %","shade":"Saturation and brightness","shade-value":"saturation {saturation} %, brightness {brightness} %","hue":"Hue","hue-value":"hue {hue}°","alpha":"Transparency","alpha-value":"opacity {alpha} %","eyedropper":"Pick a colour from the screen","eyedropper-missing":"The eyedropper is only in Chrome and Edge on a computer","code":"Colour code","copy":"Copy the code","apply":"Apply","opacity":"Opacity, per cent","not-a-colour":"This does not read as a colour","hue-red":"Red","hue-orange":"Orange","hue-amber":"Amber","hue-yellow":"Yellow","hue-lime":"Lime","hue-green":"Green","hue-teal":"Teal","hue-cyan":"Cyan","hue-sky":"Sky","hue-blue":"Blue","hue-indigo":"Indigo","hue-violet":"Violet","hue-purple":"Purple","hue-pink":"Pink","hue-brown":"Brown","hue-gray":"Grey","check-adjusted-dark":"The colour is very dark: buttons get the lighter {to} instead of {from}, or they would not stand out from the text.","check-adjusted-light":"The colour is light: buttons get the darker {to} instead of {from}, or their text could not be read.","check-contrast":"Text on a button is hard to read in the {scheme} theme: {ratio} : 1, 4.5 is needed.","check-grey":"The colour is nearly grey: the accents are grey too, and buttons and links stand out little from the text.","check-status-error":"The colour is close to the error colour: an ordinary button and «Delete» will look almost the same.","check-status-info":"The colour is close to the information colour: an accent may read as a hint or a notice.","check-status-success":"The colour is close to the success colour: an accent may read as «Done» or «Paid».","check-status-warning":"The colour is close to the warning colour: an accent may read as «Attention».","checks":"Colour check","scheme-dark":"dark","scheme-light":"light","brand":"Brand colour","help":"More about: {label}"}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("486422991550");
/******/
/******/ })()
;