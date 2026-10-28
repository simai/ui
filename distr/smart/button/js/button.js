/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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
// rather than a filled black disc; the comet and the dots wait hidden. The arc
// is a fixed 30% of the ring (simai/ui-source#13): the sheet turns the drawing,
// the arc itself never changes length.


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
    'stroke-dasharray': '30 70',
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

/***/ "1fab5b780b3d"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("b5e6381153f8");
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("2a080a730149");
/* harmony import */ var _core_js_control_spacing__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("9abcb852f1cf");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("5bb33fb22db3");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("902a6f38915d");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("d7b6a56d1dd6");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("96bdb2ff5f5d");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_2__, lit__WEBPACK_IMPORTED_MODULE_3__, _core_js_control_spacing__WEBPACK_IMPORTED_MODULE_4__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_2__, lit__WEBPACK_IMPORTED_MODULE_3__, _core_js_control_spacing__WEBPACK_IMPORTED_MODULE_4__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _core_js_control_spacing__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_core_js_control_spacing__WEBPACK_IMPORTED_MODULE_4__);









const COMPONENT_ATTRIBUTES = new Set(["template", "size", "appearance", "type", "scheme", "status", "text", "icon", "icon-start", "icon-end", "icon-left", "icon-right", "icon-position", "text-position", "spacing", "tightness", "radius", "root-class", "loading", "segment", "disabled", "native-type", "expanded", "aria-label", "class", "style", "id", "slot"]);

function applyButtonAttributes(host, button) {
  host?.forwardHostAttributes(button, {
    exclude: COMPONENT_ATTRIBUTES,
    transferDataAttributes: true,
    storageKey: "__sfButtonForwardedDataAttributes",
    targetStorageKey: "__sfButtonAttributeKeys"
  });
} // sf-button from its component.json (standard simai.smart-component 1.3.8 §3,
// §4, §8): the settings are the attributes and properties
// core/js/element-manifest.js makes from the manifest. The legacy names --
// type, icon-left, icon-right, tightness -- and the legacy values -- ghost,
// danger, critical, tightness's words, left and right -- are dated aliases
// (aliases.json, until 2026-12-01): the shim writes the new attribute and
// notes the use, so a value outside a list reads as the default here.


const ButtonElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_5__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_7__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_8__
  },
  source: "ru",
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_6__
});

class SfButton extends ButtonElement {
  constructor() {
    super();
    this._attributeObserver = null;
    this._textFromChildren = "";
  }

  get templateName() {
    return this.getAttribute("template") || "default";
  } // A text attribute, even an empty one, is the label: emptying it empties
  // the button. Before, an empty attribute fell through to the text captured
  // from children, and a toolbar that cleared a label kept the old one
  // (simai.main, Main's isolated toolbar on ui-36116c01a792, 2026-10-28).


  get text() {
    if (this.hasAttribute("text")) return this.getAttribute("text") || "";
    return this._textFromChildren || "";
  }

  set text(value) {
    super.text = value;
  } // The label a button written in JavaScript carries, the way every element
  // carries one: createElement('sf-button') with textContent = 'Добавить', and
  // <sf-button>Добавить</sf-button> in HTML. The text attribute and the text
  // slot still come first. Before, an unslotted text child was left where it
  // was: the button rendered empty and the text stood beside it as a second,
  // unstyled label (consumer case ui-mail.button-text-content, 2026-10-21).


  captureTextChildren() {
    if (this.hasSlotContent?.("text")) return;
    const nodes = Array.from(this.childNodes).filter(node => node.nodeType === 3 && String(node.textContent).trim() !== "");
    if (!nodes.length) return;
    this._textFromChildren = nodes.map(node => String(node.textContent).trim()).join(" ");
    nodes.forEach(node => node.remove());
  } // Null when the attribute is not there, and '' only when it is there and
  // empty. The template tells those apart on purpose: an empty icon-start is a
  // consumer saying «no icon here», and it suppresses the `icon` shortcut,
  // while an absent one lets the shortcut through. Both answered '' before, so
  // «never written» read as «deliberately emptied» and `icon="add"` on a button
  // drew nothing at all (owner, 2026-10-09). The old names icon-left and
  // icon-right write these attributes through the dated aliases.


  get iconStart() {
    return this.getAttribute('icon-start');
  }

  set iconStart(value) {
    super.iconStart = value;
  }

  get iconEnd() {
    return this.getAttribute('icon-end');
  }

  set iconEnd(value) {
    super.iconEnd = value;
  }

  get rootClass() {
    return this.getAttribute("root-class") || "";
  } // expanded is optional (§4.2): absent says nothing, so aria-expanded is
  // written only while the attribute is there.


  get expanded() {
    return this.hasAttribute("expanded") ? super.expanded : undefined;
  }

  set expanded(value) {
    if (value === undefined || value === null) this.removeAttribute("expanded");else this.setAttribute("expanded", value ? "" : "false");
  }

  templateContext() {
    // A child parsed after connectedCallback is still the label.
    this.captureTextChildren?.();
    const props = this.getPropsContext();
    return this.createTemplateContext({ ...props,
      // Through the getter: the props context knows only the text attribute,
      // and a button whose label is a text child has none.
      text: this.text,
      // Resolved names the template reads (contracts/template-context.json).
      iconStart: this.iconStart,
      iconEnd: this.iconEnd,
      appearance: this.appearance,
      type: this.appearance,
      status: this.status,
      scheme: this.scheme,
      size: this.size,
      iconPosition: this.iconPosition,
      nativeType: this.nativeType,
      radius: this.radius,
      ariaLabel: this.getAttribute("aria-label") || "",
      expanded: this.expanded,
      ...(0,_core_js_control_spacing__WEBPACK_IMPORTED_MODULE_4__.resolveControlSpacing)({
        spacing: this.getAttribute('spacing')
      }),
      component: this
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_2__.renderButtonTemplate)(this.templateContext());
  }

  resolveUpdateMode() {
    return "lit";
  }

  onConnected() {
    this.captureTextChildren();

    if (!this._pressListener) {
      this._pressListener = event => this.handlePress(event);

      this.addEventListener("click", this._pressListener);
    }

    super.onConnected?.();
  } // §8: a person's press of the native button, sent once as sf-button-press.
  // A disabled or loading button never gets the click, and a click on the host
  // outside the native button (there is no such box: the host is
  // display:contents) is not a press.


  handlePress(event) {
    const button = this.querySelector(".sf-button");
    if (!button || !(event.target instanceof Node) || !button.contains(event.target)) return;
    if (button.disabled) return;
    this.sfEmit("press", {});
  }

  afterRender() {
    const button = this.querySelector(".sf-button");
    applyButtonAttributes(this, button);

    if (!this._attributeObserver) {
      this._attributeObserver = this.observeForwardedHostAttributes(() => this.querySelector(".sf-button"), {
        exclude: COMPONENT_ATTRIBUTES,
        transferDataAttributes: true,
        storageKey: "__sfButtonForwardedDataAttributes",
        targetStorageKey: "__sfButtonAttributeKeys"
      })._forwardHostAttributeObserver;
    }
  } // The native button is what takes focus: the host lays out as
  // display:contents and takes none, so focus() on the host did nothing and
  // left document.activeElement where it was. A product that holds the host --
  // from querySelector('sf-button'), or from closest('sf-button') on a data-* match --
  // focuses it and reaches the control through this.


  focusDelegate() {
    return this.querySelector(".sf-button");
  }

  get value() {
    return {
      template: this.templateName,
      size: this.size,
      appearance: this.appearance,
      type: this.appearance,
      scheme: this.scheme,
      status: this.status,
      text: this.text,
      icon: this.icon,
      iconLeft: this.iconStart,
      iconRight: this.iconEnd,
      iconStart: this.iconStart,
      iconEnd: this.iconEnd,
      iconPosition: this.iconPosition,
      tightness: (0,_core_js_control_spacing__WEBPACK_IMPORTED_MODULE_4__.resolveControlSpacing)({
        spacing: this.getAttribute('spacing')
      }).tightness,
      spacing: this.spacing,
      radius: this.radius,
      rootClass: this.rootClass,
      loading: this.loading,
      disabled: this.disabled,
      nativeType: this.nativeType,
      ariaLabel: this.getAttribute("aria-label") || ""
    };
  }

  onClick(handler, options) {
    if (typeof handler === "function") {
      this.addEventListener("click", handler, options);
    }

    return this;
  }

  onFocus(handler, options) {
    if (typeof handler === "function") {
      this.addEventListener("focusin", handler, options);
    }

    return this;
  }

  onBlur(handler, options) {
    if (typeof handler === "function") {
      this.addEventListener("focusout", handler, options);
    }

    return this;
  }

  onMouseEnter(handler, options) {
    if (typeof handler === "function") {
      this.addEventListener("mouseenter", handler, options);
    }

    return this;
  }

  onMouseLeave(handler, options) {
    if (typeof handler === "function") {
      this.addEventListener("mouseleave", handler, options);
    }

    return this;
  }

  setDisabled(nextValue = true) {
    if (nextValue) {
      this.setAttribute("disabled", "");
    } else {
      this.removeAttribute("disabled");
    }

    return this;
  }

  createIcon(name) {
    if (!name) return "";
    return (0,lit__WEBPACK_IMPORTED_MODULE_3__.html)`<sf-icon icon="${name}" root-class="pointer-event-none" weight="400" aria-hidden="true"></sf-icon>`;
  }

  set value(nextValue) {
    this.setValueAttributes(nextValue);
  }

  onDisconnected() {
    if (this._pressListener) {
      this.removeEventListener("click", this._pressListener);
      this._pressListener = null;
    }

    this.disconnectForwardedHostAttributes();
    this._attributeObserver = null;
    super.onDisconnected?.();
  }

}

SfButton.define("sf-button");
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "b5e6381153f8"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderButtonTemplate: () => (/* binding */ renderButtonTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var _component_spinner_js_spinner_draw__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("50d2a204ba4c");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);


function renderButtonTemplate(context) {
  const {
    size,
    appearance,
    type,
    scheme,
    status,
    text,
    icon,
    iconLeft,
    iconRight,
    iconPosition,
    spacing,
    radius,
    rootClass,
    textPosition,
    loading,
    disabled,
    nativeType,
    ariaLabel,
    segment
  } = context;
  const normalizedIconPosition = String(iconPosition || 'start').toLowerCase();
  const isIconEnd = ['right', 'end'].includes(normalizedIconPosition);
  const leftIconName = context.iconStart ?? (iconLeft || (icon && !isIconEnd ? icon : ''));
  const rightIconName = context.iconEnd ?? (iconRight || (icon && isIconEnd ? icon : ''));
  const component = context.component;
  const leftIconContent = component?.hasSlotContent?.('icon-start') ? component.getSlotContent('icon-start') : component?.hasSlotContent?.('icon-left') ? component.getSlotContent('icon-left') : component.createIcon(leftIconName);
  const rightIconContent = component?.hasSlotContent?.('icon-end') ? component.getSlotContent('icon-end') : component?.hasSlotContent?.('icon-right') ? component.getSlotContent('icon-right') : component.createIcon(rightIconName);
  const textContent = component?.hasSlotContent?.('text') ? component.getSlotContent('text') : text;
  const fullText = !leftIconContent && !rightIconContent; // Loading shows the spinner at the icon's size (simai/ui-source#10): in
  // place of the start icon, else of the end icon; a button without an icon
  // lays it over its label, which keeps its place (and the button its width)
  // and stays the accessible name. Icon-only is the first case.

  let startContent = leftIconContent;
  let endContent = rightIconContent;
  let overlayContent = '';

  if (loading) {
    const spinner = overlay => (0,_component_spinner_js_spinner_draw__WEBPACK_IMPORTED_MODULE_1__.createInlineSpinner)({
      className: 'sf-button-spinner',
      overlay
    });

    if (leftIconContent) startContent = spinner(false);else if (rightIconContent) endContent = spinner(false);else overlayContent = spinner(true);
  }

  const rootClasses = ['sf-button', `sf-button--size-${size}`, `sf-button--${appearance || type}`, // One colour name, as the styles expect: the status when one is set, the
  // scheme otherwise. A status says what the control is about -- an error
  // for something destructive -- and a scheme says which colour family it
  // takes; they cannot both paint it.
  `sf-button--${status || scheme}`, 'flex', 'items-cross-center', segment ? `segment-${segment}` : '', // The spacing class, not its retired tightness name (journal
  // class-tightness-to-spacing; docs trial 4).
  spacing && spacing !== 'normal' ? `spacing-${spacing}` : '', radius ? `radius-${radius}` : '', rootClass, loading ? 'loading sf-button-state-loading' : ''].filter(Boolean);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <button
                type=${nativeType}
                class=${rootClasses.join(' ')}
                style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ?disabled=${disabled || loading}
                aria-label=${ariaLabel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                aria-busy=${loading ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                aria-expanded=${context.expanded === undefined ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : String(Boolean(context.expanded))}
        >
            ${overlayContent}
            ${startContent}
            ${textContent ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span
                    class="sf-button-text-container text-${textPosition} pointer-event-none${fullText ? ' flex-1' : ''}">
        ${textContent}
      </span>` : ''}
            ${endContent}
        </button>
    `;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "9abcb852f1cf"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("control-spacing", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("control-spacing", 1).then(resolve, reject), { once: true })));

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

/***/ "902a6f38915d"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-button for the shim (stands/18-aliases-ci/alias.mjs, standard §16 item 20). mode: same-detail (the shim sends the new and the old name), split / detail-adds (a detail adapter, refused by the shim), attribute-and-property, method, property, manifest-only (the DOM name does not change), host-attribute (no shim), retired.","component":"sf-button","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"aria-label","to":null,"kind":"attribute","component":"sf-button","since":"2026-10-27","remove_after":"2026-12-01","mode":"host-attribute","section":"§3.1","note":"stays a host attribute, read by the base (§3.1, §4.8); no shim"},{"from":"type","to":"appearance","kind":"setting","section":"§16 item 20, contracts/public-api-axes.json","note":"the legacy axis name; the shim maps the attribute and the property","component":"sf-button","since":"2026-10-27","remove_after":"2026-12-01"},{"from":"icon-left","to":"icon-start","kind":"setting","section":"§16 item 20","note":"journal attribute-icon-left-right-to-start-end; icon-start wins when both are given","component":"sf-button","since":"2026-10-27","remove_after":"2026-12-01"},{"from":"icon-right","to":"icon-end","kind":"setting","section":"§16 item 20","note":"journal attribute-icon-left-right-to-start-end; icon-end wins when both are given","component":"sf-button","since":"2026-10-27","remove_after":"2026-12-01"},{"from":"tightness","to":"spacing","kind":"setting","section":"§16 item 20","note":"journal attribute-tightness-to-spacing; its words are spacing\'s value aliases below, spacing wins when both are given","component":"sf-button","since":"2026-10-27","remove_after":"2026-12-01"},{"from":"ghost","to":"link","kind":"value","setting":"appearance","section":"§16 item 20","note":"journal value-button-ghost-to-link","component":"sf-button","since":"2026-10-27","remove_after":"2026-12-01"},{"from":"danger","to":"error","kind":"value","setting":"status","section":"§16 item 20","note":"journal value-status-danger-critical-to-error","component":"sf-button","since":"2026-10-27","remove_after":"2026-12-01"},{"from":"critical","to":"error","kind":"value","setting":"status","section":"§16 item 20","note":"journal value-status-danger-critical-to-error","component":"sf-button","since":"2026-10-27","remove_after":"2026-12-01"},{"from":"low","to":"compact","kind":"value","setting":"spacing","section":"§16 item 20","note":"tightness\'s word, journal attribute-tightness-to-spacing","component":"sf-button","since":"2026-10-27","remove_after":"2026-12-01"},{"from":"high","to":"comfortable","kind":"value","setting":"spacing","section":"§16 item 20","note":"tightness\'s word, journal attribute-tightness-to-spacing","component":"sf-button","since":"2026-10-27","remove_after":"2026-12-01"},{"from":"highest","to":"spacious","kind":"value","setting":"spacing","section":"§16 item 20","note":"tightness\'s word, journal attribute-tightness-to-spacing","component":"sf-button","since":"2026-10-27","remove_after":"2026-12-01"},{"from":"left","to":"start","kind":"value","setting":"icon-position","section":"§16 item 20","note":"the physical name the template read as start","component":"sf-button","since":"2026-10-27","remove_after":"2026-12-01"},{"from":"right","to":"end","kind":"value","setting":"icon-position","section":"§16 item 20","note":"the physical name the template read as end","component":"sf-button","since":"2026-10-27","remove_after":"2026-12-01"}]}');

/***/ },

/***/ "5bb33fb22db3"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.button","tag":"sf-button","version":"1.1.4","kind":"leaf","settings":{"size":{"type":"enum","values":["1/3","1/2","1","2","3"],"default":"1"},"appearance":{"type":"enum","values":["default","tonal","outline","link","surface"],"default":"default"},"scheme":{"type":"enum","values":["primary","secondary","on-surface"],"default":"primary"},"status":{"type":"enum","values":["","error"],"default":""},"text-position":{"type":"string","default":"center"},"text":{"type":"string","default":""},"segment":{"type":"string","default":""},"icon":{"type":"icon","default":""},"icon-start":{"type":"icon","default":""},"icon-end":{"type":"icon","default":""},"icon-position":{"type":"enum","values":["start","end"],"default":"start"},"spacing":{"type":"enum","values":["compact","normal","comfortable","spacious"],"default":"normal"},"radius":{"type":"enum","values":["","default","square","rounded"],"default":""},"loading":{"type":"boolean","default":false},"disabled":{"type":"boolean","default":false},"native-type":{"type":"enum","values":["button","submit","reset"],"default":"button"},"expanded":{"type":"boolean","optional":true,"summary":"Whether the panel this button opens is open: aria-expanded on the native button; absent says nothing"}},"values":{},"events":{"press":{"carries":{}}},"actions":{},"css-variables":{"--sf-button-background-color":{"type":"color","state":"default"},"--sf-button-color":{"type":"color","state":"default"},"--sf-button-border-color":{"type":"color","state":"default"},"--sf-button-border-width":{"type":"length","state":"default"},"--sf-button-radius":{"type":"length","state":"default"},"--sf-button-padding-inline":{"type":"length","state":"default"},"--sf-button-padding-block":{"type":"length","state":"default"}}}');

/***/ },

/***/ "d7b6a56d1dd6"
(module) {

module.exports = {"title":"Buttons"};

/***/ },

/***/ "96bdb2ff5f5d"
(module) {

module.exports = {"title":"Кнопки"};

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
/******/ 	let __webpack_exports__ = __webpack_require__("1fab5b780b3d");
/******/
/******/ })()
;