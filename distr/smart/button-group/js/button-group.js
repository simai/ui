/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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

/***/ "50d2a204ba4c"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SPINNER_DEFAULT_LOOK: () => (/* binding */ SPINNER_DEFAULT_LOOK),
/* harmony export */   SPINNER_DOTS: () => (/* binding */ SPINNER_DOTS),
/* harmony export */   SPINNER_DOTS_FILLED: () => (/* binding */ SPINNER_DOTS_FILLED),
/* harmony export */   SPINNER_GRID: () => (/* binding */ SPINNER_GRID),
/* harmony export */   SPINNER_LOOKS: () => (/* binding */ SPINNER_LOOKS),
/* harmony export */   SPINNER_STROKE: () => (/* binding */ SPINNER_STROKE),
/* harmony export */   createInlineSpinner: () => (/* binding */ createInlineSpinner),
/* harmony export */   createLadderSpinnerSvg: () => (/* binding */ createLadderSpinnerSvg),
/* harmony export */   createSpinnerSvg: () => (/* binding */ createSpinnerSvg),
/* harmony export */   createSvgNode: () => (/* binding */ createSvgNode),
/* harmony export */   normalizeSpinnerLook: () => (/* binding */ normalizeSpinnerLook)
/* harmony export */ });
// The spinner's drawing, without the component's side effects (no registry, no
// observer), so a control that shows work in place of its icon -- a button, an
// icon button, a group's segment, a modal waiting for its content -- draws the
// one spinner of the Framework without loading or binding the spinner
// component (simai/ui-source#10).
//
// The ladder: a spinner is drawn on the icon grid. Material Symbols are drawn on
// 24 units and, at the regular weight the Framework's controls use, stroke 2 of
// them; a spinner on the same grid, scaled to the icon box of a step, strokes as
// the icons of that step do, and needs no stroke of its own per step.
//
// The looks (simai/ui-source#11): every spinner carries the four looks on the
// same ring -- the arc and the breathing arc (one circle, two motions), the
// comet and the dots -- and the spinner sheet shows the one the page asks for:
// data-sf-spinner on html, body or any block (the nearest wins), data-variant on
// the spinner itself above both. The choice is CSS alone, so a page that
// changes the attribute changes every spinner at once, drawn or not yet drawn.
// Without the spinner sheet only the arc is shown, still.
const SVG_NS = 'http://www.w3.org/2000/svg';
const SPINNER_GRID = 24;
const SPINNER_STROKE = 2;
const SPINNER_LOOKS = ['arc', 'breathing', 'comet', 'dots'];
const SPINNER_DEFAULT_LOOK = 'arc'; // The dots look on the grid: a ring of dots as big as the stroke allows, so at
// every step the dots are the step's and no attribute sizes them.

const SPINNER_DOTS = 8;
const SPINNER_DOTS_FILLED = 3; // The comet: a head and a tail a little under half the ring, in segments whose
// opacity falls towards the end of the tail. Segments rather than a gradient,
// because an SVG gradient cannot follow a circle and a CSS one would leave the
// ring and its stroke; each segment strokes in the current ink.

const COMET_SEGMENTS = 10;
const COMET_LENGTH = 40;
function normalizeSpinnerLook(value, fallback = SPINNER_DEFAULT_LOOK) {
  const look = String(value ?? '').trim().toLowerCase();
  return SPINNER_LOOKS.includes(look) ? look : fallback;
}
function createSvgNode(tagName, attributes = {}) {
  const node = document.createElementNS(SVG_NS, tagName);
  Object.entries(attributes).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return;
    }

    node.setAttribute(key, String(value));
  });
  return node;
}

const round = value => Math.round(value * 1000) / 1000; // The four looks in one drawing. On the ladder it is the 24-unit grid with
// stroke 2; a spinner still drawn in pixels (the deprecated attributes) passes
// its own width, height and stroke. The circles carry presentation attributes
// as well as their classes: the spinner sheet styles them (track colour, the
// motion of each look, the still frame under reduced motion), and until that
// sheet has arrived they draw a faint ring and the arc in the current ink
// rather than a filled black disc; the comet and the dots wait hidden.


function createSpinnerSvg({
  width = SPINNER_GRID,
  height = SPINNER_GRID,
  stroke = SPINNER_STROKE,
  dots = SPINNER_DOTS,
  filled = SPINNER_DOTS_FILLED,
  dotRadius = null,
  direction = 'clockwise',
  pixel = false
} = {}) {
  const cx = width / 2;
  const cy = height / 2;
  const half = Math.min(width, height) / 2;
  const radius = Math.max(1, half - stroke / 2);
  const svg = createSvgNode('svg', {
    class: 'sf-loader-svg',
    viewBox: `0 0 ${width} ${height}`,
    width: pixel ? width : null,
    height: pixel ? height : null,
    'aria-hidden': 'true',
    focusable: 'false'
  });
  const ring = {
    cx,
    cy,
    r: round(radius),
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': stroke
  };
  const track = createSvgNode('circle', {
    class: 'sf-loader-ring-filled',
    ...ring,
    opacity: '0.3'
  });
  const accent = createSvgNode('circle', {
    class: 'sf-loader-ring-accent',
    ...ring,
    'stroke-linecap': 'round',
    pathLength: 100,
    'stroke-dasharray': '0 100',
    transform: `rotate(90 ${cx} ${cy})`
  }); // The comet starts at the top and runs clockwise: segment 0 is the end of the
  // tail, the last one the head, drawn last and with a round cap.

  const comet = createSvgNode('g', {
    class: 'sf-loader-comet',
    display: 'none',
    transform: `rotate(-90 ${cx} ${cy})`
  });
  const segment = COMET_LENGTH / COMET_SEGMENTS;

  for (let index = 0; index < COMET_SEGMENTS; index += 1) {
    const head = index === COMET_SEGMENTS - 1;
    comet.append(createSvgNode('circle', {
      class: `sf-loader-comet-segment${head ? ' sf-loader-comet-head' : ''}`,
      ...ring,
      'stroke-linecap': head ? 'round' : 'butt',
      pathLength: 100,
      'stroke-dasharray': `${round(segment)} ${round(100 - segment)}`,
      'stroke-dashoffset': round(-segment * index),
      opacity: round(((index + 1) / COMET_SEGMENTS) ** 1.6)
    }));
  } // The dots sit on the same ring: a dot as wide as the stroke allows without
  // touching its neighbours, so fewer dots are bigger ones.


  const count = Math.max(3, Math.min(32, Math.floor(Number(dots) || SPINNER_DOTS)));
  const active = Math.max(1, Math.min(count, Math.floor(Number(filled) || SPINNER_DOTS_FILLED)));
  const fitted = Math.min(stroke, 0.7 * Math.PI * (half - stroke) / count);
  const dotR = dotRadius === null || dotRadius === undefined || dotRadius === '' ? fitted : Math.max(1, Math.min(Number(dotRadius) || fitted, half / 4));
  const orbit = Math.max(dotR, half - dotR);
  const dotsGroup = createSvgNode('g', {
    class: 'sf-loader-dots',
    display: 'none',
    style: `--sf-loader-dot-count:${count}; --sf-loader-dot-filled:${active};`
  });

  for (let index = 0; index < count; index += 1) {
    const angle = Math.PI * 2 / count * index - Math.PI / 2;
    const step = direction === 'counterclockwise' ? index : (count - index) % count;
    dotsGroup.append(createSvgNode('circle', {
      class: `sf-loader-dot${index < active ? ' sf-loader-dot--active' : ''}`,
      cx: round(cx + orbit * Math.cos(angle)),
      cy: round(cy + orbit * Math.sin(angle)),
      r: round(dotR),
      fill: 'currentColor',
      style: `--sf-loader-dot-index:${index}; --sf-loader-dot-step:${step};`
    }));
  }

  svg.append(track, accent, comet, dotsGroup);
  return svg;
} // The drawing on the icon grid, the one every spinner on the ladder uses.

function createLadderSpinnerSvg(options = {}) {
  return createSpinnerSvg({ ...options,
    width: SPINNER_GRID,
    height: SPINNER_GRID,
    stroke: SPINNER_STROKE,
    dotRadius: null,
    pixel: false
  });
} // A spinner that stands in a control: endless, decorative (the control keeps
// its label and says aria-busy), and marked bound so the spinner component,
// when it is on the page, leaves it as drawn. `className` names the control's
// slot for it; `overlay` lays it over the control's hidden label instead of in
// the place of an icon. Its look is the page's, as every spinner's.

function createInlineSpinner({
  className = '',
  overlay = false
} = {}) {
  const root = document.createElement('span');
  root.className = ['sf-loader-container', 'sf-loader--infinite', className, className && overlay ? `${className}--overlay` : ''].filter(Boolean).join(' ');
  root.dataset.sfSpinnerBound = '1';
  root.dataset.infinite = 'true';
  root.setAttribute('aria-hidden', 'true');
  const indicator = document.createElement('span');
  indicator.className = 'sf-loader--loading-indicator';
  indicator.append(createLadderSpinnerSvg());
  root.append(indicator);
  return root;
}

/***/ },

/***/ "18333410c461"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   normalizeItems: () => (/* binding */ normalizeItems),
/* harmony export */   parseItems: () => (/* binding */ parseItems)
/* harmony export */ });
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("fbe0570fcc69");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("2c8db2795ace");
/* harmony import */ var _core_js_control_spacing__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("2feae72af89f");
/* harmony import */ var _component_form_reset_helper__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("67eed2647f47");
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("0d662e4d7d63");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _js_templates_default__WEBPACK_IMPORTED_MODULE_1__, _core_js_control_spacing__WEBPACK_IMPORTED_MODULE_2__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_4__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _js_templates_default__WEBPACK_IMPORTED_MODULE_1__, _core_js_control_spacing__WEBPACK_IMPORTED_MODULE_2__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_4__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_control_spacing__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_core_js_control_spacing__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_core_js_page_language__WEBPACK_IMPORTED_MODULE_4__);




 // The theme switch's own words: the three Loader preferences, and the group's
// name when the page gives none.

const THEME_SWITCH_TEXT = {
  en: {
    group: 'Theme',
    system: 'System',
    light: 'Light',
    dark: 'Dark'
  },
  ru: {
    group: 'Тема',
    system: 'Как в системе',
    light: 'Светлая',
    dark: 'Тёмная'
  }
};
const THEME_PREFERENCES = ['system', 'light', 'dark'];
const THEME_ICONS = {
  system: 'brightness_auto',
  light: 'light_mode',
  dark: 'dark_mode'
}; // The Loader's theme preference: what the person chose, not the theme drawn,
// so system stays selected while the system is dark.

function themePreference() {
  const preference = globalThis.SF?.Loader?.themePreference;
  return THEME_PREFERENCES.includes(preference) ? preference : 'system';
}

function parseItems(value = []) {
  if (Array.isArray(value)) return value;
  const source = String(value || '').trim();
  if (!source) return [];

  if (source.startsWith('[')) {
    try {
      const parsed = JSON.parse(source);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  return source.split('|').map(entry => {
    const [valuePart, labelPart, flagsPart = ''] = entry.split('::');
    const flags = flagsPart.split(',').map(flag => flag.trim()).filter(Boolean);
    const iconFlag = flags.find(flag => flag.startsWith('icon='));
    return {
      value: valuePart.trim(),
      label: (labelPart || valuePart).trim(),
      disabled: flags.includes('disabled'),
      loading: flags.includes('loading'),
      icon: iconFlag ? iconFlag.slice('icon='.length) : ''
    };
  });
}

function normalizeItems(items = []) {
  const seen = new Set();
  return parseItems(items).map((item, index) => {
    const source = typeof item === 'string' ? {
      value: item,
      label: item
    } : item;
    if (!source || typeof source !== 'object') return null;
    const value = String(source.value ?? source.id ?? index).trim();
    if (!value || seen.has(value)) return null;
    seen.add(value);
    return {
      id: String(source.id || value),
      value,
      label: String(source.label ?? source.text ?? value),
      icon: String(source.icon || ''),
      ariaLabel: String(source.ariaLabel || source['aria-label'] || ''),
      // A number shown after the label in the segmented appearance; 0 is a
      // count, an absent or empty one is not.
      count: source.count === null || typeof source.count === 'undefined' ? '' : String(source.count).trim(),
      // Only an icon can stand alone; the label stays as the accessible name.
      iconOnly: Boolean((source.iconOnly ?? source['icon-only']) && source.icon),
      // A loading item shows the spinner and is disabled while it works, as
      // a loading button is (simai/ui-source#10).
      loading: Boolean(source.loading),
      disabled: Boolean(source.disabled || source.loading)
    };
  }).filter(Boolean);
}

class SfButtonGroup extends (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()) {
  static get props() {
    return {
      templateName: {
        attribute: 'template',
        default: 'default'
      },
      items: {
        type: Array,
        default: [],
        parser: parseItems
      },
      value: {
        default: ''
      },
      // A form field name: the group submits its value with its form.
      name: {
        default: ''
      },
      // The theme switch: the group draws its own three items (system, light,
      // dark), selects the Loader's theme preference and sets it on change.
      themeSwitch: {
        attribute: 'theme-switch',
        type: Boolean,
        default: false
      },
      size: {
        default: '1',
        values: ['1/3', '1/2', '1', '2', '3']
      },
      spacing: {
        type: String,
        default: null
      },
      tightness: {
        default: '',
        values: ['', 'low', 'high', 'highest']
      },
      scheme: {
        default: 'primary',
        values: ['primary', 'secondary', 'on-surface']
      },
      // How the group looks. segmented: a sunken track with borderless segments
      // and a plate under the selected one; the selection model is the same.
      appearance: {
        default: 'default',
        values: ['default', 'segmented']
      },
      // The selected segment's plate in the segmented appearance: the scheme's
      // fill, or a raised neutral surface.
      plate: {
        default: 'scheme',
        values: ['scheme', 'raised']
      },
      fullWidth: {
        attribute: 'full-width',
        type: Boolean,
        default: false
      },
      // The corner radius, as on sf-button: empty is the UI radius.
      radius: {
        default: '',
        values: ['', 'default', 'square', 'rounded']
      },
      orientation: {
        default: 'horizontal',
        values: ['horizontal', 'vertical']
      },
      disabled: {
        type: Boolean,
        default: false
      },
      ariaLabel: {
        attribute: 'aria-label',
        default: ''
      },
      rootClass: {
        attribute: 'root-class',
        default: ''
      }
    };
  }

  constructor() {
    super();
    this.addEventListener('click', this.handleClick);
    this.addEventListener('keydown', this.handleKeyDown);
    this.addEventListener('sf-after-render', event => {
      // A nested Smart button may finish after its parent or render again later.
      if (event.target !== this && event.target.parentElement === this.querySelector('.sf-button-group')) {
        this.syncButtonSemantics();
      }
    });
  }

  get themeSwitch() {
    return this.getBooleanAttr('theme-switch', false);
  }

  get themeItems() {
    return THEME_PREFERENCES.map(value => ({
      value,
      label: (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_4__.pageText)(THEME_SWITCH_TEXT, value, this),
      icon: THEME_ICONS[value],
      iconOnly: true
    }));
  }

  get normalizedItems() {
    const items = normalizeItems(this.themeSwitch ? this.themeItems : this.getProp('items'));
    const firstEnabledIndex = items.findIndex(item => !item.disabled);
    return items.map((item, index) => ({ ...item,
      firstEnabled: index === firstEnabledIndex
    }));
  }

  get value() {
    return this.getAttribute('value') || '';
  }

  set value(nextValue) {
    if (nextValue === null || typeof nextValue === 'undefined' || nextValue === '') {
      this.removeAttribute('value');
      return;
    }

    this.setAttribute('value', String(nextValue));
  }

  get disabled() {
    return this.getBooleanAttr('disabled', false);
  }

  get name() {
    return this.getAttribute('name') || '';
  }

  connectedCallback() {
    // The value a form reset returns to: the one the group was written with.
    if (!Object.prototype.hasOwnProperty.call(this, '_resetValue')) this._resetValue = this.value;
    super.connectedCallback();
  }

  onConnected() {
    window.addEventListener('sf-theme-change', this.handleThemeChange);
    this.syncThemePreference();
  }

  onDisconnected() {
    window.removeEventListener('sf-theme-change', this.handleThemeChange);
    this._releaseReset?.();
    this._releaseReset = null;
    this._resetInput = null;
    super.onDisconnected();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === 'theme-switch' && oldValue !== newValue && this._isMounted) this.syncThemePreference();
  } // A theme switch shows the preference wherever it was set: here, another
  // switch, a Theme component button or SF.Loader.setTheme itself.


  syncThemePreference() {
    if (!this.themeSwitch) return;
    const preference = themePreference();
    if (this.value !== preference) this.value = preference;
  }

  handleThemeChange = () => this.syncThemePreference();

  templateContext() {
    return this.createTemplateContext({ ...this.getPropsContext(),
      ariaLabel: this.getAttribute('aria-label') || (this.themeSwitch ? (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_4__.pageText)(THEME_SWITCH_TEXT, 'group', this) : ''),
      ...(0,_core_js_control_spacing__WEBPACK_IMPORTED_MODULE_2__.resolveControlSpacing)({
        spacing: this.getAttribute('spacing'),
        tightness: this.getAttribute('tightness')
      }),
      component: this,
      items: this.normalizedItems,
      value: this.value,
      disabled: this.disabled
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_1__.renderButtonGroupTemplate)(this.templateContext());
  } // Every form value control reports a committed change as `change` on its host.
  // `sf-button-group-change` is the legacy name, still emitted with the same
  // detail; see contracts/public-api-axes.json.


  emitValueChange(detail) {
    this.emitComponentEvent('button-group-change', detail);
    this.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      composed: true,
      detail: {
        component: this,
        ...detail
      }
    }));
  }

  select(nextValue) {
    const value = String(nextValue ?? '');
    const item = this.normalizedItems.find(candidate => candidate.value === value);

    if (!item || item.disabled || this.disabled || value === this.value) {
      return this;
    }

    const previous = this.value; // A theme switch sets the Loader's preference first, so a listener of
    // change already finds the page in the theme it chose; a Loader that cannot
    // change the theme (absent, or SF_BOOT_CONFIG.theme false) selects nothing.

    if (this.themeSwitch && globalThis.SF?.Loader?.setTheme?.(value) !== true) {
      return this;
    }

    this.value = value;
    this.emitValueChange({
      previous,
      value,
      item
    });
    return this;
  }

  afterRender() {
    this.syncButtonSemantics();
    this.bindReset();
  } // Form participation as every Smart field does it: a hidden input carries
  // the name and value (and is disabled with the group), and a form reset
  // brings back the value the group was written with.


  bindReset() {
    const input = this.querySelector(':scope > .sf-button-group-input');
    if (this._resetInput === input) return;
    this._releaseReset?.();
    this._resetInput = input;
    this._releaseReset = input ? (0,_component_form_reset_helper__WEBPACK_IMPORTED_MODULE_3__.bindFormReset)(input, () => {
      if (this.themeSwitch) return;
      this.value = this._resetValue;
    }) : null;
  }

  syncButtonSemantics() {
    const root = this.querySelector('.sf-button-group');
    if (!root) return;
    const items = this.normalizedItems;
    const available = this.disabled ? [] : items.filter(item => !item.disabled);
    const tabStop = available.find(item => item.value === this.value) || available[0]; // A segmented group draws native buttons; the default one draws Smart buttons.

    root.querySelectorAll(':scope > sf-button, :scope > button').forEach((host, index) => {
      const button = host.matches('button') ? host : host.querySelector('button'),
            item = items[index];
      if (!button || !item) return;
      const selected = item.value === this.value;
      button.setAttribute('role', 'radio');
      button.setAttribute('aria-checked', selected ? 'true' : 'false');
      button.tabIndex = item === tabStop ? 0 : -1;
    });
  }

  clear() {
    // A theme preference is never empty.
    if (!this.value || this.disabled || this.themeSwitch) return this;
    const previous = this.value;
    this.value = '';
    this.emitValueChange({
      previous,
      value: '',
      item: null
    });
    return this;
  }

  focus(options) {
    const button = this.querySelector('button[role="radio"][tabindex="0"]:not(:disabled)');
    button?.focus?.(options);
    return this;
  }

  handleClick = event => {
    const target = event.target?.closest?.('[data-sf-button-group-value]');
    if (!target || !this.contains(target)) return;
    this.select(target.getAttribute('data-sf-button-group-value'));
  };
  handleKeyDown = event => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
    const enabled = this.normalizedItems.filter(item => !item.disabled);
    if (!enabled.length || this.disabled) return;
    const currentIndex = Math.max(0, enabled.findIndex(item => item.value === this.value));
    const nextIndex = event.key === 'Home' ? 0 : event.key === 'End' ? enabled.length - 1 : ['ArrowLeft', 'ArrowUp'].includes(event.key) ? (currentIndex - 1 + enabled.length) % enabled.length : (currentIndex + 1) % enabled.length;
    event.preventDefault();
    const previous = this.value;
    this.select(enabled[nextIndex].value);

    if (this.value !== previous) {
      this.addEventListener('sf-after-render', () => this.focus(), {
        once: true
      });
    }
  };
}

SfButtonGroup.define('sf-button-group');

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "2c8db2795ace"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderButtonGroupTemplate: () => (/* binding */ renderButtonGroupTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ddf1cdb42ecc");
/* harmony import */ var _component_spinner_js_spinner_draw__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("50d2a204ba4c");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);



function segmentFor(index, total) {
  if (total <= 1) return '';
  if (index === 0) return 'start';
  if (index === total - 1) return 'end';
  return 'middle';
}

function renderItem(item, index, context) {
  const selected = item.value === context.value;
  const disabled = context.disabled || item.disabled;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <sf-button
      text=${item.label}
      icon=${item.icon || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      size=${context.size}
      spacing=${context.spacing && context.spacing !== 'normal' ? context.spacing : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      appearance=${selected ? 'default' : 'outline'}
      scheme=${selected ? context.scheme : 'on-surface'}
      segment=${segmentFor(index, context.items.length)}
      data-sf-button-group-value=${item.value}
      aria-label=${item.ariaLabel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      class=${selected ? 'active' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      ?disabled=${disabled}
      ?loading=${item.loading}
    ></sf-button>
  `;
} // The segmented appearance draws each segment as a native button with the
// button's own size, spacing and text classes, so a segment is exactly as tall
// as a button of the same size. All segments carry the same appearance class:
// the plate under the selected one is a fill, never a change of type or weight,
// so selecting a segment never changes its width. The group sheet paints them.


function renderSegment(item, context) {
  const selected = item.value === context.value;
  const disabled = context.disabled || item.disabled;
  const classes = ['sf-button', `sf-button--size-${context.size}`, 'sf-button--link', 'sf-button--on-surface', 'flex', 'items-cross-center', 'sf-button-group-segment', item.iconOnly ? 'sf-button-group-icon-only' : '', context.spacing && context.spacing !== 'normal' ? `spacing-${context.spacing}` : '', selected ? 'active' : '', item.loading ? 'loading sf-button-state-loading' : ''].filter(Boolean).join(' '); // The count stands next to the label with no space between the two nodes, so
  // the name is composed here: the label (or the item's aria-label), then the
  // count, as it is read on screen.

  const ariaLabel = item.count !== '' || item.ariaLabel ? [item.ariaLabel || item.label, item.count].filter(part => part !== '').join(' ') : ''; // A loading segment shows the spinner as a loading button does
  // (simai/ui-source#10): in place of its icon, or over its label, which keeps
  // its place and its name.

  const spinner = item.loading ? (0,_component_spinner_js_spinner_draw__WEBPACK_IMPORTED_MODULE_1__.createInlineSpinner)({
    className: 'sf-button-spinner',
    overlay: !item.icon
  }) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const icon = item.loading && item.icon ? spinner : item.icon ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-icon icon=${item.icon} root-class="pointer-event-none" weight="400" aria-hidden="true"></sf-icon>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const count = item.count !== '' ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-button-group-count">${item.count}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <button
      type="button"
      class=${classes}
      data-sf-button-group-value=${item.value}
      aria-label=${ariaLabel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      aria-busy=${item.loading ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      ?disabled=${disabled}
    >
      ${item.loading && !item.icon ? spinner : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      ${icon}
      ${item.iconOnly ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-button-group-label--hidden">${item.label}</span>${count}` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-button-text-container text-center pointer-event-none">${item.label}${count}</span>`}
    </button>
  `;
}

function renderButtonGroupTemplate(context) {
  const segmented = context.appearance === 'segmented';
  const classes = ['sf-button-group', segmented ? 'sf-button-group--segmented' : '', segmented ? `sf-button-group--size-${context.size}` : '', segmented && context.plate === 'raised' ? 'sf-button-group--plate-raised' : '', segmented ? `sf-button-group--${context.scheme}` : '', segmented && context.fullWidth ? 'sf-button-group--full-width' : '', context.radius ? `sf-button-group--radius-${context.radius}` : '', context.rootClass].filter(Boolean).join(' ');
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div
      class=${classes}
      style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      role="radiogroup"
      aria-label=${context.ariaLabel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      aria-orientation=${context.orientation}
      data-value=${context.value || ''}
    >
      ${context.items.map((item, index) => segmented ? renderSegment(item, context) : renderItem(item, index, context))}
    </div>
    ${context.name ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<input class="sf-button-group-input" type="hidden" name=${context.name} value=${context.value || ''} ?disabled=${context.disabled}>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
  `;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "2feae72af89f"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("control-spacing") : new Promise((resolve) => globalThis.addEventListener("sf-runtime-ready", () => resolve(globalThis.SF.runtimeModule("control-spacing")), { once: true })));

/***/ },

/***/ "ddf1cdb42ecc"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit") : new Promise((resolve) => globalThis.addEventListener("sf-runtime-ready", () => resolve(globalThis.SF.runtimeModule("lit")), { once: true })));

/***/ },

/***/ "0d662e4d7d63"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("page-language") : new Promise((resolve) => globalThis.addEventListener("sf-runtime-ready", () => resolve(globalThis.SF.runtimeModule("page-language")), { once: true })));

/***/ },

/***/ "fbe0570fcc69"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("smart-base") : new Promise((resolve) => globalThis.addEventListener("sf-runtime-ready", () => resolve(globalThis.SF.runtimeModule("smart-base")), { once: true })));

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
/******/ 	let __webpack_exports__ = __webpack_require__("18333410c461");
/******/
/******/ })()
;