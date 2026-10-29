/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "e6d86f2cd058"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FIELD_SIZES: () => (/* binding */ FIELD_SIZES),
/* harmony export */   RETIRED_FIELD_SIZES: () => (/* binding */ RETIRED_FIELD_SIZES),
/* harmony export */   fieldSize: () => (/* binding */ fieldSize),
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
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "b9b65955223a"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _core_js_instance_path__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("e92fd2d1a38c");
/* harmony import */ var _component_field_size__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("e6d86f2cd058");
/* harmony import */ var _helpers_form_field__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("38ea8d53f301");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("77b2f4107e3b");
/* harmony import */ var _core_js_position_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("116963e5e31b");
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("43090d1c8307");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("ef6661f4d1bb");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("7cb84e1fa3a3");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("0b816e511c59");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("aa7064807ed2");
/* harmony import */ var _core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__("bf0cea966575");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_instance_path__WEBPACK_IMPORTED_MODULE_2__, _component_field_size__WEBPACK_IMPORTED_MODULE_3__, _js_templates_default__WEBPACK_IMPORTED_MODULE_5__, _core_js_position_js__WEBPACK_IMPORTED_MODULE_6__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_7__, _core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_12__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_instance_path__WEBPACK_IMPORTED_MODULE_2__, _component_field_size__WEBPACK_IMPORTED_MODULE_3__, _js_templates_default__WEBPACK_IMPORTED_MODULE_5__, _core_js_position_js__WEBPACK_IMPORTED_MODULE_6__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_7__, _core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_12__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_instance_path__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_core_js_instance_path__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _core_js_position_js__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_core_js_position_js__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_core_js_page_language__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(_core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_12__);













const ISO_DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;
const YEARS_PAGE_SIZE = 18;

function padDatePart(value) {
  return String(value).padStart(2, '0');
}

function formatIsoDate(date) {
  return `${date.getFullYear()}-${padDatePart(date.getMonth() + 1)}-${padDatePart(date.getDate())}`;
}

function formatDateValue(date, format = 'YYYY.MM.DD') {
  if (!date) {
    return '';
  }

  const tokens = {
    YYYY: String(date.getFullYear()),
    YY: String(date.getFullYear()).slice(-2),
    MM: padDatePart(date.getMonth() + 1),
    DD: padDatePart(date.getDate())
  };
  return String(format || 'YYYY.MM.DD').replace(/YYYY|YY|MM|DD/g, token => tokens[token] || token);
}

function isValidDate(date) {
  return date instanceof Date && !Number.isNaN(date.getTime());
} // A year has four digits: 1000 to 9999. Without the bound a glued paste such
// as «20.11.202630.10.2026» read as year 202630 and was stored as a date
// nobody meant.


const MIN_YEAR = 1000;
const MAX_YEAR = 9999;

function calendarDate(year, month, day) {
  if (!Number.isInteger(year) || year < MIN_YEAR || year > MAX_YEAR) {
    return null;
  }

  const date = new Date(year, month - 1, day); // new Date reads years below 100 as 19xx; the bound above keeps them out.

  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }

  return date;
}

function parseDate(value) {
  if (!value) {
    return null;
  }

  const match = String(value).match(ISO_DATE_RE);

  if (!match) {
    return null;
  }

  const [, year, month, day] = match;
  return calendarDate(Number(year), Number(month), Number(day));
} // The declared format as an anchored pattern: YYYY is four digits, YY two,
// DD and MM one or two, and whatever stands between them in the format is a
// separator -- any of . / - , or a space, so «20/11/2026» lands in a
// DD.MM.YYYY field. The whole text has to be one date: it read every run of
// digits it found and took the first three, so two dates glued together, a
// date with something after it or a five-digit year all made a date.


const FORMAT_TOKEN_RE = /YYYY|YY|MM|DD/g;
const formatPatterns = new Map();

function formatPattern(format) {
  const key = String(format || 'DD.MM.YYYY');
  if (formatPatterns.has(key)) return formatPatterns.get(key);
  const tokens = key.match(FORMAT_TOKEN_RE) || [];
  const digits = {
    YYYY: '(\\d{4})',
    YY: '(\\d{2})',
    MM: '(\\d{1,2})',
    DD: '(\\d{1,2})'
  };
  const source = key.split(FORMAT_TOKEN_RE).map(literal => literal ? '[\\s./,-]+' : '').reduce((pattern, literal, index) => pattern + literal + (index < tokens.length ? digits[tokens[index]] : ''), '');
  const usable = tokens.length === 3 && tokens.includes('MM') && tokens.includes('DD') && (tokens.includes('YYYY') || tokens.includes('YY'));
  const pattern = usable ? {
    re: new RegExp(`^${source}$`),
    tokens
  } : null;
  formatPatterns.set(key, pattern);
  return pattern;
}

function parseDateValue(value, format = 'DD.MM.YYYY') {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return isValidDate(value) ? new Date(value.getFullYear(), value.getMonth(), value.getDate()) : null;
  }

  const text = String(value).trim();

  if (ISO_DATE_RE.test(text)) {
    return parseDate(text);
  }

  const pattern = formatPattern(format);
  const match = pattern ? text.match(pattern.re) : null;

  if (!match) {
    return null;
  }

  const values = {};
  pattern.tokens.forEach((token, index) => {
    values[token] = Number(match[index + 1]);
  });
  const year = values.YYYY ?? values.YY + 2000;
  return calendarDate(year, values.MM, values.DD);
}

function normalizeMonth(value, fallback = 0) {
  const month = (0,_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__.toNumber)(value, fallback);

  if (!Number.isFinite(month)) {
    return fallback;
  }

  return Math.max(0, Math.min(11, month));
}

function sameDay(first, second) {
  return first && second && first.getFullYear() === second.getFullYear() && first.getMonth() === second.getMonth() && first.getDate() === second.getDate();
}

function compareDates(first, second) {
  if (!first || !second) {
    return 0;
  }

  const firstTime = new Date(first.getFullYear(), first.getMonth(), first.getDate()).getTime();
  const secondTime = new Date(second.getFullYear(), second.getMonth(), second.getDate()).getTime();
  return firstTime - secondTime;
}

function shiftDateByMonth(date, direction) {
  const targetMonth = new Date(date.getFullYear(), date.getMonth() + direction, 1);
  const lastDay = new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 0).getDate();
  targetMonth.setDate(Math.min(date.getDate(), lastDay));
  return targetMonth;
}

function isBetweenDates(date, startDate, endDate) {
  if (!date || !startDate || !endDate) {
    return false;
  }

  return compareDates(date, startDate) > 0 && compareDates(date, endDate) < 0;
}

function normalizeLocale(value = '', node = null) {
  const locale = String(value || '').trim();

  if (locale) {
    return locale;
  } // The nearest [lang] first, then the document's: the rule every component
  // follows, rather than this one's own reading of it. A date picker inside a
  // region marked `lang="en"` on a Russian page used to name its months in
  // Russian, because only the document was ever consulted.
  //
  // The region is kept -- `pageLocale`, not `pageLanguage` -- because this
  // value also goes to Intl, and `ru-RU` and `en-GB` name months and start
  // weeks differently from `ru` and `en`. Below this there used to be a fall
  // back to the browser's own language and then to `ru-RU`: unreachable
  // wherever a document exists, and a Russian default everywhere else, which
  // is the opposite of the rule (peer session, 2026-10-11).


  return (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_7__.pageLocale)(node ?? globalThis.document?.documentElement ?? null);
}

function capitalizeFirstLetter(value = '') {
  const text = String(value || '');

  if (!text) {
    return '';
  }

  return `${text.charAt(0).toLocaleUpperCase()}${text.slice(1)}`;
}

function getMonthLabel(month, locale) {
  try {
    return capitalizeFirstLetter(new Intl.DateTimeFormat(locale, {
      month: 'long'
    }).format(new Date(2026, month, 1)));
  } catch {
    return String(month + 1);
  }
}

function getDateLabel(date, locale) {
  try {
    return new Intl.DateTimeFormat(locale, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  } catch {
    return formatIsoDate(date);
  }
}

function getWeekdays(locale, weekStart = 1) {
  const sunday = new Date(2026, 0, 4);
  return Array.from({
    length: 7
  }, (_, index) => {
    const day = new Date(sunday);
    day.setDate(sunday.getDate() + (weekStart + index) % 7);

    try {
      return new Intl.DateTimeFormat(locale, {
        weekday: 'short'
      }).format(day);
    } catch {
      return String((weekStart + index) % 7);
    }
  });
} // Quick ranges (owner, 2026-10-15). A relative one is resolved against today
// in the person's own time zone, every time it is drawn, so a host that stores
// «last 7 days» gets the last seven days tomorrow too. Weeks start where the
// grid starts them.


const RELATIVE_PRESETS = ['today', 'yesterday', 'last-7-days', 'last-30-days', 'this-week', 'this-month', 'last-month'];

function addDays(date, days) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

function resolveRelativePreset(id, today, weekStart = 1) {
  const day = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  switch (id) {
    case 'today':
      return [day, day];

    case 'yesterday':
      return [addDays(day, -1), addDays(day, -1)];

    case 'last-7-days':
      return [addDays(day, -6), day];

    case 'last-30-days':
      return [addDays(day, -29), day];

    case 'this-week':
      return [addDays(day, -((day.getDay() - weekStart + 7) % 7)), day];

    case 'this-month':
      return [new Date(day.getFullYear(), day.getMonth(), 1), day];

    case 'last-month':
      return [new Date(day.getFullYear(), day.getMonth() - 1, 1), new Date(day.getFullYear(), day.getMonth(), 0)];

    default:
      return null;
  }
}

function presetTextKey(id) {
  return `preset_${String(id).replace(/-([a-z0-9])/g, (_, letter) => letter.toUpperCase())}`;
} // Every word this picker says, in the languages it ships with. A product adds
// any other through SF.language.register('sf-datepicker', code, words) -- which
// an if/else on «ru» did not allow at all.
// Every word is lang/<locale>.json runtime (standard 1.3.8 §11); the code's
// camelCase keys read as the files' kebab-case ones.


const wordKey = key => String(key).replace(/_/gu, '-').replace(/[A-Z]/gu, letter => `-${letter.toLowerCase()}`);

function getLabels(node) {
  const keys = ['previousMonth', 'nextMonth', 'previousYears', 'nextYears', 'chooseMonth', 'chooseYear', 'presets', 'customRange'];
  return Object.fromEntries(keys.map(key => [key, node.sfWord(wordKey(key))]));
} // sf-datepicker from its component.json (standard simai.smart-component 1.3.8
// §3, §4, §4.4, §7.1.1, §8, §11, §16.20, §17.1). It stays a leaf: the one
// interactive part it places is its own text box. The settings are attributes
// and properties made by core/js/element-manifest.js, the panel actions answer
// an outcome, change leaves once (the shim sends sf-datepicker-change and
// sf-change after it), and the host is the form control through
// ElementInternals.


const DatepickerElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_8__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_10__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_11__
  },
  source: 'ru',
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_9__,
  actions: {
    'open-panel'({
      options
    } = {}) {
      if (this.disabled) return 'disabled';

      this._openPanel(options || {});

      return 'applied';
    },

    'close-panel'({
      options
    } = {}) {
      if (!this.open) return 'unchanged';

      this._closePanel(options || {});

      return 'applied';
    },

    'toggle-panel'() {
      if (!this.open && this.disabled) return 'disabled';

      this._togglePanel();

      return 'applied';
    },

    'choose-preset'({
      item
    } = {}) {
      if (this.disabled) return 'disabled';
      if (!item || item.disabled || !this.range) return 'unavailable-preset';

      this._choosePreset(item);

      return 'applied';
    },

    'choose-custom-range'() {
      if (this.disabled) return 'disabled';
      if (!this.range) return 'not-a-range';

      this._chooseCustomRange();

      return 'applied';
    }

  }
});

class SfDatepicker extends (0,_helpers_form_field__WEBPACK_IMPORTED_MODULE_4__.FormField)(DatepickerElement) {
  constructor() {
    super();
    this._input = null;
    this._documentClickHandler = this.handleDocumentClick.bind(this);
    this._documentKeydownHandler = this.handleDocumentKeydown.bind(this);
    this._viewportHandler = this.positionPanel.bind(this);
    this._focusCalendarOnOpen = false;
    this._focusDateAfterRender = false;
    this.state = {
      openAbove: false,
      yearPageStart: null,
      activeDate: ''
    };
    this.refs = {
      input: this.createRef(),
      datePickerRoot: this.createRef(),
      datePickerPanel: this.createRef()
    };
  }

  static get props() {
    // The manifest's settings, read as the component always read them:
    // its own entries win where they keep an attribute's old reading.
    return { ...super.props,
      templateName: {
        attribute: 'template',
        default: 'default'
      },
      value: {
        default: ''
      },
      date: {
        default: ''
      },
      startValue: {
        attribute: 'start-value',
        default: ''
      },
      endValue: {
        attribute: 'end-value',
        default: ''
      },
      maxDate: {
        default: ''
      },
      minDate: {
        default: ''
      },
      range: {
        type: Boolean,
        default: false
      },
      month: {
        type: Number,
        default: null
      },
      year: {
        type: Number,
        default: null
      },
      context: {
        default: ''
      },
      // No default: the page's language says it (see get weekStart).
      weekStart: {
        type: Number,
        default: null
      },
      locale: {
        default: ''
      },
      format: {
        default: 'DD.MM.YYYY'
      },
      rootClass: {
        default: ''
      },
      closeOnSelect: {
        type: Boolean,
        default: true
      },
      input: {
        type: Boolean,
        default: true
      },
      open: {
        type: Boolean,
        default: false
      },
      portal: {
        type: Boolean,
        default: true
      },
      inputType: {
        attribute: 'input-type',
        default: 'bordered'
      },
      size: {
        default: '1'
      },
      inputSize: {
        attribute: 'input-size',
        default: '1'
      },
      inputName: {
        attribute: 'input-name',
        default: ''
      },
      // Read by inputName after input-name; declared so the manifest names it.
      name: {
        attribute: 'name',
        default: ''
      },
      placeholder: {
        default: ''
      },
      label: {
        default: ''
      },
      ariaLabel: {
        attribute: 'aria-label',
        default: ''
      },
      // A date can be typed; a host that wants the grid alone says so.
      readonly: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      required: {
        type: Boolean,
        default: false
      },
      // Said by the host and drawn by the field: the red border and
      // aria-invalid on the native input, and the message under it.
      // Removing it puts both back (Larena acceptance, 2026-10-22).
      invalid: {
        type: Boolean,
        default: false
      },
      errorMessage: {
        attribute: 'error-message',
        default: ''
      },
      iconStart: {
        type: String,
        attribute: 'icon-start',
        default: null
      },
      leftIcon: {
        attribute: 'left-icon',
        default: 'calendar_today'
      },
      inputRootClass: {
        attribute: 'input-root-class',
        default: ''
      },
      mask: {
        type: Boolean,
        default: false
      },
      maskPattern: {
        attribute: 'mask-pattern',
        default: ''
      },
      maskLazy: {
        attribute: 'mask-lazy',
        default: false
      },
      maskPlaceholderChar: {
        attribute: 'mask-placeholder-char',
        default: '_'
      },
      maskOptions: {
        attribute: 'mask-options',
        default: ''
      },
      // Quick ranges, range mode only: built-in ids, comma separated, or
      // the property as [{id, label, relative} | {id, label, range: [from, to]}].
      presets: {
        default: ''
      },
      // The chosen quick range. Set by a host, it wins over start-value and
      // end-value: a stored «last-7-days» is resolved when drawn.
      preset: {
        default: ''
      }
    };
  } // The panel's id comes from the instance path (§7.1.1), never from a counter.


  get _panelId() {
    return (0,_core_js_instance_path__WEBPACK_IMPORTED_MODULE_2__.partId)((0,_core_js_instance_path__WEBPACK_IMPORTED_MODULE_2__.instancePath)(this, {
      kind: 'sf-datepicker'
    }), 'panel');
  }

  connectedCallback() {
    // What a form reset returns to (§17.1 item 4): the value as written.
    if (!this._written) {
      this._written = Object.fromEntries(['date', 'start-value', 'end-value', 'preset'].map(name => [name, this.getAttribute(name)]));
    }

    this.upgradeProperty('value');
    this.upgradeProperty('presets');
    super.connectedCallback();
  }

  upgradeProperty(name) {
    if (!Object.prototype.hasOwnProperty.call(this, name)) {
      return;
    }

    const value = this[name];
    delete this[name];
    this[name] = value;
  }

  get componentName() {
    return 'datepicker';
  }

  get templateName() {
    return this.getAttribute('template') || 'default';
  }

  get selectedDate() {
    return parseDateValue(this.date, this.format);
  }

  get primaryDate() {
    const preset = this.activePreset;
    if (preset) return preset.to;
    return this.selectedDate || this.startDate;
  }

  get presets() {
    return this._presetList ?? (this.getAttribute('presets') || '');
  }

  set presets(next) {
    if (Array.isArray(next)) {
      this._presetList = next;
      this.requestComponentUpdate('presets');
      return;
    }

    this._presetList = null;
    this.setState({
      presets: next ? String(next) : ''
    });
  }

  get preset() {
    return this.getAttribute('preset') || '';
  }

  set preset(next) {
    this.setState({
      preset: next ? String(next) : ''
    });
  } // Each quick range resolved for today: its dates, clamped to min and max,
  // and disabled when nothing of it is left.


  get presetItems() {
    if (!this.range) return [];
    const raw = Array.isArray(this.presets) ? this.presets : String(this.presets).split(/[\s,]+/).filter(Boolean);
    const today = new Date();
    const min = this.setMinDate();
    const max = this.setMaxDate();
    return raw.map(entry => {
      const item = typeof entry === 'string' ? {
        id: entry,
        relative: entry
      } : { ...entry
      };
      if (!item?.id) return null;
      let dates = null;
      if (item.relative) dates = resolveRelativePreset(item.relative, today, this.weekStart);else if (Array.isArray(item.range)) {
        const from = parseDateValue(item.range[0], this.format);
        const to = parseDateValue(item.range[1], this.format);
        if (from && to) dates = compareDates(from, to) <= 0 ? [from, to] : [to, from];
      }
      if (!dates) return null;
      let [from, to] = dates;
      if (min && compareDates(from, min) < 0) from = min;
      if (max && compareDates(to, max) > 0) to = max;
      const disabled = compareDates(from, to) > 0;
      const label = item.label || (RELATIVE_PRESETS.includes(item.id) ? this.sfWord(wordKey(presetTextKey(item.id))) : item.id);
      return {
        id: String(item.id),
        label,
        relative: item.relative || null,
        from,
        to,
        disabled,
        pressed: this.preset === String(item.id)
      };
    }).filter(Boolean);
  }

  get activePreset() {
    const id = this.preset;
    if (!id || !this.range) return null;
    const item = this.presetItems.find(one => one.id === id);
    return item && !item.disabled ? item : null;
  }

  get startDate() {
    return parseDateValue(this.startValue, this.format);
  }

  get endDate() {
    return parseDateValue(this.endValue, this.format);
  } // `value` is the initial value; `date` is the component's own. The getter
  // read `date || value`, so once a date set by the `value` attribute was
  // cleared -- the person emptied the field, or code set '' -- the attribute
  // came back and the old date with it: the value could not be cleared, and
  // the change said the old date (field renderers' date editor, ui-admin's
  // datetime). A present `date`, even empty, is the value now.


  get date() {
    if (this.hasAttribute('date')) return this.getAttribute('date') || '';
    return this.getAttribute('value') || '';
  } // An empty date removes the `date` attribute, which let `value` back in; a
  // cleared value over an initial one is kept as date="".


  setState(nextState = {}, callback = null) {
    super.setState(nextState, callback);

    const has = key => nextState && typeof nextState === 'object' && Object.prototype.hasOwnProperty.call(nextState, key);

    const clears = has('date') && !nextState.date;
    if (clears && this.hasAttribute('value')) this.setAttribute('date', ''); // The grid's month written by the component itself (a date chosen, an
    // arrow, the month list), not by a host: the next opening may move it.

    if (has('year') || has('month')) this._gridMoved = true;
    return this;
  } // The month a value is in, as the state that shows it; nothing for a value
  // that is not a date, so an emptied value leaves the grid where it was.


  monthOf(value) {
    const date = parseDateValue(value, this.format);
    return date ? {
      year: date.getFullYear(),
      month: date.getMonth()
    } : {};
  } // The day the grid opens on: the value's, or today's when there is none --
  // inside min-date and max-date either way.


  get anchorDate() {
    const candidate = this.primaryDate || new Date();
    const minDate = this.setMinDate();
    const maxDate = this.setMaxDate();
    if (minDate && compareDates(candidate, minDate) < 0) return minDate;
    if (maxDate && compareDates(candidate, maxDate) > 0) return maxDate;
    return candidate;
  } // The calendar opens on the month of the value it holds (Larena acceptance,
  // 2026-10-22: 15.11.2026 typed, the grid opened on August -- the month it
  // was left on). The grid kept the year and month it was last moved to, and
  // a value set by a property, by the attribute or by typing did not move it
  // unless the change came through the component's own selection path. So on
  // opening: text typed but not yet committed is committed first; then the
  // grid goes to the value's month, or -- with no value -- back to today's
  // when the component had moved it (a month a host set stays). Inside
  // min-date/max-date either way. The focused day follows.


  showValueMonth() {
    this.commitTypedText();
    const primaryDate = this.primaryDate;

    if (primaryDate) {
      const anchor = this.anchorDate;
      this.setState({
        year: anchor.getFullYear(),
        month: anchor.getMonth(),
        context: ''
      });
    } else if (this._gridMoved) {
      this.setState({
        year: '',
        month: '',
        context: ''
      });
    }

    this._gridMoved = false;
    this.set({
      activeDate: formatIsoDate(this.anchorDate)
    });
    return this;
  } // What stands in the field, read as a date if it is one. Opening the
  // calendar without leaving the field (a click on it, ArrowDown) fires no
  // change, so the typed date was not the value yet. Text that is not a date
  // is left as it is: the change on leaving the field decides about it.


  commitTypedText() {
    if (!this.typed || !this._input) return this;
    const text = String(this._input.value ?? '').trim();
    if (!text || text === this.displayValue || !parseDateValue(text, this.format)) return this;
    this.handleInputChange({
      target: this._input
    });
    return this;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue); // A host that changes the value attribute moves the grid to it: an
    // inline calendar is never opened, so opening cannot do it there.

    if (name === 'value' && oldValue !== null && oldValue !== newValue && this.primaryDate) {
      const date = this.primaryDate;
      this.setState({
        year: date.getFullYear(),
        month: date.getMonth()
      });
    }
  }

  get value() {
    return this.range ? [this.startValue, this.endValue] : this.date;
  } // The value property takes what its getter gives back (component.json
  // x-registry.inputs.value): an ISO date string, or [start, end] for a range.
  // The object {start|startValue|date, end|endValue} older callers pass is
  // still read as that pair, but it is outside the contract. Anything else is
  // read as text (a number, a boolean) or, for any other object, cleared, and
  // a console warning names the shape once per element.


  set value(nextValue) {
    if (Array.isArray(nextValue)) {
      const [startValue = '', endValue = ''] = nextValue;
      this.setState({
        date: startValue || '',
        startValue: startValue || '',
        endValue: endValue || '',
        ...this.monthOf(startValue || endValue)
      });
      return;
    }

    if (nextValue && typeof nextValue === 'object') {
      const startValue = nextValue.start || nextValue.startValue || nextValue.date || '';
      const endValue = nextValue.end || nextValue.endValue || '';
      if (!startValue && !endValue) this.warnValueShape(nextValue);
      this.setState({
        date: nextValue.date || startValue || '',
        startValue,
        endValue,
        ...this.monthOf(nextValue.date || startValue || endValue)
      });
      return;
    }

    if (nextValue != null && typeof nextValue !== 'string') this.warnValueShape(nextValue);
    this.setState({
      date: nextValue ? String(nextValue) : '',
      startValue: '',
      endValue: '',
      ...this.monthOf(nextValue)
    });
  }

  warnValueShape(nextValue) {
    if (this._valueShapeWarned) return;
    this._valueShapeWarned = true;
    const shape = nextValue instanceof Date ? 'Date' : typeof nextValue;
    globalThis.console?.warn?.(`[SIMAI Framework] sf-datepicker: value takes an ISO date string or [start, end]; a ${shape} was read as ${shape === 'object' || shape === 'Date' ? 'empty' : 'text'}.`);
  }

  setMaxDate() {
    return parseDateValue(this.maxDate, this.format);
  }

  setMinDate() {
    return parseDateValue(this.minDate, this.format);
  }

  get maxDate() {
    return this.getAttribute('max-date') || '';
  }

  get minDate() {
    return this.getAttribute('min-date') || '';
  }

  set date(nextValue) {
    this.setState({
      date: nextValue ? String(nextValue) : '',
      ...this.monthOf(nextValue)
    });
  }

  get startValue() {
    const preset = this.activePreset;
    if (preset) return formatIsoDate(preset.from);
    return this.getAttribute('start-value') || '';
  }

  set startValue(nextValue) {
    this.setState({
      startValue: nextValue ? String(nextValue) : '',
      ...this.monthOf(nextValue)
    });
  }

  get endValue() {
    const preset = this.activePreset;
    if (preset) return formatIsoDate(preset.to);
    return this.getAttribute('end-value') || '';
  }

  set endValue(nextValue) {
    this.setState({
      endValue: nextValue ? String(nextValue) : ''
    });
  }

  get range() {
    return this.getBooleanAttr('range', false);
  }

  get input() {
    return this.getBooleanAttr('input', true);
  }

  get open() {
    return this.getBooleanAttr('open', false);
  }

  get portal() {
    return this.getBooleanAttr('portal', true);
  }

  get inputType() {
    return this.getAttribute('input-type') || 'bordered';
  } // `size` is the canonical name, as on every field; `input-size` is its
  // legacy name and still honoured. The canonical name wins when both are set.


  get size() {
    return (0,_component_field_size__WEBPACK_IMPORTED_MODULE_3__.fieldSize)(this.getAttribute('size') || this.getAttribute('input-size') || '1', 'sf-datepicker');
  }

  get inputSize() {
    return this.size;
  }

  get inputName() {
    return this.getAttribute('input-name') || this.getAttribute('name') || '';
  }

  get placeholder() {
    return this.getAttribute('placeholder') || '';
  } // What the form gets (§17.1): the ISO date, never the display text; a
  // range as start/end (an ISO 8601 interval); nothing while disabled.


  sfFormValue() {
    if (this.disabled) return null;
    if (!this.range) return this.date || '';
    const {
      startValue,
      endValue
    } = this;
    if (startValue && endValue) return `${startValue}/${endValue}`;
    return startValue || '';
  }

  fieldValidity() {
    const empty = this.range ? !this.startValue : !this.date;
    return {
      valueMissing: this.required && !this.disabled && empty,
      message: this.sfWord('value-missing'),
      anchor: this._input || null
    };
  } // form.reset(): the value as written, without events (§17.1 item 4).


  fieldReset() {
    for (const [name, value] of Object.entries(this._written || {})) {
      if (value === null) this.removeAttribute(name);else this.setAttribute(name, value);
    }

    this.requestComponentUpdate('reset');
  }

  get label() {
    return this.getAttribute('label') || '';
  }

  get disabled() {
    return this.getBooleanAttr('disabled', false);
  }

  get required() {
    return this.getBooleanAttr('required', false);
  }

  get invalid() {
    return this.getBooleanAttr('invalid', false);
  }

  get errorMessage() {
    return this.getAttribute('error-message') || '';
  }

  get closeOnSelect() {
    return this.getBooleanAttr('close-on-select', true);
  }

  get leftIcon() {
    if (this.hasAttribute('icon-start')) return this.getAttribute('icon-start');
    return this.getAttribute('left-icon') || 'calendar_today';
  }

  get iconStart() {
    return this.leftIcon;
  }

  get inputRootClass() {
    return this.getAttribute('input-root-class') || '';
  }

  get mask() {
    return this.getBooleanAttr('mask', false);
  }

  get maskPattern() {
    return this.getAttribute('mask-pattern') || this.formatToMask(this.format);
  }

  get maskLazy() {
    return this.hasAttribute('mask-lazy') ? this.getBooleanAttr('mask-lazy', false) : false;
  }

  get maskPlaceholderChar() {
    return this.getAttribute('mask-placeholder-char') || '_';
  }

  get maskOptions() {
    return this.getAttribute('mask-options') || '';
  }

  get year() {
    const fallback = this.anchorDate.getFullYear();
    return this.hasAttribute('year') ? this.getNumberAttr('year', fallback) : fallback;
  }

  set year(nextValue) {
    this.setState({
      year: nextValue === null || typeof nextValue === 'undefined' || nextValue === '' ? '' : String((0,_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__.toNumber)(nextValue, new Date().getFullYear()))
    });
    this._gridMoved = false;
  }

  get month() {
    const fallback = this.anchorDate.getMonth();
    return this.hasAttribute('month') ? normalizeMonth(this.getAttribute('month'), fallback) : fallback;
  }

  set month(nextValue) {
    this.setState({
      month: nextValue === null || typeof nextValue === 'undefined' || nextValue === '' ? '' : String(normalizeMonth(nextValue, new Date().getMonth()))
    });
    this._gridMoved = false;
  }

  get contextMode() {
    return this.getEnumAttr('context', ['month', 'year', ''], '');
  } // The week starts where the page's language starts it when the attribute
  // does not say: Monday for ru, Sunday for en-US (docs trial 4: a
  // Sunday-first locale needed a manual attribute).
  // Any day may open the week, 0 Sunday to 6 Saturday: the grid counts from
  // it modulo seven. Only Sunday and Monday were kept, so a Saturday-first
  // locale (ar-EG, fa-IR) got Monday (documentation trial 6, 2026-10-18).


  get weekStart() {
    if (this.hasAttribute('week-start')) {
      const day = this.getNumberAttr('week-start', 1);
      return Number.isInteger(day) && day >= 0 && day <= 7 ? day % 7 : 1;
    }

    try {
      const locale = new Intl.Locale(this.locale);
      const info = typeof locale.getWeekInfo === 'function' ? locale.getWeekInfo() : locale.weekInfo;
      if (info?.firstDay) return info.firstDay % 7;
    } catch {// An unknown locale keeps the Monday the grid always had.
    }

    return 1;
  }

  get locale() {
    return normalizeLocale(this.getAttribute('locale'), this);
  }

  get format() {
    return this.getAttribute('format') || 'DD.MM.YYYY';
  } // The name for a field whose label is drawn outside it -- a record panel
  // prints the label itself, and passing it to the control printed it twice.


  get ariaLabel() {
    return this.getProp('ariaLabel') || '';
  } // Read-only as the field draws it, not just the attribute: a range is always
  // chosen on the grid (one field holding two dates has no single format to
  // read back), so `range` alone makes the field read-only. The template reads
  // this same value -- it once read `!this.typed`, which also counted
  // `disabled`, so a range or disabled field drew read-only while the
  // component said it was not.


  get readonly() {
    return this.range || this.getBooleanAttr('readonly', false);
  } // A date can be typed. The field was hard-readonly, so a host that edits a
  // date could only pick one on the grid -- and the mask properties beside it
  // reached a field nobody could type in (Larena storage QA, 2026-10-22).
  // A range is still chosen on the grid -- `readonly` already says so.


  get typed() {
    return !this.readonly && !this.disabled;
  }

  get formattedValue() {
    return formatDateValue(this.selectedDate, this.format);
  }

  get formattedStartValue() {
    return formatDateValue(this.startDate, this.format);
  }

  get formattedEndValue() {
    return formatDateValue(this.endDate, this.format);
  }

  get displayValue() {
    if (!this.range) {
      return this.formattedValue;
    }

    if (this.formattedStartValue && this.formattedEndValue) {
      return `${this.formattedStartValue} - ${this.formattedEndValue}`;
    }

    return this.formattedStartValue || this.formattedEndValue || '';
  }

  get displayDate() {
    return new Date(this.year, this.month, 1);
  }

  get isRtl() {
    return (this.closest('[dir]')?.getAttribute('dir') || document.documentElement?.dir) === 'rtl';
  }

  get labels() {
    return getLabels(this);
  }

  get weekdays() {
    return getWeekdays(this.locale, this.weekStart);
  }

  get calendarLabel() {
    try {
      return new Intl.DateTimeFormat(this.locale, {
        month: 'long',
        year: 'numeric'
      }).format(this.displayDate);
    } catch {
      return `${this.month + 1}.${this.year}`;
    }
  }

  get activeDate() {
    const candidate = parseDate(this.state.activeDate) || this.primaryDate || this.displayDate;
    const minDate = this.setMinDate();
    const maxDate = this.setMaxDate();
    if (minDate && compareDates(candidate, minDate) < 0) return minDate;
    if (maxDate && compareDates(candidate, maxDate) > 0) return maxDate;
    return candidate;
  }

  get normalizedRange() {
    const startDate = this.startDate;
    const endDate = this.endDate;

    if (!startDate || !endDate) {
      return {
        startDate,
        endDate
      };
    }

    if (compareDates(startDate, endDate) <= 0) {
      return {
        startDate,
        endDate
      };
    }

    return {
      startDate: endDate,
      endDate: startDate
    };
  }

  get days() {
    const firstDay = new Date(this.year, this.month, 1);
    const firstWeekDay = firstDay.getDay();
    const offset = (firstWeekDay - this.weekStart + 7) % 7;
    const gridStartDate = new Date(this.year, this.month, 1 - offset);
    const {
      startDate,
      endDate
    } = this.normalizedRange;
    const hasRangeEnd = Boolean(this.startValue && this.endValue);
    const minDate = this.setMinDate();
    const maxDate = this.setMaxDate();
    const activeDate = this.activeDate;
    const today = new Date();
    return Array.from({
      length: 42
    }).map((_, index) => {
      const date = new Date(gridStartDate.getFullYear(), gridStartDate.getMonth(), gridStartDate.getDate() + index);
      const time = date.getTime(); // A disabled field disables every day: a panel a host holds open,
      // or the inline one, takes no choice (see panelDisabled).

      const disabled = Boolean(this.disabled || minDate && time < minDate.getTime() || maxDate && time > maxDate.getTime());
      return {
        date,
        value: formatIsoDate(date),
        formattedValue: formatDateValue(date, this.format),
        label: getDateLabel(date, this.locale),
        day: date.getDate(),
        today: sameDay(date, today),
        currentMonth: date.getMonth() === this.month,
        weekend: [0, 6].includes(date.getDay()),
        disabled: disabled,
        selected: this.range ? sameDay(date, startDate) || sameDay(date, endDate) : sameDay(date, this.selectedDate),
        rangeStart: this.range && hasRangeEnd && sameDay(date, startDate),
        rangeEnd: this.range && hasRangeEnd && sameDay(date, endDate),
        rangeSelected: this.range && hasRangeEnd && isBetweenDates(date, startDate, endDate),
        tabIndex: !disabled && sameDay(date, activeDate) ? 0 : -1
      };
    });
  }

  get months() {
    const minDate = this.setMinDate();
    const maxDate = this.setMaxDate();
    const minMonth = minDate ? new Date(minDate.getFullYear(), minDate.getMonth(), 1) : null;
    const maxMonth = maxDate ? new Date(maxDate.getFullYear(), maxDate.getMonth(), 1) : null;
    return Array.from({
      length: 12
    }).map((_, index) => {
      const date = new Date(this.year, index, 1);
      const time = date.getTime();
      const disabled = Boolean(this.disabled || minMonth && time < minMonth.getTime() || maxMonth && time > maxMonth.getTime());
      return {
        index,
        label: getMonthLabel(index, this.locale),
        selected: index === this.month,
        disabled
      };
    });
  }

  get years() {
    const minDate = this.setMinDate();
    const maxDate = this.setMaxDate();
    const start = this.yearPageStart;
    return Array.from({
      length: YEARS_PAGE_SIZE
    }).map((_, index) => {
      const year = start + index;
      const disabled = Boolean(this.disabled || minDate && year < minDate.getFullYear() || maxDate && year > maxDate.getFullYear());
      return {
        year,
        disabled: disabled,
        selected: year === this.year
      };
    });
  }

  get yearPageStart() {
    return this.state.yearPageStart ?? this.getYearPageStart(this.year);
  }

  get yearPageEnd() {
    return this.yearPageStart + YEARS_PAGE_SIZE - 1;
  }

  getYearPageStart(year = this.year) {
    const normalizedYear = (0,_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__.toNumber)(year, new Date().getFullYear());
    return normalizedYear - normalizedYear % YEARS_PAGE_SIZE;
  }

  formatToMask = format => {
    let mask = String(format).replace(/[A-Za-z]/g, '0');

    if (this.range) {
      mask += ` - ${mask}`;
    }

    return mask;
  };

  setContext(nextContext = '') {
    this.setState({
      context: nextContext || ''
    });
    return this;
  }

  toggleContext(nextContext) {
    if (this.disabled) return this;
    const nextMode = this.contextMode === nextContext ? '' : nextContext;
    const nextState = {
      context: nextMode
    };

    if (nextMode === 'year') {
      nextState.yearPageStart = this.getYearPageStart(this.year);
    }

    this.setState(nextState);
    return this;
  }

  shiftYearPage(direction = 1) {
    if (this.disabled) return this;
    this.set({
      yearPageStart: this.yearPageStart + YEARS_PAGE_SIZE * direction
    });
    return this;
  }

  shiftMonth(direction = 1) {
    if (this.disabled) return this;
    const next = new Date(this.year, this.month + direction, 1);
    const minDate = this.setMinDate();
    const maxDate = this.setMaxDate();
    if (minDate && next < new Date(minDate.getFullYear(), minDate.getMonth(), 1)) return this;
    if (maxDate && next > new Date(maxDate.getFullYear(), maxDate.getMonth(), 1)) return this;
    this.setState({
      year: next.getFullYear(),
      month: next.getMonth(),
      context: ''
    });
    this.set({
      activeDate: formatIsoDate(next)
    });
    return this;
  }

  setActiveDate(value) {
    const date = parseDate(value);
    if (!date || this.state.activeDate === value) return this;
    this.set({
      activeDate: formatIsoDate(date)
    });
    return this;
  }

  moveActiveDate(days) {
    const next = new Date(this.activeDate);
    next.setDate(next.getDate() + days);
    const minDate = this.setMinDate();
    const maxDate = this.setMaxDate();
    if (minDate && compareDates(next, minDate) < 0) return this;
    if (maxDate && compareDates(next, maxDate) > 0) return this;
    this._focusDateAfterRender = true;
    this.setState({
      year: next.getFullYear(),
      month: next.getMonth(),
      context: ''
    });
    this.set({
      activeDate: formatIsoDate(next)
    });
    return this;
  }

  _openPanel({
    focusCalendar = false
  } = {}) {
    if (this.disabled) return this;
    this._focusCalendarOnOpen = focusCalendar;
    if (!this.open) this.showValueMonth();else if (!this.state.activeDate) {
      this.set({
        activeDate: formatIsoDate(this.activeDate)
      });
    }

    if (this.open) {
      this.positionPanel();
      return this;
    }

    this.setState({
      open: true
    });
    return this;
  }

  _closePanel({
    restoreFocus = false
  } = {}) {
    if (!this.open) {
      return this;
    }

    this.setState({
      open: false,
      context: ''
    });
    if (restoreFocus) requestAnimationFrame(() => this._input?.focus?.());
    return this;
  }

  _togglePanel() {
    return this.open ? this._closePanel() : this._openPanel();
  } // What is typed is read through the declared format, so «14.10.2026» and
  // «2026-10-14» both land. Text that is not a date, or a date outside the
  // allowed range, puts the field back to the value it held: a half-typed date
  // must not clear a stored one. An emptied field clears the value, because
  // deleting the text is how a person says there is no date.


  handleInputChange(event) {
    if (!this.typed) return; // The field's own change belongs to the component, not to the page: it
    // carries the display text, and a host reading `event.target.value` on
    // it would store «14.10.2026» where it expects the ISO value. The
    // component says the change itself, once, through emitChange.

    if (event?.type === 'change') event.stopPropagation();
    const field = event?.target;
    const text = String(field?.value ?? '').trim();

    const restore = () => {
      const input = field?.querySelector?.('input') || field;
      if (input && 'value' in input) input.value = this.displayValue;
    };

    if (!text) {
      if (!this.date) return;
      this.setState({
        date: '',
        context: ''
      });
      this.emitChange();
      return;
    }

    const date = parseDateValue(text, this.format);
    const minDate = this.setMinDate();
    const maxDate = this.setMaxDate();
    const outOfRange = Boolean(date) && (minDate && compareDates(date, minDate) < 0 || maxDate && compareDates(date, maxDate) > 0);

    if (!date || outOfRange) {
      restore();
      return;
    }

    const value = formatIsoDate(date);

    if (value === this.date) {
      restore();
      return;
    }

    this.setState({
      year: date.getFullYear(),
      month: date.getMonth(),
      date: value,
      context: ''
    });
    this.set({
      activeDate: value
    });
    this.emitChange();
  } // Typing is not a change: the value is read when the field says it changed,
  // so the keystrokes stay inside the component too.


  handleInputInput(event) {
    if (this.typed) event?.stopPropagation?.();
  }

  handleInputClick(event) {
    event?.preventDefault?.();
    event?.stopPropagation?.();

    this._openPanel();
  }

  handleInputKeydown(event) {
    // In a field that can be typed in, Enter commits the text and the space
    // bar belongs to the text; ArrowDown still opens the grid.
    if (this.typed) {
      if (event.key !== 'ArrowDown' && event.key !== 'Enter') return;
      event.preventDefault();

      if (event.key === 'Enter') {
        this.handleInputChange(event);
        return;
      }

      this._openPanel({
        focusCalendar: true
      });

      return;
    }

    if (!['ArrowDown', 'Enter', ' '].includes(event.key)) return;
    event.preventDefault();

    this._openPanel({
      focusCalendar: true
    });
  }

  handleDayKeydown(event, day) {
    if (this.disabled) return;
    const horizontal = this.isRtl ? -1 : 1;
    const keySteps = {
      ArrowLeft: -horizontal,
      ArrowRight: horizontal,
      ArrowUp: -7,
      ArrowDown: 7
    };

    if (Object.prototype.hasOwnProperty.call(keySteps, event.key)) {
      event.preventDefault();
      this.moveActiveDate(keySteps[event.key]);
      return;
    }

    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      const date = day?.date || this.activeDate;
      const offset = (date.getDay() - this.weekStart + 7) % 7;
      this.moveActiveDate(event.key === 'Home' ? -offset : 6 - offset);
      return;
    }

    if (event.key === 'PageUp' || event.key === 'PageDown') {
      event.preventDefault();
      const direction = event.key === 'PageUp' ? -1 : 1;
      let next = shiftDateByMonth(this.activeDate, direction);
      const minDate = this.setMinDate();
      const maxDate = this.setMaxDate();
      if (minDate && compareDates(next, minDate) < 0) next = minDate;
      if (maxDate && compareDates(next, maxDate) > 0) next = maxDate;
      this._focusDateAfterRender = true;
      this.setState({
        year: next.getFullYear(),
        month: next.getMonth()
      });
      this.set({
        activeDate: formatIsoDate(next)
      });
    }
  }

  handlePanelClick(event) {
    event?.stopPropagation?.();
  }

  handleDocumentClick(event) {
    if (!this.open) {
      return;
    }

    const target = event.target;

    if (this.contains(target) || this.refs.datePickerPanel.value?.contains?.(target)) {
      return;
    }

    this._closePanel();
  } // An open calendar owns Escape: the press closes the calendar, the focus goes
  // back to the field, and nothing behind it -- a drawer, a modal, a record
  // panel -- sees the press. It listened in the bubble phase and raised no
  // mark, so a drawer listening before it and a record panel listening in
  // capture both closed first, and the date typed into the field went with
  // the panel (Larena admin acceptance, 2026-10-22). Now it listens in capture
  // like every other surface that owns Escape, holds the shared open-surface
  // mark while open, and acts only as the innermost open layer, so a calendar
  // inside a popover closes before the popover does.


  handleDocumentKeydown(event) {
    if (!this.open || event.key !== 'Escape' || event.defaultPrevented) {
      return;
    }

    if (!(0,_core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_12__.isTopOpenSurface)(this)) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    if (this.contextMode) {
      this.setContext('');
      return;
    }

    this._closePanel({
      restoreFocus: true
    });
  }

  syncOverlayListeners() {
    const open = Boolean(this.input && this.open);
    (0,_core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_12__.holdOpenSurfaceMark)(this, open);

    if (open) {
      document.addEventListener('click', this._documentClickHandler);
      document.addEventListener('keydown', this._documentKeydownHandler, true);
      return;
    }

    this.removeOverlayListeners();
  }

  removeOverlayListeners() {
    (0,_core_js_open_surface_mark__WEBPACK_IMPORTED_MODULE_12__.holdOpenSurfaceMark)(this, false);
    document.removeEventListener('click', this._documentClickHandler);
    document.removeEventListener('keydown', this._documentKeydownHandler, true);
    this.stopPanelPosition();
    window.removeEventListener('resize', this._viewportHandler);
    document.removeEventListener('scroll', this._viewportHandler, true);
    window.visualViewport?.removeEventListener('resize', this._viewportHandler);
    window.visualViewport?.removeEventListener('scroll', this._viewportHandler);
  }

  positionPanel() {
    const panel = this.refs.datePickerPanel.value; // Anchor to the visible field frame, not the bare text input inside it.

    const trigger = this._input?.closest('.sf-input-field') || this._input || this.querySelector('sf-input'); // A deferred call after disconnect must not start tracking detached nodes.

    if (!this.isConnected || !this.input || !this.portal || !this.open || !panel?.isConnected || !trigger) {
      this.stopPanelPosition();
      return;
    } // Shared Framework geometry (SF.Position on Floating UI): below the
    // field, flipped above when it does not fit, shifted and height-limited
    // inside the viewport, following scroll and resize on its own.


    if (!this._panelAnchor || this._panelAnchorPanel !== panel || this._panelAnchorTrigger !== trigger) {
      this.stopPanelPosition();
      Object.assign(panel.style, {
        overflowY: 'auto',
        zIndex: 'var(--sf-z-index-9)'
      });
      this._panelAnchorPanel = panel;
      this._panelAnchorTrigger = trigger;
      this._panelAnchor = (globalThis.SF?.Position || (_core_js_position_js__WEBPACK_IMPORTED_MODULE_6___default())).anchor(trigger, panel, {
        side: 'block-end',
        align: 'start',
        onPosition: ({
          side
        }) => {
          const openAbove = side === 'block-start';
          if (Boolean(this.state.openAbove) !== openAbove) this.set({
            openAbove
          });
        }
      });
      return;
    }

    this._panelAnchor.update();
  }

  stopPanelPosition() {
    this._panelAnchor?.stop();
    this._panelAnchor = null;
    this._panelAnchorPanel = null;
    this._panelAnchorTrigger = null;
  }

  selectDate(day) {
    if (this.disabled || !day?.date || day.disabled) {
      return this;
    }

    if (this.range) {
      this.selectRangeDate(day);
      return this;
    }

    this.setState({
      year: day.date.getFullYear(),
      month: day.date.getMonth(),
      date: day.value,
      context: ''
    });
    this.set({
      activeDate: day.value
    });
    this.emitChange();
    if (this.closeOnSelect) this._closePanel({
      restoreFocus: true
    });
    return this;
  }

  selectRangeDate(day) {
    if (!this.startValue || this.startValue && this.endValue) {
      this.setState({
        year: day.date.getFullYear(),
        month: day.date.getMonth(),
        startValue: day.value,
        endValue: '',
        date: day.value,
        context: '',
        preset: ''
      });
      this.set({
        activeDate: day.value
      });
      this.emitChange();
      return this;
    }

    const startDate = this.startDate;
    const nextState = {
      year: day.date.getFullYear(),
      month: day.date.getMonth(),
      context: '',
      preset: ''
    };

    if (startDate && compareDates(day.date, startDate) < 0) {
      nextState.startValue = day.value;
      nextState.endValue = this.startValue;
      nextState.date = day.value;
    } else {
      nextState.endValue = day.value;
      nextState.date = this.startValue;
    }

    this.setState(nextState);
    this.set({
      activeDate: day.value
    });
    this.emitChange();
    if (this.closeOnSelect) this._closePanel({
      restoreFocus: true
    });
    return this;
  } // A quick range: its dates, the grid on the month it ends in, and the change
  // said once, by the person's choice -- never by a render.


  _choosePreset(item) {
    if (this.disabled || !item || item.disabled) return this;
    const from = formatIsoDate(item.from);
    const to = formatIsoDate(item.to);
    this.setState({
      preset: item.id,
      startValue: from,
      endValue: to,
      date: from,
      year: item.to.getFullYear(),
      month: item.to.getMonth(),
      context: ''
    });
    this.set({
      activeDate: to
    });
    this.emitChange();
    if (this.closeOnSelect) this._closePanel({
      restoreFocus: true
    });
    return this;
  } // «Свой период»: the quick range lets go and the person picks on the grid.


  _chooseCustomRange() {
    if (this.disabled) return this;
    if (this.preset) this.setState({
      preset: '',
      startValue: '',
      endValue: '',
      date: ''
    });
    this._focusDateAfterRender = true;
    this.requestComponentUpdate('custom-range');
    return this;
  } // The list is one tab stop: arrows move along it, Tab goes on to the grid.


  handlePresetKeydown(event) {
    const keys = {
      ArrowDown: 1,
      ArrowRight: 1,
      ArrowUp: -1,
      ArrowLeft: -1
    };
    if (!(event.key in keys) && event.key !== 'Home' && event.key !== 'End') return;
    const buttons = [...event.currentTarget.querySelectorAll('button:not(:disabled)')];
    if (!buttons.length) return;
    event.preventDefault();
    const index = buttons.indexOf(event.target);
    let next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : index + keys[event.key];
    if (this.isRtl && (event.key === 'ArrowRight' || event.key === 'ArrowLeft')) next = index - keys[event.key];
    next = (next + buttons.length) % buttons.length;
    buttons.forEach((button, at) => button.setAttribute('tabindex', at === next ? '0' : '-1'));
    buttons[next].focus();
  }

  selectMonth(month) {
    if (this.disabled || !month || month.disabled) {
      return this;
    }

    this.setState({
      month: month.index,
      context: ''
    });
    this.set({
      activeDate: formatIsoDate(new Date(this.year, month.index, 1))
    });
    return this;
  }

  selectYear(year) {
    if (this.disabled || !year || year.disabled) {
      return this;
    }

    const nextState = {
      year: year.year,
      context: ''
    };
    const nextMonth = this.getClosestEnabledMonth(year.year, this.month);

    if (nextMonth !== this.month) {
      nextState.month = nextMonth;
    }

    this.setState(nextState);
    this.set({
      activeDate: formatIsoDate(new Date(year.year, nextMonth, 1))
    });
    return this;
  }

  getClosestEnabledMonth(year, month) {
    const minDate = this.setMinDate();
    const maxDate = this.setMaxDate();

    if (minDate && year === minDate.getFullYear() && month < minDate.getMonth()) {
      return minDate.getMonth();
    }

    if (maxDate && year === maxDate.getFullYear() && month > maxDate.getMonth()) {
      return maxDate.getMonth();
    }

    return month;
  }

  emitChange() {
    // date and isoValue mean one thing in both modes: the ISO value. For a
    // range that is the ISO 8601 interval start/end (the start alone while
    // the end is not chosen); they were the formatted range and the start
    // (docs trial 4).
    const interval = this.startValue && this.endValue ? `${this.startValue}/${this.endValue}` : this.startValue || '';
    const detail = this.range ? {
      value: [this.startValue, this.endValue],
      date: interval,
      startValue: this.startValue,
      endValue: this.endValue,
      formattedValue: this.displayValue,
      formattedStartValue: this.formattedStartValue,
      formattedEndValue: this.formattedEndValue,
      isoValue: interval,
      startIsoValue: this.startValue,
      endIsoValue: this.endValue,
      range: true,
      format: this.format,
      // The quick range chosen, so a host can store «last 7 days»
      // rather than the dates it meant today.
      preset: this.activePreset ? this.activePreset.relative ? {
        id: this.activePreset.id,
        relative: this.activePreset.relative
      } : {
        id: this.activePreset.id
      } : null
    } : {
      value: this.date,
      date: this.date,
      formattedValue: this.formattedValue,
      isoValue: this.date,
      range: false,
      format: this.format
    }; // Once, under its native name, without the element in its detail (§8);
    // the shim sends sf-datepicker-change and sf-change after it with the
    // same detail (aliases.json).

    this.sfSyncFormState();
    this.sfEmit('change', detail);
  }

  templateContext() {
    const props = this.getPropsContext();
    return this.createTemplateContext({ ...props,
      component: this,
      date: this.date,
      formattedValue: this.formattedValue,
      displayValue: this.displayValue,
      startValue: this.startValue,
      formattedStartValue: this.formattedStartValue,
      endValue: this.endValue,
      formattedEndValue: this.formattedEndValue,
      range: this.range,
      format: this.format,
      selectedDate: this.selectedDate,
      startDate: this.startDate,
      endDate: this.endDate,
      year: this.year,
      month: this.month,
      monthLabel: getMonthLabel(this.month, this.locale),
      calendarLabel: this.calendarLabel,
      labels: this.labels,
      weekdays: this.weekdays,
      panelId: this._panelId,
      previousIcon: this.isRtl ? 'chevron_right' : 'chevron_left',
      nextIcon: this.isRtl ? 'chevron_left' : 'chevron_right',
      context: this.contextMode,
      locale: this.locale,
      days: this.days,
      presetItems: this.presetItems,
      months: this.months,
      years: this.years,
      yearPageStart: this.yearPageStart,
      yearPageEnd: this.yearPageEnd,
      rootClass: this.getRootClass(),
      rootStyle: this.getRootStyle(),
      openAbove: Boolean(this.state.openAbove),
      input: this.input,
      open: this.open,
      portal: this.portal,
      inputType: this.inputType,
      inputSize: this.inputSize,
      // The host is the form control where the browser has
      // ElementInternals, so the inner text box carries no name (§17.1
      // item 6); without them it is named, as before.
      inputName: this.inputName,
      boxName: this.sfInternals ? '' : this.inputName,
      placeholder: this.placeholder,
      label: this.label,
      ariaLabel: this.ariaLabel,
      readonly: this.readonly,
      disabled: this.disabled,
      required: this.required,
      invalid: this.invalid,
      errorMessage: this.errorMessage,
      // The field's own words and marker, as on sf-input: the helper text
      // under the control (which the field reads to it as its
      // description) and the marker at the field's end. The settings
      // themselves come from component.json, so `hint` and `hintIcon`
      // are the manifest's own accessors.
      hint: this.hint,
      leftIcon: this.leftIcon,
      iconStart: this.leftIcon,
      hintIcon: this.hintIcon,
      inputRootClass: this.inputRootClass,
      mask: this.mask,
      maskPattern: this.maskPattern,
      maskLazy: this.maskLazy,
      maskPlaceholderChar: this.maskPlaceholderChar,
      maskOptions: this.maskOptions
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_5__.renderDatepickerTemplate)(this.templateContext());
  }

  afterRender() {
    this._input = this.refs.input?.value?.querySelector('input') || null;

    if (this._input) {
      this._input.setAttribute('aria-haspopup', 'dialog');

      this._input.setAttribute('aria-expanded', this.open ? 'true' : 'false');

      this._input.setAttribute('aria-controls', this._panelId);
    }

    const monthToggle = this.querySelector('.sf-datepicker-month-toggle button');
    const yearToggle = this.querySelector('.sf-datepicker-year-toggle button');
    monthToggle?.setAttribute('aria-expanded', this.contextMode === 'month' ? 'true' : 'false');
    yearToggle?.setAttribute('aria-expanded', this.contextMode === 'year' ? 'true' : 'false');
    this.syncOverlayListeners();
    this.sfSyncFormState();
    requestAnimationFrame(() => {
      this.positionPanel();

      if (this._focusCalendarOnOpen || this._focusDateAfterRender) {
        const active = this.querySelector(`.sf-datepicker-day[data-date="${formatIsoDate(this.activeDate)}"]`);
        active?.focus?.();
        this._focusCalendarOnOpen = false;
        this._focusDateAfterRender = false;
      }
    });
  }

  onDisconnected() {
    this.removeOverlayListeners();
    super.onDisconnected();
  }

  get data() {
    return {
      value: this.value,
      date: this.date,
      formattedValue: this.formattedValue,
      displayValue: this.displayValue,
      startValue: this.startValue,
      formattedStartValue: this.formattedStartValue,
      endValue: this.endValue,
      formattedEndValue: this.formattedEndValue,
      range: this.range,
      format: this.format,
      year: this.year,
      month: this.month,
      context: this.contextMode,
      maxDate: this.maxDate,
      minDate: this.minDate,
      locale: this.locale,
      input: this.input,
      open: this.open,
      portal: this.portal,
      mask: this.mask,
      maskPattern: this.maskPattern,
      maskOptions: this.maskOptions,
      presets: this.presetItems.map(({
        id,
        label,
        relative,
        disabled
      }) => ({
        id,
        label,
        relative,
        disabled
      })),
      preset: this.preset
    };
  }

}

SfDatepicker.define('sf-datepicker');
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "77b2f4107e3b"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderDatepickerTemplate: () => (/* binding */ renderDatepickerTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var lit_directives_ref_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("8137feb490e0");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, lit_directives_ref_js__WEBPACK_IMPORTED_MODULE_1__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, lit_directives_ref_js__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lit_directives_ref_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lit_directives_ref_js__WEBPACK_IMPORTED_MODULE_1__);



function joinClasses(...tokens) {
  return tokens.flat().filter(Boolean).join(' ');
}

function renderYearTop(context) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-datepicker-top flex content-main-between items-cross-center">
            <sf-icon-button appearance="link" scheme="on-surface" size="1" ?disabled=${context.disabled}
                icon=${context.previousIcon} aria-label=${context.labels.previousYears}
                @click=${() => context.component.shiftYearPage(-1)}></sf-icon-button>
            <div class="sf-datepicker-range-title" aria-live="polite">
                ${context.yearPageStart}–${context.yearPageEnd}
            </div>
            <sf-icon-button appearance="link" scheme="on-surface" size="1" ?disabled=${context.disabled}
                icon=${context.nextIcon} aria-label=${context.labels.nextYears}
                @click=${() => context.component.shiftYearPage(1)}></sf-icon-button>
        </div>`;
}

function renderTop(context) {
  if (context.context === 'year') return renderYearTop(context);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-datepicker-top grid items-cross-center">
            <sf-icon-button appearance="link" scheme="on-surface" size="1" ?disabled=${context.disabled}
                icon=${context.previousIcon} aria-label=${context.labels.previousMonth}
                @click=${() => context.component.shiftMonth(-1)}></sf-icon-button>
            <div class="sf-datepicker-period flex content-main-center items-cross-center gap-1/4">
                <sf-button class="sf-datepicker-month-toggle" appearance="link" scheme="on-surface" spacing="compact"
                    ?disabled=${context.disabled}
                    text=${context.monthLabel}
                    aria-expanded=${context.context === 'month' ? 'true' : 'false'}
                    @click=${() => context.component.toggleContext('month')}></sf-button>
                <sf-button class="sf-datepicker-year-toggle" appearance="link" scheme="on-surface" spacing="compact"
                    ?disabled=${context.disabled}
                    text=${String(context.year)}
                    aria-expanded="false"
                    @click=${() => context.component.toggleContext('year')}></sf-button>
            </div>
            <sf-icon-button appearance="link" scheme="on-surface" size="1" ?disabled=${context.disabled}
                icon=${context.nextIcon} aria-label=${context.labels.nextMonth}
                @click=${() => context.component.shiftMonth(1)}></sf-icon-button>
        </div>`;
}

function renderMonthContext(context) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-datepicker-context absolute top-0 bottom-0 inline-start-0 inline-end-0 grid grid-col-3 content-cross-start items-cross-start overflow-auto gap-1/4"
             aria-label=${context.labels.chooseMonth}>
            ${context.months.map(month => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                <button class=${joinClasses('sf-datepicker-text flex content-main-center items-cross-center', month.selected ? 'active' : '', month.disabled ? 'disabled' : '')}
                    ?disabled=${month.disabled} aria-pressed=${month.selected ? 'true' : 'false'}
                    type="button" @click=${() => context.component.selectMonth(month)}>
                    <span class="sf-datepicker-text-date">${month.label}</span>
                </button>`)}
        </div>`;
}

function renderYearContext(context) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-datepicker-context absolute top-0 bottom-0 inline-start-0 inline-end-0 grid grid-col-3 content-cross-start items-cross-start overflow-auto gap-1/4"
             aria-label=${context.labels.chooseYear}>
            ${context.years.map(year => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                <button class=${joinClasses('sf-datepicker-text flex content-main-center items-cross-center', year.selected ? 'active' : '', year.disabled ? 'disabled' : '')}
                    type="button" ?disabled=${year.disabled} aria-pressed=${year.selected ? 'true' : 'false'}
                    @click=${() => context.component.selectYear(year)}>
                    <span class="sf-datepicker-text-date">${year.year}</span>
                </button>`)}
        </div>`;
}

function renderContext(context) {
  if (context.context === 'month') return renderMonthContext(context);
  if (context.context === 'year') return renderYearContext(context);
  return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
}

function renderDatepickerInput(context) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-input class="sf-datepicker-input" ${(0,lit_directives_ref_js__WEBPACK_IMPORTED_MODULE_1__.ref)(context.component.refs.input)}
            appearance=${context.inputType} size=${context.inputSize}
            label=${context.label || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} name=${context.boxName || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            aria-label=${context.label ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : context.ariaLabel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            placeholder=${context.placeholder || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} icon-start=${context.iconStart || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            root-class=${context.inputRootClass || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} value=${context.displayValue || ''}
            ?disabled=${context.disabled} ?required=${context.required} ?invalid=${context.invalid}
            error-message=${context.errorMessage || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            hint=${context.hint || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} hint-icon=${context.hintIcon || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ?mask=${context.mask}
            mask-pattern=${context.maskPattern || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} mask-lazy=${String(context.maskLazy)}
            mask-placeholder-char=${context.maskPlaceholderChar || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            mask-options=${context.maskOptions || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} ?readonly=${context.readonly}
            @click=${event => context.component.handleInputClick(event)}
            @change=${event => context.component.handleInputChange(event)}
            @input=${event => context.component.handleInputInput(event)}
            @keydown=${event => context.component.handleInputKeydown(event)}></sf-input>`;
}

function renderDay(day, context) {
  const classes = joinClasses('sf-datepicker-day', day.weekend ? 'sf-datepicker-day-off' : '', day.selected ? 'active' : '', day.rangeStart ? 'sf-datepicker-day-start' : '', day.rangeSelected ? 'sf-datepicker-day-selected' : '', day.rangeEnd ? 'sf-datepicker-day-end' : '', day.currentMonth ? '' : 'sf-datepicker-another-month', day.disabled ? 'disabled' : '');
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <button class=${classes} type="button" ?disabled=${day.disabled}
            data-date=${day.value} aria-label=${day.label}
            aria-current=${day.today ? 'date' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            aria-pressed=${day.selected ? 'true' : 'false'} tabindex=${day.tabIndex}
            @click=${() => context.component.selectDate(day)}
            @focus=${() => context.component.setActiveDate(day.value)}
            @keydown=${event => context.component.handleDayKeydown(event, day)}>
            <span class="sf-datepicker-day-date">${day.day}</span>
        </button>`;
}

function renderPresets(context) {
  const items = context.presetItems;
  if (!items.length) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing; // One tab stop: the pressed range, or the first one that can be chosen.
  // A disabled field disables every quick range and «Свой период» with them.

  const focusable = context.disabled ? null : items.find(item => item.pressed && !item.disabled) ?? items.find(item => !item.disabled); // «Свой период» is pressed for a range picked on the grid, not for no range.

  const custom = !items.some(item => item.pressed) && Boolean(context.startValue);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-datepicker-presets flex flex-col gap-1/4" role="group" aria-label=${context.labels.presets}
            @keydown=${event => context.component.handlePresetKeydown(event)}>
            ${items.map(item => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                <button class=${joinClasses('sf-datepicker-text sf-datepicker-preset flex items-cross-center', item.pressed ? 'active' : '')}
                    type="button" ?disabled=${item.disabled || context.disabled} aria-pressed=${item.pressed ? 'true' : 'false'}
                    tabindex=${item === focusable ? '0' : '-1'} data-preset=${item.id}
                    @click=${() => context.component.choosePreset(item)}>${item.label}</button>`)}
            <button class=${joinClasses('sf-datepicker-text sf-datepicker-preset flex items-cross-center', custom ? 'active' : '')}
                type="button" ?disabled=${context.disabled} aria-pressed=${custom ? 'true' : 'false'} tabindex=${focusable || context.disabled ? '-1' : '0'} data-preset=""
                @click=${() => context.component.chooseCustomRange()}>${context.labels.customRange}</button>
        </div>`;
}

function renderDatepickerPanel(context) {
  const rootClasses = joinClasses('sf-datepicker inline-flex', context.presetItems.length ? 'sf-datepicker--presets' : '', context.rootClass);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div ${(0,lit_directives_ref_js__WEBPACK_IMPORTED_MODULE_1__.ref)(context.component.refs.datePickerPanel)} id=${context.panelId}
            class=${rootClasses} style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            role=${context.input ? 'dialog' : 'group'} aria-label=${context.calendarLabel}
            aria-disabled=${context.disabled ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            @click=${event => context.component.handlePanelClick(event)}>
            ${renderPresets(context)}
            <div class="sf-datepicker-container flex flex-col">
                ${renderTop(context)}
                <div class="sf-datepicker-weekdays grid grid-col-7" aria-hidden="true">
                    ${context.weekdays.map(weekday => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-datepicker-weekday">${weekday}</span>`)}
                </div>
                <div class="sf-datepicker-main relative">
                    ${renderContext(context)}
                    <div class="sf-datepicker-grid grid grid-col-7">
                        ${context.days.map(day => renderDay(day, context))}
                    </div>
                </div>
            </div>
        </div>`;
}

function renderDatepickerTemplate(context) {
  if (!context.input) return renderDatepickerPanel(context);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class=${joinClasses('sf-datepicker-wrap inline-flex flex-col relative', context.open ? 'is-open' : '', context.openAbove ? 'sf-datepicker-wrap--drop-up' : 'sf-datepicker-wrap--drop-down')}
            ${(0,lit_directives_ref_js__WEBPACK_IMPORTED_MODULE_1__.ref)(context.component.refs.datePickerRoot)} data-portal=${context.portal ? 'true' : 'false'}>
            ${renderDatepickerInput(context)}
            ${context.open ? renderDatepickerPanel(context) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        </div>`;
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

};

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

/***/ "8137feb490e0"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit/directives/ref.js", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("lit/directives/ref.js", 1).then(resolve, reject), { once: true })));

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

/***/ "7cb84e1fa3a3"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases for the shim (core/js/aliases.js, standard simai.smart-component 1.3.8 §16.20). Event rows send the new name first, then the old one, with one detail; setting rows map the old attribute and property to the new; host-attribute rows (no \\"to\\") stay host attributes read by the browser or the base and are listed, refused by the shim on purpose; documentary rows (\\"shim\\": \\"none\\") record a rename the shim cannot serve.","component":"sf-datepicker","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"aria-label","to":null,"kind":"attribute","component":"sf-datepicker","since":"2026-10-27","remove_after":"2026-12-01","mode":"host-attribute","section":"§3.1","note":"stays a host attribute, read by the base (§3.1, §4.8); no shim"},{"from":"sf-datepicker-change","to":"change","kind":"event","component":"sf-datepicker","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","cancelable":false,"note":"sent by the shim after change, with the same detail; the detail no longer carries the element (§8)"},{"from":"sf-change","to":"change","kind":"event","component":"sf-datepicker","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","cancelable":false,"note":"sent by the shim after change, with the same detail; the detail no longer carries the element (§8)"}]}');

/***/ },

/***/ "ef6661f4d1bb"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.datepicker","tag":"sf-datepicker","version":"1.2.0","kind":"leaf","settings":{"date":{"type":"string","default":""},"start-value":{"type":"string","default":""},"end-value":{"type":"string","default":""},"max-date":{"type":"string","default":""},"min-date":{"type":"string","default":""},"range":{"type":"boolean","default":false},"month":{"type":"number","optional":true,"integer":true,"min":0,"max":11},"year":{"type":"number","optional":true,"integer":true},"context":{"type":"enum","values":["","month","year"],"default":""},"week-start":{"type":"number","optional":true,"integer":true,"min":0,"max":6},"locale":{"type":"string","default":""},"format":{"type":"string","default":"DD.MM.YYYY"},"close-on-select":{"type":"boolean","default":true},"input":{"type":"boolean","default":true},"portal":{"type":"boolean","default":true},"input-type":{"type":"string","default":"bordered"},"size":{"type":"enum","values":["1/2","1","2"],"default":"1"},"input-size":{"type":"enum","values":["1/2","1","2"],"default":"1"},"input-name":{"type":"string","default":""},"placeholder":{"type":"string","default":""},"label":{"type":"string","default":""},"disabled":{"type":"boolean","default":false},"required":{"type":"boolean","default":false},"invalid":{"type":"boolean","default":false},"error-message":{"type":"string","default":""},"hint":{"type":"string","default":""},"icon-start":{"type":"icon","default":"calendar_today"},"left-icon":{"type":"icon","default":"calendar_today"},"hint-icon":{"type":"icon","default":""},"input-root-class":{"type":"string","default":""},"mask":{"type":"boolean","default":false},"mask-pattern":{"type":"string","default":"00.00.0000"},"mask-lazy":{"type":"boolean","default":false},"mask-placeholder-char":{"type":"string","default":"_"},"mask-options":{"type":"string","default":""},"name":{"type":"string","default":""},"preset":{"type":"string","default":""},"readonly":{"type":"boolean","default":false},"presets":{"type":"list","default":[],"of":{"id":"id","label":{"type":"string","optional":true},"relative":{"type":"enum","values":["today","yesterday","last-7-days","last-30-days","this-week","this-month","last-month"],"optional":true},"range":{"type":"list","optional":true}}}},"values":{"value":{"type":"string","default":""},"open":{"type":"boolean","default":false}},"events":{"change":{"carries":{"value":"object","date":"string","start-value":"string","end-value":"string","formatted-value":"string","iso-value":"string","range":"boolean","format":"string","preset":"object"}}},"actions":{"open-panel":{"with":{"options":"object"}},"close-panel":{"with":{"options":"object"}},"toggle-panel":{},"choose-preset":{"with":{"item":"object"}},"choose-custom-range":{}},"form":{"value":"value","name":"name","default":"value","submits":"value","reset":"default","required":"required","disabled":"disabled","readonly":"readonly","validity":["value-missing","custom-error"]},"layer":{"kind":"surface","traps-focus":false},"css-variables":{"--sf-datepicker-background-color":{"type":"color","state":"open"},"--sf-datepicker-day-color":{"type":"color","state":"rest"},"--sf-datepicker-selected-background-color":{"type":"color","state":"selected"},"--sf-datepicker-selected-color":{"type":"color","state":"selected"},"--sf-datepicker-range-background-color":{"type":"color","state":"in-range"},"--sf-datepicker-weekday-color":{"type":"color","state":"rest"}}}');

/***/ },

/***/ "0b816e511c59"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Datepicker","runtime":{"choose-month":"Choose a month","choose-year":"Choose a year","custom-range":"Custom range","next-month":"Next month","next-years":"Next years","preset-last-month":"Last month","preset-last30-days":"Last 30 days","preset-last7-days":"Last 7 days","preset-this-month":"This month","preset-this-week":"This week","preset-today":"Today","preset-yesterday":"Yesterday","presets":"Quick ranges","previous-month":"Previous month","previous-years":"Previous years","value-missing":"Choose a date."}}');

/***/ },

/***/ "aa7064807ed2"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Календарь","runtime":{"choose-month":"Выберите месяц","choose-year":"Выберите год","custom-range":"Свой период","next-month":"Следующий месяц","next-years":"Следующие годы","preset-last-month":"Прошлый месяц","preset-last30-days":"Последние 30 дней","preset-last7-days":"Последние 7 дней","preset-this-month":"Этот месяц","preset-this-week":"Эта неделя","preset-today":"Сегодня","preset-yesterday":"Вчера","presets":"Быстрый выбор","previous-month":"Предыдущий месяц","previous-years":"Предыдущие годы","value-missing":"Выберите дату."}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("b9b65955223a");
/******/
/******/ })()
;