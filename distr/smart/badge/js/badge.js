/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "a2a9d3c2841e"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BADGE_SCHEMES: () => (/* binding */ BADGE_SCHEMES),
/* harmony export */   BADGE_SCHEME_ALIASES: () => (/* binding */ BADGE_SCHEME_ALIASES),
/* harmony export */   BADGE_SIZES: () => (/* binding */ BADGE_SIZES),
/* harmony export */   BADGE_TYPES: () => (/* binding */ BADGE_TYPES),
/* harmony export */   BADGE_VARIANTS: () => (/* binding */ BADGE_VARIANTS),
/* harmony export */   canonicalBadgeScheme: () => (/* binding */ canonicalBadgeScheme),
/* harmony export */   normalizeBadgeContract: () => (/* binding */ normalizeBadgeContract)
/* harmony export */ });
const BADGE_TYPES = Object.freeze(['main', 'tonal', 'outline']);
const BADGE_SCHEMES = Object.freeze(['neutral', 'primary', 'secondary', 'tertiary', 'info', 'success', 'warning', 'error', 'on-surface']); // Former scheme names that still draw: `danger` was this component's word for
// the error status before the shared vocabulary (contracts/public-api-axes.json,
// journal class-status-aliases, until 2026-12-01). It is read as `error`, so the
// Native constructor emits the canonical class, as sf-badge does; the
// stylesheet matches `.sf-badge--danger` beside it for markup written by hand.

const BADGE_SCHEME_ALIASES = Object.freeze({
  danger: 'error'
});
const BADGE_SIZES = Object.freeze(['1/3', '1/2', '1']);
const DEFAULT_BADGE_TYPE = 'main';
const DEFAULT_BADGE_SCHEME = 'neutral';
const DEFAULT_BADGE_SIZE = '1/3';

const normalizeEnum = (value, allowed, fallback) => {
  const normalized = String(value ?? fallback).trim().toLowerCase();
  return allowed.includes(normalized) ? normalized : fallback;
}; // The canonical scheme for a name, a former one included; '' when the name is
// not a badge scheme.


function canonicalBadgeScheme(value) {
  const name = String(value ?? '').trim().toLowerCase();
  const canonical = BADGE_SCHEME_ALIASES[name] ?? name;
  return BADGE_SCHEMES.includes(canonical) ? canonical : '';
}
const BADGE_VARIANTS = Object.freeze(BADGE_SCHEMES.flatMap(scheme => BADGE_TYPES.filter(type => !(scheme === 'on-surface' && type === 'tonal')).flatMap(type => BADGE_SIZES.map(size => Object.freeze({
  type,
  scheme,
  size
})))));
function normalizeBadgeContract({
  type,
  scheme,
  size
} = {}) {
  let normalizedType = normalizeEnum(type, BADGE_TYPES, DEFAULT_BADGE_TYPE);
  const normalizedScheme = canonicalBadgeScheme(scheme ?? DEFAULT_BADGE_SCHEME) || DEFAULT_BADGE_SCHEME;
  const normalizedSize = normalizeEnum(size, BADGE_SIZES, DEFAULT_BADGE_SIZE);

  if (normalizedType === 'tonal' && normalizedScheme === 'on-surface') {
    normalizedType = 'main';
  }

  return {
    type: normalizedType,
    scheme: normalizedScheme,
    size: normalizedSize
  };
}

/***/ },

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

/***/ "d39108e5ef4f"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _component_field_size__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("e6d86f2cd058");
/* harmony import */ var _component_badges_js_contract__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("a2a9d3c2841e");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("ead34405591f");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("55155acfa4cc");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("2643258a0104");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("f6a7c3a64b57");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("94f01354b3f6");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _component_field_size__WEBPACK_IMPORTED_MODULE_2__, _js_templates_default__WEBPACK_IMPORTED_MODULE_4__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _component_field_size__WEBPACK_IMPORTED_MODULE_2__, _js_templates_default__WEBPACK_IMPORTED_MODULE_4__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);









const BADGE_COLOUR_ROLES = ['neutral', 'primary', 'secondary', 'tertiary', 'on-surface'];
const BADGE_STATUSES = ['', 'info', 'success', 'warning', 'error'];
const BADGE_STATUS_LEGACY = {
  error: 'danger'
};

const normalizeName = value => String(value ?? '').trim().toLowerCase();

function resolveBadgeScheme(element, raw, fallback) {
  const requested = normalizeName(raw) || normalizeName(element?.getAttribute?.('scheme'));
  return BADGE_COLOUR_ROLES.includes(requested) ? requested : fallback;
} // A status may arrive as `status`, or as the legacy `scheme` that carried both
// colour roles and status words in one list. `danger` remains accepted.


function resolveBadgeStatus(element, raw, fallback) {
  const canonical = value => {
    const name = normalizeName(value);

    for (const [status, legacy] of Object.entries(BADGE_STATUS_LEGACY)) {
      if (name === legacy) {
        return status;
      }
    }

    return BADGE_STATUSES.includes(name) && name !== '' ? name : '';
  };

  return canonical(raw) || canonical(element?.getAttribute?.('scheme')) || fallback;
} // sf-badge from its component.json (standard simai.smart-component 1.3.8 §3,
// §4): the settings are the attributes and properties
// core/js/element-manifest.js makes from the manifest; type, icon-left and
// icon-right, and the values danger, left and right, are dated aliases
// (aliases.json, until 2026-12-01). scheme and status keep their parsers: a
// status word written as a scheme still reaches the status axis
// (journal attribute-badge-scheme-to-status), and scheme stays the colour role.


const BadgeElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_5__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_7__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_8__
  },
  source: 'ru',
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_6__
});

class SfBadge extends BadgeElement {
  static get props() {
    return { ...super.props,
      templateName: {
        attribute: 'template',
        default: 'default'
      },
      scheme: {
        default: 'neutral',
        values: BADGE_COLOUR_ROLES,
        parser: (raw, fallback, element) => resolveBadgeScheme(element, raw, fallback)
      },
      status: {
        default: '',
        values: BADGE_STATUSES,
        parser: (raw, fallback, element) => resolveBadgeStatus(element, raw, fallback)
      }
    };
  }

  get templateName() {
    return this.getAttribute('template') || 'default';
  } // In a row or a table cell the element takes the text line of a form size,
  // so the row keeps its control height.


  get line() {
    const line = this.getAttribute('line') || '';
    return line ? (0,_component_field_size__WEBPACK_IMPORTED_MODULE_2__.fieldSize)(line, 'sf-badge line') : '';
  }

  get appearance() {
    return (0,_component_badges_js_contract__WEBPACK_IMPORTED_MODULE_3__.normalizeBadgeContract)({
      type: this.getProp('appearance'),
      scheme: this.paintedScheme,
      size: this.getEnumAttr('size', _component_badges_js_contract__WEBPACK_IMPORTED_MODULE_3__.BADGE_SIZES, '1/3')
    }).type;
  }

  get scheme() {
    return this.getProp('scheme');
  }

  get status() {
    return this.getProp('status');
  } // One colour name reaches the class list, because the styles are written that
  // way: the status when one is set, the colour role otherwise.


  get paintedScheme() {
    return this.status || this.scheme;
  } // Null when the attribute is not there, '' when it is there and empty: an
  // empty icon-start suppresses the icon shortcut, an absent one lets it
  // through. icon-left and icon-right write these through the dated aliases.


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

  templateContext() {
    const props = this.getPropsContext();
    const variant = (0,_component_badges_js_contract__WEBPACK_IMPORTED_MODULE_3__.normalizeBadgeContract)(props);
    return this.createTemplateContext({ ...props,
      // Resolved names the template reads (contracts/template-context.json).
      iconStart: this.iconStart,
      iconEnd: this.iconEnd,
      ...variant,
      appearance: this.appearance,
      ariaLabel: this.getAttribute('aria-label') || '',
      component: this
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_4__.renderBadgeTemplate)(this.templateContext());
  }

  get value() {
    return {
      template: this.templateName,
      size: this.size,
      line: this.line,
      appearance: this.appearance,
      type: this.appearance,
      scheme: this.scheme,
      status: this.status,
      text: this.text,
      icon: this.icon,
      iconLeft: this.iconStart ?? '',
      iconRight: this.iconEnd ?? '',
      iconStart: this.iconStart,
      iconEnd: this.iconEnd,
      iconPosition: this.iconPosition,
      ariaLabel: this.getAttribute('aria-label') || ''
    };
  }

  set value(nextValue) {
    this.setValueAttributes(nextValue);
  }

}

SfBadge.define('sf-badge');
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "ead34405591f"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderBadgeTemplate: () => (/* binding */ renderBadgeTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);


function createIcon(name) {
  if (!name) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <span class="sf-badge-icon-container flex justify-center items-center">
      <i class="sf-icon flex justify-center items-center" aria-hidden="true">${name}</i>
    </span>
  `;
}

function renderBadgeTemplate(context) {
  const normalizedIconPosition = String(context.iconPosition || 'start').toLowerCase();
  const isIconEnd = ['right', 'end'].includes(normalizedIconPosition);
  const leftIconName = context.iconStart ?? (context.iconLeft || (context.icon && !isIconEnd ? context.icon : ''));
  const rightIconName = context.iconEnd ?? (context.iconRight || (context.icon && isIconEnd ? context.icon : ''));
  const leftIconContent = context.component?.hasSlotContent?.('icon-start') ? context.component.getSlotContent('icon-start') : context.component?.hasSlotContent?.('icon-left') ? context.component.getSlotContent('icon-left') : createIcon(leftIconName);
  const rightIconContent = context.component?.hasSlotContent?.('icon-end') ? context.component.getSlotContent('icon-end') : context.component?.hasSlotContent?.('icon-right') ? context.component.getSlotContent('icon-right') : createIcon(rightIconName);
  const hasTextSlot = context.component?.hasSlotContent?.('text');
  const hasTextContent = hasTextSlot || String(context.text ?? '').length > 0;
  const hasAccessibleLabel = String(context.ariaLabel || '').length > 0;
  const textContent = hasTextSlot ? context.component.getSlotContent('text') : context.text;
  const classes = ['sf-badge', `sf-badge--${context.appearance ?? context.type}`, // One colour name, as the styles expect: the status when one is set, the
  // colour role otherwise.
  `sf-badge--${context.status || context.scheme}`, `sf-badge--size-${context.size}`, context.line ? `sf-badge--line-${context.line}` : '', // Inline: a badge is as wide as its text. As a block-level flex box it
  // filled whatever held it -- every status in a table cell was a bar the
  // width of the column.
  'inline-flex', 'flex-row', 'flex-nowrap', 'justify-center', 'items-center', context.rootClass].filter(Boolean);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <span
      class=${classes.join(' ')}
      style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      aria-hidden=${!hasTextContent && !hasAccessibleLabel ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    >
      ${hasAccessibleLabel ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sr-only">${context.ariaLabel}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      ${leftIconContent}
      ${hasTextContent ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
            <span
              class="sf-badge-text-container flex items-center"
              aria-hidden=${hasAccessibleLabel ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            >
              <span class="sf-badge-text">${textContent}</span>
            </span>
          ` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
      ${rightIconContent}
    </span>
  `;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "d3818183b14c"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("deprecations", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("deprecations", 1).then(resolve, reject), { once: true })));

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

/***/ "2643258a0104"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-badge for the shim (stands/18-aliases-ci/alias.mjs, standard §16 item 20). mode: same-detail (the shim sends the new and the old name), split / detail-adds (a detail adapter, refused by the shim), attribute-and-property, method, property, manifest-only (the DOM name does not change), host-attribute (no shim), retired.","component":"sf-badge","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"aria-label","to":null,"kind":"attribute","component":"sf-badge","since":"2026-10-27","remove_after":"2026-12-01","mode":"host-attribute","section":"§3.1","note":"stays a host attribute, read by the base (§3.1, §4.8); no shim"},{"from":"type","to":"appearance","kind":"setting","section":"§16 item 20, contracts/public-api-axes.json","note":"the legacy axis name; the shim maps the attribute and the property","component":"sf-badge","since":"2026-10-27","remove_after":"2026-12-01"},{"from":"icon-left","to":"icon-start","kind":"setting","section":"§16 item 20","note":"journal attribute-icon-left-right-to-start-end; icon-start wins when both are given","component":"sf-badge","since":"2026-10-27","remove_after":"2026-12-01"},{"from":"icon-right","to":"icon-end","kind":"setting","section":"§16 item 20","note":"journal attribute-icon-left-right-to-start-end; icon-end wins when both are given","component":"sf-badge","since":"2026-10-27","remove_after":"2026-12-01"},{"from":"danger","to":"error","kind":"value","setting":"status","section":"§16 item 20","note":"journal value-status-danger-critical-to-error","component":"sf-badge","since":"2026-10-27","remove_after":"2026-12-01"},{"from":"left","to":"start","kind":"value","setting":"icon-position","section":"§16 item 20","note":"the physical name the template read as start","component":"sf-badge","since":"2026-10-27","remove_after":"2026-12-01"},{"from":"right","to":"end","kind":"value","setting":"icon-position","section":"§16 item 20","note":"the physical name the template read as end","component":"sf-badge","since":"2026-10-27","remove_after":"2026-12-01"}]}');

/***/ },

/***/ "55155acfa4cc"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.badge","tag":"sf-badge","version":"1.1.2","kind":"leaf","settings":{"size":{"type":"enum","values":["1/3","1/2","1"],"default":"1/3"},"line":{"type":"enum","values":["","1/2","1","2"],"default":""},"appearance":{"type":"enum","values":["main","tonal","outline"],"default":"main"},"scheme":{"type":"enum","values":["neutral","primary","secondary","tertiary","on-surface"],"default":"neutral"},"status":{"type":"enum","values":["","info","success","warning","error"],"default":""},"text":{"type":"string","default":""},"icon":{"type":"icon","default":""},"icon-start":{"type":"icon","optional":true},"icon-end":{"type":"icon","optional":true},"icon-position":{"type":"enum","values":["start","end"],"default":"start"}},"values":{},"events":{},"actions":{},"css-variables":{"--sf-badge-background-color":{"type":"color","state":"default"},"--sf-badge-color":{"type":"color","state":"default"},"--sf-badge-border-color":{"type":"color","state":"default"},"--sf-badge-border-width":{"type":"length","state":"default"},"--sf-badge-radius":{"type":"length","state":"default"},"--sf-badge-padding-inline":{"type":"length","state":"default"},"--sf-badge-padding-block":{"type":"length","state":"default"},"--sf-badge-gap":{"type":"length","state":"default"},"--sf-badge-ring-color":{"type":"color","state":"default"}}}');

/***/ },

/***/ "f6a7c3a64b57"
(module) {

module.exports = {"title":"Badges"};

/***/ },

/***/ "94f01354b3f6"
(module) {

module.exports = {"title":"Бейджи"};

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
/******/ 	let __webpack_exports__ = __webpack_require__("d39108e5ef4f");
/******/
/******/ })()
;