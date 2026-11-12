/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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

/***/ "d72a94301527"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ICONS: () => (/* binding */ ICONS),
/* harmony export */   SIZE_REMOVE_AFTER: () => (/* binding */ SIZE_REMOVE_AFTER),
/* harmony export */   SNOOZE: () => (/* binding */ SNOOZE),
/* harmony export */   STATUSES: () => (/* binding */ STATUSES),
/* harmony export */   STATUS_GLYPHS: () => (/* binding */ STATUS_GLYPHS),
/* harmony export */   SfListAttention: () => (/* binding */ SfListAttention),
/* harmony export */   listIcons: () => (/* binding */ listIcons),
/* harmony export */   momentOf: () => (/* binding */ momentOf),
/* harmony export */   normalizeItems: () => (/* binding */ normalizeItems),
/* harmony export */   normalizePassed: () => (/* binding */ normalizePassed),
/* harmony export */   statusOf: () => (/* binding */ statusOf)
/* harmony export */ });
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("43090d1c8307");
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("d3818183b14c");
/* harmony import */ var _helpers_cycle__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("64feefebb417");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("a18165be158e");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("565cca359e31");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("3c901318836b");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("9a754872f29c");
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("2011d1065c58");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_2__, _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_3__, _js_templates_default__WEBPACK_IMPORTED_MODULE_5__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_2__, _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_3__, _js_templates_default__WEBPACK_IMPORTED_MODULE_5__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_core_js_page_language__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_3__);
// sf-list-attention: the problems that need a person, on an overview screen --
// server health, site checks, import errors, update readiness, a form's
// validation summary:
//
//   <sf-list-attention triage checked-at="2026-11-09T14:05:00+03:00" more-href="/checks/">
//     <script type="application/json" data-sf-settings>
//     {"items": [{"id": "cert", "status": "warning", "title": "…",
//       "object": {"label": "crm.dealer-auto.ru", "href": "/sites/12/"},
//       "since": "2026-11-08T10:00:00+03:00", "source": "Сертификаты",
//       "action": {"label": "Продлить", "href": "/ssl/"}}]}
//   </script></sf-list-attention>
//
// Owner decision C37 (2026-11-09; ui-control control/research/
// 2026-11-09-list-attention.md, prototypes/list-attention.html scenes А, Б):
// a card with a summary of badges per severity in its head, rows of a filled
// status icon, the title, a line of what · how long · where, one quiet action
// and the «⋯» triage menu (snooze a day or a week, do not remind, about the
// check), at most `limit` rows and «Все проблемы (N)», «Проверено …» with a
// recheck, «Всё в порядке · проверено …» when empty; group="severity" is the
// full checks page: disclosure groups, a collapsed «Пройдено», an aligned
// affected column.
//
// The items are ordered error, warning, info, success; inside a status the
// longest-lasting first where since is given, then the host's order. The
// list orders, counts and draws; the host owns the problems: it checks, sets
// the whole list again when one appears or ends, and does the actions. A
// snoozed or dismissed item is set aside here at once (the host hears
// snooze or dismiss and stores it), and the notice's «Вернуть» brings it back
// with undo. The list stores and loads nothing.
//
// From its component.json (standard simai.smart-component 1.3.15 §3, §4,
// §8): the settings are made by core/js/element-manifest.js, the words are
// the language files'.









 // The heading's id, one per list on the page (stable across renders).

let sequence = 0;
const STATUSES = ['error', 'warning', 'info', 'success'];
const RANK = {
  error: 0,
  warning: 1,
  info: 2,
  success: 3
}; // sf-alert's status icons, by the shared status words.

const ICONS = {
  error: 'error',
  warning: 'warning',
  info: 'info',
  success: 'check_circle'
};
const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR; // The snooze lengths of the «⋯» menu, in days.

const SNOOZE = {
  'snooze-day': 1,
  'snooze-week': 7
}; // size is deprecated (1.2.0; change journal attribute-list-attention-size-to-density):
// decision C22 gives the density to the page (data-sf-density, a compact
// context), never to a manual size, and in sf-list-timeline size="1/2" is a
// smaller rung, not the compact density. Until 2027-01-01 size="1/2" still
// draws this list compact, as 1.1's own small rung did; it is noted in
// SF.deprecations and said once per page in the console with its
// replacement -- by the component only when the page has not opted in to
// deprecation warnings (data-sf-deprecations="warn"), where SF.deprecations
// already prints it, so a page sees one warning, not two.

const SIZE_REMOVE_AFTER = '2027-01-01';

function noteSize(host) {
  if (!host.hasAttribute('size')) return;
  (0,_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_3__.noteDeprecated)({
    component: 'sf-list-attention',
    kind: 'attribute',
    from: 'size',
    to: 'data-sf-density',
    since: '2026-11-10',
    remove_after: SIZE_REMOVE_AFTER
  });
  const root = globalThis.SF = globalThis.SF || {};
  const optedIn = globalThis.document?.documentElement?.dataset?.sfDeprecations === 'warn' || root.deprecations?.warn === true;
  if (optedIn || root.__sfListAttentionSizeWarned) return;
  Object.defineProperty(root, '__sfListAttentionSizeWarned', {
    value: true,
    configurable: true
  });
  globalThis.console?.warn?.(`[SIMAI Framework] sf-list-attention: size is deprecated until ${SIZE_REMOVE_AFTER}; the density comes from the page -- write data-sf-density="compact" on the list or on the region or page around it. See contracts/changes/journal.json (attribute-list-attention-size-to-density).`);
} // The icons this list can draw, asked for when it connects and when it draws
// (R074 F3; preloadControlIcons, as sf-segmented and sf-tag do). The status
// icons are filled glyphs of their own <i>, scanned only after the page's
// first icon request: they went in a second one and, on icons.simai.io, drew
// at 1.05-1.15 s against rows at 0.11 s, while the icon is the row's only
// visible status sign. Every status the list can draw is declared when it
// connects -- before the host has set any items, so the list does not wait
// for its data -- filled for the rows (check_circle for passed and the empty
// line) and outlined for the head's badges (sf-badge icon-start), which,
// left out, asked the same list again. The settings known at connect add
// the controls' glyphs: the «⋯» and its menu with triage, the recheck with
// checked-at, «Все проблемы» / «Показать все» outside group mode, the
// chevron in group mode --
// so a host whose items come late still sends one request. What the data
// adds (a help link's menu without triage) is added when drawn. One list
// per host, asked once while it stays the same.


const MENU_ICONS = ['schedule', 'event', 'notifications_off', 'help'];
const STATUS_GLYPHS = Object.freeze([...STATUSES.map(one => ({
  icon: ICONS[one],
  filled: true
})), ...STATUSES.map(one => ({
  icon: ICONS[one],
  filled: false
}))]);
function listIcons(host, context = null) {
  const entries = [...STATUS_GLYPHS];

  const add = (icon, filled) => {
    if (icon && !entries.some(one => one.icon === icon && one.filled === filled)) entries.push({
      icon,
      filled
    });
  };

  const menu = () => ['more_horiz', ...MENU_ICONS].forEach(icon => add(icon, false));

  if (host?.hasAttribute?.('triage')) menu();
  if (host?.hasAttribute?.('checked-at')) add('refresh', false); // «Все проблемы» with more-href, or «Показать все» past the limit, which
  // the items decide later: every list but group mode can show it.

  if (host?.getAttribute?.('group') === 'severity') add('expand_more', false);else if (host) add('arrow_forward', false);
  if (!context) return entries;
  const rows = context.grouped ? (context.groups ?? []).flatMap(one => one.items) : context.list ?? [];
  if (rows.some(item => item.menu)) menu();
  if (context.checked) add('refresh', false);
  if (context.more) add('arrow_forward', false);
  if (context.grouped) add('expand_more', false);
  return entries;
}

const text = value => value === undefined || value === null ? '' : String(value).trim();
/** An item's status: the four words; danger is read as error, anything else as info. */


function statusOf(value) {
  const word = text(value).toLowerCase();
  if (word === 'danger') return 'error';
  return STATUSES.includes(word) ? word : 'info';
}
/** A moment given as an ISO date-time or a number of milliseconds; NaN when neither. */

function momentOf(value) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : NaN;
  const given = text(value);
  if (!given) return NaN;
  return /^-?\d+$/u.test(given) ? Number(given) : Date.parse(given);
}
/**
 * The items as given, made safe and ordered by severity; inside a status the
 * longest-lasting first where since is given (an item without one after
 * them), then the host's order. An item without an id or a title, or with an
 * id seen before, is left out. An action needs a label and an href or an
 * event; an object a label.
 */

function normalizeItems(value) {
  const list = Array.isArray(value) ? value : [];
  const seen = new Set();
  const items = [];
  list.forEach((item, order) => {
    if (!item || typeof item !== 'object') return;
    const id = text(item.id);
    const title = text(item.title);
    if (!id || !title || seen.has(id)) return;
    seen.add(id);
    const given = item.action && typeof item.action === 'object' ? item.action : null;
    const label = text(given?.label);
    const href = text(given?.href);
    const event = text(given?.event);
    const object = item.object && typeof item.object === 'object' ? item.object : null;
    const objectLabel = text(object?.label);
    const since = momentOf(item.since);
    items.push({
      id,
      status: statusOf(item.status),
      title,
      text: text(item.text),
      action: label && (href || event) ? {
        label,
        href,
        event
      } : null,
      object: objectLabel ? {
        label: objectLabel,
        href: text(object.href)
      } : null,
      since: Number.isFinite(since) ? since : null,
      source: text(item.source),
      affected: text(item.affected),
      help: text(item.help),
      dismissible: typeof item.dismissible === 'boolean' ? item.dismissible : null,
      order
    });
  });

  const age = (a, b) => {
    if (a.since !== null && b.since !== null) return a.since - b.since;
    if (a.since !== null) return -1;
    if (b.since !== null) return 1;
    return 0;
  };

  return items.sort((a, b) => RANK[a.status] - RANK[b.status] || age(a, b) || a.order - b.order);
}
/** The passed checks of group mode: strings or {id?, title, text?}. */

function normalizePassed(value) {
  const list = Array.isArray(value) ? value : [];
  return list.map((item, index) => {
    if (typeof item === 'string') return {
      id: `passed-${index}`,
      title: text(item),
      text: ''
    };
    if (!item || typeof item !== 'object') return null;
    return {
      id: text(item.id) || `passed-${index}`,
      title: text(item.title),
      text: text(item.text)
    };
  }).filter(item => item && item.title);
} // The narrow column's parts (C45): the summary as a line of text, the quiet
// line's two lines and its icon recheck.

const NARROW_PARTS = ['.sf-list-attention-summary-line', '.sf-list-attention-quiet-title', '.sf-list-attention-quiet-meta', '.sf-list-attention-recheck--narrow'].join(', ');
const ListAttentionElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_6__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_7__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_8__
  },
  source: 'ru'
});

class SfListAttention extends ListAttentionElement {
  constructor() {
    super();
    this._headingId = `sf-list-attention-heading-${++sequence}`; // Set aside by snooze or dismiss: id -> 'snooze' | 'dismiss'.

    this._aside = new Map(); // The rows past the limit shown in place (no more-href).

    this._all = false; // Group mode: which groups are open; «Пройдено» starts closed.

    this._open = {
      error: true,
      warning: true,
      info: true,
      success: true,
      passed: false
    };
    this._menuFor = '';
    this._focusAfter = null;
  }

  connectedCallback() {
    super.connectedCallback(); // Before the first draw and before any items: every status glyph.

    if (this.isConnected) (0,_helpers_cycle__WEBPACK_IMPORTED_MODULE_4__.preloadControlIcons)(this, listIcons(this));
  }
  /** Every item the host gave, ordered, the set-aside ones left out. */


  get list() {
    const all = normalizeItems(this.items); // An id the host no longer gives was dealt with: forget it.

    const ids = new Set(all.map(item => item.id));

    for (const id of [...this._aside.keys()]) if (!ids.has(id)) this._aside.delete(id);

    return all.filter(item => !this._aside.has(item.id));
  }

  get grouped() {
    return this.group === 'severity';
  } // ── what a press does ───────────────────────────────────────────────────
  // A link (an action, an object or the help of a check): the request
  // first; not cancelled, the browser follows it.


  onNavigate(event, item, part = 'action') {
    if (event.defaultPrevented || event.button > 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const href = part === 'object' ? item.object?.href ?? '' : part === 'help' ? item.help ?? '' : item.action?.href ?? '';
    const allowed = this.sfEmit('navigate', {
      id: item.id,
      status: item.status,
      href,
      part
    }, {
      cancelable: true
    });
    if (!allowed) event.preventDefault();
  } // An action button: the fact; the host does it.


  onApply(item) {
    this.sfEmit('apply', {
      action: item.action?.event ?? '',
      scope: 'entry',
      ids: [item.id],
      id: item.id,
      status: item.status
    });
  } // «Все проблемы (N)»: with more-href a link, asked first; without it the
  // rows past the limit open in place.


  onAll(event) {
    const href = this.moreHref;

    if (href) {
      if (event.defaultPrevented || event.button > 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const allowed = this.sfEmit('all', {
        href
      }, {
        cancelable: true
      });
      if (!allowed) event.preventDefault();
      return;
    }

    if (!this.sfEmit('all', {
      href: ''
    }, {
      cancelable: true
    })) return;
    this._all = true;
    this.requestComponentUpdate('all');
  }

  onRecheck() {
    this.sfEmit('recheck', {});
  }

  onToggleGroup(key) {
    this._open[key] = !this._open[key];
    this.requestComponentUpdate('group');
  } // ── the «⋯» menu ────────────────────────────────────────────────────────


  get menu() {
    return this.querySelector(':scope > .sf-list-attention > .sf-list-attention-menu');
  }
  /**
   * May this item be dismissed: the page's permission (the host's
   * dismissible) gates it; an item's dismissible: false only takes it away,
   * an item can never grant it to a person without the right.
   */


  canDismiss(item) {
    return this.dismissible === true && item.dismissible !== false;
  }
  /** The entries of an item's «⋯»: snooze and dismiss with triage, help with a help link. */


  menuEntries(item) {
    const entries = [];

    if (this.triage) {
      entries.push({
        id: 'snooze-day',
        text: this.sfWord('snooze-day-text'),
        icon: 'schedule'
      });
      entries.push({
        id: 'snooze-week',
        text: this.sfWord('snooze-week-text'),
        icon: 'event'
      });
      if (this.canDismiss(item)) entries.push({
        id: 'dismiss',
        text: this.sfWord('dismiss-text'),
        icon: 'notifications_off'
      });
    }

    if (item.help) {
      if (entries.length) entries.push({
        type: 'separator'
      });
      entries.push({
        id: 'help',
        text: this.sfWord('help-text'),
        icon: 'help',
        href: item.help
      });
    }

    return entries;
  }

  openMenu(item, anchor) {
    const menu = this.menu;
    if (!menu) return;
    this._menuFor = item.id;
    menu.setAttribute('aria-label', this.sfWord('more-label', {
      vars: {
        title: item.title
      }
    }));
    menu.entries = this.menuEntries(item); // The Loader brings sf-menu-context when it is first needed (a lazy
    // relation); a press before that waits for it.

    customElements.whenDefined('sf-menu-context').then(() => menu.toggleFor(anchor));
  }

  onMenuSelect(event) {
    event.stopPropagation();
    const choice = event.detail?.id;
    const item = normalizeItems(this.items).find(one => one.id === this._menuFor);
    if (!item || !choice) return; // «Подробнее о проверке» is a link row: the menu raised select inside the
    // click on it, so the click is still going up. The root's click listener
    // (onRootClick, after the menu's own) asks navigate with that click and
    // stops the link when the host cancels it.

    if (choice === 'help') {
      this._helpFor = item;
      return;
    }

    if (Object.hasOwn(SNOOZE, choice)) this.snooze(item, SNOOZE[choice]);else if (choice === 'dismiss' && this.canDismiss(item)) this.dismiss(item);
  } // The click that chose «Подробнее о проверке», on its way up past the menu.


  onRootClick(event) {
    const item = this._helpFor;
    if (!item) return;
    this._helpFor = null;
    this.onNavigate(event, item, 'help');
  }
  /** Snoozes an item for some days: the request, then set aside with an undo notice. */


  snooze(item, days) {
    const until = new Date(Date.now() + days * DAY).toISOString();
    if (!this.sfEmit('snooze', {
      id: item.id,
      until
    }, {
      cancelable: true
    })) return false;
    this.setAside(item, 'snooze', this.sfWord(days === 1 ? 'snoozed-day-notice' : 'snoozed-week-notice', {
      vars: {
        title: item.title
      }
    }));
    return true;
  }
  /** «Не напоминать»: the request, then set aside with an undo notice. */


  dismiss(item) {
    if (!this.sfEmit('dismiss', {
      id: item.id
    }, {
      cancelable: true
    })) return false;
    this.setAside(item, 'dismiss', this.sfWord('dismissed-notice', {
      vars: {
        title: item.title
      }
    }));
    return true;
  }

  setAside(item, action, notice) {
    const shown = this.shownIds();
    const at = shown.indexOf(item.id); // The focus goes to the next row's «⋯», or the previous one's, or the list.

    this._focusAfter = shown[at + 1] ?? shown[at - 1] ?? '';

    this._aside.set(item.id, action);

    this.requestComponentUpdate('aside');
    globalThis.SF?.notify?.({
      status: 'neutral',
      title: notice,
      source: this.localName,
      key: `${this.localName}|${this._headingId}|${item.id}|${action}`,
      action: {
        label: this.sfWord('undo-text'),
        onSelect: () => this.undo(item.id)
      }
    });
  }
  /** «Вернуть»: an item set aside comes back, and the host hears undo. */


  undo(itemId) {
    const action = this._aside.get(itemId);

    if (!action) return false;

    this._aside.delete(itemId);

    this._focusAfter = itemId;
    this.requestComponentUpdate('undo');
    this.sfEmit('undo', {
      id: itemId,
      action
    });
    return true;
  } // The ids of the rows drawn, in order.


  shownIds() {
    return [...this.querySelectorAll('.sf-list-attention-item[data-id]')].map(row => row.dataset.id);
  } // Both forms of the head and of the quiet line are drawn and the sheet's
  // container query shows one (C45). Until the sheet is in, the narrow
  // column's parts are hidden, so a late sheet shows one form, not both. A
  // ResizeObserver on the drawing finds the sheet: it reports before the
  // frame is painted with it, and the parts are shown in that same frame.


  whenRenderedStylesReady(target) {
    this.holdNarrowParts();
    return super.whenRenderedStylesReady(target);
  }

  sheetIn(root) {
    return getComputedStyle(root).containerType === 'inline-size';
  }

  holdNarrowParts() {
    const root = this.querySelector(':scope > .sf-list-attention');
    if (!root || this._sheetSeen) return;

    if (this.sheetIn(root)) {
      this.releaseNarrowParts();
      return;
    }

    for (const part of this.querySelectorAll(NARROW_PARTS)) part.hidden = true;

    if (typeof ResizeObserver !== 'function' || this._sheetWatch?.root === root) return;
    this._sheetWatch?.observer.disconnect();
    const observer = new ResizeObserver(() => {
      if (root.isConnected && this.sheetIn(root)) this.releaseNarrowParts();
    });
    this._sheetWatch = {
      root,
      observer
    };
    observer.observe(root);
    if (root.firstElementChild) observer.observe(root.firstElementChild);
  }

  releaseNarrowParts() {
    this._sheetSeen = true;
    this._sheetWatch?.observer.disconnect();
    this._sheetWatch = null;

    for (const part of this.querySelectorAll(NARROW_PARTS)) part.hidden = false;
  }

  onDisconnected() {
    this._sheetWatch?.observer.disconnect();
    this._sheetWatch = null;
    super.onDisconnected?.();
  }

  afterRender(changed) {
    super.afterRender?.(changed); // The sheet gate let go (in, or its time ran out): the parts are shown.

    if (!this._sheetSeen) {
      const root = this.querySelector(':scope > .sf-list-attention');
      if (root && this.sheetIn(root)) this.releaseNarrowParts();
    }

    if (this._focusAfter === null) return;
    const target = this._focusAfter;
    this._focusAfter = null; // After the menu gives the focus back to its (now gone) anchor.

    setTimeout(() => {
      const row = target ? [...this.querySelectorAll('.sf-list-attention-item[data-id]')].find(one => one.dataset.id === target) : null;
      const button = row?.querySelector('.sf-list-attention-more button') ?? row?.querySelector('.sf-list-attention-action :is(a, button)');
      (button ?? this.querySelector(':scope > .sf-list-attention'))?.focus?.();
    }, 0);
  } // ── words ───────────────────────────────────────────────────────────────

  /** How long a problem lasts: «только что», «12 мин», «5 ч», «2 дня». */


  ageText(since, now = Date.now()) {
    if (since === null) return '';
    const span = Math.max(0, now - since);
    if (span < MINUTE) return this.sfWord('age-now');
    if (span < HOUR) return this.sfWord('age-minutes', {
      count: Math.floor(span / MINUTE)
    });
    if (span < DAY) return this.sfWord('age-hours', {
      count: Math.floor(span / HOUR)
    });
    return this.sfWord('age-days', {
      count: Math.floor(span / DAY)
    });
  }
  /** When the checks ran: «5 мин назад» within the hour, «в 14:05» today, the date before. */


  checkedText(now = Date.now()) {
    const at = momentOf(this.checkedAt);
    if (!Number.isFinite(at)) return '';
    const span = now - at;
    if (span >= 0 && span < MINUTE) return this.sfWord('checked-now');
    if (span >= 0 && span < HOUR) return this.sfWord('checked-minutes', {
      count: Math.floor(span / MINUTE)
    });
    const locale = (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_2__.pageLocale)(this);
    const time = new Intl.DateTimeFormat(locale, {
      hour: '2-digit',
      minute: '2-digit'
    }).format(at);
    if (new Date(at).toDateString() === new Date(now).toDateString()) return this.sfWord('checked-time', {
      vars: {
        time
      }
    });
    const date = new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'long'
    }).format(at);
    return this.sfWord('checked-date', {
      vars: {
        date,
        time
      }
    });
  }

  templateContext() {
    noteSize(this);
    const list = this.list;
    const count = list.length;
    const status = list[0]?.status ?? '';
    const level = Math.min(6, Math.max(2, Math.trunc(Number(this.headingLevel)) || 3));
    const grouped = this.grouped;
    const limit = Math.max(0, Math.trunc(Number(this.limit)) || 0);
    const limited = !grouped && !this._all && limit > 0 && count > limit;
    const shown = limited ? list.slice(0, limit) : list;
    const now = Date.now();
    const counts = Object.fromEntries(STATUSES.map(one => [one, list.filter(item => item.status === one).length]));

    const row = item => {
      const meta = [item.text, this.ageText(item.since, now), item.source].filter(Boolean);
      return { ...item,
        statusWord: this.sfWord(`status-${item.status}`),
        meta,
        affectedText: item.affected ? this.sfWord('affected-text', {
          vars: {
            text: item.affected
          }
        }) : '',
        menu: this.menuEntries(item).length > 0,
        moreLabel: this.sfWord('more-label', {
          vars: {
            title: item.title
          }
        })
      };
    };

    const passed = grouped ? normalizePassed(this.passed) : [];
    const checked = this.checkedText(now);
    this.sfHostState('data-status', status);
    this.sfHostState('data-empty', count === 0);
    return this.createTemplateContext({ ...this.getPropsContext(),
      component: this,
      // size is deprecated (noteSize): until its removal size="1/2" still
      // draws compact; the density otherwise comes from the page (C22).
      compact: this.hasAttribute('size') && this.size === '1/2',
      frame: this.frame === 'none' ? 'none' : 'card',
      label: this.label,
      level,
      headingId: this._headingId,
      list: shown.map(row),
      count,
      status,
      grouped,
      groups: grouped ? STATUSES.filter(one => counts[one]).map(one => ({
        key: one,
        title: this.sfWord(`group-${one}`),
        count: counts[one],
        open: this._open[one],
        items: list.filter(item => item.status === one).map(row)
      })) : [],
      // Computed values under keys of their own, not a setting's name (the
      // template-context probe compares a setting's key with its getter).
      passedGroup: passed.length ? {
        key: 'passed',
        title: this.sfWord('group-passed'),
        count: passed.length,
        open: this._open.passed,
        word: this.sfWord('status-passed'),
        items: passed
      } : null,
      badges: STATUSES.filter(one => counts[one]).map(one => ({
        status: one,
        icon: ICONS[one],
        text: this.sfWord(`summary-${one}`, {
          count: counts[one]
        })
      })),
      // The same summary as one line of text, for a narrow column (C45).
      summaryLine: STATUSES.filter(one => counts[one]).map(one => this.sfWord(`summary-${one}`, {
        count: counts[one]
      })).join(' · '),
      empty: this.empty === 'none' ? 'none' : 'line',
      quietTitle: this.emptyText,
      emptyLine: checked ? this.sfWord('empty-checked-text', {
        vars: {
          text: this.emptyText,
          when: checked
        }
      }) : this.emptyText,
      checked,
      checkedLine: checked ? this.sfWord('checked-text', {
        vars: {
          when: checked
        }
      }) : '',
      recheckLabel: this.sfWord('recheck-label'),
      more: limited || this.moreHref ? {
        href: this.moreHref,
        text: this.moreHref ? this.sfWord('more-text', {
          count
        }) : this.sfWord('show-all-text', {
          count
        })
      } : null,
      icons: ICONS,
      rootClass: this.getRootClass()
    });
  }

  template() {
    const context = this.templateContext();
    (0,_helpers_cycle__WEBPACK_IMPORTED_MODULE_4__.preloadControlIcons)(this, listIcons(this, context));
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_5__.renderListAttentionTemplate)(context);
  }

}

SfListAttention.define('sf-list-attention');

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "a18165be158e"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderListAttentionTemplate: () => (/* binding */ renderListAttentionTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("efa66f8927d1");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__);

 // sf-list-attention's markup (scss/ draws it; owner decision C37).
//
// - The root is a section (role region) named by its heading: a card frame
//   by default (frame="card"), the bare list with frame="none". The
//   density is the page's (C22); the deprecated size="1/2" still puts the
//   compact density on the root until its removal.
// - The head: the heading at heading-level, then the summary, one sf-badge
//   per severity («2 ошибки», «3 предупреждения»).
// - The rows are one grid of five columns (icon, text, affected, action,
//   «⋯»), every row a subgrid of it, so the actions and the affected counts
//   stand in columns. Each row says its status in words before its title
//   (visually hidden; the filled icon is a picture), then the title, the
//   meta line (object · text · age · source), the affected count (group
//   mode), one quiet action (sf-button outline on-surface) and the «⋯»
//   (sf-button-icon ghost) of the triage menu.
// - The foot: «Проверено …» with a recheck, then «Все проблемы (N)» (the
//   event all).
// - group="severity": disclosure groups by severity, «Пройдено» closed.
// - With no items: nothing (empty none) or the head and one quiet line
//   «Всё в порядке · проверено …» (empty line, the default).
// - A narrow column (C45, below 30rem of the list): the summary is one line
//   of text under the heading, «2 ошибки · 1 предупреждение», instead of the
//   badges; the quiet line two lines with an icon recheck. Both forms are in
//   the markup and the container query shows one.

const icon = (name, extra = '') => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class=${['sf-icon', 'sf-icon--filled', 'sf-list-attention-icon', extra].filter(Boolean).join(' ')} aria-hidden="true">${name}</i>`;

function action(context, item) {
  if (!item.action) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const {
    component
  } = context;

  if (item.action.href) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button class="sf-list-attention-action" size="1/2" appearance="outline" scheme="on-surface"
      text=${item.action.label} href=${item.action.href}
      @click=${event => component.onNavigate(event, item, 'action')}></sf-button>`;
  }

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button class="sf-list-attention-action" size="1/2" appearance="outline" scheme="on-surface"
    text=${item.action.label} @click=${() => component.onApply(item)}></sf-button>`;
}

function more(context, item) {
  if (!item.menu) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button-icon class="sf-list-attention-more" size="1/2" appearance="ghost" scheme="on-surface-variant"
    icon="more_horiz" aria-label=${item.moreLabel} aria-haspopup="menu"
    @click=${event => context.component.openMenu(item, event.currentTarget.querySelector('button') ?? event.currentTarget)}></sf-button-icon>`;
}

function meta(context, item) {
  const parts = [];

  if (item.object) {
    parts.push(item.object.href ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<a class="sf-list-attention-object" href=${item.object.href}
          @click=${event => context.component.onNavigate(event, item, 'object')}>${item.object.label}</a>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-list-attention-object">${item.object.label}</span>`);
  }

  item.meta.forEach(one => parts.push(one));
  if (!parts.length && !(context.grouped && item.affectedText)) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-list-attention-meta">${parts.map((part, index) => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${index ? ' · ' : ''}${part}`)}${context.grouped && item.affectedText ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-list-attention-affected-meta">${parts.length ? ' · ' : ''}${item.affectedText}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}</span>`;
}

function row(context, item) {
  const lines = item.object || item.meta.length ? 2 : 1;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<li class="sf-list-attention-item" data-status=${item.status} data-id=${item.id} data-lines=${String(lines)}>
    ${icon(context.icons[item.status], `sf-list-attention-icon--${item.status}`)}
    <span class="sf-list-attention-text">
      <span class="sf-list-attention-title"><span class="sr-only">${item.statusWord}: </span>${item.title}</span>
      ${meta(context, item)}
    </span>
    ${context.grouped && item.affected ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-badge class="sf-list-attention-affected" size="1/2" appearance="tonal" scheme="neutral" text=${item.affected}></sf-badge>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    ${action(context, item)}
    ${more(context, item)}
  </li>`;
}

function rows(context, items) {
  return (0,lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__.repeat)(items, item => item.id, item => row(context, item));
}

function passedRow(context, item) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<li class="sf-list-attention-item sf-list-attention-item--passed" data-status="success" data-lines=${item.text ? '2' : '1'}>
    ${icon(context.icons.success, 'sf-list-attention-icon--success')}
    <span class="sf-list-attention-text">
      <span class="sf-list-attention-title"><span class="sr-only">${context.passedGroup.word}: </span>${item.title}</span>
      ${item.text ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-list-attention-meta">${item.text}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    </span>
  </li>`;
}

function group(context, one, body) {
  const panel = `${context.headingId}-${one.key}`;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-list-attention-group" data-group=${one.key}>
    <button type="button" class="sf-list-attention-group-toggle" aria-expanded=${one.open ? 'true' : 'false'} aria-controls=${panel}
      @click=${() => context.component.onToggleGroup(one.key)}>
      <i class="sf-icon sf-list-attention-chevron" aria-hidden="true">expand_more</i>
      <span class="sf-list-attention-group-title">${one.title}</span>
      <span class="sf-list-attention-group-count">${one.count}</span>
    </button>
    <ul class="sf-list-attention-list" id=${panel} ?hidden=${!one.open}>${body}</ul>
  </div>`;
}

function checked(context) {
  if (!context.checked) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-list-attention-checked"><span class="sf-list-attention-checked-text">${context.checkedLine}</span><sf-button-icon class="sf-list-attention-recheck" size="1/2"
    appearance="ghost" scheme="on-surface-variant" icon="refresh" aria-label=${context.recheckLabel}
    @click=${() => context.component.onRecheck()}></sf-button-icon></span>`;
}

function head(context, withSummary) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-list-attention-head">
    <div class="sf-list-attention-heading" role="heading" aria-level=${String(context.level)} id=${context.headingId}>
      <span class="sf-list-attention-heading-text">${context.label}</span>
    </div>
    ${withSummary && context.badges.length ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-list-attention-summary">${context.badges.map(one => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-badge
      class="sf-list-attention-badge" size="1/3" appearance="tonal" icon-start=${one.icon}
      status=${one.status === 'info' ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : one.status} scheme=${one.status === 'info' ? 'neutral' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      text=${one.text}></sf-badge>`)}</span><span class="sf-list-attention-summary-line">${context.summaryLine}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    ${context.grouped ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-list-attention-spacer"></span>${checked(context)}` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
  </div>`;
}

function foot(context) {
  if (context.grouped || !context.checked && !context.more) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const link = context.more;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-list-attention-foot">
    ${checked(context)}
    <span class="sf-list-attention-spacer"></span>
    ${link ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button class="sf-list-attention-all" size="1/2" appearance="ghost" scheme="primary" icon-end="arrow_forward"
      text-position="start" text=${link.text} href=${link.href || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      @click=${event => context.component.onAll(event)}></sf-button>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
  </div>`;
}

function renderListAttentionTemplate(context) {
  const {
    count,
    empty,
    frame
  } = context;
  const classes = ['sf-list-attention', `sf-list-attention--frame-${frame}`, context.grouped ? 'sf-list-attention--group' : '', count === 0 ? 'sf-list-attention--empty' : '', context.rootClass].filter(Boolean).join(' ');
  const density = context.compact ? 'compact' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;

  if (count === 0) {
    if (empty !== 'line') return lit__WEBPACK_IMPORTED_MODULE_0__.nothing; // One line «Всё в порядке · проверено …» with a text recheck; in a
    // narrow column (C45) two lines, «Всё в порядке» over «Проверено …», and
    // the recheck an icon. Both are drawn; the container shows one.

    const quiet = (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<p class="sf-list-attention-quiet" role="status">${icon('check_circle', 'sf-list-attention-icon--success')}<span class="sf-list-attention-quiet-text"><span class="sf-list-attention-quiet-line">${context.emptyLine}</span><span class="sf-list-attention-quiet-title">${context.quietTitle}</span>${context.checked ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-list-attention-quiet-meta">${context.checkedLine}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}</span>${context.checked ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button class="sf-list-attention-recheck-text" size="1/2" appearance="ghost" scheme="on-surface-variant" icon-start="refresh"
        text=${context.recheckLabel} @click=${() => context.component.onRecheck()}></sf-button><sf-button-icon class="sf-list-attention-recheck sf-list-attention-recheck--narrow" size="1/2"
        appearance="ghost" scheme="on-surface-variant" icon="refresh" aria-label=${context.recheckLabel}
        @click=${() => context.component.onRecheck()}></sf-button-icon>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}</p>`;

    if (frame === 'none') {
      return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class=${classes} style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} data-sf-density=${density}>${quiet}</div>`;
    }

    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<section class=${classes} style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} aria-labelledby=${context.headingId} tabindex="-1" data-sf-density=${density}>
      ${head(context, false)}${quiet}
    </section>`;
  }

  const body = context.grouped ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-list-attention-groups">${context.groups.map(one => group(context, one, rows(context, one.items)))}${context.passedGroup ? group(context, context.passedGroup, context.passedGroup.items.map(item => passedRow(context, item))) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}</div>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<ul class="sf-list-attention-list">${rows(context, context.list)}</ul>`; // The root hears the click that chose «Подробнее о проверке» after the
  // menu did (navigate part help, cancelable like the other links).

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<section class=${classes} style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} aria-labelledby=${context.headingId} tabindex="-1" data-sf-density=${density}
    @click=${event => context.component.onRootClick(event)}>
    ${head(context, true)}
    ${body}
    ${foot(context)}
    <sf-menu-context class="sf-list-attention-menu" popup
      @sf-menu-context-select=${event => context.component.onMenuSelect(event)}
      @sf-context-menu-select=${event => event.stopPropagation()}></sf-menu-context>
  </section>`;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "2011d1065c58"
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

/***/ "efa66f8927d1"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit/directives/repeat.js", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("lit/directives/repeat.js", 1).then(resolve, reject), { once: true })));

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

/***/ "565cca359e31"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.list-attention","tag":"sf-list-attention","version":"1.3.1","kind":"leaf","settings":{"items":{"type":"list","schema":{"items":{"type":"object","properties":{"id":{"type":"string"},"status":{"type":"string","enum":["error","warning","info","success"]},"title":{"type":"string"},"text":{"type":"string"},"action":{"type":"object","properties":{"label":{"type":"string"},"href":{"type":"string"},"event":{"type":"string"}}},"object":{"type":"object","properties":{"label":{"type":"string"},"href":{"type":"string"}}},"since":{"type":"string"},"source":{"type":"string"},"affected":{"type":"string"},"help":{"type":"string"},"dismissible":{"type":"boolean"}},"required":["id","status","title"]}},"default":[]},"label":{"type":"string","default-from":"runtime.label"},"heading-level":{"type":"number","integer":true,"min":2,"max":6,"default":3},"frame":{"type":"enum","values":["card","none"],"default":"card"},"triage":{"type":"boolean","default":false},"dismissible":{"type":"boolean","default":false},"checked-at":{"type":"string","default":""},"limit":{"type":"number","integer":true,"min":0,"default":5},"more-href":{"type":"string","default":""},"group":{"type":"enum","values":["none","severity"],"default":"none"},"passed":{"type":"list","default":[]},"empty":{"type":"enum","values":["none","line"],"default":"line"},"empty-text":{"type":"string","default-from":"runtime.empty-text"},"size":{"type":"enum","values":["1/2","1"],"default":"1"}},"values":{},"events":{"navigate":{"carries":{"id":"string","status":"string","href":"string","part":"string"},"cancelable":true},"apply":{"carries":{"action":"string","scope":"string","ids":"list","id":"string","status":"string"}},"snooze":{"carries":{"id":"string","until":"string"},"cancelable":true},"dismiss":{"carries":{"id":"string"},"cancelable":true},"undo":{"carries":{"id":"string","action":"string"}},"recheck":{"carries":{}},"all":{"carries":{"href":"string"},"cancelable":true}},"actions":{},"host-states":{"data-status":"string","data-empty":"boolean"},"css-variables":{"--sf-list-attention-background-color":{"type":"color","state":"default"},"--sf-list-attention-divider-color":{"type":"color","state":"default"},"--sf-list-attention-heading-color":{"type":"color","state":"default"},"--sf-list-attention-padding-inline":{"type":"length","state":"default"},"--sf-list-attention-gap":{"type":"length","state":"default"}}}');

/***/ },

/***/ "3c901318836b"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Needs attention","runtime":{"label":"Needs attention","empty-text":"All is well","empty-checked-text":"{text} · checked {when}","status-error":"Error","status-warning":"Warning","status-info":"Info","status-success":"Done","status-passed":"Passed","summary-error":{"one":"{n} error","other":"{n} errors"},"summary-warning":{"one":"{n} warning","other":"{n} warnings"},"summary-info":{"one":"{n} recommendation","other":"{n} recommendations"},"summary-success":{"one":"{n} solved","other":"{n} solved"},"group-error":"Errors","group-warning":"Warnings","group-info":"Recommendations","group-success":"Solved","group-passed":"Passed","affected-text":"affected: {text}","age-now":"just now","age-minutes":"{n} min","age-hours":"{n} h","age-days":{"one":"{n} day","other":"{n} days"},"checked-text":"Checked {when}","checked-now":"just now","checked-minutes":"{n} min ago","checked-time":"at {time}","checked-date":"{date} at {time}","recheck-label":"Check again","more-text":"All problems ({n})","show-all-text":"Show all ({n})","more-label":"More: {title}","snooze-day-text":"Snooze for a day","snooze-week-text":"Snooze for a week","dismiss-text":"Don\'t remind me","help-text":"About this check","snoozed-day-notice":"Snoozed for a day: {title}","snoozed-week-notice":"Snoozed for a week: {title}","dismissed-notice":"We won\'t remind you again: {title}","undo-text":"Undo"},"events":{"navigate":{"label":"Go"},"apply":{"label":"Run"},"snooze":{"label":"Snooze"},"dismiss":{"label":"Don\'t remind"},"undo":{"label":"Undo"},"recheck":{"label":"Check again"},"all":{"label":"All problems"}}}');

/***/ },

/***/ "9a754872f29c"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Требует внимания","runtime":{"label":"Требует внимания","empty-text":"Всё в порядке","empty-checked-text":"{text} · проверено {when}","status-error":"Ошибка","status-warning":"Предупреждение","status-info":"Сведения","status-success":"Готово","status-passed":"Пройдено","summary-error":{"one":"{n} ошибка","few":"{n} ошибки","many":"{n} ошибок","other":"{n} ошибки"},"summary-warning":{"one":"{n} предупреждение","few":"{n} предупреждения","many":"{n} предупреждений","other":"{n} предупреждения"},"summary-info":{"one":"{n} рекомендация","few":"{n} рекомендации","many":"{n} рекомендаций","other":"{n} рекомендации"},"summary-success":{"one":"{n} решена","few":"{n} решены","many":"{n} решено","other":"{n} решено"},"group-error":"Ошибки","group-warning":"Предупреждения","group-info":"Рекомендации","group-success":"Решено","group-passed":"Пройдено","affected-text":"затронуто: {text}","age-now":"только что","age-minutes":"{n} мин","age-hours":"{n} ч","age-days":{"one":"{n} день","few":"{n} дня","many":"{n} дней","other":"{n} дня"},"checked-text":"Проверено {when}","checked-now":"только что","checked-minutes":"{n} мин назад","checked-time":"в {time}","checked-date":"{date} в {time}","recheck-label":"Проверить снова","more-text":"Все проблемы ({n})","show-all-text":"Показать все ({n})","more-label":"Ещё: {title}","snooze-day-text":"Отложить на день","snooze-week-text":"Отложить на неделю","dismiss-text":"Не напоминать","help-text":"Подробнее о проверке","snoozed-day-notice":"Отложено на день: {title}","snoozed-week-notice":"Отложено на неделю: {title}","dismissed-notice":"Больше не напомним: {title}","undo-text":"Вернуть"},"events":{"navigate":{"label":"Перейти"},"apply":{"label":"Выполнить"},"snooze":{"label":"Отложить"},"dismiss":{"label":"Не напоминать"},"undo":{"label":"Вернуть"},"recheck":{"label":"Проверить снова"},"all":{"label":"Все проблемы"}}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("d72a94301527");
/******/
/******/ })()
;