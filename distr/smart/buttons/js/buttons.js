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

/***/ "c76f8895b630"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("fbe0570fcc69");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5168bdf4a1f9");
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("ddf1cdb42ecc");
/* harmony import */ var _core_js_control_spacing__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("2feae72af89f");
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("06e8cd089f28");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _js_templates_default__WEBPACK_IMPORTED_MODULE_1__, lit__WEBPACK_IMPORTED_MODULE_2__, _core_js_control_spacing__WEBPACK_IMPORTED_MODULE_3__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _js_templates_default__WEBPACK_IMPORTED_MODULE_1__, lit__WEBPACK_IMPORTED_MODULE_2__, _core_js_control_spacing__WEBPACK_IMPORTED_MODULE_3__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _core_js_control_spacing__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_core_js_control_spacing__WEBPACK_IMPORTED_MODULE_3__);





const COMPONENT_ATTRIBUTES = new Set(["template", "size", "appearance", "type", "scheme", "status", "text", "icon", "icon-start", "icon-end", "icon-left", "icon-right", "icon-position", "text-position", "spacing", "tightness", "radius", "root-class", "loading", "segment", "disabled", "native-type", "aria-label", "class", "style", "id", "slot"]);

function applyButtonAttributes(host, button) {
  host?.forwardHostAttributes(button, {
    exclude: COMPONENT_ATTRIBUTES,
    transferDataAttributes: true,
    storageKey: "__sfButtonForwardedDataAttributes",
    targetStorageKey: "__sfButtonAttributeKeys"
  });
} // Ghost is the link appearance under its old name: the class sf-button--ghost
// already reads as sf-button--link (journal class-button-ghost-to-link), and
// the Smart value now says the same instead of drawing the retired class
// (docs trial 4, 2026-10-15; journal value-button-ghost-to-link).


const BUTTON_APPEARANCES = ["default", "tonal", "outline", "link", "surface"];
const APPEARANCE_ALIASES = {
  ghost: "link"
};
const STATUS_ALIASES = {
  danger: "error",
  critical: "error"
};

class SfButton extends (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()) {
  constructor() {
    super();
    this._attributeObserver = null;
    this._textFromChildren = "";
  }

  static get props() {
    return {
      templateName: {
        attribute: "template",
        default: "default"
      },
      size: {
        default: "1"
      },
      // The axis is called appearance, because that is the question it answers.
      // `type` keeps working: see contracts/public-api-axes.json.
      appearance: {
        default: "default",
        aliases: ["type"]
      },
      scheme: {
        default: "primary"
      },
      // What the control is about, in the shared status vocabulary. A scheme says
      // which colour family a control takes; a status says what it does, and the
      // only one a control paints today is the destructive error. The two cannot
      // both colour it, so a status wins where it is set.
      status: {
        default: "",
        values: ["", "error"]
      },
      textPosition: {
        type: String,
        default: 'center'
      },
      text: {
        default: ""
      },
      segment: {
        default: ""
      },
      icon: {
        default: ""
      },
      iconStart: {
        type: String,
        default: null
      },
      iconEnd: {
        type: String,
        default: null
      },
      iconLeft: {
        default: ""
      },
      iconRight: {
        default: ""
      },
      iconPosition: {
        default: "start"
      },
      spacing: {
        type: String,
        default: null
      },
      tightness: {
        default: "",
        values: ["", "low", "high", "highest"]
      },
      radius: {
        default: "",
        values: ["", "default", "square", "rounded"]
      },
      rootClass: {
        default: ""
      },
      loading: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      nativeType: {
        default: "button"
      },
      ariaLabel: {
        default: ""
      }
    };
  }

  get templateName() {
    return this.getAttribute("template") || "default";
  }

  get size() {
    return this.getAttribute("size") || "1";
  } // A value outside the list draws the default button. It drew none: an unknown
  // appearance (type="primary", a scheme written where the appearance goes) gave
  // the class sf-button--primary twice and no fill, no border, no padding.


  get appearance() {
    const value = this.getAttribute("appearance") || this.getAttribute("type") || "default";

    if (Object.hasOwn(APPEARANCE_ALIASES, value)) {
      (0,_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_4__.noteDeprecated)({
        component: this.localName,
        kind: 'value',
        attribute: 'appearance',
        from: value,
        to: APPEARANCE_ALIASES[value]
      });
      return APPEARANCE_ALIASES[value];
    }

    return BUTTON_APPEARANCES.includes(value) ? value : "default";
  } // The legacy name, kept so a consumer reading el.type still gets an answer.


  get type() {
    return this.appearance;
  }

  get scheme() {
    return this.getAttribute("scheme") || "primary";
  } // danger and critical are the shared vocabulary's old names for error
  // (journal value-status-danger-critical-to-error). The button dropped them and
  // drew a primary button, so a destructive control written that way looked
  // like a safe one (documentation trial 6, 2026-10-18).


  get status() {
    const value = this.getAttribute("status") || "";

    if (STATUS_ALIASES[value]) {
      (0,_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_4__.noteDeprecated)({
        component: this.localName,
        kind: 'value',
        attribute: 'status',
        from: value,
        to: STATUS_ALIASES[value]
      });
      return STATUS_ALIASES[value];
    }

    return value;
  }

  get text() {
    return this.getAttribute("text") || this._textFromChildren || "";
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
  }

  onConnected() {
    this.captureTextChildren();
    super.onConnected?.();
  }

  get icon() {
    return this.getAttribute("icon") || "";
  } // Null when neither attribute is there, and '' only when one of them is there
  // and empty. The template tells those apart on purpose: an empty icon-start is
  // a consumer saying «no icon here», and it suppresses the `icon` shortcut,
  // while an absent one lets the shortcut through. Both answered '' before, so
  // «never written» read as «deliberately emptied» and `icon="add"` on a button
  // drew nothing at all -- the shortcut the manifest has always described has
  // never once worked (owner, 2026-10-09).


  get iconLeft() {
    if (this.hasAttribute('icon-left')) (0,_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_4__.noteDeprecated)({
      component: this.localName,
      kind: 'attribute',
      from: 'icon-left',
      to: 'icon-start'
    });
    return this.getAttribute('icon-start') ?? this.getAttribute('icon-left');
  }

  get iconRight() {
    if (this.hasAttribute('icon-right')) (0,_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_4__.noteDeprecated)({
      component: this.localName,
      kind: 'attribute',
      from: 'icon-right',
      to: 'icon-end'
    });
    return this.getAttribute('icon-end') ?? this.getAttribute('icon-right');
  }

  get iconStart() {
    return this.iconLeft;
  }

  get iconEnd() {
    return this.iconRight;
  }

  get iconPosition() {
    return this.getAttribute("icon-position") || "start";
  } // Notes the legacy attribute names the template reads without a getter.


  noteLegacyNames() {
    if (this.hasAttribute('tightness')) (0,_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_4__.noteDeprecated)({
      component: this.localName,
      kind: 'attribute',
      from: 'tightness',
      to: 'spacing'
    });
    return {};
  }

  get tightness() {
    return (0,_core_js_control_spacing__WEBPACK_IMPORTED_MODULE_3__.resolveControlSpacing)({
      spacing: this.getAttribute('spacing'),
      tightness: this.getAttribute('tightness')
    }).tightness;
  }

  get spacing() {
    return (0,_core_js_control_spacing__WEBPACK_IMPORTED_MODULE_3__.resolveControlSpacing)({
      spacing: this.getAttribute('spacing'),
      tightness: this.getAttribute('tightness')
    }).spacing;
  }

  get radius() {
    return this.getEnumAttr("radius", ["default", "square", "rounded"], "");
  }

  get rootClass() {
    return this.getAttribute("root-class") || "";
  }

  get loading() {
    return this.getBooleanAttr("loading", false);
  }

  get disabled() {
    return this.getBooleanAttr("disabled", false);
  }

  get nativeType() {
    return this.getAttribute("native-type") || "button";
  }

  get ariaLabel() {
    return this.getAttribute("aria-label") || "";
  }

  templateContext() {
    // A child parsed after connectedCallback is still the label.
    this.captureTextChildren?.();
    const props = this.getPropsContext();
    return this.createTemplateContext({ ...props,
      // Through the getter: the props context knows only the text attribute,
      // and a button whose label is a text child has none.
      text: this.text,
      iconLeft: props.iconStart ?? props.iconLeft,
      iconRight: props.iconEnd ?? props.iconRight,
      // Resolved names the template reads (contracts/template-context.json).
      iconStart: this.iconStart,
      iconEnd: this.iconEnd,
      type: this.type,
      // A legacy appearance reaches the template under its current name, as the
      // getter reports it (journal value-button-ghost-to-link).
      appearance: props.appearance === 'ghost' ? 'link' : props.appearance,
      // Through the getter, which reads the legacy names and notes them: the
      // props context knows only the current values (danger and critical
      // fell to no status there).
      status: this.status,
      ...(0,_core_js_control_spacing__WEBPACK_IMPORTED_MODULE_3__.resolveControlSpacing)({
        spacing: this.getAttribute('spacing'),
        tightness: this.getAttribute('tightness')
      }),
      ...this.noteLegacyNames?.(),
      component: this
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_1__.renderButtonTemplate)(this.templateContext());
  }

  resolveUpdateMode() {
    return "lit";
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
      type: this.type,
      scheme: this.scheme,
      status: this.status,
      text: this.text,
      icon: this.icon,
      iconLeft: this.iconLeft,
      iconRight: this.iconRight,
      iconStart: this.iconStart,
      iconEnd: this.iconEnd,
      iconPosition: this.iconPosition,
      tightness: this.tightness,
      spacing: this.spacing,
      radius: this.radius,
      rootClass: this.rootClass,
      loading: this.loading,
      disabled: this.disabled,
      nativeType: this.nativeType,
      ariaLabel: this.ariaLabel
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
    return (0,lit__WEBPACK_IMPORTED_MODULE_2__.html)`<sf-icon icon="${name}" root-class="pointer-event-none" weight="400" aria-hidden="true"></sf-icon>`;
  }

  set value(nextValue) {
    this.setValueAttributes(nextValue);
  }

  onDisconnected() {
    this.disconnectForwardedHostAttributes();
    this._attributeObserver = null;
    super.onDisconnected?.();
  }

}

SfButton.define("sf-button");
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "5168bdf4a1f9"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderButtonTemplate: () => (/* binding */ renderButtonTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ddf1cdb42ecc");
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

/***/ "2feae72af89f"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("control-spacing") : new Promise((resolve) => globalThis.addEventListener("sf-runtime-ready", () => resolve(globalThis.SF.runtimeModule("control-spacing")), { once: true })));

/***/ },

/***/ "ddf1cdb42ecc"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit") : new Promise((resolve) => globalThis.addEventListener("sf-runtime-ready", () => resolve(globalThis.SF.runtimeModule("lit")), { once: true })));

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
/******/ 	let __webpack_exports__ = __webpack_require__("c76f8895b630");
/******/
/******/ })()
;